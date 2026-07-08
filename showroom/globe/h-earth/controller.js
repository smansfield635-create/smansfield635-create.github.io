// /showroom/globe/h-earth/controller.js
// RENEWED FILE
// H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1
//
// Renews:
// H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027_v1
//
// Purpose:
// Defines the deterministic non-rendering H-Earth 3D Candidate Preview
// controller / route bridge descriptor layer.
//
// Renewal scope:
// - Remove unused resolveCandidateRenderNodes import.
// - Narrow secondary surface context to OBJ_003_DRY_SAND_TRANSITION.
// - Separate water/atmospheric context targets.
// - Split Hearth and Audralia context-only targets.
// - Expand contextOnlyTargets to match upstream capacity contextOnly flags.
// - Constrain Ground Condition Read bridge support.
// - Preserve water/air context boundaries.
// - Preserve all non-activation and no-claim boundaries.
//
// This file does not install a route, mutate GitHub, activate runtime,
// touch DOM, mount a renderer, activate WebGL/canvas, claim renderer pass,
// claim visual pass, claim validation, claim production, authorize traversal,
// authorize survival simulation, authorize swimming/fluid simulation,
// authorize manor interior, authorize distant traversal, or collapse matrices.

import {
  H_EARTH_3D_CAPACITY,
  H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
  H_EARTH_3D_INSPECTION_RADIUS_MODEL,
  H_EARTH_3D_INSPECTION_ANCHORS,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  H_EARTH_3D_DOWNSTREAM_CONSUMPTION,
  getObjectCapacityReference,
  getInspectionRadius,
  getInspectionAnchor,
  getCapacityReceipt
} from './capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
  H_EARTH_3D_ENVIRONMENT_RECEIPT,
  getResolvedEnvironmentObject,
  getEnvironmentReceipt
} from './environment.js';

import {
  H_EARTH_3D_RENDERER,
  H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  H_EARTH_3D_RENDERER_RECEIPT,
  H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL,
  getRendererReceipt
} from './renderer.js';

import {
  H_EARTH_3D_COMPOSITOR,
  H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  H_EARTH_3D_COMPOSITOR_RECEIPT,
  H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
  getCompositorReceipt
} from './compositor.js';

