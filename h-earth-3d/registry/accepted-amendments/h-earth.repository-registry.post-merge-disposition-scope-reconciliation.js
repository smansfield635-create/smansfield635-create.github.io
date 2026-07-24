/**
 * H_EARTH_REPOSITORY_REGISTRY_POST_MERGE_DISPOSITION_SCOPE_RECONCILIATION_v1
 *
 * Bounded read-only overlay for the post-merge 42-file scope-disposition package.
 * It resolves only the disposition artifacts, this overlay, and the validator
 * loader. It creates no acceptance, activation, canonicalization, transition,
 * bootstrap, deployment, production, or Step 2 authority.
 */
import baseFacade from './h-earth.repository-registry.step-1-scope-reconciliation.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-post-merge-scope-disposition-001';
const PATHS = Object.freeze([
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-delta.ledger.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-scope-disposition.table.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action-plan.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action.receipt.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-retained-state.identity-manifest.json',
  '/h-earth-3d/control-plane/post-merge-disposition/h-earth.successor-registry-evidence-lane.reclassification.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.post-merge-disposition-scope-reconciliation.js',
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
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
}));

export const H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_POST_MERGE_42_FILE_SCOPE_DISPOSITION_PACKAGE',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'USER_SUPPLIED_VERIFICATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/post-merge-disposition/',
  sourceOccurrenceOrRevision: 'SOURCE_MERGE=ee7324734bb687e71ebb3ee93ff23e6353feb5fe;USER_AUTHORIZATION=COMPLETE_EACH_ANCHORED_DISPOSITION_INCREMENTALLY',
  assertionScope: ['EXACT_DISPOSITION_PACKAGE_PATH_RESOLUTION', 'READ_ONLY_PREFLIGHT_SCOPE'],
  verifiedOn: '2026-07-23',
  evidenceLimitations: [
    'NO_SUCCESSOR_ACCEPTANCE_OR_ACTIVATION',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION',
    'NO_TRANSITION_EXECUTION',
    'NO_STEP_2_IMPLEMENTATION_AUTHORITY'
  ]
});

export const H_EARTH_POST_MERGE_DISPOSITION_SCOPE_NODE = deepFreeze({
  nodeId: 'H_EARTH_POST_MERGE_42_FILE_SCOPE_DISPOSITION_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'POST_MERGE_REPOSITORY_STABILIZATION_PACKAGE',
  displayName: 'H-Earth Post-Merge 42-File Scope Disposition Package',
  description: 'Bounded repository-stabilization evidence and audit package for the 42-file PR 79 merge delta.',
  repositoryPaths: [...PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: [H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE.evidenceId],
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'POST_MERGE_SCOPE_DISPOSITION_AND_REPOSITORY_STABILIZATION_AUDIT_ONLY',
  authoritySource: ['EXPLICIT_CURRENT_USER_INSTRUCTION'],
  authorityScope: ['EXACT_DISPOSITION_PACKAGE_PATH_RESOLUTION', 'READ_ONLY_PREFLIGHT_SCOPE'],
  authorityLimitations: [
    'NO_SUCCESSOR_ACCEPTANCE_OR_ACTIVATION',
    'NO_BOOTSTRAP_REPLACEMENT',
    'NO_CANONICALIZATION',
    'NO_TRANSITION_EXECUTION',
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
  prohibitedMutations: ['BOOTSTRAP_REPLACEMENT', 'CANONICALIZATION', 'SUCCESSOR_ACTIVATION', 'TRANSITION_EXECUTION', 'STEP_2_IMPLEMENTATION'],
  requiredValidations: ['EXACT_PATH_RESOLUTION', 'DISPOSITION_TABLE_COMPLETENESS', 'RETAINED_STATE_AUDIT'],
  stoppingBoundaries: ['STOP_BEFORE_MAIN_MUTATION', 'STOP_BEFORE_SUCCESSOR_ACTIVATION', 'STOP_BEFORE_STEP_2_IMPLEMENTATION'],
  currentIdentityReferences: ['H_EARTH_PR79_POST_MERGE_42_FILE_SCOPE_DISPOSITION_TABLE_v1', 'ee7324734bb687e71ebb3ee93ff23e6353feb5fe'],
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: []
});

const NODE = H_EARTH_POST_MERGE_DISPOSITION_SCOPE_NODE;
const EVIDENCE = H_EARTH_POST_MERGE_DISPOSITION_SCOPE_EVIDENCE;
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

export const H_EARTH_POST_MERGE_DISPOSITION_RECONCILED_FACADE = deepFreeze({
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

export default H_EARTH_POST_MERGE_DISPOSITION_RECONCILED_FACADE;
