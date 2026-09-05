#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='9e824463723ddf9e67994590e5328643d0f3326c';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const TASK='bounded non-interactive cinematic presentation-only storyboard v2 source-truth semantic-context construction; preserve the 45-second master clock and existing shot boundaries; no navigation controller shared-state analytics or protected-runtime authority';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.css',
  'assets/compass/compass.orientation-cinematic.final.js',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.media.js',
  'assets/compass/compass.orientation-cinematic.render.js'
].sort();
const TOKENS=Object.freeze({
  render:'b539e7ebd4f62265',
  media:'82fc41bad96fee7f',
  final:'906b340f8ad8bf72'
});
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

check('BOUNDED_PRESENTATION_INTENT',/(CINEMATIC|FILM|PLAYBACK)/u.test(TASK.toUpperCase())&&/(NON-INTERACTIVE|PRESENTATION-ONLY)/u.test(TASK.toUpperCase()),TASK);
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

check('MIRRORLAND_SOURCE_TRUE_WORLD',render.includes("world.src='/characters/'")&&render.includes("mirrorlandRepresentation='CURRENT_MATURE_COAST_WORLD_PLUS_CANONICAL_21_PANE_THRESHOLD'")&&render.includes('mirrorlandGeometry:Object.freeze'));
check('MIRRORLAND_THRESHOLD_PRESERVED',render.includes('const MIRROR_PANES=Object.freeze([')&&render.includes('phase=Number.isFinite(pane[6])?pane[6]:0'));
check('AUDRALIA_SOURCE_TRUE_WORLD',render.includes("world.src='/showroom/globe/audralia/'")&&render.includes("audraliaRepresentation='CURRENT_PLANETARY_WORLD_RUNTIME'")&&render.includes('__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__'));
check('OLD_AUDRALIA_2D_RECONSTRUCTION_REMOVED',!render.includes('COMPASS_AUDRALIA_SOURCE_RECONSTRUCTION_v1')&&!render.includes('drawAudraliaSourceReconstruction'));

check('HOUSE_PHASE3_BOUND',final.includes("renderer:'canonical-house-phase3-cinematic-reconstruction-v2'")&&final.includes("contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'")&&final.includes("import('/assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs')"));
check('BRAIN_SEMANTICS_CORRECT',final.includes("objectCard('brain','Discover your Coherence Index.','Take a free coherence assessment.')"));
check('TROPHY_SEMANTICS_CORRECT',final.includes("objectCard('trophy','Enter the Awards Chamber.','See the work recognized — and why.')"));
check('HOUSE_SEMANTICS_CORRECT',final.includes("objectCard('house','Meet the characters.','Choose who you want to speak with.')"));
check('S07_CONTAINER_DARK_TRANSPARENT',final.includes('.cinematic-breadth__renderer{')&&final.includes('background:transparent'));

for(const text of [
  'Diamond Gate Bridge','Interactive experience & research studio','Find your way.','The Compass orients the experience.',
  'Start here.','Chapter One is the guided introduction.',"See what we're testing.","See what's ready.",
  'Cross into Mirrorland.','Enter the narrative world.','Enter Audralia.','Explore a continuous planetary world.',
  'Discover your Coherence Index.','Take a free coherence assessment.','Enter the Awards Chamber.','See the work recognized — and why.',
  'Meet the characters.','Choose who you want to speak with.','Now choose your path.'
])check(`CONTEXT_${checks.length}`,css.includes(text),text);
check('CONTEXT_USES_EXISTING_SHOT_IDENTITY',css.includes('data-compass-cinematic-last-successful-shot')&&host.includes('dataset.compassCinematicLastSuccessfulShot=shot.id'));
check('CONTEXT_MOBILE_COMPOSITION',css.includes('@media(max-width:700px)')&&css.includes('.compass-orientation-cinematic__stage::before'));

check('FRESH_INTERNAL_RENDER_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.render.js?cb=${TOKENS.render}`));
check('FRESH_INTERNAL_MEDIA_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.media.js?cb=${TOKENS.media}`));
check('FRESH_INTERNAL_FINAL_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.final.js?cb=${TOKENS.final}`));
check('MEDIA_TIMELINE_ASSERTS_45000',media.includes("manifest.shots.at(-1)?.endMs!==45000")||media.includes('masterDurationMs!==45000'));
check('CUSTODY_TIMELINE_45000',Array.isArray(custody.s08NaturalFadeWindowMs)&&custody.s08NaturalFadeWindowMs[0]===44540&&custody.s08NaturalFadeWindowMs[1]===45000);

check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(combined));
check('INTRO_REMAINS_PREVIEW_GATED',host.includes("new URLSearchParams(location.search).get(PREVIEW_PARAM)==='1'")&&host.includes("constructionPreviewParameter:`${PREVIEW_PARAM}=1`"));
check('RESTORATION_PRESERVED',host.includes('restoreProductSurface()')&&host.includes("releaseLiveHouseDeferral(reason==='complete'?'cinematic-complete':'cinematic-settled')"));

const args=process.argv.slice(2);
const baseIndex=args.indexOf('--base');
const headIndex=args.indexOf('--head');
const changedIndex=args.indexOf('--changed-paths');
let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('EXACT_BASE_MATCH',base===BASE,base);
  let changed=null;
  if(changedIndex!==-1){changed=String(args[changedIndex+1]||'').split(',').filter(Boolean).sort();}
  else {const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}
  if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_STORYBOARD_V2_VERIFIER_v1',result,checkpoint:'SOURCE_TRUTH_CONTEXT_PRE_RENDER',base:BASE,subjectHead,mutationTask:TASK,expectedPaths:EXPECTED_PATHS,outerHomepageAssetIdentityRefresh:'DEFERRED_UNTIL_FINAL_PRE_RENDER_IDENTITY_FREEZE_TO_AVOID_REPEAT_INDEX_CHURN',proofBoundary:'STATIC_SOURCE_SCOPE_AND_INVARIANTS_ONLY; PHONE_AND_TABLET_RENDER_REVIEW_REQUIRED_BEFORE_ANIMATION_RETUNING',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
