// /showroom/globe/h-earth/renderer.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1
//
// Renews:
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032D_OPTIMIZED_LATTICE_ADMISSION_RENDERER_WIRING_v1
//
// Complements:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032D_ORGANIC_LANDSCAPE_CHILD_VARIATION_v1
//
// Purpose:
// Robust DOM/CSS3D candidate renderer host with mount/destroy API,
// parent-only candidate scene output for compositor, guarded single-pass
// geometry expansion after final render-input selection, explicit landscape
// lattice admission forwarding, prepared render descriptors, deduplicated
// receipts, reduced repeated projection/class/material resolution, and
// synchronized forwarding/preservation of geometry 032D organic child-variation
// evidence.
//
// Boundary:
// DOM/CSS3D candidate descriptors only. No WebGL. No canvas. No SVG.
// No final renderer claim. No renderer-pass claim. No visual-pass claim.
// No validation claim. No production claim. No traversal. No simulation.
// No matrix collapse.

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

import {
  H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT,
  H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP,
  H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION,
  H_EARTH_256_LATTICE_LANDSCAPE_REGION_SUMMARY,
  H_EARTH_256_LATTICE_INSPECTION_ADDRESS_SUMMARY,
  H_EARTH_256_LATTICE_COMPATIBILITY_CHECK,
  H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT,
  getHEarthLandscapeLatticeMap,
  getHEarthLandscapeLatticeReceipt
} from '../../../h-earth-3d/zones/ground-cell-001.landscape-lattice.js';

export const H_EARTH_3D_RENDERER_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1',
  renewedFrom:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032D_OPTIMIZED_LATTICE_ADMISSION_RENDERER_WIRING_v1',
  complementaryGeometryPort:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032D_ORGANIC_LANDSCAPE_CHILD_VARIATION_v1',
  file: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  fileClass:
    'DOM_CSS_3D_RENDERER_HOST_WITH_GEOMETRY_032D_ORGANIC_VARIATION_SYNC',
  status:
    'CANDIDATE_RENDERER_HOST_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_BOUND',
  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  renewalScope: Object.freeze({
    candidateRenderScenePreExpansionRemoved: true,
    compositorReceivesParentDescriptorsOnly: true,
    geometryExpansionAfterInputSelectionOnly: true,
    alreadyExpandedInputGuardDefined: true,
    latticeBundleForwardedToGeometryPort: true,
    latticeAdmissionEvidenceNormalized: true,
    mountReceiptReportsLatticeAdmission: true,
    renderDescriptorPreparationPassDefined: true,
    duplicateWarningDeduplicationDefined: true,
    projectionDescriptorReuseDefined: true,
    classSurfaceCountingDefined: true,
    materialPortInjectionPreserved: true,
    layerPortInjectionPreserved: true,
    nodeFactoryCompatibilityPreserved: true,

    geometry032DOrganicVariationRecognized: true,
    geometryOrganicVariationEvidenceForwarded: true,
    primitiveSpecificChildPlacementEvidenceForwarded: true,
    latticeRegularBandingMitigationEvidenceForwarded: true,
    deterministicOrganicVariationEvidenceForwarded: true,
    organicClassSurfacePreserved: true,
    organicDataAttributeEmissionDefined: true,
    projectionPrimitiveParentFamilyPreserved: true,
    childPrimitiveEvidencePreserved: true,
    randomRuntimeVariationUsed: false
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
  alreadyExpandedInputGuardRequired: true,
  landscapeLatticeAdmissionRequiredForGeometryExpansion: true,
  geometry032DOrganicVariationSyncRequired: true,
  boundary: H_EARTH_3D_RENDER_BOUNDARY_FLAGS
});

