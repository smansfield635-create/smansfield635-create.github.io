#!/usr/bin/env node
/** Exact-head, read-only, closed-world Node qualifier for the frozen H-Earth Gen3178 candidate.
 *  PRE-ADMISSION DRAFT: never run through canonical transport before its descriptor
 *  and this exact implementation have been admitted and registered.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const HEAD='d0d17645ddb3a9ab3b6a4e98d46ae26c797638e3';
export const BASE='fd2c38ccc78bdb90c99a9d03d7cd14dea21bb28b';
export const REPO='https://github.com/smansfield635-create/smansfield635-create.github.io.git';
export const RENDERER='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
export const TEST='h-earth-3d/validation/h-earth.proven-band-multitone-20261108.test.mjs';
export const SOURCE_BLOB='ae70579df6ceb460a81ae6fd5908b31533310b85';
export const TEST_BLOB='d24d2f079e017e6ca117805ada7b6b060027bcbc';
export const PARENT_SOURCE_BLOB='19eec736d247857a1ce232e693e583d3047079cf';
export const SCHEMA='H_EARTH_GEN3178_NATIVE_QUALIFICATION_RECEIPT_v1';
const cleanArgs=new Set(['--candidate-head','--execution-holder','--output']);
const passNames=[
 'one reversible shader composition edit and exact Gen3172 parent blob',
 'zero eligibility/native soil and saturated dark-olive endpoint are exact',
 'continuous multi-tone transition reduces the attributed band-class gradient',
 'resident macro signal yields organic spatial variance without endpoint drift'
];
const sha256=v=>crypto.createHash('sha256').update(v).digest('hex');
const sorted=a=>[...a].sort();
const stop=(code,details)=>{const e=new Error(code);e.code=code;e.details=details;throw e;};

export function parseArgs(argv){
 if(argv.length!==6)stop('EXACT_ARGUMENT_COUNT_REQUIRED');
 const result={};
 for(let i=0;i<argv.length;i+=2){
  if(!cleanArgs.has(argv[i])||result[argv[i]]!==undefined||!argv[i+1])stop('ARGUMENT_INVALID');
  result[argv[i]]=argv[i+1];
 }
 if(result['--candidate-head']!==HEAD)stop('FROZEN_CANDIDATE_HEAD_MISMATCH');
 if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(result['--execution-holder']||''))stop('EXECUTION_HOLDER_INVALID');
 if(!path.isAbsolute(result['--output']||''))stop('ABSOLUTE_OUTPUT_REQUIRED');
 return result;
}
export function parseNativeTap(stdout,exitCode){
 const totals={};
 for(const name of ['tests','pass','fail','cancelled','skipped','todo']){
  const m=stdout.match(new RegExp('^# '+name+' (\\d+)$','m'));
  totals[name]=m?Number(m[1]):null;
 }
 const cases=[...stdout.matchAll(/^ok ([1-4]) - (.+)$/gm)]
  .map(m=>({index:Number(m[1]),name:m[2],result:'PASS'}));
 if(exitCode!==0||totals.tests!==4||totals.pass!==4||totals.fail!==0||
    totals.cancelled!==0||totals.skipped!==0||totals.todo!==0||cases.length!==4||
    cases.some((item,i)=>item.index!==i+1||item.name!==passNames[i]))
  stop('FOCUSED_NATIVE_FOUR_CASE_NOT_PASS',{exitCode,totals,cases});
 return {totals,cases};
}
function run(cmd,args,cwd){
 const r=cp.spawnSync(cmd,args,{cwd,encoding:'utf8',timeout:180000,maxBuffer:64*1024*1024});
 return {exitCode:r.status??1,stdout:r.stdout||'',stderr:r.stderr||'',error:r.error?.message||null};
}
function requirePass(output,code){
 if(output.exitCode!==0||output.error)stop(code,{exitCode:output.exitCode,stderr:output.stderr,error:output.error});
 return output.stdout.trim();
}
function git(cwd,args){return requirePass(run('git',args,cwd),'GIT_COMMAND_FAILED');}
function writeReceipt(filename,receipt){
 fs.mkdirSync(path.dirname(filename),{recursive:true});
 fs.writeFileSync(filename,JSON.stringify(receipt,null,2)+'\n');
}
export function qualify(args){
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-gen3178-'));
 const repo=path.join(home,'checkout');
 const evidence={};
 const resultBase={schema:SCHEMA,candidateHead:HEAD,baseHead:BASE,
  executionHolder:args['--execution-holder'],sourceMutationPerformed:false,
  productMutationPerformed:false,branchCreated:false,mergePerformed:false,
  deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
 try{
  requirePass(run('git',['init',repo],home),'GIT_INIT_FAILED');
  git(repo,['remote','add','origin',REPO]);
  git(repo,['config','core.sparseCheckout','true']);
  fs.writeFileSync(path.join(repo,'.git','info','sparse-checkout'),
   '/showroom/globe/h-earth/render/\n/h-earth-3d/validation/\n/AI_ENTRYPOINT.json\n/AGENTS.md\n');
  git(repo,['fetch','--no-tags','--depth=1','--filter=blob:none','origin',HEAD]);
  git(repo,['checkout','--detach','FETCH_HEAD']);
  evidence.head=git(repo,['rev-parse','HEAD']);
  if(evidence.head!==HEAD)stop('CHECKOUT_HEAD_MISMATCH');
  evidence.cleanBefore=git(repo,['status','--porcelain'])==='';
  if(!evidence.cleanBefore)stop('SOURCE_DIRTY_BEFORE');
  // Inspect immutable commit object rather than assuming a branch name or moving ref.
  const rawCommit=git(repo,['cat-file','-p',HEAD]);
  evidence.parents=[...rawCommit.matchAll(/^parent ([a-f0-9]{40})$/gm)].map(x=>x[1]);
  if(evidence.parents.length!==1||evidence.parents[0]!==BASE)stop('QUALIFIED_PARENT_MISMATCH');
  evidence.rendererBlob=git(repo,['rev-parse',HEAD+':'+RENDERER]);
  evidence.testBlob=git(repo,['rev-parse',HEAD+':'+TEST]);
  if(evidence.rendererBlob!==SOURCE_BLOB||evidence.testBlob!==TEST_BLOB)
   stop('FROZEN_SOURCE_BLOB_MISMATCH');
  git(repo,['fetch','--no-tags','--depth=1','--filter=blob:none','origin',BASE]);
  evidence.parentRendererBlob=git(repo,['rev-parse',BASE+':'+RENDERER]);
  if(evidence.parentRendererBlob!==PARENT_SOURCE_BLOB)stop('PARENT_RENDERER_BLOB_MISMATCH');
  evidence.changedPaths=sorted(git(repo,['diff','--name-only',BASE,HEAD]).split(/\r?\n/).filter(Boolean));
  if(JSON.stringify(evidence.changedPaths)!==JSON.stringify(sorted([RENDERER,TEST])))
   stop('OPERATION_PATH_SCOPE_MISMATCH',evidence.changedPaths);
  const syntax=run(process.execPath,['--check',RENDERER],repo);
  evidence.syntax={command:'node --check '+RENDERER,exitCode:syntax.exitCode,
   stderr:syntax.stderr,stdoutSha256:sha256(syntax.stdout)};
  requirePass(syntax,'RENDERER_NODE_SYNTAX_FAILED');
  const test=run(process.execPath,['--test','--test-reporter=tap',TEST],repo);
  evidence.native={command:'node --test --test-reporter=tap '+TEST,exitCode:test.exitCode,
   stdout:test.stdout,stderr:test.stderr,stdoutSha256:sha256(test.stdout)};
  evidence.nativeSummary=parseNativeTap(test.stdout,test.exitCode);
  evidence.cleanAfter=git(repo,['status','--porcelain'])==='';
  if(!evidence.cleanAfter)stop('SOURCE_DIRTY_AFTER');
  evidence.nodeVersion=process.version;
  return {...resultBase,result:'PASS_CLOSED',evidence};
 }catch(error){
  return {...resultBase,result:'FAIL_CLOSED',errorCode:error.code||'UNEXPECTED_NATIVE_QUALIFICATION_FAILURE',
   detail:error.details||error.message,evidence};
 }finally{fs.rmSync(home,{recursive:true,force:true});}
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
 let args;
 try{args=parseArgs(process.argv.slice(2));const receipt=qualify(args);
  writeReceipt(args['--output'],receipt);if(receipt.result!=='PASS_CLOSED')process.exitCode=1;
 }catch(error){
  const receipt={schema:SCHEMA,result:'FAIL_CLOSED',errorCode:error.code||'ARGUMENT_INVALID',
   detail:error.details||error.message,sourceMutationPerformed:false,
   productMutationPerformed:false,branchCreated:false,mergePerformed:false,
   deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
  if(args?.['--output'])writeReceipt(args['--output'],receipt);
  else process.stderr.write(JSON.stringify(receipt)+'\n');
  process.exitCode=1;
 }
}
