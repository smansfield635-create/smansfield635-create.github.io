/**
 * H_EARTH_REPOSITORY_REGISTRY_MAP_WIDE_INSTRUMENT_PERMANENT_ACTIVATION_v1
 *
 * Exact accepted-occurrence registration for the separately ratified
 * PR #570 map-wide terrain articulation and estate-reservation instrument.
 * The immutable bootstrap source remains historical and inactive; this facade
 * binds the ratified package commit and its exact thirteen control-plane blobs.
 */

import baseFacade from './h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

const normalizePath = (value) => {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const IMMUTABLE_SOURCE_HEAD = '7c0b8871928b21cd9b2806f058bce34eed11f2ba';
const PACKAGE_COMMIT = 'a1076744a3a3f330ef31638867f0b48d6cc87047';
const NODE_ID = 'H_EARTH_MAP_WIDE_TERRAIN_ARTICULATION_ESTATE_RESERVATION_INSTRUMENT';
const CONTROL_ROOT = '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation';

const VERIFIED_OCCURRENCES = Object.freeze([
  [`${CONTROL_ROOT}/AGENTS.md`, '2d32770771519986bd3d69fa7cd5b8d63e491d14'],
  [`${CONTROL_ROOT}/authority-and-lineage.v1.json`, 'f503f00b4767260205650f326c3b4238b5ef80cb'],
  [`${CONTROL_ROOT}/bootstrap-seed.v1.json`, 'e40b2494dcaeae1ef540ce01956eb4125e61e567'],
  [`${CONTROL_ROOT}/bootstrap-termination-policy.v1.json`, '4299903a044d0696b58a434d0e60b10420cece7e'],
  [`${CONTROL_ROOT}/changed-path-manifest.v1.json`, '9b37a2a7875716719c1285efc4e941d1e75df14b'],
  [`${CONTROL_ROOT}/construction-procedure.v1.json`, '7aac442e32dc2a7ebc6f5a048b2346a82d9cab5c'],
  [`${CONTROL_ROOT}/instrument.locator.v1.json`, '5e356ccdc8f5f9a053b1f9c040ded92d19d0e112'],
  [`${CONTROL_ROOT}/negative-fixtures.v1.json`, 'a5d3c2605d83ec1e2de97050b1ce914defcff45e'],
  [`${CONTROL_ROOT}/operation-request.v1.json`, 'fd7af3a74e848a72dc4795bacd626fe6bb0ac203'],
  [`${CONTROL_ROOT}/operator-family-registry.v1.json`, '9f51711f695845e3f64d5c81854099855fad95b6'],
  [`${CONTROL_ROOT}/progress-ledger.v1.json`, '8d538ab9fd0060df827e356f90d9f92606dabf64'],
  [`${CONTROL_ROOT}/schemas.v1.json`, '45df11051fb78a7b9df52c9dff532a5c5e7dfdf5'],
  [`${CONTROL_ROOT}/synthetic-map-fixture.v1.json`, '6cba4bfdf12a39dde65ee05674a92e350dc92562']
]);

export const H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath]) => repositoryPath)
);

const OCCURRENCES = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath, gitBlobSha]) => deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: PACKAGE_COMMIT,
    commitSha: PACKAGE_COMMIT,
    path: repositoryPath,
    gitBlobSha,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED',
    occurrenceClass: 'ACCEPTED'
  }))
);

export const H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_MAP_WIDE_INSTRUMENT_PERMANENT_ACTIVATION_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'LOCAL_VALIDATION',
  sourceIdOrPath: `${CONTROL_ROOT}/progress-ledger.v1.json`,
  sourceOccurrenceOrRevision: `IMMUTABLE_SOURCE_HEAD=${IMMUTABLE_SOURCE_HEAD};RATIFIED_PACKAGE_COMMIT=${PACKAGE_COMMIT};LOCK_GENERATION=150;EXACT_CONTROL_PATH_COUNT=13`,
  assertionScope: Object.freeze([
    'EXACT_THIRTEEN_ACCEPTED_CONTROL_PATH_OCCURRENCES',
    'IMMUTABLE_PR570_BOOTSTRAP_SOURCE_PRESERVED',
    'SEPARATE_PERMANENT_RATIFICATION_LIFECYCLE',
    'ACTIVE_AUTOMATIC_H_EARTH_PREFLIGHT_SCOPE'
  ]),
  verifiedOn: '2026-08-05',
  evidenceLimitations: Object.freeze([
    'NO_ACTUAL_TERRAIN_MUTATION_AUTHORITY',
    'NO_MANOR_CONSTRUCTION_AUTHORITY',
    'NO_PRODUCT_RENDERER_RUNTIME_DEPLOYMENT_OR_RELEASE_AUTHORITY',
    'NO_AUTOMATIC_CANDIDATE_MERGE',
    'NO_INHERITED_OPERATION_AUTHORITY',
    'BASE_REGISTRY_CANDIDATE_AND_BOOTSTRAP_REMAIN_UNCHANGED'
  ])
});

