#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RECEIPT_SCHEMA,
  REPOSITORY,
  SUCCESSOR_GATE_BLOB,
  executeSuccessorTransition,
  validateRemoteSuccessorRequest
} from './remote-operation-successor-transition-bridge.v1.mjs';

const OLD_HEAD = '1'.repeat(40);
const NEW_HEAD = '2'.repeat(40);
const OLD_OPERATION = 'KNOWN_OPERATION_v1';
const NEW_OPERATION = 'KNOWN_OPERATION_SUCCESSOR_20260809';
const OLD_SCOPE = 'TEST:SUCCESSOR:OLD:V1';
const NEW_SCOPE = 'TEST:SUCCESSOR:NEW:V1';

function successorRequest() {
  return {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: NEW_OPERATION,
    projectId: 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE',
    lockScope: NEW_SCOPE,
    exactGoverningHead: NEW_HEAD,
    subjectIdentity: { repository: REPOSITORY, subject: 'REMOTE_SUCCESSOR_TEST', baselineHead: NEW_HEAD },
    requestingAuthority: { source: 'TEST' },
    executingRole: { role: 'TEST_EXECUTOR' },
    independentVerifier: { role: 'TEST_VERIFIER' },
    constructionProcedureLocator: 'TEST:SUCCESSOR_PROCEDURE',
    requiredInputs: [{ id: 'TEST_INPUT', resolved: true }],
    allowedPaths: ['test/successor.txt'],
    prohibitedPaths: ['test/prohibited.txt'],
    requiredOutputs: ['TEST_OUTPUT'],
    exactTestCommand: 'node test-successor.mjs',
    workflowPath: '.github/workflows/test-successor.yml',
    artifactPaths: ['artifacts/test-successor.json'],
    fingerprintDomain: { id: 'TEST_DOMAIN', paths: ['test/successor.txt'] },
    errorPrecedence: ['TEST_ERROR'],
    stopConditions: ['STOP_ON_FAILURE'],
    terminalDispositions: ['PASS_CLOSED', 'FAIL_CLOSED', 'SUPERSEDED']
  };
}

function successorProcedure() {
  return {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'TEST_SUCCESSOR_PROCEDURE_20260809',
    operationClass: 'TEST_SUCCESSOR',
    exactGoverningHead: NEW_HEAD,
    exactAllowedRepositoryPaths: ['test/successor.txt'],
    exactBranchAndCommitSequence: [{ step: 1, action: 'TEST' }],
    evaluationToolingHeadBindingRule: 'EXACT_HEAD_ONLY',
    canonicalInputSchemas: ['TEST_INPUT_v1'],
    canonicalOutputSchemas: ['TEST_OUTPUT_v1'],
    errorCodeAndValidationPrecedence: ['TEST_ERROR'],
    exactTestRunnerCommand: 'node test-successor.mjs',
    independentVerifierDefinition: { holder: 'TEST_VERIFIER', independentFromBuilder: true },
    workflowAndArtifactPackagingPaths: {
      workflowPath: '.github/workflows/test-successor.yml',
      artifactPaths: ['artifacts/test-successor.json']
    },
    bridgeOutputFingerprintDomain: { id: 'TEST_DOMAIN', paths: ['test/successor.txt'] },
    priorAttemptInspectionLimits: { forbiddenInference: 'NONE' }
  };
}

function transition() {
  return {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1',
    transitionId: 'TEST_SUCCESSOR_TRANSITION_20260809',
    reasonCode: 'GOVERNING_HEAD_ADVANCED',
    governingRef: 'refs/heads/main',
    authorityPolicy: 'FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE',
    evidencePolicy: 'EXACT_HEAD_REVALIDATION_REQUIRED',
    predecessor: {
      operationId: OLD_OPERATION,
      lockScope: OLD_SCOPE,
      lockGeneration: 651,
      governingHead: OLD_HEAD
    },
    successor: {
      operationId: NEW_OPERATION,
      lockScope: NEW_SCOPE,
      governingHead: NEW_HEAD
    },
    inheritedAuthority: [],
    preservedEvidenceRefs: ['HISTORICAL_REFERENCE_ONLY']
  };
}

