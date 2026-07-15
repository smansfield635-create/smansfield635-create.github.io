/**
 * /showroom/globe/h-earth/compositor.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Renews:
 * H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_3_CAMERA_VIEWPORT_FRAME_COMPOSITION_v1
 *
 * Authoritative corridor:
 *
 * PACKET_002_TRANSFER
 * → admitted-geometry-frame.js
 * → compositor-owned state correspondence and frame sequencing
 * → renderer.js
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_VIEWPORT_CAPACITY,
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_INTERACTION_CAPACITY,
  evaluateHEarth3DViewportCapacity,
  evaluateHEarth3DCameraPose,
  getHEarth3DCapacityContract,
  getHEarth3DCapacityReceipt
} from './capacity.js';

import {
  H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,
  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
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
  3;

export const H_EARTH_3D_COMPOSITOR_SOURCE_FILE =
  '/showroom/globe/h-earth/compositor.js';

export const H_EARTH_3D_COMPOSITOR_ROLE =
  'ADMITTED_GEOMETRY_CAMERA_VIEWPORT_VISIBILITY_AND_FRAME_SEQUENCE_COMPOSITION_AUTHORITY';

export const H_EARTH_3D_COMPOSITOR_STATUS =
  'ADMITTED_GEOMETRY_FRAME_PATH_RENEWAL_CANDIDATE';

const RENEWS_COMPOSITOR_CONTRACT_ID =
  'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_3_CAMERA_VIEWPORT_FRAME_COMPOSITION_v1';

const PRIMARY_PRESENTATION_VISIBILITY_KEY =
  'PRIMARY_ADMITTED_WET_SAND_SURFACE';

const ROUTE_OVERLAY_VISIBILITY_KEY =
  'ROUTE_OVERLAY';

const EMPTY_FROZEN_ARRAY =
  Object.freeze([]);


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
    value.trim().length > 0
  );
}

function normalizeString(value) {
  return isNonEmptyString(value)
    ? value.trim()
    : null;
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

      if (!/^(0|[1-9]\d*)$/.test(key)) {
        return {
          ok: false,

          issue:
            createCompositorIssue(
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

const VIEWPORT_CAPACITY =
  CONSUMED_CAPACITY_VALUES
    .viewportCapacity;

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

    snapshotsPublicMutationInputsStrictly: true,
    snapshotsDirectPublicEvaluatorInputsStrictly: true,
    snapshotsDirectPublicCameraPoseResolverInputsStrictly: true,
    requiresExplicitRevisionForExplicitCameraPoseResolution: true,
    snapshotsConsumedCapacityValuesLocally: true,
    embedsImportedMutableCapacityReferences: false,
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
      'INITIAL_DISTANCE_MULTIPLIED_BY_ZOOM_SCALE',

    positionViolationPolicy:
      'CLAMP_TARGET_THEN_REDUCE_ZOOM_SCALE_THEN_REJECT',

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
            INITIAL_TARGET.x,
            TARGET_BOUNDS.xMin,
            TARGET_BOUNDS.xMax
          ),

        y:
          clamp(
            INITIAL_TARGET.y,
            TARGET_BOUNDS.yMin,
            TARGET_BOUNDS.yMax
          ),

        z:
          clamp(
            INITIAL_TARGET.z,
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
        .inertiaDamping ??
      0.88,

    minimumVelocity:
      INTERACTION_CAPACITY
        .inertiaMinimumVelocity ??
      0.018,

    maximumFrames:
      INTERACTION_CAPACITY
        .inertiaMaximumFrames ??
      90,

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

    composition:
      'FRAME_COMPOSITION_ADVANCES_NO_REVISIONS',

    rejectedInertiaAdvancement:
      'A_REJECTED_INERTIA_ADVANCEMENT_MAY_ADVANCE_INERTIA_AND_FRAME_REVISIONS_ONLY_TO_RECORD_FAIL_CLOSED_INERTIA_SHUTDOWN'
  });


/* ==========================================================================
 * 09 · INTENT TYPES AND EXACT PUBLIC INTENT SURFACES
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

    setVisibility:
      'H_EARTH_COMPOSITOR_INTENT_SET_VISIBILITY',

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

    [H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibility]:
      Object.freeze([
        'type',
        'visibility'
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

    compositorState
      .revisions
      .camera += 1;
  }

  if (viewportChanged) {
    compositorState.viewport =
      cloneKnownPlain(
        nextViewport
      );

    compositorState
      .revisions
      .viewport += 1;
  }

  if (visibilityChanged) {
    compositorState.visibility =
      cloneKnownPlain(
        nextVisibility
      );

    compositorState
      .revisions
      .visibility += 1;
  }

  if (inertiaChanged) {
    compositorState.inertia =
      cloneKnownPlain(
        nextInertia
      );

    compositorState
      .revisions
      .inertia += 1;
  }

  const materiallyChanged =
    cameraChanged ||
    viewportChanged ||
    visibilityChanged ||
    inertiaChanged;

  if (materiallyChanged) {
    compositorState
      .revisions
      .frame += 1;
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


/* ==========================================================================
 * 13 · CAMERA NORMALIZATION AND EVALUATION
 * ========================================================================== */

function clampTarget(target) {
  return createVector(
    clamp(
      target.x,
      TARGET_BOUNDS.xMin,
      TARGET_BOUNDS.xMax
    ),

    clamp(
      target.y,
      TARGET_BOUNDS.yMin,
      TARGET_BOUNDS.yMax
    ),

    clamp(
      target.z,
      TARGET_BOUNDS.zMin,
      TARGET_BOUNDS.zMax
    )
  );
}

