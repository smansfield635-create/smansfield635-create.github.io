#!/usr/bin/env node
/** Independent four-tree presentation audit. Reads the immutable cached world; never rebuilds it. */
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {sampleHEarthGen311PlacementStructureDisposition,H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from '../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {buildWoodlandFineGrass,selectWoodlandFineGrass,filterWoodlandLegacyGrass,buildWoodlandFineGrassIndices,WOODLAND_FINE_GRASS} from '../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js?rev=gen2780-stable-planting-v1';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const ROOT=new URL('../../',import.meta.url);
/** Selector-generation contract; historical spelling is retained only for its original implementation. */
export function verifyFineGrassSelectorContract({grass,renderer,runContinuitySuite=()=>spawnSync(process.execPath,['--test','--test-reporter=tap',fileURLToPath(new URL('h-earth-3d/validation/h-earth.fine-grass-continuity.v1.test.mjs',ROOT))],{cwd:fileURLToPath(ROOT),encoding:'utf8',env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='NODE_TEST_CONTEXT'))})}){
 const continuous=grass.includes('export const FINE_GRASS_CONTINUITY=');
 if(!continuous){
  assert(!renderer.includes('WOODLAND_FINE_GRASS_FS'),'CONTINUITY_SELECTOR_MARKER_MISSING');
  assert(grass.includes('c.persistentIndices')&&grass.includes('fixedCount'),'GEN2710_WORLD_FIXED_GRASS_UNDERLAY_MISSING');
  return {generation:null};
 }
 assert(grass.includes('export function fineGrassVisibility(')&&grass.includes('export function fineGrassImportance('),'CONTINUITY_VISIBILITY_CONTRACT_MISSING');
 assert(renderer.includes('uniform3f(state.uniforms.uWoodlandCameraPosition')&&renderer.includes('uniform1f(state.uniforms.uWoodlandSelectionCutoff,selection.cutoff)'),'CONTINUITY_UNIFORM_WIRING_MISSING');
 assert(renderer.includes('createShader(gl.FRAGMENT_SHADER,WOODLAND_FINE_GRASS_FS)'),'CONTINUITY_COVERAGE_SHADER_MISSING');
 const result=runContinuitySuite();
 assert.equal(result?.status,0,'CONTINUITY_BEHAVIORAL_TESTS_FAILED');
 const output=result.stdout??'';
 assert(/^# tests 13\s*$/m.test(output)&&/^# fail 0\s*$/m.test(output)&&/^# pass (12|13)\s*$/m.test(output),'CONTINUITY_BEHAVIORAL_EVIDENCE_MISSING');
 return {generation:2785,continuitySourceTests:'PASS_CPU_SOURCE_SOFTWARE_GLES_WHEN_AVAILABLE'};
}
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
 return {terrain,water,patch,land:(x,z)=>refinement&&x>refinement.clip[0]&&x<refinement.clip[2]&&z>refinement.clip[1]&&z<refinement.clip[3]?find(patchTree,x,z):find(terrainTree,x,z),ocean:(x,z)=>find(waterTree,x,z)};
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
 const earlyPrioritySnapshots=[];
 const built=presentation??await buildWoodlandFineGrass(raw,{
   priorityOrigin:{x:-139.40667724609375,z:-208.5037078857422},
   onPriorityPreview:snapshot=>{
     assert.equal(snapshot.receipt.schema,'H_EARTH_WOODLAND_FINE_GRASS_PRIORITY_PREVIEW_v1');
     assert.equal(snapshot.receipt.originalRecordsChanged,false);
     assert.equal(snapshot.receipt.terrainChanged,false);
     assert.equal(snapshot.receipt.actualPixelsVerified,false);
     earlyPrioritySnapshots.push({radius:snapshot.receipt.priorityRadiusMeters,
       processedCells:snapshot.receipt.processedCells,
       contacts:snapshot.receipt.contactCount,
       sourceAccepted:snapshot.receipt.sourceAcceptedCount,
       featherRule:snapshot.receipt.featherRule,
       roots:snapshot.tiles.flatMap(t=>t.roots.map(r=>r.x+':'+r.y+':'+r.z))});
   }
 });onPresentation(built);
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
 if(presentation===null){
   assert(earlyPrioritySnapshots.length>=2,'PRIORITY_WOODLAND_EARLY_PREVIEW_MISSING');
   assert(earlyPrioritySnapshots.every(s=>[4,9,17].includes(s.radius)),
     'PRIORITY_WOODLAND_CAMERA_PATCH_RADIUS_DRIFT');
   assert(earlyPrioritySnapshots[0].processedCells<10000,
     'PRIORITY_WOODLAND_FIRST_FRAME_TOO_MUCH_SURVEY_WORK');
   const full=new Set(built.tiles.flatMap(t=>t.roots.map(r=>r.x+':'+r.y+':'+r.z)));
   assert(earlyPrioritySnapshots.some(s=>s.contacts<s.sourceAccepted),
     'WOODLAND_PREVIEW_IRREGULAR_FEATHER_NOT_EXERCISED');
   let lastCount=0,lastCells=0,lastRadius=0;
   for(const snapshot of earlyPrioritySnapshots){
     assert(snapshot.radius>lastRadius,'WOODLAND_PRIORITY_RADIUS_NOT_EXPANDING');
     assert(snapshot.processedCells>lastCells,'WOODLAND_PRIORITY_GRID_NOT_EXPANDING');
     lastRadius=snapshot.radius;lastCells=snapshot.processedCells;
     assert(snapshot.contacts>lastCount,'PRIORITY_WOODLAND_SNAPSHOT_NOT_GROWING');
     assert(snapshot.contacts<=snapshot.sourceAccepted,'PREVIEW_HAS_NEW_UNACCEPTED_CONTACTS');
     assert.equal(snapshot.featherRule,'SOURCE_ONLY_DETERMINISTIC_IRREGULAR_RADIAL_TAPER_NO_NEW_ROOTS');
     assert.equal(snapshot.contacts,snapshot.roots.length,'PRIORITY_WOODLAND_SNAPSHOT_ROOT_CENSUS_DRIFT');
     assert(snapshot.roots.every(key=>full.has(key)),'PRIORITY_WOODLAND_PREVIEW_ROOT_NOT_FINAL');
     lastCount=snapshot.contacts;
   }
   assert(lastCount<contacts,'PRIORITY_WOODLAND_PREVIEW_CLAIMS_FULL_POPULATION');
 }
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
  const target=inGrass&&types.every(t=>t===types[0])&&(types[0]===0||types[0]===3);
  if(target){assert(now[0]===now[1]&&now[1]===now[2],'RETIRED_P2_BROAD_GRASS_STILL_DRAWN');suppressed++;}
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
  assert(intersection/a.size>=.30,'CAMERA_CELL_CHANGE_DROPPED_PERSISTENT_GROUND_COVER');
  const returned=selectWoodlandFineGrass(built,{x:boundaryX-.001,z},{maximumParents:1024});
  assert.equal(digest(returned.pixels),digest(before.pixels),'A_B_A_GRASS_SELECTION_NOT_RESTORED');
  return {boundaryX,z,cameraDelta:.002,selectionCenterDelta:4,beforeContacts:a.size,afterContacts:b.size,intersection,retainedFraction:intersection/a.size,jaccard:intersection/(a.size+b.size-intersection),interpretation:'WORLD_FIXED_UNDERLAY_SURVIVES_CAMERA_TRANSITION_AND_A_B_A_REPLAY'};
 });
 assert.equal(digest(JSON.stringify(raw)),original,'IMMUTABLE_WORLD_MUTATED');
 return {schema:'H_EARTH_FOUR_TREE_FINE_GRASS_INDEPENDENT_v1',result:'PASS',constructionExecuted:presentation===null,contacts,maxGroundError,combinedGrassGpuBytes,eligibleCoverageProbes,coveredProbes,occupiedFourMetreCells:occupied.size,classes,suppressed,preserved,preservedTypes,views,transitionObservations,qualificationBoundaries:{cheapTreeTerrainViews:'SEPARATE_REQUIRED',sharedRendererBudgets:'ALLOCATION_AND_RESERVATION_AUDITED_BROWSER_PENDING',actualBrowser:'SEPARATE_REQUIRED',ownerAcceptance:'PENDING'}};
}
/** Gen2694: fast read-only source-chain qualification; no world construction or browser. */
export function verifyGen2694CandidateSourceChain(){
 const entry=fs.readFileSync(new URL('showroom/globe/h-earth/index.html',ROOT),'utf8');
 const singleOwnerPublic=entry.includes('./vegetation-prototype/route.js?rev=gen2793-woodland-riverbank-v1');
 let singleOwnerSourceQualification=null;
 if(singleOwnerPublic){
  const modules=[...entry.matchAll(/<script[^>]+type="module"[^>]+src="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(modules,['./vegetation-prototype/route.js?rev=gen2793-woodland-riverbank-v1'],'GEN2791_PUBLIC_ENTRY_MODULE_DRIFT');
  assert(entry.includes('type="importmap"')&&entry.includes('id="h-earth-functional-landscape-route"')&&entry.includes('data-run8e-ready="false"'),'GEN2791_PUBLIC_ENTRY_BINDING_MISSING');
  const imports=JSON.parse(entry.match(/<script type="importmap">([\s\S]*?)<\/script>/)?.[1]??'{}').imports;
  for(const suffix of ['persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js?cb=meadow-distribution-20261006&rev=','woodland-fine-grass.v1.js?rev=']){
   const module='/showroom/globe/h-earth/render/'+suffix;
   assert.equal(imports?.[module+'gen2780-stable-planting-v1'],module+'gen2793-woodland-riverbank-v1','GEN2791_CHANGED_MODULE_CACHE_IDENTITY_MISSING:'+suffix);
  }
  assert(!entry.includes('public-live-gpu-integration.run8e-r3e.receipt.js'),'GEN2791_SECOND_PUBLIC_OWNER');
  const route=fs.readFileSync(new URL('showroom/globe/h-earth/vegetation-prototype/route.js',ROOT),'utf8');
  for(const needle of ["const diagnosticReplay=location.pathname.endsWith('/vegetation-prototype.html');","query.set('arrival','approved-four-trees');","vegetationStrategy:'SINGLE_OWNER_WOODLAND_V1'","if(diagnosticReplay){","if(!diagnosticReplay){interactiveReady=true;canvas.style.pointerEvents='auto';}","mode:diagnosticReplay?'diagnostic-replay':'manual-public'"]){
   assert(route.includes(needle),'GEN2791_MANUAL_ROUTE_CONTRACT_MISSING:'+needle);
  }
  const suite=spawnSync(process.execPath,['--test','--test-reporter=tap',fileURLToPath(new URL('h-earth-3d/validation/h-earth.vegetation-single-owner.v1.test.mjs',ROOT))],{cwd:fileURLToPath(ROOT),encoding:'utf8',env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='NODE_TEST_CONTEXT'))});
  assert.equal(suite.status,0,'GEN2791_SINGLE_OWNER_SOURCE_TESTS_FAILED');
  const ownerTap=suite.stdout??'',ownerGlesUnavailable=/^ok 36 - actual single-owner palette shaders compile and link with software GLES .*# SKIP Optional software GLES unavailable$/m.test(ownerTap);
  assert(/^# tests 36\s*$/m.test(ownerTap)&&/^# fail 0\s*$/m.test(ownerTap)&&(
    /^# pass 36\s*$/m.test(ownerTap)&&/^# skipped 0\s*$/m.test(ownerTap)||
    /^# pass 35\s*$/m.test(ownerTap)&&/^# skipped 1\s*$/m.test(ownerTap)&&ownerGlesUnavailable
  ),'GEN2793_SINGLE_OWNER_SOURCE_EVIDENCE_MISSING');
  const refinementSuites=['h-earth.woodland-habitat.v1.test.mjs','h-earth.riverbank-boulders.v1.test.mjs'];
  const refinement=spawnSync(process.execPath,['--test','--test-reporter=tap',...refinementSuites.map(name=>fileURLToPath(new URL('h-earth-3d/validation/'+name,ROOT)))],{cwd:fileURLToPath(ROOT),encoding:'utf8',env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='NODE_TEST_CONTEXT'))});
  process.stderr.write(refinement.stdout??'');process.stderr.write(refinement.stderr??'');
  assert.equal(refinement.status,0,'GEN2793_ACTUAL_WORLD_HABITAT_AND_BANK_TESTS_FAILED');
  singleOwnerSourceQualification={publicEntrySha256:digest(entry),routeSha256:digest(route),sourceTests:36,ownerSoftwareGles:ownerGlesUnavailable?'UNAVAILABLE_BROWSER_SHADER_QUALIFICATION_STILL_REQUIRED':'PASS_ACTUAL_SOFTWARE_GLES_COMPILE_LINK',sourceTestScope:'CPU_AND_MOCK_GL_MANUAL_BOOT_NOT_BROWSER_ACCEPTANCE',legacyChainScope:'RETAINED_SOURCE_ONLY_NOT_SELECTED_PUBLIC_PIPELINE'};
 }
 const pilot=entry.includes('gen2780-stable-planting-v1');
 const modern=pilot||entry.includes('gen2779-front-water-exit-v1')||entry.includes('gen2774-cavern-vegetation-repair-v1');
 const rev=pilot?'gen2780-stable-planting-v1':entry.includes('gen2779-front-water-exit-v1')?'gen2779-front-water-exit-v1':modern?'gen2774-cavern-vegetation-repair-v1':'gen2710-stable-grass-beach-v1';
 const paths=[
  ['showroom/globe/h-earth/index.html','public-live-gpu-integration.run8e-r3e.receipt.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
  ['showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js','public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
  ['showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js','live-gpu-binding.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
  ['showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js','cp2-additive-bandlimited-relief-v2.js?cb=meadow-distribution-20261006&rev='+rev],
  ['showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','woodland-fine-grass.v1.js?rev='+rev],
  ['showroom/globe/h-earth/render/woodland-fine-grass.v1.js','landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev='+rev]
 ];
 const sources=new Map();
 for(const [file,needle] of paths){
  const bytes=fs.readFileSync(new URL(file,ROOT)),source=bytes.toString('utf8');
  // Gen2791 replaces only the root owner. Keep auditing the retained historical
  // integration chain, without claiming that chain is selected by this entrance.
  if(!(singleOwnerPublic&&file===paths[0][0]))assert(source.includes(needle),'GEN2694_CACHE_CHAIN_MISSING:'+file);
  sources.set(file,{source,sha256:digest(bytes),gitBlob:createHash('sha1').update('blob '+bytes.length).update(Buffer.from([0])).update(bytes).digest('hex')});
 }
 const renderer=sources.get(paths[4][0]).source,grass=sources.get(paths[5][0]).source;
 assert(renderer.includes("from './landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev="+rev+"'"),'GEN2694_GLOBAL_IMPORT_REVISION_DRIFT');
 assert(renderer.includes('const GLOBAL_COVER_PATCH_LOD_VS=GLOBAL_COVER_VS')&&renderer.includes('if(uMeadowGeometryPass==0)')&&renderer.includes('int leaf=gl_VertexID/4,vertex=gl_VertexID%4;')&&renderer.includes('float h=.22+.36*r1,halfWidth=.007+.006*r2'),'GEN2694_ACTUAL_THIN_SOURCE_SHADER_NOT_PROVEN');
 assert(renderer.includes('originalSourceBroadFanMeshDrawCount:0'),'GEN2694_GPU_CENSUS_MISSING');
 assert(grass.includes("(types[0]===0||types[0]===3)"),'GEN2694_WOODLAND_LEGACY_TYPE_SUPPRESSION_CHANGED');
 const manifest=JSON.parse(fs.readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json',ROOT),'utf8'));
 assert.equal(manifest.binary.sha256,'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a','GEN2694_CANONICAL_WORLD_BINARY_IDENTITY_DRIFT');
 const closure=fs.readFileSync(new URL('h-earth-3d/validation/h-earth.canonical-base-world-precompute.v1.mjs',ROOT),'utf8');
 for(const file of [paths[4][0],paths[5][0]]){
  // The immutable world manifest and historical Gen2694 closure must retain their
  // ORIGINAL source hashes. Gen2710 explicitly tests new presentation bytes,
  // never rewrites history to make an obsolete source pin appear current.
  const historical= file===paths[4][0]?'0b083da10ea36a18547faf19cc06dad4f9e6b4c6':'1f9bb61c244a162d3e52507b9e94da3d7efcf37b';
  assert.equal(manifest.sourceBlobs[file],historical,'HISTORICAL_WORLD_SOURCE_PIN_CHANGED:'+file);
  assert(closure.includes(historical),'HISTORICAL_SOURCE_CLOSURE_PIN_DRIFT:'+file);
  assert.notEqual(sources.get(file).gitBlob,historical,'GEN2710_PRESENTATION_SOURCE_UNCHANGED:'+file);
 }
 const selectorContract=verifyFineGrassSelectorContract({grass,renderer});
 assert(renderer.includes('float legacyFine=1.0-step(1.5,aParameters.w)')&&renderer.includes('vec2 narrowLocalXZ='),'GEN2710_LEGACY_LARGE_FAN_PRESENTATION_NOT_RETIRED');
 assert(renderer.includes('if(duneStratum>.5)gl_Position=vec4(2.0,2.0,2.0,1.0)'),'GEN2710_BEACH_DUNE_PRESENTATION_NOT_HIDDEN');
 const prior=JSON.parse(fs.readFileSync(new URL('h-earth-3d/experience-anchor/receipts/h-earth-meadow-mid-distance-patch-lod-20261013.receipt.json',ROOT),'utf8'));
 assert.equal(prior.canonicalAdmissionGeneration,2694);
 assert.equal(prior.disposition,'PENDING');assert.equal(prior.releaseAuthorized,false);
 const publicManifest=JSON.parse(fs.readFileSync(new URL('.github/ai-router/publication-surfaces/h-earth.json',ROOT),'utf8'));
 const html=publicManifest.checks.find(entry=>entry.path==='/showroom/globe/h-earth/index.html');
 if(!modern)assert(html&&html.includes.every(fragment=>sources.get(paths[0][0]).source.includes(fragment)),'GEN2694_PUBLIC_RELEASE_MANIFEST_INCOMPATIBLE');
 if(modern){
  assert(renderer.includes("from '../functional-landscape/geological-runtime-bridge.v1.js"+(pilot||rev==='gen2779-front-water-exit-v1'?'?rev='+rev:'')+"'"),'REPAIR_CAVE_MODULE_IDENTITY_DRIFT');
  assert(renderer.includes('visibleSurface:resources.vegetationVisibleSurface')&&renderer.includes('enabled:false'),'REPAIR_SHARED_SURFACE_OR_PILOT_RETIREMENT_MISSING');
  assert(grass.includes('createNearbyFineGrassCache')&&grass.includes('NEARBY_FINE_GRASS_CACHE_v1'),'REPAIR_NEARBY_COVER_MISSING');
  const late=fs.readFileSync(new URL('showroom/globe/h-earth/render/geometry-landscape-cover.js',ROOT),'utf8');
  assert(late.includes('legacyFanPresentationRetired:true'),'REPAIR_LATE_FAN_RETIREMENT_MISSING');
  assert.equal(digest(fs.readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',ROOT))),manifest.binary.sha256,'REPAIR_BINARY_BYTES_DRIFT');
 }
 return {schema:'H_EARTH_GEN2694_SOURCE_CHAIN_STATIC_QUALIFICATION_v1',...selectorContract,qualifiedPresentationGeneration:singleOwnerPublic?2793:selectorContract.generation??(pilot?2780:rev==='gen2779-front-water-exit-v1'?2779:modern?2774:2710),publicationManifestCompatibility:modern?'SEPARATE_PUBLICATION_REBIND_REQUIRED':'PASS',result:'PASS_STATIC_ONLY_NOT_VISUAL_ACCEPTANCE',cacheRevision:rev,moduleLinksChecked:singleOwnerPublic?paths.length-1:paths.length,sourceBlobsChecked:2,activeShader:singleOwnerPublic?'SINGLE_OWNER_WOODLAND_V1_SOURCE_ONLY':'GLOBAL_COVER_PATCH_LOD_VS_MODE0_TWELVE_THIN_LEAVES',...(singleOwnerPublic?{singleOwnerSourceQualification}:{}),oldGlobalBroadFanMeshDrawCount:0,canonicalWorldBinaryUnchanged:true,ownerVisualAcceptance:false,releaseAuthorized:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.includes('--source-binding-only')){
  const report=verifyGen2694CandidateSourceChain();
  if(report.qualifiedPresentationGeneration===2780||report.qualifiedPresentationGeneration===2785||report.qualifiedPresentationGeneration===2793){
   const result=spawnSync(process.execPath,['--test','--test-reporter=tap',fileURLToPath(new URL('h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs',ROOT))],{cwd:fileURLToPath(ROOT),encoding:'utf8',env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='NODE_TEST_CONTEXT'))});
   process.stderr.write(result.stdout||'');process.stderr.write(result.stderr||'');
   assert.equal(result.status,0,'GEN2780_PILOT_SOURCE_TESTS_FAILED');
   assert(/^# tests 35\s*$/m.test(result.stdout??'')&&/^# pass 35\s*$/m.test(result.stdout??'')&&/^# fail 0\s*$/m.test(result.stdout??''),'GEN2780_PILOT_SOURCE_EVIDENCE_MISSING');
   report.plantingPilotSourceTests='PASS_CPU_AND_MOCK_GL_ONLY';
  }
  console.log(JSON.stringify(report,null,2));process.exit(0);
 }
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
