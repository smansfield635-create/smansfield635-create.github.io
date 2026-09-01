/** Targets 4C-4 through 4C-8 · Positive, negative, drift, and adversarial fixtures. */
import { deepFreeze } from '../h-earth.repository-registry.validator-engine.identity.js';
import {
  buildTarget4CCompleteOperation,
  getTarget4CFixtureContext
} from './h-earth.repository-registry.fixture-suite.builder.js';

const context = getTarget4CFixtureContext();
const WRONG_COMMIT = '0000000000000000000000000000000000000001';
const WRONG_BLOB = '1111111111111111111111111111111111111111';

function clone(value) {
  return structuredClone(value);
}

function build(operationId, options = {}) {
  return buildTarget4CCompleteOperation({
    operationId,
    seedPath: options.seedPath ?? context.kernelSeedPath,
    requestedAction: options.requestedAction,
    operationClass: options.operationClass,
    requestedMutation: options.requestedMutation,
    overrides: options.overrides ?? {}
  });
}

function operation(operationId, mutate, options = {}) {
  const built = build(operationId, options);
  const value = clone(built.operationInput);
  if (mutate) mutate(value, built);
  return value;
}

function exactOccurrence(occurrence) {
  if (!occurrence) throw new Error('TARGET_4C_EXACT_OCCURRENCE_REQUIRED');
  return {
    path: occurrence.path,
    commitSha: occurrence.commitSha,
    gitBlobSha: occurrence.gitBlobSha,
    refName: occurrence.refName
  };
}

function record({
  fixtureId,
  fixtureClass,
  fixtureCategory,
  description,
  operationInput,
  expectedDisposition,
  requiredFailureCodes = [],
  prohibitedFailureCodes = [],
  expectedAuthorityPreservation = true,
  expectedCardinalPreservation = true,
  expectedOccurrenceResult = 'RESOLVED',
  criticalAssertions = []
}) {
  return deepFreeze({
    fixtureId,
    fixtureClass,
    fixtureCategory,
    description,
    sourceOperationId: operationInput.operationId ?? `${fixtureId}_MALFORMED_OPERATION`,
    operationInput,
    expectedDisposition,
    requiredFailureCodes: [...requiredFailureCodes].sort(),
    prohibitedFailureCodes: [...prohibitedFailureCodes].sort(),
    expectedTraceLength: 14,
    expectedMutationMayProceed: false,
    expectedAuthorityPreservation,
    expectedCardinalPreservation,
    expectedOccurrenceResult,
    criticalAssertions: [...criticalAssertions].sort()
  });
}

const p01 = operation('TARGET_4C_P01_COMPLETE_READ_ONLY_KERNEL_INSPECTION');
const p02 = operation('TARGET_4C_P02_COMPLETE_GATE_B_PACKAGE_DERIVATION', null, { seedPath: context.gateBSeedPath });
const p03Built = build('TARGET_4C_P03_EXACT_READ_ONLY_OCCURRENCE_RESOLUTION');
const p03 = clone(p03Built.operationInput);
p03.assertedOccurrences = [exactOccurrence(p03Built.exactOccurrence)];
p03.requestedDispositionContext.requireExactOccurrenceForReadOnly = true;
const p04 = operation('TARGET_4C_P04_COMPLETE_CARDINAL_KERNEL_PROJECTION', (input) => {
  input.assertedCardinalRoles = context.explicitCardinalNodes.map((node) => ({
    nodeId: node.nodeId,
    cardinalRole: node.cardinalRole,
    cardinalStatus: node.cardinalStatus
  }));
});
const p05 = operation('TARGET_4C_P05_DETERMINISTIC_REPEAT_EXECUTION');
const p06 = operation('TARGET_4C_P06_NONCRITICAL_EVIDENCE_LIMITATION', (input) => {
  input.evidenceReferences = [context.limitedEvidence.evidenceId];
});

