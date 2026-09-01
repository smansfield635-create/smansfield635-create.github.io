/**
 * /showroom/globe/h-earth/render/geometry-kernel.js
 * COMPLETE FACADE FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1
 *
 * DEPENDS ON:
 * H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1
 * H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1
 *
 * STATUS:
 * PUBLIC_FACADE_IMPLEMENTATION_CANDIDATE
 *
 * PURPOSE:
 * STABLE PUBLIC FACADE OVER NORTH EAST SOUTH AND WEST.
 *
 * IMPORT LAW:
 * THIS FILE MAY IMPORT ONLY:
 * - ./geometry-kernel.north.js
 * - ./geometry-kernel.east.js
 * - ./geometry-kernel.south.js
 * - ./geometry-kernel.west.js
 *
 * THIS FILE DOES NOT:
 * - invent new mathematics
 * - invent new descriptor analysis
 * - invent new topology classification
 * - invent new neutral primitive construction
 * - invent new admission logic
 * - construct providers
 * - aggregate provider outputs
 * - own geometry-index authority
 * - own capacity/environment/compositor/renderer authority
 * - own visual approval
 * - own production authority
 * - own public-release authority
 *
 * IMPLEMENTATION CONFORMANCE:
 * HOLD_PENDING_EXECUTABLE_CORRIDOR.
 *
 * PUBLIC SYMBOL FREEZE:
 * FALSE.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
  H_EARTH_3D_GEOMETRY_NORTH_ENUMS,
  H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthFiniteNumber,
  isHEarthPositiveFiniteNumber,
  isHEarthNonNegativeSafeInteger,
  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  createHEarthVector3,
  isHEarthVector3,
  approximatelyEqualHEarthVector3,

  createHEarthIdentityMatrix4,
  isHEarthMatrix4,

  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext,
  approximatelyEqualHEarthNumber,

  getHEarthGeometryKernelNorthReceipt,
  getHEarthGeometryKernelNorthContract,
  getHEarthGeometryKernelNorthStaticReview
} from './geometry-kernel.north.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT,
  H_EARTH_3D_GEOMETRY_EAST_ENUMS,

  sampleHEarthParametricSurface,
  sampleHEarthHeightField,
  evaluateHEarthGridSampleIntegrity,

  evaluateHEarthTriangleNormal,
  calculateHEarthFaceNormals,
  calculateHEarthVertexNormals,
  evaluateHEarthIndexedMesh,

  triangulateHEarthConvexPolygon,

  getHEarthGeometryKernelEastReceipt,
  getHEarthGeometryKernelEastContract,
  getHEarthGeometryKernelEastStaticReview
} from './geometry-kernel.east.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,

  createHEarthNeutralGeometryRecord,
  createHEarthNeutralPrimitiveRecord,

  constructHEarthTriangleMesh,
  constructHEarthPoint,
  constructHEarthPointSet,
  constructHEarthLineSegment,
  constructHEarthPolyline,
  constructHEarthTriangle,
  constructHEarthBillboard,
  constructHEarthHeightFieldMesh,
  constructHEarthParametricSurfaceMesh,
  constructHEarthXZRibbonMesh,
  constructHEarthConvexExtrusionMesh,
  constructHEarthPrismMesh,
  constructHEarthShedRoofMesh,
  constructHEarthGableRoofMesh,
  evaluateHEarthEllipsoidPoint,
  constructHEarthEllipsoidMesh,
  evaluateHEarthSuperellipsoidPoint,
  constructHEarthSuperellipsoidMesh,
  constructHEarthRadialShellMesh,

  isHEarthNeutralGeometryRecord,
  isHEarthNeutralPrimitiveRecord,

  getHEarthGeometryKernelSouthReceipt,
  getHEarthGeometryKernelSouthContract,
  getHEarthGeometryKernelSouthStaticReview
} from './geometry-kernel.south.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT,
  H_EARTH_3D_GEOMETRY_WEST_ENUMS,

  createHEarthAdmittedGeometryRecord,
  createHEarthAdmittedPrimitiveRecord,
  createHEarthAggregateFrameAdmissionRecord,

  isHEarthAdmittedGeometryRecord,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,

  evaluateHEarthPrimitiveAdmission,
  admitHEarthPrimitiveRecord,
  evaluateHEarthPrimitiveBatchAdmission,
  admitHEarthPrimitiveBatch,

  getHEarthGeometryKernelWestReceipt,
  getHEarthGeometryKernelWestContract,
  getHEarthGeometryKernelWestStaticReview
} from './geometry-kernel.west.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION = 1;

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE =
  '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/geometry-kernel.js';

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

export const H_EARTH_3D_GEOMETRY_PUBLIC_FACADE_STEP_ID =
  'STEP_034O_4F_GEOMETRY_KERNEL_PUBLIC_FACADE';


/* ==========================================================================
 * 02 · INTERNAL STRUCTURE
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


function flattenValues(values) {
  const flattened = [];

  for (const value of ensureArray(values)) {
    if (Array.isArray(value)) {
      flattened.push(
        ...flattenValues(value)
      );
    } else {
      flattened.push(value);
    }
  }

  return flattened;
}


function getDuplicateStrings(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of ensureArray(values)) {
    if (typeof value !== 'string') {
      continue;
    }

    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return Array.from(duplicates).sort();
}


function createFacadeIssue(
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
        'geometry-kernel.js'
    }
  );
}


function getDirectionalKernelReceipts() {
  return deepFreeze({
    north:
      getHEarthGeometryKernelNorthReceipt(),
    east:
      getHEarthGeometryKernelEastReceipt(),
    south:
      getHEarthGeometryKernelSouthReceipt(),
    west:
      getHEarthGeometryKernelWestReceipt()
  });
}


function getDirectionalKernelContracts() {
  return deepFreeze({
    north:
      getHEarthGeometryKernelNorthContract(),
    east:
      getHEarthGeometryKernelEastContract(),
    south:
      getHEarthGeometryKernelSouthContract(),
    west:
      getHEarthGeometryKernelWestContract()
  });
}


function getDirectionalKernelStaticReviews() {
  return deepFreeze({
    north:
      getHEarthGeometryKernelNorthStaticReview(),
    east:
      getHEarthGeometryKernelEastStaticReview(),
    south:
      getHEarthGeometryKernelSouthStaticReview(),
    west:
      getHEarthGeometryKernelWestStaticReview()
  });
}


function getFacadeSymbolList() {
  return flattenValues(
    Object.values(
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SYMBOL_CATEGORIES
    )
  ).filter(
    (value) =>
      typeof value === 'string'
  );
}


/* ==========================================================================
 * 03 · DIRECTIONAL CHAIN READOUT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_DIRECTIONAL_DEPENDENCY =
  deepFreeze({
    northContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
    northSchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
    northSourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SOURCE_FILE,

    eastContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
    eastSchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
    eastSourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_SOURCE_FILE,

    southContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
    southSchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,
    southSourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SOURCE_FILE,

    westContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    westSchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION,
    westSourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_WEST_SOURCE_FILE,

    dependencyOrder:
      deepFreeze([
        'NORTH',
        'EAST',
        'SOUTH',
        'WEST',
        'PUBLIC_FACADE'
      ]),

    dependencyDirection:
      'NORTH_TO_EAST_TO_SOUTH_TO_WEST_TO_FACADE',

    sourceChainStatus:
      'NORTH_EAST_SOUTH_WEST_DIRECTIONAL_SOURCE_CHAIN_AVAILABLE_TO_FACADE',

    nextDownstreamTarget:
      null,

    downstreamSequenceAuthority:
      false,

    providerAuthority:
      false,

    geometryIndexAuthority:
      false,

    kernelReopenRequired:
      false
  });


export function getHEarthGeometryKernelFacadeDirectionalReadout() {
  const receipts =
    getDirectionalKernelReceipts();

  const contracts =
    getDirectionalKernelContracts();

  const staticReviews =
    getDirectionalKernelStaticReviews();

  return deepFreeze({
    dependency:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_DIRECTIONAL_DEPENDENCY,

    receipts,

    contracts,

    staticReviews,

    crossModuleRead:
      'NORTH_EAST_SOUTH_WEST_DIRECTIONAL_SOURCE_CHAIN_AVAILABLE_TO_FACADE',

    downstreamSequenceAuthority:
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
}


/* ==========================================================================
 * 04 · OWNERSHIP
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'STABLE_PUBLIC_DIRECTIONAL_KERNEL_EXPORT_SURFACE_ONLY',

    owns:
      deepFreeze([
        'STABLE_PUBLIC_GEOMETRY_KERNEL_EXPORT_SURFACE',
        'DIRECTIONAL_CONTRACT_AGGREGATION',
        'DIRECTIONAL_SCHEMA_STATUS_READOUT',
        'PUBLIC_SYMBOL_MANIFEST',
        'SAFE_REEXPORT_DISCIPLINE',
        'DOWNSTREAM_IMPORT_BOUNDARY',
        'KERNEL_FAMILY_RECEIPT',
        'KERNEL_FAMILY_STATIC_REVIEW',
        'CLAIM_CEILING_PRESERVATION'
      ]),

    mustNotOwn:
      deepFreeze([
        'NEW_SCALAR_VECTOR_MATRIX_MATHEMATICS',
        'NEW_DESCRIPTOR_ANALYSIS',
        'NEW_TOPOLOGY_CLASSIFICATION',
        'NEW_NEUTRAL_PRIMITIVE_CONSTRUCTION',
        'NEW_VALIDATION_OR_ADMISSION_LOGIC',
        'PROVIDER_CONSTRUCTION',
        'PROVIDER_ADMISSION',
        'AGGREGATE_PROVIDER_OUTPUTS',
        'GEOMETRY_INDEX_AUTHORITY',
        'CAPACITY_BUDGETING',
        'ENVIRONMENT_INTERPRETATION',
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
        './geometry-kernel.south.js',
        './geometry-kernel.west.js'
      ]),

    prohibitedImports:
      deepFreeze([
        './geometry-ground.js',
        './geometry-shoreline.js',
        './geometry-water.js',
        './geometry-tide-pools.js',
        './geometry-stones.js',
        './geometry-rocks.js',
        './geometry-islets.js',
        './geometry-bluff.js',
        './geometry-manor.js',
        './geometry-atmosphere.js',
        './geometry-interaction.js',
        './geometry-index.js',
        '../capacity.js',
        '../environment.js',
        '../compositor.js',
        '../renderer.js',
        '../controller.js',
        '../index.js',
        '../diagnostic/index.js'
      ])
  });


/* ==========================================================================
 * 05 · SYMBOL MANIFEST
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SYMBOL_CATEGORIES =
  deepFreeze({
    contractAndSchema: deepFreeze([
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE',
      'H_EARTH_3D_GEOMETRY_PUBLIC_FACADE_STEP_ID',
      'H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID',
      'H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID',
      'H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID',
      'H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_DIRECTIONAL_DEPENDENCY',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP'
    ]),

    directionalContracts: deepFreeze([
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT',
      'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT',
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT',
      'H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID',
      'H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION',
      'H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT'
    ]),

    directionalReadout: deepFreeze([
      'getHEarthGeometryKernelFacadeDirectionalReadout',
      'getHEarthGeometryKernelNorthReceipt',
      'getHEarthGeometryKernelNorthContract',
      'getHEarthGeometryKernelNorthStaticReview',
      'getHEarthGeometryKernelEastReceipt',
      'getHEarthGeometryKernelEastContract',
      'getHEarthGeometryKernelEastStaticReview',
      'getHEarthGeometryKernelSouthReceipt',
      'getHEarthGeometryKernelSouthContract',
      'getHEarthGeometryKernelSouthStaticReview',
      'getHEarthGeometryKernelWestReceipt',
      'getHEarthGeometryKernelWestContract',
      'getHEarthGeometryKernelWestStaticReview'
    ]),

    enumsAndStandards: deepFreeze([
      'H_EARTH_3D_GEOMETRY_COORDINATE_FRAME',
      'H_EARTH_3D_GEOMETRY_NORTH_ENUMS',
      'H_EARTH_3D_GEOMETRY_EAST_ENUMS',
      'H_EARTH_3D_GEOMETRY_SOUTH_ENUMS',
      'H_EARTH_3D_GEOMETRY_WEST_ENUMS',
      'H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE'
    ]),

    foundationalMath: deepFreeze([
      'createHEarthGeometryIssue',
      'sortHEarthGeometryIssues',
      'hasHEarthBlockingIssues',
      'isHEarthFiniteNumber',
      'isHEarthPositiveFiniteNumber',
      'isHEarthNonNegativeSafeInteger',
      'isHEarthPositiveSafeInteger',
      'isHEarthNonEmptyString',
      'createHEarthVector3',
      'isHEarthVector3',
      'approximatelyEqualHEarthVector3',
      'createHEarthIdentityMatrix4',
      'isHEarthMatrix4',
      'isHEarthAABB3D',
      'mergeHEarthGeometryBounds',
      'deriveHEarthGeometryToleranceContext',
      'isHEarthGeometryToleranceContext',
      'approximatelyEqualHEarthNumber'
    ]),

    analysis: deepFreeze([
      'sampleHEarthParametricSurface',
      'sampleHEarthHeightField',
      'evaluateHEarthGridSampleIntegrity',
      'evaluateHEarthTriangleNormal',
      'calculateHEarthFaceNormals',
      'calculateHEarthVertexNormals',
      'evaluateHEarthIndexedMesh',
      'triangulateHEarthConvexPolygon'
    ]),

    construction: deepFreeze([
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
      'isHEarthNeutralPrimitiveRecord'
    ]),

    admission: deepFreeze([
      'createHEarthAdmittedGeometryRecord',
      'createHEarthAdmittedPrimitiveRecord',
      'createHEarthAggregateFrameAdmissionRecord',
      'isHEarthAdmittedGeometryRecord',
      'isHEarthAdmittedPrimitiveRecord',
      'isHEarthAggregateFrameAdmissionRecord',
      'evaluateHEarthPrimitiveAdmission',
      'admitHEarthPrimitiveRecord',
      'evaluateHEarthPrimitiveBatchAdmission',
      'admitHEarthPrimitiveBatch'
    ]),

    facadeGovernance: deepFreeze([
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_REQUIRED_FIXTURES',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PRE_BACKING_GATE',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SYMBOL_CATEGORIES',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PUBLIC_API_CANDIDATE',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT',
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT',
      'getHEarthGeometryKernelPublicFacadeStaticReview',
      'getHEarthGeometryKernelPublicFacadeReceipt',
      'getHEarthGeometryKernelPublicFacadeContract'
    ])
  });


/* ==========================================================================
 * 06 · REQUIRED FIXTURES
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_REQUIRED_FIXTURES =
  deepFreeze([
    'FACADE_IMPORTS_EXACTLY_FOUR_DIRECTIONAL_FILES',
    'FACADE_IMPORTS_NO_PROVIDERS',
    'FACADE_IMPORTS_NO_GEOMETRY_INDEX',
    'FACADE_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_OR_INDEX',
    'FACADE_IMPORTS_NO_CAPACITY_OR_ENVIRONMENT_FILES',
    'NORTH_CONTRACT_MATCHES',
    'EAST_CONTRACT_MATCHES',
    'SOUTH_CONTRACT_MATCHES',
    'WEST_CONTRACT_MATCHES',
    'SCHEMA_MINIMUMS_SATISFIED',
    'ALL_DECLARED_PUBLIC_SYMBOLS_RESOLVE',
    'NO_DUPLICATE_PUBLIC_SYMBOL_IDS',
    'NO_MISSING_MANIFEST_SYMBOLS',
    'DIRECTIONAL_OWNERSHIP_MAP_PRESERVED',
    'FACADE_RECEIPT_REPORTS_NO_PROVIDER_AUTHORITY',
    'FACADE_RECEIPT_REPORTS_NO_GEOMETRY_INDEX_AUTHORITY',
    'FACADE_RECEIPT_REPORTS_NO_COMPOSITOR_INTEGRATION_AUTHORITY',
    'FACADE_RECEIPT_REPORTS_NO_RENDERER_INTEGRATION_AUTHORITY',
    'FACADE_RECEIPT_REPORTS_NO_VISUAL_APPROVAL',
    'FACADE_RECEIPT_REPORTS_NO_PRODUCTION_OR_PUBLIC_RELEASE_AUTHORITY'
  ]);


/* ==========================================================================
 * 07 · PRE-BACKING GATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PRE_BACKING_GATE =
  deepFreeze({
    gateId:
      'GEOMETRY_KERNEL_PUBLIC_FACADE_PRE_BACKING_GATE_v1',

    requiredSequence:
      deepFreeze([
        'NODE_SYNTAX_CHECK',
        'NAMED_IMPORT_RESOLUTION',
        'UNUSED_IMPORT_SCAN',
        'PROHIBITED_IMPORT_SCAN',
        'PUBLIC_SYMBOL_COLLISION_SCAN',
        'STATIC_SELF_REVIEW',
        'DIRECTIONAL_CONTRACT_RECHECK',
        'DIRECTIONAL_SCHEMA_RECHECK',
        'EXPORT_MANIFEST_RECHECK',
        'AUTHORITY_HOLD_RECHECK',
        'FIXTURES_FAILED_ZERO'
      ]),

    nodeSyntaxCheckCommand:
      'node --check geometry-kernel.js',

    allowedImports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js',
        './geometry-kernel.south.js',
        './geometry-kernel.west.js'
      ]),

    requiredFixtureCount:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_REQUIRED_FIXTURES
        .length,

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    publicSymbolCollisionScanPerformed:
      false,
    staticSelfReviewPerformed:
      false,
    directionalContractRecheckPerformed:
      false,
    directionalSchemaRecheckPerformed:
      false,
    exportManifestRecheckPerformed:
      false,
    authorityHoldRecheckPerformed:
      false,
    fixturesFailed:
      null,
    gatePassed:
      false
  });


/* ==========================================================================
 * 08 · PUBLIC API CANDIDATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-kernel.js',

    classification:
      'PUBLIC_FACADE_CANDIDATE',

    symbols:
      deepFreeze(
        getFacadeSymbolList()
      ),

    duplicateSymbols:
      deepFreeze(
        getDuplicateStrings(
          getFacadeSymbolList()
        )
      ),

    collisionStatus:
      getDuplicateStrings(
        getFacadeSymbolList()
      ).length === 0
        ? 'NO_DUPLICATE_PUBLIC_SYMBOLS_DETECTED'
        : 'DUPLICATE_PUBLIC_SYMBOLS_DETECTED',

    implementationStatus:
      'PUBLIC_FACADE_IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 09 · STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryKernelPublicFacadeStaticReview() {
  const receipts =
    getDirectionalKernelReceipts();

  const contracts =
    getDirectionalKernelContracts();

  const staticReviews =
    getDirectionalKernelStaticReviews();

  const manifestSymbols =
    getFacadeSymbolList();

  const duplicateSymbols =
    getDuplicateStrings(
      manifestSymbols
    );

  const checks = deepFreeze([
    deepFreeze({
      id:
        'FACADE_IMPORTS_EXACTLY_FOUR_DIRECTIONAL_FILES',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .imports.length === 4
    }),

    deepFreeze({
      id:
        'FACADE_IMPORTS_NO_PROVIDERS',
      passed:
        !H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .imports.some(
            (value) =>
              typeof value === 'string' &&
              value.startsWith('./geometry-') &&
              value !== './geometry-kernel.north.js' &&
              value !== './geometry-kernel.east.js' &&
              value !== './geometry-kernel.south.js' &&
              value !== './geometry-kernel.west.js'
          )
    }),

    deepFreeze({
      id:
        'FACADE_IMPORTS_NO_GEOMETRY_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .imports.includes('./geometry-index.js')
    }),

    deepFreeze({
      id:
        'FACADE_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_OR_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .imports.some(
            (value) =>
              value === '../compositor.js' ||
              value === '../renderer.js' ||
              value === '../controller.js' ||
              value === '../index.js'
          )
    }),

    deepFreeze({
      id:
        'FACADE_IMPORTS_NO_CAPACITY_OR_ENVIRONMENT_FILES',
      passed:
        !H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .imports.some(
            (value) =>
              value === '../capacity.js' ||
              value === '../environment.js'
          )
    }),

    deepFreeze({
      id:
        'NORTH_CONTRACT_MATCHES',
      passed:
        contracts.north?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID &&
        receipts.north?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID
    }),

    deepFreeze({
      id:
        'EAST_CONTRACT_MATCHES',
      passed:
        contracts.east?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID &&
        receipts.east?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID
    }),

    deepFreeze({
      id:
        'SOUTH_CONTRACT_MATCHES',
      passed:
        contracts.south?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID &&
        receipts.south?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID
    }),

    deepFreeze({
      id:
        'WEST_CONTRACT_MATCHES',
      passed:
        contracts.west?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID &&
        receipts.west?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
    }),

    deepFreeze({
      id:
        'SCHEMA_MINIMUMS_SATISFIED',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION >= 3 &&
        H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION >= 2 &&
        H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION >= 2 &&
        H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION >= 1
    }),

    deepFreeze({
      id:
        'ALL_MANIFEST_SYMBOL_IDS_ARE_NONEMPTY',
      passed:
        manifestSymbols.length > 0 &&
        manifestSymbols.every(
          isHEarthNonEmptyString
        )
    }),

    deepFreeze({
      id:
        'NO_DUPLICATE_PUBLIC_SYMBOL_IDS',
      passed:
        duplicateSymbols.length === 0
    }),

    deepFreeze({
      id:
        'DIRECTIONAL_OWNERSHIP_MAP_PRESERVED',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .mustNotOwn.includes('NEW_SCALAR_VECTOR_MATRIX_MATHEMATICS') &&
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .mustNotOwn.includes('NEW_DESCRIPTOR_ANALYSIS') &&
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .mustNotOwn.includes('NEW_NEUTRAL_PRIMITIVE_CONSTRUCTION') &&
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP
          .mustNotOwn.includes('NEW_VALIDATION_OR_ADMISSION_LOGIC')
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_PROVIDER_AUTHORITY',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .providerAuthority === false
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_GEOMETRY_INDEX_AUTHORITY',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .geometryIndexAuthority === false
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_COMPOSITOR_INTEGRATION_AUTHORITY',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .compositorIntegrationAuthority === false
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_RENDERER_INTEGRATION_AUTHORITY',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .rendererIntegrationAuthority === false
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_VISUAL_APPROVAL',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .visualApproval === false
    }),

    deepFreeze({
      id:
        'FACADE_RECEIPT_REPORTS_NO_PRODUCTION_OR_PUBLIC_RELEASE_AUTHORITY',
      passed:
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .productionAuthority === false &&
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT
          .publicReleaseAuthority === false
    }),

    deepFreeze({
      id:
        'ALL_DIRECTIONAL_STATIC_REVIEWS_PASS',
      passed:
        staticReviews.north?.passed === true &&
        staticReviews.east?.passed === true &&
        staticReviews.south?.passed === true &&
        staticReviews.west?.passed === true
    })
  ]);

  const passed =
    checks.every(
      (check) =>
        check.passed === true
    );

  return deepFreeze({
    reviewId:
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_STATIC_SELF_REVIEW_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,

    stepId:
      H_EARTH_3D_GEOMETRY_PUBLIC_FACADE_STEP_ID,

    passed,

    status:
      passed
        ? 'STATIC_SELF_REVIEW_PASS_CANDIDATE'
        : 'STATIC_SELF_REVIEW_HOLD',

    duplicateSymbols:
      deepFreeze(duplicateSymbols),

    manifestSymbolCount:
      manifestSymbols.length,

    checks,

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    publicSymbolCollisionScanPerformed:
      false,
    directionalContractRecheckPerformed:
      false,
    directionalSchemaRecheckPerformed:
      false,
    exportManifestRecheckPerformed:
      false,
    authorityHoldRecheckPerformed:
      false,

    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });
}


/* ==========================================================================
 * 10 · RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_IMPLEMENTATION_CANDIDATE_RECEIPT_v1',

    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,

    stepId:
      H_EARTH_3D_GEOMETRY_PUBLIC_FACADE_STEP_ID,

    importsNorth:
      true,
    importsEast:
      true,
    importsSouth:
      true,
    importsWest:
      true,

    importsProviders:
      false,
    importsGeometryIndex:
      false,
    importsCapacity:
      false,
    importsEnvironment:
      false,
    importsCompositor:
      false,
    importsRenderer:
      false,
    importsController:
      false,
    importsIndex:
      false,

    implementationBodyExists:
      true,

    publicFacadeRole:
      'STABLE_PUBLIC_FACADE_OVER_NORTH_EAST_SOUTH_WEST',

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    publicSymbolCollisionScanPerformed:
      false,
    staticSelfReviewPerformed:
      false,
    directionalContractRecheckPerformed:
      false,
    directionalSchemaRecheckPerformed:
      false,
    exportManifestRecheckPerformed:
      false,
    authorityHoldRecheckPerformed:
      false,

    testExecutionPerformed:
      false,

    publicSymbolFreeze:
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

    nextRequired:
      'NODE_SYNTAX_CHECK_THEN_NAMED_IMPORT_RESOLUTION_THEN_UNUSED_IMPORT_SCAN_THEN_PROHIBITED_IMPORT_SCAN_THEN_PUBLIC_SYMBOL_COLLISION_SCAN_THEN_STATIC_SELF_REVIEW_THEN_DIRECTIONAL_CONTRACT_RECHECK_THEN_DIRECTIONAL_SCHEMA_RECHECK_THEN_EXPORT_MANIFEST_RECHECK_THEN_AUTHORITY_HOLD_RECHECK_THEN_FIXTURES_FAILED_ZERO'
  });


/* ==========================================================================
 * 11 · CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,

    stepId:
      H_EARTH_3D_GEOMETRY_PUBLIC_FACADE_STEP_ID,

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

    role:
      'STABLE_PUBLIC_FACADE_OVER_NORTH_EAST_SOUTH_WEST',

    dependency:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_DIRECTIONAL_DEPENDENCY,

    ownership:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_OWNERSHIP,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_REQUIRED_FIXTURES,

    preBackingGate:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PRE_BACKING_GATE,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT,

    directionalContracts:
      deepFreeze({
        north:
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
        east:
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
        south:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
        west:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
      }),

    directionalSchemas:
      deepFreeze({
        north:
          H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
        east:
          H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
        south:
          H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,
        west:
          H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION
      }),

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

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
 * 12 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryKernelPublicFacadeReceipt() {
  return H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_RECEIPT;
}


export function getHEarthGeometryKernelPublicFacadeContract() {
  return H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT;
}


/* ==========================================================================
 * 13 · EXPLICIT PUBLIC EXPORT SURFACE
 * ========================================================================== */

