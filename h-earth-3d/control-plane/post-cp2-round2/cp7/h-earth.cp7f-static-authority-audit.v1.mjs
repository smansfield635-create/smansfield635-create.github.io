const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7F_STATIC_AUTHORITY_AUDIT_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7F_STATIC_AUTHORITY_AUDIT_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7F',
  status: 'STATIC_SOURCE_SCOPE_AND_RESOURCE_AUTHORITY_AUDIT',
  authorityQuestion:
    'DOES_THE_COMPLETE_CP7_CANDIDATE_REMAIN_INSIDE_THE_AUTHORIZED_PRODUCT_SCOPE_FROZEN_AUTHORITIES_SHADER_INPUTS_AND_MOBILE_RESOURCE_BUDGET?',
  controllingBasis: {
    cp7eMergeHead: '477a5bf825a7e9fd5200be7dbf54f0271276ed33',
    cp7aMergeHead: '257e36def7c18794ea8382c231ba9f3bde3f29a2',
    acceptedRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
    acceptedRendererBlob: 'de55609b0b0bd66601445a369c727ff7a6d7065d',
    generatorPath: 'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    generatorBlob: '95f33f67d83921425dc44b273cac74764855a626',
    candidateRendererPath: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js',
    candidateRendererBlob: '021efe3d1d6d8b825b0474940166f47e499188e9',
    terrainPath: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    terrainBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc',
    liveHostPath: 'showroom/globe/h-earth/index.html',
    liveHostBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a',
    liveBindingPath: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
    liveBindingBlob: '5eb1b6f2e72ac0525f608850234182b2c646f66f',
    canonicalControlFieldSha256: '177ec368222fccc9d5ccdd11702f9ac96602dcfd76728c63a43694d298e8a456'
  },
  authorizedProductPathsAcrossCheckpoint7: [
    'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
  ],
  resourceBudget: {
    controlFieldBaseBytesMaximum: 262144,
    newPersistentTextureMaximum: 1,
    textureSamplesPerTerrainFragmentMaximum: 3,
    dynamicProceduralOctaveLoopsMaximum: 0,
    postInitializationResourceCreationMaximum: 0,
    postInitializationUploadMaximum: 0
  },
  prohibitedTechniques: [
    'SCENE_ID_CONDITIONAL',
    'CAMERA_ID_CONDITIONAL',
    'TARGET_NAME_CONDITIONAL',
    'SCREEN_SPACE_PATCH',
    'TIME_VARYING_NOISE',
    'DYNAMIC_PROCEDURAL_OCTAVE_LOOP',
    'HEIGHTFIELD_MUTATION',
    'GEOMETRY_MUTATION',
    'LIVE_BINDING_MUTATION',
    'LIVE_HOST_MUTATION'
  ],
  exactSubcheckpoint7FPathScope: [
    '.github/workflows/h-earth-cp7f-static-authority-audit.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7f-static-authority-audit.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7f-static-authority-audit.mjs'
  ],
  boundaries: {
    productMutationPerformed: false,
    browserAcceptancePerformed: false,
    liveAdmissionAuthorized: false,
    liveDefaultPromotionAuthorized: false,
    liveRouteChanged: false,
    checkpoint7GMayStartOnlyAfter7FMerge: true,
    stop: 'STOP_AFTER_STATIC_AUTHORITY_PASS_BEFORE_CANDIDATE_CONSTRUCTION_CLOSURE'
  },
  result: 'CP7F_STATIC_AUTHORITY_AUDIT_PASS_CLOSED'
});

export default H_EARTH_CP7F_STATIC_AUTHORITY_AUDIT_v1;