function deriveCameraPosition({
  yawDegrees,
  pitchDegrees,
  zoomScale,
  target
}) {
  const yawRadians =
    toRadians(
      yawDegrees
    );

  const pitchRadians =
    toRadians(
      pitchDegrees
    );

  const distance =
    INITIAL_DISTANCE *
    zoomScale;

  const horizontalDistance =
    distance *
    Math.cos(
      pitchRadians
    );

  const offset =
    createVector(
      Math.sin(
        yawRadians
      ) *
        horizontalDistance,

      Math.sin(
        pitchRadians
      ) *
        distance,

      Math.cos(
        yawRadians
      ) *
        horizontalDistance
    );

  return {
    distance,

    position:
      addVector(
        target,
        offset
      )
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

  let derived =
    deriveCameraPosition(
      normalized
    );

  if (
    isPositionWithinBounds(
      derived.position
    )
  ) {
    return {
      eligible: true,
      adjusted: false,
      cameraState: normalized,
      derived
    };
  }

  let fittedScale =
    normalized.zoomScale;

  for (
    let attempt = 0;
    attempt < 32;
    attempt += 1
  ) {
    fittedScale =
      fittedScale -
      (
        fittedScale -
        ZOOM_SCALE_BOUNDS.minimum
      ) *
      0.25;

    const fittedCandidate = {
      ...normalized,

      zoomScale:
        clamp(
          fittedScale,
          ZOOM_SCALE_BOUNDS.minimum,
          ZOOM_SCALE_BOUNDS.maximum
        )
    };

    derived =
      deriveCameraPosition(
        fittedCandidate
      );

    if (
      isPositionWithinBounds(
        derived.position
      )
    ) {
      return {
        eligible: true,
        adjusted: true,

        adjustment:
          'ZOOM_SCALE_REDUCED_TO_RESOLVE_POSITION_BOUNDS',

        cameraState:
          fittedCandidate,

        derived
      };
    }
  }

  return {
    eligible: false,

    issue:
      createCompositorIssue(
        'CAMERA_POSITION_OUTSIDE_NAVIGATION_BOUNDS',
        'The camera state cannot be resolved inside compositor navigation bounds.',
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
        'The camera replacement input must contain exactly the declared fields.',
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
              value ?? null
          }
        )
      );
    }
  }

  if (
    isFiniteNumber(
      cameraCandidate.nearPlane
    ) &&
    !Object.is(
      cameraCandidate.nearPlane,
      CAPACITY_INITIAL_PROJECTION
        .nearPlane
    )
  ) {
    issues.push(
      createCompositorIssue(
        'CAMERA_NEAR_PLANE_NOT_PERMITTED',
        'The compositor camera replacement must preserve the fixed capacity-derived near plane.',
        {
          field:
            'nearPlane',

          expected:
            CAPACITY_INITIAL_PROJECTION
              .nearPlane,

          actual:
            cameraCandidate.nearPlane
        }
      )
    );
  }

  if (
    isFiniteNumber(
      cameraCandidate.farPlane
    ) &&
    !Object.is(
      cameraCandidate.farPlane,
      CAPACITY_INITIAL_PROJECTION
        .farPlane
    )
  ) {
    issues.push(
      createCompositorIssue(
        'CAMERA_FAR_PLANE_NOT_PERMITTED',
        'The compositor camera replacement must preserve the fixed capacity-derived far plane.',
        {
          field:
            'farPlane',

          expected:
            CAPACITY_INITIAL_PROJECTION
              .farPlane,

          actual:
            cameraCandidate.farPlane
        }
      )
    );
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

  const normalizedCandidate = {
    yawDegrees:
      clamp(
        normalizeAngleDegrees(
          cameraCandidate.yawDegrees
        ),
        YAW_BOUNDS.minimum,
        YAW_BOUNDS.maximum
      ),

    pitchDegrees:
      clamp(
        cameraCandidate.pitchDegrees,
        PITCH_BOUNDS.minimum,
        PITCH_BOUNDS.maximum
      ),

    zoomScale:
      clamp(
        cameraCandidate.zoomScale,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      ),

    target:
      clampTarget(
        cameraCandidate.target
      ),

    verticalFovDegrees:
      clamp(
        cameraCandidate.verticalFovDegrees,
        FOV_BOUNDS.minimum,
        FOV_BOUNDS.maximum
      ),

    nearPlane:
      CAPACITY_INITIAL_PROJECTION
        .nearPlane,

    farPlane:
      CAPACITY_INITIAL_PROJECTION
        .farPlane
  };

  const fit =
    fitCameraToPositionBounds(
      normalizedCandidate
    );

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
      deepFreeze(
        cloneKnownPlain(
          fit.cameraState
        )
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
          )
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
        .cameraState
        .target
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
        .cameraState
        .verticalFovDegrees,

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
 * 15 · VIEWPORT EVALUATION
 * ========================================================================== */

function evaluateCompositorViewportSnapshot(
  viewportCandidate
) {
  const issues = [];

  if (!isPlainRecord(viewportCandidate)) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_NOT_ELIGIBLE',

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      issues: freezeIssues([
        createCompositorIssue(
          'VIEWPORT_NOT_RECORD',
          'The viewport input must be a strict plain-record object.'
        )
      ])
    });
  }

  const keyEvaluation =
    evaluateExactKeySurface(
      viewportCandidate,
      REQUIRED_VIEWPORT_INPUT_KEYS
    );

  if (!keyEvaluation.ok) {
    issues.push(
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
    );
  }

  const {
    widthPx,
    heightPx,
    pixelRatio
  } = viewportCandidate;

  if (!isPositiveFiniteNumber(widthPx)) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_WIDTH_INVALID',
        'Viewport width must be positive and finite.',
        {
          field:
            'widthPx',

          actual:
            widthPx ??
            null
        }
      )
    );
  }

  if (!isPositiveFiniteNumber(heightPx)) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_HEIGHT_INVALID',
        'Viewport height must be positive and finite.',
        {
          field:
            'heightPx',

          actual:
            heightPx ??
            null
        }
      )
    );
  }

  if (!isPositiveFiniteNumber(pixelRatio)) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_PIXEL_RATIO_INVALID',
        'Viewport pixel ratio must be positive and finite.',
        {
          field:
            'pixelRatio',

          actual:
            pixelRatio ??
            null
        }
      )
    );
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'VIEWPORT_NOT_ELIGIBLE',

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      issues:
        freezeIssues(issues)
    });
  }

  const aspectRatio =
    widthPx /
    heightPx;

  const orientation =
    aspectRatio > 1.05
      ? 'LANDSCAPE'
      : aspectRatio < 0.95
        ? 'PORTRAIT'
        : 'SQUARE';

  const minimumWidth =
    VIEWPORT_CAPACITY
      .minimumWidthPx ??
    1;

  const minimumHeight =
    VIEWPORT_CAPACITY
      .minimumHeightPx ??
    1;

  const maximumWidth =
    VIEWPORT_CAPACITY
      .maximumWidthPx ??
    Number.POSITIVE_INFINITY;

  const maximumHeight =
    VIEWPORT_CAPACITY
      .maximumHeightPx ??
    Number.POSITIVE_INFINITY;

  const locallyWithinEnvelope =
    widthPx >= minimumWidth &&
    heightPx >= minimumHeight &&
    widthPx <= maximumWidth &&
    heightPx <= maximumHeight;

  if (!locallyWithinEnvelope) {
    issues.push(
      createCompositorIssue(
        'VIEWPORT_OUTSIDE_LOCAL_CAPACITY_ENVELOPE',
        'The viewport falls outside the compositor fail-fast capacity envelope.',
        {
          expected:
            deepFreeze({
              minimumWidth,
              minimumHeight,
              maximumWidth,
              maximumHeight
            }),

          actual:
            deepFreeze({
              widthPx,
              heightPx
            })
        }
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'VIEWPORT_LOCALLY_ELIGIBLE'
        : 'VIEWPORT_NOT_ELIGIBLE',

    viewport:
      deepFreeze({
        widthPx,
        heightPx,
        pixelRatio,
        aspectRatio,
        orientation,

        capacityStatus:
          locallyWithinEnvelope
            ? 'WITHIN_CAPACITY'
            : 'OUTSIDE_CAPACITY'
      }),

    capacityAuthority:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    finalFrameEligibilityAuthority:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    issues:
      freezeIssues(issues)
  });
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

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      issues:
        freezeIssues([
          snapshot.issue
        ])
    });
  }

  return evaluateCompositorViewportSnapshot(
    snapshot.value
  );
}


