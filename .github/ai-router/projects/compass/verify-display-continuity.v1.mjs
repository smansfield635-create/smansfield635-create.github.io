#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from'node:child_process';

const OP='COMPASS_FLAGSHIP_ARCHITECTURAL_SUCCESSOR_20260817_001';
const LOCK=1533;
const BASE='d19405d327585850ac095f236820f7b3072edc1c';
const OUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-flagship-display.json';
const allowed=new Set([
'index.html','assets/compass/compass-core.css','assets/compass/compass.css','assets/compass/compass.identity-3d.css','assets/compass/compass.identity-3d.js','assets/compass/compass.controller.js','assets/compass/compass.cosmos.js','assets/compass/compass.crystals.js','assets/compass/compass.mirrorland-window.js','assets/compass/compass.capability-carousel.css','assets/compass/compass.capability-carousel.js','assets/compass/compass.statement-carousel.css','assets/compass/compass.statement-carousel.js','assets/compass/compass.brain-scene.js','assets/compass/compass.brain.css','assets/compass/compass.trophy-scene.js','assets/compass/upstream-compass.css','assets/compass/upstream-compass.geometry.js','assets/compass/upstream-compass.renderer.js','.github/ai-router/projects/compass/verify-display-continuity.v1.mjs','.github/ai-router/projects/compass/verify-performance-successor.mjs','.github/workflows/compass-display-continuity-validation.yml','.github/workflows/compass-performance-successor-validation.yml','.github/workflows/compass-carousel-successor-live-qualification.yml'
]);
const read=p=>fs.readFileSync(p,'utf8');
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const checks=[];const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
const html=read('index.html'),identity=read('assets/compass/compass.identity-3d.js'),brain=read('assets/compass/compass.brain-scene.js'),crystals=read('assets/compass/compass.crystals.js'),mirror=read('assets/compass/compass.mirrorland-window.js'),flagship=read('assets/compass/compass.identity-3d.css'),cap=read('assets/compass/compass.capability-carousel.css'),statements=read('assets/compass/compass.statement-carousel.js');
const diff=git(['diff','--name-only',`${BASE}...HEAD`]);
const changed=(diff.stdout||'').trim().split(/\r?\n/).filter(Boolean);
const roomIds=[...html.matchAll(/data-room-id="([^"]+)"/g)].map(m=>m[1]).filter(id=>/^(north|east|south|west)-\d+$/.test(id));
const uniqueRoomIds=[...new Set(roomIds)];
check('EXACT_ALLOWED_PATH_SCOPE',diff.status===0&&changed.every(p=>allowed.has(p)),changed.join(','));
check('CANONICAL_LAWS_SPACECRAFT',identity.includes("designId:'DGB_SCOUTCRAFT_01'")&&identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&identity.includes("adoption:'DIRECT_CANONICAL_GEOMETRY_MODULE_CONSUMPTION'"),'direct canonical Laws geometry preserved');
check('SPACECRAFT_NO_NAVIGATION_AUTHORITY',identity.includes("authority='ambient-presentation-and-bounded-hit-response-only'")||identity.includes("authority:'ambient-presentation-and-bounded-hit-response-only'")||identity.includes("dataset.authority='ambient-presentation-and-bounded-hit-response-only'"),'spacecraft remains presentation-only');
check('FLAGSHIP_BOUNDED_WORLD_INTERACTION',statements.includes('BOUNDED_PARALLAX_PROXIMITY_RESPONSE_NO_NAVIGATION_AUTHORITY')&&statements.includes('--craft-parallax-x')&&statements.includes('SPATIAL_OBJECT_REMAINS_INFORMATION_OBJECT'),'bounded spatial response and continuity contract');
check('FLAGSHIP_HERO_ARCHITECTURE',flagship.includes('Gen1533 flagship spatial presentation')&&flagship.includes('.compass-instrument__grid')&&flagship.includes('.compass-scene')&&flagship.includes('perspective:1500px'),'one coherent spatial hero');
check('DOWNPAGE_DIMENSIONAL_CONTINUITY',cap.includes('object continuity over card chrome')&&cap.includes('perspective:1500px')&&cap.includes('.compass-built'),'capability and proof depth retained');
check('FOUR_CARDINALS',['north','east','south','west'].every(x=>html.includes(`data-cardinal-id="${x}"`)),'four cardinal stars present');
check('NINETEEN_ROOMS',uniqueRoomIds.length===19,`unique room declarations=${uniqueRoomIds.length}: ${uniqueRoomIds.join(',')}`);
check('RETURN_TO_ORBIT',html.includes('data-compass-return-to-orbit'),'explicit return exists');
check('MIRRORLAND_STATE_MEANING',['MIRRORLAND_REVEALING','MIRRORLAND_FOCUSED','MIRRORLAND_WITHDRAWING'].every(x=>mirror.includes(x)),'Mirrorland lifecycle preserved');
check('MIRRORLAND_GEOMETRY',mirror.includes('buildPanes')&&mirror.includes('createPane'),'Mirrorland stained-glass geometry preserved');
check('CRYSTAL_TOPOLOGY',crystals.includes('registryCardinalCount')&&crystals.includes('registryRoomCount'),'cardinal and room semantic renderer preserved');
check('CORRECTED_BRAIN_ANATOMY',['midbrain','pons','medulla','cerebellum'].every(x=>brain.includes(x))&&!brain.includes('cerebellum-left')&&!brain.includes('cerebellum-right'),'integrated cerebellum and continuous brainstem');
check('ROSE_FLESH_MATERIAL',brain.includes('NATIVE_ROSE_FLESH_V1')||brain.includes('rose')||brain.includes('flesh'),'brain material identity retained');
check('REDUCED_MOTION',flagship.includes('@media(prefers-reduced-motion:reduce)')&&cap.includes('@media(prefers-reduced-motion:reduce)'),'reduced motion presentation rules');
check('NO_HORIZONTAL_OVERFLOW_CONTRACT',flagship.includes('overflow-x:hidden')||flagship.includes('overflow-x:clip'),'root overflow bounded by hidden or clip');
const pass=checks.every(c=>c.pass);const receipt={schema:'COMPASS_DISPLAY_CONTINUITY_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,base:BASE,candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),result:pass?'PASS_CLOSED':'FAIL_CLOSED',changedPaths:changed,checks};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
