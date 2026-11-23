import {loadWork,readIndex,refreshIndex,searchFeed,statusOnly} from '@/lib/crawler';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
  const params=new URL(request.url).searchParams,mode=params.get('mode'),id=params.get('id')||'',q=(params.get('q')||'').trim();
  try {
    if(mode==='sync')return Response.json(await refreshIndex(),{headers:{'Cache-Control':'no-store'}});
    if(mode==='status')return Response.json(await statusOnly(),{headers:{'Cache-Control':'no-store'}});
    if(id) {
      const work=await loadWork(id,params.get('latest')==='1');
      return Response.json(work,{status:work?200:404,headers:{'Cache-Control':'private, max-age=30'}});
    }
    if(q.length>80)return Response.json({error:'搜索词过长'},{status:400});
    return Response.json(q?await searchFeed(q):await readIndex(),{headers:{'Cache-Control':'public, max-age=30','X-Content-Type-Options':'nosniff'}});
  } catch {return Response.json({error:'片源站或片库暂不可用，已保留上次结果。'},{status:503});}
}