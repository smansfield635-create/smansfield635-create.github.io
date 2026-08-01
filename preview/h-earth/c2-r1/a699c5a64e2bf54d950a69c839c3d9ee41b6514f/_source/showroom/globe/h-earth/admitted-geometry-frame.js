/**
 * /showroom/globe/h-earth/admitted-geometry-frame.js
 * COMPLETE CORRECTED NEW FILE
 *
 * H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Role:
 * PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER
 *
 * Purpose:
 * Consume one lawful Packet 002 provisional post-West admitted-geometry
 * transfer, one bounded compositor-state snapshot, and one caller-supplied
 * resolved-camera-pose correspondence record, then construct one immutable
 * renderer-consumable admitted-geometry frame.
 *
 * This file owns:
 * - strict public-input validation
 * - Packet 002 transfer correspondence validation
 * - Packet 002 producer-owned frozen-snapshot enforcement
 * - caller-supplied Packet 002 occurrence-correlation recording
 * - West admitted-record revalidation through the public geometry facade
 * - primitive-membership correspondence by stable primitiveId
 * - aggregate-frame correspondence validation
 * - canonical duplicate-free source-provenance validation
 * - exact first-proof semantic membership validation
 * - nonempty first-proof bounds validation
 * - one-time compositor-state snapshot construction
 * - compositor revision snapshot validation
 * - resolved-camera-pose revision correlation
 * - resolved-camera-pose capacity and basis validation
 * - viewport-capacity validation
 * - presentation-local metadata assignment
 * - one unique presentation assignment per admitted primitive
 * - exact constructed-frame key equality validation
 * - exact presentation-assignment key equality validation
 * - complete first-proof presentation-assignment value validation
 * - immutable renderer-consumable frame construction
 * - complete public frame-contract revalidation
 * - fail-closed construction postcondition validation
 *
 * This file does not own:
 * - Packet 001 semantic source-object resolution
 * - environment numeric-profile authority
 * - provider construction
 * - South neutral geometry construction
 * - West primitive admission
 * - West aggregate-frame admission
 * - Packet 002 producer occurrence authentication
 * - resolved-camera-pose producer authentication
 * - camera mutation
 * - viewport mutation
 * - visibility mutation
 * - inertia mutation
 * - compositor revision advancement
 * - geometry construction
 * - admitted-coordinate mutation
 * - admitted-index mutation
 * - admitted-bounds mutation
 * - geometry indexing
 * - compositor-node creation
 * - renderer-instance creation
 * - renderer materialization
 * - backend material creation
 * - DOM creation
 * - action legality
 * - runtime activation
 * - persistence
 * - production validation
 * - deployment
 * - visual-pass approval
 * - matrix collapse
 */

import {
  H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID
} from '../../../h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_WEST_ENUMS,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  isHEarthAABB3D,
  isHEarthGeometryToleranceContext
} from './render/geometry-kernel.js';

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  evaluateHEarth3DViewportCapacity,
  evaluateHEarth3DCameraPose
} from './capacity.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID =
  'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1';

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SCHEMA_VERSION =
  1;

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/admitted-geometry-frame.js';

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_ROLE =
  'PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER';

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_TYPE =
  'H_EARTH_3D_ADMITTED_GEOMETRY_COMPOSITOR_FRAME';

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATUS =
  'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONSTRUCTED';

export const H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE =
  'FIRST_ADMITTED_WET_SAND_PROOF';

export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE =
  'MINIMUM_NATIVE_SHORELINE_PROOF';

const EXPECTED_PACKET_002_STATUS =
  'WEST_ADMISSION_COMPLETE_INDEX_NOT_YET_DEFINED';

const EXPECTED_PRIMARY_SOURCE_OBJECT_ID =
  'OBJ_002_FOREGROUND_WET_SAND';

const EXPECTED_PRIMARY_ZONE_ID =
  'ZONE_001_FOREGROUND_INSPECTION_ZONE';

const EXPECTED_PRIMARY_LATTICE_REGION_ID =
  'FOREGROUND_INSPECTION_GROUND';

const PACKET_002_OCCURRENCE_ID_OWNERSHIP =
  'CALLER_SUPPLIED_OCCURRENCE_CORRELATION_IDENTITY';

const CAMERA_CORRESPONDENCE_OWNERSHIP =
  'CALLER_SUPPLIED_COMPOSITOR_CAMERA_REVISION_CORRESPONDENCE';

const COMPOSITOR_FRAME_OCCURRENCE_OWNERSHIP =
  'BRIDGE_CONSTRUCTED_FRAME_ENVELOPE_WITH_CALLER_SUPPLIED_IDENTITY';

const PRESENTATION_MATERIAL_REFERENCE_AUTHORITY =
  'ADMITTED_GEOMETRY_FRAME_PRESENTATION_ASSIGNMENT_LOCAL';

const RENDERER_CAMERA_POSE_FIELD =
  'normalizedResolvedCameraPose';

const EMPTY_FROZEN_ARRAY =
  Object.freeze([]);

const EXPECTED_SOURCE_OBJECT_IDS =
  Object.freeze([
    EXPECTED_PRIMARY_SOURCE_OBJECT_ID
  ]);

const EXPECTED_SOURCE_ZONE_IDS =
  Object.freeze([
    EXPECTED_PRIMARY_ZONE_ID
  ]);

const EXPECTED_LATTICE_REGION_IDS =
  Object.freeze([
    EXPECTED_PRIMARY_LATTICE_REGION_ID
  ]);

const EXPECTED_SHORELINE_SOURCE_OBJECT_IDS =
  Object.freeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_007_WATER_SURFACE_PLANE'
  ]);

const EXPECTED_SHORELINE_SOURCE_ZONE_IDS =
  Object.freeze([
    'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    'ZONE_002_SHORELINE_CONTACT_ZONE',
    'ZONE_003_WATER_SURFACE_ZONE'
  ]);

const EXPECTED_SHORELINE_LATTICE_REGION_IDS =
  Object.freeze([
    'FOREGROUND_INSPECTION_GROUND',
    'SHORELINE_CONTACT',
    'WATER_SURFACE_PLANE'
  ]);

const ALLOWED_PRESENTATION_MODES =
  Object.freeze([
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE
  ]);

const REQUIRED_PUBLIC_INPUT_KEYS =
  Object.freeze([
    'packet002Transfer',
    'packet002TransferOccurrenceId',
    'compositorState',
    'resolvedCameraPoseCorrespondence',
    'presentationMode',
    'compositorFrameOccurrenceId'
  ]);

const REQUIRED_COMPOSITOR_STATE_KEYS =
  Object.freeze([
    'camera',
    'viewport',
    'visibility',
    'inertia',
    'revisions',
    'intentSequence',
    'lastAcceptedIntent',
    'lastRejectedIntent'
  ]);

const REQUIRED_REVISION_KEYS =
  Object.freeze([
    'camera',
    'viewport',
    'visibility',
    'inertia',
    'frame'
  ]);

const REQUIRED_CAMERA_CORRESPONDENCE_KEYS =
  Object.freeze([
    'sourceCameraRevision',
    'resolvedCameraPose'
  ]);

const PREMATURE_PACKET_002_IDENTITY_KEYS =
  Object.freeze([
    'geometryIndexEntryId',
    'compositorNodeId',
    'renderInstanceId'
  ]);

const REQUIRED_PRESENTATION_ASSIGNMENT_KEYS =
  Object.freeze([
    'primitiveId',
    'sourceObjectId',
    'presentationRole',
    'renderLayer',
    'materialReference',
    'materialIntent',
    'materialReferenceAuthority',
    'materialCreated',
    'materialSourceAuthorityAltered',
    'visibleEligible',
    'interactionTargetId',
    'geometryIdentityPreserved',
    'sourceGeometryReconstructed',
    'admissionRecordAltered',
    'rendererResourceCreated'
  ]);

const REQUIRED_CONSTRUCTED_FRAME_KEYS =
  Object.freeze([
    'ok',
    'status',
    'frameType',
    'contractId',
    'schemaVersion',
    'sourceFile',
    'role',

    'compositorFrameOccurrenceId',
    'compositorFrameOccurrenceIdentityOwnership',
    'compositorFrameRevision',

    'packet002ContractId',
    'packet002TransferOccurrenceId',
    'packet002TransferOccurrenceIdOwnership',
    'packet002OccurrenceIdentityAuthenticatedByProducer',
    'packet002Status',
    'packet002Provisional',
    'packet002DownstreamContractFrozen',
    'packet002FinalDownstreamShapeClaimed',

    'westContractId',
    'capacityContractId',

    'requestId',
    'providerRequestId',
    'resolutionReceiptId',

    'sourceObjectIds',
    'sourceZoneIds',
    'latticeRegionIds',

    'aggregateFrameId',
    'admittedPrimitiveIds',
    'admittedPrimitives',
    'aggregateFrameAdmissionRecord',
    'bounds',
    'toleranceContext',

    'cameraStateSnapshot',
    'resolvedCameraPoseCorrespondence',
    'resolvedCameraPoseOriginBinding',
    'resolvedCameraPoseProducerAuthenticated',
    'normalizedResolvedCameraPose',
    'rendererCameraPoseField',

    'viewportSnapshot',
    'visibilitySnapshot',
    'inertiaSnapshot',
    'revisions',

    'presentationMode',
    'presentationAssignments',

    'rendererConsumerEligibility',

    'geometryConstructionAuthority',
    'westAdmissionAuthority',
    'geometryIndexAuthority',
    'geometryIndexEntryId',

    'compositorMutationAuthority',
    'compositorRevisionAdvanced',
    'compositorNodeIdentityCreated',
    'compositorNodeId',

    'rendererAuthority',
    'rendererResourceCreated',
    'renderInstanceCreated',
    'renderInstanceId',

    'materialCreated',
    'materialSourceAuthorityAltered',

    'sourceGeometryReconstructed',
    'admittedCoordinatesAltered',
    'admittedIndicesAltered',
    'admittedBoundsAltered',
    'admittedPrimitiveIdentityAltered',
    'sourceProvenanceAltered',

    'actionLegalityEstablished',
    'runtimeActivated',
    'cryptographicIntegrityAuthenticated',
    'structuralCorrespondenceValidated',
    'outputDeeplyFrozen',

    'issues'
  ]);


/* ==========================================================================
 * 02 · GENERIC VALIDATION AND SNAPSHOT HELPERS
 * ========================================================================== */

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

function normalizeString(value) {
  return isNonEmptyString(value)
    ? value.trim()
    : null;
}

function isFiniteNumber(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  );
}

function isPositiveFiniteNumber(value) {
  return (
    isFiniteNumber(value) &&
    value > 0
  );
}

function isNonNegativeSafeInteger(value) {
  return (
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function arraysEqual(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every(
      (value, index) =>
        value === right[index]
    )
  );
}

function isNonEmptyCanonicalSubset(candidate, aggregate) {
  return (
    isCanonicalStringArray(candidate) &&
    candidate.length > 0 &&
    Array.isArray(aggregate) &&
    candidate.every(
      (value) => aggregate.includes(value)
    )
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

function isCanonicalStringArray(value) {
  if (
    !Array.isArray(value) ||
    !value.every(
      (entry) =>
        isNonEmptyString(entry) &&
        entry === entry.trim()
    )
  ) {
    return false;
  }

  return arraysEqual(
    value,
    canonicalUniqueStrings(value)
  );
}

function isCanonicalExactStringArray(
  value,
  expected
) {
  return (
    isCanonicalStringArray(value) &&
    arraysEqual(
      value,
      expected
    )
  );
}

function createBridgeIssue(
  code,
  message,
  {
    field = null,
    expected = null,
    actual = null,
    details = null,
    severity = 'ERROR'
  } = {}
) {
  return Object.freeze({
    code,
    severity,
    message,
    field,
    expected,
    actual,
    details
  });
}

function freezeIssues(issues) {
  return Object.freeze(
    issues.map((issue) =>
      createBridgeIssue(
        issue.code,
        issue.message,
        issue
      )
    )
  );
}

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (
    const key
    of Reflect.ownKeys(value)
  ) {
    deepFreeze(
      value[key],
      seen
    );
  }

  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  return value;
}

function isDeeplyFrozen(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return true;
  }

  if (seen.has(value)) {
    return true;
  }

  if (!Object.isFrozen(value)) {
    return false;
  }

  seen.add(value);

  return Reflect.ownKeys(value)
    .every(
      (key) =>
        isDeeplyFrozen(
          value[key],
          seen
        )
    );
}

function evaluateExactKeySurface(
  value,
  requiredKeys
) {
  if (!isPlainRecord(value)) {
    return Object.freeze({
      ok: false,

      unknownKeys:
        EMPTY_FROZEN_ARRAY,

      missingKeys:
        Object.freeze([
          ...requiredKeys
        ])
    });
  }

  const requiredKeySet =
    new Set(requiredKeys);

  const actualKeys =
    Object.keys(value);

  const unknownKeys =
    actualKeys
      .filter(
        (key) =>
          !requiredKeySet.has(key)
      )
      .sort();

  const missingKeys =
    requiredKeys
      .filter(
        (key) =>
          !Object.prototype.hasOwnProperty.call(
            value,
            key
          )
      )
      .sort();

  return Object.freeze({
    ok:
      unknownKeys.length === 0 &&
      missingKeys.length === 0,

    unknownKeys:
      Object.freeze(unknownKeys),

    missingKeys:
      Object.freeze(missingKeys)
  });
}

/**
 * Strict bounded clone.
 *
 * Repeated references are rejected even when acyclic. This intentionally
 * follows Packet 002's current snapshot law.
 */
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

        issue: createBridgeIssue(
          'NON_FINITE_NUMBER_REJECTED',
          'Non-finite numbers are not admitted in bridge snapshots.',
          {
            field: path,
            actual: value
          }
        )
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

      issue: createBridgeIssue(
        'UNSUPPORTED_VALUE_TYPE_REJECTED',
        'Unsupported value types are not admitted in bridge snapshots.',
        {
          field: path,
          actual: typeof value
        }
      )
    };
  }

  if (seen.has(value)) {
    return {
      ok: false,

      issue: createBridgeIssue(
        'REPEATED_REFERENCE_OR_CYCLE_REJECTED',
        'Repeated references and cyclic structures are not admitted.',
        {
          field: path
        }
      )
    };
  }

  if (Array.isArray(value)) {
    const ownKeys =
      Reflect.ownKeys(value);

    for (const key of ownKeys) {
      if (typeof key !== 'string') {
        return {
          ok: false,

          issue: createBridgeIssue(
            'SYMBOL_PROPERTY_REJECTED',
            'Symbol-keyed array properties are not admitted.',
            {
              field: path
            }
          )
        };
      }

      if (key === 'length') {
        continue;
      }

      if (!/^(0|[1-9]\d*)$/.test(key)) {
        return {
          ok: false,

          issue: createBridgeIssue(
            'ARRAY_CUSTOM_PROPERTY_REJECTED',
            'Custom array properties are not admitted.',
            {
              field:
                `${path}.${key}`
            }
          )
        };
      }

      const descriptor =
        Object.getOwnPropertyDescriptor(
          value,
          key
        );

      if (!descriptor?.enumerable) {
        return {
          ok: false,

          issue: createBridgeIssue(
            'NON_ENUMERABLE_PROPERTY_REJECTED',
            'Non-enumerable array properties are not admitted.',
            {
              field:
                `${path}.${key}`
            }
          )
        };
      }

      if (
        typeof descriptor.get === 'function' ||
        typeof descriptor.set === 'function'
      ) {
        return {
          ok: false,

          issue: createBridgeIssue(
            'ACCESSOR_PROPERTY_REJECTED',
            'Accessor properties are not admitted.',
            {
              field:
                `${path}.${key}`
            }
          )
        };
      }
    }

    seen.add(value);

    const clone = [];

    for (
      let index = 0;
      index < value.length;
      index += 1
    ) {
      const nested =
        rejectableStructuredClone(
          value[index],
          `${path}[${index}]`,
          seen
        );

      if (!nested.ok) {
        return nested;
      }

      clone.push(
        nested.value
      );
    }

    return {
      ok: true,
      value: clone
    };
  }

  if (!isPlainRecord(value)) {
    return {
      ok: false,

      issue: createBridgeIssue(
        'NON_PLAIN_RECORD_REJECTED',
        'Only strict plain-record objects are admitted.',
        {
          field: path
        }
      )
    };
  }

  const ownKeys =
    Reflect.ownKeys(value);

  for (const key of ownKeys) {
    if (typeof key !== 'string') {
      return {
        ok: false,

        issue: createBridgeIssue(
          'SYMBOL_PROPERTY_REJECTED',
          'Symbol-keyed object properties are not admitted.',
          {
            field: path
          }
        )
      };
    }

    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (!descriptor?.enumerable) {
      return {
        ok: false,

        issue: createBridgeIssue(
          'NON_ENUMERABLE_PROPERTY_REJECTED',
          'Non-enumerable properties are not admitted.',
          {
            field:
              `${path}.${key}`
          }
        )
      };
    }

    if (
      typeof descriptor.get === 'function' ||
      typeof descriptor.set === 'function'
    ) {
      return {
        ok: false,

        issue: createBridgeIssue(
          'ACCESSOR_PROPERTY_REJECTED',
          'Accessor properties are not admitted.',
          {
            field:
              `${path}.${key}`
          }
        )
      };
    }
  }

  seen.add(value);

  const clone = {};

  for (
    const [key, nestedValue]
    of Object.entries(value)
  ) {
    const nested =
      rejectableStructuredClone(
        nestedValue,
        `${path}.${key}`,
        seen
      );

    if (!nested.ok) {
      return nested;
    }

    clone[key] =
      nested.value;
  }

  return {
    ok: true,
    value: clone
  };
}

