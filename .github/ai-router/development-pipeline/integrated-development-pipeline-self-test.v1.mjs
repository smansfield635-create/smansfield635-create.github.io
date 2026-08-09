#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluatePolicy } from './policy-gate.v1.mjs';
import { evaluateRetirementEligibility } from './retirement-eligibility-gate.v1.mjs';
import { buildEvidenceBundle } from './evidence-bundle.v1.mjs';
import { runIntegratedPipeline, validateProviderContract } from './integrated-development-pipeline-gate.v1.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const policy=read('.github/ai-router/development-pipeline/policy-registry.v1.json');
const provider=read('.github/ai-router/development-pipeline/execution-route-provider-contract.v1.json');
const lifecycle=read('.github/ai-router/instrument-lifecycle/instrument-lifecycle-registry.v1.json');
const protectedRegistry=read('.github/ai-router/instrument-lifecycle/protected-live-operations.v1.json');
const lifecycleProtocol=read('.github/ai-router/instrument-lifecycle/instrument-lifecycle-protocol.v1.json');
const H='a'.repeat(40),H2='b'.repeat(40);
const basePolicy={schema:'DEVELOPMENT_PIPELINE_POLICY_DECISION_REQUEST_v1',operationId:'TEST',subjectHead:H,currentMainHead:H,requestedPaths:['.github/ai-router/development-pipeline/policy-registry.v1.json'],requestedAuthorityClasses:['READ_ONLY_OBSERVATION_AUTHORITY']};
const syntheticRegistry={schema:'REPOSITORY_INSTRUMENT_LIFECYCLE_REGISTRY_v1',records:[
  {workflowPath:'current.yml',state:'ACTIVE_CURRENT',currentAuthority:true,protected:false},
  {workflowPath:'compat.yml',state:'ACTIVE_COMPATIBILITY',currentAuthority:true,protected:false},
  {workflowPath:'historical.yml',state:'HISTORICAL_PINNED',currentAuthority:false,protected:false},
  {workflowPath:'protected-history.yml',state:'HISTORICAL_PINNED',currentAuthority:false,protected:true}
]};
const syntheticProtected={records:[]};
const continuityPass={proofs:{interfaceCompatibility:{status:'PASS'},transitionSimulation:{status:'PASS'},remoteInvocation:{status:'PASS'},postMergeContinuity:{status:'PASS'}}};
const tests=[];
const test=(name,fn)=>{try{const details=fn();tests.push({name,result:'PASS',details:details??null});}catch(e){tests.push({name,result:'FAIL',error:e.message});}};
const eq=(actual,expected,label)=>{if(actual!==expected)throw new Error(`${label}:${actual}!=${expected}`);};

