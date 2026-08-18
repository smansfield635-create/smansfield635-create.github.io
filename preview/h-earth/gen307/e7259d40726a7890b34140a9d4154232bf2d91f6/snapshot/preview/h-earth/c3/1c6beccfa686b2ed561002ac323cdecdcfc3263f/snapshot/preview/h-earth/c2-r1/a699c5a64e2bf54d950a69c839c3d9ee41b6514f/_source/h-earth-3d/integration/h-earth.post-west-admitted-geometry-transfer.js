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
 * Preserve one lawful post-West admitted-geometry occurrence as a provisional,
 * fail-closed transfer envelope without inventing geometry-index, compositor,
 * or renderer authority.
 *
 * Corridor:
 * Packet 001 source resolution
 * -> environment numeric profile
 * -> preview translation
 * -> South neutral geometry construction
 * -> West primitive admission
 * -> West aggregate-frame admission
 * -> Packet 002 provisional admitted-geometry transfer
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

export const H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID =
  'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1';

const SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js';

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

export function evaluateHEarthPostWestAdmittedGeometryTransferInput(
  input
) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_INPUT_REJECTED',
      issues: freezeIssues([
        {
          code: 'TRANSFER_INPUT_NOT_PLAIN_RECORD',
          message:
            'Packet 002 input must be a strict plain-record object.'
        }
      ])
    });
  }

  const allowedKeys = Object.freeze([
    'previewResult',
    'westBatchAdmissionResult',
    'toleranceContext'
  ]);

  const allowedKeySet =
    new Set(allowedKeys);

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

  const toleranceValidation =
    validateToleranceContext(
      input.toleranceContext
    );

  issues.push(...toleranceValidation.issues);

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

    toleranceValidation,
    previewValidation,
    westBatchValidation,

    issues: freezeIssues(issues)
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
    preservesWestAdmissionResults: true,
    preservesUpstreamProvenance: true,
    constructsImmutableTransferEnvelope: true,
    snapshotsOwnedDataBeforeFreeze: true,

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
    immutableTransferEnvelopeDefined: true,
    previewValidationDefined: true,
    westBatchValidationDefined: true,
    primitiveMembershipCorrespondenceDefined: true,
    provenanceCorrespondenceDefined: true,
    boundedSnapshotConstructionDefined: true,
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
