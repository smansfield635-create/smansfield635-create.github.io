const deepFreeze = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
};

export const H_EARTH_LIFECYCLE_STATES = deepFreeze([
  'CANDIDATE',
  'VALIDATED',
  'ACCEPTED',
  'ACTIVE',
  'SUPERSEDED',
  'RETIRED'
]);

export const H_EARTH_LIFECYCLE_TRANSITIONS = deepFreeze([
  {
    transitionId: 'CANDIDATE_TO_VALIDATED',
    sourceState: 'CANDIDATE',
    targetState: 'VALIDATED',
    requiredActorClasses: [
      'requestingActor',
      'approvingAuthority',
      'executingActor',
      'postconditionAuditor'
    ],
    requiredEvidenceClasses: [
      'CANDIDATE_IDENTITY',
      'CANDIDATE_CONTENT_DIGEST',
      'SCHEMA_VALIDATION_RECEIPT',
      'REFERENTIAL_INTEGRITY_RECEIPT',
      'AUTHORITY_NON_COLLAPSE_RECEIPT',
      'REGRESSION_CORRIDOR_RECEIPT'
    ],
    resultingAuthority: 'VALIDATED_NONAUTHORIZING_CANDIDATE'
  },
  {
    transitionId: 'VALIDATED_TO_ACCEPTED',
    sourceState: 'VALIDATED',
    targetState: 'ACCEPTED',
    requiredActorClasses: [
      'requestingActor',
      'approvingAuthority',
      'executingActor',
      'postconditionAuditor'
    ],
    requiredEvidenceClasses: [
      'PASSING_SUCCESSOR_VALIDATION_RECEIPT',
      'EXACT_SUCCESSOR_IDENTITY',
      'EXPLICIT_ACCEPTANCE_STATEMENT',
      'ACCEPTANCE_SCOPE',
      'NONCANONICAL_BOUNDARY',
      'NO_ACTIVATION_INFERENCE_BOUNDARY'
    ],
    resultingAuthority: 'ACCEPTED_NONCANONICAL_NOT_ACTIVE'
  },
  {
    transitionId: 'ACCEPTED_TO_ACTIVE',
    sourceState: 'ACCEPTED',
    targetState: 'ACTIVE',
    requiredActorClasses: [
      'requestingActor',
      'approvingAuthority',
      'executingActor',
      'postconditionAuditor'
    ],
    requiredEvidenceClasses: [
      'EXACT_ACCEPTANCE_DECLARATION',
      'EXACT_ACCEPTANCE_CUSTODY_RECEIPT',
      'PASSING_SUCCESSOR_VALIDATION_RECEIPT',
      'EXPECTED_PARENT_COMMIT',
      'EXPECTED_INPUT_BLOB_MANIFEST',
      'AUTHORIZED_PATH_SET_DIGEST',
      'APPROVED_CHANGESET_DIGEST',
      'RECOVERY_CHECKPOINT',
      'UNCONSUMED_REPLAY_NONCE'
    ],
    resultingAuthority: 'ACTIVE_NONCANONICAL_REGISTRY_SUCCESSOR'
  },
  {
    transitionId: 'ACTIVE_TO_SUPERSEDED',
    sourceState: 'ACTIVE',
    targetState: 'SUPERSEDED',
    requiredActorClasses: [
      'requestingActor',
      'approvingAuthority',
      'executingActor',
      'postconditionAuditor'
    ],
    requiredEvidenceClasses: [
      'REPLACEMENT_ACTIVE_IDENTITY',
      'SUPERSESSION_RELATION',
      'HISTORICAL_PROVENANCE_CHECK',
      'AUTHORITY_WITHDRAWAL_SCOPE'
    ],
    resultingAuthority: 'SUPERSEDED_HISTORICAL_IDENTITY'
  },
  {
    transitionId: 'SUPERSEDED_TO_RETIRED',
    sourceState: 'SUPERSEDED',
    targetState: 'RETIRED',
    requiredActorClasses: [
      'requestingActor',
      'approvingAuthority',
      'executingActor',
      'postconditionAuditor'
    ],
    requiredEvidenceClasses: [
      'RETIREMENT_REASON',
      'EXECUTABLE_AUTHORITY_WITHDRAWAL_RECORD',
      'HISTORICAL_PROVENANCE_PRESERVATION_RECEIPT',
      'NO_DELETION_BOUNDARY'
    ],
    resultingAuthority: 'RETIRED_NONEXECUTABLE_HISTORICAL_IDENTITY'
  }
]);

