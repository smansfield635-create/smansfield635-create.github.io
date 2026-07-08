// /showroom/globe/h-earth/compositor.js
// RENEWED FILE
// H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025A_RENEWAL_CLEANUP_PACKET_v1
//
// Renews:
// H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025_v1
//
// Purpose:
// Defines the deterministic non-rendering H-Earth 3D Candidate Preview
// compositor descriptor layer.
//
// This file consumes capacity.js, environment.js, and renderer.js outputs
// and resolves the bounded composed candidate frame: camera frame, depth
// composition, layer composition, focus priority, context composition,
// viewport-fit classification, node-budget composition, composition pressure,
// and final composed-node descriptors.
//
// Renewal scope:
// - Remove unused renderer inspection-affordance import.
// - Perform actual projected-bounds vs preview-container comparison.
// - Preserve node budget by nodeId, not objectId.
// - Resolve composed nodes by nodeId, not objectId.
// - Normalize projected y bounds after y-axis inversion.
// - Clarify clamp flags as operation-applied versus value-was-clamped.
//
// This file does not install a route, mutate GitHub, activate runtime,
// touch DOM, activate WebGL/canvas, claim final renderer, claim renderer pass,
// claim visual pass, claim validation, claim production, authorize traversal,
// authorize survival simulation, authorize manor interior, authorize distant
// traversal, authorize swimming/fluid simulation, or collapse matrices.

import {
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_WORLD_BOUNDS,
  H_EARTH_3D_DEPTH_MODEL,
  H_EARTH_3D_ZONE_BANDS,
  H_EARTH_3D_CONTEXT_COMPRESSION,
  H_EARTH_3D_INSPECTION_ANCHORS,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  getCapacityReceipt,
  clampCameraPan,
  clampCameraTilt,
  clampCameraZoom,
  getCameraFrameHint
} from './capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT,
  H_EARTH_3D_ENVIRONMENT_RECEIPT,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,
  H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL,
  getEnvironmentReceipt
} from './environment.js';

import {
  H_EARTH_3D_RENDERER,
  H_EARTH_3D_RENDERER_CONTRACT,
  H_EARTH_3D_RENDERER_RECEIPT,
  H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  H_EARTH_3D_RENDER_PROJECTION_MODEL,
  H_EARTH_3D_RENDER_VOLUME_MODEL,
  H_EARTH_3D_RENDER_LAYER_ORDER,
  H_EARTH_3D_RENDER_NODE_BUDGET,
  H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL,
  H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  getRendererReceipt
} from './renderer.js';

export const H_EARTH_3D_COMPOSITOR_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025A_RENEWAL_CLEANUP_PACKET_v1',
  renewedFrom: 'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025_v1',
  upstreamRendererContractId: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',
  upstreamEnvironmentContractId: 'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1',
  upstreamCapacityContractId: 'H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1',
  upstreamMathMapId: 'H_EARTH_3D_COMPOSITOR_CANON_MATH_MAP_v1',

  file: '/showroom/globe/h-earth/compositor.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',

  status: 'DETERMINISTIC_COMPOSITOR_DESCRIPTOR_DEFINED_NON_RENDERING_RENEWED',
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
    '/showroom/globe/h-earth/renderer.js'
  ]),

  mayBeConsumedBy: Object.freeze([
    '/showroom/globe/h-earth/controller.js',
    '/showroom/globe/h-earth/index.js'
  ]),

  renewalScope: Object.freeze({
    unusedRendererInspectionAffordanceImportRemoved: true,
    actualViewportContainerFitComparisonAdded: true,
    nodeBudgetPreservesByNodeId: true,
    composedNodeResolutionUsesNodeId: true,
    projectedYBoundsNormalizedAfterInversion: true,
    clampFlagsClarified: true,
    redesignClaim: false
  }),

  compositorPosture: Object.freeze({
    compositorType: 'bounded candidate-frame descriptor compositor',
    resolvesCameraFrame: true,
    resolvesLayerComposition: true,
    resolvesFocusPriority: true,
    resolvesContextComposition: true,
    resolvesViewportFit: true,
    resolvesNodeBudgetComposition: true,
    resolvesCompositionPressure: true,
    producesComposedCandidateFrameDescriptor: true,

    touchesDomInThisFile: false,
    installsRouteInThisFile: false,
    activatesRuntimeInThisFile: false,
    activatesCanvasInThisFile: false,
    activatesWebGLInThisFile: false,
    finalRendererClaim: false,
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
    doesNotActivateCanvas: true,
    doesNotActivateWebGL: true,
    doesNotClaimFinalRenderer: true,
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

export const H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS = Object.freeze({
  compositorDescriptorOnly: true,
  composedCandidateFrameOnly: true,

  directDomMutation: false,
  routeIntegration: false,
  runtimeActivation: false,
  rendererActivation: false,
  canvasActivation: false,
  webglActivation: false,

  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,

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

  physicsClaim: false,
  collisionClaim: false,
  persistentSaveClaim: false,

  matrixCollapse: false
});

export const H_EARTH_3D_COMPOSITION_MATH = Object.freeze({
  id: 'H_EARTH_3D_COMPOSITION_MATH',
  controllingEquation:
    'ComposedCandidateFrame = CameraFrame + DepthComposition + LayerComposition + FocusPriority + ContextCompression + ViewportFit + NodeBudgetComposition + CompositionPressure + BoundaryGuards',

  lockedQuestions: Object.freeze([
    'What is the camera frame?',
    'What is the layer order?',
    'What is the primary focus?',
    'What is context-only?',
    'What overflows the preview?',
    'What gets priority under node pressure?',
    'What remains prohibited?',
    'What is the final composed candidate frame descriptor?'
  ]),

  lockedRules: Object.freeze([
    'Camera frame must be clamped to capacity limits.',
    'Clamp-applied flags mean the clamp operation ran; was-clamped flags mean values changed.',
    'Layer ordering must be deterministic.',
    'Foreground wet sand remains primary focus.',
    'Supporting inspection targets retain priority over context-only forms.',
    'Hearth remains support/control context only.',
    'Audralia remains planetary-world context only.',
    'Projected bounds must be compared against preview container bounds.',
    'Overflow is classified and never upgraded into open-world authority.',
    'Node-pressure reduction preserves by nodeId and never only by objectId.',
    'Node-pressure reduction never removes boundary flags.',
    'The composed frame is a descriptor, not a rendered scene.',
    'No visual pass, validation, production, runtime, route, canvas, WebGL, or matrix-collapse claim.'
  ]),

  requiredOutputs: Object.freeze([
    'cameraFrame',
    'depthComposition',
    'layerComposition',
    'focusPriority',
    'contextComposition',
    'viewportFit',
    'nodeBudgetComposition',
    'compositionPressure',
    'composedNodes',
    'boundary',
    'matrixSeparation',
    'receipt'
  ])
});

export const H_EARTH_3D_CAMERA_FRAME_MODEL = Object.freeze({
  id: 'H_EARTH_3D_CAMERA_FRAME_MODEL',
  source: 'H_EARTH_3D_CAMERA_CAPACITY',
  cameraType: 'ground-view composition camera',
  defaultFrame: 'inspection framing',
  primaryFocusObjectId: 'OBJ_002_FOREGROUND_WET_SAND',

  focusObjectIds: Object.freeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]),

  formula:
    'CameraFrame = clamp(defaultCamera + focusOffset + contextOffset, panLimits, tiltLimits, zoomLimits)',

  defaults: Object.freeze({
    position: H_EARTH_3D_CAMERA_CAPACITY.defaultPosition,
    lookAt: H_EARTH_3D_CAMERA_CAPACITY.defaultLookAt,
    tiltDegrees: 0,
    zoom: 1
  }),

  clamps: Object.freeze({
    panLimits: H_EARTH_3D_CAMERA_CAPACITY.panLimits,
    tiltLimitsDegrees: H_EARTH_3D_CAMERA_CAPACITY.tiltLimitsDegrees,
    zoomLimits: H_EARTH_3D_CAMERA_CAPACITY.zoomLimits
  }),

  boundary: Object.freeze({
    cameraFrameDescriptorOnly: true,
    freeFlightClaim: false,
    walkClaim: false,
    swimClaim: false,
    openWorldTraversalClaim: false,
    manorEntryClaim: false,
    distantTraversalClaim: false,
    controllerActivationClaim: false
  })
});

