#!/usr/bin/env node
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createIncrementalSingleOwnerVegetation} from '../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
import {prioritizeRegionalPackets} from '../showroom/globe/h-earth/render/regional-grass-delivery.v1.js';
import {groupSourceTiles,buildRegionBuffers,reconstructSourceRootBytes} from './h-earth-regional-delivery-materialize.v1.mjs';

const tiles=[
 {id:'-35:-49',minX:-140,minZ:-196,count:2,baselineCount:1},
 {id:'10:-75',minX:40,minZ:-300,count:1,baselineCount:1},
 {id:'-34:-49',minX:-136,minZ:-196,count:2,baselineCount:2},
 {id:'-35:-50',minX:-140,minZ:-200,count:1,baselineCount:0}
];
const layout=groupSourceTiles(tiles);
assert.equal(layout.sourceRoots,6);
assert.equal(layout.sourceTiles,4);
assert.equal(layout.regions.length,2);
assert.deepEqual(layout.regions.map(x=>x.id),['-5:-7','1:-10']);
const bytes=Buffer.alloc(6*52);
for(let i=0;i<bytes.length;i++)bytes[i]=(i*131+23)&255;
const packets=buildRegionBuffers(bytes,layout);
assert.equal(packets.length,2);
assert.equal(packets.reduce((n,x)=>n+x.region.roots,0),6);
assert.deepEqual(reconstructSourceRootBytes(packets,6),bytes);
assert.deepEqual(packets.find(x=>x.region.id==='-5:-7').region.tiles.map(x=>x.sourceFirstRoot),[0,3,5]);
assert.throws(()=>groupSourceTiles([...tiles,tiles[0]]),/TILE_ID_DUPLICATE/);
assert.throws(()=>groupSourceTiles([{...tiles[0],count:0}]),/TILE_COUNT_INVALID/);
const badPackets=packets.map(p=>({...p,region:{...p.region,tiles:p.region.tiles.map(t=>({...t}))}}));
badPackets[0].region.tiles[1].tileIndex=badPackets[0].region.tiles[0].tileIndex;
assert.throws(()=>reconstructSourceRootBytes(badPackets,6),/DUPLICATE_SOURCE_TILE/);
const mutated=packets.map(p=>({...p,compressed:Buffer.from(p.compressed)}));
mutated[0].compressed[mutated[0].compressed.length-8]^=1;
assert.throws(()=>reconstructSourceRootBytes(mutated,6));

const candidates=[{id:'0:0'},{id:'-5:-7'},{id:'1:-10'}];
const nearFourTrees=prioritizeRegionalPackets(candidates,{x:-139.4,z:-194.5});
assert.equal(nearFourTrees[0].region.id,'-5:-7');
const nearCavern=prioritizeRegionalPackets(candidates,{x:40,z:-300});
assert.equal(nearCavern[0].region.id,'1:-10');
assert.throws(()=>prioritizeRegionalPackets(candidates,{x:NaN,z:-300}),/CAMERA_INVALID/);


// Gen3186: execute true Node parser on both production integration files.
// The owner import above also validates native ESM linkage, not only grammar.
const authoringPaths=[
 '../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',
 '../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
];
for(const relative of authoringPaths){
 const file=fileURLToPath(new URL(relative,import.meta.url));
 const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
 assert.equal(checked.status,0,'NATIVE_SOURCE_SYNTAX_FAILED:'+relative+':'+(checked.stderr??'').slice(0,1600));
}