const baselineForScope = build('TARGET_4C_SCOPE_REFERENCE_ONLY');
const firstNonCompositeNodeId = baselineForScope.preview.composite.nodes
  .find((node) => node.nodeType !== 'COMPOSITE_UNIT').nodeId;
const firstRelationId = baselineForScope.preview.affectedRelationIds[0];
const firstCompositeId = baselineForScope.preview.affectedCompositeUnitIds[0];

const n01 = operation('TARGET_4C_N01_INCOMPLETE_AFFECTED_NODE_SET', (input) => {
  input.declaredAffectedNodeIds = input.declaredAffectedNodeIds.filter((nodeId) => nodeId !== firstNonCompositeNodeId);
});
const n02 = operation('TARGET_4C_N02_INCOMPLETE_AFFECTED_RELATION_SET', (input) => {
  input.declaredAffectedRelationIds = input.declaredAffectedRelationIds.filter((relationId) => relationId !== firstRelationId);
});
const n03 = operation('TARGET_4C_N03_MISSING_DECLARED_COMPOSITE_UNIT', (input) => {
  input.declaredCompositeUnitIds = input.declaredCompositeUnitIds.filter((unitId) => unitId !== firstCompositeId);
});
const n04 = operation('TARGET_4C_N04_UNKNOWN_DECLARED_NODE', (input) => {
  input.declaredAffectedNodeIds.push('UNKNOWN_NODE_FOR_TARGET_4C');
});
const n05 = operation('TARGET_4C_N05_UNKNOWN_DECLARED_RELATION', (input) => {
  input.declaredAffectedRelationIds.push('UNKNOWN_RELATION_FOR_TARGET_4C');
});
const n06 = operation('TARGET_4C_N06_EMPTY_OPERATION_SCOPE', (input) => {
  input.requestedPaths = [];
  input.declaredAffectedNodeIds = [];
  input.declaredAffectedRelationIds = [];
  input.declaredCompositeUnitIds = [];
});
const wrongRole = ['NORTH', 'EAST', 'SOUTH', 'WEST'].find((role) => role !== context.explicitCardinalNodes[0].cardinalRole);
const n07 = operation('TARGET_4C_N07_CARDINAL_ROLE_COLLAPSE', (input) => {
  input.assertedCardinalRoles = [{
    nodeId: context.explicitCardinalNodes[0].nodeId,
    cardinalRole: wrongRole,
    cardinalStatus: context.explicitCardinalNodes[0].cardinalStatus
  }];
});
const n08 = operation('TARGET_4C_N08_GATE_B_CANDIDATE_ROLE_PROMOTION', (input) => {
  input.assertedCardinalRoles = [{
    nodeId: context.candidateCardinal.nodeId,
    cardinalRole: context.candidateCardinal.cardinalRole,
    cardinalStatus: 'ACCEPTED'
  }];
});
const n09 = operation('TARGET_4C_N09_ADAPTER_PROMOTED_TO_ADMISSION_AUTHORITY', (input) => {
  input.assertedAuthority = [{
    nodeId: context.adapter.nodeId,
    authorityClass: 'ADMISSION_AUTHORITY',
    authorityClaim: 'ADMISSION_AUTHORITY'
  }];
});
const n10 = operation('TARGET_4C_N10_FACADE_PROMOTED_TO_MEMBER_AUTHORITY', (input) => {
  input.assertedAuthority = [{
    nodeId: context.facade.nodeId,
    authorityClass: 'MEMBER_AUTHORITY_OWNER',
    authorityClaim: 'OWNS_MEMBER_AUTHORITY'
  }];
});
const n11 = operation('TARGET_4C_N11_GENERIC_AUTHORITY_TRANSFER', (input) => {
  input.assertedAuthority = [{
    nodeId: context.genericAuthorityNode.nodeId,
    authorityClass: 'UNAUTHORIZED_TRANSFER_AUTHORITY',
    authorityClaim: 'TRANSFER_AUTHORITY'
  }];
});
const n12 = operation('TARGET_4C_N12_CANDIDATE_PROMOTED_TO_CANONICAL', (input) => {
  input.assertedLifecycleTransitions = [{
    nodeId: context.candidateLifecycleNode.nodeId,
    fromStatus: context.candidateLifecycleNode.lifecycleStatus,
    toStatus: 'CANONICAL'
  }];
}, { operationClass: 'LIFECYCLE_TRANSITION_PROPOSAL', requestedAction: 'PROMOTE_CANDIDATE_TO_CANONICAL' });
const n13 = operation('TARGET_4C_N13_UNRESOLVED_LIFECYCLE_TRANSITION', (input) => {
  input.assertedLifecycleTransitions = [{
    nodeId: context.lifecycleNode.nodeId,
    fromStatus: 'UNRESOLVED_PRIOR_STATUS',
    toStatus: context.lifecycleNode.lifecycleStatus
  }];
}, { operationClass: 'LIFECYCLE_TRANSITION_PROPOSAL', requestedAction: 'PROPOSE_UNRESOLVED_LIFECYCLE_TRANSITION' });

