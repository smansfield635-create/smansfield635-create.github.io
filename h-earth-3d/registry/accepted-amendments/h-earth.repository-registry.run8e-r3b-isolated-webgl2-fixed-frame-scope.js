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
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.pass-closed.receipt.json';
export const H_EARTH_RUN_8E_R3B_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3b-isolated-webgl2-fixed-frame.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3b.isolated-webgl2-fixed-frame.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3b-isolated-webgl2-fixed-frame-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3b.isolated-webgl2-fixed-frame.harness.mjs',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.attempt-002.failure.receipt.json',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/diagnostic/run8e-r3b/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r3b/fixed-frame.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3B_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: repositoryPath === PASS_RECEIPT_PATH ? '1a3e1e9113b8e123525bdc924bf9c6ef1b0b1fd5' : null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R3B_DURABLE_PASS_RECEIPT_PRESENT_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_PASS_CLOSED_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3B_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_v1',
  evidenceClass: 'EXECUTED_REAL_WEBGL2_FIXED_VISIBLE_FRAME_WITH_DURABLE_PASS_CLOSED_RECEIPT',
  sourceKind: 'GITHUB_ACTIONS_REAL_BROWSER_EXECUTION_SCREENSHOT_READBACK_ARTIFACT_AND_REPOSITORY_RECEIPT',
  sourceIdOrPath: PASS_RECEIPT_PATH,
  sourceOccurrenceOrRevision: '1fb2bdee01806097f4785cb484c9132574dbdeaf',
  assertionScope: [
    'REAL_WEBGL2_CONTEXT',
    'REAL_SHADER_COMPILE_AND_LINK',
    'EXACT_CANONICAL_GPU_BUFFER_BINDING',
    'FOUR_DRAW_RANGE_EXECUTION',
    'REAL_COLOR_AND_DEPTH_OUTPUT',
    'INSPECTABLE_VISIBLE_FIXED_FRAME',
    'PACKAGE_CAMERA_MATERIAL_ATMOSPHERE_DEPTH_CORRESPONDENCE',
    'R3B_PASS_CLOSED',
    'R3_OPEN_AT_R3C_BOUNDARY',
    'NO_PUBLIC_ROUTE_OR_CONTINUOUS_LOOP'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
    pullRequest: 227,
    attempt001FailureRun: 30287127087,
    attempt001FailureJob: 90047590976,
    attempt001FailureArtifact: 8661282879,
    attempt001FailureArtifactDigest: 'sha256:5a0eb16b9b89958716a69768b2f579e05b9aa332f9b773a8a70bc9ac06bc66de',
    attempt001FailureCode: 'R3B_R3A_PACKET_REJECTED:R3A_PACKAGE_IDENTITY_MISMATCH',
    attempt002ExecutionHead: '3643efcdabcf2458d21f89490c1f19ba750eb01d',
    attempt002WorkflowRun: 30287795963,
    attempt002WorkflowJob: 90049795407,
    attempt002Artifact: 8661542367,
    attempt002ArtifactDigest: 'sha256:5796ac2b40efa75f07f6b35036b9d353280c427304b45eb988693caa9d9e8497',
    attempt002GpuExecutionStatus: 'PASS',
    attempt002FinalOutputGate: 'FAIL_SCREENSHOT_DIMENSION_ASSERTION',
    successfulExecutionHead: '1fb2bdee01806097f4785cb484c9132574dbdeaf',
    workflowRun: 30288213937,
    workflowJob: 90051195459,
    artifactId: 8661709112,
    artifactDigest: 'sha256:6f48e588064dcd194ce9136fe6d1fcdbdf3d3ef3543bb9700548554f2667e1ef',
    automaticRegistryPreflightRun: 30288214972,
    automaticRegistryPreflight: 'PASS',
    closureControlHead: 'f2b0eca2bdbb10ab0fb6f8dc31a4d926718de420',
    closureControlWorkflowRun: 30288589086,
    closureControlWorkflowJob: 90052432762,
    closureControlArtifact: 8661849421,
    closureControlArtifactDigest: 'sha256:b77802fe2f6c475c955cbf288fe6b6c43e46a5356fb6e9696ed4918cc434153c',
    durablePassReceiptPath: PASS_RECEIPT_PATH,
    durablePassReceiptCommit: '99649ba4982e2676e63f7bced4e0d29fdf622857',
    durablePassReceiptGitBlob: '1a3e1e9113b8e123525bdc924bf9c6ef1b0b1fd5',
    logicalPromotedPackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    webGLContextVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
    gpuBufferCount: 9,
    uploadedByteLength: 2145444,
    geometryDrawCallCount: 4,
    depthVisualizationDrawCallCount: 1,
    drawnIndexCount: 147120,
    fixedVisibleFramePath: 'h-earth.run8e-r3b.fixed-visible-frame.png',
    fixedVisibleFrameWidth: 960,
    fixedVisibleFrameHeight: 540,
    fixedVisibleFrameByteLength: 64059,
    fixedVisibleFrameSha256: '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639',
    diagnosticPageSha256: 'dc7207f8f7268761712e7af699ddd72dc6f160095beab1dd183b6aa0d68d10d9',
    executionReceiptSha256: '9352560f4c756767576550a67a1e66e99690020f56b77bbe856b8a366f7b8d60',
    colorNonClearPixelCount: 492648,
    colorUniqueColorBucketCount: 19,
    colorByteHash: 'fnv1a32:2d6d3436',
    depthNonClearPixelCount: 492648,
    depthUniqueColorBucketCount: 13,
    depthByteHash: 'fnv1a32:4971d411',
    browserExecutionStatus: 'RUN_8E_R3B_EXECUTION_PASS'
  },
  evidenceLimitations: [
    'R3B_ATTEMPT_001_FAILED_AND_PRESERVED',
    'R3B_ATTEMPT_002_GPU_EXECUTION_PASSED_OUTPUT_GATE_FAILED_AND_PRESERVED',
    'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
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
  description: 'Executes the exact immutable R2 package through the R3A camera packet in an isolated WebGL2 diagnostic page with real shaders, four governed draw ranges, color and depth output, readback, inspectable screenshot evidence, and a durable pass-closed receipt.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3B_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3B_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3B_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_BOUNDED_ISOLATED_GPU_FIXED_FRAME_PASS_CLOSED',
  authorityPosture: 'R3B_PASS_CLOSED_UNMERGED_R3_OPEN_AT_R3C_BOUNDARY_RUN_8E_FAIL_OPEN',
  authoritySource: ['R2_PASS_CLOSED_PACKAGE', 'R3A_PASS_CLOSED_CAMERA_PACKET', 'R3B_GITHUB_ACTIONS_BROWSER_EXECUTION', 'R3B_SCREENSHOT_ARTIFACT', 'R3B_DURABLE_PASS_RECEIPT'],
  authorityScope: ['PRESERVE_R3B_REAL_WEBGL2_EXECUTION', 'PRESERVE_FIXED_FRAME_AND_DEPTH_EVIDENCE', 'PRESERVE_FAILURE_ATTEMPT_CUSTODY', 'PRESERVE_R3C_STOPPING_BOUNDARY'],
  authorityLimitations: ['NO_PUBLIC_ROUTE', 'NO_INTERACTION', 'NO_CONTINUOUS_LOOP', 'NO_DEPLOYMENT', 'NO_R3C', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3A_PASS_CLOSED_BEFORE_R3B', 'R3B_PASS_CLOSED_BEFORE_R3C'],
  dependencyRelations: [],
  allowedMutationScope: 'NONE_AFTER_FINAL_EXACT_HEAD_REVALIDATION',
  prohibitedMutations: ['PUBLIC_ROUTE', 'DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'R2_PACKAGE', 'R2D_GPU_ADAPTER', 'CONTINUOUS_LOOP', 'R3C_OR_LATER'],
  requiredValidations: ['FINAL_EXACT_HEAD_REAL_BROWSER_EXECUTION', 'FINAL_SCREENSHOT_ARTIFACT', 'FINAL_COLOR_DEPTH_READBACK', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT', 'FINAL_EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'],
  currentIdentityReferences: ['9560bc1f88800e12408a99a10032e9daf1e56713', '1fb2bdee01806097f4785cb484c9132574dbdeaf', 'f2b0eca2bdbb10ab0fb6f8dc31a4d926718de420', '99649ba4982e2676e63f7bced4e0d29fdf622857', '30288213937', '8661709112', '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639'],
  lifecycleStatus: 'PASS_CLOSED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  unresolvedFields: ['FINAL_EXACT_HEAD_WORKFLOW_RUN']
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
