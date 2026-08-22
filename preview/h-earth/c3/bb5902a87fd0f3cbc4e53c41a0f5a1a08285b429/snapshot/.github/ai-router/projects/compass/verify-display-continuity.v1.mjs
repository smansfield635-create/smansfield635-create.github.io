#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_ROOM_SELECTED_CONTINUITY_AND_QUALIFICATION_HARDENING_20260818_v2';
const LOCK=1538;
const OUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-room-selected-continuity-display.json';
const head=spawnSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).stdout.trim();
const base=process.env.COMPASS_SCOPE_BASE_SHA||'ad3357e817f50cb66b7074e0d620888f2bc5407f';
const changed=spawnSync('git',['diff','--name-only',`${base}...HEAD`],{encoding:'utf8'}).stdout.trim().split('\n').filter(Boolean);
const allowed=new Set([
  'assets/compass/compass.crystals.js',
  'assets/compass/compass.controller.js',
  'assets/compass/compass.laws-spacecraft.js',
  '.github/ai-router/projects/compass/room-selected-continuity-qualification-amendment.v1.json',
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
  '.github/workflows/compass-display-continuity-validation.yml',
  '.github/ai-router/router.v1.json',
  '.github/ai-router/projects/compass/entrypoint.v1.json'
]);
const read=p=>fs.readFileSync(p,'utf8');
const controller=read('assets/compass/compass.controller.js');
const crystals=read('assets/compass/compass.crystals.js');
const spacecraft=read('assets/compass/compass.laws-spacecraft.js');
const amendment=JSON.parse(read('.github/ai-router/projects/compass/room-selected-continuity-qualification-amendment.v1.json'));
const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const roomSelection=controller.match(/function requestRoomSelection\([\s\S]*?\n  function requestReturnToConstellation/)?.[0]||'';
check('EXACT_SCOPE',changed.every(p=>allowed.has(p)),changed);
check('AMENDMENT_BOUND',amendment.operationId===OP&&amendment.lockGeneration===LOCK&&amendment.qualificationLaw?.id==='DECLARED_INTERACTIVE_CAPABILITY_EXECUTION_LAW_v1',amendment.schema);
check('ROOM_SELECTED_DECLARED_MANIPULABLE',controller.includes('STATES.CLUSTER_OPEN,\n        STATES.ROOM_SELECTED')&&controller.includes('function canManipulateCluster'),true);
check('ROOM_SELECTION_DOES_NOT_FORCE_PANEL_DESCENT',roomSelection.includes('setPanelDescended(\n      false\n    );')&&!roomSelection.includes('schedulePanelDescent('),roomSelection.slice(-900));
check('ROOM_SELECTED_GUIDANCE_PRESERVES_DRAG',/ROOM_SELECTED:[\s\S]{0,220}Drag to rotate the cluster/.test(controller),true);
check('CRYSTALS_ROOM_SELECTED_GESTURE_SCOPE',crystals.includes('frameState ===\n              "ROOM_SELECTED"')&&crystals.includes('GESTURE_TYPES.CLUSTER_DRAG'),true);
check('CRYSTALS_CONTROLLER_RENDER_CHAIN_PRESENT',crystals.includes('requestControllerClusterBegin')&&crystals.includes('requestControllerClusterPreview')&&crystals.includes('requestControllerClusterCommit')&&crystals.includes('state.clusterQuaternions.set'),true);
check('SPACECRAFT_BOOTSTRAPPED_BY_PRESENTATION_OWNER',crystals.includes('DGB_COMPASS_DISABLE_LOCAL_SPACECRAFT')&&crystals.includes('/assets/compass/compass.laws-spacecraft.js?cb=dee3823dc51a86b6'),true);
check('SPACECRAFT_LAWS_OWNER_PRESERVED',spacecraft.includes("import('/laws/index.spacecraft.background.js")&&spacecraft.includes("compassSpacecraftAuthority='ambient-presentation-and-bounded-hit-response-only'"),true);
check('SPACECRAFT_EXPLICIT_START_BOUND',spacecraft.includes('api?.start?.();'),true);
check('PROTECTED_SURFACES_OUTSIDE_SCOPE',!changed.some(p=>p.startsWith('laws/')||p.includes('compass.mirrorland-window.js')||p.includes('compass.cosmos.js')||p==='index.html'),changed);
const failures=checks.filter(x=>!x.pass);
const receipt={schema:'COMPASS_ROOM_SELECTED_CONTINUITY_STATIC_RECEIPT_v1',operation:OP,lockGeneration:LOCK,candidate:head,base,changed,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
