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
 * STEP_034O_4S_TARGETED_IMPORT_POLE_FAN_AND_OPEN_MESH_VALIDITY_CORRECTION_SCOPE_v1
 *
 * STATUS:
 * SOUTH PROJECTION-NEUTRAL PRIMITIVE AND NEUTRAL GEOMETRY
 * CONSTRUCTION CORRECTED IMPLEMENTATION CANDIDATE.
 *
 * AUTHORIZED JURISDICTION:
 * PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY.
 *
 * IMPORT LAW:
 * SOUTH MAY IMPORT NORTH AND EAST ONLY.
 *
 * CONSTRUCTION SUCCESS DOES NOT EQUAL WEST ADMISSION.
 *
 * THIS FILE DOES NOT:
 * - perform primitive admission
 * - perform provider admission
 * - consume capacity.js
 * - consume environment.js
 * - aggregate provider frames
 * - construct the public facade
 * - author compositor policy
 * - project or materialize geometry
 * - create DOM, CSS, canvas, or WebGL objects
 * - claim visual approval
 * - claim production authority
 * - claim public-release authority
 *
 * IMPLEMENTATION CONFORMANCE:
 * NOT_YET_EVALUATED.
 *
 * SOUTH LOCAL ADMISSION:
 * FALSE.
 */


/* ==========================================================================
 * 01 · NORTH IMPORT SURFACE
 * ========================================================================== */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthFiniteNumber,
  isHEarthPositiveFiniteNumber,
  isHEarthNonNegativeFiniteNumber,
  isHEarthNonNegativeSafeInteger,
  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  clampHEarthNumber,
  lerpHEarthNumber,

  createHEarthVector3,
  isHEarthVector3,
  addHEarthVector3,
  subtractHEarthVector3,
  scaleHEarthVector3,
  dotHEarthVector3,
  getHEarthVector3Length,
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


/* ==========================================================================
 * 02 · EAST IMPORT SURFACE
 * ========================================================================== */

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
 * 03 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION = 2;

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-kernel.south.js';

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
  'STEP_034O_4S_TARGETED_IMPORT_POLE_FAN_AND_OPEN_MESH_VALIDITY_CORRECTION_SCOPE_v1';


/* ==========================================================================
 * 04 · INTERNAL STRUCTURE AND IMMUTABILITY
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

  const prototype = Object.getPrototypeOf(value);

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

  const clones = values.map(cloneVector3);

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
    indices.length % 2 === 0 &&
    indices.every(
      (index) =>
        isHEarthNonNegativeSafeInteger(index) &&
        index < vertexCount
    )
  );
}


function buildSequentialIndices(count) {
  if (
    !isHEarthNonNegativeSafeInteger(count)
  ) {
    return null;
  }

  return Array.from(
    { length: count },
    (_, index) => index
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


/* ==========================================================================
 * 05 · SOUTH ENUMERATIONS
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
        'CLOSED'
    }),

    sphereFamilyTopology: deepFreeze({
      NONDEGENERATE_POLE_FAN:
        'NONDEGENERATE_POLE_FAN'
    })
  });


/* ==========================================================================
 * 06 · NEUTRAL GEOMETRY RECORD
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


/* ==========================================================================
 * 07 · NEUTRAL PRIMITIVE RECORD
 * ========================================================================== */

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
    geometry.projectionNeutral !== true
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
 * 08 · NORMAL ATTACHMENT
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
 * 09 · GENERAL TRIANGLE-MESH CONSTRUCTION
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
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType,
      primitiveType
    )
  ) {
    issues.push(
      createSouthIssue(
        'SOUTH_PRIMITIVE_TYPE_INVALID',
        'ERROR',
        'Triangle-mesh construction received an unsupported primitive type.'
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
    ) ||
    indices.length === 0
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
    topologyAnalysis.classification ===
      H_EARTH_3D_GEOMETRY_EAST_ENUMS
        .topologyClassification.OPEN_MANIFOLD;

  /*
   * Open topology is lawful for a neutral South construction.
   * Boundary edges alone do not imply South construction failure.
   *
   * Any East-issued blocking issue still fails closed.
   */
  if (
    hasHEarthBlockingIssues(issues)
  ) {
    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata: {
        ...metadata,
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
        topologyAnalysis
      }
    });
  }

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

        topologyAnalysis,

        surfaceClosure:
          openNeutralMesh
            ? H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
                .surfaceClosure.OPEN
            : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
                .surfaceClosure.CLOSED,

        openNeutralMeshConstructionValid:
          openNeutralMesh,

        admitted:
          false,

        admissionAuthority:
          'WEST_ONLY'
      }
    });

  if (!geometry) {
    issues.push(
      createSouthIssue(
        'SOUTH_GEOMETRY_RECORD_CREATION_FAILED',
        'ERROR',
        'Triangle-mesh geometry record could not be created.'
      )
    );

    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

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

        openNeutralMesh,

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
    issues.push(
      createSouthIssue(
        'SOUTH_PRIMITIVE_RECORD_CREATION_FAILED',
        'ERROR',
        'Triangle-mesh primitive record could not be created.'
      )
    );

    return makeConstructionFailure({
      constructionType:
        'TRIANGLE_MESH',

      issues,

      metadata
    });
  }

  return makeConstructionSuccess({
    constructionType:
      'TRIANGLE_MESH',

    primitiveRecord,

    geometry,

    issues,

    metadata,

    openNeutralMesh
  });
}


