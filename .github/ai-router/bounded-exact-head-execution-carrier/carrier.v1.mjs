#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const SELF_PATH='.github/ai-router/bounded-exact-head-execution-carrier/carrier.v1.mjs';
const REGISTRY_PATH='.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json';
const BROWSER_RUNNER_PATH='.github/ai-router/bounded-exact-head-execution-carrier/browser-verification.v1.mjs';
const LEGACY_CARRIER_BLOB='ec1f212f0e4b4be47f1cf4517adff9745a6f95c6';
const BROWSER_DESCRIPTOR='BROWSER_VERIFICATION_FROM_CANONICAL_OPERATION_V1';
const LOCK_REF='refs/remotes/origin/operation-locks/repository-operation-intake-v1';
const LOCK_LEDGER_PATH='.github/operation-intake/active-operation-ledger.v1.json';
const REQUEST_KEYS=['schema','requestId','descriptorId','operationRequest','constructionProcedure','admissionReceipt','requestNonce'];
const FORBIDDEN=['command','shell','shellCommand','script','scriptBody','executable','arguments','extraArguments','environment','environmentOverride','paths','targetHead','workingDirectory','workflowOverride','architectureBundle','receiptBundle','pageReceiptBundle','browserScript','url','browserUrl'];
const DEVICES=new Set(['DESKTOP_1440','S26_ULTRA','TAB_A9']);
const ASSERTIONS=new Set(['PAGE_LOAD_OK','NO_CONSOLE_ERRORS','NO_PAGE_ERRORS','SELECTOR_VISIBLE','SELECTOR_EXISTS','GLOBAL_PATH_EQUALS','GLOBAL_PATH_TRUTHY','SCREENSHOT_NONEMPTY']);
const INTERACTIONS=new Set(['POINTER_DRAG','WHEEL','TOUCH_DRAG','PINCH']);