function snapshotPlainValue(
  value,
  path
) {
  const snapshot =
    rejectableStructuredClone(
      value,
      path
    );

  if (!snapshot.ok) {
    return snapshot;
  }

  return {
    ok: true,
    value:
      deepFreeze(snapshot.value)
  };
}


/* ==========================================================================
 * 03 · VECTOR, CAMERA, AND BOUNDS HELPERS
 * ========================================================================== */

function isVector3(value) {
  return (
    isPlainRecord(value) &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.z)
  );
}

function subtractVector(
  left,
  right
) {
  return {
    x: left.x - right.x,
    y: left.y - right.y,
    z: left.z - right.z
  };
}

function crossVector(
  left,
  right
) {
  return {
    x:
      left.y * right.z -
      left.z * right.y,

    y:
      left.z * right.x -
      left.x * right.z,

    z:
      left.x * right.y -
      left.y * right.x
  };
}

function vectorLength(value) {
  return Math.hypot(
    value.x,
    value.y,
    value.z
  );
}

function numbersEqual(
  left,
  right,
  tolerance = 0
) {
  return (
    isFiniteNumber(left) &&
    isFiniteNumber(right) &&
    Math.abs(left - right) <=
      tolerance
  );
}

function vectorsEqual(
  left,
  right,
  tolerance = 0
) {
  return (
    isVector3(left) &&
    isVector3(right) &&
    numbersEqual(
      left.x,
      right.x,
      tolerance
    ) &&
    numbersEqual(
      left.y,
      right.y,
      tolerance
    ) &&
    numbersEqual(
      left.z,
      right.z,
      tolerance
    )
  );
}

function areAABB3DRecordsEquivalent(
  left,
  right,
  toleranceContext = null,
  scalarTolerance = 0
) {
  const leftValid =
    toleranceContext === null
      ? isHEarthAABB3D(left)
      : isHEarthAABB3D(
          left,
          toleranceContext
        );

  const rightValid =
    toleranceContext === null
      ? isHEarthAABB3D(right)
      : isHEarthAABB3D(
          right,
          toleranceContext
        );

  if (
    !leftValid ||
    !rightValid
  ) {
    return false;
  }

  if (
    left.empty === true &&
    right.empty === true
  ) {
    return true;
  }

  if (left.empty !== right.empty) {
    return false;
  }

  return (
    vectorsEqual(
      left.minimum,
      right.minimum,
      scalarTolerance
    ) &&
    vectorsEqual(
      left.maximum,
      right.maximum,
      scalarTolerance
    ) &&
    vectorsEqual(
      left.center,
      right.center,
      scalarTolerance
    ) &&
    vectorsEqual(
      left.size,
      right.size,
      scalarTolerance
    ) &&
    vectorsEqual(
      left.halfExtent,
      right.halfExtent,
      scalarTolerance
    ) &&
    numbersEqual(
      left.diagonalLength,
      right.diagonalLength,
      scalarTolerance
    )
  );
}

function resolveNestedField(
  record,
  paths
) {
  for (const path of paths) {
    let current =
      record;

    let found = true;

    for (const segment of path) {
      if (
        current === null ||
        typeof current !== 'object' ||
        !Object.prototype.hasOwnProperty.call(
          current,
          segment
        )
      ) {
        found = false;
        break;
      }

      current =
        current[segment];
    }

    if (found) {
      return current;
    }
  }

  return undefined;
}

function normalizeResolvedCameraPose(
  resolvedCameraPose
) {
  if (!isPlainRecord(resolvedCameraPose)) {
    return null;
  }

  return {
    position:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['position'],
          ['pose', 'position'],
          ['camera', 'position']
        ]
      ),

    target:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['target'],
          ['pose', 'target'],
          ['camera', 'target']
        ]
      ),

    up:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['up'],
          ['pose', 'up'],
          ['camera', 'up']
        ]
      ),

    verticalFovDegrees:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['verticalFovDegrees'],
          ['pose', 'verticalFovDegrees'],
          ['camera', 'verticalFovDegrees']
        ]
      ),

    nearPlane:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['nearPlane'],
          ['pose', 'nearPlane'],
          ['camera', 'nearPlane']
        ]
      ),

    farPlane:
      resolveNestedField(
        resolvedCameraPose,
        [
          ['farPlane'],
          ['pose', 'farPlane'],
          ['camera', 'farPlane']
        ]
      )
  };
}

function validateNormalizedCameraBasis(
  normalizedPose
) {
  const issues = [];

  if (!isPlainRecord(normalizedPose)) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'NORMALIZED_CAMERA_POSE_INVALID',
          'The normalized camera pose must be a plain-record object.'
        )
      ])
    });
  }

  const {
    position,
    target,
    up,
    verticalFovDegrees,
    nearPlane,
    farPlane
  } = normalizedPose;

  if (!isVector3(position)) {
    issues.push(
      createBridgeIssue(
        'CAMERA_POSITION_INVALID',
        'Resolved camera position must be a finite Vector3.',
        {
          field:
            'resolvedCameraPose.position'
        }
      )
    );
  }

  if (!isVector3(target)) {
    issues.push(
      createBridgeIssue(
        'CAMERA_TARGET_INVALID',
        'Resolved camera target must be a finite Vector3.',
        {
          field:
            'resolvedCameraPose.target'
        }
      )
    );
  }

  if (!isVector3(up)) {
    issues.push(
      createBridgeIssue(
        'CAMERA_UP_INVALID',
        'Resolved camera up must be a finite Vector3.',
        {
          field:
            'resolvedCameraPose.up'
        }
      )
    );
  }

  if (
    isVector3(position) &&
    isVector3(target)
  ) {
    const forward =
      subtractVector(
        target,
        position
      );

    if (
      vectorLength(forward) <=
      Number.EPSILON
    ) {
      issues.push(
        createBridgeIssue(
          'CAMERA_FORWARD_VECTOR_ZERO',
          'Resolved camera position and target must not be coincident.',
          {
            field:
              'resolvedCameraPose'
          }
        )
      );
    }

    if (
      isVector3(up) &&
      vectorLength(up) >
        Number.EPSILON
    ) {
      const right =
        crossVector(
          up,
          forward
        );

      if (
        vectorLength(right) <=
        1e-9
      ) {
        issues.push(
          createBridgeIssue(
            'CAMERA_FORWARD_UP_PARALLEL',
            'Resolved camera forward and up vectors must not be parallel or near-parallel.',
            {
              field:
                'resolvedCameraPose.up'
            }
          )
        );
      }
    }
  }

  if (
    isVector3(up) &&
    vectorLength(up) <=
      Number.EPSILON
  ) {
    issues.push(
      createBridgeIssue(
        'CAMERA_UP_VECTOR_ZERO',
        'Resolved camera up must be nonzero.',
        {
          field:
            'resolvedCameraPose.up'
        }
      )
    );
  }

  if (
    !isFiniteNumber(
      verticalFovDegrees
    ) ||
    verticalFovDegrees <= 0 ||
    verticalFovDegrees >= 180
  ) {
    issues.push(
      createBridgeIssue(
        'CAMERA_FOV_INVALID',
        'Resolved camera vertical FOV must be finite and between 0 and 180 degrees.',
        {
          field:
            'resolvedCameraPose.verticalFovDegrees',

          actual:
            verticalFovDegrees ??
            null
        }
      )
    );
  }

  if (
    !isPositiveFiniteNumber(
      nearPlane
    )
  ) {
    issues.push(
      createBridgeIssue(
        'CAMERA_NEAR_PLANE_INVALID',
        'Resolved camera near plane must be positive and finite.',
        {
          field:
            'resolvedCameraPose.nearPlane',

          actual:
            nearPlane ??
            null
        }
      )
    );
  }

  if (
    !isFiniteNumber(farPlane) ||
    !isPositiveFiniteNumber(nearPlane) ||
    farPlane <= nearPlane
  ) {
    issues.push(
      createBridgeIssue(
        'CAMERA_FAR_PLANE_INVALID',
        'Resolved camera far plane must be finite and greater than the near plane.',
        {
          field:
            'resolvedCameraPose.farPlane',

          actual:
            farPlane ??
            null
        }
      )
    );
  }

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues)
  });
}

function normalizedCameraPosesEqual(
  left,
  right,
  tolerance = 0
) {
  return (
    isPlainRecord(left) &&
    isPlainRecord(right) &&
    vectorsEqual(
      left.position,
      right.position,
      tolerance
    ) &&
    vectorsEqual(
      left.target,
      right.target,
      tolerance
    ) &&
    vectorsEqual(
      left.up,
      right.up,
      tolerance
    ) &&
    numbersEqual(
      left.verticalFovDegrees,
      right.verticalFovDegrees,
      tolerance
    ) &&
    numbersEqual(
      left.nearPlane,
      right.nearPlane,
      tolerance
    ) &&
    numbersEqual(
      left.farPlane,
      right.farPlane,
      tolerance
    )
  );
}


/* ==========================================================================
 * 04 · PRIMITIVE AND PROVENANCE HELPERS
 * ========================================================================== */

function extractPrimitiveId(primitive) {
  return normalizeString(
    primitive?.primitiveId
  );
}

function evaluatePrimitiveMembership(
  primitives
) {
  if (
    !Array.isArray(primitives) ||
    primitives.length === 0
  ) {
    return Object.freeze({
      ok: false,

      primitiveIds:
        EMPTY_FROZEN_ARRAY,

      missingIdentityCount: 0,

      duplicatePrimitiveIds:
        EMPTY_FROZEN_ARRAY
    });
  }

  const rawPrimitiveIds =
    primitives.map(
      extractPrimitiveId
    );

  const missingIdentityCount =
    rawPrimitiveIds.filter(
      (value) =>
        value === null
    ).length;

  const seen =
    new Set();

  const duplicates =
    new Set();

  for (const primitiveId of rawPrimitiveIds) {
    if (!primitiveId) {
      continue;
    }

    if (seen.has(primitiveId)) {
      duplicates.add(
        primitiveId
      );
    } else {
      seen.add(
        primitiveId
      );
    }
  }

  const primitiveIds =
    canonicalUniqueStrings(
      rawPrimitiveIds
    );

  return Object.freeze({
    ok:
      missingIdentityCount === 0 &&
      duplicates.size === 0 &&
      primitiveIds.length ===
        primitives.length,

    primitiveIds,

    missingIdentityCount,

    duplicatePrimitiveIds:
      Object.freeze(
        Array.from(
          duplicates
        ).sort()
      )
  });
}

function extractPrimitiveMetadata(
  primitive
) {
  if (!isPlainRecord(primitive)) {
    return null;
  }

  if (isPlainRecord(primitive.metadata)) {
    return primitive.metadata;
  }

  if (
    isPlainRecord(primitive.geometry) &&
    isPlainRecord(
      primitive.geometry.metadata
    )
  ) {
    return primitive.geometry.metadata;
  }

  return null;
}

function extractFrameMetadata(frame) {
  return isPlainRecord(frame?.metadata)
    ? frame.metadata
    : null;
}

function getAggregateFrameAdmittedStatus() {
  return (
    H_EARTH_3D_GEOMETRY_WEST_ENUMS
      ?.aggregateFrameStatus
      ?.ADMITTED ??
    null
  );
}

function validateProofProvenance({
  presentationMode,
  sourceObjectIds,
  sourceZoneIds,
  latticeRegionIds
}) {
  const issues = [];

  const shorelineMode =
    presentationMode ===
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE;

  const expectedSourceObjectIds =
    shorelineMode
      ? EXPECTED_SHORELINE_SOURCE_OBJECT_IDS
      : EXPECTED_SOURCE_OBJECT_IDS;

  const expectedSourceZoneIds =
    shorelineMode
      ? EXPECTED_SHORELINE_SOURCE_ZONE_IDS
      : EXPECTED_SOURCE_ZONE_IDS;

  const expectedLatticeRegionIds =
    shorelineMode
      ? EXPECTED_SHORELINE_LATTICE_REGION_IDS
      : EXPECTED_LATTICE_REGION_IDS;

  if (
    !isCanonicalExactStringArray(
      sourceObjectIds,
      expectedSourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_SOURCE_OBJECT_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical source-object membership.',
        {
          field:
            'sourceObjectIds',
          expected:
            expectedSourceObjectIds,
          actual:
            Array.isArray(sourceObjectIds)
              ? sourceObjectIds
              : null
        }
      )
    );
  }

  if (
    !isCanonicalExactStringArray(
      sourceZoneIds,
      expectedSourceZoneIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_SOURCE_ZONE_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical source-zone membership.',
        {
          field:
            'sourceZoneIds',
          expected:
            expectedSourceZoneIds,
          actual:
            Array.isArray(sourceZoneIds)
              ? sourceZoneIds
              : null
        }
      )
    );
  }

  if (
    !isCanonicalExactStringArray(
      latticeRegionIds,
      expectedLatticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_LATTICE_REGION_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical lattice-region membership.',
        {
          field:
            'latticeRegionIds',
          expected:
            expectedLatticeRegionIds,
          actual:
            Array.isArray(latticeRegionIds)
              ? latticeRegionIds
              : null
        }
      )
    );
  }

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues)
  });
}

