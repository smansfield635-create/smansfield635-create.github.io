#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const REPAIR_BASE='c8114c86ae7fb848e78b0c946c260ec0663631ec';
const SOURCE_BASE='46c56e0519fc875eac877b4bc921e3151b019a2f';
const EXPECTED_SPEC='88473442959299d6f6af82396917f0578074cab2';
const EXPECTED_HOST_ID='19b5f7b8b4ce0f64';
const EXPECTED_RENDER_ID='aad42a46881bb01c';
const EXPECTED_PATHS=[
  'index.html',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.render.js',
  'assets/compass/compass.homepage-cinematic.verify.mjs'
].sort();
const TASK='bounded non-interactive cinematic presentation playback repair correcting the S05 Mirrorland failure, removing the Compass entry interstitial, restoring Play-control tessellation directly into S01, preserving camera-facing star silhouettes, stretching the existing S07 Brain Trophy House cinematography, and proving natural Play-path completion';
const AQUARIUM_URL='https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg';
const ENTRY_LAW='SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STARFIELD_THEN_DIAMOND_GATE_BRIDGE';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),checks=[],check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const index=read('index.html'),host=read('assets/compass/compass.orientation-cinematic.js'),render=read('assets/compass/compass.orientation-cinematic.render.js'),media=read('assets/compass/compass.orientation-cinematic.media.js'),final=read('assets/compass/compass.orientation-cinematic.final.js'),custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json')),combined=[host,render,media,final].join('\n');

check('BOUNDED_CLASSIFIER_TASK',/(CINEMATIC|PLAYBACK)/u.test(TASK.toUpperCase())&&/(NON-INTERACTIVE|PRESENTATION)/u.test(TASK.toUpperCase()),TASK);
check('BOUNDED_EXECUTABLE_SCOPE',EXPECTED_PATHS.filter(p=>/\.(?:js|mjs)$/i.test(p)).every(p=>p.toLowerCase().includes('cinematic')),JSON.stringify(EXPECTED_PATHS));
check('SOURCE_BASE_PRESERVED',host.includes(`sourceMain:'${SOURCE_BASE}'`)&&custody.sourceMain===SOURCE_BASE,SOURCE_BASE);
check('REPAIR_BASE_BOUND',host.includes(`repairBase:'${REPAIR_BASE}'`),REPAIR_BASE);
check('SPECIFICATION_PRESERVED',host.includes(EXPECTED_SPEC)&&custody.specificationCommit===EXPECTED_SPEC,EXPECTED_SPEC);
check('SAME_PRODUCTION_HOST_PATH',index.includes(`/assets/compass/compass.orientation-cinematic.js?v=gen1933-orientation-cinematic-v1&cb=${EXPECTED_HOST_ID}`)&&!index.includes('compass.orientation-cinematic.playpath.js'));
check('FRESH_RENDERER_REQUEST_IDENTITY',host.includes(`/assets/compass/compass.orientation-cinematic.render.js?cb=${EXPECTED_RENDER_ID}`)&&!host.includes("import('/assets/compass/compass.orientation-cinematic.render.js')"));
check('MASTER_DURATION_45000',host.includes('const MASTER_DURATION_MS=45000'));
check('S01_S06_TIMING_PRESERVED',host.includes("id:'S01',beat:'Arrival',purpose:'Enter Diamond Gate Bridge',startMs:0,endMs:4500")&&host.includes("id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500"));
check('S07_RUNTIME_STRETCHED',host.includes("id:'S07',beat:'Breadth / Engagement',purpose:'Reveal ways to engage and estate breadth',startMs:30500,endMs:41000")&&host.includes('const legacyElapsedMs=30500+frame.shotProgress*3500'));
check('S08_RUNTIME_SHIFTED',host.includes("id:'S08',beat:'Return / Handoff',purpose:'Restore visitor agency',startMs:41000,endMs:45000")&&host.includes('NATURAL_HANDOFF_FADE_START_MS=44540')&&host.includes("shot.id==='S08'&&elapsedMs>=43800"));

check('ENTRY_GATE_RETAINED',host.includes('data-cinematic-play>Play intro</button>')&&host.includes('data-main-orientation-skip>Skip intro</button>'));
check('ENTRY_NO_COMPASS_INTERSTITIAL',!host.includes('function drawEntryCompass')&&!host.includes('entryCompassTargets')&&!host.includes('ENTRY_COMPASS_START_MS'));
check('ENTRY_TESSELLATION_DIRECT_STARFIELD',host.includes(ENTRY_LAW)&&host.includes('const target=stars[Math.floor(random()*stars.length)]'));
check('ENTRY_ZERO_BLANK_TO_S01',host.includes('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')&&host.indexOf('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')<host.indexOf('if(entry)entry.hidden=true'));
check('AQUARIUM_GESTURE_PRESERVED',host.includes('startSoundtrack();')&&index.includes(AQUARIUM_URL)&&index.includes('data-compass-ambient-audio'));

check('S05_PHASE_SLOT_6_FINITE',render.includes('phase=Number.isFinite(pane[6])?pane[6]:0')&&!render.includes('pane[7]'));
check('S05_MIRRORLAND_SOURCE_PRESERVED',render.includes('Find the door to Mirrorland.')&&render.includes('const MIRROR_PANES=Object.freeze(['));
check('S02_CAMERA_FACING_STARS',render.includes('rotatePoint(p,-.08,.10,rotation*.12)')&&!render.includes('rotatePoint(p,rotation*.53,rotation,rotation*.19)'));
check('S07_EXISTING_SOURCE_RENDERERS_PRESERVED',final.includes("objectCard('brain','Coheriscope'")&&final.includes("objectCard('trophy','Awards & Recognition'")&&final.includes("objectCard('house','The House'"));
check('PLAYPATH_SUCCESS_TELEMETRY',host.includes('dataset.compassCinematicLastSuccessfulShot=shot.id')&&host.includes('dataset.compassCinematicSettlement=reason')&&host.includes("dataset.compassCinematicErrorCode=session.errorCode||''"));
check('LIVE_HOUSE_DEFERRAL_RELEASED_ON_SETTLEMENT',host.includes("releaseLiveHouseDeferral(reason==='complete'?'cinematic-complete':'cinematic-settled')"));
check('PRESENTATION_LISTENER_CLEANUP',host.includes("window.removeEventListener('keydown',onKey,true)")&&host.includes("window.addEventListener('keydown',onKey,true)"));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(combined));

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_REPAIR_BASE_MATCH',base===REPAIR_BASE,base);let changed=null;if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_INPLACE_PLAYPATH_REPAIR_VERIFIER_v1',result,checkpoint:'BOUNDED_INPLACE_PLAYPATH_STATIC_PREFLIGHT',repairBase:REPAIR_BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC_SOURCE_SCOPE_AND_INVARIANTS_ONLY; EXACT-CANDIDATE BROWSER PLAY PATH S01_TO_S08 IS REQUIRED BEFORE MERGE',checks},null,2)}\n`);process.exit(result==='PASS'?0:1);
