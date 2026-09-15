#!/usr/bin/env node
import assert from 'node:assert/strict';
import { planOwnerConnectorAdmission } from './owner-connector-canonical-intake.v1.mjs';
import { canonical, ledger, scopeHash, sha } from './repository-operation-lock-manager.v1.mjs';
import { verifyCanonicalLedgerCommitV2 } from './repository-operation-lock-lineage.v2.mjs';

const head = '1111111111111111111111111111111111111111';
const branchIdentity = {
  schema:'REPOSITORY_OPERATION_CONSTRUCTION_BRANCH_IDENTITY_v1',
  canonicalBranchRef:'refs/heads/self-test/owner-connector',
  admittedBase:head,
  branchCreationHead:head
};
const request = {
  schema:'REPOSITORY_OPERATION_REQUEST_v1', operationId:'SELF_TEST_OWNER_CONNECTOR', projectId:'SELF_TEST', lockScope:'SELF_TEST_SCOPE', exactGoverningHead:head,
  constructionBranchIdentity:branchIdentity,
  subjectIdentity:{kind:'self-test'}, requestingAuthority:{kind:'OWNER'}, executingRole:{kind:'BUILDER'}, independentVerifier:{kind:'SELF_TEST'},
  constructionProcedureLocator:'self-test', requiredInputs:[{id:'input',resolved:true}],
  intakeCompletenessReceipt:{
    schema:'INTAKE_COMPLETENESS_RECEIPT_v1', receiptId:'SELF_TEST_OWNER_CONNECTOR_COMPLETENESS', result:'COMPLETE_NO_QUESTIONS_REQUIRED',
    unresolvedMaterialQuestions:[], receiptDigest:'self-test-owner-connector-completeness', authorityEffect:'NONE_BY_INTAKE_COMPLETENESS_RECEIPT'
  },
  functionalCoordination:{
    schema:'FUNCTIONAL_BEARING_COORDINATION_v1', applicabilityClass:'MATERIAL_GOVERNED_ENGINEERING',
    functionalBearing:{mode:'SINGLE',bearings:['E'],exemptionReason:null}, primitiveRequirements:['E'], authorityEffect:'NONE'
  },
  allowedPaths:['index.html'], prohibitedPaths:['forbidden/'], requiredOutputs:['receipt'],
  exactTestCommand:'node self-test', workflowPath:'self-test.yml', artifactPaths:['self-test.json'], fingerprintDomain:{kind:'self-test'}, errorPrecedence:['FAIL_CLOSED'], stopConditions:['FAIL'], terminalDispositions:['PASS_CLOSED','FAIL_CLOSED']
};
const procedure = {
  schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1', procedureId:'SELF_TEST_PROCEDURE', operationClass:'RUNTIME_OR_AUTHORITY', exactGoverningHead:head,
  exactAllowedRepositoryPaths:['index.html'], exactBranchAndCommitSequence:['branch','commit'], evaluationToolingHeadBindingRule:'exact', canonicalInputSchemas:['SELF_TEST_INPUT'], canonicalOutputSchemas:['SELF_TEST_OUTPUT'],
  errorCodeAndValidationPrecedence:['FAIL_CLOSED'], exactTestRunnerCommand:'node self-test', independentVerifierDefinition:{kind:'SELF_TEST'}, workflowAndArtifactPackagingPaths:{workflowPath:'self-test.yml',artifactPaths:['self-test.json']},
  bridgeOutputFingerprintDomain:{kind:'self-test'}, priorAttemptInspectionLimits:{max:1}
};
const rawLedger = {schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration:7,activeScopes:{},terminalHistory:[]};
const sourceFor=(r,p=procedure)=>({id:1,issueNumber:1,body:`CANONICAL_OPERATION_INTAKE_REQUEST_V1\n${JSON.stringify({operationRequest:r,constructionProcedure:p})}`,user:{login:'smansfield635-create'},author_association:'OWNER'});
const planFor=(r=request,p=procedure)=>planOwnerConnectorAdmission({
  request:r, procedure:p, rawLedger, sourceComment:sourceFor(r,p),
  observedMainHead:head, observedLedgerBlobSha:'2222222222222222222222222222222222222222', observedLockRefHead:'3333333333333333333333333333333333333333'
});

const plan = planFor();
assert.equal(plan.result,'ADMITTED_AND_LOCKED');
assert.equal(plan.lockGeneration,8);
assert.equal(plan.ledgerMutationAuthorized,true);
assert.equal(plan.requestDigest,sha(canonical(request)));
assert.deepEqual(plan.constructionBranchIdentity,branchIdentity);
const admittedLock=Object.values(plan.nextLedger.activeScopes)[0];
assert.deepEqual(admittedLock.constructionBranchIdentity,branchIdentity);
assert.deepEqual(plan.independentAuthorityProvenance.compareAndSwap.constructionBranchIdentity,branchIdentity);
const commit={author:{login:'smansfield635-create'},committer:{login:'smansfield635-create'},commit:{message:plan.commitMessage,verification:{verified:false}}};
const verification=verifyCanonicalLedgerCommitV2({commit,changedPaths:['.github/operation-intake/active-operation-ledger.v1.json'],resultingLedger:plan.nextLedger});
assert.equal(verification.result,'CANONICAL_LEDGER_COMMIT_VERIFIED');
assert.equal(verification.principal,'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1');

const legacyScope='LEGACY_SELF_TEST_SCOPE',legacyHash=scopeHash(legacyScope);
const legacyLock={schema:'REPOSITORY_OPERATION_LOCK_v1',operationId:'LEGACY_SELF_TEST',lockScope:legacyScope,scopeHash:legacyHash,state:'ADMITTED_LOCKED',governingHead:head,requestDigest:'a'.repeat(64),procedureLocatorDigest:'b'.repeat(64),lockGeneration:1,released:false};
assert.doesNotThrow(()=>ledger({schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration:1,activeScopes:{[legacyHash]:legacyLock},terminalHistory:[]}));

const expectFailure=(name,mutate,expected)=>{
  const r=structuredClone(request); mutate(r); let error=null;
  try{planFor(r);}catch(e){error=e;}
  assert(error,`${name}:DID_NOT_FAIL`);
  assert.equal(error.code,expected,`${name}:${error.message}`);
};
expectFailure('missing branch identity',r=>{delete r.constructionBranchIdentity;},'CONSTRUCTION_BRANCH_IDENTITY_REQUIRED');
expectFailure('malformed branch ref',r=>{r.constructionBranchIdentity.canonicalBranchRef='self-test/not-a-ref';},'CONSTRUCTION_BRANCH_REF_INVALID');
expectFailure('main branch prohibited',r=>{r.constructionBranchIdentity.canonicalBranchRef='refs/heads/main';},'CONSTRUCTION_BRANCH_REF_PROHIBITED');
expectFailure('lock ref prohibited',r=>{r.constructionBranchIdentity.canonicalBranchRef='refs/heads/operation-locks/repository-operation-intake-v1';},'CONSTRUCTION_BRANCH_REF_PROHIBITED');
expectFailure('admitted base mismatch',r=>{r.constructionBranchIdentity.admittedBase='2'.repeat(40);},'CONSTRUCTION_BRANCH_IDENTITY_GOVERNING_HEAD_MISMATCH');
expectFailure('branch creation head mismatch',r=>{r.constructionBranchIdentity.branchCreationHead='3'.repeat(40);},'CONSTRUCTION_BRANCH_IDENTITY_GOVERNING_HEAD_MISMATCH');

console.log('OWNER_CONNECTOR_CANONICAL_INTAKE_SELF_TEST PASS');
