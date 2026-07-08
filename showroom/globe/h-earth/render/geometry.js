// /showroom/globe/h-earth/render/geometry.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031C_GROUND_LEVEL_LANDSCAPE_DESCRIPTOR_RENEWAL_v1
//
// Renews:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031B_v1
//
// Parent target:
// STEP_031_GEOMETRY_EXPANSION_PORT_BINDING
//
// Purpose:
// Candidate-only DOM/CSS3D geometry expansion port for H-Earth.
//
// This file renews the geometry descriptor vocabulary before CSS interpretation.
// It expands composed/render descriptor nodes into richer ground-level shoreline
// landscape candidate descriptor nodes.
//
// Compatibility target:
// /showroom/globe/h-earth/renderer.js
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031D_SINGLE_PASS_GEOMETRY_EXPANSION_GUARDED_BINDING_v1
//
// Required renderer import compatibility:
// - H_EARTH_3D_RENDER_GEOMETRY_PORT
// - expandHEarthGeometryNodes
// - getHEarthGeometryPortReceipt
//
// Boundary:
// - No WebGL
// - No canvas
// - No SVG
// - No iframe
// - No script creation
// - No DOM creation
// - No DOM mutation
// - No global document query
// - No physics
// - No terrain engine
// - No fluid simulation
// - No weather simulation
// - No traversal
// - No collision claim
// - No final geometry claim
// - No renderer-pass claim
// - No visual-pass claim
// - No validation claim
// - No production claim
// - No matrix collapse

export const H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031C_GROUND_LEVEL_LANDSCAPE_DESCRIPTOR_RENEWAL_v1',
  renewedFrom: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031B_v1',

  file: '/showroom/globe/h-earth/render/geometry.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_GROUND_LEVEL_GEOMETRY_EXPANSION_PORT',
  status:
    'GROUND_LEVEL_LANDSCAPE_DESCRIPTOR_GEOMETRY_RENEWED_CANDIDATE_ONLY',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  parentStep: 'STEP_031_GEOMETRY_EXPANSION_PORT_BINDING',
  rendererCompatibilityTarget:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031D_SINGLE_PASS_GEOMETRY_EXPANSION_GUARDED_BINDING_v1',

  exportedApi: Object.freeze({
    aggregatePort: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
    expansionFunction: 'expandHEarthGeometryNodes',
    receiptFunction: 'getHEarthGeometryPortReceipt',
    legacyExpansionAlias: 'expandHEarthCandidateGeometryNodes',
    legacyReceiptAlias: 'getHEarthGeometryExpansionPortReceipt'
  }),

  boundary: Object.freeze({
    expandsDescriptorNodes: true,
    createsDomNodes: false,
    touchesDom: false,
    queriesGlobalDocument: false,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    importsEnvironment: false,
    importsCss: false,

    webglActivation: false,
    canvasActivation: false,
    svgActivation: false,
    iframeActivation: false,
    scriptCreation: false,

    terrainEngineClaim: false,
    physicsClaim: false,
    collisionClaim: false,
    traversalClaim: false,
    fluidSimulationClaim: false,
    weatherSimulationClaim: false,

    finalGeometryClaim: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,

    claimBoundaryPreserved: true
  })
});

export const H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND = Object.freeze({
  PARENT: 'candidate-parent-descriptor',
  GROUND_BASE: 'candidate-ground-base-plane',
  GROUND_CONTOUR: 'candidate-ground-contour-ridge',
  GROUND_PATCH: 'candidate-ground-surface-patch',
  GROUND_GRAIN: 'candidate-ground-grain-detail',
  REFLECTIVE_SHEEN: 'candidate-ground-reflective-sheen',

  SHORELINE_BASE: 'candidate-shoreline-contact-base',
  SHORELINE_FOAM: 'candidate-shoreline-foam-fragment',
  SHORELINE_EDGE: 'candidate-shoreline-edge-irregularity',

  WATER_BASE: 'candidate-water-base-plane',
  WATER_DEPTH: 'candidate-water-depth-band',
  WATER_RIPPLE: 'candidate-water-ripple-strip',
  WATER_REFLECTION: 'candidate-water-reflection-strip',

  SCATTER_MEMBER: 'candidate-scatter-member',
  ROCK_MEMBER: 'candidate-rock-member',

  AIR_HAZE: 'candidate-air-haze-panel',
  AIR_LIGHT: 'candidate-air-light-band',

  SILHOUETTE_BODY: 'candidate-context-silhouette-body',
  SILHOUETTE_ROOF: 'candidate-context-silhouette-roof',
  DISTANT_CONTEXT: 'candidate-distant-context-form',

  INSPECTION_ANCHOR: 'candidate-inspection-anchor-marker',
  GENERIC: 'candidate-generic-geometry'
});

export const H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE = Object.freeze({
  FOREGROUND: 'foreground',
  NEAR_FOREGROUND: 'near-foreground',
  MIDGROUND: 'midground',
  BACKGROUND: 'background',
  DISTANT: 'distant',
  SKY: 'sky',
  OVERLAY: 'overlay'
});

export const H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_PROFILE_MAP = Object.freeze({
  contouredTerrainBand: Object.freeze({
    primitiveType: 'contouredTerrainBand',
    profileId: 'ground-level-wet-sand-contoured-surface-profile',
    basePrimitiveType: 'candidateWetSandGroundPlane',
    baseClassName: 'h-earth-geometry-ground-wet-sand-base-plane',
    landscapeClassName: 'h-earth-landscape-ground-wet-sand-contoured',
    defaultChildLimit: 28,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
    semanticRole: 'primary-ground-inspection-surface'
  }),

  terrainBand: Object.freeze({
    primitiveType: 'terrainBand',
    profileId: 'ground-level-dry-sand-transition-profile',
    basePrimitiveType: 'candidateDrySandGroundPlane',
    baseClassName: 'h-earth-geometry-ground-dry-sand-base-plane',
    landscapeClassName: 'h-earth-landscape-ground-dry-sand-transition',
    defaultChildLimit: 20,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
    semanticRole: 'secondary-ground-transition-surface'
  }),

  irregularShorelineBand: Object.freeze({
    primitiveType: 'irregularShorelineBand',
    profileId: 'ground-level-irregular-shoreline-contact-profile',
    basePrimitiveType: 'candidateShorelineContactPlane',
    baseClassName: 'h-earth-geometry-shoreline-contact-base-plane',
    landscapeClassName: 'h-earth-landscape-shoreline-irregular-contact',
    defaultChildLimit: 24,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
    semanticRole: 'water-ground-contact-boundary'
  }),

  waterDepthBand: Object.freeze({
    primitiveType: 'waterDepthBand',
    profileId: 'ground-level-nearshore-depth-profile',
    basePrimitiveType: 'candidateNearshoreDepthPlane',
    baseClassName: 'h-earth-geometry-water-nearshore-depth-base-plane',
    landscapeClassName: 'h-earth-landscape-water-nearshore-depth',
    defaultChildLimit: 18,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
    semanticRole: 'nearshore-water-depth-gradient'
  }),

  waterPlane: Object.freeze({
    primitiveType: 'waterPlane',
    profileId: 'ground-level-water-surface-profile',
    basePrimitiveType: 'candidateWaterSurfacePlane',
    baseClassName: 'h-earth-geometry-water-surface-base-plane',
    landscapeClassName: 'h-earth-landscape-water-surface-field',
    defaultChildLimit: 18,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
    semanticRole: 'water-surface-horizon-field'
  }),

  scatterCluster: Object.freeze({
    primitiveType: 'scatterCluster',
    profileId: 'ground-level-surface-scatter-profile',
    basePrimitiveType: 'candidateSurfaceScatterMember',
    baseClassName: 'h-earth-geometry-ground-scatter-member',
    landscapeClassName: 'h-earth-landscape-ground-scatter-cluster',
    defaultChildLimit: 24,
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
    semanticRole: 'ground-surface-detail-scatter'
  }),

  rockCluster: Object.freeze({
    primitiveType: 'rockCluster',
    profileId: 'ground-level-rock-cluster-profile',
    basePrimitiveType: 'candidateRockClusterMember',
    baseClassName: 'h-earth-geometry-rock-cluster-member',
    landscapeClassName: 'h-earth-landscape-rock-cluster',
    defaultChildLimit: 24,
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
    semanticRole: 'raised-rock-cluster-context'
  }),

  atmosphericLayer: Object.freeze({
    primitiveType: 'atmosphericLayer',
    profileId: 'ground-level-air-haze-light-profile',
    basePrimitiveType: 'candidateAirHazePanel',
    baseClassName: 'h-earth-geometry-air-haze-panel',
    landscapeClassName: 'h-earth-landscape-air-haze-light-volume',
    defaultChildLimit: 8,
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.SKY,
    semanticRole: 'air-light-atmospheric-context'
  }),

  layeredSilhouette: Object.freeze({
    primitiveType: 'layeredSilhouette',
    profileId: 'ground-level-manor-context-silhouette-profile',
    basePrimitiveType: 'candidateManorContextBody',
    baseClassName: 'h-earth-geometry-manor-context-body',
    landscapeClassName: 'h-earth-landscape-manor-context-silhouette',
    defaultChildLimit: 10,
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
    semanticRole: 'distant-manor-exterior-context'
  }),

  distantCluster: Object.freeze({
    primitiveType: 'distantCluster',
    profileId: 'ground-level-distant-world-context-profile',
    basePrimitiveType: 'candidateDistantWorldSilhouette',
    baseClassName: 'h-earth-geometry-distant-world-context-form',
    landscapeClassName: 'h-earth-landscape-distant-world-context',
    defaultChildLimit: 10,
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.DISTANT,
    semanticRole: 'distant-world-boundary-context'
  }),

  inspectionAnchor: Object.freeze({
    primitiveType: 'inspectionAnchor',
    profileId: 'ground-level-primary-inspection-anchor-profile',
    basePrimitiveType: 'candidateInspectionAnchorMarker',
    baseClassName: 'h-earth-geometry-primary-inspection-anchor-marker',
    landscapeClassName: 'h-earth-landscape-primary-inspection-anchor',
    defaultChildLimit: 1,
    carryParentDescriptor: false,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.OVERLAY,
    semanticRole: 'primary-ground-inspection-anchor'
  })
});