test('policy allows bounded shared-control-plane request',()=>eq(evaluatePolicy(basePolicy,policy).decision,'ALLOW','decision'));
test('policy denies stale head',()=>eq(evaluatePolicy({...basePolicy,currentMainHead:H2},policy).decision,'DENY','decision'));
test('policy denies protected project path without project authority',()=>eq(evaluatePolicy({...basePolicy,requestedPaths:['laws/index.html']},policy).decision,'DENY','decision'));
test('policy denies direct operation ledger write',()=>eq(evaluatePolicy({...basePolicy,requestedPaths:['.github/operation-intake/active-operation-ledger.v1.json']},policy).decision,'DENY','decision'));
test('policy denies physical retirement without separate authority',()=>eq(evaluatePolicy({...basePolicy,requestPhysicalRetirement:true},policy).decision,'DENY','decision'));
test('policy denies attestation used as authority',()=>eq(evaluatePolicy({...basePolicy,attestationUsedAsAuthoritySource:true},policy).decision,'DENY','decision'));
test('policy denies historical observer scope enforcement',()=>eq(evaluatePolicy({...basePolicy,observerHistoricalConstructionScopeEnforcement:true},policy).decision,'DENY','decision'));
test('unknown authority requires review',()=>eq(evaluatePolicy({...basePolicy,requestedAuthorityClasses:['MADE_UP_AUTHORITY']},policy).decision,'REVIEW_REQUIRED','decision'));
test('provider contract exact identity passes',()=>eq(validateProviderContract(provider).ok,true,'provider'));
test('provider invalid head fails',()=>eq(validateProviderContract({...provider,provider:{...provider.provider,candidateHead:H}}).ok,false,'provider'));
test('provider receipt unknown result fails',()=>eq(validateProviderContract(provider,{schema:'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',result:'UNKNOWN'}).ok,false,'provider'));
test('current workflow is not retirement eligible',()=>eq(evaluateRetirementEligibility({workflowPath:'current.yml',registry:syntheticRegistry,protectedRegistry:syntheticProtected,continuityProof:continuityPass}).result,'NOT_ELIGIBLE_CURRENT_OR_COMPATIBILITY','result'));
test('compatibility workflow is not retirement eligible',()=>eq(evaluateRetirementEligibility({workflowPath:'compat.yml',registry:syntheticRegistry,protectedRegistry:syntheticProtected,continuityProof:continuityPass}).result,'NOT_ELIGIBLE_CURRENT_OR_COMPATIBILITY','result'));
test('protected historical workflow is not retirement eligible',()=>eq(evaluateRetirementEligibility({workflowPath:'protected-history.yml',registry:syntheticRegistry,protectedRegistry:syntheticProtected,continuityProof:continuityPass}).result,'NOT_ELIGIBLE_PROTECTED','result'));
test('historical workflow without continuity is not retirement eligible',()=>eq(evaluateRetirementEligibility({workflowPath:'historical.yml',registry:syntheticRegistry,protectedRegistry:syntheticProtected,continuityProof:null}).result,'NOT_ELIGIBLE_CONTINUITY_UNPROVEN','result'));
test('historical workflow with continuity becomes eligibility-only',()=>eq(evaluateRetirementEligibility({workflowPath:'historical.yml',registry:syntheticRegistry,protectedRegistry:syntheticProtected,continuityProof:continuityPass}).result,'ELIGIBLE_FOR_SEPARATE_RETIREMENT_AUTHORITY','result'));
test('evidence digest is deterministic',()=>{const x={subjectHead:H,policyDecision:{a:1},providerContract:{b:2},retirementEligibility:{c:3},continuityRef:{d:4},authorityBoundary:{e:false}};eq(buildEvidenceBundle(x).evidenceDigest,buildEvidenceBundle(x).evidenceDigest,'digest');});
test('evidence digest changes with evidence',()=>{const x={subjectHead:H,policyDecision:{a:1},providerContract:{b:2},retirementEligibility:{c:3},continuityRef:{d:4},authorityBoundary:{e:false}};if(buildEvidenceBundle(x).evidenceDigest===buildEvidenceBundle({...x,continuityRef:{d:5}}).evidenceDigest)throw new Error('digest_not_changed');});
test('lifecycle protocol contains concurrency-observation law',()=>{if(!lifecycleProtocol.laws.includes('OBSERVATION_WORKFLOW_MUST_NOT_FAIL_SOLELY_BECAUSE_AN_UNRELATED_PR_MODIFIES_PATHS_OUTSIDE_ITS_ORIGINAL_CONSTRUCTION_SCOPE'))throw new Error('law_missing');});
test('integrated pipeline passes with provider pending explicitly visible',()=>{const r=runIntegratedPipeline({request:{schema:'INTEGRATED_DEVELOPMENT_PIPELINE_REQUEST_v1',operationId:'SELF_TEST',subjectHead:H,currentMainHead:H,requestedPaths:['.github/ai-router/development-pipeline/policy-registry.v1.json'],requestedAuthorityClasses:['READ_ONLY_OBSERVATION_AUTHORITY'],retirementTarget:'.github/workflows/laws-cp5-final-celestial-naturalization.yml'},policyRegistry:policy,providerContract:provider,lifecycleRegistry:lifecycle,protectedRegistry});eq(r.result,'PASS_OPERATIONAL_PROVIDER_PENDING_RATIFICATION','result');eq(r.authorityBoundary.mergeAuthorityCreated,false,'merge');eq(r.physicalRetirementPerformed,false,'retirement');});

const failed=tests.filter(t=>t.result==='FAIL');
const receipt={schema:'INTEGRATED_DEVELOPMENT_PIPELINE_SELF_TEST_RECEIPT_v1',result:failed.length?'FAIL':'PASS',totalCount:tests.length,passedCount:tests.length-failed.length,failedCount:failed.length,tests,repositoryMutationPerformed:false,workflowDeactivationPerformed:false,physicalRetirementPerformed:false,mergeAuthorityCreated:false,productAuthorityCreated:false,semanticAuthorityCreated:false,scientificClaimAuthorityCreated:false};
const outIndex=process.argv.indexOf('--output');
if(outIndex>=0)fs.writeFileSync(process.argv[outIndex+1],JSON.stringify(receipt,null,2)+'\n');else process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
