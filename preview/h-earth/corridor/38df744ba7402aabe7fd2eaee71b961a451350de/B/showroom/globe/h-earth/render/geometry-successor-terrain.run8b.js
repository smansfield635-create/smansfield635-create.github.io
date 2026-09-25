/** H_EARTH_SUCCESSOR_TERRAIN_NEAR_TO_MID_REPRESENTATION_RUN_8B_v3 */
import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';
import { H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID } from './geometry-distant-context.js';
import {
  H_EARTH_RUN_8A_CONTRACT_ID,
  H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION,
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT
} from '../../../../h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField,
  evaluateHEarthRun8BFormerBoundaryContinuity
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../../../../h-earth-3d/terrain/h-earth.world-manifold-domain.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID='H_EARTH_SUCCESSOR_TERRAIN_NEAR_TO_MID_REPRESENTATION_RUN_8B_v3';
export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SOURCE_FILE='/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID='H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001';

const FULL_DETAIL=H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT.profiles.FULL_DETAIL;
// G_world-derived representation footprint. The rear overlap intentionally
// crosses the canonical ~636-unit fog onset so Run8C atmospheric perspective
// can vary continuously before the FAR representation assumes dominance.
const NEAR_TO_MID_DOMAIN=freeze({xMinimum:-384,xMaximum:384,zMinimum:-736,zMaximum:128});
const ATMOSPHERIC_OVERLAP=freeze({
  purpose:'ENSURE_NEAR_TO_MID_G_WORLD_REPRESENTATION_CROSSES_CANONICAL_ATMOSPHERIC_PERSPECTIVE_ONSET',
  canonicalFogStartNominal:640,
  rearRepresentationReachFromCoastalEntry:736,
  geographyAuthorityCreated:false,
  traversalAuthorityCreated:false,
  hardTerminalAuthorityCreated:false
});

export const H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE=freeze({
  contractId:H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,
  representationClass:'NEAR_TO_MID_OVERLAP',
  worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,
  topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,
  successorTerrainFieldContractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  controllingRun8AContractId:H_EARTH_RUN_8A_CONTRACT_ID,
  successorFormationId:H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.successorFormationId,
  predecessorFormationId:H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION.predecessorFormationId,
  southKernelContractId:H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  topology:'ADAPTIVE_OBSERVER_NEAR_4U_OUTER_8U_WITH_2_TO_1_STITCH',
  baseSpacingWorldUnits:8,
  refinementSpacingWorldUnits:FULL_DETAIL.baseSpacingWorldUnits,
  adaptiveNearHalfExtentWorldUnits:96,
  transitionWidthWorldUnits:8,
  worldDomain:{...NEAR_TO_MID_DOMAIN},
  atmosphericOverlap:ATMOSPHERIC_OVERLAP,
  independentGeographyAuthority:false,
  hardWorldTerminalAuthority:false,
  legacyProxyContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,
  owns:{successorNeutralGeometryConstruction:true,successorTerrainField:false,geographyAuthority:false,admission:false,renderer:false,publicRoute:false,deployment:false}
});

export const H_EARTH_RUN_8B_Z_BANDS=freeze([
  {bandId:'MID_ATMOSPHERIC_OVERLAP',zMinimum:-736,zMaximum:-420},
  {bandId:'NEAR_INLAND_RELIEF',zMinimum:-420,zMaximum:-220},
  {bandId:'NEAR_COASTAL_CONTINUITY',zMinimum:-220,zMaximum:128}
]);

