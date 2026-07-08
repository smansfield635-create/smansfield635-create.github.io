// /showroom/globe/h-earth/renderer.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031C_SINGLE_PASS_GEOMETRY_EXPANSION_BINDING_v1
//
// Renews:
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031B_GEOMETRY_EXPANSION_PORT_BINDING_v1
//
// Purpose:
// Multi-port DOM/CSS-3D candidate renderer host with explicit mount/destroy API,
// renderer-owned projection scale shape, landscape-grade composed-node
// normalization, and single-pass Step 031 geometry expansion after compositor
// handoff only.
//
// Critical correction:
// - resolveCandidateRenderScene(...) returns 12 parent render descriptors.
// - The compositor must receive parent descriptors only.
// - Geometry expansion is applied only inside selectHEarthRenderInput(...)
//   after the composedCandidateFrame is selected for final mount.
// - This prevents the confirmed fault:
//   environment 12 → renderer candidate scene 96 → compositor 96 → mount
//   re-expansion → budget truncation.
//
// Boundary:
// - DOM/CSS3D candidate descriptors only.
// - No WebGL.
// - No canvas.
// - No SVG.
// - No final renderer claim.
// - No renderer-pass claim.
// - No visual-pass claim.
// - No validation claim.
// - No production claim.
// - No traversal.
// - No simulation.
// - No matrix collapse.

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

import {
  H_EARTH_3D_RENDER_GEOMETRY_PORT,
  expandHEarthCandidateGeometryNodes,
  getHEarthGeometryExpansionPortReceipt
} from './render/geometry.js';