function validatePrimitiveSourceProvenance({
  primitives,
  sourceObjectIds,
  sourceZoneIds,
  latticeRegionIds,
  fieldPrefix
}) {
  const issues = [];

  if (!Array.isArray(primitives)) {
    return Object.freeze({
      ok: false,
      issues: freezeIssues([
        createBridgeIssue(
          'PRIMITIVE_PROVENANCE_INPUT_INVALID',
          'Primitive provenance validation requires an array.',
          {
            field:
              fieldPrefix
          }
        )
      ])
    });
  }

  primitives.forEach(
    (
      primitive,
      index
    ) => {
      const metadata =
        extractPrimitiveMetadata(
          primitive
        );

      const primitiveSourceObjectIds =
        canonicalUniqueStrings(
          metadata?.sourceObjectIds ?? [
            metadata?.sourceObjectId
          ]
        );

      const primitiveSourceZoneIds =
        canonicalUniqueStrings(
          metadata?.sourceZoneIds ?? [
            metadata?.zoneId
          ]
        );

      const primitiveLatticeRegionIds =
        canonicalUniqueStrings(
          metadata?.latticeRegionIds
        );

      if (
        !isNonEmptyCanonicalSubset(
          primitiveSourceObjectIds,
          sourceObjectIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_SOURCE_OBJECT_PROVENANCE_MISMATCH',
            'Primitive source-object provenance must be a non-empty canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.sourceObjectIds`,
              expected:
                sourceObjectIds,
              actual:
                primitiveSourceObjectIds
            }
          )
        );
      }

      if (
        !isNonEmptyCanonicalSubset(
          primitiveSourceZoneIds,
          sourceZoneIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_SOURCE_ZONE_PROVENANCE_MISMATCH',
            'Primitive source-zone provenance must be a non-empty canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.sourceZoneIds`,
              expected:
                sourceZoneIds,
              actual:
                primitiveSourceZoneIds
            }
          )
        );
      }

      if (
        primitiveLatticeRegionIds.length > 0 &&
        !isNonEmptyCanonicalSubset(
          primitiveLatticeRegionIds,
          latticeRegionIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_LATTICE_REGION_PROVENANCE_MISMATCH',
            'Primitive lattice-region provenance, when present, must be a canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.latticeRegionIds`,
              expected:
                latticeRegionIds,
              actual:
                primitiveLatticeRegionIds
            }
          )
        );
      }
    }
  );

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues)
  });
}

/* ==========================================================================
 * 05 · BOUNDARY DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_BOUNDARY_FLAGS =
  deepFreeze({
    validatesPacket002Transfer: true,
    requiresProducerOwnedFrozenPacket002Snapshot: true,
    validatesWestAdmittedPrimitiveRecords: true,
    validatesWestAggregateFrameRecord: true,
    validatesPrimitiveMembershipCorrespondence: true,
    validatesCanonicalSourceProvenance: true,
    validatesExactFirstProofMembership: true,
    validatesBoundsCorrespondence: true,
    validatesNonemptyFirstProofBounds: true,

    snapshotsCompositorStateExactlyOnce: true,
    validatesCompositorRevisions: true,
    validatesResolvedCameraPoseRevisionCorrelation: true,
    validatesResolvedCameraPoseCapacity: true,
    validatesResolvedCameraBasis: true,
    validatesViewportCapacity: true,

    constructsPresentationAssignments: true,
    validatesUniquePresentationAssignmentMembership: true,
    validatesExactPresentationAssignmentKeyEquality: true,
    validatesExactPresentationAssignmentValues: true,
    validatesExactConstructedFrameKeyEquality: true,
    constructsImmutableRendererConsumerFrame: true,
    ownsCompositorFrameOccurrenceEnvelope: true,
    revalidatesCompletePublicFrameContract: true,
    enforcesConstructionPostcondition: true,
    exposesTotalBooleanFrameValidator: true,

    authenticatesPacket002ProducerOccurrenceIdentity: false,
    authenticatesResolvedCameraPoseProducer: false,

    mutatesPacket002Transfer: false,
    mutatesCompositorState: false,
    advancesCompositorRevision: false,

    constructsGeometry: false,
    altersAdmittedCoordinates: false,
    altersAdmittedIndices: false,
    altersAdmittedBounds: false,
    altersPrimitiveIdentity: false,
    altersSourceProvenance: false,

    performsWestAdmission: false,
    createsGeometryIndexIdentity: false,
    createsCompositorNodeIdentity: false,
    createsRendererIdentity: false,
    createsRenderInstance: false,

    createsBackendMaterial: false,
    altersMaterialSourceAuthority: false,
    materializesRendererOutput: false,
    createsDOM: false,
    activatesRuntime: false,
    executesActions: false,

    geometryIndexAuthority: false,
    compositorMutationAuthority: false,
    rendererAuthority: false,
    runtimeAuthority: false,

    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    visualPassClaim: false,
    matrixCollapse: false
  });


/* ==========================================================================
 * 06 · PACKET 002 TRANSFER VALIDATION
 * ========================================================================== */

