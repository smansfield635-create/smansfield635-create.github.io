/** Read-only registry successor for Run 8E R3F2-P2 exact preview package materialization. */
import baseFacade from './h-earth.repository-registry.run8e-r3f2-p1-immutable-preview-occurrence-contract.js';
import {
  H_EARTH_RUN_8E_R3F2_P2_CONTROL,
  H_EARTH_RUN_8E_R3F2_P2_CONTROL_ID
} from '../../control-plane/run-8/recovery/h-earth.run8e-r3f2-p2.exact-preview-package-materialization.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f2-p2-exact-preview-package-materialization-001';
const PREVIEW_ROOT = '/preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p2.pass-closed.receipt.json';
const PREVIEW_PATHS = freeze([
  `${PREVIEW_ROOT}/index.html`,
  `${PREVIEW_ROOT}/preview-manifest.json`,
  `${PREVIEW_ROOT}/device-evidence-receipt.schema.json`
]);

export const H_EARTH_RUN_8E_R3F2_P2_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3f2-p2-exact-preview-package-materialization.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p2.exact-preview-package-materialization.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-p2-exact-preview-package-materialization.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f2-p2.exact-preview-package-materialization.harness.mjs',
  ...PREVIEW_PATHS,
  PASS_RECEIPT_PATH
]);

