/** Read-only execution-evidence overlay for the Run 8E-R1 material-ledger package. */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r1-material-ledger-preservation-001';
const VALIDATED_CORE_HEAD = '799b3429259e08ac6afb687a50fdcf52e6d418a9';
const RECEIPT_PATH = '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.material-ledger.preservation.receipt.json';

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_PATHS = Object.freeze([
  RECEIPT_PATH,
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js',
  '/h-earth-3d/validation/h-earth.run8e-r1.material-ledger-execution.validation.mjs',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/.github/workflows/h-earth-run8e-r1-material-ledger.yml'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_R1_MATERIAL_LEDGER_EXECUTION_BRANCH',
  occurrenceClass: 'RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE'
})));

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_v1',
  evidenceClass: 'EXECUTED_MATERIAL_LEDGER_VALIDATION_AND_REGISTRY_PREFLIGHT',
  sourceKind: 'GITHUB_ACTIONS_EXECUTION_AND_DURABLE_REPOSITORY_RECEIPT',
  sourceIdOrPath: RECEIPT_PATH,
  sourceOccurrenceOrRevision: VALIDATED_CORE_HEAD,
  assertionScope: Object.freeze([
    'MATERIAL_LEDGER_VALIDATION_PASS',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT_PASS',
    'THREE_RECEIPT_IDENTITIES_VALIDATED',
    'BOUNDED_EVIDENCE_ONLY_SCOPE_PASS',
    'RUN_8E_R2_STOPPING_BOUNDARY_PASS'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    validationRun: 30232602384,
    validationJob: 89874157308,
    evidenceArtifact: 8640568574,
    evidenceArtifactDigest: 'sha256:e5044d0c88fede5d2ce6114b7dc80466371435a69b16d33e0d53aeefd39859ba',
    automaticRegistryPreflightRun: 30232602326,
    automaticRegistryPreflightJob: 89874157263,
    automaticRegistryPreflightConclusion: 'success',
    run8ER2Started: false
  }),
  evidenceLimitations: Object.freeze([
    'VALIDATED_CORE_HEAD_PRECEDES_DURABLE_EXECUTION_RECEIPT_COMMIT',
    'FINAL_HEAD_REVALIDATION_REQUIRED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE',
  nodeType: 'EXECUTED_RECOVERY_EVIDENCE_PACKET',
  nodeSubtype: 'R1_MATERIAL_LEDGER_PASS_AND_R2_STOPPING_BOUNDARY',
  displayName: 'H-Earth Run 8E-R1 Material Ledger Execution Evidence',
  description: 'Binds the successful material-ledger workflow, automatic registry preflight, durable execution receipt, and explicit stopping boundary before R2.',
  repositoryPaths: [...H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE.evidenceId]),
  authorityClass: 'EXECUTED_EVIDENCE_PRESERVATION_VALIDATION',
  authorityPosture: 'R1_DIAGNOSTIC_PASS_CLOSED_R2_NOT_STARTED',
  authoritySource: Object.freeze([
    'RUN_8E_R1_MATERIAL_LEDGER_WORKFLOW',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT',
    'DURABLE_EXECUTION_RECEIPT'
  ]),
  authorityScope: Object.freeze([
    'BIND_EXECUTION_IDENTITIES',
    'CONFIRM_R1_DIAGNOSTIC_CLOSURE',
    'CONFIRM_R2_AUTHORIZED_BUT_NOT_STARTED',
    'STOP_BEFORE_R2'
  ]),
  authorityLimitations: Object.freeze([
    'NO_REFERENCE_DEVICE_USABILITY_PASS',
    'NO_RUN_8E_PASS_CLOSED',
    'NO_R2_IMPLEMENTATION'
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
    'CORE_LEDGER_VALIDATION_BEFORE_EXECUTION_RECEIPT',
    'FINAL_HEAD_REVALIDATION_BEFORE_MERGE',
    'MERGE_BEFORE_R2',
    'STOP_BEFORE_R2'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'EXECUTION_RECEIPT_REGISTRY_VALIDATION_WORKFLOW_ONLY',
  prohibitedMutations: Object.freeze([
    'PUBLIC_ROUTE_OR_RENDERER_MUTATION',
    'WORLD_CAMERA_OR_NAVIGATION_MUTATION',
    'RUN_8E_R2_IMPLEMENTATION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'EXECUTION_RECEIPT_SCHEMA_AND_IDENTITY',
    'FINAL_HEAD_MATERIAL_LEDGER_WORKFLOW',
    'FINAL_HEAD_AUTOMATIC_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION']),
  currentIdentityReferences: Object.freeze([VALIDATED_CORE_HEAD, RECEIPT_PATH]),
  lifecycleStatus: 'EXECUTION_RECEIPT_PRESERVED_FINAL_HEAD_VALIDATION_PENDING',
  unresolvedFields: Object.freeze(['FINAL_HEAD', 'FINAL_VALIDATION_RUN', 'MERGE_COMMIT'])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId
    ? H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_EVIDENCE
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
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId, node: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EXECUTION_FACADE;
