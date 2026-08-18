/**
 * /showroom/globe/h-earth/compositor.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Authoritative corridor:
 *
 * PACKET_002_TRANSFER
 * → admitted-geometry-frame.js
 * → compositor-owned state correspondence and frame sequencing
 * → renderer.js
 *
 * Model-A authority corridor:
 *
 * PUBLIC SNAPSHOT
 * → EXACT ROOT SURFACE
 * → EXACT TYPE-SPECIFIC NESTED SURFACE
 * → IMMUTABLE TYPE-SPECIFIC AUTHORITY PROJECTION
 * → ONE AUTHORITATIVE EVALUATION
 * → EXACT NAMED DOMAIN RESULT
 * → COMPOSITOR-OWNED SEMANTICS
 * → IMMUTABLE MUTATION PLAN
 * → ATOMIC INTENT-OCCURRENCE TRANSACTION
 * → RECEIPT
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_VIEWPORT_CAPACITY,
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_INTERACTION_CAPACITY,
  evaluateHEarth3DViewportCapacity,
  evaluateHEarth3DCameraCapacity,
  evaluateHEarth3DInteractionIntent,
  getHEarth3DCapacityContract,
  getHEarth3DCapacityReceipt
} from './capacity.js';

import {
  H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,
  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,
  composeHEarth3DAdmittedGeometryFrame,
  isHEarth3DAdmittedGeometryFrame,
  getHEarth3DAdmittedGeometryFrameContract,
  getHEarth3DAdmittedGeometryFrameReceipt
} from './admitted-geometry-frame.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1';

export const H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION =
  5;

export const H_EARTH_3D_COMPOSITOR_SOURCE_FILE =
  '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/compositor.js';

export const H_EARTH_3D_COMPOSITOR_ROLE =
  'ADMITTED_GEOMETRY_CAMERA_VIEWPORT_VISIBILITY_AND_FRAME_SEQUENCE_COMPOSITION_AUTHORITY';

export const H_EARTH_3D_COMPOSITOR_STATUS =
  'MODEL_A_GROUND_OBSERVER_CAMERA_AUTHORITY_RENEWAL_CANDIDATE';

const RENEWS_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_3_CAMERA_VIEWPORT_FRAME_COMPOSITION_v1';

const PRIMARY_PRESENTATION_VISIBILITY_KEY =
  'PRIMARY_ADMITTED_WET_SAND_SURFACE';

const ROUTE_OVERLAY_VISIBILITY_KEY =
  'ROUTE_OVERLAY';

const ADMITTED_VISIBILITY_LAYER_IDS =
  Object.freeze([
    PRIMARY_PRESENTATION_VISIBILITY_KEY,
    ROUTE_OVERLAY_VISIBILITY_KEY
  ]);

const ADMITTED_PRESENTATION_MODES =
  Object.freeze([
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE
  ]);

const CAMERA_STATE_CAPACITY_CHECK_ID =
  'CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE';

const VIEWPORT_CAPACITY_CHECK_ID =
  'CONTROLLER_INTENT_VIEWPORT_ELIGIBLE';

const EMPTY_FROZEN_ARRAY =
  Object.freeze([]);

const AUTHORITY_STATUS =
  Object.freeze({
    NOT_EVALUATED:
      'NOT_EVALUATED',

    NOT_APPLICABLE:
      'NOT_APPLICABLE',

    ELIGIBLE:
      'ELIGIBLE',

    REJECTED:
      'REJECTED'
  });


/* ==========================================================================
 * 02 · GENERIC HELPERS
 * ========================================================================== */

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
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

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.length > 0
  );
}

function validateExactOccurrenceId(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim() === value
  )
    ? value
    : null;
}

function isCanonicalArrayIndexKey(key) {
  if (typeof key !== 'string') {
    return false;
  }

  const numericKey =
    Number(key);

  return (
    Number.isInteger(numericKey) &&
    numericKey >= 0 &&
    numericKey <= 4294967294 &&
    String(numericKey) === key
  );
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}

function toRadians(degrees) {
  return (
    degrees *
    Math.PI /
    180
  );
}

function toDegrees(radians) {
  return (
    radians *
    180 /
    Math.PI
  );
}

function normalizeAngleDegrees(
  degrees
) {
  let normalized =
    degrees % 360;

  if (normalized > 180) {
    normalized -= 360;
  }

  if (normalized < -180) {
    normalized += 360;
  }

  return normalized;
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
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (
      descriptor &&
      Object.prototype.hasOwnProperty.call(
        descriptor,
        'value'
      )
    ) {
      deepFreeze(
        descriptor.value,
        seen
      );
    }
  }

  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  return value;
}

function cloneKnownPlain(value) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(
      cloneKnownPlain
    );
  }

  const output = {};

  for (
    const [key, nestedValue]
    of Object.entries(value)
  ) {
    output[key] =
      cloneKnownPlain(
        nestedValue
      );
  }

  return output;
}

function cloneAndFreeze(value) {
  return deepFreeze(
    cloneKnownPlain(
      value
    )
  );
}

function discloseAuthorityEvaluation(
  authorityEvaluation
) {
  return authorityEvaluation;
}

