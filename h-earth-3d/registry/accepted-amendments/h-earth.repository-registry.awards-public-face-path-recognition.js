/**
 * H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_v7
 * Audit-only exact-path recognition for the promoted Awards public face,
 * its site-owned presentation media, Trophy Standard validators, and the
 * bounded experience-anchor evidence required to review an Awards mutation.
 * No mutation authority.
 */
import baseFacade from './h-earth.repository-registry.in-world-live-gpu-binding-path-recognition.js';

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
const AWARDS_MAIN = '90ae8c69b14716ea0506341711c3d0a97c47c570';
const OPERATION_BASE = '178ebf052e35d8a06c7930432b46b0c7445691d3';
const TARGET_PATH = '/showroom/globe/h-earth/awards/index.html';
const TARGET_MAIN_BLOB = '1e854558240b71af72f5fb22a26b78ebbbdcfc08';
const MEDIA_PATH = '/showroom/globe/h-earth/awards/media/diamond-gate-h-earth-awards-18s-vivaldi.mp4';
const BROWSER_PATH = '/h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.browser.mjs';
const BROWSER_BASE_BLOB = 'ae3eae6abba0121bd641b53eb932699eb903a1fd';
const RUNNER_PATH = '/h-earth-3d/validation/instrument-platform/h-earth.public-face-trophy-standard.runner.mjs';
const RUNNER_BASE_BLOB = 'd14a16c31dbaaa676031cbd654f8d1ecb16eacb9';
const ANCHOR_EVIDENCE_PATH = '/h-earth-3d/experience-anchor/evidence/AWARDS_COMPASS_VIDEO_20260815_001.json';
const ANCHOR_RECEIPT_PATH = '/h-earth-3d/experience-anchor/receipts/AWARDS_COMPASS_VIDEO_20260815_001.json';
const RECOVERY_EVIDENCE_PATH = '/h-earth-3d/experience-anchor/evidence/AWARDS_MEDIA_RECOVERY_20260815_001.json';
const RECOVERY_RECEIPT_PATH = '/h-earth-3d/experience-anchor/receipts/AWARDS_MEDIA_RECOVERY_20260815_001.json';
const REFRESH_EVIDENCE_PATH = '/h-earth-3d/experience-anchor/evidence/AWARDS_VIDEO_REFRESH_20260815_001.json';
const REFRESH_RECEIPT_PATH = '/h-earth-3d/experience-anchor/receipts/AWARDS_VIDEO_REFRESH_20260815_001.json';
const AMENDMENT_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.awards-public-face-path-recognition.js';
const NODE_ID = 'H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_SCOPE';
const EVIDENCE_ID = 'EVIDENCE_H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_v7';

export const H_EARTH_AWARDS_PUBLIC_FACE_TARGET_PATHS = Object.freeze([TARGET_PATH]);
export const H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS = Object.freeze([
  TARGET_PATH,
  MEDIA_PATH,
  BROWSER_PATH,
  RUNNER_PATH,
  ANCHOR_EVIDENCE_PATH,
  ANCHOR_RECEIPT_PATH,
  RECOVERY_EVIDENCE_PATH,
  RECOVERY_RECEIPT_PATH,
  REFRESH_EVIDENCE_PATH,
  REFRESH_RECEIPT_PATH,
  AMENDMENT_PATH
]);