function validatePacket002Transfer(
  packet002Transfer,
  presentationMode
) {
  const issues = [];

  if (!isPlainRecord(packet002Transfer)) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'PACKET_002_TRANSFER_NOT_PLAIN_RECORD',
          'packet002Transfer must be a strict plain-record object.',
          {
            field:
              'packet002Transfer'
          }
        )
      ])
    });
  }

  if (!isDeeplyFrozen(packet002Transfer)) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_TRANSFER_NOT_DEEPLY_FROZEN',
        'Packet 002 must preserve its producer-owned deeply frozen snapshot boundary before bridge consumption.',
        {
          field:
            'packet002Transfer'
        }
      )
    );
  }

  if (
    !Array.isArray(
      packet002Transfer.issues
    ) ||
    packet002Transfer.issues.length !== 0
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_TRANSFER_ISSUES_NOT_EMPTY',
        'A successful Packet 002 transfer must expose an empty issues array.',
        {
          field:
            'packet002Transfer.issues',

          expected:
            EMPTY_FROZEN_ARRAY,

          actual:
            Array.isArray(
              packet002Transfer.issues
            )
              ? packet002Transfer.issues
              : null
        }
      )
    );
  }

  if (
    packet002Transfer.contractId !==
    H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_CONTRACT_MISMATCH',
        'Packet 002 contractId does not match the controlling transfer contract.',
        {
          field:
            'packet002Transfer.contractId',

          expected:
            H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

          actual:
            packet002Transfer.contractId ??
            null
        }
      )
    );
  }

  if (packet002Transfer.ok !== true) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_NOT_SUCCESSFUL',
        'Packet 002 transfer must expose ok === true.',
        {
          field:
            'packet002Transfer.ok',

          expected:
            true,

          actual:
            packet002Transfer.ok ??
            null
        }
      )
    );
  }

  if (
    packet002Transfer.status !==
    EXPECTED_PACKET_002_STATUS
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_STATUS_MISMATCH',
        'Packet 002 status does not match the provisional post-West success state.',
        {
          field:
            'packet002Transfer.status',

          expected:
            EXPECTED_PACKET_002_STATUS,

          actual:
            packet002Transfer.status ??
            null
        }
      )
    );
  }

  if (
    packet002Transfer.provisional !==
    true
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_PROVISIONAL_FLAG_REQUIRED',
        'Packet 002 must remain provisional.',
        {
          field:
            'packet002Transfer.provisional',

          expected:
            true,

          actual:
            packet002Transfer.provisional ??
            null
        }
      )
    );
  }

  if (
    packet002Transfer.downstreamContractFrozen !==
    false
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_DOWNSTREAM_CONTRACT_FROZEN',
        'Packet 002 downstreamContractFrozen must remain false.',
        {
          field:
            'packet002Transfer.downstreamContractFrozen',

          expected:
            false,

          actual:
            packet002Transfer.downstreamContractFrozen ??
            null
        }
      )
    );
  }

  if (
    packet002Transfer.finalDownstreamShapeClaimed !==
    false
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_FINAL_DOWNSTREAM_SHAPE_CLAIMED',
        'Packet 002 finalDownstreamShapeClaimed must remain false.',
        {
          field:
            'packet002Transfer.finalDownstreamShapeClaimed',

          expected:
            false,

          actual:
            packet002Transfer.finalDownstreamShapeClaimed ??
            null
        }
      )
    );
  }

  if (
    packet002Transfer.westContractId !==
    H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
  ) {
    issues.push(
      createBridgeIssue(
        'WEST_CONTRACT_MISMATCH',
        'Packet 002 westContractId does not match the controlling West contract.',
        {
          field:
            'packet002Transfer.westContractId',

          expected:
            H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

          actual:
            packet002Transfer.westContractId ??
            null
        }
      )
    );
  }

  for (
    const [field, expected]
    of [
      ['geometryIndexAuthority', false],
      ['compositorAuthority', false],
      ['rendererAuthority', false],
      ['renderInstanceCreated', false]
    ]
  ) {
    if (
      packet002Transfer[field] !==
      expected
    ) {
      issues.push(
        createBridgeIssue(
          'PREMATURE_AUTHORITY_FLAG_REJECTED',
          `${field} must remain false in Packet 002.`,
          {
            field:
              `packet002Transfer.${field}`,

            expected,

            actual:
              packet002Transfer[field] ??
              null
          }
        )
      );
    }
  }

  for (
    const field
    of PREMATURE_PACKET_002_IDENTITY_KEYS
  ) {
    if (
      packet002Transfer[field] !==
      null
    ) {
      issues.push(
        createBridgeIssue(
          'PREMATURE_DOWNSTREAM_IDENTITY_REJECTED',
          `${field} must remain null in Packet 002.`,
          {
            field:
              `packet002Transfer.${field}`,

            expected:
              null,

            actual:
              packet002Transfer[field] ??
              null
          }
        )
      );
    }
  }

  for (
    const field
    of [
      'requestId',
      'providerRequestId',
      'resolutionReceiptId',
      'frameId'
    ]
  ) {
    if (
      !isNonEmptyString(
        packet002Transfer[field]
      )
    ) {
      issues.push(
        createBridgeIssue(
          'PACKET_002_IDENTITY_MISSING',
          `${field} must be a non-empty string.`,
          {
            field:
              `packet002Transfer.${field}`
          }
        )
      );
    }
  }

  const rawSourceObjectIds =
    packet002Transfer.sourceObjectIds;

  const rawSourceZoneIds =
    packet002Transfer.sourceZoneIds;

  const rawLatticeRegionIds =
    packet002Transfer.latticeRegionIds;

  if (
    presentationMode ===
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE
  ) {
    const firstProofProvenance =
      validateProofProvenance({
      presentationMode,
        sourceObjectIds:
          rawSourceObjectIds,

        sourceZoneIds:
          rawSourceZoneIds,

        latticeRegionIds:
          rawLatticeRegionIds
      });

    issues.push(
      ...firstProofProvenance.issues
    );
  }

  const sourceObjectIds =
    isCanonicalStringArray(
      rawSourceObjectIds
    )
      ? rawSourceObjectIds
      : canonicalUniqueStrings(
          rawSourceObjectIds
        );

  const sourceZoneIds =
    isCanonicalStringArray(
      rawSourceZoneIds
    )
      ? rawSourceZoneIds
      : canonicalUniqueStrings(
          rawSourceZoneIds
        );

  const latticeRegionIds =
    isCanonicalStringArray(
      rawLatticeRegionIds
    )
      ? rawLatticeRegionIds
      : canonicalUniqueStrings(
          rawLatticeRegionIds
        );

  const toleranceContext =
    packet002Transfer
      .toleranceContext;

  if (
    toleranceContext !== null &&
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    issues.push(
      createBridgeIssue(
        'TOLERANCE_CONTEXT_INVALID',
        'Packet 002 toleranceContext must be null or satisfy the public geometry validator.',
        {
          field:
            'packet002Transfer.toleranceContext'
        }
      )
    );
  }

  const bounds =
    packet002Transfer.bounds;

  const boundsValid =
    toleranceContext === null
      ? isHEarthAABB3D(bounds)
      : isHEarthAABB3D(
          bounds,
          toleranceContext
        );

  if (!boundsValid) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_BOUNDS_INVALID',
        'Packet 002 bounds must satisfy the public AABB validator.',
        {
          field:
            'packet002Transfer.bounds'
        }
      )
    );
  }

  const admittedPrimitives =
    packet002Transfer
      .admittedPrimitives;

  if (
    !Array.isArray(
      admittedPrimitives
    ) ||
    admittedPrimitives.length === 0
  ) {
    issues.push(
      createBridgeIssue(
        'ADMITTED_PRIMITIVES_MISSING',
        'Packet 002 must preserve a non-empty admittedPrimitives array.',
        {
          field:
            'packet002Transfer.admittedPrimitives'
        }
      )
    );
  }

  if (Array.isArray(admittedPrimitives)) {
    admittedPrimitives.forEach(
      (
        primitive,
        index
      ) => {
        if (
          !isHEarthAdmittedPrimitiveRecord(
            primitive
          )
        ) {
          issues.push(
            createBridgeIssue(
              'ADMITTED_PRIMITIVE_INVALID',
              'Every Packet 002 admitted primitive must satisfy the public West validator.',
              {
                field:
                  `packet002Transfer.admittedPrimitives[${index}]`
              }
            )
          );
        }

        if (
          primitive?.aggregateFrameMember !==
          false
        ) {
          issues.push(
            createBridgeIssue(
              'STANDALONE_PRIMITIVE_MEMBERSHIP_FLAG_INVALID',
              'Packet 002 standalone primitives must preserve aggregateFrameMember === false.',
              {
                field:
                  `packet002Transfer.admittedPrimitives[${index}].aggregateFrameMember`,

                expected:
                  false,

                actual:
                  primitive?.aggregateFrameMember ??
                  null
              }
            )
          );
        }
      }
    );
  }

  const standaloneMembership =
    evaluatePrimitiveMembership(
      admittedPrimitives
    );

  if (!standaloneMembership.ok) {
    issues.push(
      createBridgeIssue(
        'ADMITTED_PRIMITIVE_MEMBERSHIP_INVALID',
        'Packet 002 admitted primitive IDs must be present and unique.',
        {
          field:
            'packet002Transfer.admittedPrimitives',

          details:
            standaloneMembership
        }
      )
    );
  }

  const aggregateFrame =
    packet002Transfer
      .aggregateFrameAdmissionRecord;

  if (
    !isHEarthAggregateFrameAdmissionRecord(
      aggregateFrame
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_RECORD_INVALID',
        'Packet 002 aggregateFrameAdmissionRecord must satisfy the public West validator.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord'
        }
      )
    );
  }

  const expectedAggregateStatus =
    getAggregateFrameAdmittedStatus();

  if (
    expectedAggregateStatus !== null &&
    aggregateFrame?.status !==
      expectedAggregateStatus
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_STATUS_INVALID',
        'Aggregate-frame status does not match the controlling West admitted status.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.status',

          expected:
            expectedAggregateStatus,

          actual:
            aggregateFrame?.status ??
            null
        }
      )
    );
  }

  if (
    aggregateFrame?.recordType !==
    'H_EARTH_WEST_ADMITTED_AGGREGATE_FRAME_RECORD'
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_RECORD_TYPE_INVALID',
        'Aggregate-frame recordType does not match the West aggregate-frame record type.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.recordType',

          expected:
            'H_EARTH_WEST_ADMITTED_AGGREGATE_FRAME_RECORD',

          actual:
            aggregateFrame?.recordType ??
            null
        }
      )
    );
  }

  if (
    aggregateFrame?.admitted !==
      true ||
    aggregateFrame
      ?.admissionAuthority !==
      'WEST'
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_ADMISSION_AUTHORITY_INVALID',
        'Aggregate-frame admission must remain admitted by West.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord'
        }
      )
    );
  }

  const aggregateFrameId =
    normalizeString(
      aggregateFrame?.frameId
    );

  const packetFrameId =
    normalizeString(
      packet002Transfer.frameId
    );

  if (
    aggregateFrameId !==
    packetFrameId
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_ID_MISMATCH',
        'Packet 002 frameId must match aggregateFrameAdmissionRecord.frameId.',
        {
          field:
            'packet002Transfer.frameId',

          expected:
            aggregateFrameId,

          actual:
            packetFrameId
        }
      )
    );
  }

  const aggregatePrimitives =
    aggregateFrame?.primitives;

  if (
    !Array.isArray(
      aggregatePrimitives
    ) ||
    aggregatePrimitives.length === 0
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_PRIMITIVES_MISSING',
        'Aggregate-frame admission must preserve a non-empty primitives array.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.primitives'
        }
      )
    );
  }

  if (Array.isArray(aggregatePrimitives)) {
    aggregatePrimitives.forEach(
      (
        primitive,
        index
      ) => {
        if (
          !isHEarthAdmittedPrimitiveRecord({
            ...primitive,
            aggregateFrameMember: false
          })
        ) {
          issues.push(
            createBridgeIssue(
              'AGGREGATE_FRAME_PRIMITIVE_INVALID',
              'Every aggregate-frame primitive must satisfy the public West validator.',
              {
                field:
                  `packet002Transfer.aggregateFrameAdmissionRecord.primitives[${index}]`
              }
            )
          );
        }

        if (
          primitive?.aggregateFrameMember !==
          true
        ) {
          issues.push(
            createBridgeIssue(
              'AGGREGATE_FRAME_MEMBER_FLAG_INVALID',
              'Aggregate-frame primitives must preserve aggregateFrameMember === true.',
              {
                field:
                  `packet002Transfer.aggregateFrameAdmissionRecord.primitives[${index}].aggregateFrameMember`,

                expected:
                  true,

                actual:
                  primitive?.aggregateFrameMember ??
                  null
              }
            )
          );
        }
      }
    );
  }

  const aggregateMembership =
    evaluatePrimitiveMembership(
      aggregatePrimitives
    );

  if (!aggregateMembership.ok) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_PRIMITIVE_MEMBERSHIP_INVALID',
        'Aggregate-frame primitive IDs must be present and unique.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.primitives',

          details:
            aggregateMembership
        }
      )
    );
  }

  if (
    standaloneMembership.ok &&
    aggregateMembership.ok &&
    !arraysEqual(
      standaloneMembership.primitiveIds,
      aggregateMembership.primitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_FRAME_PRIMITIVE_MEMBERSHIP_MISMATCH',
        'Standalone and aggregate-frame primitive membership must match by primitiveId.',
        {
          expected:
            standaloneMembership.primitiveIds,

          actual:
            aggregateMembership.primitiveIds
        }
      )
    );
  }

  if (
    Array.isArray(
      aggregateFrame?.primitiveIds
    )
  ) {
    if (
      canonicalUniqueStrings(
        aggregateFrame.primitiveIds
      ).length !==
        aggregateFrame.primitiveIds.length ||
      !arraysEqual(
        canonicalUniqueStrings(
          aggregateFrame.primitiveIds
        ),
        standaloneMembership.primitiveIds
      )
    ) {
      issues.push(
        createBridgeIssue(
          'AGGREGATE_FRAME_PRIMITIVE_ID_LIST_MISMATCH',
          'Aggregate-frame primitiveIds must be duplicate-free and match canonical admitted primitive membership regardless of lawful West insertion order.',
          {
            field:
              'packet002Transfer.aggregateFrameAdmissionRecord.primitiveIds',

            expected:
              standaloneMembership.primitiveIds,

            actual:
              aggregateFrame.primitiveIds
          }
        )
      );
    }
  }

  if (
    Number.isSafeInteger(
      aggregateFrame?.primitiveCount
    ) &&
    Array.isArray(
      aggregatePrimitives
    ) &&
    aggregateFrame.primitiveCount !==
      aggregatePrimitives.length
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_PRIMITIVE_COUNT_MISMATCH',
        'Aggregate-frame primitiveCount must match aggregate-frame membership.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.primitiveCount',

          expected:
            aggregatePrimitives.length,

          actual:
            aggregateFrame.primitiveCount
        }
      )
    );
  }

  const aggregateBounds =
    aggregateFrame?.bounds;

  const aggregateBoundsValid =
    toleranceContext === null
      ? isHEarthAABB3D(
          aggregateBounds
        )
      : isHEarthAABB3D(
          aggregateBounds,
          toleranceContext
        );

  if (!aggregateBoundsValid) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_BOUNDS_INVALID',
        'Aggregate-frame bounds must satisfy the public AABB validator.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.bounds'
        }
      )
    );
  }

  if (
    ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    ) &&
    (
      bounds?.empty !== false ||
      aggregateBounds?.empty !== false
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FIRST_PROOF_EMPTY_BOUNDS_REJECTED',
        'FIRST_ADMITTED_WET_SAND_PROOF requires nonempty Packet 002 and aggregate-frame geometry bounds.',
        {
          expected:
            Object.freeze({
              packet002BoundsEmpty:
                false,

              aggregateFrameBoundsEmpty:
                false
            }),

          actual:
            Object.freeze({
              packet002BoundsEmpty:
                bounds?.empty ??
                null,

              aggregateFrameBoundsEmpty:
                aggregateBounds?.empty ??
                null
            })
        }
      )
    );
  }

  if (
    boundsValid &&
    aggregateBoundsValid &&
    !areAABB3DRecordsEquivalent(
      bounds,
      aggregateBounds,
      toleranceContext,
      0
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_BOUNDS_CORRESPONDENCE_MISMATCH',
        'Packet 002 bounds must correspond exactly to aggregate-frame bounds.',
        {
          field:
            'packet002Transfer.bounds'
        }
      )
    );
  }

  const frameMetadata =
    extractFrameMetadata(
      aggregateFrame
    );

  if (
    !isCanonicalStringArray(
      frameMetadata?.sourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_SOURCE_OBJECT_ARRAY_NOT_CANONICAL',
        'Aggregate-frame sourceObjectIds must be a canonical duplicate-free string array.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.metadata.sourceObjectIds'
        }
      )
    );
  }

  if (
    !isCanonicalStringArray(
      frameMetadata?.sourceZoneIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_SOURCE_ZONE_ARRAY_NOT_CANONICAL',
        'Aggregate-frame sourceZoneIds must be a canonical duplicate-free string array.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.metadata.sourceZoneIds'
        }
      )
    );
  }

  if (
    !isCanonicalStringArray(
      frameMetadata?.latticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_LATTICE_REGION_ARRAY_NOT_CANONICAL',
        'Aggregate-frame latticeRegionIds must be a canonical duplicate-free string array.',
        {
          field:
            'packet002Transfer.aggregateFrameAdmissionRecord.metadata.latticeRegionIds'
        }
      )
    );
  }

  const frameRequestId =
    normalizeString(
      frameMetadata?.requestId
    );

  const frameProviderRequestId =
    normalizeString(
      frameMetadata?.providerRequestId
    );

  const frameResolutionReceiptId =
    normalizeString(
      frameMetadata?.resolutionReceiptId
    );

  const frameSourceObjectIds =
    isCanonicalStringArray(
      frameMetadata?.sourceObjectIds
    )
      ? frameMetadata.sourceObjectIds
      : canonicalUniqueStrings(
          frameMetadata?.sourceObjectIds
        );

  const frameSourceZoneIds =
    isCanonicalStringArray(
      frameMetadata?.sourceZoneIds
    )
      ? frameMetadata.sourceZoneIds
      : canonicalUniqueStrings(
          frameMetadata?.sourceZoneIds
        );

  const frameLatticeRegionIds =
    isCanonicalStringArray(
      frameMetadata?.latticeRegionIds
    )
      ? frameMetadata.latticeRegionIds
      : canonicalUniqueStrings(
          frameMetadata?.latticeRegionIds
        );

  if (
    frameRequestId !==
    normalizeString(
      packet002Transfer.requestId
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_REQUEST_PROVENANCE_MISMATCH',
        'Aggregate-frame requestId must match Packet 002 requestId.',
        {
          expected:
            packet002Transfer.requestId,

          actual:
            frameRequestId
        }
      )
    );
  }

  if (
    frameProviderRequestId !==
    normalizeString(
      packet002Transfer.providerRequestId
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_PROVIDER_REQUEST_PROVENANCE_MISMATCH',
        'Aggregate-frame providerRequestId must match Packet 002 providerRequestId.',
        {
          expected:
            packet002Transfer.providerRequestId,

          actual:
            frameProviderRequestId
        }
      )
    );
  }

  if (
    frameResolutionReceiptId !==
    normalizeString(
      packet002Transfer.resolutionReceiptId
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_RESOLUTION_RECEIPT_PROVENANCE_MISMATCH',
        'Aggregate-frame resolutionReceiptId must match Packet 002 resolutionReceiptId.',
        {
          expected:
            packet002Transfer.resolutionReceiptId,

          actual:
            frameResolutionReceiptId
        }
      )
    );
  }

  if (
    !arraysEqual(
      frameSourceObjectIds,
      sourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_SOURCE_OBJECT_PROVENANCE_MISMATCH',
        'Aggregate-frame sourceObjectIds must match Packet 002 sourceObjectIds.',
        {
          expected:
            sourceObjectIds,

          actual:
            frameSourceObjectIds
        }
      )
    );
  }

  if (
    !arraysEqual(
      frameSourceZoneIds,
      sourceZoneIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_SOURCE_ZONE_PROVENANCE_MISMATCH',
        'Aggregate-frame sourceZoneIds must match Packet 002 sourceZoneIds.',
        {
          expected:
            sourceZoneIds,

          actual:
            frameSourceZoneIds
        }
      )
    );
  }

  if (
    !arraysEqual(
      frameLatticeRegionIds,
      latticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'AGGREGATE_FRAME_LATTICE_PROVENANCE_MISMATCH',
        'Aggregate-frame latticeRegionIds must match Packet 002 latticeRegionIds.',
        {
          expected:
            latticeRegionIds,

          actual:
            frameLatticeRegionIds
        }
      )
    );
  }

  const standaloneProvenance =
    validatePrimitiveSourceProvenance({
      primitives:
        admittedPrimitives,

      sourceObjectIds,
      sourceZoneIds,
      latticeRegionIds,

      fieldPrefix:
        'packet002Transfer.admittedPrimitives'
    });

  issues.push(
    ...standaloneProvenance.issues
  );

  const aggregateProvenance =
    validatePrimitiveSourceProvenance({
      primitives:
        Array.isArray(aggregatePrimitives)
          ? aggregatePrimitives
          : [],

      sourceObjectIds,
      sourceZoneIds,
      latticeRegionIds,

      fieldPrefix:
        'packet002Transfer.aggregateFrameAdmissionRecord.primitives'
    });

  issues.push(
    ...aggregateProvenance.issues
  );

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues),

    requestId:
      normalizeString(
        packet002Transfer.requestId
      ),

    providerRequestId:
      normalizeString(
        packet002Transfer.providerRequestId
      ),

    resolutionReceiptId:
      normalizeString(
        packet002Transfer.resolutionReceiptId
      ),

    sourceObjectIds,
    sourceZoneIds,
    latticeRegionIds,

    admittedPrimitives,

    admittedPrimitiveIds:
      standaloneMembership.primitiveIds,

    aggregateFrameAdmissionRecord:
      aggregateFrame,

    aggregateFrameId:
      packetFrameId,

    bounds,
    toleranceContext
  });
}


/* ==========================================================================
 * 07 · COMPOSITOR-STATE SNAPSHOT VALIDATION
 * ========================================================================== */

function validateCompositorStateSnapshot(
  compositorStateSnapshot
) {
  const issues = [];

  if (!isPlainRecord(compositorStateSnapshot)) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'COMPOSITOR_STATE_SNAPSHOT_NOT_PLAIN_RECORD',
          'The compositor-state snapshot must be a strict plain-record object.',
          {
            field:
              'compositorState'
          }
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      compositorStateSnapshot,
      REQUIRED_COMPOSITOR_STATE_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_STATE_KEY_SURFACE_INVALID',
        'The compositor-state snapshot must contain exactly the declared fields.',
        {
          field:
            'compositorState',

          details:
            Object.freeze({
              unknownKeys:
                keyEvaluation.unknownKeys,

              missingKeys:
                keyEvaluation.missingKeys
            })
        }
      )
    );
  }

  if (
    !isPlainRecord(
      compositorStateSnapshot.camera
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_CAMERA_STATE_MISSING',
        'The compositor-state snapshot must contain a camera record.',
        {
          field:
            'compositorState.camera'
        }
      )
    );
  }

  if (
    !isPlainRecord(
      compositorStateSnapshot.viewport
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_VIEWPORT_STATE_MISSING',
        'The compositor-state snapshot must contain a viewport record.',
        {
          field:
            'compositorState.viewport'
        }
      )
    );
  }

  if (
    !isPlainRecord(
      compositorStateSnapshot.visibility
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_VISIBILITY_STATE_MISSING',
        'The compositor-state snapshot must contain a visibility record.',
        {
          field:
            'compositorState.visibility'
        }
      )
    );
  }

  if (
    !isPlainRecord(
      compositorStateSnapshot.inertia
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_INERTIA_STATE_MISSING',
        'The compositor-state snapshot must contain an inertia record.',
        {
          field:
            'compositorState.inertia'
        }
      )
    );
  }

  const revisions =
    compositorStateSnapshot.revisions;

  if (!isPlainRecord(revisions)) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_REVISIONS_MISSING',
        'The compositor-state snapshot must contain a revisions record.',
        {
          field:
            'compositorState.revisions'
        }
      )
    );
  }

  if (isPlainRecord(revisions)) {
    const revisionKeyEvaluation =
      evaluateExactKeySurface(
        revisions,
        REQUIRED_REVISION_KEYS
      );

    if (!revisionKeyEvaluation.ok) {
      issues.push(
        createBridgeIssue(
          'COMPOSITOR_REVISION_KEY_SURFACE_INVALID',
          'The compositor revisions record must contain exactly the declared revision fields.',
          {
            field:
              'compositorState.revisions',

            details:
              Object.freeze({
                unknownKeys:
                  revisionKeyEvaluation.unknownKeys,

                missingKeys:
                  revisionKeyEvaluation.missingKeys
              })
          }
        )
      );
    }

    for (
      const revisionKey
      of REQUIRED_REVISION_KEYS
    ) {
      if (
        !isNonNegativeSafeInteger(
          revisions[revisionKey]
        )
      ) {
        issues.push(
          createBridgeIssue(
            'COMPOSITOR_REVISION_INVALID',
            `Compositor ${revisionKey} revision must be a safe nonnegative integer.`,
            {
              field:
                `compositorState.revisions.${revisionKey}`,

              actual:
                revisions[revisionKey] ??
                null
            }
          )
        );
      }
    }
  }

  const viewportEvaluation =
    evaluateHEarth3DViewportCapacity(
      compositorStateSnapshot.viewport
    );

  if (
    !isPlainRecord(
      viewportEvaluation
    ) ||
    viewportEvaluation.eligible !==
      true
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_VIEWPORT_NOT_ELIGIBLE',
        'The compositor viewport is not eligible under capacity authority.',
        {
          field:
            'compositorState.viewport',

          details:
            viewportEvaluation ??
            null
        }
      )
    );
  }

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues),

    cameraStateSnapshot:
      compositorStateSnapshot.camera,

    viewportSnapshot:
      compositorStateSnapshot.viewport,

    visibilitySnapshot:
      compositorStateSnapshot.visibility,

    inertiaSnapshot:
      compositorStateSnapshot.inertia,

    revisions:
      isPlainRecord(revisions)
        ? deepFreeze({
            camera:
              revisions.camera,

            viewport:
              revisions.viewport,

            visibility:
              revisions.visibility,

            inertia:
              revisions.inertia,

            frame:
              revisions.frame
          })
        : null,

    viewportEvaluation
  });
}


