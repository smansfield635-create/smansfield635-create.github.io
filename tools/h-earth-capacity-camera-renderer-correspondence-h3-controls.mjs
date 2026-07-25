import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { executeH2Observation } from './h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs';
import { digest, fail, freeze, executeSweepSet, createReferenceLattice, executeProfileSweep } from './h-earth-capacity-camera-renderer-correspondence-h3-engine.mjs';

const here=dirname(fileURLToPath(import.meta.url));
export const H3_CONTRACT=freeze(JSON.parse(await readFile(resolve(here,'h-earth-capacity-camera-renderer-correspondence-h3-contract.json'),'utf8')));

export function validateH3Contract(candidate=H3_CONTRACT) {
  if (candidate.contractId!==H3_CONTRACT.contractId) fail('H3_CONTRACT_ID_MISMATCH');
  if (candidate.parentCheckpointCommit!=='6a958e5fc7971ce80e3561e2c0cd32b8c600793c') fail('H3_PARENT_CHECKPOINT_COMMIT_MISMATCH');
  if (candidate.sourceCommit!=='ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e') fail('H3_SOURCE_COMMIT_MISMATCH');
  if (candidate.sourcePosture!=='READ_ONLY_MATHEMATICAL_SWEEP' || candidate.productionMutationAuthority!=='NONE') fail('H3_AUTHORITY_BOUNDARY_INVALID');
  if (candidate.sampleModel.columns*candidate.sampleModel.rows!==4225 || candidate.sampleModel.totalSamples!==4225) fail('H3_SAMPLE_MODEL_INVALID');
  if (!Array.isArray(candidate.viewportProfiles)||candidate.viewportProfiles.length!==3) fail('H3_PROFILE_COUNT_INVALID');
  const claims=candidate.claims;
  if (claims.rendererExecutionAuthorized!==false||claims.downstreamCapacityEvaluationAuthorized!==false||claims.productionFilesChanged!==0||claims.productionCorrectionStarted!==false||claims.h4Started!==false||claims.mergePerformed!==false) fail('H3_STOP_BOUNDARY_VIOLATION');
  return true;
}

const cameraFromFacts=facts=>({position:facts.camera.position,target:facts.camera.target,up:facts.camera.up,verticalFovDegrees:facts.camera.verticalFovDegrees,nearPlane:facts.camera.nearPlane,farPlane:facts.camera.farPlane});

async function actualInputs(repositoryRoot) {
  const h2=await executeH2Observation({repositoryRoot});
  const previewModule=await import(pathToFileURL(resolve(repositoryRoot,'showroom/globe/h-earth/render/shoreline-preview.js')).href);
  const preview=previewModule.previewHEarthMinimumShorelineGeometry({requestId:'H3_DETERMINISTIC_REFERENCE_LATTICE'});
  if (preview?.ok!==true || !preview.bounds) fail('H3_MINIMUM_SHORELINE_PREVIEW_UNAVAILABLE',{status:preview?.status});
  return {h2,bounds:preview.bounds,camera:cameraFromFacts(h2.productionFacts),sourceObjectIds:preview.sourceObjectIds};
}

