/** Read-only accepted-amendment facade for Run 8E R3F2 immutable preview and reference-device evidence intake. */
import baseFacade from './h-earth.repository-registry.run8e-r3f1-physical-mobile-acceptance-protocol.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f2-reference-device-physical-execution-001';
const PREVIEW_READY_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.preview-ready.receipt.json';

export const H_EARTH_RUN_8E_R3F2_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3f2-reference-device-preview.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2.reference-device-immutable-preview-and-physical-execution.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-reference-device-preview.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f2.reference-device-preview.validation.mjs',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html',
  '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.js',
  PREVIEW_READY_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3F2_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PREVIEW_READY_RECEIPT_PATH ? 'RESERVED_UNTIL_PREVIEW_READY' : 'PRESENT',
  fetchbackStatus: 'R3F2_PREVIEW_VALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3F2_IMMUTABLE_PREVIEW_CONSTRUCTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F2_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F2_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_v1',
  evidenceClass: 'R3F2_IMMUTABLE_PREVIEW_CONSTRUCTION_AND_VALIDATION_PENDING',
  sourceKind: 'COMMIT_PINNED_HOSTED_PREVIEW_AND_REPOSITORY_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'R3F1_PASS_CLOSED_INPUT',
    'COMMIT_PINNED_H_EARTH_ROUTE',
    'SAME_ORIGIN_EVIDENCE_LAUNCHER',
    'REFERENCE_ANDROID_PHYSICAL_LANE',
    'TEN_MINUTE_CONTINUOUS_SESSION',
    'PORTRAIT_AND_LANDSCAPE',
    'ORIENTATION_TRANSITION',
    'BACKGROUND_RETURN',
    'SCREEN_RECORDING_AND_SCREENSHOTS',
    'RAW_INSTRUMENTED_TRACE',
    'NO_PRODUCTION_DEPLOYMENT',
    'STOP_BEFORE_PHYSICAL_EXECUTION'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: '3642f3a561d787d37d988a8a66f2270d0b13bd45',
    predecessorPullRequest: 250,
    predecessorPassReceiptGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60',
    routeSourceHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    previewPackageHead: null,
    launcherUrl: null,
    packageDescriptorSha256: null,
    workflowRun: null,
    workflowJob: null,
    artifactId: null,
    artifactDigest: null
  }),
  evidenceLimitations: freeze([
    'PREVIEW_VALIDATION_PENDING',
    'PHYSICAL_REFERENCE_DEVICE_EXECUTION_NOT_PERFORMED',
    'R3F2_NOT_PASS_CLOSED',
    'NO_BROADER_MOBILE_EXECUTION',
    'NO_PRODUCTION_DEPLOYMENT',
    'NO_PROMOTION',
    'NO_MAIN_MERGE',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F2_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F2_REFERENCE_DEVICE_IMMUTABLE_PREVIEW',
  nodeType: 'RECOVERY_PHYSICAL_ACCEPTANCE_EXECUTION_CHECKPOINT',
  nodeSubtype: 'IMMUTABLE_HOSTED_PREVIEW_AND_REFERENCE_ANDROID_EVIDENCE_INTAKE',
  displayName: 'H-Earth Run 8E R3F2 Reference-Device Immutable Preview',
  description: 'Constructs and validates a commit-pinned, non-production H-Earth preview and a same-origin evidence launcher before any physical reference-device acceptance claim.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F2_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3F2_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F2_EVIDENCE.evidenceId],
  authorityClass: 'R3F2_IMMUTABLE_PREVIEW_CONSTRUCTION_PENDING',
  authorityPosture: 'R3F1_PASS_CLOSED_R3F2_PREVIEW_CONSTRUCTION_PENDING_PHYSICAL_EXECUTION_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3F1_PASS_RECEIPT', 'R3F1_FINAL_EXACT_HEAD_VALIDATION', 'R3F_PHYSICAL_EVIDENCE_CONTRACT'],
  authorityScope: ['CONSTRUCT_IMMUTABLE_HOSTED_PREVIEW', 'VALIDATE_COMMIT_PINNED_ROUTE', 'INSTALL_REFERENCE_DEVICE_EVIDENCE_LAUNCHER'],
  authorityLimitations: ['NO_SHOWROOM_MUTATION','NO_PUBLIC_ROUTE_MUTATION','NO_PHYSICAL_ACCEPTANCE_CLAIM','NO_BROADER_MOBILE_ACCEPTANCE','NO_PRODUCTION_DEPLOYMENT','NO_MAIN_MERGE','NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3F1_PASS_CLOSED_BEFORE_R3F2', 'PREVIEW_READY_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION'],
  dependencyRelations: [],
  allowedMutationScope: 'R3F2_CONTROL_PREVIEW_LAUNCHER_REGISTRY_VALIDATION_AND_PREVIEW_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['SHOWROOM','PUBLIC_ROUTE','PUBLIC_RUNTIME','RENDERER','INPUT','PRODUCTION_DEPLOYMENT','MAIN'],
  requiredValidations: ['R3F1_RECEIPT_IDENTITY','HOSTED_ROUTE_HTTP','HOSTED_LAUNCHER_HTTP','ROUTE_API_READY','SAME_ORIGIN_ACCESS','INSTRUMENTATION_READY','AUTOMATIC_REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2'],
  currentIdentityReferences: ['3642f3a561d787d37d988a8a66f2270d0b13bd45','d8b5f3b4626014af6b62362d1bac26e120f50e60','548672ae99cd406805f0c8ca576cc650baf7ed18','0daedf61f7e19af095f4db5fc47563a9cd786837','2b0a916b3a6d11da84316925f8abd8a3a1447445'],
  lifecycleStatus: 'PREVIEW_CONSTRUCTION_PENDING',
  unresolvedFields: ['PREVIEW_PACKAGE_HEAD','HOSTED_PREVIEW_VALIDATION','PREVIEW_READY_RECEIPT','PHYSICAL_REFERENCE_DEVICE_EVIDENCE']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F2_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F2_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F2_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F2_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F2_NODE.nodeId ? H_EARTH_RUN_8E_R3F2_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F2_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3F2_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false }) : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F2_NODE.nodeId, node: H_EARTH_RUN_8E_R3F2_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F2_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F2_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F2_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3F2_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F2_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F2_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F2_FACADE;
