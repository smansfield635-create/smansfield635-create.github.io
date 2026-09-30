#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {evaluateCausalCase,canonical,digest,RESULT_CLASSES,INPUT_SCHEMA,OUTPUT_SCHEMA} from '../../../../../tools/h-earth-map-wide-terrain/inter-hill-estate/causal-trace-evaluator.v2.mjs';

const BASE='h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/v2-causal-correction';
const GOV='6ca63ec4ba34b9c84e783aaaf5aa73c4604f4fb6';
const OP='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_002';
const SCOPE=OP+'_EXACT_13_PATH_SCOPE', LOCK_GENERATION=322;
const V1_HEAD='b935c204da2904e86f9c9c566bed0ac9b0de4193', V1_MERGE='25f6e9cd6caf1dba73552e81eaa8a23e1c393d5f';
const OUT='/tmp/h-earth-v2-causal-correction';
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(name,v)=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,name),JSON.stringify(stable(v),null,2)+'\n')};
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
const must=(v,code)=>{if(!v)throw Error(code)};
const clone=v=>structuredClone(v);

function staticState(){
  const request=read(`${BASE}/operation-request.v1.json`), procedure=read(`${BASE}/construction-procedure.v1.json`), manifest=read(`${BASE}/changed-path-manifest.v1.json`), rules=read(`${BASE}/causal-rules.v2.json`), fixtures=read(`${BASE}/fixtures.v2.json`), rollback=read(`${BASE}/rollback.v1.json`), inputSchema=read(`${BASE}/input-schema.v2.json`), outputSchema=read(`${BASE}/output-schema.v2.json`);
  must(request.operationId===OP&&request.exactGoverningHead===GOV&&request.lockScope===SCOPE,'REQUEST_IDENTITY_MISMATCH');
  must(procedure.exactGoverningHead===GOV&&procedure.exactTestRunnerCommand===request.exactTestCommand,'PROCEDURE_BINDING_MISMATCH');
  must(canonical(request.allowedPaths)===canonical(procedure.exactAllowedRepositoryPaths)&&canonical(request.allowedPaths)===canonical(manifest.expectedChangedPaths),'ADMITTED_PATH_SET_MISMATCH');
  must(request.allowedPaths.length===13&&manifest.pathCount===13&&manifest.pathMode==='ADDITIVE_ONLY','PATH_BOUNDARY_DECLARATION_MISMATCH');
  must(digest(request)==='6350927972358586aeb3c087d8b38e0b624b235dc94d99f63005d85ac3d17285','REQUEST_DIGEST_MISMATCH');
  must(digest(procedure)==='7acc25b3a9efb80871507dee2d5572460b56fe1d2bff0e9da6e29976fe545bdc','PROCEDURE_DIGEST_MISMATCH');
  must(rules.resultClasses.length===8&&RESULT_CLASSES.every(x=>rules.resultClasses.includes(x)),'RESULT_CLASS_SET_MISMATCH');
  must(fixtures.fixtureCount===16&&fixtures.fixtures.length===16&&new Set(fixtures.fixtures.map(x=>x.fixtureId)).size===16,'FIXTURE_SET_MISMATCH');
  must(rollback.paths.length===13&&!rollback.lockClosureAuthority&&!rollback.mergeAuthority,'ROLLBACK_BOUNDARY_MISMATCH');
  must(inputSchema.$id==='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_INPUT_v2'&&outputSchema.$id==='H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_OUTPUT_v2','SCHEMA_ID_MISMATCH');
  return {manifest,rules,fixtures,inputSchema,outputSchema};
}

