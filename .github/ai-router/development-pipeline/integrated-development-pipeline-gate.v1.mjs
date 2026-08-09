#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluatePolicy } from './policy-gate.v1.mjs';
import { evaluateRetirementEligibility } from './retirement-eligibility-gate.v1.mjs';
import { buildEvidenceBundle, sha256, stable } from './evidence-bundle.v1.mjs';

export const REQUEST_SCHEMA='INTEGRATED_DEVELOPMENT_PIPELINE_REQUEST_v1';
export const RECEIPT_SCHEMA='INTEGRATED_DEVELOPMENT_PIPELINE_RECEIPT_v1';
const PROVIDER_SCHEMA='INTEGRATED_DEVELOPMENT_PIPELINE_EXECUTION_ROUTE_PROVIDER_CONTRACT_v1';
const ROUTE_RECEIPT_SCHEMA='REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1';
const ACCEPTED_ROUTE_RESULTS=new Set(['LOCAL_CANONICAL_INTAKE_ROUTE','CERTIFIED_PRE_REGISTRATION_BRIDGE_REQUIRED','STOP']);
const AUTHORITY_BOUNDARY=Object.freeze({repositoryMutationAuthorityCreated:false,mergeAuthorityCreated:false,deploymentAuthorityCreated:false,physicalRetirementAuthorityCreated:false,productAuthorityCreated:false,semanticAuthorityCreated:false,scientificClaimAuthorityCreated:false,genericCommandAuthorityCreated:false});

export function validateProviderContract(contract,providerReceipt=null){
  if(!contract||contract.schema!==PROVIDER_SCHEMA) return {ok:false,errorCode:'PROVIDER_CONTRACT_SCHEMA_MISMATCH'};
  const p=contract.provider??{};
  if(p.sourcePr!==823||p.candidateHead!=='2b6f2fe5f39b20b5c5cae14458519495f270aea8'||p.receiptSchema!==ROUTE_RECEIPT_SCHEMA) return {ok:false,errorCode:'PROVIDER_CONTRACT_IDENTITY_MISMATCH'};
  if(JSON.stringify([...(p.acceptedResults??[])].sort())!==JSON.stringify([...ACCEPTED_ROUTE_RESULTS].sort())) return {ok:false,errorCode:'PROVIDER_RESULT_SET_MISMATCH'};
  if(p.certifiedBackend!=='PRE_REGISTRATION_INTAKE_BRIDGE_EXECUTION'||p.transitionId!=='OPERATION_INTAKE_LOCAL_AUTH_UNAVAILABLE_TO_PRE_REGISTRATION_BRIDGE_v1') return {ok:false,errorCode:'PROVIDER_BACKEND_OR_TRANSITION_MISMATCH'};
  if(providerReceipt){
    if(providerReceipt.schema!==ROUTE_RECEIPT_SCHEMA||!ACCEPTED_ROUTE_RESULTS.has(providerReceipt.result)) return {ok:false,errorCode:'PROVIDER_RECEIPT_INVALID'};
    if(providerReceipt.result==='CERTIFIED_PRE_REGISTRATION_BRIDGE_REQUIRED'&&providerReceipt.terminalInabilityAllowed!==false) return {ok:false,errorCode:'PROVIDER_TERMINAL_INABILITY_REWRITE'};
  }
  return {ok:true,status:contract.status,providerHead:p.candidateHead,sourcePr:p.sourcePr,providerCurrentMainAuthority:contract.status==='ACTIVE_RATIFIED_ON_DEFAULT_BRANCH'};
}

