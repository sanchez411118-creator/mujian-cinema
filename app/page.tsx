"use client";
import {useEffect,useMemo,useRef,useState} from 'react';
import {Film,Compass,Sparkles,Bookmark,RefreshCw,Search,Play,Check,Plus,X,ChevronLeft,ChevronRight,SlidersHorizontal,Star,Radio} from 'lucide-react';
import MediaPlayer from '@/components/media-player';
import type {FeedItem} from '@/lib/movie-websites';
import firstScreen from '@/lib/feed-home.json';
import latestAnimeIds from '@/lib/latest-anime-ids.json';
import breakingBad from '@/lib/breaking-bad.json';

type View='discover'|'movie'|'anime'|'saved';
const nav=[{id:'discover',label:'发现',icon:Compass},{id:'movie',label:'海外电影',icon:Film},{id:'anime',label:'日本动漫',icon:Sparkles},{id:'saved',label:'我的追看',icon:Bookmark}] as const;
const initial=firstScreen as FeedItem[];
const seasons=breakingBad as FeedItem[];
const latestAnime=new Set<string>(latestAnimeIds);
const collectionOptions=[['','全部'],['anime','精选'],['anime-new','本次新增']] as const;
type AnimeCollection=typeof collectionOptions[number][0];
type IndexResult={items:FeedItem[];updatedAt:string;degraded?:boolean};
const fetchJson=async<T=IndexResult,>(path:string,signal?:AbortSignal):Promise<T>=>{
  const response=await fetch('/api/catalog'+path,{signal,cache:'no-store'});
  if(!response.ok)throw Error('暂时无法连接片源，稍后可以重试。');
  return response.json() as Promise<T>;
};
function coverError(e:React.SyntheticEvent<HTMLImageElement>){const image=e.currentTarget;if(!image.src.endsWith('/poster-fallback.svg'))image.src='/poster-fallback.svg';}
export default function Home(){
  const [catalog,setCatalog]=useState<FeedItem[]>(initial),[view,setView]=useState<View>('discover'),[sort,setSort]=useState('popular');
  const [animeCollection,setAnimeCollection]=useState<AnimeCollection>('');
  const [input,setInput]=useState(''),[query,setQuery]=useState(''),[remote,setRemote]=useState<FeedItem[]>([]),[limit,setLimit]=useState(36),[slide,setSlide]=useState(0);
  const [saved,setSaved]=useState<Record<string,FeedItem>>({}),[hydrated,setHydrated]=useState(false);
  const [selected,setSelected]=useState<FeedItem|null>(null),[details,setDetails]=useState<'loading'|'ready'|'error'>('loading');
  const [syncing,setSyncing]=useState(false),[notice,setNotice]=useState(''),[checked,setChecked]=useState(''),[info,setInfo]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null),detailReq=useRef(0),searchReq=useRef(0),syncBusy=useRef(false),searchBox=useRef<HTMLInputElement>(null);
  async function readLibrary(){
    const result=await fetchJson('');
    if(Array.isArray(result.items)&&result.items.length)setCatalog(result.items);
    setChecked(result.updatedAt||'');
    if(result.degraded)setNotice('正在显示上次采集的片库。');
  }
  async function sync(explicit:boolean){
    if(syncBusy.current)return;syncBusy.current=true;setSyncing(true);
    try {
      const result=await fetchJson<{state:string}>('?mode=sync');
      await readLibrary();
      if(explicit)setNotice(result.state==='cached'?'已读取最近一次采集结果。':result.state==='partial'?'部分分类已更新，其余分类下次重试。':'新片和分集已更新。');
    }catch {if(explicit)setNotice('片源站暂未响应，可继续使用已有片库。');}
    finally{syncBusy.current=false;setSyncing(false);}
  }
  useEffect(()=>{
    try{const value=JSON.parse(localStorage.getItem('mujian-following')||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))setSaved(value);}catch{}
    setHydrated(true);void readLibrary().catch(()=>setNotice('暂时只能显示首页推荐，请刷新重试。'));void sync(false);
    function readWatchLink(){
      const params=new URLSearchParams(window.location.search),id=params.get('watch');
      const collection=collectionOptions.find(([key])=>key===params.get('collection'))?.[0]||'';
      setAnimeCollection(collection);
      if(collection)setView('anime');
      const season=seasons.find(s=>s.id===id);
      if(season)void open(season,false);else close(false);
    }
    readWatchLink();
    window.addEventListener('popstate',readWatchLink);
    const timer=setInterval(()=>{if(document.visibilityState==='visible')void sync(false);},30*60_000);
    return ()=>{clearInterval(timer);window.removeEventListener('popstate',readWatchLink);};
  },[]);
  useEffect(()=>{if(hydrated)try{localStorage.setItem('mujian-following',JSON.stringify(saved));}catch{setNotice('此浏览器无法保存追看记录。');}},[saved,hydrated]);
  useEffect(()=>{if(selected||info){dialog.current?.showModal();document.body.style.overflow='hidden';}else{dialog.current?.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[!!selected,info]);
  function close(updateUrl=true){
    ++detailReq.current;setSelected(null);setInfo(false);
    const url=new URL(location.href);
    if(updateUrl && url.searchParams.has('watch')){url.searchParams.delete('watch');history.replaceState(null,'',url);}
  }
  async function open(card:FeedItem,updateUrl=true){
    const season=seasons.find(s=>s.id===card.id);
    if(updateUrl && season){
      const url=new URL(location.href),alreadyOpen=url.searchParams.has('watch');
      url.searchParams.set('watch',season.id);
      if(alreadyOpen)history.replaceState(null,'',url);else history.pushState(null,'',url);
    }
    const request=++detailReq.current;setSelected(season||card);setDetails(season?'ready':'loading');setInfo(false);
    try {
      const work=await fetchJson<FeedItem>('?id='+encodeURIComponent(card.id)+'&latest=1');
      if(request!==detailReq.current)return;
      if(!work?.playback?.length)throw Error();
      setSelected(work);setDetails('ready');
      const {playback,...updated}=work;
      setCatalog(prev=>prev.map(item=>item.id===updated.id?updated:item));
    }catch {if(request===detailReq.current&&!season)setDetails('error');}
  }
  function follow(work:FeedItem){
    const {playback,...card}=work;
    setSaved(previous=>{const next={...previous};if(next[work.id])delete next[work.id];else next[work.id]=card;return next;});
  }
  function showAnimeCollection(collection:AnimeCollection){
    const url=new URL(location.href);
    if(collection)url.searchParams.set('collection',collection);else url.searchParams.delete('collection');
    history.replaceState(null,'',url);setAnimeCollection(collection);setLimit(36);
  }
  function navigate(next:View){showAnimeCollection('');setView(next);setLimit(36);setQuery('');setInput('');setRemote([]);searchReq.current++;window.scrollTo({top:0,behavior:'smooth'});}
  async function search(e:React.FormEvent){
    e.preventDefault();const key=input.trim();setQuery(key);setLimit(36);setRemote([]);const seq=++searchReq.current;
    if(!key||view==='saved')return;
    try {const r=await fetchJson('?q='+encodeURIComponent(key));if(searchReq.current===seq)setRemote(r.items||[]);}catch {if(searchReq.current===seq)setNotice('仅显示片库内的搜索结果。');}
  }
  const cards=useMemo(()=>{
    let list=view==='saved'?Object.values(saved).map(i=>catalog.find(x=>x.id===i.id)||i):catalog;
    if(query){const key=query.toLowerCase();const matches=list.filter(x=>(x.title+' '+x.originalTitle).toLowerCase().includes(key));list=view==='saved'?matches:[...new Map([...matches,...remote].map(x=>[x.id,x])).values()];}
    if(view==='movie'||view==='anime')list=list.filter(x=>x.type===view);
    if(view==='anime'&&animeCollection)list=list.filter(x=>animeCollection==='anime-new'?latestAnime.has(x.id):x.id.startsWith('md-'));
    return [...list].sort((a,b)=>sort==='update'?b.sourceTime.localeCompare(a.sourceTime):sort==='rating'?(b.rating||0)-(a.rating||0):b.popularity-a.popularity);
  },[catalog,view,saved,query,remote,sort,animeCollection]);
  const heroes=useMemo(()=>{const films=catalog.filter(x=>x.type==='movie'),anime=catalog.filter(x=>x.type==='anime');return [films[0],anime[0],films[1]].filter(Boolean);},[catalog]);
  const hero=heroes[slide%heroes.length],home=view==='discover'&&!query;
  const navButtons=nav.map(({id,label,icon:Icon})=><button key={id} className={'nav-item '+(view===id?'active':'')} aria-current={view===id?'page':undefined} onClick={()=>navigate(id)}><Icon size={20}/><span>{label}</span></button>);
  return <div className="app-shell"><aside className="sidebar"><a href="#" className="brand" onClick={e=>{e.preventDefault();navigate('discover');}}><span className="brand-mark"><Film/></span><span>幕间<small>MUJIAN</small></span></a><div className="nav-label">片库</div><nav>{navButtons}</nav><div className="sidebar-divider"/><button className="nav-item" onClick={()=>setInfo(true)}><Radio size={19}/>片源与更新</button></aside>
  <div className="workspace"><header className="topbar"><div className="topbar-label"><span className="mobile-logo">幕间</span><span className="desktop-greeting">幕间放映室</span></div><form className="searchbar" onSubmit={search}><Search size={17}/><input ref={searchBox} aria-label="搜索片名" placeholder="搜索片名或 Breaking Bad" maxLength={80} value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" className="search-submit">搜索</button></form><button className="topbar-save" onClick={()=>setInfo(true)} aria-label="查看片源与更新时间"><Radio size={18}/></button></header>
  <main>{home&&hero&&<section className="hero" aria-label="片源站热门推荐"><img className="hero-image" src={hero.poster} onError={coverError} alt=""/><div className="hero-shade"/><div className="hero-top"><span className="hero-pick"><Film size={14}/> 热门放映</span></div><div className="hero-content"><h2>{hero.title}</h2><div className="hero-meta"><span>{hero.year}</span><span>·</span><span>{hero.area}</span><span>·</span><span>{hero.genres.join(' / ')}</span></div><p>{hero.overview}</p><div className="hero-actions"><button className="button primary" onClick={()=>open(hero)}><Play size={16} fill="currentColor"/>播放{hero.type==='anime'?'整集':'正片'}</button><button className="button glass" onClick={()=>follow(hero)}>{saved[hero.id]?<Check size={16}/>:<Plus size={16}/>} {saved[hero.id]?'已追看':'加入追看'}</button></div></div><div className="hero-bottom"><span/><div className="hero-controls"><button aria-label="上一部推荐" onClick={()=>setSlide((slide+heroes.length-1)%heroes.length)}><ChevronLeft/></button><button aria-label="下一部推荐" onClick={()=>setSlide((slide+1)%heroes.length)}><ChevronRight/></button></div></div></section>}
  {home&&<a className="series-feature" href={'?watch='+seasons[0].id} onClick={e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();void open(seasons[0]);}}><span><strong>绝命毒师</strong><small>Breaking Bad · 全 5 季 · 62 集</small></span><span className="series-feature-action"><Play size={16} fill="currentColor"/>选季播放</span></a>}
  <section className="catalog-section"><div className="section-heading"><div className="section-title"><span className="title-accent"/><h2>{query?'搜索结果':animeCollection==='anime-new'?'本次新增动漫':animeCollection==='anime'?'精选日本动漫':nav.find(v=>v.id===view)?.label==='发现'?'正在热播':nav.find(v=>v.id===view)?.label}</h2><span className="count">{cards.length}</span></div><button className="text-button" disabled={syncing} onClick={()=>sync(true)}><RefreshCw size={15} className={syncing?'spin':''}/>{syncing?'同步中':'更新片库'}</button></div>
  {view==='anime'&&<div className="era-filter" role="group" aria-label="动漫片单">{collectionOptions.map(([key,label])=><button key={key} className={animeCollection===key?'selected':''} aria-pressed={animeCollection===key} onClick={()=>showAnimeCollection(key)}>{label}</button>)}</div>}
  <div className="catalog-options"><div className="era-filter">{[['popular','片源热度'],['update','最近更新'],['rating','评分优先']].map(([key,label])=><button key={key} className={sort===key?'selected':''} onClick={()=>{setSort(key);setLimit(36);}}>{label}</button>)}</div><button className="text-button" onClick={()=>setInfo(true)}><SlidersHorizontal size={14}/>片库信息</button></div>
  {notice&&<p className="inline-notice" role="status">{notice}<button onClick={()=>setNotice('')}>关闭</button></p>}
  <div className="poster-grid">{cards.slice(0,limit).map(item=><article key={item.id} className="poster-card"><div className="poster-wrap"><button className="poster-open" onClick={()=>open(item)} aria-label={'查看'+item.title}><img src={item.poster} loading="lazy" alt={item.title} onError={coverError}/><div className="poster-gradient"/><span className="poster-play"><Play size={23} fill="currentColor"/></span></button>{item.rating!==null&&<span className="poster-rating"><Star size={10} fill="currentColor"/>{item.rating.toFixed(1)}</span>}<span className="poster-type">{item.type==='series'?'美剧':item.type==='anime'?'动漫':'电影'}</span><button className="poster-save" aria-label={(saved[item.id]?'取消追看':'追看')+item.title} onClick={()=>follow(item)}>{saved[item.id]?<Check size={16}/>:<Plus size={16}/>}</button></div><button className="poster-title" onClick={()=>open(item)}>{item.title}</button><div className="poster-subtitle">{item.year||''} · {item.type!=='movie'?item.episodeCount+' 集':item.area}</div></article>)}</div>
  {!cards.length&&<p className="section-description">{view==='saved'?'点影片上的加号，即可在这里追看。':'没有找到符合条件的作品。'}</p>}{cards.length>limit&&<button className="button secondary load-more" onClick={()=>setLimit(n=>n+36)}>继续浏览 · 还有 {cards.length-limit} 部</button>}</section></main></div>
  <nav className="mobile-nav" aria-label="手机导航">{navButtons}</nav>
  <dialog ref={dialog} className="detail-dialog" aria-label={info?'片源与更新':selected?.title} onCancel={()=>close()} onClick={e=>{if(e.target===dialog.current)close();}}><button className="dialog-close" aria-label="关闭详情" onClick={()=>close()}><X size={20}/></button>
  {info?<div className="source-content"><h2>片源与更新</h2><p>自动采集海外电影、日本动漫和《绝命毒师》五季的正片与分集播放地址。按片源站提供的出品地区筛选，含中国合拍或地区不明的作品会跳过。</p><p>热度来自片源站的播放计数。连载作品只显示来源已发布的集数。播放取决于你所在网络能否连接片源。</p>{checked&&<p>片库更新时间 {new Date(checked).toLocaleString('zh-CN')}</p>}<button className="button primary" onClick={()=>sync(true)} disabled={syncing}><RefreshCw size={16}/>更新片库</button></div>:selected&&<div className="detail-content">{selected.type==='series'&&<div className="season-picker"><h2>绝命毒师</h2><div role="group" aria-label="选择季">{seasons.map((season,i)=><button key={season.id} aria-pressed={season.id===selected.id} onClick={()=>{if(season.id!==selected.id)void open(season);}}>第{i+1}季</button>)}</div></div>}{details==='ready'?<MediaPlayer key={selected.id} item={selected}/>:<div className="film-wait" role="status">{details==='loading'?'正在读取正片和分集…':<><p>暂未取得这部作品的播放地址。</p><button className="button secondary" onClick={()=>open(selected)}>重新读取</button></>}</div>}<div className="detail-body"><img className="detail-poster" src={selected.poster} alt="" onError={coverError}/><div className="detail-info"><h2>{selected.title}</h2><p>{selected.area} · {selected.year} · {selected.type!=='movie'?selected.episodeCount+' 集':selected.genres.join(' / ')}</p><p>{selected.status}</p></div>{selected.overview&&<p className="detail-overview">{selected.overview}</p>}<div className="detail-actions"><button className="button secondary" onClick={()=>follow(selected)}>{saved[selected.id]?<Check size={15}/>:<Plus size={15}/>} {saved[selected.id]?'已追看':'加入追看'}</button></div></div></div>}</dialog></div>;
}
