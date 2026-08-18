#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_EMERGENCY_FLAGSHIP_CORRECTION_20260818_003';
const LOCK=1534;
const BASE='1bda4203b4410be4471695dce33afca97d305623';
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-gen1534-performance.json';
const read=p=>fs.readFileSync(p,'utf8');
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const checks=[];
const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});

const identity=read('assets/compass/compass.identity-3d.js');
const mirror=read('assets/compass/compass.mirrorland-window.js');
const crystals=read('assets/compass/compass.crystals.js');
const flagship=read('assets/compass/compass.identity-3d.css');
const statements=read('assets/compass/compass.statement-carousel.js');
const brain=read('assets/compass/compass.brain-scene.js');

check('GEN1534_RUNTIME_IDENTITY',identity.includes("const GLOBAL='DGB_COMPASS_IDENTITY_3D_GEN1534'"),'Gen1534 identity runtime owns the emergency successor');
check('CANONICAL_GEOMETRY_DIRECT',identity.includes("designId:'DGB_SCOUTCRAFT_01'")&&identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&identity.includes('source.buildLawsSpacecraftGeometry()'),'Laws spacecraft geometry remains direct canonical module consumption');
check('SPACECRAFT_SCENE_BOUND',identity.includes("presentationSurface='LIVE_SCENE_BOUND_WEBGL_3D'")&&identity.includes("interactionAuthority='scene-bound-3d-bounded-response-only-no-navigation'"),'spacecraft is a live scene-bound 3D participant with no navigation authority');
check('SPACECRAFT_VISIBILITY_SUSPENSION',identity.includes("performancePolicy='scene-visible-demand-driven-webgl-offscreen-suspended'")&&identity.includes('IntersectionObserver')&&identity.includes("offscreenRendering=visible?'active-on-demand':'suspended'"),'spacecraft suspends rendering offscreen');
check('SPACECRAFT_LOW_POWER_DPR',identity.includes("powerPreference:'low-power'")&&identity.includes('Math.min(devicePixelRatio||1,innerWidth<700?.8:1)'),'scene-bound WebGL backing resolution is explicitly bounded');
check('SPACECRAFT_NO_FLIGHT_LOOP',!identity.includes('hardware-flight-3d')&&!identity.includes('state.nextLaunch')&&!identity.includes('now-lastDraw<33'),'invented continuous ambient flight loop remains removed');
check('SPACECRAFT_BOUNDED_RECOVERY',identity.includes("setTimeout(()=>{impact=0;schedule()},360)")&&identity.includes('function settle()'),'pointer hit/orientation response returns to base pose and base material state');
check('MIRRORLAND_DEMAND_DRIVEN',mirror.includes('transitionNeedsFrames')&&mirror.includes('requestRender')&&mirror.includes('if (transitionNeedsFrames())'),'Mirrorland renders only while state transition requires frames');
check('CRYSTAL_DEMAND_DRIVEN',crystals.includes('needsAnotherFrame')&&crystals.includes('requestRender')&&crystals.includes('SETTLE_EPSILON'),'crystal renderer is convergence/invalidation driven');
check('FLAGSHIP_POINTER_WORK_BOUNDED',statements.includes('requestAnimationFrame(apply)')&&statements.includes('setTimeout(()=>{tx=0;ty=0')&&statements.includes("scene.addEventListener('pointermove',move,{passive:true})"),'scene pointer response is coalesced and settles to neutral');
check('WIDE_SCENE_POSTPROCESS_REMOVED',statements.includes("scene.style.setProperty('filter','none','important')")&&flagship.includes('filter:none!important')&&flagship.includes('contain:layout paint'),'large interactive scene avoids persistent post-process filtering and is paint-contained');
check('NO_FIXED_VIEWPORT_ATMOSPHERE',!flagship.includes('.compass-estate::before{content:"";position:fixed'),'viewport-wide fixed blurred atmosphere removed');
check('WILL_CHANGE_TRANSIENT_ONLY',!flagship.includes('.compass-wordmark-stage{position:relative;display:grid;place-items:center;transform-style:preserve-3d;isolation:isolate;will-change:transform}')&&flagship.includes('.compass-wordmark-stage--compass.is-revolving')&&flagship.includes('will-change:transform'),'will-change is limited to the bounded title revolution');
check('REDUCED_MOTION_PRESENT',flagship.includes('@media(prefers-reduced-motion:reduce)')&&statements.includes("const reduce=matchMedia('(prefers-reduced-motion: reduce)')"),'reduced-motion path remains explicit');
check('BRAIN_RESOURCE_AWARE',brain.includes('IntersectionObserver')&&brain.includes('document.hidden')&&brain.includes("powerPreference:'low-power'"),'brain renderer remains visibility/page-state/resource aware');

const pass=checks.every(c=>c.pass);
const receipt={
  schema:'COMPASS_GEN1534_PERFORMANCE_VERIFICATION_RECEIPT_v1',
  operation:OP,
  lockGeneration:LOCK,
  base:BASE,
  candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),
  result:pass?'PASS_CLOSED':'FAIL_CLOSED',
  acceptance:'SCENE_BOUND_TRUE_3D_AND_OFFSCREEN_SUSPENSION_AND_NO_PERMANENT_QUALITY_DOWNGRADE',
  checks
};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
process.exit(pass?0:1);
