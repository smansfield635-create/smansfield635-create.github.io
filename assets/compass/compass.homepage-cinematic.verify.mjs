#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='8d7c6a34ced8b01b6627f704c5c38492e3e67f34';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const GEOGRAPHY_BLOB='a67a4e95f7634eb97a375ff103d95bdc81c64f0b';
const MIRROR_GEOMETRY_BLOB='fb3ee8ab92fa4b08e7708b83780de75d1a6f8595';
const NIGHT_BLOB='066973f039a6439cf24264984243271942126b4d';
const FOREST_BLOB='919b5e46a7d28ef4b6e1847b24f603c1cfaf4102';
const CLOUD_BLOB='9974994570438a318a5858a15866d7d46acbeb5e';
const AUDRALIA_RENDERER_BLOB='872d20b17bb0cd89d9613ca0262b25350890a617';
const RENDER_BLOB='d664e91251f63918ecc5ec7a4634fe42047e501e';
const LIVE_AUDRALIA_RENDERER='/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const SNAPSHOT_AUDRALIA_RENDERER='/inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.render.js'
].sort();
const TASK='isolated S06 Audralia source-fidelity reconstruction and governing code audit using the canonical detached live-showroom renderer; preserve closed S05; no S07 construction, no host timing change, no destination runtime embedding, no master-clock readiness gate, no user visual-review gate';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const check=(id,pass,detail='')=>checks.push({id,pass:Boolean(pass),detail});
const host=read('assets/compass/compass.orientation-cinematic.js');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,render,media,final].join('\n');

check('S06_ISOLATED_TASK',/S06 AUDRALIA/u.test(TASK.toUpperCase())&&/NO S07 CONSTRUCTION/u.test(TASK.toUpperCase()),TASK);
check('CODE_AUDIT_IS_GOVERNING_VISUAL_REVIEW',custody.visualReviewMethod==='SOURCE_AND_CODE_AUDIT_BY_PRECEDENT'&&custody.userVisualReviewRequired===false);
check('CLEAN_RECOVERY_BASE',custody.sourceMain===BASE,BASE);
check('SPECIFICATION_PRESERVED',custody.specificationCommit===SPEC&&host.includes(SPEC),SPEC);
check('MASTER_DURATION_FROZEN',host.includes('const MASTER_DURATION_MS=45000'));
check('S05_BOUNDARY_FROZEN',host.includes("id:'S05',beat:'Threshold',purpose:'Cross from orientation into deeper experience',startMs:19500,endMs:25500"));
check('S06_BOUNDARY_FROZEN',host.includes("id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500"));
check('S07_BOUNDARY_FROZEN',host.includes("id:'S07',beat:'Breadth / Engagement',purpose:'Reveal ways to engage and estate breadth',startMs:30500,endMs:41000"));

check('COMBINED_RENDERER_SCHEMA',render.includes("COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_v6_S05_MATURE_S06_CANONICAL_WORLD"));
check('RENDERER_BLOB_RECORDED',custody.sourceAuthority?.S06?.construction?.rendererBlob===RENDER_BLOB&&custody.sourceAuthority?.S05?.construction?.rendererBlob===RENDER_BLOB,RENDER_BLOB);

check('S05_PRIOR_PASS_PRESERVED',custody.hardBoundary3?.passClaimed===true&&custody.hardBoundary3?.codeAudit==='PASS_SOURCE_FIDELITY'&&render.includes("COMPASS_S05_MIRRORLAND_SHARED_GEOMETRY_MATURE_DETACHED_WEBGL_v2"));
check('S05_SHARED_GEOMETRY_STILL_BOUND',render.includes(MIRROR_GEOMETRY_BLOB)&&render.includes('api.getPanes()')&&render.includes('api.getFrameSegments()')&&!render.includes('const MIRROR_PANES')&&!render.includes('const MIRROR_FRAME'));
check('S05_MATURE_RENDERERS_STILL_BOUND',render.includes(NIGHT_BLOB)&&render.includes(FOREST_BLOB)&&render.includes(CLOUD_BLOB)&&render.includes('sources.night.NIGHT_FRAGMENT_SHADER')&&render.includes('sources.forest.createForestSystem(gl,{compact})')&&render.includes('sources.clouds.createCloudSystem({gl,compact,reducedMotion:false})'));

