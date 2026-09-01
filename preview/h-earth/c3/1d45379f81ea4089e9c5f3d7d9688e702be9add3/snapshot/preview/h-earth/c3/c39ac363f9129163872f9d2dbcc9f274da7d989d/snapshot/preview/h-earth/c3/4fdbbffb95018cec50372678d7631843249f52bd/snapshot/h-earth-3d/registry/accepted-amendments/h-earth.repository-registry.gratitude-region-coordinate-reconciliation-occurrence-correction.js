/**
 * H_EARTH_REPOSITORY_REGISTRY_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_v1
 *
 * Successor read-only registry overlay correcting one unretrievable Git blob
 * identity in the admitted Gratitude Region package. The PR #317 overlay is
 * preserved as historical custody. This successor changes no spatial result,
 * accepts no candidate, assigns no coordinate, and creates no PR #311 merge,
 * retargeting, canonicalization, terrain, geometry, runtime, or product authority.
 */
import baseFacade, {
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_PACKAGE_OCCURRENCES as BASE_PACKAGE_OCCURRENCES,
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_EVIDENCE as BASE_EVIDENCE,
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_NODE as BASE_NODE
} from './h-earth.repository-registry.gratitude-region-coordinate-reconciliation-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const PACKAGE_HEAD = 'a0cadd1e5ce70d98c34f11ddacb063c91816bd93';
const ACTIVE_MAIN_MERGE_COMMIT = '879e47bd6b8bb2289878d6c2938fe892d4b23471';
const CORRECTION_BRANCH = 'agent/h-earth-gratitude-region-registry-occurrence-correction-001';
const TARGET_PATH = '/h-earth-3d/validation/h-earth.gratitude-region.mirror-manor-reconciliation.runner.mjs';
const RETIRED_UNRETRIEVABLE_BLOB = '72d06326cc1a990c5a748d7b4d2b8368b32c2c79';
const CORRECTED_RETRIEVED_BLOB = '72d0ffcd9835a2a02b18b220382db105edbc4314';
const CORRECTION_SELF_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gratitude-region-coordinate-reconciliation-occurrence-correction.js';
const LOADER_PATH = '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CORRECTED_PACKAGE_OCCURRENCES = Object.freeze(
  BASE_PACKAGE_OCCURRENCES.map(([path, gitBlobSha]) => Object.freeze([
    path,
    path === TARGET_PATH ? CORRECTED_RETRIEVED_BLOB : gitBlobSha
  ]))
);

