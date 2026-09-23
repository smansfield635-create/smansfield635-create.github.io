/**
 * H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_SCOPE_v1
 *
 * Read-only exact-head registration for the six governance-successor files
 * materialized at immutable Commit A. This facade extends the corrected
 * inter-hill evaluator V2 registry without modifying or replacing that node.
 */

import baseFacade from './h-earth.repository-registry.inter-hill-estate-successor-evaluator-exact-head-v2.js';

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
const SOURCE_HEAD = '563464f3b8b5b8045677962986e3ba00fbeed960';
const SOURCE_TREE = 'f26d3acb6d45ce642c3efa048809a3740256b770';
const SOURCE_BRANCH = 'agent/h-earth-v2-governance-successor-001';
const NODE_ID = 'H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_SCOPE';
const PARENT_NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_V2';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_SCOPE_v1';
const CONTROL_ROOT = '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/router-instruction-lock-closure-successor';

const VERIFIED_OCCURRENCES = Object.freeze([
  [`${CONTROL_ROOT}/changed-path-manifest.v1.json`, 'ce473c359101e55929af4a86069dbd3dd95e14c3'],
  [`${CONTROL_ROOT}/closure-request.lock-279.v1.json`, '193fc3d8c29a26cb391534f8350a0b5ab97a563f'],
  [`${CONTROL_ROOT}/contract.v1.json`, '322d56de20ad3f59d89b8d6211a35a7b44ec4c3f'],
  [`${CONTROL_ROOT}/negative-fixtures.v1.json`, '431ac6dff4fa9591cda6985e117c291d729d47ed'],
  [`${CONTROL_ROOT}/rollback.v1.json`, '876fe9971db7c4259e39e5127370c3af44f11238'],
  [`${CONTROL_ROOT}/verify.v1.mjs`, '3da81d3efb60cba9f0afaf96e9ba22bc9bd1193d']
]);

export const H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_PATHS = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath]) => repositoryPath)
);

const OCCURRENCES = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath, gitBlobSha]) => deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: SOURCE_HEAD,
    commitSha: SOURCE_HEAD,
    path: repositoryPath,
    gitBlobSha,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_HEAD_AND_BLOB',
    occurrenceClass: 'CONTROL_PLANE_EXACT_HEAD_AND_BLOB_OCCURRENCE_SUCCESSOR_REGISTRATION'
  }))
);

export const H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'CONTROL_PLANE_EXACT_HEAD_AND_BLOB_OCCURRENCE_SUCCESSOR_REGISTRATION',
  sourceKind: 'LOCAL_VALIDATION',
  sourceIdOrPath: `COMMIT_A_${SOURCE_HEAD}`,
  sourceOccurrenceOrRevision: `BRANCH=${SOURCE_BRANCH};HEAD=${SOURCE_HEAD};TREE=${SOURCE_TREE};EXACT_PATH_COUNT=6`,
  sourceHead: SOURCE_HEAD,
  sourceTree: SOURCE_TREE,
  sourceBranch: SOURCE_BRANCH,
  exactPathCount: 6,
  instrumentClass: 'NONPRODUCT_REPOSITORY_GOVERNANCE_SUCCESSOR',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'SIX_EXACT_GOVERNANCE_SUCCESSOR_PATHS',
    'SIX_EXACT_COMMIT_A_HEAD_AND_BLOB_OCCURRENCES',
    'CORRECTED_INTER_HILL_V2_REGISTRATION_PRESERVED',
    'MAP_WIDE_INSTRUMENT_REGISTRATION_PRESERVED',
    'C2_R1_REGISTRATION_PRESERVED',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED'
  ]),
  verifiedOn: '2026-08-05',
  evidenceLimitations: Object.freeze([
    'NO_GENERAL_PREFIX_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_RESOLUTION',
    'NO_LOCK_279_OR_280_CLOSURE_AUTHORITY',
    'NO_TERRAIN_MANOR_PRODUCT_OR_RUNTIME_AUTHORITY',
    'NO_COMMIT_A_MUTATION',
    'NO_V2_IMPLEMENTATION_AUTHORITY',
    'NO_DEPLOYMENT_OR_RELEASE_AUTHORITY'
  ])
});

