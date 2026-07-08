// /showroom/globe/h-earth/renderer.js
// RENEWED FILE
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1
//
// Renews:
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1
//
// Craft basis:
// Current route-chain live baselines were not recovered from Drive. The renderer
// renewal is based on the existing in-room Step 023 renderer.js baseline, the
// accepted in-room canon chain, the Step 029 index.js call shape, the API
// structure approval, and recovered scratch context only.
//
// Purpose:
// Multi-port DOM/CSS-3D candidate renderer host with explicit mount/destroy API.
//
// This file preserves the descriptor-renderer role and adds renderer-side
// support ports for material class resolution, layer placement, DOM node
// creation, renderer-owned cleanup, and Step 029 bootstrap compatibility.
//
// This file does not own capacity law, environment object definitions,
// compositor ordering law, controller inspection law, route shell HTML, route
// CSS, WebGL, canvas, final renderer status, renderer-pass status, visual-pass
// status, validation status, production status, traversal, simulation, manor
// interior access, distant traversal, swimming, fluid simulation, weather
// simulation, survival simulation, or matrix collapse.

import {
  H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  H_EARTH_3D_ENVIRONMENT_RECEIPT
} from './environment.js';

import {
  H_EARTH_3D_RENDER_MATERIAL_PORT,
  getHEarthRenderClassesForNode
} from './render/materials.js';

import {
  H_EARTH_3D_RENDER_LAYER_PORT,
  createHEarthLayerContainers,
  placeHEarthNodeInLayer
} from './render/layers.js';

import {
  H_EARTH_3D_RENDER_NODE_FACTORY,
  isValidHEarthMountNode,
  createHEarthRenderRootNode,
  createHEarthRenderObjectNode,
  createHEarthRenderLabelNode,
  createHEarthRenderAffordanceNode,
  clearHEarthRendererOwnedNodes
} from './render/nodes.js';

export const H_EARTH_3D_RENDERER_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',
  renewedFrom: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',

  file: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'MULTI_PORT_DOM_CSS_3D_RENDERER_HOST_WITH_MOUNT_DESTROY_API',
  status:
    'DETERMINISTIC_DOM_CSS_3D_CANDIDATE_RENDERER_HOST_DEFINED_RENEWED',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  craftBasis: Object.freeze({
    currentRouteChainLiveBaselinesRecoveredFromDrive: false,
    constructionBasis: Object.freeze([
      'existing in-room Step 023 renderer.js baseline',
      'accepted in-room canon chain',
      'Step 029 index.js call shape',
      'API structure approval',
      'recovered scratch context only'
    ])
  }),

  renewalScope: Object.freeze({
    mountApiAdded: true,
    destroyApiAdded: true,
    selectRenderInputHelperAdded: true,
    renderPortsAdded: true,
    nodeFactoryPortAdded: true,
    materialPortAdded: true,
    layerPortAdded: true,
    step029IndexCompatibilityPreserved: true,
    descriptorExportsPreserved: true
  }),

  rendererRole: Object.freeze({
    ownsMountApi: true,
    ownsDestroyApi: true,
    ownsRendererHostContract: true,
    ownsRenderPortRegistry: true,
    orchestratesNodeMaterialLayerPorts: true,

    ownsCapacityLaw: false,
    ownsEnvironmentObjectDefinitions: false,
    ownsCompositorOrderingLaw: false,
    ownsControllerInspectionLaw: false,
    ownsRouteShellHtml: false,
    ownsRouteCss: false,
    ownsWebGL: false,
    ownsCanvas: false
  })
});