export const H_EARTH_3D_RENDERER_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031C_SINGLE_PASS_GEOMETRY_EXPANSION_BINDING_v1',
  renewedFrom:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031B_GEOMETRY_EXPANSION_PORT_BINDING_v1',
  priorRendererBaseline:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023C_LANDSCAPE_GRADE_DOM_CSS3D_PROJECTION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass:
    'MULTI_PORT_DOM_CSS_3D_RENDERER_HOST_WITH_SINGLE_PASS_GEOMETRY_EXPANSION',
  status:
    'DETERMINISTIC_DOM_CSS_3D_CANDIDATE_RENDERER_HOST_DEFINED_SINGLE_PASS_GEOMETRY_EXPANSION_BOUND',

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
      'Step 031B renderer.js source supplied by user',
      'Step 031 geometry.js source supplied by user',
      'receipt-proven pre-expansion fault',
      'candidateRenderScene previously expanded before compositor',
      'composedCandidateFrame then re-expanded during mount',
      'budget truncation evidence',
      'single-pass geometry expansion correction'
    ])
  }),

  renewalScope: Object.freeze({
    step031bMountApiPreserved: true,
    step031bDestroyApiPreserved: true,
    step031bRenderSupportPortsPreserved: true,
    step031bProjectionScaleShapePreserved: true,
    step031bPreviewContainerPreserved: true,
    step031bLandscapeNormalizationPreserved: true,
    geometryPortImportCorrectedToActualExports: true,
    candidateRenderScenePreExpansionRemoved: true,
    compositorReceivesParentDescriptorsOnly: true,
    geometryExpansionAfterInputSelectionOnly: true,
    explicitMaxExpandedNodesPassedToGeometryPort: true,
    descriptorExportsPreserved: true,
    step029IndexCompatibilityPreserved: true
  }),

  rendererRole: Object.freeze({
    ownsProjectionConstants: true,
    ownsMountApi: true,
    ownsDestroyApi: true,
    ownsRendererHostContract: true,
    ownsRenderPortRegistry: true,
    orchestratesNodeMaterialLayerPorts: true,
    ownsLiveNodeLandscapeNormalization: true,
    ownsGeometryExpansionPortBinding: true,

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
  svgActivation: false,
  iframeActivation: false,
  scriptCreation: false,

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
  usesGeometryPort: true,

  candidateRenderSceneParentDescriptorsOnly: true,
  compositorReceivesUnexpandedCandidateScene: true,
  geometryExpansionAfterCompositorSelectionOnly: true,
  expandsGeometryBeforeFactory: true,

  noIndexRewriteRequiredByContract: true,
  step029CompatibilityTarget: true,

  boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export const H_EARTH_3D_RENDER_PROJECTION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_031C',
  renewedFrom: 'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_031B',
  projectionClass: 'CSS_3D_CANDIDATE_LANDSCAPE_PROJECTION_DESCRIPTOR',
  coordinateSystem: 'candidate-local-x-y-z',
  cssTransformUnit: 'px',

  scale: Object.freeze({
    unitToCssPixel: 9,
    yInversionFactor: -1,
    zDepthMultiplier: 3.2,

    source: 'CANON_RENDERER_LANDSCAPE_SCALE',
    rendererOwnedProjectionConstants: true,
    compositorMayNormalize: true,
    indexMayPatchProjectionMath: false,

    finalProjectionValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  }),

  landscapeProjection: Object.freeze({
    enabled: true,
    descriptorOnly: true,
    stageCenterXPx: 0,
    stageGroundYPx: 150,
    horizonYPx: -135,
    foregroundDepthBoost: 1.35,
    shorelineDepthBoost: 1.1,
    waterDepthBoost: 0.72,
    contextDepthBoost: 0.52,
    horizonDepthBoost: 0.38,
    defaultGroundTiltDegrees: 64,
    terrainTiltDegrees: 66,
    waterTiltDegrees: 71,
    shorelineTiltDegrees: 68,
    scatterTiltDegrees: 58,
    atmosphericTiltDegrees: 0,
    silhouetteTiltDegrees: 0,
    anchorTiltDegrees: 0,
    finalProjectionValidationClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  }),

  transformOrder: Object.freeze([
    'translate3d',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale3d'
  ]),

  projectionShapeStandard: Object.freeze({
    standardId:
      'H_EARTH_3D_RENDERER_COMPOSITOR_PROJECTION_SHAPE_STANDARD_PACKET_v1',
    requiredScaleShapePresent: true,
    requiredUnitToCssPixelPresent: true,
    requiredYInversionFactorPresent: true,
    requiredZDepthMultiplierPresent: true,
    compositorImportSafetySupported: true,
    indexSideProjectionPatchingForbidden: true
  }),

  finalProjectionValidationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_VOLUME_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_031C',
  renewedFrom: 'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_031B',
  previewVolumeOnly: true,
  css3dCandidateVolume: true,

  previewContainer: Object.freeze({
    containerId: 'h-earth-3d-renderer-mount',
    candidateWidthPx: 1180,
    candidateHeightPx: 720,
    routeScopedMountOnly: true,
    suppliedMountNodeRequired: true,
    rendererMayCreateInsideMountNodeOnly: true,
    rendererMayQueryGlobalDocument: false,
    rendererMayReplaceRouteShell: false,
    rendererMayReplaceIndexHtml: false,
    rendererMayReplaceIndexCss: false,
    domCss3DCandidateOnly: true,
    webglActivation: false,
    canvasActivation: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  }),

  renderBounds: Object.freeze({
    candidateBoundsOnly: true,
    finalViewportValidationClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  }),

  openWorldVolumeClaim: false,
  freeFlightClaim: false,
  walkingSystemClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  weatherSimulationClaim: false,
  survivalSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  matrixCollapse: false,

  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_MAP = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_GEOMETRY_MAP_STEP_031C',
  renewedFrom: 'H_EARTH_3D_RENDER_GEOMETRY_MAP_STEP_031B',
  geometryClass:
    'CANDIDATE_DESCRIPTOR_LANDSCAPE_GEOMETRY_MAP_WITH_SINGLE_PASS_EXPANSION_PORT',
  geometryPortBound: true,
  candidateScenePreExpansion: false,
  mountSelectionExpansionOnly: true,
  finalGeometryClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL_STEP_031C',
  file: '/showroom/globe/h-earth/renderer.js',
  portFile: '/showroom/globe/h-earth/render/geometry.js',
  geometryPortBound: true,
  expansionStage: 'after-compositor-handoff-before-node-factory',
  candidateRenderSceneExpansionAllowed: false,
  composedFrameExpansionAllowed: true,
  fallbackCandidateSceneExpansionAllowedAtMountOnly: true,
  expandsParentDescriptorsIntoCandidateChildDescriptors: true,
  consumesClusterMembers: true,
  consumesShapeVariation: true,
  consumesPrimitiveType: true,
  consumesMaterialKey: true,
  consumesExtent: true,
  consumesDepthClass: true,
  createsDomNodes: false,
  touchesDom: false,
  ownsNodeFactory: false,
  ownsLayerPlacement: false,
  candidateOnly: true,
  webglActivation: false,
  canvasActivation: false,
  finalGeometryClaim: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  traversalClaim: false,
  simulationClaim: false,
  matrixCollapse: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL_STEP_031C',
  candidateSurfaceSamplingOnly: true,
  geometryPortMayEmitSurfaceSamples: true,
  terrainEngineClaim: false,
  physicsClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL_STEP_031C',
  candidateShorelineCurveOnly: true,
  geometryPortMayEmitShorelineSegments: true,
  fluidSimulationClaim: false,
  swimmingClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CLUSTER_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CLUSTER_MODEL_STEP_031C',
  candidateClusterDescriptorsOnly: true,
  geometryPortMayEmitClusterChildDescriptors: true,
  collisionClaim: false,
  traversalClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL_STEP_031C',
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
  maxParentCandidateNodesBeforeGeometryExpansion: 96,
  maxTotalCandidateNodes: 192,
  maxExpandedCandidateNodesAfterGeometryExpansion: 192,
  maxSurfaceSampleNodes: 64,
  maxShorelineCurveNodes: 32,
  maxClusterNodes: 72,
  maxContextSilhouetteNodes: 24,
  maxAtmosphericNodes: 12,
  maxAnchorOverlayNodes: 8,
  budgetValidationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL_STEP_031C',
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
  geometryPort: H_EARTH_3D_RENDER_GEOMETRY_PORT,

  deferredPorts: Object.freeze({
    geometryPort: true,
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

export function clampHEarthRenderNumber(value, min, max, fallback = 0) {
  const numberValue = normalizeHEarthRenderNumber(value, fallback);
  return Math.max(min, Math.min(max, numberValue));
}

export function normalizeHEarthRenderToken(value, fallback = 'unresolved') {
  return String(value || fallback)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || fallback;
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
    object?.materialToken?.materialKey ||
    object?.materialIdentity?.materialKey ||
    object?.materialIdentity?.key ||
    object?.materialChannel?.materialKey ||
    object?.materialChannel?.sourceMaterialKey ||
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

export function resolveNodeCenter(object = {}) {
  const center =
    object.center ||
    object.position ||
    object.candidateTransform?.translate ||
    object.candidateTransform?.position ||
    object.projected?.position ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  return Object.freeze({
    x: normalizeHEarthRenderNumber(center.x, 0),
    y: normalizeHEarthRenderNumber(center.y, 0),
    z: normalizeHEarthRenderNumber(center.z, 0)
  });
}

export function resolveNodeExtent(object = {}) {
  const fallbackExtent = Object.freeze({
    x:
      normalizeHEarthRenderNumber(object?.bounds?.x?.max, 1) -
      normalizeHEarthRenderNumber(object?.bounds?.x?.min, -1),
    y:
      normalizeHEarthRenderNumber(object?.bounds?.y?.max, 1) -
      normalizeHEarthRenderNumber(object?.bounds?.y?.min, -1),
    z:
      normalizeHEarthRenderNumber(object?.bounds?.z?.max, 1) -
      normalizeHEarthRenderNumber(object?.bounds?.z?.min, -1)
  });

  const extent =
    object.extent ||
    object.candidateTransform?.extent ||
    object.primitiveGeometry?.extent ||
    object.sourceObject?.extent ||
    fallbackExtent;

  return Object.freeze({
    x: Math.max(0.1, Math.abs(normalizeHEarthRenderNumber(extent.x, 1))),
    y: Math.max(0.1, Math.abs(normalizeHEarthRenderNumber(extent.y, 1))),
    z: Math.max(0.1, Math.abs(normalizeHEarthRenderNumber(extent.z, 1)))
  });
}

export function resolveCandidateScaleTriplet(object = {}) {
  const rawScale =
    object.scale ??
    object.candidateTransform?.scale ??
    object.candidateTransform?.baseScale ??
    object.primitiveGeometry?.scaleTriplet?.scalar ??
    1;

  const contextScale = normalizeHEarthRenderNumber(
    object.candidateTransform?.contextScale ??
      object.contextScale ??
      object.primitiveGeometry?.scaleTriplet?.contextScale,
    1
  );

  if (typeof rawScale === 'number' || typeof rawScale === 'string') {
    const scalar = Math.max(0.01, normalizeHEarthRenderNumber(rawScale, 1));
    return Object.freeze({
      x: scalar * contextScale,
      y: scalar * contextScale,
      z: scalar * contextScale,
      scalar,
      contextScale,
      source: 'numeric-scale'
    });
  }

  const scaleX = normalizeHEarthRenderNumber(rawScale?.x, 1);
  const scaleY = normalizeHEarthRenderNumber(rawScale?.y, 1);
  const scaleZ = normalizeHEarthRenderNumber(rawScale?.z, 1);

  return Object.freeze({
    x: scaleX * contextScale,
    y: scaleY * contextScale,
    z: scaleZ * contextScale,
    scalar: Math.max(scaleX, scaleY, scaleZ),
    contextScale,
    source: 'object-scale'
  });
}

export function resolveCandidateRotation(object = {}) {
  const rotation =
    object.rotation ||
    object.rotate ||
    object.candidateTransform?.rotation ||
    object.candidateTransform?.rotate ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  return Object.freeze({
    x: normalizeHEarthRenderNumber(rotation.x, 0),
    y: normalizeHEarthRenderNumber(rotation.y, 0),
    z: normalizeHEarthRenderNumber(rotation.z, 0),
    source:
      object?.candidateTransform?.rotate ? 'candidateTransform.rotate' :
      object?.candidateTransform?.rotation ? 'candidateTransform.rotation' :
      object?.rotate ? 'rotate' :
      object?.rotation ? 'rotation' :
      'default'
  });
}

export function resolveDepthClassForNode(object = {}) {
  return (
    object.primaryDepthClass ||
    object.depthClass ||
    object.depthComposition?.primaryDepthClass ||
    object.depthComposition?.depthClass ||
    object.focus?.primaryDepthClass ||
    object.sourceObject?.primaryDepthClass ||
    object.sourceObject?.depthClass ||
    'foreground'
  );
}

export function resolveNormalizedDepthForNode(object = {}) {
  return clampHEarthRenderNumber(
    object.normalizedDepth ??
      object.focus?.normalizedDepth ??
      object.depthComposition?.normalizedDepth ??
      object.candidateTransform?.normalizedPosition?.normalizedDepth ??
      object.sourceObject?.normalizedDepth ??
      object.sourceObject?.normalizedPosition?.normalizedDepth,
    0,
    1,
    0.2
  );
}

export function resolvePrimitiveProjectionProfile(primitiveType, depthClass) {
  const primitive = String(primitiveType || 'unresolvedPrimitive');

  const defaultProfile = Object.freeze({
    profileId: 'default-object',
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleXMultiplier: 1,
    scaleYMultiplier: 1,
    scaleZMultiplier: 1,
    widthMultiplier: 1,
    heightMultiplier: 1,
    depthMultiplier: 1,
    translateYOffsetPx: 0,
    className: 'h-earth-landscape-object',
    groundPlane: false
  });

  const profiles = Object.freeze({
    contouredTerrainBand: Object.freeze({
      profileId: 'foreground-contoured-terrain-band',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .terrainTiltDegrees,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 1.18,
      scaleYMultiplier: 0.42,
      scaleZMultiplier: 0.72,
      widthMultiplier: 1.24,
      heightMultiplier: 0.72,
      depthMultiplier: 1,
      translateYOffsetPx: 96,
      className: 'h-earth-landscape-ground-plane',
      groundPlane: true
    }),

    terrainBand: Object.freeze({
      profileId: 'dry-sand-terrain-band',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .terrainTiltDegrees,
      rotateY: 0,
      rotateZ: -1.5,
      scaleXMultiplier: 1.08,
      scaleYMultiplier: 0.38,
      scaleZMultiplier: 0.68,
      widthMultiplier: 1.08,
      heightMultiplier: 0.58,
      depthMultiplier: 0.88,
      translateYOffsetPx: 44,
      className: 'h-earth-landscape-ground-plane',
      groundPlane: true
    }),

    irregularShorelineBand: Object.freeze({
      profileId: 'shoreline-foam-band',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .shorelineTiltDegrees,
      rotateY: 0,
      rotateZ: -1,
      scaleXMultiplier: 1.02,
      scaleYMultiplier: 0.18,
      scaleZMultiplier: 0.34,
      widthMultiplier: 1.12,
      heightMultiplier: 0.26,
      depthMultiplier: 0.54,
      translateYOffsetPx: -8,
      className: 'h-earth-landscape-shoreline-band',
      groundPlane: true
    }),

    waterDepthBand: Object.freeze({
      profileId: 'nearshore-wave-band',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .waterTiltDegrees,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 1.06,
      scaleYMultiplier: 0.2,
      scaleZMultiplier: 0.5,
      widthMultiplier: 1.18,
      heightMultiplier: 0.34,
      depthMultiplier: 0.66,
      translateYOffsetPx: -48,
      className: 'h-earth-landscape-water-band',
      groundPlane: true
    }),

    waterPlane: Object.freeze({
      profileId: 'water-surface-plane',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .waterTiltDegrees,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 1.18,
      scaleYMultiplier: 0.25,
      scaleZMultiplier: 0.7,
      widthMultiplier: 1.28,
      heightMultiplier: 0.58,
      depthMultiplier: 0.82,
      translateYOffsetPx: -86,
      className: 'h-earth-landscape-water-plane',
      groundPlane: true
    }),

    atmosphericLayer: Object.freeze({
      profileId: 'atmospheric-haze-layer',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 1,
      scaleYMultiplier: 0.62,
      scaleZMultiplier: 0.42,
      widthMultiplier: 1.24,
      heightMultiplier: 1.02,
      depthMultiplier: 0.42,
      translateYOffsetPx: -165,
      className: 'h-earth-landscape-atmosphere',
      groundPlane: false
    }),

    layeredSilhouette: Object.freeze({
      profileId: 'manor-context-silhouette',
      rotateX: 0,
      rotateY: -8,
      rotateZ: 0,
      scaleXMultiplier: 0.9,
      scaleYMultiplier: 1,
      scaleZMultiplier: 0.42,
      widthMultiplier: 0.74,
      heightMultiplier: 1.05,
      depthMultiplier: 0.4,
      translateYOffsetPx: -95,
      className: 'h-earth-landscape-context-silhouette',
      groundPlane: false
    }),

    distantCluster: Object.freeze({
      profileId: 'distant-rock-cluster',
      rotateX: 0,
      rotateY: -4,
      rotateZ: 0,
      scaleXMultiplier: 0.72,
      scaleYMultiplier: 0.82,
      scaleZMultiplier: 0.32,
      widthMultiplier: 0.72,
      heightMultiplier: 0.86,
      depthMultiplier: 0.32,
      translateYOffsetPx: -122,
      className: 'h-earth-landscape-distant-cluster',
      groundPlane: false
    }),

    scatterCluster: Object.freeze({
      profileId: 'surface-scatter-cluster',
      rotateX:
        H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection
          .scatterTiltDegrees,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 0.72,
      scaleYMultiplier: 0.72,
      scaleZMultiplier: 0.54,
      widthMultiplier: 0.72,
      heightMultiplier: 0.52,
      depthMultiplier: 0.48,
      translateYOffsetPx: 52,
      className: 'h-earth-landscape-surface-detail',
      groundPlane: true
    }),

    rockCluster: Object.freeze({
      profileId: 'foreground-rock-cluster',
      rotateX: 0,
      rotateY: -6,
      rotateZ: -3,
      scaleXMultiplier: 0.8,
      scaleYMultiplier: 1,
      scaleZMultiplier: 0.56,
      widthMultiplier: 0.72,
      heightMultiplier: 1,
      depthMultiplier: 0.5,
      translateYOffsetPx: 38,
      className: 'h-earth-landscape-rock-cluster',
      groundPlane: false
    }),

    inspectionAnchor: Object.freeze({
      profileId: 'inspection-anchor',
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleXMultiplier: 0.35,
      scaleYMultiplier: 0.35,
      scaleZMultiplier: 0.35,
      widthMultiplier: 0.32,
      heightMultiplier: 0.32,
      depthMultiplier: 0.32,
      translateYOffsetPx: 42,
      className: 'h-earth-landscape-inspection-anchor',
      groundPlane: false
    })
  });

  if (profiles[primitive]) {
    return profiles[primitive];
  }

  if (depthClass === 'horizon') {
    return profiles.distantCluster;
  }

  if (depthClass === 'water') {
    return profiles.waterPlane;
  }

  return defaultProfile;
}

export function resolveDepthProjectionMultiplier(depthClass, normalizedDepth) {
  const depth = clampHEarthRenderNumber(normalizedDepth, 0, 1, 0.2);
  const landscape = H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection;

  if (depthClass === 'foreground') {
    return landscape.foregroundDepthBoost * (1.08 - depth * 0.25);
  }

  if (depthClass === 'shoreline') {
    return landscape.shorelineDepthBoost * (0.98 - depth * 0.16);
  }

  if (depthClass === 'water') {
    return landscape.waterDepthBoost * (0.92 - depth * 0.12);
  }

  if (depthClass === 'context') {
    return landscape.contextDepthBoost * (0.88 - depth * 0.08);
  }

  if (depthClass === 'horizon') {
    return landscape.horizonDepthBoost * (0.82 - depth * 0.04);
  }

  return 1;
}

export function resolveProjectedPosition(object) {
  const center = resolveNodeCenter(object);
  const scale = H_EARTH_3D_RENDER_PROJECTION_MODEL.scale;
  const unitToCssPixel = normalizeHEarthRenderNumber(scale.unitToCssPixel, 9);
  const yInversionFactor = normalizeHEarthRenderNumber(
    scale.yInversionFactor,
    -1
  );
  const zDepthMultiplier = normalizeHEarthRenderNumber(
    scale.zDepthMultiplier,
    3.2
  );

  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const depthClass = resolveDepthClassForNode(object);
  const depthMultiplier = resolveDepthProjectionMultiplier(
    depthClass,
    normalizedDepth
  );

  const landscape = H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection;

  const projectedX =
    landscape.stageCenterXPx +
    center.x * unitToCssPixel * depthMultiplier;

  const projectedY =
    landscape.stageGroundYPx +
    center.y * yInversionFactor * unitToCssPixel -
    center.z * zDepthMultiplier * depthMultiplier +
    normalizedDepth * -42;

  const projectedZ =
    center.z * zDepthMultiplier * depthMultiplier +
    normalizedDepth * 260;

  return Object.freeze({
    x: center.x,
    y: center.y,
    z: center.z,
    unitToCssPixel,
    yInversionFactor,
    zDepthMultiplier,
    normalizedDepth,
    depthClass,
    depthProjectionMultiplier: depthMultiplier,
    projectedX,
    projectedY,
    projectedZ,
    projectionScaleSource: scale.source || 'CANON_RENDERER_LANDSCAPE_SCALE',
    projectionOnly: true,
    finalProjectionValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveLandscapeRenderDimensions(object = {}) {
  const extent = resolveNodeExtent(object);
  const primitiveType =
    object?.primitiveType ||
    object?.primitive?.primitiveType ||
    object?.primitiveSchema?.primitiveType ||
    'unresolvedPrimitive';

  const depthClass = resolveDepthClassForNode(object);
  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const profile = resolvePrimitiveProjectionProfile(primitiveType, depthClass);
  const scaleTriplet = resolveCandidateScaleTriplet(object);

  const widthPx = Math.max(
    8,
    extent.x *
      H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.unitToCssPixel *
      profile.widthMultiplier *
      Math.max(0.28, scaleTriplet.contextScale)
  );

  const heightPx = Math.max(
    6,
    Math.max(extent.y, extent.z * 0.32) *
      H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.unitToCssPixel *
      profile.heightMultiplier *
      Math.max(0.28, scaleTriplet.contextScale)
  );

  const depthPx = Math.max(
    1,
    extent.z *
      H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.zDepthMultiplier *
      profile.depthMultiplier
  );

  return Object.freeze({
    primitiveType,
    depthClass,
    normalizedDepth,
    profileId: profile.profileId,
    profileClassName: profile.className,
    groundPlane: profile.groundPlane,
    widthPx,
    heightPx,
    depthPx,
    extent,
    scaleTriplet,
    descriptorOnly: object?.descriptorOnly === false ? false : true,
    candidateGeometryOnly: object?.candidateGeometryOnly === true,
    finalGeometryClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveCssTransform(object) {
  const projected = resolveProjectedPosition(object);

  const primitiveType =
    object?.primitiveType ||
    object?.primitive?.primitiveType ||
    object?.primitiveSchema?.primitiveType ||
    'unresolvedPrimitive';

  const depthClass = resolveDepthClassForNode(object);
  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const profile = resolvePrimitiveProjectionProfile(primitiveType, depthClass);
  const candidateRotation = resolveCandidateRotation(object);
  const candidateScale = resolveCandidateScaleTriplet(object);

  const profileDepthScale = resolveDepthProjectionMultiplier(
    depthClass,
    normalizedDepth
  );

  const rotateX = normalizeHEarthRenderNumber(
    candidateRotation.x + profile.rotateX,
    profile.rotateX
  );
  const rotateY = normalizeHEarthRenderNumber(
    candidateRotation.y + profile.rotateY,
    profile.rotateY
  );
  const rotateZ = normalizeHEarthRenderNumber(
    candidateRotation.z + profile.rotateZ,
    profile.rotateZ
  );

  const scaleX = Math.max(
    0.05,
    normalizeHEarthRenderNumber(candidateScale.x, 1) *
      profile.scaleXMultiplier *
      profileDepthScale
  );

  const scaleY = Math.max(
    0.05,
    normalizeHEarthRenderNumber(candidateScale.y, 1) *
      profile.scaleYMultiplier *
      profileDepthScale
  );

  const scaleZ = Math.max(
    0.05,
    normalizeHEarthRenderNumber(candidateScale.z, 1) *
      profile.scaleZMultiplier *
      Math.max(0.2, profileDepthScale)
  );

  const translatedY = projected.projectedY + profile.translateYOffsetPx;

  const cssTransform = [
    `translate3d(${projected.projectedX}px, ${translatedY}px, ${projected.projectedZ}px)`,
    `rotateX(${rotateX}deg)`,
    `rotateY(${rotateY}deg)`,
    `rotateZ(${rotateZ}deg)`,
    `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`
  ].join(' ');

  return Object.freeze({
    cssTransform,
    projected,
    primitiveType,
    depthClass,
    normalizedDepth,
    profileId: profile.profileId,
    profileClassName: profile.className,
    groundPlane: profile.groundPlane,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
    profileDepthScale,
    candidateTransformOnly: true,
    landscapeProjectionApplied: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
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
  const primitiveGeometry = resolveLandscapeRenderDimensions(object);

  return Object.freeze({
    nodeId: object?.nodeId || object?.sourceNodeId || `render-node-${objectId}`,
    sourceNodeId:
      object?.sourceNodeId ||
      object?.nodeId ||
      object?.composedNodeId ||
      `render-node-${objectId}`,
    composedNodeId: object?.composedNodeId || null,
    objectId,
    objectLabel: object?.label || object?.objectLabel || objectId,
    label: object?.label || object?.objectLabel || objectId,

    primitiveType,
    materialKey: material.materialKey,
    materialToken: material,
    layerId,
    layerOrder:
      object?.layerOrder ??
      H_EARTH_3D_RENDER_LAYER_ORDER.find((layer) => layer.layerId === layerId)
        ?.order ??
      999,

    cssTransformDescriptor,
    primitiveGeometry,

    landscapeClassName: cssTransformDescriptor.profileClassName,
    primitiveClassName: `h-earth-primitive-${normalizeHEarthRenderToken(
      primitiveType
    )}`,
    renderWidthPx: primitiveGeometry.widthPx,
    renderHeightPx: primitiveGeometry.heightPx,
    renderDepthPx: primitiveGeometry.depthPx,

    candidateTransform: object?.candidateTransform || null,
    focus: object?.focus || null,
    contextComposition: object?.contextComposition || null,
    projectedBounds: object?.projectedBounds || null,
    viewportOverflowClass: object?.viewportOverflowClass || null,
    nodePriority: object?.nodePriority ?? null,
    normalizedDepth: primitiveGeometry.normalizedDepth,
    depthClass: primitiveGeometry.depthClass,
    primaryDepthClass: object?.primaryDepthClass || primitiveGeometry.depthClass,

    sourceObject: object?.sourceObject || object,

    geometryExpansion: object?.geometryExpansion || null,
    parentObjectId: object?.parentObjectId || object?.geometryExpansion?.parentObjectId || null,
    parentNodeId: object?.parentNodeId || object?.geometryExpansion?.parentNodeId || null,

    descriptorOnly: object?.descriptorOnly === false ? false : true,
    candidateGeometryOnly: object?.candidateGeometryOnly === true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveLandscapeRenderNode(node) {
  const normalized = resolvePrimitiveRenderGeometry(node);

  return Object.freeze({
    ...node,
    ...normalized,

    cssTransformDescriptor: normalized.cssTransformDescriptor,
    primitiveGeometry: normalized.primitiveGeometry,
    materialToken: normalized.materialToken,

    landscapeProjectionNormalized: true,
    landscapeProjectionContract:
      H_EARTH_3D_RENDERER_CONTRACT.contractId,

    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function normalizeLandscapeRenderNodes(nodes = []) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];

  return Object.freeze(
    safeNodes.map((node) => resolveLandscapeRenderNode(node))
  );
}

export function resolveGeometryPortReceiptSafe() {
  try {
    const receipt =
      typeof getHEarthGeometryExpansionPortReceipt === 'function'
        ? getHEarthGeometryExpansionPortReceipt()
        : H_EARTH_3D_RENDER_GEOMETRY_PORT?.receipt || null;

    return receipt || null;
  } catch (error) {
    return Object.freeze({
      receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT_UNAVAILABLE',
      available: false,
      failureCode: 'GEOMETRY_PORT_RECEIPT_EXCEPTION',
      message: String(error?.message || error || 'UNKNOWN_GEOMETRY_RECEIPT_ERROR'),
      claimBoundaryPreserved: true
    });
  }
}

export function applyExpandedRenderNodeBudget(nodes = []) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const maxExpanded =
    H_EARTH_3D_RENDER_NODE_BUDGET.maxExpandedCandidateNodesAfterGeometryExpansion ||
    H_EARTH_3D_RENDER_NODE_BUDGET.maxTotalCandidateNodes ||
    192;

  const limitedNodes = safeNodes.slice(0, maxExpanded);

  return Object.freeze({
    nodes: Object.freeze(limitedNodes),
    sourceNodeCount: safeNodes.length,
    returnedNodeCount: limitedNodes.length,
    nodeBudgetApplied: safeNodes.length > limitedNodes.length,
    skippedForBudget: Math.max(0, safeNodes.length - limitedNodes.length),
    maxExpanded,
    budgetValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function expandLandscapeRenderNodesWithGeometryPort({
  nodes = [],
  source = 'unknown',
  boundary = H_EARTH_3D_RENDER_BOUNDARY_FLAGS
} = {}) {
  const parentNodes = Array.isArray(nodes) ? nodes : [];
  const normalizedParentNodes = normalizeLandscapeRenderNodes(parentNodes);

  if (typeof expandHEarthCandidateGeometryNodes !== 'function') {
    return Object.freeze({
      nodes: normalizedParentNodes,
      rawNodes: normalizedParentNodes,
      parentNodes: normalizedParentNodes,
      source,
      geometryPortUsed: false,
      geometryExpansionApplied: false,
      geometryExpansionSource: source,
      geometrySourceNodeCount: normalizedParentNodes.length,
      geometryExpandedNodeCount: normalizedParentNodes.length,
      geometrySkippedNodeCount: 0,
      geometryParentNodeCount: normalizedParentNodes.length,
      geometryChildNodeCount: 0,
      geometryReceipt: resolveGeometryPortReceiptSafe(),
      warningCodes: Object.freeze(['GEOMETRY_PORT_FUNCTION_MISSING']),
      failureCodes: Object.freeze([]),
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      }),
      claimBoundaryPreserved: true
    });
  }

  try {
    const maxExpandedNodes =
      H_EARTH_3D_RENDER_NODE_BUDGET.maxExpandedCandidateNodesAfterGeometryExpansion ||
      H_EARTH_3D_RENDER_NODE_BUDGET.maxTotalCandidateNodes ||
      192;

    const expansion = expandHEarthCandidateGeometryNodes(
      normalizedParentNodes,
      Object.freeze({
        source,
        maxExpandedNodes,
        nodeBudget: H_EARTH_3D_RENDER_NODE_BUDGET,
        geometryExpansionModel: H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL,
        boundary: Object.freeze({
          ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
          ...boundary,
          claimBoundaryPreserved: true
        })
      })
    );

    const expandedNodes = Array.isArray(expansion?.nodes)
      ? expansion.nodes
      : normalizedParentNodes;

    const normalizedExpandedNodes =
      normalizeLandscapeRenderNodes(expandedNodes);

    const budgeted = applyExpandedRenderNodeBudget(normalizedExpandedNodes);

    const expansionWarningCodes = [
      ...(Array.isArray(expansion?.warningCodes) ? expansion.warningCodes : []),
      ...(Array.isArray(expansion?.geometryExpansionWarningCodes)
        ? expansion.geometryExpansionWarningCodes
        : []),
      ...(Array.isArray(expansion?.receipt?.geometryExpansionWarningCodes)
        ? expansion.receipt.geometryExpansionWarningCodes
        : [])
    ];

    if (budgeted.skippedForBudget > 0) {
      expansionWarningCodes.push('GEOMETRY_EXPANSION_BUDGET_TRUNCATED');
    }

    const expansionFailureCodes = [
      ...(Array.isArray(expansion?.failureCodes) ? expansion.failureCodes : []),
      ...(Array.isArray(expansion?.geometryExpansionFailureCodes)
        ? expansion.geometryExpansionFailureCodes
        : []),
      ...(Array.isArray(expansion?.receipt?.geometryExpansionFailureCodes)
        ? expansion.receipt.geometryExpansionFailureCodes
        : [])
    ];

    const geometrySourceNodeCount =
      Number.isFinite(Number(expansion?.sourceNodeCount))
        ? Number(expansion.sourceNodeCount)
        : normalizedParentNodes.length;

    const geometryExpandedNodeCount =
      Number.isFinite(Number(expansion?.expandedNodeCount))
        ? Number(expansion.expandedNodeCount)
        : normalizedExpandedNodes.length;

    const geometrySkippedNodeCount =
      Number.isFinite(Number(expansion?.geometryExpansionSkippedCount))
        ? Number(expansion.geometryExpansionSkippedCount)
        : Number.isFinite(Number(expansion?.receipt?.geometryExpansionSkippedCount))
          ? Number(expansion.receipt.geometryExpansionSkippedCount)
          : budgeted.skippedForBudget;

    const geometryParentNodeCount =
      Number.isFinite(Number(expansion?.descriptorParentNodeCount))
        ? Number(expansion.descriptorParentNodeCount)
        : Number.isFinite(Number(expansion?.receipt?.descriptorParentNodeCount))
          ? Number(expansion.receipt.descriptorParentNodeCount)
          : normalizedParentNodes.length;

    const geometryChildNodeCount =
      Number.isFinite(Number(expansion?.geometryChildNodeCount))
        ? Number(expansion.geometryChildNodeCount)
        : Number.isFinite(Number(expansion?.receipt?.geometryChildNodeCount))
          ? Number(expansion.receipt.geometryChildNodeCount)
          : Math.max(0, normalizedExpandedNodes.length - normalizedParentNodes.length);

    return Object.freeze({
      nodes: budgeted.nodes,
      rawNodes: Object.freeze(expandedNodes),
      parentNodes: normalizedParentNodes,
      source,
      geometryPortUsed: true,
      geometryExpansionApplied:
        expansion?.geometryExpansionAttempted === true ||
        expansion?.geometryExpansionApplied === true ||
        normalizedExpandedNodes.length !== normalizedParentNodes.length,
      geometryExpansionSource: expansion?.source || source,
      geometrySourceNodeCount,
      geometryExpandedNodeCount,
      geometryReturnedNodeCount: budgeted.returnedNodeCount,
      geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: budgeted.skippedForBudget,
      geometryParentNodeCount,
      geometryChildNodeCount,
      geometryReceipt:
        expansion?.receipt ||
        expansion?.geometryReceipt ||
        resolveGeometryPortReceiptSafe(),
      warningCodes: Object.freeze(expansionWarningCodes),
      failureCodes: Object.freeze(expansionFailureCodes),
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      }),
      claimBoundaryPreserved: true
    });
  } catch (error) {
    return Object.freeze({
      nodes: normalizedParentNodes,
      rawNodes: normalizedParentNodes,
      parentNodes: normalizedParentNodes,
      source,
      geometryPortUsed: true,
      geometryExpansionApplied: false,
      geometryExpansionSource: source,
      geometrySourceNodeCount: normalizedParentNodes.length,
      geometryExpandedNodeCount: normalizedParentNodes.length,
      geometryReturnedNodeCount: normalizedParentNodes.length,
      geometrySkippedNodeCount: 0,
      geometryBudgetSkippedNodeCount: 0,
      geometryParentNodeCount: normalizedParentNodes.length,
      geometryChildNodeCount: 0,
      geometryReceipt: resolveGeometryPortReceiptSafe(),
      warningCodes: Object.freeze([
        'GEOMETRY_EXPANSION_EXCEPTION_FALLBACK_TO_NORMALIZED_PARENT_NODES',
        String(error?.message || error || 'UNKNOWN_GEOMETRY_EXPANSION_ERROR')
      ]),
      failureCodes: Object.freeze([]),
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      }),
      claimBoundaryPreserved: true
    });
  }
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

export function applyParentRenderNodeBudget(nodes = []) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const maxTotal =
    H_EARTH_3D_RENDER_NODE_BUDGET.maxParentCandidateNodesBeforeGeometryExpansion ||
    96;

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

export function applyRenderNodeBudget(nodes = []) {
  return applyParentRenderNodeBudget(nodes);
}

export function resolveCandidateRenderScene({
  environmentObjects = H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS
} = {}) {
  const resolvedParentNodes = resolveCandidateRenderNodes(environmentObjects);
  const budgeted = applyParentRenderNodeBudget(resolvedParentNodes);

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

    candidateRenderSceneParentDescriptorsOnly: true,
    geometryPortUsed: false,
    geometryExpansionApplied: false,
    geometryExpansionDeferredUntilMountSelection: true,
    geometrySourceNodeCount: 0,
    geometryExpandedNodeCount: 0,
    geometrySkippedNodeCount: 0,
    geometryParentNodeCount: budgeted.returnedNodeCount,
    geometryChildNodeCount: 0,
    geometryReceipt: resolveGeometryPortReceiptSafe(),

    layerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,

    projectionModel: H_EARTH_3D_RENDER_PROJECTION_MODEL,
    renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
    geometryMap: H_EARTH_3D_RENDER_GEOMETRY_MAP,
    geometryExpansionModel: H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL,
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
    const expanded = expandLandscapeRenderNodesWithGeometryPort({
      nodes: composedNodes,
      source: 'composedCandidateFrame.composedNodes',
      boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
    });

    return Object.freeze({
      nodes: expanded.nodes,
      rawNodes: Object.freeze(composedNodes),
      normalizedParentNodes: expanded.parentNodes,
      geometryRawNodes: expanded.rawNodes,
      source: 'composedCandidateFrame.composedNodes',
      sourceDescriptorType: 'COMPOSED_CANDIDATE_FRAME',
      usedComposedFrame: true,
      usedRenderSceneFallback: false,
      nodeCount: expanded.nodes.length,
      rawNodeCount: composedNodes.length,
      landscapeNormalizationApplied: true,
      geometryPortUsed: expanded.geometryPortUsed,
      geometryExpansionApplied: expanded.geometryExpansionApplied,
      geometryExpansionSource: expanded.geometryExpansionSource,
      geometrySourceNodeCount: expanded.geometrySourceNodeCount,
      geometryExpandedNodeCount: expanded.geometryExpandedNodeCount,
      geometryReturnedNodeCount: expanded.geometryReturnedNodeCount,
      geometrySkippedNodeCount: expanded.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: expanded.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: expanded.geometryParentNodeCount,
      geometryChildNodeCount: expanded.geometryChildNodeCount,
      geometryReceipt: expanded.geometryReceipt,
      missingInput: false,
      warningCodes: Object.freeze([...expanded.warningCodes]),
      failureCodes: Object.freeze([...expanded.failureCodes]),
      claimBoundaryPreserved: true
    });
  }

  const candidateNodes = Array.isArray(candidateRenderScene?.nodes)
    ? candidateRenderScene.nodes
    : [];

  if (candidateNodes.length > 0) {
    const expanded = expandLandscapeRenderNodesWithGeometryPort({
      nodes: candidateNodes,
      source: 'candidateRenderScene.nodes',
      boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
    });

    return Object.freeze({
      nodes: expanded.nodes,
      rawNodes: Object.freeze(candidateNodes),
      normalizedParentNodes: expanded.parentNodes,
      geometryRawNodes: expanded.rawNodes,
      source: 'candidateRenderScene.nodes',
      sourceDescriptorType: 'CANDIDATE_RENDER_SCENE_FALLBACK',
      usedComposedFrame: false,
      usedRenderSceneFallback: true,
      nodeCount: expanded.nodes.length,
      rawNodeCount: candidateNodes.length,
      landscapeNormalizationApplied: true,
      geometryPortUsed: expanded.geometryPortUsed,
      geometryExpansionApplied: expanded.geometryExpansionApplied,
      geometryExpansionSource: expanded.geometryExpansionSource,
      geometrySourceNodeCount: expanded.geometrySourceNodeCount,
      geometryExpandedNodeCount: expanded.geometryExpandedNodeCount,
      geometryReturnedNodeCount: expanded.geometryReturnedNodeCount,
      geometrySkippedNodeCount: expanded.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: expanded.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: expanded.geometryParentNodeCount,
      geometryChildNodeCount: expanded.geometryChildNodeCount,
      geometryReceipt: expanded.geometryReceipt,
      missingInput: false,
      warningCodes: Object.freeze([
        'COMPOSED_FRAME_NODES_ABSENT_FALLBACK_USED',
        ...expanded.warningCodes
      ]),
      failureCodes: Object.freeze([...expanded.failureCodes]),
      claimBoundaryPreserved: true
    });
  }

  return Object.freeze({
    nodes: Object.freeze([]),
    rawNodes: Object.freeze([]),
    normalizedParentNodes: Object.freeze([]),
    geometryRawNodes: Object.freeze([]),
    source: 'none',
    sourceDescriptorType: 'NONE',
    usedComposedFrame: false,
    usedRenderSceneFallback: false,
    nodeCount: 0,
    rawNodeCount: 0,
    landscapeNormalizationApplied: false,
    geometryPortUsed: false,
    geometryExpansionApplied: false,
    geometryExpansionSource: 'none',
    geometrySourceNodeCount: 0,
    geometryExpandedNodeCount: 0,
    geometryReturnedNodeCount: 0,
    geometrySkippedNodeCount: 0,
    geometryBudgetSkippedNodeCount: 0,
    geometryParentNodeCount: 0,
    geometryChildNodeCount: 0,
    geometryReceipt: resolveGeometryPortReceiptSafe(),
    missingInput: true,
    warningCodes: Object.freeze([]),
    failureCodes: Object.freeze(['NO_DESCRIPTOR_NODES']),
    claimBoundaryPreserved: true
  });
}

export function resolveControllerTargetForRenderNode(node, controller) {
  const objectId =
    node?.parentObjectId ||
    node?.geometryExpansion?.parentObjectId ||
    node?.objectId ||
    node?.sourceObjectId ||
    null;

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
  landscapeNormalizationApplied = false,
  geometryPortUsed = false,
  geometryExpansionApplied = false,
  geometryExpansionSource = 'none',
  geometrySourceNodeCount = 0,
  geometryExpandedNodeCount = 0,
  geometryReturnedNodeCount = 0,
  geometrySkippedNodeCount = 0,
  geometryBudgetSkippedNodeCount = 0,
  geometryParentNodeCount = 0,
  geometryChildNodeCount = 0,
  geometryReceipt = null,
  sourceNodeCount = 0,
  rawSourceNodeCount = 0,
  objectNodeCount = 0,
  placedNodeCount = 0,
  skippedNodeCount = 0,
  labelNodeCount = 0,
  affordanceNodeCount = 0,
  materialPortUsed = false,
  layerPortUsed = false,
  nodeFactoryPortUsed = false,
  missingObjectCount = 0,
  transformDescriptorAppliedCount = 0,
  transformDescriptorMissingCount = 0,
  primitiveGeometryAppliedCount = 0,
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
    landscapeNormalizationApplied,

    candidateRenderScenePreExpanded: false,
    compositorReceivesParentDescriptorsOnly:
      selectedRenderInputSource === 'candidateRenderScene.nodes'
        ? true
        : undefined,
    geometryExpansionStage: geometryPortUsed
      ? 'after-input-selection-before-node-factory'
      : 'not-applied',

    geometryPortUsed,
    geometryExpansionApplied,
    geometryExpansionSource,
    geometrySourceNodeCount,
    geometryExpandedNodeCount,
    geometryReturnedNodeCount,
    geometrySkippedNodeCount,
    geometryBudgetSkippedNodeCount,
    geometryParentNodeCount,
    geometryChildNodeCount,
    geometryReceipt,

    sourceNodeCount,
    rawSourceNodeCount,

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
    transformDescriptorAppliedCount,
    transformDescriptorMissingCount,
    primitiveGeometryAppliedCount,

    warningCodes: Object.freeze(warningCodes),
    failureCodes: Object.freeze(failureCodes),

    createsDomCss3DCandidateNodes: rendererMounted === true,
    mountsCandidateDomDescriptors: rendererMounted === true,
    emitsLandscapeGradeCssTransforms:
      landscapeNormalizationApplied === true &&
      transformDescriptorAppliedCount > 0,
    emitsPrimitiveGeometryDescriptors: primitiveGeometryAppliedCount > 0,
    expandsGeometryDescriptors:
      geometryPortUsed === true && geometryExpansionApplied === true,
    mountsExpandedGeometryDescriptors:
      rendererMounted === true &&
      geometryPortUsed === true &&
      geometryChildNodeCount > 0 &&
      placedNodeCount > geometryParentNodeCount,

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
      landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,
      geometryPortUsed: selectedInput.geometryPortUsed,
      geometryExpansionApplied: selectedInput.geometryExpansionApplied,
      geometryExpansionSource: selectedInput.geometryExpansionSource,
      geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
      geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
      geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
      geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: selectedInput.geometryParentNodeCount,
      geometryChildNodeCount: selectedInput.geometryChildNodeCount,
      geometryReceipt: selectedInput.geometryReceipt,
      sourceNodeCount: 0,
      rawSourceNodeCount: selectedInput.rawNodeCount,
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
        landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,
        geometryPortUsed: selectedInput.geometryPortUsed,
        geometryExpansionApplied: selectedInput.geometryExpansionApplied,
        geometryExpansionSource: selectedInput.geometryExpansionSource,
        geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
        geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
        geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
        geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
        geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
        geometryParentNodeCount: selectedInput.geometryParentNodeCount,
        geometryChildNodeCount: selectedInput.geometryChildNodeCount,
        geometryReceipt: selectedInput.geometryReceipt,
        sourceNodeCount: selectedInput.nodeCount,
        rawSourceNodeCount: selectedInput.rawNodeCount,
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
        landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,
        geometryPortUsed: selectedInput.geometryPortUsed,
        geometryExpansionApplied: selectedInput.geometryExpansionApplied,
        geometryExpansionSource: selectedInput.geometryExpansionSource,
        geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
        geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
        geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
        geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
        geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
        geometryParentNodeCount: selectedInput.geometryParentNodeCount,
        geometryChildNodeCount: selectedInput.geometryChildNodeCount,
        geometryReceipt: selectedInput.geometryReceipt,
        sourceNodeCount: selectedInput.nodeCount,
        rawSourceNodeCount: selectedInput.rawNodeCount,
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
    let transformDescriptorAppliedCount = 0;
    let transformDescriptorMissingCount = 0;
    let primitiveGeometryAppliedCount = 0;

    const warningCodes = [
      ...(Array.isArray(selectedInput.warningCodes)
        ? selectedInput.warningCodes
        : []),
      ...(Array.isArray(layerResult.warningCodes)
        ? layerResult.warningCodes
        : [])
    ];

    const failureCodes = [
      ...(Array.isArray(selectedInput.failureCodes)
        ? selectedInput.failureCodes
        : [])
    ];

    selectedInput.nodes.forEach((node) => {
      const objectId = node?.objectId || node?.sourceObjectId || null;

      if (!objectId) {
        missingObjectCount += 1;
        skippedNodeCount += 1;
        warningCodes.push('NODE_SKIPPED_MISSING_OBJECT_ID');
        return;
      }

      const normalizedNode =
        node?.landscapeProjectionNormalized === true
          ? node
          : resolveLandscapeRenderNode(node);

      const classResolution = getHEarthRenderClassesForNode(
        normalizedNode,
        controller
      );

      const controllerTarget = resolveControllerTargetForRenderNode(
        normalizedNode,
        controller
      );

      const objectResult = createHEarthRenderObjectNode({
        node: normalizedNode,
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

      if (classResolution?.className) {
        classResolution.className
          .split(/\s+/)
          .filter(Boolean)
          .forEach((className) => objectResult.objectNode.classList.add(className));
      }

      if (normalizedNode.landscapeClassName) {
        objectResult.objectNode.classList.add(normalizedNode.landscapeClassName);
      }

      if (normalizedNode.primitiveClassName) {
        objectResult.objectNode.classList.add(normalizedNode.primitiveClassName);
      }

      if (normalizedNode.geometryExpansion) {
        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-port-id',
          String(normalizedNode.geometryExpansion.geometryPortId || '')
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-node-kind',
          String(normalizedNode.geometryExpansion.geometryNodeKind || '')
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-expanded-from-parent',
          normalizedNode.geometryExpansion.expandedFromParent === true
            ? 'true'
            : 'false'
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-parent-carry-node',
          normalizedNode.geometryExpansion.parentCarryNode === true
            ? 'true'
            : 'false'
        );
      }

      if (normalizedNode.parentObjectId) {
        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-parent-object-id',
          String(normalizedNode.parentObjectId)
        );
      }

      if (normalizedNode.parentNodeId) {
        objectResult.objectNode.setAttribute(
          'data-h-earth-geometry-parent-node-id',
          String(normalizedNode.parentNodeId)
        );
      }

      if (normalizedNode.primitiveGeometry) {
        objectResult.objectNode.setAttribute(
          'data-h-earth-primitive-profile',
          String(normalizedNode.primitiveGeometry.profileId)
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-landscape-projection-normalized',
          'true'
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-candidate-geometry-only',
          normalizedNode.candidateGeometryOnly === true ? 'true' : 'false'
        );

        objectResult.objectNode.setAttribute(
          'data-h-earth-descriptor-only',
          normalizedNode.descriptorOnly === true ? 'true' : 'false'
        );

        objectResult.objectNode.style.setProperty(
          '--h-earth-render-width',
          `${normalizedNode.primitiveGeometry.widthPx}px`
        );

        objectResult.objectNode.style.setProperty(
          '--h-earth-render-height',
          `${normalizedNode.primitiveGeometry.heightPx}px`
        );

        objectResult.objectNode.style.setProperty(
          '--h-earth-render-depth',
          `${normalizedNode.primitiveGeometry.depthPx}px`
        );

        objectResult.objectNode.style.setProperty(
          '--h-earth-render-depth-scale',
          String(normalizedNode.cssTransformDescriptor?.profileDepthScale ?? 1)
        );

        objectResult.objectNode.style.width =
          'var(--h-earth-render-width)';
        objectResult.objectNode.style.height =
          'var(--h-earth-render-height)';

        primitiveGeometryAppliedCount += 1;
      }

      objectNodeCount += 1;

      if (objectResult.transformApplied === true) {
        transformDescriptorAppliedCount += 1;
      } else {
        transformDescriptorMissingCount += 1;
      }

      if (options?.showLabels === true) {
        const labelResult = createHEarthRenderLabelNode({
          node: normalizedNode,
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
          node: normalizedNode,
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
        node: normalizedNode,
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

    if (transformDescriptorMissingCount > 0) {
      warningCodes.push('SOME_TRANSFORM_DESCRIPTORS_MISSING');
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
      landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,

      geometryPortUsed: selectedInput.geometryPortUsed,
      geometryExpansionApplied: selectedInput.geometryExpansionApplied,
      geometryExpansionSource: selectedInput.geometryExpansionSource,
      geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
      geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
      geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
      geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: selectedInput.geometryParentNodeCount,
      geometryChildNodeCount: selectedInput.geometryChildNodeCount,
      geometryReceipt: selectedInput.geometryReceipt,

      sourceNodeCount: selectedInput.nodeCount,
      rawSourceNodeCount: selectedInput.rawNodeCount,

      objectNodeCount,
      placedNodeCount,
      skippedNodeCount,
      labelNodeCount,
      affordanceNodeCount,

      materialPortUsed: true,
      layerPortUsed: true,
      nodeFactoryPortUsed: true,

      missingObjectCount,
      transformDescriptorAppliedCount,
      transformDescriptorMissingCount,
      primitiveGeometryAppliedCount,

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
      landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,

      geometryPortUsed: selectedInput.geometryPortUsed,
      geometryExpansionApplied: selectedInput.geometryExpansionApplied,
      geometryExpansionSource: selectedInput.geometryExpansionSource,
      geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
      geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
      geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
      geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: selectedInput.geometryParentNodeCount,
      geometryChildNodeCount: selectedInput.geometryChildNodeCount,
      geometryReceipt: selectedInput.geometryReceipt,

      sourceNodeCount: selectedInput.nodeCount,
      rawSourceNodeCount: selectedInput.rawNodeCount,
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
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031C_SINGLE_PASS_GEOMETRY_EXPANSION_BINDING_v1',
  renewedFrom:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031B_GEOMETRY_EXPANSION_PORT_BINDING_v1',
  priorRendererBaseline:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023C_LANDSCAPE_GRADE_DOM_CSS3D_PROJECTION_RENEWAL_v1',

  currentRouteChainLiveBaselinesRecoveredFromDrive: false,
  constructionBasis: Object.freeze([
    'Step 031B renderer.js source supplied by user',
    'Step 031 geometry.js source supplied by user',
    'receipt-proven pre-expansion fault',
    'candidateRenderScene previously expanded before compositor',
    'composedCandidateFrame then re-expanded during mount',
    'budget truncation evidence',
    'single-pass geometry expansion correction'
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
  geometryPortBound: true,
  geometryPortReceiptAvailable: Boolean(resolveGeometryPortReceiptSafe()),

  previewContainerPreservedForCompositorCompatibility: true,
  previewContainerCandidateWidthPxDefined: true,
  previewContainerCandidateHeightPxDefined: true,

  projectionScaleShapeDefined: true,
  projectionScaleUnitToCssPixelDefined: true,
  projectionScaleYInversionFactorDefined: true,
  projectionScaleZDepthMultiplierDefined: true,
  compositorProjectionShapeCompatibilitySupported: true,

  landscapeProjectionModelDefined: true,
  composedNodeLivePathNormalizationDefined: true,
  candidateRenderScenePreExpansionRemoved: true,
  candidateRenderSceneParentDescriptorsOnly: true,
  compositorReceivesParentDescriptorsOnly: true,
  geometryExpansionBeforeNodeFactoryDefined: true,
  geometryExpansionAfterCompositorHandoffOnly: true,
  explicitMaxExpandedNodesPassedToGeometryPort: true,
  cssTransformDescriptorEmissionDefined: true,
  primitiveGeometryDescriptorEmissionDefined: true,
  numericCandidateTransformScaleHandled: true,
  candidateTransformRotateHandled: true,

  step029IndexCompatibilityPreserved: true,
  aggregateExposesMountApi: true,
  aggregateExposesDestroyApi: true,

  dataOwnershipMarker: 'data-h-earth-render-owned="true"',
  composedFramePrimary: true,
  candidateRenderSceneFallbackOnly: true,

  createsDomCss3DCandidateNodes: true,
  mountsCandidateDomDescriptors: true,
  expandsCandidateGeometryDescriptorsAtMountOnly: true,

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
  geometryExpansionModel: H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL,
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

  normalizeHEarthRenderNumber,
  clampHEarthRenderNumber,
  normalizeHEarthRenderToken,
  resolveRenderLayer,
  resolveMaterialToken,
  resolveNodeCenter,
  resolveNodeExtent,
  resolveCandidateScaleTriplet,
  resolveCandidateRotation,
  resolveDepthClassForNode,
  resolveNormalizedDepthForNode,
  resolvePrimitiveProjectionProfile,
  resolveDepthProjectionMultiplier,
  resolveProjectedPosition,
  resolveLandscapeRenderDimensions,
  resolveCssTransform,
  resolvePrimitiveRenderGeometry,
  resolveLandscapeRenderNode,
  normalizeLandscapeRenderNodes,
  resolveGeometryPortReceiptSafe,
  applyExpandedRenderNodeBudget,
  expandLandscapeRenderNodesWithGeometryPort,
  resolveCandidateRenderNodes,
  applyParentRenderNodeBudget,
  applyRenderNodeBudget,
  resolveCandidateRenderScene,
  selectHEarthRenderInput,

  mountHEarthRenderer,
  destroyHEarthRenderer,

  getReceipt: getRendererReceipt,
  receipt: H_EARTH_3D_RENDERER_RECEIPT
});

export default H_EARTH_3D_RENDERER;
