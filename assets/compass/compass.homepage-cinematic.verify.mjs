#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='501a1b2f9c9ab103dd3f96a535ba663818b87034';
const INTEGRATION='af650d8bb67f228891cf142d5d66e300eec971bf';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const PRIMARY_BLOB='0d432c6dd232979e7b63783fffa7a60918c9d94b';
const MEDIA_BLOB='41fc716be44fe56f99dd366f52f3f85d07559be7';
const HOST_BLOB='53cb1d574a4029f5dec847309bfa8bcbd43512ff';
const FINAL_BLOB='1af6d8dc0e1cfc8ae7f6e46b962db2629881fbff';
const CSS_BLOB='d1b93312e7a6ad0161400ffc1160717818b6af62';
const INDEX_BLOB='474a7d285c536d009f9552e02a99659abb4effdb';
const FOREST_BLOB='98d0995143400149cb19c48751a38a5402ca019b';
const CLOUD_BLOB='47482fd1c37267a2c5e76a3b833210984fe9b505';
const PREVIEW_PARAM='compassCinematicConstruction';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.media.js',
  'assets/compass/compass.orientation-cinematic.render.js',
  'index.html'
].sort();
const TASK='wire the source-true 45-second Storyboard v2 integration to the existing construction-preview route on exact current main, refresh only cinematic cache identities, reconcile current-main Mirrorland environment sources, preserve preview-only activation, and keep live hook and animation retuning off';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const run=(args)=>spawnSync('git',args,{cwd:root,encoding:'utf8'});
const objectId=(ref,p)=>{const r=run(['rev-parse',`${ref}:${p}`]);return r.status===0?r.stdout.trim():'';};
const checks=[];
const check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const host=read('assets/compass/compass.orientation-cinematic.js');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const index=read('index.html');
const forest=read('characters/forest-system.mjs');
const clouds=read('characters/cloud-system.mjs');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,render,media,final,css].join('\n');

check('CURRENT_MAIN_BASE',host.includes(`sourceMain:'${BASE}'`)&&media.includes(`sourceMain:'${BASE}'`),BASE);
check('INTEGRATION_LINEAGE',host.includes(`repairBase:'${INTEGRATION}'`)&&media.includes(`integrationBase:'${INTEGRATION}'`),INTEGRATION);
check('SPECIFICATION_PRESERVED',host.includes(SPEC)&&media.includes(SPEC),SPEC);
check('MASTER_DURATION_45000',host.includes('const MASTER_DURATION_MS=45000')&&media.includes('masterDurationMs:45000'));
const timings=[["S01",0,4500],["S02",4500,9500],["S03",9500,14500],["S04",14500,19500],["S05",19500,25500],["S06",25500,30500],["S07",30500,41000],["S08",41000,45000]];
for(const [id,start,end] of timings)check(`${id}_TIMING_FROZEN`,host.includes(`id:'${id}'`)&&host.includes(`startMs:${start},endMs:${end}`)&&media.includes(`id:'${id}'`)&&media.includes(`startMs:${start},endMs:${end}`));

check('PRIMARY_IDENTITY',objectId('HEAD','assets/compass/compass.orientation-cinematic.render.js')===PRIMARY_BLOB,objectId('HEAD','assets/compass/compass.orientation-cinematic.render.js'));
check('MEDIA_IDENTITY',objectId('HEAD','assets/compass/compass.orientation-cinematic.media.js')===MEDIA_BLOB,objectId('HEAD','assets/compass/compass.orientation-cinematic.media.js'));
check('HOST_IDENTITY',objectId('HEAD','assets/compass/compass.orientation-cinematic.js')===HOST_BLOB,objectId('HEAD','assets/compass/compass.orientation-cinematic.js'));
check('FINAL_IDENTITY',objectId('HEAD','assets/compass/compass.orientation-cinematic.final.js')===FINAL_BLOB,objectId('HEAD','assets/compass/compass.orientation-cinematic.final.js'));
check('CONTEXT_CSS_IDENTITY',objectId('HEAD','assets/compass/compass.orientation-cinematic.css')===CSS_BLOB,objectId('HEAD','assets/compass/compass.orientation-cinematic.css'));
check('INDEX_IDENTITY',objectId('HEAD','index.html')===INDEX_BLOB,objectId('HEAD','index.html'));

check('CURRENT_MAIN_FOREST_IDENTITY',objectId(BASE,'characters/forest-system.mjs')===FOREST_BLOB,objectId(BASE,'characters/forest-system.mjs'));
check('CURRENT_MAIN_CLOUD_IDENTITY',objectId(BASE,'characters/cloud-system.mjs')===CLOUD_BLOB,objectId(BASE,'characters/cloud-system.mjs'));
check('CURRENT_MAIN_FOREST_API_COMPATIBLE',forest.includes('export function createForestSystem')&&forest.includes('draw(vp,time)'));
check('CURRENT_MAIN_CLOUD_API_COMPATIBLE',clouds.includes('export function createCloudSystem')&&clouds.includes('function draw({vp,time=0,state}={})'));
check('RENDERER_REBOUND_TO_CURRENT_MAIN_ENVIRONMENT',render.includes(FOREST_BLOB)&&render.includes(CLOUD_BLOB)&&render.includes('sources.forest.createForestSystem(gl,{compact})')&&render.includes('sources.clouds.createCloudSystem({gl,compact,reducedMotion:false})'));
check('S05_SHARED_GEOMETRY_AND_NIGHT_RETAINED',render.includes('DIAMOND_GATE_BRIDGE_SHARED_MIRRORLAND_WINDOW_GEOMETRY_TNT_v1')&&render.includes('api.getPanes()')&&render.includes('api.getFrameSegments()')&&render.includes('sources.night.NIGHT_FRAGMENT_SHADER'));
check('S06_CANONICAL_RENDERER_RETAINED',render.includes("const AUDRALIA_RENDERER_URL='/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs'")&&render.includes('createMapWideEnvironmentRenderer(canvas)')&&!render.includes('function drawAudraliaSourceReconstruction')&&!render.includes('function projectAudraliaSource'));
check('NO_S05_S06_DESTINATION_EMBEDDING',!render.includes("world.src='/characters/'")&&!render.includes('characters/app.mjs')&&!render.includes("make('iframe'")&&!render.includes('/showroom/globe/audralia/index.html'));

