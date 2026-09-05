export const CINEMATIC_MEDIA_MANIFEST=Object.freeze({
  schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version:'storyboard-v2-preview-integration-current-main-20260905-001',
  sourceMain:'501a1b2f9c9ab103dd3f96a535ba663818b87034',
  integrationBase:'af650d8bb67f228891cf142d5d66e300eec971bf',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  storyboardIssue:2756,
  status:'STORYBOARD_V2_SOURCE_TRUE_PREVIEW_IDENTITY_RECONCILIATION',
  masterDurationMs:45000,
  runtimeEmbeddingAllowed:false,
  sourceWorldsRequiredBeforeMasterClock:false,
  lateShotSourcesMayBlockMasterStart:false,
  oneAudioOwner:true,
  visualReviewMethod:'SOURCE_AND_CODE_AUDIT_BY_PRECEDENT',
  sourceBindings:Object.freeze({
    cosmos:Object.freeze({path:'assets/compass/compass.cosmos.js',blob:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',use:'S01_PERSISTENT_FIBONACCI_PAGE_NIGHT'}),
    crystals:Object.freeze({path:'assets/compass/compass.crystals.js',blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',use:'S02_AND_S08_CARDINAL_GEOMETRY_AND_HANDOFF_SOURCE'}),
    chapterContract:Object.freeze({path:'.github/ai-router/projects/compass/chapter-one-contextual-delivery-contract.v1.json',blob:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e',use:'S03_CONTEXTUAL_DELIVERY_LOCK'}),
    readiness:Object.freeze({path:'assets/compass/compass.readiness-context-v1.js',blob:'dd6220df67cc73d57150f8fa498d0cf477298ded',use:'S04_READINESS_VISUAL_AND_CLAIM_SOURCE'}),
    mirrorlandGeometry:Object.freeze({path:'assets/shared/mirrorland-window.geometry.js',blob:'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595',use:'S05_CANONICAL_21_PANE_THRESHOLD'}),
    mirrorlandRegional:Object.freeze({path:'characters/step9-regional-geography.mjs',blob:'e3c4f837b7a4c30ce118a88ec8475b6fab542a57',use:'S05_READ_ONLY_CAMERA_SITE_AND_GEOGRAPHY_BRIDGE'}),
    mirrorlandNight:Object.freeze({path:'characters/night-renderer.mjs',blob:'066973f039a6439cf24264984243271942126b4d',use:'S05_DETACHED_NIGHT_SHADER_PRESENTATION'}),
    mirrorlandForest:Object.freeze({path:'characters/forest-system.mjs',blob:'98d0995143400149cb19c48751a38a5402ca019b',use:'S05_CURRENT_MAIN_ENVIRONMENT_PARITY_FOREST_RENDERER'}),
    mirrorlandClouds:Object.freeze({path:'characters/cloud-system.mjs',blob:'47482fd1c37267a2c5e76a3b833210984fe9b505',use:'S05_CURRENT_MAIN_ENVIRONMENT_PARITY_CLOUD_RENDERER'}),
    geographyAuthority:Object.freeze({path:'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',blob:'a67a4e95f7634eb97a375ff103d95bdc81c64f0b',use:'S05_AND_S06_SINGLE_ROOT_GEOGRAPHY_AUTHORITY'}),
    audraliaRenderer:Object.freeze({path:'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',blob:'872d20b17bb0cd89d9613ca0262b25350890a617',use:'S06_DETACHED_CANONICAL_CONTINUOUS_WORLD_RENDERER'}),
    brain:Object.freeze({path:'assets/compass/compass.hra-brain-scene.js',blob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb',use:'S07A_EXACT_HRA_BRAIN_RENDERER'}),
    trophy:Object.freeze({path:'assets/compass/compass.trophy-scene.js',blob:'d281e18b06128671ffe2a19e8fdb272cc5544e31',use:'S07B_EXACT_PROCEDURAL_TROPHY_RENDERER'}),
    house:Object.freeze({path:'assets/compass/compass.house-scene.js',blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',use:'S07C_HOUSE_SOURCE_RENDERER'}),
    housePhase3:Object.freeze({path:'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs',blob:'38bc8fa60a251681cb5484926409290f66460ad0',use:'S07C_PHASE3_CINEMATIC_GEOMETRY_SOURCE'}),
    finalRenderer:Object.freeze({path:'assets/compass/compass.orientation-cinematic.final.js',blob:'1af6d8dc0e1cfc8ae7f6e46b962db2629881fbff',use:'S07_PHASE3_SEMANTICS_AND_S08_HANDOFF'}),
    contextSpine:Object.freeze({path:'assets/compass/compass.orientation-cinematic.css',blob:'d1b93312e7a6ad0161400ffc1160717818b6af62',use:'PERSISTENT_STORYBOARD_V2_TOUR_CONTEXT'})
  }),
  shots:Object.freeze([
    Object.freeze({id:'S01',beat:'Arrival',startMs:0,endMs:4500,meaning:'Diamond Gate Bridge',action:'Establish the estate'}),
    Object.freeze({id:'S02',beat:'Orientation',startMs:4500,endMs:9500,meaning:'Find your way.',action:'Use the Compass to orient the experience'}),
    Object.freeze({id:'S03',beat:'Chapter One',startMs:9500,endMs:14500,meaning:'Start here.',action:'Begin with the guided introduction'}),
    Object.freeze({id:'S04',beat:'Choice / Readiness',startMs:14500,endMs:19500,meaning:'See what is being tested and what is ready.',action:'Inspect research and readiness boundaries'}),
    Object.freeze({id:'S05',beat:'Threshold',startMs:19500,endMs:25500,meaning:'Cross into Mirrorland.',action:'Enter the narrative world'}),
    Object.freeze({id:'S06',beat:'Elsewhere',startMs:25500,endMs:30500,meaning:'Enter Audralia.',action:'Explore a continuous planetary world'}),
    Object.freeze({id:'S07',beat:'Breadth / Engagement',startMs:30500,endMs:41000,meaning:'Three ways to engage.',action:'Coherence assessment, Awards Chamber, character conversation'}),
    Object.freeze({id:'S08',beat:'Return / Handoff',startMs:41000,endMs:45000,meaning:'Now choose your path.',action:'Return to the Compass'})
  ])
});

export function assertCinematicMediaManifest(manifest=CINEMATIC_MEDIA_MANIFEST){
  if(manifest?.schema!=='COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1')throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if(manifest?.sourceMain!=='501a1b2f9c9ab103dd3f96a535ba663818b87034')throw new Error('CINEMATIC_MEDIA_BASE_MISMATCH');
  if(manifest?.integrationBase!=='af650d8bb67f228891cf142d5d66e300eec971bf')throw new Error('CINEMATIC_MEDIA_INTEGRATION_BASE_MISMATCH');
  if(manifest?.specificationCommit!=='88473442959299d6f6af82396917f0578074cab2')throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if(manifest?.masterDurationMs!==45000)throw new Error('CINEMATIC_MEDIA_DURATION_MISMATCH');
  if(manifest?.runtimeEmbeddingAllowed!==false||manifest?.sourceWorldsRequiredBeforeMasterClock!==false||manifest?.lateShotSourcesMayBlockMasterStart!==false||manifest?.oneAudioOwner!==true)throw new Error('CINEMATIC_MEDIA_STARTUP_ARCHITECTURE_MISMATCH');
  if(!Array.isArray(manifest?.shots)||manifest.shots.length!==8)throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  const expected=[['S01',0,4500],['S02',4500,9500],['S03',9500,14500],['S04',14500,19500],['S05',19500,25500],['S06',25500,30500],['S07',30500,41000],['S08',41000,45000]];
  for(const [id,startMs,endMs] of expected){const shot=manifest.shots.find(item=>item.id===id);if(!shot||shot.startMs!==startMs||shot.endMs!==endMs)throw new Error(`CINEMATIC_MEDIA_${id}_TIMELINE_MISMATCH`);}
  for(const key of ['mirrorlandGeometry','mirrorlandNight','mirrorlandForest','mirrorlandClouds','geographyAuthority','audraliaRenderer','brain','trophy','house','housePhase3','finalRenderer','contextSpine'])if(!manifest.sourceBindings?.[key]?.blob)throw new Error(`CINEMATIC_MEDIA_SOURCE_BINDING_MISSING:${key}`);
  if(manifest.sourceBindings.mirrorlandForest.blob!=='98d0995143400149cb19c48751a38a5402ca019b'||manifest.sourceBindings.mirrorlandClouds.blob!=='47482fd1c37267a2c5e76a3b833210984fe9b505')throw new Error('CINEMATIC_MEDIA_CURRENT_MAIN_ENVIRONMENT_PARITY_BINDING_MISMATCH');
  return true;
}
