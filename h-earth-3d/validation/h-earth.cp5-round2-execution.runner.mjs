import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../..');
const BASE='2d735e3b6d2a695bc456ad24fe92fc153a0c2928';
const CONTROL_PATH='h-earth-3d/control-plane/post-cp2-round2/h-earth.cp5-round2-execution-control.v1.json';
const CANDIDATE_PATH='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-candidate.js';
const ACCEPTED_PATH='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
const RECEIPT_PATH=path.join(ROOT,'h-earth-3d/validation/h-earth.cp5-round2-execution.receipt.v1.json');
const EVIDENCE_DIR=path.join(ROOT,'h-earth-3d/validation/round2/cp5-evidence');
const HARNESS_URL=process.env.CP5_HARNESS_URL??'http://127.0.0.1:4177/h-earth-3d/validation/round2/h-earth.cp5-round2-harness.html';
const control=JSON.parse(fs.readFileSync(path.join(ROOT,CONTROL_PATH),'utf8'));
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const sha256=(value)=>crypto.createHash('sha256').update(value).digest('hex');
const checks=[];
const failures=[];
const check=(id,passed,detail=null)=>{checks.push({id,status:passed?'PASS':'FAIL',passed,detail});if(!passed)failures.push({id,detail});};
const average=(values)=>values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);
const startedAt=new Date().toISOString();
const head=git('rev-parse','HEAD');
const changedPaths=git('diff','--name-only',`${BASE}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const allowedPaths=[
  '.github/workflows/h-earth-cp5-round2-execution.yml',
  CONTROL_PATH,
  'h-earth-3d/validation/round2/h-earth.cp5-round2-browser.mjs',
  'h-earth-3d/validation/round2/h-earth.cp5-round2-harness.html',
  'h-earth-3d/validation/h-earth.cp5-round2-execution.runner.mjs',
  CANDIDATE_PATH
].sort();
const unauthorized=changedPaths.filter((entry)=>!allowedPaths.includes(entry));
check('EXACT_CP5_PATH_SCOPE',unauthorized.length===0&&allowedPaths.every((entry)=>changedPaths.includes(entry)),{changedPaths,allowedPaths,unauthorized});
const productPaths=changedPaths.filter((entry)=>entry.startsWith('showroom/'));
check('ISOLATED_CANDIDATE_IS_ONLY_PRODUCT_MUTATION',JSON.stringify(productPaths)===JSON.stringify([CANDIDATE_PATH]),{productPaths});
const acceptedBlob=git('hash-object',ACCEPTED_PATH);
check('ACCEPTED_CP2_RENDERER_IMMUTABLE',acceptedBlob==='de55609b0b0bd66601445a369c727ff7a6d7065d',{acceptedBlob});
const indexBlob=git('rev-parse',`${BASE}:showroom/globe/h-earth/index.html`);
const currentIndexBlob=git('hash-object','showroom/globe/h-earth/index.html');
check('LIVE_DEFAULT_HOST_UNCHANGED',indexBlob===currentIndexBlob,{indexBlob,currentIndexBlob});
const bindingPath='showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js';
check('LIVE_BINDING_UNCHANGED',git('rev-parse',`${BASE}:${bindingPath}`)===git('hash-object',bindingPath));
const candidateSource=fs.readFileSync(path.join(ROOT,CANDIDATE_PATH),'utf8');
const prohibitedTokens=['SCENE_01','SCENE_02','SCENE_03','SCENE_04','SCENE_05','SCENE_06','SCENE_07','SCENE_08','gl_FragCoord','cameraId','targetName','MANUALLY_PAINTED'];
const foundProhibited=prohibitedTokens.filter((token)=>candidateSource.includes(token));
check('CANDIDATE_SOURCE_HAS_NO_SCENE_CAMERA_OR_SCREEN_PATCH_HACKS',foundProhibited.length===0,{foundProhibited});
check('CANDIDATE_DERIVES_FROM_ACCEPTED_CP2_RENDERER',candidateSource.includes("from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'"));
check('CANDIDATE_USES_LAWFUL_WORLD_SPACE_INPUTS',['vWorldPosition','vNormal','distanceToCamera','fwidth'].every((token)=>candidateSource.includes(token)));

fs.mkdirSync(EVIDENCE_DIR,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1500,height:900},deviceScaleFactor:1});
page.setDefaultTimeout(900000);
const consoleErrors=[];
const pageErrors=[];
page.on('console',(message)=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',(error)=>pageErrors.push(error.message));
let result=null;
try{
  await page.goto(`${HARNESS_URL}?head=${head.slice(0,12)}`,{waitUntil:'domcontentloaded',timeout:240000});
  await page.waitForFunction(()=>document.documentElement.dataset.cp5Ready==='true',null,{timeout:300000});
  const sceneIds=await page.evaluate(()=>window.H_EARTH_CP5_ROUND2.listSceneIds());
  for(const sceneId of sceneIds){
    await page.evaluate((id)=>window.H_EARTH_CP5_ROUND2.renderScene(id),sceneId);
    await page.locator('#cp2-canvas').screenshot({path:path.join(EVIDENCE_DIR,`${sceneId.toLowerCase()}.cp2.png`)});
    await page.locator('#candidate-canvas').screenshot({path:path.join(EVIDENCE_DIR,`${sceneId.toLowerCase()}.round2.png`)});
  }
  result=await page.evaluate(()=>window.H_EARTH_CP5_ROUND2.finalize());
}finally{
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN',consoleErrors.length===0&&pageErrors.length===0,{consoleErrors,pageErrors});
const scenes=result?.scenes??[];
check('ALL_EIGHT_SCENES_EXECUTED',scenes.length===8,{actual:scenes.length});
check('ALL_EIGHT_TARGETS_PROJECT',scenes.every((record)=>record.targetProjection?.visible===true),{failures:scenes.filter((record)=>record.targetProjection?.visible!==true).map((record)=>record.scene.id)});
check('ALL_CAMERA_STATES_LAWFUL',scenes.every((record)=>record.cameraChunkId!==null),{failures:scenes.filter((record)=>record.cameraChunkId===null).map((record)=>record.scene.id)});
check('ALL_EIGHT_FRAMEBUFFER_READBACKS',scenes.every((record)=>record.cp2?.metrics?.pixelCount>0&&record.candidate?.metrics?.pixelCount>0&&record.cp2.metrics.byteHash&&record.candidate.metrics.byteHash));
check('ALL_FRAMEBUFFERS_ALPHA_CLOSED',scenes.every((record)=>record.cp2.metrics.alphaClosedCount===record.cp2.metrics.pixelCount&&record.candidate.metrics.alphaClosedCount===record.candidate.metrics.pixelCount));
check('CANDIDATE_PROFILE_ACTIVE',result?.profile===control.candidateProfile,{actual:result?.profile,expected:control.candidateProfile});
check('ALL_DEPTH_MASKS_IDENTICAL',scenes.every((record)=>record.depthMaskIdentity===true),{failures:scenes.filter((record)=>!record.depthMaskIdentity).map((record)=>record.scene.id)});
check('ALL_FIXED_CAMERA_FRAMES_DETERMINISTIC',scenes.every((record)=>record.fixedFrameDeterministic===true),{failures:scenes.filter((record)=>!record.fixedFrameDeterministic).map((record)=>record.scene.id)});
check('LOW_DIFFERENTIATION_SCENE_COUNT_WITHIN_GATE',(result?.aggregates?.lowDifferentiationScenes?.length??99)<=control.gates.maximumLowDifferentiationScenes,{scenes:result?.aggregates?.lowDifferentiationScenes,maximum:control.gates.maximumLowDifferentiationScenes});
check('AGGREGATE_COLOR_GATE_PRESERVED',result.aggregates.candidateColorRatioVersusCp1>=control.gates.minimumAggregateColorRatioVersusCp1,{actual:result.aggregates.candidateColorRatioVersusCp1,minimum:control.gates.minimumAggregateColorRatioVersusCp1});
check('AGGREGATE_EDGE_GATE_PRESERVED',result.aggregates.candidateEdgeRatioVersusCp1>=control.gates.minimumAggregateEdgeRatioVersusCp1,{actual:result.aggregates.candidateEdgeRatioVersusCp1,minimum:control.gates.minimumAggregateEdgeRatioVersusCp1});
const retentionFailures=scenes.filter((record)=>record.colorRetention<control.gates.minimumAcceptedCp2PerSceneRetention||record.edgeRetention<control.gates.minimumAcceptedCp2PerSceneRetention);
check('ALL_SCENE_CP2_RETENTION_GATES_PASS',retentionFailures.length===0,{failures:retentionFailures.map((record)=>({id:record.scene.id,colorRetention:record.colorRetention,edgeRetention:record.edgeRetention}))});
const scene07=scenes.find((record)=>record.scene.id==='SCENE_07_MANOR_SITE_APPROACH');
const scene08=scenes.find((record)=>record.scene.id==='SCENE_08_CAVERN_RELATION_APPROACH');
check('SCENE_07_EXPLICIT_GATES_PASS',scene07?.candidate.metrics.sampledColorBucketCount>=control.gates.scene07MinimumColorBuckets&&scene07?.candidate.metrics.meanAdjacentChannelDifference>=control.gates.scene07MinimumEdgeSignal,{metrics:scene07?.candidate.metrics});
check('SCENE_08_EXPLICIT_GATE_PASS',scene08?.candidate.metrics.meanAdjacentChannelDifference>=control.gates.scene08MinimumEdgeSignal,{metrics:scene08?.candidate.metrics});
const regressionFailures=scenes.filter((record)=>control.regressionWitnesses.includes(record.scene.id)&&(record.colorRetention<0.9||record.edgeRetention<0.9));
check('SCENES_03_04_06_REGRESSION_PASS',regressionFailures.length===0,{failures:regressionFailures.map((record)=>({id:record.scene.id,colorRetention:record.colorRetention,edgeRetention:record.edgeRetention}))});
check('ANTI_REPETITION_AGGREGATE_GATE_PASS',result.aggregates.repetitionRatio<=control.gates.antiRepetitionAggregateMaximumRelativeToCp2,{actual:result.aggregates.repetitionRatio,maximum:control.gates.antiRepetitionAggregateMaximumRelativeToCp2});
const repetitionSceneFailures=scenes.filter((record)=>record.repetitionRatio>control.gates.antiRepetitionPerSceneMaximumRelativeToCp2||record.cp2.repetition.eligibleFraction<0.2||record.candidate.repetition.eligibleFraction<0.2);
check('ANTI_REPETITION_PER_SCENE_GATES_PASS',repetitionSceneFailures.length===0,{failures:repetitionSceneFailures.map((record)=>({id:record.scene.id,ratio:record.repetitionRatio,cp2Eligible:record.cp2.repetition.eligibleFraction,candidateEligible:record.candidate.repetition.eligibleFraction}))});
check('MOTION_REPLAY_DETERMINISTIC',result.motion.deterministicReplay===true,{motion:result.motion});
check('MEDIAN_PRESENTATION_RESPONSE_GATE_PASS',result.motion.medianRatio<=control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2,{actual:result.motion.medianRatio,maximum:control.gates.candidateMedianPresentationResponseMaximumRelativeToCp2});
check('P95_PRESENTATION_RESPONSE_GATE_PASS',result.motion.p95Ratio<=control.gates.candidateP95PresentationResponseMaximumRelativeToCp2,{actual:result.motion.p95Ratio,maximum:control.gates.candidateP95PresentationResponseMaximumRelativeToCp2});
check('WEBGL_CONTEXT_STABLE',result.contextLoss.cp2===0&&result.contextLoss.candidate===0&&result.receipts.cp2.context.lost===false&&result.receipts.candidate.context.lost===false,{contextLoss:result.contextLoss});
const candidateResources=result.receipts.candidate;
check('CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED',candidateResources.package.runtimeIdentity===result.receipts.cp2.package.runtimeIdentity&&candidateResources.package.runtimeContentDigest===result.receipts.cp2.package.runtimeContentDigest&&candidateResources.packageUploadedOnce===true&&candidateResources.resourceIdentityStable===true&&candidateResources.noPostInitializationResourceCreation===true&&candidateResources.noPostInitializationBufferUpload===true,{candidateResources});

const checkById=new Map(checks.map((record)=>[record.id,record]));
const rollbackIds=['EXACT_CP5_PATH_SCOPE','ISOLATED_CANDIDATE_IS_ONLY_PRODUCT_MUTATION','ACCEPTED_CP2_RENDERER_IMMUTABLE','LIVE_DEFAULT_HOST_UNCHANGED','LIVE_BINDING_UNCHANGED','CANDIDATE_SOURCE_HAS_NO_SCENE_CAMERA_OR_SCREEN_PATCH_HACKS','SCENES_03_04_06_REGRESSION_PASS','WEBGL_CONTEXT_STABLE','CANONICAL_PACKAGE_AND_GPU_LIFECYCLE_PRESERVED'];
const rollback=rollbackIds.some((id)=>checkById.get(id)?.passed===false);
const materialImprovement=result.aggregates.repetitionRatio<0.98;
const allPass=failures.length===0;
const disposition=allPass?'ROUND2_PASS_ENGINEERING':rollback?'ROUND2_REGRESSION_ROLLBACK':materialImprovement?'ROUND2_PARTIAL_IMPROVEMENT_REMAINS_BLOCKED':'ROUND2_NO_MATERIAL_IMPROVEMENT_STOP';
const receipt={
  receiptType:'H_EARTH_CP5_ROUND_2_EXECUTION_RECEIPT_v1',
  checkpoint:5,
  disposition,
  passEngineering:disposition==='ROUND2_PASS_ENGINEERING',
  baseHead:BASE,
  executedHead:head,
  startedAt,
  completedAt:new Date().toISOString(),
  changedPaths,
  acceptedRendererBlob:acceptedBlob,
  candidateSourceSha256:sha256(candidateSource),
  checks,
  failureCount:failures.length,
  failures,
  result,
  liveCandidateAuthorized:false,
  liveDefaultPromotionAuthorized:false,
  stoppingBoundary:disposition==='ROUND2_PASS_ENGINEERING'?'STOP_BEFORE_SEPARATE_LIVE_ADMISSION_AUTHORIZATION':'STOP_AT_ENGINEERING_DISPOSITION'
};
fs.writeFileSync(RECEIPT_PATH,`${JSON.stringify(receipt,null,2)}\n`);
console.log(JSON.stringify(receipt,null,2));
