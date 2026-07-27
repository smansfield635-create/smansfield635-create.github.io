/** Read-only registry overlay for Run 8E-R2 checkpoints A through E. */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const R2A_HEAD = '22b23594005dabdd9374501dae1c561f2dafa648';
const R2B_HEAD = '39de87edefcc037eaafa8a988dc0c84e40e3d1ba';
const R2C_HEAD = '845b6d6acffdd461153b3474044ec533ffd4403b';
const R2D_HEAD = '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9';
const R2E_BRANCH = 'agent/h-earth-run8e-r2e-registry-custody-audit-001';

export const H_EARTH_RUN_8E_R2_PACKAGE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2-immutable-live-render-package.yml',
  '/.github/workflows/h-earth-run8e-r2b-immutable-buffer-custody.yml',
  '/.github/workflows/h-earth-run8e-r2c-authority-correspondence.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2b.immutable-buffer-custody.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2c.source-authority-correspondence.js',
  '/h-earth-3d/validation/h-earth.run8e-r2.immutable-live-render-package.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2b.immutable-buffer-custody.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2c.source-authority-correspondence.validation.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.js'
]);

export const H_EARTH_RUN_8E_R2_GPU_TRANSPORT_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2d-gpu-resource-lifecycle.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js',
  '/h-earth-3d/validation/h-earth.run8e-r2d.canonical-gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2d.gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-002.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-003.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.canonical-webgl-probe.js',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.html',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.js',
  '/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'
]);

export const H_EARTH_RUN_8E_R2E_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2e-registry-custody-audit.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2e.registry-custody-and-scope-audit.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r2e.registry-custody-and-scope-audit.validation.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
]);

export const H_EARTH_RUN_8E_R2_ALL_PATHS = Object.freeze([
  ...H_EARTH_RUN_8E_R2_PACKAGE_PATHS,
  ...H_EARTH_RUN_8E_R2_GPU_TRANSPORT_PATHS,
  ...H_EARTH_RUN_8E_R2E_PATHS
]);

function occurrence(repositoryPath, refName, occurrenceClass, existenceStatus = 'PRESENT') {
  return freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus,
    fetchbackStatus: existenceStatus === 'PRESENT' ? 'VERIFIED_ON_STACKED_R2_BRANCH' : 'PENDING_R2E_CLOSURE',
    occurrenceClass
  });
}

const PACKAGE_OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2_PACKAGE_PATHS.map((repositoryPath) =>
  occurrence(repositoryPath, 'agent/h-earth-run8e-r2c-authority-correspondence-001', 'RUN_8E_R2_IMMUTABLE_PACKAGE_AND_CORRESPONDENCE')));
const GPU_OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2_GPU_TRANSPORT_PATHS.map((repositoryPath) =>
  occurrence(repositoryPath, 'agent/h-earth-run8e-r2d-gpu-resource-lifecycle-001', 'RUN_8E_R2D_GPU_TRANSPORT_AND_RESOURCE_LIFECYCLE')));
const R2E_OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2E_PATHS.map((repositoryPath) =>
  occurrence(repositoryPath, R2E_BRANCH, 'RUN_8E_R2E_REGISTRY_AND_SCOPE_CUSTODY',
    repositoryPath.endsWith('h-earth.run8e-r2e.pass-closed.receipt.json') ? 'PENDING' : 'PRESENT')));

export const H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2_IMMUTABLE_PACKAGE_AND_CORRESPONDENCE_v1',
  evidenceClass: 'R2A_R2B_R2C_EXECUTED_PACKAGE_CUSTODY_AND_CORRESPONDENCE',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_AND_DURABLE_REPOSITORY_RECEIPTS',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/',
  sourceOccurrenceOrRevision: R2C_HEAD,
  assertionScope: Object.freeze([
    'R2A_CORE_PACKAGE_PASS_CLOSED',
    'R2B_IMMUTABLE_BUFFER_CUSTODY_PASS_CLOSED',
    'R2C_SOURCE_AUTHORITY_CORRESPONDENCE_PASS_CLOSED',
    'PACKAGE_IDENTITY_FD913C25',
    'PACKAGE_CONTENT_DIGEST_FD913C25',
    'PRIMITIVE_MEMBERSHIP_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_ESTABLISHED'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    r2AHead: R2A_HEAD,
    r2BHead: R2B_HEAD,
    r2CHead: R2C_HEAD,
    packageGitBlobSha: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25',
    custodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d',
    correspondenceAuditManifestDigest: 'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe'
  }),
  evidenceLimitations: Object.freeze(['NO_PUBLIC_RENDERER_INSTALLATION', 'RUN_8E_REMAINS_FAIL_OPEN'])
});

