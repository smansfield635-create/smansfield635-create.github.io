/**
 * H_EARTH_REPOSITORY_REGISTRY_MAP_WIDE_INSTRUMENT_SCOPE_REGISTRATION_v1
 *
 * Read-only exact-path registration for the immutable PR #570 map-wide
 * terrain articulation and estate-reservation instrument control plane.
 * Extends the active C2-R1 exact-head facade without changing the base
 * registry candidate, bootstrap, product, terrain, runtime, or authority.
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
const SOURCE_BRANCH = 'bootstrap/h-earth-map-wide-terrain-estate-instrument-v1-001';
const SOURCE_HEAD = '7c0b8871928b21cd9b2806f058bce34eed11f2ba';
const NODE_ID = 'H_EARTH_MAP_WIDE_TERRAIN_ARTICULATION_ESTATE_RESERVATION_INSTRUMENT';
const CONTROL_ROOT = '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation';

export const H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS = Object.freeze([
  `${CONTROL_ROOT}/AGENTS.md`,
  `${CONTROL_ROOT}/authority-and-lineage.v1.json`,
  `${CONTROL_ROOT}/bootstrap-seed.v1.json`,
  `${CONTROL_ROOT}/bootstrap-termination-policy.v1.json`,
  `${CONTROL_ROOT}/changed-path-manifest.v1.json`,
  `${CONTROL_ROOT}/construction-procedure.v1.json`,
  `${CONTROL_ROOT}/instrument.locator.v1.json`,
  `${CONTROL_ROOT}/negative-fixtures.v1.json`,
  `${CONTROL_ROOT}/operation-request.v1.json`,
  `${CONTROL_ROOT}/operator-family-registry.v1.json`,
  `${CONTROL_ROOT}/progress-ledger.v1.json`,
  `${CONTROL_ROOT}/schemas.v1.json`,
  `${CONTROL_ROOT}/synthetic-map-fixture.v1.json`
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS.map((repositoryPath) => deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: SOURCE_BRANCH,
    commitSha: SOURCE_HEAD,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_HEAD',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_REGISTRATION_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXECUTED_REPOSITORY_AUDIT',
  sourceIdOrPath: `${CONTROL_ROOT}/changed-path-manifest.v1.json`,
  sourceOccurrenceOrRevision: `PR_570_HEAD=${SOURCE_HEAD};EXACT_CONTROL_PATH_COUNT=13`,
  assertionScope: Object.freeze([
    'EXACT_THIRTEEN_CONTROL_PATH_REGISTRATION',
    'IMMUTABLE_PR570_SOURCE_HEAD',
    'READ_ONLY_AUTOMATIC_PREFLIGHT_SCOPE'
  ]),
  verifiedOn: '2026-08-05',
  evidenceLimitations: Object.freeze([
    'NO_PRODUCT_TERRAIN_RENDERER_OR_RUNTIME_AUTHORITY',
    'NO_PR570_MUTATION',
    'NO_INSTRUMENT_ACTIVATION_BY_THIS_AMENDMENT',
    'NO_MERGE_AUTHORITY_BEYOND_SEPARATE_GENERATION_136_RATIFICATION',
    'BASE_REGISTRY_CANDIDATE_AND_BOOTSTRAP_MUST_REMAIN_UNCHANGED'
  ])
});

export const H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'INSTRUMENT_SCOPE_REGISTRATION',
  displayName: 'H-Earth Map-Wide Terrain Instrument Control Plane',
  description: 'Registers the thirteen exact nonproduct control-plane paths of immutable PR #570 for deterministic H-Earth repository preflight.',
  repositoryPaths: [...H_EARTH_MAP_WIDE_INSTRUMENT_CONTROL_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXACT_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_INSTRUCTION',
    'CANONICAL_OPERATION_GENERATION_136',
    'IMMUTABLE_PR570_SOURCE_EVIDENCE'
  ]),
  authorityScope: Object.freeze([
    'READ_ONLY_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_PREFLIGHT',
    'EXACT_CONTROL_PLANE_OCCURRENCE_REGISTRATION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_TERRAIN_MUTATION',
    'NO_RUNTIME_MUTATION',
    'NO_PR570_MUTATION',
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
  allowedMutationScope: 'EXACT_ACCEPTED_AMENDMENT_AND_LOADER_IMPORT_ONLY',
  prohibitedMutations: Object.freeze([
    'BASE_REGISTRY_CANDIDATE_CHANGE',
    'BOOTSTRAP_REPLACEMENT',
    'PRODUCT_OR_TERRAIN_CHANGE',
    'PR570_REWRITE',
    'PREFIX_WIDE_REGISTRATION'
  ]),
  requiredValidations: Object.freeze([
    'ALL_THIRTEEN_PATHS_RESOLVE',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'C2_R1_EXACT_HEAD_REGISTRATION_REMAINS_VALID',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_THIRTEEN',
    'STOP_ON_BASE_REGISTRY_OR_BOOTSTRAP_DRIFT',
    'STOP_ON_C2_R1_REGRESSION',
    'STOP_ON_NEIGHBOR_PATH_RESOLUTION'
  ]),
  currentIdentityReferences: Object.freeze([
    `PR570_HEAD=${SOURCE_HEAD}`,
    'LOCK_GENERATION=136',
    'EXACT_CONTROL_PATH_COUNT=13'
  ]),
  lifecycleStatus: 'CANDIDATE',
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
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE
  ]
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
  const normalizedPath = criteria.repositoryPath == null
    ? null
    : normalizePath(criteria.repositoryPath);
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
