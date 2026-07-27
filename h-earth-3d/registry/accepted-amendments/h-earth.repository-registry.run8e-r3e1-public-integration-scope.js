/** Read-only accepted-amendment facade for Run 8E R3E1 public-integration scope declaration. */
import baseFacade from './h-earth.repository-registry.run8e-r3d5-r3d-closure-r3e-input-decision-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e1-public-integration-scope-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e1.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3E1_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3e1-public-integration-scope.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-control.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-declaration.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e1-public-integration-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e1.public-integration-scope.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3E1_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3E1_SCOPE_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE_v1',
  evidenceClass: 'R3E1_EXACT_PUBLIC_INTEGRATION_MUTATION_SCOPE_EXECUTION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_NODE_SOURCE_AND_REGISTRY_RECONCILIATION',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8e-r3e1.public-integration-scope.harness.mjs',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'EXACT_PUBLIC_SOURCE_BLOBS_READ',
    'CURRENT_RUNTIME_OWNER_COLLISIONS_CLASSIFIED',
    'TWO_PATH_FUTURE_PUBLIC_MUTATION_SCOPE_DECLARED',
    'ELEVEN_PROTECTED_WITNESSES_DECLARED',
    'EXACT_LOAD_ORDER_AND_ROLLBACK_GROUPS_DECLARED',
    'NO_SHOWROOM_MUTATION_PERFORMED',
    'STOP_BEFORE_R3E2'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
    predecessorPullRequest: 243,
    predecessorPassReceiptGitBlob: 'f9f6d9b1464882f7e8cf7143a4d4e90d4093dcec',
    exactFutureMutationPaths: [
      '/showroom/globe/h-earth/index.html',
      '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'
    ],
    protectedPublicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    protectedCpuRouteControllerGitBlob: '83e85df2f4440c2825672f46fb16e28c73992db2',
    protectedCpuEnvironmentIntegrationGitBlob: '6c047d61544fcbc4fad8673abfbacb7c827fdb22',
    protectedDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  evidenceLimitations: [
    'EXECUTION_PENDING',
    'NO_PUBLIC_SOURCE_MUTATION',
    'NO_BROWSER_OR_GPU_EXECUTION',
    'R3E2_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3E1_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE',
  nodeType: 'RECOVERY_INTEGRATION_SCOPE_CHECKPOINT',
  nodeSubtype: 'EXACT_PUBLIC_ROUTE_MUTATION_SCOPE_AND_RUNTIME_OWNER_DISPOSITION',
  displayName: 'H-Earth Run 8E R3E1 Exact Public Integration Scope',
  description: 'Reads the actual public runtime corridor, classifies legacy ownership collisions, and declares a two-path future R3E2 integration scope without mutating public source.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E1_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_PUBLIC_INTEGRATION_SCOPE_DECLARATION_PENDING',
  authorityPosture: 'R3E1_EXECUTION_PENDING_R3E2_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D5_PASS_CLOSED_RECEIPT', 'ACTUAL_PUBLIC_ROUTE_SOURCE', 'ACTUAL_LEGACY_RUNTIME_SOURCES'],
  authorityScope: ['READ_PUBLIC_RUNTIME', 'DECLARE_EXACT_FUTURE_MUTATION_SCOPE', 'DECLARE_LOAD_ORDER', 'DECLARE_ROLLBACK_GROUPS'],
  authorityLimitations: ['NO_SHOWROOM_MUTATION', 'NO_PUBLIC_BINDING', 'NO_BROWSER_EXECUTION', 'NO_GPU_EXECUTION', 'NO_R3E2', 'NO_DEPLOYMENT', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D5_PASS_CLOSED_BEFORE_R3E1', 'R3E1_PASS_CLOSED_BEFORE_R3E2_SOURCE_MUTATION'],
  dependencyRelations: [],
  allowedMutationScope: 'R3E1_EIGHT_PATH_CONTROL_AND_EVIDENCE_SCOPE_ONLY',
  prohibitedMutations: ['SHOWROOM', 'PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION', 'RENDERER', 'DIAGNOSTIC_BINDING', 'R3E2_OR_LATER'],
  requiredValidations: ['EXACT_SOURCE_BLOBS', 'SCOPE_DECLARATION_EVALUATION', 'NO_SHOWROOM_DELTA', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'],
  currentIdentityReferences: ['ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3E1_EXECUTION_HEAD', 'R3E1_WORKFLOW_RUN', 'R3E1_ARTIFACT', 'R3E1_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E1_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3E1_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E1_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E1_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3E1_NODE.nodeId ? H_EARTH_RUN_8E_R3E1_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E1_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E1_NODE.nodeId, node: H_EARTH_RUN_8E_R3E1_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3E1_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3E1_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3E1_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E1_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E1_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3E1_FACADE;
