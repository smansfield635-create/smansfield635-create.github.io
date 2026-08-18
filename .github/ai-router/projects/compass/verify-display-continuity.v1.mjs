#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_EMERGENCY_FLAGSHIP_CORRECTION_20260818_003';
const LOCK=1534;
const BASE='1bda4203b4410be4471695dce33afca97d305623';
const OUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-gen1534-display.json';
const allowed=new Set([
  'index.html',
  'assets/compass/compass-core.css','assets/compass/compass.css','assets/compass/compass.identity-3d.css','assets/compass/compass.identity-3d.js','assets/compass/compass.controller.js','assets/compass/compass.cosmos.js','assets/compass/compass.crystals.js','assets/compass/compass.mirrorland-window.js','assets/compass/compass.capability-carousel.css','assets/compass/compass.capability-carousel.js','assets/compass/compass.statement-carousel.css','assets/compass/compass.statement-carousel.js','assets/compass/compass.brain-scene.js','assets/compass/compass.brain.css','assets/compass/compass.trophy-scene.js','assets/compass/upstream-compass.css','assets/compass/upstream-compass.geometry.js','assets/compass/upstream-compass.renderer.js',
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs','.github/ai-router/projects/compass/verify-performance-successor.mjs',
  '.github/workflows/compass-display-continuity-validation.yml','.github/workflows/compass-performance-successor-validation.yml','.github/workflows/compass-carousel-successor-live-qualification.yml'
]);
const read=p=>fs.readFileSync(p,'utf8');
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const checks=[];
const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});

const html=read('index.html');
const identity=read('assets/compass/compass.identity-3d.js');
const brain=read('assets/compass/compass.brain-scene.js');
const crystals=read('assets/compass/compass.crystals.js');
const mirror=read('assets/compass/compass.mirrorland-window.js');
const flagship=read('assets/compass/compass.identity-3d.css');
const cap=read('assets/compass/compass.capability-carousel.css');
const statements=read('assets/compass/compass.statement-carousel.js');
const diff=git(['diff','--name-only',BASE,'HEAD']);
const changed=(diff.stdout||'').trim().split(/\r?\n/).filter(Boolean);
const roomIds=[...html.matchAll(/data-room-id="([^"]+)"/g)].map(m=>m[1]).filter(id=>/^(north|east|south|west)-\d+$/.test(id));
const uniqueRoomIds=[...new Set(roomIds)];

check('EXACT_ALLOWED_PATH_SCOPE',diff.status===0&&changed.every(p=>allowed.has(p)),changed.join(','));
check('GEN1534_FLAGSHIP_RUNTIME',identity.includes("const GLOBAL='DGB_COMPASS_IDENTITY_3D_GEN1534'")&&statements.includes("root.dataset.flagshipContract='COMPASS_GEN1534_EMERGENCY_FLAGSHIP_v1'"),'Gen1534 runtime and presentation contract are explicit');
check('CANONICAL_LAWS_SPACECRAFT',identity.includes("designId:'DGB_SCOUTCRAFT_01'")&&identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&identity.includes("adoption:'DIRECT_CANONICAL_GEOMETRY_MODULE_CONSUMPTION'"),'direct canonical Laws spacecraft geometry preserved');
check('SPACECRAFT_NO_NAVIGATION_AUTHORITY',identity.includes("authority='ambient-presentation-and-bounded-hit-response-only'")&&identity.includes("interactionAuthority='scene-bound-3d-bounded-response-only-no-navigation'"),'spacecraft remains presentation-only and scene bounded');
check('FLAGSHIP_WORLD_INTERACTION',statements.includes('SCENE_BOUND_TRUE_3D_BOUNDED_INTERACTION_NO_NAVIGATION_AUTHORITY')&&statements.includes('--flagship-x')&&statements.includes('SPATIAL_OBJECT_REMAINS_INFORMATION_OBJECT'),'bounded spatial response and object continuity preserved');
check('READ_LOOK_ACT_COMPOSITION',flagship.includes('Compass Gen1534 emergency flagship spatial presentation')&&flagship.includes('grid-template-columns:minmax(0,1.35fr) minmax(280px,.55fr)')&&flagship.includes('.compass-panel{position:relative!important'),'scene and information panel are adjacent rather than overlaid');
check('SCENE_NOT_NEGATIVELY_OVERLAPPED',flagship.includes('.compass-instrument{position:relative')&&flagship.includes('margin:clamp(26px,5vh,64px) auto 0!important')&&flagship.includes('.compass-scene{position:relative!important'),'instrument follows identity hero in normal flow');
check('GUIDANCE_ACCESSIBLE_NOT_VISUAL_CHROME',flagship.includes('.compass-guidance{position:absolute!important;width:1px!important;height:1px!important'),'instruction remains available to assistive technology without occupying the visual stage');
check('SCENE_POSTPROCESS_REMOVED',flagship.includes('.compass-scene{')&&flagship.includes('filter:none!important')&&flagship.includes('contain:layout paint'),'interactive scene avoids large post-process filter and is paint-contained');
check('FOUR_CARDINALS',['north','east','south','west'].every(x=>html.includes(`data-cardinal-id="${x}"`)),'four cardinal stars present');
check('NINETEEN_ROOMS',uniqueRoomIds.length===19,`unique room declarations=${uniqueRoomIds.length}: ${uniqueRoomIds.join(',')}`);
check('RETURN_TO_ORBIT',html.includes('data-compass-return-to-orbit'),'explicit return-to-orbit control remains');
check('MIRRORLAND_STATE_MEANING',['MIRRORLAND_REVEALING','MIRRORLAND_FOCUSED','MIRRORLAND_WITHDRAWING'].every(x=>mirror.includes(x)),'Mirrorland lifecycle meaning preserved');
check('MIRRORLAND_GEOMETRY',mirror.includes('buildPanes')&&mirror.includes('createPane'),'Mirrorland stained-glass geometry preserved');
check('CRYSTAL_TOPOLOGY',crystals.includes('registryCardinalCount')&&crystals.includes('registryRoomCount'),'cardinal/room semantic renderer preserved');
check('CORRECTED_BRAIN_ANATOMY',['midbrain','pons','medulla','cerebellum'].every(x=>brain.includes(x))&&!brain.includes('cerebellum-left')&&!brain.includes('cerebellum-right'),'single integrated cerebellum and continuous brainstem preserved');
check('ROSE_FLESH_MATERIAL',brain.includes('NATIVE_ROSE_FLESH_V1'),'rose/flesh brain material preserved');
check('DOWNPAGE_DIMENSIONAL_CONTINUITY',cap.includes('object continuity over card chrome')&&cap.includes('perspective:1500px')&&cap.includes('.compass-built'),'capability/proof dimensional continuity retained');
check('REDUCED_MOTION',flagship.includes('@media(prefers-reduced-motion:reduce)')&&cap.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion presentation rules remain');
check('NO_HORIZONTAL_OVERFLOW_CONTRACT',flagship.includes('overflow-x:clip'),'horizontal overflow remains bounded');

const pass=checks.every(c=>c.pass);
const receipt={
  schema:'COMPASS_GEN1534_DISPLAY_CONTINUITY_VERIFICATION_RECEIPT_v1',
  operation:OP,
  lockGeneration:LOCK,
  base:BASE,
  candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),
  result:pass?'PASS_CLOSED':'FAIL_CLOSED',
  changedPaths:changed,
  checks
};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
process.exit(pass?0:1);