function wrapperRequest() {
  return {
    schema: 'REMOTE_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1',
    repository: REPOSITORY,
    transition: transition(),
    successorRequest: successorRequest(),
    successorProcedure: successorProcedure()
  };
}

function nativeSuccess() {
  return {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_RECEIPT_v1',
    result: 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED',
    transitionId: 'TEST_SUCCESSOR_TRANSITION_20260809',
    reasonCode: 'GOVERNING_HEAD_ADVANCED',
    governingRef: 'refs/heads/main',
    predecessor: {
      operationId: OLD_OPERATION,
      lockScope: OLD_SCOPE,
      scopeHash: 'a'.repeat(64),
      lockGeneration: 651,
      governingHead: OLD_HEAD,
      terminalDisposition: 'SUPERSEDED',
      terminalHistoryPreserved: true
    },
    successor: {
      operationId: NEW_OPERATION,
      projectId: 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE',
      lockScope: NEW_SCOPE,
      scopeHash: 'b'.repeat(64),
      lockGeneration: 900,
      governingHead: NEW_HEAD,
      requestDigest: 'c'.repeat(64),
      procedureLocatorDigest: 'd'.repeat(64),
      state: 'ADMITTED_LOCKED'
    },
    authorityPolicy: 'FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE',
    authorityInherited: false,
    authoritySource: 'FRESH_SUCCESSOR_REQUEST_AND_CONSTRUCTION_PROCEDURE',
    evidencePolicy: 'EXACT_HEAD_REVALIDATION_REQUIRED',
    exactHeadRevalidationRequired: true,
    preservedEvidenceRefs: ['HISTORICAL_REFERENCE_ONLY'],
    operationStarted: true,
    branchCreationAuthorized: true,
    repositoryWritesAuthorized: true,
    workflowExecutionAuthorized: true,
    implementationInferenceAuthorized: false,
    ledgerGenerationBefore: 899,
    ledgerGenerationAfter: 900,
    oneLedgerMutationRequired: true,
    liveGoverningHead: NEW_HEAD,
    observedLedgerBlobSha: 'e'.repeat(40),
    observedLockRefHead: 'f'.repeat(40),
    committedLedgerBlobSha: '0'.repeat(40),
    transitionCommitSha: '3'.repeat(40),
    ledgerCompareAndSwapCommitted: true,
    casAttempt: 1,
    casRetryLimit: 8
  };
}

const identityOk = () => SUCCESSOR_GATE_BLOB;
const executorOk = async () => nativeSuccess();

function expectValidationFailure(mutator, code) {
  const input = wrapperRequest();
  mutator(input);
  assert.throws(() => validateRemoteSuccessorRequest(input), error => error?.code === code);
}

test('valid typed request is accepted and normalized', () => {
  const value = validateRemoteSuccessorRequest(wrapperRequest());
  assert.equal(value.transition.predecessor.operationId, OLD_OPERATION);
  assert.equal(value.successorRequest.operationId, NEW_OPERATION);
  assert.deepEqual(value.transition.inheritedAuthority, []);
});

test('extra top-level fields fail closed', () => {
  expectValidationFailure(input => { input.extra = true; }, 'REQUEST_SCHEMA_OR_KEYSET_INVALID');
});

test('repository substitution fails closed', () => {
  expectValidationFailure(input => { input.repository = 'other/repository'; }, 'REPOSITORY_SUBSTITUTION_PROHIBITED');
});

test('generic command field anywhere in request fails closed', () => {
  expectValidationFailure(input => { input.successorRequest.command = 'echo unsafe'; }, 'PROHIBITED_REQUEST_FIELD');
});

