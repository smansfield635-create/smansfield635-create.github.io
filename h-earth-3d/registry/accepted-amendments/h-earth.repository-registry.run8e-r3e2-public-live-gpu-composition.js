/** Read-only accepted-amendment facade for Run 8E R3E2 branch-local public live-GPU composition. */
import baseFacade from './h-earth.repository-registry.run8e-r3e1-public-integration-scope.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3e2-public-live-gpu-composition-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3e2.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3E2_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3e2-public-live-gpu-composition.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3e2.public-live-gpu-composition.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3e2-public-live-gpu-composition.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3e2.public-live-gpu-composition.harness.mjs',
  PASS_RECEIPT_PATH,
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js'
]);

const OCCURRENCES = freeze(H_EARTH_RUN_8E_R3E2_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH ? 'RESERVED_UNTIL_PASS_CLOSED' : 'PRESENT',
  fetchbackStatus: 'R3E2_CORE_SOURCE_COMPOSITION_PASS_DURABLE_RECEIPT_PENDING',
  occurrenceClass: 'RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_CORE_PASS_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3E2_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_v1',
  evidenceClass: 'EXECUTED_R3E2_BRANCH_LOCAL_PUBLIC_LIVE_GPU_SOURCE_COMPOSITION_CORE_PASS',
  sourceKind: 'GITHUB_ACTIONS_NODE_SOURCE_LOAD_ORDER_AND_REGISTRY_RECONCILIATION',
  sourceIdOrPath: '/showroom/globe/h-earth/index.html',
  sourceOccurrenceOrRevision: '9cb9a0a98fcfc6fbf354ef9dacc6adf13743891c',
  assertionScope: freeze([
    'EXACT_TWO_PUBLIC_PATH_MUTATION',
    'LEGACY_THREE_MODULE_LOADS_REMOVED',
    'ONE_PUBLIC_GPU_ORCHESTRATOR_LOAD_ADDED',
    'EXISTING_PUBLIC_HOST_IDENTITIES_PRESERVED',
    'ACCEPTED_R3D2_AND_R3D3_MODULES_COMPOSED',
    'NO_PROTECTED_WITNESS_MUTATION',
    'NO_BROWSER_OR_GPU_EXECUTION',
    'STOP_BEFORE_R3E3'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: '4d1692cb3f1555833bef7864a3f6ebc998b86a17',
    predecessorPullRequest: 244,
    predecessorPassReceiptGitBlob: '2c71944eabc6d4522d934ef2fc4af6a85a38f3b5',
    exactPublicMutationPathCount: 2,
    protectedWitnessCount: 11,
    expectedPublicModuleScriptCount: 1,
    publicRoutePreMutationGitBlob: 'b5f72fb70f59276f868a5894ee0c5e8beccc40ca',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3AFramePacketGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1',
    persistentRendererGitBlob: 'b8b3c713d5f0b7c79808e8942ce385887589d880',
    pointerTouchIntakeGitBlob: 'bb96858fec09d14bbe10aa9ffa8a7f07af3621e6',
    liveGpuBindingGitBlob: '5017bbaf857a644287cb829037b0fde4646f270d',
    coreHead: '9cb9a0a98fcfc6fbf354ef9dacc6adf13743891c',
    coreWorkflowRun: 30306926100,
    coreWorkflowJob: 90113310977,
    coreArtifactId: 8668783374,
    coreArtifactDigest: 'sha256:a4e2e9a23e7cdc55345b24537db2d5b414af4b78be0e07ab871270ab0619bb90',
    coreAutomaticRegistryPreflightRun: 30306925973,
    publicHtmlGitBlob: '0daedf61f7e19af095f4db5fc47563a9cd786837',
    publicOrchestratorGitBlob: '2b0a916b3a6d11da84316925f8abd8a3a1447445',
    baseHtmlByteLength: 12919,
    composedHtmlByteLength: 12693,
    publicOrchestratorByteLength: 8456,
    publicModuleScriptCount: 1,
    legacyModuleScriptCount: 0,
    exactLoadOrderOnlyDelta: true,
    protectedWitnessMutationCount: 0,
    prohibitedPatternCount: 0,
    browserExecutionCount: 0,
    gpuExecutionCount: 0
  }),
  evidenceLimitations: freeze([
    'DURABLE_R3E2_PASS_RECEIPT_PENDING',
    'NO_BROWSER_EXECUTION',
    'NO_GPU_EXECUTION',
    'AUTHORITY_EXCLUSIVITY_NOT_YET_EXECUTED',
    'R3E3_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3E2_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION',
  nodeType: 'RECOVERY_PUBLIC_INTEGRATION_CHECKPOINT',
  nodeSubtype: 'BRANCH_LOCAL_PUBLIC_LOAD_ORDER_AND_GPU_ORCHESTRATION_COMPOSITION',
  displayName: 'H-Earth Run 8E R3E2 Public Live-GPU Composition',
  description: 'Replaces the three legacy public module loads with one orchestration module that composes the accepted pointer/touch intake and live-GPU binding on the existing public canvas.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3E2_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R3E2_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3E2_EVIDENCE.evidenceId],
  authorityClass: 'EXECUTED_BOUNDED_PUBLIC_SOURCE_COMPOSITION_CORE_PASS',
  authorityPosture: 'R3E2_CORE_SOURCE_COMPOSITION_PASS_RECEIPT_PENDING_R3E3_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: ['R3E1_PASS_CLOSED_SCOPE','R3D2_POINTER_TOUCH_INTAKE','R3D3_LIVE_GPU_BINDING','EXISTING_PUBLIC_ROUTE_HOST'],
  authorityScope: ['MODIFY_PUBLIC_MODULE_LOAD_ORDER','CREATE_PUBLIC_GPU_ORCHESTRATOR','PRESERVE_PUBLIC_HOST_IDENTITIES','DECLARE_RUNTIME_EXCLUSIVITY_RECEIPT'],
  authorityLimitations: ['NO_BROWSER_EXECUTION','NO_GPU_EXECUTION','NO_AUTHORITY_EXCLUSIVITY_ACCEPTANCE','NO_DEPLOYMENT','NO_R3E3','NO_RUN_8E_PASS'],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3E1_PASS_CLOSED_BEFORE_R3E2','R3E2_PASS_CLOSED_BEFORE_R3E3'],
  dependencyRelations: [],
  allowedMutationScope: 'R3E2_TWO_PUBLIC_PATHS_PLUS_BOUNDED_CONTROL_EVIDENCE_PATHS',
  prohibitedMutations: ['PROTECTED_PUBLIC_WITNESSES','NAVIGATION','FRAME_PACKET','PERSISTENT_RENDERER','POINTER_TOUCH_INTAKE','LIVE_GPU_BINDING','DIAGNOSTIC_HOST','R3E3_OR_LATER'],
  requiredValidations: ['EXACT_HTML_LOAD_ORDER_DELTA','PUBLIC_ORCHESTRATOR_SOURCE_AUDIT','PROTECTED_BLOB_IDENTITIES','AUTOMATIC_REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: ['STOP_BEFORE_PUBLIC_RUNTIME_AUTHORITY_EXCLUSIVITY_EXECUTION_R3E3'],
  currentIdentityReferences: ['4d1692cb3f1555833bef7864a3f6ebc998b86a17','2c71944eabc6d4522d934ef2fc4af6a85a38f3b5','9cb9a0a98fcfc6fbf354ef9dacc6adf13743891c','30306926100','90113310977','8668783374','0daedf61f7e19af095f4db5fc47563a9cd786837','2b0a916b3a6d11da84316925f8abd8a3a1447445'],
  lifecycleStatus: 'CORE_EXECUTION_PASS_RECEIPT_PENDING',
  unresolvedFields: ['R3E2_PASS_RECEIPT','FINAL_EXACT_HEAD_WORKFLOW_RUN']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3E2_PATHS.map((repositoryPath) => [repositoryPath, { node: H_EARTH_RUN_8E_R3E2_NODE, occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath) }]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({ ...baseInstance, evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3E2_EVIDENCE], nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3E2_NODE] });

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3E2_NODE.nodeId ? H_EARTH_RUN_8E_R3E2_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3E2_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3E2_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) { const indexed = pathIndex.get(repositoryPath); return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false }) : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath); }
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) { const local = OCCURRENCES.filter((entry) => (input.path == null || entry.path === input.path) && (input.commitSha == null || entry.commitSha === input.commitSha) && (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) && (input.refName == null || entry.refName === input.refName)).map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3E2_NODE.nodeId, node: H_EARTH_RUN_8E_R3E2_NODE, occurrence })); const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input); return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 }); }
export function findHEarthRepositoryRegistryNodes(criteria = {}) { const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria); const node = H_EARTH_RUN_8E_R3E2_NODE; const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) && (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) && (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus); return freeze(match ? [...base, node] : base); }
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3E2_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3E2_NODE.nodeId ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3E2_NODE], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3E2_FACADE = freeze({ ...baseFacade, H_EARTH_RUN_8E_R3E2_PATHS, getHEarthRepositoryRegistryInstance, getHEarthRepositoryRegistryNode, getHEarthRepositoryRegistryEvidence, resolveHEarthRepositoryRegistryPath, resolveHEarthRepositoryRegistryOccurrence, findHEarthRepositoryRegistryNodes, getHEarthRepositoryRegistryRelationsForNode, getHEarthRepositoryRegistryDependencyClosure });

export default H_EARTH_RUN_8E_R3E2_FACADE;
