/**
 * /h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js
 * COMPLETE NEW FILE CANDIDATE
 *
 * H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1
 *
 * Packet:
 * API_SURFACE_PACKET_002
 * PROVISIONAL_POST_WEST_ADMITTED_GEOMETRY_TRANSFER
 *
 * Purpose:
 * Preserve one lawful legacy or Gate B post-West admitted-geometry occurrence
 * as a provisional, fail-closed shared transfer envelope without inventing
 * geometry-index, compositor, or renderer authority.
 *
 * Corridor:
 * Packet 001 source resolution
 * -> environment numeric profile
 * -> preview translation
 * -> South neutral geometry construction
 * -> West primitive admission
 * -> West aggregate-frame admission
 * -> shared Packet 002 provisional admitted-geometry transfer
 *
 * Additive Gate B corridor:
 * Gate B provider -> Gate B West-admission adapter -> shared Packet 002
 *
 * This file owns:
 * - post-West transfer input validation
 * - preview-result provenance validation
 * - West batch-occurrence authentication through the public geometry-kernel facade
 * - primitive-membership correspondence checks
 * - provenance correspondence checks
 * - fail-closed provisional transfer-envelope construction
 * - bounded immutable snapshot construction
 * - downstream non-claim preservation
 *
 * This file does not own:
 * - Packet 001 semantic resolution authority
 * - environment numeric-profile authority
 * - preview/provider translation authority
 * - South neutral geometry construction
 * - West primitive admission authority
 * - West aggregate-frame admission authority
 * - geometry-index authority
 * - compositor authority
 * - renderer authority
 * - render-instance authority
 * - runtime activation
 * - persistence
 * - validation
 * - production
 * - deployment
 * - matrix collapse
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_WEST_ENUMS,
  isHEarthAdmittedGeometryRecord,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D,
  isHEarthGeometryToleranceContext
} from '../../showroom/globe/h-earth/render/geometry-kernel.js';

import {
  H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS,
  H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY,
  isHEarthGroundViewGateBWestAdmissionAdapterOccurrence
} from './h-earth.ground-view-gate-b-west-admission-adapter.js';

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID =
  'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1';

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_SCHEMA_VERSION = 2;

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES =
  Object.freeze({
    LEGACY_PREVIEW_WEST_BATCH:
      'LEGACY_PREVIEW_WEST_BATCH',
    GATE_B_ADAPTER_OCCURRENCE:
      'GATE_B_ADAPTER_OCCURRENCE'
  });

const SOURCE_FILE =
  '/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js';

const EXPECTED_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1';

const EXPECTED_SHORELINE_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

const ACCEPTED_PREVIEW_CONTRACT_IDS =
  Object.freeze([
    EXPECTED_PREVIEW_CONTRACT_ID,
    EXPECTED_SHORELINE_PREVIEW_CONTRACT_ID
  ]);

const SUCCESS_STATUS =
  'WEST_ADMISSION_COMPLETE_INDEX_NOT_YET_DEFINED';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

const CONSUMED_WEST_ENUM_VALUES = Object.freeze({
  aggregateFrameAdmittedStatus:
    H_EARTH_3D_GEOMETRY_WEST_ENUMS
      .aggregateFrameStatus
      .ADMITTED
});

const GATE_B_PRIMITIVE_ORDER = Object.freeze([
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.terrain,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.water,
  H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.diagnosticRibbon
]);

const GATE_B_PROVENANCE_MODE =
  'GATE_B_PER_PRIMITIVE_APPLICABILITY';

const GATE_B_PROVENANCE_COMPLETENESS =
  'EXPLICIT_SEMANTIC_CORRESPONDENCE_ONLY_NO_SYNTHESIS';

const ALL_TRANSFER_INPUT_KEYS = Object.freeze([
  'previewResult',
  'westBatchAdmissionResult',
  'gateBAdapterOccurrence',
  'toleranceContext'
]);

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

function canonicalUniqueStrings(values) {
  return Object.freeze(
    Array.from(
      new Set(
        (Array.isArray(values) ? values : [])
          .filter(isNonEmptyString)
          .map((value) => value.trim())
      )
    ).sort()
  );
}

function arraysEqual(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function exactOrderedArray(value, expected) {
  return (
    Array.isArray(value) &&
    Array.isArray(expected) &&
    value.length === expected.length &&
    value.every((entry, index) => entry === expected[index])
  );
}

function isDeeplyFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') {
    return true;
  }

  if (seen.has(value)) {
    return true;
  }

  if (!Object.isFrozen(value)) {
    return false;
  }

  seen.add(value);

  return Reflect.ownKeys(value).every((key) =>
    isDeeplyFrozen(value[key], seen)
  );
}

function structurallyEqual(left, right, seen = new WeakMap()) {
  if (Object.is(left, right)) {
    return true;
  }

  if (
    left === null ||
    right === null ||
    typeof left !== 'object' ||
    typeof right !== 'object' ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    return false;
  }

  if (seen.get(left) === right) {
    return true;
  }

  seen.set(left, right);

  const leftKeys = Reflect.ownKeys(left);
  const rightKeys = Reflect.ownKeys(right);

  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key, index) =>
      key === rightKeys[index] &&
      structurallyEqual(left[key], right[key], seen)
    )
  );
}

function isNonEmptyCanonicalSubset(candidate, aggregate) {
  return (
    Array.isArray(candidate) &&
    candidate.length > 0 &&
    arraysEqual(
      candidate,
      canonicalUniqueStrings(candidate)
    ) &&
    Array.isArray(aggregate) &&
    candidate.every(
      (value) => aggregate.includes(value)
    )
  );
}

function freezeIssues(issues) {
  return Object.freeze(
    issues.map((issue) =>
      Object.freeze({
        code: issue.code,
        message: issue.message,
        field: issue.field ?? null,
        expected: issue.expected ?? null,
        actual: issue.actual ?? null,
        details: issue.details ?? null
      })
    )
  );
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue, seen);
  }

  return Object.freeze(value);
}

function rejectableStructuredClone(
  value,
  path = 'root',
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return {
      ok: true,
      value
    };
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return {
        ok: false,
        error: {
          code: 'NON_FINITE_NUMBER_REJECTED',
          message:
            'Non-finite numbers are not admitted in Packet 002 snapshots.',
          details: path
        }
      };
    }

    return {
      ok: true,
      value
    };
  }

  if (
    typeof value === 'undefined' ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  ) {
    return {
      ok: false,
      error: {
        code: 'UNSUPPORTED_VALUE_TYPE',
        message:
          'Unsupported value type encountered during Packet 002 snapshot.',
        details: path
      }
    };
  }

  if (seen.has(value)) {
    return {
      ok: false,
      error: {
        code: 'REPEATED_REFERENCE_OR_CYCLE_REJECTED',
        message:
          'Repeated object references or cycles are not admitted in Packet 002 snapshots.',
        details: path
      }
    };
  }

  if (Array.isArray(value)) {
    const ownKeys = Reflect.ownKeys(value);

    for (const key of ownKeys) {
      if (typeof key !== 'string') {
        return {
          ok: false,
          error: {
            code: 'SYMBOL_PROPERTY_REJECTED',
            message:
              'Symbol-keyed properties are not admitted in Packet 002 snapshots.',
            details: path
          }
        };
      }

      if (key === 'length') {
        continue;
      }

      if (!/^(0|[1-9]\d*)$/.test(key)) {
        return {
          ok: false,
          error: {
            code: 'ARRAY_CUSTOM_PROPERTY_REJECTED',
            message:
              'Array custom properties are not admitted in Packet 002 snapshots.',
            details: `${path}.${key}`
          }
        };
      }

      const descriptor =
        Object.getOwnPropertyDescriptor(value, key);

      if (!descriptor?.enumerable) {
        return {
          ok: false,
          error: {
            code: 'NON_ENUMERABLE_PROPERTY_REJECTED',
            message:
              'Non-enumerable properties are not admitted in Packet 002 snapshots.',
            details: `${path}.${key}`
          }
        };
      }

      if (
        typeof descriptor.get === 'function' ||
        typeof descriptor.set === 'function'
      ) {
        return {
          ok: false,
          error: {
            code: 'ACCESSOR_PROPERTY_REJECTED',
            message:
              'Accessor properties are not admitted in Packet 002 snapshots.',
            details: `${path}.${key}`
          }
        };
      }
    }

    seen.add(value);

    const clone = [];

    for (let index = 0; index < value.length; index += 1) {
      const nested =
        rejectableStructuredClone(
          value[index],
          `${path}[${index}]`,
          seen
        );

      if (!nested.ok) {
        return nested;
      }

      clone.push(nested.value);
    }

    return {
      ok: true,
      value: clone
    };
  }

  if (!isPlainRecord(value)) {
    return {
      ok: false,
      error: {
        code: 'NON_PLAIN_RECORD_REJECTED',
        message:
          'Only plain-record objects are admitted in Packet 002 snapshots.',
        details: path
      }
    };
  }

  const ownKeys = Reflect.ownKeys(value);

  for (const key of ownKeys) {
    if (typeof key !== 'string') {
      return {
        ok: false,
        error: {
          code: 'SYMBOL_PROPERTY_REJECTED',
          message:
            'Symbol-keyed properties are not admitted in Packet 002 snapshots.',
          details: path
        }
      };
    }

    const descriptor =
      Object.getOwnPropertyDescriptor(value, key);

    if (!descriptor?.enumerable) {
      return {
        ok: false,
        error: {
          code: 'NON_ENUMERABLE_PROPERTY_REJECTED',
          message:
            'Non-enumerable properties are not admitted in Packet 002 snapshots.',
          details: `${path}.${key}`
        }
      };
    }

    if (
      typeof descriptor.get === 'function' ||
      typeof descriptor.set === 'function'
    ) {
      return {
        ok: false,
        error: {
          code: 'ACCESSOR_PROPERTY_REJECTED',
          message:
            'Accessor properties are not admitted in Packet 002 snapshots.',
          details: `${path}.${key}`
        }
      };
    }
  }

  seen.add(value);

  const clone = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    const nested =
      rejectableStructuredClone(
        nestedValue,
        `${path}.${key}`,
        seen
      );

    if (!nested.ok) {
      return nested;
    }

    clone[key] = nested.value;
  }

  return {
    ok: true,
    value: clone
  };
}

function snapshotForTransfer(value, path) {
  const snapshot =
    rejectableStructuredClone(value, path);

  if (!snapshot.ok) {
    return snapshot;
  }

  return {
    ok: true,
    value: deepFreeze(snapshot.value)
  };
}

function extractPrimitiveIdentity(primitive) {
  if (!isPlainRecord(primitive)) {
    return null;
  }

  return isNonEmptyString(primitive.primitiveId)
    ? primitive.primitiveId.trim()
    : null;
}

function evaluatePrimitiveIdentities(primitives) {
  if (!Array.isArray(primitives) || primitives.length === 0) {
    return Object.freeze({
      ok: false,
      identities: EMPTY_FROZEN_ARRAY,
      missingIdentityCount: 0,
      duplicateIdentities: EMPTY_FROZEN_ARRAY,
      issueCode:
        'PRIMITIVE_MEMBERSHIP_MISSING'
    });
  }

  const rawIdentities =
    primitives.map(extractPrimitiveIdentity);

  const missingIdentityCount =
    rawIdentities.filter(
      (identity) => !isNonEmptyString(identity)
    ).length;

  const normalized =
    rawIdentities
      .filter(isNonEmptyString)
      .map((identity) => identity.trim())
      .sort();

  const duplicateIdentities =
    normalized.filter(
      (identity, index, values) =>
        values.indexOf(identity) !== index
    );

  return Object.freeze({
    ok:
      missingIdentityCount === 0 &&
      duplicateIdentities.length === 0,
    identities: Object.freeze(normalized),
    missingIdentityCount,
    duplicateIdentities:
      Object.freeze(
        Array.from(new Set(duplicateIdentities))
      ),
    issueCode:
      missingIdentityCount > 0
        ? 'PRIMITIVE_IDENTITY_MISSING'
        : duplicateIdentities.length > 0
          ? 'PRIMITIVE_IDENTITY_DUPLICATED'
          : null
  });
}

function validateToleranceContext(value) {
  if (value === undefined || value === null) {
    return Object.freeze({
      ok: true,
      normalizedValue: null,
      issues: EMPTY_FROZEN_ARRAY
    });
  }

  if (!isHEarthGeometryToleranceContext(value)) {
    return Object.freeze({
      ok: false,
      normalizedValue: null,
      issues: freezeIssues([
        {
          code: 'TOLERANCE_CONTEXT_NOT_LAWFUL',
          message:
            'toleranceContext must satisfy the public geometry-kernel tolerance-context validator.',
          field: 'toleranceContext'
        }
      ])
    });
  }

  return Object.freeze({
    ok: true,
    normalizedValue: value,
    issues: EMPTY_FROZEN_ARRAY
  });
}

function derivePreviewSourceObjectIds(previewResult) {
  if (
    Array.isArray(previewResult?.sourceObjectIds) &&
    previewResult.sourceObjectIds.every(isNonEmptyString)
  ) {
    return canonicalUniqueStrings(
      previewResult.sourceObjectIds
    );
  }

  if (isNonEmptyString(previewResult?.sourceObjectId)) {
    return Object.freeze([
      previewResult.sourceObjectId.trim()
    ]);
  }

  return EMPTY_FROZEN_ARRAY;
}

function derivePreviewSourceZoneIds(previewResult) {
  return canonicalUniqueStrings(
    previewResult?.sourceZoneIds
  );
}

function derivePreviewLatticeRegionIds(previewResult) {
  return canonicalUniqueStrings(
    previewResult?.latticeRegionIds
  );
}

function validatePreviewResult(previewResult) {
  const issues = [];

  if (!isPlainRecord(previewResult)) {
    issues.push({
      code: 'PREVIEW_RESULT_MISSING',
      message:
        'previewResult must be a plain-record object.',
      field: 'previewResult'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      requestId: null,
      providerRequestId: null,
      resolutionReceiptId: null,
      sourceObjectIds: EMPTY_FROZEN_ARRAY,
      sourceZoneIds: EMPTY_FROZEN_ARRAY,
      latticeRegionIds: EMPTY_FROZEN_ARRAY
    });
  }

  const sourceObjectIds =
    derivePreviewSourceObjectIds(previewResult);

  const sourceZoneIds =
    derivePreviewSourceZoneIds(previewResult);

  const latticeRegionIds =
    derivePreviewLatticeRegionIds(previewResult);

  if (previewResult.ok !== true) {
    issues.push({
      code: 'PREVIEW_RESULT_NOT_LAWFUL',
      message:
        'previewResult must be lawful before Packet 002 transfer.',
      actual:
        previewResult.status ?? null
    });
  }

  if (
    !ACCEPTED_PREVIEW_CONTRACT_IDS.includes(
      previewResult.contractId
    )
  ) {
    issues.push({
      code: 'PREVIEW_RESULT_CONTRACT_ID_MISMATCH',
      message:
        'previewResult contractId does not match an admitted preview occurrence.',
      expected:
        ACCEPTED_PREVIEW_CONTRACT_IDS,
      actual:
        previewResult.contractId ?? null
    });
  }

  if (!isNonEmptyString(previewResult.requestId)) {
    issues.push({
      code: 'REQUEST_ID_MISSING',
      message:
        'previewResult.requestId is required.',
      field: 'requestId'
    });
  }

  if (!isNonEmptyString(previewResult.providerRequestId)) {
    issues.push({
      code: 'PROVIDER_REQUEST_ID_MISSING',
      message:
        'previewResult.providerRequestId is required.',
      field: 'providerRequestId'
    });
  }

  if (!isNonEmptyString(previewResult.resolutionReceiptId)) {
    issues.push({
      code: 'RESOLUTION_RECEIPT_ID_MISSING',
      message:
        'previewResult.resolutionReceiptId is required.',
      field: 'resolutionReceiptId'
    });
  }

  if (sourceObjectIds.length === 0) {
    issues.push({
      code: 'SOURCE_OBJECT_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more sourceObjectIds.'
    });
  }

  if (sourceZoneIds.length === 0) {
    issues.push({
      code: 'SOURCE_ZONE_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more sourceZoneIds.'
    });
  }

  if (latticeRegionIds.length === 0) {
    issues.push({
      code: 'LATTICE_REGION_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more latticeRegionIds.'
    });
  }

  if (previewResult.admitted === true) {
    issues.push({
      code: 'PREVIEW_RESULT_ALREADY_ADMITTED',
      message:
        'previewResult must remain unadmitted at the preview boundary.'
    });
  }

  if (
    previewResult.geometryIndexEntryId !== undefined &&
    previewResult.geometryIndexEntryId !== null
  ) {
    issues.push({
      code: 'PREMATURE_GEOMETRY_INDEX_IDENTITY',
      message:
        'previewResult must not carry a geometryIndexEntryId.'
    });
  }

  if (
    previewResult.compositorNodeId !== undefined &&
    previewResult.compositorNodeId !== null
  ) {
    issues.push({
      code: 'PREMATURE_COMPOSITOR_IDENTITY',
      message:
        'previewResult must not carry a compositorNodeId.'
    });
  }

  if (
    previewResult.renderInstanceId !== undefined &&
    previewResult.renderInstanceId !== null
  ) {
    issues.push({
      code: 'PREMATURE_RENDER_INSTANCE_IDENTITY',
      message:
        'previewResult must not carry a renderInstanceId.'
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    requestId:
      isNonEmptyString(previewResult.requestId)
        ? previewResult.requestId.trim()
        : null,
    providerRequestId:
      isNonEmptyString(previewResult.providerRequestId)
        ? previewResult.providerRequestId.trim()
        : null,
    resolutionReceiptId:
      isNonEmptyString(previewResult.resolutionReceiptId)
        ? previewResult.resolutionReceiptId.trim()
        : null,
    sourceObjectIds,
    sourceZoneIds,
    latticeRegionIds
  });
}

function derivePrimitiveMetadata(admittedPrimitive) {
  return isPlainRecord(admittedPrimitive?.metadata)
    ? admittedPrimitive.metadata
    : null;
}

function deriveFrameMetadata(frame) {
  return isPlainRecord(frame?.metadata)
    ? frame.metadata
    : null;
}

function validateWestPrimitiveAdmission(
  primitiveAdmission,
  previewValidation
) {
  const issues = [];

  if (!isPlainRecord(primitiveAdmission)) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_RESULT_MISSING',
      message:
        'Every West primitive admission must be a plain-record object.'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      admittedPrimitive: null,
      admittedGeometry: null,
      sourceObjectIds: EMPTY_FROZEN_ARRAY,
      sourceZoneIds: EMPTY_FROZEN_ARRAY,
      latticeRegionIds: EMPTY_FROZEN_ARRAY
    });
  }

  const admittedPrimitive =
    primitiveAdmission.primitive;

  const admittedGeometry =
    primitiveAdmission.geometry;

  const primitiveOccurrenceLawful =
    primitiveAdmission.valid === true &&
    isHEarthAdmittedPrimitiveRecord(admittedPrimitive) &&
    isHEarthAdmittedGeometryRecord(admittedGeometry) &&
    admittedPrimitive.geometry === admittedGeometry &&
    admittedPrimitive.admissionId ===
      primitiveAdmission.admissionId &&
    admittedPrimitive.primitiveId ===
      admittedGeometry.sourceNeutralPrimitiveId &&
    admittedPrimitive.admissionAuthority === 'WEST' &&
    admittedPrimitive.admitted === true &&
    admittedPrimitive.aggregateFrameMember === false &&
    admittedPrimitive.recordType ===
      'H_EARTH_WEST_ADMITTED_PRIMITIVE_RECORD' &&
    admittedGeometry.recordType ===
      'H_EARTH_WEST_ADMITTED_GEOMETRY_RECORD' &&
    admittedGeometry.admitted === true &&
    admittedGeometry.admissionAuthority === 'WEST' &&
    admittedGeometry.geometryIndexExported === false &&
    admittedGeometry.compositorIntegrated === false &&
    admittedGeometry.rendererMaterialized === false;

  if (!primitiveOccurrenceLawful) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_REJECTED',
      message:
        'A West primitive admission occurrence is not lawful under the public geometry-kernel facade.'
    });
  }

  const metadata =
    derivePrimitiveMetadata(admittedPrimitive);

  const sourceObjectIds =
    canonicalUniqueStrings(
      metadata?.sourceObjectIds ?? [
        metadata?.sourceObjectId
      ]
    );

  const sourceZoneIds =
    canonicalUniqueStrings(
      metadata?.sourceZoneIds ?? [
        metadata?.zoneId
      ]
    );

  const latticeRegionIds =
    canonicalUniqueStrings(
      metadata?.latticeRegionIds
    );

  if (sourceObjectIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_OBJECT_PROVENANCE_MISSING',
      message:
        'West admitted primitive metadata must preserve one or more sourceObjectIds.'
    });
  } else if (
    !isNonEmptyCanonicalSubset(
      sourceObjectIds,
      previewValidation.sourceObjectIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive sourceObjectIds must be a non-empty canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.sourceObjectIds,
      actual:
        sourceObjectIds
    });
  }

  if (sourceZoneIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_ZONE_PROVENANCE_MISSING',
      message:
        'West admitted primitive metadata must preserve one or more sourceZoneIds.'
    });
  } else if (
    !isNonEmptyCanonicalSubset(
      sourceZoneIds,
      previewValidation.sourceZoneIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive sourceZoneIds must be a non-empty canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.sourceZoneIds,
      actual:
        sourceZoneIds
    });
  }

  if (
    latticeRegionIds.length > 0 &&
    !isNonEmptyCanonicalSubset(
      latticeRegionIds,
      previewValidation.latticeRegionIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive latticeRegionIds must be a canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.latticeRegionIds,
      actual:
        latticeRegionIds
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    admittedPrimitive,
    admittedGeometry,
    sourceObjectIds,
    sourceZoneIds,
    latticeRegionIds
  });
}

function validateWestBatchAdmissionResult({
  westBatchAdmissionResult,
  previewValidation,
  toleranceContext
}) {
  const issues = [];

  if (!isPlainRecord(westBatchAdmissionResult)) {
    issues.push({
      code: 'WEST_BATCH_ADMISSION_RESULT_MISSING',
      message:
        'westBatchAdmissionResult must be a plain-record object.',
      field: 'westBatchAdmissionResult'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      primitiveAdmissions: EMPTY_FROZEN_ARRAY,
      admittedPrimitives: EMPTY_FROZEN_ARRAY,
      frame: null,
      frameId: null,
      bounds: null,
      primitiveIdentityEvaluation:
        evaluatePrimitiveIdentities(null)
    });
  }

  if (
    westBatchAdmissionResult.contractId !== undefined &&
    westBatchAdmissionResult.contractId !==
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
  ) {
    issues.push({
      code: 'WEST_CONTRACT_ID_MISMATCH',
      message:
        'westBatchAdmissionResult contractId does not match the controlling West contract when present.',
      expected:
        H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
      actual:
        westBatchAdmissionResult.contractId ?? null
    });
  }

  if (westBatchAdmissionResult.valid !== true) {
    issues.push({
      code: 'WEST_BATCH_ADMISSION_REJECTED',
      message:
        'westBatchAdmissionResult must be lawful before Packet 002 transfer.'
    });
  }

  const primitiveAdmissions =
    Array.isArray(
      westBatchAdmissionResult.primitiveAdmissions
    )
      ? westBatchAdmissionResult.primitiveAdmissions
      : null;

  if (
    !Array.isArray(primitiveAdmissions) ||
    primitiveAdmissions.length === 0
  ) {
    issues.push({
      code: 'PRIMITIVE_MEMBERSHIP_MISSING',
      message:
        'westBatchAdmissionResult must preserve a non-empty primitiveAdmissions array.'
    });
  }

  const validatedPrimitiveAdmissions =
    Array.isArray(primitiveAdmissions)
      ? primitiveAdmissions.map((primitiveAdmission) =>
          validateWestPrimitiveAdmission(
            primitiveAdmission,
            previewValidation
          )
        )
      : EMPTY_FROZEN_ARRAY;

  for (const validatedPrimitive of validatedPrimitiveAdmissions) {
    issues.push(...validatedPrimitive.issues);
  }

  const admittedPrimitives =
    Object.freeze(
      validatedPrimitiveAdmissions
        .filter(
          (validatedPrimitive) =>
            validatedPrimitive.ok
        )
        .map(
          (validatedPrimitive) =>
            validatedPrimitive.admittedPrimitive
        )
    );

  const primitiveIdentityEvaluation =
    evaluatePrimitiveIdentities(admittedPrimitives);

  if (!primitiveIdentityEvaluation.ok) {
    issues.push({
      code:
        primitiveIdentityEvaluation.issueCode ??
        'PRIMITIVE_IDENTITY_INVALID',
      message:
        'West admitted primitives must each expose one unique lawful primitiveId.',
      details: Object.freeze({
        missingIdentityCount:
          primitiveIdentityEvaluation.missingIdentityCount,
        duplicateIdentities:
          primitiveIdentityEvaluation.duplicateIdentities
      })
    });
  }

  const frame =
    westBatchAdmissionResult.frame;

  const aggregateOccurrenceLawful =
    westBatchAdmissionResult.valid === true &&
    isHEarthAggregateFrameAdmissionRecord(frame) &&
    frame.status ===
      CONSUMED_WEST_ENUM_VALUES
        .aggregateFrameAdmittedStatus &&
    frame.recordType ===
      'H_EARTH_WEST_ADMITTED_AGGREGATE_FRAME_RECORD' &&
    frame.admitted === true &&
    frame.admissionAuthority === 'WEST';

  if (!aggregateOccurrenceLawful) {
    issues.push({
      code: 'AGGREGATE_FRAME_ADMISSION_REJECTED',
      message:
        'westBatchAdmissionResult.frame is not a lawful West aggregate-frame admission occurrence.'
    });
  }

  const frameId =
    isNonEmptyString(frame?.frameId)
      ? frame.frameId.trim()
      : null;

  if (!frameId) {
    issues.push({
      code: 'FRAME_ID_MISSING',
      message:
        'West aggregate-frame admission must preserve frameId.'
    });
  }

  const bounds =
    frame?.bounds ?? null;

  const boundsLawful =
    toleranceContext !== null
      ? isHEarthAABB3D(bounds, toleranceContext)
      : isHEarthAABB3D(bounds);

  if (!boundsLawful) {
    issues.push({
      code: 'BOUNDS_INVALID',
      message:
        'West aggregate-frame bounds must satisfy the public AABB validator.'
    });
  }

  if (
    !Array.isArray(frame?.primitives) ||
    frame.primitives.length === 0
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PRIMITIVE_MEMBERSHIP_MISSING',
      message:
        'West aggregate-frame admission must preserve a non-empty frame.primitives array.'
    });
  }

  if (
    Array.isArray(frame?.primitives) &&
    frame.primitives.some(
      (primitive) =>
        !isHEarthAdmittedPrimitiveRecord({
          ...primitive,
          aggregateFrameMember: false
        }) ||
        primitive.aggregateFrameMember !== true
    )
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PRIMITIVE_MEMBERSHIP_MISMATCH',
      message:
        'Every aggregate-frame primitive must be a lawful admitted primitive record with aggregateFrameMember === true.'
    });
  }

  const framePrimitiveIdentityEvaluation =
    evaluatePrimitiveIdentities(frame?.primitives);

  if (!framePrimitiveIdentityEvaluation.ok) {
    issues.push({
      code:
        framePrimitiveIdentityEvaluation.issueCode ??
        'AGGREGATE_FRAME_PRIMITIVE_IDENTITY_INVALID',
      message:
        'West aggregate-frame primitives must each expose one unique lawful primitiveId.',
      details: Object.freeze({
        missingIdentityCount:
          framePrimitiveIdentityEvaluation.missingIdentityCount,
        duplicateIdentities:
          framePrimitiveIdentityEvaluation.duplicateIdentities
      })
    });
  } else if (
    !arraysEqual(
      framePrimitiveIdentityEvaluation.identities,
      primitiveIdentityEvaluation.identities
    )
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PRIMITIVE_MEMBERSHIP_MISMATCH',
      message:
        'West aggregate-frame primitive membership does not match the standalone primitive-admission membership.',
      expected:
        primitiveIdentityEvaluation.identities,
      actual:
        framePrimitiveIdentityEvaluation.identities
    });
  }

  if (
    Array.isArray(frame?.primitiveIds) &&
    !arraysEqual(
      canonicalUniqueStrings(frame.primitiveIds),
      primitiveIdentityEvaluation.identities
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_COUNT_MISMATCH',
      message:
        'West aggregate-frame primitiveIds do not match admitted primitive membership.',
      expected:
        primitiveIdentityEvaluation.identities,
      actual:
        canonicalUniqueStrings(frame.primitiveIds)
    });
  }

  if (
    Number.isSafeInteger(frame?.primitiveCount) &&
    Array.isArray(frame?.primitives) &&
    frame.primitiveCount !== frame.primitives.length
  ) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_COUNT_MISMATCH',
      message:
        'West aggregate-frame primitiveCount does not match frame.primitives length.',
      expected:
        frame.primitives.length,
      actual:
        frame.primitiveCount
    });
  }

  const frameMetadata =
    deriveFrameMetadata(frame);

  const frameRequestId =
    isNonEmptyString(frameMetadata?.requestId)
      ? frameMetadata.requestId.trim()
      : null;

  const frameProviderRequestId =
    isNonEmptyString(frameMetadata?.providerRequestId)
      ? frameMetadata.providerRequestId.trim()
      : null;

  const frameResolutionReceiptId =
    isNonEmptyString(frameMetadata?.resolutionReceiptId)
      ? frameMetadata.resolutionReceiptId.trim()
      : null;

  const frameSourceObjectIds =
    canonicalUniqueStrings(frameMetadata?.sourceObjectIds);

  const frameSourceZoneIds =
    canonicalUniqueStrings(frameMetadata?.sourceZoneIds);

  const frameLatticeRegionIds =
    canonicalUniqueStrings(frameMetadata?.latticeRegionIds);

  if (frameRequestId !== previewValidation.requestId) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata requestId does not match preview provenance.',
      expected:
        previewValidation.requestId,
      actual:
        frameRequestId
    });
  }

  if (
    frameProviderRequestId !==
    previewValidation.providerRequestId
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata providerRequestId does not match preview provenance.',
      expected:
        previewValidation.providerRequestId,
      actual:
        frameProviderRequestId
    });
  }

  if (
    frameResolutionReceiptId !==
    previewValidation.resolutionReceiptId
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata resolutionReceiptId does not match preview provenance.',
      expected:
        previewValidation.resolutionReceiptId,
      actual:
        frameResolutionReceiptId
    });
  }

  if (frameSourceObjectIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_OBJECT_PROVENANCE_MISSING',
      message:
        'West aggregate-frame metadata must preserve sourceObjectIds.'
    });
  } else if (
    !arraysEqual(
      frameSourceObjectIds,
      previewValidation.sourceObjectIds
    )
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata sourceObjectIds do not match preview provenance.',
      expected:
        previewValidation.sourceObjectIds,
      actual:
        frameSourceObjectIds
    });
  }

  if (frameSourceZoneIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_ZONE_PROVENANCE_MISSING',
      message:
        'West aggregate-frame metadata must preserve sourceZoneIds.'
    });
  } else if (
    !arraysEqual(
      frameSourceZoneIds,
      previewValidation.sourceZoneIds
    )
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata sourceZoneIds do not match preview provenance.',
      expected:
        previewValidation.sourceZoneIds,
      actual:
        frameSourceZoneIds
    });
  }

  if (frameLatticeRegionIds.length === 0) {
    issues.push({
      code: 'WEST_LATTICE_REGION_PROVENANCE_MISSING',
      message:
        'West aggregate-frame metadata must preserve latticeRegionIds.'
    });
  } else if (
    !arraysEqual(
      frameLatticeRegionIds,
      previewValidation.latticeRegionIds
    )
  ) {
    issues.push({
      code: 'AGGREGATE_FRAME_PROVENANCE_MISMATCH',
      message:
        'West aggregate-frame metadata latticeRegionIds do not match preview provenance.',
      expected:
        previewValidation.latticeRegionIds,
      actual:
        frameLatticeRegionIds
    });
  }

  if (
    frame?.geometryIndexEntryId !== undefined &&
    frame.geometryIndexEntryId !== null
  ) {
    issues.push({
      code: 'PREMATURE_GEOMETRY_INDEX_IDENTITY',
      message:
        'West aggregate-frame result must not introduce geometryIndexEntryId.'
    });
  }

  if (
    frame?.compositorNodeId !== undefined &&
    frame.compositorNodeId !== null
  ) {
    issues.push({
      code: 'PREMATURE_COMPOSITOR_IDENTITY',
      message:
        'West aggregate-frame result must not introduce compositorNodeId.'
    });
  }

  if (
    frame?.renderInstanceId !== undefined &&
    frame.renderInstanceId !== null
  ) {
    issues.push({
      code: 'PREMATURE_RENDER_INSTANCE_IDENTITY',
      message:
        'West aggregate-frame result must not introduce renderInstanceId.'
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    primitiveAdmissions:
      Array.isArray(primitiveAdmissions)
        ? primitiveAdmissions
        : EMPTY_FROZEN_ARRAY,
    admittedPrimitives,
    frame,
    frameId,
    bounds,
    primitiveIdentityEvaluation
  });
}

function detectTransferMode(input) {
  const hasGateB =
    hasOwn(input, 'gateBAdapterOccurrence');

  const hasLegacy =
    hasOwn(input, 'previewResult') ||
    hasOwn(input, 'westBatchAdmissionResult');

  if (hasGateB && hasLegacy) {
    return Object.freeze({
      ok: false,
      transferMode: null,
      issues: freezeIssues([
        {
          code: 'MIXED_TRANSFER_MODES_REJECTED',
          message:
            'Packet 002 rejects mixed legacy and Gate B input surfaces.'
        }
      ])
    });
  }

  return Object.freeze({
    ok: true,
    transferMode:
      hasGateB
        ? H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
            .GATE_B_ADAPTER_OCCURRENCE
        : H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
            .LEGACY_PREVIEW_WEST_BATCH,
    issues: EMPTY_FROZEN_ARRAY
  });
}

function deriveGateBExplicitSourceObjectIds(
  provenanceApplicability
) {
  return canonicalUniqueStrings(
    provenanceApplicability.flatMap((record) =>
      Array.isArray(record?.semanticObjectCorrespondenceIds)
        ? record.semanticObjectCorrespondenceIds
        : []
    )
  );
}

function deriveGateBExplicitSourceZoneIds(
  provenanceApplicability
) {
  return canonicalUniqueStrings(
    provenanceApplicability.flatMap((record) =>
      Array.isArray(record?.semanticZoneCorrespondenceIds)
        ? record.semanticZoneCorrespondenceIds
        : []
    )
  );
}

function validateGateBAdapterOccurrence({
  gateBAdapterOccurrence,
  toleranceContext
}) {
  const issues = [];
  const adapter = gateBAdapterOccurrence;

  if (
    !isHEarthGroundViewGateBWestAdmissionAdapterOccurrence(
      adapter
    )
  ) {
    issues.push({
      code: 'GATE_B_ADAPTER_OCCURRENCE_INVALID',
      message:
        'gateBAdapterOccurrence must satisfy the public Gate B adapter validator.',
      field: 'gateBAdapterOccurrence'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      adapter: null,
      admittedPrimitives: EMPTY_FROZEN_ARRAY,
      frame: null,
      frameId: null,
      bounds: null,
      primitiveOrder: GATE_B_PRIMITIVE_ORDER,
      provenanceApplicability:
        H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY,
      sourceObjectIds: EMPTY_FROZEN_ARRAY,
      sourceZoneIds: EMPTY_FROZEN_ARRAY,
      latticeRegionIds: EMPTY_FROZEN_ARRAY
    });
  }

  if (
    adapter.contractId !==
    H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID
  ) {
    issues.push({
      code: 'GATE_B_ADAPTER_CONTRACT_MISMATCH',
      message:
        'Gate B adapter occurrence contract identity is invalid.',
      expected:
        H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,
      actual:
        adapter.contractId ?? null
    });
  }

  if (
    adapter.westContractId !==
    H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
  ) {
    issues.push({
      code: 'GATE_B_ADAPTER_WEST_CONTRACT_MISMATCH',
      message:
        'Gate B adapter occurrence does not consume the controlling shared West contract.',
      expected:
        H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
      actual:
        adapter.westContractId ?? null
    });
  }

  const admittedPrimitives =
    Array.isArray(adapter.admittedPrimitives)
      ? adapter.admittedPrimitives
      : EMPTY_FROZEN_ARRAY;

  const frame =
    adapter.aggregateFrameAdmissionRecord ?? null;

  const aggregatePrimitives =
    Array.isArray(frame?.primitives)
      ? frame.primitives
      : EMPTY_FROZEN_ARRAY;

  const standaloneIds =
    admittedPrimitives.map(extractPrimitiveIdentity);

  const aggregateIds =
    aggregatePrimitives.map(extractPrimitiveIdentity);

  if (
    !exactOrderedArray(
      adapter.primitiveOrder,
      GATE_B_PRIMITIVE_ORDER
    ) ||
    !exactOrderedArray(
      standaloneIds,
      GATE_B_PRIMITIVE_ORDER
    ) ||
    !exactOrderedArray(
      aggregateIds,
      GATE_B_PRIMITIVE_ORDER
    )
  ) {
    issues.push({
      code: 'GATE_B_PRIMITIVE_ORDER_INVALID',
      message:
        'Gate B adapter occurrence must preserve exact terrain-water-ribbon primitive order.'
    });
  }

  if (
    admittedPrimitives.length !== 3 ||
    admittedPrimitives.some((primitive) =>
      !isHEarthAdmittedPrimitiveRecord(primitive) ||
      primitive.aggregateFrameMember !== false
    )
  ) {
    issues.push({
      code: 'GATE_B_STANDALONE_WEST_RECORDS_INVALID',
      message:
        'Gate B standalone West records must be three lawful non-frame-member admitted primitives.'
    });
  }

  if (
    aggregatePrimitives.length !== 3 ||
    aggregatePrimitives.some((primitive) =>
      !isHEarthAdmittedPrimitiveRecord({
        ...primitive,
        aggregateFrameMember: false
      }) ||
      primitive.aggregateFrameMember !== true
    )
  ) {
    issues.push({
      code: 'GATE_B_AGGREGATE_MEMBER_RECORDS_INVALID',
      message:
        'Gate B aggregate-frame members must be three lawful admitted member records.'
    });
  }

  if (!isHEarthAggregateFrameAdmissionRecord(frame)) {
    issues.push({
      code: 'GATE_B_AGGREGATE_FRAME_INVALID',
      message:
        'Gate B adapter occurrence must preserve one lawful West aggregate frame.'
    });
  }

  const frameId =
    isNonEmptyString(frame?.frameId)
      ? frame.frameId.trim()
      : null;

  if (
    !frameId ||
    frameId !== adapter.aggregateFrameId
  ) {
    issues.push({
      code: 'GATE_B_AGGREGATE_FRAME_IDENTITY_MISMATCH',
      message:
        'Gate B adapter aggregateFrameId must match the exact West frame identity.',
      expected:
        adapter.aggregateFrameId ?? null,
      actual:
        frameId
    });
  }

  const bounds = frame?.bounds ?? null;

  if (
    !isHEarthAABB3D(
      bounds,
      toleranceContext ?? undefined
    ) ||
    bounds?.empty !== false
  ) {
    issues.push({
      code: 'GATE_B_BOUNDS_INVALID',
      message:
        'Gate B aggregate-frame bounds must be a lawful nonempty public AABB.'
    });
  }

  if (
    adapter.toleranceContext !== toleranceContext &&
    !structurallyEqual(
      adapter.toleranceContext,
      toleranceContext
    )
  ) {
    issues.push({
      code: 'GATE_B_TOLERANCE_CORRESPONDENCE_INVALID',
      message:
        'Packet 002 toleranceContext must correspond exactly to the completed adapter occurrence.'
    });
  }

  if (
    adapter.provenanceApplicability !==
      H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY ||
    !isDeeplyFrozen(adapter.provenanceApplicability) ||
    !exactOrderedArray(
      adapter.provenanceApplicability.map(
        (record) => record?.primitiveId
      ),
      GATE_B_PRIMITIVE_ORDER
    ) ||
    adapter.provenanceApplicability.some(
      (record) => record?.synthesisProhibited !== true
    )
  ) {
    issues.push({
      code: 'GATE_B_PROVENANCE_APPLICABILITY_INVALID',
      message:
        'Gate B provenance must be the exact ordered no-synthesis applicability ledger.'
    });
  }

  for (
    let index = 0;
    index < Math.min(
      admittedPrimitives.length,
      aggregatePrimitives.length,
      GATE_B_PRIMITIVE_ORDER.length
    );
    index += 1
  ) {
    const standalone = admittedPrimitives[index];
    const aggregateMember = aggregatePrimitives[index];

    if (
      standalone.primitiveId !== aggregateMember.primitiveId ||
      standalone.admissionId !== aggregateMember.admissionId ||
      !structurallyEqual(
        standalone.geometry,
        aggregateMember.geometry
      )
    ) {
      issues.push({
        code: 'GATE_B_STANDALONE_AGGREGATE_CORRESPONDENCE_INVALID',
        message:
          'Gate B standalone and aggregate-member West records are not structurally correspondent.',
        details: GATE_B_PRIMITIVE_ORDER[index]
      });
    }
  }

  if (
    adapter.westBatchAdmissionInvocationCount !== 1 ||
    adapter.provenanceSynthesized !== false ||
    adapter.exactWestReferencesPreserved !== true ||
    adapter.geometryIdentityPreserved !== true ||
    adapter.outputDeeplyFrozen !== true
  ) {
    issues.push({
      code: 'GATE_B_ADAPTER_BOUNDARY_FLAGS_INVALID',
      message:
        'Gate B adapter boundary and preservation flags are invalid.'
    });
  }

  for (const field of [
    'geometryIndexEntryId',
    'compositorNodeId',
    'renderInstanceId'
  ]) {
    if (
      adapter[field] !== undefined &&
      adapter[field] !== null
    ) {
      issues.push({
        code: 'GATE_B_PREMATURE_DOWNSTREAM_IDENTITY',
        message:
          'Gate B adapter occurrence must not introduce downstream identity.',
        field
      });
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    adapter,
    admittedPrimitives,
    frame,
    frameId,
    bounds,
    primitiveOrder: GATE_B_PRIMITIVE_ORDER,
    provenanceApplicability:
      H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY,
    sourceObjectIds:
      deriveGateBExplicitSourceObjectIds(
        H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY
      ),
    sourceZoneIds:
      deriveGateBExplicitSourceZoneIds(
        H_EARTH_GROUND_VIEW_GATE_B_PROVENANCE_APPLICABILITY
      ),
    latticeRegionIds:
      EMPTY_FROZEN_ARRAY
  });
}

export function evaluateHEarthPostWestAdmittedGeometryTransferInput(
  input
) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_REJECTED',
      transferMode: null,
      issues: freezeIssues([
        {
          code: 'TRANSFER_INPUT_NOT_PLAIN_RECORD',
          message:
            'Packet 002 input must be a strict plain-record object.'
        }
      ])
    });
  }

  const allowedKeySet =
    new Set(ALL_TRANSFER_INPUT_KEYS);

  for (const key of Object.keys(input)) {
    if (!allowedKeySet.has(key)) {
      issues.push({
        code: 'UNKNOWN_TRANSFER_INPUT_KEY_REJECTED',
        message:
          'Packet 002 accepts only declared input keys.',
        field: key
      });
    }
  }

  const modeEvaluation =
    detectTransferMode(input);

  issues.push(...modeEvaluation.issues);

  const toleranceValidation =
    validateToleranceContext(
      input.toleranceContext
    );

  issues.push(...toleranceValidation.issues);

  if (!modeEvaluation.ok) {
    return Object.freeze({
      ok: false,

      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_REJECTED',

      transferMode: null,

      toleranceValidation,
      previewValidation: null,
      westBatchValidation: null,
      gateBAdapterValidation: null,

      issues: freezeIssues(issues)
    });
  }

  if (
    modeEvaluation.transferMode ===
    H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
      .GATE_B_ADAPTER_OCCURRENCE
  ) {
    const gateBAdapterValidation =
      validateGateBAdapterOccurrence({
        gateBAdapterOccurrence:
          input.gateBAdapterOccurrence,
        toleranceContext:
          toleranceValidation.normalizedValue
      });

    issues.push(...gateBAdapterValidation.issues);

    return Object.freeze({
      ok: issues.length === 0,

      status:
        issues.length === 0
          ? 'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_ACCEPTED'
          : 'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_REJECTED',

      transferMode:
        modeEvaluation.transferMode,

      toleranceValidation,
      previewValidation: null,
      westBatchValidation: null,
      gateBAdapterValidation,

      issues: freezeIssues(issues)
    });
  }

  const previewValidation =
    validatePreviewResult(
      input.previewResult
    );

  issues.push(...previewValidation.issues);

  const westBatchValidation =
    validateWestBatchAdmissionResult({
      westBatchAdmissionResult:
        input.westBatchAdmissionResult,
      previewValidation,
      toleranceContext:
        toleranceValidation.normalizedValue
    });

  issues.push(...westBatchValidation.issues);

  return Object.freeze({
    ok: issues.length === 0,

    status:
      issues.length === 0
        ? 'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_ACCEPTED'
        : 'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_REJECTED',

    transferMode:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
        .LEGACY_PREVIEW_WEST_BATCH,

    toleranceValidation,
    previewValidation,
    westBatchValidation,
    gateBAdapterValidation: null,

    issues: freezeIssues(issues)
  });
}

function buildGateBTransferFromEvaluation(
  inputEvaluation
) {
  const {
    toleranceValidation,
    gateBAdapterValidation
  } = inputEvaluation;

  const adapter =
    gateBAdapterValidation.adapter;

  const admittedPrimitivesSnapshot =
    snapshotForTransfer(
      gateBAdapterValidation.admittedPrimitives,
      'admittedPrimitives'
    );

  const frameSnapshot =
    snapshotForTransfer(
      gateBAdapterValidation.frame,
      'aggregateFrameAdmissionRecord'
    );

  const boundsSnapshot =
    snapshotForTransfer(
      gateBAdapterValidation.bounds,
      'bounds'
    );

  const primitiveOrderSnapshot =
    snapshotForTransfer(
      gateBAdapterValidation.primitiveOrder,
      'primitiveOrder'
    );

  const provenanceSnapshot =
    snapshotForTransfer(
      gateBAdapterValidation.provenanceApplicability,
      'primitiveProvenanceApplicability'
    );

  const toleranceSnapshot =
    toleranceValidation.normalizedValue === null
      ? {
          ok: true,
          value: null
        }
      : snapshotForTransfer(
          toleranceValidation.normalizedValue,
          'toleranceContext'
        );

  for (const candidate of [
    admittedPrimitivesSnapshot,
    frameSnapshot,
    boundsSnapshot,
    primitiveOrderSnapshot,
    provenanceSnapshot,
    toleranceSnapshot
  ]) {
    if (!candidate.ok) {
      return Object.freeze({
        ok: false,
        status:
          'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
        contractId:
          H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
        issues: freezeIssues([
          candidate.error
        ])
      });
    }
  }

  const admittedPrimitives =
    admittedPrimitivesSnapshot.value;

  const aggregateFrameAdmissionRecord =
    frameSnapshot.value;

  const aggregatePrimitives =
    aggregateFrameAdmissionRecord.primitives;

  const correspondence =
    deepFreeze(
      primitiveOrderSnapshot.value.map(
        (primitiveId, index) => ({
          primitiveId,
          standaloneOrdinal: index,
          aggregateOrdinal: index,
          standaloneAggregateMember:
            admittedPrimitives[index]
              .aggregateFrameMember,
          aggregateFrameMember:
            aggregatePrimitives[index]
              .aggregateFrameMember,
          separateSnapshotAllocation:
            admittedPrimitives[index] !==
            aggregatePrimitives[index],
          geometryStructurallyCorrespondent:
            structurallyEqual(
              admittedPrimitives[index].geometry,
              aggregatePrimitives[index].geometry
            ),
          admittedIdentityStructurallyCorrespondent:
            admittedPrimitives[index].admissionId ===
            aggregatePrimitives[index].admissionId
        })
      )
    );

  if (
    admittedPrimitives === aggregatePrimitives ||
    boundsSnapshot.value ===
      aggregateFrameAdmissionRecord.bounds ||
    provenanceSnapshot.value ===
      gateBAdapterValidation.provenanceApplicability ||
    correspondence.some((entry) =>
      entry.standaloneAggregateMember !== false ||
      entry.aggregateFrameMember !== true ||
      entry.separateSnapshotAllocation !== true ||
      entry.geometryStructurallyCorrespondent !== true ||
      entry.admittedIdentityStructurallyCorrespondent !== true
    )
  ) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues: freezeIssues([
        {
          code: 'GATE_B_SNAPSHOT_CORRESPONDENCE_INVALID',
          message:
            'Gate B Packet 002 snapshots are not separately allocated and structurally correspondent.'
        }
      ])
    });
  }

  return deepFreeze({
    ok: true,

    status:
      SUCCESS_STATUS,

    contractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    transferMode:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
        .GATE_B_ADAPTER_OCCURRENCE,

    westContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    requestId:
      adapter.routeToken,

    providerRequestId:
      adapter.gateBConstructionOccurrenceId,

    resolutionReceiptId:
      adapter.deterministicConstructionIdentity,

    sourceObjectIds:
      gateBAdapterValidation.sourceObjectIds,

    sourceZoneIds:
      gateBAdapterValidation.sourceZoneIds,

    latticeRegionIds:
      gateBAdapterValidation.latticeRegionIds,

    gateBAdapterContractId:
      adapter.contractId,

    gateBAdapterOccurrenceId:
      adapter.adapterOccurrenceId,

    gateBProviderContractId:
      adapter.gateBProviderContractId,

    gateBConstructionOccurrenceId:
      adapter.gateBConstructionOccurrenceId,

    deterministicConstructionIdentity:
      adapter.deterministicConstructionIdentity,

    analyticalPhysicalDistinction:
      adapter.analyticalPhysicalDistinction,

    physicalTrianglesEqualExactNonlinearAnalyticalSurface:
      adapter
        .physicalTrianglesEqualExactNonlinearAnalyticalSurface,

    primitiveOrder:
      primitiveOrderSnapshot.value,

    provenanceMode:
      GATE_B_PROVENANCE_MODE,

    provenanceCompleteness:
      GATE_B_PROVENANCE_COMPLETENESS,

    primitiveProvenanceApplicability:
      provenanceSnapshot.value,

    admittedPrimitives,

    aggregateFrameAdmissionRecord,

    standaloneToAggregateMemberCorrespondence:
      correspondence,

    bounds:
      boundsSnapshot.value,

    frameId:
      gateBAdapterValidation.frameId,

    toleranceContext:
      toleranceSnapshot.value,

    structuralCorrespondenceValidated: true,
    outputDeeplyFrozen: true,

    geometryIndexAuthority: false,
    geometryIndexEntryId: null,

    compositorAuthority: false,
    compositorNodeId: null,

    rendererAuthority: false,
    renderInstanceCreated: false,
    renderInstanceId: null,

    provisional: true,
    downstreamContractFrozen: false,
    finalDownstreamShapeClaimed: false,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function buildHEarthPostWestAdmittedGeometryTransfer(
  input
) {
  const inputEvaluation =
    evaluateHEarthPostWestAdmittedGeometryTransferInput(
      input
    );

  if (!inputEvaluation.ok) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues:
        inputEvaluation.issues
    });
  }

  if (
    inputEvaluation.transferMode ===
    H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
      .GATE_B_ADAPTER_OCCURRENCE
  ) {
    return buildGateBTransferFromEvaluation(
      inputEvaluation
    );
  }

  const {
    toleranceValidation,
    previewValidation,
    westBatchValidation
  } = inputEvaluation;

  const admittedPrimitivesSnapshot =
    snapshotForTransfer(
      westBatchValidation.admittedPrimitives,
      'admittedPrimitives'
    );

  if (!admittedPrimitivesSnapshot.ok) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues: freezeIssues([
        admittedPrimitivesSnapshot.error
      ])
    });
  }

  const frameSnapshot =
    snapshotForTransfer(
      westBatchValidation.frame,
      'aggregateFrameAdmissionRecord'
    );

  if (!frameSnapshot.ok) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues: freezeIssues([
        frameSnapshot.error
      ])
    });
  }

  const boundsSnapshot =
    snapshotForTransfer(
      westBatchValidation.bounds,
      'bounds'
    );

  if (!boundsSnapshot.ok) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues: freezeIssues([
        boundsSnapshot.error
      ])
    });
  }

  const toleranceSnapshot =
    toleranceValidation.normalizedValue === null
      ? {
          ok: true,
          value: null
        }
      : snapshotForTransfer(
          toleranceValidation.normalizedValue,
          'toleranceContext'
        );

  if (!toleranceSnapshot.ok) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_REJECTED',
      contractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
      issues: freezeIssues([
        toleranceSnapshot.error
      ])
    });
  }

  return deepFreeze({
    ok: true,

    status:
      SUCCESS_STATUS,

    contractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    transferMode:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES
        .LEGACY_PREVIEW_WEST_BATCH,

    westContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    requestId:
      previewValidation.requestId,

    providerRequestId:
      previewValidation.providerRequestId,

    resolutionReceiptId:
      previewValidation.resolutionReceiptId,

    sourceObjectIds:
      previewValidation.sourceObjectIds,

    sourceZoneIds:
      previewValidation.sourceZoneIds,

    latticeRegionIds:
      previewValidation.latticeRegionIds,

    admittedPrimitives:
      admittedPrimitivesSnapshot.value,

    aggregateFrameAdmissionRecord:
      frameSnapshot.value,

    bounds:
      boundsSnapshot.value,

    frameId:
      westBatchValidation.frameId,

    toleranceContext:
      toleranceSnapshot.value,

    geometryIndexAuthority: false,
    geometryIndexEntryId: null,

    compositorAuthority: false,
    compositorNodeId: null,

    rendererAuthority: false,
    renderInstanceCreated: false,
    renderInstanceId: null,

    provisional: true,
    downstreamContractFrozen: false,
    finalDownstreamShapeClaimed: false,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function getHEarthPostWestAdmittedGeometryTransferReceipt() {
  return H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_RECEIPT;
}

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_BOUNDARIES =
  deepFreeze({
    validatesCompletedUpstreamOccurrences: true,
    supportsMutuallyExclusiveLegacyAndGateBModes: true,
    rejectsMixedTransferModes: true,
    validatesGateBWestRecordsBeforeSnapshot: true,
    preservesWestAdmissionResults: true,
    preservesUpstreamProvenance: true,
    constructsImmutableTransferEnvelope: true,
    snapshotsOwnedDataBeforeFreeze: true,
    createsSeparateGateBStandaloneAndAggregateSnapshots: true,
    preservesGateBPrimitiveOrder: true,
    preservesGateBProvenanceApplicability: true,
    synthesizesGateBProvenance: false,

    admitsPrimitives: false,
    admitsAggregateFrames: false,
    constructsNeutralGeometry: false,
    registersGeometry: false,
    createsGeometryIndexIdentity: false,
    createsCompositorIdentity: false,
    createsRendererIdentity: false,
    activatesRenderer: false,
    activatesRuntime: false,

    geometryIndexAuthority: false,
    compositorAuthority: false,
    rendererAuthority: false,

    downstreamContractFrozen: false,
    finalDownstreamShapeClaimed: false,

    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    visualPassClaim: false,
    matrixCollapse: false
  });

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    schemaVersion:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_SCHEMA_VERSION,

    transferModes:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES,

    file:
      SOURCE_FILE,

    packetId:
      'API_SURFACE_PACKET_002',

    packetName:
      'PROVISIONAL_POST_WEST_ADMITTED_GEOMETRY_TRANSFER',

    role:
      'PROVISIONAL_POST_ADMISSION_TRANSFER_DESCRIPTOR',

    expectedPreviewContractId:
      EXPECTED_PREVIEW_CONTRACT_ID,

    gateBAdapterContractId:
      H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_CONTRACT_ID,

    gateBPrimitiveOrder:
      GATE_B_PRIMITIVE_ORDER,

    gateBProvenanceMode:
      GATE_B_PROVENANCE_MODE,

    consumedWestContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    consumedWestEnumValues:
      CONSUMED_WEST_ENUM_VALUES,

    preservesAdmittedPrimitives: true,
    preservesAggregateFrameAdmissionRecord: true,
    preservesBounds: true,
    preservesFrameId: true,
    preservesUpstreamProvenance: true,

    geometryIndexContractImplied: false,
    compositorContractImplied: false,
    rendererContractImplied: false,

    boundary:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_BOUNDARIES
  });

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_RECEIPT_PACKET_002',

    contractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    sourceFile:
      SOURCE_FILE,

    inputEvaluationDefined: true,
    explicitTransferModeDiscriminatorDefined: true,
    mixedModeRejectionDefined: true,
    immutableTransferEnvelopeDefined: true,
    previewValidationDefined: true,
    gateBAdapterValidationDefined: true,
    westBatchValidationDefined: true,
    primitiveMembershipCorrespondenceDefined: true,
    provenanceCorrespondenceDefined: true,
    boundedSnapshotConstructionDefined: true,
    separateGateBSnapshotAllocationDefined: true,
    gateBPrimitiveOrderPreservationDefined: true,
    gateBProvenanceApplicabilityDefined: true,
    downstreamNonClaimsDefined: true,

    geometryIndexAuthority: false,
    compositorAuthority: false,
    rendererAuthority: false,
    downstreamContractFrozen: false,
    finalDownstreamShapeClaimed: false,

    moduleSyntaxVerified: false,
    importResolutionVerified: false,
    moduleInitializationVerified: false,
    isolatedBehaviorVerified: false,

    boundary:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_BOUNDARIES
  });

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_AGGREGATE =
  deepFreeze({
    contractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    schemaVersion:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_SCHEMA_VERSION,

    transferModes:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_MODES,

    contract:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT,

    boundaries:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_BOUNDARIES,

    receipt:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_RECEIPT,

    evaluateHEarthPostWestAdmittedGeometryTransferInput,
    buildHEarthPostWestAdmittedGeometryTransfer,
    getHEarthPostWestAdmittedGeometryTransferReceipt
  });

export default H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_AGGREGATE;
