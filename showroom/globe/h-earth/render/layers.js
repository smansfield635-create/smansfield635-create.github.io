// /showroom/globe/h-earth/render/layers.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_031G_TRUE_LAYER_RENUMERIZATION_RENEWAL_v1
//
// Renews:
// H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_023A_v1
//
// Parent standard:
// H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1
//
// Upstream support renewals:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1
//
// Purpose:
// Optimized layer-only resolver and placement port for the H-Earth
// DOM/CSS-3D Candidate Renderer.
//
// This file owns layer-id normalization, layer container class resolution,
// deterministic layer ordering, object-level layer membership class resolution,
// parent/child layer consistency for geometry-expanded nodes, layer dataset
// export, and renderer-compatible placement of already-created object nodes.
//
// This file does not own material classes, primitive classes, landscape classes,
// geometry expansion, context classification, interaction state, final DOM class
// emission, renderer orchestration, route shell, route CSS, gameplay, traversal,
// simulation, WebGL, canvas, visual-pass claims, validation claims, production
// claims, or matrix collapse.

export const H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_031G_TRUE_LAYER_RENUMERIZATION_RENEWAL_v1',
  renewedFrom: 'H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_023A_v1',

  parentStandard: 'H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1',
  parentGeometryRenewal:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',
  parentMaterialRenewal:
    'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/render/layers.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_TRUE_LAYER_RESOLUTION_PORT',
  status: 'TRUE_LAYER_PORT_RENUMERIZED_NON_FINAL_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  owns: Object.freeze({
    layerIdNormalization: true,
    layerContainerClassResolution: true,
    deterministicLayerOrdering: true,
    objectLayerMembershipClassResolution: true,
    parentAwareGeometryChildLayerResolution: true,
    layerDataset: true,
    layerContainerCreation: true,
    objectNodePlacement: true
  }),

  doesNotOwn: Object.freeze({
    materialClassResolution: true,
    primitiveClassResolution: true,
    landscapeClassResolution: true,
    geometryExpansion: true,
    contextClassification: true,
    interactionResolution: true,
    finalDomClassEmission: true,
    rendererOrchestration: true,
    routeCss: true
  }),

  boundary: Object.freeze({
    createsLayerContainers: true,
    createsObjectNodes: false,
    definesMaterialClasses: false,
    ownsCompositorOrdering: false,
    bypassesCompositor: false,
    queriesGlobalDocument: false,

    mutatesOnlySuppliedRenderRoot: true,
    placesAlreadyCreatedObjectNodes: true,
    mayApplyLayerMembershipClassesOnly: true,
    mayApplyMaterialClasses: false,
    mayApplyPrimitiveClasses: false,
    mayApplyLandscapeClasses: false,
    mayApplyContextClasses: false,
    mayApplyInteractionClasses: false,

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
    traversalClaim: false,
    simulationClaim: false,
    matrixCollapse: false,

    claimBoundaryPreserved: true
  })
});

export const H_EARTH_3D_RENDER_LAYER_DATASET_KEYS = Object.freeze({
  renderOwned: 'hEarthRenderOwned',
  renderNodeType: 'hEarthRenderNodeType',
  layerId: 'hEarthLayerId',
  requestedLayerId: 'hEarthRequestedLayerId',
  layerOrder: 'hEarthLayerOrder',
  layerClass: 'hEarthLayerClass',
  layerMemberClass: 'hEarthLayerMemberClass',
  layerResolutionSource: 'hEarthLayerResolutionSource',
  layerFallbackUsed: 'hEarthLayerFallbackUsed'
});

