import {readdir,readFile,writeFile} from 'node:fs/promises';
import {parseWork,summary} from '../lib/movie-websites.ts';
const directory=process.argv[2];
if(!directory) throw Error('Pass a directory of downloaded film feed pages');
const movies=new Map();
for(const file of await readdir(directory)) {
  if(!file.endsWith('.json'))continue;
  for(const row of JSON.parse(await readFile(directory+'/'+file,'utf8')).list) {
    const work=parseWork(row);
    if(work) movies.set(work.id,work);
  }
}
const items=[...movies.values()].sort((a,b)=>b.popularity-a.popularity);
if(!items.some(x=>x.type==='anime')||!items.some(x=>x.type==='movie'))throw Error('No usable film or anime data');
await writeFile('lib/feed-snapshot.json',JSON.stringify({at:new Date().toISOString(),items}));
await writeFile('lib/feed-home.json',JSON.stringify(items.slice(0,24).map(summary)));
console.log({films:items.filter(i=>i.type==='movie').length,anime:items.filter(i=>i.type==='anime').length,episodeLinks:items.reduce((n,i)=>n+i.episodeCount,0),examples:items.slice(0,5).map(i=>i.title)});