import {createHash} from 'node:crypto';
import {integrated,geology,terrain,placement,visibleSurface} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {createUniformGroundAdmission} from '../../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE,buildHEarthOasisConnectedBasinIndex,buildHEarthOasisFoliagePresentation} from '../../../showroom/globe/h-earth/render/grass-lowland-trial.js';

// The sample rectangle is a legacy preparation window, not the planted shape.
// Protect its actual connected basin, conservative bank ring and generated
// foliage extents. This opt-in is used only by the coastal redistribution.
const bankRadius=6,foliageBuffer=.35;
const basin=buildHEarthOasisConnectedBasinIndex(integrated);
const foliage=buildHEarthOasisFoliagePresentation(integrated);
const wetCells=basin.wetCells.map(({x,z})=>Object.freeze({x,z}));
const foliageBounds=foliage.primitives.map(p=>{
 const vertices=p.geometry?.vertices;
 if(!Array.isArray(vertices)||!vertices.length)throw Error('CENTRAL_OASIS_GEOMETRY_REQUIRED');
 let minX=Infinity,minZ=Infinity,maxX=-Infinity,maxZ=-Infinity;
 for(const v of vertices){
  if(!Number.isFinite(v.x)||!Number.isFinite(v.z))throw Error('CENTRAL_OASIS_NONFINITE_VERTEX');
  minX=Math.min(minX,v.x);minZ=Math.min(minZ,v.z);maxX=Math.max(maxX,v.x);maxZ=Math.max(maxZ,v.z);
 }
 return Object.freeze({id:p.primitiveId,minX:minX-foliageBuffer,minZ:minZ-foliageBuffer,maxX:maxX+foliageBuffer,maxZ:maxZ+foliageBuffer});
});
if(!wetCells.length||!foliageBounds.length)throw Error('CENTRAL_OASIS_RESERVATION_EMPTY');
export function oasisClearance(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))throw Error('CENTRAL_OASIS_POINT_INVALID');
 let clearance=Infinity;
 for(const p of wetCells){
  clearance=Math.min(clearance,Math.hypot(x-p.x,z-p.z)-bankRadius);
  if(clearance<=0)return 0;
 }
 for(const b of foliageBounds){
  clearance=Math.min(clearance,Math.hypot(Math.max(b.minX-x,0,x-b.maxX),Math.max(b.minZ-z,0,z-b.maxZ)));
  if(clearance===0)return 0;
 }
 return clearance;
}
export const oasisReservedAt=(x,z)=>oasisClearance(x,z)===0;
export const reservationReceipt=Object.freeze({
 schema:'H_EARTH_COASTAL_ACTUAL_OASIS_RESERVATION_v1',
 coordinateSpace:'LOCAL_AUTHORING_XZ',sampleBounds:{minX:-18,maxX:34,minZ:-204,maxZ:-131},
 bankRadiusMeters:bankRadius,foliageBufferMeters:foliageBuffer,
 wetCellCount:wetCells.length,foliagePrimitiveCount:foliageBounds.length,
 grassTuftCount:foliage.grassTuftCount,cattailCount:foliage.cattailCount,
 reservationSha256:createHash('sha256').update(JSON.stringify({wetCells,bankRadius,foliageBounds})).digest('hex'),
 actualOasisGeometryChanged:false,estateAndFootRouteChanged:false,
 globalDefaultAdmissionChanged:false
});
export const centralGroundAdmission=await createUniformGroundAdmission({
 visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,
 estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,
 obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,
 oasis:H_EARTH_OASIS_FOLIAGE_SAMPLE,
 sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,
 maximumSandCoverage:.12,oasisReservedAt
});
