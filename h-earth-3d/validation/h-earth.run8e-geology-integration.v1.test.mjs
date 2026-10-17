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
const rendererURL=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const navigationURL=new URL('../../showroom/globe/h-earth/functional-landscape/navigation.js',import.meta.url);
function bridgeDependency(parent){
 const matches=[...readFileSync(parent,'utf8').matchAll(/\bfrom\s*['"]([^'"]*geological-runtime-bridge\.v1\.js[^'"]*)['"]/g)];
 assert.equal(matches.length,1,'Expected one production geological bridge edge');
 return new URL(matches[0][1],parent);
}
const activeBridgeURL=bridgeDependency(rendererURL);
assert.equal(activeBridgeURL.href,bridgeDependency(navigationURL).href,'CAVE_SUPPORT_MUST_SHARE_NAVIGATION_MODULE_URL');
const {constructGeologicalRuntimeBridge,installGeologicalRuntimeBridge,
  resolveGeologicalRuntimeFootSupport,retireGeologicalBaseIndices,traceGeologicalRuntimeDrainage,sampleGeologicalMaterialExposure}=await import(activeBridgeURL);
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
 assert.equal(geology().formation.site.id,'B_REAR_RAVINE');
 assert.deepEqual({x:geology().formation.site.x,z:geology().formation.site.portalZ},{x:40,z:-260});
 assert.deepEqual({x:geology().formation.oasis.centerX,z:geology().formation.oasis.centerZ},{x:40,z:-284});
});
test('real terrain D8 survey supplies a descending scenic river network without a hydrology claim',()=>{
 const route=geology().route;assert(route.path.length>=15);
 assert(route.path.every((v,i)=>i===0||v.height<route.path[i-1].height));
 const drainage=geology().formation.drainage;
 assert.equal(route.waterPresent,false);
 assert.equal(drainage.waterPresent,true);
 assert.equal(drainage.waterSourceProven,false);
 assert.equal(drainage.waterRoutes.length,1);
 const water=geology().meshes.filter(x=>x.role==='FRESHWATER_RIVER'||x.role==='OASIS_WATER');
 assert.equal(water.filter(x=>x.role==='FRESHWATER_RIVER').length,1);
 const oasis=water.find(x=>x.role==='OASIS_WATER'),basin=geology().formation.oasis;
 assert(oasis.mesh.triangleCount>450,'SECOND_OASIS_RENDERED_FOOTPRINT_TOO_SMALL');
 assert(basin.waterEdgeScale>=.5&&basin.waterEdgeScale<.6,'OASIS_WATER_DOES_NOT_RETAIN_AN_IRREGULAR_INNER_POOL');
 assert(basin.edgeHarmonics.length>=5,'OASIS_SHORELINE_REMAINS_OVAL');
 const oasisLocal=Array.from({length:oasis.mesh.positions.length/3},(_,i)=>unprojectPlanetVertex(...oasis.mesh.positions.slice(i*3,i*3+3)));
 const oasisWidth=Math.max(...oasisLocal.map(p=>p.x))-Math.min(...oasisLocal.map(p=>p.x));
 const oasisLength=Math.max(...oasisLocal.map(p=>p.z))-Math.min(...oasisLocal.map(p=>p.z));
 assert(oasisWidth>35&&oasisWidth<basin.radiusX*1.8,'SECOND_OASIS_WIDTH_NOT_A_BOUNDED_INNER_POOL:'+oasisWidth);
 assert(oasisLength>20&&oasisLength<basin.radiusZ*1.8,'SECOND_OASIS_LENGTH_NOT_A_BOUNDED_INNER_POOL:'+oasisLength);
 assert.equal(basin.centerX,40,'SECOND_OASIS_MISSES_PHOTOGRAPHED_LANDMARK');
 const main=water.find(x=>x.role==='FRESHWATER_RIVER').mesh,mainRoute=geology().formation.drainage.waterRoutes[0].points;
 const lateral=mainRoute.map((p,i)=>{const a=unprojectPlanetVertex(...main.positions.slice(i*6,i*6+3)),b=unprojectPlanetVertex(...main.positions.slice(i*6+3,i*6+6));return Math.hypot((a.x+b.x)/2-p.x,(a.z+b.z)/2-p.z)});
 assert(Math.max(...lateral)>4,'MAIN_RIVER_REMAINS_STRAIGHT');
 assert(lateral.filter(v=>v>2).length>10,'MAIN_RIVER_MEANDER_TOO_SHORT');
 const riverWidths=mainRoute.map((_,i)=>{
   const a=unprojectPlanetVertex(...main.positions.slice(i*6,i*6+3)),b=unprojectPlanetVertex(...main.positions.slice(i*6+3,i*6+6));
   return Math.hypot(a.x-b.x,a.z-b.z);
 });
 const confluence=mainRoute.reduce((best,p,i)=>Math.hypot(p.x-basin.centerX,p.z-basin.centerZ)<best.distance?
   {distance:Math.hypot(p.x-basin.centerX,p.z-basin.centerZ),index:i}:best,{distance:Infinity,index:0});
 assert(riverWidths[confluence.index]>riverWidths[0]*1.3,'CHANNEL_DOES_NOT_BROADEN_INTO_OASIS');
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
 assert.equal(geology().meshes.filter(x=>x.role==='FRESHWATER_RIVER').length,1);
 assert(geology().meshes.some(x=>x.role==='OASIS_WATER'));
});
test('uninstalled physical cave is invisible to normal Gen324 navigation',()=>{
 assert.equal(resolveGeologicalRuntimeFootSupport(40,-257),null);
});
test('active interior uses cave floor/roof, wall collision correctly rejects',()=>{
 installGeologicalRuntimeBridge(geology());
 const inside=resolveGeologicalRuntimeFootSupport(40,-252),solid=resolveGeologicalRuntimeFootSupport(50,-251),coast=resolveGeologicalRuntimeFootSupport(0,-96);
 assert(inside?.eligible);assert(inside.ceilingY>inside.eyeY+0.3);
 assert(solid&&!solid.eligible);assert.equal(coast,null);
});
test('weathered portal relief is shared by the visible shell and walk clearance',()=>{
 const f=geology().formation,z=f.site.portalZ+1;
  assert(Math.abs(f.caveCenterX(f.site.portalZ+5)-f.site.x)>.8,'CAVERN_CENTERLINE_REMAINS_STRAIGHT');
  assert(Math.abs(f.caveCenterX(f.site.portalZ+5)-f.site.x)<f.caveRadius(f.site.portalZ+5)*.5,'CAVERN_CENTERLINE_EXCEEDS_WALKABLE_WIDTH');
  assert(Math.abs(f.caveRadius(f.site.portalZ+5)-f.caveRadius(f.site.portalZ+10))>.25,'CAVERN_CROSS_SECTION_REMAINS_REPETITIVE');
 const left=f.roofAt(f.site.x-2,z),right=f.roofAt(f.site.x+2,z);
 assert(Math.abs(left-right)>.08,'PORTAL_ROOF_REMAINS_UNNATURALLY_SYMMETRIC');
 const floor=f.floorAt(f.site.x,z),roof=f.roofAt(f.site.x,z);
 assert(roof>floor+3,'PORTAL_CLEARANCE_COLLAPSED');
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
  for(let i=0;i<(face.facadeIndexCount??face.indices.length);i+=3){
    const ids=[face.indices[i],face.indices[i+1],face.indices[i+2]];
    const x=ids.reduce((v,id)=>v+face.positions[id*3],0)/3;
    const y=ids.reduce((v,id)=>v+face.positions[id*3+1],0)/3;
    assert.equal(geology().formation.insideVoid(x,y,geology().formation.site.portalZ+0.25),false,'CLIFF_FACE_COVERS_CAVERN_APERTURE');
  }
});
test('runtime renderer/nav source contains actual bridge calls and no Gen2730 arch draw',()=>{
 const r=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 const n=readFileSync(join(home,'../../showroom/globe/h-earth/functional-landscape/navigation.js'),'utf8');
 assert(r.includes('initializeGeologicalRendering(packet.environmentUniforms);'));
 assert(r.includes('drawGeologicalRendering();'));
 assert(!r.includes('drawRearCavernPilot();'));
 assert(r.includes('retireGeologicalBaseIndices('));
 assert(r.includes('resources.geologicalRuntime.localBounds'));
 assert(n.includes('resolveGeologicalRuntimeFootSupport('));
 assert(n.includes('GEOLOGICAL_UNWALKABLE_STEP_GRADE'));
});

