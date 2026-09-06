#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-contract.v1.json';
const OUTPUT=process.argv.includes('--output') ? process.argv[process.argv.indexOf('--output')+1] : null;
const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const failures=[];
const checks=[];
const check=(id,pass,detail=null)=>{checks.push({id,pass,detail});if(!pass)failures.push(id);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(ref,path)=>git('rev-parse',`${ref}:${path}`);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V0_V3_CONTRACT_v1');
check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
check('LOCK_GENERATION',contract.lockGeneration===1956);
check('EXACT_GOVERNING_HEAD',contract.exactGoverningHead==='fa87b2594a9ac43390ed5b657064ffbfd94a06ea');
check('STAGE_ORDER',JSON.stringify(contract.stageOrder)===JSON.stringify([
  'V0_BASELINE_AND_CONTRACT_FREEZE',
  'V1_CANONICAL_ECOLOGY_EXPOSURE',
  'V2_DEVICE_INVARIANT_CANONICAL_POPULATION',
  'V3_CAMERA_TRUE_INSTANCED_LOD'
]));

const requiredLaws=[
  'GEOGRAPHY_DETERMINES_EXISTENCE',
  'RENDERER_DETERMINES_REPRESENTATION',
  'DEVICE_CLASS_MUST_NOT_CHANGE_CANONICAL_POPULATION',
  'CAMERA_MUST_NOT_CHANGE_CANONICAL_POPULATION',
  'LOD_CHANGES_SAMPLING_DENSITY_NOT_GEOGRAPHIC_STATE',
  'CLOUD_SYSTEM_OUT_OF_SCOPE'
];
for(const law of requiredLaws)check(`LAW:${law}`,contract.laws.includes(law));

for(const [path,expected] of Object.entries(contract.v0.sourceIdentity)){
  let governing=null,current=null;
  try{governing=blob(contract.exactGoverningHead,path);current=blob('HEAD',path);}catch(error){failures.push(`SOURCE_MISSING:${path}`);checks.push({id:`SOURCE:${path}`,pass:false,detail:String(error.message)});continue;}
  check(`GOVERNING_SOURCE_IDENTITY:${path}`,governing===expected,{expected,governing});
  check(`V0_SOURCE_UNCHANGED:${path}`,current===expected,{expected,current});
}

const forest=fs.readFileSync('characters/forest-system.mjs','utf8');
check('BASELINE_DESKTOP_TARGET_420',/desktop:Object\.freeze\(\{target:420\b/.test(forest));
check('BASELINE_MOBILE_TARGET_190',/mobile:Object\.freeze\(\{target:190\b/.test(forest));
check('BASELINE_DEVICE_DEPENDENT_GENERATION',/const target=FOREST_BUDGETS\[compact\?'mobile':'desktop'\]\.target/.test(forest));
check('BASELINE_GENERATION_TIME_LOD',/\blod\s*=\s*lodRoll/.test(forest)||/lodRoll/.test(forest));
check('BASELINE_CANOPY_BLOB_PRESENT',/function canopyBlob\s*\(/.test(forest));

const cameraStates=contract.v0.referenceCameraMatrix.states;
for(const required of ['ORBIT','CROSSING','WATCHFIRE_OVERLOOK','WATERLINE_STATION','MIRROR_MANOR','SIGNAL_LANTERN_FIELD','RESTORATION_BOUNDARY','AUREN_LOCAL','JEEVES_LOCAL','BEYOND_MANOR'])check(`CAMERA_STATE:${required}`,cameraStates.includes(required));
check('VIEWPORT_CLASS_COUNT',contract.v0.referenceCameraMatrix.viewportClasses.length===3);
check('REDUCED_MOTION_MATRIX',JSON.stringify(contract.v0.referenceCameraMatrix.reducedMotion)===JSON.stringify([false,true]));
check('PERFORMANCE_POLICY_FROZEN',contract.v0.performanceBudget.policy==='BASELINE_RELATIVE_NO_REGRESSION');
check('REPRODUCIBILITY_TWO_RUNS',contract.v0.reproducibility.requiredRuns===2);
check('CLOUD_PROTECTED',contract.protected.includes('characters/cloud-system.mjs'));
check('GEOGRAPHY_PROTECTED',contract.protected.includes('h-earth-3d/'));
check('V4_PLUS_BLOCKED',contract.failureSemantics.v4PlusBlockedUntilAggregatePass===true);
check('STAGE_FAILURE_BLOCKS_ADVANCE',contract.failureSemantics.stageFailureBlocksAdvance===true);
check('ACCEPTANCE_IMMUTABLE',contract.failureSemantics.acceptanceCriteriaMayNotBeRelaxed===true);

const baselineIdentity={
  exactGoverningHead:contract.exactGoverningHead,
  sourceIdentity:contract.v0.sourceIdentity,
  publishedPredecessorFacts:contract.v0.publishedPredecessorFacts,
  referenceCameraMatrix:contract.v0.referenceCameraMatrix,
  performanceBudget:contract.v0.performanceBudget,
  laws:contract.laws
};
const baselineDigest=sha256(JSON.stringify(baselineIdentity));
const pass=failures.length===0;
const receipt={
  schema:'MIRRORLAND_VEGETATION_V0_V3_AGGREGATE_RECEIPT_v1',
  operationId:contract.operationId,
  exactGoverningHead:contract.exactGoverningHead,
  candidateHead:git('rev-parse','HEAD'),
  currentStage:'V0_BASELINE_AND_CONTRACT_FREEZE',
  result:pass?'V0_BASELINE_PASS_CLOSED':'FAIL_CLOSED',
  stageResults:{
    V0:pass?'V0_BASELINE_PASS_CLOSED':'FAIL_CLOSED',
    V1:'PENDING',V2:'PENDING',V3:'PENDING',aggregate:'PENDING'
  },
  baselineDigest,
  reproducibilityKey:baselineDigest,
  checkCount:checks.length,
  passCount:checks.filter(x=>x.pass).length,
  failCount:failures.length,
  failures,
  checks,
  downstreamStageAuthorized:pass?'V1_CANONICAL_ECOLOGY_EXPOSURE':null,
  v4PlusAuthorized:false,
  mergeDeploymentPublicationAuthorized:false
};
const text=JSON.stringify(receipt,null,2)+'\n';
if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
if(!pass)process.exitCode=1;
