/**
 * /h-earth-3d/h-earth.matrix.js
 * COMPLETE RENEWED FILE
 * H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1
 *
 * Based on Drive baseline:
 * H-Earth Scratch Rebuild · Step 013 · Room 6
 * File: h-earth.matrix.js
 * Lane: Wiring / Harness / Review
 * Status: Static matrix coordination map only.
 *
 * Renewal room:
 * ROOM 1 / SOURCE CANON
 *
 * Purpose:
 * Renew the H-Earth source matrix file from a static coordination map into a
 * source-canon descriptor authority file that preserves the original skeleton
 * exports while adding the missing scene-scoped lattice authority required
 * before Room 2 may renew /h-earth-3d/cells/ground-cell-001.js.
 *
 * Diagnostic basis:
 * ACTIVE_CELL_AND_SCENE_IDENTITY_EXPOSED_WITH_LATTICE_HINTS_PRESENT_BUT_NO_FORMAL_16X16_OR_ADDRESS_FIELD_RECEIPT
 *
 * Renewal correction:
 * The existing source matrix already preserved H-Earth identity, active cell,
 * scene identity, first action, first readout, first receipt, harness receipt,
 * matrix separation, and no-claim boundaries.
 *
 * This renewal adds descriptor-only source authority for a 16x16 / 256-address
 * scene-scoped lattice basis without enumerating the full address map and
 * without activating lattice, movement, traversal, gameplay, rendering,
 * validation, production, or Mirror Manor route-canon naming.
 *
 * Report principle:
 * Receipts prove.
 * Reports diagnose.
 * Scene remains primary.
 *
 * Matrix principle:
 * The scene scopes the lattice.
 * The lattice makes the scene addressable.
 *
 * Boundary:
 * This file defines source authority only.
 * This file does not define cell internals.
 * This file does not define zone bands.
 * This file does not define environment objects.
 * This file does not define material channels.
 * This file does not define inspection anchor lists.
 * This file does not define action behavior.
 * This file does not define readout payloads.
 * This file does not define route rendering.
 * This file does not mutate GitHub.
 * This file does not activate runtime.
 */

export const H_EARTH_MATRIX_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  renewedFrom: Object.freeze({
    step: 'STEP_013_ROOM_6_DRIVE_NATIVE_SOURCE_TEXT',
    priorStatus: 'Static matrix coordination map only.',
    priorFileRole: 'Wiring / Harness / Review',
    preservedBaselineExports: Object.freeze([
      'H_EARTH_MATRIX_SEPARATION',
      'H_EARTH_ACTIVE_GROUND_VIEW',
      'H_EARTH_MATRIX'
    ])
  }),

  file: '/h-earth-3d/h-earth.matrix.js',
  sourceRoot: '/h-earth-3d/',
  room: 'ROOM_1_SOURCE_CANON',
  chamber: 'DGB_H_EARTH_SCRATCH_REBUILD',

  fileClass: 'SOURCE_MATRIX_AUTHORITY_DESCRIPTOR_ONLY',
  matrixName: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  controllingDiagnosis:
    'ACTIVE_CELL_AND_SCENE_IDENTITY_EXPOSED_WITH_LATTICE_HINTS_PRESENT_BUT_NO_FORMAL_16X16_OR_ADDRESS_FIELD_RECEIPT',

  reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',
  matrixPrinciple:
    'The scene scopes the lattice. The lattice makes the scene addressable.',

  renewalPurpose:
    'Define source-canon descriptor-only scene-scoped lattice authority before downstream cell, environment, action, readout, receipt, and route exposure renewal.',

  renewalScope: Object.freeze({
    baselineMatrixSeparationPreserved: true,
    baselineActiveGroundViewPreserved: true,
    baselineMatrixAggregatePreserved: true,
    sourceMatrixAuthorityDefined: true,
    sceneScopedLatticeAuthorityDefined: true,
    descriptorAddressFieldDefined: true,
    descriptorOnly16x16AddressFieldAuthorized: true,
    activeCellSourceScopeDefined: true,
    downstreamRoomInterfacesDefined: true,
    room2UnblockReceiptAdded: true,
    compactMatrixReceiptAdded: true,

    full256AddressEnumerationAdded: false,
    cellInternalModelAdded: false,
    zoneBandMappingAdded: false,
    objectCompressionMappingAdded: false,
    materialChannelMappingAdded: false,
    inspectionAnchorListAdded: false,
    actionBehaviorAdded: false,
    readoutPayloadAdded: false,
    receiptAggregationAdded: false,
    routeExposureAdded: false,
    rendererBehaviorChanged: false,
    compositorBehaviorChanged: false,
    controllerBehaviorChanged: false,
    environmentMutation: false
  })
});

