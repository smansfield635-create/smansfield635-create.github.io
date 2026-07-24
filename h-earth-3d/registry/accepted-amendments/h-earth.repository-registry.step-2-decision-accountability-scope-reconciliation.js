/**
 * H_EARTH_REPOSITORY_REGISTRY_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_RECONCILIATION_v1
 *
 * Bounded registry overlay admitting the Step 2 decision-accountability package.
 * It resolves the package for construction and audit. It creates no executor and
 * performs no bootstrap replacement, canonicalization, activation, deployment,
 * production operation, or transition execution.
 */
import baseFacade from './h-earth.repository-registry.post-merge-disposition-scope-reconciliation.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-step-2-decision-accountability-001';
const BASE_COMMIT = '08cf54db77dc48e23de8874953561bc2964551ba';
const PATHS = Object.freeze([
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.current-state.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.successor-target.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.authorized-changeset.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.fixtures.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.validator.mjs',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.audit-receipt.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.step-2-decision-accountability-scope-reconciliation.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const occurrences = PATHS.map((repositoryPath) => deepFreeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath.endsWith('audit-receipt.json') ? 'UNRESOLVED' : 'PRESENT',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
}));

export const H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_PACKAGE',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/step-2/',
  sourceOccurrenceOrRevision: `BASE_MAIN=${BASE_COMMIT};USER_INSTRUCTION=PROCEED_WITH_CHECKPOINTS_2_1_THROUGH_2_5_AS_ONE_BOUNDED_MOTION`,
  assertionScope: [
    'STEP_2_CURRENT_STATE_LOCK',
    'EXACT_SUCCESSOR_SELECTION',
    'EXACT_CHANGESET_DECISION',
    'ACTOR_APPROVAL_EXPIRATION_REVOCATION_AND_REPLAY_BINDING',
    'DETERMINISTIC_DECISION_VALIDATION'
  ],
  verifiedOn: '2026-07-24',
  evidenceLimitations: [
    'NO_STEP_3_EXECUTOR',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION_EXECUTION',
    'NO_SUCCESSOR_ACTIVATION',
    'NO_TRANSITION_EXECUTION',
    'NO_DEPLOYMENT_OR_PRODUCTION_AUTHORITY'
  ]
});

export const H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_NODE = deepFreeze({
  nodeId: 'H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'TRANSITION_DECISION_ACCOUNTABILITY_PACKAGE',
  displayName: 'H-Earth Step 2 Decision Accountability Package',
  description: 'Bounded package specifying one exact successor switch, accountable actors, one-use authorization, and deterministic validation without executing the switch.',
  repositoryPaths: [...PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: [H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_EVIDENCE.evidenceId],
  authorityClass: 'DECISION_AUTHORITY',
  authorityPosture: 'ONE_TIME_TRANSITION_DECISION_ONLY_NO_EXECUTION',
  authoritySource: ['EXPLICIT_CURRENT_USER_INSTRUCTION', 'H_EARTH_STEP_2_TRANSITION_DECISION_2026_07_24_001'],
  authorityScope: [
    'SELECT_EXACT_SUCCESSOR',
    'DEFINE_EXACT_AUTHORIZED_CHANGESET',
    'BIND_APPROVER_ISSUER_EXECUTOR_AND_AUDITOR',
    'DEFINE_EXPIRATION_REVOCATION_AND_REPLAY_PROTECTION',
    'ISSUE_DETERMINISTIC_TRANSITION_DECISION_RECEIPT'
  ],
  authorityLimitations: [
    'DECISION_DOES_NOT_EXECUTE_ITSELF',
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
  orderingRules: ['CURRENT_STATE_THEN_SUCCESSOR_THEN_CHANGESET_THEN_DECISION_THEN_VALIDATION'],
  dependencyRelations: [],
  allowedMutationScope: 'STEP_2_DECISION_ACCOUNTABILITY_PACKAGE_CONSTRUCTION_ONLY',
  prohibitedMutations: [
    'BOOTSTRAP_REPLACEMENT',
    'CANONICALIZATION_EXECUTION',
    'SUCCESSOR_ACTIVATION',
    'TRANSITION_EXECUTION',
    'DEPLOYMENT',
    'PRODUCTION_ACTIVATION'
  ],
  requiredValidations: [
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
    BASE_COMMIT,
    'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2',
    'H_EARTH_STEP_2_TRANSITION_DECISION_2026_07_24_001'
  ],
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: []
});

const NODE = H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_NODE;
const EVIDENCE = H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_SCOPE_EVIDENCE;
const pathSet = new Set(PATHS);
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, EVIDENCE],
  nodes: [...baseInstance.nodes, NODE]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) { return nodeId === NODE.nodeId ? NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId); }
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return evidenceId === EVIDENCE.evidenceId ? EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  if (!pathSet.has(repositoryPath)) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  return deepFreeze({ repositoryPath, resolved: true, nodes: [NODE], occurrences: occurrences.filter((entry) => entry.path === repositoryPath), unresolved: false });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const matches = occurrences.filter((entry) => {
    if (input.path != null && entry.path !== input.path) return false;
    if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
    if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
    if (input.refName != null && entry.refName !== input.refName) return false;
    return true;
  }).map((occurrence) => deepFreeze({ nodeId: NODE.nodeId, node: NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return deepFreeze({ query: base.query, matches: [...base.matches, ...matches], resolved: base.resolved || matches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const pathMatch = criteria.repositoryPath == null || NODE.repositoryPaths.includes(criteria.repositoryPath);
  const typeMatch = criteria.nodeType == null || criteria.nodeType === NODE.nodeType;
  const subtypeMatch = criteria.nodeSubtype == null || criteria.nodeSubtype === NODE.nodeSubtype;
  const authorityMatch = criteria.authorityClass == null || criteria.authorityClass === NODE.authorityClass;
  const lifecycleMatch = criteria.lifecycleStatus == null || criteria.lifecycleStatus === NODE.lifecycleStatus;
  return deepFreeze(pathMatch && typeMatch && subtypeMatch && authorityMatch && lifecycleMatch ? [...base, NODE] : [...base]);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE.nodeId
    ? deepFreeze({ nodeId, nodes: [NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_RECONCILED_FACADE = deepFreeze({
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

export default H_EARTH_STEP_2_DECISION_ACCOUNTABILITY_RECONCILED_FACADE;
