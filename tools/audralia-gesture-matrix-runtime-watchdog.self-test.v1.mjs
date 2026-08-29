#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

export function createSemanticRuntimeGuard({
  overallMs=9*60*1000,
  noProgressMs=45*1000,
  pollMs=250,
  logger=entry=>console.log(JSON.stringify(entry))
}={}){
  const started=Date.now();
  let lastProgressAt=started;
  let lastCheckpoint=Object.freeze({profile:null,station:null,phase:'MATRIX_START',detail:null,elapsedMs:0});
  let sequence=0;

  function checkpoint({profile=null,station=null,phase,detail=null}={}){
    const now=Date.now();
    lastProgressAt=now;
    lastCheckpoint=Object.freeze({profile,station,phase:String(phase||'UNKNOWN'),detail,elapsedMs:now-started,sequence:++sequence});
    logger(Object.freeze({schema:'AUDRALIA_GESTURE_MATRIX_PROGRESS_v1',...lastCheckpoint}));
    return lastCheckpoint;
  }

  function snapshot(){
    const now=Date.now();
    return Object.freeze({startedAtMs:started,elapsedMs:now-started,lastProgressAgeMs:now-lastProgressAt,lastCheckpoint,overallMs,noProgressMs});
  }

  function failure(code,active,state=null){
    const receipt=Object.freeze({
      schema:'AUDRALIA_GESTURE_MATRIX_RUNTIME_TERMINATION_RECEIPT_v1',
      result:'FAIL',
      errorCode:code,
      active:Object.freeze({...active}),
      guard:snapshot(),
      browserState:state
    });
    const error=new Error(`${code} ${JSON.stringify(receipt)}`);
    error.code=code;
    error.receipt=receipt;
    return error;
  }

  async function runStep({profile=null,station=null,phase,deadlineMs=15000,task,stateProbe=null}){
    const active=Object.freeze({profile,station,phase});
    const stepStarted=Date.now();
    checkpoint({profile,station,phase:`${phase}:START`});
    let monitor;
    let rejectMonitor;
    const monitorPromise=new Promise((_,reject)=>{rejectMonitor=reject;});
    const inspect=async code=>{
      let state=null;
      if(stateProbe){try{state=await stateProbe();}catch(error){state={probeError:String(error?.message||error)};}}
      rejectMonitor(failure(code,active,state));
    };
    monitor=setInterval(()=>{
      const now=Date.now();
      if(now-started>=overallMs){clearInterval(monitor);void inspect('MATRIX_OVERALL_RUNTIME_CEILING');return;}
      if(now-stepStarted>=deadlineMs){clearInterval(monitor);void inspect('STEP_DEADLINE_EXCEEDED');return;}
      if(now-lastProgressAt>=noProgressMs){clearInterval(monitor);void inspect('SEMANTIC_NO_PROGRESS_WATCHDOG');}
    },Math.max(5,pollMs));
    try{
      const value=await Promise.race([Promise.resolve().then(task),monitorPromise]);
      checkpoint({profile,station,phase:`${phase}:PASS`});
      return value;
    }finally{
      clearInterval(monitor);
    }
  }

  checkpoint({phase:'MATRIX_START'});
  return Object.freeze({checkpoint,runStep,snapshot});
}

async function selfTest(){
  const silent=()=>{};
  const stalled=createSemanticRuntimeGuard({overallMs:250,noProgressMs:45,pollMs:5,logger:silent});
  let stalledError=null;
  try{
    await stalled.runStep({profile:'PHONE',station:'TERMINATOR',phase:'TRAVEL',deadlineMs:180,task:()=>new Promise(()=>{}),stateProbe:async()=>({camera:'frozen'})});
  }catch(error){stalledError=error;}
  assert.equal(stalledError?.code,'SEMANTIC_NO_PROGRESS_WATCHDOG');
  assert.equal(stalledError?.receipt?.active?.profile,'PHONE');
  assert.equal(stalledError?.receipt?.active?.station,'TERMINATOR');
  assert.equal(stalledError?.receipt?.browserState?.camera,'frozen');

  const progressing=createSemanticRuntimeGuard({overallMs:300,noProgressMs:55,pollMs:5,logger:silent});
  const result=await progressing.runStep({profile:'TABLET',station:'DARK_SIDE',phase:'TRAVEL',deadlineMs:220,task:async()=>{
    for(let i=0;i<4;i++){await sleep(25);progressing.checkpoint({profile:'TABLET',station:'DARK_SIDE',phase:`TRAVEL_PROGRESS_${i+1}`});}
    return 'PASS';
  }});
  assert.equal(result,'PASS');
  const receipt=Object.freeze({schema:'AUDRALIA_GESTURE_MATRIX_RUNTIME_WATCHDOG_SELF_TEST_v1',result:'PASS',stallTerminatesReadably:true,progressNotFalselyKilled:true});
  fs.writeFileSync('/tmp/audralia-gesture-matrix-runtime-watchdog-self-test.json',JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify(receipt,null,2));
}

const isMain=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(isMain)await selfTest();