/**
 * Baseline export preserved.
 * Original file established H-Earth / Hearth / Audralia separation.
 */
export const H_EARTH_MATRIX_SEPARATION = Object.freeze({
  hEarth: Object.freeze({
    name: 'H-Earth',
    role: 'Ground-View Matrix',
    authority: 'bounded local ground-view inspection only'
  }),

  hearth: Object.freeze({
    name: 'Hearth',
    role: 'support/control context only',
    mayMergeWithHEarth: false
  }),

  audralia: Object.freeze({
    name: 'Audralia',
    role: 'planetary-world context only',
    mayBecomeActiveHEarthCell: false
  }),

  matrixCollapse: false
});

/**
 * Baseline export preserved and extended only with descriptor/source ownership clarity.
 */
export const H_EARTH_ACTIVE_GROUND_VIEW = Object.freeze({
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',
  scope: 'local ground-view inspection only',

  descriptorOnly: true,
  sourceCellAuthorityOwner: 'ROOM_1_SOURCE_CANON',
  cellDetailOwner: 'ROOM_2_CELL_STRUCTURE',
  environmentDescriptorOwner: 'ROOM_3_ENVIRONMENT',

  mirrorManorStatus: 'STRATEGICALLY_IMPLIED_NOT_ROUTE_CANON_NAMED',
  mirrorManorStrategicallyImplied: true,
  mirrorManorRouteCanonNamed: false
});

export const H_EARTH_SOURCE_SCENE_IDENTITY = Object.freeze({
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  activeCell: H_EARTH_ACTIVE_GROUND_VIEW.activeCell,
  sceneIdentity: H_EARTH_ACTIVE_GROUND_VIEW.sceneIdentity,

  sceneDomain: 'shoreline-manor',
  sceneDomainAuthority: 'SOURCE_SCENE_DOMAIN_DESCRIPTOR_ONLY',

  firstAction: H_EARTH_ACTIVE_GROUND_VIEW.firstAction,
  firstReadout: H_EARTH_ACTIVE_GROUND_VIEW.firstReadout,
  firstReceipt: H_EARTH_ACTIVE_GROUND_VIEW.firstReceipt,
  harnessReceipt: H_EARTH_ACTIVE_GROUND_VIEW.harnessReceipt,

  primaryInspectionObjectHint: 'OBJ_002_FOREGROUND_WET_SAND',
  primaryInspectionObjectOwner: 'ROOM_3_ENVIRONMENT',

  environmentDescriptorOwner: 'ROOM_3_ENVIRONMENT',
  cellDetailOwner: 'ROOM_2_CELL_STRUCTURE',
  actionOwner: 'ROOM_4_ACTIONS',
  readoutOwner: 'ROOM_5_READOUTS',
  receiptOwner: 'ROOM_6_RECEIPTS_AND_REPORT_HANDOFF',

  mirrorManorStatus: H_EARTH_ACTIVE_GROUND_VIEW.mirrorManorStatus,
  mirrorManorStrategicallyImplied: true,
  mirrorManorRouteCanonNamed: false
});

export const H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS = Object.freeze({
  sourceMatrixAuthority: true,
  descriptorOnlySourceAuthority: true,
  sceneScopedAddressabilityAuthority: true,

  repositoryMutation: false,
  routeActivation: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,

  rendererActivation: false,
  compositorActivation: false,
  controllerActivation: false,
  webglActivation: false,
  canvasActivation: false,

  latticeActivation: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  active256AddressRuntimeClaim: false,
  movementExpansion: false,
  traversalExpansion: false,
  deepInspectionExpansion: false,

  gameplayExecutionClaim: false,
  runtimeReceiptPersistence: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  diagnosticScoreClaim: false,
  healthScoreClaim: false,
  survivalScoreClaim: false,

  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false
});

