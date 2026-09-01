/**
 * /showroom/globe/h-earth/render/geometry-kernel.north.js
 * COMPLETE CORRECTED FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1
 *
 * GOVERNING MATHEMATICS:
 * STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1
 *
 * OWNERSHIP CONTRACT:
 * STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_CONTRACT_v1
 *
 * OWNERSHIP LOCK:
 * STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_LOCK_BIND_FREEZE_RECEIPT_v1
 *
 * FINAL REFREEZE:
 * STEP_034O_4C_1_TRANSLATION_EXECUTION_CAPACITY_ENVIRONMENT_COMPOSITOR_HANDOFF_FINAL_REFREEZE_RECEIPT_v1
 *
 * CORRECTION SCOPE:
 * STEP_034O_4N_TARGETED_FOUNDATIONAL_CORRECTION_SCOPE
 *
 * STATUS:
 * NORTH FOUNDATIONAL MATHEMATICS CORRECTED IMPLEMENTATION CANDIDATE.
 *
 * AUTHORIZED JURISDICTION:
 * FOUNDATIONAL_MATHEMATICS_ONLY.
 *
 * IMPORT LAW:
 * THIS FILE HAS NO IMPORTS.
 *
 * IMPLEMENTATION CONFORMANCE:
 * NOT_YET_EVALUATED.
 *
 * NORTH LOCAL ADMISSION:
 * FALSE.
 *
 * TEST EXECUTION:
 * NOT_PERFORMED.
 */


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION = 3;

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-kernel.north.js';

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID =
  'STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1';

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID =
  'STEP_034O_4A_FORMAL_ACCEPTANCE_RECEIPT';

export const H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID =
  'STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_CONTRACT_v1';

export const H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID =
  'STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_LOCK_BIND_FREEZE_RECEIPT_v1';

export const H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID =
  'STEP_034O_4C_1_TRANSLATION_EXECUTION_CAPACITY_ENVIRONMENT_COMPOSITOR_HANDOFF_FINAL_REFREEZE_RECEIPT_v1';

export const H_EARTH_3D_GEOMETRY_NORTH_CORRECTION_SCOPE_ID =
  'STEP_034O_4N_TARGETED_FOUNDATIONAL_CORRECTION_SCOPE';

export const H_EARTH_3D_GEOMETRY_COORDINATE_FRAME =
  'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS';


/* ==========================================================================
 * 02 · INTERNAL IMMUTABILITY AND STRUCTURE HELPERS
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


function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}


function clonePlainValue(value) {
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
}


function freezeClone(value) {
  return deepFreeze(
    clonePlainValue(value)
  );
}


function ensureArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}


function enumIncludes(enumObject, value) {
  return Object.values(enumObject)
    .includes(value);
}


/* ==========================================================================
 * 03 · NORTH ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_NORTH_ENUMS = deepFreeze({
  coordinateSystem: deepFreeze({
    RIGHT_HANDED_CARTESIAN:
      'RIGHT_HANDED_CARTESIAN'
  }),

  angleUnit: deepFreeze({
    RADIANS:
      'RADIANS',

    DEGREES:
      'DEGREES'
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

  issueSeverity: deepFreeze({
    FATAL:
      'FATAL',

    ERROR:
      'ERROR',

    WARNING:
      'WARNING',

    INFO:
      'INFO'
  }),

  boundsRelationship: deepFreeze({
    EQUAL:
      'EQUAL',

    CONTAINS:
      'CONTAINS',

    CONTAINED_BY:
      'CONTAINED_BY',

    INTERSECTS:
      'INTERSECTS',

    DISJOINT:
      'DISJOINT',

    UNEVALUABLE:
      'UNEVALUABLE'
  })
});


/* ==========================================================================
 * 04 · CANONICAL ISSUE STRUCTURE
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


export function createHEarthGeometryIssue(
  code,
  severity,
  message,
  details = null,
  blocking = null,
  context = {}
) {
  const normalizedSeverity =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS.issueSeverity,
      severity
    )
      ? severity
      : H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .issueSeverity.ERROR;

  const resolvedBlocking =
    typeof blocking === 'boolean'
      ? blocking
      : (
          normalizedSeverity ===
            H_EARTH_3D_GEOMETRY_NORTH_ENUMS
              .issueSeverity.ERROR ||
          normalizedSeverity ===
            H_EARTH_3D_GEOMETRY_NORTH_ENUMS
              .issueSeverity.FATAL
        );

  return deepFreeze({
    code:
      typeof code === 'string' &&
      code.trim().length > 0
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
      Number.isSafeInteger(
        context?.submissionIndex
      )
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

    providerId:
      typeof context?.providerId === 'string'
        ? context.providerId
        : null,

    frameId:
      typeof context?.frameId === 'string'
        ? context.frameId
        : null,

    sourceModule:
      typeof context?.sourceModule === 'string'
        ? context.sourceModule
        : 'geometry-kernel.north.js',

    blocking:
      resolvedBlocking
  });
}


export function compareHEarthGeometryIssues(
  left,
  right
) {
  const leftSubmissionIndex =
    Number.isSafeInteger(
      left?.submissionIndex
    )
      ? left.submissionIndex
      : Number.MAX_SAFE_INTEGER;

  const rightSubmissionIndex =
    Number.isSafeInteger(
      right?.submissionIndex
    )
      ? right.submissionIndex
      : Number.MAX_SAFE_INTEGER;

  if (
    leftSubmissionIndex !==
    rightSubmissionIndex
  ) {
    return (
      leftSubmissionIndex -
      rightSubmissionIndex
    );
  }

  const primitiveCompare =
    String(left?.primitiveId ?? '')
      .localeCompare(
        String(right?.primitiveId ?? '')
      );

  if (primitiveCompare !== 0) {
    return primitiveCompare;
  }

  const descriptorCompare =
    String(left?.descriptorId ?? '')
      .localeCompare(
        String(right?.descriptorId ?? '')
      );

  if (descriptorCompare !== 0) {
    return descriptorCompare;
  }

  const providerCompare =
    String(left?.providerId ?? '')
      .localeCompare(
        String(right?.providerId ?? '')
      );

  if (providerCompare !== 0) {
    return providerCompare;
  }

  const frameCompare =
    String(left?.frameId ?? '')
      .localeCompare(
        String(right?.frameId ?? '')
      );

  if (frameCompare !== 0) {
    return frameCompare;
  }

  const leftSeverityRank =
    H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK[
      left?.severity
    ] ??
    Number.MAX_SAFE_INTEGER;

  const rightSeverityRank =
    H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK[
      right?.severity
    ] ??
    Number.MAX_SAFE_INTEGER;

  if (
    leftSeverityRank !==
    rightSeverityRank
  ) {
    return (
      leftSeverityRank -
      rightSeverityRank
    );
  }

  const codeCompare =
    String(left?.code ?? '')
      .localeCompare(
        String(right?.code ?? '')
      );

  if (codeCompare !== 0) {
    return codeCompare;
  }

  const sourceCompare =
    String(left?.sourceModule ?? '')
      .localeCompare(
        String(right?.sourceModule ?? '')
      );

  if (sourceCompare !== 0) {
    return sourceCompare;
  }

  return String(left?.message ?? '')
    .localeCompare(
      String(right?.message ?? '')
    );
}


export function sortHEarthGeometryIssues(
  issues = []
) {
  return deepFreeze(
    ensureArray(issues)
      .filter(isPlainObject)
      .slice()
      .sort(compareHEarthGeometryIssues)
  );
}


export function hasHEarthBlockingIssues(
  issues = []
) {
  return ensureArray(issues)
    .some(
      (issue) =>
        isPlainObject(issue) &&
        issue.blocking === true
    );
}


export function getHEarthHighestIssueSeverity(
  issues = []
) {
  let highestSeverity = null;

  let highestRank =
    Number.MAX_SAFE_INTEGER;

  for (
    const issue of
    ensureArray(issues)
  ) {
    if (!isPlainObject(issue)) {
      continue;
    }

    const rank =
      H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK[
        issue.severity
      ];

    if (
      Number.isSafeInteger(rank) &&
      rank < highestRank
    ) {
      highestRank = rank;

      highestSeverity =
        issue.severity;
    }
  }

  return highestSeverity;
}


/* ==========================================================================
 * 05 · FINITE-NUMBER AND SAFE-INTEGER LAW
 * ========================================================================== */

export function isHEarthFiniteNumber(
  value
) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  );
}


export function isHEarthPositiveFiniteNumber(
  value
) {
  return (
    isHEarthFiniteNumber(value) &&
    value > 0
  );
}


export function isHEarthNonNegativeFiniteNumber(
  value
) {
  return (
    isHEarthFiniteNumber(value) &&
    value >= 0
  );
}


export function isHEarthSafeInteger(
  value
) {
  return Number.isSafeInteger(value);
}


export function isHEarthNonNegativeSafeInteger(
  value
) {
  return (
    Number.isSafeInteger(value) &&
    value >= 0
  );
}


export function isHEarthPositiveSafeInteger(
  value
) {
  return (
    Number.isSafeInteger(value) &&
    value > 0
  );
}


export function isHEarthNonEmptyString(
  value
) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}


export function validateHEarthFiniteNumber(
  value,
  context = {}
) {
  const valid =
    isHEarthFiniteNumber(value);

  return deepFreeze({
    valid,

    value:
      valid
        ? value
        : null,

    issues:
      valid
        ? deepFreeze([])
        : deepFreeze([
            createHEarthGeometryIssue(
              context.issueCode ??
                'FINITE_NUMBER_REQUIRED',

              context.severity ??
                'ERROR',

              context.message ??
                'A finite number is required.',

              {
                value,

                field:
                  context.field ??
                  null
              },

              context.blocking ??
                true,

              context
            )
          ])
  });
}


export function validateHEarthNonNegativeSafeInteger(
  value,
  context = {}
) {
  const valid =
    isHEarthNonNegativeSafeInteger(
      value
    );

  return deepFreeze({
    valid,

    value:
      valid
        ? value
        : null,

    issues:
      valid
        ? deepFreeze([])
        : deepFreeze([
            createHEarthGeometryIssue(
              context.issueCode ??
                'NONNEGATIVE_SAFE_INTEGER_REQUIRED',

              context.severity ??
                'ERROR',

              context.message ??
                'A nonnegative safe integer is required.',

              {
                value,

                field:
                  context.field ??
                  null
              },

              context.blocking ??
                true,

              context
            )
          ])
  });
}


/* ==========================================================================
 * 06 · SAFE INTEGER ARITHMETIC
 * ========================================================================== */

