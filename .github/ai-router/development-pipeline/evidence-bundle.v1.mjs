#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BUNDLE_SCHEMA='INTEGRATED_EVIDENCE_BUNDLE_v1';
export const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
export const canonical=v=>JSON.stringify(stable(v));
export const sha256=v=>crypto.createHash('sha256').update(typeof v==='string'?v:canonical(v)).digest('hex');
export function buildEvidenceBundle({subjectHead,policyDecision,providerContract,retirementEligibility,continuityRef,authorityBoundary}){
  const components={
    policyDecision:{schema:policyDecision?.schema??null,result:policyDecision?.result??null,digest:sha256(policyDecision??null)},
    providerContract:{schema:providerContract?.schema??null,status:providerContract?.status??null,digest:sha256(providerContract??null)},
    retirementEligibility:{schema:retirementEligibility?.schema??null,result:retirementEligibility?.result??null,digest:sha256(retirementEligibility??null)},
    continuity:{ref:continuityRef??null,digest:sha256(continuityRef??null)}
  };
  const payload=stable({schema:BUNDLE_SCHEMA,subjectHead,components,authorityBoundary:authorityBoundary??{}});
  return stable({...payload,evidenceDigest:sha256(payload),attestationStatus:'READY_FOR_GITHUB_ARTIFACT_ATTESTATION',attestationDoesNotCreateAuthority:true});
}
function args(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!k?.startsWith('--')||v===undefined)throw new Error('CLI_ARGUMENT_INVALID');out[k.slice(2)]=v;}return out;}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
  const a=args(process.argv.slice(2));
  const input=JSON.parse(fs.readFileSync(a.input,'utf8'));
  fs.writeFileSync(a.output,JSON.stringify(buildEvidenceBundle(input),null,2)+'\n');
}