export async function executeH3Controls({repositoryRoot=resolve(here,'..')}={}) {
  validateH3Contract();
  const inputs=await actualInputs(repositoryRoot);
  const controls=[];
  const pass=(id,operation,predicate=value=>Boolean(value))=>{try{const result=operation();controls.push({id,status:predicate(result)?'PASS':'FAIL',expected:'PASS',result});}catch(error){controls.push({id,status:'FAIL',expected:'PASS',actual:error.code??error.name});}};
  const failClosed=(id,expected,operation)=>{try{operation();controls.push({id,status:'FAIL',expected,actual:'NO_ERROR'});}catch(error){controls.push({id,status:error.code===expected?'PASS':'FAIL',expected,actual:error.code??error.name});}};
  const sweep=executeSweepSet({bounds:inputs.bounds,sampleModel:H3_CONTRACT.sampleModel,camera:inputs.camera,profiles:H3_CONTRACT.viewportProfiles});
  pass('ACTUAL_THREE_PROFILE_PRODUCTION_SWEEP',()=>sweep,value=>value.profileResults.length===3&&value.profileResults.every(result=>result.counts.totalSamples===4225));
  pass('DESKTOP_LANDSCAPE_EXECUTED',()=>sweep.profileResults.find(result=>result.profile.profileId==='DESKTOP_LANDSCAPE'),value=>value?.counts.totalSamples===4225);
  pass('MOBILE_PORTRAIT_EXECUTED',()=>sweep.profileResults.find(result=>result.profile.profileId==='MOBILE_PORTRAIT'),value=>value?.counts.totalSamples===4225);
  pass('COMPACT_MOBILE_EXECUTED',()=>sweep.profileResults.find(result=>result.profile.profileId==='COMPACT_MOBILE'),value=>value?.counts.totalSamples===4225);
  pass('DETERMINISTIC_REPEAT_DIGEST',()=>{const repeated=executeSweepSet({bounds:inputs.bounds,sampleModel:H3_CONTRACT.sampleModel,camera:inputs.camera,profiles:H3_CONTRACT.viewportProfiles});return {first:sweep.deterministicReceiptSha256,second:repeated.deterministicReceiptSha256,identical:sweep.deterministicReceiptSha256===repeated.deterministicReceiptSha256};},value=>value.identical===true);
  const lattice=createReferenceLattice(inputs.bounds,H3_CONTRACT.sampleModel);
  pass('SHORT_FAR_PLANE_CONTROL_CLASSIFIED',()=>executeProfileSweep({lattice,camera:{...inputs.camera,farPlane:32},profile:H3_CONTRACT.viewportProfiles[0]}),value=>value.counts.farClippedSamples>0);
  pass('LARGE_NEAR_PLANE_CONTROL_CLASSIFIED',()=>executeProfileSweep({lattice,camera:{...inputs.camera,nearPlane:inputs.camera.farPlane-1},profile:H3_CONTRACT.viewportProfiles[0]}),value=>value.counts.nearClippedSamples>0);
  failClosed('INVALID_BOUNDS_FAIL_CLOSED','H3_BOUNDS_ORDER_INVALID',()=>createReferenceLattice({minimum:{x:1,y:0,z:0},maximum:{x:-1,y:0,z:1}},H3_CONTRACT.sampleModel));
  failClosed('INVALID_PROFILE_FAIL_CLOSED','H3_VIEWPORT_PROFILE_VALUE_INVALID',()=>executeProfileSweep({lattice,camera:inputs.camera,profile:{profileId:'INVALID',widthPx:0,heightPx:900,devicePixelRatio:1}}));
  failClosed('DEGENERATE_CAMERA_BASIS_FAIL_CLOSED','H3_CAMERA_FORWARD_DEGENERATE',()=>executeProfileSweep({lattice,camera:{...inputs.camera,target:inputs.camera.position},profile:H3_CONTRACT.viewportProfiles[0]}));
  const failed=controls.filter(control=>control.status!=='PASS');
  const body={contractId:'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H3_CONTROL_RECEIPT_v1',toolId:H3_CONTRACT.toolId,checkpoint:'H3',status:failed.length===0?'PASS':'FAIL',controlCount:controls.length,passedControlCount:controls.length-failed.length,failedControlCount:failed.length,sourceCommit:H3_CONTRACT.sourceCommit,sourceObjectIds:inputs.sourceObjectIds,sweep,controls,claims:{sweepEngineExecutable:failed.length===0,desktopProfileExecuted:controls[1]?.status==='PASS',mobileProfileExecuted:controls[2]?.status==='PASS',compactMobileProfileExecuted:controls[3]?.status==='PASS',sampleGauge4225Executed:controls.slice(1,4).every(control=>control.status==='PASS'),repeatRunDigestIdentical:controls[4]?.status==='PASS',rendererExecutionPerformed:false,downstreamCapacityEvaluationPerformed:false,productionFilesChanged:0,productionCorrectionStarted:false,h4Started:false,mergePerformed:false}};
  return freeze({...body,deterministicReceiptSha256:digest(body)});
}

const direct=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(direct){const receipt=await executeH3Controls();console.log(JSON.stringify(receipt,null,2));if(receipt.status!=='PASS')process.exitCode=1;}
