import type { MediaItem } from './catalog';
import type { Episode } from './playback';

export const feedUrl = 'https://bfzyapi.com/api.php/provide/vod/';
export const seriesFeedUrl = 'https://www.mdzyapi.com/api.php/provide/vod/';
export const sections = [21, 22, 23, 24, 25, 26, 27, 41, 50];
export const breakingBadSeasons = [
  {id:17742, sourceId:12430, title:'绝命毒师第一季', count:7},
  {id:17738, sourceId:12426, title:'绝命毒师第二季', count:13},
  {id:17739, sourceId:12427, title:'绝命毒师第三季', count:13},
  {id:17740, sourceId:12428, title:'绝命毒师第四季', count:13},
  {id:17741, sourceId:12429, title:'绝命毒师第五季', count:16},
];
const filmTypes = new Set(['动作片','喜剧片','恐怖片','科幻片','爱情片','剧情片','战争片']);
const origins = new Set('美国 日本 韩国 英国 加拿大 法国 德国 俄罗斯 澳大利亚 西班牙 意大利 新西兰 泰国 印度 巴西 丹麦 挪威 瑞典 芬兰 比利时 荷兰 瑞士 奥地利 爱尔兰 冰岛 罗马尼亚 希腊 匈牙利 波兰 捷克 斯洛伐克 斯洛文尼亚 爱沙尼亚 土耳其 埃及 南非 墨西哥 阿根廷 智利 哥伦比亚 菲律宾 越南 印度尼西亚 印尼 马来西亚 新加坡 巴基斯坦 伊朗 以色列 保加利亚 葡萄牙 乌克兰 沙特阿拉伯 阿联酋 卡塔尔 卢森堡 塞尔维亚 柬埔寨 克罗地亚 苏联 法罗群岛'.split(' '));
export type FeedItem = MediaItem & {area:string; popularity:number; sourceTime:string; episodeCount:number};
export type FeedRow = Record<string, unknown>;
const clean = (v:unknown) => String(v ?? '').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&amp;/g,' ').replace(/\s+/g,' ').trim();
function httpsLink(raw:string):string {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && /^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname) && !u.hostname.endsWith('.local') && !u.port && !u.username && !u.password ? u.href : '';
  } catch { return ''; }
}
const clips = /预告|先导|花絮|解说|试看|片段|枪版|抢先版|(?:^|[^A-Z])TC(?:[^A-Z]|$)|trailer|teaser/i;
export function parseWork(row:FeedRow):FeedItem | null {
  return parseItem(row,false);
}
export function parseSeries(row:FeedRow):FeedItem | null {
  return parseItem(row,true);
}
function parseItem(row:FeedRow, seriesFeed:boolean):FeedItem | null {
  const section=clean(row.type_name), anime=['日韩动漫','动画片'].includes(section);
  const countries=clean(row.vod_area).split(/[\s,，、/|；;]+/).filter(Boolean).map(c=>c==='USA'?'美国':c);
  const title=clean(row.vod_name), status=clean(row.vod_remarks), id=Number(row.vod_id);
  const season=seriesFeed && section==='欧美剧' && countries.includes('美国')
    ? breakingBadSeasons.find(s=>s.sourceId===id && s.title===title) : undefined;
  if(seriesFeed && !season)return null;
  if ((!season && !anime && !filmTypes.has(section)) || !countries.length || !countries.every(c=>origins.has(c)) || (anime && !countries.includes('日本'))) return null;
  if (!Number.isSafeInteger(id) || id<1 || !title || clips.test(title+' '+status) || clean(row.vod_pwd_play) || Number(row.vod_trysee)>0 || Number(row.vod_points_play)>0) return null;
  const sources=String(row.vod_play_from || '').split('$$$');
  const slot=sources.indexOf(season?'modum3u8':'bfzym3u8');
  const group=String(row.vod_play_url || '').split('$$$')[slot];
  if (!group) return null;
  const episodes:Episode[]=[];
  const seen=new Set<string>();
  for (const entry of group.split('#')) {
    const split=entry.indexOf('$'); if(split<1) continue;
    const name=clean(entry.slice(0,split)), url=httpsLink(entry.slice(split+1));
    if (!url || !/\.m3u8$/i.test(new URL(url).pathname) || clips.test(name) || seen.has(name)) continue;
    seen.add(name); episodes.push({id:name,title:name,url});
  }
  if (!episodes.length) return null;
  const numbers=episodes.map(ep=>ep.title.match(/^第?\s*(\d+(?:\.\d+)?)\s*[集话話]?$/)?.[1]);
  if(numbers.every(n=>n!==undefined)) episodes.sort((a,b)=>Number(a.title.match(/[\d.]+/)?.[0])-Number(b.title.match(/[\d.]+/)?.[0]));
  if(season && (episodes.length!==season.count || new Set(episodes.map(e=>e.url)).size!==season.count ||
    episodes.some((ep,i)=>Number(ep.title.match(/^第(\d+)集$/)?.[1])!==i+1))) return null;
  const rating=Number(row.vod_douban_score), area=countries.join(' / ');
  return {id:'bf-'+(season?.id??id),title,originalTitle:season?'Breaking Bad · Season '+(breakingBadSeasons.indexOf(season)+1):clean(row.vod_sub).slice(0,110),type:season?'series':anime?'anime':'movie',
    year:parseInt(clean(row.vod_year),10)||0,rating:rating>0&&rating<=10?rating:null,
    genres:[season?'美剧':anime?'日本动漫':section.replace(/片$/,'')],overview:clean(row.vod_content || row.vod_blurb).slice(0,480),
    poster:httpsLink(clean(row.vod_pic)) || '/poster-fallback.svg',source:season?'魔都资源':'暴风资源',sourceUrl:(season?seriesFeedUrl:feedUrl)+'?ac=detail&ids='+id,
    status,area,popularity:Math.max(0,Number(row.vod_hits)||0),sourceTime:clean(row.vod_time),episodeCount:episodes.length,
    playback:[{id:season?'md-hls':'bf-hls',label:season?'魔都 · 原始片源':'暴风 · 原始片源',kind:'hls',url:episodes[0].url,episodes}]};
}
export function summary(item:FeedItem):FeedItem {
  const {playback,...card}=item;return card;
}
export async function readFeed(params:Record<string,string>,site=feedUrl):Promise<{list:FeedRow[];pagecount:number}> {
  const url=new URL(site);url.search=new URLSearchParams({ac:'detail',...params}).toString();
  const response=await fetch(url,{signal:AbortSignal.timeout(8000),headers:{Accept:'application/json'}});
  if(!response.ok) throw new Error('片源站连接失败');
  const data=await response.json() as {code:number;list:FeedRow[];pagecount:number};
  if(Number(data.code)!==1 || !Array.isArray(data.list)) throw new Error('片源站返回了无效目录');
  return {list:data.list,pagecount:Number(data.pagecount)||1};
}
