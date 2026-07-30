import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA5_CROSS_PASS_CORRESPONDENCE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA5_CROSS_PASS_CORRESPONDENCE_v1',
  checkpoint: 'MA5',
  status: 'FIXED_A_THROUGH_H_CROSS_PASS_CORRESPONDENCE_MATRIX',
  authorityQuestion: 'WHICH_DIAGNOSTIC_PASS_REPRODUCES_THE_FINAL_FRAME_ORIENTATION_AND_WAVELENGTH',
  controllingMA4Merge: 'ad151f7ba98c0d16badf3ba0183ed3e21b516559',
  sourceEvidence: {
    ma3: {
      result: 'MA3_PASSES_A_THROUGH_D_PASS_CLOSED',
      canonicalReceiptSha256: 'e85c7cdcc9ea3b22686b63542ef43b25c3b546614ff0fe5c4f706755d1630ba6',
      workflowRunId: 30565119792,
      jobId: 90947594738,
      artifactId: 8768511411,
      artifactSha256: '5e9d8f04c2bccaaa3dc103dc696bcf0c4f610c9079a34e93a54663e769e1d094'
    },
    ma4: {
      result: 'MA4_PASSES_E_THROUGH_H_PASS_CLOSED',
      canonicalReceiptSha256: '2ad7f10e86a3e8bdd1e9e06c415daa55da870b9f977155b247da8907fe4bc958',
      workflowRunId: 30565504244,
      jobId: 90948893637,
      artifactId: 8768674259,
      artifactSha256: '7cdf75ae0d85eddcdc4633a6d8a344e4ee7097bd3d78bf0a9dbd8e0bc59398ad'
    }
  },
  frozenSources: ma0.frozenSources,
  matrix: {
    expectedCanonicalSha256: '9463cf860a13cdbd38f3f5f7f24b27b15b958ecf1d3a3324557906fe8f940811',
    referencePass: 'H',
    comparisonPassCount: 7,
    sceneCount: 8,
    bandCountPerScene: 3,
    exactBandComparisonCountPerPass: 24,
    causalClassificationPerformed: false
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma5-cross-pass-correspondence.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma5-cross-pass-correspondence-matrix.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma5-cross-pass-correspondence.runner.mjs',
    'h-earth-3d/research/metric-attribution/H_EARTH_MA5_CROSS_PASS_CORRESPONDENCE_SUMMARY.md'
  ],
  prohibitedWork: [
    'NEW_RENDER_EXECUTION',
    'METRIC_PARAMETER_CHANGE',
    'CAUSAL_CLASSIFICATION',
    'PRODUCT_RECOMMENDATION',
    'PRODUCT_CANDIDATE',
    'GEOMETRY_MUTATION',
    'MATERIAL_MUTATION',
    'LIGHTING_MUTATION',
    'LIVE_ROUTE_CHANGE'
  ],
  boundaries: {
    productMutationPerformed: false,
    newRenderingPerformed: false,
    causalClassificationPerformed: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA5_CORRESPONDENCE_MATRIX'
  },
  nextAuthorizedCheckpointOnPass: 'MA6_CAUSAL_CLASSIFICATION_AND_RESEARCH_HANDOFF',
  result: 'MA5_CROSS_PASS_CORRESPONDENCE_PASS_CLOSED'
});

export default H_EARTH_MA5_CROSS_PASS_CORRESPONDENCE_v1;
