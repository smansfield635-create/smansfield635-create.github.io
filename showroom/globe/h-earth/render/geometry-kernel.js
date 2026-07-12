/**
 * /showroom/globe/h-earth/render/geometry-kernel.js
 * COMPLETE FILE
 *
 * H_EARTH_3D_GEOMETRY_KERNEL_FILE_BIRTH_STEP_034O_4_RENDER_GEOMETRY_PROVIDER_KERNEL_v1
 *
 * Governing mathematics:
 * STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1
 *
 * Formal acceptance:
 * STEP_034O_4A_FORMAL_ACCEPTANCE_RECEIPT
 *
 * Frozen scope:
 * GEOMETRY_MATHEMATICS_ONLY
 *
 * Purpose:
 * Implement the shared, projection-neutral H-Earth geometry mathematics
 * constitution consumed by future geometry-provider files.
 *
 * This file owns:
 * - tolerance contexts
 * - scalar mathematics
 * - Vector2, Vector3, and Vector4 mathematics
 * - affine Matrix4 mathematics
 * - transform classification
 * - inverse-transpose normal transformation
 * - equation descriptors
 * - deterministic sampling
 * - indexed topology
 * - differential geometry
 * - XZ curve and ribbon mathematics
 * - neutral field equations
 * - ellipsoid and supported superellipsoid construction
 * - convex polygon analysis and triangulation
 * - extrusion, prism, gable roof, and shed roof construction
 * - dimension-aware AABB bounds
 * - primitive-specific validation
 * - submission preservation
 * - provider-output classification
 * - geometry accounting
 * - mathematical and provider-local budget helpers
 * - static implementation receipts
 *
 * This file does not own:
 * - Path 3 authority
 * - matrix identity authority outside geometry mathematics
 * - Ground Cell authority
 * - object, zone, boundary, or landscape-lattice truth
 * - environment truth
 * - semantic placement or semantic layer order
 * - camera, viewport, or navigation state
 * - compositor sequencing
 * - renderer projection
 * - CSS transforms
 * - DOM creation or mutation
 * - renderer lifecycle
 * - actor creation
 * - collision
 * - traversal
 * - gameplay
 * - fluid simulation
 * - renderer-pass approval
 * - visual-pass approval
 * - production authority
 * - public-release authority
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_CAPACITY_BINDING_IDENTITY,
  H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,
  H_EARTH_3D_NODE_BUDGET,
  H_EARTH_3D_RENDER_FRAME_CAPACITY,
  H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY,
  H_EARTH_3D_CAPACITY_CLAIM_CEILINGS,
  getHEarth3DCapacityReceipt,
  getHEarth3DCapacityPreflight
} from '../capacity.js';


/* ==========================================================================
 * 01 · CONSTANTS AND ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_FILE_BIRTH_STEP_034O_4_RENDER_GEOMETRY_PROVIDER_KERNEL_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_SCHEMA_VERSION = 1;

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID =
  'STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1';

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID =
  'STEP_034O_4A_FORMAL_ACCEPTANCE_RECEIPT';

export const H_EARTH_3D_GEOMETRY_TEST_FIXTURE_AMENDMENT_ID =
  'STEP_034O_4A_TEST_FIXTURE_DEFINITION_AMENDMENT_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_SCHEMA = deepFreeze({
  contractId:
    H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_GEOMETRY_KERNEL_SCHEMA_VERSION,

  mathematicsPacketId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

  acceptanceReceiptId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

  fixtureAmendmentId:
    H_EARTH_3D_GEOMETRY_TEST_FIXTURE_AMENDMENT_ID,

  mathematicsStandard:
    'FROZEN',

  frozenScope:
    'GEOMETRY_MATHEMATICS_ONLY'
});


export const H_EARTH_3D_GEOMETRY_ENUMS = deepFreeze({
  coordinateSystem: deepFreeze({
    RIGHT_HANDED_CARTESIAN:
      'RIGHT_HANDED_CARTESIAN'
  }),

  angleUnit: deepFreeze({
    DEGREES:
      'DEGREES',

    RADIANS:
      'RADIANS'
  }),

  transformClassification: deepFreeze({
    INVALID:
      'INVALID',

    AFFINE_SINGULAR:
      'AFFINE_SINGULAR',

    IDENTITY:
      'IDENTITY',

    RIGID:
      'RIGID',

    UNIFORM_SCALE:
      'UNIFORM_SCALE',

    AFFINE_INVERTIBLE:
      'AFFINE_INVERTIBLE'
  }),

  descriptorType: deepFreeze({
    PARAMETRIC_CURVE:
      'PARAMETRIC_CURVE',

    PARAMETRIC_SURFACE:
      'PARAMETRIC_SURFACE',

    HEIGHT_FIELD:
      'HEIGHT_FIELD',

    SIGNED_DISTANCE_FIELD:
      'SIGNED_DISTANCE_FIELD',

    RADIAL_SURFACE:
      'RADIAL_SURFACE',

    SCALAR_FIELD:
      'SCALAR_FIELD',

    PROFILE_CURVE:
      'PROFILE_CURVE',

    EXTRUSION_PATH:
      'EXTRUSION_PATH'
  }),

  descriptorClassification: deepFreeze({
    STRUCTURALLY_INVALID:
      'DESCRIPTOR_STRUCTURALLY_INVALID',

    STRUCTURALLY_VALID:
      'DESCRIPTOR_STRUCTURALLY_VALID',

    DOMAIN_INVALID:
      'DESCRIPTOR_DOMAIN_INVALID',

    EVALUATION_INVALID:
      'DESCRIPTOR_EVALUATION_INVALID',

    SAMPLEABLE:
      'DESCRIPTOR_SAMPLEABLE',

    UNSAMPLEABLE:
      'DESCRIPTOR_UNSAMPLEABLE',

    HELD:
      'DESCRIPTOR_HELD'
  }),

  evaluatorStatus: deepFreeze({
    EVALUATED:
      'EVALUATED',

    OUTSIDE_DOMAIN:
      'OUTSIDE_DOMAIN',

    NONFINITE:
      'NONFINITE',

    EXCEPTION:
      'EXCEPTION',

    HELD:
      'HELD'
  }),

  closure: deepFreeze({
    OPEN:
      'OPEN',

    CLOSED_PERIODIC:
      'CLOSED_PERIODIC',

    CLOSED:
      'CLOSED',

    UNSPECIFIED:
      'UNSPECIFIED'
  }),

  endpointPolicy: deepFreeze({
    INCLUDE_BOTH:
      'INCLUDE_BOTH_ENDPOINTS',

    NO_DUPLICATE_TERMINAL:
      'NO_DUPLICATE_TERMINAL_SAMPLE'
  }),

  normalOrientation: deepFreeze({
    U_CROSS_V:
      'U_CROSS_V',

    V_CROSS_U:
      'V_CROSS_U',

    EXPLICIT_INVERT:
      'EXPLICIT_INVERT'
  }),

  primitiveType: deepFreeze({
    POINT_3D:
      'POINT_3D',

    POLYLINE_3D:
      'POLYLINE_3D',

    POLYGON_3D:
      'POLYGON_3D',

    RIBBON_3D:
      'RIBBON_3D',

    PLANE_3D:
      'PLANE_3D',

    FACET_3D:
      'FACET_3D',

    BILLBOARD_3D:
      'BILLBOARD_3D',

    MARKER_3D:
      'MARKER_3D',

    INDEXED_MESH_3D:
      'INDEXED_MESH_3D',

    HEIGHT_FIELD_3D:
      'HEIGHT_FIELD_3D',

    PARAMETRIC_SURFACE_3D:
      'PARAMETRIC_SURFACE_3D',

    CLOSED_VOLUME_3D:
      'CLOSED_VOLUME_3D',

    COMPOUND_GEOMETRY_DESCRIPTOR:
      'COMPOUND_GEOMETRY_DESCRIPTOR'
  }),

  primitiveClassification: deepFreeze({
    ADMITTED:
      'ADMITTED',

    REJECTED_STRUCTURAL:
      'REJECTED_STRUCTURAL',

    REJECTED_NUMERICAL:
      'REJECTED_NUMERICAL',

    REJECTED_DEGENERATE:
      'REJECTED_DEGENERATE',

    REJECTED_TOPOLOGY:
      'REJECTED_TOPOLOGY',

    REJECTED_BOUNDS:
      'REJECTED_BOUNDS',

    REJECTED_BUDGET:
      'REJECTED_BUDGET',

    REJECTED_AUTHORITY:
      'REJECTED_AUTHORITY',

    HELD_UNSUPPORTED:
      'HELD_UNSUPPORTED'
  }),

  providerState: deepFreeze({
    VALID_EMPTY:
      'VALID_EMPTY_PROVIDER_OUTPUT',

    ELIGIBLE_NONEMPTY:
      'ELIGIBLE_NONEMPTY_PROVIDER_OUTPUT',

    INELIGIBLE:
      'INELIGIBLE_PROVIDER_OUTPUT',

    FATAL:
      'FATAL_PROVIDER_FAILURE'
  }),

  issueSeverity: deepFreeze({
    INFO:
      'INFO',

    WARNING:
      'WARNING',

    ERROR:
      'ERROR',

    FATAL:
      'FATAL'
  }),

  boundsPolicy: deepFreeze({
    REJECT_OUT_OF_BOUNDS:
      'REJECT_OUT_OF_BOUNDS',

    CLAMP_TO_WORLD_BOUNDS:
      'CLAMP_TO_WORLD_BOUNDS',

    RETAIN_WITH_ISSUE:
      'RETAIN_WITH_ISSUE'
  }),

  topologyClassification: deepFreeze({
    CLOSED_ORIENTED_MANIFOLD:
      'CLOSED_ORIENTED_MANIFOLD',

    CLOSED_INWARD_ORIENTED_MANIFOLD:
      'CLOSED_INWARD_ORIENTED_MANIFOLD',

    CLOSED_WINDING_INCONSISTENT:
      'CLOSED_WINDING_INCONSISTENT',

    OPEN_MANIFOLD:
      'OPEN_MANIFOLD',

    NONMANIFOLD:
      'NONMANIFOLD',

    DEGENERATE:
      'DEGENERATE',

    UNEVALUABLE:
      'UNEVALUABLE'
  }),

  curveFrameMode: deepFreeze({
    XZ_PLANAR_FRAME:
      'XZ_PLANAR_FRAME',

    FIXED_UP_FRAME:
      'FIXED_UP_FRAME',

    PARALLEL_TRANSPORT_FRAME:
      'PARALLEL_TRANSPORT_FRAME',

    EXPLICIT_NORMAL_FRAME:
      'EXPLICIT_NORMAL_FRAME'
  }),

  ribbonJoinPolicy: deepFreeze({
    BEVEL:
      'BEVEL',

    MITER:
      'MITER',

    ROUND:
      'ROUND'
  }),

  ribbonCapPolicy: deepFreeze({
    NONE:
      'NONE',

    BUTT:
      'BUTT',

    SQUARE:
      'SQUARE',

    ROUND:
      'ROUND'
  }),

  polygonPlaneMode: deepFreeze({
    XZ_PLANE:
      'XZ_PLANE',

    XY_PLANE:
      'XY_PLANE',

    YZ_PLANE:
      'YZ_PLANE',

    EXPLICIT_PLANE:
      'EXPLICIT_PLANE',

    DERIVED_NEWELL_PLANE:
      'DERIVED_NEWELL_PLANE'
  }),

  budgetResult: deepFreeze({
    WITHIN_RECOMMENDED:
      'WITHIN_RECOMMENDED',

    ABOVE_RECOMMENDED_WITHIN_ABSOLUTE:
      'ABOVE_RECOMMENDED_WITHIN_ABSOLUTE',

    ABOVE_ABSOLUTE:
      'ABOVE_ABSOLUTE',

    UNEVALUABLE:
      'UNEVALUABLE'
  }),

  domEstimateStrategy: deepFreeze({
    ONE_NODE_PER_PRIMITIVE:
      'ONE_NODE_PER_PRIMITIVE',

    ONE_NODE_PER_FACE:
      'ONE_NODE_PER_FACE',

    ONE_NODE_PER_EDGE:
      'ONE_NODE_PER_EDGE',

    HYBRID_FACE_EDGE:
      'HYBRID_FACE_EDGE',

    CUSTOM_DECLARED_STRATEGY:
      'CUSTOM_DECLARED_STRATEGY'
  })
});


export const H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS = deepFreeze({
  kernel:
    'GEOMETRY_KERNEL',

  ground:
    'GROUND_GEOMETRY',

  shoreline:
    'SHORELINE_GEOMETRY',

  water:
    'WATER_GEOMETRY',

  tidePools:
    'TIDE_POOL_GEOMETRY',

  stones:
    'STONE_GEOMETRY',

  rocks:
    'ROCK_GEOMETRY',

  islets:
    'ISLET_GEOMETRY',

  bluff:
    'BLUFF_GEOMETRY',

  manor:
    'MANOR_GEOMETRY',

  atmosphere:
    'ATMOSPHERE_GEOMETRY',

  interaction:
    'INTERACTION_GEOMETRY',

  aggregate:
    'AGGREGATED_RENDER_GEOMETRY_HANDOFF'
});


export const H_EARTH_3D_GEOMETRY_LAYER_HINTS = deepFreeze({
  sky:
    'sky',

  atmosphere:
    'atmosphere',

  horizon:
    'horizon',

  offshoreIslets:
    'offshoreIslets',

  manorBluffContext:
    'manorBluffContext',

  openWater:
    'openWater',

  nearshoreWater:
    'nearshoreWater',

  waveBands:
    'waveBands',

  shorelineFoam:
    'shorelineFoam',

  wetSand:
    'wetSand',

  drySand:
    'drySand',

  tidePools:
    'tidePools',

  stones:
    'stones',

  jaggedRocks:
    'jaggedRocks',

  inspectionAnchor:
    'inspectionAnchor',

  overlay:
    'overlay'
});


export const H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS = deepFreeze({
  maximumCurveSampleCount:
    4096,

  maximumSurfaceUSampleCount:
    512,

  maximumSurfaceVSampleCount:
    512,

  maximumHeightXSampleCount:
    512,

  maximumHeightZSampleCount:
    512,

  maximumRadialRingCount:
    256,

  maximumRadialSectorCount:
    512,

  maximumPrimitiveVertexCount:
    262144,

  maximumPrimitiveTriangleCount:
    524288,

  maximumProviderVertexCount:
    524288,

  maximumProviderTriangleCount:
    1048576
});


/* ==========================================================================
 * 02 · SHARED OBJECT HELPERS
 * ========================================================================== */

function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}


const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value);


const clonePlainValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(clonePlainValue);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(
        ([key, nestedValue]) => [
          key,
          clonePlainValue(nestedValue)
        ]
      )
    );
  }

  return value;
};


const freezeClone = (value) =>
  deepFreeze(clonePlainValue(value));


const ensureArray = (value) =>
  Array.isArray(value)
    ? value
    : [];


const allTrue = (values) =>
  values.every((value) => value === true);


const anyTrue = (values) =>
  values.some((value) => value === true);


const enumIncludes = (enumObject, value) =>
  Object.values(enumObject).includes(value);


/* ==========================================================================
 * 03 · ISSUE MATHEMATICS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK = deepFreeze({
  FATAL:
    0,

  ERROR:
    1,

  WARNING:
    2,

  INFO:
    3
});


export const createHEarthGeometryIssue = (
  code,
  severity,
  message,
  details = null,
  blocking = null,
  context = {}
) => {
  const normalizedSeverity =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_ENUMS.issueSeverity,
      severity
    )
      ? severity
      : H_EARTH_3D_GEOMETRY_ENUMS.issueSeverity.ERROR;

  const resolvedBlocking =
    typeof blocking === 'boolean'
      ? blocking
      : (
          normalizedSeverity === 'ERROR' ||
          normalizedSeverity === 'FATAL'
        );

  return deepFreeze({
    code:
      typeof code === 'string' && code.length > 0
        ? code
        : 'H_EARTH_GEOMETRY_UNSPECIFIED_ISSUE',

    severity:
      normalizedSeverity,

    message:
      typeof message === 'string'
        ? message
        : '',

    details:
      freezeClone(details),

    submissionIndex:
      Number.isSafeInteger(context?.submissionIndex)
        ? context.submissionIndex
        : null,

    primitiveId:
      typeof context?.primitiveId === 'string'
        ? context.primitiveId
        : null,

    descriptorId:
      typeof context?.descriptorId === 'string'
        ? context.descriptorId
        : null,

    blocking:
      resolvedBlocking
  });
};


export const sortHEarthGeometryIssues = (issues = []) =>
  deepFreeze(
    ensureArray(issues)
      .filter(isPlainObject)
      .slice()
      .sort((left, right) => {
        const leftSubmission =
          Number.isSafeInteger(left.submissionIndex)
            ? left.submissionIndex
            : Number.MAX_SAFE_INTEGER;

        const rightSubmission =
          Number.isSafeInteger(right.submissionIndex)
            ? right.submissionIndex
            : Number.MAX_SAFE_INTEGER;

        if (leftSubmission !== rightSubmission) {
          return leftSubmission - rightSubmission;
        }

        const primitiveCompare =
          String(left.primitiveId ?? '')
            .localeCompare(String(right.primitiveId ?? ''));

        if (primitiveCompare !== 0) {
          return primitiveCompare;
        }

        const severityCompare =
          (
            H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK[
              left.severity
            ] ?? Number.MAX_SAFE_INTEGER
          ) -
          (
            H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK[
              right.severity
            ] ?? Number.MAX_SAFE_INTEGER
          );

        if (severityCompare !== 0) {
          return severityCompare;
        }

        const codeCompare =
          String(left.code ?? '')
            .localeCompare(String(right.code ?? ''));

        if (codeCompare !== 0) {
          return codeCompare;
        }

        return String(left.descriptorId ?? '')
          .localeCompare(String(right.descriptorId ?? ''));
      })
  );


export const hasHEarthBlockingIssues = (issues = []) =>
  ensureArray(issues).some(
    (issue) =>
      isPlainObject(issue) &&
      issue.blocking === true
  );


/* ==========================================================================
 * 04 · TOLERANCE PROFILE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE = deepFreeze({
  toleranceProfileId:
    'H_EARTH_3D_GEOMETRY_SCALE_AWARE_ABSOLUTE_RELATIVE_TOLERANCE_PROFILE_v1',

  scalarAbsoluteEpsilon:
    1e-10,

  scalarRelativeEpsilon:
    1e-9,

  positionAbsoluteEpsilon:
    1e-7,

  positionRelativeEpsilon:
    1e-9,

  lengthAbsoluteEpsilon:
    1e-7,

  areaAbsoluteEpsilon:
    1e-12,

  volumeAbsoluteEpsilon:
    1e-15,

  normalLengthEpsilon:
    1e-10,

  matrixAbsoluteEpsilon:
    1e-12,

  matrixRelativeEpsilon:
    1e-10,

  matrixResidualEpsilon:
    1e-9,

  parameterEpsilon:
    1e-12,

  angleEpsilonRadians:
    1e-10,

  miterDenominatorEpsilon:
    1e-9,

  derivativeRelativeStep:
    Math.sqrt(Number.EPSILON)
});


export const deriveHEarthGeometryToleranceContext = (
  bounds = null,
  profile = H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
) => {
  const spanX =
    bounds?.empty === false &&
    isHEarthFiniteNumber(bounds?.size?.x)
      ? bounds.size.x
      : 0;

  const spanY =
    bounds?.empty === false &&
    isHEarthFiniteNumber(bounds?.size?.y)
      ? bounds.size.y
      : 0;

  const spanZ =
    bounds?.empty === false &&
    isHEarthFiniteNumber(bounds?.size?.z)
      ? bounds.size.z
      : 0;

  const geometryScale =
    Math.max(
      Math.abs(spanX),
      Math.abs(spanY),
      Math.abs(spanZ),
      1
    );

  const positionTolerance =
    profile.positionAbsoluteEpsilon +
    profile.positionRelativeEpsilon *
      geometryScale;

  const lengthTolerance =
    Math.max(
      profile.lengthAbsoluteEpsilon,
      positionTolerance
    );

  const areaTolerance =
    Math.max(
      profile.areaAbsoluteEpsilon,
      positionTolerance ** 2
    );

  const volumeTolerance =
    Math.max(
      profile.volumeAbsoluteEpsilon,
      positionTolerance ** 3
    );

  return deepFreeze({
    toleranceProfileId:
      profile.toleranceProfileId,

    geometryScale,

    scalarAbsoluteTolerance:
      profile.scalarAbsoluteEpsilon,

    scalarRelativeTolerance:
      profile.scalarRelativeEpsilon,

    positionTolerance,

    lengthTolerance,

    areaTolerance,

    volumeTolerance,

    normalLengthTolerance:
      profile.normalLengthEpsilon,

    matrixAbsoluteTolerance:
      profile.matrixAbsoluteEpsilon,

    matrixRelativeTolerance:
      profile.matrixRelativeEpsilon,

    matrixResidualTolerance:
      profile.matrixResidualEpsilon,

    parameterTolerance:
      profile.parameterEpsilon,

    angleToleranceRadians:
      profile.angleEpsilonRadians,

    miterDenominatorTolerance:
      profile.miterDenominatorEpsilon,

    derivativeRelativeStep:
      profile.derivativeRelativeStep,

    vectorApproximationMode:
      'EUCLIDEAN_DISTANCE_MODE'
  });
};


export const getHEarthGeometryTolerance = () =>
  H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE;


/* ==========================================================================
 * 05 · SCALAR MATHEMATICS
 * ========================================================================== */

export const isHEarthFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);


export const isHEarthPositiveFiniteNumber = (value) =>
  isHEarthFiniteNumber(value) &&
  value > 0;


export const isHEarthNonNegativeFiniteNumber = (value) =>
  isHEarthFiniteNumber(value) &&
  value >= 0;


export const isHEarthNonEmptyString = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0;


export const clampHEarthNumber = (
  value,
  minimum,
  maximum
) => {
  if (
    !isHEarthFiniteNumber(value) ||
    !isHEarthFiniteNumber(minimum) ||
    !isHEarthFiniteNumber(maximum) ||
    minimum > maximum
  ) {
    return Number.NaN;
  }

  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
};


export const saturateHEarthNumber = (value) =>
  clampHEarthNumber(value, 0, 1);


export const lerpHEarthNumber = (
  start,
  end,
  amount
) =>
  start + amount * (end - start);


export const inverseLerpHEarthNumber = (
  start,
  end,
  value,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) => {
  const span =
    end - start;

  if (
    !isHEarthFiniteNumber(span) ||
    Math.abs(span) <= tolerance
  ) {
    return Number.NaN;
  }

  return (value - start) / span;
};


export const safeDivideHEarthNumber = (
  numerator,
  denominator,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) => {
  if (
    !isHEarthFiniteNumber(numerator) ||
    !isHEarthFiniteNumber(denominator)
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SCALAR_DIVISION_NONFINITE_INPUT',
            'ERROR',
            'Safe division requires finite numerator and denominator.',
            {
              numerator,
              denominator
            }
          )
        ])
    });
  }

  if (Math.abs(denominator) <= tolerance) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SCALAR_DIVISION_DENOMINATOR_TOO_SMALL',
            'ERROR',
            'Safe division denominator is at or below tolerance.',
            {
              numerator,
              denominator,
              tolerance
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    value:
      numerator / denominator,

    issues:
      deepFreeze([])
  });
};


export const approximatelyEqualHEarthNumber = (
  left,
  right,
  options = {}
) => {
  if (
    !isHEarthFiniteNumber(left) ||
    !isHEarthFiniteNumber(right)
  ) {
    return false;
  }

  const absoluteTolerance =
    isHEarthNonNegativeFiniteNumber(
      options.absoluteTolerance
    )
      ? options.absoluteTolerance
      : H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .scalarAbsoluteEpsilon;

  const relativeTolerance =
    isHEarthNonNegativeFiniteNumber(
      options.relativeTolerance
    )
      ? options.relativeTolerance
      : H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .scalarRelativeEpsilon;

  return (
    Math.abs(left - right) <=
    absoluteTolerance +
      relativeTolerance *
        Math.max(
          Math.abs(left),
          Math.abs(right),
          1
        )
  );
};


export const roundHEarthNumber = (
  value,
  precision = 8
) => {
  if (!isHEarthFiniteNumber(value)) {
    return Number.NaN;
  }

  const boundedPrecision =
    Number.isInteger(precision)
      ? Math.min(15, Math.max(0, precision))
      : 8;

  const factor =
    10 ** boundedPrecision;

  return (
    Math.round(value * factor) /
    factor
  );
};


export const degreesToHEarthRadians = (degrees) =>
  degrees * Math.PI / 180;


export const radiansToHEarthDegrees = (radians) =>
  radians * 180 / Math.PI;


export const normalizeHEarthDegreesSigned = (degrees) => {
  if (!isHEarthFiniteNumber(degrees)) {
    return Number.NaN;
  }

  let normalized =
    ((degrees + 180) % 360 + 360) % 360 - 180;

  if (
    approximatelyEqualHEarthNumber(
      normalized,
      -180
    )
  ) {
    normalized = 180;
  }

  return normalized;
};


export const normalizeHEarthDegreesUnsigned = (degrees) => {
  if (!isHEarthFiniteNumber(degrees)) {
    return Number.NaN;
  }

  return (
    (degrees % 360 + 360) % 360
  );
};


export const normalizeHEarthRadiansSigned = (radians) => {
  if (!isHEarthFiniteNumber(radians)) {
    return Number.NaN;
  }

  const twoPi =
    Math.PI * 2;

  let normalized =
    ((radians + Math.PI) % twoPi + twoPi) %
      twoPi -
    Math.PI;

  if (
    approximatelyEqualHEarthNumber(
      normalized,
      -Math.PI
    )
  ) {
    normalized = Math.PI;
  }

  return normalized;
};


export const normalizeHEarthRadiansUnsigned = (radians) => {
  if (!isHEarthFiniteNumber(radians)) {
    return Number.NaN;
  }

  const twoPi =
    Math.PI * 2;

  return (
    (radians % twoPi + twoPi) %
    twoPi
  );
};


export const signedPowerHEarthNumber = (
  value,
  exponent
) => {
  if (
    !isHEarthFiniteNumber(value) ||
    !isHEarthPositiveFiniteNumber(exponent)
  ) {
    return Number.NaN;
  }

  if (value === 0) {
    return 0;
  }

  return (
    Math.sign(value) *
    Math.abs(value) ** exponent
  );
};


export const smoothstepHEarthNumber = (
  edge0,
  edge1,
  value
) => {
  if (
    !isHEarthFiniteNumber(edge0) ||
    !isHEarthFiniteNumber(edge1) ||
    !isHEarthFiniteNumber(value) ||
    edge0 >= edge1
  ) {
    return Number.NaN;
  }

  const t =
    clampHEarthNumber(
      (value - edge0) /
        (edge1 - edge0),
      0,
      1
    );

  return (
    t * t * (3 - 2 * t)
  );
};


export const smootherstepHEarthNumber = (
  edge0,
  edge1,
  value
) => {
  if (
    !isHEarthFiniteNumber(edge0) ||
    !isHEarthFiniteNumber(edge1) ||
    !isHEarthFiniteNumber(value) ||
    edge0 >= edge1
  ) {
    return Number.NaN;
  }

  const t =
    clampHEarthNumber(
      (value - edge0) /
        (edge1 - edge0),
      0,
      1
    );

  return (
    t * t * t *
    (
      t * (t * 6 - 15) +
      10
    )
  );
};


export const smoothMinHEarthNumber = (
  left,
  right,
  smoothing
) => {
  if (
    !isHEarthFiniteNumber(left) ||
    !isHEarthFiniteNumber(right) ||
    !isHEarthPositiveFiniteNumber(smoothing)
  ) {
    return Number.NaN;
  }

  const h =
    clampHEarthNumber(
      0.5 +
        0.5 *
          (right - left) /
          smoothing,
      0,
      1
    );

  return (
    lerpHEarthNumber(
      right,
      left,
      h
    ) -
    smoothing * h * (1 - h)
  );
};


export const smoothMaxHEarthNumber = (
  left,
  right,
  smoothing
) =>
  -smoothMinHEarthNumber(
    -left,
    -right,
    smoothing
  );


export const safeAddHEarthInteger = (
  left,
  right
) => {
  if (
    !Number.isSafeInteger(left) ||
    !Number.isSafeInteger(right) ||
    left < 0 ||
    right < 0
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_ACCOUNT_SAFE_INTEGER_INVALID_INPUT',
            'ERROR',
            'Safe integer addition requires nonnegative safe integers.',
            {
              left,
              right
            }
          )
        ])
    });
  }

  const value =
    left + right;

  if (!Number.isSafeInteger(value)) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_ACCOUNT_SAFE_INTEGER_OVERFLOW',
            'ERROR',
            'Safe integer addition exceeded Number.MAX_SAFE_INTEGER.',
            {
              left,
              right
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    value,

    issues:
      deepFreeze([])
  });
};


export const safeMultiplyHEarthInteger = (
  left,
  right
) => {
  if (
    !Number.isSafeInteger(left) ||
    !Number.isSafeInteger(right) ||
    left < 0 ||
    right < 0
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_ACCOUNT_SAFE_INTEGER_INVALID_INPUT',
            'ERROR',
            'Safe integer multiplication requires nonnegative safe integers.',
            {
              left,
              right
            }
          )
        ])
    });
  }

  const value =
    left * right;

  if (!Number.isSafeInteger(value)) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_ACCOUNT_SAFE_INTEGER_OVERFLOW',
            'ERROR',
            'Safe integer multiplication exceeded Number.MAX_SAFE_INTEGER.',
            {
              left,
              right
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    value,

    issues:
      deepFreeze([])
  });
};


