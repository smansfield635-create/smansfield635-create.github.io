const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7C_CONTROL_FIELD_GENERATOR_EXECUTION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7C_CONTROL_FIELD_GENERATOR_EXECUTION_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7C',
  status: 'GENERATOR_IMPLEMENTATION_AND_DETERMINISTIC_EXECUTION',
  authorityQuestion:
    'CAN_THE_CONTROL_FIELD_BE_DERIVED_DETERMINISTICALLY_FROM_THE_FROZEN_RUN_8B_HEIGHTFIELD_WITHOUT_MUTATING_HEIGHTFIELD_GEOMETRY_RENDERER_OR_LIVE_AUTHORITY?',
  controllingBasis: {
    cp7bMergeHead: '3548f442d4b44a788f4eb38e3034e0a462736857',
    contractPath: 'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7b-control-field-contract.v1.mjs',
    contractBlob: 'e1873b9cc476389945970c5ca7a52529ba89414e',
    terrainPath: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    terrainBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc',
    acceptedRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedRendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    liveHostPath: 'showroom/globe/h-earth/index.html',
    liveHostBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a',
    liveBindingPath: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    liveBindingBlob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
  },
  generatorProductPath: 'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
  requiredExecution: {
    independentGenerationRuns: 2,
    exactByteIdentity: true,
    canonicalSha256Identity: true,
    baseByteLength: 262144,
    defensiveCopyProof: true,
    metadataDeepFreezeProof: true,
    strictLowerReceiverProof: true,
    nonconstantChannelProof: true,
    canonicalDomainEndpointProof: true
  },
  exactSubcheckpoint7CPathScope: [
    '.github/workflows/h-earth-cp7c-control-field-generator.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7c-control-field-generator-execution.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7c-control-field-generator.mjs',
    'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js'
  ],
  boundaries: {
    rendererIntegrationPerformed: false,
    candidateRendererCreated: false,
    liveRouteChanged: false,
    heightfieldMutation: false,
    geometryMutation: false,
    checkpoint7DMayStartOnlyAfter7CMerge: true,
    stop: 'STOP_AFTER_DETERMINISTIC_GENERATOR_CLOSURE_BEFORE_RENDERER_TEXTURE_INTEGRATION'
  },
  result: 'CP7C_CONTROL_FIELD_GENERATOR_PASS_CLOSED'
});

export default H_EARTH_CP7C_CONTROL_FIELD_GENERATOR_EXECUTION_v1;
