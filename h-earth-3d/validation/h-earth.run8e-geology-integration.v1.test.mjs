import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHEarthFunctionalLandscapeNavigationState,proposeHEarthFunctionalLandscapeNavigation} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
import {resolveHEarthArrivalWaypoint} from '../../showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';
import {constructGeologicalRuntimeBridge,installGeologicalRuntimeBridge,
  resolveGeologicalRuntimeFootSupport,retireGeologicalBaseIndices,traceGeologicalRuntimeDrainage,sampleGeologicalMaterialExposure}
  from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
const home=dirname(fileURLToPath(import.meta.url));
const file=process.env.H_EARTH_EXACT_WORLD_BINARY||join(home,'../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz');
let payload;
function canonical(){
 if(!payload){const compressed=readFileSync(file);assert.equal(compressed.length,11736235);
  assert.equal(createHash('sha256').update(compressed).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
  const decoded=gunzipSync(compressed);assert.equal(decoded.length,51163475);
  payload=JSON.parse(decoded.toString('utf8')).canonical;
  assert.equal(payload.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_2F3D0EB2');
 }return payload;
}
let model;
function geology(){return model??=constructGeologicalRuntimeBridge(canonical());}
const part=(role)=>geology().meshes.find(x=>x.role===role)?.mesh;
test('exact Gen2666 compressed source and spherical terrain correspond',()=>{
 const p=canonical();assert.equal(p.buffers.positions.length,330807);
 assert.equal(p.buffers.indices.length,311466);
 assert.equal(geology().formation.minimumRoofCover>0,true);
});
test('real terrain D8 survey supplies a descending scenic river network without a hydrology claim',()=>{
 const route=geology().route;assert(route.path.length>=15);
 assert(route.path.every((v,i)=>i===0||v.height<route.path[i-1].height));
 const drainage=geology().formation.drainage;
 assert.equal(route.waterPresent,false);
 assert.equal(drainage.waterPresent,true);
 assert.equal(drainage.waterSourceProven,false);
 assert.equal(drainage.tributaries.length,2);
 for(const tributary of drainage.tributaries){
  assert(tributary.points.length>=10);
  assert(tributary.points.every((p,i)=>i===0||p.bedY<tributary.points[i-1].bedY));
  assert(Math.hypot(tributary.join.x-tributary.points.at(-1).x,tributary.join.z-tributary.points.at(-1).z)<1e-6);
 }
 const water=geology().meshes.filter(x=>x.role==='FRESHWATER_RIVER'||x.role==='OASIS_WATER');
 assert.equal(water.filter(x=>x.role==='FRESHWATER_RIVER').length,3);
 assert(water.find(x=>x.role==='OASIS_WATER').mesh.triangleCount>100);
 assert.equal(geology().hydrology.connectedOutletProven,false);
});
test('original terrain indices are retired by degeneracy only within declared mask',()=>{
 const c=canonical(),g=geology(),indices=Uint32Array.from(c.buffers.indices),old=indices.slice();
 const revised=retireGeologicalBaseIndices(indices,g.retirement);
 assert.equal(revised.length,indices.length);
 assert.equal(revised.every((v,i)=>i%3===0||!g.retirement.triangleOffsets.includes(i-i%3)||v===revised[i-i%3]),true);
 assert.equal(old.every((v,i)=>indices[i]===v),true);
 assert(g.retirement.triangleCount>=100);
});
test('four real manifold elements are projected to shared spherical world',()=>{
 assert.deepEqual(geology().meshes.slice(0,4).map(x=>x.role),['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN','NATURAL_CLIFF_FACE','CAVERN_PHYSICAL_SHELL']);
 for(const {mesh} of geology().meshes.slice(0,4)){assert(mesh.positions instanceof Float32Array);
 assert(mesh.indices instanceof Uint32Array);assert(mesh.positions.length>0);assert(mesh.indices.length>0);}
 assert.equal(geology().meshes.filter(x=>x.role==='FRESHWATER_RIVER').length,3);
 assert(geology().meshes.some(x=>x.role==='OASIS_WATER'));
});
test('uninstalled physical cave is invisible to normal Gen324 navigation',()=>{
 assert.equal(resolveGeologicalRuntimeFootSupport(80,-261),null);
});
test('active interior uses cave floor/roof, wall collision correctly rejects',()=>{
 installGeologicalRuntimeBridge(geology());
 const inside=resolveGeologicalRuntimeFootSupport(80,-252),solid=resolveGeologicalRuntimeFootSupport(90,-251),coast=resolveGeologicalRuntimeFootSupport(0,-96);
 assert(inside?.eligible);assert(inside.ceilingY>inside.eyeY+0.3);
 assert(solid&&!solid.eligible);assert.equal(coast,null);
});
test('weathered portal relief is shared by the visible shell and walk clearance',()=>{
 const f=geology().formation,z=f.site.portalZ+1;
  assert(Math.abs(f.caveCenterX(f.site.portalZ+5)-f.site.x)>1.2,'CAVERN_CENTERLINE_REMAINS_STRAIGHT');
  assert(Math.abs(f.caveCenterX(f.site.portalZ+5)-f.site.x)<f.caveRadius(f.site.portalZ+5)*.5,'CAVERN_CENTERLINE_EXCEEDS_WALKABLE_WIDTH');
  assert(Math.abs(f.caveRadius(f.site.portalZ+5)-f.caveRadius(f.site.portalZ+10))>.25,'CAVERN_CROSS_SECTION_REMAINS_REPETITIVE');
 const left=f.roofAt(f.site.x-2,z),right=f.roofAt(f.site.x+2,z);
 assert(Math.abs(left-right)>.08,'PORTAL_ROOF_REMAINS_UNNATURALLY_SYMMETRIC');
 const floor=f.floorAt(f.site.x,z),roof=f.roofAt(f.site.x,z);
 assert(roof>floor+5,'PORTAL_CLEARANCE_COLLAPSED');
 assert.equal(f.insideVoid(f.site.x,floor+1,z),true);
 assert.equal(f.insideVoid(f.site.x,roof,z),false);
 const a=f.roofAt(f.site.x,z),b=f.roofAt(f.site.x,z+.25);
 assert(Math.abs(a-b)<.25,'ROOF_RELIEF_DISCONTINUITY');
});
test('2m replacement terrain has a true aperture and cliff with upper mantle',()=>{
 const p=geology().portal;
 assert(p.retiredReplacementTriangleCount>=32);
 assert.equal(p.rimCorrespondence.sideMaxError,0);
 assert.equal(p.rimCorrespondence.backMaxError,0);
 assert.equal(p.rimCorrespondence.frontCliffBottomOpen,true);
 assert(part('MOUNTAIN_OVERBURDEN').triangleCount>0);
 assert(part('NATURAL_CLIFF_FACE').triangleCount>0);
  assert(p.diagnostics.exposedFaceReliefMeters>0.45,'CLIFF_FACE_REMAINS_PLANAR');
  const face=p.exposedCliffFace;
  for(let i=0;i<face.indices.length;i+=3){
    const ids=[face.indices[i],face.indices[i+1],face.indices[i+2]];
    const x=ids.reduce((v,id)=>v+face.positions[id*3],0)/3;
    const y=ids.reduce((v,id)=>v+face.positions[id*3+1],0)/3;
    assert.equal(geology().formation.insideVoid(x,y,geology().formation.site.portalZ+0.25),false,'CLIFF_FACE_COVERS_CAVERN_APERTURE');
  }
});
test('runtime renderer/nav source contains actual bridge calls and no Gen2730 arch draw',()=>{
 const r=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 const n=readFileSync(join(home,'../../showroom/globe/h-earth/functional-landscape/navigation.js'),'utf8');
 assert(r.includes('initializeGeologicalRendering();'));
 assert(r.includes('drawGeologicalRendering();'));
 assert(!r.includes('drawRearCavernPilot();'));
 assert(r.includes('retireGeologicalBaseIndices('));
 assert(r.includes('resources.geologicalRuntime.localBounds'));
 assert(n.includes('resolveGeologicalRuntimeFootSupport('));
 assert(n.includes('GEOLOGICAL_UNWALKABLE_STEP_GRADE'));
});

test('real Gen324 locomotion enters roofed cavern through 15 accepted actions',()=>{
  const n=createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'});
  assert(n.ok);let state=n.state,entered=false;
  for(let i=0;i<15;i++){const proposal=proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:4});
    assert.equal(proposal.ok,true,'MOVE_'+i+':'+proposal.issues);state=proposal.state;
    if(state.geologicalFloorClass==='INTERIOR')entered=true;
  }
  assert(entered);assert(state.position.z>-250);assert(state.geologicalPhysicalSupport);
});
test('original coastal navigation remains original and never reports cave support',()=>{
  const n=createHEarthFunctionalLandscapeNavigationState({waypointId:'COAST'});assert(n.ok);
  assert.equal(n.state.geologicalPhysicalSupport,false);assert.equal(n.state.position.x,0);
});
test('cavern arrival copy is query-bound and coast copy remains the default',()=>{
 assert.equal(resolveHEarthArrivalWaypoint('?arrival=geological-cavern'),'GEOLOGICAL_CAVERN_REAR_APPROACH');
 assert.equal(resolveHEarthArrivalWaypoint(''),'COAST');
 const html=readFileSync(join(home,'../../showroom/globe/h-earth/index.html'),'utf8');
 assert(html.includes("parameters.get('arrival') === 'geological-cavern'"));
 assert(html.includes('Eroded into the mountain.'));
 assert(html.includes('The coast is the entrance.'));
});