/* ==========================================================================
 * 06 · VECTOR MATHEMATICS
 * ========================================================================== */

export const createHEarthVector2 = (
  x = 0,
  y = 0
) =>
  deepFreeze({
    x,
    y
  });


export const createHEarthVector3 = (
  x = 0,
  y = 0,
  z = 0
) =>
  deepFreeze({
    x,
    y,
    z
  });


export const createHEarthVector4 = (
  x = 0,
  y = 0,
  z = 0,
  w = 0
) =>
  deepFreeze({
    x,
    y,
    z,
    w
  });


export const isHEarthVector2 = (value) =>
  isPlainObject(value) &&
  isHEarthFiniteNumber(value.x) &&
  isHEarthFiniteNumber(value.y);


export const isHEarthVector3 = (value) =>
  isPlainObject(value) &&
  isHEarthFiniteNumber(value.x) &&
  isHEarthFiniteNumber(value.y) &&
  isHEarthFiniteNumber(value.z);


export const isHEarthVector4 = (value) =>
  isPlainObject(value) &&
  isHEarthFiniteNumber(value.x) &&
  isHEarthFiniteNumber(value.y) &&
  isHEarthFiniteNumber(value.z) &&
  isHEarthFiniteNumber(value.w);


export const cloneHEarthVector2 = (vector) =>
  createHEarthVector2(
    vector?.x ?? 0,
    vector?.y ?? 0
  );


export const cloneHEarthVector3 = (vector) =>
  createHEarthVector3(
    vector?.x ?? 0,
    vector?.y ?? 0,
    vector?.z ?? 0
  );


export const cloneHEarthVector4 = (vector) =>
  createHEarthVector4(
    vector?.x ?? 0,
    vector?.y ?? 0,
    vector?.z ?? 0,
    vector?.w ?? 0
  );


export const addHEarthVector2 = (
  left,
  right
) =>
  createHEarthVector2(
    left.x + right.x,
    left.y + right.y
  );


export const addHEarthVector3 = (
  left,
  right
) =>
  createHEarthVector3(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
  );


export const subtractHEarthVector2 = (
  left,
  right
) =>
  createHEarthVector2(
    left.x - right.x,
    left.y - right.y
  );


export const subtractHEarthVector3 = (
  left,
  right
) =>
  createHEarthVector3(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );


export const multiplyHEarthVector3Components = (
  left,
  right
) =>
  createHEarthVector3(
    left.x * right.x,
    left.y * right.y,
    left.z * right.z
  );


export const scaleHEarthVector2 = (
  vector,
  scalar
) =>
  createHEarthVector2(
    vector.x * scalar,
    vector.y * scalar
  );


export const scaleHEarthVector3 = (
  vector,
  scalar
) =>
  createHEarthVector3(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );


export const divideHEarthVector3 = (
  vector,
  scalar,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) => {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthFiniteNumber(scalar) ||
    Math.abs(scalar) <= tolerance
  ) {
    return null;
  }

  return createHEarthVector3(
    vector.x / scalar,
    vector.y / scalar,
    vector.z / scalar
  );
};


export const dotHEarthVector2 = (
  left,
  right
) =>
  left.x * right.x +
  left.y * right.y;


export const dotHEarthVector3 = (
  left,
  right
) =>
  left.x * right.x +
  left.y * right.y +
  left.z * right.z;


export const crossHEarthVector3 = (
  left,
  right
) =>
  createHEarthVector3(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );


export const getHEarthVector2LengthSquared = (vector) =>
  dotHEarthVector2(vector, vector);


export const getHEarthVector3LengthSquared = (vector) =>
  dotHEarthVector3(vector, vector);


export const getHEarthVector2Length = (vector) =>
  Math.hypot(
    vector.x,
    vector.y
  );


export const getHEarthVector3Length = (vector) =>
  Math.hypot(
    vector.x,
    vector.y,
    vector.z
  );


export const getHEarthVector2DistanceSquared = (
  left,
  right
) =>
  getHEarthVector2LengthSquared(
    subtractHEarthVector2(left, right)
  );


export const getHEarthVector3DistanceSquared = (
  left,
  right
) =>
  getHEarthVector3LengthSquared(
    subtractHEarthVector3(left, right)
  );


export const getHEarthVector2Distance = (
  left,
  right
) =>
  Math.sqrt(
    getHEarthVector2DistanceSquared(
      left,
      right
    )
  );


export const getHEarthVector3Distance = (
  left,
  right
) =>
  Math.sqrt(
    getHEarthVector3DistanceSquared(
      left,
      right
    )
  );


export const normalizeHEarthVector2 = (
  vector,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) => {
  if (!isHEarthVector2(vector)) {
    return deepFreeze({
      valid:
        false,

      vector:
        createHEarthVector2(0, 0),

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR2_NORMALIZATION_INVALID_INPUT',
            'ERROR',
            'Vector2 normalization requires a finite Vector2.'
          )
        ])
    });
  }

  const length =
    getHEarthVector2Length(vector);

  if (length <= tolerance) {
    return deepFreeze({
      valid:
        false,

      vector:
        createHEarthVector2(0, 0),

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR2_NORMALIZATION_ZERO_LENGTH',
            'ERROR',
            'Vector2 length is at or below normalization tolerance.',
            {
              vector,
              length,
              tolerance
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    vector:
      scaleHEarthVector2(
        vector,
        1 / length
      ),

    issues:
      deepFreeze([])
  });
};


export const normalizeHEarthVector3 = (
  vector,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) => {
  if (!isHEarthVector3(vector)) {
    return deepFreeze({
      valid:
        false,

      vector:
        createHEarthVector3(0, 0, 0),

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR3_NORMALIZATION_INVALID_INPUT',
            'ERROR',
            'Vector3 normalization requires a finite Vector3.'
          )
        ])
    });
  }

  const length =
    getHEarthVector3Length(vector);

  if (length <= tolerance) {
    return deepFreeze({
      valid:
        false,

      vector:
        createHEarthVector3(0, 0, 0),

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR3_NORMALIZATION_ZERO_LENGTH',
            'ERROR',
            'Vector3 length is at or below normalization tolerance.',
            {
              vector,
              length,
              tolerance
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    vector:
      scaleHEarthVector3(
        vector,
        1 / length
      ),

    issues:
      deepFreeze([])
  });
};


export const lerpHEarthVector3 = (
  start,
  end,
  amount
) =>
  createHEarthVector3(
    lerpHEarthNumber(
      start.x,
      end.x,
      amount
    ),
    lerpHEarthNumber(
      start.y,
      end.y,
      amount
    ),
    lerpHEarthNumber(
      start.z,
      end.z,
      amount
    )
  );


export const minimumHEarthVector3 = (
  left,
  right
) =>
  createHEarthVector3(
    Math.min(left.x, right.x),
    Math.min(left.y, right.y),
    Math.min(left.z, right.z)
  );


export const maximumHEarthVector3 = (
  left,
  right
) =>
  createHEarthVector3(
    Math.max(left.x, right.x),
    Math.max(left.y, right.y),
    Math.max(left.z, right.z)
  );


export const projectHEarthVector3 = (
  vector,
  onto,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) => {
  const denominator =
    dotHEarthVector3(onto, onto);

  if (denominator <= tolerance ** 2) {
    return null;
  }

  return scaleHEarthVector3(
    onto,
    dotHEarthVector3(vector, onto) /
      denominator
  );
};


export const projectHEarthVector3OntoPlane = (
  vector,
  planeNormal
) => {
  const projection =
    projectHEarthVector3(
      vector,
      planeNormal
    );

  if (!projection) {
    return null;
  }

  return subtractHEarthVector3(
    vector,
    projection
  );
};


export const reflectHEarthVector3 = (
  vector,
  normal
) => {
  const normalized =
    normalizeHEarthVector3(normal);

  if (!normalized.valid) {
    return null;
  }

  return subtractHEarthVector3(
    vector,
    scaleHEarthVector3(
      normalized.vector,
      2 *
        dotHEarthVector3(
          vector,
          normalized.vector
        )
    )
  );
};


export const approximatelyEqualHEarthVector3 = (
  left,
  right,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return false;
  }

  return (
    getHEarthVector3Distance(
      left,
      right
    ) <=
    toleranceContext.positionTolerance
  );
};


/* ==========================================================================
 * 07 · MATRIX4 MATHEMATICS
 * ========================================================================== */

export const createHEarthMatrix4 = (
  entries = null
) => {
  const normalized =
    Array.isArray(entries) &&
    entries.length === 16
      ? entries.slice()
      : [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];

  return deepFreeze({
    type:
      'MATRIX4',

    logicalStorage:
      'ROW_MAJOR',

    vectorConvention:
      'COLUMN_VECTOR',

    entries:
      deepFreeze(normalized)
  });
};


export const createHEarthIdentityMatrix4 = () =>
  createHEarthMatrix4([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);


export const isHEarthMatrix4 = (matrix) =>
  isPlainObject(matrix) &&
  Array.isArray(matrix.entries) &&
  matrix.entries.length === 16 &&
  matrix.entries.every(isHEarthFiniteNumber);


export const cloneHEarthMatrix4 = (matrix) =>
  createHEarthMatrix4(
    matrix?.entries
  );


const matrixEntry = (
  matrix,
  row,
  column
) =>
  matrix.entries[
    row * 4 + column
  ];


export const multiplyHEarthMatrix4 = (
  left,
  right
) => {
  if (
    !isHEarthMatrix4(left) ||
    !isHEarthMatrix4(right)
  ) {
    return null;
  }

  const result =
    new Array(16).fill(0);

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      let sum = 0;

      for (let index = 0; index < 4; index += 1) {
        sum +=
          matrixEntry(
            left,
            row,
            index
          ) *
          matrixEntry(
            right,
            index,
            column
          );
      }

      result[
        row * 4 + column
      ] = sum;
    }
  }

  return createHEarthMatrix4(result);
};


export const transposeHEarthMatrix4 = (matrix) => {
  if (!isHEarthMatrix4(matrix)) {
    return null;
  }

  const result =
    new Array(16);

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      result[
        row * 4 + column
      ] =
        matrixEntry(
          matrix,
          column,
          row
        );
    }
  }

  return createHEarthMatrix4(result);
};


export const getHEarthMatrixLinearColumns = (matrix) =>
  deepFreeze({
    x:
      createHEarthVector3(
        matrixEntry(matrix, 0, 0),
        matrixEntry(matrix, 1, 0),
        matrixEntry(matrix, 2, 0)
      ),

    y:
      createHEarthVector3(
        matrixEntry(matrix, 0, 1),
        matrixEntry(matrix, 1, 1),
        matrixEntry(matrix, 2, 1)
      ),

    z:
      createHEarthVector3(
        matrixEntry(matrix, 0, 2),
        matrixEntry(matrix, 1, 2),
        matrixEntry(matrix, 2, 2)
      )
  });


export const determinantHEarthMatrix3Linear = (matrix) => {
  if (!isHEarthMatrix4(matrix)) {
    return Number.NaN;
  }

  const a =
    matrixEntry(matrix, 0, 0);
  const b =
    matrixEntry(matrix, 0, 1);
  const c =
    matrixEntry(matrix, 0, 2);
  const d =
    matrixEntry(matrix, 1, 0);
  const e =
    matrixEntry(matrix, 1, 1);
  const f =
    matrixEntry(matrix, 1, 2);
  const g =
    matrixEntry(matrix, 2, 0);
  const h =
    matrixEntry(matrix, 2, 1);
  const i =
    matrixEntry(matrix, 2, 2);

  return (
    a * (e * i - f * h) -
    b * (d * i - f * g) +
    c * (d * h - e * g)
  );
};


export const createHEarthTranslationMatrix = (
  x = 0,
  y = 0,
  z = 0
) =>
  createHEarthMatrix4([
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ]);


export const createHEarthScaleMatrix = (
  x = 1,
  y = x,
  z = x
) =>
  createHEarthMatrix4([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ]);


const resolveAngleRadians = (
  angle,
  unit
) => {
  if (!isHEarthFiniteNumber(angle)) {
    return Number.NaN;
  }

  if (
    unit ===
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.DEGREES
  ) {
    return degreesToHEarthRadians(angle);
  }

  if (
    unit ===
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS
  ) {
    return angle;
  }

  return Number.NaN;
};


export const createHEarthRotationXMatrix = (
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS
) => {
  const radians =
    resolveAngleRadians(
      angle,
      unit
    );

  if (!isHEarthFiniteNumber(radians)) {
    return null;
  }

  const cosine =
    Math.cos(radians);

  const sine =
    Math.sin(radians);

  return createHEarthMatrix4([
    1, 0, 0, 0,
    0, cosine, -sine, 0,
    0, sine, cosine, 0,
    0, 0, 0, 1
  ]);
};


export const createHEarthRotationYMatrix = (
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS
) => {
  const radians =
    resolveAngleRadians(
      angle,
      unit
    );

  if (!isHEarthFiniteNumber(radians)) {
    return null;
  }

  const cosine =
    Math.cos(radians);

  const sine =
    Math.sin(radians);

  return createHEarthMatrix4([
    cosine, 0, sine, 0,
    0, 1, 0, 0,
    -sine, 0, cosine, 0,
    0, 0, 0, 1
  ]);
};


export const createHEarthRotationZMatrix = (
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS
) => {
  const radians =
    resolveAngleRadians(
      angle,
      unit
    );

  if (!isHEarthFiniteNumber(radians)) {
    return null;
  }

  const cosine =
    Math.cos(radians);

  const sine =
    Math.sin(radians);

  return createHEarthMatrix4([
    cosine, -sine, 0, 0,
    sine, cosine, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
};


export const createHEarthAxisAngleRotationMatrix = ({
  axis,
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS
}) => {
  const normalizedAxis =
    normalizeHEarthVector3(axis);

  const radians =
    resolveAngleRadians(
      angle,
      unit
    );

  if (
    !normalizedAxis.valid ||
    !isHEarthFiniteNumber(radians)
  ) {
    return null;
  }

  const {
    x,
    y,
    z
  } = normalizedAxis.vector;

  const cosine =
    Math.cos(radians);

  const sine =
    Math.sin(radians);

  const oneMinusCosine =
    1 - cosine;

  return createHEarthMatrix4([
    cosine + x * x * oneMinusCosine,
    x * y * oneMinusCosine - z * sine,
    x * z * oneMinusCosine + y * sine,
    0,

    y * x * oneMinusCosine + z * sine,
    cosine + y * y * oneMinusCosine,
    y * z * oneMinusCosine - x * sine,
    0,

    z * x * oneMinusCosine - y * sine,
    z * y * oneMinusCosine + x * sine,
    cosine + z * z * oneMinusCosine,
    0,

    0,
    0,
    0,
    1
  ]);
};


export const composeHEarthWorldTransform = ({
  translation =
    createHEarthVector3(0, 0, 0),

  rotationX =
    0,

  rotationY =
    0,

  rotationZ =
    0,

  rotationUnit =
    H_EARTH_3D_GEOMETRY_ENUMS.angleUnit.RADIANS,

  scale =
    createHEarthVector3(1, 1, 1)
} = {}) => {
  const translationMatrix =
    createHEarthTranslationMatrix(
      translation.x,
      translation.y,
      translation.z
    );

  const rotationXMatrix =
    createHEarthRotationXMatrix(
      rotationX,
      rotationUnit
    );

  const rotationYMatrix =
    createHEarthRotationYMatrix(
      rotationY,
      rotationUnit
    );

  const rotationZMatrix =
    createHEarthRotationZMatrix(
      rotationZ,
      rotationUnit
    );

  const scaleMatrix =
    createHEarthScaleMatrix(
      scale.x,
      scale.y,
      scale.z
    );

  if (
    !rotationXMatrix ||
    !rotationYMatrix ||
    !rotationZMatrix
  ) {
    return null;
  }

  return multiplyHEarthMatrix4(
    translationMatrix,
    multiplyHEarthMatrix4(
      rotationZMatrix,
      multiplyHEarthMatrix4(
        rotationYMatrix,
        multiplyHEarthMatrix4(
          rotationXMatrix,
          scaleMatrix
        )
      )
    )
  );
};


export const transformHEarthVector4 = (
  matrix,
  vector
) => {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthVector4(vector)
  ) {
    return null;
  }

  return createHEarthVector4(
    matrixEntry(matrix, 0, 0) * vector.x +
      matrixEntry(matrix, 0, 1) * vector.y +
      matrixEntry(matrix, 0, 2) * vector.z +
      matrixEntry(matrix, 0, 3) * vector.w,

    matrixEntry(matrix, 1, 0) * vector.x +
      matrixEntry(matrix, 1, 1) * vector.y +
      matrixEntry(matrix, 1, 2) * vector.z +
      matrixEntry(matrix, 1, 3) * vector.w,

    matrixEntry(matrix, 2, 0) * vector.x +
      matrixEntry(matrix, 2, 1) * vector.y +
      matrixEntry(matrix, 2, 2) * vector.z +
      matrixEntry(matrix, 2, 3) * vector.w,

    matrixEntry(matrix, 3, 0) * vector.x +
      matrixEntry(matrix, 3, 1) * vector.y +
      matrixEntry(matrix, 3, 2) * vector.z +
      matrixEntry(matrix, 3, 3) * vector.w
  );
};


export const transformHEarthVector3 = (
  matrix,
  position
) => {
  const result =
    transformHEarthVector4(
      matrix,
      createHEarthVector4(
        position.x,
        position.y,
        position.z,
        1
      )
    );

  if (!result) {
    return null;
  }

  return createHEarthVector3(
    result.x,
    result.y,
    result.z
  );
};


export const transformHEarthDirection3 = (
  matrix,
  direction
) => {
  const result =
    transformHEarthVector4(
      matrix,
      createHEarthVector4(
        direction.x,
        direction.y,
        direction.z,
        0
      )
    );

  if (!result) {
    return null;
  }

  return createHEarthVector3(
    result.x,
    result.y,
    result.z
  );
};


export const classifyHEarthTransform = (
  matrix,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  if (!isHEarthMatrix4(matrix)) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.INVALID,

      valid:
        false,

      determinant:
        null,

      determinantTolerance:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVALID',
            'ERROR',
            'Transform classification requires sixteen finite Matrix4 entries.'
          )
        ])
    });
  }

  const bottomRow =
    [
      matrixEntry(matrix, 3, 0),
      matrixEntry(matrix, 3, 1),
      matrixEntry(matrix, 3, 2),
      matrixEntry(matrix, 3, 3)
    ];

  const affineBottomRowValid =
    approximatelyEqualHEarthNumber(
      bottomRow[0],
      0,
      {
        absoluteTolerance:
          toleranceContext.matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext.matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      bottomRow[1],
      0,
      {
        absoluteTolerance:
          toleranceContext.matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext.matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      bottomRow[2],
      0,
      {
        absoluteTolerance:
          toleranceContext.matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext.matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      bottomRow[3],
      1,
      {
        absoluteTolerance:
          toleranceContext.matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext.matrixRelativeTolerance
      }
    );

  if (!affineBottomRowValid) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.INVALID,

      valid:
        false,

      determinant:
        null,

      determinantTolerance:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_AFFINE_BOTTOM_ROW_INVALID',
            'ERROR',
            'Projective or malformed matrices are outside the initial geometry-kernel contract.',
            {
              bottomRow
            }
          )
        ])
    });
  }

  const columns =
    getHEarthMatrixLinearColumns(matrix);

  const linearScale =
    Math.max(
      getHEarthVector3Length(columns.x),
      getHEarthVector3Length(columns.y),
      getHEarthVector3Length(columns.z),
      1
    );

  const determinantTolerance =
    toleranceContext.matrixAbsoluteTolerance +
    toleranceContext.matrixRelativeTolerance *
      linearScale ** 3;

  const determinant =
    determinantHEarthMatrix3Linear(matrix);

  if (
    Math.abs(determinant) <=
    determinantTolerance
  ) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.AFFINE_SINGULAR,

      valid:
        true,

      determinant,

      determinantTolerance,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_AFFINE_LINEAR_PART_SINGULAR',
            'ERROR',
            'The affine linear part is singular or numerically noninvertible.',
            {
              determinant,
              determinantTolerance,
              linearScale
            }
          )
        ])
    });
  }

  const identity =
    createHEarthIdentityMatrix4();

  const identityMatch =
    matrix.entries.every(
      (entry, index) =>
        approximatelyEqualHEarthNumber(
          entry,
          identity.entries[index],
          {
            absoluteTolerance:
              toleranceContext.matrixAbsoluteTolerance,

            relativeTolerance:
              toleranceContext.matrixRelativeTolerance
          }
        )
    );

  if (identityMatch) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.IDENTITY,

      valid:
        true,

      determinant,

      determinantTolerance,

      issues:
        deepFreeze([])
    });
  }

  const lengths =
    [
      getHEarthVector3Length(columns.x),
      getHEarthVector3Length(columns.y),
      getHEarthVector3Length(columns.z)
    ];

  const pairwiseOrthogonal =
    approximatelyEqualHEarthNumber(
      dotHEarthVector3(columns.x, columns.y),
      0
    ) &&
    approximatelyEqualHEarthNumber(
      dotHEarthVector3(columns.x, columns.z),
      0
    ) &&
    approximatelyEqualHEarthNumber(
      dotHEarthVector3(columns.y, columns.z),
      0
    );

  const unitLengths =
    lengths.every(
      (length) =>
        approximatelyEqualHEarthNumber(
          length,
          1
        )
    );

  if (
    pairwiseOrthogonal &&
    unitLengths &&
    approximatelyEqualHEarthNumber(
      determinant,
      1
    )
  ) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.RIGID,

      valid:
        true,

      determinant,

      determinantTolerance,

      issues:
        deepFreeze([])
    });
  }

  const uniformScale =
    approximatelyEqualHEarthNumber(
      lengths[0],
      lengths[1]
    ) &&
    approximatelyEqualHEarthNumber(
      lengths[1],
      lengths[2]
    );

  if (
    pairwiseOrthogonal &&
    uniformScale &&
    lengths[0] >
      toleranceContext.lengthTolerance
  ) {
    return deepFreeze({
      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .transformClassification.UNIFORM_SCALE,

      valid:
        true,

      determinant,

      determinantTolerance,

      uniformScaleMagnitude:
        lengths[0],

      issues:
        deepFreeze([])
    });
  }

  return deepFreeze({
    classification:
      H_EARTH_3D_GEOMETRY_ENUMS
        .transformClassification.AFFINE_INVERTIBLE,

    valid:
      true,

    determinant,

    determinantTolerance,

    issues:
      deepFreeze([])
  });
};


export const invertHEarthMatrix4 = (
  matrix,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  const classification =
    classifyHEarthTransform(
      matrix,
      toleranceContext
    );

  if (
    classification.classification ===
      'INVALID' ||
    classification.classification ===
      'AFFINE_SINGULAR'
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      residual:
        null,

      issues:
        classification.issues
    });
  }

  const a =
    matrixEntry(matrix, 0, 0);
  const b =
    matrixEntry(matrix, 0, 1);
  const c =
    matrixEntry(matrix, 0, 2);
  const d =
    matrixEntry(matrix, 1, 0);
  const e =
    matrixEntry(matrix, 1, 1);
  const f =
    matrixEntry(matrix, 1, 2);
  const g =
    matrixEntry(matrix, 2, 0);
  const h =
    matrixEntry(matrix, 2, 1);
  const i =
    matrixEntry(matrix, 2, 2);

  const determinant =
    determinantHEarthMatrix3Linear(matrix);

  const inverseDeterminant =
    1 / determinant;

  const l00 =
    (e * i - f * h) *
    inverseDeterminant;

  const l01 =
    (c * h - b * i) *
    inverseDeterminant;

  const l02 =
    (b * f - c * e) *
    inverseDeterminant;

  const l10 =
    (f * g - d * i) *
    inverseDeterminant;

  const l11 =
    (a * i - c * g) *
    inverseDeterminant;

  const l12 =
    (c * d - a * f) *
    inverseDeterminant;

  const l20 =
    (d * h - e * g) *
    inverseDeterminant;

  const l21 =
    (b * g - a * h) *
    inverseDeterminant;

  const l22 =
    (a * e - b * d) *
    inverseDeterminant;

  const translation =
    createHEarthVector3(
      matrixEntry(matrix, 0, 3),
      matrixEntry(matrix, 1, 3),
      matrixEntry(matrix, 2, 3)
    );

  const inverseTranslation =
    createHEarthVector3(
      -(
        l00 * translation.x +
        l01 * translation.y +
        l02 * translation.z
      ),

      -(
        l10 * translation.x +
        l11 * translation.y +
        l12 * translation.z
      ),

      -(
        l20 * translation.x +
        l21 * translation.y +
        l22 * translation.z
      )
    );

  const inverse =
    createHEarthMatrix4([
      l00, l01, l02, inverseTranslation.x,
      l10, l11, l12, inverseTranslation.y,
      l20, l21, l22, inverseTranslation.z,
      0, 0, 0, 1
    ]);

  const product =
    multiplyHEarthMatrix4(
      matrix,
      inverse
    );

  const identity =
    createHEarthIdentityMatrix4();

  const residual =
    Math.max(
      ...product.entries.map(
        (entry, index) =>
          Math.abs(
            entry -
            identity.entries[index]
          )
      )
    );

  if (
    residual >
    toleranceContext.matrixResidualTolerance
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        inverse,

      classification:
        classification.classification,

      residual,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_RESIDUAL_TOO_LARGE',
            'ERROR',
            'Affine inversion residual exceeded the admitted tolerance.',
            {
              residual,
              matrixResidualTolerance:
                toleranceContext.matrixResidualTolerance
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    matrix:
      inverse,

    classification:
      classification.classification,

    residual,

    issues:
      deepFreeze([])
  });
};


export const transformHEarthNormal3 = (
  matrix,
  normal,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  const classification =
    classifyHEarthTransform(
      matrix,
      toleranceContext
    );

  if (
    classification.classification ===
      'INVALID' ||
    classification.classification ===
      'AFFINE_SINGULAR'
  ) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      classification:
        classification.classification,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'NORMAL_TRANSFORM_NONINVERTIBLE',
            'ERROR',
            'Normal transformation requires an invertible affine linear part.'
          )
        ])
    });
  }

  if (
    classification.classification ===
      'IDENTITY' ||
    classification.classification ===
      'RIGID'
  ) {
    const transformed =
      transformHEarthDirection3(
        matrix,
        normal
      );

    const normalized =
      normalizeHEarthVector3(
        transformed,
        toleranceContext.normalLengthTolerance
      );

    return deepFreeze({
      valid:
        normalized.valid,

      normal:
        normalized.vector,

      classification:
        classification.classification,

      issues:
        normalized.issues
    });
  }

  const inverseResult =
    invertHEarthMatrix4(
      matrix,
      toleranceContext
    );

  if (!inverseResult.valid) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      classification:
        classification.classification,

      issues:
        inverseResult.issues
    });
  }

  const inverseTranspose =
    transposeHEarthMatrix4(
      inverseResult.matrix
    );

  const transformed =
    transformHEarthDirection3(
      inverseTranspose,
      normal
    );

  const normalized =
    normalizeHEarthVector3(
      transformed,
      toleranceContext.normalLengthTolerance
    );

  return deepFreeze({
    valid:
      normalized.valid,

    normal:
      normalized.vector,

    classification:
      classification.classification,

    issues:
      normalized.issues
  });
};


/* ==========================================================================
 * 08 · AABB BOUNDS MATHEMATICS
 * ========================================================================== */

export const createHEarthEmptyBounds = () =>
  deepFreeze({
    type:
      'AABB_3D',

    minimum:
      null,

    maximum:
      null,

    center:
      null,

    size:
      null,

    halfExtent:
      null,

    diagonalLength:
      0,

    empty:
      true,

    finite:
      true,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame
  });


export const createHEarthBoundsFromMinimumMaximum = (
  minimum,
  maximum
) => {
  if (
    !isHEarthVector3(minimum) ||
    !isHEarthVector3(maximum) ||
    minimum.x > maximum.x ||
    minimum.y > maximum.y ||
    minimum.z > maximum.z
  ) {
    return createHEarthEmptyBounds();
  }

  const size =
    subtractHEarthVector3(
      maximum,
      minimum
    );

  const halfExtent =
    scaleHEarthVector3(
      size,
      0.5
    );

  const center =
    addHEarthVector3(
      minimum,
      halfExtent
    );

  return deepFreeze({
    type:
      'AABB_3D',

    minimum:
      cloneHEarthVector3(minimum),

    maximum:
      cloneHEarthVector3(maximum),

    center,

    size,

    halfExtent,

    diagonalLength:
      getHEarthVector3Length(size),

    empty:
      false,

    finite:
      true,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame
  });
};


