/**
 * /h-earth-3d/readouts/ground-condition-read.js
 * COMPLETE RENEWED FILE
 * H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1
 *
 * Based on Drive scratch baseline:
 * File: readouts/ground-condition-read.js
 *
 * Prior status:
 * - Drive scratch raw-file construction only.
 * - Bounded environmental ground condition read only.
 * - No runtime result.
 * - No renderer result.
 * - No visual-pass claim.
 * - No validation claim.
 * - No open-world scan.
 * - No survival simulation.
 * - No swimming.
 * - No fluid simulation.
 * - No production readiness.
 * - No matrix collapse.
 *
 * Renewal room:
 * ROOM 5 / READOUT PREPARATION
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
 * Upstream action binding:
 * /h-earth-3d/actions/inspect-ground.js
 * H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1
 *
 * Purpose:
 * Renew the existing Drive scratch Ground Condition Read into an object-bound,
 * action-output-aware, descriptor-only readout file for
 * H_EARTH_GROUND_CELL_001.
 *
 * Room 5 authority:
 * Room 5 does not create matrix authority.
 * Room 5 does not create cell authority.
 * Room 5 does not create zone authority.
 * Room 5 does not create object authority.
 * Room 5 does not create action authority.
 * Room 5 does not execute Inspect Ground.
 * Room 5 binds Ground Condition Read to the renewed Inspect Ground action
 * output surface and prepares the lawful Room 6 receipt handoff.
 *
 * Boundary:
 * This file defines readout structure only.
 * This file does not execute gameplay.
 * This file does not persist receipts.
 * This file does not define renderer geometry.
 * This file does not create material channels.
 * This file does not create DOM/CSS/WebGL/canvas output.
 * This file does not activate lattice, traversal, gameplay, runtime, route,
 * renderer, compositor, controller, canvas, WebGL, validation, production,
 * diagnostic scoring, health scoring, survival scoring, or matrix collapse.
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

import {
  H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
  H_EARTH_INSPECT_GROUND_BOUNDARIES,
  H_EARTH_INSPECT_GROUND_TARGETS,
  H_EARTH_INSPECT_GROUND_STATE_PATH,
  H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,
  H_EARTH_INSPECT_GROUND_ACTION,
  H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
  H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,
  buildHEarthInspectGroundActionDescriptor,
  inspectGround,
  getHEarthInspectGroundTargets,
  getHEarthInspectGroundAction,
  getHEarthInspectGroundActionReceipt,
  getHEarthRoom5ReadoutBindingUnblockReceipt,
  getHEarthInspectGroundObjectAnchorBinding,
  getHEarthInspectGroundObjectBindings,
  getHEarthInspectGroundOutputModel
} from '../actions/inspect-ground.js';

export const H_EARTH_GROUND_CONDITION_READ_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  upstreamMatrixContractId:
    'H_EARTH_SOURCE_MATRIX_FILE_RENEWAL_STEP_031A_SCENE_SCOPED_LATTICE_AUTHORITY_v1',

  upstreamCellContractId:
    'H_EARTH_GROUND_CELL_001_FILE_RENEWAL_STEP_031B_CELL_TO_LATTICE_BINDING_v1',

  upstreamZoneContractId:
    'H_EARTH_GROUND_CELL_001_ZONES_FILE_RENEWAL_STEP_031C_LATTICE_ZONE_MAPPING_v1',

  upstreamObjectContractId:
    'H_EARTH_GROUND_CELL_001_OBJECTS_FILE_RENEWAL_STEP_031D_LATTICE_OBJECT_COMPRESSION_v1',

  upstreamActionContractId:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  file: '/h-earth-3d/readouts/ground-condition-read.js',
  upstreamMatrixFile: '/h-earth-3d/h-earth.matrix.js',
  upstreamCellFile: '/h-earth-3d/cells/ground-cell-001.js',
  upstreamZoneFile: '/h-earth-3d/zones/ground-cell-001.zones.js',
  upstreamObjectFile: '/h-earth-3d/objects/ground-cell-001.objects.js',
  upstreamActionFile: '/h-earth-3d/actions/inspect-ground.js',
  sourceRoot: '/h-earth-3d/',

  room: 'ROOM_5_READOUT_PREPARATION',
  upstreamRoom: 'ROOM_4_ACTIONS',
  downstreamRoom: 'ROOM_6_RECEIPTS_AND_INTEGRITY_AFTER_READOUT',

  fileClass: 'SOURCE_READOUT_BINDING_DESCRIPTOR_ONLY',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  baselinePreserved: Object.freeze({
    driveScratchBaselineConsumed: true,
    baselineReadoutExportPreserved: true,
    baselineDefaultExportPreserved: true,
    baselineReadoutTypePreserved: true,
    baselineOutputReceiptPreserved: true,
    baselinePrimaryFocusTargetPreserved: true,
    baselineSupportingTargetsPreserved: true,
    baselineObservationCategoriesPreserved: true,
    baselineMatrixSeparationPreserved: true,
    baselineDeferredClaimStatusPreserved: true,
    baselineNoRuntimeResultPreserved: true,
    baselineNoRendererResultPreserved: true,
    baselineNoVisualPassPreserved: true,
    baselineNoValidationPreserved: true,
    baselineNoOpenWorldScanPreserved: true,
    baselineNoSurvivalSimulationPreserved: true,
    baselineNoSwimmingPreserved: true,
    baselineNoFluidSimulationPreserved: true,
    baselineNoProductionReadinessPreserved: true,
    baselineNoMatrixCollapsePreserved: true
  }),

  renewalPurpose:
    'Bind Ground Condition Read to the renewed Inspect Ground action, Room 3 object compression, zone map, cell binding, and matrix source authority without creating runtime execution, renderer facts, diagnostic scoring, validation, production, or receipt persistence.',

  renewalScope: Object.freeze({
    upstreamMatrixAuthorityConsumed: true,
    upstreamCellLatticeBindingConsumed: true,
    upstreamZoneMappingConsumed: true,
    upstreamObjectCompressionConsumedCautiously: true,
    upstreamInspectGroundActionConsumed: true,
    actionOutputSurfaceConsumed: true,
    primaryReadoutObjectBound: true,
    supportingReadoutObjectsBound: true,
    surfaceTransitionContextBound: true,
    waterAirContextBoundariesPreserved: true,
    hearthContextBoundaryPreserved: true,
    audraliaContextBoundaryPreserved: true,
    readoutPayloadTemplateDefined: true,
    descriptorBuilderDefined: true,
    receiptHandoffPrepared: true,

    sourceLatticeAuthorityCreatedHere: false,
    activeCellBindingCreatedHere: false,
    zoneAuthorityCreatedHere: false,
    objectAuthorityCreatedHere: false,
    actionAuthorityCreatedHere: false,
    receiptAuthorityCreatedHere: false,
    full256AddressEnumerationAdded: false,
    materialChannelMappingAdded: false,
    rendererGeometryAdded: false,
    assetLoadingAdded: false,
    gameplayExecutionAdded: false,
    runtimeActionExecutionAdded: false,
    runtimeReadoutExecutionAdded: false,
    routeExposureAdded: false,
    receiptRuntimePersistenceAdded: false,
    validationAdded: false,
    productionAdded: false
  }),

  archiveExpectation: Object.freeze({
    expectedArchiveTitle:
      'ground-condition-read_BACKUP_2026-07-08_STEP_031F',
    googleNativeArchiveRequiredForNetworkCompletion: true,
    finalMarkerRequired:
      'export default H_EARTH_GROUND_CONDITION_READ_AGGREGATE;',
    networkCompleteUntilArchivedAndVerified: false
  })
});

export const H_EARTH_GROUND_CONDITION_READ_BOUNDARIES = Object.freeze({
  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',
  descriptorOnlyReadoutAuthority: true,
  objectBoundReadoutAuthority: true,
  actionOutputAwareReadoutAuthority: true,
  cellLatticeConsumed: true,
  zoneMappingConsumed: true,
  objectCompressionConsumed: true,
  inspectGroundActionConsumed: true,

  rawDriveScratchFileOnly: false,
  renewedSourceReadoutDescriptor: true,

  sourceMatrixAuthorityCreatedHere: false,
  cellLatticeBindingCreatedHere: false,
  zoneMappingCreatedHere: false,
  objectMappingCreatedHere: false,
  actionBindingCreatedHere: false,
  receiptAuthorityCreatedHere: false,
  materialChannelMappingCreatedHere: false,
  rendererGeometryCreatedHere: false,
  renderedAssetCreatedHere: false,
  assetLoadingCreatedHere: false,
  routeExposureCreatedHere: false,

  runtimeReadoutExecutionClaim: false,
  runtimeActionExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  diagnosticScoreClaim: false,
  empiricalDiagnosisClaim: false,
  rendererStatusClaim: false,
  rendererActivationClaim: false,
  compositorActivationClaim: false,
  controllerActivationClaim: false,
  visualPassStatusClaim: false,
  validationStatusClaim: false,
  openWorldScanClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  persistentSaveLogic: false,
  receiptRuntimePersistence: false,
  routeIntegration: false,
  githubInstallation: false,

  full256AddressRuntimeClaim: false,
  full256AddressEnumerationIncludedHere: false,
  routeRuntimeCreation: false,
  routeExposureCompleted: false,

  rendererActivation: false,
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

  matrixCollapse: false
});

export const H_EARTH_GROUND_CONDITION_READ_TARGETS = Object.freeze({
  targetModelId: 'H_EARTH_GROUND_CONDITION_READ_TARGETS',
  status: 'OBJECT_BOUND_READOUT_TARGETS_DEFINED_DESCRIPTOR_ONLY',

  primaryReadoutObject: H_EARTH_PRIMARY_INSPECTION_TARGET,

  supportingInspectionObjects: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  surfaceContextObjects: Object.freeze([
    'OBJ_003_DRY_SAND_TRANSITION'
  ]),

  waterAirContextObjects: Object.freeze([
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER'
  ]),

  hearthContextObjects: Object.freeze([
    'OBJ_009_MANOR_EXTERIOR_CONTEXT'
  ]),

  audraliaContextObjects: Object.freeze([
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  allReadoutRelevantObjects:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE
      .supportingReadoutObjects,

  readoutContextObjects:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE
      .contextReadoutObjects,

  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  targetPolicy: Object.freeze({
    primaryObjectMayAnchorReadout: true,
    supportingObjectsMayContributeReadoutContext: true,
    drySandMaySupportSurfaceTransitionContext: true,
    waterAirObjectsMaySupportEnvironmentalContextOnly: true,
    hearthObjectMaySupportSeparationContextOnly: true,
    audraliaObjectMaySupportSeparationContextOnly: true,

    waterAirObjectsMayBecomeDirectActionTargets: false,
    hearthObjectMayBecomeDirectActionTarget: false,
    audraliaObjectMayBecomeDirectActionTarget: false,
    contextObjectsMayCreateTraversal: false,
    contextObjectsMayCreateSimulation: false,
    readoutMayCreateRuntimeReceipt: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL = Object.freeze({
  inputModelId: 'H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL',
  status: 'ACTION_OUTPUT_AWARE_READOUT_INPUT_DESCRIPTOR_ONLY',

  expectedReadout: 'Ground Condition Read',
  expectedReadoutId: 'H_EARTH_GROUND_CONDITION_READ',
  expectedAction: 'Inspect Ground',
  expectedActionId: 'H_EARTH_INSPECT_GROUND_ACTION',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
  currentState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,

  primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  acceptedInputKeys: Object.freeze([
    'activeMatrix',
    'activeMatrixRole',
    'activeCell',
    'sceneIdentity',
    'sourceAction',
    'sourceActionId',
    'readoutName',
    'readoutId',
    'primaryFocusTarget',
    'supportingInspectionTargets',
    'requestedReceipt',
    'actionDescriptor'
  ]),

  defaultInput: Object.freeze({
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',
    sourceAction: 'Inspect Ground',
    sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    readoutName: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    requestedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    actionDescriptor: null
  }),

  inputCreatesRuntimeExecution: false,
  inputCreatesGameplayExecution: false,
  inputCreatesRouteMutation: false,
  inputCreatesRendererState: false,
  inputCreatesReceiptPersistence: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL = Object.freeze({
  observationModelId: 'H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL',
  status: 'BOUNDED_ENVIRONMENTAL_OBSERVATION_CATEGORIES_DEFINED_DESCRIPTOR_ONLY',

  observationCategories: Object.freeze({
    surface: Object.freeze([
      'wet-sand-surface',
      'dry-sand-transition',
      'local-footing-context'
    ]),

    moisture: Object.freeze([
      'tide-pool-presence',
      'reflective-puddle-context',
      'shoreline-contact',
      'foam-line-context'
    ]),

    localDetail: Object.freeze([
      'small-beach-stone-context',
      'foreground-jagged-rock-context',
      'local-ground-hazard-reference'
    ]),

    waterAirContext: Object.freeze([
      'nearshore-wave-context',
      'water-surface-context-only',
      'air-haze-light-context-only'
    ]),

    matrixSeparationContext: Object.freeze([
      'hearth-support-control-context-only',
      'audralia-planetary-world-context-only',
      'matrix-collapse-remains-false'
    ])
  }),

  observationClaims: Object.freeze({
    environmentalDescriptorOnly: true,
    playerFacingReadoutTemplate: true,
    empiricalDiagnosisClaim: false,
    diagnosticScoreClaim: false,
    healthScoreClaim: false,
    survivalScoreClaim: false,
    rendererStatusClaim: false,
    weatherSimulationClaim: false,
    fluidSimulationClaim: false,
    traversalClaim: false,
    validationClaim: false,
    productionClaim: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD = Object.freeze({
  guardId: 'H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD',
  status: 'MATRIX_AND_CONTEXT_BOUNDARIES_PRESERVED_FOR_READOUT',

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,

  hEarthRole: 'Ground-View Matrix',
  hearthRole: 'support/control context only',
  audraliaRole: 'planetary-world context only',

  guardedContextObjects: Object.freeze({
    waterAirContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects,
    hearthContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects,
    audraliaContext: H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects
  }),

  prohibitions: Object.freeze({
    hearthMergedIntoHEarth: false,
    audraliaMergedIntoHEarth: false,
    mirrorManorRouteCanonNameClaim: false,
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

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function normalizeHEarthGroundConditionReadString(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function normalizeHEarthGroundConditionReadTargets(targets = []) {
  const safeTargets = Array.isArray(targets) ? targets : [];

  return Object.freeze(
    safeTargets
      .filter((target) => typeof target === 'string')
      .filter((target, index, array) => array.indexOf(target) === index)
  );
}

export function getHEarthGroundConditionReadObjectDescriptor(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;

  const objectDescriptor = getHEarthGroundCell001ObjectDescriptor(objectId);

  if (!objectDescriptor) return null;

  const zoneBinding = getHEarthGroundCell001ObjectZoneBinding(objectId);
  const addressBinding = getHEarthGroundCell001ObjectAddressBinding(objectId);
  const zoneDescriptor = zoneBinding?.zoneId
    ? getHEarthGroundCell001ZoneDescriptor(zoneBinding.zoneId)
    : null;

  return Object.freeze({
    objectId,
    objectDescriptor,
    zoneBinding,
    addressBinding,
    zoneDescriptor,

    isPrimaryReadoutObject:
      objectId === H_EARTH_GROUND_CONDITION_READ_TARGETS.primaryReadoutObject,

    isSupportingInspectionObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.supportingInspectionObjects
        .includes(objectId),

    isSurfaceContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects
        .includes(objectId),

    isWaterAirContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects
        .includes(objectId),

    isHearthContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects
        .includes(objectId),

    isAudraliaContextObject:
      H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects
        .includes(objectId),

    descriptorOnly: true,
    rendererGeometryClaim: false,
    runtimeReadoutClaim: false,
    validationClaim: false
  });
}

export function classifyHEarthGroundConditionReadObject(objectId) {
  if (objectId === H_EARTH_GROUND_CONDITION_READ_TARGETS.primaryReadoutObject) {
    return 'PRIMARY_READOUT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.supportingInspectionObjects
      .includes(objectId)
  ) {
    return 'SUPPORTING_INSPECTION_READOUT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects
      .includes(objectId)
  ) {
    return 'SURFACE_TRANSITION_CONTEXT_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects
      .includes(objectId)
  ) {
    return 'WATER_AIR_CONTEXT_ONLY_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects
      .includes(objectId)
  ) {
    return 'HEARTH_CONTEXT_ONLY_OBJECT';
  }

  if (
    H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects
      .includes(objectId)
  ) {
    return 'AUDRALIA_CONTEXT_ONLY_OBJECT';
  }

  return 'UNCLASSIFIED_READOUT_OBJECT';
}

export function buildHEarthGroundConditionReadInput(input = {}) {
  const safeInput =
    input && typeof input === 'object'
      ? input
      : Object.freeze({});

  const defaultInput = H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL.defaultInput;

  const primaryFocusTarget = normalizeHEarthGroundConditionReadString(
    safeInput.primaryFocusTarget,
    defaultInput.primaryFocusTarget
  );

  const supportingInspectionTargets =
    normalizeHEarthGroundConditionReadTargets(
      safeInput.supportingInspectionTargets ||
        defaultInput.supportingInspectionTargets
    );

  return Object.freeze({
    activeMatrix: normalizeHEarthGroundConditionReadString(
      safeInput.activeMatrix,
      defaultInput.activeMatrix
    ),
    activeMatrixRole: normalizeHEarthGroundConditionReadString(
      safeInput.activeMatrixRole,
      defaultInput.activeMatrixRole
    ),
    activeCell: normalizeHEarthGroundConditionReadString(
      safeInput.activeCell,
      defaultInput.activeCell
    ),
    sceneIdentity: normalizeHEarthGroundConditionReadString(
      safeInput.sceneIdentity,
      defaultInput.sceneIdentity
    ),
    sourceAction: normalizeHEarthGroundConditionReadString(
      safeInput.sourceAction,
      defaultInput.sourceAction
    ),
    sourceActionId: normalizeHEarthGroundConditionReadString(
      safeInput.sourceActionId,
      defaultInput.sourceActionId
    ),
    readoutName: normalizeHEarthGroundConditionReadString(
      safeInput.readoutName,
      defaultInput.readoutName
    ),
    readoutId: normalizeHEarthGroundConditionReadString(
      safeInput.readoutId,
      defaultInput.readoutId
    ),
    primaryFocusTarget,
    supportingInspectionTargets,
    requestedReceipt: normalizeHEarthGroundConditionReadString(
      safeInput.requestedReceipt,
      defaultInput.requestedReceipt
    ),
    actionDescriptor:
      safeInput.actionDescriptor && typeof safeInput.actionDescriptor === 'object'
        ? safeInput.actionDescriptor
        : null,
    descriptorOnly: true,
    runtimeExecutionClaim: false,
    receiptPersistenceClaim: false
  });
}

export function checkHEarthGroundConditionReadInput(input = {}) {
  const normalizedInput = buildHEarthGroundConditionReadInput(input);

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

    sourceActionAccepted: normalizedInput.sourceAction === 'Inspect Ground',

    sourceActionIdAccepted:
      normalizedInput.sourceActionId === 'H_EARTH_INSPECT_GROUND_ACTION',

    readoutNameAccepted:
      normalizedInput.readoutName === 'Ground Condition Read',

    readoutIdAccepted:
      normalizedInput.readoutId === 'H_EARTH_GROUND_CONDITION_READ',

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
            .map(([key]) => `GROUND_CONDITION_READ_INPUT_CHECK_FAILED:${key}`)
    ),
    descriptorOnly: true,
    runtimeExecutionClaim: false,
    validationClaim: false
  });
}

export function buildHEarthGroundConditionReadObjectBinding(objectId) {
  const descriptor = getHEarthGroundConditionReadObjectDescriptor(objectId);
  const classification = classifyHEarthGroundConditionReadObject(objectId);

  if (!descriptor) {
    return Object.freeze({
      objectId,
      bindingResolved: false,
      classification,
      descriptorOnly: true,
      validationClaim: false,
      matrixCollapse: false
    });
  }

  return Object.freeze({
    objectId,
    bindingResolved: true,
    classification,

    label: descriptor.objectDescriptor.label,
    role: descriptor.objectDescriptor.role,
    objectClass: descriptor.objectDescriptor.objectClass || null,
    layer: descriptor.objectDescriptor.layer,

    zoneId: descriptor.zoneBinding?.zoneId || null,
    secondaryZoneId: descriptor.zoneBinding?.secondaryZoneId || null,
    zoneRole: descriptor.zoneBinding?.zoneRole || null,
    primaryAddress: descriptor.addressBinding?.primaryAddress || null,
    supportingAddresses:
      descriptor.addressBinding?.supportingAddresses || Object.freeze([]),
    addressRole: descriptor.addressBinding?.addressRole || null,

    readoutContribution: Object.freeze({
      primaryReadoutAnchor:
        classification === 'PRIMARY_READOUT_OBJECT',
      supportingInspectionContext:
        classification === 'SUPPORTING_INSPECTION_READOUT_OBJECT',
      surfaceTransitionContext:
        classification === 'SURFACE_TRANSITION_CONTEXT_OBJECT',
      waterAirContextOnly:
        classification === 'WATER_AIR_CONTEXT_ONLY_OBJECT',
      hearthContextOnly:
        classification === 'HEARTH_CONTEXT_ONLY_OBJECT',
      audraliaContextOnly:
        classification === 'AUDRALIA_CONTEXT_ONLY_OBJECT'
    }),

    restrictions: Object.freeze({
      directRuntimeInspectionClaim: false,
      directActionExecutionClaim: false,
      rendererGeometryClaim: false,
      materialChannelClaim: false,
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      weatherSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      validationClaim: false,
      matrixCollapse: false
    }),

    descriptorOnly: true,
    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export const H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS = Object.freeze({
  bindingId: 'H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS',
  status: 'GROUND_CONDITION_READ_OBJECT_BINDINGS_DEFINED_DESCRIPTOR_ONLY',

  objectToReadoutReference:
    H_EARTH_GROUND_CELL_001_OBJECT_TO_READOUT_REFERENCE,

  primaryBinding:
    buildHEarthGroundConditionReadObjectBinding(H_EARTH_PRIMARY_INSPECTION_TARGET),

  supportingInspectionBindings: Object.freeze(
    H_EARTH_SUPPORTING_INSPECTION_TARGETS.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  surfaceContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.surfaceContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  waterAirContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.waterAirContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  hearthContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.hearthContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  audraliaContextBindings: Object.freeze(
    H_EARTH_GROUND_CONDITION_READ_TARGETS.audraliaContextObjects.map((objectId) =>
      buildHEarthGroundConditionReadObjectBinding(objectId)
    )
  ),

  readoutPayloadDefinedHere: true,
  actionExecutionDefinedHere: false,
  receiptPersistenceDefinedHere: false,
  rendererGeometryDefinedHere: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE = Object.freeze({
  payloadTemplateId: 'H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE',
  status: 'DESCRIPTOR_ONLY_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE_DEFINED',

  readoutType: 'Ground Condition Read',
  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',
  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',

  requiredFields: Object.freeze([
    'readoutType',
    'readoutId',
    'activeMatrix',
    'activeMatrixRole',
    'activeCell',
    'sceneIdentity',
    'sourceAction',
    'primaryFocusTarget',
    'surfaceCondition',
    'moistureCondition',
    'localDetailCondition',
    'waterAirContext',
    'matrixSeparationContext',
    'deferredClaims',
    'receiptHandoff'
  ]),

  defaultSurfaceCondition: Object.freeze({
    primarySurface: 'foreground wet sand',
    surfaceState: 'wet local ground surface descriptor',
    dryTransitionPresent: true,
    footingDescriptor: 'local ground inspection context only',
    traversalClaim: false,
    validationClaim: false
  }),

  defaultMoistureCondition: Object.freeze({
    tidePoolsPresent: true,
    reflectivePuddlesPresent: true,
    shorelineFoamLinePresent: true,
    waterContactContextPresent: true,
    fluidSimulationClaim: false,
    swimmingClaim: false,
    validationClaim: false
  }),

  defaultLocalDetailCondition: Object.freeze({
    smallBeachStonesPresent: true,
    foregroundJaggedRocksPresent: true,
    localHazardReferenceOnly: true,
    physicsClaim: false,
    collisionClaim: false,
    validationClaim: false
  }),

  defaultWaterAirContext: Object.freeze({
    nearshoreWaveBandContext: true,
    waterSurfaceContextOnly: true,
    airHazeLightContextOnly: true,
    waterTraversalAuthorized: false,
    swimmingAuthorized: false,
    fluidSimulationAuthorized: false,
    weatherSimulationAuthorized: false,
    validationClaim: false
  }),

  defaultMatrixSeparationContext: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    hearthMergedIntoHEarth: false,
    audraliaMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    distantTraversalAuthorized: false,
    matrixCollapse: false
  }),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function buildHEarthGroundConditionReadDescriptor(input = {}) {
  const inputCheck = checkHEarthGroundConditionReadInput(input);

  const actionDescriptor =
    inputCheck.input.actionDescriptor ||
    buildHEarthInspectGroundActionDescriptor({
      activeMatrix: inputCheck.input.activeMatrix,
      activeMatrixRole: inputCheck.input.activeMatrixRole,
      activeCell: inputCheck.input.activeCell,
      sceneIdentity: inputCheck.input.sceneIdentity,
      userAction: inputCheck.input.sourceAction,
      actionId: inputCheck.input.sourceActionId,
      primaryFocusTarget: inputCheck.input.primaryFocusTarget,
      supportingInspectionTargets:
        inputCheck.input.supportingInspectionTargets,
      requestedReadout: inputCheck.input.readoutName,
      requestedReceipt: inputCheck.input.requestedReceipt
    });

  return Object.freeze({
    descriptorType: 'H_EARTH_GROUND_CONDITION_READ_DESCRIPTOR',
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    readoutRole: 'FIRST_GROUND_VIEW_READOUT',
    readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',

    activeMatrix: inputCheck.input.activeMatrix,
    activeMatrixRole: inputCheck.input.activeMatrixRole,
    activeCell: inputCheck.input.activeCell,
    sceneIdentity: inputCheck.input.sceneIdentity,

    sourceAction: inputCheck.input.sourceAction,
    sourceActionId: inputCheck.input.sourceActionId,
    sourceActionDescriptor: actionDescriptor,
    sourceActionReceipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,

    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    currentState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,

    primaryFocusTarget: inputCheck.input.primaryFocusTarget,
    primaryObjectBinding:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS.primaryBinding,

    supportingInspectionTargets:
      inputCheck.input.supportingInspectionTargets,

    supportingObjectBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .supportingInspectionBindings,

    surfaceContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .surfaceContextBindings,

    waterAirContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .waterAirContextBindings,

    hearthContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .hearthContextBindings,

    audraliaContextBindings:
      H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS
        .audraliaContextBindings,

    observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,

    surfaceCondition:
      H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
        .defaultSurfaceCondition,

    moistureCondition:
      H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
        .defaultMoistureCondition,

    localDetailCondition:
      H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
        .defaultLocalDetailCondition,

    waterAirContext:
      H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
        .defaultWaterAirContext,

    matrixSeparationContext:
      H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE
        .defaultMatrixSeparationContext,

    contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,

    deferredClaims: Object.freeze({
      runtimeReadoutExecutionClaim: false,
      runtimeActionExecutionClaim: false,
      gameplayExecutionClaim: false,
      rendererStatusClaim: false,
      rendererActivationClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      empiricalDiagnosisClaim: false,
      diagnosticScoreClaim: false,
      healthScoreClaim: false,
      survivalScoreClaim: false,
      openWorldScanClaim: false,
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      weatherSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      receiptPersistenceClaim: false,
      matrixCollapse: false
    }),

    receiptHandoff: Object.freeze({
      expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      receiptAuthorityCreatedHere: false,
      receiptRuntimePersistenceCreatedHere: false,
      room6ReceiptMayProceedAfterReadout: true,
      requiredRoom6ReceiptAuthority:
        '/h-earth-3d/h-earth.receipts.js or dedicated receipt renewal authority'
    }),

    inputCheck,
    readoutDescriptorReady: inputCheck.passed === true,
    descriptorOnly: true,
    runtimeReadoutExecutionClaim: false,
    receiptPersistenceCreatedHere: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export function getHEarthGroundConditionReadForObject(objectId, input = {}) {
  const objectBinding = buildHEarthGroundConditionReadObjectBinding(objectId);
  const descriptor = buildHEarthGroundConditionReadDescriptor(input);

  return Object.freeze({
    objectId,
    objectBinding,
    classification: classifyHEarthGroundConditionReadObject(objectId),
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    sourceAction: 'Inspect Ground',
    primaryDescriptor: descriptor,
    objectReadoutResolved: objectBinding.bindingResolved === true,
    descriptorOnly: true,
    runtimeReadoutExecutionClaim: false,
    rendererStatusClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

/**
 * Contract-only readout descriptor builder.
 * This does not activate runtime and does not persist a receipt.
 */
