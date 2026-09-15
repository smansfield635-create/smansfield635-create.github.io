import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY = JSON.parse(fs.readFileSync(path.join(HERE, 'registry.v1.json'), 'utf8'));
const PROVEN_EDGES = new Set(REGISTRY.provenDependencyEdges);

const has = (set, value) => set.includes(value);
const bool = (value) => typeof value === 'boolean';

function notificationDisposition(facts) {
  if (facts.observationSource !== 'MIRROR_NOTIFICATION') return 'NOT_APPLICABLE';
  return facts.canonicalDurableEvidenceConfirmed === true && facts.uniqueUnresolvedInformation === false
    ? 'DISPOSABLE_AFTER_CANONICAL_CONFIRMATION'
    : 'RETAIN';
}

function receipt(facts, patch) {
  return Object.freeze({
    schema: 'FAILURE_DISPOSITION_RECEIPT_v1',
    result: 'CLASSIFIED',
    failureClass: facts.failureClass ?? 'UNKNOWN',
    observationSource: facts.observationSource ?? 'UNKNOWN',
    dependencyRelationship: facts.dependencyRelationship ?? 'UNKNOWN',
    authorityState: facts.authorityState ?? 'UNKNOWN',
    selectedForOperation: facts.selectedForOperation === true,
    candidateEffect: 'PRESERVE',
    blockingScope: 'CLASSIFICATION_BOUNDARY',
    blockingDisposition: 'CLASSIFICATION_BOUNDARY_FAIL_CLOSED',
    recoveryDisposition: 'FAIL_CLOSED_CLASSIFICATION_REQUIRED',
    retryBudget: 0,
    preserveCompletedEvidence: facts.completedEvidenceValid === true,
    resumeFromCheckpoint: null,
    propagationAllowed: false,
    propagationScope: 'NONE',
    notificationDisposition: notificationDisposition(facts),
    authorityCreated: false,
    dependencyEdgeCreated: false,
    ...patch
  });
}

function boundary(facts, reason) {
  return receipt(facts, {
    result: 'CLASSIFICATION_FAIL_CLOSED',
    failureClass: 'UNKNOWN',
    candidateEffect: 'PRESERVE',
    blockingScope: 'CLASSIFICATION_BOUNDARY',
    blockingDisposition: 'CLASSIFICATION_BOUNDARY_FAIL_CLOSED',
    recoveryDisposition: 'FAIL_CLOSED_CLASSIFICATION_REQUIRED',
    retryBudget: 0,
    propagationAllowed: false,
    propagationScope: 'NONE',
    classificationReason: reason
  });
}

function validate(facts) {
  if (!facts || typeof facts !== 'object' || Array.isArray(facts)) return 'FACTS_NOT_OBJECT';
  if (facts.schema !== 'FAILURE_DISPOSITION_NORMALIZED_FACTS_v1') return 'SCHEMA_INVALID';
  if (!has(REGISTRY.failureClasses, facts.failureClass)) return 'FAILURE_CLASS_UNRESOLVED';
  if (!has(REGISTRY.observationSources, facts.observationSource)) return 'OBSERVATION_SOURCE_UNRESOLVED';
  if (!has(REGISTRY.dependencyRelationships, facts.dependencyRelationship)) return 'DEPENDENCY_RELATIONSHIP_UNRESOLVED';
  if (!has(REGISTRY.authorityStates, facts.authorityState)) return 'AUTHORITY_STATE_UNRESOLVED';
  for (const key of ['selectedForOperation','candidatePresent','candidateBytesStable','scopeStable','negativeProductAssertion','completedEvidenceValid','sameAuthorityRepairMechanicallyProvable','canonicalDurableEvidenceConfirmed','uniqueUnresolvedInformation']) {
    if (!bool(facts[key])) return `BOOLEAN_REQUIRED:${key}`;
  }
  if (facts.failureClass === 'EXECUTION_TRANSIENT' && facts.negativeProductAssertion) return 'FACTS_CONTRADICTORY:TRANSIENT_WITH_NEGATIVE_PRODUCT_ASSERTION';
  if (facts.failureClass === 'PRODUCT_FAILURE' && !facts.negativeProductAssertion) return 'FACTS_CONTRADICTORY:PRODUCT_FAILURE_WITHOUT_NEGATIVE_ASSERTION';
  if (!facts.candidatePresent && (facts.candidateBytesStable || facts.completedEvidenceValid)) return 'FACTS_CONTRADICTORY:CANDIDATE_ABSENT_BUT_STATE_PRESERVED';
  return null;
}

