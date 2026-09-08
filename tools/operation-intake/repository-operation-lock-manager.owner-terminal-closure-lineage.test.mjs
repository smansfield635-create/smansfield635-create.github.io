#!/usr/bin/env node
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonical,
  sha,
  stable,
  verifyCanonicalLockRefLineage
} from './repository-operation-lock-manager.v1.mjs';
import {
  LEDGER_PATH,
  OWNER_LOGIN,
  OWNER_TERMINAL_CLOSURE_PROVENANCE_SCHEMA,
  OWNER_TERMINAL_CLOSURE_TRANSPORT
} from './repository-operation-lock-lineage.v2.mjs';

const anchor='1'.repeat(40),head='2'.repeat(40),commitSha='ea03a39018ea886a997aebd4561ec4386afd9f9a',blobSha='3'.repeat(40);
const operationId='COMPASS_R11A_SOURCE_TRUTH_SHOT_CONSTRUCTION_20260908_002',lockScope='COMPASS:MAIN_ORIENTATION_CINEMATIC:R11A:SOURCE_TRUTH_SHOT_CONSTRUCTION',scopeHash='4'.repeat(64),governingHead='5'.repeat(40),requestDigest='6'.repeat(64),procedureLocatorDigest='7'.repeat(64),lockGeneration=2005,terminalDisposition='SUPERSEDED';

function terminalRow(){
  const row=stable({schema:'REPOSITORY_OPERATION_LOCK_v1',operationId,lockScope,scopeHash,state:'TERMINAL',governingHead,requestDigest,procedureLocatorDigest,lockGeneration,released:true,terminalDisposition});
  const authorityIdentity=stable({operationId,lockScope,scopeHash,governingHead,requestDigest,procedureLocatorDigest,lockGeneration});
  const terminalIdentity=stable({operationId,lockScope,scopeHash,governingHead,lockGeneration,terminalDisposition,state:'TERMINAL',released:true});
  const core=stable({schema:OWNER_TERMINAL_CLOSURE_PROVENANCE_SCHEMA,transportId:OWNER_TERMINAL_CLOSURE_TRANSPORT,source:{repository:'smansfield635-create/smansfield635-create.github.io',issueNumber:2843,commentId:5588700537,authorLogin:OWNER_LOGIN,authorAssociation:'OWNER',commentBodySha256:'8'.repeat(64),marker:'REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_V1'},authorityIdentity,terminalIdentity,compareAndSwap:{observedLedgerBlobSha:'9'.repeat(40),observedLockRefHead:'a'.repeat(40)}});
  return stable({...row,independentClosureProvenance:{...core,bindingDigest:sha(canonical(core))}});
}

function response(value){return new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}})}
function installFetch({mutateDetail=x=>x,mutateLedger=x=>x}={}){
  globalThis.fetch=async url=>{
    const value=String(url);
    if(value.includes('/compare/'))return response({status:'ahead',total_commits:1,files:[{filename:LEDGER_PATH}],commits:[{sha:commitSha,author:{login:OWNER_LOGIN},committer:{login:OWNER_LOGIN},commit:{message:`Close operation lock ${lockGeneration}: ${operationId} ${terminalDisposition}`,verification:{verified:false}}}]});
    if(value.endsWith(`/commits/${commitSha}`))return response(mutateDetail({sha:commitSha,author:{login:OWNER_LOGIN},committer:{login:OWNER_LOGIN},commit:{message:`Close operation lock ${lockGeneration}: ${operationId} ${terminalDisposition}`,verification:{verified:false}},files:[{filename:LEDGER_PATH,sha:blobSha}]}));
    if(value.endsWith(`/git/blobs/${blobSha}`))return response({encoding:'base64',content:Buffer.from(JSON.stringify(mutateLedger(stable({schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration,activeScopes:{},terminalHistory:[terminalRow()]})))).toString('base64')});
    throw new Error(`UNEXPECTED_URL:${value}`);
  };
}

test('production lineage accepts the provenance-bound owner terminal closure',async()=>{const original=globalThis.fetch;try{installFetch();const receipt=await verifyCanonicalLockRefLineage({repository:'smansfield635-create/smansfield635-create.github.io',token:'test',branchHead:head,anchorCommitSha:anchor});assert.equal(receipt.result,'CANONICAL_LOCK_REF_LINEAGE_VERIFIED');assert.equal(receipt.commitCount,1)}finally{globalThis.fetch=original}});
test('production lineage rejects source tampering',async()=>{const original=globalThis.fetch;try{installFetch({mutateLedger:ledger=>stable({...ledger,terminalHistory:ledger.terminalHistory.map(row=>stable({...row,independentClosureProvenance:stable({...row.independentClosureProvenance,source:{...row.independentClosureProvenance.source,authorLogin:'attacker'}})}))})});await assert.rejects(()=>verifyCanonicalLockRefLineage({repository:'smansfield635-create/smansfield635-create.github.io',token:'test',branchHead:head,anchorCommitSha:anchor}),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED')}finally{globalThis.fetch=original}});
test('production lineage rejects a non-ledger owner mutation',async()=>{const original=globalThis.fetch;try{installFetch({mutateDetail:detail=>({...detail,files:[{filename:'index.html',sha:blobSha}]})});await assert.rejects(()=>verifyCanonicalLockRefLineage({repository:'smansfield635-create/smansfield635-create.github.io',token:'test',branchHead:head,anchorCommitSha:anchor}),error=>error.code==='AUTHORITY_LEDGER_LINEAGE_UNTRUSTED')}finally{globalThis.fetch=original}});