export const H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA = Object.freeze({
  schemaId: 'H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA',
  status: 'DESCRIPTOR_ADDRESS_FIELD_SCHEMA_DEFINED',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  latticeClass: 'SCENE_SCOPED_DESCRIPTOR_ADDRESS_FIELD',
  latticeShape: '16x16',

  rowCount: 16,
  columnCount: 16,
  addressCount: 256,

  rowRange: Object.freeze({
    min: 1,
    max: 16
  }),

  columnRange: Object.freeze({
    min: 1,
    max: 16
  }),

  addressFormat: 'H_EARTH_GROUND_CELL_001:R{row}:C{column}',

  descriptorOnly: true,
  descriptorAddressFieldDefined: true,
  addressFieldAuthorized: true,
  addressFieldRuntimeActive: false,

  fullEnumerationIncludedHere: false,
  fullEnumerationOwner:
    'ROOM_3_ENVIRONMENT_AFTER_ROOM_2_CELL_BINDING_IF_MAPPING_AUTHORIZED',

  mappingOwners: Object.freeze({
    cellBinding: 'ROOM_2_CELL_STRUCTURE',
    zoneMapping: 'ROOM_3_ENVIRONMENT',
    objectCompression: 'ROOM_3_ENVIRONMENT',
    inspectionAnchorMapping: 'ROOM_3_ENVIRONMENT',
    actionMapping: 'ROOM_4_ACTIONS',
    readoutMapping: 'ROOM_5_READOUTS',
    receiptHandoff: 'ROOM_6_RECEIPTS_AND_REPORT_HANDOFF'
  }),

  runtimeActivation: false,
  movementActivation: false,
  traversalActivation: false,
  gameplayActivation: false,

  boundary: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
});

export const H_EARTH_SOURCE_LATTICE_AUTHORITY = Object.freeze({
  authorityId: 'H_EARTH_SOURCE_LATTICE_AUTHORITY',
  status: 'SOURCE_LATTICE_DESCRIPTOR_AUTHORITY_DEFINED',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  latticeClass: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.latticeClass,
  descriptorOnly: true,

  latticeShape: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.latticeShape,
  rowCount: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.rowCount,
  columnCount: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.columnCount,
  addressCount: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.addressCount,

  descriptorAddressFieldDefined: true,
  addressFieldAuthorized: true,
  addressFieldRuntimeActive: false,

  source16x16DescriptorAuthorityDefined: true,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  active256AddressRuntimeClaim: false,

  sourceAuthorityDefined: true,

  routeExposureAllowed: false,
  descriptorRouteExposureFutureAllowed: true,
  routeExposureCondition: 'AFTER_ROOM_6_SOURCE_RECEIPT_HANDOFF',

  downstreamMappingAllowed: true,
  downstreamMappingCondition:
    'ROOM_2_CELL_BINDING_MUST_COMPLETE_BEFORE_ROOM_3_ENVIRONMENT_MAPPING',

  activationState: Object.freeze({
    latticeActivated: false,
    movementActivated: false,
    traversalActivated: false,
    gameplayActivated: false,
    simulationActivated: false,
    rendererActivated: false,
    routeRuntimeActivated: false
  }),

  downstreamRoomAuthority: Object.freeze({
    room2CellStructureMayBindActiveCell: true,

    room3EnvironmentMayProceedNow: false,
    room3EnvironmentMayMapZonesAfterCellBindingReceipt: true,
    room3EnvironmentMayCompressObjectsAfterCellBindingReceipt: true,
    room3EnvironmentMayMapInspectionAnchorsAfterCellBindingReceipt: true,

    room4ActionsMayProceedNow: false,
    room4ActionsMayReferenceLatticeAfterEnvironmentMapping: true,

    room5ReadoutsMayProceedNow: false,
    room5ReadoutsMayReferenceLatticeAfterEnvironmentMapping: true,

    room6ReceiptsMayProceedNow: false,
    room6ReceiptsMayExposeCompactSourceReceiptsAfterOwnedRenewals: true,

    routeMayProceedNow: false,
    routeMayIngestAfterSourceReceiptHandoff: true
  }),

  downstreamOwnershipBoundaries: Object.freeze({
    cellDetailOwner: 'ROOM_2_CELL_STRUCTURE',
    zoneMappingOwner: 'ROOM_3_ENVIRONMENT',
    objectCompressionOwner: 'ROOM_3_ENVIRONMENT',
    inspectionAnchorOwner: 'ROOM_3_ENVIRONMENT',
    actionOwner: 'ROOM_4_ACTIONS',
    readoutOwner: 'ROOM_5_READOUTS',
    receiptOwner: 'ROOM_6_RECEIPTS_AND_REPORT_HANDOFF',
    routeOwner: 'HELD_UNTIL_SOURCE_CHAIN_COMPLETE'
  }),

  addressFieldSchema: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,

  mirrorManorBoundary: Object.freeze({
    shorelineManorSceneIdentity: 'earth-water-air-survival-shoreline-manor',
    mirrorManorStrategicallyImplied: true,
    mirrorManorRouteCanonNamed: false
  }),

  boundary: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
});

