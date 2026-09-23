/**
 * H_EARTH_REPOSITORY_REGISTRY_C2_R1_CANDIDATE_PATH_DISPOSITION_v4
 *
 * Read-only path-resolution overlay for the bounded C2-R1 candidate package.
 * It registers the control prefix, immutable R1.1-R1.5 authorities, and the
 * isolated R1.6 swash/foam/wetness authority. Registration creates no mutation,
 * merge, renderer, route, deployment, product, or visual-success authority.
 */

import baseFacade from './h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-c2-r1-physically-coherent-coastal-successor-001';
const CONTROL_PREFIX = '/h-earth-3d/control-plane/coastal-morphology/c2-r1/';

export const H_EARTH_C2_R1_CANDIDATE_EXACT_PATHS = Object.freeze([
  '/h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js',
  '/h-earth-3d/terrain/h-earth.coastal-sediment-membership.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-water-optics.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-breaker-field.c2-r1.js',
  '/h-earth-3d/environment/h-earth.coastal-swash-foam-wetness.c2-r1.js'
]);

export const H_EARTH_C2_R1_CANDIDATE_PATH_DISPOSITION_ID =
  'H_EARTH_REPOSITORY_REGISTRY_C2_R1_CANDIDATE_PATH_DISPOSITION_v4';

function controlsPath(repositoryPath) {
  return typeof repositoryPath === 'string' && (
    repositoryPath.startsWith(CONTROL_PREFIX) ||
    H_EARTH_C2_R1_CANDIDATE_EXACT_PATHS.includes(repositoryPath)
  );
}

function occurrenceFor(repositoryPath) {
  return deepFreeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'NOT_PERFORMED',
    occurrenceClass: 'CANDIDATE'
  });
}

export const H_EARTH_C2_R1_CANDIDATE_PATH_EVIDENCE = deepFreeze({
  evidenceId: 'EVIDENCE_H_EARTH_C2_R1_CANDIDATE_PATH_DISPOSITION_v4',
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  sourceKind: 'EXPLICIT_MANAGEMENT_DISPOSITION_AND_EXECUTED_REPOSITORY_WORK',
  sourceIdOrPath: CONTROL_PREFIX,
  sourceOccurrenceOrRevision:
    'R1_0_PASS_CLOSED;R1_1_PASS_CLOSED;R1_2_PASS_CLOSED;R1_3_PASS_CLOSED;R1_4_PASS_CLOSED;R1_5_PASS_CLOSED;R1_6_AUTHORIZED',
  assertionScope: Object.freeze([
    'C2_R1_CONTROL_PREFIX_PATH_RESOLUTION',
    'C2_R1_ISOLATED_TERRAIN_AUTHORITY_PATH_RESOLUTION',
    'C2_R1_ISOLATED_WATER_OPTICS_PATH_RESOLUTION',
    'C2_R1_ISOLATED_BREAKER_FIELD_PATH_RESOLUTION',
    'C2_R1_ISOLATED_SWASH_FOAM_WETNESS_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_ONLY'
  ]),
  verifiedOn: '2026-07-31',
  evidenceLimitations: Object.freeze([
    'NO_GEOMETRY_CHANGE_AUTHORITY_BEYOND_ACCEPTED_R1_1',
    'NO_NORMAL_OR_LIGHTING_CHANGE_AUTHORITY_BEYOND_ACCEPTED_R1_2',
    'NO_SEDIMENT_MEMBERSHIP_CHANGE_AUTHORITY_BEYOND_ACCEPTED_R1_3',
    'NO_WATER_OPTICS_CHANGE_AUTHORITY_BEYOND_ACCEPTED_R1_4',
    'NO_BREAKER_ELIGIBILITY_LAW_CHANGE_AUTHORITY_BEYOND_ACCEPTED_R1_5',
    'R1_6_SWASH_FOAM_WETNESS_AND_CANDIDATE_ANIMATION_ONLY',
    'NO_OPEN_OCEAN_GEOMETRY_DISPLACEMENT',
    'NO_RENDERER_CAMERA_TRAVERSAL_OR_ROUTE_AUTHORITY',
    'NO_PRODUCT_DEFAULT_MUTATION',
    'NO_VISUAL_SUCCESS_CLAIM',
    'NO_MERGE_OR_DEPLOYMENT_AUTHORITY'
  ])
});

