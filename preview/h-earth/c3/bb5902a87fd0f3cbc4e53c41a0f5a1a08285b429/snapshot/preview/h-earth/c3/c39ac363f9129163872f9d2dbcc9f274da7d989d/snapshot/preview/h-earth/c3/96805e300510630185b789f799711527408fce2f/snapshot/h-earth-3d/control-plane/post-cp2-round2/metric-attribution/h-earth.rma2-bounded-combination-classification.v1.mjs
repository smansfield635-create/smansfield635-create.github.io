import rma0 from './h-earth.rma0-material-family-freeze.v1.mjs';
import rma1 from './h-earth.rma1-single-family-ablations.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_RMA2_BOUNDED_COMBINATION_CLASSIFICATION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_RMA2_BOUNDED_COMBINATION_CLASSIFICATION_v1',
  checkpoint: 'RMA2',
  operation: rma0.operation,
  class: rma0.class,
  status: 'FIXED_TOP_TWO_SINGLE_FAMILY_BOUNDED_COMBINATION_CLASSIFICATION',
  authorityQuestion: 'DOES_THE_ONLY_AUTHORIZED_TOP_TWO_FAMILY_COMBINATION_CARRY_THE_MATCHED_REPETITION_SIGNATURE',
  controllingRMA1Merge: '7d2d7cc7d4a396d503be1897236e935030743dc5',
  controllingRMA1Result: rma1.result,
  controllingRMA1ReceiptSha256: '46da9584383cbcf2bbd543e65f3ba4280e11be6cc5e8e64a7e96bedc4f65a7c3',
  controllingRMA1ArtifactId: 8770862745,
  controllingRMA1ArtifactSha256: 'faf7283a97b2f457dbcddf5d2752399e5b32c87e462b153d4314e1deda7767d8',
  rma1Disposition: {
    singleFamilyPassKeys: [],
    rankedFamilyKeys: ['FAMILY_5', 'FAMILY_4', 'FAMILY_2', 'FAMILY_6', 'FAMILY_7', 'FAMILY_3', 'FAMILY_1'],
    topFamily: {
      key: 'FAMILY_5',
      id: 'MANOR_LOCAL_MATERIAL_AND_CONTACT_CUES',
      causalImpactComposite: 0.2243737767049496
    },
    secondFamily: {
      key: 'FAMILY_4',
      id: 'CONTOUR_AND_SLOPE_RAKE',
      causalImpactComposite: 0.1779670254235749
    }
  },
  frozenSources: {
    ...rma0.frozenSources,
    rma1Control: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma1-single-family-ablations.v1.mjs',
      blob: 'ea95b4a5c7a0966f621c17efd64b6b070dc087f9'
    },
    rma1BrowserAuthority: {
      path: 'h-earth-3d/validation/metric-attribution/h-earth.rma1-single-family-ablations-browser.mjs',
      blob: '18ac804d8969b0da11f0fb51666c3e7cb1142894'
    }
  },
  referencePasses: rma0.referencePasses,
  viewport: rma0.viewport,
  normalizedAnalysisSize: rma0.normalizedAnalysisSize,
  finalFrameMetric: rma0.finalFrameMetric,
  scenes: rma0.scenes,
  causalGate: rma0.singleFamilyCausalGate,
  combination: {
    key: 'COMBINATION_FAMILY_5_PLUS_FAMILY_4',
    members: ['FAMILY_5', 'FAMILY_4'],
    familyIds: ['MANOR_LOCAL_MATERIAL_AND_CONTACT_CUES', 'CONTOUR_AND_SLOPE_RAKE'],
    exactCombinationCount: 1,
    thirdFamilyIncluded: false,
    parameterTuningPerformed: false,
    neutralizationLaw: 'APPLY_THE_FROZEN_FAMILY_4_NEUTRALIZATION_AND_REMOVE_ONLY_THE_FROZEN_FAMILY_5_MANOR_LOCAL_BLOCK'
  },
  gates: {
    exactSceneCount: 8,
    exactPassCount: 3,
    exactOutputCount: 24,
    deterministicReplayCount: 2,
    hOfficialColorEquivalenceSceneCount: 8,
    hOfficialDepthEquivalenceSceneCount: 8,
    hAggregateAbsoluteTolerance: 1e-12,
    gToHCorrespondenceTolerance: 1e-9,
    minimumEligiblePixelCount: 1000,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  classificationLaw: {
    combinationCausal: 'ALL_FROZEN_CAUSAL_GATE_TERMS_PASS',
    noMaterialCulpritEstablished: 'ONE_OR_MORE_FROZEN_CAUSAL_GATE_TERMS_FAIL',
    productCandidateAuthorized: false,
    nextCheckpointAlways: 'RMA3_USEFUL_CUE_RETENTION_AND_FINAL_RESEARCH_DISPOSITION'
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma2-bounded-combination-classification.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma2-bounded-combination-classification-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma2-bounded-combination-classification-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.rma2-bounded-combination-classification.runner.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_RMA2_BOUNDED_COMBINATION_CLASSIFICATION.md'
  ],
  prohibitedWork: [
    'SECOND_COMBINATION',
    'THIRD_FAMILY',
    'PARAMETER_TUNING',
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
    exactCombinationCount: 1,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_RMA2_BOUNDED_COMBINATION_CLASSIFICATION'
  },
  nextAuthorizedCheckpointOnPass: 'RMA3_USEFUL_CUE_RETENTION_AND_FINAL_RESEARCH_DISPOSITION',
  result: 'RMA2_BOUNDED_COMBINATION_CLASSIFICATION_PASS_CLOSED'
});

export default H_EARTH_RMA2_BOUNDED_COMBINATION_CLASSIFICATION_v1;
