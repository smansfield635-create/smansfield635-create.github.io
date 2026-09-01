/** H_EARTH_RUN_8E_PACKET_002_WORLD_MANIFOLD_TRANSFER_v2_GEN311_REGIONAL */
import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';
import {
  H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID
} from '../terrain/h-earth.world-manifold-domain.js';
import {
  H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID
} from './h-earth.world-representation-plan.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const canonical=values=>Object.freeze([...new Set((values??[]).filter(v=>typeof v==='string'&&v.length))].sort());
export const H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID='H_EARTH_RUN_8E_PACKET_002_WORLD_MANIFOLD_TRANSFER_v2';
export const H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID='H_EARTH_RUN_8E_WORLD_MANIFOLD_NEUTRAL_PACKAGE_v2';
export const H_EARTH_GEN311_PACKET_002_REGIONAL_TRANSFER_EXTENSION_ID='H_EARTH_RUN_8E_PACKET_002_GEN311_REGIONAL_DEVELOPMENT_EXTENSION_v1';

export function buildHEarthRun8EPacket002SuccessorTransfer({neutralPackage,westBatchAdmissionResult,transferOccurrenceId='H_EARTH_RUN_8E_PACKET_002_TRANSFER_OCCURRENCE_001'}={}){
  const issues=[];
  if(neutralPackage?.ok!==true||neutralPackage?.contractId!==H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID||neutralPackage?.admitted!==false)issues.push('RUN_8E_NEUTRAL_PACKAGE_INVALID');
  if(neutralPackage?.representationPlan?.contractId!==H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID||neutralPackage?.representationPlan?.eligible!==true)issues.push('RUN_8E_WORLD_REPRESENTATION_PLAN_INVALID');
  if(neutralPackage?.topologySourceId!==H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID)issues.push('RUN_8E_TOPOLOGY_SOURCE_INVALID');
  if(neutralPackage?.worldManifoldUnion?.valid!==true)issues.push('RUN_8E_WORLD_MANIFOLD_UNION_INVALID');
  if(neutralPackage?.canonicalWorldFieldProtected!==true)issues.push('GEN311_CANONICAL_WORLD_FIELD_NOT_PROTECTED');
  if(neutralPackage?.regionalEnvironmentMaterialized!==true||neutralPackage?.regionalDevelopment?.sampleCount<20)issues.push('GEN311_REGIONAL_ENVIRONMENT_NOT_MATERIALIZED');
  if(neutralPackage?.regionalVegetation?.eligible!==true||neutralPackage?.regionalEcologyPrimitiveCount<=0)issues.push('GEN311_REGIONAL_VEGETATION_NOT_MATERIALIZED');
  if(westBatchAdmissionResult?.valid!==true||!isHEarthAggregateFrameAdmissionRecord(westBatchAdmissionResult?.frame)||!Array.isArray(westBatchAdmissionResult?.primitiveAdmissions))issues.push('RUN_8E_WEST_BATCH_INVALID');
  if(typeof transferOccurrenceId!=='string'||!transferOccurrenceId.trim())issues.push('RUN_8E_TRANSFER_OCCURRENCE_ID_INVALID');
  const admittedPrimitives=(westBatchAdmissionResult?.primitiveAdmissions??[]).map(a=>a?.primitive).filter(Boolean);
  if(!admittedPrimitives.every(isHEarthAdmittedPrimitiveRecord))issues.push('RUN_8E_ADMITTED_PRIMITIVE_INVALID');
  const neutralIds=canonical(neutralPackage?.primitives?.map(p=>p.primitiveId)),admittedIds=canonical(admittedPrimitives.map(p=>p.primitiveId)),aggregateIds=canonical(westBatchAdmissionResult?.frame?.primitiveIds);
  if(JSON.stringify(neutralIds)!==JSON.stringify(admittedIds)||JSON.stringify(admittedIds)!==JSON.stringify(aggregateIds))issues.push('RUN_8E_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED');
  if(!isHEarthAABB3D(westBatchAdmissionResult?.frame?.bounds))issues.push('RUN_8E_ADMITTED_BOUNDS_INVALID');
  if(neutralPackage?.terrainPrimitiveCount!==1)issues.push('RUN_8E_TERRAIN_PRIMITIVE_COUNT_INVALID');
  if(neutralPackage?.shorelinePrimitiveCount!==7)issues.push('RUN_8E_SHORELINE_PRIMITIVE_COUNT_INVALID');
  if(neutralPackage?.farRepresentationPrimitiveCount!==2)issues.push('RUN_8E_FAR_REPRESENTATION_COUNT_INVALID');
  if(admittedPrimitives.length!==neutralPackage?.primitiveCount)issues.push('RUN_8E_CURRENT_COMPOSITION_MEMBERSHIP_COUNT_MISMATCH');
  if(neutralPackage?.semanticAddressCount!==256||neutralPackage?.terrainAddressCount!==124||neutralPackage?.shorelineWaterAddressCount!==96||neutralPackage?.proxySummarizedAddressCount!==36)issues.push('RUN_8E_SEMANTIC_PROVENANCE_INVALID');
  if(issues.length)return freeze({ok:false,status:'RUN_8E_PACKET_002_WORLD_MANIFOLD_TRANSFER_REJECTED',contractId:H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,gen311ExtensionId:H_EARTH_GEN311_PACKET_002_REGIONAL_TRANSFER_EXTENSION_ID,issues});
  return freeze({ok:true,status:'RUN_8E_PACKET_002_WORLD_MANIFOLD_TRANSFER_COMPLETE',contractId:H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,gen311ExtensionId:H_EARTH_GEN311_PACKET_002_REGIONAL_TRANSFER_EXTENSION_ID,westContractId:H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,neutralPackageContractId:neutralPackage.contractId,compositionMode:'WORLD_MANIFOLD_GEN311_REGIONAL_ELABORATION',transferOccurrenceId:transferOccurrenceId.trim(),aggregateFrameId:westBatchAdmissionResult.frame.frameId,primitiveCount:admittedPrimitives.length,primitiveIds:admittedIds,admittedPrimitives,aggregateFrameAdmissionRecord:westBatchAdmissionResult.frame,bounds:westBatchAdmissionResult.frame.bounds,representationPlanContractId:H_EARTH_WORLD_REPRESENTATION_PLAN_CONTRACT_ID,topologySourceId:H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID,worldManifoldUnion:neutralPackage.worldManifoldUnion,regionalDevelopment:neutralPackage.regionalDevelopment,regionalVegetationContractId:neutralPackage.regionalVegetation?.contractId,regionalEcologyPrimitiveCount:neutralPackage.regionalEcologyPrimitiveCount,canonicalWorldFieldProtected:true,regionalEnvironmentMaterialized:true,semanticAddressCount:neutralPackage.semanticAddressCount,semanticAddressIds:neutralPackage.semanticAddressIds,terrainAddressCount:neutralPackage.terrainAddressCount,terrainAddressIds:neutralPackage.terrainAddressIds,shorelineWaterAddressCount:neutralPackage.shorelineWaterAddressCount,shorelineWaterAddressIds:neutralPackage.shorelineWaterAddressIds,proxySummarizedAddressCount:neutralPackage.proxySummarizedAddressCount,proxySummarizedAddressIds:neutralPackage.proxySummarizedAddressIds,formationIds:neutralPackage.formationIds,shorelineBandIds:neutralPackage.shorelineBandIds,terrainPrimitiveCount:neutralPackage.terrainPrimitiveCount,shorelinePrimitiveCount:neutralPackage.shorelinePrimitiveCount,farRepresentationPrimitiveCount:neutralPackage.farRepresentationPrimitiveCount,vegetationPrimitiveCount:neutralPackage.vegetationPrimitiveCount,legacyProxyIncluded:false,successorMountainIncluded:true,packet001Altered:false,existingPacket002Altered:false,compositorAuthority:false,rendererAuthority:false,publicRouteAuthority:false,deploymentAuthority:false,issues:[]});
}
