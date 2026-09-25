/** Read-only Run 8A path-registration overlay. */
import baseFacade from './h-earth.repository-registry.functional-environment-run7i-live-scope-reconciliation.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8a-dimensional-reconciliation-001';

export const H_EARTH_RUN_8A_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8a-dimensional-reconciliation-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js',
  '/h-earth-3d/validation/h-earth.run8a.dimensional-reconciliation.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8a.dimensional-reconciliation.receipt.json'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8A_SCOPE_PATHS.map((path) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_RUN_8A_WORKSPACE',
  occurrenceClass: 'CANDIDATE'
})));

export const H_EARTH_RUN_8A_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8A_DIMENSIONAL_RECONCILIATION_SCOPE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXECUTED_REPOSITORY_WORKSPACE_CONTRACT_AUDIT',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8a.dimensional-reconciliation.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_8A_WORKSPACE_PENDING_FINAL_EXECUTION',
  assertionScope: Object.freeze([
    'MATHEMATICAL_BASELINE_PRESERVATION',
    'PACKET_001_AND_PACKET_002_DISPOSITION',
    'SUCCESSOR_MOUNTAIN_DIMENSIONAL_CONTRACT',
    'SUCCESSOR_WORLD_DOMAIN_MINUS_320',
    'VEGETATION_WORLD_ATTACHMENT_CONTRACT',
    'SOUTH_AND_WEST_COMPATIBILITY'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'CONTRACT_AND_MATHEMATICAL_RECONCILIATION_ONLY',
    'NO_NEUTRAL_GEOMETRY_CONSTRUCTION',
    'NO_WEST_ADMISSION',
    'NO_PACKET_002_TRANSFER',
    'NO_PUBLIC_VISUAL_CLAIM',
    'NO_DEPLOYMENT'
  ])
});

export const H_EARTH_RUN_8A_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8A_DIMENSIONAL_RECONCILIATION_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'RUN_8A_DIMENSIONAL_RECONCILIATION_SCOPE_PACKAGE',
  displayName: 'H-Earth Run 8A Dimensional Reconciliation Scope Package',
  description:
    'Registers the exact Run 8A contract, harness, workflow and receipt paths for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_RUN_8A_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8A_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_RUN_8A_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_8A_EXECUTION_AUTHORIZATION',
    'EXISTING_NEWS_GEOMETRY_KERNEL',
    'EXISTING_PACKET_001_AND_PACKET_002_CORRIDOR',
    'USER_FINALIZED_MOUNTAIN_AND_WORLD_DOMAIN_DECISIONS'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_8A_REPOSITORY_PATH_RESOLUTION',
    'RUN_8A_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_CONSTRUCT_GEOMETRY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_ADMISSION_OR_TRANSFER_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_PUBLIC_VISUAL_OR_PRODUCTION_AUTHORITY'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'GEOMETRY_KERNEL_REDEFINITION',
    'TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION',
    'RUN_8B_CONSTRUCTION',
    'PUBLIC_ROUTE_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_8A_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_8A_EXECUTED_CONTRACT_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_8A_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_RUN_8B_CONSTRUCTION_OCCURS_IN_RUN_8A',
    'STOP_IF_LEGACY_PROXY_IS_MUTATED'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_EXISTING_MATHEMATICAL_BASELINE_PACKET_CORRIDOR_AND_DIMENSIONAL_GEOMETRY_RECONCILIATION_RUN_8A_v1',
    'bb1273ecad6ad1441555e035a58d2ae7a1c3dc91'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8A_SCOPE_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8A_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8A_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8A_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8A_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8A_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8A_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8A_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({
        repositoryPath,
        resolved: true,
        nodes: [indexed.node],
        occurrences: indexed.occurrences,
        unresolved: false
      })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({
      nodeId: H_EARTH_RUN_8A_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8A_SCOPE_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({
    query: base.query,
    matches: [...base.matches, ...local],
    resolved: base.resolved || local.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8A_SCOPE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode =
  (id, direction = 'BOTH') =>
    id === H_EARTH_RUN_8A_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8A_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8A_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8A_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8A_RECONCILED_FACADE;