function candidate(disposition='REJECTED_OTHER',status='PASS',id='C1'){
  return {candidateId:id,generated:true,finalDisposition:disposition,constraintEvaluations:[{ruleId:'MAX_SLOPE',status,evidenceRefs:[`MAX_SLOPE:${status}`]}],evidenceRefs:[`EVIDENCE:${id}`]};
}
function baseInput(id){
  return {schema:INPUT_SCHEMA,caseId:id,generation:{attempted:true,complete:true,candidateCount:0,searchDomainCoverage:1},observability:{inputsComplete:true,candidateTraceComplete:true,hardConstraintEvidenceComplete:true},evaluator:{executed:true,measurementSufficient:true,failureCode:null},candidates:[],passingArrangementCount:0,proofs:{terrainInfeasibility:null,estateInfeasibility:null}};
}
export function buildCase(spec){
  const x=baseInput(spec.fixtureId), s=spec.scenario;
  if(s==='REJECTED_OTHER'){x.candidates=[candidate()];x.generation.candidateCount=1}
  if(s==='HARD_REJECTION'){x.candidates=[candidate('REJECTED_HARD_CONSTRAINT','FAIL')];x.generation.candidateCount=1}
  if(s==='INPUT_LIMIT')x.observability.inputsComplete=false;
  if(s==='MEASUREMENT_LIMIT'){x.evaluator.measurementSufficient=false;x.evaluator.failureCode='MEASUREMENT_NOT_SUFFICIENT'}
  if(s==='TERRAIN_PROOF')x.proofs.terrainInfeasibility={complete:true,exhaustive:true,allTerrainStatesRejected:true,estateModelIndependent:true,evidenceRefs:['TERRAIN:EXHAUSTIVE'],ruleId:'TERRAIN_INFEASIBILITY_EXHAUSTIVE_PROOF'};
  if(s==='ESTATE_PROOF')x.proofs.estateInfeasibility={complete:true,exhaustive:true,terrainFeasible:true,allEstateConfigurationsRejected:true,evidenceRefs:['ESTATE:EXHAUSTIVE'],ruleId:'ESTATE_INFEASIBILITY_EXHAUSTIVE_PROOF'};
  if(s==='FEASIBLE'){x.candidates=[candidate('PASS')];x.generation.candidateCount=1;x.passingArrangementCount=1}
  if(s==='GENERATION_INCOMPLETE')x.generation.complete=false;
  if(s==='TERRAIN_PROOF_INCOMPLETE'){x.observability.inputsComplete=false;x.proofs.terrainInfeasibility={complete:false,exhaustive:false,allTerrainStatesRejected:true,estateModelIndependent:true,evidenceRefs:['TERRAIN:PARTIAL'],ruleId:'TERRAIN_INFEASIBILITY_EXHAUSTIVE_PROOF'}}
  if(s==='ESTATE_PROOF_INCOMPLETE'){x.observability.inputsComplete=false;x.proofs.estateInfeasibility={complete:true,exhaustive:false,terrainFeasible:true,allEstateConfigurationsRejected:true,evidenceRefs:['ESTATE:PARTIAL'],ruleId:'ESTATE_INFEASIBILITY_EXHAUSTIVE_PROOF'}}
  if(s==='UNKNOWN_CONSTRAINT'){x.candidates=[candidate('UNEVALUABLE','UNKNOWN')];x.generation.candidateCount=1;x.observability.hardConstraintEvidenceComplete=false}
  if(s==='EVALUATOR_NOT_EXECUTED'){x.evaluator.executed=false;x.evaluator.measurementSufficient=false;x.evaluator.failureCode='EXECUTION_NOT_OBSERVED'}
  if(s==='FEASIBLE_WITH_REJECT'){x.candidates=[candidate('PASS','PASS','C1'),candidate('REJECTED_HARD_CONSTRAINT','FAIL','C2')];x.generation.candidateCount=2;x.passingArrangementCount=1}
  if(s==='V1_ZERO_PASS_LIMIT'){x.evaluator.measurementSufficient=false;x.evaluator.failureCode='V1_DOES_NOT_EMIT_PER_CANDIDATE_CAUSAL_TRACES'}
  return x;
}
function validateOutput(o,schema){
  must(o.schema===OUTPUT_SCHEMA&&RESULT_CLASSES.includes(o.resultClass),'OUTPUT_IDENTITY_INVALID');
  must(schema.required.every(k=>Object.hasOwn(o,k)),'OUTPUT_REQUIRED_FIELD_MISSING');
  must(/^[0-9a-f]{64}$/.test(o.outputDigest),'OUTPUT_DIGEST_INVALID');
  must(o.zeroPassNonInference.pass===true&&!o.zeroPassNonInference.terrainInfeasibilityInferredFromZero&&!o.zeroPassNonInference.estateInfeasibilityInferredFromZero,'ZERO_PASS_GUARD_INVALID');
  must(o.causalTraces.every(t=>t.candidateId&&t.causalDisposition&&Array.isArray(t.constraintEvaluations)&&Array.isArray(t.evidenceRefs)),'CAUSAL_TRACE_INVALID');
}

