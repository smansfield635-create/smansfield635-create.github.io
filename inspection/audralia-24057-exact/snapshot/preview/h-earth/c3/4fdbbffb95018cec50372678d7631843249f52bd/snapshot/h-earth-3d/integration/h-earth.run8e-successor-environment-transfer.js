/** H_EARTH_RUN_8E_PACKET_002_SUCCESSOR_ENVIRONMENT_TRANSFER_v1 */
import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const canonical = (values) => Object.freeze([...new Set((values ?? []).filter((value) => typeof value === 'string' && value.length > 0))].sort());

export const H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID =
  'H_EARTH_RUN_8E_PACKET_002_SUCCESSOR_ENVIRONMENT_TRANSFER_v1';
export const H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID =
  'H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_NEUTRAL_PACKAGE_v1';

export function buildHEarthRun8EPacket002SuccessorTransfer({
  neutralPackage,
  westBatchAdmissionResult,
  transferOccurrenceId = 'H_EARTH_RUN_8E_PACKET_002_TRANSFER_OCCURRENCE_001'
} = {}) {
  const issues = [];
  if (neutralPackage?.ok !== true || neutralPackage?.contractId !== H_EARTH_RUN_8E_NEUTRAL_PACKAGE_CONTRACT_ID || neutralPackage?.admitted !== false) {
    issues.push('RUN_8E_NEUTRAL_PACKAGE_INVALID');
  }
  if (westBatchAdmissionResult?.valid !== true ||
      !isHEarthAggregateFrameAdmissionRecord(westBatchAdmissionResult?.frame) ||
      !Array.isArray(westBatchAdmissionResult?.primitiveAdmissions)) {
    issues.push('RUN_8E_WEST_BATCH_INVALID');
  }
  if (typeof transferOccurrenceId !== 'string' || transferOccurrenceId.trim().length === 0) {
    issues.push('RUN_8E_TRANSFER_OCCURRENCE_ID_INVALID');
  }

  const admittedPrimitives = (westBatchAdmissionResult?.primitiveAdmissions ?? [])
    .map((admission) => admission?.primitive)
    .filter(Boolean);
  if (!admittedPrimitives.every(isHEarthAdmittedPrimitiveRecord)) {
    issues.push('RUN_8E_ADMITTED_PRIMITIVE_INVALID');
  }

  const neutralIds = canonical(neutralPackage?.primitives?.map((primitive) => primitive.primitiveId));
  const admittedIds = canonical(admittedPrimitives.map((primitive) => primitive.primitiveId));
  const aggregateIds = canonical(westBatchAdmissionResult?.frame?.primitiveIds);
  if (JSON.stringify(neutralIds) !== JSON.stringify(admittedIds) ||
      JSON.stringify(admittedIds) !== JSON.stringify(aggregateIds)) {
    issues.push('RUN_8E_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED');
  }
  if (!isHEarthAABB3D(westBatchAdmissionResult?.frame?.bounds)) issues.push('RUN_8E_ADMITTED_BOUNDS_INVALID');
  if (neutralPackage?.terrainPrimitiveCount !== 1) issues.push('RUN_8E_TERRAIN_PRIMITIVE_COUNT_INVALID');
  if (neutralPackage?.shorelinePrimitiveCount !== 7) issues.push('RUN_8E_SHORELINE_PRIMITIVE_COUNT_INVALID');
  const historicalComposition = neutralPackage?.compositionMode !== 'CONTENT_ADDRESSED_CURRENT_TERRAIN';
  if (historicalComposition && neutralPackage?.vegetationPrimitiveCount !== 27) issues.push('RUN_8E_VEGETATION_PRIMITIVE_COUNT_INVALID');
  if (historicalComposition && admittedPrimitives.length !== 35) issues.push(`RUN_8E_ADMITTED_PRIMITIVE_COUNT_EXPECTED_35_ACTUAL_${admittedPrimitives.length}`);
  if (!historicalComposition && admittedPrimitives.length !== neutralPackage?.primitiveCount) issues.push('RUN_8E_CURRENT_COMPOSITION_MEMBERSHIP_COUNT_MISMATCH');
  if (neutralPackage?.semanticAddressCount !== 256) issues.push('RUN_8E_SEMANTIC_ADDRESS_PROVENANCE_INVALID');
  if (neutralPackage?.terrainAddressCount !== 124) issues.push('RUN_8E_TERRAIN_ADDRESS_PROVENANCE_INVALID');
  if (neutralPackage?.shorelineWaterAddressCount !== 96) issues.push('RUN_8E_SHORELINE_ADDRESS_PROVENANCE_INVALID');
  if (neutralPackage?.proxySummarizedAddressCount !== 36) issues.push('RUN_8E_PROXY_SEMANTIC_PROVENANCE_INVALID');
  if (neutralPackage?.legacyProxyIncluded !== false || neutralPackage?.successorMountainIncluded !== true) {
    issues.push('RUN_8E_LEGACY_PROXY_SUCCESSOR_DISPOSITION_INVALID');
  }

  if (issues.length > 0) {
    return freeze({
      ok: false,
      status: 'RUN_8E_PACKET_002_SUCCESSOR_TRANSFER_REJECTED',
      contractId: H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
      issues
    });
  }

  return freeze({
    ok: true,
    status: 'RUN_8E_PACKET_002_SUCCESSOR_TRANSFER_COMPLETE',
    contractId: H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
    westContractId: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    neutralPackageContractId: neutralPackage.contractId,
    compositionMode: neutralPackage.compositionMode ?? 'HISTORICAL_R2_CLOSED',
    transferOccurrenceId: transferOccurrenceId.trim(),
    aggregateFrameId: westBatchAdmissionResult.frame.frameId,
    primitiveCount: admittedPrimitives.length,
    primitiveIds: admittedIds,
    admittedPrimitives,
    aggregateFrameAdmissionRecord: westBatchAdmissionResult.frame,
    bounds: westBatchAdmissionResult.frame.bounds,
    semanticAddressCount: neutralPackage.semanticAddressCount,
    semanticAddressIds: neutralPackage.semanticAddressIds,
    terrainAddressCount: neutralPackage.terrainAddressCount,
    terrainAddressIds: neutralPackage.terrainAddressIds,
    shorelineWaterAddressCount: neutralPackage.shorelineWaterAddressCount,
    shorelineWaterAddressIds: neutralPackage.shorelineWaterAddressIds,
    proxySummarizedAddressCount: neutralPackage.proxySummarizedAddressCount,
    proxySummarizedAddressIds: neutralPackage.proxySummarizedAddressIds,
    formationIds: neutralPackage.formationIds,
    shorelineBandIds: neutralPackage.shorelineBandIds,
    terrainPrimitiveCount: neutralPackage.terrainPrimitiveCount,
    shorelinePrimitiveCount: neutralPackage.shorelinePrimitiveCount,
    vegetationPrimitiveCount: neutralPackage.vegetationPrimitiveCount,
    legacyProxyIncluded: false,
    legacyProxyPreservedOutsideSuccessorFrame: true,
    successorMountainIncluded: true,
    packet001Altered: false,
    existingPacket002Altered: false,
    compositorAuthority: false,
    rendererAuthority: false,
    publicRouteAuthority: false,
    deploymentAuthority: false,
    issues: []
  });
}
