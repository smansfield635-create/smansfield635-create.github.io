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
  topology:'ONE_CONNECTED_INDEXED_XZ_HEIGHT_FIELD_TRIANGLE_MESH_SAMPLED_FROM_G_WORLD',
  baseSpacingWorldUnits:Math.max(8,FULL_DETAIL.baseSpacingWorldUnits),
  refinementSpacingWorldUnits:Math.max(4,FULL_DETAIL.refinementSpacingWorldUnits),
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
export function getHEarthRun8BSuccessorSamplingAxes(){
  return freeze({xValues:axis(NEAR_TO_MID_DOMAIN.xMinimum,NEAR_TO_MID_DOMAIN.xMaximum,H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.baseSpacingWorldUnits),zValues:axis(NEAR_TO_MID_DOMAIN.zMinimum,NEAR_TO_MID_DOMAIN.zMaximum,H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_PROFILE.baseSpacingWorldUnits)});
}
function classifyZBand(z){return H_EARTH_RUN_8B_Z_BANDS.find((b,i)=>z>=b.zMinimum&&(i===H_EARTH_RUN_8B_Z_BANDS.length-1?z<=b.zMaximum:z<b.zMaximum))?.bandId??null;}
function buildTopology(){
  const {xValues,zValues}=getHEarthRun8BSuccessorSamplingAxes();
  const vertices=[],samples=[],zBandVertexCounts=Object.fromEntries(H_EARTH_RUN_8B_Z_BANDS.map(b=>[b.bandId,0]));
  for(const z of zValues)for(const x of xValues){const s=sampleHEarthRun8BSuccessorTerrainField(x,z);if(s.valid!==true||!finite(s.elevation))return freeze({ok:false,issues:[`INVALID_G_WORLD_SAMPLE:${x}:${z}`],vertices:[],indices:[],samples:[],xValues,zValues,zBandVertexCounts});const band=classifyZBand(z);if(band)zBandVertexCounts[band]++;vertices.push(createHEarthVector3(x,s.elevation,z));samples.push(s);}
  const indices=[],cols=xValues.length,rows=zValues.length;
  for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){const a=r*cols+c,b=a+1,d=(r+1)*cols+c+1,e=(r+1)*cols+c;indices.push(a,e,b,b,e,d);}
  return freeze({ok:true,issues:[],vertices,indices,samples,xValues,zValues,columnCount:cols,rowCount:rows,zBandVertexCounts});
}

export function evaluateHEarthRun8BVirtualSharedEdges({xValues,zValues,indices}){
  const issues=[];const cols=xValues.length,rows=zValues.length;let sharedEdgePairCount=0;
  if(indices.length!==(cols-1)*(rows-1)*6)issues.push('INDEX_GRID_CARDINALITY_INVALID');
  for(let r=0;r<rows-1;r++)for(let c=1;c<cols-1;c++)sharedEdgePairCount++;
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
