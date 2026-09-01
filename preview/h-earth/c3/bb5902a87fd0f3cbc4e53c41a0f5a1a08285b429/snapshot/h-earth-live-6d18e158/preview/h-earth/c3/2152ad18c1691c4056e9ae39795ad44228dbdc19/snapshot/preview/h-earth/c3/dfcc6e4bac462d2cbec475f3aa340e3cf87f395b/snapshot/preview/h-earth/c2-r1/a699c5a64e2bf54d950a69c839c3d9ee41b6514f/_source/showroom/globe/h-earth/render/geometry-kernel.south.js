/**
 * /showroom/globe/h-earth/render/geometry-kernel.south.js
 * COMPLETE CORRECTED FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1
 *
 * DEPENDS ON:
 * H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1
 *
 * CORRECTION SCOPE:
 * STEP_034O_4S_REQUIRED_TARGETED_CORRECTION_SCOPE_v1
 *
 * CORRECTION CLASS:
 * SOUTH_TOPOLOGY_WINDING_AND_EXECUTABLE_FIXTURE_CORRECTION_ONLY.
 *
 * STATUS:
 * SOUTH TOPOLOGY-CORRECTED IMPLEMENTATION CANDIDATE.
 *
 * IMPLEMENTATION CONFORMANCE:
 * HOLD_PENDING_EXECUTABLE_CORRIDOR.
 *
 * SOUTH LOCAL ADMISSION:
 * FALSE.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthFiniteNumber,
  isHEarthPositiveFiniteNumber,
  isHEarthNonNegativeSafeInteger,
  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  lerpHEarthNumber,

  createHEarthVector3,
  isHEarthVector3,
  addHEarthVector3,
  subtractHEarthVector3,
  scaleHEarthVector3,
  dotHEarthVector3,
  crossHEarthVector3,
  getHEarthVector3Distance,
  normalizeHEarthVector3,

  createHEarthIdentityMatrix4,
  isHEarthMatrix4,

  createHEarthGeometryBounds,
  createHEarthBillboardConservativeBounds,
  isHEarthAABB3D,

  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext
} from './geometry-kernel.north.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_EAST_ENUMS,

  sampleHEarthParametricSurface,
  sampleHEarthHeightField,
  evaluateHEarthGridSampleIntegrity,

  evaluateHEarthTriangleNormal,
  calculateHEarthFaceNormals,
  calculateHEarthVertexNormals,
  evaluateHEarthIndexedMesh,

  triangulateHEarthConvexPolygon
} from './geometry-kernel.east.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION = 2;

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/geometry-kernel.south.js';

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

export const H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID =
  'STEP_034O_4S_REQUIRED_TARGETED_CORRECTION_SCOPE_v1';


/* ==========================================================================
 * 02 · INTERNAL STRUCTURE
 * ========================================================================== */

const H_EARTH_3D_GEOMETRY_SOUTH_PARALLEL_ALIGNMENT_EPSILON =
  1e-9;


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


function cloneVector3(vector) {
  return isHEarthVector3(vector)
    ? createHEarthVector3(
        vector.x,
        vector.y,
        vector.z
      )
    : null;
}


function cloneVector3Array(values) {
  if (
    !Array.isArray(values) ||
    !values.every(isHEarthVector3)
  ) {
    return null;
  }

  const clones =
    values.map(cloneVector3);

  return clones.every(isHEarthVector3)
    ? clones
    : null;
}


function signedPower(value, exponent) {
  if (
    !isHEarthFiniteNumber(value) ||
    !isHEarthPositiveFiniteNumber(exponent)
  ) {
    return Number.NaN;
  }

  const result =
    Math.sign(value) *
    Math.pow(
      Math.abs(value),
      exponent
    );

  return isHEarthFiniteNumber(result)
    ? result
    : Number.NaN;
}


function createSouthIssue(
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
        'geometry-kernel.south.js'
    }
  );
}


function resolveToleranceContext(
  explicitContext,
  bounds = null
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


function areFiniteVector3Array(values) {
  return (
    Array.isArray(values) &&
    values.every(isHEarthVector3)
  );
}


function areValidTriangleIndices(
  indices,
  vertexCount
) {
  return (
    Array.isArray(indices) &&
    indices.length > 0 &&
    indices.length % 3 === 0 &&
    indices.every(
      (index) =>
        isHEarthNonNegativeSafeInteger(index) &&
        index < vertexCount
    )
  );
}


function areValidLineIndices(
  indices,
  vertexCount
) {
  return (
    Array.isArray(indices) &&
    indices.length > 0 &&
    indices.length % 2 === 0 &&
    indices.every(
      (index) =>
        isHEarthNonNegativeSafeInteger(index) &&
        index < vertexCount
    )
  );
}


function isTriangleBearingPrimitiveType(
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
      .primitiveType.EXTRUSION_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.PRISM_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.GABLE_ROOF_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.SHED_ROOF_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.ELLIPSOID_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.SUPERELLIPSOID_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.RADIAL_SHELL_MESH
  ].includes(primitiveType);
}


function isExtrusionPathPrimitiveType(
  primitiveType
) {
  return [
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.EXTRUSION_MESH,
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.PRISM_MESH
  ].includes(primitiveType);
}


function buildSequentialIndices(count) {
  if (
    !isHEarthPositiveSafeInteger(count)
  ) {
    return null;
  }

  return Array.from(
    { length: count },
    (_, index) => index
  );
}


function reverseTriangleIndices(indices) {
  if (
    !Array.isArray(indices) ||
    indices.length === 0 ||
    indices.length % 3 !== 0
  ) {
    return null;
  }

  const reversed = [];

  for (
    let offset = 0;
    offset < indices.length;
    offset += 3
  ) {
    reversed.push(
      indices[offset],
      indices[offset + 2],
      indices[offset + 1]
    );
  }

  return reversed;
}


function offsetTriangleIndices(
  indices,
  vertexOffset
) {
  if (
    !Array.isArray(indices) ||
    !isHEarthNonNegativeSafeInteger(
      vertexOffset
    )
  ) {
    return null;
  }

  return indices.map(
    (index) =>
      index +
      vertexOffset
  );
}


