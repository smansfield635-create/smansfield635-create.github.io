/**
 * H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_v1
 * Read-only exact-path recognition for the three Awards Cycle C candidate paths
 * required by automatic H-Earth repository preflight. The target paths are
 * truthfully absent at the governing main and exist only on the frozen Cycle C
 * candidate. No product, qualification-result, merge, deployment, publication,
 * or Cycle D authority is created here.
 */
import baseFacade from './h-earth.repository-registry.audralia-final-cloud-compositor-path-recognition.js';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function normalizePath(value) {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
}

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const GOVERNING_MAIN = '0c00c49f678c1ea6f597e864ca08d538dc05b274';
const FROZEN_CYCLE_C_CANDIDATE = 'c11c91ff91b651a299da5dfcda4d565270a0ea49';
const NODE_ID = 'H_EARTH_AWARDS_COHERENCE_CYCLE_C_EXACT_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_v1';

export const H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS = Object.freeze([
  '/showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs',
  '/showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json',
  '/showroom/globe/h-earth/awards/qualification/verify-coherence-cycle-c.mjs'
]);

const OCCURRENCES = Object.freeze(H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS.map((repositoryPath) => deepFreeze({
  repository: REPOSITORY,
  refType: 'COMMIT',
  refName: GOVERNING_MAIN,
  commitSha: GOVERNING_MAIN,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'ABSENT',
  fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_CYCLE_C_CANDIDATE_MATERIALIZATION',
  occurrenceClass: 'AUTHORIZED_AWARDS_COHERENCE_CYCLE_C_TARGET_NOT_PRESENT_AT_GOVERNING_MAIN'
})));

export const H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_WITH_TRUTHFUL_ABSENT_OCCURRENCES',
  sourceKind: 'NATIVE_AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_PUBLIC_MAIN_FETCHBACK',
  sourceIdOrPath: 'ISSUE_3094',
  sourceOccurrenceOrRevision: `ISSUE=3094;GOVERNING_MAIN=${GOVERNING_MAIN};FROZEN_CYCLE_C_CANDIDATE=${FROZEN_CYCLE_C_CANDIDATE};FAILED_PREFLIGHT_RUN=34664597215;REGISTRY_LOCK_GENERATION=2109`,
  governingMain: GOVERNING_MAIN,
  frozenCycleCCandidate: FROZEN_CYCLE_C_CANDIDATE,
  exactTargetPathCount: 3,
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EXACT_THREE_AWARDS_COHERENCE_CYCLE_C_PATHS',
    'THREE_TRUTHFUL_ABSENT_OCCURRENCES_AT_GOVERNING_MAIN',
    'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION',
    'FROZEN_CYCLE_C_CANDIDATE_BYTES_UNCHANGED'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_CYCLE_C_PRODUCT_OR_QUALIFICATION_MUTATION_AUTHORITY',
    'NO_COHERENCE_DIAGNOSTIC_MUTATION_AUTHORITY',
    'NO_CYCLE_A_OR_B_MUTATION_AUTHORITY',
    'NO_CYCLE_D_E_OR_F_ACTIVATION_AUTHORITY',
    'NO_ACCEPTED_OCCURRENCE_OR_CANONICALIZATION_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
    'NO_PREFIX_WIDE_REGISTRATION'
  ])
});