export function groundConditionRead(input = {}) {
  const descriptor = buildHEarthGroundConditionReadDescriptor(input);

  return Object.freeze({
    readoutResultType:
      'H_EARTH_GROUND_CONDITION_READ_CONTRACT_DESCRIPTOR_RESULT',
    readoutType: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    sourceAction: 'Inspect Ground',
    sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',

    descriptor,

    receiptHandoff: descriptor.receiptHandoff,

    dryRunCompatibleActionResult: inspectGround({
      activeMatrix: descriptor.activeMatrix,
      activeMatrixRole: descriptor.activeMatrixRole,
      activeCell: descriptor.activeCell,
      sceneIdentity: descriptor.sceneIdentity,
      userAction: descriptor.sourceAction,
      actionId: descriptor.sourceActionId,
      primaryFocusTarget: descriptor.primaryFocusTarget,
      supportingInspectionTargets: descriptor.supportingInspectionTargets,
      requestedReadout: 'Ground Condition Read',
      requestedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
    }),

    descriptorOnly: true,
    readoutExecutedAtRuntime: false,
    gameplayExecuted: false,
    routeIntegrated: false,
    runtimeActivated: false,
    rendererActivated: false,
    compositorActivated: false,
    controllerActivated: false,
    canvasActivated: false,
    webglActivated: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    openWorldClaim: false,
    traversalClaim: false,
    survivalSimulationClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
  });
}

