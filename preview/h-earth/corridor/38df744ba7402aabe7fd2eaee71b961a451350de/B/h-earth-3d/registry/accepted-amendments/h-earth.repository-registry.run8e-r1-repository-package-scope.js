/** Read-only Run 8E-R1 executed repository profiling package overlay. */
import baseFacade from './h-earth.repository-registry.run8e-r1-profiling-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r1-physical-profiling-001';
const VALIDATED_HEAD = 'db38b89bda29bde41a5874d94e2ab5c80d49ff7c';
const RECEIPT_PATH = '/h-earth-3d/validation/h-earth.run8e-r1.repository-profiling-package.receipt.json';
const RECEIPT_GIT_BLOB = '7108503ebd05807f0001cf50636aa3c806d3635d';

export const H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_PATHS = Object.freeze([
  RECEIPT_PATH,
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r1-repository-package-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: VALIDATED_HEAD,
  path: repositoryPath,
  gitBlobSha: repositoryPath === RECEIPT_PATH ? RECEIPT_GIT_BLOB : null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_AFTER_RUN_8E_R1_REPOSITORY_PACKAGE_EXECUTION',
  occurrenceClass: 'RUN_8E_R1_EXECUTED_REPOSITORY_PROFILING_PACKAGE'
})));

export const H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R1_REPOSITORY_PROFILING_PACKAGE_EXECUTION_v1',
  evidenceClass: 'EXECUTED_FIXED_CAMERA_CPU_WORKER_WEBGL2_AND_SAMSUNG_EMULATION_PROFILE',
  sourceKind: 'GITHUB_ACTIONS_BROWSER_EXECUTION_AND_DURABLE_RECEIPT',
  sourceIdOrPath: RECEIPT_PATH,
  sourceOccurrenceOrRevision: VALIDATED_HEAD,
  assertionScope: Object.freeze([
    'FIVE_CAMERA_CURRENT_CPU_PROFILE_PASS',
    'FIVE_CAMERA_CACHED_WORKER_CPU_PROBE_PASS',
    'FIVE_CAMERA_WEBGL_2_PROBE_PASS',
    'CURRENT_CPU_WORLD_REBUILD_COST_QUANTIFIED',
    'FLAT_BITMAP_PREVIEW_AND_STALE_RENDER_STATE_QUANTIFIED',
    'WEBGL_2_PRIMARY_LIVE_RENDERER_CANDIDATE_CONFIRMED',
    'CPU_REFERENCE_RENDERER_PRESERVED',
    'PHYSICAL_SAMSUNG_RECEIPT_STILL_REQUIRED'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    branch: BRANCH,
    validatedHead: VALIDATED_HEAD,
    durableReceiptGitBlob: RECEIPT_GIT_BLOB,
    validationRun: 30228676176,
    validationJob: 89863366514,
    evidenceArtifact: 8639446224,
    evidenceArtifactDigest:
      'sha256:318d85a619b75b49a4da939e721d0dbd4fba81465342ccf35222fb706193c287',
    fixedCameraStateCount: 5,
    admittedPrimitiveCount: 35,
    currentCpuFullFrameMaximumMilliseconds: 5899.7,
    workerCpuMaximumMilliseconds: 24.4,
    webgl2ProbeAvailable: true,
    emulatedLongestMainThreadTaskMilliseconds: 10972
  }),
  evidenceLimitations: Object.freeze([
    'CI_WEBGL_2_TIMING_IS_NOT_PHYSICAL_SAMSUNG_GPU_PERFORMANCE',
    'SAMSUNG_EMULATION_IS_SUPPORTING_ONLY',
    'PHYSICAL_SAMSUNG_PROFILE_NOT_YET_CAPTURED',
    'RUN_8E_R1_PASS_CLOSED_NOT_CLAIMED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R1_EXECUTED_REPOSITORY_PROFILING_PACKAGE',
  nodeType: 'EXECUTED_RECOVERY_EVIDENCE_PACKET',
  nodeSubtype: 'RUN_8E_R1_REPOSITORY_PROFILING_PACKAGE_PASS_PHYSICAL_PENDING',
  displayName: 'H-Earth Run 8E-R1 Executed Repository Profiling Package',
  description:
    'Binds the executed fixed-camera CPU, worker CPU, WebGL 2, and Samsung-emulation evidence while preserving the physical-Samsung closure boundary.',
  repositoryPaths: [...H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE.evidenceId]),
  authorityClass: 'EXECUTED_PROFILING_AND_ARCHITECTURE_DISPOSITION_EVIDENCE',
  authorityPosture: 'REPOSITORY_PACKAGE_PASS_PHYSICAL_SAMSUNG_PENDING',
  authoritySource: Object.freeze([
    'RUN_8E_R1_CONTROL_CONTRACT',
    'EXECUTED_GITHUB_ACTIONS_PROFILING_WORKFLOW',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  authorityScope: Object.freeze([
    'PRESERVE_CPU_REFERENCE_RENDERER',
    'SELECT_WEBGL_2_AS_PRIMARY_LIVE_RENDERER_CANDIDATE',
    'RETAIN_WORKER_CPU_AS_FALLBACK_OR_DIAGNOSTIC_OPTION',
    'DEPLOY_PHYSICAL_SAMSUNG_PROFILER_ROUTE'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PHYSICAL_SAMSUNG_PERFORMANCE_CLAIM',
    'NO_PRODUCTION_WEBGL_2_RENDERER_ESTABLISHED',
    'NO_RUN_8E_R1_PASS_CLOSED',
    'NO_RUN_8E_PASS_CLOSED'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'RUN_8E_R1_EXECUTABLE_PROFILER_BEFORE_REPOSITORY_PACKAGE_RECEIPT',
    'REPOSITORY_PACKAGE_RECEIPT_BEFORE_PHYSICAL_SAMSUNG_PROFILE'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'DURABLE_R1_EVIDENCE_AND_PROFILER_DEPLOYMENT_ONLY',
  prohibitedMutations: Object.freeze([
    'PUBLIC_RENDERER_REPLACEMENT',
    'CAMERA_OR_NAVIGATION_MUTATION',
    'RUN_8E_R1_PASS_CLOSED_WITHOUT_PHYSICAL_RECEIPT'
  ]),
  requiredValidations: Object.freeze([
    'RUN_8E_R1_REPOSITORY_PROFILING_WORKFLOW',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT',
    'POST_MERGE_PROFILER_ROUTE_DEPLOYMENT',
    'PHYSICAL_SAMSUNG_PROFILE_CAPTURE'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_R2_PRODUCT_MUTATION',
    'STOP_BEFORE_PHYSICAL_SAMSUNG_PASS_CLAIM'
  ]),
  currentIdentityReferences: Object.freeze([
    VALIDATED_HEAD,
    RECEIPT_GIT_BLOB,
    '30228676176',
    '8639446224'
  ]),
  lifecycleStatus: 'REPOSITORY_PACKAGE_PASS_PHYSICAL_PROFILE_PENDING',
  unresolvedFields: Object.freeze([
    'FINAL_R1_BRANCH_HEAD_AFTER_EVIDENCE_RECONCILIATION',
    'MERGE_COMMIT',
    'DEPLOYED_PROFILER_MAIN_HEAD',
    'PHYSICAL_SAMSUNG_PROFILE_RECEIPT',
    'R1_FINAL_DISPOSITION'
  ])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE.nodeId
    ? H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE.nodeId, node: H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R1_REPOSITORY_PACKAGE_FACADE;
