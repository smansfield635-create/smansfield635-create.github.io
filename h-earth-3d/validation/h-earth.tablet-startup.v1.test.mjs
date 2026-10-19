import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {loadPrecomputedGrass,decodePrecomputedGrass,takePrecomputedGrassPlan} from '../../showroom/globe/h-earth/render/precomputed-grass.v1.js';
import {planImmutableTiles,createSingleOwnerVegetation} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
const asset=new URL('../../showroom/globe/h-earth/render/assets/precomputed-grass.v1.json',import.meta.url);
const manifest=JSON.parse(readFileSync(asset));
const fetchImpl=async url=>new Response(readFileSync(url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const environment={sunDirection:{x:0,y:1,z:0},sunColor:[1,1,1],groundHazeColor:[.5,.6,.7],sunIntensity:1,fogStartDistance:100,fogFalloff:.001,maximumFogFactor:.6};
function fakeGL(failUpload=false){
 let next=0,offset=0,fine=0;const uploads=[],draws=[],deletions=[],digest=createHash('sha256');
 const gl=new Proxy({ARRAY_BUFFER:1,STATIC_DRAW:2,FLOAT:3,TRIANGLES:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,COMPILE_STATUS:7,LINK_STATUS:8,
 createShader:()=>++next,createProgram:()=>++next,createVertexArray:()=>++next,createBuffer:()=>++next,
 getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_p,name)=>name,
 bufferData:(_t,bytes)=>uploads.push({allocate:bytes}),bufferSubData:(_t,start,data)=>{if(failUpload)throw Error('UPLOAD_TEST_FAILURE');uploads.push({start,bytes:data.byteLength});digest.update(new Uint8Array(data.buffer,data.byteOffset,data.byteLength));},
 vertexAttribPointer:(_l,_s,_t,_n,_stride,start)=>{offset=start;},uniform1i:(name,value)=>{if(name==='uFine')fine=value;},
 drawArraysInstanced:(_m,_f,vertices,count)=>draws.push({offset,fine,vertices,count}),
 deleteShader:x=>deletions.push(x),deleteProgram:x=>deletions.push(x),deleteVertexArray:x=>deletions.push(x),deleteBuffer:x=>deletions.push(x),
 },{get:(target,key)=>key in target?target[key]:()=>{}});
 return {gl,uploads,draws,deletions,digest};
}
const gpuSha=manifest.packedSha256;
test('authenticated packed path equals legacy tiles, GPU bytes, atlas and rounded control identities',async()=>{
 let yields=0,last=0,maxDelta=0;
 const fast=await loadPrecomputedGrass({packed:true,fetchImpl,yieldControl:async()=>{yields++;},onProgress:p=>{if(p.phase==='SINGLE_POPULATION_DECODING'){maxDelta=Math.max(maxDelta,p.loadedContacts-last);last=p.loadedContacts;}}});
 const plan=takePrecomputedGrassPlan(fast);assert.ok(plan);assert.equal(takePrecomputedGrassPlan(fast),undefined);
 assert.equal(fast.tiles,undefined);assert.ok(yields>=203);assert.equal(last,manifest.rootCount);assert.ok(maxDelta<=16*1600);
 const legacy=await loadPrecomputedGrass({fetchImpl});const tiles=planImmutableTiles(legacy),controls=[],digest=createHash('sha256');
 assert.deepEqual(fast.receipt,legacy.receipt);assert.deepEqual(fast.habitat,legacy.habitat);
 assert.equal(fast.habitat.pixels.buffer.byteLength,manifest.habitat.width*manifest.habitat.height,'atlas does not retain raw population buffer');
 assert.equal(plan.tiles.length,tiles.length);
 tiles.forEach((tile,i)=>{
  const actual=plan.tiles[i];for(const k of ['id','minX','minZ','count','first'])assert.equal(actual[k],tile[k]);
  assert.deepEqual(actual.packed,tile.packed);assert.equal(actual.rootIds,undefined);
  assert.equal(actual.packed.buffer.byteLength,tile.count*16);
  digest.update(new Uint8Array(actual.packed.buffer));
  tile.rootIds.forEach((id,j)=>{if(Math.hypot(tile.packed[j*4]+139.40267987050615,tile.packed[j*4+2]+194.5)<=2)controls.push(id);});
 });
 assert.equal(digest.digest('hex'),gpuSha);assert.deepEqual(plan.controlRoots,controls);assert.ok(controls.length);
});
test('packed owner uploads exact bytes and offsets once; return movement and cleanup remain stable',async()=>{
 const presentation=await loadPrecomputedGrass({packed:true,fetchImpl}),f=fakeGL();
 const owner=await createSingleOwnerVegetation(f.gl,presentation,{environment,planetRadius:6200000});
 assert.equal(f.digest.digest('hex'),gpuSha);assert.equal(f.uploads[0].allocate,manifest.rootCount*16);
 let start=0;for(const u of f.uploads.slice(1)){assert.equal(u.start,start);start+=u.bytes;}assert.equal(start,manifest.rootCount*16);
 const receipt=owner.getReceipt();assert.equal(receipt.installedRootCount,manifest.rootCount);assert.ok(receipt.controlRoots.length);
 const uploadCount=f.uploads.length,frames=[];
 for(const [x,z] of [[-139,-195],[-110,-195],[0,0],[-110,-195],[-139,-195]]){
  const first=f.draws.length;const result=owner.draw({camera:{position:{x,y:4,z},viewProjectionMatrix:new Array(16).fill(0)}});
  assert.equal(result.perFrameUploadBytes,0);frames.push(f.draws.slice(first));assert.equal(frames.at(-1)[0].count,manifest.rootCount);
 }
 assert.deepEqual(frames[0],frames[4]);assert.deepEqual(frames[1],frames[3]);assert.equal(f.uploads.length,uploadCount);
 assert.equal(takePrecomputedGrassPlan(presentation),undefined,'owner consumes private plan');
 owner.dispose();owner.dispose();assert.equal(f.deletions.length,5);
 const failing=fakeGL(true);await assert.rejects(createSingleOwnerVegetation(failing.gl,await loadPrecomputedGrass({packed:true,fetchImpl}),{environment,planetRadius:6200000}),/UPLOAD_TEST_FAILURE/);assert.equal(failing.deletions.length,5);
});
test('manifest, compressed payload, HTTP and raw corruption fail closed',async()=>{
 for(const stage of ['manifest','compressed','truncated'])await assert.rejects(loadPrecomputedGrass({packed:true,fetchImpl:async url=>{
  let bytes=readFileSync(url);if(stage==='manifest'&&url.pathname.endsWith('.json')||stage==='compressed'&&url.pathname.endsWith('.gz')){bytes=Buffer.from(bytes);bytes[20]^=1;}
  if(stage==='truncated'&&url.pathname.endsWith('.gz'))bytes=bytes.subarray(0,-1);return new Response(bytes);
 }}),/INTEGRITY/);
 await assert.rejects(loadPrecomputedGrass({packed:true,fetchImpl:async()=>new Response('',{status:503})}),/MANIFEST_HTTP_503/);
 await assert.rejects(loadPrecomputedGrass({packed:true,fetchImpl:async url=>url.pathname.endsWith('.gz')?new Response('',{status:404}):fetchImpl(url)}),/DATA_HTTP_404/);
 const bytes=gunzipSync(readFileSync(new URL('./precomputed-grass.v1.bin.gz',asset)));bytes[0]^=1;
 await assert.rejects(decodePrecomputedGrass(manifest,bytes),/DATA_INTEGRITY/);
 await assert.rejects(decodePrecomputedGrass({...manifest,rootCount:1},bytes),/IDENTITY_MISMATCH/);
});
test('copied or forged metadata never authorizes bypassing generic validation',async()=>{
 const p=await loadPrecomputedGrass({packed:true,fetchImpl});assert.equal(takePrecomputedGrassPlan({...p}),undefined);
 const forged={...p,packed:true,prevalidated:true,tiles:[]};
 await assert.rejects(createSingleOwnerVegetation(fakeGL().gl,forged,{environment,planetRadius:6200000}),/EMPTY_WOODLAND_POPULATION/);
 const raw=gunzipSync(readFileSync(new URL('./precomputed-grass.v1.bin.gz',asset)));
 const decoded=await decodePrecomputedGrass(manifest,raw);assert.equal(takePrecomputedGrassPlan(decoded),undefined);
 decoded.tiles[0].roots.push({...decoded.tiles[0].roots[0]});assert.throws(()=>planImmutableTiles(decoded),/ROOT_DUPLICATE/);
});
test('production caller selects packed startup explicitly',()=>{
 const source=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 assert.ok(source.includes('loadPrecomputedGrass({packed:true,yieldControl:yieldToBrowserPaint,onProgress})'));
});
