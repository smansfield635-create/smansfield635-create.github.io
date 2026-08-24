import rma0 from './h-earth.rma0-material-family-freeze.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_RMA1_SINGLE_FAMILY_ABLATIONS_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_RMA1_SINGLE_FAMILY_ABLATIONS_v1',
  checkpoint: 'RMA1',
  operation: rma0.operation,
  class: rma0.class,
  status: 'FIXED_SEVEN_SINGLE_FAMILY_DIAGNOSTIC_ABLATIONS',
  authorityQuestion: 'WHAT_REPETITION_SIGNATURE_REMAINS_WHEN_EACH_ACCEPTED_CP2_MATERIAL_FAMILY_IS_NEUTRALIZED_IN_ISOLATION',
  controllingRMA0Merge: 'a929ffdd7a2bd64524965af7213655035e0bbf0e',
  controllingRMA0Result: rma0.result,
  controllingRMA0ReceiptSha256: '29b257be7bddfed573a7c4db99f6e152258a4a04cf05e4ac7572909441eb323e',
  frozenSources: rma0.frozenSources,
  referencePasses: rma0.referencePasses,
  viewport: rma0.viewport,
  normalizedAnalysisSize: rma0.normalizedAnalysisSize,
  finalFrameMetric: rma0.finalFrameMetric,
  scenes: rma0.scenes,
  materialFamilies: rma0.materialFamilies,
  singleFamilyCausalGate: rma0.singleFamilyCausalGate,
  acceptedReference: rma0.acceptedReference,
  passKeys: ['G', 'H', ...rma0.materialFamilies.map((family) => family.key)],
  gates: {
    exactSceneCount: 8,
    exactReferencePassCount: 2,
    exactFamilyCount: 7,
    exactDiagnosticPassCount: 9,
    exactOutputCount: 72,
    deterministicReplayCount: 2,
    hOfficialColorEquivalenceSceneCount: 8,
    hOfficialDepthEquivalenceSceneCount: 8,
    hAggregateAbsoluteTolerance: 1e-12,
    gToHCorrespondenceTolerance: 1e-9,
    minimumEligiblePixelCount: 1000,
    minimumDistinctSceneCountPerFamily: 1,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma1-single-family-ablations.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma1-single-family-ablations-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma1-single-family-ablations-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.rma1-single-family-ablations.runner.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_RMA1_SINGLE_FAMILY_ABLATION_MATRIX.md'
  ],
  prohibitedWork: [
    'MULTI_FAMILY_ABLATION',
    'MORPHOLOGY_PROBE',
    'WHOLE_BAKED_MAP',
    'GENERAL_SHADER_REPLACEMENT',
    'PRODUCT_CANDIDATE',
    'PRODUCT_RENDERER_MUTATION',
    'PRODUCT_MATERIAL_MUTATION',
    'PRODUCT_LIGHTING_MUTATION',
    'GEOMETRY_MUTATION',
    'CAMERA_MUTATION',
    'SCENE_MUTATION',
    'VIEWPORT_MUTATION',
    'METRIC_PARAMETER_CHANGE',
    'LIVE_ROUTE_CHANGE',
    'USER_DIFFERENTIAL'
  ],
  boundaries: {
    productMutationPerformed: false,
    multiFamilyAblationExecuted: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_RMA1_SINGLE_FAMILY_ABLATION_MATRIX'
  },
  nextAuthorizedCheckpointOnPass: 'RMA2_SUBSIGNAL_CAUSAL_CLASSIFICATION',
  result: 'RMA1_SINGLE_FAMILY_ABLATION_MATRIX_PASS_CLOSED'
});

export default H_EARTH_RMA1_SINGLE_FAMILY_ABLATIONS_v1;