export const H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS = Object.freeze({
  maxExpandedNodes: 128,
  fallbackChildLimit: 12,
  minChildLimit: 1,
  maxChildLimitPerParent: 32,
  claimBoundaryPreserved: true
});

export function isHEarthPlainObject(value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false;
}

export function normalizeHEarthGeometryNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function clampHEarthGeometryNumber(value, min, max, fallback = 0) {
  const numberValue = normalizeHEarthGeometryNumber(value, fallback);
  return Math.max(min, Math.min(max, numberValue));
}

export function normalizeHEarthGeometryToken(value, fallback = 'unresolved') {
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

export function normalizeHEarthGeometryArray(value) {
  return Array.isArray(value) ? value : [];
}

export function resolveHEarthGeometryPrimitiveType(node = {}) {
  return (
    node.primitiveType ||
    node.sourceObject?.primitiveType ||
    node.objectReference?.primitiveType ||
    node.primitive?.primitiveType ||
    node.primitiveSchema?.primitiveType ||
    'unclassifiedPrimitive'
  );
}

export function resolveHEarthGeometryMaterialKey(node = {}) {
  return (
    node.materialKey ||
    node.materialToken?.materialKey ||
    node.material?.materialKey ||
    node.sourceObject?.materialKey ||
    node.sourceObject?.materialToken?.materialKey ||
    node.sourceObject?.materialIdentity?.materialKey ||
    'unresolved'
  );
}

export function resolveHEarthGeometryObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.objectId ||
    node.sourceObject?.objectId ||
    node.sourceObjectId ||
    node.id ||
    `UNRESOLVED_OBJECT_${String(fallbackIndex).padStart(3, '0')}`
  );
}

export function resolveHEarthGeometryNodeId(node = {}, fallbackIndex = 0) {
  return (
    node.nodeId ||
    node.composedNodeId ||
    node.sourceNodeId ||
    `render-node-${resolveHEarthGeometryObjectId(node, fallbackIndex)}`
  );
}

export function resolveHEarthGeometryLabel(node = {}, fallbackIndex = 0) {
  return (
    node.label ||
    node.objectLabel ||
    node.sourceObject?.label ||
    resolveHEarthGeometryObjectId(node, fallbackIndex)
  );
}

export function resolveHEarthGeometryLayerId(node = {}) {
  return (
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    node.sourceObject?.layerId ||
    null
  );
}

export function resolveHEarthGeometryLayerOrder(node = {}) {
  const primitiveType = resolveHEarthGeometryPrimitiveType(node);

  const defaultOrder = Object.freeze({
    distantCluster: 10,
    atmosphericLayer: 20,
    waterPlane: 30,
    waterDepthBand: 40,
    irregularShorelineBand: 50,
    layeredSilhouette: 60,
    terrainBand: 70,
    contouredTerrainBand: 80,
    scatterCluster: 90,
    rockCluster: 90,
    inspectionAnchor: 100
  });

  return normalizeHEarthGeometryNumber(
    node.layerOrder ??
      node.renderLayerOrder ??
      node.layer?.order ??
      node.composition?.layerOrder,
    defaultOrder[primitiveType] ?? 999
  );
}

export function resolveHEarthGeometryDepthClass(node = {}) {
  return (
    node.primaryDepthClass ||
    node.depthClass ||
    node.sourceObject?.primaryDepthClass ||
    node.sourceObject?.depthClass ||
    node.depthComposition?.primaryDepthClass ||
    node.depthComposition?.depthClass ||
    'foreground'
  );
}

export function resolveHEarthGeometryDepthZone(node = {}) {
  const primitiveType = resolveHEarthGeometryPrimitiveType(node);
  return (
    node.geometryDepthZone ||
    node.depthZone ||
    node.sourceObject?.geometryDepthZone ||
    node.sourceObject?.depthZone ||
    H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_PROFILE_MAP[primitiveType]?.depthZone ||
    H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND
  );
}

export function resolveHEarthGeometryNormalizedDepth(node = {}) {
  return clampHEarthGeometryNumber(
    node.normalizedDepth ??
      node.candidateTransform?.normalizedPosition?.normalizedDepth ??
      node.sourceObject?.normalizedDepth ??
      node.sourceObject?.normalizedPosition?.normalizedDepth,
    0,
    1,
    0.5
  );
}

export function resolveHEarthGeometryTranslate(node = {}) {
  const source =
    node.candidateTransform?.translate ||
    node.candidateTransform?.position ||
    node.center ||
    node.position ||
    node.sourceObject?.candidateTransform?.translate ||
    node.sourceObject?.center ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  return Object.freeze({
    x: normalizeHEarthGeometryNumber(source.x, 0),
    y: normalizeHEarthGeometryNumber(source.y, 0),
    z: normalizeHEarthGeometryNumber(source.z, 0)
  });
}

export function resolveHEarthGeometryRotate(node = {}) {
  const source =
    node.candidateTransform?.rotate ||
    node.candidateTransform?.rotation ||
    node.rotate ||
    node.rotation ||
    node.sourceObject?.candidateTransform?.rotate ||
    Object.freeze({ x: 0, y: 0, z: 0 });

  return Object.freeze({
    x: normalizeHEarthGeometryNumber(source.x, 0),
    y: normalizeHEarthGeometryNumber(source.y, 0),
    z: normalizeHEarthGeometryNumber(source.z, 0)
  });
}

export function resolveHEarthGeometryScale(node = {}) {
  const sourceScale =
    node.candidateTransform?.scale ??
    node.candidateTransform?.baseScale ??
    node.primitiveGeometry?.scaleTriplet?.scalar ??
    node.scale ??
    node.sourceObject?.candidateTransform?.scale ??
    1;

  return Math.max(0.01, normalizeHEarthGeometryNumber(sourceScale, 1));
}

export function resolveHEarthGeometryExtent(node = {}) {
  const source =
    node.candidateTransform?.extent ||
    node.primitiveGeometry?.extent ||
    node.extent ||
    node.sourceObject?.candidateTransform?.extent ||
    node.sourceObject?.extent ||
    null;

  if (source) {
    return Object.freeze({
      x: Math.max(0.01, Math.abs(normalizeHEarthGeometryNumber(source.x, 1))),
      y: Math.max(0.01, Math.abs(normalizeHEarthGeometryNumber(source.y, 0.1))),
      z: Math.max(0.01, Math.abs(normalizeHEarthGeometryNumber(source.z, 1)))
    });
  }

  const bounds = node.bounds || node.sourceObject?.bounds || null;

  if (bounds) {
    return Object.freeze({
      x: Math.max(
        0.01,
        Math.abs(
          normalizeHEarthGeometryNumber(bounds.x?.max, 1) -
            normalizeHEarthGeometryNumber(bounds.x?.min, -1)
        )
      ),
      y: Math.max(
        0.01,
        Math.abs(
          normalizeHEarthGeometryNumber(bounds.y?.max, 0.1) -
            normalizeHEarthGeometryNumber(bounds.y?.min, 0)
        )
      ),
      z: Math.max(
        0.01,
        Math.abs(
          normalizeHEarthGeometryNumber(bounds.z?.max, 1) -
            normalizeHEarthGeometryNumber(bounds.z?.min, -1)
        )
      )
    });
  }

  return Object.freeze({ x: 1, y: 0.1, z: 1 });
}