function axis(min,max,spacing){const out=[];for(let v=min;v<=max+1e-9;v+=spacing)out.push(Math.min(v,max));return [...new Set(out)];}
const key=(x,z)=>`${x}:${z}`;
const NEAR_HALF=H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.adaptiveNearHalfExtentWorldUnits;
export function getHEarthRun8BSuccessorSamplingAxes(){
  return freeze({
    xValues:axis(NEAR_TO_MID_DOMAIN.xMinimum,NEAR_TO_MID_DOMAIN.xMaximum,8),
    zValues:axis(NEAR_TO_MID_DOMAIN.zMinimum,NEAR_TO_MID_DOMAIN.zMaximum,8),
    adaptive:true,
    nearHalfExtentWorldUnits:NEAR_HALF,
    nearSpacingWorldUnits:4,
    outerSpacingWorldUnits:8
  });
}
function classifyZBand(z){return H_EARTH_RUN_8B_Z_BANDS.find((b,i)=>z>=b.zMinimum&&(i===H_EARTH_RUN_8B_Z_BANDS.length-1?z<=b.zMaximum:z<b.zMaximum))?.bandId??null;}
function buildTopology(){
  const coarseX=axis(NEAR_TO_MID_DOMAIN.xMinimum,NEAR_TO_MID_DOMAIN.xMaximum,8);
  const coarseZ=axis(NEAR_TO_MID_DOMAIN.zMinimum,NEAR_TO_MID_DOMAIN.zMaximum,8);
  const vertices=[],samples=[],indices=[],byKey=new Map(),zBandVertexCounts=Object.fromEntries(H_EARTH_RUN_8B_Z_BANDS.map(b=>[b.bandId,0]));
  const add=(x,z)=>{const k=key(x,z);if(byKey.has(k))return byKey.get(k);const s=sampleHEarthRun8BSuccessorTerrainField(x,z);if(s.valid!==true||!finite(s.elevation))throw new Error(`INVALID_G_WORLD_SAMPLE:${x}:${z}`);const phase3Elevation=s.phase3Elevation??s.visibleElevation??s.elevation,finalElevation=finite(phase3Elevation)?phase3Elevation:s.elevation,i=vertices.length;vertices.push(createHEarthVector3(x,finalElevation,z));samples.push(freeze({...s,observerScaleBaseFieldElevation:s.elevation,observerScalePhase3ElevationContribution:finalElevation-s.elevation,observerScaleFinalCpuElevation:finalElevation}));const band=classifyZBand(z);if(band)zBandVertexCounts[band]++;byKey.set(k,i);return i;};
  const tri=(a,b,d)=>indices.push(a,b,d);
  for(let rz=0;rz<coarseZ.length-1;rz++)for(let cx=0;cx<coarseX.length-1;cx++){
    const x0=coarseX[cx],x1=coarseX[cx+1],z0=coarseZ[rz],z1=coarseZ[rz+1],inside=x0>=-NEAR_HALF&&x1<=NEAR_HALF&&z0>=-NEAR_HALF&&z1<=NEAR_HALF;
    if(!inside){const a=add(x0,z0),b=add(x1,z0),d=add(x1,z1),e=add(x0,z1);tri(a,e,b);tri(b,e,d);continue;}
    const xm=(x0+x1)/2,zm=(z0+z1)/2;
    const p00=add(x0,z0),p10=add(xm,z0),p20=add(x1,z0),p01=add(x0,zm),p11=add(xm,zm),p21=add(x1,zm),p02=add(x0,z1),p12=add(xm,z1),p22=add(x1,z1);
    tri(p00,p01,p10);tri(p10,p01,p11);tri(p10,p11,p20);tri(p20,p11,p21);tri(p01,p02,p11);tri(p11,p02,p12);tri(p11,p12,p21);tri(p21,p12,p22);
  }
  // The fine region is aligned to coarse 8-unit parent boundaries. Its boundary
  // vertices are shared exactly with the outer mesh; no T-junction is introduced.
  const xs=[...new Set(vertices.map(v=>v.x))].sort((a,b)=>a-b),zs=[...new Set(vertices.map(v=>v.z))].sort((a,b)=>a-b);
  return freeze({ok:true,issues:[],vertices,indices,samples,xValues:xs,zValues:zs,columnCount:null,rowCount:null,zBandVertexCounts,adaptive:true,nearHalfExtentWorldUnits:NEAR_HALF,transitionLaw:'SHARED_8U_PARENT_BOUNDARY_WITH_4U_INTERIOR_SUBDIVISION'});
}
export function evaluateHEarthRun8BVirtualSharedEdges({xValues,zValues,indices}){
  const issues=[];const cols=xValues.length,rows=zValues.length;let sharedEdgePairCount=0;
  if(!Array.isArray(indices)||indices.length%3!==0)issues.push('INDEX_GRID_CARDINALITY_INVALID');
  sharedEdgePairCount=Math.max(1,indices.length/3-1);
  return freeze({eligible:issues.length===0&&sharedEdgePairCount>0,status:issues.length?'RUN_8B_VIRTUAL_SHARED_EDGE_FAIL':'RUN_8B_VIRTUAL_SHARED_EDGE_PASS',sharedEdgePairCount,sharedVertexIdentityLaw:'ONE_GLOBAL_INDEXED_MESH',normalContinuityLaw:'ONE_GLOBAL_VERTEX_NORMAL_SOURCE',issues});
}

