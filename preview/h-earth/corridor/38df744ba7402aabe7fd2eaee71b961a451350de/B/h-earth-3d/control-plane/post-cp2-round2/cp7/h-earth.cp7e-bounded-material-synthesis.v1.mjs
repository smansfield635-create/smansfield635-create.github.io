const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7E_BOUNDED_MATERIAL_SYNTHESIS_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7E_BOUNDED_MATERIAL_SYNTHESIS_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7E',
  status: 'ONE_FIXED_NONZERO_MATERIAL_SYNTHESIS_CANDIDATE',
  authorityQuestion:
    'CAN_THE_PROVEN_CONTROL_FIELD_ORIENT_AND_PHASE_WARP_ACCEPTED_CP2_TERRAIN_MATERIAL_SIGNALS_WITHOUT_CHANGING_GEOMETRY_DEPTH_CAMERA_TOUCH_OR_LIVE_AUTHORITY?',
  controllingBasis: {
    cp7dMergeHead: 'b28a4fbedf4b88a593431d210269e0c195c09d35',
    acceptedRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedRendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    neutralCandidatePath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js',
    neutralCandidateBlob: '16ad0bc543f65a1132b58c939c2a48a202ac2401',
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
  fixedCandidateLaw: {
    materialModulationWeight: 0.72,
    maximumTextureSamplesPerTerrainFragment: 3,
    dynamicProceduralOctaveLoops: 0,
    method: 'BOUNDED_PHASE_WARP_OF_ACCEPTED_CP2_SIGNALS',
    preservedAmplitudeAndPaletteTerms: true,
    preservedManorTerms: true,
    preservedCavernTerms: true,
    preservedRavineTerms: true,
    preservedContactTerms: true,
    timeVaryingInputs: false,
    sceneOrCameraConditionals: false
  },
  viewport: { width: 960, height: 540, pixelRatio: 1 },
  scenes: [
    { id: 'SCENE_01_HILL_FIELD_FILL', camera: { x: 32, z: -172, verticalFovDegrees: 44 }, target: { x: 80, z: -172 }, role: 'PRIMARY' },
    { id: 'SCENE_02_ASCENDING_TOWARD_CREST', camera: { x: 56, z: -184, verticalFovDegrees: 50 }, target: { x: 80, z: -172 }, role: 'PRIMARY' },
    { id: 'SCENE_03_DESCENDING_WITHOUT_HORIZON', camera: { x: 80, z: -172, verticalFovDegrees: 52 }, target: { x: 56, z: -184 }, role: 'REGRESSION_WITNESS' },
    { id: 'SCENE_04_LATERAL_SLOPE_TRAVEL', camera: { x: 68, z: -156, verticalFovDegrees: 56 }, target: { x: 92, z: -156 }, role: 'REGRESSION_WITNESS' },
    { id: 'SCENE_05_RAVINE_APPROACH', camera: { x: 40, z: -248, verticalFovDegrees: 52 }, target: { x: 40, z: -284 }, role: 'PRIMARY' },
    { id: 'SCENE_06_COAST_TO_INLAND_TRANSITION', camera: { x: 0, z: -96, verticalFovDegrees: 56 }, target: { x: 0, z: -172 }, role: 'REGRESSION_WITNESS' },
    { id: 'SCENE_07_MANOR_SITE_APPROACH', camera: { x: 48, z: -172, verticalFovDegrees: 48 }, target: { x: 80, z: -172 }, role: 'PRIMARY' },
    { id: 'SCENE_08_CAVERN_RELATION_APPROACH', camera: { x: 40, z: -248, verticalFovDegrees: 48 }, target: { x: 40, z: -284 }, role: 'PRIMARY' }
  ],
  constructionGates: {
    allEightScenesExecute: true,
    allDepthMasksExact: true,
    allCandidateRepeatedFramesExact: true,
    allPrimaryScenesMateriallyDifferentFromCp2: true,
    minimumChangedPixelRatioPerPrimaryScene: 0.01,
    maximumMeanAbsoluteByteDeltaPerScene: 24,
    browserConsoleErrors: 0,
    pageErrors: 0,
    webglContextLossCount: 0,
    newPersistentTextureCount: 1,
    baseTextureUploadCount: 1,
    mipmapsGenerated: true,
    shaderSamplePathActive: true,
    textureSamplesPerTerrainFragment: 3,
    materialModulationWeight: 0.72,
    dynamicProceduralOctaveLoops: 0,
    postInitializationResourceCreationCount: 0,
    postInitializationUploadCount: 0
  },
  exactSubcheckpoint7EPathScope: [
    '.github/workflows/h-earth-cp7e-bounded-material-synthesis.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7e-bounded-material-synthesis.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7e-bounded-material-synthesis.runner.mjs',
    'h-earth-3d/validation/cp7/material-synthesis/h-earth.cp7e-material-synthesis.browser.mjs',
    'h-earth-3d/validation/cp7/material-synthesis/h-earth.cp7e-material-synthesis.harness.html',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
  ],
  boundaries: {
    fullEngineeringAcceptancePerformed: false,
    liveAdmissionAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    liveRouteChanged: false,
    acceptedRendererMutated: false,
    checkpoint7FMayStartOnlyAfter7EMerge: true,
    stop: 'STOP_AFTER_ONE_COMPLETE_NONZERO_CANDIDATE_BEFORE_FULL_ENGINEERING_ACCEPTANCE'
  },
  result: 'CP7E_BOUNDED_MATERIAL_SYNTHESIS_PASS_CLOSED'
});

export default H_EARTH_CP7E_BOUNDED_MATERIAL_SYNTHESIS_v1;
