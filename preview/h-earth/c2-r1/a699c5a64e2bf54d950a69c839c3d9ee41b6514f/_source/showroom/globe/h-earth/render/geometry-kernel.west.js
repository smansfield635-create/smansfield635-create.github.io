/**
 * /showroom/globe/h-earth/render/geometry-kernel.west.js
 * COMPLETE CORRECTED FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1
 *
 * DEPENDS ON:
 * H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1
 *
 * CORRECTION SCOPE:
 * STEP_034O_4W_TARGETED_PRIMITIVE_AND_AGGREGATE_FRAME_ADMISSION_SCOPE_v1
 *
 * CORRECTION CLASS:
 * WEST_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY.
 *
 * STATUS:
 * WEST PRIMITIVE-ADMISSION AND AGGREGATE-FRAME-ADMISSION IMPLEMENTATION CANDIDATE.
 *
 * AUTHORIZED JURISDICTION:
 * PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY.
 *
 * IMPORT LAW:
 * WEST MAY IMPORT NORTH EAST AND SOUTH ONLY.
 *
 * THIS FILE DOES NOT:
 * - perform provider admission
 * - construct provider outputs
 * - construct geometry-index exports
 * - consume capacity.js
 * - aggregate providers
 * - author compositor policy
 * - project or materialize geometry
 * - create renderer outputs
 * - grant visual approval
 * - grant production authority
 * - grant public-release authority
 *
 * IMPLEMENTATION CONFORMANCE:
 * HOLD_PENDING_EXECUTABLE_CORRIDOR.
 *
 * WEST LOCAL ADMISSION:
 * FALSE.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext,
  approximatelyEqualHEarthVector3,
  approximatelyEqualHEarthNumber
} from './geometry-kernel.north.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_EAST_ENUMS
} from './geometry-kernel.east.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,

  isHEarthNeutralGeometryRecord,
  isHEarthNeutralPrimitiveRecord,

  constructHEarthPoint,
  constructHEarthTriangle,
  constructHEarthPrismMesh
} from './geometry-kernel.south.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION = 1;

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/geometry-kernel.west.js';

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

export const H_EARTH_3D_GEOMETRY_WEST_CORRECTION_SCOPE_ID =
  'STEP_034O_4W_TARGETED_PRIMITIVE_AND_AGGREGATE_FRAME_ADMISSION_SCOPE_v1';


/* ==========================================================================
 * 02 · INTERNAL STRUCTURE
 * ========================================================================== */

const H_EARTH_WEST_PRIMITIVE_ADMISSION_PROOFS =
  new WeakSet();

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


function createWestIssue(
  code,
  severity,
  message,
  details = null,
  blocking = null,
  context = {}
) {
  return createHEarthGeometryIssue(
    code,
    severity,
    message,
    details,
    blocking,
    {
      ...context,
      sourceModule:
        'geometry-kernel.west.js'
    }
  );
}


function hasValidOrOmittedToleranceContext(
  toleranceContext
) {
  return (
    toleranceContext === undefined ||
    isHEarthGeometryToleranceContext(
      toleranceContext
    )
  );
}


function isWestValidBounds(
  bounds,
  toleranceContext
) {
  return toleranceContext === undefined
    ? isHEarthAABB3D(bounds)
    : isHEarthAABB3D(
        bounds,
        toleranceContext
      );
}


function mergeBoundsForWest(
  boundsList,
  toleranceContext
) {
  return toleranceContext === undefined
    ? mergeHEarthGeometryBounds(boundsList)
    : mergeHEarthGeometryBounds(
        boundsList,
        toleranceContext
      );
}


function getBoundsComparisonContext(
  left,
  right,
  toleranceContext
) {
  if (toleranceContext !== undefined) {
    return isHEarthGeometryToleranceContext(
      toleranceContext
    )
      ? toleranceContext
      : null;
  }

  const merged =
    mergeHEarthGeometryBounds([
      left,
      right
    ]);

  return isHEarthAABB3D(merged)
    ? deriveHEarthGeometryToleranceContext(
        merged
      )
    : null;
}


function areBoundsEquivalent(
  left,
  right,
  toleranceContext
) {
  if (
    !isHEarthAABB3D(left) ||
    !isHEarthAABB3D(right)
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

  const comparisonContext =
    getBoundsComparisonContext(
      left,
      right,
      toleranceContext
    );

  if (
    !isHEarthGeometryToleranceContext(
      comparisonContext
    )
  ) {
    return false;
  }

  return (
    approximatelyEqualHEarthVector3(
      left.minimum,
      right.minimum,
      comparisonContext
    ) &&
    approximatelyEqualHEarthVector3(
      left.maximum,
      right.maximum,
      comparisonContext
    ) &&
    approximatelyEqualHEarthVector3(
      left.center,
      right.center,
      comparisonContext
    ) &&
    approximatelyEqualHEarthVector3(
      left.size,
      right.size,
      comparisonContext
    ) &&
    approximatelyEqualHEarthVector3(
      left.halfExtent,
      right.halfExtent,
      comparisonContext
    ) &&
    approximatelyEqualHEarthNumber(
      left.diagonalLength,
      right.diagonalLength,
      {
        absoluteTolerance:
          comparisonContext.lengthTolerance,
        relativeTolerance:
          comparisonContext.scalarRelativeTolerance
      }
    )
  );
}


function arePlainValuesEquivalent(
  left,
  right
) {
  if (Object.is(left, right)) {
    return true;
  }

  if (
    Array.isArray(left) ||
    Array.isArray(right)
  ) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every(
        (value, index) =>
          arePlainValuesEquivalent(
            value,
            right[index]
          )
      )
    );
  }

  if (
    isPlainObject(left) ||
    isPlainObject(right)
  ) {
    if (
      !isPlainObject(left) ||
      !isPlainObject(right)
    ) {
      return false;
    }

    const leftKeys =
      Object.keys(left).sort();

    const rightKeys =
      Object.keys(right).sort();

    return (
      leftKeys.length ===
        rightKeys.length &&
      leftKeys.every(
        (key, index) =>
          key === rightKeys[index] &&
          arePlainValuesEquivalent(
            left[key],
            right[key]
          )
      )
    );
  }

  return false;
}


function doesAdmittedGeometryMatchNeutralGeometry(
  admittedGeometry,
  neutralGeometry,
  toleranceContext
) {
  return (
    admittedGeometry.geometryId ===
      neutralGeometry.geometryId &&
    admittedGeometry.sourceNeutralGeometryId ===
      neutralGeometry.geometryId &&
    admittedGeometry.topologyMode ===
      neutralGeometry.topologyMode &&
    admittedGeometry.coordinateFrame ===
      neutralGeometry.coordinateFrame &&
    areBoundsEquivalent(
      admittedGeometry.bounds,
      neutralGeometry.bounds,
      toleranceContext
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.vertices,
      neutralGeometry.vertices
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.indices,
      neutralGeometry.indices
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.normals,
      neutralGeometry.normals
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.faceNormals,
      neutralGeometry.faceNormals
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.transform,
      neutralGeometry.transform
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.attributes,
      neutralGeometry.attributes
    ) &&
    arePlainValuesEquivalent(
      admittedGeometry.source,
      neutralGeometry.source
    )
  );
}


function hasZeroDirectedConflicts(
  topologyAnalysis
) {
  const directedConflicts =
    topologyAnalysis
      ?.topology
      ?.directedConflicts;

  return (
    Array.isArray(directedConflicts) &&
    directedConflicts.length === 0
  );
}


function hasSatisfiedClosureRequirements(
  topologyAnalysis
) {
  const requirements =
    topologyAnalysis
      ?.closureRequirements;

  return (
    isPlainObject(requirements) &&
    requirements.noInvalidTriangles === true &&
    requirements.noBoundaryEdges === true &&
    requirements.noNonmanifoldEdges === true &&
    requirements.noDirectedConflicts === true &&
    requirements.noIsolatedVertices === true &&
    requirements.allClosedShellsOutward === true
  );
}


