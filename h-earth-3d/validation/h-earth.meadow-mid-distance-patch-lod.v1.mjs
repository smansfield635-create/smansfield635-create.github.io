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
const presentation={clumps:[{instance:1,roots:[{x:-45,y:0,z:-326}]}]};
const before=digest(records),selected=selectHEarthMeadowMidDistanceRepresentations(cover,camera),split=partitionHEarthMeadowSelectedInstances(cover,selected,presentation);
assert.deepEqual(selected.draws,selectHEarthGlobalGroundCoverDraws(cover,camera).draws);
assert.equal(split.ids.length,4096);assert.equal(new Set(split.ids).size,4096);
assert.equal(split.originalCount,2048);assert.equal(split.meadowCount,2048);assert.equal(split.drawCount,3);assert.equal(split.nearCount,1);assert.equal(split.midCount,2047);
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
assert.equal(shaders.indices.length,31176);assert.equal(Math.max(...shaders.indices),12095);
const globalIndices=shaders.indices.slice(0,72),nearIndices=shaders.indices.slice(72,19080),midIndices=shaders.indices.slice(19080);
assert.equal(new Set(globalIndices).size,48);assert.equal(new Set(nearIndices).size,12096);assert.equal(new Set(midIndices).size,7488);
for(let leaf=0;leaf<12;leaf++)assert.deepEqual(Array.from(globalIndices.slice(leaf*6,leaf*6+6)),[0,1,2,1,3,2].map(i=>leaf*4+i));
for(const [indices,lowCount] of [[nearIndices,72],[midIndices,40]]){
 assert.equal(indices.length,12*(24*12+3*lowCount*6));
 for(let clump=0;clump<12;clump++){
  const base=clump*(144+3*lowCount*4),offset=clump*(288+3*lowCount*6);
  // Original 24 approved curved leaves retain every original triangle.
  for(let leaf=0;leaf<24;leaf++)assert.deepEqual(Array.from(indices.slice(offset+leaf*12,offset+leaf*12+12)),[0,1,2,1,3,2,2,3,4,3,5,4].map(i=>base+leaf*6+i));
  for(let leaf=0;leaf<3*lowCount;leaf++)assert.deepEqual(Array.from(indices.slice(offset+288+leaf*6,offset+288+leaf*6+6)),[0,1,2,1,3,2].map(i=>base+144+leaf*4+i));
 }
}
assert.ok(shaders.vs.includes('uOriginalRoots[leaf]*aTransform.w'));
assert.ok(shaders.vs.includes('rootY(instance,leaf)'));
assert.ok(renderer.includes("gl.uniform2fv(u['uOriginalRoots[0]'],originalRoots)"));
assert.ok(!renderer.includes('gl.drawElementsInstanced(gl.TRIANGLES,state.cover.template.indices.length'),'legacy fan topology is never submitted');
assert.ok(renderer.includes('gl.uniform1i(u.uSelectedIds,8);'),'selection sampler cannot alias shadow unit6');
assert.ok(renderer.includes('gl.bindVertexArray(state.meadowVao)'));
let actualCache=null;
const cacheArg=process.argv.indexOf('--cache');
if(cacheArg>=0){
 const cached=JSON.parse(gunzipSync(readFileSync(process.argv[cacheArg+1])));cached.records=Float32Array.from(cached.records);
 assert.equal(digest(cached.records),'045c775aedf39086daec21980365474e43cbd472d803c16097b4b8392de307a6');
 const rootsArg=process.argv.indexOf('--clumps');assert.ok(rootsArg>=0,'actual-cache verification requires preserved contact sidecar');
 const actualPresentation=JSON.parse(readFileSync(process.argv[rootsArg+1]));const contactsBefore=digest(JSON.stringify(actualPresentation.clumps));
 assert.equal(actualPresentation.clumps.length,1464);assert.equal(actualPresentation.clumps.reduce((n,c)=>n+c.roots.length,0),4392);
 const plan=selectHEarthMeadowMidDistanceRepresentations(cached,camera),partition=partitionHEarthMeadowSelectedInstances(cached,plan,actualPresentation);
 const original=plan.draws.flatMap(d=>Array.from({length:d.count},(_,i)=>d.start+i*d.stride));
 assert.deepEqual([...partition.ids].sort((a,b)=>a-b),[...original].sort((a,b)=>a-b));
 assert.equal(new Set(partition.ids).size,original.length);
 const boundary=getHEarthMeadowBoundaryPreservedInstances(cached),oldClass=new Set(partition.ids.slice(0,partition.originalCount));
 assert.equal(boundary.length,9);for(const id of boundary)assert.ok(oldClass.has(id));
 assert.equal(partition.originalCount,3856);assert.equal(partition.meadowCount,122);
 assert.equal(partition.nearCount,41);assert.equal(partition.midCount,81);
 assert.equal(partition.vertices,1287552);assert.equal(partition.triangles,678912);
 assert.equal(partition.meadowLeaves,258048);
 assert.equal(digest(JSON.stringify(actualPresentation.clumps)),contactsBefore);
 const classes=[partition.ids.slice(0,3856),partition.ids.slice(3856,3897),partition.ids.slice(3897)];
 for(const ids of classes){const wanted=new Set(ids);assert.deepEqual([...ids],original.filter(id=>wanted.has(id)));}
 assert.equal(digest(cached.records),'045c775aedf39086daec21980365474e43cbd472d803c16097b4b8392de307a6');
 assert.equal(partition.drawCount,3);
 actualCache={originalRecordsSha256:digest(cached.records),logicalInstances:partition.ids.length,originalInstances:partition.originalCount,meadowInstances:partition.meadowCount,draws:partition.drawCount,submittedVertices:partition.vertices,submittedTriangles:partition.triangles,previousSubmittedVertices:318784,previousSubmittedTriangles:233088,nearDensityInstances:partition.nearCount,midDensityInstances:partition.midCount,meadowLeaves:partition.meadowLeaves,selectionUploadBytesOnChange:16384,stationarySelectionUploadBytes:0};
}
console.log(JSON.stringify({schema:'H_EARTH_GLOBAL_FINE_GRASS_LOW_STRATUM_PREVISUAL_TEST_v1',result:'PASS',actualCache,leavesPerClump:24,approvedVerticesPerLeaf:6,approvedTrianglesPerLeaf:4,lowVerticesPerLeaf:4,lowTrianglesPerLeaf:2,globalVerticesPerLeaf:4,globalTrianglesPerLeaf:2,atlasGpuBytes:0,originalSelectionPreserved:true,browserQualification:'NOT_TESTED',perceptualAcceptance:'PENDING'}));
