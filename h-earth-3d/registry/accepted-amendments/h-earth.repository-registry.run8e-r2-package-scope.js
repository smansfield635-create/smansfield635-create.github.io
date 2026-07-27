/** Cumulative read-only repository-registry overlay for Run 8E-R2 checkpoints A through E. */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r2e-registry-scope-audit-001';
const R2D_PASS_CLOSED_HEAD = '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9';
const R2E_EXECUTION_HEAD = 'b7d4a2553a3a6755d64cb30fab15fd6338a2855e';

export const H_EARTH_RUN_8E_R2_GOVERNED_PATHS = Object.freeze([
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2b.immutable-buffer-custody.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2c.source-authority-correspondence.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2e.registry-and-scope-audit.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2-package-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r2.immutable-live-render-package.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2b.immutable-buffer-custody.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2c.source-authority-correspondence.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2d.canonical-gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2d.gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2e.registry-and-scope-audit.validation.mjs',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-001.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-002.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-003.failure.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.canonical-webgl-probe.js',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.html',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.js',
  '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json',
  '/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js',
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2_GOVERNED_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_BY_R2E_INDEPENDENT_SCOPE_AUDIT',
  occurrenceClass: 'RUN_8E_R2_CUMULATIVE_PACKAGE_SCOPE'
})));

export const H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2_CUMULATIVE_PACKAGE_SCOPE_v1',
  evidenceClass: 'R2A_THROUGH_R2E_CUMULATIVE_REPOSITORY_PACKAGE_AND_EXECUTION_CUSTODY',
  sourceKind: 'STACKED_GITHUB_BRANCH_WORKFLOWS_DURABLE_RECEIPTS_AND_REGISTRY_AUDIT',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json',
  sourceOccurrenceOrRevision: R2E_EXECUTION_HEAD,
  assertionScope: Object.freeze([
    'R2A_PASS_CLOSED',
    'R2B_PASS_CLOSED',
    'R2C_PASS_CLOSED',
    'R2D_PASS_CLOSED',
    'R2E_PASS_CLOSED',
    'CUMULATIVE_R2_GOVERNED_PATH_REGISTRATION',
    'GIT_REGISTRY_LOADER_SCOPE_EQUALITY',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASS',
    'STOP_BEFORE_R2F'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    predecessorR2DHead: R2D_PASS_CLOSED_HEAD,
    r2EExecutionHead: R2E_EXECUTION_HEAD,
    predecessorR2DCustodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e',
    governedPathCount: H_EARTH_RUN_8E_R2_GOVERNED_PATHS.length,
    cumulativeManifestDigest: 'sha256:ac156b619704889790e911c24023bfc23f24d3ec443194a2e6c46211b02663dd',
    cumulativeByteCount: 220755,
    validationRun: 30276376269,
    validationJob: 90011388187,
    evidenceArtifact: 8656954357,
    evidenceArtifactDigest: 'sha256:2c0100cad7169ed1ee40ca750640ff91a698b581e3b079b030f0ed678eaf6289',
    automaticRegistryPreflightRun: 30276376061,
    automaticRegistryPreflightJob: 90011387581,
    automaticRegistryPreflightArtifact: 8656951286,
    automaticRegistryPreflightArtifactDigest: 'sha256:691b44d1bb23af857dc7ecf61cd41222a7a90ef7acfcba31a571a061dcfbba68',
    priorAutomaticPreflightFailureRun: 30240950338,
    priorAutomaticPreflightFailureCode: 'REQUESTED_PATH_UNRESOLVED',
    run8ER2FStarted: false
  }),
  evidenceLimitations: Object.freeze([
    'FINAL_EXACT_HEAD_AUDIT_BOUND_BY_NONRECURSIVE_WORKFLOW_ARTIFACT',
    'R2F_NOT_STARTED',
    'NO_PUBLIC_RENDERER_INSTALLATION',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2_PACKAGE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2_CUMULATIVE_REPOSITORY_PACKAGE',
  nodeType: 'BOUNDED_RECOVERY_ENGINEERING_PACKAGE',
  nodeSubtype: 'R2_IMMUTABLE_PACKAGE_CUSTODY_CORRESPONDENCE_GPU_LIFECYCLE_AND_REGISTRY',
  displayName: 'H-Earth Run 8E-R2 Cumulative Repository Package',
  description: 'Registers the complete governed repository path set for R2A through R2E and binds the predecessor checkpoint receipts, immutable package, canonical GPU transport, and independent scope audit.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2_GOVERNED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceId]),
  authorityClass: 'BOUNDED_R2_ENGINEERING_AND_VALIDATION_PACKAGE',
  authorityPosture: 'R2E_PASS_CLOSED_R2F_NOT_STARTED_RUN8E_FAIL_OPEN',
  authoritySource: Object.freeze([
    'R2A_IMMUTABLE_LIVE_RENDER_PACKAGE',
    'R2B_IMMUTABLE_BUFFER_CUSTODY',
    'R2C_SOURCE_AUTHORITY_CORRESPONDENCE',
    'R2D_CANONICAL_GPU_RESOURCE_LIFECYCLE',
    'R2E_REPOSITORY_REGISTRY_AND_SCOPE_AUDIT'
  ]),
  authorityScope: Object.freeze([
    'REGISTER_CUMULATIVE_R2_GOVERNED_PATHS',
    'BIND_EXECUTION_AND_RECEIPT_CUSTODY',
    'PROVE_SCOPE_SET_EQUALITY',
    'RESOLVE_AUTOMATIC_PREFLIGHT',
    'STOP_BEFORE_R2F'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PUBLIC_ROUTE_MUTATION',
    'NO_CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'NO_SHADER_DRAW_LOOP_OR_VISIBLE_RENDERER',
    'NO_DEPLOYMENT',
    'NO_R2F_OR_R3',
    'NO_RUN_8E_PASS_CLOSED'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'R2A_BEFORE_R2B',
    'R2B_BEFORE_R2C',
    'R2C_BEFORE_R2D',
    'R2D_BEFORE_R2E',
    'R2E_BEFORE_R2F',
    'STOP_BEFORE_R2F'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'REGISTRY_CONTROL_VALIDATION_RECEIPT_WORKFLOW_AND_LOADER_ONLY',
  prohibitedMutations: Object.freeze([
    'IMMUTABLE_PACKAGE_OR_GPU_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_ROUTE_OR_RENDERER_MUTATION',
    'CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'R2F_OR_R3_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'CUMULATIVE_GIT_SCOPE_EQUALS_REGISTRY_PATH_SET',
    'ALL_PATHS_RESOLVE_THROUGH_ACTIVE_LOADER',
    'GIT_BLOB_AND_BYTE_COUNT_FETCHBACK',
    'AUTOMATIC_REGISTRY_PREFLIGHT',
    'FINAL_EXACT_HEAD_R2E_AUDIT'
  ]),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION']),
  currentIdentityReferences: Object.freeze([
    R2D_PASS_CLOSED_HEAD,
    R2E_EXECUTION_HEAD,
    '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
  ]),
  lifecycleStatus: 'R2E_PASS_CLOSED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R2_GOVERNED_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R2_PACKAGE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R2_PACKAGE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId
    ? H_EARTH_RUN_8E_R2_PACKAGE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R2_PACKAGE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId, node: H_EARTH_RUN_8E_R2_PACKAGE_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R2_PACKAGE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R2_PACKAGE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R2_PACKAGE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R2_PACKAGE_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2_PACKAGE_FACADE;
