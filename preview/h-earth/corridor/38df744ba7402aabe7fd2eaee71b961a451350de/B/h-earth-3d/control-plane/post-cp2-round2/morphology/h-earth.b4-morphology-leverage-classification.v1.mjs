import b0 from './h-earth.b0-morphology-baseline-freeze.v1.mjs';
import b1 from './h-earth.b1-morphology-descriptor-baseline.v1.mjs';
import b2 from './h-earth.b2-protection-model.v1.mjs';
import b3 from './h-earth.b3-two-fixed-morphology-probes.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_B4_MORPHOLOGY_LEVERAGE_CLASSIFICATION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_B4_MORPHOLOGY_LEVERAGE_CLASSIFICATION_v1',
  checkpoint: 'B4',
  status: 'FIXED_TWO_PROBE_MORPHOLOGY_LEVERAGE_CLASSIFICATION',
  controllingB3Merge: 'a832118f0fae73088afc2b2054af5f037ba26548',
  authorities: {
    b0: b0.schemaVersion,
    b1: b1.schemaVersion,
    b2: b2.schemaVersion,
    b3: b3.schemaVersion
  },
  frozenDigests: {
    baseline: 'fnv1a32:513f79fa',
    protection: 'fnv1a32:f228a5b5',
    guidance: 'fnv1a32:a231ce59',
    probeA: 'fnv1a32:d017575a',
    probeB: 'fnv1a32:6d6f3db0'
  },
  frozenSources: {
    acceptedRenderer: b0.frozenSources.acceptedRenderer,
    canonicalTerrainField: b0.frozenSources.canonicalTerrainField,
    canonicalRenderPackage: b0.frozenSources.canonicalRenderPackage,
    canonicalGpuUploadViews: b0.frozenSources.canonicalGpuUploadViews,
    navigationAuthority: b0.frozenSources.navigationAuthority,
    permanentEightSceneControl: b0.frozenSources.permanentEightSceneControl,
    liveHost: b0.frozenSources.liveHost,
    liveBinding: b0.frozenSources.liveBinding
  },
  acceptedRendererSourceUrl: '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
  viewport: { width: 960, height: 540, pixelRatio: 1 },
  normalizedAnalysisSize: { width: 256, height: 256 },
  finalFrameMetric: {
    gaussianSigmasPixels: [2, 8, 24],
    orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
    lagsPixels: [4, 8, 12, 16, 24, 32, 48, 64]
  },
  morphologyMetric: {
    dominantOrientationDegrees: 0,
    dominantLagCells: 2,
    detrendRadiusCells: 12,
    orientationBins: 16
  },
  scenes: [
    { id: 'SCENE_01_HILL_FIELD_FILL', camera: { x: 32, z: -172, verticalFovDegrees: 44 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_02_ASCENDING_TOWARD_CREST', camera: { x: 56, z: -184, verticalFovDegrees: 50 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_03_DESCENDING_WITHOUT_HORIZON', camera: { x: 80, z: -172, verticalFovDegrees: 52 }, target: { x: 56, z: -184 } },
    { id: 'SCENE_04_LATERAL_SLOPE_TRAVEL', camera: { x: 68, z: -156, verticalFovDegrees: 56 }, target: { x: 92, z: -156 } },
    { id: 'SCENE_05_RAVINE_APPROACH', camera: { x: 40, z: -248, verticalFovDegrees: 52 }, target: { x: 40, z: -284 } },
    { id: 'SCENE_06_COAST_TO_INLAND_TRANSITION', camera: { x: 0, z: -96, verticalFovDegrees: 56 }, target: { x: 0, z: -172 } },
    { id: 'SCENE_07_MANOR_SITE_APPROACH', camera: { x: 48, z: -172, verticalFovDegrees: 48 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_08_CAVERN_RELATION_APPROACH', camera: { x: 40, z: -248, verticalFovDegrees: 48 }, target: { x: 40, z: -284 } }
  ],
  gates: {
    heightfieldDirectionalRepetitionReductionMinimum: 0.10,
    finalFrameRepetitionReductionMinimum: 0.08,
    improvedSceneMinimum: 5,
    leverageNotEstablishedBothProbeFinalFrameMaximumExclusive: 0.05,
    exactSceneCount: 8,
    acceptedRendererEquivalenceRequired: true,
    fixedFrameDeterminismRequired: true,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  classificationLaw: {
    established: 'EITHER_PROBE_HEIGHT_REDUCTION_AT_LEAST_10_PERCENT_AND_FINAL_FRAME_REDUCTION_AT_LEAST_8_PERCENT_AND_IMPROVED_SCENES_AT_LEAST_5_OF_8',
    notEstablished: 'BOTH_PROBES_FINAL_FRAME_REDUCTION_BELOW_5_PERCENT',
    otherwise: 'WEAK_OR_INCONCLUSIVE_LEVERAGE',
    lowerSuccessfulAmplitudeSelected: true,
    b5AuthorizedOnlyBy: 'MORPHOLOGY_LEVERAGE_ESTABLISHED'
  },
  exactPathScope: [
    '.github/workflows/h-earth-b4-morphology-leverage-classification.yml',
    'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs',
    'h-earth-3d/validation/morphology/h-earth.b4-b3-compatibility-wrapper.mjs',
    'h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage-browser.mjs',
    'h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage-harness.html',
    'h-earth-3d/validation/morphology/h-earth.b4-morphology-leverage.runner.mjs'
  ],
  prohibitedWork: [
    'THIRD_AMPLITUDE',
    'PARAMETER_RETUNING',
    'NEW_SHADER',
    'NEW_MATERIAL',
    'PRODUCT_HEIGHTFIELD_COMMIT',
    'RUNTIME_VERTEX_DISPLACEMENT',
    'LIVE_ROUTE_CHANGE',
    'USER_DIFFERENTIAL'
  ],
  boundaries: {
    productMutationPerformed: false,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_CAUSAL_CLASSIFICATION'
  }
});

export default H_EARTH_B4_MORPHOLOGY_LEVERAGE_CLASSIFICATION_v1;
