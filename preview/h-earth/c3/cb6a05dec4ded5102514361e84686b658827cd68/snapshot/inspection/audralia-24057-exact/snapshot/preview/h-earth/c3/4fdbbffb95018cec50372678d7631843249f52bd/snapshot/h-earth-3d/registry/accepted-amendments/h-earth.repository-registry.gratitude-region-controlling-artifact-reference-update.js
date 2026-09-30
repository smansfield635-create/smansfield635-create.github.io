/**
 * H_EARTH_REPOSITORY_REGISTRY_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_v1
 *
 * Successor read-only registry overlay binding the unchanged Gratitude Region
 * controlling v1 artifacts to the exact PR #311 package now active on main.
 * This overlay updates lifecycle reference custody only. It accepts no spatial
 * candidate, assigns no coordinate, canonicalizes nothing, and creates no
 * terrain, geometry, runtime, gameplay, public-route, live-page, or product
 * construction authority.
 */
import baseFacade, {
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CORRECTED_SCOPE_NODE as BASE_NODE,
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_OCCURRENCE_CORRECTION_EVIDENCE as BASE_EVIDENCE
} from './h-earth.repository-registry.gratitude-region-coordinate-reconciliation-occurrence-correction.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const REFERENCE_UPDATE_BRANCH = 'agent/h-earth-gratitude-region-controlling-artifact-reference-update-001';
const PACKAGE_HEAD = 'a0cadd1e5ce70d98c34f11ddacb063c91816bd93';
const PACKAGE_BASE_AT_MERGE = '8ed5faaffb3ce62190e5268a2538b3d4c6e4ea2f';
const ACTIVE_MAIN_PACKAGE_MERGE_COMMIT = 'd30bb105762b4205df90c3450de6c13076ef072e';
const ACTIVE_PACKAGE_PATH_COUNT = 16;
const SPATIAL_ARTIFACT_PATH = '/h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.gratitude-region-spatial-interaction-area-development.v1.json';
const SPATIAL_ARTIFACT_BLOB = 'ee5ca94f5ae55ce8f11b460428b800ad4e9a2a9d';
const MANIFEST_PATH = '/h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.mirrorland-narrative-character-temporal-reconciliation.manifest.v1.json';
const MANIFEST_BLOB = '1702d62036a6b241fdadddfabc304a5288f38652';
const REFERENCE_AMENDMENT_PATH = '/h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.gratitude-region-coordinate-reconciliation.active-main-reference-amendment.v1.json';
const REFERENCE_AMENDMENT_BLOB = '7ef817685ce12a3a93fdf0a03391ac52c2df2664';
const SELF_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gratitude-region-controlling-artifact-reference-update.js';
const LOADER_PATH = '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';

const REFERENCE_UPDATE_OCCURRENCES = Object.freeze([
  freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: REFERENCE_UPDATE_BRANCH,
    commitSha: null,
    path: REFERENCE_AMENDMENT_PATH,
    gitBlobSha: REFERENCE_AMENDMENT_BLOB,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED',
    occurrenceClass: 'CANDIDATE'
  }),
  ...[SELF_PATH, LOADER_PATH].map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: REFERENCE_UPDATE_BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'NOT_PERFORMED',
    occurrenceClass: 'CANDIDATE'
  }))
]);

const ALL_OCCURRENCES = Object.freeze([...BASE_NODE.repositoryOccurrences, ...REFERENCE_UPDATE_OCCURRENCES]);
const ALL_PATHS = Object.freeze([...new Set(ALL_OCCURRENCES.map((occurrence) => occurrence.path))]);

export const H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_v1',
  evidenceClass: 'ACTIVE_MAIN_PACKAGE_AND_CONTROLLING_ARTIFACT_REFERENCE_CUSTODY',
  sourceKind: 'POST_MERGE_EXACT_MAIN_EXECUTION_VALIDATION',
  sourceIdOrPath: REFERENCE_AMENDMENT_PATH,
  sourceOccurrenceOrRevision:
    'PR=311;PACKAGE_HEAD=a0cadd1e5ce70d98c34f11ddacb063c91816bd93;BASE_AT_MERGE=8ed5faaffb3ce62190e5268a2538b3d4c6e4ea2f;MERGE_COMMIT=d30bb105762b4205df90c3450de6c13076ef072e;PATH_COUNT=16;REGISTRY=PASS_CLOSED;POST_MERGE_RUN=30481132636;POST_MERGE_JOB=90675213287;ARTIFACT=8735677584;ARTIFACT_DIGEST=sha256:50114608d8061dc63c35862969eb7544247e001c8d772acc4d05769378bd9364;REPEAT_DIGEST=c77bec499d0748384eef19666b502f8d8e13375a463d7aac824136addbeb1f9f',
  assertionScope: Object.freeze([
    'UNCHANGED_CONTROLLING_V1_ARTIFACT_IDENTITIES',
    'EXACT_ACTIVE_MAIN_SIXTEEN_PATH_PACKAGE_REFERENCE',
    'ACTIVE_REGISTRY_RESOLUTION_PASS_CLOSED',
    'POST_MERGE_EXECUTION_PASS_CLOSED',
    'REFERENCE_CUSTODY_UPDATE_ONLY'
  ]),
  verifiedOn: '2026-07-29',
  controllingArtifactReferences: Object.freeze([
    freeze({ path: SPATIAL_ARTIFACT_PATH, gitBlobSha: SPATIAL_ARTIFACT_BLOB }),
    freeze({ path: MANIFEST_PATH, gitBlobSha: MANIFEST_BLOB })
  ]),
  activePackageReference: freeze({
    packageHead: PACKAGE_HEAD,
    baseAtMerge: PACKAGE_BASE_AT_MERGE,
    activeMainMergeCommit: ACTIVE_MAIN_PACKAGE_MERGE_COMMIT,
    activePackagePathCount: ACTIVE_PACKAGE_PATH_COUNT,
    registryResolution: 'PASS_CLOSED',
    postMergeExecution: 'PASS_CLOSED'
  }),
  evidenceLimitations: Object.freeze([
    'NO_SPATIAL_CANDIDATE_ACCEPTANCE',
    'NO_FINAL_COORDINATE_OR_PLACEMENT_AUTHORITY',
    'NO_CANONICALIZATION',
    'NO_TERRAIN_GEOMETRY_RUNTIME_GAMEPLAY_ROUTE_LIVE_PAGE_OR_PRODUCT_MUTATION',
    'NO_REFERENCE_UPDATE_MERGE_AUTHORITY'
  ])
});

