import {env} from 'cloudflare:workers';
import catalog from './feed-snapshot.json';
import breakingBad from './breaking-bad.json';
import animePicks from './anime-picks.json';
import {breakingBadSeasons,parseAnime,parseSeries,seriesFeedUrl,parseWork,readFeed,sections,summary, type FeedItem, type FeedRow} from './movie-websites';
const initial=[...catalog.items,...breakingBad,...animePicks] as FeedItem[];
const initialById=new Map(initial.map(work=>[work.id,work]));
const refreshMs=30*60*1000;
// Keep requested series in every refresh even before the rolling category
// backfill reaches their older source pages.
const featuredSeriesIds=['120468','114818','120034','112408','165238'];
type State={checked:number;cursors:string;lease:number};
type Stored={id:string;summary:string | null};
function database() { if(!env.DB)throw new Error('片库数据库未连接');return env.DB; }
function canonical(items:FeedItem[]) {
  const unique=new Map<string, FeedItem>();
  for(const item of items.sort((a,b)=>b.popularity-a.popularity)) {
    const key=[item.type,item.title,item.year,item.area].join('|');
    if(!unique.has(key) || (item.id.startsWith('md-') && !unique.get(key)!.id.startsWith('md-')))unique.set(key,item);
  }
  return Array.from(unique.values());
}
export async function readIndex() {
  const items=new Map(initial.map(item=>[item.id,summary(item)]));
  let updatedAt=catalog.at;
  try {
    const db=database();
    const [rows,state]=await Promise.all([db.prepare('SELECT id,summary FROM film_works').all<Stored>(),db.prepare("SELECT checked FROM film_crawl WHERE id='index'").first<State>()]);
    for(const row of rows.results) { if(row.summary)items.set(row.id,JSON.parse(row.summary));else items.delete(row.id); }
    if(state?.checked) updatedAt=new Date(state.checked).toISOString();
  } catch { return {items:canonical([...items.values()]),updatedAt,degraded:true}; }
  return {items:canonical([...items.values()]),updatedAt,degraded:false};
}
export async function loadWork(id:string, renew:boolean) {
  const anime=id.startsWith('md-');
  if(!/^(bf|md)-\d{1,9}$/.test(id) || (anime && !initialById.has(id)))return null;
  if(renew)try {
    const season=breakingBadSeasons.find(s=>'bf-'+s.id===id);
    const sourceId=season?String(season.sourceId):id.slice(3);
    const {list}=await readFeed({ids:sourceId},season||anime?seriesFeedUrl:undefined);
    const row=list.find(row=>String(row.vod_id)===sourceId);
    return row?(season?parseSeries(row):anime?parseAnime(row):parseWork(row)):null;
  } catch { /* Continue with the last complete record if the source is offline. */ }
  try {
    const row=await database().prepare('SELECT payload FROM film_works WHERE id=?').bind(id).first<{payload:string|null}>();
    if(row)return row.payload?JSON.parse(row.payload) as FeedItem:null;
  } catch {}
  const cached=initialById.get(id);if(cached)return cached;
  if(!renew) return loadWork(id,true);
  return null;
}
export async function searchFeed(keyword:string) {
  const local=await readIndex();
  const key=keyword.trim().toLowerCase();
  const matches=local.items.filter(x=>(x.title+' '+x.originalTitle).toLowerCase().includes(key));
  try {
    const remote=await readFeed({wd:keyword,pg:'1'});
    const items=remote.list.map(parseWork).filter((x):x is FeedItem=>!!x).map(summary);
    return {...local,items:canonical([...items,...matches])};
  } catch { return {...local,items:matches,degraded:true}; }
}
export async function refreshIndex() {
  const db=database(),now=Date.now();
  await db.prepare("INSERT OR IGNORE INTO film_crawl(id,lease,checked,cursors) VALUES('index',0,0,'{}')").run();
  const expires=now+120_000;
  const won=await db.prepare("UPDATE film_crawl SET lease=? WHERE id='index' AND lease<? AND checked<?").bind(expires,now,now-refreshMs).run();
  if(!won.meta.changes) return {state:'cached',...(await statusOnly())};
  const state=await db.prepare("SELECT checked,cursors FROM film_crawl WHERE id='index'").first<State>();
  const cursors:Record<string,number>=JSON.parse(state?.cursors||'{}');
  let pages=0,failures=0;
  const records=new Map<string,FeedRow>();
  try {
    try {
      const featured=await readFeed({ids:featuredSeriesIds.join(',')});
      pages++;
      for(const row of featured.list)records.set(String(row.vod_id),row);
    } catch { failures++; }
    // Scan the head of every category for changes and advance a durable backfill cursor.
    for(let offset=0;offset<sections.length;offset+=3) {
      await Promise.all(sections.slice(offset,offset+3).map(async section=>{
        const next=cursors[section]||4;
        const scans=await Promise.allSettled([1,next].map(pg=>readFeed({t:String(section),pg:String(pg)})));
        scans.forEach((result,position)=>{
          if(result.status==='rejected'){failures++;return;}
          pages++;
          for(const row of result.value.list) {
            const key=String(row.vod_id);
            if(!records.has(key)||String(records.get(key)!.vod_time)<String(row.vod_time))records.set(key,row);
          }
          if(position===1)cursors[section]=next>=result.value.pagecount?2:next+1;
        });
      }));
    }
    if(!pages || !records.size)throw new Error('片源站暂时无法更新，已保留现有片库');
    const sql=db.prepare('INSERT INTO film_works(id,payload,summary,source_time) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,summary=excluded.summary,source_time=excluded.source_time WHERE excluded.source_time>=film_works.source_time');
    const writes=[];
    let accepted=0;
    try {
      const {list}=await readFeed({ids:breakingBadSeasons.map(s=>s.sourceId).join(',')},seriesFeedUrl);
      const seasons=list.map(parseSeries).filter((item):item is FeedItem=>!!item);
      if(seasons.length!==breakingBadSeasons.length)failures++;
      for(const item of seasons){
        writes.push(sql.bind(item.id,JSON.stringify(item),JSON.stringify(summary(item)),item.sourceTime));
      }
      pages++;accepted+=seasons.length;
    } catch { failures++; }
    // The provider returns at most 20 works per page.
    for(let start=0;start<animePicks.length;start+=20){
      const ids=animePicks.slice(start,start+20).map(a=>a.id.slice(3));
      try {
        const {list}=await readFeed({ids:ids.join(',')},seriesFeedUrl);
        pages++;
        for(const row of list){
          if(!ids.includes(String(row.vod_id)))continue;
          const item=parseAnime(row);
          if(item){
            writes.push(sql.bind(item.id,JSON.stringify(item),JSON.stringify(summary(item)),item.sourceTime));
            accepted++;
          }
        }
      } catch { failures++; }
    }
    for(const row of records.values()) {
      if(!/^\d+$/.test(String(row.vod_id)))continue;
      const item=parseWork(row);
      if(item)accepted++;
      writes.push(sql.bind('bf-'+row.vod_id,item?JSON.stringify(item):null,item?JSON.stringify(summary(item)):null,String(row.vod_time||'')));
    }
    for(let i=0;i<writes.length;i+=35) await db.batch(writes.slice(i,i+35));
    await db.prepare("UPDATE film_crawl SET lease=0,checked=?,cursors=? WHERE id='index' AND lease=?").bind(now,JSON.stringify(cursors),expires).run();
    return {state:failures?'partial':'updated',pages,failures,accepted,updatedAt:new Date(now).toISOString()};
  } catch(error) {
    await db.prepare("UPDATE film_crawl SET lease=? WHERE id='index' AND lease=?").bind(Date.now()+60_000,expires).run();throw error;
  }
}
export async function statusOnly(){
  const result=await database().prepare("SELECT checked,cursors AS cursorPages FROM film_crawl WHERE id='index'").first<{checked:number;cursorPages:string}>();
  return {updatedAt:result?.checked?new Date(result.checked).toISOString():null,cursors:JSON.parse(result?.cursorPages||'{}')};
}
