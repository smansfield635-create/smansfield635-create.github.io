#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CANDIDATE='41a63ace8b540f2b3ce7f73b6395f90234c7dc3f';
const BASE='bb8b57eaf8c2b89a0ac1f75140654b6a2cf74122';
const OPERATION='AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001';
const SPARSE_PATHS=[
  'showroom/globe/audralia',
  'showroom/globe/h-earth/terrain-estate-construction-v1',
  'showroom/globe/h-earth/render',
  'h-earth-3d/integration',
  'h-earth-3d/terrain',
  'h-earth-3d/control-plane/run-8',
  'h-earth-3d/objects',
  'h-earth-3d/zones',
  'h-earth-3d/cells',
  'h-earth-3d/environment',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/audralia',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1',
  'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/render',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/control-plane/run-8',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/objects',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/zones',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/cells',
  'inspection/audralia-24057-exact/snapshot/h-earth-3d/environment'
];
const started=Date.now();
function phase(name,detail=''){console.log(`AUDRALIA_REPRO_PHASE ${name} elapsedMs=${Date.now()-started}${detail?` ${detail}`:''}`);}

function args(argv){
  const out={};
  for(let i=0;i<argv.length;i+=2){
    const k=argv[i],v=argv[i+1];
    if(!k?.startsWith('--')||v==null)throw new Error(`INVALID_ARGUMENTS:${k??'EOF'}`);
    out[k.slice(2)]=v;
  }
  return out;
}
function run(command,argv,{cwd,env=process.env,timeout=240000}={}){
  const r=cp.spawnSync(command,argv,{cwd,env,encoding:'utf8',timeout,maxBuffer:64*1024*1024});
  return {status:r.status??1,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};
}
function firstAssertion(stderr,stdout=''){
  const structural=/^[\s{}\[\],]*$/;
  const signal=/(AssertionError|ERR_ASSERTION|\bError:|_TIMEOUT\b|_MISSING\b|_DRIFT\b|_CHANGED\b|_FAILED\b|_FAILURE\b|CAUSALITY_FAILURE)/;
  for(const source of [stderr,stdout]){
    const lines=String(source||'').split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!structural.test(x));
    const exact=lines.find(x=>signal.test(x));
    if(exact)return exact;
  }
  return null;
}
function write(file,value){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),JSON.stringify(value,null,2)+'\n');}
function findChrome(){
  for(const bin of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){
    const r=run('which',[bin],{timeout:10000});
    if(r.status===0&&r.stdout.trim())return r.stdout.trim();
  }
  return null;
}
function git(cwd,argv,allow=false,timeout=120000){
  const r=run('git',argv,{cwd,timeout});
  if(!allow&&r.status!==0)throw new Error(`GIT_FAILED:${argv.join(' ')}:${r.stderr||r.error}`);
  return r;
}
function main(){
  const a=args(process.argv.slice(2));
  const output=a.output;
  if(!output)throw new Error('OUTPUT_REQUIRED');
  const executionHolder=a['execution-holder'];
  if(a['candidate-head']!==CANDIDATE)throw new Error('CANDIDATE_HEAD_MISMATCH');
  if(a['base-head']!==BASE)throw new Error('BASE_HEAD_MISMATCH');
  if(!executionHolder)throw new Error('EXECUTION_HOLDER_REQUIRED');

  const root=process.cwd();
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-gen1754-repro-'));
  const subject=path.join(temp,'candidate');
  let server=null;
  let receipt;
  try{
    phase('START');
    const origin=git(root,['config','--get','remote.origin.url']).stdout.trim();
    if(!origin)throw new Error('ORIGIN_URL_UNAVAILABLE');
    fs.mkdirSync(subject,{recursive:true});
    git(subject,['init','.']);
    git(subject,['remote','add','origin',origin]);

    phase('SPARSE_FETCH_START');
    const fetched=git(subject,['-c','protocol.version=2','fetch','--no-tags','--depth=1','--filter=blob:none','origin',CANDIDATE],true,120000);
    if(fetched.status!==0)throw new Error(`CANDIDATE_FETCH_FAILED:${firstAssertion(fetched.stderr,fetched.stdout)||fetched.error||'UNKNOWN'}`);
    phase('SPARSE_FETCH_DONE');

    git(subject,['sparse-checkout','init','--cone','--sparse-index']);
    git(subject,['sparse-checkout','set',...SPARSE_PATHS]);
    phase('SPARSE_CHECKOUT_START');
    git(subject,['checkout','--detach','FETCH_HEAD'],false,120000);
    const exact=git(subject,['rev-parse','HEAD^{commit}']).stdout.trim();
    if(exact!==CANDIDATE)throw new Error(`EXACT_CANDIDATE_MISMATCH:${exact}`);
    const sparseIndex=git(subject,['config','--bool','index.sparse']).stdout.trim();
    if(sparseIndex!=='true')throw new Error(`SPARSE_INDEX_NOT_ACTIVE:${sparseIndex||'unset'}`);
    const sparseEntries=git(subject,['ls-files','--sparse']).stdout.split(/\r?\n/).filter(Boolean).length;
    if(sparseEntries>=5000)throw new Error(`SPARSE_INDEX_BOUND_EXCEEDED:${sparseEntries}`);
    phase('SPARSE_CHECKOUT_DONE',`entries=${sparseEntries}`);

    phase('VERIFIER_READBACK_START');
    const verifier=git(subject,['show','HEAD:tools/audralia-weather-presentation-reconciliation-ci.mjs'],true);
    if(verifier.status!==0)throw new Error(`VERIFIER_EXACT_OBJECT_READBACK_FAILED:${firstAssertion(verifier.stderr,verifier.stdout)||verifier.error||'UNKNOWN'}`);
    fs.mkdirSync(path.join(subject,'tools'),{recursive:true});
    fs.writeFileSync(path.join(subject,'tools/audralia-weather-presentation-reconciliation-ci.mjs'),verifier.stdout);
    phase('VERIFIER_READBACK_DONE');

    const checks=[
      'showroom/globe/audralia/weather-presentation-reconciliation/exterior-classification.mjs',
      'showroom/globe/audralia/weather-presentation-reconciliation/clear-atmosphere.mjs',
      'showroom/globe/audralia/weather-presentation-reconciliation/exterior-weather.mjs',
      'showroom/globe/audralia/weather-presentation-reconciliation/loader-progress.mjs',
      'showroom/globe/audralia/weather-presentation-reconciliation/app.mjs',
      'showroom/globe/audralia/fap1-weather-presentation-v1.mjs',
      'showroom/globe/audralia/final-cloud-shader-composition-v1.mjs',
      'tools/audralia-weather-presentation-reconciliation-ci.mjs'
    ];
    phase('SYNTAX_START');
    for(const file of checks){
      const r=run('node',['--check',file],{cwd:subject,timeout:30000});
      if(r.status!==0)throw new Error(`SYNTAX_REPRODUCTION_FAILED:${file}:${firstAssertion(r.stderr,r.stdout)||r.error||'UNKNOWN'}`);
    }
    phase('SYNTAX_DONE');

    phase('PUPPETEER_INSTALL_START');
    const install=run('npm',['install','--no-save','--no-package-lock','--no-audit','--no-fund','--prefer-offline','puppeteer-core@24.15.0'],{cwd:subject,timeout:180000});
    if(install.status!==0)throw new Error(`PUPPETEER_INSTALL_FAILED:${firstAssertion(install.stderr,install.stdout)||install.error||'UNKNOWN'}`);
    phase('PUPPETEER_INSTALL_DONE');

    const chrome=findChrome();
    if(!chrome)throw new Error('CHROME_BINARY_UNAVAILABLE');
    phase('BROWSER_READY',`chrome=${path.basename(chrome)}`);

    server=cp.spawn('python3',['-m','http.server','4173','--bind','127.0.0.1'],{cwd:subject,stdio:'ignore'});
    phase('SERVER_START');
    let ready=false;
    for(let i=0;i<40;i++){
      const probe=run('curl',['-fsS','http://127.0.0.1:4173/showroom/globe/audralia/weather-presentation-reconciliation/'],{cwd:subject,timeout:5000});
      if(probe.status===0){ready=true;break;}
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,250);
    }
    if(!ready)throw new Error('EXACT_HEAD_SERVER_START_FAILED');
    phase('SERVER_READY');

    phase('VERIFIER_RUNNING');
    const execution=run('node',['tools/audralia-weather-presentation-reconciliation-ci.mjs'],{
      cwd:subject,
      env:{...process.env,CHROME_PATH:chrome},
      timeout:300000
    });
    if(execution.error)throw new Error(`VERIFIER_EXECUTION_TRANSPORT_FAILURE:${execution.error}`);
    const assertion=execution.status===0?null:firstAssertion(execution.stderr,execution.stdout);
    if(execution.status!==0&&!assertion)throw new Error('VERIFIER_FAILED_WITHOUT_EXTRACTABLE_ASSERTION');
    const disposition=execution.status===0?'CAUSAL_RUNTIME_PASS':'FIRST_ASSERTION_CAPTURED';
    phase('VERIFIER_DONE',`status=${execution.status} disposition=${disposition}`);
    receipt={
      schema:'AUDRALIA_GEN1754_EXACT_CANDIDATE_REPRODUCTION_RECEIPT_v1',
      result:disposition,
      operationId:OPERATION,
      executionHolder,
      baseHead:BASE,
      candidateHead:CANDIDATE,
      exactCandidateConfirmed:true,
      checkoutMode:'BOUNDED_SPARSE_INDEX_EXACT_CANDIDATE',
      sparseIndexEntries:sparseEntries,
      workflowLogRecoveryUsed:false,
      productMutationPerformed:false,
      mergePerformed:false,
      hook4Revealed:false,
      chromePathResolved:true,
      reproductionExitStatus:execution.status,
      firstAssertion:assertion,
      causalRuntimePass:execution.status===0
    };
    write(output,receipt);
    phase('RECEIPT_WRITTEN',`result=${disposition}`);
  }catch(error){
    phase('FAIL_CLOSED',String(error?.message||error).slice(0,180));
    receipt={
      schema:'AUDRALIA_GEN1754_EXACT_CANDIDATE_REPRODUCTION_RECEIPT_v1',
      result:'REPRODUCTION_INFRASTRUCTURE_FAIL_CLOSED',
      operationId:OPERATION,
      executionHolder:executionHolder??null,
      baseHead:BASE,
      candidateHead:CANDIDATE,
      exactCandidateConfirmed:false,
      workflowLogRecoveryUsed:false,
      productMutationPerformed:false,
      mergePerformed:false,
      hook4Revealed:false,
      causalRuntimePass:false,
      firstAssertion:null,
      infrastructureError:String(error?.message||error)
    };
    write(output,receipt);
    process.exitCode=1;
  }finally{
    try{server?.kill('SIGTERM');}catch{}
    try{fs.rmSync(temp,{recursive:true,force:true});}catch{}
  }
}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked)main();
