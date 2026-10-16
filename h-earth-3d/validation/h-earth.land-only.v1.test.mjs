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
const {buildVegetationVisibleSurface}=await import(new URL('showroom/globe/h-earth/render/vegetation-visible-surface.v1.js?rev=gen2778-land-only-v1',root));
const bytes=fs.readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));
assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const pkg=JSON.parse(gunzipSync(bytes)).canonical,before=JSON.stringify(pkg),model=bridge.constructGeologicalRuntimeBridge(pkg);bridge.installGeologicalRuntimeBridge(model);

test('all canonical and derived water draws suppressed, land ranges retained and source unchanged',()=>{
 assert.equal(bridge.H_EARTH_WATER_PRESENTATION_ENABLED,false);
 const hidden=pkg.drawRanges.filter(r=>!bridge.shouldPresentHEarthDrawRange(r));assert.equal(hidden.length,2);assert.equal(hidden.reduce((n,r)=>n+r.indexCount,0),59232);
 assert(hidden.every(r=>r.primitiveIds.every(bridge.isHEarthWaterPresentationPart)));
 assert(pkg.drawRanges.filter(bridge.shouldPresentHEarthDrawRange).some(r=>r.primitiveIds.some(id=>id.endsWith(':WET_SAND'))));
 assert.throws(()=>bridge.shouldPresentHEarthDrawRange({primitiveIds:['TERRAIN','OASIS_WATER']}),/MIXED_WATER_LAND/);
 assert.equal(model.meshes.filter(p=>bridge.isHEarthWaterPresentationPart(p.role)).length,2);
 assert(source.includes('if(!shouldPresentHEarthDrawRange(range))continue;'));
 assert(source.includes('if(!H_EARTH_WATER_PRESENTATION_ENABLED&&isHEarthWaterPresentationPart(part.role))continue;'));
 assert.equal(JSON.stringify(pkg),before);
});

test('hidden water leaves no invisible basin walking barrier or vegetation water surface',()=>{
 for(const z of [-288,-284,-280]){const water=model.sampleWaterAt(40,z);assert(water);const support=bridge.resolveGeologicalRuntimeFootSupport(40,z);assert(support.eligible);assert(water.y>support.footY+.5);}
 const surface=buildVegetationVisibleSurface(pkg,{geology:model});assert.equal(surface.water.triangleCount,0);assert.equal(surface.receipt.renderedWaterTriangles,0);
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