export const H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'PERMANENT_NONPRODUCT_INSTRUMENT',
  displayName: 'H-Earth Map-Wide Terrain Instrument — Permanent Active',
  description: 'Registers the separately ratified permanent nonproduct map-wide terrain articulation and estate-reservation instrument at one exact package commit and thirteen accepted control-plane blobs.',
  repositoryPaths: [...H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'ACTIVE_PERMANENT_INSTRUMENT_EXACT_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_INSTRUCTION',
    'IMMUTABLE_PR570_CERTIFIED_BOOTSTRAP_SOURCE',
    'CANONICAL_OPERATION_GENERATION_150',
    'INTERNAL_REGISTRY_GENERATION_136_PASS_CLOSED'
  ]),
  authorityScope: Object.freeze([
    'MAP_WIDE_TERRAIN_CENSUS',
    'ESTATE_RESERVATION_VALIDATION',
    'ZONE_ARTICULATION_PLANNING',
    'CONTINUOUS_ORCHESTRATION_PLANNING',
    'CUMULATIVE_CONSTRAINT_EVALUATION',
    'VARIANCE_AND_REPETITION_DETECTION',
    'EXACT_CANDIDATE_PREVIEW_PACKAGE_PLANNING',
    'INDEPENDENT_REPRODUCTION',
    'READ_ONLY_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_PREFLIGHT'
  ]),
  authorityLimitations: Object.freeze([
    'NO_ACTUAL_TERRAIN_MUTATION_WITHOUT_SEPARATE_ADMISSION',
    'NO_MANOR_CONSTRUCTION_WITHOUT_SEPARATE_ADMISSION',
    'NO_PRODUCT_MUTATION',
    'NO_RENDERER_OR_RUNTIME_MUTATION',
    'NO_DEPLOYMENT_OR_RELEASE',
    'NO_AUTOMATIC_CANDIDATE_MERGE',
    'NO_INHERITED_OPERATION_AUTHORITY',
    'NO_BASE_REGISTRY_CANDIDATE_CHANGE',
    'NO_BOOTSTRAP_CHANGE',
    'NO_GENERAL_PREFIX_REGISTRATION'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'SEPARATELY_ADMITTED_INSTRUMENT_OPERATIONS_ONLY',
  prohibitedMutations: Object.freeze([
    'BASE_REGISTRY_CANDIDATE_CHANGE',
    'BOOTSTRAP_REPLACEMENT',
    'PRODUCT_OR_TERRAIN_CHANGE_WITHOUT_SEPARATE_ADMISSION',
    'PR570_REWRITE',
    'PREFIX_WIDE_REGISTRATION',
    'AUTHORITY_INHERITANCE'
  ]),
  requiredValidations: Object.freeze([
    'ALL_THIRTEEN_PATHS_RESOLVE_TO_EXACT_ACCEPTED_OCCURRENCES',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'C2_R1_EXACT_HEAD_REGISTRATION_REMAINS_VALID',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_PASS',
    'SEPARATE_OPERATION_ADMISSION_BEFORE_ANY_TERRAIN_MUTATION'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_THIRTEEN',
    'STOP_ON_BASE_REGISTRY_OR_BOOTSTRAP_DRIFT',
    'STOP_ON_C2_R1_REGRESSION',
    'STOP_ON_NEIGHBOR_PATH_RESOLUTION',
    'STOP_BEFORE_ANY_UNADMITTED_PRODUCT_OR_TERRAIN_OPERATION'
  ]),
  currentIdentityReferences: Object.freeze([
    `PR570_SOURCE_HEAD=${IMMUTABLE_SOURCE_HEAD}`,
    `RATIFIED_PACKAGE_COMMIT=${PACKAGE_COMMIT}`,
    'LOCK_GENERATION=150',
    'INTERNAL_REGISTRY_GENERATION=136_PASS_CLOSED',
    'EXACT_CONTROL_PATH_COUNT=13'
  ]),
  lifecycleStatus: 'ACTIVE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  return deepFreeze({
    repositoryPath: normalized,
    resolved: true,
    nodes: [indexed.node],
    occurrences: indexed.occurrences,
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES
    .filter((entry) => {
      if (normalizedPath != null && entry.path !== normalizedPath) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      return true;
    })
    .map((occurrence) => deepFreeze({
      nodeId: NODE_ID,
      node: H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({
    query: base.query,
    matches: [...base.matches, ...localMatches],
    resolved: base.resolved || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const normalizedPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const base = baseFacade.findHEarthRepositoryRegistryNodes({
    ...criteria,
    ...(normalizedPath == null ? {} : { repositoryPath: normalizedPath })
  });
  const node = H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE;
  const matches =
    (normalizedPath == null || node.repositoryPaths.includes(normalizedPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}

export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === NODE_ID) {
    return deepFreeze({
      nodeId,
      nodes: [H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_REGISTERED_FACADE = deepFreeze({
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

export default H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_REGISTERED_FACADE;
