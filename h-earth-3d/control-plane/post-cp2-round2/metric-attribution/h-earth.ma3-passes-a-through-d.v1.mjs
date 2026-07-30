import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';
import ma1 from './h-earth.ma1-existing-metric-reproduction.v1.mjs';
import ma2 from './h-earth.ma2-diagnostic-pass-authority.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA3_PASSES_A_THROUGH_D_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA3_PASSES_A_THROUGH_D_v1',
  checkpoint: 'MA3',
  status: 'FIXED_A_THROUGH_D_EIGHT_SCENE_EXECUTION',
  authorityQuestion: 'WHAT_REPETITION_STRUCTURE_IS_PRESENT_IN_ELEVATION_SLOPE_NORMALS_AND_DEPTH',
  controllingMA2Merge: '1f3c5b5b1333a39495c1aabde427b8e95ff89c92',
  controllingMA2Result: ma2.result,
  frozenSources: ma0.frozenSources,
  viewport: ma0.frozenMetricBasis.viewport,
  normalizedAnalysisSize: ma0.frozenMetricBasis.normalizedAnalysisSize,
  finalFrameMetric: ma1.finalFrameMetric,
  scenes: ma1.scenes,
  passes: {
    A: ma2.passes.A,
    B: ma2.passes.B,
    C: ma2.passes.C,
    D: ma2.passes.D
  },
  gates: {
    exactSceneCount: 8,
    exactPassCount: 4,
    exactOutputCount: 32,
    deterministicReplayCount: 2,
    minimumEligiblePixelCount: 1000,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma3-passes-a-through-d.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.metric-attribution-directional-metric.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma3-passes-a-through-d-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma3-passes-a-through-d-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.ma3-passes-a-through-d.runner.mjs'
  ],
  prohibitedWork: [
    'PASS_E_THROUGH_H_EXECUTION',
    'CROSS_PASS_CORRESPONDENCE_CLASSIFICATION',
    'PRODUCT_CANDIDATE',
    'GEOMETRY_MUTATION',
    'CAMERA_MUTATION',
    'MATERIAL_RETUNING',
    'LIGHTING_RETUNING',
    'METRIC_PARAMETER_CHANGE',
    'LIVE_ROUTE_CHANGE'
  ],
  boundaries: {
    productMutationPerformed: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA3_A_THROUGH_D_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'MA4_EXECUTE_PASSES_E_THROUGH_H',
  result: 'MA3_PASSES_A_THROUGH_D_PASS_CLOSED'
});

export default H_EARTH_MA3_PASSES_A_THROUGH_D_v1;
