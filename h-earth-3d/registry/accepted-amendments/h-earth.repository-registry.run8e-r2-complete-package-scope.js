/** Read-only accepted-amendment overlay for the complete Run 8E-R2 package through R2E. */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r2e-registry-custody-001';

export const H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-r2-immutable-live-render-package.yml',
  '/.github/workflows/h-earth-run8e-r2b-immutable-buffer-custody.yml',
  '/.github/workflows/h-earth-run8e-r2c-authority-correspondence.yml',
  '/.github/workflows/h-earth-run8e-r2d-gpu-resource-lifecycle.yml',
  '/.github/workflows/h-earth-run8e-r2e-registry-custody.yml',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2b.immutable-buffer-custody.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2c.source-authority-correspondence.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js',
  '/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2e.registry-custody-and-scope-audit.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2-complete-package-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/h-earth-3d/validation/h-earth.run8e-r2.immutable-live-render-package.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2b.immutable-buffer-custody.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2c.source-authority-correspondence.validation.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2d.canonical-gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2d.gpu-resource-lifecycle.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-r2e.registry-custody-and-scope-audit.validation.mjs',
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
  '/showroom/globe/h-earth/render/live-render-package.run8e-r2.js',
  '/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_R2_STACK',
  occurrenceClass: 'RUN_8E_R2_COMPLETE_PACKAGE_PATH'
})));

export const H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_SCOPE_v1',
  evidenceClass: 'BOUNDED_STACKED_CHECKPOINT_EXECUTION_AND_REPOSITORY_SCOPE',
  sourceKind: 'GITHUB_REPOSITORY_AND_ACTIONS_EVIDENCE',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r2/',
  sourceOccurrenceOrRevision: 'R2A_THROUGH_R2E_STACK',
  assertionScope: Object.freeze([
    'R2A_PASS_CLOSED', 'R2B_PASS_CLOSED', 'R2C_PASS_CLOSED', 'R2D_PASS_CLOSED',
    'COMPLETE_R2_PATH_SET_REGISTERED', 'R2E_INDEPENDENT_SCOPE_AUDIT'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    r2AHead: '22b23594005dabdd9374501dae1c561f2dafa648',
    r2BHead: '39de87edefcc037eaafa8a988dc0c84e40e3d1ba',
    r2CHead: '845b6d6acffdd461153b3474044ec533ffd4403b',
    r2DHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    gpuTransportContractId: 'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1'
  }),
  evidenceLimitations: Object.freeze([
    'R2F_NOT_STARTED', 'R3_NOT_STARTED', 'NO_PUBLIC_RENDERER_INSTALLATION', 'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_SCOPE',
  nodeType: 'RECOVERY_ENGINEERING_PACKAGE',
  nodeSubtype: 'RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_STACK',
  displayName: 'H-Earth Run 8E-R2 Complete Package Scope',
  description: 'Registers the bounded R2A-R2E immutable package, custody, correspondence, GPU transport, and registry-audit paths without installing a public renderer.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE.evidenceId]),
  authorityClass: 'BOUNDED_RECOVERY_ENGINEERING_EVIDENCE',
  authorityPosture: 'R2E_AUDIT_OPEN_R2F_NOT_STARTED',
  authoritySource: Object.freeze(['R2A', 'R2B', 'R2C', 'R2D', 'R2E']),
  authorityScope: Object.freeze(['REGISTER_R2_PATHS', 'AUDIT_STACKED_SCOPE', 'PRESERVE_EXECUTION_CUSTODY']),
  authorityLimitations: Object.freeze(['NO_PUBLIC_RENDERER', 'NO_DEPLOYMENT', 'NO_RUN_8E_PASS']),
  parentRelations: Object.freeze([]), childRelations: Object.freeze([]), peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]), downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2A_BEFORE_R2B_BEFORE_R2C_BEFORE_R2D_BEFORE_R2E_BEFORE_R2F']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'REGISTRY_RECEIPT_VALIDATION_WORKFLOW_ONLY',
  prohibitedMutations: Object.freeze(['PUBLIC_ROUTE', 'CAMERA_NAVIGATION_GESTURE', 'VISIBLE_RENDERER', 'R3']),
  requiredValidations: Object.freeze(['ALL_PATHS_RESOLVE', 'AUTOMATIC_PREFLIGHT_PASS', 'INDEPENDENT_SCOPE_AUDIT']),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_RUN_8E_R2F_CLOSURE_AND_PROMOTION_DECISION']),
  currentIdentityReferences: Object.freeze(['9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9']),
  lifecycleStatus: 'R2E_EXECUTION_OPEN',
  unresolvedFields: Object.freeze(['R2E_FINAL_HEAD', 'R2E_PASS_RECEIPT', 'R2F_DECISION'])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) => id === H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE.nodeId
  ? H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) => id === H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE.evidenceId
  ? H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(id);
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES.filter((entry) =>
    (input.path == null || entry.path === input.path) &&
    (input.commitSha == null || entry.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE.nodeId, node: H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE;
  const match = (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}
export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2_COMPLETE_PACKAGE_FACADE;
