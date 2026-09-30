/**
 * H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_v1
 * Path-resolution-only reservation for the exact fifteen HC00 paths.
 */
import baseFacade from './h-earth.repository-registry.audralia-open-world-continuity-instrument-scope-registration.js';

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
const GOVERNING_MAIN = '9eb636d33cff36b2344bb721726db7b4e8dcd2bc';
const GOVERNING_TREE = 'd850728805825599f268e9021fb669f2e9f5790b';
const CONTROL_ROOT = '/h-earth-3d/control-plane/live-experience-maturity-convergence';
const NODE_ID = 'H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_v1';

export const H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS = Object.freeze([
  `${CONTROL_ROOT}/AGENTS.md`,
  `${CONTROL_ROOT}/authority-and-lineage.v1.json`,
  `${CONTROL_ROOT}/changed-path-manifest.v1.json`,
  `${CONTROL_ROOT}/checkpoint-registry.v1.json`,
  `${CONTROL_ROOT}/construction-procedure.v1.json`,
  `${CONTROL_ROOT}/current-state.v1.json`,
  `${CONTROL_ROOT}/operation-request.v1.json`,
  `${CONTROL_ROOT}/page-excellence-binding.v1.json`,
  `${CONTROL_ROOT}/program.locator.v1.json`,
  `${CONTROL_ROOT}/protected-runtime-manifest.v1.json`,
  `${CONTROL_ROOT}/shell-runtime-classification.schema.v1.json`,
  `${CONTROL_ROOT}/strategy-contract.v1.json`,
  `${CONTROL_ROOT}/successor-room-recovery.v1.json`,
  `${CONTROL_ROOT}/verification-contract.v1.json`,
  `${CONTROL_ROOT}/verify.v1.mjs`
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS.map((repositoryPath) =>
    deepFreeze({
      repository: REPOSITORY,
      refType: 'COMMIT',
      refName: GOVERNING_MAIN,
      commitSha: GOVERNING_MAIN,
      path: repositoryPath,
      gitBlobSha: null,
      contentSha256: null,
      byteCount: null,
      existenceStatus: 'ABSENT',
      fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN',
      occurrenceClass: 'AUTHORIZED_CONSTRUCTION_CANDIDATE_NOT_YET_MATERIALIZED'
    })
  )
);

export const H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE =
  deepFreeze({
    evidenceId: EVIDENCE_ID,
    evidenceClass: 'AUTHORIZED_CANDIDATE_PATH_SCOPE_WITH_TRUTHFUL_OCCURRENCE_STATE',
    sourceKind: 'CANONICAL_OPERATION_LOCK_AND_FAILED_AUTOMATIC_PREFLIGHT_RESOLUTION_EVIDENCE',
    sourceIdOrPath: 'ISSUE_783',
    sourceOccurrenceOrRevision:
      `MAIN=${GOVERNING_MAIN};TREE=${GOVERNING_TREE};CONTROL_PACKAGE_ISSUE=781;CONTROL_PACKAGE_PR=782;CONTROL_PACKAGE_LOCK=598;REGISTRY_LOCK=600;BLOCKED_HEAD=a46aa323e4fd38f67c61ac3aa4269d28ad7e185d;FAILED_PREFLIGHT_RUN=31281484281;FAILED_PREFLIGHT_ARTIFACT=9028545801;PATHS=15;PRESENT=0;ABSENT=15`,
    governingMain: GOVERNING_MAIN,
    governingTree: GOVERNING_TREE,
    controlPackageLockGeneration: 598,
    registryPrerequisiteLockGeneration: 600,
    exactPathCount: 15,
    presentOccurrenceCount: 0,
    absentOccurrenceCount: 15,
    registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
    assertionScope: Object.freeze([
      'EXACT_FIFTEEN_HC00_NONPRODUCT_CONTROL_PATHS',
      'FIFTEEN_TRUTHFUL_ABSENT_OCCURRENCES_AT_GOVERNING_MAIN',
      'FAILED_PREFLIGHT_STOP_IS_CAUSAL_INPUT_ONLY',
      'NO_CONTROL_PACKAGE_BYTE_MUTATION'
    ]),
    evidenceLimitations: Object.freeze([
      'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
      'NO_CONTROL_PACKAGE_OR_PRODUCT_MUTATION_AUTHORITY',
      'NO_ACCEPTED_OCCURRENCE_OR_CANONICALIZATION_AUTHORITY',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
      'NO_PREFIX_WIDE_REGISTRATION'
    ])
  });

export const H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE =
  deepFreeze({
    nodeId: NODE_ID,
    nodeType: 'BOUNDARY_PACKET',
    nodeSubtype: 'AUTHORIZED_NONPRODUCT_CONTROL_CANDIDATE_PATH_SCOPE',
    displayName: 'H-Earth Live Experience Maturity Convergence — Authorized Candidate Path Scope',
    description: 'Exact fifteen-path HC00 reservation enabling H-Earth automatic preflight before accepted occurrences exist.',
    repositoryPaths: [...H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS],
    repositoryOccurrences: OCCURRENCES,
    evidenceClass:
      H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE.evidenceClass,
    evidenceReferences: Object.freeze([EVIDENCE_ID]),
    lifecycleStatus: 'AUTHORIZED_CANDIDATE_SCOPE_REGISTERED',
    authorityClass: 'AUDIT_ONLY',
    authorityPosture: 'AUTHORIZED_CANDIDATE_PATH_RESOLUTION_ONLY',
    registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
    authoritySource: Object.freeze([
      'EXPLICIT_CURRENT_USER_INSTRUCTION',
      'ISSUE_781',
      'ISSUE_783',
      'CONTROL_PACKAGE_LOCK_GENERATION_598',
      'REGISTRY_PREREQUISITE_LOCK_GENERATION_600',
      'FAILED_AUTOMATIC_PREFLIGHT_RUN_31281484281'
    ]),
    authorityScope: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
      'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
    ]),
    authorityLimitations: Object.freeze([
      'NO_PREFIX_WIDE_REGISTRATION',
      'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
      'NO_CONTROL_PACKAGE_OR_PRODUCT_BYTE_MUTATION',
      'NO_ACCEPTED_OCCURRENCE_REGISTRATION',
      'NO_CANONICALIZATION',
      'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
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
      'CANDIDATE_SCOPE_REGISTRATION_BEFORE_HC00_AUTOMATIC_PREFLIGHT',
      'HC00_AUTOMATIC_PREFLIGHT_PASS_BEFORE_CONTROL_PACKAGE_RATIFICATION',
      'ACCEPTED_OCCURRENCE_REGISTRATION_REQUIRES_SEPARATE_AUTHORITY'
    ]),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
    prohibitedMutations: Object.freeze([
      'CONTROL_PACKAGE_MATERIALIZATION_FROM_REGISTRY_AUTHORITY',
      'PRODUCT_OR_SHOWROOM_CHANGE_FROM_REGISTRY_AUTHORITY',
      'ACCEPTED_OCCURRENCE_PROMOTION_FROM_CANDIDATE_SCOPE_AUTHORITY'
    ]),
    requiredValidations: Object.freeze([
      'EXACT_FIFTEEN_PATH_SET',
      'ALL_FIFTEEN_OCCURRENCES_TRUTHFULLY_ABSENT_AT_GOVERNING_MAIN',
      'ALL_FIFTEEN_PATHS_RESOLVE_TO_THIS_NODE',
      'PREDECESSOR_REGISTRY_CHAIN_REMAINS_PRESENT',
      'CURRENT_LOADER_IDENTITY_REMAINS_VERIFIED'
    ]),
    stoppingBoundaries: Object.freeze([
      'STOP_ON_ANY_PATH_OUTSIDE_EXACT_FIFTEEN',
      'STOP_ON_FALSE_PRESENT_OCCURRENCE',
      'STOP_ON_PREDECESSOR_REGISTRY_REGRESSION',
      'STOP_BEFORE_ANY_UNADMITTED_PRODUCT_OPERATION'
    ]),
    currentIdentityReferences: Object.freeze([
      `GOVERNING_MAIN=${GOVERNING_MAIN}`,
      `GOVERNING_TREE=${GOVERNING_TREE}`,
      'CONTROL_PACKAGE_LOCK=598',
      'REGISTRY_PREREQUISITE_LOCK=600',
      'EXACT_CONTROL_PATH_COUNT=15'
    ]),
    unresolvedFields: Object.freeze([])
  });