export function classifyFailure(facts) {
  const invalid = validate(facts);
  if (invalid) return boundary(facts ?? {}, invalid);

  if (facts.failureClass === 'UNKNOWN' || facts.observationSource === 'UNKNOWN') {
    return boundary(facts, 'UNKNOWN_FAILURE_FACTS');
  }

  if (facts.observationSource === 'MIRROR_NOTIFICATION') {
    return receipt(facts, {
      candidateEffect: 'UNCHANGED_ADVISORY',
      blockingScope: 'NONE',
      blockingDisposition: 'ADVISORY_NONBLOCKING',
      recoveryDisposition: 'ADVISORY_CONTINUE',
      preserveCompletedEvidence: facts.completedEvidenceValid,
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: 'MIRROR_NOTIFICATION_HAS_NO_AUTHORITY'
    });
  }

  if (!facts.selectedForOperation || facts.dependencyRelationship === 'NONE') {
    return receipt(facts, {
      candidateEffect: 'UNCHANGED_ADVISORY',
      blockingScope: 'NONE',
      blockingDisposition: 'ADVISORY_NONBLOCKING',
      recoveryDisposition: 'ADVISORY_CONTINUE',
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: !facts.selectedForOperation ? 'UNSELECTED_FOR_OPERATION' : 'DEPENDENCY_DISJOINT'
    });
  }

  if (facts.dependencyRelationship === 'UNKNOWN' || facts.authorityState === 'UNKNOWN') {
    return boundary(facts, 'DEPENDENCY_OR_AUTHORITY_UNKNOWN');
  }

  const dependencyEdgeProven = PROVEN_EDGES.has(facts.dependencyRelationship);
  if (!dependencyEdgeProven) return boundary(facts, 'BLOCKING_DEPENDENCY_EDGE_NOT_PROVEN');

  if (facts.authorityState === 'REVOKED_OR_SUPERSEDED') {
    return receipt(facts, {
      candidateEffect: 'PRESERVE_PENDING_AUTHORITY',
      blockingScope: 'CURRENT_OPERATION',
      blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
      recoveryDisposition: 'REQUIRES_FRESH_AUTHORITY',
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: 'CURRENT_AUTHORITY_NOT_VALID'
    });
  }

  if (facts.failureClass === 'AUTHORITY_LINEAGE' || facts.authorityState === 'AMBIGUOUS_LINEAGE') {
    return receipt(facts, {
      candidateEffect: 'PRESERVE_PENDING_AUTHORITY',
      blockingScope: 'CURRENT_OPERATION',
      blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
      recoveryDisposition: facts.sameAuthorityRepairMechanicallyProvable ? 'REPAIR_SAME_AUTHORITY' : 'REQUIRES_FRESH_AUTHORITY',
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: facts.sameAuthorityRepairMechanicallyProvable ? 'LINEAGE_MECHANICALLY_PROVABLE' : 'LINEAGE_REQUIRES_FRESH_AUTHORITY'
    });
  }

  if (facts.failureClass === 'EXECUTION_TRANSIENT') {
    const stable = facts.authorityState === 'VALID_UNCHANGED' && facts.candidatePresent && facts.candidateBytesStable && facts.scopeStable;
    if (!stable) {
      return receipt(facts, {
        candidateEffect: 'PRESERVE_PENDING_AUTHORITY',
        blockingScope: 'CURRENT_OPERATION',
        blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
        recoveryDisposition: 'REQUIRES_FRESH_AUTHORITY',
        retryBudget: 0,
        propagationAllowed: false,
        propagationScope: 'NONE',
        classificationReason: 'TRANSIENT_CONTINUATION_PRECONDITIONS_NOT_MET'
      });
    }
    return receipt(facts, {
      candidateEffect: 'PRESERVE',
      blockingScope: 'CURRENT_EXECUTION_ATTEMPT_ONLY',
      blockingDisposition: 'BLOCKED_LOCAL_NONPROPAGATING',
      recoveryDisposition: 'RETRY_SAME_CANDIDATE',
      retryBudget: REGISTRY.hardInvariants.transientSameCandidateContinuationBudget,
      preserveCompletedEvidence: facts.completedEvidenceValid,
      resumeFromCheckpoint: facts.firstMissingCheckpoint ?? null,
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: 'STABLE_SAME_CANDIDATE_TRANSIENT_INTERRUPTION'
    });
  }

  if (facts.failureClass === 'EXECUTION_CAPABILITY_UNAVAILABLE' || facts.failureClass === 'EXECUTION_CAPABILITY_OR_PROVIDER_LIMIT') {
    return receipt(facts, {
      candidateEffect: 'PRESERVE',
      blockingScope: 'CURRENT_EXECUTION_SURFACE_ONLY',
      blockingDisposition: 'BLOCKED_LOCAL_NONPROPAGATING',
      recoveryDisposition: facts.sameAuthorityRepairMechanicallyProvable ? 'REPAIR_SAME_AUTHORITY' : 'NONE',
      retryBudget: 0,
      propagationAllowed: false,
      propagationScope: 'NONE',
      classificationReason: 'EXECUTION_SURFACE_FAILURE_DOES_NOT_INVALIDATE_CANDIDATE'
    });
  }

  if (facts.failureClass === 'PRODUCT_FAILURE') {
    return receipt(facts, {
      candidateEffect: 'REJECT',
      blockingScope: 'CURRENT_OPERATION',
      blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
      recoveryDisposition: 'REJECT_CANDIDATE',
      preserveCompletedEvidence: facts.completedEvidenceValid,
      propagationAllowed: true,
      propagationScope: 'PROVEN_DEPENDENCY_EDGE_ONLY',
      classificationReason: 'PROVEN_PRODUCT_FAILURE_ON_SELECTED_DEPENDENCY'
    });
  }

  if (facts.failureClass === 'EVIDENCE_OR_TEST_FAILURE') {
    if (facts.negativeProductAssertion) {
      return receipt(facts, {
        candidateEffect: 'REJECT',
        blockingScope: 'CURRENT_OPERATION',
        blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
        recoveryDisposition: 'REJECT_CANDIDATE',
        propagationAllowed: true,
        propagationScope: 'PROVEN_DEPENDENCY_EDGE_ONLY',
        classificationReason: 'SELECTED_TEST_ESTABLISHED_NEGATIVE_PRODUCT_ASSERTION'
      });
    }
    return receipt(facts, {
      candidateEffect: 'PRESERVE_UNPROVEN',
      blockingScope: 'CURRENT_OPERATION',
      blockingDisposition: 'BLOCKING_CURRENT_OPERATION',
      recoveryDisposition: 'REPAIR_SAME_AUTHORITY',
      propagationAllowed: true,
      propagationScope: 'PROVEN_DEPENDENCY_EDGE_ONLY',
      classificationReason: 'SELECTED_EVIDENCE_FAILURE_REQUIRES_BOUNDED_REPAIR'
    });
  }

  return boundary(facts, 'NO_DETERMINISTIC_RULE_MATCHED');
}

export { REGISTRY };