test('real Gen324 locomotion enters roofed cavern through a dry mouth approach',()=>{
  const n=createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'});
  assert(n.ok);let state=n.state,entered=false;
  for(let i=0;i<6;i++){const proposal=proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:Math.min(4,-240-state.position.z)});
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
 const arrival=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',42,-290);
 assert(arrival.incisionDepth>=2.75,'ARRIVAL_CREEKBED_NOT_READABLE:'+arrival.incisionDepth);
 const arrivalWaypoint=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',40,-300);
 assert(arrivalWaypoint.incisionDepth>=1.75,'ARRIVAL_WAYPOINT_MISSES_DRY_OUTWASH_APRON:'+arrivalWaypoint.incisionDepth);
 const profile=g.formation.drainage.points;
 const maxGrade=Math.max(...profile.slice(1).map((point,i)=>{
   const previous=profile[i],distance=Math.hypot(point.x-previous.x,point.z-previous.z);
   return Math.abs(point.bedY-previous.bedY)/distance;
 }));
 assert(maxGrade<=0.65,'CREEKBED_WALKING_GRADE_EXCEEDED:'+maxGrade);
 assert.equal(g.formation.drainage.waterPresent,true);
 assert.equal(g.hydrology.waterSourceProven,false);
 const cliff=sampleGeologicalMaterialExposure(g,'NATURAL_CLIFF_FACE',g.site.x,g.site.portalZ+1);
 assert(cliff.rockWeight>.5&&cliff.rockWeight<1,'EXPOSED_CLIFF_FACE_COLOR_DOES_NOT_BLEND_WITH_LOCAL_TERRAIN');
 assert.equal(g.formation.oasis.centerX,40,'OASIS_MISSES_PHOTOGRAPHED_LANDMARK');
 assert.equal(g.formation.oasis.centerZ,-284,'OASIS_MISSES_LEGACY_DISCOLORATION_CENTER');
 assert(g.formation.oasis.radiusX>=38&&g.formation.oasis.radiusZ>=34,'OASIS_DOES_NOT_COVER_DISCOLORATION_FOOTPRINT');
 assert(g.formation.oasis.radiusX>g.formation.oasis.radiusZ,'OASIS_NOT_AN_IRREGULAR_BASIN');
 const boundary=sampleGeologicalMaterialExposure(g,'ERODED_TERRAIN',g.localBounds.xMin,z);
 assert.equal(boundary.rockWeight,0,'PATCH_BOUNDARY_MATERIAL_DISCONTINUITY');
 assert.equal(deep.originalWorldMutated,false);
 const renderer=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 assert(renderer.includes('sampleGeologicalMaterialExposure(model,role,local.x,local.z)'));
 assert(renderer.includes("role==='FRESHWATER_RIVER'||role==='OASIS_WATER'"));
 assert(renderer.includes('designedFreshwaterRendered'));
 assert(renderer.includes('const alluvium=[.24+.055*band,.20+.046*band,.15+.035*band];'));
 assert(renderer.includes('const shoreDepth=Math.max(0,Math.min(1,(waterline-Math.hypot(dx,dz))/0.22));'));
 assert(!renderer.includes('local.y-originalTop'));
});


