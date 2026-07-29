/**
 * H_EARTH_REPOSITORY_REGISTRY_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_v1
 *
 * Accepted read-only registry overlay for the complete, deterministic, nonfinal
 * Gratitude Region coordinate-reconciliation candidate set. This overlay admits
 * exact repository occurrences for scope resolution and preflight only. It does
 * not accept any spatial candidate, assign final coordinates, retarget or merge
 * PR #311, canonicalize the package, mutate terrain, construct geometry, or
 * authorize product work.
 */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const PACKAGE_BRANCH = 'agent/h-earth-gratitude-region-coordinate-reconciliation-001';
const PACKAGE_HEAD = 'a0cadd1e5ce70d98c34f11ddacb063c91816bd93';
const REGISTRY_BRANCH = 'agent/h-earth-gratitude-region-coordinate-reconciliation-registry-admission-001';
const SELF_PATH = '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gratitude-region-coordinate-reconciliation-scope.js';
const LOADER_PATH = '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_PACKAGE_OCCURRENCES = Object.freeze([
  ['/.github/workflows/h-earth-gratitude-region-coordinate-reconciliation.yml', '30b4cd8045130723ef73cfaaa86011b390541c8f'],
  ['/h-earth-3d/control-plane/region-001-reconciliation/h-earth.gratitude-region.coordinate-reconciliation.input-ledger.v1.json', 'c033b1a4de872b3e57fc11c3d2255331a175ec86'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.cavern-precinct-reconciliation.mjs', '2eb292b1a95abbb01f51a0492738cfccbf474b7d'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.cavern-precinct-reconciliation.receipt.v1.json', '48c51c8c889695cbd81b2bc0777e5d28a716776f'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.cavern-precinct-reconciliation.runner.mjs', '59d4de5eac912524c0041aeb1f61b63eca7418cd'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.coordinate-reconciliation.harness.mjs', '530bd9953b5767e253858116c6abeff7fc5a62f4'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.coordinate-reconciliation.harness.receipt.v1.json', '52f065a7ff8eb317d617bc9c03ac119172a1c5d2'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.entry-zone-reconciliation.mjs', 'b7e5d6378a772e3ba62320e609cb491365002d05'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.entry-zone-reconciliation.receipt.v1.json', 'cefc91a7ffa3047317e3902f3b29a591aaabe468'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.entry-zone-reconciliation.runner.mjs', 'ebf166d39cf815ded36af296006dd09a79232293'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.frontier-plains-capacity-relationship-reconciliation.mjs', '3b1123831ab195900365560b47d10c496f223609'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.frontier-plains-capacity-relationship-reconciliation.receipt.v1.json', '7b5c8596f39d6855cd975ada282c9a9b18f28fe9'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.frontier-plains-capacity-relationship-reconciliation.runner.mjs', 'd89d835bc249032af394836a03a486ded4e8a2b1'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.mirror-manor-reconciliation.mjs', 'ea41fe679c0b3f38efa8fd463418b9288b9387fb'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.mirror-manor-reconciliation.receipt.v1.json', '9dfc45298d0e5f07537807e0518e9743840839d9'],
  ['/h-earth-3d/validation/h-earth.gratitude-region.mirror-manor-reconciliation.runner.mjs', '72d06326cc1a990c5a748d7b4d2b8368b32c2c79']
]);

const PACKAGE_OCCURRENCES = Object.freeze(
  H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_PACKAGE_OCCURRENCES.map(([path, gitBlobSha]) => freeze({
    repository: REPOSITORY,
    refType: 'COMMIT',
    refName: PACKAGE_HEAD,
    commitSha: PACKAGE_HEAD,
    path,
    gitBlobSha,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED',
    occurrenceClass: 'CANDIDATE'
  }))
);

const REGISTRY_OCCURRENCES = Object.freeze([SELF_PATH, LOADER_PATH].map((path) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: REGISTRY_BRANCH,
  commitSha: null,
  path,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'NOT_PERFORMED',
  occurrenceClass: 'CANDIDATE'
})));