/* ==========================================================================
 * 08 · RESOLVED CAMERA-POSE CORRESPONDENCE VALIDATION
 * ========================================================================== */

function validateResolvedCameraPoseCorrespondence({
  correspondenceSnapshot,
  compositorRevisions
}) {
  const issues = [];

  if (!isPlainRecord(correspondenceSnapshot)) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'RESOLVED_CAMERA_POSE_CORRESPONDENCE_NOT_RECORD',
          'resolvedCameraPoseCorrespondence must be a strict plain-record object.',
          {
            field:
              'resolvedCameraPoseCorrespondence'
          }
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      correspondenceSnapshot,
      REQUIRED_CAMERA_CORRESPONDENCE_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
      createBridgeIssue(
        'CAMERA_CORRESPONDENCE_KEY_SURFACE_INVALID',
        'resolvedCameraPoseCorrespondence must contain exactly the declared fields.',
        {
          field:
            'resolvedCameraPoseCorrespondence',

          details:
            Object.freeze({
              unknownKeys:
                keyEvaluation.unknownKeys,

              missingKeys:
                keyEvaluation.missingKeys
            })
        }
      )
    );
  }

  const sourceCameraRevision =
    correspondenceSnapshot
      .sourceCameraRevision;

  if (
    !isNonNegativeSafeInteger(
      sourceCameraRevision
    )
  ) {
    issues.push(
      createBridgeIssue(
        'SOURCE_CAMERA_REVISION_INVALID',
        'sourceCameraRevision must be a safe nonnegative integer.',
        {
          field:
            'resolvedCameraPoseCorrespondence.sourceCameraRevision',

          actual:
            sourceCameraRevision ??
            null
        }
      )
    );
  }

  if (
    isPlainRecord(compositorRevisions) &&
    sourceCameraRevision !==
      compositorRevisions.camera
  ) {
    issues.push(
      createBridgeIssue(
        'RESOLVED_CAMERA_POSE_REVISION_MISMATCH',
        'The resolved camera pose must be correlated to the captured compositor camera revision.',
        {
          field:
            'resolvedCameraPoseCorrespondence.sourceCameraRevision',

          expected:
            compositorRevisions.camera,

          actual:
            sourceCameraRevision
        }
      )
    );
  }

  const resolvedCameraPose =
    correspondenceSnapshot
      .resolvedCameraPose;

  if (!isPlainRecord(resolvedCameraPose)) {
    issues.push(
      createBridgeIssue(
        'RESOLVED_CAMERA_POSE_NOT_RECORD',
        'resolvedCameraPose must be a strict plain-record object.',
        {
          field:
            'resolvedCameraPoseCorrespondence.resolvedCameraPose'
        }
      )
    );
  }

  const capacityEvaluation =
    isPlainRecord(resolvedCameraPose)
      ? evaluateHEarth3DCameraPose(
          resolvedCameraPose
        )
      : null;

  if (
    !isPlainRecord(
      capacityEvaluation
    ) ||
    capacityEvaluation.eligible !==
      true
  ) {
    issues.push(
      createBridgeIssue(
        'RESOLVED_CAMERA_POSE_NOT_ELIGIBLE',
        'The resolved camera pose is not eligible under capacity authority.',
        {
          field:
            'resolvedCameraPoseCorrespondence.resolvedCameraPose',

          details:
            capacityEvaluation
        }
      )
    );
  }

  const normalizedResolvedCameraPose =
    normalizeResolvedCameraPose(
      resolvedCameraPose
    );

  const basisValidation =
    validateNormalizedCameraBasis(
      normalizedResolvedCameraPose
    );

  issues.push(
    ...basisValidation.issues
  );

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues),

    sourceCameraRevision,

    resolvedCameraPose,

    normalizedResolvedCameraPose:
      normalizedResolvedCameraPose
        ? deepFreeze(
            normalizedResolvedCameraPose
          )
        : null,

    capacityEvaluation
  });
}


/* ==========================================================================
 * 09 · PRESENTATION ASSIGNMENTS
 * ========================================================================== */

function buildWetSandPresentationAssignments({
  admittedPrimitives,
  sourceObjectIds
}) {
  const issues = [];

  const presentationBySourceObjectId =
    Object.freeze({
      OBJ_002_FOREGROUND_WET_SAND:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_WET_SAND',
          materialIntent:
            'WET_SAND'
        }),

      OBJ_005_SHORELINE_FOAM_LINE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_FOAM',
          materialIntent:
            'FOAM_CONTACT'
        }),

      OBJ_007_WATER_SURFACE_PLANE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_OPEN_WATER',
          materialIntent:
            'OPEN_WATER'
        })
    });

  const assignments =
    admittedPrimitives.map(
      (primitive) => {
        const primitiveId =
          extractPrimitiveId(
            primitive
          );

        const metadata =
          extractPrimitiveMetadata(
            primitive
          );

        const primitiveSourceObjectIds =
          canonicalUniqueStrings(
            metadata?.sourceObjectIds ?? [
              metadata?.sourceObjectId
            ]
          );

        const sourceObjectId =
          primitiveSourceObjectIds.length === 1
            ? primitiveSourceObjectIds[0]
            : null;

        const presentation =
          sourceObjectId
            ? presentationBySourceObjectId[
                sourceObjectId
              ] ?? null
            : null;

        if (!presentation) {
          issues.push(
            createBridgeIssue(
              'PRESENTATION_SOURCE_OBJECT_UNSUPPORTED',
              'No admitted-frame presentation mapping exists for this exact source object.',
              {
                field:
                  primitiveId,
                actual:
                  sourceObjectId
              }
            )
          );
        }

        return deepFreeze({
          primitiveId,
          sourceObjectId,

          presentationRole:
            'PRIMARY_ADMITTED_WET_SAND_SURFACE',

          renderLayer:
            presentation?.renderLayer ??
            'GROUND',

          materialReference:
            presentation?.materialReference ??
            'H_EARTH_MATERIAL_WET_SAND',

          materialIntent:
            presentation?.materialIntent ??
            'WET_SAND',

          materialReferenceAuthority:
            PRESENTATION_MATERIAL_REFERENCE_AUTHORITY,

          materialCreated:
            false,

          materialSourceAuthorityAltered:
            false,

          visibleEligible:
            true,

          interactionTargetId:
            sourceObjectId,

          geometryIdentityPreserved:
            true,

          sourceGeometryReconstructed:
            false,

          admissionRecordAltered:
            false,

          rendererResourceCreated:
            false
        });
      }
    );

  const admittedPrimitiveMembership =
    evaluatePrimitiveMembership(
      admittedPrimitives
    );

  const assignmentMembership =
    evaluatePrimitiveMembership(
      assignments
    );

  if (
    assignments.length !==
    admittedPrimitives.length
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_COUNT_MISMATCH',
        'There must be exactly one presentation assignment per admitted primitive.',
        {
          expected:
            admittedPrimitives.length,
          actual:
            assignments.length
        }
      )
    );
  }

  if (!assignmentMembership.ok) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_IDENTITY_INVALID',
        'Presentation assignment primitive IDs must be present and unique.',
        {
          details:
            assignmentMembership
        }
      )
    );
  } else if (
    admittedPrimitiveMembership.ok &&
    !arraysEqual(
      assignmentMembership.primitiveIds,
      admittedPrimitiveMembership.primitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_MEMBERSHIP_MISMATCH',
        'Presentation assignments must preserve admitted primitive membership exactly.',
        {
          expected:
            admittedPrimitiveMembership.primitiveIds,
          actual:
            assignmentMembership.primitiveIds
        }
      )
    );
  }

  const assignmentSourceObjectIds =
    canonicalUniqueStrings(
      assignments.map(
        (assignment) =>
          assignment.sourceObjectId
      )
    );

  if (
    !arraysEqual(
      assignmentSourceObjectIds,
      sourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_SOURCE_PROVENANCE_MISMATCH',
        'Presentation assignments must preserve exact source-object provenance.',
        {
          expected:
            sourceObjectIds,
          actual:
            assignmentSourceObjectIds
        }
      )
    );
  }

  assignments.forEach(
    (
      assignment,
      index
    ) => {
      const keyEvaluation =
        evaluateExactKeySurface(
          assignment,
          REQUIRED_PRESENTATION_ASSIGNMENT_KEYS
        );

      if (!keyEvaluation.ok) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_KEY_SURFACE_INVALID',
            'A presentation assignment must contain exactly the declared contract fields.',
            {
              field:
                `presentationAssignments[${index}]`,
              details:
                Object.freeze({
                  unknownKeys:
                    keyEvaluation.unknownKeys,
                  missingKeys:
                    keyEvaluation.missingKeys
                })
            }
          )
        );
      }
    }
  );

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues),
    assignments:
      deepFreeze(assignments)
  });
}

/* ==========================================================================
 * 10 · PUBLIC INPUT EVALUATION
 * ========================================================================== */