export const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
export const canonical=v=>JSON.stringify(stable(v));
export const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
export const hashObject=v=>sha256(Buffer.from(canonical(v),'utf8'));
function fail(code,detail=null){const e=new Error(detail==null?code:`${code}:${typeof detail==='string'?detail:JSON.stringify(detail)}`);e.code=code;e.detail=detail;throw e;}
function obj(v,c){if(!v||typeof v!=='object'||Array.isArray(v))fail(c);return v;}
function str(v,c){if(typeof v!=='string'||!v)fail(c);return v;}
function commit(v,c){if(!/^[0-9a-f]{40}$/.test(v??''))fail(c,String(v));return v;}
function digest(v,c){if(!/^[0-9a-f]{64}$/.test(v??''))fail(c,String(v));return v;}
function closed(v,required,allowed,p){obj(v,`${p}_OBJECT_REQUIRED`);for(const k of required)if(!Object.hasOwn(v,k))fail(`${p}_MISSING_FIELD`,k);for(const k of Object.keys(v))if(!allowed.includes(k))fail(`${p}_UNKNOWN_FIELD`,k);}
function readJson(p){return JSON.parse(fs.readFileSync(path.resolve(p),'utf8'));}
function writeJson(p,v){fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),JSON.stringify(stable(v),null,2)+'\n');}
function git(args,cwd=ROOT,stdio=['ignore','pipe','pipe']){return cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,stdio});}
function gitBlob(bytes){return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest('hex');}
function parse(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--input','--output'].includes(k)||v==null)fail('CLI_ARGUMENTS_INVALID',k);out[k.slice(2)]=v;}if(!out.input||!out.output)fail('INPUT_AND_OUTPUT_REQUIRED');return out;}
export function validateRequest(raw){
  closed(raw,REQUEST_KEYS,REQUEST_KEYS,'CARRIER_REQUEST');
  if(raw.schema!=='BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1')fail('REQUEST_SCHEMA_MISMATCH');
  for(const k of FORBIDDEN)if(Object.hasOwn(raw,k))fail('ARBITRARY_COMMAND_FIELD_PROHIBITED',k);
  if(!/^[0-9a-f]{64}$/.test(raw.requestNonce??''))fail('REQUEST_NONCE_INVALID');
  return stable(raw);
}
function loadLedger(){
  try{git(['show',`${LOCK_REF}:${LOCK_LEDGER_PATH}`]);}
  catch{try{git(['fetch','--no-tags','origin','+refs/heads/operation-locks/repository-operation-intake-v1:refs/remotes/origin/operation-locks/repository-operation-intake-v1']);}catch{fail('CANONICAL_LOCK_LEDGER_UNAVAILABLE');}}
  try{return JSON.parse(git(['show',`${LOCK_REF}:${LOCK_LEDGER_PATH}`]));}catch{fail('CANONICAL_LOCK_LEDGER_INVALID');}
}
function ensureCommit(head){try{git(['cat-file','-e',`${head}^{commit}`]);}catch{try{git(['fetch','--no-tags','origin',head]);}catch{fail('EXACT_HEAD_CHECKOUT_FAILURE',head);}}}
function clean(cwd,code='WORKTREE_NOT_CLEAN'){const s=git(['status','--porcelain=v1','--untracked-files=all'],cwd).trim();if(s)fail(code,s);}
function registryDescriptor(){
  const registry=readJson(path.join(ROOT,REGISTRY_PATH));
  if(registry.schema!=='BOUNDED_EXECUTABLE_DESCRIPTOR_REGISTRY_v1'||registry.closedWorld!==true||registry.arbitraryCommandAccepted!==false)fail('REGISTRY_NOT_FAIL_CLOSED');
  const d=registry.descriptors?.filter(x=>x.descriptorId===BROWSER_DESCRIPTOR)??[];
  if(d.length!==1)fail(d.length?'EXECUTABLE_DESCRIPTOR_AMBIGUOUS':'UNREGISTERED_EXECUTABLE');
  const x=d[0];
  if(x.status!=='ACTIVE_RATIFIED_WHEN_ON_DEFAULT_BRANCH'||x.executionClass!==BROWSER_DESCRIPTOR||x.executable!=='node'||x.scriptPath!==BROWSER_RUNNER_PATH||x.shell!==false||x.mutationIntent!==false||x.extraArgumentsAllowed!==false||x.environmentOverridesAllowed!==false||x.callerSuppliedBundleAllowed!==false||x.pathDerivation!=='OPERATION_REQUEST_ALLOWED_PATHS_EXACT'||x.targetHeadDerivation!=='OPERATION_EXACT_GOVERNING_HEAD'||x.browserSubjectHeadDerivation!=='OPERATION_SUBJECT_IDENTITY_BROWSER_VERIFICATION_CONTRACT_CANDIDATE_HEAD'||x.browserContractDerivation!=='OPERATION_SUBJECT_IDENTITY_BROWSER_VERIFICATION_CONTRACT_EXACT'||x.nativeReceiptSchema!=='CANONICAL_BROWSER_VERIFICATION_RECEIPT_v1'||x.nativePassField!=='result'||x.nativePassValue!=='PASS'||x.localhostOnly!==true||x.fixedBrowser!=='chromium'||x.fixedPlaywrightVersion!=='1.55.0')fail('BROWSER_DESCRIPTOR_INVALID');
  for(const k of ['boundOperationId','boundLockGeneration','boundTargetHead','scriptBlob','fixedArguments','url','browserScript'])if(Object.hasOwn(x,k))fail('GENERIC_BROWSER_DESCRIPTOR_MUST_NOT_BE_OPERATION_BOUND',k);
  return stable(x);
}
function repoPath(v,c){str(v,c);const n=v.replaceAll('\\','/');if(n.startsWith('/')||n==='..'||n.startsWith('../')||n.includes('/../')||!/^[A-Za-z0-9._/-]+$/.test(n))fail(c,v);return n;}
function validateContract(raw){
  closed(raw,['schema','candidateHead','route','devices','assertions','interactions','screenshot'],['schema','candidateHead','route','devices','assertions','interactions','screenshot'],'BROWSER_CONTRACT');
  if(raw.schema!=='CANONICAL_OPERATION_BROWSER_VERIFICATION_CONTRACT_v1')fail('BROWSER_CONTRACT_SCHEMA_MISMATCH');
  commit(raw.candidateHead,'BROWSER_CONTRACT_CANDIDATE_INVALID');
  if(typeof raw.route!=='string'||!raw.route.startsWith('/')||raw.route.includes('://')||raw.route.includes('..')||raw.route.length>300)fail('BROWSER_ROUTE_INVALID');
  if(!Array.isArray(raw.devices)||raw.devices.length<1||raw.devices.length>3||new Set(raw.devices).size!==raw.devices.length||raw.devices.some(x=>!DEVICES.has(x)))fail('BROWSER_DEVICE_MATRIX_INVALID');
  if(!Array.isArray(raw.assertions)||raw.assertions.length<1||raw.assertions.length>64)fail('BROWSER_ASSERTIONS_INVALID');
  for(const a of raw.assertions){obj(a,'BROWSER_ASSERTION_INVALID');if(!ASSERTIONS.has(a.type))fail('BROWSER_ASSERTION_TYPE_INVALID',a.type);if(['SELECTOR_VISIBLE','SELECTOR_EXISTS'].includes(a.type)&&(typeof a.selector!=='string'||!a.selector||a.selector.length>256))fail('BROWSER_SELECTOR_INVALID');if(['GLOBAL_PATH_EQUALS','GLOBAL_PATH_TRUTHY'].includes(a.type)&&(typeof a.path!=='string'||!/^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(a.path)))fail('BROWSER_GLOBAL_PATH_INVALID');if(a.type==='GLOBAL_PATH_EQUALS'&&!['string','number','boolean'].includes(typeof a.expected)&&a.expected!==null)fail('BROWSER_EXPECTED_VALUE_INVALID');}
  if(!Array.isArray(raw.interactions)||raw.interactions.length>16)fail('BROWSER_INTERACTIONS_INVALID');
  for(const x of raw.interactions){obj(x,'BROWSER_INTERACTION_INVALID');if(!INTERACTIONS.has(x.type))fail('BROWSER_INTERACTION_TYPE_INVALID',x.type);if(x.selector!=null&&(typeof x.selector!=='string'||!x.selector||x.selector.length>256))fail('BROWSER_SELECTOR_INVALID');}
  obj(raw.screenshot,'BROWSER_SCREENSHOT_INVALID');if(raw.screenshot.fullPage!==true||raw.screenshot.format!=='jpeg'||!Number.isInteger(raw.screenshot.quality)||raw.screenshot.quality<35||raw.screenshot.quality>90)fail('BROWSER_SCREENSHOT_INVALID');
  return stable(raw);
}
export function resolveBrowserRequest(rawRequest,{ledger=loadLedger()}={}){
  const request=validateRequest(rawRequest);if(request.descriptorId!==BROWSER_DESCRIPTOR)fail('BROWSER_DESCRIPTOR_REQUIRED');
  const descriptor=registryDescriptor(),op=obj(request.operationRequest,'OPERATION_REQUEST_INVALID'),proc=obj(request.constructionProcedure,'CONSTRUCTION_PROCEDURE_INVALID'),admission=obj(request.admissionReceipt,'ADMISSION_RECEIPT_INVALID');
  if(op.schema!=='REPOSITORY_OPERATION_REQUEST_v1'||proc.schema!=='REPOSITORY_CONSTRUCTION_PROCEDURE_v1')fail('OPERATION_DOCUMENT_SCHEMA_MISMATCH');
  if(admission.schema!=='REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1'||admission.result!=='ADMITTED_AND_LOCKED'||admission.operationStarted!==true||admission.workflowExecutionAuthorized!==true)fail('ADMISSION_NOT_ACTIVE');
  if(op.operationId!==admission.operationId||op.projectId!==admission.projectId||op.exactGoverningHead!==proc.exactGoverningHead)fail('ACTIVE_OPERATION_IDENTITY_MISMATCH');
  const lock=obj(admission.lock,'ADMISSION_LOCK_MISSING');if(lock.lockAcquired!==true||lock.operationId!==op.operationId||!Number.isInteger(lock.lockGeneration)||lock.lockGeneration<1)fail('ACTIVE_OPERATION_IDENTITY_MISMATCH');
  digest(lock.scopeHash,'SCOPE_HASH_INVALID');digest(admission.requestDigest,'REQUEST_DIGEST_INVALID');digest(admission.procedureLocatorDigest,'PROCEDURE_DIGEST_INVALID');
  const allowed=Array.isArray(op.allowedPaths)?op.allowedPaths.map(p=>repoPath(p,'OPERATION_ALLOWED_PATH_INVALID')):fail('OPERATION_ALLOWED_PATHS_INVALID');
  const pa=Array.isArray(proc.exactAllowedRepositoryPaths)?proc.exactAllowedRepositoryPaths.map(p=>repoPath(p,'PROCEDURE_ALLOWED_PATH_INVALID')):fail('PROCEDURE_ALLOWED_PATHS_INVALID');
  if(canonical([...allowed].sort())!==canonical([...pa].sort()))fail('REQUESTED_PATH_OUTSIDE_ADMITTED_SCOPE');
  const live=ledger?.activeScopes?.[lock.scopeHash];
  if(!live||live.operationId!==op.operationId||live.lockGeneration!==lock.lockGeneration||live.lockScope!==lock.lockScope||live.state!=='ADMITTED_LOCKED'||live.released!==false)fail('ACTIVE_OPERATION_IDENTITY_MISMATCH','ledger identity');
  const rd=hashObject(op),pd=hashObject(proc);if(rd!==admission.requestDigest||rd!==live.requestDigest||pd!==admission.procedureLocatorDigest||pd!==live.procedureLocatorDigest)fail('REQUEST_OR_PROCEDURE_DIGEST_MISMATCH');
  const toolchainHead=commit(op.exactGoverningHead,'TARGET_HEAD_NOT_AUTHORIZED'),contract=validateContract(op.subjectIdentity?.browserVerificationContract),browserSubjectHead=contract.candidateHead;
  return stable({descriptor,operationId:op.operationId,projectId:op.projectId,lockGeneration:lock.lockGeneration,scopeHash:lock.scopeHash,toolchainHead,browserSubjectHead,task:typeof op.subjectIdentity?.experimentId==='string'&&op.subjectIdentity.experimentId?op.subjectIdentity.experimentId.toUpperCase():op.operationId,paths:allowed,requestDigest:rd,procedureDigest:pd,admissionReceipt:admission,browserContract:contract});
}
function delegateLegacy(input,output){
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'bounded-carrier-legacy-')),worktree=path.join(temp,'worktree');let added=false;
  try{
    const head=git(['rev-parse','HEAD^{commit}']).trim();git(['worktree','add','--detach',worktree,head]);added=true;
    const bytes=Buffer.from(git(['cat-file','blob',LEGACY_CARRIER_BLOB],ROOT,['ignore','pipe','pipe']),'utf8');
    if(gitBlob(bytes)!==LEGACY_CARRIER_BLOB)fail('LEGACY_CARRIER_BLOB_MISMATCH');
    fs.writeFileSync(path.join(worktree,SELF_PATH),bytes);
    const child=cp.spawnSync(process.execPath,[SELF_PATH,'--input',path.resolve(input),'--output',path.resolve(output)],{cwd:worktree,env:{...process.env},shell:false,encoding:'utf8',maxBuffer:64*1024*1024});
    if(child.error)fail('LEGACY_CARRIER_EXECUTION_FAILURE',child.error.message);
    return Number.isInteger(child.status)?child.status:1;
  }finally{if(added){try{git(['worktree','remove','--force',worktree]);}catch{}}fs.rmSync(temp,{recursive:true,force:true});}
}
function executeBrowser(res){
  const current=git(['rev-parse','HEAD^{commit}']).trim();if(current!==res.toolchainHead)fail('TOOLCHAIN_HEAD_MISMATCH',{expected:res.toolchainHead,observed:current});
  ensureCommit(res.browserSubjectHead);const runner=path.join(ROOT,BROWSER_RUNNER_PATH),runnerBlob=gitBlob(fs.readFileSync(runner));
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'bounded-browser-carrier-')),subject=path.join(temp,'subject'),contractPath=path.join(temp,'contract.json'),nativePath=path.join(temp,'native.json');let added=false;
  try{
    git(['worktree','add','--detach',subject,res.browserSubjectHead]);added=true;if(git(['rev-parse','HEAD^{commit}'],subject).trim()!==res.browserSubjectHead)fail('BROWSER_SUBJECT_HEAD_CHECKOUT_FAILURE');clean(subject,'BROWSER_SUBJECT_WORKTREE_NOT_CLEAN');
    writeJson(contractPath,res.browserContract);
    const args=[runner,'--contract',contractPath,'--output',nativePath],child=cp.spawnSync(process.execPath,args,{cwd:subject,env:{PATH:process.env.PATH??'',HOME:temp,TMPDIR:process.env.RUNNER_TEMP??os.tmpdir(),LANG:process.env.LANG??'C.UTF-8',LC_ALL:process.env.LC_ALL??'C.UTF-8'},shell:false,encoding:'utf8',maxBuffer:64*1024*1024});
    clean(subject,'BROWSER_SUBJECT_WORKTREE_NOT_CLEAN');if(!fs.existsSync(nativePath))fail('NATIVE_RECEIPT_MISSING_OR_INVALID');
    const n=readJson(nativePath);if(n.schema!=='CANONICAL_BROWSER_VERIFICATION_RECEIPT_v1'||n.candidateHead!==res.browserSubjectHead||n.localhostOnly!==true||n.arbitraryUrlAccepted!==false||n.callerScriptAccepted!==false)fail('BROWSER_NATIVE_RECEIPT_BINDING_INVALID');
    return stable({schema:'BOUNDED_EXACT_HEAD_EXECUTION_RECEIPT_v1',result:n.result==='PASS'&&child.status===0?'COMMAND_EXECUTED_AND_PASSED':'COMMAND_EXECUTED_AND_RETURNED_NONPASS',descriptorId:BROWSER_DESCRIPTOR,executionClass:BROWSER_DESCRIPTOR,operationId:res.operationId,lockGeneration:res.lockGeneration,targetHead:res.toolchainHead,browserSubjectHead:res.browserSubjectHead,task:res.task,paths:res.paths,commandDigest:hashObject({executable:'node',scriptPath:BROWSER_RUNNER_PATH,runnerBlob,toolchainHead:res.toolchainHead,browserSubjectHead:res.browserSubjectHead,contractDigest:hashObject(res.browserContract)}),exactHeadVerified:true,workingTreeCleanBeforeAndAfter:true,commandExecuted:true,commandExitCode:Number.isInteger(child.status)?child.status:1,nativeReceiptSchema:n.schema,nativeReceiptDigest:sha256(fs.readFileSync(nativePath)),nativeReceiptRewritten:false,nativeReceipt:n,browserContractDigest:hashObject(res.browserContract),browserRunnerBlob:runnerBlob,canonicalOperationDerived:true,localhostOnly:true,screenshotEvidenceEmbedded:true,repositoryWritesPerformed:false,arbitraryCommandAuthority:false,callerSuppliedBundleAccepted:false,callerSuppliedBrowserScriptAccepted:false,callerSuppliedUrlAccepted:false,semanticAuthorityCreated:false,productAuthorityCreated:false});
  }finally{if(added){try{git(['worktree','remove','--force',subject]);}catch{}}fs.rmSync(temp,{recursive:true,force:true});}
}
export function runCarrier({request,ledger}={}){
  if(request?.descriptorId!==BROWSER_DESCRIPTOR)fail('BROWSER_DESCRIPTOR_REQUIRED_FOR_IN_PROCESS_RUN');
  return executeBrowser(resolveBrowserRequest(request,{ledger:ledger??loadLedger()}));
}
function main(){
  const a=parse(process.argv.slice(2)),raw=readJson(a.input);
  if(raw.descriptorId!==BROWSER_DESCRIPTOR){process.exitCode=delegateLegacy(a.input,a.output);return;}
  try{const r=runCarrier({request:raw});writeJson(a.output,r);if(r.result!=='COMMAND_EXECUTED_AND_PASSED')process.exitCode=2;}
  catch(e){writeJson(a.output,{schema:'BOUNDED_EXACT_HEAD_EXECUTION_FAILURE_v1',result:'FAIL_CLOSED',errorCode:e.code??'UNEXPECTED_CARRIER_ERROR',detail:e.detail??e.message,repositoryWritesPerformed:false,arbitraryCommandAuthority:false,callerSuppliedBundleAccepted:false,callerSuppliedBrowserScriptAccepted:false,callerSuppliedUrlAccepted:false,semanticAuthorityCreated:false,productAuthorityCreated:false});process.exitCode=1;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