function isClosedOutwardTopologyAnalysis(
  topologyAnalysis
) {
  return (
    isPlainObject(topologyAnalysis) &&
    topologyAnalysis.valid === true &&
    topologyAnalysis.classification ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .topologyClassification
        .CLOSED_ORIENTED_MANIFOLD &&
    topologyAnalysis.structurallyClosed === true &&
    topologyAnalysis.closed === true &&
    topologyAnalysis.outwardClosed === true &&
    hasZeroDirectedConflicts(
      topologyAnalysis
    ) &&
    hasSatisfiedClosureRequirements(
      topologyAnalysis
    ) &&
    !hasHEarthBlockingIssues(
      topologyAnalysis.issues
    )
  );
}


function isLawfulOpenOrClosedTopologyAnalysis(
  topologyAnalysis
) {
  return (
    isPlainObject(topologyAnalysis) &&
    topologyAnalysis.valid === true &&
    (
      topologyAnalysis.classification ===
        H_EARTH_3D_GEOMETRY_EAST_ENUMS
          .topologyClassification
          .OPEN_MANIFOLD ||
      isClosedOutwardTopologyAnalysis(
        topologyAnalysis
      )
    ) &&
    !hasHEarthBlockingIssues(
      topologyAnalysis.issues
    )
  );
}


function isKnownClosedPrimitiveType(
  primitiveType
) {
  return [
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.EXTRUSION_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.PRISM_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.ELLIPSOID_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.SUPERELLIPSOID_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.RADIAL_SHELL_MESH
  ].includes(primitiveType);
}


function isKnownOpenAllowedPrimitiveType(
  primitiveType
) {
  return [
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.TRIANGLE,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.TRIANGLE_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.HEIGHT_FIELD_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.PARAMETRIC_SURFACE_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.XZ_RIBBON_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.GABLE_ROOF_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.SHED_ROOF_MESH
  ].includes(primitiveType);
}


function getExpectedClosure(
  primitiveRecord
) {
  const metadataExpectedClosure =
    primitiveRecord
      ?.geometry
      ?.metadata
      ?.expectedClosure;

  if (
    enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure,
      metadataExpectedClosure
    )
  ) {
    return metadataExpectedClosure;
  }

  if (
    isKnownClosedPrimitiveType(
      primitiveRecord?.primitiveType
    )
  ) {
    return H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .expectedClosure
      .CLOSED_REQUIRED;
  }

  if (
    isKnownOpenAllowedPrimitiveType(
      primitiveRecord?.primitiveType
    )
  ) {
    return H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .expectedClosure
      .OPEN_ALLOWED;
  }

  return H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
    .expectedClosure
    .UNSPECIFIED;
}


function isTopologyBearingPrimitive(
  primitiveRecord
) {
  return (
    primitiveRecord?.geometry?.topologyMode ===
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .topologyMode.TRIANGLES
  );
}


function makePrimitiveEvaluationFailure({
  primitiveRecord,
  issues,
  metadata = null,
  disposition =
    'REJECT'
}) {
  return deepFreeze({
    valid:
      false,

    primitiveRecord:
      primitiveRecord ?? null,

    disposition,

    admitted:
      false,

    admissionAuthority:
      'WEST_ONLY',

    metadata:
      freezeClone(metadata),

    issues:
      sortHEarthGeometryIssues(
        ensureArray(issues)
      )
  });
}


function makePrimitiveEvaluationSuccess({
  primitiveRecord,
  issues = [],
  metadata = null,
  disposition =
    'ADMIT'
}) {
  const result =
    deepFreeze({
      valid:
        true,

      primitiveRecord,

      disposition,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY',

      metadata:
        freezeClone(metadata),

      issues:
        sortHEarthGeometryIssues(
          ensureArray(issues)
        )
    });

  H_EARTH_WEST_PRIMITIVE_ADMISSION_PROOFS
    .add(result);

  return result;
}


function isValidWestPrimitiveAdmissionProof(
  evaluation,
  primitiveRecord
) {
  return (
    isPlainObject(evaluation) &&
    H_EARTH_WEST_PRIMITIVE_ADMISSION_PROOFS
      .has(evaluation) &&
    evaluation.valid === true &&
    evaluation.disposition ===
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admissionDisposition
        .ADMIT &&
    evaluation.primitiveRecord ===
      primitiveRecord &&
    !hasHEarthBlockingIssues(
      evaluation.issues
    )
  );
}


/* ==========================================================================
 * 03 · WEST ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_WEST_ENUMS =
  deepFreeze({
    admissionDisposition: deepFreeze({
      ADMIT:
        'ADMIT',

      HOLD:
        'HOLD',

      REJECT:
        'REJECT'
    }),

    admittedRecordType: deepFreeze({
      GEOMETRY:
        'H_EARTH_WEST_ADMITTED_GEOMETRY_RECORD',

      PRIMITIVE:
        'H_EARTH_WEST_ADMITTED_PRIMITIVE_RECORD',

      AGGREGATE_FRAME:
        'H_EARTH_WEST_ADMITTED_AGGREGATE_FRAME_RECORD'
    }),

    candidateClass: deepFreeze({
      PRIMITIVE:
        'PRIMITIVE',

      AGGREGATE_FRAME:
        'AGGREGATE_FRAME'
    }),

    aggregateFrameStatus: deepFreeze({
      ADMITTED:
        'ADMITTED',

      HELD:
        'HELD'
    })
  });


/* ==========================================================================
 * 04 · ADMITTED RECORDS
 * ========================================================================== */

export function createHEarthAdmittedGeometryRecord({
  neutralPrimitive,
  admissionEvaluation,
  admissionId,
  metadata = null,
  issues = [],
  toleranceContext
} = {}) {
  if (
    !isHEarthNeutralPrimitiveRecord(
      neutralPrimitive
    ) ||
    !isValidWestPrimitiveAdmissionProof(
      admissionEvaluation,
      neutralPrimitive
    ) ||
    !isHEarthNonEmptyString(
      admissionId
    ) ||
    !hasValidOrOmittedToleranceContext(
      toleranceContext
    ) ||
    !isWestValidBounds(
      neutralPrimitive.geometry.bounds,
      toleranceContext
    ) ||
    hasHEarthBlockingIssues(
      neutralPrimitive.issues
    ) ||
    hasHEarthBlockingIssues(
      neutralPrimitive.geometry.issues
    ) ||
    hasHEarthBlockingIssues(
      admissionEvaluation.issues
    ) ||
    hasHEarthBlockingIssues(issues)
  ) {
    return null;
  }

  const neutralGeometry =
    neutralPrimitive.geometry;

  return deepFreeze({
    recordType:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .GEOMETRY,

    admissionId,

    geometryId:
      neutralGeometry.geometryId,

    sourceNeutralGeometryId:
      neutralGeometry.geometryId,

    sourceNeutralPrimitiveId:
      neutralPrimitive.primitiveId,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    projectionNeutral:
      true,

    topologyMode:
      neutralGeometry.topologyMode,

    vertices:
      freezeClone(
        neutralGeometry.vertices
      ),

    indices:
      freezeClone(
        neutralGeometry.indices
      ),

    normals:
      freezeClone(
        neutralGeometry.normals
      ),

    faceNormals:
      freezeClone(
        neutralGeometry.faceNormals
      ),

    bounds:
      neutralGeometry.bounds,

    transform:
      neutralGeometry.transform,

    attributes:
      freezeClone(
        neutralGeometry.attributes
      ),

    source:
      freezeClone(
        neutralGeometry.source
      ),

    metadata:
      freezeClone({
        ...neutralGeometry.metadata,
        ...metadata
      }),

    issues:
      sortHEarthGeometryIssues([
        ...ensureArray(
          neutralGeometry.issues
        ),
        ...ensureArray(
          admissionEvaluation.issues
        ),
        ...ensureArray(issues)
      ]),

    admitted:
      true,

    admissionAuthority:
      'WEST',

    providerOutput:
      false,

    aggregateFrameMember:
      false,

    geometryIndexExported:
      false,

    compositorIntegrated:
      false,

    rendererMaterialized:
      false
  });
}


