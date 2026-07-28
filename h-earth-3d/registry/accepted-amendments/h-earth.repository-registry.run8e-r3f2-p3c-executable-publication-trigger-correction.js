import baseFacade from './h-earth.repository-registry.run8e-r3f2-p3-non-production-publication-configuration.js';
import {
  H_EARTH_RUN_8E_R3F2_P3C_CONTROL,
  H_EARTH_RUN_8E_R3F2_P3C_CONTROL_ID
} from '../../control-plane/run-8/recovery/h-earth.run8e-r3f2-p3c.executable-publication-trigger-correction.js';

const freeze = (value) => Object.freeze(value);
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r3f2-p3c-executable-publication-trigger-correction-001';
const PASS_RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3c.pass-closed.receipt.json';

export const H_EARTH_RUN_8E_R3F2_P3C_PATHS = freeze([
  '/.github/workflows/h-earth-run8e-r3f2-p3c-executable-publication-trigger-correction.yml',
  '/.github/workflows/h-earth-run8e-r3f2-p4-immutable-preview-publication.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p3c.executable-publication-trigger-correction.js',
  '/h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3c.authorized-push-trigger.config.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-p3c-executable-publication-trigger-correction.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r3f2-p3c.executable-publication-trigger-correction.harness.mjs',
  PASS_RECEIPT_PATH
]);

const occurrences = freeze(H_EARTH_RUN_8E_R3F2_P3C_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: repositoryPath === PASS_RECEIPT_PATH
    ? (H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus === 'PASS_CLOSED' ? 'PRESENT' : 'RESERVED_UNTIL_PASS_CLOSED')
    : 'PRESENT',
  fetchbackStatus: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P3C_PASS_CLOSED_FETCHBACK_PENDING'
    : 'R3F2_P3C_CORRECTION_VALIDATION_PENDING',
  occurrenceClass: 'RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_OCCURRENCE'
})));

