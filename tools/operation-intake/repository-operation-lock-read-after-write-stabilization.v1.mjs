#!/usr/bin/env node
import {
  acquireLocal,
  acquireRemote,
  closeRemote,
  scopeHash,
  sha,
  stable
} from './repository-operation-lock-manager.v1.mjs';

const REF='refs/heads/operation-locks/repository-operation-intake-v1';
const HEAD='1'.repeat(40);
const ACQ_COMMIT='a'.repeat(40);
const ACQ_BLOB='b'.repeat(40);
const BASE_BLOB='c'.repeat(40);
const BASE_HEAD='d'.repeat(40);
const TESTS=[];
const clone=v=>structuredClone(v);
const baseLedger=()=>({schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockRef:REF,lockGeneration:0,activeScopes:{},terminalHistory:[],allowedChangedPaths:['.github/operation-intake/active-operation-ledger.v1.json']});
const request=(operationId='A',lockScope='TEST:SCOPE')=>({operationId,lockScope,governingHead:HEAD,requestDigest:sha(operationId+':r'),procedureLocatorDigest:sha(operationId+':p')});
const acquired=(operationId='A',lockScope='TEST:SCOPE')=>acquireLocal(baseLedger(),request(operationId,lockScope));
const closure=(x,extra={})=>({operationId:x.lock.operationId,lockScope:x.lock.lockScope,lockGeneration:x.lock.lockGeneration,terminalDisposition:'PASS_CLOSED',acquisitionCommitSha:ACQ_COMMIT,committedLedgerBlobSha:ACQ_BLOB,stabilizationDelayMs:0,stabilizationMaxReads:4,closureCasMaxAttempts:4,...extra});
const check=(id,fn)=>TESTS.push(Promise.resolve().then(fn).then(detail=>({id,pass:true,detail:detail??null}),e=>({id,pass:false,detail:{errorCode:e.code||null,message:e.message}})));
const expectError=async(fn,code)=>{try{await fn()}catch(e){if(e.code===code)return e;throw new Error(`EXPECTED_${code}_GOT_${e.code||e.message}`)}throw new Error(`EXPECTED_${code}_BUT_SUCCEEDED`)};

check('STALE_POST_WRITE_EVENTUAL_VISIBILITY',async()=>{
  const x=acquired();
  const reads=[baseLedger(),baseLedger(),x.ledger];
  let n=0,written=null,waits=0;
  const io={
    readAtRef:async({ref})=>{if(ref!==ACQ_COMMIT)throw Error('REF');return{blob:ACQ_BLOB,ledger:clone(x.ledger)}},
    readCurrent:async()=>({blob:n<2?BASE_BLOB:ACQ_BLOB,head:n<2?BASE_HEAD:ACQ_COMMIT,ledger:clone(reads[Math.min(n++,2)])}),
    write:async({next})=>{written=clone(next);return{ok:true,commit:'e'.repeat(40),blob:'f'.repeat(40)}},
    wait:async()=>{waits+=1}
  };
  const r=await closeRemote(closure(x),io);
  if(!r.lockReleased||r.stabilizationReadCount!==3||r.closureCasAttempts!==1)throw Error('STABILIZATION_RECEIPT');
  if(written.activeScopes[scopeHash(x.lock.lockScope)])throw Error('LOCK_NOT_REMOVED');
  if(written.terminalHistory.at(-1)?.operationId!=='A')throw Error('TERMINAL_NOT_PRESERVED');
  if(waits!==2)throw Error('REREAD_WAIT_COUNT');
  return{stabilizationReadCount:r.stabilizationReadCount,waits};
});

check('PERMANENT_ABSENCE_FAILS_CLOSED',async()=>{
  const x=acquired();let reads=0;
  const io={readAtRef:async()=>({blob:ACQ_BLOB,ledger:clone(x.ledger)}),readCurrent:async()=>{reads+=1;return{blob:BASE_BLOB,head:BASE_HEAD,ledger:baseLedger()}},write:async()=>{throw Error('WRITE_MUST_NOT_RUN')},wait:async()=>{}};
  const e=await expectError(()=>closeRemote(closure(x,{stabilizationMaxReads:3}),io),'ACQUISITION_VISIBILITY_TIMEOUT');
  if(reads!==3)throw Error('UNBOUNDED_OR_WRONG_READ_COUNT');
  return{reads,errorCode:e.code};
});

