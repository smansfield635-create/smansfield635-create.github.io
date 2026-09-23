/**
 * H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_INSTRUMENT_PERMANENT_ACTIVATION_v1
 *
 * Exact accepted-occurrence registration for the separately verified
 * Audralia open-world spatial-migration continuity instrument in PR #740.
 * The instrument is nonproduct governance/recovery infrastructure. It binds
 * twelve control-plane files at the immutable package commit and creates no
 * terrain, runtime, traversal, deployment, release, or inherited authority.
 */

import baseFacade from './h-earth.repository-registry.terrain-estate-construction-v1-authorized-candidate-scope.js';

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
const PACKAGE_COMMIT = 'ae65d17ce1019831a7e9ea27af9441fb5686887a';
const PACKAGE_TREE = '0c5fdf5692f8c256b97354f95359f60d5dae9cd0';
const PACKAGE_FINGERPRINT = '124fae0a63ef90edb0e8988ab5c65cc6692772b192baeefa00a8c9c55773097a';
const NODE_ID = 'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_CONTINUITY_INSTRUMENT';
const CONTROL_ROOT = '/h-earth-3d/control-plane/audralia-open-world-spatial-migration';

const VERIFIED_OCCURRENCES = Object.freeze([
  [`${CONTROL_ROOT}/AGENTS.md`, 'c7208ae424b4fcdaa51736465d4bc573618ef4c5'],
  [`${CONTROL_ROOT}/authority-and-lineage.v1.json`, '618e1e10f3af499ae124ec444e7e04eaf2268a9c'],
  [`${CONTROL_ROOT}/changed-path-manifest.v1.json`, '5f783cf4a740dbcc356d2d9cf8a4cfd345a2234a'],
  [`${CONTROL_ROOT}/checkpoint-registry.v1.json`, '4333ca084ad604501dee90337da0501f2a057bc9'],
  [`${CONTROL_ROOT}/construction-procedure.v1.json`, '44bc8a4749621b2f651699f15116bb80f004fa80'],
  [`${CONTROL_ROOT}/continuity-state.v1.json`, 'bd26b5d2278eb33427e6787ec883e8b855e8a49c'],
  [`${CONTROL_ROOT}/instrument.locator.v1.json`, '56aba2dcc54c50f45a6b6e2cb7aede5c3bd9b88b'],
  [`${CONTROL_ROOT}/operation-request.v1.json`, 'cfc35a7c95033115fc9cea1d57d22e59c9ae5cbe'],
  [`${CONTROL_ROOT}/schemas.v1.json`, '2f2e586ccacb46790d3bbc26d5e72f70bfe51bfc'],
  [`${CONTROL_ROOT}/spatial-invariants.v1.json`, 'd8b068a212b49d5f4bb14a0cc80128b07fccc326'],
  [`${CONTROL_ROOT}/successor-room-recovery.v1.json`, '6b4f1cbc479cdfbbcdb396a4b197bb6321dc67e7'],
  [`${CONTROL_ROOT}/verification-contract.v1.json`, 'fa1aa404c103028e65cf6798d50f55c0c85a37c3']
]);

export const H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_CONTROL_PATHS = Object.freeze(
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

export const H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_INSTRUMENT_PERMANENT_ACTIVATION_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'LOCAL_VALIDATION',
  sourceIdOrPath: `${CONTROL_ROOT}/continuity-state.v1.json`,
  sourceOccurrenceOrRevision: `PACKAGE_COMMIT=${PACKAGE_COMMIT};PACKAGE_TREE=${PACKAGE_TREE};PACKAGE_FINGERPRINT=${PACKAGE_FINGERPRINT};CONSTRUCTION_LOCK_GENERATION=462;REGISTRY_ACTIVATION_LOCK_GENERATION=464;EXACT_CONTROL_PATH_COUNT=12;VERIFICATION_RUN=31211470016`,
  assertionScope: Object.freeze([
    'EXACT_TWELVE_ACCEPTED_CONTROL_PATH_OCCURRENCES',
    'DURABLE_CROSS_ROOM_CONTINUITY_STATE',
    'STRICT_OW00_THROUGH_OW10_CHECKPOINT_REGISTRY',
    'SUCCESSOR_ROOM_RECOVERY_PROTOCOL',
    'OPEN_WORLD_SPATIAL_INVARIANTS',
    'STARTING_POINT_TRAVERSAL_RANGE_EXPANSION_REQUIRED_DOWNSTREAM'
  ]),
  verifiedOn: '2026-08-07',
  evidenceLimitations: Object.freeze([
    'NO_TERRAIN_MUTATION_AUTHORITY',
    'NO_RUNTIME_OR_RENDERER_MUTATION_AUTHORITY',
    'NO_LIVE_TRAVERSAL_MUTATION_AUTHORITY',
    'NO_MANOR_CONSTRUCTION_AUTHORITY',
    'NO_DEPLOYMENT_OR_RELEASE_AUTHORITY',
    'NO_AUTOMATIC_CANDIDATE_MERGE',
    'NO_INHERITED_FUTURE_OPERATION_AUTHORITY',
    'NO_PREFIX_WIDE_REGISTRATION'
  ])
});

