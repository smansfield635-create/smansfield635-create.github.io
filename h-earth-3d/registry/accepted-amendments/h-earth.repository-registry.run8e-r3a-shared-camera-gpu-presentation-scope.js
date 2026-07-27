/** Read-only accepted-amendment facade for Run 8E R3A contract and uniform-packet custody. */
import baseFacade from './h-earth.repository-registry.run8e-r2f-closure-promotion-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3a-live-renderer-contract-001';
export const H_EARTH_RUN_8E_R3A_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r3a-live-renderer-contract.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3a.shared-camera-gpu-presentation.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3a-shared-camera-gpu-presentation-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3a.shared-camera-gpu-presentation.validation.mjs',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3a.pass-closed.receipt.json',
  '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R3A_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT_OR_RESERVED',
  fetchbackStatus: 'R3A_EXECUTION_AND_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3A_CONTRACT_AND_EXECUTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3A_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_v1',
  evidenceClass: 'R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_AND_UNIFORM_PACKET_CANDIDATE',
  sourceKind: 'REPOSITORY_SOURCE_AND_EXECUTABLE_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8e-r3a.shared-camera-gpu-presentation.validation.mjs',
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: Object.freeze([
    'R2_INPUT_PASS_CLOSED_AND_APPROVED',
    'SHARED_NAVIGATION_STATE_CONSUMED_WITHOUT_MUTATION',
    'SUCCESSOR_TERRAIN_CAMERA_RECONCILIATION_PRESERVED',
    'DETERMINISTIC_VIEW_PROJECTION_UNIFORM_PACKET',
    'EXACT_R2_PACKAGE_AND_CANONICAL_GPU_TRANSPORT_PRESERVED',
    'NO_WEBGL_CONTEXT_SHADER_PROGRAM_RENDER_LOOP_OR_VISIBLE_PRESENTATION',
    'STOP_BEFORE_R3B'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    branch: BRANCH,
    baseHead: '02aa90591a34968c8b6bacba926a156293ad0f76',
    predecessorPullRequest: 225,
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91'
  }),
  evidenceLimitations: Object.freeze([
    'R3A_EXECUTION_PENDING',
    'NO_GPU_FIXED_FRAME_EXECUTION',
    'NO_PUBLIC_ROUTE_BINDING',
    'NO_MOBILE_ACCEPTANCE',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3A_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT',
  nodeType: 'RECOVERY_ENGINEERING_CONTRACT',
  nodeSubtype: 'R3A_SHARED_CAMERA_GPU_PRESENTATION_AND_UNIFORM_PACKET',
  displayName: 'H-Earth Run 8E R3A Shared-Camera GPU Presentation Contract',
  description: 'Defines deterministic camera and environment uniforms over the immutable R2 package without creating WebGL execution or public presentation.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3A_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3A_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R3A_EVIDENCE.evidenceId]),
  authorityClass: 'BOUNDED_R3A_ENGINEERING_CONTRACT_AND_EXECUTION_CUSTODY',
  authorityPosture: 'R3A_EXECUTION_PENDING_R3B_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: Object.freeze(['R2F_PASS_CLOSED', 'R2_R3_INPUT_PROMOTION', 'EXACT_REPOSITORY_SOURCES']),
  authorityScope: Object.freeze(['R3A_CONTRACT', 'CAMERA_UNIFORM_PACKET', 'RENDERER_INTERFACE_DESCRIPTOR', 'EXECUTABLE_VALIDATION']),
  authorityLimitations: Object.freeze(['NO_WEBGL_CONTEXT', 'NO_SHADER_OR_PROGRAM', 'NO_RENDER_LOOP', 'NO_PUBLIC_ROUTE', 'NO_VISIBLE_PRESENTATION', 'NO_R3B_OR_LATER_AUTHORITY', 'NO_RUN_8E_PASS_AUTHORITY']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2F_BEFORE_R3A', 'R3A_PASS_CLOSED_BEFORE_R3B']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'EIGHT_EXACT_R3A_PATHS_ONLY',
  prohibitedMutations: Object.freeze(['R2_PACKAGE_OR_GPU_ADAPTER_MUTATION', 'NAVIGATION_OR_CAMERA_AUTHORITY_MUTATION', 'PUBLIC_ROUTE_OR_DIRECT_MANIPULATION_MUTATION', 'WEBGL_EXECUTION', 'VISIBLE_PRESENTATION', 'R3B_OR_LATER_WORK', 'RUN_8E_PASS_CLOSED']),
  requiredValidations: Object.freeze(['R3A_EXECUTABLE_AUDIT', 'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT', 'FINAL_EXACT_HEAD_REVALIDATION']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B']),
  currentIdentityReferences: Object.freeze(['02aa90591a34968c8b6bacba926a156293ad0f76', BRANCH]),
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: Object.freeze(['EXECUTION_HEAD', 'WORKFLOW_RUN', 'DURABLE_PASS_RECEIPT', 'FINAL_EXACT_HEAD'])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3A_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3A_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3A_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3A_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R3A_NODE.nodeId ? H_EARTH_RUN_8E_R3A_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R3A_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3A_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);

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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3A_NODE.nodeId, node: H_EARTH_RUN_8E_R3A_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3A_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R3A_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R3A_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3A_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3A_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R3A_FACADE;
