import './h-earth.gratitude-startup.v1.test.mjs';
import test from 'node:test';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {loadPrecomputedOasisSoil} from '../../showroom/globe/h-earth/render/precomputed-oasis-soil.v1.js';
import {loadPrecomputedGrass,takePrecomputedGrassPlan} from '../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
import {applyHEarthVerifiedPlantingPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {createHEarthLoadingScreen} from '../../showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8'),hash=x=>createHash('sha256').update(x).digest('hex');
const renderer=read('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
const raw=JSON.parse(gunzipSync(readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root)))).raw;
const pkg=applyHEarthVerifiedPlantingPackage(raw),fetchImpl=async url=>new Response(readFileSync(url));
test('authenticated mask equals pinned pixels and complete summary; exact runtime input binding',async()=>{
 const started=performance.now(),mask=await loadPrecomputedOasisSoil(pkg,{fetchImpl});
 assert.equal(hash(mask.pixels),'a2478a8d53201408f41341a95cb71fe32998c66fe247969ffb4c2cadc9cd8d46');
 const {pixels,...summary}=mask;assert.deepEqual(summary,{width:104,height:146,bounds:{minX:-18,maxX:34,minZ:-204,maxZ:-131},cellSizeMeters:.5,grassTuftCount:350,grassRootCount:50400,occupiedCellCount:760,nonzeroTexelCount:2173});
 console.log('PRECOMPUTED_SOIL_LOCAL_MS='+Math.round(performance.now()-started));
 await assert.rejects(loadPrecomputedOasisSoil({...pkg,packageIdentity:'wrong'},{fetchImpl}),/PACKAGE_IDENTITY/);
 const positions=[...pkg.buffers.positions];positions[0]+=.001;
 await assert.rejects(loadPrecomputedOasisSoil({...pkg,buffers:{...pkg.buffers,positions}},{fetchImpl}),/INPUT_IDENTITY/);
 await assert.rejects(loadPrecomputedOasisSoil(pkg,{fetchImpl:async url=>{const b=readFileSync(url);b[100]^=1;return new Response(b);}}),/ASSET_INTEGRITY/);
 await assert.rejects(loadPrecomputedOasisSoil(pkg,{fetchImpl:async()=>new Response('',{status:404})}),/HTTP_404/);
});
test('generator sources remain bound; replacement removes mesh generation but preserves legacy path and upload',()=>{
 const asset=JSON.parse(read('showroom/globe/h-earth/render/assets/oasis-soil-mask.v1.json'));
 for(const [path,digest] of Object.entries(asset.provenance.sourceHashes))assert.equal(hash(read(path)),digest,path);
 const replacement=renderer.split('function prepareReplacementVegetation')[1].split('async function uploadGlobalCover')[0];
 assert.doesNotMatch(replacement,/prepareHEarthOasisFoliagePresentation|buildHEarthOasisGrassSoilCoverage/);
 assert.match(replacement,/loadPrecomputedOasisSoil\(pilotPackage\)/);
 assert.match(replacement,/gl.texSubImage2D\(gl.TEXTURE_2D,0,0,0,mask.width,mask.height,gl.RED,gl.UNSIGNED_BYTE,mask.pixels\)/);
 assert.match(renderer,/prepareHEarthOasisFoliagePresentation\(getHEarthRun8ER2ImmutableLiveRenderPackage/);
});
test('HTML intro equals fallback markup and appears before bootstrap; bootstrap imports world after loader and paint opportunity',()=>{
 const source=read('showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js'),html=read('showroom/globe/h-earth/index.html'),boot=read('showroom/globe/h-earth/vegetation-prototype/bootstrap.v1.js');
 const markup=source.split('if(!existing)shell.innerHTML=`')[1].split('`;')[0];
 assert.ok(html.includes(markup));assert.ok(html.indexOf('<section id="h-earth-loading-screen"')<html.indexOf('src="./vegetation-prototype/bootstrap'));
 assert.doesNotMatch(boot,/^import .*render\//m);assert.ok(boot.indexOf('createHEarthLoadingScreen({')<boot.indexOf('await import('));
 assert.match(boot,/requestAnimationFrame\(\(\)=>requestAnimationFrame/);assert.match(boot,/loader.fail\(error\)/);
 assert.match(source,/prefers-reduced-motion:reduce/);
});
test('hydration retains existing HTML; real progress, clock cleanup and terminal state',()=>{
 const nodes=new Map(),node=()=>({dataset:{},setAttribute(k,v){this[k]=v;},addEventListener(){}});
 const shell={...node(),querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);}};let t=1000,clockTick,cleared=false;
 const document={getElementById:()=>shell,createElement(){throw Error('duplicate shell');},defaultView:{setInterval(f){clockTick=f;return 1;},clearInterval(){cleared=true;}}};
 const loader=createHEarthLoadingScreen({document,now:()=>t,startedAt:0,schedule:()=>1,cancelSchedule(){}});
 assert.equal(shell.innerHTML,undefined);t=12000;clockTick();assert.equal(nodes.get('[data-loading-clock]').textContent,'12s elapsed');
 loader.update({phase:'SINGLE_POPULATION_DOWNLOADING',loadedBytes:100,totalBytes:1000});assert.equal(nodes.get('[data-loading-progress]').value,100);
 loader.update({phase:'SINGLE_POPULATION_DECODING',loadedContacts:5,totalContacts:10});assert.equal(nodes.get('[data-loading-progress]').value,5);
 loader.fail(Error('test'));assert.ok(cleared);loader.update({completed:1,total:1});assert.equal(loader.getReceipt().mode,'failed');
});
test('streamed grass download and decoding report actual totals while GPU payload remains exact',async()=>{
 const events=[],p=await loadPrecomputedGrass({packed:true,fetchImpl,onProgress:e=>events.push(e)}),plan=takePrecomputedGrassPlan(p);
 const digest=createHash('sha256');for(const tile of plan.tiles)digest.update(new Uint8Array(tile.packed.buffer));
 assert.equal(digest.digest('hex'),'d8df836eabd37c33d4a7b9542f56e4d1bb63d0d41fa7303be58f91fe5db1d3aa');
 const download=events.filter(x=>x.phase==='SINGLE_POPULATION_DOWNLOADING'),decode=events.filter(x=>x.phase==='SINGLE_POPULATION_DECODING');
 assert.equal(download.at(-1).loadedBytes,28561761);assert.equal(decode.at(-1).loadedContacts,1250134);
 for(const e of download)assert.equal(e.totalBytes,28561761);for(const e of decode)assert.equal(e.totalContacts,1250134);
 await assert.rejects(loadPrecomputedGrass({packed:true,fetchImpl:async url=>new Response(url.pathname.endsWith('.gz')?readFileSync(url).subarray(0,100):readFileSync(url))}),/COMPRESSED_INTEGRITY_LENGTH/);
});

test('route entry event cannot bypass readiness or consume the genuine entry handler',()=>{
 const source=read('showroom/globe/h-earth/vegetation-prototype/route.js');
 const listener=source.slice(source.indexOf('if(!diagnosticReplay){\n const enterWhenConfirmed'),source.indexOf('const copy='));
 let mode='preparing',handler,removed=0,entered=0;
 vm.runInNewContext(listener,{diagnosticReplay:false,loader:{getReceipt:()=>({mode})},document:{addEventListener:(_,f)=>handler=f,removeEventListener:()=>removed++},markReady:()=>entered++});
 handler();assert.equal(entered,0);assert.equal(removed,0);mode='test';handler();assert.equal(entered,0);mode='ready';handler();assert.equal(entered,0);mode='entered';handler();assert.equal(entered,1);assert.equal(removed,1);
});
test('packed grass producer and consumer use the same module identity',()=>{
 const owner=read('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 for(const source of [renderer,owner])assert.match(source,/from ['"]\.\/precomputed-grass\.v1\.js['"]/);
 const html=read('showroom/globe/h-earth/index.html');assert.match(html,/"\/showroom\/globe\/h-earth\/render\/precomputed-grass.v1.js": "\/showroom\/globe\/h-earth\/render\/precomputed-grass.v1.js\?rev=gen2815-fast-start-v1"/);
});
