import test from 'node:test';
import assert from 'node:assert/strict';
import { canonical, sha } from './repository-operation-lock-manager.v1.mjs';
import { verifyLineageCheckpoint } from './repository-operation-lock-lineage.v2.mjs';

const base={
  schema:'REPOSITORY_OPERATION_LOCK_LINEAGE_CHECKPOINT_v1',
  status:'ACTIVE_VERIFIED',
  authorityEffect:'NONE',
  lockRef:'refs/heads/operation-locks/repository-operation-intake-v1',
  ledgerPath:'.github/operation-intake/active-operation-ledger.v1.json',
  checkpoint:{
    checkpointCommitSha:'a'.repeat(40),
    checkpointLedgerBlobSha:'b'.repeat(40),
    verifiedFromAnchorCommitSha:'c'.repeat(40),
    verificationReceiptSha256:'d'.repeat(64)
  }
};

test('checkpoint verifier accepts only an explicitly active verified non-authority checkpoint',()=>{
  const r=verifyLineageCheckpoint(base);
  assert.equal(r.result,'LINEAGE_CHECKPOINT_VERIFIED');
  assert.equal(r.checkpointCommitSha,'a'.repeat(40));
});

test('unmaterialized checkpoint cannot self-certify current head',()=>{
  assert.throws(()=>verifyLineageCheckpoint({...base,status:'CANDIDATE_UNMATERIALIZED',checkpoint:null}),e=>e.code==='LINEAGE_CHECKPOINT_NOT_ACTIVE_VERIFIED');
});

test('checkpoint cannot create authority',()=>{
  assert.throws(()=>verifyLineageCheckpoint({...base,authorityEffect:'OPERATION_AUTHORITY'}),e=>e.code==='LINEAGE_CHECKPOINT_AUTHORITY_EFFECT_INVALID');
});

test('checkpoint commit binding tamper fails closed',()=>{
  assert.throws(()=>verifyLineageCheckpoint({...base,checkpoint:{...base.checkpoint,checkpointCommitSha:'not-a-sha'}}),e=>e.code==='LINEAGE_CHECKPOINT_COMMIT_INVALID');
});

test('checkpoint ledger blob binding tamper fails closed',()=>{
  assert.throws(()=>verifyLineageCheckpoint({...base,checkpoint:{...base.checkpoint,checkpointLedgerBlobSha:'0'.repeat(39)}}),e=>e.code==='LINEAGE_CHECKPOINT_LEDGER_BLOB_INVALID');
});

test('checkpoint verification receipt binding tamper fails closed',()=>{
  assert.throws(()=>verifyLineageCheckpoint({...base,checkpoint:{...base.checkpoint,verificationReceiptSha256:'0'.repeat(63)}}),e=>e.code==='LINEAGE_CHECKPOINT_RECEIPT_DIGEST_INVALID');
});
