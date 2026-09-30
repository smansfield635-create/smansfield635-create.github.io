/**
 * H_EARTH_REPOSITORY_REGISTRY_STEP_1_SCOPE_RECONCILIATION_v1
 *
 * Bounded read-only registry overlay for the accepted Step 1 lifecycle-control-plane
 * candidate. This overlay resolves exact package paths for repository admission and
 * preflight only. It creates no successor activation, canonicalization, source
 * mutation, transition execution, bootstrap replacement, or Step 2 authority.
 */
import baseFacade from '../h-earth.repository-registry.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const ACCEPTED_PACKAGE_COMMIT = 'dcce390d2e8e432e3cfe8b23d0a3c71e67996970';
const BRANCH = 'agent/h-earth-lifecycle-control-plane-step-1-001';
const SELF_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.step-1-scope-reconciliation.js';

const VERIFIED_OCCURRENCES = Object.freeze([
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.acceptance-custody-receipt.json', '5538eb929f2ff50943568cdf856f19b051e2961a'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.completion-receipt.json', '0b682b5445b3fa5c2eb7f8019294964608551596'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.execution-trigger.json', '5594f2bfb44fd037c1079db2201815b01ecce22e'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.identity-and-boundary.json', 'fb984ce1e7b34dc05dad89ec50fd142030b4573a'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.user-acceptance-declaration.json', 'af7acc0e8c57faaf2f95cbc9c35f9c6fcc24169e'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.fixtures.json', '9e1018f58d75b4b4d026f3c68aa61bbe67ba7ff1'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.postcondition-schema.json', '56d7be6cc7922162002b5a0e8e761b0e98d7e250'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.precondition-schema.json', '754cfb7335f4515ec53a89aa91d39c141fe391d8'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-machine.js', 'f954ec84c9758122908d3e579c4bc3f5301a1560'],
  ['/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-schema.json', '2f8cb2b31538525e69b6d3e263cea457af9820f6'],
  ['/h-earth-3d/control-plane/step-1/h-earth.successor-activation.transition-contract.json', '12e7e4359cb14ad8184d21609376bbc37ff6b9a6'],
  ['/.github/workflows/h-earth-lifecycle-control-plane-step-1-audit.yml', '2f8933b25113da2dc3978e08f3057e79eaf24f55'],
  ['/tools/h-earth-lifecycle-control-plane-step-1-audit.mjs', '153b6d0401495bfee9e2aab0e239ae79032dcdba']
]);

const verifiedRepositoryOccurrences = VERIFIED_OCCURRENCES.map(([path, gitBlobSha]) => ({
  repository: REPOSITORY,
  refType: 'COMMIT',
  refName: ACCEPTED_PACKAGE_COMMIT,
  commitSha: ACCEPTED_PACKAGE_COMMIT,
  path,
  gitBlobSha,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED',
  occurrenceClass: 'ACCEPTED'
}));

const selfOccurrence = {
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: SELF_PATH,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'UNRESOLVED',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
};

export const H_EARTH_REPOSITORY_REGISTRY_STEP_1_SCOPE_RECONCILIATION_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_STEP_1_ACCEPTED_PACKAGE_SCOPE_RECONCILIATION',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/step-1/',
  sourceOccurrenceOrRevision: 'ACCEPTANCE_DECLARATION_COMMIT=73df413b40f0397d2771d08321be2848cab2232c;ACCEPTANCE_CUSTODY_COMMIT=dcce390d2e8e432e3cfe8b23d0a3c71e67996970;AUDIT=82_OF_82;FIXTURES=19_OF_19',
  assertionScope: [
    'STEP_1_PACKAGE_PATH_IDENTITY',
    'USER_ACCEPTANCE_CUSTODY',
    'REPOSITORY_SCOPE_RECONCILIATION_ONLY'
  ],
  verifiedOn: '2026-07-23',
  evidenceLimitations: [
    'NO_SUCCESSOR_REGISTRY_ACTIVATION',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION',
    'NO_TRANSITION_EXECUTION_OR_STEP_2_AUTHORITY'
  ]
});

