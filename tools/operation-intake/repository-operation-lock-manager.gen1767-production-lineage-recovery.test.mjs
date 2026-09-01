import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXACT_LOCK_REF_LINEAGE_RECOVERIES,
  LEGACY_AUTHORITY_CUTOVER_COMMIT,
  verifyCanonicalLockRefLineage
} from './repository-operation-lock-manager.v1.mjs';

const response=(status,value)=>({status,async text(){return JSON.stringify(value)}});
const head='9'.repeat(40);

function compareCommit(exact,overrides={}){
  return {
    sha:exact.commitSha,
    author:{login:exact.authorLogin},
    commit:{message:exact.message,verification:{verified:false}},
    ...overrides
  };
}
function detail(exact,overrides={}){
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

async function run(exact,summary=compareCommit(exact),commitDetail=detail(exact)){
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

for (const exact of EXACT_LOCK_REF_LINEAGE_RECOVERIES) {
  test(`exact owner-connector lineage commit ${exact.commitSha} is accepted`,async()=>{
    const result=await run(exact);
    assert.equal(result.result,'CANONICAL_LOCK_REF_LINEAGE_VERIFIED');
    assert.equal(result.commitCount,1);
  });

  test(`altered owner for ${exact.commitSha} remains fail closed`,async()=>{
    await assert.rejects(()=>run(exact,compareCommit(exact),detail(exact,{author:{login:'attacker'}})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
  });

  test(`altered message for ${exact.commitSha} remains fail closed`,async()=>{
    await assert.rejects(()=>run(exact,compareCommit(exact),detail(exact,{commit:{message:`${exact.message} altered`,verification:{verified:false}}})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
  });

  test(`altered ledger blob for ${exact.commitSha} remains fail closed`,async()=>{
    await assert.rejects(()=>run(exact,compareCommit(exact),detail(exact,{files:[{filename:'.github/operation-intake/active-operation-ledger.v1.json',sha:'0'.repeat(40)}]})),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
  });
}

test('unrelated unsigned owner commit remains fail closed',async()=>{
  const exact=EXACT_LOCK_REF_LINEAGE_RECOVERIES[0];
  await assert.rejects(()=>run(exact,compareCommit(exact,{sha:'8'.repeat(40)}),detail(exact)),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED');
});
