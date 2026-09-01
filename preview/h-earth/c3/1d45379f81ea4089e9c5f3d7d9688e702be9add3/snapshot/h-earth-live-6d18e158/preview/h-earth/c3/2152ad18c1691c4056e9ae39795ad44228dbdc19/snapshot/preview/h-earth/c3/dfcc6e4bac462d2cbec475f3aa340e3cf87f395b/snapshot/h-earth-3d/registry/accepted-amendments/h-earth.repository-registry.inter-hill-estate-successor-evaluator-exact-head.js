/**
 * H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_v1
 *
 * Read-only exact-head registration for the nonproduct analytical evaluator
 * implemented at PR #616 head f5bbab7595306cbae16406f3f66fe206c2bd9f94.
 * This facade extends the active map-wide instrument facade and registers only
 * eight exact repository occurrences. It grants no terrain, manor, product,
 * evaluator-design, PR-merge, deployment, release, or prefix-wide authority.
 */

import baseFacade, {
  H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE
} from './h-earth.repository-registry.map-wide-instrument-scope-registration.js';

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
const SOURCE_PR = 616;
const SOURCE_HEAD = 'f5bbab7595306cbae16406f3f66fe206c2bd9f94';
const NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE';
const PARENT_NODE_ID = 'H_EARTH_MAP_WIDE_TERRAIN_ARTICULATION_ESTATE_RESERVATION_INSTRUMENT';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_v1';
const CONTROL_ROOT = '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator';