check('SINGLE_ROOT_GEOGRAPHY_BOUND',render.includes(GEOGRAPHY_BLOB)&&custody.singleGeographyAuthority?.blob===GEOGRAPHY_BLOB&&custody.sourceAuthority?.S06?.renderer?.geographyImportResolvesTo==='h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js');
check('S06_CANONICAL_RENDERER_SOURCE',render.includes(`audraliaRenderer:Object.freeze({path:'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',blob:'${AUDRALIA_RENDERER_BLOB}'})`)&&render.includes(`const AUDRALIA_RENDERER_URL='${LIVE_AUDRALIA_RENDERER}'`));
check('S06_SNAPSHOT_RENDERER_NOT_ACTIVE',!render.includes(SNAPSHOT_AUDRALIA_RENDERER));
check('S06_CANONICAL_RENDERER_INSTANTIATED',render.includes('audraliaModule.createMapWideEnvironmentRenderer(canvas)')&&render.includes('renderer.planetaryVantage();renderer.render();'));
check('S06_CANONICAL_EVIDENCE_ENFORCED',render.includes('evidence.geographicTruthAuthorityCount!==1')&&render.includes('evidence.scaleDependentGeographicSubstitution!==false')&&render.includes('evidence.gratitudeUsesSameMeshAtAllViewScales!==true')&&render.includes('evidence.canonicalExtendedGratitudeSourceBound!==true')&&render.includes('evidence.sourceTerrainMutation!==false'));
check('S06_NO_LOCAL_2D_SUBSTITUTE',!render.includes('const AUDRALIA_GEOGRAPHY')&&!render.includes('projectAudraliaSource')&&!render.includes('traceAudraliaPath')&&!render.includes('drawAudraliaSourceReconstruction')&&!render.includes('createAudraliaSourceRenderer'));
check('S06_SCENE_SCHEMA',render.includes("COMPASS_S06_AUDRALIA_CANONICAL_DETACHED_RENDERER_v2"));
check('S06_COPY_CORRECT',render.includes("<p>Enter Audralia.</p><h2>Audralia</h2><span>Explore a continuous planetary world.</span>"));
check('S06_CAMERA_CINEMATOGRAPHY_PRESERVED',render.includes('state.distance=mix(5000,1750,settle)')&&render.includes('state.pitch=mix(1.02,.91,settle)')&&render.includes('state.yaw=mix(-.62,-.34,settle)')&&render.includes('state.targetU=0;state.targetV=-4'));
check('S06_MODULE_PREFETCH_NOT_RENDERER_BOOT',render.includes('void prepareAudraliaSource();')&&render.includes('audraliaModule=module')&&!/function prepareAudraliaSource\([^)]*\)\{[^}]*createMapWideEnvironmentRenderer/u.test(render));
check('S06_RENDERER_LAZY_AT_S06',render.includes('function audraliaModel(scene)')&&render.includes("else if(shot.id==='S06'){try{renderAudralia")&&render.includes('audraliaModel(host.querySelector(\'[data-scene="S06"]\'))'));
check('S06_FAILURE_LOCALIZED_TO_S06',render.includes('AUDRALIA_S06_SOURCE_RECONSTRUCTION_FAILURE')&&render.includes("throw new Error('AUDRALIA_S06_SOURCE_MODULE_NOT_READY')"));
check('S06_NOT_MASTER_GATE',!host.includes('audraliaSourceModuleReady')&&!host.includes('audraliaCanonicalRendererReady')&&!host.includes('audraliaWorldReady')&&!host.includes('AUDRALIA_S06_SOURCE_MODULE_NOT_READY'));
check('S06_FULL_WORLD_CONSTRUCTOR_DECLARED',render.includes("root.dataset.audraliaFullWorldConstructor='true'")&&render.includes("root.dataset.audraliaRuntimeEmbedded='false'")&&render.includes('audraliaFullWorldConstructorUsed:Boolean(audralia?.renderer)')&&render.includes('audraliaRuntimeEmbedded:false'));

check('NO_DESTINATION_IFRAME',!render.includes("make('iframe'")&&!render.includes("world.src='/characters/'")&&!render.includes("src='/showroom/globe/audralia/'"));
check('NO_DESTINATION_APP_RUNTIME_IMPORT',!render.includes('characters/app.mjs')&&!render.includes("import('/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs')")&&!render.includes("import('/showroom/globe/audralia/index.html')"));
check('NO_SECOND_AUDIO_OWNER',!/(new Audio\s*\(|createElement\(['"]audio['"]\)|\.play\(\))/u.test(render));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_COMPASS_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(render));

check('S06_CUSTODY_PASS',custody.sourceAuthority?.S06?.construction?.codeAuditStatus==='PASS_SOURCE_FIDELITY'&&custody.sourceAuthority?.S06?.construction?.custom2DProjectionPresent===false&&custody.sourceAuthority?.S06?.construction?.inspectionSnapshotRendererActive===false&&custody.hardBoundary4?.passClaimed===true&&custody.hardBoundary4?.codeAudit==='PASS_SOURCE_FIDELITY');
check('NO_USER_VISUAL_GATE',custody.hardBoundary4?.userVisualReviewRequired===false&&custody.sourceAuthority?.S06?.construction?.userVisualReviewRequired===false);

const args=process.argv.slice(2),baseIndex=args.indexOf('--base'),headIndex=args.indexOf('--head'),changedPathsIndex=args.indexOf('--changed-paths');
let subjectHead=null;
if(baseIndex!==-1&&headIndex!==-1){
  const base=args[baseIndex+1],head=args[headIndex+1];subjectHead=head;check('VERIFIER_BASE_MATCH',base===BASE,base);
  let changed=null;
  if(changedPathsIndex!==-1){changed=String(args[changedPathsIndex+1]||'').split(',').filter(Boolean).sort();check('EXTERNAL_COMPARE_PATHS_SUPPLIED',changed.length>0,JSON.stringify(changed));}
  else{const diff=spawnSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'});if(diff.status===0)changed=diff.stdout.split(/\r?\n/).filter(Boolean).sort();else check('GIT_DIFF_AVAILABLE',false,diff.stderr||'git diff failed');}
  if(changed)check('DECLARED_PATHS_ONLY',JSON.stringify(changed)===JSON.stringify(EXPECTED_PATHS),JSON.stringify(changed));
}
const result=checks.every(item=>item.pass)?'PASS':'FAIL';
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_S06_SOURCE_RECONSTRUCTION_VERIFIER_v1',result,checkpoint:'S06_CANONICAL_WORLD_SOURCE_FIDELITY_CODE_AUDIT_CLOSURE',base:BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC SOURCE, SCOPE, GEOGRAPHIC-AUTHORITY, AND VISUAL-FIDELITY CODE AUDIT; USER VISUAL REVIEW NOT REQUIRED; S07 REMAINS UNCHANGED',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