function createCompositorIssue(
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
  return deepFreeze({
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
    issues.map(
      (issue) =>
        createCompositorIssue(
          issue.code,
          issue.message,
          issue
        )
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

function evaluateCompleteOwnKeySurface(
  value,
  requiredKeys
) {
  if (!isPlainRecord(value)) {
    return deepFreeze({
      ok: false,

      unknownKeys:
        EMPTY_FROZEN_ARRAY,

      missingKeys:
        Object.freeze([
          ...requiredKeys
        ]),

      symbolKeysPresent:
        false,

      nonEnumerableKeys:
        EMPTY_FROZEN_ARRAY,

      accessorKeys:
        EMPTY_FROZEN_ARRAY
    });
  }

  const ownKeys =
    Reflect.ownKeys(value);

  const stringKeys =
    ownKeys.filter(
      (key) =>
        typeof key === 'string'
    );

  const symbolKeys =
    ownKeys.filter(
      (key) =>
        typeof key === 'symbol'
    );

  const requiredKeySet =
    new Set(requiredKeys);

  const unknownKeys =
    stringKeys
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

  const nonEnumerableKeys = [];
  const accessorKeys = [];

  for (const key of stringKeys) {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (!descriptor) {
      continue;
    }

    if (descriptor.enumerable !== true) {
      nonEnumerableKeys.push(key);
    }

    if (
      typeof descriptor.get === 'function' ||
      typeof descriptor.set === 'function'
    ) {
      accessorKeys.push(key);
    }
  }

  nonEnumerableKeys.sort();
  accessorKeys.sort();

  return deepFreeze({
    ok:
      unknownKeys.length === 0 &&
      missingKeys.length === 0 &&
      symbolKeys.length === 0 &&
      nonEnumerableKeys.length === 0 &&
      accessorKeys.length === 0,

    unknownKeys:
      Object.freeze(unknownKeys),

    missingKeys:
      Object.freeze(missingKeys),

    symbolKeysPresent:
      symbolKeys.length > 0,

    nonEnumerableKeys:
      Object.freeze(
        nonEnumerableKeys
      ),

    accessorKeys:
      Object.freeze(
        accessorKeys
      )
  });
}

function isExactCapacityEligible(
  evaluation
) {
  return (
    isPlainRecord(evaluation) &&
    evaluation.eligible === true
  );
}

function findExactCapacityCheck(
  capacityEvaluation,
  requiredId
) {
  if (
    !isPlainRecord(capacityEvaluation) ||
    !Array.isArray(
      capacityEvaluation.checks
    )
  ) {
    return null;
  }

  return (
    capacityEvaluation.checks.find(
      (check) =>
        isPlainRecord(check) &&
        check.id === requiredId
    ) ??
    null
  );
}

function getExactCapacityDomainEvaluation(
  capacityEvaluation,
  requiredId
) {
  const check =
    findExactCapacityCheck(
      capacityEvaluation,
      requiredId
    );

  if (
    !check ||
    check.passed !== true ||
    !isPlainRecord(check.details)
  ) {
    return null;
  }

  return check.details;
}

function createCapacityRejectionIssue(
  field = 'intent'
) {
  return createCompositorIssue(
    'CAPACITY_AUTHORITY_REJECTED',
    'The authoritative capacity evaluator rejected the operation.',
    {
      field
    }
  );
}

function createPublicMutationReceipt({
  receiptType,
  accepted,
  materiallyChanged,
  status,
  authorityStatus,
  authorityEvaluation = null,
  authorityEligible = null,
  issues = EMPTY_FROZEN_ARRAY,
  operationFields = null
}) {
  const publicAuthorityEvaluation =
    discloseAuthorityEvaluation(
      authorityEvaluation
    );

  return deepFreeze({
    receiptType,

    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    accepted:
      accepted === true,

    materiallyChanged:
      materiallyChanged === true,

    status,

    authorityStatus,

    authorityEvaluation:
      publicAuthorityEvaluation,

    authorityEligible,

    capacityEvaluation:
      publicAuthorityEvaluation,

    capacityEligible:
      authorityEligible,

    issues:
      freezeIssues(
        issues
      ),

    ...(
      isPlainRecord(operationFields)
        ? operationFields
        : {}
    )
  });
}


/* ==========================================================================
 * 03 · STRICT PUBLIC SNAPSHOT
 * ========================================================================== */

function strictSnapshot(
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

        issue:
          createCompositorIssue(
            'NON_FINITE_NUMBER_REJECTED',
            'Non-finite numbers are not admitted in compositor public inputs.',
            {
              field:
                path,

              actual:
                value
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

      issue:
        createCompositorIssue(
          'UNSUPPORTED_PUBLIC_INPUT_VALUE_REJECTED',
          'The public input contains an unsupported value type.',
          {
            field:
              path,

            actual:
              typeof value
          }
        )
    };
  }

  if (seen.has(value)) {
    return {
      ok: false,

      issue:
        createCompositorIssue(
          'REPEATED_REFERENCE_OR_CYCLE_REJECTED',
          'Repeated references and cyclic structures are not admitted.',
          {
            field:
              path
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

          issue:
            createCompositorIssue(
              'SYMBOL_PROPERTY_REJECTED',
              'Symbol-keyed array properties are not admitted.',
              {
                field:
                  path
              }
            )
        };
      }

      if (key === 'length') {
        continue;
      }

      if (
        !isCanonicalArrayIndexKey(
          key
        )
      ) {
        return {
          ok: false,

          issue:
            createCompositorIssue(
              'ARRAY_CUSTOM_PROPERTY_REJECTED',
              'Only canonical array-index properties from 0 through 4294967294 are admitted.',
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

      if (
        !descriptor ||
        descriptor.enumerable !== true
      ) {
        return {
          ok: false,

          issue:
            createCompositorIssue(
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

          issue:
            createCompositorIssue(
              'ACCESSOR_PROPERTY_REJECTED',
              'Accessor-backed array properties are not admitted.',
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
        strictSnapshot(
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
      value:
        deepFreeze(clone)
    };
  }

  if (!isPlainRecord(value)) {
    return {
      ok: false,

      issue:
        createCompositorIssue(
          'NON_PLAIN_RECORD_REJECTED',
          'Only strict plain-record objects are admitted in public inputs.',
          {
            field:
              path
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

        issue:
          createCompositorIssue(
            'SYMBOL_PROPERTY_REJECTED',
            'Symbol-keyed object properties are not admitted.',
            {
              field:
                path
            }
          )
      };
    }

    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (
      !descriptor ||
      descriptor.enumerable !== true
    ) {
      return {
        ok: false,

        issue:
          createCompositorIssue(
            'NON_ENUMERABLE_PROPERTY_REJECTED',
            'Non-enumerable object properties are not admitted.',
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

        issue:
          createCompositorIssue(
            'ACCESSOR_PROPERTY_REJECTED',
            'Accessor-backed properties are not admitted.',
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
      strictSnapshot(
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
    value:
      deepFreeze(clone)
  };
}


/* ==========================================================================
 * 04 · VECTOR HELPERS
 * ========================================================================== */

function createVector(
  x = 0,
  y = 0,
  z = 0
) {
  return {
    x,
    y,
    z
  };
}

function isVector3(value) {
  return (
    isPlainRecord(value) &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.z)
  );
}

function cloneVector(vector) {
  return createVector(
    vector.x,
    vector.y,
    vector.z
  );
}

function addVector(
  left,
  right
) {
  return createVector(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
  );
}

function subtractVector(
  left,
  right
) {
  return createVector(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );
}

function scaleVector(
  vector,
  scalar
) {
  return createVector(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );
}

function getVectorLength(vector) {
  return Math.hypot(
    vector.x,
    vector.y,
    vector.z
  );
}

function normalizeVector(vector) {
  const length =
    getVectorLength(vector);

  if (
    !isFiniteNumber(length) ||
    length <= Number.EPSILON
  ) {
    return createVector(
      0,
      0,
      0
    );
  }

  return scaleVector(
    vector,
    1 / length
  );
}

function crossVector(
  left,
  right
) {
  return createVector(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );
}

function vectorsEqual(
  left,
  right
) {
  return (
    isVector3(left) &&
    isVector3(right) &&
    Object.is(left.x, right.x) &&
    Object.is(left.y, right.y) &&
    Object.is(left.z, right.z)
  );
}


/* ==========================================================================
 * 05 · CAPACITY CONSUMPTION SNAPSHOTS
 * ========================================================================== */

const CAPACITY_CONTRACT =
  getHEarth3DCapacityContract();

const CAPACITY_RECEIPT =
  getHEarth3DCapacityReceipt();

const ADMITTED_FRAME_CONTRACT =
  getHEarth3DAdmittedGeometryFrameContract();

const ADMITTED_FRAME_RECEIPT =
  getHEarth3DAdmittedGeometryFrameReceipt();

const IMPORTED_INITIAL_PROJECTION =
  H_EARTH_3D_CAMERA_CAPACITY
    .initialProjectionCandidate;

const IMPORTED_FUTURE_CONTROLLER_CAPACITY =
  H_EARTH_3D_CAMERA_CAPACITY
    .futureControllerCapacity;

const CONSUMED_CAPACITY_VALUES =
  deepFreeze({
    publicStageWorldBounds:
      cloneKnownPlain(
        H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
      ),

    viewportCapacity:
      cloneKnownPlain(
        H_EARTH_3D_VIEWPORT_CAPACITY
      ),

    interactionCapacity:
      cloneKnownPlain(
        H_EARTH_3D_INTERACTION_CAPACITY
      ),

    initialProjection:
      cloneKnownPlain(
        IMPORTED_INITIAL_PROJECTION
      ),

    positionBounds:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .positionBounds
      ),

    targetBounds:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .targetBounds
      ),

    yawDegrees:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .yawDegrees
      ),

    pitchDegrees:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .pitchDegrees
      ),

    verticalFovDegrees:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .verticalFovDegrees
      ),

    zoomScale:
      cloneKnownPlain(
        IMPORTED_FUTURE_CONTROLLER_CAPACITY
          .zoomScale
      )
  });

const POSITION_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .positionBounds;

const TARGET_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .targetBounds;

const YAW_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .yawDegrees;

const PITCH_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .pitchDegrees;

const FOV_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .verticalFovDegrees;

const ZOOM_SCALE_BOUNDS =
  CONSUMED_CAPACITY_VALUES
    .zoomScale;

const INTERACTION_CAPACITY =
  CONSUMED_CAPACITY_VALUES
    .interactionCapacity;

const CAPACITY_INITIAL_PROJECTION =
  CONSUMED_CAPACITY_VALUES
    .initialProjection;

const INITIAL_POSITION =
  cloneVector(
    CAPACITY_INITIAL_PROJECTION
      .position
  );

const INITIAL_TARGET =
  cloneVector(
    CAPACITY_INITIAL_PROJECTION
      .target
  );

const INITIAL_UP =
  cloneVector(
    CAPACITY_INITIAL_PROJECTION
      .up
  );

const INITIAL_OFFSET =
  subtractVector(
    INITIAL_POSITION,
    INITIAL_TARGET
  );

const INITIAL_DISTANCE =
  getVectorLength(
    INITIAL_OFFSET
  );

const INITIAL_YAW_DEGREES =
  toDegrees(
    Math.atan2(
      INITIAL_OFFSET.x,
      INITIAL_OFFSET.z
    )
  );

const INITIAL_PITCH_DEGREES =
  toDegrees(
    Math.asin(
      clamp(
        INITIAL_OFFSET.y /
          Math.max(
            INITIAL_DISTANCE,
            Number.EPSILON
          ),
        -1,
        1
      )
    )
  );


const GROUND_OBSERVER_EYE_HEIGHT =
  clamp(
    INITIAL_POSITION.y,
    POSITION_BOUNDS.yMin,
    POSITION_BOUNDS.yMax
  );

const GROUND_OBSERVER_INITIAL_ANCHOR =
  createVector(
    clamp(
      INITIAL_POSITION.x,
      Math.max(
        TARGET_BOUNDS.xMin,
        POSITION_BOUNDS.xMin
      ),
      Math.min(
        TARGET_BOUNDS.xMax,
        POSITION_BOUNDS.xMax
      )
    ),
    GROUND_OBSERVER_EYE_HEIGHT,
    clamp(
      INITIAL_POSITION.z,
      Math.max(
        TARGET_BOUNDS.zMin,
        POSITION_BOUNDS.zMin
      ),
      Math.min(
        TARGET_BOUNDS.zMax,
        POSITION_BOUNDS.zMax
      )
    )
  );

const GROUND_OBSERVER_PITCH_BOUNDS =
  deepFreeze({
    minimum:
      Math.max(
        PITCH_BOUNDS.minimum,
        -85
      ),
    maximum:
      Math.min(
        PITCH_BOUNDS.maximum,
        85
      )
  });

const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    1,
    Math.min(
      INITIAL_DISTANCE,
      16
    )
  );


/* ==========================================================================
 * 06 · PUBLIC SCHEMAS
 * ========================================================================== */

const REQUIRED_BRIDGE_COMPOSITOR_SNAPSHOT_KEYS =
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

const REQUIRED_FRAME_COMPOSITION_INPUT_KEYS =
  Object.freeze([
    'packet002Transfer',
    'packet002TransferOccurrenceId',
    'compositorFrameOccurrenceId',
    'presentationMode'
  ]);

const REQUIRED_VIEWPORT_INPUT_KEYS =
  Object.freeze([
    'widthPx',
    'heightPx',
    'pixelRatio'
  ]);

const REQUIRED_VISIBILITY_INPUT_KEYS =
  Object.freeze([
    PRIMARY_PRESENTATION_VISIBILITY_KEY,
    ROUTE_OVERLAY_VISIBILITY_KEY
  ]);

const REQUIRED_CAMERA_STATE_KEYS =
  Object.freeze([
    'yawDegrees',
    'pitchDegrees',
    'zoomScale',
    'target',
    'verticalFovDegrees',
    'nearPlane',
    'farPlane'
  ]);

const REQUIRED_TARGET_KEYS =
  Object.freeze([
    'x',
    'y',
    'z'
  ]);

const REQUIRED_INERTIA_VELOCITY_KEYS =
  Object.freeze([
    'mode',
    'yawVelocity',
    'pitchVelocity',
    'panHorizontalVelocity',
    'panVerticalVelocity',
    'panDepthVelocity',
    'zoomVelocity'
  ]);


/* ==========================================================================
 * 07 · BOUNDARY FLAGS
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS =
  deepFreeze({
    ownsCameraCompositionState: true,
    ownsViewportCompositionState: true,
    ownsPresentationVisibilityState: true,
    ownsNavigationConstraints: true,
    ownsIntentEvaluation: true,
    ownsInertiaState: true,
    ownsIndependentComponentRevisions: true,
    ownsFrameRevisionSequencing: true,
    ownsResolvedCameraPoseCorrespondence: true,
    ownsCompositorReceipts: true,
    ownsAdmittedFrameCompositionInvocation: true,
    ownsThinRendererHandoffEnvelope: true,

    consumesAuthoritativeInteractionEvaluator: true,
    consumesAuthoritativeCameraEvaluator: true,
    consumesAuthoritativeViewportEvaluator: true,
    consumesAuthorityNormalizedCameraState: true,
    consumesAuthorityNormalizedViewportState: true,

    exactCapacityCheckIdAccess: true,
    exactCapacityEligibilityLaw: true,
    exactCapacityDomainExtraction: true,
    exactNormalizedViewportConsumption: true,

    oneCapacityProjectionPerIntentType: true,
    oneCapacityEvaluationPerPublicIntentOccurrence: true,

    directCameraProjectionIdentitySeparated: true,
    directCameraProjectionFieldMinimal: true,

    retainsOriginalAuthorityEvaluationInternally: true,
    publicAuthorityEvaluationPreservesOriginalIdentity: true,
    compatibilityAuthorityFieldsShareIdentity: true,

    mutationReceiptsHaveStableAuthorityRoot: true,
    intentOperationsProduceMutationPlans: true,
    intentOccurrenceCommitIsAtomic: true,

    reconstructsCapacityLawLocally: false,
    mutatesCapacityProjection: false,
    retainsCapacityProjectionAsCompositorState: false,

    directCameraAdministrativeCapacityEvaluation: true,
    directViewportAdministrativeCapacityEvaluation: true,
    directStartInertiaAdministrativeCapacityEvaluation: true,
    directVisibilityAdministrativeCapacityEvaluation: false,

    snapshotsPublicMutationInputsStrictly: true,
    snapshotsDirectPublicEvaluatorInputsStrictly: true,
    snapshotsDirectPublicCameraPoseResolverInputsStrictly: true,
    requiresExplicitRevisionForExplicitCameraPoseResolution: true,

    frameCompositionUsesSingleFinalAuthorityBoundary: true,
    duplicateFrameViewportAuthorityEvaluation: false,
    duplicateFrameCameraPoseAuthorityEvaluation: false,

    preservesPacket002ProducerOwnedReference: true,
    deepFreezesPacket002Transfer: false,
    capturesCompositorStateOncePerComposition: true,

    frameCompositionRootCompleteOwnKeyValidation: true,
    frameCompositionRootAccessorRejection: true,
    frameCompositionRootNonEnumerableRejection: true,
    frameCompositionRootSymbolRejection: true,

    resolvedCameraPoseIncludesCameraRevision: true,
    resolvedCameraRevisionComesFromCapturedSnapshot: true,

    frameCompositionMutatesCompositorCompositionState: false,
    rendererHandoffMutatesCompositorCompositionState: false,
    frameCompositionMayUpdateReceiptLedger: true,
    rendererHandoffMayUpdateReceiptLedger: true,
    composeFrameAdvancesRevision: false,

    rejectedInertiaAdvancementMayStopInertiaFailClosed: true,

    ownsPacket002Production: false,
    authenticatesPacket002Occurrence: false,
    ownsSourceObjectResolution: false,
    ownsProviderConstruction: false,
    ownsSouthGeometryConstruction: false,
    ownsWestAdmission: false,
    ownsGeometryConstruction: false,
    ownsGeometryIndexing: false,
    ownsEnvironmentDescriptorGeometryComposition: false,

    mutatesAdmittedGeometry: false,
    mutatesAdmittedCoordinates: false,
    mutatesAdmittedIndices: false,
    mutatesAdmittedBounds: false,
    mutatesPacket002Transfer: false,

    ownsRendererProjectionMathematics: false,
    ownsRendererPrimitiveConstruction: false,
    ownsRendererResourceCreation: false,
    ownsBackendMaterialCreation: false,
    ownsRendererMountLifecycle: false,
    ownsDOMCSSMaterialization: false,

    runtimeActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  });


/* ==========================================================================
 * 08 · CAMERA, VIEWPORT, VISIBILITY, AND INERTIA CONTRACTS
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS =
  deepFreeze({
    yawDegrees:
      cloneKnownPlain(
        YAW_BOUNDS
      ),

    pitchDegrees:
      cloneKnownPlain(
        PITCH_BOUNDS
      ),

    zoomScale:
      cloneKnownPlain(
        ZOOM_SCALE_BOUNDS
      ),

    targetBounds:
      cloneKnownPlain(
        TARGET_BOUNDS
      ),

    positionBounds:
      cloneKnownPlain(
        POSITION_BOUNDS
      ),

    verticalFovDegrees:
      cloneKnownPlain(
        FOV_BOUNDS
      ),

    nearPlane:
      CAPACITY_INITIAL_PROJECTION
        .nearPlane,

    farPlane:
      CAPACITY_INITIAL_PROJECTION
        .farPlane,

    nearAndFarPlaneAuthority:
      'FIXED_CAPACITY_DERIVED_PROJECTION_VALUES',

    nearPlaneMutable:
      false,

    farPlaneMutable:
      false,

    distanceModel:
      'GROUND_OBSERVER_FIXED_EYE_HEIGHT_WITH_PINCH_FIELD_OF_VIEW_SCALING',

    positionViolationPolicy:
      'CONSUME_AUTHORITY_NORMALIZED_CAMERA_THEN_CLAMP_GROUND_OBSERVER_ANCHOR_AND_PITCH',

    capacityAuthority:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    finalFrameEligibilityAuthority:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID
  });

export const H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE =
  deepFreeze({
    yawDegrees:
      clamp(
        normalizeAngleDegrees(
          INITIAL_YAW_DEGREES
        ),
        YAW_BOUNDS.minimum,
        YAW_BOUNDS.maximum
      ),

    pitchDegrees:
      clamp(
        INITIAL_PITCH_DEGREES,
        PITCH_BOUNDS.minimum,
        PITCH_BOUNDS.maximum
      ),

    zoomScale:
      clamp(
        1,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      ),

    target:
      deepFreeze({
        x:
          clamp(
            GROUND_OBSERVER_INITIAL_ANCHOR.x,
            TARGET_BOUNDS.xMin,
            TARGET_BOUNDS.xMax
          ),

        y:
          clamp(
            GROUND_OBSERVER_INITIAL_ANCHOR.y,
            TARGET_BOUNDS.yMin,
            TARGET_BOUNDS.yMax
          ),

        z:
          clamp(
            GROUND_OBSERVER_INITIAL_ANCHOR.z,
            TARGET_BOUNDS.zMin,
            TARGET_BOUNDS.zMax
          )
      }),

    verticalFovDegrees:
      clamp(
        CAPACITY_INITIAL_PROJECTION
          .verticalFovDegrees,
        FOV_BOUNDS.minimum,
        FOV_BOUNDS.maximum
      ),

    nearPlane:
      CAPACITY_INITIAL_PROJECTION
        .nearPlane,

    farPlane:
      CAPACITY_INITIAL_PROJECTION
        .farPlane
  });

export const H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE =
  deepFreeze({
    widthPx: 0,
    heightPx: 0,
    pixelRatio: 1,
    aspectRatio: 0,
    orientation: 'UNRESOLVED',
    capacityStatus: 'UNRESOLVED'
  });

export const H_EARTH_3D_COMPOSITOR_INITIAL_VISIBILITY_STATE =
  deepFreeze({
    [PRIMARY_PRESENTATION_VISIBILITY_KEY]:
      true,

    [ROUTE_OVERLAY_VISIBILITY_KEY]:
      false
  });

export const H_EARTH_3D_COMPOSITOR_INERTIA_POLICY =
  deepFreeze({
    enabled: true,

    damping:
      INTERACTION_CAPACITY
        .inertiaDamping,

    minimumVelocity:
      INTERACTION_CAPACITY
        .inertiaMinimumVelocity,

    maximumFrames:
      INTERACTION_CAPACITY
        .inertiaMaximumFrames,

    invalidAdvancementPolicy:
      'REJECT_ADVANCEMENT_AND_STOP_INERTIA_FAIL_CLOSED'
  });

export const H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE =
  deepFreeze({
    active: false,
    mode: 'IDLE',

    yawVelocity: 0,
    pitchVelocity: 0,

    panHorizontalVelocity: 0,
    panVerticalVelocity: 0,
    panDepthVelocity: 0,

    zoomVelocity: 0,

    damping:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .damping,

    frameCount: 0,

    maximumFrames:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .maximumFrames,

    minimumVelocity:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .minimumVelocity
  });

export const H_EARTH_3D_COMPOSITOR_REVISION_LAW =
  deepFreeze({
    camera:
      'ADVANCE_ONCE_WHEN_EFFECTIVE_CAMERA_STATE_CHANGES',

    viewport:
      'ADVANCE_ONCE_WHEN_EFFECTIVE_VIEWPORT_STATE_CHANGES',

    visibility:
      'ADVANCE_ONCE_WHEN_EFFECTIVE_PRESENTATION_VISIBILITY_CHANGES',

    inertia:
      'ADVANCE_ONCE_WHEN_EFFECTIVE_INERTIA_STATE_CHANGES',

    frame:
      'ADVANCE_ONCE_PER_COMPLETED_PUBLIC_MUTATION_OPERATION_WHEN_ANY_RENDERER_RELEVANT_COMPONENT_MATERIALLY_CHANGES',

    intentOccurrence:
      'SEQUENCE_COMPONENT_STATE_COMPONENT_REVISIONS_FRAME_REVISION_AND_HISTORY_COMMIT_ATOMICALLY',

    composition:
      'FRAME_COMPOSITION_ADVANCES_NO_REVISIONS',

    rejectedInertiaAdvancement:
      'A_REJECTED_INERTIA_ADVANCEMENT_MAY_ADVANCE_INERTIA_AND_FRAME_REVISIONS_ONLY_TO_RECORD_FAIL_CLOSED_INERTIA_SHUTDOWN'
  });


/* ==========================================================================
 * 09 · INTENT TYPES, SURFACES, AND SAFE AUTHORITY PROJECTIONS
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_INTENT_TYPES =
  deepFreeze({
    orbit:
      'H_EARTH_COMPOSITOR_INTENT_ORBIT',

    pan:
      'H_EARTH_COMPOSITOR_INTENT_PAN',

    zoom:
      'H_EARTH_COMPOSITOR_INTENT_ZOOM',

    resetView:
      'H_EARTH_COMPOSITOR_INTENT_RESET_VIEW',

    setCameraState:
      'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE',

    setViewport:
      'H_EARTH_COMPOSITOR_INTENT_SET_VIEWPORT',

    setVisibleLayers:
      'H_EARTH_COMPOSITOR_INTENT_SET_VISIBLE_LAYERS',

    startInertia:
      'H_EARTH_COMPOSITOR_INTENT_START_INERTIA',

    advanceInertia:
      'H_EARTH_COMPOSITOR_INTENT_ADVANCE_INERTIA',

    stopInertia:
      'H_EARTH_COMPOSITOR_INTENT_STOP_INERTIA'
  });

const REQUIRED_INTENT_KEYS_BY_TYPE =
  deepFreeze({
    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit]:
      Object.freeze([
        'type',
        'yawDeltaDegrees',
        'pitchDeltaDegrees'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan]:
      Object.freeze([
        'type',
        'horizontalDelta',
        'verticalDelta',
        'depthDelta'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom]:
      Object.freeze([
        'type',
        'zoomScaleDelta'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView]:
      Object.freeze([
        'type'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState]:
      Object.freeze([
        'type',
        'cameraState'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport]:
      Object.freeze([
        'type',
        'viewport'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers]:
      Object.freeze([
        'type',
        'visibleLayerIds'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia]:
      Object.freeze([
        'type',
        'velocity'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia]:
      Object.freeze([
        'type'
      ]),

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia]:
      Object.freeze([
        'type'
      ])
  });

function evaluateNestedIntentSurface(
  intentSnapshot
) {
  const issues = [];

  switch (intentSnapshot.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      if (!isPlainRecord(intentSnapshot.cameraState)) {
        issues.push(
          createCompositorIssue(
            'CAMERA_STATE_NOT_RECORD',
            'cameraState must be a strict plain-record object.',
            {
              field:
                'cameraState'
            }
          )
        );

        break;
      }

      {
        const cameraKeys =
          evaluateExactKeySurface(
            intentSnapshot.cameraState,
            REQUIRED_CAMERA_STATE_KEYS
          );

        if (!cameraKeys.ok) {
          issues.push(
            createCompositorIssue(
              'CAMERA_STATE_KEY_SURFACE_INVALID',
              'cameraState must contain exactly the declared camera fields.',
              {
                details:
                  deepFreeze({
                    unknownKeys:
                      cameraKeys.unknownKeys,

                    missingKeys:
                      cameraKeys.missingKeys
                  })
              }
            )
          );
        }
      }

      if (!isPlainRecord(intentSnapshot.cameraState.target)) {
        issues.push(
          createCompositorIssue(
            'CAMERA_TARGET_NOT_RECORD',
            'cameraState.target must be a strict plain-record object.',
            {
              field:
                'cameraState.target'
            }
          )
        );
      } else {
        const targetKeys =
          evaluateExactKeySurface(
            intentSnapshot.cameraState.target,
            REQUIRED_TARGET_KEYS
          );

        if (!targetKeys.ok) {
          issues.push(
            createCompositorIssue(
              'CAMERA_TARGET_KEY_SURFACE_INVALID',
              'cameraState.target must contain exactly x, y, and z.',
              {
                details:
                  deepFreeze({
                    unknownKeys:
                      targetKeys.unknownKeys,

                    missingKeys:
                      targetKeys.missingKeys
                  })
              }
            )
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      if (!isPlainRecord(intentSnapshot.viewport)) {
        issues.push(
          createCompositorIssue(
            'VIEWPORT_NOT_RECORD',
            'viewport must be a strict plain-record object.',
            {
              field:
                'viewport'
            }
          )
        );

        break;
      }

      {
        const viewportKeys =
          evaluateExactKeySurface(
            intentSnapshot.viewport,
            REQUIRED_VIEWPORT_INPUT_KEYS
          );

        if (!viewportKeys.ok) {
          issues.push(
            createCompositorIssue(
              'VIEWPORT_KEY_SURFACE_INVALID',
              'viewport must contain exactly widthPx, heightPx, and pixelRatio.',
              {
                details:
                  deepFreeze({
                    unknownKeys:
                      viewportKeys.unknownKeys,

                    missingKeys:
                      viewportKeys.missingKeys
                  })
              }
            )
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      if (!Array.isArray(intentSnapshot.visibleLayerIds)) {
        issues.push(
          createCompositorIssue(
            'VISIBLE_LAYER_IDS_NOT_ARRAY',
            'visibleLayerIds must be an array.',
            {
              field:
                'visibleLayerIds'
            }
          )
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      {
        const evaluation =
          evaluateStartInertiaProjectionSafety(
            intentSnapshot.velocity
          );

        if (!evaluation.eligible) {
          issues.push(
            ...evaluation.issues
          );
        }
      }
      break;

    default:
      break;
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    issues:
      freezeIssues(issues)
  });
}

function createOrbitCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    yawDeltaDegrees:
      intentSnapshot.yawDeltaDegrees,

    pitchDeltaDegrees:
      intentSnapshot.pitchDeltaDegrees
  });
}

function createPanCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    horizontalDelta:
      intentSnapshot.horizontalDelta,

    verticalDelta:
      intentSnapshot.verticalDelta,

    depthDelta:
      intentSnapshot.depthDelta
  });
}

function createZoomCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    zoomScaleDelta:
      intentSnapshot.zoomScaleDelta
  });
}

function createResetViewCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type
  });
}

function createSetCameraStateCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    cameraState:
      cloneAndFreeze(
        intentSnapshot.cameraState
      )
  });
}

function createSetViewportCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    viewport:
      cloneAndFreeze(
        intentSnapshot.viewport
      )
  });
}

function createSetVisibleLayersCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    visibleLayerIds:
      Object.freeze([
        ...intentSnapshot.visibleLayerIds
      ])
  });
}

function createStartInertiaCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type,

    yawVelocity:
      intentSnapshot.velocity.yawVelocity,

    pitchVelocity:
      intentSnapshot.velocity.pitchVelocity,

    panHorizontalVelocity:
      intentSnapshot
        .velocity
        .panHorizontalVelocity,

    panVerticalVelocity:
      intentSnapshot
        .velocity
        .panVerticalVelocity,

    panDepthVelocity:
      intentSnapshot
        .velocity
        .panDepthVelocity,

    zoomVelocity:
      intentSnapshot.velocity.zoomVelocity
  });
}

function createAdvanceInertiaCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type
  });
}

function createStopInertiaCapacityProjection(
  intentSnapshot
) {
  return deepFreeze({
    type:
      intentSnapshot.type
  });
}

function createCapacityIntentProjection(
  intentSnapshot
) {
  switch (intentSnapshot.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      return createOrbitCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      return createPanCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      return createZoomCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
      return createResetViewCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      return createSetCameraStateCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      return createSetViewportCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      return createSetVisibleLayersCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      return createStartInertiaCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
      return createAdvanceInertiaCapacityProjection(
        intentSnapshot
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
      return createStopInertiaCapacityProjection(
        intentSnapshot
      );

    default:
      return null;
  }
}

function createDirectCameraCapacityProjection(
  cameraSnapshot
) {
  return deepFreeze({
    yawDegrees:
      cameraSnapshot.yawDegrees,

    pitchDegrees:
      cameraSnapshot.pitchDegrees,

    zoomScale:
      cameraSnapshot.zoomScale,

    target:
      deepFreeze({
        x:
          cameraSnapshot.target.x,

        y:
          cameraSnapshot.target.y,

        z:
          cameraSnapshot.target.z
      }),

    verticalFovDegrees:
      cameraSnapshot.verticalFovDegrees,

    nearPlane:
      cameraSnapshot.nearPlane,

    farPlane:
      cameraSnapshot.farPlane
  });
}


/* ==========================================================================
 * 10 · INTERNAL CONTROLLED STATE AND RECEIPT LEDGER
 * ========================================================================== */

const compositorState = {
  camera:
    cloneKnownPlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE
    ),

  viewport:
    cloneKnownPlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE
    ),

  visibility:
    cloneKnownPlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_VISIBILITY_STATE
    ),

  inertia:
    cloneKnownPlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE
    ),

  revisions: {
    camera: 0,
    viewport: 0,
    visibility: 0,
    inertia: 0,
    frame: 0
  },

  intentSequence: 0,

  lastAcceptedIntent: null,
  lastRejectedIntent: null
};

const compositorOperationalReceipts = {
  intent: null,
  camera: null,
  viewport: null,
  visibility: null,
  inertia: null,
  reset: null,
  frame: null,
  handoff: null
};


/* ==========================================================================
 * 11 · STATE EQUALITY
 * ========================================================================== */

function cameraStatesEqual(
  left,
  right
) {
  return (
    isPlainRecord(left) &&
    isPlainRecord(right) &&
    Object.is(
      left.yawDegrees,
      right.yawDegrees
    ) &&
    Object.is(
      left.pitchDegrees,
      right.pitchDegrees
    ) &&
    Object.is(
      left.zoomScale,
      right.zoomScale
    ) &&
    vectorsEqual(
      left.target,
      right.target
    ) &&
    Object.is(
      left.verticalFovDegrees,
      right.verticalFovDegrees
    ) &&
    Object.is(
      left.nearPlane,
      right.nearPlane
    ) &&
    Object.is(
      left.farPlane,
      right.farPlane
    )
  );
}

function viewportStatesEqual(
  left,
  right
) {
  return (
    isPlainRecord(left) &&
    isPlainRecord(right) &&
    Object.is(
      left.widthPx,
      right.widthPx
    ) &&
    Object.is(
      left.heightPx,
      right.heightPx
    ) &&
    Object.is(
      left.pixelRatio,
      right.pixelRatio
    ) &&
    Object.is(
      left.aspectRatio,
      right.aspectRatio
    ) &&
    left.orientation ===
      right.orientation &&
    left.capacityStatus ===
      right.capacityStatus
  );
}

function visibilityStatesEqual(
  left,
  right
) {
  return (
    isPlainRecord(left) &&
    isPlainRecord(right) &&
    left[
      PRIMARY_PRESENTATION_VISIBILITY_KEY
    ] ===
      right[
        PRIMARY_PRESENTATION_VISIBILITY_KEY
      ] &&
    left[
      ROUTE_OVERLAY_VISIBILITY_KEY
    ] ===
      right[
        ROUTE_OVERLAY_VISIBILITY_KEY
      ]
  );
}

function inertiaStatesEqual(
  left,
  right
) {
  return (
    isPlainRecord(left) &&
    isPlainRecord(right) &&
    left.active === right.active &&
    left.mode === right.mode &&
    Object.is(
      left.yawVelocity,
      right.yawVelocity
    ) &&
    Object.is(
      left.pitchVelocity,
      right.pitchVelocity
    ) &&
    Object.is(
      left.panHorizontalVelocity,
      right.panHorizontalVelocity
    ) &&
    Object.is(
      left.panVerticalVelocity,
      right.panVerticalVelocity
    ) &&
    Object.is(
      left.panDepthVelocity,
      right.panDepthVelocity
    ) &&
    Object.is(
      left.zoomVelocity,
      right.zoomVelocity
    ) &&
    Object.is(
      left.damping,
      right.damping
    ) &&
    left.frameCount ===
      right.frameCount &&
    left.maximumFrames ===
      right.maximumFrames &&
    Object.is(
      left.minimumVelocity,
      right.minimumVelocity
    )
  );
}


/* ==========================================================================
 * 12 · TRANSACTIONAL STATE COMMIT
 * ========================================================================== */

function commitCompositorMutation({
  nextCamera =
    compositorState.camera,

  nextViewport =
    compositorState.viewport,

  nextVisibility =
    compositorState.visibility,

  nextInertia =
    compositorState.inertia
}) {
  const cameraChanged =
    !cameraStatesEqual(
      compositorState.camera,
      nextCamera
    );

  const viewportChanged =
    !viewportStatesEqual(
      compositorState.viewport,
      nextViewport
    );

  const visibilityChanged =
    !visibilityStatesEqual(
      compositorState.visibility,
      nextVisibility
    );

  const inertiaChanged =
    !inertiaStatesEqual(
      compositorState.inertia,
      nextInertia
    );

  if (cameraChanged) {
    compositorState.camera =
      cloneKnownPlain(
        nextCamera
      );

    compositorState.revisions.camera += 1;
  }

  if (viewportChanged) {
    compositorState.viewport =
      cloneKnownPlain(
        nextViewport
      );

    compositorState.revisions.viewport += 1;
  }

  if (visibilityChanged) {
    compositorState.visibility =
      cloneKnownPlain(
        nextVisibility
      );

    compositorState.revisions.visibility += 1;
  }

  if (inertiaChanged) {
    compositorState.inertia =
      cloneKnownPlain(
        nextInertia
      );

    compositorState.revisions.inertia += 1;
  }

  const materiallyChanged =
    cameraChanged ||
    viewportChanged ||
    visibilityChanged ||
    inertiaChanged;

  if (materiallyChanged) {
    compositorState.revisions.frame += 1;
  }

  return deepFreeze({
    materiallyChanged,
    cameraChanged,
    viewportChanged,
    visibilityChanged,
    inertiaChanged,

    revisions:
      cloneKnownPlain(
        compositorState.revisions
      )
  });
}

function createCompositorIntentHistorySummary({
  sequence,
  evaluation,
  accepted,
  materiallyChanged
}) {
  return deepFreeze({
    sequence,

    intentType:
      evaluation.intent?.type ??
      null,

    authorityStatus:
      evaluation.authorityStatus,

    authorityEligible:
      evaluation.authorityEligible,

    localEligible:
      evaluation.localEligible === true,

    accepted:
      accepted === true,

    materiallyChanged:
      materiallyChanged === true
  });
}

function commitCompositorIntentOccurrence({
  mutationPlan,
  evaluation
}) {
  const nextSequence =
    compositorState.intentSequence +
    1;

  const cameraChanged =
    !cameraStatesEqual(
      compositorState.camera,
      mutationPlan.nextCamera
    );

  const viewportChanged =
    !viewportStatesEqual(
      compositorState.viewport,
      mutationPlan.nextViewport
    );

  const visibilityChanged =
    !visibilityStatesEqual(
      compositorState.visibility,
      mutationPlan.nextVisibility
    );

  const inertiaChanged =
    !inertiaStatesEqual(
      compositorState.inertia,
      mutationPlan.nextInertia
    );

  const materiallyChanged =
    cameraChanged ||
    viewportChanged ||
    visibilityChanged ||
    inertiaChanged;

  const nextRevisions = {
    camera:
      compositorState.revisions.camera +
      (
        cameraChanged
          ? 1
          : 0
      ),

    viewport:
      compositorState.revisions.viewport +
      (
        viewportChanged
          ? 1
          : 0
      ),

    visibility:
      compositorState.revisions.visibility +
      (
        visibilityChanged
          ? 1
          : 0
      ),

    inertia:
      compositorState.revisions.inertia +
      (
        inertiaChanged
          ? 1
          : 0
      ),

    frame:
      compositorState.revisions.frame +
      (
        materiallyChanged
          ? 1
          : 0
      )
  };

  const historySummary =
    createCompositorIntentHistorySummary({
      sequence:
        nextSequence,

      evaluation,

      accepted:
        mutationPlan.accepted,

      materiallyChanged
    });

  const preparedCamera =
    cloneKnownPlain(
      mutationPlan.nextCamera
    );

  const preparedViewport =
    cloneKnownPlain(
      mutationPlan.nextViewport
    );

  const preparedVisibility =
    cloneKnownPlain(
      mutationPlan.nextVisibility
    );

  const preparedInertia =
    cloneKnownPlain(
      mutationPlan.nextInertia
    );

  const preparedRevisions =
    cloneKnownPlain(
      nextRevisions
    );

  compositorState.camera =
    preparedCamera;

  compositorState.viewport =
    preparedViewport;

  compositorState.visibility =
    preparedVisibility;

  compositorState.inertia =
    preparedInertia;

  compositorState.revisions =
    preparedRevisions;

  compositorState.intentSequence =
    nextSequence;

  if (mutationPlan.accepted) {
    compositorState.lastAcceptedIntent =
      historySummary;
  } else {
    compositorState.lastRejectedIntent =
      historySummary;
  }

  return deepFreeze({
    sequence:
      nextSequence,

    materiallyChanged,

    cameraChanged,
    viewportChanged,
    visibilityChanged,
    inertiaChanged,

    revisions:
      cloneAndFreeze(
        nextRevisions
      ),

    historyDisposition:
      mutationPlan.accepted
        ? 'ACCEPTED_HISTORY_UPDATED'
        : 'REJECTED_HISTORY_UPDATED'
  });
}


/* ==========================================================================
 * 13 · CAMERA NORMALIZATION AND LOCAL EVALUATION
 * ========================================================================== */

function clampTarget(target) {
  return createVector(
    clamp(
      target.x,
      Math.max(
        TARGET_BOUNDS.xMin,
        POSITION_BOUNDS.xMin
      ),
      Math.min(
        TARGET_BOUNDS.xMax,
        POSITION_BOUNDS.xMax
      )
    ),
    GROUND_OBSERVER_EYE_HEIGHT,
    clamp(
      target.z,
      Math.max(
        TARGET_BOUNDS.zMin,
        POSITION_BOUNDS.zMin
      ),
      Math.min(
        TARGET_BOUNDS.zMax,
        POSITION_BOUNDS.zMax
      )
    )
  );
}

function deriveGroundObserverForward({
  yawDegrees,
  pitchDegrees
}) {
  const yawRadians =
    toRadians(
      normalizeAngleDegrees(
        yawDegrees
      )
    );

  const pitchRadians =
    toRadians(
      clamp(
        pitchDegrees,
        GROUND_OBSERVER_PITCH_BOUNDS.minimum,
        GROUND_OBSERVER_PITCH_BOUNDS.maximum
      )
    );

  const horizontalMagnitude =
    Math.cos(
      pitchRadians
    );

  return normalizeVector(
    createVector(
      -Math.sin(
        yawRadians
      ) *
        horizontalMagnitude,
      -Math.sin(
        pitchRadians
      ),
      -Math.cos(
        yawRadians
      ) *
        horizontalMagnitude
    )
  );
}

function deriveCameraPosition({
  yawDegrees,
  pitchDegrees,
  zoomScale,
  target
}) {
  const position =
    clampTarget(
      target
    );

  const forward =
    deriveGroundObserverForward({
      yawDegrees,
      pitchDegrees
    });

  const normalizedZoomScale =
    clamp(
      zoomScale,
      ZOOM_SCALE_BOUNDS.minimum,
      ZOOM_SCALE_BOUNDS.maximum
    );

  const effectiveVerticalFovDegrees =
    clamp(
      CAPACITY_INITIAL_PROJECTION
        .verticalFovDegrees *
        normalizedZoomScale,
      FOV_BOUNDS.minimum,
      FOV_BOUNDS.maximum
    );

  return {
    distance:
      GROUND_OBSERVER_LOOK_DISTANCE,
    position,
    lookTarget:
      addVector(
        position,
        scaleVector(
          forward,
          GROUND_OBSERVER_LOOK_DISTANCE
        )
      ),
    forward,
    effectiveVerticalFovDegrees
  };
}

function isPositionWithinBounds(
  position
) {
  return (
    position.x >=
      POSITION_BOUNDS.xMin &&
    position.x <=
      POSITION_BOUNDS.xMax &&
    position.y >=
      POSITION_BOUNDS.yMin &&
    position.y <=
      POSITION_BOUNDS.yMax &&
    position.z >=
      POSITION_BOUNDS.zMin &&
    position.z <=
      POSITION_BOUNDS.zMax
  );
}

function fitCameraToPositionBounds(
  candidate
) {
  const normalized = {
    ...candidate,
    yawDegrees:
      normalizeAngleDegrees(
        candidate.yawDegrees
      ),
    pitchDegrees:
      clamp(
        candidate.pitchDegrees,
        GROUND_OBSERVER_PITCH_BOUNDS.minimum,
        GROUND_OBSERVER_PITCH_BOUNDS.maximum
      ),
    target:
      clampTarget(
        candidate.target
      ),
    zoomScale:
      clamp(
        candidate.zoomScale,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      )
  };

  const derived =
    deriveCameraPosition(
      normalized
    );

  if (
    !isPositionWithinBounds(
      derived.position
    )
  ) {
    return {
      eligible: false,
      issue:
        createCompositorIssue(
          'GROUND_OBSERVER_POSITION_OUTSIDE_NAVIGATION_BOUNDS',
          'The ground observer anchor cannot be resolved inside compositor navigation bounds.',
          {
            actual:
              derived.position,
            expected:
              cloneKnownPlain(
                POSITION_BOUNDS
              )
          }
        )
    };
  }

  const adjusted =
    !Object.is(
      normalized.yawDegrees,
      candidate.yawDegrees
    ) ||
    !Object.is(
      normalized.pitchDegrees,
      candidate.pitchDegrees
    ) ||
    !Object.is(
      normalized.zoomScale,
      candidate.zoomScale
    ) ||
    !vectorsEqual(
      normalized.target,
      candidate.target
    );

  return {
    eligible: true,
    adjusted,
    adjustment:
      adjusted
        ? 'GROUND_OBSERVER_ANCHOR_PITCH_OR_ZOOM_CLAMPED'
        : null,
    cameraState:
      normalized,
    derived
  };
}

function constructCompositorCameraStateFromNormalizedAuthority(
  normalizedCameraState
) {
  const issues = [];

  if (
    !isPlainRecord(
      normalizedCameraState
    )
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'AUTHORITY_NORMALIZED_CAMERA_INVALID',

      cameraState:
        null,

      issues: freezeIssues([
        createCompositorIssue(
          'NORMALIZED_CAMERA_NOT_RECORD',
          'The authority-normalized camera state must be a strict plain record.'
        )
      ])
    });
  }

  const rootSurface =
    evaluateExactKeySurface(
      normalizedCameraState,
      REQUIRED_CAMERA_STATE_KEYS
    );

  if (!rootSurface.ok) {
    issues.push(
      createCompositorIssue(
        'NORMALIZED_CAMERA_KEY_SURFACE_INVALID',
        'The authority-normalized camera state does not contain the exact required surface.',
        {
          details:
            deepFreeze({
              unknownKeys:
                rootSurface.unknownKeys,

              missingKeys:
                rootSurface.missingKeys
            })
        }
      )
    );
  }

  if (
    !isPlainRecord(
      normalizedCameraState.target
    )
  ) {
    issues.push(
      createCompositorIssue(
        'NORMALIZED_CAMERA_TARGET_NOT_RECORD',
        'The authority-normalized camera target must be a strict plain record.'
      )
    );
  } else {
    const targetSurface =
      evaluateExactKeySurface(
        normalizedCameraState.target,
        REQUIRED_TARGET_KEYS
      );

    if (!targetSurface.ok) {
      issues.push(
        createCompositorIssue(
          'NORMALIZED_CAMERA_TARGET_SURFACE_INVALID',
          'The authority-normalized camera target must contain exactly x, y, and z.',
          {
            details:
              deepFreeze({
                unknownKeys:
                  targetSurface.unknownKeys,

                missingKeys:
                  targetSurface.missingKeys
              })
          }
        )
      );
    }
  }

  for (
    const [field, value]
    of [
      [
        'yawDegrees',
        normalizedCameraState.yawDegrees
      ],
      [
        'pitchDegrees',
        normalizedCameraState.pitchDegrees
      ],
      [
        'zoomScale',
        normalizedCameraState.zoomScale
      ],
      [
        'verticalFovDegrees',
        normalizedCameraState.verticalFovDegrees
      ],
      [
        'nearPlane',
        normalizedCameraState.nearPlane
      ],
      [
        'farPlane',
        normalizedCameraState.farPlane
      ],
      [
        'target.x',
        normalizedCameraState.target?.x
      ],
      [
        'target.y',
        normalizedCameraState.target?.y
      ],
      [
        'target.z',
        normalizedCameraState.target?.z
      ]
    ]
  ) {
    if (!isFiniteNumber(value)) {
      issues.push(
        createCompositorIssue(
          'NORMALIZED_CAMERA_FIELD_NOT_FINITE',
          `${field} must be finite.`,
          {
            field,

            actual:
              value ??
              null
          }
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'AUTHORITY_NORMALIZED_CAMERA_INVALID',

      cameraState:
        null,

      issues:
        freezeIssues(issues)
    });
  }

  const candidate = {
    yawDegrees:
      normalizedCameraState.yawDegrees,

    pitchDegrees:
      normalizedCameraState.pitchDegrees,

    zoomScale:
      normalizedCameraState.zoomScale,

    target:
      cloneVector(
        normalizedCameraState.target
      ),

    verticalFovDegrees:
      normalizedCameraState.verticalFovDegrees,

    nearPlane:
      normalizedCameraState.nearPlane,

    farPlane:
      normalizedCameraState.farPlane
  };

  const fit =
    fitCameraToPositionBounds(
      candidate
    );

  if (!fit.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'AUTHORITY_NORMALIZED_CAMERA_OUTSIDE_LOCAL_NAVIGATION_BOUNDS',

      cameraState:
        null,

      issues: freezeIssues([
        fit.issue
      ])
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      fit.adjusted
        ? 'AUTHORITY_NORMALIZED_CAMERA_LOCALLY_ADJUSTED'
        : 'AUTHORITY_NORMALIZED_CAMERA_ACCEPTED',

    cameraState:
      cloneAndFreeze(
        fit.cameraState
      ),

    derived:
      deepFreeze({
        distance:
          fit.derived.distance,

        position:
          deepFreeze(
            cloneVector(
              fit.derived.position
            )
          ),

        lookTarget:
          deepFreeze(
            cloneVector(
              fit.derived.lookTarget
            )
          ),

        forward:
          deepFreeze(
            cloneVector(
              fit.derived.forward
            )
          ),

        effectiveVerticalFovDegrees:
          fit.derived.effectiveVerticalFovDegrees
      }),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function evaluateCompositorCameraStateSnapshot(
  cameraCandidate
) {
  const issues = [];

  if (!isPlainRecord(cameraCandidate)) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues: freezeIssues([
        createCompositorIssue(
          'CAMERA_STATE_NOT_RECORD',
          'The camera state must be a strict plain-record object.'
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      cameraCandidate,
      REQUIRED_CAMERA_STATE_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
      createCompositorIssue(
        'CAMERA_STATE_KEY_SURFACE_INVALID',
        'The camera state must contain exactly the declared fields.',
        {
          details:
            deepFreeze({
              unknownKeys:
                keyEvaluation.unknownKeys,

              missingKeys:
                keyEvaluation.missingKeys
            })
        }
      )
    );
  }

  if (!isPlainRecord(cameraCandidate.target)) {
    issues.push(
      createCompositorIssue(
        'CAMERA_TARGET_NOT_RECORD',
        'Camera target must be a strict plain-record object.',
        {
          field:
            'target'
        }
      )
    );
  } else {
    const targetKeyEvaluation =
      evaluateExactKeySurface(
        cameraCandidate.target,
        REQUIRED_TARGET_KEYS
      );

    if (!targetKeyEvaluation.ok) {
      issues.push(
        createCompositorIssue(
          'CAMERA_TARGET_KEY_SURFACE_INVALID',
          'Camera target must contain exactly x, y, and z.',
          {
            details:
              deepFreeze({
                unknownKeys:
                  targetKeyEvaluation
                    .unknownKeys,

                missingKeys:
                  targetKeyEvaluation
                    .missingKeys
              })
          }
        )
      );
    }
  }

  const requiredNumbers = [
    ['yawDegrees', cameraCandidate.yawDegrees],
    ['pitchDegrees', cameraCandidate.pitchDegrees],
    ['zoomScale', cameraCandidate.zoomScale],
    ['verticalFovDegrees', cameraCandidate.verticalFovDegrees],
    ['nearPlane', cameraCandidate.nearPlane],
    ['farPlane', cameraCandidate.farPlane],
    ['target.x', cameraCandidate.target?.x],
    ['target.y', cameraCandidate.target?.y],
    ['target.z', cameraCandidate.target?.z]
  ];

  for (
    const [field, value]
    of requiredNumbers
  ) {
    if (!isFiniteNumber(value)) {
      issues.push(
        createCompositorIssue(
          'CAMERA_FIELD_NOT_FINITE',
          `${field} must be finite.`,
          {
            field,

            actual:
              value ??
              null
          }
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues:
        freezeIssues(issues)
    });
  }

  const fit =
    fitCameraToPositionBounds({
      yawDegrees:
        cameraCandidate.yawDegrees,

      pitchDegrees:
        cameraCandidate.pitchDegrees,

      zoomScale:
        cameraCandidate.zoomScale,

      target:
        cloneVector(
          cameraCandidate.target
        ),

      verticalFovDegrees:
        cameraCandidate.verticalFovDegrees,

      nearPlane:
        cameraCandidate.nearPlane,

      farPlane:
        cameraCandidate.farPlane
    });

  if (!fit.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues: freezeIssues([
        fit.issue
      ])
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      fit.adjusted
        ? 'CAMERA_STATE_ELIGIBLE_WITH_NAVIGATION_ADJUSTMENT'
        : 'CAMERA_STATE_ELIGIBLE',

    adjusted:
      fit.adjusted,

    adjustment:
      fit.adjustment ??
      null,

    cameraState:
      cloneAndFreeze(
        fit.cameraState
      ),

    derived:
      deepFreeze({
        distance:
          fit.derived.distance,

        position:
          deepFreeze(
            cloneVector(
              fit.derived.position
            )
          ),

        lookTarget:
          deepFreeze(
            cloneVector(
              fit.derived.lookTarget
            )
          ),

        forward:
          deepFreeze(
            cloneVector(
              fit.derived.forward
            )
          ),

        effectiveVerticalFovDegrees:
          fit.derived.effectiveVerticalFovDegrees
      }),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function evaluateHEarth3DCompositorCameraState(
  cameraCandidate
) {
  const snapshot =
    strictSnapshot(
      cameraCandidate,
      'cameraCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_STATE_NOT_ELIGIBLE',

      issues:
        freezeIssues([
          snapshot.issue
        ])
    });
  }

  return evaluateCompositorCameraStateSnapshot(
    snapshot.value
  );
}


/* ==========================================================================
 * 14 · RESOLVED CAMERA POSE
 * ========================================================================== */

function resolveCompositorCameraPoseSnapshot(
  cameraState,
  cameraRevision
) {
  if (
    !isNonNegativeSafeInteger(
      cameraRevision
    )
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_CAMERA_REVISION_NOT_RESOLVED',

      issues:
        freezeIssues([
          createCompositorIssue(
            'CAMERA_REVISION_INVALID',
            'Camera revision must be a nonnegative safe integer.',
            {
              field:
                'cameraRevision',

              actual:
                cameraRevision
            }
          )
        ])
    });
  }

  const evaluation =
    evaluateCompositorCameraStateSnapshot(
      cameraState
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_CAMERA_POSE_NOT_RESOLVED',

      issues:
        evaluation.issues
    });
  }

  const position =
    cloneVector(
      evaluation
        .derived
        .position
    );

  const target =
    cloneVector(
      evaluation
        .derived
        .lookTarget
    );

  const forward =
    normalizeVector(
      subtractVector(
        target,
        position
      )
    );

  const right =
    normalizeVector(
      crossVector(
        INITIAL_UP,
        forward
      )
    );

  const up =
    normalizeVector(
      crossVector(
        forward,
        right
      )
    );

  if (
    getVectorLength(forward) <=
      Number.EPSILON ||
    getVectorLength(right) <=
      Number.EPSILON ||
    getVectorLength(up) <=
      Number.EPSILON
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_CAMERA_BASIS_NOT_RESOLVED',

      issues: freezeIssues([
        createCompositorIssue(
          'CAMERA_BASIS_DEGENERATE',
          'The resolved camera basis is degenerate.'
        )
      ])
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      'COMPOSITOR_CAMERA_POSE_RESOLVED',

    cameraRevision,

    position:
      deepFreeze(position),

    target:
      deepFreeze(target),

    up:
      deepFreeze(up),

    verticalFovDegrees:
      evaluation
        .derived
        .effectiveVerticalFovDegrees,

    nearPlane:
      evaluation
        .cameraState
        .nearPlane,

    farPlane:
      evaluation
        .cameraState
        .farPlane,

    forward:
      deepFreeze(forward),

    right:
      deepFreeze(right),

    yawDegrees:
      evaluation
        .cameraState
        .yawDegrees,

    pitchDegrees:
      evaluation
        .cameraState
        .pitchDegrees,

    zoomScale:
      evaluation
        .cameraState
        .zoomScale,

    distance:
      evaluation
        .derived
        .distance
  });
}

export function resolveHEarth3DCompositorCameraPose(
  cameraState,
  cameraRevision
) {
  if (arguments.length === 0) {
    return resolveCompositorCameraPoseSnapshot(
      compositorState.camera,
      compositorState.revisions.camera
    );
  }

  const snapshot =
    strictSnapshot(
      cameraState,
      'cameraState'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_CAMERA_POSE_NOT_RESOLVED',

      issues:
        freezeIssues([
          snapshot.issue
        ])
    });
  }

  if (
    arguments.length < 2 ||
    !isNonNegativeSafeInteger(
      cameraRevision
    )
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_CAMERA_REVISION_NOT_RESOLVED',

      issues:
        freezeIssues([
          createCompositorIssue(
            'CAMERA_REVISION_REQUIRED_FOR_EXPLICIT_CAMERA_STATE',
            'An explicit camera state requires an explicit nonnegative camera revision.',
            {
              field:
                'cameraRevision',

              actual:
                cameraRevision ??
                null
            }
          )
        ])
    });
  }

  return resolveCompositorCameraPoseSnapshot(
    snapshot.value,
    cameraRevision
  );
}


/* ==========================================================================
 * 15 · EXACT VIEWPORT AUTHORITY CONSUMPTION
 * ========================================================================== */

function createViewportStateFromNormalizedCapacityOutput(
  normalizedViewport
) {
  if (
    !isPlainRecord(normalizedViewport) ||
    !isPositiveFiniteNumber(
      normalizedViewport.widthPx
    ) ||
    !isPositiveFiniteNumber(
      normalizedViewport.heightPx
    ) ||
    !isPositiveFiniteNumber(
      normalizedViewport.pixelRatio
    ) ||
    !isPositiveFiniteNumber(
      normalizedViewport.aspectRatio
    ) ||
    !isNonEmptyString(
      normalizedViewport.orientation
    ) ||
    normalizedViewport.capacityStatus !==
      'WITHIN_CAPACITY'
  ) {
    return null;
  }

  return deepFreeze({
    widthPx:
      normalizedViewport.widthPx,

    heightPx:
      normalizedViewport.heightPx,

    pixelRatio:
      normalizedViewport.pixelRatio,

    aspectRatio:
      normalizedViewport.aspectRatio,

    orientation:
      normalizedViewport.orientation,

    capacityStatus:
      normalizedViewport.capacityStatus
  });
}

function evaluateCompositorViewportFromAuthorityEvaluation(
  viewportCandidate,
  authorityEvaluation
) {
  if (
    !isExactCapacityEligible(
      authorityEvaluation
    )
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_AUTHORITY_NOT_ELIGIBLE',

      viewport:
        null,

      issues:
        freezeIssues([
          createCapacityRejectionIssue(
            'viewport'
          )
        ])
    });
  }

  const viewport =
    createViewportStateFromNormalizedCapacityOutput(
      authorityEvaluation
        .normalizedViewport
    );

  if (!viewport) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_AUTHORITY_NORMALIZATION_INVALID',

      viewport:
        null,

      issues:
        freezeIssues([
          createCompositorIssue(
            'AUTHORITY_NORMALIZED_VIEWPORT_INVALID',
            'The authority evaluation did not disclose a complete canonical normalizedViewport.'
          )
        ])
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      'VIEWPORT_AUTHORITY_NORMALIZATION_ACCEPTED',

    viewport,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function evaluateCompositorViewportSnapshot(
  viewportCandidate
) {
  if (!isPlainRecord(viewportCandidate)) {
    return {
      eligible: false,

      authorityProjection:
        null,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      localEvaluation:
        null,

      issues:
        freezeIssues([
          createCompositorIssue(
            'VIEWPORT_NOT_RECORD',
            'The viewport input must be a strict plain-record object.'
          )
        ])
    };
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      viewportCandidate,
      REQUIRED_VIEWPORT_INPUT_KEYS
    );

  if (!keyEvaluation.ok) {
    return {
      eligible: false,

      authorityProjection:
        null,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      localEvaluation:
        null,

      issues:
        freezeIssues([
          createCompositorIssue(
            'VIEWPORT_KEY_SURFACE_INVALID',
            'The viewport input must contain exactly widthPx, heightPx, and pixelRatio.',
            {
              details:
                deepFreeze({
                  unknownKeys:
                    keyEvaluation.unknownKeys,

                  missingKeys:
                    keyEvaluation.missingKeys
                })
            }
          )
        ])
    };
  }

  const authorityProjection =
    deepFreeze({
      widthPx:
        viewportCandidate.widthPx,

      heightPx:
        viewportCandidate.heightPx,

      pixelRatio:
        viewportCandidate.pixelRatio
    });

  const authorityEvaluation =
    evaluateHEarth3DViewportCapacity(
      authorityProjection
    );

  if (
    !isExactCapacityEligible(
      authorityEvaluation
    )
  ) {
    return {
      eligible: false,

      authorityProjection,

      authorityEvaluation,

      authorityEligible:
        false,

      localEvaluation:
        null,

      issues:
        freezeIssues([
          createCapacityRejectionIssue(
            'viewport'
          )
        ])
    };
  }

  const localEvaluation =
    evaluateCompositorViewportFromAuthorityEvaluation(
      viewportCandidate,
      authorityEvaluation
    );

  return {
    eligible:
      localEvaluation.eligible === true,

    authorityProjection,

    authorityEvaluation,

    authorityEligible:
      true,

    localEvaluation,

    issues:
      localEvaluation.issues
  };
}