export const createHEarthGeometryBounds = (
  points = []
) => {
  const validPoints =
    ensureArray(points)
      .filter(isHEarthVector3);

  if (validPoints.length === 0) {
    return createHEarthEmptyBounds();
  }

  let minimum =
    cloneHEarthVector3(validPoints[0]);

  let maximum =
    cloneHEarthVector3(validPoints[0]);

  for (let index = 1; index < validPoints.length; index += 1) {
    minimum =
      minimumHEarthVector3(
        minimum,
        validPoints[index]
      );

    maximum =
      maximumHEarthVector3(
        maximum,
        validPoints[index]
      );
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
};


export const expandHEarthBoundsByRadius = (
  bounds,
  radius
) => {
  if (
    !isPlainObject(bounds) ||
    bounds.empty === true ||
    !isHEarthNonNegativeFiniteNumber(radius)
  ) {
    return bounds?.empty === true
      ? createHEarthEmptyBounds()
      : null;
  }

  const extent =
    createHEarthVector3(
      radius,
      radius,
      radius
    );

  return createHEarthBoundsFromMinimumMaximum(
    subtractHEarthVector3(
      bounds.minimum,
      extent
    ),
    addHEarthVector3(
      bounds.maximum,
      extent
    )
  );
};


export const expandHEarthBoundsByExtent = (
  bounds,
  extent
) => {
  if (
    !isPlainObject(bounds) ||
    bounds.empty === true ||
    !isHEarthVector3(extent) ||
    extent.x < 0 ||
    extent.y < 0 ||
    extent.z < 0
  ) {
    return bounds?.empty === true
      ? createHEarthEmptyBounds()
      : null;
  }

  return createHEarthBoundsFromMinimumMaximum(
    subtractHEarthVector3(
      bounds.minimum,
      extent
    ),
    addHEarthVector3(
      bounds.maximum,
      extent
    )
  );
};


export const mergeHEarthGeometryBounds = (
  boundsList = []
) => {
  const validBounds =
    ensureArray(boundsList)
      .filter(
        (bounds) =>
          isPlainObject(bounds) &&
          bounds.empty === false &&
          isHEarthVector3(bounds.minimum) &&
          isHEarthVector3(bounds.maximum)
      );

  if (validBounds.length === 0) {
    return createHEarthEmptyBounds();
  }

  let minimum =
    cloneHEarthVector3(
      validBounds[0].minimum
    );

  let maximum =
    cloneHEarthVector3(
      validBounds[0].maximum
    );

  for (
    let index = 1;
    index < validBounds.length;
    index += 1
  ) {
    minimum =
      minimumHEarthVector3(
        minimum,
        validBounds[index].minimum
      );

    maximum =
      maximumHEarthVector3(
        maximum,
        validBounds[index].maximum
      );
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
};


export const createHEarthBillboardConservativeBounds = ({
  center,
  width,
  height
}) => {
  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthPositiveFiniteNumber(height)
  ) {
    return createHEarthEmptyBounds();
  }

  const radius =
    0.5 *
    Math.sqrt(
      width ** 2 +
      height ** 2
    );

  return deepFreeze({
    ...createHEarthBoundsFromMinimumMaximum(
      createHEarthVector3(
        center.x - radius,
        center.y - radius,
        center.z - radius
      ),

      createHEarthVector3(
        center.x + radius,
        center.y + radius,
        center.z + radius
      )
    ),

    classification:
      'VIEW_DEPENDENT_CONSERVATIVE_BOUNDS',

    conservativeRadius:
      radius
  });
};


const normalizeCapacityWorldBounds = (
  worldBounds =
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
) =>
  deepFreeze({
    minimum:
      createHEarthVector3(
        worldBounds.x.minimum,
        worldBounds.y.minimum,
        worldBounds.z.minimum
      ),

    maximum:
      createHEarthVector3(
        worldBounds.x.maximum,
        worldBounds.y.maximum,
        worldBounds.z.maximum
      ),

    coordinateFrame:
      worldBounds.coordinateFrame
  });


export const evaluateHEarthGeometryBounds = (
  bounds,
  options = {}
) => {
  const worldBounds =
    normalizeCapacityWorldBounds(
      options.worldBounds ??
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
    );

  const policy =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_ENUMS.boundsPolicy,
      options.policy
    )
      ? options.policy
      : H_EARTH_3D_GEOMETRY_ENUMS
          .boundsPolicy.REJECT_OUT_OF_BOUNDS;

  const issues = [];

  const structuralValid =
    isPlainObject(bounds) &&
    bounds.type === 'AABB_3D' &&
    typeof bounds.empty === 'boolean' &&
    bounds.finite === true;

  if (!structuralValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_BOUNDS_INVALID_STRUCTURE',
        'ERROR',
        'Geometry bounds do not satisfy the AABB_3D structure.'
      )
    );
  }

  if (
    structuralValid &&
    bounds.empty === false
  ) {
    if (
      !isHEarthVector3(bounds.minimum) ||
      !isHEarthVector3(bounds.maximum) ||
      !isHEarthVector3(bounds.center) ||
      !isHEarthVector3(bounds.size) ||
      !isHEarthVector3(bounds.halfExtent)
    ) {
      issues.push(
        createHEarthGeometryIssue(
          'GEOMETRY_BOUNDS_NONFINITE',
          'ERROR',
          'Nonempty bounds require finite Vector3 fields.'
        )
      );
    }
  }

  const insideWorld =
    structuralValid &&
    (
      bounds.empty === true ||
      (
        bounds.minimum.x >=
          worldBounds.minimum.x &&
        bounds.minimum.y >=
          worldBounds.minimum.y &&
        bounds.minimum.z >=
          worldBounds.minimum.z &&
        bounds.maximum.x <=
          worldBounds.maximum.x &&
        bounds.maximum.y <=
          worldBounds.maximum.y &&
        bounds.maximum.z <=
          worldBounds.maximum.z
      )
    );

  if (
    structuralValid &&
    !insideWorld
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_BOUNDS_OUTSIDE_WORLD',
        policy ===
          H_EARTH_3D_GEOMETRY_ENUMS
            .boundsPolicy.RETAIN_WITH_ISSUE
          ? 'WARNING'
          : 'ERROR',
        'Geometry bounds exceed the admitted H-Earth world bounds.',
        {
          bounds,
          worldBounds,
          policy
        },
        policy !==
          H_EARTH_3D_GEOMETRY_ENUMS
            .boundsPolicy.RETAIN_WITH_ISSUE
      )
    );
  }

  return deepFreeze({
    evaluator:
      'evaluateHEarthGeometryBounds',

    structurallyValid,

    insideWorld,

    policy,

    admitted:
      structuralValid &&
      (
        insideWorld ||
        policy ===
          H_EARTH_3D_GEOMETRY_ENUMS
            .boundsPolicy.RETAIN_WITH_ISSUE
      ) &&
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


/* ==========================================================================
 * 09 · EQUATION DESCRIPTORS
 * ========================================================================== */

const createEquationDescriptor = ({
  descriptorId,
  descriptorVersion = 1,
  descriptorType,
  coordinateFrame =
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
      .coordinateFrame,
  domain,
  closure =
    H_EARTH_3D_GEOMETRY_ENUMS
      .closure.UNSPECIFIED,
  evaluator,
  derivativePolicy = null,
  samplingPolicy = null,
  boundsPolicy =
    H_EARTH_3D_GEOMETRY_ENUMS
      .boundsPolicy.REJECT_OUT_OF_BOUNDS,
  metadata = {}
}) =>
  deepFreeze({
    descriptorId,
    descriptorVersion,
    descriptorType,
    coordinateFrame,
    domain:
      freezeClone(domain),
    closure,
    evaluator,
    derivativePolicy:
      freezeClone(derivativePolicy),
    samplingPolicy:
      freezeClone(samplingPolicy),
    boundsPolicy,
    metadata:
      freezeClone(metadata)
  });


export const createHEarthParametricCurveDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.PARAMETRIC_CURVE
  });


export const createHEarthParametricSurfaceDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.PARAMETRIC_SURFACE
  });


export const createHEarthHeightFieldDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.HEIGHT_FIELD
  });


export const createHEarthSignedDistanceFieldDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.SIGNED_DISTANCE_FIELD
  });


export const createHEarthRadialSurfaceDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.RADIAL_SURFACE
  });


export const createHEarthScalarFieldDescriptor = (
  options
) =>
  createEquationDescriptor({
    ...options,
    descriptorType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType.SCALAR_FIELD
  });


const descriptorDomainValid = (
  descriptor
) => {
  const domain =
    descriptor?.domain;

  switch (descriptor?.descriptorType) {
    case 'PARAMETRIC_CURVE':
    case 'PROFILE_CURVE':
    case 'EXTRUSION_PATH':
      return (
        isPlainObject(domain) &&
        isHEarthFiniteNumber(domain.minimum) &&
        isHEarthFiniteNumber(domain.maximum) &&
        domain.minimum < domain.maximum
      );

    case 'PARAMETRIC_SURFACE':
    case 'RADIAL_SURFACE':
      return (
        isPlainObject(domain) &&
        isPlainObject(domain.u) &&
        isPlainObject(domain.v) &&
        isHEarthFiniteNumber(domain.u.minimum) &&
        isHEarthFiniteNumber(domain.u.maximum) &&
        isHEarthFiniteNumber(domain.v.minimum) &&
        isHEarthFiniteNumber(domain.v.maximum) &&
        domain.u.minimum < domain.u.maximum &&
        domain.v.minimum < domain.v.maximum
      );

    case 'HEIGHT_FIELD':
      return (
        isPlainObject(domain) &&
        isPlainObject(domain.x) &&
        isPlainObject(domain.z) &&
        isHEarthFiniteNumber(domain.x.minimum) &&
        isHEarthFiniteNumber(domain.x.maximum) &&
        isHEarthFiniteNumber(domain.z.minimum) &&
        isHEarthFiniteNumber(domain.z.maximum) &&
        domain.x.minimum < domain.x.maximum &&
        domain.z.minimum < domain.z.maximum
      );

    case 'SIGNED_DISTANCE_FIELD':
    case 'SCALAR_FIELD':
      return (
        isPlainObject(domain) &&
        isPlainObject(domain.x) &&
        isPlainObject(domain.y) &&
        isPlainObject(domain.z) &&
        isHEarthFiniteNumber(domain.x.minimum) &&
        isHEarthFiniteNumber(domain.x.maximum) &&
        isHEarthFiniteNumber(domain.y.minimum) &&
        isHEarthFiniteNumber(domain.y.maximum) &&
        isHEarthFiniteNumber(domain.z.minimum) &&
        isHEarthFiniteNumber(domain.z.maximum) &&
        domain.x.minimum < domain.x.maximum &&
        domain.y.minimum < domain.y.maximum &&
        domain.z.minimum < domain.z.maximum
      );

    default:
      return false;
  }
};


const evaluatorOutputFinite = (
  descriptorType,
  value
) => {
  switch (descriptorType) {
    case 'PARAMETRIC_CURVE':
    case 'PARAMETRIC_SURFACE':
    case 'RADIAL_SURFACE':
    case 'PROFILE_CURVE':
    case 'EXTRUSION_PATH':
      return isHEarthVector3(value);

    case 'HEIGHT_FIELD':
    case 'SIGNED_DISTANCE_FIELD':
    case 'SCALAR_FIELD':
      return isHEarthFiniteNumber(value);

    default:
      return false;
  }
};


