import bm1 from './h-earth.bm1-unique-baked-material-contract.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_BM4_ONE_SAMPLE_RENDERER_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_BM4_ONE_SAMPLE_RENDERER_AUTHORITY_v1',
  checkpoint: 'BM4',
  status: 'ISOLATED_ONE_SAMPLE_RENDERER_INTEGRATION',
  authorityQuestion:
    'CAN_THE_UNIQUE_BAKED_FIELD_REPLACE_THE_GENERIC_CP2_REPEATED_SIGNAL_FAMILY_THROUGH_ONE_TEXTURE_SAMPLE_WHILE_PRESERVING_ACCEPTED_LIGHTING_LANDMARK_CONTACT_GEOMETRY_AND_RESOURCE_AUTHORITIES?',
  controllingBasis: {
    bm3MergeHead: '67840eb802f33f74fe4c67f84bc67efec70df34e',
    acceptedRendererPath: bm1.controllingBasis.acceptedRendererPath,
    acceptedRendererBlob: bm1.controllingBasis.acceptedRendererBlob,
    terrainPath: bm1.controllingBasis.terrainPath,
    terrainBlob: bm1.controllingBasis.terrainBlob,
    liveHostPath: bm1.controllingBasis.liveHostPath,
    liveHostBlob: bm1.controllingBasis.liveHostBlob,
    liveBindingPath: bm1.controllingBasis.liveBindingPath,
    liveBindingBlob: bm1.controllingBasis.liveBindingBlob,
    bakedMapPath: bm1.mapContract.productPath,
    bakedMapSha256: '28f801f8e5f7b82433f3e0f742cb8292d918ff33b1696c524d0762830c42e15f',
    bakedMetadataPath: bm1.mapContract.metadataPath,
    bakedMetadataBlob: '9c77949d65ae80ead054138d7ee932e41a2a86d0'
  },
  candidateRendererPath:
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-baked-material-candidate.js',
  viewport: { width: 960, height: 540, pixelRatio: 1 },
  scenes: [
    { id: 'SCENE_01_HILL_FIELD_FILL', role: 'PRIMARY', camera: { x: 32, z: -172, verticalFovDegrees: 44 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_02_ASCENDING_TOWARD_CREST', role: 'PRIMARY', camera: { x: 56, z: -184, verticalFovDegrees: 50 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_03_DESCENDING_WITHOUT_HORIZON', role: 'REGRESSION', camera: { x: 80, z: -172, verticalFovDegrees: 52 }, target: { x: 56, z: -184 } },
    { id: 'SCENE_04_LATERAL_SLOPE_TRAVEL', role: 'REGRESSION', camera: { x: 68, z: -156, verticalFovDegrees: 56 }, target: { x: 92, z: -156 } },
    { id: 'SCENE_05_RAVINE_APPROACH', role: 'PRIMARY', camera: { x: 40, z: -248, verticalFovDegrees: 52 }, target: { x: 40, z: -284 } },
    { id: 'SCENE_06_COAST_TO_INLAND_TRANSITION', role: 'REGRESSION', camera: { x: 0, z: -96, verticalFovDegrees: 56 }, target: { x: 0, z: -172 } },
    { id: 'SCENE_07_MANOR_SITE_APPROACH', role: 'PRIMARY', camera: { x: 48, z: -172, verticalFovDegrees: 48 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_08_CAVERN_RELATION_APPROACH', role: 'PRIMARY', camera: { x: 40, z: -248, verticalFovDegrees: 48 }, target: { x: 40, z: -284 } }
  ],
  constructionGates: {
    allEightScenesExecute: true,
    allDepthMasksExact: true,
    allCandidateFixedFramesExact: true,
    minimumMateriallyDifferentScenes: 6,
    minimumChangedPixelRatioPerMateriallyDifferentScene: 0.20,
    maximumMeanAbsoluteRgbByteDeltaPerScene: 42,
    browserConsoleErrors: 0,
    pageErrors: 0,
    contextLossCount: 0,
    newPersistentTextureCount: 1,
    baseUploadCount: 1,
    mipmapsGenerated: true,
    samplesPerTerrainFragment: 1,
    dynamicProceduralOctaveLoops: 0,
    controlFieldSamples: 0,
    postInitializationTextureCreationCount: 0,
    postInitializationTextureUploadCount: 0
  },
  exactPathScope: [
    '.github/workflows/h-earth-bm4-one-sample-renderer.yml',
    'h-earth-3d/control-plane/post-cp2-round2/baked-material/h-earth.bm4-one-sample-renderer-authority.v1.mjs',
    'h-earth-3d/validation/baked-material/h-earth.bm4-one-sample-renderer.mjs',
    'h-earth-3d/validation/baked-material/bm4/h-earth.bm4-one-sample-renderer.browser.mjs',
    'h-earth-3d/validation/baked-material/bm4/h-earth.bm4-one-sample-renderer.harness.html',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-baked-material-candidate.js'
  ],
  sourceLaw: {
    genericCp2RepeatedSignalFamilyRemoved: true,
    bakedMapSampleCount: 1,
    acceptedCp2LightingRetained: true,
    manorTermsRetained: true,
    cavernTermsRetained: true,
    ravineTermsRetained: true,
    geometryMutation: false,
    terrainMutation: false,
    cameraMutation: false,
    navigationMutation: false,
    touchMutation: false
  },
  boundaries: {
    fullEngineeringAcceptancePerformed: false,
    liveAdmissionAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    stop: 'STOP_AFTER_ONE_COMPLETE_ISOLATED_RENDERER_CANDIDATE_BEFORE_BM5_FULL_ENGINEERING_EXECUTION'
  },
  result: 'BM4_ONE_SAMPLE_BAKED_MATERIAL_RENDERER_PASS_CLOSED'
});

export default H_EARTH_BM4_ONE_SAMPLE_RENDERER_AUTHORITY_v1;