export function resolveHEarthGeometryShapeVariation(node = {}) {
  const source = node.sourceObject?.shapeVariation || node.shapeVariation || {};

  return Object.freeze({
    shapeIrregularity: clampHEarthGeometryNumber(
      source.shapeIrregularity ?? node.sourceObject?.shapeIrregularity,
      0,
      1,
      0
    ),
    edgeVariation: clampHEarthGeometryNumber(source.edgeVariation, 0, 1, 0.08),
    heightVariation: clampHEarthGeometryNumber(source.heightVariation, 0, 1, 0.08),
    rotationVariationDegrees: normalizeHEarthGeometryNumber(
      source.rotationVariationDegrees,
      0
    ),
    scaleVariation: clampHEarthGeometryNumber(source.scaleVariation, 0, 1, 0.05),
    clusterSpread: clampHEarthGeometryNumber(source.clusterSpread, 0, 1, 0.12),

    finalMeshClaim: false,
    rendererPassClaim: false,
    visualValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthGeometryClusterMembers(node = {}) {
  return normalizeHEarthGeometryArray(
    node.sourceObject?.clusterMembers || node.clusterMembers
  );
}

export function resolveHEarthGeometryDetailCount(node = {}) {
  const declared = node.sourceObject?.detailCount ?? node.detailCount;
  const clusterCount = resolveHEarthGeometryClusterMembers(node).length;

  return Math.max(
    0,
    Math.floor(normalizeHEarthGeometryNumber(declared, clusterCount))
  );
}

export function resolveHEarthGeometryDetailDensity(node = {}) {
  return clampHEarthGeometryNumber(
    node.sourceObject?.detailDensity ?? node.detailDensity,
    0,
    1,
    0.25
  );
}

export function resolveHEarthGeometryProfile(node = {}) {
  const primitiveType = resolveHEarthGeometryPrimitiveType(node);

  return (
    H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_PROFILE_MAP[primitiveType] ||
    Object.freeze({
      primitiveType,
      profileId: 'generic-ground-level-expanded-profile',
      basePrimitiveType: `candidate-${normalizeHEarthGeometryToken(primitiveType)}`,
      baseClassName: 'h-earth-geometry-generic-candidate',
      landscapeClassName: 'h-earth-landscape-generic-candidate',
      defaultChildLimit:
        H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.fallbackChildLimit,
      carryParentDescriptor: true,
      groundPlane: false,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
      semanticRole: 'generic-candidate-context'
    })
  );
}

export function isHEarthAlreadyExpandedGeometryNode(node = {}) {
  return (
    node.geometryExpanded === true ||
    node.candidateGeometryOnly === true ||
    isHEarthPlainObject(node.geometryExpansion)
  );
}

export function makeHEarthGeometryChildId(parentNode, suffix, index = null) {
  const parentId = resolveHEarthGeometryNodeId(parentNode);
  const normalizedSuffix = normalizeHEarthGeometryToken(suffix, 'geometry-child');

  if (index === null || index === undefined) {
    return `${parentId}__${normalizedSuffix}`;
  }

  return `${parentId}__${normalizedSuffix}-${String(index).padStart(2, '0')}`;
}

export function makeHEarthGeometryChildObjectId(parentNode, suffix, index = null) {
  const parentObjectId = resolveHEarthGeometryObjectId(parentNode);
  const normalizedSuffix = String(suffix || 'GEOMETRY_CHILD')
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

  if (index === null || index === undefined) {
    return `${parentObjectId}__${normalizedSuffix}`;
  }

  return `${parentObjectId}__${normalizedSuffix}_${String(index).padStart(2, '0')}`;
}

export function createHEarthGeometryCandidateTransform(parentNode, override = {}) {
  const parentTranslate = resolveHEarthGeometryTranslate(parentNode);
  const parentRotate = resolveHEarthGeometryRotate(parentNode);
  const parentScale = resolveHEarthGeometryScale(parentNode);
  const parentExtent = resolveHEarthGeometryExtent(parentNode);
  const parentNormalizedDepth = resolveHEarthGeometryNormalizedDepth(parentNode);
  const parentNormalizedPosition =
    parentNode.candidateTransform?.normalizedPosition ||
    parentNode.sourceObject?.normalizedPosition ||
    Object.freeze({ nx: 0.5, ny: 0.2, nz: parentNormalizedDepth });

  const localOffset = override.localOffset || {};
  const localRotate = override.localRotate || {};
  const localScale = Math.max(
    0.01,
    normalizeHEarthGeometryNumber(override.localScale, 1)
  );
  const extentScale = Math.max(
    0.01,
    normalizeHEarthGeometryNumber(override.extentScale, localScale)
  );

  const normalizedDepth = clampHEarthGeometryNumber(
    override.normalizedDepth,
    0,
    1,
    parentNormalizedDepth
  );

  return Object.freeze({
    translate: Object.freeze({
      x: parentTranslate.x + normalizeHEarthGeometryNumber(localOffset.x, 0),
      y: parentTranslate.y + normalizeHEarthGeometryNumber(localOffset.y, 0),
      z: parentTranslate.z + normalizeHEarthGeometryNumber(localOffset.z, 0)
    }),

    scale: Math.max(0.01, parentScale * localScale),
    baseScale: Math.max(0.01, parentScale * localScale),
    contextScale: normalizeHEarthGeometryNumber(
      parentNode.candidateTransform?.contextScale,
      1
    ),

    rotate: Object.freeze({
      x: parentRotate.x + normalizeHEarthGeometryNumber(localRotate.x, 0),
      y: parentRotate.y + normalizeHEarthGeometryNumber(localRotate.y, 0),
      z: parentRotate.z + normalizeHEarthGeometryNumber(localRotate.z, 0)
    }),

    extent: Object.freeze({
      x: Math.max(0.01, parentExtent.x * extentScale),
      y: Math.max(0.01, parentExtent.y * extentScale),
      z: Math.max(0.01, parentExtent.z * extentScale)
    }),

    normalizedPosition: Object.freeze({
      nx: clampHEarthGeometryNumber(
        override.nx,
        0,
        1,
        normalizeHEarthGeometryNumber(parentNormalizedPosition.nx, 0.5)
      ),
      ny: clampHEarthGeometryNumber(
        override.ny,
        0,
        1,
        normalizeHEarthGeometryNumber(parentNormalizedPosition.ny, 0.2)
      ),
      nz: clampHEarthGeometryNumber(
        override.nz,
        0,
        1,
        normalizeHEarthGeometryNumber(parentNormalizedPosition.nz, normalizedDepth)
      ),
      normalizedDepth
    }),

    transformClaim: 'candidate-only',
    domTransformClaim: false,
    cssTransformClaim: false,
    webglTransformClaim: false,
    finalGeometryClaim: false,
    rendererClaim: false,
    traversalClaim: false
  });
}

export function createHEarthGeometryPrimitiveDescriptor(
  parentNode,
  primitiveType,
  transform,
  override = {}
) {
  const profile = resolveHEarthGeometryProfile(parentNode);
  const parentGeometry = parentNode.primitiveGeometry || {};
  const parentExtent = resolveHEarthGeometryExtent(parentNode);
  const extent = transform?.extent || parentExtent;
  const normalizedDepth =
    transform?.normalizedPosition?.normalizedDepth ??
    resolveHEarthGeometryNormalizedDepth(parentNode);
  const depthClass = override.depthClass || resolveHEarthGeometryDepthClass(parentNode);

  const widthPx = Math.max(
    4,
    normalizeHEarthGeometryNumber(parentGeometry.widthPx, parentExtent.x * 9) *
      normalizeHEarthGeometryNumber(override.widthRatio, 1)
  );

  const heightPx = Math.max(
    2,
    normalizeHEarthGeometryNumber(parentGeometry.heightPx, parentExtent.y * 9) *
      normalizeHEarthGeometryNumber(override.heightRatio, 1)
  );

  const depthPx = Math.max(
    1,
    normalizeHEarthGeometryNumber(parentGeometry.depthPx, parentExtent.z * 3.2) *
      normalizeHEarthGeometryNumber(override.depthRatio, 1)
  );

  return Object.freeze({
    primitiveType,
    depthClass,
    depthZone: override.depthZone || profile.depthZone,
    semanticRole: override.semanticRole || profile.semanticRole,
    normalizedDepth,

    profileId: override.profileId || `${primitiveType}-candidate-profile`,
    profileClassName:
      override.profileClassName ||
      `h-earth-geometry-${normalizeHEarthGeometryToken(primitiveType)}`,
    landscapeClassName: override.landscapeClassName || profile.landscapeClassName,
    groundPlane: override.groundPlane === true,
    widthPx,
    heightPx,
    depthPx,
    extent,

    scaleTriplet: Object.freeze({
      x: Math.max(0.01, normalizeHEarthGeometryNumber(override.scaleX, 1)),
      y: Math.max(0.01, normalizeHEarthGeometryNumber(override.scaleY, 1)),
      z: Math.max(0.01, normalizeHEarthGeometryNumber(override.scaleZ, 1)),
      scalar: Math.max(0.01, normalizeHEarthGeometryNumber(override.scalar, 1)),
      contextScale: 1,
      source: 'geometry-expansion-port'
    }),

    descriptorOnly: false,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthExpandedGeometryNode(parentNode, config = {}) {
  const parentProfile = resolveHEarthGeometryProfile(parentNode);
  const primitiveType =
    config.primitiveType || resolveHEarthGeometryPrimitiveType(parentNode);
  const materialKey =
    config.materialKey || resolveHEarthGeometryMaterialKey(parentNode);
  const depthClass = config.depthClass || resolveHEarthGeometryDepthClass(parentNode);
  const depthZone = config.depthZone || parentProfile.depthZone;
  const normalizedDepth = clampHEarthGeometryNumber(
    config.normalizedDepth,
    0,
    1,
    resolveHEarthGeometryNormalizedDepth(parentNode)
  );

  const childIndex =
    config.index === null || config.index === undefined ? null : Number(config.index);

  const suffix = config.suffix || 'geometry';
  const parentObjectId = resolveHEarthGeometryObjectId(parentNode);
  const parentNodeId = resolveHEarthGeometryNodeId(parentNode);

  const transform = createHEarthGeometryCandidateTransform(parentNode, {
    ...(config.transform || {}),
    normalizedDepth
  });

  const primitiveGeometry = createHEarthGeometryPrimitiveDescriptor(
    parentNode,
    primitiveType,
    transform,
    {
      ...(config.geometry || {}),
      depthClass,
      depthZone,
      normalizedDepth
    }
  );

  const geometryNodeKind =
    config.geometryNodeKind || H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GENERIC;

  const nodeId =
    config.nodeId || makeHEarthGeometryChildId(parentNode, suffix, childIndex);
  const objectId =
    config.objectId || makeHEarthGeometryChildObjectId(parentNode, suffix, childIndex);

  const label =
    config.label ||
    `${resolveHEarthGeometryLabel(parentNode)} ${String(suffix).replace(/[-_]+/g, ' ')}`;

  return Object.freeze({
    ...parentNode,

    nodeId,
    sourceNodeId: parentNodeId,
    composedNodeId: parentNode.composedNodeId || null,

    objectId,
    sourceObjectId: parentObjectId,
    parentObjectId,
    parentNodeId,

    objectLabel: label,
    label,

    primitiveType,
    materialKey,
    layerId: config.layerId || resolveHEarthGeometryLayerId(parentNode),
    layerOrder: normalizeHEarthGeometryNumber(
      config.layerOrder,
      resolveHEarthGeometryLayerOrder(parentNode)
    ),

    geometryExpansion: Object.freeze({
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      expandedFromParent: true,
      parentCarryNode: false,
      geometryNodeKind,
      parentObjectId,
      parentNodeId,
      parentPrimitiveType: resolveHEarthGeometryPrimitiveType(parentNode),
      parentMaterialKey: resolveHEarthGeometryMaterialKey(parentNode),
      parentDepthClass: resolveHEarthGeometryDepthClass(parentNode),
      parentDepthZone: resolveHEarthGeometryDepthZone(parentNode),
      childPrimitiveType: primitiveType,
      childMaterialKey: materialKey,
      childDepthZone: depthZone,
      semanticRole: primitiveGeometry.semanticRole,
      geometryChildIndex: childIndex,
      candidateGeometryOnly: true,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      claimBoundaryPreserved: true
    }),

    geometryExpansionRole: geometryNodeKind,
    geometryExpanded: true,
    geometryParentObjectId: parentObjectId,
    geometryParentNodeId: parentNodeId,
    geometryChildIndex: childIndex,

    candidateTransform: transform,
    primitiveGeometry,

    landscapeClassName: primitiveGeometry.landscapeClassName,
    geometryProfileClassName: primitiveGeometry.profileClassName,
    primitiveClassName: `h-earth-primitive-${normalizeHEarthGeometryToken(primitiveType)}`,
    renderWidthPx: primitiveGeometry.widthPx,
    renderHeightPx: primitiveGeometry.heightPx,
    renderDepthPx: primitiveGeometry.depthPx,

    normalizedDepth,
    depthClass,
    primaryDepthClass: depthClass,
    geometryDepthZone: depthZone,
    semanticRole: primitiveGeometry.semanticRole,

    sourceObject: parentNode.sourceObject || parentNode,

    descriptorOnly: false,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthParentCarryGeometryNode(parentNode, index = 0) {
  const profile = resolveHEarthGeometryProfile(parentNode);
  const parentObjectId = resolveHEarthGeometryObjectId(parentNode, index);
  const parentNodeId = resolveHEarthGeometryNodeId(parentNode, index);
  const nodeId = `${parentNodeId}__parent-descriptor`;
  const objectId = `${parentObjectId}__PARENT_DESCRIPTOR`;

  return Object.freeze({
    ...parentNode,

    nodeId,
    sourceNodeId: parentNodeId,
    composedNodeId: parentNode.composedNodeId || null,

    objectId,
    sourceObjectId: parentObjectId,
    parentObjectId,
    parentNodeId,

    objectLabel: `${resolveHEarthGeometryLabel(parentNode, index)} Parent Descriptor`,
    label: `${resolveHEarthGeometryLabel(parentNode, index)} Parent Descriptor`,

    geometryExpansion: Object.freeze({
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      expandedFromParent: false,
      parentCarryNode: true,
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.PARENT,
      parentObjectId,
      parentNodeId,
      parentPrimitiveType: resolveHEarthGeometryPrimitiveType(parentNode),
      parentMaterialKey: resolveHEarthGeometryMaterialKey(parentNode),
      parentDepthClass: resolveHEarthGeometryDepthClass(parentNode),
      parentDepthZone: profile.depthZone,
      semanticRole: profile.semanticRole,
      candidateGeometryOnly: true,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      claimBoundaryPreserved: true
    }),

    geometryExpansionRole: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.PARENT,
    geometryExpanded: false,
    geometryParentObjectId: parentObjectId,
    geometryParentNodeId: parentNodeId,
    geometryChildIndex: null,

    landscapeClassName: profile.landscapeClassName,
    geometryProfileClassName: profile.baseClassName,
    geometryDepthZone: profile.depthZone,
    semanticRole: profile.semanticRole,

    descriptorOnly: true,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function selectHEarthGeometryClusterMembers(parentNode, maxCount) {
  const explicitMembers = resolveHEarthGeometryClusterMembers(parentNode);

  if (explicitMembers.length > 0) {
    return explicitMembers.slice(0, maxCount);
  }

  const detailCount = Math.min(maxCount, resolveHEarthGeometryDetailCount(parentNode));
  const extent = resolveHEarthGeometryExtent(parentNode);
  const variation = resolveHEarthGeometryShapeVariation(parentNode);

  return Object.freeze(
    Array.from({ length: detailCount }, (_, index) => {
      const side = index % 2 === 0 ? 1 : -1;
      const t = (index + 1) / Math.max(1, detailCount + 1);

      return Object.freeze({
        index,
        parentObjectId: resolveHEarthGeometryObjectId(parentNode),
        offset: Object.freeze({
          dx: side * extent.x * (0.08 + t * 0.34),
          dy: variation.shapeIrregularity * t * 0.3,
          dz: side * extent.z * (0.05 + t * 0.24)
        }),
        localScale: 0.72 + t * 0.42,
        localRotation: Object.freeze({
          x: 0,
          y: side * t * variation.rotationVariationDegrees,
          z: side * variation.shapeIrregularity * 8
        }),
        irregularityWeight: variation.shapeIrregularity,
        finalGeometryClaim: false,
        renderedNodeClaim: false,
        physicsBodyClaim: false,
        collisionObjectClaim: false
      });
    })
  );
}

export function createHEarthGeometryClusterChildNodes(parentNode, options = {}) {
  const maxCount = Math.max(
    H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.minChildLimit,
    Math.min(
      H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.maxChildLimitPerParent,
      Math.floor(
        normalizeHEarthGeometryNumber(
          options.maxCount,
          H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.fallbackChildLimit
        )
      )
    )
  );

  const members = selectHEarthGeometryClusterMembers(parentNode, maxCount);
  const primitiveType =
    options.primitiveType || resolveHEarthGeometryPrimitiveType(parentNode);
  const materialKey = options.materialKey || resolveHEarthGeometryMaterialKey(parentNode);
  const depthClass = options.depthClass || resolveHEarthGeometryDepthClass(parentNode);
  const depthZone = options.depthZone || resolveHEarthGeometryDepthZone(parentNode);
  const geometryNodeKind =
    options.geometryNodeKind ||
    H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SCATTER_MEMBER;

  return Object.freeze(
    members.map((member, index) => {
      const offset = member.offset || {};
      const rotation = member.localRotation || {};
      const localScale = Math.max(
        0.08,
        normalizeHEarthGeometryNumber(member.localScale, 1)
      );
      const irregularity = clampHEarthGeometryNumber(member.irregularityWeight, 0, 1, 0);

      return createHEarthExpandedGeometryNode(parentNode, {
        suffix: options.suffix || 'cluster-child',
        index,
        primitiveType,
        materialKey,
        depthClass,
        depthZone,
        geometryNodeKind,
        label: `${resolveHEarthGeometryLabel(parentNode)} Detail ${String(index + 1).padStart(2, '0')}`,
        transform: {
          localOffset: {
            x: normalizeHEarthGeometryNumber(offset.dx, 0),
            y: normalizeHEarthGeometryNumber(offset.dy, 0),
            z: normalizeHEarthGeometryNumber(offset.dz, 0)
          },
          localRotate: {
            x: normalizeHEarthGeometryNumber(rotation.x, 0),
            y: normalizeHEarthGeometryNumber(rotation.y, 0),
            z: normalizeHEarthGeometryNumber(rotation.z, 0)
          },
          localScale,
          extentScale: clampHEarthGeometryNumber(
            0.08 + localScale * 0.12 + irregularity * 0.05,
            0.05,
            0.32,
            0.12
          )
        },
        geometry: {
          profileId: options.profileId || `${primitiveType}-cluster-child`,
          profileClassName:
            options.profileClassName ||
            `h-earth-geometry-${normalizeHEarthGeometryToken(primitiveType)}-child`,
          landscapeClassName:
            options.landscapeClassName ||
            `h-earth-landscape-${normalizeHEarthGeometryToken(primitiveType)}-child`,
          groundPlane: options.groundPlane === true,
          semanticRole: options.semanticRole || 'candidate-surface-detail',
          widthRatio: clampHEarthGeometryNumber(0.05 + localScale * 0.09, 0.04, 0.24, 0.1),
          heightRatio: clampHEarthGeometryNumber(0.05 + localScale * 0.07, 0.03, 0.18, 0.08),
          depthRatio: clampHEarthGeometryNumber(0.05 + localScale * 0.08, 0.03, 0.2, 0.08),
          scalar: localScale
        }
      });
    })
  );
}

export function expandHEarthContouredTerrainBand(parentNode) {
  const nodes = [];
  const density = resolveHEarthGeometryDetailDensity(parentNode);
  const detailCount = Math.min(
    28,
    Math.max(14, resolveHEarthGeometryDetailCount(parentNode))
  );
  const extent = resolveHEarthGeometryExtent(parentNode);

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'wet-sand-ground-base-plane',
      primitiveType: 'candidateWetSandGroundPlane',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_BASE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Ground Base Plane`,
      transform: {
        localOffset: { x: 0, y: 0, z: 0 },
        localScale: 1,
        extentScale: 1
      },
      geometry: {
        profileId: 'wet-sand-ground-base-plane',
        profileClassName: 'h-earth-geometry-ground-wet-sand-base-plane',
        landscapeClassName: 'h-earth-landscape-ground-wet-sand-base-plane',
        semanticRole: 'primary-wet-sand-ground-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.35,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  const contourCount = Math.min(8, Math.max(4, Math.round(detailCount * 0.28)));

  for (let index = 0; index < contourCount; index += 1) {
    const t = (index + 1) / (contourCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'wet-sand-contour-ridge',
        index,
        primitiveType: 'candidateWetSandContourRidge',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_CONTOUR,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Contour Ridge ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.72,
            y: 0.02 + density * 0.08,
            z: (0.12 - t * 0.38) * extent.z
          },
          localRotate: { x: 0, y: 0, z: (t - 0.5) * 5 },
          localScale: 0.42 + density * 0.2,
          extentScale: 0.28
        },
        geometry: {
          profileId: 'wet-sand-contour-ridge',
          profileClassName: 'h-earth-geometry-ground-wet-sand-contour-ridge',
          landscapeClassName: 'h-earth-landscape-ground-wet-sand-contour-ridge',
          semanticRole: 'wet-sand-contour-elevation-cue',
          groundPlane: true,
          widthRatio: 0.42,
          heightRatio: 0.08,
          depthRatio: 0.08,
          scalar: 0.5
        }
      })
    );
  }

  const patchCount = Math.min(8, Math.max(4, Math.round(detailCount * 0.24)));

  for (let index = 0; index < patchCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const t = (index + 1) / (patchCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'wet-sand-moisture-patch',
        index,
        primitiveType: 'candidateWetSandMoisturePatch',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_PATCH,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Moisture Patch ${index + 1}`,
        transform: {
          localOffset: {
            x: side * extent.x * (0.08 + t * 0.28),
            y: 0.015,
            z: -extent.z * (0.12 + t * 0.22)
          },
          localRotate: { x: 0, y: 0, z: side * (2 + t * 5) },
          localScale: 0.22 + t * 0.18,
          extentScale: 0.16 + t * 0.08
        },
        geometry: {
          profileId: 'wet-sand-moisture-patch',
          profileClassName: 'h-earth-geometry-ground-wet-sand-moisture-patch',
          landscapeClassName: 'h-earth-landscape-ground-wet-sand-moisture-patch',
          semanticRole: 'wet-sand-moisture-variation-cue',
          groundPlane: true,
          widthRatio: 0.16 + t * 0.08,
          heightRatio: 0.04,
          depthRatio: 0.1,
          scalar: 0.25 + t * 0.12
        }
      })
    );
  }

  const sheenCount = Math.min(5, Math.max(2, Math.round(detailCount * 0.16)));

  for (let index = 0; index < sheenCount; index += 1) {
    const t = (index + 1) / (sheenCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'wet-sand-reflective-sheen',
        index,
        primitiveType: 'candidateWetSandReflectiveSheen',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.REFLECTIVE_SHEEN,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Reflective Sheen ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.58,
            y: 0.018,
            z: -extent.z * (0.2 + t * 0.24)
          },
          localRotate: { x: 0, y: 0, z: (t - 0.5) * 3 },
          localScale: 0.16 + t * 0.14,
          extentScale: 0.14
        },
        geometry: {
          profileId: 'wet-sand-reflective-sheen',
          profileClassName: 'h-earth-geometry-ground-wet-sand-reflective-sheen',
          landscapeClassName: 'h-earth-landscape-ground-wet-sand-reflective-sheen',
          semanticRole: 'wet-sand-surface-reflection-cue',
          groundPlane: true,
          widthRatio: 0.24,
          heightRatio: 0.025,
          depthRatio: 0.045,
          scalar: 0.2
        }
      })
    );
  }

  nodes.push(
    ...createHEarthGeometryClusterChildNodes(parentNode, {
      maxCount: Math.min(12, detailCount),
      suffix: 'wet-sand-grain-detail',
      primitiveType: 'candidateWetSandGrainDetail',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_GRAIN,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
      profileId: 'wet-sand-grain-detail',
      profileClassName: 'h-earth-geometry-ground-wet-sand-grain-detail',
      landscapeClassName: 'h-earth-landscape-ground-wet-sand-grain-detail',
      semanticRole: 'wet-sand-near-field-grain-detail',
      groundPlane: true
    })
  );

  return Object.freeze(nodes);
}

export function expandHEarthTerrainBand(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);
  const detailCount = Math.min(
    20,
    Math.max(8, resolveHEarthGeometryDetailCount(parentNode))
  );

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'dry-sand-ground-base-plane',
      primitiveType: 'candidateDrySandGroundPlane',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_BASE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Dry Sand Base Plane`,
      geometry: {
        profileId: 'dry-sand-ground-base-plane',
        profileClassName: 'h-earth-geometry-ground-dry-sand-base-plane',
        landscapeClassName: 'h-earth-landscape-ground-dry-sand-base-plane',
        semanticRole: 'dry-sand-transition-ground-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.28,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  const ridgeCount = Math.min(6, Math.max(3, Math.round(detailCount * 0.36)));

  for (let index = 0; index < ridgeCount; index += 1) {
    const t = (index + 1) / (ridgeCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'dry-sand-transition-ridge',
        index,
        primitiveType: 'candidateDrySandTransitionRidge',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_CONTOUR,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Transition Ridge ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.68,
            y: 0.025,
            z: (t - 0.5) * extent.z * 0.48
          },
          localRotate: { z: (t - 0.5) * 7 },
          localScale: 0.34,
          extentScale: 0.22
        },
        geometry: {
          profileId: 'dry-sand-transition-ridge',
          profileClassName: 'h-earth-geometry-ground-dry-sand-transition-ridge',
          landscapeClassName: 'h-earth-landscape-ground-dry-sand-transition-ridge',
          semanticRole: 'dry-sand-transition-elevation-cue',
          groundPlane: true,
          widthRatio: 0.32,
          heightRatio: 0.07,
          depthRatio: 0.08,
          scalar: 0.35
        }
      })
    );
  }

  nodes.push(
    ...createHEarthGeometryClusterChildNodes(parentNode, {
      maxCount: Math.min(10, detailCount),
      suffix: 'dry-sand-surface-patch',
      primitiveType: 'candidateDrySandSurfacePatch',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GROUND_PATCH,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
      profileId: 'dry-sand-surface-patch',
      profileClassName: 'h-earth-geometry-ground-dry-sand-surface-patch',
      landscapeClassName: 'h-earth-landscape-ground-dry-sand-surface-patch',
      semanticRole: 'dry-sand-surface-patch-detail',
      groundPlane: true
    })
  );

  return Object.freeze(nodes);
}

export function expandHEarthIrregularShorelineBand(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);
  const detailCount = Math.min(
    24,
    Math.max(10, resolveHEarthGeometryDetailCount(parentNode))
  );

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'shoreline-contact-base',
      primitiveType: 'candidateShorelineContactBase',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SHORELINE_BASE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Shoreline Contact Base`,
      geometry: {
        profileId: 'shoreline-contact-base',
        profileClassName: 'h-earth-geometry-shoreline-contact-base',
        landscapeClassName: 'h-earth-landscape-shoreline-contact-base',
        semanticRole: 'shoreline-water-ground-contact-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.22,
        depthRatio: 0.45,
        scalar: 1
      }
    })
  );

  const edgeCount = Math.min(6, Math.max(3, Math.round(detailCount * 0.22)));

  for (let index = 0; index < edgeCount; index += 1) {
    const t = (index + 1) / (edgeCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'shoreline-irregular-edge',
        index,
        primitiveType: 'candidateShorelineIrregularEdge',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SHORELINE_EDGE,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Irregular Edge ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.82,
            y: 0.026,
            z: (t - 0.5) * extent.z * 0.22
          },
          localRotate: { z: (t - 0.5) * 9 },
          localScale: 0.16,
          extentScale: 0.1
        },
        geometry: {
          profileId: 'shoreline-irregular-edge',
          profileClassName: 'h-earth-geometry-shoreline-irregular-edge',
          landscapeClassName: 'h-earth-landscape-shoreline-irregular-edge',
          semanticRole: 'irregular-shoreline-edge-cue',
          groundPlane: true,
          widthRatio: 0.12,
          heightRatio: 0.025,
          depthRatio: 0.035,
          scalar: 0.16
        }
      })
    );
  }

  const foamCount = Math.min(16, detailCount);

  for (let index = 0; index < foamCount; index += 1) {
    const t = (index + 1) / (foamCount + 1);
    const side = index % 2 === 0 ? -1 : 1;

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'shoreline-foam-break',
        index,
        primitiveType: 'candidateShorelineFoamBreak',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SHORELINE_FOAM,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Foam Break ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.92,
            y: 0.03,
            z: side * extent.z * 0.08
          },
          localRotate: { z: side * (1 + t * 6) },
          localScale: 0.12 + t * 0.08,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'shoreline-foam-break',
          profileClassName: 'h-earth-geometry-shoreline-foam-break',
          landscapeClassName: 'h-earth-landscape-shoreline-foam-break',
          semanticRole: 'shoreline-foam-contact-fragment',
          groundPlane: true,
          widthRatio: 0.08 + t * 0.05,
          heightRatio: 0.025,
          depthRatio: 0.04,
          scalar: 0.16
        }
      })
    );
  }

  return Object.freeze(nodes);
}

