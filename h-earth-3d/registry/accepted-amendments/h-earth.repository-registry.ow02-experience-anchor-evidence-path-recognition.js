/**
 * H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_v1
 * Read-only exact-path recognition for the five OW02 Experience Anchor evidence
 * and receipt paths required by automatic H-Earth repository preflight.
 * No product, evidence, anchor-waiver, canonicalization, or merge authority.
 */
import baseFacade from './h-earth.repository-registry.ow01-derivative-path-recognition.js';

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
const GOVERNING_MAIN = '9135d496e269c95f1683db4f90735254fc6a6784';
const INSTALLED_MAIN = '8a5a0ec097d86c2b162f702110b98cf1f5cb2df6';
const NODE_ID = 'H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_v1';

export const H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS = Object.freeze([
  '/h-earth-3d/experience-anchor/evidence/OW02_INLAND_MOUNTAIN_WATERSHED_20260815_001.anchor.png',
  '/h-earth-3d/experience-anchor/evidence/OW02_INLAND_MOUNTAIN_WATERSHED_20260815_001.base.png',
  '/h-earth-3d/experience-anchor/evidence/OW02_INLAND_MOUNTAIN_WATERSHED_20260815_001.candidate.png',
  '/h-earth-3d/experience-anchor/evidence/OW02_INLAND_MOUNTAIN_WATERSHED_20260815_001.json',
  '/h-earth-3d/experience-anchor/receipts/OW02_INLAND_MOUNTAIN_WATERSHED_20260815_001.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS.map((repositoryPath) => deepFreeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: GOVERNING_MAIN,
    commitSha: GOVERNING_MAIN,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'ABSENT',
    fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_OW02_EVIDENCE_MATERIALIZATION',
    occurrenceClass: 'AUTHORIZED_H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_TARGET_NOT_PRESENT_AT_GOVERNING_MAIN'
  }))
);

export const H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_WITH_TRUTHFUL_ABSENT_OCCURRENCES',
  sourceKind: 'NATIVE_AUTOMATIC_PREFLIGHT_STOP_PLUS_EXACT_PUBLIC_MAIN_FETCHBACK',
  sourceIdOrPath: 'ISSUE_1101',
  sourceOccurrenceOrRevision: 'PR=1093;BLOCKED_HEAD=5b5b07ee46324ccf4b7de0b7313c704f0ff484cc;PRODUCT_CANDIDATE=ee88405c2296dc02661eaa998a7264ebf8adf5ce;FAILED_PREFLIGHT_RUN=31897785602;ARTIFACT=9250269071;NATIVE_RECEIPT_SHA256=079fde0db312e129bfcc10428bf370cdfaf003abca307678fbc3027822804365;LOCK_GENERATION=1484;MERGED_PR=1105;INSTALLED_MAIN=8a5a0ec097d86c2b162f702110b98cf1f5cb2df6;RATIFICATION_ISSUE=1106;RATIFICATION_LOCK_GENERATION=1487',
  governingMain: GOVERNING_MAIN,
  exactTargetPathCount: 5,
  registrationEffect: 'PATH_RESOLUTION_AUTHORITY_ONLY',
  assertionScope: Object.freeze([
    'EXACT_FIVE_OW02_EXPERIENCE_ANCHOR_EVIDENCE_AND_RECEIPT_PATHS',
    'FIVE_TRUTHFUL_ABSENT_OCCURRENCES_AT_GOVERNING_MAIN',
    'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION',
    'OW02_PRODUCT_CANDIDATE_AND_ANCHOR_EVIDENCE_BYTES_UNCHANGED'
  ]),
  evidenceLimitations: Object.freeze([
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_PRODUCT_OR_TERRAIN_MUTATION_AUTHORITY',
    'NO_EVIDENCE_OR_RECEIPT_MUTATION_AUTHORITY',
    'NO_EXPERIENCE_ANCHOR_WAIVER_OR_REPLACEMENT_AUTHORITY',
    'NO_ACCEPTED_OCCURRENCE_OR_CANONICALIZATION_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY',
    'NO_PREFIX_WIDE_REGISTRATION'
  ])
});

