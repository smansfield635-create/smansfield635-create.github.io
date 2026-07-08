/**
 * /h-earth-3d/actions/inspect-ground.js
 * COMPLETE RENEWED FILE
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1
 *
 * Based on Drive scratch baseline:
 * File: actions/inspect-ground.js
 * Prior status:
 * - Drive scratch raw-file construction only.
 * - Non-rendering contract action only.
 * - No GitHub installation.
 * - No public route integration.
 * - No runtime activation.
 * - No renderer/canvas/WebGL activation.
 * - No visual-pass claim.
 * - No validation claim.
 * - No open-world expansion.
 * - No survival simulation.
 * - No manor interior access.
 * - No distant traversal.
 * - No persistent save logic.
 *
 * Renewal room:
 * ROOM 4 / ACTIONS
 *
 * Upstream source authority:
 * /h-earth-3d/h-earth.matrix.js
 * H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1
 *
 * Upstream cell binding:
 * /h-earth-3d/cells/ground-cell-001.js
 * H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1
 *
 * Upstream zone binding:
 * /h-earth-3d/zones/ground-cell-001.zones.js
 * H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1
 *
 * Upstream object binding:
 * /h-earth-3d/objects/ground-cell-001.objects.js
 * H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1
 *
 * Purpose:
 * Renew the existing Drive scratch Inspect Ground action into an object-bound,
 * anchor-aware, descriptor-only action contract for H_EARTH_GROUND_CELL_001.
 *
 * Room 4 authority:
 * Room 4 does not create matrix authority.
 * Room 4 does not create cell authority.
 * Room 4 does not create zone authority.
 * Room 4 does not create object authority.
 * Room 4 binds the first action, Inspect Ground, to the Room 3 object
 * compression surface and prepares the lawful Room 5 readout handoff.
 *
 * Boundary:
 * This file defines action structure only.
 * This file does not execute gameplay.
 * This file does not persist receipts.
 * This file does not define readout payloads.
 * This file does not define renderer geometry.
 * This file does not create DOM/CSS/WebGL/canvas output.
 * This file does not activate lattice, traversal, gameplay, runtime, route,
 * renderer, canvas, WebGL, validation, production, or matrix collapse.
 */

import {
  H_EARTH_MATRIX_SEPARATION,
  H_EARTH_SOURCE_LATTICE_AUTHORITY,
  H_EARTH_SOURCE_LATTICE_ADDRESS_FIELD_SCHEMA,
  H_EARTH_GROUND_CELL_001_LATTICE_SCOPE,
  getHEarthMatrixReceipt,
  getHEarthSourceLatticeAuthority,
  getHEarthGroundCell001LatticeScope,
  getHEarthSourceLatticeAddressFieldSchema
} from '../h-earth.matrix.js';

import {
  H_EARTH_GROUND_CELL_001,
  H_EARTH_GROUND_CELL_001_CONTRACT,
  H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  H_EARTH_GROUND_CELL_001_LATTICE_BINDING,
  H_EARTH_GROUND_CELL_001_ADDRESS_FIELD_SUMMARY,
  H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  H_EARTH_GROUND_CELL_001_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_RECEIPT,
  H_EARTH_ROOM_3_UNBLOCK_RECEIPT,
  getHEarthGroundCell001Receipt,
  getHEarthGroundCell001LatticeBinding,
  getHEarthGroundCell001AddressFieldSummary,
  getHEarthRoom3UnblockReceipt
} from '../cells/ground-cell-001.js';

import {
  H_EARTH_ZONE_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_ZONES,
  H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  H_EARTH_GROUND_CELL_001_ZONES_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_ZONE_IDS,
  H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
  H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
  H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
  H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,
  H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,
  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZoneAddressRegion,
  getHEarthGroundCell001ZoneAdjacency,
  getHEarthGroundCell001ZonesReceipt,
  getHEarthRoom3ObjectMappingUnblockReceipt,
  isHEarthGroundCell001ZoneId,
  getHEarthGroundCell001ExpectedObjectsForZone
} from '../zones/ground-cell-001.zones.js';

import {
  H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
  H_EARTH_PRIMARY_INSPECTION_TARGET,
  H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  H_EARTH_CONTEXT_OBJECTS,
  H_EARTH_GROUND_CELL_001_OBJECTS_BOUNDARY_FLAGS,
  H_EARTH_GROUND_CELL_001_OBJECT_IDS,
  H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL,
  H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,
  H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,
  H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,
  H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,
  H_EARTH_GROUND_CELL_001_OBJECTS,
  H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,
  H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,
  H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,
  H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,
  H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,
  H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,
  H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,
  getHEarthGroundCell001ObjectDescriptor,
  getHEarthGroundCell001ObjectZoneBinding,
  getHEarthGroundCell001ObjectAddressBinding,
  getHEarthGroundCell001ObjectsForZone,
  getHEarthGroundCell001ObjectsReceipt,
  getHEarthRoom4ActionBindingUnblockReceipt,
  isHEarthGroundCell001ObjectId,
  isHEarthGroundCell001InspectionObject,
  isHEarthGroundCell001ContextOnlyObject
} from '../objects/ground-cell-001.objects.js';

