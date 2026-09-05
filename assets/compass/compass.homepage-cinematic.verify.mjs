#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const CLEAN_BASE='8d7c6a34ced8b01b6627f704c5c38492e3e67f34';
const INTEGRATION_BASE='c4bd4fc49f0215085d0efa055464ede797c53fcf';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const PRIMARY_BLOB='d664e91251f63918ecc5ec7a4634fe42047e501e';
const FINAL_BLOB='1af6d8dc0e1cfc8ae7f6e46b962db2629881fbff';
const CSS_BLOB='d1b93312e7a6ad0161400ffc1160717818b6af62';
const MEDIA_BLOB='51e622a0ad12b5c277368b270846e28c07fa6089';
const HOST_BLOB='308a5d7fa1ba829a1bcde145957e06bc7a6fa467';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.css',
  'assets/compass/compass.orientation-cinematic.final.js',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.media.js'
].sort();
const TASK='integrate source-true S05 and S06 into the frozen 45-second Storyboard v2 film, carry Phase3 S07 and persistent context spine, remove all late-shot readiness gates before S01, preserve one audio owner, keep preview-only activation, and perform source/code audit before any live hook';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),checks=[],check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const host=read('assets/compass/compass.orientation-cinematic.js');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,render,final,media,css].join('\n');

check('CLEAN_BASE_BOUND',host.includes(`sourceMain:'${CLEAN_BASE}'`)&&media.includes(`sourceMain:'${CLEAN_BASE}'`)&&custody.sourceMain===CLEAN_BASE,CLEAN_BASE);
check('INTEGRATION_BASE_BOUND',host.includes(`repairBase:'${INTEGRATION_BASE}'`)&&media.includes(`integrationBase:'${INTEGRATION_BASE}'`)&&custody.integrationBase===INTEGRATION_BASE,INTEGRATION_BASE);
check('SPECIFICATION_PRESERVED',host.includes(SPEC)&&media.includes(SPEC)&&custody.specificationCommit===SPEC,SPEC);
check('MASTER_DURATION_45000',host.includes('const MASTER_DURATION_MS=45000')&&media.includes('masterDurationMs:45000')&&custody.masterDurationMs===45000);
const timings=[["S01",0,4500],["S02",4500,9500],["S03",9500,14500],["S04",14500,19500],["S05",19500,25500],["S06",25500,30500],["S07",30500,41000],["S08",41000,45000]];
for(const [id,start,end] of timings)check(`${id}_TIMING_FROZEN`,host.includes(`id:'${id}'`)&&host.includes(`startMs:${start},endMs:${end}`)&&media.includes(`id:'${id}'`)&&media.includes(`startMs:${start},endMs:${end}`));

check('PRIMARY_RENDERER_IDENTITY',render.includes('COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_v6_S05_MATURE_S06_CANONICAL_WORLD')&&host.includes(`cb=${PRIMARY_BLOB.slice(0,16)}`)&&custody.integratedSurfaces?.primaryRenderer?.blob===PRIMARY_BLOB);
check('S05_SOURCE_FIDELITY_RETAINED',render.includes('COMPASS_S05_MIRRORLAND_SHARED_GEOMETRY_MATURE_DETACHED_WEBGL_v2')&&render.includes('sources.night.NIGHT_FRAGMENT_SHADER')&&render.includes('sources.forest.createForestSystem(gl,{compact})')&&render.includes('sources.clouds.createCloudSystem({gl,compact,reducedMotion:false})'));
check('S06_CANONICAL_RENDERER_RETAINED',render.includes("const AUDRALIA_RENDERER_URL='/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs'")&&render.includes('createMapWideEnvironmentRenderer(canvas)')&&!render.includes('function drawAudraliaSourceReconstruction')&&!render.includes('function projectAudraliaSource'));
check('NO_S05_S06_DESTINATION_EMBEDDING',!render.includes("world.src='/characters/'")&&!render.includes('characters/app.mjs')&&!render.includes("make('iframe'")&&!render.includes('/showroom/globe/audralia/index.html'));

check('FINAL_RENDERER_V2_SOURCE_TRUTH',final.includes('COMPASS_MAIN_HOMEPAGE_CINEMATIC_FINAL_RENDERER_v2_STORYBOARD_SOURCE_TRUTH')&&custody.integratedSurfaces?.finalRenderer?.blob===FINAL_BLOB);
check('S07_PHASE3_HOUSE',final.includes("MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1")&&final.includes("houseGothicPhase3:Object.freeze")&&final.includes("canonical-house-phase3-cinematic-reconstruction-v2"));
check('S07_EXACT_SEMANTICS',final.includes("objectCard('brain','Discover your Coherence Index.','Take a free coherence assessment.')")&&final.includes("objectCard('trophy','Enter the Awards Chamber.','See the work recognized — and why.')")&&final.includes("objectCard('house','Meet the characters.','Choose who you want to speak with.')"));
check('S08_HANDOFF_PRESERVED',final.includes("function buildS08()")&&final.includes("'Find Your Way'")&&final.includes('verifyHandoff'));

