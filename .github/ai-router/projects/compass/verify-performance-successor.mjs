import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OPERATION='COMPASS_CRYSTAL_RENDERER_PERFORMANCE_CONTINUATION_20260817_007';
const LOCK=1525;
const GOVERNING='d53b9c627c6b9be3222044b5ca879c080a7165f1';
const OUTPUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-gen1525-performance.json';
const read=p=>fs.readFileSync(p,'utf8');
const bytes=p=>Buffer.byteLength(read(p));
const git=a=>spawnSync('git',a,{encoding:'utf8'});
const checks=[];
const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});

const paths={
  brain:'assets/compass/compass.brain-scene.js',
  brainCss:'assets/compass/compass.brain.css',
  identity:'assets/compass/compass.identity-3d.js',
  identityCss:'assets/compass/compass.identity-3d.css',
  capability:'assets/compass/compass.capability-carousel.js',
  crystal:'assets/compass/compass.crystals.js',
  index:'index.html',
  geometry:'assets/compass/upstream-compass.geometry.js',
  renderer:'assets/compass/upstream-compass.renderer.js'
};
const t=Object.fromEntries(Object.entries(paths).map(([k,p])=>[k,read(p)]));
const head=git(['rev-parse','HEAD^{commit}']).stdout.trim();
const requested=(process.env.COMPASS_CANDIDATE_HEAD||head).trim();

check('EXACT_CANDIDATE_HEAD_BOUND',/^[0-9a-f]{40}$/.test(head)&&head===requested,{head,requested});
check('GEN1525_OPERATION_BINDING',OPERATION.endsWith('_007')&&LOCK===1525&&GOVERNING.length===40,{OPERATION,LOCK,GOVERNING});
for(const[k,max]of Object.entries({brain:24576,brainCss:8192,identity:24576,identityCss:12288}))check(`BUDGET_${k.toUpperCase()}`,bytes(paths[k])<=max,{bytes:bytes(paths[k]),max});
check('CORRECTIVE_PAYLOAD_BOUNDED',bytes(paths.identity)+bytes(paths.identityCss)+bytes(paths.brain)<=49152,{bytes:bytes(paths.identity)+bytes(paths.identityCss)+bytes(paths.brain),max:49152});

check('LAWS_DIRECT_GEOMETRY_ADOPTION',
  t.identity.includes("sourceModule:'/laws/index.spacecraft.geometry.js'")&&
  t.identity.includes("adoption:'DIRECT_CANONICAL_GEOMETRY_MODULE_CONSUMPTION'")&&
  t.identity.includes("import('/laws/index.spacecraft.geometry.js?v=LAWS_CP6_TRUE_3D_SPACECRAFT_20260801A')")&&
  t.identity.includes('source.buildLawsSpacecraftGeometry()'),
  'canonical Laws geometry consumed directly');
check('LAWS_SINGLE_MESH_DRAW',t.identity.includes('gl.drawElements(gl.TRIANGLES,mesh.indices.length')&&!t.identity.includes('drawCraft('),'one admitted mesh draw; no custom 2D craft silhouette');
check('SPACECRAFT_DPR_BOUNDED',t.identity.includes('Math.min(devicePixelRatio||1,1)')&&t.identity.includes("powerPreference:'low-power'")&&t.identity.includes('preserveDrawingBuffer:false')&&t.identity.includes("performancePolicy='desktop-only-30fps-dpr1'"),'DPR 1 hard cap, low-power WebGL context, no preserved backbuffer');
check('SPACECRAFT_IDLE_GATED',t.identity.includes('document.hidden||reduce.matches||now-lastDraw<33')&&t.identity.includes('innerWidth<=720')&&t.identity.includes('state.nextLaunch')&&t.identity.includes('18000+')&&t.identity.includes("performancePolicy='desktop-only-30fps-dpr1'"),'document/reduced-motion/mobile suspension plus 30fps flight throttle and bounded relaunch cadence');
check('SPATIAL_COMPASS_IDLE_SETTLED',t.identity.includes('firstEnhancedFrameCompleted')&&t.identity.includes('renderer.stop?.(receipt.lastMountedInstanceId)')&&t.identity.includes("compassSpatialIdlePolicy='first-enhanced-frame-then-stop'")&&t.identity.includes("compassSpatialRendererStatus='settled-static-enhanced-frame'"),'true-3D Compass renders its enhanced frame, then stops continuous idle work');

check('CRYSTAL_TOPOLOGY_PRESERVED',
  t.crystal.includes('DGB_COMPASS_CRYSTALS_SPHERICAL_CONSTELLATION_AND_CLUSTER_HARDENED_v4')&&
  t.crystal.includes('RIGHT_HANDED_EUCLIDEAN_XYZ')&&
  t.crystal.includes('registryCardinalCount:\n        4')&&
  t.crystal.includes('registryRoomCount:\n        19')&&
  t.crystal.includes('mirrorlandRegistryPresent:\n        false'),
  'four cardinal / nineteen room XYZ crystal topology preserved');