/* ==========================================================================
 * 16 · VISIBILITY EVALUATION
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
 * 17 · PUBLIC CAMERA, VIEWPORT, AND VISIBILITY MUTATIONS
 * ========================================================================== */

export function setHEarth3DCompositorCameraState(
  cameraCandidate
) {
  const snapshot =
    strictSnapshot(
      cameraCandidate,
      'cameraCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'CAMERA_UPDATE_REJECTED',

      issues: freezeIssues([
        snapshot.issue
      ])
    });
  }

  const evaluation =
    evaluateCompositorCameraStateSnapshot(
      snapshot.value
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'CAMERA_UPDATE_REJECTED',

      evaluation,

      issues:
        evaluation.issues
    });
  }

  const transaction =
    commitCompositorMutation({
      nextCamera:
        evaluation.cameraState
    });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_CAMERA_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      updated:
        transaction.cameraChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.cameraChanged
          ? 'CAMERA_STATE_UPDATED'
          : 'CAMERA_STATE_UNCHANGED',

      camera:
        deepFreeze(
          cloneKnownPlain(
            compositorState.camera
          )
        ),

      revisions:
        transaction.revisions,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });

  compositorOperationalReceipts.camera =
    receipt;

  return receipt;
}

export function setHEarth3DCompositorViewport(
  viewportCandidate
) {
  const snapshot =
    strictSnapshot(
      viewportCandidate,
      'viewportCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'VIEWPORT_UPDATE_REJECTED',

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      issues: freezeIssues([
        snapshot.issue
      ])
    });
  }

  const evaluation =
    evaluateCompositorViewportSnapshot(
      snapshot.value
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'VIEWPORT_UPDATE_REJECTED',

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      evaluation,

      issues:
        evaluation.issues
    });
  }

  const transaction =
    commitCompositorMutation({
      nextViewport:
        evaluation.viewport
    });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_VIEWPORT_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      updated:
        transaction.viewportChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.viewportChanged
          ? 'VIEWPORT_STATE_UPDATED'
          : 'VIEWPORT_STATE_UNCHANGED',

      viewport:
        deepFreeze(
          cloneKnownPlain(
            compositorState.viewport
          )
        ),

      revisions:
        transaction.revisions,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });

  compositorOperationalReceipts.viewport =
    receipt;

  return receipt;
}

export function setHEarth3DCompositorVisibility(
  visibilityCandidate
) {
  const snapshot =
    strictSnapshot(
      visibilityCandidate,
      'visibilityCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      accepted: false,
      updated: false,
      materiallyChanged: false,

      status:
        'VISIBILITY_UPDATE_REJECTED',

      issues: freezeIssues([
        snapshot.issue
      ])
    });
  }

  const evaluation =
    evaluateCompositorVisibilitySnapshot(
      snapshot.value
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

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_VISIBILITY_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      updated:
        transaction.visibilityChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.visibilityChanged
          ? 'VISIBILITY_STATE_UPDATED'
          : 'VISIBILITY_STATE_UNCHANGED',

      visibility:
        deepFreeze(
          cloneKnownPlain(
            compositorState.visibility
          )
        ),

      admittedGeometryMutated:
        false,

      presentationAssignmentMutated:
        false,

      revisions:
        transaction.revisions,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
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

function applyCameraCandidate(
  candidate
) {
  const evaluation =
    evaluateCompositorCameraStateSnapshot(
      candidate
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      accepted: false,
      materiallyChanged: false,
      evaluation
    });
  }

  const transaction =
    commitCompositorMutation({
      nextCamera:
        evaluation.cameraState
    });

  return deepFreeze({
    accepted: true,

    materiallyChanged:
      transaction.materiallyChanged,

    evaluation,
    transaction
  });
}