function makeConstructionFailure({
  constructionType,
  issues,
  metadata = null
}) {
  return deepFreeze({
    valid:
      false,

    constructionType,

    projectionNeutral:
      true,

    constructionCompleted:
      false,

    openNeutralMesh:
      false,

    primitiveRecord:
      null,

    geometry:
      null,

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


function makeConstructionSuccess({
  constructionType,
  primitiveRecord,
  geometry,
  issues = [],
  metadata = null,
  openNeutralMesh = false
}) {
  return deepFreeze({
    valid:
      !hasHEarthBlockingIssues(
        issues
      ),

    constructionType,

    projectionNeutral:
      true,

    constructionCompleted:
      true,

    openNeutralMesh:
      openNeutralMesh === true,

    primitiveRecord,

    geometry,

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


function getTopologyDiagnosticDetails(
  topologyAnalysis
) {
  return {
    classification:
      topologyAnalysis?.classification ??
      null,

    structurallyClosed:
      topologyAnalysis?.structurallyClosed ??
      false,

    closed:
      topologyAnalysis?.closed ??
      false,

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
        ?.closureRequirements ??
      null,

    shellCount:
      topologyAnalysis
        ?.shellAnalysis
        ?.shellCount ??
      null,

    outwardShellCount:
      topologyAnalysis
        ?.shellAnalysis
        ?.outwardShellCount ??
      null,

    inwardShellCount:
      topologyAnalysis
        ?.shellAnalysis
        ?.inwardShellCount ??
      null
  };
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


function isOpenManifoldTopologyAnalysis(
  topologyAnalysis
) {
  return (
    isPlainObject(topologyAnalysis) &&
    topologyAnalysis.valid === true &&
    topologyAnalysis.classification ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .topologyClassification
        .OPEN_MANIFOLD
  );
}


/* ==========================================================================
 * 03 · ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_SOUTH_ENUMS =
  deepFreeze({
    primitiveType: deepFreeze({
      POINT:
        'POINT',

      POINT_SET:
        'POINT_SET',

      LINE_SEGMENT:
        'LINE_SEGMENT',

      POLYLINE:
        'POLYLINE',

      TRIANGLE:
        'TRIANGLE',

      TRIANGLE_MESH:
        'TRIANGLE_MESH',

      BILLBOARD:
        'BILLBOARD',

      HEIGHT_FIELD_MESH:
        'HEIGHT_FIELD_MESH',

      PARAMETRIC_SURFACE_MESH:
        'PARAMETRIC_SURFACE_MESH',

      XZ_RIBBON_MESH:
        'XZ_RIBBON_MESH',

      EXTRUSION_MESH:
        'EXTRUSION_MESH',

      PRISM_MESH:
        'PRISM_MESH',

      GABLE_ROOF_MESH:
        'GABLE_ROOF_MESH',

      SHED_ROOF_MESH:
        'SHED_ROOF_MESH',

      ELLIPSOID_MESH:
        'ELLIPSOID_MESH',

      SUPERELLIPSOID_MESH:
        'SUPERELLIPSOID_MESH',

      RADIAL_SHELL_MESH:
        'RADIAL_SHELL_MESH'
    }),

    topologyMode: deepFreeze({
      POINTS:
        'POINTS',

      LINES:
        'LINES',

      TRIANGLES:
        'TRIANGLES'
    }),

    normalMode: deepFreeze({
      NONE:
        'NONE',

      FACE:
        'FACE',

      VERTEX:
        'VERTEX',

      FACE_AND_VERTEX:
        'FACE_AND_VERTEX'
    }),

    ribbonJoin: deepFreeze({
      BEVEL:
        'BEVEL',

      BOUNDED_MITER:
        'BOUNDED_MITER'
    }),

    ribbonCap: deepFreeze({
      NONE:
        'NONE',

      BUTT:
        'BUTT'
    }),

    constructionStatus: deepFreeze({
      CONSTRUCTED:
        'CONSTRUCTED',

      HELD:
        'HELD',

      REJECTED:
        'REJECTED'
    }),

    surfaceClosure: deepFreeze({
      OPEN:
        'OPEN',

      CLOSED:
        'CLOSED',

      UNSPECIFIED:
        'UNSPECIFIED'
    }),

    expectedClosure: deepFreeze({
      OPEN_ALLOWED:
        'OPEN_ALLOWED',

      CLOSED_REQUIRED:
        'CLOSED_REQUIRED',

      UNSPECIFIED:
        'UNSPECIFIED'
    }),

    extrusionPlanFacing: deepFreeze({
      WITH_EXTRUSION:
        'WITH_EXTRUSION',

      AGAINST_EXTRUSION:
        'AGAINST_EXTRUSION'
    }),

    profileBoundaryDirection: deepFreeze({
      FORWARD:
        'FORWARD',

      REVERSED:
        'REVERSED'
    }),

    sphereFamilyTopology: deepFreeze({
      NONDEGENERATE_POLE_FAN:
        'NONDEGENERATE_POLE_FAN'
    })
  });


/* ==========================================================================
 * 04 · NEUTRAL RECORDS
 * ========================================================================== */

export function createHEarthNeutralGeometryRecord({
  geometryId,
  topologyMode,
  vertices,
  indices = [],
  normals = null,
  faceNormals = null,
  bounds,
  transform =
    createHEarthIdentityMatrix4(),
  attributes = null,
  source = null,
  metadata = null
} = {}) {
  if (
    !isHEarthNonEmptyString(geometryId) ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode,
      topologyMode
    ) ||
    !areFiniteVector3Array(vertices) ||
    !Array.isArray(indices) ||
    !isHEarthMatrix4(transform) ||
    !isHEarthAABB3D(bounds)
  ) {
    return null;
  }

  if (
    topologyMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode.TRIANGLES &&
    !areValidTriangleIndices(
      indices,
      vertices.length
    )
  ) {
    return null;
  }

  if (
    topologyMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode.LINES &&
    !areValidLineIndices(
      indices,
      vertices.length
    )
  ) {
    return null;
  }

  if (
    normals !== null &&
    (
      !areFiniteVector3Array(normals) ||
      normals.length !== vertices.length
    )
  ) {
    return null;
  }

  if (
    faceNormals !== null &&
    !Array.isArray(faceNormals)
  ) {
    return null;
  }

  const clonedVertices =
    cloneVector3Array(vertices);

  const clonedNormals =
    normals === null
      ? null
      : cloneVector3Array(normals);

  if (
    !clonedVertices ||
    (
      normals !== null &&
      !clonedNormals
    )
  ) {
    return null;
  }

  return deepFreeze({
    recordType:
      'H_EARTH_PROJECTION_NEUTRAL_GEOMETRY_RECORD',

    geometryId,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    projectionNeutral:
      true,

    topologyMode,

    vertices:
      deepFreeze(clonedVertices),

    indices:
      deepFreeze(indices.slice()),

    normals:
      clonedNormals === null
        ? null
        : deepFreeze(clonedNormals),

    faceNormals:
      faceNormals === null
        ? null
        : freezeClone(faceNormals),

    bounds,

    transform,

    attributes:
      freezeClone(attributes),

    source:
      freezeClone(source),

    metadata:
      freezeClone(metadata),

    admitted:
      false,

    admissionAuthority:
      'WEST_ONLY',

    providerOutput:
      false,

    rendererMaterialized:
      false
  });
}


export function createHEarthNeutralPrimitiveRecord({
  primitiveId,
  primitiveType,
  geometry,
  semanticRole = null,
  materialHint = null,
  visibilityHint = null,
  interactionHint = null,
  metadata = null,
  issues = []
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType,
      primitiveType
    ) ||
    !isPlainObject(geometry) ||
    geometry.recordType !==
      'H_EARTH_PROJECTION_NEUTRAL_GEOMETRY_RECORD' ||
    geometry.projectionNeutral !== true ||
    geometry.admitted !== false ||
    geometry.admissionAuthority !==
      'WEST_ONLY'
  ) {
    return null;
  }

  return deepFreeze({
    recordType:
      'H_EARTH_PROJECTION_NEUTRAL_PRIMITIVE_RECORD',

    primitiveId,

    primitiveType,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    projectionNeutral:
      true,

    geometry,

    semanticRole:
      typeof semanticRole === 'string'
        ? semanticRole
        : null,

    materialHint:
      freezeClone(materialHint),

    visibilityHint:
      freezeClone(visibilityHint),

    interactionHint:
      freezeClone(interactionHint),

    metadata:
      freezeClone(metadata),

    issues:
      sortHEarthGeometryIssues(
        ensureArray(issues)
      ),

    constructionStatus:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .constructionStatus.CONSTRUCTED,

    admitted:
      false,

    admissionAuthority:
      'WEST_ONLY',

    providerOutput:
      false,

    aggregateFrameMember:
      false,

    rendererMaterialized:
      false
  });
}


/* ==========================================================================
 * 05 · NORMAL ATTACHMENT
 * ========================================================================== */

function attachMeshNormals({
  vertices,
  indices,
  normalMode,
  toleranceContext
}) {
  const issues = [];

  if (
    normalMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode.NONE
  ) {
    return {
      valid:
        true,

      normals:
        null,

      faceNormals:
        null,

      issues
    };
  }

  const faceResult =
    calculateHEarthFaceNormals(
      vertices,
      indices,
      toleranceContext
    );

  issues.push(
    ...faceResult.issues
  );

  let vertexResult = null;

  if (
    normalMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode.VERTEX ||
    normalMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode.FACE_AND_VERTEX
  ) {
    vertexResult =
      calculateHEarthVertexNormals(
        vertices,
        indices,
        toleranceContext
      );

    issues.push(
      ...vertexResult.issues
    );
  }

  return {
    valid:
      !hasHEarthBlockingIssues(
        issues
      ),

    normals:
      vertexResult?.vertexNormals ??
      null,

    faceNormals:
      (
        normalMode ===
          H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .normalMode.FACE ||
        normalMode ===
          H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .normalMode.FACE_AND_VERTEX
      )
        ? faceResult.faceNormals
        : null,

    issues
  };
}


/* ==========================================================================
 * 06 · GENERAL TRIANGLE-MESH CONSTRUCTION
 * ========================================================================== */

export function constructHEarthTriangleMesh({
  primitiveId,
  geometryId =
    `${primitiveId ?? 'mesh'}:geometry`,
  primitiveType =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.TRIANGLE_MESH,
  vertices,
  indices,
  normalMode =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .normalMode.FACE_AND_VERTEX,
  expectedClosure =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .expectedClosure.UNSPECIFIED,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  visibilityHint = null,
  interactionHint = null,
  source = null,
  attributes = null,
  metadata = null,
  toleranceContext
} = {}) {
  const issues = [];

  if (
    !isHEarthNonEmptyString(primitiveId)
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_PRIMITIVE_ID_INVALID',
        'ERROR',
        'Triangle-mesh construction requires a nonempty primitiveId.'
      )
    );
  }

  if (
    !isTriangleBearingPrimitiveType(
      primitiveType
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_TRIANGLE_BEARING_PRIMITIVE_TYPE_REQUIRED',
        'ERROR',
        'Triangle-mesh construction requires a lawful triangle-bearing primitive type.',
        {
          primitiveType
        }
      )
    );
  }

  if (
    !areFiniteVector3Array(vertices) ||
    vertices.length < 3
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_MESH_VERTICES_INVALID',
        'ERROR',
        'Triangle-mesh construction requires at least three finite vertices.'
      )
    );
  }

  if (
    !areValidTriangleIndices(
      indices,
      Array.isArray(vertices)
        ? vertices.length
        : 0
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_MESH_INDICES_INVALID',
        'ERROR',
        'Triangle-mesh indices must define one or more valid indexed triangles.'
      )
    );
  }

  if (
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode,
      normalMode
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_NORMAL_MODE_INVALID',
        'ERROR',
        'Triangle-mesh normal mode is unsupported.'
      )
    );
  }

  if (
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure,
      expectedClosure
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_EXPECTED_CLOSURE_INVALID',
        'ERROR',
        'Triangle-mesh expectedClosure is unsupported.'
      )
    );
  }

  if (
    !isHEarthMatrix4(transform)
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_TRANSFORM_INVALID',
        'ERROR',
        'Triangle-mesh transform must be a valid Matrix4.'
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata
    });
  }

  const bounds =
    createHEarthGeometryBounds(
      vertices
    );

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      bounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_TOLERANCE_CONTEXT_INVALID',
        'ERROR',
        'Triangle-mesh construction requires a valid tolerance context.'
      )
    );
  } else if (
    !isHEarthAABB3D(
      bounds,
      resolvedToleranceContext
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_MESH_BOUNDS_INVALID',
        'ERROR',
        'Triangle-mesh bounds could not be derived coherently.'
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata
    });
  }

  const topologyAnalysis =
    evaluateHEarthIndexedMesh(
      vertices,
      indices,
      resolvedToleranceContext
    );

  issues.push(
    ...topologyAnalysis.issues
  );

  const openNeutralMesh =
    isOpenManifoldTopologyAnalysis(
      topologyAnalysis
    );

  const closedOutward =
    isClosedOutwardTopologyAnalysis(
      topologyAnalysis
    );

  if (
    expectedClosure ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.CLOSED_REQUIRED &&
    !closedOutward
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_CLOSED_OUTWARD_TOPOLOGY_REQUIRED',
        'ERROR',
        'This constructor requires East to report a lawful closed outward result through classification, outwardClosed, directed-conflict-free topology, and satisfied closure requirements.',
        getTopologyDiagnosticDetails(
          topologyAnalysis
        )
      )
    );
  }

  if (
    expectedClosure ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED &&
    !openNeutralMesh &&
    !closedOutward
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_OPEN_ALLOWED_TOPOLOGY_INVALID',
        'ERROR',
        'An open-by-design constructor may produce an open manifold or a lawful closed outward manifold, but not invalid topology.',
        getTopologyDiagnosticDetails(
          topologyAnalysis
        )
      )
    );
  }

  if (
    expectedClosure ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.UNSPECIFIED &&
    !openNeutralMesh &&
    !closedOutward
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_GENERAL_MESH_TOPOLOGY_INVALID',
        'ERROR',
        'General neutral mesh construction may not preserve invalid topology.',
        getTopologyDiagnosticDetails(
          topologyAnalysis
        )
      )
    );
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata: {
        ...metadata,
        expectedClosure,
        topologyAnalysis
      }
    });
  }

  const normalAttachment =
    attachMeshNormals({
      vertices,
      indices,
      normalMode,
      toleranceContext:
        resolvedToleranceContext
    });

  issues.push(
    ...normalAttachment.issues
  );

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata: {
        ...metadata,
        expectedClosure,
        topologyAnalysis
      }
    });
  }

  const surfaceClosure =
    openNeutralMesh
      ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .surfaceClosure.OPEN
      : closedOutward
        ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .surfaceClosure.CLOSED
        : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .surfaceClosure.UNSPECIFIED;

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.TRIANGLES,

      vertices,

      indices,

      normals:
        normalAttachment.normals,

      faceNormals:
        normalAttachment.faceNormals,

      bounds,

      transform,

      attributes,

      source,

      metadata: {
        ...metadata,

        expectedClosure,

        topologyAnalysis,

        surfaceClosure,

        openNeutralMeshConstructionValid:
          openNeutralMesh &&
          expectedClosure !==
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .expectedClosure.CLOSED_REQUIRED,

        closedOutwardConstructionValid:
          closedOutward,

        admitted:
          false,

        admissionAuthority:
          'WEST_ONLY'
      }
    });

  if (!geometry) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues: [
        ...issues,

        createSouthIssue(
          'SOUTH_GEOMETRY_RECORD_CREATION_FAILED',
          'ERROR',
          'Triangle-mesh geometry record could not be created.'
        )
      ],

      metadata
    });
  }

  const primitiveRecord =
    createHEarthNeutralPrimitiveRecord({
      primitiveId,

      primitiveType,

      geometry,

      semanticRole,

      materialHint,

      visibilityHint,

      interactionHint,

      metadata: {
        ...metadata,

        expectedClosure,

        openNeutralMesh,

        closedOutward,

        constructionValid:
          true,

        admitted:
          false,

        admissionAuthority:
          'WEST_ONLY'
      },

      issues
    });

  if (!primitiveRecord) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues: [
        ...issues,

        createSouthIssue(
          'SOUTH_PRIMITIVE_RECORD_CREATION_FAILED',
          'ERROR',
          'Triangle-mesh primitive record could not be created.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'TRIANGLE_MESH',

    primitiveRecord,

    geometry,

    issues,

    metadata: {
      ...metadata,

      expectedClosure,

      topologyAnalysis,

      closedOutward
    },

    openNeutralMesh
  });
}


/* ==========================================================================
 * 07 · BASIC CONSTRUCTION
 * ========================================================================== */

