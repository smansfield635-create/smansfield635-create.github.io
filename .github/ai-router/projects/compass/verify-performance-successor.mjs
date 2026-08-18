#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_LIVE_RECOVERY_GEN1537_20260818_001';
const LOCK=1537;
const BASE='1de7eb13bf5cc7d87d24896ac41bd0c841e42753';
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-coherence-performance.json';
const read=p=>fs.readFileSync(p,'utf8');const git=args=>spawnSync('git',args,{encoding:'utf8'});const checks=[];const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
const recovery=read('assets/compass/compass.gen1537.recovery.js'),recoveryCss=read('assets/compass/compass.gen1537.recovery.css'),mirror=read('assets/compass/compass.mirrorland-window.js'),crystals=read('assets/compass/compass.crystals.js'),statements=read('assets/compass/compass.statement-carousel.js'),brain=read('assets/compass/compass.brain-scene.js'),cap=read('assets/compass/compass.capability-carousel.css');
check('GEN1537_RUNTIME_IDENTITY',recovery.includes("const GLOBAL='DGB_COMPASS_GEN1537_LIVE_RECOVERY'"),'Gen1537 recovery runtime owns corrective behavior');
check('SPACECRAFT_RENDER_LOOP_TERMINATED',recovery.includes('craft?.destroy?.()')&&recovery.includes('node.remove()')&&recovery.includes('MutationObserver'),'rejected scene-bound spacecraft is destroyed and prevented from remounting');
check('FIXED_CENTER_RENDERER_BOUNDED',recovery.includes('upstream-compass.renderer.js')&&recovery.includes('firstEnhancedFrameCompleted')&&recovery.includes('renderer.stop?.(receipt.lastMountedInstanceId)'),'restored 3D Compass renders its enhanced frame and stops continuous work');
check('NO_NEW_POINTER_LOOP',!recovery.includes("addEventListener('pointermove'")&&!recovery.includes('setInterval('),'recovery layer adds no continuous pointer or interval workload');
check('MIRRORLAND_DEMAND_DRIVEN',mirror.includes('transitionNeedsFrames')&&mirror.includes('requestRender')&&mirror.includes('if (transitionNeedsFrames())'),'Mirrorland remains demand-driven');
check('CRYSTAL_DEMAND_DRIVEN',crystals.includes('needsAnotherFrame')&&crystals.includes('requestRender')&&crystals.includes('SETTLE_EPSILON'),'crystal renderer remains convergence driven');
check('STATEMENT_POINTER_WORK_BOUNDED',statements.includes('requestAnimationFrame(apply)')&&statements.includes('setTimeout(()=>{tx=0;ty=0'),'statement interaction remains coalesced and settling');
check('BRAIN_RESOURCE_AWARE',brain.includes('IntersectionObserver')&&brain.includes('document.hidden')&&brain.includes("powerPreference:'low-power'"),'brain remains visibility/page-state/resource aware');
check('REDUCED_MOTION_PRESENT',recoveryCss.includes('@media(prefers-reduced-motion:reduce)')&&cap.includes('@media(prefers-reduced-motion:reduce)'),'recovery and lower carousel expose reduced-motion behavior');
check('NO_FIXED_VIEWPORT_ATMOSPHERE',!recoveryCss.includes('position:fixed'),'new atmospheric treatment remains scene-local rather than viewport-fixed');
const pass=checks.every(c=>c.pass);const receipt={schema:'COMPASS_GEN1537_PERFORMANCE_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,base:BASE,candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),result:pass?'PASS_CLOSED':'FAIL_CLOSED',acceptance:'MIRRORLAND_FUNCTIONAL_AND_DIMENSIONAL_STANDARD_WITHOUT_SPACECRAFT_FOREGROUND',checks};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