export const H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_AWARDS_COHERENCE_CYCLE_C_EXACT_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth Awards Coherence Cycle C Exact-Path Recognition',
  description: 'Read-only exact-path registry recognition for the three frozen Awards Cycle C candidate paths required by automatic preflight.',
  repositoryPaths: [...H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'CANDIDATE_PATH_RECOGNITION',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'ISSUE_3094',
    'CANONICAL_LOCK_GENERATION_2109',
    'NATIVE_CYCLE_C_PREFLIGHT_STOP_RUN_34664597215',
    `EXACT_GOVERNING_MAIN=${GOVERNING_MAIN}`,
    `FROZEN_CYCLE_C_CANDIDATE=${FROZEN_CYCLE_C_CANDIDATE}`
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_CYCLE_C_PRODUCT_OR_QUALIFICATION_MUTATION_AUTHORITY',
    'NO_COHERENCE_DIAGNOSTIC_MUTATION_AUTHORITY',
    'NO_CYCLE_A_OR_B_MUTATION_AUTHORITY',
    'NO_CYCLE_D_E_OR_F_ACTIVATION_AUTHORITY',
    'NO_PREFLIGHT_WAIVER_AUTHORITY',
    'NO_CANONICAL_IDENTITY_OR_ACCEPTED_OCCURRENCE_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS.map((repositoryPath) => [
  repositoryPath,
  deepFreeze({
    nodes: Object.freeze([H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE]),
    occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
  })
]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return registryInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID ? H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID ? H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({
    ...base,
    repositoryPath: normalized,
    resolved: true,
    unresolved: false,
    nodes: [...(base.nodes ?? []), ...indexed.nodes],
    occurrences: [...(base.occurrences ?? []), ...indexed.occurrences]
  });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => {
    if (normalizedPath != null && entry.path !== normalizedPath) return false;
    if (input.refType != null && entry.refType !== input.refType) return false;
    if (input.refName != null && entry.refName !== input.refName) return false;
    if (input.commitSha != null && entry.commitSha !== input.commitSha) return false;
    if (input.gitBlobSha != null && entry.gitBlobSha !== input.gitBlobSha) return false;
    if (input.existenceStatus != null && entry.existenceStatus !== input.existenceStatus) return false;
    return true;
  }).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({ ...input, ...(normalizedPath == null ? {} : {path: normalizedPath}) });
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...localMatches], resolved: base.resolved === true || localMatches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches =
    (criteria.nodeId == null || criteria.nodeId === NODE_ID) &&
    (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') {
  return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  return nodeId === NODE_ID
    ? deepFreeze({nodeId, nodes:[H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE], relations:[], resolved:true})
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor() { return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor(); }

export function verifyHEarthAwardsCoherenceCycleCPathRecognition() {
  const resolutions = H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS.map((repositoryPath) => resolveHEarthRepositoryRegistryPath(repositoryPath));
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS.length === 3,
    allTargetPathsResolve: resolutions.every((entry) => entry.resolved === true),
    allOccurrencesAbsentAtGoverningMain: OCCURRENCES.length === 3 && OCCURRENCES.every((entry) =>
      entry.commitSha === GOVERNING_MAIN &&
      entry.existenceStatus === 'ABSENT' &&
      entry.gitBlobSha === null &&
      entry.contentSha256 === null &&
      entry.byteCount === null
    ),
    exactPathOnly: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.repositoryPaths.every((entry) => H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS.includes(entry)),
    noPrefixRegistration: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.repositoryPaths.every((entry) => !entry.endsWith('/')),
    auditOnly: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    frozenCandidateBound: FROZEN_CYCLE_C_CANDIDATE === 'c11c91ff91b651a299da5dfcda4d565270a0ea49',
    noCycleCMutationAuthority: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CYCLE_C_PRODUCT_OR_QUALIFICATION_MUTATION_AUTHORITY'),
    noDiagnosticMutationAuthority: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_COHERENCE_DIAGNOSTIC_MUTATION_AUTHORITY'),
    noLaterCycleAuthority: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CYCLE_D_E_OR_F_ACTIVATION_AUTHORITY'),
    noPreflightWaiverAuthority: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PREFLIGHT_WAIVER_AUTHORITY'),
    noPublicationAuthority: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible ? 'H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_PASS' : 'H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATH_RECOGNITION_FAIL',
    governingMain: GOVERNING_MAIN,
    frozenCycleCCandidate: FROZEN_CYCLE_C_CANDIDATE,
    targetPaths: H_EARTH_AWARDS_COHERENCE_CYCLE_C_PATHS,
    checks
  });
}

export default Object.freeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  getHEarthRepositoryRegistryDiscoveryDescriptor
});
