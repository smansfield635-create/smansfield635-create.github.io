#!/usr/bin/env node
/** Frozen, read-only native Node qualification of the admitted Gen3200 woodland clearing. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const HEAD='4fc8503f810830532d093e7ce0c8c40f7d8c94f0';
export const BASE='d08fe2da638f3fe045202a7a4d46f8e59d5c72e8';
export const REPO='https://github.com/smansfield635-create/smansfield635-create.github.io.git';
export const SCHEMA='H_EARTH_GEN3200_NATIVE_QUALIFICATION_RECEIPT_v1';
export const WORLD='showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz';
export const WORLD_SHA256='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a';
export const GLOBAL='h-earth-3d/validation/h-earth.global-groundcover.v1.mjs';
export const MEADOW='h-earth-3d/validation/h-earth.meadow-mid-distance-patch-lod.v1.mjs';
export const SOURCE='showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';
export const BLOBS=Object.freeze({
  [GLOBAL]:'da8302c60f27186ad3ac3a65e19406ae1140c391',
  [MEADOW]:'539a386e55dc623b9e3e6968cbab16fcdd87c810',
  [SOURCE]:'79e67f5d66836d7a9cc637278c15bfeaecfcc201'
});
export const ALLOWED=Object.freeze(Object.keys(BLOBS).sort());
const sha256=s=>crypto.createHash('sha256').update(s).digest('hex');
const err=(code,detail=null)=>Object.assign(new Error(code),{code,detail});
const run=(command,args,cwd,timeout=120000)=>{
  const r=cp.spawnSync(command,args,{cwd,encoding:'utf8',timeout,maxBuffer:64*1024*1024,windowsHide:true});
  return {exitCode:r.status??1,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};
};
const git=(cwd,args,timeout=120000)=>{
  const result=run('git',args,cwd,timeout);
  if(result.exitCode!==0||result.error)throw err('EXACT_GIT_OPERATION_FAILED',{args,exitCode:result.exitCode,error:result.error,stderr:result.stderr.slice(-3500)});
  return result.stdout.trim();
};
function parse(argv){
  if(argv.length!==6)throw err('EXACT_ARGUMENT_COUNT_REQUIRED');
  const o={};
  for(let i=0;i<argv.length;i+=2){
    const k=argv[i],v=argv[i+1];
    if(!['--candidate-head','--execution-holder','--output'].includes(k)||!v||Object.hasOwn(o,k))throw err('CLOSED_ARGUMENT_INVALID',k);
    o[k]=v;
  }
  if(o['--candidate-head']!==HEAD)throw err('FROZEN_GEN3200_HEAD_MISMATCH');
  if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(o['--execution-holder']??''))throw err('EXECUTION_HOLDER_INVALID');
  if(!path.isAbsolute(o['--output']??''))throw err('ABSOLUTE_RECEIPT_PATH_REQUIRED');
  return o;
}
function summarize(name,args,result){
  const combined=(result.stderr+'\n'+result.stdout);
  const first=combined.match(/VERIFIED_PLANTING_TEMPLATE_LAYOUT:BARK|GEN3200_CLEARING_RUNTIME_LOW_MID_COVER_NOT_PLANTED|CANONICAL_GENERATOR_PREFIX_CHANGED|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|AssertionError[^\n]*|Error: [^\n]*|ERR_[A-Z_]+/);
  return {name,command:[process.execPath,...args],exitCode:result.exitCode,error:result.error,
    firstFailure:first?.[0]??(result.exitCode!==0?'NATIVE_NONZERO_WITHOUT_RECOGNIZED_ASSERTION':null),
    stdoutSha256:sha256(result.stdout),stderrSha256:sha256(result.stderr),
    stdoutBytes:Buffer.byteLength(result.stdout),stderrBytes:Buffer.byteLength(result.stderr),
    stdoutTail:result.stdout.slice(-8000),stderrTail:result.stderr.slice(-8000),
    actualNodeExecution:true};
}
export function qualify(a){
  const home=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-gen3200-native-'));
  const work=path.join(home,'candidate');
  const evidence={};
  const baseReceipt={schema:SCHEMA,operationId:'CONTROL_PLANE_H_EARTH_GEN3200_FIXED_NATIVE_QUALIFIER_REGISTRATION_20261109_001',
    candidateHead:HEAD,baselineHead:BASE,executionHolder:a['--execution-holder'],
    sourceMutationPerformed:false,productMutationPerformed:false,workflowMutationPerformed:false,
    branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
  try{
    git(home,['init','--quiet',work]);
    git(work,['remote','add','origin',REPO]);
    git(work,['config','core.sparseCheckout','true']);
    fs.writeFileSync(path.join(work,'.git','info','sparse-checkout'),[
      '/AI_ENTRYPOINT.json','/showroom/globe/h-earth/render/',
      '/showroom/globe/h-earth/functional-landscape/',
      '/showroom/globe/h-earth/vegetation-prototype/',
      '/h-earth-3d/'
    ].join('\n')+'\n');
    // Fetch only immutable Gen3200 and its exact governed baseline, not moving main.
    git(work,['fetch','--no-tags','--depth=16','--filter=blob:none','origin',HEAD],180000);
    git(work,['checkout','--detach','FETCH_HEAD'],180000);
    evidence.executedHead=git(work,['rev-parse','HEAD']);
    if(evidence.executedHead!==HEAD)throw err('CANDIDATE_HEAD_MISMATCH');
    git(work,['fetch','--no-tags','--depth=16','--filter=blob:none','origin',BASE],180000);
    git(work,['merge-base','--is-ancestor',BASE,HEAD]);
    evidence.changedPaths=git(work,['diff','--name-only',BASE,HEAD]).split(/\r?\n/).filter(Boolean).sort();
    if(JSON.stringify(evidence.changedPaths)!==JSON.stringify(ALLOWED))throw err('GEN3200_CANDIDATE_PATHS_DRIFT',evidence.changedPaths);
    evidence.gitBlobs={};
    for(const [p,want] of Object.entries(BLOBS)){
      const found=git(work,['rev-parse',HEAD+':'+p]);
      evidence.gitBlobs[p]=found;
      if(found!==want)throw err('ORIGINAL_CANDIDATE_BLOB_MISMATCH',{path:p,want,found});
      if(!fs.existsSync(path.join(work,p)))throw err('ORIGINAL_SOURCE_NOT_MATERIALIZED',p);
    }
    const worldBytes=fs.readFileSync(path.join(work,WORLD));
    evidence.canonicalWorld={path:WORLD,bytes:worldBytes.length,sha256:sha256(worldBytes)};
    if(evidence.canonicalWorld.sha256!==WORLD_SHA256)throw err('CANONICAL_WORLD_ASSET_IDENTITY_MISMATCH');
    evidence.cleanBefore=git(work,['status','--porcelain','--untracked-files=no'])==='';
    if(!evidence.cleanBefore)throw err('CANDIDATE_NOT_CLEAN_BEFORE');
    for(const p of [MEADOW,GLOBAL]){
      const result=run(process.execPath,['--check',p],work);
      if(result.exitCode!==0||result.error)throw err('ORIGINAL_NODE_SYNTAX_FAILURE',{path:p,stderr:result.stderr.slice(-3000)});
    }
    // Test order is fixed: standalone meadow first; global groundcover second.
    const meadowArgs=[MEADOW];
    const m=run(process.execPath,meadowArgs,work,420000);
    evidence.meadow=summarize('ORIGINAL_MEADOW_DISTANCE',meadowArgs,m);
    const globalArgs=[GLOBAL,'--candidate-head',HEAD,'--git-repository','.','--baseline',BASE];
    const g=run(process.execPath,globalArgs,work,600000);
    evidence.global=summarize('ORIGINAL_GLOBAL_GROUNDCOVER',globalArgs,g);
    evidence.cleanAfter=git(work,['status','--porcelain','--untracked-files=no'])==='';
    if(!evidence.cleanAfter)throw err('CANDIDATE_DIRTY_AFTER_NATIVE_TESTS');
    evidence.nodeVersion=process.version;
    const pass= m.exitCode===0&&!m.error&&g.exitCode===0&&!g.error;
    return {...baseReceipt,result:pass?'PASS_CLOSED':'FAIL_CLOSED',
      errorCode:pass?null:(evidence.meadow.exitCode!==0?'ORIGINAL_MEADOW_TEST_FAILED':'ORIGINAL_GLOBAL_TEST_FAILED'),evidence};
  }catch(e){
    return {...baseReceipt,result:'FAIL_CLOSED',errorCode:e.code??'EXACT_NATIVE_EXECUTION_FAILURE',detail:e.detail??e.message,evidence};
  }finally{fs.rmSync(home,{recursive:true,force:true});}
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
  let a=null;
  try{a=parse(process.argv.slice(2));const result=qualify(a);fs.mkdirSync(path.dirname(a['--output']),{recursive:true});fs.writeFileSync(a['--output'],JSON.stringify(result,null,2)+'\n');if(result.result!=='PASS_CLOSED')process.exitCode=1;}
  catch(e){const failure={schema:SCHEMA,result:'FAIL_CLOSED',errorCode:e.code??'ARGUMENT_INVALID',detail:e.detail??e.message,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};if(a?.['--output'])fs.writeFileSync(a['--output'],JSON.stringify(failure,null,2)+'\n');else process.stderr.write(JSON.stringify(failure)+'\n');process.exitCode=1;}
}
