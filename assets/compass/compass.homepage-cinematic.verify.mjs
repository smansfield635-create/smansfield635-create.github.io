#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='9e824463723ddf9e67994590e5328643d0f3326c';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const BASE_INDEX_BLOB='e22ea3c34662e4b003685f3c326514edd2ebdbd2';
const TASK='bounded non-interactive Compass cinematic storyboard v2 live owner-inspection release; source-world readiness must close before master playback; reversible live hook only; no navigation controller shared-state analytics or protected-runtime authority';
const EXPECTED_PATHS=[
  'index.html',
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.css',
  'assets/compass/compass.orientation-cinematic.final.js',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.media.js',
  'assets/compass/compass.orientation-cinematic.render.js'
].sort();
const TOKENS=Object.freeze({
  css:'d1b93312e7a6ad01',
  host:'a0ae16b51e16b3ae',
  render:'d210fb17a2bf5000',
  media:'82fc41bad96fee7f',
  final:'1af6d8dc0e1cfc8a'
});
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const index=read('index.html');
const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,css,render,media,final].join('\n');

check('BOUNDED_PRESENTATION_INTENT',/(CINEMATIC|OWNER-INSPECTION)/u.test(TASK.toUpperCase())&&/(NON-INTERACTIVE|REVERSIBLE)/u.test(TASK.toUpperCase()),TASK);
check('SOURCE_BASE_CURRENT',host.includes(`sourceMain:'${BASE}'`)&&media.includes(`sourceMain:'${BASE}'`)&&custody.sourceMain===BASE,BASE);
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

check('SOURCE_CUSTODY_BASE_INDEX_CORRECT',render.includes(`homepage:Object.freeze({path:'index.html',blob:'${BASE_INDEX_BLOB}'})`)&&final.includes(`homepage:Object.freeze({path:'index.html',blob:'${BASE_INDEX_BLOB}'})`),BASE_INDEX_BLOB);
check('MIRRORLAND_SOURCE_TRUE_WORLD',render.includes("world.src='/characters/'")&&render.includes("mirrorlandRepresentation='CURRENT_MATURE_COAST_WORLD_PLUS_CANONICAL_21_PANE_THRESHOLD'"));
check('MIRRORLAND_RUNTIME_READINESS',render.includes('function waitForMirrorlandRuntime')&&render.includes("querySelector('.signal-layer')")&&render.includes("querySelector('.proof-layer')")&&render.includes("MIRRORLAND_SOURCE_RUNTIME_READY_TIMEOUT"));
check('AUDRALIA_SOURCE_TRUE_WORLD',render.includes("world.src='/showroom/globe/audralia/'")&&render.includes('__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__'));
check('MASTER_WAIT_REQUIRES_SOURCE_WORLDS',host.includes('primary.mirrorlandWorldReady===true&&primary.audraliaWorldReady===true&&final.brainReady===true&&final.trophyReady===true&&final.houseReady===true'));
check('SOURCE_WORLD_ERRORS_FAIL_OPEN',host.includes('CINEMATIC_MIRRORLAND_SOURCE_PREPARATION_FAILED')&&host.includes('CINEMATIC_AUDRALIA_SOURCE_PREPARATION_FAILED'));
check('OLD_AUDRALIA_2D_RECONSTRUCTION_REMOVED',!render.includes('COMPASS_AUDRALIA_SOURCE_RECONSTRUCTION_v1')&&!render.includes('drawAudraliaSourceReconstruction'));

check('HOUSE_PHASE3_BOUND',final.includes("renderer:'canonical-house-phase3-cinematic-reconstruction-v2'")&&final.includes("contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'")&&final.includes("import('/assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs')"));
check('S07_SEMANTICS',final.includes("objectCard('brain','Discover your Coherence Index.','Take a free coherence assessment.')")&&final.includes("objectCard('trophy','Enter the Awards Chamber.','See the work recognized — and why.')")&&final.includes("objectCard('house','Meet the characters.','Choose who you want to speak with.')"));
check('S07_TRANSPARENT_PRESENTATION',final.includes('.cinematic-breadth__renderer{')&&final.includes('background:transparent'));
check('CONTEXT_SPINE_PRESENT',css.includes('data-compass-cinematic-last-successful-shot')&&css.includes('Discover your Coherence Index.')&&css.includes('Enter the Awards Chamber.')&&css.includes('Meet the characters.')&&css.includes('Now choose your path.'));

check('LIVE_HOOK_LOCALIZED',host.includes('const liveHookEnabled=()=>true;')&&host.includes('const introEnabled=()=>liveHookEnabled()||previewEnabled();')&&host.includes("if(!introEnabled()){releaseLiveHouseDeferral('intro-disabled');return;}")&&host.includes('if(introEnabled())installLiveHouseDeferral();'));
check('LIVE_HOOK_EXPOSED_FOR_INSPECTION',host.includes('liveHookEnabled:liveHookEnabled(),introEnabled:introEnabled()'));
check('CUSTODY_LIVE_OWNER_REVIEW',custody.introActivationState==='INTRO_HOOKED_LIVE_OWNER_REVIEW'&&custody.rollbackPrecedent==='PR_2753_LOCALIZED_UNHOOK'&&custody.sourceWorldsRequiredBeforeMasterClock===true);

check('FRESH_INTERNAL_RENDER_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.render.js?cb=${TOKENS.render}`));
check('FRESH_INTERNAL_MEDIA_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.media.js?cb=${TOKENS.media}`));
check('FRESH_INTERNAL_FINAL_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.final.js?cb=${TOKENS.final}`));
check('FRESH_PAGE_CSS_IDENTITY',index.includes(`/assets/compass/compass.orientation-cinematic.css?v=storyboard-v2-live-review-20260905-001&cb=${TOKENS.css}`));
check('FRESH_PAGE_HOST_IDENTITY',index.includes(`/assets/compass/compass.orientation-cinematic.js?v=storyboard-v2-live-review-20260905-001&cb=${TOKENS.host}`));

check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(combined));
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
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_STORYBOARD_V2_LIVE_REVIEW_VERIFIER_v1',result,checkpoint:'PRE_LIVE_OWNER_INSPECTION_STATIC_PREFLIGHT',base:BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC_SOURCE_SCOPE_AND_INVARIANTS_ONLY; LIVE OWNER PHONE/TABLET CAPTURE REMAINS REQUIRED',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