export function createHEarthAdmittedPrimitiveRecord({
  neutralPrimitive,
  admittedGeometry,
  admissionEvaluation,
  admissionId,
  metadata = null,
  issues = [],
  toleranceContext
} = {}) {
  if (
    !isHEarthNeutralPrimitiveRecord(
      neutralPrimitive
    ) ||
    !isValidWestPrimitiveAdmissionProof(
      admissionEvaluation,
      neutralPrimitive
    ) ||
    !isPlainObject(
      admittedGeometry
    ) ||
    admittedGeometry.recordType !==
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .GEOMETRY ||
    admittedGeometry.admitted !== true ||
    admittedGeometry.admissionAuthority !==
      'WEST' ||
    !isHEarthNonEmptyString(
      admissionId
    ) ||
    !hasValidOrOmittedToleranceContext(
      toleranceContext
    ) ||
    hasHEarthBlockingIssues(
      neutralPrimitive.issues
    ) ||
    hasHEarthBlockingIssues(
      neutralPrimitive.geometry.issues
    ) ||
    hasHEarthBlockingIssues(
      admittedGeometry.issues
    ) ||
    hasHEarthBlockingIssues(
      admissionEvaluation.issues
    ) ||
    hasHEarthBlockingIssues(issues) ||
    admittedGeometry.admissionId !==
      admissionId ||
    admittedGeometry.sourceNeutralPrimitiveId !==
      neutralPrimitive.primitiveId ||
    !doesAdmittedGeometryMatchNeutralGeometry(
      admittedGeometry,
      neutralPrimitive.geometry,
      toleranceContext
    )
  ) {
    return null;
  }

  return deepFreeze({
    recordType:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .PRIMITIVE,

    admissionId,

    primitiveId:
      neutralPrimitive.primitiveId,

    primitiveType:
      neutralPrimitive.primitiveType,

    sourceNeutralPrimitiveId:
      neutralPrimitive.primitiveId,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    projectionNeutral:
      true,

    geometry:
      admittedGeometry,

    semanticRole:
      neutralPrimitive.semanticRole,

    materialHint:
      freezeClone(
        neutralPrimitive.materialHint
      ),

    visibilityHint:
      freezeClone(
        neutralPrimitive.visibilityHint
      ),

    interactionHint:
      freezeClone(
        neutralPrimitive.interactionHint
      ),

    metadata:
      freezeClone({
        ...neutralPrimitive.metadata,
        ...metadata
      }),

    issues:
      sortHEarthGeometryIssues([
        ...ensureArray(
          neutralPrimitive.issues
        ),
        ...ensureArray(
          admittedGeometry.issues
        ),
        ...ensureArray(
          admissionEvaluation.issues
        ),
        ...ensureArray(issues)
      ]),

    admitted:
      true,

    admissionAuthority:
      'WEST',

    providerOutput:
      false,

    aggregateFrameMember:
      false,

    geometryIndexExported:
      false,

    compositorIntegrated:
      false,

    rendererMaterialized:
      false
  });
}


export function createHEarthAggregateFrameAdmissionRecord({
  frameId,
  admittedPrimitives,
  bounds,
  metadata = null,
  issues = [],
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(frameId) ||
    !Array.isArray(admittedPrimitives) ||
    admittedPrimitives.length === 0 ||
    !admittedPrimitives.every(
      isHEarthAdmittedPrimitiveRecord
    ) ||
    !hasValidOrOmittedToleranceContext(
      toleranceContext
    ) ||
    hasHEarthBlockingIssues(issues)
  ) {
    return null;
  }

  const primitiveIds =
    admittedPrimitives.map(
      (primitive) =>
        primitive.primitiveId
    );

  const admissionIds =
    admittedPrimitives.map(
      (primitive) =>
        primitive.admissionId
    );

  if (
    new Set(primitiveIds).size !==
      primitiveIds.length ||
    new Set(admissionIds).size !==
      admissionIds.length ||
    admittedPrimitives.some(
      (primitive) =>
        hasHEarthBlockingIssues(
          primitive.issues
        ) ||
        primitive.aggregateFrameMember !==
          false
    )
  ) {
    return null;
  }

  const independentlyDerivedBounds =
    mergeBoundsForWest(
      admittedPrimitives.map(
        (primitive) =>
          primitive.geometry.bounds
      ),
      toleranceContext
    );

  if (
    !isWestValidBounds(
      independentlyDerivedBounds,
      toleranceContext
    )
  ) {
    return null;
  }

  const resolvedBounds =
    bounds === undefined ||
    bounds === null
      ? independentlyDerivedBounds
      : (
          isWestValidBounds(
            bounds,
            toleranceContext
          ) &&
          areBoundsEquivalent(
            bounds,
            independentlyDerivedBounds,
            toleranceContext
          )
        )
        ? bounds
        : null;

  if (!resolvedBounds) {
    return null;
  }

  return deepFreeze({
    recordType:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .AGGREGATE_FRAME,

    frameId,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    status:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .aggregateFrameStatus
        .ADMITTED,

    primitiveCount:
      admittedPrimitives.length,

    primitiveIds:
      deepFreeze(
        primitiveIds.slice()
      ),

    primitives:
      deepFreeze(
        admittedPrimitives.map(
          (primitive) =>
            deepFreeze({
              ...primitive,
              aggregateFrameMember:
                true
            })
        )
      ),

    bounds:
      resolvedBounds,

    sourceMemberBounds:
      independentlyDerivedBounds,

    metadata:
      freezeClone(metadata),

    issues:
      sortHEarthGeometryIssues(
        ensureArray(issues)
      ),

    admitted:
      true,

    admissionAuthority:
      'WEST',

    providerOutput:
      false,

    geometryIndexExported:
      false,

    compositorIntegrated:
      false,

    rendererMaterialized:
      false,

    visualApproval:
      false,

    productionAuthority:
      false,

    publicReleaseAuthority:
      false
  });
}


/* ==========================================================================
 * 05 · RECORD VALIDATION
 * ========================================================================== */

export function isHEarthAdmittedGeometryRecord(
  record
) {
  return (
    isPlainObject(record) &&
    record.recordType ===
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .GEOMETRY &&
    record.admitted === true &&
    record.admissionAuthority ===
      'WEST' &&
    record.providerOutput === false &&
    record.geometryIndexExported === false &&
    record.compositorIntegrated === false &&
    record.rendererMaterialized === false &&
    !hasHEarthBlockingIssues(
      record.issues
    ) &&
    isHEarthNonEmptyString(
      record.admissionId
    ) &&
    isHEarthNonEmptyString(
      record.geometryId
    ) &&
    isHEarthNonEmptyString(
      record.sourceNeutralGeometryId
    ) &&
    isHEarthNonEmptyString(
      record.sourceNeutralPrimitiveId
    ) &&
    record.sourceNeutralGeometryId ===
      record.geometryId &&
    record.coordinateFrame ===
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME &&
    isHEarthAABB3D(record.bounds)
  );
}


export function isHEarthAdmittedPrimitiveRecord(
  record
) {
  return (
    isPlainObject(record) &&
    record.recordType ===
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .PRIMITIVE &&
    record.admitted === true &&
    record.admissionAuthority ===
      'WEST' &&
    record.providerOutput === false &&
    record.aggregateFrameMember === false &&
    record.geometryIndexExported === false &&
    record.compositorIntegrated === false &&
    record.rendererMaterialized === false &&
    !hasHEarthBlockingIssues(
      record.issues
    ) &&
    isHEarthNonEmptyString(
      record.admissionId
    ) &&
    isHEarthNonEmptyString(
      record.primitiveId
    ) &&
    isHEarthNonEmptyString(
      record.sourceNeutralPrimitiveId
    ) &&
    record.sourceNeutralPrimitiveId ===
      record.primitiveId &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType,
      record.primitiveType
    ) &&
    isHEarthAdmittedGeometryRecord(
      record.geometry
    ) &&
    record.geometry.admissionId ===
      record.admissionId &&
    record.geometry.sourceNeutralPrimitiveId ===
      record.primitiveId
  );
}