export const H_EARTH_3D_RENDER_PROJECTION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_032E',
  renewedFrom: 'H_EARTH_3D_RENDER_PROJECTION_MODEL_STEP_032D',
  projectionClass: 'CSS_3D_CANDIDATE_LANDSCAPE_PROJECTION_DESCRIPTOR',
  coordinateSystem: 'candidate-local-x-y-z',
  cssTransformUnit: 'px',
  scale: Object.freeze({
    unitToCssPixel: 9,
    yInversionFactor: -1,
    zDepthMultiplier: 3.2,
    source: 'CANON_RENDERER_LANDSCAPE_SCALE',
    rendererOwnedProjectionConstants: true,
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
    projectionParentPrimitiveFamilyPreserved: true,
    childPrimitiveEvidencePreserved: true,
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
  finalProjectionValidationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_VOLUME_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_032E',
  renewedFrom: 'H_EARTH_3D_RENDER_VOLUME_MODEL_STEP_032D',
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
  openWorldVolumeClaim: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_MAP = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_GEOMETRY_MAP_STEP_032E',
  renewedFrom: 'H_EARTH_3D_RENDER_GEOMETRY_MAP_STEP_032D',
  geometryClass:
    'CANDIDATE_DESCRIPTOR_LANDSCAPE_GEOMETRY_MAP_WITH_GEOMETRY_032D_ORGANIC_VARIATION_SYNC',
  geometryPortBound: true,
  candidateScenePreExpansion: false,
  mountSelectionExpansionOnly: true,
  alreadyExpandedInputGuard: true,
  geometryPortDimensionPreservation: true,
  geometryPortClassPreservation: true,
  latticeAdmissionRequired: true,
  silentGeometryFallbackAllowed: false,
  organicLandscapeChildVariationRecognized: true,
  primitiveSpecificChildPlacementRecognized: true,
  geometry032DOrganicClassSurfaceRecognized: true,
  organicVariationEvidenceForwardingDefined: true,
  finalGeometryClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL_STEP_032E',
  renewedFrom: 'H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL_STEP_032D',
  file: '/showroom/globe/h-earth/renderer.js',
  portFile: '/showroom/globe/h-earth/render/geometry.js',
  geometryPortBound: true,
  geometry032DOrganicVariationExpected: true,
  expansionStage: 'after-compositor-handoff-before-node-factory',
  candidateRenderSceneExpansionAllowed: false,
  composedFrameExpansionAllowed: true,
  fallbackCandidateSceneExpansionAllowedAtMountOnly: true,
  alreadyExpandedInputGuard: true,
  expandsParentDescriptorsIntoCandidateChildDescriptors: true,
  forwardsLandscapeLatticeBundle: true,
  requiresGeometryLatticeAdmission: true,
  organicVariationAfterLatticeAdmission: true,
  deterministicVariationOnly: true,
  randomRuntimeVariationAllowed: false,
  primitiveSpecificChildPlacementExpected: true,
  cssDependentOrganicClassSurfaceExpected: true,
  silentFallbackUsedOnAdmissionFailure: false,
  createsDomNodes: false,
  touchesDom: false,
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
  modelId: 'H_EARTH_3D_RENDER_SURFACE_SAMPLING_MODEL_STEP_032E',
  candidateSurfaceSamplingOnly: true,
  geometryPortMayEmitSurfaceSamples: true,
  geometry032DOrganicVariationMayShapeSurfaceSamples: true,
  terrainEngineClaim: false,
  physicsClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_SHORELINE_CURVE_MODEL_STEP_032E',
  candidateShorelineCurveOnly: true,
  geometryPortMayEmitShorelineSegments: true,
  geometry032DOrganicVariationMayShapeShorelineSegments: true,
  fluidSimulationClaim: false,
  swimmingClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CLUSTER_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CLUSTER_MODEL_STEP_032E',
  candidateClusterDescriptorsOnly: true,
  geometryPortMayEmitClusterChildDescriptors: true,
  geometry032DOrganicVariationMayShapeClusterMembers: true,
  collisionClaim: false,
  traversalClaim: false,
  validationClaim: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL = Object.freeze({
  modelId: 'H_EARTH_3D_RENDER_CONTEXT_COMPRESSION_MODEL_STEP_032E',
  contextCompressionOnly: true,
  geometry032DOrganicVariationMayShapeContextSilhouettes: true,
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
  Object.freeze({ layerId: 'tide-pools-stones-rocks-detail-layer', order: 90 }),
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
  modelId: 'H_EARTH_3D_RENDER_INSPECTION_AFFORDANCE_MODEL_STEP_032E',
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
  supportPortWiring: Object.freeze({
    geometryPort: true,
    materialPort: true,
    layerPort: true,
    nodeFactoryPort: true,
    layerPortInjectedIntoNodeFactory: true,
    materialPortInjectedIntoNodeFactory: true,
    documentRefInjectedIntoNodeFactory: true,
    latticeBundleForwardedIntoGeometryPort: true,
    geometry032DOrganicVariationForwarded: true
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
  return (
    String(value || fallback)
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || fallback
  );
}

export function freezeHEarthArray(values = []) {
  return Object.freeze(Array.isArray(values) ? values : []);
}

export function uniqueHEarthRenderCodes(values = []) {
  const seen = new Set();

  return Object.freeze(
    (Array.isArray(values) ? values : [values])
      .flat()
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map((value) => {
        if (typeof value === 'string') return value;
        if (value?.code) return String(value.code);
        return value;
      })
      .filter((value) => {
        const key = typeof value === 'string' ? value : JSON.stringify(value);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
  );
}

export function resolveHEarthPortContractId(port, fallback = null) {
  return (
    port?.contract?.contractId ||
    port?.receipt?.contractId ||
    port?.CONTRACT?.contractId ||
    port?.id ||
    fallback
  );
}

export function resolveHEarthPortReceipt(port, fallbackReceiptType) {
  return (
    port?.receipt ||
    port?.getReceipt?.() ||
    Object.freeze({
      receiptType: fallbackReceiptType,
      available: Boolean(port),
      contractId: resolveHEarthPortContractId(port),
      claimBoundaryPreserved: true
    })
  );
}

export function resolveNodeFactoryReceiptSafe() {
  try {
    return resolveHEarthPortReceipt(
      H_EARTH_3D_RENDER_NODE_FACTORY,
      'H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT_REFERENCE'
    );
  } catch (error) {
    return Object.freeze({
      receiptType: 'H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT_UNAVAILABLE',
      available: false,
      failureCode: 'NODE_FACTORY_RECEIPT_EXCEPTION',
      message: String(error?.message || error || 'UNKNOWN_NODE_FACTORY_RECEIPT_ERROR'),
      claimBoundaryPreserved: true
    });
  }
}

export function resolveMaterialPortReceiptSafe() {
  try {
    return resolveHEarthPortReceipt(
      H_EARTH_3D_RENDER_MATERIAL_PORT,
      'H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT_REFERENCE'
    );
  } catch (error) {
    return Object.freeze({
      receiptType: 'H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT_UNAVAILABLE',
      available: false,
      failureCode: 'MATERIAL_PORT_RECEIPT_EXCEPTION',
      message: String(error?.message || error || 'UNKNOWN_MATERIAL_PORT_RECEIPT_ERROR'),
      claimBoundaryPreserved: true
    });
  }
}

export function resolveLayerPortReceiptSafe() {
  try {
    return resolveHEarthPortReceipt(
      H_EARTH_3D_RENDER_LAYER_PORT,
      'H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT_REFERENCE'
    );
  } catch (error) {
    return Object.freeze({
      receiptType: 'H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT_UNAVAILABLE',
      available: false,
      failureCode: 'LAYER_PORT_RECEIPT_EXCEPTION',
      message: String(error?.message || error || 'UNKNOWN_LAYER_PORT_RECEIPT_ERROR'),
      claimBoundaryPreserved: true
    });
  }
}

export function resolveDefaultHEarthLandscapeLatticeBundle() {
  let map = H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP || Object.freeze({});
  let receipt = H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT || null;

  try {
    if (typeof getHEarthLandscapeLatticeMap === 'function') {
      map = getHEarthLandscapeLatticeMap();
    }
  } catch (error) {
    map = H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP || Object.freeze({});
  }

  try {
    if (typeof getHEarthLandscapeLatticeReceipt === 'function') {
      receipt = getHEarthLandscapeLatticeReceipt();
    }
  } catch (error) {
    receipt = H_EARTH_256_LATTICE_LANDSCAPE_RECEIPT || null;
  }

  return Object.freeze({
    contract: H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT || null,
    map,
    receipt,
    rowOrientation: H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION || null,
    regionSummary: H_EARTH_256_LATTICE_LANDSCAPE_REGION_SUMMARY || null,
    inspectionAddressSummary:
      H_EARTH_256_LATTICE_INSPECTION_ADDRESS_SUMMARY || null,
    compatibilityCheck: H_EARTH_256_LATTICE_COMPATIBILITY_CHECK || null,
    source: 'renderer-default-imported-landscape-lattice',
    descriptorOnly: true,
    runtimeLatticeActivation: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthRendererLandscapeLatticeBundle({
  renderer = null,
  candidateRenderScene = null,
  composedCandidateFrame = null,
  options = Object.freeze({}),
  context = Object.freeze({})
} = {}) {
  const explicit =
    options?.landscapeLatticeBundle ||
    options?.landscapeLattice ||
    options?.lattice ||
    context?.landscapeLatticeBundle ||
    context?.landscapeLattice ||
    context?.lattice ||
    composedCandidateFrame?.landscapeLatticeBundle ||
    composedCandidateFrame?.landscapeLattice ||
    composedCandidateFrame?.lattice ||
    candidateRenderScene?.landscapeLatticeBundle ||
    candidateRenderScene?.landscapeLattice ||
    candidateRenderScene?.lattice ||
    renderer?.landscapeLatticeBundle ||
    renderer?.landscapeLattice ||
    renderer?.lattice ||
    null;

  if (explicit && explicit.map) {
    return Object.freeze({
      ...explicit,
      source: explicit.source || 'renderer-explicit-landscape-lattice-bundle',
      descriptorOnly: true,
      runtimeLatticeActivation: false,
      claimBoundaryPreserved: true
    });
  }

  if (explicit) {
    return Object.freeze({
      map: explicit,
      receipt:
        options?.landscapeLatticeReceipt ||
        context?.landscapeLatticeReceipt ||
        composedCandidateFrame?.landscapeLatticeReceipt ||
        candidateRenderScene?.landscapeLatticeReceipt ||
        renderer?.landscapeLatticeReceipt ||
        null,
      rowOrientation:
        options?.landscapeLatticeRowOrientation ||
        context?.landscapeLatticeRowOrientation ||
        composedCandidateFrame?.landscapeLatticeRowOrientation ||
        candidateRenderScene?.landscapeLatticeRowOrientation ||
        renderer?.landscapeLatticeRowOrientation ||
        null,
      regionSummary:
        options?.landscapeLatticeRegionSummary ||
        context?.landscapeLatticeRegionSummary ||
        composedCandidateFrame?.landscapeLatticeRegionSummary ||
        candidateRenderScene?.landscapeLatticeRegionSummary ||
        renderer?.landscapeLatticeRegionSummary ||
        null,
      inspectionAddressSummary:
        options?.latticeInspectionAddressSummary ||
        context?.latticeInspectionAddressSummary ||
        composedCandidateFrame?.latticeInspectionAddressSummary ||
        candidateRenderScene?.latticeInspectionAddressSummary ||
        renderer?.latticeInspectionAddressSummary ||
        null,
      compatibilityCheck:
        options?.latticeCompatibilityCheck ||
        context?.latticeCompatibilityCheck ||
        composedCandidateFrame?.latticeCompatibilityCheck ||
        candidateRenderScene?.latticeCompatibilityCheck ||
        renderer?.latticeCompatibilityCheck ||
        null,
      source: 'renderer-explicit-landscape-lattice-map',
      descriptorOnly: true,
      runtimeLatticeActivation: false,
      claimBoundaryPreserved: true
    });
  }

  return resolveDefaultHEarthLandscapeLatticeBundle();
}

export function normalizeHEarthLandscapeLatticeAdmissionEvidence(
  latticeBundle = resolveDefaultHEarthLandscapeLatticeBundle()
) {
  const map = latticeBundle?.map || Object.freeze({});
  const records = Object.values(map).filter(
    (record) => record !== null && typeof record === 'object'
  );

  const rowSet = new Set(records.map((record) => record.row));
  const columnSet = new Set(records.map((record) => record.column));

  const addressCount = records.length;
  const addressCountMatchesExpected = addressCount === 256;
  const rowCoverageComplete = rowSet.size === 16;
  const columnCoverageComplete = columnSet.size === 16;

  const rowOrientationPreserved =
    latticeBundle?.rowOrientation?.semanticAlignmentWith031C === true ||
    H_EARTH_256_LATTICE_LANDSCAPE_ROW_ORIENTATION?.semanticAlignmentWith031C === true;

  const receiptPresent = Boolean(latticeBundle?.receipt);
  const compatibilityCheckPresent = Boolean(latticeBundle?.compatibilityCheck);
  const regionSummaryPresent = Boolean(latticeBundle?.regionSummary);
  const inspectionAddressSummaryPresent = Boolean(
    latticeBundle?.inspectionAddressSummary
  );

  const failureCodes = [];

  if (!receiptPresent) failureCodes.push('LANDSCAPE_LATTICE_RECEIPT_MISSING');
  if (!addressCountMatchesExpected) failureCodes.push('LANDSCAPE_LATTICE_ADDRESS_COUNT_MISMATCH');
  if (!rowOrientationPreserved) failureCodes.push('LANDSCAPE_LATTICE_ROW_ORIENTATION_UNPROVEN');

  const warningCodes = [];

  if (!rowCoverageComplete) warningCodes.push('LANDSCAPE_LATTICE_ROW_COVERAGE_INCOMPLETE');
  if (!columnCoverageComplete) warningCodes.push('LANDSCAPE_LATTICE_COLUMN_COVERAGE_INCOMPLETE');
  if (!compatibilityCheckPresent) warningCodes.push('LANDSCAPE_LATTICE_COMPATIBILITY_CHECK_MISSING');
  if (!regionSummaryPresent) warningCodes.push('LANDSCAPE_LATTICE_REGION_SUMMARY_MISSING');
  if (!inspectionAddressSummaryPresent) warningCodes.push('LANDSCAPE_LATTICE_INSPECTION_ADDRESS_SUMMARY_MISSING');

  const admitted = failureCodes.length === 0;

  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_LANDSCAPE_LATTICE_ADMISSION_EVIDENCE',
    source: latticeBundle?.source || 'unknown',
    descriptorLandscapeLatticeAdmitted: admitted,
    geometryLatticeAdmissionStatus: admitted ? 'ADMITTED' : 'REJECTED',
    geometryLatticeAdmissionFailed: admitted !== true,
    landscapeLatticeBundlePresent: Boolean(latticeBundle),
    landscapeLatticeReceiptPresent: receiptPresent,
    addressCount,
    addressCountExpected: 256,
    addressCountMatchesExpected,
    rowCount: rowSet.size,
    columnCount: columnSet.size,
    rowCoverageComplete,
    columnCoverageComplete,
    rowOrientationPreserved,
    compatibilityCheckPresent,
    regionSummaryPresent,
    inspectionAddressSummaryPresent,
    warningCodes: uniqueHEarthRenderCodes(warningCodes),
    failureCodes: uniqueHEarthRenderCodes(failureCodes),
    runtimeLatticeActivation: false,
    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
    traversalGridClaim: false,
    collisionGridClaim: false,
    physicsGridClaim: false,
    gameplayGridClaim: false,
    survivalGridClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveGeometryPortReceiptSafe(latticeContext = Object.freeze({})) {
  try {
    const receipt =
      typeof getHEarthGeometryExpansionPortReceipt === 'function'
        ? getHEarthGeometryExpansionPortReceipt(
            Object.freeze({
              landscapeLatticeBundle: latticeContext.landscapeLatticeBundle
            }),
            latticeContext
          )
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

export function extractHEarthGeometryOrganicEvidence(geometryReceipt = null) {
  return Object.freeze({
    geometryOrganicVariationApplied:
      geometryReceipt?.geometryOrganicVariationApplied === true ||
      geometryReceipt?.organicVariationSummary?.organicLandscapeChildVariationApplied === true,

    organicLandscapeChildVariationDefined:
      geometryReceipt?.organicLandscapeChildVariationDefined === true,

    primitiveSpecificChildPlacementApplied:
      geometryReceipt?.primitiveSpecificChildPlacementApplied === true ||
      geometryReceipt?.organicVariationSummary?.primitiveSpecificChildPlacementApplied === true,

    latticeRegularBandingMitigated:
      geometryReceipt?.latticeRegularBandingMitigated === true ||
      geometryReceipt?.organicVariationSummary?.latticeRegularBandingMitigated === true,

    organicVariationSeededDeterministically:
      geometryReceipt?.organicVariationSeededDeterministically === true ||
      geometryReceipt?.organicVariationSummary?.deterministicOrganicVariation === true,

    randomRuntimeVariationUsed:
      geometryReceipt?.randomRuntimeVariationUsed === true ||
      geometryReceipt?.organicVariationSummary?.randomRuntimeVariationUsed === true,

    organicVariationSummary: geometryReceipt?.organicVariationSummary || null,
    claimBoundaryPreserved: true
  });
}

export function makeHEarthDefaultOrganicEvidence(geometryReceipt = null) {
  return Object.freeze({
    geometryOrganicVariationApplied: false,
    organicLandscapeChildVariationDefined:
      geometryReceipt?.organicLandscapeChildVariationDefined === true,
    primitiveSpecificChildPlacementApplied: false,
    latticeRegularBandingMitigated: false,
    organicVariationSeededDeterministically:
      geometryReceipt?.organicVariationSeededDeterministically === true,
    randomRuntimeVariationUsed: false,
    organicVariationSummary: geometryReceipt?.organicVariationSummary || null,
    claimBoundaryPreserved: true
  });
}

export function isHEarthGeometryExpandedNode(node) {
  return Boolean(
    node?.geometryExpansion ||
      node?.candidateGeometryOnly === true ||
      node?.parentObjectId ||
      node?.parentNodeId
  );
}

export function inputContainsHEarthGeometryExpansion(nodes = []) {
  return (Array.isArray(nodes) ? nodes : []).some((node) =>
    isHEarthGeometryExpandedNode(node)
  );
}

export function resolveRenderLayer(objectId, node = {}) {
  const explicitLayer =
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    null;

  if (explicitLayer) return explicitLayer;

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

export function resolveMaterialToken(object = {}) {
  const materialKey =
    object.materialKey ||
    object.materialToken?.materialKey ||
    object.materialIdentity?.materialKey ||
    object.materialIdentity?.key ||
    object.materialChannel?.materialKey ||
    object.materialChannel?.sourceMaterialKey ||
    object.materialChannel?.key ||
    'unresolved';

  return Object.freeze({
    materialKey,
    token:
      H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey] ||
      Object.freeze({ materialKey: 'unresolved' }),
    resolved: Boolean(H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey]) === true,
    fallbackUsed: Boolean(H_EARTH_3D_RENDER_MATERIAL_TOKENS[materialKey]) === false,
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
    object.sourceObject?.candidateTransform?.extent ||
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

export function resolveChildPrimitiveEvidenceForNode(object = {}) {
  const childPrimitiveType =
    object?.geometryExpansion?.childPrimitiveType ||
    object?.primitiveType ||
    object?.primitive?.primitiveType ||
    object?.primitiveSchema?.primitiveType ||
    'unresolvedPrimitive';

  const parentPrimitiveType =
    object?.geometryExpansion?.parentPrimitiveType ||
    object?.sourceObject?.primitiveType ||
    null;

  const primitiveStartsCandidate = String(childPrimitiveType).startsWith('candidate');

  return Object.freeze({
    childPrimitiveType,
    parentPrimitiveType,
    organicPlacementRole:
      object?.organicPlacementRole ||
      object?.geometryExpansion?.organicPlacementRole ||
      null,
    organicProfileId:
      object?.organicProfileId ||
      object?.geometryExpansion?.organicProfileId ||
      null,
    organicVariationApplied:
      object?.organicVariationApplied === true ||
      object?.geometryExpansion?.organicVariationApplied === true,
    usesParentPrimitiveProjection:
      Boolean(parentPrimitiveType) === true && primitiveStartsCandidate === true,
    projectionPrimitiveType:
      Boolean(parentPrimitiveType) === true && primitiveStartsCandidate === true
        ? parentPrimitiveType
        : childPrimitiveType,
    randomRuntimeVariationUsed:
      object?.randomRuntimeVariationUsed === true ||
      object?.geometryExpansion?.randomRuntimeVariationUsed === true,
    claimBoundaryPreserved: true
  });
}

export function resolveProjectionPrimitiveTypeForNode(object = {}) {
  const evidence = resolveChildPrimitiveEvidenceForNode(object);
  return evidence.projectionPrimitiveType;
}

export function resolvePrimitiveProjectionProfile(primitiveType, depthClass) {
  const primitive = String(primitiveType || 'unresolvedPrimitive');

  const profiles = Object.freeze({
    contouredTerrainBand: Object.freeze({
      profileId: 'foreground-contoured-terrain-band',
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.terrainTiltDegrees,
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
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.terrainTiltDegrees,
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
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.shorelineTiltDegrees,
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
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.waterTiltDegrees,
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
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.waterTiltDegrees,
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
      rotateX: H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection.scatterTiltDegrees,
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

  if (profiles[primitive]) return profiles[primitive];
  if (depthClass === 'horizon') return profiles.distantCluster;
  if (depthClass === 'water') return profiles.waterPlane;

  return Object.freeze({
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
}

export function resolveDepthProjectionMultiplier(depthClass, normalizedDepth) {
  const depth = clampHEarthRenderNumber(normalizedDepth, 0, 1, 0.2);
  const landscape = H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection;

  if (depthClass === 'foreground') return landscape.foregroundDepthBoost * (1.08 - depth * 0.25);
  if (depthClass === 'shoreline') return landscape.shorelineDepthBoost * (0.98 - depth * 0.16);
  if (depthClass === 'water') return landscape.waterDepthBoost * (0.92 - depth * 0.12);
  if (depthClass === 'context') return landscape.contextDepthBoost * (0.88 - depth * 0.08);
  if (depthClass === 'horizon') return landscape.horizonDepthBoost * (0.82 - depth * 0.04);

  return 1;
}

export function resolveProjectedPosition(object = {}) {
  const center = resolveNodeCenter(object);
  const scale = H_EARTH_3D_RENDER_PROJECTION_MODEL.scale;
  const unitToCssPixel = normalizeHEarthRenderNumber(scale.unitToCssPixel, 9);
  const yInversionFactor = normalizeHEarthRenderNumber(scale.yInversionFactor, -1);
  const zDepthMultiplier = normalizeHEarthRenderNumber(scale.zDepthMultiplier, 3.2);

  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const depthClass = resolveDepthClassForNode(object);
  const depthMultiplier = resolveDepthProjectionMultiplier(depthClass, normalizedDepth);
  const landscape = H_EARTH_3D_RENDER_PROJECTION_MODEL.landscapeProjection;

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
    projectedX:
      landscape.stageCenterXPx + center.x * unitToCssPixel * depthMultiplier,
    projectedY:
      landscape.stageGroundYPx +
      center.y * yInversionFactor * unitToCssPixel -
      center.z * zDepthMultiplier * depthMultiplier +
      normalizedDepth * -42,
    projectedZ:
      center.z * zDepthMultiplier * depthMultiplier + normalizedDepth * 260,
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

  const projectionPrimitiveType = resolveProjectionPrimitiveTypeForNode(object);
  const childPrimitiveEvidence = resolveChildPrimitiveEvidenceForNode(object);
  const depthClass = resolveDepthClassForNode(object);
  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const profile = resolvePrimitiveProjectionProfile(projectionPrimitiveType, depthClass);
  const scaleTriplet = resolveCandidateScaleTriplet(object);

  const existingWidth = normalizeHEarthRenderNumber(
    object?.primitiveGeometry?.widthPx ?? object?.renderWidthPx,
    NaN
  );
  const existingHeight = normalizeHEarthRenderNumber(
    object?.primitiveGeometry?.heightPx ?? object?.renderHeightPx,
    NaN
  );
  const existingDepth = normalizeHEarthRenderNumber(
    object?.primitiveGeometry?.depthPx ?? object?.renderDepthPx,
    NaN
  );

  return Object.freeze({
    primitiveType,
    projectionPrimitiveType,
    childPrimitiveEvidence,
    depthClass,
    normalizedDepth,
    profileId: object?.primitiveGeometry?.profileId || profile.profileId,
    profileClassName:
      object?.primitiveGeometry?.profileClassName || profile.className,
    groundPlane:
      object?.primitiveGeometry?.groundPlane !== undefined
        ? Boolean(object.primitiveGeometry.groundPlane)
        : profile.groundPlane,
    widthPx: Number.isFinite(existingWidth)
      ? Math.max(4, existingWidth)
      : Math.max(
          8,
          extent.x *
            H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.unitToCssPixel *
            profile.widthMultiplier *
            Math.max(0.28, scaleTriplet.contextScale)
        ),
    heightPx: Number.isFinite(existingHeight)
      ? Math.max(2, existingHeight)
      : Math.max(
          6,
          Math.max(extent.y, extent.z * 0.32) *
            H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.unitToCssPixel *
            profile.heightMultiplier *
            Math.max(0.28, scaleTriplet.contextScale)
        ),
    depthPx: Number.isFinite(existingDepth)
      ? Math.max(1, existingDepth)
      : Math.max(
          1,
          extent.z *
            H_EARTH_3D_RENDER_PROJECTION_MODEL.scale.zDepthMultiplier *
            profile.depthMultiplier
        ),
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

export function resolveCssTransform(object = {}) {
  const projected = resolveProjectedPosition(object);
  const primitiveType =
    object?.primitiveType ||
    object?.primitive?.primitiveType ||
    object?.primitiveSchema?.primitiveType ||
    'unresolvedPrimitive';

  const projectionPrimitiveType = resolveProjectionPrimitiveTypeForNode(object);
  const childPrimitiveEvidence = resolveChildPrimitiveEvidenceForNode(object);
  const depthClass = resolveDepthClassForNode(object);
  const normalizedDepth = resolveNormalizedDepthForNode(object);
  const profile = resolvePrimitiveProjectionProfile(projectionPrimitiveType, depthClass);
  const candidateRotation = resolveCandidateRotation(object);
  const candidateScale = resolveCandidateScaleTriplet(object);
  const profileDepthScale = resolveDepthProjectionMultiplier(depthClass, normalizedDepth);

  const rotateX = normalizeHEarthRenderNumber(candidateRotation.x + profile.rotateX, profile.rotateX);
  const rotateY = normalizeHEarthRenderNumber(candidateRotation.y + profile.rotateY, profile.rotateY);
  const rotateZ = normalizeHEarthRenderNumber(candidateRotation.z + profile.rotateZ, profile.rotateZ);

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

  const primitiveGeometry = object?.primitiveGeometry || {};
  const profileId = primitiveGeometry.profileId || profile.profileId;
  const profileClassName = primitiveGeometry.profileClassName || profile.className;
  const groundPlane =
    primitiveGeometry.groundPlane !== undefined
      ? Boolean(primitiveGeometry.groundPlane)
      : profile.groundPlane;

  return Object.freeze({
    cssTransform: [
      `translate3d(${projected.projectedX}px, ${projected.projectedY + profile.translateYOffsetPx}px, ${projected.projectedZ}px)`,
      `rotateX(${rotateX}deg)`,
      `rotateY(${rotateY}deg)`,
      `rotateZ(${rotateZ}deg)`,
      `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`
    ].join(' '),
    projected,
    primitiveType,
    projectionPrimitiveType,
    childPrimitiveEvidence,
    depthClass,
    normalizedDepth,
    profileId,
    profileClassName,
    groundPlane,
    rotateX,
    rotateY,
    rotateZ,
    scaleX,
    scaleY,
    scaleZ,
    profileDepthScale,
    candidateTransformOnly: true,
    landscapeProjectionApplied: true,
    projectionParentPrimitiveFamilyPreserved:
      childPrimitiveEvidence.usesParentPrimitiveProjection === true,
    childPrimitiveEvidencePreserved: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolvePrimitiveRenderGeometry(object = {}) {
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
  const childPrimitiveEvidence = resolveChildPrimitiveEvidenceForNode(object);

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
      H_EARTH_3D_RENDER_LAYER_ORDER.find((layer) => layer.layerId === layerId)?.order ??
      999,
    cssTransformDescriptor,
    primitiveGeometry,
    childPrimitiveEvidence,
    landscapeClassName:
      object?.landscapeClassName || primitiveGeometry.profileClassName,
    primitiveClassName:
      object?.primitiveClassName ||
      `h-earth-primitive-${normalizeHEarthRenderToken(primitiveType)}`,
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
    parentObjectId:
      object?.parentObjectId || object?.geometryExpansion?.parentObjectId || null,
    parentNodeId:
      object?.parentNodeId || object?.geometryExpansion?.parentNodeId || null,
    descriptorOnly: object?.descriptorOnly === false ? false : true,
    candidateGeometryOnly: object?.candidateGeometryOnly === true,

    organicVariationApplied:
      object?.organicVariationApplied === true ||
      object?.geometryExpansion?.organicVariationApplied === true,
    organicProfileId:
      object?.organicProfileId ||
      object?.geometryExpansion?.organicProfileId ||
      null,
    organicPlacementRole:
      object?.organicPlacementRole ||
      object?.geometryExpansion?.organicPlacementRole ||
      null,
    organicVariationIndex:
      object?.organicVariationIndex ??
      object?.geometryExpansion?.organicVariationIndex ??
      null,
    organicVariationSeed:
      object?.organicVariationSeed ??
      object?.geometryExpansion?.organicVariationSeed ??
      null,
    deterministicOrganicVariation:
      object?.deterministicOrganicVariation === true ||
      object?.geometryExpansion?.deterministicOrganicVariation === true,
    randomRuntimeVariationUsed:
      object?.randomRuntimeVariationUsed === true ||
      object?.geometryExpansion?.randomRuntimeVariationUsed === true,
    geometryOrganicClassName:
      object?.geometryOrganicClassName ||
      (
        object?.organicPlacementRole
          ? `h-earth-organic-${normalizeHEarthRenderToken(object.organicPlacementRole)}`
          : object?.geometryExpansion?.organicPlacementRole
            ? `h-earth-organic-${normalizeHEarthRenderToken(object.geometryExpansion.organicPlacementRole)}`
            : null
      ),

    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveLandscapeRenderNode(node = {}) {
  const normalized = resolvePrimitiveRenderGeometry(node);

  return Object.freeze({
    ...node,
    ...normalized,
    cssTransformDescriptor: normalized.cssTransformDescriptor,
    primitiveGeometry: normalized.primitiveGeometry,
    materialToken: normalized.materialToken,
    childPrimitiveEvidence: normalized.childPrimitiveEvidence,
    landscapeProjectionNormalized: true,
    landscapeProjectionContract: H_EARTH_3D_RENDERER_CONTRACT.contractId,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function normalizeLandscapeRenderNodes(nodes = []) {
  return Object.freeze(
    (Array.isArray(nodes) ? nodes : []).map((node) =>
      node?.landscapeProjectionNormalized === true
        ? Object.freeze(node)
        : resolveLandscapeRenderNode(node)
    )
  );
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
  renderer = null,
  candidateRenderScene = null,
  composedCandidateFrame = null,
  options = Object.freeze({}),
  boundary = H_EARTH_3D_RENDER_BOUNDARY_FLAGS
} = {}) {
  const parentNodes = Array.isArray(nodes) ? nodes : [];

  const landscapeLatticeBundle = resolveHEarthRendererLandscapeLatticeBundle({
    renderer,
    candidateRenderScene,
    composedCandidateFrame,
    options
  });

  const latticeAdmissionEvidence =
    normalizeHEarthLandscapeLatticeAdmissionEvidence(landscapeLatticeBundle);

  const latticeContext = Object.freeze({
    landscapeLatticeBundle,
    landscapeLattice: landscapeLatticeBundle?.map || null,
    landscapeLatticeReceipt: landscapeLatticeBundle?.receipt || null,
    landscapeLatticeRowOrientation: landscapeLatticeBundle?.rowOrientation || null,
    landscapeLatticeRegionSummary: landscapeLatticeBundle?.regionSummary || null,
    latticeInspectionAddressSummary:
      landscapeLatticeBundle?.inspectionAddressSummary || null,
    latticeCompatibilityCheck: landscapeLatticeBundle?.compatibilityCheck || null,
    rendererLatticeAdmissionEvidence: latticeAdmissionEvidence
  });

  const alreadyExpanded = inputContainsHEarthGeometryExpansion(parentNodes);

  if (alreadyExpanded === true) {
    const normalizedExpandedNodes = normalizeLandscapeRenderNodes(parentNodes);
    const budgeted = applyExpandedRenderNodeBudget(normalizedExpandedNodes);
    const geometryReceipt = resolveGeometryPortReceiptSafe(latticeContext);
    const organicEvidence = makeHEarthDefaultOrganicEvidence(geometryReceipt);

    return Object.freeze({
      nodes: budgeted.nodes,
      rawNodes: Object.freeze(parentNodes),
      parentNodes: normalizedExpandedNodes,
      source,
      geometryPortUsed: true,
      geometryExpansionApplied: false,
      geometryExpansionSkippedBecauseAlreadyExpanded: true,
      geometryExpansionSource: source,
      geometrySourceNodeCount: parentNodes.length,
      geometryExpandedNodeCount: budgeted.returnedNodeCount,
      geometryReturnedNodeCount: budgeted.returnedNodeCount,
      geometrySkippedNodeCount: budgeted.skippedForBudget,
      geometryBudgetSkippedNodeCount: budgeted.skippedForBudget,
      geometryParentNodeCount: parentNodes.length,
      geometryChildNodeCount: Math.max(0, budgeted.returnedNodeCount),
      landscapeLatticeBundleForwarded: true,
      landscapeLatticeSource: landscapeLatticeBundle?.source || 'unknown',
      descriptorLandscapeLatticeAdmitted:
        latticeAdmissionEvidence.descriptorLandscapeLatticeAdmitted,
      geometryLatticeAdmissionStatus:
        latticeAdmissionEvidence.geometryLatticeAdmissionStatus,
      geometryLatticeAdmissionFailed:
        latticeAdmissionEvidence.geometryLatticeAdmissionFailed,
      rendererLatticeAdmissionEvidence: latticeAdmissionEvidence,
      geometryReceipt,
      ...organicEvidence,
      warningCodes: uniqueHEarthRenderCodes([
        'GEOMETRY_INPUT_ALREADY_EXPANDED_SINGLE_PASS_GUARD',
        ...latticeAdmissionEvidence.warningCodes
      ]),
      failureCodes: uniqueHEarthRenderCodes([
        ...latticeAdmissionEvidence.failureCodes
      ]),
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      }),
      claimBoundaryPreserved: true
    });
  }

  const normalizedParentNodes = normalizeLandscapeRenderNodes(parentNodes);

  if (typeof expandHEarthCandidateGeometryNodes !== 'function') {
    const geometryReceipt = resolveGeometryPortReceiptSafe(latticeContext);
    const organicEvidence = makeHEarthDefaultOrganicEvidence(geometryReceipt);

    return Object.freeze({
      nodes: normalizedParentNodes,
      rawNodes: normalizedParentNodes,
      parentNodes: normalizedParentNodes,
      source,
      geometryPortUsed: false,
      geometryExpansionApplied: false,
      geometryExpansionSkippedBecauseAlreadyExpanded: false,
      geometryExpansionSource: source,
      geometrySourceNodeCount: normalizedParentNodes.length,
      geometryExpandedNodeCount: normalizedParentNodes.length,
      geometryReturnedNodeCount: normalizedParentNodes.length,
      geometrySkippedNodeCount: 0,
      geometryBudgetSkippedNodeCount: 0,
      geometryParentNodeCount: normalizedParentNodes.length,
      geometryChildNodeCount: 0,
      landscapeLatticeBundleForwarded: false,
      landscapeLatticeSource: landscapeLatticeBundle?.source || 'unknown',
      descriptorLandscapeLatticeAdmitted:
        latticeAdmissionEvidence.descriptorLandscapeLatticeAdmitted,
      geometryLatticeAdmissionStatus:
        latticeAdmissionEvidence.geometryLatticeAdmissionStatus,
      geometryLatticeAdmissionFailed:
        latticeAdmissionEvidence.geometryLatticeAdmissionFailed,
      rendererLatticeAdmissionEvidence: latticeAdmissionEvidence,
      geometryReceipt,
      ...organicEvidence,
      warningCodes: uniqueHEarthRenderCodes([
        'GEOMETRY_PORT_FUNCTION_MISSING',
        ...latticeAdmissionEvidence.warningCodes
      ]),
      failureCodes: uniqueHEarthRenderCodes([
        ...latticeAdmissionEvidence.failureCodes
      ]),
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      }),
      claimBoundaryPreserved: true
    });
  }

  const maxExpandedNodes =
    H_EARTH_3D_RENDER_NODE_BUDGET.maxExpandedCandidateNodesAfterGeometryExpansion ||
    H_EARTH_3D_RENDER_NODE_BUDGET.maxTotalCandidateNodes ||
    192;

  const expansion = expandHEarthCandidateGeometryNodes(
    Object.freeze({
      nodes: normalizedParentNodes,
      source,
      maxExpandedNodes,
      nodeBudget: H_EARTH_3D_RENDER_NODE_BUDGET,
      landscapeLatticeBundle,
      landscapeLattice: landscapeLatticeBundle?.map || null,
      landscapeLatticeReceipt: landscapeLatticeBundle?.receipt || null,
      landscapeLatticeRowOrientation: landscapeLatticeBundle?.rowOrientation || null,
      landscapeLatticeRegionSummary: landscapeLatticeBundle?.regionSummary || null,
      latticeInspectionAddressSummary:
        landscapeLatticeBundle?.inspectionAddressSummary || null,
      latticeCompatibilityCheck: landscapeLatticeBundle?.compatibilityCheck || null,
      rendererLatticeAdmissionEvidence: latticeAdmissionEvidence
    }),
    Object.freeze({
      source,
      maxExpandedNodes,
      nodeBudget: H_EARTH_3D_RENDER_NODE_BUDGET,
      geometryExpansionModel: H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL,
      landscapeLatticeBundle,
      landscapeLattice: landscapeLatticeBundle?.map || null,
      landscapeLatticeReceipt: landscapeLatticeBundle?.receipt || null,
      landscapeLatticeRowOrientation: landscapeLatticeBundle?.rowOrientation || null,
      landscapeLatticeRegionSummary: landscapeLatticeBundle?.regionSummary || null,
      latticeInspectionAddressSummary:
        landscapeLatticeBundle?.inspectionAddressSummary || null,
      latticeCompatibilityCheck: landscapeLatticeBundle?.compatibilityCheck || null,
      rendererLatticeAdmissionEvidence: latticeAdmissionEvidence,
      boundary: Object.freeze({
        ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
        ...boundary,
        claimBoundaryPreserved: true
      })
    })
  );

  const expandedNodes = Array.isArray(expansion?.nodes)
    ? expansion.nodes
    : Object.freeze([]);

  const normalizedExpandedNodes = normalizeLandscapeRenderNodes(expandedNodes);
  const budgeted = applyExpandedRenderNodeBudget(normalizedExpandedNodes);

  const geometryReceipt =
    expansion?.receipt ||
    expansion?.geometryReceipt ||
    resolveGeometryPortReceiptSafe(latticeContext);

  const organicEvidence = extractHEarthGeometryOrganicEvidence(geometryReceipt);

  const descriptorLandscapeLatticeAdmitted =
    expansion?.descriptorLandscapeLatticeAdmitted === true ||
    geometryReceipt?.descriptorLandscapeLatticeAdmitted === true ||
    latticeAdmissionEvidence.descriptorLandscapeLatticeAdmitted === true;

  const geometryLatticeAdmissionStatus =
    expansion?.geometryLatticeAdmissionStatus ||
    geometryReceipt?.geometryLatticeAdmissionStatus ||
    latticeAdmissionEvidence.geometryLatticeAdmissionStatus ||
    'UNKNOWN';

  const geometryLatticeAdmissionFailed =
    expansion?.geometryLatticeAdmissionFailed === true ||
    geometryReceipt?.geometryLatticeAdmissionFailed === true ||
    geometryReceipt?.descriptorLandscapeLatticeAdmitted === false ||
    latticeAdmissionEvidence.geometryLatticeAdmissionFailed === true;

  const expansionWarningCodes = uniqueHEarthRenderCodes([
    ...(Array.isArray(expansion?.warningCodes) ? expansion.warningCodes : []),
    ...(Array.isArray(expansion?.geometryExpansionWarningCodes)
      ? expansion.geometryExpansionWarningCodes
      : []),
    ...(Array.isArray(expansion?.receipt?.geometryExpansionWarningCodes)
      ? expansion.receipt.geometryExpansionWarningCodes
      : []),
    ...(Array.isArray(latticeAdmissionEvidence.warningCodes)
      ? latticeAdmissionEvidence.warningCodes
      : []),
    ...(budgeted.skippedForBudget > 0
      ? ['GEOMETRY_EXPANSION_BUDGET_TRUNCATED']
      : [])
  ]);

  const expansionFailureCodes = uniqueHEarthRenderCodes([
    ...(Array.isArray(expansion?.failureCodes) ? expansion.failureCodes : []),
    ...(Array.isArray(expansion?.geometryExpansionFailureCodes)
      ? expansion.geometryExpansionFailureCodes
      : []),
    ...(Array.isArray(expansion?.receipt?.geometryExpansionFailureCodes)
      ? expansion.receipt.geometryExpansionFailureCodes
      : []),
    ...(Array.isArray(latticeAdmissionEvidence.failureCodes)
      ? latticeAdmissionEvidence.failureCodes
      : [])
  ]);

  return Object.freeze({
    nodes: budgeted.nodes,
    rawNodes: Object.freeze(expandedNodes),
    parentNodes: normalizedParentNodes,
    source,
    geometryPortUsed: true,
    geometryExpansionApplied:
      expansion?.geometryExpansionApplied === true &&
      budgeted.nodes.length > 0,
    geometryExpansionSkippedBecauseAlreadyExpanded: false,
    geometryExpansionSource: expansion?.source || source,
    geometrySourceNodeCount:
      Number.isFinite(Number(expansion?.sourceNodeCount))
        ? Number(expansion.sourceNodeCount)
        : normalizedParentNodes.length,
    geometryExpandedNodeCount:
      Number.isFinite(Number(expansion?.expandedNodeCount))
        ? Number(expansion.expandedNodeCount)
        : normalizedExpandedNodes.length,
    geometryReturnedNodeCount: budgeted.returnedNodeCount,
    geometrySkippedNodeCount:
      Number.isFinite(Number(expansion?.geometryExpansionSkippedCount))
        ? Number(expansion.geometryExpansionSkippedCount)
        : Number.isFinite(Number(expansion?.receipt?.geometryExpansionSkippedCount))
          ? Number(expansion.receipt.geometryExpansionSkippedCount)
          : budgeted.skippedForBudget,
    geometryBudgetSkippedNodeCount: budgeted.skippedForBudget,
    geometryParentNodeCount:
      Number.isFinite(Number(expansion?.descriptorParentNodeCount))
        ? Number(expansion.descriptorParentNodeCount)
        : Number.isFinite(Number(expansion?.receipt?.descriptorParentNodeCount))
          ? Number(expansion.receipt.descriptorParentNodeCount)
          : 0,
    geometryChildNodeCount:
      Number.isFinite(Number(expansion?.geometryChildNodeCount))
        ? Number(expansion.geometryChildNodeCount)
        : Number.isFinite(Number(expansion?.receipt?.geometryChildNodeCount))
          ? Number(expansion.receipt.geometryChildNodeCount)
          : 0,
    landscapeLatticeBundleForwarded: true,
    landscapeLatticeSource: landscapeLatticeBundle?.source || 'unknown',
    descriptorLandscapeLatticeAdmitted,
    geometryLatticeAdmissionStatus,
    geometryLatticeAdmissionFailed,
    rendererLatticeAdmissionEvidence: latticeAdmissionEvidence,
    geometryReceipt,
    ...organicEvidence,
    warningCodes: expansionWarningCodes,
    failureCodes: expansionFailureCodes,
    boundary: Object.freeze({
      ...H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
      ...boundary,
      claimBoundaryPreserved: true
    }),
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
  environmentObjects = H_EARTH_3D_RESOLVED_ENVIRONMENT_OBJECTS,
  landscapeLatticeBundle = resolveDefaultHEarthLandscapeLatticeBundle()
} = {}) {
  const resolvedParentNodes = resolveCandidateRenderNodes(environmentObjects);
  const budgeted = applyParentRenderNodeBudget(resolvedParentNodes);
  const latticeAdmissionEvidence =
    normalizeHEarthLandscapeLatticeAdmissionEvidence(landscapeLatticeBundle);

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
    geometry032DOrganicVariationDeferredUntilMountSelection: true,
    landscapeLatticeBundle,
    rendererLatticeAdmissionEvidence: latticeAdmissionEvidence,
    landscapeLatticeBundlePresent: Boolean(landscapeLatticeBundle),
    landscapeLatticeSource: landscapeLatticeBundle?.source || 'unknown',
    geometryReceipt: resolveGeometryPortReceiptSafe(
      Object.freeze({
        landscapeLatticeBundle,
        rendererLatticeAdmissionEvidence: latticeAdmissionEvidence
      })
    ),
    nodeFactoryReceipt: resolveNodeFactoryReceiptSafe(),
    materialPortReceipt: resolveMaterialPortReceiptSafe(),
    layerPortReceipt: resolveLayerPortReceiptSafe(),
    layerOrder: H_EARTH_3D_RENDER_LAYER_ORDER,
    projectionModel: H_EARTH_3D_RENDER_PROJECTION_MODEL,
    renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
    geometryMap: H_EARTH_3D_RENDER_GEOMETRY_MAP,
    geometryExpansionModel: H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_MODEL,
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
  composedCandidateFrame,
  renderer = null,
  options = Object.freeze({}),
  boundary = H_EARTH_3D_RENDER_BOUNDARY_FLAGS
} = {}) {
  const composedNodes = Array.isArray(composedCandidateFrame?.composedNodes)
    ? composedCandidateFrame.composedNodes
    : [];

  const makeSelection = ({
    nodes,
    source,
    sourceDescriptorType,
    usedComposedFrame,
    usedRenderSceneFallback,
    preWarnings = []
  }) => {
    const expanded = expandLandscapeRenderNodesWithGeometryPort({
      nodes,
      source,
      renderer,
      candidateRenderScene,
      composedCandidateFrame,
      options,
      boundary
    });

    return Object.freeze({
      nodes: expanded.nodes,
      rawNodes: Object.freeze(nodes),
      normalizedParentNodes: expanded.parentNodes,
      geometryRawNodes: expanded.rawNodes,
      source,
      sourceDescriptorType,
      usedComposedFrame,
      usedRenderSceneFallback,
      nodeCount: expanded.nodes.length,
      rawNodeCount: nodes.length,
      landscapeNormalizationApplied: true,
      geometryPortUsed: expanded.geometryPortUsed,
      geometryExpansionApplied: expanded.geometryExpansionApplied,
      geometryExpansionSkippedBecauseAlreadyExpanded:
        expanded.geometryExpansionSkippedBecauseAlreadyExpanded === true,
      geometryExpansionSource: expanded.geometryExpansionSource,
      geometrySourceNodeCount: expanded.geometrySourceNodeCount,
      geometryExpandedNodeCount: expanded.geometryExpandedNodeCount,
      geometryReturnedNodeCount: expanded.geometryReturnedNodeCount,
      geometrySkippedNodeCount: expanded.geometrySkippedNodeCount,
      geometryBudgetSkippedNodeCount: expanded.geometryBudgetSkippedNodeCount,
      geometryParentNodeCount: expanded.geometryParentNodeCount,
      geometryChildNodeCount: expanded.geometryChildNodeCount,
      landscapeLatticeBundleForwarded: expanded.landscapeLatticeBundleForwarded,
      landscapeLatticeSource: expanded.landscapeLatticeSource,
      descriptorLandscapeLatticeAdmitted:
        expanded.descriptorLandscapeLatticeAdmitted,
      geometryLatticeAdmissionStatus:
        expanded.geometryLatticeAdmissionStatus,
      geometryLatticeAdmissionFailed:
        expanded.geometryLatticeAdmissionFailed,
      rendererLatticeAdmissionEvidence:
        expanded.rendererLatticeAdmissionEvidence,
      geometryReceipt: expanded.geometryReceipt,

      geometryOrganicVariationApplied:
        expanded.geometryOrganicVariationApplied === true,
      organicLandscapeChildVariationDefined:
        expanded.organicLandscapeChildVariationDefined === true,
      primitiveSpecificChildPlacementApplied:
        expanded.primitiveSpecificChildPlacementApplied === true,
      latticeRegularBandingMitigated:
        expanded.latticeRegularBandingMitigated === true,
      organicVariationSeededDeterministically:
        expanded.organicVariationSeededDeterministically === true,
      randomRuntimeVariationUsed:
        expanded.randomRuntimeVariationUsed === true,
      organicVariationSummary:
        expanded.organicVariationSummary || null,

      missingInput: false,
      warningCodes: uniqueHEarthRenderCodes([
        ...preWarnings,
        ...expanded.warningCodes
      ]),
      failureCodes: uniqueHEarthRenderCodes([...expanded.failureCodes]),
      claimBoundaryPreserved: true
    });
  };

  if (composedNodes.length > 0) {
    return makeSelection({
      nodes: composedNodes,
      source: 'composedCandidateFrame.composedNodes',
      sourceDescriptorType: 'COMPOSED_CANDIDATE_FRAME',
      usedComposedFrame: true,
      usedRenderSceneFallback: false
    });
  }

  const candidateNodes = Array.isArray(candidateRenderScene?.nodes)
    ? candidateRenderScene.nodes
    : [];

  if (candidateNodes.length > 0) {
    return makeSelection({
      nodes: candidateNodes,
      source: 'candidateRenderScene.nodes',
      sourceDescriptorType: 'CANDIDATE_RENDER_SCENE_FALLBACK',
      usedComposedFrame: false,
      usedRenderSceneFallback: true,
      preWarnings: ['COMPOSED_FRAME_NODES_ABSENT_FALLBACK_USED']
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
    geometryExpansionSkippedBecauseAlreadyExpanded: false,
    geometryExpansionSource: 'none',
    geometrySourceNodeCount: 0,
    geometryExpandedNodeCount: 0,
    geometryReturnedNodeCount: 0,
    geometrySkippedNodeCount: 0,
    geometryBudgetSkippedNodeCount: 0,
    geometryParentNodeCount: 0,
    geometryChildNodeCount: 0,
    landscapeLatticeBundleForwarded: false,
    landscapeLatticeSource: 'none',
    descriptorLandscapeLatticeAdmitted: false,
    geometryLatticeAdmissionStatus: 'NOT_ATTEMPTED',
    geometryLatticeAdmissionFailed: false,
    rendererLatticeAdmissionEvidence: null,
    geometryReceipt: resolveGeometryPortReceiptSafe(),

    geometryOrganicVariationApplied: false,
    organicLandscapeChildVariationDefined: false,
    primitiveSpecificChildPlacementApplied: false,
    latticeRegularBandingMitigated: false,
    organicVariationSeededDeterministically: false,
    randomRuntimeVariationUsed: false,
    organicVariationSummary: null,

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

  if (!objectId || !controller) return null;

  if (controller.selectableTargetRegistry?.[objectId]) {
    return controller.selectableTargetRegistry[objectId];
  }

  if (controller.H_EARTH_3D_SELECTABLE_TARGET_REGISTRY?.[objectId]) {
    return controller.H_EARTH_3D_SELECTABLE_TARGET_REGISTRY[objectId];
  }

  return null;
}

export function countHEarthClassSurface(objectNode) {
  const classNames = Array.from(objectNode?.classList || []);

  return Object.freeze({
    hasMaterialClass: classNames.some((className) =>
      className.startsWith('h-earth-material-')
    ),
    hasPrimitiveClass: classNames.some((className) =>
      className.startsWith('h-earth-primitive-')
    ),
    hasLandscapeClass: classNames.some((className) =>
      className.startsWith('h-earth-landscape-')
    ),
    hasLayerMembershipClass: classNames.some((className) =>
      className.startsWith('h-earth-layer-member')
    ),
    hasOrganicClass: classNames.some((className) =>
      className.startsWith('h-earth-organic-')
    ),
    hasOrganicVariationReadyClass: classNames.includes(
      'h-earth-render-organic-variation-ready'
    ),
    classNames: Object.freeze(classNames),
    claimBoundaryPreserved: true
  });
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
  geometryExpansionSkippedBecauseAlreadyExpanded = false,
  geometryExpansionSource = 'none',
  geometrySourceNodeCount = 0,
  geometryExpandedNodeCount = 0,
  geometryReturnedNodeCount = 0,
  geometrySkippedNodeCount = 0,
  geometryBudgetSkippedNodeCount = 0,
  geometryParentNodeCount = 0,
  geometryChildNodeCount = 0,
  landscapeLatticeBundleForwarded = false,
  landscapeLatticeSource = 'none',
  descriptorLandscapeLatticeAdmitted = false,
  geometryLatticeAdmissionStatus = 'UNKNOWN',
  geometryLatticeAdmissionFailed = false,
  rendererLatticeAdmissionEvidence = null,
  geometryReceipt = null,

  geometryOrganicVariationApplied = false,
  organicLandscapeChildVariationDefined = false,
  primitiveSpecificChildPlacementApplied = false,
  latticeRegularBandingMitigated = false,
  organicVariationSeededDeterministically = false,
  randomRuntimeVariationUsed = false,
  organicVariationSummary = null,

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
  geometryPortContractId = resolveHEarthPortContractId(H_EARTH_3D_RENDER_GEOMETRY_PORT),
  materialPortContractId = resolveHEarthPortContractId(H_EARTH_3D_RENDER_MATERIAL_PORT),
  layerPortContractId = resolveHEarthPortContractId(H_EARTH_3D_RENDER_LAYER_PORT),
  nodeFactoryContractId = resolveHEarthPortContractId(H_EARTH_3D_RENDER_NODE_FACTORY),
  nodeFactoryReceipt = resolveNodeFactoryReceiptSafe(),
  materialPortReceipt = resolveMaterialPortReceiptSafe(),
  layerPortReceipt = resolveLayerPortReceiptSafe(),
  missingObjectCount = 0,
  transformDescriptorAppliedCount = 0,
  transformDescriptorMissingCount = 0,
  primitiveGeometryAppliedCount = 0,
  visualGrammarReadyCount = 0,
  visualGrammarIncompleteCount = 0,
  finalDomClassEmissionAuthorityCount = 0,
  materialClassEmissionCount = 0,
  primitiveClassEmissionCount = 0,
  landscapeClassEmissionCount = 0,
  layerMembershipClassEmissionCount = 0,
  organicClassEmissionCount = 0,
  organicVariationReadyCount = 0,
  warningCodes = [],
  failureCodes = [],
  boundary = {}
} = {}) {
  const finalDomClassEmissionAuthority =
    nodeFactoryPortUsed === true &&
    finalDomClassEmissionAuthorityCount > 0;

  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',
    contractId: H_EARTH_3D_RENDERER_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDERER_CONTRACT.renewedFrom,
    complementaryGeometryPort:
      H_EARTH_3D_RENDERER_CONTRACT.complementaryGeometryPort,

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

    geometryExpansionStage: geometryPortUsed
      ? 'after-input-selection-before-node-factory'
      : 'not-applied',
    geometryPortUsed,
    geometryExpansionApplied,
    geometryExpansionSkippedBecauseAlreadyExpanded,
    geometryExpansionSource,
    geometrySourceNodeCount,
    geometryExpandedNodeCount,
    geometryReturnedNodeCount,
    geometrySkippedNodeCount,
    geometryBudgetSkippedNodeCount,
    geometryParentNodeCount,
    geometryChildNodeCount,

    landscapeLatticeBundleForwarded,
    landscapeLatticeSource,
    descriptorLandscapeLatticeAdmitted,
    geometryLatticeAdmissionStatus,
    geometryLatticeAdmissionFailed,
    rendererLatticeAdmissionEvidence,
    silentGeometryFallbackUsed: false,

    geometryReceipt,

    geometryOrganicVariationApplied,
    organicLandscapeChildVariationDefined,
    primitiveSpecificChildPlacementApplied,
    latticeRegularBandingMitigated,
    organicVariationSeededDeterministically,
    randomRuntimeVariationUsed,
    organicVariationSummary,

    geometryPortContractId,
    materialPortContractId,
    layerPortContractId,
    nodeFactoryContractId,
    nodeFactoryReceipt,
    materialPortReceipt,
    layerPortReceipt,

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
    materialPortInjectedIntoNodeFactory: materialPortUsed === true,
    layerPortInjectedIntoNodeFactory: layerPortUsed === true,
    documentRefInjectedIntoNodeFactory: nodeFactoryPortUsed === true,

    missingObjectCount,
    transformDescriptorAppliedCount,
    transformDescriptorMissingCount,
    primitiveGeometryAppliedCount,

    visualGrammarReadyCount,
    visualGrammarIncompleteCount,
    finalDomClassEmissionAuthority,
    finalDomClassEmissionAuthorityCount,
    materialClassEmissionCount,
    primitiveClassEmissionCount,
    landscapeClassEmissionCount,
    layerMembershipClassEmissionCount,
    organicClassEmissionCount,
    organicVariationReadyCount,

    warningCodes: uniqueHEarthRenderCodes(warningCodes),
    failureCodes: uniqueHEarthRenderCodes(failureCodes),

    createsDomCss3DCandidateNodes: rendererMounted === true,
    mountsCandidateDomDescriptors: rendererMounted === true,
    emitsLandscapeGradeCssTransforms:
      landscapeNormalizationApplied === true &&
      transformDescriptorAppliedCount > 0,
    emitsPrimitiveGeometryDescriptors: primitiveGeometryAppliedCount > 0,
    expandsGeometryDescriptors:
      geometryPortUsed === true && geometryExpansionApplied === true,
    guardedAgainstRepeatedExpansion:
      geometryExpansionSkippedBecauseAlreadyExpanded === true,
    mountsExpandedGeometryDescriptors:
      rendererMounted === true &&
      geometryPortUsed === true &&
      geometryChildNodeCount > 0 &&
      placedNodeCount > geometryParentNodeCount,

    geometry032DOrganicVariationSyncDefined: true,
    geometryOrganicVariationEvidenceForwarded:
      organicLandscapeChildVariationDefined === true,
    organicClassSurfaceMountPreservationDefined: true,
    organicDataAttributeEmissionDefined: true,
    childPrimitiveEvidencePreservationDefined: true,
    projectionParentPrimitiveFamilyPreserved: true,

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
    warningCodes: uniqueHEarthRenderCodes(warningCodes),
    failureCodes: uniqueHEarthRenderCodes(failureCodes),
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

export function prepareHEarthRenderDescriptor({
  node,
  controller = null,
  mountNode = null,
  rootNode = null,
  options = Object.freeze({})
} = {}) {
  const normalizedNode =
    node?.landscapeProjectionNormalized === true
      ? node
      : resolveLandscapeRenderNode(node);

  const objectId =
    normalizedNode?.objectId ||
    normalizedNode?.sourceObjectId ||
    null;

  if (!objectId) {
    return Object.freeze({
      prepared: false,
      failureCode: 'NODE_SKIPPED_MISSING_OBJECT_ID',
      node: normalizedNode,
      objectId: null,
      claimBoundaryPreserved: true
    });
  }

  const classResolution = getHEarthRenderClassesForNode(
    normalizedNode,
    controller
  );

  const controllerTarget = resolveControllerTargetForRenderNode(
    normalizedNode,
    controller
  );

  return Object.freeze({
    prepared: true,
    objectId,
    node: normalizedNode,
    classResolution,
    className: classResolution?.className || '',
    controllerTarget,
    mountNode,
    rootNode,
    options,
    claimBoundaryPreserved: true
  });
}

export function applyHEarthRendererGeometryAttributes(objectNode, normalizedNode) {
  if (!objectNode || !normalizedNode) return false;

  if (normalizedNode.geometryExpansion) {
    objectNode.setAttribute(
      'data-h-earth-geometry-port-id',
      String(normalizedNode.geometryExpansion.geometryPortId || '')
    );

    objectNode.setAttribute(
      'data-h-earth-geometry-node-kind',
      String(normalizedNode.geometryExpansion.geometryNodeKind || '')
    );

    objectNode.setAttribute(
      'data-h-earth-geometry-expanded-from-parent',
      normalizedNode.geometryExpansion.expandedFromParent === true ? 'true' : 'false'
    );

    objectNode.setAttribute(
      'data-h-earth-geometry-parent-carry-node',
      normalizedNode.geometryExpansion.parentCarryNode === true ? 'true' : 'false'
    );

    if (normalizedNode.geometryExpansion.latticeAddress) {
      objectNode.setAttribute(
        'data-h-earth-lattice-address',
        String(normalizedNode.geometryExpansion.latticeAddress)
      );
    }

    if (normalizedNode.geometryExpansion.latticeRow !== null) {
      objectNode.setAttribute(
        'data-h-earth-lattice-row',
        String(normalizedNode.geometryExpansion.latticeRow)
      );
    }

    if (normalizedNode.geometryExpansion.latticeColumn !== null) {
      objectNode.setAttribute(
        'data-h-earth-lattice-column',
        String(normalizedNode.geometryExpansion.latticeColumn)
      );
    }
  }

  if (normalizedNode.parentObjectId) {
    objectNode.setAttribute(
      'data-h-earth-geometry-parent-object-id',
      String(normalizedNode.parentObjectId)
    );
  }

  if (normalizedNode.parentNodeId) {
    objectNode.setAttribute(
      'data-h-earth-geometry-parent-node-id',
      String(normalizedNode.parentNodeId)
    );
  }

  const organicVariationApplied =
    normalizedNode.organicVariationApplied === true ||
    normalizedNode.geometryExpansion?.organicVariationApplied === true;

  objectNode.setAttribute(
    'data-h-earth-organic-variation-applied',
    organicVariationApplied ? 'true' : 'false'
  );

  const organicProfileId =
    normalizedNode.organicProfileId ||
    normalizedNode.geometryExpansion?.organicProfileId ||
    '';

  const organicPlacementRole =
    normalizedNode.organicPlacementRole ||
    normalizedNode.geometryExpansion?.organicPlacementRole ||
    '';

  const organicVariationIndex =
    normalizedNode.organicVariationIndex ??
    normalizedNode.geometryExpansion?.organicVariationIndex ??
    '';

  const organicVariationSeed =
    normalizedNode.organicVariationSeed ??
    normalizedNode.geometryExpansion?.organicVariationSeed ??
    '';

  objectNode.setAttribute(
    'data-h-earth-organic-profile-id',
    String(organicProfileId)
  );

  objectNode.setAttribute(
    'data-h-earth-organic-placement-role',
    String(organicPlacementRole)
  );

  objectNode.setAttribute(
    'data-h-earth-organic-variation-index',
    String(organicVariationIndex)
  );

  objectNode.setAttribute(
    'data-h-earth-organic-variation-seed',
    String(organicVariationSeed)
  );

  objectNode.setAttribute(
    'data-h-earth-deterministic-organic-variation',
    (
      normalizedNode.deterministicOrganicVariation === true ||
      normalizedNode.geometryExpansion?.deterministicOrganicVariation === true
    )
      ? 'true'
      : 'false'
  );

  objectNode.setAttribute(
    'data-h-earth-random-runtime-variation-used',
    (
      normalizedNode.randomRuntimeVariationUsed === true ||
      normalizedNode.geometryExpansion?.randomRuntimeVariationUsed === true
    )
      ? 'true'
      : 'false'
  );

  return true;
}

export function applyHEarthRendererPrimitiveGeometryStyles(objectNode, normalizedNode) {
  if (!objectNode || !normalizedNode?.primitiveGeometry) return false;

  objectNode.setAttribute(
    'data-h-earth-primitive-profile',
    String(normalizedNode.primitiveGeometry.profileId)
  );

  objectNode.setAttribute(
    'data-h-earth-landscape-projection-normalized',
    'true'
  );

  objectNode.setAttribute(
    'data-h-earth-candidate-geometry-only',
    normalizedNode.candidateGeometryOnly === true ? 'true' : 'false'
  );

  objectNode.setAttribute(
    'data-h-earth-descriptor-only',
    normalizedNode.descriptorOnly === true ? 'true' : 'false'
  );

  objectNode.style.setProperty(
    '--h-earth-render-width',
    `${normalizedNode.primitiveGeometry.widthPx}px`
  );

  objectNode.style.setProperty(
    '--h-earth-render-height',
    `${normalizedNode.primitiveGeometry.heightPx}px`
  );

  objectNode.style.setProperty(
    '--h-earth-render-depth',
    `${normalizedNode.primitiveGeometry.depthPx}px`
  );

  objectNode.style.setProperty(
    '--h-earth-render-depth-scale',
    String(normalizedNode.cssTransformDescriptor?.profileDepthScale ?? 1)
  );

  objectNode.style.width = 'var(--h-earth-render-width)';
  objectNode.style.height = 'var(--h-earth-render-height)';

  return true;
}

export function applyHEarthRendererOrganicClassSurface(objectNode, normalizedNode) {
  if (!objectNode || !normalizedNode) return false;

  let applied = false;

  if (normalizedNode.geometryOrganicClassName) {
    objectNode.classList.add(normalizedNode.geometryOrganicClassName);
    applied = true;
  }

  if (normalizedNode.organicProfileId) {
    objectNode.classList.add(
      `h-earth-organic-profile-${normalizeHEarthRenderToken(normalizedNode.organicProfileId)}`
    );
    applied = true;
  }

  if (normalizedNode.organicPlacementRole) {
    objectNode.classList.add(
      `h-earth-organic-${normalizeHEarthRenderToken(normalizedNode.organicPlacementRole)}`
    );
    applied = true;
  }

  if (
    normalizedNode.organicVariationApplied === true ||
    normalizedNode.geometryExpansion?.organicVariationApplied === true
  ) {
    objectNode.classList.add('h-earth-render-organic-variation-ready');
    applied = true;
  }

  return applied;
}

export function mountHEarthPreparedRenderDescriptor({
  descriptor,
  mountNode,
  renderRoot,
  controller = null,
  options = Object.freeze({}),
  layerContainersById
} = {}) {
  if (!descriptor?.prepared) {
    return Object.freeze({
      mounted: false,
      placed: false,
      skipped: true,
      failureCode: descriptor?.failureCode || 'RENDER_DESCRIPTOR_NOT_PREPARED',
      claimBoundaryPreserved: true
    });
  }

  const normalizedNode = descriptor.node;

  const objectResult = createHEarthRenderObjectNode({
    documentRef: mountNode.ownerDocument,
    node: normalizedNode,
    controller,
    materialPort: H_EARTH_3D_RENDER_MATERIAL_PORT,
    layerPort: H_EARTH_3D_RENDER_LAYER_PORT,
    options: {
      ...options,
      mountNode,
      renderRoot,
      documentRef: mountNode.ownerDocument
    }
  });

  if (objectResult.created !== true || !objectResult.objectNode) {
    return Object.freeze({
      mounted: false,
      placed: false,
      skipped: true,
      failureCode: objectResult.failureCode || 'OBJECT_NODE_CREATION_FAILED',
      objectResult,
      claimBoundaryPreserved: true
    });
  }

  if (descriptor.className) {
    descriptor.className
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

  const organicClassSurfaceApplied =
    applyHEarthRendererOrganicClassSurface(objectResult.objectNode, normalizedNode);

  applyHEarthRendererGeometryAttributes(objectResult.objectNode, normalizedNode);
  const primitiveGeometryApplied =
    applyHEarthRendererPrimitiveGeometryStyles(objectResult.objectNode, normalizedNode);

  let labelCreated = false;
  let affordanceCreated = false;

  if (options?.showLabels === true) {
    const labelResult = createHEarthRenderLabelNode({
      documentRef: mountNode.ownerDocument,
      node: normalizedNode,
      controllerTarget: descriptor.controllerTarget,
      options: {
        ...options,
        mountNode,
        renderRoot,
        documentRef: mountNode.ownerDocument
      }
    });

    if (labelResult.created === true && labelResult.labelNode) {
      objectResult.objectNode.appendChild(labelResult.labelNode);
      labelCreated = true;
    }
  }

  if (options?.showAffordances === true) {
    const affordanceResult = createHEarthRenderAffordanceNode({
      documentRef: mountNode.ownerDocument,
      node: normalizedNode,
      controllerTarget: descriptor.controllerTarget,
      options: {
        ...options,
        mountNode,
        renderRoot,
        documentRef: mountNode.ownerDocument
      }
    });

    if (affordanceResult.created === true && affordanceResult.affordanceNode) {
      objectResult.objectNode.appendChild(affordanceResult.affordanceNode);
      affordanceCreated = true;
    }
  }

  const placement = placeHEarthNodeInLayer({
    objectNode: objectResult.objectNode,
    node: normalizedNode,
    layerContainersById
  });

  const classSurface = countHEarthClassSurface(objectResult.objectNode);

  return Object.freeze({
    mounted: placement.placed === true,
    placed: placement.placed === true,
    skipped: placement.placed !== true,
    objectNode: objectResult.objectNode,
    objectResult,
    placement,
    labelCreated,
    affordanceCreated,
    primitiveGeometryApplied,
    organicClassSurfaceApplied,
    classSurface,
    transformApplied: objectResult.transformApplied === true,
    visualGrammarReady: objectResult.visualGrammarReady === true,
    finalDomClassEmissionAuthority:
      objectResult.finalDomClassEmissionAuthority === true,
    warningCodes: uniqueHEarthRenderCodes([
      ...(Array.isArray(placement.warningCodes) ? placement.warningCodes : [])
    ]),
    failureCode: placement.placed === true
      ? null
      : placement.failureCode || 'NODE_PLACEMENT_FAILED',
    claimBoundaryPreserved: true
  });
}

function buildHEarthSelectedInputMountFields(selectedInput = {}) {
  return Object.freeze({
    selectedRenderInputSource: selectedInput.source,
    sourceDescriptorType: selectedInput.sourceDescriptorType,
    usedComposedFrame: selectedInput.usedComposedFrame,
    usedRenderSceneFallback: selectedInput.usedRenderSceneFallback,
    landscapeNormalizationApplied: selectedInput.landscapeNormalizationApplied,
    geometryPortUsed: selectedInput.geometryPortUsed,
    geometryExpansionApplied: selectedInput.geometryExpansionApplied,
    geometryExpansionSkippedBecauseAlreadyExpanded:
      selectedInput.geometryExpansionSkippedBecauseAlreadyExpanded,
    geometryExpansionSource: selectedInput.geometryExpansionSource,
    geometrySourceNodeCount: selectedInput.geometrySourceNodeCount,
    geometryExpandedNodeCount: selectedInput.geometryExpandedNodeCount,
    geometryReturnedNodeCount: selectedInput.geometryReturnedNodeCount,
    geometrySkippedNodeCount: selectedInput.geometrySkippedNodeCount,
    geometryBudgetSkippedNodeCount: selectedInput.geometryBudgetSkippedNodeCount,
    geometryParentNodeCount: selectedInput.geometryParentNodeCount,
    geometryChildNodeCount: selectedInput.geometryChildNodeCount,
    landscapeLatticeBundleForwarded: selectedInput.landscapeLatticeBundleForwarded,
    landscapeLatticeSource: selectedInput.landscapeLatticeSource,
    descriptorLandscapeLatticeAdmitted:
      selectedInput.descriptorLandscapeLatticeAdmitted,
    geometryLatticeAdmissionStatus:
      selectedInput.geometryLatticeAdmissionStatus,
    geometryLatticeAdmissionFailed:
      selectedInput.geometryLatticeAdmissionFailed,
    rendererLatticeAdmissionEvidence:
      selectedInput.rendererLatticeAdmissionEvidence,
    geometryReceipt: selectedInput.geometryReceipt,

    geometryOrganicVariationApplied:
      selectedInput.geometryOrganicVariationApplied === true,
    organicLandscapeChildVariationDefined:
      selectedInput.organicLandscapeChildVariationDefined === true,
    primitiveSpecificChildPlacementApplied:
      selectedInput.primitiveSpecificChildPlacementApplied === true,
    latticeRegularBandingMitigated:
      selectedInput.latticeRegularBandingMitigated === true,
    organicVariationSeededDeterministically:
      selectedInput.organicVariationSeededDeterministically === true,
    randomRuntimeVariationUsed:
      selectedInput.randomRuntimeVariationUsed === true,
    organicVariationSummary:
      selectedInput.organicVariationSummary || null,

    sourceNodeCount: selectedInput.nodeCount,
    rawSourceNodeCount: selectedInput.rawNodeCount
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
      failureCodes: Object.freeze([
        mountValidation.reason || 'INVALID_MOUNT_NODE'
      ]),
      boundary
    });
  }

  const selectedInput = selectHEarthRenderInput({
    candidateRenderScene,
    composedCandidateFrame,
    renderer,
    options,
    boundary
  });

  if (selectedInput.nodeCount === 0) {
    const clearResult = clearHEarthRendererOwnedNodes({ mountNode });

    return buildRendererMountReceipt({
      rendererMounted: false,
      mountNodeValid: true,
      priorOwnedNodesCleared: clearResult.cleared === true,
      priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
      ...buildHEarthSelectedInputMountFields(selectedInput),
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
      options: {
        ...options,
        mountNode,
        documentRef: mountNode.ownerDocument
      }
    });

    if (rootResult.created !== true || !rootResult.rootNode) {
      return buildRendererMountReceipt({
        rendererMounted: false,
        mountNodeValid: true,
        priorOwnedNodesCleared: clearResult.cleared === true,
        priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
        ...buildHEarthSelectedInputMountFields(selectedInput),
        materialPortUsed: true,
        layerPortUsed: true,
        nodeFactoryPortUsed: true,
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
        ...buildHEarthSelectedInputMountFields(selectedInput),
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
    let visualGrammarReadyCount = 0;
    let visualGrammarIncompleteCount = 0;
    let finalDomClassEmissionAuthorityCount = 0;
    let materialClassEmissionCount = 0;
    let primitiveClassEmissionCount = 0;
    let landscapeClassEmissionCount = 0;
    let layerMembershipClassEmissionCount = 0;
    let organicClassEmissionCount = 0;
    let organicVariationReadyCount = 0;

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

    const preparedDescriptors = selectedInput.nodes.map((node) =>
      prepareHEarthRenderDescriptor({
        node,
        controller,
        mountNode,
        rootNode: rootResult.rootNode,
        options
      })
    );

    preparedDescriptors.forEach((descriptor) => {
      if (descriptor.prepared !== true) {
        missingObjectCount += descriptor.failureCode === 'NODE_SKIPPED_MISSING_OBJECT_ID' ? 1 : 0;
        skippedNodeCount += 1;
        warningCodes.push(descriptor.failureCode || 'RENDER_DESCRIPTOR_PREPARATION_FAILED');
        return;
      }

      const mountResult = mountHEarthPreparedRenderDescriptor({
        descriptor,
        mountNode,
        renderRoot: rootResult.rootNode,
        controller,
        options,
        layerContainersById: layerResult.layerContainersById
      });

      if (mountResult.mounted !== true) {
        skippedNodeCount += 1;
        warningCodes.push(mountResult.failureCode || 'NODE_MOUNT_FAILED');
        return;
      }

      objectNodeCount += 1;
      placedNodeCount += 1;

      if (mountResult.transformApplied === true) {
        transformDescriptorAppliedCount += 1;
      } else {
        transformDescriptorMissingCount += 1;
      }

      if (mountResult.visualGrammarReady === true) {
        visualGrammarReadyCount += 1;
      } else {
        visualGrammarIncompleteCount += 1;
      }

      if (mountResult.finalDomClassEmissionAuthority === true) {
        finalDomClassEmissionAuthorityCount += 1;
      }

      if (mountResult.primitiveGeometryApplied === true) {
        primitiveGeometryAppliedCount += 1;
      }

      if (mountResult.labelCreated === true) labelNodeCount += 1;
      if (mountResult.affordanceCreated === true) affordanceNodeCount += 1;

      if (mountResult.classSurface?.hasMaterialClass === true) materialClassEmissionCount += 1;
      if (mountResult.classSurface?.hasPrimitiveClass === true) primitiveClassEmissionCount += 1;
      if (mountResult.classSurface?.hasLandscapeClass === true) landscapeClassEmissionCount += 1;
      if (mountResult.classSurface?.hasLayerMembershipClass === true) layerMembershipClassEmissionCount += 1;
      if (mountResult.classSurface?.hasOrganicClass === true) organicClassEmissionCount += 1;
      if (mountResult.classSurface?.hasOrganicVariationReadyClass === true) organicVariationReadyCount += 1;

      warningCodes.push(...(Array.isArray(mountResult.warningCodes) ? mountResult.warningCodes : []));
    });

    if (placedNodeCount === 0) failureCodes.push('NO_NODES_PLACED');
    if (skippedNodeCount > 0 && placedNodeCount > 0) warningCodes.push('MOUNT_PARTIAL');
    if (transformDescriptorMissingCount > 0) warningCodes.push('SOME_TRANSFORM_DESCRIPTORS_MISSING');
    if (visualGrammarIncompleteCount > 0 && visualGrammarReadyCount > 0) warningCodes.push('VISUAL_GRAMMAR_PARTIAL');
    if (visualGrammarReadyCount === 0 && objectNodeCount > 0) warningCodes.push('VISUAL_GRAMMAR_READY_COUNT_ZERO');

    return buildRendererMountReceipt({
      rendererMounted: placedNodeCount > 0,
      mountNodeValid: true,
      renderRootCreated: true,
      priorOwnedNodesCleared: clearResult.cleared === true,
      priorOwnedNodeCountRemoved: clearResult.removedCount || 0,
      layerContainersCreated: layerResult.created === true,
      layerCount: layerResult.layerCount || 0,
      ...buildHEarthSelectedInputMountFields(selectedInput),
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
      visualGrammarReadyCount,
      visualGrammarIncompleteCount,
      finalDomClassEmissionAuthorityCount,
      materialClassEmissionCount,
      primitiveClassEmissionCount,
      landscapeClassEmissionCount,
      layerMembershipClassEmissionCount,
      organicClassEmissionCount,
      organicVariationReadyCount,
      warningCodes,
      failureCodes,
      boundary
    });
  } catch (error) {
    return buildRendererMountReceipt({
      rendererMounted: false,
      mountNodeValid: true,
      ...buildHEarthSelectedInputMountFields(selectedInput),
      materialPortUsed: true,
      layerPortUsed: true,
      nodeFactoryPortUsed: true,
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
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1',
  renewedFrom:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032D_OPTIMIZED_LATTICE_ADMISSION_RENDERER_WIRING_v1',
  complementaryGeometryPort:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032D_ORGANIC_LANDSCAPE_CHILD_VARIATION_v1',

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

  nodeFactoryPortContractId:
    resolveHEarthPortContractId(H_EARTH_3D_RENDER_NODE_FACTORY),
  materialPortContractId:
    resolveHEarthPortContractId(H_EARTH_3D_RENDER_MATERIAL_PORT),
  layerPortContractId:
    resolveHEarthPortContractId(H_EARTH_3D_RENDER_LAYER_PORT),
  geometryPortContractId:
    resolveHEarthPortContractId(H_EARTH_3D_RENDER_GEOMETRY_PORT),

  defaultLandscapeLatticeBundleDefined: true,
  landscapeLatticeBundleForwardingDefined: true,
  rendererLatticeAdmissionEvidenceDefined: true,
  geometryAdmissionGateCompatibilityDefined: true,
  silentGeometryFallbackUsedOnAdmissionFailure: false,

  candidateRenderScenePreExpansionRemoved: true,
  candidateRenderSceneParentDescriptorsOnly: true,
  compositorReceivesParentDescriptorsOnly: true,
  geometryExpansionBeforeNodeFactoryDefined: true,
  geometryExpansionAfterCompositorHandoffOnly: true,
  alreadyExpandedInputGuardDefined: true,
  geometryPortDimensionsPreserved: true,
  geometryPortClassesPreserved: true,
  explicitMaxExpandedNodesPassedToGeometryPort: true,

  geometry032DOrganicVariationSyncDefined: true,
  geometryOrganicVariationEvidenceForwardingDefined: true,
  primitiveSpecificChildPlacementEvidenceForwardingDefined: true,
  organicClassSurfaceMountPreservationDefined: true,
  organicDataAttributeEmissionDefined: true,
  childPrimitiveEvidencePreservationDefined: true,
  projectionParentPrimitiveFamilyPreserved: true,
  randomRuntimeVariationUsed: false,

  preparedRenderDescriptorPassDefined: true,
  duplicateWarningDeduplicationDefined: true,
  projectionDescriptorReuseDefined: true,
  primitiveStyleApplicationHelperDefined: true,
  geometryAttributeApplicationHelperDefined: true,

  materialPortInjectedIntoNodeFactory: true,
  layerPortInjectedIntoNodeFactory: true,
  documentRefInjectedIntoNodeFactory: true,
  supportPortReceiptEvidenceDefined: true,

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
  freezeHEarthArray,
  uniqueHEarthRenderCodes,

  resolveHEarthPortContractId,
  resolveHEarthPortReceipt,
  resolveNodeFactoryReceiptSafe,
  resolveMaterialPortReceiptSafe,
  resolveLayerPortReceiptSafe,
  resolveDefaultHEarthLandscapeLatticeBundle,
  resolveHEarthRendererLandscapeLatticeBundle,
  normalizeHEarthLandscapeLatticeAdmissionEvidence,
  resolveGeometryPortReceiptSafe,
  extractHEarthGeometryOrganicEvidence,
  makeHEarthDefaultOrganicEvidence,

  isHEarthGeometryExpandedNode,
  inputContainsHEarthGeometryExpansion,
  resolveRenderLayer,
  resolveMaterialToken,
  resolveNodeCenter,
  resolveNodeExtent,
  resolveCandidateScaleTriplet,
  resolveCandidateRotation,
  resolveDepthClassForNode,
  resolveNormalizedDepthForNode,
  resolveChildPrimitiveEvidenceForNode,
  resolveProjectionPrimitiveTypeForNode,
  resolvePrimitiveProjectionProfile,
  resolveDepthProjectionMultiplier,
  resolveProjectedPosition,
  resolveLandscapeRenderDimensions,
  resolveCssTransform,
  resolvePrimitiveRenderGeometry,
  resolveLandscapeRenderNode,
  normalizeLandscapeRenderNodes,
  applyExpandedRenderNodeBudget,
  expandLandscapeRenderNodesWithGeometryPort,
  resolveCandidateRenderNodes,
  applyParentRenderNodeBudget,
  applyRenderNodeBudget,
  resolveCandidateRenderScene,
  selectHEarthRenderInput,
  resolveControllerTargetForRenderNode,
  countHEarthClassSurface,

  prepareHEarthRenderDescriptor,
  applyHEarthRendererGeometryAttributes,
  applyHEarthRendererPrimitiveGeometryStyles,
  applyHEarthRendererOrganicClassSurface,
  mountHEarthPreparedRenderDescriptor,

  buildHEarthSelectedInputMountFields,
  buildRendererMountReceipt,
  buildRendererDestroyReceipt,
  mountHEarthRenderer,
  destroyHEarthRenderer,

  getReceipt: getRendererReceipt,
  receipt: H_EARTH_3D_RENDERER_RECEIPT
});

export default H_EARTH_3D_RENDERER;