test('lock-ref override anywhere in request fails closed', () => {
  expectValidationFailure(input => { input.transition.lockRef = 'refs/heads/other'; }, 'PROHIBITED_REQUEST_FIELD');
});

test('inherited authority fails closed', () => {
  expectValidationFailure(input => { input.transition.inheritedAuthority = ['OLD_AUTHORITY']; }, 'IMPLICIT_AUTHORITY_INHERITANCE_FORBIDDEN');
});

test('successor operation mismatch fails closed', () => {
  expectValidationFailure(input => { input.transition.successor.operationId = 'OTHER_SUCCESSOR'; }, 'SUCCESSOR_OPERATION_ID_MISMATCH');
});

test('successor head mismatch fails closed', () => {
  expectValidationFailure(input => { input.transition.successor.governingHead = '4'.repeat(40); }, 'SUCCESSOR_GOVERNING_HEAD_MISMATCH');
});

test('valid canonical successor return is preserved', async () => {
  const { receipt, nativeReceipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: identityOk,
    successorExecutor: executorOk
  });
  assert.equal(receipt.schema, RECEIPT_SCHEMA);
  assert.equal(receipt.result, 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED');
  assert.equal(receipt.predecessorOperationId, OLD_OPERATION);
  assert.equal(receipt.successorOperationId, NEW_OPERATION);
  assert.equal(receipt.successorLockGeneration, 900);
  assert.equal(receipt.nativeReceiptRewritten, false);
  assert.equal(receipt.successorGateMutated, false);
  assert.equal(receipt.directLedgerEditPerformed, false);
  assert.equal(receipt.genericCommandAuthority, false);
  assert.equal(receipt.arbitrarySuccessorAuthority, false);
  assert.equal(receipt.productMutationPerformed, false);
  assert.deepEqual(receipt.nativeReceiptJson, nativeReceipt);
});

test('missing token fails before canonical mutation', async () => {
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: '',
    identityVerifier: identityOk,
    successorExecutor: executorOk
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'GITHUB_TOKEN_MISSING');
  assert.equal(receipt.nativeReceiptJson, null);
});

test('successor-gate identity mismatch fails before canonical mutation', async () => {
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: () => { const error = new Error('mismatch'); error.code = 'SUCCESSOR_GATE_IDENTITY_MISMATCH'; throw error; },
    successorExecutor: executorOk
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'SUCCESSOR_GATE_IDENTITY_MISMATCH');
  assert.equal(receipt.nativeReceiptJson, null);
});

test('native receipt schema mismatch fails closed', async () => {
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: identityOk,
    successorExecutor: async () => ({ ...nativeSuccess(), schema: 'WRONG_SCHEMA' })
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'NATIVE_RECEIPT_SCHEMA_MISMATCH');
});

test('canonical successor rejection remains fail closed', async () => {
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: identityOk,
    successorExecutor: async () => ({ ...nativeSuccess(), result: 'SUCCESSOR_NOT_ADMITTED', ledgerCompareAndSwapCommitted: false })
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'CANONICAL_SUCCESSOR_GATE_REJECTED');
});

test('native successor identity mismatch fails closed', async () => {
  const bad = nativeSuccess();
  bad.successor.operationId = 'UNRELATED_OPERATION';
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: identityOk,
    successorExecutor: async () => bad
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'NATIVE_RECEIPT_SUCCESSOR_MISMATCH');
});

test('native receipt without committed CAS fails closed', async () => {
  const bad = nativeSuccess();
  bad.ledgerCompareAndSwapCommitted = false;
  const { receipt } = await executeSuccessorTransition(wrapperRequest(), {
    token: 'TEST_TOKEN',
    identityVerifier: identityOk,
    successorExecutor: async () => bad
  });
  assert.equal(receipt.result, 'FAIL_CLOSED_NO_SUCCESSOR');
  assert.equal(receipt.errorCode, 'NATIVE_RECEIPT_CAS_NOT_COMMITTED');
});