export const H_EARTH_RUN_8E_R2D_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2D_GPU_TRANSPORT_AND_RESOURCE_LIFECYCLE_v1',
  evidenceClass: 'CANONICAL_GPU_TRANSPORT_AND_RESOURCE_LIFECYCLE_PASS_CLOSED',
  sourceKind: 'GITHUB_ACTIONS_WEBGL2_EXECUTION_AND_DURABLE_REPOSITORY_RECEIPT',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
  sourceOccurrenceOrRevision: R2D_HEAD,
  assertionScope: Object.freeze([
    'R2D_GPU_UPLOAD_RESOURCE_LIFECYCLE_PASS_CLOSED',
    'CANONICAL_GPU_UPLOAD_BYTES_EXACT_ACROSS_NODE_AND_CHROMIUM',
    'TWENTY_SEVEN_GPU_BUFFERS_CREATED_AND_DELETED',
    'CONTEXT_LOSS_AND_RESTORATION_PASS',
    'NO_SHADER_PROGRAM_DRAW_CALL_RENDER_LOOP_OR_VISIBLE_PRESENTATION'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    r2DHead: R2D_HEAD,
    executionRun: 30240226591,
    executionJob: 89895687377,
    executionArtifact: 8642985618,
    executionArtifactDigest: 'sha256:9b1006036a93bfb3cf6c532c21068a37d5013ab5f8d1635cdd917655870de03c',
    closureRun: 30240950430,
    closureJob: 89897847174,
    closureArtifact: 8643236615,
    closureArtifactDigest: 'sha256:6e8f87f8b30fd7bb5fc889d3c0d238da64ce555163a416c6d3b878c5261bdc23',
    custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e'
  }),
  evidenceLimitations: Object.freeze(['CI_SWIFTSHADER_IS_NOT_PHYSICAL_PERFORMANCE_AUTHORITY', 'NO_VISIBLE_PRESENTATION'])
});

export const H_EARTH_RUN_8E_R2E_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2E_REGISTRY_CUSTODY_AND_SCOPE_AUDIT_v1',
  evidenceClass: 'REGISTRY_REPRESENTATION_AND_INDEPENDENT_SCOPE_AUDIT_CANDIDATE',
  sourceKind: 'STACKED_BRANCH_REGISTRY_OVERLAY_AND_READ_ONLY_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json',
  sourceOccurrenceOrRevision: R2E_BRANCH,
  assertionScope: Object.freeze([
    'ALL_R2_GOVERNED_PATHS_REGISTERED',
    'AUTOMATIC_REGISTRY_PREFLIGHT_REQUIRED',
    'INDEPENDENT_STACKED_SCOPE_AUDIT_REQUIRED',
    'STOP_BEFORE_R2F'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({ predecessorR2DHead: R2D_HEAD, branch: R2E_BRANCH }),
  evidenceLimitations: Object.freeze(['R2E_PASS_RECEIPT_PENDING', 'R2F_NOT_STARTED', 'RUN_8E_REMAINS_FAIL_OPEN'])
});

