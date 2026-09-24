import test from 'node:test';
import assert from 'node:assert/strict';
import { canonical, sha, verifyCanonicalLockRefLineage } from './repository-operation-lock-manager.v1.mjs';
import { materializeLineageCheckpoint, verifyLineageCheckpoint } from './repository-operation-lock-lineage.v2.mjs';

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

test('materializer requires an already verified canonical lineage receipt',()=>{
  assert.throws(()=>materializeLineageCheckpoint({candidate:{...base,status:'CANDIDATE_UNMATERIALIZED',checkpoint:null},verifiedLineageReceipt:{result:'UNVERIFIED',branchHead:'a'.repeat(40),ledgerBlobSha:'b'.repeat(40),anchorCommitSha:'c'.repeat(40)}}),e=>e.code==='LINEAGE_CHECKPOINT_VERIFIED_LINEAGE_RECEIPT_REQUIRED');
});

test('materializer binds checkpoint only to verified lineage head, blob, and anchor',()=>{
  const candidate={...base,status:'CANDIDATE_UNMATERIALIZED',checkpoint:null};
  const verifiedLineageReceipt={result:'CANONICAL_LOCK_REF_LINEAGE_VERIFIED',branchHead:'1'.repeat(40),ledgerBlobSha:'2'.repeat(40),anchorCommitSha:'3'.repeat(40),commitCount:17};
  const checkpoint=materializeLineageCheckpoint({candidate,verifiedLineageReceipt});
  assert.equal(checkpoint.status,'ACTIVE_VERIFIED');
  assert.equal(checkpoint.authorityEffect,'NONE');
  assert.equal(checkpoint.checkpoint.checkpointCommitSha,verifiedLineageReceipt.branchHead);
  assert.equal(checkpoint.checkpoint.checkpointLedgerBlobSha,verifiedLineageReceipt.ledgerBlobSha);
  assert.equal(checkpoint.checkpoint.verifiedFromAnchorCommitSha,verifiedLineageReceipt.anchorCommitSha);
  assert.equal(verifyLineageCheckpoint(checkpoint).result,'LINEAGE_CHECKPOINT_VERIFIED');
});

const response=(status,value)=>({status,async text(){return JSON.stringify(value)}});

test('bounded lineage begins strictly at verified checkpoint and applies canonical mutation rules after it',async()=>{
  const checkpoint={...base,checkpoint:{...base.checkpoint,checkpointCommitSha:'4'.repeat(40),checkpointLedgerBlobSha:'5'.repeat(40),verifiedFromAnchorCommitSha:'6'.repeat(40),verificationReceiptSha256:'7'.repeat(64)}};
  const head='8'.repeat(40),originalFetch=globalThis.fetch,calls=[];
  globalThis.fetch=async url=>{const value=String(url);calls.push(value);if(value.includes(`/compare/${'4'.repeat(40)}...${head}`))return response(200,{status:'ahead',total_commits:1,files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json'}],commits:[{sha:head,author:{login:'github-actions[bot]'},commit:{message:'Close operation lock 9: TEST PASS_CLOSED',verification:{verified:true}}}]});throw new Error(`UNEXPECTED_URL:${value}`)};
  try{const r=await verifyCanonicalLockRefLineage({repository:'example/repository',token:'test-token',branchHead:head,lineageCheckpoint:checkpoint});assert.equal(r.result,'CANONICAL_LOCK_REF_LINEAGE_VERIFIED');assert.equal(r.anchorCommitSha,'4'.repeat(40));assert.equal(r.commitCount,1);assert.equal(calls.length,1)}finally{globalThis.fetch=originalFetch}
});

test('invalid checkpoint fails before any remote lineage request',async()=>{
  const originalFetch=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('SHOULD_NOT_FETCH')};
  try{await assert.rejects(()=>verifyCanonicalLockRefLineage({repository:'example/repository',token:'test-token',branchHead:'8'.repeat(40),lineageCheckpoint:{...base,status:'CANDIDATE_UNMATERIALIZED',checkpoint:null}}),e=>e.code==='LINEAGE_CHECKPOINT_NOT_ACTIVE_VERIFIED');assert.equal(calls,0)}finally{globalThis.fetch=originalFetch}
});

test('bounded lineage still rejects a non-ledger mutation after checkpoint',async()=>{
  const checkpoint={...base,checkpoint:{...base.checkpoint,checkpointCommitSha:'4'.repeat(40),checkpointLedgerBlobSha:'5'.repeat(40),verifiedFromAnchorCommitSha:'6'.repeat(40),verificationReceiptSha256:'7'.repeat(64)}},head='8'.repeat(40),originalFetch=globalThis.fetch;
  globalThis.fetch=async url=>response(200,{status:'ahead',total_commits:1,files:[{filename:'README.md'}],commits:[{sha:head,author:{login:'github-actions[bot]'},commit:{message:'Close operation lock 9: TEST PASS_CLOSED',verification:{verified:true}}}]});
  try{await assert.rejects(()=>verifyCanonicalLockRefLineage({repository:'example/repository',token:'test-token',branchHead:head,lineageCheckpoint:checkpoint}),e=>e.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED')}finally{globalThis.fetch=originalFetch}
});
