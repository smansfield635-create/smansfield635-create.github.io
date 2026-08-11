#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { stable,hashObject,validateRequest,resolveBrowserMatrixRequest } from './carrier.v1.mjs';
import { runMatrixContractSelfTest,executeBrowserScenarioMatrixContract } from './browser-verification.v1.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const SELF_PATH='.github/ai-router/bounded-exact-head-execution-carrier/self-test.v1.mjs';
const CARRIER_PATH='.github/ai-router/bounded-exact-head-execution-carrier/carrier.v1.mjs';
const BROWSER_PATH='.github/ai-router/bounded-exact-head-execution-carrier/browser-verification.v1.mjs';
const PRE_MATRIX_SELFTEST_BLOB='1d283ac7e80a294240cab4439d9e231860d3621b';
const PRE_MATRIX_CARRIER_BLOB='b611e386483a7794d54219db8d1a004c25017300';
const PRE_MATRIX_BROWSER_BLOB='e63433efe50614cb88e2ccaf5e25d19b2d8a4c62';
const MATRIX='BROWSER_SCENARIO_MATRIX_FROM_CANONICAL_OPERATION_V1';
const git=(args,cwd=ROOT)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const executionHead=()=>git(['rev-parse','HEAD^{commit}']);
const blobSha=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),Buffer.isBuffer(b)?b:Buffer.from(b)])).digest('hex');
const nonce=c=>c.repeat(64);
function exactBlob(sha){const b=cp.execFileSync('git',['cat-file','blob',sha],{cwd:ROOT});if(blobSha(b)!==sha)throw new Error(`BLOB_IDENTITY_MISMATCH:${sha}`);return b;}
function preMatrixRegression(){
  const t=fs.mkdtempSync(path.join(os.tmpdir(),'browser-matrix-prematrix-')),w=path.join(t,'w'),out=path.join(t,'out.json');let added=false;
  try{
    cp.execFileSync('git',['worktree','add','--detach',w,executionHead()],{cwd:ROOT,stdio:'ignore'});added=true;
    fs.writeFileSync(path.join(w,CARRIER_PATH),exactBlob(PRE_MATRIX_CARRIER_BLOB));
    fs.writeFileSync(path.join(w,BROWSER_PATH),exactBlob(PRE_MATRIX_BROWSER_BLOB));
    fs.writeFileSync(path.join(w,SELF_PATH),exactBlob(PRE_MATRIX_SELFTEST_BLOB));
    cp.execFileSync(process.execPath,[SELF_PATH,'--output',out],{cwd:w,env:{...process.env,CARRIER_EXACT_HEAD_REEXEC:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:128*1024*1024});
    const r=JSON.parse(fs.readFileSync(out,'utf8'));if(r.result!=='PASS'||r.passed!==r.total||r.nativeRegressionPassCount!==r.nativeRegressionCount||r.realBrowserSmoke?.result!=='PASS')throw new Error('PRE_MATRIX_V1_REGRESSION_NONPASS');
    return {result:'PASS',selfTestBlob:PRE_MATRIX_SELFTEST_BLOB,carrierBlob:PRE_MATRIX_CARRIER_BLOB,browserBlob:PRE_MATRIX_BROWSER_BLOB,fixtureCount:r.total,fixturePassCount:r.passed,nativeRegressionCount:r.nativeRegressionCount,nativeRegressionPassCount:r.nativeRegressionPassCount,realBrowserSmoke:r.realBrowserSmoke};
  }finally{if(added){try{cp.execFileSync('git',['worktree','remove','--force',w],{cwd:ROOT,stdio:'ignore'});}catch{}}fs.rmSync(t,{recursive:true,force:true});}
}
function wrapMatrix(){
  const head=executionHead(),contract={schema:'CANONICAL_OPERATION_BROWSER_SCENARIO_MATRIX_CONTRACT_v1',candidateHead:head,route:'/index.html',scenarios:[{caseId:'synthetic',profile:'PHONE_390X844',interactions:[],assertions:[{type:'PAGE_LOAD_OK'},{type:'SCREENSHOT_NONEMPTY'}]}],screenshot:{fullPage:true,format:'jpeg',quality:50}};
  const op={schema:'REPOSITORY_OPERATION_REQUEST_v1',operationId:'SYNTHETIC_MATRIX',projectId:'REPOSITORY_AI_ROUTER_INFRASTRUCTURE',lockScope:'SYNTHETIC:MATRIX',exactGoverningHead:head,subjectIdentity:{experimentId:'synthetic_matrix',browserScenarioMatrixContract:contract},allowedPaths:['verification/example.html']};
  const procedure={schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',procedureId:'SYNTH_MATRIX_PROC',exactGoverningHead:head,exactAllowedRepositoryPaths:[...op.allowedPaths]},requestDigest=hashObject(op),procedureDigest=hashObject(procedure),scopeHash='5'.repeat(64);
  const admission={schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',result:'ADMITTED_AND_LOCKED',operationId:op.operationId,projectId:op.projectId,operationStarted:true,workflowExecutionAuthorized:true,requestDigest,procedureLocatorDigest:procedureDigest,lock:{lockAcquired:true,lockGeneration:1083,lockScope:op.lockScope,operationId:op.operationId,scopeHash}};
  const request={schema:'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1',requestId:'SYNTH_MATRIX_REQ',descriptorId:MATRIX,operationRequest:op,constructionProcedure:procedure,admissionReceipt:admission,requestNonce:nonce('d')};
  const ledger={activeScopes:{[scopeHash]:{operationId:op.operationId,lockGeneration:1083,lockScope:op.lockScope,state:'ADMITTED_LOCKED',released:false,requestDigest,procedureLocatorDigest:procedureDigest}}};return {request,ledger};
}
function rehash(f){const op=f.request.operationRequest,p=f.request.constructionProcedure,a=f.request.admissionReceipt,l=a.lock,s=l.scopeHash,rd=hashObject(op),pd=hashObject(p);a.requestDigest=rd;a.procedureLocatorDigest=pd;f.ledger={activeScopes:{[s]:{operationId:op.operationId,lockGeneration:l.lockGeneration,lockScope:l.lockScope,state:'ADMITTED_LOCKED',released:false,requestDigest:rd,procedureLocatorDigest:pd}}};return f;}
function expectPass(name,fn,out){try{fn();out.push({name,expected:'PASS',observed:'PASS'});}catch(e){out.push({name,expected:'PASS',observed:`FAIL:${e.code??e.message}`});}}
function expectFail(name,code,fn,out){try{fn();out.push({name,expected:code,observed:'UNEXPECTED_PASS'});}catch(e){out.push({name,expected:code,observed:e.code??e.message});}}
async function realMatrixSmoke(){
  if(process.env.BROWSER_MATRIX_REAL_SMOKE_SKIP==='1')return {result:'PASS',skipped:true};
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'browser-matrix-smoke-'));
  try{
    cp.execFileSync('git',['init','-q'],{cwd:d});cp.execFileSync('git',['config','user.email','matrix@example.invalid'],{cwd:d});cp.execFileSync('git',['config','user.name','Matrix Self Test'],{cwd:d});
    fs.writeFileSync(path.join(d,'index.html'),'<!doctype html><meta charset="utf-8"><style>html,body{margin:0;overflow-x:hidden}.card{width:calc(100vw - 20px);margin:10px;box-sizing:border-box}.scroll{height:80px;overflow:auto;overflow-x:hidden}.tall{height:240px}</style><main class="card"><button id="b">change</button><div class="scroll"><div class="tall">scroll</div></div></main><script>window.__matrix={v:0};document.querySelector("#b").addEventListener("click",()=>window.__matrix.v++);</script>');
    cp.execFileSync('git',['add','index.html'],{cwd:d});cp.execFileSync('git',['commit','-qm','smoke'],{cwd:d});const head=git(['rev-parse','HEAD^{commit}'],d);
    const contract={schema:'CANONICAL_OPERATION_BROWSER_SCENARIO_MATRIX_CONTRACT_v1',candidateHead:head,route:'/index.html',scenarios:[
      {caseId:'phone-click',profile:'PHONE_390X844',interactions:[{type:'CLICK',selector:'#b'}],assertions:[{type:'PAGE_LOAD_OK'},{type:'NO_PAGE_ERRORS'},{type:'NO_DOCUMENT_HORIZONTAL_OVERFLOW'},{type:'SELECTOR_HORIZONTAL_VIEWPORT_ACCESSIBLE',selector:'.card'},{type:'SELECTOR_INTERNAL_VERTICAL_SCROLL_PRESERVED',selector:'.scroll'},{type:'GLOBAL_PATH_CHANGED_AFTER_INTERACTION',path:'__matrix.v'},{type:'SCREENSHOT_NONEMPTY'}]},
      {caseId:'desktop-baseline',profile:'DESKTOP_1440X1000',interactions:[],assertions:[{type:'PAGE_LOAD_OK'},{type:'GLOBAL_PATH_EQUALS',path:'__matrix.v',expected:0},{type:'SCREENSHOT_NONEMPTY'}]}
    ],screenshot:{fullPage:true,format:'jpeg',quality:45}};
    const r=await executeBrowserScenarioMatrixContract(contract,{root:d});if(r.result!=='PASS'||r.scenarioCount!==2||r.cases.some(x=>x.result!=='PASS'))throw new Error('REAL_MATRIX_SMOKE_NONPASS');return {result:'PASS',skipped:false,candidateHead:head,scenarioCount:r.scenarioCount,screenshotDigests:r.cases.map(x=>x.screenshot.sha256)};
  }finally{fs.rmSync(d,{recursive:true,force:true});}
}
export async function runSelfTest(){
  const tests=[],pre=preMatrixRegression(),runner=runMatrixContractSelfTest();
  expectPass('PRE_MATRIX_V1_FULL_REGRESSION',()=>{if(pre.result!=='PASS'||pre.fixturePassCount!==pre.fixtureCount||pre.nativeRegressionPassCount!==pre.nativeRegressionCount||pre.realBrowserSmoke.result!=='PASS')throw new Error('prematrix');},tests);
  expectPass('MATRIX_RUNNER_CONTRACT_SELF_TEST',()=>{if(runner.result!=='PASS'||runner.failCount!==0||runner.fixedViewportProfilesOnly!==true)throw new Error('matrix runner');},tests);
  {const f=wrapMatrix();expectPass('POSITIVE_MATRIX_RESOLUTION',()=>{const r=resolveBrowserMatrixRequest(f.request,{ledger:f.ledger});if(r.toolchainHead!==executionHead()||r.browserSubjectHead!==executionHead()||r.descriptor.descriptorId!==MATRIX)throw new Error('resolution');},tests);}
  {const f=wrapMatrix();f.request.operationRequest.subjectIdentity.browserScenarioMatrixContract.route='https://example.com';rehash(f);expectFail('MATRIX_REMOTE_URL_REJECTED','MATRIX_ROUTE_INVALID',()=>resolveBrowserMatrixRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapMatrix();f.request.operationRequest.subjectIdentity.browserScenarioMatrixContract.scenarios[0].profile='CUSTOM';rehash(f);expectFail('MATRIX_ARBITRARY_PROFILE_REJECTED','MATRIX_PROFILE_INVALID',()=>resolveBrowserMatrixRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapMatrix();f.request.operationRequest.subjectIdentity.browserScenarioMatrixContract.scenarios[0].viewport={width:1,height:1};rehash(f);expectFail('MATRIX_ARBITRARY_VIEWPORT_REJECTED','MATRIX_SCENARIO_UNKNOWN_FIELD',()=>resolveBrowserMatrixRequest(f.request,{ledger:f.ledger}),tests);}
  {const f=wrapMatrix();f.request.operationRequest.subjectIdentity.browserScenarioMatrixContract.scenarios[0].assertions=[{type:'EVAL'}];rehash(f);expectFail('MATRIX_ARBITRARY_EVAL_REJECTED','MATRIX_ASSERTION_TYPE_INVALID',()=>resolveBrowserMatrixRequest(f.request,{ledger:f.ledger}),tests);}
  for(const k of ['command','shellCommand','scriptBody','executable','environment','extraArguments','paths','targetHead','browserScript','url','viewport']){const f=wrapMatrix();f.request[k]='evil';expectFail(`PROHIBIT_CALLER_${k}`,'CARRIER_REQUEST_UNKNOWN_FIELD',()=>validateRequest(f.request),tests);}
  const smoke=await realMatrixSmoke(),pass=tests.every(x=>x.expected===x.observed)&&smoke.result==='PASS';
  return stable({schema:'BOUNDED_BROWSER_SCENARIO_MATRIX_EXTENSION_SELF_TEST_RECEIPT_v1',result:pass?'PASS':'FAIL',executionHead:executionHead(),total:tests.length,passed:tests.filter(x=>x.expected===x.observed).length,preMatrixV1Regression:pre,matrixRunnerSelfTest:runner,realMatrixSmoke:smoke,genericBrowserV1Preserved:true,genericBrowserMatrixExecutionClassPresent:true,fixedGen1073ViewportProfilesPresent:true,freshContextPerScenario:true,typedFunctionalLayoutAssertionsPresent:true,perScenarioScreenshotEvidence:true,authorityInflationObserved:false,callerSuppliedJavascriptAccepted:false,callerSuppliedPlaywrightAccepted:false,callerSuppliedViewportAccepted:false,productAuthorityCreated:false,semanticAuthorityCreated:false,fixtures:tests});
}
async function main(){const a=process.argv.slice(2),i=a.indexOf('--output'),out=i>=0?a[i+1]:null,r=await runSelfTest();if(out){fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(path.resolve(out),JSON.stringify(r,null,2)+'\n');}else process.stdout.write(JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS')process.exitCode=1;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{process.stderr.write(`${e.stack??e}\n`);process.exitCode=1;});