export function evaluateHEarth3DCompositorViewport(
  viewportCandidate
) {
  const snapshot =
    strictSnapshot(
      viewportCandidate,
      'viewportCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_NOT_ELIGIBLE',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      capacityEvaluation:
        null,

      capacityEligible:
        null,

      issues:
        freezeIssues([
          snapshot.issue
        ])
    });
  }

  const result =
    evaluateCompositorViewportSnapshot(
      snapshot.value
    );

  const publicAuthorityEvaluation =
    discloseAuthorityEvaluation(
      result.authorityEvaluation
    );

  return deepFreeze({
    eligible:
      result.eligible,

    status:
      result.eligible
        ? 'VIEWPORT_ELIGIBLE'
        : 'VIEWPORT_NOT_ELIGIBLE',

    authorityStatus:
      result.authorityEvaluation === null
        ? AUTHORITY_STATUS.NOT_EVALUATED
        : result.authorityEligible
          ? AUTHORITY_STATUS.ELIGIBLE
          : AUTHORITY_STATUS.REJECTED,

    authorityEvaluation:
      publicAuthorityEvaluation,

    authorityEligible:
      result.authorityEligible,

    capacityEvaluation:
      publicAuthorityEvaluation,

    capacityEligible:
      result.authorityEligible,

    localEvaluation:
      result.localEvaluation,

    issues:
      result.issues
  });
}


