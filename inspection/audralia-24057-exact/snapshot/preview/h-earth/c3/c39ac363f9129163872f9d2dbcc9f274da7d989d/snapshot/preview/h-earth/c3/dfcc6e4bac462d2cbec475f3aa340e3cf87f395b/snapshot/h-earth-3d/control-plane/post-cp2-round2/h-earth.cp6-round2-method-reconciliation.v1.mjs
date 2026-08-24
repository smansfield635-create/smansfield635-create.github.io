const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP6_ROUND_2_METHOD_RECONCILIATION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP6_ROUND_2_METHOD_RECONCILIATION_v1',
  checkpoint: 6,
  status: 'DIAGNOSIS_AND_REVISED_METHOD_SELECTED_NOT_IMPLEMENTED',
  authorityQuestion:
    'WHY_DID_THE_CP5_SHADER_ONLY_METHOD_FAIL_TO_REMOVE_VISIBLE_REPETITION_WITHOUT_REDUCING_ACCEPTED_READABILITY_AND_WHAT_SINGLE_REVISED_METHOD_SHOULD_CHECKPOINT_7_IMPLEMENT?',

  controllingBasis: {
    repository: 'smansfield635-create/smansfield635-create.github.io',
    mainHeadAtCheckpointStart: '2d735e3b6d2a695bc456ad24fe92fc153a0c2928',
    cp4AuthorityMergeHead: '2d735e3b6d2a695bc456ad24fe92fc153a0c2928',
    cp4AuthorityPath:
      'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp4-round2-landscape-presentation-authority.v1.mjs',
    acceptedCp2RendererPath:
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedCp2RendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    acceptedPresentationProfile:
      'H_EARTH_GRATITUDE_REGION_CP2_ROUND_1_PRESENTATION_PROFILE_v1',
    acceptedLiveState: 'UNCHANGED_AND_CONTROLLING'
  },

  cp5Evidence: {
    firstCandidate: {
      head: 'f0fb7648fb9b1c72e39136a6d06c372ae1a92a1d',
      diagnosticBranch: 'diagnostic/h-earth-cp5-round2-first-regression-001',
      workflowRun: 30513813524,
      artifactId: 8748129731,
      artifactSha256:
        '4570cac7be4ae32bd18668692a75df8e2bf7dc839308ec6032950e1482c4b69e',
      disposition: 'ROUND2_REGRESSION_ROLLBACK',
      controllingFindings: [
        'MULTI_OCTAVE_FRAGMENT_WORK_INCREASED_MEDIAN_PRESENTATION_COST_TO_1_604543_OF_CP2',
        'MULTI_OCTAVE_FRAGMENT_WORK_INCREASED_P95_PRESENTATION_COST_TO_1_472043_OF_CP2',
        'REPLACING_ACCEPTED_CP2_CONTRAST_TERMS_REDUCED_COLOR_AND_EDGE_RETENTION',
        'LOW_DIFFERENTIATION_SCENES_INCREASED_TO_5',
        'AGGREGATE_FULL_FRAME_REPETITION_RATIO_ONLY_REACHED_0_993451'
      ]
    },
    secondCandidate: {
      head: '1aa268d222633e0919075cfb2e540365a98be095',
      diagnosticBranch:
        'diagnostic/h-earth-cp5-round2-second-no-material-improvement-001',
      workflowRun: 30514136100,
      artifactId: 8748222464,
      artifactSha256:
        '7d5da11c97f02dd77cc7a023915f91314dac1530f130a338c97a143812d45f97',
      disposition: 'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP',
      acceptedGatesRestored: {
        browserClean: true,
        allEightScenes: true,
        allEightTargets: true,
        allFramebufferReadbacks: true,
        deterministicStillFrames: true,
        deterministicMotionReplay: true,
        aggregateColorRatioVersusCp1: 1.9592831133004924,
        aggregateEdgeRatioVersusCp1: 3.103253826010751,
        medianPerformanceRatioVersusCp2: 0.9779454439931015,
        p95PerformanceRatioVersusCp2: 0.9841637697952649,
        webglContextLossCount: 0,
        canonicalPackageAndGpuLifecyclePreserved: true,
        scene07ExplicitGate: true,
        scene08ExplicitGate: true,
        regressionScenes030406: true
      },
      unresolvedGates: {
        lowDifferentiationScenes: ['SCENE_01', 'SCENE_02', 'SCENE_07'],
        lowDifferentiationSceneCount: 3,
        maximumPermitted: 2,
        scene01EdgeRetention: 0.834964388201934,
        scene07ColorRetention: 0.875,
        fullFrameRepetitionAggregateRatio: 0.9964004399748846,
        requiredAggregateMaximum: 0.85,
        scene06FullFrameRepetitionRatio: 1.0691703689576892,
        requiredPerSceneMaximum: 1.05
      },
      aggregateBandEvidence: {
        micro: {
          acceptedCp2: 0.5362515719125943,
          candidate: 0.5351241329310905,
          ratio: 0.9978975558477475
        },
        meso: {
          acceptedCp2: 0.9027250091475745,
          candidate: 0.8935499131424284,
          ratio: 0.989836222645687
        },
        macro: {
          acceptedCp2: 0.985392681493202,
          candidate: 0.9869685537962463,
          ratio: 1.0015992328060082
        }
      }
    }
  },

  diagnosis: {
    firstCandidateCause:
      'THE_FIRST_METHOD_CHANGED_PRESENTATION_ENERGY_AND_ADDED_TOO_MUCH_PER_FRAGMENT_PROCEDURAL_WORK_AT_THE_SAME_TIME',
    secondCandidateCause:
      'THE_SECOND_METHOD_PRESERVED_CP2_ENERGY_AND_PERFORMANCE_BUT ONLY_PHASE_SCRAMBLED_EXISTING_SIGNALS_WITHOUT_AN_INDEPENDENT_TERRAIN_STRUCTURE_CONTROL_FIELD',
    measurementFinding:
      'THE_CP4_FULL_FRAME_METRIC_IS_STRONGLY_SATURATED_BY_FROZEN_MACRO_TERRAIN_FORM_SHARED_LIGHTING_AND_LARGE_CONTIGUOUS_TERRAIN_REGIONS',
    evidenceForMeasurementFinding: [
      'MACRO_BAND_ACCEPTED_CP2_MEAN_WAS_0_985393',
      'MACRO_BAND_CANDIDATE_MEAN_WAS_0_986969',
      'MACRO_BAND_RATIO_WAS_1_001599_DESPITE_MATERIAL_SHADER_CHANGE',
      'MICRO_AND_MESO_CHANGES_DID_NOT_MOVE_THE_EQUAL_WEIGHT_FULL_FRAME_AGGREGATE_MATERIALLY',
      'IDENTICAL_DEPTH_MASKS_PROVED_GEOMETRY_DID_NOT_CHANGE'
    ],
    architecturalFinding:
      'LOCAL_WORLD_POSITION_NORMAL_AND_HASH_NOISE_ARE_NOT_SUFFICIENT_TO_RECONSTRUCT_DRAINAGE_FLOW_CURVATURE_AND_NESTED_PATTERN_CONTROL_FROM_THE_FROZEN_HEIGHTFIELD_INSIDE_EACH_FRAGMENT',
    finalDiagnosis:
      'THE_NEXT_ATTEMPT_REQUIRES_PRECOMPUTED_TERRAIN_STRUCTURE_CONTROL_AND_A_MATERIAL_RESIDUAL_METRIC_NOT_MORE_UNBOUNDED_FRAGMENT_NOISE'
  },

  externalResearchBasis: [
    {
      title: 'Real-time Terrain Enhancement with Controlled Procedural Patterns',
      year: 2024,
      doi: '10.1111/cgf.14992',
      applicableFinding:
        'NESTED_PATTERNS_ARE_GUIDED_BY_TERRAIN_PROPERTIES_INCLUDING_WATER_FLOW_AND_SLOPE_ORIENTATION_AND_ARE_IMPLEMENTABLE_ON_GRAPHICS_HARDWARE'
    },
    {
      title: 'WebGL Specification',
      authority: 'KHRONOS_WEBGL_WORKING_GROUP',
      applicableFinding:
        'EXPENSIVE_LONG_RUNNING_SHADERS_CAN_DAMAGE_INTERACTIVITY_AND_HIGH_PERFORMANCE_CONTEXTS_REQUIRE_CONTEXT_LOSS_ROBUSTNESS'
    },
    {
      title: 'Filtering After Shading with Stochastic Texture Filtering',
      year: 2024,
      applicableFinding:
        'ADVANCED_FILTERING_CAN_BE_EFFICIENT_BUT_STOCHASTIC_ERROR_REQUIRES_TEMPORAL_DENOISING_OR_ADDITIONAL_SAMPLES',
      checkpointDisposition:
        'NOT_SELECTED_FOR_CHECKPOINT_7_BECAUSE_H_EARTH_DOES_NOT_YET_HAVE_THE_REQUIRED_TEMPORAL_DENOISING_ARCHITECTURE'
    }
  ],

  selectedCheckpoint7Method: {
    methodId:
      'H_EARTH_PRECOMPUTED_TERRAIN_CONTROL_FIELD_AND_BAND_LIMITED_MATERIAL_SYNTHESIS_v1',
    classification: 'REVISED_PRESENTATION_ARCHITECTURE',
    summary:
      'GENERATE_ONE_IMMUTABLE_CONTROL_FIELD_FROM_THE_EXISTING_FROZEN_HEIGHTFIELD_AND_CONSUME_IT_IN_AN_ISOLATED_RENDERER_TO_ORIENT_AND_SCALE_LOW_COST_APERIODIC_MATERIAL_STRUCTURE',
    controlField: {
      sourceAuthority: 'EXISTING_FROZEN_RUN_8B_SUCCESSOR_HEIGHTFIELD',
      geometryMutation: false,
      heightfieldMutation: false,
      worldAuthorityMutation: false,
      initialResolution: [256, 256],
      storage: 'RGBA8_WITH_MIPMAPS',
      channels: {
        red: 'ENCODED_DOWNSLOPE_DIRECTION_X',
        green: 'ENCODED_DOWNSLOPE_DIRECTION_Z',
        blue: 'NORMALIZED_FLOW_ACCUMULATION_OR_DRAINAGE_STRENGTH',
        alpha: 'NORMALIZED_SIGNED_CURVATURE_OR_LANDFORM_CLASS'
      },
      slopeMagnitudeSource: 'EXISTING_INTERPOLATED_SURFACE_NORMAL',
      altitudeSource: 'EXISTING_WORLD_POSITION_Y',
      deterministicGenerationRequired: true,
      canonicalDigestRequired: true,
      immutableAfterGeneration: true
    },
    rendererUse: [
      'PRESERVE_ALL_ACCEPTED_CP2_COLOR_EDGE_MANOR_CAVERN_AND_CONTACT_TERMS',
      'SAMPLE_THE_CONTROL_FIELD_WITH_MIPMAP_FILTERING',
      'ORIENT_MESO_AND_BROAD_MATERIAL_PATTERNS_ALONG_DOWNSLOPE_AND_FLOW',
      'CASCADE_NARROWER_PATTERNS_INSIDE_BROADER_CONTROLLED_PATTERNS',
      'USE_AT_MOST_ONE_BOUNDED_HASH_JITTER_SIGNAL_TO_BREAK_GRID_LOCK',
      'ATTENUATE_DETAIL_BY_PIXEL_FOOTPRINT_AND_CAMERA_DISTANCE',
      'DO_NOT_USE_TIME_VARYING_NOISE',
      'DO_NOT_CHANGE_GEOMETRY_DEPTH_OR_CAMERA'
    ],
    mobileBudget: {
      maximumNewPersistentTextures: 1,
      maximumBaseTextureBytes: 262144,
      mipmapsRequired: true,
      maximumNewTextureSamplesPerTerrainFragment: 3,
      dynamicProceduralOctaveLoops: 0,
      medianPresentationMaximumRelativeToCp2: 1.15,
      p95PresentationMaximumRelativeToCp2: 1.2,
      contextLossCount: 0
    }
  },

  checkpoint7MutationBoundary: {
    authorizedProductTargets: [
      'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
    ],
    authorizedControlAndValidationTargets:
      'CHECKPOINT_7_DEDICATED_CONTROL_VALIDATION_WORKFLOW_AND_EVIDENCE_PATHS',
    prohibitedProductTargets: [
      'showroom/globe/h-earth/index.html',
      'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
      'h-earth-3d/terrain/',
      'showroom/globe/h-earth/functional-landscape/',
      'showroom/globe/h-earth/touch/'
    ],
    liveAdmissionAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    userInspectionRequiredBeforeEngineeringPass: false,
    userDifferentialRequiredAfterEngineeringPass: true
  },

  checkpoint7Gates: {
    originalCp4Metric: {
      retainedAsDiagnostic: true,
      perSceneMaximumRelativeToCp2: 1.05,
      aggregateImprovementRequirement: 'NOT_APPLICABLE_TO_CHECKPOINT_7',
      cp5DispositionMayBeReclassified: false
    },
    geometryConditionedMaterialMetricPath:
      'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp6-geometry-conditioned-material-repetition-metric.v1.mjs',
    geometryConditionedAggregateMaximumRelativeToCp2: 0.85,
    geometryConditionedPerSceneMaximumRelativeToCp2: 1.05,
    maximumLowDifferentiationScenes: 2,
    minimumAggregateColorRatioVersusCp1: 1.782301,
    minimumAggregateEdgeRatioVersusCp1: 2.902555,
    minimumAcceptedCp2PerSceneRetention: 0.9,
    scene07MinimumColorBuckets: 14,
    scene07MinimumEdgeSignal: 0.12563,
    scene08MinimumEdgeSignal: 0.2,
    regressionScenes: ['SCENE_03', 'SCENE_04', 'SCENE_06'],
    deterministicFixedFrames: true,
    deterministicMotionReplay: true,
    identicalDepthMasks: true,
    canonicalControlFieldDigest: true,
    mobileBudgetPass: true,
    gpuLifecyclePass: true
  },

  deferred: {
    geometryDisplacementOrHeightfieldEnhancement:
      'DEFERRED_UNLESS_CONTROL_FIELD_PRESENTATION_ARCHITECTURE_FAILS_UNDER_FIXED_CHECKPOINT_7_GATES',
    atmosphericDepth:
      'DEFERRED_UNTIL_PRIMARY_SURFACE_NATURALISM_PASSES',
    stochasticTemporalFiltering:
      'DEFERRED_UNTIL_TEMPORAL_DENOISING_OR_SAMPLE_ACCUMULATION_AUTHORITY_EXISTS',
    vegetationTopologyChange: 'PROHIBITED_IN_CHECKPOINT_7'
  },

  checkpointBoundary: {
    productMutationPerformed: false,
    liveStateChanged: false,
    cp5Reopened: false,
    cp5DispositionChanged: false,
    checkpoint7AuthorizedAfterCp6Merge: true,
    checkpoint7Started: false,
    result: 'CP6_METHOD_RECONCILIATION_PASS_CLOSED',
    stop:
      'STOP_AFTER_CP6_CONTROL_MERGE_BEFORE_GENERATING_THE_CONTROL_FIELD_OR_BUILDING_THE_CHECKPOINT_7_CANDIDATE'
  }
});

export default H_EARTH_CP6_ROUND_2_METHOD_RECONCILIATION_v1;
