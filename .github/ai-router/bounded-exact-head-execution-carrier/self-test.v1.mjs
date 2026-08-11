#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  stable, hashObject, validateRequest, validateAndResolve,
  makePageArchitectureBundle, makePageImplementationBundle, executeResolved
} from './carrier.v1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SELF_TEST_REPO_PATH = '.github/ai-router/bounded-exact-head-execution-carrier/self-test.v1.mjs';
const REGISTRY_PATH = '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json';
const TOOLSET_PATH = '.github/ai-router/page-excellence-toolchain/toolset.bundle.v1.json';
const registry = JSON.parse(fs.readFileSync(path.join(ROOT,REGISTRY_PATH),'utf8'));
const toolset = JSON.parse(fs.readFileSync(path.join(ROOT,TOOLSET_PATH),'utf8'));
const ARCH='PAGE_EXCELLENCE_ARCHITECTURE_FROM_CANONICAL_OPERATION_V1';
const IMPL='PAGE_EXCELLENCE_IMPLEMENTATION_FROM_CANONICAL_OPERATION_V1';
const REQUIRED_IMPLEMENTATION_FINDINGS=[
  'CONTEXTUAL_ARCHITECTURE_BINDING_PRESERVED','SEMANTIC_MARKUP','FOCUS_MANAGEMENT','KEYBOARD_MODEL','STATE_RECOVERY','BUNDLE_STRUCTURE','RENDERING_STRATEGY','SEARCH_AND_GRAPH_COMPLEXITY','DEVICE_LAYOUT_RULES'
];
const clone=v=>JSON.parse(JSON.stringify(v));
const nonce=(c='a')=>c.repeat(64);
const git=(args,cwd=ROOT)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024}).trim();
const executionHead=()=>git(['rev-parse','HEAD^{commit}']);
function assertClean(cwd){const s=git(['status','--porcelain=v1','--untracked-files=all'],cwd);if(s!=='')throw new Error(`WORKTREE_NOT_CLEAN:${s}`);}
function pullRequestHeadFromEvent(){if(process.env.CARRIER_EXACT_HEAD_REEXEC==='1'||process.env.GITHUB_EVENT_NAME!=='pull_request'||!process.env.GITHUB_EVENT_PATH)return null;const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));const head=event?.pull_request?.head?.sha??null;if(head==null)return null;if(!/^[0-9a-f]{40}$/.test(head))throw new Error(`PR_HEAD_INVALID:${head}`);return head;}
function runExactHeadReexecution(head){
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'carrier-impl-exact-')),worktree=path.join(temp,'worktree'),output=path.join(temp,'self-test.json');let added=false;
  try{
    cp.execFileSync('git',['cat-file','-e',`${head}^{commit}`],{cwd:ROOT,stdio:'ignore'});
    cp.execFileSync('git',['worktree','add','--detach',worktree,head],{cwd:ROOT,stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});added=true;
    if(git(['rev-parse','HEAD^{commit}'],worktree)!==head)throw new Error('EXACT_HEAD_CHECKOUT_MISMATCH');assertClean(worktree);
    cp.execFileSync(process.execPath,[SELF_TEST_REPO_PATH,'--output',output],{cwd:worktree,env:{...process.env,CARRIER_EXACT_HEAD_REEXEC:'1'},shell:false,stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
    assertClean(worktree);const r=JSON.parse(fs.readFileSync(output,'utf8'));
    if(r.result!=='PASS'||r.executionHead!==head||r.passed!==r.total||r.nativeRegressionPassCount!==r.nativeRegressionCount)throw new Error('EXACT_HEAD_SELF_TEST_NONPASS');
    return stable({result:'PASS',requestedHead:head,observedHead:head,fixturePassCount:r.passed,fixtureCount:r.total,nativeRegressionPassCount:r.nativeRegressionPassCount,nativeRegressionCount:r.nativeRegressionCount,workingTreeCleanBeforeAndAfter:true});
  }finally{if(added){try{cp.execFileSync('git',['worktree','remove','--force',worktree],{cwd:ROOT,stdio:'ignore'});}catch{}}fs.rmSync(temp,{recursive:true,force:true});}
}
function makeAdmission(op,generation,scopeHash){return{schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',result:'ADMITTED_AND_LOCKED',operationId:op.operationId,projectId:op.projectId,operationStarted:true,workflowExecutionAuthorized:true,requestDigest:'0'.repeat(64),procedureLocatorDigest:'0'.repeat(64),lock:{lockAcquired:true,lockGeneration:generation,lockScope:op.lockScope,operationId:op.operationId,scopeHash}};}
function finalize(op,procedure,admission,generation,scopeHash){
  const requestDigest=hashObject(op),procedureDigest=hashObject(procedure);admission.requestDigest=requestDigest;admission.procedureLocatorDigest=procedureDigest;
  return{activeScopes:{[scopeHash]:{operationId:op.operationId,lockGeneration:generation,lockScope:op.lockScope,state:'ADMITTED_LOCKED',released:false,requestDigest,procedureLocatorDigest:procedureDigest}}};
}
function wrap(op,procedure,descriptorId,generation=1001,scopeHash='6'.repeat(64),n='a'){
  const admission=makeAdmission(op,generation,scopeHash),ledger=finalize(op,procedure,admission,generation,scopeHash);
  return{request:{schema:'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',requestId:`REQ_${n}`,descriptorId,operationRequest:op,constructionProcedure:procedure,admissionReceipt:admission,requestNonce:nonce(n)},ledger};
}
function rehash(fixture){const a=fixture.request.admissionReceipt,g=a.lock.lockGeneration,s=a.lock.scopeHash;a.operationId=fixture.request.operationRequest.operationId;a.projectId=fixture.request.operationRequest.projectId;a.lock.operationId=a.operationId;a.lock.lockScope=fixture.request.operationRequest.lockScope;fixture.ledger=finalize(fixture.request.operationRequest,fixture.request.constructionProcedure,a,g,s);return fixture;}
function architectureFindings(){
  return{schema:'CONTEXTUAL_ARCHITECTURE_FINDINGS_v1',implementationClass:'EXISTING_CONSTRUCT_ADOPTION',classificationRationale:'Synthetic exact-source adoption for carrier conformance.',existingConstructSearch:{executed:true,searchedScopes:['laws/source.js@3333333333333333333333333333333333333333'],candidates:['GENERIC_SOURCE']},exactSourceConstructIdentities:[{sourceId:'GENERIC_SOURCE',path:'laws/source.js',commitSha:'3'.repeat(40),gitBlobSha:'4'.repeat(40),adoptionDisposition:'ADOPT_IMPLEMENTATION_SOURCE'}],adoptionMatrix:[{sourceId:'GENERIC_SOURCE',sourceRelation:'IMPLEMENTATION_SOURCE',adoptedCapabilities:['REAL_BROWSER_RUNTIME'],adaptations:['BOUND_TO_SUBJECT'],exclusions:['SOURCE_SEMANTICS']}],visualArchitectureAuthority:{authorityHolder:'EXISTING_SOURCE_CONSTRUCTS_WITH_BOUNDED_ADAPTER',contentAdapterMayDefineVisualArchitecture:false},prohibitedSubstituteArchitectures:['PSEUDO_SPATIAL_CAROUSEL'],requiredRuntimeConditions:['REAL_BROWSER_RUNTIME','PRIMARY_DIRECT_MANIPULATION'],separateNewConstructAuthority:null};
}
function implementationFindings(){
  return{schema:'PAGE_EXCELLENCE_IMPLEMENTATION_FINDINGS_v1',findings:Object.fromEntries(REQUIRED_IMPLEMENTATION_FINDINGS.map(k=>[k,{result:'PASS',evidence:[`SYNTHETIC_${k}_EVIDENCE`]}]))};
}
function genericFixture(kind=ARCH){
  const findings=architectureFindings(),subject='2'.repeat(40),opId=kind===ARCH?'SYNTHETIC_ARCH_OPERATION':'SYNTHETIC_IMPL_OPERATION';
  const subjectIdentity={experimentId:'synthetic_page_operation_v1',pageOperationSubjectHead:subject,existingConstructSearchSources:[{commitSha:'3'.repeat(40),files:[{path:'laws/source.js',gitBlobSha:'4'.repeat(40)}]}],pageArchitectureFindings:findings};
  if(kind===IMPL){
    subjectIdentity.pageImplementationFindings=implementationFindings();
    subjectIdentity.pageArchitectureContinuity={schema:'PAGE_EXCELLENCE_ARCHITECTURE_CONTINUITY_v1',priorOperationId:'SYNTHETIC_ARCH_OPERATION',priorDescriptorId:ARCH,subjectHead:subject,architectureReceiptDigest:hashObject({descriptorId:ARCH,operationId:'SYNTHETIC_ARCH_OPERATION',subjectHead:subject,findings}),nativeReceiptDigest:'e'.repeat(64)};
  }
  const op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:opId,projectId:'LAWS',lockScope:`SYNTHETIC:${kind}`,exactGoverningHead:'1'.repeat(40),subjectIdentity,allowedPaths:['laws/example/a.js']};
  const procedure={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:`PROC_${kind}`,exactGoverningHead:op.exactGoverningHead,exactAllowedRepositoryPaths:[...op.allowedPaths]};
  return wrap(op,procedure,kind,kind===ARCH?1001:1002,kind===ARCH?'6'.repeat(64):'5'.repeat(64),kind===ARCH?'f':'e');
}
function routerFixture(){
  const op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:'SYNTHETIC_ROUTER',projectId:'LAWS',lockScope:'SYNTHETIC:ROUTER',exactGoverningHead:'1'.repeat(40),subjectIdentity:{requiredStartingHead:'2'.repeat(40),experimentId:'synthetic_router'},allowedPaths:['laws/a.js','laws/b.json']};
  const p={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:'SYNTH_ROUTER',exactGoverningHead:op.exactGoverningHead,exactAllowedRepositoryPaths:[...op.allowedPaths]};
  return wrap(op,p,'REPOSITORY_AI_ENTRY_ROUTER_MUTATION_V1',999,'3'.repeat(64),'a');
}
function legacyArchitectureFixture(){
  const d=registry.descriptors.find(x=>x.descriptorId==='LAWS_PHI1_GEN857_PAGE_EXCELLENCE_ARCHITECTURE_V1');if(!d)throw new Error('legacy descriptor missing');
  const grouped=new Map();for(const x of d.architectureFindings.exactSourceConstructIdentities){if(!grouped.has(x.commitSha))grouped.set(x.commitSha,[]);grouped.get(x.commitSha).push({path:x.path,gitBlobSha:x.gitBlobSha});}
  const op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:d.boundOperationId,projectId:d.projectId,lockScope:'SYNTHETIC:LEGACY_PAGE',exactGoverningHead:'1'.repeat(40),subjectIdentity:{requiredStartingHead:d.boundTargetHead,experimentId:'legacy',existingConstructSearchSources:[...grouped.entries()].map(([commitSha,files])=>({commitSha,files}))},allowedPaths:['laws/example/a.js']};
  const p={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:'LEGACY_PROC',exactGoverningHead:op.exactGoverningHead,exactAllowedRepositoryPaths:[...op.allowedPaths]};
  return wrap(op,p,d.descriptorId,d.boundLockGeneration,'7'.repeat(64),'b');
}
function referenceFixture(descriptorId){
  const d=registry.descriptors.find(x=>x.descriptorId===descriptorId);if(!d)throw new Error(`descriptor missing:${descriptorId}`);
  const evaluator=d.executionClass==='REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_V1';
  const subjectIdentity=evaluator?{instrumentId:'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_v1',componentId:'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_v1',activationRequested:false}:{instrumentId:'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_v1',activationRequested:false};
  const op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:d.boundOperationId,projectId:d.projectId,lockScope:`SYNTHETIC:${descriptorId}`,exactGoverningHead:'1'.repeat(40),subjectIdentity,allowedPaths:['verification/example.json']};
  const p={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:`PROC_${descriptorId}`,exactGoverningHead:op.exactGoverningHead,exactAllowedRepositoryPaths:[...op.allowedPaths]};
  return wrap(op,p,descriptorId,d.boundLockGeneration,hashObject({descriptorId}), 'd');
}
function expectPass(name,fn,results){try{fn();results.push({name,expected:'PASS',observed:'PASS'});}catch(e){results.push({name,expected:'PASS',observed:`FAIL:${e.code??e.message}`});}}
function expectFail(name,code,fn,results){try{fn();results.push({name,expected:code,observed:'UNEXPECTED_PASS'});}catch(e){results.push({name,expected:code,observed:e.code??e.message});}}
function runNativeRegression(name,script,validate){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'carrier-impl-regression-')),out=path.join(dir,`${name}.json`);
  try{cp.execFileSync(process.execPath,[script,'--output',out],{cwd:ROOT,env:{...process.env},shell:false,stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});const r=JSON.parse(fs.readFileSync(out,'utf8'));validate(r);return{name,result:'PASS',receiptSchema:r.schema??null,nativeResult:r.result??null};}
  catch(e){return{name,result:'FAIL',detail:e.message};}finally{fs.rmSync(dir,{recursive:true,force:true});}
}

