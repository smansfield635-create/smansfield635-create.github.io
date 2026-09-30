import assert from 'node:assert/strict';
import { classifyFailure, REGISTRY } from './classifier.v1.mjs';

const base = {
  schema: 'FAILURE_DISPOSITION_NORMALIZED_FACTS_v1',
  failureClass: 'UNKNOWN',
  observationSource: 'CANONICAL_REPOSITORY_EVIDENCE',
  dependencyRelationship: 'DECLARED_DIRECT_DEPENDENCY',
  authorityState: 'VALID_UNCHANGED',
  selectedForOperation: true,
  candidatePresent: true,
  candidateBytesStable: true,
  scopeStable: true,
  negativeProductAssertion: false,
  completedEvidenceValid: false,
  firstMissingCheckpoint: null,
  sameAuthorityRepairMechanicallyProvable: false,
  canonicalDurableEvidenceConfirmed: true,
  uniqueUnresolvedInformation: false
};

const cases = [];
const test = (name, facts, expected) => {
  const actual = classifyFailure({ ...base, ...facts });
  for (const [key, value] of Object.entries(expected)) assert.deepEqual(actual[key], value, `${name}:${key}`);
  assert.equal(actual.authorityCreated, false, `${name}:authorityCreated`);
  assert.equal(actual.dependencyEdgeCreated, false, `${name}:dependencyEdgeCreated`);
  cases.push({ name, result: 'PASS' });
};

test('GEN2289_EXECUTION_CAPABILITY_UNAVAILABLE', {
  failureClass: 'EXECUTION_CAPABILITY_UNAVAILABLE',
  observationSource: 'CANONICAL_REPOSITORY_EVIDENCE',
  dependencyRelationship: 'DECLARED_DIRECT_DEPENDENCY'
}, {
  candidateEffect: 'PRESERVE',
  blockingDisposition: 'BLOCKED_LOCAL_NONPROPAGATING',
  recoveryDisposition: 'NONE',
  propagationAllowed: false
});

test('GEN2290_PROVIDER_SIGNAL_DEPENDENCY_DISJOINT', {
  failureClass: 'EXECUTION_CAPABILITY_OR_PROVIDER_LIMIT',
  observationSource: 'EXTERNAL_PROVIDER_SIGNAL',
  dependencyRelationship: 'NONE',
  selectedForOperation: false
}, {
  candidateEffect: 'UNCHANGED_ADVISORY',
  blockingDisposition: 'ADVISORY_NONBLOCKING',
  recoveryDisposition: 'ADVISORY_CONTINUE',
  propagationAllowed: false
});

test('GEN2291_TRANSIENT_TIMEOUT', {
  failureClass: 'EXECUTION_TRANSIENT',
  observationSource: 'ROOM_LOCAL_EXECUTION',
  dependencyRelationship: 'DECLARED_DIRECT_DEPENDENCY',
  completedEvidenceValid: true,
  firstMissingCheckpoint: 840
}, {
  candidateEffect: 'PRESERVE',
  blockingDisposition: 'BLOCKED_LOCAL_NONPROPAGATING',
  recoveryDisposition: 'RETRY_SAME_CANDIDATE',
  retryBudget: 1,
  preserveCompletedEvidence: true,
  resumeFromCheckpoint: 840,
  propagationAllowed: false
});

test('STALE_UNSELECTED_CI', {
  failureClass: 'EVIDENCE_OR_TEST_FAILURE',
  observationSource: 'CANONICAL_REPOSITORY_EVIDENCE',
  dependencyRelationship: 'NONE',
  selectedForOperation: false
}, {
  blockingDisposition: 'ADVISORY_NONBLOCKING',
  recoveryDisposition: 'ADVISORY_CONTINUE',
  propagationAllowed: false
});

test('VERCEL_RESOURCE_LIMIT', {
  failureClass: 'EXECUTION_CAPABILITY_OR_PROVIDER_LIMIT',
  observationSource: 'EXTERNAL_PROVIDER_SIGNAL',
  dependencyRelationship: 'NONE',
  selectedForOperation: false
}, {
  blockingDisposition: 'ADVISORY_NONBLOCKING',
  recoveryDisposition: 'ADVISORY_CONTINUE',
  candidateEffect: 'UNCHANGED_ADVISORY'
});