export const evaluateHEarthEquationDescriptor = (
  descriptor,
  parameters = null,
  options = {}
) => {
  const issues = [];

  const structurallyValid =
    isPlainObject(descriptor) &&
    isHEarthNonEmptyString(
      descriptor.descriptorId
    ) &&
    Number.isSafeInteger(
      descriptor.descriptorVersion
    ) &&
    descriptor.descriptorVersion > 0 &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_ENUMS
        .descriptorType,
      descriptor.descriptorType
    ) &&
    isHEarthNonEmptyString(
      descriptor.coordinateFrame
    ) &&
    typeof descriptor.evaluator === 'function';

  if (!structurallyValid) {
    issues.push(
      createHEarthGeometryIssue(
        'DESCRIPTOR_STRUCTURALLY_INVALID',
        'ERROR',
        'Equation descriptor is missing required structural fields.',
        {
          descriptorId:
            descriptor?.descriptorId,
          descriptorType:
            descriptor?.descriptorType
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );

    return deepFreeze({
      descriptorId:
        descriptor?.descriptorId ?? null,

      descriptorType:
        descriptor?.descriptorType ?? null,

      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .descriptorClassification
          .STRUCTURALLY_INVALID,

      evaluatorStatus:
        H_EARTH_3D_GEOMETRY_ENUMS
          .evaluatorStatus.HELD,

      value:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  if (!descriptorDomainValid(descriptor)) {
    issues.push(
      createHEarthGeometryIssue(
        'DESCRIPTOR_DOMAIN_INVALID',
        'ERROR',
        'Equation descriptor domain is invalid.',
        {
          domain:
            descriptor.domain
        },
        true,
        {
          descriptorId:
            descriptor.descriptorId
        }
      )
    );

    return deepFreeze({
      descriptorId:
        descriptor.descriptorId,

      descriptorType:
        descriptor.descriptorType,

      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .descriptorClassification
          .DOMAIN_INVALID,

      evaluatorStatus:
        H_EARTH_3D_GEOMETRY_ENUMS
          .evaluatorStatus.HELD,

      value:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  if (options.probe === false) {
    return deepFreeze({
      descriptorId:
        descriptor.descriptorId,

      descriptorType:
        descriptor.descriptorType,

      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .descriptorClassification
          .STRUCTURALLY_VALID,

      evaluatorStatus:
        H_EARTH_3D_GEOMETRY_ENUMS
          .evaluatorStatus.HELD,

      value:
        null,

      issues:
        deepFreeze([])
    });
  }

  try {
    const value =
      descriptor.evaluator(parameters);

    if (
      !evaluatorOutputFinite(
        descriptor.descriptorType,
        value
      )
    ) {
      issues.push(
        createHEarthGeometryIssue(
          'DESCRIPTOR_EVALUATOR_NONFINITE_RESULT',
          'ERROR',
          'Descriptor evaluator returned a nonfinite or invalid result.',
          {
            value
          },
          true,
          {
            descriptorId:
              descriptor.descriptorId
          }
        )
      );

      return deepFreeze({
        descriptorId:
          descriptor.descriptorId,

        descriptorType:
          descriptor.descriptorType,

        classification:
          H_EARTH_3D_GEOMETRY_ENUMS
            .descriptorClassification
            .EVALUATION_INVALID,

        evaluatorStatus:
          H_EARTH_3D_GEOMETRY_ENUMS
            .evaluatorStatus.NONFINITE,

        value:
          freezeClone(value),

        issues:
          sortHEarthGeometryIssues(issues)
      });
    }

    return deepFreeze({
      descriptorId:
        descriptor.descriptorId,

      descriptorType:
        descriptor.descriptorType,

      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .descriptorClassification
          .SAMPLEABLE,

      evaluatorStatus:
        H_EARTH_3D_GEOMETRY_ENUMS
          .evaluatorStatus.EVALUATED,

      value:
        freezeClone(value),

      issues:
        deepFreeze([])
    });
  } catch (error) {
    issues.push(
      createHEarthGeometryIssue(
        'DESCRIPTOR_EVALUATOR_EXCEPTION',
        'ERROR',
        'Descriptor evaluator threw an exception.',
        {
          name:
            error?.name ?? 'Error',

          message:
            error?.message ?? String(error)
        },
        true,
        {
          descriptorId:
            descriptor.descriptorId
        }
      )
    );

    return deepFreeze({
      descriptorId:
        descriptor.descriptorId,

      descriptorType:
        descriptor.descriptorType,

      classification:
        H_EARTH_3D_GEOMETRY_ENUMS
          .descriptorClassification
          .EVALUATION_INVALID,

      evaluatorStatus:
        H_EARTH_3D_GEOMETRY_ENUMS
          .evaluatorStatus.EXCEPTION,

      value:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }
};


/* ==========================================================================
 * 10 · DETERMINISTIC SAMPLING
 * ========================================================================== */

const createOpenSampleParameters = (
  minimum,
  maximum,
  segmentCount
) => {
  const values = [];

  for (
    let index = 0;
    index <= segmentCount;
    index += 1
  ) {
    values.push(
      minimum +
        (
          index /
          segmentCount
        ) *
        (maximum - minimum)
    );
  }

  return values;
};


const createPeriodicSampleParameters = (
  minimum,
  maximum,
  segmentCount
) => {
  const values = [];

  for (
    let index = 0;
    index < segmentCount;
    index += 1
  ) {
    values.push(
      minimum +
        (
          index /
          segmentCount
        ) *
        (maximum - minimum)
    );
  }

  return values;
};


export const evaluateHEarthDuplicateSamples = (
  samples,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  const duplicateGroups = [];
  const claimed = new Set();

  for (
    let leftIndex = 0;
    leftIndex < samples.length;
    leftIndex += 1
  ) {
    if (
      claimed.has(leftIndex) ||
      !isHEarthVector3(samples[leftIndex])
    ) {
      continue;
    }

    const group =
      [leftIndex];

    for (
      let rightIndex = leftIndex + 1;
      rightIndex < samples.length;
      rightIndex += 1
    ) {
      if (
        !isHEarthVector3(samples[rightIndex])
      ) {
        continue;
      }

      if (
        getHEarthVector3Distance(
          samples[leftIndex],
          samples[rightIndex]
        ) <=
        toleranceContext.positionTolerance
      ) {
        group.push(rightIndex);
        claimed.add(rightIndex);
      }
    }

    if (group.length > 1) {
      duplicateGroups.push(
        deepFreeze({
          canonicalRepresentative:
            group[0],

          sampleIndices:
            deepFreeze(group)
        })
      );
    }
  }

  return deepFreeze({
    duplicateGroups:
      deepFreeze(duplicateGroups),

    duplicateSampleCount:
      duplicateGroups.reduce(
        (sum, group) =>
          sum +
          group.sampleIndices.length -
          1,
        0
      ),

    uniqueSampleCount:
      samples.length -
      duplicateGroups.reduce(
        (sum, group) =>
          sum +
          group.sampleIndices.length -
          1,
        0
      )
  });
};


const createSampleSet = ({
  descriptorId,
  parameterOrder,
  endpointPolicy,
  requestedSampleCount,
  evaluatedSamples,
  rejectedSamples,
  issues,
  toleranceContext
}) => {
  const finiteSamples =
    evaluatedSamples.filter(
      (sample) =>
        isHEarthVector3(sample.value)
    );

  const duplicateEvaluation =
    evaluateHEarthDuplicateSamples(
      finiteSamples.map(
        (sample) =>
          sample.value
      ),
      toleranceContext
    );

  return deepFreeze({
    descriptorId,

    requestedSampleCount,

    evaluatedSampleCount:
      evaluatedSamples.length,

    finiteSampleCount:
      finiteSamples.length,

    uniqueSampleCount:
      duplicateEvaluation.uniqueSampleCount,

    duplicateSampleCount:
      duplicateEvaluation.duplicateSampleCount,

    admittedSampleCount:
      finiteSamples.length,

    samples:
      deepFreeze(evaluatedSamples),

    duplicateGroups:
      duplicateEvaluation.duplicateGroups,

    rejectedSamples:
      deepFreeze(rejectedSamples),

    issues:
      sortHEarthGeometryIssues(issues),

    parameterOrder,

    endpointPolicy
  });
};


export const sampleHEarthParametricCurve = (
  descriptor,
  options = {}
) => {
  const segmentCount =
    Number.isSafeInteger(
      options.segmentCount
    )
      ? options.segmentCount
      : descriptor?.samplingPolicy
          ?.segmentCount;

  const periodic =
    descriptor?.closure ===
      H_EARTH_3D_GEOMETRY_ENUMS
        .closure.CLOSED_PERIODIC;

  const minimum =
    descriptor?.domain?.minimum;

  const maximum =
    descriptor?.domain?.maximum;

  const issues = [];

  if (
    !Number.isSafeInteger(segmentCount) ||
    segmentCount <
      (periodic ? 3 : 1)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'CURVE_SAMPLE_COUNT_INVALID',
        'ERROR',
        'Curve segment count is invalid.',
        {
          segmentCount,
          periodic
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  const requestedSampleCount =
    periodic
      ? segmentCount
      : segmentCount + 1;

  if (
    Number.isSafeInteger(
      requestedSampleCount
    ) &&
    requestedSampleCount >
      H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
        .maximumCurveSampleCount
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'CURVE_SAMPLE_COUNT_ABOVE_SAFETY_CEILING',
        'ERROR',
        'Requested curve samples exceed the mathematical safety ceiling.',
        {
          requestedSampleCount,
          maximum:
            H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
              .maximumCurveSampleCount
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues) ||
    !descriptorDomainValid(descriptor)
  ) {
    return createSampleSet({
      descriptorId:
        descriptor?.descriptorId ?? null,

      parameterOrder:
        'T_ASCENDING',

      endpointPolicy:
        periodic
          ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
          : 'INCLUDE_BOTH_ENDPOINTS',

      requestedSampleCount:
        Number.isSafeInteger(
          requestedSampleCount
        )
          ? requestedSampleCount
          : 0,

      evaluatedSamples:
        [],

      rejectedSamples:
        [],

      issues,

      toleranceContext:
        deriveHEarthGeometryToleranceContext()
    });
  }

  const parameters =
    periodic
      ? createPeriodicSampleParameters(
          minimum,
          maximum,
          segmentCount
        )
      : createOpenSampleParameters(
          minimum,
          maximum,
          segmentCount
        );

  const evaluatedSamples = [];
  const rejectedSamples = [];

  parameters.forEach(
    (parameter, sampleIndex) => {
      const result =
        evaluateHEarthEquationDescriptor(
          descriptor,
          parameter
        );

      if (
        result.evaluatorStatus ===
        'EVALUATED' &&
        isHEarthVector3(result.value)
      ) {
        evaluatedSamples.push(
          deepFreeze({
            sampleIndex,
            parameter,
            value:
              cloneHEarthVector3(
                result.value
              )
          })
        );
      } else {
        rejectedSamples.push(
          deepFreeze({
            sampleIndex,
            parameter,
            evaluation:
              result
          })
        );

        issues.push(
          ...result.issues
        );
      }
    }
  );

  const bounds =
    createHEarthGeometryBounds(
      evaluatedSamples.map(
        (sample) =>
          sample.value
      )
    );

  const toleranceContext =
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  return createSampleSet({
    descriptorId:
      descriptor.descriptorId,

    parameterOrder:
      'T_ASCENDING',

    endpointPolicy:
      periodic
        ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
        : 'INCLUDE_BOTH_ENDPOINTS',

    requestedSampleCount,

    evaluatedSamples,

    rejectedSamples,

    issues,

    toleranceContext
  });
};


export const sampleHEarthParametricSurface = (
  descriptor,
  options = {}
) => {
  const uSegmentCount =
    Number.isSafeInteger(
      options.uSegmentCount
    )
      ? options.uSegmentCount
      : descriptor?.samplingPolicy
          ?.uSegmentCount;

  const vSegmentCount =
    Number.isSafeInteger(
      options.vSegmentCount
    )
      ? options.vSegmentCount
      : descriptor?.samplingPolicy
          ?.vSegmentCount;

  const periodicU =
    descriptor?.samplingPolicy
      ?.periodicU === true;

  const periodicV =
    descriptor?.samplingPolicy
      ?.periodicV === true;

  const uSampleCount =
    periodicU
      ? uSegmentCount
      : uSegmentCount + 1;

  const vSampleCount =
    periodicV
      ? vSegmentCount
      : vSegmentCount + 1;

  const issues = [];

  if (
    !Number.isSafeInteger(uSegmentCount) ||
    uSegmentCount <
      (periodicU ? 3 : 1)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SURFACE_U_SAMPLE_COUNT_INVALID',
        'ERROR',
        'Surface U segment count is invalid.',
        {
          uSegmentCount,
          periodicU
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  if (
    !Number.isSafeInteger(vSegmentCount) ||
    vSegmentCount <
      (periodicV ? 3 : 1)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SURFACE_V_SAMPLE_COUNT_INVALID',
        'ERROR',
        'Surface V segment count is invalid.',
        {
          vSegmentCount,
          periodicV
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  if (
    uSampleCount >
      H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
        .maximumSurfaceUSampleCount
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SURFACE_U_SAMPLE_COUNT_ABOVE_SAFETY_CEILING',
        'ERROR',
        'Surface U sample count exceeds the safety ceiling.',
        {
          uSampleCount
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  if (
    vSampleCount >
      H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
        .maximumSurfaceVSampleCount
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SURFACE_V_SAMPLE_COUNT_ABOVE_SAFETY_CEILING',
        'ERROR',
        'Surface V sample count exceeds the safety ceiling.',
        {
          vSampleCount
        },
        true,
        {
          descriptorId:
            descriptor?.descriptorId
        }
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues) ||
    !descriptorDomainValid(descriptor)
  ) {
    return deepFreeze({
      descriptorId:
        descriptor?.descriptorId ?? null,

      requestedSampleCount:
        0,

      evaluatedSampleCount:
        0,

      finiteSampleCount:
        0,

      uniqueSampleCount:
        0,

      admittedSampleCount:
        0,

      rowCount:
        0,

      columnCount:
        0,

      samples:
        deepFreeze([]),

      rejectedSamples:
        deepFreeze([]),

      issues:
        sortHEarthGeometryIssues(issues),

      parameterOrder:
        'U_FASTEST_V_BY_ROW',

      endpointPolicy:
        deepFreeze({
          u:
            periodicU
              ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
              : 'INCLUDE_BOTH_ENDPOINTS',

          v:
            periodicV
              ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
              : 'INCLUDE_BOTH_ENDPOINTS'
        })
    });
  }

  const uParameters =
    periodicU
      ? createPeriodicSampleParameters(
          descriptor.domain.u.minimum,
          descriptor.domain.u.maximum,
          uSegmentCount
        )
      : createOpenSampleParameters(
          descriptor.domain.u.minimum,
          descriptor.domain.u.maximum,
          uSegmentCount
        );

  const vParameters =
    periodicV
      ? createPeriodicSampleParameters(
          descriptor.domain.v.minimum,
          descriptor.domain.v.maximum,
          vSegmentCount
        )
      : createOpenSampleParameters(
          descriptor.domain.v.minimum,
          descriptor.domain.v.maximum,
          vSegmentCount
        );

  const samples = [];
  const rejectedSamples = [];

  for (
    let vIndex = 0;
    vIndex < vParameters.length;
    vIndex += 1
  ) {
    for (
      let uIndex = 0;
      uIndex < uParameters.length;
      uIndex += 1
    ) {
      const sampleIndex =
        vIndex *
          uParameters.length +
        uIndex;

      const parameters =
        deepFreeze({
          u:
            uParameters[uIndex],

          v:
            vParameters[vIndex]
        });

      const evaluation =
        evaluateHEarthEquationDescriptor(
          descriptor,
          parameters
        );

      if (
        evaluation.evaluatorStatus ===
          'EVALUATED' &&
        isHEarthVector3(evaluation.value)
      ) {
        samples.push(
          deepFreeze({
            sampleIndex,
            uIndex,
            vIndex,
            parameters,
            value:
              cloneHEarthVector3(
                evaluation.value
              )
          })
        );
      } else {
        rejectedSamples.push(
          deepFreeze({
            sampleIndex,
            uIndex,
            vIndex,
            parameters,
            evaluation
          })
        );

        issues.push(
          ...evaluation.issues
        );
      }
    }
  }

  const finiteValues =
    samples.map(
      (sample) =>
        sample.value
    );

  const bounds =
    createHEarthGeometryBounds(
      finiteValues
    );

  const toleranceContext =
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  const duplicates =
    evaluateHEarthDuplicateSamples(
      finiteValues,
      toleranceContext
    );

  return deepFreeze({
    descriptorId:
      descriptor.descriptorId,

    requestedSampleCount:
      uSampleCount *
      vSampleCount,

    evaluatedSampleCount:
      samples.length +
      rejectedSamples.length,

    finiteSampleCount:
      samples.length,

    uniqueSampleCount:
      duplicates.uniqueSampleCount,

    duplicateSampleCount:
      duplicates.duplicateSampleCount,

    admittedSampleCount:
      samples.length,

    rowCount:
      vSampleCount,

    columnCount:
      uSampleCount,

    periodicU,

    periodicV,

    samples:
      deepFreeze(samples),

    duplicateGroups:
      duplicates.duplicateGroups,

    rejectedSamples:
      deepFreeze(rejectedSamples),

    issues:
      sortHEarthGeometryIssues(issues),

    parameterOrder:
      'U_FASTEST_V_BY_ROW',

    endpointPolicy:
      deepFreeze({
        u:
          periodicU
            ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
            : 'INCLUDE_BOTH_ENDPOINTS',

        v:
          periodicV
            ? 'NO_DUPLICATE_TERMINAL_SAMPLE'
            : 'INCLUDE_BOTH_ENDPOINTS'
      })
  });
};


export const sampleHEarthHeightField = (
  descriptor,
  options = {}
) => {
  const xSegmentCount =
    Number.isSafeInteger(
      options.xSegmentCount
    )
      ? options.xSegmentCount
      : descriptor?.samplingPolicy
          ?.xSegmentCount;

  const zSegmentCount =
    Number.isSafeInteger(
      options.zSegmentCount
    )
      ? options.zSegmentCount
      : descriptor?.samplingPolicy
          ?.zSegmentCount;

  const surfaceDescriptor =
    createHEarthParametricSurfaceDescriptor({
      descriptorId:
        `${descriptor.descriptorId}__SURFACE_ADAPTER`,

      descriptorVersion:
        descriptor.descriptorVersion,

      coordinateFrame:
        descriptor.coordinateFrame,

      domain:
        deepFreeze({
          u:
            descriptor.domain.x,

          v:
            descriptor.domain.z
        }),

      closure:
        H_EARTH_3D_GEOMETRY_ENUMS
          .closure.OPEN,

      evaluator:
        ({ u, v }) => {
          const height =
            descriptor.evaluator({
              x: u,
              z: v
            });

          return createHEarthVector3(
            u,
            height,
            v
          );
        },

      derivativePolicy:
        descriptor.derivativePolicy,

      samplingPolicy:
        deepFreeze({
          uSegmentCount:
            xSegmentCount,

          vSegmentCount:
            zSegmentCount,

          periodicU:
            false,

          periodicV:
            false
        }),

      boundsPolicy:
        descriptor.boundsPolicy,

      metadata:
        deepFreeze({
          adaptedFrom:
            descriptor.descriptorId,

          sourceDescriptorType:
            'HEIGHT_FIELD'
        })
    });

  return sampleHEarthParametricSurface(
    surfaceDescriptor,
    {
      uSegmentCount:
        xSegmentCount,

      vSegmentCount:
        zSegmentCount
    }
  );
};


export const sampleHEarthRadialSurface =
  sampleHEarthParametricSurface;


export const sampleHEarthProfileCurve =
  sampleHEarthParametricCurve;


/* ==========================================================================
 * 11 · TRIANGLE AND DIFFERENTIAL GEOMETRY
 * ========================================================================== */

export const calculateHEarthTriangleNormal = (
  a,
  b,
  c,
  toleranceContext = null
) => {
  const points =
    [a, b, c];

  const bounds =
    createHEarthGeometryBounds(points);

  const context =
    toleranceContext ??
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  const issues = [];

  if (
    !isHEarthVector3(a) ||
    !isHEarthVector3(b) ||
    !isHEarthVector3(c)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'MESH_TRIANGLE_NONFINITE_VERTEX',
        'ERROR',
        'Triangle normal calculation requires three finite Vector3 vertices.'
      )
    );

    return deepFreeze({
      valid:
        false,

      edge1:
        null,

      edge2:
        null,

      rawCross:
        null,

      doubleArea:
        null,

      triangleArea:
        null,

      normal:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const edge1 =
    subtractHEarthVector3(
      b,
      a
    );

  const edge2 =
    subtractHEarthVector3(
      c,
      a
    );

  const rawCross =
    crossHEarthVector3(
      edge1,
      edge2
    );

  const doubleArea =
    getHEarthVector3Length(
      rawCross
    );

  const triangleArea =
    0.5 *
    doubleArea;

  const rawCrossValid =
    doubleArea >
    2 *
      context.areaTolerance;

  const normalized =
    normalizeHEarthVector3(
      rawCross,
      context.normalLengthTolerance
    );

  const valid =
    rawCrossValid &&
    normalized.valid;

  if (!valid) {
    issues.push(
      createHEarthGeometryIssue(
        'MESH_TRIANGLE_DEGENERATE',
        'ERROR',
        'Triangle area is at or below the active area tolerance.',
        {
          doubleArea,
          triangleArea,
          areaTolerance:
            context.areaTolerance
        }
      )
    );
  }

  return deepFreeze({
    valid,

    edge1,

    edge2,

    rawCross,

    doubleArea,

    triangleArea,

    normal:
      normalized.vector,

    issues:
      sortHEarthGeometryIssues([
        ...issues,
        ...normalized.issues
      ])
  });
};


export const calculateHEarthFaceNormals = (
  vertices,
  indices,
  toleranceContext = null
) => {
  const normals = [];
  const issues = [];

  for (
    let index = 0;
    index < indices.length;
    index += 3
  ) {
    const i0 =
      indices[index];

    const i1 =
      indices[index + 1];

    const i2 =
      indices[index + 2];

    const evaluation =
      calculateHEarthTriangleNormal(
        vertices[i0],
        vertices[i1],
        vertices[i2],
        toleranceContext
      );

    normals.push(
      evaluation.normal
    );

    issues.push(
      ...evaluation.issues
    );
  }

  return deepFreeze({
    faceNormals:
      deepFreeze(normals),

    faceNormalCount:
      normals.length,

    valid:
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const calculateHEarthVertexNormals = (
  vertices,
  indices,
  toleranceContext = null
) => {
  const accumulators =
    vertices.map(
      () =>
        createHEarthVector3(
          0,
          0,
          0
        )
    );

  const issues = [];

  for (
    let index = 0;
    index < indices.length;
    index += 3
  ) {
    const i0 =
      indices[index];

    const i1 =
      indices[index + 1];

    const i2 =
      indices[index + 2];

    const evaluation =
      calculateHEarthTriangleNormal(
        vertices[i0],
        vertices[i1],
        vertices[i2],
        toleranceContext
      );

    if (!evaluation.valid) {
      issues.push(
        ...evaluation.issues
      );

      continue;
    }

    for (const vertexIndex of [i0, i1, i2]) {
      accumulators[vertexIndex] =
        addHEarthVector3(
          accumulators[vertexIndex],
          evaluation.rawCross
        );
    }
  }

  const vertexNormals =
    accumulators.map(
      (accumulator, vertexIndex) => {
        const normalized =
          normalizeHEarthVector3(
            accumulator,
            toleranceContext
              ?.normalLengthTolerance ??
              H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
                .normalLengthEpsilon
          );

        if (!normalized.valid) {
          issues.push(
            createHEarthGeometryIssue(
              'INVALID_VERTEX_NORMAL',
              'ERROR',
              'Vertex normal accumulator is zero or nonfinite.',
              {
                vertexIndex,
                accumulator
              }
            )
          );
        }

        return normalized.vector;
      }
    );

  return deepFreeze({
    vertexNormals:
      deepFreeze(vertexNormals),

    vertexNormalCount:
      vertexNormals.length,

    valid:
      !hasHEarthBlockingIssues(issues),

    accumulationPolicy:
      'RAW_CROSS_TWICE_AREA_WEIGHTED_ONCE',

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const estimateHEarthPartialDerivativeU = ({
  descriptor,
  u,
  v,
  step = null
}) => {
  const domainSpan =
    descriptor.domain.u.maximum -
    descriptor.domain.u.minimum;

  const h =
    step ??
    Math.max(
      Math.abs(domainSpan) *
        H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .derivativeRelativeStep,

      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
    );

  const minimum =
    descriptor.domain.u.minimum;

  const maximum =
    descriptor.domain.u.maximum;

  const periodic =
    descriptor.samplingPolicy
      ?.periodicU === true;

  const wrap = (value) => {
    const span =
      maximum - minimum;

    return (
      ((value - minimum) % span + span) %
        span +
      minimum
    );
  };

  let left =
    u - h;

  let right =
    u + h;

  if (periodic) {
    left =
      wrap(left);

    right =
      wrap(right);
  } else if (left < minimum) {
    left =
      u;

    right =
      Math.min(
        maximum,
        u + h
      );
  } else if (right > maximum) {
    right =
      u;

    left =
      Math.max(
        minimum,
        u - h
      );
  }

  const leftValue =
    descriptor.evaluator({
      u: left,
      v
    });

  const rightValue =
    descriptor.evaluator({
      u: right,
      v
    });

  if (
    !isHEarthVector3(leftValue) ||
    !isHEarthVector3(rightValue)
  ) {
    return null;
  }

  const denominator =
    right - left;

  if (
    Math.abs(denominator) <=
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .parameterEpsilon
  ) {
    return null;
  }

  return scaleHEarthVector3(
    subtractHEarthVector3(
      rightValue,
      leftValue
    ),
    1 / denominator
  );
};


export const estimateHEarthPartialDerivativeV = ({
  descriptor,
  u,
  v,
  step = null
}) => {
  const domainSpan =
    descriptor.domain.v.maximum -
    descriptor.domain.v.minimum;

  const h =
    step ??
    Math.max(
      Math.abs(domainSpan) *
        H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .derivativeRelativeStep,

      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
    );

  const minimum =
    descriptor.domain.v.minimum;

  const maximum =
    descriptor.domain.v.maximum;

  const periodic =
    descriptor.samplingPolicy
      ?.periodicV === true;

  const wrap = (value) => {
    const span =
      maximum - minimum;

    return (
      ((value - minimum) % span + span) %
        span +
      minimum
    );
  };

  let lower =
    v - h;

  let upper =
    v + h;

  if (periodic) {
    lower =
      wrap(lower);

    upper =
      wrap(upper);
  } else if (lower < minimum) {
    lower =
      v;

    upper =
      Math.min(
        maximum,
        v + h
      );
  } else if (upper > maximum) {
    upper =
      v;

    lower =
      Math.max(
        minimum,
        v - h
      );
  }

  const lowerValue =
    descriptor.evaluator({
      u,
      v: lower
    });

  const upperValue =
    descriptor.evaluator({
      u,
      v: upper
    });

  if (
    !isHEarthVector3(lowerValue) ||
    !isHEarthVector3(upperValue)
  ) {
    return null;
  }

  const denominator =
    upper - lower;

  if (
    Math.abs(denominator) <=
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .parameterEpsilon
  ) {
    return null;
  }

  return scaleHEarthVector3(
    subtractHEarthVector3(
      upperValue,
      lowerValue
    ),
    1 / denominator
  );
};


export const evaluateHEarthParametricSurfaceNormal = ({
  descriptor,
  u,
  v,
  normalOrientation =
    H_EARTH_3D_GEOMETRY_ENUMS
      .normalOrientation.U_CROSS_V
}) => {
  const derivativeU =
    estimateHEarthPartialDerivativeU({
      descriptor,
      u,
      v
    });

  const derivativeV =
    estimateHEarthPartialDerivativeV({
      descriptor,
      u,
      v
    });

  if (
    !derivativeU ||
    !derivativeV
  ) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'PARAMETRIC_SURFACE_DERIVATIVE_INVALID',
            'ERROR',
            'Parametric surface normal requires finite U and V derivatives.',
            {
              u,
              v
            },
            true,
            {
              descriptorId:
                descriptor?.descriptorId
            }
          )
        ])
    });
  }

  let rawNormal;

  if (
    normalOrientation ===
    H_EARTH_3D_GEOMETRY_ENUMS
      .normalOrientation.V_CROSS_U
  ) {
    rawNormal =
      crossHEarthVector3(
        derivativeV,
        derivativeU
      );
  } else {
    rawNormal =
      crossHEarthVector3(
        derivativeU,
        derivativeV
      );
  }

  if (
    normalOrientation ===
    H_EARTH_3D_GEOMETRY_ENUMS
      .normalOrientation.EXPLICIT_INVERT
  ) {
    rawNormal =
      scaleHEarthVector3(
        rawNormal,
        -1
      );
  }

  const normalized =
    normalizeHEarthVector3(
      rawNormal
    );

  return deepFreeze({
    valid:
      normalized.valid,

    normal:
      normalized.vector,

    derivativeU,

    derivativeV,

    issues:
      normalized.issues
  });
};


export const estimateHEarthPartialDerivativeX = ({
  descriptor,
  x,
  z,
  step = null
}) => {
  const span =
    descriptor.domain.x.maximum -
    descriptor.domain.x.minimum;

  const h =
    step ??
    Math.max(
      Math.abs(span) *
        H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .derivativeRelativeStep,

      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
    );

  const left =
    Math.max(
      descriptor.domain.x.minimum,
      x - h
    );

  const right =
    Math.min(
      descriptor.domain.x.maximum,
      x + h
    );

  const denominator =
    right - left;

  if (
    denominator <=
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .parameterEpsilon
  ) {
    return Number.NaN;
  }

  return (
    descriptor.evaluator({
      x: right,
      z
    }) -
    descriptor.evaluator({
      x: left,
      z
    })
  ) / denominator;
};


export const estimateHEarthPartialDerivativeZ = ({
  descriptor,
  x,
  z,
  step = null
}) => {
  const span =
    descriptor.domain.z.maximum -
    descriptor.domain.z.minimum;

  const h =
    step ??
    Math.max(
      Math.abs(span) *
        H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .derivativeRelativeStep,

      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
    );

  const lower =
    Math.max(
      descriptor.domain.z.minimum,
      z - h
    );

  const upper =
    Math.min(
      descriptor.domain.z.maximum,
      z + h
    );

  const denominator =
    upper - lower;

  if (
    denominator <=
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .parameterEpsilon
  ) {
    return Number.NaN;
  }

  return (
    descriptor.evaluator({
      x,
      z: upper
    }) -
    descriptor.evaluator({
      x,
      z: lower
    })
  ) / denominator;
};


export const evaluateHEarthHeightFieldNormal = ({
  descriptor,
  x,
  z
}) => {
  const partialX =
    estimateHEarthPartialDerivativeX({
      descriptor,
      x,
      z
    });

  const partialZ =
    estimateHEarthPartialDerivativeZ({
      descriptor,
      x,
      z
    });

  if (
    !isHEarthFiniteNumber(partialX) ||
    !isHEarthFiniteNumber(partialZ)
  ) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'HEIGHT_FIELD_DERIVATIVE_INVALID',
            'ERROR',
            'Height-field normal requires finite X and Z derivatives.',
            {
              x,
              z
            },
            true,
            {
              descriptorId:
                descriptor?.descriptorId
            }
          )
        ])
    });
  }

  const normalized =
    normalizeHEarthVector3(
      createHEarthVector3(
        -partialX,
        1,
        -partialZ
      )
    );

  return deepFreeze({
    valid:
      normalized.valid,

    normal:
      normalized.vector,

    partialX,

    partialZ,

    issues:
      normalized.issues
  });
};


/* ==========================================================================
 * 12 · INDEXED TOPOLOGY
 * ========================================================================== */

const canonicalEdgeKey = (
  left,
  right
) =>
  left < right
    ? `${left}:${right}`
    : `${right}:${left}`;


const directedEdgeKey = (
  left,
  right
) =>
  `${left}:${right}`;


export const extractHEarthMeshEdges = (
  indices
) => {
  const undirected =
    new Map();

  const directed =
    new Map();

  for (
    let index = 0;
    index < indices.length;
    index += 3
  ) {
    const triangle =
      [
        indices[index],
        indices[index + 1],
        indices[index + 2]
      ];

    const edges =
      [
        [triangle[0], triangle[1]],
        [triangle[1], triangle[2]],
        [triangle[2], triangle[0]]
      ];

    for (const [left, right] of edges) {
      const undirectedKey =
        canonicalEdgeKey(
          left,
          right
        );

      const directedKey =
        directedEdgeKey(
          left,
          right
        );

      const record =
        undirected.get(
          undirectedKey
        ) ?? {
          key:
            undirectedKey,

          vertices:
            left < right
              ? [left, right]
              : [right, left],

          multiplicity:
            0,

          directedUses:
            []
        };

      record.multiplicity += 1;
      record.directedUses.push(
        [left, right]
      );

      undirected.set(
        undirectedKey,
        record
      );

      directed.set(
        directedKey,
        (
          directed.get(directedKey) ??
          0
        ) + 1
      );
    }
  }

  const edges =
    Array.from(
      undirected.values()
    )
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key
          )
      )
      .map(
        (edge) =>
          deepFreeze({
            ...edge,
            directedUses:
              deepFreeze(
                edge.directedUses
              )
          })
      );

  return deepFreeze({
    edges:
      deepFreeze(edges),

    directedEdgeCounts:
      deepFreeze(
        Object.fromEntries(
          Array.from(
            directed.entries()
          ).sort(
            ([left], [right]) =>
              left.localeCompare(right)
          )
        )
      )
  });
};


const validateMeshIndices = (
  vertices,
  indices
) => {
  const issues = [];
  let invalidIndexCount = 0;

  if (
    !Array.isArray(indices) ||
    indices.length % 3 !== 0
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'MESH_INDEX_ARRAY_LENGTH_INVALID',
        'ERROR',
        'Mesh index array length must be divisible by three.'
      )
    );
  }

  for (
    let index = 0;
    index < indices.length;
    index += 1
  ) {
    const value =
      indices[index];

    if (
      !Number.isSafeInteger(value) ||
      value < 0 ||
      value >= vertices.length
    ) {
      invalidIndexCount += 1;

      issues.push(
        createHEarthGeometryIssue(
          'MESH_INDEX_OUT_OF_RANGE',
          'ERROR',
          'Mesh index is invalid or outside the vertex array.',
          {
            indexPosition:
              index,

            value,

            vertexCount:
              vertices.length
          }
        )
      );
    }
  }

  return deepFreeze({
    valid:
      invalidIndexCount === 0 &&
      indices.length % 3 === 0,

    invalidIndexCount,

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


const calculateTriangleConnectedComponents = (
  indices,
  edgeReport
) => {
  const triangleCount =
    indices.length / 3;

  const adjacency =
    Array.from(
      {
        length:
          triangleCount
      },
      () =>
        new Set()
    );

  const edgeTriangles =
    new Map();

  for (
    let triangleIndex = 0;
    triangleIndex < triangleCount;
    triangleIndex += 1
  ) {
    const offset =
      triangleIndex * 3;

    const triangle =
      [
        indices[offset],
        indices[offset + 1],
        indices[offset + 2]
      ];

    const edges =
      [
        canonicalEdgeKey(
          triangle[0],
          triangle[1]
        ),

        canonicalEdgeKey(
          triangle[1],
          triangle[2]
        ),

        canonicalEdgeKey(
          triangle[2],
          triangle[0]
        )
      ];

    for (const edge of edges) {
      const list =
        edgeTriangles.get(edge) ??
        [];

      list.push(
        triangleIndex
      );

      edgeTriangles.set(
        edge,
        list
      );
    }
  }

  for (
    const triangleIndices
    of edgeTriangles.values()
  ) {
    if (
      triangleIndices.length < 2
    ) {
      continue;
    }

    for (
      let left = 0;
      left < triangleIndices.length;
      left += 1
    ) {
      for (
        let right = left + 1;
        right < triangleIndices.length;
        right += 1
      ) {
        adjacency[
          triangleIndices[left]
        ].add(
          triangleIndices[right]
        );

        adjacency[
          triangleIndices[right]
        ].add(
          triangleIndices[left]
        );
      }
    }
  }

  const visited =
    new Set();

  const components = [];

  for (
    let triangleIndex = 0;
    triangleIndex < triangleCount;
    triangleIndex += 1
  ) {
    if (
      visited.has(
        triangleIndex
      )
    ) {
      continue;
    }

    const queue =
      [triangleIndex];

    const component = [];

    visited.add(
      triangleIndex
    );

    while (queue.length > 0) {
      const current =
        queue.shift();

      component.push(
        current
      );

      const neighbors =
        Array.from(
          adjacency[current]
        ).sort(
          (left, right) =>
            left - right
        );

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(
      deepFreeze(
        component.sort(
          (left, right) =>
            left - right
        )
      )
    );
  }

  return deepFreeze({
    triangleConnectedComponentCount:
      components.length,

    components:
      deepFreeze(components),

    edgeCount:
      edgeReport.edges.length
  });
};


export const evaluateHEarthSignedMeshVolume = (
  vertices,
  indices
) => {
  let signedVolume = 0;

  for (
    let index = 0;
    index < indices.length;
    index += 3
  ) {
    const a =
      vertices[indices[index]];

    const b =
      vertices[indices[index + 1]];

    const c =
      vertices[indices[index + 2]];

    signedVolume +=
      dotHEarthVector3(
        a,
        crossHEarthVector3(
          b,
          c
        )
      ) /
      6;
  }

  return signedVolume;
};


export const evaluateHEarthIndexedMesh = (
  vertices,
  indices,
  options = {}
) => {
  const normalizedVertices =
    ensureArray(vertices)
      .map(
        (vertex) =>
          isHEarthVector3(vertex)
            ? cloneHEarthVector3(vertex)
            : vertex
      );

  const normalizedIndices =
    ensureArray(indices).slice();

  const issues = [];

  const finiteVertexCount =
    normalizedVertices.filter(
      isHEarthVector3
    ).length;

  if (
    finiteVertexCount !==
    normalizedVertices.length
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'MESH_VERTEX_NONFINITE',
        'ERROR',
        'Every indexed-mesh vertex must be a finite Vector3.'
      )
    );
  }

  const indexValidation =
    validateMeshIndices(
      normalizedVertices,
      normalizedIndices
    );

  issues.push(
    ...indexValidation.issues
  );

  const bounds =
    createHEarthGeometryBounds(
      normalizedVertices.filter(
        isHEarthVector3
      )
    );

  const toleranceContext =
    options.toleranceContext ??
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  let degenerateTriangleCount = 0;

  if (indexValidation.valid) {
    for (
      let index = 0;
      index < normalizedIndices.length;
      index += 3
    ) {
      const i0 =
        normalizedIndices[index];

      const i1 =
        normalizedIndices[index + 1];

      const i2 =
        normalizedIndices[index + 2];

      if (
        i0 === i1 ||
        i1 === i2 ||
        i2 === i0
      ) {
        degenerateTriangleCount += 1;

        issues.push(
          createHEarthGeometryIssue(
            'MESH_TRIANGLE_INDEX_DUPLICATE',
            'ERROR',
            'Triangle references duplicate vertex indices.',
            {
              triangleIndex:
                index / 3,

              indices:
                [i0, i1, i2]
            }
          )
        );

        continue;
      }

      const triangle =
        calculateHEarthTriangleNormal(
          normalizedVertices[i0],
          normalizedVertices[i1],
          normalizedVertices[i2],
          toleranceContext
        );

      if (!triangle.valid) {
        degenerateTriangleCount += 1;

        issues.push(
          ...triangle.issues
        );
      }
    }
  }

  const edgeReport =
    indexValidation.valid
      ? extractHEarthMeshEdges(
          normalizedIndices
        )
      : deepFreeze({
          edges:
            deepFreeze([]),

          directedEdgeCounts:
            deepFreeze({})
        });

  const boundaryEdges =
    edgeReport.edges.filter(
      (edge) =>
        edge.multiplicity === 1
    );

  const manifoldInteriorEdges =
    edgeReport.edges.filter(
      (edge) =>
        edge.multiplicity === 2
    );

  const nonmanifoldEdges =
    edgeReport.edges.filter(
      (edge) =>
        edge.multiplicity > 2
    );

  let directedEdgeConflictCount = 0;

  for (
    const edge
    of manifoldInteriorEdges
  ) {
    if (
      edge.directedUses.length === 2
    ) {
      const first =
        edge.directedUses[0];

      const second =
        edge.directedUses[1];

      const opposite =
        first[0] === second[1] &&
        first[1] === second[0];

      if (!opposite) {
        directedEdgeConflictCount += 1;

        issues.push(
          createHEarthGeometryIssue(
            'MESH_SHARED_EDGE_DIRECTION_CONFLICT',
            'ERROR',
            'Shared edge uses the same directed orientation in adjacent triangles.',
            {
              edge:
                edge.vertices,

              directedUses:
                edge.directedUses
            }
          )
        );
      }
    }
  }

  if (nonmanifoldEdges.length > 0) {
    issues.push(
      createHEarthGeometryIssue(
        'MESH_NONMANIFOLD_EDGE',
        'ERROR',
        'One or more mesh edges have multiplicity greater than two.',
        {
          nonmanifoldEdgeCount:
            nonmanifoldEdges.length
        }
      )
    );
  }

  const referencedVertices =
    new Set(
      normalizedIndices.filter(
        (index) =>
          Number.isSafeInteger(index) &&
          index >= 0 &&
          index < normalizedVertices.length
      )
    );

  const isolatedVertexCount =
    normalizedVertices.length -
    referencedVertices.size;

  const connectedness =
    indexValidation.valid
      ? calculateTriangleConnectedComponents(
          normalizedIndices,
          edgeReport
        )
      : deepFreeze({
          triangleConnectedComponentCount:
            0,

          components:
            deepFreeze([]),

          edgeCount:
            0
        });

  const triangleCount =
    normalizedIndices.length / 3;

  const closed =
    triangleCount > 0 &&
    indexValidation.invalidIndexCount === 0 &&
    degenerateTriangleCount === 0 &&
    boundaryEdges.length === 0 &&
    nonmanifoldEdges.length === 0 &&
    directedEdgeConflictCount === 0;

  const signedVolume =
    closed
      ? evaluateHEarthSignedMeshVolume(
          normalizedVertices,
          normalizedIndices
        )
      : 0;

  const outward =
    signedVolume >
    toleranceContext.volumeTolerance;

  const inward =
    signedVolume <
    -toleranceContext.volumeTolerance;

  let topologyClassification;

  if (!indexValidation.valid) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification.UNEVALUABLE;
  } else if (
    degenerateTriangleCount > 0
  ) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification.DEGENERATE;
  } else if (
    nonmanifoldEdges.length > 0
  ) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification.NONMANIFOLD;
  } else if (
    directedEdgeConflictCount > 0
  ) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification
        .CLOSED_WINDING_INCONSISTENT;
  } else if (!closed) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification.OPEN_MANIFOLD;
  } else if (outward) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification
        .CLOSED_ORIENTED_MANIFOLD;
  } else if (inward) {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification
        .CLOSED_INWARD_ORIENTED_MANIFOLD;

    issues.push(
      createHEarthGeometryIssue(
        'MESH_CLOSED_WINDING_INWARD',
        'ERROR',
        'Closed mesh has consistently inward orientation.',
        {
          signedVolume,
          volumeTolerance:
            toleranceContext.volumeTolerance
        }
      )
    );
  } else {
    topologyClassification =
      H_EARTH_3D_GEOMETRY_ENUMS
        .topologyClassification.DEGENERATE;
  }

  const shellCount =
    closed
      ? connectedness
          .triangleConnectedComponentCount
      : 0;

  const faceNormals =
    indexValidation.valid
      ? calculateHEarthFaceNormals(
          normalizedVertices,
          normalizedIndices,
          toleranceContext
        )
      : deepFreeze({
          faceNormals:
            deepFreeze([]),

          faceNormalCount:
            0,

          valid:
            false,

          issues:
            deepFreeze([])
        });

  const vertexNormals =
    indexValidation.valid
      ? calculateHEarthVertexNormals(
          normalizedVertices,
          normalizedIndices,
          toleranceContext
        )
      : deepFreeze({
          vertexNormals:
            deepFreeze([]),

          vertexNormalCount:
            0,

          valid:
            false,

          issues:
            deepFreeze([])
        });

  issues.push(
    ...faceNormals.issues,
    ...vertexNormals.issues
  );

  return deepFreeze({
    vertices:
      deepFreeze(normalizedVertices),

    indices:
      deepFreeze(normalizedIndices),

    triangleCount,

    uniqueEdgeCount:
      edgeReport.edges.length,

    boundaryEdgeCount:
      boundaryEdges.length,

    manifoldInteriorEdgeCount:
      manifoldInteriorEdges.length,

    nonmanifoldEdgeCount:
      nonmanifoldEdges.length,

    directedEdgeConflictCount,

    degenerateTriangleCount,

    invalidIndexCount:
      indexValidation.invalidIndexCount,

    referencedVertexCount:
      referencedVertices.size,

    isolatedVertexCount,

    triangleConnectedComponentCount:
      connectedness
        .triangleConnectedComponentCount,

    shellCount,

    signedVolume,

    outward,

    inward,

    closed,

    windingStatus:
      directedEdgeConflictCount === 0
        ? 'WINDING_CONSISTENT'
        : 'WINDING_CONFLICT',

    closureStatus:
      topologyClassification,

    manifoldStatus:
      nonmanifoldEdges.length === 0
        ? 'MANIFOLD_OR_OPEN_MANIFOLD'
        : 'NONMANIFOLD',

    bounds,

    toleranceContext,

    faceNormals:
      faceNormals.faceNormals,

    vertexNormals:
      vertexNormals.vertexNormals,

    valid:
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const evaluateHEarthMeshClosure = (
  vertices,
  indices,
  options = {}
) =>
  evaluateHEarthIndexedMesh(
    vertices,
    indices,
    options
  );


export const evaluateHEarthMeshManifoldStatus =
  evaluateHEarthMeshClosure;


export const evaluateHEarthMeshConnectedness =
  evaluateHEarthMeshClosure;


/* ==========================================================================
 * 13 · CURVE AND RIBBON MATHEMATICS
 * ========================================================================== */

export const evaluateHEarthPolylineTangent = (
  points,
  index,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) => {
  if (
    !Array.isArray(points) ||
    points.length < 2 ||
    !Number.isSafeInteger(index) ||
    index < 0 ||
    index >= points.length
  ) {
    return deepFreeze({
      valid:
        false,

      tangent:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'CURVE_TANGENT_INPUT_INVALID',
            'ERROR',
            'Polyline tangent requires at least two points and a valid sample index.'
          )
        ])
    });
  }

  let difference;

  if (index === 0) {
    difference =
      subtractHEarthVector3(
        points[1],
        points[0]
      );
  } else if (
    index ===
    points.length - 1
  ) {
    difference =
      subtractHEarthVector3(
        points[index],
        points[index - 1]
      );
  } else {
    difference =
      subtractHEarthVector3(
        points[index + 1],
        points[index - 1]
      );
  }

  const normalized =
    normalizeHEarthVector3(
      difference,
      toleranceContext.lengthTolerance
    );

  return deepFreeze({
    valid:
      normalized.valid,

    tangent:
      normalized.vector,

    issues:
      normalized.issues
  });
};


export const evaluateHEarthCurveTangent = ({
  descriptor,
  parameter
}) => {
  const span =
    descriptor.domain.maximum -
    descriptor.domain.minimum;

  const step =
    Math.max(
      Math.abs(span) *
        H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .derivativeRelativeStep,

      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
    );

  const left =
    Math.max(
      descriptor.domain.minimum,
      parameter - step
    );

  const right =
    Math.min(
      descriptor.domain.maximum,
      parameter + step
    );

  const leftValue =
    descriptor.evaluator(left);

  const rightValue =
    descriptor.evaluator(right);

  if (
    !isHEarthVector3(leftValue) ||
    !isHEarthVector3(rightValue) ||
    right - left <=
      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .parameterEpsilon
  ) {
    return deepFreeze({
      valid:
        false,

      tangent:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'CURVE_TANGENT_EVALUATION_INVALID',
            'ERROR',
            'Curve tangent evaluation failed.'
          )
        ])
    });
  }

  const derivative =
    scaleHEarthVector3(
      subtractHEarthVector3(
        rightValue,
        leftValue
      ),
      1 / (right - left)
    );

  const normalized =
    normalizeHEarthVector3(
      derivative
    );

  return deepFreeze({
    valid:
      normalized.valid,

    tangent:
      normalized.vector,

    issues:
      normalized.issues
  });
};


