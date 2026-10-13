#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {selectHEarthMeadowMidDistanceRepresentations,selectHEarthGlobalGroundCoverDraws,partitionHEarthMeadowSelectedInstances,sameHEarthMeadowSelectedIds,getHEarthMeadowBoundaryPreservedInstances} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const records=new Float32Array(4096*20);
for(let i=0;i<4096;i++){records[i*20+12]=-45;records[i*20+13]=-326+(i%2?12:40);records[i*20+15]=1;}
const cover={records,receipt:{instanceCount:4096},tiles:[{start:0,count:4096,minX:-46,maxX:-44,minZ:-326,maxZ:-286}]},camera={x:-45,z:-326};
const before=digest(records),selected=selectHEarthMeadowMidDistanceRepresentations(cover,camera),split=partitionHEarthMeadowSelectedInstances(cover,selected);
assert.deepEqual(selected.draws,selectHEarthGlobalGroundCoverDraws(cover,camera).draws);
assert.equal(split.ids.length,4096);assert.equal(new Set(split.ids).size,4096);
assert.equal(split.originalCount,2048);assert.equal(split.meadowCount,2048);assert.equal(split.drawCount,2);
assert.deepEqual(Array.from(split.ids.slice(0,2048)),Array.from({length:2048},(_,i)=>i*2));
assert.deepEqual(Array.from(split.ids.slice(2048)),Array.from({length:2048},(_,i)=>i*2+1));
assert.ok(sameHEarthMeadowSelectedIds(split.ids,Float32Array.from(split.ids)),'stationary selection avoids upload');
assert.ok(!sameHEarthMeadowSelectedIds(null,split.ids));
assert.ok(!sameHEarthMeadowSelectedIds(split.ids,split.ids.slice(1)));
assert.equal(digest(records),before);
const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const begin=renderer.indexOf('const GLOBAL_COVER_VS ='),end=renderer.indexOf('const CLEARING_SHADOW_VS=',begin);
const shaders=vm.runInNewContext(renderer.slice(begin,end)+'\n({vs:GLOBAL_COVER_PATCH_LOD_VS,fs:GLOBAL_COVER_PATCH_SUPPRESSION_FS,indices:buildHEarthMeadowLeafIndices()})');
assert.ok(shaders.vs.includes('uSelectedIds'));
assert.ok(shaders.vs.includes('meadowRoot(start+contact*3)'));
assert.ok(shaders.vs.includes('vBaseColor=vec4(mix(base,tip'));
assert.ok(!shaders.fs.includes('uMeadowAtlas'),'geometric leaves do not use alpha panels');
assert.equal(shaders.indices.length,3456);assert.equal(Math.max(...shaders.indices),1727);
for(let leaf=0;leaf<288;leaf++)assert.deepEqual(Array.from(shaders.indices.slice(leaf*12,leaf*12+12)),[0,1,2,1,3,2,2,3,4,3,5,4].map(i=>leaf*6+i));
assert.ok(renderer.includes('gl.uniform1i(u.uSelectedIds,8);'),'selection sampler cannot alias shadow unit6');
assert.ok(renderer.includes('gl.bindVertexArray(state.meadowVao)'));
let actualCache=null;
const cacheArg=process.argv.indexOf('--cache');
if(cacheArg>=0){
 const cached=JSON.parse(gunzipSync(readFileSync(process.argv[cacheArg+1])));cached.records=Float32Array.from(cached.records);
 assert.equal(digest(cached.records),'045c775aedf39086daec21980365474e43cbd472d803c16097b4b8392de307a6');
 const plan=selectHEarthMeadowMidDistanceRepresentations(cached,camera),partition=partitionHEarthMeadowSelectedInstances(cached,plan);
 const original=plan.draws.flatMap(d=>Array.from({length:d.count},(_,i)=>d.start+i*d.stride));
 assert.deepEqual([...partition.ids].sort((a,b)=>a-b),[...original].sort((a,b)=>a-b));
 assert.equal(new Set(partition.ids).size,original.length);
 const boundary=getHEarthMeadowBoundaryPreservedInstances(cached),oldClass=new Set(partition.ids.slice(0,partition.originalCount));
 assert.equal(boundary.length,9);for(const id of boundary)assert.ok(oldClass.has(id));
 assert.equal(partition.originalCount,3856);assert.equal(partition.meadowCount,122);
 assert.equal(partition.vertices,318784);assert.equal(partition.triangles,233088);
 assert.equal(partition.drawCount,2);
 actualCache={originalRecordsSha256:digest(cached.records),logicalInstances:partition.ids.length,originalInstances:partition.originalCount,meadowInstances:partition.meadowCount,draws:partition.drawCount,submittedVertices:partition.vertices,submittedTriangles:partition.triangles,previousSubmittedVertices:3978*84,previousSubmittedTriangles:3978*72,selectionUploadBytesOnChange:16384,stationarySelectionUploadBytes:0};
}
console.log(JSON.stringify({schema:'H_EARTH_MEADOW_GEOMETRY_REPAIR_PREVISUAL_TEST_v1',result:'PASS',actualCache,leavesPerClump:24,verticesPerLeaf:6,trianglesPerLeaf:4,atlasGpuBytes:0,originalSelectionPreserved:true,browserQualification:'NOT_TESTED',perceptualAcceptance:'PENDING'}));