export function runIntegratedPipeline({request,policyRegistry,providerContract,lifecycleRegistry,protectedRegistry}){
  if(!request||request.schema!==REQUEST_SCHEMA) return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:'INTEGRATED_REQUEST_SCHEMA_INVALID',authorityBoundary:AUTHORITY_BOUNDARY});
  const provider=validateProviderContract(providerContract,request.providerReceipt??null);
  if(!provider.ok) return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:provider.errorCode,authorityBoundary:AUTHORITY_BOUNDARY});
  const policyDecision=evaluatePolicy({
    schema:'DEVELOPMENT_PIPELINE_POLICY_DECISION_REQUEST_v1',
    operationId:request.operationId,
    subjectHead:request.subjectHead,
    currentMainHead:request.currentMainHead,
    requestedPaths:request.requestedPaths??[],
    requestedAuthorityClasses:request.requestedAuthorityClasses??[],
    explicitProjectAuthority:request.explicitProjectAuthority===true,
    requestPhysicalRetirement:request.requestPhysicalRetirement===true,
    separateRetirementAuthority:request.separateRetirementAuthority===true,
    attestationUsedAsAuthoritySource:request.attestationUsedAsAuthoritySource===true,
    observerHistoricalConstructionScopeEnforcement:request.observerHistoricalConstructionScopeEnforcement===true
  },policyRegistry);
  if(policyDecision.decision!=='ALLOW') return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:`POLICY_${policyDecision.decision}`,subjectHead:request.subjectHead,policyDecision,provider,authorityBoundary:AUTHORITY_BOUNDARY});
  const retirementEligibility=request.retirementTarget?evaluateRetirementEligibility({workflowPath:request.retirementTarget,registry:lifecycleRegistry,protectedRegistry,continuityProof:request.retirementContinuityProof??null}):stable({schema:'RETIREMENT_ELIGIBILITY_RECEIPT_v1',result:'NOT_REQUESTED',physicalRetirementPerformed:false,physicalRetirementAuthorized:false,separateRetirementAuthorityRequired:true,authorityCreated:false});
  const evidenceBundle=buildEvidenceBundle({subjectHead:request.subjectHead,policyDecision,providerContract,retirementEligibility,continuityRef:request.continuityRef??null,authorityBoundary:AUTHORITY_BOUNDARY});
  const providerPending=!provider.providerCurrentMainAuthority;
  return stable({
    schema:RECEIPT_SCHEMA,
    result:providerPending?'PASS_OPERATIONAL_PROVIDER_PENDING_RATIFICATION':'PASS_OPERATIONAL',
    subjectHead:request.subjectHead,
    operationId:request.operationId,
    policyDecision,
    provider,
    retirementEligibility,
    evidenceDigest:evidenceBundle.evidenceDigest,
    evidenceBundle,
    evidenceBundleSha256:sha256(evidenceBundle),
    physicalRetirementPerformed:false,
    repositoryMutationPerformed:false,
    authorityBoundary:AUTHORITY_BOUNDARY
  });
}

function args(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!k?.startsWith('--')||v===undefined)throw new Error('CLI_ARGUMENT_INVALID');out[k.slice(2)]=v;}return out;}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
  try{
    const a=args(process.argv.slice(2));
    const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
    const receipt=runIntegratedPipeline({request:read(a.input),policyRegistry:read(a.policy),providerContract:read(a.provider),lifecycleRegistry:read(a.lifecycle),protectedRegistry:read(a.protected)});
    fs.writeFileSync(a.output,JSON.stringify(receipt,null,2)+'\n');
    fs.writeFileSync(a.evidence,JSON.stringify(receipt.evidenceBundle??{schema:'INTEGRATED_EVIDENCE_BUNDLE_v1',result:'NOT_PRODUCED',errorCode:receipt.errorCode},null,2)+'\n');
    fs.writeFileSync(a['policy-output'],JSON.stringify(receipt.policyDecision??{schema:'DEVELOPMENT_PIPELINE_POLICY_DECISION_RECEIPT_v1',result:'DENY',decision:'DENY',errorCode:receipt.errorCode},null,2)+'\n');
    fs.writeFileSync(a['retirement-output'],JSON.stringify(receipt.retirementEligibility??{schema:'RETIREMENT_ELIGIBILITY_RECEIPT_v1',result:'NOT_EVALUATED',physicalRetirementPerformed:false},null,2)+'\n');
    if(!String(receipt.result).startsWith('PASS_'))process.exitCode=3;
  }catch(error){process.stderr.write(JSON.stringify({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:error.message,authorityBoundary:AUTHORITY_BOUNDARY})+'\n');process.exitCode=1;}
}