export function safeAddHEarthInteger(
  left,
  right
) {
  if (
    !isHEarthNonNegativeSafeInteger(left) ||
    !isHEarthNonNegativeSafeInteger(right)
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SAFE_INTEGER_ADDITION_INVALID_INPUT',
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
            'SAFE_INTEGER_ADDITION_OVERFLOW',
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
}


export function safeMultiplyHEarthInteger(
  left,
  right
) {
  if (
    !isHEarthNonNegativeSafeInteger(left) ||
    !isHEarthNonNegativeSafeInteger(right)
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SAFE_INTEGER_MULTIPLICATION_INVALID_INPUT',
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
            'SAFE_INTEGER_MULTIPLICATION_OVERFLOW',
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
}


export function safeSubtractHEarthInteger(
  left,
  right
) {
  if (
    !isHEarthNonNegativeSafeInteger(left) ||
    !isHEarthNonNegativeSafeInteger(right) ||
    right > left
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SAFE_INTEGER_SUBTRACTION_INVALID',
            'ERROR',
            'Safe nonnegative integer subtraction requires right <= left.',
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

    value:
      left - right,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 07 · TOLERANCE CONSTITUTION
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


export function isHEarthGeometryToleranceProfile(
  profile
) {
  return (
    isPlainObject(profile) &&
    isHEarthNonEmptyString(
      profile.toleranceProfileId
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.scalarAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.scalarRelativeEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.positionAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.positionRelativeEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.lengthAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.areaAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.volumeAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.normalLengthEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.matrixAbsoluteEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.matrixRelativeEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.matrixResidualEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.parameterEpsilon
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.angleEpsilonRadians
    ) &&
    isHEarthNonNegativeFiniteNumber(
      profile.miterDenominatorEpsilon
    ) &&
    isHEarthPositiveFiniteNumber(
      profile.derivativeRelativeStep
    )
  );
}


export function getHEarthGeometryToleranceProfile() {
  return H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE;
}


export function isHEarthGeometryToleranceContext(
  context
) {
  return (
    isPlainObject(context) &&
    isHEarthNonEmptyString(
      context.toleranceProfileId
    ) &&
    isHEarthPositiveFiniteNumber(
      context.geometryScale
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.scalarAbsoluteTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.scalarRelativeTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.positionTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.lengthTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.areaTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.volumeTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.normalLengthTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.matrixAbsoluteTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.matrixRelativeTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.matrixResidualTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.parameterTolerance
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.angleToleranceRadians
    ) &&
    isHEarthNonNegativeFiniteNumber(
      context.miterDenominatorTolerance
    ) &&
    isHEarthPositiveFiniteNumber(
      context.derivativeRelativeStep
    )
  );
}


function deriveHEarthGeometryToleranceContextFromScale(
  geometryScale,
  profile =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
) {
  if (
    !isHEarthGeometryToleranceProfile(
      profile
    ) ||
    !isHEarthPositiveFiniteNumber(
      geometryScale
    )
  ) {
    return null;
  }

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

  if (
    !isHEarthFiniteNumber(
      positionTolerance
    ) ||
    !isHEarthFiniteNumber(
      lengthTolerance
    ) ||
    !isHEarthFiniteNumber(
      areaTolerance
    ) ||
    !isHEarthFiniteNumber(
      volumeTolerance
    )
  ) {
    return null;
  }

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
}


function deriveBoundsScale(
  bounds
) {
  if (
    bounds === null ||
    bounds === undefined
  ) {
    return 1;
  }

  if (!isHEarthAABB3DShape(bounds)) {
    return null;
  }

  if (bounds.empty === true) {
    return 1;
  }

  if (
    !isPlainObject(bounds.size) ||
    !isHEarthFiniteNumber(bounds.size.x) ||
    !isHEarthFiniteNumber(bounds.size.y) ||
    !isHEarthFiniteNumber(bounds.size.z)
  ) {
    return null;
  }

  const scale = Math.max(
    Math.abs(bounds.size.x),
    Math.abs(bounds.size.y),
    Math.abs(bounds.size.z),
    1
  );

  return isHEarthPositiveFiniteNumber(scale)
    ? scale
    : null;
}


export function deriveHEarthGeometryToleranceContext(
  bounds = null,
  profile =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
) {
  if (
    !isHEarthGeometryToleranceProfile(
      profile
    )
  ) {
    return null;
  }

  const geometryScale =
    deriveBoundsScale(bounds);

  if (
    !isHEarthPositiveFiniteNumber(
      geometryScale
    )
  ) {
    return null;
  }

  return deriveHEarthGeometryToleranceContextFromScale(
    geometryScale,
    profile
  );
}


/* ==========================================================================
 * 08 · SCALAR MATHEMATICS
 * ========================================================================== */

export function clampHEarthNumber(
  value,
  minimum,
  maximum
) {
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
    Math.max(
      minimum,
      value
    )
  );
}


export function saturateHEarthNumber(
  value
) {
  return clampHEarthNumber(
    value,
    0,
    1
  );
}


export function lerpHEarthNumber(
  start,
  end,
  amount
) {
  if (
    !isHEarthFiniteNumber(start) ||
    !isHEarthFiniteNumber(end) ||
    !isHEarthFiniteNumber(amount)
  ) {
    return Number.NaN;
  }

  const result =
    start +
    amount *
      (end - start);

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function inverseLerpHEarthNumber(
  start,
  end,
  value,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) {
  if (
    !isHEarthFiniteNumber(start) ||
    !isHEarthFiniteNumber(end) ||
    !isHEarthFiniteNumber(value) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return Number.NaN;
  }

  const denominator =
    end - start;

  if (
    !isHEarthFiniteNumber(denominator) ||
    Math.abs(denominator) <= tolerance
  ) {
    return Number.NaN;
  }

  const result =
    (value - start) /
    denominator;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function remapHEarthNumber(
  sourceMinimum,
  sourceMaximum,
  targetMinimum,
  targetMaximum,
  value,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) {
  if (
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return Number.NaN;
  }

  const parameter =
    inverseLerpHEarthNumber(
      sourceMinimum,
      sourceMaximum,
      value,
      tolerance
    );

  if (
    !isHEarthFiniteNumber(
      parameter
    )
  ) {
    return Number.NaN;
  }

  return lerpHEarthNumber(
    targetMinimum,
    targetMaximum,
    parameter
  );
}


export function safeDivideHEarthNumber(
  numerator,
  denominator,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) {
  if (
    !isHEarthFiniteNumber(numerator) ||
    !isHEarthFiniteNumber(denominator) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SCALAR_DIVISION_INVALID_INPUT',
            'ERROR',
            'Safe division requires finite operands and a nonnegative finite tolerance.',
            {
              numerator,
              denominator,
              tolerance
            }
          )
        ])
    });
  }

  if (
    Math.abs(denominator) <=
    tolerance
  ) {
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

  const value =
    numerator / denominator;

  if (!isHEarthFiniteNumber(value)) {
    return deepFreeze({
      valid:
        false,

      value:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'SCALAR_DIVISION_NONFINITE_RESULT',
            'ERROR',
            'Safe division produced a nonfinite result.',
            {
              numerator,
              denominator
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
}


export function approximatelyEqualHEarthNumber(
  left,
  right,
  options = {}
) {
  if (
    !isHEarthFiniteNumber(left) ||
    !isHEarthFiniteNumber(right)
  ) {
    return false;
  }

  const absoluteTolerance =
    options.absoluteTolerance === undefined
      ? H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .scalarAbsoluteEpsilon
      : options.absoluteTolerance;

  const relativeTolerance =
    options.relativeTolerance === undefined
      ? H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
          .scalarRelativeEpsilon
      : options.relativeTolerance;

  if (
    !isHEarthNonNegativeFiniteNumber(
      absoluteTolerance
    ) ||
    !isHEarthNonNegativeFiniteNumber(
      relativeTolerance
    )
  ) {
    return false;
  }

  const scale =
    Math.max(
      Math.abs(left),
      Math.abs(right),
      1
    );

  const threshold =
    absoluteTolerance +
    relativeTolerance *
      scale;

  return (
    isHEarthFiniteNumber(threshold) &&
    Math.abs(left - right) <=
      threshold
  );
}


export function roundHEarthNumber(
  value,
  precision = 8
) {
  if (!isHEarthFiniteNumber(value)) {
    return Number.NaN;
  }

  const resolvedPrecision =
    Number.isInteger(precision)
      ? Math.min(
          15,
          Math.max(0, precision)
        )
      : 8;

  const multiplier =
    10 ** resolvedPrecision;

  const result =
    Math.round(
      value * multiplier
    ) /
    multiplier;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function signedPowerHEarthNumber(
  value,
  exponent
) {
  if (
    !isHEarthFiniteNumber(value) ||
    !isHEarthPositiveFiniteNumber(
      exponent
    )
  ) {
    return Number.NaN;
  }

  if (value === 0) {
    return 0;
  }

  const result =
    Math.sign(value) *
    Math.abs(value) ** exponent;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function smoothstepHEarthNumber(
  edge0,
  edge1,
  value
) {
  if (
    !isHEarthFiniteNumber(edge0) ||
    !isHEarthFiniteNumber(edge1) ||
    !isHEarthFiniteNumber(value) ||
    edge0 >= edge1
  ) {
    return Number.NaN;
  }

  const parameter =
    clampHEarthNumber(
      (value - edge0) /
        (edge1 - edge0),
      0,
      1
    );

  if (!isHEarthFiniteNumber(parameter)) {
    return Number.NaN;
  }

  return (
    parameter *
    parameter *
    (
      3 -
      2 * parameter
    )
  );
}


export function smootherstepHEarthNumber(
  edge0,
  edge1,
  value
) {
  if (
    !isHEarthFiniteNumber(edge0) ||
    !isHEarthFiniteNumber(edge1) ||
    !isHEarthFiniteNumber(value) ||
    edge0 >= edge1
  ) {
    return Number.NaN;
  }

  const parameter =
    clampHEarthNumber(
      (value - edge0) /
        (edge1 - edge0),
      0,
      1
    );

  if (!isHEarthFiniteNumber(parameter)) {
    return Number.NaN;
  }

  return (
    parameter ** 3 *
    (
      parameter *
      (
        parameter * 6 -
        15
      ) +
      10
    )
  );
}


export function smoothMinHEarthNumber(
  left,
  right,
  smoothing
) {
  if (
    !isHEarthFiniteNumber(left) ||
    !isHEarthFiniteNumber(right) ||
    !isHEarthPositiveFiniteNumber(
      smoothing
    )
  ) {
    return Number.NaN;
  }

  const parameter =
    clampHEarthNumber(
      0.5 +
      0.5 *
        (right - left) /
        smoothing,
      0,
      1
    );

  if (!isHEarthFiniteNumber(parameter)) {
    return Number.NaN;
  }

  const result =
    lerpHEarthNumber(
      right,
      left,
      parameter
    ) -
    smoothing *
      parameter *
      (1 - parameter);

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function smoothMaxHEarthNumber(
  left,
  right,
  smoothing
) {
  const result =
    smoothMinHEarthNumber(
      -left,
      -right,
      smoothing
    );

  return isHEarthFiniteNumber(result)
    ? -result
    : Number.NaN;
}


/* ==========================================================================
 * 09 · ANGLE MATHEMATICS
 * ========================================================================== */

export function degreesToHEarthRadians(
  degrees
) {
  if (!isHEarthFiniteNumber(degrees)) {
    return Number.NaN;
  }

  const result =
    degrees *
    Math.PI /
    180;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function radiansToHEarthDegrees(
  radians
) {
  if (!isHEarthFiniteNumber(radians)) {
    return Number.NaN;
  }

  const result =
    radians *
    180 /
    Math.PI;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function normalizeHEarthDegreesSigned(
  degrees
) {
  if (!isHEarthFiniteNumber(degrees)) {
    return Number.NaN;
  }

  let normalized =
    (
      (
        degrees + 180
      ) %
      360 +
      360
    ) %
    360 -
    180;

  if (
    approximatelyEqualHEarthNumber(
      normalized,
      -180
    )
  ) {
    normalized = 180;
  }

  return normalized;
}


export function normalizeHEarthDegreesUnsigned(
  degrees
) {
  if (!isHEarthFiniteNumber(degrees)) {
    return Number.NaN;
  }

  return (
    (
      degrees %
      360
    ) +
    360
  ) %
  360;
}


export function normalizeHEarthRadiansSigned(
  radians
) {
  if (!isHEarthFiniteNumber(radians)) {
    return Number.NaN;
  }

  const fullTurn =
    2 * Math.PI;

  let normalized =
    (
      (
        radians +
        Math.PI
      ) %
      fullTurn +
      fullTurn
    ) %
    fullTurn -
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
}


export function normalizeHEarthRadiansUnsigned(
  radians
) {
  if (!isHEarthFiniteNumber(radians)) {
    return Number.NaN;
  }

  const fullTurn =
    2 * Math.PI;

  return (
    (
      radians %
      fullTurn
    ) +
    fullTurn
  ) %
  fullTurn;
}


/* ==========================================================================
 * 10 · VECTOR2
 * ========================================================================== */

export function createHEarthVector2(
  x = 0,
  y = 0
) {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(y)
  ) {
    return null;
  }

  return deepFreeze({
    x,
    y
  });
}


export function isHEarthVector2(
  value
) {
  return (
    isPlainObject(value) &&
    isHEarthFiniteNumber(value.x) &&
    isHEarthFiniteNumber(value.y)
  );
}


export function cloneHEarthVector2(
  vector
) {
  if (!isHEarthVector2(vector)) {
    return null;
  }

  return createHEarthVector2(
    vector.x,
    vector.y
  );
}


export function addHEarthVector2(
  left,
  right
) {
  if (
    !isHEarthVector2(left) ||
    !isHEarthVector2(right)
  ) {
    return null;
  }

  return createHEarthVector2(
    left.x + right.x,
    left.y + right.y
  );
}


export function subtractHEarthVector2(
  left,
  right
) {
  if (
    !isHEarthVector2(left) ||
    !isHEarthVector2(right)
  ) {
    return null;
  }

  return createHEarthVector2(
    left.x - right.x,
    left.y - right.y
  );
}


export function scaleHEarthVector2(
  vector,
  scalar
) {
  if (
    !isHEarthVector2(vector) ||
    !isHEarthFiniteNumber(scalar)
  ) {
    return null;
  }

  return createHEarthVector2(
    vector.x * scalar,
    vector.y * scalar
  );
}


export function dotHEarthVector2(
  left,
  right
) {
  if (
    !isHEarthVector2(left) ||
    !isHEarthVector2(right)
  ) {
    return Number.NaN;
  }

  const result =
    left.x * right.x +
    left.y * right.y;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function getHEarthVector2LengthSquared(
  vector
) {
  return dotHEarthVector2(
    vector,
    vector
  );
}


export function getHEarthVector2Length(
  vector
) {
  if (!isHEarthVector2(vector)) {
    return Number.NaN;
  }

  const result =
    Math.hypot(
      vector.x,
      vector.y
    );

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function getHEarthVector2DistanceSquared(
  left,
  right
) {
  const delta =
    subtractHEarthVector2(
      left,
      right
    );

  return delta
    ? getHEarthVector2LengthSquared(
        delta
      )
    : Number.NaN;
}


export function getHEarthVector2Distance(
  left,
  right
) {
  const squared =
    getHEarthVector2DistanceSquared(
      left,
      right
    );

  return isHEarthNonNegativeFiniteNumber(
    squared
  )
    ? Math.sqrt(squared)
    : Number.NaN;
}


export function normalizeHEarthVector2(
  vector,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) {
  if (
    !isHEarthVector2(vector) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR2_NORMALIZATION_INVALID_INPUT',
            'ERROR',
            'Vector2 normalization requires a finite Vector2 and a nonnegative finite tolerance.',
            {
              vector,
              tolerance
            }
          )
        ])
    });
  }

  const length =
    getHEarthVector2Length(
      vector
    );

  if (
    !isHEarthFiniteNumber(length) ||
    length <= tolerance
  ) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length:
        isHEarthFiniteNumber(length)
          ? length
          : null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR2_NORMALIZATION_ZERO_OR_INVALID_LENGTH',
            'ERROR',
            'Vector2 length is nonfinite or at or below normalization tolerance.',
            {
              vector,
              length,
              tolerance
            }
          )
        ])
    });
  }

  const normalized =
    scaleHEarthVector2(
      vector,
      1 / length
    );

  if (!isHEarthVector2(normalized)) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR2_NORMALIZATION_NONFINITE_RESULT',
            'ERROR',
            'Vector2 normalization produced a nonfinite result.',
            {
              vector,
              length
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    vector:
      normalized,

    length,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 11 · VECTOR3
 * ========================================================================== */

export function createHEarthVector3(
  x = 0,
  y = 0,
  z = 0
) {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(y) ||
    !isHEarthFiniteNumber(z)
  ) {
    return null;
  }

  return deepFreeze({
    x,
    y,
    z
  });
}


export function isHEarthVector3(
  value
) {
  return (
    isPlainObject(value) &&
    isHEarthFiniteNumber(value.x) &&
    isHEarthFiniteNumber(value.y) &&
    isHEarthFiniteNumber(value.z)
  );
}


export function cloneHEarthVector3(
  vector
) {
  if (!isHEarthVector3(vector)) {
    return null;
  }

  return createHEarthVector3(
    vector.x,
    vector.y,
    vector.z
  );
}


export function addHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
  );
}


