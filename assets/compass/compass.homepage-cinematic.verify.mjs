#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const BASE='8d7c6a34ced8b01b6627f704c5c38492e3e67f34';
const SPEC='88473442959299d6f6af82396917f0578074cab2';
const GEOGRAPHY_BLOB='a67a4e95f7634eb97a375ff103d95bdc81c64f0b';
const MIRROR_GEOMETRY_BLOB='fb3ee8ab92fa4b08e7708b83780de75d1a6f8595';
const FOREST_BLOB='919b5e46a7d28ef4b6e1847b24f603c1cfaf4102';
const CLOUD_BLOB='9974994570438a318a5858a15866d7d46acbeb5e';
const EXPECTED_PATHS=[
  'assets/compass/cinematic-media/manifest.v1.json',
  'assets/compass/compass.homepage-cinematic.verify.mjs',
  'assets/compass/compass.orientation-cinematic.render.js'
].sort();
const TASK='isolated S05 Mirrorland reconstruction and visual-fidelity code audit from frozen shared geometry and mature detached Characters source components; no S06 construction, no host timing change, no destination runtime embedding, no S05 readiness gate before S01, no separate user visual-review gate';
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

check('S05_ISOLATED_TASK',/S05 MIRRORLAND/u.test(TASK.toUpperCase())&&/NO S06 CONSTRUCTION/u.test(TASK.toUpperCase()),TASK);
check('CODE_AUDIT_IS_GOVERNING_VISUAL_REVIEW',/VISUAL-FIDELITY CODE AUDIT/u.test(TASK.toUpperCase())&&/NO SEPARATE USER VISUAL-REVIEW GATE/u.test(TASK.toUpperCase()),TASK);
check('CLEAN_RECOVERY_BASE',custody.sourceMain===BASE,BASE);
check('SPECIFICATION_PRESERVED',custody.specificationCommit===SPEC&&host.includes(SPEC),SPEC);
check('MASTER_DURATION_FROZEN',host.includes('const MASTER_DURATION_MS=45000'));
check('S05_BOUNDARY_FROZEN',host.includes("id:'S05',beat:'Threshold',purpose:'Cross from orientation into deeper experience',startMs:19500,endMs:25500"));
check('S06_BOUNDARY_FROZEN',host.includes("id:'S06',beat:'Elsewhere',purpose:'Reveal story and world possibility',startMs:25500,endMs:30500"));

check('S05_RENDERER_SCHEMA',render.includes("COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_v4_S05_SOURCE_RECONSTRUCTION")&&render.includes("COMPASS_S05_MIRRORLAND_SHARED_GEOMETRY_MATURE_COAST_RECONSTRUCTION_v1"));
check('SHARED_GEOMETRY_BOUND',render.includes(MIRROR_GEOMETRY_BLOB)&&render.includes("DIAMOND_GATE_BRIDGE_SHARED_MIRRORLAND_WINDOW_GEOMETRY_TNT_v1")&&render.includes('geometryApi.getPanes')===false&&render.includes('api.getPanes()')&&render.includes('api.getFrameSegments()'));
check('NO_LOCAL_WINDOW_COORDINATE_DUPLICATION',!render.includes('const MIRROR_PANES')&&!render.includes('const MIRROR_FRAME')&&!render.includes("['crown-left','paleCyan'"));
check('REGIONAL_GEOGRAPHY_BOUND',render.includes("'/characters/step9-regional-geography.mjs'")&&render.includes("regional.step9TerrainHeight")&&render.includes("regional.step9ShorelineZ")&&render.includes("regional.resolveStep9Camera('MIRROR_MANOR')"));
check('SINGLE_ROOT_GEOGRAPHY_BOUND',render.includes(GEOGRAPHY_BLOB)&&render.includes("geographyAuthority:Object.freeze({path:'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js'")&&custody.singleGeographyAuthority?.blob===GEOGRAPHY_BLOB);
check('NIGHT_PRESENTATION_BOUND',render.includes("'/characters/night-renderer.mjs'")&&render.includes('GRATITUDE_COAST_NIGHT'));
check('FOREST_SOURCE_BOUND',render.includes(FOREST_BLOB)&&render.includes("'/characters/forest-system.mjs'"));
check('CLOUD_SOURCE_BOUND',render.includes(CLOUD_BLOB)&&render.includes("'/characters/cloud-system.mjs'"));
check('FOREST_PRESENTATION_SOURCE_REUSED',render.includes('createForestSystem('),'S05 must reuse the detached forest presentation renderer rather than redraw tree populations as local 2D ellipses');
check('CLOUD_PRESENTATION_SOURCE_REUSED',render.includes('createCloudSystem('),'S05 must reuse the detached cloud morphology/presentation renderer rather than redraw cloud banks as local radial ellipses');
check('NIGHT_SHADER_PRESENTATION_REUSED',render.includes('NIGHT_FRAGMENT_SHADER'),'S05 terrain/water/night presentation must consume the existing Characters night shader language rather than palette-only local approximation');
check('S05_COPY_CORRECT',render.includes("<p>Cross into Mirrorland.</p><h2>Mirrorland</h2><span>Enter the narrative world.</span>"));
check('S05_CROSSING_TIMING_PRESERVED',render.includes('reveal=smooth(.1833,.4333,p)')&&render.includes('focused=smooth(.4333,.6667,p)')&&render.includes('crossAmount=smooth(.6667,1,p)')&&render.includes('mix(1,2.06,crossAmount)'));

