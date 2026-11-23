"use client";
import {useEffect,useRef,useState} from 'react';
import {Maximize,RotateCcw,RotateCw,RefreshCw,ExternalLink,ChevronRight,MonitorPlay} from 'lucide-react';
import YoutubePlayer from './youtube-player';
import type {MediaItem} from '@/lib/catalog';
import {getPlaybackSources,youtubeEmbed,type PlaybackSource} from '@/lib/playback';
const stamp=(seconds:number)=>`${Math.floor(seconds/60)}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
export default function MediaPlayer({item,trailer=false}:{item:MediaItem;trailer?:boolean}){
 const sources:PlaybackSource[]=trailer&&item.trailer?[{id:'trailer',label:'官方预告',kind:item.trailer.includes('youtu')?'youtube':'mp4',url:item.trailer}]:getPlaybackSources(item);
 const [sourceIndex,setSourceIndex]=useState(0),[episodeIndex,setEpisodeIndex]=useState(0),[error,setError]=useState(''),[loading,setLoading]=useState(true),[retry,setRetry]=useState(0),[speed,setSpeed]=useState(1),[resume,setResume]=useState(''),[autoNext,setAutoNext]=useState(true),[playStatus,setPlayStatus]=useState('');
 const videoRef=useRef<HTMLVideoElement>(null),lastSaved=useRef(0),fullscreenRef=useRef<HTMLDivElement>(null);
 const source=sources[sourceIndex]||sources[0];const episodes=source?.episodes||[{id:'full',title:trailer?'官方预告':'完整影片',url:source?.url||''}];const episode=episodes[episodeIndex]||episodes[0];
 const key=`mujian-progress:${item.id}:${episode.id}:${trailer?'trailer':'full'}`;
 useEffect(()=>{
  setSourceIndex(0);
  let index=0;
  try {
    const episodeId=localStorage.getItem('mujian-episode:'+item.id);
    index=Math.max(0,(sources[0]?.episodes||[]).findIndex(ep=>ep.id===episodeId));
  } catch {}
  setEpisodeIndex(index);
 },[item.id]);
 function chooseEpisode(index:number){
   const chosen=episodes[index];if(!chosen)return;
   setEpisodeIndex(index);
   try{localStorage.setItem('mujian-episode:'+item.id,chosen.id);}catch{}
 }
 useEffect(()=>{setError('');setLoading(true);setResume('');setPlayStatus('');lastSaved.current=0;if(!source||source.kind==='youtube')return;
  const video=videoRef.current;if(!video)return;let cancelled=false;let hls:{destroy:()=>void}|undefined;
  const start=async()=>{try{if(source.kind==='hls'){
   const {default:Hls}=await import('hls.js');if(cancelled)return;
   if(video.canPlayType('application/vnd.apple.mpegurl')&&(/iP(hone|ad|od)|Macintosh/.test(navigator.userAgent))){video.src=episode.url;}
   else if(Hls.isSupported()){const instance=new Hls({maxBufferLength:30,backBufferLength:30});hls=instance;instance.on(Hls.Events.ERROR,(_,e)=>{if(e.fatal){setLoading(false);setError('该片源无法播放。请重试或更换片源；外部片源需要允许跨站视频访问。');}});instance.loadSource(episode.url);instance.attachMedia(video);}
   else throw new Error('当前浏览器不支持此片源，请使用最新版 Safari 或 Chrome');
  }else video.src=episode.url;void video.play().catch(()=>{});}catch(e){if(!cancelled){setLoading(false);setError(e instanceof Error?e.message:'播放失败');}}};void start();
  const persist=()=>{if(video.currentTime>1&&Number.isFinite(video.duration))try{localStorage.setItem(key,JSON.stringify({position:video.ended?0:video.currentTime,duration:video.duration,updatedAt:Date.now()}));}catch{}};
  window.addEventListener('pagehide',persist);return()=>{cancelled=true;persist();window.removeEventListener('pagehide',persist);hls?.destroy();video.pause();video.removeAttribute('src');video.load();};
 },[item.id,sourceIndex,episodeIndex,episode.url,retry,trailer]);
 function save(){const v=videoRef.current;if(!v||Math.abs(v.currentTime-lastSaved.current)<5)return;lastSaved.current=v.currentTime;try{localStorage.setItem(key,JSON.stringify({position:v.currentTime,duration:Number.isFinite(v.duration)?v.duration:0,updatedAt:Date.now()}));}catch{}}
 function loaded(){setLoading(false);const v=videoRef.current;if(!v)return;v.playbackRate=speed;try{const state=JSON.parse(localStorage.getItem(key)||'null');if(state?.position>5&&state.position<v.duration-15){v.currentTime=state.position;setResume(`已从 ${stamp(state.position)} 继续播放`);}}catch{}}
 function next(){if(episodeIndex<episodes.length-1)chooseEpisode(episodeIndex+1);}
 async function fullscreen(){try{const v=videoRef.current as (HTMLVideoElement&{webkitEnterFullscreen?:()=>void})|null;if(v?.webkitEnterFullscreen)v.webkitEnterFullscreen();else await fullscreenRef.current?.requestFullscreen();}catch{setError('请使用播放器右下角的全屏按钮，或将手机横屏。');}}
 if(!source)return null;
 const isYoutube=source.kind==='youtube';const embed=isYoutube?youtubeEmbed(episode.url):'';
 return <section className="full-player" aria-label={`${item.title}${trailer?'预告':'完整播放'}`}><div className="player-heading"><MonitorPlay size={16}/><strong>{trailer?'官方预告':source.episodes?episode.title:item.type==='movie'?'完整电影':'官方整集'}</strong><span>{source.label}</span></div>
 <div className="player-screen" ref={fullscreenRef}>{isYoutube?embed?<YoutubePlayer key={embed+retry} url={embed} title={`${item.title}官方播放器`} onError={message=>{setLoading(false);setError(message);setPlayStatus('');}} onPlaying={seconds=>{setLoading(false);setError('');setPlayStatus(`正在播放${seconds>0?` · 视频时长 ${stamp(seconds)}`:''}`);}} onEnded={()=>{if(autoNext)next();}}/>:<p>这条官方链接暂不支持嵌入播放。</p>:<video ref={videoRef} controls autoPlay playsInline preload="metadata" poster={item.backdrop||item.poster} onLoadedMetadata={loaded} onCanPlay={()=>setLoading(false)} onWaiting={()=>setLoading(true)} onPlaying={()=>{setLoading(false);setError('');const seconds=videoRef.current?.duration||0;setPlayStatus(Number.isFinite(seconds)&&seconds>0?'正在播放 · '+stamp(seconds):'正在播放');}} onTimeUpdate={save} onEnded={()=>{try{localStorage.removeItem(key);}catch{}if(autoNext)next();}} onError={()=>{setLoading(false);setError('片源加载失败，请重试或更换片源。也可打开原始片源确认当前地区是否可用。');}}/>}
 {!isYoutube&&loading&&!error&&<div className="player-loading" role="status"><RefreshCw size={18} className="spin"/>正在加载完整影片…</div>}</div>
 {playStatus&&<p className="playback-live" role="status">● {playStatus}</p>}{error&&<div className="player-error" role="alert"><p>{error}</p><button onClick={()=>setRetry(x=>x+1)}><RefreshCw size={15}/>重新加载</button>{sources.length>1&&<button onClick={()=>{setSourceIndex(i=>(i+1)%sources.length);setEpisodeIndex(0);}}>切换下一片源</button>}<a href={episode.url} target="_blank" rel="noopener noreferrer">打开原始片源<ExternalLink size={14}/></a></div>}
 <div className="player-tools">{!isYoutube&&<><button onClick={()=>{if(videoRef.current)videoRef.current.currentTime=Math.max(0,videoRef.current.currentTime-10);}}><RotateCcw size={15}/>10秒</button><button onClick={()=>{if(videoRef.current)videoRef.current.currentTime=Math.min(videoRef.current.duration||Infinity,videoRef.current.currentTime+10);}}><RotateCw size={15}/>10秒</button><select aria-label="播放速度" value={speed} onChange={e=>{const rate=Number(e.target.value);setSpeed(rate);if(videoRef.current)videoRef.current.playbackRate=rate;}}>{[.75,1,1.25,1.5,2].map(n=><option key={n} value={n}>{n}×</option>)}</select><button onClick={fullscreen}><Maximize size={15}/>全屏</button></>}{isYoutube&&<span>选集、清晰度、字幕及全屏均在官方播放器内操作</span>}<button onClick={()=>setRetry(x=>x+1)} aria-label="重新加载播放器"><RefreshCw size={14}/></button></div>
 {resume&&!isYoutube&&<div className="resume-note">{resume}<button onClick={()=>{if(videoRef.current)videoRef.current.currentTime=0;setResume('已从头开始');}}>从头开始</button></div>}
 <div className="playback-source-row"><label>播放片源<select aria-label="选择播放片源" value={sourceIndex} onChange={e=>{setSourceIndex(Number(e.target.value));setEpisodeIndex(0);}}>{sources.map((s,i)=><option key={s.id} value={i}>{s.label}</option>)}</select></label><a href={episode.url.startsWith('/')?item.sourceUrl:episode.url} target="_blank" rel="noopener noreferrer">原始片源<ExternalLink size={13}/></a></div>
 {episodes.length>1&&<div className="episode-panel"><div><strong>选集 · {episodes.length}集</strong><label><input type="checkbox" checked={autoNext} onChange={e=>setAutoNext(e.target.checked)}/>自动下一集</label><button onClick={next} disabled={episodeIndex===episodes.length-1}>下一集<ChevronRight size={14}/></button></div><div className="episode-grid">{episodes.map((ep,i)=><button key={ep.id} aria-pressed={i===episodeIndex} className={i===episodeIndex?'selected':''} onClick={()=>chooseEpisode(i)}>{ep.title}</button>)}</div></div>}
 {source.note&&<p className="playback-note">{source.note}</p>}{source.language&&<p className="playback-note">语言：{source.language}</p>}
 </section>;
}
