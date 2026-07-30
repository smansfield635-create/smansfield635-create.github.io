import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';
import b4 from '../morphology/h-earth.b4-morphology-leverage-classification.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA1_EXISTING_METRIC_REPRODUCTION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA1_EXISTING_METRIC_REPRODUCTION_v1',
  checkpoint: 'MA1',
  status: 'FIXED_ACCEPTED_CP2_METRIC_REPRODUCTION',
  authorityQuestion: 'CAN_THE_AUDIT_REPRODUCE_THE_B4_CP2_SCORE_WITHOUT_NEW_DIAGNOSTIC_RENDER_PASSES',
  controllingMA0Merge: '6cf0b743bad7c70aa20937485cbe968777db159e',
  controllingMA0Result: ma0.result,
  acceptedRenderer: ma0.frozenSources.acceptedCp2Renderer,
  canonicalTerrainField: ma0.frozenSources.canonicalTerrainField,
  canonicalRenderPackage: ma0.frozenSources.canonicalRenderPackage,
  canonicalGpuUploadViews: ma0.frozenSources.canonicalGpuUploadViews,
  navigationAuthority: ma0.frozenSources.navigationAuthority,
  permanentEightSceneControl: ma0.frozenSources.permanentEightSceneControl,
  liveHost: ma0.frozenSources.liveHost,
  liveBinding: ma0.frozenSources.liveBinding,
  viewport: ma0.frozenMetricBasis.viewport,
  normalizedAnalysisSize: ma0.frozenMetricBasis.normalizedAnalysisSize,
  finalFrameMetric: {
    gaussianSigmasPixels: ma0.frozenMetricBasis.gaussianSigmasPixels,
    orientationsDegrees: ma0.frozenMetricBasis.orientationsDegrees,
    lagsPixels: ma0.frozenMetricBasis.lagsPixels
  },
  scenes: b4.scenes,
  expectedB4AggregateScore: ma0.frozenB4Evidence.acceptedCp2FinalFrameRepetitionScore,
  aggregateScoreAbsoluteTolerance: 1e-12,
  gates: {
    exactSceneCount: 8,
    deterministicReplayCount: 2,
    browserConsoleErrors: 0,
    pageErrors: 0,
    exactAcceptedRendererOnly: true
  },
  exactPathScope: [
    '.github/workflows/h-earth-metric-attribution-audit.yml',
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma1-existing-metric-reproduction.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma1-existing-metric-reproduction-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma1-existing-metric-reproduction-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.ma1-existing-metric-reproduction.runner.mjs',
    'h-earth-3d/research/metric-attribution/README.md'
  ],
  prohibitedWork: [
    'DIAGNOSTIC_PASS_A_THROUGH_G',
    'DIAGNOSTIC_RENDERER_CONSTRUCTION',
    'MATERIAL_MUTATION',
    'LIGHTING_MUTATION',
    'GEOMETRY_MUTATION',
    'CAMERA_MUTATION',
    'METRIC_PARAMETER_CHANGE',
    'PRODUCT_CANDIDATE',
    'LIVE_ROUTE_CHANGE',
    'MA2_EXECUTION'
  ],
  boundaries: {
    productMutationPerformed: false,
    diagnosticRendererConstructionStarted: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA1_REPRODUCTION_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'MA2_DIAGNOSTIC_PASS_AUTHORITY',
  result: 'MA1_EXISTING_METRIC_REPRODUCTION_PASS_CLOSED'
});

export default H_EARTH_MA1_EXISTING_METRIC_REPRODUCTION_v1;