export const H_EARTH_3D_DEPTH_COMPOSITION_MODEL = Object.freeze({
  id: 'H_EARTH_3D_DEPTH_COMPOSITION_MODEL',
  source: 'H_EARTH_3D_DEPTH_MODEL',
  formula:
    'DepthComposition = sorted node depth + normalizedDepth + primaryDepthClass + lawful context compression',

  depthClassOrder: Object.freeze({
    foreground: 10,
    shoreline: 20,
    water: 30,
    context: 40,
    horizon: 50,
    'out-of-bounds-depth': 999
  }),

  boundary: Object.freeze({
    deterministicDepthOrdering: true,
    visualPassClaim: false,
    validationClaim: false,
    finalProjectionClaim: false
  })
});

export const H_EARTH_3D_LAYER_COMPOSITION_MODEL = Object.freeze({
  id: 'H_EARTH_3D_LAYER_COMPOSITION_MODEL',
  source: 'H_EARTH_3D_RENDER_LAYER_ORDER',
  formula:
    'LayerSortKey = layerOrder + normalizedDepthWeight + contextDepthAdjustment + focusLiftAdjustment',

  stableLayerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,

  adjustments: Object.freeze({
    normalizedDepthWeight: 0.01,
    contextDepthAdjustment: 0.25,
    primaryFocusLiftAdjustment: -0.50,
    supportingFocusLiftAdjustment: -0.25
  }),

  boundary: Object.freeze({
    deterministicSort: true,
    usesRuntimeEntropy: false,
    usesMathRandom: false,
    domOrderDependent: false,
    visualPassClaim: false,
    validationClaim: false
  })
});

export const H_EARTH_3D_FOCUS_PRIORITY_MODEL = Object.freeze({
  id: 'H_EARTH_3D_FOCUS_PRIORITY_MODEL',
  formula:
    'FocusPriority = inspectionWeight + proximityWeight + primaryTargetBoost + supportingTargetBoost - contextOnlyPenalty - distantDepthPenalty',

  primaryFocusObjectId: 'OBJ_002_FOREGROUND_WET_SAND',

  supportingFocusObjectIds: Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]),

  weights: Object.freeze({
    primaryTargetBoost: 1.0,
    supportingTargetBoost: 0.7,
    inspectableWeight: 0.5,
    foregroundZoneWeight: 0.35,
    shorelineZoneWeight: 0.25,
    contextOnlyPenalty: 0.75,
    distantDepthPenaltyMultiplier: 0.4,
    proximityMultiplier: 0.3
  }),

  focusClasses: Object.freeze({
    primary: 'PRIMARY_FOCUS',
    supporting: 'SUPPORTING_FOCUS',
    surfaceContext: 'SURFACE_CONTEXT',
    contextOnly: 'CONTEXT_ONLY',
    unclassified: 'UNCLASSIFIED_FOCUS'
  }),

  boundary: Object.freeze({
    focusDoesNotCreateTraversal: true,
    focusDoesNotCreateInteraction: true,
    focusDoesNotCreateReceipt: true,
    contextOnlyCannotBecomePrimaryFocus: true,
    visualPassClaim: false,
    validationClaim: false
  })
});

export const H_EARTH_3D_CONTEXT_COMPOSITION_MODEL = Object.freeze({
  id: 'H_EARTH_3D_CONTEXT_COMPOSITION_MODEL',
  source: 'H_EARTH_3D_CONTEXT_COMPRESSION',

  hearthContextObjectIds: Object.freeze([
    'OBJ_009_MANOR_EXTERIOR_CONTEXT'
  ]),

  audraliaContextObjectIds: Object.freeze([
    'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
  ]),

  waterAtmosphericContextObjectIds: Object.freeze([
    'OBJ_007_WATER_SURFACE_PLANE',
    'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    'OBJ_006_NEARSHORE_WAVE_BAND'
  ]),

  formula:
    'ContextVisibility = baseVisibility * contextScale * depthCompression * boundaryMultiplier',

  baseVisibility: Object.freeze({
    foreground: 1.0,
    shoreline: 0.95,
    water: 0.78,
    hearthContext: 0.70,
    audraliaContext: 0.58,
    atmosphericContext: 0.52
  }),

  boundaryMultiplier: Object.freeze({
    default: 1,
    contextOnly: 0.72,
    hearthContextOnly: 0.68,
    audraliaContextOnly: 0.58
  }),

  rules: Object.freeze({
    contextVisibilityDoesNotCreateTraversal: true,
    hearthContextOnly: true,
    audraliaContextOnly: true,
    waterSurfaceContextOnly: true,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    matrixCollapse: false
  }),

  boundary: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS
});

export const H_EARTH_3D_VIEWPORT_FIT_MODEL = Object.freeze({
  id: 'H_EARTH_3D_VIEWPORT_FIT_MODEL',
  source: 'H_EARTH_3D_RENDER_VOLUME_MODEL',

  previewContainer: H_EARTH_3D_RENDER_VOLUME_MODEL.previewContainer,

  overflowClasses: Object.freeze({
    noOverflow: 'NO_OVERFLOW',
    lawfulBoundarySpanningSurface: 'LAWFUL_BOUNDARY_SPANNING_SURFACE',
    lawfulContextSpanningObject: 'LAWFUL_CONTEXT_SPANNING_OBJECT',
    previewVolumeOverflow: 'PREVIEW_VOLUME_OVERFLOW',
    unauthorizedOpenWorldOverflow: 'UNAUTHORIZED_OPEN_WORLD_OVERFLOW'
  }),

  lawfulOverflowPrimitiveTypes: Object.freeze([
    'irregularShorelineBand',
    'waterPlane',
    'waterDepthBand',
    'curvedBand',
    'atmosphericLayer',
    'layeredSilhouette',
    'distantCluster'
  ]),

  formula:
    'ViewportFit = projectedBounds within previewContainer OR lawfulOverflowClass',

  boundary: Object.freeze({
    overflowClassificationOnly: true,
    openWorldOverflowClaim: false,
    expansionClaim: false,
    finalViewportClaim: false,
    visualPassClaim: false,
    validationClaim: false
  })
});