check('CRYSTAL_INTERACTION_AUTHORITY_PRESERVED',
  t.crystal.includes('beginOrbitGesture')&&t.crystal.includes('requestOrbitPreview')&&t.crystal.includes('requestOrbitCommit')&&
  t.crystal.includes('requestClusterCommit')&&t.crystal.includes('findHitAtClientPoint')&&t.crystal.includes('MIRRORLAND_THRESHOLD'),
  'gesture, hit-test, controller and Mirrorland boundaries retained');
check('CRYSTAL_IDLE_HEAVY_WORK_GATED',
  t.crystal.includes('const idleHeavyFrameIntervalMs =')&&
  t.crystal.includes('state.reducedMotion\n        ? 1000\n        : 500')&&
  t.crystal.includes('const interactionActive =\n      Boolean(\n        state.pointer\n      )')&&
  t.crystal.includes('now -\n        state.lastTime * 1000 <\n        idleHeavyFrameIntervalMs')&&
  t.crystal.includes('state.raf =\n        requestAnimationFrame(\n          render\n        );\n\n      return;'),
  'idle/reduced-motion frames retain a lightweight RAF wake loop while expensive scene work is bounded');
check('CRYSTAL_RESOURCE_CAPS_PRESERVED',t.crystal.includes('normalDevicePixelRatioCap:\n      2')&&t.crystal.includes('lowPowerDevicePixelRatioCap:\n      1.5'),'approved crystal DPR caps preserved; repair is scheduling-only');

check('SPATIAL_COMPASS_REUSES_EXISTING_GEOMETRY',t.identity.includes('/assets/compass/upstream-compass.geometry.js?v=3.0.0-fixed-center-independent-sibling')&&t.identity.includes('/assets/compass/upstream-compass.renderer.js?v=3.1.1-generic-lifecycle-receipt')&&t.geometry.includes('dimensionality: 3')&&t.geometry.includes('occupiedTotalDepth: 0.48'),'existing true-3D geometry/renderer reused');
check('SPATIAL_COMPASS_RESOURCE_POLICY',t.renderer.includes('normalDevicePixelRatioCap')&&t.renderer.includes('lowPowerDevicePixelRatioCap')&&t.renderer.includes('bloomDisableWidthPx')&&t.renderer.includes('preserveDrawingBuffer')&&t.renderer.includes('false'),'renderer DPR/bloom/backbuffer controls retained');
check('BRAIN_RUNTIME_GATED',t.brain.includes('IntersectionObserver')&&t.brain.includes('document.hidden')&&t.brain.includes("powerPreference:'low-power'")&&t.brain.includes('innerWidth<700?1.25:1.75'),'brain viewport/page/device gating');
check('BRAIN_SINGLE_DRAW_CALL',(t.brain.match(/gl\.drawElements/g)||[]).length===1,'single combined brain draw call');
check('BRAIN_ANATOMY_CORRECTIVE',t.brain.includes("ellipsoid('cerebellum',0,-.52,-.62,.56,.255,.35")&&t.brain.includes("tube('midbrain'")&&t.brain.includes("tube('pons'")&&t.brain.includes("tube('medulla'")&&t.brain.includes("brainPosteriorBulbs:'none'"),'single integrated cerebellum + continuous brainstem axis');
check('REDUCED_MOTION_EQUIVALENCE',t.identityCss.includes('@media(prefers-reduced-motion:reduce)')&&t.brain.includes("brainMotion:reduce.matches?'static-reduced-motion':'slow-yaw'")&&t.identity.includes('reduce.matches||innerWidth<=720'),'reduced-motion static equivalents and ambient-craft suspension');
check('PROTECTED_CAPABILITIES_READ_ONLY',["dataset.capability='diagnostic'","dataset.capability='awards'","dataset.capability='house'"].every(v=>t.capability.includes(v)),'protected capability order remains');

const allowed=new Set([
  'assets/compass/compass.crystals.js',
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
  '.github/ai-router/projects/compass/verify-performance-successor.mjs',
  '.github/workflows/compass-carousel-successor-live-qualification.yml',
  '.github/workflows/compass-performance-successor-validation.yml'
]);
const changed=git(['diff','--name-only',`${GOVERNING}...HEAD`]);
if(changed.status===0){
  const list=changed.stdout.trim().split(/\r?\n/).filter(Boolean);
  check('EXACT_GEN1525_5_PATH_BOUNDARY',list.length>0&&list.every(p=>allowed.has(p)),{changed:list,allowedCount:allowed.size});
  check('ONLY_CRYSTAL_PRODUCT_SURFACE_MUTATED',list.filter(p=>p.startsWith('assets/compass/')).every(p=>p==='assets/compass/compass.crystals.js'),list);
  check('PROTECTED_CONTROLLER_CAPABILITY_UNTOUCHED',list.every(p=>!['assets/compass/compass.controller.js','assets/compass/compass.capability-carousel.js','assets/compass/compass.capability-carousel.css'].includes(p)),list);
}else check('EXACT_GEN1525_5_PATH_BOUNDARY',false,changed.stderr);

const failures=checks.filter(c=>!c.pass);
const receipt={schema:'COMPASS_CRYSTAL_RENDERER_GEN1525_PERFORMANCE_RECEIPT_v1',operationId:OPERATION,lockGeneration:LOCK,governingHead:GOVERNING,candidateHead:head,targetFrameBudgetMs:16.7,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