function node({ nodeId, nodeSubtype, displayName, description, paths, occurrences, evidence, authorityClass, authorityPosture, scope, limitations, requiredValidations, stoppingBoundaries, lifecycleStatus }) {
  return freeze({
    nodeId,
    nodeType: 'RUN_8E_R2_GOVERNED_CHECKPOINT_PACKAGE',
    nodeSubtype,
    displayName,
    description,
    repositoryPaths: [...paths],
    repositoryOccurrences: occurrences,
    evidenceClass: evidence.evidenceClass,
    evidenceReferences: Object.freeze([evidence.evidenceId]),
    authorityClass,
    authorityPosture,
    authoritySource: Object.freeze(['RUN_8E_R2_BOUNDED_CHECKPOINT_SEQUENCE', 'DURABLE_EXECUTION_RECEIPTS']),
    authorityScope: Object.freeze(scope),
    authorityLimitations: Object.freeze(limitations),
    parentRelations: Object.freeze([]),
    childRelations: Object.freeze([]),
    peerRelations: Object.freeze([]),
    upstreamBoundaries: Object.freeze([]),
    downstreamBoundaries: Object.freeze([]),
    cardinalRole: 'NONE',
    cardinalStatus: 'NONE',
    cardinalCompleteness: 'NOT_APPLICABLE',
    orderingRules: Object.freeze(['R2A_BEFORE_R2B', 'R2B_BEFORE_R2C', 'R2C_BEFORE_R2D', 'R2D_BEFORE_R2E', 'R2E_BEFORE_R2F']),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope: 'BOUNDED_CHECKPOINT_PACKAGE_ONLY',
    prohibitedMutations: Object.freeze(['PUBLIC_ROUTE_MUTATION', 'RUN_8E_PASS_CLOSED', 'R2F_OR_R3_EXECUTION_INSIDE_R2E']),
    requiredValidations: Object.freeze(requiredValidations),
    stoppingBoundaries: Object.freeze(stoppingBoundaries),
    currentIdentityReferences: Object.freeze([R2A_HEAD, R2B_HEAD, R2C_HEAD, R2D_HEAD]),
    lifecycleStatus,
    unresolvedFields: Object.freeze([])
  });
}

export const H_EARTH_RUN_8E_R2_PACKAGE_NODE = node({
  nodeId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_CHECKPOINTS_A_TO_C',
  nodeSubtype: 'R2A_R2B_R2C_PACKAGE_CONSTRUCTION_CUSTODY_AND_CORRESPONDENCE',
  displayName: 'H-Earth Run 8E-R2 Immutable Live Render Package',
  description: 'Registers the immutable package construction, deterministic custody, and source-authority correspondence checkpoints.',
  paths: H_EARTH_RUN_8E_R2_PACKAGE_PATHS,
  occurrences: PACKAGE_OCCURRENCES,
  evidence: H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE,
  authorityClass: 'BOUNDED_IMMUTABLE_RENDER_PACKAGE_CONSTRUCTION_EVIDENCE',
  authorityPosture: 'R2A_R2B_R2C_PASS_CLOSED',
  scope: ['PACKAGE_CONSTRUCTION', 'IMMUTABLE_BUFFER_CUSTODY', 'SOURCE_AUTHORITY_CORRESPONDENCE'],
  limitations: ['NO_GPU_RESOURCE_AUTHORITY', 'NO_PUBLIC_RENDERER'],
  requiredValidations: ['R2A_PASS_RECEIPT', 'R2B_CUSTODY_RECEIPT', 'R2C_CORRESPONDENCE_RECEIPT'],
  stoppingBoundaries: ['STOP_BEFORE_R2D_GPU_RESOURCE_LIFECYCLE'],
  lifecycleStatus: 'R2A_R2B_R2C_PASS_CLOSED'
});

export const H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE = node({
  nodeId: 'H_EARTH_RUN_8E_R2D_CANONICAL_GPU_TRANSPORT_AND_RESOURCE_LIFECYCLE',
  nodeSubtype: 'R2D_CANONICAL_GPU_TRANSPORT_RESOURCE_CUSTODY',
  displayName: 'H-Earth Run 8E-R2D Canonical GPU Transport',
  description: 'Registers the deterministic GPU transport adapter, WebGL2 upload lifecycle, failed-attempt custody, and pass-closed receipt.',
  paths: H_EARTH_RUN_8E_R2_GPU_TRANSPORT_PATHS,
  occurrences: GPU_OCCURRENCES,
  evidence: H_EARTH_RUN_8E_R2D_EVIDENCE,
  authorityClass: 'BOUNDED_GPU_TRANSPORT_AND_RESOURCE_LIFECYCLE_EVIDENCE',
  authorityPosture: 'R2D_PASS_CLOSED_NO_VISIBLE_PRESENTATION',
  scope: ['CANONICAL_GPU_UPLOAD_VIEWS', 'GPU_BUFFER_CREATE_UPLOAD_DELETE', 'CONTEXT_LOSS_RESTORATION'],
  limitations: ['NO_SHADER', 'NO_DRAW_CALL', 'NO_RENDER_LOOP', 'NO_PHYSICAL_PERFORMANCE_CLAIM'],
  requiredValidations: ['CROSS_RUNTIME_GPU_BYTE_EXACTNESS', 'RESOURCE_LIFECYCLE', 'R2D_PASS_RECEIPT'],
  stoppingBoundaries: ['STOP_BEFORE_R2E_REGISTRY_CUSTODY'],
  lifecycleStatus: 'R2D_PASS_CLOSED'
});