/* ==========================================================================
 * 10 · POINT CONSTRUCTION
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


/* ==========================================================================
 * 11 · POINT-SET CONSTRUCTION
 * ========================================================================== */

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


/* ==========================================================================
 * 12 · LINE-SEGMENT CONSTRUCTION
 * ========================================================================== */

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
          'Line-segment construction requires a primitiveId, finite endpoints, and valid transform.'
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
          'Line-segment neutral records could not be created.'
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


/* ==========================================================================
 * 13 · POLYLINE CONSTRUCTION
 * ========================================================================== */

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
          'Polyline neutral records could not be created.'
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


/* ==========================================================================
 * 14 · TRIANGLE CONSTRUCTION
 * ========================================================================== */

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


/* ==========================================================================
 * 15 · BILLBOARD-NEUTRAL CONSTRUCTION
 * ========================================================================== */

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
          'Billboard construction requires a center, positive dimensions, and valid transform.'
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
          'Billboard neutral records could not be created.'
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
 * 16 · RECTANGULAR GRID INDEX CONSTRUCTION
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


/* ==========================================================================
 * 17 · HEIGHT-FIELD MESH CONSTRUCTION
 * ========================================================================== */

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
          'Height-field mesh construction is held because sampling did not complete lawfully.'
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

      openNeutralMeshExpected:
        !wrapRows ||
        !wrapColumns,

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


/* ==========================================================================
 * 18 · PARAMETRIC-SURFACE MESH CONSTRUCTION
 * ========================================================================== */

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
          'Parametric-surface construction is held because sampling did not complete lawfully.'
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
 * 19 · XZ RIBBON SUPPORT
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
    isHEarthPositiveFiniteNumber(
      toleranceContext
        .miterDenominatorTolerance
    )
      ? toleranceContext
          .miterDenominatorTolerance
      : 1e-9;

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


/* ==========================================================================
 * 20 · XZ RIBBON MESH CONSTRUCTION
 * ========================================================================== */

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
          'XZ ribbon construction requires a finite centerline, positive width, and supported join/cap modes.'
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

      supportedJoinModes: [
        'BEVEL',
        'BOUNDED_MITER'
      ],

      supportedCapModes: [
        'NONE',
        'BUTT'
      ],

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
 * 21 · EXTRUSION SUPPORT
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


function createExtrusionSideIndices(
  vertexCount
) {
  if (
    !isHEarthPositiveSafeInteger(
      vertexCount
    ) ||
    vertexCount < 3
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

    indices.push(
      lowerA,
      lowerB,
      upperB,

      lowerA,
      upperB,
      upperA
    );
  }

  return indices;
}


