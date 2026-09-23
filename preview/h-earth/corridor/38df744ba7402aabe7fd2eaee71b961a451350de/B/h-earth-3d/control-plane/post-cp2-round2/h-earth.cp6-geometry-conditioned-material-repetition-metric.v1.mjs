const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP6_GEOMETRY_CONDITIONED_MATERIAL_REPETITION_METRIC_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP6_GEOMETRY_CONDITIONED_MATERIAL_REPETITION_METRIC_v1',
  status: 'FIXED_BEFORE_CHECKPOINT_7_CANDIDATE_EXECUTION',
  purpose:
    'MEASURE_DIRECTIONAL_REPETITION_IN_THE_MATERIAL_PRESENTATION_RESIDUAL_WITHOUT_CLASSIFYING_FROZEN_TERRAIN_FORM_OR_SHARED_LIGHTING_AS_MATERIAL_REPETITION',

  supersessionLaw: {
    cp4MetricRecordRetained: true,
    cp4Checkpoint5DispositionReclassified: false,
    cp4GateWeakenedRetroactively: false,
    futureArchitectureRequiresNewMetricBecauseCp5EstablishedGeometryLightingConfounding: true
  },

  pairedInputs: {
    reference: 'ACCEPTED_CP2_CORRESPONDING_FRAMEBUFFER',
    candidate: 'CHECKPOINT_7_CORRESPONDING_FRAMEBUFFER',
    correspondence:
      'IDENTICAL_CAMERA_TARGET_VIEWPORT_GEOMETRY_DEPTH_LIGHTING_AND_DRAW_PACKAGE',
    colorTransform: 'SRGB_TO_LINEAR_THEN_REC709_LUMINANCE',
    terrainMask:
      'IDENTICAL_DEPTH_ELIGIBLE_TERRAIN_MASK_WITH_DEPTH_DISCONTINUITY_EXCLUSION',
    depthDiscontinuityExclusion:
      'EXCLUDE_PIXELS_WITH_NORMALIZED_DEPTH_GRADIENT_ABOVE_0_02_PLUS_A_TWO_PIXEL_DILATION',
    minimumEligiblePixelFraction: 0.18,
    alphaRequirement: 'ALL_ANALYZED_PIXELS_FULLY_OPAQUE'
  },

  carrierRemoval: {
    luminanceDomain: 'LOG_LUMINANCE_WITH_EPSILON_1E_MINUS_4',
    sharedCarrier:
      'GAUSSIAN_SIGMA_24_OF_EACH_CORRESPONDING_LOG_LUMINANCE_FRAME',
    materialResidual:
      'LOG_LUMINANCE_MINUS_ITS_GAUSSIAN_SIGMA_24_CARRIER',
    reason:
      'REMOVE_BROAD_GEOMETRY_LIGHTING_AND_ATMOSPHERIC_FORM_BEFORE_DIRECTIONAL_MATERIAL_ANALYSIS'
  },

  computation: {
    normalizedAnalysisSize: [256, 256],
    resampling: 'AREA_AVERAGE_WITH_MASK_WEIGHT_NORMALIZATION',
    residualBands: {
      micro:
        'MATERIAL_RESIDUAL_MINUS_GAUSSIAN_SIGMA_2_OF_MATERIAL_RESIDUAL',
      meso:
        'GAUSSIAN_SIGMA_2_MINUS_GAUSSIAN_SIGMA_8_OF_MATERIAL_RESIDUAL',
      broadMaterial:
        'GAUSSIAN_SIGMA_8_MINUS_GAUSSIAN_SIGMA_18_OF_MATERIAL_RESIDUAL'
    },
    orientationsDegrees: [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5],
    lagsPixels: [4, 8, 12, 16, 24, 32, 48],
    perBandScore:
      'MAXIMUM_ABSOLUTE_ZERO_MEAN_NORMALIZED_DIRECTIONAL_AUTOCORRELATION_OVER_ORIENTATIONS_AND_NONZERO_LAGS',
    sceneScore:
      'WEIGHTED_MEAN_MICRO_0_30_MESO_0_45_BROAD_MATERIAL_0_25',
    aggregateScore: 'ARITHMETIC_MEAN_OF_EIGHT_SCENE_SCORES',
    direction: 'LOWER_IS_BETTER',
    finiteRange: [0, 1]
  },

  gates: {
    candidateAggregateMaximumRelativeToAcceptedCp2: 0.85,
    candidatePerSceneMaximumRelativeToAcceptedCp2: 1.05,
    cp4FullFrameMetricRetainedAsDiagnostic: true,
    cp4FullFramePerSceneMaximumRelativeToAcceptedCp2: 1.05,
    cp4FullFrameAggregateImprovementNotRequiredForCheckpoint7: true,
    allEightScenesReported: true,
    allThreeResidualBandsReportedPerScene: true,
    identicalMaskAndParametersForReferenceAndCandidate: true,
    gateMayBeChangedAfterCheckpoint7Execution: false
  },

  boundaries: {
    metricIsNotNaturalismScore: true,
    metricIsNotGeometryQualityScore: true,
    metricCannotReplaceColorOrEdgeRetention: true,
    metricCannotReplaceTemporalExecution: true,
    metricCannotReplaceMobilePerformanceExecution: true,
    metricCannotReplaceUserDifferential: true,
    cameraIdConditionalsProhibited: true,
    sceneNameConditionalsProhibited: true,
    screenshotSpecificMasksProhibited: true,
    candidateDerivedMaskProhibited: true
  }
});

export default H_EARTH_CP6_GEOMETRY_CONDITIONED_MATERIAL_REPETITION_METRIC_v1;