check('ACQUISITION_ANCHOR_BLOB_MISMATCH_FAILS_CLOSED',async()=>{
  const x=acquired();
  const io={readAtRef:async()=>({blob:'9'.repeat(40),ledger:clone(x.ledger)}),readCurrent:async()=>{throw Error('CURRENT_MUST_NOT_RUN')},write:async()=>{throw Error('WRITE_MUST_NOT_RUN')},wait:async()=>{}};
  const e=await expectError(()=>closeRemote(closure(x),io),'ACQUISITION_LEDGER_BLOB_MISMATCH');
  return{errorCode:e.code};
});

check('WRONG_OPERATION_ID_FAILS_CLOSED',async()=>{
  const x=acquired();const bad=clone(x.ledger),h=scopeHash(x.lock.lockScope);bad.activeScopes[h].operationId='B';
  const io={readAtRef:async()=>({blob:ACQ_BLOB,ledger:clone(x.ledger)}),readCurrent:async()=>({blob:'1'.repeat(40),head:'2'.repeat(40),ledger:bad}),write:async()=>{throw Error('WRITE_MUST_NOT_RUN')},wait:async()=>{}};
  const e=await expectError(()=>closeRemote(closure(x),io),'LOCK_OPERATION_ID_MISMATCH');
  return{errorCode:e.code};
});

check('WRONG_GENERATION_FAILS_CLOSED',async()=>{
  const x=acquired();const bad=clone(x.ledger),h=scopeHash(x.lock.lockScope);bad.activeScopes[h].lockGeneration=99;
  const io={readAtRef:async()=>({blob:ACQ_BLOB,ledger:clone(x.ledger)}),readCurrent:async()=>({blob:'1'.repeat(40),head:'2'.repeat(40),ledger:bad}),write:async()=>{throw Error('WRITE_MUST_NOT_RUN')},wait:async()=>{}};
  const e=await expectError(()=>closeRemote(closure(x),io),'LOCK_GENERATION_MISMATCH');
  return{errorCode:e.code};
});

check('CONCURRENT_UNRELATED_MUTATION_RECOMPUTES_AFTER_CAS_CONFLICT',async()=>{
  const x=acquired();
  let current=clone(x.ledger),blob='1'.repeat(40),head='2'.repeat(40),writes=0,lastNext=null;
  const unrelatedScope='UNRELATED:SCOPE',uh=scopeHash(unrelatedScope),unrelated={schema:'REPOSITORY_OPERATION_LOCK_v1',operationId:'U',lockScope:unrelatedScope,scopeHash:uh,state:'ADMITTED_LOCKED',governingHead:HEAD,requestDigest:sha('u:r'),procedureLocatorDigest:sha('u:p'),lockGeneration:2,released:false};
  const io={
    readAtRef:async()=>({blob:ACQ_BLOB,ledger:clone(x.ledger)}),
    readCurrent:async()=>({blob,head,ledger:clone(current)}),
    write:async({blob:expected,next})=>{
      writes+=1;
      if(writes===1){
        current=stable({...current,lockGeneration:2,activeScopes:{...current.activeScopes,[uh]:unrelated}});blob='3'.repeat(40);head='4'.repeat(40);
        return{ok:false,errorCode:'LEDGER_COMPARE_AND_SWAP_CONFLICT',httpStatus:409};
      }
      if(expected!==blob)throw Error('DID_NOT_REBASE_ON_NEW_BLOB');
      lastNext=clone(next);current=clone(next);blob='5'.repeat(40);head='6'.repeat(40);return{ok:true,commit:'7'.repeat(40),blob};
    },
    wait:async()=>{}
  };
  const r=await closeRemote(closure(x),io);
  if(r.closureCasAttempts!==2)throw Error('CAS_RETRY_COUNT');
  if(!lastNext.activeScopes[uh])throw Error('UNRELATED_MUTATION_OVERWRITTEN');
  if(lastNext.activeScopes[scopeHash(x.lock.lockScope)])throw Error('TARGET_LOCK_NOT_CLOSED');
  return{closureCasAttempts:r.closureCasAttempts,unrelatedScopePreserved:true};
});