test('cavern portal relief and rock strata remain irregular without periodic tunnel bands',()=>{
 const face=geology().portal.diagnostics.exposedFaceReliefMeters;
 assert(face>2,'PORTAL_FACE_REMAINS_PLANAR:'+face);
 const renderer=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 assert(renderer.includes('const strataA=Math.sin(local.y*.78+'));
 assert(renderer.includes('const patchNoise=Math.sin(local.x*.47+local.z*.27+local.y*.11);'));
 assert(!renderer.includes('local.y*1.55+.34*Math.sin(local.x*.43)'));
 const revision=activeBridgeURL.searchParams.get('rev');
 assert(revision,'CAVE_SUPPORT_REVISION_MISSING');
 assert.equal(bridgeDependency(rendererURL).href,bridgeDependency(navigationURL).href,'CAVE_SUPPORT_MUST_SHARE_NAVIGATION_MODULE_URL');
 for(const path of [
  '../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
  '../../showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
  '../../showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
  '../../showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js',
  '../../showroom/globe/h-earth/index.html'
 ]) assert(readFileSync(join(home,path),'utf8').includes(revision),'CAVERN_CACHE_REVISION_NOT_CLOSED:'+path);
});

test('bounded rear-cavern arrival query targets the real existing waypoint without changing coast or four trees',()=>{
  assert.equal(resolveHEarthArrivalWaypoint('?arrival=geological-cavern'),'GEOLOGICAL_CAVERN_REAR_APPROACH');
  assert.equal(resolveHEarthArrivalWaypoint('?arrival=approved-four-trees'),'WOODLAND_CLEARING_FOUR_TREES');
  assert.equal(resolveHEarthArrivalWaypoint(''),'COAST');
  assert.equal(resolveHEarthArrivalWaypoint('?arrival=unregistered-destination'),'COAST');
});