export function expandHEarthWaterDepthBand(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);
  const detailCount = Math.min(
    18,
    Math.max(7, resolveHEarthGeometryDetailCount(parentNode))
  );

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'nearshore-water-depth-base',
      primitiveType: 'candidateNearshoreWaterDepthBase',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.WATER_BASE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Nearshore Depth Base`,
      geometry: {
        profileId: 'nearshore-water-depth-base',
        profileClassName: 'h-earth-geometry-water-nearshore-depth-base',
        landscapeClassName: 'h-earth-landscape-water-nearshore-depth-base',
        semanticRole: 'nearshore-water-depth-base-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.18,
        depthRatio: 0.8,
        scalar: 1
      }
    })
  );

  const rippleCount = Math.min(12, detailCount + 3);

  for (let index = 0; index < rippleCount; index += 1) {
    const t = (index + 1) / (rippleCount + 1);

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'nearshore-ripple-strip',
        index,
        primitiveType: 'candidateNearshoreRippleStrip',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.WATER_RIPPLE,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Ripple Strip ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.72,
            y: 0.02,
            z: (t - 0.5) * extent.z * 0.55
          },
          localRotate: { z: (t - 0.5) * 4 },
          localScale: 0.14,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'nearshore-ripple-strip',
          profileClassName: 'h-earth-geometry-water-nearshore-ripple-strip',
          landscapeClassName: 'h-earth-landscape-water-nearshore-ripple-strip',
          semanticRole: 'nearshore-water-ripple-cue',
          groundPlane: true,
          widthRatio: 0.18,
          heightRatio: 0.025,
          depthRatio: 0.04,
          scalar: 0.14
        }
      })
    );
  }

  return Object.freeze(nodes);
}

export function expandHEarthWaterPlane(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'water-surface-base-plane',
      primitiveType: 'candidateWaterSurfacePlane',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.WATER_BASE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Water Surface Base Plane`,
      geometry: {
        profileId: 'water-surface-base-plane',
        profileClassName: 'h-earth-geometry-water-surface-base-plane',
        landscapeClassName: 'h-earth-landscape-water-surface-base-plane',
        semanticRole: 'background-water-surface-field',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.25,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  for (let index = 0; index < 10; index += 1) {
    const t = (index + 1) / 11;

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'water-depth-band',
        index,
        primitiveType: 'candidateWaterDepthBand',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.WATER_DEPTH,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Depth Band ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.5,
            y: 0.015,
            z: (t - 0.5) * extent.z * 0.78
          },
          localScale: 0.18,
          extentScale: 0.12
        },
        geometry: {
          profileId: 'water-depth-band',
          profileClassName: 'h-earth-geometry-water-depth-band',
          landscapeClassName: 'h-earth-landscape-water-depth-band',
          semanticRole: 'water-depth-gradient-band',
          groundPlane: true,
          widthRatio: 0.24,
          heightRatio: 0.025,
          depthRatio: 0.08,
          scalar: 0.18
        }
      })
    );
  }

  for (let index = 0; index < 6; index += 1) {
    const t = (index + 1) / 7;

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'water-reflection-strip',
        index,
        primitiveType: 'candidateWaterReflectionStrip',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.WATER_REFLECTION,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Reflection Strip ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.62,
            y: 0.02,
            z: -extent.z * (0.12 + t * 0.28)
          },
          localScale: 0.12,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'water-reflection-strip',
          profileClassName: 'h-earth-geometry-water-reflection-strip',
          landscapeClassName: 'h-earth-landscape-water-reflection-strip',
          semanticRole: 'water-surface-reflection-cue',
          groundPlane: true,
          widthRatio: 0.18,
          heightRatio: 0.02,
          depthRatio: 0.035,
          scalar: 0.12
        }
      })
    );
  }

  return Object.freeze(nodes);
}