export function subtractHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );
}


export function multiplyHEarthVector3Components(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    left.x * right.x,
    left.y * right.y,
    left.z * right.z
  );
}


export function scaleHEarthVector3(
  vector,
  scalar
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthFiniteNumber(scalar)
  ) {
    return null;
  }

  return createHEarthVector3(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );
}


export function divideHEarthVector3(
  vector,
  scalar,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .scalarAbsoluteEpsilon
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthFiniteNumber(scalar) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    ) ||
    Math.abs(scalar) <= tolerance
  ) {
    return null;
  }

  return createHEarthVector3(
    vector.x / scalar,
    vector.y / scalar,
    vector.z / scalar
  );
}


export function dotHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return Number.NaN;
  }

  const result =
    left.x * right.x +
    left.y * right.y +
    left.z * right.z;

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function crossHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );
}


export function getHEarthVector3LengthSquared(
  vector
) {
  return dotHEarthVector3(
    vector,
    vector
  );
}


export function getHEarthVector3Length(
  vector
) {
  if (!isHEarthVector3(vector)) {
    return Number.NaN;
  }

  const result =
    Math.hypot(
      vector.x,
      vector.y,
      vector.z
    );

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


export function getHEarthVector3DistanceSquared(
  left,
  right
) {
  const delta =
    subtractHEarthVector3(
      left,
      right
    );

  return delta
    ? getHEarthVector3LengthSquared(
        delta
      )
    : Number.NaN;
}


export function getHEarthVector3Distance(
  left,
  right
) {
  const squared =
    getHEarthVector3DistanceSquared(
      left,
      right
    );

  return isHEarthNonNegativeFiniteNumber(
    squared
  )
    ? Math.sqrt(squared)
    : Number.NaN;
}


export function normalizeHEarthVector3(
  vector,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR3_NORMALIZATION_INVALID_INPUT',
            'ERROR',
            'Vector3 normalization requires a finite Vector3 and a nonnegative finite tolerance.',
            {
              vector,
              tolerance
            }
          )
        ])
    });
  }

  const length =
    getHEarthVector3Length(
      vector
    );

  if (
    !isHEarthFiniteNumber(length) ||
    length <= tolerance
  ) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length:
        isHEarthFiniteNumber(length)
          ? length
          : null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR3_NORMALIZATION_ZERO_OR_INVALID_LENGTH',
            'ERROR',
            'Vector3 length is nonfinite or at or below normalization tolerance.',
            {
              vector,
              length,
              tolerance
            }
          )
        ])
    });
  }

  const normalized =
    scaleHEarthVector3(
      vector,
      1 / length
    );

  if (!isHEarthVector3(normalized)) {
    return deepFreeze({
      valid:
        false,

      vector:
        null,

      length,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'VECTOR3_NORMALIZATION_NONFINITE_RESULT',
            'ERROR',
            'Vector3 normalization produced a nonfinite result.',
            {
              vector,
              length
            }
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    vector:
      normalized,

    length,

    issues:
      deepFreeze([])
  });
}


export function lerpHEarthVector3(
  start,
  end,
  amount
) {
  if (
    !isHEarthVector3(start) ||
    !isHEarthVector3(end) ||
    !isHEarthFiniteNumber(amount)
  ) {
    return null;
  }

  return createHEarthVector3(
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
}


export function minimumHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    Math.min(left.x, right.x),
    Math.min(left.y, right.y),
    Math.min(left.z, right.z)
  );
}


export function maximumHEarthVector3(
  left,
  right
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right)
  ) {
    return null;
  }

  return createHEarthVector3(
    Math.max(left.x, right.x),
    Math.max(left.y, right.y),
    Math.max(left.z, right.z)
  );
}


export function projectHEarthVector3(
  vector,
  onto,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthVector3(onto) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return null;
  }

  const denominator =
    dotHEarthVector3(
      onto,
      onto
    );

  const toleranceSquared =
    tolerance ** 2;

  if (
    !isHEarthFiniteNumber(denominator) ||
    !isHEarthFiniteNumber(
      toleranceSquared
    ) ||
    denominator <=
      toleranceSquared
  ) {
    return null;
  }

  const numerator =
    dotHEarthVector3(
      vector,
      onto
    );

  if (!isHEarthFiniteNumber(numerator)) {
    return null;
  }

  return scaleHEarthVector3(
    onto,
    numerator /
      denominator
  );
}


export function projectHEarthVector3OntoPlane(
  vector,
  planeNormal,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthVector3(planeNormal) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return null;
  }

  const normalProjection =
    projectHEarthVector3(
      vector,
      planeNormal,
      tolerance
    );

  if (!normalProjection) {
    return null;
  }

  return subtractHEarthVector3(
    vector,
    normalProjection
  );
}


export function reflectHEarthVector3(
  vector,
  normal,
  tolerance =
    H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
      .lengthAbsoluteEpsilon
) {
  if (
    !isHEarthVector3(vector) ||
    !isHEarthVector3(normal) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return null;
  }

  const normalized =
    normalizeHEarthVector3(
      normal,
      tolerance
    );

  if (!normalized.valid) {
    return null;
  }

  const scale =
    2 *
    dotHEarthVector3(
      vector,
      normalized.vector
    );

  if (!isHEarthFiniteNumber(scale)) {
    return null;
  }

  return subtractHEarthVector3(
    vector,
    scaleHEarthVector3(
      normalized.vector,
      scale
    )
  );
}


export function approximatelyEqualHEarthVector3(
  left,
  right,
  toleranceContext =
    deriveHEarthGeometryToleranceContext()
) {
  if (
    !isHEarthVector3(left) ||
    !isHEarthVector3(right) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return false;
  }

  const distance =
    getHEarthVector3Distance(
      left,
      right
    );

  return (
    isHEarthFiniteNumber(distance) &&
    distance <=
      toleranceContext.positionTolerance
  );
}


/* ==========================================================================
 * 12 · VECTOR4
 * ========================================================================== */

export function createHEarthVector4(
  x = 0,
  y = 0,
  z = 0,
  w = 0
) {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(y) ||
    !isHEarthFiniteNumber(z) ||
    !isHEarthFiniteNumber(w)
  ) {
    return null;
  }

  return deepFreeze({
    x,
    y,
    z,
    w
  });
}


export function isHEarthVector4(
  value
) {
  return (
    isPlainObject(value) &&
    isHEarthFiniteNumber(value.x) &&
    isHEarthFiniteNumber(value.y) &&
    isHEarthFiniteNumber(value.z) &&
    isHEarthFiniteNumber(value.w)
  );
}


export function cloneHEarthVector4(
  vector
) {
  if (!isHEarthVector4(vector)) {
    return null;
  }

  return createHEarthVector4(
    vector.x,
    vector.y,
    vector.z,
    vector.w
  );
}


/* ==========================================================================
 * 13 · MATRIX4 CONSTRUCTION
 * ========================================================================== */

const H_EARTH_IDENTITY_MATRIX4_ENTRIES = deepFreeze([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]);


export function createHEarthMatrix4(
  entries =
    H_EARTH_IDENTITY_MATRIX4_ENTRIES
) {
  if (
    !Array.isArray(entries) ||
    entries.length !== 16 ||
    !entries.every(
      isHEarthFiniteNumber
    )
  ) {
    return null;
  }

  return deepFreeze({
    type:
      'MATRIX4',

    logicalStorage:
      'ROW_MAJOR',

    vectorConvention:
      'COLUMN_VECTOR',

    entries:
      deepFreeze(
        entries.slice()
      )
  });
}


export function createHEarthIdentityMatrix4() {
  return createHEarthMatrix4(
    H_EARTH_IDENTITY_MATRIX4_ENTRIES
  );
}


export function isHEarthMatrix4(
  matrix
) {
  return (
    isPlainObject(matrix) &&
    matrix.type === 'MATRIX4' &&
    matrix.logicalStorage ===
      'ROW_MAJOR' &&
    matrix.vectorConvention ===
      'COLUMN_VECTOR' &&
    Array.isArray(matrix.entries) &&
    matrix.entries.length === 16 &&
    matrix.entries.every(
      isHEarthFiniteNumber
    )
  );
}


export function cloneHEarthMatrix4(
  matrix
) {
  if (!isHEarthMatrix4(matrix)) {
    return null;
  }

  return createHEarthMatrix4(
    matrix.entries
  );
}


function getMatrixEntry(
  matrix,
  row,
  column
) {
  return matrix.entries[
    row * 4 +
    column
  ];
}


export function createHEarthTranslationMatrix(
  x = 0,
  y = 0,
  z = 0
) {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(y) ||
    !isHEarthFiniteNumber(z)
  ) {
    return null;
  }

  return createHEarthMatrix4([
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ]);
}


export function createHEarthScaleMatrix(
  x = 1,
  y = x,
  z = x
) {
  if (
    !isHEarthFiniteNumber(x) ||
    !isHEarthFiniteNumber(y) ||
    !isHEarthFiniteNumber(z)
  ) {
    return null;
  }

  return createHEarthMatrix4([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ]);
}


function resolveHEarthAngleRadians(
  angle,
  unit
) {
  if (!isHEarthFiniteNumber(angle)) {
    return Number.NaN;
  }

  if (
    unit ===
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS
  ) {
    return angle;
  }

  if (
    unit ===
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.DEGREES
  ) {
    return degreesToHEarthRadians(
      angle
    );
  }

  return Number.NaN;
}