export function constructHEarthPoint({
  primitiveId,
  position,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(position) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'POINT',

      issues: [
        createSouthIssue(
          'SOUTH_POINT_INPUT_INVALID',
          'ERROR',
          'Point construction requires a primitiveId, finite position, and valid transform.'
        )
      ],

      metadata
    });
  }

  const bounds =
    createHEarthGeometryBounds([
      position
    ]);

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId:
        `${primitiveId}:geometry`,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.POINTS,

      vertices: [
        position
      ],

      indices: [
        0
      ],

      bounds,

      transform,

      metadata
    });

  const primitiveRecord =
    geometry
      ? createHEarthNeutralPrimitiveRecord({
          primitiveId,

          primitiveType:
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .primitiveType.POINT,

          geometry,

          semanticRole,

          materialHint,

          metadata
        })
      : null;

  if (
    !geometry ||
    !primitiveRecord
  ) {
    return makeConstructionFailure({
      constructionType:
        'POINT',

      issues: [
        createSouthIssue(
          'SOUTH_POINT_RECORD_CREATION_FAILED',
          'ERROR',
          'Point construction could not create neutral records.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'POINT',

    primitiveRecord,

    geometry,

    metadata
  });
}


export function constructHEarthPointSet({
  primitiveId,
  points,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !areFiniteVector3Array(points) ||
    points.length === 0 ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'POINT_SET',

      issues: [
        createSouthIssue(
          'SOUTH_POINT_SET_INPUT_INVALID',
          'ERROR',
          'Point-set construction requires finite points and a valid transform.'
        )
      ],

      metadata
    });
  }

  const indices =
    buildSequentialIndices(
      points.length
    );

  const bounds =
    createHEarthGeometryBounds(
      points
    );

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId:
        `${primitiveId}:geometry`,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.POINTS,

      vertices:
        points,

      indices,

      bounds,

      transform,

      metadata
    });

  const primitiveRecord =
    geometry
      ? createHEarthNeutralPrimitiveRecord({
          primitiveId,

          primitiveType:
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .primitiveType.POINT_SET,

          geometry,

          semanticRole,

          materialHint,

          metadata
        })
      : null;

  if (
    !geometry ||
    !primitiveRecord
  ) {
    return makeConstructionFailure({
      constructionType:
        'POINT_SET',

      issues: [
        createSouthIssue(
          'SOUTH_POINT_SET_RECORD_CREATION_FAILED',
          'ERROR',
          'Point-set construction could not create neutral records.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'POINT_SET',

    primitiveRecord,

    geometry,

    metadata
  });
}


export function constructHEarthLineSegment({
  primitiveId,
  start,
  end,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(start) ||
    !isHEarthVector3(end) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'LINE_SEGMENT',

      issues: [
        createSouthIssue(
          'SOUTH_LINE_SEGMENT_INPUT_INVALID',
          'ERROR',
          'Line-segment construction requires finite endpoints.'
        )
      ],

      metadata
    });
  }

  const bounds =
    createHEarthGeometryBounds([
      start,
      end
    ]);

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      bounds
    );

  const length =
    getHEarthVector3Distance(
      start,
      end
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    ) ||
    !isHEarthFiniteNumber(length) ||
    length <=
      resolvedToleranceContext
        .lengthTolerance
  ) {
    return makeConstructionFailure({
      constructionType:
        'LINE_SEGMENT',

      issues: [
        createSouthIssue(
          'SOUTH_LINE_SEGMENT_DEGENERATE',
          'ERROR',
          'Line-segment length is nonfinite or at or below tolerance.',
          {
            length
          }
        )
      ],

      metadata
    });
  }

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId:
        `${primitiveId}:geometry`,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.LINES,

      vertices: [
        start,
        end
      ],

      indices: [
        0,
        1
      ],

      bounds,

      transform,

      metadata: {
        ...metadata,
        length
      }
    });

  const primitiveRecord =
    geometry
      ? createHEarthNeutralPrimitiveRecord({
          primitiveId,

          primitiveType:
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .primitiveType.LINE_SEGMENT,

          geometry,

          semanticRole,

          materialHint,

          metadata
        })
      : null;

  if (
    !geometry ||
    !primitiveRecord
  ) {
    return makeConstructionFailure({
      constructionType:
        'LINE_SEGMENT',

      issues: [
        createSouthIssue(
          'SOUTH_LINE_SEGMENT_RECORD_CREATION_FAILED',
          'ERROR',
          'Line-segment records could not be created.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'LINE_SEGMENT',

    primitiveRecord,

    geometry,

    metadata
  });
}


export function constructHEarthPolyline({
  primitiveId,
  points,
  closed = false,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !areFiniteVector3Array(points) ||
    points.length < 2 ||
    typeof closed !== 'boolean' ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'POLYLINE',

      issues: [
        createSouthIssue(
          'SOUTH_POLYLINE_INPUT_INVALID',
          'ERROR',
          'Polyline construction requires at least two finite points.'
        )
      ],

      metadata
    });
  }

  const bounds =
    createHEarthGeometryBounds(
      points
    );

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      bounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'POLYLINE',

      issues: [
        createSouthIssue(
          'SOUTH_POLYLINE_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Polyline construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const issues = [];

  for (
    let index = 0;
    index < points.length - 1;
    index += 1
  ) {
    const length =
      getHEarthVector3Distance(
        points[index],
        points[index + 1]
      );

    if (
      !isHEarthFiniteNumber(length) ||
      length <=
        resolvedToleranceContext
          .lengthTolerance
    ) {
      issues.push(
        createSouthIssue(
          'SOUTH_POLYLINE_SEGMENT_DEGENERATE',
          'ERROR',
          'Polyline contains a degenerate segment.',
          {
            segmentIndex:
              index,

            length
          }
        )
      );
    }
  }

  if (closed) {
    const closingLength =
      getHEarthVector3Distance(
        points[
          points.length - 1
        ],
        points[0]
      );

    if (
      !isHEarthFiniteNumber(
        closingLength
      ) ||
      closingLength <=
        resolvedToleranceContext
          .lengthTolerance
    ) {
      issues.push(
        createSouthIssue(
          'SOUTH_POLYLINE_CLOSING_SEGMENT_DEGENERATE',
          'ERROR',
          'Closed polyline contains a degenerate closing segment.',
          {
            closingLength
          }
        )
      );
    }
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'POLYLINE',

      issues,

      metadata
    });
  }

  const indices = [];

  for (
    let index = 0;
    index < points.length - 1;
    index += 1
  ) {
    indices.push(
      index,
      index + 1
    );
  }

  if (closed) {
    indices.push(
      points.length - 1,
      0
    );
  }

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId:
        `${primitiveId}:geometry`,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.LINES,

      vertices:
        points,

      indices,

      bounds,

      transform,

      metadata: {
        ...metadata,
        closed
      }
    });

  const primitiveRecord =
    geometry
      ? createHEarthNeutralPrimitiveRecord({
          primitiveId,

          primitiveType:
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .primitiveType.POLYLINE,

          geometry,

          semanticRole,

          materialHint,

          metadata: {
            ...metadata,
            closed
          }
        })
      : null;

  if (
    !geometry ||
    !primitiveRecord
  ) {
    return makeConstructionFailure({
      constructionType:
        'POLYLINE',

      issues: [
        createSouthIssue(
          'SOUTH_POLYLINE_RECORD_CREATION_FAILED',
          'ERROR',
          'Polyline records could not be created.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'POLYLINE',

    primitiveRecord,

    geometry,

    metadata
  });
}


export function constructHEarthTriangle({
  primitiveId,
  a,
  b,
  c,
  normalMode =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .normalMode.FACE_AND_VERTEX,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  const bounds =
    (
      isHEarthVector3(a) &&
      isHEarthVector3(b) &&
      isHEarthVector3(c)
    )
      ? createHEarthGeometryBounds([
          a,
          b,
          c
        ])
      : null;

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      bounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE',

      issues: [
        createSouthIssue(
          'SOUTH_TRIANGLE_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Triangle construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const evaluation =
    evaluateHEarthTriangleNormal(
      a,
      b,
      c,
      resolvedToleranceContext
    );

  if (!evaluation.valid) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE',

      issues:
        evaluation.issues,

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.TRIANGLE,

    vertices: [
      a,
      b,
      c
    ],

    indices: [
      0,
      1,
      2
    ],

    normalMode,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      triangleArea:
        evaluation.triangleArea,

      doubleArea:
        evaluation.doubleArea,

      openNeutralMeshExpected:
        true,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


export function constructHEarthBillboard({
  primitiveId,
  center,
  width,
  height,
  facingHint = null,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(width) ||
    !isHEarthPositiveFiniteNumber(height) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'BILLBOARD',

      issues: [
        createSouthIssue(
          'SOUTH_BILLBOARD_INPUT_INVALID',
          'ERROR',
          'Billboard construction requires a center and positive dimensions.'
        )
      ],

      metadata
    });
  }

  const bounds =
    createHEarthBillboardConservativeBounds({
      center,
      width,
      height
    });

  if (!bounds) {
    return makeConstructionFailure({
      constructionType:
        'BILLBOARD',

      issues: [
        createSouthIssue(
          'SOUTH_BILLBOARD_BOUNDS_INVALID',
          'ERROR',
          'Billboard conservative bounds could not be derived.'
        )
      ],

      metadata
    });
  }

  const geometry =
    createHEarthNeutralGeometryRecord({
      geometryId:
        `${primitiveId}:geometry`,

      topologyMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .topologyMode.POINTS,

      vertices: [
        center
      ],

      indices: [
        0
      ],

      bounds,

      transform,

      attributes: {
        width,
        height,

        facingHint:
          freezeClone(facingHint),

        geometryMeaning:
          'VIEW_DEPENDENT_QUAD_INTENT',

        rendererConstructionRequired:
          true
      },

      metadata
    });

  const primitiveRecord =
    geometry
      ? createHEarthNeutralPrimitiveRecord({
          primitiveId,

          primitiveType:
            H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
              .primitiveType.BILLBOARD,

          geometry,

          semanticRole,

          materialHint,

          metadata
        })
      : null;

  if (
    !geometry ||
    !primitiveRecord
  ) {
    return makeConstructionFailure({
      constructionType:
        'BILLBOARD',

      issues: [
        createSouthIssue(
          'SOUTH_BILLBOARD_RECORD_CREATION_FAILED',
          'ERROR',
          'Billboard records could not be created.'
        )
      ],

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'BILLBOARD',

    primitiveRecord,

    geometry,

    metadata
  });
}


/* ==========================================================================
 * 08 · GRID CONSTRUCTION
 * ========================================================================== */

function constructGridTriangleIndices({
  rowCount,
  columnCount,
  wrapRows,
  wrapColumns,
  heightFieldWinding = false
}) {
  if (
    !isHEarthPositiveSafeInteger(rowCount) ||
    !isHEarthPositiveSafeInteger(columnCount) ||
    rowCount < 2 ||
    columnCount < 2 ||
    typeof wrapRows !== 'boolean' ||
    typeof wrapColumns !== 'boolean'
  ) {
    return null;
  }

  const rowCellCount =
    wrapRows
      ? rowCount
      : rowCount - 1;

  const columnCellCount =
    wrapColumns
      ? columnCount
      : columnCount - 1;

  const indices = [];

  for (
    let rowIndex = 0;
    rowIndex < rowCellCount;
    rowIndex += 1
  ) {
    const nextRow =
      (
        rowIndex + 1
      ) %
      rowCount;

    for (
      let columnIndex = 0;
      columnIndex < columnCellCount;
      columnIndex += 1
    ) {
      const nextColumn =
        (
          columnIndex + 1
        ) %
        columnCount;

      const a =
        rowIndex *
          columnCount +
        columnIndex;

      const b =
        rowIndex *
          columnCount +
        nextColumn;

      const c =
        nextRow *
          columnCount +
        nextColumn;

      const d =
        nextRow *
          columnCount +
        columnIndex;

      if (heightFieldWinding) {
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

  return indices;
}


export function constructHEarthHeightFieldMesh({
  primitiveId,
  descriptor,
  xSampleCount,
  zSampleCount,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  const sampled =
    sampleHEarthHeightField(
      descriptor,
      xSampleCount,
      zSampleCount,
      toleranceContext
    );

  if (!sampled.valid) {
    return makeConstructionFailure({
      constructionType:
        'HEIGHT_FIELD_MESH',

      issues: [
        ...sampled.issues,

        createSouthIssue(
          'SOUTH_HEIGHT_FIELD_SAMPLE_HELD',
          'ERROR',
          'Height-field sampling did not complete lawfully.'
        )
      ],

      metadata
    });
  }

  const integrity =
    evaluateHEarthGridSampleIntegrity(
      sampled
    );

  if (
    !integrity.valid ||
    integrity.topologyConstructionHeld
  ) {
    return makeConstructionFailure({
      constructionType:
        'HEIGHT_FIELD_MESH',

      issues: [
        ...sampled.issues,
        ...integrity.issues
      ],

      metadata
    });
  }

  const vertices =
    sampled.samples.map(
      (sample) =>
        sample.value
    );

  if (
    !areFiniteVector3Array(vertices)
  ) {
    return makeConstructionFailure({
      constructionType:
        'HEIGHT_FIELD_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_HEIGHT_FIELD_VERTICES_INVALID',
          'ERROR',
          'Height-field samples did not resolve to finite vertices.'
        )
      ],

      metadata
    });
  }

  const wrapRows =
    sampled.secondTopology ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .domainTopology.PERIODIC;

  const wrapColumns =
    sampled.firstTopology ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .domainTopology.PERIODIC;

  const indices =
    constructGridTriangleIndices({
      rowCount:
        sampled.rowCount,

      columnCount:
        sampled.columnCount,

      wrapRows,

      wrapColumns,

      heightFieldWinding:
        true
    });

  if (!indices) {
    return makeConstructionFailure({
      constructionType:
        'HEIGHT_FIELD_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_HEIGHT_FIELD_INDEX_CONSTRUCTION_FAILED',
          'ERROR',
          'Height-field triangle indices could not be constructed.'
        )
      ],

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.HEIGHT_FIELD_MESH,

    vertices,

    indices,

    expectedClosure:
      wrapRows &&
      wrapColumns
        ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .expectedClosure.CLOSED_REQUIRED
        : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      rowCount:
        sampled.rowCount,

      columnCount:
        sampled.columnCount,

      wrapRows,

      wrapColumns,

      windingLaw:
        '[a,c,b] [a,d,c]',

      orientationLaw:
        'S_V_CROSS_S_U',

      rejectedSamplesCompacted:
        false,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    source: {
      sourceType:
        'HEIGHT_FIELD_DESCRIPTOR',

      descriptorId:
        descriptor?.descriptorId ??
        null
    },

    toleranceContext
  });
}


export function constructHEarthParametricSurfaceMesh({
  primitiveId,
  descriptor,
  uSampleCount,
  vSampleCount,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  const sampled =
    sampleHEarthParametricSurface(
      descriptor,
      uSampleCount,
      vSampleCount,
      toleranceContext
    );

  if (!sampled.valid) {
    return makeConstructionFailure({
      constructionType:
        'PARAMETRIC_SURFACE_MESH',

      issues: [
        ...sampled.issues,

        createSouthIssue(
          'SOUTH_PARAMETRIC_SURFACE_SAMPLE_HELD',
          'ERROR',
          'Parametric-surface sampling did not complete lawfully.'
        )
      ],

      metadata
    });
  }

  const integrity =
    evaluateHEarthGridSampleIntegrity(
      sampled
    );

  if (
    !integrity.valid ||
    integrity.topologyConstructionHeld
  ) {
    return makeConstructionFailure({
      constructionType:
        'PARAMETRIC_SURFACE_MESH',

      issues: [
        ...sampled.issues,
        ...integrity.issues
      ],

      metadata
    });
  }

  const vertices =
    sampled.samples.map(
      (sample) =>
        sample.value
    );

  const wrapRows =
    sampled.secondTopology ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .domainTopology.PERIODIC;

  const wrapColumns =
    sampled.firstTopology ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .domainTopology.PERIODIC;

  const indices =
    constructGridTriangleIndices({
      rowCount:
        sampled.rowCount,

      columnCount:
        sampled.columnCount,

      wrapRows,

      wrapColumns,

      heightFieldWinding:
        false
    });

  if (
    !areFiniteVector3Array(vertices) ||
    !indices
  ) {
    return makeConstructionFailure({
      constructionType:
        'PARAMETRIC_SURFACE_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_PARAMETRIC_SURFACE_GRID_INVALID',
          'ERROR',
          'Parametric-surface vertices or indices are invalid.'
        )
      ],

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.PARAMETRIC_SURFACE_MESH,

    vertices,

    indices,

    expectedClosure:
      wrapRows &&
      wrapColumns
        ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .expectedClosure.CLOSED_REQUIRED
        : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      rowCount:
        sampled.rowCount,

      columnCount:
        sampled.columnCount,

      wrapRows,

      wrapColumns,

      duplicateTerminalRows:
        false,

      duplicateTerminalColumns:
        false,

      rejectedSamplesCompacted:
        false,

      admitted:
        false,

        admissionAuthority:
          'WEST_ONLY'
    },

    source: {
      sourceType:
        'PARAMETRIC_SURFACE_DESCRIPTOR',

      descriptorId:
        descriptor?.descriptorId ??
        null
    },

    toleranceContext
  });
}


/* ==========================================================================
 * 09 · XZ RIBBON
 * ========================================================================== */

function getHEarthXZDirection(
  start,
  end,
  toleranceContext
) {
  const direction =
    createHEarthVector3(
      end.x -
        start.x,
      0,
      end.z -
        start.z
    );

  const normalized =
    normalizeHEarthVector3(
      direction,
      toleranceContext
        .lengthTolerance
    );

  return normalized.valid
    ? normalized.vector
    : null;
}


function getHEarthXZLeftNormal(
  tangent
) {
  return createHEarthVector3(
    -tangent.z,
    0,
    tangent.x
  );
}


function resolveBoundedMiterPoint({
  point,
  previousNormal,
  nextNormal,
  offset,
  miterLimit,
  toleranceContext
}) {
  const miterDirectionRaw =
    addHEarthVector3(
      previousNormal,
      nextNormal
    );

  const miterNormalized =
    normalizeHEarthVector3(
      miterDirectionRaw,
      toleranceContext
        .lengthTolerance
    );

  if (!miterNormalized.valid) {
    return null;
  }

  const denominator =
    dotHEarthVector3(
      miterNormalized.vector,
      nextNormal
    );

  const denominatorTolerance =
    H_EARTH_3D_GEOMETRY_SOUTH_PARALLEL_ALIGNMENT_EPSILON;

  if (
    !isHEarthFiniteNumber(denominator) ||
    Math.abs(denominator) <=
      denominatorTolerance
  ) {
    return null;
  }

  const miterLength =
    offset /
    denominator;

  if (
    !isHEarthFiniteNumber(miterLength) ||
    Math.abs(miterLength) >
      Math.abs(offset) *
      miterLimit
  ) {
    return null;
  }

  return addHEarthVector3(
    point,
    scaleHEarthVector3(
      miterNormalized.vector,
      miterLength
    )
  );
}


export function constructHEarthXZRibbonMesh({
  primitiveId,
  centerline,
  width,
  join =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .ribbonJoin.BEVEL,
  cap =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .ribbonCap.BUTT,
  miterLimit = 4,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !areFiniteVector3Array(centerline) ||
    centerline.length < 2 ||
    !isHEarthPositiveFiniteNumber(width) ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .ribbonJoin,
      join
    ) ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .ribbonCap,
      cap
    ) ||
    !isHEarthPositiveFiniteNumber(
      miterLimit
    ) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'XZ_RIBBON_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_XZ_RIBBON_INPUT_INVALID',
          'ERROR',
          'XZ ribbon construction received invalid input.'
        )
      ],

      metadata
    });
  }

  const sourceBounds =
    createHEarthGeometryBounds(
      centerline
    );

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      sourceBounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'XZ_RIBBON_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_XZ_RIBBON_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'XZ ribbon construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const tangents = [];

  for (
    let index = 0;
    index < centerline.length - 1;
    index += 1
  ) {
    const tangent =
      getHEarthXZDirection(
        centerline[index],
        centerline[index + 1],
        resolvedToleranceContext
      );

    if (!tangent) {
      return makeConstructionFailure({
        constructionType:
          'XZ_RIBBON_MESH',

        issues: [
          createSouthIssue(
            'SOUTH_XZ_RIBBON_DEGENERATE_SEGMENT',
            'ERROR',
            'XZ ribbon centerline contains a degenerate projected segment.',
            {
              segmentIndex:
                index
            }
          )
        ],

        metadata
      });
    }

    tangents.push(tangent);
  }

  const halfWidth =
    width *
    0.5;

  const leftVertices = [];
  const rightVertices = [];

  let bevelFallbackCount = 0;

  for (
    let pointIndex = 0;
    pointIndex < centerline.length;
    pointIndex += 1
  ) {
    const point =
      centerline[pointIndex];

    const previousTangent =
      tangents[
        Math.max(
          pointIndex - 1,
          0
        )
      ];

    const nextTangent =
      tangents[
        Math.min(
          pointIndex,
          tangents.length - 1
        )
      ];

    const previousNormal =
      getHEarthXZLeftNormal(
        previousTangent
      );

    const nextNormal =
      getHEarthXZLeftNormal(
        nextTangent
      );

    let leftPoint = null;
    let rightPoint = null;

    if (
      pointIndex > 0 &&
      pointIndex <
        centerline.length - 1 &&
      join ===
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .ribbonJoin.BOUNDED_MITER
    ) {
      leftPoint =
        resolveBoundedMiterPoint({
          point,

          previousNormal,

          nextNormal,

          offset:
            halfWidth,

          miterLimit,

          toleranceContext:
            resolvedToleranceContext
        });

      rightPoint =
        resolveBoundedMiterPoint({
          point,

          previousNormal:
            scaleHEarthVector3(
              previousNormal,
              -1
            ),

          nextNormal:
            scaleHEarthVector3(
              nextNormal,
              -1
            ),

          offset:
            halfWidth,

          miterLimit,

          toleranceContext:
            resolvedToleranceContext
        });

      if (
        !leftPoint ||
        !rightPoint
      ) {
        bevelFallbackCount += 1;
      }
    }

    if (
      !leftPoint ||
      !rightPoint
    ) {
      leftPoint =
        addHEarthVector3(
          point,
          scaleHEarthVector3(
            nextNormal,
            halfWidth
          )
        );

      rightPoint =
        addHEarthVector3(
          point,
          scaleHEarthVector3(
            nextNormal,
            -halfWidth
          )
        );
    }

    if (
      !leftPoint ||
      !rightPoint
    ) {
      return makeConstructionFailure({
        constructionType:
          'XZ_RIBBON_MESH',

        issues: [
          createSouthIssue(
            'SOUTH_XZ_RIBBON_OFFSET_FAILED',
            'ERROR',
            'XZ ribbon offset vertices could not be constructed.',
            {
              pointIndex
            }
          )
        ],

        metadata
      });
    }

    leftVertices.push(leftPoint);
    rightVertices.push(rightPoint);
  }

  const vertices = [];

  for (
    let index = 0;
    index < centerline.length;
    index += 1
  ) {
    vertices.push(
      leftVertices[index],
      rightVertices[index]
    );
  }

  const indices = [];

  for (
    let index = 0;
    index < centerline.length - 1;
    index += 1
  ) {
    const leftA =
      index *
      2;

    const rightA =
      leftA +
      1;

    const leftB =
      leftA +
      2;

    const rightB =
      leftA +
      3;

    indices.push(
      leftA,
      rightB,
      rightA,

      leftA,
      leftB,
      rightB
    );
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.XZ_RIBBON_MESH,

    vertices,

    indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      width,

      halfWidth,

      join,

      cap,

      miterLimit,

      bevelFallbackCount,

      orientationPlane:
        'XZ',

      leftNormalLaw:
        '[-Tz,0,Tx]',

      parallelAlignmentEpsilon:
        H_EARTH_3D_GEOMETRY_SOUTH_PARALLEL_ALIGNMENT_EPSILON,

      parallelAlignmentEpsilonClass:
        'SOUTH_LOCAL_CONSTANT',

      roundJoinClaim:
        false,

      roundCapClaim:
        false,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


/* ==========================================================================
 * 10 · EXTRUSION TOPOLOGY RESOLUTION
 * ========================================================================== */

function resolveExtrusionVector({
  direction,
  distance,
  toleranceContext
}) {
  if (
    !isHEarthVector3(direction) ||
    !isHEarthPositiveFiniteNumber(distance)
  ) {
    return null;
  }

  const normalized =
    normalizeHEarthVector3(
      direction,
      toleranceContext
        .lengthTolerance
    );

  if (!normalized.valid) {
    return null;
  }

  return scaleHEarthVector3(
    normalized.vector,
    distance
  );
}


function getTrianglePlanNormal({
  vertices,
  triangleIndices,
  toleranceContext
}) {
  if (
    !areFiniteVector3Array(vertices) ||
    !Array.isArray(triangleIndices) ||
    triangleIndices.length < 3
  ) {
    return null;
  }

  for (
    let offset = 0;
    offset < triangleIndices.length;
    offset += 3
  ) {
    const a =
      vertices[
        triangleIndices[offset]
      ];

    const b =
      vertices[
        triangleIndices[offset + 1]
      ];

    const c =
      vertices[
        triangleIndices[offset + 2]
      ];

    if (
      !isHEarthVector3(a) ||
      !isHEarthVector3(b) ||
      !isHEarthVector3(c)
    ) {
      continue;
    }

    const ab =
      subtractHEarthVector3(
        b,
        a
      );

    const ac =
      subtractHEarthVector3(
        c,
        a
      );

    const cross =
      crossHEarthVector3(
        ab,
        ac
      );

    const normalized =
      normalizeHEarthVector3(
        cross,
        toleranceContext
          .lengthTolerance
      );

    if (normalized.valid) {
      return normalized.vector;
    }
  }

  return null;
}


function getProfileBoundaryNormal({
  profilePoints,
  toleranceContext
}) {
  if (
    !areFiniteVector3Array(profilePoints) ||
    profilePoints.length < 3
  ) {
    return null;
  }

  for (
    let index = 0;
    index < profilePoints.length;
    index += 1
  ) {
    const a =
      profilePoints[index];

    const b =
      profilePoints[
        (
          index + 1
        ) %
        profilePoints.length
      ];

    const c =
      profilePoints[
        (
          index + 2
        ) %
        profilePoints.length
      ];

    const ab =
      subtractHEarthVector3(
        b,
        a
      );

    const ac =
      subtractHEarthVector3(
        c,
        a
      );

    const cross =
      crossHEarthVector3(
        ab,
        ac
      );

    const normalized =
      normalizeHEarthVector3(
        cross,
        toleranceContext
          .lengthTolerance
      );

    if (normalized.valid) {
      return normalized.vector;
    }
  }

  return null;
}


function createExtrusionSideIndices({
  vertexCount,
  sideBoundaryDirection
}) {
  if (
    !isHEarthPositiveSafeInteger(
      vertexCount
    ) ||
    vertexCount < 3 ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .profileBoundaryDirection,
      sideBoundaryDirection
    )
  ) {
    return null;
  }

  const indices = [];

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

    const lowerA =
      index;

    const lowerB =
      next;

    const upperA =
      index +
      vertexCount;

    const upperB =
      next +
      vertexCount;

    if (
      sideBoundaryDirection ===
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .profileBoundaryDirection.FORWARD
    ) {
      indices.push(
        lowerA,
        lowerB,
        upperB,

        lowerA,
        upperB,
        upperA
      );
    } else {
      indices.push(
        lowerB,
        lowerA,
        upperA,

        lowerB,
        upperA,
        upperB
      );
    }
  }

  return indices;
}