/* ==========================================================================
 * 16 · VISIBILITY AND EXACT VISIBLE-LAYER TRANSLATION
 * ========================================================================== */

function evaluateCompositorVisibilitySnapshot(
  visibilityCandidate
) {
  const issues = [];

  if (!isPlainRecord(visibilityCandidate)) {
    return deepFreeze({
      eligible: false,

      status:
        'VISIBILITY_NOT_ELIGIBLE',

      issues: freezeIssues([
        createCompositorIssue(
          'VISIBILITY_NOT_RECORD',
          'The visibility input must be a strict plain-record object.'
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      visibilityCandidate,
      REQUIRED_VISIBILITY_INPUT_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
      createCompositorIssue(
        'VISIBILITY_KEY_SURFACE_INVALID',
        'The visibility input must contain exactly the declared presentation controls.',
        {
          details:
            deepFreeze({
              unknownKeys:
                keyEvaluation.unknownKeys,

              missingKeys:
                keyEvaluation.missingKeys
            })
        }
      )
    );
  }

  for (
    const field
    of REQUIRED_VISIBILITY_INPUT_KEYS
  ) {
    if (
      typeof visibilityCandidate[field] !==
      'boolean'
    ) {
      issues.push(
        createCompositorIssue(
          'VISIBILITY_FIELD_NOT_BOOLEAN',
          `${field} must be boolean.`,
          {
            field,

            actual:
              visibilityCandidate[field] ??
              null
          }
        )
      );
    }
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'VISIBILITY_ELIGIBLE'
        : 'VISIBILITY_NOT_ELIGIBLE',

    visibility:
      issues.length === 0
        ? deepFreeze({
            [PRIMARY_PRESENTATION_VISIBILITY_KEY]:
              visibilityCandidate[
                PRIMARY_PRESENTATION_VISIBILITY_KEY
              ],

            [ROUTE_OVERLAY_VISIBILITY_KEY]:
              visibilityCandidate[
                ROUTE_OVERLAY_VISIBILITY_KEY
              ]
          })
        : null,

    admittedGeometryMutated:
      false,

    presentationAssignmentMutated:
      false,

    rendererConsumptionRequired:
      true,

    issues:
      freezeIssues(issues)
  });
}

function evaluateVisibleLayerIdsSnapshot(
  visibleLayerIds
) {
  const issues = [];

  if (!Array.isArray(visibleLayerIds)) {
    return deepFreeze({
      eligible: false,

      status:
        'VISIBLE_LAYER_IDS_NOT_ELIGIBLE',

      visibleLayerIds: null,
      visibility: null,

      issues: freezeIssues([
        createCompositorIssue(
          'VISIBLE_LAYER_IDS_NOT_ARRAY',
          'visibleLayerIds must be an array.',
          {
            field:
              'visibleLayerIds'
          }
        )
      ])
    });
  }

  const admittedLayerIds = [];
  const seenLayerIds =
    new Set();

  for (
    let index = 0;
    index < visibleLayerIds.length;
    index += 1
  ) {
    const layerId =
      visibleLayerIds[index];

    if (!isNonEmptyString(layerId)) {
      issues.push(
        createCompositorIssue(
          'VISIBLE_LAYER_ID_INVALID',
          'Every visible layer identifier must be a non-empty exact string.',
          {
            field:
              `visibleLayerIds[${index}]`,

            actual:
              layerId ??
              null
          }
        )
      );

      continue;
    }

    if (
      !ADMITTED_VISIBILITY_LAYER_IDS.includes(
        layerId
      )
    ) {
      issues.push(
        createCompositorIssue(
          'VISIBLE_LAYER_ID_UNKNOWN',
          'The compositor does not own a visibility mapping for the exact requested layer identifier.',
          {
            field:
              `visibleLayerIds[${index}]`,

            expected:
              ADMITTED_VISIBILITY_LAYER_IDS,

            actual:
              layerId
          }
        )
      );

      continue;
    }

    if (seenLayerIds.has(layerId)) {
      issues.push(
        createCompositorIssue(
          'VISIBLE_LAYER_ID_DUPLICATE',
          'Duplicate visible layer identifiers are not admitted.',
          {
            field:
              `visibleLayerIds[${index}]`,

            actual:
              layerId
          }
        )
      );

      continue;
    }

    seenLayerIds.add(layerId);
    admittedLayerIds.push(layerId);
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'VISIBLE_LAYER_IDS_NOT_ELIGIBLE',

      visibleLayerIds:
        Object.freeze(
          admittedLayerIds
        ),

      visibility: null,

      issues:
        freezeIssues(issues)
    });
  }

  return deepFreeze({
    eligible: true,

    status:
      'VISIBLE_LAYER_IDS_ELIGIBLE',

    visibleLayerIds:
      Object.freeze(
        admittedLayerIds
      ),

    visibility:
      deepFreeze({
        [PRIMARY_PRESENTATION_VISIBILITY_KEY]:
          seenLayerIds.has(
            PRIMARY_PRESENTATION_VISIBILITY_KEY
          ),

        [ROUTE_OVERLAY_VISIBILITY_KEY]:
          seenLayerIds.has(
            ROUTE_OVERLAY_VISIBILITY_KEY
          )
      }),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function evaluateHEarth3DCompositorVisibility(
  visibilityCandidate
) {
  const snapshot =
    strictSnapshot(
      visibilityCandidate,
      'visibilityCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      eligible: false,

      status:
        'VISIBILITY_NOT_ELIGIBLE',

      issues:
        freezeIssues([
          snapshot.issue
        ])
    });
  }

  return evaluateCompositorVisibilitySnapshot(
    snapshot.value
  );
}


/* ==========================================================================
 * 17 · DIRECT ADMINISTRATIVE AUTHORITY PATHS
 * ========================================================================== */

function evaluateDirectCameraAdministrativeInput(
  cameraSnapshot
) {
  const cameraProjection =
    createDirectCameraCapacityProjection(
      cameraSnapshot
    );

  const authorityEvaluation =
    evaluateHEarth3DCameraCapacity(
      cameraProjection
    );

  if (
    !isExactCapacityEligible(
      authorityEvaluation
    )
  ) {
    return {
      eligible: false,

      authorityProjection:
        cameraProjection,

      authorityEvaluation,

      authorityEligible:
        false,

      localEvaluation:
        null,

      issues:
        freezeIssues([
          createCapacityRejectionIssue(
            'cameraCandidate'
          )
        ])
    };
  }

  const localEvaluation =
    constructCompositorCameraStateFromNormalizedAuthority(
      authorityEvaluation
        .normalizedCameraState
    );

  return {
    eligible:
      localEvaluation.eligible === true,

    authorityProjection:
      cameraProjection,

    authorityEvaluation,

    authorityEligible:
      true,

    localEvaluation,

    issues:
      localEvaluation.issues
  };
}

function evaluateStartInertiaProjectionSafety(
  velocitySnapshot
) {
  if (
    !isPlainRecord(
      velocitySnapshot
    )
  ) {
    return deepFreeze({
      eligible: false,

      issues: freezeIssues([
        createCompositorIssue(
          'INERTIA_VELOCITY_NOT_RECORD',
          'The inertia velocity input must be a strict plain record.'
        )
      ])
    });
  }

  const keySurface =
    evaluateExactKeySurface(
      velocitySnapshot,
      REQUIRED_INERTIA_VELOCITY_KEYS
    );

  if (!keySurface.ok) {
    return deepFreeze({
      eligible: false,

      issues: freezeIssues([
        createCompositorIssue(
          'INERTIA_VELOCITY_KEY_SURFACE_INVALID',
          'The inertia velocity input must contain exactly the declared fields.',
          {
            details:
              deepFreeze({
                unknownKeys:
                  keySurface.unknownKeys,

                missingKeys:
                  keySurface.missingKeys
              })
          }
        )
      ])
    });
  }

  return deepFreeze({
    eligible: true,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function evaluateDirectStartInertiaAdministrativeInput(
  velocitySnapshot
) {
  const structuralEvaluation =
    evaluateStartInertiaProjectionSafety(
      velocitySnapshot
    );

  if (!structuralEvaluation.eligible) {
    return {
      eligible: false,

      authorityProjection:
        null,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      localEvaluation:
        null,

      issues:
        structuralEvaluation.issues
    };
  }

  const authorityProjection =
    createStartInertiaCapacityProjection({
      type:
        H_EARTH_3D_COMPOSITOR_INTENT_TYPES
          .startInertia,

      velocity:
        velocitySnapshot
    });

  const authorityEvaluation =
    evaluateHEarth3DInteractionIntent(
      authorityProjection
    );

  if (
    !isExactCapacityEligible(
      authorityEvaluation
    )
  ) {
    return {
      eligible: false,

      authorityProjection,

      authorityEvaluation,

      authorityEligible:
        false,

      localEvaluation:
        null,

      issues:
        freezeIssues([
          createCapacityRejectionIssue(
            'velocityCandidate'
          )
        ])
    };
  }

  const localEvaluation =
    evaluateInertiaVelocity(
      velocitySnapshot
    );

  return {
    eligible:
      localEvaluation.eligible === true,

    authorityProjection,

    authorityEvaluation,

    authorityEligible:
      true,

    localEvaluation,

    issues:
      localEvaluation.issues
  };
}

function applyEvaluatedCameraStateInternally(
  localEvaluation
) {
  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.cameraState)
  ) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'CAMERA_UPDATE_REJECTED',

      evaluation:
        localEvaluation ??
        null,

      issues:
        localEvaluation?.issues ??
        EMPTY_FROZEN_ARRAY
    });
  }

  const transaction =
    commitCompositorMutation({
      nextCamera:
        localEvaluation.cameraState
    });

  return deepFreeze({
    accepted: true,

    updated:
      transaction.cameraChanged,

    materiallyChanged:
      transaction.materiallyChanged,

    status:
      transaction.cameraChanged
        ? 'CAMERA_STATE_UPDATED'
        : 'CAMERA_STATE_UNCHANGED',

    camera:
      cloneAndFreeze(
        compositorState.camera
      ),

    evaluation:
      localEvaluation,

    transaction,

    revisions:
      transaction.revisions,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function applyEvaluatedViewportInternally(
  localEvaluation
) {
  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.viewport)
  ) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'VIEWPORT_UPDATE_REJECTED',

      evaluation:
        localEvaluation ??
        null,

      issues:
        localEvaluation?.issues ??
        EMPTY_FROZEN_ARRAY
    });
  }

  const transaction =
    commitCompositorMutation({
      nextViewport:
        localEvaluation.viewport
    });

  return deepFreeze({
    accepted: true,

    updated:
      transaction.viewportChanged,

    materiallyChanged:
      transaction.materiallyChanged,

    status:
      transaction.viewportChanged
        ? 'VIEWPORT_STATE_UPDATED'
        : 'VIEWPORT_STATE_UNCHANGED',

    viewport:
      cloneAndFreeze(
        compositorState.viewport
      ),

    evaluation:
      localEvaluation,

    transaction,

    revisions:
      transaction.revisions,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function applyVisibilityInternally(
  visibilityCandidate
) {
  const evaluation =
    evaluateCompositorVisibilitySnapshot(
      visibilityCandidate
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'VISIBILITY_UPDATE_REJECTED',

      evaluation,

      issues:
        evaluation.issues
    });
  }

  const transaction =
    commitCompositorMutation({
      nextVisibility:
        evaluation.visibility
    });

  return deepFreeze({
    accepted: true,

    updated:
      transaction.visibilityChanged,

    materiallyChanged:
      transaction.materiallyChanged,

    status:
      transaction.visibilityChanged
        ? 'VISIBILITY_STATE_UPDATED'
        : 'VISIBILITY_STATE_UNCHANGED',

    visibility:
      cloneAndFreeze(
        compositorState.visibility
      ),

    admittedGeometryMutated:
      false,

    presentationAssignmentMutated:
      false,

    evaluation,
    transaction,

    revisions:
      transaction.revisions,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function setHEarth3DCompositorCameraState(
  cameraCandidate
) {
  const receiptType =
    'H_EARTH_3D_COMPOSITOR_CAMERA_RECEIPT';

  const snapshot =
    strictSnapshot(
      cameraCandidate,
      'cameraCandidate'
    );

  if (!snapshot.ok) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'CAMERA_UPDATE_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues: [
        snapshot.issue
      ],

      operationFields: {
        updated: false,
        evaluation: null,
        transaction: null,
        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const nestedSurface =
    evaluateNestedIntentSurface({
      type:
        H_EARTH_3D_COMPOSITOR_INTENT_TYPES
          .setCameraState,

      cameraState:
        snapshot.value
    });

  if (!nestedSurface.eligible) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'CAMERA_UPDATE_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues:
        nestedSurface.issues,

      operationFields: {
        updated: false,
        evaluation: null,
        transaction: null,
        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const evaluation =
    evaluateDirectCameraAdministrativeInput(
      snapshot.value
    );

  if (!evaluation.eligible) {
    const authorityStatus =
      evaluation.authorityEvaluation === null
        ? AUTHORITY_STATUS.NOT_EVALUATED
        : evaluation.authorityEligible
          ? AUTHORITY_STATUS.ELIGIBLE
          : AUTHORITY_STATUS.REJECTED;

    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'CAMERA_UPDATE_REJECTED',

      authorityStatus,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        evaluation.authorityEligible,

      issues:
        evaluation.issues,

      operationFields: {
        updated: false,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          evaluation.localEvaluation,

        transaction: null,

        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const operationResult =
    applyEvaluatedCameraStateInternally(
      evaluation.localEvaluation
    );

  const receipt =
    createPublicMutationReceipt({
      receiptType,

      accepted:
        operationResult.accepted,

      materiallyChanged:
        operationResult.materiallyChanged,

      status:
        operationResult.status,

      authorityStatus:
        AUTHORITY_STATUS.ELIGIBLE,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        true,

      issues:
        operationResult.issues,

      operationFields: {
        updated:
          operationResult.updated,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          operationResult.evaluation,

        transaction:
          operationResult.transaction,

        revisions:
          operationResult.revisions,

        camera:
          operationResult.camera
      }
    });

  compositorOperationalReceipts.camera =
    receipt;

  return receipt;
}

export function setHEarth3DCompositorViewport(
  viewportCandidate
) {
  const receiptType =
    'H_EARTH_3D_COMPOSITOR_VIEWPORT_RECEIPT';

  const snapshot =
    strictSnapshot(
      viewportCandidate,
      'viewportCandidate'
    );

  if (!snapshot.ok) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'VIEWPORT_UPDATE_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues: [
        snapshot.issue
      ],

      operationFields: {
        updated: false,
        evaluation: null,
        transaction: null,
        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const evaluation =
    evaluateCompositorViewportSnapshot(
      snapshot.value
    );

  if (!evaluation.eligible) {
    const authorityStatus =
      evaluation.authorityEvaluation === null
        ? AUTHORITY_STATUS.NOT_EVALUATED
        : evaluation.authorityEligible
          ? AUTHORITY_STATUS.ELIGIBLE
          : AUTHORITY_STATUS.REJECTED;

    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'VIEWPORT_UPDATE_REJECTED',

      authorityStatus,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        evaluation.authorityEligible,

      issues:
        evaluation.issues,

      operationFields: {
        updated: false,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          evaluation.localEvaluation,

        transaction: null,

        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const operationResult =
    applyEvaluatedViewportInternally(
      evaluation.localEvaluation
    );

  const receipt =
    createPublicMutationReceipt({
      receiptType,

      accepted:
        operationResult.accepted,

      materiallyChanged:
        operationResult.materiallyChanged,

      status:
        operationResult.status,

      authorityStatus:
        AUTHORITY_STATUS.ELIGIBLE,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        true,

      issues:
        operationResult.issues,

      operationFields: {
        updated:
          operationResult.updated,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          operationResult.evaluation,

        transaction:
          operationResult.transaction,

        revisions:
          operationResult.revisions,

        viewport:
          operationResult.viewport
      }
    });

  compositorOperationalReceipts.viewport =
    receipt;

  return receipt;
}

export function setHEarth3DCompositorVisibility(
  visibilityCandidate
) {
  const receiptType =
    'H_EARTH_3D_COMPOSITOR_VISIBILITY_RECEIPT';

  const snapshot =
    strictSnapshot(
      visibilityCandidate,
      'visibilityCandidate'
    );

  if (!snapshot.ok) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'VISIBILITY_UPDATE_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_APPLICABLE,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues: [
        snapshot.issue
      ],

      operationFields: {
        updated: false,
        evaluation: null,
        transaction: null,
        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const operationResult =
    applyVisibilityInternally(
      snapshot.value
    );

  const receipt =
    createPublicMutationReceipt({
      receiptType,

      accepted:
        operationResult.accepted,

      materiallyChanged:
        operationResult.materiallyChanged,

      status:
        operationResult.status,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_APPLICABLE,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues:
        operationResult.issues,

      operationFields: {
        updated:
          operationResult.updated,

        evaluation:
          operationResult.evaluation,

        transaction:
          operationResult.transaction ??
          null,

        revisions:
          operationResult.revisions ??
          cloneAndFreeze(
            compositorState.revisions
          ),

        visibility:
          operationResult.visibility ??
          cloneAndFreeze(
            compositorState.visibility
          ),

        admittedGeometryMutated:
          false,

        presentationAssignmentMutated:
          false
      }
    });

  compositorOperationalReceipts.visibility =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 18 · NAVIGATION OPERATIONS
 * ========================================================================== */

function resolveNavigationAxes(
  cameraState
) {
  const yawRadians =
    toRadians(
      cameraState.yawDegrees
    );

  return {
    right:
      normalizeVector(
        createVector(
          Math.cos(
            yawRadians
          ),
          0,
          -Math.sin(
            yawRadians
          )
        )
      ),

    forward:
      normalizeVector(
        createVector(
          -Math.sin(
            yawRadians
          ),
          0,
          -Math.cos(
            yawRadians
          )
        )
      ),

    up:
      createVector(
        0,
        1,
        0
      )
  };
}


/* ==========================================================================
 * 19 · INERTIA EVALUATION AND PLANNING
 * ========================================================================== */

function evaluateImportedInertiaCapacityPolicy() {
  const issues = [];

  if (
    !isFiniteNumber(
      INTERACTION_CAPACITY
        .inertiaDamping
    ) ||
    INTERACTION_CAPACITY
      .inertiaDamping <= 0 ||
    INTERACTION_CAPACITY
      .inertiaDamping >= 1
  ) {
    issues.push(
      createCompositorIssue(
        'INERTIA_DAMPING_CAPACITY_INVALID',
        'The imported inertia damping value is absent or invalid.'
      )
    );
  }

  if (
    !isFiniteNumber(
      INTERACTION_CAPACITY
        .inertiaMinimumVelocity
    ) ||
    INTERACTION_CAPACITY
      .inertiaMinimumVelocity < 0
  ) {
    issues.push(
      createCompositorIssue(
        'INERTIA_MINIMUM_VELOCITY_CAPACITY_INVALID',
        'The imported inertia minimum velocity is absent or invalid.'
      )
    );
  }

  if (
    !Number.isSafeInteger(
      INTERACTION_CAPACITY
        .inertiaMaximumFrames
    ) ||
    INTERACTION_CAPACITY
      .inertiaMaximumFrames <= 0
  ) {
    issues.push(
      createCompositorIssue(
        'INERTIA_MAXIMUM_FRAMES_CAPACITY_INVALID',
        'The imported inertia maximum frame count is absent or invalid.'
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    issues:
      freezeIssues(issues)
  });
}

function evaluateInertiaVelocity(
  velocityCandidate
) {
  const issues = [];

  if (!isPlainRecord(velocityCandidate)) {
    return deepFreeze({
      eligible: false,

      status:
        'INERTIA_VELOCITY_NOT_ELIGIBLE',

      velocity:
        null,

      issues: freezeIssues([
        createCompositorIssue(
          'INERTIA_VELOCITY_NOT_RECORD',
          'The inertia velocity input must be a strict plain-record object.'
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      velocityCandidate,
      REQUIRED_INERTIA_VELOCITY_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
      createCompositorIssue(
        'INERTIA_VELOCITY_KEY_SURFACE_INVALID',
        'The inertia velocity input must contain exactly the declared fields.',
        {
          details:
            deepFreeze({
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
    typeof velocityCandidate.mode !==
      'string' ||
    velocityCandidate.mode.trim().length ===
      0
  ) {
    issues.push(
      createCompositorIssue(
        'INERTIA_MODE_INVALID',
        'Inertia mode must be a non-empty string.',
        {
          field:
            'mode'
        }
      )
    );
  }

  for (
    const field
    of REQUIRED_INERTIA_VELOCITY_KEYS
  ) {
    if (field === 'mode') {
      continue;
    }

    if (
      !isFiniteNumber(
        velocityCandidate[field]
      )
    ) {
      issues.push(
        createCompositorIssue(
          'INERTIA_VELOCITY_NOT_FINITE',
          `${field} must be finite.`,
          {
            field,

            actual:
              velocityCandidate[field] ??
              null
          }
        )
      );
    }
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'INERTIA_VELOCITY_ELIGIBLE'
        : 'INERTIA_VELOCITY_NOT_ELIGIBLE',

    velocity:
      issues.length === 0
        ? deepFreeze({
            mode:
              velocityCandidate.mode.trim(),

            yawVelocity:
              velocityCandidate.yawVelocity,

            pitchVelocity:
              velocityCandidate.pitchVelocity,

            panHorizontalVelocity:
              velocityCandidate.panHorizontalVelocity,

            panVerticalVelocity:
              velocityCandidate.panVerticalVelocity,

            panDepthVelocity:
              velocityCandidate.panDepthVelocity,

            zoomVelocity:
              velocityCandidate.zoomVelocity
          })
        : null,

    issues:
      freezeIssues(issues)
  });
}

function createInertiaStateFromLocalEvaluation(
  localEvaluation
) {
  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.velocity)
  ) {
    return deepFreeze({
      eligible: false,

      inertia:
        null,

      issues:
        localEvaluation?.issues ??
        freezeIssues([
          createCompositorIssue(
            'INERTIA_LOCAL_EVALUATION_INVALID',
            'The retained local inertia evaluation is invalid.'
          )
        ])
    });
  }

  const velocity =
    localEvaluation.velocity;

  const maximumVelocity =
    Math.max(
      Math.abs(
        velocity.yawVelocity
      ),
      Math.abs(
        velocity.pitchVelocity
      ),
      Math.abs(
        velocity.panHorizontalVelocity
      ),
      Math.abs(
        velocity.panVerticalVelocity
      ),
      Math.abs(
        velocity.panDepthVelocity
      ),
      Math.abs(
        velocity.zoomVelocity
      )
    );

  const active =
    H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
      .enabled &&
    maximumVelocity >=
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .minimumVelocity;

  return deepFreeze({
    eligible: true,

    inertia:
      deepFreeze({
        active,

        mode:
          active
            ? velocity.mode
            : 'IDLE',

        yawVelocity:
          active
            ? velocity.yawVelocity
            : 0,

        pitchVelocity:
          active
            ? velocity.pitchVelocity
            : 0,

        panHorizontalVelocity:
          active
            ? velocity.panHorizontalVelocity
            : 0,

        panVerticalVelocity:
          active
            ? velocity.panVerticalVelocity
            : 0,

        panDepthVelocity:
          active
            ? velocity.panDepthVelocity
            : 0,

        zoomVelocity:
          active
            ? velocity.zoomVelocity
            : 0,

        damping:
          H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
            .damping,

        frameCount: 0,

        maximumFrames:
          H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
            .maximumFrames,

        minimumVelocity:
          H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
            .minimumVelocity
      }),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function planAdvanceInertiaFromCurrentState() {
  const currentInertia =
    compositorState.inertia;

  if (!currentInertia.active) {
    return createCompositorMutationPlan({
      accepted: true,

      status:
        'COMPOSITOR_INERTIA_NOT_ACTIVE',

      operationResult: {
        advanced: false,
        failClosedShutdownPerformed: false
      }
    });
  }

  const maximumVelocity =
    Math.max(
      Math.abs(
        currentInertia.yawVelocity
      ),
      Math.abs(
        currentInertia.pitchVelocity
      ),
      Math.abs(
        currentInertia.panHorizontalVelocity
      ),
      Math.abs(
        currentInertia.panVerticalVelocity
      ),
      Math.abs(
        currentInertia.panDepthVelocity
      ),
      Math.abs(
        currentInertia.zoomVelocity
      )
    );

  if (
    maximumVelocity <
      currentInertia.minimumVelocity ||
    currentInertia.frameCount >=
      currentInertia.maximumFrames
  ) {
    return createCompositorMutationPlan({
      accepted: true,

      status:
        'COMPOSITOR_INERTIA_STOPPED',

      nextInertia:
        H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

      operationResult: {
        advanced: false,
        stopped: true,
        failClosedShutdownPerformed: false
      }
    });
  }

  const nextCamera =
    cloneKnownPlain(
      compositorState.camera
    );

  nextCamera.yawDegrees +=
    currentInertia.yawVelocity;

  nextCamera.pitchDegrees +=
    currentInertia.pitchVelocity;

  const axes =
    resolveNavigationAxes(
      nextCamera
    );

  nextCamera.target =
    addVector(
      nextCamera.target,
      addVector(
        scaleVector(
          axes.right,
          currentInertia
            .panHorizontalVelocity
        ),
        addVector(
          scaleVector(
            axes.up,
            currentInertia
              .panVerticalVelocity
          ),
          scaleVector(
            axes.forward,
            currentInertia
              .panDepthVelocity
          )
        )
      )
    );

  nextCamera.zoomScale +=
    currentInertia.zoomVelocity;

  const cameraEvaluation =
    evaluateCompositorCameraStateSnapshot(
      nextCamera
    );

  if (!cameraEvaluation.eligible) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'COMPOSITOR_INERTIA_CAMERA_UPDATE_REJECTED_AND_STOPPED_FAIL_CLOSED',

      nextInertia:
        H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

      operationResult: {
        advanced: false,
        stopped: true,
        failClosedShutdownPerformed: true,
        cameraEvaluation
      },

      issues:
        cameraEvaluation.issues
    });
  }

  const nextInertia = {
    ...currentInertia,

    yawVelocity:
      currentInertia.yawVelocity *
      currentInertia.damping,

    pitchVelocity:
      currentInertia.pitchVelocity *
      currentInertia.damping,

    panHorizontalVelocity:
      currentInertia
        .panHorizontalVelocity *
      currentInertia.damping,

    panVerticalVelocity:
      currentInertia
        .panVerticalVelocity *
      currentInertia.damping,

    panDepthVelocity:
      currentInertia
        .panDepthVelocity *
      currentInertia.damping,

    zoomVelocity:
      currentInertia.zoomVelocity *
      currentInertia.damping,

    frameCount:
      currentInertia.frameCount +
      1
  };

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'COMPOSITOR_INERTIA_FRAME_ADVANCED',

    nextCamera:
      cameraEvaluation.cameraState,

    nextInertia,

    operationResult: {
      advanced: true,
      failClosedShutdownPerformed: false,
      frameCount:
        nextInertia.frameCount
    }
  });
}


/* ==========================================================================
 * 20 · EXACT MODEL-A INTENT EVALUATION
 * ========================================================================== */

function createRejectedIntentEvaluation({
  intent = null,
  authorityProjection = null,
  authorityEvaluation = null,
  authorityDomainEvaluation = null,
  authorityStatus =
    AUTHORITY_STATUS.NOT_EVALUATED,
  authorityEligible = null,
  issues
}) {
  return deepFreeze({
    eligible:
      false,

    status:
      'COMPOSITOR_INTENT_NOT_ELIGIBLE',

    intent,

    authorityProjection,

    authorityEvaluation,

    capacityProjection:
      authorityProjection,

    capacityEvaluation:
      authorityEvaluation,

    authorityDomainEvaluation,

    capacityDomainEvaluation:
      authorityDomainEvaluation,

    authorityStatus,

    authorityEligible,

    capacityEligible:
      authorityEligible,

    localEligible:
      false,

    localEvaluation:
      null,

    issues:
      freezeIssues(issues)
  });
}

function extractRequiredAuthorityDomainEvaluation(
  intentType,
  authorityEvaluation
) {
  switch (intentType) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      return getExactCapacityDomainEvaluation(
        authorityEvaluation,
        CAMERA_STATE_CAPACITY_CHECK_ID
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      return getExactCapacityDomainEvaluation(
        authorityEvaluation,
        VIEWPORT_CAPACITY_CHECK_ID
      );

    default:
      return null;
  }
}

function evaluateLocalIntentSemantics(
  intentSnapshot,
  authorityDomainEvaluation
) {
  const issues = [];
  let localEvaluation = null;

  switch (intentSnapshot.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      if (
        Object.is(
          intentSnapshot.yawDeltaDegrees,
          0
        ) &&
        Object.is(
          intentSnapshot.pitchDeltaDegrees,
          0
        )
      ) {
        issues.push(
          createCompositorIssue(
            'ZERO_EFFECT_ORBIT_REJECTED',
            'An orbit intent must request a material change.'
          )
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      if (
        Object.is(
          intentSnapshot.horizontalDelta,
          0
        ) &&
        Object.is(
          intentSnapshot.verticalDelta,
          0
        ) &&
        Object.is(
          intentSnapshot.depthDelta,
          0
        )
      ) {
        issues.push(
          createCompositorIssue(
            'ZERO_EFFECT_PAN_REJECTED',
            'A pan intent must request a material change.'
          )
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      if (
        Object.is(
          intentSnapshot.zoomScaleDelta,
          0
        )
      ) {
        issues.push(
          createCompositorIssue(
            'ZERO_EFFECT_ZOOM_REJECTED',
            'A zoom intent must request a material change.'
          )
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      if (
        !isPlainRecord(
          authorityDomainEvaluation
        )
      ) {
        issues.push(
          createCompositorIssue(
            'CAMERA_AUTHORITY_DOMAIN_RESULT_ABSENT',
            'The exact camera-state authority domain result is required.',
            {
              expected:
                CAMERA_STATE_CAPACITY_CHECK_ID
            }
          )
        );

        break;
      }

      localEvaluation =
        constructCompositorCameraStateFromNormalizedAuthority(
          authorityDomainEvaluation
            .normalizedCameraState
        );

      if (!localEvaluation.eligible) {
        issues.push(
          ...localEvaluation.issues
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      if (
        !isPlainRecord(
          authorityDomainEvaluation
        )
      ) {
        issues.push(
          createCompositorIssue(
            'VIEWPORT_AUTHORITY_DOMAIN_RESULT_ABSENT',
            'The exact viewport authority domain result is required.',
            {
              expected:
                VIEWPORT_CAPACITY_CHECK_ID
            }
          )
        );

        break;
      }

      localEvaluation =
        evaluateCompositorViewportFromAuthorityEvaluation(
          intentSnapshot.viewport,
          authorityDomainEvaluation
        );

      if (!localEvaluation.eligible) {
        issues.push(
          ...localEvaluation.issues
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      localEvaluation =
        evaluateVisibleLayerIdsSnapshot(
          intentSnapshot.visibleLayerIds
        );

      if (!localEvaluation.eligible) {
        issues.push(
          ...localEvaluation.issues
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      localEvaluation =
        evaluateInertiaVelocity(
          intentSnapshot.velocity
        );

      if (!localEvaluation.eligible) {
        issues.push(
          ...localEvaluation.issues
        );
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
      break;

    default:
      issues.push(
        createCompositorIssue(
          'COMPOSITOR_INTENT_OPERATION_UNRESOLVED',
          'The compositor intent operation is unresolved.'
        )
      );
      break;
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    localEvaluation,

    issues:
      freezeIssues(issues)
  });
}

export function evaluateHEarth3DCompositorIntent(
  intent
) {
  const snapshot =
    strictSnapshot(
      intent,
      'intent'
    );

  if (!snapshot.ok) {
    return createRejectedIntentEvaluation({
      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues: [
        snapshot.issue
      ]
    });
  }

  const intentSnapshot =
    snapshot.value;

  if (!isPlainRecord(intentSnapshot)) {
    return createRejectedIntentEvaluation({
      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues: [
        createCompositorIssue(
          'COMPOSITOR_INTENT_NOT_RECORD',
          'A compositor intent must be a strict plain-record object.'
        )
      ]
    });
  }

  const type =
    intentSnapshot.type;

  if (
    !isNonEmptyString(type) ||
    !Object.prototype.hasOwnProperty.call(
      REQUIRED_INTENT_KEYS_BY_TYPE,
      type
    )
  ) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues: [
        createCompositorIssue(
          'COMPOSITOR_INTENT_TYPE_INVALID',
          'The compositor intent type is missing or unknown.',
          {
            field:
              'type',

            actual:
              type ??
              null
          }
        )
      ]
    });
  }

  const rootKeyEvaluation =
    evaluateExactKeySurface(
      intentSnapshot,
      REQUIRED_INTENT_KEYS_BY_TYPE[
        type
      ]
    );

  if (!rootKeyEvaluation.ok) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues: [
        createCompositorIssue(
          'COMPOSITOR_INTENT_KEY_SURFACE_INVALID',
          'The intent must contain exactly the fields declared for its type.',
          {
            details:
              deepFreeze({
                unknownKeys:
                  rootKeyEvaluation
                    .unknownKeys,

                missingKeys:
                  rootKeyEvaluation
                    .missingKeys
              })
          }
        )
      ]
    });
  }

  const nestedSurfaceEvaluation =
    evaluateNestedIntentSurface(
      intentSnapshot
    );

  if (!nestedSurfaceEvaluation.eligible) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues:
        nestedSurfaceEvaluation
          .issues
    });
  }

  const authorityProjection =
    createCapacityIntentProjection(
      intentSnapshot
    );

  if (!authorityProjection) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEligible:
        null,

      issues: [
        createCompositorIssue(
          'AUTHORITY_INTENT_PROJECTION_NOT_RESOLVED',
          'A type-specific authority projection could not be constructed.',
          {
            field:
              'type',

            actual:
              type
          }
        )
      ]
    });
  }

  const authorityEvaluation =
    evaluateHEarth3DInteractionIntent(
      authorityProjection
    );

  if (
    !isExactCapacityEligible(
      authorityEvaluation
    )
  ) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityProjection,

      authorityEvaluation,

      authorityStatus:
        AUTHORITY_STATUS
          .REJECTED,

      authorityEligible:
        false,

      issues: [
        createCapacityRejectionIssue(
          'intent'
        )
      ]
    });
  }

  const authorityDomainEvaluation =
    extractRequiredAuthorityDomainEvaluation(
      type,
      authorityEvaluation
    );

  if (
    (
      type ===
        H_EARTH_3D_COMPOSITOR_INTENT_TYPES
          .setCameraState ||
      type ===
        H_EARTH_3D_COMPOSITOR_INTENT_TYPES
          .setViewport
    ) &&
    !authorityDomainEvaluation
  ) {
    return createRejectedIntentEvaluation({
      intent:
        intentSnapshot,

      authorityProjection,

      authorityEvaluation,

      authorityStatus:
        AUTHORITY_STATUS
          .ELIGIBLE,

      authorityEligible:
        true,

      issues: [
        createCompositorIssue(
          'REQUIRED_AUTHORITY_DOMAIN_RESULT_ABSENT',
          'The authoritative interaction evaluation omitted the required exact named domain result.',
          {
            expected:
              type ===
                H_EARTH_3D_COMPOSITOR_INTENT_TYPES
                  .setCameraState
                ? CAMERA_STATE_CAPACITY_CHECK_ID
                : VIEWPORT_CAPACITY_CHECK_ID
          }
        )
      ]
    });
  }

  const localResult =
    evaluateLocalIntentSemantics(
      intentSnapshot,
      authorityDomainEvaluation
    );

  return deepFreeze({
    eligible:
      localResult.eligible,

    status:
      localResult.eligible
        ? 'COMPOSITOR_INTENT_ELIGIBLE'
        : 'COMPOSITOR_INTENT_NOT_ELIGIBLE',

    intent:
      intentSnapshot,

    authorityProjection,

    capacityProjection:
      authorityProjection,

    authorityEvaluation,

    capacityEvaluation:
      authorityEvaluation,

    authorityDomainEvaluation,

    capacityDomainEvaluation:
      authorityDomainEvaluation,

    authorityStatus:
      AUTHORITY_STATUS
        .ELIGIBLE,

    authorityEligible:
      true,

    capacityEligible:
      true,

    localEligible:
      localResult.eligible,

    localEvaluation:
      localResult.localEvaluation,

    issues:
      localResult.issues
  });
}


/* ==========================================================================
 * 21 · IMMUTABLE INTENT MUTATION PLANS AND ATOMIC APPLICATION
 * ========================================================================== */

function createCompositorMutationPlan({
  accepted,
  status,
  nextCamera =
    compositorState.camera,
  nextViewport =
    compositorState.viewport,
  nextVisibility =
    compositorState.visibility,
  nextInertia =
    compositorState.inertia,
  operationResult = null,
  issues = EMPTY_FROZEN_ARRAY
}) {
  return deepFreeze({
    accepted:
      accepted === true,

    status,

    nextCamera:
      cloneAndFreeze(
        nextCamera
      ),

    nextViewport:
      cloneAndFreeze(
        nextViewport
      ),

    nextVisibility:
      cloneAndFreeze(
        nextVisibility
      ),

    nextInertia:
      cloneAndFreeze(
        nextInertia
      ),

    operationResult:
      operationResult === null
        ? null
        : cloneAndFreeze(
            operationResult
          ),

    issues:
      freezeIssues(
        issues
      )
  });
}

function planOrbitIntent(
  evaluation
) {
  const candidate =
    cloneKnownPlain(
      compositorState.camera
    );

  candidate.yawDegrees +=
    evaluation.intent.yawDeltaDegrees;

  candidate.pitchDegrees +=
    evaluation.intent.pitchDeltaDegrees;

  const localEvaluation =
    evaluateCompositorCameraStateSnapshot(
      candidate
    );

  if (!localEvaluation.eligible) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'ORBIT_OPERATION_REJECTED',

      issues:
        localEvaluation.issues,

      operationResult: {
        evaluation:
          localEvaluation
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'ORBIT_OPERATION_PLANNED',

    nextCamera:
      localEvaluation.cameraState,

    operationResult: {
      evaluation:
        localEvaluation
    }
  });
}

function planPanIntent(
  evaluation
) {
  const candidate =
    cloneKnownPlain(
      compositorState.camera
    );

  const axes =
    resolveNavigationAxes(
      candidate
    );

  candidate.target =
    addVector(
      candidate.target,
      addVector(
        scaleVector(
          axes.right,
          evaluation.intent.horizontalDelta
        ),
        addVector(
          scaleVector(
            axes.up,
            evaluation.intent.verticalDelta
          ),
          scaleVector(
            axes.forward,
            evaluation.intent.depthDelta
          )
        )
      )
    );

  const localEvaluation =
    evaluateCompositorCameraStateSnapshot(
      candidate
    );

  if (!localEvaluation.eligible) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'PAN_OPERATION_REJECTED',

      issues:
        localEvaluation.issues,

      operationResult: {
        evaluation:
          localEvaluation
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'PAN_OPERATION_PLANNED',

    nextCamera:
      localEvaluation.cameraState,

    operationResult: {
      evaluation:
        localEvaluation
    }
  });
}

function planZoomIntent(
  evaluation
) {
  const candidate =
    cloneKnownPlain(
      compositorState.camera
    );

  candidate.zoomScale +=
    evaluation.intent.zoomScaleDelta;

  const localEvaluation =
    evaluateCompositorCameraStateSnapshot(
      candidate
    );

  if (!localEvaluation.eligible) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'ZOOM_OPERATION_REJECTED',

      issues:
        localEvaluation.issues,

      operationResult: {
        evaluation:
          localEvaluation
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'ZOOM_OPERATION_PLANNED',

    nextCamera:
      localEvaluation.cameraState,

    operationResult: {
      evaluation:
        localEvaluation
    }
  });
}

function planSetCameraStateIntent(
  evaluation
) {
  const localEvaluation =
    evaluation.localEvaluation;

  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.cameraState)
  ) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'CAMERA_STATE_OPERATION_REJECTED',

      issues:
        localEvaluation?.issues ??
        EMPTY_FROZEN_ARRAY,

      operationResult: {
        evaluation:
          localEvaluation ??
          null
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'CAMERA_STATE_OPERATION_PLANNED',

    nextCamera:
      localEvaluation.cameraState,

    operationResult: {
      evaluation:
        localEvaluation
    }
  });
}

function planSetViewportIntent(
  evaluation
) {
  const localEvaluation =
    evaluation.localEvaluation;

  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.viewport)
  ) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'VIEWPORT_OPERATION_REJECTED',

      issues:
        localEvaluation?.issues ??
        EMPTY_FROZEN_ARRAY,

      operationResult: {
        evaluation:
          localEvaluation ??
          null
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'VIEWPORT_OPERATION_PLANNED',

    nextViewport:
      localEvaluation.viewport,

    operationResult: {
      evaluation:
        localEvaluation
    }
  });
}

function planSetVisibleLayersIntent(
  evaluation
) {
  const localEvaluation =
    evaluation.localEvaluation;

  if (
    !isPlainRecord(localEvaluation) ||
    localEvaluation.eligible !== true ||
    !isPlainRecord(localEvaluation.visibility)
  ) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'VISIBLE_LAYER_OPERATION_REJECTED',

      issues:
        localEvaluation?.issues ??
        EMPTY_FROZEN_ARRAY,

      operationResult: {
        evaluation:
          localEvaluation ??
          null
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      'VISIBLE_LAYER_OPERATION_PLANNED',

    nextVisibility:
      localEvaluation.visibility,

    operationResult: {
      evaluation:
        localEvaluation,

      visibleLayerIds:
        localEvaluation.visibleLayerIds,

      admittedGeometryMutated:
        false,

      presentationAssignmentMutated:
        false
    }
  });
}

function planStartInertiaIntent(
  evaluation
) {
  const constructed =
    createInertiaStateFromLocalEvaluation(
      evaluation.localEvaluation
    );

  if (!constructed.eligible) {
    return createCompositorMutationPlan({
      accepted: false,

      status:
        'START_INERTIA_OPERATION_REJECTED',

      issues:
        constructed.issues,

      operationResult: {
        evaluation:
          evaluation.localEvaluation
      }
    });
  }

  return createCompositorMutationPlan({
    accepted: true,

    status:
      constructed.inertia.active
        ? 'START_INERTIA_OPERATION_PLANNED'
        : 'START_INERTIA_NORMALIZED_TO_IDLE',

    nextInertia:
      constructed.inertia,

    operationResult: {
      evaluation:
        evaluation.localEvaluation,

      started:
        constructed.inertia.active
    }
  });
}

function planAdvanceInertiaIntent() {
  return planAdvanceInertiaFromCurrentState();
}

function planStopInertiaIntent() {
  return createCompositorMutationPlan({
    accepted: true,

    status:
      compositorState.inertia.active
        ? 'STOP_INERTIA_OPERATION_PLANNED'
        : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

    nextInertia:
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

    operationResult: {
      stopped:
        compositorState.inertia.active
    }
  });
}

function planResetViewIntent() {
  return createCompositorMutationPlan({
    accepted: true,

    status:
      'RESET_VIEW_OPERATION_PLANNED',

    nextCamera:
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

    nextInertia:
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

    operationResult: {
      reset:
        true
    }
  });
}

function planEvaluatedCompositorIntent(
  evaluation
) {
  switch (evaluation.intent.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      return planOrbitIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      return planPanIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      return planZoomIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      return planSetCameraStateIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      return planSetViewportIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibleLayers:
      return planSetVisibleLayersIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      return planStartInertiaIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
      return planAdvanceInertiaIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
      return planStopInertiaIntent(
        evaluation
      );

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
      return planResetViewIntent(
        evaluation
      );

    default:
      return createCompositorMutationPlan({
        accepted: false,

        status:
          'COMPOSITOR_INTENT_OPERATION_UNRESOLVED',

        issues: [
          createCompositorIssue(
            'COMPOSITOR_INTENT_OPERATION_UNRESOLVED',
            'The compositor intent operation is unresolved.'
          )
        ]
      });
  }
}

export function applyHEarth3DCompositorIntent(
  intent
) {
  const receiptType =
    'H_EARTH_3D_COMPOSITOR_INTENT_RECEIPT';

  const evaluation =
    evaluateHEarth3DCompositorIntent(
      intent
    );

  if (!evaluation.eligible) {
    const mutationPlan =
      createCompositorMutationPlan({
        accepted: false,

        status:
          'COMPOSITOR_INTENT_REJECTED',

        issues:
          evaluation.issues
      });

    const transaction =
      commitCompositorIntentOccurrence({
        mutationPlan,
        evaluation
      });

    const receipt =
      createPublicMutationReceipt({
        receiptType,

        accepted:
          false,

        materiallyChanged:
          transaction.materiallyChanged,

        status:
          transaction.materiallyChanged
            ? 'COMPOSITOR_INTENT_REJECTED_WITH_FAIL_CLOSED_STATE_CHANGE'
            : 'COMPOSITOR_INTENT_REJECTED',

        authorityStatus:
          evaluation.authorityStatus,

        authorityEvaluation:
          evaluation.authorityEvaluation,

        authorityEligible:
          evaluation.authorityEligible,

        issues:
          evaluation.issues,

        operationFields: {
          sequence:
            transaction.sequence,

          intent:
            evaluation.intent,

          authorityProjection:
            evaluation.authorityProjection,

          capacityProjection:
            evaluation.authorityProjection,

          authorityDomainEvaluation:
            evaluation.authorityDomainEvaluation,

          capacityDomainEvaluation:
            evaluation.authorityDomainEvaluation,

          localEligible:
            evaluation.localEligible,

          localEvaluation:
            evaluation.localEvaluation,

          operationResult:
            mutationPlan.operationResult,

          transaction,

          revisions:
            transaction.revisions
        }
      });

    compositorOperationalReceipts.intent =
      receipt;

    return receipt;
  }

  const mutationPlan =
    planEvaluatedCompositorIntent(
      evaluation
    );

  const transaction =
    commitCompositorIntentOccurrence({
      mutationPlan,
      evaluation
    });

  const receipt =
    createPublicMutationReceipt({
      receiptType,

      accepted:
        mutationPlan.accepted,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        mutationPlan.accepted
          ? transaction.materiallyChanged
            ? 'COMPOSITOR_INTENT_ACCEPTED_CHANGED'
            : 'COMPOSITOR_INTENT_ACCEPTED_UNCHANGED'
          : transaction.materiallyChanged
            ? 'COMPOSITOR_INTENT_REJECTED_WITH_FAIL_CLOSED_STATE_CHANGE'
            : 'COMPOSITOR_INTENT_OPERATION_REJECTED',

      authorityStatus:
        evaluation.authorityStatus,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        evaluation.authorityEligible,

      issues:
        mutationPlan.issues,

      operationFields: {
        sequence:
          transaction.sequence,

        intent:
          evaluation.intent,

        authorityProjection:
          evaluation.authorityProjection,

        capacityProjection:
          evaluation.authorityProjection,

        authorityDomainEvaluation:
          evaluation.authorityDomainEvaluation,

        capacityDomainEvaluation:
          evaluation.authorityDomainEvaluation,

        localEligible:
          evaluation.localEligible,

        localEvaluation:
          evaluation.localEvaluation,

        operationResult:
          mutationPlan.operationResult,

        transaction,

        revisions:
          transaction.revisions
      }
    });

  compositorOperationalReceipts.intent =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 22 · PUBLIC COMPOSITOR STATE SNAPSHOT
 * ========================================================================== */

export function getHEarth3DCompositorState() {
  const snapshot =
    deepFreeze({
      camera:
        cloneAndFreeze(
          compositorState.camera
        ),

      viewport:
        cloneAndFreeze(
          compositorState.viewport
        ),

      visibility:
        cloneAndFreeze(
          compositorState.visibility
        ),

      inertia:
        cloneAndFreeze(
          compositorState.inertia
        ),

      revisions:
        cloneAndFreeze(
          compositorState.revisions
        ),

      intentSequence:
        compositorState.intentSequence,

      lastAcceptedIntent:
        compositorState.lastAcceptedIntent
          ? cloneAndFreeze(
              compositorState.lastAcceptedIntent
            )
          : null,

      lastRejectedIntent:
        compositorState.lastRejectedIntent
          ? cloneAndFreeze(
              compositorState.lastRejectedIntent
            )
          : null
    });

  const snapshotKeyEvaluation =
    evaluateExactKeySurface(
      snapshot,
      REQUIRED_BRIDGE_COMPOSITOR_SNAPSHOT_KEYS
    );

  const revisionKeyEvaluation =
    evaluateExactKeySurface(
      snapshot.revisions,
      REQUIRED_REVISION_KEYS
    );

  if (
    !snapshotKeyEvaluation.ok ||
    !revisionKeyEvaluation.ok
  ) {
    throw new Error(
      'COMPOSITOR_INTERNAL_SNAPSHOT_CONTRACT_VIOLATION'
    );
  }

  return snapshot;
}


/* ==========================================================================
 * 23 · FRAME COMPOSITION INPUT
 * ========================================================================== */

function evaluateFrameCompositionInput(
  input
) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      eligible: false,

      status:
        'COMPOSITOR_FRAME_INPUT_NOT_ELIGIBLE',

      input: null,

      packet002Transfer: null,

      issues: freezeIssues([
        createCompositorIssue(
          'COMPOSITOR_FRAME_INPUT_NOT_RECORD',
          'The frame-composition input must be a strict plain-record object.'
        )
      ])
    });
  }

  const rootSurfaceEvaluation =
    evaluateCompleteOwnKeySurface(
      input,
      REQUIRED_FRAME_COMPOSITION_INPUT_KEYS
    );

  if (!rootSurfaceEvaluation.ok) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_FRAME_INPUT_COMPLETE_OWN_KEY_SURFACE_INVALID',
        'The frame-composition input root must contain exactly the declared enumerable data properties and no symbol, non-enumerable, or accessor properties.',
        {
          details:
            deepFreeze({
              unknownKeys:
                rootSurfaceEvaluation
                  .unknownKeys,

              missingKeys:
                rootSurfaceEvaluation
                  .missingKeys,

              symbolKeysPresent:
                rootSurfaceEvaluation
                  .symbolKeysPresent,

              nonEnumerableKeys:
                rootSurfaceEvaluation
                  .nonEnumerableKeys,

              accessorKeys:
                rootSurfaceEvaluation
                  .accessorKeys
            })
        }
      )
    );

    return Object.freeze({
      eligible: false,

      status:
        'COMPOSITOR_FRAME_INPUT_NOT_ELIGIBLE',

      input: null,

      packet002Transfer: null,

      issues:
        freezeIssues(issues)
    });
  }

  const packet002Transfer =
    input.packet002Transfer;

  const packet002TransferOccurrenceId =
    validateExactOccurrenceId(
      input.packet002TransferOccurrenceId
    );

  const compositorFrameOccurrenceId =
    validateExactOccurrenceId(
      input.compositorFrameOccurrenceId
    );

  const presentationMode =
    input.presentationMode;

  if (!isPlainRecord(packet002Transfer)) {
    issues.push(
      createCompositorIssue(
        'PACKET_002_TRANSFER_NOT_RECORD',
        'packet002Transfer must be a strict plain-record object.',
        {
          field:
            'packet002Transfer'
        }
      )
    );
  }

  if (!packet002TransferOccurrenceId) {
    issues.push(
      createCompositorIssue(
        'PACKET_002_TRANSFER_OCCURRENCE_ID_INVALID',
        'packet002TransferOccurrenceId must be a non-empty exact string without surrounding whitespace.',
        {
          field:
            'packet002TransferOccurrenceId'
        }
      )
    );
  }

  if (!compositorFrameOccurrenceId) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_FRAME_OCCURRENCE_ID_INVALID',
        'compositorFrameOccurrenceId must be a non-empty exact string without surrounding whitespace.',
        {
          field:
            'compositorFrameOccurrenceId'
        }
      )
    );
  }

  if (
    !ADMITTED_PRESENTATION_MODES.includes(
      presentationMode
    )
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_PRESENTATION_MODE_INVALID',
        'The compositor presentation mode is not one of the explicit admitted proof modes.',
        {
          field:
            'presentationMode',

          expected:
            ADMITTED_PRESENTATION_MODES,

          actual:
            presentationMode ??
            null
        }
      )
    );
  }

  const envelopeSnapshot =
    strictSnapshot(
      {
        packet002TransferOccurrenceId,
        compositorFrameOccurrenceId,
        presentationMode
      },
      'frameCompositionEnvelope'
    );

  if (!envelopeSnapshot.ok) {
    issues.push(
      envelopeSnapshot.issue
    );
  }

  return Object.freeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'COMPOSITOR_FRAME_INPUT_ELIGIBLE'
        : 'COMPOSITOR_FRAME_INPUT_NOT_ELIGIBLE',

    packet002Transfer,

    input:
      envelopeSnapshot.ok
        ? envelopeSnapshot.value
        : null,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 24 · REJECTED COMPOSITION RESULT
 * ========================================================================== */