export const H_EARTH_3D_RENDER_LAYER_POLICY = Object.freeze({
  ownershipAttribute: 'data-h-earth-render-owned',
  ownershipValue: 'true',
  layerNodeType: 'layer',
  fallbackLayerId: 'unclassified-render-layer',
  baseLayerClass: 'h-earth-render-layer',
  baseLayerMemberClass: 'h-earth-layer-member',

  boundary: Object.freeze({
    layerPlacementOnly: true,
    trueLayerResolver: true,
    createsLayerContainers: true,
    createsObjectNodes: false,
    mutatesOnlySuppliedRenderRoot: true,
    queriesGlobalDocument: false,
    materialClassOwnership: false,
    primitiveClassOwnership: false,
    landscapeClassOwnership: false,
    contextClassOwnership: false,
    interactionClassOwnership: false,
    finalDomClassEmissionOwnership: false,
    webglActivation: false,
    canvasActivation: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export const H_EARTH_3D_RENDER_LAYER_CLASS_MAP = Object.freeze({
  'distant-world-context-layer': Object.freeze({
    layerId: 'distant-world-context-layer',
    className: 'h-earth-layer-distant-world-context',
    layerMemberClassName: 'h-earth-layer-member-distant-world-context',
    defaultOrder: 10,
    layerRole: 'distant-world-context'
  }),

  'air-haze-light-layer': Object.freeze({
    layerId: 'air-haze-light-layer',
    className: 'h-earth-layer-air-haze-light',
    layerMemberClassName: 'h-earth-layer-member-air-haze-light',
    defaultOrder: 20,
    layerRole: 'air-haze-light'
  }),

  'water-surface-plane-layer': Object.freeze({
    layerId: 'water-surface-plane-layer',
    className: 'h-earth-layer-water-surface-plane',
    layerMemberClassName: 'h-earth-layer-member-water-surface-plane',
    defaultOrder: 30,
    layerRole: 'water-surface-plane'
  }),

  'nearshore-wave-band-layer': Object.freeze({
    layerId: 'nearshore-wave-band-layer',
    className: 'h-earth-layer-nearshore-wave-band',
    layerMemberClassName: 'h-earth-layer-member-nearshore-wave-band',
    defaultOrder: 40,
    layerRole: 'nearshore-wave-band'
  }),

  'shoreline-foam-line-layer': Object.freeze({
    layerId: 'shoreline-foam-line-layer',
    className: 'h-earth-layer-shoreline-foam-line',
    layerMemberClassName: 'h-earth-layer-member-shoreline-foam-line',
    defaultOrder: 50,
    layerRole: 'shoreline-foam-line'
  }),

  'manor-exterior-context-layer': Object.freeze({
    layerId: 'manor-exterior-context-layer',
    className: 'h-earth-layer-manor-exterior-context',
    layerMemberClassName: 'h-earth-layer-member-manor-exterior-context',
    defaultOrder: 60,
    layerRole: 'manor-exterior-context'
  }),

  'dry-sand-transition-layer': Object.freeze({
    layerId: 'dry-sand-transition-layer',
    className: 'h-earth-layer-dry-sand-transition',
    layerMemberClassName: 'h-earth-layer-member-dry-sand-transition',
    defaultOrder: 70,
    layerRole: 'dry-sand-transition'
  }),

  'foreground-wet-sand-layer': Object.freeze({
    layerId: 'foreground-wet-sand-layer',
    className: 'h-earth-layer-foreground-wet-sand',
    layerMemberClassName: 'h-earth-layer-member-foreground-wet-sand',
    defaultOrder: 80,
    layerRole: 'foreground-wet-sand'
  }),

  'tide-pools-stones-rocks-detail-layer': Object.freeze({
    layerId: 'tide-pools-stones-rocks-detail-layer',
    className: 'h-earth-layer-tide-pools-stones-rocks-detail',
    layerMemberClassName:
      'h-earth-layer-member-tide-pools-stones-rocks-detail',
    defaultOrder: 90,
    layerRole: 'tide-pools-stones-rocks-detail'
  }),

  'inspection-anchor-overlay-layer': Object.freeze({
    layerId: 'inspection-anchor-overlay-layer',
    className: 'h-earth-layer-inspection-anchor-overlay',
    layerMemberClassName: 'h-earth-layer-member-inspection-anchor-overlay',
    defaultOrder: 100,
    layerRole: 'inspection-anchor-overlay'
  }),

  'unclassified-render-layer': Object.freeze({
    layerId: 'unclassified-render-layer',
    className: 'h-earth-layer-unclassified-render',
    layerMemberClassName: 'h-earth-layer-member-unclassified-render',
    defaultOrder: 999,
    layerRole: 'unclassified-render'
  })
});

export const H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_LAYER_ID = Object.freeze({
  distantCluster: 'distant-world-context-layer',
  atmosphericLayer: 'air-haze-light-layer',
  waterPlane: 'water-surface-plane-layer',
  waterDepthBand: 'nearshore-wave-band-layer',
  irregularShorelineBand: 'shoreline-foam-line-layer',
  layeredSilhouette: 'manor-exterior-context-layer',
  terrainBand: 'dry-sand-transition-layer',
  contouredTerrainBand: 'foreground-wet-sand-layer',
  scatterCluster: 'tide-pools-stones-rocks-detail-layer',
  rockCluster: 'tide-pools-stones-rocks-detail-layer',
  inspectionAnchor: 'inspection-anchor-overlay-layer'
});

export const H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_LAYER_ID = Object.freeze({
  candidateWaterSurfacePlane: 'water-surface-plane-layer',
  candidateWaterDepthBand: 'water-surface-plane-layer',
  candidateWaterReflectionStrip: 'water-surface-plane-layer',

  candidateNearshoreWaterDepthBase: 'nearshore-wave-band-layer',
  candidateNearshoreRippleStrip: 'nearshore-wave-band-layer',

  candidateShorelineContactBase: 'shoreline-foam-line-layer',
  candidateShorelineIrregularEdge: 'shoreline-foam-line-layer',
  candidateShorelineFoamBreak: 'shoreline-foam-line-layer',

  candidateDrySandGroundPlane: 'dry-sand-transition-layer',
  candidateDrySandTransitionRidge: 'dry-sand-transition-layer',
  candidateDrySandSurfacePatch: 'dry-sand-transition-layer',

  candidateWetSandGroundPlane: 'foreground-wet-sand-layer',
  candidateWetSandContourRidge: 'foreground-wet-sand-layer',
  candidateWetSandMoisturePatch: 'foreground-wet-sand-layer',
  candidateWetSandReflectiveSheen: 'foreground-wet-sand-layer',
  candidateWetSandGrainDetail: 'foreground-wet-sand-layer',

  candidateSurfaceScatterMember: 'tide-pools-stones-rocks-detail-layer',
  candidateRockClusterMember: 'tide-pools-stones-rocks-detail-layer',

  candidateAirHazePanel: 'air-haze-light-layer',
  candidateAirLightBand: 'air-haze-light-layer',

  candidateManorContextBody: 'manor-exterior-context-layer',
  candidateManorContextRoof: 'manor-exterior-context-layer',
  candidateManorContextVerticalSegment: 'manor-exterior-context-layer',

  candidateDistantWorldSilhouette: 'distant-world-context-layer',
  candidateInspectionAnchorMarker: 'inspection-anchor-overlay-layer'
});

export function normalizeHEarthLayerId(
  layerId,
  fallback = H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
) {
  const raw = String(layerId || fallback).trim();

  if (!raw) {
    return fallback;
  }

  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const aliasMap = Object.freeze({
    distant: 'distant-world-context-layer',
    'distant-world': 'distant-world-context-layer',
    'distant-context': 'distant-world-context-layer',
    'distant-world-context': 'distant-world-context-layer',

    atmosphere: 'air-haze-light-layer',
    haze: 'air-haze-light-layer',
    'air-haze': 'air-haze-light-layer',
    'air-haze-light': 'air-haze-light-layer',

    water: 'water-surface-plane-layer',
    'water-surface': 'water-surface-plane-layer',
    'water-plane': 'water-surface-plane-layer',
    'water-surface-plane': 'water-surface-plane-layer',

    nearshore: 'nearshore-wave-band-layer',
    wave: 'nearshore-wave-band-layer',
    'nearshore-wave': 'nearshore-wave-band-layer',
    'nearshore-wave-band': 'nearshore-wave-band-layer',

    shoreline: 'shoreline-foam-line-layer',
    foam: 'shoreline-foam-line-layer',
    'foam-line': 'shoreline-foam-line-layer',
    'shoreline-foam-line': 'shoreline-foam-line-layer',

    manor: 'manor-exterior-context-layer',
    'manor-context': 'manor-exterior-context-layer',
    'manor-exterior': 'manor-exterior-context-layer',

    dry: 'dry-sand-transition-layer',
    'dry-sand': 'dry-sand-transition-layer',
    'dry-sand-transition': 'dry-sand-transition-layer',

    wet: 'foreground-wet-sand-layer',
    'wet-sand': 'foreground-wet-sand-layer',
    'foreground-wet-sand': 'foreground-wet-sand-layer',

    detail: 'tide-pools-stones-rocks-detail-layer',
    'tide-pools': 'tide-pools-stones-rocks-detail-layer',
    stones: 'tide-pools-stones-rocks-detail-layer',
    rocks: 'tide-pools-stones-rocks-detail-layer',
    'tide-pools-stones-rocks-detail':
      'tide-pools-stones-rocks-detail-layer',

    anchor: 'inspection-anchor-overlay-layer',
    inspection: 'inspection-anchor-overlay-layer',
    'inspection-anchor': 'inspection-anchor-overlay-layer',
    'inspection-anchor-overlay': 'inspection-anchor-overlay-layer',

    unclassified: 'unclassified-render-layer',
    'unclassified-render': 'unclassified-render-layer'
  });

  if (H_EARTH_3D_RENDER_LAYER_CLASS_MAP[normalized]) {
    return normalized;
  }

  if (aliasMap[normalized]) {
    return aliasMap[normalized];
  }

  const withLayerSuffix = normalized.endsWith('-layer')
    ? normalized
    : `${normalized}-layer`;

  if (H_EARTH_3D_RENDER_LAYER_CLASS_MAP[withLayerSuffix]) {
    return withLayerSuffix;
  }

  return fallback;
}

export function normalizeHEarthLayerClassArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

export function uniqueHEarthLayerClassNames(classNames = []) {
  const seen = new Set();

  return Object.freeze(
    normalizeHEarthLayerClassArray(classNames)
      .flatMap((value) => String(value || '').split(/\s+/))
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => {
        if (seen.has(value)) {
          return false;
        }

        seen.add(value);
        return true;
      })
  );
}

export function joinHEarthLayerClassNames(classNames = []) {
  return uniqueHEarthLayerClassNames(classNames).join(' ');
}

export function resolveHEarthParentPrimitiveTypeForLayer(node = {}) {
  return (
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    node.originalPrimitiveType ||
    null
  );
}

export function resolveHEarthChildPrimitiveTypeForLayer(node = {}) {
  return (
    node.geometryExpansion?.childPrimitiveType ||
    node.primitiveType ||
    node.primitive?.primitiveType ||
    node.primitiveSchema?.primitiveType ||
    null
  );
}

export function resolveHEarthObjectIdForLayer(node = {}) {
  return (
    node.objectId ||
    node.sourceObject?.objectId ||
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    null
  );
}

export function resolveHEarthSourceObjectIdForLayer(node = {}) {
  return (
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthObjectIdForLayer(node)
  );
}

export function resolveHEarthParentObjectIdForLayer(node = {}) {
  return (
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthObjectIdForLayer(node)
  );
}

export function resolveHEarthNodeIdForLayer(node = {}) {
  return (
    node.nodeId ||
    node.sourceNodeId ||
    node.composedNodeId ||
    node.parentNodeId ||
    node.geometryParentNodeId ||
    node.geometryExpansion?.parentNodeId ||
    null
  );
}

export function resolveHEarthRequestedLayerIdForNode(node = {}) {
  return (
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    node.sourceObject?.layerId ||
    node.parentLayerId ||
    node.geometryExpansion?.layerId ||
    null
  );
}

export function resolveHEarthFallbackLayerIdForNode(node = {}) {
  const parentPrimitiveType = resolveHEarthParentPrimitiveTypeForLayer(node);
  const parentPrimitiveLayer =
    H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_LAYER_ID[parentPrimitiveType];

  if (parentPrimitiveLayer) {
    return parentPrimitiveLayer;
  }

  const childPrimitiveType = resolveHEarthChildPrimitiveTypeForLayer(node);
  const childPrimitiveLayer =
    H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_LAYER_ID[childPrimitiveType];

  if (childPrimitiveLayer) {
    return childPrimitiveLayer;
  }

  return H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;
}

export function resolveHEarthLayerClass(layerId) {
  const normalizedLayerId = normalizeHEarthLayerId(layerId);
  const layer =
    H_EARTH_3D_RENDER_LAYER_CLASS_MAP[normalizedLayerId] ||
    H_EARTH_3D_RENDER_LAYER_CLASS_MAP[
      H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
    ];

  const fallbackUsed =
    layer.layerId === H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;

  return Object.freeze({
    layerId: layer.layerId,
    requestedLayerId: layerId || null,
    className: layer.className,
    layerClassName: layer.className,
    layerMemberClassName: layer.layerMemberClassName,
    defaultOrder: layer.defaultOrder,
    layerRole: layer.layerRole,
    resolved: fallbackUsed === false,
    fallbackUsed,
    compositorOrderingBypassed: false,
    finalOrderingValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthLayerOrderForNode(node = {}, resolvedLayer = null) {
  const rawLayerOrder =
    node.layerOrder ??
    node.renderLayerOrder ??
    node.layer?.order ??
    node.composition?.layerOrder ??
    resolvedLayer?.defaultOrder;

  const numberValue = Number(rawLayerOrder);

  return Number.isFinite(numberValue)
    ? numberValue
    : resolvedLayer?.defaultOrder ??
        H_EARTH_3D_RENDER_LAYER_CLASS_MAP[
          H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
        ].defaultOrder;
}

export function resolveHEarthLayerMembershipForNode(node = {}) {
  const requestedLayerId = resolveHEarthRequestedLayerIdForNode(node);
  const fallbackLayerId = resolveHEarthFallbackLayerIdForNode(node);
  const normalizedRequestedLayerId = requestedLayerId
    ? normalizeHEarthLayerId(requestedLayerId, fallbackLayerId)
    : fallbackLayerId;

  const resolutionSource = requestedLayerId
    ? 'node-layer-field'
    : fallbackLayerId !== H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
      ? 'parent-or-child-primitive-fallback'
      : 'fallback-layer';

  const resolvedLayer = resolveHEarthLayerClass(normalizedRequestedLayerId);
  const layerOrder = resolveHEarthLayerOrderForNode(node, resolvedLayer);

  const layerClassNames = uniqueHEarthLayerClassNames([
    H_EARTH_3D_RENDER_LAYER_POLICY.baseLayerClass,
    resolvedLayer.layerClassName
  ]);

  const layerMemberClassNames = uniqueHEarthLayerClassNames([
    H_EARTH_3D_RENDER_LAYER_POLICY.baseLayerMemberClass,
    node.layerMemberClassName,
    node.geometryExpansion?.layerMemberClassName,
    resolvedLayer.layerMemberClassName
  ]);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForLayer(node),
    sourceObjectId: resolveHEarthSourceObjectIdForLayer(node),
    parentObjectId: resolveHEarthParentObjectIdForLayer(node),
    nodeId: resolveHEarthNodeIdForLayer(node),

    layerId: resolvedLayer.layerId,
    requestedLayerId,
    normalizedRequestedLayerId,
    fallbackLayerId,

    layerOrder,
    defaultOrder: resolvedLayer.defaultOrder,
    layerRole: resolvedLayer.layerRole,

    layerClassName: resolvedLayer.layerClassName,
    layerMemberClassName: resolvedLayer.layerMemberClassName,
    layerClassNames,
    layerMemberClassNames,
    layerClassNameJoined: joinHEarthLayerClassNames(layerClassNames),
    layerMemberClassNameJoined: joinHEarthLayerClassNames(layerMemberClassNames),

    resolved: resolvedLayer.resolved,
    fallbackUsed: resolvedLayer.fallbackUsed,
    resolutionSource,
    parentAwareLayerResolution: true,
    objectLayerMembershipClassRequired: true,

    materialClassOwnership: false,
    primitiveClassOwnership: false,
    landscapeClassOwnership: false,
    contextClassOwnership: false,
    interactionClassOwnership: false,
    finalDomClassEmissionOwnership: false,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthLayerIdForNode(node = {}) {
  const membership = resolveHEarthLayerMembershipForNode(node);

  return Object.freeze({
    nodeId: membership.nodeId,
    objectId: membership.objectId,
    sourceObjectId: membership.sourceObjectId,
    parentObjectId: membership.parentObjectId,

    layerId: membership.layerId,
    requestedLayerId: membership.requestedLayerId,
    layerOrder: membership.layerOrder,
    resolved: membership.resolved,
    fallbackUsed: membership.fallbackUsed,
    resolutionSource: membership.resolutionSource,
    parentAwareLayerResolution: true,

    compositorOrderingBypassed: false,
    finalOrderingValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthLayerDataset(node = {}) {
  const membership = resolveHEarthLayerMembershipForNode(node);

  return Object.freeze({
    hEarthLayerId: membership.layerId,
    hEarthRequestedLayerId: membership.requestedLayerId || '',
    hEarthLayerOrder: String(membership.layerOrder),
    hEarthLayerClass: membership.layerClassName,
    hEarthLayerMemberClass: membership.layerMemberClassName,
    hEarthLayerResolutionSource: membership.resolutionSource,
    hEarthLayerFallbackUsed: String(membership.fallbackUsed === true),
    hEarthParentAwareLayerResolution: 'true',
    hEarthLayerVisualPassClaim: 'false',
    hEarthLayerValidationClaim: 'false'
  });
}

export function getHEarthLayerClassForNode(node = {}) {
  const membership = resolveHEarthLayerMembershipForNode(node);

  return Object.freeze({
    objectId: membership.objectId,
    sourceObjectId: membership.sourceObjectId,
    parentObjectId: membership.parentObjectId,
    nodeId: membership.nodeId,

    layerId: membership.layerId,
    requestedLayerId: membership.requestedLayerId,
    layerOrder: membership.layerOrder,
    layerClassName: membership.layerClassName,
    layerMemberClassName: membership.layerMemberClassName,

    containerClassNames: membership.layerClassNames,
    layerClassNames: membership.layerClassNames,
    objectMembershipClassNames: membership.layerMemberClassNames,
    layerMemberClassNames: membership.layerMemberClassNames,

    classNames: membership.layerMemberClassNames,
    className: membership.layerMemberClassNameJoined,

    dataset: getHEarthLayerDataset(node),

    resolved: membership.resolved,
    fallbackUsed: membership.fallbackUsed,
    resolutionSource: membership.resolutionSource,
    parentAwareLayerResolution: true,

    materialClassOwnership: false,
    primitiveClassOwnership: false,
    landscapeClassOwnership: false,
    contextClassOwnership: false,
    interactionClassOwnership: false,
    finalDomClassEmissionOwnership: false,

    boundary: H_EARTH_3D_RENDER_LAYER_POLICY.boundary
  });
}

export function resolveHEarthLayerDescriptors({
  layerOrder,
  composedCandidateFrame,
  candidateRenderScene
} = {}) {
  const descriptors = [];

  const pushDescriptor = (layerId, order, source) => {
    const resolved = resolveHEarthLayerClass(layerId);

    descriptors.push({
      layerId: resolved.layerId,
      order:
        Number.isFinite(Number(order)) === true
          ? Number(order)
          : resolved.defaultOrder,
      source
    });
  };

  if (Array.isArray(layerOrder) && layerOrder.length > 0) {
    layerOrder.forEach((entry, index) => {
      if (typeof entry === 'string') {
        const resolved = resolveHEarthLayerClass(entry);
        pushDescriptor(entry, resolved.defaultOrder ?? index, 'layerOrder');
        return;
      }

      if (entry && typeof entry === 'object') {
        pushDescriptor(
          entry.layerId || entry.id || entry.name,
          entry.order,
          'layerOrder'
        );
      }
    });
  }

  const frameLayerOrder =
    composedCandidateFrame?.layerOrder ||
    composedCandidateFrame?.composition?.layerOrder ||
    composedCandidateFrame?.layers ||
    null;

  if (descriptors.length === 0 && Array.isArray(frameLayerOrder)) {
    frameLayerOrder.forEach((entry, index) => {
      const layerId =
        typeof entry === 'string'
          ? entry
          : entry?.layerId || entry?.id || entry?.name;

      const resolved = resolveHEarthLayerClass(layerId);

      pushDescriptor(
        layerId,
        typeof entry === 'object' && Number.isFinite(Number(entry?.order))
          ? Number(entry.order)
          : resolved.defaultOrder ?? index,
        'composedCandidateFrame'
      );
    });
  }

  const sceneLayerOrder =
    candidateRenderScene?.layerOrder ||
    candidateRenderScene?.layers ||
    null;

  if (descriptors.length === 0 && Array.isArray(sceneLayerOrder)) {
    sceneLayerOrder.forEach((entry, index) => {
      const layerId =
        typeof entry === 'string'
          ? entry
          : entry?.layerId || entry?.id || entry?.name;

      const resolved = resolveHEarthLayerClass(layerId);

      pushDescriptor(
        layerId,
        typeof entry === 'object' && Number.isFinite(Number(entry?.order))
          ? Number(entry.order)
          : resolved.defaultOrder ?? index,
        'candidateRenderScene'
      );
    });
  }

  if (descriptors.length === 0) {
    Object.values(H_EARTH_3D_RENDER_LAYER_CLASS_MAP)
      .filter(
        (layer) =>
          layer.layerId !== H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
      )
      .forEach((layer) => {
        descriptors.push({
          layerId: layer.layerId,
          order: layer.defaultOrder,
          source: 'defaultLayerMap'
        });
      });
  }

  const seen = new Set();
  const deduped = descriptors
    .filter((descriptor) => {
      if (!descriptor?.layerId || seen.has(descriptor.layerId)) {
        return false;
      }

      seen.add(descriptor.layerId);
      return true;
    })
    .sort((a, b) => Number(a.order) - Number(b.order));

  const fallbackLayer =
    H_EARTH_3D_RENDER_LAYER_CLASS_MAP[
      H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
    ];

  if (!seen.has(fallbackLayer.layerId)) {
    deduped.push({
      layerId: fallbackLayer.layerId,
      order: fallbackLayer.defaultOrder,
      source: 'requiredFallbackLayer'
    });
  }

  return Object.freeze(
    deduped.map((descriptor) =>
      Object.freeze({
        layerId: descriptor.layerId,
        order: descriptor.order,
        source: descriptor.source
      })
    )
  );
}

export function createHEarthLayerContainer({
  documentRef,
  layerDescriptor
} = {}) {
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      layerContainer: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const resolvedLayer = resolveHEarthLayerClass(layerDescriptor?.layerId);
  const layerOrder = Number.isFinite(Number(layerDescriptor?.order))
    ? Number(layerDescriptor.order)
    : resolvedLayer.defaultOrder;

  const layerContainer = documentRef.createElement('div');

  const containerClassNames = uniqueHEarthLayerClassNames([
    H_EARTH_3D_RENDER_LAYER_POLICY.baseLayerClass,
    resolvedLayer.layerClassName
  ]);

  layerContainer.className = joinHEarthLayerClassNames(containerClassNames);

  layerContainer.setAttribute(
    H_EARTH_3D_RENDER_LAYER_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_LAYER_POLICY.ownershipValue
  );

  layerContainer.setAttribute(
    'data-h-earth-render-node-type',
    H_EARTH_3D_RENDER_LAYER_POLICY.layerNodeType
  );

  layerContainer.setAttribute('data-h-earth-layer-id', resolvedLayer.layerId);
  layerContainer.setAttribute('data-h-earth-layer-order', String(layerOrder));
  layerContainer.setAttribute('data-h-earth-layer-class', resolvedLayer.layerClassName);
  layerContainer.setAttribute(
    'data-h-earth-layer-member-class',
    resolvedLayer.layerMemberClassName
  );
  layerContainer.setAttribute('data-h-earth-layer-role', resolvedLayer.layerRole);

  if (layerContainer.dataset) {
    layerContainer.dataset.hEarthRenderOwned = 'true';
    layerContainer.dataset.hEarthRenderNodeType =
      H_EARTH_3D_RENDER_LAYER_POLICY.layerNodeType;
    layerContainer.dataset.hEarthLayerId = resolvedLayer.layerId;
    layerContainer.dataset.hEarthLayerOrder = String(layerOrder);
    layerContainer.dataset.hEarthLayerClass = resolvedLayer.layerClassName;
    layerContainer.dataset.hEarthLayerMemberClass =
      resolvedLayer.layerMemberClassName;
    layerContainer.dataset.hEarthLayerRole = resolvedLayer.layerRole;
  }

  layerContainer.style.transformStyle = 'preserve-3d';

  return Object.freeze({
    layerContainer,
    layerId: resolvedLayer.layerId,
    layerOrder,
    layerClass: resolvedLayer.layerClassName,
    layerClassName: resolvedLayer.layerClassName,
    layerMemberClassName: resolvedLayer.layerMemberClassName,
    layerRole: resolvedLayer.layerRole,
    classNames: containerClassNames,
    created: true,
    fallbackUsed: resolvedLayer.fallbackUsed,
    rendererOwned: true,
    boundary: Object.freeze({
      createdInsideRendererRootOnly: true,
      createsObjectNodes: false,
      ownsCompositorOrdering: false,
      bypassesCompositor: false,
      materialClassOwnership: false,
      primitiveClassOwnership: false,
      landscapeClassOwnership: false,
      contextClassOwnership: false,
      interactionClassOwnership: false,
      finalDomClassEmissionOwnership: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function createHEarthLayerContainers({
  renderRoot,
  rootNode,
  layerOrder,
  composedCandidateFrame,
  candidateRenderScene
} = {}) {
  const targetRoot = renderRoot || rootNode;

  if (!targetRoot || typeof targetRoot.appendChild !== 'function') {
    return Object.freeze({
      layerContainersById: Object.freeze({}),
      orderedLayerIds: Object.freeze([]),
      layerCount: 0,
      created: false,
      failureCodes: Object.freeze(['INVALID_RENDER_ROOT']),
      warningCodes: Object.freeze([]),
      boundary: Object.freeze({
        rendererRootAccepted: false,
        claimBoundaryPreserved: true
      })
    });
  }

  const documentRef = targetRoot.ownerDocument;

  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      layerContainersById: Object.freeze({}),
      orderedLayerIds: Object.freeze([]),
      layerCount: 0,
      created: false,
      failureCodes: Object.freeze(['INVALID_DOCUMENT_REF']),
      warningCodes: Object.freeze([]),
      boundary: Object.freeze({
        rendererRootAccepted: true,
        claimBoundaryPreserved: true
      })
    });
  }

  const descriptors = resolveHEarthLayerDescriptors({
    layerOrder,
    composedCandidateFrame,
    candidateRenderScene
  });

  const layerContainersById = {};
  const orderedLayerIds = [];
  const warningCodes = [];

  descriptors.forEach((descriptor) => {
    const result = createHEarthLayerContainer({
      documentRef,
      layerDescriptor: descriptor
    });

    if (result.created !== true || !result.layerContainer) {
      warningCodes.push(`LAYER_CONTAINER_SKIPPED:${descriptor.layerId}`);
      return;
    }

    targetRoot.appendChild(result.layerContainer);
    layerContainersById[result.layerId] = result.layerContainer;
    orderedLayerIds.push(result.layerId);
  });

  return Object.freeze({
    layerContainersById: Object.freeze(layerContainersById),
    orderedLayerIds: Object.freeze(orderedLayerIds),
    layerCount: orderedLayerIds.length,
    created: orderedLayerIds.length > 0,
    failureCodes: Object.freeze([]),
    warningCodes: Object.freeze(warningCodes),
    boundary: Object.freeze({
      createdInsideRendererRootOnly: true,
      createsObjectNodes: false,
      ownsCompositorOrdering: false,
      bypassesCompositor: false,
      materialClassOwnership: false,
      primitiveClassOwnership: false,
      landscapeClassOwnership: false,
      contextClassOwnership: false,
      interactionClassOwnership: false,
      finalDomClassEmissionOwnership: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function getHEarthLayerContainer({
  layerContainersById,
  layerId
} = {}) {
  const resolved = resolveHEarthLayerClass(layerId);

  const directContainer = layerContainersById?.[resolved.layerId] || null;

  if (directContainer) {
    return Object.freeze({
      layerContainer: directContainer,
      layerId: resolved.layerId,
      requestedLayerId: layerId || null,
      fallbackUsed: false,
      found: true,
      claimBoundaryPreserved: true
    });
  }

  const fallbackLayerId = H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;
  const fallbackContainer = layerContainersById?.[fallbackLayerId] || null;

  return Object.freeze({
    layerContainer: fallbackContainer,
    layerId: fallbackContainer ? fallbackLayerId : resolved.layerId,
    requestedLayerId: resolved.layerId,
    fallbackUsed: Boolean(fallbackContainer),
    found: Boolean(fallbackContainer),
    claimBoundaryPreserved: true
  });
}

export function applyHEarthLayerMembershipToObjectNode({
  objectNode,
  membership
} = {}) {
  if (!objectNode || typeof objectNode.setAttribute !== 'function') {
    return Object.freeze({
      applied: false,
      failureCode: 'INVALID_OBJECT_NODE',
      classNamesApplied: Object.freeze([]),
      claimBoundaryPreserved: true
    });
  }

  objectNode.setAttribute('data-h-earth-layer-id', membership.layerId);
  objectNode.setAttribute('data-h-earth-layer-order', String(membership.layerOrder));
  objectNode.setAttribute('data-h-earth-layer-class', membership.layerClassName);
  objectNode.setAttribute(
    'data-h-earth-layer-member-class',
    membership.layerMemberClassName
  );
  objectNode.setAttribute(
    'data-h-earth-layer-resolution-source',
    membership.resolutionSource
  );
  objectNode.setAttribute(
    'data-h-earth-layer-fallback-used',
    String(membership.fallbackUsed === true)
  );

  if (objectNode.dataset) {
    objectNode.dataset.hEarthLayerId = membership.layerId;
    objectNode.dataset.hEarthLayerOrder = String(membership.layerOrder);
    objectNode.dataset.hEarthLayerClass = membership.layerClassName;
    objectNode.dataset.hEarthLayerMemberClass = membership.layerMemberClassName;
    objectNode.dataset.hEarthLayerResolutionSource = membership.resolutionSource;
    objectNode.dataset.hEarthLayerFallbackUsed = String(
      membership.fallbackUsed === true
    );
  }

  const classNamesApplied = [];

  if (objectNode.classList && typeof objectNode.classList.add === 'function') {
    membership.layerMemberClassNames.forEach((className) => {
      objectNode.classList.add(className);
      classNamesApplied.push(className);
    });
  }

  return Object.freeze({
    applied: true,
    failureCode: null,
    classNamesApplied: Object.freeze(classNamesApplied),
    claimBoundaryPreserved: true
  });
}

export function placeHEarthNodeInLayer({
  objectNode,
  node,
  layerContainersById
} = {}) {
  const membership = resolveHEarthLayerMembershipForNode(node);
  const targetLayer = getHEarthLayerContainer({
    layerContainersById,
    layerId: membership.layerId
  });

  if (!objectNode || typeof objectNode.setAttribute !== 'function') {
    return Object.freeze({
      placed: false,
      objectId: membership.objectId,
      sourceObjectId: membership.sourceObjectId,
      parentObjectId: membership.parentObjectId,
      nodeId: membership.nodeId,
      layerId: membership.layerId,
      requestedLayerId: membership.requestedLayerId,
      layerOrder: membership.layerOrder,
      layerClassName: membership.layerClassName,
      layerMemberClassName: membership.layerMemberClassName,
      fallbackUsed: targetLayer.fallbackUsed,
      failureCode: 'INVALID_OBJECT_NODE',
      warningCodes: Object.freeze([]),
      domMutationScope: 'none',
      finalOrderingValidationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    });
  }

  if (!targetLayer.layerContainer) {
    return Object.freeze({
      placed: false,
      objectId: membership.objectId,
      sourceObjectId: membership.sourceObjectId,
      parentObjectId: membership.parentObjectId,
      nodeId: membership.nodeId,
      layerId: membership.layerId,
      requestedLayerId: membership.requestedLayerId,
      layerOrder: membership.layerOrder,
      layerClassName: membership.layerClassName,
      layerMemberClassName: membership.layerMemberClassName,
      fallbackUsed: targetLayer.fallbackUsed,
      failureCode: 'LAYER_CONTAINER_MISSING',
      warningCodes: Object.freeze([]),
      domMutationScope: 'none',
      finalOrderingValidationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    });
  }

  const application = applyHEarthLayerMembershipToObjectNode({
    objectNode,
    membership
  });

  targetLayer.layerContainer.appendChild(objectNode);

  return Object.freeze({
    placed: true,
    objectId: membership.objectId,
    sourceObjectId: membership.sourceObjectId,
    parentObjectId: membership.parentObjectId,
    nodeId: membership.nodeId,

    layerId: targetLayer.layerId,
    requestedLayerId: membership.layerId,
    originalRequestedLayerId: membership.requestedLayerId,
    layerOrder: membership.layerOrder,
    layerClassName: membership.layerClassName,
    layerMemberClassName: membership.layerMemberClassName,
    layerMemberClassNames: membership.layerMemberClassNames,

    fallbackUsed: targetLayer.fallbackUsed || membership.fallbackUsed,
    resolutionSource: membership.resolutionSource,
    parentAwareLayerResolution: true,

    layerMembershipApplied: application.applied,
    layerMembershipClassNamesApplied: application.classNamesApplied,

    failureCode: null,
    warningCodes: Object.freeze(
      targetLayer.fallbackUsed === true || membership.fallbackUsed === true
        ? ['FALLBACK_LAYER_USED']
        : []
    ),
    domMutationScope: 'renderer-root-only',

    materialClassOwnership: false,
    primitiveClassOwnership: false,
    landscapeClassOwnership: false,
    contextClassOwnership: false,
    interactionClassOwnership: false,
    finalDomClassEmissionOwnership: false,

    finalOrderingValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export const H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT',
  file: '/showroom/globe/h-earth/render/layers.js',
  contractId: H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT.contractId,
  renewedFrom: H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT.renewedFrom,
  parentStandard: H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT.parentStandard,
  parentGeometryRenewal:
    H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT.parentGeometryRenewal,
  parentMaterialRenewal:
    H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT.parentMaterialRenewal,

  layerClassMapDefined: true,
  layerDatasetKeysDefined: true,
  layerContainerFactoryDefined: true,
  layerPlacementFunctionDefined: true,
  layerIdNormalizationDefined: true,
  parentPrimitiveLayerFallbackDefined: true,
  childPrimitiveLayerFallbackDefined: true,
  objectLayerMembershipClassResolutionDefined: true,
  parentAwareGeometryChildLayerResolutionDefined: true,

  requiredLayerIds: Object.freeze([
    'distant-world-context-layer',
    'air-haze-light-layer',
    'water-surface-plane-layer',
    'nearshore-wave-band-layer',
    'shoreline-foam-line-layer',
    'manor-exterior-context-layer',
    'dry-sand-transition-layer',
    'foreground-wet-sand-layer',
    'tide-pools-stones-rocks-detail-layer',
    'inspection-anchor-overlay-layer'
  ]),

  fallbackLayerId: 'unclassified-render-layer',

  requiredContainerClasses: Object.freeze([
    'h-earth-render-layer',
    'h-earth-layer-distant-world-context',
    'h-earth-layer-air-haze-light',
    'h-earth-layer-water-surface-plane',
    'h-earth-layer-nearshore-wave-band',
    'h-earth-layer-shoreline-foam-line',
    'h-earth-layer-manor-exterior-context',
    'h-earth-layer-dry-sand-transition',
    'h-earth-layer-foreground-wet-sand',
    'h-earth-layer-tide-pools-stones-rocks-detail',
    'h-earth-layer-inspection-anchor-overlay',
    'h-earth-layer-unclassified-render'
  ]),

  requiredObjectMembershipClasses: Object.freeze([
    'h-earth-layer-member',
    'h-earth-layer-member-distant-world-context',
    'h-earth-layer-member-air-haze-light',
    'h-earth-layer-member-water-surface-plane',
    'h-earth-layer-member-nearshore-wave-band',
    'h-earth-layer-member-shoreline-foam-line',
    'h-earth-layer-member-manor-exterior-context',
    'h-earth-layer-member-dry-sand-transition',
    'h-earth-layer-member-foreground-wet-sand',
    'h-earth-layer-member-tide-pools-stones-rocks-detail',
    'h-earth-layer-member-inspection-anchor-overlay',
    'h-earth-layer-member-unclassified-render'
  ]),

  createsLayerContainers: true,
  createsObjectNodes: false,
  definesMaterialClasses: false,
  ownsCompositorOrdering: false,
  bypassesCompositor: false,
  queriesGlobalDocument: false,

  materialClassOwnership: false,
  primitiveClassOwnership: false,
  landscapeClassOwnership: false,
  contextClassOwnership: false,
  interactionClassOwnership: false,
  finalDomClassEmissionOwnership: false,

  boundary: Object.freeze({
    layerPortOnly: true,
    trueLayerResolver: true,
    mutatesOnlySuppliedRenderRoot: true,
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
    traversalClaim: false,
    simulationClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export function getRenderLayerPortReceipt() {
  return H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT;
}

export const H_EARTH_3D_RENDER_LAYER_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_LAYER_PORT',
  file: '/showroom/globe/h-earth/render/layers.js',

  contract: H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT,
  classMap: H_EARTH_3D_RENDER_LAYER_CLASS_MAP,
  datasetKeys: H_EARTH_3D_RENDER_LAYER_DATASET_KEYS,
  policy: H_EARTH_3D_RENDER_LAYER_POLICY,
  parentPrimitiveToLayerId: H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_LAYER_ID,
  childPrimitiveToLayerId: H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_LAYER_ID,

  normalizeLayerId: normalizeHEarthLayerId,
  normalizeClassArray: normalizeHEarthLayerClassArray,
  uniqueClassNames: uniqueHEarthLayerClassNames,
  joinClassNames: joinHEarthLayerClassNames,

  resolveParentPrimitiveType: resolveHEarthParentPrimitiveTypeForLayer,
  resolveChildPrimitiveType: resolveHEarthChildPrimitiveTypeForLayer,
  resolveObjectId: resolveHEarthObjectIdForLayer,
  resolveSourceObjectId: resolveHEarthSourceObjectIdForLayer,
  resolveParentObjectId: resolveHEarthParentObjectIdForLayer,
  resolveNodeId: resolveHEarthNodeIdForLayer,
  resolveRequestedLayerId: resolveHEarthRequestedLayerIdForNode,
  resolveFallbackLayerId: resolveHEarthFallbackLayerIdForNode,

  resolveLayerClass: resolveHEarthLayerClass,
  resolveLayerOrderForNode: resolveHEarthLayerOrderForNode,
  resolveLayerMembershipForNode: resolveHEarthLayerMembershipForNode,
  resolveLayerIdForNode: resolveHEarthLayerIdForNode,
  getLayerDataset: getHEarthLayerDataset,
  getLayerClassForNode: getHEarthLayerClassForNode,

  resolveLayerDescriptors: resolveHEarthLayerDescriptors,
  createLayerContainer: createHEarthLayerContainer,
  createLayerContainers: createHEarthLayerContainers,
  getLayerContainer: getHEarthLayerContainer,
  applyLayerMembershipToObjectNode: applyHEarthLayerMembershipToObjectNode,
  placeNodeInLayer: placeHEarthNodeInLayer,

  getReceipt: getRenderLayerPortReceipt,

  receipt: H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT
});

export default H_EARTH_3D_RENDER_LAYER_PORT;
