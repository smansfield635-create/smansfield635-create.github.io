/**
 * /h-earth-3d/control-plane/run-6/h-earth.functional-landscape-run-6.program.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_SUCCESSOR_RUN_6_PROGRAM_v1
 *
 * Governance-only occurrence. This file authorizes no production promotion.
 * It locks the exact current-main basis, retained authority boundaries,
 * checkpoint sequence, mutation posture, fixtures, and stopping conditions.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const nested of Object.values(value)) {
    deepFreeze(nested, seen);
  }
  return Object.freeze(value);
};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_SUCCESSOR_RUN_6_PROGRAM_v1';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6 = deepFreeze({
  contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6_CONTRACT_ID,
  programClass: 'MULTI_CHECKPOINT_GOVERNED_SUCCESSOR_PROGRAM',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-functional-landscape-run6-001',
  exactParentCommit: 'd41a48eef3d601c2afca0808cdd05ec58d5fc8b0',

  governingInterpretation: {
    startFromScratch: false,
    discardExistingBlobs: false,
    discardExistingTrees: false,
    preserveValidExistingBytes: true,
    fullRepositoryRewrite: false,
    packet001Rewrite: false,
    productWriteDuringRun6A: false,
    checkpointsMustPassInOrder: true,
    stopOnlyAtDecisionBoundary: true,
    blockerMeaning: 'SEARCH_EXISTING_REPOSITORY_SOLUTION_OR_REDUCE_COUPLING_WITHOUT_INVENTING_AUTHORITY'
  },

  exactBaselineBlobs: {
    capacity: {
      path: '/showroom/globe/h-earth/capacity.js',
      sha: '89e4622bb9c30b533a1d13d7db887ee53e7a46c8'
    },
    environment: {
      path: '/showroom/globe/h-earth/environment.js',
      sha: '3f3bc750b0e1a87531e0ea425dc0ac343fb18381'
    },
    compositor: {
      path: '/showroom/globe/h-earth/compositor.js',
      sha: '3764f0d53b0564de7a5e983bd339dda75017bc82'
    },
    admittedGeometryFrame: {
      path: '/showroom/globe/h-earth/admitted-geometry-frame.js',
      sha: 'c45ed4482f0d653c4a51ea838c191f36e7769d26'
    },
    renderer: {
      path: '/showroom/globe/h-earth/renderer.js',
      sha: '799d37cec5244e6aa19b7d94dffe37e182b85884'
    },
    controller: {
      path: '/showroom/globe/h-earth/controller.js',
      sha: '6720240473626f6589e1964b247436d46d5f6fb8'
    },
    lattice: {
      path: '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
      sha: 'ed9ff1f7d3c139a1cba7df169f278336342339f4'
    },
    packet001Resolver: {
      path: '/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js',
      sha: '8ed548780039fffba3989e55f5c8f3713354e34f'
    },
    geometryKernel: {
      path: '/showroom/globe/h-earth/render/geometry-kernel.js',
      sha: '91eabcc240b54ef01a52d59a237dff629d90a722'
    },
    geometryGround: {
      path: '/showroom/globe/h-earth/render/geometry-ground.js',
      sha: '76e16221f4a952c3c1ec019b999f50450c4c7949'
    },
    geometryWater: {
      path: '/showroom/globe/h-earth/render/geometry-water.js',
      sha: '4980e4760dd364893bb8163aef5e8516dba2628c'
    },
    geometryFoam: {
      path: '/showroom/globe/h-earth/render/geometry-foam.js',
      sha: '50e7db73d516e903373be9f86f966678473a6d28'
    },
    geometryPreview: {
      path: '/showroom/globe/h-earth/render/geometry-preview.js',
      sha: '2bc4d2376ac2175ec5a941abefe1273aa10d2b0c'
    },
    shorelinePreview: {
      path: '/showroom/globe/h-earth/render/shoreline-preview.js',
      sha: 'cf4602e5bb57d207ab19a631ff7a0da860f6d2cd'
    },
    routeBootstrap: {
      path: '/showroom/globe/h-earth/index.js',
      sha: 'b26aa16abfebf24bf0d77b62d36f7a11ade1ac5c'
    }
  },

  authorityChain: [
    'SEMANTIC_LANDSCAPE',
    'CANONICAL_TERRAIN_FIELD',
    'TERRAIN_FORMATIONS',
    'LANDSCAPE_REALIZATION_PLANNER',
    'NEUTRAL_GEOMETRY_PROVIDERS',
    'WEST_ADMISSION',
    'ADMITTED_GEOMETRY_FRAME',
    'COMPOSITOR_HANDOFF',
    'SUCCESSOR_RENDERER',
    'CONTROLLER_AND_BROWSER_PROOF'
  ],

  identitySeparation: {
    semanticAddressIsTerrainVertex: false,
    semanticAddressIsPhysicalChunk: false,
    physicalChunkIsFormation: false,
    formationIsProxy: false,
    providerIsWorldAuthority: false
  },

  fixedProofEnvelope: {
    semanticAddressCount: 256,
    physicalChunkCountMaximum: 16,
    chunkAddressRows: 4,
    chunkAddressColumns: 4,
    chunkLayout: 'FIXED_4_BY_4_ADDRESS_GROUPS',
    adjacentLodVariation: false,
    uniformSharedBoundaryResolution: true,
    oneContinuousTerrainField: true,
    hillCountMinimum: 1,
    ridgeOrBluffCountMinimum: 1,
    valleyOrDrainageCountMinimum: 1,
    distantHighlandOrMountainProxyCountMinimum: 1
  },

  fileDisposition: {
    preserve: [
      '/h-earth-3d/h-earth.matrix.js',
      '/h-earth-3d/cells/ground-cell-001.js',
      '/h-earth-3d/objects/ground-cell-001.objects.js',
      '/h-earth-3d/zones/ground-cell-001.zones.js',
      '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
      '/showroom/globe/h-earth/render/geometry-kernel.js',
      'WEST_ADMISSION_AUTHORITY',
      'SHARED_PACKET_002_AUTHORITY',
      'DIAGNOSTIC_ARCHITECTURE'
    ],
    compatibilityOnly: [
      '/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js',
      '/showroom/globe/h-earth/render/geometry-preview.js',
      '/showroom/globe/h-earth/render/shoreline-preview.js'
    ],
    create: [
      '/h-earth-3d/terrain/h-earth.terrain-field.js',
      '/h-earth-3d/terrain/h-earth.terrain-formations.js',
      '/h-earth-3d/integration/h-earth.landscape-realization-planner.js',
      '/showroom/globe/h-earth/render/geometry-landscape.js',
      '/showroom/globe/h-earth/render/geometry-shoreline.js',
      '/showroom/globe/h-earth/render/geometry-distant-context.js',
      '/showroom/globe/h-earth/render/landscape-preview.js',
      '/showroom/globe/h-earth/render/renderer.functional-landscape.js',
      '/showroom/globe/h-earth/functional-landscape/index.html',
      '/showroom/globe/h-earth/functional-landscape/index.css',
      '/showroom/globe/h-earth/functional-landscape/index.js'
    ],
    renewRequired: [
      '/showroom/globe/h-earth/renderer.js'
    ],
    conditionalRenew: [
      '/showroom/globe/h-earth/environment.js',
      '/showroom/globe/h-earth/capacity.js',
      '/showroom/globe/h-earth/admitted-geometry-frame.js',
      '/showroom/globe/h-earth/compositor.js',
      '/showroom/globe/h-earth/controller.js',
      '/showroom/globe/h-earth/render/geometry-ground.js',
      '/showroom/globe/h-earth/render/geometry-water.js',
      '/showroom/globe/h-earth/render/geometry-foam.js'
    ]
  },

  checkpoints: {
    run6A: {
      name: 'AUTHORITY_AND_FILE_DISPOSITION_LOCK',
      productWrite: false,
      passRequires: [
        'EXACT_PARENT_COMMIT_LOCKED',
        'EXACT_BASELINE_BLOBS_LOCKED',
        'AUTHORITY_BOUNDARIES_LOCKED',
        'FILE_DISPOSITION_LOCKED',
        'CHECKPOINT_STOP_CONDITIONS_LOCKED'
      ]
    },
    run6B: {
      name: 'CANONICAL_GEOGRAPHY_EXECUTION',
      allowedPaths: [
        '/h-earth-3d/terrain/h-earth.terrain-field.js',
        '/h-earth-3d/terrain/h-earth.terrain-formations.js',
        '/h-earth-3d/integration/h-earth.landscape-realization-planner.js',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6b.harness.mjs',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6b.receipt.json'
      ]
    },
    run6C: {
      name: 'CONNECTED_NEUTRAL_GEOMETRY',
      allowedPaths: [
        '/showroom/globe/h-earth/render/geometry-landscape.js',
        '/showroom/globe/h-earth/render/geometry-shoreline.js',
        '/showroom/globe/h-earth/render/geometry-distant-context.js',
        '/showroom/globe/h-earth/render/landscape-preview.js',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6c.harness.mjs',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6c.receipt.json'
      ]
    },
    run6D: {
      name: 'RENDERER_SUCCESSOR',
      allowedPaths: [
        '/showroom/globe/h-earth/render/renderer.functional-landscape.js',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6d.harness.mjs',
        '/h-earth-3d/validation/h-earth.functional-landscape.run6d.receipt.json'
      ],
      requiredPreservation: [
        'CAMERA_SPACE_TRANSFORM',
        'NEAR_FAR_CLIPPING',
        'FRUSTUM_CLIPPING',
        'FRAME_LIFECYCLE',
        'SEMANTIC_IDENTITY'
      ]
    },
    run6E: {
      name: 'FRAME_AND_COMPOSITOR_INTEGRATION',
      passRequires: [
        'FUNCTIONAL_LANDSCAPE_FRAME',
        'COMPATIBILITY_MODES_PRESERVED',
        'NO_PACKET_001_COLLAPSE',
        'RENDERER_HANDOFF'
      ]
    },
    run6F: {
      name: 'NAVIGABLE_BROWSER_PROOF',
      passRequires: [
        'COAST_TO_INLAND_NAVIGATION',
        'CAMERA_TERRAIN_CLEARANCE',
        'SKY_CLOSURE',
        'TERRAIN_WATER_DEPTH_CORRECTNESS',
        'SEMANTIC_SELECTION_PERSISTENCE',
        'PORTRAIT_AND_LANDSCAPE_OPERATION'
      ]
    }
  },

  held: [
    'VARIABLE_ADJACENT_LOD',
    'RUNTIME_WORLD_STREAMING',
    'PROCEDURAL_VEGETATION',
    'DECORATIVE_ROCK_SCATTER',
    'BUILDINGS',
    'MANOR_REALIZATION',
    'PHYSICS',
    'CAVES',
    'CLIMBING',
    'FLUID_SIMULATION',
    'WEATHER',
    'FULL_MOUNTAIN_TRAVERSAL',
    'PRODUCTION_PROMOTION'
  ],

  failureConditions: [
    'VISIBLE_TILE_CRACK',
    'SHARED_EDGE_ELEVATION_DIVERGENCE',
    'HILL_SPLIT_AT_CHUNK_BOUNDARY',
    'WATER_ABOVE_TERRAIN_OUTSIDE_DECLARED_CONTACT',
    'DEPTH_INVERSION',
    'SKY_OR_HORIZON_GAP',
    'NONFINITE_PROJECTION',
    'CAMERA_BELOW_TERRAIN_WITHOUT_RECOVERY',
    'SEMANTIC_ADDRESS_LOSS',
    'MATERIAL_BAND_DISCONTINUITY'
  ]
});

export function evaluateHEarthFunctionalLandscapeRun6Program() {
  const issues = [];
  const program = H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6;

  if (program.exactParentCommit.length !== 40) {
    issues.push('PARENT_COMMIT_NOT_FULL_SHA');
  }
  if (Object.keys(program.exactBaselineBlobs).length < 10) {
    issues.push('BASELINE_BLOB_CENSUS_INCOMPLETE');
  }
  if (program.fixedProofEnvelope.semanticAddressCount !== 256) {
    issues.push('SEMANTIC_ADDRESS_COUNT_CHANGED');
  }
  if (program.fixedProofEnvelope.physicalChunkCountMaximum !== 16) {
    issues.push('PHYSICAL_CHUNK_ENVELOPE_CHANGED');
  }
  if (!program.fileDisposition.renewRequired.includes(
    '/showroom/globe/h-earth/renderer.js'
  )) {
    issues.push('RENDERER_RENEWAL_NOT_LOCKED');
  }
  if (program.governingInterpretation.productWriteDuringRun6A !== false) {
    issues.push('RUN6A_PRODUCT_WRITE_NOT_WITHHELD');
  }

  return deepFreeze({
    contractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6_CONTRACT_ID,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_6A_AUTHORITY_AND_DISPOSITION_LOCK_PASS'
      : 'RUN_6A_AUTHORITY_AND_DISPOSITION_LOCK_FAIL',
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6A_RECEIPT =
  evaluateHEarthFunctionalLandscapeRun6Program();
