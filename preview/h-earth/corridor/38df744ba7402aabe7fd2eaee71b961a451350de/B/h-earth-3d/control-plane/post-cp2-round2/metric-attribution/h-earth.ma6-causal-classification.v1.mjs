import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA6_CAUSAL_CLASSIFICATION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA6_CAUSAL_CLASSIFICATION_v1',
  checkpoint: 'MA6',
  status: 'FIXED_CAUSAL_CLASSIFICATION_AND_RESEARCH_HANDOFF',
  authorityQuestion: 'WHAT_DOES_THE_VERIFIED_A_THROUGH_H_CORRESPONDENCE_ESTABLISH_AND_WHAT_RESEARCH_OPERATION_IS_AUTHORIZED_NEXT',
  controllingMA5Merge: '30750006bce953c002f47d89f314faca83b224f1',
  sourceEvidence: {
    ma5Result: 'MA5_CROSS_PASS_CORRESPONDENCE_PASS_CLOSED',
    ma5CanonicalReceiptSha256: '7c4913af311c77ba4121c31c2c29f86b265bae76bc6bf11e783360bdfdf959cc',
    ma5CanonicalMatrixSha256: '9463cf860a13cdbd38f3f5f7f24b27b15b958ecf1d3a3324557906fe8f940811',
    ma5WorkflowRunId: 30567031631,
    ma5JobId: 90954013381,
    ma5ArtifactId: 8769245958,
    ma5ArtifactSha256: '1358f3ea4b9a5668134ace5a77c809f52496a4eb2eb048a132b4c43de4e9fdee'
  },
  frozenSources: ma0.frozenSources,
  matchGate: {
    exactBandMatchFractionMinimum: 0.75,
    meanBandGridPearsonMinimum: 0.75,
    sceneScorePearsonMinimum: 0.75,
    meanPeakStrengthRatioMinimum: 0.85,
    dominantSceneExactMatchFractionMinimum: 0.75,
    aggregateScoreRatioMinimum: 0.90,
    allTermsRequired: true
  },
  categoryMap: {
    structuralGeometry: ['A', 'B'],
    geometryLightingInteraction: ['C', 'F'],
    cameraVisibleMacroForm: ['D', 'E'],
    material: ['G']
  },
  selectionLaw: {
    qualifyingPass: 'ALL_MATCH_GATE_TERMS_PASS',
    primaryPass: 'HIGHEST_CORRESPONDENCE_COMPOSITE_AMONG_QUALIFYING_PASSES',
    primaryCategory: 'CATEGORY_CONTAINING_PRIMARY_PASS',
    secondaryCategories: 'OTHER_CATEGORIES_WITH_AT_LEAST_ONE_QUALIFYING_PASS',
    invalidOrUnderdefined: 'NO_PASS_QUALIFIES_OR_EXECUTION_INTEGRITY_FAILS'
  },
  expectedClassification: {
    qualifyingPasses: ['C', 'G'],
    nonqualifyingPasses: ['A', 'B', 'D', 'E', 'F'],
    primaryPass: 'G',
    primaryCategory: 'MATERIAL_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC',
    secondaryCategories: ['GEOMETRY_LIGHTING_INTERACTION_ESTABLISHED_FOR_CURRENT_METRIC'],
    structuralGeometryCause: 'NOT_ESTABLISHED_BY_CURRENT_METRIC',
    cameraVisibleMacroFormCause: 'NOT_ESTABLISHED_BY_CURRENT_METRIC',
    currentMetricStatus: 'VALID_AS_MATERIAL_DOMINANT_REPETITION_DETECTOR_WITH_SECONDARY_GEOMETRY_LIGHTING_SENSITIVITY',
    humanVisibleDefectCause: 'NOT_FULLY_ESTABLISHED',
    productCandidateAuthorized: false
  },
  nextResearchOperation: {
    operationId: 'H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1',
    class: 'DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION',
    referencePasses: ['G', 'H'],
    question: 'WHICH_ACCEPTED_CP2_MATERIAL_SUBSIGNALS_GENERATE_THE_MATCHED_REPETITION_SIGNATURE_WITHOUT_CARRYING_THE_USEFUL_MANOR_CAVERN_AND_TERRAIN_READABILITY_CUES',
    requiredFamilies: [
      'BROAD_MEDIUM_GRAIN_AND_MACRO_MESO_DETAIL_FIELDS',
      'STRATA_CROSS_GRAIN_AND_FACE_BANDS',
      'CREST_TERRACE_AND_CONTACT_SIGNALS',
      'CONTOUR_AND_SLOPE_RAKE',
      'MANOR_LOCAL_MATERIAL_AND_CONTACT_CUES',
      'CAVERN_LOCAL_MATERIAL_AND_CONTACT_CUES',
      'BASE_COLOR_AND_ROLE_BLEND'
    ],
    requiredMethod: 'ONE_FAMILY_AT_A_TIME_DIAGNOSTIC_ABLATION_USING_FROZEN_GEOMETRY_CAMERA_LIGHTING_AND_METRIC_GRID',
    stoppingBoundary: 'STOP_AFTER_SUBSIGNAL_CAUSAL_ATTRIBUTION_AND_USEFUL_CUE_RETENTION_REPORT',
    productImplementationAuthorized: false,
    liveAdmissionAuthorized: false
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma6-causal-classification.v1.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_PACKET.v1.json',
    'h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_HANDOFF.md',
    'h-earth-3d/validation/metric-attribution/h-earth.ma6-causal-classification.runner.mjs'
  ],
  prohibitedWork: [
    'NEW_RENDER_EXECUTION',
    'NEW_PRODUCT_CANDIDATE',
    'PRODUCT_HEIGHTFIELD_MUTATION',
    'PRODUCT_RENDERER_MUTATION',
    'PRODUCT_MATERIAL_MUTATION',
    'PRODUCT_LIGHTING_MUTATION',
    'METRIC_PARAMETER_CHANGE',
    'LIVE_ROUTE_CHANGE',
    'USER_DIFFERENTIAL'
  ],
  boundaries: {
    productMutationPerformed: false,
    newRenderingPerformed: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA6_RESEARCH_HANDOFF_RECEIPT'
  },
  result: 'MA6_CAUSAL_CLASSIFICATION_AND_RESEARCH_HANDOFF_PASS_CLOSED'
});

export default H_EARTH_MA6_CAUSAL_CLASSIFICATION_v1;
