#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_LIVE_RECOVERY_GEN1537_20260818_001';
const LOCK=1537;
const BASE='1de7eb13bf5cc7d87d24896ac41bd0c841e42753';
const OUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-coherence-display.json';
const allowed=new Set(['index.html','assets/compass/compass.gen1537.recovery.js','assets/compass/compass.gen1537.recovery.css','.github/ai-router/projects/compass/verify-display-continuity.v1.mjs','.github/ai-router/projects/compass/verify-performance-successor.mjs','.github/workflows/compass-carousel-successor-live-qualification.yml','.github/workflows/compass-display-continuity-validation.yml','.github/workflows/compass-performance-successor-validation.yml']);
const read=p=>fs.readFileSync(p,'utf8');
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const checks=[];const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
const html=read('index.html'),recovery=read('assets/compass/compass.gen1537.recovery.js'),recoveryCss=read('assets/compass/compass.gen1537.recovery.css'),brain=read('assets/compass/compass.brain-scene.js'),mirror=read('assets/compass/compass.mirrorland-window.js'),capJs=read('assets/compass/compass.capability-carousel.js'),capCss=read('assets/compass/compass.capability-carousel.css');
const diff=git(['diff','--name-only',BASE,'HEAD']);const changed=(diff.stdout||'').trim().split(/\r?\n/).filter(Boolean);
const roomIds=[...html.matchAll(/data-room-id="([^"]+)"/g)].map(m=>m[1]).filter(id=>/^(north|east|south|west)-\d+$/.test(id));
check('EXACT_ALLOWED_PATH_SCOPE',diff.status===0&&changed.every(p=>allowed.has(p)),changed.join(','));
check('GEN1537_RUNTIME_WIRED',html.includes('compass.gen1537.recovery.js?v=gen1537-live-recovery-v1')&&html.includes('compass.gen1537.recovery.css?v=gen1537-live-recovery-v1')&&recovery.includes("DGB_COMPASS_GEN1537_LIVE_RECOVERY"),'Gen1537 corrective assets are loaded by homepage');
check('SPACECRAFT_FOREGROUND_REMOVED',recovery.includes('craft?.destroy?.()')&&recovery.includes("document.querySelectorAll('[data-compass-spacecraft-layer],.compass-spacecraft-layer')")&&recoveryCss.includes('.compass-spacecraft-layer{display:none!important'),'Gen1536 spacecraft foreground is explicitly destroyed and suppressed');
check('FIXED_CENTER_3D_COMPASS',recovery.includes("/assets/compass/upstream-compass.geometry.js")&&recovery.includes("/assets/compass/upstream-compass.renderer.js")&&recovery.includes("data.upstreamCompassMount")===false&&recovery.includes("mount.dataset.gen1537Renderer='upstream-authoritative-webgl'")&&recoveryCss.includes('.compass-gen1537-instrument__mount'),'fixed-center upstream 3D Compass is the restored primary spatial instrument');
check('MIRRORLAND_HIT_AUTHORITY',recovery.includes("[data-compass-object=\"mirrorland\"]")&&recovery.includes("protected-direct-controller-surface")&&recoveryCss.includes('.compass-object--mirrorland')&&recoveryCss.includes('z-index:30!important')&&recoveryCss.includes('pointer-events:auto!important'),'Mirrorland door has direct hit authority above visual layers');
check('MIRRORLAND_STATE_MEANING',['MIRRORLAND_REVEALING','MIRRORLAND_FOCUSED','MIRRORLAND_WITHDRAWING'].every(x=>mirror.includes(x)),'existing Mirrorland reveal lifecycle remains authoritative');
check('LOWER_CAROUSEL_PRESERVED',capJs.includes('OBJECT_FIRST_STABLE_GEOMETRY_GEN1536')&&capJs.includes('data-house-guide-selector')&&capCss.includes('height:clamp(390px,48vw,480px)'),'successful lower capability carousel remains intact');
check('NO_HOUSE_NESTED_STATE',!capJs.includes('data-house-orbit')&&!capJs.includes('data-return-house')&&!capJs.includes('RETURN TO ORBIT')&&!capJs.includes("mode='house'")&&!capJs.includes('house-members'),'House remains in capability orbit without obsolete Return to Orbit state');
check('HOUSE_GUIDES_BENEATH_OBJECT',['jeeves','elara','auren'].every(x=>capJs.includes(`data-house-function="${x}"`)),'Jeeves Elara and Auren remain directly selectable beneath House');
check('CORRECTED_BRAIN_ANATOMY',['midbrain','pons','medulla','cerebellum'].every(x=>brain.includes(x))&&!brain.includes('cerebellum-left')&&!brain.includes('cerebellum-right'),'corrected brain anatomy preserved');
check('FOUR_CARDINALS',['north','east','south','west'].every(x=>html.includes(`data-cardinal-id="${x}"`)),'four cardinal directions preserved');
check('NINETEEN_ROOMS',new Set(roomIds).size===19,`room declarations=${new Set(roomIds).size}`);
check('REDUCED_MOTION_PRESENT',recoveryCss.includes('@media(prefers-reduced-motion:reduce)')&&capCss.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion paths remain explicit');
const pass=checks.every(c=>c.pass);const receipt={schema:'COMPASS_GEN1537_DISPLAY_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,base:BASE,candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),result:pass?'PASS_CLOSED':'FAIL_CLOSED',changedPaths:changed,checks};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
