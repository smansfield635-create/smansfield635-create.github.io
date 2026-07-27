/** Read-only accepted-amendment facade for Run 8E R3E1 public-integration scope. */
import baseFacade from './h-earth.repository-registry.run8e-r3d5-r3d-closure-r3e-input-decision-scope.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e1-public-integration-scope-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e1.pass-closed.receipt.json';
const PASS_RECEIPT_GIT_BLOB = '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5';

export const H_EARTH_RUN_8E_R3E1_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3e1-public-integration-scope.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-control.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e1.public-integration-scope-declaration.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e1-public-integration-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e1.public-integration-scope.harness.mjs',
  PASS_RECEIPT_PATH
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3E1_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: repositoryPath === PASS_RECEIPT_PATH ? PASS_RECEIPT_GIT_BLOB : null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'R3E1_DURABLE_PASS_RECEIPT_PRESENT_FINAL_EXACT_HEAD_VALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE_PASS_CLOSED_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE_v1',
  evidenceClass: 'EXECUTED_R3E1_EXACT_PUBLIC_INTEGRATION_SCOPE_WITH_DURABLE_PASS_CLOSED_RECEIPT',
  sourceKind: 'GITHUB_ACTIONS_NODE_SOURCE_AND_REGISTRY_RECONCILIATION',
  sourceIdOrPath: PASS_RECEIPT_PATH,
  sourceOccurrenceOrRevision: '15a518a9ae99c1e9c7ac5620c593be106e2c1948',
  assertionScope: freeze(['EXACT_PUBLIC_SOURCE_BLOBS_READ','CURRENT_RUNTIME_OWNER_COLLISIONS_CLASSIFIED','TWO_PATH_FUTURE_PUBLIC_MUTATION_SCOPE_DECLARED','ELEVEN_PROTECTED_WITNESSES_DECLARED','EXACT_LOAD_ORDER_AND_ROLLBACK_GROUPS_DECLARED','NO_SHOWROOM_MUTATION_PERFORMED','R3E1_PASS_CLOSED','STOP_BEFORE_R3E2']),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: 'ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7',
    predecessorPullRequest: 243,
    predecessorPassReceiptGitBlob: 'f9f6d9b1464882f7e8cf7143a4d4e90d4093dcec',
    coreHead: '15a518a9ae99c1e9c7ac5620c593be106e2c1948',
    coreWorkflowRun: 30305137754,
    coreWorkflowJob: 90107416323,
    coreArtifactId: 8668122923,
    coreArtifactDigest: 'sha256:1891c2309d459cf40da5ce1917ce2ece4be60fd7d8560ef911ef6679ee0b8bb4',
    coreAutomaticRegistryPreflightRun: 30305137669,
    closureControlHead: '3392c35d4ea075f1e46d67951e80d6a521e95933',
    closureControlWorkflowRun: 30305476333,
    closureControlWorkflowJob: 90108562585,
    closureControlArtifactId: 8668246285,
    closureControlArtifactDigest: 'sha256:56ec30d041ce103cdce7dbb0230e1d1ed50287d847c7d218ee98cc61cb57d9c6',
    closureControlAutomaticRegistryPreflightRun: 30305476339,
    closureControlReceiptPresent: false,
    durablePassReceiptCommit: '46b8bcec7c9df762f09821a1432c67487397727c',
    durablePassReceiptGitBlob: PASS_RECEIPT_GIT_BLOB,
    exactFutureMutationPathCount: 2,
    protectedWitnessCount: 11,
    collisionFindingCount: 8,
    rollbackGroupCount: 2,
    currentModuleScriptOwnerCount: 3,
    showroomMutationCount: 0,
    exactFutureMutationPaths: freeze(['/showroom/globe/h-earth/index.html','/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'])
  }),
  evidenceLimitations: freeze(['FINAL_EXACT_HEAD_VALIDATION_PENDING','FINAL_EXACT_HEAD_VALIDATION_NOT_EMBEDDED_IN_PASS_RECEIPT','NO_PUBLIC_SOURCE_MUTATION','NO_BROWSER_OR_GPU_EXECUTION','R3E2_NOT_STARTED','RUN_8E_REMAINS_FAIL_OPEN'])
});

