#!/usr/bin/env node
import assert from 'node:assert/strict';
import { planOwnerConnectorAdmission } from './owner-connector-canonical-intake.v1.mjs';
import { canonical, sha } from './repository-operation-lock-manager.v1.mjs';
import { verifyCanonicalLedgerCommitV2 } from './repository-operation-lock-lineage.v2.mjs';

const head = '1111111111111111111111111111111111111111';
const request = {
  schema:'REPOSITORY_OPERATION_REQUEST_v1', operationId:'SELF_TEST_OWNER_CONNECTOR', projectId:'SELF_TEST', lockScope:'SELF_TEST_SCOPE', exactGoverningHead:head,
  subjectIdentity:{kind:'self-test'}, requestingAuthority:{kind:'OWNER'}, executingRole:{kind:'BUILDER'}, independentVerifier:{kind:'SELF_TEST'},
  constructionProcedureLocator:'self-test', requiredInputs:[{id:'input',resolved:true}], allowedPaths:['index.html'], prohibitedPaths:['forbidden/'], requiredOutputs:['receipt'],
  exactTestCommand:'node self-test', workflowPath:'self-test.yml', artifactPaths:['self-test.json'], fingerprintDomain:{kind:'self-test'}, errorPrecedence:['FAIL_CLOSED'], stopConditions:['FAIL'], terminalDispositions:['PASS_CLOSED','FAIL_CLOSED']
};
const procedure = {
  schema:'REPOSITORY_CONSTRUCTION_PROCEDURE_v1', procedureId:'SELF_TEST_PROCEDURE', operationClass:'RUNTIME_OR_AUTHORITY', exactGoverningHead:head,
  exactAllowedRepositoryPaths:['index.html'], exactBranchAndCommitSequence:['branch','commit'], evaluationToolingHeadBindingRule:'exact', canonicalInputSchemas:['SELF_TEST_INPUT'], canonicalOutputSchemas:['SELF_TEST_OUTPUT'],
  errorCodeAndValidationPrecedence:['FAIL_CLOSED'], exactTestRunnerCommand:'node self-test', independentVerifierDefinition:{kind:'SELF_TEST'}, workflowAndArtifactPackagingPaths:{workflowPath:'self-test.yml',artifactPaths:['self-test.json']},
  bridgeOutputFingerprintDomain:{kind:'self-test'}, priorAttemptInspectionLimits:{max:1}
};
const body = `CANONICAL_OPERATION_INTAKE_REQUEST_V1\n${JSON.stringify({operationRequest:request,constructionProcedure:procedure})}`;
const rawLedger = {schema:'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',lockGeneration:7,activeScopes:{},terminalHistory:[]};
const plan = planOwnerConnectorAdmission({
  request, procedure, rawLedger,
  sourceComment:{id:1,issueNumber:1,body,user:{login:'smansfield635-create'},author_association:'OWNER'},
  observedMainHead:head,
  observedLedgerBlobSha:'2222222222222222222222222222222222222222',
  observedLockRefHead:'3333333333333333333333333333333333333333'
});
assert.equal(plan.result,'ADMITTED_AND_LOCKED');
assert.equal(plan.lockGeneration,8);
assert.equal(plan.ledgerMutationAuthorized,true);
assert.equal(plan.requestDigest,sha(canonical(request)));
const commit={author:{login:'smansfield635-create'},committer:{login:'smansfield635-create'},commit:{message:plan.commitMessage,verification:{verified:false}}};
const verification=verifyCanonicalLedgerCommitV2({commit,changedPaths:['.github/operation-intake/active-operation-ledger.v1.json'],resultingLedger:plan.nextLedger});
assert.equal(verification.result,'CANONICAL_LEDGER_COMMIT_VERIFIED');
assert.equal(verification.principal,'OWNER_AUTHENTICATED_GITHUB_CONNECTOR_CANONICAL_INTAKE_V1');
console.log('OWNER_CONNECTOR_CANONICAL_INTAKE_SELF_TEST PASS');