const d01 = operation('TARGET_4C_D01_UNKNOWN_REPOSITORY_PATH', (input) => {
  input.requestedPaths = ['/unknown/target-4c/path.js'];
});
const d02Built = build('TARGET_4C_D02_KNOWN_PATH_WRONG_COMMIT');
const d02 = clone(d02Built.operationInput);
d02.assertedOccurrences = [{ ...exactOccurrence(d02Built.exactOccurrence), commitSha: WRONG_COMMIT }];
const d03Built = build('TARGET_4C_D03_KNOWN_PATH_WRONG_GIT_BLOB');
const d03 = clone(d03Built.operationInput);
d03.assertedOccurrences = [{ ...exactOccurrence(d03Built.exactOccurrence), gitBlobSha: WRONG_BLOB }];
const d04 = operation('TARGET_4C_D04_REQUIRED_EXACT_OCCURRENCE_MISSING', (input) => {
  input.requestedDispositionContext.requireExactOccurrenceForReadOnly = true;
  input.assertedOccurrences = [];
});
const d05 = operation('TARGET_4C_D05_MUTATION_WITHOUT_EXACT_OCCURRENCE', (input) => {
  input.requestedMutation = true;
  input.operationClass = 'BOUNDED_MUTATION_PROPOSAL';
  input.requestedAction = 'UPDATE_SOURCE_WITHOUT_EXACT_OCCURRENCE';
  input.assertedOccurrences = [];
});
const d06 = operation('TARGET_4C_D06_UNKNOWN_EVIDENCE_REFERENCE', (input) => {
  input.evidenceReferences = ['UNKNOWN_EVIDENCE_FOR_TARGET_4C'];
});

const a01 = operation('TARGET_4C_A01_REGISTRY_CONTRADICTING_INSTRUCTION', (input) => {
  input.requestedAction = 'INSTRUCTION_CONTRADICTS_REGISTRY';
});
const a02 = operation('TARGET_4C_A02_MISSING_CONTROLLING_INSTRUCTION', (input) => {
  input.instructionSources = ['UNRELATED_INSTRUCTION_v1'];
});
const a03 = operation('TARGET_4C_A03_ARRAY_POSITION_USED_AS_OPERATIONAL_ORDER', (input) => {
  input.requestedAction = 'INFER_OPERATIONAL_ORDER_FROM_ARRAY_POSITION';
});
const a04 = operation('TARGET_4C_A04_DIRECTORY_POSITION_USED_AS_AUTHORITY', (input) => {
  input.requestedAction = 'INFER_AUTHORITY_FROM_DIRECTORY_POSITION';
});
const a05 = operation('TARGET_4C_A05_EXPLICIT_STOPPING_BOUNDARY_BYPASS', (input) => {
  input.requestedAction = 'BYPASS_STOPPING_BOUNDARY';
});
const a06Built = build('TARGET_4C_A06_MUTATION_BEYOND_REGISTERED_AUTHORITY', {
  operationClass: 'BOUNDED_MUTATION_PROPOSAL',
  requestedAction: 'UPDATE_SOURCE_FILE',
  requestedMutation: true
});
const a06 = clone(a06Built.operationInput);
a06.assertedOccurrences = [exactOccurrence(a06Built.exactOccurrence)];
const a07 = operation('TARGET_4C_A07_UNRECOGNIZED_INPUT_FIELD_INJECTION', (input) => {
  input.unrecognizedInjectedField = 'REJECT_ME';
});
const a08 = operation('TARGET_4C_A08_DUPLICATE_SCOPE_ASSERTION_INJECTION', (input) => {
  input.declaredAffectedNodeIds.push(input.declaredAffectedNodeIds[0]);
});

