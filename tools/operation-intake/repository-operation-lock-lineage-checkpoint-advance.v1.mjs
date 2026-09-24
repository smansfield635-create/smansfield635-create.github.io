#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

const sha256=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const fail=(code,detail=null)=>{const e=new Error(code);e.code=code;e.detail=detail;throw e};
const hex=(v,n,code)=>{if(typeof v!=='string'||!new RegExp(`^[0-9a-f]{${n}}$`).test(v))fail(code);return v};

export function advanceCheckpoint({candidateCheckpoint,verifiedLineageReceipt,endpointLedgerBlobSha}) {
  if(!candidateCheckpoint||candidateCheckpoint.schema!=='REPOSITORY_OPERATION_LOCK_LINEAGE_CHECKPOINT_v1')fail('CHECKPOINT_SCHEMA_INVALID');
  if(candidateCheckpoint.status!=='CANDIDATE_UNMATERIALIZED'&&candidateCheckpoint.status!=='ACTIVE_VERIFIED')fail('CHECKPOINT_STATUS_INVALID');
  if(candidateCheckpoint.authorityEffect!=='NONE')fail('CHECKPOINT_AUTHORITY_EFFECT_INVALID');
  if(!verifiedLineageReceipt||verifiedLineageReceipt.result!=='CANONICAL_LOCK_REF_LINEAGE_VERIFIED')fail('VERIFIED_LINEAGE_RECEIPT_REQUIRED');
  const endpoint=hex(verifiedLineageReceipt.branchHead,40,'ENDPOINT_COMMIT_INVALID');
  const blob=hex(endpointLedgerBlobSha,40,'ENDPOINT_LEDGER_BLOB_INVALID');
  const verifiedAnchor=hex(verifiedLineageReceipt.anchorCommitSha,40,'VERIFIED_ANCHOR_INVALID');
  const prior=candidateCheckpoint.checkpoint;
  if(prior){
    const priorHead=hex(prior.checkpointCommitSha,40,'PRIOR_CHECKPOINT_COMMIT_INVALID');
    if(verifiedAnchor!==priorHead)fail('CHECKPOINT_SEGMENT_NOT_CONTIGUOUS',{expected:priorHead,observed:verifiedAnchor});
    if(endpoint===priorHead)fail('CHECKPOINT_DID_NOT_ADVANCE');
  } else if(candidateCheckpoint.materializationRule?.currentUnverifiedHeadMayNotSeedCheckpoint!==true) fail('INITIAL_CHECKPOINT_SEED_RULE_MISSING');
  const receiptCore={result:verifiedLineageReceipt.result,anchorCommitSha:verifiedAnchor,branchHead:endpoint,ledgerBlobSha:blob,commitCount:verifiedLineageReceipt.commitCount};
  return {
    ...candidateCheckpoint,
    status:'ACTIVE_VERIFIED',
    checkpoint:{
      checkpointCommitSha:endpoint,
      checkpointLedgerBlobSha:blob,
      verifiedFromAnchorCommitSha:verifiedAnchor,
      verificationReceiptSha256:sha256(receiptCore)
    }
  };
}

function main(){
  const [input,output]=process.argv.slice(2);if(!input||!output)fail('USAGE');
  const v=JSON.parse(fs.readFileSync(input,'utf8'));
  fs.writeFileSync(output,JSON.stringify(advanceCheckpoint(v),null,2)+'\n');
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)main();
