#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CANDIDATE='41a63ace8b540f2b3ce7f73b6395f90234c7dc3f';
const BASE='bb8b57eaf8c2b89a0ac1f75140654b6a2cf74122';
const OPERATION='AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001';

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
function firstAssertion(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  return lines.find(x=>/(AssertionError|Error:|ERR_ASSERTION|_TIMEOUT|_MISSING|_DRIFT|_CHANGED|_FAILED)/.test(x))||lines[0]||null;
}
function write(file,value){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),JSON.stringify(value,null,2)+'\n');}
function findChrome(){
  for(const bin of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){
    const r=run('which',[bin],{timeout:10000});
    if(r.status===0&&r.stdout.trim())return r.stdout.trim();
  }
  return null;
}
function git(cwd,argv,allow=false){
  const r=run('git',argv,{cwd,timeout:120000});
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
    if(git(root,['cat-file','-e',`${CANDIDATE}^{commit}`],true).status!==0){
      const fetched=git(root,['fetch','--no-tags','origin',CANDIDATE],true);
      if(fetched.status!==0)throw new Error(`CANDIDATE_FETCH_FAILED:${firstAssertion(fetched.stderr)}`);
    }
    git(root,['worktree','add','--detach',subject,CANDIDATE]);
    const exact=git(subject,['rev-parse','HEAD^{commit}']).stdout.trim();
    if(exact!==CANDIDATE)throw new Error(`EXACT_CANDIDATE_MISMATCH:${exact}`);

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
    for(const file of checks){
      const r=run('node',['--check',file],{cwd:subject,timeout:30000});
      if(r.status!==0)throw new Error(`SYNTAX_REPRODUCTION_FAILED:${file}:${firstAssertion(r.stderr||r.stdout)}`);
    }

    const install=run('npm',['install','--no-save','--no-package-lock','puppeteer-core@24.15.0'],{cwd:subject,timeout:180000});
    if(install.status!==0)throw new Error(`PUPPETEER_INSTALL_FAILED:${firstAssertion(install.stderr||install.stdout)}`);
    const chrome=findChrome();
    if(!chrome)throw new Error('CHROME_BINARY_UNAVAILABLE');

    server=cp.spawn('python3',['-m','http.server','4173','--bind','127.0.0.1'],{cwd:subject,stdio:'ignore'});
    let ready=false;
    for(let i=0;i<40;i++){
      const probe=run('curl',['-fsS','http://127.0.0.1:4173/showroom/globe/audralia/weather-presentation-reconciliation/'],{cwd:subject,timeout:5000});
      if(probe.status===0){ready=true;break;}
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,250);
    }
    if(!ready)throw new Error('EXACT_HEAD_SERVER_START_FAILED');

    const execution=run('node',['tools/audralia-weather-presentation-reconciliation-ci.mjs'],{
      cwd:subject,
      env:{...process.env,CHROME_PATH:chrome},
      timeout:240000
    });
    const combined=`${execution.stderr}\n${execution.stdout}`;
    const assertion=firstAssertion(combined);
    const disposition=execution.status===0?'CAUSAL_RUNTIME_PASS':'FIRST_ASSERTION_CAPTURED';
    receipt={
      schema:'AUDRALIA_GEN1754_EXACT_CANDIDATE_REPRODUCTION_RECEIPT_v1',
      result:disposition,
      operationId:OPERATION,
      executionHolder,
      baseHead:BASE,
      candidateHead:CANDIDATE,
      exactCandidateConfirmed:true,
      workflowLogRecoveryUsed:false,
      productMutationPerformed:false,
      mergePerformed:false,
      hook4Revealed:false,
      chromePathResolved:true,
      reproductionExitStatus:execution.status,
      firstAssertion:execution.status===0?null:assertion,
      causalRuntimePass:execution.status===0
    };
    write(output,receipt);
    if(disposition!=='CAUSAL_RUNTIME_PASS'&&!assertion)process.exitCode=1;
  }catch(error){
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
    try{git(root,['worktree','remove','--force',subject],true);}catch{}
    try{fs.rmSync(temp,{recursive:true,force:true});}catch{}
  }
}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked)main();