export function evaluateHEarth3DAdmittedGeometryFrameInput(
  input
) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      ok: false,

      status:
        'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_INPUT_REJECTED',

      issues: freezeIssues([
        createBridgeIssue(
          'BRIDGE_INPUT_NOT_PLAIN_RECORD',
          'Bridge input must be a strict plain-record object.'
        )
      ])
    });
  }

  const inputKeyEvaluation =
    evaluateExactKeySurface(
      input,
      REQUIRED_PUBLIC_INPUT_KEYS
    );

  if (!inputKeyEvaluation.ok) {
    issues.push(
      createBridgeIssue(
        'BRIDGE_INPUT_KEY_SURFACE_INVALID',
        'Bridge input must contain exactly the declared public input fields.',
        {
          details:
            Object.freeze({
              unknownKeys:
                inputKeyEvaluation.unknownKeys,

              missingKeys:
                inputKeyEvaluation.missingKeys
            })
        }
      )
    );
  }

  const packet002TransferOccurrenceId =
    normalizeString(
      input.packet002TransferOccurrenceId
    );

  if (!packet002TransferOccurrenceId) {
    issues.push(
      createBridgeIssue(
        'PACKET_002_TRANSFER_OCCURRENCE_ID_MISSING',
        'packet002TransferOccurrenceId is required as a caller-supplied correlation identity.',
        {
          field:
            'packet002TransferOccurrenceId'
        }
      )
    );
  }

  const compositorFrameOccurrenceId =
    normalizeString(
      input.compositorFrameOccurrenceId
    );

  if (!compositorFrameOccurrenceId) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_FRAME_OCCURRENCE_ID_MISSING',
        'compositorFrameOccurrenceId is required.',
        {
          field:
            'compositorFrameOccurrenceId'
        }
      )
    );
  }

  const presentationMode =
    normalizeString(
      input.presentationMode
    );

  if (
    !ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_MODE_NOT_ADMITTED',
        'The presentation mode is not one of the explicit admitted proof modes.',
        {
          field:
            'presentationMode',

          expected:
            ALLOWED_PRESENTATION_MODES,

          actual:
            presentationMode
        }
      )
    );
  }

  const packet002Validation =
    validatePacket002Transfer(
      input.packet002Transfer,
      presentationMode
    );

  issues.push(
    ...packet002Validation.issues
  );

  const compositorStateSnapshotResult =
    snapshotPlainValue(
      input.compositorState,
      'compositorState'
    );

  if (!compositorStateSnapshotResult.ok) {
    issues.push(
      compositorStateSnapshotResult.issue
    );
  }

  const compositorStateSnapshot =
    compositorStateSnapshotResult.ok
      ? compositorStateSnapshotResult.value
      : null;

  const compositorStateValidation =
    compositorStateSnapshot
      ? validateCompositorStateSnapshot(
          compositorStateSnapshot
        )
      : Object.freeze({
          ok: false,
          issues:
            EMPTY_FROZEN_ARRAY,
          revisions: null
        });

  issues.push(
    ...compositorStateValidation.issues
  );

  const cameraCorrespondenceSnapshotResult =
    snapshotPlainValue(
      input.resolvedCameraPoseCorrespondence,
      'resolvedCameraPoseCorrespondence'
    );

  if (!cameraCorrespondenceSnapshotResult.ok) {
    issues.push(
      cameraCorrespondenceSnapshotResult.issue
    );
  }

  const cameraCorrespondenceSnapshot =
    cameraCorrespondenceSnapshotResult.ok
      ? cameraCorrespondenceSnapshotResult.value
      : null;

  const cameraCorrespondenceValidation =
    cameraCorrespondenceSnapshot
      ? validateResolvedCameraPoseCorrespondence({
          correspondenceSnapshot:
            cameraCorrespondenceSnapshot,

          compositorRevisions:
            compositorStateValidation.revisions
        })
      : Object.freeze({
          ok: false,
          issues:
            EMPTY_FROZEN_ARRAY
        });

  issues.push(
    ...cameraCorrespondenceValidation.issues
  );

  const presentationEvaluation =
    packet002Validation.ok &&
    ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )
      ? buildWetSandPresentationAssignments({
          admittedPrimitives:
            packet002Validation.admittedPrimitives,

          sourceObjectIds:
            packet002Validation.sourceObjectIds
        })
      : Object.freeze({
          ok: false,
          issues:
            EMPTY_FROZEN_ARRAY,
          assignments:
            EMPTY_FROZEN_ARRAY
        });

  issues.push(
    ...presentationEvaluation.issues
  );

  return Object.freeze({
    ok:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_INPUT_ACCEPTED'
        : 'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_INPUT_REJECTED',

    packet002TransferOccurrenceId,

    packet002TransferOccurrenceIdOwnership:
      PACKET_002_OCCURRENCE_ID_OWNERSHIP,

    packet002OccurrenceIdentityAuthenticatedByProducer:
      false,

    compositorFrameOccurrenceId,

    presentationMode,

    packet002Validation,

    compositorStateSnapshot,

    compositorStateValidation,

    resolvedCameraPoseCorrespondenceSnapshot:
      cameraCorrespondenceSnapshot,

    resolvedCameraPoseCorrespondenceValidation:
      cameraCorrespondenceValidation,

    presentationEvaluation,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 11 · FRAME CONSTRUCTION
 * ========================================================================== */

function buildRejectedFrameResult(
  inputEvaluation
) {
  return Object.freeze({
    ok: false,

    status:
      'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_REJECTED',

    contractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    compositorFrameOccurrenceId:
      inputEvaluation
        ?.compositorFrameOccurrenceId ??
      null,

    packet002ContractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    packet002TransferOccurrenceId:
      inputEvaluation
        ?.packet002TransferOccurrenceId ??
      null,

    packet002TransferOccurrenceIdOwnership:
      PACKET_002_OCCURRENCE_ID_OWNERSHIP,

    packet002OccurrenceIdentityAuthenticatedByProducer:
      false,

    resolvedCameraPoseProducerAuthenticated:
      false,

    rendererConsumerEligibility:
      false,

    geometryIndexAuthority:
      false,

    compositorMutationAuthority:
      false,

    rendererAuthority:
      false,

    renderInstanceCreated:
      false,

    issues:
      inputEvaluation?.issues ??
      EMPTY_FROZEN_ARRAY
  });
}

function buildPostconditionRejectedFrameResult({
  inputEvaluation,
  issues
}) {
  return Object.freeze({
    ok: false,

    status:
      'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_POSTCONDITION_REJECTED',

    contractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    compositorFrameOccurrenceId:
      inputEvaluation.compositorFrameOccurrenceId,

    packet002ContractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    packet002TransferOccurrenceId:
      inputEvaluation.packet002TransferOccurrenceId,

    packet002TransferOccurrenceIdOwnership:
      PACKET_002_OCCURRENCE_ID_OWNERSHIP,

    packet002OccurrenceIdentityAuthenticatedByProducer:
      false,

    resolvedCameraPoseProducerAuthenticated:
      false,

    rendererConsumerEligibility:
      false,

    geometryIndexAuthority:
      false,

    compositorMutationAuthority:
      false,

    rendererAuthority:
      false,

    renderInstanceCreated:
      false,

    issues
  });
}

export function composeHEarth3DAdmittedGeometryFrame(
  input
) {
  const inputEvaluation =
    evaluateHEarth3DAdmittedGeometryFrameInput(
      input
    );

  if (!inputEvaluation.ok) {
    return buildRejectedFrameResult(
      inputEvaluation
    );
  }

  const packet002 =
    inputEvaluation.packet002Validation;

  const compositor =
    inputEvaluation.compositorStateValidation;

  const camera =
    inputEvaluation
      .resolvedCameraPoseCorrespondenceValidation;

  const revisions =
    compositor.revisions;

  const frame =
    deepFreeze({
      ok: true,

      status:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATUS,

      frameType:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_TYPE,

      contractId:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      schemaVersion:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SCHEMA_VERSION,

      sourceFile:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE,

      role:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_ROLE,

      compositorFrameOccurrenceId:
        inputEvaluation.compositorFrameOccurrenceId,

      compositorFrameOccurrenceIdentityOwnership:
        COMPOSITOR_FRAME_OCCURRENCE_OWNERSHIP,

      compositorFrameRevision:
        revisions.frame,

      packet002ContractId:
        H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

      packet002TransferOccurrenceId:
        inputEvaluation.packet002TransferOccurrenceId,

      packet002TransferOccurrenceIdOwnership:
        PACKET_002_OCCURRENCE_ID_OWNERSHIP,

      packet002OccurrenceIdentityAuthenticatedByProducer:
        false,

      packet002Status:
        EXPECTED_PACKET_002_STATUS,

      packet002Provisional:
        true,

      packet002DownstreamContractFrozen:
        false,

      packet002FinalDownstreamShapeClaimed:
        false,

      westContractId:
        H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

      capacityContractId:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      requestId:
        packet002.requestId,

      providerRequestId:
        packet002.providerRequestId,

      resolutionReceiptId:
        packet002.resolutionReceiptId,

      sourceObjectIds:
        packet002.sourceObjectIds,

      sourceZoneIds:
        packet002.sourceZoneIds,

      latticeRegionIds:
        packet002.latticeRegionIds,

      aggregateFrameId:
        packet002.aggregateFrameId,

      admittedPrimitiveIds:
        packet002.admittedPrimitiveIds,

      admittedPrimitives:
        packet002.admittedPrimitives,

      aggregateFrameAdmissionRecord:
        packet002.aggregateFrameAdmissionRecord,

      bounds:
        packet002.bounds,

      toleranceContext:
        packet002.toleranceContext,

      cameraStateSnapshot:
        compositor.cameraStateSnapshot,

      resolvedCameraPoseCorrespondence:
        deepFreeze({
          sourceCameraRevision:
            camera.sourceCameraRevision,

          resolvedCameraPose:
            camera.resolvedCameraPose
        }),

      resolvedCameraPoseOriginBinding:
        CAMERA_CORRESPONDENCE_OWNERSHIP,

      resolvedCameraPoseProducerAuthenticated:
        false,

      normalizedResolvedCameraPose:
        camera.normalizedResolvedCameraPose,

      rendererCameraPoseField:
        RENDERER_CAMERA_POSE_FIELD,

      viewportSnapshot:
        compositor.viewportSnapshot,

      visibilitySnapshot:
        compositor.visibilitySnapshot,

      inertiaSnapshot:
        compositor.inertiaSnapshot,

      revisions:
        deepFreeze({
          camera:
            revisions.camera,

          viewport:
            revisions.viewport,

          visibility:
            revisions.visibility,

          inertia:
            revisions.inertia,

          frame:
            revisions.frame
        }),

      presentationMode:
        inputEvaluation.presentationMode,

      presentationAssignments:
        inputEvaluation
          .presentationEvaluation
          .assignments,

      rendererConsumerEligibility:
        true,

      geometryConstructionAuthority:
        false,

      westAdmissionAuthority:
        false,

      geometryIndexAuthority:
        false,

      geometryIndexEntryId:
        null,

      compositorMutationAuthority:
        false,

      compositorRevisionAdvanced:
        false,

      compositorNodeIdentityCreated:
        false,

      compositorNodeId:
        null,

      rendererAuthority:
        false,

      rendererResourceCreated:
        false,

      renderInstanceCreated:
        false,

      renderInstanceId:
        null,

      materialCreated:
        false,

      materialSourceAuthorityAltered:
        false,

      sourceGeometryReconstructed:
        false,

      admittedCoordinatesAltered:
        false,

      admittedIndicesAltered:
        false,

      admittedBoundsAltered:
        false,

      admittedPrimitiveIdentityAltered:
        false,

      sourceProvenanceAltered:
        false,

      actionLegalityEstablished:
        false,

      runtimeActivated:
        false,

      cryptographicIntegrityAuthenticated:
        false,

      structuralCorrespondenceValidated:
        true,

      outputDeeplyFrozen:
        true,

      issues:
        EMPTY_FROZEN_ARRAY
    });

  const completedFrameValidation =
    validateConstructedFrame(frame);

  if (!completedFrameValidation.ok) {
    return buildPostconditionRejectedFrameResult({
      inputEvaluation,
      issues:
        completedFrameValidation.issues
    });
  }

  return frame;
}


/* ==========================================================================
 * 12 · COMPLETE PUBLIC FRAME VALIDATION
 * ========================================================================== */

function validatePresentationAssignmentsForFrame({
  value,
  sourceObjectIds
}) {
  const issues = [];

  const safeSourceObjectIds =
    isCanonicalStringArray(
      sourceObjectIds
    )
      ? sourceObjectIds
      : EMPTY_FROZEN_ARRAY;

  if (
    !Array.isArray(
      value.presentationAssignments
    ) ||
    value.presentationAssignments.length ===
      0
  ) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'PRESENTATION_ASSIGNMENTS_MISSING',
          'A lawful admitted-geometry frame requires presentation assignments.'
        )
      ])
    });
  }

  if (
    !Array.isArray(
      value.admittedPrimitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'ADMITTED_PRIMITIVE_IDS_MISSING',
        'Presentation validation requires admittedPrimitiveIds.'
      )
    );
  } else if (
    value.presentationAssignments.length !==
    value.admittedPrimitiveIds.length
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_COUNT_MISMATCH',
        'There must be exactly one presentation assignment per admitted primitive.',
        {
          expected:
            value.admittedPrimitiveIds.length,

          actual:
            value.presentationAssignments.length
        }
      )
    );
  }

  const assignmentMembership =
    evaluatePrimitiveMembership(
      value.presentationAssignments
    );

  if (!assignmentMembership.ok) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_IDENTITY_INVALID',
        'Presentation assignment primitive IDs must be present and unique.',
        {
          details:
            assignmentMembership
        }
      )
    );
  } else if (
    !arraysEqual(
      assignmentMembership.primitiveIds,
      value.admittedPrimitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_PRIMITIVE_MEMBERSHIP_MISMATCH',
        'Presentation assignment primitive IDs must match admittedPrimitiveIds.',
        {
          expected:
            value.admittedPrimitiveIds,

          actual:
            assignmentMembership.primitiveIds
        }
      )
    );
  }

  const expectedPresentationBySourceObjectId =
    Object.freeze({
      OBJ_002_FOREGROUND_WET_SAND:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_WET_SAND',
          materialIntent:
            'WET_SAND'
        }),

      OBJ_005_SHORELINE_FOAM_LINE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_FOAM',
          materialIntent:
            'FOAM_CONTACT'
        }),

      OBJ_007_WATER_SURFACE_PLANE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_OPEN_WATER',
          materialIntent:
            'OPEN_WATER'
        })
    });

  value.presentationAssignments.forEach(
    (
      assignment,
      index
    ) => {
      if (!isPlainRecord(assignment)) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_NOT_RECORD',
            'Each presentation assignment must be a strict plain-record object.',
            {
              field:
                `presentationAssignments[${index}]`
            }
          )
        );

        return;
      }

      const keyEvaluation =
        evaluateExactKeySurface(
          assignment,
          REQUIRED_PRESENTATION_ASSIGNMENT_KEYS
        );

      if (!keyEvaluation.ok) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_KEY_SURFACE_INVALID',
            'A presentation assignment must contain exactly the declared contract fields.',
            {
              field:
                `presentationAssignments[${index}]`,

              details:
                Object.freeze({
                  unknownKeys:
                    keyEvaluation.unknownKeys,

                  missingKeys:
                    keyEvaluation.missingKeys
                })
            }
          )
        );
      }

      if (
        !safeSourceObjectIds.includes(
          assignment.sourceObjectId
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_SOURCE_OBJECT_MISMATCH',
            'Presentation assignment sourceObjectId must belong to frame provenance.',
            {
              field:
                `presentationAssignments[${index}].sourceObjectId`,

              expected:
                safeSourceObjectIds,

              actual:
                assignment.sourceObjectId ??
                null
            }
          )
        );
      }

      const expectedPresentation =
        expectedPresentationBySourceObjectId[
          assignment.sourceObjectId
        ] ?? null;

      if (
        expectedPresentation === null ||
        assignment.presentationRole !==
          'PRIMARY_ADMITTED_WET_SAND_SURFACE' ||
        assignment.renderLayer !==
          expectedPresentation.renderLayer ||
        assignment.materialReference !==
          expectedPresentation.materialReference ||
        assignment.materialIntent !==
          expectedPresentation.materialIntent ||
        assignment.materialReferenceAuthority !==
          PRESENTATION_MATERIAL_REFERENCE_AUTHORITY ||
        assignment.materialCreated !==
          false ||
        assignment.materialSourceAuthorityAltered !==
          false ||
        assignment.visibleEligible !==
          true ||
        assignment.interactionTargetId !==
          assignment.sourceObjectId ||
        assignment.geometryIdentityPreserved !==
          true ||
        assignment.sourceGeometryReconstructed !==
          false ||
        assignment.admissionRecordAltered !==
          false ||
        assignment.rendererResourceCreated !==
          false
      ) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_CONTRACT_INVALID',
            'The presentation assignment does not satisfy the exact first-proof presentation contract.',
            {
              field:
                `presentationAssignments[${index}]`
            }
          )
        );
      }
    }
  );

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues)
  });
}