export const evaluateHEarthCurveNormalXZ = (
  tangent
) => {
  if (!isHEarthVector3(tangent)) {
    return deepFreeze({
      valid:
        false,

      leftNormal:
        null,

      rightNormal:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'CURVE_XZ_TANGENT_INVALID',
            'ERROR',
            'XZ curve normal requires a finite tangent.'
          )
        ])
    });
  }

  const planar =
    createHEarthVector3(
      tangent.x,
      0,
      tangent.z
    );

  const normalizedTangent =
    normalizeHEarthVector3(
      planar
    );

  if (!normalizedTangent.valid) {
    return deepFreeze({
      valid:
        false,

      leftNormal:
        null,

      rightNormal:
        null,

      issues:
        normalizedTangent.issues
    });
  }

  const left =
    normalizeHEarthVector3(
      createHEarthVector3(
        -normalizedTangent.vector.z,
        0,
        normalizedTangent.vector.x
      )
    );

  return deepFreeze({
    valid:
      left.valid,

    tangent:
      normalizedTangent.vector,

    leftNormal:
      left.vector,

    rightNormal:
      scaleHEarthVector3(
        left.vector,
        -1
      ),

    issues:
      left.issues
  });
};


export const calculateHEarthSignedDistanceToPolylineXZ = (
  point,
  polyline,
  options = {}
) => {
  const points =
    ensureArray(polyline)
      .filter(isHEarthVector3);

  const issues = [];

  if (
    !isHEarthVector3(point) ||
    points.length < 2
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'XZ_SIGNED_DISTANCE_INPUT_INVALID',
        'ERROR',
        'XZ signed distance requires a point and at least two polyline points.'
      )
    );

    return deepFreeze({
      valid:
        false,

      signedDistance:
        null,

      unsignedDistance:
        null,

      closestPoint:
        null,

      segmentIndex:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const point2 =
    createHEarthVector2(
      point.x,
      point.z
    );

  let best = null;

  const closed =
    options.closed === true;

  const segmentCount =
    closed
      ? points.length
      : points.length - 1;

  for (
    let segmentIndex = 0;
    segmentIndex < segmentCount;
    segmentIndex += 1
  ) {
    const start3 =
      points[segmentIndex];

    const end3 =
      points[
        (segmentIndex + 1) %
        points.length
      ];

    const start =
      createHEarthVector2(
        start3.x,
        start3.z
      );

    const end =
      createHEarthVector2(
        end3.x,
        end3.z
      );

    const segment =
      subtractHEarthVector2(
        end,
        start
      );

    const denominator =
      dotHEarthVector2(
        segment,
        segment
      );

    if (
      denominator <=
      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .lengthAbsoluteEpsilon ** 2
    ) {
      issues.push(
        createHEarthGeometryIssue(
          'CURVE_SEGMENT_DEGENERATE',
          'WARNING',
          'Degenerate XZ polyline segment was skipped.',
          {
            segmentIndex
          },
          false
        )
      );

      continue;
    }

    const parameter =
      clampHEarthNumber(
        dotHEarthVector2(
          subtractHEarthVector2(
            point2,
            start
          ),
          segment
        ) /
          denominator,
        0,
        1
      );

    const closest =
      addHEarthVector2(
        start,
        scaleHEarthVector2(
          segment,
          parameter
        )
      );

    const unsignedDistance =
      getHEarthVector2Distance(
        point2,
        closest
      );

    if (
      best === null ||
      unsignedDistance <
        best.unsignedDistance -
          H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
            .positionAbsoluteEpsilon ||
      (
        approximatelyEqualHEarthNumber(
          unsignedDistance,
          best.unsignedDistance
        ) &&
        segmentIndex <
          best.segmentIndex
      )
    ) {
      const normalizedDirection =
        normalizeHEarthVector2(
          segment
        );

      const leftNormal =
        normalizedDirection.valid
          ? createHEarthVector2(
              -normalizedDirection.vector.y,
              normalizedDirection.vector.x
            )
          : null;

      const offset =
        subtractHEarthVector2(
          point2,
          closest
        );

      const side =
        leftNormal
          ? Math.sign(
              dotHEarthVector2(
                offset,
                leftNormal
              )
            )
          : 0;

      best = {
        segmentIndex,
        parameter,
        closest,
        unsignedDistance,
        side
      };
    }
  }

  if (!best) {
    issues.push(
      createHEarthGeometryIssue(
        'XZ_SIGNED_DISTANCE_NO_VALID_SEGMENT',
        'ERROR',
        'No valid XZ polyline segment was available.'
      )
    );

    return deepFreeze({
      valid:
        false,

      signedDistance:
        null,

      unsignedDistance:
        null,

      closestPoint:
        null,

      segmentIndex:
        null,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  return deepFreeze({
    valid:
      true,

    signedDistance:
      best.unsignedDistance *
      (
        best.side === 0
          ? 1
          : best.side
      ),

    unsignedDistance:
      best.unsignedDistance,

    closestPoint:
      best.closest,

    segmentIndex:
      best.segmentIndex,

    parameter:
      best.parameter,

    yDiscarded:
      true,

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const offsetHEarthCurve = (
  centerline,
  distances,
  options = {}
) => {
  const points =
    ensureArray(centerline)
      .filter(isHEarthVector3);

  const issues = [];

  if (points.length < 2) {
    issues.push(
      createHEarthGeometryIssue(
        'CURVE_OFFSET_CENTERLINE_TOO_SHORT',
        'ERROR',
        'Curve offset requires at least two centerline points.'
      )
    );

    return deepFreeze({
      valid:
        false,

      points:
        deepFreeze([]),

      normals:
        deepFreeze([]),

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const distanceValues =
    typeof distances === 'number'
      ? points.map(() => distances)
      : ensureArray(distances);

  if (
    distanceValues.length !==
    points.length
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'CURVE_OFFSET_DISTANCE_COUNT_MISMATCH',
        'ERROR',
        'Per-sample curve offset count must match the centerline sample count.'
      )
    );
  }

  const output = [];
  const normals = [];

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const tangent =
      evaluateHEarthPolylineTangent(
        points,
        index
      );

    if (!tangent.valid) {
      issues.push(
        ...tangent.issues
      );

      output.push(
        cloneHEarthVector3(
          points[index]
        )
      );

      normals.push(
        createHEarthVector3(
          0,
          0,
          0
        )
      );

      continue;
    }

    const normal =
      evaluateHEarthCurveNormalXZ(
        tangent.tangent
      );

    if (!normal.valid) {
      issues.push(
        ...normal.issues
      );

      output.push(
        cloneHEarthVector3(
          points[index]
        )
      );

      normals.push(
        createHEarthVector3(
          0,
          0,
          0
        )
      );

      continue;
    }

    const distance =
      distanceValues[index];

    if (!isHEarthFiniteNumber(distance)) {
      issues.push(
        createHEarthGeometryIssue(
          'CURVE_OFFSET_DISTANCE_NONFINITE',
          'ERROR',
          'Curve offset distance must be finite.',
          {
            index,
            distance
          }
        )
      );

      continue;
    }

    output.push(
      addHEarthVector3(
        points[index],
        scaleHEarthVector3(
          normal.leftNormal,
          distance
        )
      )
    );

    normals.push(
      normal.leftNormal
    );
  }

  return deepFreeze({
    valid:
      !hasHEarthBlockingIssues(issues),

    points:
      deepFreeze(output),

    normals:
      deepFreeze(normals),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const constructHEarthRibbonFromCenterline = ({
  primitiveId,
  centerline,
  width,
  widths = null,
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  joinPolicy =
    H_EARTH_3D_GEOMETRY_ENUMS
      .ribbonJoinPolicy.BEVEL,
  capPolicy =
    H_EARTH_3D_GEOMETRY_ENUMS
      .ribbonCapPolicy.BUTT,
  miterLimit = 4,
  metadata = {}
}) => {
  const points =
    ensureArray(centerline)
      .filter(isHEarthVector3);

  const issues = [];

  if (points.length < 2) {
    issues.push(
      createHEarthGeometryIssue(
        'RIBBON_CENTERLINE_TOO_SHORT',
        'ERROR',
        'Ribbon requires at least two finite centerline points.'
      )
    );
  }

  if (
    joinPolicy ===
    H_EARTH_3D_GEOMETRY_ENUMS
      .ribbonJoinPolicy.ROUND
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RIBBON_ROUND_JOIN_UNSUPPORTED',
        'ERROR',
        'Round ribbon joins are deferred in the first implementation.'
      )
    );
  }

  if (
    capPolicy ===
      H_EARTH_3D_GEOMETRY_ENUMS
        .ribbonCapPolicy.SQUARE ||
    capPolicy ===
      H_EARTH_3D_GEOMETRY_ENUMS
        .ribbonCapPolicy.ROUND
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RIBBON_CAP_UNSUPPORTED',
        'ERROR',
        'Square and round ribbon caps are deferred.'
      )
    );
  }

  const widthValues =
    Array.isArray(widths)
      ? widths.slice()
      : points.map(
          () =>
            width
        );

  if (
    widthValues.length !==
    points.length
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RIBBON_WIDTH_COUNT_MISMATCH',
        'ERROR',
        'Ribbon width count must match centerline sample count.'
      )
    );
  }

  const halfWidths =
    widthValues.map(
      (value, index) => {
        if (
          !isHEarthPositiveFiniteNumber(
            value
          )
        ) {
          issues.push(
            createHEarthGeometryIssue(
              'RIBBON_WIDTH_INVALID',
              'ERROR',
              'Ribbon width must be finite and positive.',
              {
                index,
                width:
                  value
              }
            )
          );

          return 0;
        }

        return value / 2;
      }
    );

  if (hasHEarthBlockingIssues(issues)) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const leftEdge = [];
  const rightEdge = [];
  const frameNormals = [];
  const joinReceipts = [];

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const tangent =
      evaluateHEarthPolylineTangent(
        points,
        index
      );

    if (!tangent.valid) {
      issues.push(
        ...tangent.issues
      );

      continue;
    }

    const frame =
      evaluateHEarthCurveNormalXZ(
        tangent.tangent
      );

    if (!frame.valid) {
      issues.push(
        ...frame.issues
      );

      continue;
    }

    let leftNormal =
      frame.leftNormal;

    if (
      joinPolicy ===
        H_EARTH_3D_GEOMETRY_ENUMS
          .ribbonJoinPolicy.MITER &&
      index > 0 &&
      index < points.length - 1
    ) {
      const previousDirection =
        normalizeHEarthVector3(
          createHEarthVector3(
            points[index].x -
              points[index - 1].x,
            0,
            points[index].z -
              points[index - 1].z
          )
        );

      const nextDirection =
        normalizeHEarthVector3(
          createHEarthVector3(
            points[index + 1].x -
              points[index].x,
            0,
            points[index + 1].z -
              points[index].z
          )
        );

      if (
        previousDirection.valid &&
        nextDirection.valid
      ) {
        const previousNormal =
          evaluateHEarthCurveNormalXZ(
            previousDirection.vector
          );

        const nextNormal =
          evaluateHEarthCurveNormalXZ(
            nextDirection.vector
          );

        const miterDirection =
          normalizeHEarthVector3(
            addHEarthVector3(
              previousNormal.leftNormal,
              nextNormal.leftNormal
            )
          );

        const denominator =
          miterDirection.valid
            ? dotHEarthVector3(
                miterDirection.vector,
                nextNormal.leftNormal
              )
            : 0;

        const miterLength =
          Math.abs(denominator) >
            H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
              .miterDenominatorEpsilon
            ? halfWidths[index] /
              denominator
            : Number.POSITIVE_INFINITY;

        const fallback =
          !miterDirection.valid ||
          Math.abs(denominator) <=
            H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
              .miterDenominatorEpsilon ||
          Math.abs(miterLength) >
            miterLimit *
              halfWidths[index];

        if (fallback) {
          joinReceipts.push(
            deepFreeze({
              index,
              requested:
                'MITER',

              applied:
                'BEVEL',

              denominator,

              miterLength,

              issueCode:
                'RIBBON_MITER_UNSTABLE_FALLBACK_BEVEL'
            })
          );

          issues.push(
            createHEarthGeometryIssue(
              'RIBBON_MITER_UNSTABLE_FALLBACK_BEVEL',
              'WARNING',
              'Unstable miter join deterministically fell back to bevel.',
              {
                index,
                denominator,
                miterLength,
                miterLimit
              },
              false
            )
          );
        } else {
          leftNormal =
            scaleHEarthVector3(
              miterDirection.vector,
              miterLength /
                halfWidths[index]
            );

          joinReceipts.push(
            deepFreeze({
              index,
              requested:
                'MITER',

              applied:
                'MITER',

              denominator,

              miterLength
            })
          );
        }
      }
    }

    frameNormals.push(
      leftNormal
    );

    leftEdge.push(
      addHEarthVector3(
        points[index],
        scaleHEarthVector3(
          leftNormal,
          halfWidths[index]
        )
      )
    );

    rightEdge.push(
      subtractHEarthVector3(
        points[index],
        scaleHEarthVector3(
          leftNormal,
          halfWidths[index]
        )
      )
    );
  }

  const vertices = [];

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    vertices.push(
      leftEdge[index],
      rightEdge[index]
    );
  }

  const indices = [];

  for (
    let index = 0;
    index < points.length - 1;
    index += 1
  ) {
    const leftCurrent =
      index * 2;

    const rightCurrent =
      leftCurrent + 1;

    const leftNext =
      (index + 1) * 2;

    const rightNext =
      leftNext + 1;

    const candidateA =
      [
        leftCurrent,
        rightNext,
        rightCurrent
      ];

    const candidateB =
      [
        leftCurrent,
        leftNext,
        rightNext
      ];

    const firstNormal =
      calculateHEarthTriangleNormal(
        vertices[candidateA[0]],
        vertices[candidateA[1]],
        vertices[candidateA[2]]
      );

    const upward =
      firstNormal.valid &&
      firstNormal.normal.y >= 0;

    if (upward) {
      indices.push(
        ...candidateA,
        ...candidateB
      );
    } else {
      indices.push(
        leftCurrent,
        rightCurrent,
        rightNext,

        leftCurrent,
        rightNext,
        leftNext
      );
    }
  }

  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  issues.push(
    ...topology.issues
  );

  const primitive =
    createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveType.RIBBON_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices,
      indices,
      centerline:
        points,
      leftEdge,
      rightEdge,
      faceNormals:
        topology.faceNormals,
      vertexNormals:
        topology.vertexNormals,
      closed:
        false,
      windingOrder:
        'COUNTERCLOCKWISE_UPWARD',
      metadata: {
        ...metadata,
        joinPolicy,
        capPolicy,
        joinReceipts
      }
    });

  return deepFreeze({
    primitive,

    valid:
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


/* ==========================================================================
 * 14 · NEUTRAL FIELD MATHEMATICS
 * ========================================================================== */

export const evaluateHEarthRadialFalloff = ({
  point,
  center,
  radius,
  policy = 'SMOOTHSTEP',
  exponent = 2,
  sigma = 0.25
}) => {
  if (
    !isHEarthVector3(point) ||
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(radius)
  ) {
    return Number.NaN;
  }

  const rho =
    getHEarthVector3Distance(
      point,
      center
    ) /
    radius;

  switch (policy) {
    case 'LINEAR':
      return clampHEarthNumber(
        1 - rho,
        0,
        1
      );

    case 'SMOOTHERSTEP':
      return (
        1 -
        smootherstepHEarthNumber(
          0,
          1,
          rho
        )
      );

    case 'POWER':
      if (
        !isHEarthPositiveFiniteNumber(
          exponent
        )
      ) {
        return Number.NaN;
      }

      return clampHEarthNumber(
        1 - rho ** exponent,
        0,
        1
      );

    case 'GAUSSIAN_BOUNDED': {
      if (
        !isHEarthPositiveFiniteNumber(
          sigma
        )
      ) {
        return Number.NaN;
      }

      const terminal =
        Math.exp(
          -1 /
          (2 * sigma ** 2)
        );

      return clampHEarthNumber(
        (
          Math.exp(
            -rho ** 2 /
            (2 * sigma ** 2)
          ) -
          terminal
        ) /
        (
          1 -
          terminal
        ),
        0,
        1
      );
    }

    case 'SMOOTHSTEP':
    default:
      return (
        1 -
        smoothstepHEarthNumber(
          0,
          1,
          rho
        )
      );
  }
};


export const evaluateHEarthEllipticalFalloff = ({
  x,
  z,
  centerX,
  centerZ,
  radiusX,
  radiusZ,
  policy = 'SMOOTHSTEP',
  exponent = 2,
  sigma = 0.25
}) => {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(z) ||
    !isHEarthFiniteNumber(centerX) ||
    !isHEarthFiniteNumber(centerZ) ||
    !isHEarthPositiveFiniteNumber(radiusX) ||
    !isHEarthPositiveFiniteNumber(radiusZ)
  ) {
    return Number.NaN;
  }

  const rho =
    Math.sqrt(
      (
        (x - centerX) /
        radiusX
      ) ** 2 +
      (
        (z - centerZ) /
        radiusZ
      ) ** 2
    );

  return evaluateHEarthRadialFalloff({
    point:
      createHEarthVector3(
        rho,
        0,
        0
      ),
    center:
      createHEarthVector3(
        0,
        0,
        0
      ),
    radius:
      1,
    policy,
    exponent,
    sigma
  });
};


export const evaluateHEarthBoundedElevation = ({
  baseline,
  amplitude,
  falloff
}) => {
  if (
    !isHEarthFiniteNumber(baseline) ||
    !isHEarthFiniteNumber(amplitude) ||
    !isHEarthFiniteNumber(falloff)
  ) {
    return Number.NaN;
  }

  return (
    baseline +
    amplitude *
      clampHEarthNumber(
        falloff,
        0,
        1
      )
  );
};


export const evaluateHEarthBoundedDepression = ({
  baseline,
  depth,
  falloff
}) => {
  if (
    !isHEarthFiniteNumber(baseline) ||
    !isHEarthNonNegativeFiniteNumber(depth) ||
    !isHEarthFiniteNumber(falloff)
  ) {
    return Number.NaN;
  }

  return (
    baseline -
    depth *
      clampHEarthNumber(
        falloff,
        0,
        1
      )
  );
};


export const evaluateHEarthRidgeDisplacement = ({
  signedDistance,
  width,
  amplitude,
  policy = 'SMOOTHSTEP'
}) => {
  if (
    !isHEarthFiniteNumber(signedDistance) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthFiniteNumber(amplitude)
  ) {
    return Number.NaN;
  }

  const normalized =
    Math.abs(signedDistance) /
    width;

  const falloff =
    evaluateHEarthRadialFalloff({
      point:
        createHEarthVector3(
          normalized,
          0,
          0
        ),
      center:
        createHEarthVector3(
          0,
          0,
          0
        ),
      radius:
        1,
      policy
    });

  return (
    amplitude *
    falloff
  );
};


export const evaluateHEarthTerraceProfile = ({
  value,
  levels,
  policy = 'TERRACE_NEAREST'
}) => {
  if (
    !isHEarthFiniteNumber(value) ||
    !Number.isSafeInteger(levels) ||
    levels < 2
  ) {
    return Number.NaN;
  }

  const normalized =
    clampHEarthNumber(
      value,
      0,
      1
    );

  const denominator =
    levels - 1;

  switch (policy) {
    case 'TERRACE_FLOOR':
      return (
        Math.floor(
          normalized *
          denominator
        ) /
        denominator
      );

    case 'TERRACE_SMOOTHED': {
      const scaled =
        normalized *
        denominator;

      const lower =
        Math.floor(scaled);

      const fraction =
        scaled -
        lower;

      return (
        lower +
        smootherstepHEarthNumber(
          0,
          1,
          fraction
        )
      ) /
      denominator;
    }

    case 'TERRACE_NEAREST':
    default:
      return (
        Math.round(
          normalized *
          denominator
        ) /
        denominator
      );
  }
};


export const evaluateHEarthCliffProfile = ({
  distance,
  width,
  lowElevation,
  highElevation,
  policy = 'SMOOTHSTEP'
}) => {
  if (
    !isHEarthFiniteNumber(distance) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthFiniteNumber(lowElevation) ||
    !isHEarthFiniteNumber(highElevation)
  ) {
    return Number.NaN;
  }

  const normalized =
    clampHEarthNumber(
      0.5 +
      distance /
        width,
      0,
      1
    );

  const amount =
    policy === 'SMOOTHERSTEP'
      ? smootherstepHEarthNumber(
          0,
          1,
          normalized
        )
      : smoothstepHEarthNumber(
          0,
          1,
          normalized
        );

  return lerpHEarthNumber(
    lowElevation,
    highElevation,
    amount
  );
};


/* ==========================================================================
 * 15 · RADIAL AND VOLUMETRIC CONSTRUCTION
 * ========================================================================== */

export const evaluateHEarthEllipsoidPoint = ({
  center =
    createHEarthVector3(0, 0, 0),
  radiusX,
  radiusY,
  radiusZ,
  theta,
  phi
}) => {
  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(radiusX) ||
    !isHEarthPositiveFiniteNumber(radiusY) ||
    !isHEarthPositiveFiniteNumber(radiusZ) ||
    !isHEarthFiniteNumber(theta) ||
    !isHEarthFiniteNumber(phi)
  ) {
    return null;
  }

  return createHEarthVector3(
    center.x +
      radiusX *
      Math.cos(phi) *
      Math.cos(theta),

    center.y +
      radiusY *
      Math.sin(phi),

    center.z +
      radiusZ *
      Math.cos(phi) *
      Math.sin(theta)
  );
};


export const evaluateHEarthSuperellipsePoint = ({
  radiusX,
  radiusZ,
  theta,
  exponent
}) => {
  if (
    !isHEarthPositiveFiniteNumber(radiusX) ||
    !isHEarthPositiveFiniteNumber(radiusZ) ||
    !isHEarthFiniteNumber(theta) ||
    !isHEarthPositiveFiniteNumber(exponent)
  ) {
    return null;
  }

  return createHEarthVector2(
    radiusX *
      signedPowerHEarthNumber(
        Math.cos(theta),
        2 / exponent
      ),

    radiusZ *
      signedPowerHEarthNumber(
        Math.sin(theta),
        2 / exponent
      )
  );
};


export const evaluateHEarthSuperellipsoidPoint = ({
  center =
    createHEarthVector3(0, 0, 0),
  radiusX,
  radiusY,
  radiusZ,
  theta,
  phi,
  exponent1,
  exponent2
}) => {
  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(radiusX) ||
    !isHEarthPositiveFiniteNumber(radiusY) ||
    !isHEarthPositiveFiniteNumber(radiusZ) ||
    !isHEarthFiniteNumber(theta) ||
    !isHEarthFiniteNumber(phi) ||
    !isHEarthPositiveFiniteNumber(exponent1) ||
    !isHEarthPositiveFiniteNumber(exponent2)
  ) {
    return null;
  }

  return createHEarthVector3(
    center.x +
      radiusX *
      signedPowerHEarthNumber(
        Math.cos(phi),
        2 / exponent1
      ) *
      signedPowerHEarthNumber(
        Math.cos(theta),
        2 / exponent2
      ),

    center.y +
      radiusY *
      signedPowerHEarthNumber(
        Math.sin(phi),
        2 / exponent1
      ),

    center.z +
      radiusZ *
      signedPowerHEarthNumber(
        Math.cos(phi),
        2 / exponent1
      ) *
      signedPowerHEarthNumber(
        Math.sin(theta),
        2 / exponent2
      )
  );
};


const constructRadialClosedMesh = ({
  primitiveId,
  center,
  radiusX,
  radiusY,
  radiusZ,
  intermediateRingCount,
  sectorCount,
  pointEvaluator,
  geometryDomain,
  layerHint,
  materialKey,
  metadata
}) => {
  const issues = [];

  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(radiusX) ||
    !isHEarthPositiveFiniteNumber(radiusY) ||
    !isHEarthPositiveFiniteNumber(radiusZ)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RADIAL_SHAPE_RADIUS_INVALID',
        'ERROR',
        'Radial shape radii must be finite and positive.'
      )
    );
  }

  if (
    !Number.isSafeInteger(
      intermediateRingCount
    ) ||
    intermediateRingCount < 1 ||
    intermediateRingCount >
      H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
        .maximumRadialRingCount
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RADIAL_SHAPE_RING_COUNT_INVALID',
        'ERROR',
        'Intermediate radial ring count is invalid.'
      )
    );
  }

  if (
    !Number.isSafeInteger(
      sectorCount
    ) ||
    sectorCount < 3 ||
    sectorCount >
      H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
        .maximumRadialSectorCount
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'RADIAL_SHAPE_SECTOR_COUNT_INVALID',
        'ERROR',
        'Radial sector count is invalid.'
      )
    );
  }

  if (hasHEarthBlockingIssues(issues)) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const vertices = [];

  const northPoleIndex =
    vertices.length;

  vertices.push(
    createHEarthVector3(
      center.x,
      center.y + radiusY,
      center.z
    )
  );

  for (
    let ringIndex = 0;
    ringIndex < intermediateRingCount;
    ringIndex += 1
  ) {
    const phi =
      Math.PI / 2 -
      (
        (ringIndex + 1) /
        (intermediateRingCount + 1)
      ) *
      Math.PI;

    for (
      let sectorIndex = 0;
      sectorIndex < sectorCount;
      sectorIndex += 1
    ) {
      const theta =
        (
          sectorIndex /
          sectorCount
        ) *
        Math.PI *
        2;

      vertices.push(
        pointEvaluator({
          center,
          radiusX,
          radiusY,
          radiusZ,
          theta,
          phi
        })
      );
    }
  }

  const southPoleIndex =
    vertices.length;

  vertices.push(
    createHEarthVector3(
      center.x,
      center.y - radiusY,
      center.z
    )
  );

  const indices = [];

  const firstRingStart =
    1;

  for (
    let sectorIndex = 0;
    sectorIndex < sectorCount;
    sectorIndex += 1
  ) {
    const current =
      firstRingStart +
      sectorIndex;

    const next =
      firstRingStart +
      (
        (sectorIndex + 1) %
        sectorCount
      );

    indices.push(
      northPoleIndex,
      next,
      current
    );
  }

  for (
    let ringIndex = 0;
    ringIndex <
      intermediateRingCount - 1;
    ringIndex += 1
  ) {
    const currentRingStart =
      1 +
      ringIndex *
        sectorCount;

    const nextRingStart =
      currentRingStart +
      sectorCount;

    for (
      let sectorIndex = 0;
      sectorIndex < sectorCount;
      sectorIndex += 1
    ) {
      const nextSector =
        (
          sectorIndex + 1
        ) %
        sectorCount;

      const a =
        currentRingStart +
        sectorIndex;

      const b =
        currentRingStart +
        nextSector;

      const c =
        nextRingStart +
        nextSector;

      const d =
        nextRingStart +
        sectorIndex;

      indices.push(
        a,
        b,
        c,

        a,
        c,
        d
      );
    }
  }

  const lastRingStart =
    1 +
    (
      intermediateRingCount - 1
    ) *
    sectorCount;

  for (
    let sectorIndex = 0;
    sectorIndex < sectorCount;
    sectorIndex += 1
  ) {
    const current =
      lastRingStart +
      sectorIndex;

    const next =
      lastRingStart +
      (
        (sectorIndex + 1) %
        sectorCount
      );

    indices.push(
      southPoleIndex,
      current,
      next
    );
  }

  let topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  if (
    topology.closed &&
    topology.inward
  ) {
    const reversedIndices = [];

    for (
      let index = 0;
      index < indices.length;
      index += 3
    ) {
      reversedIndices.push(
        indices[index],
        indices[index + 2],
        indices[index + 1]
      );
    }

    topology =
      evaluateHEarthIndexedMesh(
        vertices,
        reversedIndices
      );

    issues.push(
      createHEarthGeometryIssue(
        'MESH_CLOSED_WINDING_CORRECTED',
        'WARNING',
        'Radial mesh winding was deterministically reversed and revalidated.',
        null,
        false
      )
    );

    indices.splice(
      0,
      indices.length,
      ...reversedIndices
    );
  }

  issues.push(
    ...topology.issues
  );

  const primitive =
    createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveType.CLOSED_VOLUME_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices,
      indices,
      faceNormals:
        topology.faceNormals,
      vertexNormals:
        topology.vertexNormals,
      closed:
        true,
      windingOrder:
        'COUNTERCLOCKWISE_OUTWARD',
      metadata: {
        ...metadata,
        northPoleCount:
          1,
        southPoleCount:
          1,
        intermediateRingCount,
        sectorCount,
        expectedVertexCount:
          2 +
          intermediateRingCount *
            sectorCount,
        expectedTriangleCount:
          2 *
          sectorCount *
          intermediateRingCount
      }
    });

  return deepFreeze({
    primitive,

    valid:
      topology.valid &&
      topology.closed &&
      topology.outward &&
      !hasHEarthBlockingIssues(issues),

    topology,

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const constructHEarthEllipsoidMesh = ({
  primitiveId,
  center =
    createHEarthVector3(0, 0, 0),
  radiusX,
  radiusY,
  radiusZ,
  intermediateRingCount = 8,
  sectorCount = 16,
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  metadata = {}
}) =>
  constructRadialClosedMesh({
    primitiveId,
    center,
    radiusX,
    radiusY,
    radiusZ,
    intermediateRingCount,
    sectorCount,
    pointEvaluator:
      evaluateHEarthEllipsoidPoint,
    geometryDomain,
    layerHint,
    materialKey,
    metadata: {
      ...metadata,
      shape:
        'ELLIPSOID',
      implicitEquation:
        '((x-cx)/rx)^2 + ((y-cy)/ry)^2 + ((z-cz)/rz)^2 = 1'
    }
  });


export const constructHEarthSuperellipsoidMesh = ({
  primitiveId,
  center =
    createHEarthVector3(0, 0, 0),
  radiusX,
  radiusY,
  radiusZ,
  exponent1 = 2,
  exponent2 = 2,
  intermediateRingCount = 8,
  sectorCount = 16,
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  metadata = {}
}) => {
  if (
    exponent1 < 0.1 ||
    exponent1 > 32 ||
    exponent2 < 0.1 ||
    exponent2 > 32
  ) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      held:
        true,

      classification:
        'HELD_UNSUPPORTED_EXPONENT',

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SUPERELLIPSOID_EXPONENT_UNSUPPORTED',
            'ERROR',
            'Superellipsoid exponent is outside the first-pass supported range.',
            {
              exponent1,
              exponent2,
              minimum:
                0.1,
              maximum:
                32
            }
          )
        ])
    });
  }

  return constructRadialClosedMesh({
    primitiveId,
    center,
    radiusX,
    radiusY,
    radiusZ,
    intermediateRingCount,
    sectorCount,
    pointEvaluator: (parameters) =>
      evaluateHEarthSuperellipsoidPoint({
        ...parameters,
        exponent1,
        exponent2
      }),
    geometryDomain,
    layerHint,
    materialKey,
    metadata: {
      ...metadata,
      shape:
        'SUPERELLIPSOID',
      exponent1,
      exponent2
    }
  });
};