export const H_EARTH_GROUND_CELL_001_LATTICE_SCOPE = Object.freeze({
  scopeId: 'H_EARTH_GROUND_CELL_001_LATTICE_SCOPE',
  status: 'SOURCE_CELL_LATTICE_SCOPE_AUTHORITY_DEFINED',

  cellId: 'H_EARTH_GROUND_CELL_001',
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceAuthorityId: H_EARTH_SOURCE_LATTICE_AUTHORITY.authorityId,
  sourceAuthorityStatus: H_EARTH_SOURCE_LATTICE_AUTHORITY.status,

  latticeClass: H_EARTH_SOURCE_LATTICE_AUTHORITY.latticeClass,
  latticeShape: H_EARTH_SOURCE_LATTICE_AUTHORITY.latticeShape,
  rowCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.rowCount,
  columnCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.columnCount,
  addressCount: H_EARTH_SOURCE_LATTICE_AUTHORITY.addressCount,

  addressFieldSchemaId: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.schemaId,
  addressFormat: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA.addressFormat,

  descriptorOnly: true,
  descriptorAddressFieldDefined: true,
  addressFieldAuthorized: true,
  addressFieldRuntimeActive: false,

  cellBindingAuthority: 'SOURCE_DEFINED_ROOM_2_BINDING_REQUIRED',
  cellBindingComplete: false,

  room2Unblocked: true,
  room2RequiredNextFile: '/h-earth-3d/cells/ground-cell-001.js',
  room2RequiredNextStep:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  downstreamMappingStatus: Object.freeze({
    zoneMappingComplete: false,
    objectCompressionComplete: false,
    inspectionAnchorMappingComplete: false,
    actionMappingComplete: false,
    readoutMappingComplete: false,
    receiptHandoffComplete: false,
    routeExposureComplete: false
  }),

  downstreamOwners: Object.freeze({
    cellStructure: 'ROOM_2_CELL_STRUCTURE',
    environmentZones: 'ROOM_3_ENVIRONMENT',
    environmentObjects: 'ROOM_3_ENVIRONMENT',
    environmentAnchors: 'ROOM_3_ENVIRONMENT',
    actions: 'ROOM_4_ACTIONS',
    readouts: 'ROOM_5_READOUTS',
    receipts: 'ROOM_6_RECEIPTS_AND_REPORT_HANDOFF'
  }),

  notIncludedHere: Object.freeze([
    'full 256 address enumeration',
    'zone bands',
    'object list',
    'material channels',
    'inspection anchor list',
    'renderer node list',
    'CSS classes',
    'route copy buttons',
    'action response text',
    'readout payload details'
  ]),

  boundary: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
});

export const H_EARTH_MATRIX_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_SOURCE_MATRIX_RECEIPT',
  contractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
  file: '/h-earth-3d/h-earth.matrix.js',
  room: 'ROOM_1_SOURCE_CANON',

  status: 'SOURCE_MATRIX_RENEWED_SCENE_SCOPED_LATTICE_AUTHORITY_DEFINED',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  baselinePreserved: true,
  baselineStep: 'STEP_013_ROOM_6_DRIVE_NATIVE_SOURCE_TEXT',
  baselineExportsPreserved: Object.freeze([
    'H_EARTH_MATRIX_SEPARATION',
    'H_EARTH_ACTIVE_GROUND_VIEW',
    'H_EARTH_MATRIX'
  ]),

  sourceLatticeAuthorityDefined: true,
  source16x16DescriptorAuthorityDefined: true,
  descriptorOnly16x16AddressFieldAuthorized: true,

  latticeShape: '16x16',
  rowCount: 16,
  columnCount: 16,
  addressCount: 256,

  descriptorAddressFieldDefined: true,
  addressFieldAuthorized: true,
  addressFieldRuntimeActive: false,

  latticeActivationClaim: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  active256AddressRuntimeClaim: false,

  downstreamMappingCompletedHere: false,
  full256AddressMapEnumeratedHere: false,

  routeExposureAllowedNow: false,
  descriptorRouteExposureFutureAllowed: true,
  routeExposureCondition: 'AFTER_ROOM_6_SOURCE_RECEIPT_HANDOFF',

  room2MayProceed: true,
  room2NextFile: '/h-earth-3d/cells/ground-cell-001.js',
  room2NextStep:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  room3MayProceedNow: false,
  room3HoldReason:
    'Room 3 must wait until Room 2 binds H_EARTH_GROUND_CELL_001 to the source lattice authority.',

  room4MayProceedNow: false,
  room5MayProceedNow: false,
  room6MayProceedNow: false,
  routeMayProceedNow: false,

  mirrorManorStatus: 'STRATEGICALLY_IMPLIED_NOT_ROUTE_CANON_NAMED',

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  addressFieldSchema: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  boundary: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
});