test('MIRROR_NOTIFICATION_DISPOSABLE_AFTER_CANONICAL_CONFIRMATION', {
  failureClass: 'EVIDENCE_OR_TEST_FAILURE',
  observationSource: 'MIRROR_NOTIFICATION',
  dependencyRelationship: 'DECLARED_DIRECT_DEPENDENCY',
  selectedForOperation: true,
  canonicalDurableEvidenceConfirmed: true,
  uniqueUnresolvedInformation: false
}, {
  blockingDisposition: 'ADVISORY_NONBLOCKING',
  recoveryDisposition: 'ADVISORY_CONTINUE',
  notificationDisposition: 'DISPOSABLE_AFTER_CANONICAL_CONFIRMATION',
  propagationAllowed: false
});

test('AUTHORITY_LINEAGE_REQUIRES_FRESH_AUTHORITY', {
  failureClass: 'AUTHORITY_LINEAGE',
  authorityState: 'AMBIGUOUS_LINEAGE',
  dependencyRelationship: 'EXPLICIT_CANONICAL_SEMANTIC_DEPENDENCY',
  sameAuthorityRepairMechanicallyProvable: false
}, {
  candidateEffect: 'PRESERVE_PENDING_AUTHORITY',
  blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
  recoveryDisposition: 'REQUIRES_FRESH_AUTHORITY',
  propagationAllowed: false
});

test('AUTHORITY_LINEAGE_MECHANICALLY_PROVABLE', {
  failureClass: 'AUTHORITY_LINEAGE',
  authorityState: 'AMBIGUOUS_LINEAGE',
  dependencyRelationship: 'EXPLICIT_CANONICAL_SEMANTIC_DEPENDENCY',
  sameAuthorityRepairMechanicallyProvable: true
}, {
  blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
  recoveryDisposition: 'REPAIR_SAME_AUTHORITY',
  propagationAllowed: false
});

test('UNKNOWN_FAILS_CLOSED_AT_CLASSIFICATION_BOUNDARY', {
  failureClass: 'UNKNOWN'
}, {
  result: 'CLASSIFICATION_FAIL_CLOSED',
  failureClass: 'UNKNOWN',
  candidateEffect: 'PRESERVE',
  blockingDisposition: 'CLASSIFICATION_BOUNDARY_FAIL_CLOSED',
  recoveryDisposition: 'FAIL_CLOSED_CLASSIFICATION_REQUIRED',
  propagationAllowed: false
});

test('TRANSIENT_CHANGED_BYTES_HAS_NO_SAME_CANDIDATE_RETRY_RIGHT', {
  failureClass: 'EXECUTION_TRANSIENT',
  observationSource: 'ROOM_LOCAL_EXECUTION',
  candidateBytesStable: false,
  completedEvidenceValid: true,
  firstMissingCheckpoint: 840
}, {
  candidateEffect: 'PRESERVE_PENDING_AUTHORITY',
  recoveryDisposition: 'REQUIRES_FRESH_AUTHORITY',
  retryBudget: 0,
  propagationAllowed: false
});

test('CONTRADICTORY_TRANSIENT_FACTS_FAIL_CLASSIFICATION_BOUNDARY', {
  failureClass: 'EXECUTION_TRANSIENT',
  observationSource: 'ROOM_LOCAL_EXECUTION',
  negativeProductAssertion: true
}, {
  result: 'CLASSIFICATION_FAIL_CLOSED',
  failureClass: 'UNKNOWN',
  candidateEffect: 'PRESERVE',
  blockingDisposition: 'CLASSIFICATION_BOUNDARY_FAIL_CLOSED',
  recoveryDisposition: 'FAIL_CLOSED_CLASSIFICATION_REQUIRED',
  propagationAllowed: false
});

test('SELECTED_PRODUCT_FAILURE_PROPAGATES_ONLY_ON_PROVEN_EDGE', {
  failureClass: 'PRODUCT_FAILURE',
  negativeProductAssertion: true,
  dependencyRelationship: 'CHANGED_BYTE'
}, {
  candidateEffect: 'REJECT',
  recoveryDisposition: 'REJECT_CANDIDATE',
  propagationAllowed: true,
  propagationScope: 'PROVEN_DEPENDENCY_EDGE_ONLY'
});

assert.equal(REGISTRY.authorityEffect, 'NONE');
assert.equal(REGISTRY.classificationCreatesAuthority, false);
assert.equal(REGISTRY.classificationCreatesDependencyEdges, false);
assert.equal(REGISTRY.hardInvariants.transientSameCandidateContinuationBudget, 1);

const output = {
  schema: 'FAILURE_DISPOSITION_SELF_TEST_RECEIPT_v1',
  result: 'PASS',
  caseCount: cases.length,
  cases,
  authorityEffect: 'NONE',
  independentModelClaimed: false
};
console.log(JSON.stringify(output, null, 2));