export {
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT,

  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT,

  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT,

  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT,

  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
  H_EARTH_3D_GEOMETRY_NORTH_ENUMS,
  H_EARTH_3D_GEOMETRY_EAST_ENUMS,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  H_EARTH_3D_GEOMETRY_WEST_ENUMS,
  H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthFiniteNumber,
  isHEarthPositiveFiniteNumber,
  isHEarthNonNegativeSafeInteger,
  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  createHEarthVector3,
  isHEarthVector3,
  approximatelyEqualHEarthVector3,

  createHEarthIdentityMatrix4,
  isHEarthMatrix4,

  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext,
  approximatelyEqualHEarthNumber,

  sampleHEarthParametricSurface,
  sampleHEarthHeightField,
  evaluateHEarthGridSampleIntegrity,
  evaluateHEarthTriangleNormal,
  calculateHEarthFaceNormals,
  calculateHEarthVertexNormals,
  evaluateHEarthIndexedMesh,
  triangulateHEarthConvexPolygon,

  createHEarthNeutralGeometryRecord,
  createHEarthNeutralPrimitiveRecord,
  constructHEarthTriangleMesh,
  constructHEarthPoint,
  constructHEarthPointSet,
  constructHEarthLineSegment,
  constructHEarthPolyline,
  constructHEarthTriangle,
  constructHEarthBillboard,
  constructHEarthHeightFieldMesh,
  constructHEarthParametricSurfaceMesh,
  constructHEarthXZRibbonMesh,
  constructHEarthConvexExtrusionMesh,
  constructHEarthPrismMesh,
  constructHEarthShedRoofMesh,
  constructHEarthGableRoofMesh,
  evaluateHEarthEllipsoidPoint,
  constructHEarthEllipsoidMesh,
  evaluateHEarthSuperellipsoidPoint,
  constructHEarthSuperellipsoidMesh,
  constructHEarthRadialShellMesh,
  isHEarthNeutralGeometryRecord,
  isHEarthNeutralPrimitiveRecord,

  createHEarthAdmittedGeometryRecord,
  createHEarthAdmittedPrimitiveRecord,
  createHEarthAggregateFrameAdmissionRecord,
  isHEarthAdmittedGeometryRecord,
  isHEarthAdmittedPrimitiveRecord,
  isHEarthAggregateFrameAdmissionRecord,
  evaluateHEarthPrimitiveAdmission,
  admitHEarthPrimitiveRecord,
  evaluateHEarthPrimitiveBatchAdmission,
  admitHEarthPrimitiveBatch,

  getHEarthGeometryKernelNorthReceipt,
  getHEarthGeometryKernelNorthContract,
  getHEarthGeometryKernelNorthStaticReview,
  getHEarthGeometryKernelEastReceipt,
  getHEarthGeometryKernelEastContract,
  getHEarthGeometryKernelEastStaticReview,
  getHEarthGeometryKernelSouthReceipt,
  getHEarthGeometryKernelSouthContract,
  getHEarthGeometryKernelSouthStaticReview,
  getHEarthGeometryKernelWestReceipt,
  getHEarthGeometryKernelWestContract,
  getHEarthGeometryKernelWestStaticReview
};


export default H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT;
