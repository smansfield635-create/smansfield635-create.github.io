import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import {sampleHEarthGen311PlacementStructureDisposition} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {createHash} from 'node:crypto';
import {getHEarthRun8ER2ImmutableLiveRenderPackage,getHEarthRun8ER2VegetationWorldTruthPlan,createHEarthRun8ER2VegetationPresentationBatch} from './live-render-package.run8e-r2.js';
import {constructHEarthGen2515VegetationPresentationBatch} from './run8e-successor-environment.js';
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const pkg=getHEarthRun8ER2ImmutableLiveRenderPackage();
assert.equal(pkg.eligible,true);
const packageBefore=digest(pkg), selectedAnchors=[];
const sourceHashes=Object.fromEntries(['grass-lowland-trial.js','live-render-package.run8e-r2.js','grass-lowland-trial.verify.mjs'].map(path=>[path,createHash('sha256').update(readFileSync(new URL(path,import.meta.url))).digest('hex')]));
const triangles=[];
for(const span of pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'))for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3){
 const v=pkg.buffers.indices.slice(i,i+3).map(n=>({x:Math.fround(pkg.buffers.positions[n*3]),y:Math.fround(pkg.buffers.positions[n*3+1]),z:Math.fround(pkg.buffers.positions[n*3+2])}));
 if(Math.max(...v.map(p=>p.x)) < -33 || Math.min(...v.map(p=>p.x)) > -15 || Math.max(...v.map(p=>p.z)) < -159 || Math.min(...v.map(p=>p.z)) > -141)continue;
 triangles.push(v);
}
function terrainY(p){for(const [a,b,c] of triangles){const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(d)<1e-12)continue;const u=((b.z-c.z)*(p.x-c.x)+(c.x-b.x)*(p.z-c.z))/d,v=((c.z-a.z)*(p.x-c.x)+(a.x-c.x)*(p.z-c.z))/d,w=1-u-v;if(Math.min(u,v,w)>=-1e-7)return u*a.y+v*b.y+w*c.y;}throw Error('ROOT_OUTSIDE_TERRAIN');}
const truth=getHEarthRun8ER2VegetationWorldTruthPlan();assert.equal(truth.batches.length,108);
let count=0,unchanged=0,changed=0,roots=0,maxRootError=0,triangleCount=0;const changedPlacements=new Set(),allIds=new Set();
for(const descriptor of truth.batches){
 const original=constructHEarthGen2515VegetationPresentationBatch(descriptor.batchId),candidate=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId),repeat=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId);
 assert.equal(candidate.eligible,true);assert.equal(candidate.instanceCount,original.instanceCount);assert.deepEqual(candidate.placementIds,original.placementIds);assert.equal(candidate.primitives.length,original.primitives.length);assert.equal(digest(candidate),digest(repeat),'repeat differs');count+=candidate.instanceCount;
 for(const id of candidate.placementIds){assert(!allIds.has(id));allIds.add(id);}
 for(let i=0;i<original.primitives.length;i++){
  const before=original.primitives[i],after=candidate.primitives[i];assert.equal(before.primitiveId,after.primitiveId);
  if(digest(before)===digest(after)){unchanged++;continue;}
  changed++;const anchor=before.metadata.worldAnchor;selectedAnchors.push({placementId:before.metadata.gen2514PlacementId,...anchor});assert(anchor.x>=-32&&anchor.x<=-16&&anchor.z>=-158&&anchor.z<=-142);assert.equal(before.materialHint.archetypeId,'COASTAL_GRASS_TUFT');changedPlacements.add(before.metadata.gen2514PlacementId);assert.deepEqual(after.materialHint,before.materialHint);
  for(const [key,value] of Object.entries(before.metadata))assert.deepEqual(after.metadata[key],value,`metadata changed: ${key}`);
  const g=after.geometry;assert(g.vertices.length>before.geometry.vertices.length);
  for(const v of g.vertices){assert([v.x,v.y,v.z].every(Number.isFinite));assert(v.x>=-32&&v.x<=-16&&v.z>=-158&&v.z<=-142);}
  for(const n of g.normals??[])assert([n.x,n.y,n.z].every(Number.isFinite));
  for(let j=0;j<g.indices.length;j+=3){const [a,b,c]=g.indices.slice(j,j+3).map(n=>{assert(Number.isInteger(n)&&n>=0&&n<g.vertices.length);return g.vertices[n];});const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'degenerate triangle');triangleCount++;}
  const points=after.metadata.lowlandGrassTrial.rootPoints;assert(points.length>=96);
  for(const p of points){const vertex=g.vertices[p.vertexIndex];assert(vertex);const soil=sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x,vertex.z);assert.equal(soil.valid,true);assert(['LOWLAND_SOIL','COASTAL_SOIL'].includes(soil.surfaceClass));assert(Number.isFinite(soil.slope)&&soil.slope<=.45);const estate=sampleHEarthGen311PlacementStructureDisposition(vertex.x,vertex.z);assert.equal(estate.status,'NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP');assert.equal(estate.hardExclusions.length,0);assert.equal(estate.planningHolds.length,0);const err=Math.abs(vertex.y-terrainY(vertex));assert(err<=0.00002,`root error ${err}`);maxRootError=Math.max(maxRootError,err);roots++;}
 }
}
assert.equal(count,27585);assert.equal(allIds.size,27585);assert.equal(changedPlacements.size,4);assert.equal(changed,4);
const packageAfter=digest(pkg);assert.equal(packageAfter,packageBefore);
console.log(JSON.stringify({status:'PASS',sourceHashes,packageBefore,packageAfter,selectedAnchors,instanceCount:count,batchCount:truth.batches.length,changedPrimitives:changed,changedPlacementIds:[...changedPlacements],unchangedPrimitives:unchanged,rootCount:roots,maxRootErrorMeters:maxRootError,trialTriangleCount:triangleCount,deterministic:true,contactSurface:'BASE_PACKAGE_FLOAT32_TRIANGLES',refinementActivationVerified:false},null,2));
