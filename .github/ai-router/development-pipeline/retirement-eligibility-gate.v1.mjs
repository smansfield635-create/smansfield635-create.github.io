#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RECEIPT_SCHEMA='RETIREMENT_ELIGIBILITY_RECEIPT_v1';
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(stable(v),null,2)+'\n');

function continuityProven(proof){
  if(!proof||typeof proof!=='object')return false;
  if(proof.systemClosureGranted===true)return true;
  const p=proof.proofs??proof;
  return ['interfaceCompatibility','transitionSimulation','remoteInvocation','postMergeContinuity'].every(k=>p?.[k]?.status==='PASS'||p?.[k]==='PASS');
}
function externallyProtected(workflowPath,protectedRegistry){
  return (protectedRegistry?.records??[]).some(r=>(r.workflowPaths??[]).includes(workflowPath));
}
export function evaluateRetirementEligibility({workflowPath,registry,protectedRegistry,continuityProof}){
  const record=(registry?.records??[]).find(r=>r.workflowPath===workflowPath);
  const base={schema:RECEIPT_SCHEMA,workflowPath,physicalRetirementPerformed:false,physicalRetirementAuthorized:false,separateRetirementAuthorityRequired:true,authorityCreated:false};
  if(!record)return stable({...base,result:'REVIEW_REQUIRED',reason:'WORKFLOW_NOT_EXPLICITLY_REGISTERED'});
  if(record.protected===true||externallyProtected(workflowPath,protectedRegistry))return stable({...base,result:'NOT_ELIGIBLE_PROTECTED',state:record.state,reason:'PROTECTED_LIVE_DEPENDENCY'});
  if(record.currentAuthority===true||['ACTIVE_CURRENT','ACTIVE_COMPATIBILITY'].includes(record.state))return stable({...base,result:'NOT_ELIGIBLE_CURRENT_OR_COMPATIBILITY',state:record.state,reason:'CURRENT_OR_COMPATIBILITY_AUTHORITY'});
  if(!['HISTORICAL_PINNED','SUPERSEDED'].includes(record.state))return stable({...base,result:'REVIEW_REQUIRED',state:record.state,reason:'STATE_NOT_RETIREMENT_CANDIDATE'});
  if(!continuityProven(continuityProof))return stable({...base,result:'NOT_ELIGIBLE_CONTINUITY_UNPROVEN',state:record.state,reason:'REQUIRED_CONTINUITY_PROOF_ABSENT'});
  return stable({...base,result:'ELIGIBLE_FOR_SEPARATE_RETIREMENT_AUTHORITY',state:record.state,reason:'CLASSIFICATION_AND_CONTINUITY_ELIGIBLE_ONLY'});
}
function args(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!k?.startsWith('--')||v===undefined)throw new Error('CLI_ARGUMENT_INVALID');out[k.slice(2)]=v;}return out;}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
  try{
    const a=args(process.argv.slice(2));
    const registry=JSON.parse(fs.readFileSync(a.registry,'utf8'));
    const protectedRegistry=JSON.parse(fs.readFileSync(a.protected,'utf8'));
    const continuityProof=a.continuity?JSON.parse(fs.readFileSync(a.continuity,'utf8')):null;
    const receipt=evaluateRetirementEligibility({workflowPath:a.workflow,registry,protectedRegistry,continuityProof});
    write(a.output,receipt);
  }catch(error){
    const receipt=stable({schema:RECEIPT_SCHEMA,result:'REVIEW_REQUIRED',reason:error.message,physicalRetirementPerformed:false,physicalRetirementAuthorized:false,separateRetirementAuthorityRequired:true,authorityCreated:false});
    if(process.argv.includes('--output')){const i=process.argv.indexOf('--output');write(process.argv[i+1],receipt);}else process.stderr.write(JSON.stringify(receipt)+'\n');
    process.exitCode=1;
  }
}