export function expandHEarthScatterCluster(parentNode) {
  return createHEarthGeometryClusterChildNodes(parentNode, {
    maxCount: 24,
    suffix: 'surface-scatter-member',
    primitiveType: 'candidateSurfaceScatterMember',
    geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SCATTER_MEMBER,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
    profileId: 'surface-scatter-member',
    profileClassName: 'h-earth-geometry-ground-surface-scatter-member',
    landscapeClassName: 'h-earth-landscape-ground-surface-scatter-member',
    semanticRole: 'ground-surface-scatter-detail',
    groundPlane: true
  });
}

export function expandHEarthRockCluster(parentNode) {
  const nodes = createHEarthGeometryClusterChildNodes(parentNode, {
    maxCount: 24,
    suffix: 'rock-cluster-member',
    primitiveType: 'candidateRockClusterMember',
    geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.ROCK_MEMBER,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
    profileId: 'rock-cluster-member',
    profileClassName: 'h-earth-geometry-rock-cluster-member',
    landscapeClassName: 'h-earth-landscape-rock-cluster-member',
    semanticRole: 'raised-rock-cluster-detail',
    groundPlane: false
  });

  return Object.freeze(
    nodes.map((node) =>
      Object.freeze({
        ...node,
        primitiveGeometry: Object.freeze({
          ...node.primitiveGeometry,
          groundPlane: false,
          heightPx: Math.max(8, node.primitiveGeometry.heightPx * 1.6),
          depthPx: Math.max(4, node.primitiveGeometry.depthPx * 1.25),
          claimBoundaryPreserved: true
        })
      })
    )
  );
}

