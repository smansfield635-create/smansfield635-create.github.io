/** Read-only Run 8E-R1 profiling and architecture-disposition registry overlay. */
import baseFacade from './h-earth.repository-registry.run8e-direct-inspection-restoration-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r1-physical-profiling-001';
const BASE_MAIN_HEAD = '9c5e975eee14c38b667660dd328751d4e2a7e2c3';

export const H_EARTH_RUN_8E_R1_PROFILING_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r1-profiling.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r1.physical-profiling-and-architecture-disposition.js',
  '/h-earth-3d/validation/h-earth.run8e-r1.profiler-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r1.harness-click-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r1.profiling.harness.mjs',
  '/showroom/globe/h-earth/diagnostic/run8e-r1/index.html',
  '/showroom/globe/h-earth/diagnostic/run8e-r1/profiler.js',
  '/showroom/globe/h-earth/diagnostic/run8e-r1/candidate-worker.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r1-profiling-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R1_PROFILING_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_RUN_8E_R1_PROFILING_BRANCH',
  occurrenceClass: 'RUN_8E_R1_PROFILING_AND_ARCHITECTURE_DISPOSITION'
})));

export const H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R1_PROFILING_PACKAGE_v1',
  evidenceClass: 'EXECUTABLE_PROFILING_PACKAGE_AND_BOUNDED_ARCHITECTURE_PROBES',
  sourceKind: 'REPOSITORY_DIAGNOSTIC_ROUTE_AND_BROWSER_WORKFLOW',
  sourceIdOrPath: '/showroom/globe/h-earth/diagnostic/run8e-r1/',
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: Object.freeze([
    'CURRENT_CPU_PIPELINE_INSTRUMENTATION',
    'FIVE_FIXED_CAMERA_STATES',
    'CACHED_WORLD_WORKER_CPU_PROBE',
    'CACHED_WORLD_WEBGL_2_PROBE',
    'PHYSICAL_SAMSUNG_POINTER_AND_FRAME_PROFILER',
    'LONG_TASK_AND_LONG_ANIMATION_FRAME_CAPTURE',
    'HEAP_BACKLOG_AND_PREVIEW_TRANSFORM_CAPTURE',
    'NO_RENDERER_REPLACEMENT',
    'NO_CAMERA_OR_NAVIGATION_MUTATION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceMetadata: freeze({
    baseMainHead: BASE_MAIN_HEAD,
    branch: BRANCH,
    publicRouteMutated: false,
    rendererSourceMutated: false,
    cameraAuthorityMutated: false,
    navigationAuthorityMutated: false
  }),
  evidenceLimitations: Object.freeze([
    'PHYSICAL_SAMSUNG_PROFILE_NOT_YET_CAPTURED',
    'R1_PASS_CLOSED_NOT_CLAIMED',
    'WEBGL_2_PROBE_IS_NOT_PRODUCTION_RENDERER',
    'WORKER_CPU_PROBE_IS_NOT_PRODUCTION_RENDERER',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R1_PROFILING_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R1_PROFILING_AND_ARCHITECTURE_DISPOSITION_PACKAGE',
  nodeType: 'RECOVERY_CHECKPOINT_PACKET',
  nodeSubtype: 'RUN_8E_R1_PHYSICAL_PROFILING_AND_LIVE_RENDERER_DISPOSITION',
  displayName: 'H-Earth Run 8E-R1 Physical Profiling and Architecture Disposition',
  description:
    'Profiles the retained Run 8E public-interaction failure and compares bounded current-CPU, worker-CPU, and WebGL 2 presentation candidates without replacing established authorities.',
  repositoryPaths: [...H_EARTH_RUN_8E_R1_PROFILING_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE.evidenceId]),
  authorityClass: 'BOUNDED_PROFILING_AND_ARCHITECTURE_DISPOSITION',
  authorityPosture: 'PHYSICAL_EXECUTION_PENDING',
  authoritySource: Object.freeze([
    'USER_AUTHORIZED_RUN_8E_RECOVERY_PROGRAM',
    'PHYSICAL_SAMSUNG_PUBLIC_INTERACTION_FAILURE_EVIDENCE',
    'RUN_8E_FAIL_OPEN_DISPOSITION'
  ]),
  authorityScope: Object.freeze([
    'PROFILE_CURRENT_PUBLIC_FAILURE_PATH',
    'MEASURE_FIXED_CAMERA_CORPUS',
    'EXECUTE_BOUNDED_WORKER_CPU_PROBE',
    'EXECUTE_BOUNDED_WEBGL_2_PROBE',
    'CAPTURE_PHYSICAL_SAMSUNG_METRICS',
    'ISSUE_LIVE_RENDERER_ARCHITECTURE_DISPOSITION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_RENDERER_REPLACEMENT',
    'NO_TERRAIN_MOUNTAIN_MATERIAL_LIGHT_OR_VEGETATION_MUTATION',
    'NO_CAMERA_RETUNING',
    'NO_NAVIGATION_REPLACEMENT',
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
    'RUN_8E_R0_INCIDENT_FREEZE_BEFORE_RUN_8E_R1',
    'RUN_8E_R1_BEFORE_IMMUTABLE_LIVE_RENDER_PACKAGE_R2'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'DIAGNOSTIC_PROFILING_ROUTE_WORKFLOW_AND_READ_ONLY_REGISTRY_ONLY',
  prohibitedMutations: Object.freeze([
    'PUBLIC_ROUTE_RENDERER_REPLACEMENT',
    'CPU_REFERENCE_RENDERER_REMOVAL',
    'CAMERA_OR_NAVIGATION_AUTHORITY_CHANGE',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'FIVE_CAMERA_CURRENT_CPU_PROFILE',
    'FIVE_CAMERA_WORKER_CPU_PROBE',
    'FIVE_CAMERA_WEBGL_2_PROBE',
    'PHYSICAL_SAMSUNG_PROFILE_RECEIPT',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_RENDERER_REPLACEMENT',
    'STOP_BEFORE_R2_PRODUCT_MUTATION',
    'STOP_BEFORE_R1_PASS_WITHOUT_PHYSICAL_SAMSUNG_RECEIPT'
  ]),
  currentIdentityReferences: Object.freeze([BASE_MAIN_HEAD, BRANCH]),
  lifecycleStatus: 'EXECUTABLE_PROFILING_PACKAGE_PHYSICAL_OCCURRENCE_PENDING',
  unresolvedFields: Object.freeze([
    'FINAL_PROFILING_BRANCH_HEAD',
    'ARCHITECTURE_PROBE_ARTIFACT_IDENTITY',
    'PHYSICAL_SAMSUNG_RECEIPT_IDENTITY',
    'R1_FINAL_DISPOSITION'
  ])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R1_PROFILING_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R1_PROFILING_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R1_PROFILING_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R1_PROFILING_NODE.nodeId
    ? H_EARTH_RUN_8E_R1_PROFILING_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R1_PROFILING_EVIDENCE
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R1_PROFILING_NODE.nodeId, node: H_EARTH_RUN_8E_R1_PROFILING_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R1_PROFILING_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R1_PROFILING_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R1_PROFILING_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R1_PROFILING_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R1_PROFILING_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R1_PROFILING_FACADE;