const OCCURRENCES = Object.freeze([
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: AWARDS_MAIN, commitSha: AWARDS_MAIN, path: TARGET_PATH, gitBlobSha: TARGET_MAIN_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_GOVERNING_MAIN', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_PUBLIC_FACE_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'WORKING_CANDIDATE', refName: 'AWARDS_SELF_CONTAINED_MEDIA_REPAIR', commitSha: null, path: MEDIA_PATH, gitBlobSha: null, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'CANDIDATE_SITE_OWNED_MEDIA_PRESENT', occurrenceClass: 'H_EARTH_AWARDS_SITE_OWNED_PRESENTATION_MEDIA_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: OPERATION_BASE, commitSha: OPERATION_BASE, path: BROWSER_PATH, gitBlobSha: BROWSER_BASE_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_OPERATION_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_BROWSER_VALIDATOR_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: OPERATION_BASE, commitSha: OPERATION_BASE, path: RUNNER_PATH, gitBlobSha: RUNNER_BASE_BLOB, contentSha256: null, byteCount: null, existenceStatus: 'PRESENT', fetchbackStatus: 'VERIFIED_PRESENT_AT_EXACT_OPERATION_BASELINE', occurrenceClass: 'EXISTING_H_EARTH_AWARDS_STATIC_VALIDATOR_READ_ONLY_RECOGNITION' }),
  deepFreeze({ repository: REPOSITORY, refType: 'COMMIT', refName: AWARDS_MAIN, commitSha: AWARDS_MAIN, path: AMENDMENT_PATH, gitBlobSha: null, contentSha256: null, byteCount: null, existenceStatus: 'ABSENT', fetchbackStatus: 'VERIFIED_ABSENT_AT_GOVERNING_MAIN_BEFORE_AWARDS_REGISTRY_PREREQUISITE', occurrenceClass: 'AUTHORIZED_REGISTRY_PREREQUISITE_NOT_YET_MATERIALIZED_AT_GOVERNING_MAIN' })
]);

export const H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE = deepFreeze({
  evidenceId: EVIDENCE_ID,
  evidenceClass: 'EXISTING_H_EARTH_AWARDS_PUBLIC_FACE_MEDIA_VALIDATOR_AND_ANCHOR_EVIDENCE_PATH_RECOGNITION_WITH_EXACT_BLOB_CUSTODY',
  sourceKind: 'AUTOMATIC_PREFLIGHT_STOPS_PLUS_EXACT_FETCHBACK',
  sourceIdOrPath: 'PR935_AWARDS_PATH_PR1004_TROPHY_STANDARD_VALIDATORS_PR1065_ANCHOR_EVIDENCE_PR1072_MEDIA_RECOVERY_PR1078_SITE_OWNED_MEDIA_AND_PR1081_REFRESH_PATH_RECOGNITION',
  governingMain: AWARDS_MAIN,
  operationBase: OPERATION_BASE,
  exactTargetPathCount: 1,
  exactRecognizedPathCount: 11,
  registrationEffect: 'READ_ONLY_PATH_RECOGNITION_ONLY',
  assertionScope: Object.freeze(['EXACT_AWARDS_PATH', 'EXACT_AWARDS_SITE_OWNED_MEDIA_PATH', 'EXACT_TROPHY_STANDARD_BROWSER_VALIDATOR_PATH', 'EXACT_TROPHY_STANDARD_STATIC_VALIDATOR_PATH', 'EXACT_AWARDS_EXPERIENCE_ANCHOR_EVIDENCE_PATH', 'EXACT_AWARDS_EXPERIENCE_ANCHOR_RECEIPT_PATH', 'EXACT_AWARDS_MEDIA_RECOVERY_EVIDENCE_PATH', 'EXACT_AWARDS_MEDIA_RECOVERY_RECEIPT_PATH', 'EXACT_AWARDS_VIDEO_REFRESH_EVIDENCE_PATH', 'EXACT_AWARDS_VIDEO_REFRESH_RECEIPT_PATH', 'AUTOMATIC_H_EARTH_PREFLIGHT_PATH_RESOLUTION']),
  evidenceLimitations: Object.freeze(['NO_AWARDS_PRODUCT_MUTATION_AUTHORITY', 'NO_MEDIA_CONTENT_MUTATION_AUTHORITY', 'NO_VALIDATOR_MUTATION_AUTHORITY', 'NO_ANCHOR_EVIDENCE_CONTENT_AUTHORITY', 'NO_AWARD_OUTCOME_AUTHORITY', 'NO_SEMANTIC_OR_CANONICAL_IDENTITY_AUTHORITY', 'NO_H_EARTH_RUNTIME_RENDERER_TERRAIN_GEOMETRY_WORLD_OR_GAMEPLAY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'])
});