export function expandHEarthAtmosphericLayer(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'air-haze-panel',
      primitiveType: 'candidateAirHazePanel',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.AIR_HAZE,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.SKY,
      label: `${resolveHEarthGeometryLabel(parentNode)} Haze Panel`,
      geometry: {
        profileId: 'air-haze-panel',
        profileClassName: 'h-earth-geometry-air-haze-panel',
        landscapeClassName: 'h-earth-landscape-air-haze-panel',
        semanticRole: 'air-haze-atmospheric-panel',
        groundPlane: false,
        widthRatio: 1,
        heightRatio: 1,
        depthRatio: 0.2,
        scalar: 1
      }
    })
  );

  for (let index = 0; index < 4; index += 1) {
    const t = (index + 1) / 5;

    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'air-light-band',
        index,
        primitiveType: 'candidateAirLightBand',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.AIR_LIGHT,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.SKY,
        label: `${resolveHEarthGeometryLabel(parentNode)} Light Band ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.42,
            y: (t - 0.5) * extent.y * 0.35,
            z: 0
          },
          localScale: 0.2,
          extentScale: 0.18
        },
        geometry: {
          profileId: 'air-light-band',
          profileClassName: 'h-earth-geometry-air-light-band',
          landscapeClassName: 'h-earth-landscape-air-light-band',
          semanticRole: 'air-light-gradient-band',
          groundPlane: false,
          widthRatio: 0.28,
          heightRatio: 0.08,
          depthRatio: 0.04,
          scalar: 0.18
        }
      })
    );
  }

  return Object.freeze(nodes);
}

export function expandHEarthLayeredSilhouette(parentNode) {
  const nodes = [];
  const extent = resolveHEarthGeometryExtent(parentNode);

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'manor-context-body',
      primitiveType: 'candidateManorContextBody',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SILHOUETTE_BODY,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Context Body`,
      geometry: {
        profileId: 'manor-context-body',
        profileClassName: 'h-earth-geometry-manor-context-body',
        landscapeClassName: 'h-earth-landscape-manor-context-body',
        semanticRole: 'distant-manor-context-body',
        groundPlane: false,
        widthRatio: 0.5,
        heightRatio: 0.8,
        depthRatio: 0.2,
        scalar: 0.6
      }
    })
  );

  nodes.push(
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'manor-context-roof',
      primitiveType: 'candidateManorContextRoof',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SILHOUETTE_ROOF,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
      label: `${resolveHEarthGeometryLabel(parentNode)} Context Roof`,
      transform: {
        localOffset: { x: 0, y: extent.y * 0.32, z: 0 },
        localScale: 0.38,
        extentScale: 0.22
      },
      geometry: {
        profileId: 'manor-context-roof',
        profileClassName: 'h-earth-geometry-manor-context-roof',
        landscapeClassName: 'h-earth-landscape-manor-context-roof',
        semanticRole: 'distant-manor-context-roof',
        groundPlane: false,
        widthRatio: 0.62,
        heightRatio: 0.18,
        depthRatio: 0.16,
        scalar: 0.38
      }
    })
  );

  for (let index = 0; index < 3; index += 1) {
    nodes.push(
      createHEarthExpandedGeometryNode(parentNode, {
        suffix: 'manor-context-vertical-segment',
        index,
        primitiveType: 'candidateManorContextVerticalSegment',
        geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.SILHOUETTE_BODY,
        depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
        label: `${resolveHEarthGeometryLabel(parentNode)} Vertical Segment ${index + 1}`,
        transform: {
          localOffset: {
            x: (index - 1) * extent.x * 0.14,
            y: 0,
            z: 0
          },
          localScale: 0.22,
          extentScale: 0.12
        },
        geometry: {
          profileId: 'manor-context-vertical-segment',
          profileClassName: 'h-earth-geometry-manor-context-vertical-segment',
          landscapeClassName: 'h-earth-landscape-manor-context-vertical-segment',
          semanticRole: 'distant-manor-context-vertical-cue',
          groundPlane: false,
          widthRatio: 0.08,
          heightRatio: 0.5,
          depthRatio: 0.08,
          scalar: 0.22
        }
      })
    );
  }

  return Object.freeze(nodes);
}

export function expandHEarthDistantCluster(parentNode) {
  const nodes = createHEarthGeometryClusterChildNodes(parentNode, {
    maxCount: 10,
    suffix: 'distant-world-silhouette',
    primitiveType: 'candidateDistantWorldSilhouette',
    geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.DISTANT_CONTEXT,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.DISTANT,
    profileId: 'distant-world-context-silhouette',
    profileClassName: 'h-earth-geometry-distant-world-context-form',
    landscapeClassName: 'h-earth-landscape-distant-world-context-form',
    semanticRole: 'distant-world-context-boundary-form',
    groundPlane: false
  });

  if (nodes.length > 0) {
    return nodes;
  }

  return Object.freeze([
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'distant-world-silhouette',
      primitiveType: 'candidateDistantWorldSilhouette',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.DISTANT_CONTEXT,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.DISTANT,
      label: `${resolveHEarthGeometryLabel(parentNode)} Distant World Silhouette`,
      geometry: {
        profileId: 'distant-world-context-silhouette',
        profileClassName: 'h-earth-geometry-distant-world-context-form',
        landscapeClassName: 'h-earth-landscape-distant-world-context-form',
        semanticRole: 'distant-world-context-boundary-form',
        groundPlane: false,
        widthRatio: 0.45,
        heightRatio: 0.65,
        depthRatio: 0.12,
        scalar: 0.4
      }
    })
  ]);
}

export function expandHEarthInspectionAnchor(parentNode) {
  return Object.freeze([
    createHEarthExpandedGeometryNode(parentNode, {
      suffix: 'primary-inspection-anchor-marker',
      primitiveType: 'candidateInspectionAnchorMarker',
      geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.INSPECTION_ANCHOR,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.OVERLAY,
      label: `${resolveHEarthGeometryLabel(parentNode)} Marker`,
      geometry: {
        profileId: 'primary-inspection-anchor-marker',
        profileClassName: 'h-earth-geometry-primary-inspection-anchor-marker',
        landscapeClassName: 'h-earth-landscape-primary-inspection-anchor-marker',
        semanticRole: 'primary-ground-inspection-anchor-marker',
        groundPlane: false,
        widthRatio: 1,
        heightRatio: 1,
        depthRatio: 1,
        scalar: 1
      }
    })
  ]);
}