/* ==========================================================================
 * 22 · CONVEX EXTRUSION CONSTRUCTION
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
    !isHEarthMatrix4(transform)
  ) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_INPUT_INVALID',
          'ERROR',
          'Extrusion construction requires a convex profile, direction, positive distance, and valid transform.'
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

  const triangulationPlan =
    triangulateHEarthConvexPolygon(
      profilePoints,
      projectionPlane,
      resolvedToleranceContext
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
      false
  ) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        ...triangulationPlan.issues,

        createSouthIssue(
          'SOUTH_EXTRUSION_PROFILE_ANALYSIS_FAILED',
          'ERROR',
          'Extrusion profile did not produce a lawful East analysis-only triangle-index plan.'
        )
      ],

      metadata
    });
  }

  const extrusionVector =
    resolveExtrusionVector({
      direction,
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
          'Extrusion direction and distance could not produce a finite extrusion vector.'
        )
      ],

      metadata
    });
  }

  const lowerVertices =
    cloneVector3Array(
      profilePoints
    );

  const upperVertices =
    profilePoints.map(
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
          'Extrusion profiles could not be constructed as finite vertices.'
        )
      ],

      metadata
    });
  }

  const vertices = [
    ...lowerVertices,
    ...upperVertices
  ];

  const vertexCount =
    profilePoints.length;

  const indices = [];

  for (
    let offset = 0;
    offset <
      triangulationPlan
        .triangleIndices.length;
    offset += 3
  ) {
    const a =
      triangulationPlan
        .triangleIndices[offset];

    const b =
      triangulationPlan
        .triangleIndices[
          offset + 1
        ];

    const c =
      triangulationPlan
        .triangleIndices[
          offset + 2
        ];

    indices.push(
      c,
      b,
      a,

      a + vertexCount,
      b + vertexCount,
      c + vertexCount
    );
  }

  const sideIndices =
    createExtrusionSideIndices(
      vertexCount
    );

  if (!sideIndices) {
    return makeConstructionFailure({
      constructionType:
        'EXTRUSION_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_EXTRUSION_SIDE_INDICES_INVALID',
          'ERROR',
          'Extrusion side indices could not be constructed.'
        )
      ],

      metadata
    });
  }

  indices.push(
    ...sideIndices
  );

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.EXTRUSION_MESH,

    vertices,

    indices,

    transform,

    semanticRole,

    materialHint,

    metadata: {
      ...metadata,

      distance,

      extrusionVector,

      projectionPlane,

      capTriangulationSource:
        'EAST_ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN',

      eastPrimitiveConstructionConsumed:
        false,

      eastAdmissionConsumed:
        false,

      primitiveConstructionAuthority:
        'SOUTH',

      admissionAuthority:
        'WEST_ONLY',

      admitted:
        false
    },

    source: {
      sourceType:
        'CONVEX_PROFILE_EXTRUSION',

      triangulationPlan
    },

    toleranceContext:
      resolvedToleranceContext
  });
}


/* ==========================================================================
 * 23 · PRISM CONSTRUCTION
 * ========================================================================== */

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

        rotationRadians
      },

      toleranceContext
    });

  if (!result.valid) {
    return result;
  }

  return deepFreeze({
    ...result,

    constructionType:
      'PRISM_MESH',

    primitiveRecord:
      deepFreeze({
        ...result.primitiveRecord,

        primitiveType:
          H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
            .primitiveType.PRISM_MESH
      })
  });
}


