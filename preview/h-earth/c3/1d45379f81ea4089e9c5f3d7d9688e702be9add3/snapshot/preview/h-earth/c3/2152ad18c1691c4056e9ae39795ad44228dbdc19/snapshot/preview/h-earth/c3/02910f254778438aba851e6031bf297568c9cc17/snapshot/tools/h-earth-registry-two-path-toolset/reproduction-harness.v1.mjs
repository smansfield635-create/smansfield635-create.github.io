#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {assert,parseArgs,writeJson,requireCommit,diffNames,showText,blobAt,sha256,canonical,SUBJECT_HEAD,SUBJECT_BASE,OVERLAY_PATH,LOADER_PATH,PREDECESSOR_PATH,EXPECTED_REPAIR_PATHS,verifySynthetic} from './lib.v1.mjs';

function detachedLoaderCheck(head){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-two-path-'));
  try{
    execFileSync('git',['worktree','add','--detach',dir,head],{stdio:'pipe'});
    const u=new URL(`file://${path.join(dir,LOADER_PATH)}`).href;
    const script=`import(${JSON.stringify(u)}).then(m=>{const d=m.loadHEarthRepositoryRegistryValidatorDependencies();if(d.identityVerified!==true||d.exactHeadRegistrationVerified!==true)throw Error('DEPENDENCY_VERIFICATION_FAILED');console.log(JSON.stringify({loaderId:d.loaderId,identityVerified:d.identityVerified,exactHeadRegistrationVerified:d.exactHeadRegistrationVerified}));})`;
    return JSON.parse(execFileSync(process.execPath,['--input-type=module','--eval',script],{encoding:'utf8'}).trim());
  }finally{
    try{execFileSync('git',['worktree','remove','--force',dir],{stdio:'ignore'});}catch{}
    fs.rmSync(dir,{recursive:true,force:true});
  }
}
export function reproduce({baseHead,candidateHead,subjectHead,executionHolder}){
  requireCommit(baseHead);requireCommit(candidateHead);requireCommit(subjectHead);
  assert(subjectHead===SUBJECT_HEAD,'SUBJECT_HEAD_SUBSTITUTION');
  requireCommit(SUBJECT_BASE);
  const subjectPaths=diffNames(SUBJECT_BASE,subjectHead);
  assert(subjectPaths.length===25,`PR570_SUBJECT_PATH_COUNT_MISMATCH:${subjectPaths.length}`);
  const changedPaths=diffNames(baseHead,candidateHead);
  assert(JSON.stringify(changedPaths)===JSON.stringify(EXPECTED_REPAIR_PATHS),`TWO_PATH_SCOPE_MISMATCH:${JSON.stringify(changedPaths)}`);
  const overlaySource=showText(candidateHead,OVERLAY_PATH),loaderSource=showText(candidateHead,LOADER_PATH),predecessorSource=showText(candidateHead,PREDECESSOR_PATH);
  const semantic=verifySynthetic({changedPaths,overlaySource,loaderSource});
  assert(semantic.pass,`TWO_PATH_SEMANTIC_CHECK_FAILED:${JSON.stringify(semantic.checks)}`);
  assert(predecessorSource.includes('H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE'),'PREDECESSOR_NODE_MISSING');
  const runtime=detachedLoaderCheck(candidateHead);
  const r={
    schema:'H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPRODUCTION_RECEIPT_v1',
    result:'PASS_CLOSED_TWO_PATH_SUCCESSOR_REPRODUCED',
    executionHolder,baseHead,candidateHead,subjectHead,
    changedPaths,overlayBlob:blobAt(candidateHead,OVERLAY_PATH),loaderBlob:blobAt(candidateHead,LOADER_PATH),predecessorBlob:blobAt(candidateHead,PREDECESSOR_PATH),
    subjectChangedPathCount:subjectPaths.length,semanticChecks:semantic.checks,runtime,
    repairPerformed:false,productMutationPerformed:false,pr570Mutated:false,mergePerformed:false,packageFingerprint:null
  };
  r.packageFingerprint=sha256(canonical({...r,executionHolder:null,packageFingerprint:null}));
  return r;
}
if(import.meta.url===new URL(`file://${process.argv[1]}`).href){
  const a=parseArgs(process.argv.slice(2),['base-head','candidate-head','subject-head','execution-holder','output']);
  try{const r=reproduce({baseHead:a['base-head'],candidateHead:a['candidate-head'],subjectHead:a['subject-head'],executionHolder:a['execution-holder']});writeJson(a.output,r);}
  catch(e){writeJson(a.output,{schema:'H_EARTH_REGISTRY_TWO_PATH_SUCCESSOR_REPRODUCTION_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:e.message,repairPerformed:false,mergePerformed:false});process.exitCode=1;}
}