const materialized = H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus !== 'MATERIALIZATION_EXECUTION_OPEN';
const occurrences = freeze(H_EARTH_RUN_8E_R3F2_P2_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH
    ? (H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus === 'PASS_CLOSED' ? 'PRESENT' : 'RESERVED_UNTIL_PASS_CLOSED')
    : PREVIEW_PATHS.includes(repositoryPath)
      ? (materialized ? 'PRESENT' : 'RESERVED_UNTIL_MATERIALIZATION')
      : 'PRESENT',
  fetchbackStatus: H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P2_PASS_CLOSED_FETCHBACK_PENDING'
    : materialized
      ? 'R3F2_P2_MATERIALIZED_FETCHBACK_PENDING'
      : 'R3F2_P2_MATERIALIZATION_PENDING',
  occurrenceClass: PREVIEW_PATHS.includes(repositoryPath)
    ? 'RUN_8E_R3F2_P2_MATERIALIZED_PREVIEW_FILE_OCCURRENCE'
    : 'RUN_8E_R3F2_P2_CONTROL_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F2_P2_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION_v1',
  evidenceClass: H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION_PASS_CLOSED'
    : materialized
      ? 'R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZED_PENDING_DURABLE_RECEIPT'
      : 'R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION_EXECUTION_OPEN',
  sourceKind: 'REPOSITORY_MATERIALIZATION_AND_EXECUTABLE_DIGEST_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8e-r3f2-p2.exact-preview-package-materialization.harness.mjs',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'P1_PASS_CLOSED_INPUT','EXACT_VALIDATED_PACKAGE_BYTES','THREE_FILE_PREVIEW_TREE',
    'PREVIEW_MANIFEST_IDENTITY','NORMALIZED_DEVICE_EVIDENCE_SCHEMA','ZERO_EXTERNAL_RUNTIME_DEPENDENCIES',
    'NO_DEPLOYMENT_CONFIGURATION','NO_NETWORK_PUBLICATION','STOP_BEFORE_HOSTING'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: H_EARTH_RUN_8E_R3F2_P2_CONTROL.baseExactHead,
    packageHead: H_EARTH_RUN_8E_R3F2_P2_CONTROL.candidateIdentity.packageHead,
    packageSha256: H_EARTH_RUN_8E_R3F2_P2_CONTROL.candidateIdentity.packageSha256,
    previewRoot: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializedPreviewTree.repositoryRoot,
    exactFileCount: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializedPreviewTree.exactFileCount,
    materializationHead: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializationEvidence?.materializationHead ?? null,
    workflowRun: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializationEvidence?.workflowRun ?? null,
    workflowJob: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializationEvidence?.workflowJob ?? null,
    artifactId: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializationEvidence?.artifactId ?? null,
    artifactDigest: H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializationEvidence?.artifactDigest ?? null,
    passReceiptGitBlob: H_EARTH_RUN_8E_R3F2_P2_CONTROL.closureEvidence?.passReceiptGitBlob ?? null
  }),
  evidenceLimitations: freeze([
    'DEPLOYMENT_CONFIGURATION_NOT_CREATED','NETWORK_PUBLICATION_NOT_PERFORMED','PREVIEW_URL_NOT_ISSUED',
    'PHYSICAL_REFERENCE_DEVICE_EXECUTION_NOT_PERFORMED','R3F2_NOT_PASS_CLOSED','RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F2_P2_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION',
  nodeType: 'RECOVERY_PREVIEW_PUBLICATION_CHECKPOINT',
  nodeSubtype: 'EXACT_PREVIEW_PACKAGE_MATERIALIZATION',
  displayName: 'H-Earth Run 8E R3F2-P2 Exact Preview Package Materialization',
  description: 'Materializes the exact validated self-contained candidate and its two governed metadata files without creating hosting or network publication.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F2_P2_PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: H_EARTH_RUN_8E_R3F2_P2_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F2_P2_EVIDENCE.evidenceId],
  authorityClass: 'R3F2_P2_EXACT_PREVIEW_PACKAGE_MATERIALIZATION_AUTHORITY',
  authorityPosture: H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus,
  authoritySource: [H_EARTH_RUN_8E_R3F2_P2_CONTROL_ID, 'RUN_8E_R3F2_P1_PASS_CLOSED'],
  authorityScope: [...H_EARTH_RUN_8E_R3F2_P2_CONTROL.authorizedWork],
  authorityLimitations: [...H_EARTH_RUN_8E_R3F2_P2_CONTROL.prohibitedWork],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3F2_P1_PASS_CLOSED_BEFORE_P2','P2_PASS_CLOSED_BEFORE_P3'],
  dependencyRelations: [],
  allowedMutationScope: 'P2_CONTROL_REGISTRY_LOADER_HARNESS_WORKFLOW_PREVIEW_TREE_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['DEPLOYMENT_CONFIGURATION','SHOWROOM','PUBLIC_LIVE_H_EARTH','MAIN','PRODUCTION'],
  requiredValidations: ['P1_RECEIPT_IDENTITY','EXACT_PACKAGE_SHA256','EXACT_THREE_FILE_TREE','MANIFEST_AND_SCHEMA_DIGESTS','REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: [H_EARTH_RUN_8E_R3F2_P2_CONTROL.stoppingBoundary],
  currentIdentityReferences: [
    H_EARTH_RUN_8E_R3F2_P2_CONTROL.baseExactHead,
    H_EARTH_RUN_8E_R3F2_P2_CONTROL.predecessor.passReceiptGitBlob,
    ...H_EARTH_RUN_8E_R3F2_P2_CONTROL.materializedPreviewTree.files.map((file) => file.contentSha256)
  ],
  lifecycleStatus: H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus,
  unresolvedFields: H_EARTH_RUN_8E_R3F2_P2_CONTROL.currentStatus === 'PASS_CLOSED'
    ? []
    : materialized ? ['PASS_RECEIPT_GIT_BLOB'] : ['MATERIALIZATION_HEAD','CORE_WORKFLOW_CUSTODY','PASS_RECEIPT_GIT_BLOB']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F2_P2_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F2_P2_NODE,
  occurrences: occurrences.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F2_P2_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F2_P2_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F2_P2_NODE.nodeId ? H_EARTH_RUN_8E_R3F2_P2_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F2_P2_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3F2_P2_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false }) : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = occurrences.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F2_P2_NODE.nodeId, node: H_EARTH_RUN_8E_R3F2_P2_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F2_P2_NODE;
  const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F2_P2_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F2_P2_NODE.nodeId ? freeze({ nodeId: id, nodes: [node], relations: [], unresolved: false }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F2_P2_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F2_P2_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F2_P2_FACADE;
