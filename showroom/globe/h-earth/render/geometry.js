// /showroom/globe/h-earth/render/geometry.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032C_LATTICE_ADMISSION_GATED_GEOMETRY_PORT_v1
//
// Renews:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032B_LANDSCAPE_LATTICE_DIMENSION_CONSUMPTION_v1
//
// Preserves support surface from:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1
//
// Purpose:
// Candidate-only DOM/CSS3D geometry expansion port for H-Earth.
//
// This version preserves the renderer-facing geometry API while removing the
// operational risk of hard module-load lattice dependency. Lattice data is
// admitted through input/context/adapter channels. If the descriptor lattice is
// not admitted as 256-address / 16-row / 16-column / row-oriented, this port
// fails closed with a safe receipt and no geometry expansion.
//
// Boundary:
// No runtime lattice activation. No traversal grid. No collision grid.
// No physics grid. No gameplay grid. No survival grid. No WebGL. No canvas.
// No DOM creation. No DOM mutation. No final renderer claim. No renderer-pass
// claim. No visual-pass claim. No validation claim. No production claim.
// No matrix collapse.

export const H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032C_LATTICE_ADMISSION_GATED_GEOMETRY_PORT_v1',
  renewedFrom:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032B_LANDSCAPE_LATTICE_DIMENSION_CONSUMPTION_v1',
  supportSurfacePreservedFrom:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/render/geometry.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  sourceLandscapeLatticeFile:
    '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
  sourceLandscapeLatticeContract:
    'H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP_FILE_BIRTH_STEP_032A_v1',

  fileClass:
    'DOM_CSS_3D_CANDIDATE_GEOMETRY_PORT_WITH_LATTICE_ADMISSION_GATE',
  status: 'LATTICE_ADMISSION_GATED_CANDIDATE_ONLY',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  exportedApi: Object.freeze({
    aggregatePort: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
    expansionFunction: 'expandHEarthGeometryNodes',
    receiptFunction: 'getHEarthGeometryPortReceipt',
    legacyExpansionAlias: 'expandHEarthCandidateGeometryNodes',
    legacyReceiptAlias: 'getHEarthGeometryExpansionPortReceipt'
  }),

  admission: Object.freeze({
    requiresDescriptorLandscapeLattice: true,
    expectedAddressCount: 256,
    expectedRows: 16,
    expectedColumns: 16,
    requiresRowOrientationPreserved: true,
    silentFallbackAllowed: false,
    failClosedOnLatticeAdmissionFailure: true
  }),

  boundary: Object.freeze({
    expandsDescriptorNodes: true,
    consumesDescriptorLandscapeLattice: true,

    createsRuntimeGrid: false,
    createsTraversalGrid: false,
    createsCollisionGrid: false,
    createsPhysicsGrid: false,
    createsGameplayGrid: false,
    createsSurvivalGrid: false,

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

    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
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
  LATTICE_CELL: 'candidate-lattice-dimension-cell',

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

export const H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS = Object.freeze({
  maxExpandedNodes: 192,
  fallbackChildLimit: 12,
  minChildLimit: 1,
  maxChildLimitPerParent: 32,
  latticeAddressCountExpected: 256,
  latticeRowsExpected: 16,
  latticeColumnsExpected: 16,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_RENDER_GEOMETRY_MATERIAL_CLASS_MAP = Object.freeze({
  wetSand: 'h-earth-material-wet-sand',
  drySand: 'h-earth-material-dry-sand',
  foam: 'h-earth-material-foam',
  tidePool: 'h-earth-material-tide-pool',
  stone: 'h-earth-material-stone',
  jaggedRock: 'h-earth-material-jagged-rock',
  water: 'h-earth-material-water',
  nearshoreWave: 'h-earth-material-nearshore-wave',
  airHaze: 'h-earth-material-air-haze',
  manorContext: 'h-earth-material-manor-context',
  distantRock: 'h-earth-material-distant-rock',
  inspectionAnchor: 'h-earth-material-inspection-anchor',
  unresolved: 'h-earth-material-unresolved'
});

export const H_EARTH_3D_RENDER_GEOMETRY_LAYER_CLASS_MAP = Object.freeze({
  'distant-world-context-layer': Object.freeze({
    layerClassName: 'h-earth-layer-distant-world-context',
    layerMemberClassName: 'h-earth-layer-member-distant-world-context'
  }),
  'air-haze-light-layer': Object.freeze({
    layerClassName: 'h-earth-layer-air-haze-light',
    layerMemberClassName: 'h-earth-layer-member-air-haze-light'
  }),
  'water-surface-plane-layer': Object.freeze({
    layerClassName: 'h-earth-layer-water-surface-plane',
    layerMemberClassName: 'h-earth-layer-member-water-surface-plane'
  }),
  'nearshore-wave-band-layer': Object.freeze({
    layerClassName: 'h-earth-layer-nearshore-wave-band',
    layerMemberClassName: 'h-earth-layer-member-nearshore-wave-band'
  }),
  'shoreline-foam-line-layer': Object.freeze({
    layerClassName: 'h-earth-layer-shoreline-foam-line',
    layerMemberClassName: 'h-earth-layer-member-shoreline-foam-line'
  }),
  'manor-exterior-context-layer': Object.freeze({
    layerClassName: 'h-earth-layer-manor-exterior-context',
    layerMemberClassName: 'h-earth-layer-member-manor-exterior-context'
  }),
  'dry-sand-transition-layer': Object.freeze({
    layerClassName: 'h-earth-layer-dry-sand-transition',
    layerMemberClassName: 'h-earth-layer-member-dry-sand-transition'
  }),
  'foreground-wet-sand-layer': Object.freeze({
    layerClassName: 'h-earth-layer-foreground-wet-sand',
    layerMemberClassName: 'h-earth-layer-member-foreground-wet-sand'
  }),
  'tide-pools-stones-rocks-detail-layer': Object.freeze({
    layerClassName: 'h-earth-layer-tide-pools-stones-rocks-detail',
    layerMemberClassName: 'h-earth-layer-member-tide-pools-stones-rocks-detail'
  }),
  'inspection-anchor-overlay-layer': Object.freeze({
    layerClassName: 'h-earth-layer-inspection-anchor-overlay',
    layerMemberClassName: 'h-earth-layer-member-inspection-anchor-overlay'
  }),
  'unclassified-render-layer': Object.freeze({
    layerClassName: 'h-earth-layer-unclassified-render',
    layerMemberClassName: 'h-earth-layer-member-unclassified-render'
  })
});

export const H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP = Object.freeze({
  contouredTerrainBand: Object.freeze({
    parentPrimitiveType: 'contouredTerrainBand',
    canonicalPrimitiveType: 'contouredTerrainBand',
    canonicalPrimitiveClassName: 'h-earth-primitive-contoured-terrain-band',
    canonicalLandscapeClassName: 'h-earth-landscape-ground-plane',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-ground-wet-sand',
    canonicalMaterialKey: 'wetSand',
    canonicalLayerId: 'foreground-wet-sand-layer',
    defaultChildLimit: 28,
    latticeRows: Object.freeze([1, 2, 3, 4, 5]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
    semanticRole: 'primary-ground-inspection-surface'
  }),

  terrainBand: Object.freeze({
    parentPrimitiveType: 'terrainBand',
    canonicalPrimitiveType: 'terrainBand',
    canonicalPrimitiveClassName: 'h-earth-primitive-terrain-band',
    canonicalLandscapeClassName: 'h-earth-landscape-ground-plane',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-ground-dry-sand',
    canonicalMaterialKey: 'drySand',
    canonicalLayerId: 'dry-sand-transition-layer',
    defaultChildLimit: 20,
    latticeRows: Object.freeze([6, 7]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
    semanticRole: 'secondary-ground-transition-surface'
  }),

  irregularShorelineBand: Object.freeze({
    parentPrimitiveType: 'irregularShorelineBand',
    canonicalPrimitiveType: 'irregularShorelineBand',
    canonicalPrimitiveClassName: 'h-earth-primitive-irregular-shoreline-band',
    canonicalLandscapeClassName: 'h-earth-landscape-shoreline-band',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-shoreline-contact',
    canonicalMaterialKey: 'foam',
    canonicalLayerId: 'shoreline-foam-line-layer',
    defaultChildLimit: 24,
    latticeRows: Object.freeze([8, 9]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
    semanticRole: 'water-ground-contact-boundary'
  }),

  waterDepthBand: Object.freeze({
    parentPrimitiveType: 'waterDepthBand',
    canonicalPrimitiveType: 'waterDepthBand',
    canonicalPrimitiveClassName: 'h-earth-primitive-water-depth-band',
    canonicalLandscapeClassName: 'h-earth-landscape-water-band',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-nearshore-wave',
    canonicalMaterialKey: 'nearshoreWave',
    canonicalLayerId: 'nearshore-wave-band-layer',
    defaultChildLimit: 18,
    latticeRows: Object.freeze([10, 11]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.MIDGROUND,
    semanticRole: 'nearshore-water-depth-gradient'
  }),

  waterPlane: Object.freeze({
    parentPrimitiveType: 'waterPlane',
    canonicalPrimitiveType: 'waterPlane',
    canonicalPrimitiveClassName: 'h-earth-primitive-water-plane',
    canonicalLandscapeClassName: 'h-earth-landscape-water-plane',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-water-surface',
    canonicalMaterialKey: 'water',
    canonicalLayerId: 'water-surface-plane-layer',
    defaultChildLimit: 18,
    latticeRows: Object.freeze([12, 13]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
    semanticRole: 'water-surface-horizon-field'
  }),

  scatterCluster: Object.freeze({
    parentPrimitiveType: 'scatterCluster',
    canonicalPrimitiveType: 'scatterCluster',
    canonicalPrimitiveClassName: 'h-earth-primitive-scatter-cluster',
    canonicalLandscapeClassName: 'h-earth-landscape-surface-detail',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-ground-scatter-cluster',
    canonicalMaterialKey: 'tidePool',
    canonicalLayerId: 'tide-pools-stones-rocks-detail-layer',
    defaultChildLimit: 24,
    latticeRows: Object.freeze([1, 2, 3, 4, 5, 8, 9]),
    carryParentDescriptor: true,
    groundPlane: true,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
    semanticRole: 'ground-surface-detail-scatter'
  }),

  rockCluster: Object.freeze({
    parentPrimitiveType: 'rockCluster',
    canonicalPrimitiveType: 'rockCluster',
    canonicalPrimitiveClassName: 'h-earth-primitive-rock-cluster',
    canonicalLandscapeClassName: 'h-earth-landscape-rock-cluster',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-foreground-rocks',
    canonicalMaterialKey: 'jaggedRock',
    canonicalLayerId: 'tide-pools-stones-rocks-detail-layer',
    defaultChildLimit: 24,
    latticeRows: Object.freeze([1, 2, 3, 4, 5]),
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.NEAR_FOREGROUND,
    semanticRole: 'raised-rock-cluster-context'
  }),

  atmosphericLayer: Object.freeze({
    parentPrimitiveType: 'atmosphericLayer',
    canonicalPrimitiveType: 'atmosphericLayer',
    canonicalPrimitiveClassName: 'h-earth-primitive-atmospheric-layer',
    canonicalLandscapeClassName: 'h-earth-landscape-atmosphere',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-air-haze-light',
    canonicalMaterialKey: 'airHaze',
    canonicalLayerId: 'air-haze-light-layer',
    defaultChildLimit: 8,
    latticeRows: Object.freeze([16]),
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.SKY,
    semanticRole: 'air-light-atmospheric-context'
  }),

  layeredSilhouette: Object.freeze({
    parentPrimitiveType: 'layeredSilhouette',
    canonicalPrimitiveType: 'layeredSilhouette',
    canonicalPrimitiveClassName: 'h-earth-primitive-layered-silhouette',
    canonicalLandscapeClassName: 'h-earth-landscape-context-silhouette',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-manor-context',
    canonicalMaterialKey: 'manorContext',
    canonicalLayerId: 'manor-exterior-context-layer',
    defaultChildLimit: 10,
    latticeRows: Object.freeze([14, 15]),
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.BACKGROUND,
    semanticRole: 'distant-manor-exterior-context'
  }),

  distantCluster: Object.freeze({
    parentPrimitiveType: 'distantCluster',
    canonicalPrimitiveType: 'distantCluster',
    canonicalPrimitiveClassName: 'h-earth-primitive-distant-cluster',
    canonicalLandscapeClassName: 'h-earth-landscape-distant-cluster',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-distant-world-context',
    canonicalMaterialKey: 'distantRock',
    canonicalLayerId: 'distant-world-context-layer',
    defaultChildLimit: 10,
    latticeRows: Object.freeze([14, 15]),
    carryParentDescriptor: true,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.DISTANT,
    semanticRole: 'distant-world-boundary-context'
  }),

  inspectionAnchor: Object.freeze({
    parentPrimitiveType: 'inspectionAnchor',
    canonicalPrimitiveType: 'inspectionAnchor',
    canonicalPrimitiveClassName: 'h-earth-primitive-inspection-anchor',
    canonicalLandscapeClassName: 'h-earth-landscape-inspection-anchor',
    canonicalLandscapeFamilyClassName: 'h-earth-landscape-primary-inspection-anchor',
    canonicalMaterialKey: 'inspectionAnchor',
    canonicalLayerId: 'inspection-anchor-overlay-layer',
    defaultChildLimit: 1,
    latticeRows: Object.freeze([1, 2]),
    carryParentDescriptor: false,
    groundPlane: false,
    depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.OVERLAY,
    semanticRole: 'primary-ground-inspection-anchor'
  })
});

export const H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_NODE_PLAN = Object.freeze({
  contouredTerrainBand: Object.freeze([
    Object.freeze({ suffix: 'wet-sand-ground-base-plane', primitiveType: 'candidateWetSandGroundPlane', kind: 'GROUND_BASE', widthRatio: 1, heightRatio: 0.35, depthRatio: 1, count: 1, detailToken: 'ground-wet-sand-base-plane' }),
    Object.freeze({ suffix: 'wet-sand-contour-ridge', primitiveType: 'candidateWetSandContourRidge', kind: 'GROUND_CONTOUR', widthRatio: 0.42, heightRatio: 0.08, depthRatio: 0.08, count: 8, detailToken: 'ground-wet-sand-contour-ridge' }),
    Object.freeze({ suffix: 'wet-sand-moisture-patch', primitiveType: 'candidateWetSandMoisturePatch', kind: 'GROUND_PATCH', widthRatio: 0.22, heightRatio: 0.04, depthRatio: 0.1, count: 8, detailToken: 'ground-wet-sand-moisture-patch' }),
    Object.freeze({ suffix: 'wet-sand-reflective-sheen', primitiveType: 'candidateWetSandReflectiveSheen', kind: 'REFLECTIVE_SHEEN', widthRatio: 0.24, heightRatio: 0.025, depthRatio: 0.045, count: 5, detailToken: 'ground-wet-sand-reflective-sheen' }),
    Object.freeze({ suffix: 'wet-sand-grain-detail', primitiveType: 'candidateWetSandGrainDetail', kind: 'GROUND_GRAIN', widthRatio: 0.08, heightRatio: 0.03, depthRatio: 0.04, count: 6, detailToken: 'ground-wet-sand-grain-detail' })
  ]),

  terrainBand: Object.freeze([
    Object.freeze({ suffix: 'dry-sand-ground-base-plane', primitiveType: 'candidateDrySandGroundPlane', kind: 'GROUND_BASE', widthRatio: 1, heightRatio: 0.28, depthRatio: 1, count: 1, detailToken: 'ground-dry-sand-base-plane' }),
    Object.freeze({ suffix: 'dry-sand-transition-ridge', primitiveType: 'candidateDrySandTransitionRidge', kind: 'GROUND_CONTOUR', widthRatio: 0.32, heightRatio: 0.07, depthRatio: 0.08, count: 6, detailToken: 'ground-dry-sand-transition-ridge' }),
    Object.freeze({ suffix: 'dry-sand-surface-patch', primitiveType: 'candidateDrySandSurfacePatch', kind: 'GROUND_PATCH', widthRatio: 0.14, heightRatio: 0.04, depthRatio: 0.08, count: 8, detailToken: 'ground-dry-sand-surface-patch' })
  ]),

  irregularShorelineBand: Object.freeze([
    Object.freeze({ suffix: 'shoreline-contact-base', primitiveType: 'candidateShorelineContactBase', kind: 'SHORELINE_BASE', widthRatio: 1, heightRatio: 0.22, depthRatio: 0.45, count: 1, detailToken: 'shoreline-contact-base' }),
    Object.freeze({ suffix: 'shoreline-irregular-edge', primitiveType: 'candidateShorelineIrregularEdge', kind: 'SHORELINE_EDGE', widthRatio: 0.12, heightRatio: 0.025, depthRatio: 0.035, count: 6, detailToken: 'shoreline-irregular-edge' }),
    Object.freeze({ suffix: 'shoreline-foam-break', primitiveType: 'candidateShorelineFoamBreak', kind: 'SHORELINE_FOAM', widthRatio: 0.11, heightRatio: 0.025, depthRatio: 0.04, count: 16, detailToken: 'shoreline-foam-break' })
  ]),

  waterDepthBand: Object.freeze([
    Object.freeze({ suffix: 'nearshore-water-depth-base', primitiveType: 'candidateNearshoreWaterDepthBase', kind: 'WATER_BASE', widthRatio: 1, heightRatio: 0.18, depthRatio: 0.8, count: 1, detailToken: 'water-nearshore-depth-base' }),
    Object.freeze({ suffix: 'nearshore-ripple-strip', primitiveType: 'candidateNearshoreRippleStrip', kind: 'WATER_RIPPLE', widthRatio: 0.18, heightRatio: 0.025, depthRatio: 0.04, count: 12, detailToken: 'water-nearshore-ripple-strip' })
  ]),

  waterPlane: Object.freeze([
    Object.freeze({ suffix: 'water-surface-base-plane', primitiveType: 'candidateWaterSurfacePlane', kind: 'WATER_BASE', widthRatio: 1, heightRatio: 0.25, depthRatio: 1, count: 1, detailToken: 'water-surface-base-plane' }),
    Object.freeze({ suffix: 'water-depth-band', primitiveType: 'candidateWaterDepthBand', kind: 'WATER_DEPTH', widthRatio: 0.24, heightRatio: 0.025, depthRatio: 0.08, count: 10, detailToken: 'water-depth-band' }),
    Object.freeze({ suffix: 'water-reflection-strip', primitiveType: 'candidateWaterReflectionStrip', kind: 'WATER_REFLECTION', widthRatio: 0.18, heightRatio: 0.02, depthRatio: 0.035, count: 6, detailToken: 'water-reflection-strip' })
  ]),

  scatterCluster: Object.freeze([
    Object.freeze({ suffix: 'surface-scatter-member', primitiveType: 'candidateSurfaceScatterMember', kind: 'SCATTER_MEMBER', widthRatio: 0.08, heightRatio: 0.04, depthRatio: 0.05, count: 24, detailToken: 'ground-surface-scatter-member' })
  ]),

  rockCluster: Object.freeze([
    Object.freeze({ suffix: 'rock-cluster-member', primitiveType: 'candidateRockClusterMember', kind: 'ROCK_MEMBER', widthRatio: 0.09, heightRatio: 0.13, depthRatio: 0.08, count: 24, detailToken: 'rock-cluster-member' })
  ]),

  atmosphericLayer: Object.freeze([
    Object.freeze({ suffix: 'air-haze-panel', primitiveType: 'candidateAirHazePanel', kind: 'AIR_HAZE', widthRatio: 1, heightRatio: 1, depthRatio: 0.2, count: 1, detailToken: 'air-haze-panel' }),
    Object.freeze({ suffix: 'air-light-band', primitiveType: 'candidateAirLightBand', kind: 'AIR_LIGHT', widthRatio: 0.28, heightRatio: 0.08, depthRatio: 0.04, count: 4, detailToken: 'air-light-band' })
  ]),

  layeredSilhouette: Object.freeze([
    Object.freeze({ suffix: 'manor-context-body', primitiveType: 'candidateManorContextBody', kind: 'SILHOUETTE_BODY', widthRatio: 0.5, heightRatio: 0.8, depthRatio: 0.2, count: 1, detailToken: 'manor-context-body' }),
    Object.freeze({ suffix: 'manor-context-roof', primitiveType: 'candidateManorContextRoof', kind: 'SILHOUETTE_ROOF', widthRatio: 0.62, heightRatio: 0.18, depthRatio: 0.16, count: 1, detailToken: 'manor-context-roof' }),
    Object.freeze({ suffix: 'manor-context-vertical-segment', primitiveType: 'candidateManorContextVerticalSegment', kind: 'SILHOUETTE_BODY', widthRatio: 0.08, heightRatio: 0.5, depthRatio: 0.08, count: 3, detailToken: 'manor-context-vertical-segment' })
  ]),

  distantCluster: Object.freeze([
    Object.freeze({ suffix: 'distant-world-silhouette', primitiveType: 'candidateDistantWorldSilhouette', kind: 'DISTANT_CONTEXT', widthRatio: 0.45, heightRatio: 0.65, depthRatio: 0.12, count: 10, detailToken: 'distant-world-context-form' })
  ]),

  inspectionAnchor: Object.freeze([
    Object.freeze({ suffix: 'primary-inspection-anchor-marker', primitiveType: 'candidateInspectionAnchorMarker', kind: 'INSPECTION_ANCHOR', widthRatio: 1, heightRatio: 1, depthRatio: 1, count: 1, detailToken: 'primary-inspection-anchor-marker' })
  ])
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

export function uniqueHEarthClassNames(classNames = []) {
  const seen = new Set();

  return Object.freeze(
    (Array.isArray(classNames) ? classNames : [classNames])
      .flatMap((value) => Array.isArray(value) ? value : String(value || '').split(/\s+/))
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .filter((value) => {
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      })
  );
}

export function joinHEarthClassNames(classNames = []) {
  return uniqueHEarthClassNames(classNames).join(' ');
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

export function resolveHEarthGeometryParentPrimitiveType(node = {}) {
  return (
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    resolveHEarthGeometryPrimitiveType(node)
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

export function resolveHEarthGeometrySourceObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthGeometryObjectId(node, fallbackIndex)
  );
}

export function resolveHEarthGeometryParentObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthGeometryObjectId(node, fallbackIndex)
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

export function resolveHEarthGeometrySourceNodeId(node = {}, fallbackIndex = 0) {
  return (
    node.sourceNodeId ||
    node.parentNodeId ||
    node.geometryParentNodeId ||
    node.geometryExpansion?.parentNodeId ||
    resolveHEarthGeometryNodeId(node, fallbackIndex)
  );
}

export function resolveHEarthGeometryParentNodeId(node = {}, fallbackIndex = 0) {
  return (
    node.parentNodeId ||
    node.geometryParentNodeId ||
    node.geometryExpansion?.parentNodeId ||
    node.sourceNodeId ||
    resolveHEarthGeometryNodeId(node, fallbackIndex)
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

export function resolveHEarthGeometryMaterialKey(node = {}) {
  const primitiveType = resolveHEarthGeometryParentPrimitiveType(node);
  const profile = H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP[primitiveType];

  return (
    node.materialKey ||
    node.materialToken?.materialKey ||
    node.material?.materialKey ||
    node.sourceObject?.materialKey ||
    node.sourceObject?.materialToken?.materialKey ||
    node.sourceObject?.materialIdentity?.materialKey ||
    profile?.canonicalMaterialKey ||
    'unresolved'
  );
}

export function resolveHEarthGeometryLayerId(node = {}) {
  const primitiveType = resolveHEarthGeometryParentPrimitiveType(node);
  const profile = H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP[primitiveType];

  return (
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    node.sourceObject?.layerId ||
    profile?.canonicalLayerId ||
    'unclassified-render-layer'
  );
}

export function resolveHEarthGeometryLayerOrder(node = {}) {
  const primitiveType = resolveHEarthGeometryParentPrimitiveType(node);

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
  const primitiveType = resolveHEarthGeometryParentPrimitiveType(node);

  return (
    node.geometryDepthZone ||
    node.depthZone ||
    node.sourceObject?.geometryDepthZone ||
    node.sourceObject?.depthZone ||
    H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP[primitiveType]?.depthZone ||
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

export function resolveHEarthGeometryCanonicalProfile(node = {}) {
  const primitiveType = resolveHEarthGeometryParentPrimitiveType(node);

  return (
    H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP[primitiveType] ||
    Object.freeze({
      parentPrimitiveType: primitiveType,
      canonicalPrimitiveType: primitiveType,
      canonicalPrimitiveClassName: `h-earth-primitive-${normalizeHEarthGeometryToken(primitiveType)}`,
      canonicalLandscapeClassName: 'h-earth-landscape-generic-candidate',
      canonicalLandscapeFamilyClassName: 'h-earth-landscape-generic-candidate',
      canonicalMaterialKey: resolveHEarthGeometryMaterialKey(node),
      canonicalLayerId: resolveHEarthGeometryLayerId(node),
      defaultChildLimit:
        H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS.fallbackChildLimit,
      latticeRows: Object.freeze([1, 2, 3, 4]),
      carryParentDescriptor: true,
      groundPlane: false,
      depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE.FOREGROUND,
      semanticRole: 'generic-candidate-context'
    })
  );
}

export function resolveHEarthGeometryMaterialClassName(materialKey) {
  return (
    H_EARTH_3D_RENDER_GEOMETRY_MATERIAL_CLASS_MAP[materialKey] ||
    H_EARTH_3D_RENDER_GEOMETRY_MATERIAL_CLASS_MAP.unresolved
  );
}

export function resolveHEarthGeometryLayerClasses(layerId) {
  return (
    H_EARTH_3D_RENDER_GEOMETRY_LAYER_CLASS_MAP[layerId] ||
    H_EARTH_3D_RENDER_GEOMETRY_LAYER_CLASS_MAP['unclassified-render-layer']
  );
}

export function isHEarthAlreadyExpandedGeometryNode(node = {}) {
  return (
    node.geometryExpanded === true ||
    node.candidateGeometryOnly === true ||
    isHEarthPlainObject(node.geometryExpansion)
  );
}

export function extractHEarthLandscapeLatticeBundle(input = {}, context = {}) {
  const candidates = [
    context.landscapeLattice,
    context.lattice,
    context.landscapeLatticeBundle,
    context.H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP,
    input.landscapeLattice,
    input.lattice,
    input.landscapeLatticeBundle,
    input.H_EARTH_256_LATTICE_LANDSCAPE_DIMENSION_MAP
  ];

  const bundle = candidates.find(Boolean) || null;

  if (bundle && isHEarthPlainObject(bundle) && isHEarthPlainObject(bundle.map)) {
    return Object.freeze({
      map: bundle.map,
      receipt: bundle.receipt || null,
      rowOrientation: bundle.rowOrientation || null,
      regionSummary: bundle.regionSummary || null,
      inspectionAddressSummary: bundle.inspectionAddressSummary || null,
      compatibilityCheck: bundle.compatibilityCheck || null,
      source: bundle.source || 'lattice-bundle'
    });
  }

  if (bundle && isHEarthPlainObject(bundle)) {
    return Object.freeze({
      map: bundle,
      receipt: context.landscapeLatticeReceipt || input.landscapeLatticeReceipt || null,
      rowOrientation: context.landscapeLatticeRowOrientation || input.landscapeLatticeRowOrientation || null,
      regionSummary: context.landscapeLatticeRegionSummary || input.landscapeLatticeRegionSummary || null,
      inspectionAddressSummary: context.latticeInspectionAddressSummary || input.latticeInspectionAddressSummary || null,
      compatibilityCheck: context.latticeCompatibilityCheck || input.latticeCompatibilityCheck || null,
      source: 'plain-lattice-map'
    });
  }

  return Object.freeze({
    map: Object.freeze({}),
    receipt: null,
    rowOrientation: null,
    regionSummary: null,
    inspectionAddressSummary: null,
    compatibilityCheck: null,
    source: 'no-lattice-supplied'
  });
}

export function buildHEarthGeometryLatticeAdmissionReceipt(input = {}, context = {}) {
  const bundle = extractHEarthLandscapeLatticeBundle(input, context);
  const records = Object.values(bundle.map || {}).filter(isHEarthPlainObject);

  const rowSet = new Set(records.map((record) => record.row));
  const columnSet = new Set(records.map((record) => record.column));

  const addressCount = records.length;
  const rowCount = rowSet.size;
  const columnCount = columnSet.size;

  const foregroundRows01To05 = [1, 2, 3, 4, 5].every((row) => rowSet.has(row));
  const drySandRows06To07 = [6, 7].every((row) => rowSet.has(row));
  const shorelineRows08To09 = [8, 9].every((row) => rowSet.has(row));
  const nearshoreRows10To11 = [10, 11].every((row) => rowSet.has(row));
  const waterRows12To13 = [12, 13].every((row) => rowSet.has(row));
  const horizonRows14To16 = [14, 15, 16].every((row) => rowSet.has(row));

  const rowOrientationPreserved =
    bundle.rowOrientation?.semanticAlignmentWith031C === true ||
    bundle.rowOrientation?.rowOrientationPreserved === true ||
    (
      foregroundRows01To05 === true &&
      horizonRows14To16 === true &&
      drySandRows06To07 === true &&
      shorelineRows08To09 === true &&
      nearshoreRows10To11 === true &&
      waterRows12To13 === true
    );

  const failureCodes = [];
  const warningCodes = [];

  if (!bundle.receipt) {
    failureCodes.push('LANDSCAPE_LATTICE_RECEIPT_MISSING');
  }

  if (addressCount !== 256) {
    failureCodes.push('LANDSCAPE_LATTICE_ADDRESS_COUNT_MISMATCH');
  }

  if (rowCount !== 16) {
    failureCodes.push('LANDSCAPE_LATTICE_ROW_COUNT_MISMATCH');
  }

  if (columnCount !== 16) {
    failureCodes.push('LANDSCAPE_LATTICE_COLUMN_COUNT_MISMATCH');
  }

  if (rowOrientationPreserved !== true) {
    failureCodes.push('LANDSCAPE_LATTICE_ROW_ORIENTATION_NOT_PRESERVED');
  }

  const latticeAdmitted = failureCodes.length === 0;

  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_LATTICE_ADMISSION_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,

    sourceLandscapeLatticeFile:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeFile,
    sourceLandscapeLatticeContract:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeContract,

    latticeSource: bundle.source,
    latticeReceiptPresent: Boolean(bundle.receipt),
    sourceLandscapeLatticeReceipt: bundle.receipt,

    addressCount,
    addressCountExpected: 256,
    addressCountMatchesExpected: addressCount === 256,

    rowCount,
    rowCountExpected: 16,
    rowCountMatchesExpected: rowCount === 16,

    columnCount,
    columnCountExpected: 16,
    columnCountMatchesExpected: columnCount === 16,

    rowOrientationPreserved,
    foregroundRows01To05,
    drySandRows06To07,
    shorelineRows08To09,
    nearshoreRows10To11,
    waterRows12To13,
    horizonRows14To16,

    regionSummaryPresent: Boolean(bundle.regionSummary),
    inspectionAddressSummaryPresent: Boolean(bundle.inspectionAddressSummary),
    compatibilityCheckPresent: Boolean(bundle.compatibilityCheck),

    latticeAdmitted,
    descriptorLandscapeLatticeAdmitted: latticeAdmitted,
    geometryLatticeAdmissionStatus: latticeAdmitted ? 'ADMITTED' : 'REJECTED',
    silentFallbackAllowed: false,
    failClosedOnAdmissionFailure: true,

    runtimeLatticeActivation: false,
    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
    traversalGridClaim: false,
    collisionGridClaim: false,
    physicsGridClaim: false,
    gameplayGridClaim: false,
    survivalGridClaim: false,

    rendererGeometryClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,

    warningCodes: Object.freeze(warningCodes),
    failureCodes: Object.freeze(failureCodes),
    claimBoundaryPreserved: true
  });
}

export function getHEarthGeometryLandscapeLatticeMapSafe(input = {}, context = {}) {
  return extractHEarthLandscapeLatticeBundle(input, context).map || Object.freeze({});
}

export function getHEarthGeometryLandscapeLatticeReceiptSafe(input = {}, context = {}) {
  return extractHEarthLandscapeLatticeBundle(input, context).receipt || null;
}

export function getHEarthGeometryLandscapeLatticeRecords(input = {}, context = {}) {
  return Object.freeze(
    Object.values(getHEarthGeometryLandscapeLatticeMapSafe(input, context)).filter(
      isHEarthPlainObject
    )
  );
}

export function resolveHEarthObjectHintIds(node = {}) {
  return Object.freeze([
    resolveHEarthGeometryObjectId(node),
    node.sourceObjectId,
    node.parentObjectId,
    node.sourceObject?.objectId,
    node.geometryExpansion?.parentObjectId
  ].filter(Boolean));
}

export function resolveHEarthLatticeRecordsForNode(node = {}, input = {}, context = {}) {
  const profile = resolveHEarthGeometryCanonicalProfile(node);
  const objectHintIds = resolveHEarthObjectHintIds(node);
  const records = getHEarthGeometryLandscapeLatticeRecords(input, context);

  const hinted = records.filter((record) =>
    Array.isArray(record.objectHints) &&
    record.objectHints.some((hint) => {
      if (typeof hint === 'string') return objectHintIds.includes(hint);
      return objectHintIds.includes(hint?.objectId);
    })
  );

  if (hinted.length > 0) {
    return Object.freeze(hinted);
  }

  const rowFiltered = records.filter((record) =>
    Array.isArray(profile.latticeRows) && profile.latticeRows.includes(record.row)
  );

  return Object.freeze(rowFiltered);
}

export function resolveHEarthLatticeGuidanceForNode(node = {}, input = {}, context = {}) {
  const records = resolveHEarthLatticeRecordsForNode(node, input, context);
  const addressCount = records.length;
  const rows = Object.freeze([...new Set(records.map((record) => record.row))]);
  const columns = Object.freeze([...new Set(records.map((record) => record.column))]);

  const average = (values, fallback = 0) => {
    const safe = values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (safe.length === 0) return fallback;
    return safe.reduce((sum, value) => sum + value, 0) / safe.length;
  };

  const densityHint = average(
    records.map((record) => record.renderHintDescriptorOnly?.densityHint),
    0.5
  );

  const visualPriorityHint = average(
    records.map((record) => record.renderHintDescriptorOnly?.visualPriorityHint),
    0.5
  );

  const renderPriorityHint = average(
    records.map((record) => record.renderHintDescriptorOnly?.renderPriorityHint),
    50
  );

  const inspectionWeight = average(
    records.map((record) => record.renderHintDescriptorOnly?.inspectionWeight),
    0.15
  );

  const centerRow = average(rows, 8);
  const centerColumn = average(columns, 8);

  return Object.freeze({
    records,
    addressCount,
    rows,
    columns,
    centerRow,
    centerColumn,
    normalizedRow: clampHEarthGeometryNumber((centerRow - 1) / 15, 0, 1, 0.5),
    normalizedColumn: clampHEarthGeometryNumber((centerColumn - 1) / 15, 0, 1, 0.5),
    densityHint,
    visualPriorityHint,
    renderPriorityHint,
    inspectionWeight,
    primaryRegionId: records[0]?.regionId || null,
    primarySurfaceFamily: records[0]?.surfaceFamily || null,
    primaryMaterialKey: records[0]?.materialKey || null,
    primaryPrimitiveIntent: records[0]?.primitiveIntent || null,
    rowOrientationPreserved: true,
    descriptorOnly: true,
    runtimeLatticeActivation: false,
    rendererGeometryClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function selectHEarthLatticeRecordsForPart(
  parentNode,
  part,
  partIndex,
  totalPartCount,
  input = {},
  context = {}
) {
  const guidance = resolveHEarthLatticeGuidanceForNode(parentNode, input, context);
  const records = guidance.records;

  if (records.length === 0) {
    return Object.freeze([]);
  }

  if (part.count === 1) {
    return Object.freeze([records[Math.floor(records.length / 2)]]);
  }

  const bucketSize = Math.max(1, Math.floor(records.length / Math.max(1, totalPartCount)));
  const start = Math.min(records.length - 1, partIndex * bucketSize);
  const end = Math.min(records.length, start + bucketSize);

  return Object.freeze(records.slice(start, end));
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

    latticeAddress: override.latticeAddress || null,
    latticeRow: override.latticeRow ?? null,
    latticeColumn: override.latticeColumn ?? null,

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
  const profile = resolveHEarthGeometryCanonicalProfile(parentNode);
  const parentGeometry = parentNode.primitiveGeometry || {};
  const parentExtent = resolveHEarthGeometryExtent(parentNode);
  const extent = transform?.extent || parentExtent;
  const normalizedDepth =
    transform?.normalizedPosition?.normalizedDepth ??
    resolveHEarthGeometryNormalizedDepth(parentNode);
  const depthClass = override.depthClass || resolveHEarthGeometryDepthClass(parentNode);
  const detailToken = normalizeHEarthGeometryToken(
    override.detailToken || primitiveType,
    'generic-candidate'
  );

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

  const detailPrimitiveClassName =
    override.detailPrimitiveClassName || `h-earth-primitive-${detailToken}`;
  const detailLandscapeClassName =
    override.detailLandscapeClassName || `h-earth-landscape-${detailToken}`;
  const geometryProfileClassName =
    override.profileClassName || `h-earth-geometry-${detailToken}`;

  return Object.freeze({
    primitiveType,
    depthClass,
    depthZone: override.depthZone || profile.depthZone,
    semanticRole: override.semanticRole || profile.semanticRole,
    normalizedDepth,

    profileId: override.profileId || `${detailToken}-candidate-profile`,
    profileClassName: geometryProfileClassName,

    canonicalPrimitiveType: profile.canonicalPrimitiveType,
    canonicalPrimitiveClassName: profile.canonicalPrimitiveClassName,
    canonicalLandscapeClassName: profile.canonicalLandscapeClassName,
    canonicalLandscapeFamilyClassName: profile.canonicalLandscapeFamilyClassName,
    detailPrimitiveClassName,
    detailLandscapeClassName,
    landscapeClassName: profile.canonicalLandscapeClassName,

    groundPlane: override.groundPlane === true || profile.groundPlane === true,
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
      source: 'geometry-lattice-admission-gated-port'
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

export function resolveHEarthGeometryRenumerizedClassContract({
  parentNode,
  childNodeKind,
  primitiveType,
  materialKey,
  layerId,
  geometryProfileClassName,
  detailPrimitiveClassName,
  detailLandscapeClassName
} = {}) {
  const profile = resolveHEarthGeometryCanonicalProfile(parentNode);

  const resolvedMaterialKey =
    materialKey ||
    resolveHEarthGeometryMaterialKey(parentNode) ||
    profile.canonicalMaterialKey ||
    'unresolved';

  const canonicalMaterialKey =
    profile.canonicalMaterialKey || resolvedMaterialKey || 'unresolved';

  const canonicalMaterialClassName =
    resolveHEarthGeometryMaterialClassName(canonicalMaterialKey);
  const materialClassName = resolveHEarthGeometryMaterialClassName(resolvedMaterialKey);

  const resolvedLayerId =
    layerId ||
    resolveHEarthGeometryLayerId(parentNode) ||
    profile.canonicalLayerId ||
    'unclassified-render-layer';

  const layerClasses = resolveHEarthGeometryLayerClasses(resolvedLayerId);
  const geometryNodeClassName = `h-earth-geometry-node-${normalizeHEarthGeometryToken(
    childNodeKind,
    'generic'
  )}`;
  const geometryRoleClassName = `h-earth-geometry-role-${normalizeHEarthGeometryToken(
    profile.semanticRole,
    'generic-role'
  )}`;

  const classNames = uniqueHEarthClassNames([
    canonicalMaterialClassName,
    materialClassName,
    profile.canonicalPrimitiveClassName,
    detailPrimitiveClassName,
    profile.canonicalLandscapeClassName,
    profile.canonicalLandscapeFamilyClassName,
    detailLandscapeClassName,
    geometryProfileClassName,
    geometryNodeClassName,
    geometryRoleClassName,
    'h-earth-layer-member',
    layerClasses.layerMemberClassName
  ]);

  return Object.freeze({
    canonicalMaterialKey,
    materialKey: resolvedMaterialKey,

    canonicalMaterialClassName,
    materialClassName,

    canonicalPrimitiveType: profile.canonicalPrimitiveType,
    canonicalPrimitiveClassName: profile.canonicalPrimitiveClassName,
    primitiveClassName: profile.canonicalPrimitiveClassName,
    detailPrimitiveClassName,

    canonicalLandscapeClassName: profile.canonicalLandscapeClassName,
    canonicalLandscapeFamilyClassName: profile.canonicalLandscapeFamilyClassName,
    landscapeClassName: profile.canonicalLandscapeClassName,
    detailLandscapeClassName,

    geometryProfileClassName,
    geometryNodeClassName,
    geometryRoleClassName,

    layerId: resolvedLayerId,
    layerClassName: layerClasses.layerClassName,
    layerMemberClassName: layerClasses.layerMemberClassName,
    layerMembershipClassNames: Object.freeze([
      'h-earth-layer-member',
      layerClasses.layerMemberClassName
    ]),

    renumerizedClassNames: classNames,
    renumerizedClassName: joinHEarthClassNames(classNames),

    visualGrammarReadyDescriptor: true,
    classReadyDescriptor: true,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthExpandedGeometryNode(parentNode, config = {}) {
  const profile = resolveHEarthGeometryCanonicalProfile(parentNode);
  const parentObjectId = resolveHEarthGeometryObjectId(parentNode);
  const parentNodeId = resolveHEarthGeometryNodeId(parentNode);

  const childIndex =
    config.index === null || config.index === undefined ? null : Number(config.index);

  const suffix = config.suffix || 'geometry';
  const geometryNodeKind =
    config.geometryNodeKind || H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GENERIC;
  const primitiveType =
    config.primitiveType || resolveHEarthGeometryPrimitiveType(parentNode);
  const materialKey =
    config.materialKey ||
    resolveHEarthGeometryMaterialKey(parentNode) ||
    profile.canonicalMaterialKey;
  const depthClass = config.depthClass || resolveHEarthGeometryDepthClass(parentNode);
  const depthZone = config.depthZone || profile.depthZone;
  const normalizedDepth = clampHEarthGeometryNumber(
    config.normalizedDepth,
    0,
    1,
    resolveHEarthGeometryNormalizedDepth(parentNode)
  );

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
      normalizedDepth,
      detailToken: config.detailToken || config.geometry?.detailToken || suffix
    }
  );

  const layerId =
    config.layerId ||
    resolveHEarthGeometryLayerId(parentNode) ||
    profile.canonicalLayerId ||
    'unclassified-render-layer';

  const classContract = resolveHEarthGeometryRenumerizedClassContract({
    parentNode,
    childNodeKind: geometryNodeKind,
    primitiveType,
    materialKey,
    layerId,
    geometryProfileClassName: primitiveGeometry.profileClassName,
    detailPrimitiveClassName: primitiveGeometry.detailPrimitiveClassName,
    detailLandscapeClassName: primitiveGeometry.detailLandscapeClassName
  });

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
    canonicalMaterialKey: classContract.canonicalMaterialKey,

    layerId: classContract.layerId,
    layerOrder: normalizeHEarthGeometryNumber(
      config.layerOrder,
      resolveHEarthGeometryLayerOrder(parentNode)
    ),

    geometryExpansion: Object.freeze({
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      sourceLandscapeLatticeContract:
        H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeContract,

      expandedFromParent: true,
      parentCarryNode: false,
      geometryNodeKind,
      parentObjectId,
      parentNodeId,
      parentPrimitiveType: resolveHEarthGeometryPrimitiveType(parentNode),
      parentMaterialKey: resolveHEarthGeometryMaterialKey(parentNode),
      parentDepthClass: resolveHEarthGeometryDepthClass(parentNode),
      parentDepthZone: resolveHEarthGeometryDepthZone(parentNode),

      latticeAddress: config.latticeAddress || transform.latticeAddress || null,
      latticeRow: config.latticeRow ?? transform.latticeRow ?? null,
      latticeColumn: config.latticeColumn ?? transform.latticeColumn ?? null,
      latticeRegionId: config.latticeRegionId || null,
      latticeSurfaceFamily: config.latticeSurfaceFamily || null,

      childPrimitiveType: primitiveType,
      childMaterialKey: materialKey,
      childDepthZone: primitiveGeometry.depthZone,
      semanticRole: primitiveGeometry.semanticRole,
      geometryChildIndex: childIndex,

      canonicalMaterialKey: classContract.canonicalMaterialKey,
      canonicalMaterialClassName: classContract.canonicalMaterialClassName,
      canonicalPrimitiveClassName: classContract.canonicalPrimitiveClassName,
      canonicalLandscapeClassName: classContract.canonicalLandscapeClassName,
      layerMemberClassName: classContract.layerMemberClassName,

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

    canonicalMaterialClassName: classContract.canonicalMaterialClassName,
    materialClassName: classContract.materialClassName,

    canonicalPrimitiveType: classContract.canonicalPrimitiveType,
    canonicalPrimitiveClassName: classContract.canonicalPrimitiveClassName,
    primitiveClassName: classContract.primitiveClassName,
    detailPrimitiveClassName: classContract.detailPrimitiveClassName,

    canonicalLandscapeClassName: classContract.canonicalLandscapeClassName,
    canonicalLandscapeFamilyClassName:
      classContract.canonicalLandscapeFamilyClassName,
    landscapeClassName: classContract.landscapeClassName,
    detailLandscapeClassName: classContract.detailLandscapeClassName,

    geometryProfileClassName: classContract.geometryProfileClassName,
    geometryNodeClassName: classContract.geometryNodeClassName,
    geometryRoleClassName: classContract.geometryRoleClassName,

    layerClassName: classContract.layerClassName,
    layerMemberClassName: classContract.layerMemberClassName,
    layerMembershipClassNames: classContract.layerMembershipClassNames,

    renumerizedClassNames: classContract.renumerizedClassNames,
    renumerizedClassName: classContract.renumerizedClassName,
    geometryClassNames: classContract.renumerizedClassNames,
    geometryClassName: classContract.renumerizedClassName,

    renderWidthPx: primitiveGeometry.widthPx,
    renderHeightPx: primitiveGeometry.heightPx,
    renderDepthPx: primitiveGeometry.depthPx,

    normalizedDepth: primitiveGeometry.normalizedDepth,
    depthClass: primitiveGeometry.depthClass,
    primaryDepthClass: primitiveGeometry.depthClass,
    geometryDepthZone: primitiveGeometry.depthZone,
    semanticRole: primitiveGeometry.semanticRole,

    sourceObject: parentNode.sourceObject || parentNode,

    descriptorOnly: false,
    candidateGeometryOnly: true,
    visualGrammarReadyDescriptor: true,
    classReadyDescriptor: true,

    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthParentCarryGeometryNode(parentNode, index = 0) {
  const profile = resolveHEarthGeometryCanonicalProfile(parentNode);
  const parentObjectId = resolveHEarthGeometryObjectId(parentNode, index);
  const parentNodeId = resolveHEarthGeometryNodeId(parentNode, index);
  const layerId = resolveHEarthGeometryLayerId(parentNode);

  const classContract = resolveHEarthGeometryRenumerizedClassContract({
    parentNode,
    childNodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.PARENT,
    primitiveType: profile.canonicalPrimitiveType,
    materialKey: resolveHEarthGeometryMaterialKey(parentNode),
    layerId,
    geometryProfileClassName: `h-earth-geometry-parent-${normalizeHEarthGeometryToken(profile.parentPrimitiveType, 'descriptor')}`,
    detailPrimitiveClassName: `h-earth-primitive-parent-${normalizeHEarthGeometryToken(profile.parentPrimitiveType, 'descriptor')}`,
    detailLandscapeClassName: `h-earth-landscape-parent-${normalizeHEarthGeometryToken(profile.parentPrimitiveType, 'descriptor')}`
  });

  return Object.freeze({
    ...parentNode,

    nodeId: `${parentNodeId}__parent-descriptor`,
    sourceNodeId: parentNodeId,
    composedNodeId: parentNode.composedNodeId || null,

    objectId: `${parentObjectId}__PARENT_DESCRIPTOR`,
    sourceObjectId: parentObjectId,
    parentObjectId,
    parentNodeId,

    objectLabel: `${resolveHEarthGeometryLabel(parentNode, index)} Parent Descriptor`,
    label: `${resolveHEarthGeometryLabel(parentNode, index)} Parent Descriptor`,

    ...classContract,

    layerId: classContract.layerId,
    geometryExpansion: Object.freeze({
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      sourceLandscapeLatticeContract:
        H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeContract,

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

    geometryDepthZone: profile.depthZone,
    semanticRole: profile.semanticRole,

    descriptorOnly: true,
    candidateGeometryOnly: true,
    visualGrammarReadyDescriptor: true,
    classReadyDescriptor: true,

    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthLatticeDrivenChildNodesForPart(
  parentNode,
  part,
  partIndex,
  totalPartCount,
  input = {},
  context = {}
) {
  const records = selectHEarthLatticeRecordsForPart(
    parentNode,
    part,
    partIndex,
    totalPartCount,
    input,
    context
  );

  const profile = resolveHEarthGeometryCanonicalProfile(parentNode);
  const guidance = resolveHEarthLatticeGuidanceForNode(parentNode, input, context);

  if (records.length === 0) {
    throw new Error('ADMITTED_LATTICE_RECORDS_MISSING_FOR_PARENT_NODE');
  }

  const targetCount = Math.max(
    1,
    Math.min(
      part.count,
      Math.ceil(part.count * Math.max(0.35, guidance.densityHint))
    )
  );

  return Object.freeze(
    Array.from({ length: targetCount }, (_, index) => {
      const record = records[index % records.length];
      const columnNormalized = clampHEarthGeometryNumber((record.column - 1) / 15, 0, 1, 0.5);
      const rowNormalized = clampHEarthGeometryNumber((record.row - 1) / 15, 0, 1, 0.5);
      const centeredX = columnNormalized - 0.5;
      const centeredZ = 0.5 - rowNormalized;
      const density = normalizeHEarthGeometryNumber(
        record.renderHintDescriptorOnly?.densityHint,
        guidance.densityHint
      );
      const visualPriority = normalizeHEarthGeometryNumber(
        record.renderHintDescriptorOnly?.visualPriorityHint,
        guidance.visualPriorityHint
      );
      const inspectionWeight = normalizeHEarthGeometryNumber(
        record.renderHintDescriptorOnly?.inspectionWeight,
        guidance.inspectionWeight
      );

      const side = index % 2 === 0 ? -1 : 1;
      const wave = ((index % 5) - 2) / 5;

      return createHEarthExpandedGeometryNode(parentNode, {
        suffix: part.suffix,
        index,
        primitiveType: part.primitiveType,
        materialKey: record.materialKey || profile.canonicalMaterialKey,
        geometryNodeKind:
          H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND[part.kind] ||
          H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND.GENERIC,
        latticeAddress: record.address,
        latticeRow: record.row,
        latticeColumn: record.column,
        latticeRegionId: record.regionId,
        latticeSurfaceFamily: record.surfaceFamily,
        label: `${resolveHEarthGeometryLabel(parentNode)} ${String(part.suffix).replace(/[-_]+/g, ' ')} ${index + 1}`,
        transform: {
          localOffset: {
            x: centeredX * 1.25 + wave * 0.08,
            y: inspectionWeight * 0.08,
            z: centeredZ * 1.25 + side * density * 0.08
          },
          localRotate: {
            x: 0,
            y: side * visualPriority * 4,
            z: centeredX * 8
          },
          localScale: Math.max(0.06, 0.18 + density * 0.28 + visualPriority * 0.12),
          extentScale: Math.max(0.04, 0.08 + density * 0.18 + visualPriority * 0.08),
          normalizedDepth: rowNormalized,
          nx: columnNormalized,
          ny: rowNormalized,
          nz: rowNormalized,
          latticeAddress: record.address,
          latticeRow: record.row,
          latticeColumn: record.column
        },
        geometry: {
          profileId: `${part.detailToken}-lattice-guided`,
          profileClassName: `h-earth-geometry-${part.detailToken}`,
          detailPrimitiveClassName: `h-earth-primitive-${part.detailToken}`,
          detailLandscapeClassName: `h-earth-landscape-${part.detailToken}`,
          detailToken: part.detailToken,
          semanticRole: `${profile.semanticRole}-${part.detailToken}`,
          groundPlane: profile.groundPlane === true,
          widthRatio: part.widthRatio,
          heightRatio: part.heightRatio,
          depthRatio: part.depthRatio,
          scalar: Math.max(0.08, 0.2 + density * 0.4)
        }
      });
    })
  );
}

export function expandHEarthGeometryNodeByPrimitive(parentNode, input = {}, context = {}) {
  const primitiveType = resolveHEarthGeometryPrimitiveType(parentNode);
  const plan =
    H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_NODE_PLAN[primitiveType] ||
    Object.freeze([
      Object.freeze({
        suffix: 'generic-candidate-geometry',
        primitiveType: `candidate-${normalizeHEarthGeometryToken(primitiveType)}`,
        kind: 'GENERIC',
        widthRatio: 1,
        heightRatio: 1,
        depthRatio: 1,
        count: 1,
        detailToken: 'generic-candidate'
      })
    ]);

  return Object.freeze(
    plan.flatMap((part, partIndex) =>
      createHEarthLatticeDrivenChildNodesForPart(
        parentNode,
        part,
        partIndex,
        plan.length,
        input,
        context
      )
    )
  );
}

export function shouldCarryHEarthParentDescriptor(parentNode) {
  return resolveHEarthGeometryCanonicalProfile(parentNode).carryParentDescriptor === true;
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
        descriptorParentNodeCount: 0,
        latticeAddressNodeCount: 0,
        renumerizedClassReadyNodeCount: 0
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
        descriptorParentNodeCount: 0,
        latticeAddressNodeCount: 0,
        renumerizedClassReadyNodeCount: 0
      };
    }

    summary[primitiveType].expandedNodeCount += 1;

    if (expandedNode.geometryExpansion?.expandedFromParent === true) {
      summary[primitiveType].geometryChildNodeCount += 1;
    }

    if (expandedNode.geometryExpansion?.parentCarryNode === true) {
      summary[primitiveType].descriptorParentNodeCount += 1;
    }

    if (expandedNode.geometryExpansion?.latticeAddress) {
      summary[primitiveType].latticeAddressNodeCount += 1;
    }

    if (
      expandedNode.classReadyDescriptor === true &&
      Array.isArray(expandedNode.renumerizedClassNames)
    ) {
      summary[primitiveType].renumerizedClassReadyNodeCount += 1;
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
  failureCodes = [],
  latticeAdmissionReceipt = null
} = {}) {
  const parentNodeCount = expandedNodes.filter(
    (node) => node.geometryExpansion?.parentCarryNode === true
  ).length;

  const childNodeCount = expandedNodes.filter(
    (node) => node.geometryExpansion?.expandedFromParent === true
  ).length;

  const latticeAddressNodeCount = expandedNodes.filter(
    (node) => Boolean(node.geometryExpansion?.latticeAddress)
  ).length;

  const classReadyNodeCount = expandedNodes.filter(
    (node) =>
      node.classReadyDescriptor === true &&
      Array.isArray(node.renumerizedClassNames) &&
      node.renumerizedClassNames.length > 0
  ).length;

  const admitted = latticeAdmissionReceipt?.latticeAdmitted === true;

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

    latticeAdmissionReceipt,
    descriptorLandscapeLatticeAdmitted: admitted,
    geometryLatticeAdmissionStatus:
      latticeAdmissionReceipt?.geometryLatticeAdmissionStatus || 'UNKNOWN',
    geometryLatticeAdmissionFailed: admitted !== true,
    silentFallbackUsed: false,
    failClosedOnAdmissionFailure: admitted !== true,

    sourceNodeCount: sourceNodes.length,
    expandedNodeCount: expandedNodes.length,
    skippedNodeCount,
    parentNodeCount,
    childNodeCount,

    descriptorParentNodeCount: parentNodeCount,
    geometryChildNodeCount: childNodeCount,
    geometryExpansionSkippedCount: skippedNodeCount,
    alreadyExpandedSkippedCount,
    latticeAddressNodeCount,

    renumerizationApplied: true,
    classReadyNodeCount,
    classReadyNodeCountMatchesExpandedNodeCount:
      classReadyNodeCount === expandedNodes.length,
    canonicalAndDetailClassGrammarDefined: true,
    parentAwareChildIdentityDefined: true,
    layerMembershipClassGrammarDefined: true,

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

export function makeHEarthGeometryAdmissionFailedResult({
  source,
  sourceNodes,
  warnings,
  failures,
  latticeAdmissionReceipt
} = {}) {
  const receipt = makeHEarthGeometryExpansionReceipt({
    source,
    sourceNodes,
    expandedNodes: [],
    skippedNodeCount: sourceNodes.length,
    warningCodes: warnings,
    failureCodes: failures,
    latticeAdmissionReceipt
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

    sourceNodeCount: sourceNodes.length,
    expandedNodeCount: 0,
    skippedNodeCount: sourceNodes.length,
    parentNodeCount: 0,
    childNodeCount: 0,

    descriptorParentNodeCount: 0,
    geometryChildNodeCount: 0,
    geometryExpansionSkippedCount: sourceNodes.length,

    descriptorLandscapeLatticeAdmitted: false,
    latticeAdmissionReceipt,
    geometryLatticeAdmissionStatus:
      latticeAdmissionReceipt?.geometryLatticeAdmissionStatus || 'REJECTED',
    geometryLatticeAdmissionFailed: true,
    silentFallbackUsed: false,
    failClosedOnAdmissionFailure: true,

    sourceExpandedNodeCount: 0,
    returnedExpandedNodeCount: 0,
    budgetApplied: false,

    renumerizationApplied: true,
    classReadyNodeCount: 0,

    warningCodes: Object.freeze(warnings),
    failureCodes: Object.freeze(failures),
    geometryExpansionWarningCodes: Object.freeze(warnings),
    geometryExpansionFailureCodes: Object.freeze(failures),

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

  const latticeAdmissionReceipt = buildHEarthGeometryLatticeAdmissionReceipt(
    input,
    resolvedInput.context
  );

  if (latticeAdmissionReceipt.latticeAdmitted !== true) {
    failures.push('GEOMETRY_LATTICE_ADMISSION_FAILED');
    failures.push(...latticeAdmissionReceipt.failureCodes);

    return makeHEarthGeometryAdmissionFailedResult({
      source,
      sourceNodes,
      warnings,
      failures,
      latticeAdmissionReceipt
    });
  }

  if (sourceNodes.length === 0) {
    warnings.push('GEOMETRY_SOURCE_NODES_EMPTY');

    const receipt = makeHEarthGeometryExpansionReceipt({
      source,
      sourceNodes: [],
      expandedNodes: [],
      skippedNodeCount: 0,
      warningCodes: warnings,
      failureCodes: failures,
      latticeAdmissionReceipt
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

      descriptorLandscapeLatticeAdmitted: true,
      latticeAdmissionReceipt,
      geometryLatticeAdmissionStatus: 'ADMITTED',

      renumerizationApplied: true,
      classReadyNodeCount: 0,

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
      failureCodes: failures,
      latticeAdmissionReceipt
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

      descriptorLandscapeLatticeAdmitted: true,
      latticeAdmissionReceipt,
      geometryLatticeAdmissionStatus: 'ADMITTED',

      sourceExpandedNodeCount: expandedNodes.length,
      returnedExpandedNodeCount: expandedNodes.length,
      budgetApplied: false,

      renumerizationApplied: true,
      classReadyNodeCount: receipt.classReadyNodeCount,

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
          geometryContractId:
            H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
          sourceLandscapeLatticeContract:
            H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeContract,
          sourceIndex: index,
          source,
          contextKeys: Object.freeze(Object.keys(resolvedInput.context || {})),
          descriptorLandscapeLatticeAdmitted: true,
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

      const childNodes = expandHEarthGeometryNodeByPrimitive(
        parentNode,
        input,
        resolvedInput.context
      ).map((childNode) =>
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
            descriptorLandscapeLatticeAdmitted: true,
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
    failureCodes: failures,
    latticeAdmissionReceipt
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

    descriptorLandscapeLatticeAdmitted: true,
    latticeAdmissionReceipt,
    geometryLatticeAdmissionStatus: 'ADMITTED',
    latticeAddressNodeCount: receipt.latticeAddressNodeCount,

    renumerizationApplied: true,
    classReadyNodeCount: receipt.classReadyNodeCount,
    canonicalAndDetailClassGrammarDefined: true,
    parentAwareChildIdentityDefined: true,
    layerMembershipClassGrammarDefined: true,

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

export function getHEarthGeometryPortReceipt(input = {}, context = {}) {
  const latticeAdmissionReceipt = buildHEarthGeometryLatticeAdmissionReceipt(
    input,
    context
  );

  return Object.freeze({
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.renewedFrom,
    supportSurfacePreservedFrom:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.supportSurfacePreservedFrom,
    status: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.status,

    sourceLandscapeLatticeFile:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeFile,
    sourceLandscapeLatticeContract:
      H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.sourceLandscapeLatticeContract,

    latticeAdmissionReceipt,
    descriptorLandscapeLatticeAdmitted:
      latticeAdmissionReceipt.descriptorLandscapeLatticeAdmitted,
    geometryLatticeAdmissionStatus:
      latticeAdmissionReceipt.geometryLatticeAdmissionStatus,
    addressCountMatchesExpected:
      latticeAdmissionReceipt.addressCountMatchesExpected,
    rowCountMatchesExpected:
      latticeAdmissionReceipt.rowCountMatchesExpected,
    columnCountMatchesExpected:
      latticeAdmissionReceipt.columnCountMatchesExpected,
    rowOrientationPreserved:
      latticeAdmissionReceipt.rowOrientationPreserved,

    geometryPortDefined: true,
    geometryExpansionFunctionDefined: typeof expandHEarthGeometryNodes === 'function',
    rendererExpectedExpansionFunctionDefined: true,
    rendererExpectedReceiptFunctionDefined: true,
    legacyExpansionAliasDefined:
      typeof expandHEarthCandidateGeometryNodes === 'function',
    legacyReceiptAliasDefined:
      typeof getHEarthGeometryExpansionPortReceipt === 'function',

    primitiveProfileMapDefined: true,
    primitiveExpansionDefined: true,
    parentDescriptorCarryDefined: true,
    latticeAdmissionGateDefined: true,
    latticeGuidedChildPlacementDefined: true,
    latticeGuidedDensityDefined: true,
    latticeGuidedPriorityDefined: true,
    candidateOnlyGeometryDefined: true,
    alreadyExpandedReexpansionGuardDefined: true,

    silentFallbackAllowed: false,
    failClosedOnAdmissionFailure: true,

    canonicalAndDetailClassGrammarDefined: true,
    parentAwareChildIdentityDefined: true,
    layerMembershipClassGrammarDefined: true,
    geometryClassReadyDescriptorFieldsDefined: true,

    supportedPrimitiveTypes: Object.freeze(
      Object.keys(H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP)
    ),

    supportedDepthZones: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE,
    supportedGeometryNodeKinds: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND,

    createsRuntimeGrid: false,
    createsTraversalGrid: false,
    createsCollisionGrid: false,
    createsPhysicsGrid: false,
    createsGameplayGrid: false,
    createsSurvivalGrid: false,

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

export function getHEarthGeometryExpansionPortReceipt(input = {}, context = {}) {
  return getHEarthGeometryPortReceipt(input, context);
}

export const H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT =
  getHEarthGeometryPortReceipt();

export const H_EARTH_3D_RENDER_GEOMETRY_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
  file: '/showroom/globe/h-earth/render/geometry.js',

  contract: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT,
  nodeKind: H_EARTH_3D_RENDER_GEOMETRY_NODE_KIND,
  depthZone: H_EARTH_3D_RENDER_GEOMETRY_DEPTH_ZONE,
  defaultLimits: H_EARTH_3D_RENDER_GEOMETRY_DEFAULT_LIMITS,

  materialClassMap: H_EARTH_3D_RENDER_GEOMETRY_MATERIAL_CLASS_MAP,
  layerClassMap: H_EARTH_3D_RENDER_GEOMETRY_LAYER_CLASS_MAP,
  canonicalProfileMap: H_EARTH_3D_RENDER_GEOMETRY_CANONICAL_PROFILE_MAP,
  primitiveNodePlan: H_EARTH_3D_RENDER_GEOMETRY_PRIMITIVE_NODE_PLAN,

  isPlainObject: isHEarthPlainObject,
  normalizeNumber: normalizeHEarthGeometryNumber,
  clampNumber: clampHEarthGeometryNumber,
  normalizeToken: normalizeHEarthGeometryToken,
  normalizeArray: normalizeHEarthGeometryArray,
  uniqueClassNames: uniqueHEarthClassNames,
  joinClassNames: joinHEarthClassNames,

  resolvePrimitiveType: resolveHEarthGeometryPrimitiveType,
  resolveParentPrimitiveType: resolveHEarthGeometryParentPrimitiveType,
  resolveMaterialKey: resolveHEarthGeometryMaterialKey,
  resolveObjectId: resolveHEarthGeometryObjectId,
  resolveSourceObjectId: resolveHEarthGeometrySourceObjectId,
  resolveParentObjectId: resolveHEarthGeometryParentObjectId,
  resolveNodeId: resolveHEarthGeometryNodeId,
  resolveSourceNodeId: resolveHEarthGeometrySourceNodeId,
  resolveParentNodeId: resolveHEarthGeometryParentNodeId,
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
  resolveCanonicalProfile: resolveHEarthGeometryCanonicalProfile,
  resolveMaterialClassName: resolveHEarthGeometryMaterialClassName,
  resolveLayerClasses: resolveHEarthGeometryLayerClasses,
  resolveRenumerizedClassContract:
    resolveHEarthGeometryRenumerizedClassContract,

  extractLandscapeLatticeBundle: extractHEarthLandscapeLatticeBundle,
  buildLatticeAdmissionReceipt: buildHEarthGeometryLatticeAdmissionReceipt,
  getLandscapeLatticeMap: getHEarthGeometryLandscapeLatticeMapSafe,
  getLandscapeLatticeReceipt: getHEarthGeometryLandscapeLatticeReceiptSafe,
  getLandscapeLatticeRecords: getHEarthGeometryLandscapeLatticeRecords,
  resolveObjectHintIds: resolveHEarthObjectHintIds,
  resolveLatticeRecordsForNode: resolveHEarthLatticeRecordsForNode,
  resolveLatticeGuidanceForNode: resolveHEarthLatticeGuidanceForNode,
  selectLatticeRecordsForPart: selectHEarthLatticeRecordsForPart,

  isAlreadyExpandedGeometryNode: isHEarthAlreadyExpandedGeometryNode,

  createCandidateTransform: createHEarthGeometryCandidateTransform,
  createPrimitiveDescriptor: createHEarthGeometryPrimitiveDescriptor,
  createExpandedNode: createHEarthExpandedGeometryNode,
  createParentCarryNode: createHEarthParentCarryGeometryNode,
  createLatticeDrivenChildNodesForPart:
    createHEarthLatticeDrivenChildNodesForPart,

  expandNodeByPrimitive: expandHEarthGeometryNodeByPrimitive,
  expandGeometryNodes: expandHEarthGeometryNodes,
  expandCandidateGeometryNodes: expandHEarthCandidateGeometryNodes,

  getReceipt: getHEarthGeometryPortReceipt,
  receipt: H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT,

  boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary
});

export default H_EARTH_3D_RENDER_GEOMETRY_PORT;
