export const CINEMATIC_MEDIA_MANIFEST=Object.freeze({
  schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1',
  version:'source-reconstruction-20260904-002',
  sourceMain:'46c56e0519fc875eac877b4bc921e3151b019a2f',
  specificationCommit:'88473442959299d6f6af82396917f0578074cab2',
  status:'PARTIAL_CONSTRUCTION_S01_S03_SOURCE_BOUND',
  persistentField:'FIBONACCI_PAGE_NIGHT_SOURCE_RECONSTRUCTION',
  sourceBindings:Object.freeze({
    cosmos:Object.freeze({path:'assets/compass/compass.cosmos.js',blob:'4fe781df1a8876218c6f081b6ec88d5d2d6044c7',use:'S01_PERSISTENT_FIBONACCI_PAGE_NIGHT'}),
    crystals:Object.freeze({path:'assets/compass/compass.crystals.js',blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',use:'S02_ISOLATED_CARDINAL_GEOMETRY_MATERIAL_RECONSTRUCTION'}),
    homepage:Object.freeze({path:'index.html',blob:'aa476ee5f6e74f56f2415bd8d36edfe1fa7a85ec',use:'S01_IDENTITY_AND_S03_CHAPTER_ONE_EDITORIAL_SOURCE'}),
    chapterContract:Object.freeze({path:'.github/ai-router/projects/compass/chapter-one-contextual-delivery-contract.v1.json',blob:'9813c60f8ca9b5f27fccbf44cade7bb08c2f0f2e',use:'S03_CONTEXTUAL_DELIVERY_LOCK'})
  }),
  shots:Object.freeze([
    Object.freeze({id:'S01',beat:'Arrival',startMs:0,endMs:4500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'HOMEPAGE_IDENTITY_PLUS_COMPASS_COSMOS',acquisition:'SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S02',beat:'Orientation',startMs:4500,endMs:9500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'COMPASS_CRYSTAL_GEOMETRY_MATERIALS',acquisition:'ISOLATED_SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S03',beat:'Chapter One',startMs:9500,endMs:14500,status:'CONSTRUCTED_SOURCE_RECONSTRUCTION',authority:'CHAPTER_ONE_EDITORIAL_DESTINATION',acquisition:'SOURCE_RECONSTRUCTION'}),
    Object.freeze({id:'S04',beat:'Choice / Readiness',startMs:14500,endMs:19500,status:'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED'}),
    Object.freeze({id:'S05',beat:'Threshold',startMs:19500,endMs:25500,status:'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED'}),
    Object.freeze({id:'S06',beat:'Elsewhere',startMs:25500,endMs:30500,status:'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED'}),
    Object.freeze({id:'S07',beat:'Breadth / Engagement',startMs:30500,endMs:34000,status:'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED'}),
    Object.freeze({id:'S08',beat:'Return / Handoff',startMs:34000,endMs:38000,status:'SOURCE_BOUND_MEDIA_NOT_YET_ACQUIRED'})
  ])
});

export function assertCinematicMediaManifest(manifest=CINEMATIC_MEDIA_MANIFEST){
  if(manifest?.schema!=='COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1')throw new Error('CINEMATIC_MEDIA_SCHEMA_MISMATCH');
  if(manifest?.sourceMain!=='46c56e0519fc875eac877b4bc921e3151b019a2f')throw new Error('CINEMATIC_MEDIA_BASE_MISMATCH');
  if(manifest?.specificationCommit!=='88473442959299d6f6af82396917f0578074cab2')throw new Error('CINEMATIC_MEDIA_SPEC_MISMATCH');
  if(!Array.isArray(manifest?.shots)||manifest.shots.length!==8)throw new Error('CINEMATIC_MEDIA_SHOT_COUNT_MISMATCH');
  if(manifest.shots[0]?.startMs!==0||manifest.shots.at(-1)?.endMs!==38000)throw new Error('CINEMATIC_MEDIA_TIMELINE_MISMATCH');
  for(const id of ['S01','S02','S03'])if(manifest.shots.find(shot=>shot.id===id)?.status!=='CONSTRUCTED_SOURCE_RECONSTRUCTION')throw new Error(`CINEMATIC_MEDIA_${id}_NOT_CONSTRUCTED`);
  return true;
}