export const H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE = deepFreeze({
  nodeId: NODE_ID,
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'EXISTING_H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_SCOPE',
  displayName: 'H-Earth Awards Public Face Path Recognition',
  description: 'Read-only recognition of the promoted Awards public face, its site-owned presentation media, Trophy Standard verifier paths, and bounded experience-anchor evidence paths for automatic preflight resolution.',
  repositoryPaths: [...H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([EVIDENCE_ID]),
  lifecycleStatus: 'AUDIT_ONLY_PATH_RECOGNITION_REGISTERED',
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_EXISTING_H_EARTH_AWARDS_MEDIA_VALIDATOR_AND_ANCHOR_EVIDENCE_PATH_RECOGNITION',
  registrationEffect: 'PATH_RESOLUTION_ONLY',
  authoritySource: Object.freeze(['PR935_AUTOMATIC_PREFLIGHT_STOP', 'PR1004_AUTOMATIC_PREFLIGHT_STOPS', 'PR1065_EXPERIENCE_ANCHOR_PREFLIGHT_STOP', 'PR1072_MEDIA_RECOVERY_PREFLIGHT_STOP', 'PR1078_SITE_OWNED_MEDIA_PREFLIGHT_STOP', 'PR1081_VIDEO_REFRESH_PREFLIGHT_STOP', `EXACT_OPERATION_BASE=${OPERATION_BASE}`]),
  authorityScope: Object.freeze(['EXACT_PATH_RESOLUTION', 'EXACT_EXISTING_OCCURRENCE_IDENTITY', 'AWARDS_SITE_OWNED_MEDIA_PATH_RESOLUTION', 'AWARDS_EXPERIENCE_ANCHOR_EVIDENCE_PATH_RESOLUTION', 'AUTOMATIC_H_EARTH_PREFLIGHT_RESOLUTION']),
  authorityLimitations: Object.freeze(['NO_AWARDS_PRODUCT_MUTATION', 'NO_MEDIA_CONTENT_MUTATION_AUTHORITY', 'NO_BROWSER_VALIDATOR_MUTATION_AUTHORITY', 'NO_STATIC_VALIDATOR_MUTATION_AUTHORITY', 'NO_ANCHOR_EVIDENCE_CONTENT_AUTHORITY', 'NO_AWARD_OUTCOME_AUTHORITY', 'NO_SEMANTIC_AUTHORITY', 'NO_CANONICAL_IDENTITY_AUTHORITY', 'NO_H_EARTH_RUNTIME_AUTHORITY', 'NO_RENDERER_AUTHORITY', 'NO_TERRAIN_AUTHORITY', 'NO_GEOMETRY_AUTHORITY', 'NO_WORLD_AUTHORITY', 'NO_GAMEPLAY_AUTHORITY', 'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY']),
  parentRelations: Object.freeze([]), childRelations: Object.freeze([]), peerRelations: Object.freeze([]), upstreamBoundaries: Object.freeze([]), downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE', cardinalStatus: 'NONE', cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['PREFLIGHT_STOP_PRECEDES_PATH_RECOGNITION', 'PATH_RECOGNITION_PRECEDES_FRESH_PREFLIGHT']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'NONE_REGISTRATION_IS_READ_ONLY_PATH_RECOGNITION',
  prohibitedMutations: Object.freeze(['AWARDS_PAGE_MUTATION_FROM_REGISTRY_AUTHORITY', 'AWARDS_MEDIA_MUTATION_FROM_REGISTRY_AUTHORITY', 'VALIDATOR_MUTATION_FROM_REGISTRY_AUTHORITY', 'ANCHOR_EVIDENCE_CONTENT_MUTATION_FROM_REGISTRY_AUTHORITY', 'AWARD_OUTCOME_CLAIM_FROM_REGISTRY_AUTHORITY']),
  requiredValidations: Object.freeze(['EXACT_ONE_AWARDS_TARGET_PATH', 'EXACT_RECOGNIZED_AWARDS_MEDIA_PATH', 'EXACT_RECOGNIZED_VALIDATOR_PATHS', 'EXACT_RECOGNIZED_AWARDS_ANCHOR_EVIDENCE_PATHS', 'EXACT_RECOGNIZED_AWARDS_VIDEO_REFRESH_EVIDENCE_PATHS', 'PREDECESSOR_REGISTRY_IDENTITY_PRESERVED']),
  stoppingBoundaries: Object.freeze(['STOP_ON_PATH_OUTSIDE_EXACT_SCOPE', 'STOP_ON_AUTHORITY_EXPANSION']),
  currentIdentityReferences: Object.freeze([AWARDS_MAIN, OPERATION_BASE, `TARGET_MAIN_BLOB=${TARGET_MAIN_BLOB}`, MEDIA_PATH, `BROWSER_BASE_BLOB=${BROWSER_BASE_BLOB}`, `RUNNER_BASE_BLOB=${RUNNER_BASE_BLOB}`, ANCHOR_EVIDENCE_PATH, ANCHOR_RECEIPT_PATH, RECOVERY_EVIDENCE_PATH, RECOVERY_RECEIPT_PATH, REFRESH_EVIDENCE_PATH, REFRESH_RECEIPT_PATH]),
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_AWARDS_PUBLIC_FACE_RECOGNIZED_PATHS.map((repositoryPath) => [repositoryPath, deepFreeze({ nodes: Object.freeze([H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE]), occurrences: Object.freeze(OCCURRENCES.filter((entry) => entry.path === repositoryPath)) })]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({ ...baseInstance, evidenceRecords: [...(baseInstance.evidenceRecords ?? []), H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE], nodes: [...baseInstance.nodes.filter((node) => node.nodeId !== NODE_ID), H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE] });

export function getHEarthRepositoryRegistryInstance() { return combinedInstance; }
export function getHEarthRepositoryRegistryNode(nodeId) { return nodeId === NODE_ID ? H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId); }
export function getHEarthRepositoryRegistryEvidence(evidenceId) { return evidenceId === EVIDENCE_ID ? H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId); }
export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const normalized = normalizePath(repositoryPath);
  const indexed = pathIndex.get(normalized);
  if (!indexed) return baseFacade.resolveHEarthRepositoryRegistryPath(normalized ?? repositoryPath);
  const base = baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({ ...base, repositoryPath: normalized, resolved: true, nodes: [...(base.nodes ?? []), ...indexed.nodes], occurrences: [...(base.occurrences ?? []), ...indexed.occurrences], unresolved: false });
}
export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const normalizedPath = input.path == null ? null : normalizePath(input.path);
  const localMatches = OCCURRENCES.filter((entry) => (normalizedPath == null || entry.path === normalizedPath) && (input.refType == null || entry.refType === input.refType) && (input.refName == null || entry.refName === input.refName) && (input.commitSha == null || entry.commitSha === input.commitSha) && (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) && (input.existenceStatus == null || entry.existenceStatus === input.existenceStatus)).map((occurrence) => deepFreeze({ nodeId: NODE_ID, node: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence({ ...input, ...(normalizedPath == null ? {} : { path: normalizedPath }) });
  return deepFreeze({ query: base.query, matches: [...(base.matches ?? []), ...localMatches], resolved: base.resolved === true || localMatches.length > 0 });
}
export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE;
  const normalizedRepositoryPath = criteria.repositoryPath == null ? null : normalizePath(criteria.repositoryPath);
  const matches = (criteria.nodeId == null || criteria.nodeId === node.nodeId) && (normalizedRepositoryPath == null || node.repositoryPaths.includes(normalizedRepositoryPath)) && (criteria.nodeType == null || criteria.nodeType === node.nodeType) && (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) && (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return deepFreeze(matches ? [...base, node] : base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId, direction = 'BOTH') { return nodeId === NODE_ID ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction); }
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) { return nodeId === NODE_ID ? deepFreeze({ nodeId, nodes: [H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE], relations: [], resolved: true }) : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId); }

export function verifyHEarthAwardsPublicFacePathRecognition() {
  const targetResolution = resolveHEarthRepositoryRegistryPath(TARGET_PATH);
  const mediaResolution = resolveHEarthRepositoryRegistryPath(MEDIA_PATH);
  const browserResolution = resolveHEarthRepositoryRegistryPath(BROWSER_PATH);
  const runnerResolution = resolveHEarthRepositoryRegistryPath(RUNNER_PATH);
  const anchorEvidenceResolution = resolveHEarthRepositoryRegistryPath(ANCHOR_EVIDENCE_PATH);
  const anchorReceiptResolution = resolveHEarthRepositoryRegistryPath(ANCHOR_RECEIPT_PATH);
  const recoveryEvidenceResolution = resolveHEarthRepositoryRegistryPath(RECOVERY_EVIDENCE_PATH);
  const recoveryReceiptResolution = resolveHEarthRepositoryRegistryPath(RECOVERY_RECEIPT_PATH);
  const refreshEvidenceResolution = resolveHEarthRepositoryRegistryPath(REFRESH_EVIDENCE_PATH);
  const refreshReceiptResolution = resolveHEarthRepositoryRegistryPath(REFRESH_RECEIPT_PATH);
  const checks = deepFreeze({
    exactTargetPathCount: H_EARTH_AWARDS_PUBLIC_FACE_TARGET_PATHS.length === 1,
    targetPathResolves: targetResolution.resolved === true,
    targetOccurrenceMatched: (targetResolution.occurrences ?? []).some((entry) => entry.path === TARGET_PATH && entry.gitBlobSha === TARGET_MAIN_BLOB && entry.existenceStatus === 'PRESENT'),
    exactTargetMainBlob: OCCURRENCES.find((entry) => entry.path === TARGET_PATH)?.gitBlobSha === TARGET_MAIN_BLOB,
    awardsMediaPathResolves: mediaResolution.resolved === true,
    awardsMediaOccurrenceRecognized: (mediaResolution.occurrences ?? []).some((entry) => entry.path === MEDIA_PATH && entry.existenceStatus === 'PRESENT'),
    browserValidatorPathResolves: browserResolution.resolved === true,
    staticValidatorPathResolves: runnerResolution.resolved === true,
    awardsAnchorEvidencePathResolves: anchorEvidenceResolution.resolved === true,
    awardsAnchorReceiptPathResolves: anchorReceiptResolution.resolved === true,
    awardsRecoveryEvidencePathResolves: recoveryEvidenceResolution.resolved === true,
    awardsRecoveryReceiptPathResolves: recoveryReceiptResolution.resolved === true,
    awardsVideoRefreshEvidencePathResolves: refreshEvidenceResolution.resolved === true,
    awardsVideoRefreshReceiptPathResolves: refreshReceiptResolution.resolved === true,
    auditOnly: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityClass === 'AUDIT_ONLY',
    pathResolutionOnly: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.registrationEffect === 'PATH_RESOLUTION_ONLY',
    noAwardsMutationAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_AWARDS_PRODUCT_MUTATION'),
    noMediaMutationAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_MEDIA_CONTENT_MUTATION_AUTHORITY'),
    noRuntimeAuthority: H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_NODE.authorityLimitations.includes('NO_H_EARTH_RUNTIME_AUTHORITY')
  });
  return deepFreeze({
    schema: 'H_EARTH_AWARDS_PUBLIC_FACE_PATH_RECOGNITION_RECEIPT_v7',
    nodeId: NODE_ID,
    evidenceId: EVIDENCE_ID,
    checks,
    pass: Object.values(checks).every(Boolean),
    authorityCreated: false,
    mutationAuthorized: false,
    mergeAuthorized: false
  });
}

export default deepFreeze({
  ...baseFacade,
  getHEarthRepositoryRegistryInstance,
  getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,
  resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,
  findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,
  getHEarthRepositoryRegistryDependencyClosure,
  verifyHEarthAwardsPublicFacePathRecognition
});
