/** Read-only accepted-amendment facade for Run 8E R3C persistent GPU resources and continuous camera loop. */
import baseFacade from './h-earth.repository-registry.run8e-r3b-isolated-webgl2-fixed-frame-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3c-persistent-gpu-camera-loop-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3c.pass-closed.receipt.json';
export const H_EARTH_RUN_8E_R3C_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3c-persistent-gpu-camera-loop.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3c.persistent-gpu-camera-loop.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3c-persistent-gpu-camera-loop-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3c.persistent-gpu-camera-loop.harness.mjs',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r3c/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3c/continuous-loop.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3C_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT_OR_PLANNED',
  fetchbackStatus: 'R3C_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3C_PERSISTENT_GPU_CAMERA_LOOP_EXECUTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3C_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_CAMERA_LOOP_v1',
  evidenceClass: 'R3C_PERSISTENT_GPU_RESOURCE_AND_CONTINUOUS_CAMERA_LOOP_EXECUTION_PENDING',
  sourceKind: 'GITHUB_ACTIONS_REAL_BROWSER_CONTINUOUS_WEBGL2_EXECUTION_SCREENSHOT_AND_READBACK',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3c/',
  sourceOccurrenceOrRevision: null,
  assertionScope: [
    'ONE_WEBGL2_CONTEXT_RETAINED',
    'TWO_SHADER_PROGRAMS_RETAINED',
    'NINE_CANONICAL_GPU_BUFFERS_UPLOADED_ONCE',
    'REQUEST_ANIMATION_FRAME_CAMERA_LOOP',
    'PER_FRAME_CAMERA_UNIFORM_UPDATES',
    'FOUR_DRAW_RANGES_PER_FRAME',
    'NO_POST_INITIALIZATION_UPLOAD_OR_RESOURCE_CREATION',
    'DISTINCT_START_MIDDLE_FINAL_FRAMES',
    'R3C_STOP_BEFORE_DIRECT_INTERACTION'
  ],
  verifiedOn: null,
  evidenceMetadata: {
    baseExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
    predecessorPullRequest: 227,
    r3BFinalWorkflowRun: 30288809515,
    r3BFinalWorkflowJob: 90053191900,
    r3BFinalArtifact: 8661940302,
    r3BFinalArtifactDigest: 'sha256:f794da533ba2b83e9f3182ee2a89e7f525a8c714f63e9c521446dc398a18c572',
    requiredFrameCount: 180,
    requiredGpuBufferCount: 9,
    requiredBufferUploadCount: 9,
    requiredGeometryDrawCallsPerFrame: 4,
    requiredCameraUniformUpdatesPerFrame: 2,
    requiredCaptureLabels: ['start', 'middle', 'final']
  },
  evidenceLimitations: [
    'EXECUTION_PENDING',
    'NO_GESTURE_OR_DIRECT_INTERACTION',
    'NO_PUBLIC_ROUTE_BINDING',
    'NO_DEPLOYMENT',
    'R3D_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ]
});

export const H_EARTH_RUN_8E_R3C_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_CAMERA_LOOP',
  nodeType: 'RECOVERY_EXECUTION_CHECKPOINT',
  nodeSubtype: 'PERSISTENT_WEBGL2_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP',
  displayName: 'H-Earth Run 8E R3C Persistent GPU Resources and Continuous Camera Loop',
  description: 'Retains one WebGL2 context, shader programs, VAO, canonical GPU buffers, framebuffer attachments, and draw-range state while requestAnimationFrame updates only camera uniforms over a bounded continuous loop.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3C_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3C_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3C_EVIDENCE.evidenceId],
  authorityClass: 'BOUNDED_PERSISTENT_GPU_CAMERA_LOOP_EXECUTION_PENDING',
  authorityPosture: 'R3C_EXECUTION_PENDING_UNMERGED_R3D_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3B_PASS_CLOSED_FIXED_FRAME', 'R3A_SHARED_CAMERA_PACKET', 'R2_CANONICAL_GPU_PACKAGE'],
  authorityScope: ['PERSIST_GPU_RESOURCES', 'EXECUTE_CONTINUOUS_CAMERA_LOOP', 'UPDATE_CAMERA_UNIFORMS_ONLY', 'PRESERVE_R3D_STOPPING_BOUNDARY'],
  authorityLimitations: ['NO_INTERACTION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3B_PASS_CLOSED_BEFORE_R3C', 'R3C_PASS_CLOSED_BEFORE_R3D'],
  dependencyRelations: [],
  allowedMutationScope: 'R3C_BOUNDED_PATH_SET_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'R2_PACKAGE', 'R2D_GPU_ADAPTER', 'R3D_OR_LATER'],
  requiredValidations: ['REAL_BROWSER_CONTINUOUS_LOOP', 'RESOURCE_PERSISTENCE_COUNTERS', 'DISTINCT_FRAME_ARTIFACTS', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT', 'FINAL_EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D'],
  currentIdentityReferences: ['11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1', '30288809515', '8661940302'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['R3C_EXECUTION_HEAD', 'R3C_WORKFLOW_RUN', 'R3C_ARTIFACT', 'R3C_PASS_RECEIPT']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3C_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3C_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3C_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3C_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3C_NODE.nodeId ? H_EARTH_RUN_8E_R3C_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3C_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3C_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3C_NODE.nodeId, node: H_EARTH_RUN_8E_R3C_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3C_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3C_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3C_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3C_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3C_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3C_FACADE;