function createRejectedCompositionResult(
  status,
  issues,
  {
    packet002TransferOccurrenceId = null,
    compositorFrameOccurrenceId = null
  } = {}
) {
  return deepFreeze({
    ok: false,

    status,

    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    admittedGeometryFrameContractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    packet002TransferOccurrenceId,

    compositorFrameOccurrenceId,

    compositorCompositionStateMutated:
      false,

    revisionAdvanced:
      false,

    receiptLedgerMayBeUpdated:
      true,

    admittedGeometryFrame:
      null,

    rendererImported:
      false,

    rendererMounted:
      false,

    rendererResourceCreated:
      false,

    visibleOutputConfirmed:
      false,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 25 · AUTHORITATIVE ADMITTED-FRAME COMPOSITION
 * ========================================================================== */

export function composeHEarth3DCompositorAdmittedFrame(
  input
) {
  const inputEvaluation =
    evaluateFrameCompositionInput(
      input
    );

  if (!inputEvaluation.eligible) {
    return createRejectedCompositionResult(
      'COMPOSITOR_ADMITTED_FRAME_INPUT_REJECTED',
      inputEvaluation.issues
    );
  }

  const {
    packet002Transfer
  } = inputEvaluation;

  const {
    packet002TransferOccurrenceId,
    compositorFrameOccurrenceId,
    presentationMode
  } = inputEvaluation.input;

  const compositorStateSnapshot =
    getHEarth3DCompositorState();

  if (
    compositorStateSnapshot
      .viewport
      .capacityStatus !==
      'WITHIN_CAPACITY'
  ) {
    return createRejectedCompositionResult(
      'COMPOSITOR_VIEWPORT_UNRESOLVED_OR_NOT_ELIGIBLE',
      [
        createCompositorIssue(
          'COMPOSITOR_VIEWPORT_NOT_READY_FOR_FRAME',
          'A capacity-eligible resolved viewport is required before admitted-frame composition.',
          {
            actual:
              compositorStateSnapshot
                .viewport
                .capacityStatus,

            expected:
              'WITHIN_CAPACITY'
          }
        )
      ],
      {
        packet002TransferOccurrenceId,
        compositorFrameOccurrenceId
      }
    );
  }

  const resolvedCameraPose =
    resolveCompositorCameraPoseSnapshot(
      compositorStateSnapshot.camera,
      compositorStateSnapshot
        .revisions
        .camera
    );

  if (!resolvedCameraPose.eligible) {
    return createRejectedCompositionResult(
      'COMPOSITOR_CAMERA_POSE_NOT_ELIGIBLE',
      resolvedCameraPose.issues,
      {
        packet002TransferOccurrenceId,
        compositorFrameOccurrenceId
      }
    );
  }

  const admittedGeometryFrame =
    composeHEarth3DAdmittedGeometryFrame({
      packet002Transfer,

      packet002TransferOccurrenceId,

      compositorState:
        compositorStateSnapshot,

      resolvedCameraPoseCorrespondence: {
        sourceCameraRevision:
          compositorStateSnapshot
            .revisions
            .camera,

        resolvedCameraPose
      },

      presentationMode,

      compositorFrameOccurrenceId
    });

  const accepted =
    isHEarth3DAdmittedGeometryFrame(
      admittedGeometryFrame
    );

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_ADMITTED_FRAME_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      admittedGeometryFrameContractId:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      accepted,

      status:
        accepted
          ? 'COMPOSITOR_ADMITTED_FRAME_COMPOSED'
          : 'COMPOSITOR_ADMITTED_FRAME_REJECTED_BY_AUTHORITATIVE_VALIDATOR',

      packet002TransferOccurrenceId,

      compositorFrameOccurrenceId,

      capturedFrameRevision:
        compositorStateSnapshot
          .revisions
          .frame,

      capturedCameraRevision:
        compositorStateSnapshot
          .revisions
          .camera,

      resolvedCameraRevision:
        resolvedCameraPose
          .cameraRevision,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      compositorCompositionStateMutated:
        false,

      revisionAdvanced:
        false,

      nonAuthoritativeReceiptLedgerUpdated:
        true,

      rendererImported:
        false,

      rendererMounted:
        false,

      rendererResourceCreated:
        false,

      visibleOutputConfirmed:
        false,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false
    });

  compositorOperationalReceipts.frame =
    receipt;

  return admittedGeometryFrame;
}


/* ==========================================================================
 * 26 · COMPATIBILITY FRAME ALIASES
 * ========================================================================== */

export function composeHEarth3DRenderFrame(
  input
) {
  return composeHEarth3DCompositorAdmittedFrame(
    input
  );
}

export function composeHEarth3DRendererFrame(
  input
) {
  return composeHEarth3DCompositorAdmittedFrame(
    input
  );
}

export function getHEarth3DCompositorRenderFrame(
  input
) {
  return composeHEarth3DCompositorAdmittedFrame(
    input
  );
}


/* ==========================================================================
 * 27 · THIN RENDERER HANDOFF
 * ========================================================================== */

export function getHEarth3DCompositorRendererHandoff(
  input
) {
  const admittedGeometryFrame =
    composeHEarth3DCompositorAdmittedFrame(
      input
    );

  const ok =
    isHEarth3DAdmittedGeometryFrame(
      admittedGeometryFrame
    );

  const handoff =
    deepFreeze({
      ok,

      status:
        ok
          ? 'COMPOSITOR_RENDERER_HANDOFF_READY'
          : 'COMPOSITOR_RENDERER_HANDOFF_NOT_READY',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      admittedGeometryFrameContractId:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      admittedGeometryFrame,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      compositorCompositionStateMutated:
        false,

      revisionAdvanced:
        false,

      nonAuthoritativeReceiptLedgerUpdated:
        true,

      rendererImported:
        false,

      rendererMounted:
        false,

      rendererResourceCreated:
        false,

      renderInstanceCreated:
        false,

      visibleOutputConfirmed:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });

  compositorOperationalReceipts.handoff =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_RENDERER_HANDOFF_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      ok,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      compositorCompositionStateMutated:
        false,

      revisionAdvanced:
        false,

      nonAuthoritativeReceiptLedgerUpdated:
        true,

      rendererImported:
        false,

      rendererMounted:
        false,

      rendererResourceCreated:
        false,

      visibleOutputConfirmed:
        false
    });

  return handoff;
}


