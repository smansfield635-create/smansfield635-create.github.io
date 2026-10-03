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
const helperSource=readFileSync(new URL('grass-lowland-trial.js',import.meta.url),'utf8'),acceptedStart=helperSource.indexOf('function replaceTuft('),acceptedFunctionSha256=createHash('sha256').update(helperSource.slice(acceptedStart,helperSource.indexOf('/**',acceptedStart))).digest('hex');
assert.equal(acceptedFunctionSha256,'7a908ba17b685bd6dcaf2c197e2bb9750b56f41d1ced1cbd727a30de7263ec5d','accepted blade builder changed');
const triangles=[],waterTriangles=[];
for(const span of pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'||s.primitiveId.endsWith(':FAR_OCEAN_CONTINUATION')))for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3){
 const v=pkg.buffers.indices.slice(i,i+3).map(n=>({x:Math.fround(pkg.buffers.positions[n*3]),y:Math.fround(pkg.buffers.positions[n*3+1]),z:Math.fround(pkg.buffers.positions[n*3+2])}));
 if(Math.max(...v.map(p=>p.x)) < -33 || Math.min(...v.map(p=>p.x)) > 3 || Math.max(...v.map(p=>p.z)) < -175 || Math.min(...v.map(p=>p.z)) > -141)continue;
 (span.role==='TERRAIN'?triangles:waterTriangles).push(v);
}
function terrainY(p,source=triangles){for(const [a,b,c] of source){const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(d)<1e-12)continue;const u=((b.z-c.z)*(p.x-c.x)+(c.x-b.x)*(p.z-c.z))/d,v=((c.z-a.z)*(p.x-c.x)+(a.x-c.x)*(p.z-c.z))/d,w=1-u-v;if(Math.min(u,v,w)>=-1e-7)return u*a.y+v*b.y+w*c.y;}throw Error('ROOT_OUTSIDE_TERRAIN');}
let oasisPrimitives=0,oasisGrass=0,oasisCattails=0,oasisHeads=0,oasisTriangles=0,oasisRoots=0,wetMin=Infinity,wetMax=-Infinity,dryMin=Infinity,dryMax=-Infinity;
function verifyOasis(p){
 const g=p.geometry,m=p.metadata.oasisFoliage,head=m.kind==='ROUNDED_CATTAIL_SEEDHEAD',wet=m.kind==='CATTAIL_STEM_AND_LEAVES';assert(m);oasisPrimitives++;if(head)oasisHeads++;else if(wet)oasisCattails++;else oasisGrass++;
 for(const v of g.vertices){assert([v.x,v.y,v.z].every(Number.isFinite));assert(v.x>=-14&&v.x<=2&&v.z>=-174&&v.z<=-158,'oasis vertex outside');}
 const edges=new Map();let volume=0;
 for(let i=0;i<g.indices.length;i+=3){const ids=g.indices.slice(i,i+3),[a,b,c]=ids.map(n=>{assert(Number.isInteger(n)&&n>=0&&n<g.vertices.length);return g.vertices[n];});const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'oasis degenerate');oasisTriangles++;volume+=a.x*(b.y*c.z-b.z*c.y)+a.y*(b.z*c.x-b.x*c.z)+a.z*(b.x*c.y-b.y*c.x);for(let e=0;e<3;e++){let a=ids[e],b=ids[(e+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(':');let item=edges.get(key)??{count:0,orientation:0};item.count++;item.orientation+=a<b?1:-1;edges.set(key,item);}}
 if(head){assert(volume>0,'head outward volume');for(const e of edges.values()){assert.equal(e.count,2,'head not closed');assert.equal(e.orientation,0,'head winding');}assert.equal(m.rootPoints.length,0);return;}
 assert(m.rootPoints.length>0);
 for(const p of m.rootPoints){const v=g.vertices[p.vertexIndex];assert(v);const y=terrainY(v),wy=terrainY(v,waterTriangles),clearance=y-wy;assert(Math.abs(v.y-y)<=.00002,'oasis root contact');const soil=sampleHEarthRun8CSuccessorSurfaceMaterial(v.x,v.z),estate=sampleHEarthGen311PlacementStructureDisposition(v.x,v.z);assert(soil.valid&&['LOWLAND_SOIL','COASTAL_SOIL'].includes(soil.surfaceClass)&&Number.isFinite(soil.slope)&&soil.slope<=.45);assert.equal(estate.status,'NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP');assert.equal(estate.hardExclusions.length,0);assert.equal(estate.planningHolds.length,0);if(wet){assert(clearance>=-.30002&&clearance<=.18002);wetMin=Math.min(wetMin,clearance);wetMax=Math.max(wetMax,clearance);}else{assert(clearance>=.03498&&clearance<=1.10002);dryMin=Math.min(dryMin,clearance);dryMax=Math.max(dryMax,clearance);}oasisRoots++;}
}
const truth=getHEarthRun8ER2VegetationWorldTruthPlan();assert.equal(truth.batches.length,108);
let count=0,unchanged=0,changed=0,roots=0,maxRootError=0,triangleCount=0,suppressed=0,rendered=0,emptyBatches=0;const suppressedByArchetype={},unchangedByArchetype={};const changedPlacements=new Set(),allIds=new Set();
for(const descriptor of truth.batches){
 const original=constructHEarthGen2515VegetationPresentationBatch(descriptor.batchId),candidate=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId),repeat=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId);
 assert.equal(candidate.eligible,true);assert.equal(candidate.instanceCount,original.instanceCount);assert.deepEqual(candidate.placementIds,original.placementIds);assert.equal(digest(candidate),digest(repeat),'repeat differs');count+=candidate.instanceCount;
 for(const id of candidate.placementIds){assert(!allIds.has(id));allIds.add(id);}
 const byId=new Map(candidate.primitives.map(p=>[p.primitiveId,p]));assert.equal(byId.size,candidate.primitives.length);rendered+=candidate.primitives.length;if(!candidate.primitives.length)emptyBatches++;let batchSuppressed=0;
 for(const p of candidate.primitives){if(p.metadata?.oasisFoliage){assert.equal(candidate.batchId,'GEN2514_BATCH:H_EARTH_GEN311_PLACEMENT:0001527b');verifyOasis(p);continue;}assert(original.primitives.some(before=>before.primitiveId===p.primitiveId),'new primitive identity');assert(p.materialHint.archetypeId!=='COASTAL_GRASS_TUFT'||p.metadata.lowlandGrassTrial,'legacy grass rendered');}
 for(let i=0;i<original.primitives.length;i++){
  const before=original.primitives[i],after=byId.get(before.primitiveId),archetype=before.materialHint.archetypeId;
  if(!after){assert.equal(archetype,'COASTAL_GRASS_TUFT','nongrass suppressed');const a=before.metadata.worldAnchor;assert(!(a.x>=-32&&a.x<=-16&&a.z>=-158&&a.z<=-142),'accepted patch suppressed');suppressed++;batchSuppressed++;suppressedByArchetype[archetype]=(suppressedByArchetype[archetype]??0)+1;continue;}
  assert.equal(before.primitiveId,after.primitiveId);
  if(archetype!=='COASTAL_GRASS_TUFT'){assert.equal(digest(before),digest(after),'nongrass changed');unchanged++;unchangedByArchetype[archetype]=(unchangedByArchetype[archetype]??0)+1;continue;}
  changed++;const anchor=before.metadata.worldAnchor;selectedAnchors.push({placementId:before.metadata.gen2514PlacementId,...anchor});assert(anchor.x>=-32&&anchor.x<=-16&&anchor.z>=-158&&anchor.z<=-142);assert.equal(before.materialHint.archetypeId,'COASTAL_GRASS_TUFT');changedPlacements.add(before.metadata.gen2514PlacementId);assert.deepEqual(after.materialHint,before.materialHint);
  for(const [key,value] of Object.entries(before.metadata))assert.deepEqual(after.metadata[key],value,`metadata changed: ${key}`);
  const g=after.geometry;assert(g.vertices.length>before.geometry.vertices.length);
  for(const v of g.vertices){assert([v.x,v.y,v.z].every(Number.isFinite));assert(v.x>=-32&&v.x<=-16&&v.z>=-158&&v.z<=-142);}
  for(const n of g.normals??[])assert([n.x,n.y,n.z].every(Number.isFinite));
  for(let j=0;j<g.indices.length;j+=3){const [a,b,c]=g.indices.slice(j,j+3).map(n=>{assert(Number.isInteger(n)&&n>=0&&n<g.vertices.length);return g.vertices[n];});const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'degenerate triangle');triangleCount++;}
  const points=after.metadata.lowlandGrassTrial.rootPoints;assert(points.length>=96);
  for(const p of points){const vertex=g.vertices[p.vertexIndex];assert(vertex);const soil=sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x,vertex.z);assert.equal(soil.valid,true);assert(['LOWLAND_SOIL','COASTAL_SOIL'].includes(soil.surfaceClass));assert(Number.isFinite(soil.slope)&&soil.slope<=.45);const estate=sampleHEarthGen311PlacementStructureDisposition(vertex.x,vertex.z);assert.equal(estate.status,'NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP');assert.equal(estate.hardExclusions.length,0);assert.equal(estate.planningHolds.length,0);const err=Math.abs(vertex.y-terrainY(vertex));assert(err<=0.00002,`root error ${err}`);maxRootError=Math.max(maxRootError,err);roots++;}
 }
 if(candidate.lowlandGrassTrial){assert.equal(candidate.lowlandGrassTrial.suppressedLegacyGrassCount,batchSuppressed);assert.equal(candidate.lowlandGrassTrial.renderedPrimitiveCount,candidate.primitives.length);assert.equal(candidate.lowlandGrassTrial.completeWorldPlacementPresentationClaimed,false);}
}
assert(suppressed>0);assert.equal(rendered,unchanged+changed+oasisPrimitives);assert.equal(oasisGrass,24);assert.equal(oasisCattails,18);assert.equal(oasisHeads,18);assert(oasisTriangles<=100000);
assert.equal(count,27585);assert.equal(allIds.size,27585);assert.equal(changedPlacements.size,4);assert.equal(changed,4);
const packageAfter=digest(pkg);assert.equal(packageAfter,packageBefore);
console.log(JSON.stringify({status:'PASS',acceptedFunctionSha256,oasis:{primitiveCount:oasisPrimitives,grassTuftCount:oasisGrass,cattailCount:oasisCattails,closedSeedheadCount:oasisHeads,triangleCount:oasisTriangles,rootCount:oasisRoots,dryClearanceMeters:[dryMin,dryMax],wetClearanceMeters:[wetMin,wetMax],bounds:{minX:-14,maxX:2,minZ:-174,maxZ:-158}},sourceHashes,packageBefore,packageAfter,selectedAnchors,instanceCount:count,batchCount:truth.batches.length,changedPrimitives:changed,changedPlacementIds:[...changedPlacements],unchangedNongrassPrimitives:unchanged,unchangedByArchetype,suppressedLegacyGrassPrimitives:suppressed,suppressedByArchetype,renderedPrimitiveCount:rendered,consumedPlacementCount:count,emptyPresentationBatches:emptyBatches,renderedLegacyGrassCount:0,rootCount:roots,maxRootErrorMeters:maxRootError,trialTriangleCount:triangleCount,deterministic:true,contactSurface:'BASE_PACKAGE_FLOAT32_TRIANGLES',refinementActivationVerified:false},null,2));
