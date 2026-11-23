// Blender Studio open movies. Keep their stable download-source paths here;
// the signed /files/ URL is refreshed per playback and never stored in source.
const openMovies: Record<string, string> = {
  sintel: "https://studio.blender.org/download-source/files/47/47a954682dbd4f064da7e78ad6c2d32f044a3e85/47a954682dbd4f064da7e78ad6c2d32f044a3e85.mp4",
  "tears-of-steel": "https://studio.blender.org/download-source/files/0d/0d4beb382f57cec10fa3e54c13c5c02e24e53f02/0d4beb382f57cec10fa3e54c13c5c02e24e53f02.mp4",
};

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  const source = Object.hasOwn(openMovies, id) ? openMovies[id] : undefined;
  if (!source) return Response.json({ error: "没有这部开放电影" }, { status: 404 });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // The official download service signs GET requests; HEAD isn't supported.
    const upstream = await fetch(source, {
      method: "GET", redirect: "manual", signal: controller.signal,
      headers: { Range: "bytes=0-0" },
    });
    const location = upstream.headers.get("location");
    await upstream.body?.cancel();
    if (![301, 302, 303, 307, 308].includes(upstream.status) || !location) {
      throw new Error("Open movie source did not return a playback address");
    }
    const video = new URL(location, source);
    if (video.protocol !== "https:" || video.hostname !== "studio.blender.org" ||
        !video.pathname.startsWith("/files/") || !video.pathname.endsWith(".mp4")) {
      throw new Error("Unexpected open movie destination");
    }
    return new Response(null, {
      status: 302,
      headers: { Location: video.href, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return Response.json({ error: "影片源暂时无法连接，请稍后重试或前往 Blender Studio 观看" },
      { status: 502, headers: { "Cache-Control": "no-store" } });
  } finally { clearTimeout(timeout); }
}