export function createHEarthRotationXMatrix(
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS
) {
  const radians =
    resolveHEarthAngleRadians(
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

  if (
    !isHEarthFiniteNumber(cosine) ||
    !isHEarthFiniteNumber(sine)
  ) {
    return null;
  }

  return createHEarthMatrix4([
    1, 0, 0, 0,
    0, cosine, -sine, 0,
    0, sine, cosine, 0,
    0, 0, 0, 1
  ]);
}


export function createHEarthRotationYMatrix(
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS
) {
  const radians =
    resolveHEarthAngleRadians(
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

  if (
    !isHEarthFiniteNumber(cosine) ||
    !isHEarthFiniteNumber(sine)
  ) {
    return null;
  }

  return createHEarthMatrix4([
    cosine, 0, sine, 0,
    0, 1, 0, 0,
    -sine, 0, cosine, 0,
    0, 0, 0, 1
  ]);
}


export function createHEarthRotationZMatrix(
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS
) {
  const radians =
    resolveHEarthAngleRadians(
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

  if (
    !isHEarthFiniteNumber(cosine) ||
    !isHEarthFiniteNumber(sine)
  ) {
    return null;
  }

  return createHEarthMatrix4([
    cosine, -sine, 0, 0,
    sine, cosine, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}


export function createHEarthAxisAngleRotationMatrix({
  axis,
  angle,
  unit =
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS
} = {}) {
  if (
    !isHEarthVector3(axis) ||
    !isHEarthFiniteNumber(angle)
  ) {
    return null;
  }

  const normalizedAxis =
    normalizeHEarthVector3(axis);

  const radians =
    resolveHEarthAngleRadians(
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

  if (
    !isHEarthFiniteNumber(cosine) ||
    !isHEarthFiniteNumber(sine) ||
    !isHEarthFiniteNumber(
      oneMinusCosine
    )
  ) {
    return null;
  }

  return createHEarthMatrix4([
    cosine +
      x * x *
      oneMinusCosine,

    x * y *
      oneMinusCosine -
      z * sine,

    x * z *
      oneMinusCosine +
      y * sine,

    0,

    y * x *
      oneMinusCosine +
      z * sine,

    cosine +
      y * y *
      oneMinusCosine,

    y * z *
      oneMinusCosine -
      x * sine,

    0,

    z * x *
      oneMinusCosine -
      y * sine,

    z * y *
      oneMinusCosine +
      x * sine,

    cosine +
      z * z *
      oneMinusCosine,

    0,

    0, 0, 0, 1
  ]);
}


/* ==========================================================================
 * 14 · MATRIX4 OPERATIONS
 * ========================================================================== */

export function multiplyHEarthMatrix4(
  left,
  right
) {
  if (
    !isHEarthMatrix4(left) ||
    !isHEarthMatrix4(right)
  ) {
    return null;
  }

  const result =
    new Array(16)
      .fill(0);

  for (
    let row = 0;
    row < 4;
    row += 1
  ) {
    for (
      let column = 0;
      column < 4;
      column += 1
    ) {
      let sum = 0;

      for (
        let index = 0;
        index < 4;
        index += 1
      ) {
        sum +=
          getMatrixEntry(
            left,
            row,
            index
          ) *
          getMatrixEntry(
            right,
            index,
            column
          );
      }

      if (!isHEarthFiniteNumber(sum)) {
        return null;
      }

      result[
        row * 4 +
        column
      ] = sum;
    }
  }

  return createHEarthMatrix4(result);
}


export function transposeHEarthMatrix4(
  matrix
) {
  if (!isHEarthMatrix4(matrix)) {
    return null;
  }

  const result =
    new Array(16);

  for (
    let row = 0;
    row < 4;
    row += 1
  ) {
    for (
      let column = 0;
      column < 4;
      column += 1
    ) {
      result[
        row * 4 +
        column
      ] =
        getMatrixEntry(
          matrix,
          column,
          row
        );
    }
  }

  return createHEarthMatrix4(result);
}


export function getHEarthMatrixLinearColumns(
  matrix
) {
  if (!isHEarthMatrix4(matrix)) {
    return null;
  }

  return deepFreeze({
    x:
      createHEarthVector3(
        getMatrixEntry(matrix, 0, 0),
        getMatrixEntry(matrix, 1, 0),
        getMatrixEntry(matrix, 2, 0)
      ),

    y:
      createHEarthVector3(
        getMatrixEntry(matrix, 0, 1),
        getMatrixEntry(matrix, 1, 1),
        getMatrixEntry(matrix, 2, 1)
      ),

    z:
      createHEarthVector3(
        getMatrixEntry(matrix, 0, 2),
        getMatrixEntry(matrix, 1, 2),
        getMatrixEntry(matrix, 2, 2)
      )
  });
}


export function determinantHEarthMatrix3Linear(
  matrix
) {
  if (!isHEarthMatrix4(matrix)) {
    return Number.NaN;
  }

  const a =
    getMatrixEntry(matrix, 0, 0);

  const b =
    getMatrixEntry(matrix, 0, 1);

  const c =
    getMatrixEntry(matrix, 0, 2);

  const d =
    getMatrixEntry(matrix, 1, 0);

  const e =
    getMatrixEntry(matrix, 1, 1);

  const f =
    getMatrixEntry(matrix, 1, 2);

  const g =
    getMatrixEntry(matrix, 2, 0);

  const h =
    getMatrixEntry(matrix, 2, 1);

  const i =
    getMatrixEntry(matrix, 2, 2);

  const determinant =
    a *
      (
        e * i -
        f * h
      ) -
    b *
      (
        d * i -
        f * g
      ) +
    c *
      (
        d * h -
        e * g
      );

  return isHEarthFiniteNumber(
    determinant
  )
    ? determinant
    : Number.NaN;
}


export function composeHEarthWorldTransform({
  translation =
    createHEarthVector3(0, 0, 0),

  rotationX =
    0,

  rotationY =
    0,

  rotationZ =
    0,

  rotationUnit =
    H_EARTH_3D_GEOMETRY_NORTH_ENUMS
      .angleUnit.RADIANS,

  scale =
    createHEarthVector3(1, 1, 1)
} = {}) {
  if (
    !isHEarthVector3(translation) ||
    !isHEarthVector3(scale) ||
    !isHEarthFiniteNumber(rotationX) ||
    !isHEarthFiniteNumber(rotationY) ||
    !isHEarthFiniteNumber(rotationZ)
  ) {
    return null;
  }

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
    !translationMatrix ||
    !rotationXMatrix ||
    !rotationYMatrix ||
    !rotationZMatrix ||
    !scaleMatrix
  ) {
    return null;
  }

  const rotationXScale =
    multiplyHEarthMatrix4(
      rotationXMatrix,
      scaleMatrix
    );

  const rotationYXScale =
    rotationXScale
      ? multiplyHEarthMatrix4(
          rotationYMatrix,
          rotationXScale
        )
      : null;

  const rotationZYXScale =
    rotationYXScale
      ? multiplyHEarthMatrix4(
          rotationZMatrix,
          rotationYXScale
        )
      : null;

  return rotationZYXScale
    ? multiplyHEarthMatrix4(
        translationMatrix,
        rotationZYXScale
      )
    : null;
}


/* ==========================================================================
 * 15 · AFFINE MATRIX VALIDATION
 * ========================================================================== */

function getHEarthDefaultToleranceContext() {
  return deriveHEarthGeometryToleranceContext();
}


function isHEarthAffineBottomRow(
  matrix,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return false;
  }

  return (
    approximatelyEqualHEarthNumber(
      getMatrixEntry(matrix, 3, 0),
      0,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      getMatrixEntry(matrix, 3, 1),
      0,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      getMatrixEntry(matrix, 3, 2),
      0,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      getMatrixEntry(matrix, 3, 3),
      1,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    )
  );
}


/* ==========================================================================
 * 16 · MATRIX TRANSFORMATION
 * ========================================================================== */

export function transformHEarthVector4(
  matrix,
  vector
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthVector4(vector)
  ) {
    return null;
  }

  return createHEarthVector4(
    getMatrixEntry(matrix, 0, 0) *
      vector.x +
    getMatrixEntry(matrix, 0, 1) *
      vector.y +
    getMatrixEntry(matrix, 0, 2) *
      vector.z +
    getMatrixEntry(matrix, 0, 3) *
      vector.w,

    getMatrixEntry(matrix, 1, 0) *
      vector.x +
    getMatrixEntry(matrix, 1, 1) *
      vector.y +
    getMatrixEntry(matrix, 1, 2) *
      vector.z +
    getMatrixEntry(matrix, 1, 3) *
      vector.w,

    getMatrixEntry(matrix, 2, 0) *
      vector.x +
    getMatrixEntry(matrix, 2, 1) *
      vector.y +
    getMatrixEntry(matrix, 2, 2) *
      vector.z +
    getMatrixEntry(matrix, 2, 3) *
      vector.w,

    getMatrixEntry(matrix, 3, 0) *
      vector.x +
    getMatrixEntry(matrix, 3, 1) *
      vector.y +
    getMatrixEntry(matrix, 3, 2) *
      vector.z +
    getMatrixEntry(matrix, 3, 3) *
      vector.w
  );
}


export function transformHEarthPosition3(
  matrix,
  position,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthVector3(position) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    ) ||
    !isHEarthAffineBottomRow(
      matrix,
      toleranceContext
    )
  ) {
    return null;
  }

  const homogeneousPosition =
    createHEarthVector4(
      position.x,
      position.y,
      position.z,
      1
    );

  const transformed =
    transformHEarthVector4(
      matrix,
      homogeneousPosition
    );

  if (
    !isHEarthVector4(transformed) ||
    !approximatelyEqualHEarthNumber(
      transformed.w,
      1,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    )
  ) {
    return null;
  }

  return createHEarthVector3(
    transformed.x,
    transformed.y,
    transformed.z
  );
}


export function transformHEarthDirection3(
  matrix,
  direction,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthVector3(direction) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    ) ||
    !isHEarthAffineBottomRow(
      matrix,
      toleranceContext
    )
  ) {
    return null;
  }

  const homogeneousDirection =
    createHEarthVector4(
      direction.x,
      direction.y,
      direction.z,
      0
    );

  const transformed =
    transformHEarthVector4(
      matrix,
      homogeneousDirection
    );

  if (
    !isHEarthVector4(transformed) ||
    !approximatelyEqualHEarthNumber(
      transformed.w,
      0,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    )
  ) {
    return null;
  }

  return createHEarthVector3(
    transformed.x,
    transformed.y,
    transformed.z
  );
}


export const transformHEarthVector3 =
  transformHEarthPosition3;


/* ==========================================================================
 * 17 · TRANSFORM CLASSIFICATION
 * ========================================================================== */