function applyOrbitOperation(
  intent
) {
  const candidate =
    cloneKnownPlain(
      compositorState.camera
    );

  candidate.yawDegrees +=
    intent.yawDeltaDegrees;

  candidate.pitchDegrees +=
    intent.pitchDeltaDegrees;

  return applyCameraCandidate(
    candidate
  );
}

function applyPanOperation(
  intent
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
          intent.horizontalDelta
        ),
        addVector(
          scaleVector(
            axes.up,
            intent.verticalDelta
          ),
          scaleVector(
            axes.forward,
            intent.depthDelta
          )
        )
      )
    );

  return applyCameraCandidate(
    candidate
  );
}

function applyZoomOperation(
  intent
) {
  const candidate =
    cloneKnownPlain(
      compositorState.camera
    );

  candidate.zoomScale +=
    intent.zoomScaleDelta;

  return applyCameraCandidate(
    candidate
  );
}


/* ==========================================================================
 * 19 · INERTIA
 * ========================================================================== */

function evaluateInertiaVelocity(
  velocityCandidate
) {
  const issues = [];

  if (!isPlainRecord(velocityCandidate)) {
    return deepFreeze({
      eligible: false,

      status:
        'INERTIA_VELOCITY_NOT_ELIGIBLE',

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
    !isNonEmptyString(
      velocityCandidate.mode
    )
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

export function startHEarth3DCompositorInertia(
  velocityCandidate
) {
  const snapshot =
    strictSnapshot(
      velocityCandidate,
      'velocityCandidate'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      accepted: false,
      started: false,
      updated: false,
      materiallyChanged: false,

      status:
        'COMPOSITOR_INERTIA_START_REJECTED',

      issues: freezeIssues([
        snapshot.issue
      ])
    });
  }

  const evaluation =
    evaluateInertiaVelocity(
      snapshot.value
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      accepted: false,
      started: false,
      updated: false,
      materiallyChanged: false,

      status:
        'COMPOSITOR_INERTIA_START_REJECTED',

      evaluation,

      issues:
        evaluation.issues
    });
  }

  const velocity =
    evaluation.velocity;

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

  const shouldBeActive =
    H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
      .enabled &&
    maximumVelocity >=
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY
        .minimumVelocity;

  const nextInertia = {
    active:
      shouldBeActive,

    mode:
      shouldBeActive
        ? velocity.mode
        : 'IDLE',

    yawVelocity:
      shouldBeActive
        ? velocity.yawVelocity
        : 0,

    pitchVelocity:
      shouldBeActive
        ? velocity.pitchVelocity
        : 0,

    panHorizontalVelocity:
      shouldBeActive
        ? velocity.panHorizontalVelocity
        : 0,

    panVerticalVelocity:
      shouldBeActive
        ? velocity.panVerticalVelocity
        : 0,

    panDepthVelocity:
      shouldBeActive
        ? velocity.panDepthVelocity
        : 0,

    zoomVelocity:
      shouldBeActive
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
  };

  const transaction =
    commitCompositorMutation({
      nextInertia
    });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      started:
        shouldBeActive &&
        transaction.inertiaChanged,

      updated:
        transaction.inertiaChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        shouldBeActive
          ? transaction.inertiaChanged
            ? 'COMPOSITOR_INERTIA_STARTED'
            : 'COMPOSITOR_INERTIA_UNCHANGED'
          : transaction.inertiaChanged
            ? 'COMPOSITOR_INERTIA_NORMALIZED_TO_IDLE'
            : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

      inertia:
        deepFreeze(
          cloneKnownPlain(
            compositorState.inertia
          )
        ),

      revisions:
        transaction.revisions
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}

export function stopHEarth3DCompositorInertia() {
  const nextInertia =
    cloneKnownPlain(
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE
    );

  const transaction =
    commitCompositorMutation({
      nextInertia
    });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      stopped:
        transaction.inertiaChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.inertiaChanged
          ? 'COMPOSITOR_INERTIA_STOPPED'
          : 'COMPOSITOR_INERTIA_ALREADY_IDLE',

      inertia:
        deepFreeze(
          cloneKnownPlain(
            compositorState.inertia
          )
        ),

      revisions:
        transaction.revisions
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}

export function advanceHEarth3DCompositorInertia() {
  const currentInertia =
    cloneKnownPlain(
      compositorState.inertia
    );

  if (!currentInertia.active) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        accepted:
          true,

        advanced:
          false,

        materiallyChanged:
          false,

        status:
          'COMPOSITOR_INERTIA_NOT_ACTIVE',

        revisions:
          deepFreeze(
            cloneKnownPlain(
              compositorState.revisions
            )
          )
      });

    compositorOperationalReceipts.inertia =
      receipt;

    return receipt;
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
    return stopHEarth3DCompositorInertia();
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
    const stopReceipt =
      stopHEarth3DCompositorInertia();

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        accepted:
          false,

        advanced:
          false,

        materiallyChanged:
          stopReceipt
            .materiallyChanged === true,

        failClosedShutdownPerformed:
          stopReceipt
            .materiallyChanged === true,

        status:
          'COMPOSITOR_INERTIA_CAMERA_UPDATE_REJECTED_AND_STOPPED_FAIL_CLOSED',

        cameraEvaluation,

        stopReceipt,

        revisions:
          deepFreeze(
            cloneKnownPlain(
              compositorState.revisions
            )
          )
      });

    compositorOperationalReceipts.inertia =
      receipt;

    return receipt;
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

  const transaction =
    commitCompositorMutation({
      nextCamera:
        cameraEvaluation.cameraState,

      nextInertia
    });

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INERTIA_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      advanced:
        transaction.materiallyChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      failClosedShutdownPerformed:
        false,

      status:
        transaction.materiallyChanged
          ? 'COMPOSITOR_INERTIA_FRAME_ADVANCED'
          : 'COMPOSITOR_INERTIA_FRAME_UNCHANGED',

      frameCount:
        compositorState
          .inertia
          .frameCount,

      cameraChanged:
        transaction.cameraChanged,

      inertiaChanged:
        transaction.inertiaChanged,

      revisions:
        transaction.revisions,

      inertia:
        deepFreeze(
          cloneKnownPlain(
            compositorState.inertia
          )
        )
    });

  compositorOperationalReceipts.inertia =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 20 · INTENT EVALUATION
 * ========================================================================== */

