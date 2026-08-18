/**
 * H_EARTH_REPOSITORY_REGISTRY_POST_MERGE_DISPOSITION_SCOPE_RECONCILIATION_v3
 *
 * Composed bounded read-only overlay for:
 * 1. the closed post-merge 42-file scope-disposition package;
 * 2. the exact Step 2 decision-accountability package; and
 * 3. the Merge Readiness B retained-state continuity-audit renewal.
 *
 * This overlay creates no bootstrap replacement, canonicalization execution,
 * successor activation, transition execution, deployment, or production authority.
 */
import baseFacade from './h-earth.repository-registry.step-1-scope-reconciliation.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const DISPOSITION_BRANCH = 'agent/h-earth-post-merge-scope-disposition-001';
const STEP_2_BRANCH = 'agent/h-earth-step-2-decision-accountability-001';

const DISPOSITION_PATHS = Object.freeze([
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-delta.ledger.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-scope-disposition.table.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action-plan.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action.receipt.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-retained-state.identity-manifest.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.successor-registry-evidence-lane.reclassification.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.post-merge-disposition-scope-reconciliation.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const STEP_2_PATHS = Object.freeze([
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.current-state.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.successor-target.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.authorized-changeset.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.fixtures.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.validator.mjs',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.audit-receipt.json'
]);

const MERGE_READINESS_B_PATHS = Object.freeze([
  '/tools/h-earth-post-merge-scope-disposition-audit.mjs'
]);

function buildOccurrences(paths, refName) {
  return Object.freeze(paths.map((repositoryPath) => deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'NOT_PERFORMED',
    occurrenceClass: 'CANDIDATE'
  })));
}

const dispositionOccurrences = buildOccurrences(DISPOSITION_PATHS, DISPOSITION_BRANCH);
const step2Occurrences = buildOccurrences(STEP_2_PATHS, STEP_2_BRANCH);
const mergeReadinessBOccurrences = buildOccurrences(MERGE_READINESS_B_PATHS, STEP_2_BRANCH);

export const H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_POST_MERGE_42_FILE_SCOPE_DISPOSITION_PACKAGE',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/post-merge-disposition/',
  sourceOccurrenceOrRevision:
    'SOURCE_MERGE=ee7324734bb687e71ebb3ee93ff23e6353feb5fe;STABILIZATION_MERGE=08cf54db77dc48e23de8874953561bc2964551ba',
  assertionScope: [
    'EXACT_DISPOSITION_PACKAGE_PATH_RESOLUTION',
    'READ_ONLY_PREFLIGHT_SCOPE'
  ],
  verifiedOn: '2026-07-24',
  evidenceLimitations: [
    'NO_SUCCESSOR_ACCEPTANCE_OR_ACTIVATION',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_TRANSITION_EXECUTION'
  ]
});

export const H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_REGISTRATION',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/step-2/',
  sourceOccurrenceOrRevision:
    'BASE_MAIN=08cf54db77dc48e23de8874953561bc2964551ba;USER_INSTRUCTION=COMPLETE_MERGE_READINESS_A',
  assertionScope: [
    'EXACT_STEP_2_PACKAGE_PATH_RESOLUTION',
    'AUTOMATIC_READ_ONLY_PREFLIGHT_CORRESPONDENCE'
  ],
  verifiedOn: '2026-07-24',
  evidenceLimitations: [
    'READ_ONLY_PATH_REGISTRATION_ONLY',
    'NO_STEP_3_EXECUTOR',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_SUCCESSOR_ACTIVATION',
    'NO_TRANSITION_EXECUTION',
    'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
  ]
});

export const H_EARTH_MERGE_READINESS_B_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_MERGE_READINESS_B_AUDIT_CONTINUITY_RENEWAL',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/tools/h-earth-post-merge-scope-disposition-audit.mjs',
  sourceOccurrenceOrRevision:
    'USER_INSTRUCTION=COMPLETE_MERGE_READINESS_B;OBSOLETE_MAIN_EQUALITY_ASSERTION=RETIRED',
  assertionScope: [
    'RETAINED_STATE_CONTINUITY_AUDIT_PATH_RESOLUTION',
    'MAIN_DESCENDS_FROM_STABILIZATION_MERGE'
  ],
  verifiedOn: '2026-07-24',
  evidenceLimitations: [
    'AUDIT_CONTINUITY_RENEWAL_ONLY',
    'NO_REPOSITORY_MUTATION_AUTHORITY',
    'NO_STEP_3_EXECUTOR',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_SUCCESSOR_ACTIVATION',
    'NO_TRANSITION_EXECUTION'
  ]
});