export const H_EARTH_3D_NODE_PRIORITY_MODEL = Object.freeze({
  id: 'H_EARTH_3D_NODE_PRIORITY_MODEL',
  formula:
    'NodePriority = focusPriority + inspectionEligibility + layerImportance + boundaryImportance - contextCompressionPenalty',

  preservationOrder: Object.freeze([
    'primary inspection target',
    'supporting inspection targets',
    'shoreline boundary',
    'water/earth contact cues',
    'manor exterior context silhouette',
    'distant Audralia context silhouette',
    'atmospheric depth/haze',
    'extra cluster details'
  ]),

  reductionOrder: Object.freeze([
    'reduce distant/context detail',
    'reduce atmospheric detail',
    'reduce cluster member count',
    'reduce secondary surface detail',
    'never remove boundary flags',
    'never remove matrix separation',
    'never remove primary inspection target'
  ]),

  weights: Object.freeze({
    focusPriorityMultiplier: 1.0,
    inspectionEligibleBoost: 1.0,
    primaryInspectionBoost: 1.5,
    supportingInspectionBoost: 0.85,
    shorelineBoundaryBoost: 0.55,
    contextPreservationBoost: 0.30,
    boundaryImportanceBoost: 0.50,
    contextCompressionPenalty: 0.25
  }),

  boundary: Object.freeze({
    deterministicReductionOnly: true,
    preserveByNodeId: true,
    objectIdUsedAsSecondaryMetadataOnly: true,
    neverRemoveBoundaryFlags: true,
    neverRemoveMatrixSeparation: true,
    neverRemovePrimaryInspectionTarget: true,
    visualPassClaim: false,
    validationClaim: false
  })
});

export const H_EARTH_3D_COMPOSITION_PRESSURE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_COMPOSITION_PRESSURE_MODEL',

  pressureClasses: Object.freeze({
    low: 'LOW',
    moderate: 'MODERATE',
    high: 'HIGH'
  }),

  thresholds: Object.freeze({
    lowMax: 0.34,
    moderateMax: 0.67,
    highMin: 0.67
  }),

  formula:
    'compositionPressure = clamp01((overflowPressure + nodeBudgetPressure + overlapPressure + contextCompressionPressure) / 4)',

  boundary: Object.freeze({
    pressureClassificationOnly: true,
    visualQualityClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  })
});

export function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value) {
  return clampNumber(value, 0, 1);
}

export function valuesDiffer(a, b) {
  return Math.abs(a - b) > Number.EPSILON;
}

export function positionsDiffer(a, b) {
  if (!a || !b) return true;

  return (
    valuesDiffer(a.x, b.x) ||
    valuesDiffer(a.y, b.y) ||
    valuesDiffer(a.z, b.z)
  );
}

export function getEnvironmentObject(objectId) {
  return H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS[objectId] || null;
}

export function getRendererNodeByNodeId(nodeId) {
  return H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes.find((node) => node.nodeId === nodeId) || null;
}

export function getRendererNodesByObjectId(objectId) {
  return Object.freeze(
    H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes.filter((node) => node.objectId === objectId)
  );
}

export function resolveFocusObjectCenter() {
  const primaryObject = getEnvironmentObject(
    H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId
  );

  if (primaryObject && primaryObject.center) {
    return primaryObject.center;
  }

  return H_EARTH_3D_CAMERA_CAPACITY.defaultLookAt;
}

export function resolveCameraFrame() {
  const focusCenter = resolveFocusObjectCenter();

  const defaultPosition = H_EARTH_3D_CAMERA_CAPACITY.defaultPosition;
  const defaultLookAt = H_EARTH_3D_CAMERA_CAPACITY.defaultLookAt;

  const focusOffset = Object.freeze({
    x: focusCenter.x * 0.08,
    y: 0,
    z: focusCenter.z * 0.04
  });

  const contextOffset = Object.freeze({
    x: 2.5,
    y: 0,
    z: 1.5
  });

  const unclampedPosition = Object.freeze({
    x: defaultPosition.x + focusOffset.x + contextOffset.x,
    y: defaultPosition.y,
    z: defaultPosition.z + focusOffset.z + contextOffset.z
  });

  const unclampedLookAt = Object.freeze({
    x: focusCenter.x,
    y: focusCenter.y ?? defaultLookAt.y,
    z: focusCenter.z
  });

  const unclampedTiltDegrees = 0;
  const unclampedZoom = 1;

  const clampedPosition = clampCameraPan(unclampedPosition);
  const clampedTiltDegrees = clampCameraTilt(unclampedTiltDegrees);
  const clampedZoom = clampCameraZoom(unclampedZoom);

  return Object.freeze({
    cameraFrameId: 'H_EARTH_3D_COMPOSITION_CAMERA_FRAME',
    cameraType: H_EARTH_3D_CAMERA_CAPACITY.cameraType,
    controlType: H_EARTH_3D_CAMERA_CAPACITY.controlType,

    defaultPosition,
    defaultLookAt,

    focusObjectId: H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId,
    focusCenter,
    focusFrameHint: getCameraFrameHint(H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId),

    focusOffset,
    contextOffset,

    unclampedPosition,
    clampedPosition,
    lookAt: unclampedLookAt,
    unclampedTiltDegrees,
    tiltDegrees: clampedTiltDegrees,
    unclampedZoom,
    zoom: clampedZoom,

    panClampApplied: true,
    tiltClampApplied: true,
    zoomClampApplied: true,

    panWasClamped: positionsDiffer(unclampedPosition, clampedPosition),
    tiltWasClamped: valuesDiffer(unclampedTiltDegrees, clampedTiltDegrees),
    zoomWasClamped: valuesDiffer(unclampedZoom, clampedZoom),

    forbiddenControls: H_EARTH_3D_CAMERA_CAPACITY.forbiddenControls,

    boundary: Object.freeze({
      cameraFrameDescriptorOnly: true,
      freeFlightClaim: false,
      walkClaim: false,
      swimClaim: false,
      openWorldTraversalClaim: false,
      manorEntryClaim: false,
      distantTraversalClaim: false,
      controllerActivationClaim: false,
      visualPassClaim: false,
      validationClaim: false
    })
  });
}

