#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const REPAIR_BASE='c8114c86ae7fb848e78b0c946c260ec0663631ec';
const EXPECTED_PATHS=[
  'index.html',
  'assets/compass/compass.orientation-cinematic.playpath.js',
  'assets/compass/compass.orientation-cinematic.render.playpath.js',
  'assets/compass/compass.homepage-cinematic.playpath.verify.mjs'
].sort();
const TASK='bounded non-interactive cinematic presentation playback repair correcting S05 Mirrorland failure, removing the Compass entry interstitial, restoring button tessellation into S01, preserving camera-facing star silhouettes, stretching the existing S07 Brain Trophy House cinematography, and exposing natural Play-path completion telemetry';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),checks=[],check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const index=read('index.html'),host=read('assets/compass/compass.orientation-cinematic.playpath.js'),renderer=read('assets/compass/compass.orientation-cinematic.render.playpath.js'),legacyFinal=read('assets/compass/compass.orientation-cinematic.final.js'),legacyRender=read('assets/compass/compass.orientation-cinematic.render.js');

check('BOUNDED_CLASSIFIER_TASK',/(CINEMATIC|PLAYBACK)/u.test(TASK.toUpperCase())&&/(NON-INTERACTIVE|PRESENTATION)/u.test(TASK.toUpperCase()),TASK);
check('BOUNDED_EXECUTABLE_SCOPE',EXPECTED_PATHS.filter(p=>/\.(?:js|mjs)$/i.test(p)).every(p=>p.toLowerCase().includes('cinematic')),JSON.stringify(EXPECTED_PATHS));
check('NEW_HOST_ACTIVATED',index.includes('/assets/compass/compass.orientation-cinematic.playpath.js?v=compass-cinematic-playpath-successor-v1')&&!index.includes('/assets/compass/compass.orientation-cinematic.js?v=gen1933-orientation-cinematic-v1&cb=5e04ede8e679a83d'));
check('CURRENT_VISUAL_BASES_READ_ONLY',legacyRender.includes("const RENDERER_SCHEMA='COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_v3'")&&legacyFinal.includes("const FINAL_SCHEMA='COMPASS_MAIN_HOMEPAGE_CINEMATIC_FINAL_RENDERER_v1'"));

check('MASTER_DURATION_45000',host.includes('const MASTER_DURATION_MS=45000'));
check('S01_S06_TIMING_PRESERVED',host.includes("id:'S01',beat:'Arrival',purpose:'Enter Diamond Gate Bridge',startMs:0,endMs:4500")&&host.includes("id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500"));
check('S07_RUNTIME_STRETCHED',host.includes("id:'S07',beat:'Breadth / Engagement',purpose:'Reveal ways to engage and estate breadth',startMs:30500,endMs:41000")&&host.includes('const legacyElapsedMs=30500+frame.shotProgress*3500'));
check('S08_RUNTIME_SHIFTED',host.includes("id:'S08',beat:'Return / Handoff',purpose:'Restore visitor agency',startMs:41000,endMs:45000")&&host.includes('NATURAL_HANDOFF_FADE_START_MS=44540')&&host.includes("shot.id==='S08'&&t>=43800"));

check('ENTRY_GATE_RETAINED',host.includes('data-cinematic-play>Play intro</button>')&&host.includes('data-main-orientation-skip>Skip intro</button>'));
check('ENTRY_NO_COMPASS_INTERSTITIAL',!host.includes('function drawEntryCompass')&&!host.includes('entryCompassTargets')&&!host.includes('ENTRY_COMPASS_START_MS'));
check('ENTRY_TESSELLATION_DIRECT_STARFIELD',host.includes("ENTRY_LAW='SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STARFIELD_THEN_DIAMOND_GATE_BRIDGE'")&&host.includes('const target=session.entryStars[Math.floor(random()*session.entryStars.length)]'));
check('ENTRY_2697_MOTION_PROFILE',host.includes('progress=clamp(elapsed/ENTRY_PREROLL_DURATION_MS)')&&host.includes('c.size*mix(1,.24,q)')&&host.includes('1-q*.76'));
check('ENTRY_ZERO_BLANK_TO_S01',host.includes('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')&&host.indexOf('session.renderer.renderFrame({elapsedMs:0,shot,shotProgress:0')<host.indexOf('if(entry)entry.hidden=true'));
check('PREWARM_BEHIND_GATE',host.includes('if(session.rendererPreparationPromise)return session.rendererPreparationPromise')&&host.includes('void prepareRenderer();'));

check('S05_WRAPPER_INTERCEPT',renderer.includes("if(id==='S05')")&&renderer.includes("shot:{...frame.shot,id:'S04'")&&renderer.includes('renderThreshold(stage,frame.shotProgress,frame.elapsedMs)'));
check('S05_PHASE_SLOT_6_FINITE',renderer.includes('phase=Number.isFinite(pane[6])?pane[6]:0')&&!renderer.includes('pane[7]'));
check('S05_MIRRORLAND_COPY_PRESERVED_BY_LEGACY_DOM',legacyRender.includes('Find the door to Mirrorland.')&&renderer.includes('const MIRROR_PANES=Object.freeze(['));
check('S02_WRAPPER_REDRAW',renderer.includes("if(id==='S02'){legacy.renderFrame(frame);redrawOrientation"));
check('S02_CAMERA_FACING_STARS',renderer.includes('rotatePoint(p,-.08,.10,rotation*.12)')&&!renderer.includes('rotatePoint(p,rotation*.53,rotation,rotation*.19)'));

check('S07_EXISTING_OBJECT_RENDERERS_PRESERVED',legacyFinal.includes("objectCard('brain','Coheriscope'")&&legacyFinal.includes("objectCard('trophy','Awards & Recognition'")&&legacyFinal.includes("objectCard('house','The House'"));
check('PLAYPATH_SUCCESS_TELEMETRY',host.includes('dataset.compassCinematicLastSuccessfulShot=shot.id')&&host.includes('dataset.compassCinematicSettlement=reason')&&host.includes("dataset.compassCinematicErrorCode=session.errorCode||''"));
check('AQUARIUM_GESTURE_PRESERVED',host.includes('startSoundtrack();')&&index.includes('data-compass-ambient-audio'));
check('PRESENTATION_LISTENER_CLEANUP',host.includes("window.removeEventListener('keydown',onKey,true)")&&host.includes("window.addEventListener('keydown',onKey,true)"));
check('LIVE_HOUSE_DEFERRAL_RELEASED_ON_SETTLEMENT',host.includes("releaseLiveHouseDeferral(reason==='complete'?'cinematic-complete':'cinematic-settled')"));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(host+'\n'+renderer));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(host+'\n'+renderer));
check('NO_PROTECTED_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(host+'\n'+renderer));

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_REPAIR_BASE_MATCH',base===REPAIR_BASE,base);let changed=null;if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_PLAYPATH_SUCCESSOR_VERIFIER_v1',result,checkpoint:'BOUNDED_PLAYPATH_SUCCESSOR_STATIC_PREFLIGHT',repairBase:REPAIR_BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC_SOURCE_SCOPE_AND_INVARIANTS_ONLY; EXACT-CANDIDATE BROWSER PLAY PATH IS REQUIRED BEFORE MERGE',checks},null,2)}\n`);process.exit(result==='PASS'?0:1);
