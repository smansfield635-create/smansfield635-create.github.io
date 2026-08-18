#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_FLAGSHIP_ARCHITECTURAL_SUCCESSOR_20260817_001';
const LOCK=1533;
const BASE='d19405d327585850ac095f236820f7b3072edc1c';
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-flagship-performance.json';
const read=p=>fs.readFileSync(p,'utf8');
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const checks=[];const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
const identity=read('assets/compass/compass.identity-3d.js'),mirror=read('assets/compass/compass.mirrorland-window.js'),crystals=read('assets/compass/compass.crystals.js'),flagship=read('assets/compass/compass.identity-3d.css'),statements=read('assets/compass/compass.statement-carousel.js'),brain=read('assets/compass/compass.brain-scene.js');
check('CANONICAL_GEOMETRY_DIRECT',identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&identity.includes("source.buildLawsSpacecraftGeometry()"),'Laws spacecraft geometry remains direct');
check('SPACECRAFT_RESOURCE_AWARE',identity.includes("performancePolicy='hardware-30fps-software-static-dpr1'")&&identity.includes('/SwiftShader|Software|llvmpipe/i'),'software static / hardware bounded scheduling');
check('SPACECRAFT_FRAME_CAP',identity.includes('now-lastDraw<33'),'hardware animation capped near 30fps');
check('SPACECRAFT_LONG_IDLE',identity.includes('state.nextLaunch')&&identity.includes('18000'),'flight has bounded long idle interval');
check('MIRRORLAND_DEMAND_DRIVEN',mirror.includes('transitionNeedsFrames')&&mirror.includes('requestRender')&&mirror.includes('if (transitionNeedsFrames())'),'Mirrorland schedules only when transitioning');
check('CRYSTAL_DEMAND_DRIVEN',crystals.includes('needsAnotherFrame')&&crystals.includes('requestRender')&&crystals.includes('SETTLE_EPSILON'),'crystal scheduling is convergence/invalidation driven');
check('NO_PERPETUAL_MIRROR_CONTINUATION',!mirror.includes('drawWindow();\n\n    requestRender();\n  }'),'no unconditional Mirrorland continuation');
check('FLAGSHIP_POINTER_WORK_BOUNDED',statements.includes('requestAnimationFrame(apply)')&&statements.includes('setTimeout(()=>{tx=0;ty=0')&&statements.includes("addEventListener('pointermove',move,{passive:true})"),'pointer response coalesced and settles to neutral');
check('CSS_POST_INTERACTION_FIDELITY',flagship.includes('.is-flagship-engaged')&&flagship.includes('transition:filter .24s ease'),'interaction pulse is finite and base fidelity remains');
check('REDUCED_MOTION_NO_PARALLAX',flagship.includes('@media(prefers-reduced-motion:reduce)')&&flagship.includes('.compass-spacecraft-layer{transform:none!important}'),'reduced motion removes parallax');
check('BRAIN_RESOURCE_AWARE',brain.includes('IntersectionObserver')||brain.includes('visible'),'brain renderer has visibility-aware behavior');
const pass=checks.every(c=>c.pass);const receipt={schema:'COMPASS_PERFORMANCE_SUCCESSOR_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,base:BASE,candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),result:pass?'PASS_CLOSED':'FAIL_CLOSED',policy:'NO_PERMANENT_QUALITY_DOWNGRADE_POST_INTERACTION_FULL_FIDELITY',checks};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
