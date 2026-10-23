import fs from 'node:fs';import {execFileSync} from 'node:child_process';
import {loadPrecomputedGrass,takePrecomputedGrassPlan} from '../../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
const root=new URL('../../../',import.meta.url),base='c64e78d5a05711f0b2ec7e98fb400c65d8e430df',asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:120*1024*1024});
const source=git('showroom/globe/h-earth/render/precomputed-grass.v1.js').toString().replaceAll("'./precomputed-oasis-soil.v1.js'",JSON.stringify(new URL('showroom/globe/h-earth/render/precomputed-oasis-soil.v1.js',root).href)).replaceAll("'./grass-continuity-supplement.v1.js'",JSON.stringify(new URL('showroom/globe/h-earth/render/grass-continuity-supplement.v1.js',root).href)).replaceAll('import.meta.url',JSON.stringify(new URL('showroom/globe/h-earth/render/precomputed-grass.v1.js',root).href));
const old=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const result={schema:'HILLSIDE_LOADER_COMPARISON_v1',scope:'Node CPU load and packed plan; local bytes, no network, browser scheduling or GPU execution',baseline:base,runs:[]};
for(const [name,load,take,json,gzip]of [['baseline',old.loadPrecomputedGrass,old.takePrecomputedGrassPlan,git(asset+'json'),git(asset+'bin.gz')],['candidate',loadPrecomputedGrass,takePrecomputedGrassPlan,fs.readFileSync(new URL(asset+'json',root)),fs.readFileSync(new URL(asset+'bin.gz',root))]]){
 const start=performance.now(),p=await load({packed:true,fetchImpl:async u=>new Response(u.pathname.endsWith('.json')?json:gzip)}),plan=take(p);
 result.runs.push({name,milliseconds:performance.now()-start,rootCount:plan.tiles.reduce((a,t)=>a+t.count,0),packedBytes:plan.tiles.reduce((a,t)=>a+t.packed.byteLength,0),compressedBytes:gzip.length,phaseMilliseconds:p.receipt.precomputedLoading??null});
}
fs.writeFileSync(new URL('./loader-comparison.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