export const constructHEarthRadialShell =
  constructHEarthSuperellipsoidMesh;


/* ==========================================================================
 * 16 · POLYGON MATHEMATICS
 * ========================================================================== */

export const calculateHEarthNewellNormal = (
  vertices
) => {
  const points =
    ensureArray(vertices)
      .filter(isHEarthVector3);

  if (points.length < 3) {
    return null;
  }

  let x = 0;
  let y = 0;
  let z = 0;

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const current =
      points[index];

    const next =
      points[
        (index + 1) %
        points.length
      ];

    x +=
      (current.y - next.y) *
      (current.z + next.z);

    y +=
      (current.z - next.z) *
      (current.x + next.x);

    z +=
      (current.x - next.x) *
      (current.y + next.y);
  }

  return createHEarthVector3(
    x,
    y,
    z
  );
};


export const projectHEarthPolygonToDominantPlane = (
  vertices,
  normal = null
) => {
  const points =
    ensureArray(vertices)
      .filter(isHEarthVector3);

  const rawNormal =
    normal ??
    calculateHEarthNewellNormal(
      points
    );

  const normalized =
    normalizeHEarthVector3(
      rawNormal
    );

  if (!normalized.valid) {
    return deepFreeze({
      valid:
        false,

      droppedAxis:
        null,

      projectedVertices:
        deepFreeze([]),

      issues:
        normalized.issues
    });
  }

  const absolute =
    {
      x:
        Math.abs(
          normalized.vector.x
        ),

      y:
        Math.abs(
          normalized.vector.y
        ),

      z:
        Math.abs(
          normalized.vector.z
        )
    };

  let droppedAxis = 'X';

  if (
    absolute.y >
    absolute.x +
      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
        .scalarAbsoluteEpsilon
  ) {
    droppedAxis = 'Y';
  }

  if (
    absolute.z >
    (
      droppedAxis === 'X'
        ? absolute.x
        : absolute.y
    ) +
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
  ) {
    droppedAxis = 'Z';
  }

  const projectedVertices =
    points.map(
      (point) => {
        switch (droppedAxis) {
          case 'X':
            return createHEarthVector2(
              point.y,
              point.z
            );

          case 'Y':
            return createHEarthVector2(
              point.z,
              point.x
            );

          case 'Z':
          default:
            return createHEarthVector2(
              point.x,
              point.y
            );
        }
      }
    );

  return deepFreeze({
    valid:
      true,

    normal:
      normalized.vector,

    droppedAxis,

    projectedVertices:
      deepFreeze(projectedVertices),

    issues:
      deepFreeze([])
  });
};


export const evaluateHEarthPolygonPlanarity = (
  vertices,
  options = {}
) => {
  const points =
    ensureArray(vertices)
      .filter(isHEarthVector3);

  const normal =
    options.normal ??
    calculateHEarthNewellNormal(
      points
    );

  const normalized =
    normalizeHEarthVector3(
      normal
    );

  if (
    points.length < 3 ||
    !normalized.valid
  ) {
    return deepFreeze({
      valid:
        false,

      planar:
        false,

      maximumDeviation:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'POLYGON_PLANE_INVALID',
            'ERROR',
            'Polygon plane could not be derived.'
          )
        ])
    });
  }

  const origin =
    options.origin ??
    points[0];

  const bounds =
    createHEarthGeometryBounds(
      points
    );

  const context =
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  const planarityTolerance =
    options.planarityTolerance ??
    context.positionTolerance;

  let maximumDeviation = 0;

  for (const point of points) {
    maximumDeviation =
      Math.max(
        maximumDeviation,
        Math.abs(
          dotHEarthVector3(
            subtractHEarthVector3(
              point,
              origin
            ),
            normalized.vector
          )
        )
      );
  }

  const planar =
    maximumDeviation <=
    planarityTolerance;

  return deepFreeze({
    valid:
      true,

    planar,

    normal:
      normalized.vector,

    maximumDeviation,

    planarityTolerance,

    issues:
      planar
        ? deepFreeze([])
        : deepFreeze([
            createHEarthGeometryIssue(
              'POLYGON_NONPLANAR_BEYOND_TOLERANCE',
              'ERROR',
              'Polygon vertices exceed the admitted planarity tolerance.',
              {
                maximumDeviation,
                planarityTolerance
              }
            )
          ])
  });
};


const orientation2D = (
  a,
  b,
  c
) =>
  (
    b.x - a.x
  ) *
  (
    c.y - a.y
  ) -
  (
    b.y - a.y
  ) *
  (
    c.x - a.x
  );


const pointOnSegment2D = (
  point,
  start,
  end,
  tolerance
) =>
  point.x >=
    Math.min(start.x, end.x) -
      tolerance &&
  point.x <=
    Math.max(start.x, end.x) +
      tolerance &&
  point.y >=
    Math.min(start.y, end.y) -
      tolerance &&
  point.y <=
    Math.max(start.y, end.y) +
      tolerance;


const segmentsIntersect2D = (
  a,
  b,
  c,
  d,
  tolerance
) => {
  const o1 =
    orientation2D(a, b, c);

  const o2 =
    orientation2D(a, b, d);

  const o3 =
    orientation2D(c, d, a);

  const o4 =
    orientation2D(c, d, b);

  if (
    Math.sign(o1) !==
      Math.sign(o2) &&
    Math.sign(o3) !==
      Math.sign(o4) &&
    Math.abs(o1) >
      tolerance &&
    Math.abs(o2) >
      tolerance &&
    Math.abs(o3) >
      tolerance &&
    Math.abs(o4) >
      tolerance
  ) {
    return true;
  }

  if (
    Math.abs(o1) <= tolerance &&
    pointOnSegment2D(
      c,
      a,
      b,
      tolerance
    )
  ) {
    return true;
  }

  if (
    Math.abs(o2) <= tolerance &&
    pointOnSegment2D(
      d,
      a,
      b,
      tolerance
    )
  ) {
    return true;
  }

  if (
    Math.abs(o3) <= tolerance &&
    pointOnSegment2D(
      a,
      c,
      d,
      tolerance
    )
  ) {
    return true;
  }

  if (
    Math.abs(o4) <= tolerance &&
    pointOnSegment2D(
      b,
      c,
      d,
      tolerance
    )
  ) {
    return true;
  }

  return false;
};


export const evaluateHEarthPolygonSelfIntersection = (
  projectedVertices,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .positionAbsoluteEpsilon
) => {
  const points =
    ensureArray(projectedVertices)
      .filter(isHEarthVector2);

  const intersections = [];

  for (
    let leftIndex = 0;
    leftIndex < points.length;
    leftIndex += 1
  ) {
    const leftNext =
      (
        leftIndex + 1
      ) %
      points.length;

    for (
      let rightIndex = leftIndex + 1;
      rightIndex < points.length;
      rightIndex += 1
    ) {
      const rightNext =
        (
          rightIndex + 1
        ) %
        points.length;

      const adjacent =
        leftIndex === rightIndex ||
        leftIndex === rightNext ||
        leftNext === rightIndex ||
        leftNext === rightNext;

      if (adjacent) {
        continue;
      }

      if (
        segmentsIntersect2D(
          points[leftIndex],
          points[leftNext],
          points[rightIndex],
          points[rightNext],
          tolerance
        )
      ) {
        intersections.push(
          deepFreeze({
            edgeA:
              [leftIndex, leftNext],

            edgeB:
              [rightIndex, rightNext]
          })
        );
      }
    }
  }

  return deepFreeze({
    selfIntersecting:
      intersections.length > 0,

    intersections:
      deepFreeze(intersections),

    issues:
      intersections.length > 0
        ? deepFreeze([
            createHEarthGeometryIssue(
              'POLYGON_SELF_INTERSECTION',
              'ERROR',
              'Polygon contains one or more nonadjacent edge intersections.',
              {
                intersections
              }
            )
          ])
        : deepFreeze([])
  });
};


export const evaluateHEarthPolygonConvexity = (
  projectedVertices,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .areaAbsoluteEpsilon
) => {
  const points =
    ensureArray(projectedVertices)
      .filter(isHEarthVector2);

  if (points.length < 3) {
    return deepFreeze({
      convex:
        false,

      sign:
        0,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'POLYGON_VERTEX_COUNT_INVALID',
            'ERROR',
            'Convexity requires at least three projected vertices.'
          )
        ])
    });
  }

  let governingSign = 0;

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const previous =
      points[
        (
          index - 1 +
          points.length
        ) %
        points.length
      ];

    const current =
      points[index];

    const next =
      points[
        (
          index + 1
        ) %
        points.length
      ];

    const cross =
      orientation2D(
        previous,
        current,
        next
      );

    if (Math.abs(cross) <= tolerance) {
      continue;
    }

    const sign =
      Math.sign(cross);

    if (governingSign === 0) {
      governingSign = sign;
    } else if (
      sign !== governingSign
    ) {
      return deepFreeze({
        convex:
          false,

        sign:
          governingSign,

        issues:
          deepFreeze([
            createHEarthGeometryIssue(
              'POLYGON_CONCAVE_TRIANGULATION_UNSUPPORTED',
              'ERROR',
              'Concave simple polygon triangulation is held unsupported in the first implementation.'
            )
          ])
      });
    }
  }

  return deepFreeze({
    convex:
      governingSign !== 0,

    sign:
      governingSign,

    issues:
      governingSign === 0
        ? deepFreeze([
            createHEarthGeometryIssue(
              'POLYGON_DEGENERATE',
              'ERROR',
              'Polygon convexity could not be established because all turns are degenerate.'
            )
          ])
        : deepFreeze([])
  });
};


export const triangulateHEarthConvexPolygon = (
  vertices
) => {
  const points =
    ensureArray(vertices)
      .filter(isHEarthVector3);

  const planarity =
    evaluateHEarthPolygonPlanarity(
      points
    );

  if (!planarity.planar) {
    return deepFreeze({
      valid:
        false,

      indices:
        deepFreeze([]),

      issues:
        planarity.issues
    });
  }

  const projection =
    projectHEarthPolygonToDominantPlane(
      points,
      planarity.normal
    );

  const intersection =
    evaluateHEarthPolygonSelfIntersection(
      projection.projectedVertices
    );

  if (intersection.selfIntersecting) {
    return deepFreeze({
      valid:
        false,

      indices:
        deepFreeze([]),

      issues:
        intersection.issues
    });
  }

  const convexity =
    evaluateHEarthPolygonConvexity(
      projection.projectedVertices
    );

  if (!convexity.convex) {
    return deepFreeze({
      valid:
        false,

      held:
        true,

      indices:
        deepFreeze([]),

      issues:
        convexity.issues
    });
  }

  const indices = [];

  for (
    let index = 1;
    index < points.length - 1;
    index += 1
  ) {
    indices.push(
      0,
      index,
      index + 1
    );
  }

  return deepFreeze({
    valid:
      true,

    held:
      false,

    indices:
      deepFreeze(indices),

    projectedPlane:
      projection.droppedAxis,

    issues:
      deepFreeze([])
  });
};


/* ==========================================================================
 * 17 · EXTRUSION, PRISM, AND ROOF CONSTRUCTION
 * ========================================================================== */

export const extrudeHEarthPolygon = ({
  primitiveId,
  baseVertices,
  direction,
  distance,
  capPolicy = 'BOTH',
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  metadata = {}
}) => {
  const issues = [];

  if (
    !isHEarthPositiveFiniteNumber(distance)
  ) {
    issues.push(
      createHEarthGeometryIssue(
        distance < 0
          ? 'EXTRUSION_DISTANCE_NEGATIVE'
          : 'EXTRUSION_DISTANCE_DEGENERATE',
        'ERROR',
        'Extrusion distance must be greater than the active length tolerance.',
        {
          distance
        }
      )
    );
  }

  const normalizedDirection =
    normalizeHEarthVector3(
      direction
    );

  if (!normalizedDirection.valid) {
    issues.push(
      ...normalizedDirection.issues
    );
  }

  const polygon =
    triangulateHEarthConvexPolygon(
      baseVertices
    );

  if (!polygon.valid) {
    issues.push(
      ...polygon.issues
    );
  }

  if (hasHEarthBlockingIssues(issues)) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const base =
    baseVertices.map(
      cloneHEarthVector3
    );

  const extrusionVector =
    scaleHEarthVector3(
      normalizedDirection.vector,
      distance
    );

  const top =
    base.map(
      (vertex) =>
        addHEarthVector3(
          vertex,
          extrusionVector
        )
    );

  const vertices =
    [
      ...base,
      ...top
    ];

  const vertexCount =
    base.length;

  const indices = [];

  if (
    capPolicy === 'BOTH' ||
    capPolicy === 'BASE_ONLY'
  ) {
    for (
      let index = 0;
      index < polygon.indices.length;
      index += 3
    ) {
      indices.push(
        polygon.indices[index],
        polygon.indices[index + 2],
        polygon.indices[index + 1]
      );
    }
  }

  if (
    capPolicy === 'BOTH' ||
    capPolicy === 'TOP_ONLY'
  ) {
    for (
      let index = 0;
      index < polygon.indices.length;
      index += 3
    ) {
      indices.push(
        polygon.indices[index] +
          vertexCount,
        polygon.indices[index + 1] +
          vertexCount,
        polygon.indices[index + 2] +
          vertexCount
      );
    }
  }

  for (
    let index = 0;
    index < vertexCount;
    index += 1
  ) {
    const next =
      (
        index + 1
      ) %
      vertexCount;

    const baseCurrent =
      index;

    const baseNext =
      next;

    const topCurrent =
      index +
      vertexCount;

    const topNext =
      next +
      vertexCount;

    indices.push(
      baseCurrent,
      baseNext,
      topNext,

      baseCurrent,
      topNext,
      topCurrent
    );
  }

  let topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  if (
    topology.closed &&
    topology.inward
  ) {
    const reversed = [];

    for (
      let index = 0;
      index < indices.length;
      index += 3
    ) {
      reversed.push(
        indices[index],
        indices[index + 2],
        indices[index + 1]
      );
    }

    indices.splice(
      0,
      indices.length,
      ...reversed
    );

    topology =
      evaluateHEarthIndexedMesh(
        vertices,
        indices
      );

    issues.push(
      createHEarthGeometryIssue(
        'MESH_CLOSED_WINDING_CORRECTED',
        'WARNING',
        'Extrusion winding was deterministically reversed and revalidated.',
        null,
        false
      )
    );
  }

  issues.push(
    ...topology.issues
  );

  const primitive =
    createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        capPolicy === 'BOTH'
          ? H_EARTH_3D_GEOMETRY_ENUMS
              .primitiveType.CLOSED_VOLUME_3D
          : H_EARTH_3D_GEOMETRY_ENUMS
              .primitiveType.INDEXED_MESH_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices,
      indices,
      faceNormals:
        topology.faceNormals,
      vertexNormals:
        topology.vertexNormals,
      closed:
        capPolicy === 'BOTH',
      windingOrder:
        'COUNTERCLOCKWISE_OUTWARD',
      metadata: {
        ...metadata,
        construction:
          'EXTRUSION',
        capPolicy,
        extrusionVector
      }
    });

  return deepFreeze({
    primitive,

    valid:
      !hasHEarthBlockingIssues(issues),

    topology,

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const constructHEarthPrism =
  extrudeHEarthPolygon;


export const constructHEarthGableRoof = ({
  primitiveId,
  footprint,
  wallTopElevation,
  ridgeDirection = 'X',
  ridgeHeight = null,
  roofPitchDegrees = null,
  overhang = 0,
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  metadata = {}
}) => {
  const issues = [];

  const points =
    ensureArray(footprint)
      .filter(isHEarthVector3);

  if (points.length !== 4) {
    issues.push(
      createHEarthGeometryIssue(
        'ROOF_FOOTPRINT_UNSUPPORTED',
        'ERROR',
        'First-pass gable roof construction requires four footprint vertices.'
      )
    );
  }

  const bothHeightInputs =
    isHEarthFiniteNumber(
      ridgeHeight
    ) &&
    isHEarthFiniteNumber(
      roofPitchDegrees
    );

  const neitherHeightInput =
    !isHEarthFiniteNumber(
      ridgeHeight
    ) &&
    !isHEarthFiniteNumber(
      roofPitchDegrees
    );

  if (
    bothHeightInputs ||
    neitherHeightInput
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'ROOF_HEIGHT_INPUT_CONFLICT',
        'ERROR',
        'Gable roof requires ridgeHeight XOR roofPitchDegrees.'
      )
    );
  }

  if (
    isHEarthFiniteNumber(
      roofPitchDegrees
    ) &&
    (
      roofPitchDegrees <= 0 ||
      roofPitchDegrees >= 89
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'ROOF_PITCH_INVALID',
        'ERROR',
        'Gable roof pitch must be greater than zero and less than 89 degrees.'
      )
    );
  }

  if (
    !isHEarthNonNegativeFiniteNumber(
      overhang
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'ROOF_OVERHANG_INVALID',
        'ERROR',
        'Roof overhang must be finite and nonnegative.'
      )
    );
  }

  if (hasHEarthBlockingIssues(issues)) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const bounds =
    createHEarthGeometryBounds(
      points
    );

  const widthX =
    bounds.size.x;

  const widthZ =
    bounds.size.z;

  const run =
    ridgeDirection === 'X'
      ? widthZ / 2
      : widthX / 2;

  const resolvedRidgeHeight =
    isHEarthFiniteNumber(
      ridgeHeight
    )
      ? ridgeHeight
      : run *
        Math.tan(
          degreesToHEarthRadians(
            roofPitchDegrees
          )
        );

  const minimum =
    bounds.minimum;

  const maximum =
    bounds.maximum;

  const y =
    wallTopElevation;

  let vertices;
  let indices;

  if (ridgeDirection === 'X') {
    const ridgeZ =
      (
        minimum.z +
        maximum.z
      ) /
      2;

    vertices = [
      createHEarthVector3(
        minimum.x - overhang,
        y,
        minimum.z - overhang
      ),
      createHEarthVector3(
        maximum.x + overhang,
        y,
        minimum.z - overhang
      ),
      createHEarthVector3(
        maximum.x + overhang,
        y,
        maximum.z + overhang
      ),
      createHEarthVector3(
        minimum.x - overhang,
        y,
        maximum.z + overhang
      ),
      createHEarthVector3(
        minimum.x - overhang,
        y + resolvedRidgeHeight,
        ridgeZ
      ),
      createHEarthVector3(
        maximum.x + overhang,
        y + resolvedRidgeHeight,
        ridgeZ
      )
    ];

    indices = [
      0, 1, 5,
      0, 5, 4,
      4, 5, 2,
      4, 2, 3
    ];
  } else {
    const ridgeX =
      (
        minimum.x +
        maximum.x
      ) /
      2;

    vertices = [
      createHEarthVector3(
        minimum.x - overhang,
        y,
        minimum.z - overhang
      ),
      createHEarthVector3(
        maximum.x + overhang,
        y,
        minimum.z - overhang
      ),
      createHEarthVector3(
        maximum.x + overhang,
        y,
        maximum.z + overhang
      ),
      createHEarthVector3(
        minimum.x - overhang,
        y,
        maximum.z + overhang
      ),
      createHEarthVector3(
        ridgeX,
        y + resolvedRidgeHeight,
        minimum.z - overhang
      ),
      createHEarthVector3(
        ridgeX,
        y + resolvedRidgeHeight,
        maximum.z + overhang
      )
    ];

    indices = [
      0, 4, 5,
      0, 5, 3,
      4, 1, 2,
      4, 2, 5
    ];
  }

  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  issues.push(
    ...topology.issues.filter(
      (issue) =>
        issue.code !==
        'MESH_VERTEX_NORMAL_AREA_WEIGHTING_INVALID'
    )
  );

  const primitive =
    createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveType.INDEXED_MESH_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices,
      indices,
      faceNormals:
        topology.faceNormals,
      vertexNormals:
        topology.vertexNormals,
      closed:
        false,
      windingOrder:
        'COUNTERCLOCKWISE_EXTERIOR',
      metadata: {
        ...metadata,
        construction:
          'GABLE_ROOF',
        wallTopElevation,
        ridgeDirection,
        ridgeHeight:
          resolvedRidgeHeight,
        roofPitchDegrees,
        overhang
      }
    });

  return deepFreeze({
    primitive,

    valid:
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const constructHEarthShedRoof = ({
  primitiveId,
  footprint,
  highEdgeId,
  lowEdgeId,
  highElevation,
  lowElevation,
  geometryDomain =
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS.kernel,
  layerHint = null,
  materialKey = null,
  metadata = {}
}) => {
  const points =
    ensureArray(footprint)
      .filter(isHEarthVector3);

  const issues = [];

  if (points.length !== 4) {
    issues.push(
      createHEarthGeometryIssue(
        'ROOF_FOOTPRINT_UNSUPPORTED',
        'ERROR',
        'First-pass shed roof construction requires four footprint vertices.'
      )
    );
  }

  if (
    !isHEarthFiniteNumber(
      highElevation
    ) ||
    !isHEarthFiniteNumber(
      lowElevation
    ) ||
    highElevation <=
      lowElevation
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SHED_ROOF_ELEVATION_INVALID',
        'ERROR',
        'Shed roof requires highElevation greater than lowElevation.'
      )
    );
  }

  if (
    !Number.isSafeInteger(
      highEdgeId
    ) ||
    !Number.isSafeInteger(
      lowEdgeId
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'SHED_ROOF_EDGE_ID_INVALID',
        'ERROR',
        'Shed roof edge identifiers must be safe integers.'
      )
    );
  }

  if (hasHEarthBlockingIssues(issues)) {
    return deepFreeze({
      primitive:
        null,

      valid:
        false,

      issues:
        sortHEarthGeometryIssues(issues)
    });
  }

  const vertices =
    points.map(
      (point, index) => {
        const edgeGroup =
          index === highEdgeId ||
          index ===
            (
              highEdgeId + 1
            ) %
            points.length;

        return createHEarthVector3(
          point.x,
          edgeGroup
            ? highElevation
            : lowElevation,
          point.z
        );
      }
    );

  const indices =
    [
      0, 1, 2,
      0, 2, 3
    ];

  const firstNormal =
    calculateHEarthTriangleNormal(
      vertices[0],
      vertices[1],
      vertices[2]
    );

  if (
    firstNormal.valid &&
    firstNormal.normal.y < 0
  ) {
    indices.splice(
      0,
      indices.length,
      0, 2, 1,
      0, 3, 2
    );
  }

  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  issues.push(
    ...topology.issues
  );

  const primitive =
    createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveType.INDEXED_MESH_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices,
      indices,
      faceNormals:
        topology.faceNormals,
      vertexNormals:
        topology.vertexNormals,
      closed:
        false,
      windingOrder:
        'COUNTERCLOCKWISE_UPWARD',
      metadata: {
        ...metadata,
        construction:
          'SHED_ROOF',
        highEdgeId,
        lowEdgeId,
        highElevation,
        lowElevation
      }
    });

  return deepFreeze({
    primitive,

    valid:
      !hasHEarthBlockingIssues(issues),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const constructHEarthPitchedRoof = (
  options
) => {
  if (
    options?.roofType ===
    'GABLE'
  ) {
    return constructHEarthGableRoof(
      options
    );
  }

  if (
    options?.roofType ===
    'SHED'
  ) {
    return constructHEarthShedRoof(
      options
    );
  }

  return deepFreeze({
    primitive:
      null,

    valid:
      false,

    held:
      true,

    issues:
      deepFreeze([
        createHEarthGeometryIssue(
          'ROOF_TYPE_UNSUPPORTED',
          'ERROR',
          'Only gable and shed roofs are supported in the first implementation.'
        )
      ])
  });
};


/* ==========================================================================
 * 18 · PRIMITIVE GRAMMAR
 * ========================================================================== */

export const createHEarthGeometryPrimitive = ({
  primitiveId,
  primitiveType,
  geometryDomain,
  layerHint = null,
  materialKey = null,
  points = [],
  vertices = [],
  indices = [],
  centerline = [],
  leftEdge = [],
  rightEdge = [],
  normal = null,
  faceNormals = [],
  vertexNormals = [],
  width = null,
  height = null,
  radius = null,
  closed = false,
  windingOrder = null,
  orientationPolicy = null,
  metadata = {}
}) => {
  const normalizedPoints =
    ensureArray(points)
      .filter(isHEarthVector3)
      .map(cloneHEarthVector3);

  const normalizedVertices =
    ensureArray(vertices)
      .filter(isHEarthVector3)
      .map(cloneHEarthVector3);

  const normalizedIndices =
    ensureArray(indices).slice();

  let bounds;

  switch (primitiveType) {
    case 'POINT_3D':
    case 'MARKER_3D': {
      bounds =
        createHEarthGeometryBounds(
          normalizedPoints
        );

      if (
        isHEarthPositiveFiniteNumber(
          radius
        )
      ) {
        bounds =
          expandHEarthBoundsByRadius(
            bounds,
            radius
          );
      }

      break;
    }

    case 'BILLBOARD_3D':
      bounds =
        createHEarthBillboardConservativeBounds({
          center:
            normalizedPoints[0],
          width,
          height
        });
      break;

    case 'RIBBON_3D':
      bounds =
        createHEarthGeometryBounds([
          ...leftEdge,
          ...rightEdge
        ]);
      break;

    case 'INDEXED_MESH_3D':
    case 'HEIGHT_FIELD_3D':
    case 'PARAMETRIC_SURFACE_3D':
    case 'CLOSED_VOLUME_3D':
    case 'PLANE_3D':
    case 'FACET_3D':
    case 'POLYGON_3D':
      bounds =
        createHEarthGeometryBounds(
          normalizedVertices.length > 0
            ? normalizedVertices
            : normalizedPoints
        );
      break;

    case 'POLYLINE_3D':
      bounds =
        createHEarthGeometryBounds(
          normalizedPoints
        );

      if (
        isHEarthPositiveFiniteNumber(
          width
        )
      ) {
        bounds =
          expandHEarthBoundsByRadius(
            bounds,
            width / 2
          );
      }
      break;

    default:
      bounds =
        createHEarthGeometryBounds([
          ...normalizedPoints,
          ...normalizedVertices
        ]);
      break;
  }

  return deepFreeze({
    primitiveId,
    primitiveType,
    geometryDomain,
    layerHint,
    materialKey,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame,

    points:
      deepFreeze(normalizedPoints),

    vertices:
      deepFreeze(normalizedVertices),

    indices:
      deepFreeze(normalizedIndices),

    centerline:
      deepFreeze(
        ensureArray(centerline)
          .filter(isHEarthVector3)
          .map(cloneHEarthVector3)
      ),

    leftEdge:
      deepFreeze(
        ensureArray(leftEdge)
          .filter(isHEarthVector3)
          .map(cloneHEarthVector3)
      ),

    rightEdge:
      deepFreeze(
        ensureArray(rightEdge)
          .filter(isHEarthVector3)
          .map(cloneHEarthVector3)
      ),

    normal:
      isHEarthVector3(normal)
        ? cloneHEarthVector3(normal)
        : null,

    faceNormals:
      deepFreeze(
        ensureArray(faceNormals)
          .filter(isHEarthVector3)
          .map(cloneHEarthVector3)
      ),

    vertexNormals:
      deepFreeze(
        ensureArray(vertexNormals)
          .filter(isHEarthVector3)
          .map(cloneHEarthVector3)
      ),

    width:
      isHEarthPositiveFiniteNumber(width)
        ? width
        : null,

    height:
      isHEarthPositiveFiniteNumber(height)
        ? height
        : null,

    radius:
      isHEarthPositiveFiniteNumber(radius)
        ? radius
        : null,

    closed:
      closed === true,

    windingOrder:
      windingOrder ?? null,

    orientationPolicy:
      orientationPolicy ?? null,

    bounds,

    metadata:
      freezeClone(metadata),

    projected:
      false,

    domCreated:
      false,

    cssCreated:
      false,

    rendered:
      false,

    rendererMaterializationClaim:
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
};


export const createHEarthPointPrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  point,
  radius = null,
  metadata = {}
}) =>
  createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.POINT_3D,
    geometryDomain,
    layerHint,
    materialKey,
    points:
      isHEarthVector3(point)
        ? [point]
        : [],
    radius,
    metadata
  });


export const createHEarthPolylinePrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  points = [],
  width = null,
  closed = false,
  metadata = {}
}) =>
  createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.POLYLINE_3D,
    geometryDomain,
    layerHint,
    materialKey,
    points,
    width,
    closed,
    metadata
  });


export const createHEarthPolygonPrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  vertices = [],
  indices = [],
  normal = null,
  windingOrder =
    'COUNTERCLOCKWISE_OUTWARD',
  metadata = {}
}) =>
  createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.POLYGON_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices,
    normal,
    windingOrder,
    metadata
  });