/* ==========================================================================
 * 28 · STATIC CONFIGURATION COHERENCE
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_STATIC_COHERENCE =
  (() => {
    const issues = [];

    if (
      CAPACITY_CONTRACT?.contractId !==
      H_EARTH_3D_CAPACITY_CONTRACT_ID
    ) {
      issues.push(
        createCompositorIssue(
          'CAPACITY_CONTRACT_ID_MISMATCH',
          'The imported capacity contract does not match the expected identity.'
        )
      );
    }

    if (
      ADMITTED_FRAME_CONTRACT
        ?.contractId !==
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID
    ) {
      issues.push(
        createCompositorIssue(
          'ADMITTED_FRAME_CONTRACT_ID_MISMATCH',
          'The admitted-geometry frame contract does not match the expected identity.'
        )
      );
    }

    for (
      const [
        evaluatorName,
        evaluator
      ]
      of [
        [
          'evaluateHEarth3DInteractionIntent',
          evaluateHEarth3DInteractionIntent
        ],
        [
          'evaluateHEarth3DViewportCapacity',
          evaluateHEarth3DViewportCapacity
        ],
        [
          'evaluateHEarth3DCameraCapacity',
          evaluateHEarth3DCameraCapacity
        ]
      ]
    ) {
      if (typeof evaluator !== 'function') {
        issues.push(
          createCompositorIssue(
            'CAPACITY_EVALUATOR_UNAVAILABLE',
            `${evaluatorName} is unavailable.`,
            {
              field:
                evaluatorName
            }
          )
        );
      }
    }

    const importedInertiaCapacityPolicyEvaluation =
      evaluateImportedInertiaCapacityPolicy();

    if (
      !importedInertiaCapacityPolicyEvaluation
        .eligible
    ) {
      issues.push(
        ...importedInertiaCapacityPolicyEvaluation
          .issues
      );
    }

    const initialCameraEvaluation =
      evaluateCompositorCameraStateSnapshot(
        H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE
      );

    if (!initialCameraEvaluation.eligible) {
      issues.push(
        createCompositorIssue(
          'INITIAL_CAMERA_STATE_NOT_ELIGIBLE',
          'The initial camera state is not locally eligible.',
          {
            details:
              initialCameraEvaluation
          }
        )
      );
    }

    return deepFreeze({
      eligible:
        issues.length === 0,

      status:
        issues.length === 0
          ? 'COMPOSITOR_STATIC_CONFIGURATION_COHERENT'
          : 'COMPOSITOR_STATIC_CONFIGURATION_NOT_COHERENT',

      issues:
        freezeIssues(issues),

      capacityContractPresent:
        CAPACITY_CONTRACT !==
        null,

      capacityReceiptPresent:
        CAPACITY_RECEIPT !==
        null,

      admittedFrameContractPresent:
        ADMITTED_FRAME_CONTRACT !==
        null,

      admittedFrameReceiptPresent:
        ADMITTED_FRAME_RECEIPT !==
        null,

      exactAuthorityCheckIdAccessDefined:
        true,

      exactAuthorityEligibilityDefined:
        true,

      authorityNormalizedCameraConsumptionDefined:
        true,

      directCameraProjectionIdentitySeparationDefined:
        true,

      originalAuthorityResultIdentityRetentionDefined:
        true,

      authorityCompatibilityFieldIdentityDefined:
        true,

      branchStablePublicMutationReceiptRootDefined:
        true,

      atomicIntentOccurrenceTransactionDefined:
        true,

      immutableIntentMutationPlanDefined:
        true,

      duplicateFrameAuthorityEvaluationPresent:
        false,

      importedInertiaCapacityFallbackPresent:
        false,

      exactOccurrenceIdentifierPreservationDefined:
        true,

      canonicalArrayIndexValidationDefined:
        true,

      capacityProjectionRetainedAsCompositorState:
        false,

      stateHistorySnapshotIsolationDefined:
        true,

      publicSetterReentryFromIntentPath:
        false,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      packet002DeepFreezeByCompositor:
        false,

      rendererImported:
        false,

      rendererMounted:
        false,

      visibleOutputConfirmed:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  })();


/* ==========================================================================
 * 29 · OPERATIONAL RECEIPTS
 * ========================================================================== */

