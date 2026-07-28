/** Read-only registry successor for Run 8E R3F2-P3 non-production publication configuration. */
import baseFacade from './h-earth.repository-registry.run8e-r3f2-p2-exact-preview-package-materialization.js';
import {
  H_EARTH_RUN_8E_R3F2_P3_CONTROL,
  H_EARTH_RUN_8E_R3F2_P3_CONTROL_ID
} from '../../control-plane/run-8/recovery/h-earth.run8e-r3f2-p3.non-production-publication-configuration.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f2-p3-non-production-publication-configuration-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3F2_P3_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3f2-p3-non-production-publication-configuration.yml',
  '/.github/workflows/h-earth-run8e-r3f2-p4-immutable-preview-publication.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p3.non-production-publication-configuration.js',
  '/h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3.cloudflare-pages-direct-upload.config.json',
  '/h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3.cloudflare-pages.headers.txt',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-p3-non-production-publication-configuration.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f2-p3.non-production-publication-configuration.harness.mjs',
  PASS_RECEIPT_PATH
]);

const occurrences = freeze(H_EARTH_RUN_8E_R3F2_P3_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH
    ? (H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus === 'PASS_CLOSED' ? 'PRESENT' : 'RESERVED_UNTIL_PASS_CLOSED')
    : 'PRESENT',
  fetchbackStatus: H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P3_PASS_CLOSED_FETCHBACK_PENDING'
    : 'R3F2_P3_CONFIGURATION_VALIDATION_PENDING',
  occurrenceClass: repositoryPath.includes('p4-immutable-preview-publication')
    ? 'RUN_8E_R3F2_P4_FUTURE_MANUAL_PUBLICATION_CONFIGURATION_OCCURRENCE'
    : 'RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F2_P3_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION_v1',
  evidenceClass: H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION_PASS_CLOSED'
    : 'R3F2_P3_CONFIGURATION_COMPLETE_PENDING_DURABLE_RECEIPT',
  sourceKind: 'REPOSITORY_CONFIGURATION_AND_EXECUTABLE_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p3.non-production-publication-configuration.js',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'P2_PASS_CLOSED_INPUT','CLOUDFLARE_PAGES_DIRECT_UPLOAD_CONFIGURATION',
    'DEDICATED_NON_PRODUCTION_PROJECT','DISABLED_PRODUCTION_BRANCH_SENTINEL',
    'WORKFLOW_DISPATCH_ONLY','P4_BRANCH_GATE','UNIQUE_DEPLOYMENT_URL_REQUIRED',
    'BRANCH_ALIAS_NOT_EVIDENCE_URL','IMMUTABLE_CACHE_AND_NOINDEX_HEADERS',
    'ZERO_NETWORK_PUBLICATION_DURING_P3','STOP_BEFORE_FIRST_NETWORK_PUBLICATION'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: H_EARTH_RUN_8E_R3F2_P3_CONTROL.baseExactHead,
    p2PassReceiptGitBlob: H_EARTH_RUN_8E_R3F2_P3_CONTROL.predecessor.passReceiptGitBlob,
    projectName: H_EARTH_RUN_8E_R3F2_P3_CONTROL.publicationConfiguration.projectName,
    productionBranchSentinel: H_EARTH_RUN_8E_R3F2_P3_CONTROL.publicationConfiguration.productionBranchSentinel,
    previewBranch: H_EARTH_RUN_8E_R3F2_P3_CONTROL.publicationConfiguration.previewBranch,
    coreWorkflowRun: H_EARTH_RUN_8E_R3F2_P3_CONTROL.closureEvidence?.coreWorkflowRun ?? null,
    coreWorkflowJob: H_EARTH_RUN_8E_R3F2_P3_CONTROL.closureEvidence?.coreWorkflowJob ?? null,
    coreArtifactId: H_EARTH_RUN_8E_R3F2_P3_CONTROL.closureEvidence?.coreArtifactId ?? null,
    coreArtifactDigest: H_EARTH_RUN_8E_R3F2_P3_CONTROL.closureEvidence?.coreArtifactDigest ?? null,
    passReceiptGitBlob: H_EARTH_RUN_8E_R3F2_P3_CONTROL.closureEvidence?.passReceiptGitBlob ?? null
  }),
  evidenceLimitations: freeze([
    'PAGES_PROJECT_NOT_CREATED','NETWORK_PUBLICATION_NOT_PERFORMED','PREVIEW_URL_NOT_ISSUED',
    'HOSTED_BROWSER_VALIDATION_NOT_PERFORMED','PHYSICAL_REFERENCE_DEVICE_EXECUTION_NOT_PERFORMED',
    'R3F2_NOT_PASS_CLOSED','RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F2_P3_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION',
  nodeType: 'RECOVERY_PREVIEW_PUBLICATION_CHECKPOINT',
  nodeSubtype: 'NON_PRODUCTION_PUBLICATION_CONFIGURATION',
  displayName: 'H-Earth Run 8E R3F2-P3 Non-Production Publication Configuration',
  description: 'Configures a manual-only Cloudflare Pages direct-upload preview occurrence while stopping before project creation, asset upload, or URL issuance.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F2_P3_PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: H_EARTH_RUN_8E_R3F2_P3_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F2_P3_EVIDENCE.evidenceId],
  authorityClass: 'R3F2_P3_NON_PRODUCTION_PUBLICATION_CONFIGURATION_AUTHORITY',
  authorityPosture: H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus,
  authoritySource: [H_EARTH_RUN_8E_R3F2_P3_CONTROL_ID, 'RUN_8E_R3F2_P2_PASS_CLOSED'],
  authorityScope: [...H_EARTH_RUN_8E_R3F2_P3_CONTROL.authorizedWork],
  authorityLimitations: [...H_EARTH_RUN_8E_R3F2_P3_CONTROL.prohibitedWork],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3F2_P2_PASS_CLOSED_BEFORE_P3','P3_PASS_CLOSED_BEFORE_P4'],
  dependencyRelations: [],
  allowedMutationScope: 'P3_CONFIGURATION_CONTROL_REGISTRY_LOADER_HARNESS_WORKFLOWS_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['PREVIEW_SOURCE_TREE','SHOWROOM','PUBLIC_LIVE_H_EARTH','MAIN','PRODUCTION_DOMAIN'],
  requiredValidations: ['P2_RECEIPT_IDENTITY','EXACT_PREVIEW_TREE_UNCHANGED','MANUAL_ONLY_TRIGGER','P4_BRANCH_GATE','HEADER_POLICY','REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: [H_EARTH_RUN_8E_R3F2_P3_CONTROL.stoppingBoundary],
  currentIdentityReferences: [
    H_EARTH_RUN_8E_R3F2_P3_CONTROL.baseExactHead,
    H_EARTH_RUN_8E_R3F2_P3_CONTROL.predecessor.passReceiptGitBlob,
    H_EARTH_RUN_8E_R3F2_P3_CONTROL.candidateIdentity.packageSha256
  ],
  lifecycleStatus: H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus,
  unresolvedFields: H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus === 'PASS_CLOSED'
    ? []
    : ['CORE_WORKFLOW_CUSTODY','PASS_RECEIPT_GIT_BLOB']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F2_P3_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F2_P3_NODE,
  occurrences: occurrences.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F2_P3_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F2_P3_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F2_P3_NODE.nodeId ? H_EARTH_RUN_8E_R3F2_P3_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F2_P3_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3F2_P3_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F2_P3_NODE.nodeId, node: H_EARTH_RUN_8E_R3F2_P3_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F2_P3_NODE;
  const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F2_P3_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F2_P3_NODE.nodeId
  ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3F2_P3_NODE], relations: [], unresolved: false })
  : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F2_P3_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F2_P3_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F2_P3_FACADE;