export function resolveDepthComposition(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];

  const depthEntries = nodes.map((node) => {
    const environmentObject = getEnvironmentObject(node.objectId);
    const normalizedDepth = environmentObject?.normalizedDepth ?? 0;
    const depthClass = environmentObject?.depthClass || 'out-of-bounds-depth';
    const primaryDepthClass = environmentObject?.primaryDepthClass || depthClass;
    const depthClassOrder =
      H_EARTH_3D_DEPTH_COMPOSITION_MODEL.depthClassOrder[primaryDepthClass] ??
      H_EARTH_3D_DEPTH_COMPOSITION_MODEL.depthClassOrder['out-of-bounds-depth'];

    return Object.freeze({
      objectId: node.objectId,
      nodeId: node.nodeId,
      layerId: node.layerId,
      layerOrder: node.layerOrder,
      normalizedDepth,
      depthClass,
      primaryDepthClass,
      depthClassOrder,
      contextScale: environmentObject?.contextScale ?? 1,
      depthSortKey: depthClassOrder + normalizedDepth,
      finalProjectionClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });
  });

  const sortedDepthEntries = Object.freeze(
    [...depthEntries].sort((a, b) => (
      a.depthSortKey - b.depthSortKey ||
      a.layerOrder - b.layerOrder ||
      String(a.nodeId).localeCompare(String(b.nodeId))
    ))
  );

  return Object.freeze({
    id: 'H_EARTH_3D_DEPTH_COMPOSITION',
    sourceDepthModel: H_EARTH_3D_DEPTH_MODEL,
    entries: Object.freeze(depthEntries),
    sortedEntries: sortedDepthEntries,
    entryCount: depthEntries.length,
    deterministicDepthOrdering: true,
    usesRuntimeEntropy: false,
    usesMathRandom: false,
    boundary: H_EARTH_3D_DEPTH_COMPOSITION_MODEL.boundary
  });
}

export function resolveFocusPriorityForNode(node) {
  if (!node) {
    return Object.freeze({
      objectId: null,
      nodeId: null,
      focusClass: H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.unclassified,
      focusPriority: 0
    });
  }

  const environmentObject = getEnvironmentObject(node.objectId);
  const weights = H_EARTH_3D_FOCUS_PRIORITY_MODEL.weights;

  const isPrimary =
    node.objectId === H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId;

  const isSupporting =
    H_EARTH_3D_FOCUS_PRIORITY_MODEL.supportingFocusObjectIds.includes(node.objectId);

  const inspectionEligible =
    environmentObject?.inspectionEligibility?.inspectionEligible === true;

  const contextOnly =
    environmentObject?.objectReference?.capability?.contextOnly === true;

  const zoneId = environmentObject?.zoneId || '';
  const normalizedDepth = environmentObject?.normalizedDepth ?? 1;

  const foregroundZoneWeight =
    zoneId === 'ZONE_001_FOREGROUND_INSPECTION_ZONE'
      ? weights.foregroundZoneWeight
      : 0;

  const shorelineZoneWeight =
    zoneId === 'ZONE_002_SHORELINE_CONTACT_ZONE'
      ? weights.shorelineZoneWeight
      : 0;

  const primaryTargetBoost = isPrimary ? weights.primaryTargetBoost : 0;
  const supportingTargetBoost = isSupporting ? weights.supportingTargetBoost : 0;
  const inspectableWeight = inspectionEligible ? weights.inspectableWeight : 0;
  const contextOnlyPenalty = contextOnly ? weights.contextOnlyPenalty : 0;
  const distantDepthPenalty = normalizedDepth * weights.distantDepthPenaltyMultiplier;
  const proximityWeight = (1 - clamp01(normalizedDepth)) * weights.proximityMultiplier;

  const rawFocusPriority =
    primaryTargetBoost +
    supportingTargetBoost +
    inspectableWeight +
    foregroundZoneWeight +
    shorelineZoneWeight +
    proximityWeight -
    contextOnlyPenalty -
    distantDepthPenalty;

  let focusClass = H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.unclassified;

  if (isPrimary) {
    focusClass = H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.primary;
  } else if (isSupporting) {
    focusClass = H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.supporting;
  } else if (contextOnly) {
    focusClass = H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.contextOnly;
  } else if (zoneId === 'ZONE_001_FOREGROUND_INSPECTION_ZONE') {
    focusClass = H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.surfaceContext;
  }

  return Object.freeze({
    objectId: node.objectId,
    nodeId: node.nodeId,
    focusClass,
    isPrimary,
    isSupporting,
    inspectionEligible,
    contextOnly,
    normalizedDepth,

    components: Object.freeze({
      primaryTargetBoost,
      supportingTargetBoost,
      inspectableWeight,
      foregroundZoneWeight,
      shorelineZoneWeight,
      proximityWeight,
      contextOnlyPenalty,
      distantDepthPenalty
    }),

    focusPriority: clampNumber(rawFocusPriority, 0, 3),
    focusDoesNotCreateTraversal: true,
    focusDoesNotCreateInteraction: true,
    focusDoesNotCreateReceipt: true
  });
}

export function resolveFocusPriority(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const entries = Object.freeze(nodes.map(resolveFocusPriorityForNode));

  const sortedEntries = Object.freeze(
    [...entries].sort((a, b) => (
      b.focusPriority - a.focusPriority ||
      String(a.nodeId).localeCompare(String(b.nodeId))
    ))
  );

  return Object.freeze({
    id: 'H_EARTH_3D_FOCUS_PRIORITY',
    primaryFocusObjectId: H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId,
    supportingFocusObjectIds: H_EARTH_3D_FOCUS_PRIORITY_MODEL.supportingFocusObjectIds,
    entries,
    sortedEntries,
    highestPriorityObjectId: sortedEntries[0]?.objectId || null,
    highestPriorityNodeId: sortedEntries[0]?.nodeId || null,
    primaryInspectionTargetPreserved:
      entries.some((entry) => entry.objectId === H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId),
    model: H_EARTH_3D_FOCUS_PRIORITY_MODEL,
    boundary: H_EARTH_3D_FOCUS_PRIORITY_MODEL.boundary
  });
}

export function resolveLayerSortKey(node, focusEntry) {
  const environmentObject = getEnvironmentObject(node.objectId);
  const adjustments = H_EARTH_3D_LAYER_COMPOSITION_MODEL.adjustments;

  const normalizedDepth = environmentObject?.normalizedDepth ?? 0;
  const contextOnly = environmentObject?.objectReference?.capability?.contextOnly === true;

  const normalizedDepthWeight = normalizedDepth * adjustments.normalizedDepthWeight;
  const contextDepthAdjustment = contextOnly ? adjustments.contextDepthAdjustment : 0;

  let focusLiftAdjustment = 0;

  if (focusEntry?.focusClass === H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.primary) {
    focusLiftAdjustment = adjustments.primaryFocusLiftAdjustment;
  } else if (focusEntry?.focusClass === H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.supporting) {
    focusLiftAdjustment = adjustments.supportingFocusLiftAdjustment;
  }

  return (
    node.layerOrder +
    normalizedDepthWeight +
    contextDepthAdjustment +
    focusLiftAdjustment
  );
}

