import rma0 from './h-earth.rma0-material-family-freeze.v1.mjs';
import rma2 from './h-earth.rma2-bounded-combination-classification.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_RMA3_FINAL_RESEARCH_DISPOSITION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_RMA3_FINAL_RESEARCH_DISPOSITION_v1',
  checkpoint: 'RMA3',
  operation: rma0.operation,
  class: rma0.class,
  status: 'FINAL_RESULT_3_RESEARCH_DISPOSITION',
  authorityQuestion: 'WHAT_PRACTICAL_DIRECTION_IS_AUTHORIZED_AFTER_NO_SINGLE_FAMILY_OR_BOUNDED_COMBINATION_PASSES_THE_FROZEN_CAUSAL_GATE',
  controllingRMA2Merge: 'eb6da2910c6895f4a2f3f64a72823cb286e70231',
  controllingRMA2Result: rma2.result,
  evidence: {
    ma6: {
      mergeCommit: 'd7dab9b1416162688c097d290b461474c3c0e603',
      result: 'MA6_CAUSAL_CLASSIFICATION_AND_RESEARCH_HANDOFF_PASS_CLOSED',
      receiptSha256: '904d976c72c6f52d93814dc6c4ce584caf47ca349f90d9f324709c04071c060f',
      artifactId: 8770286691,
      artifactSha256: '4f77b136ffd4fc3a634902bd81d180f7526b92bc48c11fe4c1c5fb089e8e2400'
    },
    rma0: {
      mergeCommit: 'a929ffdd7a2bd64524965af7213655035e0bbf0e',
      result: 'RMA0_MATERIAL_FAMILY_FREEZE_PASS_CLOSED',
      receiptSha256: '29b257be7bddfed573a7c4db99f6e152258a4a04cf05e4ac7572909441eb323e',
      artifactId: 8770531965,
      artifactSha256: 'c193f75085a307cf8d6276538ed01ff691a88ed88f3c0a54d5f588795d654387'
    },
    rma1: {
      mergeCommit: '7d2d7cc7d4a396d503be1897236e935030743dc5',
      result: 'RMA1_SINGLE_FAMILY_ABLATION_MATRIX_PASS_CLOSED',
      receiptSha256: '46da9584383cbcf2bbd543e65f3ba4280e11be6cc5e8e64a7e96bedc4f65a7c3',
      artifactId: 8770862745,
      artifactSha256: 'faf7283a97b2f457dbcddf5d2752399e5b32c87e462b153d4314e1deda7767d8',
      singleFamilyPassKeys: [],
      rankedFamilyKeys: ['FAMILY_5', 'FAMILY_4', 'FAMILY_2', 'FAMILY_6', 'FAMILY_7', 'FAMILY_3', 'FAMILY_1']
    },
    rma2: {
      mergeCommit: 'eb6da2910c6895f4a2f3f64a72823cb286e70231',
      result: 'RMA2_BOUNDED_COMBINATION_CLASSIFICATION_PASS_CLOSED',
      receiptSha256: '25b82751239ae5127a8e1dc4cd6ca69763b1f37f1c95e318d4a21e41e54230bc',
      artifactId: 8771113889,
      artifactSha256: '3752738a4cf15607ff4a717c0fdedab00917d6124e46bc19035c464cb03e284a',
      classification: 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_CAUSAL_GATE',
      combination: ['FAMILY_5', 'FAMILY_4'],
      combinationMetrics: {
        aggregateScore: 0.8081925288265571,
        gAggregateScore: 0.8037068451607313,
        aggregateRepetitionReductionFromG: -0.005581243575110675,
        meanBandGridPearsonDropFromG: 0.05940233104831438,
        exactBandMatchDropFromG: 2,
        sceneScoreReductionCount: 6,
        causalImpactComposite: 0.22318391609541194
      }
    }
  },
  frozenSources: {
    ...rma0.frozenSources,
    rma1Control: rma2.frozenSources.rma1Control,
    rma1BrowserAuthority: rma2.frozenSources.rma1BrowserAuthority,
    rma2Control: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma2-bounded-combination-classification.v1.mjs',
      blob: '03bb9260c85e00fe7a52bf154e9ad37eb9c1eb3a'
    },
    rma2BrowserAuthority: {
      path: 'h-earth-3d/validation/metric-attribution/h-earth.rma2-bounded-combination-classification-browser.mjs',
      blob: '8106ca02ed932c6e96823ca5c9574a647a328ee6'
    }
  },
  mechanicalDisposition: {
    programResult: 'RESULT_3_NO_MATERIAL_FAMILY_EXPLAINS_THE_VISIBLE_COMPLAINT_UNDER_CURRENT_METRIC',
    metricSubsignalCause: 'NOT_IDENTIFIED_BY_FROZEN_CAUSAL_GATE',
    humanVisibleDefectCorrespondence: 'NOT_ESTABLISHED',
    usefulCueRetentionTest: 'NOT_APPLICABLE_NO_CAUSAL_SUPPRESSION_IDENTIFIED',
    scalarMetricMayGovernAnotherImplementation: false,
    anotherMorphologyProbeAuthorized: false,
    anotherWholeBakedMapAuthorized: false,
    anotherGeneralShaderAuthorized: false,
    productCandidateAuthorized: false,
    liveCandidateAuthorized: false,
    acceptedLiveProductRemains: 'CP2'
  },
  reasoningLaw: {
    result1RemovableCulprit: false,
    result2SignalSeparationRequired: false,
    result3PerceptualCorrespondenceRequired: true,
    retentionNotApplicableReason: 'NO_SUPPRESSION_PASSED_THE_CAUSAL_GATE_SO_RETENTION_CANNOT_VALIDATE_A_NONCAUSAL_PRODUCT_DIRECTION'
  },
  nextAuthorizedOperation: {
    operationId: 'H_EARTH_CP2_MEASURED_SIGNATURE_PERCEPTUAL_CORRESPONDENCE_TEST_v1',
    class: 'LIMITED_DIAGNOSTIC_USER_PERCEPTUAL_COMPARISON_NO_PRODUCT_MUTATION',
    question: 'IS_THE_CP2_MATERIAL_SIGNATURE_MEASURED_BY_THE_SCALAR_METRIC_THE_SAME_REPETITION_PATTERN_THE_USER_OBJECTS_TO',
    comparisonAuthority: [
      'ACCEPTED_CP2_PASS_H',
      'ACCEPTED_MATERIAL_FLAT_LIGHTING_PASS_G',
      'BOUNDED_DIAGNOSTIC_VISUALIZATIONS_OF_THE_MEASURED_ORIENTATION_AND_LAG_SIGNATURE'
    ],
    prohibitedBeforeUserCorrespondence: [
      'PRODUCT_CANDIDATE',
      'LIVE_ADMISSION',
      'MATERIAL_SYSTEM_REPLACEMENT',
      'MORPHOLOGY_WORK',
      'METRIC_DRIVEN_IMPLEMENTATION'
    ],
    userInputRequiredDuringRMA3: false,
    userInputRequiredForNextOperation: true
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma3-final-research-disposition.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma3-final-research-disposition.runner.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_RMA0_THROUGH_RMA3_FINAL_RESEARCH_PACKET.v1.json',
    'h-earth-3d/research/metric-attribution/H_EARTH_RMA0_THROUGH_RMA3_FINAL_RESEARCH_HANDOFF.md'
  ],
  prohibitedWork: [
    'NEW_RENDER_EXECUTION',
    'USEFUL_CUE_RETENTION_CLAIM_WITHOUT_CAUSAL_SUPPRESSION',
    'MORPHOLOGY_PROBE',
    'WHOLE_BAKED_MAP',
    'GENERAL_SHADER_REPLACEMENT',
    'PRODUCT_CANDIDATE',
    'PRODUCT_RENDERER_MUTATION',
    'PRODUCT_MATERIAL_MUTATION',
    'PRODUCT_LIGHTING_MUTATION',
    'GEOMETRY_MUTATION',
    'LIVE_ROUTE_CHANGE',
    'USER_DIFFERENTIAL_DURING_RMA3'
  ],
  boundaries: {
    productMutationPerformed: false,
    newRenderExecutionPerformed: false,
    usefulCueRetentionExecutionPerformed: false,
    usefulCueRetentionStatus: 'NOT_APPLICABLE_NO_CAUSAL_SUPPRESSION_IDENTIFIED',
    liveRouteChanged: false,
    userDifferentialRequiredDuringRMA3: false,
    stop: 'STOP_AFTER_RMA3_FINAL_RESEARCH_DISPOSITION'
  },
  result: 'RMA3_FINAL_RESEARCH_DISPOSITION_PASS_CLOSED'
});

export default H_EARTH_RMA3_FINAL_RESEARCH_DISPOSITION_v1;
