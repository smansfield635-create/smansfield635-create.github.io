import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXACT_LOCK_REF_LINEAGE_RECOVERIES,
  LEGACY_AUTHORITY_CUTOVER_COMMIT,
  verifyCanonicalLockRefLineage
} from './repository-operation-lock-manager.v1.mjs';

const response=(status,value)=>({status,async text(){return JSON.stringify(value)}});
const exact=EXACT_LOCK_REF_LINEAGE_RECOVERIES[0];
const head='9'.repeat(40);

function compareCommit(overrides={}){
  return {
    sha:exact.commitSha,
    author:{login:exact.authorLogin},
    commit:{message:exact.message,verification:{verified:false}},
    ...overrides
  };
}
function detail(overrides={}){
  return {
    sha:exact.commitSha,
    author:{login:exact.authorLogin},
    committer:{login:exact.committerLogin},
    commit:{message:exact.message,verification:{verified:false}},
    parents:[{sha:exact.parentSha}],
    files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json',sha:exact.ledgerBlobSha}],
    ...overrides
  };
}

async function run(summary=compareCommit(),commitDetail=detail()){
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async url=>{
    const value=String(url);
    if(value.includes(`/compare/${LEGACY_AUTHORITY_CUTOVER_COMMIT}...${head}`))return response(200,{status:'ahead',total_commits:1,files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json'}],commits:[summary]});
    if(value.endsWith(`/commits/${exact.commitSha}`))return response(200,commitDetail);
    throw new Error(`UNEXPECTED_URL:${value}`);
  };
  try{return await verifyCanonicalLockRefLineage({repository:'example/repository',token:'test-token',branchHead:head});}
  finally{globalThis.fetch=originalFetch;}
}

test('exact historical Gen1767 owner-connector lineage commit is accepted',async()=>{
  const result=await run();
  assert.equal(result.result,'CANONICAL_LOCK_REF_LINEAGE_VERIFIED');
  assert.equal(result.commitCount,1);
});

test('altered historical Gen1767 author remains fail closed',async()=>{
  await assert.rejects(()=>run(compareCommit(),detail({author:{login:'attacker'}})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});

test('altered historical Gen1767 message remains fail closed',async()=>{
  await assert.rejects(()=>run(compareCommit(),detail({commit:{message:`${exact.message} altered`,verification:{verified:false}}})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});

test('altered historical Gen1767 ledger blob remains fail closed',async()=>{
  await assert.rejects(()=>run(compareCommit(),detail({files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json',sha:'0'.repeat(40)}]})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});

test('unrelated unsigned owner commit remains fail closed',async()=>{
  await assert.rejects(()=>run(compareCommit({sha:'8'.repeat(40)}),detail()),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});