check('NO_DESTINATION_IFRAME',!render.includes("make('iframe'")&&!render.includes("world.src='/characters/'"));
check('NO_CHARACTERS_APP_RUNTIME',!render.includes('characters/app.mjs'));
check('NO_MIRRORLAND_RUNTIME_GLOBAL',!render.includes('__MIRRORLAND_CLOUD_SYSTEM__')&&!render.includes('characters/index.html'));
check('NO_S05_AUDIO_OWNER',!/(new Audio\s*\(|createElement\(['"]audio['"]\)|\.play\(\))/u.test(render));
check('S05_SOURCE_PREP_NOT_MASTER_GATE',render.includes('void prepareMirrorlandSources();')&&render.includes("throw new Error('MIRRORLAND_S05_SOURCES_NOT_READY')")&&host.includes('const snap=renderer?.inspect?.()?.final')&&!host.includes('mirrorlandSourcesReady')&&!host.includes('mirrorlandWorldReady'));
check('S05_FAILURE_LOCALIZED_TO_S05',render.includes("else if(shot.id==='S05'){try{renderThreshold")&&render.includes('MIRRORLAND_S05_SOURCE_RECONSTRUCTION_FAILURE'));
check('RUNTIME_EMBEDDING_FALSE',render.includes("root.dataset.mirrorlandRuntimeEmbedded='false'")&&render.includes('mirrorlandRuntimeEmbedded:false'));

check('S06_LEGACY_PENDING_BOUNDARY_UNTOUCHED_CONCEPT',render.includes("const AUDRALIA_RECONSTRUCTION_SCHEMA='COMPASS_AUDRALIA_SOURCE_RECONSTRUCTION_v1'")&&render.includes("else if(shot.id==='S06'){confirmAudraliaSource();renderAudralia"));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_PROTECTED_COMPASS_RUNTIME_IMPORT',!/import\s*\(\s*['"][^'"]*(?:compass\.controller|compass\.crystals|mirrorland-window|readiness-context|capability-carousel)[^'"]*['"]\s*\)/u.test(render));

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
process.stdout.write(`${JSON.stringify({schema:'COMPASS_MAIN_HOMEPAGE_CINEMATIC_S05_SOURCE_RECONSTRUCTION_VERIFIER_v2',result,checkpoint:'S05_SOURCE_AND_VISUAL_FIDELITY_CODE_AUDIT',base:BASE,subjectHead,mutationTask:TASK,proofBoundary:'STATIC SOURCE, SCOPE, AND VISUAL-FIDELITY CODE AUDIT; USER VISUAL REVIEW NOT REQUIRED; S05 HARD BOUNDARY PASSES ONLY WHEN ALL CHECKS PASS',checks},null,2)}\n`);
process.exit(result==='PASS'?0:1);
