const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7A_EXACT_IMPLEMENTATION_BASELINE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7A_EXACT_IMPLEMENTATION_BASELINE_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7A',
  status: 'EXACT_BASELINE_AND_SCOPE_FROZEN',
  authorityQuestion:
    'IS_THE_CHECKPOINT_7_IMPLEMENTATION_BRANCH_BASED_ON_THE_EXACT_CHECKPOINT_6_MERGE_WITH_THE_ACCEPTED_CP2_RENDERER_AND_LIVE_ROUTE_UNCHANGED?',

  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-cp7-control-field-naturalism-001',
  exactBaseHead: '64c7a4d4e4d0039ce4be7762b04e0f051f0beb67',
  cp6Result: 'CP6_METHOD_RECONCILIATION_PASS_CLOSED',

  preservedPreboundedWork: {
    custodyBranch: 'custody/h-earth-cp7-prebounded-implementation-001',
    relationToBase: 'AHEAD_BY_2_BEHIND_BY_0',
    preservedPaths: [
      'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
    ],
    admittedIntoActiveCp7Branch: false,
    disposition:
      'PRESERVED_FOR_LATER_BOUNDED_REVIEW_WITHOUT_BYPASSING_CHECKPOINTS_7A_THROUGH_7D'
  },

  frozenRuntimeInventory: {
    acceptedCp2Renderer: {
      path: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
      blob: 'de55609b0b0bd66601445a369c727ff7a6d7065d'
    },
    liveHost: {
      path: 'showroom/globe/h-earth/index.html',
      blob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a'
    },
    liveGpuBinding: {
      path: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      blob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
    },
    cp6MethodAuthority: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp6-round2-method-reconciliation.v1.mjs',
      blob: 'bd81383192097de0fdf5b22282422223041eb98a'
    },
    cp6MetricAuthority: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp6-geometry-conditioned-material-repetition-metric.v1.mjs',
      blob: '3de9da18e99d1de5fdf096ccced0d41668fc3700'
    },
    successorTerrainField: {
      path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
      blob: '0bd36eec01a75311bf6441d575bae5a057195bbc'
    }
  },

  wholeCheckpoint7AuthorizedPathEnvelope: {
    exactProductTargets: [
      'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
    ],
    controlPrefix: 'h-earth-3d/control-plane/post-cp2-round2/cp7/',
    validationPrefix: 'h-earth-3d/validation/cp7/',
    workflowPrefix: '.github/workflows/h-earth-cp7',
    allOtherProductPathsProhibited: true
  },

  exactSubcheckpoint7APathScope: [
    '.github/workflows/h-earth-cp7a-exact-implementation-baseline.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7a-exact-implementation-baseline.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7a-exact-implementation-baseline.mjs'
  ],

  boundaries: {
    productMutationPerformed: false,
    controlFieldContractDefined: false,
    controlFieldGeneratorCreated: false,
    candidateRendererCreatedOnActiveBranch: false,
    liveRouteChanged: false,
    liveCandidateAuthorized: false,
    checkpoint7BMayStartOnlyAfter7AClosure: true,
    stop: 'STOP_BEFORE_DEFINING_THE_CONTROL_FIELD_CONTRACT_OR_CREATING_ANY_PRODUCT_FILE'
  },

  result: 'CP7A_EXACT_IMPLEMENTATION_BASELINE_PASS_CLOSED'
});

export default H_EARTH_CP7A_EXACT_IMPLEMENTATION_BASELINE_v1;