const correctedPackageMap = new Map(H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CORRECTED_PACKAGE_OCCURRENCES);
const correctedBaseOccurrences = BASE_NODE.repositoryOccurrences.map((occurrence) => {
  if (occurrence.path !== TARGET_PATH || occurrence.commitSha !== PACKAGE_HEAD) return occurrence;
  return freeze({
    ...occurrence,
    gitBlobSha: CORRECTED_RETRIEVED_BLOB,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED'
  });
});
const correctionRegistryOccurrences = Object.freeze([
  CORRECTION_SELF_PATH,
  LOADER_PATH
].map((path) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: CORRECTION_BRANCH,
  commitSha: null,
  path,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
})));
const ALL_OCCURRENCES = Object.freeze([...correctedBaseOccurrences, ...correctionRegistryOccurrences]);
const ALL_PATHS = Object.freeze([...new Set(ALL_OCCURRENCES.map((occurrence) => occurrence.path))]);

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_v1',
  evidenceClass: 'EXACT_REPOSITORY_OCCURRENCE_IDENTITY_CORRECTION',
  sourceKind: 'ACTIVE_MAIN_EXECUTION_VALIDATION',
  sourceIdOrPath: TARGET_PATH,
  sourceOccurrenceOrRevision:
    'ACTIVE_MAIN=879e47bd6b8bb2289878d6c2938fe892d4b23471;FAILED_RUN=30476481891;FAILED_JOB=90659364191;ARTIFACT=8733806152;ARTIFACT_DIGEST=sha256:52c6a2f9a0bcabb512df37b8b4cba12b2b46749c14f7eef56f7c164db329911a;FAILED_REPEAT_DIGEST=b4538b35b5f8c6f0e2f547c5cc26c81826cf7e5a8f15a4c1df38b2cf8fd5a49e',
  assertionScope: Object.freeze([
    'ONE_PACKAGE_OCCURRENCE_IDENTITY_CORRECTED',
    'PACKAGE_HEAD_UNCHANGED',
    'PACKAGE_PATH_SET_UNCHANGED',
    'SPATIAL_RESULTS_UNCHANGED',
    'AUTHORITY_BOUNDARY_UNCHANGED'
  ]),
  verifiedOn: '2026-07-29',
  correction: freeze({
    path: TARGET_PATH,
    packageHead: PACKAGE_HEAD,
    retiredUnretrievableBlob: RETIRED_UNRETRIEVABLE_BLOB,
    correctedRetrievedBlob: CORRECTED_RETRIEVED_BLOB,
    retiredBlobRetrievable: false,
    correctedBlobRetrievedFromExactPackageHead: true
  }),
  evidenceLimitations: Object.freeze([
    'NO_SPATIAL_CANDIDATE_ACCEPTANCE',
    'NO_FINAL_COORDINATE_OR_PLACEMENT_AUTHORITY',
    'NO_PR_311_RETARGET_OR_MERGE_AUTHORITY',
    'NO_CANONICALIZATION',
    'NO_TERRAIN_GEOMETRY_RUNTIME_GAMEPLAY_ROUTE_OR_PRODUCT_MUTATION'
  ])
});

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CORRECTED_SCOPE_NODE = freeze({
  ...BASE_NODE,
  repositoryPaths: ALL_PATHS,
  repositoryOccurrences: ALL_OCCURRENCES,
  evidenceReferences: Object.freeze([
    ...BASE_NODE.evidenceReferences,
    H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_EVIDENCE.evidenceId
  ]),
  authorityPosture: 'REPOSITORY_SCOPE_RESOLUTION_WITH_EXACT_OCCURRENCE_IDENTITY_CORRECTION_ONLY',
  requiredValidations: Object.freeze([
    ...BASE_NODE.requiredValidations,
    'ACTIVE_MAIN_EXACT_GIT_TREE_OCCURRENCE_VERIFICATION'
  ]),
  currentIdentityReferences: Object.freeze([
    ...BASE_NODE.currentIdentityReferences,
    `ACTIVE_MAIN_MERGE_COMMIT=${ACTIVE_MAIN_MERGE_COMMIT}`,
    `OCCURRENCE_CORRECTION_PATH=${TARGET_PATH}`,
    `RETIRED_UNRETRIEVABLE_BLOB=${RETIRED_UNRETRIEVABLE_BLOB}`,
    `CORRECTED_RETRIEVED_BLOB=${CORRECTED_RETRIEVED_BLOB}`,
    'FAILED_ACTIVE_MAIN_VERIFICATION_RUN=30476481891'
  ]),
  lifecycleStatus: 'CANDIDATE'
});

const NODE = H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CORRECTED_SCOPE_NODE;
const EVIDENCE = H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_EVIDENCE;
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, EVIDENCE],
  nodes: baseInstance.nodes.map((node) => node.nodeId === NODE.nodeId ? NODE : node)
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (nodeId) =>
  nodeId === NODE.nodeId ? NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence = (evidenceId) =>
  evidenceId === EVIDENCE.evidenceId
    ? EVIDENCE
    : evidenceId === BASE_EVIDENCE.evidenceId
      ? BASE_EVIDENCE
      : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  if (!NODE.repositoryPaths.includes(repositoryPath)) return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  return freeze({
    repositoryPath,
    resolved: true,
    nodes: [NODE],
    occurrences: NODE.repositoryOccurrences.filter((occurrence) => occurrence.path === repositoryPath),
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  const baseMatches = (base.matches ?? []).filter((match) => match.nodeId !== NODE.nodeId);
  const local = NODE.repositoryOccurrences
    .filter((occurrence) =>
      (input.path == null || occurrence.path === input.path)
      && (input.commitSha == null || occurrence.commitSha === input.commitSha)
      && (input.gitBlobSha == null || occurrence.gitBlobSha === input.gitBlobSha)
      && (input.refName == null || occurrence.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: NODE.nodeId, node: NODE, occurrence }));
  return freeze({ query: base.query, matches: [...baseMatches, ...local], resolved: baseMatches.length > 0 || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  return freeze(baseFacade.findHEarthRepositoryRegistryNodes(criteria)
    .map((node) => node.nodeId === NODE.nodeId ? NODE : node));
}

export const getHEarthRepositoryRegistryRelationsForNode = (nodeId, direction = 'BOTH') =>
  nodeId === NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (nodeId) =>
  nodeId === NODE.nodeId
    ? freeze({ nodeId, nodes: [NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_FACADE = freeze({
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

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_FACADE;