export const createHEarthFacetPrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  vertices = [],
  metadata = {}
}) => {
  const triangle =
    vertices.length === 3
      ? calculateHEarthTriangleNormal(
          vertices[0],
          vertices[1],
          vertices[2]
        )
      : null;

  return createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.FACET_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices:
      vertices.length === 3
        ? [0, 1, 2]
        : [],
    normal:
      triangle?.normal ?? null,
    faceNormals:
      triangle?.valid
        ? [triangle.normal]
        : [],
    windingOrder:
      'COUNTERCLOCKWISE_OUTWARD',
    metadata
  });
};


export const createHEarthPlanePrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  center,
  width,
  height,
  normal =
    createHEarthVector3(0, 1, 0),
  metadata = {}
}) => {
  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthPositiveFiniteNumber(height)
  ) {
    return createHEarthGeometryPrimitive({
      primitiveId,
      primitiveType:
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveType.PLANE_3D,
      geometryDomain,
      layerHint,
      materialKey,
      vertices: [],
      indices: [],
      normal,
      width,
      height,
      metadata
    });
  }

  const halfWidth =
    width / 2;

  const halfHeight =
    height / 2;

  const vertices = [
    createHEarthVector3(
      center.x - halfWidth,
      center.y,
      center.z - halfHeight
    ),

    createHEarthVector3(
      center.x + halfWidth,
      center.y,
      center.z - halfHeight
    ),

    createHEarthVector3(
      center.x + halfWidth,
      center.y,
      center.z + halfHeight
    ),

    createHEarthVector3(
      center.x - halfWidth,
      center.y,
      center.z + halfHeight
    )
  ];

  const indices =
    normal.y >= 0
      ? [
          0, 2, 1,
          0, 3, 2
        ]
      : [
          0, 1, 2,
          0, 2, 3
        ];

  return createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.PLANE_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices,
    normal,
    width,
    height,
    windingOrder:
      'COUNTERCLOCKWISE_EXTERIOR',
    metadata
  });
};


export const createHEarthBillboardPrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  center,
  width,
  height,
  orientationPolicy =
    'CAMERA_FACING_DOWNSTREAM_RENDERER',
  metadata = {}
}) =>
  createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.BILLBOARD_3D,
    geometryDomain,
    layerHint,
    materialKey,
    points:
      isHEarthVector3(center)
        ? [center]
        : [],
    width,
    height,
    orientationPolicy,
    metadata
  });


export const createHEarthIndexedMeshPrimitive = ({
  primitiveId,
  geometryDomain,
  layerHint,
  materialKey = null,
  vertices = [],
  indices = [],
  closed = false,
  windingOrder =
    'COUNTERCLOCKWISE_OUTWARD',
  metadata = {}
}) => {
  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  return createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      closed
        ? H_EARTH_3D_GEOMETRY_ENUMS
            .primitiveType.CLOSED_VOLUME_3D
        : H_EARTH_3D_GEOMETRY_ENUMS
            .primitiveType.INDEXED_MESH_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices,
    faceNormals:
      topology.faceNormals,
    vertexNormals:
      topology.vertexNormals,
    closed,
    windingOrder,
    metadata
  });
};


export const createHEarthHeightFieldPrimitive = ({
  primitiveId,
  descriptor,
  xSegmentCount,
  zSegmentCount,
  geometryDomain,
  layerHint,
  materialKey = null,
  metadata = {}
}) => {
  const samples =
    sampleHEarthHeightField(
      descriptor,
      {
        xSegmentCount,
        zSegmentCount
      }
    );

  const vertices =
    samples.samples.map(
      (sample) =>
        sample.value
    );

  const rowCount =
    samples.rowCount;

  const columnCount =
    samples.columnCount;

  const indices = [];

  for (
    let row = 0;
    row < rowCount - 1;
    row += 1
  ) {
    for (
      let column = 0;
      column < columnCount - 1;
      column += 1
    ) {
      const a =
        row *
          columnCount +
        column;

      const b =
        a + 1;

      const d =
        (
          row + 1
        ) *
          columnCount +
        column;

      const c =
        d + 1;

      indices.push(
        a,
        c,
        b,

        a,
        d,
        c
      );
    }
  }

  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  return createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType.HEIGHT_FIELD_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices,
    faceNormals:
      topology.faceNormals,
    vertexNormals:
      topology.vertexNormals,
    closed:
      false,
    windingOrder:
      'COUNTERCLOCKWISE_WHEN_VIEWED_FROM_POSITIVE_Y',
    metadata: {
      ...metadata,
      descriptorId:
        descriptor.descriptorId,
      rowCount,
      columnCount
    }
  });
};


export const createHEarthParametricSurfacePrimitive = ({
  primitiveId,
  descriptor,
  uSegmentCount,
  vSegmentCount,
  geometryDomain,
  layerHint,
  materialKey = null,
  metadata = {}
}) => {
  const samples =
    sampleHEarthParametricSurface(
      descriptor,
      {
        uSegmentCount,
        vSegmentCount
      }
    );

  const vertices =
    samples.samples.map(
      (sample) =>
        sample.value
    );

  const indices = [];

  const rowCount =
    samples.rowCount;

  const columnCount =
    samples.columnCount;

  const periodicU =
    samples.periodicU;

  const periodicV =
    samples.periodicV;

  const rowLimit =
    periodicV
      ? rowCount
      : rowCount - 1;

  const columnLimit =
    periodicU
      ? columnCount
      : columnCount - 1;

  for (
    let row = 0;
    row < rowLimit;
    row += 1
  ) {
    const nextRow =
      (
        row + 1
      ) %
      rowCount;

    for (
      let column = 0;
      column < columnLimit;
      column += 1
    ) {
      const nextColumn =
        (
          column + 1
        ) %
        columnCount;

      const a =
        row *
          columnCount +
        column;

      const b =
        row *
          columnCount +
        nextColumn;

      const c =
        nextRow *
          columnCount +
        nextColumn;

      const d =
        nextRow *
          columnCount +
        column;

      if (
        descriptor?.samplingPolicy
          ?.normalOrientation ===
          'V_CROSS_U'
      ) {
        indices.push(
          a,
          c,
          b,

          a,
          d,
          c
        );
      } else {
        indices.push(
          a,
          b,
          c,

          a,
          c,
          d
        );
      }
    }
  }

  const topology =
    evaluateHEarthIndexedMesh(
      vertices,
      indices
    );

  return createHEarthGeometryPrimitive({
    primitiveId,
    primitiveType:
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType
        .PARAMETRIC_SURFACE_3D,
    geometryDomain,
    layerHint,
    materialKey,
    vertices,
    indices,
    faceNormals:
      topology.faceNormals,
    vertexNormals:
      topology.vertexNormals,
    closed:
      topology.closed,
    windingOrder:
      descriptor?.samplingPolicy
        ?.normalOrientation ??
        'U_CROSS_V',
    metadata: {
      ...metadata,
      descriptorId:
        descriptor.descriptorId,
      rowCount,
      columnCount,
      periodicU,
      periodicV
    }
  });
};


export const createHEarthClosedVolumePrimitive =
  createHEarthIndexedMeshPrimitive;


/* ==========================================================================
 * 19 · ACCOUNTING AND BUDGETS
 * ========================================================================== */

export const createHEarthGeometryAccount = (
  initial = {}
) => {
  const fields = [
    'submittedPrimitiveCount',
    'structurallyValidPrimitiveCount',
    'admittedPrimitiveCount',
    'rejectedPrimitiveCount',
    'pointCount',
    'generatedVertexCount',
    'uniqueVertexCount',
    'referencedVertexCount',
    'isolatedVertexCount',
    'indexCount',
    'triangleCount',
    'degenerateTriangleCount',
    'faceCount',
    'uniqueEdgeCount',
    'boundaryEdgeCount',
    'manifoldInteriorEdgeCount',
    'nonmanifoldEdgeCount',
    'faceNormalCount',
    'vertexNormalCount',
    'curveSampleCount',
    'surfaceSampleCount',
    'estimatedPrimitiveNodeCount',
    'estimatedFaceNodeCount',
    'estimatedEdgeNodeCount',
    'estimatedAuxiliaryNodeCount',
    'estimatedProviderContainerNodeCount',
    'estimatedDOMNodeCount'
  ];

  const account = {};

  for (const field of fields) {
    const value =
      initial[field] ?? 0;

    account[field] =
      Number.isSafeInteger(value) &&
      value >= 0
        ? value
        : 0;
  }

  return deepFreeze(account);
};


export const calculateHEarthPrimitiveAccount = (
  primitive
) => {
  const vertices =
    ensureArray(
      primitive?.vertices
    );

  const points =
    ensureArray(
      primitive?.points
    );

  const indices =
    ensureArray(
      primitive?.indices
    );

  const topology =
    vertices.length > 0 &&
    indices.length > 0
      ? evaluateHEarthIndexedMesh(
          vertices,
          indices
        )
      : null;

  return createHEarthGeometryAccount({
    pointCount:
      points.length,

    generatedVertexCount:
      vertices.length,

    uniqueVertexCount:
      vertices.length,

    referencedVertexCount:
      topology?.referencedVertexCount ??
      0,

    isolatedVertexCount:
      topology?.isolatedVertexCount ??
      0,

    indexCount:
      indices.length,

    triangleCount:
      topology?.triangleCount ??
      0,

    degenerateTriangleCount:
      topology?.degenerateTriangleCount ??
      0,

    faceCount:
      topology?.triangleCount ??
      0,

    uniqueEdgeCount:
      topology?.uniqueEdgeCount ??
      0,

    boundaryEdgeCount:
      topology?.boundaryEdgeCount ??
      0,

    manifoldInteriorEdgeCount:
      topology?.manifoldInteriorEdgeCount ??
      0,

    nonmanifoldEdgeCount:
      topology?.nonmanifoldEdgeCount ??
      0,

    faceNormalCount:
      ensureArray(
        primitive?.faceNormals
      ).length,

    vertexNormalCount:
      ensureArray(
        primitive?.vertexNormals
      ).length,

    curveSampleCount:
      primitive?.primitiveType ===
        'POLYLINE_3D' ||
      primitive?.primitiveType ===
        'RIBBON_3D'
        ? (
            primitive.centerline?.length ??
            primitive.points?.length ??
            0
          )
        : 0,

    surfaceSampleCount:
      primitive?.primitiveType ===
        'HEIGHT_FIELD_3D' ||
      primitive?.primitiveType ===
        'PARAMETRIC_SURFACE_3D'
        ? vertices.length
        : 0,

    estimatedPrimitiveNodeCount:
      1,

    estimatedFaceNodeCount:
      0,

    estimatedEdgeNodeCount:
      0,

    estimatedAuxiliaryNodeCount:
      0,

    estimatedProviderContainerNodeCount:
      0,

    estimatedDOMNodeCount:
      1
  });
};


export const mergeHEarthGeometryAccounts = (
  left,
  right
) => {
  const fields =
    Object.keys(
      createHEarthGeometryAccount()
    );

  const output = {};
  const issues = [];

  for (const field of fields) {
    const result =
      safeAddHEarthInteger(
        left?.[field] ?? 0,
        right?.[field] ?? 0
      );

    if (!result.valid) {
      issues.push(
        ...result.issues
      );

      output[field] = 0;
    } else {
      output[field] =
        result.value;
    }
  }

  return deepFreeze({
    valid:
      !hasHEarthBlockingIssues(issues),

    account:
      createHEarthGeometryAccount(
        output
      ),

    issues:
      sortHEarthGeometryIssues(issues)
  });
};


export const estimateHEarthDOMNodeCount = (
  account,
  strategy,
  options = {}
) => {
  let primitiveNodes = 0;
  let faceNodes = 0;
  let edgeNodes = 0;
  let auxiliaryNodes =
    Number.isSafeInteger(
      options.auxiliaryNodes
    )
      ? options.auxiliaryNodes
      : 0;

  let providerContainerNodes =
    Number.isSafeInteger(
      options.providerContainerNodes
    )
      ? options.providerContainerNodes
      : 1;

  switch (strategy) {
    case 'ONE_NODE_PER_FACE':
      faceNodes =
        account.faceCount;
      break;

    case 'ONE_NODE_PER_EDGE':
      edgeNodes =
        account.uniqueEdgeCount;
      break;

    case 'HYBRID_FACE_EDGE':
      faceNodes =
        account.faceCount;

      edgeNodes =
        account.uniqueEdgeCount;
      break;

    case 'CUSTOM_DECLARED_STRATEGY':
      primitiveNodes =
        options.primitiveNodes ?? 0;

      faceNodes =
        options.faceNodes ?? 0;

      edgeNodes =
        options.edgeNodes ?? 0;
      break;

    case 'ONE_NODE_PER_PRIMITIVE':
    default:
      primitiveNodes =
        account.admittedPrimitiveCount ||
        1;
      break;
  }

  const total =
    primitiveNodes +
    faceNodes +
    edgeNodes +
    auxiliaryNodes +
    providerContainerNodes;

  return deepFreeze({
    strategy,

    estimatedPrimitiveNodeCount:
      primitiveNodes,

    estimatedFaceNodeCount:
      faceNodes,

    estimatedEdgeNodeCount:
      edgeNodes,

    estimatedAuxiliaryNodeCount:
      auxiliaryNodes,

    estimatedProviderContainerNodeCount:
      providerContainerNodes,

    estimatedDOMNodeCount:
      Number.isSafeInteger(total)
        ? total
        : null,

    valid:
      Number.isSafeInteger(total),

    issues:
      Number.isSafeInteger(total)
        ? deepFreeze([])
        : deepFreeze([
            createHEarthGeometryIssue(
              'GEOMETRY_ACCOUNT_SAFE_INTEGER_OVERFLOW',
              'ERROR',
              'DOM node estimate exceeded safe integer range.'
            )
          ])
  });
};


export const evaluateHEarthProviderBudget = (
  account,
  budget = {}
) => {
  const recommendedVertices =
    budget.recommendedVertexCount ??
    H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
      .maximumPrimitiveVertexCount;

  const absoluteVertices =
    budget.absoluteVertexCount ??
    H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
      .maximumProviderVertexCount;

  const recommendedTriangles =
    budget.recommendedTriangleCount ??
    H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
      .maximumPrimitiveTriangleCount;

  const absoluteTriangles =
    budget.absoluteTriangleCount ??
    H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS
      .maximumProviderTriangleCount;

  if (
    !Number.isSafeInteger(
      account?.generatedVertexCount
    ) ||
    !Number.isSafeInteger(
      account?.triangleCount
    )
  ) {
    return deepFreeze({
      result:
        H_EARTH_3D_GEOMETRY_ENUMS
          .budgetResult.UNEVALUABLE,

      blocking:
        true,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_PROVIDER_BUDGET_UNEVALUABLE',
            'ERROR',
            'Provider budget requires valid safe-integer account fields.'
          )
        ])
    });
  }

  if (
    account.generatedVertexCount >
      absoluteVertices ||
    account.triangleCount >
      absoluteTriangles
  ) {
    return deepFreeze({
      result:
        H_EARTH_3D_GEOMETRY_ENUMS
          .budgetResult.ABOVE_ABSOLUTE,

      blocking:
        true,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_PROVIDER_ABOVE_ABSOLUTE_BUDGET',
            'ERROR',
            'Provider account exceeds an absolute provider-local budget.',
            {
              account,
              absoluteVertices,
              absoluteTriangles
            }
          )
        ])
    });
  }

  if (
    account.generatedVertexCount >
      recommendedVertices ||
    account.triangleCount >
      recommendedTriangles
  ) {
    return deepFreeze({
      result:
        H_EARTH_3D_GEOMETRY_ENUMS
          .budgetResult
          .ABOVE_RECOMMENDED_WITHIN_ABSOLUTE,

      blocking:
        false,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'GEOMETRY_PROVIDER_ABOVE_RECOMMENDED_BUDGET',
            'WARNING',
            'Provider account exceeds a recommended budget but remains within the absolute limit.',
            {
              account,
              recommendedVertices,
              recommendedTriangles
            },
            false
          )
        ])
    });
  }

  return deepFreeze({
    result:
      H_EARTH_3D_GEOMETRY_ENUMS
        .budgetResult.WITHIN_RECOMMENDED,

    blocking:
      false,

    issues:
      deepFreeze([])
  });
};


/* ==========================================================================
 * 20 · PRIMITIVE VALIDATION
 * ========================================================================== */

const validatePrimitiveTypeStructure = (
  primitive,
  toleranceContext
) => {
  const issues = [];

  const points =
    ensureArray(
      primitive?.points
    );

  const vertices =
    ensureArray(
      primitive?.vertices
    );

  const indices =
    ensureArray(
      primitive?.indices
    );

  switch (primitive?.primitiveType) {
    case 'POINT_3D':
      if (
        points.length !== 1 ||
        !isHEarthVector3(points[0])
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'POINT_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'POINT_3D requires exactly one finite point.'
          )
        );
      }
      break;

    case 'POLYLINE_3D':
      if (points.length < 2) {
        issues.push(
          createHEarthGeometryIssue(
            'POLYLINE_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'POLYLINE_3D requires at least two finite points.'
          )
        );
      }

      for (
        let index = 0;
        index < points.length - 1;
        index += 1
      ) {
        if (
          getHEarthVector3Distance(
            points[index],
            points[index + 1]
          ) <=
          toleranceContext.lengthTolerance
        ) {
          issues.push(
            createHEarthGeometryIssue(
              'POLYLINE_SEGMENT_DEGENERATE',
              'ERROR',
              'POLYLINE_3D contains a degenerate consecutive segment.',
              {
                segmentIndex:
                  index
              }
            )
          );
        }
      }
      break;

    case 'FACET_3D':
      if (
        vertices.length !== 3 ||
        indices.length !== 3
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'FACET_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'FACET_3D requires exactly three vertices and one triangle.'
          )
        );
      }
      break;

    case 'PLANE_3D':
      if (
        vertices.length !== 4 ||
        indices.length !== 6
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'PLANE_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'PLANE_3D requires four canonical corners and two triangles.'
          )
        );
      }
      break;

    case 'BILLBOARD_3D':
      if (
        points.length !== 1 ||
        !isHEarthPositiveFiniteNumber(
          primitive.width
        ) ||
        !isHEarthPositiveFiniteNumber(
          primitive.height
        ) ||
        !isHEarthNonEmptyString(
          primitive.orientationPolicy
        )
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'BILLBOARD_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'BILLBOARD_3D requires a center, positive dimensions, and an orientation policy.'
          )
        );
      }
      break;

    case 'RIBBON_3D':
      if (
        primitive.centerline.length < 2 ||
        primitive.leftEdge.length !==
          primitive.centerline.length ||
        primitive.rightEdge.length !==
          primitive.centerline.length ||
        vertices.length < 4 ||
        indices.length < 6
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'RIBBON_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'RIBBON_3D requires centerline, edge arrays, vertices, and indexed triangles.'
          )
        );
      }
      break;

    case 'POLYGON_3D':
      if (
        vertices.length < 3 ||
        indices.length < 3
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'POLYGON_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'POLYGON_3D requires at least three vertices and valid triangulation.'
          )
        );
      }
      break;

    case 'INDEXED_MESH_3D':
    case 'HEIGHT_FIELD_3D':
    case 'PARAMETRIC_SURFACE_3D':
    case 'CLOSED_VOLUME_3D':
      if (
        vertices.length < 3 ||
        indices.length < 3
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'MESH_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'Mesh primitives require at least three vertices and one indexed triangle.'
          )
        );
      }
      break;

    case 'MARKER_3D':
      if (
        points.length !== 1 ||
        !isHEarthPositiveFiniteNumber(
          primitive.radius
        )
      ) {
        issues.push(
          createHEarthGeometryIssue(
            'MARKER_PRIMITIVE_STRUCTURE_INVALID',
            'ERROR',
            'MARKER_3D requires one anchor and a positive extent.'
          )
        );
      }
      break;

    default:
      issues.push(
        createHEarthGeometryIssue(
          'GEOMETRY_PRIMITIVE_TYPE_INVALID',
          'ERROR',
          'Primitive type is not admitted by the frozen geometry constitution.'
        )
      );
      break;
  }

  return sortHEarthGeometryIssues(
    issues
  );
};


export const evaluateHEarthGeometryPrimitive = (
  primitive,
  options = {}
) => {
  const issues = [];

  const identityValid =
    isPlainObject(primitive) &&
    isHEarthNonEmptyString(
      primitive.primitiveId
    );

  if (!identityValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PRIMITIVE_ID_MISSING',
        'ERROR',
        'Geometry primitive requires a nonempty primitiveId.',
        null,
        true,
        {
          primitiveId:
            primitive?.primitiveId
        }
      )
    );
  }

  const typeValid =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_ENUMS
        .primitiveType,
      primitive?.primitiveType
    );

  if (!typeValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PRIMITIVE_TYPE_INVALID',
        'ERROR',
        'Geometry primitive type is invalid.',
        {
          primitiveType:
            primitive?.primitiveType
        },
        true,
        {
          primitiveId:
            primitive?.primitiveId
        }
      )
    );
  }

  const numericsValid =
    ensureArray(
      primitive?.points
    ).every(isHEarthVector3) &&
    ensureArray(
      primitive?.vertices
    ).every(isHEarthVector3);

  if (!numericsValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PRIMITIVE_POINTS_INVALID',
        'ERROR',
        'Primitive contains nonfinite point or vertex values.',
        null,
        true,
        {
          primitiveId:
            primitive?.primitiveId
        }
      )
    );
  }

  const bounds =
    primitive?.bounds ??
    createHEarthEmptyBounds();

  const toleranceContext =
    options.toleranceContext ??
    deriveHEarthGeometryToleranceContext(
      bounds
    );

  const structureIssues =
    typeValid
      ? validatePrimitiveTypeStructure(
          primitive,
          toleranceContext
        )
      : [];

  issues.push(
    ...structureIssues
  );

  let topologyValid = true;
  let topologyEvaluation = null;

  if (
    typeValid &&
    [
      'FACET_3D',
      'PLANE_3D',
      'POLYGON_3D',
      'RIBBON_3D',
      'INDEXED_MESH_3D',
      'HEIGHT_FIELD_3D',
      'PARAMETRIC_SURFACE_3D',
      'CLOSED_VOLUME_3D'
    ].includes(
      primitive.primitiveType
    )
  ) {
    topologyEvaluation =
      evaluateHEarthIndexedMesh(
        primitive.vertices,
        primitive.indices,
        {
          toleranceContext
        }
      );

    topologyValid =
      topologyEvaluation.valid;

    issues.push(
      ...topologyEvaluation.issues
    );

    if (
      primitive.primitiveType ===
        'CLOSED_VOLUME_3D' &&
      (
        !topologyEvaluation.closed ||
        !topologyEvaluation.outward
      )
    ) {
      topologyValid = false;

      issues.push(
        createHEarthGeometryIssue(
          'MESH_CLOSED_CLAIM_UNVERIFIED',
          'ERROR',
          'CLOSED_VOLUME_3D requires a closed outward-oriented manifold.',
          {
            closureStatus:
              topologyEvaluation
                .closureStatus
          },
          true,
          {
            primitiveId:
              primitive.primitiveId
          }
        )
      );
    }
  }

  const normalsValid =
    ![
      'FACET_3D',
      'PLANE_3D',
      'POLYGON_3D',
      'RIBBON_3D',
      'INDEXED_MESH_3D',
      'HEIGHT_FIELD_3D',
      'PARAMETRIC_SURFACE_3D',
      'CLOSED_VOLUME_3D'
    ].includes(
      primitive?.primitiveType
    ) ||
    (
      ensureArray(
        primitive.faceNormals
      ).length > 0 &&
      ensureArray(
        primitive.faceNormals
      ).every(isHEarthVector3)
    );

  if (!normalsValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PRIMITIVE_NORMALS_INVALID',
        'ERROR',
        'Primitive requires finite face normals or derivable topology normals.',
        null,
        true,
        {
          primitiveId:
            primitive?.primitiveId
        }
      )
    );
  }

  const boundsEvaluation =
    evaluateHEarthGeometryBounds(
      bounds,
      {
        policy:
          options.boundsPolicy ??
          H_EARTH_3D_GEOMETRY_ENUMS
            .boundsPolicy
            .REJECT_OUT_OF_BOUNDS
      }
    );

  issues.push(
    ...boundsEvaluation.issues
  );

  const account =
    calculateHEarthPrimitiveAccount(
      primitive
    );

  const budget =
    evaluateHEarthProviderBudget(
      account,
      options.budget
    );

  issues.push(
    ...budget.issues
  );

  const authorityClaimsValid =
    primitive?.projected === false &&
    primitive?.domCreated === false &&
    primitive?.cssCreated === false &&
    primitive?.rendered === false &&
    primitive?.rendererMaterializationClaim ===
      false &&
    primitive?.rendererPassClaim ===
      false &&
    primitive?.visualPassClaim ===
      false &&
    primitive?.validationClaim ===
      false &&
    primitive?.productionClaim ===
      false;

  if (!authorityClaimsValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PRIMITIVE_AUTHORITY_CLAIM_INVALID',
        'ERROR',
        'Primitive carries an unauthorized renderer, visual, validation, or production claim.',
        null,
        true,
        {
          primitiveId:
            primitive?.primitiveId
        }
      )
    );
  }

  const gates =
    deepFreeze({
      G1_IDENTITY_VALID:
        identityValid,

      G2_TYPE_VALID:
        typeValid,

      G3_STRUCTURE_VALID:
        structureIssues.length === 0,

      G4_NUMERICS_VALID:
        numericsValid,

      G5_DIMENSIONS_VALID:
        structureIssues.length === 0,

      G6_TOPOLOGY_VALID:
        topologyValid,

      G7_NORMALS_VALID:
        normalsValid,

      G8_BOUNDS_VALID:
        boundsEvaluation.admitted,

      G9_BUDGET_VALID:
        budget.result !==
        'ABOVE_ABSOLUTE' &&
        budget.result !==
        'UNEVALUABLE',

      G10_AUTHORITY_CLAIMS_VALID:
        authorityClaimsValid
    });

  const admitted =
    allTrue(
      Object.values(gates)
    ) &&
    !hasHEarthBlockingIssues(
      issues
    );

  let classification =
    H_EARTH_3D_GEOMETRY_ENUMS
      .primitiveClassification.ADMITTED;

  if (!admitted) {
    if (
      !identityValid ||
      !typeValid ||
      structureIssues.length > 0
    ) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_STRUCTURAL;
    } else if (!numericsValid) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_NUMERICAL;
    } else if (
      topologyEvaluation
        ?.degenerateTriangleCount > 0
    ) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_DEGENERATE;
    } else if (!topologyValid) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_TOPOLOGY;
    } else if (
      !boundsEvaluation.admitted
    ) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_BOUNDS;
    } else if (
      budget.result ===
        'ABOVE_ABSOLUTE' ||
      budget.result ===
        'UNEVALUABLE'
    ) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_BUDGET;
    } else if (
      !authorityClaimsValid
    ) {
      classification =
        H_EARTH_3D_GEOMETRY_ENUMS
          .primitiveClassification
          .REJECTED_AUTHORITY;
    }
  }

  return deepFreeze({
    primitiveId:
      primitive?.primitiveId ?? null,

    primitiveType:
      primitive?.primitiveType ?? null,

    structurallyValid:
      gates.G1_IDENTITY_VALID &&
      gates.G2_TYPE_VALID &&
      gates.G3_STRUCTURE_VALID,

    mathematicallyValid:
      gates.G4_NUMERICS_VALID &&
      gates.G5_DIMENSIONS_VALID &&
      gates.G6_TOPOLOGY_VALID &&
      gates.G7_NORMALS_VALID,

    boundsValid:
      gates.G8_BOUNDS_VALID,

    budgetValid:
      gates.G9_BUDGET_VALID,

    authorityClaimsValid:
      gates.G10_AUTHORITY_CLAIMS_VALID,

    admitted,

    classification,

    gates,

    account,

    bounds:
      primitive?.bounds ??
      createHEarthEmptyBounds(),

    boundsEvaluation,

    topologyEvaluation,

    budgetEvaluation:
      budget,

    issues:
      sortHEarthGeometryIssues(
        issues
      )
  });
};


/* ==========================================================================
 * 21 · SUBMISSION PRESERVATION AND PROVIDER OUTPUT
 * ========================================================================== */

