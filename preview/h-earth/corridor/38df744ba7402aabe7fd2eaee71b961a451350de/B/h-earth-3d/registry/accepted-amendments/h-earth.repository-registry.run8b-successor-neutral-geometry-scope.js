/** Read-only Run 8B path-registration overlay. */
import baseFacade from './h-earth.repository-registry.run8a-dimensional-reconciliation-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8b-successor-neutral-geometry-001';

export const H_EARTH_RUN_8B_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8b-successor-neutral-geometry-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8b.successor-neutral-geometry.js',
  '/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
  '/showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js',
  '/h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8B_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_8B_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_RUN_8B_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SCOPE_v1',
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  sourceKind: 'REPOSITORY_WORKSPACE_SOUTH_NEUTRAL_GEOMETRY_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_8B_WORKSPACE_PENDING_FINAL_EXECUTION',
  assertionScope: Object.freeze([
    'SUCCESSOR_TERRAIN_FIELD_REVISION',
    'CONTINUOUS_XZ_TERRAIN_FOOTPRINT',
    'AUTHORIZED_Y_ELEVATION_SURFACE',
    'MULTIPLE_Z_BANDS',
    'FORMER_BOUNDARY_CONTINUITY',
    'NONDEGENERATE_INDEXED_TRIANGLE_TOPOLOGY',
    'SOUTH_NEUTRAL_PRIMITIVE_VALIDITY',
    'LEGACY_PROXY_NONMUTATION',
    'DETERMINISTIC_REPEAT_EXECUTION'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'NO_WEST_ADMISSION',
    'NO_PACKET_002_TRANSFER',
    'NO_RENDERER_MUTATION',
    'NO_MATERIAL_OR_LIGHT_PRESENTATION',
    'NO_VEGETATION_INSTANCE_CONSTRUCTION',
    'NO_PUBLIC_ROUTE_MUTATION',
    'NO_DEPLOYMENT',
    'NO_VISUAL_IMPROVEMENT_CLAIM'
  ])
});

export const H_EARTH_RUN_8B_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'RUN_8B_SUCCESSOR_NEUTRAL_GEOMETRY_SCOPE_PACKAGE',
  displayName: 'H-Earth Run 8B Successor Neutral Geometry Scope Package',
  description:
    'Registers the exact Run 8B successor-field and South neutral-geometry construction paths for read-only automatic preflight.',
  repositoryPaths: [...H_EARTH_RUN_8B_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8B_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_RUN_8B_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_8B_EXECUTION_AUTHORIZATION',
    'RUN_8A_PASS_CLOSED',
    'EXISTING_SOUTH_NEUTRAL_CONSTRUCTION_KERNEL'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_8B_REPOSITORY_PATH_RESOLUTION',
    'RUN_8B_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_CREATE_GEOMETRY_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_ADMISSION_OR_TRANSFER_AUTHORITY',
    'PATH_REGISTRATION_DOES_NOT_CREATE_RENDERER_ROUTE_DEPLOYMENT_OR_VISUAL_AUTHORITY'
  ]),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze([]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8A_REOPENING',
    'RUN_6_TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION',
    'WEST_ADMISSION',
    'PACKET_002_TRANSFER',
    'RENDERER_OR_PUBLIC_ROUTE_MUTATION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_8B_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_8B_EXECUTED_SOUTH_NEUTRAL_GEOMETRY_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_8B_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_RUN_8A_LAWS_ARE_REOPENED',
    'STOP_IF_LEGACY_PROXY_IS_MUTATED',
    'STOP_IF_PRESENTATION_OR_ADMISSION_OCCURS_IN_RUN_8B'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_SUCCESSOR_TERRAIN_AND_MOUNTAIN_NEUTRAL_GEOMETRY_CONSTRUCTION_RUN_8B_v1',
    'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1',
    'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001',
    '88e2a3f8b5ff5fb8587ba95d2e13d3ea8504dfbd'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8B_SCOPE_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8B_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8B_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8B_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8B_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8B_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8B_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8B_SCOPE_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({
        repositoryPath,
        resolved: true,
        nodes: [indexed.node],
        occurrences: indexed.occurrences,
        unresolved: false
      })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({
      nodeId: H_EARTH_RUN_8B_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8B_SCOPE_NODE,
      occurrence
    }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({
    query: base.query,
    matches: [...base.matches, ...local],
    resolved: base.resolved || local.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8B_SCOPE_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode =
  (id, direction = 'BOTH') =>
    id === H_EARTH_RUN_8B_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8B_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8B_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8B_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8B_RECONCILED_FACADE;