export const H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'NONPRODUCT_GOVERNANCE_SUCCESSOR_EXACT_HEAD_SCOPE',
  displayName: 'H-Earth V2 Router Instruction and Lock-Closure Successor — Exact Six-Path Scope',
  description: 'Registers exactly six nonproduct governance-successor files and immutable Commit A blob occurrences so the existing fail-closed preflight can evaluate the preserved construction checkpoint.',
  parentScope: PARENT_NODE_ID,
  parentScopeNodeId: PARENT_NODE_ID,
  repositoryPaths: [...H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'CONTROL_PLANE_EXACT_HEAD_PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'USER_ORIGIN_BOUNDED_REGISTRY_REPAIR',
    'H_EARTH_V2_ROUTER_INSTRUCTION_AND_LOCK_CLOSURE_SUCCESSOR_ROLE_1_CONSTRUCTION_RETURN_v1',
    `COMMIT_A_${SOURCE_HEAD}`
  ]),
  authorityScope: Object.freeze([
    'READ_ONLY_EXACT_PATH_RESOLUTION',
    'EXACT_COMMIT_A_HEAD_AND_BLOB_OCCURRENCE_VERIFICATION',
    'AUTOMATIC_H_EARTH_PREFLIGHT_SCOPE_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_GENERAL_PREFIX_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_RESOLUTION',
    'NO_LOCK_CLOSURE',
    'NO_TERRAIN_MANOR_PRODUCT_OR_RUNTIME_MUTATION',
    'NO_COMMIT_A_REWRITE',
    'NO_V2_IMPLEMENTATION',
    'NO_DEPLOYMENT_OR_RELEASE'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([PARENT_NODE_ID]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'CORRECTED_INTER_HILL_V2_SCOPE_BEFORE_GOVERNANCE_SUCCESSOR_SCOPE',
    'SIX_PATH_REGISTRY_RESOLUTION_BEFORE_COMMIT_B_CONSTRUCTION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze([
    'GENERAL_PREFIX_REGISTRATION',
    'UNDECLARED_NEIGHBOR_REGISTRATION',
    'LOCK_279_OR_280_CLOSURE',
    'TERRAIN_OR_MANOR_CONSTRUCTION',
    'PRODUCT_OR_RUNTIME_CHANGE',
    'COMMIT_A_HEAD_CHANGE',
    'V2_IMPLEMENTATION',
    'DEPLOYMENT_OR_RELEASE'
  ]),
  requiredValidations: Object.freeze([
    'ALL_SIX_PATHS_RESOLVE_TO_THIS_NODE',
    'ALL_SIX_OCCURRENCES_MATCH_COMMIT_A_HEAD_AND_BLOBS',
    'PARENT_V2_NODE_AND_EVIDENCE_REMAIN_PRESENT',
    'ALL_THIRTEEN_MAP_WIDE_INSTRUMENT_PATHS_REMAIN_RESOLVED',
    'C2_R1_EXISTING_REGISTRY_CHECKS_PASS',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_FINAL_DISPOSITION_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_SIX',
    'STOP_ON_COMMIT_A_HEAD_OR_BLOB_IDENTITY_MISMATCH',
    'STOP_IF_PARENT_V2_REGISTRATION_IS_REMOVED_OR_REWRITTEN',
    'STOP_ON_MAP_WIDE_OR_C2_R1_REGRESSION',
    'STOP_IF_UNDECLARED_NEIGHBOR_RESOLVES',
    'STOP_BEFORE_LOCK_CLOSURE_TERRAIN_PRODUCT_OR_DEPLOYMENT_ACTION'
  ]),
  currentIdentityReferences: Object.freeze([
    `SOURCE_HEAD=${SOURCE_HEAD}`,
    `SOURCE_TREE=${SOURCE_TREE}`,
    `SOURCE_BRANCH=${SOURCE_BRANCH}`,
    'EXACT_PATH_COUNT=6',
    `PARENT_SCOPE=${PARENT_NODE_ID}`
  ]),
  lifecycleStatus: 'CONTROL_PLANE_EXACT_HEAD_REGISTERED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EXACT_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords.filter((record) => record.evidenceId !== EVIDENCE_ID),
    H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_EVIDENCE
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
      node: H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE,
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
  const node = H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE;
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
    const parent = baseFacade.getHEarthRepositoryRegistryNode(PARENT_NODE_ID);
    return deepFreeze({
      nodeId,
      nodes: [parent, H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_SCOPE_NODE].filter(Boolean),
      relations: [],
      unresolved: parent == null
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_FACADE = deepFreeze({
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

export default H_EARTH_V2_ROUTER_INSTRUCTION_LOCK_CLOSURE_SUCCESSOR_FACADE;
