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
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: repositoryPath === PASS_RECEIPT_PATH
    ? 'R3C_CORE_EXECUTION_PASS_DURABLE_RECEIPT_PENDING'
    : 'R3C_CORE_EXECUTION_PASS_FETCHBACK_ESTABLISHED',
  occurrenceClass: 'RUN_8E_R3C_PERSISTENT_GPU_CAMERA_LOOP_CORE_PASS_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3C_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3C_PERSISTENT_GPU_CAMERA_LOOP_v1',
  evidenceClass: 'EXECUTED_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_CORE_PASS',
  sourceKind: 'GITHUB_ACTIONS_REAL_BROWSER_CONTINUOUS_WEBGL2_EXECUTION_THREE_FRAME_ARTIFACTS_DEPTH_READBACK_AND_COUNTER_RECEIPT',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r3c/',
  sourceOccurrenceOrRevision: '1b02cb845d3b81c04fc3718233f5142765592f83',
  assertionScope: [
    'ONE_WEBGL2_CONTEXT_RETAINED',
    'TWO_SHADER_PROGRAMS_RETAINED',
    'ONE_VERTEX_ARRAY_RETAINED',
    'NINE_CANONICAL_GPU_BUFFERS_UPLOADED_ONCE',
    'PERSISTENT_FRAMEBUFFER_ATTACHMENTS',
    'REQUEST_ANIMATION_FRAME_CAMERA_LOOP_180_FRAMES',
    'THREE_HUNDRED_SIXTY_CAMERA_UNIFORM_UPDATES',
    'SEVEN_HUNDRED_TWENTY_GOVERNED_GEOMETRY_DRAWS',
    'ZERO_POST_INITIALIZATION_RESOURCE_CREATION',
    'ZERO_POST_INITIALIZATION_BUFFER_UPLOAD',
    'ZERO_WORLD_REBUILD',
    'DISTINCT_START_MIDDLE_FINAL_FRAMES',
    'REAL_COLOR_AND_DEPTH_OUTPUT',
    'R3C_PASS_CLOSED_CONTROL_STATE',
    'R3_OPEN_AT_R3D_BOUNDARY'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1',
    pullRequest: 231,
    predecessorPullRequest: 227,
    successfulExecutionHead: '1b02cb845d3b81c04fc3718233f5142765592f83',
    workflowRun: 30290450153,
    workflowJob: 90058672196,
    artifactId: 8662569874,
    artifactDigest: 'sha256:3aea0979d3523da1c6e2c3f41cdcfcf64a0501f58f6df9b1187b0ea5fda92e87',
    automaticRegistryPreflightRun: 30290450161,
    automaticRegistryPreflight: 'PASS',
    contextCreationCount: 1,
    shaderCreateCount: 4,
    shaderCompileCount: 4,
    programCreateCount: 2,
    programLinkCount: 2,
    vertexArrayCreateCount: 1,
    gpuBufferCount: 9,
    bufferUploadCount: 9,
    uploadedByteLength: 2145444,
    textureCount: 3,
    framebufferCount: 2,
    frameCount: 180,
    requestAnimationFrameCallbackCount: 180,
    loopDurationMs: 4366.55,
    cameraUniformUpdateCount: 360,
    geometryDrawCallCount: 720,
    totalDrawnIndexCount: 26481600,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    worldRebuildCount: 0,
    captureCount: 3,
    startFramePath: 'h-earth.run8e-r3c.start-frame.png',
    startFrameSha256: 'ef5957da367f220b516a8a3b1d6c8787608cf20357747c26648a744ce03929a5',
    startFramePixelHash: 'fnv1a32:13de0f5d',
    middleFramePath: 'h-earth.run8e-r3c.middle-frame.png',
    middleFrameSha256: '7464e078f2c3981126112517a7cecc4a9616e2c363a9bfd5d34a9448707e64e2',
    middleFramePixelHash: 'fnv1a32:c50c9cca',
    finalFramePath: 'h-earth.run8e-r3c.final-frame.png',
    finalFrameSha256: '6afece3cb60200c1d78147794c6ff8cf8b3b907f4ea0851ace4d326d767ff35b',
    finalFramePixelHash: 'fnv1a32:f7b77601',
    depthPixelHash: 'fnv1a32:d98bf534',
    diagnosticPageSha256: '0615244a9fdb8fb8adcf0412565a1b44f8bfabcbc911d291a9c26c0e247480ac',
    logicalPromotedPackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    persistentRendererId: 'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1'
  },
  evidenceLimitations: [
    'DURABLE_R3C_PASS_RECEIPT_PENDING',
    'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
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
  description: 'Retains one WebGL2 context, shader programs, VAO, canonical GPU buffers, framebuffer attachments, and draw-range state while requestAnimationFrame updates only camera uniforms across 180 real frames with three distinct inspectable frame artifacts.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3C_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3C_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3C_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_BOUNDED_PERSISTENT_GPU_CAMERA_LOOP_CORE_PASS',
  authorityPosture: 'R3C_CORE_EXECUTION_PASS_RECEIPT_PENDING_R3D_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3B_PASS_CLOSED_FIXED_FRAME', 'R3A_SHARED_CAMERA_PACKET', 'R2_CANONICAL_GPU_PACKAGE', 'R3C_GITHUB_ACTIONS_BROWSER_EXECUTION', 'R3C_THREE_FRAME_ARTIFACTS'],
  authorityScope: ['PERSIST_GPU_RESOURCES', 'EXECUTE_CONTINUOUS_CAMERA_LOOP', 'UPDATE_CAMERA_UNIFORMS_ONLY', 'PRESERVE_R3D_STOPPING_BOUNDARY'],
  authorityLimitations: ['NO_INTERACTION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3B_PASS_CLOSED_BEFORE_R3C', 'R3C_PASS_CLOSED_BEFORE_R3D'],
  dependencyRelations: [],
  allowedMutationScope: 'R3C_RECEIPT_AND_FINAL_EVIDENCE_RECONCILIATION_ONLY',
  prohibitedMutations: ['PUBLIC_ROUTE', 'DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'R2_PACKAGE', 'R2D_GPU_ADAPTER', 'R3D_OR_LATER'],
  requiredValidations: ['RECEIPT_FREE_CLOSURE_CONTROL_BROWSER_EXECUTION', 'DURABLE_PASS_RECEIPT', 'FINAL_EXACT_HEAD_REAL_BROWSER_EXECUTION', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT', 'FINAL_EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_DIAGNOSTIC_DIRECT_INTERACTION_R3D'],
  currentIdentityReferences: ['11b6c8c4cb3bec4e6666d9d1e6500e18fa271ce1', '1b02cb845d3b81c04fc3718233f5142765592f83', '30290450153', '8662569874', 'ef5957da367f220b516a8a3b1d6c8787608cf20357747c26648a744ce03929a5', '7464e078f2c3981126112517a7cecc4a9616e2c363a9bfd5d34a9448707e64e2', '6afece3cb60200c1d78147794c6ff8cf8b3b907f4ea0851ace4d326d767ff35b'],
  lifecycleStatus: 'CORE_EXECUTION_PASS_RECEIPT_PENDING',
  unresolvedFields: ['DURABLE_PASS_RECEIPT', 'FINAL_EXACT_HEAD', 'FINAL_EXACT_HEAD_WORKFLOW_RUN']
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