const transitionById = new Map(
  H_EARTH_LIFECYCLE_TRANSITIONS.map((entry) => [entry.transitionId, entry])
);

const normalizeStringArray = (value) => (
  Array.isArray(value)
    ? [...new Set(value.filter((entry) => typeof entry === 'string' && entry.length > 0))].sort()
    : []
);

const sameStringSet = (left, right) => {
  const a = normalizeStringArray(left);
  const b = normalizeStringArray(right);
  return a.length === b.length && a.every((entry, index) => entry === b[index]);
};

const createBaseReceipt = (proposal) => ({
  evaluatorId: 'H_EARTH_REPOSITORY_LIFECYCLE_STATE_MACHINE_EVALUATOR_v1',
  proposalId: typeof proposal?.proposalId === 'string' ? proposal.proposalId : 'UNSPECIFIED',
  transitionId: typeof proposal?.transitionId === 'string' ? proposal.transitionId : 'UNSPECIFIED',
  sourceState: typeof proposal?.sourceState === 'string' ? proposal.sourceState : 'UNSPECIFIED',
  targetState: typeof proposal?.targetState === 'string' ? proposal.targetState : 'UNSPECIFIED',
  disposition: 'STOP',
  continuation: 'STOP_AND_REPORT',
  failureCodes: [],
  missingActorBindings: [],
  missingEvidenceClasses: [],
  unauthorizedRequestedPaths: [],
  resultingAuthority: 'NONE',
  contractSatisfied: false,
  approvalEstablished: false,
  executionAuthorityEstablished: false,
  transitionMayExecute: false,
  mutationMayProceed: false,
  acceptanceCreated: false,
  activationCreated: false,
  canonicalizationCreated: false,
  sourceAuthorityCreated: false,
  deploymentAuthorityCreated: false,
  productionAuthorityCreated: false
});