export const H_EARTH_POST_MERGE_DISPOSITION_SCOPE_NODE = deepFreeze({
  nodeId: 'H_EARTH_POST_MERGE_42_FILE_SCOPE_DISPOSITION_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'POST_MERGE_REPOSITORY_STABILIZATION_PACKAGE',
  displayName: 'H-Earth Post-Merge 42-File Scope Disposition Package',
  description:
    'Bounded repository-stabilization evidence and audit package for the 42-file PR 79 merge delta.',
  repositoryPaths: [...DISPOSITION_PATHS],
  repositoryOccurrences: dispositionOccurrences,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: [H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE.evidenceId],
  authorityClass: 'AUDIT_ONLY',
  authorityPosture:
    'POST_MERGE_SCOPE_DISPOSITION_AND_REPOSITORY_STABILIZATION_AUDIT_ONLY',
  authoritySource: ['EXPLICIT_USER_INSTRUCTION'],
  authorityScope: [
    'EXACT_DISPOSITION_PACKAGE_PATH_RESOLUTION',
    'READ_ONLY_PREFLIGHT_SCOPE'
  ],
  authorityLimitations: [
    'NO_SUCCESSOR_ACCEPTANCE_OR_ACTIVATION',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_TRANSITION_EXECUTION'
  ],
  parentRelations: [],
  childRelations: [],
  peerRelations: [],
  upstreamBoundaries: [],
  downstreamBoundaries: [],
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: [],
  dependencyRelations: [],
  allowedMutationScope: 'READ_ONLY_INSPECTION',
  prohibitedMutations: [
    'BOOTSTRAP_REPLACEMENT',
    'CANONICALIZATION_EXECUTION',
    'SUCCESSOR_ACTIVATION',
    'TRANSITION_EXECUTION'
  ],
  requiredValidations: [
    'EXACT_PATH_RESOLUTION',
    'DISPOSITION_TABLE_COMPLETENESS',
    'RETAINED_STATE_AUDIT'
  ],
  stoppingBoundaries: [
    'STOP_BEFORE_BOOTSTRAP_REPLACEMENT',
    'STOP_BEFORE_SUCCESSOR_ACTIVATION',
    'STOP_BEFORE_TRANSITION_EXECUTION'
  ],
  currentIdentityReferences: [
    'H_EARTH_PR79_POST_MERGE_42_FILE_SCOPE_DISPOSITION_TABLE_v1',
    '08cf54db77dc48e23de8874953561bc2964551ba'
  ],
  lifecycleStatus: 'ACCEPTED',
  unresolvedFields: []
});