export function expandHEarthGeometryNodeByPrimitive(parentNode) {
  const primitiveType = resolveHEarthGeometryPrimitiveType(parentNode);

  switch (primitiveType) {
    case 'contouredTerrainBand':
      return expandHEarthContouredTerrainBand(parentNode);

    case 'terrainBand':
      return expandHEarthTerrainBand(parentNode);

    case 'irregularShorelineBand':
      return expandHEarthIrregularShorelineBand(parentNode);

    case 'waterDepthBand':
      return expandHEarthWaterDepthBand(parentNode);

    case 'waterPlane':
      return expandHEarthWaterPlane(parentNode);

    case 'scatterCluster':
      return expandHEarthScatterCluster(parentNode);

    case 'rockCluster':
      return expandHEarthRockCluster(parentNode);

    case 'atmosphericLayer':
      return expandHEarthAtmosphericLayer(parentNode);

    case 'layeredSilhouette':
      return expandHEarthLayeredSilhouette(parentNode);

    case 'distantCluster':
      return expandHEarthDistantCluster(parentNode);

    case 'inspectionAnchor':
      return expandHEarthInspectionAnchor(parentNode);

    default:
      return Object.freeze([
        createHEarthExpandedGeometryNode(parentNode, {
          suffix: 'generic-candidate-geometry',
          primitiveType: `candidate-${normalizeHEarthGeometryToken(primitiveType)}`,
          geometryNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GENERIC,
          label: `${resolveHEarthGeometryLabel(parentNode)} Candidate Geometry`,
          geometry: {
            profileId: 'generic-candidate-geometry',
            profileClassName: 'h-earth-geometry-generic-candidate',
            landscapeClassName: 'h-earth-landscape-generic-candidate',
            semanticRole: 'generic-candidate-geometry-context',
            groundPlane: false,
            widthRatio: 1,
            heightRatio: 1,
            depthRatio: 1,
            scalar: 1
          }
        })
      ]);
  }
}

export function shouldCarryHEarthParentDescriptor(parentNode) {
  return resolveHEarthGeometryProfile(parentNode).carryParentDescriptor === true;
}

export function summarizeHEarthPrimitiveExpansion(sourceNodes, expandedNodes) {
  const summary = {};

  sourceNodes.forEach((sourceNode) => {
    const primitiveType = resolveHEarthGeometryPrimitiveType(sourceNode);

    if (!summary[primitiveType]) {
      summary[primitiveType] = {
        primitiveType,
        sourceNodeCount: 0,
        expandedNodeCount: 0,
        geometryChildNodeCount: 0,
        descriptorParentNodeCount: 0
      };
    }

    summary[primitiveType].sourceNodeCount += 1;
  });

  expandedNodes.forEach((expandedNode) => {
    const primitiveType =
      expandedNode.geometryExpansion?.parentPrimitiveType ||
      expandedNode.sourceObject?.primitiveType ||
      resolveHEarthGeometryPrimitiveType(expandedNode);

    if (!summary[primitiveType]) {
      summary[primitiveType] = {
        primitiveType,
        sourceNodeCount: 0,
        expandedNodeCount: 0,
        geometryChildNodeCount: 0,
        descriptorParentNodeCount: 0
      };
    }

    summary[primitiveType].expandedNodeCount += 1;

    if (expandedNode.geometryExpansion?.expandedFromParent === true) {
      summary[primitiveType].geometryChildNodeCount += 1;
    }

    if (expandedNode.geometryExpansion?.parentCarryNode === true) {
      summary[primitiveType].descriptorParentNodeCount += 1;
    }
  });

  return Object.freeze(
    Object.values(summary).map((entry) => Object.freeze(entry))
  );
}