export function resolveLayerComposition(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const focusPriority = resolveFocusPriority(nodes);

  const entries = nodes.map((node) => {
    const focusEntry = focusPriority.entries.find((entry) => entry.nodeId === node.nodeId);
    const sortKey = resolveLayerSortKey(node, focusEntry);

    return Object.freeze({
      objectId: node.objectId,
      nodeId: node.nodeId,
      layerId: node.layerId,
      layerOrder: node.layerOrder,
      normalizedDepth: getEnvironmentObject(node.objectId)?.normalizedDepth ?? 0,
      focusPriority: focusEntry?.focusPriority ?? 0,
      focusClass: focusEntry?.focusClass || H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.unclassified,
      layerSortKey: sortKey,
      deterministicSort: true
    });
  });

  const sortedEntries = Object.freeze(
    [...entries].sort((a, b) => (
      a.layerSortKey - b.layerSortKey ||
      a.layerOrder - b.layerOrder ||
      String(a.nodeId).localeCompare(String(b.nodeId))
    ))
  );

  return Object.freeze({
    id: 'H_EARTH_3D_LAYER_COMPOSITION',
    sourceLayerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,
    entries: Object.freeze(entries),
    sortedEntries,
    deterministicSort: true,
    usesRuntimeEntropy: false,
    usesMathRandom: false,
    domOrderDependent: false,
    boundary: H_EARTH_3D_LAYER_COMPOSITION_MODEL.boundary
  });
}

export function resolveContextCompositionForNode(node) {
  if (!node) return null;

  const environmentObject = getEnvironmentObject(node.objectId);
  if (!environmentObject) return null;

  const context = environmentObject.context || {};
  const objectReference = environmentObject.objectReference || {};
  const contextOnly = objectReference.capability?.contextOnly === true;

  const isHearthContext =
    H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.hearthContextObjectIds.includes(node.objectId);

  const isAudraliaContext =
    H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.audraliaContextObjectIds.includes(node.objectId);

  const isWaterAtmosphericContext =
    H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.waterAtmosphericContextObjectIds.includes(node.objectId);

  let baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.foreground;

  if (isHearthContext) {
    baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.hearthContext;
  } else if (isAudraliaContext) {
    baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.audraliaContext;
  } else if (isWaterAtmosphericContext && environmentObject.primitiveType === 'atmosphericLayer') {
    baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.atmosphericContext;
  } else if (isWaterAtmosphericContext) {
    baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.water;
  } else if (environmentObject.zoneId === 'ZONE_002_SHORELINE_CONTACT_ZONE') {
    baseVisibility = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.baseVisibility.shoreline;
  }

  let boundaryMultiplier = H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.boundaryMultiplier.default;

  if (isHearthContext) {
    boundaryMultiplier =
      H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.boundaryMultiplier.hearthContextOnly;
  } else if (isAudraliaContext) {
    boundaryMultiplier =
      H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.boundaryMultiplier.audraliaContextOnly;
  } else if (contextOnly) {
    boundaryMultiplier =
      H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.boundaryMultiplier.contextOnly;
  }

  const depthCompression = clampNumber(1 - environmentObject.normalizedDepth * 0.25, 0.2, 1);
  const contextScale = environmentObject.contextScale ?? 1;

  const contextVisibility = clamp01(
    baseVisibility * contextScale * depthCompression * boundaryMultiplier
  );

  return Object.freeze({
    objectId: node.objectId,
    nodeId: node.nodeId,
    contextOnly,
    hEarthOwned: context.hEarthOwned === true,
    hearthContextOnly: context.hearthContextOnly === true,
    audraliaContextOnly: context.audraliaContextOnly === true,
    waterAtmosphericContext: isWaterAtmosphericContext,

    baseVisibility,
    contextScale,
    depthCompression,
    boundaryMultiplier,
    contextVisibility,

    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    traversalClaim: false,
    matrixCollapse: false
  });
}

export function resolveContextComposition(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const entries = Object.freeze(
    nodes.map(resolveContextCompositionForNode).filter(Boolean)
  );

  return Object.freeze({
    id: 'H_EARTH_3D_CONTEXT_COMPOSITION',
    sourceContextCompression: H_EARTH_3D_CONTEXT_COMPRESSION,
    renderContextCompressionModel: H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL,
    entries,
    hearthContextObjectIds: H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.hearthContextObjectIds,
    audraliaContextObjectIds: H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.audraliaContextObjectIds,
    waterAtmosphericContextObjectIds:
      H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.waterAtmosphericContextObjectIds,
    rules: H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.rules,
    boundary: H_EARTH_3D_CONTEXT_COMPOSITION_MODEL.boundary
  });
}

export function normalizeRange(minValue, maxValue) {
  return Object.freeze({
    min: Math.min(minValue, maxValue),
    max: Math.max(minValue, maxValue)
  });
}

export function resolveProjectedBoundsForNode(node) {
  if (!node) return null;

  const environmentObject = getEnvironmentObject(node.objectId);
  if (!environmentObject || !environmentObject.bounds) return null;

  const multiplier = H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.unitToCssPixel;
  const yFactor = H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.yInversionFactor;
  const zMultiplier = H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.zDepthMultiplier;

  const projectedYMin = environmentObject.bounds.y.min * multiplier * yFactor;
  const projectedYMax = environmentObject.bounds.y.max * multiplier * yFactor;

  return Object.freeze({
    objectId: node.objectId,
    nodeId: node.nodeId,
    x: normalizeRange(
      environmentObject.bounds.x.min * multiplier,
      environmentObject.bounds.x.max * multiplier
    ),
    y: normalizeRange(projectedYMin, projectedYMax),
    z: normalizeRange(
      environmentObject.bounds.z.min * zMultiplier,
      environmentObject.bounds.z.max * zMultiplier
    ),
    yInversionNormalized: true,
    finalProjectionClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

export function resolvePreviewContainerBounds() {
  const container = H_EARTH_3D_RENDER_VOLUME_MODEL.previewContainer;
  const width = container.candidateWidthPx;
  const height = container.candidateHeightPx;
  const zMax = H_EARTH_3D_WORLD_BOUNDS.z.max * H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.zDepthMultiplier;
  const zMin = H_EARTH_3D_WORLD_BOUNDS.z.min * H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.zDepthMultiplier;

  return Object.freeze({
    x: Object.freeze({ min: -width / 2, max: width / 2 }),
    y: Object.freeze({ min: -height / 2, max: height / 2 }),
    z: normalizeRange(zMin, zMax),
    finalViewportClaim: false
  });
}

export function projectedBoundsWithinPreviewContainer(projectedBounds) {
  if (!projectedBounds) return false;

  const containerBounds = resolvePreviewContainerBounds();

  return (
    projectedBounds.x.min >= containerBounds.x.min &&
    projectedBounds.x.max <= containerBounds.x.max &&
    projectedBounds.y.min >= containerBounds.y.min &&
    projectedBounds.y.max <= containerBounds.y.max &&
    projectedBounds.z.min >= containerBounds.z.min &&
    projectedBounds.z.max <= containerBounds.z.max
  );
}

export function classifyViewportOverflow(node, projectedBounds = resolveProjectedBoundsForNode(node)) {
  if (!node) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.previewVolumeOverflow;
  }

  const environmentObject = getEnvironmentObject(node.objectId);

  if (!environmentObject || !projectedBounds) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.previewVolumeOverflow;
  }

  if (projectedBoundsWithinPreviewContainer(projectedBounds)) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.noOverflow;
  }

  if (environmentObject.zoneMembership?.boundarySpanningSurface === true) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.lawfulBoundarySpanningSurface;
  }

  if (environmentObject.zoneMembership?.contextSpanningObject === true) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.lawfulContextSpanningObject;
  }

  if (
    H_EARTH_3D_VIEWPORT_FIT_MODEL.lawfulOverflowPrimitiveTypes.includes(
      environmentObject.primitiveType
    )
  ) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.lawfulBoundarySpanningSurface;
  }

  if (environmentObject.centerWithinWorld === true) {
    return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.previewVolumeOverflow;
  }

  return H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.unauthorizedOpenWorldOverflow;
}

