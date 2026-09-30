import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXACT_LOCK_REF_LINEAGE_RECOVERIES,
  LEGACY_AUTHORITY_CUTOVER_COMMIT,
  verifyCanonicalLockRefLineage
} from './repository-operation-lock-manager.v1.mjs';

const response=(status,value)=>({status,async text(){return JSON.stringify(value)}});
const [acquire,successor]=EXACT_LOCK_REF_LINEAGE_RECOVERIES;
const head='9'.repeat(40);

const summary=r=>({sha:r.commitSha,author:{login:r.authorLogin},commit:{message:r.message,verification:{verified:false}}});
const detail=r=>({
  sha:r.commitSha,
  author:{login:r.authorLogin},
  committer:{login:r.committerLogin},
  commit:{message:r.message,verification:{verified:false}},
  parents:[{sha:r.parentSha}],
  files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json',sha:r.ledgerBlobSha}]
});

async function run({secondDetail=detail(successor)}={}){
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async url=>{
    const value=String(url);
    if(value.includes(`/compare/${LEGACY_AUTHORITY_CUTOVER_COMMIT}...${head}`))return response(200,{status:'ahead',total_commits:2,files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json'}],commits:[summary(acquire),summary(successor)]});
    if(value.endsWith(`/commits/${acquire.commitSha}`))return response(200,detail(acquire));
    if(value.endsWith(`/commits/${successor.commitSha}`))return response(200,secondDetail);
    throw new Error(`UNEXPECTED_URL:${value}`);
  };
  try{return await verifyCanonicalLockRefLineage({repository:'example/repository',token:'test-token',branchHead:head});}
  finally{globalThis.fetch=originalFetch;}
}

test('closed owner-connector migration lineage set is accepted end to end',async()=>{
  assert.equal(EXACT_LOCK_REF_LINEAGE_RECOVERIES.length,2);
  const result=await run();
  assert.equal(result.result,'CANONICAL_LOCK_REF_LINEAGE_VERIFIED');
  assert.equal(result.commitCount,2);
});

test('altered successor migration identity remains fail closed',async()=>{
  await assert.rejects(()=>run({secondDetail:{...detail(successor),author:{login:'attacker'}}}),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});