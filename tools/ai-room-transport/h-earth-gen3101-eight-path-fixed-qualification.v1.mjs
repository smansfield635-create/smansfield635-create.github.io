#!/usr/bin/env node
/** Fixed, read-only qualification of the immutable Gen3101 repair candidate. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const OP = 'H_EARTH_SPATIAL_FRAME_SELECTION_20261104_001';
export const HEAD = '9e110af5ab0d3c43fdb2d9d5fae50f1eaef32dcf';
export const BASE = 'dd24b1682ad7f891c85a9178b56a9f8ae48f072b';
export const REPO = 'https://github.com/smansfield635-create/smansfield635-create.github.io.git';
export const ORIGINAL_PATHS = Object.freeze([
  'showroom/globe/h-earth/vegetation-prototype/route.js',
  'showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js',
  'showroom/globe/h-earth/vegetation-prototype/spatial-evidence.v1.js',
  'showroom/globe/h-earth/vegetation-prototype/spatial-selection-ui.v1.js',
  'tools/h-earth-loading-report.test.mjs',
  'tools/h-earth-spatial-evidence.test.mjs',
  'tools/h-earth-spatial-selection-ui.test.mjs',
  'h-earth-3d/evidence/spatial-diagnostics-v1/**'
]);
export const CHANGED = Object.freeze([
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen3096-admitted-candidate-scope.js',
  'h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  'tools/h-earth-gen3096-path-recognition.test.mjs',
  'tools/h-earth-repository-registry-auto-preflight.mjs',
  'tools/repository-ai-entry-router.mjs'
]);

const SCHEMA = 'H_EARTH_GEN3101_EIGHT_PATH_QUALIFICATION_RECEIPT_v1';
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const sorted = values => [...values].sort();
const sameSet = (a,b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
  JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
const stop = (code, details = null) => {
  const e = new Error(code); e.code = code; e.details = details; throw e;
};
export function parseArgs(argv) {
  if (argv.length !== 6) stop('EXACT_ARGUMENT_COUNT_REQUIRED');
  const result = {};
  for (let i=0;i<argv.length;i+=2) {
    if (!['--candidate-head','--execution-holder','--output'].includes(argv[i]) || result[argv[i]] || !argv[i+1]) stop('ARGUMENT_INVALID');
    result[argv[i]] = argv[i+1];
  }
  if (result['--candidate-head'] !== HEAD) stop('CANDIDATE_HEAD_NOT_FROZEN');
  if (!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(result['--execution-holder'] ?? '')) stop('EXECUTION_HOLDER_INVALID');
  if (!result['--output']) stop('OUTPUT_REQUIRED');
  return result;
}
export function assertNativeReceipt(receipt) {
  if (receipt?.activationStatus !== 'ACTIVATED' || receipt.dependenciesVerified !== true ||
      receipt.finalDisposition !== 'PASS' || receipt.mutationMayProceed !== false ||
      receipt.operationScopedCandidateRecognition !== true ||
      receipt.admissionProvenance?.eligible !== true ||
      receipt.admissionProvenance?.operationId !== OP ||
      !sameSet(receipt.pathClassification?.normalizedPaths,ORIGINAL_PATHS.map(p=>'/'+p))) stop('NATIVE_EIGHT_PATH_NOT_QUALIFIED');
  if (receipt.boundaries?.readOnlyPreflight !== true || receipt.boundaries?.mutationAuthorityCreated !== false || receipt.boundaries?.mergeAuthorityCreated !== false) stop('NATIVE_AUTHORITY_BOUNDARY_INVALID');
  return true;
}
export function assertRouterReceipt(receipt) {
  const routes=receipt?.routes;
  if (receipt?.disposition !== 'PASS' || !sameSet(routes?.map(r=>r.path), ORIGINAL_PATHS) ||
      routes.filter(r=>r.routeClass === 'AUTHENTIC_GEN3096_ADMITTED_TEST_PATH' && r.projectId === 'H_EARTH' && r.disposition === 'PASS').length !== 3 ||
      receipt.gen3096AdmissionProvenance?.eligible !== true) stop('AI_ROUTER_EIGHT_PATH_NOT_QUALIFIED');
  return true;
}
function exec(cmd,args,cwd) {
  const r=cp.spawnSync(cmd,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,timeout:180000});
  return {exitCode:r.status ?? 1,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};
}
function requirePass(result,reason) {if(result.exitCode !== 0 || result.error)stop(reason,{exitCode:result.exitCode,stderr:result.stderr,error:result.error});return result.stdout.trim();}
function git(dir,args) {return requirePass(exec('git',args,dir),'GIT_EXECUTION_FAILED');}
function read(pathName) {try{return JSON.parse(fs.readFileSync(pathName,'utf8'));}catch(error){stop('RECEIPT_READ_FAILED',error.message);}}
function write(file,value) {fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),JSON.stringify(value,null,2)+'\n');}

export function validateTestOutput(text, exitCode) {
  if(exitCode!==0 || !/^# tests 9$/m.test(text) || !/^# pass 9$/m.test(text) || !/^# fail 0$/m.test(text))stop('NINE_CASE_NODE_SUITE_NOT_PASS');
  return true;
}

export function runQualification(args){
  const work = fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-gen3101-eight-'));
  const repoDir=path.join(work,'candidate');
  const nativePath=path.join(work,'native.json');
  const routerPath=path.join(work,'router.json');
  const evidence={};
  try {
    requirePass(exec('git',['init',repoDir],work),'GIT_INIT_FAILED');
    git(repoDir,['remote','add','origin',REPO]);
    git(repoDir,['config','core.sparseCheckout','true']);
    fs.writeFileSync(path.join(repoDir,'.git','info','sparse-checkout'), '/tools/\n/h-earth-3d/registry/\n/.github/\n/AI_ENTRYPOINT.json\n/AGENTS.md\n');
    git(repoDir,['fetch','--no-tags','--depth=1','--filter=blob:none','origin',HEAD]);
    git(repoDir,['checkout','--detach','FETCH_HEAD']);
    if(git(repoDir,['rev-parse','HEAD']) !== HEAD)stop('CANDIDATE_HEAD_MISMATCH');
    evidence.candidateCleanBefore=git(repoDir,['status','--porcelain'])==='';
    if(!evidence.candidateCleanBefore)stop('CANDIDATE_DIRTY_BEFORE');
    git(repoDir,['fetch','--no-tags','--depth=1','--filter=blob:none','origin',BASE]);
    const changed=sorted(git(repoDir,['diff','--name-only',BASE,HEAD]).split(/\r?\n/).filter(Boolean));
    evidence.changedPaths=changed;
    if(!sameSet(changed,CHANGED))stop('CHANGED_SCOPE_MISMATCH',changed);
    const node=process.execPath;
    for(const file of CHANGED) {
      const syntax=exec(node,['--check',file],repoDir);
      requirePass(syntax,'SYNTAX_FAILED:'+file);
    }
    evidence.checkedFiles=CHANGED.length;
    const tests=exec(node,['--experimental-default-type=module','--test','--test-reporter=tap','tools/h-earth-gen3096-path-recognition.test.mjs'],repoDir);
    evidence.tests={exitCode:tests.exitCode,sha256:sha(tests.stdout),stdout:tests.stdout,stderr:tests.stderr};
    validateTestOutput(tests.stdout,tests.exitCode);
    const flags=ORIGINAL_PATHS.flatMap(p=>['--path',p]);
    const native=exec(node,['--experimental-default-type=module','tools/h-earth-repository-registry-auto-preflight.mjs','--mutation-intent','--task',OP,...flags,'--output',nativePath],repoDir);
    evidence.nativeExecution={exitCode:native.exitCode,stdoutSha256:sha(native.stdout),stderr:native.stderr};
    if(!fs.existsSync(nativePath))stop('NATIVE_RECEIPT_MISSING');
    evidence.nativeReceipt=read(nativePath);
    assertNativeReceipt(evidence.nativeReceipt);
    if(native.exitCode!==0)stop('NATIVE_PASS_EXIT_NONZERO');
    const router=exec(node,['--experimental-default-type=module','tools/repository-ai-entry-router.mjs','--mutation-intent','--task',OP,...flags,'--output',routerPath],repoDir);
    evidence.routerExecution={exitCode:router.exitCode,stdoutSha256:sha(router.stdout),stderr:router.stderr};
    if(!fs.existsSync(routerPath))stop('ROUTER_RECEIPT_MISSING');
    evidence.routerReceipt=read(routerPath);
    assertRouterReceipt(evidence.routerReceipt);
    if(router.exitCode!==0)stop('ROUTER_PASS_EXIT_NONZERO');
    evidence.candidateCleanAfter=git(repoDir,['status','--porcelain'])==='';
    if(!evidence.candidateCleanAfter)stop('CANDIDATE_DIRTY_AFTER');
    return {schema:SCHEMA,result:'PASS_CLOSED',candidateHead:HEAD,baseHead:BASE,executionHolder:args['--execution-holder'],evidence,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
  } catch(error) {
    return {schema:SCHEMA,result:'FAIL_CLOSED',errorCode:error.code??'UNEXPECTED_QUALIFICATION_FAILURE',detail:error.details??error.message,candidateHead:HEAD,baseHead:BASE,executionHolder:args['--execution-holder'],evidence,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
  } finally {fs.rmSync(work,{recursive:true,force:true});}
}
const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if(invoked){
  let a;try{a=parseArgs(process.argv.slice(2));const result=runQualification(a);write(a['--output'],result);if(result.result!=='PASS_CLOSED')process.exitCode=1;}
  catch(error){const out=a?.['--output'];const result={schema:SCHEMA,result:'FAIL_CLOSED',errorCode:error.code??'ARGUMENT_INVALID',detail:error.details??error.message,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};if(out)write(out,result);else process.stderr.write(JSON.stringify(result)+'\n');process.exitCode=1;}
}
