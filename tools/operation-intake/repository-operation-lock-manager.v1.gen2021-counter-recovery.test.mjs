import test from 'node:test';
import assert from 'node:assert/strict';
import { EXACT_GEN2021_LEDGER_COUNTER_RECOVERY as R, ledger, verifyExactGen2021HistoricalState } from './repository-operation-lock-manager.v1.mjs';

function fixture(){
  const row={
    schema:'REPOSITORY_OPERATION_LOCK_v1',operationId:R.operationId,lockScope:R.lockScope,scopeHash:R.scopeHash,state:'ADMITTED_LOCKED',
    governingHead:R.governingHead,requestDigest:R.requestDigest,procedureLocatorDigest:R.procedureLocatorDigest,lockGeneration:R.lockGeneration,released:false,
    independentAuthorityProvenance:{authorityIdentity:{operationId:R.operationId,lockScope:R.lockScope,scopeHash:R.scopeHash,governingHead:R.governingHead,requestDigest:R.requestDigest,procedureLocatorDigest:R.procedureLocatorDigest,lockGeneration:R.lockGeneration},compareAndSwap:{observedLedgerBlobSha:R.parentLedgerBlobSha,observedLockRefHead:R.parentSha}}
  };
  return {
    args:{commitSha:R.commitSha,parentSha:R.parentSha,parentLedgerBlobSha:R.parentLedgerBlobSha,resultingLedgerBlobSha:R.resultingLedgerBlobSha,
      parentLedger:{schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration:2020,activeScopes:{},terminalHistory:[]},
      resultingLedger:{schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration:2020,activeScopes:{[R.scopeHash]:row},terminalHistory:[]}},
    row
  };
}
const reject=(mutate)=>{const {args}=fixture();mutate(args);assert.throws(()=>verifyExactGen2021HistoricalState(args),e=>e.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED')};

test('Gen2021 exact immutable malformed historical state is admitted only by bounded recovery',()=>{const {args}=fixture();assert.equal(verifyExactGen2021HistoricalState(args).result,'EXACT_GEN2021_LEDGER_COUNTER_RECOVERED')});
test('Gen2021 altered commit SHA rejects',()=>reject(a=>a.commitSha='0'.repeat(40)));
test('Gen2021 altered parent SHA rejects',()=>reject(a=>a.parentSha='0'.repeat(40)));
test('Gen2021 altered parent blob rejects',()=>reject(a=>a.parentLedgerBlobSha='0'.repeat(40)));
test('Gen2021 altered resulting blob rejects',()=>reject(a=>a.resultingLedgerBlobSha='0'.repeat(40)));
test('Gen2021 altered scope hash rejects',()=>reject(a=>{const row=a.resultingLedger.activeScopes[R.scopeHash];delete a.resultingLedger.activeScopes[R.scopeHash];row.scopeHash='0'.repeat(64);a.resultingLedger.activeScopes['0'.repeat(64)]=row}));
test('Gen2021 altered operation ID rejects',()=>reject(a=>a.resultingLedger.activeScopes[R.scopeHash].operationId='ALTERED'));
test('Gen2021 altered row generation rejects',()=>reject(a=>a.resultingLedger.activeScopes[R.scopeHash].lockGeneration=2022));
test('Gen2021 parent row unexpectedly present rejects',()=>reject(a=>a.parentLedger.activeScopes[R.scopeHash]={...a.resultingLedger.activeScopes[R.scopeHash]}));
test('Gen2021 parent ledger generation other than 2020 rejects',()=>reject(a=>a.parentLedger.lockGeneration=2019));
test('Gen2021 resulting ledger generation other than 2020 rejects',()=>reject(a=>a.resultingLedger.lockGeneration=2021));
test('Gen2021 CAS parent commit mismatch rejects',()=>reject(a=>a.resultingLedger.activeScopes[R.scopeHash].independentAuthorityProvenance.compareAndSwap.observedLockRefHead='0'.repeat(40)));
test('Gen2021 CAS parent blob mismatch rejects',()=>reject(a=>a.resultingLedger.activeScopes[R.scopeHash].independentAuthorityProvenance.compareAndSwap.observedLedgerBlobSha='0'.repeat(40)));
test('global ledger invariant remains fail-closed for generic generation-ahead state',()=>{const {args}=fixture();assert.throws(()=>ledger(args.resultingLedger),e=>e.code==='ACTIVE_LOCK_GENERATION_AHEAD_OF_LEDGER')});