export function classifyHEarthTransform(
  matrix,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant:
        null,

      determinantTolerance:
        null,

      linearScale:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_OR_TOLERANCE_CONTEXT_INVALID',
            'ERROR',
            'Transform classification requires a finite Matrix4 and a valid tolerance context.'
          )
        ])
    });
  }

  if (
    !isHEarthAffineBottomRow(
      matrix,
      toleranceContext
    )
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant:
        null,

      determinantTolerance:
        null,

      linearScale:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_AFFINE_BOTTOM_ROW_INVALID',
            'ERROR',
            'Projective or malformed matrices are outside the North affine contract.',
            {
              bottomRow: [
                getMatrixEntry(matrix, 3, 0),
                getMatrixEntry(matrix, 3, 1),
                getMatrixEntry(matrix, 3, 2),
                getMatrixEntry(matrix, 3, 3)
              ]
            }
          )
        ])
    });
  }

  const columns =
    getHEarthMatrixLinearColumns(
      matrix
    );

  if (
    !columns ||
    !isHEarthVector3(columns.x) ||
    !isHEarthVector3(columns.y) ||
    !isHEarthVector3(columns.z)
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant:
        null,

      determinantTolerance:
        null,

      linearScale:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_LINEAR_COLUMNS_INVALID',
            'ERROR',
            'Transform linear columns could not be evaluated.'
          )
        ])
    });
  }

  const lengthX =
    getHEarthVector3Length(
      columns.x
    );

  const lengthY =
    getHEarthVector3Length(
      columns.y
    );

  const lengthZ =
    getHEarthVector3Length(
      columns.z
    );

  if (
    !isHEarthFiniteNumber(lengthX) ||
    !isHEarthFiniteNumber(lengthY) ||
    !isHEarthFiniteNumber(lengthZ)
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant:
        null,

      determinantTolerance:
        null,

      linearScale:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_LINEAR_SCALE_INVALID',
            'ERROR',
            'Transform linear scale could not be evaluated.'
          )
        ])
    });
  }

  const linearScale =
    Math.max(
      lengthX,
      lengthY,
      lengthZ,
      1
    );

  const determinant =
    determinantHEarthMatrix3Linear(
      matrix
    );

  const determinantTolerance =
    toleranceContext
      .matrixAbsoluteTolerance +
    toleranceContext
      .matrixRelativeTolerance *
      linearScale ** 3;

  if (
    !isHEarthFiniteNumber(determinant) ||
    !isHEarthNonNegativeFiniteNumber(
      determinantTolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant:
        null,

      determinantTolerance:
        null,

      linearScale,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_DETERMINANT_EVALUATION_INVALID',
            'ERROR',
            'Transform determinant or determinant tolerance is nonfinite.'
          )
        ])
    });
  }

  if (
    Math.abs(determinant) <=
    determinantTolerance
  ) {
    return deepFreeze({
      valid:
        true,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification
          .AFFINE_SINGULAR,

      determinant,

      determinantTolerance,

      linearScale,

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
              toleranceContext
                .matrixAbsoluteTolerance,

            relativeTolerance:
              toleranceContext
                .matrixRelativeTolerance
          }
        )
    );

  if (identityMatch) {
    return deepFreeze({
      valid:
        true,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification
          .IDENTITY,

      determinant,

      determinantTolerance,

      linearScale,

      issues:
        deepFreeze([])
    });
  }

  const dotXY =
    dotHEarthVector3(
      columns.x,
      columns.y
    );

  const dotXZ =
    dotHEarthVector3(
      columns.x,
      columns.z
    );

  const dotYZ =
    dotHEarthVector3(
      columns.y,
      columns.z
    );

  const orthogonalityTolerance =
    toleranceContext
      .matrixAbsoluteTolerance +
    toleranceContext
      .matrixRelativeTolerance *
      linearScale ** 2;

  if (
    !isHEarthFiniteNumber(dotXY) ||
    !isHEarthFiniteNumber(dotXZ) ||
    !isHEarthFiniteNumber(dotYZ) ||
    !isHEarthNonNegativeFiniteNumber(
      orthogonalityTolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      determinant,

      determinantTolerance,

      linearScale,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_ORTHOGONALITY_EVALUATION_INVALID',
            'ERROR',
            'Transform orthogonality evaluation produced nonfinite values.'
          )
        ])
    });
  }

  const pairwiseOrthogonal =
    Math.abs(dotXY) <=
      orthogonalityTolerance &&
    Math.abs(dotXZ) <=
      orthogonalityTolerance &&
    Math.abs(dotYZ) <=
      orthogonalityTolerance;

  const unitLengths =
    approximatelyEqualHEarthNumber(
      lengthX,
      1,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      lengthY,
      1,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      lengthZ,
      1,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    );

  if (
    pairwiseOrthogonal &&
    unitLengths &&
    approximatelyEqualHEarthNumber(
      determinant,
      1,
      {
        absoluteTolerance:
          determinantTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    )
  ) {
    return deepFreeze({
      valid:
        true,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification
          .RIGID,

      determinant,

      determinantTolerance,

      linearScale,

      issues:
        deepFreeze([])
    });
  }

  const uniformScale =
    approximatelyEqualHEarthNumber(
      lengthX,
      lengthY,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    ) &&
    approximatelyEqualHEarthNumber(
      lengthY,
      lengthZ,
      {
        absoluteTolerance:
          toleranceContext
            .matrixAbsoluteTolerance,

        relativeTolerance:
          toleranceContext
            .matrixRelativeTolerance
      }
    );

  if (
    pairwiseOrthogonal &&
    uniformScale &&
    lengthX >
      toleranceContext
        .lengthTolerance
  ) {
    return deepFreeze({
      valid:
        true,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification
          .UNIFORM_SCALE,

      determinant,

      determinantTolerance,

      linearScale,

      uniformScaleMagnitude:
        lengthX,

      issues:
        deepFreeze([])
    });
  }

  return deepFreeze({
    valid:
      true,

    classification:
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification
        .AFFINE_INVERTIBLE,

    determinant,

    determinantTolerance,

    linearScale,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 18 · AFFINE INVERSION AND RESIDUAL
 * ========================================================================== */

export function evaluateHEarthMatrixResidual(
  left,
  right,
  expected =
    createHEarthIdentityMatrix4()
) {
  if (
    !isHEarthMatrix4(left) ||
    !isHEarthMatrix4(right) ||
    !isHEarthMatrix4(expected)
  ) {
    return deepFreeze({
      valid:
        false,

      residual:
        null,

      product:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_RESIDUAL_INVALID_INPUT',
            'ERROR',
            'Matrix residual evaluation requires finite Matrix4 inputs.'
          )
        ])
    });
  }

  const product =
    multiplyHEarthMatrix4(
      left,
      right
    );

  if (!isHEarthMatrix4(product)) {
    return deepFreeze({
      valid:
        false,

      residual:
        null,

      product:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_RESIDUAL_PRODUCT_INVALID',
            'ERROR',
            'Matrix residual product could not be evaluated.'
          )
        ])
    });
  }

  const residual =
    Math.max(
      ...product.entries.map(
        (entry, index) =>
          Math.abs(
            entry -
            expected.entries[index]
          )
      )
    );

  if (!isHEarthNonNegativeFiniteNumber(residual)) {
    return deepFreeze({
      valid:
        false,

      residual:
        null,

      product,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_RESIDUAL_NONFINITE',
            'ERROR',
            'Matrix residual evaluation produced a nonfinite value.'
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    residual,

    product,

    issues:
      deepFreeze([])
  });
}


export function invertHEarthMatrix4(
  matrix,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_INVALID_INPUT',
            'ERROR',
            'Affine inversion requires a finite Matrix4 and a valid tolerance context.'
          )
        ])
    });
  }

  const classification =
    classifyHEarthTransform(
      matrix,
      toleranceContext
    );

  if (
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification.INVALID ||
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification
        .AFFINE_SINGULAR
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        classification.issues
    });
  }

  const a =
    getMatrixEntry(matrix, 0, 0);

  const b =
    getMatrixEntry(matrix, 0, 1);

  const c =
    getMatrixEntry(matrix, 0, 2);

  const d =
    getMatrixEntry(matrix, 1, 0);

  const e =
    getMatrixEntry(matrix, 1, 1);

  const f =
    getMatrixEntry(matrix, 1, 2);

  const g =
    getMatrixEntry(matrix, 2, 0);

  const h =
    getMatrixEntry(matrix, 2, 1);

  const i =
    getMatrixEntry(matrix, 2, 2);

  const determinant =
    determinantHEarthMatrix3Linear(
      matrix
    );

  if (
    !isHEarthFiniteNumber(determinant) ||
    Math.abs(determinant) <=
      classification
        .determinantTolerance
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification
          .AFFINE_SINGULAR,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_DETERMINANT_INVALID',
            'ERROR',
            'Affine inversion determinant is nonfinite or below the admitted tolerance.',
            {
              determinant,

              determinantTolerance:
                classification
                  .determinantTolerance
            }
          )
        ])
    });
  }

  const inverseDeterminant =
    1 / determinant;

  if (
    !isHEarthFiniteNumber(
      inverseDeterminant
    )
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_RECIPROCAL_NONFINITE',
            'ERROR',
            'Affine inversion produced a nonfinite reciprocal determinant.'
          )
        ])
    });
  }

  const inverse00 =
    (
      e * i -
      f * h
    ) *
    inverseDeterminant;

  const inverse01 =
    (
      c * h -
      b * i
    ) *
    inverseDeterminant;

  const inverse02 =
    (
      b * f -
      c * e
    ) *
    inverseDeterminant;

  const inverse10 =
    (
      f * g -
      d * i
    ) *
    inverseDeterminant;

  const inverse11 =
    (
      a * i -
      c * g
    ) *
    inverseDeterminant;

  const inverse12 =
    (
      c * d -
      a * f
    ) *
    inverseDeterminant;

  const inverse20 =
    (
      d * h -
      e * g
    ) *
    inverseDeterminant;

  const inverse21 =
    (
      b * g -
      a * h
    ) *
    inverseDeterminant;

  const inverse22 =
    (
      a * e -
      b * d
    ) *
    inverseDeterminant;

  const translation =
    createHEarthVector3(
      getMatrixEntry(matrix, 0, 3),
      getMatrixEntry(matrix, 1, 3),
      getMatrixEntry(matrix, 2, 3)
    );

  if (!translation) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_TRANSLATION_INVALID',
            'ERROR',
            'Affine translation could not be evaluated during inversion.'
          )
        ])
    });
  }

  const inverseTranslation =
    createHEarthVector3(
      -(
        inverse00 *
          translation.x +
        inverse01 *
          translation.y +
        inverse02 *
          translation.z
      ),

      -(
        inverse10 *
          translation.x +
        inverse11 *
          translation.y +
        inverse12 *
          translation.z
      ),

      -(
        inverse20 *
          translation.x +
        inverse21 *
          translation.y +
        inverse22 *
          translation.z
      )
    );

  if (!inverseTranslation) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_TRANSLATION_RESULT_NONFINITE',
            'ERROR',
            'Affine inverse translation produced a nonfinite result.'
          )
        ])
    });
  }

  const inverse =
    createHEarthMatrix4([
      inverse00,
      inverse01,
      inverse02,
      inverseTranslation.x,

      inverse10,
      inverse11,
      inverse12,
      inverseTranslation.y,

      inverse20,
      inverse21,
      inverse22,
      inverseTranslation.z,

      0, 0, 0, 1
    ]);

  if (!inverse) {
    return deepFreeze({
      valid:
        false,

      matrix:
        null,

      classification:
        classification.classification,

      leftResidual:
        null,

      rightResidual:
        null,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_RESULT_INVALID',
            'ERROR',
            'Affine inversion produced a nonfinite Matrix4.'
          )
        ])
    });
  }

  const leftResidualEvaluation =
    evaluateHEarthMatrixResidual(
      matrix,
      inverse
    );

  const rightResidualEvaluation =
    evaluateHEarthMatrixResidual(
      inverse,
      matrix
    );

  const leftResidual =
    leftResidualEvaluation.valid
      ? leftResidualEvaluation.residual
      : null;

  const rightResidual =
    rightResidualEvaluation.valid
      ? rightResidualEvaluation.residual
      : null;

  if (
    !leftResidualEvaluation.valid ||
    !rightResidualEvaluation.valid ||
    leftResidual >
      toleranceContext
        .matrixResidualTolerance ||
    rightResidual >
      toleranceContext
        .matrixResidualTolerance
  ) {
    return deepFreeze({
      valid:
        false,

      matrix:
        inverse,

      classification:
        classification.classification,

      leftResidual,

      rightResidual,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'MATRIX_INVERSION_RESIDUAL_TOO_LARGE',
            'ERROR',
            'Affine inversion left or right residual exceeded the admitted tolerance.',
            {
              leftResidual,
              rightResidual,

              matrixResidualTolerance:
                toleranceContext
                  .matrixResidualTolerance
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

    leftResidual,

    rightResidual,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 19 · INVERSE-TRANSPOSE NORMAL TRANSFORMATION
 * ========================================================================== */

export function transformHEarthNormal3(
  matrix,
  normal,
  toleranceContext =
    getHEarthDefaultToleranceContext()
) {
  if (
    !isHEarthMatrix4(matrix) ||
    !isHEarthVector3(normal) ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      classification:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .transformClassification.INVALID,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'NORMAL_TRANSFORM_INVALID_INPUT',
            'ERROR',
            'Normal transformation requires a finite Matrix4, finite Vector3, and valid tolerance context.'
          )
        ])
    });
  }

  const classification =
    classifyHEarthTransform(
      matrix,
      toleranceContext
    );

  if (
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification.INVALID ||
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification
        .AFFINE_SINGULAR
  ) {
    return deepFreeze({
      valid:
        false,

      normal:
        null,

      classification:
        classification.classification,

      issues:
        classification.issues
    });
  }

  if (
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification.IDENTITY ||
    classification.classification ===
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .transformClassification.RIGID
  ) {
    const transformed =
      transformHEarthDirection3(
        matrix,
        normal,
        toleranceContext
      );

    const normalized =
      normalizeHEarthVector3(
        transformed,
        toleranceContext
          .normalLengthTolerance
      );

    return deepFreeze({
      valid:
        normalized.valid,

      normal:
        normalized.valid
          ? normalized.vector
          : null,

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
      normal,
      toleranceContext
    );

  const normalized =
    normalizeHEarthVector3(
      transformed,
      toleranceContext
        .normalLengthTolerance
    );

  return deepFreeze({
    valid:
      normalized.valid,

    normal:
      normalized.valid
        ? normalized.vector
        : null,

    classification:
      classification.classification,

    issues:
      normalized.issues
  });
}


/* ==========================================================================
 * 20 · AABB STRUCTURAL RECOGNITION
 * ========================================================================== */

export function createHEarthEmptyBounds() {
  return deepFreeze({
    type:
      'AABB_3D',

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

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
      true
  });
}


export function isHEarthAABB3DShape(
  bounds
) {
  if (
    !isPlainObject(bounds) ||
    bounds.type !== 'AABB_3D' ||
    bounds.coordinateFrame !==
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME ||
    typeof bounds.empty !== 'boolean' ||
    bounds.finite !== true
  ) {
    return false;
  }

  if (bounds.empty === true) {
    return (
      bounds.minimum === null &&
      bounds.maximum === null &&
      bounds.center === null &&
      bounds.size === null &&
      bounds.halfExtent === null &&
      isHEarthFiniteNumber(
        bounds.diagonalLength
      )
    );
  }

  return (
    isHEarthVector3(bounds.minimum) &&
    isHEarthVector3(bounds.maximum) &&
    isHEarthVector3(bounds.center) &&
    isHEarthVector3(bounds.size) &&
    isHEarthVector3(bounds.halfExtent) &&
    isHEarthFiniteNumber(
      bounds.diagonalLength
    )
  );
}


function resolveHEarthUnaryBoundsToleranceContext(
  bounds,
  explicitContext
) {
  if (explicitContext !== undefined) {
    return isHEarthGeometryToleranceContext(
      explicitContext
    )
      ? explicitContext
      : null;
  }

  return deriveHEarthGeometryToleranceContext(
    bounds
  );
}


function resolveHEarthBinaryBoundsToleranceContext(
  left,
  right,
  explicitContext
) {
  if (explicitContext !== undefined) {
    return isHEarthGeometryToleranceContext(
      explicitContext
    )
      ? explicitContext
      : null;
  }

  const leftScale =
    deriveBoundsScale(left);

  const rightScale =
    deriveBoundsScale(right);

  if (
    !isHEarthPositiveFiniteNumber(
      leftScale
    ) ||
    !isHEarthPositiveFiniteNumber(
      rightScale
    )
  ) {
    return null;
  }

  return deriveHEarthGeometryToleranceContextFromScale(
    Math.max(leftScale, rightScale)
  );
}


function resolveHEarthBoundsListToleranceContext(
  boundsList,
  explicitContext
) {
  if (explicitContext !== undefined) {
    return isHEarthGeometryToleranceContext(
      explicitContext
    )
      ? explicitContext
      : null;
  }

  const scales =
    ensureArray(boundsList)
      .map(deriveBoundsScale);

  if (
    scales.some(
      (scale) =>
        !isHEarthPositiveFiniteNumber(scale)
    )
  ) {
    return null;
  }

  return deriveHEarthGeometryToleranceContextFromScale(
    Math.max(...scales, 1)
  );
}


/* ==========================================================================
 * 21 · AABB MATHEMATICAL VALIDATION
 * ========================================================================== */

export function validateHEarthAABB3D(
  bounds,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthUnaryBoundsToleranceContext(
      bounds,
      toleranceContext
    );

  const issues = [];

  if (
    !isHEarthAABB3DShape(bounds) ||
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_SHAPE_OR_TOLERANCE_INVALID',
        'ERROR',
        'AABB validation requires a structurally recognized AABB and valid tolerance context.'
      )
    );

    return deepFreeze({
      valid:
        false,

      bounds:
        null,

      issues:
        sortHEarthGeometryIssues(
          issues
        )
    });
  }

  const tolerance =
    resolvedToleranceContext
      .positionTolerance;

  if (bounds.empty === true) {
    if (
      bounds.minimum !== null ||
      bounds.maximum !== null ||
      bounds.center !== null ||
      bounds.size !== null ||
      bounds.halfExtent !== null
    ) {
      issues.push(
        createHEarthGeometryIssue(
          'EMPTY_AABB_VECTOR_FIELDS_NOT_NULL',
          'ERROR',
          'An empty AABB must have null vector fields.'
        )
      );
    }

    if (
      !approximatelyEqualHEarthNumber(
        bounds.diagonalLength,
        0,
        {
          absoluteTolerance:
            resolvedToleranceContext
              .lengthTolerance,

          relativeTolerance:
            resolvedToleranceContext
              .scalarRelativeTolerance
        }
      )
    ) {
      issues.push(
        createHEarthGeometryIssue(
          'EMPTY_AABB_DIAGONAL_NOT_ZERO',
          'ERROR',
          'An empty AABB must have zero diagonal length.',
          {
            diagonalLength:
              bounds.diagonalLength
          }
        )
      );
    }

    return deepFreeze({
      valid:
        !hasHEarthBlockingIssues(
          issues
        ),

      bounds,

      issues:
        sortHEarthGeometryIssues(
          issues
        )
    });
  }

  const {
    minimum,
    maximum,
    center,
    size,
    halfExtent,
    diagonalLength
  } = bounds;

  if (
    minimum.x >
      maximum.x + tolerance ||
    minimum.y >
      maximum.y + tolerance ||
    minimum.z >
      maximum.z + tolerance
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_MINIMUM_EXCEEDS_MAXIMUM',
        'ERROR',
        'AABB minimum must not exceed maximum on any axis.',
        {
          minimum,
          maximum,
          tolerance
        }
      )
    );
  }

  if (
    size.x < -tolerance ||
    size.y < -tolerance ||
    size.z < -tolerance
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_SIZE_NEGATIVE',
        'ERROR',
        'AABB size components must be nonnegative.',
        {
          size,
          tolerance
        }
      )
    );
  }

  if (
    halfExtent.x < -tolerance ||
    halfExtent.y < -tolerance ||
    halfExtent.z < -tolerance
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_HALF_EXTENT_NEGATIVE',
        'ERROR',
        'AABB half-extent components must be nonnegative.',
        {
          halfExtent,
          tolerance
        }
      )
    );
  }

  if (diagonalLength < -tolerance) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_DIAGONAL_NEGATIVE',
        'ERROR',
        'AABB diagonal length must be nonnegative.',
        {
          diagonalLength,
          tolerance
        }
      )
    );
  }

  const expectedSize =
    subtractHEarthVector3(
      maximum,
      minimum
    );

  const expectedHalfExtent =
    expectedSize
      ? scaleHEarthVector3(
          expectedSize,
          0.5
        )
      : null;

  const expectedCenter =
    expectedHalfExtent
      ? addHEarthVector3(
          minimum,
          expectedHalfExtent
        )
      : null;

  const expectedDiagonal =
    expectedSize
      ? getHEarthVector3Length(
          expectedSize
        )
      : Number.NaN;

  if (
    !expectedSize ||
    !approximatelyEqualHEarthVector3(
      size,
      expectedSize,
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_SIZE_INCOHERENT',
        'ERROR',
        'AABB size must equal maximum minus minimum.',
        {
          size,
          expectedSize
        }
      )
    );
  }

  if (
    !expectedHalfExtent ||
    !approximatelyEqualHEarthVector3(
      halfExtent,
      expectedHalfExtent,
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_HALF_EXTENT_INCOHERENT',
        'ERROR',
        'AABB half extent must equal size multiplied by one half.',
        {
          halfExtent,
          expectedHalfExtent
        }
      )
    );
  }

  if (
    !expectedCenter ||
    !approximatelyEqualHEarthVector3(
      center,
      expectedCenter,
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_CENTER_INCOHERENT',
        'ERROR',
        'AABB center must equal minimum plus half extent.',
        {
          center,
          expectedCenter
        }
      )
    );
  }

  if (
    !isHEarthFiniteNumber(
      expectedDiagonal
    ) ||
    !approximatelyEqualHEarthNumber(
      diagonalLength,
      expectedDiagonal,
      {
        absoluteTolerance:
          resolvedToleranceContext
            .lengthTolerance,

        relativeTolerance:
          resolvedToleranceContext
            .scalarRelativeTolerance
      }
    )
  ) {
    issues.push(
      createHEarthGeometryIssue(
        'AABB_DIAGONAL_INCOHERENT',
        'ERROR',
        'AABB diagonal length must equal the Euclidean length of size.',
        {
          diagonalLength,
          expectedDiagonal
        }
      )
    );
  }

  return deepFreeze({
    valid:
      !hasHEarthBlockingIssues(
        issues
      ),

    bounds,

    issues:
      sortHEarthGeometryIssues(
        issues
      )
    });
}


