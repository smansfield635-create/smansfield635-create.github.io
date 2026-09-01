/** H_EARTH_WORLD_MANIFOLD_DOMAIN_v1 */
import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from './h-earth.terrain-field.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID='H_EARTH_WORLD_MANIFOLD_DOMAIN_v1';
export const H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID='H_EARTH_CANONICAL_WORLD_TOPOLOGY_G_WORLD_v1';
export const H_EARTH_WORLD_MANIFOLD_LANDMASS_ID='GRATITUDE_CONTINENT';
export const H_EARTH_WORLD_MANIFOLD_OCEAN_ID='GRATITUDE_OPEN_OCEAN';

export const H_EARTH_WORLD_MANIFOLD_DOMAIN=freeze({
  contractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  canonicalTerrainFieldContractId:H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  coordinateFrame:H_EARTH_TERRAIN_FIELD.coordinateFrame,
  worldDomain:{...H_EARTH_TERRAIN_FIELD.worldDomain},
  sourceAuthority:'ONE_CANONICAL_GEOGRAPHIC_FIELD_G_WORLD',
  sourceFieldMutationPerformed:false,
  predicates:{
    CONTINUOUS_WORLD_MANIFOLD:true,
    SINGLE_WORLD_ENVELOPE_DOMAIN_FUNCTION:true,
    TOPOLOGY_PRESERVING_LOD:true,
    OCEAN_SECTOR_EMPTINESS:true
  },
  law:'ALL_DISTANCE_REPRESENTATIONS_SAMPLE_THIS_DOMAIN_BEFORE_REPRESENTATION_OR_PLANETARY_TRANSFORM'
});

export function classifyHEarthWorldAngularSector(thetaRadians){
  if(!finite(thetaRadians))return 'INVALID';
  const tau=Math.PI*2;
  const theta=((thetaRadians%tau)+tau)%tau;
  // Local coastal entry faces generally waterward (+Z). Preserve a broad hard
  // open-ocean sector around that bearing; lateral/back sectors remain
  // continent/coastal candidates and are resolved by coordinate sampling.
  const forward=Math.PI/2;
  const delta=Math.abs(Math.atan2(Math.sin(theta-forward),Math.cos(theta-forward)));
  if(delta<=Math.PI*0.34)return 'OPEN_OCEAN';
  if(delta<=Math.PI*0.48)return 'COASTAL';
  return 'CONTINENT';
}

export function sampleHEarthWorldManifold(worldX,worldZ){
  if(!finite(worldX)||!finite(worldZ))return freeze({valid:false,status:'WORLD_MANIFOLD_SAMPLE_REJECTED_NONFINITE',worldX,worldZ});
  const source=sampleHEarthTerrainField(worldX,worldZ);
  if(source?.valid!==true)return freeze({valid:false,status:'WORLD_MANIFOLD_SOURCE_SAMPLE_INVALID',worldX,worldZ});
  const shorelineZ=getHEarthCanonicalShorelineZ(worldX);
  const signedInlandDistance=shorelineZ-worldZ;
  const absCoastalDistance=Math.abs(signedInlandDistance);
  const surfaceClass=signedInlandDistance<0?'WATER':absCoastalDistance<=42?'COASTAL':'LAND';
  const oceanSectorClass=surfaceClass==='WATER'?'OPEN_OCEAN':surfaceClass==='COASTAL'?'COASTAL':'CONTINENT';
  return freeze({
    valid:true,
    status:'WORLD_MANIFOLD_SAMPLE_COMPLETE',
    contractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    sourceTerrainFieldContractId:H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    world:{...source.world},
    elevation:source.elevation,
    normal:{...source.normal},
    slope:source.slope,
    curvature:source.curvature,
    materialProfile:source.materialProfile,
    surfaceClass,
    coastalEdgeIdentity:'GRATITUDE_CANONICAL_CONTINENTAL_COAST',
    landmassIdentity:surfaceClass==='WATER'?null:H_EARTH_WORLD_MANIFOLD_LANDMASS_ID,
    oceanIdentity:surfaceClass==='WATER'?H_EARTH_WORLD_MANIFOLD_OCEAN_ID:null,
    oceanSectorClass,
    macroRelief:freeze({elevation:source.elevation,slope:source.slope,curvature:source.curvature}),
    normalSource:'CANONICAL_TERRAIN_FIELD_CENTRAL_DIFFERENCE',
    topologyPreserved:true,
    terrainSilhouettePermitted:surfaceClass!=='WATER'
  });
}

export function evaluateHEarthWorldManifoldDomain(){
  const domain=H_EARTH_WORLD_MANIFOLD_DOMAIN.worldDomain;
  const witnesses=[
    [0,getHEarthCanonicalShorelineZ(0)-80],
    [0,getHEarthCanonicalShorelineZ(0)],
    [0,getHEarthCanonicalShorelineZ(0)+240],
    [domain.xMinimum,domain.zMinimum],
    [domain.xMaximum,domain.zMinimum],
    [domain.xMinimum,domain.zMaximum],
    [domain.xMaximum,domain.zMaximum]
  ].map(([x,z])=>sampleHEarthWorldManifold(x,z));
  const issues=[];
  if(witnesses.some(x=>x.valid!==true))issues.push('WORLD_MANIFOLD_WITNESS_INVALID');
  if(witnesses.some(x=>x.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID))issues.push('TOPOLOGY_SOURCE_DIVERGENCE');
  const water=witnesses.find(x=>x.surfaceClass==='WATER');
  if(!water||water.terrainSilhouettePermitted!==false)issues.push('OPEN_OCEAN_EMPTINESS_NOT_ENFORCED');
  return freeze({eligible:issues.length===0,status:issues.length?'WORLD_MANIFOLD_DOMAIN_FAIL':'WORLD_MANIFOLD_DOMAIN_PASS',contractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,witnesses,issues});
}

export default H_EARTH_WORLD_MANIFOLD_DOMAIN;