export const H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_NODE = deepFreeze({
  nodeId: 'H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'TRANSITION_DECISION_ACCOUNTABILITY_PACKAGE',
  displayName: 'H-Earth Step 2 Decision Accountability Package',
  description:
    'Exact seven-file Step 2 control-plane package registered for automatic read-only preflight resolution.',
  repositoryPaths: [...STEP_2_PATHS],
  repositoryOccurrences: step2Occurrences,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: [H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_EVIDENCE.evidenceId],
  authorityClass: 'DECISION_AUTHORITY',
  authorityPosture: 'ONE_TIME_TRANSITION_DECISION_ONLY_NO_EXECUTION',
  authoritySource: [
    'EXPLICIT_USER_INSTRUCTION',
    'H_EARTH_STEP_2_TRANSITION_DECISION_2026_07_24_001'
  ],
  authorityScope: [
    'READ_ONLY_PREFLIGHT_PATH_RESOLUTION',
    'SELECT_EXACT_SUCCESSOR',
    'DEFINE_EXACT_AUTHORIZED_CHANGESET',
    'BIND_APPROVER_ISSUER_EXECUTOR_AND_AUDITOR',
    'DEFINE_EXPIRATION_REVOCATION_AND_REPLAY_PROTECTION',
    'ISSUE_DETERMINISTIC_TRANSITION_DECISION_RECEIPT'
  ],
  authorityLimitations: [
    'PATH_REGISTRATION_DOES_NOT_EXECUTE_DECISION',
    'NO_STEP_3_EXECUTOR_CREATED',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_SUCCESSOR_ACTIVATION',
    'NO_TRANSITION_EXECUTION',
    'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
  ],
  parentRelations: [],
  childRelations: [],
  peerRelations: [],
  upstreamBoundaries: [],
  downstreamBoundaries: [],
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: [
    'CURRENT_STATE_THEN_SUCCESSOR_THEN_CHANGESET_THEN_DECISION_THEN_VALIDATION'
  ],
  dependencyRelations: [],
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: [
    'BOOTSTRAP_REPLACEMENT',
    'CANONICALIZATION_EXECUTION',
    'SUCCESSOR_ACTIVATION',
    'TRANSITION_EXECUTION',
    'DEPLOYMENT',
    'PRODUCTION_ACTIVATION'
  ],
  requiredValidations: [
    'EXACT_PATH_RESOLUTION',
    'CURRENT_STATE_IDENTITY',
    'SUCCESSOR_IDENTITY_AND_DIGEST',
    'AUTHORIZED_PATH_AND_CHANGESET_DIGEST',
    'ACTOR_BINDINGS',
    'EXPIRATION_REVOCATION_AND_REPLAY_PROTECTION',
    'POSITIVE_AND_NEGATIVE_FIXTURE_EXECUTION',
    'DETERMINISTIC_DECISION_RECEIPT'
  ],
  stoppingBoundaries: [
    'STOP_BEFORE_STEP_3_EXECUTION',
    'STOP_ON_PARENT_DRIFT',
    'STOP_ON_SUCCESSOR_IDENTITY_DRIFT',
    'STOP_ON_CHANGESET_DRIFT',
    'STOP_ON_EXPIRED_REVOKED_OR_CONSUMED_DECISION'
  ],
  currentIdentityReferences: [
    '08cf54db77dc48e23de8874953561bc2964551ba',
    'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2',
    'H_EARTH_STEP_2_TRANSITION_DECISION_2026_07_24_001'
  ],
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: []
});

export const H_EARTH_MERGE_READINESS_B_SCOPE_NODE = deepFreeze({
  nodeId: 'H_EARTH_POST_MERGE_RETAINED_STATE_CONTINUITY_AUDIT_RENEWAL',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'MERGE_READINESS_AUDIT_CORRESPONDENCE',
  displayName: 'H-Earth Merge Readiness B Audit Continuity Renewal',
  description:
    'Renews the closed stabilization audit from a historical main-equality assertion to a durable stabilization-merge ancestry assertion.',
  repositoryPaths: [...MERGE_READINESS_B_PATHS],
  repositoryOccurrences: mergeReadinessBOccurrences,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: [H_EARTH_MERGE_READINESS_B_SCOPE_EVIDENCE.evidenceId],
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'RETAINED_STATE_CONTINUITY_ASSERTION_ONLY',
  authoritySource: ['EXPLICIT_USER_INSTRUCTION'],
  authorityScope: [
    'RETIRE_OBSOLETE_MAIN_EQUALITY_ASSERTION',
    'VERIFY_MAIN_CONTAINS_STABILIZATION_MERGE',
    'READ_ONLY_PREFLIGHT_PATH_RESOLUTION'
  ],
  authorityLimitations: [
    'NO_REPOSITORY_MUTATION_AUTHORITY',
    'NO_STEP_3_EXECUTOR_CREATED',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_SUCCESSOR_ACTIVATION',
    'NO_TRANSITION_EXECUTION'
  ],
  parentRelations: [],
  childRelations: [],
  peerRelations: [],
  upstreamBoundaries: [],
  downstreamBoundaries: [],
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: [],
  dependencyRelations: [],
  allowedMutationScope: 'AUDIT_ASSERTION_RENEWAL_ONLY',
  prohibitedMutations: [
    'BOOTSTRAP_REPLACEMENT',
    'CANONICALIZATION_EXECUTION',
    'SUCCESSOR_ACTIVATION',
    'TRANSITION_EXECUTION'
  ],
  requiredValidations: [
    'AUDIT_PATH_RESOLUTION',
    'STABILIZATION_MERGE_ANCESTRY',
    'OBSOLETE_MAIN_EQUALITY_ASSERTION_ABSENT'
  ],
  stoppingBoundaries: [
    'STOP_BEFORE_STEP_3_EXECUTION',
    'STOP_BEFORE_REPOSITORY_MUTATION'
  ],
  currentIdentityReferences: [
    '08cf54db77dc48e23de8874953561bc2964551ba',
    'H_EARTH_PR79_POST_MERGE_SCOPE_DISPOSITION_RETAINED_STATE_AUDIT_RECEIPT_v2'
  ],
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: []
});