export const H_EARTH_3D_RENDER_BOUNDARY_FLAGS = Object.freeze({
  domCss3DCandidateNodesAllowed: true,
  mountInsideSuppliedMountNodeOnly: true,
  destroyRendererOwnedNodesOnly: true,

  webglActivation: false,
  canvasActivation: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,

  openWorldTraversalClaim: false,
  freeFlightClaim: false,
  walkingSystemClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  weatherSimulationClaim: false,
  survivalSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  matrixCollapse: false,

  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDERER_HOST_CONTRACT = Object.freeze({
  hostClass: 'DOM_CSS_3D_CANDIDATE_RENDERER_HOST',
  mountApi: 'mountHEarthRenderer',
  destroyApi: 'destroyHEarthRenderer',
  inputSelectionApi: 'selectHEarthRenderInput',

  publicAggregateMustExposeMountApi: true,
  publicAggregateMustExposeDestroyApi: true,

  domOwnershipMarker: 'data-h-earth-render-owned="true"',
  clearAuthoritySelector: '[data-h-earth-render-owned="true"]',

  boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export const H_EARTH_3D_RENDERER_MOUNT_CONTRACT = Object.freeze({
  mountSignature:
    'mountHEarthRenderer({ mountNode, renderer, candidateRenderScene, composedCandidateFrame, controller, options, boundary })',
  destroySignature:
    'destroyHEarthRenderer({ mountNode, boundary })',

  mountNodeRequired: true,
  composedCandidateFramePrimary: true,
  candidateRenderSceneFallbackOnly: true,

  clearsPriorRendererOwnedNodesOnly: true,
  createsDomCss3DCandidateNodesOnly: true,
  usesNodeFactoryPort: true,
  usesMaterialPort: true,
  usesLayerPort: true,

  noIndexRewriteRequiredByContract: true,
  step029CompatibilityTarget: true,

  boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export const H_EARTH_3D_RENDER_PROJECTION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_023A',
  projectionClass: 'CSS_3D_CANDIDATE_PROJECTION_DESCRIPTOR',
  coordinateSystem: 'candidate-local-x-y-z',
  cssTransformUnit: 'px',
  transformOrder: Object.freeze([
    'translate3d',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale'
  ]),
  finalProjectionValidationClaim: false,
  visualPassClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_VOLUME_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_023A',
  previewVolumeOnly: true,
  css3dCandidateVolume: true,
  openWorldVolumeClaim: false,
  finalRendererClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_MAP = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_GEOMETRY_MAP_STEP_023A',
  geometryClass: 'CANDIDATE_DESCRIPTOR_GEOMETRY_MAP',
  finalGeometryClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL_STEP_023A',
  candidateSurfaceSamplingOnly: true,
  terrainEngineClaim: false,
  physicsClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL_STEP_023A',
  candidateShorelineCurveOnly: true,
  fluidSimulationClaim: false,
  swimmingClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CLUSTER_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CLUSTER_MODEL_STEP_023A',
  candidateClusterDescriptorsOnly: true,
  collisionClaim: false,
  traversalClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL_STEP_023A',
  contextCompressionOnly: true,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  matrixCollapse: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_LAYER_ORDER = Object.freeze([
  Object.freeze({ layerId: 'distant-world-context-layer', order: 10 }),
  Object.freeze({ layerId: 'air-haze-light-layer', order: 20 }),
  Object.freeze({ layerId: 'water-surface-plane-layer', order: 30 }),
  Object.freeze({ layerId: 'nearshore-wave-band-layer', order: 40 }),
  Object.freeze({ layerId: 'shoreline-foam-line-layer', order: 50 }),
  Object.freeze({ layerId: 'manor-exterior-context-layer', order: 60 }),
  Object.freeze({ layerId: 'dry-sand-transition-layer', order: 70 }),
  Object.freeze({ layerId: 'foreground-wet-sand-layer', order: 80 }),
  Object.freeze({
    layerId: 'tide-pools-stones-rocks-detail-layer',
    order: 90
  }),
  Object.freeze({ layerId: 'inspection-anchor-overlay-layer', order: 100 })
]);

export const H_EARTH_3D_RENDER_MATERIAL_TOKENS = Object.freeze({
  wetSand: Object.freeze({ materialKey: 'wetSand' }),
  drySand: Object.freeze({ materialKey: 'drySand' }),
  foam: Object.freeze({ materialKey: 'foam' }),
  tidePool: Object.freeze({ materialKey: 'tidePool' }),
  stone: Object.freeze({ materialKey: 'stone' }),
  jaggedRock: Object.freeze({ materialKey: 'jaggedRock' }),
  water: Object.freeze({ materialKey: 'water' }),
  nearshoreWave: Object.freeze({ materialKey: 'nearshoreWave' }),
  airHaze: Object.freeze({ materialKey: 'airHaze' }),
  manorContext: Object.freeze({ materialKey: 'manorContext' }),
  distantRock: Object.freeze({ materialKey: 'distantRock' }),
  inspectionAnchor: Object.freeze({ materialKey: 'inspectionAnchor' })
});

export const H_EARTH_3D_RENDER_NODE_BUDGET = Object.freeze({
  maxTotalCandidateNodes: 96,
  maxSurfaceSampleNodes: 43,
  maxShorelineCurveNodes: 17,
  maxClusterNodes: 36,
  maxContextSilhouetteNodes: 14,
  maxAtmosphericNodes: 5,
  maxAnchorOverlayNodes: 5,
  budgetValidationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL_STEP_023A',
  descriptorAffordancesOnly: true,
  defaultAffordancesEnabled: false,
  actionExecutionClaim: false,
  routeControlBindingClaim: false,
  receiptCreationClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_PORTS = Object.freeze({
  nodeFactoryPort: H_EARTH_3D_RENDER_NODE_FACTORY,
  materialPort: H_EARTH_3D_RENDER_MATERIAL_PORT,
  layerPort: H_EARTH_3D_RENDER_LAYER_PORT,

  deferredPorts: Object.freeze({
    geometryPort: false,
    effectPort: false,
    controlsPort: false,
    inspectionAffordancePort: false
  }),

  boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export function normalizeHEarthRenderNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function resolveRenderLayer(objectId, node = {}) {
  const explicitLayer =
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    null;

  if (explicitLayer) {
    return explicitLayer;
  }

  const objectLayerMap = Object.freeze({
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: 'distant-world-context-layer',
    OBJ_008_AIR_HAZE_LIGHT_LAYER: 'air-haze-light-layer',
    OBJ_007_WATER_SURFACE_PLANE: 'water-surface-plane-layer',
    OBJ_006_NEARSHORE_WAVE_BAND: 'nearshore-wave-band-layer',
    OBJ_005_SHORELINE_FOAM_LINE: 'shoreline-foam-line-layer',
    OBJ_009_MANOR_EXTERIOR_CONTEXT: 'manor-exterior-context-layer',
    OBJ_003_DRY_SAND_TRANSITION: 'dry-sand-transition-layer',
    OBJ_002_FOREGROUND_WET_SAND: 'foreground-wet-sand-layer',
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES:
      'tide-pools-stones-rocks-detail-layer',
    OBJ_010_SMALL_BEACH_STONES: 'tide-pools-stones-rocks-detail-layer',
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 'tide-pools-stones-rocks-detail-layer',
    OBJ_001_GROUND_SPAWN_ANCHOR: 'inspection-anchor-overlay-layer'
  });

  return objectLayerMap[objectId] || 'unclassified-render-layer';
}

export function resolveMaterialToken(object) {
  const materialKey =
    object?.materialKey ||
    object?.materialIdentity?.materialKey ||
    object?.materialIdentity?.key ||
    object?.materialChannel?.materialKey ||
    object?.materialChannel?.key ||
    'unresolved';

  return Object.freeze({
    materialKey,
    token:
      H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey] ||
      Object.freeze({ materialKey: 'unresolved' }),
    resolved:
      Boolean(H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey]) === true,
    fallbackUsed:
      Boolean(H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey]) === false,
    claimBoundaryPreserved: true
  });
}

export function resolveProjectedPosition(object) {
  const center =
    object?.center ||
    object?.position ||
    object?.candidateTransform?.position ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  const x = normalizeHEarthRenderNumber(center.x, 0);
  const y = normalizeHEarthRenderNumber(center.y, 0);
  const z = normalizeHEarthRenderNumber(center.z, 0);

  return Object.freeze({
    x,
    y,
    z,
    projectedX: x,
    projectedY: -y,
    projectedZ: z,
    projectionOnly: true,
    finalProjectionValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveCssTransform(object) {
  const projected = resolveProjectedPosition(object);

  const rotation =
    object?.rotation ||
    object?.candidateTransform?.rotation ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  const scale =
    object?.scale ||
    object?.candidateTransform?.scale ||
    Object.freeze({ x: 1, y: 1, z: 1 });

  const rotateX = normalizeHEarthRenderNumber(rotation.x, 0);
  const rotateY = normalizeHEarthRenderNumber(rotation.y, 0);
  const rotateZ = normalizeHEarthRenderNumber(rotation.z, 0);

  const scaleX = normalizeHEarthRenderNumber(scale.x, 1);
  const scaleY = normalizeHEarthRenderNumber(scale.y, 1);
  const scaleZ = normalizeHEarthRenderNumber(scale.z, 1);

  const cssTransform = [
    `translate3d(${projected.projectedX}px, ${projected.projectedY}px, ${projected.projectedZ}px)`,
    `rotateX(${rotateX}deg)`,
    `rotateY(${rotateY}deg)`,
    `rotateZ(${rotateZ}deg)`,
    `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`
  ].join(' ');

  return Object.freeze({
    cssTransform,
    projected,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
    candidateTransformOnly: true,
    finalGeometryClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolvePrimitiveRenderGeometry(object) {
  const objectId = object?.objectId || object?.id || 'UNRESOLVED_OBJECT';
  const primitiveType =
    object?.primitiveType ||
    object?.primitiveSchema?.primitiveType ||
    object?.primitive?.primitiveType ||
    'unresolvedPrimitive';

  const material = resolveMaterialToken(object);
  const layerId = resolveRenderLayer(objectId, object);
  const cssTransformDescriptor = resolveCssTransform(object);

  return Object.freeze({
    nodeId: `render-node-${objectId}`,
    sourceNodeId: `render-node-${objectId}`,
    objectId,
    objectLabel: object?.label || object?.objectLabel || objectId,
    primitiveType,
    materialKey: material.materialKey,
    materialToken: material,
    layerId,
    layerOrder:
      H_EARTH_3D_RENDER_LAYER_ORDER.find((layer) => layer.layerId === layerId)
        ?.order ?? 999,
    cssTransformDescriptor,
    candidateTransform: object?.candidateTransform || null,
    sourceObject: object,
    descriptorOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveCandidateRenderNodes(
  environmentObjects = H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS
) {
  const sourceObjects = Array.isArray(environmentObjects)
    ? environmentObjects
    : Object.values(environmentObjects || {});

  return Object.freeze(
    sourceObjects.map((object) => resolvePrimitiveRenderGeometry(object))
  );
}

export function applyRenderNodeBudget(nodes = []) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const maxTotal = H_EARTH_3D_RENDER_NODE_BUDGET.maxTotalCandidateNodes;
  const limitedNodes = safeNodes.slice(0, maxTotal);

  return Object.freeze({
    nodes: Object.freeze(limitedNodes),
    sourceNodeCount: safeNodes.length,
    returnedNodeCount: limitedNodes.length,
    nodeBudgetApplied: safeNodes.length > limitedNodes.length,
    skippedForBudget: Math.max(0, safeNodes.length - limitedNodes.length),
    budgetValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveCandidateRenderScene({
  environmentObjects = H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS
} = {}) {
  const resolvedNodes = resolveCandidateRenderNodes(environmentObjects);
  const budgeted = applyRenderNodeBudget(resolvedNodes);

  return Object.freeze({
    sceneId: 'H_EARTH_3D_CANDIDATE_RENDER_SCENE',
    contractId: H_EARTH_3D_RENDERER_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDERER_CONTRACT.renewedFrom,
    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    nodes: budgeted.nodes,
    nodeCount: budgeted.returnedNodeCount,
    sourceNodeCount: budgeted.sourceNodeCount,
    layerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,

    projectionModel: H_EARTH_3D_RENDER_PROJECTION_MODEL,
    renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
    geometryMap: H_EARTH_3D_RENDER_GEOMETRY_MAP,
    surfaceSamplingModel: H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL,
    shorelineCurveModel: H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL,
    clusterModel: H_EARTH_3D_RENDER_CLUSTER_MODEL,
    contextCompressionModel: H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL,
    materialTokens: H_EARTH_3D_RENDER_MATERIAL_TOKENS,
    nodeBudget: H_EARTH_3D_RENDER_NODE_BUDGET,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export const H_EARTH_3D_CANDIDATE_RENDER_SCENE =
  resolveCandidateRenderScene();

export function selectHEarthRenderInput({
  candidateRenderScene,
  composedCandidateFrame
} = {}) {
  const composedNodes = Array.isArray(composedCandidateFrame?.composedNodes)
    ? composedCandidateFrame.composedNodes
    : [];

  if (composedNodes.length > 0) {
    return Object.freeze({
      nodes: Object.freeze(composedNodes),
      source: 'composedCandidateFrame.composedNodes',
      sourceDescriptorType: 'COMPOSED_CANDIDATE_FRAME',
      usedComposedFrame: true,
      usedRenderSceneFallback: false,
      nodeCount: composedNodes.length,
      missingInput: false,
      warningCodes: Object.freeze([]),
      failureCodes: Object.freeze([]),
      claimBoundaryPreserved: true
    });
  }

  const candidateNodes = Array.isArray(candidateRenderScene?.nodes)
    ? candidateRenderScene.nodes
    : [];

  if (candidateNodes.length > 0) {
    return Object.freeze({
      nodes: Object.freeze(candidateNodes),
      source: 'candidateRenderScene.nodes',
      sourceDescriptorType: 'CANDIDATE_RENDER_SCENE_FALLBACK',
      usedComposedFrame: false,
      usedRenderSceneFallback: true,
      nodeCount: candidateNodes.length,
      missingInput: false,
      warningCodes: Object.freeze(['COMPOSED_FRAME_NODES_ABSENT_FALLBACK_USED']),
      failureCodes: Object.freeze([]),
      claimBoundaryPreserved: true
    });
  }

  return Object.freeze({
    nodes: Object.freeze([]),
    source: 'none',
    sourceDescriptorType: 'NONE',
    usedComposedFrame: false,
    usedRenderSceneFallback: false,
    nodeCount: 0,
    missingInput: true,
    warningCodes: Object.freeze([]),
    failureCodes: Object.freeze(['NO_DESCRIPTOR_NODES']),
    claimBoundaryPreserved: true
  });
}

export function resolveControllerTargetForRenderNode(node, controller) {
  const objectId = node?.objectId || node?.sourceObjectId || null;

  if (!objectId || !controller) {
    return null;
  }

  if (controller.selectableTargetRegistry?.[objectId]) {
    return controller.selectableTargetRegistry[objectId];
  }

  if (controller.H_EARTH_3D_SELECTABLE_TARGET_REGISTRY?.[objectId]) {
    return controller.H_EARTH_3D_SELECTABLE_TARGET_REGISTRY[objectId];
  }

  return null;
}

export function buildRendererMountReceipt({
  rendererMounted = false,
  mountAttempted = true,
  mountNodeValid = false,
  renderRootCreated = false,
  priorOwnedNodesCleared = false,
  priorOwnedNodeCountRemoved = 0,
  layerContainersCreated = false,
  layerCount = 0,
  selectedRenderInputSource = 'none',
  sourceDescriptorType = 'NONE',
  usedComposedFrame = false,
  usedRenderSceneFallback = false,
  sourceNodeCount = 0,
  objectNodeCount = 0,
  placedNodeCount = 0,
  skippedNodeCount = 0,
  labelNodeCount = 0,
  affordanceNodeCount = 0,
  materialPortUsed = false,
  layerPortUsed = false,
  nodeFactoryPortUsed = false,
  missingObjectCount = 0,
  warningCodes = [],
  failureCodes = [],
  boundary = {}
} = {}) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',
    contractId: H_EARTH_3D_RENDERER_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDERER_CONTRACT.renewedFrom,

    rendererMounted,
    mounted: rendererMounted,
    mountAttempted,
    mountNodeAccepted: mountNodeValid,
    mountNodeValid,

    renderRootCreated,
    priorRendererOwnedNodesCleared: priorOwnedNodesCleared,
    priorOwnedNodesCleared,
    priorOwnedNodeCountRemoved,

    layerContainersCreated,
    layerContainerCount: layerCount,
    layerCount,

    selectedRenderInputSource,
    sourceDescriptorType,
    usedComposedFrame,
    usedRenderSceneFallback,
    sourceNodeCount,

    mountedNodeCount: objectNodeCount,
    objectNodeCount,
    placedNodeCount,
    skippedNodeCount,
    labelNodeCount,
    affordanceNodeCount,

    materialPortUsed,
    layerPortUsed,
    nodeFactoryPortUsed,

    missingObjectCount,

    warningCodes: Object.freeze(warningCodes),
    failureCodes: Object.freeze(failureCodes),

    createsDomCss3DCandidateNodes: rendererMounted === true,
    mountsCandidateDomDescriptors: rendererMounted === true,

    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true,

    boundary: Object.freeze({
      ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
      ...boundary,
      claimBoundaryPreserved: true
    }),

    matrixSeparation: Object.freeze({
      hEarth: 'Ground-View Matrix',
      hearth: 'support/control context only',
      audralia: 'planetary-world context only',
      matrixCollapse: false
    })
  });
}

export function buildRendererDestroyReceipt({
  destroyAttempted = true,
  destroyed = false,
  mountNodeValid = false,
  removedOwnedNodeCount = 0,
  warningCodes = [],
  failureCodes = [],
  boundary = {}
} = {}) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_DESTROY_RECEIPT',
    contractId: H_EARTH_3D_RENDERER_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDERER_CONTRACT.renewedFrom,

    destroyAttempted,
    destroyed,
    mountNodeAccepted: mountNodeValid,
    mountNodeValid,
    removedNodeCount: removedOwnedNodeCount,
    removedOwnedNodeCount,

    routeShellPreserved: true,
    canonDescriptorsPreserved: true,

    warningCodes: Object.freeze(warningCodes),
    failureCodes: Object.freeze(failureCodes),

    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true,

    boundary: Object.freeze({
      ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
      ...boundary,
      claimBoundaryPreserved: true
    }),

    matrixSeparation: Object.freeze({
      hEarth: 'Ground-View Matrix',
      hearth: 'support/control context only',
      audralia: 'planetary-world context only',
      matrixCollapse: false
    })
  });
}

export function mountHEarthRenderer({
  mountNode,
  renderer = null,
  candidateRenderScene = H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  composedCandidateFrame = null,
  controller = null,
  options = Object.freeze({}),
  boundary = Object.freeze({})
} = {}) {
  const mountValidation = isValidHEarthMountNode(mountNode);

  if (mountValidation.valid !== true) {
    return buildRendererMountReceipt({
      rendererMounted: false,
      mountNodeValid: false,
      warningCodes: Object.freeze([]),
      failureCodes: Object.freeze([
        mountValidation.reason || 'INVALID_MOUNT_NODE'
      ]),
      boundary
    });
  }

  const selectedInput = selectHEarthRenderInput({
    candidateRenderScene,
    composedCandidateFrame
  });

  if (selectedInput.nodeCount === 0) {
    const clearResult = clearHEarthRendererOwnedNodes({ mountNode });

    return buildRendererMountReceipt({
      rendererMounted: false,
      mountNodeValid: true,
      priorOwnedNodesCleared: clearResult.cleared === true,
      priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
      selectedRenderInputSource: selectedInput.source,
      sourceDescriptorType: selectedInput.sourceDescriptorType,
      usedComposedFrame: selectedInput.usedComposedFrame,
      usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
      sourceNodeCount: 0,
      materialPortUsed: true,
      layerPortUsed: true,
      nodeFactoryPortUsed: true,
      warningCodes: selectedInput.warningCodes,
      failureCodes: selectedInput.failureCodes,
      boundary
    });
  }

  try {
    const clearResult = clearHEarthRendererOwnedNodes({ mountNode });

    const receiptId = `H_EARTH_3D_RENDERER_MOUNT_${Date.now()}`;

    const rootResult = createHEarthRenderRootNode({
      mountNode,
      documentRef: mountNode.ownerDocument,
      receiptId,
      options
    });

    if (rootResult.created !== true || !rootResult.rootNode) {
      return buildRendererMountReceipt({
        rendererMounted: false,
        mountNodeValid: true,
        priorOwnedNodesCleared: clearResult.cleared === true,
        priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
        selectedRenderInputSource: selectedInput.source,
        sourceDescriptorType: selectedInput.sourceDescriptorType,
        usedComposedFrame: selectedInput.usedComposedFrame,
        usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
        sourceNodeCount: selectedInput.nodeCount,
        materialPortUsed: true,
        layerPortUsed: true,
        nodeFactoryPortUsed: true,
        warningCodes: Object.freeze([]),
        failureCodes: Object.freeze([
          rootResult.failureCode || 'RENDER_ROOT_CREATION_FAILED'
        ]),
        boundary
      });
    }

    mountNode.appendChild(rootResult.rootNode);

    const layerResult = createHEarthLayerContainers({
      renderRoot: rootResult.rootNode,
      layerOrder:
        composedCandidateFrame?.layerOrder ||
        candidateRenderScene?.layerOrder ||
        H_EARTH_3D_RENDER_LAYER_ORDER,
      composedCandidateFrame,
      candidateRenderScene
    });

    if (layerResult.created !== true) {
      return buildRendererMountReceipt({
        rendererMounted: false,
        mountNodeValid: true,
        renderRootCreated: true,
        priorOwnedNodesCleared: clearResult.cleared === true,
        priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
        selectedRenderInputSource: selectedInput.source,
        sourceDescriptorType: selectedInput.sourceDescriptorType,
        usedComposedFrame: selectedInput.usedComposedFrame,
        usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
        sourceNodeCount: selectedInput.nodeCount,
        materialPortUsed: true,
        layerPortUsed: true,
        nodeFactoryPortUsed: true,
        warningCodes: layerResult.warningCodes || Object.freeze([]),
        failureCodes: layerResult.failureCodes?.length
          ? layerResult.failureCodes
          : Object.freeze(['LAYER_CONTAINER_CREATION_FAILED']),
        boundary
      });
    }

    let objectNodeCount = 0;
    let placedNodeCount = 0;
    let skippedNodeCount = 0;
    let labelNodeCount = 0;
    let affordanceNodeCount = 0;
    let missingObjectCount = 0;

    const warningCodes = [
      ...(Array.isArray(selectedInput.warningCodes)
        ? selectedInput.warningCodes
        : []),
      ...(Array.isArray(layerResult.warningCodes)
        ? layerResult.warningCodes
        : [])
    ];

    const failureCodes = [];

    selectedInput.nodes.forEach((node) => {
      const objectId = node?.objectId || node?.sourceObjectId || null;

      if (!objectId) {
        missingObjectCount += 1;
        skippedNodeCount += 1;
        warningCodes.push('NODE_SKIPPED_MISSING_OBJECT_ID');
        return;
      }

      getHEarthRenderClassesForNode(node, controller);

      const controllerTarget = resolveControllerTargetForRenderNode(
        node,
        controller
      );

      const objectResult = createHEarthRenderObjectNode({
        node,
        controller,
        materialPort: H_EARTH_3D_RENDER_MATERIAL_PORT,
        options: {
          ...options,
          mountNode,
          renderRoot: rootResult.rootNode,
          documentRef: mountNode.ownerDocument
        }
      });

      if (objectResult.created !== true || !objectResult.objectNode) {
        skippedNodeCount += 1;
        warningCodes.push(
          objectResult.failureCode || 'OBJECT_NODE_CREATION_FAILED'
        );
        return;
      }

      objectNodeCount += 1;

      if (options?.showLabels === true) {
        const labelResult = createHEarthRenderLabelNode({
          node,
          controllerTarget,
          options: {
            ...options,
            mountNode,
            renderRoot: rootResult.rootNode,
            documentRef: mountNode.ownerDocument
          }
        });

        if (labelResult.created === true && labelResult.labelNode) {
          objectResult.objectNode.appendChild(labelResult.labelNode);
          labelNodeCount += 1;
        }
      }

      if (options?.showAffordances === true) {
        const affordanceResult = createHEarthRenderAffordanceNode({
          node,
          controllerTarget,
          options: {
            ...options,
            mountNode,
            renderRoot: rootResult.rootNode,
            documentRef: mountNode.ownerDocument
          }
        });

        if (
          affordanceResult.created === true &&
          affordanceResult.affordanceNode
        ) {
          objectResult.objectNode.appendChild(affordanceResult.affordanceNode);
          affordanceNodeCount += 1;
        }
      }

      const placement = placeHEarthNodeInLayer({
        objectNode: objectResult.objectNode,
        node,
        layerContainersById: layerResult.layerContainersById
      });

      if (placement.placed === true) {
        placedNodeCount += 1;

        if (Array.isArray(placement.warningCodes)) {
          warningCodes.push(...placement.warningCodes);
        }
      } else {
        skippedNodeCount += 1;
        warningCodes.push(placement.failureCode || 'NODE_PLACEMENT_FAILED');
      }
    });

    if (placedNodeCount === 0) {
      failureCodes.push('NO_NODES_PLACED');
    }

    if (skippedNodeCount > 0 && placedNodeCount > 0) {
      warningCodes.push('MOUNT_PARTIAL');
    }

    return buildRendererMountReceipt({
      rendererMounted: placedNodeCount > 0,
      mountNodeValid: true,
      renderRootCreated: true,
      priorOwnedNodesCleared: clearResult.cleared === true,
      priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
      layerContainersCreated: layerResult.created === true,
      layerCount: layerResult.layerCount || 0,

      selectedRenderInputSource: selectedInput.source,
      sourceDescriptorType: selectedInput.sourceDescriptorType,
      usedComposedFrame: selectedInput.usedComposedFrame,
      usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
      sourceNodeCount: selectedInput.nodeCount,

      objectNodeCount,
      placedNodeCount,
      skippedNodeCount,
      labelNodeCount,
      affordanceNodeCount,

      materialPortUsed: true,
      layerPortUsed: true,
      nodeFactoryPortUsed: true,

      missingObjectCount,

      warningCodes,
      failureCodes,
      boundary
    });
  } catch (error) {
    return buildRendererMountReceipt({
      rendererMounted: false,
      mountNodeValid: true,
      selectedRenderInputSource: selectedInput.source,
      sourceDescriptorType: selectedInput.sourceDescriptorType,
      usedComposedFrame: selectedInput.usedComposedFrame,
      usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
      sourceNodeCount: selectedInput.nodeCount,
      materialPortUsed: true,
      layerPortUsed: true,
      nodeFactoryPortUsed: true,
      warningCodes: Object.freeze([]),
      failureCodes: Object.freeze([
        'MOUNT_EXCEPTION',
        String(error?.message || error || 'UNKNOWN_MOUNT_EXCEPTION')
      ]),
      boundary
    });
  }
}

export function destroyHEarthRenderer({
  mountNode,
  boundary = Object.freeze({})
} = {}) {
  const mountValidation = isValidHEarthMountNode(mountNode);

  if (mountValidation.valid !== true) {
    return buildRendererDestroyReceipt({
      destroyed: false,
      mountNodeValid: false,
      removedOwnedNodeCount: 0,
      warningCodes: Object.freeze([]),
      failureCodes: Object.freeze([
        mountValidation.reason || 'INVALID_MOUNT_NODE'
      ]),
      boundary
    });
  }

  const clearResult = clearHEarthRendererOwnedNodes({ mountNode });

  if (clearResult.cleared !== true) {
    return buildRendererDestroyReceipt({
      destroyed: false,
      mountNodeValid: true,
      removedOwnedNodeCount: 0,
      warningCodes: Object.freeze([]),
      failureCodes: Object.freeze([
        clearResult.failureCode || 'DESTROY_CLEAR_FAILED'
      ]),
      boundary
    });
  }

  return buildRendererDestroyReceipt({
    destroyed: true,
    mountNodeValid: true,
    removedOwnedNodeCount: clearResult.removedCount || 0,
    warningCodes:
      clearResult.removedCount > 0
        ? Object.freeze([])
        : Object.freeze(['NO_RENDERER_OWNED_NODES_FOUND']),
    failureCodes: Object.freeze([]),
    boundary
  });
}

export const H_EARTH_3D_RENDERER_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDERER_RECEIPT',
  file: '/showroom/globe/h-earth/renderer.js',
  contractId:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',
  renewedFrom: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',

  currentRouteChainLiveBaselinesRecoveredFromDrive: false,
  constructionBasis: Object.freeze([
    'existing in-room Step 023 renderer.js baseline',
    'accepted in-room canon chain',
    'Step 029 index.js call shape',
    'API structure approval',
    'recovered scratch context only'
  ]),

  environmentReceiptPresent: Boolean(H_EARTH_3D_ENVIRONMENT_RECEIPT),

  descriptorRendererPreserved: true,
  mountApiDefined: true,
  destroyApiDefined: true,
  selectRenderInputHelperDefined: true,

  renderPortsDefined: true,
  nodeFactoryPortBound: true,
  materialPortBound: true,
  layerPortBound: true,

  step029IndexCompatibilityPreserved: true,
  aggregateExposesMountApi: true,
  aggregateExposesDestroyApi: true,

  dataOwnershipMarker: 'data-h-earth-render-owned="true"',
  composedFramePrimary: true,
  candidateRenderSceneFallbackOnly: true,

  createsDomCss3DCandidateNodes: true,
  mountsCandidateDomDescriptors: true,

  claimsFinalRenderer: false,
  claimsRendererPass: false,
  claimsVisualPass: false,
  claimsValidation: false,
  claimsProduction: false,

  boundary: Object.freeze({
    ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
    claimBoundaryPreserved: true
  }),

  claimBoundaryPreserved: true
});

export function getRendererReceipt() {
  return H_EARTH_3D_RENDERER_RECEIPT;
}

export const H_EARTH_3D_RENDERER = Object.freeze({
  id: 'H_EARTH_3D_RENDERER',
  file: '/showroom/globe/h-earth/renderer.js',

  contract: H_EARTH_3D_RENDERER_CONTRACT,
  hostContract: H_EARTH_3D_RENDERER_HOST_CONTRACT,
  mountContract: H_EARTH_3D_RENDERER_MOUNT_CONTRACT,
  boundaryFlags: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,

  projectionModel: H_EARTH_3D_RENDER_PROJECTION_MODEL,
  renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
  geometryMap: H_EARTH_3D_RENDER_GEOMETRY_MAP,
  surfaceSamplingModel: H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL,
  shorelineCurveModel: H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL,
  clusterModel: H_EARTH_3D_RENDER_CLUSTER_MODEL,
  contextCompressionModel: H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL,
  layerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,
  materialTokens: H_EARTH_3D_RENDER_MATERIAL_TOKENS,
  nodeBudget: H_EARTH_3D_RENDER_NODE_BUDGET,
  inspectionAffordanceModel: H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL,

  renderPorts: H_EARTH_3D_RENDER_PORTS,

  candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,

  resolveRenderLayer,
  resolveMaterialToken,
  resolveProjectedPosition,
  resolveCssTransform,
  resolvePrimitiveRenderGeometry,
  resolveCandidateRenderNodes,
  applyRenderNodeBudget,
  resolveCandidateRenderScene,
  selectHEarthRenderInput,

  mountHEarthRenderer,
  destroyHEarthRenderer,

  getReceipt: getRendererReceipt,
  receipt: H_EARTH_3D_RENDERER_RECEIPT
});

export default H_EARTH_3D_RENDERER;