function validateConstructedFrame(
  value
) {
  const issues = [];

  if (!isPlainRecord(value)) {
    return Object.freeze({
      ok: false,

      issues: freezeIssues([
        createBridgeIssue(
          'FRAME_NOT_PLAIN_RECORD',
          'The admitted-geometry frame must be a strict plain-record object.'
        )
      ])
    });
  }

  const frameKeyEvaluation =
    evaluateExactKeySurface(
      value,
      REQUIRED_CONSTRUCTED_FRAME_KEYS
    );

  if (!frameKeyEvaluation.ok) {
    issues.push(
      createBridgeIssue(
        'FRAME_KEY_SURFACE_INVALID',
        'The admitted-geometry frame must contain exactly the declared contract fields.',
        {
          details:
            Object.freeze({
              unknownKeys:
                frameKeyEvaluation.unknownKeys,

              missingKeys:
                frameKeyEvaluation.missingKeys
            })
        }
      )
    );
  }

  if (value.ok !== true) {
    issues.push(
      createBridgeIssue(
        'FRAME_OK_FLAG_INVALID',
        'A lawful frame must expose ok === true.'
      )
    );
  }

  if (
    value.status !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATUS
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_STATUS_INVALID',
        'Frame status does not match the bridge contract.',
        {
          expected:
            H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATUS,

          actual:
            value.status ??
            null
        }
      )
    );
  }

  if (
    value.frameType !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_TYPE
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_TYPE_INVALID',
        'Frame type does not match the admitted-geometry compositor-frame type.'
      )
    );
  }

  if (
    value.contractId !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID ||
    value.schemaVersion !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SCHEMA_VERSION
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_CONTRACT_IDENTITY_INVALID',
        'Frame contract identity or schema version is invalid.'
      )
    );
  }

  if (
    value.sourceFile !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_SOURCE_FILE_INVALID',
        'Frame sourceFile does not match the bridge contract.',
        {
          expected:
            H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE,

          actual:
            value.sourceFile ??
            null
        }
      )
    );
  }

  if (
    value.role !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_ROLE
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_ROLE_INVALID',
        'Frame role does not match the bridge contract.',
        {
          expected:
            H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_ROLE,

          actual:
            value.role ??
            null
        }
      )
    );
  }

  if (
    !isNonEmptyString(
      value.compositorFrameOccurrenceId
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_FRAME_OCCURRENCE_ID_INVALID',
        'compositorFrameOccurrenceId must be a non-empty string.'
      )
    );
  }

  if (
    value.compositorFrameOccurrenceIdentityOwnership !==
    COMPOSITOR_FRAME_OCCURRENCE_OWNERSHIP
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_OCCURRENCE_OWNERSHIP_INVALID',
        'Compositor-frame occurrence ownership declaration is invalid.',
        {
          expected:
            COMPOSITOR_FRAME_OCCURRENCE_OWNERSHIP,

          actual:
            value
              .compositorFrameOccurrenceIdentityOwnership ??
            null
        }
      )
    );
  }

  if (
    !isNonNegativeSafeInteger(
      value.compositorFrameRevision
    )
  ) {
    issues.push(
      createBridgeIssue(
        'COMPOSITOR_FRAME_REVISION_INVALID',
        'compositorFrameRevision must be a safe nonnegative integer.'
      )
    );
  }

  if (
    value.packet002ContractId !==
    H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_PACKET_002_CONTRACT_INVALID',
        'Frame Packet 002 contract identity is invalid.'
      )
    );
  }

  if (
    !isNonEmptyString(
      value.packet002TransferOccurrenceId
    ) ||
    value.packet002TransferOccurrenceIdOwnership !==
      PACKET_002_OCCURRENCE_ID_OWNERSHIP ||
    value.packet002OccurrenceIdentityAuthenticatedByProducer !==
      false
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_PACKET_002_OCCURRENCE_CORRELATION_INVALID',
        'Frame Packet 002 occurrence-correlation fields are invalid.'
      )
    );
  }

  if (
    value.packet002Status !==
      EXPECTED_PACKET_002_STATUS ||
    value.packet002Provisional !==
      true ||
    value.packet002DownstreamContractFrozen !==
      false ||
    value.packet002FinalDownstreamShapeClaimed !==
      false
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_PACKET_002_STATE_INVALID',
        'Frame Packet 002 provisional-state fields are invalid.'
      )
    );
  }

  if (
    value.westContractId !==
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID ||
    value.capacityContractId !==
      H_EARTH_3D_CAPACITY_CONTRACT_ID
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_DEPENDENCY_CONTRACT_INVALID',
        'Frame West or capacity contract identity is invalid.'
      )
    );
  }

  for (
    const field
    of [
      'requestId',
      'providerRequestId',
      'resolutionReceiptId',
      'aggregateFrameId'
    ]
  ) {
    if (!isNonEmptyString(value[field])) {
      issues.push(
        createBridgeIssue(
          'FRAME_REQUIRED_IDENTITY_MISSING',
          `${field} must be a non-empty string.`,
          {
            field
          }
        )
      );
    }
  }

  for (
    const field
    of [
      'cameraStateSnapshot',
      'viewportSnapshot',
      'visibilitySnapshot',
      'inertiaSnapshot'
    ]
  ) {
    if (!isPlainRecord(value[field])) {
      issues.push(
        createBridgeIssue(
          'FRAME_COMPOSITOR_SNAPSHOT_FIELD_INVALID',
          `${field} must be a strict plain-record snapshot.`,
          {
            field
          }
        )
      );
    }
  }

  const rawFrameSourceObjectIds =
    value.sourceObjectIds;

  const rawFrameSourceZoneIds =
    value.sourceZoneIds;

  const rawFrameLatticeRegionIds =
    value.latticeRegionIds;

  if (
    !ALLOWED_PRESENTATION_MODES.includes(
      value.presentationMode
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_PRESENTATION_MODE_INVALID',
        'The constructed frame presentation mode is not one of the explicit admitted proof modes.'
      )
    );
  }

  const firstProofProvenance =
    validateProofProvenance({
      presentationMode:
        value.presentationMode,
      sourceObjectIds:
        rawFrameSourceObjectIds,

      sourceZoneIds:
        rawFrameSourceZoneIds,

      latticeRegionIds:
        rawFrameLatticeRegionIds
    });

  issues.push(
    ...firstProofProvenance.issues
  );

  const sourceObjectIds =
    isCanonicalStringArray(
      rawFrameSourceObjectIds
    )
      ? rawFrameSourceObjectIds
      : EMPTY_FROZEN_ARRAY;

  const sourceZoneIds =
    isCanonicalStringArray(
      rawFrameSourceZoneIds
    )
      ? rawFrameSourceZoneIds
      : EMPTY_FROZEN_ARRAY;

  const latticeRegionIds =
    isCanonicalStringArray(
      rawFrameLatticeRegionIds
    )
      ? rawFrameLatticeRegionIds
      : EMPTY_FROZEN_ARRAY;

  const standaloneMembership =
    evaluatePrimitiveMembership(
      value.admittedPrimitives
    );

  if (
    !standaloneMembership.ok ||
    !arraysEqual(
      standaloneMembership.primitiveIds,
      value.admittedPrimitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_STANDALONE_PRIMITIVE_MEMBERSHIP_INVALID',
        'Frame admittedPrimitives must match admittedPrimitiveIds exactly.'
      )
    );
  }

  if (
    Array.isArray(
      value.admittedPrimitives
    )
  ) {
    value.admittedPrimitives.forEach(
      (
        primitive,
        index
      ) => {
        if (
          !isHEarthAdmittedPrimitiveRecord(
            primitive
          ) ||
          primitive.aggregateFrameMember !==
            false
        ) {
          issues.push(
            createBridgeIssue(
              'FRAME_STANDALONE_PRIMITIVE_INVALID',
              'Each standalone frame primitive must be a lawful West record with aggregateFrameMember === false.',
              {
                field:
                  `admittedPrimitives[${index}]`
              }
            )
          );
        }
      }
    );
  }

  const aggregateFrame =
    value.aggregateFrameAdmissionRecord;

  if (
    !isHEarthAggregateFrameAdmissionRecord(
      aggregateFrame
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_RECORD_INVALID',
        'aggregateFrameAdmissionRecord must satisfy the public West validator.'
      )
    );
  }

  const expectedAggregateStatus =
    getAggregateFrameAdmittedStatus();

  if (
    aggregateFrame?.status !==
      expectedAggregateStatus ||
    aggregateFrame?.recordType !==
      'H_EARTH_WEST_ADMITTED_AGGREGATE_FRAME_RECORD' ||
    aggregateFrame?.admitted !==
      true ||
    aggregateFrame?.admissionAuthority !==
      'WEST'
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_ADMISSION_STATE_INVALID',
        'The aggregate-frame record does not preserve the required West admission state.'
      )
    );
  }

  if (
    normalizeString(
      aggregateFrame?.frameId
    ) !==
    normalizeString(
      value.aggregateFrameId
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_ID_MISMATCH',
        'aggregateFrameAdmissionRecord.frameId must equal aggregateFrameId.'
      )
    );
  }

  const aggregateMembership =
    evaluatePrimitiveMembership(
      aggregateFrame?.primitives
    );

  if (
    !aggregateMembership.ok ||
    !arraysEqual(
      aggregateMembership.primitiveIds,
      value.admittedPrimitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_PRIMITIVE_MEMBERSHIP_INVALID',
        'Aggregate-frame primitive membership must match admittedPrimitiveIds.'
      )
    );
  }

  if (
    Array.isArray(
      aggregateFrame?.primitives
    )
  ) {
    aggregateFrame.primitives.forEach(
      (
        primitive,
        index
      ) => {
        if (
          !isHEarthAdmittedPrimitiveRecord({
            ...primitive,
            aggregateFrameMember: false
          }) ||
          primitive.aggregateFrameMember !==
            true
        ) {
          issues.push(
            createBridgeIssue(
              'FRAME_AGGREGATE_PRIMITIVE_INVALID',
              'Each aggregate-frame primitive must be a lawful West record with aggregateFrameMember === true.',
              {
                field:
                  `aggregateFrameAdmissionRecord.primitives[${index}]`
              }
            )
          );
        }
      }
    );
  }

  if (
    Array.isArray(
      aggregateFrame?.primitiveIds
    )
  ) {
    if (
      canonicalUniqueStrings(
        aggregateFrame.primitiveIds
      ).length !==
        aggregateFrame.primitiveIds.length ||
      !arraysEqual(
        canonicalUniqueStrings(
          aggregateFrame.primitiveIds
        ),
        value.admittedPrimitiveIds
      )
    ) {
      issues.push(
        createBridgeIssue(
          'FRAME_AGGREGATE_PRIMITIVE_ID_LIST_INVALID',
          'Aggregate-frame primitiveIds must be duplicate-free and match canonical admittedPrimitiveIds regardless of lawful West insertion order.',
          {
            expected:
              value.admittedPrimitiveIds,

            actual:
              aggregateFrame.primitiveIds
          }
        )
      );
    }
  }

  if (
    Number.isSafeInteger(
      aggregateFrame?.primitiveCount
    ) &&
    aggregateFrame.primitiveCount !==
      aggregateFrame.primitives?.length
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_PRIMITIVE_COUNT_INVALID',
        'Aggregate-frame primitiveCount must match its primitive array.'
      )
    );
  }

  const toleranceContext =
    value.toleranceContext;

  if (
    toleranceContext !== null &&
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_TOLERANCE_CONTEXT_INVALID',
        'Frame toleranceContext is invalid.'
      )
    );
  }

  const frameBoundsValid =
    toleranceContext === null
      ? isHEarthAABB3D(
          value.bounds
        )
      : isHEarthAABB3D(
          value.bounds,
          toleranceContext
        );

  const aggregateBoundsValid =
    toleranceContext === null
      ? isHEarthAABB3D(
          aggregateFrame?.bounds
        )
      : isHEarthAABB3D(
          aggregateFrame?.bounds,
          toleranceContext
        );

  if (
    ALLOWED_PRESENTATION_MODES.includes(
      value.presentationMode
    ) &&
    (
      value.bounds?.empty !== false ||
      aggregateFrame?.bounds?.empty !== false
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_FIRST_PROOF_EMPTY_BOUNDS_REJECTED',
        'FIRST_ADMITTED_WET_SAND_PROOF requires nonempty frame and aggregate-frame bounds.',
        {
          expected:
            Object.freeze({
              frameBoundsEmpty:
                false,

              aggregateFrameBoundsEmpty:
                false
            }),

          actual:
            Object.freeze({
              frameBoundsEmpty:
                value.bounds?.empty ??
                null,

              aggregateFrameBoundsEmpty:
                aggregateFrame?.bounds?.empty ??
                null
            })
        }
      )
    );
  }

  if (
    !frameBoundsValid ||
    !aggregateBoundsValid ||
    !areAABB3DRecordsEquivalent(
      value.bounds,
      aggregateFrame?.bounds,
      toleranceContext,
      0
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_BOUNDS_CORRESPONDENCE_INVALID',
        'Frame bounds must correspond exactly to aggregate-frame bounds.'
      )
    );
  }

  const frameMetadata =
    extractFrameMetadata(
      aggregateFrame
    );

  if (
    !isCanonicalStringArray(
      frameMetadata?.sourceObjectIds
    ) ||
    !isCanonicalStringArray(
      frameMetadata?.sourceZoneIds
    ) ||
    !isCanonicalStringArray(
      frameMetadata?.latticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_PROVENANCE_ARRAY_NOT_CANONICAL',
        'Aggregate-frame provenance arrays must be canonical and duplicate-free.'
      )
    );
  }

  if (
    normalizeString(
      frameMetadata?.requestId
    ) !== value.requestId ||
    normalizeString(
      frameMetadata?.providerRequestId
    ) !== value.providerRequestId ||
    normalizeString(
      frameMetadata?.resolutionReceiptId
    ) !== value.resolutionReceiptId
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_REQUEST_PROVENANCE_INVALID',
        'Aggregate-frame request provenance must match frame provenance.'
      )
    );
  }

  if (
    !arraysEqual(
      frameMetadata?.sourceObjectIds,
      sourceObjectIds
    ) ||
    !arraysEqual(
      frameMetadata?.sourceZoneIds,
      sourceZoneIds
    ) ||
    !arraysEqual(
      frameMetadata?.latticeRegionIds,
      latticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_AGGREGATE_SOURCE_PROVENANCE_INVALID',
        'Aggregate-frame source provenance must match frame provenance.'
      )
    );
  }

  const standaloneProvenance =
    validatePrimitiveSourceProvenance({
      primitives:
        Array.isArray(value.admittedPrimitives)
          ? value.admittedPrimitives
          : [],

      sourceObjectIds,
      sourceZoneIds,
      latticeRegionIds,

      fieldPrefix:
        'admittedPrimitives'
    });

  issues.push(
    ...standaloneProvenance.issues
  );

  const aggregateProvenance =
    validatePrimitiveSourceProvenance({
      primitives:
        Array.isArray(aggregateFrame?.primitives)
          ? aggregateFrame.primitives
          : [],

      sourceObjectIds,
      sourceZoneIds,
      latticeRegionIds,

      fieldPrefix:
        'aggregateFrameAdmissionRecord.primitives'
    });

  issues.push(
    ...aggregateProvenance.issues
  );

  if (
    !isPlainRecord(value.revisions) ||
    !REQUIRED_REVISION_KEYS.every(
      (key) =>
        isNonNegativeSafeInteger(
          value.revisions[key]
        )
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_REVISIONS_INVALID',
        'Frame revisions must contain safe nonnegative component revisions.'
      )
    );
  }

  if (isPlainRecord(value.revisions)) {
    const revisionKeyEvaluation =
      evaluateExactKeySurface(
        value.revisions,
        REQUIRED_REVISION_KEYS
      );

    if (!revisionKeyEvaluation.ok) {
      issues.push(
        createBridgeIssue(
          'FRAME_REVISION_KEY_SURFACE_INVALID',
          'Frame revisions must contain exactly the declared fields.',
          {
            details:
              Object.freeze({
                unknownKeys:
                  revisionKeyEvaluation.unknownKeys,

                missingKeys:
                  revisionKeyEvaluation.missingKeys
              })
          }
        )
      );
    }
  }

  if (
    value.compositorFrameRevision !==
    value.revisions?.frame
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_REVISION_CORRESPONDENCE_INVALID',
        'compositorFrameRevision must equal revisions.frame.'
      )
    );
  }

  const cameraCorrespondence =
    value.resolvedCameraPoseCorrespondence;

  const cameraCorrespondenceKeyEvaluation =
    evaluateExactKeySurface(
      cameraCorrespondence,
      REQUIRED_CAMERA_CORRESPONDENCE_KEYS
    );

  if (!cameraCorrespondenceKeyEvaluation.ok) {
    issues.push(
      createBridgeIssue(
        'FRAME_CAMERA_CORRESPONDENCE_KEY_SURFACE_INVALID',
        'resolvedCameraPoseCorrespondence must contain exactly the declared fields.',
        {
          details:
            Object.freeze({
              unknownKeys:
                cameraCorrespondenceKeyEvaluation.unknownKeys,

              missingKeys:
                cameraCorrespondenceKeyEvaluation.missingKeys
            })
        }
      )
    );
  }

  if (
    !isPlainRecord(cameraCorrespondence) ||
    cameraCorrespondence.sourceCameraRevision !==
      value.revisions?.camera
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_CAMERA_REVISION_CORRESPONDENCE_INVALID',
        'Resolved camera-pose source revision must equal revisions.camera.'
      )
    );
  }

  if (
    value.resolvedCameraPoseOriginBinding !==
    CAMERA_CORRESPONDENCE_OWNERSHIP
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_CAMERA_ORIGIN_BINDING_INVALID',
        'Resolved-camera-pose origin binding declaration is invalid.',
        {
          expected:
            CAMERA_CORRESPONDENCE_OWNERSHIP,

          actual:
            value.resolvedCameraPoseOriginBinding ??
            null
        }
      )
    );
  }

  if (
    value.resolvedCameraPoseProducerAuthenticated !==
    false
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_CAMERA_PRODUCER_AUTHENTICATION_CLAIM_INVALID',
        'The bridge must not claim producer authentication for the resolved camera pose.',
        {
          expected:
            false,

          actual:
            value
              .resolvedCameraPoseProducerAuthenticated ??
            null
        }
      )
    );
  }

  const cameraCapacityEvaluation =
    isPlainRecord(
      cameraCorrespondence?.resolvedCameraPose
    )
      ? evaluateHEarth3DCameraPose(
          cameraCorrespondence.resolvedCameraPose
        )
      : null;

  if (
    !isPlainRecord(
      cameraCapacityEvaluation
    ) ||
    cameraCapacityEvaluation.eligible !==
      true
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_CAMERA_POSE_NOT_ELIGIBLE',
        'Frame resolved camera pose is not capacity-eligible.'
      )
    );
  }

  const renormalizedPose =
    normalizeResolvedCameraPose(
      cameraCorrespondence?.resolvedCameraPose
    );

  const basisValidation =
    validateNormalizedCameraBasis(
      renormalizedPose
    );

  issues.push(
    ...basisValidation.issues
  );

  if (
    !normalizedCameraPosesEqual(
      renormalizedPose,
      value.normalizedResolvedCameraPose,
      0
    )
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_NORMALIZED_CAMERA_POSE_MISMATCH',
        'normalizedResolvedCameraPose must correspond to resolvedCameraPoseCorrespondence.resolvedCameraPose.'
      )
    );
  }

  if (
    value.rendererCameraPoseField !==
    RENDERER_CAMERA_POSE_FIELD
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_RENDERER_CAMERA_POSE_FIELD_INVALID',
        'Renderer camera-pose field declaration is invalid.'
      )
    );
  }

  const viewportEvaluation =
    evaluateHEarth3DViewportCapacity(
      value.viewportSnapshot
    );

  if (
    !isPlainRecord(
      viewportEvaluation
    ) ||
    viewportEvaluation.eligible !==
      true
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_VIEWPORT_NOT_ELIGIBLE',
        'Frame viewport is not capacity-eligible.'
      )
    );
  }

  const presentationValidation =
    validatePresentationAssignmentsForFrame({
      value,
      sourceObjectIds
    });

  issues.push(
    ...presentationValidation.issues
  );

  if (
    value.geometryIndexEntryId !==
      null ||
    value.compositorNodeId !==
      null ||
    value.renderInstanceId !==
      null
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_PREMATURE_IDENTITY_PRESENT',
        'Frame must not contain premature index, compositor-node, or renderer-instance identity.'
      )
    );
  }

  if (
    value.materialCreated !==
      false ||
    value.materialSourceAuthorityAltered !==
      false
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_MATERIAL_AUTHORITY_FLAGS_INVALID',
        'The frame must not claim backend material creation or altered material-source authority.'
      )
    );
  }

  const requiredFalseFlags = [
    'geometryConstructionAuthority',
    'westAdmissionAuthority',
    'geometryIndexAuthority',
    'compositorMutationAuthority',
    'compositorRevisionAdvanced',
    'compositorNodeIdentityCreated',
    'rendererAuthority',
    'rendererResourceCreated',
    'renderInstanceCreated',
    'materialCreated',
    'materialSourceAuthorityAltered',
    'sourceGeometryReconstructed',
    'admittedCoordinatesAltered',
    'admittedIndicesAltered',
    'admittedBoundsAltered',
    'admittedPrimitiveIdentityAltered',
    'sourceProvenanceAltered',
    'actionLegalityEstablished',
    'runtimeActivated',
    'cryptographicIntegrityAuthenticated'
  ];

  for (const field of requiredFalseFlags) {
    if (value[field] !== false) {
      issues.push(
        createBridgeIssue(
          'FRAME_NON_AUTHORITY_FLAG_INVALID',
          `${field} must equal false.`,
          {
            field,

            expected:
              false,

            actual:
              value[field] ??
              null
          }
        )
      );
    }
  }

  if (
    value.rendererConsumerEligibility !==
      true ||
    value.structuralCorrespondenceValidated !==
      true ||
    value.outputDeeplyFrozen !==
      true
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_ELIGIBILITY_OR_CORRESPONDENCE_FLAG_INVALID',
        'Renderer eligibility and structural correspondence flags are invalid.'
      )
    );
  }

  if (
    !Array.isArray(value.issues) ||
    value.issues.length !== 0
  ) {
    issues.push(
      createBridgeIssue(
        'FRAME_ISSUES_NOT_EMPTY',
        'A successfully constructed frame must expose an empty issues array.'
      )
    );
  }

  if (!isDeeplyFrozen(value)) {
    issues.push(
      createBridgeIssue(
        'FRAME_NOT_DEEPLY_FROZEN',
        'The complete frame and all defining nested records must be deeply frozen.'
      )
    );
  }

  return Object.freeze({
    ok:
      issues.length === 0,

    issues:
      freezeIssues(issues)
  });
}