export const H_EARTH_INSPECT_GROUND_ACTION_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  upstreamMatrixContractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  upstreamCellContractId:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  upstreamZoneContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  upstreamObjectContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  file: '/h-earth-3d/actions/inspect-ground.js',
  upstreamMatrixFile: '/h-earth-3d/h-earth.matrix.js',
  upstreamCellFile: '/h-earth-3d/cells/ground-cell-001.js',
  upstreamZoneFile: '/h-earth-3d/zones/ground-cell-001.zones.js',
  upstreamObjectFile: '/h-earth-3d/objects/ground-cell-001.objects.js',
  sourceRoot: '/h-earth-3d/',

  room: 'ROOM_4_ACTIONS',
  upstreamRoom: 'ROOM_3_ENVIRONMENT_OBJECT_COMPRESSION',
  downstreamRoom: 'ROOM_5_READOUT_PREPARATION',

  fileClass: 'SOURCE_ACTION_BINDING_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',
  actionRole: 'FIRST_GROUND_VIEW_ACTION',

  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  baselinePreserved: Object.freeze({
    driveScratchBaselineConsumed: true,
    baselineTargetsExportPreserved: true,
    baselineActionExportPreserved: true,
    baselineDefaultExportPreserved: true,
    baselinePrimaryTargetPreserved: true,
    baselineSupportingTargetsPreserved: true,
    baselineOutputReadoutPreserved: true,
    baselineOutputReceiptPreserved: true,
    baselineStatePathPreserved: true,
    baselineNoGitHubInstallationPreserved: true,
    baselineNoPublicRouteIntegrationPreserved: true,
    baselineNoRuntimeActivationPreserved: true,
    baselineNoRendererCanvasWebGLActivationPreserved: true,
    baselineNoVisualPassPreserved: true,
    baselineNoValidationPreserved: true,
    baselineNoOpenWorldExpansionPreserved: true,
    baselineNoSurvivalSimulationPreserved: true,
    baselineNoPersistentSavePreserved: true
  }),

  renewalPurpose:
    'Bind Inspect Ground to the renewed object descriptors and primary object anchor without creating runtime execution, route behavior, renderer facts, readout payloads, or receipt persistence.',

  renewalScope: Object.freeze({
    upstreamMatrixAuthorityConsumed: true,
    upstreamCellLatticeBindingConsumed: true,
    upstreamZoneMappingConsumed: true,
    upstreamObjectCompressionConsumed: true,
    primaryTargetBindingDefined: true,
    supportingTargetBindingsDefined: true,
    objectAnchorBindingDefined: true,
    actionInputDescriptorDefined: true,
    actionOutputDescriptorDefined: true,
    dryRunDescriptorBuilderDefined: true,
    room5ReadoutBindingUnblocked: true,

    sourceLatticeAuthorityCreatedHere: false,
    activeCellBindingCreatedHere: false,
    zoneAuthorityCreatedHere: false,
    objectAuthorityCreatedHere: false,
    full256AddressEnumerationAdded: false,
    materialChannelMappingAdded: false,
    rendererGeometryAdded: false,
    assetLoadingAdded: false,
    gameplayExecutionAdded: false,
    runtimeActionExecutionAdded: false,
    readoutPayloadAdded: false,
    receiptRuntimePersistenceAdded: false,
    routeExposureAdded: false,
    rendererBehaviorChanged: false,
    compositorBehaviorChanged: false,
    controllerBehaviorChanged: false
  })
});

export const H_EARTH_INSPECT_GROUND_BOUNDARIES = Object.freeze({
  actionScope: 'BOUNDED_ENVIRONMENTAL_GROUND_INSPECTION_ONLY',
  descriptorOnlyActionAuthority: true,
  objectBoundActionAuthority: true,
  anchorBoundActionAuthority: true,
  cellLatticeConsumed: true,
  zoneMappingConsumed: true,
  objectCompressionConsumed: true,

  rawDriveScratchFileOnly: false,
  renewedSourceActionDescriptor: true,

  sourceMatrixAuthorityCreatedHere: false,
  cellLatticeBindingCreatedHere: false,
  zoneMappingCreatedHere: false,
  objectMappingCreatedHere: false,
  materialChannelMappingCreatedHere: false,
  rendererGeometryCreatedHere: false,
  renderedAssetCreatedHere: false,
  assetLoadingCreatedHere: false,
  readoutPayloadCreatedHere: false,
  receiptRuntimeCreatedHere: false,
  routeExposureCreatedHere: false,

  runtimeActionExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  empiricalDiagnosisClaim: false,
  rendererStatusClaim: false,
  rendererActivationClaim: false,
  visualPassStatusClaim: false,
  validationStatusClaim: false,
  openWorldScanClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  persistentSaveLogic: false,
  routeIntegration: false,
  githubInstallation: false,

  full256AddressRuntimeClaim: false,
  full256AddressEnumerationIncludedHere: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,

  rendererActivation: false,
  compositorActivation: false,
  controllerActivation: false,
  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  iframeActivation: false,

  latticeActivation: false,
  runtime16x16LatticeActivationClaim: false,
  active16x16RuntimeClaim: false,
  movementExpansion: false,
  traversalExpansion: false,
  deepInspectionExpansion: false,

  runtimeReceiptPersistence: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  weatherSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  diagnosticScoreClaim: false,
  healthScoreClaim: false,
  survivalScoreClaim: false,

  matrixCollapse: false
});

/**
 * Baseline export preserved from Drive scratch file.
 */
export const H_EARTH_INSPECT_GROUND_TARGETS = Object.freeze({
  primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,

  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  requiredPrimaryFocusTarget: 'OBJ_002_FOREGROUND_WET_SAND',

  requiredSupportingInspectionTargets: Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]),

  targetSource: 'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D',
  descriptorOnly: true,
  runtimeResolutionClaim: false,
  validationClaim: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_STATE_PATH = Object.freeze({
  previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
  newState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',
  statePathLabel:
    'H_EARTH_GROUND_VIEW_ACTIVE_TO_H_EARTH_SURFACE_INSPECTION_ACTIVE',
  stateTransitionDescriptorOnly: true,
  stateMutationClaim: false,
  runtimeActivationClaim: false,
  receiptPersistenceClaim: false,
  validationClaim: false
});