export const evaluateHEarthPrimitiveSubmissionSet = (
  submissions,
  options = {}
) => {
  const entries =
    Array.isArray(submissions)
      ? submissions
      : [];

  const records = [];
  const admittedPrimitives = [];
  const issues = [];
  const primitiveIds =
    new Map();

  entries.forEach(
    (
      submittedValue,
      submissionIndex
    ) => {
      const context =
        {
          submissionIndex,
          primitiveId:
            submittedValue?.primitiveId ??
            null
        };

      if (!isPlainObject(submittedValue)) {
        const issue =
          createHEarthGeometryIssue(
            'GEOMETRY_PRIMITIVE_SUBMISSION_NOT_OBJECT',
            'ERROR',
            'Submitted primitive value is not an object.',
            {
              submittedValueClassification:
                submittedValue === null
                  ? 'NULL'
                  : typeof submittedValue
            },
            true,
            context
          );

        issues.push(issue);

        records.push(
          deepFreeze({
            submissionIndex,
            submittedPrimitiveId:
              null,
            submittedType:
              null,
            submittedValueClassification:
              submittedValue === null
                ? 'NULL'
                : typeof submittedValue,
            structurallyValid:
              false,
            mathematicallyValid:
              false,
            admitted:
              false,
            classification:
              'REJECTED_STRUCTURAL',
            issues:
              deepFreeze([issue])
          })
        );

        return;
      }

      const primitiveId =
        submittedValue.primitiveId;

      if (
        isHEarthNonEmptyString(
          primitiveId
        )
      ) {
        const existing =
          primitiveIds.get(
            primitiveId
          );

        if (
          Number.isSafeInteger(
            existing
          )
        ) {
          const issue =
            createHEarthGeometryIssue(
              'GEOMETRY_PRIMITIVE_ID_DUPLICATE',
              'ERROR',
              'Primitive ID duplicates an earlier submission.',
              {
                firstSubmissionIndex:
                  existing,
                duplicateSubmissionIndex:
                  submissionIndex
              },
              true,
              context
            );

          issues.push(issue);

          records.push(
            deepFreeze({
              submissionIndex,
              submittedPrimitiveId:
                primitiveId,
              submittedType:
                submittedValue
                  .primitiveType ??
                null,
              submittedValueClassification:
                'OBJECT',
              structurallyValid:
                false,
              mathematicallyValid:
                false,
              admitted:
                false,
              classification:
                'REJECTED_STRUCTURAL',
              issues:
                deepFreeze([issue])
            })
          );

          return;
        }

        primitiveIds.set(
          primitiveId,
          submissionIndex
        );
      }

      const evaluation =
        evaluateHEarthGeometryPrimitive(
          submittedValue,
          options
        );

      records.push(
        deepFreeze({
          submissionIndex,
          submittedPrimitiveId:
            primitiveId ?? null,
          submittedType:
            submittedValue
              .primitiveType ??
            null,
          submittedValueClassification:
            'OBJECT',
          structurallyValid:
            evaluation
              .structurallyValid,
          mathematicallyValid:
            evaluation
              .mathematicallyValid,
          admitted:
            evaluation.admitted,
          classification:
            evaluation.classification,
          issues:
            evaluation.issues
        })
      );

      issues.push(
        ...evaluation.issues.map(
          (issue) =>
            deepFreeze({
              ...issue,
              submissionIndex:
                issue.submissionIndex ??
                submissionIndex,
              primitiveId:
                issue.primitiveId ??
                primitiveId ??
                null
            })
        )
      );

      if (evaluation.admitted) {
        admittedPrimitives.push(
          submittedValue
        );
      }
    }
  );

  const structurallyValidPrimitiveCount =
    records.filter(
      (record) =>
        record.structurallyValid
    ).length;

  const admittedPrimitiveCount =
    records.filter(
      (record) =>
        record.admitted
    ).length;

  return deepFreeze({
    submittedPrimitiveCount:
      entries.length,

    structurallyValidPrimitiveCount,

    admittedPrimitiveCount,

    rejectedPrimitiveCount:
      entries.length -
      admittedPrimitiveCount,

    records:
      deepFreeze(records),

    admittedPrimitives:
      deepFreeze(
        admittedPrimitives
      ),

    issues:
      sortHEarthGeometryIssues(
        issues
      ),

    valid:
      !hasHEarthBlockingIssues(
        issues
      )
  });
};


export const calculateHEarthProviderAccount = (
  primitives,
  submissionEvaluation = null
) => {
  let merged =
    createHEarthGeometryAccount({
      submittedPrimitiveCount:
        submissionEvaluation
          ?.submittedPrimitiveCount ??
        primitives.length,

      structurallyValidPrimitiveCount:
        submissionEvaluation
          ?.structurallyValidPrimitiveCount ??
        primitives.length,

      admittedPrimitiveCount:
        submissionEvaluation
          ?.admittedPrimitiveCount ??
        primitives.length,

      rejectedPrimitiveCount:
        submissionEvaluation
          ?.rejectedPrimitiveCount ??
        0
    });

  const issues = [];

  for (const primitive of primitives) {
    const primitiveAccount =
      calculateHEarthPrimitiveAccount(
        primitive
      );

    const result =
      mergeHEarthGeometryAccounts(
        merged,
        primitiveAccount
      );

    if (!result.valid) {
      issues.push(
        ...result.issues
      );
    }

    merged =
      result.account;
  }

  return deepFreeze({
    valid:
      !hasHEarthBlockingIssues(
        issues
      ),

    account:
      merged,

    issues:
      sortHEarthGeometryIssues(
        issues
      )
  });
};


export const createHEarthGeometryProviderOutput = ({
  geometryProviderId,
  geometryDomain,
  sourceContractId,
  sourceFrameId = null,
  sourceLayerId = null,
  primitives = [],
  providerRequired = true,
  providerPermitsEmptiness = false,
  emptyReason = null,
  excludedByFrame = false,
  budget = null,
  metadata = {},
  issues = []
}) => {
  const submissionEvaluation =
    evaluateHEarthPrimitiveSubmissionSet(
      primitives,
      {
        budget
      }
    );

  const admittedPrimitives =
    submissionEvaluation
      .admittedPrimitives;

  const providerAccount =
    calculateHEarthProviderAccount(
      admittedPrimitives,
      submissionEvaluation
    );

  const budgetEvaluation =
    evaluateHEarthProviderBudget(
      providerAccount.account,
      budget ?? {}
    );

  const bounds =
    mergeHEarthGeometryBounds(
      admittedPrimitives.map(
        (primitive) =>
          primitive.bounds
      )
    );

  const boundsEvaluation =
    evaluateHEarthGeometryBounds(
      bounds
    );

  const normalizedIssues =
    [
      ...ensureArray(issues)
        .filter(isPlainObject),
      ...submissionEvaluation.issues,
      ...providerAccount.issues,
      ...budgetEvaluation.issues,
      ...boundsEvaluation.issues
    ];

  const fatal =
    normalizedIssues.some(
      (issue) =>
        issue.severity ===
        'FATAL'
    );

  const requiredEmpty =
    providerRequired === true &&
    admittedPrimitives.length === 0;

  const lawfulOptionalEmpty =
    providerRequired === false &&
    providerPermitsEmptiness === true &&
    admittedPrimitives.length === 0 &&
    isHEarthNonEmptyString(
      emptyReason
    ) &&
    !fatal &&
    submissionEvaluation
      .submittedPrimitiveCount ===
      0;

  let providerState;

  if (fatal) {
    providerState =
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState.FATAL;
  } else if (lawfulOptionalEmpty) {
    providerState =
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState.VALID_EMPTY;
  } else if (
    requiredEmpty ||
    hasHEarthBlockingIssues(
      normalizedIssues
    ) ||
    budgetEvaluation.result ===
      'ABOVE_ABSOLUTE' ||
    budgetEvaluation.result ===
      'UNEVALUABLE'
  ) {
    providerState =
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState.INELIGIBLE;

    if (requiredEmpty) {
      normalizedIssues.push(
        createHEarthGeometryIssue(
          'PROVIDER_REQUIRED_NONEMPTY_OUTPUT_EMPTY',
          'ERROR',
          'Required provider produced zero admitted primitives.'
        )
      );
    }
  } else {
    providerState =
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState.ELIGIBLE_NONEMPTY;
  }

  return deepFreeze({
    geometryProviderId,
    geometryDomain,
    sourceContractId,
    sourceFrameId,
    sourceLayerId,

    coordinateFrame:
      H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
        .coordinateFrame,

    providerRequired:
      providerRequired === true,

    providerPermitsEmptiness:
      providerPermitsEmptiness === true,

    empty:
      admittedPrimitives.length === 0,

    emptyReason:
      emptyReason ?? null,

    excludedByFrame:
      excludedByFrame === true,

    geometryAdmission:
      providerState ===
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState
        .ELIGIBLE_NONEMPTY,

    providerState,

    submittedPrimitiveCount:
      submissionEvaluation
        .submittedPrimitiveCount,

    structurallyValidPrimitiveCount:
      submissionEvaluation
        .structurallyValidPrimitiveCount,

    admittedPrimitiveCount:
      submissionEvaluation
        .admittedPrimitiveCount,

    rejectedPrimitiveCount:
      submissionEvaluation
        .rejectedPrimitiveCount,

    submissionRecords:
      submissionEvaluation.records,

    admittedPrimitives,

    bounds,

    boundsEvaluation,

    account:
      providerAccount.account,

    budgetEvaluation,

    metadata:
      freezeClone(metadata),

    issues:
      sortHEarthGeometryIssues(
        normalizedIssues
      ),

    rendererMaterializationClaim:
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
};


export const createHEarthEmptyGeometryProviderOutput = ({
  geometryProviderId,
  geometryDomain,
  sourceContractId = null,
  emptyReason,
  excludedByFrame = false
}) =>
  createHEarthGeometryProviderOutput({
    geometryProviderId,
    geometryDomain,
    sourceContractId,
    primitives:
      [],
    providerRequired:
      false,
    providerPermitsEmptiness:
      true,
    emptyReason,
    excludedByFrame
  });


export const evaluateHEarthGeometryProviderOutput = (
  providerOutput
) => {
  const issues = [];

  const structuralValid =
    isPlainObject(providerOutput) &&
    isHEarthNonEmptyString(
      providerOutput.geometryProviderId
    ) &&
    isHEarthNonEmptyString(
      providerOutput.geometryDomain
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS,
      providerOutput.geometryDomain
    ) &&
    Array.isArray(
      providerOutput.admittedPrimitives
    ) &&
    Array.isArray(
      providerOutput.submissionRecords
    );

  if (!structuralValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PROVIDER_OUTPUT_STRUCTURE_INVALID',
        'ERROR',
        'Geometry provider output is structurally invalid.'
      )
    );
  }

  const authorityValid =
    providerOutput?.rendererMaterializationClaim ===
      false &&
    providerOutput?.rendererPassClaim ===
      false &&
    providerOutput?.visualPassClaim ===
      false &&
    providerOutput?.validationClaim ===
      false &&
    providerOutput?.productionClaim ===
      false;

  if (!authorityValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PROVIDER_AUTHORITY_CLAIM_INVALID',
        'ERROR',
        'Provider output carries an unauthorized downstream authority claim.'
      )
    );
  }

  const terminalStateValid =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_ENUMS
        .providerState,
      providerOutput?.providerState
    );

  if (!terminalStateValid) {
    issues.push(
      createHEarthGeometryIssue(
        'GEOMETRY_PROVIDER_STATE_INVALID',
        'ERROR',
        'Provider output does not carry an admitted terminal provider state.'
      )
    );
  }

  const accepted =
    structuralValid &&
    authorityValid &&
    terminalStateValid &&
    (
      providerOutput.providerState ===
        'ELIGIBLE_NONEMPTY_PROVIDER_OUTPUT' ||
      providerOutput.providerState ===
        'VALID_EMPTY_PROVIDER_OUTPUT'
    ) &&
    !hasHEarthBlockingIssues(
      providerOutput.issues
    ) &&
    !hasHEarthBlockingIssues(
      issues
    );

  return deepFreeze({
    evaluator:
      'evaluateHEarthGeometryProviderOutput',

    accepted,

    providerState:
      providerOutput?.providerState ??
      null,

    geometryAdmission:
      providerOutput
        ?.geometryAdmission === true,

    issues:
      sortHEarthGeometryIssues([
        ...ensureArray(
          providerOutput?.issues
        ),
        ...issues
      ])
  });
};


export const createHEarthGeometryProviderReceipt = ({
  geometryProviderId,
  geometryDomain,
  providerOutput = null,
  evaluation = null
}) => {
  const resolvedEvaluation =
    evaluation ??
    (
      providerOutput
        ? evaluateHEarthGeometryProviderOutput(
            providerOutput
          )
        : null
    );

  return deepFreeze({
    receiptId:
      `${geometryProviderId || 'H_EARTH_GEOMETRY_PROVIDER'}_RECEIPT`,

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID,

    mathematicsPacketId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

    mathematicsAcceptanceReceiptId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

    geometryProviderId:
      geometryProviderId ?? null,

    geometryDomain:
      geometryDomain ?? null,

    providerEvaluated:
      resolvedEvaluation !== null,

    providerState:
      providerOutput
        ?.providerState ??
      null,

    submittedPrimitiveCount:
      providerOutput
        ?.submittedPrimitiveCount ??
      0,

    admittedPrimitiveCount:
      providerOutput
        ?.admittedPrimitiveCount ??
      0,

    rejectedPrimitiveCount:
      providerOutput
        ?.rejectedPrimitiveCount ??
      0,

    boundsStatus:
      providerOutput
        ?.boundsEvaluation
        ?.admitted === true
        ? 'BOUNDS_ADMITTED'
        : 'BOUNDS_HELD_OR_REJECTED',

    geometryAdmission:
      providerOutput
        ?.geometryAdmission === true,

    accepted:
      resolvedEvaluation
        ?.accepted === true,

    status:
      resolvedEvaluation
        ?.accepted === true
        ? 'GEOMETRY_PROVIDER_RECEIPT_ACCEPTED'
        : 'GEOMETRY_PROVIDER_RECEIPT_HELD',

    testExecutionClaim:
      false,

    implementationConformanceClaim:
      false,

    providerAuthorityClaim:
      false,

    rendererAuthorityClaim:
      false,

    rendererMaterializationClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    productionClaim:
      false,

    publicReleaseClaim:
      false
  });
};


/* ==========================================================================
 * 22 · STATIC PREFLIGHT AND RECEIPTS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_BINDING_IDENTITY = deepFreeze({
  capacityContractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  matrix:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .matrix,

  matrixRole:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .matrixRole,

  activeCell:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .activeCell,

  domainCellId:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .domainCellId,

  spatialCellId:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .spatialCellId,

  bindingExpression:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .bindingExpression,

  sceneIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY
      .sceneIdentity,

  coordinateFrame:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
      .coordinateFrame,

  descriptorOnlyAtGeometryKernelLayer:
    true,

  matrixCollapse:
    false
});


export const H_EARTH_3D_GEOMETRY_KERNEL_BOUNDARY_FLAGS = deepFreeze({
  ownsFrozenGeometryMathematicsImplementation:
    true,

  ownsScalarMath:
    true,

  ownsVectorMath:
    true,

  ownsAffineMatrixMath:
    true,

  ownsDescriptorGrammar:
    true,

  ownsDeterministicSampling:
    true,

  ownsIndexedTopology:
    true,

  ownsDifferentialGeometry:
    true,

  ownsCurveAndRibbonMath:
    true,

  ownsNeutralShapeConstruction:
    true,

  ownsBoundsMath:
    true,

  ownsPrimitiveValidation:
    true,

  ownsProviderOutputClassification:
    true,

  ownsAccountingAndBudgetHelpers:
    true,

  ownsEnvironmentTruth:
    false,

  ownsSemanticPlacement:
    false,

  ownsSemanticLayerOrder:
    false,

  ownsCameraState:
    false,

  ownsViewportState:
    false,

  ownsNavigationState:
    false,

  ownsCompositorFrameSequencing:
    false,

  ownsRendererProjection:
    false,

  ownsDOMCSSMaterialization:
    false,

  ownsRendererLifecycle:
    false,

  ownsRuntimeActivation:
    false,

  ownsActorSystems:
    false,

  ownsCollision:
    false,

  ownsTraversal:
    false,

  ownsGameplay:
    false,

  ownsFluidSimulation:
    false,

  rendererPassClaim:
    false,

  visualPassClaim:
    false,

  productionClaim:
    false,

  publicReleaseClaim:
    false,

  matrixCollapse:
    false
});


export const H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT =
  (() => {
    const capacityReceipt =
      getHEarth3DCapacityReceipt();

    const capacityPreflight =
      getHEarth3DCapacityPreflight();

    const checks = [
      deepFreeze({
        id:
          'CAPACITY_RECEIPT_PRESENT',

        passed:
          isPlainObject(
            capacityReceipt
          )
      }),

      deepFreeze({
        id:
          'CAPACITY_PREFLIGHT_PRESENT',

        passed:
          isPlainObject(
            capacityPreflight
          )
      }),

      deepFreeze({
        id:
          'WORLD_BOUNDS_PRESENT',

        passed:
          isPlainObject(
            H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
          ) &&
          H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS
            .coordinateFrame ===
            'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS'
      }),

      deepFreeze({
        id:
          'NODE_BUDGET_PRESENT',

        passed:
          isPlainObject(
            H_EARTH_3D_NODE_BUDGET
          )
      }),

      deepFreeze({
        id:
          'RENDER_FRAME_CAPACITY_PRESENT',

        passed:
          isPlainObject(
            H_EARTH_3D_RENDER_FRAME_CAPACITY
          )
      }),

      deepFreeze({
        id:
          'RENDERER_CONSUMPTION_CONTEXT_PRESENT',

        passed:
          isPlainObject(
            H_EARTH_3D_RENDERER_FRAME_CONSUMPTION_ELIGIBILITY
          )
      }),

      deepFreeze({
        id:
          'CAPACITY_CLAIM_CEILINGS_PRESERVED',

        passed:
          H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
            ?.visualPassClaim === false &&
          H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
            ?.rendererPassClaim === false &&
          H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
            ?.runtimeActivationClaim === false
      }),

      deepFreeze({
        id:
          'MATHEMATICS_ACCEPTANCE_RECEIPT_DECLARED',

        passed:
          isHEarthNonEmptyString(
            H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID
          )
      })
    ];

    const passed =
      checks.every(
        (check) =>
          check.passed === true
      );

    return deepFreeze({
      preflightId:
        'H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT',

      contractId:
        H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID,

      passed,

      status:
        passed
          ? 'GEOMETRY_KERNEL_STATIC_PREFLIGHT_ELIGIBLE'
          : 'GEOMETRY_KERNEL_STATIC_PREFLIGHT_HELD',

      checks:
        deepFreeze(checks),

      importResolutionVerified:
        false,

      moduleGraphExecutionVerified:
        false,

      positiveTestExecutionPerformed:
        false,

      negativeTestExecutionPerformed:
        false,

      implementationConformance:
        'NOT_YET_EVALUATED',

      geometryProviderExecutionVerified:
        false,

      geometryIndexAggregationVerified:
        false,

      rendererConsumptionVerified:
        false,

      rendererMountVerified:
        false,

      visualOutputInspected:
        false
    });
  })();


export const H_EARTH_3D_GEOMETRY_KERNEL_RECEIPT = deepFreeze({
  receiptId:
    'H_EARTH_3D_GEOMETRY_KERNEL_IMPLEMENTATION_RECEIPT',

  contractId:
    H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_GEOMETRY_KERNEL_SCHEMA_VERSION,

  sourceFile:
    '/showroom/globe/h-earth/render/geometry-kernel.js',

  mathematicsPacketId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

  mathematicsAcceptanceReceiptId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

  fixtureAmendmentId:
    H_EARTH_3D_GEOMETRY_TEST_FIXTURE_AMENDMENT_ID,

  mathematicsStandard:
    'FROZEN',

  frozenScope:
    'GEOMETRY_MATHEMATICS_ONLY',

  implementationConstructed:
    true,

  scalarMathDefined:
    true,

  vectorMathDefined:
    true,

  matrixMathDefined:
    true,

  descriptorGrammarDefined:
    true,

  samplingDefined:
    true,

  topologyDefined:
    true,

  differentialGeometryDefined:
    true,

  curveAndRibbonMathDefined:
    true,

  neutralFieldsDefined:
    true,

  volumetricConstructionDefined:
    true,

  convexPolygonConstructionDefined:
    true,

  extrusionAndRoofConstructionDefined:
    true,

  boundsDefined:
    true,

  primitiveValidationDefined:
    true,

  submissionPreservationDefined:
    true,

  providerClassificationDefined:
    true,

  accountingDefined:
    true,

  budgetHelpersDefined:
    true,

  staticPreflightStatus:
    H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT
      .status,

  staticPreflightPassed:
    H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT
      .passed,

  testExecutionPerformed:
    false,

  negativeTestPassCount:
    0,

  positiveTestPassCount:
    0,

  implementationConformance:
    'NOT_YET_EVALUATED',

  providerAuthority:
    false,

  rendererAuthority:
    false,

  rendererMaterializationVerified:
    false,

  rendererPassClaim:
    false,

  visualPassClaim:
    false,

  productionClaim:
    false,

  publicReleaseClaim:
    false,

  nextRequired:
    'CONSTRUCT_AND_EXECUTE_STEP_034O_4A_IMPLEMENTATION_CONFORMANCE_HARNESS'
});


/* ==========================================================================
 * 23 · PUBLIC CONTRACT
 * ========================================================================== */

export const getHEarth3DGeometryKernelContract = () =>
  H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT;


export const getHEarth3DGeometryKernelReceipt = () =>
  H_EARTH_3D_GEOMETRY_KERNEL_RECEIPT;


export const getHEarth3DGeometryKernelPreflight = () =>
  H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT;


export const H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_GEOMETRY_KERNEL_SCHEMA_VERSION,

  sourceFile:
    '/showroom/globe/h-earth/render/geometry-kernel.js',

  mathematicsPacketId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

  mathematicsAcceptanceReceiptId:
    H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

  fixtureAmendmentId:
    H_EARTH_3D_GEOMETRY_TEST_FIXTURE_AMENDMENT_ID,

  mathematicsStandard:
    'FROZEN',

  frozenScope:
    'GEOMETRY_MATHEMATICS_ONLY',

  bindingIdentity:
    H_EARTH_3D_GEOMETRY_KERNEL_BINDING_IDENTITY,

  boundaryFlags:
    H_EARTH_3D_GEOMETRY_KERNEL_BOUNDARY_FLAGS,

  enums:
    H_EARTH_3D_GEOMETRY_ENUMS,

  providerDomains:
    H_EARTH_3D_GEOMETRY_PROVIDER_DOMAINS,

  layerHints:
    H_EARTH_3D_GEOMETRY_LAYER_HINTS,

  toleranceProfile:
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE,

  safetyCeilings:
    H_EARTH_3D_GEOMETRY_SAFETY_CEILINGS,

  worldBounds:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

  staticPreflight:
    H_EARTH_3D_GEOMETRY_KERNEL_STATIC_PREFLIGHT,

  receipt:
    H_EARTH_3D_GEOMETRY_KERNEL_RECEIPT,

  publicApi: deepFreeze({
    scalar: deepFreeze([
      'isHEarthFiniteNumber',
      'isHEarthPositiveFiniteNumber',
      'isHEarthNonNegativeFiniteNumber',
      'clampHEarthNumber',
      'saturateHEarthNumber',
      'lerpHEarthNumber',
      'inverseLerpHEarthNumber',
      'safeDivideHEarthNumber',
      'approximatelyEqualHEarthNumber',
      'roundHEarthNumber',
      'degreesToHEarthRadians',
      'radiansToHEarthDegrees',
      'normalizeHEarthDegreesSigned',
      'normalizeHEarthDegreesUnsigned',
      'normalizeHEarthRadiansSigned',
      'normalizeHEarthRadiansUnsigned',
      'signedPowerHEarthNumber',
      'smoothstepHEarthNumber',
      'smootherstepHEarthNumber',
      'smoothMinHEarthNumber',
      'smoothMaxHEarthNumber',
      'safeAddHEarthInteger',
      'safeMultiplyHEarthInteger'
    ]),

    vector: deepFreeze([
      'createHEarthVector2',
      'createHEarthVector3',
      'createHEarthVector4',
      'cloneHEarthVector2',
      'cloneHEarthVector3',
      'cloneHEarthVector4',
      'addHEarthVector2',
      'addHEarthVector3',
      'subtractHEarthVector2',
      'subtractHEarthVector3',
      'multiplyHEarthVector3Components',
      'scaleHEarthVector2',
      'scaleHEarthVector3',
      'divideHEarthVector3',
      'dotHEarthVector2',
      'dotHEarthVector3',
      'crossHEarthVector3',
      'getHEarthVector2LengthSquared',
      'getHEarthVector3LengthSquared',
      'getHEarthVector2Length',
      'getHEarthVector3Length',
      'getHEarthVector2DistanceSquared',
      'getHEarthVector3DistanceSquared',
      'getHEarthVector2Distance',
      'getHEarthVector3Distance',
      'normalizeHEarthVector2',
      'normalizeHEarthVector3',
      'lerpHEarthVector3',
      'minimumHEarthVector3',
      'maximumHEarthVector3',
      'projectHEarthVector3',
      'projectHEarthVector3OntoPlane',
      'reflectHEarthVector3',
      'approximatelyEqualHEarthVector3'
    ]),

    matrix: deepFreeze([
      'createHEarthMatrix4',
      'createHEarthIdentityMatrix4',
      'cloneHEarthMatrix4',
      'multiplyHEarthMatrix4',
      'transposeHEarthMatrix4',
      'getHEarthMatrixLinearColumns',
      'determinantHEarthMatrix3Linear',
      'createHEarthTranslationMatrix',
      'createHEarthScaleMatrix',
      'createHEarthRotationXMatrix',
      'createHEarthRotationYMatrix',
      'createHEarthRotationZMatrix',
      'createHEarthAxisAngleRotationMatrix',
      'composeHEarthWorldTransform',
      'transformHEarthVector4',
      'transformHEarthVector3',
      'transformHEarthDirection3',
      'classifyHEarthTransform',
      'invertHEarthMatrix4',
      'transformHEarthNormal3'
    ]),

    descriptors: deepFreeze([
      'createHEarthParametricCurveDescriptor',
      'createHEarthParametricSurfaceDescriptor',
      'createHEarthHeightFieldDescriptor',
      'createHEarthSignedDistanceFieldDescriptor',
      'createHEarthRadialSurfaceDescriptor',
      'createHEarthScalarFieldDescriptor',
      'evaluateHEarthEquationDescriptor'
    ]),

    sampling: deepFreeze([
      'evaluateHEarthDuplicateSamples',
      'sampleHEarthParametricCurve',
      'sampleHEarthParametricSurface',
      'sampleHEarthHeightField',
      'sampleHEarthRadialSurface',
      'sampleHEarthProfileCurve'
    ]),

    topology: deepFreeze([
      'extractHEarthMeshEdges',
      'evaluateHEarthSignedMeshVolume',
      'evaluateHEarthIndexedMesh',
      'evaluateHEarthMeshClosure',
      'evaluateHEarthMeshManifoldStatus',
      'evaluateHEarthMeshConnectedness'
    ]),

    differential: deepFreeze([
      'calculateHEarthTriangleNormal',
      'calculateHEarthFaceNormals',
      'calculateHEarthVertexNormals',
      'estimateHEarthPartialDerivativeU',
      'estimateHEarthPartialDerivativeV',
      'estimateHEarthPartialDerivativeX',
      'estimateHEarthPartialDerivativeZ',
      'evaluateHEarthParametricSurfaceNormal',
      'evaluateHEarthHeightFieldNormal'
    ]),

    curvesAndRibbons: deepFreeze([
      'evaluateHEarthPolylineTangent',
      'evaluateHEarthCurveTangent',
      'evaluateHEarthCurveNormalXZ',
      'calculateHEarthSignedDistanceToPolylineXZ',
      'offsetHEarthCurve',
      'constructHEarthRibbonFromCenterline'
    ]),

    fields: deepFreeze([
      'evaluateHEarthRadialFalloff',
      'evaluateHEarthEllipticalFalloff',
      'evaluateHEarthBoundedElevation',
      'evaluateHEarthBoundedDepression',
      'evaluateHEarthRidgeDisplacement',
      'evaluateHEarthTerraceProfile',
      'evaluateHEarthCliffProfile'
    ]),

    volumetric: deepFreeze([
      'evaluateHEarthEllipsoidPoint',
      'evaluateHEarthSuperellipsePoint',
      'evaluateHEarthSuperellipsoidPoint',
      'constructHEarthEllipsoidMesh',
      'constructHEarthSuperellipsoidMesh',
      'constructHEarthRadialShell'
    ]),

    polygonAndConstruction: deepFreeze([
      'calculateHEarthNewellNormal',
      'projectHEarthPolygonToDominantPlane',
      'evaluateHEarthPolygonPlanarity',
      'evaluateHEarthPolygonSelfIntersection',
      'evaluateHEarthPolygonConvexity',
      'triangulateHEarthConvexPolygon',
      'extrudeHEarthPolygon',
      'constructHEarthPrism',
      'constructHEarthGableRoof',
      'constructHEarthShedRoof',
      'constructHEarthPitchedRoof'
    ]),

    bounds: deepFreeze([
      'createHEarthEmptyBounds',
      'createHEarthBoundsFromMinimumMaximum',
      'createHEarthGeometryBounds',
      'expandHEarthBoundsByRadius',
      'expandHEarthBoundsByExtent',
      'mergeHEarthGeometryBounds',
      'createHEarthBillboardConservativeBounds',
      'evaluateHEarthGeometryBounds'
    ]),

    primitives: deepFreeze([
      'createHEarthGeometryPrimitive',
      'createHEarthPointPrimitive',
      'createHEarthPolylinePrimitive',
      'createHEarthPolygonPrimitive',
      'createHEarthFacetPrimitive',
      'createHEarthPlanePrimitive',
      'createHEarthBillboardPrimitive',
      'createHEarthIndexedMeshPrimitive',
      'createHEarthHeightFieldPrimitive',
      'createHEarthParametricSurfacePrimitive',
      'createHEarthClosedVolumePrimitive',
      'evaluateHEarthGeometryPrimitive'
    ]),

    accounting: deepFreeze([
      'createHEarthGeometryAccount',
      'calculateHEarthPrimitiveAccount',
      'mergeHEarthGeometryAccounts',
      'estimateHEarthDOMNodeCount',
      'evaluateHEarthProviderBudget',
      'calculateHEarthProviderAccount'
    ]),

    providers: deepFreeze([
      'evaluateHEarthPrimitiveSubmissionSet',
      'createHEarthGeometryProviderOutput',
      'createHEarthEmptyGeometryProviderOutput',
      'evaluateHEarthGeometryProviderOutput',
      'createHEarthGeometryProviderReceipt'
    ]),

    receipts: deepFreeze([
      'getHEarth3DGeometryKernelContract',
      'getHEarth3DGeometryKernelReceipt',
      'getHEarth3DGeometryKernelPreflight'
    ])
  })
});


export default H_EARTH_3D_GEOMETRY_KERNEL_CONTRACT;