export const H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL = Object.freeze({
  outputModelId: 'H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL',
  status: 'RECEIPT_HANDOFF_DESCRIPTOR_ONLY',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',

  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  sourceActionLabel: 'Inspect Ground',

  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  outputReceiptFile: '/h-earth-3d/h-earth.receipts.js',
  outputReceiptRuntimePersistenceDefinedHere: false,

  expectedReceiptShape: Object.freeze({
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    activeMatrix: 'H-Earth',
    activeMatrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    previousState: H_EARTH_INSPECT_GROUND_STATE_PATH.previousState,
    newState: H_EARTH_INSPECT_GROUND_STATE_PATH.newState,
    userAction: 'Inspect Ground',
    terrainReadout: 'Ground Condition Read',
    primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
    supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
    matrixSeparationPreserved: true,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  }),

  createsReadoutDescriptorHere: true,
  persistsReceiptHere: false,
  createsRuntimeResultHere: false,
  routeOutputClaim: false,
  validationClaim: false,

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_GROUND_CONDITION_READ = Object.freeze({
  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  sourceActionObject: H_EARTH_INSPECT_GROUND_ACTION,

  primaryFocusTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',
  contract: H_EARTH_GROUND_CONDITION_READ_CONTRACT,
  boundaries: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,
  targets: H_EARTH_GROUND_CONDITION_READ_TARGETS,
  inputModel: H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL,
  objectBindings: H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS,
  observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,
  payloadTemplate: H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE,
  contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,
  outputModel: H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,

  descriptorBuilder: buildHEarthGroundConditionReadDescriptor,
  readoutFunction: groundConditionRead,

  readoutPayloadDefinedHere: true,
  readoutPayloadClass: 'CONTRACT_ONLY_DESCRIPTOR_READOUT',
  runtimeReadoutExecutionClaim: false,
  gameplayExecutionClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  diagnosticScoreClaim: false,
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

export const H_EARTH_GROUND_CONDITION_READ_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_GROUND_CONDITION_READ_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  file: '/h-earth-3d/readouts/ground-condition-read.js',
  room: 'ROOM_5_READOUT_PREPARATION',

  status:
    'GROUND_CONDITION_READ_RENEWED_FROM_DRIVE_SCRATCH_AND_BOUND_TO_INSPECT_GROUND_OUTPUT_DESCRIPTOR_ONLY',

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
  upstreamActionFile: '/h-earth-3d/actions/inspect-ground.js',
  upstreamActionContract:
    'H_EARTH_INSPECT_GROUND_ACTION_FILE_RENEWAL_STEP_031E_OBJECT_ANCHOR_BINDING_v1',

  upstreamMatrixReceipt: getHEarthMatrixReceipt(),
  upstreamCellReceipt: getHEarthGroundCell001Receipt(),
  upstreamRoom3UnblockReceipt: getHEarthRoom3UnblockReceipt(),
  upstreamZonesReceipt: getHEarthGroundCell001ZonesReceipt(),
  upstreamObjectMappingUnblockReceipt:
    getHEarthRoom3ObjectMappingUnblockReceipt(),
  upstreamObjectsReceipt: getHEarthGroundCell001ObjectsReceipt(),
  upstreamRoom4ActionBindingUnblockReceipt:
    getHEarthRoom4ActionBindingUnblockReceipt(),
  upstreamActionReceipt: getHEarthInspectGroundActionReceipt(),
  upstreamRoom5ReadoutBindingUnblockReceipt:
    getHEarthRoom5ReadoutBindingUnblockReceipt(),

  step031DObjectArchiveStatus: Object.freeze({
    sourceArchivePartialNotFinal: true,
    finalExportMarkerVerified: false,
    networkComplete: false,
    objectContextSufficientToProceedWithCaution: true
  }),

  driveScratchBaselineConsumed: true,
  baselineReadoutExportPreserved: true,
  baselineDefaultExportPreserved: true,
  baselineNoRuntimeRendererVisualValidationClaimsPreserved: true,

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',
  readoutScope: 'BOUNDED_ENVIRONMENTAL_GROUND_CONDITION_READ_ONLY',

  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  expectedReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
  currentState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',

  sourceLatticeAuthorityConsumed: true,
  sourceLatticeAuthorityCreatedHere: false,
  cellLatticeBindingConsumed: true,
  cellLatticeBindingCreatedHere: false,
  zoneMappingConsumed: true,
  zoneMappingCreatedHere: false,
  objectCompressionConsumed: true,
  objectCompressionCreatedHere: false,
  actionBindingConsumed: true,
  actionBindingCreatedHere: false,

  latticeShape: '16x16',
  rowCount: 16,
  columnCount: 16,
  addressCount: 256,
  addressFormat: 'H_EARTH_GROUND_CELL_001:R{row}:C{column}',

  readoutTargetsDefined: true,
  primaryReadoutObjectBound: true,
  supportingReadoutObjectsBound: true,
  surfaceTransitionContextBound: true,
  waterAirContextBound: true,
  hearthContextBound: true,
  audraliaContextBound: true,
  objectBindingsDefined: true,
  observationModelDefined: true,
  payloadTemplateDefined: true,
  descriptorBuilderDefined: true,
  receiptHandoffPrepared: true,
  contextGuardDefined: true,

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,
  contextObjects: H_EARTH_CONTEXT_OBJECTS,

  readoutRuntimeExecutionCompletedHere: false,
  gameplayExecutionCompletedHere: false,
  materialChannelsCompletedHere: false,
  rendererGeometryCompletedHere: false,
  assetLoadingCompletedHere: false,
  receiptPersistenceCompletedHere: false,
  routeExposureCompletedHere: false,
  validationCompletedHere: false,
  productionCompletedHere: false,

  room6ReceiptFileMayProceed: true,
  room6NextFile: '/h-earth-3d/h-earth.receipts.js',
  room6NextStep:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  routeMayProceedNow: false,
  routeHoldReason:
    'Route-side renewal remains held until source renewal chain and receipt/integrity handoff authority are complete.',

  archiveCompletionStatus: Object.freeze({
    expectedArchiveTitle:
      'ground-condition-read_BACKUP_2026-07-08_STEP_031F',
    googleNativeArchivePresent: false,
    sourceBodyPopulated: true,
    finalMarkerVerified: false,
    fetchReadbackVerified: false,
    networkComplete: false
  }),

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export const H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT',

  contractId:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  status:
    'ROOM_6_GROUND_INSPECTION_RECEIPT_BINDING_UNBLOCKED_BY_GROUND_CONDITION_READ_BINDING',

  sourceMatrixAuthorityReady: true,
  sourceLatticeAuthorityDefined: true,
  cellLatticeBindingComplete: true,
  zoneLatticeMappingComplete: true,
  objectLatticeCompressionContextSufficient: true,
  inspectGroundActionBindingComplete: true,
  groundConditionReadBindingComplete: true,
  driveScratchReadoutBaselinePreserved: true,

  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  requiredRoom6ReceiptFile:
    '/h-earth-3d/h-earth.receipts.js',

  requiredRoom6ReceiptStep:
    'H_EARTH_RECEIPTS_FILE_RENEWAL_STEP_031G_GROUND_INSPECTION_RECEIPT_BINDING_v1',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  sourceActionLabel: 'Inspect Ground',

  primaryInspectionTarget: H_EARTH_PRIMARY_INSPECTION_TARGET,
  supportingInspectionTargets: H_EARTH_SUPPORTING_INSPECTION_TARGETS,

  room6ReceiptFileAllowedWork: Object.freeze([
    'bind H_EARTH_GROUND_INSPECTION_RECEIPT to Inspect Ground',
    'bind H_EARTH_GROUND_INSPECTION_RECEIPT to Ground Condition Read',
    'consume descriptor-only readout handoff',
    'preserve matrix separation',
    'preserve all no-runtime, no-renderer, no-validation, no-production claims',
    'prepare integrity harness handoff'
  ]),

  room6ReceiptFileNotAuthorized: Object.freeze([
    'create runtime receipt persistence',
    'create route receipt persistence',
    'create gameplay execution',
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
    'H_EARTH_GROUND_CONDITION_READ',
    'H_EARTH_GROUND_CONDITION_READ_RECEIPT',
    'H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT',
    'groundConditionRead',
    'buildHEarthGroundConditionReadDescriptor',
    'getHEarthGroundConditionReadReceipt'
  ]),

  boundary: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES
});

export function getHEarthGroundConditionReadTargets() {
  return H_EARTH_GROUND_CONDITION_READ_TARGETS;
}

export function getHEarthGroundConditionRead() {
  return H_EARTH_GROUND_CONDITION_READ;
}

export function getHEarthGroundConditionReadReceipt() {
  return H_EARTH_GROUND_CONDITION_READ_RECEIPT;
}

export function getHEarthRoom6ReceiptBindingUnblockReceipt() {
  return H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT;
}

export function getHEarthGroundConditionReadObjectBindings() {
  return H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS;
}

export function getHEarthGroundConditionReadOutputModel() {
  return H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL;
}

export const H_EARTH_GROUND_CONDITION_READ_AGGREGATE = Object.freeze({
  id: 'H_EARTH_GROUND_CONDITION_READ_AGGREGATE',
  file: '/h-earth-3d/readouts/ground-condition-read.js',
  room: 'ROOM_5_READOUT_PREPARATION',
  step:
    'H_EARTH_GROUND_CONDITION_READ_FILE_RENEWAL_STEP_031F_OBJECT_READOUT_BINDING_v1',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  readoutLabel: 'Ground Condition Read',
  readoutRole: 'FIRST_GROUND_VIEW_READOUT',

  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  contract: H_EARTH_GROUND_CONDITION_READ_CONTRACT,

  baselinePreserved: Object.freeze({
    H_EARTH_GROUND_CONDITION_READ
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

  upstreamActionContract: H_EARTH_INSPECT_GROUND_ACTION_CONTRACT,
  upstreamActionBoundaries: H_EARTH_INSPECT_GROUND_BOUNDARIES,
  upstreamActionTargets: H_EARTH_INSPECT_GROUND_TARGETS,
  upstreamActionStatePath: H_EARTH_INSPECT_GROUND_STATE_PATH,
  upstreamActionInputModel: H_EARTH_INSPECT_GROUND_INPUT_MODEL,
  upstreamActionTargetModel: H_EARTH_INSPECT_GROUND_TARGET_MODEL,
  upstreamActionObjectAnchorBinding:
    H_EARTH_INSPECT_GROUND_OBJECT_ANCHOR_BINDING,
  upstreamActionObjectBindings:
    H_EARTH_INSPECT_GROUND_OBJECT_BINDINGS,
  upstreamActionOutputModel: H_EARTH_INSPECT_GROUND_OUTPUT_MODEL,
  upstreamActionDryRunModel: H_EARTH_INSPECT_GROUND_DRY_RUN_MODEL,
  upstreamActionContextGuard: H_EARTH_INSPECT_GROUND_CONTEXT_GUARD,
  upstreamAction: H_EARTH_INSPECT_GROUND_ACTION,
  upstreamActionReceipt: H_EARTH_INSPECT_GROUND_ACTION_RECEIPT,
  upstreamRoom5ReadoutBindingUnblockReceipt:
    H_EARTH_ROOM_5_READOUT_BINDING_UNBLOCK_RECEIPT,

  targets: H_EARTH_GROUND_CONDITION_READ_TARGETS,
  inputModel: H_EARTH_GROUND_CONDITION_READ_INPUT_MODEL,
  objectBindings: H_EARTH_GROUND_CONDITION_READ_OBJECT_BINDINGS,
  observationModel: H_EARTH_GROUND_CONDITION_READ_OBSERVATION_MODEL,
  payloadTemplate: H_EARTH_GROUND_CONDITION_READ_PAYLOAD_TEMPLATE,
  contextGuard: H_EARTH_GROUND_CONDITION_READ_CONTEXT_GUARD,
  outputModel: H_EARTH_GROUND_CONDITION_READ_OUTPUT_MODEL,

  readout: H_EARTH_GROUND_CONDITION_READ,
  receipt: H_EARTH_GROUND_CONDITION_READ_RECEIPT,
  room6ReceiptBindingUnblockReceipt:
    H_EARTH_ROOM_6_RECEIPT_BINDING_UNBLOCK_RECEIPT,

  matrixSeparation: H_EARTH_MATRIX_SEPARATION,
  boundaryFlags: H_EARTH_GROUND_CONDITION_READ_BOUNDARIES,

  normalizeHEarthGroundConditionReadString,
  normalizeHEarthGroundConditionReadTargets,
  getHEarthGroundConditionReadObjectDescriptor,
  classifyHEarthGroundConditionReadObject,
  buildHEarthGroundConditionReadInput,
  checkHEarthGroundConditionReadInput,
  buildHEarthGroundConditionReadObjectBinding,
  buildHEarthGroundConditionReadDescriptor,
  getHEarthGroundConditionReadForObject,
  groundConditionRead,
  getHEarthGroundConditionReadTargets,
  getHEarthGroundConditionRead,
  getHEarthGroundConditionReadReceipt,
  getHEarthRoom6ReceiptBindingUnblockReceipt,
  getHEarthGroundConditionReadObjectBindings,
  getHEarthGroundConditionReadOutputModel,

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

// FINAL MARKER — STEP 031F
export default H_EARTH_GROUND_CONDITION_READ_AGGREGATE;