export const H_EARTH_3D_CONTROLLER_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1',
  renewedFrom: 'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027_v1',

  upstreamCapacityContractId: 'H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1',
  upstreamEnvironmentContractId:
    'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1',
  upstreamRendererContractId: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',
  upstreamCompositorContractId:
    'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025A_RENEWAL_CLEANUP_PACKET_v1',

  file: '/showroom/globe/h-earth/controller.js',
  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamCompositorFile: '/showroom/globe/h-earth/compositor.js',

  status: 'DETERMINISTIC_CONTROLLER_ROUTE_BRIDGE_DEFINED_NON_ACTIVATING_RENEWED',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  createdFor: 'H_EARTH_3D_CANDIDATE_PREVIEW',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  consumes: Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/showroom/globe/h-earth/environment.js',
    '/showroom/globe/h-earth/renderer.js',
    '/showroom/globe/h-earth/compositor.js'
  ]),

  mayBeConsumedBy: Object.freeze([
    '/showroom/globe/h-earth/index.js',
    '/showroom/globe/h-earth/route-shell',
    '/showroom/globe/h-earth/bootstrap'
  ]),

  renewalScope: Object.freeze({
    unusedResolveCandidateRenderNodesImportRemoved: true,
    secondarySurfaceContextTargetsNarrowed: true,
    waterAtmosphericContextTargetsSeparated: true,
    hearthContextTargetsSeparated: true,
    audraliaContextTargetsSeparated: true,
    contextOnlyTargetsExpandedToMatchCapacity: true,
    groundConditionReadSupportConstrained: true,
    waterAirContextBoundariesPreserved: true,
    redesignClaim: false
  }),

  controllerPosture: Object.freeze({
    controllerType: 'non-rendering controller-route bridge descriptor',
    definesSelectableTargetRegistry: true,
    definesInspectionActionRouting: true,
    definesGroundConditionReadBridge: true,
    definesGroundInspectionReceiptBridge: true,
    definesContextOnlyBlockResponses: true,
    definesSecondarySurfaceContextResponses: true,
    definesWaterAtmosphericContextResponses: true,
    definesComposedFrameSelectionReferences: true,
    definesBootstrapExpectations: true,

    installsRouteInThisFile: false,
    mutatesGitHubInThisFile: false,
    activatesRuntimeInThisFile: false,
    touchesDomInThisFile: false,
    mountsRendererInThisFile: false,
    activatesCanvasInThisFile: false,
    activatesWebGLInThisFile: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  }),

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  }),

  boundaryClaims: Object.freeze({
    doesNotInstallGitHub: true,
    doesNotModifyRepository: true,
    doesNotInstallRoute: true,
    doesNotActivateRuntime: true,
    doesNotTouchDom: true,
    doesNotMountRenderer: true,
    doesNotActivateCanvas: true,
    doesNotActivateWebGL: true,
    doesNotClaimRendererPass: true,
    doesNotClaimVisualPass: true,
    doesNotClaimValidation: true,
    doesNotClaimProduction: true,
    doesNotClaimOpenWorldTraversal: true,
    doesNotClaimSwimming: true,
    doesNotClaimFluidSimulation: true,
    doesNotClaimSurvivalSimulation: true,
    doesNotClaimManorInteriorAccess: true,
    doesNotClaimDistantTraversal: true,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS = Object.freeze({
  controllerDescriptorOnly: true,
  routeBridgeDescriptorOnly: true,
  directDomMutation: false,
  routeInstallation: false,
  routeIntegration: false,
  runtimeActivation: false,
  rendererMount: false,
  rendererActivation: false,
  canvasActivation: false,
  webglActivation: false,

  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  openWorldTraversalClaim: false,
  survivalSimulationClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,

  freeFlightClaim: false,
  walkClaim: false,
  routeNavigationClaim: false,
  controllerActivationClaim: false,
  gameplayExecutionClaim: false,

  physicsClaim: false,
  collisionClaim: false,
  persistentSaveClaim: false,
  empiricalDiagnosisClaim: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,

  matrixCollapse: false
});

export const H_EARTH_3D_CONTROLLER_INPUTS = Object.freeze({
  capacity: Object.freeze({
    aggregate: H_EARTH_3D_CAPACITY,
    objectCapacityReferences: H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
    inspectionRadiusModel: H_EARTH_3D_INSPECTION_RADIUS_MODEL,
    inspectionAnchors: H_EARTH_3D_INSPECTION_ANCHORS,
    forbiddenCapabilityFlags: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
    downstreamConsumption: H_EARTH_3D_DOWNSTREAM_CONSUMPTION,
    receipt: getCapacityReceipt()
  }),

  environment: Object.freeze({
    aggregate: H_EARTH_3D_ENVIRONMENT,
    resolvedObjects: H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
    resolvedZones: H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
    receipt: H_EARTH_3D_ENVIRONMENT_RECEIPT
  }),

  renderer: Object.freeze({
    aggregate: H_EARTH_3D_RENDERER,
    candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
    renderBoundaryFlags: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
    inspectionAffordanceModel: H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL,
    receipt: H_EARTH_3D_RENDERER_RECEIPT
  }),

  compositor: Object.freeze({
    aggregate: H_EARTH_3D_COMPOSITOR,
    composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
    compositionBoundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
    receipt: H_EARTH_3D_COMPOSITOR_RECEIPT
  }),

  boundary: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
});

export const H_EARTH_3D_INSPECTION_TARGET_MODEL = Object.freeze({
  id: 'H_EARTH_3D_INSPECTION_TARGET_MODEL',

  primaryInspectionTarget: 'OBJ_002_FOREGROUND_WET_SAND',

  supportingInspectionTargets: Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]),

  secondarySurfaceContextTargets: Object.freeze([
    'OBJ_003_DRY_SAND_TRANSITION'
  ]),

  waterAtmosphericContextTargets: Object.freeze([
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER'
  ]),

  hearthContextTargets: Object.freeze([
    'OBJ_009_MANOR_EXTERIOR_CONTEXT'
  ]),

  audraliaContextTargets: Object.freeze([
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  contextOnlyTargets: Object.freeze([
    'OBJ_006_NEARSHORE_WAVE_BAND',
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  boundary: Object.freeze({
    selectionDoesNotExecuteRuntime: true,
    inspectionBridgeDoesNotCreateReceiptAtRuntime: true,
    contextOnlyTargetsDoNotBecomeInspectionTargets: true,
    waterAtmosphericContextDoesNotBecomeSecondarySurfaceContext: true,
    secondarySurfaceContextDoesNotBecomeTraversal: true,
    visualPassClaim: false,
    validationClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES = Object.freeze({
  ENTER_MANOR_INTERIOR: Object.freeze({
    behaviorId: 'ENTER_MANOR_INTERIOR',
    responseType: 'BLOCKED_BY_CONTEXT_ONLY_BOUNDARY',
    message: 'Manor exterior is Hearth support/control context only. Manor interior access is not authorized.',
    relatedObjectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    allowedAlternative: 'Inspect Ground',
    manorInteriorAccessClaim: false,
    traversalClaim: false,
    matrixCollapse: false
  }),

  TRAVERSE_DISTANT_WORLD: Object.freeze({
    behaviorId: 'TRAVERSE_DISTANT_WORLD',
    responseType: 'BLOCKED_BY_AUDRALIA_CONTEXT_BOUNDARY',
    message:
      'Distant world context remains Audralia planetary-world context only. Distant traversal is not authorized.',
    relatedObjectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    allowedAlternative: 'Inspect Ground',
    distantTraversalClaim: false,
    openWorldTraversalClaim: false,
    matrixCollapse: false
  }),

  SWIM: Object.freeze({
    behaviorId: 'SWIM',
    responseType: 'BLOCKED_BY_WATER_CONTEXT_BOUNDARY',
    message: 'Water surface context does not authorize swimming.',
    relatedObjectId: 'OBJ_007_WATER_SURFACE_PLANE',
    allowedAlternative: 'Inspect Ground',
    swimmingClaim: false,
    fluidSimulationClaim: false,
    waterTraversalClaim: false,
    matrixCollapse: false
  }),

  ACTIVATE_FLUID_SIMULATION: Object.freeze({
    behaviorId: 'ACTIVATE_FLUID_SIMULATION',
    responseType: 'BLOCKED_BY_NON_SIMULATION_BOUNDARY',
    message: 'Water, wave, shoreline, and wetness descriptors do not activate fluid simulation.',
    allowedAlternative: 'Inspect Ground',
    fluidSimulationClaim: false,
    swimmingClaim: false,
    validationClaim: false,
    matrixCollapse: false
  }),

  ACTIVATE_WEATHER_ENGINE: Object.freeze({
    behaviorId: 'ACTIVATE_WEATHER_ENGINE',
    responseType: 'BLOCKED_BY_ATMOSPHERIC_CONTEXT_BOUNDARY',
    message: 'Air haze and light layer descriptors do not activate a weather or atmospheric simulation engine.',
    relatedObjectId: 'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    allowedAlternative: 'Inspect Ground',
    weatherEngineClaim: false,
    atmosphericSimulationClaim: false,
    traversalClaim: false,
    matrixCollapse: false
  }),

  START_OPEN_WORLD_MOVEMENT: Object.freeze({
    behaviorId: 'START_OPEN_WORLD_MOVEMENT',
    responseType: 'BLOCKED_BY_GROUND_VIEW_MATRIX_BOUNDARY',
    message: 'H-Earth is a bounded Ground-View Matrix. Open-world movement is not authorized.',
    allowedAlternative: 'Inspect Ground',
    openWorldTraversalClaim: false,
    routeNavigationClaim: false,
    matrixCollapse: false
  }),

  START_SURVIVAL_SIMULATION: Object.freeze({
    behaviorId: 'START_SURVIVAL_SIMULATION',
    responseType: 'BLOCKED_BY_NON_SURVIVAL_BOUNDARY',
    message: 'The controller bridge does not create survival simulation.',
    allowedAlternative: 'Inspect Ground',
    survivalSimulationClaim: false,
    survivalScoreClaim: false,
    healthScoreClaim: false,
    matrixCollapse: false
  }),

  ACTIVATE_RENDERER: Object.freeze({
    behaviorId: 'ACTIVATE_RENDERER',
    responseType: 'BLOCKED_BY_CONTROLLER_LANE_BOUNDARY',
    message: 'Controller descriptors do not activate or mount the renderer.',
    rendererActivationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    matrixCollapse: false
  }),

  MOUNT_CANVAS: Object.freeze({
    behaviorId: 'MOUNT_CANVAS',
    responseType: 'BLOCKED_BY_NON_CANVAS_BOUNDARY',
    message: 'Canvas mounting is not authorized by controller.js.',
    canvasActivationClaim: false,
    webglActivationClaim: false,
    rendererActivationClaim: false,
    matrixCollapse: false
  }),

  ACTIVATE_WEBGL: Object.freeze({
    behaviorId: 'ACTIVATE_WEBGL',
    responseType: 'BLOCKED_BY_NON_WEBGL_BOUNDARY',
    message: 'WebGL activation is not authorized by controller.js.',
    webglActivationClaim: false,
    canvasActivationClaim: false,
    rendererActivationClaim: false,
    matrixCollapse: false
  }),

  CLAIM_VISUAL_PASS: Object.freeze({
    behaviorId: 'CLAIM_VISUAL_PASS',
    responseType: 'BLOCKED_BY_NO_VISUAL_PASS_BOUNDARY',
    message: 'No visual pass is claimed by this controller descriptor.',
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  }),

  CLAIM_VALIDATION: Object.freeze({
    behaviorId: 'CLAIM_VALIDATION',
    responseType: 'BLOCKED_BY_NO_VALIDATION_BOUNDARY',
    message: 'No validation is claimed by this controller descriptor.',
    validationClaim: false,
    visualPassClaim: false,
    productionClaim: false,
    matrixCollapse: false
  }),

  CLAIM_PRODUCTION_READY: Object.freeze({
    behaviorId: 'CLAIM_PRODUCTION_READY',
    responseType: 'BLOCKED_BY_NO_PRODUCTION_BOUNDARY',
    message: 'No production readiness is claimed by this controller descriptor.',
    productionClaim: false,
    deploymentClaim: false,
    validationClaim: false,
    matrixCollapse: false
  }),

  COLLAPSE_MATRICES: Object.freeze({
    behaviorId: 'COLLAPSE_MATRICES',
    responseType: 'BLOCKED_BY_MATRIX_SEPARATION_BOUNDARY',
    message:
      'H-Earth remains Ground-View Matrix; Hearth remains support/control context only; Audralia remains planetary-world context only.',
    hEarthRole: 'Ground-View Matrix',
    hearthRole: 'support/control context only',
    audraliaRole: 'planetary-world context only',
    matrixCollapse: false
  })
});

export function getSafeObjectReference(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;
  return getObjectCapacityReference(objectId) || null;
}

export function getSafeEnvironmentObject(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;
  return getResolvedEnvironmentObject(objectId) || null;
}

export function getSafeInspectionAnchor(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;
  return getInspectionAnchor(objectId) || null;
}

export function getComposedNodeByObjectId(objectId) {
  if (!objectId || typeof objectId !== 'string') return null;

  return (
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.composedNodes.find(
      (node) => node.objectId === objectId
    ) || null
  );
}

export function getComposedNodesByObjectId(objectId) {
  if (!objectId || typeof objectId !== 'string') return Object.freeze([]);

  return Object.freeze(
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.composedNodes.filter(
      (node) => node.objectId === objectId
    )
  );
}

export function getRendererNodesForObject(objectId) {
  if (!objectId || typeof objectId !== 'string') return Object.freeze([]);

  return Object.freeze(
    H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes.filter((node) => node.objectId === objectId)
  );
}

export function classifyControllerTarget(objectId) {
  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.primaryInspectionTarget === objectId) {
    return 'PRIMARY_INSPECTION_TARGET';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.supportingInspectionTargets.includes(objectId)) {
    return 'SUPPORTING_INSPECTION_TARGET';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.secondarySurfaceContextTargets.includes(objectId)) {
    return 'SECONDARY_SURFACE_CONTEXT';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.waterAtmosphericContextTargets.includes(objectId)) {
    return 'WATER_ATMOSPHERIC_CONTEXT';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.hearthContextTargets.includes(objectId)) {
    return 'HEARTH_CONTEXT_ONLY';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.audraliaContextTargets.includes(objectId)) {
    return 'AUDRALIA_CONTEXT_ONLY';
  }

  if (H_EARTH_3D_INSPECTION_TARGET_MODEL.contextOnlyTargets.includes(objectId)) {
    return 'CONTEXT_ONLY_TARGET';
  }

  return 'UNCLASSIFIED_TARGET';
}

export function canSelectHEarthObject(objectId) {
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);

  if (!objectReference || !environmentObject) return false;

  const capability = objectReference.capability || {};
  const contextOnly = capability.contextOnly === true;

  if (contextOnly) {
    return capability.selectable === true;
  }

  return capability.selectable === true || capability.inspectable === true;
}

export function canInspectHEarthObject(objectId) {
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);
  const inspectionAnchor = getSafeInspectionAnchor(objectId);
  const inspectionRadius = getInspectionRadius(objectId);
  const classification = classifyControllerTarget(objectId);

  if (!objectReference || !environmentObject) return false;

  if (
    classification === 'SECONDARY_SURFACE_CONTEXT' ||
    classification === 'WATER_ATMOSPHERIC_CONTEXT' ||
    classification === 'HEARTH_CONTEXT_ONLY' ||
    classification === 'AUDRALIA_CONTEXT_ONLY' ||
    classification === 'CONTEXT_ONLY_TARGET'
  ) {
    return false;
  }

  return (
    (
      classification === 'PRIMARY_INSPECTION_TARGET' ||
      classification === 'SUPPORTING_INSPECTION_TARGET'
    ) &&
    objectReference.capability?.inspectable === true &&
    Boolean(inspectionAnchor) &&
    Number.isFinite(inspectionRadius) &&
    inspectionRadius > 0
  );
}

export function resolveContextOnlyBlockResponse(objectId) {
  const classification = classifyControllerTarget(objectId);
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);

  if (
    classification !== 'WATER_ATMOSPHERIC_CONTEXT' &&
    classification !== 'HEARTH_CONTEXT_ONLY' &&
    classification !== 'AUDRALIA_CONTEXT_ONLY' &&
    classification !== 'CONTEXT_ONLY_TARGET'
  ) {
    return null;
  }

  if (objectId === 'OBJ_006_NEARSHORE_WAVE_BAND') {
    return Object.freeze({
      objectId,
      label: objectReference?.label || environmentObject?.label || 'Nearshore Wave Band',
      responseType: 'WATER_ATMOSPHERIC_CONTEXT_BLOCK_RESPONSE',
      reason: 'WATER_CONTEXT_ONLY',
      allowedDescriptorSelection: canSelectHEarthObject(objectId),
      inspectable: false,
      directReceiptClaim: false,
      blockedBehaviors: Object.freeze([
        'SWIM',
        'ACTIVATE_FLUID_SIMULATION'
      ]),
      message:
        'Nearshore wave band may remain visible as water context only; swimming and fluid simulation are blocked.',
      swimmingClaim: false,
      fluidSimulationClaim: false,
      waterTraversalClaim: false,
      traversalClaim: false,
      matrixCollapse: false
    });
  }

  if (objectId === 'OBJ_007_WATER_SURFACE_PLANE') {
    return Object.freeze({
      objectId,
      label: objectReference?.label || environmentObject?.label || 'Water Surface Plane',
      responseType: 'WATER_ATMOSPHERIC_CONTEXT_BLOCK_RESPONSE',
      reason: 'WATER_SURFACE_CONTEXT_ONLY',
      allowedDescriptorSelection: canSelectHEarthObject(objectId),
      inspectable: false,
      directReceiptClaim: false,
      blockedBehaviors: Object.freeze([
        'SWIM',
        'ACTIVATE_FLUID_SIMULATION',
        'START_OPEN_WORLD_MOVEMENT'
      ]),
      message:
        'Water surface plane may remain visible as bounded water context only; swimming, fluid simulation, and water traversal are blocked.',
      swimmingClaim: false,
      fluidSimulationClaim: false,
      waterTraversalClaim: false,
      traversalClaim: false,
      matrixCollapse: false
    });
  }

  if (objectId === 'OBJ_008_AIR_HAZE_LIGHT_LAYER') {
    return Object.freeze({
      objectId,
      label: objectReference?.label || environmentObject?.label || 'Air Haze Light Layer',
      responseType: 'WATER_ATMOSPHERIC_CONTEXT_BLOCK_RESPONSE',
      reason: 'ATMOSPHERIC_CONTEXT_ONLY',
      allowedDescriptorSelection: canSelectHEarthObject(objectId),
      inspectable: false,
      directReceiptClaim: false,
      blockedBehaviors: Object.freeze([
        'ACTIVATE_WEATHER_ENGINE',
        'START_OPEN_WORLD_MOVEMENT'
      ]),
      message:
        'Air haze and light layer may remain visible as atmospheric context only; weather simulation and traversal implications are blocked.',
      weatherEngineClaim: false,
      atmosphericSimulationClaim: false,
      traversalClaim: false,
      matrixCollapse: false
    });
  }

  if (objectId === 'OBJ_009_MANOR_EXTERIOR_CONTEXT') {
    return Object.freeze({
      objectId,
      label: objectReference?.label || environmentObject?.label || 'Manor Exterior Context',
      responseType: 'CONTEXT_ONLY_BLOCK_RESPONSE',
      reason: 'HEARTH_SUPPORT_CONTROL_CONTEXT_ONLY',
      allowedDescriptorSelection: canSelectHEarthObject(objectId),
      inspectable: false,
      directReceiptClaim: false,
      blockedBehaviors: Object.freeze([
        'ENTER_MANOR_INTERIOR',
        'COLLAPSE_MATRICES'
      ]),
      message:
        'Manor exterior may remain visible as Hearth support/control context only; manor interior access is blocked.',
      manorInteriorAccessClaim: false,
      hearthMergeClaim: false,
      traversalClaim: false,
      matrixCollapse: false
    });
  }

  if (objectId === 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS') {
    return Object.freeze({
      objectId,
      label:
        objectReference?.label ||
        environmentObject?.label ||
        'Distance Rock Stacks and Islets',
      responseType: 'CONTEXT_ONLY_BLOCK_RESPONSE',
      reason: 'AUDRALIA_PLANETARY_WORLD_CONTEXT_ONLY',
      allowedDescriptorSelection: canSelectHEarthObject(objectId),
      inspectable: false,
      directReceiptClaim: false,
      blockedBehaviors: Object.freeze([
        'TRAVERSE_DISTANT_WORLD',
        'START_OPEN_WORLD_MOVEMENT',
        'COLLAPSE_MATRICES'
      ]),
      message:
        'Distant world context may remain visible as Audralia planetary-world context only; distant traversal is blocked.',
      distantTraversalClaim: false,
      openWorldTraversalClaim: false,
      audraliaMergeClaim: false,
      matrixCollapse: false
    });
  }

  return Object.freeze({
    objectId,
    label: objectReference?.label || environmentObject?.label || objectId,
    responseType: 'CONTEXT_ONLY_BLOCK_RESPONSE',
    reason: 'CONTEXT_ONLY_TARGET',
    allowedDescriptorSelection: canSelectHEarthObject(objectId),
    inspectable: false,
    directReceiptClaim: false,
    blockedBehaviors: Object.freeze([]),
    traversalClaim: false,
    matrixCollapse: false
  });
}

export function resolveWaterAtmosphericContextResponse(objectId) {
  const classification = classifyControllerTarget(objectId);

  if (classification !== 'WATER_ATMOSPHERIC_CONTEXT') return null;

  const blockResponse = resolveContextOnlyBlockResponse(objectId);
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);

  return Object.freeze({
    objectId,
    label: objectReference?.label || environmentObject?.label || objectId,
    responseType: 'WATER_ATMOSPHERIC_CONTEXT_RESPONSE',
    classification,
    selectable: canSelectHEarthObject(objectId),
    inspectable: false,
    maySupportGroundConditionRead: false,
    directReceiptClaim: false,
    contextOnly: true,
    blockResponse,
    message:
      'Water and atmospheric context targets may be referenced as bounded composed-frame descriptors only; they do not bridge Ground Condition Read directly.',
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    weatherEngineClaim: false,
    atmosphericSimulationClaim: false,
    survivalSimulationClaim: false,
    validationClaim: false,
    matrixCollapse: false
  });
}

export function resolveSecondarySurfaceContextResponse(objectId) {
  const classification = classifyControllerTarget(objectId);
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);

  if (classification !== 'SECONDARY_SURFACE_CONTEXT') return null;

  return Object.freeze({
    objectId,
    label: objectReference?.label || environmentObject?.label || objectId,
    responseType: 'SECONDARY_SURFACE_CONTEXT_RESPONSE',
    classification,
    selectable: canSelectHEarthObject(objectId),
    inspectable: false,
    maySupportGroundConditionRead: objectId === 'OBJ_003_DRY_SAND_TRANSITION',
    directReceiptClaim: false,
    blockedBehaviors: Object.freeze([]),
    message:
      'Dry sand transition may support Ground Condition Read descriptors but does not create traversal, simulation, or direct receipt authority.',
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    survivalSimulationClaim: false,
    validationClaim: false,
    matrixCollapse: false
  });
}

export function getComposedFrameSelectionReference(objectId) {
  const composedNodes = getComposedNodesByObjectId(objectId);
  const rendererNodes = getRendererNodesForObject(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);

  return Object.freeze({
    objectId,
    composedNodeIds: Object.freeze(composedNodes.map((node) => node.composedNodeId)),
    sourceNodeIds: Object.freeze(composedNodes.map((node) => node.sourceNodeId)),
    rendererNodeIds: Object.freeze(rendererNodes.map((node) => node.nodeId)),
    hasComposedFrameReference: composedNodes.length > 0,
    hasRendererNodeReference: rendererNodes.length > 0,
    layerIds: Object.freeze([...new Set(composedNodes.map((node) => node.layerId))]),
    zoneId: environmentObject?.zoneId || null,
    classification: classifyControllerTarget(objectId),
    descriptorOnly: true,
    domMutationClaim: false,
    rendererActivationClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

export function resolveGroundConditionReadBridge(objectId) {
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);
  const classification = classifyControllerTarget(objectId);
  const inspectionAnchor = getSafeInspectionAnchor(objectId);
  const composedFrameReference = getComposedFrameSelectionReference(objectId);

  if (!objectReference || !environmentObject) {
    return Object.freeze({
      objectId,
      bridgeResolved: false,
      reason: 'MISSING_OBJECT_REFERENCE',
      readout: 'Ground Condition Read',
      readoutClaim: 'descriptor-only',
      validationClaim: false,
      matrixCollapse: false
    });
  }

  const contextOnlyBlockResponse = resolveContextOnlyBlockResponse(objectId);
  const secondarySurfaceContextResponse = resolveSecondarySurfaceContextResponse(objectId);
  const waterAtmosphericContextResponse = resolveWaterAtmosphericContextResponse(objectId);

  const canBridgeReadout =
    classification === 'PRIMARY_INSPECTION_TARGET' ||
    classification === 'SUPPORTING_INSPECTION_TARGET' ||
    (
      classification === 'SECONDARY_SURFACE_CONTEXT' &&
      objectId === 'OBJ_003_DRY_SAND_TRANSITION'
    );

  return Object.freeze({
    objectId,
    bridgeResolved: canBridgeReadout,
    classification,
    readout: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    readoutClaim: 'descriptor-only',
    firstAction: 'Inspect Ground',
    firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    objectLabel: objectReference.label || environmentObject.label,
    zoneId: environmentObject.zoneId,
    primitiveType: environmentObject.primitiveType,
    materialKey: environmentObject.materialKey,
    inspectionAnchorId: inspectionAnchor?.anchorId || null,
    composedFrameReference,

    primaryTarget:
      classification === 'PRIMARY_INSPECTION_TARGET',
    supportingTarget:
      classification === 'SUPPORTING_INSPECTION_TARGET',
    secondarySurfaceContext:
      classification === 'SECONDARY_SURFACE_CONTEXT',
    waterAtmosphericContext:
      classification === 'WATER_ATMOSPHERIC_CONTEXT',
    hearthContextOnly:
      classification === 'HEARTH_CONTEXT_ONLY',
    audraliaContextOnly:
      classification === 'AUDRALIA_CONTEXT_ONLY',
    contextOnly:
      classification === 'CONTEXT_ONLY_TARGET',

    contextOnlyBlockResponse,
    secondarySurfaceContextResponse,
    waterAtmosphericContextResponse,

    claimFlags: Object.freeze({
      producesReadoutAtRuntime: false,
      createsReceiptAtRuntime: false,
      directWaterAirReadoutBridgeClaim: false,
      survivalScoreClaim: false,
      healthScoreClaim: false,
      empiricalDiagnosisClaim: false,
      rendererStatusClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      openWorldScanClaim: false,
      matrixCollapse: false
    })
  });
}

export function resolveGroundInspectionReceiptBridge(objectId) {
  const classification = classifyControllerTarget(objectId);
  const canInspect = canInspectHEarthObject(objectId);
  const readoutBridge = resolveGroundConditionReadBridge(objectId);
  const inspectionAnchor = getSafeInspectionAnchor(objectId);

  return Object.freeze({
    objectId,
    receiptBridgeId: `H_EARTH_3D_CONTROLLER_RECEIPT_BRIDGE_${objectId || 'UNKNOWN'}`,
    receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    firstAction: 'Inspect Ground',
    firstReadout: 'Ground Condition Read',
    classification,
    inspectionAnchorId: inspectionAnchor?.anchorId || null,
    bridgeEligible: canInspect,
    readoutBridgeResolved: readoutBridge.bridgeResolved === true,
    descriptorOnly: true,

    receiptClaim: Object.freeze({
      createsReceiptAtRuntime: false,
      emitsReceiptToRuntime: false,
      persistsReceipt: false,
      validationReceiptClaim: false,
      productionReceiptClaim: false
    }),

    boundary: Object.freeze({
      runtimeActivation: false,
      routeIntegration: false,
      directDomMutation: false,
      rendererActivation: false,
      visualPassClaim: false,
      validationClaim: false,
      matrixCollapse: false
    })
  });
}

export function resolveInspectGroundControllerBridge(objectId) {
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);
  const inspectionRadius = getInspectionRadius(objectId);
  const inspectionAnchor = getSafeInspectionAnchor(objectId);
  const classification = classifyControllerTarget(objectId);
  const selectable = canSelectHEarthObject(objectId);
  const inspectable = canInspectHEarthObject(objectId);
  const composedFrameReference = getComposedFrameSelectionReference(objectId);
  const readoutBridge = resolveGroundConditionReadBridge(objectId);
  const receiptBridge = resolveGroundInspectionReceiptBridge(objectId);

  if (!objectReference || !environmentObject) {
    return Object.freeze({
      objectId,
      bridgeResolved: false,
      reason: 'MISSING_OBJECT_REFERENCE',
      selectable: false,
      inspectable: false,
      action: 'Inspect Ground',
      readout: 'Ground Condition Read',
      receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      runtimeActionExecutionClaim: false,
      matrixCollapse: false
    });
  }

  const contextOnlyBlockResponse = resolveContextOnlyBlockResponse(objectId);
  const secondarySurfaceContextResponse = resolveSecondarySurfaceContextResponse(objectId);
  const waterAtmosphericContextResponse = resolveWaterAtmosphericContextResponse(objectId);

  return Object.freeze({
    objectId,
    bridgeResolved: true,
    controllerBridgeId: `H_EARTH_3D_INSPECT_GROUND_CONTROLLER_BRIDGE_${objectId}`,
    classification,
    selectable,
    inspectable,

    action: 'Inspect Ground',
    actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    readout: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    objectLabel: objectReference.label || environmentObject.label,
    zoneId: environmentObject.zoneId,
    primitiveType: environmentObject.primitiveType,
    materialKey: environmentObject.materialKey,
    inspectionRadius,
    inspectionAnchor,
    composedFrameReference,
    readoutBridge,
    receiptBridge,

    contextOnlyBlockResponse,
    secondarySurfaceContextResponse,
    waterAtmosphericContextResponse,

    targetStatus: Object.freeze({
      primaryInspectionTarget:
        classification === 'PRIMARY_INSPECTION_TARGET',
      supportingInspectionTarget:
        classification === 'SUPPORTING_INSPECTION_TARGET',
      secondarySurfaceContext:
        classification === 'SECONDARY_SURFACE_CONTEXT',
      waterAtmosphericContext:
        classification === 'WATER_ATMOSPHERIC_CONTEXT',
      hearthContextOnly:
        classification === 'HEARTH_CONTEXT_ONLY',
      audraliaContextOnly:
        classification === 'AUDRALIA_CONTEXT_ONLY',
      contextOnlyTarget:
        classification === 'CONTEXT_ONLY_TARGET'
    }),

    claimFlags: Object.freeze({
      runtimeActionExecutionClaim: false,
      routeActionExecutionClaim: false,
      domEventBindingClaim: false,
      rendererActivationClaim: false,
      readoutProductionClaim: false,
      receiptCreationClaim: false,
      persistentSaveLogic: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    })
  });
}

export function resolveBlockedBehaviorResponse(behaviorId) {
  if (!behaviorId || typeof behaviorId !== 'string') {
    return Object.freeze({
      behaviorId: null,
      responseType: 'BLOCKED_BEHAVIOR_UNRESOLVED',
      message: 'No behavior identifier was supplied.',
      allowedAlternative: 'Inspect Ground',
      runtimeClaim: false,
      validationClaim: false,
      matrixCollapse: false
    });
  }

  return (
    H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES[behaviorId] ||
    Object.freeze({
      behaviorId,
      responseType: 'BLOCKED_BEHAVIOR_DEFAULT',
      message:
        'This behavior is not authorized by the H-Earth controller bridge descriptor.',
      allowedAlternative: 'Inspect Ground',
      runtimeClaim: false,
      routeIntegrationClaim: false,
      rendererActivationClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    })
  );
}

export function buildSelectableTargetDescriptor(objectId) {
  const objectReference = getSafeObjectReference(objectId);
  const environmentObject = getSafeEnvironmentObject(objectId);
  const classification = classifyControllerTarget(objectId);
  const selectable = canSelectHEarthObject(objectId);
  const inspectable = canInspectHEarthObject(objectId);
  const inspectionAnchor = getSafeInspectionAnchor(objectId);
  const inspectionRadius = getInspectionRadius(objectId);
  const composedFrameReference = getComposedFrameSelectionReference(objectId);

  if (!objectReference || !environmentObject) {
    return Object.freeze({
      objectId,
      targetResolved: false,
      selectable: false,
      inspectable: false,
      classification,
      descriptorOnly: true,
      matrixCollapse: false
    });
  }

  return Object.freeze({
    objectId,
    targetResolved: true,
    label: objectReference.label || environmentObject.label,
    classification,
    selectable,
    inspectable,
    zoneId: environmentObject.zoneId,
    primitiveType: environmentObject.primitiveType,
    materialKey: environmentObject.materialKey,

    capability: objectReference.capability,
    context: environmentObject.context,
    boundary: environmentObject.boundary,
    inspectionRadius,
    inspectionAnchor,
    composedFrameReference,

    actionBridge: resolveInspectGroundControllerBridge(objectId),
    readoutBridge: resolveGroundConditionReadBridge(objectId),
    receiptBridge: resolveGroundInspectionReceiptBridge(objectId),

    contextOnlyBlockResponse: resolveContextOnlyBlockResponse(objectId),
    secondarySurfaceContextResponse: resolveSecondarySurfaceContextResponse(objectId),
    waterAtmosphericContextResponse: resolveWaterAtmosphericContextResponse(objectId),

    claimFlags: Object.freeze({
      descriptorOnly: true,
      directDomMutation: false,
      routeIntegration: false,
      runtimeActivation: false,
      rendererActivation: false,
      canvasActivation: false,
      webglActivation: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      survivalSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      matrixCollapse: false
    })
  });
}

const CONTROLLER_OBJECT_IDS = Object.freeze([
  'OBJ_001_GROUND_SPAWN_ANCHOR',
  'OBJ_002_FOREGROUND_WET_SAND',
  'OBJ_003_DRY_SAND_TRANSITION',
  'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
  'OBJ_005_SHORELINE_FOAM_LINE',
  'OBJ_006_NEARSHORE_WAVE_BAND',
  'OBJ_007_WATER_SURFACE_PLANE',
  'OBJ_008_AIR_HAZE_LIGHT_LAYER',
  'OBJ_009_MANOR_EXTERIOR_CONTEXT',
  'OBJ_010_SMALL_BEACH_STONES',
  'OBJ_011_FOREGROUND_JAGGED_ROCKS',
  'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
]);

export const H_EARTH_3D_SELECTABLE_TARGET_REGISTRY = Object.freeze(
  CONTROLLER_OBJECT_IDS.reduce((accumulator, objectId) => {
    accumulator[objectId] = buildSelectableTargetDescriptor(objectId);
    return accumulator;
  }, {})
);

export const H_EARTH_3D_INSPECTION_ACTION_ROUTING = Object.freeze({
  id: 'H_EARTH_3D_INSPECTION_ACTION_ROUTING',
  action: 'Inspect Ground',
  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  primaryTarget: H_EARTH_3D_INSPECTION_TARGET_MODEL.primaryInspectionTarget,
  supportingTargets: H_EARTH_3D_INSPECTION_TARGET_MODEL.supportingInspectionTargets,
  secondarySurfaceContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.secondarySurfaceContextTargets,
  waterAtmosphericContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.waterAtmosphericContextTargets,
  hearthContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.hearthContextTargets,
  audraliaContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.audraliaContextTargets,
  contextOnlyTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.contextOnlyTargets,

  targetRoutes: Object.freeze(
    CONTROLLER_OBJECT_IDS.reduce((accumulator, objectId) => {
      accumulator[objectId] = resolveInspectGroundControllerBridge(objectId);
      return accumulator;
    }, {})
  ),

  boundary: Object.freeze({
    descriptorRoutingOnly: true,
    runtimeActionExecutionClaim: false,
    routeActionExecutionClaim: false,
    domEventBindingClaim: false,
    rendererActivationClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE = Object.freeze({
  id: 'H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE',
  readout: 'Ground Condition Read',
  readoutId: 'H_EARTH_GROUND_CONDITION_READ',
  sourceAction: 'Inspect Ground',
  sourceActionId: 'H_EARTH_INSPECT_GROUND_ACTION',

  targetReadoutBridges: Object.freeze(
    CONTROLLER_OBJECT_IDS.reduce((accumulator, objectId) => {
      accumulator[objectId] = resolveGroundConditionReadBridge(objectId);
      return accumulator;
    }, {})
  ),

  constrainedSupport: Object.freeze({
    primaryInspectionTargetAllowed: true,
    supportingInspectionTargetsAllowed: true,
    drySandSecondarySurfaceContextAllowed: true,
    waterAtmosphericContextAllowedDirectly: false,
    hearthContextAllowedDirectly: false,
    audraliaContextAllowedDirectly: false
  }),

  boundary: Object.freeze({
    descriptorBridgeOnly: true,
    producesReadoutAtRuntime: false,
    createsReceiptAtRuntime: false,
    directWaterAirReadoutBridgeClaim: false,
    survivalScoreClaim: false,
    healthScoreClaim: false,
    empiricalDiagnosisClaim: false,
    rendererStatusClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    openWorldScanClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE = Object.freeze({
  id: 'H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE',
  receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  sourceAction: 'Inspect Ground',
  sourceReadout: 'Ground Condition Read',

  targetReceiptBridges: Object.freeze(
    CONTROLLER_OBJECT_IDS.reduce((accumulator, objectId) => {
      accumulator[objectId] = resolveGroundInspectionReceiptBridge(objectId);
      return accumulator;
    }, {})
  ),

  boundary: Object.freeze({
    descriptorReceiptBridgeOnly: true,
    createsReceiptAtRuntime: false,
    emitsReceiptToRuntime: false,
    persistsReceipt: false,
    validationReceiptClaim: false,
    productionReceiptClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_CONTEXT_ONLY_BLOCK_RESPONSES = Object.freeze(
  H_EARTH_3D_INSPECTION_TARGET_MODEL.contextOnlyTargets.reduce((accumulator, objectId) => {
    accumulator[objectId] = resolveContextOnlyBlockResponse(objectId);
    return accumulator;
  }, {})
);

export const H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES = Object.freeze(
  H_EARTH_3D_INSPECTION_TARGET_MODEL.secondarySurfaceContextTargets.reduce(
    (accumulator, objectId) => {
      accumulator[objectId] = resolveSecondarySurfaceContextResponse(objectId);
      return accumulator;
    },
    {}
  )
);

export const H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES = Object.freeze(
  H_EARTH_3D_INSPECTION_TARGET_MODEL.waterAtmosphericContextTargets.reduce(
    (accumulator, objectId) => {
      accumulator[objectId] = resolveWaterAtmosphericContextResponse(objectId);
      return accumulator;
    },
    {}
  )
);

export const H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES = Object.freeze(
  CONTROLLER_OBJECT_IDS.reduce((accumulator, objectId) => {
    accumulator[objectId] = getComposedFrameSelectionReference(objectId);
    return accumulator;
  }, {})
);

export const H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS = Object.freeze({
  id: 'H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS',

  mayBeConsumedByLaterBootstrap: true,
  expectedBootstrapFile: '/showroom/globe/h-earth/index.js',
  expectedRoute: '/showroom/globe/h-earth/',

  expectsCapacityBound: true,
  expectsEnvironmentBound: true,
  expectsRendererBound: true,
  expectsCompositorBound: true,
  expectsControllerBound: true,

  bootstrapMayRead: Object.freeze([
    'H_EARTH_3D_CONTROLLER',
    'H_EARTH_3D_CONTROLLER_RECEIPT',
    'H_EARTH_3D_SELECTABLE_TARGET_REGISTRY',
    'H_EARTH_3D_INSPECTION_ACTION_ROUTING',
    'H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE',
    'H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE',
    'H_EARTH_3D_CONTEXT_ONLY_BLOCK_RESPONSES',
    'H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES',
    'H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES',
    'H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES'
  ]),

  bootstrapMustNotInfer: Object.freeze([
    'route installed',
    'runtime activated',
    'DOM mutated',
    'renderer mounted',
    'canvas activated',
    'WebGL activated',
    'renderer pass',
    'visual pass',
    'validation',
    'production readiness',
    'open-world traversal',
    'survival simulation',
    'swimming',
    'fluid simulation',
    'manor interior access',
    'distant traversal',
    'matrix collapse'
  ]),

  boundary: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
});

export function getSelectableTarget(objectId) {
  return H_EARTH_3D_SELECTABLE_TARGET_REGISTRY[objectId] || null;
}

export function getControllerTargetClassification(objectId) {
  return classifyControllerTarget(objectId);
}

export const H_EARTH_3D_CONTROLLER_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_CONTROLLER_RECEIPT',
  file: '/showroom/globe/h-earth/controller.js',
  status: 'DETERMINISTIC_CONTROLLER_ROUTE_BRIDGE_DEFINED_NON_ACTIVATING_RENEWED',

  contractId: 'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1',
  renewedFrom: 'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027_v1',

  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamCompositorFile: '/showroom/globe/h-earth/compositor.js',

  upstreamCapacityReceipt: getCapacityReceipt(),
  upstreamEnvironmentReceipt: getEnvironmentReceipt(),
  upstreamRendererReceipt: getRendererReceipt(),
  upstreamCompositorReceipt: getCompositorReceipt(),

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  controllerContractDefined: true,
  controllerBoundaryFlagsDefined: true,
  controllerInputsDefined: true,
  selectableTargetRegistryDefined: true,
  inspectionActionRoutingDefined: true,
  groundConditionReadBridgeDefined: true,
  groundInspectionReceiptBridgeDefined: true,
  contextOnlyBlockResponsesDefined: true,
  secondarySurfaceContextResponsesDefined: true,
  waterAtmosphericContextResponsesDefined: true,
  composedFrameSelectionReferencesDefined: true,
  bootstrapExpectationsDefined: true,

  cleanupApplied: Object.freeze({
    unusedResolveCandidateRenderNodesImportRemoved: true,
    secondarySurfaceContextTargetsNarrowed: true,
    waterAtmosphericContextTargetsSeparated: true,
    hearthContextTargetsSeparated: true,
    audraliaContextTargetsSeparated: true,
    contextOnlyTargetsExpandedToMatchCapacity: true,
    groundConditionReadSupportConstrained: true,
    waterAirContextBoundariesPreserved: true
  }),

  primaryInspectionTarget:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.primaryInspectionTarget,
  supportingInspectionTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.supportingInspectionTargets,
  secondarySurfaceContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.secondarySurfaceContextTargets,
  waterAtmosphericContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.waterAtmosphericContextTargets,
  hearthContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.hearthContextTargets,
  audraliaContextTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.audraliaContextTargets,
  contextOnlyTargets:
    H_EARTH_3D_INSPECTION_TARGET_MODEL.contextOnlyTargets,

  selectableTargetCount: Object.values(H_EARTH_3D_SELECTABLE_TARGET_REGISTRY).filter(
    (target) => target && target.selectable === true
  ).length,

  inspectableTargetCount: Object.values(H_EARTH_3D_SELECTABLE_TARGET_REGISTRY).filter(
    (target) => target && target.inspectable === true
  ).length,

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  }),

  boundary: Object.freeze({
    createsControllerDescriptors: true,
    createsRouteBridgeDescriptors: true,
    installsRoute: false,
    mutatesGitHub: false,
    activatesRuntime: false,
    touchesDom: false,
    mountsRenderer: false,
    activatesRenderer: false,
    activatesCanvas: false,
    activatesWebGL: false,
    claimsRendererPass: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    claimsOpenWorldTraversal: false,
    claimsSurvivalSimulation: false,
    claimsSwimming: false,
    claimsFluidSimulation: false,
    claimsManorInteriorAccess: false,
    claimsDistantTraversal: false,
    matrixCollapse: false
  }),

  forbiddenCapabilityFlagsPreserved: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  renderBoundaryFlagsPreserved: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  compositionBoundaryFlagsPreserved: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
  controllerBoundaryFlagsPreserved: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
});

export function getControllerReceipt() {
  return H_EARTH_3D_CONTROLLER_RECEIPT;
}

export const H_EARTH_3D_CONTROLLER = Object.freeze({
  id: 'H_EARTH_3D_CONTROLLER',
  file: '/showroom/globe/h-earth/controller.js',
  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamCompositorFile: '/showroom/globe/h-earth/compositor.js',
  sourceRoot: '/h-earth-3d/',
  primaryRoute: '/showroom/globe/h-earth/',

  contract: H_EARTH_3D_CONTROLLER_CONTRACT,
  boundaryFlags: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
  inputs: H_EARTH_3D_CONTROLLER_INPUTS,

  inspectionTargetModel: H_EARTH_3D_INSPECTION_TARGET_MODEL,
  selectableTargetRegistry: H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,
  inspectionActionRouting: H_EARTH_3D_INSPECTION_ACTION_ROUTING,
  groundConditionReadBridge: H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE,
  groundInspectionReceiptBridge: H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE,
  contextOnlyBlockResponses: H_EARTH_3D_CONTEXT_ONLY_BLOCK_RESPONSES,
  secondarySurfaceContextResponses:
    H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES,
  waterAtmosphericContextResponses:
    H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES,
  blockedBehaviorResponses: H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES,
  composedFrameSelectionReferences: H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES,
  bootstrapExpectations: H_EARTH_3D_CONTROLLER_BOOTSTRAP_EXPECTATIONS,

  upstreamCapacity: H_EARTH_3D_CAPACITY,
  upstreamEnvironment: H_EARTH_3D_ENVIRONMENT,
  upstreamRenderer: H_EARTH_3D_RENDERER,
  upstreamCompositor: H_EARTH_3D_COMPOSITOR,

  composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,

  receipt: H_EARTH_3D_CONTROLLER_RECEIPT
});

export default H_EARTH_3D_CONTROLLER;
