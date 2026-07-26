/**
 * /h-earth-3d/integration/h-earth.functional-landscape-post-west-transfer.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_RUN_6E_v1
 *
 * Successor occurrence derived from the existing Packet 002 transfer law.
 * It preserves a lawful functional-landscape West admission without changing
 * Packet 001, the minimum shoreline corridor, geometry-index authority,
 * compositor authority, renderer authority, or production status.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID
} from '../../showroom/globe/h-earth/render/landscape-preview.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const canonical = (values) => Object.freeze(
  [...new Set((Array.isArray(values) ? values : [])
    .filter((value) => typeof value === 'string' && value.length > 0))].sort()
);

export const H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_RUN_6E_v1';

export function buildHEarthFunctionalLandscapePostWestTransfer({
  neutralPreview,
  westBatchAdmissionResult,
  transferOccurrenceId
} = {}) {
  const issues = [];

  if (neutralPreview?.ok !== true ||
      neutralPreview?.contractId !== H_EARTH_FUNCTIONAL_LANDSCAPE_PREVIEW_CONTRACT_ID ||
      neutralPreview?.admitted !== false ||
      !Array.isArray(neutralPreview?.primitives) ||
      neutralPreview.primitives.length === 0) {
    issues.push('FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW_INVALID');
  }

  if (westBatchAdmissionResult?.valid !== true ||
      !isHEarthAggregateFrameAdmissionRecord(westBatchAdmissionResult?.frame) ||
      !Array.isArray(westBatchAdmissionResult?.primitiveAdmissions) ||
      westBatchAdmissionResult.primitiveAdmissions.length === 0) {
    issues.push('FUNCTIONAL_LANDSCAPE_WEST_BATCH_INVALID');
  }

  if (typeof transferOccurrenceId !== 'string' ||
      transferOccurrenceId.trim().length === 0) {
    issues.push('TRANSFER_OCCURRENCE_ID_INVALID');
  }

  const admittedPrimitives = Array.isArray(westBatchAdmissionResult?.primitiveAdmissions)
    ? westBatchAdmissionResult.primitiveAdmissions
        .map((admission) => admission?.primitive)
        .filter(Boolean)
    : [];

  if (!admittedPrimitives.every(isHEarthAdmittedPrimitiveRecord)) {
    issues.push('ADMITTED_PRIMITIVE_MEMBERSHIP_INVALID');
  }

  const previewIds = canonical(
    neutralPreview?.primitives?.map((primitive) => primitive.primitiveId)
  );
  const admittedIds = canonical(
    admittedPrimitives.map((primitive) => primitive.primitiveId)
  );
  const aggregateIds = canonical(
    westBatchAdmissionResult?.frame?.primitiveIds
  );

  if (previewIds.length === 0 ||
      JSON.stringify(previewIds) !== JSON.stringify(admittedIds) ||
      JSON.stringify(admittedIds) !== JSON.stringify(aggregateIds)) {
    issues.push('PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED');
  }

  const bounds = westBatchAdmissionResult?.frame?.bounds ?? null;
  if (!isHEarthAABB3D(bounds)) issues.push('ADMITTED_BOUNDS_INVALID');

  const semanticAddressIds = canonical(
    neutralPreview?.primitives?.flatMap((primitive) =>
      primitive?.metadata?.memberAddressIds ?? [])
  );
  const formationIds = canonical(
    neutralPreview?.primitives?.flatMap((primitive) =>
      primitive?.metadata?.formationIds ??
      [primitive?.metadata?.formationId].filter(Boolean))
  );
  const shorelineBandIds = canonical(
    neutralPreview?.primitives?.map((primitive) =>
      primitive?.metadata?.bandId).filter(Boolean)
  );

  if (semanticAddressIds.length === 0) {
    issues.push('SEMANTIC_ADDRESS_PROVENANCE_MISSING');
  }
  if (formationIds.length === 0) {
    issues.push('FORMATION_PROVENANCE_MISSING');
  }
  if (shorelineBandIds.length !== 7) {
    issues.push('SHORELINE_BAND_PROVENANCE_INCOMPLETE');
  }

  if (issues.length > 0) {
    return freeze({
      ok: false,
      status: 'FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_REJECTED',
      contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_CONTRACT_ID,
      transferOccurrenceId: transferOccurrenceId ?? null,
      issues
    });
  }

  return freeze({
    ok: true,
    status: 'FUNCTIONAL_LANDSCAPE_WEST_ADMISSION_COMPLETE_INDEX_NOT_YET_DEFINED',
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_POST_WEST_TRANSFER_CONTRACT_ID,
    sourcePatternContract:
      'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1',
    westContractId: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    previewContractId: neutralPreview.contractId,
    transferOccurrenceId: transferOccurrenceId.trim(),
    aggregateFrameId: westBatchAdmissionResult.frame.frameId,
    primitiveCount: admittedPrimitives.length,
    primitiveIds: admittedIds,
    admittedPrimitives,
    aggregateFrameAdmissionRecord: westBatchAdmissionResult.frame,
    bounds,
    semanticAddressIds,
    formationIds,
    shorelineBandIds,
    provisional: true,
    downstreamContractFrozen: true,
    geometryIndexEntryId: null,
    compositorNodeId: null,
    renderInstanceId: null,
    geometryIndexAuthority: false,
    compositorAuthority: false,
    rendererAuthority: false,
    runtimeActivated: false,
    productionAuthority: false,
    publicReleaseAuthority: false,
    packet001Altered: false,
    existingPacket002Altered: false,
    issues: []
  });
}