const ALL_OCCURRENCES = Object.freeze([...PACKAGE_OCCURRENCES, ...REGISTRY_OCCURRENCES]);
const ALL_PATHS = Object.freeze(ALL_OCCURRENCES.map((occurrence) => occurrence.path));

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CANDIDATE_SET_CLOSURE_v1',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'LOCAL_VALIDATION',
  sourceIdOrPath: '/h-earth-3d/validation/',
  sourceOccurrenceOrRevision:
    'PR=311;HEAD=a0cadd1e5ce70d98c34f11ddacb063c91816bd93;RUN=30473762392;JOB=90650192230;ARTIFACT=8732731793;ARTIFACT_DIGEST=sha256:39e417b62bfb6afba13756eeee8dfa170264e278afbc71a1ef24b5e676a0adfd;CLOSURE_DIGEST=c3ed6395005aaa47c49389920be815032fca7b63c49ce899a5cee06908bf56e7;REPEAT_DIGEST=9f87ce88f98e9015b09274bc855826e3dfa3700e7839173cf213eebf911cbd75',
  assertionScope: Object.freeze([
    'EXACT_SIXTEEN_PATH_PACKAGE_IDENTITY',
    'FOUR_REQUIRED_AREA_INVENTORY_COMPLETE',
    'FOUR_NONFINAL_CANDIDATES_DETERMINISTIC_AND_ELIGIBLE',
    'SIX_RELATIONSHIP_MATRIX_PASS',
    'PRESERVATION_MATRIX_PASS',
    'REPOSITORY_SCOPE_ADMISSION_ONLY'
  ]),
  verifiedOn: '2026-07-29',
  evidenceLimitations: Object.freeze([
    'NO_SPATIAL_CANDIDATE_ACCEPTANCE',
    'NO_FINAL_COORDINATE_OR_PLACEMENT_AUTHORITY',
    'NO_PR_311_RETARGET_OR_MERGE_AUTHORITY',
    'NO_CANONICALIZATION',
    'NO_TERRAIN_GEOMETRY_RUNTIME_GAMEPLAY_ROUTE_OR_PRODUCT_MUTATION'
  ])
});

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_CANDIDATE_SET_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'READ_ONLY_COORDINATE_RECONCILIATION_CANDIDATE_SET_PACKAGE',
  displayName: 'H-Earth Gratitude Region Coordinate-Reconciliation Candidate Set',
  description:
    'Complete four-area read-only Gratitude Region reconciliation package admitted for exact repository path and occurrence resolution while every spatial candidate remains nonfinal and nonaccepted.',
  repositoryPaths: ALL_PATHS,
  repositoryOccurrences: ALL_OCCURRENCES,
  evidenceClass: H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'NO_AUTHORITY',
  authorityPosture: 'REPOSITORY_SCOPE_RESOLUTION_AND_ADMISSION_RECORD_ONLY',
  authoritySource: Object.freeze([
    'H_EARTH_REGION_001_GRATITUDE_REGION_SPATIAL_INTERACTION_AREA_DEVELOPMENT_v1',
    'H_EARTH_REGION_001_MIRRORLAND_NARRATIVE_CHARACTER_TEMPORAL_RECONCILIATION_MANIFEST_v1',
    'GRATITUDE_REGION_COORDINATE_RECONCILIATION_CANDIDATE_SET_COMPLETENESS_AND_CLOSURE_AUDIT'
  ]),
  authorityScope: Object.freeze([
    'EXACT_SIXTEEN_PATH_PACKAGE_RESOLUTION',
    'READ_ONLY_PREFLIGHT_SCOPE_PROJECTION',
    'REPOSITORY_ADMISSION_BOUNDARY'
  ]),
  authorityLimitations: Object.freeze([
    'NO_SPATIAL_CANDIDATE_ACCEPTANCE',
    'NO_FINAL_COORDINATES_OR_ANCHORS',
    'NO_ROUTE_RELATION_ACCEPTANCE',
    'NO_PR_311_RETARGET_OR_MERGE_AUTHORITY',
    'NO_CANONICALIZATION',
    'NO_PRODUCT_CONSTRUCTION'
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
    'REGIONAL_CANDIDATE_SET_CLOSURE_BEFORE_REPOSITORY_REGISTRY_ADMISSION',
    'REPOSITORY_REGISTRY_ADMISSION_BEFORE_PR_BASE_AND_DELTA_RECONCILIATION',
    'PR_BASE_AND_DELTA_RECONCILIATION_BEFORE_ANY_RETARGET_OR_MERGE_DECISION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_INSPECTION',
  prohibitedMutations: Object.freeze([
    'SPATIAL_CANDIDATE_ACCEPTANCE',
    'FINAL_COORDINATE_ASSIGNMENT',
    'PR_311_RETARGET_OR_MERGE',
    'CANONICALIZATION',
    'TERRAIN_OR_GEOMETRY_MUTATION',
    'RUNTIME_GAMEPLAY_ROUTE_OR_PRODUCT_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_SIXTEEN_PATH_RESOLUTION',
    'EXACT_COMMIT_AND_BLOB_CUSTODY',
    'FOUR_AREA_INVENTORY_COMPLETENESS',
    'FOUR_CANDIDATE_DETERMINISM',
    'SIX_RELATIONSHIP_MATRIX_PASS',
    'PRESERVATION_MATRIX_PASS',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_PR_311_RETARGET',
    'STOP_BEFORE_PR_311_MERGE',
    'STOP_BEFORE_CANONICALIZATION',
    'STOP_BEFORE_FINAL_PLACEMENT_AUTHORITY',
    'STOP_BEFORE_PRODUCT_CONSTRUCTION'
  ]),
  currentIdentityReferences: Object.freeze([
    PACKAGE_BRANCH,
    PACKAGE_HEAD,
    'PR_311',
    'ROADMAP_BLOB=ee5ca94f5ae55ce8f11b460428b800ad4e9a2a9d',
    'MANIFEST_BLOB=1702d62036a6b241fdadddfabc304a5288f38652',
    'CLOSURE_RUN=30473762392',
    'CLOSURE_ARTIFACT=8732731793',
    'CLOSURE_DIGEST=c3ed6395005aaa47c49389920be815032fca7b63c49ce899a5cee06908bf56e7',
    'CLOSURE_REPEAT_DIGEST=9f87ce88f98e9015b09274bc855826e3dfa3700e7839173cf213eebf911cbd75'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([
    'PR_311_BASE_AND_DELTA_RECONCILIATION',
    'PR_311_RETARGET_DECISION',
    'PR_311_MERGE_DECISION',
    'CONTROLLING_ARTIFACT_REFERENCE_UPDATE',
    'SEPARATE_FINAL_PLACEMENT_DISPOSITION'
  ])
});

const NODE = H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_NODE;
const EVIDENCE = H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_EVIDENCE;
const pathIndex = new Map(ALL_PATHS.map((repositoryPath) => [repositoryPath, {
  node: NODE,
  occurrences: ALL_OCCURRENCES.filter((occurrence) => occurrence.path === repositoryPath)
}]));
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, EVIDENCE],
  nodes: [...baseInstance.nodes, NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (nodeId) =>
  nodeId === NODE.nodeId ? NODE : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
export const getHEarthRepositoryRegistryEvidence = (evidenceId) =>
  evidenceId === EVIDENCE.evidenceId ? EVIDENCE : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = ALL_OCCURRENCES
    .filter((occurrence) =>
      (input.path == null || occurrence.path === input.path)
      && (input.commitSha == null || occurrence.commitSha === input.commitSha)
      && (input.gitBlobSha == null || occurrence.gitBlobSha === input.gitBlobSha)
      && (input.refName == null || occurrence.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: NODE.nodeId, node: NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const matches =
    (criteria.repositoryPath == null || NODE.repositoryPaths.includes(criteria.repositoryPath))
    && (criteria.nodeType == null || criteria.nodeType === NODE.nodeType)
    && (criteria.nodeSubtype == null || criteria.nodeSubtype === NODE.nodeSubtype)
    && (criteria.authorityClass == null || criteria.authorityClass === NODE.authorityClass)
    && (criteria.cardinalRole == null || criteria.cardinalRole === NODE.cardinalRole)
    && (criteria.lifecycleStatus == null || criteria.lifecycleStatus === NODE.lifecycleStatus)
    && (criteria.hasUnresolvedFields == null || ((NODE.unresolvedFields.length > 0) === criteria.hasUnresolvedFields))
    && (criteria.text == null || [NODE.nodeId, NODE.displayName, NODE.description, NODE.authorityPosture, ...NODE.repositoryPaths, ...NODE.currentIdentityReferences]
      .join('\n').toLowerCase().includes(String(criteria.text).toLowerCase()));
  return freeze(matches ? [...base, NODE] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (nodeId, direction = 'BOTH') =>
  nodeId === NODE.nodeId ? Object.freeze([]) : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (nodeId) =>
  nodeId === NODE.nodeId
    ? freeze({ nodeId, nodes: [NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);

export const H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_FACADE = freeze({
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

export default H_EARTH_GRATITUDE_REGION_COORDINATE_RECONCILIATION_SCOPE_FACADE;
