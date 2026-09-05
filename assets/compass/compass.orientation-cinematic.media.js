export const CINEMATIC_MEDIA_MANIFEST=Object.freeze({
  schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version:'storyboard-v2-detached-source-reconstruction-20260905-001',
  sourceMain:'6d786a9a6bb0c91f7bae3c46b286ddb7bd0e033b',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  storyboardIssue:2756,
  status:'STORYBOARD_V2_DETACHED_SOURCE_RECONSTRUCTION_UNHOOKED',
  masterDurationMs:45000,
  persistentField:'FIBONACCI_PAGE_NIGHT_SOURCE_RECONSTRUCTION',
  runtimeEmbeddingAllowed:false,
  sourceWorldsRequiredBeforeMasterClock:false,
  sourceBindings:Object.freeze({
    cosmos:Object.freeze({path:'assets/compass/compass.cosmos.js',blob:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',use:'S01_PERSISTENT_FIBONACCI_PAGE_NIGHT'}),
    crystals:Object.freeze({path:'assets/compass/compass.crystals.js',blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',use:'S02_AND_S08_CARDINAL_GEOMETRY_AND_HANDOFF_SOURCE'}),
    chapterContract:Object.freeze({path:'.github/ai-router/projects/compass/chapter-one-contextual-delivery-contract.v1.json',blob:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e',use:'S03_CONTEXTUAL_DELIVERY_LOCK'}),
    readiness:Object.freeze({path:'assets/compass/compass.readiness-context-v1.js',blob:'dd6220df67cc73d57150f8fa498d0cf477298ded',use:'S04_READINESS_VISUAL_AND_CLAIM_SOURCE'}),
    mirrorlandGeometry:Object.freeze({path:'assets/shared/mirrorland-window.geometry.js',blob:'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595',use:'S05_CANONICAL_21_PANE_THRESHOLD'}),
    mirrorlandRegionalGeometry:Object.freeze({path:'characters/step9-regional-geography.mjs',contract:'CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1',use:'S05_READ_ONLY_COAST_TERRAIN_SHORELINE_AND_CAMERA_GEOMETRY'}),
    mirrorlandNightPresentation:Object.freeze({path:'characters/night-renderer.mjs',contract:'CHARACTERS_GRATITUDE_ENVIRONMENT_RENDERER_V2',use:'S05_PRESENTATION_PALETTE_AND_NIGHT_LANGUAGE_WITHOUT_RUNTIME_COUPLING'}),
    audraliaGeography:Object.freeze({path:'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',contract:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',use:'S06_CONTINENTAL_GEOGRAPHY_TERRAIN_COAST_HYDROLOGY_SOURCE'}),
    audraliaRenderer:Object.freeze({path:'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',blob:'872d20b17bb0cd89d9613ca0262b25350890a617',use:'S06_ACCEPTED_RENDERER_LINEAGE_REFERENCE'}),
    brain:Object.freeze({path:'assets/compass/compass.hra-brain-scene.js',blob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb',use:'S07A_EXACT_HRA_BRAIN_RENDERER'}),
    trophy:Object.freeze({path:'assets/compass/compass.trophy-scene.js',blob:'d281e18b06128671ffe2a19e8fdb272cc5544e31',use:'S07B_EXACT_PROCEDURAL_TROPHY_RENDERER'}),
    house:Object.freeze({path:'assets/compass/compass.house-scene.js',blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',use:'S07C_MATURE_PHASE3_HOUSE_RENDERER_IDENTITY'}),
    housePhase3:Object.freeze({path:'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs',blob:'38bc8fa60a251681cb5484926409290f66460ad0',use:'S07C_PHASE3_CINEMATIC_GEOMETRY_SOURCE'})
  }),
  shots:Object.freeze([
    Object.freeze({id:'S01',beat:'Arrival',startMs:0,endMs:4500,authority:'DIAMOND_GATE_IDENTITY'}),
    Object.freeze({id:'S02',beat:'Orientation',startMs:4500,endMs:9500,authority:'COMPASS_CARDINAL_ORIENTATION'}),
    Object.freeze({id:'S03',beat:'Chapter One',startMs:9500,endMs:14500,authority:'CHAPTER_ONE_GUIDED_BEGINNING'}),
    Object.freeze({id:'S04',beat:'Choice / Readiness',startMs:14500,endMs:19500,authority:'RESEARCH_READINESS_EVIDENCE_BOUNDARY'}),
    Object.freeze({id:'S05',beat:'Threshold',startMs:19500,endMs:25500,authority:'MIRRORLAND_DETACHED_GEOMETRY_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S06',beat:'Elsewhere',startMs:25500,endMs:30500,authority:'AUDRALIA_DETACHED_GEOGRAPHY_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S07',beat:'Breadth / Engagement',startMs:30500,endMs:41000,authority:'COHERISCOPE_AWARDS_HOUSE_SEPARATED_ENGAGEMENT'}),
    Object.freeze({id:'S08',beat:'Return / Handoff',startMs:41000,endMs:45000,authority:'LIVE_COMPASS_IDENTITY_HANDOFF'})
  ])
});

export function assertCinematicMediaManifest(manifest=CINEMATIC_MEDIA_MANIFEST){
  if(manifest?.schema!=='COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1')throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if(manifest?.sourceMain!=='6d786a9a6bb0c91f7bae3c46b286ddb7bd0e033b')throw new Error('CINEMATIC_MEDIA_BASE_MISMATCH');
  if(manifest?.specificationCommit!=='88473442959299d6f6af82396917f0578074cab2')throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if(manifest?.masterDurationMs!==45000)throw new Error('CINEMATIC_MEDIA_DURATION_MISMATCH');
  if(manifest?.runtimeEmbeddingAllowed!==false||manifest?.sourceWorldsRequiredBeforeMasterClock!==false)throw new Error('CINEMATIC_MEDIA_RUNTIME_EMBEDDING_POLICY_MISMATCH');
  if(!Array.isArray(manifest?.shots)||manifest.shots.length!==8)throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  const expected=[['S01',0,4500],['S02',4500,9500],['S03',9500,14500],['S04',14500,19500],['S05',19500,25500],['S06',25500,30500],['S07',30500,41000],['S08',41000,45000]];
  for(const [id,startMs,endMs] of expected){const shot=manifest.shots.find(item=>item.id===id);if(!shot||shot.startMs!==startMs||shot.endMs!==endMs)throw new Error(`CINEMATIC_MEDIA_${id}_TIMELINE_MISMATCH`);}
  for(const key of ['mirrorlandGeometry','audraliaRenderer','brain','trophy','house','housePhase3'])if(!manifest.sourceBindings?.[key]?.blob)throw new Error(`CINEMATIC_MEDIA_BLOB_BINDING_MISSING:${key}`);
  for(const key of ['mirrorlandRegionalGeometry','mirrorlandNightPresentation','audraliaGeography'])if(!manifest.sourceBindings?.[key]?.path||!manifest.sourceBindings?.[key]?.contract)throw new Error(`CINEMATIC_MEDIA_CONTRACT_BINDING_MISSING:${key}`);
  return true;
}
