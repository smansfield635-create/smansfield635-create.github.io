const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7B_TERRAIN_CONTROL_FIELD_CONTRACT_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7B_TERRAIN_CONTROL_FIELD_CONTRACT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7B',
  status: 'CONTRACT_FIXED_BEFORE_GENERATION',
  authorityQuestion:
    'IS_THE_TERRAIN_CONTROL_FIELD_FORMAT_MAPPING_QUANTIZATION_EDGE_BEHAVIOR_AND_DIGEST_LAW_EXACTLY_DEFINED_BEFORE_ANY_CONTROL_FIELD_BYTES_ARE_GENERATED?',

  controllingBasis: {
    repository: 'smansfield635-create/smansfield635-create.github.io',
    cp7aMergeHead: '257e36def7c18794ea8382c231ba9f3bde3f29a2',
    acceptedCp2RendererPath:
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedCp2RendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    successorTerrainFieldPath:
      'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    successorTerrainFieldBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc',
    custodyDraftBranch: 'custody/h-earth-cp7-prebounded-implementation-001',
    custodyDraftIsAuthority: false,
    custodyDraftAdmitted: false
  },

  storage: {
    width: 256,
    height: 256,
    channelCount: 4,
    format: 'RGBA8_UNORM',
    baseByteLength: 262144,
    rowMajor: true,
    byteOrderWithinTexel: ['RED', 'GREEN', 'BLUE', 'ALPHA'],
    mipmapsRequiredAtRendererIntegration: true,
    mipmapGenerationAuthority: 'WEBGL2_GENERATE_MIPMAP_AFTER_BASE_LEVEL_UPLOAD',
    immutableAfterGeneration: true,
    consumerReceivesDefensiveByteCopy: true
  },

  sourceAndMapping: {
    sourceAuthority: 'EXISTING_FROZEN_RUN_8B_SUCCESSOR_HEIGHTFIELD',
    sourceContractId: 'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1',
    sourceMutation: false,
    geometryMutation: false,
    worldAuthorityMutation: false,
    domainSource: 'H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain',
    texelCoordinateLaw: {
      worldX: 'xMinimum + texelX * (xMaximum - xMinimum) / (width - 1)',
      worldZ: 'zMinimum + texelY * (zMaximum - zMinimum) / (height - 1)',
      firstTexel: 'EXACT_DOMAIN_X_MINIMUM_Z_MINIMUM',
      lastTexel: 'EXACT_DOMAIN_X_MAXIMUM_Z_MAXIMUM',
      rowsAdvanceTowardIncreasingWorldZ: true,
      columnsAdvanceTowardIncreasingWorldX: true
    },
    shaderUvLaw: {
      u: '(worldX - xMinimum) / (xMaximum - xMinimum)',
      v: '(worldZ - zMinimum) / (zMaximum - zMinimum)',
      wrapS: 'CLAMP_TO_EDGE',
      wrapT: 'CLAMP_TO_EDGE',
      minFilter: 'LINEAR_MIPMAP_LINEAR',
      magFilter: 'LINEAR'
    },
    invalidOrNonfiniteSampleDisposition: 'REJECT_GENERATION_WITH_EXACT_TEXEL_COORDINATE'
  },

  derivativeAndFlowLaw: {
    neighborOrderForDeterministicTieBreak: [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1]
    ],
    downslopeReceiver:
      'SELECT_STRICTLY_LOWER_D8_NEIGHBOR_WITH_MAXIMUM_ELEVATION_DROP_DIVIDED_BY_WORLD_DISTANCE; TIES_USE_FIXED_NEIGHBOR_ORDER',
    strictLowerEpsilon: 1e-12,
    direction:
      'NORMALIZED_WORLD_SPACE_VECTOR_FROM_TEXEL_CENTER_TO_SELECTED_RECEIVER; SINK_OR_FLAT_FALLBACK_IS_NORMALIZED_NEGATIVE_CENTRAL_OR_ONE_SIDED_GRADIENT; ZERO_GRADIENT_FALLBACK_IS_VECTOR_0_NEGATIVE_1',
    edgeDerivative: 'ONE_SIDED_DIFFERENCE_AT_DOMAIN_EDGE_CENTRAL_DIFFERENCE_INTERIOR',
    flowAccumulation:
      'INITIAL_WEIGHT_1_PER_TEXEL; PROCESS_TEXELS_BY_DESCENDING_ELEVATION_THEN_ASCENDING_LINEAR_INDEX; ADD_WEIGHT_TO_STRICTLY_LOWER_RECEIVER',
    cycleDisposition: 'IMPOSSIBLE_BY_STRICTLY_LOWER_RECEIVER_LAW_AND_MUST_BE_ASSERTED',
    curvature:
      'WORLD_SPACING_NORMALIZED_FOUR_NEIGHBOR_LAPLACIAN_WITH_EDGE_COORDINATES_CLAMPED_TO_DOMAIN'
  },

  channels: {
    red: {
      semantic: 'ENCODED_DOWNSLOPE_DIRECTION_X',
      sourceRange: [-1, 1],
      encode: 'ROUND(CLAMP(directionX * 0.5 + 0.5, 0, 1) * 255)',
      decode: 'byte / 255 * 2 - 1'
    },
    green: {
      semantic: 'ENCODED_DOWNSLOPE_DIRECTION_Z',
      sourceRange: [-1, 1],
      encode: 'ROUND(CLAMP(directionZ * 0.5 + 0.5, 0, 1) * 255)',
      decode: 'byte / 255 * 2 - 1'
    },
    blue: {
      semantic: 'NORMALIZED_FLOW_ACCUMULATION_OR_DRAINAGE_STRENGTH',
      sourceRange: [0, 1],
      normalization: 'LOG1P(accumulation) / LOG1P(maximumAccumulation)',
      encode: 'ROUND(CLAMP(normalizedFlow, 0, 1) * 255)',
      decode: 'byte / 255'
    },
    alpha: {
      semantic: 'NORMALIZED_SIGNED_CURVATURE_OR_LANDFORM_CLASS',
      sourceRange: [-1, 1],
      normalization:
        'IF maximumAbsoluteCurvature IS ZERO THEN 0 ELSE TANH(curvature / (maximumAbsoluteCurvature * 0.22))',
      encode: 'ROUND(CLAMP(normalizedCurvature * 0.5 + 0.5, 0, 1) * 255)',
      decode: 'byte / 255 * 2 - 1'
    }
  },

  canonicalizationAndDigest: {
    byteQuantization: 'UINT8_ROUND_TO_NEAREST_AFTER_EXPLICIT_CLAMP',
    negativeZeroNormalizedBeforeDerivedCalculations: true,
    canonicalByteSequence:
      'ROW_MAJOR_TEXEL_Y_THEN_TEXEL_X_WITH_RGBA_BYTES_PER_TEXEL',
    canonicalDigestAlgorithm: 'SHA-256',
    canonicalDigestEncoding: 'LOWERCASE_HEXADECIMAL_64_CHARACTERS',
    canonicalDigestInput: 'EXACT_262144_BASE_LEVEL_BYTES_ONLY',
    runtimeFastDigestPermitted: 'FNV1A32_AS_NONCANONICAL_DIAGNOSTIC_ONLY',
    metadataExcludedFromCanonicalDigest: true,
    repeatedGenerationMustBeByteIdentical: true
  },

  generatorApiContract: {
    productPath:
      'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    requiredExports: [
      'H_EARTH_TERRAIN_CONTROL_FIELD_ID',
      'H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH',
      'H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT',
      'H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH',
      'generateHEarthTerrainControlField',
      'getHEarthTerrainControlField',
      'getHEarthTerrainControlFieldReceipt'
    ],
    generationFunctionMustPermitIndependentRepeatedRuns: true,
    cachedAccessorMayGenerateOnce: true,
    returnedBytesAlwaysDefensiveCopy: true,
    returnedMetadataDeepFrozen: true,
    generationDurationExcludedFromDeterministicReceipt: true
  },

  prohibited: [
    'CAMERA_ID_CONDITIONALS',
    'SCENE_ID_CONDITIONALS',
    'MANOR_OR_CAVERN_SPECIAL_CASES_IN_CONTROL_FIELD',
    'TIME_VARYING_VALUES',
    'RANDOM_NUMBER_GENERATORS',
    'HEIGHTFIELD_MUTATION',
    'GEOMETRY_CREATION',
    'CANDIDATE_RENDERER_CREATION_DURING_7B',
    'CONTROL_FIELD_BYTE_GENERATION_DURING_7B'
  ],

  exactSubcheckpoint7BPathScope: [
    '.github/workflows/h-earth-cp7b-control-field-contract.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7b-control-field-contract.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7b-control-field-contract.mjs'
  ],

  boundaries: {
    productMutationPerformed: false,
    controlFieldBytesGenerated: false,
    generatorImplemented: false,
    rendererIntegrationPerformed: false,
    liveRouteChanged: false,
    checkpoint7CMayStartOnlyAfter7BMerge: true,
    stop: 'STOP_BEFORE_IMPLEMENTING_OR_EXECUTING_THE_CONTROL_FIELD_GENERATOR'
  },

  result: 'CP7B_CONTROL_FIELD_CONTRACT_PASS_CLOSED'
});

export default H_EARTH_CP7B_TERRAIN_CONTROL_FIELD_CONTRACT_v1;