export const H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth OW02 Experience Anchor Evidence Path Recognition',
  description: 'Read-only exact-path registry recognition for the five OW02 Experience Anchor evidence and receipt paths required by automatic preflight.',
  repositoryPaths: [...H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'RATIFIED_ACTIVE',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'RATIFIED_ACTIVE_EXACT_PATH_RESOLUTION_ONLY',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze([
    'CURRENT_USER_PROCEED_INSTRUCTION_2026_08_15',
    'ISSUE_1101',
    'CANONICAL_LOCK_GENERATION_1484',
    'NATIVE_OW02_PREFLIGHT_STOP_RUN_31897785602',
    `EXACT_GOVERNING_MAIN=${GOVERNING_MAIN}`,
    'MERGED_PR_1105',
    `INSTALLED_MAIN=${INSTALLED_MAIN}`,
    'RATIFICATION_ISSUE_1106',
    'CANONICAL_RATIFICATION_LOCK_GENERATION_1487'
  ]),
  authorityScope: Object.freeze([
    'EXACT_PATH_RESOLUTION',
    'TRUTHFUL_ABSENT_OCCURRENCE_RESOLUTION',
    'AUTOMATIC_H_EARTH_REPOSITORY_PREFLIGHT_RESOLUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_FALSE_PRESENT_OCCURRENCE_ASSERTION',
    'NO_PRODUCT_AUTHORITY',
    'NO_TERRAIN_MUTATION_AUTHORITY',
    'NO_EVIDENCE_MUTATION_AUTHORITY',
    'NO_RECEIPT_MUTATION_AUTHORITY',
    'NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY',
    'NO_CANONICAL_IDENTITY_AUTHORITY',
    'NO_ACCEPTED_OCCURRENCE_AUTHORITY',
    'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'
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
    'NATIVE_PREFLIGHT_STOP_PRECEDES_EXACT_PATH_RECOGNITION',
    'PATH_RECOGNITION_PREREQUISITE_PRECEDES_FRESH_OW02_PREFLIGHT',
    'PREFLIGHT_PASS_DOES_NOT_CREATE_MERGE_OR_OW03_AUTHORITY'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION_AUTHORITY',
  prohibitedMutations: Object.freeze([
    'OW02_PRODUCT_OR_TERRAIN_MUTATION_FROM_REGISTRY_AUTHORITY',
    'EXPERIENCE_ANCHOR_EVIDENCE_OR_RECEIPT_MUTATION_FROM_REGISTRY_AUTHORITY',
    'EXPERIENCE_ANCHOR_WAIVER_FROM_REGISTRY_AUTHORITY',
    'MERGE_OR_DEPLOYMENT_FROM_REGISTRY_AUTHORITY'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_FIVE_TARGET_PATHS',
    'ALL_FIVE_OCCURRENCES_TRUTHFULLY_ABSENT_AT_GOVERNING_MAIN',
    'ALL_FIVE_PATHS_RESOLVE_TO_THIS_NODE',
    'PREDECESSOR_REGISTRY_CHAIN_REMAINS_PRESENT',
    'CURRENT_LOADER_IDENTITY_REMAINS_VERIFIED'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_PATH_OUTSIDE_EXACT_FIVE',
    'STOP_ON_FALSE_PRESENT_OCCURRENCE',
    'STOP_ON_PREDECESSOR_REGISTRY_REGRESSION',
    'STOP_ON_ANY_PRODUCT_EVIDENCE_ANCHOR_OR_AUTHORITY_EXPANSION',
    'RATIFIED_REGISTRY_DOES_NOT_AUTHORIZE_OW02_REBIND_MERGE_OR_OW03_WITHOUT_FRESH_OW02_PREFLIGHT'
  ]),
  currentIdentityReferences: Object.freeze([
    `GOVERNING_MAIN=${GOVERNING_MAIN}`,
    `INSTALLED_MAIN=${INSTALLED_MAIN}`,
    'BLOCKED_OW02_HEAD=5b5b07ee46324ccf4b7de0b7313c704f0ff484cc',
    'OW02_PRODUCT_CANDIDATE=ee88405c2296dc02661eaa998a7264ebf8adf5ce',
    'CANONICAL_LOCK_GENERATION=1484',
    'CANONICAL_RATIFICATION_LOCK_GENERATION=1487',
    'EXACT_TARGET_PATH_COUNT=5'
  ]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(
  H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS.map((repositoryPath) => [
    repositoryPath,
    deepFreeze({
      nodes: Object.freeze([H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE]),
      occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath))
    })
  ])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...(baseInstance.evidenceRecords ?? []),
    H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID),
    H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === NODE_ID
    ? H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === EVIDENCE_ID
    ? H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
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
    nodes: [...(base.nodes ?? []), ...indexed.nodes],
    occurrences: [...(base.occurrences ?? []), ...indexed.occurrences],
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
      node: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({
    ...input,
    ...(normalizedPath == null ? {} : { path: normalizedPath })
  });
  return deepFreeze({
    query: base.query,
    matches: [...(base.matches ?? []), ...localMatches],
    resolved: base.resolved === true || localMatches.length > 0
  });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches =
    (criteria.nodeId == null || criteria.nodeId === node.nodeId) &&
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
    ? deepFreeze({ nodeId, nodes: [H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE], relations: [], resolved: true })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export function verifyHEarthOW02ExperienceAnchorEvidencePathRecognition() {
  const resolutions = H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS.map((path) => resolveHEarthRepositoryRegistryPath(path));
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS.length === 5,
    allTargetPathsResolve: resolutions.every((entry) => entry.resolved === true),
    allOccurrencesAbsentAtGoverningMain: OCCURRENCES.length === 5 && OCCURRENCES.every((entry) =>
      entry.commitSha === GOVERNING_MAIN &&
      entry.existenceStatus === 'ABSENT' &&
      entry.gitBlobSha === null &&
      entry.contentSha256 === null &&
      entry.byteCount === null
    ),
    auditOnly: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noProductAuthority: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_PRODUCT_AUTHORITY'),
    noEvidenceMutationAuthority: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_EVIDENCE_MUTATION_AUTHORITY'),
    noAnchorWaiverAuthority: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_EXPERIENCE_ANCHOR_WAIVER_AUTHORITY'),
    noCanonicalAuthority: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_CANONICAL_IDENTITY_AUTHORITY')
  });
  const eligible = Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status: eligible
      ? 'H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_PASS'
      : 'H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_FAIL',
    checks,
    targetPaths: H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATHS,
    governingMain: GOVERNING_MAIN
  });
}

export const H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_FACADE = deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthOW02ExperienceAnchorEvidencePathRecognition
});

export default H_EARTH_OW02_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RECOGNITION_FACADE;
