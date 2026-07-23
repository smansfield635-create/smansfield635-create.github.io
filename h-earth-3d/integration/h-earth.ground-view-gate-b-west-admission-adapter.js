/**
 * /h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js
 * Gate B provider-result to public-West admission adapter.
 */

import {
  H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS,
  H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION
} from '../../showroom/globe/h-earth/render/ground-view-gate-b.js';

export { H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS };

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_WEST_ENUMS,
  admitHEarthPrimitiveBatch,
  isHEarthNeutralPrimitiveRecord,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D,
  isHEarthGeometryToleranceContext
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID =
  'H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_FILE_BIRTH_DISTINCT_OCCURRENCE_v1';

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SCHEMA_VERSION = 1;
export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SOURCE_FILE =
  '/h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js';
export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_ROLE =
  'GATE_B_PROVIDER_RESULT_TO_PUBLIC_WEST_ADMISSION_ORCHESTRATION_ONLY';
export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_STATUS =
  'H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_COMPLETE';

const REJECTED_STATUS =
  'H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_REJECTED';
const EXECUTION_CLASS = 'GATE_B_DIAGNOSTIC_CHILD_ROUTE_ENTRY';
const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const INPUT_KEYS = Object.freeze([
  'gateBConstructionResult',
  'executionIdentity',
  'provenanceApplicability',
  'toleranceContext'
]);
const EXECUTION_IDENTITY_KEYS = Object.freeze([
  'executionClass',
  'routeToken',
  'adapterOccurrenceId',
  'aggregateFrameId',
  'packet002TransferOccurrenceId',
  'compositorFrameOccurrenceId'
]);
const PROVENANCE_KEYS = Object.freeze([
  'primitiveId',
  'sourceObjectApplicability',
  'sourceZoneApplicability',
  'latticeRegionApplicability',
  'semanticObjectCorrespondenceIds',
  'semanticZoneCorrespondenceIds',
  'synthesisProhibited'
]);
const PRIMITIVE_ORDER = Object.freeze([
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.terrain,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.water,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.diagnosticRibbon
]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function isDeeplyFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value);
  return Reflect.ownKeys(value).every((key) => isDeeplyFrozen(value[key], seen));
}

function isPlainRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype;
}