check('CLOSURE_CAS_RETRY_EXHAUSTION_FAILS_CLOSED',async()=>{
  const x=acquired();let writes=0;
  const io={readAtRef:async()=>({blob:ACQ_BLOB,ledger:clone(x.ledger)}),readCurrent:async()=>({blob:'1'.repeat(40),head:'2'.repeat(40),ledger:clone(x.ledger)}),write:async()=>{writes+=1;return{ok:false,errorCode:'LEDGER_COMPARE_AND_SWAP_CONFLICT',httpStatus:409}},wait:async()=>{}};
  const e=await expectError(()=>closeRemote(closure(x,{closureCasMaxAttempts:3}),io),'CLOSURE_CAS_RETRY_EXHAUSTED');
  if(writes!==3)throw Error('CAS_NOT_BOUNDED');
  return{writes,errorCode:e.code};
});

check('EXACTLY_ONE_WINNER_ONE_CAS_LOSER',async()=>{
  let current=baseLedger(),currentBlob='0'.repeat(40),currentHead='1'.repeat(40),readCount=0,release;
  const gate=new Promise(r=>{release=r});
  const io={
    readCurrent:async()=>{const snapshot=clone(current),blob=currentBlob,head=currentHead;readCount+=1;if(readCount===2)release();await gate;return{blob,head,ledger:snapshot}},
    write:async({blob,next})=>{if(blob!==currentBlob)return{ok:false,errorCode:'LEDGER_COMPARE_AND_SWAP_CONFLICT',httpStatus:409};current=clone(next);currentBlob=sha(JSON.stringify(next)).slice(0,40);currentHead=sha('head:'+currentBlob).slice(0,40);return{ok:true,commit:currentHead,blob:currentBlob}},
    wait:async()=>{}
  };
  const common={repository:'x/y',lockRef:REF,governingHead:HEAD,lockScope:'CAS:SCOPE'};
  const [a,b]=await Promise.all([
    acquireRemote({...common,operationId:'A',requestDigest:sha('a:r'),procedureLocatorDigest:sha('a:p')},io),
    acquireRemote({...common,operationId:'B',requestDigest:sha('b:r'),procedureLocatorDigest:sha('b:p')},io)
  ]);
  const winners=[a,b].filter(x=>x.lockAcquired),losers=[a,b].filter(x=>!x.lockAcquired);
  if(winners.length!==1||losers.length!==1)throw Error('CARDINALITY');
  if(losers[0].errorCode!=='LEDGER_COMPARE_AND_SWAP_CONFLICT'||losers[0].httpStatus!==409)throw Error('LOSER_CLASS');
  return{winner:winners[0].operationId,loser:losers[0].operationId};
});

check('LEGACY_UNANCHORED_CLOSE_REMAINS_BACKWARD_COMPATIBLE',async()=>{
  const x=acquired();let next;
  const io={readCurrent:async()=>({blob:'1'.repeat(40),head:'2'.repeat(40),ledger:clone(x.ledger)}),write:async(o)=>{next=clone(o.next);return{ok:true,commit:'3'.repeat(40),blob:'4'.repeat(40)}},wait:async()=>{},readAtRef:async()=>{throw Error('ANCHOR_MUST_NOT_RUN')}};
  const r=await closeRemote({operationId:'A',lockScope:'TEST:SCOPE',lockGeneration:1,terminalDisposition:'PASS_CLOSED'},io);
  if(r.stabilizationMode!=='LEGACY_SINGLE_READ'||!r.lockReleased||next.activeScopes[scopeHash('TEST:SCOPE')])throw Error('LEGACY_REGRESSION');
  return{stabilizationMode:r.stabilizationMode};
});

const results=await Promise.all(TESTS),failed=results.filter(x=>!x.pass);
const receipt={schema:'REPOSITORY_OPERATION_LOCK_READ_AFTER_WRITE_STABILIZATION_TEST_RECEIPT_v1',result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',testCount:results.length,passCount:results.length-failed.length,failCount:failed.length,tests:results};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
