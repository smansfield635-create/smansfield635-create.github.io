import { canonicalDigest, deepFreeze } from './platform-core.mjs';

const sourceAuthority = {
  path: 'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs',
  blob: '421260d8cbe371a4edc871d3607af9817201bb6c',
  inheritedBy: [
    'H_EARTH_MA1_EXISTING_METRIC_REPRODUCTION_v1',
    'H_EARTH_RMA0_MATERIAL_FAMILY_FREEZE_v1',
    'H_EARTH_RMA1_SINGLE_FAMILY_ABLATIONS_v1'
  ]
};

const scenes = [
  { id: 'SCENE_01_HILL_FIELD_FILL', role: 'PRIMARY', camera: { x: 32, z: -172, verticalFovDegrees: 44 }, target: { x: 80, z: -172 }, expectedTerrainRelation: 'HILL_FIELD_TO_MANOR_CENTER' },
  { id: 'SCENE_02_ASCENDING_TOWARD_CREST', role: 'PRIMARY', camera: { x: 56, z: -184, verticalFovDegrees: 50 }, target: { x: 80, z: -172 }, expectedTerrainRelation: 'ASCENDING_CREST_APPROACH' },
  { id: 'SCENE_03_DESCENDING_WITHOUT_HORIZON', role: 'REGRESSION', camera: { x: 80, z: -172, verticalFovDegrees: 52 }, target: { x: 56, z: -184 }, expectedTerrainRelation: 'DESCENDING_REVERSE_VIEW' },
  { id: 'SCENE_04_LATERAL_SLOPE_TRAVEL', role: 'REGRESSION', camera: { x: 68, z: -156, verticalFovDegrees: 56 }, target: { x: 92, z: -156 }, expectedTerrainRelation: 'LATERAL_SLOPE' },
  { id: 'SCENE_05_RAVINE_APPROACH', role: 'PRIMARY', camera: { x: 40, z: -248, verticalFovDegrees: 52 }, target: { x: 40, z: -284 }, expectedTerrainRelation: 'RAVINE_TO_CAVERN_FACE' },
  { id: 'SCENE_06_COAST_TO_INLAND_TRANSITION', role: 'REGRESSION', camera: { x: 0, z: -96, verticalFovDegrees: 56 }, target: { x: 0, z: -172 }, expectedTerrainRelation: 'COAST_TO_INLAND' },
  { id: 'SCENE_07_MANOR_SITE_APPROACH', role: 'PRIMARY', camera: { x: 48, z: -172, verticalFovDegrees: 48 }, target: { x: 80, z: -172 }, expectedTerrainRelation: 'MANOR_SITE_APPROACH' },
  { id: 'SCENE_08_CAVERN_RELATION_APPROACH', role: 'PRIMARY', camera: { x: 40, z: -248, verticalFovDegrees: 48 }, target: { x: 40, z: -284 }, expectedTerrainRelation: 'CAVERN_RELATION_APPROACH' }
].map((scene) => ({
  ...scene,
  requiredDepthAuthority: 'ACCEPTED_CP2_DEPTH',
  requiredRenderAuthority: 'ACCEPTED_CP2_RENDERER',
  acceptedBaselineIdentities: ['CP2_PASS_H', 'CP2_DEPTH']
}));

const body = {
  schemaVersion: 'H_EARTH_PERMANENT_SCENE_REGISTRY_v1',
  sourceAuthority,
  viewport: { width: 960, height: 540, pixelRatio: 1 },
  sceneCount: scenes.length,
  scenes
};

export const H_EARTH_PERMANENT_SCENE_REGISTRY = deepFreeze({
  ...body,
  registryDigest: canonicalDigest(body)
});

export function getPermanentScene(sceneId) {
  return H_EARTH_PERMANENT_SCENE_REGISTRY.scenes.find((scene) => scene.id === sceneId) ?? null;
}

export default H_EARTH_PERMANENT_SCENE_REGISTRY;