export function isHEarth3DAdmittedGeometryFrame(
  value
) {
  try {
    return validateConstructedFrame(
      value
    ).ok;
  } catch {
    return false;
  }
}


/* ==========================================================================
 * 13 · CLAIM CEILINGS
 * ========================================================================== */

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CLAIM_CEILINGS =
  deepFreeze({
    packet002ProducerOccurrenceAuthenticated:
      false,

    resolvedCameraPoseProducerAuthenticated:
      false,

    cameraRevisionCorrelationClaim:
      true,

    cryptographicIntegrityAuthenticated:
      false,

    geometryConstructionClaim:
      false,

    westAdmissionClaim:
      false,

    geometryIndexClaim:
      false,

    compositorMutationClaim:
      false,

    compositorRevisionAdvancementClaim:
      false,

    rendererMaterializationClaim:
      false,

    backendMaterialCreationClaim:
      false,

    renderInstanceClaim:
      false,

    runtimeActivationClaim:
      false,

    actionExecutionClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false
  });


/* ==========================================================================
 * 14 · STATIC CONTRACT AND RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SCHEMA_VERSION,

    file:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE,

    layer:
      'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

    role:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_ROLE,

    status:
      'NEW_BRIDGE_IMPLEMENTATION_CANDIDATE',

    directDependencies:
      deepFreeze({
        packet002:
          '../../../h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',

        geometryKernel:
          './render/geometry-kernel.js',

        capacity:
          './capacity.js'
      }),

    expectedPacket002ContractId:
      H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,

    expectedPacket002Status:
      EXPECTED_PACKET_002_STATUS,

    consumedWestContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    consumedCapacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    allowedPresentationModes:
      ALLOWED_PRESENTATION_MODES,

    requiredPublicInputKeys:
      REQUIRED_PUBLIC_INPUT_KEYS,

    requiredCompositorStateKeys:
      REQUIRED_COMPOSITOR_STATE_KEYS,

    requiredCameraCorrespondenceKeys:
      REQUIRED_CAMERA_CORRESPONDENCE_KEYS,

    requiredConstructedFrameKeys:
      REQUIRED_CONSTRUCTED_FRAME_KEYS,

    requiredPresentationAssignmentKeys:
      REQUIRED_PRESENTATION_ASSIGNMENT_KEYS,

    packet002TransferOccurrenceIdOwnership:
      PACKET_002_OCCURRENCE_ID_OWNERSHIP,

    packet002OccurrenceIdentityAuthenticatedByProducer:
      false,

    packet002SnapshotRequirement:
      'INPUT_PACKET_002_TRANSFER_MUST_ALREADY_BE_DEEPLY_FROZEN',

    packet002MutationLaw:
      'BRIDGE_EMBEDS_PRODUCER_OWNED_FROZEN_SNAPSHOTS_WITHOUT_FREEZING_CALLER_OWNED_MUTABLE_RECORDS',

    resolvedCameraPoseOriginBinding:
      CAMERA_CORRESPONDENCE_OWNERSHIP,

    resolvedCameraPoseProducerAuthenticated:
      false,

    rendererCameraPoseField:
      RENDERER_CAMERA_POSE_FIELD,

    compositorFrameOccurrenceIdentity:
      'CALLER_SUPPLIED_IDENTITY_BOUND_TO_BRIDGE_CONSTRUCTED_FRAME_ENVELOPE',

    compositorRevisionAuthority:
      'CONSUMED_FROM_COMPOSITOR_STATE_SNAPSHOT_NOT_ADVANCED',

    compositorStateSnapshotLaw:
      'SNAPSHOT_ONCE_VALIDATE_AND_DERIVE_EXCLUSIVELY_FROM_SNAPSHOT',

    snapshotReferencePolicy:
      'REPEATED_REFERENCES_REJECTED_EVEN_WHEN_ACYCLIC',

    revisionLaw:
      'CAMERA_VIEWPORT_VISIBILITY_INERTIA_AND_FRAME_REVISIONS_RECORDED_INDEPENDENTLY',

    cameraCorrespondenceLaw:
      'SOURCE_CAMERA_REVISION_MUST_EQUAL_CAPTURED_COMPOSITOR_CAMERA_REVISION',

    boundsValidationLaw:
      'VALIDATE_BOTH_AABB_RECORDS_WITH_THE_SAME_GEOMETRY_TOLERANCE_CONTEXT',

    boundsEquivalenceLaw:
      'COMPARE_ACTUAL_AABB_FIELDS_WITH_DEFAULT_SCALAR_TOLERANCE_ZERO',

    firstProofBoundsLaw:
      'PACKET_002_AND_AGGREGATE_FRAME_BOUNDS_MUST_BOTH_BE_NONEMPTY',

    membershipComparisonLaw:
      'COMPARE_BY_STABLE_PRIMITIVE_ID_NOT_OBJECT_IDENTITY',

    aggregatePrimitiveIdLaw:
      'AGGREGATE_PRIMITIVE_IDS_MUST_BE_CANONICAL_DUPLICATE_FREE_AND_EXACT',

    canonicalProvenanceLaw:
      'SOURCE_OBJECT_ZONE_AND_LATTICE_ARRAYS_MUST_BE_CANONICAL_DUPLICATE_FREE_AND_EXACT',

    firstProofProvenanceLaw:
      'EXACTLY_ONE_WET_SAND_SOURCE_OBJECT_ONE_INSPECTION_ZONE_AND_ONE_LATTICE_REGION',

    presentationAssignmentLaw:
      'PRESENTATION_LOCAL_METADATA_ONLY_NO_GEOMETRY_ADMISSION_OR_BACKEND_MATERIAL_MUTATION',

    presentationAssignmentCardinalityLaw:
      'EXACTLY_ONE_UNIQUE_PRESENTATION_ASSIGNMENT_PER_ADMITTED_PRIMITIVE',

    exactFrameKeySurfaceLaw:
      'ACTUAL_CONSTRUCTED_FRAME_KEYS_MUST_EQUAL_REQUIRED_CONSTRUCTED_FRAME_KEYS',

    exactPresentationAssignmentKeySurfaceLaw:
      'ACTUAL_PRESENTATION_ASSIGNMENT_KEYS_MUST_EQUAL_REQUIRED_PRESENTATION_ASSIGNMENT_KEYS',

    presentationAssignmentValueLaw:
      'EVERY_FIRST_PROOF_PRESENTATION_FIELD_MUST_MATCH_THE_DECLARED_VALUE_CONTRACT',

    materialReferenceAuthority:
      PRESENTATION_MATERIAL_REFERENCE_AUTHORITY,

    publicValidatorLaw:
      'TOTAL_BOOLEAN_COMPLETE_FRAME_CONTRACT_REVALIDATION',

    constructionPostconditionLaw:
      'CONSTRUCTED_FRAME_MUST_PASS_COMPLETE_PUBLIC_FRAME_VALIDATION_BEFORE_RETURN',

    boundary:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CLAIM_CEILINGS
  });

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATIC_DEFINITION_RECEIPT',

    receiptId:
      'H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_STATIC_DEFINITION_RECEIPT_STEP_034O_7',

    contractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_SOURCE_FILE,

    packet002ValidationDefined:
      true,

    packet002DeepFreezeRequirementDefined:
      true,

    packet002InputMutationProtectionDefined:
      true,

    packet002EmptyIssueRequirementDefined:
      true,

    westPrimitiveValidationDefined:
      true,

    aggregateFrameValidationDefined:
      true,

    aggregatePrimitiveIdDuplicateRejectionDefined:
      true,

    primitiveMembershipCorrespondenceDefined:
      true,

    canonicalDuplicateFreeProvenanceDefined:
      true,

    exactFirstProofProvenanceDefined:
      true,

    semanticBoundsCorrespondenceDefined:
      true,

    firstProofNonemptyBoundsDefined:
      true,

    oneTimeCompositorStateSnapshotDefined:
      true,

    exactCompositorStateKeyEqualityDefined:
      true,

    independentCompositorRevisionRecordingDefined:
      true,

    cameraRevisionCorrelationDefined:
      true,

    exactCameraCorrespondenceKeyEqualityDefined:
      true,

    resolvedCameraPoseCapacityValidationDefined:
      true,

    resolvedCameraBasisValidationDefined:
      true,

    viewportCapacityValidationDefined:
      true,

    presentationLocalMaterialReferenceDefined:
      true,

    presentationAssignmentCardinalityDefined:
      true,

    exactPresentationAssignmentKeyEqualityDefined:
      true,

    completePresentationAssignmentValueValidationDefined:
      true,

    exactConstructedFrameKeyEqualityDefined:
      true,

    compositorSnapshotFieldPresenceValidationDefined:
      true,

    immutableRendererConsumerFrameDefined:
      true,

    completePublicFrameValidatorDefined:
      true,

    totalBooleanPublicFrameValidatorDefined:
      true,

    constructionPostconditionValidationDefined:
      true,

    repeatedReferenceRejectionDocumented:
      true,

    packet002ProducerOccurrenceAuthenticationDefined:
      false,

    resolvedCameraPoseProducerAuthenticationDefined:
      false,

    cryptographicIntegrityAuthenticationDefined:
      false,

    moduleSyntaxVerified:
      false,

    importResolutionVerified:
      false,

    moduleInitializationVerified:
      false,

    isolatedBehaviorVerified:
      false,

    controlledAuditVerified:
      false,

    compositorIntegrationVerified:
      false,

    rendererConsumptionVerified:
      false,

    boundary:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CLAIM_CEILINGS
  });


/* ==========================================================================
 * 15 · PUBLIC GETTERS
 * ========================================================================== */

export function getHEarth3DAdmittedGeometryFrameContract() {
  return H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT;
}

export function getHEarth3DAdmittedGeometryFrameReceipt() {
  return H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_RECEIPT;
}

export function getHEarth3DAdmittedGeometryFrameBoundaryFlags() {
  return H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_BOUNDARY_FLAGS;
}

export function getHEarth3DAdmittedGeometryFrameClaimCeilings() {
  return H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CLAIM_CEILINGS;
}


/* ==========================================================================
 * 16 · AGGREGATE EXPORT
 * ========================================================================== */

export const H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_AGGREGATE =
  deepFreeze({
    contractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    contract:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT,

    receipt:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_RECEIPT,

    boundaryFlags:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CLAIM_CEILINGS,

    evaluateHEarth3DAdmittedGeometryFrameInput,

    composeHEarth3DAdmittedGeometryFrame,

    isHEarth3DAdmittedGeometryFrame,

    getHEarth3DAdmittedGeometryFrameContract,

    getHEarth3DAdmittedGeometryFrameReceipt,

    getHEarth3DAdmittedGeometryFrameBoundaryFlags,

    getHEarth3DAdmittedGeometryFrameClaimCeilings
  });

export default H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_AGGREGATE;
