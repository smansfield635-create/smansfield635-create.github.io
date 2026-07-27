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
const PASS_RECEIPT_GIT_BLOB = '0ea8f618f597aef527655f28951d9cf4e9629485';

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
  gitBlobSha: repositoryPath === PASS_RECEIPT_PATH ? PASS_RECEIPT_GIT_BLOB : null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R3D1_DURABLE_PASS_RECEIPT_PRESENT_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_PASS_CLOSED_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3D1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_v1',
  evidenceClass: 'EXECUTED_R3D1_DIAGNOSTIC_HOST_SCAFFOLD_WITH_DURABLE_PASS_CLOSED_RECEIPT',
  sourceKind: 'GITHUB_ACTIONS_STATIC_PATH_MODULE_HTTP_RESOLUTION_REGISTRY_PREFLIGHT_ARTIFACT_AND_REPOSITORY_PASS_RECEIPT',
  sourceIdOrPath: PASS_RECEIPT_PATH,
  sourceOccurrenceOrRevision: '7cff5f1800c6e0743a44ac41ed501bf0c266dc61',
  assertionScope: [
    'DIAGNOSTIC_DIRECTORY_CREATED',
    'HTML_HOST_CREATED',
    'HOST_MODULE_CREATED',
    'POINTER_TOUCH_PLACEHOLDER_CREATED',
    'LIVE_GPU_BINDING_PLACEHOLDER_CREATED',
    'RELATIVE_MODULE_PATHS_RESOLVE',
    'STATIC_HTTP_PATHS_RESOLVE',
    'ELEVEN_REGISTRY_PATHS_RESOLVE',
    'NO_INTERACTION_OR_RENDERER_EXECUTION',
    'R3D1_PASS_CLOSED',
    'R3_OPEN_AT_R3D2_BOUNDARY',
    'STOP_BEFORE_R3D2'
  ],
  verifiedOn: '2026-07-27',
  evidenceMetadata: {
    baseExactHead: '5c7a7eef489da94a230812eecc5e531e285b7cac',
    pullRequest: 234,
    predecessorPullRequest: 231,
    successfulExecutionHead: '7cff5f1800c6e0743a44ac41ed501bf0c266dc61',
    workflowRun: 30294915207,
    workflowJob: 90073456239,
    artifactId: 8664228635,
    artifactDigest: 'sha256:c650f1f3c391079f7cfaf564ea447687cf7afdc798e515a9e3fdb9d9e25f23fc',
    automaticRegistryPreflightRun: 30294915184,
    automaticRegistryPreflight: 'PASS',
    closureControlHead: '4cd531c0aa70b5734ebfe9de3a5a3d19f412c47f',
    closureControlWorkflowRun: 30295173564,
    closureControlWorkflowJob: 90074288203,
    closureControlArtifact: 8664324405,
    closureControlArtifactDigest: 'sha256:2a3ecc69d57bca8a7ede67b9ec0235bb4b705b2e5fc4a6bdca01e5fce2ab79bb',
    closureControlAutomaticRegistryPreflightRun: 30295175507,
    closureControlAutomaticRegistryPreflight: 'PASS',
    durablePassReceiptPath: PASS_RECEIPT_PATH,
    durablePassReceiptCommit: '349586844e2343c644ed95ccf56466dc5d3e59f3',
    durablePassReceiptGitBlob: PASS_RECEIPT_GIT_BLOB,
    diagnosticPathCount: 4,
    registeredPathCount: 11,
    staticHttpPathCount: 4,
    executionBoundaryViolationCount: 0,
    protectedPersistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    protectedNavigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    protectedPublicRouteGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    protectedPublicDirectManipulationGitBlob: '322ee2bfed5184acd8eac600f19abd72380b6c2b'
  },
  evidenceLimitations: [
    'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
    'FINAL_EXACT_HEAD_VALIDATION_NOT_EMBEDDED_IN_PASS_RECEIPT',
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
  authorityClass: 'EXECUTED_BOUNDED_DIAGNOSTIC_HOST_SCAFFOLD_PASS_CLOSED',
  authorityPosture: 'R3D1_PASS_CLOSED_UNMERGED_R3_OPEN_AT_R3D2_BOUNDARY_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3C_PASS_CLOSED_PERSISTENT_RENDERER', 'R3D_BOUNDED_SUBCHECKPOINT_DECOMPOSITION', 'R3D1_GITHUB_ACTIONS_STATIC_VALIDATION', 'R3D1_DURABLE_PASS_RECEIPT'],
  authorityScope: ['PRESERVE_DIAGNOSTIC_DIRECTORY', 'PRESERVE_HTML_HOST', 'PRESERVE_NONEXECUTING_PLACEHOLDERS', 'PRESERVE_PATH_RESOLUTION_EVIDENCE', 'PRESERVE_R3D2_STOPPING_BOUNDARY'],
  authorityLimitations: ['NO_INTERACTION', 'NO_RENDERER_EXECUTION', 'NO_PUBLIC_ROUTE', 'NO_DEPLOYMENT', 'NO_R3D2', 'NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3C_PASS_CLOSED_BEFORE_R3D1', 'R3D1_PASS_CLOSED_BEFORE_R3D2'],
  dependencyRelations: [],
  allowedMutationScope: 'NONE_AFTER_FINAL_EXACT_HEAD_REVALIDATION',
  prohibitedMutations: ['PUBLIC_ROUTE', 'PUBLIC_DIRECT_MANIPULATION', 'NAVIGATION_AUTHORITY', 'PERSISTENT_RENDERER', 'INTERACTION_BINDING', 'R3D2_OR_LATER'],
  requiredValidations: ['FINAL_EXACT_HEAD_STATIC_VALIDATION', 'FINAL_MODULE_AND_HTTP_RESOLUTION', 'FINAL_AUTOMATIC_REGISTRY_PREFLIGHT', 'FINAL_EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_POINTER_AND_TOUCH_INTAKE_R3D2'],
  currentIdentityReferences: ['5c7a7eef489da94a230812eecc5e531e285b7cac', '7cff5f1800c6e0743a44ac41ed501bf0c266dc61', '4cd531c0aa70b5734ebfe9de3a5a3d19f412c47f', '349586844e2343c644ed95ccf56466dc5d3e59f3', '30294915207', '8664228635', PASS_RECEIPT_GIT_BLOB],
  lifecycleStatus: 'PASS_CLOSED_FINAL_EXACT_HEAD_REVALIDATION_PENDING',
  unresolvedFields: ['FINAL_EXACT_HEAD_WORKFLOW_RUN']
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
