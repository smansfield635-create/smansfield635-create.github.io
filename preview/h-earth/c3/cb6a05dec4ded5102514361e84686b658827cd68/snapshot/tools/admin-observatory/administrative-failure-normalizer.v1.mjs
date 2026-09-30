#!/usr/bin/env node

export const FAILURE_CLASSES = Object.freeze({
  PRODUCT_FAILURE: 'PRODUCT_FAILURE',
  CONTROL_PLANE_REJECTION: 'CONTROL_PLANE_REJECTION',
  REQUEST_CONTRACT_MISMATCH: 'REQUEST_CONTRACT_MISMATCH',
  VERIFIER_FAILURE: 'VERIFIER_FAILURE',
  EXECUTION_INFRASTRUCTURE_FAILURE: 'EXECUTION_INFRASTRUCTURE_FAILURE',
  RESEARCH_EXPERIMENT_FAILURE: 'RESEARCH_EXPERIMENT_FAILURE',
  DEPLOYMENT_FAILURE: 'DEPLOYMENT_FAILURE',
  EVIDENCE_TRANSPORT_FAILURE: 'EVIDENCE_TRANSPORT_FAILURE',
  INSUFFICIENT_DURABLE_DETAIL: 'INSUFFICIENT_DURABLE_DETAIL'
});

export const AUTHORITY_BOUNDARY = Object.freeze({
  repositoryMutationAuthority: false,
  lockAuthority: false,
  admissionAuthority: false,
  successorAuthority: false,
  deploymentAuthority: false,
  releaseAuthority: false,
  workflowDispatchAuthority: false,
  operationLedgerMutationAuthority: false
});

function bool(value) {
  return value === true;
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.length > 0) ?? null;
}

function receiptErrorCode(event) {
  return firstString(
    event?.exactFailure,
    event?.errorCode,
    event?.receipt?.errorCode,
    event?.canonicalReceipt?.errorCode,
    event?.nativeReceipt?.errorCode
  );
}

function durableEvidencePresent(event) {
  return bool(event?.durableEvidencePresent)
    || bool(event?.durableFailureEvidence)
    || Array.isArray(event?.durableEvidenceRefs) && event.durableEvidenceRefs.length > 0
    || Boolean(event?.receipt)
    || Boolean(event?.canonicalReceipt)
    || Boolean(event?.nativeReceipt);
}

function isRequestContractMismatch(event) {
  const code = receiptErrorCode(event);
  return code === 'TEST_COMMAND_MISMATCH'
    || code === 'REQUEST_PROCEDURE_CONTRACT_MISMATCH'
    || event?.field === 'exactTestCommand'
    || event?.exactFailure === 'exactTestCommand';
}

function isResearchExperiment(event) {
  return event?.workloadClass === 'RESEARCH_EXPERIMENT'
    || event?.productLane === 'RESEARCH_EXPERIMENT'
    || /research/i.test(String(event?.workflowName || ''));
}

function rawLogUnavailable(event) {
  return event?.rawLogRetrieval === 'UNAVAILABLE'
    || event?.rawLogRetrieval === 'BLOB_NOT_FOUND'
    || event?.logStatus === 'BlobNotFound'
    || event?.logStatus === 'UNAVAILABLE';
}

