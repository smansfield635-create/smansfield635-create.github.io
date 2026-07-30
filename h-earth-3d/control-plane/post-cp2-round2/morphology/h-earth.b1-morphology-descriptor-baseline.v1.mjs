import b0 from './h-earth.b0-morphology-baseline-freeze.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_B1_MORPHOLOGY_DESCRIPTOR_BASELINE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_B1_MORPHOLOGY_DESCRIPTOR_BASELINE_v1',
  checkpoint: 'B1',
  status: 'REPETITION_LOCALIZATION_AND_MORPHOLOGY_DESCRIPTOR_BASELINE_ONLY',
  controllingB0Merge: '09373bed39a555e8b76a5db004e9529603748ca3',
  b0AuthorityId: b0.schemaVersion,
  source: {
    terrainPath: b0.frozenSources.canonicalTerrainField.path,
    terrainBlob: b0.frozenSources.canonicalTerrainField.blob,
    worldDomain: { xMinimum: -256, xMaximum: 256, zMinimum: -320, zMaximum: 64, seaLevelY: 0 }
  },
  grid: {
    width: 129,
    height: 97,
    xSpacingWorldUnits: 4,
    zSpacingWorldUnits: 4,
    sampleLaw: 'INCLUSIVE_WORLD_DOMAIN_REGULAR_GRID_USING_RUN8B_CANONICAL_SAMPLER'
  },
  repetitionLocalization: {
    orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
    lagsCells: [2, 3, 4, 6, 8, 12, 16, 24, 32],
    detrendBoxRadiusCells: 12,
    score: 'MAX_ABSOLUTE_NORMALIZED_DIRECTIONAL_AUTOCORRELATION',
    hotspotWindowCells: 17,
    hotspotStrideCells: 8,
    hotspotRetentionQuantile: 0.75,
    dominantLagDefinesMorphologyScale: true
  },
  descriptorPyramid: {
    radiiFromDominantLag: {
      small: 'MAX_1_ROUND_DOMINANT_LAG_DIV_4',
      medium: 'MAX_2_ROUND_DOMINANT_LAG_DIV_2',
      large: 'DOMINANT_LAG'
    },
    descriptors: [
      'DIRECTIONAL_SLOPE',
      'SLOPE_MAGNITUDE',
      'TERRAIN_ASPECT',
      'PROFILE_CURVATURE',
      'PLAN_CURVATURE',
      'LOCAL_RELIEF',
      'NORMALIZED_TPI',
      'GEOMORPHON_OR_LANDFORM_CLASS',
      'RIDGE_DISTANCE',
      'VALLEY_DISTANCE',
      'FLOW_ACCUMULATION',
      'POSITIVE_OPENNESS',
      'NEGATIVE_OPENNESS'
    ]
  },
  exactPathScope: [
    '.github/workflows/h-earth-b1-morphology-descriptor-baseline.yml',
    'h-earth-3d/analysis/morphology/h-earth.b1-morphology-descriptor-baseline.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b1-morphology-descriptor-baseline.v1.mjs',
    'h-earth-3d/validation/morphology/h-earth.b1-morphology-descriptor-baseline.mjs'
  ],
  gates: {
    independentBuilds: 2,
    exactDigestIdentity: true,
    allSamplesValid: true,
    dominantLagMustBeAuthorized: true,
    dominantOrientationMustBeAuthorized: true,
    minimumRetainedHotspots: 4,
    minimumLandformClassCount: 5,
    ridgeAndValleyNetworksRequired: true,
    nontrivialFlowAccumulationRequired: true,
    allDescriptorValuesFinite: true
  },
  boundaries: {
    productMutationPerformed: false,
    heightfieldMutationPerformed: false,
    protectionModelBuilt: false,
    probeGenerationStarted: false,
    liveRouteChanged: false,
    stop: 'STOP_BEFORE_B2_P0_P1_P2_PROTECTION_MODEL'
  },
  result: 'B1_MORPHOLOGY_DESCRIPTOR_BASELINE_PASS_CLOSED'
});

export default H_EARTH_B1_MORPHOLOGY_DESCRIPTOR_BASELINE_v1;
