/** Read-only accepted-amendment facade for Run 8E R3E5 R3E closure and R3F input decision. */
import baseFacade from './h-earth.repository-registry.run8e-r3e4-public-direct-manipulation-acceptance.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e5-r3e-closure-r3f-input-decision-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e5.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3E5_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3e5-r3e-closure-r3f-input-decision.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e5.r3e-closure-r3f-input-decision.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f.input-decision.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e5-r3e-closure-r3f-input-decision.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e5.r3e-closure-r3f-input-decision.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3E5_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: repositoryPath === PASS_RECEIPT_PATH ? 'R3E5_DURABLE_PASS_RECEIPT_PENDING' : 'R3E5_CORE_EXECUTION_ARTIFACT_FETCHED_BACK',
  occurrenceClass: 'RUN_8E_R3E5_R3E_CLOSURE_R3F_INPUT_DECISION_CORE_PASS_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E5_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E5_R3E_CLOSURE_R3F_INPUT_DECISION_v1',
  evidenceClass: 'EXECUTED_R3E5_R3E_CLOSURE_AND_R3F_INPUT_DECISION_CORE_PASS_DURABLE_RECEIPT_PENDING',
  sourceKind: 'GITHUB_ACTIONS_REPOSITORY_CONTROL_AND_RECEIPT_RECONCILIATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e5.r3e-closure-r3f-input-decision.js',
  sourceOccurrenceOrRevision: 'a15b0bfd5e0e41feb58278ead324af25cb895b79',
  assertionScope: freeze([
    'R3E1_R3E4_PASS_RECEIPTS',
    'R3E_FIVE_SUBCHECKPOINT_CLOSURE',
    'R3E_PASS_CLOSED',
    'R3_OPEN_AT_R3F_BOUNDARY',
    'R3F_INPUT_DISPOSITION',
    'REFERENCE_DEVICE_EVIDENCE_ONLY',
    'ALL_SUPPORTED_MOBILE_DEVICES_PRODUCT_TARGET',
    'NO_SAMSUNG_ONLY_IMPLEMENTATION',
    'NO_R3F_EXECUTION',
    'RUN_8E_FAIL_OPEN',
    'STOP_BEFORE_R3F'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    baseExactHead: '6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3',
    predecessorPullRequest: 248,
    r3E1PassReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5',
    r3E2PassReceiptGitBlob: 'e33405c5e7f600e59a6b1103fd856a1d37ca51c5',
    r3E3PassReceiptGitBlob: '5c5f1ae06220f88f497dc2b45f4d749679849918',
    r3E4PassReceiptGitBlob: '7b2db7ed51a345edea88ad8a1288db4db150201d',
    r3E4FinalWorkflowRun: 30311974503,
    r3E4FinalArtifactDigest: 'sha256:30e379f603867ff36162d7332812e0bacd8a7e35b31c4d67b04e4d17e277e157',
    admittedR3FInputCount: 11,
    coreHead: 'a15b0bfd5e0e41feb58278ead324af25cb895b79',
    coreWorkflowRun: 30313213795,
    coreWorkflowJob: 90133161723,
    coreArtifactId: 8671168282,
    coreArtifactDigest: 'sha256:15556602decf44f2af92aabdc91f4677bbe25f863cf7bc8cb1be0372c34f47f3',
    coreArtifactFetchBackVerified: true,
    coreAutomaticRepositoryRegistryPreflightRun: 30313213810,
    coreAutomaticRepositoryRegistryPreflightStatus: 'PASS',
    predecessorReceiptCount: 4,
    predecessorPassClosedCount: 4,
    unresolvedPredecessorCount: 0,
    r3ESubcheckpointCount: 5,
    resultingR3EStatus: 'PASS_CLOSED',
    resultingR3State: 'OPEN_AT_R3F_BOUNDARY',
    resultingR3FStatus: 'NOT_STARTED',
    resultingRun8EStatus: 'FAIL_OPEN',
    showroomMutationCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0,
    physicalDeviceExecutionCount: 0
  }),
  evidenceLimitations: freeze([
    'RECEIPT_FREE_CLOSURE_CONTROL_PENDING',
    'DURABLE_R3E5_PASS_RECEIPT_PENDING',
    'FINAL_EXACT_HEAD_REVALIDATION_PENDING',
    'NO_R3F_EXECUTION',
    'NO_PHYSICAL_DEVICE_ACCEPTANCE',
    'NO_BROADER_MOBILE_ACCEPTANCE',
    'NO_DEPLOYMENT',
    'NO_PROMOTION',
    'NO_MAIN_MERGE',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3E5_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E5_R3E_CLOSURE_R3F_INPUT_DECISION',
  nodeType: 'RECOVERY_CLOSURE_AND_INPUT_DECISION_CHECKPOINT',
  nodeSubtype: 'R3E_PROGRAM_CLOSURE_AND_PHYSICAL_MOBILE_ACCEPTANCE_INPUT_DISPOSITION',
  displayName: 'H-Earth Run 8E R3E5 R3E Closure and R3F Input Decision',
  description: 'Reconciles R3E1 through R3E4, closes R3E, and issues the bounded input disposition for a separate R3F physical-reference-device and broader-mobile acceptance checkpoint.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E5_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E5_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E5_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_R3E_CLOSURE_AND_R3F_INPUT_DECISION_CORE_PASS',
  authorityPosture: 'R3E5_CORE_EXECUTION_PASS_RECEIPT_PENDING_R3E_PASS_CLOSED_R3_OPEN_AT_R3F_BOUNDARY_R3F_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3E1_PASS_RECEIPT','R3E2_PASS_RECEIPT','R3E3_PASS_RECEIPT','R3E4_PASS_RECEIPT','R3E4_FINAL_EXACT_HEAD_VALIDATION','R3E5_CORE_EXECUTION','R3E5_FETCHED_BACK_ARTIFACT'],
  authorityScope: ['RECONCILE_R3E', 'CLOSE_R3E', 'ISSUE_R3F_INPUT_DECISION', 'PRESERVE_BOUNDARIES'],
  authorityLimitations: ['NO_SHOWROOM_MUTATION','NO_BROWSER_OR_GPU_EXECUTION','NO_PHYSICAL_DEVICE_ACCEPTANCE','NO_R3F_EXECUTION','NO_DEPLOYMENT','NO_MAIN_MERGE','NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3E4_PASS_CLOSED_BEFORE_R3E5','R3E5_PASS_CLOSED_BEFORE_R3F'],
  dependencyRelations: [],
  allowedMutationScope: 'R3E5_CONTROL_REGISTRY_VALIDATION_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['SHOWROOM','PUBLIC_ROUTE','PUBLIC_RUNTIME','RENDERER','INPUT','R3F','DEPLOYMENT','MAIN'],
  requiredValidations: ['PREDECESSOR_RECEIPT_IDENTITY','R3E_CLOSURE_LEDGER','R3F_INPUT_DECISION','AUTOMATIC_REGISTRY_PREFLIGHT','EXACT_SCOPE','RECEIPT_FREE_CLOSURE_CONTROL','DURABLE_PASS_RECEIPT','FINAL_EXACT_HEAD_REVALIDATION'],
  stoppingBoundaries: ['STOP_BEFORE_PHYSICAL_REFERENCE_DEVICE_AND_BROADER_MOBILE_ACCEPTANCE_R3F'],
  currentIdentityReferences: ['6af68581b5c2d7a2528eedfb34efdfdbbf9aa1b3','2c71944eabc6d4522d934ef2fc4af6a85a38f3b5','e33405c5e7f600e59a6b1103fd856a1d37ca51c5','5c5f1ae06220f88f497dc2b45f4d749679849918','7b2db7ed51a345edea88ad8a1288db4db150201d','a15b0bfd5e0e41feb58278ead324af25cb895b79','30313213795','90133161723','8671168282'],
  lifecycleStatus: 'CORE_EXECUTION_PASS_RECEIPT_PENDING',
  unresolvedFields: ['RECEIPT_FREE_CLOSURE_CONTROL','DURABLE_PASS_RECEIPT','FINAL_EXACT_HEAD_REVALIDATION']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E5_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3E5_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E5_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E5_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3E5_NODE.nodeId ? H_EARTH_RUN_8E_R3E5_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3E5_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E5_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E5_NODE.nodeId, node: H_EARTH_RUN_8E_R3E5_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3E5_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3E5_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3E5_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E5_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E5_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3E5_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3E5_FACADE;
