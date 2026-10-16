import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const root=new URL('../../',import.meta.url),renderer=new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root),source=fs.readFileSync(renderer,'utf8');
const edge=[...source.matchAll(/from\s*['"]([^'"]*geological-runtime-bridge\.v1\.js[^'"]*)['"]/g)][0][1],bridge=await import(new URL(edge,renderer));
const nav=await import(new URL('showroom/globe/h-earth/functional-landscape/navigation.js',root));
const {createHEarthRun8ER3AFrameUniformPacket:packet,reconcileHEarthRun8ER3APresentationState:reconcile}=await import(new URL('showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js',root));
const {buildVegetationVisibleSurface}=await import(new URL('showroom/globe/h-earth/render/vegetation-visible-surface.v1.js?rev=gen2779-front-water-exit-v1',root));
const bytes=fs.readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));
assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const pkg=JSON.parse(gunzipSync(bytes)).canonical,before=JSON.stringify(pkg),model=bridge.constructGeologicalRuntimeBridge(pkg);bridge.installGeologicalRuntimeBridge(model);

test('front canonical water restored while rear derived water remains paused and source unchanged',()=>{
 assert.equal(bridge.H_EARTH_WATER_PRESENTATION_ENABLED,true);assert.equal(bridge.H_EARTH_REAR_WATER_PRESENTATION_ENABLED,false);
 const hidden=pkg.drawRanges.filter(r=>!bridge.shouldPresentHEarthDrawRange(r));assert.equal(hidden.length,0);assert(pkg.drawRanges.every(bridge.shouldPresentHEarthDrawRange));
 assert(hidden.every(r=>r.primitiveIds.every(bridge.isHEarthWaterPresentationPart)));
 assert(pkg.drawRanges.filter(bridge.shouldPresentHEarthDrawRange).some(r=>r.primitiveIds.some(id=>id.endsWith(':WET_SAND'))));
 assert.equal(bridge.shouldPresentHEarthDrawRange({primitiveIds:['H_EARTH_WORLD_MANIFOLD:FAR_OCEAN_CONTINUATION']}),true);
 assert.equal(model.meshes.filter(p=>bridge.isHEarthWaterPresentationPart(p.role)).length,2);
 assert(source.includes('if(!shouldPresentHEarthDrawRange(range))continue;'));
 assert(source.includes('if(!H_EARTH_REAR_WATER_PRESENTATION_ENABLED&&isHEarthWaterPresentationPart(part.role))continue;'));
 assert.equal(JSON.stringify(pkg),before);
});

test('rear water leaves no invisible basin barrier while canonical front water exclusions return',()=>{
 for(const z of [-288,-284,-280]){const water=model.sampleWaterAt(40,z);assert(water);const support=bridge.resolveGeologicalRuntimeFootSupport(40,z);assert(support.eligible);assert(water.y>support.footY+.5);}
 const surface=buildVegetationVisibleSurface(pkg,{geology:model});assert(surface.water.triangleCount>0);const dry=buildVegetationVisibleSurface(pkg,{geology:model,waterPresentationEnabled:false});assert.equal(dry.water.triangleCount,0,'Rear derived water must remain excluded even when front water toggles');
});

test('actual final render packet preserves supported eyes below cavern ceiling, including look changes',()=>{
 let r=nav.createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'});assert(r.ok);let state=r.state,interior=0;
 for(let i=0;i<=6;i++){
  for(const [yaw,pitch] of [[state.yawDegrees,state.pitchDegrees],[state.yawDegrees+25,-8]]){
   const n={...state,yawDegrees:yaw,pitchDegrees:pitch},p=packet({navigationState:n,deferVegetation:true});
   assert.deepEqual(p.camera.localAuthoringPosition,n.position);assert.equal(p.r3aPresentationCameraYDelta,0);
   const u=unprojectPlanetVertex(p.camera.position.x,p.camera.position.y,p.camera.position.z);for(const k of ['x','y','z'])assert(Math.abs(u[k]-n.position[k])<1e-7);
   const section=model.formation.caveSectionAt(n.position.x,n.position.z);if(section){interior++;assert(p.camera.localAuthoringPosition.y<section.ceilingY-.35);}
  }
  if(i<6){const p=nav.proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:4});assert(p.ok);state=p.state;}
 }
 assert.equal(state.position.z,-240);assert.equal(interior,12);
 // Ordinary support must still take the original terrain safety branch.
 const ordinary={...state,geologicalPhysicalSupport:false,position:{...state.position,y:-100}};assert(reconcile(ordinary).position.y>ordinary.position.y);
});

test('lower entrance lip joins exterior land with no see-through band and leaves the central doorway open',()=>{
 const face=model.portal.exposedCliffFace,start=face.lowerEntranceSeamIndexStart;
 assert.equal(face.facadeIndexCount,start);assert(face.lowerEntranceSeamTriangleCount>0);
 const hit=(x,y)=>{
  for(let i=start;i<face.indices.length;i+=3){
   const [a,b,c]=[0,1,2].map(k=>Array.from(face.positions.slice(face.indices[i+k]*3,face.indices[i+k]*3+3)));
   const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-10)continue;
   const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den,w=1-u-v;
   if(Math.min(u,v,w)>=-1e-6)return u*a[2]+v*b[2]+w*c[2];
  }return null;
 };
 for(const x of [38,39,40,41,42,43,43.5]){
  const z=model.site.portalZ,q=model.formation.caveSectionAt(x,z),ground=model.sampleOutdoorAt(x,z-.0001);assert(q&&ground);
  for(const t of [.1,.5,.9]){const y=q.floorY+(ground.y-q.floorY)*t,front=hit(x,y);assert(front!==null,`Open lower seam at ${x},${y}`);assert(Math.abs(front-z)<1e-5);assert(model.formation.rockSolidAt(x,y,z),'Rendered threshold missing physical plane correspondence');}
 }
 const x=model.site.x,z=model.site.portalZ,q=model.formation.caveSectionAt(x,z);
 assert.equal(hit(x,q.floorY+2.25),null,'Threshold caps central doorway');
 assert.equal(model.formation.rockSolidAt(x,q.floorY+2.25,z),false);
});

test('reverse exit traversal preserves floor support through the threshold into exterior land',()=>{
 let n=nav.createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'}).state;
 for(let i=0;i<6;i++){const p=nav.proposeHEarthFunctionalLandscapeNavigation(n,{action:'MOVE_FORWARD',magnitude:4});assert(p.ok);n=p.state;}
 for(let i=0;i<104;i++){
  const p=nav.proposeHEarthFunctionalLandscapeNavigation(n,{action:'MOVE_BACKWARD',magnitude:.25});assert(p.ok,JSON.stringify(p.issues));n=p.state;
  const final=reconcile(n);assert.equal(final.position.y,n.position.y);
  const section=model.formation.caveSectionAt(n.position.x,n.position.z);if(section)assert(final.position.y<section.ceilingY-.35);
 }
 assert.equal(n.position.z,-266);assert.equal(n.geologicalFloorClass,'EXTERIOR_DRY_CHANNEL');
});
