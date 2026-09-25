import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';
import ma2 from './h-earth.ma2-diagnostic-pass-authority.v1.mjs';
import ma4 from './h-earth.ma4-passes-e-through-h.v1.mjs';
import ma6 from './h-earth.ma6-causal-classification.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE_v1',
  checkpoint: 'RMA0',
  operation: 'H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1',
  class: 'DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION',
  status: 'FIXED_PASS_G_PASS_H_AND_SEVEN_MATERIAL_FAMILY_AUTHORITY',
  authorityQuestion: 'WHAT_EXACT_CP2_MATERIAL_FAMILIES_MAY_BE_NEUTRALIZED_ONE_AT_A_TIME_WITHOUT_CHANGING_PRODUCT_SOURCES_OR_THE_AUDIT_BASIS',
  controllingMA6Merge: 'd7dab9b1416162688c097d290b461474c3c0e603',
  controllingMA6Result: ma6.result,
  controllingMA6ReceiptSha256: '904d976c72c6f52d93814dc6c4ce584caf47ca349f90d9f324709c04071c060f',
  controllingMA5MatrixSha256: '9463cf860a13cdbd38f3f5f7f24b27b15b958ecf1d3a3324557906fe8f940811',
  frozenSources: {
    ...ma0.frozenSources,
    diagnosticRendererUtility: {
      path: 'h-earth-3d/validation/metric-attribution/h-earth.metric-attribution-diagnostic-renderer.v1.mjs',
      blob: '4760fb99726c91da51a8046b4aa1d6e680932315'
    },
    directionalMetricUtility: {
      path: 'h-earth-3d/validation/metric-attribution/h-earth.metric-attribution-directional-metric.v1.mjs',
      blob: '10cf5bce75ddd2ea9a1974912702fdeb96b4c44d'
    },
    ma2BrowserAuthority: {
      path: 'h-earth-3d/validation/metric-attribution/h-earth.ma2-diagnostic-pass-authority-browser.mjs',
      blob: 'e24161cc7b0888156087f88013be2e6117fe5784'
    },
    ma4ExecutionAuthority: {
      path: 'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma4-passes-e-through-h.v1.mjs',
      blob: 'c4ea563b3cda75af6164c9ff45e264b7eb6cdfd9'
    },
    ma6ResearchPacket: {
      path: 'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_PACKET.v1.json',
      blob: 'f65d2ea639a529f487592a0073fc6d9e76aa51f5'
    },
    ma6ResearchHandoff: {
      path: 'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_HANDOFF.md',
      blob: 'f3cc824ee70158dbf38177a114803e7567822166'
    }
  },
  referencePasses: {
    G: ma2.passes.G,
    H: ma2.passes.H
  },
  viewport: ma4.viewport,
  normalizedAnalysisSize: ma4.normalizedAnalysisSize,
  finalFrameMetric: ma4.finalFrameMetric,
  scenes: ma4.scenes,
  acceptedReference: {
    gAggregateScore: 0.8037069379617777,
    hAggregateScore: 0.8081230868576569,
    gToHExactBandMatchCount: 23,
    gToHBandComparisonCount: 24,
    gToHMeanBandGridPearson: 0.9795210903175875,
    gToHSceneScorePearson: 0.9923694320951161,
    gToHMeanPeakStrengthRatio: 0.9804080305101164,
    gToHDominantSceneExactMatchCount: 7,
    gToHAggregateScoreRatio: 0.9945351868190059
  },
  materialFamilies: [
    {
      key: 'FAMILY_1',
      id: 'BROAD_MEDIUM_GRAIN_MACRO_MESO_DETAIL_FIELDS',
      scope: ['broad', 'medium', 'grain', 'macroField', 'mesoField', 'detailField'],
      neutralizationLaw: 'REPLACE_EACH_SPATIAL_NOISE_FIELD_WITH_CONSTANT_0_5',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_2',
      id: 'STRATA_CROSS_GRAIN_FACE_BANDS',
      scope: ['strata', 'crossGrain', 'faceBandA', 'faceBandB', 'faceBandC'],
      neutralizationLaw: 'REPLACE_EACH_STABLE_WAVE_OUTPUT_WITH_CONSTANT_0_5',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_3',
      id: 'CREST_TERRACE_CONTACT_SIGNALS',
      scope: ['crestSignal', 'terraceSignal', 'crestContact', 'terraceContact', 'sharedFaceContact'],
      neutralizationLaw: 'SET_WAVE_SIGNALS_TO_0_5_AND_CONTACT_SIGNALS_TO_0_0',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_4',
      id: 'CONTOUR_AND_SLOPE_RAKE',
      scope: ['contourLine', 'slopeRake'],
      neutralizationLaw: 'SET_CONTOUR_TO_0_0_AND_SLOPE_RAKE_TO_0_5',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_5',
      id: 'MANOR_LOCAL_MATERIAL_AND_CONTACT_CUES',
      scope: ['manorCenter', 'manorEnvelope', 'manorContact', 'manorStone', 'manorChromatic'],
      neutralizationLaw: 'REMOVE_ONLY_THE_MANOR_LOCAL_MATERIAL_AND_CONTACT_BLOCK_FROM_THE_DIAGNOSTIC_SHADER',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_6',
      id: 'CAVERN_LOCAL_MATERIAL_AND_CONTACT_CUES',
      scope: ['cavernCenter', 'cavernRelation', 'cavernGroundContact', 'cavernStone', 'cavernRelationSignal'],
      neutralizationLaw: 'REMOVE_ONLY_THE_CAVERN_LOCAL_MATERIAL_AND_CONTACT_BLOCK_FROM_THE_DIAGNOSTIC_SHADER',
      productSourceMutation: false
    },
    {
      key: 'FAMILY_7',
      id: 'BASE_COLOR_AND_ROLE_BLEND',
      scope: ['base', 'paletteBaseMix', 'waterRoleBlend', 'vegetationRoleBlend'],
      neutralizationLaw: 'USE_NEUTRAL_BASE_COLOR_AND_REMOVE_NON_TERRAIN_ROLE_COLOR_VARIATION_IN_THE_DIAGNOSTIC_SHADER',
      productSourceMutation: false
    }
  ],
  singleFamilyCausalGate: {
    allTermsRequired: true,
    aggregateRepetitionReductionMinimum: 0.06,
    meanBandGridPearsonDropFromGMinimum: 0.08,
    exactBandMatchDropFromGMinimum: 3,
    sceneScoreReductionCountMinimum: 5,
    causalImpactCompositeMinimum: 0.08
  },
  boundedCombinationLaw: {
    executeOnlyWhenNoSingleFamilyPasses: true,
    exactCombinationCountMaximum: 1,
    members: 'TOP_TWO_SINGLE_FAMILIES_BY_CAUSAL_IMPACT_COMPOSITE',
    noThirdFamily: true,
    noParameterTuning: true
  },
  usefulCueRetentionGate: {
    manorDifferentiationRatioMinimum: 0.85,
    cavernThresholdRatioMinimum: 0.85,
    terrainGradientRatioMinimum: 0.90,
    regressionSceneStructuralSimilarityMinimum: 0.90,
    exactRegressionSceneMinimum: 5,
    allTermsRequiredForRemovableCulprit: true
  },
  outcomeLaw: {
    removableCulprit: 'REPETITION_CAUSAL_AND_ALL_USEFUL_CUE_RETENTION_GATES_PASS',
    signalSeparationRequired: 'REPETITION_CAUSAL_AND_ONE_OR_MORE_USEFUL_CUE_RETENTION_GATES_FAIL',
    perceptualComparisonRequired: 'NO_SINGLE_OR_BOUNDED_COMBINATION_PASSES_THE_CAUSAL_GATE_OR_HUMAN_VISIBLE_DEFECT_CORRESPONDENCE_REMAINS_NOT_ESTABLISHED'
  },
  exactPathScope: [
    '.github/workflows/h-earth-metric-attribution-audit.yml',
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.rma0-material-family-freeze.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.rma0-material-family-freeze.runner.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE.md'
  ],
  prohibitedWork: [
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
    diagnosticAblationExecuted: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_RMA0_FAMILY_REGISTRY_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'RMA1_ONE_FAMILY_AT_A_TIME_DIAGNOSTIC_ABLATIONS',
  result: 'RMA0_MATERIAL_FAMILY_FREEZE_PASS_CLOSED'
});

export default H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE_v1;