export function normalizeAdministrativeFailure(event = {}) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw new TypeError('ADMINISTRATIVE_EVENT_OBJECT_REQUIRED');
  }

  if (isRequestContractMismatch(event)) {
    return Object.freeze({
      schema: 'ADMINISTRATIVE_FAILURE_NORMALIZATION_RECEIPT_v1',
      result: 'NORMALIZED',
      platformHealth: 'HEALTHY',
      operationResult: 'NOT_ADMITTED',
      failureClass: FAILURE_CLASSES.REQUEST_CONTRACT_MISMATCH,
      exactFailure: firstString(event.exactFailure, event.field, 'exactTestCommand'),
      mutationOccurred: bool(event.mutationOccurred),
      authorityInherited: bool(event.authorityInherited),
      durableFailureEvidence: durableEvidencePresent(event) ? 'PRESENT' : 'MISSING',
      remediationOwner: 'REQUEST_PROCEDURE_COMPOSITION',
      rerunWithoutCorrectionUseful: false,
      nextUsefulAction: 'CORRECT_REQUEST_AND_PROCEDURE_CORRESPONDENCE_BEFORE_RERUN',
      authorityBoundary: AUTHORITY_BOUNDARY
    });
  }

  if (isResearchExperiment(event) && rawLogUnavailable(event)) {
    return Object.freeze({
      schema: 'ADMINISTRATIVE_FAILURE_NORMALIZATION_RECEIPT_v1',
      result: 'NORMALIZED',
      platformHealth: 'NOT_IMPLICATED_YET',
      workloadClass: 'RESEARCH_EXPERIMENT',
      executionResult: firstString(event.executionResult, 'FAILED'),
      failureClass: FAILURE_CLASSES.INSUFFICIENT_DURABLE_DETAIL,
      exactFailure: firstString(event.exactFailure, 'RAW_LOG_UNAVAILABLE'),
      rawLogRetrieval: 'UNAVAILABLE',
      durableFailureEvidence: durableEvidencePresent(event) ? 'PARTIAL_OR_PRESENT' : 'INSUFFICIENT',
      remediationOwner: 'DURABLE_EVIDENCE_RESOLUTION',
      rerunWithoutCorrectionUseful: false,
      nextUsefulAction: 'RESOLVE_EXISTING_DURABLE_RECEIPT_OR_ANNOTATION',
      authorityBoundary: AUTHORITY_BOUNDARY
    });
  }

  if (isResearchExperiment(event)) {
    return Object.freeze({
      schema: 'ADMINISTRATIVE_FAILURE_NORMALIZATION_RECEIPT_v1',
      result: 'NORMALIZED',
      platformHealth: 'NOT_IMPLICATED_YET',
      workloadClass: 'RESEARCH_EXPERIMENT',
      executionResult: firstString(event.executionResult, 'FAILED'),
      failureClass: FAILURE_CLASSES.RESEARCH_EXPERIMENT_FAILURE,
      exactFailure: receiptErrorCode(event),
      durableFailureEvidence: durableEvidencePresent(event) ? 'PRESENT' : 'UNKNOWN',
      remediationOwner: 'RESEARCH_WORKLOAD_OWNER',
      rerunWithoutCorrectionUseful: false,
      nextUsefulAction: 'LOCALIZE_RESEARCH_FAILURE_WITH_DURABLE_RECEIPT',
      authorityBoundary: AUTHORITY_BOUNDARY
    });
  }

  if (rawLogUnavailable(event)) {
    return Object.freeze({
      schema: 'ADMINISTRATIVE_FAILURE_NORMALIZATION_RECEIPT_v1',
      result: 'NORMALIZED',
      platformHealth: 'UNKNOWN',
      failureClass: FAILURE_CLASSES.EVIDENCE_TRANSPORT_FAILURE,
      exactFailure: 'RAW_LOG_UNAVAILABLE',
      durableFailureEvidence: durableEvidencePresent(event) ? 'PRESENT' : 'MISSING',
      remediationOwner: 'DURABLE_EVIDENCE_LOCATOR',
      rerunWithoutCorrectionUseful: false,
      nextUsefulAction: 'LOCATE_AUTHORITATIVE_RECEIPT_OR_ARTIFACT',
      authorityBoundary: AUTHORITY_BOUNDARY
    });
  }

  return Object.freeze({
    schema: 'ADMINISTRATIVE_FAILURE_NORMALIZATION_RECEIPT_v1',
    result: 'NORMALIZED',
    platformHealth: firstString(event.platformHealth, 'UNKNOWN'),
    failureClass: firstString(event.failureClass, FAILURE_CLASSES.INSUFFICIENT_DURABLE_DETAIL),
    exactFailure: receiptErrorCode(event),
    durableFailureEvidence: durableEvidencePresent(event) ? 'PRESENT' : 'UNKNOWN',
    remediationOwner: firstString(event.remediationOwner, 'UNCLASSIFIED_OWNER'),
    rerunWithoutCorrectionUseful: false,
    nextUsefulAction: firstString(event.nextUsefulAction, 'COLLECT_STRONGER_DURABLE_EVIDENCE'),
    authorityBoundary: AUTHORITY_BOUNDARY
  });
}

export function toEstateOperationStateIndex(event = {}) {
  const normalized = normalizeAdministrativeFailure(event);
  return Object.freeze({
    schema: 'ESTATE_OPERATION_STATE_INDEX_RECORD_v1',
    repository: firstString(event.repository, 'UNKNOWN_REPOSITORY'),
    branch: firstString(event.branch, 'UNKNOWN_BRANCH'),
    head: firstString(event.head, '0000000000000000000000000000000000000000'),
    operationId: firstString(event.operationId),
    productLane: firstString(event.productLane, event.workloadClass, 'UNKNOWN_PRODUCT_LANE'),
    controlPlanePhase: firstString(event.controlPlanePhase, 'UNKNOWN_PHASE'),
    lockStatus: firstString(event.lockStatus, 'UNKNOWN_LOCK_STATUS'),
    admissionStatus: firstString(event.admissionStatus, event.operationResult, 'UNKNOWN_ADMISSION_STATUS'),
    executionSubstrate: firstString(event.executionSubstrate, 'UNKNOWN_EXECUTION_SUBSTRATE'),
    qualificationState: firstString(event.qualificationState, 'UNKNOWN_QUALIFICATION_STATE'),
    terminalState: firstString(event.terminalState, event.executionResult, 'UNKNOWN_TERMINAL_STATE'),
    deploymentState: firstString(event.deploymentState, 'UNKNOWN_DEPLOYMENT_STATE'),
    liveVerificationState: firstString(event.liveVerificationState, 'UNKNOWN_LIVE_VERIFICATION_STATE'),
    failureClass: normalized.failureClass,
    exactFailure: normalized.exactFailure,
    durableEvidenceRefs: Array.isArray(event.durableEvidenceRefs) ? event.durableEvidenceRefs.slice() : [],
    remediationOwner: normalized.remediationOwner,
    nextUsefulAction: normalized.nextUsefulAction,
    authorityCreated: false,
    notes: firstString(event.notes)
  });
}
