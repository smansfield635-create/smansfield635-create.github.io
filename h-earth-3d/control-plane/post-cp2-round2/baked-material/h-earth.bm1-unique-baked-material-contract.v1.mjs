const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_v1',
  program: 'H_EARTH_ROUND2_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD',
  checkpoint: 'BM1',
  status: 'CONTRACT_FIXED_BEFORE_DESCRIPTOR_OR_PRODUCT_IMPLEMENTATION',
  authorityQuestion:
    'IS_ONE_UNIQUE_WORLD_ALIGNED_OFFLINE_BAKED_LANDFORM_MATERIAL_FIELD_EXACTLY_DEFINED_BEFORE_ANY_DESCRIPTOR_SEGMENTATION_BAKE_OR_RENDERER_MUTATION?',
  controllingBasis: {
    checkpoint8MergeHead: '517670141817f1c4bba8bcfefd336f9f0442470a',
    checkpoint8Disposition: 'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP',
    acceptedRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedRendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    terrainPath: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    terrainBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc',
    liveHostPath: 'showroom/globe/h-earth/index.html',
    liveHostBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a',
    liveBindingPath: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    liveBindingBlob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
  },
  architecture: {
    identifier: 'H_EARTH_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD_v1',
    sourceTerrain: 'FROZEN_RUN_8B_HEIGHTFIELD',
    synthesisLocation: 'OFFLINE_PRECOMPUTATION_ONLY',
    runtimeRole: 'ONE_WORLD_ALIGNED_TEXTURE_SAMPLE_FEEDING_ACCEPTED_CP2_LIGHTING_AND_CONTACT_TERMS',
    repeatedCp2SignalFamilyRemovedFromGenericTerrainBase: true,
    dynamicProceduralTerrainSynthesis: false,
    phaseWarping: false,
    continuousControlFieldModulation: false,
    geometryMutation: false,
    topologyMutation: false,
    liveRouteMutation: false
  },
  mapContract: {
    width: 1024,
    height: 1024,
    channelCount: 4,
    storage: 'RGBA8_UNORM_RAW_ROW_MAJOR_BOTTOM_TO_TOP_FALSE',
    byteOrder: 'ROW_MAJOR_Z_THEN_X_RGBA',
    baseByteLength: 4194304,
    mipmapsRequired: true,
    estimatedFullMipChainBytes: 5592406,
    worldDomainMapping: 'RUN_8B_WORLD_XZ_TO_CLOSED_UNIT_SQUARE_CLAMP_TO_EDGE',
    channels: {
      red: 'BAKED_LINEAR_ALBEDO_RED',
      green: 'BAKED_LINEAR_ALBEDO_GREEN',
      blue: 'BAKED_LINEAR_ALBEDO_BLUE',
      alpha: 'REGION_BOUNDARY_BLEND_AND_EXPOSURE_RESPONSE'
    },
    canonicalDigestAlgorithm: 'SHA-256',
    deterministicByteIdentityRequired: true,
    productPath: 'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.rgba',
    metadataPath: 'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.js'
  },
  offlineDescriptors: {
    required: [
      'MULTISCALE_LANDFORM_CLASS',
      'MULTISCALE_TOPOGRAPHIC_POSITION_INDEX',
      'SIGNED_RIDGE_OR_VALLEY_DISTANCE',
      'SLOPE_MAGNITUDE',
      'PROFILE_CURVATURE',
      'PLAN_CURVATURE',
      'EXPOSURE_OR_WETNESS_ESTIMATE',
      'TERRAIN_ASPECT'
    ],
    runtimeDescriptorSampling: false,
    collapsedOutputs: [
      'MATERIAL_REGION_ID',
      'MATERIAL_VARIANT_ID',
      'BOUNDARY_BLEND_WEIGHT',
      'EXPOSURE_OR_WETNESS_RESPONSE'
    ]
  },
  regionLaw: {
    coherentLandformSegmentationRequired: true,
    allocation: 'DETERMINISTIC_LOW_DISCREPANCY_BLUE_NOISE_LIKE_VARIANT_ALLOCATION',
    uniqueWorldCoverage: true,
    periodicTileGridVisibleAtRuntime: false,
    neighboringSameVariantProhibitedWhereAlternativeExists: true,
    noParameterSweep: true,
    oneFixedAtlas: true
  },
  runtimeBudget: {
    newPersistentTextures: 1,
    terrainFragmentTextureSamples: 1,
    dynamicProceduralOctaveLoops: 0,
    controlFieldTextureSamples: 0,
    baseUploads: 1,
    postInitializationTextureCreation: 0,
    postInitializationUploads: 0,
    acceptedCp2LightingPreserved: true,
    acceptedCp2ManorCavernRavineAndContactTermsPreserved: true
  },
  authorizedProgramProductPaths: [
    'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.rgba',
    'showroom/globe/h-earth/render/terrain-material-field.round2-baked.v1.js',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-baked-material-candidate.js'
  ],
  prohibitedProductPathsBeforeBM6: [
    'showroom/globe/h-earth/index.html',
    'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    'h-earth-3d/terrain/',
    'showroom/globe/h-earth/functional-landscape/',
    'showroom/globe/h-earth/touch/'
  ],
  checkpointSequence: {
    BM1: 'FREEZE_CP2_AND_DEFINE_BAKED_MAP_CONTRACT',
    BM2: 'COMPUTE_LANDFORM_DESCRIPTORS_AND_REGION_SEGMENTATION',
    BM3: 'BAKE_ONE_DETERMINISTIC_UNIQUE_1024_MAP',
    BM4: 'INTEGRATE_ONE_SAMPLE_RENDERER_CANDIDATE',
    BM5: 'EXECUTE_FULL_ENGINEERING_SUITE',
    BM6: 'QUERY_GATED_LIVE_AVAILABILITY_ONLY_IF_BM5_PASSES'
  },
  boundaries: {
    productMutationPerformed: false,
    descriptorImplementationStarted: false,
    mapBakeStarted: false,
    rendererIntegrationStarted: false,
    liveAdmissionAuthorized: false,
    stop: 'STOP_BEFORE_BM2_DESCRIPTOR_AND_SEGMENTATION_IMPLEMENTATION'
  },
  result: 'BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_PASS_CLOSED'
});

export default H_EARTH_BM1_UNIQUE_BAKED_MATERIAL_CONTRACT_v1;
