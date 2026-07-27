/** Read-only accepted-amendment facade for Run 8E R3B isolated WebGL2 fixed-frame execution. */
import baseFacade from './h-earth.repository-registry.run8e-r3a-shared-camera-gpu-presentation-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3b-isolated-webgl2-fixed-frame-001';
export const H_EARTH_RUN_8E_R3B_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3b-isolated-webgl2-fixed-frame.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3b.isolated-webgl2-fixed-frame.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3b-isolated-webgl2-fixed-frame-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3b.isolated-webgl2-fixed-frame.harness.mjs',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.pass-closed.receipt.json',
  '/showroom/globe/h-earth/diagnostic/run8e-r3b/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3b/fixed-frame.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3B_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT_OR_RESERVED',
  fetchbackStatus: 'R3B_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3B_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_v1',
  evidenceClass: 'R3B_REAL_WEBGL2_FIXED_FRAME_EXECUTION_CANDIDATE',
  sourceKind: 'REPOSITORY_SOURCE_GITHUB_ACTIONS_BROWSER_EXECUTION_AND_SCREENSHOT_ARTIFACT',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3b/fixed-frame.js',
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: [
    'REAL_WEBGL2_CONTEXT',
    'REAL_SHADER_COMPILE_AND_LINK',
    'EXACT_CANONICAL_GPU_BUFFER_BINDING',
    'FOUR_DRAW_RANGE_EXECUTION',
    'REAL_COLOR_AND_DEPTH_OUTPUT',
    'INSPECTABLE_VISIBLE_FIXED_FRAME',
    'PACKAGE_CAMERA_MATERIAL_ATMOSPHERE_DEPTH_CORRESPONDENCE',
    'NO_PUBLIC_ROUTE_OR_CONTINUOUS_LOOP'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
    pullRequest: null,
    workflowRun: null,
    workflowJob: null,
    artifactId: null,
    artifactDigest: null,
    fixedVisibleFramePath: null,
    browserExecutionStatus: 'PENDING'
  },
  evidenceLimitations: [
    'R3B_EXECUTION_PENDING',
    'PERSISTENT_GPU_RESOURCES_NOT_ESTABLISHED',
    'CONTINUOUS_CAMERA_LOOP_NOT_ESTABLISHED',
    'NO_INTERACTION_BINDING',
    'NO_PUBLIC_ROUTE_BINDING',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3B_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'ISOLATED_WEBGL2_FIXED_VISIBLE_FRAME',
  displayName: 'H-Earth Run 8E R3B Isolated WebGL2 Fixed Frame',
  description: 'Executes the exact immutable R2 package through the R3A camera packet in an isolated WebGL2 diagnostic page with real shaders, four governed draw ranges, color and depth output, readback, and inspectable screenshot evidence.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3B_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3B_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3B_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_ISOLATED_GPU_EXECUTION',
  authorityPosture: 'R3B_EXECUTION_PENDING_R3C_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R2_PASS_CLOSED_PACKAGE', 'R3A_PASS_CLOSED_CAMERA_PACKET', 'R3B_CONTROL'],
  authorityScope: ['ISOLATED_WEBGL2_CONTEXT', 'FIXED_FRAME_SHADERS_AND_DRAW', 'COLOR_DEPTH_READBACK', 'SCREENSHOT_EVIDENCE'],
  authorityLimitations: ['NO_PUBLIC_ROUTE', 'NO_INTERACTION', 'NO_CONTINUOUS_LOOP', 'NO_DEPLOYMENT', 'NO_R3C', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3A_PASS_CLOSED_BEFORE_R3B', 'R3B_PASS_CLOSED_BEFORE_R3C'],
  dependencyRelations: [],
  allowedMutationScope: 'R3B_NINE_PATH_BOUNDED_SCOPE_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'R2_PACKAGE', 'R2D_GPU_ADAPTER', 'CONTINUOUS_LOOP', 'R3C_OR_LATER'],
  requiredValidations: ['REAL_BROWSER_WEBGL2_EXECUTION', 'SCREENSHOT_ARTIFACT', 'COLOR_DEPTH_READBACK', 'AUTOMATIC_REGISTRY_PREFLIGHT', 'EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'],
  currentIdentityReferences: ['9560bc1f88800e12408a99a10032e9daf1e56713', 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['WORKFLOW_RUN', 'ARTIFACT_DIGEST', 'PASS_RECEIPT', 'FINAL_EXACT_HEAD']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3B_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3B_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3B_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3B_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3B_NODE.nodeId ? H_EARTH_RUN_8E_R3B_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3B_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3B_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3B_NODE.nodeId, node: H_EARTH_RUN_8E_R3B_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3B_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3B_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3B_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3B_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3B_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3B_FACADE;