export function getHEarth3DCompositorOperationalReceipts() {
  return cloneAndFreeze(
    compositorOperationalReceipts
  );
}


/* ==========================================================================
 * 30 · DIRECT INERTIA OPERATIONS AND RESET
 * ========================================================================== */

export function startHEarth3DCompositorInertia(
  velocityCandidate
) {
  const receiptType =
    'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT';

  const snapshot =
    strictSnapshot(
      velocityCandidate,
      'velocityCandidate'
    );

  if (!snapshot.ok) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'COMPOSITOR_INERTIA_START_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_EVALUATED,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues: [
        snapshot.issue
      ],

      operationFields: {
        started: false,
        updated: false,
        evaluation: null,
        transaction: null,
        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const evaluation =
    evaluateDirectStartInertiaAdministrativeInput(
      snapshot.value
    );

  if (!evaluation.eligible) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'COMPOSITOR_INERTIA_START_REJECTED',

      authorityStatus:
        evaluation.authorityEvaluation === null
          ? AUTHORITY_STATUS.NOT_EVALUATED
          : evaluation.authorityEligible
            ? AUTHORITY_STATUS.ELIGIBLE
            : AUTHORITY_STATUS.REJECTED,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        evaluation.authorityEligible,

      issues:
        evaluation.issues,

      operationFields: {
        started: false,
        updated: false,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          evaluation.localEvaluation,

        transaction: null,

        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const constructed =
    createInertiaStateFromLocalEvaluation(
      evaluation.localEvaluation
    );

  if (!constructed.eligible) {
    return createPublicMutationReceipt({
      receiptType,

      accepted:
        false,

      materiallyChanged:
        false,

      status:
        'COMPOSITOR_INERTIA_START_REJECTED',

      authorityStatus:
        AUTHORITY_STATUS
          .ELIGIBLE,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        true,

      issues:
        constructed.issues,

      operationFields: {
        started: false,
        updated: false,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          evaluation.localEvaluation,

        transaction: null,

        revisions:
          cloneAndFreeze(
            compositorState.revisions
          )
      }
    });
  }

  const transaction =
    commitCompositorMutation({
      nextInertia:
        constructed.inertia
    });

  const receipt =
    createPublicMutationReceipt({
      receiptType,

      accepted:
        true,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        constructed.inertia.active
          ? transaction.inertiaChanged
            ? 'COMPOSITOR_INERTIA_STARTED'
            : 'COMPOSITOR_INERTIA_UNCHANGED'
          : transaction.inertiaChanged
            ? 'COMPOSITOR_INERTIA_NORMALIZED_TO_IDLE'
            : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

      authorityStatus:
        AUTHORITY_STATUS
          .ELIGIBLE,

      authorityEvaluation:
        evaluation.authorityEvaluation,

      authorityEligible:
        true,

      issues:
        EMPTY_FROZEN_ARRAY,

      operationFields: {
        started:
          constructed.inertia.active &&
          transaction.inertiaChanged,

        updated:
          transaction.inertiaChanged,

        authorityProjection:
          evaluation.authorityProjection,

        evaluation:
          evaluation.localEvaluation,

        transaction,

        revisions:
          transaction.revisions,

        inertia:
          cloneAndFreeze(
            compositorState.inertia
          )
      }
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}

export function advanceHEarth3DCompositorInertia() {
  const mutationPlan =
    planAdvanceInertiaFromCurrentState();

  const transaction =
    commitCompositorMutation({
      nextCamera:
        mutationPlan.nextCamera,

      nextViewport:
        mutationPlan.nextViewport,

      nextVisibility:
        mutationPlan.nextVisibility,

      nextInertia:
        mutationPlan.nextInertia
    });

  const receipt =
    createPublicMutationReceipt({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

      accepted:
        mutationPlan.accepted,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        mutationPlan.status,

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_APPLICABLE,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues:
        mutationPlan.issues,

      operationFields: {
        advanced:
          mutationPlan.operationResult
            ?.advanced === true,

        stopped:
          mutationPlan.operationResult
            ?.stopped === true,

        failClosedShutdownPerformed:
          mutationPlan.operationResult
            ?.failClosedShutdownPerformed ===
          true,

        operationResult:
          mutationPlan.operationResult,

        transaction,

        revisions:
          transaction.revisions,

        inertia:
          cloneAndFreeze(
            compositorState.inertia
          )
      }
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}

export function stopHEarth3DCompositorInertia() {
  const transaction =
    commitCompositorMutation({
      nextInertia:
        H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE
    });

  const receipt =
    createPublicMutationReceipt({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

      accepted:
        true,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.inertiaChanged
          ? 'COMPOSITOR_INERTIA_STOPPED'
          : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_APPLICABLE,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues:
        EMPTY_FROZEN_ARRAY,

      operationFields: {
        stopped:
          transaction.inertiaChanged,

        transaction,

        revisions:
          transaction.revisions,

        inertia:
          cloneAndFreeze(
            compositorState.inertia
          )
      }
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}

export function resetHEarth3DCompositorState() {
  const transaction =
    commitCompositorMutation({
      nextCamera:
        H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

      nextViewport:
        H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE,

      nextVisibility:
        H_EARTH_3D_COMPOSITOR_INITIAL_VISIBILITY_STATE,

      nextInertia:
        H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE
    });

  const receipt =
    createPublicMutationReceipt({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_RESET_RECEIPT',

      accepted:
        true,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.materiallyChanged
          ? 'COMPOSITOR_STATE_RESET'
          : 'COMPOSITOR_STATE_ALREADY_INITIAL',

      authorityStatus:
        AUTHORITY_STATUS
          .NOT_APPLICABLE,

      authorityEvaluation:
        null,

      authorityEligible:
        null,

      issues:
        EMPTY_FROZEN_ARRAY,

      operationFields: {
        reset:
          transaction.materiallyChanged,

        cameraChanged:
          transaction.cameraChanged,

        viewportChanged:
          transaction.viewportChanged,

        visibilityChanged:
          transaction.visibilityChanged,

        inertiaChanged:
          transaction.inertiaChanged,

        transaction,

        revisions:
          transaction.revisions
      }
    });

  compositorOperationalReceipts.reset =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 31 · CLAIM CEILINGS
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS =
  deepFreeze({
    packet002ProductionClaim:
      false,

    packet002OccurrenceAuthenticationClaim:
      false,

    sourceResolutionClaim:
      false,

    providerConstructionClaim:
      false,

    geometryConstructionClaim:
      false,

    westAdmissionClaim:
      false,

    geometryIndexClaim:
      false,

    rendererProjectionClaim:
      false,

    rendererPrimitiveConstructionClaim:
      false,

    rendererResourceCreationClaim:
      false,

    backendMaterialCreationClaim:
      false,

    renderInstanceCreationClaim:
      false,

    rendererMountClaim:
      false,

    runtimeActivationClaim:
      false,

    visibleOutputClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    matrixCollapse:
      false
  });


/* ==========================================================================
 * 32 · STATIC RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_ADMITTED_GEOMETRY_COMPOSITOR_RENEWAL_RECEIPT',

    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    renewsContractId:
      RENEWS_COMPOSITOR_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_COMPOSITOR_SOURCE_FILE,

    capacityContractConsumed:
      true,

    admittedGeometryFrameContractConsumed:
      true,

    authoritativeInteractionEvaluatorConsumed:
      true,

    authorityNormalizedCameraStateConsumed:
      true,

    authorityNormalizedViewportConsumed:
      true,

    exactCapacityCheckIdFieldConsumed:
      true,

    exactCapacityEligibilityLawDefined:
      true,

    directCameraProjectionIdentitySeparated:
      true,

    directCameraProjectionFieldMinimal:
      true,

    originalAuthorityResultIdentityRetained:
      true,

    compatibilityAuthorityFieldsShareIdentity:
      true,

    branchStablePublicMutationReceiptRootDefined:
      true,

    immutableIntentMutationPlanDefined:
      true,

    atomicIntentOccurrenceTransactionDefined:
      true,

    duplicateFrameViewportEvaluationRemoved:
      true,

    duplicateFrameCameraPoseEvaluationRemoved:
      true,

    admittedGeometryFrameRemainsSingleFinalFrameAuthority:
      true,

    importedInertiaCapacityFallbacksRemoved:
      true,

    importedInertiaCapacityPolicyValidated:
      true,

    exactFrameOccurrenceIdentityDefined:
      true,

    frameOccurrenceTrimmingRemoved:
      true,

    canonicalArrayIndexValidationDefined:
      true,

    canonicalVisibleLayerIntentDefined:
      true,

    canonicalVisibleLayerPayloadDefined:
      true,

    unknownVisibleLayerRejectionDefined:
      true,

    duplicateVisibleLayerRejectionDefined:
      true,

    visibleLayerBooleanTranslationDefined:
      true,

    nestedInertiaProjectionFlatteningDefined:
      true,

    compositorInertiaModeExcludedFromAuthorityProjection:
      true,

    capacityProjectionRetainedInCompositorState:
      false,

    intentHistoryUsesCorrelationSummaryOnly:
      true,

    stateHistorySnapshotIsolationDefined:
      true,

    publicSetterReentryFromIntentApplicationRemoved:
      true,

    frameRootCompleteOwnKeyValidationDefined:
      true,

    frameRootValidationOccursBeforePropertyRead:
      true,

    resolvedCameraPoseIncludesCameraRevision:
      true,

    resolvedCameraRevisionDerivedFromCapturedSnapshot:
      true,

    packet002TransferPreservedByReference:
      true,

    packet002TransferDeepFrozenByCompositor:
      false,

    frameCompositionMutatesCompositorCompositionState:
      false,

    rendererHandoffMutatesCompositorCompositionState:
      false,

    frameCompositionAdvancesRevision:
      false,

    moduleSyntaxVerified:
      false,

    importResolutionVerified:
      false,

    moduleInitializationVerified:
      false,

    controlledBehaviorVerified:
      false,

    liveRepositoryExecutionVerified:
      false,

    routeIntegrationVerified:
      false,

    rendererConsumptionVerified:
      false,

    rendererMountVerified:
      false,

    visibleOutputConfirmed:
      false,

    claimCeilings:
      H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
  });


/* ==========================================================================
 * 33 · COMPLETE CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_COMPOSITOR_SCHEMA_VERSION,

    renewsContractId:
      RENEWS_COMPOSITOR_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_COMPOSITOR_SOURCE_FILE,

    layer:
      'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

    role:
      H_EARTH_3D_COMPOSITOR_ROLE,

    status:
      H_EARTH_3D_COMPOSITOR_STATUS,

    authoritativeCorridor:
      deepFreeze([
        'PACKET_002_TRANSFER',
        'admitted-geometry-frame.js',
        'COMPOSITOR_STATE_CORRESPONDENCE_AND_FRAME_SEQUENCING',
        'renderer.js'
      ]),

    modelAInteractionCorridor:
      deepFreeze([
        'PUBLIC_SNAPSHOT',
        'EXACT_ROOT_SURFACE',
        'EXACT_TYPE_SPECIFIC_NESTED_SURFACE',
        'IMMUTABLE_TYPE_SPECIFIC_AUTHORITY_PROJECTION',
        'ONE_AUTHORITATIVE_EVALUATION',
        'EXACT_NAMED_DOMAIN_RESULT',
        'COMPOSITOR_OWNED_SEMANTICS',
        'IMMUTABLE_MUTATION_PLAN',
        'ATOMIC_INTENT_OCCURRENCE_TRANSACTION',
        'RECEIPT'
      ]),

    directDependencies:
      deepFreeze({
        capacity:
          './capacity.js',

        admittedGeometryFrame:
          './admitted-geometry-frame.js'
      }),

    capacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    admittedGeometryFrameContractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    consumedCapacityValues:
      cloneAndFreeze(
        CONSUMED_CAPACITY_VALUES
      ),

    initialCameraState:
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

    initialViewportState:
      H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE,

    initialVisibilityState:
      H_EARTH_3D_COMPOSITOR_INITIAL_VISIBILITY_STATE,

    initialInertiaState:
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

    admittedVisibilityLayerIds:
      ADMITTED_VISIBILITY_LAYER_IDS,

    cameraConstraints:
      H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,

    inertiaPolicy:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY,

    intentTypes:
      H_EARTH_3D_COMPOSITOR_INTENT_TYPES,

    authorityStatuses:
      AUTHORITY_STATUS,

    revisionLaw:
      H_EARTH_3D_COMPOSITOR_REVISION_LAW,

    exactCheckAccessLaw:
      'AUTHORITY_CHECKS_ARE_ACCESSED_ONLY_BY_EXACT_CHECK_ID_THROUGH_THE_ID_FIELD',

    exactAuthorityEligibilityLaw:
      'AUTHORITY_ELIGIBILITY_REQUIRES_A_PLAIN_RECORD_WITH_ELIGIBLE_STRICTLY_EQUAL_TO_TRUE',

    cameraDomainResultLaw:
      'SET_CAMERA_STATE_REQUIRES_CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE_DETAILS_FROM_THE_RETAINED_INTERACTION_EVALUATION',

    viewportDomainResultLaw:
      'SET_VIEWPORT_REQUIRES_CONTROLLER_INTENT_VIEWPORT_ELIGIBLE_DETAILS_FROM_THE_RETAINED_INTERACTION_EVALUATION',

    authorityNormalizedCameraLaw:
      'DIRECT_CAMERA_REPLACEMENT_AND_SET_CAMERA_STATE_BEGIN_FROM_RETAINED_AUTHORITY_NORMALIZED_CAMERA_STATE_BEFORE_COMPOSITOR_POSITION_BOUND_FITTING',

    directCameraProjectionLaw:
      'DIRECT_CAMERA_AUTHORITY_EVALUATION_USES_A_NEW_FIELD_MINIMAL_IDENTITY_SEPARATED_PROJECTION',

    authorityIdentityLaw:
      'THE_ORIGINAL_AUTHORITY_RESULT_OBJECT_IS_RETAINED_THROUGH_INTERNAL_CONTINUATION_AND_DISCLOSED_BY_ORIGINAL_IDENTITY',

    authorityCompatibilityIdentityLaw:
      'AUTHORITY_EVALUATION_AND_CAPACITY_EVALUATION_FIELDS_REFERENCE_THE_SAME_PUBLIC_OBJECT',

    authorityIssueLaw:
      'COMPLETE_AUTHORITY_EVIDENCE_IS_DISCLOSED_ONCE_AT_THE_RECEIPT_ROOT_AND_IS_NOT_DUPLICATED_INSIDE_ISSUE_DETAILS',

    mutationPlanLaw:
      'INTENT_OPERATION_HELPERS_RETURN_IMMUTABLE_CANDIDATE_STATE_PLANS_AND_DO_NOT_MUTATE_COMPOSITOR_STATE',

    intentTransactionLaw:
      'ONE_ATOMIC_INTENT_OCCURRENCE_COMMIT_OWNS_COMPONENT_STATE_COMPONENT_REVISIONS_FRAME_REVISION_SEQUENCE_AND_HISTORY',

    receiptRootLaw:
      'EVERY_PUBLIC_MUTATION_BRANCH_INCLUDES_RECEIPT_TYPE_CONTRACT_ID_ACCEPTED_MATERIALLY_CHANGED_STATUS_AUTHORITY_STATUS_AUTHORITY_EVALUATION_AUTHORITY_ELIGIBLE_CAPACITY_EVALUATION_CAPACITY_ELIGIBLE_AND_ISSUES',

    frameAuthorityLaw:
      'COMPOSE_HEARTH_3D_ADMITTED_GEOMETRY_FRAME_IS_THE_SINGLE_FINAL_VIEWPORT_AND_CAMERA_POSE_FRAME_ELIGIBILITY_AUTHORITY',

    viewportAuthorityLaw:
      'VIEWPORT_STATE_IS_COPIED_FROM_THE_EXACT_AUTHORITY_NORMALIZED_VIEWPORT_WITHOUT_RECALCULATION_OR_FALLBACK',

    inertiaAuthorityOrderLaw:
      'DIRECT_START_INERTIA_PERFORMS_ONLY_STRUCTURAL_PROJECTION_SAFETY_BEFORE_AUTHORITY_EVALUATION_AND_APPLIES_COMPOSITOR_MODE_SEMANTICS_AFTER_AUTHORITY_ELIGIBILITY',

    inertiaCapacityLaw:
      'INERTIA_DAMPING_MINIMUM_VELOCITY_AND_MAXIMUM_FRAMES_ARE_CONSUMED_WITHOUT_LOCAL_NUMERIC_FALLBACKS',

    occurrenceIdentityLaw:
      'FRAME_OCCURRENCE_IDENTIFIERS_ARE_ACCEPTED_ONLY_WHEN_EXACT_NONEMPTY_STRINGS_WITHOUT_SURROUNDING_WHITESPACE_AND_ARE_NEVER_TRIMMED',

    arrayIndexLaw:
      'STRICT_ARRAY_SNAPSHOTTING_ADMITS_ONLY_CANONICAL_ARRAY_INDEX_KEYS_FROM_ZERO_THROUGH_4294967294',

    visibleLayerIdentityLaw:
      'VISIBLE_LAYER_IDENTIFIERS_REQUIRE_EXACT_CANONICAL_IDENTITY_AND_ARE_NEVER_TRIMMED_OR_NORMALIZED',

    packet002ReferenceLaw:
      'PRESERVE_PRODUCER_OWNED_PACKET_002_REFERENCE_WITHOUT_CLONING_OR_DEEP_FREEZING',

    compositionReadLaw:
      'CAPTURE_COMPOSITOR_STATE_EXACTLY_ONCE_PER_FRAME_COMPOSITION',

    cameraRevisionCorrespondenceLaw:
      'RESOLVED_CAMERA_POSE_REVISION_IS_DERIVED_FROM_THE_SAME_CAPTURED_COMPOSITOR_SNAPSHOT_AS_THE_CAMERA_STATE',

    compositionMutationLaw:
      'FRAME_COMPOSITION_MUTATES_NO_CAMERA_VIEWPORT_VISIBILITY_INERTIA_REVISION_SEQUENCE_OR_HISTORY_STATE',

    rendererHandoffMutationLaw:
      'RENDERER_HANDOFF_MUTATES_NO_CAMERA_VIEWPORT_VISIBILITY_INERTIA_REVISION_SEQUENCE_OR_HISTORY_STATE',

    finalFrameEligibilityLaw:
      'STEP_034O_7_REVALIDATES_CAPACITY_AND_IS_THE_FINAL_ADMITTED_FRAME_ELIGIBILITY_BOUNDARY',

    presentationModeDefault:
      null,

    presentationModeMustBeExplicit:
      true,

    compatibilityLaw:
      'LEGACY_FRAME_FUNCTION_NAMES_DELEGATE_DIRECTLY_TO_THE_ADMITTED_FRAME_PATH',

    staticCoherence:
      H_EARTH_3D_COMPOSITOR_STATIC_COHERENCE,

    boundaryFlags:
      H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS
  });


/* ==========================================================================
 * 34 · PUBLIC GETTERS
 * ========================================================================== */

export function getHEarth3DCompositorContract() {
  return H_EARTH_3D_COMPOSITOR_CONTRACT;
}

export function getHEarth3DCompositorReceipt() {
  return H_EARTH_3D_COMPOSITOR_RECEIPT;
}

export function getHEarth3DCompositorStaticCoherence() {
  return H_EARTH_3D_COMPOSITOR_STATIC_COHERENCE;
}

export function getHEarth3DCompositorBoundaryFlags() {
  return H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS;
}

export function getHEarth3DCompositorClaimCeilings() {
  return H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS;
}


/* ==========================================================================
 * 35 · COMPATIBILITY COMPOSITION GETTER
 * ========================================================================== */

export function getHEarth3DComposition(
  input
) {
  return getHEarth3DCompositorRendererHandoff(
    input
  );
}


/* ==========================================================================
 * 36 · AGGREGATE EXPORT
 * ========================================================================== */

export const H_EARTH_3D_COMPOSITOR_AGGREGATE =
  deepFreeze({
    contractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    contract:
      H_EARTH_3D_COMPOSITOR_CONTRACT,

    receipt:
      H_EARTH_3D_COMPOSITOR_RECEIPT,

    staticCoherence:
      H_EARTH_3D_COMPOSITOR_STATIC_COHERENCE,

    boundaryFlags:
      H_EARTH_3D_COMPOSITOR_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_COMPOSITOR_CLAIM_CEILINGS,

    evaluateHEarth3DCompositorCameraState,

    resolveHEarth3DCompositorCameraPose,

    evaluateHEarth3DCompositorViewport,

    evaluateHEarth3DCompositorVisibility,

    setHEarth3DCompositorCameraState,

    setHEarth3DCompositorViewport,

    setHEarth3DCompositorVisibility,

    evaluateHEarth3DCompositorIntent,

    applyHEarth3DCompositorIntent,

    startHEarth3DCompositorInertia,

    advanceHEarth3DCompositorInertia,

    stopHEarth3DCompositorInertia,

    getHEarth3DCompositorState,

    resetHEarth3DCompositorState,

    composeHEarth3DCompositorAdmittedFrame,

    composeHEarth3DRenderFrame,

    composeHEarth3DRendererFrame,

    getHEarth3DCompositorRenderFrame,

    getHEarth3DCompositorRendererHandoff,

    getHEarth3DCompositorOperationalReceipts,

    getHEarth3DCompositorContract,

    getHEarth3DCompositorReceipt,

    getHEarth3DCompositorStaticCoherence,

    getHEarth3DCompositorBoundaryFlags,

    getHEarth3DCompositorClaimCeilings,

    getHEarth3DComposition,

    isHEarth3DAdmittedGeometryFrame
  });

export default H_EARTH_3D_COMPOSITOR_AGGREGATE;
