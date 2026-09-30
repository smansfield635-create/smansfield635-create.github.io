#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const RECEIPT_SCHEMA='WORKFLOW_LIFECYCLE_V2_REMOTE_EXECUTION_RECEIPT_v1';
const NATIVE_RECEIPT_SCHEMA='WORKFLOW_LIFECYCLE_RETIREMENT_CONTINUITY_RECEIPT_v2';
const ASSESSMENT_SCHEMA='WORKFLOW_LIFECYCLE_RETIREMENT_CONTINUITY_ASSESSMENT_v2';
const VERIFIER_PATH='.github/ai-router/workflow-lifecycle-continuity/workflow-lifecycle-continuity-verifier.v1.mjs';
const VERIFIER_BLOB='1252498ced4960ce7066a51b916f833d8b2895f6';
const DISCOVERY_PATH='.github/ai-router/workflow-lifecycle-continuity/consumer-discovery.v2.mjs';
const DISCOVERY_BLOB='074a0a0ca772f7e31d8552a5d05308c0bc49f3b8';
const REPOSITORY='smansfield635-create/smansfield635-create.github.io';

const stable=v=>Array.isArray(v)?v.map(stable):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v);
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
function fail(code,detail=null){const e=new Error(code);e.code=code;e.detail=detail;throw e;}
function run(command,args,{cwd,env=process.env}={}){const r=cp.spawnSync(command,args,{cwd,env,encoding:'utf8',maxBuffer:128*1024*1024});return{status:r.status??1,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};}
function git(root,args,allowFailure=false){const r=run('git',args,{cwd:root});if(!allowFailure&&(r.status!==0||r.error))fail('GIT_COMMAND_FAILED',`${args.join(' ')}:${r.stderr||r.error}`);return r.stdout.trim();}
function clean(root){return git(root,['status','--porcelain=v1','--untracked-files=all'])==='';}
function parse(argv){const out={selfTest:false};for(let i=0;i<argv.length;i++){const k=argv[i];if(k==='--self-test'){out.selfTest=true;continue;}if(!k.startsWith('--'))fail('ARGUMENT_INVALID',k);const v=argv[++i];if(v===undefined)fail('ARGUMENT_VALUE_MISSING',k);out[k.slice(2)]=v;}if(!out.output)fail('OUTPUT_REQUIRED');if(!out.selfTest)for(const k of ['subject-head','assessment-base64','execution-holder'])if(!out[k])fail('ARGUMENT_REQUIRED',k);return out;}
function writeJson(p,v){fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),JSON.stringify(stable(v),null,2)+'\n');}
function ensureHead(root,head){if(!/^[0-9a-f]{40}$/.test(head||''))fail('SUBJECT_HEAD_INVALID',head);let r=run('git',['cat-file','-e',`${head}^{commit}`],{cwd:root});if(r.status!==0){r=run('git',['fetch','--no-tags','origin',head],{cwd:root});if(r.status!==0||r.error)fail('SUBJECT_HEAD_UNAVAILABLE',head);}if(run('git',['cat-file','-e',`${head}^{commit}`],{cwd:root}).status!==0)fail('SUBJECT_HEAD_UNAVAILABLE',head);}
function verifyNativeBlobs(root,head){const v=git(root,['rev-parse',`${head}:${VERIFIER_PATH}`]);const d=git(root,['rev-parse',`${head}:${DISCOVERY_PATH}`]);if(v!==VERIFIER_BLOB)fail('VERIFIER_BLOB_MISMATCH',{expected:VERIFIER_BLOB,actual:v});if(d!==DISCOVERY_BLOB)fail('CONSUMER_DISCOVERY_BLOB_MISMATCH',{expected:DISCOVERY_BLOB,actual:d});return{verifierBlob:v,consumerDiscoveryBlob:d};}
function decodeAssessment(value){if(typeof value!=='string'||value.length<4||!/^[A-Za-z0-9+/]+={0,2}$/.test(value))fail('ASSESSMENT_BASE64_INVALID');let parsed;try{parsed=JSON.parse(Buffer.from(value,'base64').toString('utf8'));}catch(e){fail('ASSESSMENT_DECODE_FAILED',e.message);}if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))fail('ASSESSMENT_OBJECT_REQUIRED');return parsed;}
function baseReceipt(extra={}){return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',executionHolder:null,subjectHead:null,verifierPath:VERIFIER_PATH,verifierBlob:VERIFIER_BLOB,consumerDiscoveryPath:DISCOVERY_PATH,consumerDiscoveryBlob:DISCOVERY_BLOB,nativeVerifierExitCode:null,nativeReceiptSha256:null,nativeReceipt:null,repositoryCleanBefore:false,repositoryCleanAfter:false,subjectWorktreeCleanBefore:false,subjectWorktreeCleanAfter:false,productMutationPerformed:false,gapRegistryMutationPerformed:false,physicalRetirementPerformed:false,workflowMutationPerformed:false,branchCreated:false,genericCommandAuthority:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,...extra});}
function execute({root,subjectHead,assessmentBase64,executionHolder}){
 if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(executionHolder||''))fail('EXECUTION_HOLDER_INVALID');
 const assessment=decodeAssessment(assessmentBase64);
 if(assessment.schema!==ASSESSMENT_SCHEMA)fail('ASSESSMENT_SCHEMA_MISMATCH',assessment.schema);
 if(assessment.governingHead!==subjectHead)fail('ASSESSMENT_GOVERNING_HEAD_MISMATCH',{subjectHead,assessmentHead:assessment.governingHead});
 const repositoryCleanBefore=clean(root);if(!repositoryCleanBefore)fail('TOOLING_WORKTREE_DIRTY_BEFORE_EXECUTION');
 ensureHead(root,subjectHead);const ids=verifyNativeBlobs(root,subjectHead);
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-lifecycle-v2-remote-'));
 const subjectRoot=path.join(tmp,'subject');const assessmentPath=path.join(tmp,'assessment.json');const nativeOutput=path.join(tmp,'native-receipt.json');
 fs.writeFileSync(assessmentPath,JSON.stringify(stable(assessment),null,2)+'\n');
 let subjectWorktreeCleanBefore=false,subjectWorktreeCleanAfter=false,native=null,nativeReceipt=null;
 try{
  git(root,['worktree','add','--detach',subjectRoot,subjectHead]);
  const exact=git(subjectRoot,['rev-parse','HEAD^{commit}']);if(exact!==subjectHead)fail('SUBJECT_WORKTREE_HEAD_MISMATCH',{expected:subjectHead,actual:exact});
  subjectWorktreeCleanBefore=clean(subjectRoot);if(!subjectWorktreeCleanBefore)fail('SUBJECT_WORKTREE_DIRTY_BEFORE_EXECUTION');
  native=run('node',[VERIFIER_PATH,'--assessment',assessmentPath,'--output',nativeOutput,'--repo-root',subjectRoot,'--repository',REPOSITORY],{cwd:subjectRoot,env:process.env});
  if(!fs.existsSync(nativeOutput))fail('NATIVE_RECEIPT_MISSING',{status:native.status,stderr:native.stderr});
  try{nativeReceipt=JSON.parse(fs.readFileSync(nativeOutput,'utf8'));}catch(e){fail('NATIVE_RECEIPT_PARSE_FAILED',e.message);}
  if(nativeReceipt?.schema!==NATIVE_RECEIPT_SCHEMA)fail('NATIVE_RECEIPT_SCHEMA_MISMATCH',nativeReceipt?.schema);
  subjectWorktreeCleanAfter=clean(subjectRoot);if(!subjectWorktreeCleanAfter)fail('SUBJECT_WORKTREE_DIRTY_AFTER_EXECUTION');
 }finally{if(fs.existsSync(subjectRoot))run('git',['worktree','remove','--force',subjectRoot],{cwd:root});}
 const repositoryCleanAfter=clean(root);if(!repositoryCleanAfter)fail('TOOLING_WORKTREE_DIRTY_AFTER_EXECUTION');
 const nativeBytes=fs.readFileSync(nativeOutput);
 const passed=native.status===0&&nativeReceipt.result==='PASS_CLOSED_ELIGIBLE';
 return baseReceipt({result:passed?'PASS_CLOSED':'FAIL_CLOSED',errorCode:passed?null:'NATIVE_V2_ASSESSMENT_NOT_PASS_CLOSED_ELIGIBLE',executionHolder,subjectHead,verifierBlob:ids.verifierBlob,consumerDiscoveryBlob:ids.consumerDiscoveryBlob,nativeVerifierExitCode:native.status,nativeReceiptSha256:sha256(nativeBytes),nativeReceipt,repositoryCleanBefore,repositoryCleanAfter,subjectWorktreeCleanBefore,subjectWorktreeCleanAfter});
}
function selfTest(root){
 const head=git(root,['rev-parse','HEAD^{commit}']);const ids=verifyNativeBlobs(root,head);let bad64=false,badHead=false;
 try{decodeAssessment('%%%');}catch(e){bad64=e.code==='ASSESSMENT_BASE64_INVALID';}
 const encoded=Buffer.from(JSON.stringify({schema:ASSESSMENT_SCHEMA,governingHead:'0'.repeat(40)}),'utf8').toString('base64');
 try{const a=decodeAssessment(encoded);if(a.governingHead!==head)throw Object.assign(new Error('ASSESSMENT_GOVERNING_HEAD_MISMATCH'),{code:'ASSESSMENT_GOVERNING_HEAD_MISMATCH'});}catch(e){badHead=e.code==='ASSESSMENT_GOVERNING_HEAD_MISMATCH';}
 if(!bad64||!badHead)fail('SELF_TEST_NEGATIVE_FIXTURE_FAILED');
 return{schema:'WORKFLOW_LIFECYCLE_V2_REMOTE_EXECUTION_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',head,verifierBlob:ids.verifierBlob,consumerDiscoveryBlob:ids.consumerDiscoveryBlob,negativeFixtureCount:2,negativeFixturesPassed:2,genericCommandAuthority:false,productMutationPerformed:false,gapRegistryMutationPerformed:false,physicalRetirementPerformed:false,mergePerformed:false};
}
function main(){let args;try{args=parse(process.argv.slice(2));const root=process.cwd();const r=args.selfTest?selfTest(root):execute({root,subjectHead:args['subject-head'],assessmentBase64:args['assessment-base64'],executionHolder:args['execution-holder']});writeJson(args.output,r);if(!args.selfTest&&r.result!=='PASS_CLOSED')process.exitCode=1;}catch(e){const r=baseReceipt({errorCode:e.code??'UNEXPECTED_ERROR',detail:e.detail??e.message,executionHolder:args?.['execution-holder']??null,subjectHead:args?.['subject-head']??null});if(args?.output)writeJson(args.output,r);else process.stderr.write(JSON.stringify(r,null,2)+'\n');process.exitCode=1;}}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
