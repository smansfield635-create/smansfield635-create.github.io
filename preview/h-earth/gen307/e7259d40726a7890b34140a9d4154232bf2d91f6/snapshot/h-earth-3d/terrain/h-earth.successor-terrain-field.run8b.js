/**
 * H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v2_WORLD_MANIFOLD_DERIVATIVE
 * Run8B is no longer an independent geography authority. It is a deterministic
 * representation/normalization overlay on G_world.
 */
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN,
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  sampleHEarthWorldManifold
} from './h-earth.world-manifold-domain.js';
import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
} from '../control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID='H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v2_WORLD_MANIFOLD_DERIVATIVE';
export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_SOURCE_FILE='/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
export const H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID=freeze({
  contractId:'H_EARTH_RUN_8B_CANONICAL_ELEVATION_BINARY_GRID_2_NEGATIVE_24_v1',
  denominator:16777216,
  spacingWorldUnits:1/16777216,
  selectedByCheckpoint:'CP3D_1C_CANONICAL_TRANSCENDENTAL_NUMERIC_NORMALIZATION_DECISION',
  applicationBoundary:'RUN_8B_REPRESENTATION_PROJECTION_AFTER_G_WORLD_SAMPLE',
  negativeZeroNormalized:true
});

export function canonicalizeHEarthRun8BElevation(value){
  if(!finite(value))return value;
  const canonical=Math.round(value*H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator)/H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.denominator;
  return Object.is(canonical,-0)?0:canonical;
}

export const H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD=freeze({
  contractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  generationRevision:3,
  sourceAuthority:'DERIVATIVE_OVERLAY_ON_G_WORLD',
  worldManifoldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  controllingRun8AContractId:H_EARTH_RUN_8A_CONTRACT_ID,
  dimensionalSurfaceContractId:H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
  samplingAndRefinementContractId:H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.contractId,
  coordinateFrame:H_EARTH_WORLD_MANIFOLD_DOMAIN.coordinateFrame,
  worldDomain:{...H_EARTH_WORLD_MANIFOLD_DOMAIN.worldDomain},
  formerBoundaryZ:-256,
  successorFormationId:'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001',
  predecessorFormationId:'H_EARTH_DISTANT_HIGHLAND_001',
  sampling:{
    derivativeStep:0.5,
    baseSpacingWorldUnits:H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL.baseSpacingWorldUnits,
    refinementSpacingWorldUnits:H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL.refinementSpacingWorldUnits,
    sharedEdgeRule:'SAME_G_WORLD_COORDINATE_SAME_TOPOLOGY_AND_SAMPLE',
    normalRule:'CANONICAL_G_WORLD_NORMAL_SOURCE',
    deterministic:true,
    canonicalElevationGridContractId:H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.contractId
  },
  ownership:{
    ownsSuccessorWorldSpaceElevationLaw:false,
    ownsGeographicTopology:false,
    ownsRepresentationNormalization:true,
    ownsRun8ADerivativeReliefSemantics:true,
    ownsGeometry:false,
    ownsAdmission:false,
    ownsRenderer:false,
    ownsRoute:false
  },
  identityLaw:{
    canonicalWorldFieldIsSoleGeographyAuthority:true,
    predecessorAndSuccessorIdentityCollapse:'PROHIBITED',
    legacyProxyAndSuccessorMountainIdentityCollapse:'PROHIBITED'
  }
});

export function sampleHEarthRun8BSuccessorTerrainElevation(worldX,worldZ){
  const sample=sampleHEarthWorldManifold(worldX,worldZ);
  return sample.valid?canonicalizeHEarthRun8BElevation(sample.elevation):Number.NaN;
}

export function sampleHEarthRun8BSuccessorTerrainField(worldX,worldZ){
  const source=sampleHEarthWorldManifold(worldX,worldZ);
  if(source?.valid!==true)return freeze({valid:false,status:'RUN_8B_DERIVATIVE_SAMPLE_REJECTED',contractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,worldX,worldZ});
  const elevation=canonicalizeHEarthRun8BElevation(source.elevation);
  return freeze({
    ...source,
    world:{...source.world,y:elevation},
    elevation,
    status:'RUN_8B_WORLD_MANIFOLD_DERIVATIVE_SAMPLE_COMPLETE',
    contractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    generationRevision:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
    controllingRun8AContractId:H_EARTH_RUN_8A_CONTRACT_ID,
    topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
    worldManifoldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
    canonicalElevationGridContractId:H_EARTH_RUN_8B_CANONICAL_ELEVATION_GRID.contractId,
    independentGeographyAuthority:false,
    predecessorMutated:false
  });
}

export function evaluateHEarthRun8BFormerBoundaryContinuity({xMinimum=-256,xMaximum=256,sampleCount=33,tolerance=1/16777216}={}){
  const issues=[];
  let maximumDelta=0;
  for(let i=0;i<sampleCount;i++){
    const x=xMinimum+(i/(sampleCount-1))*(xMaximum-xMinimum);
    const a=sampleHEarthRun8BSuccessorTerrainField(x,-256);
    const b=sampleHEarthWorldManifold(x,-256);
    const delta=Math.abs(a.elevation-b.elevation);
    maximumDelta=Math.max(maximumDelta,delta);
    if(delta>tolerance)issues.push(`FORMER_BOUNDARY_G_WORLD_DIVERGENCE:${x}:${delta}`);
    if(a.topologySourceId!==b.topologySourceId)issues.push(`FORMER_BOUNDARY_TOPOLOGY_DIVERGENCE:${x}`);
  }
  return freeze({eligible:issues.length===0,status:issues.length?'RUN_8B_FORMER_BOUNDARY_CONTINUITY_FAIL':'RUN_8B_FORMER_BOUNDARY_CONTINUITY_PASS',maximumDelta,tolerance,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,predecessorMutated:false,issues});
}

export function evaluateHEarthRun8BSuccessorTerrainField(){
  const issues=[];
  const continuity=evaluateHEarthRun8BFormerBoundaryContinuity();
  const domain=H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain;
  const witnesses=[
    [domain.xMinimum,domain.zMinimum],[-224,-292],[-96,-271],[32,-236],[0,-256],[domain.xMaximum,domain.zMaximum]
  ].map(([x,z])=>sampleHEarthRun8BSuccessorTerrainField(x,z));
  if(!continuity.eligible)issues.push(...continuity.issues);
  if(witnesses.some(s=>s.valid!==true||!finite(s.elevation)))issues.push('RUN_8B_DERIVATIVE_WITNESS_INVALID');
  if(witnesses.some(s=>s.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID))issues.push('RUN_8B_TOPOLOGY_SOURCE_DIVERGENCE');
  return freeze({eligible:issues.length===0,status:issues.length?'RUN_8B_SUCCESSOR_TERRAIN_FIELD_FAIL':'RUN_8B_SUCCESSOR_TERRAIN_FIELD_PASS',contractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,generationRevision:3,sourceAuthority:'DERIVATIVE_OVERLAY_ON_G_WORLD',topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,continuity,witnesses,geometryConstructed:false,predecessorMutated:false,issues});
}

export default H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD;