export const H_EARTH_INSPECT_GROUND_INPUT_MODEL = Object.freeze({
  inputModelId: 'H_EARTH_INSPECT_GROUND_INPUT_MODEL',
  status: 'OBJECT_BOUND_ACTION_INPUT_DESCRIPTOR_ONLY',

  expectedAction: 'Inspect Ground',
  expectedActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  expectedCurrentState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
  expectedNextState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,

  primaryFocusTarget: H_EARTH_INSPECT_GROUND_TARGETS.primaryFocusTarget,
  supportingInspectionTargets:
    H_EARTH_INSPECT_GROUND_TARGETS.supportingInspectionTargets,

  acceptedInputKeys: Object.freeze([
    'activeMatrix',
    'activeMatrixRole',
    'activeCell',
    'sceneIdentity',
    'currentState',
    'userAction',
    'actionId',
    'primaryFocusTarget',
    'supportingInspectionTargets',
    'requestedReadout',
    'requestedReceipt'
  ]),

  defaultInput: Object.freeze({
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',
    currentState: 'H_EARTH_GROUND_VIEW_ACTIVE',
    userAction: 'Inspect Ground',
    actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    requestedReadout: 'Ground Condition Read',
    requestedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
  }),

  inputCreatesRuntimeExecution: false,
  inputCreatesGameplayExecution: false,
  inputCreatesRouteMutation: false,
  inputCreatesRendererState: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_TARGET_MODEL = Object.freeze({
  targetModelId: 'H_EARTH_INSPECT_GROUND_TARGET_MODEL',
  status: 'PRIMARY_AND_SUPPORTING_OBJECT_TARGETS_BOUND_DESCRIPTOR_ONLY',

  primaryTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,

  primaryTargetDescriptor:
    getHEarthGroundCell001ObjectDescriptor(H_EARTH_PRIMARY_INSPECTION_TARGET),

  primaryTargetZoneBinding:
    getHEarthGroundCell001ObjectZoneBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  primaryTargetAddressBinding:
    getHEarthGroundCell001ObjectAddressBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  supportingTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  supportingTargetDescriptors: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      getHEarthGroundCell001ObjectDescriptor(objectId)
    )
  ),

  supportingTargetZoneBindings: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      getHEarthGroundCell001ObjectZoneBinding(objectId)
    )
  ),

  supportingTargetAddressBindings: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      getHEarthGroundCell001ObjectAddressBinding(objectId)
    )
  ),

  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  blockedAsDirectActionTargets: Object.freeze([
    'OBJ_001_GROUND_SPAWN_ANCHOR',
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  directActionTargetPolicy: Object.freeze({
    OBJ_002_FOREGROUND_WET_SAND: 'PRIMARY_DIRECT_ACTION_TARGET',
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      'SUPPORTING_DIRECT_ACTION_REFERENCE',
    OBJ_010_SMALL_BEACH_STONES: 'SUPPORTING_DIRECT_ACTION_REFERENCE',
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 'SUPPORTING_DIRECT_ACTION_REFERENCE',
    OBJ_005_SHORELINE_FOAM_LINE: 'SUPPORTING_DIRECT_ACTION_REFERENCE',
    OBJ_006_NEARSHORE_WAVE_BAND:
      'READOUT_CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
    OBJ_007_WATER_SURFACE_PLANE:
      'READOUT_CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
    OBJ_008_AIR_HAZE_LIGHT_LAYER:
      'READOUT_CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
    OBJ_009_MANOR_EXTERIOR_CONTEXT:
      'CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      'CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET'
  }),

  targetResolutionClaim: 'DESCRIPTOR_REFERENCE_ONLY',
  runtimeTargetResolutionClaim: false,
  traversalTargetClaim: false,
  rendererTargetClaim: false,
  validationClaim: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING = Object.freeze({
  bindingId: 'H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING',
  status: 'PRIMARY_WET_SAND_ANCHOR_BOUND_DESCRIPTOR_ONLY',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',

  anchorObjectId: H_EARTH_PRIMARY_INSPECTION_TARGET,
  anchorObjectDescriptor:
    getHEarthGroundCell001ObjectDescriptor(H_EARTH_PRIMARY_INSPECTION_TARGET),

  anchorZoneBinding:
    getHEarthGroundCell001ObjectZoneBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  anchorAddressBinding:
    getHEarthGroundCell001ObjectAddressBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  anchorZoneId:
    getHEarthGroundCell001ObjectZoneBinding(H_EARTH_PRIMARY_INSPECTION_TARGET)
      ?.zoneId || 'ZONE_001_FOREGROUND_INSPECTION_ZONE',

  anchorAddress:
    getHEarthGroundCell001ObjectAddressBinding(H_EARTH_PRIMARY_INSPECTION_TARGET)
      ?.primaryAddress || 'H_EARTH_GROUND_CELL_001:R03:C08',

  anchorActionRole: 'PRIMARY_INSPECT_GROUND_FOCUS_TARGET',

  allowedSupportingAnchors: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  supportingAnchorRoles: Object.freeze({
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      'SUPPORTING_MOISTURE_REFLECTION_REFERENCE',
    OBJ_010_SMALL_BEACH_STONES: 'SUPPORTING_FOOTING_DETAIL_REFERENCE',
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 'SUPPORTING_LOCAL_HAZARD_REFERENCE',
    OBJ_005_SHORELINE_FOAM_LINE: 'SUPPORTING_SHORELINE_CONTACT_REFERENCE'
  }),

  blockedAnchorRoles: Object.freeze({
    OBJ_001_GROUND_SPAWN_ANCHOR:
      'SPAWN_REFERENCE_ONLY_NOT_INSPECTION_RESULT_TARGET',
    OBJ_006_NEARSHORE_WAVE_BAND:
      'READOUT_CONTEXT_ONLY_NO_SWIMMING_OR_FLUID_SIMULATION',
    OBJ_007_WATER_SURFACE_PLANE:
      'READOUT_CONTEXT_ONLY_NO_WATER_TRAVERSAL',
    OBJ_008_AIR_HAZE_LIGHT_LAYER:
      'READOUT_CONTEXT_ONLY_NO_WEATHER_SIMULATION',
    OBJ_009_MANOR_EXTERIOR_CONTEXT:
      'HEARTH_CONTEXT_ONLY_NO_MANOR_INTERIOR_ACCESS',
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS:
      'AUDRALIA_CONTEXT_ONLY_NO_DISTANT_TRAVERSAL'
  }),

  anchorBindingCreatesActionExecution: false,
  anchorBindingCreatesTraversal: false,
  anchorBindingCreatesRendererGeometry: false,
  anchorBindingCreatesValidation: false,
  anchorBindingCreatesMatrixCollapse: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS = Object.freeze({
  bindingId: 'H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS',
  status: 'ACTION_TO_OBJECT_BINDINGS_DEFINED_DESCRIPTOR_ONLY',

  actionObjectReference: H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,

  primaryBinding: Object.freeze({
    objectId: H_EARTH_PRIMARY_INSPECTION_TARGET,
    role: 'PRIMARY_ACTION_TARGET',
    objectDescriptor:
      getHEarthGroundCell001ObjectDescriptor(H_EARTH_PRIMARY_INSPECTION_TARGET),
    zoneBinding:
      getHEarthGroundCell001ObjectZoneBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),
    addressBinding:
      getHEarthGroundCell001ObjectAddressBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),
    directActionAllowed: true,
    readoutReferenceAllowed: true
  }),

  supportingBindings: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      Object.freeze({
        objectId,
        role: 'SUPPORTING_ACTION_REFERENCE',
        objectDescriptor: getHEarthGroundCell001ObjectDescriptor(objectId),
        zoneBinding: getHEarthGroundCell001ObjectZoneBinding(objectId),
        addressBinding: getHEarthGroundCell001ObjectAddressBinding(objectId),
        directActionAllowed: true,
        readoutReferenceAllowed: true
      })
    )
  ),

  contextOnlyBindings: Object.freeze(
    H_EARTH_CONTEXT_OBJECTS.map((objectId) =>
      Object.freeze({
        objectId,
        role: 'CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
        objectDescriptor: getHEarthGroundCell001ObjectDescriptor(objectId),
        zoneBinding: getHEarthGroundCell001ObjectZoneBinding(objectId),
        addressBinding: getHEarthGroundCell001ObjectAddressBinding(objectId),
        directActionAllowed: false,
        readoutReferenceAllowed: true
      })
    )
  ),

  waterAirContextReadoutOnlyBindings: Object.freeze(
    [
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE',
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ].map((objectId) =>
      Object.freeze({
        objectId,
        role: 'READOUT_CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET',
        objectDescriptor: getHEarthGroundCell001ObjectDescriptor(objectId),
        zoneBinding: getHEarthGroundCell001ObjectZoneBinding(objectId),
        addressBinding: getHEarthGroundCell001ObjectAddressBinding(objectId),
        directActionAllowed: false,
        readoutReferenceAllowed: true,
        swimmingAuthorized: false,
        fluidSimulationAuthorized: false,
        weatherSimulationAuthorized: false,
        traversalAuthorized: false
      })
    )
  ),

  actionExecutionDefinedHere: false,
  runtimeTargetMutationDefinedHere: false,
  readoutPayloadDefinedHere: false,
  receiptPersistenceDefinedHere: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_OUTPUT_MODEL = Object.freeze({
  outputModelId: 'H_EARTH_INSPECT_GROUND_OUTPUT_MODEL',
  status: 'READOUT_AND_RECEIPT_HANDOFF_DESCRIPTOR_ONLY',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',

  outputReadout: 'Ground Condition Read',
  outputReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  outputReadoutFile: '/h-earth-3d/readouts/ground-condition-read.js',
  outputReadoutStep:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  outputReceiptFile: '/h-earth-3d/receipts or h-earth.receipts.js',
  outputReceiptRuntimePersistenceDefinedHere: false,

  expectedReadoutShape: Object.freeze({
    readoutType: 'Ground Condition Read',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    boundedReadout: true,
    empiricalDiagnosticClaim: false,
    survivalSimulationClaim: false
  }),

  expectedReceiptShape: Object.freeze({
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    newState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,
    userAction: 'Inspect Ground',
    viewpoint: 'Ground-level',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    terrainReadout: 'Ground Condition Read',
    matrixSeparationPreserved: true,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  }),

  createsReadoutPayloadHere: false,
  persistsReceiptHere: false,
  createsRuntimeResultHere: false,
  routeOutputClaim: false,
  validationClaim: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL = Object.freeze({
  dryRunModelId: 'H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL',
  status: 'NON_RENDERING_ACTION_DRY_RUN_DESCRIPTOR_ONLY',

  dryRunOnly: true,
  actionName: 'Inspect Ground',
  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',

  dryRunInput:
    H_EARTH_INSPECT_GROUND_INPUT_MODEL.defaultInput,

  dryRunExpectedReadout: 'Ground Condition Read',
  dryRunExpectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  dryRunChecks: Object.freeze([
    'activeMatrix is H-Earth',
    'activeMatrixRole is Ground-View Matrix',
    'activeCell is H_EARTH_GROUND_CELL_001',
    'sceneIdentity is earth-water-air-survival-shoreline-manor',
    'currentState is H_EARTH_GROUND_VIEW_ACTIVE',
    'userAction is Inspect Ground',
    'primary focus target resolves to OBJ_002_FOREGROUND_WET_SAND',
    'supporting inspection targets resolve',
    'output readout identity is Ground Condition Read',
    'output receipt identity is H_EARTH_GROUND_INSPECTION_RECEIPT',
    'matrix separation remains preserved',
    'deferred claims remain false'
  ]),

  dryRunCreatesRuntimeExecution: false,
  dryRunCreatesRendererExecution: false,
  dryRunCreatesVisualPass: false,
  dryRunCreatesValidation: false,

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_INSPECT_GROUND_CONTEXT_GUARD = Object.freeze({
  guardId: 'H_EARTH_INSPECT_GROUND_CONTEXT_GUARD',
  status: 'MATRIX_AND_CONTEXT_BOUNDARIES_PRESERVED',

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,

  hEarthRole: 'Ground-View Matrix',
  hearthRole: 'support/control context only',
  audraliaRole: 'planetary-world context only',

  guardedContextObjects: Object.freeze({
    hearthContext: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),
    audraliaContext: Object.freeze([
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),
    waterAirContext: Object.freeze([
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE',
      'OBJ_008_AIR_HAZE_LIGHT_LAYER'
    ])
  }),

  prohibitions: Object.freeze({
    hearthMergedIntoHEarth: false,
    audraliaMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    distantTraversalAuthorized: false,
    openWorldMovementAuthorized: false,
    waterTraversalAuthorized: false,
    swimmingAuthorized: false,
    fluidSimulationAuthorized: false,
    weatherSimulationAuthorized: false,
    survivalSimulationAuthorized: false,
    matrixCollapse: false
  }),

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export function normalizeHEarthInspectGroundString(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function normalizeHEarthInspectGroundTargets(targets = []) {
  const safeTargets = Array.isArray(targets) ? targets : [];

  return Object.freeze(
    safeTargets
      .filter((target) => typeof target === 'string')
      .filter((target, index, array) => array.indexOf(target) === index)
  );
}

export function isHEarthInspectGroundPrimaryTarget(objectId) {
  return objectId === H_EARTH_PRIMARY_INSPECTION_TARGET;
}

export function isHEarthInspectGroundSupportingTarget(objectId) {
  return H_EARTH_SUPPORTING_INSPECTION_TARGETS.includes(objectId);
}

export function isHEarthInspectGroundAllowedTarget(objectId) {
  return Boolean(
    isHEarthInspectGroundPrimaryTarget(objectId) ||
      isHEarthInspectGroundSupportingTarget(objectId)
  );
}

export function isHEarthInspectGroundBlockedDirectTarget(objectId) {
  return Boolean(
    objectId &&
      H_EARTH_INSPECT_GROUND_TARGET_MODEL.blockedAsDirectActionTargets.includes(
        objectId
      )
  );
}

export function getHEarthInspectGroundTargetDescriptor(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;

  const descriptor = getHEarthGroundCell001ObjectDescriptor(objectId);

  if (!descriptor) return null;

  return Object.freeze({
    objectId,
    descriptor,
    zoneBinding: getHEarthGroundCell001ObjectZoneBinding(objectId),
    addressBinding: getHEarthGroundCell001ObjectAddressBinding(objectId),
    actionRole:
      objectId === H_EARTH_PRIMARY_INSPECTION_TARGET
        ? 'PRIMARY_ACTION_TARGET'
        : H_EARTH_SUPPORTING_INSPECTION_TARGETS.includes(objectId)
          ? 'SUPPORTING_ACTION_REFERENCE'
          : isHEarthGroundCell001ContextOnlyObject(objectId)
            ? 'CONTEXT_ONLY_NOT_DIRECT_ACTION_TARGET'
            : 'UNCLASSIFIED_FOR_INSPECT_GROUND',
    directActionAllowed: isHEarthInspectGroundAllowedTarget(objectId),
    blockedAsDirectTarget: isHEarthInspectGroundBlockedDirectTarget(objectId),
    descriptorOnly: true,
    runtimeResolutionClaim: false,
    validationClaim: false
  });
}

export function buildHEarthInspectGroundInput(input = {}) {
  const safeInput =
    input && typeof input === 'object'
      ? input
      : Object.freeze({});

  const defaultInput = H_EARTH_INSPECT_GROUND_INPUT_MODEL.defaultInput;

  const primaryFocusTarget = normalizeHEarthInspectGroundString(
    safeInput.primaryFocusTarget,
    defaultInput.primaryFocusTarget
  );

  const supportingInspectionTargets = normalizeHEarthInspectGroundTargets(
    safeInput.supportingInspectionTargets ||
      defaultInput.supportingInspectionTargets
  );

  return Object.freeze({
    activeMatrix: normalizeHEarthInspectGroundString(
      safeInput.activeMatrix,
      defaultInput.activeMatrix
    ),
    activeMatrixRole: normalizeHEarthInspectGroundString(
      safeInput.activeMatrixRole,
      defaultInput.activeMatrixRole
    ),
    activeCell: normalizeHEarthInspectGroundString(
      safeInput.activeCell,
      defaultInput.activeCell
    ),
    sceneIdentity: normalizeHEarthInspectGroundString(
      safeInput.sceneIdentity,
      defaultInput.sceneIdentity
    ),
    currentState: normalizeHEarthInspectGroundString(
      safeInput.currentState,
      defaultInput.currentState
    ),
    userAction: normalizeHEarthInspectGroundString(
      safeInput.userAction,
      defaultInput.userAction
    ),
    actionId: normalizeHEarthInspectGroundString(
      safeInput.actionId,
      defaultInput.actionId
    ),
    primaryFocusTarget,
    supportingInspectionTargets,
    requestedReadout: normalizeHEarthInspectGroundString(
      safeInput.requestedReadout,
      defaultInput.requestedReadout
    ),
    requestedReceipt: normalizeHEarthInspectGroundString(
      safeInput.requestedReceipt,
      defaultInput.requestedReceipt
    ),
    descriptorOnly: true,
    runtimeExecutionClaim: false
  });
}

export function checkHEarthInspectGroundInput(input = {}) {
  const normalizedInput = buildHEarthInspectGroundInput(input);

  const missingSupportingTargets =
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.filter(
      (target) => !normalizedInput.supportingInspectionTargets.includes(target)
    );

  const checks = Object.freeze({
    activeMatrixAccepted: normalizedInput.activeMatrix === 'H-Earth',
    activeMatrixRoleAccepted:
      normalizedInput.activeMatrixRole === 'Ground-View Matrix',
    activeCellAccepted:
      normalizedInput.activeCell === 'H_EARTH_GROUND_CELL_001',
    sceneIdentityAccepted:
      normalizedInput.sceneIdentity ===
      'earth-water-air-survival-shoreline-manor',
    currentStateAccepted:
      normalizedInput.currentState ===
      H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    userActionAccepted: normalizedInput.userAction === 'Inspect Ground',
    actionIdAccepted:
      normalizedInput.actionId === 'H_EARTH_INSPECT_GROUND_ACTION',
    primaryFocusTargetAccepted:
      normalizedInput.primaryFocusTarget === H_EARTH_PRIMARY_INSPECTION_TARGET,
    primaryTargetExists:
      isHEarthGroundCell001ObjectId(normalizedInput.primaryFocusTarget),
    primaryTargetInspectionEligible:
      isHEarthGroundCell001InspectionObject(normalizedInput.primaryFocusTarget),
    supportingTargetsPresent: missingSupportingTargets.length === 0,
    supportingTargetsExist:
      missingSupportingTargets.length === 0 &&
      H_EARTH_SUPPORTING_INSPECTION_TARGETS.every((target) =>
        isHEarthGroundCell001ObjectId(target)
      ),
    requestedReadoutAccepted:
      normalizedInput.requestedReadout === 'Ground Condition Read',
    requestedReceiptAccepted:
      normalizedInput.requestedReceipt === 'H_EARTH_GROUND_INSPECTION_RECEIPT'
  });

  const passed = Object.values(checks).every((value) => value === true);

  return Object.freeze({
    input: normalizedInput,
    checks,
    passed,
    missingSupportingTargets: Object.freeze(missingSupportingTargets),
    failureCodes: Object.freeze(
      passed
        ? []
        : Object.entries(checks)
            .filter(([, value]) => value !== true)
            .map(([key]) => `INSPECT_GROUND_INPUT_CHECK_FAILED:${key}`)
    ),
    descriptorOnly: true,
    runtimeExecutionClaim: false,
    validationClaim: false
  });
}

export function buildHEarthInspectGroundActionDescriptor(input = {}) {
  const inputCheck = checkHEarthInspectGroundInput(input);

  const primaryTargetDescriptor = getHEarthInspectGroundTargetDescriptor(
    inputCheck.input.primaryFocusTarget
  );

  const supportingTargetDescriptors = Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      getHEarthInspectGroundTargetDescriptor(objectId)
    )
  );

  return Object.freeze({
    descriptorType: 'H_EARTH_INSPECT_GROUND_ACTION_DESCRIPTOR',
    actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    actionLabel: 'Inspect Ground',
    actionRole: 'FIRST_GROUND_VIEW_ACTION',
    actionScope: 'BOUNDED_ENVIRONMENTAL_GROUND_INSPECTION_ONLY',

    activeMatrix: inputCheck.input.activeMatrix,
    activeMatrixRole: inputCheck.input.activeMatrixRole,
    activeCell: inputCheck.input.activeCell,
    sceneIdentity: inputCheck.input.sceneIdentity,

    currentState: inputCheck.input.currentState,
    nextState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,
    statePath: H_EARTH_INSPECT_GROUND_STATE_PATH,

    primaryFocusTarget: inputCheck.input.primaryFocusTarget,
    primaryTargetDescriptor,
    primaryTargetZoneBinding:
      getHEarthGroundCell001ObjectZoneBinding(inputCheck.input.primaryFocusTarget),
    primaryTargetAddressBinding:
      getHEarthGroundCell001ObjectAddressBinding(
        inputCheck.input.primaryFocusTarget
      ),

    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    supportingTargetDescriptors,

    contextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,

    outputReadout: 'Ground Condition Read',
    outputReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
    outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    inputCheck,

    actionDescriptorReady: inputCheck.passed === true,
    actionExecutionClaim: false,
    gameplayExecutionClaim: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
    readoutPayloadCreatedHere: false,
    receiptPersistenceCreatedHere: false,

    boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
  });
}

/**
 * Contract-only dry-run descriptor builder.
 * This does not activate runtime and does not persist a receipt.
 */
export function inspectGround(input = {}) {
  const descriptor = buildHEarthInspectGroundActionDescriptor(input);

  const readoutStub = Object.freeze({
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    cellId: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',
    primaryFocusTarget: descriptor.primaryFocusTarget,
    inspectionTargets: Object.freeze([
      descriptor.primaryFocusTarget,
      ...H_EARTH_SUPPORTING_INSPECTION_TARGETS
    ]),
    boundedReadout: true,
    readoutPayloadDefinedHere: false,
    empiricalDiagnosticClaim: false,
    survivalSimulationClaim: false,
    rendererResultClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    matrixCollapse: false
  });

  const receiptStub = Object.freeze({
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    activeMatrix: descriptor.activeMatrix,
    activeMatrixRole: descriptor.activeMatrixRole,
    activeCell: descriptor.activeCell,
    sceneIdentity: descriptor.sceneIdentity,
    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    newState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,
    userAction: 'Inspect Ground',
    viewpoint: 'Ground-level',
    primaryFocusTarget: descriptor.primaryFocusTarget,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    terrainReadout: 'Ground Condition Read',
    audraliaContext: 'PRESERVED_AS_PLANETARY_OBJECT_CONTEXT',
    hearthContext: 'AVAILABLE_NOT_MERGED',
    matrixSeparationPreserved: true,
    matrixCollapse: false,
    claimBoundaryPreserved: true,
    fullOpenWorldClaim: false,
    survivalSimulationClaim: false,
    visualPassClaim: false,
    rendererActivation: false,
    runtimeActivation: false,
    canvasActivation: false,
    webglActivation: false,
    validationClaimUpgrade: false,
    receiptPersistenceDefinedHere: false
  });

  return Object.freeze({
    actionResultType: 'H_EARTH_INSPECT_GROUND_CONTRACT_DRY_RUN_RESULT',
    actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    actionLabel: 'Inspect Ground',
    descriptor,
    readout: readoutStub,
    receipt: receiptStub,
    dryRunOnly: true,
    actionExecutedAtRuntime: false,
    gameplayExecuted: false,
    routeIntegrated: false,
    runtimeActivated: false,
    rendererActivated: false,
    canvasActivated: false,
    webglActivated: false,
    visualPassClaim: false,
    validationClaim: false,
    openWorldClaim: false,
    survivalSimulationClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
  });
}

export const H_EARTH_INSPECT_GROUND_ACTION = Object.freeze({
  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',
  actionRole: 'FIRST_GROUND_VIEW_ACTION',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  primaryFocusTarget: H_EARTH_INSPECT_GROUND_TARGETS.primaryFocusTarget,
  supportingInspectionTargets:
    H_EARTH_INSPECT_GROUND_TARGETS.supportingInspectionTargets,

  outputReadout: 'Ground Condition Read',
  outputReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  actionScope: 'BOUNDED_ENVIRONMENTAL_GROUND_INSPECTION_ONLY',
  statePath: H_EARTH_INSPECT_GROUND_STATE_PATH,

  contract: H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
  boundaries: H_EARTH_INSPECT_GROUND_BOUNDARIES,
  inputModel: H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  targetModel: H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  objectAnchorBinding: H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  objectBindings: H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  outputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  dryRunModel: H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  contextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,

  actionDescriptorBuilder: buildHEarthInspectGroundActionDescriptor,
  dryRunFunction: inspectGround,

  actionBehaviorDefinedHere: true,
  actionBehaviorClass: 'CONTRACT_ONLY_DESCRIPTOR_DRY_RUN',
  runtimeActionExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  empiricalDiagnosisClaim: false,
  rendererStatusClaim: false,
  visualPassStatusClaim: false,
  validationStatusClaim: false,
  openWorldScanClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  persistentSaveLogic: false,
  routeIntegration: false,
  githubInstallation: false,
  matrixCollapse: false
});

export const H_EARTH_INSPECT_GROUND_ACTION_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_INSPECT_GROUND_ACTION_RECEIPT',

  contractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  file: '/h-earth-3d/actions/inspect-ground.js',
  room: 'ROOM_4_ACTIONS',

  status:
    'INSPECT_GROUND_ACTION_RENEWED_FROM_DRIVE_SCRATCH_AND_BOUND_TO_OBJECT_ANCHOR_DESCRIPTOR_ONLY',

  upstreamMatrixFile: '/h-earth-3d/h-earth.matrix.js',
  upstreamMatrixContract:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',
  upstreamCellFile: '/h-earth-3d/cells/ground-cell-001.js',
  upstreamCellContract:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',
  upstreamZoneFile: '/h-earth-3d/zones/ground-cell-001.zones.js',
  upstreamZoneContract:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',
  upstreamObjectFile: '/h-earth-3d/objects/ground-cell-001.objects.js',
  upstreamObjectContract:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamCellReceipt: getHEarthGroundCell001Receipt(),
  upstreamRoom3UnblockReceipt: getHEarthRoom3UnblockReceipt(),
  upstreamZonesReceipt: getHEarthGroundCell001ZonesReceipt(),
  upstreamObjectMappingUnblockReceipt:
    getHEarthRoom3ObjectMappingUnblockReceipt(),
  upstreamObjectsReceipt: getHEarthGroundCell001ObjectsReceipt(),
  upstreamRoom4ActionBindingUnblockReceipt:
    getHEarthRoom4ActionBindingUnblockReceipt(),

  driveScratchBaselineConsumed: true,
  baselineTargetsExportPreserved: true,
  baselineActionExportPreserved: true,
  baselineDefaultExportPreserved: true,
  baselineNoRuntimeRendererVisualValidationClaimsPreserved: true,

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',
  actionRole: 'FIRST_GROUND_VIEW_ACTION',
  actionScope: 'BOUNDED_ENVIRONMENTAL_GROUND_INSPECTION_ONLY',

  previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
  newState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',

  outputReadout: 'Ground Condition Read',
  outputReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  sourceLatticeAuthorityConsumed: true,
  sourceLatticeAuthorityCreatedHere: false,
  cellLatticeBindingConsumed: true,
  cellLatticeBindingCreatedHere: false,
  zoneMappingConsumed: true,
  zoneMappingCreatedHere: false,
  objectCompressionConsumed: true,
  objectCompressionCreatedHere: false,

  latticeShape: '16x16',
  rowCount: 16,
  columnCount: 16,
  addressCount: 256,
  addressFormat: 'H_EARTH_GROUND_CELL_001:R{row}:C{column}',

  inspectGroundTargetsDefined: true,
  primaryTargetBound: true,
  supportingTargetsBound: true,
  objectAnchorBindingDefined: true,
  actionInputModelDefined: true,
  actionOutputModelDefined: true,
  dryRunDescriptorBuilderDefined: true,
  contextGuardDefined: true,

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  actionRuntimeExecutionCompletedHere: false,
  gameplayExecutionCompletedHere: false,
  materialChannelsCompletedHere: false,
  rendererGeometryCompletedHere: false,
  assetLoadingCompletedHere: false,
  readoutPayloadCompletedHere: false,
  receiptPersistenceCompletedHere: false,
  routeExposureCompletedHere: false,

  room5ReadoutFileMayProceed: true,
  room5NextFile: '/h-earth-3d/readouts/ground-condition-read.js',
  room5NextStep:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  room6MayProceedNow: false,
  routeMayProceedNow: false,

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export const H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT',

  contractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  status:
    'ROOM_5_GROUND_CONDITION_READ_BINDING_UNBLOCKED_BY_INSPECT_GROUND_ACTION_BINDING',

  sourceMatrixAuthorityReady: true,
  sourceLatticeAuthorityDefined: true,
  cellLatticeBindingComplete: true,
  zoneLatticeMappingComplete: true,
  objectLatticeCompressionComplete: true,
  inspectGroundActionBindingComplete: true,
  driveScratchActionBaselinePreserved: true,

  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  requiredRoom5ReadoutFile:
    '/h-earth-3d/readouts/ground-condition-read.js',

  requiredRoom5ReadoutStep:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  room5ReadoutFileAllowedWork: Object.freeze([
    'bind Ground Condition Read to H_EARTH_INSPECT_GROUND_ACTION',
    'consume primary inspection target OBJ_002_FOREGROUND_WET_SAND',
    'consume supporting inspection targets',
    'consume water, air, Hearth, and Audralia context boundaries',
    'return descriptor-only readout payload template',
    'prepare H_EARTH_GROUND_INSPECTION_RECEIPT handoff'
  ]),

  room5ReadoutFileNotAuthorized: Object.freeze([
    'create new canonical objects',
    'activate lattice',
    'create traversal grid',
    'create route navigation mesh',
    'create renderer geometry',
    'create material channels',
    'create DOM or canvas output',
    'authorize swimming',
    'authorize fluid simulation',
    'authorize weather simulation',
    'authorize manor interior access',
    'authorize distant traversal',
    'claim renderer pass',
    'claim visual pass',
    'claim validation',
    'claim production',
    'collapse matrices'
  ]),

  sourceAuthorityExports: Object.freeze([
    'H_EARTH_INSPECT_GROUND_TARGETS',
    'H_EARTH_INSPECT_GROUND_ACTION',
    'H_EARTH_INSPECT_GROUND_ACTION_RECEIPT',
    'H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT',
    'inspectGround',
    'buildHEarthInspectGroundActionDescriptor',
    'getHEarthInspectGroundActionReceipt'
  ]),

  boundary: H_EARTH_INSPECT_GROUND_BOUNDARIES
});

export function getHEarthInspectGroundTargets() {
  return H_EARTH_INSPECT_GROUND_TARGETS;
}

export function getHEarthInspectGroundAction() {
  return H_EARTH_INSPECT_GROUND_ACTION;
}

export function getHEarthInspectGroundActionReceipt() {
  return H_EARTH_INSPECT_GROUND_ACTION_RECEIPT;
}

export function getHEarthRoom5ReadoutBindingUnblockReceipt() {
  return H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT;
}

export function getHEarthInspectGroundObjectAnchorBinding() {
  return H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING;
}

export function getHEarthInspectGroundObjectBindings() {
  return H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS;
}

export function getHEarthInspectGroundOutputModel() {
  return H_EARTH_INSPECT_GROUND_OUTPUT_MODEL;
}

export const H_EARTH_INSPECT_GROUND_AGGREGATE = Object.freeze({
  id: 'H_EARTH_INSPECT_GROUND_AGGREGATE',
  file: '/h-earth-3d/actions/inspect-ground.js',
  room: 'ROOM_4_ACTIONS',
  step:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',
  actionRole: 'FIRST_GROUND_VIEW_ACTION',

  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  contract: H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,

  baselinePreserved: Object.freeze({
    H_EARTH_INSPECT_GROUND_TARGETS,
    H_EARTH_INSPECT_GROUND_ACTION
  }),

  upstreamMatrixAuthority: getHEarthSourceLatticeAuthority(),
  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamSourceLatticeAddressFieldSchema:
    getHEarthSourceLatticeAddressFieldSchema(),
  upstreamGroundCell001LatticeScope:
    getHEarthGroundCell001LatticeScope(),

  upstreamCell: H_EARTH_GROUND_CELL_001,
  upstreamCellContract: H_EARTH_GROUND_CELL_001_CONTRACT,
  upstreamCellSceneBinding: H_EARTH_GROUND_CELL_001_SCENE_BINDING,
  upstreamCellLatticeBinding: getHEarthGroundCell001LatticeBinding(),
  upstreamCellAddressFieldSummary: getHEarthGroundCell001AddressFieldSummary(),
  upstreamCellSpawnAnchorScope: H_EARTH_GROUND_CELL_001_SPAWN_ANCHOR_SCOPE,
  upstreamCellReceipt: H_EARTH_GROUND_CELL_001_RECEIPT,
  upstreamRoom3UnblockReceipt: H_EARTH_ROOM_3_UNBLOCK_RECEIPT,

  upstreamZoneContract: H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  upstreamZoneBoundaries: H_EARTH_ZONE_BOUNDARIES,
  upstreamZones: H_EARTH_GROUND_CELL_001_ZONES,
  upstreamZoneIds: H_EARTH_GROUND_CELL_001_ZONE_IDS,
  upstreamZoneMappingModel: H_EARTH_GROUND_CELL_001_ZONE_MAPPING_MODEL,
  upstreamZoneAddressRegions: H_EARTH_GROUND_CELL_001_ZONE_ADDRESS_REGIONS,
  upstreamZoneBoundaryRoles: H_EARTH_GROUND_CELL_001_ZONE_BOUNDARY_ROLES,
  upstreamZoneAdjacency: H_EARTH_GROUND_CELL_001_ZONE_ADJACENCY,
  upstreamZoneDescriptors: H_EARTH_GROUND_CELL_001_ZONE_DESCRIPTORS,
  upstreamZoneOverlapModel: H_EARTH_GROUND_CELL_001_ZONE_OVERLAP_MODEL,
  upstreamZoneToObjectExpectation:
    H_EARTH_GROUND_CELL_001_ZONE_TO_OBJECT_EXPECTATION,
  upstreamZoneDownstreamInterface:
    H_EARTH_GROUND_CELL_001_ZONE_DOWNSTREAM_INTERFACE,
  upstreamZoneAllowedActions: H_EARTH_GROUND_CELL_001_ALLOWED_ZONE_ACTIONS,
  upstreamZoneBlockedActions: H_EARTH_GROUND_CELL_001_BLOCKED_ZONE_ACTIONS,
  upstreamZonesReceipt: H_EARTH_GROUND_CELL_001_ZONES_RECEIPT,
  upstreamObjectMappingUnblockReceipt:
    H_EARTH_ROOM_3_OBJECT_MAPPING_UNBLOCK_RECEIPT,

  upstreamObjectContract: H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
  upstreamObjectIds: H_EARTH_GROUND_CELL_001_OBJECT_IDS,
  upstreamObjectCompressionModel:
    H_EARTH_GROUND_CELL_001_OBJECT_COMPRESSION_MODEL,
  upstreamObjectZoneBindings: H_EARTH_GROUND_CELL_001_OBJECT_ZONE_BINDINGS,
  upstreamObjectAddressBindings:
    H_EARTH_GROUND_CELL_001_OBJECT_ADDRESS_BINDINGS,
  upstreamObjectInspectionRoles:
    H_EARTH_GROUND_CELL_001_OBJECT_INSPECTION_ROLES,
  upstreamObjectContextBoundaries:
    H_EARTH_GROUND_CELL_001_OBJECT_CONTEXT_BOUNDARIES,
  upstreamObjects: H_EARTH_GROUND_CELL_001_OBJECTS,
  upstreamObjectDescriptors: H_EARTH_GROUND_CELL_001_OBJECT_DESCRIPTORS,
  upstreamObjectsByZone: H_EARTH_GROUND_CELL_001_OBJECTS_BY_ZONE,
  upstreamObjectToActionReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_ACTION_REFERENCE,
  upstreamObjectToReadoutReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,
  upstreamObjectDownstreamInterface:
    H_EARTH_GROUND_CELL_001_OBJECT_DOWNSTREAM_INTERFACE,
  upstreamObjectsReceipt: H_EARTH_GROUND_CELL_001_OBJECTS_RECEIPT,
  upstreamRoom4ActionBindingUnblockReceipt:
    H_EARTH_ROOM_4_ACTION_BINDING_UNBLOCK_RECEIPT,

  targets: H_EARTH_INSPECT_GROUND_TARGETS,
  statePath: H_EARTH_INSPECT_GROUND_STATE_PATH,
  inputModel: H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  targetModel: H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  objectAnchorBinding: H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  objectBindings: H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  outputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  dryRunModel: H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  contextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,

  action: H_EARTH_INSPECT_GROUND_ACTION,
  receipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
  room5ReadoutBindingUnblockReceipt:
    H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundaryFlags: H_EARTH_INSPECT_GROUND_BOUNDARIES,

  normalizeHEarthInspectGroundString,
  normalizeHEarthInspectGroundTargets,
  isHEarthInspectGroundPrimaryTarget,
  isHEarthInspectGroundSupportingTarget,
  isHEarthInspectGroundAllowedTarget,
  isHEarthInspectGroundBlockedDirectTarget,
  getHEarthInspectGroundTargetDescriptor,
  buildHEarthInspectGroundInput,
  checkHEarthInspectGroundInput,
  buildHEarthInspectGroundActionDescriptor,
  inspectGround,
  getHEarthInspectGroundTargets,
  getHEarthInspectGroundAction,
  getHEarthInspectGroundActionReceipt,
  getHEarthRoom5ReadoutBindingUnblockReceipt,
  getHEarthInspectGroundObjectAnchorBinding,
  getHEarthInspectGroundObjectBindings,
  getHEarthInspectGroundOutputModel,
  getHEarthGroundCell001ObjectDescriptor,
  getHEarthGroundCell001ObjectZoneBinding,
  getHEarthGroundCell001ObjectAddressBinding,
  getHEarthGroundCell001ObjectsForZone,
  isHEarthGroundCell001ObjectId,
  isHEarthGroundCell001InspectionObject,
  isHEarthGroundCell001ContextOnlyObject,
  getHEarthGroundCell001ZoneDescriptor,
  getHEarthGroundCell001ZoneAddressRegion,
  getHEarthGroundCell001ZoneAdjacency,
  getHEarthGroundCell001ExpectedObjectsForZone
});

export default H_EARTH_INSPECT_GROUND_ACTION;