// Inspect generated vertices, not just the constructor's diagnostic labels.
test('weathered face rejoins the terrain and aperture plane at every perimeter vertex',()=>{
 const g=geology(),mesh=g.portal.exposedCliffFace,rows=48;
 const columns=(mesh.facadeVertexCount??mesh.vertexCount)/(rows+1);assert(Number.isInteger(columns));
 for(let j=0;j<=rows;j++)for(let i=0;i<columns;i++){
  if(j!==0&&j!==rows&&i!==0&&i!==columns-1)continue;
  const n=(j*columns+i)*3,x=mesh.positions[n],y=mesh.positions[n+1],z=mesh.positions[n+2];
  assert(Math.abs(z-g.site.portalZ)<1e-5,'CLIFF_EDGE_DETACHED_FROM_SHARED_APERTURE');
  if(j===0)assert(Math.abs(y-g.originalTerrainElevationAt(x,z))<1e-4,'CLIFF_TOP_DETACHED_FROM_MOUNTAIN');
 }
 assert(g.portal.diagnostics.exposedFaceReliefMeters>2,'INTERIOR_ROCK_RELIEF_LOST');
});
test('active Site B shader treatment is bounded and cannot restore the cyan stain',()=>{
 const renderer=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 assert(!renderer.includes('vec3 cavernStone='));
 assert(!renderer.includes('vec3(0.060,0.125,0.14)'));
 assert(renderer.includes('float siteBEnvelope=smoothstep(0.0,12.0,siteBEdge);'));
 assert(renderer.includes('smoothstep(0.10,0.58,slope)*siteBEnvelope'));
 // Execute the shader envelope's actual expression at boundary/outside/interior samples.
 const edge=renderer.match(/float siteBEdge=([^;]+);/)[1];
 const evaluate=new Function('world','min','return '+edge.replaceAll('world.x','world.x').replaceAll('world.y','world.y'));
 for(const [x,z] of [[-120,-300],[96,-300],[40,-376],[40,-224],[40,-1000],[300,-280]])
  assert(evaluate({x,y:z},Math.min)<=0,'MATERIAL_MASK_ESCAPED_PATCH');
 assert(evaluate({x:40,y:-280},Math.min)>=12);
});

test('kernel boundary is the shared rendered, occupied and walkable cavity',()=>{
 const g=geology(),f=g.formation,m=f.kernelCaveBoundary,k=f.kernelConstruction;
 assert(k.valid);assert.equal(k.sweep.capStart,false);assert.equal(k.sweep.capEnd,true);
 assert.equal(g.portal.cave,m);assert.equal(m.sphereClearanceCertified,false);
 const edges=new Map();let witnesses=0;
 for(let i=0;i<m.indices.length;i+=3){
  const ids=Array.from(m.indices.slice(i,i+3)),p=ids.map(n=>Array.from(m.positions.slice(n*3,n*3+3)));
  for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3],key=Math.min(a,b)+':'+Math.max(a,b);edges.set(key,(edges.get(key)??0)+1)}
  const [a,b,c]=p,ny=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]);
  if(Math.abs(ny)<1e-5)continue;
  // Independent triangle barycenter: each physical surface must coincide with
  // a boundary returned by the actual navigation field, including between rings.
  const [x,y,z]=[0,1,2].map(k=>(a[k]+b[k]+c[k])/3);
  if(z<=g.site.portalZ||z>=g.site.portalZ+g.site.galleryLength-.01)continue;
  const q=f.caveSectionAt(x,z);assert(q,'KERNEL_SURFACE_HAS_NO_SECTION:'+i);
  assert(Math.min(Math.abs(y-q.floorY),Math.abs(y-q.ceilingY))<2e-4,'RENDER_NAV_BOUNDARY_DRIFT:'+i);
  assert(f.insideVoid(x,(q.floorY+q.ceilingY)/2,z));
  assert(!f.insideVoid(x,q.ceilingY+.01,z));witnesses++;
 }
 assert(witnesses>200);
 assert.equal([...edges.values()].filter(n=>n===1).length,m.profileVertexCount);
 assert([...edges.values()].every(n=>n<=2));
 // Every first-ring roof corner occurs as an exact x breakpoint in the face.
 const face=g.portal.exposedCliffFace,columns=(face.facadeVertexCount??face.vertexCount)/49;
 for(let i=0;i<m.profileVertexCount;i++){
  const x=m.positions[i*3],y=m.positions[i*3+1],z=m.positions[i*3+2];
  assert.equal(z,g.site.portalZ);
  const q=f.caveSectionAt(x,z);if(!q||Math.abs(y-q.ceilingY)>1e-4)continue;
  const column=Array.from({length:columns},(_,j)=>j).find(j=>Math.abs(face.positions[j*3]-x)<1e-5);
  assert.notEqual(column,undefined,'FIRST_RING_CORNER_OMITTED');
  const n=(48*columns+column)*3;
  assert(Math.abs(face.positions[n+1]-Math.max(y,f.excavatedOutdoorTerrain(x,z)))<1e-4,'MOUTH_LIP_MISMATCH');
 }
});

