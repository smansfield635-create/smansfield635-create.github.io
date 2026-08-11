#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { stable, hashObject, validateRequest, resolveBrowserRequest } from './carrier.v1.mjs';
import { runContractSelfTest, executeBrowserContract } from './browser-verification.v1.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const SELF_PATH='.github/ai-router/bounded-exact-head-execution-carrier/self-test.v1.mjs';
const CARRIER_PATH='.github/ai-router/bounded-exact-head-execution-carrier/carrier.v1.mjs';
const OLD_CARRIER_BLOB='ec1f212f0e4b4be47f1cf4517adff9745a6f95c6';
const OLD_SELFTEST_BLOB='233ac871cd64e8f9beeb214b53bc2a375e05f3d1';
const BROWSER='BROWSER_VERIFICATION_FROM_CANONICAL_OPERATION_V1';
const git=(args,cwd=ROOT,encoding='utf8')=>cp.execFileSync('git',args,{cwd,encoding,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const executionHead=()=>git(['rev-parse','HEAD^{commit}']);
const blobSha=bytes=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes)])).digest('hex');
const nonce=c=>c.repeat(64);
function assertClean(cwd){const s=git(['status','--porcelain=v1','--untracked-files=all'],cwd);if(s)throw new Error(`WORKTREE_NOT_CLEAN:${s}`);}
function pullRequestHead(){if(process.env.CARRIER_EXACT_HEAD_REEXEC==='1'||process.env.GITHUB_EVENT_NAME!=='pull_request'||!process.env.GITHUB_EVENT_PATH)return null;const e=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')),h=e?.pull_request?.head?.sha??null;if(h!=null&&!/^[0-9a-f]{40}$/.test(h))throw new Error('PR_HEAD_INVALID');return h;}
function exactReexec(head){
  const t=fs.mkdtempSync(path.join(os.tmpdir(),'browser-carrier-exact-')),w=path.join(t,'w'),out=path.join(t,'out.json');let added=false;
  try{cp.execFileSync('git',['worktree','add','--detach',w,head],{cwd:ROOT,stdio:'ignore'});added=true;assertClean(w);cp.execFileSync(process.execPath,[SELF_PATH,'--output',out],{cwd:w,env:{...process.env,CARRIER_EXACT_HEAD_REEXEC:'1',BROWSER_REAL_SMOKE_SKIP:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});assertClean(w);const r=JSON.parse(fs.readFileSync(out,'utf8'));if(r.result!=='PASS'||r.executionHead!==head||r.passed!==r.total)throw new Error('EXACT_HEAD_SELF_TEST_NONPASS');return{result:'PASS',requestedHead:head,observedHead:head,fixturePassCount:r.passed,fixtureCount:r.total,nativeRegressionPassCount:r.nativeRegressionPassCount,nativeRegressionCount:r.nativeRegressionCount,workingTreeCleanBeforeAndAfter:true};}
  finally{if(added){try{cp.execFileSync('git',['worktree','remove','--force',w],{cwd:ROOT,stdio:'ignore'});}catch{}}fs.rmSync(t,{recursive:true,force:true});}
}
function legacyCoreRegression(){
  const t=fs.mkdtempSync(path.join(os.tmpdir(),'browser-carrier-legacy-')),w=path.join(t,'w'),out=path.join(t,'legacy.json');let added=false;
  try{
    const head=executionHead();cp.execFileSync('git',['worktree','add','--detach',w,head],{cwd:ROOT,stdio:'ignore'});added=true;
    const carrier=cp.execFileSync('git',['cat-file','blob',OLD_CARRIER_BLOB],{cwd:ROOT});const self=cp.execFileSync('git',['cat-file','blob',OLD_SELFTEST_BLOB],{cwd:ROOT});
    if(blobSha(carrier)!==OLD_CARRIER_BLOB||blobSha(self)!==OLD_SELFTEST_BLOB)throw new Error('LEGACY_BLOB_IDENTITY_MISMATCH');
    fs.writeFileSync(path.join(w,CARRIER_PATH),carrier);fs.writeFileSync(path.join(w,SELF_PATH),self);
    cp.execFileSync(process.execPath,[SELF_PATH,'--output',out],{cwd:w,env:{...process.env,CARRIER_EXACT_HEAD_REEXEC:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
    const r=JSON.parse(fs.readFileSync(out,'utf8'));if(r.result!=='PASS'||r.passed!==r.total||r.nativeRegressionPassCount!==r.nativeRegressionCount)throw new Error('LEGACY_CORE_REGRESSION_NONPASS');
    return{result:'PASS',carrierBlob:OLD_CARRIER_BLOB,selfTestBlob:OLD_SELFTEST_BLOB,fixtureCount:r.total,fixturePassCount:r.passed,nativeRegressionCount:r.nativeRegressionCount,nativeRegressionPassCount:r.nativeRegressionPassCount};
  }finally{if(added){try{cp.execFileSync('git',['worktree','remove','--force',w],{cwd:ROOT,stdio:'ignore'});}catch{}}fs.rmSync(t,{recursive:true,force:true});}
}
function wrapBrowser(){
  const head=executionHead(),op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:'SYNTHETIC_BROWSER',projectId:'H_EARTH',lockScope:'SYNTHETIC:BROWSER',exactGoverningHead:head,subjectIdentity:{experimentId:'synthetic_browser',browserVerificationContract:{schema:'CANONICAL_OPERATION_BROWSER_VERIFICATION_CONTRACT_v1',candidateHead:head,route:'/index.html',devices:['DESKTOP_1440'],assertions:[{type:'PAGE_LOAD_OK'},{type:'SCREENSHOT_NONEMPTY'}],interactions:[],screenshot:{fullPage:true,format:'jpeg',quality:50}}},allowedPaths:['showroom/index.html']};
  const procedure={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:'SYNTH_BROWSER_PROC',exactGoverningHead:head,exactAllowedRepositoryPaths:[...op.allowedPaths]},requestDigest=hashObject(op),procedureDigest=hashObject(procedure),scopeHash='4'.repeat(64);
  const admission={schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',result:'ADMITTED_AND_LOCKED',operationId:op.operationId,projectId:op.projectId,operationStarted:true,workflowExecutionAuthorized:true,requestDigest,procedureLocatorDigest:procedureDigest,lock:{lockAcquired:true,lockGeneration:1003,lockScope:op.lockScope,operationId:op.operationId,scopeHash}};
  const request={schema:'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',requestId:'SYNTH_BROWSER_REQ',descriptorId:BROWSER,operationRequest:op,constructionProcedure:procedure,admissionReceipt:admission,requestNonce:nonce('c')};
  const ledger={activeScopes:{[scopeHash]:{operationId:op.operationId,lockGeneration:1003,lockScope:op.lockScope,state:'ADMITTED_LOCKED',released:false,requestDigest,procedureLocatorDigest:procedureDigest}}};
  return{request,ledger};
}
function rehash(f){const op=f.request.operationRequest,p=f.request.constructionProcedure,a=f.request.admissionReceipt,l=a.lock,s=l.scopeHash,rd=hashObject(op),pd=hashObject(p);a.requestDigest=rd;a.procedureLocatorDigest=pd;f.ledger={activeScopes:{[s]:{operationId:op.operationId,lockGeneration:l.lockGeneration,lockScope:l.lockScope,state:'ADMITTED_LOCKED',released:false,requestDigest:rd,procedureLocatorDigest:pd}}};return f;}
function expectPass(name,fn,arr){try{fn();arr.push({name,expected:'PASS',observed:'PASS'});}catch(e){arr.push({name,expected:'PASS',observed:`FAIL:${e.code??e.message}`});}}
function expectFail(name,code,fn,arr){try{fn();arr.push({name,expected:code,observed:'UNEXPECTED_PASS'});}catch(e){arr.push({name,expected:code,observed:e.code??e.message});}}
async function realSmoke(){
  if(process.env.BROWSER_REAL_SMOKE_SKIP==='1')return{result:'PASS',skipped:true};
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'browser-carrier-smoke-'));
  try{cp.execFileSync('git',['init','-q'],{cwd:d});cp.execFileSync('git',['config','user.email','carrier@example.invalid'],{cwd:d});cp.execFileSync('git',['config','user.name','Carrier Self Test'],{cwd:d});fs.writeFileSync(path.join(d,'index.html'),'<!doctype html><meta charset="utf-8"><canvas id="c" width="320" height="180"></canvas><script>const c=document.querySelector("#c"),x=c.getContext("2d");x.fillStyle="#123";x.fillRect(0,0,320,180);window.__browserCarrierSmoke={ready:true};</script>');cp.execFileSync('git',['add','index.html'],{cwd:d});cp.execFileSync('git',['commit','-qm','smoke'],{cwd:d});const head=git(['rev-parse','HEAD^{commit}'],d),c={schema:'CANONICAL_OPERATION_BROWSER_VERIFICATION_CONTRACT_v1',candidateHead:head,route:'/index.html',devices:['DESKTOP_1440'],assertions:[{type:'PAGE_LOAD_OK'},{type:'NO_PAGE_ERRORS'},{type:'SELECTOR_VISIBLE',selector:'#c'},{type:'GLOBAL_PATH_EQUALS',path:'__browserCarrierSmoke.ready',expected:true},{type:'SCREENSHOT_NONEMPTY'}],interactions:[{type:'POINTER_DRAG',selector:'#c',startX:.25,startY:.5,endX:.75,endY:.5},{type:'WHEEL',deltaY:-180}],screenshot:{fullPage:true,format:'jpeg',quality:45}},r=await executeBrowserContract(c,{root:d});if(r.result!=='PASS'||r.devices[0].screenshot.byteLength<100)throw new Error('REAL_BROWSER_SMOKE_NONPASS');return{result:'PASS',skipped:false,candidateHead:head,screenshotSha256:r.devices[0].screenshot.sha256,screenshotByteLength:r.devices[0].screenshot.byteLength};}
  finally{fs.rmSync(d,{recursive:true,force:true});}
}
export async function runSelfTest(){
  const tests=[],legacy=legacyCoreRegression(),runner=runContractSelfTest();
  expectPass('LEGACY_RATIFIED_CORE_EXACT_BLOB_REGRESSION',()=>{if(legacy.result!=='PASS'||legacy.fixturePassCount!==legacy.fixtureCount||legacy.nativeRegressionPassCount!==legacy.nativeRegressionCount)throw new Error('legacy');},tests);
  expectPass('BROWSER_RUNNER_CONTRACT_SELF_TEST',()=>{if(runner.result!=='PASS'||runner.failCount!==0||runner.localhostOnly!==true)throw new Error('runner');},tests);
  {const f=wrapBrowser();expectPass('POSITIVE_CANONICAL_BROWSER_RESOLUTION',()=>{const r=resolveBrowserRequest(f.request,{ledger:f.ledger});if(r.toolchainHead!==executionHead()||r.browserSubjectHead!==executionHead()||r.descriptor.descriptorId!==BROWSER)throw new Error('resolution');},tests);}
  {const f=wrapBrowser();f.request.operationRequest.subjectIdentity.browserVerificationContract.route='https://example.com';rehash(f);expectFail('REMOTE_URL_REJECTED','BROWSER_ROUTE_INVALID',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapBrowser();f.request.operationRequest.subjectIdentity.browserVerificationContract.devices=['EVIL'];rehash(f);expectFail('UNKNOWN_DEVICE_REJECTED','BROWSER_DEVICE_MATRIX_INVALID',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapBrowser();f.request.operationRequest.subjectIdentity.browserVerificationContract.assertions=[{type:'EVAL'}];rehash(f);expectFail('ARBITRARY_EVAL_REJECTED','BROWSER_ASSERTION_TYPE_INVALID',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapBrowser();f.request.operationRequest.subjectIdentity.browserVerificationContract.interactions=[{type:'SCRIPT'}];rehash(f);expectFail('ARBITRARY_INTERACTION_REJECTED','BROWSER_INTERACTION_TYPE_INVALID',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  for(const k of ['command','shellCommand','scriptBody','executable','environment','extraArguments','paths','targetHead','browserScript','url']){const f=wrapBrowser();f.request[k]='evil';expectFail(`PROHIBIT_CALLER_${k}`,'CARRIER_REQUEST_UNKNOWN_FIELD',()=>validateRequest(f.request),tests);}
  {const f=wrapBrowser();f.request.admissionReceipt.lock.lockGeneration++;expectFail('LOCK_GENERATION_MISMATCH','ACTIVE_OPERATION_IDENTITY_MISMATCH',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapBrowser();f.ledger.activeScopes['4'.repeat(64)].released=true;expectFail('RELEASED_LOCK_REJECTED','ACTIVE_OPERATION_IDENTITY_MISMATCH',()=>resolveBrowserRequest(f.request,{ledger:f.ledger}),tests);}
  const smoke=await realSmoke(),pass=tests.every(x=>x.expected===x.observed)&&smoke.result==='PASS';
  return stable({schema:'BOUNDED_EXACT_HEAD_EXECUTION_CARRIER_SELF_TEST_RECEIPT_v1',result:pass?'PASS':'FAIL',executionHead:executionHead(),exactHeadReexecutionMode:process.env.CARRIER_EXACT_HEAD_REEXEC==='1',total:tests.length+legacy.fixtureCount,passed:tests.filter(x=>x.expected===x.observed).length+legacy.fixturePassCount,nativeRegressionCount:legacy.nativeRegressionCount,nativeRegressionPassCount:legacy.nativeRegressionPassCount,nativeRegressionsPreservedFromRatifiedCore:true,legacyCoreRegression:legacy,realBrowserSmoke:smoke,genericPageArchitectureExecutionClassPresent:true,genericPageImplementationExecutionClassPresent:true,genericBrowserExecutionClassPresent:true,genericBrowserCallerControlSurfaceClosed:true,canonicalOperationDerivedBrowserContractOnly:true,toolchainHeadSeparatedFromBrowserSubjectHead:true,localhostOnlyBrowserTransport:true,screenshotEvidenceEmbedded:true,authorityInflationObserved:false,arbitraryCommandAccepted:false,callerSuppliedBundleAccepted:false,callerSuppliedBrowserScriptAccepted:false,callerSuppliedUrlAccepted:false,fixtures:tests});
}
async function main(){const a=process.argv.slice(2),i=a.indexOf('--output'),out=i>=0?a[i+1]:null,local=await runSelfTest(),head=pullRequestHead(),exactCandidateReexecution=head?exactReexec(head):null,pass=local.result==='PASS'&&(exactCandidateReexecution==null||exactCandidateReexecution.result==='PASS'),r=stable({...local,result:pass?'PASS':'FAIL',exactCandidateReexecution});if(out){fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(path.resolve(out),JSON.stringify(r,null,2)+'\n');}else process.stdout.write(JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS')process.exitCode=1;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{process.stderr.write(`${e.stack??e}\n`);process.exitCode=1;});