export const H_EARTH_RUN_8E_R2E_NODE = node({
  nodeId: 'H_EARTH_RUN_8E_R2E_REGISTRY_CUSTODY_AND_SCOPE_AUDIT',
  nodeSubtype: 'R2E_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
  displayName: 'H-Earth Run 8E-R2E Registry Custody',
  description: 'Registers the R2 stack, validates active-loader path resolution, binds durable execution custody, and stops before R2F.',
  paths: H_EARTH_RUN_8E_R2E_PATHS,
  occurrences: R2E_OCCURRENCES,
  evidence: H_EARTH_RUN_8E_R2E_EVIDENCE,
  authorityClass: 'REGISTRY_REPRESENTATION_AND_INDEPENDENT_SCOPE_AUDIT',
  authorityPosture: 'R2E_EXECUTION_OPEN_R2F_NOT_STARTED',
  scope: ['REGISTER_R2_PATHS', 'AUDIT_STACKED_SCOPE', 'BIND_DURABLE_EXECUTION_CUSTODY'],
  limitations: ['NO_R2_CLOSURE_PROMOTION', 'NO_R3', 'RUN_8E_FAIL_OPEN'],
  requiredValidations: ['ACTIVE_LOADER_RESOLUTION', 'AUTOMATIC_PREFLIGHT_PASS', 'INDEPENDENT_SCOPE_AUDIT'],
  stoppingBoundaries: ['STOP_BEFORE_R2F_CLOSURE_AND_PROMOTION_DECISION'],
  lifecycleStatus: 'R2E_EXECUTION_OPEN'
});

const LOCAL_NODES = Object.freeze([
  H_EARTH_RUN_8E_R2_PACKAGE_NODE,
  H_EARTH_RUN_8E_R2_GPU_TRANSPORT_NODE,
  H_EARTH_RUN_8E_R2E_NODE
]);
const LOCAL_EVIDENCE = Object.freeze([
  H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE,
  H_EARTH_RUN_8E_R2D_EVIDENCE,
  H_EARTH_RUN_8E_R2E_EVIDENCE
]);
const LOCAL_OCCURRENCES = Object.freeze([...PACKAGE_OCCURRENCES, ...GPU_OCCURRENCES, ...R2E_OCCURRENCES]);
const pathIndex = new Map();
for (const currentNode of LOCAL_NODES) {
  for (const repositoryPath of currentNode.repositoryPaths) {
    const prior = pathIndex.get(repositoryPath) ?? [];
    prior.push(currentNode);
    pathIndex.set(repositoryPath, prior);
  }
}

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, ...LOCAL_EVIDENCE],
  nodes: [...baseInstance.nodes, ...LOCAL_NODES]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  LOCAL_NODES.find((entry) => entry.nodeId === id) ?? baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  LOCAL_EVIDENCE.find((entry) => entry.evidenceId === id) ?? baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const nodes = pathIndex.get(repositoryPath) ?? [];
  if (nodes.length === 0) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  const occurrences = LOCAL_OCCURRENCES.filter((entry) => entry.path === repositoryPath);
  return freeze({ repositoryPath, resolved: true, nodes, occurrences, unresolved: false });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = LOCAL_OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .flatMap((occurrence) => (pathIndex.get(occurrence.path) ?? []).map((currentNode) =>
      freeze({ nodeId: currentNode.nodeId, node: currentNode, occurrence })));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const local = LOCAL_NODES.filter((currentNode) =>
    (criteria.repositoryPath == null || currentNode.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === currentNode.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === currentNode.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === currentNode.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === currentNode.lifecycleStatus));
  return freeze([...base, ...local]);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  LOCAL_NODES.some((entry) => entry.nodeId === id)
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) => {
  const currentNode = LOCAL_NODES.find((entry) => entry.nodeId === id);
  return currentNode
    ? freeze({ nodeId: id, nodes: [currentNode], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);
};

export const H_EARTH_RUN_8E_R2_REGISTRY_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2_REGISTRY_FACADE;
