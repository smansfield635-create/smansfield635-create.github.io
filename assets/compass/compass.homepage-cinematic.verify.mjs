#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='6d786a9a6bb0c91f7bae3c46b286ddb7bd0e033b';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const TASK='bounded non-interactive Compass cinematic storyboard v2 detached source-reconstruction repair; remove destination runtime embedding; keep intro unhooked; preserve frozen timing navigation state analytics and protected runtime authority';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.media.js',
  'assets/compass/compass.orientation-cinematic.render.js'
].sort();
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,css,render,media,final].join('\n');

check('BOUNDED_PRESENTATION_INTENT',/(CINEMATIC|SOURCE-RECONSTRUCTION)/u.test(TASK.toUpperCase())&&/(NON-INTERACTIVE|UNHOOKED)/u.test(TASK.toUpperCase()),TASK);
check('MEDIA_BASE_CURRENT',media.includes(`sourceMain:'${BASE}'`)&&custody.sourceMain===BASE,BASE);
check('SPECIFICATION_PRESERVED',host.includes(SPEC)&&media.includes(SPEC)&&custody.specificationCommit===SPEC,SPEC);
check('MASTER_DURATION_45000',host.includes('const MASTER_DURATION_MS=45000')&&media.includes('masterDurationMs:45000')&&custody.masterDurationMs===45000);
const shotStrings=[
  "id:'S01',beat:'Arrival',purpose:'Enter Diamond Gate Bridge',startMs:0,endMs:4500",
  "id:'S02',beat:'Orientation',purpose:'Establish how the estate is navigated',startMs:4500,endMs:9500",
  "id:'S03',beat:'Chapter One',purpose:'Show where a visitor can begin',startMs:9500,endMs:14500",
  "id:'S04',beat:'Choice / Readiness',purpose:'Reveal structured paths through the estate',startMs:14500,endMs:19500",
  "id:'S05',beat:'Threshold',purpose:'Cross from orientation into deeper experience',startMs:19500,endMs:25500",
  "id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500",
  "id:'S07',beat:'Breadth / Engagement',purpose:'Reveal ways to engage and estate breadth',startMs:30500,endMs:41000",
  "id:'S08',beat:'Return / Handoff',purpose:'Restore visitor agency',startMs:41000,endMs:45000"
];
check('SHOT_BOUNDARIES_UNCHANGED',shotStrings.every(value=>host.includes(value)));
check('S07_INTERNAL_CINEMATOGRAPHY_REMAP_UNCHANGED',host.includes('const legacyElapsedMs=30500+frame.shotProgress*3500'));
check('FINAL_HANDOFF_TIMING_UNCHANGED',host.includes('const NATURAL_HANDOFF_FADE_START_MS=44540')&&host.includes('const NATURAL_HANDOFF_FADE_MS=460')&&host.includes("shot.id==='S08'&&elapsedMs>=43800"));

check('RUNTIME_EMBEDDING_REMOVED',!render.includes("world.src='/characters/'")&&!render.includes("world.src='/showroom/globe/audralia/'")&&!render.includes('sourceFrameReady(')&&!render.includes('waitForMirrorlandRuntime')&&!render.includes('waitForAudraliaRuntime')&&!render.includes('__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__'));
check('NO_CINEMATIC_IFRAME_CREATION',!render.includes("make('iframe','cinematic-mirrorland__world')")&&!render.includes("make('iframe','cinematic-audralia__world')"));
check('DETACHED_RUNTIME_POLICY_EXPLICIT',render.includes("runtimeEmbedding:'false'")&&media.includes('runtimeEmbeddingAllowed:false')&&media.includes('sourceWorldsRequiredBeforeMasterClock:false')&&custody.runtimeEmbeddingAllowed===false&&custody.sourceWorldsRequiredBeforeMasterClock===false);

check('MIRRORLAND_WINDOW_GEOMETRY_BOUND',render.includes("mirrorlandGeometry:Object.freeze({path:'assets/shared/mirrorland-window.geometry.js'")&&render.includes('MIRROR_PANES=Object.freeze(['));
check('MIRRORLAND_REGIONAL_SOURCE_BOUND',render.includes("from '/characters/step9-regional-geography.mjs'")&&render.includes('step9TerrainHeight')&&render.includes('step9ShorelineZ')&&render.includes("resolveStep9Camera('MIRROR_MANOR')"));
check('MIRRORLAND_NIGHT_PRESENTATION_BOUND',render.includes("from '/characters/night-renderer.mjs'")&&render.includes('GRATITUDE_COAST_NIGHT'));
check('MIRRORLAND_DETACHED_CANVAS',render.includes("make('canvas','cinematic-mirrorland__world')")&&render.includes("mirrorlandRepresentation:'DETACHED_GEOMETRY_SOURCE_RECONSTRUCTION'"));

