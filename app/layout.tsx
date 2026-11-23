import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"幕间 MUJIAN — 电影与动漫，另一个世界",description:"发现值得一看的电影与动漫。实时搜索公开影视资料，收藏私人片单，观看官方预告与开放电影。",manifest:"/manifest.webmanifest",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#101114"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>;}