export const H_EARTH_C2_R1_CANDIDATE_PATH_NODE = deepFreeze({
  nodeId: 'H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'CANDIDATE_COASTAL_SUCCESSOR_PACKAGE',
  displayName: 'H-Earth C2-R1 Physically Coherent Coastal Successor Candidate',
  description:
    'Sequential bounded C2 replacement attempt from the accepted pre-C2 baseline; R1.6 consumes accepted R1.1 geometry, R1.2 normals, R1.3 sediment memberships, R1.4 actual-depth optics, and R1.5 breaker eligibility/intensity as immutable inputs.',
  repositoryPaths: Object.freeze([
    CONTROL_PREFIX,
    ...H_EARTH_C2_R1_CANDIDATE_EXACT_PATHS
  ]),
  repositoryOccurrences: Object.freeze([
    occurrenceFor(CONTROL_PREFIX),
    ...H_EARTH_C2_R1_CANDIDATE_EXACT_PATHS.map(occurrenceFor)
  ]),
  evidenceClass: 'EXISTING_BOUNDARY_RELATION_OBSERVED',
  evidenceReferences: Object.freeze([
    H_EARTH_C2_R1_CANDIDATE_PATH_EVIDENCE.evidenceId
  ]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture:
    'READ_ONLY_PATH_RESOLUTION_FOR_SEPARATELY_AUTHORIZED_BOUNDED_C2_R1_PASSES',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_MANAGEMENT_DISPOSITION',
    'R1_0_THROUGH_R1_5_EXECUTED_CLOSURE_EVIDENCE'
  ]),
  authorityScope: Object.freeze([
    'EXACT_AND_PREFIX_PATH_RESOLUTION',
    'CANDIDATE_PACKAGE_SCOPE_PROJECTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_MUTATION',
    'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_MERGE',
    'NO_PUBLIC_ROUTE_OR_PRODUCT_DEFAULT_MUTATION',
    'NO_VISUAL_SUCCESSOR_CLASSIFICATION'
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
    'R1_0_BEFORE_R1_1_BEFORE_R1_2_BEFORE_R1_3_BEFORE_R1_4_BEFORE_R1_5_BEFORE_R1_6',
    'ONE_BOUNDED_PASS_AT_A_TIME'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'READ_ONLY_PREFLIGHT_PATH_REGISTRATION_ONLY',
  prohibitedMutations: Object.freeze([
    'COASTAL_GEOMETRY_CHANGE_AFTER_R1_1_CLOSURE',
    'NORMAL_OR_LIGHTING_CHANGE_AFTER_R1_2_CLOSURE',
    'SEDIMENT_MEMBERSHIP_CHANGE_AFTER_R1_3_CLOSURE',
    'WATER_OPTICS_CHANGE_AFTER_R1_4_CLOSURE',
    'BREAKER_ELIGIBILITY_LAW_CHANGE_AFTER_R1_5_CLOSURE',
    'OPEN_OCEAN_GEOMETRY_DISPLACEMENT_DURING_R1_6',
    'RENDERER_LIFECYCLE_CHANGE',
    'CAMERA_OR_TRAVERSAL_CHANGE',
    'PUBLIC_ROUTE_OR_PRODUCT_DEFAULT_CHANGE',
    'MERGE_WITHOUT_SEPARATE_AUTHORIZATION'
  ]),
  requiredValidations: Object.freeze([
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'R1_1_GEOMETRY_BLOB_IDENTITY',
    'R1_2_NORMAL_SURFACE_BLOB_IDENTITY',
    'R1_3_SEDIMENT_BLOB_IDENTITY',
    'R1_4_WATER_OPTICS_BLOB_IDENTITY',
    'R1_5_BREAKER_FIELD_BLOB_IDENTITY',
    'R1_6_SWASH_ADVANCE_AND_RETREAT',
    'R1_6_BREAKER_ALIGNED_TRANSIENT_NONLUMINOUS_FOAM',
    'R1_6_TEMPORARY_WETNESS_AND_DECAY',
    'R1_6_NO_PARALLEL_STRIPS_OR_FLOATING_BANDS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_ON_UNRESOLVED_CANDIDATE_PATH',
    'STOP_ON_R1_1_THROUGH_R1_5_IDENTITY_DRIFT',
    'STOP_BEFORE_R1_7_WITHOUT_R1_6_PASS_CLOSED',
    'STOP_BEFORE_PUBLIC_PROMOTION_WITHOUT_ACCEPTED_USER_DIFFERENTIAL'
  ]),
  currentIdentityReferences: Object.freeze([
    'C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR',
    '7273cbb3dfd98f7fbca5d4e10ac51cd732678968',
    'R1_6_RESTRAINED_SWASH_FOAM_AND_WETNESS'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = deepFreeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_C2_R1_CANDIDATE_PATH_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_C2_R1_CANDIDATE_PATH_NODE
  ]
});

export function getHEarthRepositoryRegistryInstance() {
  return combinedInstance;
}

export function getHEarthRepositoryRegistryNode(nodeId) {
  return nodeId === H_EARTH_C2_R1_CANDIDATE_PATH_NODE.nodeId
    ? H_EARTH_C2_R1_CANDIDATE_PATH_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}

export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return evidenceId === H_EARTH_C2_R1_CANDIDATE_PATH_EVIDENCE.evidenceId
    ? H_EARTH_C2_R1_CANDIDATE_PATH_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  if (!controlsPath(repositoryPath)) {
    return baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  }
  return deepFreeze({
    repositoryPath,
    resolved: true,
    nodes: [H_EARTH_C2_R1_CANDIDATE_PATH_NODE],
    occurrences: [occurrenceFor(repositoryPath)],
    unresolved: false
  });
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const localMatches = controlsPath(input.path)
    ? [deepFreeze({
        nodeId: H_EARTH_C2_R1_CANDIDATE_PATH_NODE.nodeId,
        node: H_EARTH_C2_R1_CANDIDATE_PATH_NODE,
        occurrence: occurrenceFor(input.path)
      })]
    : [];
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return deepFreeze({
    query: base.query,
    matches: [...base.matches, ...localMatches],
    resolved: base.resolved || localMatches.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_C2_R1_CANDIDATE_PATH_NODE;
  const matches =
    (criteria.repositoryPath == null || controlsPath(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus) &&
    (criteria.cardinalRole == null || criteria.cardinalRole === node.cardinalRole) &&
    (criteria.hasUnresolvedFields == null || criteria.hasUnresolvedFields === false);
  return deepFreeze(matches ? [...base, node] : base);
}

export function getHEarthRepositoryRegistryRelationsForNode(
  nodeId,
  direction = 'BOTH'
) {
  return nodeId === H_EARTH_C2_R1_CANDIDATE_PATH_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId, direction);
}

export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  if (nodeId === H_EARTH_C2_R1_CANDIDATE_PATH_NODE.nodeId) {
    return deepFreeze({
      nodeId,
      nodes: [H_EARTH_C2_R1_CANDIDATE_PATH_NODE],
      relations: [],
      unresolved: false
    });
  }
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}

export const H_EARTH_C2_R1_CANDIDATE_PATH_DISPOSITION_FACADE = deepFreeze({
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

export default H_EARTH_C2_R1_CANDIDATE_PATH_DISPOSITION_FACADE;