export function evaluateHEarth3DCompositorIntent(
  intent
) {
  const snapshot =
    strictSnapshot(
      intent,
      'intent'
    );

  if (!snapshot.ok) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_INTENT_NOT_ELIGIBLE',

      intent: null,

      issues: freezeIssues([
        snapshot.issue
      ])
    });
  }

  const intentSnapshot =
    snapshot.value;

  if (!isPlainRecord(intentSnapshot)) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_INTENT_NOT_ELIGIBLE',

      intent: null,

      issues: freezeIssues([
        createCompositorIssue(
          'COMPOSITOR_INTENT_NOT_RECORD',
          'A compositor intent must be a strict plain-record object.'
        )
      ])
    });
  }

  const type =
    normalizeString(
      intentSnapshot.type
    );

  if (
    !type ||
    !Object.prototype.hasOwnProperty.call(
      REQUIRED_INTENT_KEYS_BY_TYPE,
      type
    )
  ) {
    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_INTENT_NOT_ELIGIBLE',

      intent:
        intentSnapshot,

      issues: freezeIssues([
        createCompositorIssue(
          'COMPOSITOR_INTENT_TYPE_INVALID',
          'The compositor intent type is missing or unknown.',
          {
            field:
              'type',

            actual:
              type
          }
        )
      ])
    });
  }

  const requiredKeys =
    REQUIRED_INTENT_KEYS_BY_TYPE[
      type
    ];

  const keyEvaluation =
    evaluateExactKeySurface(
      intentSnapshot,
      requiredKeys
    );

  const issues = [];

  if (!keyEvaluation.ok) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_INTENT_KEY_SURFACE_INVALID',
        'The intent must contain exactly the fields declared for its type.',
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

  switch (type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      if (
        !isFiniteNumber(
          intentSnapshot.yawDeltaDegrees
        ) ||
        !isFiniteNumber(
          intentSnapshot.pitchDeltaDegrees
        )
      ) {
        issues.push(
          createCompositorIssue(
            'ORBIT_DELTA_INVALID',
            'Orbit deltas must be finite.'
          )
        );
      } else if (
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
        !isFiniteNumber(
          intentSnapshot.horizontalDelta
        ) ||
        !isFiniteNumber(
          intentSnapshot.verticalDelta
        ) ||
        !isFiniteNumber(
          intentSnapshot.depthDelta
        )
      ) {
        issues.push(
          createCompositorIssue(
            'PAN_DELTA_INVALID',
            'Pan deltas must be finite.'
          )
        );
      } else if (
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
        !isFiniteNumber(
          intentSnapshot.zoomScaleDelta
        )
      ) {
        issues.push(
          createCompositorIssue(
            'ZOOM_DELTA_INVALID',
            'Zoom delta must be finite.'
          )
        );
      } else if (
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
      {
        const evaluation =
          evaluateCompositorCameraStateSnapshot(
            intentSnapshot.cameraState
          );

        if (!evaluation.eligible) {
          issues.push(
            ...evaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      {
        const evaluation =
          evaluateCompositorViewportSnapshot(
            intentSnapshot.viewport
          );

        if (!evaluation.eligible) {
          issues.push(
            ...evaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibility:
      {
        const evaluation =
          evaluateCompositorVisibilitySnapshot(
            intentSnapshot.visibility
          );

        if (!evaluation.eligible) {
          issues.push(
            ...evaluation.issues
          );
        }
      }
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      {
        const evaluation =
          evaluateInertiaVelocity(
            intentSnapshot.velocity
          );

        if (!evaluation.eligible) {
          issues.push(
            ...evaluation.issues
          );
        }
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

    status:
      issues.length === 0
        ? 'COMPOSITOR_INTENT_ELIGIBLE'
        : 'COMPOSITOR_INTENT_NOT_ELIGIBLE',

    intent:
      intentSnapshot,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 21 · INTENT APPLICATION
 * ========================================================================== */

export function applyHEarth3DCompositorIntent(
  intent
) {
  compositorState.intentSequence += 1;

  const sequence =
    compositorState.intentSequence;

  const evaluation =
    evaluateHEarth3DCompositorIntent(
      intent
    );

  if (!evaluation.eligible) {
    const rejectedIntent =
      deepFreeze({
        sequence,

        intent:
          evaluation.intent,

        issues:
          evaluation.issues
      });

    compositorState.lastRejectedIntent =
      rejectedIntent;

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_COMPOSITOR_INTENT_RECEIPT',

        contractId:
          H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

        sequence,

        accepted: false,

        materiallyChanged: false,

        status:
          'COMPOSITOR_INTENT_REJECTED',

        evaluation,

        revisions:
          deepFreeze(
            cloneKnownPlain(
              compositorState.revisions
            )
          ),

        rendererPassClaim: false,
        visualPassClaim: false,
        validationClaim: false
      });

    compositorOperationalReceipts.intent =
      receipt;

    return receipt;
  }

  const intentSnapshot =
    evaluation.intent;

  let operationResult;

  switch (intentSnapshot.type) {
    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit:
      operationResult =
        applyOrbitOperation(
          intentSnapshot
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan:
      operationResult =
        applyPanOperation(
          intentSnapshot
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom:
      operationResult =
        applyZoomOperation(
          intentSnapshot
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState:
      operationResult =
        setHEarth3DCompositorCameraState(
          intentSnapshot.cameraState
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setViewport:
      operationResult =
        setHEarth3DCompositorViewport(
          intentSnapshot.viewport
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setVisibility:
      operationResult =
        setHEarth3DCompositorVisibility(
          intentSnapshot.visibility
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.startInertia:
      operationResult =
        startHEarth3DCompositorInertia(
          intentSnapshot.velocity
        );
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.advanceInertia:
      operationResult =
        advanceHEarth3DCompositorInertia();
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.stopInertia:
      operationResult =
        stopHEarth3DCompositorInertia();
      break;

    case H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView:
      {
        const transaction =
          commitCompositorMutation({
            nextCamera:
              H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

            nextInertia:
              H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE
          });

        operationResult =
          deepFreeze({
            accepted:
              true,

            reset:
              transaction.materiallyChanged,

            materiallyChanged:
              transaction.materiallyChanged,

            cameraChanged:
              transaction.cameraChanged,

            inertiaChanged:
              transaction.inertiaChanged,

            status:
              transaction.materiallyChanged
                ? 'COMPOSITOR_VIEW_RESET'
                : 'COMPOSITOR_VIEW_ALREADY_RESET',

            revisions:
              transaction.revisions
          });

        compositorOperationalReceipts.reset =
          operationResult;
      }
      break;

    default:
      operationResult =
        deepFreeze({
          accepted: false,

          materiallyChanged: false,

          status:
            'COMPOSITOR_INTENT_OPERATION_UNRESOLVED'
        });
      break;
  }

  const accepted =
    operationResult.accepted ===
    true;

  const materiallyChanged =
    operationResult.materiallyChanged ===
      true ||
    operationResult.transaction
      ?.materiallyChanged ===
      true;

  const recordedIntent =
    deepFreeze({
      sequence,

      intent:
        intentSnapshot,

      accepted,

      materiallyChanged,

      operationResult:
        deepFreeze(
          cloneKnownPlain(
            operationResult
          )
        )
    });

  if (accepted) {
    compositorState.lastAcceptedIntent =
      recordedIntent;
  } else {
    compositorState.lastRejectedIntent =
      recordedIntent;
  }

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_INTENT_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      sequence,

      accepted,

      materiallyChanged,

      status:
        accepted
          ? materiallyChanged
            ? 'COMPOSITOR_INTENT_ACCEPTED_CHANGED'
            : 'COMPOSITOR_INTENT_ACCEPTED_UNCHANGED'
          : materiallyChanged
            ? 'COMPOSITOR_INTENT_REJECTED_WITH_FAIL_CLOSED_STATE_CHANGE'
            : 'COMPOSITOR_INTENT_OPERATION_REJECTED',

      intent:
        intentSnapshot,

      operationResult:
        deepFreeze(
          cloneKnownPlain(
            operationResult
          )
        ),

      revisions:
        deepFreeze(
          cloneKnownPlain(
            compositorState.revisions
          )
        ),

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
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
        deepFreeze(
          cloneKnownPlain(
            compositorState.camera
          )
        ),

      viewport:
        deepFreeze(
          cloneKnownPlain(
            compositorState.viewport
          )
        ),

      visibility:
        deepFreeze(
          cloneKnownPlain(
            compositorState.visibility
          )
        ),

      inertia:
        deepFreeze(
          cloneKnownPlain(
            compositorState.inertia
          )
        ),

      revisions:
        deepFreeze(
          cloneKnownPlain(
            compositorState.revisions
          )
        ),

      intentSequence:
        compositorState.intentSequence,

      lastAcceptedIntent:
        compositorState.lastAcceptedIntent,

      lastRejectedIntent:
        compositorState.lastRejectedIntent
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
    normalizeString(
      input.packet002TransferOccurrenceId
    );

  const compositorFrameOccurrenceId =
    normalizeString(
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
        'packet002TransferOccurrenceId must be a non-empty string.',
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
        'compositorFrameOccurrenceId must be a non-empty string.',
        {
          field:
            'compositorFrameOccurrenceId'
        }
      )
    );
  }

  if (
    presentationMode !==
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_PRESENTATION_MODE_INVALID',
        'The current compositor admits only FIRST_ADMITTED_WET_SAND_PROOF.',
        {
          field:
            'presentationMode',

          expected:
            H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,

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

  const earlyViewportEvaluation =
    evaluateHEarth3DViewportCapacity(
      compositorStateSnapshot.viewport
    );

  if (
    !isPlainRecord(
      earlyViewportEvaluation
    ) ||
    earlyViewportEvaluation.eligible !==
      true
  ) {
    return createRejectedCompositionResult(
      'COMPOSITOR_EARLY_VIEWPORT_CAPACITY_REJECTION',
      [
        createCompositorIssue(
          'EARLY_VIEWPORT_CAPACITY_NOT_ELIGIBLE',
          'The viewport failed compositor fail-fast capacity evaluation.',
          {
            details:
              earlyViewportEvaluation ??
              null
          }
        )
      ],
      {
        packet002TransferOccurrenceId,
        compositorFrameOccurrenceId
      }
    );
  }

  const earlyCameraEvaluation =
    evaluateHEarth3DCameraPose(
      resolvedCameraPose
    );

  if (
    !isPlainRecord(
      earlyCameraEvaluation
    ) ||
    earlyCameraEvaluation.eligible !==
      true
  ) {
    return createRejectedCompositionResult(
      'COMPOSITOR_EARLY_CAMERA_CAPACITY_REJECTION',
      [
        createCompositorIssue(
          'EARLY_CAMERA_CAPACITY_NOT_ELIGIBLE',
          'The resolved camera pose failed compositor fail-fast capacity evaluation.',
          {
            details:
              earlyCameraEvaluation ??
              null
          }
        )
      ],
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

      capacityValuesLocallySnapshotted:
        true,

      compositorContractReferencesImportedCapacityObjectIdentities:
        false,

      capacityAuthority:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      finalFrameEligibilityAuthority:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      initialCameraStateEligible:
        initialCameraEvaluation
          .eligible === true,

      fixedNearPlaneEnforced:
        true,

      fixedFarPlaneEnforced:
        true,

      resolvedCameraPoseIncludesCameraRevision:
        true,

      directPublicEvaluatorSnapshottingDefined:
        true,

      directPublicCameraPoseResolverSnapshottingDefined:
        true,

      explicitCameraPoseRevisionRequired:
        true,

      packet002DeepFreezeByCompositor:
        false,

      initialViewportResolved:
        false,

      packet002OccurrencePresent:
        false,

      admittedGeometryFramePresent:
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
  return deepFreeze(
    cloneKnownPlain(
      compositorOperationalReceipts
    )
  );
}


/* ==========================================================================
 * 30 · RESET
 * ========================================================================== */

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
    deepFreeze({
      receiptType:
        'H_EARTH_3D_COMPOSITOR_RESET_RECEIPT',

      contractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      accepted:
        true,

      reset:
        transaction.materiallyChanged,

      materiallyChanged:
        transaction.materiallyChanged,

      status:
        transaction.materiallyChanged
          ? 'COMPOSITOR_STATE_RESET'
          : 'COMPOSITOR_STATE_ALREADY_INITIAL',

      cameraChanged:
        transaction.cameraChanged,

      viewportChanged:
        transaction.viewportChanged,

      visibilityChanged:
        transaction.visibilityChanged,

      inertiaChanged:
        transaction.inertiaChanged,

      revisions:
        transaction.revisions,

      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false
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

    consumedCapacityValuesSnapshottedLocally:
      true,

    importedCapacityObjectIdentityEmbeddedInCompositorContract:
      false,

    importedCapacityFreezeStateMutationIntended:
      false,

    frameRootCompleteOwnKeyValidationDefined:
      true,

    frameRootSymbolKeyRejectionDefined:
      true,

    frameRootNonEnumerableKeyRejectionDefined:
      true,

    frameRootAccessorRejectionDefined:
      true,

    frameRootValidationOccursBeforePropertyRead:
      true,

    resolvedCameraPoseIncludesCameraRevision:
      true,

    resolvedCameraRevisionDerivedFromCapturedSnapshot:
      true,

    directCameraPoseResolverStrictSnapshottingDefined:
      true,

    explicitCameraStateRequiresExplicitRevision:
      true,

    zeroArgumentCameraPoseResolutionUsesInternalMatchingStateAndRevision:
      true,

    packet002TransferPreservedByReference:
      true,

    packet002TransferDeepFrozenByCompositor:
      false,

    frameInputEvaluationEnvelopeShallowFrozen:
      true,

    directCameraEvaluatorStrictSnapshottingDefined:
      true,

    directViewportEvaluatorStrictSnapshottingDefined:
      true,

    directVisibilityEvaluatorStrictSnapshottingDefined:
      true,

    capacityAuthorityIdentifiedAsCapacityContract:
      true,

    finalFrameEligibilityAuthorityIdentifiedAsStep034O7:
      true,

    capacityAuthority:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    finalFrameEligibilityAuthority:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    environmentDescriptorFramePathRemoved:
      true,

    staticDescriptorHandoffRemoved:
      true,

    packet002InputExplicit:
      true,

    presentationModeDefault:
      null,

    presentationModeMustBeExplicit:
      true,

    compositorStateSnapshotExact:
      true,

    compositorStateCapturedOncePerComposition:
      true,

    cameraPoseCorrespondenceDerivedFromCapturedSnapshot:
      true,

    unresolvedViewportRejectedForComposition:
      true,

    frameCompositionMutatesCompositorCompositionState:
      false,

    rendererHandoffMutatesCompositorCompositionState:
      false,

    frameCompositionMayUpdateNonAuthoritativeReceiptLedger:
      true,

    rendererHandoffMayUpdateNonAuthoritativeReceiptLedger:
      true,

    frameCompositionAdvancesRevision:
      false,

    operationalReceiptLedgerSeparatedFromCompositorState:
      true,

    transactionStyleRevisionAdvancementDefined:
      true,

    oneFrameRevisionAdvancePerMaterialPublicMutation:
      true,

    identicalCameraStateDoesNotAdvanceRevision:
      true,

    identicalViewportStateDoesNotAdvanceRevision:
      true,

    identicalVisibilityStateDoesNotAdvanceRevision:
      true,

    idleInertiaStopDoesNotAdvanceRevision:
      true,

    rejectedInertiaAdvancementMayStopInertiaFailClosed:
      true,

    rejectedInertiaFailClosedShutdownAuditRequired:
      true,

    zeroEffectOrbitRejected:
      true,

    zeroEffectPanRejected:
      true,

    zeroEffectZoomRejected:
      true,

    fixedNearPlaneEnforced:
      true,

    fixedFarPlaneEnforced:
      true,

    invalidProjectionPlaneReplacementRejected:
      true,

    intentAcceptanceSeparatedFromMaterialChange:
      true,

    rendererRelevantMaterialityNarrowed:
      true,

    intentHistoryClassifiedAsOperationalCorrelationState:
      true,

    lawfulUnchangedIntentRecordedAsAccepted:
      true,

    rejectedOperationResultsExposeAcceptedFalse:
      true,

    strictPublicMutationSnapshottingDefined:
      true,

    thinOccurrenceBasedRendererHandoffDefined:
      true,

    compatibilityAliasesDelegateOnlyToAdmittedPath:
      true,

    moduleSyntaxVerified:
      false,

    importResolutionVerified:
      false,

    moduleInitializationVerified:
      false,

    controlledBehaviorVerified:
      false,

    importedCapacityFreezeStateUnchangedVerified:
      false,

    compositorCapacitySnapshotIdentitySeparationVerified:
      false,

    frameRootCompleteOwnKeyRejectionVerified:
      false,

    resolvedCameraRevisionCorrespondenceVerified:
      false,

    directCameraPoseResolverHardeningVerified:
      false,

    explicitCameraRevisionRequirementVerified:
      false,

    mutablePacket002FreezeStatePreservationVerified:
      false,

    frozenPacket002ReferenceIdentityVerified:
      false,

    directPublicEvaluatorHardeningVerified:
      false,

    rejectedInertiaFailClosedShutdownVerified:
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
      deepFreeze(
        cloneKnownPlain(
          CONSUMED_CAPACITY_VALUES
        )
      ),

    publicStageWorldBounds:
      deepFreeze(
        cloneKnownPlain(
          CONSUMED_CAPACITY_VALUES
            .publicStageWorldBounds
        )
      ),

    initialCameraState:
      H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,

    initialViewportState:
      H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE,

    initialVisibilityState:
      H_EARTH_3D_COMPOSITOR_INITIAL_VISIBILITY_STATE,

    initialInertiaState:
      H_EARTH_3D_COMPOSITOR_INITIAL_INERTIA_STATE,

    cameraConstraints:
      H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,

    inertiaPolicy:
      H_EARTH_3D_COMPOSITOR_INERTIA_POLICY,

    intentTypes:
      H_EARTH_3D_COMPOSITOR_INTENT_TYPES,

    revisionLaw:
      H_EARTH_3D_COMPOSITOR_REVISION_LAW,

    compositorSnapshotLaw:
      'EXACT_EXTERNAL_BRIDGE_SNAPSHOT_WITH_IMPLEMENTATION_PRIVATE_INTERNAL_STATE',

    publicMutationSnapshotLaw:
      'STRICT_BOUNDED_SNAPSHOT_FOR_CALLER_OWNED_MUTATION_INPUTS',

    publicEvaluatorSnapshotLaw:
      'DIRECT_PUBLIC_CAMERA_VIEWPORT_AND_VISIBILITY_EVALUATORS_STRICTLY_SNAPSHOT_CALLER_OWNED_INPUT_BEFORE_INTERNAL_EVALUATION',

    publicCameraPoseResolverLaw:
      'ZERO_ARGUMENT_RESOLUTION_USES_MATCHING_INTERNAL_CAMERA_AND_REVISION_WHILE_EXPLICIT_CAMERA_INPUT_REQUIRES_STRICT_SNAPSHOTTING_AND_AN_EXPLICIT_NONNEGATIVE_SAFE_INTEGER_REVISION',

    capacityConsumptionLaw:
      'COMPOSITOR_CONTRACTS_AND_OPERATIONAL_ALIASES_USE_COMPOSITOR_OWNED_VALUE_SNAPSHOTS_NOT_IMPORTED_CAPACITY_OBJECT_IDENTITIES',

    importedCapacityOwnershipLaw:
      'COMPOSITOR_INITIALIZATION_MUST_NOT_CHANGE_IMPORTED_CAPACITY_OBJECT_FREEZE_STATE_OR_PROPERTY_DESCRIPTORS',

    frameRootValidationLaw:
      'FRAME_COMPOSITION_ROOT_COMPLETE_OWN_KEY_AND_DESCRIPTOR_VALIDATION_OCCURS_BEFORE_ANY_INPUT_PROPERTY_ACCESS',

    packet002ReferenceLaw:
      'PRESERVE_PRODUCER_OWNED_PACKET_002_REFERENCE_WITHOUT_CLONING_OR_DEEP_FREEZING',

    frameInputEnvelopeFreezeLaw:
      'FRAME_INPUT_EVALUATION_RESULT_IS_SHALLOW_FROZEN_SO_PACKET_002_FREEZE_STATE_AND_IDENTITY_ARE_NOT_CHANGED',

    compositionReadLaw:
      'CAPTURE_COMPOSITOR_STATE_EXACTLY_ONCE_PER_FRAME_COMPOSITION',

    cameraRevisionCorrespondenceLaw:
      'RESOLVED_CAMERA_POSE_REVISION_IS_EXPLICIT_AND_DERIVED_FROM_THE_SAME_CAPTURED_COMPOSITOR_SNAPSHOT_AS_THE_CAMERA_STATE',

    compositionMutationLaw:
      'FRAME_COMPOSITION_MUTATES_NO_CAMERA_VIEWPORT_VISIBILITY_INERTIA_REVISION_OR_INTENT_STATE',

    rendererHandoffMutationLaw:
      'RENDERER_HANDOFF_MUTATES_NO_CAMERA_VIEWPORT_VISIBILITY_INERTIA_REVISION_OR_INTENT_STATE',

    receiptLedgerLaw:
      'NON_AUTHORITATIVE_OPERATIONAL_RECEIPTS_ARE_RECORDED_OUTSIDE_COMPOSITOR_COMPOSITION_STATE',

    capacityAuthorityLaw:
      'CAPACITY_JS_REMAINS_THE_CAMERA_AND_VIEWPORT_CAPACITY_AUTHORITY',

    finalFrameEligibilityLaw:
      'STEP_034O_7_REVALIDATES_CAPACITY_AND_IS_THE_FINAL_ADMITTED_FRAME_ELIGIBILITY_BOUNDARY',

    projectionPlaneAuthorityLaw:
      'NEAR_AND_FAR_PLANES_ARE_FIXED_CAPACITY_DERIVED_PROJECTION_VALUES',

    intentOutcomeLaw:
      'ELIGIBILITY_IS_LAWFULNESS_ACCEPTANCE_IS_PROCESSING_AND_MATERIAL_CHANGE_IS_RENDERER_RELEVANT_CAMERA_VIEWPORT_VISIBILITY_INERTIA_OR_ASSOCIATED_REVISION_CHANGE',

    intentHistoryLaw:
      'INTENT_SEQUENCE_AND_ACCEPTED_OR_REJECTED_HISTORY_ARE_OPERATIONAL_CORRELATION_STATE_AND_DO_NOT_BY_THEMSELVES_ADVANCE_RENDERER_RELEVANT_REVISIONS',

    rejectedInertiaAdvancementLaw:
      'REJECTED_INERTIA_ADVANCEMENT_MAY_PERFORM_FAIL_CLOSED_INERTIA_SHUTDOWN_AND_REPORT_ACCEPTED_FALSE_WITH_MATERIALLY_CHANGED_TRUE',

    presentationModeDefault:
      null,

    presentationModeMustBeExplicit:
      true,

    visibilityLaw:
      'PRESENTATION_VISIBILITY_IS_RENDERER_CONSUMED_CONTROL_NOT_ADMISSION_OR_GEOMETRY_MUTATION',

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
