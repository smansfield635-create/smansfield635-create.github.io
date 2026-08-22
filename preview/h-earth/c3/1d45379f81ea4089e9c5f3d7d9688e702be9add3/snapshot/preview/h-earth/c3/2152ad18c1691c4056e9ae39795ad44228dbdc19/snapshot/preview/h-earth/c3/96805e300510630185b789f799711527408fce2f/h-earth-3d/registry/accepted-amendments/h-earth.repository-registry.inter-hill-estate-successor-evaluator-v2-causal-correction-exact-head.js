/**
 * H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_v1
 *
 * Read-only exact-head path-resolution amendment for the immutable V2
 * causal-correction evaluator at PR #652 head
 * 7ab3408099c80a0eeb6cf29b39cc28c8ca0bd602.
 *
 * This facade imports and extends the active predecessor registry. It does
 * not replace, flatten, or copy the existing registry chain.
 */

import baseFacade from './h-earth.repository-registry.v2-router-instruction-lock-closure-successor-scope.js';

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
const SOURCE_PR = 652;
const SOURCE_HEAD = '7ab3408099c80a0eeb6cf29b39cc28c8ca0bd602';
const SOURCE_TREE = 'c82bbc92b3c77d4cadf29fb40138f53aa0621ae6';
const SOURCE_LOCK_GENERATION = 322;
const REGISTRY_LOCK_GENERATION = 339;
const REGISTRY_OPERATION = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_002_REPOSITORY_REGISTRY_SCOPE_RESOLUTION_001';
const NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE';
const PARENT_NODE_ID = 'H_EARTH_MAP_WIDE_TERRAIN_ARTICULATION_ESTATE_RESERVATION_INSTRUMENT';
const PRESERVED_CORRECTED_V1_NODE_ID = 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_EXACT_HEAD_SCOPE_V2';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_v1';
const CONTROL_ROOT = '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/v2-causal-correction';
const UNDECLARED_NEIGHBOR = `${CONTROL_ROOT}/undeclared-neighbor.v2.json`;

const VERIFIED_OCCURRENCES = Object.freeze([
  [`${CONTROL_ROOT}/AGENTS.md`, '34c233fd03273fc17647ce72b4d0a37c92fe7b82'],
  [`${CONTROL_ROOT}/causal-rules.v2.json`, 'ed2ecaae56418a3194a3a46c70fb3f5c8d489995'],
  [`${CONTROL_ROOT}/changed-path-manifest.v1.json`, '1bbc71bce2656bdb9c9e6de2179876d03d9c6808'],
  [`${CONTROL_ROOT}/construction-procedure.v1.json`, '4ab453c203adae4aa6b5789ce00e21c6a0caa777'],
  [`${CONTROL_ROOT}/fixtures.v2.json`, 'e0ecce8cd306910c7ad444d59702760237010b9d'],
  [`${CONTROL_ROOT}/input-schema.v2.json`, '69cf1e7b21a5e11438e1b0b4b77ca66922c77bf8'],
  [`${CONTROL_ROOT}/operation-request.v1.json`, '8ae0520c08dbb30dab7463b7daa437f76960b33a'],
  [`${CONTROL_ROOT}/output-schema.v2.json`, '0708fd65ce8e25276eab02d43ade62f44b108d7f'],
  [`${CONTROL_ROOT}/rollback.v1.json`, 'f11c830da7565c124f52c82d66c7b02f5d5d944c'],
  [`${CONTROL_ROOT}/verify.v2.mjs`, '04224b4c9eda3ae30a62d6deb514c1b01e0103c4'],
  ['/h-earth-3d/validation/h-earth.inter-hill-estate-successor-evaluator-v2.mjs', 'e653b4901fb5d5ef7744e50b90a6bf3938bd0327']
]);

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath]) => repositoryPath)
);