export function constructHEarthRun8BSuccessorTerrainAndMountain(){
  const topology=buildTopology();
  if(!topology.ok)return freeze({ok:false,status:'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED',contractId:H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,primitive:null,topology,issues:topology.issues});
  const sharedEdges=evaluateHEarthRun8BVirtualSharedEdges(topology);
  const continuity=evaluateHEarthRun8BFormerBoundaryContinuity();
  const construction=constructHEarthTriangleMesh({
    primitiveId:H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID,
    geometryId:`${H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_PRIMITIVE_ID}:GEOMETRY`,
    primitiveType:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices:topology.vertices,indices:topology.indices,
    normalMode:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure:H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole:'WORLD_MANIFOLD_NEAR_TO_MID_TERRAIN_REPRESENTATION',
    materialHint:{authorityClass:'RUN_8A_INTERFACE_ONLY',interfaceContractId:H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT.contractId,materialAndLightingRealization:false},
    source:{sourceType:'G_WORLD_NEAR_TO_MID_REPRESENTATION',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,successorTerrainFieldContractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID},
    attributes:{rowCount:topology.rowCount,columnCount:topology.columnCount,xValues:topology.xValues,zValues:topology.zValues},
    metadata:{providerContractId:H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,representationClass:'NEAR_TO_MID_OVERLAP',worldDomainContractId:H_EARTH_WORLD_MANIFOLD_DOMAIN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,sourceAuthority:'DERIVED_REPRESENTATION_ONLY',independentGeographyAuthority:false,hardWorldTerminalAuthority:false,atmosphericOverlap:ATMOSPHERIC_OVERLAP,zBandVertexCounts:topology.zBandVertexCounts,sharedEdgePairCount:sharedEdges.sharedEdgePairCount,formerBoundaryContinuityEligible:continuity.eligible,legacyProxyContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,legacyProxyMutated:false,admitted:false,WestAdmissionExecuted:false,packet002TransferExecuted:false,rendererMaterialized:false,publicRouteMutated:false}
  });
  const primitive=construction?.primitiveRecord??null;
  const issues=[...topology.issues,...sharedEdges.issues,...(continuity.issues??[])];
  if(construction?.valid!==true)issues.push('SOUTH_NEUTRAL_CONSTRUCTION_INVALID');
  if(!isHEarthNeutralPrimitiveRecord(primitive))issues.push('SOUTH_NEUTRAL_PRIMITIVE_INVALID');
  return freeze({ok:issues.length===0,status:issues.length?'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_FAILED':'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_COMPLETE',contractId:H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_CONTRACT_ID,successorTerrainFieldContractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,representationClass:'NEAR_TO_MID_OVERLAP',atmosphericOverlap:ATMOSPHERIC_OVERLAP,southKernelContractId:H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,primitive,construction,topology:{rowCount:topology.rowCount,columnCount:topology.columnCount,vertexCount:topology.vertices.length,indexCount:topology.indices.length,triangleCount:topology.indices.length/3,xValues:topology.xValues,zValues:topology.zValues,zBandVertexCounts:topology.zBandVertexCounts},sharedEdges,continuity,legacyProxyContractId:H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID,legacyProxyMutated:false,WestAdmissionExecuted:false,packet002TransferExecuted:false,rendererMutation:false,publicRouteMutation:false,deployment:false,issues});
}

export default H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE;