check('FINAL_PHASE3_AND_S07_COPY',final.includes('MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1')&&final.includes("objectCard('brain','Discover your Coherence Index.','Take a free coherence assessment.')")&&final.includes("objectCard('trophy','Enter the Awards Chamber.','See the work recognized — and why.')")&&final.includes("objectCard('house','Meet the characters.','Choose who you want to speak with.')"));
check('CONTEXT_SPINE_RETAINED',css.includes('Storyboard v2 persistent tour-context spine')&&css.includes('data-compass-cinematic-last-successful-shot')&&css.includes('Cross into Mirrorland.')&&css.includes('Enter Audralia.')&&css.includes('Now choose your path.'));

check('PREVIEW_ONLY_ACTIVATION',host.includes(`const PREVIEW_PARAM='${PREVIEW_PARAM}'`)&&host.includes("get(PREVIEW_PARAM)==='1'")&&host.includes("if(!previewEnabled()){releaseLiveHouseDeferral('preview-disabled');return;}")&&!host.includes('liveHookEnabled'));
check('NO_LATE_SOURCE_MASTER_GATE',!host.includes('waitForLateFilmSources')&&!host.includes('brain-trophy-house-ready-before-master')&&host.includes("masterStartDependency='PRIMARY_AND_FINAL_HOSTS_MOUNTED_ONLY'")&&host.includes('async mount(){primary.mount();final.mount();return true;}'));
const initialFrame=host.indexOf("session.renderer.renderFrame({elapsedMs:0");
const latePrep=host.indexOf('void session.renderer.prepareLateSources?.()');
check('LATE_S07_PREP_AFTER_S01',initialFrame>=0&&latePrep>initialFrame,`${initialFrame}:${latePrep}`);
check('LATE_S07_FAILURE_LOCAL',host.includes("lateShotSources='FAILED_LOCAL_TO_S07'")&&host.includes('CINEMATIC_S07_LATE_SOURCE_PREPARATION_FAILED'));
check('ONE_AUDIO_OWNER',media.includes('oneAudioOwner:true')&&!/(new Audio\s*\(|createElement\(['"]audio['"]\))/u.test(combined));

check('HOST_CACHE_TOKEN',host.includes(`compass.orientation-cinematic.render.js?cb=${PRIMARY_BLOB.slice(0,16)}`)&&host.includes(`compass.orientation-cinematic.media.js?cb=${MEDIA_BLOB.slice(0,16)}`)&&host.includes(`compass.orientation-cinematic.final.js?cb=${FINAL_BLOB.slice(0,16)}`));
check('INDEX_CSS_CACHE_TOKEN',index.includes(`/assets/compass/compass.orientation-cinematic.css?v=storyboard-v2-preview-current-main&cb=${CSS_BLOB.slice(0,16)}`));
check('INDEX_HOST_CACHE_TOKEN',index.includes(`/assets/compass/compass.orientation-cinematic.js?v=storyboard-v2-preview-current-main&cb=${HOST_BLOB.slice(0,16)}`));
const baseIndexResult=run(['show',`${BASE}:index.html`]);
if(baseIndexResult.status===0){
  const normalize=s=>s
    .replace(/\/assets\/compass\/compass\.orientation-cinematic\.css\?v=[^"\n]+/u,'/__CINEMATIC_CSS_IDENTITY__')
    .replace(/\/assets\/compass\/compass\.orientation-cinematic\.js\?v=[^"\n]+/u,'/__CINEMATIC_HOST_IDENTITY__');
  check('INDEX_ONLY_CACHE_IDENTITIES_CHANGED',normalize(index)===normalize(baseIndexResult.stdout));
}else check('BASE_INDEX_AVAILABLE',false,baseIndexResult.stderr||'git show failed');

check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_COMPASS_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test([host,render,final].join('\n')));
check('CUSTODY_PREVIEW_POLICY',custody.sourceMain===BASE&&custody.introActivationState==='INTRO_PRESENT_BUT_UNHOOKED'&&custody.preview?.parameter===`${PREVIEW_PARAM}=1`&&custody.preview?.ordinaryVisitMountsCinematic===false&&custody.preview?.liveHookAllowed===false);

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_BASE_MATCH',base===BASE,base);
  let changed=null;
  if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}
  else{const diff=run(['diff','--name-only',`${base}...${head}`]);if(diff.status===0)changed=diff.stdout.split(/\r?\n/u).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}
  if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_PREVIEW_IDENTITY_VERIFIER_v1',result,checkpoint:'CONSTRUCTION_PREVIEW_IDENTITY_WIRING',base:BASE,integrationBase:INTEGRATION,subjectHead,mutationTask:TASK,proofBoundary:'STATIC SOURCE, OBJECT-IDENTITY, SCOPE, STARTUP-ARCHITECTURE, AND PREVIEW-ACTIVATION AUDIT; NO USER VISUAL REVIEW; NO LIVE HOOK; NO ANIMATION RETIMING',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
