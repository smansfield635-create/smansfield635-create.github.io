// Cinematic-only compatibility for the S06 renderer error channel.
// This binding carries no product state and is only loaded inside the cinematic module path.
if(!Object.prototype.hasOwnProperty.call(globalThis,'audraliaError')){
  Object.defineProperty(globalThis,'audraliaError',{value:null,writable:true,configurable:true});
}

export const CINEMATIC_MEDIA_MANIFEST=Object.freeze({
  schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version:'source-reconstruction-20260904-005-live',
  sourceMain:'46c56e0519fc875eac877b4bc921e3151b019a2f',
  promotionBase:'2fea2cdf65bb7121b8d88b1a10b853898aa09ca6',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  status:'SOURCE_BOUND_RELEASE_CANDIDATE',
  persistentField:'FIBONACCI_PAGE_NIGHT_SOURCE_RECONSTRUCTION',
  audraliaScopeCompatibility:'CINEMATIC_MODULE_GLOBAL_BINDING_V1',
  sourceBindings:Object.freeze({
    cosmos:Object.freeze({path:'assets/compass/compass.cosmos.js',blob:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',use:'S01_PERSISTENT_FIBONACCI_PAGE_NIGHT'}),
    crystals:Object.freeze({path:'assets/compass/compass.crystals.js',blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',use:'S02_S05_AND_S08_CARDINAL_GEOMETRY_MATERIAL_AND_HANDOFF_SOURCE'}),
    homepage:Object.freeze({path:'index.html',blob:'aa476ee5f6e74f56f2415bd8d36edfe1fa7a85ec',use:'S01_IDENTITY_S03_CHAPTER_ONE_S04_READINESS_S05_MIRRORLAND_S07_PROOF_AND_S08_LIVE_IDENTITY'}),
    chapterContract:Object.freeze({path:'.github/ai-router/projects/compass/chapter-one-contextual-delivery-contract.v1.json',blob:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e',use:'S03_CONTEXTUAL_DELIVERY_LOCK'}),
    readiness:Object.freeze({path:'assets/compass/compass.readiness-context-v1.js',blob:'dd6220df67cc73d57150f8fa498d0cf477298ded',use:'S04_READINESS_VISUAL_AND_CLAIM_SOURCE'}),
    mirrorland:Object.freeze({path:'assets/compass/compass.mirrorland-window.js',blob:'f99d3ffedf7b7654d067d21d9363eb287877f852',use:'S05_21_PANE_STAINED_GLASS_GEOMETRY_AND_REVEAL_SOURCE'}),
    controller:Object.freeze({path:'assets/compass/compass.controller.js',blob:'568a6b2cd608a4cbcd62cf70ed59b241c39c90d2',use:'S05_READ_ONLY_LIFECYCLE_CORRESPONDENCE_ONLY_NOT_IMPORTED_OR_DRIVEN'}),
    audraliaIndex:Object.freeze({path:'showroom/globe/audralia/index.html',blob:'96bf20a3189182683bc94c08e2ad7c0dba740f07',use:'S06_PUBLIC_AUDRALIA_PRESENTATION_SOURCE'}),
    audraliaRenderer:Object.freeze({path:'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',blob:'872d20b17bb0cd89d9613ca0262b25350890a617',use:'S06_IMMUTABLE_CANONICAL_SOURCE_IDENTITY_FOR_BOUNDED_RECONSTRUCTION'}),
    audraliaAwardsFloor:Object.freeze({path:'showroom/globe/h-earth/awards/media/diamond-gate-h-earth-audralia-30s-vivaldi.mp4',blob:'db0563a1a45811dadc36f48f0cb2356d748e9a07',use:'S06_QUALITY_FLOOR_ONLY_NOT_PLAYBACK_DEPENDENCY'}),
    capabilityCss:Object.freeze({path:'assets/compass/compass.capability-carousel.css',blob:'81db61b55a8f216c315633209c552ba340b05cf8',use:'S07_CAPABILITY_COMPOSITION_FLOOR'}),
    capabilityJs:Object.freeze({path:'assets/compass/compass.capability-carousel.js',blob:'d39c8870f3bcd3331522ebe985ace1030d149926',use:'S07_120_DEGREE_ONE_ACTIVE_OBJECT_GRAMMAR_REFERENCE'}),
    capabilityCore:Object.freeze({path:'assets/compass/compass.capability-carousel.core.js',blob:'86858e704cb739308e314a6299d5cf166aab7e27',use:'S07_CAPABILITY_CORE_REFERENCE'}),
    brain:Object.freeze({path:'assets/compass/compass.hra-brain-scene.js',blob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb',use:'S07_ISOLATED_EXACT_HRA_BRAIN_RENDERER'}),
    trophy:Object.freeze({path:'assets/compass/compass.trophy-scene.js',blob:'d281e18b06128671ffe2a19e8fdb272cc5544e31',use:'S07_ISOLATED_EXACT_PROCEDURAL_TROPHY_RENDERER'}),
    house:Object.freeze({path:'assets/compass/compass.house-scene.js',blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b',use:'S07_SOURCE_IDENTITY_FOR_BOUNDED_CINEMATIC_HOUSE_RECONSTRUCTION'}),
    incumbentHost:Object.freeze({path:'assets/compass/compass.orientation-cinematic.js',blob:'366c3c305df0d659fae56439804e9507aa79ceac',use:'S08_RESTORATION_AND_460MS_FADE_PRECEDENT'}),
    incumbentCss:Object.freeze({path:'assets/compass/compass.orientation-cinematic.css',blob:'c59ccfb282762e4cf1dcffeab74b705aa6c215ea',use:'S08_MODAL_AND_FADE_PRECEDENT'}),
    compassCss:Object.freeze({path:'assets/compass/compass.css',blob:'742966fff6a20455195510711e786f112f4e72c0',use:'S08_LIVE_COMPASS_VISUAL_FLOOR'})
  }),
  shots:Object.freeze([
    Object.freeze({id:'S01',beat:'Arrival',startMs:0,endMs:4500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'HOMEPAGE_IDENTITY_PLUS_COMPASS_COSMOS',acquisition:'SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S02',beat:'Orientation',startMs:4500,endMs:9500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'COMPASS_CRYSTAL_GEOMETRY_MATERIALS',acquisition:'ISOLATED_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S03',beat:'Chapter One',startMs:9500,endMs:14500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'CHAPTER_ONE_EDITORIAL_DESTINATION',acquisition:'SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S04',beat:'Choice / Readiness',startMs:14500,endMs:19500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'READINESS_STATIC_MARKUP_AND_CONTEXT_VISUAL_GRAMMAR',acquisition:'SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S05',beat:'Threshold',startMs:19500,endMs:25500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'MIRRORLAND_21_PANE_WINDOW_PLUS_COMPASS_GEOMETRY',acquisition:'ISOLATED_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S06',beat:'Elsewhere',startMs:25500,endMs:30500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'AUDRALIA_CANONICAL_GEOGRAPHY_SOURCE_RECONSTRUCTION',acquisition:'SOURCE_RECONSTRUCTION_WITH_DEFERRED_EXPORT_IDENTITY_CONFIRMATION'}),
    Object.freeze({id:'S07',beat:'Breadth / Engagement',startMs:30500,endMs:34000,status:'CONSTRUCTED_SOURCE_BOUND_OBJECT_RENDERERS',authority:'CAPABILITY_ORBIT_HRA_BRAIN_TROPHY_HOUSE_PLUS_BUILT_DIFFERENT',acquisition:'ISOLATED_SOURCE_RENDERER_REUSE_AND_BOUNDED_HOUSE_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S08',beat:'Return / Handoff',startMs:34000,endMs:38000,status:'CONSTRUCTED_LIVE_IDENTITY_BOUND_HANDOFF',authority:'CAPTURED_LIVE_COMPASS_IDENTITY_PLUS_CRYSTAL_SOURCE_AND_UNCHANGED_LIVE_REVEAL',acquisition:'SOURCE_RECONSTRUCTION_PLUS_LIVE_RUNTIME_REVEAL'})
  ])
});

export function assertCinematicMediaManifest(manifest=CINEMATIC_MEDIA_MANIFEST){
  if(manifest?.schema!=='COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1')throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if(manifest?.sourceMain!=='46c56e0519fc875eac877b4bc921e3151b019a2f')throw new Error('CINEMATIC_MEDIA_SOURCE_MAIN_MISMATCH');
  if(manifest?.promotionBase!=='2fea2cdf65bb7121b8d88b1a10b853898aa09ca6')throw new Error('CINEMATIC_MEDIA_PROMOTION_BASE_MISMATCH');
  if(manifest?.specificationCommit!=='88473442959299d6f6af82396917f0578074cab2')throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if(!Array.isArray(manifest?.shots)||manifest.shots.length!==8)throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  if(manifest.shots[0]?.startMs!==0||manifest.shots.at(-1)?.endMs!==38000)throw new Error('CINEMATIC_MEDIA_TIMELINE_MISMATCH');
  for(const id of ['S01','S02','S03','S04','S05','S06'])if(manifest.shots.find(shot=>shot.id===id)?.status!=='CONSTRUCTED_SOURCE_RECONSTRUCTION')throw new Error(`CINEMATIC_MEDIA_${id}_NOT_SOURCE_RECONSTRUCTION`);
  if(manifest.shots.find(shot=>shot.id==='S07')?.status!=='CONSTRUCTED_SOURCE_BOUND_OBJECT_RENDERERS')throw new Error('CINEMATIC_MEDIA_S07_NOT_SOURCE_BOUND_OBJECT_RENDERERS');
  if(manifest.shots.find(shot=>shot.id==='S08')?.status!=='CONSTRUCTED_LIVE_IDENTITY_BOUND_HANDOFF')throw new Error('CINEMATIC_MEDIA_S08_NOT_LIVE_HANDOFF');
  return true;
}
