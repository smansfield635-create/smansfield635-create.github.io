const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP4_MULTISCALE_DIRECTIONAL_REPETITION_METRIC_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP4_MULTISCALE_DIRECTIONAL_REPETITION_METRIC_v1',
  status: 'FIXED_BEFORE_ROUND2_CANDIDATE_EXECUTION',
  purpose:
    'MEASURE_REPEATED_DIRECTIONAL_TERRAIN_PATTERN_STRENGTH_IN_CORRESPONDING_FRAMEBUFFERS_WITHOUT_USING_CAMERA_IDS_SCENE_NAMES_OR_SOURCE_KNOWLEDGE',
  input: {
    source: 'PERMANENT_SCENE_FRAMEBUFFER_RGB_READBACK',
    correspondence: 'EXACT_CP2_AND_ROUND2_CAMERA_TARGET_VIEWPORT_MATCH',
    dimensions: 'USE_EXECUTED_FRAMEBUFFER_DIMENSIONS_WITH_IDENTICAL_PAIR_DIMENSIONS',
    uiExcluded: true,
    alphaTreatment: 'IGNORE_ALPHA_AFTER_CONFIRMING_FULL_OPACITY',
    colorTransform: 'SRGB_TO_LINEAR_THEN_REC709_LUMINANCE',
    terrainMask:
      'FIXED_DEPTH_ELIGIBLE_WORLD_PIXEL_MASK_FROM_THE_UNCHANGED_RENDERED_GEOMETRY_PASS',
    minimumEligiblePixelFraction: 0.2
  },
  computation: {
    normalizedAnalysisSize: [256, 256],
    resampling: 'AREA_AVERAGE',
    gaussianSigmasPixels: [2, 8, 24],
    scaleBands: [
      'MICRO_EQUALS_LUMINANCE_MINUS_GAUSSIAN_SIGMA_2',
      'MESO_EQUALS_GAUSSIAN_SIGMA_2_MINUS_GAUSSIAN_SIGMA_8',
      'MACRO_EQUALS_GAUSSIAN_SIGMA_8_MINUS_GAUSSIAN_SIGMA_24'
    ],
    orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
    lagsPixels: [4, 8, 12, 16, 24, 32, 48, 64],
    perBandScore:
      'MAXIMUM_ABSOLUTE_ZERO_MEAN_NORMALIZED_DIRECTIONAL_AUTOCORRELATION_OVER_ALL_ORIENTATIONS_AND_NONZERO_LAGS',
    sceneScore: 'ARITHMETIC_MEAN_OF_MICRO_MESO_MACRO_BAND_SCORES',
    aggregateScore: 'ARITHMETIC_MEAN_OF_EIGHT_SCENE_SCORES',
    direction: 'LOWER_IS_BETTER',
    finiteRange: [0, 1]
  },
  gates: {
    candidateAggregateMaximumRelativeToAcceptedCp2: 0.85,
    candidatePerSceneMaximumRelativeToAcceptedCp2: 1.05,
    allEightScenesReported: true,
    allThreeBandsReportedPerScene: true,
    cp2AndCandidateUseSameMaskAndParameters: true,
    gateMayBeWeakenedAfterExecution: false
  },
  boundaries: {
    metricIsNotNaturalismScore: true,
    metricIsNotRdr2SimilarityScore: true,
    metricCannotReplaceColorOrEdgeGates: true,
    metricCannotReplaceTemporalSuite: true,
    metricCannotReplaceUserDifferential: true,
    cameraIdConditionalsProhibited: true,
    sceneNameConditionalsProhibited: true,
    screenshotSpecificMasksProhibited: true
  }
});

export default H_EARTH_CP4_MULTISCALE_DIRECTIONAL_REPETITION_METRIC_v1;
