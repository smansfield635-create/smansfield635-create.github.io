#!/usr/bin/env node
/** Independent four-tree presentation audit. Reads the immutable cached world; never rebuilds it. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {sampleHEarthGen311PlacementStructureDisposition,H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from '../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {buildWoodlandFineGrass,selectWoodlandFineGrass,filterWoodlandLegacyGrass,buildWoodlandFineGrassIndices,WOODLAND_FINE_GRASS} from '../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const ROOT=new URL('../../',import.meta.url);
export const FOUR_TREE_VIEWS=Object.freeze([[-139.403,-194.5],[-139.403,-236],[-119,-216],[-164,-216],[-141,-214]]);
// Independent copied geometry predicates: these do not call the presentation builder's sampler.
const radius=420000;
function inverse(x,y,z){const h=Math.hypot(x,z),a=Math.atan2(h,y+radius),k=h?a*radius/h:0;return {x:x*k,z:z*k,y:Math.hypot(h,y+radius)-radius};}
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz,t=den?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/den)):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function rectangleDistance(x,z,b){return Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)));}
function clear(x,z,margin=0){
 for(const b of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])assert(rectangleDistance(x,z,b)>margin,'PROTECTED_ESTATE_OVERLAP');
 for(let i=1;i<estate.footRoute.length;i++)assert(segmentDistance(x,z,estate.footRoute[i-1],estate.footRoute[i])>estate.footRouteRadius+margin,'ESTATE_ROUTE_OVERLAP');

 const disposition=sampleHEarthGen311PlacementStructureDisposition(x,z);assert(!disposition.hardExclusions.length&&!disposition.planningHolds.length,'PROTECTED_HOLD_OVERLAP');
}
function preserved(x,z,margin=0){return Math.hypot((x+141)/33,(z+226)/32)<=1.25+margin/32||x>=oasis.minX-margin&&x<=oasis.maxX+margin&&z>=oasis.minZ-margin&&z<=oasis.maxZ+margin;}
function triangle(vertices,id,owner){const [a,b,c]=vertices,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,ex=c.x-a.x,ey=c.y-a.y,ez=c.z-a.z,den=dx*ez-dz*ex,ny=dz*ex-dx*ez;return {vertices,id,owner,den,slope:Math.abs(ny)>1e-12?Math.hypot(dy*ez-dz*ey,dx*ey-dy*ex)/Math.abs(ny):Infinity,box:[Math.min(a.x,b.x,c.x),Math.min(a.z,b.z,c.z),Math.max(a.x,b.x,c.x),Math.max(a.z,b.z,c.z)]};}
function interpolate(t,x,z){if(Math.abs(t.den)<1e-12)return null;const [a,b,c]=t.vertices,bw=((x-a.x)*(c.z-a.z)-(z-a.z)*(c.x-a.x))/t.den,cw=((b.x-a.x)*(z-a.z)-(b.z-a.z)*(x-a.x))/t.den,aw=1-bw-cw;if(Math.min(aw,bw,cw)<-1e-7)return null;return {y:aw*a.y+bw*b.y+cw*c.y,slope:t.slope,triangle:t};}
function tree(values){if(!values.length)return null;const box=[Infinity,Infinity,-Infinity,-Infinity];for(const t of values){box[0]=Math.min(box[0],t.box[0]);box[1]=Math.min(box[1],t.box[1]);box[2]=Math.max(box[2],t.box[2]);box[3]=Math.max(box[3],t.box[3]);}if(values.length<=12)return {box,values};const axis=box[2]-box[0]>box[3]-box[1]?0:1;values.sort((a,b)=>(a.box[axis]+a.box[axis+2])-(b.box[axis]+b.box[axis+2])||a.id-b.id);const mid=values.length>>1;return {box,left:tree(values.slice(0,mid)),right:tree(values.slice(mid))};}
function candidates(node,x,z,out=[]){if(!node||x<node.box[0]-1e-7||z<node.box[1]-1e-7||x>node.box[2]+1e-7||z>node.box[3]+1e-7)return out;if(node.values)out.push(...node.values);else {candidates(node.left,x,z,out);candidates(node.right,x,z,out);}return out;}
function independentSurface(pkg,refinement=null){const terrain=[],water=[],patch=[];
 for(const span of pkg.primitiveSpans){const owner=span.role==='TERRAIN'?'NEAR':span.primitiveId.includes('FAR_LAND_CONTINUATION')?'FAR':span.primitiveId.includes('FAR_OCEAN_CONTINUATION')?'WATER':null;if(!owner)continue;for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3){const vertices=[0,1,2].map(k=>{const j=pkg.buffers.indices[i+k]*3;return {x:Math.fround(pkg.buffers.positions[j]),y:Math.fround(pkg.buffers.positions[j+1]),z:Math.fround(pkg.buffers.positions[j+2])};});(owner==='WATER'?water:terrain).push(triangle(vertices,i/3,owner));}}
 if(refinement)for(let i=0;i<refinement.indices.length;i+=3){const vertices=[0,1,2].map(k=>{const j=refinement.indices[i+k]*3;return {x:Math.fround(refinement.positions[j]),y:Math.fround(refinement.positions[j+1]),z:Math.fround(refinement.positions[j+2])};});patch.push(triangle(vertices,i/3,'REFINEMENT'));}
 const terrainTree=tree(terrain.slice()),waterTree=tree(water.slice()),patchTree=tree(patch.slice());
 const find=(index,x,z)=>candidates(index,x,z).sort((a,b)=>a.id-b.id).map(t=>interpolate(t,x,z)).find(Boolean)??null;
 return {terrain,water,patch,land:(x,z)=>refinement&&x>refinement.clip[0]&&x<refinement.clip[1]&&z>refinement.clip[2]&&z<refinement.clip[3]?find(patchTree,x,z):find(terrainTree,x,z),ocean:(x,z)=>find(waterTree,x,z)};
}

function habitat(material,slope,tag=0){
 if(material?.valid!==true||slope>.35)return false;
 if(tag===4)return material.surfaceClass==='DRY_SAND'&&slope<=.18&&material.shorelineDistance>=16&&material.shorelineDistance<=34&&material.rockExposure<.28&&material.soilDepth>=.35;
 return material.surfaceClass==='STONE_AND_SPARSE_SOIL'?material.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)&&material.soilDepth>=.20;
}

function inside(x,y,z){const a=inverse(x,y,z);return Math.hypot((a.x+141)/41.25,(a.z+226)/40)<=1;}
export async function verifyFourTreeFineGrass(raw,{presentation=null,onPresentation=()=>{}}={}){
 const original=digest(JSON.stringify(raw)),surface=independentSurface(raw);
 const indicesTemplate=buildWoodlandFineGrassIndices();assert.equal(indicesTemplate.byteLength,12288);assert.equal(WOODLAND_FINE_GRASS.rootTextureBytes,1024*64*16);
 for(let leaf=0;leaf<256;leaf++)assert.deepEqual(Array.from(indicesTemplate.slice(leaf*12,leaf*12+12)),[0,1,2,1,3,2,2,3,4,3,5,4].map(i=>leaf*6+i),'ACCEPTED_CURVED_LEAF_TOPOLOGY_CHANGED');
 const combinedGrassGpuBytes=7070816+WOODLAND_FINE_GRASS.rootTextureBytes+indicesTemplate.byteLength;assert(combinedGrassGpuBytes<=8388608,'SHARED_GPU_BUDGET');
 const built=presentation??await buildWoodlandFineGrass(raw);onPresentation(built);
 let contacts=0,maxGroundError=0;const occupied=new Set(),positions=new Set(),classes={},rootBins=new Map();
 for(const tile of built.tiles)for(const q of tile.roots){
  const x=Math.fround(q.x),y=Math.fround(q.y),z=Math.fround(q.z),hit=surface.land(x,z);
  assert(hit,'ROOT_TERRAIN_MISSING');const error=Math.abs(y-hit.y);assert(error<.00001,'ROOT_TERRAIN_ERROR');maxGroundError=Math.max(error,maxGroundError);
  assert.equal(hit.triangle.id,q.triangleId,'ROOT_TRIANGLE_CHANGED');assert(inside(x,y,z),'ROOT_OUTSIDE_WOODLAND');
  const a=inverse(x,y,z),m=materialAt(a.x,a.z);assert(habitat(m,hit.slope),'ROOT_MATERIAL_OR_SLOPE');clear(a.x,a.z,.03);
  assert(!(a.x>=oasis.minX-.05&&a.x<=oasis.maxX+.05&&a.z>=oasis.minZ-.05&&a.z<=oasis.maxZ+.05),'OASIS_OVERLAP');
  for(const obstacle of raw.landscapeCoverFootprints??[])assert(Math.hypot(x-obstacle.x,z-obstacle.z)>=obstacle.radius+.03-1e-6,'TREE_TRUNK_OVERLAP');
  const water=surface.ocean(x,z);assert(!water||y>water.y+.01,'SUBMERGED_ROOT');
  const key=x+':'+z;assert(!positions.has(key),'DUPLICATE_ROOT');positions.add(key);occupied.add(Math.floor(a.x/4)+':'+Math.floor(a.z/4));classes[m.surfaceClass]=(classes[m.surfaceClass]??0)+1;contacts++;const bin=Math.floor(x)+':'+Math.floor(z);if(!rootBins.has(bin))rootBins.set(bin,[]);rootBins.get(bin).push({x,z});
 }
 assert(contacts>0,'NO_WOODLAND_ROOTS');
 let eligibleCoverageProbes=0,coveredProbes=0;
 for(let z=-264;z<=-188;z+=4)for(let x=-180;x<=-100;x+=4){
  const hit=surface.land(x,z);if(!hit||!inside(x,hit.y,z))continue;const a=inverse(x,hit.y,z);
  if(Math.hypot((a.x+141)/41.25,(a.z+226)/40)>.95||!habitat(materialAt(a.x,a.z),hit.slope))continue;
  try{clear(a.x,a.z,.25);}catch{continue;}
  if((raw.landscapeCoverFootprints??[]).some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+.25))continue;
  const water=surface.ocean(x,z);if(water&&hit.y<=water.y+.01)continue;
  eligibleCoverageProbes++;let nearest=Infinity;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const r of rootBins.get((Math.floor(x)+dx)+':'+(Math.floor(z)+dz))??[])nearest=Math.min(nearest,Math.hypot(x-r.x,z-r.z));
  assert(nearest<=1,'ELIGIBLE_WOODLAND_COVERAGE_GAP:'+x+':'+z);coveredProbes++;
 }
 assert(eligibleCoverageProbes>100,'WOODLAND_FOOTPRINT_NOT_EXERCISED');
 const filtered=filterWoodlandLegacyGrass(raw),indices=filtered.indices;assert.equal(indices.length,raw.buffers.indices.length);
 const span=raw.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_LANDSCAPE_P2_GRASS');assert(span);
 let suppressed=0,preserved=0;const preservedTypes={};
 for(let i=0;i<indices.length;i+=3){
  const old=raw.buffers.indices.slice(i,i+3),now=Array.from(indices.slice(i,i+3));
  const inGrass=i>=span.indexStart&&i<span.indexStart+span.indexCount;
  const types=old.map(v=>raw.clearingAttributes[v*3+2]);
  const target=inGrass&&types.every(t=>t===0||t===3)&&old.some(v=>inside(...raw.buffers.positions.slice(v*3,v*3+3)));
  if(target){assert(now[0]===now[1]&&now[1]===now[2],'OLD_ANGULAR_GRASS_STILL_DRAWN');suppressed++;}
  else{assert.deepEqual(now,old,'PROTECTED_TRIANGLE_CHANGED');preserved++;if(inGrass)for(const t of new Set(types))preservedTypes[t]=(preservedTypes[t]??0)+1;}
 }
 assert(suppressed>0);assert(preservedTypes[1]>0&&preservedTypes[2]>0,'UNDERSTORY_NOT_PRESERVED');
 const views=FOUR_TREE_VIEWS.map(([x,z])=>{
  const hit=surface.land(x,z);assert(hit,'VIEW_TERRAIN_MISSING');const camera={x,y:hit.y+1.65,z};
  const selection=selectWoodlandFineGrass(built,camera,{maximumParents:1024});
  assert(selection.parentCount+3072<=4096,'SHARED_INSTANCE_BUDGET');assert(selection.draws+3<=64,'SHARED_DRAW_BUDGET');assert(selection.parentCount<=1024&&selection.parentCount>0,'PARENT_BUDGET');assert(selection.draws<=3,'DRAW_BUDGET');assert(selection.pixels.byteLength<=1048576,'ROOT_TEXTURE_BUDGET');
  let packedContacts=0;for(let i=0;i<selection.pixels.length;i+=4){const [rx,ry,rz]=selection.pixels.subarray(i,i+3);if(ry===-100000)continue;assert(positions.has(rx+':'+rz),'GPU_UNKNOWN_ROOT');const h=surface.land(rx,rz);assert(h&&Math.abs(ry-h.y)<.00001,'GPU_PACKING_GROUND_ERROR');packedContacts++;}assert.equal(packedContacts,selection.contactCount);
  assert(selection.groups.some(g=>g.level===2&&g.parentCount>0),'FAR_WOODLAND_LAYER_STARVED');
  assert(selection.groups.every(g=>g.leafCount===4),'GRADED_SELECTION_CURVED_LEAF_DENSITY_CHANGED');
  assert.equal(selection.groups.reduce((n,g)=>n+g.parentCount,0),selection.parentCount);
  assert.equal(selection.vertices,selection.groups.reduce((n,g)=>n+g.parentCount*64*g.leafCount*6,0));
  assert.equal(selection.triangles,selection.groups.reduce((n,g)=>n+g.parentCount*64*g.leafCount*4,0));
  const again=selectWoodlandFineGrass(built,camera,{maximumParents:1024});assert.equal(again.signature,selection.signature,'STATIONARY_SELECTION_CHANGED');assert.equal(digest(again.pixels),digest(selection.pixels));
  return {camera,parentCount:selection.parentCount,contactCount:selection.contactCount,vertices:selection.vertices,triangles:selection.triangles,draws:selection.draws,packedRootBytes:selection.pixels.byteLength,selectionUploadBytes:Math.ceil(selection.pixels.length/4096)*16384};
 });
 const transitionObservations=FOUR_TREE_VIEWS.map(([x,z])=>{
  const boundaryX=Math.ceil(x/4)*4,keyset=s=>new Set(s.chunks.flatMap(c=>c.roots.map(r=>r.x+':'+r.z)));
  const before=selectWoodlandFineGrass(built,{x:boundaryX-.001,z},{maximumParents:1024}),after=selectWoodlandFineGrass(built,{x:boundaryX+.001,z},{maximumParents:1024});
  const a=keyset(before),b=keyset(after);let intersection=0;for(const k of a)if(b.has(k))intersection++;
  assert(a.size&&b.size,'EMPTY_TRANSITION_SELECTION');
  return {boundaryX,z,cameraDelta:.002,selectionCenterDelta:4,beforeContacts:a.size,afterContacts:b.size,intersection,retainedFraction:intersection/a.size,jaccard:intersection/(a.size+b.size-intersection),interpretation:'MEASURED_QUANTIZED_SELECTION_CHANGE_NOT_CONTINUOUS_CAMERA_SELECTION'};
 });
 assert.equal(digest(JSON.stringify(raw)),original,'IMMUTABLE_WORLD_MUTATED');
 return {schema:'H_EARTH_FOUR_TREE_FINE_GRASS_INDEPENDENT_v1',result:'PASS',constructionExecuted:presentation===null,contacts,maxGroundError,combinedGrassGpuBytes,eligibleCoverageProbes,coveredProbes,occupiedFourMetreCells:occupied.size,classes,suppressed,preserved,preservedTypes,views,transitionObservations,qualificationBoundaries:{cheapTreeTerrainViews:'SEPARATE_REQUIRED',sharedRendererBudgets:'ALLOCATION_AND_RESERVATION_AUDITED_BROWSER_PENDING',actualBrowser:'SEPARATE_REQUIRED',ownerAcceptance:'PENDING'}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];};
 const world=fs.readFileSync(arg('--world')??new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',ROOT));
 assert.equal(digest(world),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a','IMMUTABLE_WORLD_BYTES_CHANGED');
 const renderer=fs.readFileSync(new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',ROOT),'utf8');
 assert.equal(digest(renderer.match(/const FS = `[\s\S]*?`;/)[0]),'5468a720408019c3bb1c9ec747abb74c3436c02fd3d695e9865e4731b2b2c469','SOIL_SHADER_CHANGED');
 assert(renderer.includes("resources.globalCover.gpuByteLength+state.gpuByteLength+(resources.woodlandRocks?.gpuByteLength??0)>8388608"),'RUNTIME_SHARED_GPU_GUARD_MISSING');
 assert(renderer.includes('4096-partition.ids.length'),'RUNTIME_SHARED_INSTANCE_RESERVATION_MISSING');
 assert(renderer.includes('partition.drawCount+(resources.woodlandFineGrass?.lastDraw.drawCallCount??0)>64'),'RUNTIME_SHARED_DRAW_GUARD_MISSING');
 const generator=fs.readFileSync(new URL('showroom/globe/h-earth/render/landscape-groundcover.global-v1.js',ROOT),'utf8');
 assert.equal(digest(generator.split('export function buildHEarthMeadowPresentationRoots')[0]),'b7f5b245e526560142745435062a6b4e188a596db0414b08cba880ae8baa0ada','ORIGINAL_GENERATOR_CHANGED');
 const moduleSha256=digest(fs.readFileSync(new URL('showroom/globe/h-earth/render/woodland-fine-grass.v1.js',ROOT)));
 let cached=null;if(arg('--presentation')){const value=JSON.parse(fs.readFileSync(arg('--presentation')));assert.equal(value.moduleSha256,moduleSha256,'STALE_PRESENTATION_CACHE');assert.equal(value.worldSha256,digest(world));cached=value.presentation;}
 const report=await verifyFourTreeFineGrass(JSON.parse(gunzipSync(world)).raw,{presentation:cached,onPresentation:p=>{if(arg('--write-presentation'))fs.writeFileSync(arg('--write-presentation'),JSON.stringify({moduleSha256,worldSha256:digest(world),presentation:p}));}});
 report.moduleSha256=moduleSha256;report.worldSha256=digest(world);
 console.log(JSON.stringify(report,null,2));
}