const OCCURRENCES = Object.freeze(
  VERIFIED_OCCURRENCES.map(([repositoryPath, gitBlobSha]) => deepFreeze({
    repository: REPOSITORY,
    sourcePr: SOURCE_PR,
    refType: 'COMMIT',
    refName: SOURCE_HEAD,
    commitSha: SOURCE_HEAD,
    path: repositoryPath,
    gitBlobSha,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_EXACT_PR_HEAD_AND_GIT_BLOB',
    occurrenceClass: 'CONTROL_PLANE_EXACT_PR_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION'
  }))
);

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'CONTROL_PLANE_EXACT_PR_HEAD_AND_BLOB_OCCURRENCE_REGISTRATION',
  sourceKind: 'PR_EXACT_HEAD_REGISTRY_SCOPE_RESOLUTION',
  sourceIdOrPath: `PR_${SOURCE_PR}`,
  sourceOccurrenceOrRevision: `PR=${SOURCE_PR};HEAD=${SOURCE_HEAD};TREE=${SOURCE_TREE};EXACT_PATH_COUNT=11`,
  sourcePr: SOURCE_PR,
  sourceHead: SOURCE_HEAD,
  sourceTree: SOURCE_TREE,
  sourceLockGeneration: SOURCE_LOCK_GENERATION,
  registryLockGeneration: REGISTRY_LOCK_GENERATION,
  registryOperation: REGISTRY_OPERATION,
  exactPathCount: 11,
  instrumentClass: 'NONPRODUCT_INSTRUMENTATION',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'ELEVEN_EXACT_H_EARTH_SCOPED_CAUSAL_CORRECTION_PATHS',
    'ELEVEN_EXACT_PR_652_HEAD_AND_GIT_BLOB_OCCURRENCES',
    'CORRECTED_V1_EXACT_HEAD_REGISTRATION_PRESERVED',
    'MAP_WIDE_INSTRUMENT_REGISTRATION_PRESERVED',
    'C2_R1_REGISTRY_VALIDATION_PRESERVED',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED'
  ]),
  verifiedOn: '2026-08-06',
  evidenceLimitations: Object.freeze([
    'NO_GENERAL_PREFIX_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_RESOLUTION',
    'NO_EVALUATOR_DESIGN_OR_MUTATION_AUTHORITY',
    'NO_SOURCE_PR_652_OR_CANDIDATE_HEAD_MUTATION',
    'NO_SOURCE_LOCK_322_MUTATION_OR_CLOSURE',
    'NO_PRODUCT_TERRAIN_CAMERA_NAVIGATION_WATER_OR_PLACEMENT_AUTHORITY',
    'NO_ESTATE_OR_MANOR_CONSTRUCTION_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ])
});

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'NONPRODUCT_CAUSAL_EVALUATOR_EXACT_HEAD_SCOPE',
  displayName: 'H-Earth Inter-Hill Estate Successor Evaluator V2 Causal Correction — Exact Head Scope',
  description: 'Registers exactly 11 H-Earth-scoped nonproduct causal-correction evaluator paths and immutable PR #652 head/blob occurrences for repository preflight path resolution only.',
  parentScope: PARENT_NODE_ID,
  parentScopeNodeId: PARENT_NODE_ID,
  preservedCorrectedV1NodeId: PRESERVED_CORRECTED_V1_NODE_ID,
  sourcePr: SOURCE_PR,
  sourceHead: SOURCE_HEAD,
  sourceTree: SOURCE_TREE,
  repositoryPaths: [...H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'CONTROL_PLANE_EXACT_HEAD_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  instrumentClass: 'NONPRODUCT_INSTRUMENTATION',
  authoritySource: Object.freeze([
    'ROLE_4_PROJECT_GOVERNANCE_AND_CROSS_ROOM_COORDINATION_AUTHORITY',
    'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_002_REPOSITORY_REGISTRY_SCOPE_RESOLUTION_ROLE_4_TO_ROLE_1_HANDOFF_v1',
    'PR_652',
    `EXACT_CANDIDATE_HEAD_${SOURCE_HEAD}`,
    'ROLE_1_CONSTRUCTION_RETURN_COMMENT_5200209515',
    'ROLE_3_HANDOFF_COMMENT_5200211922',
    `REGISTRY_OPERATION_${REGISTRY_OPERATION}`,
    `REGISTRY_LOCK_GENERATION_${REGISTRY_LOCK_GENERATION}`
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'EXACT_CANDIDATE_HEAD_OCCURRENCE_RESOLUTION',
    'EXACT_GIT_BLOB_IDENTITY_VERIFICATION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_UNDECLARED_NEIGHBOR_REGISTRATION',
    'NO_EVALUATOR_DESIGN_OR_MUTATION',
    'NO_CANDIDATE_HEAD_MUTATION',
    'NO_LOCK_322_MUTATION_OR_CLOSURE',
    'NO_PRODUCT_TERRAIN_CAMERA_NAVIGATION_WATER_OR_PLACEMENT_AUTHORITY',
    'NO_ESTATE_OR_MANOR_CONSTRUCTION',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([PARENT_NODE_ID, PRESERVED_CORRECTED_V1_NODE_ID]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([
    'ACTIVE_PREDECESSOR_FACADE_BEFORE_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE',
    'EXACT_REGISTRY_SCOPE_RESOLUTION_BEFORE_SOURCE_PR_652_ROLE_3_COMPLETION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze([
    'GENERAL_PREFIX_REGISTRATION',
    'UNDECLARED_NEIGHBOR_REGISTRATION',
    'EVALUATOR_OR_SOURCE_CANDIDATE_MUTATION',
    'SOURCE_LOCK_322_MUTATION_OR_CLOSURE',
    'PRODUCT_TERRAIN_LIVE_ESTATE_OR_MANOR_MUTATION',
    'MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_TWO_PATH_REGISTRY_DELTA',
    'ALL_ELEVEN_PATHS_RESOLVE_TO_THIS_NODE',
    'ALL_ELEVEN_OCCURRENCES_MATCH_PR_652_HEAD_AND_GIT_BLOBS',
    'NO_GENERAL_DIRECTORY_PREFIX_IS_REGISTERED',
    'UNDECLARED_NEIGHBOR_REMAINS_UNRESOLVED',
    'CORRECTED_V1_EXACT_HEAD_REGISTRATION_REMAINS_PRESENT',
    'MAP_WIDE_INSTRUMENT_REGISTRATIONS_REMAIN_PASSING',
    'C2_R1_REGISTRY_VALIDATION_REMAINS_PASSING',
    'SOURCE_PR_652_HEAD_REMAINS_UNCHANGED',
    'SOURCE_LOCK_322_REMAINS_ACTIVE_AND_UNRELEASED'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_ANY_PATH_OUTSIDE_EXACT_ELEVEN',
    'STOP_ON_PR_652_HEAD_OR_GIT_BLOB_IDENTITY_MISMATCH',
    'STOP_IF_PARENT_OR_CORRECTED_V1_REGISTRATION_IS_REMOVED_OR_REWRITTEN',
    'STOP_ON_MAP_WIDE_OR_C2_R1_REGRESSION',
    'STOP_IF_UNDECLARED_NEIGHBOR_RESOLVES',
    'STOP_BEFORE_SOURCE_LOCK_MUTATION_PRODUCT_TERRAIN_MANOR_MERGE_OR_DEPLOYMENT'
  ]),
  currentIdentityReferences: Object.freeze([
    `SOURCE_PR=${SOURCE_PR}`,
    `SOURCE_HEAD=${SOURCE_HEAD}`,
    `SOURCE_TREE=${SOURCE_TREE}`,
    `SOURCE_LOCK_GENERATION=${SOURCE_LOCK_GENERATION}`,
    `REGISTRY_LOCK_GENERATION=${REGISTRY_LOCK_GENERATION}`,
    'EXACT_PATH_COUNT=11',
    `PARENT_SCOPE=${PARENT_NODE_ID}`
  ]),
  lifecycleStatus: 'CONTROL_PLANE_EXACT_HEAD_REGISTERED',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS.map((repositoryPath) => [
    repositoryPath,
    {
      node: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE,
      occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
    }
  ])
);

const parentNode = baseFacade.getHEarthRepositoryRegistryNode(PARENT_NODE_ID);
if (parentNode?.nodeId !== PARENT_NODE_ID) {
  throw new Error('H_EARTH_V2_CAUSAL_CORRECTION_PARENT_NODE_NOT_PRESERVED');
}

const correctedV1Node = baseFacade.getHEarthRepositoryRegistryNode(PRESERVED_CORRECTED_V1_NODE_ID);
if (correctedV1Node?.nodeId !== PRESERVED_CORRECTED_V1_NODE_ID) {
  throw new Error('H_EARTH_V2_CAUSAL_CORRECTION_CORRECTED_V1_NODE_NOT_PRESERVED');
}

const preexistingNeighborResolution = baseFacade.resolveHEarthRepositoryRegistryPath(UNDECLARED_NEIGHBOR);
if (preexistingNeighborResolution?.resolved === true) {
  throw new Error('H_EARTH_V2_CAUSAL_CORRECTION_UNDECLARED_NEIGHBOR_PREEXISTING_RESOLUTION');
}

if (
  VERIFIED_OCCURRENCES.length !== 11 ||
  pathIndex.size !== 11 ||
  new Set(H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS).size !== 11 ||
  VERIFIED_OCCURRENCES.some(([repositoryPath, gitBlobSha]) =>
    repositoryPath === CONTROL_ROOT ||
    repositoryPath.endsWith('/') ||
    !/^[0-9a-f]{40}$/.test(gitBlobSha)
  )
) {
  throw new Error('H_EARTH_V2_CAUSAL_CORRECTION_EXACT_OCCURRENCE_SET_INVALID');
}

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords.filter((record) => record.evidenceId !== EVIDENCE_ID),
    H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_EVIDENCE
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
      if (input.sourcePr != null && entry.sourcePr !== input.sourcePr) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      return true;
    })
    .map((occurrence) => deepFreeze({
      nodeId: NODE_ID,
      node: H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE,
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
  const node = H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE;
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
        parentNode,
        correctedV1Node,
        H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_SCOPE_NODE
      ],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthV2CausalCorrectionExactHeadScope() {
  const pathChecks = H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS.map(
    (repositoryPath) => {
      const expected = OCCURRENCES.find((entry) => entry.path === repositoryPath);
      const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
      const exactOccurrence = resolveHEarthRepositoryRegistryOccurrence({
        path: repositoryPath,
        sourcePr: SOURCE_PR,
        commitSha: SOURCE_HEAD,
        gitBlobSha: expected.gitBlobSha
      });
      return deepFreeze({
        repositoryPath,
        resolved: resolution.resolved === true,
        resolvesToTargetNode: resolution.nodes?.some((node) => node.nodeId === NODE_ID) === true,
        exactOccurrenceResolved: exactOccurrence.resolved === true,
        exactOccurrenceCount: exactOccurrence.matches.filter((match) => match.nodeId === NODE_ID).length,
        sourcePr: expected.sourcePr,
        commitSha: expected.commitSha,
        gitBlobSha: expected.gitBlobSha
      });
    }
  );
  const neighbor = resolveHEarthRepositoryRegistryPath(UNDECLARED_NEIGHBOR);
  const checks = deepFreeze({
    exactPathCount: pathChecks.length === 11,
    allPathsResolved: pathChecks.every((check) => check.resolved),
    allPathsResolveToTargetNode: pathChecks.every((check) => check.resolvesToTargetNode),
    allExactOccurrencesResolvedOnce: pathChecks.every((check) => check.exactOccurrenceResolved && check.exactOccurrenceCount === 1),
    allOccurrencesBindSourcePr: pathChecks.every((check) => check.sourcePr === SOURCE_PR),
    allOccurrencesBindSourceHead: pathChecks.every((check) => check.commitSha === SOURCE_HEAD),
    allGitBlobsExact: pathChecks.every((check) => /^[0-9a-f]{40}$/.test(check.gitBlobSha)),
    parentNodePreserved: getHEarthRepositoryRegistryNode(PARENT_NODE_ID)?.nodeId === PARENT_NODE_ID,
    correctedV1NodePreserved: getHEarthRepositoryRegistryNode(PRESERVED_CORRECTED_V1_NODE_ID)?.nodeId === PRESERVED_CORRECTED_V1_NODE_ID,
    generalPrefixRegistrationAbsent: !H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_PATHS.includes(CONTROL_ROOT),
    undeclaredNeighborUnresolved: neighbor?.resolved !== true,
    sourcePrImmutable: SOURCE_PR === 652,
    sourceHeadImmutable: SOURCE_HEAD === '7ab3408099c80a0eeb6cf29b39cc28c8ca0bd602',
    sourceTreeImmutable: SOURCE_TREE === 'c82bbc92b3c77d4cadf29fb40138f53aa0621ae6'
  });
  const result = Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL_CLOSED';
  return deepFreeze({
    schema: 'H_EARTH_V2_CAUSAL_CORRECTION_REGISTRY_SCOPE_RESOLUTION_VERIFICATION_RECEIPT_v1',
    result,
    registryOperation: REGISTRY_OPERATION,
    registryLockGeneration: REGISTRY_LOCK_GENERATION,
    sourcePr: SOURCE_PR,
    sourceHead: SOURCE_HEAD,
    sourceTree: SOURCE_TREE,
    targetNodeId: NODE_ID,
    exactPathCount: pathChecks.length,
    pathChecks,
    undeclaredNeighbor: UNDECLARED_NEIGHBOR,
    checks
  });
}

export const H_EARTH_V2_CAUSAL_CORRECTION_REGISTRY_SCOPE_RESOLUTION_VERIFICATION =
  verifyHEarthV2CausalCorrectionExactHeadScope();

if (H_EARTH_V2_CAUSAL_CORRECTION_REGISTRY_SCOPE_RESOLUTION_VERIFICATION.result !== 'PASS') {
  throw new Error(
    `H_EARTH_V2_CAUSAL_CORRECTION_REGISTRY_SCOPE_RESOLUTION_FAILED:${
      JSON.stringify(H_EARTH_V2_CAUSAL_CORRECTION_REGISTRY_SCOPE_RESOLUTION_VERIFICATION.checks)
    }`
  );
}

export const H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthV2CausalCorrectionExactHeadScope
});

export default H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_EXACT_HEAD_FACADE;