const NODES = Object.freeze([
  H_EARTH_POST_MERGE_DISPOSITION_SCOPE_NODE,
  H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_NODE,
  H_EARTH_MERGE_READINESS_B_SCOPE_NODE
]);
const EVIDENCE = Object.freeze([
  H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE,
  H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_EVIDENCE,
  H_EARTH_MERGE_READINESS_B_SCOPE_EVIDENCE
]);
const ALL_OCCURRENCES = Object.freeze([
  ...dispositionOccurrences,
  ...step2Occurrences,
  ...mergeReadinessBOccurrences
]);
const pathIndex = new Map([
  ...DISPOSITION_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_POST_MERGE_DISPOSITION_SCOPE_NODE,
      occurrences: dispositionOccurrences.filter((entry) => entry.path === repositoryPath)
    }
  ]),
  ...STEP_2_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_STEP_2_MERGE_READINESS_A_SCOPE_NODE,
      occurrences: step2Occurrences.filter((entry) => entry.path === repositoryPath)
    }
  ]),
  ...MERGE_READINESS_B_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_MERGE_READINESS_B_SCOPE_NODE,
      occurrences: mergeReadinessBOccurrences.filter((entry) => entry.path === repositoryPath)
    }
  ])
]);
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, ...EVIDENCE],
  nodes: [...baseInstance.nodes, ...NODES]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return NODES.find((node) => node.nodeId === nodeId) ??
    baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return EVIDENCE.find((entry) => entry.evidenceId === evidenceId) ??
    baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  return deepFreeze({
    repositoryPath,
    resolved: true,
    nodes: [indexed.node],
    occurrences: indexed.occurrences,
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const localMatches = ALL_OCCURRENCES
    .filter((entry) => {
      if (input.path != null && entry.path !== input.path) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      return true;
    })
    .map((occurrence) => {
      const node = pathIndex.get(occurrence.path)?.node;
      return deepFreeze({ nodeId: node.nodeId, node, occurrence });
    });
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return deepFreeze({
    query: base.query,
    matches: [...base.matches, ...localMatches],
    resolved: base.resolved || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const local = NODES.filter((node) => {
    if (
      criteria.repositoryPath != null &&
      !node.repositoryPaths.includes(criteria.repositoryPath)
    ) return false;
    if (criteria.nodeType != null && criteria.nodeType !== node.nodeType) return false;
    if (
      criteria.nodeSubtype != null &&
      criteria.nodeSubtype !== node.nodeSubtype
    ) return false;
    if (
      criteria.authorityClass != null &&
      criteria.authorityClass !== node.authorityClass
    ) return false;
    if (
      criteria.lifecycleStatus != null &&
      criteria.lifecycleStatus !== node.lifecycleStatus
    ) return false;
    return true;
  });
  return deepFreeze([...base, ...local]);
}

export function getHEarthRepositoryRegistryRelationsForNode(
  nodeId,
  direction = 'BOTH'
) {
  return NODES.some((node) => node.nodeId === nodeId)
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  const node = NODES.find((entry) => entry.nodeId === nodeId);
  return node
    ? deepFreeze({ nodeId, nodes: [node], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_POST_MERGE_AND_STEP_2_RECONCILED_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_POST_MERGE_AND_STEP_2_RECONCILED_FACADE;