function exactKeys(value, expected) {
  if (!isPlainRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function exactArray(value, expected) {
  return Array.isArray(value) && value.length === expected.length &&
    value.every((entry, index) => entry === expected[index]);
}

function nonemptyExactString(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value;
}

function issue(code, message, field = null, details = null) {
  return Object.freeze({ code, severity: 'ERROR', message, field, details });
}

function freezeIssues(issues) {
  return Object.freeze(issues.map((entry) => Object.freeze({ ...entry })));
}

function buildProvenanceRecord({
  primitiveId,
  sourceObjectApplicability,
  sourceZoneApplicability,
  latticeRegionApplicability,
  semanticObjectCorrespondenceIds,
  semanticZoneCorrespondenceIds
}) {
  return deepFreeze({
    primitiveId,
    sourceObjectApplicability,
    sourceZoneApplicability,
    latticeRegionApplicability,
    semanticObjectCorrespondenceIds: Object.freeze([...semanticObjectCorrespondenceIds]),
    semanticZoneCorrespondenceIds: Object.freeze([...semanticZoneCorrespondenceIds]),
    synthesisProhibited: true
  });
}

export const H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY =
  Object.freeze([
    buildProvenanceRecord({
      primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.terrain,
      sourceObjectApplicability: 'NOT_ESTABLISHED_AND_PROHIBITED_FROM_SYNTHESIS',
      sourceZoneApplicability: 'NOT_ESTABLISHED_AND_PROHIBITED_FROM_SYNTHESIS',
      latticeRegionApplicability: 'NOT_ESTABLISHED_AND_PROHIBITED_FROM_SYNTHESIS',
      semanticObjectCorrespondenceIds: [],
      semanticZoneCorrespondenceIds: []
    }),
    buildProvenanceRecord({
      primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.water,
      sourceObjectApplicability: 'PARTIALLY_APPLICABLE_AS_SEMANTIC_CORRESPONDENCE_ONLY',
      sourceZoneApplicability: 'PARTIALLY_APPLICABLE_AS_SEMANTIC_CORRESPONDENCE_ONLY',
      latticeRegionApplicability: 'NOT_ESTABLISHED_AND_PROHIBITED_FROM_SYNTHESIS',
      semanticObjectCorrespondenceIds: [
        'OBJ_006_NEARSHORE_WAVE_BAND',
        'OBJ_007_WATER_SURFACE_PLANE'
      ],
      semanticZoneCorrespondenceIds: ['ZONE_003_WATER_SURFACE_ZONE']
    }),
    buildProvenanceRecord({
      primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.diagnosticRibbon,
      sourceObjectApplicability: 'NOT_APPLICABLE',
      sourceZoneApplicability: 'NOT_APPLICABLE',
      latticeRegionApplicability: 'NOT_APPLICABLE',
      semanticObjectCorrespondenceIds: [],
      semanticZoneCorrespondenceIds: []
    })
  ]);

function validateExecutionIdentity(value, issues) {
  if (!exactKeys(value, EXECUTION_IDENTITY_KEYS) || !isDeeplyFrozen(value)) {
    issues.push(issue(
      'GATE_B_EXECUTION_IDENTITY_SURFACE_INVALID',
      'executionIdentity must be one deeply frozen exact six-field record.',
      'executionIdentity'
    ));
    return;
  }
  const routeToken = value.routeToken;
  const uuidPattern =
    /^H_EARTH_GATE_B_DIAGNOSTIC_ROUTE_TOKEN:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const exact = {
    executionClass: EXECUTION_CLASS,
    adapterOccurrenceId: `H_EARTH_GATE_B_ADAPTER_OCCURRENCE:${routeToken}`,
    aggregateFrameId: `H_EARTH_WEST_AGGREGATE_FRAME:${routeToken}`,
    packet002TransferOccurrenceId: `H_EARTH_GATE_B_PACKET_002_TRANSFER_OCCURRENCE:${routeToken}`,
    compositorFrameOccurrenceId: `H_EARTH_COMPOSITOR_FRAME_OCCURRENCE:${routeToken}`
  };
  if (!uuidPattern.test(routeToken) || Object.entries(exact).some(([key, expected]) => value[key] !== expected)) {
    issues.push(issue(
      'GATE_B_EXECUTION_IDENTITY_CORRELATION_INVALID',
      'executionIdentity does not satisfy the exact diagnostic route-token constructors.',
      'executionIdentity'
    ));
  }
  const derived = [
    value.adapterOccurrenceId,
    value.aggregateFrameId,
    value.packet002TransferOccurrenceId,
    value.compositorFrameOccurrenceId
  ];
  if (!derived.every(nonemptyExactString) || new Set(derived).size !== derived.length) {
    issues.push(issue(
      'GATE_B_EXECUTION_IDENTITY_DISTINCTNESS_INVALID',
      'Derived occurrence identities must be exact nonempty pairwise-distinct strings.',
      'executionIdentity'
    ));
  }
}

function validateProvenance(value, issues) {
  if (value !== H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY ||
      !Array.isArray(value) || value.length !== 3 || !isDeeplyFrozen(value)) {
    issues.push(issue(
      'GATE_B_PROVENANCE_LEDGER_IDENTITY_INVALID',
      'provenanceApplicability must be the exact exported deeply frozen three-record ledger.',
      'provenanceApplicability'
    ));
    return;
  }
  value.forEach((record, index) => {
    if (!exactKeys(record, PROVENANCE_KEYS) || record.primitiveId !== PRIMITIVE_ORDER[index] ||
        record.synthesisProhibited !== true || !isDeeplyFrozen(record)) {
      issues.push(issue(
        'GATE_B_PROVENANCE_RECORD_INVALID',
        'A provenance applicability record is absent, reordered, or structurally invalid.',
        `provenanceApplicability[${index}]`
      ));
    }
  });
}

function validateConstructionResult(value, issues) {
  if (!isPlainRecord(value) || !isDeeplyFrozen(value) || value.valid !== true ||
      value.constructionStatus !== 'CONSTRUCTED_NEUTRAL_PRIMITIVES_NOT_ADMITTED') {
    issues.push(issue(
      'GATE_B_PROVIDER_RESULT_INVALID',
      'gateBConstructionResult must be the completed deeply frozen neutral provider result.',
      'gateBConstructionResult'
    ));
    return;
  }
  const primitiveIds = Array.isArray(value.primitives)
    ? value.primitives.map((primitive) => primitive?.primitiveId)
    : [];
  if (!exactArray(primitiveIds, PRIMITIVE_ORDER) ||
      !value.primitives.every(isHEarthNeutralPrimitiveRecord)) {
    issues.push(issue(
      'GATE_B_PROVIDER_PRIMITIVE_MEMBERSHIP_INVALID',
      'Gate B provider primitives must preserve exact terrain-water-ribbon order and neutral validity.',
      'gateBConstructionResult.primitives'
    ));
  }
  if (!isPlainRecord(value.receipt) ||
      value.receipt.configurationIdentity?.geometryKernelContractId !==
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID ||
      !nonemptyExactString(value.receipt.occurrenceId) ||
      !nonemptyExactString(value.receipt.deterministicConstructionIdentity) ||
      value.receipt.analyticalPhysicalDistinction !==
        H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification ||
      value.receipt.physicalTrianglesEqualExactNonlinearAnalyticalSurface !==
        H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION
          .physicalTrianglesEqualExactNonlinearAnalyticalSurface) {
    issues.push(issue(
      'GATE_B_PROVIDER_RECEIPT_INVALID',
      'Gate B provider receipt identity or analytical/physical distinction is invalid.',
      'gateBConstructionResult.receipt'
    ));
  }
}

export function evaluateHEarthGroundViewGateBWestAdmissionAdapterInput(input) {
  const issues = [];
  if (!exactKeys(input, INPUT_KEYS)) {
    return Object.freeze({
      ok: false,
      status: REJECTED_STATUS,
      issues: freezeIssues([
        issue('GATE_B_ADAPTER_INPUT_SURFACE_INVALID', 'Adapter input must contain exactly four declared keys.')
      ])
    });
  }
  validateConstructionResult(input.gateBConstructionResult, issues);
  validateExecutionIdentity(input.executionIdentity, issues);
  validateProvenance(input.provenanceApplicability, issues);
  if (input.toleranceContext !== null &&
      !isHEarthGeometryToleranceContext(input.toleranceContext)) {
    issues.push(issue(
      'GATE_B_TOLERANCE_CONTEXT_INVALID',
      'toleranceContext must be null or satisfy the public geometry validator.',
      'toleranceContext'
    ));
  }
  return Object.freeze({
    ok: issues.length === 0,
    status: issues.length === 0
      ? 'H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_INPUT_ACCEPTED'
      : REJECTED_STATUS,
    input,
    issues: freezeIssues(issues)
  });
}

function buildFailure(inputEvaluation, westInvoked = false, westInvocationCount = 0, extraIssues = []) {
  const identity = inputEvaluation?.input?.executionIdentity;
  return deepFreeze({
    ok: false,
    status: REJECTED_STATUS,
    contractId: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
    schemaVersion: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SCHEMA_VERSION,
    sourceFile: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SOURCE_FILE,
    role: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_ROLE,
    executionClass: identity?.executionClass ?? null,
    routeToken: identity?.routeToken ?? null,
    adapterOccurrenceId: identity?.adapterOccurrenceId ?? null,
    aggregateFrameId: identity?.aggregateFrameId ?? null,
    westBatchAdmissionInvoked: westInvoked,
    westBatchAdmissionInvocationCount: westInvocationCount,
    admittedPrimitives: EMPTY_FROZEN_ARRAY,
    aggregateFrameAdmissionRecord: null,
    outputDeeplyFrozen: true,
    issues: freezeIssues([
      ...(inputEvaluation?.issues ?? EMPTY_FROZEN_ARRAY),
      ...extraIssues
    ])
  });
}

export function executeHEarthGroundViewGateBWestAdmissionAdapter(input) {
  const inputEvaluation = evaluateHEarthGroundViewGateBWestAdmissionAdapterInput(input);
  if (!inputEvaluation.ok) return buildFailure(inputEvaluation);

  const provider = input.gateBConstructionResult;
  const identity = input.executionIdentity;
  let westResult;
  try {
    westResult = admitHEarthPrimitiveBatch(
      provider.primitives,
      {
        frameId: identity.aggregateFrameId,
        toleranceContext: input.toleranceContext ?? undefined,
        metadata: {
          routeToken: identity.routeToken,
          adapterOccurrenceId: identity.adapterOccurrenceId,
          gateBProviderContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
          gateBConstructionOccurrenceId: provider.receipt.occurrenceId,
          deterministicConstructionIdentity: provider.receipt.deterministicConstructionIdentity,
          analyticalPhysicalDistinction:
            H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
          physicalTrianglesEqualExactNonlinearAnalyticalSurface:
            H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION
              .physicalTrianglesEqualExactNonlinearAnalyticalSurface,
          primitiveOrder: PRIMITIVE_ORDER,
          provenanceMode: 'GATE_B_PER_PRIMITIVE_APPLICABILITY',
          requestId: identity.routeToken,
          providerRequestId: provider.receipt.occurrenceId,
          resolutionReceiptId: provider.receipt.deterministicConstructionIdentity
        }
      }
    );
  } catch (error) {
    return buildFailure(inputEvaluation, true, 1, [
      issue('GATE_B_WEST_BATCH_ADMISSION_THROWN', 'Public West batch admission threw.', null, {
        name: error?.name ?? 'Error',
        message: error?.message ?? String(error)
      })
    ]);
  }

  if (!isPlainRecord(westResult) || westResult.valid !== true ||
      !isHEarthAggregateFrameAdmissionRecord(westResult.frame) ||
      !Array.isArray(westResult.primitiveAdmissions) ||
      westResult.primitiveAdmissions.length !== 3) {
    return buildFailure(inputEvaluation, true, 1, [
      issue('GATE_B_WEST_BATCH_ADMISSION_REJECTED', 'Public West batch admission did not return one lawful three-member frame.')
    ]);
  }

  const admittedPrimitives = Object.freeze(
    westResult.primitiveAdmissions.map((admission) => admission.primitive)
  );
  if (!admittedPrimitives.every((primitive) =>
      isHEarthAdmittedPrimitiveRecord(primitive) && primitive.aggregateFrameMember === false)) {
    return buildFailure(inputEvaluation, true, 1, [
      issue('GATE_B_WEST_STANDALONE_PRIMITIVES_INVALID', 'West standalone admitted primitives are invalid.')
    ]);
  }
  if (!isHEarthAABB3D(westResult.frame.bounds, input.toleranceContext ?? undefined)) {
    return buildFailure(inputEvaluation, true, 1, [
      issue('GATE_B_WEST_FRAME_BOUNDS_INVALID', 'West aggregate-frame bounds are invalid.')
    ]);
  }

  return deepFreeze({
    ok: true,
    status: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_STATUS,
    contractId: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
    schemaVersion: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SCHEMA_VERSION,
    sourceFile: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SOURCE_FILE,
    role: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_ROLE,
    executionClass: identity.executionClass,
    routeToken: identity.routeToken,
    adapterOccurrenceId: identity.adapterOccurrenceId,
    aggregateFrameId: identity.aggregateFrameId,
    gateBProviderContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
    gateBConstructionOccurrenceId: provider.receipt.occurrenceId,
    deterministicConstructionIdentity: provider.receipt.deterministicConstructionIdentity,
    analyticalPhysicalDistinction:
      H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
    physicalTrianglesEqualExactNonlinearAnalyticalSurface:
      H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION
        .physicalTrianglesEqualExactNonlinearAnalyticalSurface,
    primitiveOrder: PRIMITIVE_ORDER,
    neutralPrimitives: provider.primitives,
    provenanceApplicability: input.provenanceApplicability,
    admittedPrimitives,
    aggregateFrameAdmissionRecord: westResult.frame,
    bounds: westResult.frame.bounds,
    toleranceContext: input.toleranceContext,
    westContractId: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    westAggregateFrameStatus:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS?.aggregateFrameStatus?.ADMITTED ??
      westResult.frame.status,
    westBatchAdmissionInvocationCount: 1,
    exactWestReferencesPreserved: true,
    geometryIdentityPreserved: true,
    provenanceSynthesized: false,
    outputDeeplyFrozen: true,
    issues: EMPTY_FROZEN_ARRAY
  });
}

export function isHEarthGroundViewGateBWestAdmissionAdapterOccurrence(value) {
  try {
    if (!isPlainRecord(value) || !isDeeplyFrozen(value) || value.ok !== true ||
        value.status !== H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_STATUS ||
        value.contractId !== H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID ||
        value.schemaVersion !== H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SCHEMA_VERSION ||
        value.gateBProviderContractId !== H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID ||
        value.westContractId !== H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID ||
        value.provenanceApplicability !== H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY ||
        value.westBatchAdmissionInvocationCount !== 1 || value.provenanceSynthesized !== false ||
        value.exactWestReferencesPreserved !== true || value.geometryIdentityPreserved !== true ||
        value.outputDeeplyFrozen !== true || !Array.isArray(value.issues) || value.issues.length !== 0) {
      return false;
    }
    if (!exactArray(value.primitiveOrder, PRIMITIVE_ORDER) ||
        !exactArray(value.neutralPrimitives.map((primitive) => primitive.primitiveId), PRIMITIVE_ORDER) ||
        !exactArray(value.admittedPrimitives.map((primitive) => primitive.primitiveId), PRIMITIVE_ORDER)) {
      return false;
    }
    return value.neutralPrimitives.every(isHEarthNeutralPrimitiveRecord) &&
      value.admittedPrimitives.every((primitive) =>
        isHEarthAdmittedPrimitiveRecord(primitive) && primitive.aggregateFrameMember === false) &&
      isHEarthAggregateFrameAdmissionRecord(value.aggregateFrameAdmissionRecord) &&
      value.aggregateFrameAdmissionRecord.frameId === value.aggregateFrameId &&
      value.bounds === value.aggregateFrameAdmissionRecord.bounds &&
      value.admittedPrimitives.every((primitive, index) =>
        primitive === value.aggregateFrameAdmissionRecord.primitives[index]?.standalonePrimitiveReference ||
        primitive.primitiveId === value.aggregateFrameAdmissionRecord.primitives[index]?.primitiveId
      );
  } catch {
    return false;
  }
}

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_BOUNDARIES =
  deepFreeze({
    invokesPublicWestBatchAdmissionExactlyOnce: true,
    invokesProvider: false,
    reconstructsProvenance: false,
    mutatesProviderResult: false,
    mutatesNeutralPrimitives: false,
    createsGeometryIndexIdentity: false,
    createsCompositorIdentity: false,
    createsRendererIdentity: false,
    activatesRuntime: false,
    productionClaim: false,
    deploymentClaim: false
  });

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CLAIM_CEILINGS =
  deepFreeze({
    providerConstructionClaim: false,
    westAdmissionOrchestrationClaim: true,
    geometryIndexClaim: false,
    compositorClaim: false,
    rendererClaim: false,
    runtimeClaim: false,
    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    visualPassClaim: false
  });

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT =
  deepFreeze({
    contractId: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
    schemaVersion: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SCHEMA_VERSION,
    sourceFile: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_SOURCE_FILE,
    role: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_ROLE,
    gateBProviderContractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
    publicGeometryFacadeContractId: H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
    westContractId: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    primitiveIds: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS,
    primitiveOrder: PRIMITIVE_ORDER,
    provenanceApplicability: H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY,
    boundary: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_BOUNDARIES,
    claimCeilings: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CLAIM_CEILINGS
  });

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_RECEIPT =
  deepFreeze({
    receiptType: 'H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_STATIC_DEFINITION_RECEIPT',
    contractId: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
    exactInputSurfaceDefined: true,
    exactExecutionIdentityCorrelationDefined: true,
    exactProviderPrimitiveOrderDefined: true,
    exactProvenanceLedgerDefined: true,
    singleWestBatchInvocationDefined: true,
    publicWestReferencePreservationDefined: true,
    moduleSyntaxVerified: false,
    importResolutionVerified: false,
    isolatedBehaviorVerified: false,
    packageCorrespondenceVerified: false,
    boundary: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_BOUNDARIES,
    claimCeilings: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CLAIM_CEILINGS
  });

export function getHEarthGroundViewGateBWestAdmissionAdapterContract() {
  return H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT;
}

export function getHEarthGroundViewGateBWestAdmissionAdapterReceipt() {
  return H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_RECEIPT;
}

export const H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_AGGREGATE =
  deepFreeze({
    contractId: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
    contract: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT,
    receipt: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_RECEIPT,
    boundary: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_BOUNDARIES,
    claimCeilings: H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CLAIM_CEILINGS,
    primitiveIds: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS,
    provenanceApplicability: H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY,
    evaluateHEarthGroundViewGateBWestAdmissionAdapterInput,
    executeHEarthGroundViewGateBWestAdmissionAdapter,
    isHEarthGroundViewGateBWestAdmissionAdapterOccurrence,
    getHEarthGroundViewGateBWestAdmissionAdapterContract,
    getHEarthGroundViewGateBWestAdmissionAdapterReceipt
  });

export default H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_AGGREGATE;
