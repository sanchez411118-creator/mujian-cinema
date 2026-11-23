"use client";
import {useEffect,useRef} from 'react';
type YTPlayer={destroy:()=>void;getDuration:()=>number};
type YTApi={Player:new(iframe:HTMLIFrameElement,options:{events:{onReady:()=>void;onStateChange:(event:{data:number;target:YTPlayer})=>void;onError:(event:{data:number})=>void}})=>YTPlayer};
let apiPromise:Promise<YTApi>|null=null;
function loadApi(){
 if(apiPromise)return apiPromise;
 apiPromise=new Promise<YTApi>((resolve,reject)=>{
  let ticks=0;const timer=setInterval(()=>{const api=(window as Window&{YT?:YTApi}).YT;if(api?.Player){clearInterval(timer);resolve(api);}else if(++ticks>150){clearInterval(timer);apiPromise=null;reject(new Error('unavailable'));}},100);
  if(!document.querySelector('script[data-mujian-youtube]')){const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.dataset.mujianYoutube='true';script.onerror=()=>{clearInterval(timer);script.remove();apiPromise=null;reject(new Error('unavailable'));};document.head.appendChild(script);}
 });return apiPromise;
}
export default function YoutubePlayer({url,title,onError,onPlaying,onEnded}:{url:string;title:string;onError:(message:string)=>void;onPlaying:(seconds:number)=>void;onEnded:()=>void}){
 const host=useRef<HTMLDivElement>(null);const callbacks=useRef({onError,onPlaying,onEnded});callbacks.current={onError,onPlaying,onEnded};
 useEffect(()=>{const container=host.current;if(!container)return;let disposed=false;let player:YTPlayer|undefined;
  const iframe=document.createElement('iframe');const src=new URL(url);src.searchParams.set('enablejsapi','1');iframe.src=src.href;iframe.title=title;iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';container.appendChild(iframe);
  void loadApi().then(api=>{if(disposed)return;player=new api.Player(iframe,{events:{onReady:()=>{},onStateChange:e=>{if(disposed)return;if(e.data===1)callbacks.current.onPlaying(e.target.getDuration());if(e.data===0)callbacks.current.onEnded();},onError:e=>{if(disposed)return;const messages:Record<number,string>={100:'这条视频已下架或设为私密，请切换片源。',101:'来源平台限制了站内播放，请打开原始片源。',150:'来源平台限制了站内播放、地区或年龄验证，请打开原始片源查看要求。',153:'来源平台未接受当前浏览器，请在 Safari 或 Chrome 中打开本站重试。',5:'当前浏览器无法播放此视频，请重试或换用 Safari / Chrome。'};callbacks.current.onError(messages[e.data]||'当前网络或地区无法播放此片源，请切换片源，或打开原始片源查看要求。');}}});}).catch(()=>{/* The ordinary official iframe remains usable if the optional API cannot load. */});
  return()=>{disposed=true;player?.destroy();container.replaceChildren();};
 },[url,title]);
 return <div className="youtube-host" ref={host}/>;
}