export const H_EARTH_REPOSITORY_REGISTRY_STEP_1_SCOPE_RECONCILIATION_NODE = deepFreeze({
  nodeId: 'H_EARTH_LIFECYCLE_CONTROL_PLANE_STEP_1_ACCEPTED_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'LIFECYCLE_CONTROL_PLANE_TRANSITION_CONTRACT_PACKAGE',
  displayName: 'H-Earth Lifecycle Control Plane Step 1 Accepted Package',
  description: 'Accepted, verified, nonactive Step 1 lifecycle-transition contract package admitted to bounded repository scope without successor activation or canonicalization.',
  repositoryPaths: [...VERIFIED_OCCURRENCES.map(([path]) => path), SELF_PATH],
  repositoryOccurrences: [...verifiedRepositoryOccurrences, selfOccurrence],
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: ['EVIDENCE_STEP_1_ACCEPTED_PACKAGE_SCOPE_RECONCILIATION'],
  authorityClass: 'NO_AUTHORITY',
  authorityPosture: 'REPOSITORY_SCOPE_RESOLUTION_AND_ADMISSION_RECORD_ONLY',
  authoritySource: [
    'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_SUCCESSOR_ACTIVATION_TRANSITION_CONTRACT_CANDIDATE_v1',
    'USER_ACCEPTANCE_DECLARATION_AND_CUSTODY_RECEIPT'
  ],
  authorityScope: [
    'EXACT_STEP_1_PACKAGE_PATH_RESOLUTION',
    'READ_ONLY_PREFLIGHT_SCOPE_PROJECTION',
    'REPOSITORY_ADMISSION_BOUNDARY'
  ],
  authorityLimitations: [
    'NO_SUCCESSOR_ACTIVATION',
    'NO_CANONICALIZATION',
    'NO_SOURCE_MUTATION_AUTHORITY',
    'NO_TRANSITION_EXECUTION_AUTHORITY',
    'NO_STEP_2_IMPLEMENTATION_AUTHORITY'
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
    'AUTHORITY_TRANSFER_OR_COLLAPSE',
    'BOOTSTRAP_REPLACEMENT',
    'CANONICALIZATION',
    'SOURCE_BEHAVIOR_CHANGE',
    'SUCCESSOR_ACTIVATION',
    'TRANSITION_EXECUTION',
    'STEP_2_IMPLEMENTATION'
  ],
  requiredValidations: [
    'EXACT_PATH_RESOLUTION',
    'EVIDENCE_REFERENCE_RESOLUTION',
    'REFERENTIAL_INTEGRITY',
    'STEP_1_82_OF_82_AUDIT',
    'STEP_1_19_OF_19_FIXTURES'
  ],
  stoppingBoundaries: [
    'STOP_BEFORE_SUCCESSOR_ACTIVATION',
    'STOP_BEFORE_CANONICALIZATION',
    'STOP_BEFORE_TRANSITION_EXECUTION',
    'STOP_BEFORE_STEP_2_IMPLEMENTATION'
  ],
  currentIdentityReferences: [
    'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_SUCCESSOR_ACTIVATION_TRANSITION_CONTRACT_CANDIDATE_v1',
    ACCEPTED_PACKAGE_COMMIT,
    '73df413b40f0397d2771d08321be2848cab2232c',
    'sha256:d2e2eb3b0ce0cc2ec3a1a636d8f908398e75710ce6bb4d93f86bfa010db954d0'
  ],
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: []
});

const OVERLAY_NODE = H_EARTH_REPOSITORY_REGISTRY_STEP_1_SCOPE_RECONCILIATION_NODE;
const OVERLAY_EVIDENCE = H_EARTH_REPOSITORY_REGISTRY_STEP_1_SCOPE_RECONCILIATION_EVIDENCE;
const OVERLAY_PATHS = new Set(OVERLAY_NODE.repositoryPaths);
const OVERLAY_OCCURRENCES = OVERLAY_NODE.repositoryOccurrences;
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, OVERLAY_EVIDENCE],
  nodes: [...baseInstance.nodes, OVERLAY_NODE]
});

function matchesNodeCriteria(node, criteria = {}) {
  const {
    nodeType = null,
    nodeSubtype = null,
    authorityClass = null,
    cardinalRole = null,
    lifecycleStatus = null,
    repositoryPath = null,
    hasUnresolvedFields = null,
    text = null
  } = criteria;
  if (nodeType !== null && node.nodeType !== nodeType) return false;
  if (nodeSubtype !== null && node.nodeSubtype !== nodeSubtype) return false;
  if (authorityClass !== null && node.authorityClass !== authorityClass) return false;
  if (cardinalRole !== null && node.cardinalRole !== cardinalRole) return false;
  if (lifecycleStatus !== null && node.lifecycleStatus !== lifecycleStatus) return false;
  if (repositoryPath !== null && !node.repositoryPaths.includes(repositoryPath)) return false;
  if (hasUnresolvedFields !== null && ((node.unresolvedFields.length > 0) !== hasUnresolvedFields)) return false;
  if (typeof text === 'string') {
    const haystack = [node.nodeId, node.displayName, node.description, node.authorityPosture, ...node.repositoryPaths, ...node.currentIdentityReferences].join('\n').toLowerCase();
    if (!haystack.includes(text.toLowerCase())) return false;
  }
  return true;
}

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === OVERLAY_NODE.nodeId ? OVERLAY_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === OVERLAY_EVIDENCE.evidenceId ? OVERLAY_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  if (!OVERLAY_PATHS.has(repositoryPath)) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  const occurrences = OVERLAY_OCCURRENCES.filter((occurrence) => occurrence.path === repositoryPath);
  return deepFreeze({
    repositoryPath,
    resolved: true,
    nodes: [OVERLAY_NODE],
    occurrences,
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const matches = OVERLAY_OCCURRENCES.filter((occurrence) => {
    if (input.path !== undefined && input.path !== null && occurrence.path !== input.path) return false;
    if (input.commitSha !== undefined && input.commitSha !== null && occurrence.commitSha !== input.commitSha) return false;
    if (input.gitBlobSha !== undefined && input.gitBlobSha !== null && occurrence.gitBlobSha !== input.gitBlobSha) return false;
    if (input.refName !== undefined && input.refName !== null && occurrence.refName !== input.refName) return false;
    return true;
  }).map((occurrence) => deepFreeze({ nodeId: OVERLAY_NODE.nodeId, node: OVERLAY_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return deepFreeze({
    query: base.query,
    matches: [...base.matches, ...matches],
    resolved: base.resolved || matches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  return deepFreeze(matchesNodeCriteria(OVERLAY_NODE, criteria) ? [...base, OVERLAY_NODE] : [...base]);
}

export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  if (nodeId === OVERLAY_NODE.nodeId) return Object.freeze([]);
  return baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === OVERLAY_NODE.nodeId) {
    return deepFreeze({ nodeId, nodes: [OVERLAY_NODE], relations: [], unresolved: false });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_REPOSITORY_REGISTRY_STEP_1_RECONCILED_FACADE = deepFreeze({
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

export default H_EARTH_REPOSITORY_REGISTRY_STEP_1_RECONCILED_FACADE;