test('every projected cavern and patch vertex has original-world albedo contact',()=>{
 const model=geology();let count=0;
 for(const {mesh} of model.meshes){
  for(let i=0;i<mesh.positions.length;i+=3){
   const region=unprojectPlanetVertex(mesh.positions[i],mesh.positions[i+1],mesh.positions[i+2]);
   const base=model.originalTerrainColorAt(region.x,region.z);
   assert(base?.length===3,'MISSING_CANONICAL_COLOR:'+i);
   assert(base.every(x=>Number.isFinite(x)&&x>=0&&x<=1));count++;
  }
 }
 assert(count>7288,'WATER_MESHES_MISSING_CANONICAL_COORDINATE_CONTACT');
});

test('excavated channel shows geologically grounded material exposure while exterior rim stays intact',()=>{
 const g=geology(),x=g.site.x,z=g.site.drainageHeadZ;
 const deep=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',x,z);
 assert(deep.incisionDepth>4,'CHANNEL_INCIDISION_TOO_SHALLOW:'+deep.incisionDepth);
 assert(deep.rockWeight>0.5,'ROCK_EXPOSURE_ZERO:'+deep.rockWeight);
 const arrival=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',82,-290);
 assert(arrival.incisionDepth>=2.75,'ARRIVAL_CREEKBED_NOT_READABLE:'+arrival.incisionDepth);
 const arrivalWaypoint=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',80,-304);
 assert(arrivalWaypoint.incisionDepth>=1.75,'ARRIVAL_WAYPOINT_MISSES_DRY_OUTWASH_APRON:'+arrivalWaypoint.incisionDepth);
 const profile=g.formation.drainage.points;
 const maxGrade=Math.max(...profile.slice(1).map((point,i)=>{
   const previous=profile[i],distance=Math.hypot(point.x-previous.x,point.z-previous.z);
   return Math.abs(point.bedY-previous.bedY)/distance;
 }));
 assert(maxGrade<=0.65,'CREEKBED_WALKING_GRADE_EXCEEDED:'+maxGrade);
 assert.equal(g.formation.drainage.waterPresent,true);
 assert.equal(g.hydrology.waterSourceProven,false);
 assert(g.formation.oasis.centerX>g.site.x+20,'OASIS_NOT_POSITIONED_ACROSS_APPROACH');
 assert(g.formation.oasis.radiusX>g.formation.oasis.radiusZ,'OASIS_NOT_AN_IRREGULAR_BASIN');
 const boundary=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',g.localBounds.xMin,z);
 assert.equal(boundary.rockWeight,0,'PATCH_BOUNDARY_MATERIAL_DISCONTINUITY');
 assert.equal(deep.originalWorldMutated,false);
 const renderer=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 assert(renderer.includes('sampleGeologicalMaterialExposure(model,role,local.x,local.z)'));
 assert(renderer.includes("role==='FRESHWATER_RIVER'||role==='OASIS_WATER'"));
 assert(renderer.includes('designedFreshwaterRendered'));
 assert(renderer.includes('const alluvium=[.55+.16*band,.36+.11*band,.18+.07*band];'));
 assert(!renderer.includes('local.y-originalTop'));
});

test('bounded rear-cavern arrival query targets the real existing waypoint without changing coast or four trees',()=>{
  assert.equal(resolveHEarthArrivalWaypoint('?arrival=geological-cavern'),'GEOLOGICAL_CAVERN_REAR_APPROACH');
  assert.equal(resolveHEarthArrivalWaypoint('?arrival=approved-four-trees'),'WOODLAND_CLEARING_FOUR_TREES');
  for(const query of ['','?arrival=unknown','?arrival=geological-cavern-unknown'])
    assert.equal(resolveHEarthArrivalWaypoint(query),'COAST');
});
