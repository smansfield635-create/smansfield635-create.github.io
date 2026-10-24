import test from 'node:test';
import assert from 'node:assert/strict';
import {visibleSurface,groundAdmission,integrated,terrain,placement,geology} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {centralGroundAdmission,oasisReservedAt,oasisClearance,reservationReceipt} from './central-admission.mjs';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as O,buildHEarthOasisFoliagePresentation,buildHEarthOasisConnectedBasinIndex} from '../../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {createUniformGroundAdmission} from '../../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';

const added=[];
for(let z=O.minZ+1;z<O.maxZ;z++)for(let x=O.minX+1;x<O.maxX;x++){
 const support=visibleSurface.sample(x,z);
 if(support&&centralGroundAdmission(x,z,support)&&!groundAdmission(x,z,support))added.push({x,z,support});
}
test('actual dry ground inside legacy sample window is admitted without changing the default',()=>{
 assert(added.length>=100,'INSUFFICIENT_DRY_EXTERIOR_WITNESSES');
 for(const {x,z,support} of added){
  const local=terrain.unprojectPlanetVertex(x,support.y,z);
  assert(local.x>O.minX-.1&&local.x<O.maxX+.1&&local.z>O.minZ-.1&&local.z<O.maxZ+.1);
  assert(oasisClearance(local.x,local.z)>0);
  assert.equal(groundAdmission(x,z,support),false);
  const w=visibleSurface.water.sample(x,z);assert(!w||support.y>w.y+.03);
  const structure=placement.sampleHEarthGen311PlacementStructureDisposition(local.x,local.z);
  assert.equal(structure.hardExclusions.length,0);assert.equal(structure.planningHolds.length,0);
 }
});
test('every generated legacy oasis foliage vertex and connected wet cell remains reserved',()=>{
 const foliage=buildHEarthOasisFoliagePresentation(integrated),basin=buildHEarthOasisConnectedBasinIndex(integrated);
 assert.equal(foliage.grassTuftCount,reservationReceipt.grassTuftCount);
 assert.equal(foliage.cattailCount,reservationReceipt.cattailCount);
 let vertices=0;
 for(const p of foliage.primitives)for(const v of p.geometry.vertices){assert(oasisReservedAt(v.x,v.z),p.primitiveId);vertices++;}
 assert(vertices>1000);
 for(const p of basin.wetCells){
  assert(oasisReservedAt(p.x,p.z));
  for(const [dx,dz] of [[5.99,0],[-5.99,0],[0,5.99],[0,-5.99]])assert(oasisReservedAt(p.x+dx,p.z+dz));
 }
});
test('actual rendered water and estate/foot-route reservations remain excluded',()=>{
 let wet=0;
 for(let z=-204;z<-131;z+=2)for(let x=-18;x<34;x+=2){
  const s=visibleSurface.sample(x,z),w=visibleSurface.water.sample(x,z);
  if(s&&w&&s.y<=w.y+.03){assert.equal(centralGroundAdmission(x,z,s),false);wet++;}
 }
 assert(wet>0);
 const e=placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY;
 const points=[{x:80,z:-172},...e.footRoute];
 for(const p of points){
  const projected=terrain.projectRegionVertex(p.x,0,p.z),s=visibleSurface.sample(projected.x,projected.z);
  assert(s);assert.equal(centralGroundAdmission(projected.x,projected.z,s),false,JSON.stringify(p));
 }
});
test('ground admission is identical outside the legacy oasis sample rectangle',()=>{
 let checked=0,admitted=0;
 for(let z=-320;z<=-90;z+=8)for(let x=-440;x<=440;x+=8){
  const s=visibleSurface.sample(x,z);if(!s)continue;
  const local=terrain.unprojectPlanetVertex(x,s.y,z);
  if(local.x>=O.minX-.1&&local.x<=O.maxX+.1&&local.z>=O.minZ-.1&&local.z<=O.maxZ+.1)continue;
  const baseline=groundAdmission(x,z,s);
  assert.equal(centralGroundAdmission(x,z,s),baseline,`${x}:${z}`);checked++;admitted+=Number(baseline);
 }
 assert(checked>1000);assert(admitted>1000);
});
test('optional reservation callback fails closed on malformed inputs',async()=>{
 const args={visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,oasis:O,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12};
 await assert.rejects(createUniformGroundAdmission({...args,oasisReservedAt:true}),/OASIS_RESERVATION_REQUIRED/);
 const invalid=await createUniformGroundAdmission({...args,oasisReservedAt:()=>0});
 const {x,z,support}=added[0];assert.throws(()=>invalid(x,z,support),/OASIS_RESERVATION_INVALID/);
 assert.throws(()=>oasisClearance(NaN,0),/POINT_INVALID/);
});