export const H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_v1',
  evidenceClass: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus === 'PASS_CLOSED'
    ? 'R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_PASS_CLOSED'
    : 'R3F2_P3C_CORRECTION_EXECUTION_OPEN',
  sourceKind: 'REPOSITORY_CONFIGURATION_CORRECTION_AND_EXECUTABLE_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r3f2-p3c.executable-publication-trigger-correction.js',
  sourceOccurrenceOrRevision: null,
  assertionScope: freeze([
    'P3_PASS_CLOSED_INPUT','WORKFLOW_DISPATCH_DEFAULT_BRANCH_EXECUTABILITY_DEFECT',
    'ONE_SHOT_AUTHORIZATION_PUSH_TRIGGER','EXACT_AUTHORIZATION_FILE_IDENTITY',
    'P3C_RECEIPT_REQUIRED_IN_AUTHORIZATION_PARENT','CLOUDFLARE_CONFIGURATION_PRESERVED',
    'ZERO_NETWORK_PUBLICATION_DURING_P3C','STOP_BEFORE_FIRST_NETWORK_PUBLICATION'
  ]),
  verifiedOn: null,
  evidenceMetadata: freeze({
    baseExactHead: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.baseExactHead,
    p3PassReceiptGitBlob: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.predecessor.passReceiptGitBlob,
    triggerEvent: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.correctedTrigger.event,
    authorizationPath: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.correctedTrigger.authorizationPath,
    authorizationGitBlob: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.correctedTrigger.exactAuthorizationGitBlob,
    passReceiptGitBlob: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.closureEvidence?.passReceiptGitBlob ?? null
  }),
  evidenceLimitations: freeze([
    'PAGES_PROJECT_NOT_CREATED','NETWORK_PUBLICATION_NOT_PERFORMED','PREVIEW_URL_NOT_ISSUED',
    'HOSTED_BROWSER_VALIDATION_NOT_PERFORMED','PHYSICAL_REFERENCE_DEVICE_EXECUTION_NOT_PERFORMED',
    'R3F2_NOT_PASS_CLOSED','RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R3F2_P3C_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION',
  nodeType: 'RECOVERY_PREVIEW_PUBLICATION_CHECKPOINT',
  nodeSubtype: 'EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION',
  displayName: 'H-Earth Run 8E R3F2-P3C Executable Publication Trigger Correction',
  description: 'Corrects only the non-runnable branch-local workflow_dispatch gate while preserving the exact preview package and non-production Pages configuration.',
  repositoryPaths: [...H_EARTH_RUN_8E_R3F2_P3C_PATHS],
  repositoryOccurrences: occurrences,
  evidenceClass: H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE.evidenceClass,
  evidenceReferences: [H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE.evidenceId],
  authorityClass: 'R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_AUTHORITY',
  authorityPosture: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus,
  authoritySource: [H_EARTH_RUN_8E_R3F2_P3C_CONTROL_ID, 'RUN_8E_R3F2_P3_PASS_CLOSED'],
  authorityScope: [...H_EARTH_RUN_8E_R3F2_P3C_CONTROL.authorizedWork],
  authorityLimitations: [...H_EARTH_RUN_8E_R3F2_P3C_CONTROL.prohibitedWork],
  parentRelations: [], childRelations: [], peerRelations: [], upstreamBoundaries: [], downstreamBoundaries: [],
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: ['R3F2_P3_PASS_CLOSED_BEFORE_P3C','P3C_PASS_CLOSED_BEFORE_P4_PUBLICATION'],
  dependencyRelations: [],
  allowedMutationScope: 'P3C_CONTROL_CONFIG_REGISTRY_LOADER_HARNESS_WORKFLOW_AND_RECEIPT_PATHS_ONLY',
  prohibitedMutations: ['PREVIEW_TREE','SHOWROOM','PUBLIC_LIVE_H_EARTH','MAIN','PRODUCTION'],
  requiredValidations: ['P3_RECEIPT_IDENTITY','EXACT_AUTHORIZATION_IDENTITY','PUSH_TRIGGER_GATE','REGISTRY_PREFLIGHT','EXACT_SCOPE'],
  stoppingBoundaries: [H_EARTH_RUN_8E_R3F2_P3C_CONTROL.stoppingBoundary],
  currentIdentityReferences: [
    H_EARTH_RUN_8E_R3F2_P3C_CONTROL.baseExactHead,
    H_EARTH_RUN_8E_R3F2_P3C_CONTROL.predecessor.passReceiptGitBlob,
    H_EARTH_RUN_8E_R3F2_P3C_CONTROL.correctedTrigger.exactAuthorizationGitBlob
  ],
  lifecycleStatus: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus,
  unresolvedFields: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.currentStatus === 'PASS_CLOSED' ? [] : ['PASS_RECEIPT_GIT_BLOB']
});

const pathIndex = new Map(H_EARTH_RUN_8E_R3F2_P3C_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R3F2_P3C_NODE,
  occurrences: occurrences.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R3F2_P3C_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R3F2_P3C_NODE.nodeId ? H_EARTH_RUN_8E_R3F2_P3C_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE.evidenceId ? H_EARTH_RUN_8E_R3F2_P3C_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R3F2_P3C_NODE.nodeId, node: H_EARTH_RUN_8E_R3F2_P3C_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R3F2_P3C_NODE;
  const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') => id === H_EARTH_RUN_8E_R3F2_P3C_NODE.nodeId ? freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => id === H_EARTH_RUN_8E_R3F2_P3C_NODE.nodeId
  ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R3F2_P3C_NODE], relations: [], unresolved: false })
  : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R3F2_P3C_FACADE = freeze({
  ...baseFacade,
  H_EARTH_RUN_8E_R3F2_P3C_PATHS,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure
});

export default H_EARTH_RUN_8E_R3F2_P3C_FACADE;
