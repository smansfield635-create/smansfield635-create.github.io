const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7D_NEUTRAL_RENDERER_INTEGRATION_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7D_NEUTRAL_RENDERER_INTEGRATION_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7D',
  status: 'NEUTRAL_TEXTURE_AND_SHADER_SAMPLE_INTEGRATION',
  authorityQuestion:
    'CAN_THE_ISOLATED_RENDERER_CREATE_UPLOAD_MIPMAP_BIND_AND_SAMPLE_THE_CONTROL_FIELD_WITH_ZERO_MATERIAL_WEIGHT_WHILE_REPRODUCING_ACCEPTED_CP2_FRAMEBUFFERS_EXACTLY?',
  controllingBasis: {
    cp7cMergeHead: 'dce2691c7444c99b7f0571b29472fc902dce53ab',
    acceptedRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedRendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    generatorPath: 'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    generatorBlob: '95f33f67d83921425dc44b273cac74764855a626',
    canonicalControlFieldSha256: '177ec368222fccc9d5ccdd11702f9ac96602dcfd76728c63a43694d298e8a456',
    terrainPath: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    terrainBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc',
    liveHostPath: 'showroom/globe/h-earth/index.html',
    liveHostBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a',
    liveBindingPath: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    liveBindingBlob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
  },
  candidateRendererPath:
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js',
  viewport: { width: 960, height: 540, pixelRatio: 1 },
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
    allEightScenesExecute: true,
    acceptedAndNeutralColorBytesExact: true,
    acceptedAndNeutralDepthMasksExact: true,
    neutralRepeatedFixedFramesExact: true,
    browserConsoleErrors: 0,
    pageErrors: 0,
    webglContextLossCount: 0,
    newPersistentTextureCount: 1,
    baseTextureUploadCount: 1,
    mipmapsGenerated: true,
    shaderSamplePathActive: true,
    textureSamplesPerTerrainFragment: 1,
    materialModulationWeight: 0,
    dynamicProceduralOctaveLoops: 0,
    postInitializationResourceCreationCount: 0,
    postInitializationUploadCount: 0,
    canonicalControlFieldDigestRequired: true
  },
  exactSubcheckpoint7DPathScope: [
    '.github/workflows/h-earth-cp7d-neutral-control-field-renderer.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7d-neutral-renderer-integration.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7d-neutral-renderer.runner.mjs',
    'h-earth-3d/validation/cp7/neutral-renderer/h-earth.cp7d-neutral-renderer.browser.mjs',
    'h-earth-3d/validation/cp7/neutral-renderer/h-earth.cp7d-neutral-renderer.harness.html',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
  ],
  boundaries: {
    materialSynthesisEnabled: false,
    liveAdmissionAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    liveRouteChanged: false,
    acceptedRendererMutated: false,
    checkpoint7EMayStartOnlyAfter7DMerge: true,
    stop: 'STOP_BEFORE_SETTING_ANY_NONZERO_CONTROL_FIELD_MATERIAL_MODULATION'
  },
  result: 'CP7D_NEUTRAL_RENDERER_INTEGRATION_PASS_CLOSED'
});

export default H_EARTH_CP7D_NEUTRAL_RENDERER_INTEGRATION_v1;