function verifyGit(manifest){
  const head=git('rev-parse','HEAD'), parent=git('rev-parse','HEAD^');must(parent===GOV,'CANDIDATE_PARENT_NOT_GOVERNING_HEAD');
  const actual=git('diff','--name-only',`${GOV}..${head}`).split(/\r?\n/).filter(Boolean).sort(), expected=[...manifest.expectedChangedPaths].sort();
  must(canonical(actual)===canonical(expected),'EXACT_13_PATH_BOUNDARY_MISMATCH');
  const status=git('diff','--name-status',`${GOV}..${head}`).split(/\r?\n/).filter(Boolean);must(status.length===13&&status.every(x=>x.startsWith('A\t')),'CANDIDATE_NOT_ADDITIVE_ONLY');
  const forbidden=actual.filter(p=>p.startsWith('h-earth-3d/terrain/')||p.startsWith('showroom/globe/h-earth/')||p.startsWith('h-earth-3d/runtime/')||p.includes('manor')||p==='.github/operation-intake/active-operation-ledger.v1.json'||p==='tools/operation-intake/repository-operation-lock-manager.v1.mjs');must(!forbidden.length,'PROHIBITED_PATH_MUTATION');
  const receipt={schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_PATH_BOUNDARY_RECEIPT_v1',result:'PASS',governingHead:GOV,candidateHead:head,commitCount:Number(git('rev-list','--count',`${GOV}..${head}`)),changedPathCount:13,addedPathCount:13,modifiedPathCount:0,deletedPathCount:0,changedPaths:actual,additiveOnly:true,prohibitedMutationCount:0};must(receipt.commitCount===1,'COMMIT_COUNT_NOT_ONE');write('path-boundary-receipt.json',receipt);return receipt;
}
function verifyV1(candidateHead){
  const critical=['h-earth-3d/validation/h-earth.inter-hill-estate-successor-evaluator.mjs','tools/h-earth-map-wide-terrain/inter-hill-estate/successor-evaluator.v1.mjs','h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/output-schema.v1.json'];
  const changed=critical.filter(p=>git('rev-parse',`${GOV}:${p}`)!==git('rev-parse',`${candidateHead}:${p}`));must(!changed.length,'V1_CRITICAL_IDENTITY_MUTATION');
  const r={schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V1_PRESERVATION_RECEIPT_v1',result:'PASS',v1EvaluatorHead:V1_HEAD,v1MergeCommit:V1_MERGE,comparisonBase:GOV,candidateHead,criticalIdentityPathCount:critical.length,changedCriticalIdentityPathCount:0,exactCandidateBoundaryAdditiveOnly:true,existingPathMutationCount:0,v1Rewritten:false,v1Reinterpreted:false,productMutation:false,terrainMutation:false,liveEnvironmentMutation:false,manorMutation:false};write('v1-preservation-receipt.json',r);return r;
}
async function verifyLock(){
  const token=process.env.GITHUB_TOKEN, repo=process.env.GITHUB_REPOSITORY||'smansfield635-create/smansfield635-create.github.io';must(token,'GITHUB_TOKEN_REQUIRED');
  const url=`https://api.github.com/repos/${repo}/contents/.github/operation-intake/active-operation-ledger.v1.json?ref=${encodeURIComponent('operation-locks/repository-operation-intake-v1')}`;
  const response=await fetch(url,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}});must(response.ok,`LOCK_LEDGER_FETCH_FAILED_${response.status}`);
  const file=await response.json(), ledger=JSON.parse(Buffer.from(String(file.content).replace(/\s/g,''),'base64').toString('utf8'));
  const active=Object.values(ledger.activeScopes||{}).find(x=>x.operationId===OP&&x.lockScope===SCOPE&&x.lockGeneration===LOCK_GENERATION);must(active&&active.state==='ADMITTED_LOCKED'&&!active.released&&active.governingHead===GOV,'ACTIVE_LOCK_322_IDENTITY_MISMATCH');
  return {result:'PASS',operationId:OP,lockScope:SCOPE,lockGeneration:LOCK_GENERATION,state:active.state,released:active.released,governingHead:active.governingHead,ledgerBlob:file.sha};
}
function verifyFixtures(fixtures,outputSchema){
  const execute=()=>fixtures.fixtures.map(spec=>{const input=buildCase(spec),output=evaluateCausalCase(clone(input));validateOutput(output,outputSchema);return {fixtureId:spec.fixtureId,scenario:spec.scenario,expectedResultClass:spec.expectedResultClass,observedResultClass:output.resultClass,assertions:spec.assertions||{},output,pass:output.resultClass===spec.expectedResultClass}});
  const a=execute(),b=execute();must(canonical(a)===canonical(b),'DETERMINISTIC_RERUN_FAILURE');must(a.every(x=>x.pass),'CAUSAL_FIXTURE_CLASSIFICATION_FAILURE');
  const invalid=baseInput('INVALID_SCHEMA_CONTROL');delete invalid.generation;let invalidRejected=false;try{evaluateCausalCase(invalid)}catch(e){invalidRejected=e.code==='INVALID_INPUT'}must(invalidRejected,'INVALID_INPUT_SCHEMA_CONTROL_NOT_REJECTED');
  const covered=new Set(a.map(x=>x.observedResultClass));must(RESULT_CLASSES.every(x=>covered.has(x)),'ALL_EIGHT_RESULT_CLASSES_NOT_EXERCISED');
  for(const x of a){const q=x.assertions;if(q.noInfeasibilityClaim)must(!x.output.infeasibilityClaims.terrain.asserted&&!x.output.infeasibilityClaims.estate.asserted,'UNSUPPORTED_INFEASIBILITY');if(q.terrainClaim!==undefined)must(x.output.infeasibilityClaims.terrain.asserted===q.terrainClaim,'TERRAIN_CLAIM_MISMATCH');if(q.estateClaim!==undefined)must(x.output.infeasibilityClaims.estate.asserted===q.estateClaim,'ESTATE_CLAIM_MISMATCH');if(q.inferenceState)must(x.output.inferenceState===q.inferenceState,'INFERENCE_STATE_MISMATCH');if(q.traceCount!==undefined)must(x.output.causalTraces.length===q.traceCount,'TRACE_COUNT_MISMATCH')}
  const result={schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_FIXTURE_RESULTS_v1',result:'PASS',fixtureCount:a.length,passedFixtureCount:a.length,failedFixtureCount:0,invalidInputControl:'REJECTED',resultClassCoverage:[...covered].sort(),allEightResultClassesCovered:true,zeroPassNonInferenceResult:'PASS',terrainInfeasibilityTestResult:'PASS',estateInfeasibilityTestResult:'PASS',missingEvidenceTestResult:'PASS',v1ZeroPassCausalLimitResult:'PASS',fixtureResults:a.map(x=>({fixtureId:x.fixtureId,scenario:x.scenario,expectedResultClass:x.expectedResultClass,observedResultClass:x.observedResultClass,outputDigest:x.output.outputDigest,causalTraceCount:x.output.causalTraces.length,terrainInfeasibilityAsserted:x.output.infeasibilityClaims.terrain.asserted,estateInfeasibilityAsserted:x.output.infeasibilityClaims.estate.asserted,pass:x.pass}))};write('fixture-results.json',result);
  const determinism={schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_DETERMINISM_RECEIPT_v1',result:'PASS',rerunAsha256:sha256(Buffer.from(canonical(a))),rerunBsha256:sha256(Buffer.from(canonical(b))),byteEquivalentCanonicalOutputs:true,fixtureCount:a.length};write('determinism-receipt.json',determinism);return {result,determinism};
}
async function main(){
  const {manifest,rules,fixtures,outputSchema}=staticState(),pathReceipt=verifyGit(manifest),v1=verifyV1(pathReceipt.candidateHead),lock=await verifyLock(),fx=verifyFixtures(fixtures,outputSchema);
  const causalRulesDigest=digest(rules),fixtureResultsDigest=digest(fx.result),deterministicRerunDigest=digest(fx.determinism),v1PreservationDigest=digest(v1);
  const fingerprint=digest({exactGoverningHead:GOV,operationId:OP,lockScope:SCOPE,allowedPaths:manifest.expectedChangedPaths,causalRulesDigest,fixtureResultsDigest,deterministicRerunDigest,v1PreservationDigest,candidateHead:pathReceipt.candidateHead});
  const receipt={schema:'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_VERIFICATION_RECEIPT_v1',result:'PASS',operationId:OP,exactGoverningHead:GOV,candidateHead:pathReceipt.candidateHead,lockIdentity:lock,pathBoundary:pathReceipt,causalEvaluatorResult:'PASS',fixtureCount:fx.result.fixtureCount,fixturePassCount:fx.result.passedFixtureCount,causalResultClassCount:8,zeroPassNonInferenceResult:'PASS',terrainInfeasibilityTestResult:'PASS',estateInfeasibilityTestResult:'PASS',missingEvidenceTestResult:'PASS',deterministicRerunResult:'PASS',v1PreservationResult:'PASS',productMutation:false,terrainMutation:false,liveEnvironmentMutation:false,manorMutation:false,mergeExecuted:false,fingerprintDomain:OP,fingerprint};write('verification-receipt.json',receipt);process.stdout.write(JSON.stringify(stable(receipt),null,2)+'\n');
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);if(invoked)main().catch(e=>{console.error(e.stack||e.message);process.exit(1)});