/* ==========================================================================
 * 24 · SHED ROOF CONSTRUCTION
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
          'Shed-roof construction requires lawful extents and distinct low/high elevations.'
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

  if (
    !areFiniteVector3Array(vertices)
  ) {
    return makeConstructionFailure({
      constructionType:
        'SHED_ROOF_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_SHED_ROOF_VERTICES_INVALID',
          'ERROR',
          'Shed-roof vertices are nonfinite.'
        )
      ],

      metadata
    });
  }

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

      constructionValidWhenOpen:
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
 * 25 · GABLE ROOF CONSTRUCTION
 * ========================================================================== */

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
          'Gable-roof construction requires lawful extents and ridge elevation above the eaves.'
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

  if (
    !areFiniteVector3Array(vertices)
  ) {
    return makeConstructionFailure({
      constructionType:
        'GABLE_ROOF_MESH',

      issues: [
        createSouthIssue(
          'SOUTH_GABLE_ROOF_VERTICES_INVALID',
          'ERROR',
          'Gable-roof vertices are nonfinite.'
        )
      ],

      metadata
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.GABLE_ROOF_MESH,

    vertices,

    indices,

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

      constructionValidWhenOpen:
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
 * 26 · SPHERE-FAMILY POLE-FAN TOPOLOGY
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
          'Sphere-family pole-fan construction requires lawful sample counts, evaluator, and tolerance context.'
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
            'Sphere-family point evaluator threw while resolving pole candidates.',
            {
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
          'Sphere-family evaluator is longitude-dependent at a pole and cannot use single-vertex pole topology.',
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
              'Sphere-family point evaluator threw while resolving an intermediate ring.',
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
              'Sphere-family evaluator produced a nonfinite intermediate-ring point.',
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

  const firstRingStart =
    1;

  /*
   * South fan:
   * [southPole, current, next]
   *
   * This produces outward-oriented pole triangles for the
   * right-handed X/Y/Z coordinate frame.
   */
  for (
    let longitudeIndex = 0;
    longitudeIndex < longitudeSampleCount;
    longitudeIndex += 1
  ) {
    const nextLongitude =
      (
        longitudeIndex +
        1
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

  /*
   * Intermediate wrapped quad bands.
   */
  for (
    let ringIndex = 0;
    ringIndex <
      intermediateRingCount -
      1;
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
          longitudeIndex +
          1
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
      intermediateRingCount -
      1
    ) *
    longitudeSampleCount;

  /*
   * North fan:
   * [northPole, next, current]
   */
  for (
    let longitudeIndex = 0;
    longitudeIndex < longitudeSampleCount;
    longitudeIndex += 1
  ) {
    const nextLongitude =
      (
        longitudeIndex +
        1
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
 * 27 · ELLIPSOID POINT EVALUATION
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

  const cosineLongitude =
    Math.cos(
      longitudeRadians
    );

  const sineLongitude =
    Math.sin(
      longitudeRadians
    );

  return createHEarthVector3(
    center.x +
      radii.x *
      cosineLatitude *
      cosineLongitude,

    center.y +
      radii.y *
      sineLatitude,

    center.z +
      radii.z *
      cosineLatitude *
      sineLongitude
  );
}


/* ==========================================================================
 * 28 · ELLIPSOID MESH CONSTRUCTION
 * ========================================================================== */

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

  const nominalMinimum =
    createHEarthVector3(
      center.x -
        radii.x,

      center.y -
        radii.y,

      center.z -
        radii.z
    );

  const nominalMaximum =
    createHEarthVector3(
      center.x +
        radii.x,

      center.y +
        radii.y,

      center.z +
        radii.z
    );

  const nominalBounds =
    nominalMinimum &&
    nominalMaximum
      ? createHEarthGeometryBounds([
          nominalMinimum,
          nominalMaximum
        ])
      : null;

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

      equation:
        '((x-cx)/rx)^2 + ((y-cy)/ry)^2 + ((z-cz)/rz)^2 = 1',

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
 * 29 · SUPERELLIPSOID POINT EVALUATION
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

  if (
    !isHEarthFiniteNumber(
      latitudeCosine
    ) ||
    !isHEarthFiniteNumber(
      latitudeSine
    ) ||
    !isHEarthFiniteNumber(
      longitudeCosine
    ) ||
    !isHEarthFiniteNumber(
      longitudeSine
    )
  ) {
    return null;
  }

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


/* ==========================================================================
 * 30 · SUPERELLIPSOID MESH CONSTRUCTION
 * ========================================================================== */

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
          'Superellipsoid construction requires positive radii, positive exponents, and lawful sampling counts.'
        )
      ],

      metadata
    });
  }

  const nominalMinimum =
    createHEarthVector3(
      center.x -
        radii.x,

      center.y -
        radii.y,

      center.z -
        radii.z
    );

  const nominalMaximum =
    createHEarthVector3(
      center.x +
        radii.x,

      center.y +
        radii.y,

      center.z +
        radii.z
    );

  const nominalBounds =
    nominalMinimum &&
    nominalMaximum
      ? createHEarthGeometryBounds([
          nominalMinimum,
          nominalMaximum
        ])
      : null;

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
 * 31 · RADIAL-SHELL MESH CONSTRUCTION
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
          'Radial-shell construction requires a center, evaluator, lawful sample counts, and valid transform.'
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
    let radius;

    try {
      radius =
        radialEvaluator({
          longitudeRadians,
          latitudeRadians,
          longitudeIndex,
          latitudeIndex
        });
    } catch (error) {
      throw error;
    }

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
          'Radial-shell construction could not produce a lawful nondegenerate pole-fan topology.'
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
 * 32 · CONSTRUCTION RECORD VALIDATION
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
        .topologyMode.TRIANGLES &&
    !areValidTriangleIndices(
      record.indices,
      record.vertices.length
    )
  ) {
    return false;
  }

  if (
    record.topologyMode ===
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .topologyMode.LINES &&
    !areValidLineIndices(
      record.indices,
      record.vertices.length
    )
  ) {
    return false;
  }

  return true;
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
 * 33 · SOUTH OWNERSHIP DECLARATION
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
 * 34 · TARGETED CORRECTION DECLARATION
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTIONS =
  deepFreeze({
    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

    architecturalRewrite:
      false,

    publicApiRedesign:
      false,

    southJurisdictionChange:
      false,

    corrections:
      deepFreeze([
        deepFreeze({
          id:
            'SOUTH_CORRECTION_01',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'North and East imports are reduced to symbols consumed by this file; unconfirmed and unused named imports are removed.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_02',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Ellipsoid, superellipsoid, and radial-shell meshes use one south pole vertex, intermediate wrapped rings, one north pole vertex, and nondegenerate pole fans.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_03',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Open neutral meshes are explicitly construction-valid when East reports lawful open-manifold topology, while remaining unadmitted.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_04',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'Every neutral geometry and primitive record preserves admitted false and admissionAuthority WEST_ONLY.'
        }),

        deepFreeze({
          id:
            'SOUTH_CORRECTION_05',

          status:
            'IMPLEMENTED_CANDIDATE',

          description:
            'South remains construction-only and creates no West, facade, provider, geometry-index, compositor, renderer, visual, production, or public-release authority.'
        })
      ]),

    implementationConformance:
      'NOT_YET_EVALUATED'
  });


/* ==========================================================================
 * 35 · REQUIRED SOUTH FIXTURE CORRIDOR
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_REQUIRED_FIXTURES =
  deepFreeze([
    'SOUTH_IMPORTS_NORTH_AND_EAST_ONLY',
    'SOUTH_NAMED_IMPORTS_RESOLVE_AGAINST_ADMITTED_DEPENDENCIES',
    'NEUTRAL_GEOMETRY_RECORD_IS_PROJECTION_NEUTRAL',
    'NEUTRAL_GEOMETRY_RECORD_IS_NOT_ADMITTED',
    'NEUTRAL_GEOMETRY_RECORD_ADMISSION_AUTHORITY_IS_WEST_ONLY',
    'NEUTRAL_PRIMITIVE_RECORD_IS_NOT_ADMITTED',
    'NEUTRAL_PRIMITIVE_RECORD_ADMISSION_AUTHORITY_IS_WEST_ONLY',
    'POINT_CONSTRUCTION_PRESERVES_EXACT_POSITION',
    'LINE_SEGMENT_REJECTS_DEGENERATE_LENGTH',
    'POLYLINE_REJECTS_DEGENERATE_SEGMENT',
    'TRIANGLE_REJECTS_AREA_AT_OR_BELOW_TOLERANCE',
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
    'PRISM_SIDE_COUNT_BELOW_THREE_REJECTED',
    'GABLE_ROOF_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'GABLE_ROOF_OPEN_MESH_REMAINS_UNADMITTED',
    'SHED_ROOF_OPEN_MESH_CONSTRUCTION_REMAINS_VALID',
    'SHED_ROOF_OPEN_MESH_REMAINS_UNADMITTED',
    'ELLIPSOID_POINT_SATISFIES_EXACT_EQUATION_WITHIN_TOLERANCE',
    'ELLIPSOID_PERIODIC_LONGITUDE_EXCLUDES_DUPLICATE_TERMINAL',
    'ELLIPSOID_USES_SINGLE_NORTH_POLE_VERTEX',
    'ELLIPSOID_USES_SINGLE_SOUTH_POLE_VERTEX',
    'ELLIPSOID_POLE_FAN_HAS_NO_DEGENERATE_TRIANGLES',
    'ELLIPSOID_MESH_CONSTRUCTION_VALID',
    'SUPERELLIPSOID_REJECTS_NONPOSITIVE_EXPONENT',
    'SUPERELLIPSOID_USES_NONDEGENERATE_POLE_FAN',
    'SUPERELLIPSOID_MESH_CONSTRUCTION_VALID',
    'RADIAL_SHELL_REJECTS_NONPOSITIVE_RADIUS',
    'RADIAL_SHELL_REJECTS_LONGITUDE_DEPENDENT_POLE_RADIUS',
    'RADIAL_SHELL_USES_NONDEGENERATE_POLE_FAN',
    'RADIAL_SHELL_MESH_CONSTRUCTION_VALID',
    'CONSTRUCTION_SUCCESS_DOES_NOT_EQUAL_WEST_ADMISSION',
    'NO_PROVIDER_AUTHORITY_CREATED',
    'NO_GEOMETRY_INDEX_AUTHORITY_CREATED',
    'NO_COMPOSITOR_AUTHORITY_CREATED',
    'NO_RENDERER_AUTHORITY_CREATED',
    'NO_VISUAL_APPROVAL_CREATED',
    'NO_PRODUCTION_AUTHORITY_CREATED',
    'NO_PUBLIC_RELEASE_AUTHORITY_CREATED'
  ]);


/* ==========================================================================
 * 36 · SOUTH STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryKernelSouthStaticReview() {
  const point =
    createHEarthVector3(
      0,
      0,
      0
    );

  const pointResult =
    constructHEarthPoint({
      primitiveId:
        'STATIC_SELF_REVIEW_POINT',

      position:
        point
    });

  const triangleResult =
    constructHEarthTriangle({
      primitiveId:
        'STATIC_SELF_REVIEW_TRIANGLE',

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

  const ellipsoidResult =
    constructHEarthEllipsoidMesh({
      primitiveId:
        'STATIC_SELF_REVIEW_ELLIPSOID',

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

  const checks =
    deepFreeze([
      deepFreeze({
        id:
          'SOUTH_IMPORTS_NORTH_AND_EAST_ONLY',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.length === 2 &&
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.includes(
              './geometry-kernel.north.js'
            ) &&
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .imports.includes(
              './geometry-kernel.east.js'
            )
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
          'SOUTH_JURISDICTION_DECLARED',

        passed:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_OWNERSHIP
            .jurisdiction ===
            'PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY'
      }),

      deepFreeze({
        id:
          'POINT_RESULT_PROJECTION_NEUTRAL',

        passed:
          pointResult.valid === true &&
          pointResult
            .primitiveRecord
            .projectionNeutral === true
      }),

      deepFreeze({
        id:
          'POINT_RESULT_NOT_ADMITTED',

        passed:
          pointResult.valid === true &&
          pointResult
            .primitiveRecord
            .admitted === false &&
          pointResult
            .primitiveRecord
            .admissionAuthority ===
            'WEST_ONLY'
      }),

      deepFreeze({
        id:
          'OPEN_TRIANGLE_CONSTRUCTION_VALID',

        passed:
          triangleResult.valid === true &&
          triangleResult.openNeutralMesh === true &&
          triangleResult
            .primitiveRecord
            .admitted === false
      }),

      deepFreeze({
        id:
          'ELLIPSOID_POLE_FAN_CONSTRUCTION_VALID',

        passed:
          ellipsoidResult.valid === true &&
          ellipsoidResult
            .primitiveRecord
            .metadata
            .duplicatePoleVertices === false &&
          ellipsoidResult
            .primitiveRecord
            .metadata
            .poleDegenerateTriangles === false
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
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTED_STATIC_SELF_REVIEW_v1',

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

    prohibitedImportScanPerformed:
      false,

    namedImportResolutionScanPerformed:
      false,

    northReadbackCorrespondenceVerified:
      false,

    eastReadbackCorrespondenceVerified:
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
 * 37 · SOUTH RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CORRECTED_IMPLEMENTATION_CANDIDATE_RECEIPT_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,

    correctionScopeId:
      H_EARTH_3D_GEOMETRY_SOUTH_CORRECTION_SCOPE_ID,

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

    jurisdiction:
      'PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY',

    implementationBodyExists:
      true,

    targetedCorrectionsImplemented:
      true,

    northDependencyLocallyAdmitted:
      true,

    eastDependencyLocallyAdmitted:
      true,

    prohibitedImportScanPerformed:
      false,

    namedImportResolutionScanPerformed:
      false,

    testExecutionPerformed:
      false,

    positiveFixtureExecutionPerformed:
      false,

    negativeFixtureExecutionPerformed:
      false,

    localImplementationConformance:
      'NOT_YET_EVALUATED',

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
      'CORRECTED_SOUTH_STATIC_OWNERSHIP_REVIEW_NAMED_IMPORT_RESOLUTION_PROHIBITED_IMPORT_SCAN_AND_EXECUTABLE_FIXTURE_CORRIDOR'
  });


/* ==========================================================================
 * 38 · SOUTH PUBLIC API CANDIDATE MANIFEST
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
      'CORRECTED_IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'NOT_YET_EVALUATED'
  });


/* ==========================================================================
 * 39 · SOUTH CONTRACT
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

    enums:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT,

    implementationConformance:
      'NOT_YET_EVALUATED',

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
 * 40 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryKernelSouthReceipt() {
  return H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_RECEIPT;
}


export function getHEarthGeometryKernelSouthContract() {
  return H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT;
}


export default H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT;