const pathIndex = new Map(
  H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([
        H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
      ]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  return deepFreeze({
    repositoryPath: normalized,
    resolved: true,
    nodes: indexed.nodes,
    occurrences: indexed.occurrences,
    unresolved: false
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES
    .filter((entry) => {
      if (normalizedPath != null && entry.path !== normalizedPath) return false;
      if (input.refType != null && entry.refType !== input.refType) return false;
      if (input.refName != null && entry.refName !== input.refName) return false;
      if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
      if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
      if (input.existenceStatus != null && entry.existenceStatus !== input.existenceStatus) return false;
      return true;
    })
    .map((occurrence) => deepFreeze({
      nodeId: NODE_ID,
      node: H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({
    ...base,
    matches: [...(base.matches ?? []), ...localMatches],
    resolved: base.resolved === true || localMatches.length > 0
  });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const normalizedPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const base = baseFacade.findHEarthRepositoryRegistryNodes({
    ...criteria,
    ...(normalizedPath == null ? {} : { repositoryPath: normalizedPath })
  });
  const node = H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE;
  const matches =
    (criteria.nodeId == null || criteria.nodeId === node.nodeId) &&
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
      nodes: [H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthLiveExperienceMaturityConvergenceAuthorizedCandidateScope() {
  const pathChecks = H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS.map(
    (repositoryPath) => {
      const resolution = resolveHEarthRepositoryRegistryPath(repositoryPath);
      const occurrence = (resolution.occurrences ?? []).find((entry) =>
        entry.path === repositoryPath &&
        entry.commitSha === GOVERNING_MAIN &&
        entry.existenceStatus === 'ABSENT' &&
        entry.gitBlobSha === null
      );
      return deepFreeze({
        repositoryPath,
        resolved: resolution.resolved === true,
        resolvesToNode: (resolution.nodes ?? []).some((node) => node.nodeId === NODE_ID),
        occurrenceExact: occurrence != null,
        pass:
          resolution.resolved === true &&
          (resolution.nodes ?? []).some((node) => node.nodeId === NODE_ID) &&
          occurrence != null
      });
    }
  );
  const checks = deepFreeze({
    predecessorFacadePresent: baseInstance != null,
    exactPathCount: H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_PATHS.length === 15,
    exactOccurrenceCount: OCCURRENCES.length === 15,
    exactPresentCount: OCCURRENCES.filter((x) => x.existenceStatus === 'PRESENT').length === 0,
    exactAbsentCount: OCCURRENCES.filter((x) => x.existenceStatus === 'ABSENT').length === 15,
    absentBlobTruth: OCCURRENCES.every((x) =>
      x.gitBlobSha === null && x.fetchbackStatus === 'VERIFIED_ABSENT_AT_GOVERNING_MAIN'
    ),
    allPathsResolve: pathChecks.every((x) => x.pass),
    pathResolutionOnly:
      H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
        .registrationEffect === 'PATH_RESOLUTION_AUTHORITY_ONLY',
    noProductMutationAuthority:
      H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
        .authorityLimitations.includes('NO_CONTROL_PACKAGE_OR_PRODUCT_BYTE_MUTATION'),
    noMergeAuthority:
      H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_NODE
        .authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION')
  });
  return deepFreeze({
    eligible: Object.values(checks).every(Boolean),
    status: Object.values(checks).every(Boolean)
      ? 'H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_PASS'
      : 'H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_FAIL',
    checks,
    pathChecks,
    presentOccurrences: Object.freeze([]),
    absentOccurrences: OCCURRENCES
  });
}

export const H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_FACADE =
  deepFreeze({
    ...baseFacade,
    getHEarthRepositoryRegistryInstance,
    getHEarthRepositoryRegistryNode,
    getHEarthRepositoryRegistryEvidence,
    resolveHEarthRepositoryRegistryPath,
    resolveHEarthRepositoryRegistryOccurrence,
    findHEarthRepositoryRegistryNodes,
    getHEarthRepositoryRegistryRelationsForNode,
    getHEarthRepositoryRegistryDependencyClosure,
    verifyHEarthLiveExperienceMaturityConvergenceAuthorizedCandidateScope
  });

export default H_EARTH_LIVE_EXPERIENCE_MATURITY_CONVERGENCE_AUTHORIZED_CANDIDATE_SCOPE_FACADE;