export const H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'PERMANENT_NONPRODUCT_CONTINUITY_INSTRUMENT',
  displayName: 'H-Earth / Audralia Open-World Spatial Migration Continuity Instrument',
  description: 'Registers the durable nonproduct cross-room continuity instrument for Audralia open-world spatial migration at one immutable package commit and twelve exact accepted control-plane blobs.',
  repositoryPaths: [...H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_CONTROL_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'ACTIVE_PERMANENT_INSTRUMENT_EXACT_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_INSTRUCTION',
    'ISSUE_719_OPEN_WORLD_PREFLIGHT',
    'CANONICAL_OPERATION_GENERATION_462',
    'CANONICAL_REGISTRY_ACTIVATION_GENERATION_464',
    'EXACT_HEAD_BUILDER_FRESH_VERIFIER_EQUALITY_PASS'
  ]),
  authorityScope: Object.freeze([
    'OPEN_WORLD_SPATIAL_INVARIANT_DISCOVERY',
    'CHECKPOINT_SEQUENCE_DISCOVERY',
    'DURABLE_CONTINUITY_STATE_DISCOVERY',
    'SUCCESSOR_ROOM_RECOVERY',
    'EXACT_SOURCE_LINEAGE_DISCOVERY',
    'READ_ONLY_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_PREFLIGHT'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PRODUCT_MUTATION',
    'NO_TERRAIN_MUTATION_WITHOUT_SEPARATE_ADMISSION',
    'NO_RENDERER_OR_RUNTIME_MUTATION_WITHOUT_SEPARATE_ADMISSION',
    'NO_LIVE_TRAVERSAL_MUTATION_WITHOUT_SEPARATE_ADMISSION',
    'NO_MANOR_CONSTRUCTION_WITHOUT_SEPARATE_ADMISSION',
    'NO_DEPLOYMENT_OR_RELEASE',
    'NO_AUTOMATIC_CANDIDATE_MERGE',
    'NO_INHERITED_OPERATION_AUTHORITY',
    'NO_PREFIX_WIDE_REGISTRATION'
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
    'OW00_PRECEDES_OW01',
    'OW01_THROUGH_OW10_FOLLOW_CHECKPOINT_REGISTRY_PREREQUISITES',
    'LIVE_CHANGE_CHECKPOINTS_REQUIRE_USER_DIFFERENTIAL_BEFORE_CLOSURE'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'SEPARATELY_ADMITTED_CHECKPOINT_OPERATIONS_ONLY',
  prohibitedMutations: Object.freeze([
    'PRODUCT_CHANGE_BY_INSTRUMENT_AUTHORITY',
    'TERRAIN_CHANGE_BY_INSTRUMENT_AUTHORITY',
    'LIVE_TRAVERSAL_CHANGE_BY_INSTRUMENT_AUTHORITY',
    'PREFIX_WIDE_REGISTRATION',
    'AUTHORITY_INHERITANCE'
  ]),
  requiredValidations: Object.freeze([
    'ALL_TWELVE_PATHS_RESOLVE_TO_EXACT_ACCEPTED_OCCURRENCES',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'EXISTING_REGISTRY_IDENTITIES_REMAIN_VALID',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_PASS',
    'SEPARATE_OPERATION_ADMISSION_BEFORE_ANY_CHECKPOINT_MUTATION'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_TWELVE',
    'STOP_ON_PACKAGE_COMMIT_OR_BLOB_DRIFT',
    'STOP_ON_EXISTING_REGISTRY_REGRESSION',
    'STOP_ON_NEIGHBOR_PATH_RESOLUTION',
    'STOP_BEFORE_ANY_UNADMITTED_PRODUCT_OR_LIVE_OPERATION'
  ]),
  currentIdentityReferences: Object.freeze([
    `PACKAGE_COMMIT=${PACKAGE_COMMIT}`,
    `PACKAGE_TREE=${PACKAGE_TREE}`,
    `PACKAGE_FINGERPRINT=${PACKAGE_FINGERPRINT}`,
    'CONSTRUCTION_LOCK_GENERATION=462',
    'REGISTRY_ACTIVATION_LOCK_GENERATION=464',
    'EXACT_CONTROL_PATH_COUNT=12'
  ]),
  lifecycleStatus: 'ACTIVE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_CONTROL_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_EVIDENCE
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
      node: H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE,
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
  const node = H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE;
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
      nodes: [H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthAudraliaOpenWorldContinuityInstrumentScope() {
  const issues = [];
  if (H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_CONTROL_PATHS.length !== 12) issues.push('CONTROL_PATH_COUNT_MISMATCH');
  if (OCCURRENCES.length !== 12) issues.push('OCCURRENCE_COUNT_MISMATCH');
  if (OCCURRENCES.some((entry) => entry.commitSha !== PACKAGE_COMMIT || entry.refName !== PACKAGE_COMMIT)) issues.push('PACKAGE_COMMIT_BINDING_MISMATCH');
  if (OCCURRENCES.some((entry) => !/^[0-9a-f]{40}$/.test(entry.gitBlobSha ?? ''))) issues.push('BLOB_IDENTITY_INVALID');
  if (H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE.authorityClass !== 'AUDIT_ONLY') issues.push('AUTHORITY_CLASS_INVALID');
  if (!H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_NODE.authorityLimitations.includes('NO_PRODUCT_MUTATION')) issues.push('PRODUCT_AUTHORITY_LIMIT_MISSING');
  const neighbor = resolveHEarthRepositoryRegistryPath(`${CONTROL_ROOT}/undeclared-neighbor.v1.json`);
  if (neighbor.resolved === true) issues.push('UNDECLARED_NEIGHBOR_RESOLVED');
  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_REGISTRY_PASS' : 'H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_REGISTRY_FAIL',
    packageCommit: PACKAGE_COMMIT,
    packageTree: PACKAGE_TREE,
    packageFingerprint: PACKAGE_FINGERPRINT,
    exactControlPathCount: H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_CONTROL_PATHS.length,
    productMutationAuthorityCreated: false,
    issues: Object.freeze(issues)
  });
}

export const H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_REGISTERED_FACADE = deepFreeze({
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

export default H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_SCOPE_REGISTERED_FACADE;
