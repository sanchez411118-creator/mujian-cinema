import type { MediaItem } from './catalog';
import data from './playback-data.json';
export type Episode = { id:string; title:string; url:string };
export type PlaybackSource = { id:string; label:string; kind:'mp4'|'hls'|'youtube'; url:string; language?:string; note?:string; license?:string; episodes?:Episode[]; access?:'regional'|'membership'|'external'; verified?:boolean };
export const fullMovies = data.movies as MediaItem[];
const registry = data.sources as Record<string,PlaybackSource[]>;
export function getPlaybackSources(item:MediaItem):PlaybackSource[]{
 if(item.playback?.length)return item.playback;
 if(registry[item.id])return registry[item.id];
 if(item.fullVideo)return [{id:'blender',label:'Blender 官方完整影片',kind:'mp4',url:item.fullVideo,language:'原版',note:'© Blender Foundation / Blender Studio · CC BY'}];
 if(item.id==='open-big-buck-bunny')return [{id:'blender-youtube',label:'Blender 官方完整影片',kind:'youtube',url:item.watchUrl!,note:'通过官方 YouTube 播放器观看完整影片。'}];
 return [];
}
export const hasFull=(item:MediaItem)=>getPlaybackSources(item).length>0;
export function playbackBadge(item:MediaItem){const sources=getPlaybackSources(item);if(sources.every(s=>s.access==='external'))return '需在原平台观看';if(sources.every(s=>s.access==='membership'))return '整集 · 会员';if(item.type==='anime'&&sources.some(s=>s.kind==='youtube')&&!item.id.startsWith('open-'))return '整集 · 限区';return sources.some(s=>s.verified)?'正片 · 已实测':'完整正片';}
export function safeMediaUrl(raw:string){try{const u=new URL(raw.trim());if(u.protocol!=='https:'||u.username||u.password)throw new Error();if(/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[::1\])/.test(u.hostname))throw new Error();return u.href;}catch{throw new Error('请使用有效的 HTTPS 视频或官方播放链接');}}
export function mediaKind(url:string):PlaybackSource['kind']{const u=new URL(url);return /(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$|^youtu\.be$/.test(u.hostname)?'youtube':/\.m3u8(?:$|\?)/i.test(url)?'hls':'mp4';}
export function youtubeEmbed(raw:string){try{const u=new URL(raw);if(!/(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$|^youtu\.be$/.test(u.hostname))return '';const list=u.searchParams.get('list');const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.match(/\/embed\/([\w-]+)/)?.[1];const params=new URLSearchParams({playsinline:'1',rel:'0',autoplay:'1',cc_load_policy:'1',hl:'zh-CN'});if(list&&/^[\w-]+$/.test(list)){params.set('list',list);params.set('listType','playlist');}if(typeof window!=='undefined')params.set('origin',window.location.origin);if(!list&&(!id||!/^[\w-]{11}$/.test(id)))return '';return `https://www.youtube.com/embed/${id||'videoseries'}?${params}`;}catch{return '';}}