function resolveOrientedExtrusionProfile({
  profilePoints,
  projectionPlane,
  extrusionDirection,
  toleranceContext
}) {
  const triangulationPlan =
    triangulateHEarthConvexPolygon(
      profilePoints,
      projectionPlane,
      toleranceContext
    );

  if (
    !triangulationPlan.valid ||
    triangulationPlan
      .outputClassification !==
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .triangulationOutputClassification
        .ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN ||
    triangulationPlan
      .primitiveConstruction !==
      false ||
    triangulationPlan
      .admittedGeometry !==
      false ||
    !areValidTriangleIndices(
      triangulationPlan.triangleIndices,
      profilePoints.length
    )
  ) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal:
        null,

      profileBoundaryNormal:
        null,

      profilePlanFacesExtrusionDirection:
        null,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        ...ensureArray(
          triangulationPlan?.issues
        ),

        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_ANALYSIS_FAILED',
          'ERROR',
          'Extrusion profile did not produce a lawful East analysis-level triangle-index plan.'
        )
      ]
    };
  }

  const profileNormal =
    getTrianglePlanNormal({
      vertices:
        profilePoints,

      triangleIndices:
        triangulationPlan
          .triangleIndices,

      toleranceContext
    });

  const profileBoundaryNormal =
    getProfileBoundaryNormal({
      profilePoints,
      toleranceContext
    });

  if (
    !isHEarthVector3(profileNormal) ||
    !isHEarthVector3(
      profileBoundaryNormal
    )
  ) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal,

      profileBoundaryNormal,

      profilePlanFacesExtrusionDirection:
        null,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_NORMAL_INVALID',
          'ERROR',
          'Extrusion profile did not produce stable plan and boundary normals.'
        )
      ]
    };
  }

  const planAlignment =
    dotHEarthVector3(
      profileNormal,
      extrusionDirection
    );

  const boundaryToPlanAlignment =
    dotHEarthVector3(
      profileBoundaryNormal,
      profileNormal
    );

  const alignmentTolerance =
    H_EARTH_3D_GEOMETRY_SOUTH_PARALLEL_ALIGNMENT_EPSILON;

  if (
    !isHEarthFiniteNumber(
      planAlignment
    ) ||
    Math.abs(planAlignment) <=
      alignmentTolerance
  ) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal,

      profileBoundaryNormal,

      profilePlanFacesExtrusionDirection:
        null,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_DIRECTION_ALIGNMENT_INVALID',
          'ERROR',
          'Extrusion profile plan normal must have a stable relationship with the extrusion direction.',
          {
            planAlignment,
            alignmentTolerance,
            alignmentEpsilonClass:
              'SOUTH_LOCAL_CONSTANT'
          }
        )
      ]
    };
  }

  if (
    !isHEarthFiniteNumber(
      boundaryToPlanAlignment
    ) ||
    Math.abs(
      boundaryToPlanAlignment
    ) <=
      alignmentTolerance
  ) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal,

      profileBoundaryNormal,

      profilePlanFacesExtrusionDirection:
        null,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_BOUNDARY_ALIGNMENT_INVALID',
          'ERROR',
          'Extrusion profile boundary order must have a stable relationship with the East triangle plan.',
          {
            boundaryToPlanAlignment,
            alignmentTolerance,
            alignmentEpsilonClass:
              'SOUTH_LOCAL_CONSTANT'
          }
        )
      ]
    };
  }

  const profilePlanFacesExtrusionDirection =
    planAlignment > 0;

  const profileBoundaryMatchesPlan =
    boundaryToPlanAlignment > 0;

  const forwardPlan =
    triangulationPlan
      .triangleIndices
      .slice();

  const reversedPlan =
    reverseTriangleIndices(
      forwardPlan
    );

  if (!reversedPlan) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal,

      profileBoundaryNormal,

      profilePlanFacesExtrusionDirection,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_PLAN_REVERSAL_FAILED',
          'ERROR',
          'Extrusion triangle plan could not be reversed.'
        )
      ]
    };
  }

  const lowerCapUsesForwardPlan =
    !profilePlanFacesExtrusionDirection;

  const lowerCapTriangleIndices =
    lowerCapUsesForwardPlan
      ? forwardPlan
      : reversedPlan;

  const upperCapLocalTriangleIndices =
    lowerCapUsesForwardPlan
      ? reversedPlan
      : forwardPlan;

  const upperCapTriangleIndices =
    offsetTriangleIndices(
      upperCapLocalTriangleIndices,
      profilePoints.length
    );

  const lowerCapBoundaryUsesProfileForward =
    lowerCapUsesForwardPlan
      ? profileBoundaryMatchesPlan
      : !profileBoundaryMatchesPlan;

  const sideBoundaryDirection =
    lowerCapBoundaryUsesProfileForward
      ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .profileBoundaryDirection.REVERSED
      : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .profileBoundaryDirection.FORWARD;

  const sideTriangleIndices =
    createExtrusionSideIndices({
      vertexCount:
        profilePoints.length,

      sideBoundaryDirection
    });

  if (
    !upperCapTriangleIndices ||
    !sideTriangleIndices
  ) {
    return {
      valid:
        false,

      profilePoints:
        null,

      triangulationPlan,

      profileNormal,

      profileBoundaryNormal,

      profilePlanFacesExtrusionDirection,

      lowerCapTriangleIndices:
        null,

      upperCapTriangleIndices:
        null,

      sideTriangleIndices:
        null,

      sideWindingMode:
        null,

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_RESOLVED_INDEX_CONSTRUCTION_FAILED',
          'ERROR',
          'Extrusion cap or side indices could not be resolved.'
        )
      ]
    };
  }

  return {
    valid:
      true,

    profilePoints:
      cloneVector3Array(
        profilePoints
      ),

    triangulationPlan,

    profileNormal,

    profileBoundaryNormal,

    profilePlanFacesExtrusionDirection,

    profilePlanFacing:
      profilePlanFacesExtrusionDirection
        ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .extrusionPlanFacing.WITH_EXTRUSION
        : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .extrusionPlanFacing.AGAINST_EXTRUSION,

    profileBoundaryMatchesPlan,

    lowerCapUsesForwardPlan,

    lowerCapBoundaryUsesProfileForward,

    lowerCapTriangleIndices,

    upperCapTriangleIndices,

    sideTriangleIndices,

    sideWindingMode:
      sideBoundaryDirection,

    issues:
      ensureArray(
        triangulationPlan.issues
      )
  };
}


/* ==========================================================================
 * 11 · CONVEX EXTRUSION AND PRISM
 * ========================================================================== */

