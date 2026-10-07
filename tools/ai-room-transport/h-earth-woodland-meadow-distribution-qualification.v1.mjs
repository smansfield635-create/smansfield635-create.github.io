#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const CANDIDATE='35e7fc09a9fdae8df7fb9d0f1f90913f9b1d1fba';
const VALIDATOR='h-earth-3d/validation/h-earth.woodland-meadow-distribution-20261006.mjs';
const args=process.argv.slice(2);
const value=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null};
const candidate=value('--candidate-head');
const holder=value('--execution-holder');
const output=value('--output');
if(candidate!==CANDIDATE)throw new Error('EXACT_CANDIDATE_HEAD_MISMATCH');
if(!holder||!output)throw new Error('REQUIRED_ARGUMENT_MISSING');
const root=process.cwd();
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hearth-distribution-qualification-'));
const worktree=path.join(tmp,'candidate');
const mechanical=path.join(tmp,'mechanical.json');
const run=(cmd,a,opt={})=>spawnSync(cmd,a,{cwd:opt.cwd??root,encoding:'utf8',maxBuffer:32*1024*1024,...opt});
let added=false;
try{
 const add=run('git',['worktree','add','--detach',worktree,CANDIDATE]);
 if(add.status!==0)throw new Error('CANDIDATE_WORKTREE_FAILED:'+add.stderr);
 added=true;
 const head=run('git',['rev-parse','HEAD'],{cwd:worktree});
 if(head.status!==0||head.stdout.trim()!==CANDIDATE)throw new Error('CANDIDATE_BINDING_FAILED');
 const before=run('git',['status','--porcelain','--untracked-files=no'],{cwd:worktree});
 if(before.status!==0||before.stdout.trim()!=='')throw new Error('CANDIDATE_NOT_CLEAN_BEFORE');
 const exec=run('node',[VALIDATOR,'--output',mechanical],{cwd:worktree});
 let mechanicalReceipt=null;
 if(fs.existsSync(mechanical))mechanicalReceipt=JSON.parse(fs.readFileSync(mechanical,'utf8'));
 const after=run('git',['status','--porcelain','--untracked-files=no'],{cwd:worktree});
 const receipt={
  schema:'H_EARTH_WOODLAND_MEADOW_DISTRIBUTION_QUALIFICATION_RECEIPT_v1',
  result:exec.status===0&&mechanicalReceipt?.result==='PASS'&&mechanicalReceipt?.executedHead===CANDIDATE&&after.status===0&&after.stdout.trim()===''?'PASS':'FAIL',
  operationId:'H_EARTH_WOODLAND_MEADOW_DISTRIBUTION_20261006',
  executionHolder:holder,
  candidateHead:CANDIDATE,
  validatorPath:VALIDATOR,
  validatorExitCode:exec.status,
  mechanicalReceipt,
  stdout:exec.stdout,
  stderr:exec.stderr,
  candidateCleanAfter:after.status===0&&after.stdout.trim()==='',
  productMutationPerformed:false,
  mergePerformed:false,
  deploymentPerformed:false,
  releasePerformed:false,
  publicationPerformed:false
 };
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
 process.exitCode=receipt.result==='PASS'?0:1;
}finally{
 if(added)run('git',['worktree','remove','--force',worktree]);
 fs.rmSync(tmp,{recursive:true,force:true});
}
