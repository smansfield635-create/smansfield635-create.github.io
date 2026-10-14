#!/usr/bin/env node
/** Independent immutable-world component, contact and presentation audit; no world rebuild. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {buildWoodlandRockPresentation,suppressWoodlandRockTriangles} from '../../showroom/globe/h-earth/render/woodland-rock-presentation.v1.js';
const hash=x=>createHash('sha256').update(x).digest('hex');
const ROOT=new URL('../../',import.meta.url);
function surface(raw,x,z){
 const p=raw.buffers.positions,idx=raw.buffers.indices;
 for(const s of raw.primitiveSpans.filter(s=>s.role==='TERRAIN'))for(let j=s.indexStart;j<s.indexStart+s.indexCount;j+=3){
  const [a,b,c]=[0,1,2].map(k=>Array.from(p.slice(idx[j+k]*3,idx[j+k]*3+3),Math.fround));
  const den=(b[0]-a[0])*(c[2]-a[2])-(b[2]-a[2])*(c[0]-a[0]);if(Math.abs(den)<1e-12)continue;
  const v=((x-a[0])*(c[2]-a[2])-(z-a[2])*(c[0]-a[0]))/den,w=((b[0]-a[0])*(z-a[2])-(b[2]-a[2])*(x-a[0]))/den,u=1-v-w;
  if(Math.min(u,v,w)>=-1e-8)return {y:u*a[1]+v*b[1]+w*c[1],triangleId:j/3};
 }
 throw Error('ROCK_CONTACT_TERRAIN_MISSING');
}
function inPolygon(x,z,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
 const a=ring[i],b=ring[j];if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));if(Math.hypot(x-a.x-t*dx,z-a.z-t*dz)<.00003)return true;
 }return inside;}
export function verifyFourTreeRockPresentation(raw){
 const original=hash(JSON.stringify(raw)),p=raw.buffers.positions,idx=raw.buffers.indices;
 const span=raw.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_ROCK');assert(span);
 const components=[],pending=new Map();for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3)pending.set(i,idx.slice(i,i+3));
 // Connected components derived without consuming the builder's census or type filter.
 while(pending.size){const [first,ids]=pending.entries().next().value,vertices=new Set(ids),offsets=[first];pending.delete(first);let changed=true;while(changed){changed=false;for(const [j,tri] of pending)if(tri.some(v=>vertices.has(v))){tri.forEach(v=>vertices.add(v));offsets.push(j);pending.delete(j);changed=true;}}components.push({vertices:[...vertices].sort((a,b)=>a-b),offsets});}
 const targets=components.filter(c=>c.vertices.every(v=>raw.clearingAttributes[v*3+2]===3));assert.equal(targets.length,14);
 const expectedOffsets=targets.flatMap(c=>c.offsets).sort((a,b)=>a-b);assert.equal(expectedOffsets.length,224);assert.equal(span.triangleCount-expectedOffsets.length,336);
 const built=buildWoodlandRockPresentation(raw);assert.equal(built.records.length,14);assert.deepEqual([...built.suppressedTriangleOffsets].sort((a,b)=>a-b),expectedOffsets);
 const filtered=suppressWoodlandRockTriangles(idx,built),offsetSet=new Set(expectedOffsets);assert.equal(filtered.length,idx.length);
 for(let j=0;j<idx.length;j+=3)if(offsetSet.has(j))assert(filtered[j]===filtered[j+1]&&filtered[j]===filtered[j+2],'ROCK_NOT_SUPPRESSED');else assert.deepEqual([...filtered.slice(j,j+3)],idx.slice(j,j+3),'UNRELATED_TRIANGLE_CHANGED');
 const n=built.positions.length/3;assert(Number.isInteger(n));assert.equal(built.normals.length,n*3);assert.equal(built.baseColorsLinear.length,n*4);assert.equal(built.sourceVertexIndices.length,n);assert.equal(built.indices.length%3,0);assert(built.indices.length/3<=5000);
 const seen=new Set(),reports=[];let accountedVertices=0,accountedIndices=0,minBurial=Infinity;
 for(const record of built.records){
  const component=targets.find(c=>JSON.stringify(c.vertices)===JSON.stringify(record.originalVertexIds));assert(component,'UNKNOWN_COMPONENT');assert(!seen.has(component));seen.add(component);assert.equal(component.vertices.length,10);assert.equal(component.offsets.length,16);
  const bottom=component.vertices[0],x=p[bottom*3],z=p[bottom*3+2],ring=component.vertices.slice(2).map(v=>({x:p[v*3],z:p[v*3+2]})),maxY=Math.max(...component.vertices.map(v=>p[v*3+1]));
  const footprint=raw.landscapeCoverFootprints.find(o=>o.id.startsWith('CLEARING_ROCK_')&&Math.hypot(o.x-x,o.z-z)<.00001);assert(footprint,'ORIGINAL_PLACEMENT_NOT_IDENTIFIED');
  assert.equal(record.center.x,x);assert.equal(record.center.z,z);assert.equal(record.originalMaximumY,maxY);assert.deepEqual(record.originalFootprint,ring);assert.equal(record.vertexStart,accountedVertices);assert.equal(record.indexStart,accountedIndices);
  let actualMax=-Infinity,lowest=Infinity,lowerContacts=0;
  for(let v=record.vertexStart;v<record.vertexStart+record.vertexCount;v++){
   const [vx,vy,vz]=built.positions.slice(v*3,v*3+3);assert([vx,vy,vz].every(Number.isFinite));assert(inPolygon(vx,vz,ring),'ROCK_FOOTPRINT_EXPANDED');assert(vy<=maxY+.000002,'ROCK_HEIGHT_EXPANDED');actualMax=Math.max(actualMax,vy);lowest=Math.min(lowest,vy);
   assert(component.vertices.includes(built.sourceVertexIndices[v]),'MATERIAL_SOURCE_OUTSIDE_COMPONENT');const normal=built.normals.slice(v*3,v*3+3);assert(Math.abs(Math.hypot(...normal)-1)<.00001,'ROCK_NORMAL_INVALID');
   assert([...built.baseColorsLinear.slice(v*4,v*4+4)].every(c=>Number.isFinite(c)&&c>=0&&c<=1),'ROCK_COLOR_INVALID');
  }
  assert(Math.abs(actualMax-maxY)<.000002,'ORIGINAL_MAXIMUM_HEIGHT_LOST');
  assert(record.contacts.length>=12,'CONTACT_WITNESSES_MISSING');
  for(const q of record.contacts){assert(q.vertexIndex>=record.vertexStart&&q.vertexIndex<record.vertexStart+record.vertexCount);const [vx,vy,vz]=built.positions.slice(q.vertexIndex*3,q.vertexIndex*3+3),hit=surface(raw,vx,vz);assert.equal(q.x,vx);assert.equal(q.z,vz);assert.equal(q.meshY,vy);assert.equal(q.triangleId,hit.triangleId);assert(Math.abs(q.terrainY-hit.y)<.000002);const burial=hit.y-vy;assert(burial>0,'FLOATING_ROCK_BASE');if(q.layer===0){assert(burial>=.10,'MINIMUM_BURIAL');lowerContacts++;minBurial=Math.min(minBurial,burial);}}
  assert(lowerContacts>=12);
  for(let j=record.indexStart;j<record.indexStart+record.indexCount;j+=3){const tri=[...built.indices.slice(j,j+3)];assert(tri.every(v=>v>=record.vertexStart&&v<record.vertexStart+record.vertexCount),'CROSS_COMPONENT_TRIANGLE');const [a,b,c]=tri.map(v=>built.positions.slice(v*3,v*3+3)),u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'DEGENERATE_ROCK_TRIANGLE');}
  accountedVertices+=record.vertexCount;accountedIndices+=record.indexCount;reports.push({id:footprint.id,center:{x,z},vertices:record.vertexCount,triangles:record.indexCount/3,maximumY:actualMax,lowestY:lowest,lowerContacts});
 }
 const rendererGpuBytes=n*69+built.indices.byteLength;assert(rendererGpuBytes<=256928,'ROCK_GPU_BUDGET');assert(8131680+rendererGpuBytes<=8388608,'COMBINED_GPU_BUDGET');
 assert.equal(accountedVertices,n);assert.equal(accountedIndices,built.indices.length);assert.equal(hash(JSON.stringify(raw)),original,'WORLD_MUTATED');
 return {schema:'H_EARTH_FOUR_TREE_ROCK_PRESENTATION_INDEPENDENT_v1',result:'PASS',rocks:reports,vertices:n,triangles:built.indices.length/3,suppressedOriginalTriangles:224,preservedOriginalRockTriangles:336,minLowerBurial:minBurial,rendererGpuBytes,combinedGrassRockGpuBytes:8131680+rendererGpuBytes,coreGeometryBytes:built.positions.byteLength+built.normals.byteLength+built.baseColorsLinear.byteLength+built.indices.byteLength,qualificationBoundaries:{gpuAccounting:'RENDERER_BUFFERS_MUST_INCLUDE_COPIED_ATTRIBUTES',shadowAndState:'SEPARATE_RENDERER_AUDIT_REQUIRED',appearance:'SEPARATE_CHEAP_AND_BROWSER_VIEWS_REQUIRED'}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),i=args.indexOf('--world'),world=fs.readFileSync(i<0?new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',ROOT):args[i+1]);assert.equal(hash(world),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const report=verifyFourTreeRockPresentation(JSON.parse(gunzipSync(world)).raw);report.worldSha256=hash(world);report.moduleSha256=hash(fs.readFileSync(new URL('showroom/globe/h-earth/render/woodland-rock-presentation.v1.js',ROOT)));console.log(JSON.stringify(report,null,2));
}