const VERIFIED_OCCURRENCES = Object.freeze([
  [`${CONTROL_ROOT}/AGENTS.md`, 'f5d8215e180fa84ad4f23ee3eea57aa41abbcef0'],
  [`${CONTROL_ROOT}/changed-path-manifest.v1.json`, '00dfbeecac4972bcb18381c120b16ab2801cdd7b'],
  [`${CONTROL_ROOT}/input-schema.v1.json`, '1ca845f78cd625dac43a2c8d4e676c82e70c1d0b'],
  [`${CONTROL_ROOT}/negative-fixtures.v1.json`, 'eed1636958324d118fec5091b68f71678bdff255'],
  [`${CONTROL_ROOT}/operator-family-admission.v1.json`, '3bfd4e5d5292a2a147a5a31c0de1fc08ce7b9b94'],
  [`${CONTROL_ROOT}/output-schema.v1.json`, 'c71b434d7c0905af2a5c2a52f831eb94fd131fe9'],
  [`${CONTROL_ROOT}/requirements.v1.json`, '6d87efbe7418be4f6e78ea40a57e9749118fd9d7'],
  ['/h-earth-3d/validation/h-earth.inter-hill-estate-successor-evaluator.mjs', '489ef1f8f87a20918083ed799428a62c95f944d3']
]);

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_PATHS = Object.freeze(
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
    occurrenceClass: 'CONTROL_PLANE_EXACT_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION'
  }))
);

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'CONTROL_PLANE_EXACT_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION',
  sourceKind: 'PR_EXACT_HEAD_REGISTRY_AMENDMENT',
  sourceIdOrPath: `PR_${SOURCE_PR}`,
  sourceOccurrenceOrRevision: `PR=${SOURCE_PR};HEAD=${SOURCE_HEAD};EXACT_PATH_COUNT=8`,
  sourceHead: SOURCE_HEAD,
  sourcePr: SOURCE_PR,
  exactPathCount: 8,
  instrumentClass: 'NONPRODUCT_INSTRUMENTATION',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EIGHT_EXACT_EVALUATOR_PATHS',
    'EIGHT_EXACT_HEAD_AND_BLOB_OCCURRENCES',
    'ONE_NONPRODUCT_ANALYTICAL_EVALUATOR_NODE',
    'EXACT_PATH_RESOLUTION_ONLY',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED'
  ]),
  verifiedOn: '2026-08-05',
  evidenceLimitations: Object.freeze([
    'NO_GENERAL_PREFIX_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_RESOLUTION',
    'NO_TERRAIN_AUTHORITY',
    'NO_MANOR_AUTHORITY',
    'NO_PRODUCT_AUTHORITY',
    'NO_EVALUATOR_DESIGN_AUTHORITY',
    'NO_PR_616_MUTATION_OR_MERGE_AUTHORITY',
    'NO_DEPLOYMENT_OR_RELEASE_AUTHORITY'
  ])
});

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'NONPRODUCT_ANALYTICAL_EVALUATOR_EXACT_HEAD',
  displayName: 'H-Earth Inter-Hill Estate Successor Evaluator — Exact Head Scope',
  description: 'Registers exactly eight nonproduct analytical evaluator paths and exact PR #616 head/blob occurrences without prefix-wide resolution or construction authority.',
  parentScope: PARENT_NODE_ID,
  parentScopeNodeId: PARENT_NODE_ID,
  repositoryPaths: [...H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'CONTROL_PLANE_EXACT_HEAD_PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'ROLE_4_PROJECT_GOVERNANCE_AND_CROSS_ROOM_COORDINATION_AUTHORITY',
    'H_EARTH_INTER_HILL_ESTATE_EVALUATOR_EXACT_REGISTRY_SCOPE_RESOLUTION_ROLE_1_HANDOFF_v1',
    `PR_${SOURCE_PR}_EXACT_HEAD_${SOURCE_HEAD}`
  ]),
  authorityScope: Object.freeze([
    'READ_ONLY_EXACT_PATH_RESOLUTION',
    'EXACT_HEAD_AND_BLOB_OCCURRENCE_VERIFICATION',
    'AUTOMATIC_H_EARTH_PREFLIGHT_SCOPE_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_GENERAL_PREFIX_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_RESOLUTION',
    'NO_TERRAIN_AUTHORITY',
    'NO_MANOR_AUTHORITY',
    'NO_PRODUCT_AUTHORITY',
    'NO_EVALUATOR_DESIGN_OR_IMPLEMENTATION_MUTATION',
    'NO_PR_616_MUTATION_OR_MERGE',
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
    'MAP_WIDE_INSTRUMENT_SCOPE_BEFORE_INTER_HILL_EVALUATOR_EXACT_HEAD_SCOPE',
    'EXACT_REGISTRY_SCOPE_RESOLUTION_BEFORE_ROLE_3_ENTRY'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze([
    'GENERAL_PREFIX_REGISTRATION',
    'UNDECLARED_NEIGHBOR_REGISTRATION',
    'TERRAIN_OR_MANOR_CONSTRUCTION',
    'PRODUCT_OR_RUNTIME_CHANGE',
    'PR_616_HEAD_CHANGE',
    'MERGE_DEPLOYMENT_OR_RELEASE'
  ]),
  requiredValidations: Object.freeze([
    'ALL_EIGHT_PATHS_RESOLVE_TO_THIS_NODE',
    'ALL_EIGHT_OCCURRENCES_MATCH_EXACT_HEAD_AND_BLOBS',
    'ALL_THIRTEEN_MAP_WIDE_INSTRUMENT_PATHS_REMAIN_RESOLVED',
    'C2_R1_EXISTING_REGISTRY_CHECKS_PASS',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_FINAL_DISPOSITION_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_EIGHT',
    'STOP_ON_HEAD_OR_BLOB_IDENTITY_MISMATCH',
    'STOP_ON_MAP_WIDE_OR_C2_R1_REGRESSION',
    'STOP_IF_UNDECLARED_NEIGHBOR_RESOLVES',
    'STOP_BEFORE_ANY_TERRAIN_PRODUCT_PR616_MERGE_OR_DEPLOYMENT_ACTION'
  ]),
  currentIdentityReferences: Object.freeze([
    `SOURCE_PR=${SOURCE_PR}`,
    `SOURCE_HEAD=${SOURCE_HEAD}`,
    'EXACT_PATH_COUNT=8',
    `PARENT_SCOPE=${PARENT_NODE_ID}`
  ]),
  lifecycleStatus: 'CONTROL_PLANE_EXACT_HEAD_REGISTERED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords.filter((record) => record.evidenceId !== EVIDENCE_ID),
    H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_EVIDENCE
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
      node: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE,
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
  const node = H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE;
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
      nodes: [
        H_EARTH_MAP_WIDE_INSTRUMENT_SCOPE_NODE,
        H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_NODE
      ],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_FACADE = deepFreeze({
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

export default H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_FACADE;
