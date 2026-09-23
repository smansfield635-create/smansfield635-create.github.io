const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA0_AUDIT_BASIS_FREEZE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA0_AUDIT_BASIS_FREEZE_v1',
  checkpoint: 'MA0',
  status: 'EXACT_CP2_AND_REPETITION_METRIC_AUDIT_BASIS_FREEZE',
  authorityQuestion: 'ARE_THE_ACCEPTED_CP2_INPUTS_AND_CURRENT_REPETITION_METRIC_EXACTLY_IDENTIFIED',
  controllingB4Merge: '24aeb88371d3202d444c8e9063871ef20d3c4ed0',
  priorDisposition: {
    b4: 'B4_MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED_STOP_CLOSED',
    b5Authorized: false,
    currentResearchDisposition: 'C_CURRENT_METRIC_OR_CAUSAL_INTERPRETATION_REQUIRES_VALIDATION_BEFORE_MORE_IMPLEMENTATION',
    acceptedLiveProduct: 'CP2',
    round2VisibleAdvancement: 'ZERO'
  },
  frozenSources: {
    acceptedCp2Renderer: {
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
    b4ClassificationAuthority: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs',
      blob: '421260d8cbe371a4edc871d3607af9817201bb6c'
    },
    b4MetricImplementation: {
      path: 'h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage-browser.mjs',
      blob: 'd136e3536df751a8a11616ba387742fabbefd065'
    },
    b4ExecutionRunner: {
      path: 'h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage.runner.mjs',
      blob: '61b5da5e0cff43c1fde17084e311417ce6f42c9d'
    },
    b4Workflow: {
      path: '.github/workflows/h-earth-b4-morphology-leverage-classification.yml',
      blob: 'ea9f14367f895cb00f542b053c9041d6fbca911c'
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
  frozenMetricBasis: {
    viewport: { width: 960, height: 540, pixelRatio: 1 },
    normalizedAnalysisSize: { width: 256, height: 256 },
    gaussianSigmasPixels: [2, 8, 24],
    orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
    lagsPixels: [4, 8, 12, 16, 24, 32, 48, 64],
    sceneCount: 8,
    metricFamily: 'ABSOLUTE_DIRECTIONAL_AUTOCORRELATION_OVER_MICRO_MESO_MACRO_LUMINANCE_BANDS'
  },
  frozenB4Evidence: {
    workflowRunId: 30559537489,
    jobId: 90928669322,
    executedHead: 'c68377e35f17d0f98cd74dbce2bef4e692e19352',
    canonicalReceiptSha256: '4e26e343a3d9940a63f0fd9313ca440bcd2e0ed6115d0b28133561f7441359e6',
    artifactId: 8766326769,
    artifactSha256: '0b3c438e2b96456f0ea4f096606c903386ba3b44a1b60e855286837bad8821ac',
    acceptedCp2FinalFrameRepetitionScore: 0.8081230868576569,
    executionIntegrityFailureCount: 0,
    acceptedRendererEquivalenceSceneCount: 8
  },
  plannedDiagnosticPasses: {
    A: 'HEIGHTFIELD_AS_GRAYSCALE_ELEVATION',
    B: 'SLOPE_MAGNITUDE',
    C: 'SURFACE_NORMAL_COMPONENTS',
    D: 'DEPTH_ONLY',
    E: 'SILHOUETTE_AND_MAJOR_EDGES_ONLY',
    F: 'CONSTANT_MATERIAL_WITH_ACCEPTED_LIGHTING',
    G: 'ACCEPTED_MATERIAL_WITH_FLAT_LIGHTING',
    H: 'ACCEPTED_CP2_FINAL_FRAME'
  },
  exactPathScope: [
    '.github/workflows/h-earth-ma0-audit-basis-freeze.yml',
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma0-audit-basis-freeze.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma0-audit-basis-freeze.mjs'
  ],
  prohibitedWork: [
    'DIAGNOSTIC_RENDER_PASS_IMPLEMENTATION',
    'SCENE_RENDER_EXECUTION',
    'METRIC_RECALCULATION',
    'PRODUCT_CANDIDATE',
    'PRODUCT_HEIGHTFIELD_MUTATION',
    'RENDERER_MUTATION',
    'MATERIAL_OR_LIGHTING_MUTATION',
    'LIVE_ROUTE_CHANGE',
    'MA1_EXECUTION'
  ],
  boundaries: {
    productMutationPerformed: false,
    diagnosticRendererConstructionStarted: false,
    sceneExecutionStarted: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA0_FREEZE_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'MA1_REPRODUCE_EXISTING_METRIC',
  result: 'MA0_AUDIT_BASIS_FREEZE_PASS_CLOSED'
});

export default H_EARTH_MA0_AUDIT_BASIS_FREEZE_v1;
