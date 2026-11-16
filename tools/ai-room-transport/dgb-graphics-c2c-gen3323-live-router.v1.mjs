#!/usr/bin/env node
/** C2-C Gen3323: fixed exact-head, read-only actual-live GitHub router qualification.
 * No Codespaces, generic agent invocation, mutable checkout identity, source mutation,
 * route widening, GitHub workflow change, adapter commit, merge, or publication.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const OPERATION='DGB_GRAPHICS_C2C_GEN3323_FIXED_LIVE_TWO_PATH_ROUTER_QUALIFICATION_20261116_001';
const SCHEMA='DGB_GRAPHICS_C2C_GEN3323_LIVE_TWO_PATH_ROUTER_QUALIFICATION_RECEIPT_v1';
const SOURCE='3a59780d37e4eaea4fa83e533ff311b5e752033e'; // adopted PR #7444 router merge
const ROUTER_BLOB='a6fb641242975150831f29be00c4e12eb8f230ed';
const REPO='https://github.com/smansfield635-create/smansfield635-create.github.io.git';
const TASK='DGB_GRAPHICS_C2C_TWO_FILE_ADAPTER_SOURCE_20261115_001';
const PATHS=Object.freeze([
  'assets/engine/dgb.native-sculpt-world-handoff.v1.mjs',
  'assets/engine/dgb.native-sculpt-world-handoff.v1.test.mjs'
]);
const EXPECTED_GEN=3323;
const EXPECTED_OWNER_COMMENT=6906987847;
const EXPECTED_GOVERNING='a8dc45d1d24bf0914a5621cdbc46ff48801f9525';
const EXPECTED_PROJECT='DIAMOND_GATE_GRAPHICS_ENGINE';
const ENFORCED_TIMEOUT_MS=180000;

function fail(code,detail='') {throw Object.assign(new Error(code+(detail?':'+detail:'')),{code});}
function check(value,code) {if(!value)fail(code);}
function run(exe,args,cwd,allowFailure=false) {
  const p=spawnSync(exe,args,{cwd,encoding:'utf8',timeout:ENFORCED_TIMEOUT_MS,maxBuffer:32*1024*1024,
    env:Object.fromEntries(['PATH','HOME','TMPDIR','TMP','TEMP','CI'].filter(x=>process.env[x]!==undefined).map(x=>[x,process.env[x]]))});
  if(p.error||(!allowFailure&&p.status!==0))fail('COMMAND_FAILED',`${exe}:${p.error?.message||p.stderr||p.stdout}`.slice(0,900));
  return {status:p.status,stdout:p.stdout||'',stderr:p.stderr||''};
}
function git(args,cwd,allowFailure=false) {return run('git',args,cwd,allowFailure).stdout.trim();}
function parseArgs(argv) {
  const out={};
  check(argv.length===6,'ARGUMENT_COUNT');
  for(let i=0;i<argv.length;i+=2){check(['--candidate-head','--execution-holder','--output'].includes(argv[i])&&out[argv[i]]===undefined&&argv[i+1],'ARGUMENT_KEYSET');out[argv[i]]=argv[i+1];}
  check(out['--candidate-head']===SOURCE,'EXACT_HEAD_MISMATCH');
  check(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(out['--execution-holder']),'HOLDER_INVALID');
  check(path.isAbsolute(out['--output']),'OUTPUT_ABSOLUTE_PATH_REQUIRED');
  return out;
}
function materialize(root) {
  fs.mkdirSync(root,{recursive:true});
  git(['init','--quiet','.'],root);
  git(['remote','add','origin',REPO],root);
  git(['sparse-checkout','init','--cone','--sparse-index'],root);
  git(['sparse-checkout','set','.github/ai-router','.github/operation-intake','tools'],root);
  git(['fetch','--no-tags','--depth=1','--filter=blob:none','origin',SOURCE],root);
  git(['checkout','--detach','FETCH_HEAD'],root);
  check(git(['rev-parse','HEAD'],root)===SOURCE,'SOURCE_HEAD_DRIFT');
  check(git(['hash-object','tools/repository-ai-entry-router.mjs'],root)===ROUTER_BLOB,'MERGED_ROUTER_BLOB_DRIFT');
  const registry=JSON.parse(fs.readFileSync(path.join(root,'.github/ai-router/router.v1.json'),'utf8'));
  const owners=[registry.routerInfrastructure,...(registry.projects||[]).filter(x=>x.status==='ACTIVE_REGISTERED_PROJECT')].filter(Boolean);
  const existing=new Set(owners.flatMap(x=>x.ownedExactPaths||[]));
  // Materialize exact registered legacy dependencies identically to accepted router CI.
  for(const rel of existing){
    check(!rel.startsWith('/')&&!rel.includes('..'),'REGISTERED_PATH_INVALID');
    const absolute=path.join(root,rel);
    if(fs.existsSync(absolute))continue;
    const read=spawnSync('git',['show',SOURCE+':'+rel],{cwd:root,encoding:null,timeout:ENFORCED_TIMEOUT_MS,maxBuffer:32*1024*1024});
    check(read.status===0&&!read.error,'REGISTERED_EXACT_FILE_UNAVAILABLE:'+rel);
    fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,read.stdout);
  }
  check(owners.filter(x=>x.projectId===EXPECTED_PROJECT).length===1,'REGISTERED_GRAPHICS_PROJECT_NOT_UNIQUE');
  check(PATHS.every(p=>!existing.has(p)),'C2C_PATHS_MUST_BE_UNREGISTERED_WITHOUT_LIVE_ADMISSION');
  return {registeredExactPaths:existing.size,sourceRouterBlob:ROUTER_BLOB};
}
function invoke(root,paths) {
  const dest=path.join(os.tmpdir(),'c2c-gen3323-route-'+crypto.randomBytes(6).toString('hex')+'.json');
  try {
    const args=['tools/repository-ai-entry-router.mjs','--mutation-intent','--task',TASK,...paths.flatMap(p=>['--path',p]),'--output',dest];
    const p=run(process.execPath,args,root,true);
    let receipt=null;try{receipt=JSON.parse(fs.readFileSync(dest,'utf8'))}catch{fail('EXACT_ROUTER_RECEIPT_UNAVAILABLE',p.stderr.slice(0,350));}
    return {exitCode:p.status,receipt};
  }finally{fs.rmSync(dest,{force:true});}
}
function validatePositive(result){
  const {exitCode,receipt}=result;
  check(exitCode===0&&receipt?.disposition==='PASS','LIVE_GEN3323_ROUTE_NOT_PASS');
  check(receipt?.schema==='REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v3','ROUTER_SCHEMA_MISMATCH');
  const proof=receipt.gen3323C2CAdmissionProvenance;
  check(proof?.eligible===true,'AUTHENTIC_GEN3323_PROVENANCE_MISSING');
  check(proof.lockGeneration===EXPECTED_GEN&&proof.operationId===TASK,'GEN3323_OPERATION_MISMATCH');
  check(proof.governingHead===EXPECTED_GOVERNING&&proof.sourceCommentId===EXPECTED_OWNER_COMMENT,'GEN3323_LOCK_IDENTITY_MISMATCH');
  check(proof.projectId===EXPECTED_PROJECT&&proof.authorityEffect==='NONE_EXACT_CANDIDATE_PATH_RECOGNITION_ONLY','GEN3323_AUTHORITY_CEILING_MISMATCH');
  check(Array.isArray(receipt.routes)&&receipt.routes.length===2,'ROUTE_COUNT_MISMATCH');
  const actual=receipt.routes.map(x=>x.path).sort(),expected=[...PATHS].sort();
  check(JSON.stringify(actual)===JSON.stringify(expected),'TWO_PATH_IDENTITY_MISMATCH');
  for(const r of receipt.routes)check(r.disposition==='PASS'&&r.routeClass==='AUTHENTIC_GEN3323_C2C_ADMITTED_CANDIDATE_PATH'&&r.projectId===EXPECTED_PROJECT,'ROUTE_PROMOTION_MISMATCH');
  return {lockRefHead:proof.lockRefHead,scopeHash:proof.scopeHash,authorityEffect:proof.authorityEffect,paths:actual,routeClass:'AUTHENTIC_GEN3323_C2C_ADMITTED_CANDIDATE_PATH'};
}
function validateNegative(result){
  check(result.exitCode!==0&&result.receipt?.disposition==='BLOCK','EXTRA_PATH_WAS_NOT_BLOCKED');
  check(!result.receipt?.gen3323C2CAdmissionProvenance?.eligible,'EXTRA_PATH_INHERITED_ADMISSION');
  return {additionalPath:'assets/engine/unadmitted-c2c-foreign.mjs',disposition:result.receipt.disposition,reasonCodes:result.receipt.reasonCodes||[]};
}
function main(){
  const inputs=parseArgs(process.argv.slice(2));const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dgb-c2c-fixed-live-router-'));
  try{
    const root=path.join(tmp,'src');const source=materialize(root);
    const positive=validatePositive(invoke(root,PATHS));
    const negative=validateNegative(invoke(root,[...PATHS,'assets/engine/unadmitted-c2c-foreign.mjs']));
    const output={schema:SCHEMA,result:'PASS_CLOSED',operationId:OPERATION,
      executionHolder:inputs['--execution-holder'],candidateHead:SOURCE,source,...source,
      gen3323Operation:TASK,gen3323AdmissionProvenance:positive,negativeExtraPath:negative,
      actualGitHubLiveRouterExecuted:true,adapterSourceCommitted:false,repositoryMutationPerformed:false,
      branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false,
      authorityEffect:'NONE_READONLY_QUALIFICATION_ONLY'};
    fs.writeFileSync(inputs['--output'],JSON.stringify(output,null,2)+'\n');
    process.stdout.write(JSON.stringify({schema:SCHEMA,result:output.result,gen3323:EXPECTED_GEN,routeCount:2,negativePass:true})+'\n');
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
try{main()}catch(error){process.stderr.write(JSON.stringify({schema:SCHEMA,result:'FAIL_CLOSED',errorCode:error.code||'UNEXPECTED',detail:String(error.message).slice(0,1200)})+'\n');process.exit(1)}
