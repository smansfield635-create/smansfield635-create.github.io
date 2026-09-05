#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const REPAIR_BASE='65f7ab40bacf5853384b684463daff0dba097868';
const SOURCE_BASE='46c56e0519fc875eac877b4bc921e3151b019a2f';
const EXPECTED_SPEC='88473442959299d6f6af82396917f0578074cab2';
const EXPECTED_PATHS=[
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.homepage-cinematic.verify.mjs'
].sort();
const MUTATION_TASK='bounded non-interactive cinematic presentation playback completion repair restoring entry pre-roll, soundtrack, full timed passage sequence, and final presentation handoff';
const AQUARIUM_URL='https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg';
const ENTRY_LAW='SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER';
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

check('BOUNDED_CLASSIFIER_TASK',/(CINEMATIC|FILM|VIDEO|PLAYBACK)/u.test(MUTATION_TASK.toUpperCase())&&/(NON-INTERACTIVE|NONINTERACTIVE|PRESENTATION-ONLY|PRESENTATION ONLY)/u.test(MUTATION_TASK.toUpperCase()),MUTATION_TASK);
check('BOUNDED_EXECUTABLE_SCOPE',EXPECTED_PATHS.filter(p=>/\.(?:js|mjs|cjs|ts|tsx|jsx)$/i.test(p)).every(p=>p.toLowerCase().includes('cinematic')),JSON.stringify(EXPECTED_PATHS));
check('SOURCE_BASE_PRESERVED',host.includes(`sourceMain:'${SOURCE_BASE}'`)&&custody.sourceMain===SOURCE_BASE,SOURCE_BASE);
check('REPAIR_BASE_BOUND',host.includes(`repairBase:'${REPAIR_BASE}'`),REPAIR_BASE);
check('SPECIFICATION_PRESERVED',host.includes(EXPECTED_SPEC)&&custody.specificationCommit===EXPECTED_SPEC,EXPECTED_SPEC);
check('MASTER_DURATION_REMAINS_38000',host.includes('const MASTER_DURATION_MS=38000')&&custody.masterDurationMs===38000);
for(const id of ['S01','S02','S03','S04','S05','S06','S07','S08'])check(`SHOT_${id}_PRESERVED`,host.includes(`id:'${id}'`)&&media.includes(`id:'${id}'`));

check('ENTRY_GATE_RESTORED',host.includes('data-cinematic-play>Play intro</button>')&&host.includes('data-main-orientation-skip>Skip intro</button>')&&host.includes('<h2 id="compass-orientation-cinematic-title">Find your way.</h2>'));
check('ENTRY_PREROLL_NOT_MASTER',host.includes('const ENTRY_PREROLL_DURATION_MS=4350')&&host.includes('entryPreRollCountedInMaster:false')&&host.includes('session.startAt=performance.now()'));
check('ENTRY_CONTINUITY_LAW_RESTORED',host.includes(ENTRY_LAW),ENTRY_LAW);
check('ENTRY_TESSELLATION_IMPLEMENTED',host.includes('function buildEntryTessellation(button)')&&host.includes('function drawEntryTransition(now)')&&host.includes('drawEntryCell(')&&host.includes('ENTRY_TESSELLATE_START_MS=140')&&host.includes('ENTRY_TESSELLATE_END_MS=820'));
check('ENTRY_ZERO_BLANK_HANDOFF',host.includes('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')&&host.indexOf('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')<host.indexOf('if(entry)entry.hidden=true'));

check('AQUARIUM_EXACT_SOURCE',host.includes(AQUARIUM_URL),AQUARIUM_URL);
check('AQUARIUM_USER_GESTURE_START',host.includes('async function beginIntro(button)')&&host.includes('startSoundtrack();')&&host.indexOf('startSoundtrack();',host.indexOf('async function beginIntro(button)'))<host.indexOf('void prepareRendererForPlayback();',host.indexOf('async function beginIntro(button)')));
check('AQUARIUM_STOPS_ON_SETTLEMENT',host.includes('function stopSoundtrack()')&&host.includes("function restore(reason='complete')")&&host.includes('stopSoundtrack();'));

check('LATE_FILM_SOURCES_READY_BEFORE_MASTER',host.includes('function waitForLateFilmSources(renderer,timeoutMs=18000)')&&host.includes('snap?.brainReady===true&&snap?.trophyReady===true&&snap?.houseReady===true')&&host.indexOf('await waitForLateFilmSources(session.renderer);')<host.indexOf('session.rendererReady=true'));
check('MASTER_WAITS_FOR_ENTRY_AND_RENDERER',host.includes('!session.entryTransitionComplete||!session.rendererReady')&&host.includes('function maybeStartMasterPlayback()'));
check('S07_BRAIN_TROPHY_HOUSE_SOURCES_PRESERVED',final.includes('/assets/compass/compass.hra-brain-scene.js')&&final.includes('/assets/compass/compass.trophy-scene.js')&&final.includes('mountCinematicHouseRenderer'));
check('S07_VISUAL_SEQUENCE_PRESERVED',final.includes("objectCard('brain','Coheriscope'")&&final.includes("objectCard('trophy','Awards & Recognition'")&&final.includes("objectCard('house','The House'")&&final.includes('t<31150')&&final.includes('t<31850')&&final.includes('t<32450')&&final.includes('t<33050')&&final.includes('t<33550'));
check('S05_MIRRORLAND_PRESERVED',render.includes('Find the door to Mirrorland.')&&render.includes('const MIRROR_PANES=Object.freeze(['));
check('S06_AUDRALIA_BOUNDED_RECONSTRUCTION_PRESERVED',render.includes('COMPASS_AUDRALIA_SOURCE_RECONSTRUCTION_v1')&&render.includes('audraliaFullWorldConstructorUsed:false'));
check('S08_HANDOFF_PRESERVED',host.includes('CINEMATIC_HANDOFF_CORRESPONDENCE_UNPROVEN')&&final.includes('function verifyHandoff()')&&host.includes('const NATURAL_HANDOFF_FADE_START_MS=37540'));

check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('IDEMPOTENT_RESTORATION',host.includes('if(session.settled||session.restoring)return;')&&host.includes('restoreProductSurface()')&&host.includes("window.removeEventListener('keydown',onKey,true)"));
check('PREVIEW_FAIL_OPEN_DEFAULT',host.includes("if(!previewEnabled()){releaseLiveHouseDeferral('preview-disabled');return;}"));
check('NO_GENERIC_MEDIA_SUBSTITUTION',Array.isArray(custody.binaryMedia)&&custody.binaryMedia.length===0&&custody.rule==='REPOSITORY_NATIVE_SOURCE_OBJECTS_ONLY_NO_GENERIC_SUBSTITUTE_IMAGERY');

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');
let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_REPAIR_BASE_MATCH',base===REPAIR_BASE,base);let changed=null;
  if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}
  else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}
  if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
}

const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_COMPLETION_REPAIR_VERIFIER_v1',result,checkpoint:'BOUNDED_COMPLETION_REPAIR_STATIC_PREFLIGHT',repairBase:REPAIR_BASE,subjectHead,preservedSourceBase:SOURCE_BASE,specificationCommit:EXPECTED_SPEC,mutationTask:MUTATION_TASK,proofBoundary:'STATIC_SOURCE_AND_SCOPE_ONLY_NATURAL_38_SECOND_PLAYBACK_REMAINS_LIVE_OWNER_INSPECTION_EVIDENCE',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