export const H_EARTH_ROOM_2_UNBLOCK_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_ROOM_2_UNBLOCK_RECEIPT',
  contractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  status: 'ROOM_2_CELL_STRUCTURE_UNBLOCKED_BY_SOURCE_MATRIX_AUTHORITY',

  sourceMatrixAuthorityReady: true,
  sourceLatticeAuthorityDefined: true,
  sourceCellLatticeScopeDefined: true,
  room2MayProceed: true,

  requiredRoom2File: '/h-earth-3d/cells/ground-cell-001.js',
  requiredRoom2Step:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  sourceAuthorityExports: Object.freeze([
    'H_EARTH_SOURCE_LATTICE_AUTHORITY',
    'H_EARTH_GROUND_CELL_001_LATTICE_SCOPE',
    'H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA',
    'H_EARTH_MATRIX_RECEIPT'
  ]),

  room2AllowedWork: Object.freeze([
    'bind H_EARTH_GROUND_CELL_001 to source lattice authority',
    'preserve active cell descriptor model',
    'define cell-to-scene relation',
    'define cell-level spawn/anchor relation as descriptor-only',
    'preserve cell boundary flags'
  ]),

  room2NotAuthorized: Object.freeze([
    'define source lattice authority',
    'define full environment object map',
    'define zone bands',
    'activate lattice',
    'activate traversal',
    'claim visual pass',
    'claim validation',
    'claim production',
    'name Mirror Manor as route-canon'
  ]),

  boundary: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS
});

export function getHEarthMatrixReceipt() {
  return H_EARTH_MATRIX_RECEIPT;
}

export function getHEarthSourceLatticeAuthority() {
  return H_EARTH_SOURCE_LATTICE_AUTHORITY;
}

export function getHEarthGroundCell001LatticeScope() {
  return H_EARTH_GROUND_CELL_001_LATTICE_SCOPE;
}

export function getHEarthSourceSceneIdentity() {
  return H_EARTH_SOURCE_SCENE_IDENTITY;
}

export function getHEarthSourceLatticeAddressFieldSchema() {
  return H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA;
}

export function getHEarthRoom2UnblockReceipt() {
  return H_EARTH_ROOM_2_UNBLOCK_RECEIPT;
}

/**
 * Baseline export preserved.
 * Extended with source lattice authority, address schema, and Room 2 handoff.
 */
export const H_EARTH_MATRIX = Object.freeze({
  id: 'H_EARTH_MATRIX',
  project: 'DGB_H_EARTH_SCRATCH_REBUILD',
  step: 'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  file: '/h-earth-3d/h-earth.matrix.js',
  room: 'ROOM_1_SOURCE_CANON',

  matrixName: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  contract: H_EARTH_MATRIX_CONTRACT,

  activeGroundView: H_EARTH_ACTIVE_GROUND_VIEW,
  sourceSceneIdentity: H_EARTH_SOURCE_SCENE_IDENTITY,
  separation: H_EARTH_MATRIX_SEPARATION,

  sourceLatticeAuthority: H_EARTH_SOURCE_LATTICE_AUTHORITY,
  sourceLatticeAddressFieldSchema: H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  groundCell001LatticeScope: H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,

  receipt: H_EARTH_MATRIX_RECEIPT,
  room2UnblockReceipt: H_EARTH_ROOM_2_UNBLOCK_RECEIPT,

  claimBoundaries: Object.freeze({
    runtimeMatrixExecutionClaimed: false,
    routeIntegrationClaimed: false,
    rendererActivationClaimed: false,
    validationClaimed: false,
    openWorldTraversalClaimed: false,
    survivalSimulationClaimed: false,
    matrixMergerClaimed: false,

    webglActivationClaimed: false,
    canvasActivationClaimed: false,
    latticeActivationClaimed: false,
    active16x16RuntimeClaimed: false,
    active256AddressRuntimeClaimed: false,
    movementExpansionClaimed: false,
    fluidSimulationClaimed: false,
    swimmingClaimed: false,
    manorInteriorAccessClaimed: false,
    distantTraversalClaimed: false,
    mirrorManorRouteCanonNameClaimed: false,
    productionClaimed: false
  }),

  boundaryFlags: H_EARTH_SOURCE_LATTICE_BOUNDARY_FLAGS,

  getHEarthMatrixReceipt,
  getHEarthSourceLatticeAuthority,
  getHEarthGroundCell001LatticeScope,
  getHEarthSourceSceneIdentity,
  getHEarthSourceLatticeAddressFieldSchema,
  getHEarthRoom2UnblockReceipt
});

export default H_EARTH_MATRIX;
