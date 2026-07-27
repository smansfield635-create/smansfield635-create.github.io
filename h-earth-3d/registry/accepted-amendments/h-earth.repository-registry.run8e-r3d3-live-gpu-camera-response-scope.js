/** Read-only accepted-amendment facade for Run 8E R3D3 live GPU camera response. */
import baseFacade from './h-earth.repository-registry.run8e-r3d2-pointer-touch-intake-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3d3-live-gpu-camera-response-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3d3.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3D3_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3d3-live-gpu-camera-response.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3d3.live-gpu-camera-response.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3d3-live-gpu-camera-response-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3d3.live-gpu-camera-response.harness.mjs',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/diagnostic-host.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3D3_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3D3_LIVE_GPU_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D3_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_v1',
  evidenceClass: 'R3D3_REAL_BROWSER_LIVE_GPU_CAMERA_RESPONSE_PENDING',
  sourceKind: 'GITHUB_ACTIONS_MOBILE_BROWSER_WEBGL2_NAVIGATION_PROPOSAL_TO_VISIBLE_FRAME_EXECUTION',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3d/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'R3D2_ACCEPTED_NAVIGATION_PROPOSAL_CONSUMED',
    'R3A_FRAME_PACKET_CREATED',
    'R3C_PERSISTENT_RENDERER_INITIALIZED_ONCE',
    'CANONICAL_PACKAGE_UPLOADED_ONCE',
    'VISIBLE_GPU_FRAME_BLITTED_TO_CANVAS',
    'DISTINCT_CAMERA_FRAMES',
    'NO_POST_INITIALIZATION_RESOURCE_CREATION',
    'NO_POST_INITIALIZATION_BUFFER_UPLOAD',
    'NO_BITMAP_PREVIEW',
    'STOP_BEFORE_R3D4'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: 'a58ed510eda8c21aac6fa6870271d945387f7cbd',
    predecessorPullRequest: 235,
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    publicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    publicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  evidenceLimitations: [
    'EXECUTION_PENDING',
    'DIAGNOSTIC_ONLY',
    'R3D4_BROADER_INTERACTION_EXECUTION_NOT_STARTED',
    'NO_PUBLIC_ROUTE_BINDING',
    'NO_DEPLOYMENT',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3D3_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'DIAGNOSTIC_NAVIGATION_PROPOSAL_TO_VISIBLE_PERSISTENT_WEBGL2_FRAME',
  displayName: 'H-Earth Run 8E R3D3 Live GPU Camera Response',
  description: 'Binds accepted R3D2 diagnostic navigation states through the R3A frame packet to the R3C persistent WebGL2 renderer and visible framebuffer blit without bitmap preview.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3D3_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3D3_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3D3_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_DIAGNOSTIC_LIVE_GPU_RESPONSE_EXECUTION_PENDING',
  authorityPosture: 'R3D3_EXECUTION_PENDING_UNMERGED_R3D4_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D2_PASS_CLOSED_INPUT_INTAKE', 'R3A_FRAME_PACKET', 'R3C_PERSISTENT_WEBGL2_RENDERER'],
  authorityScope: ['INITIALIZE_PERSISTENT_RENDERER_ONCE', 'CREATE_R3A_PACKETS_FROM_ACCEPTED_NAVIGATION_STATE', 'RENDER_AND_BLIT_VISIBLE_GPU_FRAMES'],
  authorityLimitations: ['NO_BITMAP_PREVIEW', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D4', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D2_PASS_CLOSED_BEFORE_R3D3', 'R3D3_PASS_CLOSED_BEFORE_R3D4'],
  dependencyRelations: [],
  allowedMutationScope: 'R3D3_TEN_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY_SOURCE', 'R3A_SOURCE', 'R3C_RENDERER_SOURCE', 'R3D4_OR_LATER'],
  requiredValidations: ['REAL_MOBILE_BROWSER_WEBGL2', 'VISIBLE_GPU_FRAME_HASH_CHANGE', 'PERSISTENT_RESOURCE_COUNTERS', 'NO_BITMAP_OR_CSS_TRANSFORM', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4'],
  currentIdentityReferences: ['a58ed510eda8c21aac6fa6870271d945387f7cbd'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3D3_EXECUTION_HEAD', 'R3D3_WORKFLOW_RUN', 'R3D3_ARTIFACT', 'R3D3_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3D3_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3D3_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3D3_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3D3_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3D3_NODE.nodeId ? H_EARTH_RUN_8E_R3D3_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3D3_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3D3_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3D3_NODE.nodeId, node: H_EARTH_RUN_8E_R3D3_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3D3_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3D3_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3D3_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3D3_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3D3_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3D3_FACADE;