export const H_EARTH_RUN_8E_R3E1_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E1_PUBLIC_INTEGRATION_SCOPE',
  nodeType: 'RECOVERY_INTEGRATION_SCOPE_CHECKPOINT',
  nodeSubtype: 'EXACT_PUBLIC_ROUTE_MUTATION_SCOPE_AND_RUNTIME_OWNER_DISPOSITION',
  displayName: 'H-Earth Run 8E R3E1 Exact Public Integration Scope',
  description: 'Reads the actual public runtime corridor, classifies legacy ownership collisions, and pass-closes a two-path future R3E2 integration scope without mutating public source.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E1_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_PUBLIC_INTEGRATION_SCOPE_PASS_CLOSED',
  authorityPosture: 'R3E1_PASS_CLOSED_UNMERGED_R3_OPEN_AT_R3E2_BOUNDARY_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3D5_PASS_CLOSED_RECEIPT','ACTUAL_PUBLIC_ROUTE_SOURCE','ACTUAL_LEGACY_RUNTIME_SOURCES','R3E1_GITHUB_ACTIONS_EXECUTION','R3E1_DURABLE_PASS_RECEIPT'],
  authorityScope: ['READ_PUBLIC_RUNTIME','DECLARE_EXACT_FUTURE_MUTATION_SCOPE','DECLARE_LOAD_ORDER','DECLARE_ROLLBACK_GROUPS'],
  authorityLimitations: ['NO_SHOWROOM_MUTATION','NO_PUBLIC_BINDING','NO_BROWSER_EXECUTION','NO_GPU_EXECUTION','NO_R3E2','NO_DEPLOYMENT','NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3D5_PASS_CLOSED_BEFORE_R3E1','R3E1_PASS_CLOSED_BEFORE_R3E2_SOURCE_MUTATION'],
  dependencyRelations: [],
  allowedMutationScope: 'NONE_AFTER_FINAL_EXACT_HEAD_VALIDATION',
  prohibitedMutations: ['SHOWROOM','PUBLIC_ROUTE','PUBLIC_DIRECT_MANIPULATION','NAVIGATION','RENDERER','DIAGNOSTIC_BINDING','R3E2_OR_LATER'],
  requiredValidations: ['FINAL_EXACT_SOURCE_BLOBS','FINAL_SCOPE_DECLARATION_EVALUATION','FINAL_NO_SHOWROOM_DELTA','FINAL_AUTOMATIC_REGISTRY_PREFLIGHT','FINAL_EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_ANY_PUBLIC_ROUTE_SOURCE_MUTATION_R3E2'],
  currentIdentityReferences: ['ccee63d4826f9ac5c8eb9069d0d33d3ad5ebcef7','15a518a9ae99c1e9c7ac5620c593be106e2c1948','3392c35d4ea075f1e46d67951e80d6a521e95933','46b8bcec7c9df762f09821a1432c67487397727c','30305137754','30305476333','8668122923','8668246285',PASS_RECEIPT_GIT_BLOB],
  lifecycleStatus: 'PASS_CLOSED_FINAL_EXACT_HEAD_VALIDATION_PENDING',
  unresolvedFields: ['FINAL_EXACT_HEAD_WORKFLOW_RUN']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E1_PATHS.map((repositoryPath) => [repositoryPath, { node: H_EARTH_RUN_8E_R3E1_NODE, occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath) }]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({ ...baseInstance, evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E1_EVIDENCE], nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E1_NODE] });

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3E1_NODE.nodeId ? H_EARTH_RUN_8E_R3E1_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3E1_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E1_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) { const indexed = pathIndex.get(repositoryPath); return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false }) : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath); }
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) { const local = OCCURRENCES.filter((entry) => (input.path == null || entry.path === input.path) && (input.commitSha == null || entry.commitSha === input.commitSha) && (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) && (input.refName == null || entry.refName === input.refName)).map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E1_NODE.nodeId, node: H_EARTH_RUN_8E_R3E1_NODE, occurrence })); const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input); return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 }); }
export function findHEarthRepositoryRegistryNodes(criteria = {}) { const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria); const node = H_EARTH_RUN_8E_R3E1_NODE; const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) && (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) && (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus); return freeze(match ? [...base, node] : base); }
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3E1_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3E1_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E1_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E1_FACADE = freeze({ ...baseFacade, H_EARTH_RUN_8E_R3E1_PATHS, getHEarthRepositoryRegistryInstance, getHEarthRepositoryRegistryNode, getHEarthRepositoryRegistryEvidence, resolveHEarthRepositoryRegistryPath, resolveHEarthRepositoryRegistryOccurrence, findHEarthRepositoryRegistryNodes, getHEarthRepositoryRegistryRelationsForNode, getHEarthRepositoryRegistryDependencyClosure });

export default H_EARTH_RUN_8E_R3E1_FACADE;
