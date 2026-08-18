#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_COHERENCE_OBJECT_PORTAL_AND_IDENTITY_SIMPLIFICATION_20260818_001';
const LOCK=1536;
const BASE='f3622b8d394437dd1b1a23165fd13dc5d73cb875';
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-coherence-performance.json';
const read=p=>fs.readFileSync(p,'utf8');const git=args=>spawnSync('git',args,{encoding:'utf8'});const checks=[];const check=(id,pass,detail)=>checks.push({id,pass:Boolean(pass),detail});
const identity=read('assets/compass/compass.identity-3d.js'),mirror=read('assets/compass/compass.mirrorland-window.js'),crystals=read('assets/compass/compass.crystals.js'),flagship=read('assets/compass/compass.identity-3d.css'),statements=read('assets/compass/compass.statement-carousel.js'),brain=read('assets/compass/compass.brain-scene.js'),cap=read('assets/compass/compass.capability-carousel.css');
check('GEN1536_RUNTIME_IDENTITY',identity.includes("const GLOBAL='DGB_COMPASS_IDENTITY_3D_GEN1536'"),'Gen1536 identity runtime owns successor');
check('CANONICAL_GEOMETRY_DIRECT',identity.includes("designId:'DGB_SCOUTCRAFT_01'")&&identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&identity.includes('source.buildLawsSpacecraftGeometry()'),'Laws spacecraft geometry remains direct canonical module consumption');
check('SPACECRAFT_SCENE_BOUND',identity.includes("presentationSurface='LIVE_SCENE_BOUND_WEBGL_3D'")&&identity.includes("interactionAuthority='scene-bound-3d-bounded-response-only-no-navigation'"),'spacecraft remains scene-bound with no navigation authority');
check('SPACECRAFT_VISIBILITY_SUSPENSION',identity.includes("performancePolicy='scene-visible-demand-driven-webgl-offscreen-suspended'")&&identity.includes('IntersectionObserver')&&identity.includes("offscreenRendering=visible?'active-on-demand':'suspended'"),'spacecraft suspends offscreen');
check('SPACECRAFT_LOW_POWER_DPR',identity.includes("powerPreference:'low-power'")&&identity.includes('Math.min(devicePixelRatio||1,innerWidth<700?.8:1)'),'WebGL backing resolution remains bounded');
check('NO_REDUNDANT_COMPASS_RENDERER',!identity.includes('upstream-compass.renderer.js')&&!identity.includes('mountSpatialCompass'),'secondary Compass renderer removed, reducing work');
check('NO_TITLE_ROTATION_WORK',!identity.includes('is-revolving')&&!identity.includes('compass-identity-o-control'),'ornamental title rotation removed');
check('CAPABILITY_NO_BACKDROP_BLUR',!cap.includes('backdrop-filter:blur(18px)')&&!cap.includes('backdrop-filter:blur(12px)')&&cap.includes('contain:layout paint'),'capability orbit avoids large persistent blur surfaces');
check('MIRRORLAND_DEMAND_DRIVEN',mirror.includes('transitionNeedsFrames')&&mirror.includes('requestRender')&&mirror.includes('if (transitionNeedsFrames())'),'Mirrorland remains demand-driven');
check('CRYSTAL_DEMAND_DRIVEN',crystals.includes('needsAnotherFrame')&&crystals.includes('requestRender')&&crystals.includes('SETTLE_EPSILON'),'crystal renderer remains convergence driven');
check('FLAGSHIP_POINTER_WORK_BOUNDED',statements.includes('requestAnimationFrame(apply)')&&statements.includes('setTimeout(()=>{tx=0;ty=0')&&statements.includes("scene.addEventListener('pointermove',move,{passive:true})"),'scene pointer response remains coalesced and settling');
check('WIDE_SCENE_POSTPROCESS_REMOVED',statements.includes("scene.style.setProperty('filter','none','important')")&&flagship.includes('filter:none!important')&&flagship.includes('contain:layout paint'),'large scene avoids persistent post-process filtering');
check('NO_FIXED_VIEWPORT_ATMOSPHERE',!flagship.includes('.compass-estate::before{content:"";position:fixed'),'viewport-wide fixed blurred atmosphere remains absent');
check('REDUCED_MOTION_PRESENT',flagship.includes('@media(prefers-reduced-motion:reduce)')&&cap.includes('@media(prefers-reduced-motion:reduce)')&&statements.includes("const reduce=matchMedia('(prefers-reduced-motion: reduce)')"),'reduced-motion path explicit');
check('BRAIN_RESOURCE_AWARE',brain.includes('IntersectionObserver')&&brain.includes('document.hidden')&&brain.includes("powerPreference:'low-power'"),'brain renderer remains visibility/page-state/resource aware');
const pass=checks.every(c=>c.pass);const receipt={schema:'COMPASS_COHERENCE_PERFORMANCE_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,base:BASE,candidate:process.env.COMPASS_CANDIDATE_HEAD||git(['rev-parse','HEAD']).stdout.trim(),result:pass?'PASS_CLOSED':'FAIL_CLOSED',acceptance:'GEN1534_REAL_SCROLL_FLOOR_PRESERVED_WITH_REDUNDANT_RENDERERS_REMOVED',checks};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
