const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP4_ROUND_2_LANDSCAPE_PRESENTATION_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP4_ROUND_2_LANDSCAPE_PRESENTATION_AUTHORITY_v1',
  checkpoint: 4,
  status: 'AUTHORIZED_NOT_IMPLEMENTED',
  authorityQuestion:
    'CAN_LAWFUL_MULTISCALE_TERRAIN_STRUCTURE_REDUCE_VISIBLE_REPETITION_AND_IMPROVE_TEMPORAL_AND_DISTANCE_COHERENCE_WITHOUT_CHANGING_FROZEN_WORLD_AUTHORITIES_OR_DEGRADING_THE_ACCEPTED_CP2_PRESENTATION?',

  controllingBasis: {
    mainHeadAtAuthorization: 'a1d5c69f89450f37144d06a2c80f6490dc9c7b33',
    acceptedCheckpoint: 'CHECKPOINT_2_PASS_CLOSED',
    acceptedEngineeringHead: '1f52080969034c55855a70834cc0294791254c80',
    acceptedPresentationProfile:
      'H_EARTH_GRATITUDE_REGION_CP2_ROUND_1_PRESENTATION_PROFILE_v1',
    acceptedDefaultFrameHash: 'fnv1a32:cbeeeabc',
    priorBaselineFrameHash: 'fnv1a32:f18c4ab6',
    acceptedRendererPath:
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    rollbackBranch: 'rollback/h-earth-cp2-round1-prepromotion-001'
  },

  acceptedRound1Evidence: {
    aggregateColorDifferentiationRatio: 1.876106,
    aggregateEdgeSignalRatio: 3.055321,
    lowDifferentiationSceneCount: 2,
    maximumPermittedLowDifferentiationScenes: 2,
    scene07MinimumColorBuckets: 14,
    scene07MinimumEdgeSignal: 0.12563,
    scene08MinimumEdgeSignal: 0.2,
    userDifferential: 'ACCEPTED_BETTER_IN_MORE_WAYS_THAN_NOT',
    physicalGestureSession: 'PASS_8_OF_8'
  },

  round2Hypothesis: {
    primary:
      'MULTISCALE_TERRAIN_NATURALISM_PLUS_ANTI_REPETITION_PLUS_TEMPORAL_STABILITY',
    secondary:
      'RESTRAINED_DISTANCE_AND_ATMOSPHERIC_SEPARATION_AFTER_PRIMARY_PASS_ONLY',
    sharedCauseModel: [
      'INSUFFICIENT_MULTISCALE_SURFACE_STRUCTURE',
      'REPEATED_DIRECTIONAL_SURFACE_BANDS',
      'INSUFFICIENT_SLOPE_FLOW_AND_CURVATURE_ALIGNMENT',
      'INSUFFICIENT_DISTANCE_CONTINUITY',
      'INSUFFICIENT_TEMPORAL_STABILITY_EVIDENCE'
    ]
  },

  implementationSequence: [
    'BUILD_ISOLATED_ROUND2_RENDERER_FROM_ACCEPTED_CP2_RENDERER',
    'EXECUTE_SOURCE_AND_STATIC_AUTHORITY_AUDIT',
    'EXECUTE_ALL_EIGHT_PERMANENT_STILL_SCENES',
    'EXECUTE_DETERMINISTIC_MOTION_AND_TEMPORAL_SUITE',
    'EXECUTE_SUPPORTED_TOUCH_DEVICE_PERFORMANCE_SUITE',
    'CLASSIFY_ENGINEERING_DISPOSITION',
    'ONLY_AFTER_PASS_CREATE_QUERY_GATED_LIVE_DIFFERENTIAL_ADMISSION',
    'OBTAIN_USER_PHYSICAL_DIFFERENTIAL',
    'MAKE_SEPARATE_PROMOTION_DECISION'
  ],

  mutationAuthority: {
    engineeringProductTarget: {
      path:
        'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-candidate.js',
      status: 'NEW_ISOLATED_CANDIDATE_FILE_ONLY',
      sourceBasis:
        'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'
    },
    authorizedPresentationCauses: [
      'WORLD_SPACE_MACRO_MESO_MICRO_MATERIAL_VARIATION',
      'SLOPE_RESPONSIVE_MODULATION',
      'CURVATURE_RESPONSIVE_MODULATION',
      'FLOW_OR_DRAINAGE_ALIGNED_PRESENTATION_STRUCTURE',
      'ANTI_REPETITION_SCALE_MIXING',
      'STEEP_FACE_PROJECTION_ORIENTATION_CORRECTION',
      'DISTANCE_AWARE_DETAIL_ATTENUATION',
      'TEMPORALLY_STABLE_MATERIAL_FILTERING',
      'BOUNDED_CONTACT_AND_DEPTH_REINFORCEMENT',
      'RESTRAINED_ATMOSPHERIC_ATTENUATION_AFTER_PRIMARY_PASS'
    ],
    lawfulInputs: [
      'WORLD_POSITION',
      'SURFACE_NORMAL',
      'SLOPE',
      'CURVATURE_OR_LOCAL_GEOMETRIC_DERIVATIVE',
      'ALTITUDE',
      'ACCEPTED_REGION_MEMBERSHIP',
      'ACCEPTED_MANOR_SITE_ENVELOPE_RELATION',
      'ACCEPTED_CAVERN_EXTERIOR_RELATION',
      'CAMERA_DISTANCE_FOR_LOD_ONLY',
      'PIXEL_FOOTPRINT_OR_DERIVATIVE_FOR_FILTERING_ONLY'
    ],
    laterLiveAdmissionTargets: [
      'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'
    ],
    laterLiveAdmissionCondition:
      'PROHIBITED_UNTIL_ROUND2_PASS_ENGINEERING_AND_SEPARATE_ADMISSION_AUTHORIZATION'
  },

  frozenAuthorities: [
    'TERRAIN_COORDINATES',
    'HEIGHTFIELD',
    'WORLD_GEOMETRY',
    'ACCEPTED_ENTRY_PLACEMENT',
    'ACCEPTED_MANOR_SITE_ENVELOPE',
    'ACCEPTED_CAVERN_EXTERIOR_RELATION',
    'FRONTIER_STATUS',
    'CAMERA_STATES',
    'CAMERA_MATRICES',
    'NAVIGATION_LAW',
    'TOUCH_CLASSIFICATION',
    'GESTURE_BEHAVIOR',
    'VEGETATION_TOPOLOGY',
    'NAVIGABLE_CHUNK_BOUNDARIES',
    'MANOR_OBJECT_GEOMETRY',
    'CAVERN_OPENING_OR_INTERIOR',
    'ACCEPTED_CP2_RENDERER_SOURCE',
    'CURRENT_LIVE_DEFAULT_SELECTION'
  ],

  prohibitedTechniques: [
    'CAMERA_ID_CONDITIONALS',
    'SCENE_ID_CONDITIONALS',
    'SCREENSHOT_SPECIFIC_OVERLAYS',
    'MANUALLY_PAINTED_SCREEN_SPACE_PATCHES',
    'TARGET_NAME_VISUAL_HACKS',
    'TIME_VARYING_NOISE_WITHOUT_TEMPORAL_STABILITY_PROOF',
    'UNBOUNDED_SHADER_BRANCH_PROLIFERATION',
    'ENGINE_MIGRATION',
    'NEW_WORLD_GEOMETRY',
    'HEIGHTFIELD_MUTATION',
    'ATMOSPHERE_USED_TO_CONCEAL_UNRESOLVED_SURFACE_REPETITION'
  ],

  permanentSceneRoles: {
    allScenes: [
      'SCENE_01',
      'SCENE_02',
      'SCENE_03',
      'SCENE_04',
      'SCENE_05',
      'SCENE_06',
      'SCENE_07',
      'SCENE_08'
    ],
    primaryNaturalismTargets: [
      'SCENE_01',
      'SCENE_02',
      'SCENE_05',
      'SCENE_07',
      'SCENE_08'
    ],
    fullRegressionWitnesses: ['SCENE_03', 'SCENE_04', 'SCENE_06'],
    scene07Meaning: 'ACCEPTED_MANOR_SITE_ENVELOPE_READABILITY_WITHOUT_STRUCTURE',
    scene08Meaning: 'ACCEPTED_CAVERN_EXTERIOR_RELATION_READABILITY_WITHOUT_OPENING'
  },

  engineeringGates: {
    allEightScenesExecute: true,
    allEightTargetsProject: true,
    allEightFramebufferReadbacks: true,
    browserConsoleErrors: 0,
    pageErrors: 0,
    maximumLowDifferentiationScenes: 2,
    minimumAggregateColorRatioVersusCp1: 1.782301,
    minimumAggregateEdgeRatioVersusCp1: 2.902555,
    minimumAcceptedCp2PerSceneRetention: 0.9,
    scene07MinimumColorBuckets: 14,
    scene07MinimumEdgeSignal: 0.12563,
    scene08MinimumEdgeSignal: 0.2,
    regressionWitnessesMustPass: true,
    fixedCameraRepeatedFrameHashesMustMatch: true,
    repeatedMotionReplayFrameSequenceMustMatch: true,
    candidateP95PresentationResponseMaximumRelativeToCp2: 1.2,
    candidateMedianPresentationResponseMaximumRelativeToCp2: 1.15,
    webglContextLossCount: 0,
    gpuResourceIdentityStable: true,
    noPostInitializationResourceCreation: true,
    noPostInitializationBufferUpload: true,
    frozenAuthoritiesPreserved: true,
    productScopeExact: true
  },

  antiRepetitionResearchGate: {
    metricStatus: 'MUST_BE_DEFINED_BEFORE_CANDIDATE_EXECUTION',
    requiredProperties: [
      'CORRESPONDING_SCENE_BASED',
      'CAMERA_INDEPENDENT',
      'SOURCE_BLIND',
      'FIXED_BEFORE_RESULT',
      'REPORTS_EACH_SCENE_AND_AGGREGATE',
      'CANNOT_REPLACE_USER_DIFFERENTIAL'
    ],
    minimumAggregateImprovementVersusAcceptedCp2: 0.15,
    maximumPerSceneRegressionVersusAcceptedCp2: 0.05
  },

  dispositions: [
    'CP4_ROUND2_AUTHORITY_PASS_CLOSED',
    'ROUND2_PASS_ENGINEERING',
    'ROUND2_PARTIAL_IMPROVEMENT_REMAINS_BLOCKED',
    'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP',
    'ROUND2_REGRESSION_ROLLBACK'
  ],

  checkpointBoundary: {
    productMutationPerformed: false,
    implementationAuthorizedAfterCp4Merge: true,
    liveCandidateAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    userAcceptancePredetermined: false,
    nextCheckpoint: 5,
    nextCheckpointRole:
      'BOUNDED_ROUND2_IMPLEMENTATION_PLUS_ENGINEERING_EXECUTION_PLUS_LIVE_DIFFERENTIAL_IF_PASS',
    stop:
      'STOP_AFTER_AUTHORITY_MERGE_BEFORE_ANY_PRODUCT_MUTATION_UNLESS_CHECKPOINT_5_IS_EXPLICITLY_STARTED'
  }
});

export default H_EARTH_CP4_ROUND_2_LANDSCAPE_PRESENTATION_AUTHORITY_v1;
