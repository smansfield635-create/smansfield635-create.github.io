import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';
import ma1 from './h-earth.ma1-existing-metric-reproduction.v1.mjs';
import ma2 from './h-earth.ma2-diagnostic-pass-authority.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA4_PASSES_E_THROUGH_H_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA4_PASSES_E_THROUGH_H_v1',
  checkpoint: 'MA4',
  status: 'FIXED_E_THROUGH_H_EIGHT_SCENE_EXECUTION',
  authorityQuestion: 'WHAT_REPETITION_STRUCTURE_IS_PRESENT_IN_EDGES_LIGHTING_MATERIAL_AND_FINAL_FRAMES',
  controllingMA3Merge: 'e4dbc19f5eabfdc8584edbf23977e5bb05c405d3',
  controllingMA3Result: 'MA3_PASSES_A_THROUGH_D_PASS_CLOSED',
  frozenSources: ma0.frozenSources,
  viewport: ma0.frozenMetricBasis.viewport,
  normalizedAnalysisSize: ma0.frozenMetricBasis.normalizedAnalysisSize,
  finalFrameMetric: ma1.finalFrameMetric,
  scenes: ma1.scenes,
  passes: {
    E: ma2.passes.E,
    F: ma2.passes.F,
    G: ma2.passes.G,
    H: ma2.passes.H
  },
  expectedAcceptedAggregateScore: ma0.frozenB4Evidence.acceptedCp2FinalFrameRepetitionScore,
  acceptedAggregateAbsoluteTolerance: 1e-12,
  gates: {
    exactSceneCount: 8,
    exactPassCount: 4,
    exactOutputCount: 32,
    deterministicReplayCount: 2,
    hOfficialColorEquivalenceSceneCount: 8,
    hOfficialDepthEquivalenceSceneCount: 8,
    minimumEligiblePixelCount: 1000,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma4-passes-e-through-h.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma4-passes-e-through-h-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma4-passes-e-through-h-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.ma4-passes-e-through-h.runner.mjs'
  ],
  prohibitedWork: [
    'PASS_A_THROUGH_D_REEXECUTION',
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
    stop: 'STOP_AFTER_MA4_E_THROUGH_H_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'MA5_CROSS_PASS_CORRESPONDENCE',
  result: 'MA4_PASSES_E_THROUGH_H_PASS_CLOSED'
});

export default H_EARTH_MA4_PASSES_E_THROUGH_H_v1;