export function resolveViewportFit(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const previewContainerBounds = resolvePreviewContainerBounds();

  const entries = nodes.map((node) => {
    const environmentObject = getEnvironmentObject(node.objectId);
    const projectedBounds = resolveProjectedBoundsForNode(node);
    const projectedBoundsWithinContainer =
      projectedBoundsWithinPreviewContainer(projectedBounds);
    const overflowClass = classifyViewportOverflow(node, projectedBounds);

    return Object.freeze({
      objectId: node.objectId,
      nodeId: node.nodeId,
      primitiveType: environmentObject?.primitiveType || null,
      projectedBounds,
      previewContainerBounds,
      projectedBoundsWithinContainer,
      fullBoundsWithinWorld: environmentObject?.fullBoundsWithinWorld === true,
      boundsExceedPreviewVolume: environmentObject?.boundsExceedPreviewVolume === true,
      boundarySpanningSurface:
        environmentObject?.zoneMembership?.boundarySpanningSurface === true,
      contextSpanningObject:
        environmentObject?.zoneMembership?.contextSpanningObject === true,
      overflowClass,
      lawfulOverflow:
        overflowClass === H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.noOverflow ||
        overflowClass ===
          H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.lawfulBoundarySpanningSurface ||
        overflowClass ===
          H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.lawfulContextSpanningObject,
      openWorldOverflowClaim: false,
      expansionClaim: false,
      finalViewportClaim: false,
      visualPassClaim: false,
      validationClaim: false
    });
  });

  const unauthorizedOverflowCount = entries.filter(
    (entry) =>
      entry.overflowClass ===
      H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.unauthorizedOpenWorldOverflow
  ).length;

  const previewOverflowCount = entries.filter(
    (entry) =>
      entry.overflowClass ===
      H_EARTH_3D_VIEWPORT_FIT_MODEL.overflowClasses.previewVolumeOverflow
  ).length;

  const lawfulOverflowCount = entries.filter((entry) => entry.lawfulOverflow).length;

  const projectedBoundsWithinContainerCount = entries.filter(
    (entry) => entry.projectedBoundsWithinContainer === true
  ).length;

  return Object.freeze({
    id: 'H_EARTH_3D_VIEWPORT_FIT',
    model: H_EARTH_3D_VIEWPORT_FIT_MODEL,
    previewContainerBounds,
    entries: Object.freeze(entries),
    totalEntries: entries.length,
    projectedBoundsWithinContainerCount,
    lawfulOverflowCount,
    previewOverflowCount,
    unauthorizedOverflowCount,
    actualProjectedBoundsComparedToPreviewContainer: true,
    allOverflowClassified: true,
    openWorldOverflowClaim: false,
    expansionClaim: false,
    finalViewportClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

export function resolveNodePriority(node, focusEntry, contextEntry) {
  if (!node) return 0;

  const environmentObject = getEnvironmentObject(node.objectId);
  const weights = H_EARTH_3D_NODE_PRIORITY_MODEL.weights;

  const focusPriority = focusEntry?.focusPriority || 0;
  const inspectionEligible =
    environmentObject?.inspectionEligibility?.inspectionEligible === true;

  const isPrimary =
    node.objectId === H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId;

  const isSupporting =
    H_EARTH_3D_FOCUS_PRIORITY_MODEL.supportingFocusObjectIds.includes(node.objectId);

  const isShorelineBoundary =
    environmentObject?.zoneId === 'ZONE_002_SHORELINE_CONTACT_ZONE' ||
    environmentObject?.primitiveType === 'irregularShorelineBand';

  const contextOnly =
    environmentObject?.objectReference?.capability?.contextOnly === true;

  const focusComponent = focusPriority * weights.focusPriorityMultiplier;
  const inspectionComponent = inspectionEligible ? weights.inspectionEligibleBoost : 0;
  const primaryComponent = isPrimary ? weights.primaryInspectionBoost : 0;
  const supportingComponent = isSupporting ? weights.supportingInspectionBoost : 0;
  const shorelineComponent = isShorelineBoundary ? weights.shorelineBoundaryBoost : 0;
  const contextPreservationComponent = contextOnly ? weights.contextPreservationBoost : 0;
  const boundaryImportanceComponent = weights.boundaryImportanceBoost;
  const contextPenalty = contextOnly ? weights.contextCompressionPenalty : 0;

  const priority =
    focusComponent +
    inspectionComponent +
    primaryComponent +
    supportingComponent +
    shorelineComponent +
    contextPreservationComponent +
    boundaryImportanceComponent -
    contextPenalty;

  return clampNumber(priority, 0, 10);
}

export function resolveNodeBudgetComposition(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const focusPriority = resolveFocusPriority(nodes);
  const contextComposition = resolveContextComposition(nodes);
  const maxTotal = H_EARTH_3D_RENDER_NODE_BUDGET.maxTotalCandidateNodes;

  const entries = nodes.map((node) => {
    const focusEntry = focusPriority.entries.find((entry) => entry.nodeId === node.nodeId);
    const contextEntry = contextComposition.entries.find((entry) => entry.nodeId === node.nodeId);
    const nodePriority = resolveNodePriority(node, focusEntry, contextEntry);

    return Object.freeze({
      objectId: node.objectId,
      nodeId: node.nodeId,
      layerId: node.layerId,
      layerOrder: node.layerOrder,
      focusPriority: focusEntry?.focusPriority || 0,
      focusClass: focusEntry?.focusClass || H_EARTH_3D_FOCUS_PRIORITY_MODEL.focusClasses.unclassified,
      contextVisibility: contextEntry?.contextVisibility ?? 1,
      nodePriority,
      primaryInspectionTarget:
        node.objectId === H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId,
      supportingInspectionTarget:
        H_EARTH_3D_FOCUS_PRIORITY_MODEL.supportingFocusObjectIds.includes(node.objectId),
      boundaryFlagsPreserved: true,
      matrixSeparationPreserved: true
    });
  });

  const sortedByPriority = Object.freeze(
    [...entries].sort((a, b) => (
      b.nodePriority - a.nodePriority ||
      a.layerOrder - b.layerOrder ||
      String(a.nodeId).localeCompare(String(b.nodeId))
    ))
  );

  const budgetExceeded = entries.length > maxTotal;
  const preservedEntries = budgetExceeded
    ? sortedByPriority.slice(0, maxTotal)
    : sortedByPriority;

  const preservedNodeIds = new Set(preservedEntries.map((entry) => entry.nodeId));
  const preservedObjectIds = new Set(preservedEntries.map((entry) => entry.objectId));

  return Object.freeze({
    id: 'H_EARTH_3D_NODE_BUDGET_COMPOSITION',
    sourceBudget: H_EARTH_3D_RENDER_NODE_BUDGET,
    entries: Object.freeze(entries),
    sortedByPriority,
    preservedEntries: Object.freeze(preservedEntries),
    preservedNodeIds: Object.freeze([...preservedNodeIds]),
    preservedObjectIds: Object.freeze([...preservedObjectIds]),

    originalNodeCount: entries.length,
    budgetedNodeCount: preservedEntries.length,
    maxTotalCandidateNodes: maxTotal,
    budgetExceeded,
    reductionApplied: budgetExceeded,

    reductionPolicy: H_EARTH_3D_NODE_PRIORITY_MODEL.reductionOrder,
    preservationOrder: H_EARTH_3D_NODE_PRIORITY_MODEL.preservationOrder,

    reductionDeterministic: true,
    preservesByNodeId: true,
    objectIdUsedAsSecondaryMetadataOnly: true,
    boundaryFlagsPreserved: true,
    matrixSeparationPreserved: true,
    primaryInspectionTargetPreserved: preservedEntries.some(
      (entry) => entry.objectId === H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId
    )
  });
}

export function resolveCompositionPressure(candidateNodes = H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodes) {
  const nodes = candidateNodes || [];
  const viewportFit = resolveViewportFit(nodes);
  const nodeBudgetComposition = resolveNodeBudgetComposition(nodes);
  const contextComposition = resolveContextComposition(nodes);

  const overflowPressure = clamp01(
    (
      viewportFit.previewOverflowCount +
      viewportFit.unauthorizedOverflowCount * 2
    ) / Math.max(1, viewportFit.totalEntries)
  );

  const nodeBudgetPressure = clamp01(
    nodeBudgetComposition.budgetExceeded
      ? (nodeBudgetComposition.originalNodeCount - nodeBudgetComposition.budgetedNodeCount) /
          Math.max(1, nodeBudgetComposition.originalNodeCount)
      : 0
  );

  const contextEntries = contextComposition.entries;
  const averageContextCompression =
    contextEntries.length === 0
      ? 0
      : contextEntries.reduce((sum, entry) => (
          sum + (1 - clamp01(entry.contextVisibility))
        ), 0) / contextEntries.length;

  const contextCompressionPressure = clamp01(averageContextCompression);

  const overlapPressure = clamp01(
    nodes.filter((node) => {
      const environmentObject = getEnvironmentObject(node.objectId);
      return (
        environmentObject?.zoneMembership?.boundarySpanningSurface === true ||
        environmentObject?.zoneMembership?.contextSpanningObject === true
      );
    }).length / Math.max(1, nodes.length)
  );

  const pressureValue = clamp01(
    (
      overflowPressure +
      nodeBudgetPressure +
      overlapPressure +
      contextCompressionPressure
    ) / 4
  );

  let pressureClass = H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.pressureClasses.low;

  if (pressureValue > H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.thresholds.highMin) {
    pressureClass = H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.pressureClasses.high;
  } else if (pressureValue > H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.thresholds.lowMax) {
    pressureClass = H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.pressureClasses.moderate;
  }

  return Object.freeze({
    id: 'H_EARTH_3D_COMPOSITION_PRESSURE',
    pressureValue,
    pressureClass,

    components: Object.freeze({
      overflowPressure,
      nodeBudgetPressure,
      overlapPressure,
      contextCompressionPressure
    }),

    thresholds: H_EARTH_3D_COMPOSITION_PRESSURE_MODEL.thresholds,

    pressureClassificationOnly: true,
    visualQualityClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

export function resolveComposedNode(node) {
  if (!node) return null;

  const environmentObject = getEnvironmentObject(node.objectId);
  const focusEntry = resolveFocusPriorityForNode(node);
  const contextEntry = resolveContextCompositionForNode(node);
  const projectedBounds = resolveProjectedBoundsForNode(node);
  const viewportClass = classifyViewportOverflow(node, projectedBounds);
  const nodePriority = resolveNodePriority(node, focusEntry, contextEntry);

  return Object.freeze({
    composedNodeId: `h-earth-composed-node-${node.nodeId}`,
    sourceNodeId: node.nodeId,
    objectId: node.objectId,
    label: node.label,

    layerId: node.layerId,
    layerOrder: node.layerOrder,
    zoneId: node.zoneId,
    primitiveType: node.primitiveType,
    materialKey: node.materialKey,

    focus: focusEntry,
    contextComposition: contextEntry,
    projectedBounds,
    viewportOverflowClass: viewportClass,
    nodePriority,

    cssTransformDescriptor: node.cssTransform,
    materialToken: node.materialToken,
    primitiveGeometry: node.primitiveGeometry,
    inspectionAffordance: node.inspectionAffordance,

    center: environmentObject?.center || null,
    bounds: environmentObject?.bounds || null,
    normalizedDepth: environmentObject?.normalizedDepth ?? null,
    depthClass: environmentObject?.depthClass || null,
    primaryDepthClass: environmentObject?.primaryDepthClass || null,
    zoneMembership: environmentObject?.zoneMembership || null,

    context: environmentObject?.context || null,
    upstreamBoundary: node.boundary || null,

    claimFlags: Object.freeze({
      composedDescriptorOnly: true,
      candidateGeometryOnly: true,
      domDescriptorOnly: true,
      directDomMutation: false,
      routeIntegration: false,
      runtimeActivation: false,
      rendererActivation: false,
      canvasActivation: false,
      webglActivation: false,
      finalGeometryClaim: false,
      finalRendererClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      physicsClaim: false,
      collisionClaim: false,
      traversalClaim: false,
      survivalSimulationClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      manorInteriorAccessClaim: false,
      distantTraversalClaim: false,
      matrixCollapse: false
    })
  });
}

export function resolveComposedCandidateFrame() {
  const rendererScene = H_EARTH_3D_CANDIDATE_RENDER_SCENE;
  const candidateNodes = rendererScene.nodes || Object.freeze([]);

  const cameraFrame = resolveCameraFrame();
  const depthComposition = resolveDepthComposition(candidateNodes);
  const focusPriority = resolveFocusPriority(candidateNodes);
  const layerComposition = resolveLayerComposition(candidateNodes);
  const contextComposition = resolveContextComposition(candidateNodes);
  const viewportFit = resolveViewportFit(candidateNodes);
  const nodeBudgetComposition = resolveNodeBudgetComposition(candidateNodes);
  const compositionPressure = resolveCompositionPressure(candidateNodes);

  const preservedNodeIds = new Set(nodeBudgetComposition.preservedNodeIds);

  const composedNodes = Object.freeze(
    layerComposition.sortedEntries
      .map((entry) => getRendererNodeByNodeId(entry.nodeId))
      .filter((node) => node && preservedNodeIds.has(node.nodeId))
      .map(resolveComposedNode)
      .filter(Boolean)
  );

  return Object.freeze({
    frameId: 'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME',
    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    upstreamCapacityReceipt: getCapacityReceipt(),
    upstreamEnvironmentReceipt: getEnvironmentReceipt(),
    upstreamRendererReceipt: getRendererReceipt(),

    compositorContract: H_EARTH_3D_COMPOSITOR_CONTRACT,
    rendererContract: H_EARTH_3D_RENDERER_CONTRACT,

    cameraFrame,
    depthComposition,
    layerComposition,
    focusPriority,
    contextComposition,
    viewportFit,
    nodeBudgetComposition,
    compositionPressure,

    composedNodes,
    composedNodeCount: composedNodes.length,

    rendererScene,
    renderVolume: H_EARTH_3D_RENDER_VOLUME_MODEL,
    projectionModel: H_EARTH_3D_RENDER_PROJECTION_MODEL,
    zones: H_EARTH_3D_RESOLVED_ENVIRONMENT_ZONES,

    finalStableAnswer:
      'deterministic bounded non-rendering composition descriptor for H_EARTH_GROUND_CELL_001 around Inspect Ground',

    boundary: Object.freeze({
      composedCandidateFrameOnly: true,
      rendersScene: false,
      touchesDom: false,
      installsRoute: false,
      activatesRuntime: false,
      activatesRenderer: false,
      activatesCanvas: false,
      activatesWebGL: false,
      claimsFinalRenderer: false,
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

    matrixSeparation: Object.freeze({
      hEarth: 'Ground-View Matrix',
      hearth: 'support/control context only',
      audralia: 'planetary-world context only',
      matrixCollapse: false
    })
  });
}

export const H_EARTH_3D_COMPOSED_CANDIDATE_FRAME = resolveComposedCandidateFrame();

export const H_EARTH_3D_COMPOSITOR_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_COMPOSITOR_RECEIPT',
  file: '/showroom/globe/h-earth/compositor.js',
  status: 'DETERMINISTIC_COMPOSITOR_DESCRIPTOR_DEFINED_NON_RENDERING_RENEWED',

  renewedFrom: 'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025_v1',
  contractId: 'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025A_RENEWAL_CLEANUP_PACKET_v1',

  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',

  upstreamCapacityReceipt: getCapacityReceipt(),
  upstreamEnvironmentReceipt: H_EARTH_3D_ENVIRONMENT_RECEIPT,
  upstreamRendererReceipt: H_EARTH_3D_RENDERER_RECEIPT,

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  compositorContractDefined: true,
  compositionMathDefined: true,
  cameraFrameModelDefined: true,
  depthCompositionModelDefined: true,
  layerCompositionModelDefined: true,
  focusPriorityModelDefined: true,
  contextCompositionModelDefined: true,
  viewportFitModelDefined: true,
  nodePriorityModelDefined: true,
  compositionPressureModelDefined: true,

  cameraFrameResolved: true,
  depthCompositionResolved: true,
  layerCompositionResolved: true,
  focusPriorityResolved: true,
  contextCompositionResolved: true,
  viewportFitResolved: true,
  nodeBudgetCompositionResolved: true,
  compositionPressureResolved: true,
  composedCandidateFrameResolved: true,

  cleanupApplied: Object.freeze({
    unusedRendererInspectionAffordanceImportRemoved: true,
    actualViewportContainerFitComparisonAdded: true,
    nodeBudgetPreservesByNodeId: true,
    composedNodeResolutionUsesNodeId: true,
    projectedYBoundsNormalizedAfterInversion: true,
    clampFlagsClarified: true
  }),

  composedNodeCount: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.composedNodeCount,
  sourceCandidateRenderNodeCount: H_EARTH_3D_CANDIDATE_RENDER_SCENE.nodeCount,
  environmentCoverageRatio:
    H_EARTH_3D_ENVIRONMENT_COVERAGE_MODEL.environmentCoverageRatio,
  compositionPressureClass:
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.compositionPressure.pressureClass,

  primaryFocusObjectId: H_EARTH_3D_FOCUS_PRIORITY_MODEL.primaryFocusObjectId,
  primaryInspectionTargetPreserved:
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.nodeBudgetComposition.primaryInspectionTargetPreserved,
  boundaryFlagsPreserved:
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME.nodeBudgetComposition.boundaryFlagsPreserved,
  matrixSeparationPreserved: true,

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
    rendersScene: false,
    createsComposedDescriptors: true,
    touchesDom: false,
    installsRoute: false,
    activatesRuntime: false,
    activatesRenderer: false,
    activatesCanvas: false,
    activatesWebGL: false,
    claimsFinalRenderer: false,
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
  rendererBoundaryFlagsPreserved: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export function getCompositorReceipt() {
  return H_EARTH_3D_COMPOSITOR_RECEIPT;
}

export const H_EARTH_3D_COMPOSITOR = Object.freeze({
  id: 'H_EARTH_3D_COMPOSITOR',
  file: '/showroom/globe/h-earth/compositor.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  sourceRoot: '/h-earth-3d/',
  primaryRoute: '/showroom/globe/h-earth/',

  contract: H_EARTH_3D_COMPOSITOR_CONTRACT,
  compositionBoundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
  compositionMath: H_EARTH_3D_COMPOSITION_MATH,

  cameraFrameModel: H_EARTH_3D_CAMERA_FRAME_MODEL,
  depthCompositionModel: H_EARTH_3D_DEPTH_COMPOSITION_MODEL,
  layerCompositionModel: H_EARTH_3D_LAYER_COMPOSITION_MODEL,
  focusPriorityModel: H_EARTH_3D_FOCUS_PRIORITY_MODEL,
  contextCompositionModel: H_EARTH_3D_CONTEXT_COMPOSITION_MODEL,
  viewportFitModel: H_EARTH_3D_VIEWPORT_FIT_MODEL,
  nodePriorityModel: H_EARTH_3D_NODE_PRIORITY_MODEL,
  compositionPressureModel: H_EARTH_3D_COMPOSITION_PRESSURE_MODEL,

  upstreamCapacity: Object.freeze({
    cameraCapacity: H_EARTH_3D_CAMERA_CAPACITY,
    worldBounds: H_EARTH_3D_WORLD_BOUNDS,
    depthModel: H_EARTH_3D_DEPTH_MODEL,
    zoneBands: H_EARTH_3D_ZONE_BANDS,
    contextCompression: H_EARTH_3D_CONTEXT_COMPRESSION,
    inspectionAnchors: H_EARTH_3D_INSPECTION_ANCHORS,
    forbiddenCapabilityFlags: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS
  }),

  upstreamEnvironment: H_EARTH_3D_ENVIRONMENT,
  upstreamRenderer: H_EARTH_3D_RENDERER,

  composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  receipt: H_EARTH_3D_COMPOSITOR_RECEIPT
});

export default H_EARTH_3D_COMPOSITOR;
