import test from 'node:test';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {COASTAL_GRASS,coastalDivide,coastalSideWeight,createCoastalField} from '../../showroom/globe/h-earth/render/grass-coastal-field.v1.js';
import {sampleWoodlandHabitat} from '../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
import {loadPrecomputedGrass,takePrecomputedGrassPlan} from '../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
const root=new URL('../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',read=p=>fs.readFileSync(new URL(p,root)),sha=b=>createHash('sha256').update(b).digest('hex');
const checkpoint=JSON.parse(read('h-earth-3d/evidence/grass-coastal-v1/checkpoint.json')),manifest=JSON.parse(read(asset+'json')),raw=gunzipSync(read(asset+'bin.gz')),saved=gunzipSync(read('h-earth-3d/evidence/grass-coastal-v1/roots.json.gz')),added=JSON.parse(saved);
const hillside=JSON.parse(read('h-earth-3d/evidence/hillside-shoreline-continuity-v1/checkpoint.json'));
const hillsideBytes=gunzipSync(read('h-earth-3d/evidence/hillside-shoreline-continuity-v1/added.bin.gz'));
const hillsideAdded=Array.from({length:hillsideBytes.length/52},(_,i)=>{const b=hillsideBytes.subarray(i*52,(i+1)*52);return{x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'};});
assert.equal(hillside.removed,0);assert.equal(sha(hillsideBytes),hillside.addedSha256);
const terrain=JSON.parse(read('h-earth-3d/evidence/terrain-grass-continuity-v2/checkpoint.json'));
const terrainBytes=gunzipSync(read('h-earth-3d/evidence/terrain-grass-continuity-v2/added.bin.gz'));
const terrainAdded=Array.from({length:terrainBytes.length/52},(_,i)=>{const b=terrainBytes.subarray(i*52,(i+1)*52);return{x:b.readDoubleLE(0),y:b.readDoubleLE(8),z:b.readDoubleLE(16),angle:b.readDoubleLE(24),slope:b.readDoubleLE(32),seed:b.readUInt32LE(40),triangleId:b.readUInt32LE(44),region:'RAVINE_SUPPLEMENT'};});
assert.equal(terrain.removed,0);assert.equal(sha(terrainBytes),terrain.addedSha256);
const baseline=p=>execFileSync('git',['show',(process.env.H_EARTH_COASTAL_BASELINE_REF||COASTAL_GRASS.baseline)+':'+p],{cwd:root,maxBuffer:100*1024*1024});
const priorManifestBytes=baseline(asset+'json'),priorManifest=JSON.parse(priorManifestBytes),prior=gunzipSync(baseline(asset+'bin.gz'));
test('coastal output obeys independent exact baseline, complete allocation and authentic hashes',()=>{
 assert.equal(sha(priorManifestBytes),COASTAL_GRASS.priorManifestSha256);assert.equal(sha(prior),COASTAL_GRASS.priorRawSha256);assert.equal(checkpoint.originalCount,1250134);assert.equal(checkpoint.baseline,COASTAL_GRASS.baseline);
 assert.equal(sha(saved),checkpoint.savedCandidateSha256);assert.equal(added.length,checkpoint.addedContacts);assert(added.length>0&&added.length<=250000);assert.equal(manifest.rootCount,1250134+added.length+hillside.added+terrain.added);assert.equal(manifest.rootCount,terrain.rootCount);assert.equal(terrain.packedBytes,manifest.rootCount*16);assert.equal(checkpoint.packedBytes,(manifest.rootCount-hillside.added-terrain.added)*16);assert(checkpoint.packedBytes<=24002144);assert(manifest.tiles.every(t=>t.count<=1600));
 assert.equal(sha(raw),manifest.rawSha256);assert.equal(sha(read(asset+'bin.gz')),manifest.compressedSha256);assert.equal(manifest.receipt.coastalGrass.savedCandidateSha256,checkpoint.savedCandidateSha256);assert.equal(checkpoint.browserVerified,false);assert.equal(checkpoint.physicalDeviceAccepted,false);
});
test('all 1250134 previous records remain byte exact in original tiles; every addition occurs exactly once',()=>{
 const counts=new Map(priorManifest.tiles.map(t=>[t.id,t.count])),expected=new Map([...added,...hillsideAdded,...terrainAdded].map(r=>[r.x+':'+r.z,r])),preserved=[],positions=new Set();assert.equal(expected.size,added.length+hillside.added+terrain.added);let offset=0,totalAdded=0;
 for(const t of manifest.tiles){const n=counts.get(t.id)||0;assert(t.count>=n);preserved.push(raw.subarray(offset,offset+n*52));for(let i=0;i<t.count;i++){const o=offset+i*52,x=raw.readDoubleLE(o),z=raw.readDoubleLE(o+16),key=x+':'+z;assert(!positions.has(key));positions.add(key);if(i<n)continue;const r=expected.get(key);assert(r,key);for(const [j,k]of ['x','y','z','angle','slope'].entries())assert.equal(raw.readDoubleLE(o+j*8),r[k]);assert.equal(raw.readUInt32LE(o+40),r.seed);assert.equal(raw.readUInt32LE(o+44),r.triangleId);assert.equal(raw.readUInt32LE(o+48),2);expected.delete(key);totalAdded++;}offset+=t.count*52;}
 assert.equal(totalAdded,added.length+hillside.added+terrain.added);assert.equal(expected.size,0);assert.deepEqual(Buffer.concat(preserved),prior.subarray(0,1250134*52));assert.equal(sha(Buffer.concat(preserved)),checkpoint.originalRootsSha256);
});
test('old atlas panels and world bounds are exact while coastal coverage has its own third panel',()=>{
 const old=prior.subarray(1250134*52),next=raw.subarray(manifest.rootCount*52);assert.equal(manifest.habitat.width,576);assert.equal(manifest.habitat.size,192);assert.equal(next.length,576*192);
 for(let z=0;z<192;z++)assert.deepEqual(next.subarray(z*576,z*576+384),old.subarray(z*384,z*384+384));assert.deepEqual(manifest.habitat.bounds,priorManifest.habitat.bounds);assert.deepEqual(manifest.habitat.ravine.bounds,priorManifest.habitat.ravine.bounds);assert.deepEqual(manifest.habitat.coastal.bounds,terrain.bounds);assert(checkpoint.coastalTexels>0);
 const renderer=read('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').toString();assert(renderer.includes("'uHabitatAtlasScale'),1/3,1"));assert(renderer.includes('2.0*uHabitatAtlasScale.x'));assert(renderer.includes("'uHabitatHalfTexel'),.5/installedHabitat.size"));
});
test('all saved additions remain oceanward, below hard slope limit, outside preserved woodland and inside finite field',()=>{
 const old=prior.subarray(1250134*52),pixels=new Uint8Array(192*192);for(let z=0;z<192;z++)pixels.set(old.subarray(z*384,z*384+192),z*192);const woodland={pixels,size:192,bounds:priorManifest.habitat.bounds},[x0,z0,x1,z1]=checkpoint.field.bounds;
 for(const r of added){assert(r.z>coastalDivide(r.x));assert(r.slope<=1.6);assert(r.x>=x0&&r.x<x1&&r.z>=z0&&r.z<z1);assert.equal(sampleWoodlandHabitat(woodland,r.x,r.z),0);assert(Number.isInteger(r.triangleId)&&r.triangleId>=0);}
});
test('ridge separator and bounded field blend continuously without a straight density cutoff',()=>{
 for(const x of [-220,-52,0,86,148,260]){const z=coastalDivide(x);assert.equal(coastalSideWeight(x,z),0);assert.equal(coastalSideWeight(x,z-1),0);assert(coastalSideWeight(x,z+.001)<1e-6);assert.equal(coastalSideWeight(x,z+15),1);}
 const rows=[];for(let z=-190;z<-180;z++)for(let x=0;x<10;x++)rows.push({x:x+.5,z:z+.5,landform:'RIDGE'});rows.push({x:400.5,z:-180.5,landform:'RIDGE'});
 const a=createCoastalField(rows,(x)=>({slope:x<5?.4:1})),b=createCoastalField(rows,(x)=>({slope:x<5?.4:1}));assert.equal(a.coreCells,100);assert.equal(a.componentCount,1);assert(a.weight(10,-185)>0);assert.equal(a.weight(40,-185),0);
 assert(Math.abs(a.smoothedSlope(4.999,-185)-a.smoothedSlope(5.001,-185))<.001);for(let x=-15;x<25;x++)assert.equal(a.weight(x,-185),b.weight(x,-185));
});
test('SHA-addressed downloads, single module identity and untouched bootstrap preserve cache consistency',async()=>{
 const seen=[],presentation=await loadPrecomputedGrass({packed:true,fetchImpl:async url=>{seen.push(url);return new Response(fs.readFileSync(url));}});assert(takePrecomputedGrassPlan(presentation));
 assert.equal(seen[0].searchParams.get('sha'),sha(read(asset+'json')));assert.equal(seen[1].searchParams.get('sha'),manifest.compressedSha256);
 const html=read('showroom/globe/h-earth/index.html').toString(),oldHtml=baseline('showroom/globe/h-earth/index.html').toString();assert.equal(html.match(/src="\.\/vegetation-prototype\/bootstrap[^\"]*"/)[0],oldHtml.match(/src="\.\/vegetation-prototype\/bootstrap[^\"]*"/)[0]);
 assert.equal(html,execFileSync('git',['show',hillside.baseline+':showroom/globe/h-earth/index.html'],{cwd:root,encoding:'utf8'}));
});

test('actual production route guard accepts three-panel habitat bytes and rejects stale or unsafe uploads',()=>{
  const route=read('showroom/globe/h-earth/vegetation-prototype/route.js').toString();
  const idsSource=route.match(/function ids\(record\)\{[\s\S]*?\n\}/)?.[0];
  const guardSource=route.match(/function assertStableObservation\(observation,expectedIds\)\{[\s\S]*?\n\}/)?.[0];
  assert(idsSource&&guardSource,'actual production guard must be extractable');
  const verify=runInNewContext([
    "const assert=(condition,reason)=>{if(!condition)throw Error('SINGLE_OWNER_PROTOTYPE:'+reason);};",
    idsSource,guardSource,'assertStableObservation'
  ].join('\n'));
  const valid={
    vegetation:{controlRoots:['root-b','root-a'],coarseRootCount:1,coarseTiles:1,drawCallCount:1,perFrameUploadBytes:0},
    rendererCounters:{woodlandHabitatTextureUploadCount:1,woodlandHabitatUploadedBytes:110592}
  };
  const expectedIds=['root-a','root-b'];
  assert.doesNotThrow(()=>verify(valid,expectedIds));
  for(const bytes of [73728,110591,110593])assert.throws(()=>verify({
    ...valid,rendererCounters:{...valid.rendererCounters,woodlandHabitatUploadedBytes:bytes}
  },expectedIds),/HABITAT_TEXTURE_UPLOAD_COUNT_CHANGED/);
  for(const count of [0,2])assert.throws(()=>verify({
    ...valid,rendererCounters:{...valid.rendererCounters,woodlandHabitatTextureUploadCount:count}
  },expectedIds),/HABITAT_TEXTURE_UPLOAD_COUNT_CHANGED/);
  assert.throws(()=>verify({...valid,vegetation:{...valid.vegetation,perFrameUploadBytes:4}},expectedIds),/UNEXPECTED_FRAME_UPLOAD/);
  assert.throws(()=>verify({...valid,vegetation:{...valid.vegetation,drawCallCount:0}},expectedIds),/COARSE_COVERAGE_OR_DRAW_LOST/);
  assert.throws(()=>verify({...valid,vegetation:{...valid.vegetation,controlRoots:['root-b','root-b']}},expectedIds),/DUPLICATE_CONTROL_IDS/);
});

test('production importmap resolves the corrected route without changing bootstrap or data-route',()=>{
  const html=read('showroom/globe/h-earth/index.html').toString();
  const importmap=html.match(/<script type="importmap">([\s\S]*?)<\/script>/)?.[1];
  assert(importmap,'production importmap remains present');
  const imports=JSON.parse(importmap).imports;
  assert.equal(
    imports['/showroom/globe/h-earth/vegetation-prototype/route.js?rev=gen2795-performance-v1'],
    '/showroom/globe/h-earth/vegetation-prototype/route.js?rev=gen2818-coastal-route-guard-v1'
  );
  assert.equal(html.match(/data-route="([^"]*)"/)?.[1],'./vegetation-prototype/route.js?rev=gen2795-performance-v1');
});