export const H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES = deepFreeze([
  record({ fixtureId:'P01_COMPLETE_READ_ONLY_KERNEL_INSPECTION', fixtureClass:'POSITIVE', fixtureCategory:'READ_ONLY_COMPREHENSION', description:'Complete kernel inspection resolves exact package scope.', operationInput:p01, expectedDisposition:'PASS', criticalAssertions:['EXACT_SCOPE','FULL_CARDINAL_KERNEL','NO_MUTATION_AUTHORITY'] }),
  record({ fixtureId:'P02_COMPLETE_GATE_B_PACKAGE_DERIVATION', fixtureClass:'POSITIVE', fixtureCategory:'PACKAGE_DERIVATION', description:'Gate B path resolves its complete governed package derivation.', operationInput:p02, expectedDisposition:'PASS', criticalAssertions:['EXACT_SCOPE','GATE_B_PRESENT'] }),
  record({ fixtureId:'P03_EXACT_READ_ONLY_OCCURRENCE_RESOLUTION', fixtureClass:'POSITIVE', fixtureCategory:'OCCURRENCE', description:'Exact read-only occurrence resolves without drift.', operationInput:p03, expectedDisposition:'PASS', criticalAssertions:['EXACT_OCCURRENCE'] }),
  record({ fixtureId:'P04_COMPLETE_CARDINAL_KERNEL_PROJECTION', fixtureClass:'POSITIVE', fixtureCategory:'CARDINAL', description:'Explicit North East South West kernel roles remain separate.', operationInput:p04, expectedDisposition:'PASS', criticalAssertions:['FULL_CARDINAL_KERNEL'] }),
  record({ fixtureId:'P05_DETERMINISTIC_REPEAT_EXECUTION', fixtureClass:'POSITIVE', fixtureCategory:'DERIVATION_INTEGRITY', description:'Repeated execution emits byte-equivalent semantic receipts.', operationInput:p05, expectedDisposition:'PASS', criticalAssertions:['DETERMINISTIC'] }),
  record({ fixtureId:'P06_NONCRITICAL_EVIDENCE_LIMITATION', fixtureClass:'POSITIVE', fixtureCategory:'EVIDENCE', description:'Known noncritical evidence limitation requires review without authority escalation.', operationInput:p06, expectedDisposition:'REVIEW_REQUIRED', requiredFailureCodes:['OPTIONAL_EVIDENCE_LIMITATION'], criticalAssertions:['LIMITED_EVIDENCE_REVIEW'] }),

  record({ fixtureId:'N01_INCOMPLETE_AFFECTED_NODE_SET', fixtureClass:'NEGATIVE', fixtureCategory:'SCOPE', description:'Incomplete declared node closure is blocked.', operationInput:n01, expectedDisposition:'BLOCK', requiredFailureCodes:['DECLARED_AFFECTED_NODE_SET_INCOMPLETE'] }),
  record({ fixtureId:'N02_INCOMPLETE_AFFECTED_RELATION_SET', fixtureClass:'NEGATIVE', fixtureCategory:'SCOPE', description:'Incomplete declared relation closure is blocked.', operationInput:n02, expectedDisposition:'BLOCK', requiredFailureCodes:['DECLARED_AFFECTED_NODE_SET_INCOMPLETE'] }),
  record({ fixtureId:'N03_MISSING_DECLARED_COMPOSITE_UNIT', fixtureClass:'NEGATIVE', fixtureCategory:'COMPOSITE', description:'Missing affected composite unit is blocked.', operationInput:n03, expectedDisposition:'BLOCK', requiredFailureCodes:['REQUIRED_COMPOSITE_MEMBER_MISSING'] }),
  record({ fixtureId:'N04_UNKNOWN_DECLARED_NODE', fixtureClass:'NEGATIVE', fixtureCategory:'SCOPE', description:'Unknown declared node stops evaluation.', operationInput:n04, expectedDisposition:'STOP', requiredFailureCodes:['OPERATION_SCOPE_UNRESOLVED'] }),
  record({ fixtureId:'N05_UNKNOWN_DECLARED_RELATION', fixtureClass:'NEGATIVE', fixtureCategory:'SCOPE', description:'Unknown declared relation stops evaluation.', operationInput:n05, expectedDisposition:'STOP', requiredFailureCodes:['OPERATION_SCOPE_UNRESOLVED'] }),
  record({ fixtureId:'N06_EMPTY_OPERATION_SCOPE', fixtureClass:'NEGATIVE', fixtureCategory:'SCOPE', description:'Operation without path or node seed stops.', operationInput:n06, expectedDisposition:'STOP', requiredFailureCodes:['OPERATION_SCOPE_UNRESOLVED'], expectedAuthorityPreservation:false, expectedCardinalPreservation:false, expectedOccurrenceResult:'NOT_APPLICABLE' }),
  record({ fixtureId:'N07_CARDINAL_ROLE_COLLAPSE', fixtureClass:'NEGATIVE', fixtureCategory:'CARDINAL', description:'Conflicting explicit cardinal role is blocked.', operationInput:n07, expectedDisposition:'BLOCK', requiredFailureCodes:['CARDINAL_ROLE_COLLAPSE'] }),
  record({ fixtureId:'N08_GATE_B_CANDIDATE_ROLE_PROMOTION', fixtureClass:'NEGATIVE', fixtureCategory:'CARDINAL', description:'Observed Gate B candidate cardinality cannot be promoted.', operationInput:n08, expectedDisposition:'BLOCK', requiredFailureCodes:['CANDIDATE_CARDINAL_ROLE_PROMOTED'] }),
  record({ fixtureId:'N09_ADAPTER_PROMOTED_TO_ADMISSION_AUTHORITY', fixtureClass:'NEGATIVE', fixtureCategory:'AUTHORITY', description:'Orchestration-only adapter cannot become admission authority.', operationInput:n09, expectedDisposition:'BLOCK', requiredFailureCodes:['ORCHESTRATION_PROMOTED_TO_ADMISSION_AUTHORITY'] }),
  record({ fixtureId:'N10_FACADE_PROMOTED_TO_MEMBER_AUTHORITY', fixtureClass:'NEGATIVE', fixtureCategory:'AUTHORITY', description:'Facade cannot absorb member authority.', operationInput:n10, expectedDisposition:'BLOCK', requiredFailureCodes:['FACADE_PROMOTED_TO_MEMBER_AUTHORITY'] }),
  record({ fixtureId:'N11_GENERIC_AUTHORITY_TRANSFER', fixtureClass:'NEGATIVE', fixtureCategory:'AUTHORITY', description:'Unestablished authority transfer is blocked.', operationInput:n11, expectedDisposition:'BLOCK', requiredFailureCodes:['AUTHORITY_COLLAPSE_OR_TRANSFER'] }),
  record({ fixtureId:'N12_CANDIDATE_PROMOTED_TO_CANONICAL', fixtureClass:'NEGATIVE', fixtureCategory:'LIFECYCLE', description:'Candidate lifecycle cannot be promoted to canonical.', operationInput:n12, expectedDisposition:'BLOCK', requiredFailureCodes:['CANDIDATE_PROMOTED_TO_CANONICAL'] }),
  record({ fixtureId:'N13_UNRESOLVED_LIFECYCLE_TRANSITION', fixtureClass:'NEGATIVE', fixtureCategory:'LIFECYCLE', description:'Unresolved lifecycle transition requires review.', operationInput:n13, expectedDisposition:'REVIEW_REQUIRED', requiredFailureCodes:['LIFECYCLE_TRANSITION_UNRESOLVED'] }),

  record({ fixtureId:'D01_UNKNOWN_REPOSITORY_PATH', fixtureClass:'DRIFT', fixtureCategory:'OCCURRENCE', description:'Unknown repository path stops evaluation.', operationInput:d01, expectedDisposition:'STOP', requiredFailureCodes:['REQUESTED_PATH_UNRESOLVED'], expectedOccurrenceResult:'UNRESOLVED' }),
  record({ fixtureId:'D02_KNOWN_PATH_WRONG_COMMIT', fixtureClass:'DRIFT', fixtureCategory:'OCCURRENCE', description:'Known path with wrong commit is blocked as occurrence drift.', operationInput:d02, expectedDisposition:'BLOCK', requiredFailureCodes:['OCCURRENCE_IDENTITY_DRIFT'], expectedOccurrenceResult:'DRIFT' }),
  record({ fixtureId:'D03_KNOWN_PATH_WRONG_GIT_BLOB', fixtureClass:'DRIFT', fixtureCategory:'OCCURRENCE', description:'Known path with wrong Git blob is blocked as occurrence drift.', operationInput:d03, expectedDisposition:'BLOCK', requiredFailureCodes:['OCCURRENCE_IDENTITY_DRIFT'], expectedOccurrenceResult:'DRIFT' }),
  record({ fixtureId:'D04_REQUIRED_EXACT_OCCURRENCE_MISSING', fixtureClass:'DRIFT', fixtureCategory:'OCCURRENCE', description:'Required exact read-only occurrence absence stops evaluation.', operationInput:d04, expectedDisposition:'STOP', requiredFailureCodes:['EXACT_OCCURRENCE_UNRESOLVED'], expectedOccurrenceResult:'UNRESOLVED' }),
  record({ fixtureId:'D05_MUTATION_WITHOUT_EXACT_OCCURRENCE', fixtureClass:'DRIFT', fixtureCategory:'OCCURRENCE', description:'Mutation without exact occurrence stops before mutation.', operationInput:d05, expectedDisposition:'STOP', requiredFailureCodes:['EXACT_OCCURRENCE_UNRESOLVED','MUTATION_AUTHORITY_NOT_ESTABLISHED'], expectedOccurrenceResult:'UNRESOLVED', criticalAssertions:['MUTATION_BLOCKED'] }),
  record({ fixtureId:'D06_UNKNOWN_EVIDENCE_REFERENCE', fixtureClass:'DRIFT', fixtureCategory:'EVIDENCE', description:'Unknown required evidence stops evaluation.', operationInput:d06, expectedDisposition:'STOP', requiredFailureCodes:['REQUIRED_EVIDENCE_UNRESOLVED'] }),

  record({ fixtureId:'A01_REGISTRY_CONTRADICTING_INSTRUCTION', fixtureClass:'ADVERSARIAL', fixtureCategory:'INSTRUCTION_CONFLICT', description:'Instruction contradicting registry is blocked.', operationInput:a01, expectedDisposition:'BLOCK', requiredFailureCodes:['INSTRUCTION_CONTRADICTS_REGISTRY'] }),
  record({ fixtureId:'A02_MISSING_CONTROLLING_INSTRUCTION', fixtureClass:'ADVERSARIAL', fixtureCategory:'INSTRUCTION_CONFLICT', description:'Unrelated instruction identity stops evaluation.', operationInput:a02, expectedDisposition:'STOP', requiredFailureCodes:['INSTRUCTION_IDENTITY_MISMATCH'] }),
  record({ fixtureId:'A03_ARRAY_POSITION_USED_AS_OPERATIONAL_ORDER', fixtureClass:'ADVERSARIAL', fixtureCategory:'DERIVATION_INTEGRITY', description:'Array position cannot establish operational order.', operationInput:a03, expectedDisposition:'BLOCK', requiredFailureCodes:['ORDER_INFERRED_FROM_ARRAY_POSITION'] }),
  record({ fixtureId:'A04_DIRECTORY_POSITION_USED_AS_AUTHORITY', fixtureClass:'ADVERSARIAL', fixtureCategory:'DERIVATION_INTEGRITY', description:'Directory position cannot establish authority.', operationInput:a04, expectedDisposition:'BLOCK', requiredFailureCodes:['ORDER_INFERRED_FROM_ARRAY_POSITION'] }),
  record({ fixtureId:'A05_EXPLICIT_STOPPING_BOUNDARY_BYPASS', fixtureClass:'ADVERSARIAL', fixtureCategory:'STOPPING_BOUNDARY', description:'Explicit stopping-boundary bypass is blocked.', operationInput:a05, expectedDisposition:'BLOCK', requiredFailureCodes:['STOPPING_BOUNDARY_BYPASSED'] }),
  record({ fixtureId:'A06_MUTATION_BEYOND_REGISTERED_AUTHORITY', fixtureClass:'ADVERSARIAL', fixtureCategory:'MUTATION', description:'Mutation beyond registered authority is blocked.', operationInput:a06, expectedDisposition:'BLOCK', requiredFailureCodes:['MUTATION_AUTHORITY_NOT_ESTABLISHED','MUTATION_SCOPE_EXCEEDS_AUTHORITY'], criticalAssertions:['MUTATION_BLOCKED'] }),
  record({ fixtureId:'A07_UNRECOGNIZED_INPUT_FIELD_INJECTION', fixtureClass:'ADVERSARIAL', fixtureCategory:'INPUT_INTEGRITY', description:'Unknown input field injection stops before derivation.', operationInput:a07, expectedDisposition:'STOP', requiredFailureCodes:['OPERATION_SCOPE_UNRESOLVED'], expectedAuthorityPreservation:false, expectedCardinalPreservation:false, expectedOccurrenceResult:'NOT_APPLICABLE' }),
  record({ fixtureId:'A08_DUPLICATE_SCOPE_ASSERTION_INJECTION', fixtureClass:'ADVERSARIAL', fixtureCategory:'INPUT_INTEGRITY', description:'Duplicate scope assertion stops before derivation.', operationInput:a08, expectedDisposition:'STOP', requiredFailureCodes:['OPERATION_SCOPE_UNRESOLVED'], expectedAuthorityPreservation:false, expectedCardinalPreservation:false, expectedOccurrenceResult:'NOT_APPLICABLE' })
].sort((a, b) => a.fixtureId.localeCompare(b.fixtureId)));

export const H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_COUNTS = deepFreeze({
  total: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.length,
  positive: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.filter((fixture) => fixture.fixtureClass === 'POSITIVE').length,
  negative: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.filter((fixture) => fixture.fixtureClass === 'NEGATIVE').length,
  drift: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.filter((fixture) => fixture.fixtureClass === 'DRIFT').length,
  adversarial: H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES.filter((fixture) => fixture.fixtureClass === 'ADVERSARIAL').length
});

export const H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_BOUNDARY = deepFreeze({
  positiveFixturesDefined: true,
  negativeFixturesDefined: true,
  driftFixturesDefined: true,
  adversarialFixturesDefined: true,
  expectedResultsLockedSeparately: false,
  fixtureSuiteExecuted: false,
  engineSemanticsChanged: false,
  workflowEnforcementInstalled: false,
  stoppingCondition: {
    allFixtureClassesDefined: true,
    advanceBeyondTarget4C8: false,
    nextAuthorizedSubtarget: '4C-9'
  }
});

export default H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURES;
