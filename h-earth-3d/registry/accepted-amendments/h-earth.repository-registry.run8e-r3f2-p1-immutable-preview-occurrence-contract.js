/** Read-only registry successor for Run 8E R3F2-P1 immutable preview occurrence contract. */
import baseFacade from './h-earth.repository-registry.run8e-r3f2-reference-device-preview.js';
import {
  H_EARTH_RUN_8E_R3F2_P1_CONTRACT,
  H_EARTH_RUN_8E_R3F2_P1_CONTRACT_ID
} from '../../control-plane/run-8/recovery/h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f2-p1-immutable-preview-occurrence-contract-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p1.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3F2_P1_PATHS = freeze([
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-p1-immutable-preview-occurrence-contract.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.harness.mjs',
  PASS_RECEIPT_PATH
]);

const occurrences = freeze(H_EARTH_RUN_8E_R3F2_P1_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P1_PASS_CLOSED_FETCHBACK_PENDING'
    : 'R3F2_P1_CONTRACT_VALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F2_P1_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_v1',
  evidenceClass: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_PASS_CLOSED'
    : 'R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_COMPLETE_PENDING_DURABLE_RECEIPT',
  sourceKind: 'REPOSITORY_CONTRACT_AND_EXECUTABLE_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p1.immutable-preview-occurrence-contract.js',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'EXACT_VALIDATED_PACKAGE_INPUT',
    'PACKAGE_SHA256_URL_BINDING',
    'THREE_FILE_ALLOWED_WEB_TREE',
    'ZERO_EXTERNAL_RUNTIME_DEPENDENCIES',
    'IMMUTABLE_CACHE_LAW',
    'NOINDEX_HEADER_LAW',
    'NON_PRODUCTION_ISOLATION',
    'DEVICE_EVIDENCE_RECEIPT_SCHEMA',
    'STOP_BEFORE_PREVIEW_MATERIALIZATION_OR_DEPLOYMENT_CONFIGURATION'
  ]),
  verifiedOn: '2026-07-28T01:10:11Z',
  evidenceMetadata: freeze({
    baseExactHead: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.baseExactHead,
    packageHead: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageHead,
    packageSha256: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageSha256,
    packageByteCount: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageByteCount,
    packageManifestSha256: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageManifestSha256,
    previewUrlPath: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.immutablePreviewOccurrence.urlPath,
    coreWorkflowRun: 30319469235,
    coreWorkflowJob: 90152108696,
    coreArtifactId: 8673429708,
    coreArtifactDigest: 'sha256:ec20a320682c1d94d86d71eabc0ce0cdb202c1e5ce088aa0c17755d0e09b46c9',
    passReceiptGitBlob: 'f2d4a9f86153912cbd68be8662873f77854107f4'
  }),
  evidenceLimitations: freeze([
    'PREVIEW_FILES_NOT_MATERIALIZED',
    'DEPLOYMENT_CONFIGURATION_NOT_CREATED',
    'NETWORK_PUBLICATION_NOT_PERFORMED',
    'PHYSICAL_REFERENCE_DEVICE_EXECUTION_NOT_PERFORMED',
    'R3F2_NOT_PASS_CLOSED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F2_P1_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT',
  nodeType: 'RECOVERY_PREVIEW_PUBLICATION_CHECKPOINT',
  nodeSubtype: 'IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT',
  displayName: 'H-Earth Run 8E R3F2-P1 Immutable Preview Occurrence Contract',
  description: 'Defines the exact immutable URL, file set, delivery law, non-production boundary, and device evidence schema before preview materialization or deployment configuration.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F2_P1_PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: H_EARTH_RUN_8E_R3F2_P1_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F2_P1_EVIDENCE.evidenceId],
  authorityClass: 'R3F2_P1_IMMUTABLE_PREVIEW_OCCURRENCE_CONTRACT_AUTHORITY',
  authorityPosture: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.currentStatus,
  authoritySource: [H_EARTH_RUN_8E_R3F2_P1_CONTRACT_ID, 'RUN_8E_R3F2_PREVIEW_VALIDATION_PASS'],
  authorityScope: [...H_EARTH_RUN_8E_R3F2_P1_CONTRACT.authorizedWork],
  authorityLimitations: [...H_EARTH_RUN_8E_R3F2_P1_CONTRACT.prohibitedWork],
  parentRelations: [],
  childRelations: [],
  peerRelations: [],
  upstreamBoundaries: [],
  downstreamBoundaries: [],
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3F2_SIGNED_OFFLINE_PACKAGE_VALIDATION_PASS_BEFORE_P1', 'P1_PASS_CLOSED_BEFORE_P2'],
  dependencyRelations: [],
  allowedMutationScope: 'P1_CONTRACT_REGISTRY_LOADER_VALIDATION_WORKFLOW_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['PREVIEW_TREE','DEPLOYMENT_CONFIGURATION','SHOWROOM','PUBLIC_ROUTE','MAIN','PRODUCTION'],
  requiredValidations: ['EXACT_BASE_HEAD','EXACT_PACKAGE_IDENTITY','CONTRACT_EVALUATION','REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: [H_EARTH_RUN_8E_R3F2_P1_CONTRACT.stoppingBoundary],
  currentIdentityReferences: [
    H_EARTH_RUN_8E_R3F2_P1_CONTRACT.baseExactHead,
    H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageSha256,
    H_EARTH_RUN_8E_R3F2_P1_CONTRACT.predecessor.packageManifestSha256,
    '01fb91cb37e77b8dc5938e1acdb7466163cbd4cf',
    'f2d4a9f86153912cbd68be8662873f77854107f4'
  ],
  lifecycleStatus: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.currentStatus,
  unresolvedFields: H_EARTH_RUN_8E_R3F2_P1_CONTRACT.currentStatus === 'PASS_CLOSED' ? [] : ['CORE_WORKFLOW_CUSTODY','PASS_RECEIPT_GIT_BLOB']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F2_P1_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F2_P1_NODE,
  occurrences: occurrences.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F2_P1_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F2_P1_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId
  ? H_EARTH_RUN_8E_R3F2_P1_NODE
  : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F2_P1_EVIDENCE.evidenceId
  ? H_EARTH_RUN_8E_R3F2_P1_EVIDENCE
  : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = occurrences.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId, node: H_EARTH_RUN_8E_R3F2_P1_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F2_P1_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId
  ? freeze([])
  : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F2_P1_NODE.nodeId
  ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3F2_P1_NODE], relations: [], unresolved: false })
  : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F2_P1_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F2_P1_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F2_P1_FACADE;