export function isHEarthAABB3D(
  bounds,
  toleranceContext
) {
  return validateHEarthAABB3D(
    bounds,
    toleranceContext
  ).valid;
}


/* ==========================================================================
 * 22 · AABB CONSTRUCTION
 * ========================================================================== */

export function createHEarthBoundsFromMinimumMaximum(
  minimum,
  maximum
) {
  if (
    !isHEarthVector3(minimum) ||
    !isHEarthVector3(maximum) ||
    minimum.x > maximum.x ||
    minimum.y > maximum.y ||
    minimum.z > maximum.z
  ) {
    return null;
  }

  const size =
    subtractHEarthVector3(
      maximum,
      minimum
    );

  const halfExtent =
    size
      ? scaleHEarthVector3(
          size,
          0.5
        )
      : null;

  const center =
    halfExtent
      ? addHEarthVector3(
          minimum,
          halfExtent
        )
      : null;

  const diagonalLength =
    size
      ? getHEarthVector3Length(
          size
        )
      : Number.NaN;

  if (
    !size ||
    !halfExtent ||
    !center ||
    !isHEarthNonNegativeFiniteNumber(
      diagonalLength
    )
  ) {
    return null;
  }

  const bounds =
    deepFreeze({
      type:
        'AABB_3D',

      coordinateFrame:
        H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

      minimum:
        cloneHEarthVector3(minimum),

      maximum:
        cloneHEarthVector3(maximum),

      center,

      size,

      halfExtent,

      diagonalLength,

      empty:
        false,

      finite:
        true
    });

  return isHEarthAABB3D(bounds)
    ? bounds
    : null;
}


