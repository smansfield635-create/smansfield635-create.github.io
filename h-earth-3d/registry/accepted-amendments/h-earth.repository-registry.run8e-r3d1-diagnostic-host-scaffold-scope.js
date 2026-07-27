/** Read-only accepted-amendment facade for Run 8E R3D1 diagnostic directory and host scaffold. */
import baseFacade from './h-earth.repository-registry.run8e-r3c-persistent-gpu-camera-loop-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d1-diagnostic-host-scaffold-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d1.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D1_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d1-diagnostic-host-scaffold.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d1.diagnostic-host-scaffold.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d1-diagnostic-host-scaffold-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d1.diagnostic-host-scaffold.validation.mjs',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.placeholder.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.placeholder.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D1_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3D1_SCAFFOLD_VALIDATION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_v1',
  evidenceClass: 'R3D1_DIAGNOSTIC_DIRECTORY_HOST_AND_PLACEHOLDER_PATH_VALIDATION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_STATIC_PATH_MODULE_AND_HTTP_RESOLUTION',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'DIAGNOSTIC_DIRECTORY_CREATED',
    'HTML_HOST_CREATED',
    'HOST_MODULE_CREATED',
    'POINTER_TOUCH_PLACEHOLDER_CREATED',
    'LIVE_GPU_BINDING_PLACEHOLDER_CREATED',
    'RELATIVE_MODULE_PATHS_RESOLVE',
    'STATIC_HTTP_PATHS_RESOLVE',
    'NO_INTERACTION_OR_RENDERER_EXECUTION',
    'STOP_BEFORE_R3D2'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    predecessorPullRequest: 231,
    requiredDiagnosticPathCount: 4,
    protectedPersistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    protectedPublicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    protectedPublicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  evidenceLimitations: [
    'SCAFFOLD_VALIDATION_PENDING',
    'NO_POINTER_TOUCH_OR_WHEEL_BINDING',
    'NO_NAVIGATION_PROPOSAL_EXECUTION',
    'NO_WEBGL_OR_PERSISTENT_RENDERER_EXECUTION',
    'NO_LIVE_GPU_CAMERA_BINDING',
    'NO_PUBLIC_ROUTE_BINDING',
    'R3D2_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D1_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD',
  nodeType: 'RECOVERY_SCAFFOLD_CHECKPOINT',
  nodeSubtype: 'DIAGNOSTIC_DIRECTORY_HTML_HOST_AND_NONEXECUTING_PLACEHOLDERS',
  displayName: 'H-Earth Run 8E R3D1 Diagnostic Host Scaffold',
  description: 'Creates and validates the isolated R3D diagnostic directory, HTML host, host descriptor, and non-executing placeholders while stopping before pointer, touch, navigation, renderer, or public-route work.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D1_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D1_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D1_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_DIAGNOSTIC_HOST_SCAFFOLD_EXECUTION_PENDING',
  authorityPosture: 'R3D1_EXECUTION_PENDING_UNMERGED_R3D2_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3C_PASS_CLOSED_PERSISTENT_RENDERER', 'R3D_BOUNDED_SUBCHECKPOINT_DECOMPOSITION'],
  authorityScope: ['CREATE_DIAGNOSTIC_DIRECTORY', 'CREATE_HTML_HOST', 'CREATE_NONEXECUTING_PLACEHOLDERS', 'VALIDATE_PATH_RESOLUTION'],
  authorityLimitations: ['NO_INTERACTION', 'NO_RENDERER_EXECUTION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D2', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3C_PASS_CLOSED_BEFORE_R3D1', 'R3D1_PASS_CLOSED_BEFORE_R3D2'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D1_ELEVEN_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'PERSISTENT_RENDERER', 'INTERACTION_BINDING', 'R3D2_OR_LATER'],
  requiredValidations: ['STATIC_FILE_EXISTENCE', 'MODULE_IMPORT_RESOLUTION', 'STATIC_HTTP_RESOLUTION', 'FORBIDDEN_EXECUTION_TOKEN_SCAN', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2'],
  currentIdentityReferences: ['5c7a7eef489da94a230812eecc5e531e285b7cac'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3D1_WORKFLOW_RUN', 'R3D1_ARTIFACT', 'R3D1_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D1_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3D1_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D1_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D1_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D1_NODE.nodeId ? H_EARTH_RUN_8E_R3D1_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D1_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3D1_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D1_NODE.nodeId, node: H_EARTH_RUN_8E_R3D1_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D1_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D1_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D1_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D1_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D1_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3D1_FACADE;