export const evaluateHEarthLifecycleTransitionProposal = (proposal = {}) => {
  const receipt = createBaseReceipt(proposal);
  const transition = transitionById.get(proposal.transitionId);

  if (!transition) {
    receipt.failureCodes.push('TRANSITION_ID_UNRESOLVED');
    return deepFreeze(receipt);
  }

  if (proposal.sourceState !== transition.sourceState) {
    receipt.failureCodes.push('SOURCE_STATE_MISMATCH');
  }
  if (proposal.targetState !== transition.targetState) {
    receipt.failureCodes.push('TARGET_STATE_MISMATCH');
  }

  const actorBindings = proposal.actorBindings && typeof proposal.actorBindings === 'object'
    ? proposal.actorBindings
    : {};
  receipt.missingActorBindings = transition.requiredActorClasses
    .filter((actorClass) => typeof actorBindings[actorClass] !== 'string' || actorBindings[actorClass].length === 0)
    .sort();
  if (receipt.missingActorBindings.length > 0) {
    receipt.failureCodes.push('ACTOR_BINDING_INCOMPLETE');
  }

  const suppliedEvidence = normalizeStringArray(proposal.evidenceClasses);
  receipt.missingEvidenceClasses = transition.requiredEvidenceClasses
    .filter((evidenceClass) => !suppliedEvidence.includes(evidenceClass))
    .sort();
  if (receipt.missingEvidenceClasses.length > 0) {
    receipt.failureCodes.push('REQUIRED_EVIDENCE_INCOMPLETE');
  }

  if (
    typeof proposal.expectedParentCommit !== 'string'
    || !/^[0-9a-f]{40}$/.test(proposal.expectedParentCommit)
  ) {
    receipt.failureCodes.push('EXPECTED_PARENT_COMMIT_INVALID');
  }
  if (proposal.observedParentCommit !== proposal.expectedParentCommit) {
    receipt.failureCodes.push('PARENT_COMMIT_MISMATCH');
  }

  const authorizedPaths = normalizeStringArray(proposal.authorizedPaths);
  const requestedPaths = normalizeStringArray(proposal.requestedPaths);
  receipt.unauthorizedRequestedPaths = requestedPaths
    .filter((requestedPath) => !authorizedPaths.includes(requestedPath));
  if (authorizedPaths.length === 0) {
    receipt.failureCodes.push('AUTHORIZED_PATH_SET_EMPTY');
  }
  if (receipt.unauthorizedRequestedPaths.length > 0) {
    receipt.failureCodes.push('REQUESTED_PATH_OUTSIDE_AUTHORIZED_SET');
  }

  if (proposal.authorizedPathSetDigestMatches !== true) {
    receipt.failureCodes.push('AUTHORIZED_PATH_SET_DIGEST_MISMATCH');
  }
  if (proposal.approvedChangesetDigestMatches !== true) {
    receipt.failureCodes.push('APPROVED_CHANGESET_DIGEST_MISMATCH');
  }
  if (proposal.expectedInputBlobsMatch !== true) {
    receipt.failureCodes.push('EXPECTED_INPUT_BLOB_MISMATCH');
  }
  if (proposal.recoveryCheckpointPresent !== true) {
    receipt.failureCodes.push('RECOVERY_CHECKPOINT_MISSING');
  }

  const replay = proposal.replay && typeof proposal.replay === 'object' ? proposal.replay : {};
  if (typeof replay.decisionId !== 'string' || replay.decisionId.length === 0) {
    receipt.failureCodes.push('DECISION_ID_MISSING');
  }
  if (typeof replay.nonce !== 'string' || replay.nonce.length === 0) {
    receipt.failureCodes.push('REPLAY_NONCE_MISSING');
  }
  if (replay.expired === true) {
    receipt.failureCodes.push('DECISION_EXPIRED');
  }
  if (replay.consumed === true) {
    receipt.failureCodes.push('DECISION_ALREADY_CONSUMED');
  }

  receipt.failureCodes = normalizeStringArray(receipt.failureCodes);
  if (receipt.failureCodes.length > 0) {
    return deepFreeze(receipt);
  }

  receipt.disposition = 'CONTRACT_SATISFIED_PENDING_SEPARATE_AUTHORITY';
  receipt.continuation = 'REQUIRE_STEP_2_APPROVAL_BINDING_AND_STEP_3_EXECUTION_AUTHORITY';
  receipt.resultingAuthority = transition.resultingAuthority;
  receipt.contractSatisfied = true;
  return deepFreeze(receipt);
};

export const isHEarthLifecycleTransitionPermitted = (sourceState, targetState) => (
  H_EARTH_LIFECYCLE_TRANSITIONS.some(
    (entry) => entry.sourceState === sourceState && entry.targetState === targetState
  )
);

export const getHEarthLifecycleTransitionDefinition = (transitionId) => {
  const transition = transitionById.get(transitionId);
  return transition ?? null;
};

export const getHEarthLifecycleStateMachineReceipt = () => deepFreeze({
  evaluatorId: 'H_EARTH_REPOSITORY_LIFECYCLE_STATE_MACHINE_EVALUATOR_v1',
  lifecycleStates: H_EARTH_LIFECYCLE_STATES,
  permittedTransitionIds: H_EARTH_LIFECYCLE_TRANSITIONS.map((entry) => entry.transitionId),
  transitionCount: H_EARTH_LIFECYCLE_TRANSITIONS.length,
  deterministic: true,
  readOnly: true,
  repositoryMutationCapability: false,
  approvalIssuanceCapability: false,
  executionAuthorityCapability: false,
  activationCapability: false,
  canonicalizationCapability: false
});

export const H_EARTH_LIFECYCLE_STATE_MACHINE = deepFreeze({
  states: H_EARTH_LIFECYCLE_STATES,
  transitions: H_EARTH_LIFECYCLE_TRANSITIONS,
  evaluateProposal: evaluateHEarthLifecycleTransitionProposal,
  isTransitionPermitted: isHEarthLifecycleTransitionPermitted,
  getTransitionDefinition: getHEarthLifecycleTransitionDefinition,
  getReceipt: getHEarthLifecycleStateMachineReceipt
});
