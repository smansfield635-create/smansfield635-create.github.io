// /showroom/globe/h-earth/capacity.js
// NEW FILE
// H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1
//
// Purpose:
// Defines H-Earth 3D Candidate Preview spatial capacity.
// This file does not render, touch DOM, activate WebGL/canvas,
// claim visual pass, claim validation, or claim production.

export const H_EARTH_3D_CAPACITY_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1',
  standardId: 'H_EARTH_3D_CAPACITY_FULL_FOUNDATIONAL_STANDARD_v1',
  file: '/showroom/globe/h-earth/capacity.js',
  status: 'FOUNDATIONAL_CAPACITY_DEFINED_NON_RENDERING',
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

  consumedBy: Object.freeze([
    '/showroom/globe/h-earth/environment.js',
    '/showroom/globe/h-earth/renderer.js',
    '/showroom/globe/h-earth/compositor.js',
    '/showroom/globe/h-earth/controller.js',
    '/showroom/globe/h-earth/index.js'
  ]),

  downstreamDependencyDirection: Object.freeze([
    'capacity.js',
    'environment.js',
    'renderer.js',
    'compositor.js',
    'controller.js',
    'index.js'
  ]),

  boundaryClaims: Object.freeze({
    doesNotRender: true,
    doesNotTouchDom: true,
    doesNotConstructEnvironment: true,
    doesNotConstructRenderer: true,
    doesNotConstructCompositor: true,
    doesNotConstructController: true,
    doesNotConstructRouteShell: true,
    doesNotActivateCanvas: true,
    doesNotActivateWebGL: true,
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
  }),

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  })
});

export const H_EARTH_3D_COORDINATE_SYSTEM = Object.freeze({
  id: 'H_EARTH_3D_COORDINATE_SYSTEM',
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  axes: Object.freeze({
    x: Object.freeze({
      name: 'shoreline lateral axis',
      meaning: 'left/right across the beach and shoreline composition',
      positiveDirection: 'rightward shoreline / manor-context side',
      negativeDirection: 'leftward rocky foreground / terrain-boundary side'
    }),
    y: Object.freeze({
      name: 'vertical elevation axis',
      meaning: 'height above or below local ground reference',
      positiveDirection: 'up / bluff / air layer',
      negativeDirection: 'below local surface reference'
    }),
    z: Object.freeze({
      name: 'depth axis',
      meaning: 'foreground beach toward shoreline, water, horizon, and distant context',
      positiveDirection: 'toward shoreline, water, horizon, distant world context',
      negativeDirection: 'toward near foreground inspection surface'
    })
  }),

  origin: Object.freeze({
    objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
    anchorId: 'H_EARTH_GROUND_SPAWN_ANCHOR',
    position: Object.freeze({ x: 0, y: 0, z: 0 }),
    meaning: 'bounded ground-level candidate-preview origin'
  }),

  unit: Object.freeze({
    id: 'H_EARTH_GROUND_UNIT',
    value: 1,
    description: 'abstract candidate-preview spatial unit; not meters, feet, or a real-world distance claim'
  })
});

export const H_EARTH_3D_SCALE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_SCALE_MODEL',
  baseUnit: 1,
  previewScale: 1,
  lateralScale: 1,
  heightScale: 0.55,
  depthScale: 1.25,
  contextCompressionScale: 0.42,
  horizonCompressionScale: 0.28,

  interpretation: Object.freeze({
    heightCompressionPurpose: 'keep bluff/manor context visible without implying traversable height',
    depthScalePurpose: 'separate foreground, shoreline, water, manor context, and distant world context',
    contextCompressionPurpose: 'preserve distant visibility without traversal authority',
    realWorldScaleClaim: false
  })
});

export const H_EARTH_3D_WORLD_BOUNDS = Object.freeze({
  id: 'H_EARTH_3D_WORLD_BOUNDS',
  coordinateSystem: 'H_EARTH_3D_COORDINATE_SYSTEM',

  x: Object.freeze({ min: -64, max: 64, span: 128 }),
  y: Object.freeze({ min: -8, max: 32, span: 40 }),
  z: Object.freeze({ min: -24, max: 96, span: 120 }),

  center: Object.freeze({ x: 0, y: 12, z: 36 }),

  classification: 'boundedPreviewVolume',

  prohibitedInterpretations: Object.freeze([
    'openWorldVolume',
    'finalTerrainVolume',
    'validatedRendererVolume',
    'survivalSimulationVolume',
    'distantTraversalVolume'
  ])
});

export const H_EARTH_3D_DEPTH_MODEL = Object.freeze({
  id: 'H_EARTH_3D_DEPTH_MODEL',
  formula: 'normalizedDepth = (z - zMin) / (zMax - zMin)',
  boundFormula: 'normalizedDepth = (z + 24) / 120',

  ranges: Object.freeze({
    foreground: Object.freeze({ min: 0.0, max: 0.33 }),
    shoreline: Object.freeze({ min: 0.30, max: 0.47 }),
    water: Object.freeze({ min: 0.43, max: 0.88 }),
    context: Object.freeze({ min: 0.35, max: 0.80 }),
    horizon: Object.freeze({ min: 0.80, max: 1.0 })
  }),

  overlapAllowed: true,
  overlapPurpose: 'environmental layering without traversal authority'
});

