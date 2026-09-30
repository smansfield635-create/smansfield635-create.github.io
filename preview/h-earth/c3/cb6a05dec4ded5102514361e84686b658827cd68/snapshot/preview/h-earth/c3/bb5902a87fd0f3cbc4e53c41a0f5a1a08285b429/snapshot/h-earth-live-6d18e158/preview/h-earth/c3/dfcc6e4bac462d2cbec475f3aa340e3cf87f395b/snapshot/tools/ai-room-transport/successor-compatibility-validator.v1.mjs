#!/usr/bin/env node
import {
  stable,
  hashObject,
  fail,
  assertObject,
  assertCommit,
  assertDigest,
  validateReceiptIdentity
} from './lib.v1.mjs';

export const SUCCESSOR_RECEIPT_SCHEMA = 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_RECEIPT_v1';
export const SUCCESSOR_RESULT = 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED';
export const AUTHORITY_POLICY = 'FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE';
export const EVIDENCE_POLICY = 'EXACT_HEAD_REVALIDATION_REQUIRED';

function positiveInteger(value, code) {
  if (!Number.isInteger(value) || value < 1) fail(code, String(value));
  return value;
}

function requiredBoolean(value, expected, code) {
  if (value !== expected) fail(code, String(value));
}

export function validateSuccessorCompatibility({ descriptor: rawDescriptor, request: rawRequest, successorReceipt: rawReceipt, receiptIdentity: rawIdentity }) {
  const descriptor = assertObject(rawDescriptor, 'SUCCESSOR_DESCRIPTOR_INVALID');
  const request = assertObject(rawRequest, 'SUCCESSOR_REQUEST_INVALID');
  const receipt = assertObject(rawReceipt, 'SUCCESSOR_RECEIPT_INVALID');
  const identity = validateReceiptIdentity(rawIdentity);

  if (descriptor.schema !== 'AUTHORIZED_TOOLSET_DESCRIPTOR_v1') fail('SUCCESSOR_DESCRIPTOR_SCHEMA_MISMATCH');
  if (receipt.schema !== SUCCESSOR_RECEIPT_SCHEMA) fail('SUCCESSOR_RECEIPT_SCHEMA_MISMATCH', receipt.schema);
  if (receipt.result !== SUCCESSOR_RESULT) fail('SUCCESSOR_RECEIPT_RESULT_MISMATCH', receipt.result);
  if (request.operationId === descriptor.operationId) fail('SUCCESSOR_PATH_NOT_REQUIRED');

  const predecessor = assertObject(receipt.predecessor, 'SUCCESSOR_PREDECESSOR_MISSING');
  const successor = assertObject(receipt.successor, 'SUCCESSOR_CHILD_MISSING');

  if (predecessor.operationId !== descriptor.operationId) fail('SUCCESSOR_PREDECESSOR_DESCRIPTOR_MISMATCH', `${descriptor.operationId}:${predecessor.operationId}`);
  if (successor.operationId !== request.operationId) fail('SUCCESSOR_OPERATION_ID_MISMATCH', `${request.operationId}:${successor.operationId}`);
  if (successor.projectId !== descriptor.projectId) fail('SUCCESSOR_PROJECT_MISMATCH', `${descriptor.projectId}:${successor.projectId}`);
  if (predecessor.terminalDisposition !== 'SUPERSEDED') fail('PREDECESSOR_NOT_SUPERSEDED', predecessor.terminalDisposition);
  requiredBoolean(predecessor.terminalHistoryPreserved, true, 'PREDECESSOR_TERMINAL_HISTORY_NOT_PRESERVED');
  if (successor.state !== 'ADMITTED_LOCKED') fail('SUCCESSOR_NOT_ADMITTED_LOCKED', successor.state);

  assertCommit(predecessor.governingHead, 'SUCCESSOR_PREDECESSOR_HEAD_INVALID');
  assertCommit(successor.governingHead, 'SUCCESSOR_GOVERNING_HEAD_INVALID');
  if (predecessor.governingHead === successor.governingHead) fail('SUCCESSOR_HEAD_NOT_ADVANCED');
  assertDigest(predecessor.scopeHash, 'SUCCESSOR_PREDECESSOR_SCOPE_HASH_INVALID');
  assertDigest(successor.scopeHash, 'SUCCESSOR_SCOPE_HASH_INVALID');
  assertDigest(successor.requestDigest, 'SUCCESSOR_REQUEST_DIGEST_INVALID');
  assertDigest(successor.procedureLocatorDigest, 'SUCCESSOR_PROCEDURE_DIGEST_INVALID');
  const predecessorGeneration = positiveInteger(predecessor.lockGeneration, 'SUCCESSOR_PREDECESSOR_GENERATION_INVALID');
  const successorGeneration = positiveInteger(successor.lockGeneration, 'SUCCESSOR_GENERATION_INVALID');
  if (successorGeneration <= predecessorGeneration) fail('SUCCESSOR_GENERATION_NOT_ADVANCED', `${predecessorGeneration}:${successorGeneration}`);

  if (receipt.authorityPolicy !== AUTHORITY_POLICY) fail('SUCCESSOR_AUTHORITY_POLICY_MISMATCH', receipt.authorityPolicy);
  requiredBoolean(receipt.authorityInherited, false, 'AUTHORITY_INHERITANCE_FORBIDDEN');
  if (receipt.authoritySource !== 'FRESH_SUCCESSOR_REQUEST_AND_CONSTRUCTION_PROCEDURE') fail('SUCCESSOR_AUTHORITY_SOURCE_INVALID', receipt.authoritySource);
  if (receipt.evidencePolicy !== EVIDENCE_POLICY) fail('SUCCESSOR_EVIDENCE_POLICY_MISMATCH', receipt.evidencePolicy);
  requiredBoolean(receipt.exactHeadRevalidationRequired, true, 'SUCCESSOR_EXACT_HEAD_REVALIDATION_NOT_REQUIRED');
  requiredBoolean(receipt.operationStarted, true, 'SUCCESSOR_OPERATION_NOT_STARTED');
  requiredBoolean(receipt.workflowExecutionAuthorized, true, 'SUCCESSOR_WORKFLOW_EXECUTION_NOT_AUTHORIZED');
  requiredBoolean(receipt.implementationInferenceAuthorized, false, 'SUCCESSOR_IMPLEMENTATION_INFERENCE_FORBIDDEN');
  requiredBoolean(receipt.oneLedgerMutationRequired, true, 'SUCCESSOR_ATOMIC_LEDGER_TRANSITION_NOT_PROVEN');

  const before = positiveInteger(receipt.ledgerGenerationBefore, 'SUCCESSOR_LEDGER_GENERATION_BEFORE_INVALID');
  const after = positiveInteger(receipt.ledgerGenerationAfter, 'SUCCESSOR_LEDGER_GENERATION_AFTER_INVALID');
  if (after !== successorGeneration || after !== before + 1) fail('SUCCESSOR_LEDGER_GENERATION_MISMATCH', `${before}:${after}:${successorGeneration}`);

  return stable({
    schema: 'AUTHORIZED_SUCCESSOR_COMPATIBILITY_RECEIPT_v1',
    result: 'VALID_CANONICAL_ONE_HOP_SUCCESSOR',
    descriptorId: descriptor.descriptorId,
    descriptorOperationId: descriptor.operationId,
    authorizedOperationId: request.operationId,
    projectId: descriptor.projectId,
    predecessorOperationId: predecessor.operationId,
    predecessorLockScope: predecessor.lockScope,
    predecessorLockGeneration: predecessorGeneration,
    predecessorGoverningHead: predecessor.governingHead,
    successorOperationId: successor.operationId,
    successorLockScope: successor.lockScope,
    successorLockGeneration: successorGeneration,
    successorGoverningHead: successor.governingHead,
    successorRequestDigest: successor.requestDigest,
    successorProcedureLocatorDigest: successor.procedureLocatorDigest,
    successorReceiptDigest: hashObject(receipt),
    successorProofIdentity: identity,
    successorProofSha256: identity.sha256,
    authorityInherited: false,
    exactHeadRevalidationRequired: true,
    genericCommandAuthority: false,
    descriptorMutationAuthorized: false,
    arbitrarySuccessorAccepted: false
  });
}