export function constructHEarthConvexExtrusionMesh({
  primitiveId,
  profilePoints,
  projectionPlane =
    H_EARTH_3D_GEOMETRY_EAST_ENUMS
      .polygonProjectionPlane.XZ,
  direction =
    createHEarthVector3(
      0,
      1,
      0
    ),
  distance,
  primitiveType =
    H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
      .primitiveType.EXTRUSION_MESH,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !areFiniteVector3Array(profilePoints) ||
    profilePoints.length < 3 ||
    !isHEarthPositiveFiniteNumber(distance) ||
    !isHEarthVector3(direction) ||
    !isExtrusionPathPrimitiveType(
      primitiveType
    ) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_INPUT_INVALID',
          'ERROR',
          'Extrusion construction requires a convex profile, direction, positive distance, lawful extrusion primitive type, and valid transform.'
        )
      ],

      metadata
    });
  }

  const profileBounds =
    createHEarthGeometryBounds(
      profilePoints
    );

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      profileBounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Extrusion construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const normalizedDirectionResult =
    normalizeHEarthVector3(
      direction,
      resolvedToleranceContext
        .lengthTolerance
    );

  if (!normalizedDirectionResult.valid) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_DIRECTION_INVALID',
          'ERROR',
          'Extrusion direction could not be normalized.'
        )
      ],

      metadata
    });
  }

  const extrusionDirection =
    normalizedDirectionResult.vector;

  const resolvedTopology =
    resolveOrientedExtrusionProfile({
      profilePoints,
      projectionPlane,
      extrusionDirection,
      toleranceContext:
        resolvedToleranceContext
    });

  if (!resolvedTopology.valid) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues:
        resolvedTopology.issues,

      metadata
    });
  }

  const extrusionVector =
    resolveExtrusionVector({
      direction:
        extrusionDirection,

      distance,

      toleranceContext:
        resolvedToleranceContext
    });

  if (!extrusionVector) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_VECTOR_INVALID',
          'ERROR',
          'Extrusion direction and distance could not produce a finite vector.'
        )
      ],

      metadata
    });
  }

  const lowerVertices =
    cloneVector3Array(
      resolvedTopology
        .profilePoints
    );

  const upperVertices =
    resolvedTopology
      .profilePoints
      .map(
        (point) =>
          addHEarthVector3(
            point,
            extrusionVector
          )
      );

  if (
    !lowerVertices ||
    !areFiniteVector3Array(
      upperVertices
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_COPY_INVALID',
          'ERROR',
          'Extrusion profiles could not be represented as finite vertices.'
        )
      ],

      metadata
    });
  }

  const vertices = [
    ...lowerVertices,
    ...upperVertices
  ];

  const indices = [
    ...resolvedTopology
      .lowerCapTriangleIndices,

    ...resolvedTopology
      .upperCapTriangleIndices,

    ...resolvedTopology
      .sideTriangleIndices
  ];

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType,

    vertices,

    indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.CLOSED_REQUIRED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      distance,

      extrusionDirection,

      extrusionVector,

      projectionPlane,

      profileNormal:
        resolvedTopology
          .profileNormal,

      profileBoundaryNormal:
        resolvedTopology
          .profileBoundaryNormal,

      profilePlanFacesExtrusionDirection:
        resolvedTopology
          .profilePlanFacesExtrusionDirection,

      profilePlanFacing:
        resolvedTopology
          .profilePlanFacing,

      profileBoundaryMatchesPlan:
        resolvedTopology
          .profileBoundaryMatchesPlan,

      lowerCapUsesForwardPlan:
        resolvedTopology
          .lowerCapUsesForwardPlan,

      lowerCapBoundaryUsesProfileForward:
        resolvedTopology
          .lowerCapBoundaryUsesProfileForward,

      sideWindingMode:
        resolvedTopology
          .sideWindingMode,

      lowerCapOrientation:
        'OPPOSITE_EXTRUSION_DIRECTION',

      upperCapOrientation:
        'WITH_EXTRUSION_DIRECTION',

      capTriangulationSource:
        'EAST_ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN',

      eastPrimitiveConstructionConsumed:
        false,

      eastAdmissionConsumed:
        false,

      primitiveConstructionAuthority:
        'SOUTH',

      expectedClosure:
        'CLOSED_REQUIRED',

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    source: {
      sourceType:
        'CONVEX_PROFILE_EXTRUSION',

      triangulationPlan:
        resolvedTopology
          .triangulationPlan
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


export function constructHEarthPrismMesh({
  primitiveId,
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radius,
  height,
  sideCount,
  rotationRadians = 0,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(center) ||
    !isHEarthPositiveFiniteNumber(radius) ||
    !isHEarthPositiveFiniteNumber(height) ||
    !isHEarthPositiveSafeInteger(sideCount) ||
    sideCount < 3 ||
    !isHEarthFiniteNumber(rotationRadians) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'PRISM_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_PRISM_INPUT_INVALID',
          'ERROR',
          'Prism construction requires a center, positive radius and height, and at least three sides.'
        )
      ],

      metadata
    });
  }

  const halfHeight =
    height *
    0.5;

  const profilePoints = [];

  for (
    let index = 0;
    index < sideCount;
    index += 1
  ) {
    const angle =
      rotationRadians +
      (
        index /
        sideCount
      ) *
      Math.PI *
      2;

    const point =
      createHEarthVector3(
        center.x +
          radius *
          Math.cos(angle),

        center.y -
          halfHeight,

        center.z +
          radius *
          Math.sin(angle)
      );

    if (!point) {
      return makeConstructionFailure({
        constructionType:
          'PRISM_MESH',

        issues: [
          createSouthIssue(
            'SOUTH_PRISM_PROFILE_NONFINITE',
            'ERROR',
            'Prism profile produced a nonfinite point.'
          )
        ],

        metadata
      });
    }

    profilePoints.push(point);
  }

  const result =
    constructHEarthConvexExtrusionMesh({
      primitiveId,

      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType.PRISM_MESH,

      profilePoints,

      projectionPlane:
        H_EARTH_3D_GEOMETRY_EAST_ENUMS
          .polygonProjectionPlane.XZ,

      direction:
        createHEarthVector3(
          0,
          1,
          0
        ),

      distance:
        height,

      transform,

      semanticRole,

      materialHint,

      metadata: {
        ...metadata,

        center,

        radius,

        height,

        sideCount,

        rotationRadians,

        expectedClosure:
          'CLOSED_REQUIRED'
      },

      toleranceContext
    });

  if (!result.valid) {
    return result;
  }

  return deepFreeze({
    ...result,

    constructionType:
      'PRISM_MESH'
  });
}


/* ==========================================================================
 * 12 · ROOF CONSTRUCTION
 * ========================================================================== */

export function constructHEarthShedRoofMesh({
  primitiveId,
  minimumX,
  maximumX,
  minimumZ,
  maximumZ,
  lowY,
  highY,
  riseAxis = 'X',
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthFiniteNumber(minimumX) ||
    !isHEarthFiniteNumber(maximumX) ||
    !isHEarthFiniteNumber(minimumZ) ||
    !isHEarthFiniteNumber(maximumZ) ||
    !isHEarthFiniteNumber(lowY) ||
    !isHEarthFiniteNumber(highY) ||
    minimumX >= maximumX ||
    minimumZ >= maximumZ ||
    lowY === highY ||
    !['X', 'Z'].includes(riseAxis) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'SHED_ROOF_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_SHED_ROOF_INPUT_INVALID',
          'ERROR',
          'Shed-roof construction requires lawful extents and distinct elevations.'
        )
      ],

      metadata
    });
  }

  const vertices =
    riseAxis === 'X'
      ? [
          createHEarthVector3(
            minimumX,
            lowY,
            minimumZ
          ),

          createHEarthVector3(
            maximumX,
            highY,
            minimumZ
          ),

          createHEarthVector3(
            maximumX,
            highY,
            maximumZ
          ),

          createHEarthVector3(
            minimumX,
            lowY,
            maximumZ
          )
        ]
      : [
          createHEarthVector3(
            minimumX,
            lowY,
            minimumZ
          ),

          createHEarthVector3(
            maximumX,
            lowY,
            minimumZ
          ),

          createHEarthVector3(
            maximumX,
            highY,
            maximumZ
          ),

          createHEarthVector3(
            minimumX,
            highY,
            maximumZ
          )
        ];

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.SHED_ROOF_MESH,

    vertices,

    indices: [
      0,
      1,
      2,

      0,
      2,
      3
    ],

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      riseAxis,

      roofType:
        'SHED',

      openNeutralMeshExpected:
        true,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext
  });
}


export function constructHEarthGableRoofMesh({
  primitiveId,
  minimumX,
  maximumX,
  minimumZ,
  maximumZ,
  eaveY,
  ridgeY,
  ridgeAxis = 'Z',
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthFiniteNumber(minimumX) ||
    !isHEarthFiniteNumber(maximumX) ||
    !isHEarthFiniteNumber(minimumZ) ||
    !isHEarthFiniteNumber(maximumZ) ||
    !isHEarthFiniteNumber(eaveY) ||
    !isHEarthFiniteNumber(ridgeY) ||
    minimumX >= maximumX ||
    minimumZ >= maximumZ ||
    ridgeY <= eaveY ||
    !['X', 'Z'].includes(ridgeAxis) ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'GABLE_ROOF_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_GABLE_ROOF_INPUT_INVALID',
          'ERROR',
          'Gable-roof construction requires lawful extents and a ridge above the eaves.'
        )
      ],

      metadata
    });
  }

  let vertices;
  let indices;

  if (ridgeAxis === 'Z') {
    const centerX =
      (
        minimumX +
        maximumX
      ) *
      0.5;

    vertices = [
      createHEarthVector3(
        minimumX,
        eaveY,
        minimumZ
      ),

      createHEarthVector3(
        centerX,
        ridgeY,
        minimumZ
      ),

      createHEarthVector3(
        maximumX,
        eaveY,
        minimumZ
      ),

      createHEarthVector3(
        minimumX,
        eaveY,
        maximumZ
      ),

      createHEarthVector3(
        centerX,
        ridgeY,
        maximumZ
      ),

      createHEarthVector3(
        maximumX,
        eaveY,
        maximumZ
      )
    ];

    indices = [
      0,
      4,
      1,

      0,
      3,
      4,

      1,
      5,
      2,

      1,
      4,
      5
    ];
  } else {
    const centerZ =
      (
        minimumZ +
        maximumZ
      ) *
      0.5;

    vertices = [
      createHEarthVector3(
        minimumX,
        eaveY,
        minimumZ
      ),

      createHEarthVector3(
        maximumX,
        eaveY,
        minimumZ
      ),

      createHEarthVector3(
        minimumX,
        ridgeY,
        centerZ
      ),

      createHEarthVector3(
        maximumX,
        ridgeY,
        centerZ
      ),

      createHEarthVector3(
        minimumX,
        eaveY,
        maximumZ
      ),

      createHEarthVector3(
        maximumX,
        eaveY,
        maximumZ
      )
    ];

    indices = [
      0,
      1,
      3,

      0,
      3,
      2,

      2,
      3,
      5,

      2,
      5,
      4
    ];
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.GABLE_ROOF_MESH,

    vertices,

    indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      ridgeAxis,

      roofType:
        'GABLE',

      openNeutralMeshExpected:
        true,

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext
  });
}


/* ==========================================================================
 * 13 · SPHERE-FAMILY POLE-FAN TOPOLOGY
 * ========================================================================== */