export function createHEarthGeometryBounds(
  points = []
) {
  const values =
    ensureArray(points);

  if (values.length === 0) {
    return createHEarthEmptyBounds();
  }

  if (
    !values.every(
      isHEarthVector3
    )
  ) {
    return null;
  }

  let minimum =
    cloneHEarthVector3(
      values[0]
    );

  let maximum =
    cloneHEarthVector3(
      values[0]
    );

  for (
    let index = 1;
    index < values.length;
    index += 1
  ) {
    minimum =
      minimumHEarthVector3(
        minimum,
        values[index]
      );

    maximum =
      maximumHEarthVector3(
        maximum,
        values[index]
      );

    if (
      !minimum ||
      !maximum
    ) {
      return null;
    }
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
}


export function expandHEarthBoundsByRadius(
  bounds,
  radius,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthUnaryBoundsToleranceContext(
      bounds,
      toleranceContext
    );

  if (
    !isHEarthAABB3D(
      bounds,
      resolvedToleranceContext
    ) ||
    bounds.empty === true ||
    !isHEarthNonNegativeFiniteNumber(
      radius
    )
  ) {
    return null;
  }

  const extent =
    createHEarthVector3(
      radius,
      radius,
      radius
    );

  if (!extent) {
    return null;
  }

  const minimum =
    subtractHEarthVector3(
      bounds.minimum,
      extent
    );

  const maximum =
    addHEarthVector3(
      bounds.maximum,
      extent
    );

  if (
    !minimum ||
    !maximum
  ) {
    return null;
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
}


export function expandHEarthBoundsByExtent(
  bounds,
  extent,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthUnaryBoundsToleranceContext(
      bounds,
      toleranceContext
    );

  if (
    !isHEarthAABB3D(
      bounds,
      resolvedToleranceContext
    ) ||
    bounds.empty === true ||
    !isHEarthVector3(extent) ||
    extent.x < 0 ||
    extent.y < 0 ||
    extent.z < 0
  ) {
    return null;
  }

  const minimum =
    subtractHEarthVector3(
      bounds.minimum,
      extent
    );

  const maximum =
    addHEarthVector3(
      bounds.maximum,
      extent
    );

  if (
    !minimum ||
    !maximum
  ) {
    return null;
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
}


export function mergeHEarthGeometryBounds(
  boundsList = [],
  toleranceContext
) {
  const values =
    ensureArray(boundsList);

  if (values.length === 0) {
    if (
      toleranceContext !== undefined &&
      !isHEarthGeometryToleranceContext(
        toleranceContext
      )
    ) {
      return null;
    }

    return createHEarthEmptyBounds();
  }

  const resolvedToleranceContext =
    resolveHEarthBoundsListToleranceContext(
      values,
      toleranceContext
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return null;
  }

  if (
    !values.every(
      (bounds) =>
        isHEarthAABB3D(
          bounds,
          resolvedToleranceContext
        )
    )
  ) {
    return null;
  }

  const nonemptyBounds =
    values.filter(
      (bounds) =>
        bounds.empty === false
    );

  if (
    nonemptyBounds.length === 0
  ) {
    return createHEarthEmptyBounds();
  }

  let minimum =
    cloneHEarthVector3(
      nonemptyBounds[0].minimum
    );

  let maximum =
    cloneHEarthVector3(
      nonemptyBounds[0].maximum
    );

  for (
    let index = 1;
    index <
      nonemptyBounds.length;
    index += 1
  ) {
    minimum =
      minimumHEarthVector3(
        minimum,
        nonemptyBounds[index]
          .minimum
      );

    maximum =
      maximumHEarthVector3(
        maximum,
        nonemptyBounds[index]
          .maximum
      );

    if (
      !minimum ||
      !maximum
    ) {
      return null;
    }
  }

  return createHEarthBoundsFromMinimumMaximum(
    minimum,
    maximum
  );
}


/* ==========================================================================
 * 23 · AABB CONTAINMENT AND RELATIONSHIP
 * ========================================================================== */

export function containsHEarthPointInBounds(
  bounds,
  point,
  tolerance = 0,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthUnaryBoundsToleranceContext(
      bounds,
      toleranceContext
    );

  if (
    !isHEarthAABB3D(
      bounds,
      resolvedToleranceContext
    ) ||
    bounds.empty === true ||
    !isHEarthVector3(point) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return false;
  }

  return (
    point.x >=
      bounds.minimum.x -
      tolerance &&
    point.x <=
      bounds.maximum.x +
      tolerance &&
    point.y >=
      bounds.minimum.y -
      tolerance &&
    point.y <=
      bounds.maximum.y +
      tolerance &&
    point.z >=
      bounds.minimum.z -
      tolerance &&
    point.z <=
      bounds.maximum.z +
      tolerance
  );
}


export function containsHEarthBounds(
  outer,
  inner,
  tolerance = 0,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthBinaryBoundsToleranceContext(
      outer,
      inner,
      toleranceContext
    );

  if (
    !isHEarthAABB3D(
      outer,
      resolvedToleranceContext
    ) ||
    !isHEarthAABB3D(
      inner,
      resolvedToleranceContext
    ) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return false;
  }

  if (inner.empty === true) {
    return true;
  }

  if (outer.empty === true) {
    return false;
  }

  return (
    inner.minimum.x >=
      outer.minimum.x -
      tolerance &&
    inner.maximum.x <=
      outer.maximum.x +
      tolerance &&
    inner.minimum.y >=
      outer.minimum.y -
      tolerance &&
    inner.maximum.y <=
      outer.maximum.y +
      tolerance &&
    inner.minimum.z >=
      outer.minimum.z -
      tolerance &&
    inner.maximum.z <=
      outer.maximum.z +
      tolerance
  );
}


export function intersectHEarthBounds(
  left,
  right,
  tolerance = 0,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthBinaryBoundsToleranceContext(
      left,
      right,
      toleranceContext
    );

  if (
    !isHEarthAABB3D(
      left,
      resolvedToleranceContext
    ) ||
    !isHEarthAABB3D(
      right,
      resolvedToleranceContext
    ) ||
    left.empty === true ||
    right.empty === true ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return false;
  }

  return !(
    left.maximum.x <
      right.minimum.x -
      tolerance ||
    left.minimum.x >
      right.maximum.x +
      tolerance ||
    left.maximum.y <
      right.minimum.y -
      tolerance ||
    left.minimum.y >
      right.maximum.y +
      tolerance ||
    left.maximum.z <
      right.minimum.z -
      tolerance ||
    left.minimum.z >
      right.maximum.z +
      tolerance
  );
}


export function evaluateHEarthBoundsRelationship(
  left,
  right,
  tolerance = 0,
  toleranceContext
) {
  const resolvedToleranceContext =
    resolveHEarthBinaryBoundsToleranceContext(
      left,
      right,
      toleranceContext
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    ) ||
    !isHEarthAABB3D(
      left,
      resolvedToleranceContext
    ) ||
    !isHEarthAABB3D(
      right,
      resolvedToleranceContext
    ) ||
    !isHEarthNonNegativeFiniteNumber(
      tolerance
    )
  ) {
    return deepFreeze({
      valid:
        false,

      relationship:
        H_EARTH_3D_GEOMETRY_NORTH_ENUMS
          .boundsRelationship
          .UNEVALUABLE,

      issues:
        deepFreeze([
          createHEarthGeometryIssue(
            'BOUNDS_RELATIONSHIP_UNEVALUABLE',
            'ERROR',
            'Bounds relationship requires coherent AABBs and a nonnegative finite tolerance.'
          )
        ])
    });
  }

  const leftContainsRight =
    containsHEarthBounds(
      left,
      right,
      tolerance,
      resolvedToleranceContext
    );

  const rightContainsLeft =
    containsHEarthBounds(
      right,
      left,
      tolerance,
      resolvedToleranceContext
    );

  const intersects =
    intersectHEarthBounds(
      left,
      right,
      tolerance,
      resolvedToleranceContext
    );

  let relationship;

  if (
    leftContainsRight &&
    rightContainsLeft
  ) {
    relationship =
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .boundsRelationship.EQUAL;
  } else if (leftContainsRight) {
    relationship =
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .boundsRelationship.CONTAINS;
  } else if (rightContainsLeft) {
    relationship =
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .boundsRelationship
        .CONTAINED_BY;
  } else if (intersects) {
    relationship =
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .boundsRelationship
        .INTERSECTS;
  } else {
    relationship =
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS
        .boundsRelationship
        .DISJOINT;
  }

  return deepFreeze({
    valid:
      true,

    relationship,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 24 · CONSERVATIVE BILLBOARD BOUNDS
 * ========================================================================== */

export function createHEarthBillboardConservativeBounds({
  center,
  width,
  height
} = {}) {
  if (
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthPositiveFiniteNumber(height)
  ) {
    return null;
  }

  const widthSquared =
    width * width;

  const heightSquared =
    height * height;

  const squaredSum =
    widthSquared +
    heightSquared;

  if (
    !isHEarthFiniteNumber(widthSquared) ||
    !isHEarthFiniteNumber(heightSquared) ||
    !isHEarthFiniteNumber(squaredSum) ||
    squaredSum <= 0
  ) {
    return null;
  }

  const conservativeRadius =
    0.5 *
    Math.sqrt(squaredSum);

  if (
    !isHEarthPositiveFiniteNumber(
      conservativeRadius
    )
  ) {
    return null;
  }

  const minimum =
    createHEarthVector3(
      center.x -
        conservativeRadius,

      center.y -
        conservativeRadius,

      center.z -
        conservativeRadius
    );

  const maximum =
    createHEarthVector3(
      center.x +
        conservativeRadius,

      center.y +
        conservativeRadius,

      center.z +
        conservativeRadius
    );

  if (
    !minimum ||
    !maximum
  ) {
    return null;
  }

  const bounds =
    createHEarthBoundsFromMinimumMaximum(
      minimum,
      maximum
    );

  if (!bounds) {
    return null;
  }

  return deepFreeze({
    ...bounds,

    classification:
      'VIEW_DEPENDENT_CONSERVATIVE_BOUNDS',

    conservativeRadius,

    width,

    height
  });
}


/* ==========================================================================
 * 25 · NORTH OWNERSHIP DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'FOUNDATIONAL_MATHEMATICS_ONLY',

    owns: deepFreeze([
      'FINITE_NUMBER_LAW',
      'SAFE_INTEGER_LAW',
      'SAFE_ARITHMETIC',
      'SCALAR_MATHEMATICS',
      'ANGLE_MATHEMATICS',
      'TOLERANCE_PROFILE',
      'DERIVED_TOLERANCE_CONTEXTS',
      'VECTOR2',
      'VECTOR3',
      'VECTOR4',
      'MATRIX4',
      'AFFINE_TRANSFORM_CONSTRUCTION',
      'TRANSFORM_CLASSIFICATION',
      'AFFINE_INVERSION',
      'INVERSION_RESIDUAL_EVALUATION',
      'POSITION_TRANSFORMATION',
      'DIRECTION_TRANSFORMATION',
      'INVERSE_TRANSPOSE_NORMAL_TRANSFORMATION',
      'AABB_STRUCTURAL_RECOGNITION',
      'AABB_MATHEMATICAL_VALIDATION',
      'AABB_MATHEMATICS',
      'CONSERVATIVE_BILLBOARD_BOUNDS',
      'CANONICAL_ISSUE_STRUCTURE',
      'DETERMINISTIC_ISSUE_ORDERING'
    ]),

    mustNotOwn: deepFreeze([
      'DESCRIPTORS',
      'SAMPLING',
      'DERIVATIVES',
      'TOPOLOGY',
      'CURVE_ANALYSIS',
      'POLYGON_ANALYSIS',
      'TRIANGULATION',
      'PRIMITIVE_CONSTRUCTION',
      'PRIMITIVE_ADMISSION',
      'PROVIDER_GOVERNANCE',
      'CAPACITY_CONSUMPTION',
      'AGGREGATE_FRAME_ADMISSION',
      'COMPOSITOR_POLICY',
      'RENDERER_PROJECTION',
      'MATERIALIZATION'
    ]),

    imports:
      deepFreeze([]),

    prohibitedImports:
      deepFreeze([
        './geometry-kernel.east.js',
        './geometry-kernel.south.js',
        './geometry-kernel.west.js',
        './geometry-kernel.js',
        '../capacity.js',
        '../environment.js',
        '../compositor.js',
        '../renderer.js',
        '../controller.js',
        '../index.js',
        './geometry-index.js'
      ])
  });


/* ==========================================================================
 * 26 · CORRECTION DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CORRECTIONS =
  deepFreeze({
    correctionScopeId:
      H_EARTH_3D_GEOMETRY_NORTH_CORRECTION_SCOPE_ID,

    corrections: deepFreeze([
      deepFreeze({
        id:
          'CORRECTION_01',

        status:
          'IMPLEMENTED_CANDIDATE',

        description:
          'Highest severity scans severity ranks independently of deterministic display ordering.'
      }),

      deepFreeze({
        id:
          'CORRECTION_02',

        status:
          'IMPLEMENTED_CANDIDATE',

        description:
          'Tolerance-context derivation fails closed for malformed explicit bounds and preserves valid explicit contexts unchanged.'
      }),

      deepFreeze({
        id:
          'CORRECTION_03',

        status:
          'IMPLEMENTED_CANDIDATE',

        description:
          'Position transformation is affine-only and verifies transformed homogeneous w equals one.'
      }),

      deepFreeze({
        id:
          'CORRECTION_04',

        status:
          'IMPLEMENTED_CANDIDATE',

        description:
          'AABB validation surfaces resolve scale-aware unary, binary, and list coherence contexts from the relevant bounds surface.'
      }),

      deepFreeze({
        id:
          'CORRECTION_05',

        status:
          'IMPLEMENTED_CANDIDATE',

        description:
          'Matrix and transform constructors fail closed on malformed or nonfinite inputs.'
      })
    ]),

    implementationConformance:
      'NOT_YET_EVALUATED'
  });


/* ==========================================================================
 * 27 · REQUIRED NORTH FIXTURE CORRIDOR
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_REQUIRED_FIXTURES =
  deepFreeze([
    'SEVERITY_RANK_INDEPENDENT_OF_DISPLAY_ORDER',
    'NEGATIVE_TOLERANCE_REJECTED',
    'NAN_TOLERANCE_REJECTED',
    'INFINITE_TOLERANCE_REJECTED',
    'ZERO_VECTOR_NORMALIZATION_REJECTED',
    'PROJECTIVE_POSITION_TRANSFORM_REJECTED',
    'SINGULAR_AFFINE_MATRIX_REJECTED',
    'NEAR_SINGULAR_MATRIX_EVALUATED_AGAINST_TOLERANCE',
    'LEFT_INVERSE_RESIDUAL_PASS',
    'RIGHT_INVERSE_RESIDUAL_PASS',
    'INCOHERENT_AABB_REJECTED',
    'EMPTY_AABB_INVARIANTS_VERIFIED',
    'NONFINITE_MATRIX_CONSTRUCTION_REJECTED',
    'NONFINITE_TRANSFORM_CONSTRUCTION_REJECTED',
    'INVALID_BOUNDS_EXPANSION_REJECTED',
    'BILLBOARD_DERIVATION_OVERFLOW_REJECTED',
    'MALFORMED_EXPLICIT_BOUNDS_CONTEXT_REJECTED',
    'NULL_BOUNDS_CONTEXT_USES_SCALE_ONE',
    'EMPTY_BOUNDS_CONTEXT_USES_SCALE_ONE',
    'LARGE_BOUNDS_DERIVE_SCALE_AWARE_CONTEXT',
    'UNARY_AABB_USES_OPERAND_SCALE',
    'BINARY_AABB_USES_MAXIMUM_OPERAND_SCALE',
    'LIST_AABB_USES_MAXIMUM_LIST_SCALE',
    'EMPTY_BOUNDS_LIST_RETURNS_EMPTY_AABB',
    'INVALID_EXPLICIT_AABB_CONTEXT_REJECTED',
    'BINARY_RELATIONSHIP_REUSES_SINGLE_RESOLVED_CONTEXT'
  ]);


/* ==========================================================================
 * 28 · NORTH STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryKernelNorthStaticReview() {
  const identity =
    createHEarthIdentityMatrix4();

  const emptyBounds =
    createHEarthEmptyBounds();

  const malformedBoundsContext =
    deriveHEarthGeometryToleranceContext({
      not: 'bounds'
    });

  const emptyBoundsContext =
    deriveHEarthGeometryToleranceContext(
      emptyBounds
    );

  const scaleTwoContext =
    deriveHEarthGeometryToleranceContextFromScale(
      2
    );

  const checks = deepFreeze([
    deepFreeze({
      id:
        'NORTH_HAS_NO_IMPORT_DECLARATIONS',

      passed:
        true,

      evidence:
        'This file contains no import statements.'
    }),

    deepFreeze({
      id:
        'SCHEMA_VERSION_IS_3',

      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION ===
          3
    }),

    deepFreeze({
      id:
        'NORTH_FOUNDATIONAL_JURISDICTION_DECLARED',

      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_NORTH_OWNERSHIP
          .jurisdiction ===
          'FOUNDATIONAL_MATHEMATICS_ONLY'
    }),

    deepFreeze({
      id:
        'TOLERANCE_CONTEXT_FROM_SCALE_HELPER_EXISTS',

      passed:
        isHEarthGeometryToleranceContext(
          scaleTwoContext
        ) &&
        scaleTwoContext.geometryScale === 2
    }),

    deepFreeze({
      id:
        'MALFORMED_EXPLICIT_BOUNDS_FAIL_CLOSED',

      passed:
        malformedBoundsContext === null
    }),

    deepFreeze({
      id:
        'VALID_EMPTY_BOUNDS_DERIVE_SCALE_ONE',

      passed:
        isHEarthGeometryToleranceContext(
          emptyBoundsContext
        ) &&
        emptyBoundsContext.geometryScale === 1
    }),

    deepFreeze({
      id:
        'MATRIX_CONSTRUCTION_FAILS_CLOSED',

      passed:
        createHEarthMatrix4([
          Number.NaN,
          0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]) === null
    }),

    deepFreeze({
      id:
        'MATRIX_STORAGE_ROW_MAJOR',

      passed:
        identity?.logicalStorage ===
          'ROW_MAJOR'
    }),

    deepFreeze({
      id:
        'MATRIX_VECTOR_CONVENTION_COLUMN_VECTOR',

      passed:
        identity?.vectorConvention ===
          'COLUMN_VECTOR'
    }),

    deepFreeze({
      id:
        'EMPTY_AABB_INVARIANTS_COHERENT',

      passed:
        validateHEarthAABB3D(
          emptyBounds
        ).valid === true
    }),

    deepFreeze({
      id:
        'EMPTY_BOUNDS_LIST_RETURNS_EMPTY_AABB',

      passed:
        mergeHEarthGeometryBounds([])?.empty ===
          true
    }),

    deepFreeze({
      id:
        'EMPTY_BOUNDS_LIST_INVALID_CONTEXT_FAILS_CLOSED',

      passed:
        mergeHEarthGeometryBounds(
          [],
          { invalid: true }
        ) === null
    }),

    deepFreeze({
      id:
        'COORDINATE_FRAME_DECLARED',

      passed:
        H_EARTH_3D_GEOMETRY_COORDINATE_FRAME ===
          'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS'
    }),

    deepFreeze({
      id:
        'MATHEMATICS_STANDARD_REFERENCED',

      passed:
        isHEarthNonEmptyString(
          H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID
        )
    }),

    deepFreeze({
      id:
        'FORMAL_ACCEPTANCE_REFERENCED',

      passed:
        isHEarthNonEmptyString(
          H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID
        )
    })
  ]);

  const passed =
    checks.every(
      (check) =>
        check.passed === true
    );

  return deepFreeze({
    reviewId:
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CORRECTED_STATIC_SELF_REVIEW_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_NORTH_CORRECTION_SCOPE_ID,

    passed,

    status:
      passed
        ? 'STATIC_SELF_REVIEW_PASS_CANDIDATE'
        : 'STATIC_SELF_REVIEW_HOLD',

    checks,

    prohibitedImportReviewPerformed:
      false,

    executableFixtureReviewPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

    negativeFixtureExecutionPerformed:
      false,

    localImplementationConformance:
      'NOT_YET_EVALUATED'
  });
}


/* ==========================================================================
 * 29 · NORTH RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CORRECTED_IMPLEMENTATION_CANDIDATE_RECEIPT_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,

    mathematicsPacketId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

    mathematicsAcceptanceReceiptId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

    ownershipContractId:
      H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID,

    ownershipLockReceiptId:
      H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID,

    finalRefreezeReceiptId:
      H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_NORTH_CORRECTION_SCOPE_ID,

    jurisdiction:
      'FOUNDATIONAL_MATHEMATICS_ONLY',

    implementationBodyExists:
      true,

    targetedCorrectionsImplemented:
      true,

    staticSelfReviewAvailable:
      true,

    prohibitedImportReviewPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

    negativeFixtureExecutionPerformed:
      false,

    testExecutionPerformed:
      false,

    localImplementationConformance:
      'NOT_YET_EVALUATED',

    northLocalAdmission:
      false,

    northPublicSymbolFreeze:
      false,

    eastImplementationAuthority:
      false,

    fullKernelImplementationConformance:
      'NOT_YET_EVALUATED',

    providerAuthority:
      false,

    geometryIndexAuthority:
      false,

    compositorIntegrationAuthority:
      false,

    rendererIntegrationAuthority:
      false,

    visualApproval:
      false,

    productionAuthority:
      false,

    publicReleaseAuthority:
      false,

    backupAndRepositoryInstallApproval:
      false,

    nextRequired:
      'CORRECTED_NORTH_STATIC_REVIEW_PROHIBITED_IMPORT_REVIEW_AND_FIXTURE_EXECUTION'
  });


/* ==========================================================================
 * 30 · NORTH PUBLIC API CANDIDATE MANIFEST
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-kernel.north.js',

    classification:
      'NORTH_PUBLIC_CANDIDATE',

    symbols: deepFreeze([
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_COORDINATE_FRAME',
      'H_EARTH_3D_GEOMETRY_NORTH_ENUMS',
      'H_EARTH_3D_GEOMETRY_ISSUE_SEVERITY_RANK',
      'H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_OWNERSHIP',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CORRECTIONS',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_REQUIRED_FIXTURES',
      'createHEarthGeometryIssue',
      'compareHEarthGeometryIssues',
      'sortHEarthGeometryIssues',
      'hasHEarthBlockingIssues',
      'getHEarthHighestIssueSeverity',
      'isHEarthFiniteNumber',
      'isHEarthPositiveFiniteNumber',
      'isHEarthNonNegativeFiniteNumber',
      'isHEarthSafeInteger',
      'isHEarthNonNegativeSafeInteger',
      'isHEarthPositiveSafeInteger',
      'isHEarthNonEmptyString',
      'validateHEarthFiniteNumber',
      'validateHEarthNonNegativeSafeInteger',
      'safeAddHEarthInteger',
      'safeMultiplyHEarthInteger',
      'safeSubtractHEarthInteger',
      'isHEarthGeometryToleranceProfile',
      'getHEarthGeometryToleranceProfile',
      'isHEarthGeometryToleranceContext',
      'deriveHEarthGeometryToleranceContext',
      'clampHEarthNumber',
      'saturateHEarthNumber',
      'lerpHEarthNumber',
      'inverseLerpHEarthNumber',
      'remapHEarthNumber',
      'safeDivideHEarthNumber',
      'approximatelyEqualHEarthNumber',
      'roundHEarthNumber',
      'signedPowerHEarthNumber',
      'smoothstepHEarthNumber',
      'smootherstepHEarthNumber',
      'smoothMinHEarthNumber',
      'smoothMaxHEarthNumber',
      'degreesToHEarthRadians',
      'radiansToHEarthDegrees',
      'normalizeHEarthDegreesSigned',
      'normalizeHEarthDegreesUnsigned',
      'normalizeHEarthRadiansSigned',
      'normalizeHEarthRadiansUnsigned',
      'createHEarthVector2',
      'isHEarthVector2',
      'cloneHEarthVector2',
      'addHEarthVector2',
      'subtractHEarthVector2',
      'scaleHEarthVector2',
      'dotHEarthVector2',
      'getHEarthVector2LengthSquared',
      'getHEarthVector2Length',
      'getHEarthVector2DistanceSquared',
      'getHEarthVector2Distance',
      'normalizeHEarthVector2',
      'createHEarthVector3',
      'isHEarthVector3',
      'cloneHEarthVector3',
      'addHEarthVector3',
      'subtractHEarthVector3',
      'multiplyHEarthVector3Components',
      'scaleHEarthVector3',
      'divideHEarthVector3',
      'dotHEarthVector3',
      'crossHEarthVector3',
      'getHEarthVector3LengthSquared',
      'getHEarthVector3Length',
      'getHEarthVector3DistanceSquared',
      'getHEarthVector3Distance',
      'normalizeHEarthVector3',
      'lerpHEarthVector3',
      'minimumHEarthVector3',
      'maximumHEarthVector3',
      'projectHEarthVector3',
      'projectHEarthVector3OntoPlane',
      'reflectHEarthVector3',
      'approximatelyEqualHEarthVector3',
      'createHEarthVector4',
      'isHEarthVector4',
      'cloneHEarthVector4',
      'createHEarthMatrix4',
      'createHEarthIdentityMatrix4',
      'isHEarthMatrix4',
      'cloneHEarthMatrix4',
      'createHEarthTranslationMatrix',
      'createHEarthScaleMatrix',
      'createHEarthRotationXMatrix',
      'createHEarthRotationYMatrix',
      'createHEarthRotationZMatrix',
      'createHEarthAxisAngleRotationMatrix',
      'multiplyHEarthMatrix4',
      'transposeHEarthMatrix4',
      'getHEarthMatrixLinearColumns',
      'determinantHEarthMatrix3Linear',
      'composeHEarthWorldTransform',
      'transformHEarthVector4',
      'transformHEarthPosition3',
      'transformHEarthDirection3',
      'transformHEarthVector3',
      'classifyHEarthTransform',
      'evaluateHEarthMatrixResidual',
      'invertHEarthMatrix4',
      'transformHEarthNormal3',
      'createHEarthEmptyBounds',
      'isHEarthAABB3DShape',
      'validateHEarthAABB3D',
      'isHEarthAABB3D',
      'createHEarthBoundsFromMinimumMaximum',
      'createHEarthGeometryBounds',
      'expandHEarthBoundsByRadius',
      'expandHEarthBoundsByExtent',
      'mergeHEarthGeometryBounds',
      'containsHEarthPointInBounds',
      'containsHEarthBounds',
      'intersectHEarthBounds',
      'evaluateHEarthBoundsRelationship',
      'createHEarthBillboardConservativeBounds',
      'getHEarthGeometryKernelNorthStaticReview',
      'getHEarthGeometryKernelNorthReceipt',
      'getHEarthGeometryKernelNorthContract'
    ]),

    collisionStatus:
      'NOT_YET_REVIEWED',

    implementationStatus:
      'CORRECTED_IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'NOT_YET_EVALUATED'
  });


/* ==========================================================================
 * 31 · NORTH CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SOURCE_FILE,

    mathematicsPacketId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,

    mathematicsAcceptanceReceiptId:
      H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,

    ownershipContractId:
      H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID,

    ownershipLockReceiptId:
      H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID,

    finalRefreezeReceiptId:
      H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_NORTH_CORRECTION_SCOPE_ID,

    mathematicsStandard:
      'FROZEN',

    frozenScope:
      'GEOMETRY_MATHEMATICS_ONLY',

    jurisdiction:
      'FOUNDATIONAL_MATHEMATICS_ONLY',

    dependencyDirection:
      'NORTH_TO_EAST_ONLY',

    imports:
      deepFreeze([]),

    ownership:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_OWNERSHIP,

    corrections:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CORRECTIONS,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_REQUIRED_FIXTURES,

    enums:
      H_EARTH_3D_GEOMETRY_NORTH_ENUMS,

    toleranceProfile:
      H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_RECEIPT,

    implementationConformance:
      'NOT_YET_EVALUATED',

    testExecutionPerformed:
      false,

    northLocalAdmission:
      false,

    northPublicSymbolFreeze:
      false,

    eastImplementationAuthority:
      false,

    providerAuthority:
      false,

    rendererAuthority:
      false,

    visualApproval:
      false,

    productionAuthority:
      false,

    publicReleaseAuthority:
      false
  });


/* ==========================================================================
 * 32 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryKernelNorthReceipt() {
  return H_EARTH_3D_GEOMETRY_KERNEL_NORTH_RECEIPT;
}


export function getHEarthGeometryKernelNorthContract() {
  return H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT;
}


export default H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT;
