export const CINEMATIC_MEDIA_MANIFEST=Object.freeze({
  schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version:'storyboard-v2-source-truth-20260905-001',
  sourceMain:'9e824463723ddf9e67994590e5328643d0f3326c',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  storyboardIssue:2756,
  status:'STORYBOARD_V2_SOURCE_TRUTH_AND_CONTEXT_CONSTRUCTION',
  masterDurationMs:45000,
  persistentField:'FIBONACCI_PAGE_NIGHT_SOURCE_RECONSTRUCTION',
  sourceBindings:Object.freeze({
    cosmos:Object.freeze({path:'assets/compass/compass.cosmos.js',blob:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',use:'S01_PERSISTENT_FIBONACCI_PAGE_NIGHT'}),
    crystals:Object.freeze({path:'assets/compass/compass.crystals.js',blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',use:'S02_AND_S08_CARDINAL_GEOMETRY_AND_HANDOFF_SOURCE'}),
    chapterContract:Object.freeze({path:'.github/ai-router/projects/compass/chapter-one-contextual-delivery-contract.v1.json',blob:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e',use:'S03_CONTEXTUAL_DELIVERY_LOCK'}),
    readiness:Object.freeze({path:'assets/compass/compass.readiness-context-v1.js',blob:'dd6220df67cc73d57150f8fa498d0cf477298ded',use:'S04_READINESS_VISUAL_AND_CLAIM_SOURCE'}),
    mirrorlandGeometry:Object.freeze({path:'assets/shared/mirrorland-window.geometry.js',blob:'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595',use:'S05_CANONICAL_21_PANE_THRESHOLD'}),
    mirrorlandWorld:Object.freeze({path:'characters/index.html',blob:'043ba9a4b8a03d182f41d665128a20b8ce1d8e4d',use:'S05_MATURE_MIRRORLAND_COAST_WORLD'}),
    mirrorlandApp:Object.freeze({path:'characters/app.mjs',blob:'045ffe6dc85b50eda1a81db95bdd2fa4e8779380',use:'S05_MATURE_WORLD_RUNTIME'}),
    mirrorlandClouds:Object.freeze({path:'characters/cloud-system.mjs',blob:'b91174dcf4c59590c928ca860c2138604856f0a3',use:'S05_MATURE_WORLD_ATMOSPHERE'}),
    audraliaIndex:Object.freeze({path:'showroom/globe/audralia/index.html',blob:'96bf20a3189182683bc94c08e2ad7c0dba740f07',use:'S06_CONTINUOUS_PLANETARY_WORLD'}),
    audraliaRenderer:Object.freeze({path:'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',blob:'872d20b17bb0cd89d9613ca0262b25350890a617',use:'S06_CANONICAL_WORLD_RENDERER'}),
    audraliaPresentation:Object.freeze({path:'inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs',blob:'64b962fcdb098ffa1f3149a434ad1bfcdc4e21d3',use:'S06_CURRENT_ATMOSPHERE_WEATHER_PRESENTATION'}),
    brain:Object.freeze({path:'assets/compass/compass.hra-brain-scene.js',blob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb',use:'S07A_EXACT_HRA_BRAIN_RENDERER'}),
    trophy:Object.freeze({path:'assets/compass/compass.trophy-scene.js',blob:'d281e18b06128671ffe2a19e8fdb272cc5544e31',use:'S07B_EXACT_PROCEDURAL_TROPHY_RENDERER'}),
    house:Object.freeze({path:'assets/compass/compass.house-scene.js',blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',use:'S07C_MATURE_PHASE3_HOUSE_RENDERER'}),
    housePhase3:Object.freeze({path:'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs',blob:'38bc8fa60a251681cb5484926409290f66460ad0',use:'S07C_PHASE3_CINEMATIC_GEOMETRY_SOURCE'})
  }),
  shots:Object.freeze([
    Object.freeze({id:'S01',beat:'Arrival',startMs:0,endMs:4500,authority:'DIAMOND_GATE_IDENTITY'}),
    Object.freeze({id:'S02',beat:'Orientation',startMs:4500,endMs:9500,authority:'COMPASS_CARDINAL_ORIENTATION'}),
    Object.freeze({id:'S03',beat:'Chapter One',startMs:9500,endMs:14500,authority:'CHAPTER_ONE_GUIDED_BEGINNING'}),
    Object.freeze({id:'S04',beat:'Choice / Readiness',startMs:14500,endMs:19500,authority:'RESEARCH_READINESS_EVIDENCE_BOUNDARY'}),
    Object.freeze({id:'S05',beat:'Threshold',startMs:19500,endMs:25500,authority:'MIRRORLAND_CANONICAL_THRESHOLD_PLUS_MATURE_WORLD'}),
    Object.freeze({id:'S06',beat:'Elsewhere',startMs:25500,endMs:30500,authority:'AUDRALIA_CURRENT_CONTINUOUS_PLANETARY_WORLD'}),
    Object.freeze({id:'S07',beat:'Breadth / Engagement',startMs:30500,endMs:41000,authority:'COHERISCOPE_AWARDS_HOUSE_SEPARATED_ENGAGEMENT'}),
    Object.freeze({id:'S08',beat:'Return / Handoff',startMs:41000,endMs:45000,authority:'LIVE_COMPASS_IDENTITY_HANDOFF'})
  ])
});

export function assertCinematicMediaManifest(manifest=CINEMATIC_MEDIA_MANIFEST){
  if(manifest?.schema!=='COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1')throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if(manifest?.sourceMain!=='9e824463723ddf9e67994590e5328643d0f3326c')throw new Error('CINEMATIC_MEDIA_BASE_MISMATCH');
  if(manifest?.specificationCommit!=='88473442959299d6f6af82396917f0578074cab2')throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if(manifest?.masterDurationMs!==45000)throw new Error('CINEMATIC_MEDIA_DURATION_MISMATCH');
  if(!Array.isArray(manifest?.shots)||manifest.shots.length!==8)throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  const expected=[['S01',0,4500],['S02',4500,9500],['S03',9500,14500],['S04',14500,19500],['S05',19500,25500],['S06',25500,30500],['S07',30500,41000],['S08',41000,45000]];
  for(const [id,startMs,endMs] of expected){const shot=manifest.shots.find(item=>item.id===id);if(!shot||shot.startMs!==startMs||shot.endMs!==endMs)throw new Error(`CINEMATIC_MEDIA_${id}_TIMELINE_MISMATCH`);}
  for(const key of ['mirrorlandGeometry','mirrorlandWorld','audraliaRenderer','audraliaPresentation','brain','trophy','house','housePhase3'])if(!manifest.sourceBindings?.[key]?.blob)throw new Error(`CINEMATIC_MEDIA_SOURCE_BINDING_MISSING:${key}`);
  return true;
}