export const H_EARTH_3D_ZONE_BANDS = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze({
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    label: 'Foreground Inspection Zone',
    role: 'primary bounded ground-inspection band',
    xRange: Object.freeze({ min: -42, max: 42 }),
    yRange: Object.freeze({ min: -1, max: 5 }),
    zRange: Object.freeze({ min: -24, max: 16 }),
    normalizedDepthRange: Object.freeze({ min: 0.0, max: 0.333 }),

    capability: Object.freeze({
      inspectable: true,
      selectable: true,
      contextOnly: false
    }),

    boundary: Object.freeze({
      traversalClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),

    context: Object.freeze({
      hEarthOwned: true,
      hearthContextOnly: false,
      audraliaContextOnly: false
    })
  }),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze({
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    label: 'Shoreline Contact Zone',
    role: 'bounded earth/water contact band',
    xRange: Object.freeze({ min: -56, max: 56 }),
    yRange: Object.freeze({ min: -2, max: 4 }),
    zRange: Object.freeze({ min: 12, max: 32 }),
    normalizedDepthRange: Object.freeze({ min: 0.300, max: 0.467 }),

    capability: Object.freeze({
      inspectable: true,
      selectable: true,
      contextOnly: false
    }),

    boundary: Object.freeze({
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),

    context: Object.freeze({
      hEarthOwned: true,
      hearthContextOnly: false,
      audraliaContextOnly: false
    })
  }),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze({
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    label: 'Water Surface Zone',
    role: 'visible water context band',
    xRange: Object.freeze({ min: -64, max: 64 }),
    yRange: Object.freeze({ min: -3, max: 3 }),
    zRange: Object.freeze({ min: 28, max: 82 }),
    normalizedDepthRange: Object.freeze({ min: 0.433, max: 0.883 }),

    capability: Object.freeze({
      inspectable: false,
      selectable: false,
      contextOnly: true
    }),

    boundary: Object.freeze({
      traversalClaim: false,
      swimmingClaim: false,
      fluidSimulationClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),

    context: Object.freeze({
      hEarthOwned: true,
      hearthContextOnly: false,
      audraliaContextOnly: false
    })
  }),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    label: 'Manor Context Zone',
    role: 'Hearth exterior support/control context only',
    xRange: Object.freeze({ min: 18, max: 64 }),
    yRange: Object.freeze({ min: 2, max: 32 }),
    zRange: Object.freeze({ min: 18, max: 58 }),
    normalizedDepthRange: Object.freeze({ min: 0.350, max: 0.683 }),

    capability: Object.freeze({
      inspectable: false,
      selectable: false,
      contextOnly: true
    }),

    boundary: Object.freeze({
      traversalClaim: false,
      manorInteriorClaim: false,
      hearthMergeClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),

    context: Object.freeze({
      hEarthOwned: false,
      hearthContextOnly: true,
      audraliaContextOnly: false
    })
  }),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze({
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    label: 'Distant World Context Zone',
    role: 'Audralia planetary-world context through horizon and distant forms',
    xRange: Object.freeze({ min: -64, max: 64 }),
    yRange: Object.freeze({ min: -4, max: 32 }),
    zRange: Object.freeze({ min: 72, max: 96 }),
    normalizedDepthRange: Object.freeze({ min: 0.800, max: 1.0 }),

    capability: Object.freeze({
      inspectable: false,
      selectable: false,
      contextOnly: true
    }),

    boundary: Object.freeze({
      traversalClaim: false,
      distantTraversalClaim: false,
      loadedWorldMapClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),

    context: Object.freeze({
      hEarthOwned: false,
      hearthContextOnly: false,
      audraliaContextOnly: true
    })
  })
});

export const H_EARTH_3D_PRIMITIVE_SCHEMA = Object.freeze({
  plane: Object.freeze({
    primitiveType: 'plane',
    purpose: 'flat bounded spatial reference surface',
    finalGeometryClaim: false
  }),

  terrainBand: Object.freeze({
    primitiveType: 'terrainBand',
    purpose: 'bounded ground or sand band with local spatial identity',
    finalGeometryClaim: false
  }),

  contouredTerrainBand: Object.freeze({
    primitiveType: 'contouredTerrainBand',
    purpose: 'ground band supporting contour hints without terrain-engine activation',
    finalGeometryClaim: false
  }),

  curvedBand: Object.freeze({
    primitiveType: 'curvedBand',
    purpose: 'shoreline or foam edge band with lateral flow',
    finalGeometryClaim: false
  }),

  irregularShorelineBand: Object.freeze({
    primitiveType: 'irregularShorelineBand',
    purpose: 'non-straight shoreline capacity for later environment consumption',
    finalGeometryClaim: false
  }),

  scatterCluster: Object.freeze({
    primitiveType: 'scatterCluster',
    purpose: 'small repeated terrain-detail markers without physics claim',
    finalGeometryClaim: false
  }),

  rockCluster: Object.freeze({
    primitiveType: 'rockCluster',
    purpose: 'bounded rock group or jagged terrain anchor',
    finalGeometryClaim: false
  }),

  waterPlane: Object.freeze({
    primitiveType: 'waterPlane',
    purpose: 'visible water surface context without fluid simulation',
    finalGeometryClaim: false
  }),

  waterDepthBand: Object.freeze({
    primitiveType: 'waterDepthBand',
    purpose: 'layered water-depth cue without fluid simulation',
    finalGeometryClaim: false
  }),

  atmosphericLayer: Object.freeze({
    primitiveType: 'atmosphericLayer',
    purpose: 'haze, light, and air-pressure visual-context capacity',
    finalGeometryClaim: false
  }),

  contextStructure: Object.freeze({
    primitiveType: 'contextStructure',
    purpose: 'visible support/control or world-context structure without entry',
    finalGeometryClaim: false
  }),

  layeredSilhouette: Object.freeze({
    primitiveType: 'layeredSilhouette',
    purpose: 'recognizable far/context form grammar without interior or traversal authority',
    finalGeometryClaim: false
  }),

  distantCluster: Object.freeze({
    primitiveType: 'distantCluster',
    purpose: 'horizon or far-world cue without traversal authority',
    finalGeometryClaim: false
  }),

  inspectionAnchor: Object.freeze({
    primitiveType: 'inspectionAnchor',
    purpose: 'logical target binding for readout and receipt flow',
    finalGeometryClaim: false
  })
});

export const H_EARTH_3D_MATERIAL_IDENTITIES = Object.freeze({
  wetSand: Object.freeze({
    materialKey: 'wetSand',
    layer: 'Earth',
    intendedUse: 'foreground wet-sand surface identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  drySand: Object.freeze({
    materialKey: 'drySand',
    layer: 'Earth',
    intendedUse: 'dry sand transition surface identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  foam: Object.freeze({
    materialKey: 'foam',
    layer: 'Water/Earth boundary',
    intendedUse: 'shoreline foam edge identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  tidePool: Object.freeze({
    materialKey: 'tidePool',
    layer: 'Earth/Water boundary',
    intendedUse: 'tide-pool and reflective-puddle identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  stone: Object.freeze({
    materialKey: 'stone',
    layer: 'Earth',
    intendedUse: 'small beach-stone identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  jaggedRock: Object.freeze({
    materialKey: 'jaggedRock',
    layer: 'Earth',
    intendedUse: 'foreground jagged-rock identity',
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  water: Object.freeze({
    materialKey: 'water',
    layer: 'Water',
    intendedUse: 'water surface identity',
    fluidSimulationClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  nearshoreWave: Object.freeze({
    materialKey: 'nearshoreWave',
    layer: 'Water',
    intendedUse: 'nearshore wave-band identity',
    fluidSimulationClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  airHaze: Object.freeze({
    materialKey: 'airHaze',
    layer: 'Air',
    intendedUse: 'air haze and light-layer identity',
    weatherEngineClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  manorContext: Object.freeze({
    materialKey: 'manorContext',
    layer: 'Hearth visual context',
    intendedUse: 'manor exterior context identity',
    hearthMergeClaim: false,
    manorInteriorClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  distantRock: Object.freeze({
    materialKey: 'distantRock',
    layer: 'Audralia world context',
    intendedUse: 'distant rock stack and islet identity',
    distantTraversalClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  }),

  inspectionAnchor: Object.freeze({
    materialKey: 'inspectionAnchor',
    layer: 'Logical overlay',
    intendedUse: 'inspection-anchor identity only',
    domClaim: false,
    finalMaterialClaim: false,
    visualValidationClaim: false
  })
});

const CAPABILITY_INSPECTABLE = Object.freeze({
  inspectable: true,
  selectable: true,
  contextOnly: false
});

const CAPABILITY_SECONDARY_SURFACE_CONTEXT = Object.freeze({
  inspectable: false,
  selectable: true,
  contextOnly: false,
  secondarySurfaceContext: true,
  groundConditionSupport: true,
  directReceiptClaim: false
});

const CAPABILITY_CONTEXT_ONLY = Object.freeze({
  inspectable: false,
  selectable: false,
  contextOnly: true
});

const BOUNDARY_LOCAL_SURFACE = Object.freeze({
  traversalClaim: false,
  simulationClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  matrixCollapse: false
});

const BOUNDARY_WATER_CONTEXT = Object.freeze({
  traversalClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  simulationClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  matrixCollapse: false
});

const BOUNDARY_MANOR_CONTEXT = Object.freeze({
  traversalClaim: false,
  manorInteriorClaim: false,
  hearthMergeClaim: false,
  simulationClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  matrixCollapse: false
});

const BOUNDARY_DISTANT_CONTEXT = Object.freeze({
  traversalClaim: false,
  distantTraversalClaim: false,
  loadedWorldMapClaim: false,
  simulationClaim: false,
  validationClaim: false,
  visualPassClaim: false,
  matrixCollapse: false
});

export const H_EARTH_3D_OBJECT_CAPACITY_REFERENCES = Object.freeze({
  OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze({
    objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
    label: 'Ground Spawn Anchor',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    primitiveType: 'inspectionAnchor',
    materialKey: 'inspectionAnchor',
    role: 'ground-view origin and preview spawn reference',
    capability: Object.freeze({ inspectable: false, selectable: false, contextOnly: false }),
    boundary: BOUNDARY_LOCAL_SURFACE,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_002_FOREGROUND_WET_SAND: Object.freeze({
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    label: 'Foreground Wet Sand',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    primitiveType: 'contouredTerrainBand',
    materialKey: 'wetSand',
    role: 'primary local surface anchor',
    capability: CAPABILITY_INSPECTABLE,
    boundary: BOUNDARY_LOCAL_SURFACE,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
    objectId: 'OBJ_003_DRY_SAND_TRANSITION',
    label: 'Dry Sand Transition',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    primitiveType: 'terrainBand',
    materialKey: 'drySand',
    role: 'secondary surface context and dry-to-wet transition support',
    capability: CAPABILITY_SECONDARY_SURFACE_CONTEXT,
    boundary: BOUNDARY_LOCAL_SURFACE,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze({
    objectId: 'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    label: 'Tide Pools and Reflective Puddles',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    primitiveType: 'scatterCluster',
    materialKey: 'tidePool',
    role: 'water-contact micro-anchor',
    capability: CAPABILITY_INSPECTABLE,
    boundary: BOUNDARY_WATER_CONTEXT,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
    objectId: 'OBJ_005_SHORELINE_FOAM_LINE',
    label: 'Shoreline Foam Line',
    zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
    primitiveType: 'irregularShorelineBand',
    materialKey: 'foam',
    role: 'active earth/water boundary marker',
    capability: CAPABILITY_INSPECTABLE,
    boundary: BOUNDARY_WATER_CONTEXT,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze({
    objectId: 'OBJ_006_NEARSHORE_WAVE_BAND',
    label: 'Nearshore Wave Band',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    primitiveType: 'waterDepthBand',
    materialKey: 'nearshoreWave',
    role: 'visible coastal pressure cue',
    capability: CAPABILITY_CONTEXT_ONLY,
    boundary: BOUNDARY_WATER_CONTEXT,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_007_WATER_SURFACE_PLANE: Object.freeze({
    objectId: 'OBJ_007_WATER_SURFACE_PLANE',
    label: 'Water Surface Plane',
    zoneId: 'ZONE_003_WATER_SURFACE_ZONE',
    primitiveType: 'waterPlane',
    materialKey: 'water',
    role: 'primary water context plane',
    capability: CAPABILITY_CONTEXT_ONLY,
    boundary: BOUNDARY_WATER_CONTEXT,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze({
    objectId: 'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    label: 'Air Haze Light Layer',
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    primitiveType: 'atmosphericLayer',
    materialKey: 'airHaze',
    role: 'air pressure, haze, and light capacity layer',
    capability: CAPABILITY_CONTEXT_ONLY,
    boundary: Object.freeze({
      weatherEngineClaim: false,
      traversalClaim: false,
      simulationClaim: false,
      validationClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    }),
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: true })
  }),

  OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
    objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    label: 'Manor Exterior Context',
    zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
    primitiveType: 'layeredSilhouette',
    materialKey: 'manorContext',
    role: 'visible Hearth support/control presence only',
    capability: CAPABILITY_CONTEXT_ONLY,
    boundary: BOUNDARY_MANOR_CONTEXT,
    context: Object.freeze({ hEarthOwned: false, hearthContextOnly: true, audraliaContextOnly: false })
  }),

  OBJ_010_SMALL_BEACH_STONES: Object.freeze({
    objectId: 'OBJ_010_SMALL_BEACH_STONES',
    label: 'Small Beach Stones',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    primitiveType: 'scatterCluster',
    materialKey: 'stone',
    role: 'minor surface obstacle and footing-friction cue',
    capability: CAPABILITY_INSPECTABLE,
    boundary: BOUNDARY_LOCAL_SURFACE,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
    objectId: 'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    label: 'Foreground Jagged Rocks',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    primitiveType: 'rockCluster',
    materialKey: 'jaggedRock',
    role: 'local terrain hazard anchor',
    capability: CAPABILITY_INSPECTABLE,
    boundary: BOUNDARY_LOCAL_SURFACE,
    context: Object.freeze({ hEarthOwned: true, hearthContextOnly: false, audraliaContextOnly: false })
  }),

  OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: Object.freeze({
    objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    label: 'Distance Rock Stacks and Islets',
    zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
    primitiveType: 'distantCluster',
    materialKey: 'distantRock',
    role: 'Audralia planetary-world context and horizon cue',
    capability: CAPABILITY_CONTEXT_ONLY,
    boundary: BOUNDARY_DISTANT_CONTEXT,
    context: Object.freeze({ hEarthOwned: false, hearthContextOnly: false, audraliaContextOnly: true })
  })
});

export const H_EARTH_3D_CANDIDATE_PLACEMENT_HINTS = Object.freeze({
  OBJ_001_GROUND_SPAWN_ANCHOR: Object.freeze({
    objectId: 'OBJ_001_GROUND_SPAWN_ANCHOR',
    center: Object.freeze({ x: 0, y: 0, z: 0 }),
    extent: Object.freeze({ x: 2, y: 2, z: 2 }),
    radius: 1,
    heightBand: Object.freeze({ min: 0, max: 2 }),
    depthWeight: 0.200,
    frameRole: 'origin-reference',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_002_FOREGROUND_WET_SAND: Object.freeze({
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    center: Object.freeze({ x: 0, y: -0.05, z: -6 }),
    extent: Object.freeze({ x: 72, y: 0.1, z: 32 }),
    radius: 36,
    heightBand: Object.freeze({ min: -0.1, max: 0.05 }),
    depthWeight: 0.150,
    frameRole: 'primary-surface',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
    objectId: 'OBJ_003_DRY_SAND_TRANSITION',
    center: Object.freeze({ x: -12, y: 0, z: 10 }),
    extent: Object.freeze({ x: 58, y: 0.1, z: 16 }),
    radius: 29,
    heightBand: Object.freeze({ min: -0.05, max: 0.08 }),
    depthWeight: 0.283,
    frameRole: 'secondary-surface-transition',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze({
    objectId: 'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    center: Object.freeze({ x: -14, y: 0.02, z: 14 }),
    extent: Object.freeze({ x: 26, y: 0.08, z: 10 }),
    radius: 13,
    heightBand: Object.freeze({ min: 0, max: 0.08 }),
    depthWeight: 0.317,
    frameRole: 'shore-moisture-detail',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
    objectId: 'OBJ_005_SHORELINE_FOAM_LINE',
    center: Object.freeze({ x: 4, y: 0.06, z: 26 }),
    extent: Object.freeze({ x: 92, y: 0.08, z: 5 }),
    radius: 46,
    heightBand: Object.freeze({ min: 0, max: 0.12 }),
    depthWeight: 0.417,
    frameRole: 'shore-contact-line',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_006_NEARSHORE_WAVE_BAND: Object.freeze({
    objectId: 'OBJ_006_NEARSHORE_WAVE_BAND',
    center: Object.freeze({ x: 8, y: 0, z: 36 }),
    extent: Object.freeze({ x: 96, y: 0.1, z: 10 }),
    radius: 48,
    heightBand: Object.freeze({ min: -0.1, max: 0.3 }),
    depthWeight: 0.500,
    frameRole: 'nearshore-water-pressure',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_007_WATER_SURFACE_PLANE: Object.freeze({
    objectId: 'OBJ_007_WATER_SURFACE_PLANE',
    center: Object.freeze({ x: 12, y: -0.08, z: 56 }),
    extent: Object.freeze({ x: 128, y: 0.1, z: 58 }),
    radius: 64,
    heightBand: Object.freeze({ min: -0.2, max: 0.1 }),
    depthWeight: 0.667,
    frameRole: 'water-context-plane',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_008_AIR_HAZE_LIGHT_LAYER: Object.freeze({
    objectId: 'OBJ_008_AIR_HAZE_LIGHT_LAYER',
    center: Object.freeze({ x: 0, y: 14, z: 54 }),
    extent: Object.freeze({ x: 128, y: 32, z: 80 }),
    radius: 64,
    heightBand: Object.freeze({ min: 0, max: 32 }),
    depthWeight: 0.650,
    frameRole: 'atmospheric-depth-layer',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
    objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    center: Object.freeze({ x: 42, y: 10, z: 38 }),
    extent: Object.freeze({ x: 28, y: 24, z: 18 }),
    radius: 14,
    heightBand: Object.freeze({ min: 2, max: 32 }),
    depthWeight: 0.517,
    frameRole: 'hearth-exterior-context',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_010_SMALL_BEACH_STONES: Object.freeze({
    objectId: 'OBJ_010_SMALL_BEACH_STONES',
    center: Object.freeze({ x: -18, y: 0.08, z: -2 }),
    extent: Object.freeze({ x: 28, y: 1, z: 18 }),
    radius: 14,
    heightBand: Object.freeze({ min: 0, max: 1 }),
    depthWeight: 0.183,
    frameRole: 'foreground-surface-detail',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
    objectId: 'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    center: Object.freeze({ x: -34, y: 1.2, z: -10 }),
    extent: Object.freeze({ x: 18, y: 5, z: 16 }),
    radius: 9,
    heightBand: Object.freeze({ min: 0, max: 5 }),
    depthWeight: 0.117,
    frameRole: 'foreground-hazard-detail',
    environmentAuthority: false,
    finalPlacementClaim: false
  }),

  OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: Object.freeze({
    objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    center: Object.freeze({ x: 30, y: 5, z: 88 }),
    extent: Object.freeze({ x: 26, y: 18, z: 10 }),
    radius: 13,
    heightBand: Object.freeze({ min: 0, max: 18 }),
    depthWeight: 0.933,
    frameRole: 'audralia-distant-world-context',
    environmentAuthority: false,
    finalPlacementClaim: false
  })
});

export const H_EARTH_3D_ENVIRONMENTAL_FORM_GRAMMAR = Object.freeze({
  terrainContourModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_003_DRY_SAND_TRANSITION'
    ]),
    requirements: Object.freeze([
      'support shallow slope',
      'support contour variation',
      'support tidal smoothing',
      'support surface interruption',
      'avoid pure toy-rectangle interpretation'
    ]),
    environmentBuildClaim: false
  }),

  shorelineCurveModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND'
    ]),
    requirements: Object.freeze([
      'support irregular shoreline curve',
      'support layered foam offsets',
      'avoid perfectly straight band interpretation',
      'avoid fluid simulation claim'
    ]),
    fluidSimulationClaim: false,
    environmentBuildClaim: false
  }),

  rockFormationModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_010_SMALL_BEACH_STONES',
      'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),
    scaleClasses: Object.freeze([
      'pebble',
      'stone',
      'jagged-rock',
      'outcrop',
      'distant-stack'
    ]),
    requirements: Object.freeze([
      'use clustered scale hierarchy',
      'avoid identical repeated blobs',
      'preserve foreground hazard distinction',
      'preserve distant context-only status'
    ]),
    physicsClaim: false,
    traversalClaim: false,
    environmentBuildClaim: false
  }),

  waterDepthCueModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_006_NEARSHORE_WAVE_BAND',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),
    bands: Object.freeze([
      'foam-edge',
      'shallow-wash',
      'nearshore-water',
      'mid-water-plane',
      'horizon-water'
    ]),
    fluidSimulationClaim: false,
    swimmingClaim: false,
    environmentBuildClaim: false
  }),

  atmosphericDepthModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_008_AIR_HAZE_LIGHT_LAYER',
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),
    requirements: Object.freeze([
      'increase haze with normalized depth',
      'reduce contrast with normalized depth',
      'reduce detail with normalized depth',
      'preserve context-only distant forms'
    ]),
    weatherEngineClaim: false,
    visualPassClaim: false,
    environmentBuildClaim: false
  }),

  manorSilhouetteModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_009_MANOR_EXTERIOR_CONTEXT'
    ]),
    components: Object.freeze([
      'bluffBase',
      'terraceLayer',
      'mainMass',
      'towerMass',
      'turretMass',
      'roofline',
      'windowHintLayer'
    ]),
    requirements: Object.freeze([
      'recognizable exterior context',
      'layered silhouette rather than generic box',
      'no interior access',
      'no Hearth matrix merge'
    ]),
    manorInteriorClaim: false,
    hearthMergeClaim: false,
    environmentBuildClaim: false
  }),

  distantWorldSilhouetteModel: Object.freeze({
    appliesTo: Object.freeze([
      'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS'
    ]),
    components: Object.freeze([
      'lowIslet',
      'rockStack',
      'mistyHeadland',
      'horizonBreak'
    ]),
    requirements: Object.freeze([
      'low-detail silhouette cluster',
      'haze compression',
      'no traversal authority',
      'no loaded world map claim'
    ]),
    distantTraversalClaim: false,
    loadedWorldMapClaim: false,
    environmentBuildClaim: false
  })
});

export const H_EARTH_3D_DETAIL_DENSITY_MODEL = Object.freeze({
  id: 'H_EARTH_3D_DETAIL_DENSITY_MODEL',
  formula: 'detailDensity = 1 - normalizedDepth, then class-clamped',

  objectValues: Object.freeze({
    OBJ_002_FOREGROUND_WET_SAND: 0.85,
    OBJ_003_DRY_SAND_TRANSITION: 0.72,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: 0.78,
    OBJ_005_SHORELINE_FOAM_LINE: 0.68,
    OBJ_006_NEARSHORE_WAVE_BAND: 0.50,
    OBJ_007_WATER_SURFACE_PLANE: 0.38,
    OBJ_008_AIR_HAZE_LIGHT_LAYER: 0.18,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: 0.44,
    OBJ_010_SMALL_BEACH_STONES: 0.82,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 0.88,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: 0.20
  }),

  boundary: Object.freeze({
    visualPassClaim: false,
    validationClaim: false,
    rendererClaim: false
  })
});

export const H_EARTH_3D_SHAPE_IRREGULARITY_MODEL = Object.freeze({
  id: 'H_EARTH_3D_SHAPE_IRREGULARITY_MODEL',

  objectValues: Object.freeze({
    OBJ_002_FOREGROUND_WET_SAND: 0.12,
    OBJ_003_DRY_SAND_TRANSITION: 0.18,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: 0.45,
    OBJ_005_SHORELINE_FOAM_LINE: 0.35,
    OBJ_006_NEARSHORE_WAVE_BAND: 0.28,
    OBJ_007_WATER_SURFACE_PLANE: 0.16,
    OBJ_008_AIR_HAZE_LIGHT_LAYER: 0.22,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: 0.25,
    OBJ_010_SMALL_BEACH_STONES: 0.60,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 0.75,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: 0.50
  }),

  interpretation: Object.freeze({
    lowValue: 'smooth or soft form expectation',
    highValue: 'jagged, scattered, or irregular form expectation',
    geometryGenerationClaim: false
  })
});

export const H_EARTH_3D_SILHOUETTE_MODEL = Object.freeze({
  manorExterior: Object.freeze({
    objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
    components: Object.freeze({
      bluffBase: Object.freeze({ order: 1, contextOnly: true }),
      terraceLayer: Object.freeze({ order: 2, contextOnly: true }),
      mainMass: Object.freeze({ order: 3, contextOnly: true }),
      towerMass: Object.freeze({ order: 4, contextOnly: true }),
      turretMass: Object.freeze({ order: 5, contextOnly: true }),
      roofline: Object.freeze({ order: 6, contextOnly: true }),
      windowHintLayer: Object.freeze({ order: 7, contextOnly: true })
    }),
    boundary: Object.freeze({
      interiorAccessClaim: false,
      hearthMergeClaim: false,
      finalGeometryClaim: false
    })
  }),

  distantWorld: Object.freeze({
    objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
    components: Object.freeze({
      lowIslet: Object.freeze({ order: 1, contextOnly: true }),
      rockStack: Object.freeze({ order: 2, contextOnly: true }),
      mistyHeadland: Object.freeze({ order: 3, contextOnly: true }),
      horizonBreak: Object.freeze({ order: 4, contextOnly: true })
    }),
    boundary: Object.freeze({
      distantTraversalClaim: false,
      loadedWorldMapClaim: false,
      audraliaContextOnly: true,
      finalGeometryClaim: false
    })
  })
});

export const H_EARTH_3D_CONTEXT_COMPRESSION = Object.freeze({
  id: 'H_EARTH_3D_CONTEXT_COMPRESSION',
  contextCompressionFactor: 0.42,
  horizonCompressionFactor: 0.28,
  contextScaleFormula: '1 / (1 + normalizedDepth * contextCompressionFactor)',
  horizonScaleFormula: '1 / (1 + normalizedDepth * horizonCompressionFactor)',

  purpose: Object.freeze([
    'keep context forms visible',
    'prevent context visibility from becoming traversal authority',
    'preserve distant world as context-only'
  ])
});

export const H_EARTH_3D_INSPECTION_RADIUS_MODEL = Object.freeze({
  id: 'H_EARTH_3D_INSPECTION_RADIUS_MODEL',

  radii: Object.freeze({
    OBJ_002_FOREGROUND_WET_SAND: 8,
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: 6,
    OBJ_010_SMALL_BEACH_STONES: 5,
    OBJ_011_FOREGROUND_JAGGED_ROCKS: 5,
    OBJ_005_SHORELINE_FOAM_LINE: 6,
    OBJ_003_DRY_SAND_TRANSITION: 0,
    OBJ_009_MANOR_EXTERIOR_CONTEXT: 0,
    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: 0
  }),

  rules: Object.freeze({
    inspectableRequiresRadiusGreaterThanZero: true,
    contextOnlyRequiresRadiusZero: true,
    secondarySurfaceContextRequiresDirectReceiptClaimFalse: true,
    inspectionDoesNotCreateTraversal: true
  })
});

export const H_EARTH_3D_INSPECTION_ANCHORS = Object.freeze({
  primary: Object.freeze({
    anchorId: 'H_EARTH_PRIMARY_INSPECTION_ANCHOR',
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    role: 'primary inspection target',
    capability: CAPABILITY_INSPECTABLE,
    localPosition: Object.freeze({ x: 0, y: 0.35, z: -6 }),
    cameraFrameHint: 'ground-level foreground surface frame',
    label: 'Foreground Wet Sand / Local Surface Anchor',
    readoutReference: 'Ground Condition Read',
    receiptReference: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
  }),

  supporting: Object.freeze({
    OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES: Object.freeze({
      anchorId: 'H_EARTH_SUPPORTING_TIDE_POOL_ANCHOR',
      objectId: 'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
      zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
      role: 'supporting moisture and tide-contact target',
      capability: CAPABILITY_INSPECTABLE,
      localPosition: Object.freeze({ x: -14, y: 0.35, z: 14 }),
      cameraFrameHint: 'low shoreline moisture frame',
      label: 'Tide Pools and Reflective Puddles',
      readoutReference: 'Ground Condition Read',
      receiptReference: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
    }),

    OBJ_010_SMALL_BEACH_STONES: Object.freeze({
      anchorId: 'H_EARTH_SUPPORTING_STONES_ANCHOR',
      objectId: 'OBJ_010_SMALL_BEACH_STONES',
      zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      role: 'supporting footing-friction target',
      capability: CAPABILITY_INSPECTABLE,
      localPosition: Object.freeze({ x: -18, y: 0.45, z: -2 }),
      cameraFrameHint: 'ground-detail stones frame',
      label: 'Small Beach Stones',
      readoutReference: 'Ground Condition Read',
      receiptReference: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
    }),

    OBJ_011_FOREGROUND_JAGGED_ROCKS: Object.freeze({
      anchorId: 'H_EARTH_SUPPORTING_JAGGED_ROCKS_ANCHOR',
      objectId: 'OBJ_011_FOREGROUND_JAGGED_ROCKS',
      zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      role: 'supporting local hazard target',
      capability: CAPABILITY_INSPECTABLE,
      localPosition: Object.freeze({ x: -34, y: 2.2, z: -10 }),
      cameraFrameHint: 'left foreground rock-hazard frame',
      label: 'Foreground Jagged Rocks',
      readoutReference: 'Ground Condition Read',
      receiptReference: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
    }),

    OBJ_005_SHORELINE_FOAM_LINE: Object.freeze({
      anchorId: 'H_EARTH_SUPPORTING_FOAM_LINE_ANCHOR',
      objectId: 'OBJ_005_SHORELINE_FOAM_LINE',
      zoneId: 'ZONE_002_SHORELINE_CONTACT_ZONE',
      role: 'supporting shoreline pressure target',
      capability: CAPABILITY_INSPECTABLE,
      localPosition: Object.freeze({ x: 4, y: 0.4, z: 26 }),
      cameraFrameHint: 'shore-contact foam frame',
      label: 'Shoreline Foam Line',
      readoutReference: 'Ground Condition Read',
      receiptReference: 'H_EARTH_GROUND_INSPECTION_RECEIPT'
    })
  }),

  secondarySurfaceContext: Object.freeze({
    OBJ_003_DRY_SAND_TRANSITION: Object.freeze({
      anchorId: 'H_EARTH_SECONDARY_DRY_SAND_TRANSITION_ANCHOR',
      objectId: 'OBJ_003_DRY_SAND_TRANSITION',
      zoneId: 'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      role: 'secondary surface context and dry-to-wet transition support',
      capability: CAPABILITY_SECONDARY_SURFACE_CONTEXT,
      localPosition: Object.freeze({ x: -12, y: 0.2, z: 10 }),
      cameraFrameHint: 'secondary dry-sand transition frame',
      label: 'Dry Sand Transition',
      readoutReference: null,
      receiptReference: null,
      directReceiptClaim: false
    })
  }),

  contextOnly: Object.freeze({
    OBJ_009_MANOR_EXTERIOR_CONTEXT: Object.freeze({
      anchorId: 'H_EARTH_CONTEXT_MANOR_EXTERIOR_ANCHOR',
      objectId: 'OBJ_009_MANOR_EXTERIOR_CONTEXT',
      zoneId: 'ZONE_004_MANOR_CONTEXT_ZONE',
      role: 'Hearth support/control exterior context',
      capability: CAPABILITY_CONTEXT_ONLY,
      localPosition: Object.freeze({ x: 42, y: 10, z: 38 }),
      cameraFrameHint: 'context-only manor exterior frame',
      label: 'Manor Exterior Context',
      readoutReference: null,
      receiptReference: null,
      manorInteriorAccessClaim: false
    }),

    OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS: Object.freeze({
      anchorId: 'H_EARTH_CONTEXT_DISTANCE_WORLD_ANCHOR',
      objectId: 'OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS',
      zoneId: 'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE',
      role: 'Audralia distant world context',
      capability: CAPABILITY_CONTEXT_ONLY,
      localPosition: Object.freeze({ x: 30, y: 5, z: 88 }),
      cameraFrameHint: 'context-only horizon frame',
      label: 'Distance Rock Stacks and Islets',
      readoutReference: null,
      receiptReference: null,
      distantTraversalClaim: false
    })
  })
});

export const H_EARTH_3D_CAMERA_CAPACITY = Object.freeze({
  id: 'H_EARTH_3D_CAMERA_CAPACITY',
  cameraType: 'ground-view camera',
  controlType: 'bounded view control',
  defaultFrame: 'inspection framing',
  previewCameraType: 'spatial preview camera',

  defaultPosition: Object.freeze({ x: 0, y: 3.2, z: -16 }),
  defaultLookAt: Object.freeze({ x: 0, y: 0.6, z: 10 }),

  panLimits: Object.freeze({
    xMin: -28,
    xMax: 36,
    zMin: -18,
    zMax: 32,
    openWorldTraversalClaim: false
  }),

  tiltLimitsDegrees: Object.freeze({
    min: -18,
    max: 22
  }),

  zoomLimits: Object.freeze({
    min: 0.85,
    max: 1.35,
    freeFlightClaim: false
  }),

  forbiddenControls: Object.freeze([
    'free-flight',
    'walk',
    'swim',
    'travel',
    'enter-manor',
    'explore-world',
    'distant-traversal',
    'open-world-controller',
    'survival-controller'
  ])
});

export const H_EARTH_3D_ZONE_ADJACENCY_MODEL = Object.freeze({
  ZONE_001_FOREGROUND_INSPECTION_ZONE: Object.freeze({
    visibleAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    inspectionAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE'
    ]),
    traversalAdjacency: Object.freeze([])
  }),

  ZONE_002_SHORELINE_CONTACT_ZONE: Object.freeze({
    visibleAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    inspectionAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE'
    ]),
    traversalAdjacency: Object.freeze([])
  }),

  ZONE_003_WATER_SURFACE_ZONE: Object.freeze({
    visibleAdjacency: Object.freeze([
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    inspectionAdjacency: Object.freeze([]),
    traversalAdjacency: Object.freeze([])
  }),

  ZONE_004_MANOR_CONTEXT_ZONE: Object.freeze({
    visibleAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_005_DISTANT_WORLD_CONTEXT_ZONE'
    ]),
    inspectionAdjacency: Object.freeze([]),
    traversalAdjacency: Object.freeze([])
  }),

  ZONE_005_DISTANT_WORLD_CONTEXT_ZONE: Object.freeze({
    visibleAdjacency: Object.freeze([
      'ZONE_001_FOREGROUND_INSPECTION_ZONE',
      'ZONE_002_SHORELINE_CONTACT_ZONE',
      'ZONE_003_WATER_SURFACE_ZONE',
      'ZONE_004_MANOR_CONTEXT_ZONE'
    ]),
    inspectionAdjacency: Object.freeze([]),
    traversalAdjacency: Object.freeze([])
  })
});

export const H_EARTH_3D_EXPANSION_TIERS = Object.freeze({
  TIER_0_CAPACITY_ONLY: Object.freeze({
    tier: 0,
    id: 'TIER_0_CAPACITY_ONLY',
    active: true,
    behavior: 'capacity definitions only'
  }),

  TIER_1_CANDIDATE_PREVIEW: Object.freeze({
    tier: 1,
    id: 'TIER_1_CANDIDATE_PREVIEW',
    active: true,
    behavior: 'candidate preview capacity support; rendering remains downstream-authorized only'
  }),

  TIER_2_BOUNDED_CELL_EXPANSION: Object.freeze({
    tier: 2,
    id: 'TIER_2_BOUNDED_CELL_EXPANSION',
    active: false,
    behavior: 'future bounded cell expansion only if separately authorized'
  }),

  TIER_3_REGION_PREPARATION: Object.freeze({
    tier: 3,
    id: 'TIER_3_REGION_PREPARATION',
    active: false,
    behavior: 'future region preparation only if separately authorized'
  }),

  TIER_4_OPEN_WORLD_PROHIBITED_CURRENTLY: Object.freeze({
    tier: 4,
    id: 'TIER_4_OPEN_WORLD_PROHIBITED_CURRENTLY',
    active: false,
    prohibitedCurrently: true
  })
});

export const H_EARTH_3D_EXPANSION_GUARDS = Object.freeze({
  mayExpandWithinCell: true,
  mayExpandToNewCell: false,
  mayExpandToRegion: false,
  mayActivateTraversal: false,
  mayActivateSimulation: false,
  mayActivateRenderer: false,
  mayActivateCanvas: false,
  mayActivateWebGL: false,
  mayClaimVisualPass: false,
  mayClaimValidation: false,
  mayClaimProduction: false
});

// These flags do not authorize renderer construction in this file.
// They preserve the lawful downstream possibility that a separately
// authorized renderer.js may create DOM/CSS-3D candidate scene nodes.
export const H_EARTH_3D_RENDERER_PERMISSION_FLAGS = Object.freeze({
  capacityFileDomConstructionAuthority: false,
  capacityFileRendererActivationAuthority: false,

  rendererDomCss3DCandidateAllowed: true,
  rendererMayCreateDomSceneNodes: true,
  rendererMayUseCss3DTransforms: true,
  rendererMayConsumeEnvironmentModel: true,

  rendererMayClaimFinalRenderer: false,
  rendererMayClaimVisualPass: false,
  rendererMayClaimValidation: false,
  rendererMayClaimProduction: false
});

export const H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS = Object.freeze({
  canvasCandidateAllowed: false,
  webglCandidateAllowed: false,

  finalRendererClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,

  routeImplementationAuthority: false,
  capacityFileRendererActivationAuthority: false,
  environmentConstructionAuthority: false,
  compositorControllerAuthority: false,

  openWorldTraversalClaim: false,
  survivalSimulationClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,

  matrixCollapse: false
});

export const H_EARTH_3D_DOWNSTREAM_CONSUMPTION = Object.freeze({
  dependencyDirection: Object.freeze([
    'capacity.js',
    'environment.js',
    'renderer.js',
    'compositor.js',
    'controller.js',
    'index.js'
  ]),

  environmentJsConsumes: Object.freeze([
    'coordinate system',
    'scale model',
    'world bounds',
    'depth model',
    'zone bands',
    'object capacity references',
    'candidate placement hints',
    'primitive schema',
    'material identities',
    'environmental form grammar',
    'detail density model',
    'shape irregularity model',
    'silhouette model',
    'inspection anchors'
  ]),

  rendererJsConsumes: Object.freeze([
    'environment model',
    'primitive schema',
    'material identities',
    'renderer permission flags',
    'detail density hints',
    'shape irregularity hints'
  ]),

  compositorJsConsumes: Object.freeze([
    'camera capacity',
    'world bounds',
    'zone bands',
    'depth model',
    'camera frame hints',
    'context compression'
  ]),

  controllerJsConsumes: Object.freeze([
    'object IDs',
    'inspection anchors',
    'capability flags',
    'context-only flags',
    'camera frame hints',
    'readout references',
    'receipt references'
  ]),

  indexJsConsumes: Object.freeze([
    'aggregate capacity export only'
  ]),

  boundary: Object.freeze({
    capacityDoesNotImportDownstreamFiles: true,
    downstreamMayNotUpgradeClaimsWithoutAuthority: true
  })
});

export const H_EARTH_3D_CAPACITY_COVERAGE_MODEL = Object.freeze({
  id: 'H_EARTH_3D_CAPACITY_COVERAGE_MODEL',
  completedRequiredSections: 21,
  totalRequiredSections: 21,
  capacityCoverageRatio: 1,

  interpretation: Object.freeze({
    meansCapacityStructureCovered: true,
    meansValidation: false,
    meansVisualPass: false,
    meansRuntimePass: false,
    meansRendererPass: false,
    meansProductionReady: false
  })
});

export function normalizeDepth(z) {
  const { min, span } = H_EARTH_3D_WORLD_BOUNDS.z;
  return (z - min) / span;
}

export function getDepthClass(z) {
  const depth = normalizeDepth(z);
  const ranges = H_EARTH_3D_DEPTH_MODEL.ranges;

  if (depth >= ranges.horizon.min && depth <= ranges.horizon.max) return 'horizon';
  if (depth >= ranges.water.min && depth <= ranges.water.max) return 'water';
  if (depth >= ranges.context.min && depth <= ranges.context.max) return 'context';
  if (depth >= ranges.shoreline.min && depth <= ranges.shoreline.max) return 'shoreline';
  if (depth >= ranges.foreground.min && depth <= ranges.foreground.max) return 'foreground';

  return 'out-of-bounds-depth';
}

export function isWithinWorldBounds(position) {
  if (!position || typeof position !== 'object') return false;

  const { x, y, z } = position;

  return (
    x >= H_EARTH_3D_WORLD_BOUNDS.x.min &&
    x <= H_EARTH_3D_WORLD_BOUNDS.x.max &&
    y >= H_EARTH_3D_WORLD_BOUNDS.y.min &&
    y <= H_EARTH_3D_WORLD_BOUNDS.y.max &&
    z >= H_EARTH_3D_WORLD_BOUNDS.z.min &&
    z <= H_EARTH_3D_WORLD_BOUNDS.z.max
  );
}

export function clampToWorldBounds(position) {
  const safePosition = position || { x: 0, y: 0, z: 0 };

  return Object.freeze({
    x: Math.min(Math.max(safePosition.x, H_EARTH_3D_WORLD_BOUNDS.x.min), H_EARTH_3D_WORLD_BOUNDS.x.max),
    y: Math.min(Math.max(safePosition.y, H_EARTH_3D_WORLD_BOUNDS.y.min), H_EARTH_3D_WORLD_BOUNDS.y.max),
    z: Math.min(Math.max(safePosition.z, H_EARTH_3D_WORLD_BOUNDS.z.min), H_EARTH_3D_WORLD_BOUNDS.z.max)
  });
}

export function getZoneBand(zoneId) {
  return H_EARTH_3D_ZONE_BANDS[zoneId] || null;
}

export function isPositionInsideZone(position, zoneId) {
  const zone = getZoneBand(zoneId);
  if (!zone || !position) return false;

  return (
    position.x >= zone.xRange.min &&
    position.x <= zone.xRange.max &&
    position.y >= zone.yRange.min &&
    position.y <= zone.yRange.max &&
    position.z >= zone.zRange.min &&
    position.z <= zone.zRange.max
  );
}

export function getObjectCapacityReference(objectId) {
  return H_EARTH_3D_OBJECT_CAPACITY_REFERENCES[objectId] || null;
}

export function getPlacementHint(objectId) {
  return H_EARTH_3D_CANDIDATE_PLACEMENT_HINTS[objectId] || null;
}

export function getMaterialIdentity(materialKey) {
  return H_EARTH_3D_MATERIAL_IDENTITIES[materialKey] || null;
}

export function getPrimitiveSchema(primitiveType) {
  return H_EARTH_3D_PRIMITIVE_SCHEMA[primitiveType] || null;
}

export function getInspectionAnchor(objectId) {
  if (H_EARTH_3D_INSPECTION_ANCHORS.primary.objectId === objectId) {
    return H_EARTH_3D_INSPECTION_ANCHORS.primary;
  }

  if (H_EARTH_3D_INSPECTION_ANCHORS.supporting[objectId]) {
    return H_EARTH_3D_INSPECTION_ANCHORS.supporting[objectId];
  }

  if (H_EARTH_3D_INSPECTION_ANCHORS.secondarySurfaceContext[objectId]) {
    return H_EARTH_3D_INSPECTION_ANCHORS.secondarySurfaceContext[objectId];
  }

  if (H_EARTH_3D_INSPECTION_ANCHORS.contextOnly[objectId]) {
    return H_EARTH_3D_INSPECTION_ANCHORS.contextOnly[objectId];
  }

  return null;
}

export function isInspectableObject(objectId) {
  const objectReference = getObjectCapacityReference(objectId);
  const radius = getInspectionRadius(objectId);

  return Boolean(
    objectReference &&
    objectReference.capability &&
    objectReference.capability.inspectable === true &&
    radius > 0
  );
}

export function isContextOnlyObject(objectId) {
  const objectReference = getObjectCapacityReference(objectId);

  return Boolean(
    objectReference &&
    objectReference.capability &&
    objectReference.capability.contextOnly === true
  );
}

export function isSecondarySurfaceContextObject(objectId) {
  const objectReference = getObjectCapacityReference(objectId);

  return Boolean(
    objectReference &&
    objectReference.capability &&
    objectReference.capability.secondarySurfaceContext === true &&
    objectReference.capability.directReceiptClaim === false
  );
}

export function getInspectionRadius(objectId) {
  return H_EARTH_3D_INSPECTION_RADIUS_MODEL.radii[objectId] ?? 0;
}

export function getDetailDensity(objectId) {
  return H_EARTH_3D_DETAIL_DENSITY_MODEL.objectValues[objectId] ?? 0;
}

export function getShapeIrregularity(objectId) {
  return H_EARTH_3D_SHAPE_IRREGULARITY_MODEL.objectValues[objectId] ?? 0;
}

export function getContextScaleForDepth(z) {
  const depth = normalizeDepth(z);
  const factor = H_EARTH_3D_CONTEXT_COMPRESSION.contextCompressionFactor;

  return 1 / (1 + depth * factor);
}

export function getHorizonScaleForDepth(z) {
  const depth = normalizeDepth(z);
  const factor = H_EARTH_3D_CONTEXT_COMPRESSION.horizonCompressionFactor;

  return 1 / (1 + depth * factor);
}

export function clampCameraPan(position) {
  const safePosition = position || H_EARTH_3D_CAMERA_CAPACITY.defaultPosition;
  const limits = H_EARTH_3D_CAMERA_CAPACITY.panLimits;

  return Object.freeze({
    x: Math.min(Math.max(safePosition.x, limits.xMin), limits.xMax),
    y: safePosition.y,
    z: Math.min(Math.max(safePosition.z, limits.zMin), limits.zMax)
  });
}

export function clampCameraTilt(degrees) {
  const limits = H_EARTH_3D_CAMERA_CAPACITY.tiltLimitsDegrees;
  return Math.min(Math.max(degrees, limits.min), limits.max);
}

export function clampCameraZoom(zoom) {
  const limits = H_EARTH_3D_CAMERA_CAPACITY.zoomLimits;
  return Math.min(Math.max(zoom, limits.min), limits.max);
}

export function getCameraFrameHint(objectId) {
  const anchor = getInspectionAnchor(objectId);
  return anchor ? anchor.cameraFrameHint : null;
}

export function getCapacityCoverageRatio() {
  return H_EARTH_3D_CAPACITY_COVERAGE_MODEL.capacityCoverageRatio;
}

export const H_EARTH_3D_CAPACITY_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_CAPACITY_RECEIPT',
  file: '/showroom/globe/h-earth/capacity.js',
  status: 'FOUNDATIONAL_CAPACITY_DEFINED_NON_RENDERING',

  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  coordinateSystemDefined: true,
  scaleModelDefined: true,
  worldBoundsDefined: true,
  depthModelDefined: true,
  zoneBandsDefined: true,
  primitiveSchemaDefined: true,
  materialIdentitiesDefined: true,
  objectCapacityReferencesDefined: true,
  candidatePlacementHintsDefined: true,
  environmentalFormGrammarDefined: true,
  detailDensityModelDefined: true,
  shapeIrregularityModelDefined: true,
  silhouetteModelDefined: true,
  contextCompressionDefined: true,
  inspectionRadiusModelDefined: true,
  inspectionAnchorsDefined: true,
  cameraCapacityDefined: true,
  zoneAdjacencyModelDefined: true,
  expansionTiersDefined: true,
  expansionGuardsDefined: true,
  rendererPermissionFlagsDefined: true,
  forbiddenCapabilityFlagsDefined: true,
  downstreamConsumptionDefined: true,
  capacityCoverageModelDefined: true,
  pureHelpersDefined: true,

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
    touchesDom: false,
    constructsEnvironment: false,
    constructsRenderer: false,
    constructsCompositor: false,
    constructsController: false,
    constructsRouteShell: false,
    activatesCanvas: false,
    activatesWebGL: false,
    claimsFinalRenderer: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    claimsOpenWorldTraversal: false,
    claimsSurvivalSimulation: false,
    claimsSwimming: false,
    claimsFluidSimulation: false,
    claimsManorInteriorAccess: false,
    claimsDistantTraversal: false
  })
});

export function getCapacityReceipt() {
  return H_EARTH_3D_CAPACITY_RECEIPT;
}

export const H_EARTH_3D_CAPACITY = Object.freeze({
  id: 'H_EARTH_3D_CAPACITY',
  file: '/showroom/globe/h-earth/capacity.js',
  sourceRoot: '/h-earth-3d/',
  primaryRoute: '/showroom/globe/h-earth/',

  contract: H_EARTH_3D_CAPACITY_CONTRACT,
  coordinateSystem: H_EARTH_3D_COORDINATE_SYSTEM,
  scaleModel: H_EARTH_3D_SCALE_MODEL,
  worldBounds: H_EARTH_3D_WORLD_BOUNDS,
  depthModel: H_EARTH_3D_DEPTH_MODEL,
  zoneBands: H_EARTH_3D_ZONE_BANDS,
  primitiveSchema: H_EARTH_3D_PRIMITIVE_SCHEMA,
  materialIdentities: H_EARTH_3D_MATERIAL_IDENTITIES,
  objectCapacityReferences: H_EARTH_3D_OBJECT_CAPACITY_REFERENCES,
  candidatePlacementHints: H_EARTH_3D_CANDIDATE_PLACEMENT_HINTS,
  environmentalFormGrammar: H_EARTH_3D_ENVIRONMENTAL_FORM_GRAMMAR,
  detailDensityModel: H_EARTH_3D_DETAIL_DENSITY_MODEL,
  shapeIrregularityModel: H_EARTH_3D_SHAPE_IRREGULARITY_MODEL,
  silhouetteModel: H_EARTH_3D_SILHOUETTE_MODEL,
  contextCompression: H_EARTH_3D_CONTEXT_COMPRESSION,
  inspectionRadiusModel: H_EARTH_3D_INSPECTION_RADIUS_MODEL,
  inspectionAnchors: H_EARTH_3D_INSPECTION_ANCHORS,
  cameraCapacity: H_EARTH_3D_CAMERA_CAPACITY,
  zoneAdjacencyModel: H_EARTH_3D_ZONE_ADJACENCY_MODEL,
  expansionTiers: H_EARTH_3D_EXPANSION_TIERS,
  expansionGuards: H_EARTH_3D_EXPANSION_GUARDS,
  rendererPermissionFlags: H_EARTH_3D_RENDERER_PERMISSION_FLAGS,
  forbiddenCapabilityFlags: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  downstreamConsumption: H_EARTH_3D_DOWNSTREAM_CONSUMPTION,
  capacityCoverageModel: H_EARTH_3D_CAPACITY_COVERAGE_MODEL,
  receipt: H_EARTH_3D_CAPACITY_RECEIPT
});

export default H_EARTH_3D_CAPACITY;
