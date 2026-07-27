/** Read-only accepted-amendment facade for Run 8E R3F1 physical/mobile acceptance protocol authority. */
import baseFacade from './h-earth.repository-registry.run8e-r3e5-r3e-closure-r3f-input-decision.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f1-physical-mobile-acceptance-protocol-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3F1_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3f1-physical-mobile-acceptance-protocol.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f1.physical-mobile-acceptance-protocol.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f.physical-mobile-evidence-contract.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f1-physical-mobile-acceptance-protocol.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f1.physical-mobile-acceptance-protocol.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3F1_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: 'R3F1_PROTOCOL_EXECUTION_PENDING',
  occurrenceClass: 'RUN_8E_R3F1_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_EXECUTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F1_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_v1',
  evidenceClass: 'R3F1_PROTOCOL_AND_EVIDENCE_INTAKE_AUTHORITY_EXECUTION_PENDING',
  sourceKind: 'REPOSITORY_PROTOCOL_AND_VALIDATION_EXECUTION',
  sourceIdOrPath: '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f.physical-mobile-evidence-contract.js',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'R3E5_PASS_CLOSED_INPUT',
    'R3F_FOUR_STAGE_SEQUENCE',
    'IMMUTABLE_NON_PRODUCTION_PREVIEW_LAW',
    'PHYSICAL_EVIDENCE_CLASSIFICATION',
    'REFERENCE_SAMSUNG_DEVICE_ONLY',
    'SECOND_ANDROID_PHYSICAL_LANE',
    'IOS_MOBILE_SAFARI_PHYSICAL_LANE',
    'LOWER_PERFORMANCE_MOBILE_LANE',
    'DEVICE_NEUTRAL_IMPLEMENTATION_LAW',
    'NO_PHYSICAL_EXECUTION_IN_R3F1',
    'STOP_BEFORE_R3F2'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: '548672ae99cd406805f0c8ca576cc650baf7ed18',
    predecessorPullRequest: 249,
    predecessorPassReceiptGitBlob: 'ddd7fbf4065abbfb51e222c3500328b5b7aaab00',
    predecessorFinalArtifactDigest: 'sha256:86dd2af17cdd0e477f7edd6aeef37263283cbf69f49cf705278c00195d98685e',
    r3FSubcheckpointCount: 4,
    deviceLaneCount: 4,
    requiredSessionRecordFieldCount: 22,
    coreWorkflowRun: null,
    coreWorkflowJob: null,
    coreArtifactId: null,
    coreArtifactDigest: null
  }),
  evidenceLimitations: freeze([
    'CORE_EXECUTION_PENDING',
    'NO_IMMUTABLE_PREVIEW_CREATED',
    'NO_REFERENCE_DEVICE_EXECUTION',
    'NO_BROADER_MOBILE_EXECUTION',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'NO_DEPLOYMENT',
    'NO_PROMOTION',
    'NO_MAIN_MERGE',
    'R3F2_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F1_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F1_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL',
  nodeType: 'RECOVERY_ACCEPTANCE_PROTOCOL_CHECKPOINT',
  nodeSubtype: 'PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_EVIDENCE_INTAKE_AUTHORITY',
  displayName: 'H-Earth Run 8E R3F1 Physical and Broader-Mobile Acceptance Protocol',
  description: 'Defines the immutable-preview, physical-evidence, device-lane, interaction, timing, capture, and claim laws required before R3F physical execution begins.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F1_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3F1_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F1_EVIDENCE.evidenceId],
  authorityClass: 'R3F_PHYSICAL_MOBILE_ACCEPTANCE_PROTOCOL_EXECUTION_PENDING',
  authorityPosture: 'R3E_PASS_CLOSED_R3F1_EXECUTION_PENDING_R3F2_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3E5_PASS_RECEIPT', 'R3E5_FINAL_EXACT_HEAD_VALIDATION', 'R3F_INPUT_DECISION'],
  authorityScope: ['DEFINE_R3F_SEQUENCE', 'DEFINE_PHYSICAL_EVIDENCE_CONTRACT', 'DEFINE_PREVIEW_TRANSPORT_LAW', 'DEFINE_CLAIM_BOUNDARIES'],
  authorityLimitations: ['NO_SHOWROOM_MUTATION','NO_PREVIEW_CREATION','NO_BROWSER_OR_GPU_EXECUTION','NO_PHYSICAL_DEVICE_EXECUTION','NO_R3F2','NO_DEPLOYMENT','NO_MAIN_MERGE','NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3E5_PASS_CLOSED_BEFORE_R3F1', 'R3F1_PASS_CLOSED_BEFORE_R3F2'],
  dependencyRelations: [],
  allowedMutationScope: 'R3F1_CONTROL_PROTOCOL_REGISTRY_VALIDATION_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['SHOWROOM','PUBLIC_ROUTE','PUBLIC_RUNTIME','RENDERER','INPUT','PHYSICAL_EXECUTION','R3F2','DEPLOYMENT','MAIN'],
  requiredValidations: ['R3E5_RECEIPT_IDENTITY','R3F_INPUT_DECISION','EVIDENCE_CONTRACT','R3F_SEQUENCE','AUTOMATIC_REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_REFERENCE_DEVICE_IMMUTABLE_PREVIEW_AND_PHYSICAL_EXECUTION_R3F2'],
  currentIdentityReferences: ['548672ae99cd406805f0c8ca576cc650baf7ed18','ddd7fbf4065abbfb51e222c3500328b5b7aaab00','f923fa8127c56b1304717e86cfbc44e746d80cc8'],
  lifecycleStatus: 'EXECUTION_PENDING',
  unresolvedFields: ['CORE_WORKFLOW_RUN','CORE_ARTIFACT','DURABLE_PASS_RECEIPT','FINAL_EXACT_HEAD_VALIDATION']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F1_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F1_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F1_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F1_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F1_NODE.nodeId ? H_EARTH_RUN_8E_R3F1_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F1_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3F1_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F1_NODE.nodeId, node: H_EARTH_RUN_8E_R3F1_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F1_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F1_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F1_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3F1_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F1_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F1_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F1_FACADE;
