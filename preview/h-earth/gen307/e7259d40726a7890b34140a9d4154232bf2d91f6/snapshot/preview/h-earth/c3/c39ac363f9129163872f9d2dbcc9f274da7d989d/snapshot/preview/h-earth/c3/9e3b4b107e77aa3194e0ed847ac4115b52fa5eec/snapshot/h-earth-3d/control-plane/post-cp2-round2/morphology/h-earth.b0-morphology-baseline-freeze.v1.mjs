const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_B0_MORPHOLOGY_BASELINE_FREEZE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_B0_MORPHOLOGY_BASELINE_FREEZE_v1',
  checkpoint: 'B0',
  executionTriggerRevision: 2,
  status: 'EXACT_ACCEPTED_HEIGHTFIELD_AND_PROTECTED_AUTHORITY_FREEZE',
  controllingHead: 'c85947c5d698ca00bd6c73c1ba43335593f69f84',
  priorDisposition: {
    research: 'B_PRESENTATION_ONLY_ROUTE_EXHAUSTED_BOUNDED_MORPHOLOGY_REQUIRED',
    bm5: 'ROUND2_BAKED_MATERIAL_REGRESSION_ROLLBACK',
    bm6Authorized: false
  },
  frozenSources: {
    acceptedRenderer: {
      path: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
      blob: 'de55609b0b0bd66601445a369c727ff7a6d7065d'
    },
    canonicalTerrainField: {
      path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
      blob: '0bd36eec01a75311bf6441d575bae5a057195bbc'
    },
    canonicalRenderPackage: {
      path: 'showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',
      blob: '9d3cb84168f2aea23a013de6d8982b707abf3f60'
    },
    canonicalGpuUploadViews: {
      path: 'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js',
      blob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50'
    },
    navigationAuthority: {
      path: 'showroom/globe/h-earth/functional-landscape/navigation.js',
      blob: '8ab3446c536fc24423d5601acce232b19fa71c91'
    },
    permanentEightSceneControl: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp8-engineering-execution-control.v1.json',
      blob: '068338fb38ea64787e99f509d4f0f88eb1aaed8c'
    },
    liveHost: {
      path: 'showroom/globe/h-earth/index.html',
      blob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a'
    },
    liveBinding: {
      path: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      blob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
    }
  },
  mutableEnvelope: {
    heightfieldYValues: 'BOUNDED_OFFLINE_PROBES_ONLY',
    heightfieldXZCoordinates: 'FROZEN',
    meshIndexTopology: 'FROZEN',
    vertexCount: 'FROZEN',
    terrainChunkMembership: 'FROZEN',
    worldExtent: 'FROZEN',
    runtimeRenderer: 'ACCEPTED_CP2_EXACT',
    runtimeMaterials: 'ACCEPTED_CP2_EXACT',
    runtimeTextures: 'ACCEPTED_CP2_EXACT',
    liveRoute: 'FROZEN'
  },
  protectedAuthorityClasses: {
    P0: {
      heightDelta: 'EXACTLY_ZERO',
      includes: [
        'WORLD_BOUNDARY_VERTICES',
        'SHORELINE_AND_WATER_INTERFACE_ANCHORS',
        'ACCEPTED_ENTRY_AND_WAYPOINT_ANCHORS',
        'MANOR_SITE_CANONICAL_ANCHORS',
        'CAVERN_RELATION_CANONICAL_ANCHORS',
        'NAVIGATION_SEAM_AND_CHUNK_BOUNDARY_ANCHORS',
        'ANY_VERTEX_USED_AS_AN_EXACT_CONTRACT_VALUE'
      ]
    },
    P1: {
      heightFidelity: 'HIGH',
      gradientChange: 'STRONGLY_LIMITED',
      bufferWidthLaw: 'MAX_2_HEIGHTFIELD_CELLS_ONE_COLLISION_FOOTPRINT_RADIUS_ONE_NAVIGATION_SAMPLE_RADIUS'
    },
    P2: {
      verticesMayChange: true,
      relationshipMustRemainValid: true,
      includes: [
        'MANOR_SITE_ENVELOPE',
        'CAVERN_EXTERIOR_RELATION',
        'RAVINE_TERMINUS_RELATION',
        'ACCEPTED_TRAVERSAL_CORRIDORS',
        'LANDMARK_APPROACH_VIEWSHEDS'
      ]
    }
  },
  probeLaw: {
    amplitudesRelativeToLocalRelief: [0.04, 0.08],
    exactlyTwoProbes: true,
    thirdAmplitudeProhibited: true,
    parameterSearchProhibited: true,
    productCandidate: false,
    liveAdmission: false
  },
  classificationLaw: {
    leverageEstablished: {
      heightfieldDirectionalRepetitionReductionMinimum: 0.10,
      finalFrameRepetitionReductionMinimum: 0.08,
      improvedSceneMinimum: 5
    },
    leverageNotEstablished: {
      bothProbeFinalFrameReductionMaximumExclusive: 0.05
    },
    otherwise: 'WEAK_OR_INCONCLUSIVE_LEVERAGE',
    b5AuthorizedOnlyBy: 'MORPHOLOGY_LEVERAGE_ESTABLISHED'
  },
  exactPathScope: [
    '.github/workflows/h-earth-b0-morphology-baseline-freeze.yml',
    'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b0-morphology-baseline-freeze.v1.mjs',
    'h-earth-3d/validation/morphology/h-earth.b0-morphology-baseline-freeze.mjs'
  ],
  prohibitedWork: [
    'ANOTHER_TERRAIN_SHADER',
    'ANOTHER_BAKED_MATERIAL_MAP',
    'RUNTIME_VERTEX_DISPLACEMENT',
    'RANDOM_PER_VERTEX_NOISE',
    'HEIGHTFIELD_RESOLUTION_CHANGE',
    'MESH_TOPOLOGY_CHANGE',
    'FULL_TERRAIN_REGENERATION',
    'LIVE_ROUTE_CHANGE'
  ],
  boundaries: {
    productMutationPerformed: false,
    probeGenerationStarted: false,
    stop: 'STOP_BEFORE_B1_MORPHOLOGY_AND_REPETITION_BASELINE'
  },
  result: 'B0_MORPHOLOGY_BASELINE_FREEZE_PASS_CLOSED'
});

export default H_EARTH_B0_MORPHOLOGY_BASELINE_FREEZE_v1;
