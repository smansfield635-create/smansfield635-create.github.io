#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHORITY_BOUNDARY,
  FAILURE_CLASSES,
  normalizeAdministrativeFailure,
  toEstateOperationStateIndex
} from './administrative-failure-normalizer.v1.mjs';

test('public successor TEST_COMMAND_MISMATCH classifies as request/procedure contract mismatch and healthy protection', () => {
  const receipt = normalizeAdministrativeFailure({
    repository: 'smansfield635-create/smansfield635-create.github.io',
    operationId: 'REMOTE_OPERATION_SUCCESSOR_EXAMPLE',
    receipt: { errorCode: 'TEST_COMMAND_MISMATCH' },
    field: 'exactTestCommand',
    mutationOccurred: false,
    authorityInherited: false,
    durableEvidenceRefs: ['issue-return', 'actions-artifact']
  });

  assert.equal(receipt.platformHealth, 'HEALTHY');
  assert.equal(receipt.operationResult, 'NOT_ADMITTED');
  assert.equal(receipt.failureClass, FAILURE_CLASSES.REQUEST_CONTRACT_MISMATCH);
  assert.equal(receipt.exactFailure, 'exactTestCommand');
  assert.equal(receipt.mutationOccurred, false);
  assert.equal(receipt.authorityInherited, false);
  assert.equal(receipt.durableFailureEvidence, 'PRESENT');
  assert.equal(receipt.remediationOwner, 'REQUEST_PROCEDURE_COMPOSITION');
  assert.equal(receipt.rerunWithoutCorrectionUseful, false);
});

test('private Paris research failure with unavailable raw log does not implicate shared platform yet', () => {
  const receipt = normalizeAdministrativeFailure({
    repository: 'smansfield635-create/geodiametrics1',
    workflowName: 'LVTG v2 VOER Paris replication',
    workloadClass: 'RESEARCH_EXPERIMENT',
    executionResult: 'FAILED',
    rawLogRetrieval: 'UNAVAILABLE'
  });

  assert.equal(receipt.platformHealth, 'NOT_IMPLICATED_YET');
  assert.equal(receipt.workloadClass, 'RESEARCH_EXPERIMENT');
  assert.equal(receipt.executionResult, 'FAILED');
  assert.equal(receipt.failureClass, FAILURE_CLASSES.INSUFFICIENT_DURABLE_DETAIL);
  assert.equal(receipt.rawLogRetrieval, 'UNAVAILABLE');
  assert.equal(receipt.nextUsefulAction, 'RESOLVE_EXISTING_DURABLE_RECEIPT_OR_ANNOTATION');
});

test('raw log unavailable outside a classified research experiment is evidence transport failure', () => {
  const receipt = normalizeAdministrativeFailure({
    workflowName: 'Unknown workflow',
    rawLogRetrieval: 'BLOB_NOT_FOUND',
    durableEvidenceRefs: ['gmail-notification']
  });

  assert.equal(receipt.failureClass, FAILURE_CLASSES.EVIDENCE_TRANSPORT_FAILURE);
  assert.equal(receipt.exactFailure, 'RAW_LOG_UNAVAILABLE');
  assert.equal(receipt.remediationOwner, 'DURABLE_EVIDENCE_LOCATOR');
});

test('observatory exports no mutation, admission, lock, successor, deployment, or release authority', () => {
  assert.deepEqual(AUTHORITY_BOUNDARY, {
    repositoryMutationAuthority: false,
    lockAuthority: false,
    admissionAuthority: false,
    successorAuthority: false,
    deploymentAuthority: false,
    releaseAuthority: false,
    workflowDispatchAuthority: false,
    operationLedgerMutationAuthority: false
  });
});

test('state index projection preserves normalized failure class and no authority creation', () => {
  const state = toEstateOperationStateIndex({
    repository: 'smansfield635-create/smansfield635-create.github.io',
    branch: 'main',
    head: 'e6e928933a1e60524e7ecade8626b27558745841',
    operationId: 'REMOTE_OPERATION_SUCCESSOR_EXAMPLE',
    productLane: 'CONTROL_PLANE',
    controlPlanePhase: 'SUCCESSOR_GATE',
    lockStatus: 'LOCK_RETAINED',
    admissionStatus: 'NOT_ADMITTED',
    executionSubstrate: 'GITHUB_ACTIONS',
    qualificationState: 'NOT_APPLICABLE',
    terminalState: 'FAIL_CLOSED',
    deploymentState: 'NOT_DEPLOYED',
    liveVerificationState: 'NOT_APPLICABLE',
    receipt: { errorCode: 'TEST_COMMAND_MISMATCH' },
    field: 'exactTestCommand',
    durableEvidenceRefs: ['issue-return']
  });

  assert.equal(state.schema, 'ESTATE_OPERATION_STATE_INDEX_RECORD_v1');
  assert.equal(state.failureClass, FAILURE_CLASSES.REQUEST_CONTRACT_MISMATCH);
  assert.equal(state.exactFailure, 'exactTestCommand');
  assert.equal(state.authorityCreated, false);
  assert.equal(state.nextUsefulAction, 'CORRECT_REQUEST_AND_PROCEDURE_CORRESPONDENCE_BEFORE_RERUN');
});

test('invalid input fails before classification', () => {
  assert.throws(() => normalizeAdministrativeFailure(null), /ADMINISTRATIVE_EVENT_OBJECT_REQUIRED/);
  assert.throws(() => normalizeAdministrativeFailure([]), /ADMINISTRATIVE_EVENT_OBJECT_REQUIRED/);
});