test('recessed exterior face has outward normals and actual displaced solid correspondence',()=>{
 const g=geology(),m=g.portal.exposedCliffFace,f=g.formation;let witnesses=0;
 for(let i=0;i<(m.facadeIndexCount??m.indices.length);i+=3){
  const [a,b,c]=Array.from(m.indices.slice(i,i+3),id=>Array.from(m.positions.slice(id*3,id*3+3)));
  const xy=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  assert(xy< -1e-9,'EXTERIOR_ROCK_NORMAL_POINTS_INTO_MOUNTAIN');
  const probes=[a,b,c,...[a,b,c].map((p,k)=>p.map((v,j)=>(v+[a,b,c][(k+1)%3][j])/2)),[0,1,2].map(j=>(a[j]+b[j]+c[j])/3)];
  for(const [x,y,z]of probes)assert(!f.insideVoid(x,y,z),'DISPLACED_FACE_INTRUDES_INTO_KERNEL_VOID');
  const [x,y,z]=probes.at(-1),front=f.rockFaceFrontAt(x,y);
  const seamOccludes=f.lowerEntranceSeamAt?.(x,y)&&Math.abs(front-g.site.portalZ)<1e-5&&z>g.site.portalZ+1e-4;
  assert(front!==null&&(Math.abs(front-z)<1e-4||seamOccludes),'ROCK_FRONT_QUERY_DIFFERS_FROM_RENDERED_TRIANGLE');
  if(seamOccludes)assert(f.rockSolidAt(x,y,g.site.portalZ),'OCCLUDING_THRESHOLD_MISSING_PHYSICAL_PLANE');
  if(!seamOccludes&&z>g.site.portalZ+.02&&y<g.originalTerrainElevationAt(x,z)-.05){
   assert(!f.rockSolidAt(x,y,z-.01),'RECESS_NOT_EXCAVATED');
   assert(f.rockSolidAt(x,y,z+.01),'ROCK_MISSING_BEHIND_FACE');witnesses++;
  }
 }
 assert(witnesses>100);
});
test('retained rock triangles block interior sunlight while the real entrance stays open',()=>{
 const g=geology(),f=g.formation,x=g.site.x,z=g.site.portalZ+1,q=f.caveSectionAt(x,z);
 const p=[x,(q.floorY+q.ceilingY)*.5,z];
 assert.equal(g.cavernLightVisibility(p,[0,1,0]),0,'SUNLIGHT_LEAKS_THROUGH_PHYSICAL_ROOF');
 assert.equal(g.cavernLightVisibility(p,[0,0,-1]),1,'ENTRANCE_LIGHT_RAY_BLOCKED_BY_INVENTED_CAP');
 const end=g.site.portalZ+g.site.galleryLength-1,at=f.caveSectionAt(f.caveCenterX(end),end);
 assert(at);assert.equal(g.cavernLightVisibility([f.caveCenterX(end),(at.floorY+at.ceilingY)*.5,end],[0,0,1]),0,'FAR_CAP_NOT_OPAQUE');
});