export function runSelfTest(){
  const results=[];
  {const f=routerFixture();expectPass('POSITIVE_REGISTERED_ROUTER',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});if(r.executionClass!=='ROUTER_MUTATION_V1'||r.targetHead!=='2'.repeat(40)||r.paths.length!==2)throw new Error('router resolution');},results);}
  {const f=legacyArchitectureFixture();expectPass('POSITIVE_LEGACY_PAGE_ARCHITECTURE',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});if(r.executionClass!=='PAGE_EXCELLENCE_ARCHITECTURE_V1')throw new Error('legacy resolution');},results);}
  {const f=genericFixture(ARCH);expectPass('POSITIVE_GENERIC_ARCHITECTURE',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});const b=makePageArchitectureBundle(r.descriptor,toolset,r.pageSubjectHead,r.operationId,r.architectureFindings);if(b.phaseReceipts.length!==1||b.phaseReceipts[0].phase!=='ARCHITECTURE')throw new Error('arch bundle');},results);}
  {const f=genericFixture(IMPL);expectPass('POSITIVE_GENERIC_IMPLEMENTATION',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});const b=makePageImplementationBundle(r.descriptor,toolset,r.pageSubjectHead,r.operationId,r.architectureFindings,r.implementationFindings,r.architectureContinuity);if(b.phaseReceipts.length!==2||b.phaseReceipts[0].phase!=='ARCHITECTURE'||b.phaseReceipts[1].phase!=='IMPLEMENTATION'||Object.keys(b.phaseReceipts[1].findings).length!==9)throw new Error('impl bundle');},results);}
  expectPass('GENERIC_IMPLEMENTATION_DESCRIPTOR_CLOSED_WORLD',()=>{const d=registry.descriptors.find(x=>x.descriptorId===IMPL);if(!d||d.pagePhase!=='IMPLEMENTATION'||d.callerSuppliedBundleAllowed!==false||d.environmentOverridesAllowed!==false||d.extraArgumentsAllowed!==false)throw new Error('descriptor not closed');for(const k of['boundOperationId','boundLockGeneration','boundTargetHead','scriptBlob','implementationFindings'])if(Object.hasOwn(d,k))throw new Error(k);},results);
  {const f=genericFixture(IMPL);delete f.request.operationRequest.subjectIdentity.pageImplementationFindings;rehash(f);expectFail('IMPLEMENTATION_FINDINGS_REQUIRED','IMPLEMENTATION_FINDINGS_MISSING',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);delete f.request.operationRequest.subjectIdentity.pageImplementationFindings.findings.SEMANTIC_MARKUP;rehash(f);expectFail('ALL_NINE_IMPLEMENTATION_FINDINGS_REQUIRED','IMPLEMENTATION_FINDINGS_KEYSET_INVALID',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageImplementationFindings.findings.EXTRA={result:'PASS',evidence:['x']};rehash(f);expectFail('EXTRA_IMPLEMENTATION_FINDING_PROHIBITED','IMPLEMENTATION_FINDINGS_KEYSET_INVALID',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageImplementationFindings.findings.KEYBOARD_MODEL.result='FAIL';rehash(f);expectFail('IMPLEMENTATION_NONPASS_REJECTED','IMPLEMENTATION_FINDING_NONPASS',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageImplementationFindings.findings.STATE_RECOVERY.evidence=[];rehash(f);expectFail('IMPLEMENTATION_EVIDENCE_REQUIRED','IMPLEMENTATION_FINDING_EVIDENCE_MISSING',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);delete f.request.operationRequest.subjectIdentity.pageArchitectureContinuity;rehash(f);expectFail('ARCHITECTURE_CONTINUITY_REQUIRED','ARCHITECTURE_CONTINUITY_MISSING',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageArchitectureContinuity.architectureReceiptDigest='0'.repeat(64);rehash(f);expectFail('ARCHITECTURE_RECEIPT_DIGEST_MATCH_REQUIRED','ARCHITECTURE_CONTINUITY_RECEIPT_DIGEST_MISMATCH',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageArchitectureContinuity.subjectHead='9'.repeat(40);rehash(f);expectFail('ARCHITECTURE_SUBJECT_CONTINUITY_REQUIRED','ARCHITECTURE_CONTINUITY_SUBJECT_MISMATCH',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageArchitectureContinuity.nativeReceiptDigest='bad';rehash(f);expectFail('ARCHITECTURE_NATIVE_RECEIPT_DIGEST_REQUIRED','ARCHITECTURE_CONTINUITY_NATIVE_DIGEST_INVALID',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL),broken=clone(registry);broken.descriptors.find(x=>x.descriptorId===IMPL).boundOperationId='EVIL';expectFail('GENERIC_IMPLEMENTATION_OPERATION_BINDING_PROHIBITED','GENERIC_PAGE_DESCRIPTOR_MUST_NOT_BE_OPERATION_BOUND',()=>validateAndResolve({rawRequest:f.request,registry:broken,ledger:f.ledger}),results);}
  {const f=genericFixture(IMPL);f.request.operationRequest.subjectIdentity.pageArchitectureFindings.visualArchitectureAuthority.contentAdapterMayDefineVisualArchitecture=true;rehash(f);expectFail('IMPLEMENTATION_CANNOT_INFLATE_VISUAL_AUTHORITY','ADAPTER_VISUAL_ARCHITECTURE_AUTHORITY_PROHIBITED',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(ARCH);delete f.request.operationRequest.subjectIdentity.pageArchitectureFindings;rehash(f);expectFail('GENERIC_ARCHITECTURE_FINDINGS_REQUIRED','ARCHITECTURE_FINDINGS_MISSING',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=genericFixture(ARCH);f.request.operationRequest.subjectIdentity.pageArchitectureFindings.exactSourceConstructIdentities[0].gitBlobSha='5'.repeat(40);rehash(f);expectFail('ARCHITECTURE_SOURCE_IDENTITY_TAMPER','ARCHITECTURE_SOURCE_IDENTITY_MISMATCH',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  for(const key of['command','shellCommand','scriptBody','executable','environment','extraArguments','paths','targetHead','architectureBundle','receiptBundle','pageReceiptBundle']){const f=routerFixture();f.request[key]=key.includes('Bundle')?{}:(key==='paths'?['laws/evil']:'evil');expectFail(`PROHIBIT_CALLER_${key}`,'CARRIER_REQUEST_UNKNOWN_FIELD',()=>validateRequest(f.request),results);}
  {const f=routerFixture();f.request.admissionReceipt.lock.lockGeneration+=1;expectFail('LOCK_GENERATION_MISMATCH','ACTIVE_OPERATION_IDENTITY_MISMATCH',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=routerFixture();f.ledger.activeScopes['3'.repeat(64)].released=true;expectFail('RELEASED_LOCK_REJECTED','ACTIVE_OPERATION_IDENTITY_MISMATCH',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=routerFixture();f.request.operationRequest.allowedPaths.push('showroom/evil.js');expectFail('PATH_SCOPE_MISMATCH','REQUESTED_PATH_OUTSIDE_ADMITTED_SCOPE',()=>validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger}),results);}
  {const f=referenceFixture('REFERENCE_CLASS_AWARDS_ADMISSION_GEN890_VERIFY_V1');expectPass('REFERENCE_CLASS_DESCRIPTOR_PRESERVED',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});if(r.executionClass!=='REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1')throw new Error('reference class');},results);}
  {const f=referenceFixture('REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_GEN920_SELF_TEST_V1');expectPass('REFERENCE_EVALUATOR_DESCRIPTOR_PRESERVED',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});if(r.executionClass!=='REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_V1')throw new Error('evaluator class');},results);}
  {const f=referenceFixture('REFERENCE_CLASS_CONTEXTUAL_3D_GEN938_SELF_TEST_V1');expectPass('CONTEXTUAL_3D_EVALUATOR_DESCRIPTOR_PRESERVED',()=>{const r=validateAndResolve({rawRequest:f.request,registry,ledger:f.ledger});if(r.descriptor.projectId!=='REFERENCE_CLASS_AWARDS_ADMISSION')throw new Error('contextual project');},results);}
  const regressions=[
    runNativeRegression('PROGRESSIVE_SYSTEM_CONTINUITY','.github/ai-router/system-continuity/progressive-system-continuity-self-test.v1.mjs',r=>{if(r.result!=='PASS'||r.failedCount!==0||r.productMutationPerformed!==false||r.repositoryMutationPerformedBySelfTest!==false)throw new Error('nonpass');}),
    runNativeRegression('DIFFERENTIAL_CONTINUITY','.github/ai-router/differential-continuity/differential-continuity-self-test.v1.mjs',r=>{if(r.result!=='PASS_CLOSED'||r.failCount!==0||r.passCount!==r.testCount)throw new Error('nonpass');}),
    runNativeRegression('INSTRUMENT_LIFECYCLE','.github/ai-router/instrument-lifecycle/instrument-lifecycle-self-test.v1.mjs',r=>{if(r.result!=='PASS'||r.failedCount!==0||r.repositoryMutationPerformed!==false)throw new Error('nonpass');}),
    runNativeRegression('STRICT_SUCCESSOR','.github/ai-router/operation-lifecycle/repository-operation-successor-self-test.v1.mjs',r=>{if(r.result!=='PASS_CLOSED'||r.failCount!==0||r.passCount!==r.testCount)throw new Error('nonpass');}),
    runNativeRegression('INTEGRATED_DEVELOPMENT_PIPELINE','.github/ai-router/development-pipeline/integrated-development-pipeline-self-test.v1.mjs',r=>{if(r.result!=='PASS'||r.failedCount!==0||r.mergeAuthorityCreated!==false||r.productAuthorityCreated!==false)throw new Error('nonpass');})
  ];
  const fixturePass=results.every(x=>x.observed===x.expected),regressionPass=regressions.every(x=>x.result==='PASS');
  return stable({schema:'BOUNDED_EXACT_HEAD_EXECUTION_CARRIER_SELF_TEST_RECEIPT_v1',result:fixturePass&&regressionPass?'PASS':'FAIL',executionHead:executionHead(),exactHeadReexecutionMode:process.env.CARRIER_EXACT_HEAD_REEXEC==='1',total:results.length,passed:results.filter(x=>x.observed===x.expected).length,nativeRegressionCount:regressions.length,nativeRegressionPassCount:regressions.filter(x=>x.result==='PASS').length,nativeRegressions:regressions,pageArchitectureExecutionClassPresent:true,genericPageArchitectureExecutionClassPresent:true,genericPageImplementationExecutionClassPresent:true,genericPageArchitectureCallerControlSurfaceClosed:true,genericPageImplementationCallerControlSurfaceClosed:true,architectureReceiptContinuityEnforced:true,nineImplementationFindingsRequired:true,descriptorBoundArchitectureBundleOnly:true,canonicalOperationDerivedArchitectureBundleOnly:true,canonicalOperationDerivedImplementationBundleOnly:true,referenceClassAwardsAdmissionExecutionClassPresent:true,referenceClassAwardsAdmissionEvaluatorExecutionClassPresent:true,contextual3dEvaluatorExecutionDescriptorPresent:true,authorityInflationObserved:false,arbitraryCommandAccepted:false,callerSuppliedBundleAccepted:false,fixtures:results});
}
function main(){const argv=process.argv.slice(2),i=argv.indexOf('--output'),output=i>=0?argv[i+1]:null;const local=runSelfTest();const prHead=pullRequestHeadFromEvent();const exactCandidateReexecution=prHead?runExactHeadReexecution(prHead):null;const pass=local.result==='PASS'&&(exactCandidateReexecution==null||exactCandidateReexecution.result==='PASS');const receipt=stable({...local,result:pass?'PASS':'FAIL',exactCandidateReexecution});if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),`${JSON.stringify(receipt,null,2)}\n`);}else process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);if(receipt.result!=='PASS')process.exitCode=1;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
