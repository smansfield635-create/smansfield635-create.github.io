import {
  H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
  constructHEarthGroundViewGateBGeometry
} from './ground-view-gate-b.js';

import {
  admitHEarthPrimitiveBatch
} from './geometry-kernel.js';

import {
  buildHEarthPostWestAdmittedGeometryTransfer
} from '../../../../h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js';

export const H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID =
  'H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CANDIDATE_v1';

const PREVIEW_COMPATIBILITY_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
}

function canonicalUnique(values) {
  return Object.freeze(Array.from(new Set(values)).sort());
}

function buildProvenance(construction, requestId) {
  return deepFreeze({
    requestId,
    providerRequestId: construction.receipt.receiptId,
    resolutionReceiptId: construction.receipt.deterministicConstructionIdentity,
    sourceObjectIds: canonicalUnique(construction.primitives.map((primitive) => primitive.primitiveId)),
    sourceZoneIds: Object.freeze(['H_EARTH_GROUND_VIEW_GATE_B']),
    latticeRegionIds: Object.freeze(['H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_DOMAIN'])
  });
}

function enrichNeutralPrimitives(primitives, provenance) {
  return deepFreeze(primitives.map((primitive) => ({
    ...primitive,
    metadata: {
      ...(primitive.metadata ?? {}),
      sourceObjectId: primitive.primitiveId,
      sourceObjectIds: Object.freeze([primitive.primitiveId]),
      sourceZoneIds: provenance.sourceZoneIds,
      latticeRegionIds: provenance.latticeRegionIds,
      requestId: provenance.requestId,
      providerRequestId: provenance.providerRequestId,
      resolutionReceiptId: provenance.resolutionReceiptId,
      gateBProviderContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID
    }
  })));
}

function normalizeWestAdmission(westBatchAdmissionResult) {
  return deepFreeze({
    ...westBatchAdmissionResult,
    primitiveAdmissions: westBatchAdmissionResult.primitiveAdmissions.map((admission) => ({
      ...admission,
      primitiveId: admission.primitive?.primitiveId ?? null
    }))
  });
}

export function buildHEarthGroundViewGateBPacket002Transfer(options = {}) {
  const token = options.occurrenceToken ?? `${Date.now()}`;
  const requestId = options.requestId ?? `H_EARTH_GATE_B_ROUTE_REQUEST:${token}`;
  const frameId = options.frameId ?? `H_EARTH_GATE_B_ROUTE_FRAME:${token}`;

  const construction = constructHEarthGroundViewGateBGeometry();
  if (construction.valid !== true || construction.primitives.length !== 3) {
    throw new Error('Gate B construction did not produce the required three neutral primitives.');
  }

  const provenance = buildProvenance(construction, requestId);
  const enrichedPrimitives = enrichNeutralPrimitives(construction.primitives, provenance);

  const previewResult = deepFreeze({
    ok: true,
    status: 'GATE_B_PROVIDER_TRANSLATED_TO_PACKET_002_PREVIEW_BOUNDARY',
    contractId: PREVIEW_COMPATIBILITY_CONTRACT_ID,
    adapterContractId: H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID,
    providerContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
    admitted: false,
    WestAdmissionPerformed: false,
    primitives: enrichedPrimitives,
    ...provenance,
    geometryIndexEntryId: null,
    compositorNodeId: null,
    renderInstanceId: null
  });

  const rawWestBatchAdmissionResult = admitHEarthPrimitiveBatch(
    enrichedPrimitives,
    {
      frameId,
      metadata: {
        ...provenance,
        adapterContractId: H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID,
        gateBProviderContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID
      }
    }
  );

  const westBatchAdmissionResult = normalizeWestAdmission(rawWestBatchAdmissionResult);
  const packet002Transfer = buildHEarthPostWestAdmittedGeometryTransfer({
    previewResult,
    westBatchAdmissionResult
  });

  return deepFreeze({
    valid: packet002Transfer.ok === true,
    adapterContractId: H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID,
    construction,
    provenance,
    previewResult,
    westBatchAdmissionResult,
    packet002Transfer,
    routeIntegrated: false,
    compositorIntegrated: false,
    rendererMaterialized: false,
    validationClaim: false,
    productionClaim: false
  });
}