export function isHEarthAggregateFrameAdmissionRecord(
  record
) {
  if (
    !isPlainObject(record) ||
    record.recordType !==
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admittedRecordType
        .AGGREGATE_FRAME ||
    record.admitted !== true ||
    record.admissionAuthority !==
      'WEST' ||
    record.providerOutput !== false ||
    record.geometryIndexExported !== false ||
    record.compositorIntegrated !== false ||
    record.rendererMaterialized !== false ||
    record.visualApproval !== false ||
    record.productionAuthority !== false ||
    record.publicReleaseAuthority !== false ||
    hasHEarthBlockingIssues(record.issues) ||
    !isHEarthNonEmptyString(record.frameId) ||
    record.coordinateFrame !==
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME ||
    !isHEarthPositiveSafeInteger(
      record.primitiveCount
    ) ||
    !Array.isArray(record.primitiveIds) ||
    !Array.isArray(record.primitives) ||
    record.primitiveIds.length !==
      record.primitiveCount ||
    record.primitives.length !==
      record.primitiveCount
  ) {
    return false;
  }

  const normalizedPrimitives =
    record.primitives.map(
      (primitive) => ({
        ...primitive,
        aggregateFrameMember:
          false
      })
    );

  if (
    !normalizedPrimitives.every(
      isHEarthAdmittedPrimitiveRecord
    )
  ) {
    return false;
  }

  const actualPrimitiveIds =
    normalizedPrimitives.map(
      (primitive) =>
        primitive.primitiveId
    );

  const admissionIds =
    normalizedPrimitives.map(
      (primitive) =>
        primitive.admissionId
    );

  if (
    new Set(actualPrimitiveIds).size !==
      actualPrimitiveIds.length ||
    new Set(admissionIds).size !==
      admissionIds.length ||
    !arePlainValuesEquivalent(
      record.primitiveIds,
      actualPrimitiveIds
    )
  ) {
    return false;
  }

  const recomputedBounds =
    mergeHEarthGeometryBounds(
      normalizedPrimitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  return (
    isHEarthAABB3D(record.bounds) &&
    isHEarthAABB3D(
      record.sourceMemberBounds
    ) &&
    isHEarthAABB3D(
      recomputedBounds
    ) &&
    areBoundsEquivalent(
      record.bounds,
      recomputedBounds
    ) &&
    areBoundsEquivalent(
      record.sourceMemberBounds,
      recomputedBounds
    )
  );
}


/* ==========================================================================
 * 06 · PRIMITIVE ADMISSION EVALUATION
 * ========================================================================== */

export function evaluateHEarthPrimitiveAdmission(
  primitiveRecord,
  {
    toleranceContext,
    candidateClass =
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .candidateClass
        .PRIMITIVE,
    metadata = null
  } = {}
) {
  const issues = [];

  if (
    candidateClass !==
    H_EARTH_3D_GEOMETRY_WEST_ENUMS
      .candidateClass
      .PRIMITIVE
  ) {
    issues.push(
      createWestIssue(
        'WEST_CANDIDATE_CLASS_INVALID',
        'ERROR',
        'Primitive admission requires the primitive candidate class.'
      )
    );
  }

  if (
    !hasValidOrOmittedToleranceContext(
      toleranceContext
    )
  ) {
    issues.push(
      createWestIssue(
        'WEST_TOLERANCE_CONTEXT_INVALID',
        'ERROR',
        'West primitive admission requires an omitted or valid explicit tolerance context.'
      )
    );
  }

  if (
    !isHEarthNeutralPrimitiveRecord(
      primitiveRecord
    )
  ) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_CANDIDATE_INVALID',
        'ERROR',
        'West primitive admission requires a lawful South neutral primitive record.'
      )
    );

    return makePrimitiveEvaluationFailure({
      primitiveRecord,
      issues,
      metadata
    });
  }

  if (
    primitiveRecord.admitted !== false ||
    primitiveRecord.admissionAuthority !==
      'WEST_ONLY'
  ) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_ALREADY_OR_IMPROPERLY_ADMITTED',
        'ERROR',
        'West primitive admission requires an unadmitted South neutral primitive record with WEST_ONLY admission authority.',
        {
          admitted:
            primitiveRecord.admitted,
          admissionAuthority:
            primitiveRecord.admissionAuthority
        }
      )
    );
  }

  if (
    !isHEarthNeutralGeometryRecord(
      primitiveRecord.geometry
    ) ||
    primitiveRecord.geometry.admitted !== false ||
    primitiveRecord.geometry.admissionAuthority !==
      'WEST_ONLY'
  ) {
    issues.push(
      createWestIssue(
        'WEST_GEOMETRY_CANDIDATE_INVALID',
        'ERROR',
        'West primitive admission requires an unadmitted South neutral geometry record with WEST_ONLY admission authority.'
      )
    );
  }

  if (
    primitiveRecord.constructionStatus !==
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .constructionStatus
      .CONSTRUCTED
  ) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_CONSTRUCTION_STATUS_INVALID',
        'ERROR',
        'West primitive admission requires South constructionStatus CONSTRUCTED.',
        {
          constructionStatus:
            primitiveRecord.constructionStatus
        }
      )
    );
  }

  if (
    hasHEarthBlockingIssues(
      primitiveRecord.issues
    ) ||
    hasHEarthBlockingIssues(
      primitiveRecord.geometry.issues
    )
  ) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_BLOCKING_ISSUES_PRESENT',
        'ERROR',
        'West primitive admission may not admit a primitive record carrying blocking issues.'
      )
    );
  }

  if (
    !isWestValidBounds(
      primitiveRecord.geometry.bounds,
      toleranceContext
    )
  ) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_BOUNDS_INVALID',
        'ERROR',
        'West primitive admission requires coherent geometry bounds.'
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makePrimitiveEvaluationFailure({
      primitiveRecord,
      issues,
      metadata
    });
  }

  const expectedClosure =
    getExpectedClosure(
      primitiveRecord
    );

  const topologyAnalysis =
    primitiveRecord
      ?.geometry
      ?.metadata
      ?.topologyAnalysis ?? null;

  if (
    isTopologyBearingPrimitive(
      primitiveRecord
    )
  ) {
    if (
      !isPlainObject(
        topologyAnalysis
      )
    ) {
      issues.push(
        createWestIssue(
          'WEST_TOPOLOGY_ANALYSIS_MISSING',
          'ERROR',
          'West triangle-bearing primitive admission requires topology analysis in geometry metadata.'
        )
      );
    } else if (
      expectedClosure ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure
        .CLOSED_REQUIRED
    ) {
      if (
        !isClosedOutwardTopologyAnalysis(
          topologyAnalysis
        )
      ) {
        issues.push(
          createWestIssue(
            'WEST_CLOSED_OUTWARD_TOPOLOGY_REQUIRED',
            'ERROR',
            'Closed-required primitive admission requires East closed outward manifold classification with satisfied closure requirements and zero directed conflicts.',
            {
              classification:
                topologyAnalysis?.classification ??
                null,

              structurallyClosed:
                topologyAnalysis?.structurallyClosed ??
                false,

              closed:
                topologyAnalysis?.closed ?? false,

              outwardClosed:
                topologyAnalysis?.outwardClosed ??
                false,

              directedConflictCount:
                Array.isArray(
                  topologyAnalysis
                    ?.topology
                    ?.directedConflicts
                )
                  ? topologyAnalysis
                      .topology
                      .directedConflicts
                      .length
                  : null,

              closureRequirements:
                topologyAnalysis
                  ?.closureRequirements ?? null,

              shellCount:
                topologyAnalysis
                  ?.shellAnalysis
                  ?.shellCount ?? null,

              outwardShellCount:
                topologyAnalysis
                  ?.shellAnalysis
                  ?.outwardShellCount ?? null,

              inwardShellCount:
                topologyAnalysis
                  ?.shellAnalysis
                  ?.inwardShellCount ?? null
            }
          )
        );
      }
    } else {
      if (
        !isLawfulOpenOrClosedTopologyAnalysis(
          topologyAnalysis
        )
      ) {
        issues.push(
          createWestIssue(
            'WEST_LAWFUL_OPEN_OR_CLOSED_TOPOLOGY_REQUIRED',
            'ERROR',
            'Open or unspecified primitive admission requires either a lawful East open manifold or a lawful East closed outward manifold.',
            {
              classification:
                topologyAnalysis?.classification ??
                null,

              structurallyClosed:
                topologyAnalysis?.structurallyClosed ??
                false,

              closed:
                topologyAnalysis?.closed ?? false,

              outwardClosed:
                topologyAnalysis?.outwardClosed ??
                false
            }
          )
        );
      }
    }
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makePrimitiveEvaluationFailure({
      primitiveRecord,
      issues,
      metadata,
      disposition:
        H_EARTH_3D_GEOMETRY_WEST_ENUMS
          .admissionDisposition
          .HOLD
    });
  }

  return makePrimitiveEvaluationSuccess({
    primitiveRecord,
    issues,
    metadata: {
      ...metadata,
      expectedClosure,
      topologyAnalysis
    },
    disposition:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admissionDisposition
        .ADMIT
  });
}