function constructSphereFamilyPoleFan({
  longitudeSampleCount,
  latitudeSampleCount,
  pointEvaluator,
  toleranceContext
}) {
  if (
    !isHEarthPositiveSafeInteger(
      longitudeSampleCount
    ) ||
    longitudeSampleCount < 3 ||
    !isHEarthPositiveSafeInteger(
      latitudeSampleCount
    ) ||
    latitudeSampleCount < 3 ||
    typeof pointEvaluator !== 'function' ||
    !isHEarthGeometryToleranceContext(
      toleranceContext
    )
  ) {
    return {
      valid:
        false,

      vertices:
        [],

      indices:
        [],

      issues: [
        createSouthIssue(
          'SOUTH_POLE_FAN_CONFIGURATION_INVALID',
          'ERROR',
          'Sphere-family pole-fan construction received invalid configuration.'
        )
      ]
    };
  }

  const issues = [];
  const southPoleCandidates = [];
  const northPoleCandidates = [];

  for (
    let longitudeIndex = 0;
    longitudeIndex < longitudeSampleCount;
    longitudeIndex += 1
  ) {
    const longitudeRadians =
      (
        longitudeIndex /
        longitudeSampleCount
      ) *
      Math.PI *
      2;

    let southPole;
    let northPole;

    try {
      southPole =
        pointEvaluator({
          longitudeRadians,

          latitudeRadians:
            -Math.PI *
            0.5,

          longitudeIndex,

          latitudeIndex:
            0
        });

      northPole =
        pointEvaluator({
          longitudeRadians,

          latitudeRadians:
            Math.PI *
            0.5,

          longitudeIndex,

          latitudeIndex:
            latitudeSampleCount -
            1
        });
    } catch (error) {
      return {
        valid:
          false,

        vertices:
          [],

        indices:
          [],

        issues: [
          createSouthIssue(
            'SOUTH_POLE_FAN_EVALUATOR_THREW',
            'ERROR',
            'Sphere-family evaluator threw while resolving pole candidates.',
            {
              longitudeIndex,

              errorName:
                error?.name ??
                null,

              errorMessage:
                error?.message ??
                null
            }
          )
        ]
      };
    }

    if (
      !isHEarthVector3(southPole) ||
      !isHEarthVector3(northPole)
    ) {
      return {
        valid:
          false,

        vertices:
          [],

        indices:
          [],

        issues: [
          createSouthIssue(
            'SOUTH_POLE_FAN_POLE_NONFINITE',
            'ERROR',
            'Sphere-family evaluator produced a nonfinite pole candidate.',
            {
              longitudeIndex
            }
          )
        ]
      };
    }

    southPoleCandidates.push(
      southPole
    );

    northPoleCandidates.push(
      northPole
    );
  }

  const southPole =
    southPoleCandidates[0];

  const northPole =
    northPoleCandidates[0];

  for (
    let index = 1;
    index < longitudeSampleCount;
    index += 1
  ) {
    const southDistance =
      getHEarthVector3Distance(
        southPole,
        southPoleCandidates[index]
      );

    const northDistance =
      getHEarthVector3Distance(
        northPole,
        northPoleCandidates[index]
      );

    if (
      !isHEarthFiniteNumber(
        southDistance
      ) ||
      !isHEarthFiniteNumber(
        northDistance
      ) ||
      southDistance >
        toleranceContext
          .positionTolerance ||
      northDistance >
        toleranceContext
          .positionTolerance
    ) {
      issues.push(
        createSouthIssue(
          'SOUTH_POLE_FAN_POLE_INCONSISTENT',
          'ERROR',
          'Sphere-family evaluator is longitude-dependent at a pole.',
          {
            longitudeIndex:
              index,

            southDistance,

            northDistance,

            positionTolerance:
              toleranceContext
                .positionTolerance
          }
        )
      );
    }
  }

  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return {
      valid:
        false,

      vertices:
        [],

      indices:
        [],

      issues
    };
  }

  const vertices = [
    southPole
  ];

  const intermediateRingCount =
    latitudeSampleCount -
    2;

  for (
    let ringIndex = 0;
    ringIndex < intermediateRingCount;
    ringIndex += 1
  ) {
    const latitudeIndex =
      ringIndex +
      1;

    const latitudeAmount =
      latitudeIndex /
      (
        latitudeSampleCount -
        1
      );

    const latitudeRadians =
      lerpHEarthNumber(
        -Math.PI *
          0.5,

        Math.PI *
          0.5,

        latitudeAmount
      );

    for (
      let longitudeIndex = 0;
      longitudeIndex < longitudeSampleCount;
      longitudeIndex += 1
    ) {
      const longitudeRadians =
        (
          longitudeIndex /
          longitudeSampleCount
        ) *
        Math.PI *
        2;

      let point;

      try {
        point =
          pointEvaluator({
            longitudeRadians,
            latitudeRadians,
            longitudeIndex,
            latitudeIndex
          });
      } catch (error) {
        return {
          valid:
            false,

          vertices:
            [],

          indices:
            [],

          issues: [
            createSouthIssue(
              'SOUTH_POLE_FAN_EVALUATOR_THREW',
              'ERROR',
              'Sphere-family evaluator threw while resolving an intermediate ring.',
              {
                latitudeIndex,
                longitudeIndex,

                errorName:
                  error?.name ??
                  null,

                errorMessage:
                  error?.message ??
                  null
              }
            )
          ]
        };
      }

      if (!isHEarthVector3(point)) {
        return {
          valid:
            false,

          vertices:
            [],

          indices:
            [],

          issues: [
            createSouthIssue(
              'SOUTH_POLE_FAN_RING_POINT_NONFINITE',
              'ERROR',
              'Sphere-family evaluator produced a nonfinite ring point.',
              {
                latitudeIndex,
                longitudeIndex
              }
            )
          ]
        };
      }

      vertices.push(point);
    }
  }

  const northPoleIndex =
    vertices.length;

  vertices.push(
    northPole
  );

  const indices = [];
  const firstRingStart = 1;

  for (
    let longitudeIndex = 0;
    longitudeIndex < longitudeSampleCount;
    longitudeIndex += 1
  ) {
    const nextLongitude =
      (
        longitudeIndex + 1
      ) %
      longitudeSampleCount;

    indices.push(
      0,
      firstRingStart +
        longitudeIndex,
      firstRingStart +
        nextLongitude
    );
  }

  for (
    let ringIndex = 0;
    ringIndex <
      intermediateRingCount - 1;
    ringIndex += 1
  ) {
    const lowerRingStart =
      1 +
      ringIndex *
      longitudeSampleCount;

    const upperRingStart =
      lowerRingStart +
      longitudeSampleCount;

    for (
      let longitudeIndex = 0;
      longitudeIndex < longitudeSampleCount;
      longitudeIndex += 1
    ) {
      const nextLongitude =
        (
          longitudeIndex + 1
        ) %
        longitudeSampleCount;

      const a =
        lowerRingStart +
        longitudeIndex;

      const b =
        lowerRingStart +
        nextLongitude;

      const c =
        upperRingStart +
        nextLongitude;

      const d =
        upperRingStart +
        longitudeIndex;

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

  const lastRingStart =
    1 +
    (
      intermediateRingCount - 1
    ) *
    longitudeSampleCount;

  for (
    let longitudeIndex = 0;
    longitudeIndex < longitudeSampleCount;
    longitudeIndex += 1
  ) {
    const nextLongitude =
      (
        longitudeIndex + 1
      ) %
      longitudeSampleCount;

    indices.push(
      northPoleIndex,
      lastRingStart +
        nextLongitude,
      lastRingStart +
        longitudeIndex
    );
  }

  return {
    valid:
      true,

    vertices,

    indices,

    issues,

    topology:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .sphereFamilyTopology
        .NONDEGENERATE_POLE_FAN,

    southPoleIndex:
      0,

    northPoleIndex,

    intermediateRingCount,

    longitudeSampleCount,

    latitudeSampleCount,

    duplicatePoleVertices:
      false,

    duplicateLongitudeTerminal:
      false
  };
}


/* ==========================================================================
 * 14 · ELLIPSOID
 * ========================================================================== */

export function evaluateHEarthEllipsoidPoint({
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radii,
  longitudeRadians,
  latitudeRadians
} = {}) {
  if (
    !isHEarthVector3(center) ||
    !isHEarthVector3(radii) ||
    !isHEarthPositiveFiniteNumber(
      radii.x
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.y
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.z
    ) ||
    !isHEarthFiniteNumber(
      longitudeRadians
    ) ||
    !isHEarthFiniteNumber(
      latitudeRadians
    )
  ) {
    return null;
  }

  const cosineLatitude =
    Math.cos(
      latitudeRadians
    );

  const sineLatitude =
    Math.sin(
      latitudeRadians
    );

  return createHEarthVector3(
    center.x +
      radii.x *
      cosineLatitude *
      Math.cos(
        longitudeRadians
      ),

    center.y +
      radii.y *
      sineLatitude,

    center.z +
      radii.z *
      cosineLatitude *
      Math.sin(
        longitudeRadians
      )
  );
}


export function constructHEarthEllipsoidMesh({
  primitiveId,
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radii,
  longitudeSampleCount = 32,
  latitudeSampleCount = 17,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(center) ||
    !isHEarthVector3(radii) ||
    !isHEarthPositiveFiniteNumber(
      radii.x
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.y
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.z
    ) ||
    !isHEarthPositiveSafeInteger(
      longitudeSampleCount
    ) ||
    longitudeSampleCount < 3 ||
    !isHEarthPositiveSafeInteger(
      latitudeSampleCount
    ) ||
    latitudeSampleCount < 3 ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'ELLIPSOID_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_ELLIPSOID_INPUT_INVALID',
          'ERROR',
          'Ellipsoid construction requires positive radii and lawful sampling counts.'
        )
      ],

      metadata
    });
  }

  const nominalBounds =
    createHEarthGeometryBounds([
      createHEarthVector3(
        center.x -
          radii.x,

        center.y -
          radii.y,

        center.z -
          radii.z
      ),

      createHEarthVector3(
        center.x +
          radii.x,

        center.y +
          radii.y,

        center.z +
          radii.z
      )
    ]);

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      nominalBounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'ELLIPSOID_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_ELLIPSOID_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Ellipsoid construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const poleFan =
    constructSphereFamilyPoleFan({
      longitudeSampleCount,

      latitudeSampleCount,

      toleranceContext:
        resolvedToleranceContext,

      pointEvaluator: ({
        longitudeRadians,
        latitudeRadians
      }) =>
        evaluateHEarthEllipsoidPoint({
          center,
          radii,
          longitudeRadians,
          latitudeRadians
        })
    });

  if (!poleFan.valid) {
    return makeConstructionFailure({
      constructionType:
        'ELLIPSOID_MESH',

      issues:
        poleFan.issues,

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.ELLIPSOID_MESH,

    vertices:
      poleFan.vertices,

    indices:
      poleFan.indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.CLOSED_REQUIRED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      center,

      radii,

      longitudeSampleCount,

      latitudeSampleCount,

      topology:
        poleFan.topology,

      southPoleIndex:
        poleFan.southPoleIndex,

      northPoleIndex:
        poleFan.northPoleIndex,

      intermediateRingCount:
        poleFan.intermediateRingCount,

      duplicatePoleVertices:
        false,

      poleDegenerateTriangles:
        false,

      duplicateLongitudeTerminal:
        false,

      expectedClosure:
        'CLOSED_REQUIRED',

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


/* ==========================================================================
 * 15 · SUPERELLIPSOID
 * ========================================================================== */

export function evaluateHEarthSuperellipsoidPoint({
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radii,
  longitudeRadians,
  latitudeRadians,
  latitudeExponent = 1,
  longitudeExponent = 1
} = {}) {
  if (
    !isHEarthVector3(center) ||
    !isHEarthVector3(radii) ||
    !isHEarthPositiveFiniteNumber(
      radii.x
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.y
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.z
    ) ||
    !isHEarthFiniteNumber(
      longitudeRadians
    ) ||
    !isHEarthFiniteNumber(
      latitudeRadians
    ) ||
    !isHEarthPositiveFiniteNumber(
      latitudeExponent
    ) ||
    !isHEarthPositiveFiniteNumber(
      longitudeExponent
    )
  ) {
    return null;
  }

  const latitudeCosine =
    signedPower(
      Math.cos(
        latitudeRadians
      ),
      latitudeExponent
    );

  const latitudeSine =
    signedPower(
      Math.sin(
        latitudeRadians
      ),
      latitudeExponent
    );

  const longitudeCosine =
    signedPower(
      Math.cos(
        longitudeRadians
      ),
      longitudeExponent
    );

  const longitudeSine =
    signedPower(
      Math.sin(
        longitudeRadians
      ),
      longitudeExponent
    );

  return createHEarthVector3(
    center.x +
      radii.x *
      latitudeCosine *
      longitudeCosine,

    center.y +
      radii.y *
      latitudeSine,

    center.z +
      radii.z *
      latitudeCosine *
      longitudeSine
  );
}


export function constructHEarthSuperellipsoidMesh({
  primitiveId,
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radii,
  latitudeExponent = 1,
  longitudeExponent = 1,
  longitudeSampleCount = 32,
  latitudeSampleCount = 17,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(center) ||
    !isHEarthVector3(radii) ||
    !isHEarthPositiveFiniteNumber(
      radii.x
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.y
    ) ||
    !isHEarthPositiveFiniteNumber(
      radii.z
    ) ||
    !isHEarthPositiveFiniteNumber(
      latitudeExponent
    ) ||
    !isHEarthPositiveFiniteNumber(
      longitudeExponent
    ) ||
    !isHEarthPositiveSafeInteger(
      longitudeSampleCount
    ) ||
    longitudeSampleCount < 3 ||
    !isHEarthPositiveSafeInteger(
      latitudeSampleCount
    ) ||
    latitudeSampleCount < 3 ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'SUPERELLIPSOID_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_SUPERELLIPSOID_INPUT_INVALID',
          'ERROR',
          'Superellipsoid construction requires positive radii, exponents, and lawful sample counts.'
        )
      ],

      metadata
    });
  }

  const nominalBounds =
    createHEarthGeometryBounds([
      createHEarthVector3(
        center.x -
          radii.x,

        center.y -
          radii.y,

        center.z -
          radii.z
      ),

      createHEarthVector3(
        center.x +
          radii.x,

        center.y +
          radii.y,

        center.z +
          radii.z
      )
    ]);

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      nominalBounds
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'SUPERELLIPSOID_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_SUPERELLIPSOID_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Superellipsoid construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const poleFan =
    constructSphereFamilyPoleFan({
      longitudeSampleCount,

      latitudeSampleCount,

      toleranceContext:
        resolvedToleranceContext,

      pointEvaluator: ({
        longitudeRadians,
        latitudeRadians
      }) =>
        evaluateHEarthSuperellipsoidPoint({
          center,
          radii,
          longitudeRadians,
          latitudeRadians,
          latitudeExponent,
          longitudeExponent
        })
    });

  if (!poleFan.valid) {
    return makeConstructionFailure({
      constructionType:
        'SUPERELLIPSOID_MESH',

      issues:
        poleFan.issues,

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.SUPERELLIPSOID_MESH,

    vertices:
      poleFan.vertices,

    indices:
      poleFan.indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.CLOSED_REQUIRED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      center,

      radii,

      latitudeExponent,

      longitudeExponent,

      longitudeSampleCount,

      latitudeSampleCount,

      topology:
        poleFan.topology,

      southPoleIndex:
        poleFan.southPoleIndex,

      northPoleIndex:
        poleFan.northPoleIndex,

      intermediateRingCount:
        poleFan.intermediateRingCount,

      duplicatePoleVertices:
        false,

      poleDegenerateTriangles:
        false,

      duplicateLongitudeTerminal:
        false,

      expectedClosure:
        'CLOSED_REQUIRED',

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


/* ==========================================================================
 * 16 · RADIAL SHELL
 * ========================================================================== */

export function constructHEarthRadialShellMesh({
  primitiveId,
  center =
    createHEarthVector3(
      0,
      0,
      0
    ),
  radialEvaluator,
  longitudeSampleCount = 32,
  latitudeSampleCount = 17,
  transform =
    createHEarthIdentityMatrix4(),
  semanticRole = null,
  materialHint = null,
  metadata = null,
  toleranceContext
} = {}) {
  if (
    !isHEarthNonEmptyString(primitiveId) ||
    !isHEarthVector3(center) ||
    typeof radialEvaluator !==
      'function' ||
    !isHEarthPositiveSafeInteger(
      longitudeSampleCount
    ) ||
    longitudeSampleCount < 3 ||
    !isHEarthPositiveSafeInteger(
      latitudeSampleCount
    ) ||
    latitudeSampleCount < 3 ||
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'RADIAL_SHELL_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_RADIAL_SHELL_INPUT_INVALID',
          'ERROR',
          'Radial-shell construction received invalid input.'
        )
      ],

      metadata
    });
  }

  const resolvedToleranceContext =
    resolveToleranceContext(
      toleranceContext,
      null
    );

  if (
    !isHEarthGeometryToleranceContext(
      resolvedToleranceContext
    )
  ) {
    return makeConstructionFailure({
      constructionType:
        'RADIAL_SHELL_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_RADIAL_SHELL_TOLERANCE_CONTEXT_INVALID',
          'ERROR',
          'Radial-shell construction requires a valid tolerance context.'
        )
      ],

      metadata
    });
  }

  const evaluatePoint = ({
    longitudeRadians,
    latitudeRadians,
    longitudeIndex,
    latitudeIndex
  }) => {
    const radius =
      radialEvaluator({
        longitudeRadians,
        latitudeRadians,
        longitudeIndex,
        latitudeIndex
      });

    if (
      !isHEarthPositiveFiniteNumber(radius)
    ) {
      return null;
    }

    const cosineLatitude =
      Math.cos(
        latitudeRadians
      );

    const sineLatitude =
      Math.sin(
        latitudeRadians
      );

    return createHEarthVector3(
      center.x +
        radius *
        cosineLatitude *
        Math.cos(
          longitudeRadians
        ),

      center.y +
        radius *
        sineLatitude,

      center.z +
        radius *
        cosineLatitude *
        Math.sin(
          longitudeRadians
        )
    );
  };

  const poleFan =
    constructSphereFamilyPoleFan({
      longitudeSampleCount,

      latitudeSampleCount,

      pointEvaluator:
        evaluatePoint,

      toleranceContext:
        resolvedToleranceContext
    });

  if (!poleFan.valid) {
    return makeConstructionFailure({
      constructionType:
        'RADIAL_SHELL_MESH',

      issues: [
        ...poleFan.issues,

        createSouthIssue(
          'SOUTH_RADIAL_SHELL_POLE_FAN_FAILED',
          'ERROR',
          'Radial-shell construction could not produce a lawful pole fan.'
        )
      ],

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.RADIAL_SHELL_MESH,

    vertices:
      poleFan.vertices,

    indices:
      poleFan.indices,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.CLOSED_REQUIRED,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      center,

      longitudeSampleCount,

      latitudeSampleCount,

      topology:
        poleFan.topology,

      southPoleIndex:
        poleFan.southPoleIndex,

      northPoleIndex:
        poleFan.northPoleIndex,

      intermediateRingCount:
        poleFan.intermediateRingCount,

      radialEvaluatorType:
        'CALLBACK',

      poleRadiusConsistencyRequired:
        true,

      duplicatePoleVertices:
        false,

      poleDegenerateTriangles:
        false,

      duplicateLongitudeTerminal:
        false,

      expectedClosure:
        'CLOSED_REQUIRED',

      admitted:
        false,

      admissionAuthority:
        'WEST_ONLY'
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


/* ==========================================================================
 * 17 · RECORD VALIDATION
 * ========================================================================== */

export function isHEarthNeutralGeometryRecord(
  record
) {
  if (
    !isPlainObject(record) ||
    record.recordType !==
      'H_EARTH_PROJECTION_NEUTRAL_GEOMETRY_RECORD' ||
    record.projectionNeutral !== true ||
    record.admitted !== false ||
    record.admissionAuthority !==
      'WEST_ONLY' ||
    !isHEarthNonEmptyString(
      record.geometryId
    ) ||
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode,
      record.topologyMode
    ) ||
    !areFiniteVector3Array(
      record.vertices
    ) ||
    !Array.isArray(record.indices) ||
    !isHEarthAABB3D(
      record.bounds
    ) ||
    !isHEarthMatrix4(
      record.transform
    )
  ) {
    return false;
  }

  if (
    record.topologyMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode.TRIANGLES
  ) {
    return areValidTriangleIndices(
      record.indices,
      record.vertices.length
    );
  }

  if (
    record.topologyMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode.LINES
  ) {
    return areValidLineIndices(
      record.indices,
      record.vertices.length
    );
  }

  return record.indices.every(
    (index) =>
      isHEarthNonNegativeSafeInteger(index) &&
      index < record.vertices.length
  );
}


export function isHEarthNeutralPrimitiveRecord(
  record
) {
  return (
    isPlainObject(record) &&
    record.recordType ===
      'H_EARTH_PROJECTION_NEUTRAL_PRIMITIVE_RECORD' &&
    record.projectionNeutral === true &&
    record.admitted === false &&
    record.admissionAuthority ===
      'WEST_ONLY' &&
    record.providerOutput === false &&
    record.rendererMaterialized === false &&
    isHEarthNonEmptyString(
      record.primitiveId
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType,
      record.primitiveType
    ) &&
    isHEarthNeutralGeometryRecord(
      record.geometry
    )
  );
}


/* ==========================================================================
 * 18 · OWNERSHIP
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY',

    owns:
      deepFreeze([
        'NEUTRAL_GEOMETRY_RECORDS',
        'NEUTRAL_PRIMITIVE_RECORDS',
        'POINT_CONSTRUCTION',
        'POINT_SET_CONSTRUCTION',
        'LINE_SEGMENT_CONSTRUCTION',
        'POLYLINE_CONSTRUCTION',
        'TRIANGLE_CONSTRUCTION',
        'TRIANGLE_MESH_CONSTRUCTION',
        'BILLBOARD_NEUTRAL_RECORD_CONSTRUCTION',
        'HEIGHT_FIELD_MESH_CONSTRUCTION',
        'PARAMETRIC_SURFACE_MESH_CONSTRUCTION',
        'XZ_RIBBON_MESH_CONSTRUCTION',
        'CONVEX_EXTRUSION_CONSTRUCTION',
        'PRISM_CONSTRUCTION',
        'GABLE_ROOF_CONSTRUCTION',
        'SHED_ROOF_CONSTRUCTION',
        'ELLIPSOID_CONSTRUCTION',
        'SUPERELLIPSOID_CONSTRUCTION',
        'RADIAL_SHELL_CONSTRUCTION',
        'NONDEGENERATE_POLE_FAN_TOPOLOGY',
        'OPEN_NEUTRAL_MESH_CONSTRUCTION',
        'CLOSED_OUTWARD_TOPOLOGY_ENFORCEMENT',
        'EXTRUSION_CAP_PLAN_ORIENTATION',
        'EXTRUSION_SIDE_BOUNDARY_WINDING',
        'NEUTRAL_NORMAL_ATTACHMENT',
        'NEUTRAL_BOUNDS_ATTACHMENT',
        'CONSTRUCTION_ISSUE_PRESERVATION'
      ]),

    mustNotOwn:
      deepFreeze([
        'FOUNDATIONAL_MATHEMATICS',
        'DESCRIPTOR_AUTHORITY',
        'ANALYSIS_AUTHORITY',
        'PRIMITIVE_ADMISSION',
        'PROVIDER_ADMISSION',
        'PROVIDER_ACCOUNTING',
        'CAPACITY_CONSUMPTION',
        'ENVIRONMENT_INTERPRETATION',
        'AGGREGATE_FRAME_ADMISSION',
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
        './geometry-kernel.east.js'
      ]),

    prohibitedImports:
      deepFreeze([
        './geometry-kernel.west.js',
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
 * 19 · CORRECTION DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTIONS =
  deepFreeze({
    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

    correctionScope:
      'SOUTH_TOPOLOGY_WINDING_AND_EXECUTABLE_FIXTURE_CORRECTION_ONLY',

    architecturalRewrite:
      false,

    publicApiRedesign:
      false,

    southJurisdictionChange:
      false,

    westAuthorityCreated:
      false,

    providerAuthorityCreated:
      false,

    rendererAuthorityCreated:
      false,

    westCompensation:
      'PROHIBITED',

    staticReviewOnlyApproval:
      'PROHIBITED',

    preBackingExecutableGate:
      'REQUIRED',

    corrections:
      deepFreeze([
        deepFreeze({
          id:
            'SOUTH_CORRECTION_01',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Triangle-mesh construction enforces OPEN_ALLOWED, CLOSED_REQUIRED, and UNSPECIFIED topology expectations.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_02',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'CLOSED_REQUIRED now consumes East indexed-mesh closure fields directly through valid, classification, structurallyClosed, closed, outwardClosed, directed conflicts, closureRequirements, and issues.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_03',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Extrusion orientation is resolved from the East triangle plan without reversing and re-triangulating profilePoints.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_04',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Extrusion lower-cap and upper-cap triangle indices are selected directly from forward and reversed East plans.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_05',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Extrusion side winding is derived from the selected lower-cap boundary direction.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_06',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Prism remains a closed-shell extrusion and cannot escape as a lawful open mesh.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_07',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Sphere-family topology reverses the south fan and north fan only, while preserving the intermediate band winding [a,c,b] [a,d,c].'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_08',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Open neutral mesh validity is restricted to open-by-design constructors.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_09',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Triangle-bearing primitive types are restricted to lawful constructor paths.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_10',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'South does not depend on an unsupported North parallelTolerance field and instead uses an explicit South-local parallel alignment epsilon.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_11',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'All South records remain unadmitted with WEST_ONLY admission authority.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_12',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'The mandatory executable pre-backing corridor is declared but not claimed passed.'
        })
      ]),

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 20 · REQUIRED FIXTURES
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_REQUIRED_FIXTURES =
  deepFreeze([
    'SOUTH_IMPORTS_NORTH_AND_EAST_ONLY',
    'SOUTH_NAMED_IMPORTS_RESOLVE',
    'SOUTH_NAMED_IMPORTS_ARE_USED',
    'NO_PROHIBITED_IMPORTS',

    'NEUTRAL_GEOMETRY_RECORD_IS_PROJECTION_NEUTRAL',
    'NEUTRAL_GEOMETRY_RECORD_IS_NOT_ADMITTED',
    'NEUTRAL_GEOMETRY_RECORD_ADMISSION_AUTHORITY_IS_WEST_ONLY',
    'NEUTRAL_PRIMITIVE_RECORD_IS_NOT_ADMITTED',
    'NEUTRAL_PRIMITIVE_RECORD_ADMISSION_AUTHORITY_IS_WEST_ONLY',
    'CONSTRUCTION_SUCCESS_DOES_NOT_EQUAL_WEST_ADMISSION',

    'POINT_CONSTRUCTION_PRESERVES_EXACT_POSITION',
    'LINE_SEGMENT_REJECTS_DEGENERATE_LENGTH',
    'POLYLINE_REJECTS_DEGENERATE_SEGMENT',
    'TRIANGLE_REJECTS_AREA_AT_OR_BELOW_TOLERANCE',
    'TRIANGLE_MESH_REJECTS_NON_TRIANGLE_BEARING_PRIMITIVE_TYPE',
    'EXTRUSION_REJECTS_NON_EXTRUSION_PATH_PRIMITIVE_TYPE',
    'SINGLE_TRIANGLE_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'SINGLE_TRIANGLE_OPEN_MESH_REMAINS_UNADMITTED',
    'TRIANGLE_MESH_REJECTS_INVALID_INDICES',
    'TRIANGLE_MESH_BOUNDS_MATCH_ACTUAL_VERTICES',
    'TRIANGLE_MESH_NORMALS_DERIVED_FROM_ACTUAL_TRIANGLES',

    'BILLBOARD_USES_CONSERVATIVE_RADIUS_BOUNDS',

    'HEIGHT_FIELD_REJECTED_SAMPLE_DOES_NOT_COMPACT_TOPOLOGY',
    'HEIGHT_FIELD_TRIANGLES_USE_A_C_B_AND_A_D_C',
    'HEIGHT_FIELD_UPWARD_ORIENTATION_USES_SV_CROSS_SU',
    'HEIGHT_FIELD_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'HEIGHT_FIELD_OPEN_MESH_REMAINS_UNADMITTED',
    'PERIODIC_PARAMETRIC_GRID_WRAPS_WITHOUT_DUPLICATE_TERMINAL_COLUMN',

    'XZ_RIBBON_LEFT_NORMAL_EQUALS_NEGATIVE_TZ_ZERO_TX',
    'XZ_RIBBON_REJECTS_DEGENERATE_SEGMENT',
    'XZ_RIBBON_BOUNDED_MITER_FALLS_BACK_TO_BEVEL',
    'XZ_RIBBON_ROUND_JOIN_NOT_CLAIMED',
    'XZ_RIBBON_ROUND_CAP_NOT_CLAIMED',

    'CONVEX_EXTRUSION_CONSUMES_EAST_ANALYSIS_PLAN_ONLY',
    'CONVEX_EXTRUSION_DOES_NOT_CREATE_ADMISSION',
    'CONVEX_EXTRUSION_FORWARD_PROFILE_POSITIVE_DIRECTION_CLOSED_OUTWARD',
    'CONVEX_EXTRUSION_REVERSED_PROFILE_POSITIVE_DIRECTION_CLOSED_OUTWARD',
    'CONVEX_EXTRUSION_FORWARD_PROFILE_NEGATIVE_DIRECTION_CLOSED_OUTWARD',
    'CONVEX_EXTRUSION_TRIANGULAR_PROFILE_CLOSED_OUTWARD',
    'CONVEX_EXTRUSION_HAS_NO_DIRECTED_EDGE_CONFLICT',
    'CONVEX_EXTRUSION_TOPOLOGY_IS_CLOSED_OUTWARD',

    'PRISM_SIDE_COUNT_BELOW_THREE_REJECTED',
    'PRISM_MESH_HAS_NO_DIRECTED_EDGE_CONFLICT',
    'PRISM_TOPOLOGY_IS_CLOSED_OUTWARD',

    'GABLE_ROOF_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'GABLE_ROOF_OPEN_MESH_REMAINS_UNADMITTED',
    'SHED_ROOF_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'SHED_ROOF_OPEN_MESH_REMAINS_UNADMITTED',

    'ELLIPSOID_POINT_SATISFIES_EXACT_EQUATION_WITHIN_TOLERANCE',
    'ELLIPSOID_PERIODIC_LONGITUDE_EXCLUDES_DUPLICATE_TERMINAL',
    'ELLIPSOID_USES_SINGLE_NORTH_POLE_VERTEX',
    'ELLIPSOID_USES_SINGLE_SOUTH_POLE_VERTEX',
    'ELLIPSOID_POLE_FAN_HAS_NO_DEGENERATE_TRIANGLES',
    'ELLIPSOID_MESH_HAS_NO_DIRECTED_EDGE_CONFLICT',
    'ELLIPSOID_TOPOLOGY_IS_CLOSED_OUTWARD',
    'ELLIPSOID_MESH_CONSTRUCTION_VALID',

    'SUPERELLIPSOID_REJECTS_NONPOSITIVE_EXPONENT',
    'SUPERELLIPSOID_USES_NONDEGENERATE_POLE_FAN',
    'SUPERELLIPSOID_MESH_HAS_NO_DIRECTED_EDGE_CONFLICT',
    'SUPERELLIPSOID_TOPOLOGY_IS_CLOSED_OUTWARD',
    'SUPERELLIPSOID_MESH_CONSTRUCTION_VALID',

    'RADIAL_SHELL_REJECTS_NONPOSITIVE_RADIUS',
    'RADIAL_SHELL_REJECTS_LONGITUDE_DEPENDENT_POLE_RADIUS',
    'RADIAL_SHELL_USES_NONDEGENERATE_POLE_FAN',
    'RADIAL_SHELL_MESH_HAS_NO_DIRECTED_EDGE_CONFLICT',
    'RADIAL_SHELL_TOPOLOGY_IS_CLOSED_OUTWARD',
    'RADIAL_SHELL_MESH_CONSTRUCTION_VALID',

    'NO_DIRECTED_EDGE_CONFLICT_FOR_ALL_SPHERE_FAMILY_MESHES',
    'SOUTH_POLE_FAN_AND_NORTH_FAN_ARE_REVERSED_ONLY',
    'INTERMEDIATE_BAND_WINDING_REMAINS_A_C_B_AND_A_D_C',
    'SOUTH_PARALLEL_ALIGNMENT_EPSILON_IS_LOCAL_NOT_NORTH_SCHEMA',

    'NO_PROVIDER_AUTHORITY_CREATED',
    'NO_GEOMETRY_INDEX_AUTHORITY_CREATED',
    'NO_COMPOSITOR_AUTHORITY_CREATED',
    'NO_RENDERER_AUTHORITY_CREATED',
    'NO_VISUAL_APPROVAL_CREATED',
    'NO_PRODUCTION_AUTHORITY_CREATED',
    'NO_PUBLIC_RELEASE_AUTHORITY_CREATED'
  ]);


/* ==========================================================================
 * 21 · PRE-BACKING GATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PRE_BACKING_GATE =
  deepFreeze({
    gateId:
      'SOUTH_PRE_BACKING_GATE_v1',

    requiredSequence:
      deepFreeze([
        'NODE_SYNTAX_CHECK',
        'NAMED_IMPORT_RESOLUTION',
        'UNUSED_IMPORT_SCAN',
        'PROHIBITED_IMPORT_SCAN',
        'STATIC_SELF_REVIEW',
        'EXECUTABLE_FIXTURE_CORRIDOR',
        'EAST_TOPOLOGY_RECHECK',
        'FIXTURES_FAILED_ZERO'
      ]),

    nodeSyntaxCheckCommand:
      'node --check geometry-kernel.south.js',

    allowedImports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js'
      ]),

    requiredFixtureCount:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_REQUIRED_FIXTURES
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

    eastTopologyRecheckPerformed:
      false,

    fixturesFailed:
      null,

    gatePassed:
      false
  });


/* ==========================================================================
 * 22 · STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryKernelSouthStaticReview() {
  const closedResultPasses =
    (result) =>
      result?.valid === true &&
      result.openNeutralMesh === false &&
      result.admitted === false &&
      result.admissionAuthority ===
        'WEST_ONLY' &&
      isClosedOutwardTopologyAnalysis(
        result
          ?.geometry
          ?.metadata
          ?.topologyAnalysis
      );

  const pointResult =
    constructHEarthPoint({
      primitiveId:
        'STATIC_POINT',

      position:
        createHEarthVector3(
          0,
          0,
          0
        )
    });

  const triangleResult =
    constructHEarthTriangle({
      primitiveId:
        'STATIC_TRIANGLE',

      a:
        createHEarthVector3(
          0,
          0,
          0
        ),

      b:
        createHEarthVector3(
          1,
          0,
          0
        ),

      c:
        createHEarthVector3(
          0,
          0,
          1
        )
    });

  const invalidPrimitiveTypeMeshResult =
    constructHEarthTriangleMesh({
      primitiveId:
        'STATIC_INVALID_TRIANGLE_MESH_TYPE',

      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType.POINT,

      vertices: [
        createHEarthVector3(0, 0, 0),
        createHEarthVector3(1, 0, 0),
        createHEarthVector3(0, 0, 1)
      ],

      indices: [0, 1, 2]
    });

  const invalidExtrusionTypeResult =
    constructHEarthConvexExtrusionMesh({
      primitiveId:
        'STATIC_INVALID_EXTRUSION_TYPE',

      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType.BILLBOARD,

      profilePoints: [
        createHEarthVector3(-1, 0, -1),
        createHEarthVector3(1, 0, -1),
        createHEarthVector3(1, 0, 1),
        createHEarthVector3(-1, 0, 1)
      ],

      distance: 1
    });

  const squareProfile = [
    createHEarthVector3(
      -1,
      0,
      -1
    ),

    createHEarthVector3(
      1,
      0,
      -1
    ),

    createHEarthVector3(
      1,
      0,
      1
    ),

    createHEarthVector3(
      -1,
      0,
      1
    )
  ];

  const extrusionPositive =
    constructHEarthConvexExtrusionMesh({
      primitiveId:
        'STATIC_EXTRUSION_POSITIVE',

      profilePoints:
        squareProfile,

      projectionPlane:
        H_EARTH_3D_GEOMETRY_EAST_ENUMS
          .polygonProjectionPlane.XZ,

      direction:
        createHEarthVector3(
          0,
          1,
          0
        ),

      distance:
        2
    });

  const extrusionReversed =
    constructHEarthConvexExtrusionMesh({
      primitiveId:
        'STATIC_EXTRUSION_REVERSED_PROFILE',

      profilePoints:
        squareProfile
          .slice()
          .reverse(),

      projectionPlane:
        H_EARTH_3D_GEOMETRY_EAST_ENUMS
          .polygonProjectionPlane.XZ,

      direction:
        createHEarthVector3(
          0,
          1,
          0
        ),

      distance:
        2
    });

  const extrusionNegative =
    constructHEarthConvexExtrusionMesh({
      primitiveId:
        'STATIC_EXTRUSION_NEGATIVE',

      profilePoints:
        squareProfile,

      projectionPlane:
        H_EARTH_3D_GEOMETRY_EAST_ENUMS
          .polygonProjectionPlane.XZ,

      direction:
        createHEarthVector3(
          0,
          -1,
          0
        ),

      distance:
        2
    });

  const prismResult =
    constructHEarthPrismMesh({
      primitiveId:
        'STATIC_PRISM',

      radius:
        1,

      height:
        2,

      sideCount:
        6
    });

  const ellipsoidResult =
    constructHEarthEllipsoidMesh({
      primitiveId:
        'STATIC_ELLIPSOID',

      radii:
        createHEarthVector3(
          1,
          1,
          1
        ),

      longitudeSampleCount:
        8,

      latitudeSampleCount:
        5
    });

  const superellipsoidResult =
    constructHEarthSuperellipsoidMesh({
      primitiveId:
        'STATIC_SUPERELLIPSOID',

      radii:
        createHEarthVector3(
          1,
          1,
          1
        ),

      longitudeSampleCount:
        8,

      latitudeSampleCount:
        5
    });

  const radialShellResult =
    constructHEarthRadialShellMesh({
      primitiveId:
        'STATIC_RADIAL_SHELL',

      radialEvaluator:
        () => 1,

      longitudeSampleCount:
        8,

      latitudeSampleCount:
        5
    });

  const checks =
    deepFreeze([
      deepFreeze({
        id:
          'SOUTH_IMPORTS_NORTH_AND_EAST_ONLY',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.length === 2 &&
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.includes('./geometry-kernel.north.js') &&
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.includes('./geometry-kernel.east.js')
      }),

      deepFreeze({
        id:
          'NORTH_CONTRACT_EXPECTED',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID ===
            'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1'
      }),

      deepFreeze({
        id:
          'EAST_CONTRACT_EXPECTED',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID ===
            'H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1'
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
          'POINT_RESULT_NOT_ADMITTED',

        passed:
          pointResult.valid === true &&
          pointResult.admitted === false &&
          pointResult.admissionAuthority ===
            'WEST_ONLY'
      }),

      deepFreeze({
        id:
          'OPEN_TRIANGLE_VALID',

        passed:
          triangleResult.valid === true &&
          triangleResult.openNeutralMesh === true &&
          triangleResult.admitted === false
      }),

      deepFreeze({
        id:
          'TRIANGLE_MESH_REJECTS_NON_TRIANGLE_BEARING_PRIMITIVE_TYPE',

        passed:
          invalidPrimitiveTypeMeshResult.valid === false
      }),

      deepFreeze({
        id:
          'EXTRUSION_REJECTS_NON_EXTRUSION_PATH_PRIMITIVE_TYPE',

        passed:
          invalidExtrusionTypeResult.valid === false
      }),

      deepFreeze({
        id:
          'EXTRUSION_POSITIVE_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            extrusionPositive
          )
      }),

      deepFreeze({
        id:
          'EXTRUSION_REVERSED_PROFILE_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            extrusionReversed
          )
      }),

      deepFreeze({
        id:
          'EXTRUSION_NEGATIVE_DIRECTION_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            extrusionNegative
          )
      }),

      deepFreeze({
        id:
          'PRISM_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            prismResult
          )
      }),

      deepFreeze({
        id:
          'ELLIPSOID_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            ellipsoidResult
          )
      }),

      deepFreeze({
        id:
          'SUPERELLIPSOID_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            superellipsoidResult
          )
      }),

      deepFreeze({
        id:
          'RADIAL_SHELL_CLOSED_OUTWARD',

        passed:
          closedResultPasses(
            radialShellResult
          )
      }),

      deepFreeze({
        id:
          'SOUTH_PARALLEL_ALIGNMENT_EPSILON_IS_LOCAL',

        passed:
          isHEarthPositiveFiniteNumber(
            H_EARTH_3D_GEOMETRY_SOUTH_PARALLEL_ALIGNMENT_EPSILON
          )
      }),

      deepFreeze({
        id:
          'WEST_AUTHORITY_NOT_OWNED',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .mustNotOwn.includes(
              'PRIMITIVE_ADMISSION'
            )
      }),

      deepFreeze({
        id:
          'RENDERER_AUTHORITY_NOT_OWNED',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
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
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_TOPOLOGY_CORRECTED_STATIC_SELF_REVIEW_v2',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

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

    eastTopologyRecheckPerformed:
      false,

    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });
}


/* ==========================================================================
 * 23 · RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_TOPOLOGY_CORRECTED_IMPLEMENTATION_CANDIDATE_RECEIPT_v2',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

    correctionReason:
      'PREVIOUS_BACKING_APPROVAL_WAS_PREMATURE_BECAUSE_EXECUTABLE_TOPOLOGY_FIXTURES_WERE_NOT_RUN_BEFORE_BACKING',

    correctionScope:
      'SOUTH_TOPOLOGY_WINDING_AND_EXECUTABLE_FIXTURE_CORRECTION_ONLY',

    previousBackingApproval:
      'PREMATURE',

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

    eastTopologyRecheckPerformed:
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

    southLocalAdmission:
      false,

    southPublicSymbolFreeze:
      false,

    westImplementationAuthority:
      false,

    facadeConstructionAuthority:
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
      'NODE_SYNTAX_CHECK_THEN_NAMED_IMPORT_RESOLUTION_THEN_UNUSED_IMPORT_SCAN_THEN_PROHIBITED_IMPORT_SCAN_THEN_STATIC_SELF_REVIEW_THEN_EXECUTABLE_FIXTURE_CORRIDOR_THEN_EAST_TOPOLOGY_RECHECK_THEN_FIXTURES_FAILED_ZERO'
  });


/* ==========================================================================
 * 24 · PUBLIC API CANDIDATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-kernel.south.js',

    classification:
      'SOUTH_PUBLIC_CANDIDATE',

    symbols:
      deepFreeze([
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE',
        'H_EARTH_3D_GEOMETRY_SOUTH_ENUMS',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTIONS',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_REQUIRED_FIXTURES',
        'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PRE_BACKING_GATE',
        'createHEarthNeutralGeometryRecord',
        'createHEarthNeutralPrimitiveRecord',
        'constructHEarthTriangleMesh',
        'constructHEarthPoint',
        'constructHEarthPointSet',
        'constructHEarthLineSegment',
        'constructHEarthPolyline',
        'constructHEarthTriangle',
        'constructHEarthBillboard',
        'constructHEarthHeightFieldMesh',
        'constructHEarthParametricSurfaceMesh',
        'constructHEarthXZRibbonMesh',
        'constructHEarthConvexExtrusionMesh',
        'constructHEarthPrismMesh',
        'constructHEarthShedRoofMesh',
        'constructHEarthGableRoofMesh',
        'evaluateHEarthEllipsoidPoint',
        'constructHEarthEllipsoidMesh',
        'evaluateHEarthSuperellipsoidPoint',
        'constructHEarthSuperellipsoidMesh',
        'constructHEarthRadialShellMesh',
        'isHEarthNeutralGeometryRecord',
        'isHEarthNeutralPrimitiveRecord',
        'getHEarthGeometryKernelSouthStaticReview',
        'getHEarthGeometryKernelSouthReceipt',
        'getHEarthGeometryKernelSouthContract'
      ]),

    collisionStatus:
      'NOT_YET_REVIEWED',

    implementationStatus:
      'TOPOLOGY_CORRECTED_IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 25 · CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

    correctionScope:
      'SOUTH_TOPOLOGY_WINDING_AND_EXECUTABLE_FIXTURE_CORRECTION_ONLY',

    northDependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,

    northDependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,

    eastDependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,

    eastDependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,

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
      'PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY',

    dependencyDirection:
      'NORTH_AND_EAST_TO_SOUTH',

    imports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js'
      ]),

    ownership:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP,

    corrections:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTIONS,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_REQUIRED_FIXTURES,

    preBackingGate:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PRE_BACKING_GATE,

    enums:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT,

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    testExecutionPerformed:
      false,

    southLocalAdmission:
      false,

    southPublicSymbolFreeze:
      false,

    westImplementationAuthority:
      false,

    facadeConstructionAuthority:
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
 * 26 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryKernelSouthReceipt() {
  return H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT;
}


export function getHEarthGeometryKernelSouthContract() {
  return H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT;
}


export default H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT;