// Simulated GL is deliberately not a substitute for an actual WebGL driver.
// It is a regression sentinel for the authenticated owner’s source offsets,
// single allocation, duplicate protection and resident-only submission.
function mockOwnerGL(){
 const calls={allocatedBytes:0,uploadedBytes:0,uploads:[],drawCalls:0,deletes:0};
 const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,
  ARRAY_BUFFER:5,STATIC_DRAW:6,BUFFER_SIZE:7,NO_ERROR:0,FLOAT:8,TRIANGLES:9,
  createShader:()=>({}),createProgram:()=>({}),createVertexArray:()=>({}),createBuffer:()=>({}),
  shaderSource:()=>{},compileShader:()=>{},attachShader:()=>{},linkProgram:()=>{},
  getShaderParameter:()=>true,getProgramParameter:()=>true,
  getShaderInfoLog:()=>'',getProgramInfoLog:()=>'',isContextLost:()=>false,
  getBufferParameter:()=>calls.allocatedBytes,getError:()=>0,
  getUniformLocation:()=>0,bindVertexArray:()=>{},bindBuffer:()=>{},
  enableVertexAttribArray:()=>{},vertexAttribPointer:()=>{},vertexAttribDivisor:()=>{},
  useProgram:()=>{},uniform1f:()=>{},uniform1i:()=>{},uniform3f:()=>{},
  uniform3fv:()=>{},uniformMatrix4fv:()=>{},
  bufferData:(_target,bytes)=>{calls.allocatedBytes=bytes;},
  bufferSubData:(_target,offset,packed)=>{
   calls.uploads.push({offset,length:packed.byteLength});calls.uploadedBytes+=packed.byteLength;
  },
  drawArraysInstanced:()=>{calls.drawCalls++;},
  deleteShader:()=>{calls.deletes++;},deleteBuffer:()=>{calls.deletes++;},
  deleteVertexArray:()=>{calls.deletes++;},deleteProgram:()=>{calls.deletes++}
 };
 return{gl,calls};
}
const {gl:fakeGL,calls:gpu}=mockOwnerGL();
const fakeEnvironment={sunDirection:{x:1,y:1,z:0},sunColor:[1,1,1],
 groundHazeColor:[.5,.5,.5],sunIntensity:1,fogStartDistance:10,fogFalloff:.1,
 maximumFogFactor:.8};
const owner=createIncrementalSingleOwnerVegetation(fakeGL,{
 environment:fakeEnvironment,planetRadius:500,
 habitat:{pixels:new Uint8Array(576*192),receipt:{schema:'TEST_HABITAT'}}
});
const initial=owner.getReceipt();
assert.equal(initial.installedSourceRoots,0);
assert.equal(initial.sourceComplete,false);
assert.equal(initial.acceptedSourceRoots,2858738);
assert.equal(initial.gpuOwners,1);
assert.equal(initial.gpuBuffers,1);
assert.equal(initial.gpuAllocatedBytes,initial.gpuCapacityRoots*16);
assert.equal(initial.gpuUploadedBytes,initial.oasisRoots*16);
const originalTile={id:'test:tile0',first:0,count:1,baselineCount:1,minX:0,minZ:0,
 packed:new Float32Array([.5,0,.5,0])};
const packet={id:'0:0',roots:1,tiles:[originalTile]};
const installed=await owner.installRegion(packet);
assert.equal(installed.installedSourceRoots,1);
assert.equal(installed.sourceComplete,false);
assert.equal(gpu.uploads.at(-1).offset,0);
assert.equal(gpu.uploads.at(-1).length,16);
await assert.rejects(owner.installRegion(packet),/REGION_INVALID_OR_DUPLICATE/);
await assert.rejects(owner.installRegion({
 id:'1:0',roots:1,tiles:[{...originalTile,id:'test:tile1',minX:32,
  packed:new Float32Array([32.5,0,.5,0])}]
}),/SOURCE_OFFSET_OVERLAP/);
await assert.rejects(owner.installRegion({
 id:'1:0',roots:1,tiles:[{...originalTile,id:'test:tile2',first:1,minX:0}]
}),/SOURCE_TILE_INVALID/);
await assert.rejects(owner.finalizeEntrance({}),/ENTRANCE_REQUIRES_COMPLETE_SOURCE/);
const priorUploads=gpu.uploads.length;
const draw=owner.draw({camera:{position:{x:0,y:0,z:0},
 viewProjectionMatrix:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}});
assert(draw.visibleCoarseRoots>=1,'RESIDENT_SOURCE_ROOT_MISSING_FROM_DRAW');
assert.equal(draw.perFrameUploadBytes,0);
assert.equal(gpu.uploads.length,priorUploads,'DRAW_MUST_NOT_UPLOAD');
owner.dispose();owner.dispose();
assert.equal(owner.getReceipt().disposed,true);
assert.equal(gpu.deletes,5,'SINGLE_OWNER_RESOURCES_DELETED_ONCE');

console.log(JSON.stringify({schema:'H_EARTH_REGIONAL_MATERIALIZER_SELF_TEST_v1',result:'PASS',tiles:tiles.length,roots:6,regions:2,originalOrderReconstructed:true,duplicateRejected:true,corruptionRejected:true,cameraPriorityReordered:true,nativeOwnerAndRendererSyntax:true,nativeOwnerESMImport:true,simulatedGpuOwnerControls:true}));