export function admitHEarthPrimitiveRecord(
  primitiveRecord,
  {
    admissionId =
      isHEarthNonEmptyString(
        primitiveRecord?.primitiveId
      )
        ? `${primitiveRecord.primitiveId}:west-admission`
        : 'west-admission',
    metadata = null,
    toleranceContext
  } = {}
) {
  const evaluation =
    evaluateHEarthPrimitiveAdmission(
      primitiveRecord,
      {
        toleranceContext,
        metadata
      }
    );

  if (
    !evaluation.valid ||
    evaluation.disposition !==
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admissionDisposition
        .ADMIT
  ) {
    return deepFreeze({
      valid:
        false,

      admissionId:
        null,

      primitive:
        null,

      geometry:
        null,

      evaluation,

      issues:
        evaluation.issues
    });
  }

  const admittedGeometry =
    createHEarthAdmittedGeometryRecord({
      neutralPrimitive:
        primitiveRecord,
      admissionEvaluation:
        evaluation,
      admissionId,
      metadata: {
        primitiveId:
          primitiveRecord.primitiveId,
        expectedClosure:
          evaluation.metadata
            ?.expectedClosure ?? null
      },
      issues:
        evaluation.issues,
      toleranceContext
    });

  if (!admittedGeometry) {
    return deepFreeze({
      valid:
        false,

      admissionId:
        null,

      primitive:
        null,

      geometry:
        null,

      evaluation,

      issues:
        deepFreeze([
          createWestIssue(
            'WEST_ADMITTED_GEOMETRY_CREATION_FAILED',
            'ERROR',
            'West admitted geometry record could not be created.'
          )
        ])
    });
  }

  const admittedPrimitive =
    createHEarthAdmittedPrimitiveRecord({
      neutralPrimitive:
        primitiveRecord,
      admittedGeometry,
      admissionEvaluation:
        evaluation,
      admissionId,
      metadata: {
        expectedClosure:
          evaluation.metadata
            ?.expectedClosure ?? null,
        topologyAnalysis:
          evaluation.metadata
            ?.topologyAnalysis ?? null
      },
      issues:
        evaluation.issues,
      toleranceContext
    });

  if (!admittedPrimitive) {
    return deepFreeze({
      valid:
        false,

      admissionId:
        null,

      primitive:
        null,

      geometry:
        admittedGeometry,
      evaluation,

      issues:
        deepFreeze([
          createWestIssue(
            'WEST_ADMITTED_PRIMITIVE_CREATION_FAILED',
            'ERROR',
            'West admitted primitive record could not be created.'
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    admissionId,

    primitive:
      admittedPrimitive,

    geometry:
      admittedGeometry,

    evaluation,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 07 · AGGREGATE-FRAME ADMISSION
 * ========================================================================== */

export function evaluateHEarthPrimitiveBatchAdmission(
  primitiveRecords = [],
  {
    frameId = 'west-aggregate-frame',
    toleranceContext,
    metadata = null,
    requireAllAdmitted = true
  } = {}
) {
  const issues = [];
  const evaluations = [];
  const admittedCandidates = [];
  const values =
    ensureArray(primitiveRecords);

  if (
    !isHEarthNonEmptyString(frameId)
  ) {
    issues.push(
      createWestIssue(
        'WEST_FRAME_ID_INVALID',
        'ERROR',
        'Aggregate-frame admission requires a nonempty frameId.'
      )
    );
  }

  if (values.length === 0) {
    issues.push(
      createWestIssue(
        'WEST_PRIMITIVE_BATCH_EMPTY',
        'ERROR',
        'Aggregate-frame admission requires at least one primitive candidate.'
      )
    );
  }

  if (
    !hasValidOrOmittedToleranceContext(
      toleranceContext
    )
  ) {
    issues.push(
      createWestIssue(
        'WEST_BATCH_TOLERANCE_CONTEXT_INVALID',
        'ERROR',
        'Aggregate-frame admission requires an omitted or valid explicit tolerance context.'
      )
    );
  }

  const primitiveIdSet =
    new Set();

  for (const primitiveRecord of values) {
    if (
      !isHEarthNeutralPrimitiveRecord(
        primitiveRecord
      )
    ) {
      issues.push(
        createWestIssue(
          'WEST_BATCH_CANDIDATE_INVALID',
          'ERROR',
          'Aggregate-frame admission requires every candidate to be a lawful South neutral primitive record.'
        )
      );
      continue;
    }

    if (
      primitiveIdSet.has(
        primitiveRecord.primitiveId
      )
    ) {
      issues.push(
        createWestIssue(
          'WEST_DUPLICATE_PRIMITIVE_ID',
          'ERROR',
          'Aggregate-frame admission requires unique primitive IDs.',
          {
            primitiveId:
              primitiveRecord.primitiveId
          }
        )
      );
      continue;
    }

    primitiveIdSet.add(
      primitiveRecord.primitiveId
    );

    const evaluation =
      evaluateHEarthPrimitiveAdmission(
        primitiveRecord,
        {
          toleranceContext,
          metadata: {
            frameId
          }
        }
      );

    evaluations.push(
      evaluation
    );

    if (
      evaluation.valid &&
      evaluation.disposition ===
        H_EARTH_3D_GEOMETRY_WEST_ENUMS
          .admissionDisposition
          .ADMIT
    ) {
      admittedCandidates.push(
        primitiveRecord
      );
    } else {
      issues.push(
        ...evaluation.issues
      );
    }
  }

  if (
    requireAllAdmitted === true &&
    admittedCandidates.length !==
      values.length
  ) {
    issues.push(
      createWestIssue(
        'WEST_BATCH_REQUIRES_ALL_ADMISSIBLE',
        'ERROR',
        'Aggregate-frame admission requires every primitive candidate to admit lawfully in the same batch.',
        {
          totalCandidates:
            values.length,
          admissibleCandidates:
            admittedCandidates.length
        }
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return deepFreeze({
      valid:
        false,

      frameId,
      evaluations:
        deepFreeze(evaluations),

      bounds:
        null,

      admittedCandidateCount:
        admittedCandidates.length,

      issues:
        sortHEarthGeometryIssues(
          issues
        ),

      metadata:
        freezeClone(metadata),

      disposition:
        H_EARTH_3D_GEOMETRY_WEST_ENUMS
          .admissionDisposition
          .HOLD
    });
  }

  const mergedBounds =
    mergeBoundsForWest(
      admittedCandidates.map(
        (primitiveRecord) =>
          primitiveRecord.geometry.bounds
      ),
      toleranceContext
    );

  if (
    !isWestValidBounds(
      mergedBounds,
      toleranceContext
    )
  ) {
    return deepFreeze({
      valid:
        false,

      frameId,
      evaluations:
        deepFreeze(evaluations),

      bounds:
        null,

      admittedCandidateCount:
        admittedCandidates.length,

      issues:
        deepFreeze([
          createWestIssue(
            'WEST_BATCH_BOUNDS_MERGE_FAILED',
            'ERROR',
            'Aggregate-frame admission could not merge admitted candidate bounds.'
          )
        ]),

      metadata:
        freezeClone(metadata),

      disposition:
        H_EARTH_3D_GEOMETRY_WEST_ENUMS
          .admissionDisposition
          .HOLD
    });
  }

  return deepFreeze({
    valid:
      true,

    frameId,
    evaluations:
      deepFreeze(evaluations),

    bounds:
      mergedBounds,

    admittedCandidateCount:
      admittedCandidates.length,

    issues:
      sortHEarthGeometryIssues(
        issues
      ),

    metadata:
      freezeClone(metadata),

    disposition:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admissionDisposition
        .ADMIT
  });
}


export function admitHEarthPrimitiveBatch(
  primitiveRecords = [],
  {
    frameId = 'west-aggregate-frame',
    toleranceContext,
    metadata = null
  } = {}
) {
  const batchEvaluation =
    evaluateHEarthPrimitiveBatchAdmission(
      primitiveRecords,
      {
        frameId,
        toleranceContext,
        metadata,
        requireAllAdmitted:
          true
      }
    );

  if (
    !batchEvaluation.valid ||
    batchEvaluation.disposition !==
      H_EARTH_3D_GEOMETRY_WEST_ENUMS
        .admissionDisposition
        .ADMIT
  ) {
    return deepFreeze({
      valid:
        false,

      frame:
        null,

      primitiveAdmissions:
        deepFreeze([]),

      evaluation:
        batchEvaluation,

      issues:
        batchEvaluation.issues
    });
  }

  const primitiveAdmissions = [];

  for (const primitiveRecord of primitiveRecords) {
    const admission =
      admitHEarthPrimitiveRecord(
        primitiveRecord,
        {
          admissionId:
            `${primitiveRecord.primitiveId}:west-admission`,
          metadata: {
            frameId
          },
          toleranceContext
        }
      );

    if (!admission.valid) {
      return deepFreeze({
        valid:
          false,

        frame:
          null,

        primitiveAdmissions:
          deepFreeze(
            primitiveAdmissions
          ),

        evaluation:
          batchEvaluation,

        issues:
          admission.issues
      });
    }

    primitiveAdmissions.push(
      admission
    );
  }

  const admittedPrimitives =
    primitiveAdmissions.map(
      (admission) =>
        admission.primitive
    );

  const frame =
    createHEarthAggregateFrameAdmissionRecord({
      frameId,
      admittedPrimitives,
      bounds:
        batchEvaluation.bounds,
      metadata: {
        primitiveCount:
          admittedPrimitives.length,
        frameCandidateClass:
          H_EARTH_3D_GEOMETRY_WEST_ENUMS
            .candidateClass
            .AGGREGATE_FRAME,
        ...metadata
      },
      issues:
        batchEvaluation.issues,
      toleranceContext
    });

  if (!frame) {
    return deepFreeze({
      valid:
        false,

      frame:
        null,

      primitiveAdmissions:
        deepFreeze(
          primitiveAdmissions
        ),

      evaluation:
        batchEvaluation,

      issues:
        deepFreeze([
          createWestIssue(
            'WEST_AGGREGATE_FRAME_CREATION_FAILED',
            'ERROR',
            'West aggregate-frame admission record could not be created.'
          )
        ])
    });
  }

  return deepFreeze({
    valid:
      true,

    frame,
    primitiveAdmissions:
      deepFreeze(
        primitiveAdmissions
      ),

    evaluation:
      batchEvaluation,

    issues:
      deepFreeze([])
  });
}


/* ==========================================================================
 * 08 · OWNERSHIP
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY',

    owns:
      deepFreeze([
        'PRIMITIVE_ADMISSION_EVALUATION',
        'PRIMITIVE_ADMISSION_RECORDS',
        'AGGREGATE_FRAME_ADMISSION',
        'ADMITTED_GEOMETRY_RECORDS',
        'ADMITTED_PRIMITIVE_RECORDS',
        'ADMITTED_AGGREGATE_FRAME_RECORDS',
        'BATCH_ADMISSION_EVALUATION',
        'ADMISSION_ISSUE_PRESERVATION',
        'ADMISSION_BOUNDS_MERGE',
        'DIRECTIONAL_DEPENDENCY_RECHECK'
      ]),

    mustNotOwn:
      deepFreeze([
        'FOUNDATIONAL_MATHEMATICS',
        'MATHEMATICAL_DESCRIPTION',
        'SAMPLING',
        'TOPOLOGY_ANALYSIS',
        'NEUTRAL_PRIMITIVE_CONSTRUCTION',
        'NEUTRAL_GEOMETRY_CONSTRUCTION',
        'PROVIDER_ADMISSION',
        'PROVIDER_ACCOUNTING',
        'CAPACITY_CONSUMPTION',
        'GEOMETRY_INDEX_EXPORT',
        'FACADE_EXPORT_POLICY',
        'COMPOSITOR_POLICY',
        'RENDERER_PROJECTION',
        'DOM_MATERIALIZATION',
        'CSS_MATERIALIZATION',
        'CANVAS_MATERIALIZATION',
        'WEBGL_MATERIALIZATION',
        'VISUAL_APPROVAL',
        'PRODUCTION_AUTHORITY',
        'PUBLIC_RELEASE_AUTHORITY'
      ]),

    imports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js',
        './geometry-kernel.south.js'
      ]),

    prohibitedImports:
      deepFreeze([
        './geometry-kernel.js',
        './geometry-index.js',
        './providers/ground.provider.js',
        './providers/shoreline.provider.js',
        './providers/water.provider.js',
        './providers/tide-pools.provider.js',
        './providers/stones.provider.js',
        './providers/rocks.provider.js',
        './providers/islets.provider.js',
        './providers/bluff.provider.js',
        './providers/manor.provider.js',
        './providers/atmosphere.provider.js',
        './providers/interaction.provider.js',
        '../capacity.js',
        '../environment.js',
        '../compositor.js',
        '../renderer.js',
        '../controller.js',
        '../index.js'
      ])
  });


/* ==========================================================================
 * 09 · DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_CORRECTIONS =
  deepFreeze({
    correctionScopeId:
      H_EARTH_3D_GEOMETRY_WEST_CORRECTION_SCOPE_ID,

    correctionScope:
      'WEST_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY',

    architecturalRewrite:
      false,

    publicApiRedesign:
      false,

    westJurisdictionChange:
      false,

    providerAuthorityCreated:
      false,

    geometryIndexAuthorityCreated:
      false,

    compositorAuthorityCreated:
      false,

    rendererAuthorityCreated:
      false,

    corrections:
      deepFreeze([
        deepFreeze({
          id:
            'WEST_CONSTRUCTION_01',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'West admits only lawful South neutral primitive and geometry records.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_02',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Closed-required primitive admission rechecks East closed outward topology using outwardClosed, closure requirements, and directed-conflict freedom.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_03',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Direct admitted-record factories require an unforgeable module-local admission proof.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_04',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Admitted primitive creation enforces full geometry correspondence across vertices, indices, normals, transform, attributes, source, and bounds.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_05',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Aggregate-frame admission derives or verifies frame bounds from independently recomputed member bounds.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_06',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Bounds comparison uses combined operand scale when explicit tolerance context is omitted.'
        }),

        deepFreeze({
          id:
            'WEST_CONSTRUCTION_07',
          status:
            'IMPLEMENTED_CANDIDATE',
          description:
            'Provider, geometry-index, compositor, renderer, visual, production, and public-release authorities remain false.'
        })
      ]),

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 10 · REQUIRED FIXTURES
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_REQUIRED_FIXTURES =
  deepFreeze([
    'WEST_IMPORTS_NORTH_EAST_AND_SOUTH_ONLY',
    'WEST_NAMED_IMPORTS_RESOLVE',
    'WEST_NAMED_IMPORTS_ARE_USED',
    'NO_PROHIBITED_IMPORTS',

    'WEST_REJECTS_NON_NEUTRAL_PRIMITIVE_RECORD',
    'WEST_REJECTS_ALREADY_ADMITTED_PRIMITIVE',
    'WEST_REJECTS_BLOCKING_PRIMITIVE_ISSUES',
    'WEST_REJECTS_INVALID_BOUNDS',

    'WEST_ADMITS_POINT_PRIMITIVE',
    'WEST_ADMITS_OPEN_TRIANGLE_PRIMITIVE',
    'WEST_ADMITS_CLOSED_PRISM_PRIMITIVE',
    'WEST_CLOSED_REQUIRED_RECHECKS_OUTWARD_CLOSED',
    'WEST_CLOSED_REQUIRED_RECHECKS_ZERO_DIRECTED_CONFLICTS',
    'WEST_CLOSED_REQUIRED_RECHECKS_CLOSURE_REQUIREMENTS',
    'WEST_OPEN_ALLOWED_ACCEPTS_OPEN_MANIFOLD',
    'WEST_OPEN_ALLOWED_ACCEPTS_CLOSED_OUTWARD_MANIFOLD',
    'WEST_REJECTS_INVALID_TRIANGLE_TOPOLOGY_ANALYSIS',

    'WEST_ADMITTED_GEOMETRY_RECORD_IS_ADMITTED',
    'WEST_ADMITTED_PRIMITIVE_RECORD_IS_ADMITTED',
    'WEST_ADMITTED_PRIMITIVE_RECORD_PROVIDER_OUTPUT_FALSE',

    'WEST_BATCH_REQUIRES_UNIQUE_PRIMITIVE_IDS',
    'WEST_BATCH_REQUIRES_ALL_MEMBERS_ADMISSIBLE',
    'WEST_BATCH_MERGES_BOUNDS_COHERENTLY',
    'WEST_BATCH_CREATES_ADMITTED_AGGREGATE_FRAME',
    'WEST_AGGREGATE_FRAME_PROVIDER_OUTPUT_FALSE',
    'WEST_AGGREGATE_FRAME_GEOMETRY_INDEX_EXPORT_FALSE',
    'WEST_AGGREGATE_FRAME_COMPOSITOR_INTEGRATION_FALSE',
    'WEST_AGGREGATE_FRAME_RENDERER_INTEGRATION_FALSE',
    'WEST_AGGREGATE_FRAME_VISUAL_APPROVAL_FALSE',
    'WEST_AGGREGATE_FRAME_PRODUCTION_AUTHORITY_FALSE',
    'WEST_AGGREGATE_FRAME_PUBLIC_RELEASE_FALSE',

    'WEST_DIRECT_GEOMETRY_FACTORY_REJECTS_MISSING_ADMISSION_PROOF',
    'WEST_DIRECT_PRIMITIVE_FACTORY_REJECTS_MISSING_ADMISSION_PROOF',
    'WEST_REJECTS_FORGED_PLAIN_OBJECT_ADMISSION_PROOF',
    'WEST_ADMISSION_PROOF_REQUIRES_EXACT_NEUTRAL_PRIMITIVE_REFERENCE',

    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_VERTEX_MISMATCH',
    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_INDEX_MISMATCH',
    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_NORMAL_MISMATCH',
    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_TRANSFORM_MISMATCH',
    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_ATTRIBUTE_MISMATCH',
    'WEST_PRIMITIVE_GEOMETRY_CORRESPONDENCE_REJECTS_SOURCE_MISMATCH',

    'WEST_FRAME_VALIDATOR_RECOMPUTES_MEMBER_BOUNDS',
    'WEST_FRAME_VALIDATOR_REJECTS_MATCHING_BUT_FALSE_STORED_BOUNDS',
    'WEST_FRAME_VALIDATOR_REQUIRES_PRIMITIVE_ID_ORDER_MATCH',
    'WEST_FRAME_VALIDATOR_REJECTS_DUPLICATE_ADMISSION_IDS',

    'WEST_BOUNDS_COMPARISON_CONTEXT_USES_COMBINED_OPERAND_SCALE',
    'WEST_BOUNDS_COMPARISON_IS_ARGUMENT_ORDER_INDEPENDENT',

    'NO_PROVIDER_AUTHORITY_CREATED',
    'NO_GEOMETRY_INDEX_AUTHORITY_CREATED',
    'NO_COMPOSITOR_AUTHORITY_CREATED',
    'NO_RENDERER_AUTHORITY_CREATED',
    'NO_VISUAL_APPROVAL_CREATED',
    'NO_PRODUCTION_AUTHORITY_CREATED',
    'NO_PUBLIC_RELEASE_AUTHORITY_CREATED'
  ]);


/* ==========================================================================
 * 11 · PRE-BACKING GATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_PRE_BACKING_GATE =
  deepFreeze({
    gateId:
      'WEST_PRE_BACKING_GATE_v1',

    requiredSequence:
      deepFreeze([
        'NODE_SYNTAX_CHECK',
        'NAMED_IMPORT_RESOLUTION',
        'UNUSED_IMPORT_SCAN',
        'PROHIBITED_IMPORT_SCAN',
        'STATIC_SELF_REVIEW',
        'EXECUTABLE_FIXTURE_CORRIDOR',
        'DIRECTIONAL_DEPENDENCY_RECHECK',
        'FIXTURES_FAILED_ZERO'
      ]),

    nodeSyntaxCheckCommand:
      'node --check geometry-kernel.west.js',

    allowedImports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js',
        './geometry-kernel.south.js'
      ]),

    requiredFixtureCount:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_REQUIRED_FIXTURES
        .length,

    nodeSyntaxCheckPerformed:
      false,

    namedImportResolutionScanPerformed:
      false,

    unusedImportScanPerformed:
      false,

    prohibitedImportScanPerformed:
      false,

    staticSelfReviewPerformed:
      false,

    executableFixtureReviewPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

    negativeFixtureExecutionPerformed:
      false,

    directionalDependencyRecheckPerformed:
      false,

    fixturesFailed:
      null,

    gatePassed:
      false
  });


/* ==========================================================================
 * 12 · STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryKernelWestStaticReview() {
  const pointCandidate =
    constructHEarthPoint({
      primitiveId:
        'WEST_STATIC_POINT',
      position:
        deepFreeze({
          x: 0,
          y: 0,
          z: 0
        })
    });

  const triangleCandidate =
    constructHEarthTriangle({
      primitiveId:
        'WEST_STATIC_TRIANGLE',
      a:
        deepFreeze({
          x: 0,
          y: 0,
          z: 0
        }),
      b:
        deepFreeze({
          x: 1,
          y: 0,
          z: 0
        }),
      c:
        deepFreeze({
          x: 0,
          y: 0,
          z: 1
        })
    });

  const prismCandidate =
    constructHEarthPrismMesh({
      primitiveId:
        'WEST_STATIC_PRISM',
      radius:
        1,
      height:
        2,
      sideCount:
        6
    });

  const pointAdmission =
    evaluateHEarthPrimitiveAdmission(
      pointCandidate.primitiveRecord
    );

  const triangleAdmission =
    evaluateHEarthPrimitiveAdmission(
      triangleCandidate.primitiveRecord
    );

  const prismAdmission =
    evaluateHEarthPrimitiveAdmission(
      prismCandidate.primitiveRecord
    );

  const pointAdmitted =
    admitHEarthPrimitiveRecord(
      pointCandidate.primitiveRecord
    );

  const triangleAdmitted =
    admitHEarthPrimitiveRecord(
      triangleCandidate.primitiveRecord
    );

  const batchAdmission =
    admitHEarthPrimitiveBatch(
      [
        pointCandidate.primitiveRecord,
        triangleCandidate.primitiveRecord
      ],
      {
        frameId:
          'WEST_STATIC_FRAME'
      }
    );

  const duplicateBatchEvaluation =
    evaluateHEarthPrimitiveBatchAdmission(
      [
        pointCandidate.primitiveRecord,
        deepFreeze({
          ...pointCandidate.primitiveRecord
        })
      ],
      {
        frameId:
          'WEST_STATIC_DUPLICATE_FRAME'
      }
    );

  const forgedEvaluation =
    deepFreeze({
      valid:
        true,
      primitiveRecord:
        pointCandidate.primitiveRecord,
      disposition:
        H_EARTH_3D_GEOMETRY_WEST_ENUMS
          .admissionDisposition
          .ADMIT,
      admitted:
        false,
      admissionAuthority:
        'WEST_ONLY',
      metadata:
        null,
      issues:
        deepFreeze([])
    });

  const directGeometryWithoutProof =
    createHEarthAdmittedGeometryRecord({
      neutralPrimitive:
        pointCandidate.primitiveRecord,
      admissionEvaluation:
        forgedEvaluation,
      admissionId:
        'FORGED:GEOMETRY'
    });

  const directPrimitiveWithoutProof =
    pointAdmitted.valid
      ? createHEarthAdmittedPrimitiveRecord({
          neutralPrimitive:
            pointCandidate.primitiveRecord,
          admittedGeometry:
            pointAdmitted.geometry,
          admissionEvaluation:
            forgedEvaluation,
          admissionId:
            pointAdmitted.admissionId
        })
      : null;

  const mismatchedPrimitive =
    pointAdmitted.valid &&
    triangleAdmitted.valid
      ? createHEarthAdmittedPrimitiveRecord({
          neutralPrimitive:
            pointCandidate.primitiveRecord,
          admittedGeometry:
            triangleAdmitted.geometry,
          admissionEvaluation:
            pointAdmitted.evaluation,
          admissionId:
            pointAdmitted.admissionId
        })
      : null;

  const mismatchedFrame =
    pointAdmitted.valid &&
    triangleAdmitted.valid
      ? createHEarthAggregateFrameAdmissionRecord({
          frameId:
            'WEST_STATIC_BAD_FRAME',
          admittedPrimitives: [
            pointAdmitted.primitive,
            triangleAdmitted.primitive
          ],
          bounds:
            pointAdmitted.geometry.bounds
        })
      : null;

  const checks =
    deepFreeze([
      deepFreeze({
        id:
          'WEST_IMPORTS_NORTH_EAST_AND_SOUTH_ONLY',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .imports.length === 3 &&
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .imports.includes('./geometry-kernel.north.js') &&
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .imports.includes('./geometry-kernel.east.js') &&
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .imports.includes('./geometry-kernel.south.js')
      }),

      deepFreeze({
        id:
          'NORTH_SCHEMA_VERSION_AT_LEAST_THREE',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION >=
            3
      }),

      deepFreeze({
        id:
          'EAST_SCHEMA_VERSION_AT_LEAST_TWO',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION >=
            2
      }),

      deepFreeze({
        id:
          'SOUTH_SCHEMA_VERSION_AT_LEAST_TWO',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION >=
            2
      }),

      deepFreeze({
        id:
          'POINT_PRIMITIVE_ADMITS',
        passed:
          pointAdmission.valid === true &&
          pointAdmission.disposition ===
            H_EARTH_3D_GEOMETRY_WEST_ENUMS
              .admissionDisposition
              .ADMIT
      }),

      deepFreeze({
        id:
          'OPEN_TRIANGLE_PRIMITIVE_ADMITS',
        passed:
          triangleAdmission.valid === true &&
          triangleAdmission.disposition ===
            H_EARTH_3D_GEOMETRY_WEST_ENUMS
              .admissionDisposition
              .ADMIT
      }),

      deepFreeze({
        id:
          'CLOSED_PRISM_PRIMITIVE_ADMITS',
        passed:
          prismAdmission.valid === true &&
          prismAdmission.disposition ===
            H_EARTH_3D_GEOMETRY_WEST_ENUMS
              .admissionDisposition
              .ADMIT
      }),

      deepFreeze({
        id:
          'BATCH_FRAME_CREATES_ADMITTED_FRAME',
        passed:
          batchAdmission.valid === true &&
          isHEarthAggregateFrameAdmissionRecord(
            batchAdmission.frame
          )
      }),

      deepFreeze({
        id:
          'DUPLICATE_PRIMITIVE_ID_BATCH_REJECTED',
        passed:
          duplicateBatchEvaluation.valid === false
      }),

      deepFreeze({
        id:
          'DIRECT_GEOMETRY_FACTORY_REJECTS_FORGED_PROOF',
        passed:
          directGeometryWithoutProof === null
      }),

      deepFreeze({
        id:
          'DIRECT_PRIMITIVE_FACTORY_REJECTS_FORGED_PROOF',
        passed:
          directPrimitiveWithoutProof === null
      }),

      deepFreeze({
        id:
          'GEOMETRY_CORRESPONDENCE_ENFORCED',
        passed:
          mismatchedPrimitive === null
      }),

      deepFreeze({
        id:
          'FRAME_BOUNDS_PROVENANCE_ENFORCED',
        passed:
          mismatchedFrame === null
      }),

      deepFreeze({
        id:
          'PROVIDER_AUTHORITY_NOT_OWNED',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .mustNotOwn.includes(
              'PROVIDER_ADMISSION'
            )
      }),

      deepFreeze({
        id:
          'GEOMETRY_INDEX_AUTHORITY_NOT_OWNED',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .mustNotOwn.includes(
              'GEOMETRY_INDEX_EXPORT'
            )
      }),

      deepFreeze({
        id:
          'RENDERER_AUTHORITY_NOT_OWNED',
        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP
            .mustNotOwn.includes(
              'RENDERER_PROJECTION'
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
      'H_EARTH_3D_GEOMETRY_KERNEL_WEST_STATIC_SELF_REVIEW_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_WEST_CORRECTION_SCOPE_ID,

    passed,

    status:
      passed
        ? 'STATIC_SELF_REVIEW_PASS_CANDIDATE'
        : 'STATIC_SELF_REVIEW_HOLD',

    checks,

    nodeSyntaxCheckPerformed:
      false,

    namedImportResolutionScanPerformed:
      false,

    unusedImportScanPerformed:
      false,

    prohibitedImportScanPerformed:
      false,

    executableFixtureReviewPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

      negativeFixtureExecutionPerformed:
      false,

    directionalDependencyRecheckPerformed:
      false,

    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });
}


/* ==========================================================================
 * 13 · RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_KERNEL_WEST_IMPLEMENTATION_CANDIDATE_RECEIPT_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_WEST_CORRECTION_SCOPE_ID,

    implementationBodyExists:
      true,

    targetedCorrectionsImplemented:
      true,

    nodeSyntaxCheckPerformed:
      false,

    prohibitedImportScanPerformed:
      false,

    namedImportResolutionScanPerformed:
      false,

    unusedImportScanPerformed:
      false,

    staticSelfReviewPerformed:
      false,

    executableFixtureReviewPerformed:
      false,

    directionalDependencyRecheckPerformed:
      false,

    testExecutionPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

    negativeFixtureExecutionPerformed:
      false,

    fixturesFailed:
      null,

    executableCorridorReceiptIssued:
      false,

    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    westLocalAdmission:
      false,

    westPublicSymbolFreeze:
      false,

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
      'NODE_SYNTAX_CHECK_THEN_NAMED_IMPORT_RESOLUTION_THEN_UNUSED_IMPORT_SCAN_THEN_PROHIBITED_IMPORT_SCAN_THEN_STATIC_SELF_REVIEW_THEN_EXECUTABLE_FIXTURE_CORRIDOR_THEN_DIRECTIONAL_DEPENDENCY_RECHECK_THEN_FIXTURES_FAILED_ZERO'
  });


/* ==========================================================================
 * 14 · PUBLIC API CANDIDATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-kernel.west.js',

    classification:
      'WEST_PUBLIC_CANDIDATE',

    symbols:
      deepFreeze([
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE',
        'H_EARTH_3D_GEOMETRY_WEST_ENUMS',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_CORRECTIONS',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_REQUIRED_FIXTURES',
        'H_EARTH_3D_GEOMETRY_KERNEL_WEST_PRE_BACKING_GATE',
        'createHEarthAdmittedGeometryRecord',
        'createHEarthAdmittedPrimitiveRecord',
        'createHEarthAggregateFrameAdmissionRecord',
        'isHEarthAdmittedGeometryRecord',
        'isHEarthAdmittedPrimitiveRecord',
        'isHEarthAggregateFrameAdmissionRecord',
        'evaluateHEarthPrimitiveAdmission',
        'admitHEarthPrimitiveRecord',
        'evaluateHEarthPrimitiveBatchAdmission',
        'admitHEarthPrimitiveBatch',
        'getHEarthGeometryKernelWestStaticReview',
        'getHEarthGeometryKernelWestReceipt',
        'getHEarthGeometryKernelWestContract'
      ]),

    collisionStatus:
      'NOT_YET_REVIEWED',

    implementationStatus:
      'IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 15 · CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_WEST_CORRECTION_SCOPE_ID,

    correctionScope:
      'WEST_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY',

    northDependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,

    northDependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,

    eastDependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,

    eastDependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,

    southDependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,

    southDependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,

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

    mathematicsStandard:
      'FROZEN',

    frozenScope:
      'GEOMETRY_MATHEMATICS_ONLY',

    jurisdiction:
      'PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY',

    dependencyDirection:
      'NORTH_EAST_AND_SOUTH_TO_WEST',

    imports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js',
        './geometry-kernel.south.js'
      ]),

    ownership:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_OWNERSHIP,

    corrections:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CORRECTIONS,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_REQUIRED_FIXTURES,

    preBackingGate:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_PRE_BACKING_GATE,

    enums:
      H_EARTH_3D_GEOMETRY_WEST_ENUMS,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_RECEIPT,

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    testExecutionPerformed:
      false,

    westLocalAdmission:
      false,

    westPublicSymbolFreeze:
      false,

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
      false
  });


/* ==========================================================================
 * 16 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryKernelWestReceipt() {
  return H_EARTH_3D_GEOMETRY_KERNEL_WEST_RECEIPT;
}


export function getHEarthGeometryKernelWestContract() {
  return H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT;
}


export default H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT;