check('CONTEXT_SPINE_IDENTITY',custody.integratedSurfaces?.contextSpine?.blob===CSS_BLOB&&css.includes('Storyboard v2 persistent tour-context spine'));
for(const phrase of ['Diamond Gate Bridge','Find your way.','Start here.',"See what we're testing.","See what's ready.",'Cross into Mirrorland.','Enter Audralia.','Discover your Coherence Index.','Enter the Awards Chamber.','Meet the characters.','Now choose your path.'])check(`CONTEXT_${phrase.replace(/[^A-Z0-9]+/gi,'_').toUpperCase()}`,css.includes(phrase),phrase);
check('CONTEXT_NO_SECOND_STATE_MACHINE',css.includes('data-compass-cinematic-last-successful-shot')&&host.includes('dataset.compassCinematicLastSuccessfulShot=shot.id')&&custody.persistentContext?.secondaryStateMachineCreated===false);

check('MEDIA_MANIFEST_INTEGRATED',custody.integratedSurfaces?.mediaManifest?.blob===MEDIA_BLOB&&media.includes("version:'storyboard-v2-clean-recovery-integrated-20260905-001'")&&media.includes('runtimeEmbeddingAllowed:false')&&media.includes('lateShotSourcesMayBlockMasterStart:false'));
check('HOST_IDENTITY_INTEGRATED',custody.integratedSurfaces?.host?.blob===HOST_BLOB&&host.includes("version:'homepage-cinematic-storyboard-v2-clean-integration-20260905-001'"));
check('NO_WAIT_FOR_LATE_FILM_SOURCES',!host.includes('waitForLateFilmSources')&&!host.includes('brain-trophy-house-ready-before-master'));
check('MASTER_START_MOUNT_ONLY',host.includes("masterStartDependency='PRIMARY_AND_FINAL_HOSTS_MOUNTED_ONLY'")&&host.includes('async mount(){primary.mount();final.mount();return true;}')&&!host.includes('await final.prepare()'));
const initialFrameIndex=host.indexOf("session.renderer.renderFrame({elapsedMs:0");
const latePrepIndex=host.indexOf('void session.renderer.prepareLateSources?.()');
check('LATE_S07_PREP_AFTER_INITIAL_S01_FRAME',initialFrameIndex>=0&&latePrepIndex>initialFrameIndex,`${initialFrameIndex}:${latePrepIndex}`);
check('LATE_S07_FAILURE_LOCALIZED',host.includes("lateShotSources='FAILED_LOCAL_TO_S07'")&&host.includes('CINEMATIC_S07_LATE_SOURCE_PREPARATION_FAILED')&&final.includes("if(frame?.shot?.id==='S07')"));
check('S07_NO_AUDRALIA_BACKGROUND_DRAW',host.includes("id:'S08',beat:'Return / Handoff'")&&!host.includes("shot:{...frame.shot,id:'S06',beat:'Elsewhere'}"));
check('S07_STRETCH_LAW_PRESERVED',host.includes('const legacyElapsedMs=30500+frame.shotProgress*3500')&&host.includes('final.renderFrame({...frame,elapsedMs:legacyElapsedMs})'));

check('PREVIEW_ONLY_ACTIVATION',host.includes("const previewEnabled=()=>new URLSearchParams(location.search).get(PREVIEW_PARAM)==='1'")&&host.includes("if(!previewEnabled()){releaseLiveHouseDeferral('preview-disabled');return;}")&&!host.includes('liveHookEnabled'));
check('ONE_AUDIO_OWNER',custody.audioOwnerCount===1&&(combined.match(/\.play\(\)/g)||[]).length===1&&!/(new Audio\s*\(|createElement\(['"]audio['"]\))/u.test(combined));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_COMPASS_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test([host,render,final].join('\n')));
check('LIVE_HOOK_OFF',custody.introActivationState==='INTRO_PRESENT_BUT_UNHOOKED'&&custody.hardBoundary5?.liveHookAllowed===false);

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_INTEGRATION_BASE_MATCH',base===INTEGRATION_BASE,base);let changed=null;if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_FULL_FILM_INTEGRATION_VERIFIER_v1',result,checkpoint:'FULL_FILM_STORYBOARD_V2_SOURCE_AND_CODE_AUDIT',cleanBase:CLEAN_BASE,integrationBase:INTEGRATION_BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC SOURCE, SCOPE, STARTUP-ARCHITECTURE, SEMANTIC, AND VISUAL-FIDELITY CODE AUDIT; USER VISUAL REVIEW NOT REQUIRED; LIVE HOOK REMAINS OFF',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