check('AUDRALIA_GEOGRAPHY_SOURCE_BOUND',render.includes('AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER')&&render.includes('sampleAudraliaGratitudeTerrain')&&render.includes('resolveAudraliaGratitudeShorelineZ')&&render.includes('AUDRALIA_HYDROLOGY'));
check('AUDRALIA_DETACHED_CANVAS',render.includes("make('canvas','cinematic-audralia__world')")&&render.includes("audraliaRepresentation:'DETACHED_GEOGRAPHY_SOURCE_RECONSTRUCTION'"));
check('AUDRALIA_HYDROLOGY_RECONSTRUCTED',render.includes('geometry.rivers')&&render.includes('geometry.lakes'));
check('OLD_AUDRALIA_RUNTIME_PRESENTATION_REMOVED',!render.includes('CURRENT_PLANETARY_WORLD_RUNTIME')&&!custody.s06Representation?.includes('RUNTIME'));

check('MEDIA_CONTRACT_BINDINGS',media.includes("contract:'CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1'")&&media.includes("contract:'CHARACTERS_GRATITUDE_ENVIRONMENT_RENDERER_V2'")&&media.includes("contract:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1'"));
check('CUSTODY_UNHOOKED',custody.introActivationState==='INTRO_PRESENT_BUT_UNHOOKED'&&custody.status==='STORYBOARD_V2_DETACHED_SOURCE_RECONSTRUCTION_UNHOOKED');

check('HOST_REMAINS_PREVIEW_ONLY',host.includes("const previewEnabled=()=>new URLSearchParams(location.search).get(PREVIEW_PARAM)==='1';")&&host.includes("if(!previewEnabled()){releaseLiveHouseDeferral('preview-disabled');return;}")&&host.includes('if(previewEnabled())installLiveHouseDeferral();')&&!host.includes('const liveHookEnabled=()=>true'));
check('MASTER_START_NOT_BOUND_TO_MIRRORLAND_OR_AUDRALIA',!host.includes('primary.mirrorlandWorldReady===true')&&!host.includes('primary.audraliaWorldReady===true'));
check('FAILED_RUNTIME_GATE_ABSENT',!host.includes('CINEMATIC_SOURCE_WORLD_AND_OBJECT_READY_TIMEOUT')&&!host.includes('CINEMATIC_MIRRORLAND_SOURCE_PREPARATION_FAILED')&&!host.includes('CINEMATIC_AUDRALIA_SOURCE_PREPARATION_FAILED'));

check('HOUSE_PHASE3_BOUND',final.includes("renderer:'canonical-house-phase3-cinematic-reconstruction-v2'")&&final.includes("contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'")&&final.includes("import('/assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs')"));
check('S07_SEMANTICS',final.includes("objectCard('brain','Discover your Coherence Index.','Take a free coherence assessment.')")&&final.includes("objectCard('trophy','Enter the Awards Chamber.','See the work recognized — and why.')")&&final.includes("objectCard('house','Meet the characters.','Choose who you want to speak with.')"));
check('CONTEXT_SPINE_PRESERVED',css.includes('data-compass-cinematic-last-successful-shot')&&css.includes('Discover your Coherence Index.')&&css.includes('Enter the Awards Chamber.')&&css.includes('Meet the characters.')&&css.includes('Now choose your path.'));

check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_RUNTIME_DYNAMIC_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(combined));
check('RESTORATION_PRESERVED',host.includes('restoreProductSurface()')&&host.includes("releaseLiveHouseDeferral(reason==='complete'?'cinematic-complete':'cinematic-settled')"));
check('PREVIEW_ROUTE_PRESERVED',host.includes("new URLSearchParams(location.search).get(PREVIEW_PARAM)==='1'")&&host.includes("constructionPreviewParameter:`${PREVIEW_PARAM}=1`"));

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');
let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_BASE_MATCH',base===BASE,base);
  let changed=null;
  if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}
  else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}
  if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_STORYBOARD_V2_DETACHED_SOURCE_RECONSTRUCTION_VERIFIER_v1',result,checkpoint:'SOURCE_RECONSTRUCTION_ARCHITECTURE_STATIC_PREFLIGHT',base:BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC_SOURCE_SCOPE_AND_INVARIANTS_ONLY; CINEMATIC REMAINS UNHOOKED',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