const CLEARED_LIFECYCLE_FIELDS = new Set([
  'PR_311_BASE_AND_DELTA_RECONCILIATION',
  'PR_311_RETARGET_DECISION',
  'PR_311_MERGE_DECISION',
  'CONTROLLING_ARTIFACT_REFERENCE_UPDATE'
]);

export const H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_SCOPE_NODE = freeze({
  ...BASE_NODE,
  repositoryPaths: ALL_PATHS,
  repositoryOccurrences: ALL_OCCURRENCES,
  evidenceReferences: Object.freeze([
    ...BASE_NODE.evidenceReferences,
    H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_EVIDENCE.evidenceId
  ]),
  authorityPosture: 'CONTROLLING_ARTIFACT_REFERENCE_CUSTODY_UPDATE_ONLY',
  authorityScope: Object.freeze([
    ...BASE_NODE.authorityScope,
    'UNCHANGED_CONTROLLING_ARTIFACT_REFERENCE_BINDING',
    'ACTIVE_MAIN_PACKAGE_MERGE_REFERENCE',
    'POST_MERGE_EXECUTION_CUSTODY_REFERENCE'
  ]),
  authorityLimitations: Object.freeze([
    ...new Set([
      ...BASE_NODE.authorityLimitations,
      'NO_SPATIAL_CANDIDATE_ACCEPTANCE',
      'NO_FINAL_COORDINATES_OR_ANCHORS',
      'NO_CANONICALIZATION',
      'NO_PRODUCT_CONSTRUCTION',
      'NO_LIVE_PAGE_CHANGE'
    ])
  ]),
  orderingRules: Object.freeze([
    ...BASE_NODE.orderingRules,
    'PR_311_POST_MERGE_EXACT_MAIN_EXECUTION_BEFORE_CONTROLLING_ARTIFACT_REFERENCE_UPDATE',
    'CONTROLLING_ARTIFACT_REFERENCE_UPDATE_BEFORE_FINAL_CANDIDATE_PLACEMENT_DISPOSITION'
  ]),
  requiredValidations: Object.freeze([
    ...BASE_NODE.requiredValidations,
    'UNCHANGED_CONTROLLING_V1_ARTIFACT_BLOB_VERIFICATION',
    'ACTIVE_MAIN_PACKAGE_MERGE_TOPOLOGY_VERIFICATION',
    'REFERENCE_AMENDMENT_EXACT_BLOB_VERIFICATION',
    'REFERENCE_UPDATE_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_REFERENCE_UPDATE_CANDIDATE_MERGE',
    'STOP_BEFORE_FINAL_PLACEMENT_AUTHORITY',
    'STOP_BEFORE_CANONICALIZATION',
    'STOP_BEFORE_TERRAIN_GEOMETRY_RUNTIME_GAMEPLAY_ROUTE_LIVE_PAGE_OR_PRODUCT_CONSTRUCTION'
  ]),
  currentIdentityReferences: Object.freeze([
    ...BASE_NODE.currentIdentityReferences,
    `ACTIVE_MAIN_PACKAGE_MERGE_COMMIT=${ACTIVE_MAIN_PACKAGE_MERGE_COMMIT}`,
    `ACTIVE_PACKAGE_PATH_COUNT=${ACTIVE_PACKAGE_PATH_COUNT}`,
    'ACTIVE_REGISTRY_RESOLUTION=PASS_CLOSED',
    'POST_MERGE_EXECUTION=PASS_CLOSED',
    `SPATIAL_ARTIFACT_BLOB=${SPATIAL_ARTIFACT_BLOB}`,
    `CONTROLLING_MANIFEST_BLOB=${MANIFEST_BLOB}`,
    `REFERENCE_AMENDMENT_BLOB=${REFERENCE_AMENDMENT_BLOB}`,
    'POST_MERGE_RUN=30481132636',
    'POST_MERGE_ARTIFACT=8735677584',
    'POST_MERGE_REPEAT_DIGEST=c77bec499d0748384eef19666b502f8d8e13375a463d7aac824136addbeb1f9f'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze(
    BASE_NODE.unresolvedFields.filter((field) => !CLEARED_LIFECYCLE_FIELDS.has(field))
  )
});

const NODE = H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_SCOPE_NODE;
const EVIDENCE = H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_EVIDENCE;
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

export const H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_FACADE = freeze({
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

export default H_EARTH_GRATITUDE_REGION_CONTROLLING_ARTIFACT_REFERENCE_UPDATE_FACADE;