export function makeHEarthGeometryExpansionReceipt({
  source = 'unknown',
  sourceNodes = [],
  expandedNodes = [],
  skippedNodeCount = 0,
  alreadyExpandedSkippedCount = 0,
  warningCodes = [],
  failureCodes = []
} = {}) {
  const parentNodeCount = expandedNodes.filter(
    (node) => node.geometryExpansion?.parentCarryNode === true
  ).length;

  const childNodeCount = expandedNodes.filter(
    (node) => node.geometryExpansion?.expandedFromParent === true
  ).length;

  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.renewedFrom,
    source,

    geometryPortUsed: true,
    geometryExpansionAttempted: true,
    geometryExpansionApplied: expandedNodes.length > sourceNodes.length,
    geometryExpansionSkippedBecauseAlreadyExpanded:
      alreadyExpandedSkippedCount > 0 && expandedNodes.length === sourceNodes.length,

    sourceNodeCount: sourceNodes.length,
    expandedNodeCount: expandedNodes.length,
    skippedNodeCount,
    parentNodeCount,
    childNodeCount,

    descriptorParentNodeCount: parentNodeCount,
    geometryChildNodeCount: childNodeCount,
    geometryExpansionSkippedCount: skippedNodeCount,
    alreadyExpandedSkippedCount,

    primitiveExpansionSummary: summarizeHEarthPrimitiveExpansion(
      sourceNodes,
      expandedNodes
    ),

    warningCodes: Object.freeze(warningCodes),
    failureCodes: Object.freeze(failureCodes),
    geometryExpansionWarningCodes: Object.freeze(warningCodes),
    geometryExpansionFailureCodes: Object.freeze(failureCodes),

    claimsFinalGeometry: false,
    claimsRendererPass: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,

    boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthGeometryExpansionInput(input, context = {}) {
  if (Array.isArray(input)) {
    return Object.freeze({
      nodes: input,
      source: context.source || 'array-input',
      context
    });
  }

  if (isHEarthPlainObject(input) && Array.isArray(input.nodes)) {
    return Object.freeze({
      nodes: input.nodes,
      source: input.source || context.source || 'object-input.nodes',
      context: Object.freeze({
        ...context,
        ...input
      })
    });
  }

  return Object.freeze({
    nodes: [],
    source: context.source || 'invalid-input',
    context
  });
}

export function applyHEarthGeometryExpandedNodeBudget({
  nodes,
  maxExpandedNodes
} = {}) {
  const safeNodes = normalizeHEarthGeometryArray(nodes);
  const maxNodes = Math.max(
    1,
    Math.floor(
      normalizeHEarthGeometryNumber(
        maxExpandedNodes,
        H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.maxExpandedNodes
      )
    )
  );

  return Object.freeze({
    nodes: Object.freeze(safeNodes.slice(0, maxNodes)),
    skippedNodeCount: Math.max(0, safeNodes.length - maxNodes),
    sourceExpandedNodeCount: safeNodes.length,
    returnedExpandedNodeCount: Math.min(safeNodes.length, maxNodes),
    budgetApplied: safeNodes.length > maxNodes,
    budgetValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function expandHEarthGeometryNodes(input = {}, context = {}) {
  const resolvedInput = resolveHEarthGeometryExpansionInput(input, context);
  const source = resolvedInput.source;
  const warnings = [];
  const failures = [];

  const sourceNodes = normalizeHEarthGeometryArray(resolvedInput.nodes).filter(
    isHEarthPlainObject
  );

  if (Array.isArray(resolvedInput.nodes) === false) {
    warnings.push('GEOMETRY_SOURCE_NODES_NOT_ARRAY');
  }

  if (sourceNodes.length !== normalizeHEarthGeometryArray(resolvedInput.nodes).length) {
    warnings.push('GEOMETRY_SOURCE_NODES_FILTERED_NON_OBJECT_VALUES');
  }

  if (sourceNodes.length === 0) {
    warnings.push('GEOMETRY_SOURCE_NODES_EMPTY');

    const receipt = makeHEarthGeometryExpansionReceipt({
      source,
      sourceNodes: [],
      expandedNodes: [],
      skippedNodeCount: 0,
      warningCodes: warnings,
      failureCodes: failures
    });

    return Object.freeze({
      nodes: Object.freeze([]),
      rawNodes: Object.freeze([]),
      source,
      receipt,
      geometryReceipt: receipt,

      geometryPortUsed: true,
      geometryExpansionAttempted: true,
      geometryExpansionApplied: false,
      geometryExpansionSkippedBecauseAlreadyExpanded: false,

      sourceNodeCount: 0,
      expandedNodeCount: 0,
      skippedNodeCount: 0,
      parentNodeCount: 0,
      childNodeCount: 0,

      descriptorParentNodeCount: 0,
      geometryChildNodeCount: 0,
      geometryExpansionSkippedCount: 0,

      warningCodes: Object.freeze(warnings),
      failureCodes: Object.freeze(failures),
      geometryExpansionWarningCodes: Object.freeze(warnings),
      geometryExpansionFailureCodes: Object.freeze(failures),

      claimBoundaryPreserved: true
    });
  }

  const allAlreadyExpanded = sourceNodes.every(isHEarthAlreadyExpandedGeometryNode);

  if (allAlreadyExpanded === true) {
    warnings.push('GEOMETRY_INPUT_ALREADY_EXPANDED_REEXPANSION_SKIPPED');

    const expandedNodes = Object.freeze(
      sourceNodes.map((node) =>
        Object.freeze({
          ...node,
          candidateGeometryOnly: true,
          finalGeometryClaim: false,
          rendererPassClaim: false,
          visualPassClaim: false,
          validationClaim: false,
          productionClaim: false,
          claimBoundaryPreserved: true
        })
      )
    );

    const receipt = makeHEarthGeometryExpansionReceipt({
      source,
      sourceNodes,
      expandedNodes,
      skippedNodeCount: 0,
      alreadyExpandedSkippedCount: sourceNodes.length,
      warningCodes: warnings,
      failureCodes: failures
    });

    return Object.freeze({
      nodes: expandedNodes,
      rawNodes: expandedNodes,
      source,
      receipt,
      geometryReceipt: receipt,

      geometryPortUsed: true,
      geometryExpansionAttempted: true,
      geometryExpansionApplied: false,
      geometryExpansionSkippedBecauseAlreadyExpanded: true,

      sourceNodeCount: sourceNodes.length,
      expandedNodeCount: expandedNodes.length,
      skippedNodeCount: 0,
      parentNodeCount: receipt.parentNodeCount,
      childNodeCount: receipt.childNodeCount,

      descriptorParentNodeCount: receipt.descriptorParentNodeCount,
      geometryChildNodeCount: receipt.geometryChildNodeCount,
      geometryExpansionSkippedCount: receipt.geometryExpansionSkippedCount,
      alreadyExpandedSkippedCount: sourceNodes.length,

      sourceExpandedNodeCount: expandedNodes.length,
      returnedExpandedNodeCount: expandedNodes.length,
      budgetApplied: false,

      warningCodes: Object.freeze(warnings),
      failureCodes: Object.freeze(failures),
      geometryExpansionWarningCodes: Object.freeze(warnings),
      geometryExpansionFailureCodes: Object.freeze(failures),

      claimBoundaryPreserved: true
    });
  }

  const expandedNodes = [];

  sourceNodes.forEach((sourceNode, index) => {
    try {
      const parentNode = Object.freeze({
        ...sourceNode,
        geometryExpansionContext: Object.freeze({
          geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
          geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
          sourceIndex: index,
          source,
          contextKeys: Object.freeze(Object.keys(resolvedInput.context || {})),
          candidateGeometryOnly: true,
          finalGeometryClaim: false,
          rendererPassClaim: false,
          visualPassClaim: false,
          validationClaim: false,
          claimBoundaryPreserved: true
        })
      });

      if (isHEarthAlreadyExpandedGeometryNode(parentNode) === true) {
        expandedNodes.push(
          Object.freeze({
            ...parentNode,
            candidateGeometryOnly: true,
            finalGeometryClaim: false,
            rendererPassClaim: false,
            visualPassClaim: false,
            validationClaim: false,
            productionClaim: false,
            claimBoundaryPreserved: true
          })
        );
        return;
      }

      if (shouldCarryHEarthParentDescriptor(parentNode) === true) {
        expandedNodes.push(createHEarthParentCarryGeometryNode(parentNode, index));
      }

      const childNodes = expandHEarthGeometryNodeByPrimitive(parentNode).map(
        (childNode) =>
          Object.freeze({
            ...childNode,
            geometryExpansion: Object.freeze({
              ...(childNode.geometryExpansion || {}),
              sourceIndex: index,
              source,
              parentPrimitiveType: resolveHEarthGeometryPrimitiveType(parentNode),
              parentMaterialKey: resolveHEarthGeometryMaterialKey(parentNode),
              parentDepthClass: resolveHEarthGeometryDepthClass(parentNode),
              parentDepthZone: resolveHEarthGeometryDepthZone(parentNode),
              candidateGeometryOnly: true,
              finalGeometryClaim: false,
              rendererPassClaim: false,
              visualPassClaim: false,
              validationClaim: false,
              claimBoundaryPreserved: true
            })
          })
      );

      expandedNodes.push(...childNodes);
    } catch (error) {
      failures.push(
        Object.freeze({
          code: 'GEOMETRY_NODE_EXPANSION_FAILED',
          sourceIndex: index,
          objectId: resolveHEarthGeometryObjectId(sourceNode, index),
          message: String(error?.message || error || 'UNKNOWN_EXPANSION_ERROR'),
          claimBoundaryPreserved: true
        })
      );

      expandedNodes.push(createHEarthParentCarryGeometryNode(sourceNode, index));
    }
  });

  const requestedMax =
    input?.nodeBudget?.maxTotalCandidateNodes ??
    input?.maxExpandedNodes ??
    context?.maxExpandedNodes ??
    H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.maxExpandedNodes;

  const budgeted = applyHEarthGeometryExpandedNodeBudget({
    nodes: expandedNodes,
    maxExpandedNodes: requestedMax
  });

  if (budgeted.budgetApplied === true) {
    warnings.push('GEOMETRY_EXPANDED_NODE_BUDGET_APPLIED');
  }

  const receipt = makeHEarthGeometryExpansionReceipt({
    source,
    sourceNodes,
    expandedNodes: budgeted.nodes,
    skippedNodeCount: budgeted.skippedNodeCount,
    warningCodes: warnings,
    failureCodes: failures
  });

  return Object.freeze({
    nodes: budgeted.nodes,
    rawNodes: Object.freeze(expandedNodes),
    source,
    receipt,
    geometryReceipt: receipt,

    geometryPortUsed: true,
    geometryExpansionAttempted: true,
    geometryExpansionApplied: budgeted.nodes.length > sourceNodes.length,
    geometryExpansionSkippedBecauseAlreadyExpanded: false,

    sourceNodeCount: sourceNodes.length,
    expandedNodeCount: budgeted.nodes.length,
    skippedNodeCount: budgeted.skippedNodeCount,
    parentNodeCount: receipt.parentNodeCount,
    childNodeCount: receipt.childNodeCount,

    descriptorParentNodeCount: receipt.descriptorParentNodeCount,
    geometryChildNodeCount: receipt.geometryChildNodeCount,
    geometryExpansionSkippedCount: receipt.geometryExpansionSkippedCount,

    sourceExpandedNodeCount: budgeted.sourceExpandedNodeCount,
    returnedExpandedNodeCount: budgeted.returnedExpandedNodeCount,
    budgetApplied: budgeted.budgetApplied,

    warningCodes: Object.freeze(warnings),
    failureCodes: Object.freeze(failures),
    geometryExpansionWarningCodes: Object.freeze(warnings),
    geometryExpansionFailureCodes: Object.freeze(failures),

    claimBoundaryPreserved: true
  });
}

export function expandHEarthCandidateGeometryNodes(sourceNodes, context = {}) {
  return expandHEarthGeometryNodes(sourceNodes, context);
}

export function getHEarthGeometryPortReceipt() {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.renewedFrom,
    status: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.status,

    rendererCompatibilityTarget:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.rendererCompatibilityTarget,

    geometryPortDefined: true,
    geometryExpansionFunctionDefined: typeof expandHEarthGeometryNodes === 'function',
    rendererExpectedExpansionFunctionDefined: true,
    rendererExpectedReceiptFunctionDefined: true,
    legacyExpansionAliasDefined:
      typeof expandHEarthCandidateGeometryNodes === 'function',

    primitiveProfileMapDefined: true,
    primitiveExpansionDefined: true,
    parentDescriptorCarryDefined: true,
    clusterMemberConsumptionDefined: true,
    candidateOnlyGeometryDefined: true,
    alreadyExpandedReexpansionGuardDefined: true,
    groundLevelLandscapeDescriptorVocabularyDefined: true,

    supportedPrimitiveTypes: Object.freeze(
      Object.keys(H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_PROFILE_MAP)
    ),

    supportedDepthZones: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE,
    supportedGeometryNodeKinds: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND,

    createsDomNodes: false,
    touchesDom: false,
    queriesGlobalDocument: false,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    importsEnvironment: false,

    claimsFinalGeometry: false,
    claimsRendererPass: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,

    boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary,
    claimBoundaryPreserved: true
  });
}

export function getHEarthGeometryExpansionPortReceipt() {
  return getHEarthGeometryPortReceipt();
}

export const H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT =
  getHEarthGeometryPortReceipt();

export const H_EARTH_3D_RENDER_GEOMETRY_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
  file: '/showroom/globe/h-earth/render/geometry.js',

  contract: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT,
  nodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND,
  depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE,
  primitiveProfileMap: H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_PROFILE_MAP,
  defaultLimits: H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS,

  isPlainObject: isHEarthPlainObject,
  normalizeNumber: normalizeHEarthGeometryNumber,
  clampNumber: clampHEarthGeometryNumber,
  normalizeToken: normalizeHEarthGeometryToken,

  resolvePrimitiveType: resolveHEarthGeometryPrimitiveType,
  resolveMaterialKey: resolveHEarthGeometryMaterialKey,
  resolveObjectId: resolveHEarthGeometryObjectId,
  resolveNodeId: resolveHEarthGeometryNodeId,
  resolveLabel: resolveHEarthGeometryLabel,
  resolveLayerId: resolveHEarthGeometryLayerId,
  resolveLayerOrder: resolveHEarthGeometryLayerOrder,
  resolveDepthClass: resolveHEarthGeometryDepthClass,
  resolveDepthZone: resolveHEarthGeometryDepthZone,
  resolveNormalizedDepth: resolveHEarthGeometryNormalizedDepth,
  resolveTranslate: resolveHEarthGeometryTranslate,
  resolveRotate: resolveHEarthGeometryRotate,
  resolveScale: resolveHEarthGeometryScale,
  resolveExtent: resolveHEarthGeometryExtent,
  resolveShapeVariation: resolveHEarthGeometryShapeVariation,
  resolveClusterMembers: resolveHEarthGeometryClusterMembers,
  resolveDetailCount: resolveHEarthGeometryDetailCount,
  resolveDetailDensity: resolveHEarthGeometryDetailDensity,
  resolveProfile: resolveHEarthGeometryProfile,
  isAlreadyExpandedGeometryNode: isHEarthAlreadyExpandedGeometryNode,

  createCandidateTransform: createHEarthGeometryCandidateTransform,
  createPrimitiveDescriptor: createHEarthGeometryPrimitiveDescriptor,
  createExpandedNode: createHEarthExpandedGeometryNode,
  createParentCarryNode: createHEarthParentCarryGeometryNode,

  expandNodeByPrimitive: expandHEarthGeometryNodeByPrimitive,
  expandGeometryNodes: expandHEarthGeometryNodes,
  expandCandidateGeometryNodes: expandHEarthCandidateGeometryNodes,

  getReceipt: getHEarthGeometryPortReceipt,
  receipt: H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT,

  boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary
});

export default H_EARTH_3D_RENDER_GEOMETRY_PORT;
