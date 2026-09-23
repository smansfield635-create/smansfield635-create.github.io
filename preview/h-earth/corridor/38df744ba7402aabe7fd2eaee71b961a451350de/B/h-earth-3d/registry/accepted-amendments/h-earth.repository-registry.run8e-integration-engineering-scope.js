/** Read-only Run 8E integration-engineering path-registration overlay. */
import baseFacade from './h-earth.repository-registry.run8d-grounded-vegetation-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-public-integration-001';

export const H_EARTH_RUN_8E_ENGINEERING_SCOPE_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-integration-engineering-validation.yml',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/integration/h-earth.run8e-successor-environment-transfer.js',
  '/showroom/globe/h-earth/render/run8e-successor-environment.js',
  '/h-earth-3d/validation/h-earth.run8e.integration-engineering.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e.integration-engineering.receipt.json',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-integration-engineering-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/.github/workflows/h-earth-run8e-public-route-validation.yml',
  '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
  '/h-earth-3d/validation/h-earth.run8e.public-route.receipt.json',
  '/.github/workflows/h-earth-run8e-pre-update-baseline-comparison.yml',
  '/h-earth-3d/validation/h-earth.run8e.pre-update-baseline-comparison.receipt.json'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8E_ENGINEERING_SCOPE_PATHS.map((path) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path,
    gitBlobSha: null,
    contentSha256: null,
    byteCount: null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_RUN_8E_WORKSPACE',
    occurrenceClass: 'CANDIDATE'
  }))
);

export const H_EARTH_RUN_8E_ENGINEERING_SCOPE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_INTEGRATION_ENGINEERING_SCOPE_v1',
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  sourceKind: 'REPOSITORY_WORKSPACE_RUN_8E_INTEGRATION_ENGINEERING_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8e.integration-engineering.receipt.json',
  sourceOccurrenceOrRevision: 'RUN_8E_WORKSPACE_PENDING_BRANCH_NATIVE_EXECUTION',
  assertionScope: Object.freeze([
    'RUN_8A_THROUGH_RUN_8D_PREDECESSOR_CLOSURE_CONSUMPTION',
    'SUCCESSOR_TERRAIN_SHORELINE_AND_GROUNDED_VEGETATION_PACKAGE_FORMATION',
    'WEST_BATCH_ADMISSION',
    'PACKET_002_SUCCESSOR_TRANSFER',
    'RUN_8C_TERRAIN_LIGHT_AND_MATERIAL_RENDER_PROJECTION',
    'SINGLE_PHYSICAL_DEPTH_DOMAIN_EXECUTION',
    'ACTUAL_TERRAIN_AND_VEGETATION_DEPTH_INTERACTION',
    'SINGLE_SKY_AUTHORITY_MATERIALIZATION',
    'SUN_DISC_MATERIALIZATION',
    'DETERMINISTIC_BRANCH_NATIVE_ENGINEERING_EXECUTION',
    'RUN_7I_TO_RUN_8E_PRE_UPDATE_BASELINE_COMPARISON'
  ]),
  verifiedOn: '2026-07-26',
  evidenceLimitations: Object.freeze([
    'PUBLIC_ROUTE_BRANCH_EXECUTION_IS_A_SEPARATE_RUN_8E_OCCURRENCE',
    'PRE_UPDATE_BASELINE_COMPARISON_DOES_NOT_ASSERT_VISUAL_QUALITY_SUPERIORITY',
    'PHYSICAL_SAMSUNG_EXECUTION_NOT_INCLUDED',
    'NO_MAIN_PROMOTION',
    'NO_DEPLOYMENT',
    'NO_LIVE_IDENTITY_OR_BROWSER_PROOF',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_INTEGRATION_ENGINEERING_SCOPE_PACKAGE',
  nodeType: 'BOUNDARY_PACKET',
  nodeSubtype: 'RUN_8E_INTEGRATION_ENGINEERING_SCOPE_PACKAGE',
  displayName: 'H-Earth Run 8E Integration Engineering Scope Package',
  description:
    'Registers the bounded Run 8E successor package, West admission, Packet 002 transfer, frame, shared-depth renderer, sky/sun engineering-validation, public-route branch execution, and pre-update Run 7I comparison paths.',
  repositoryPaths: [...H_EARTH_RUN_8E_ENGINEERING_SCOPE_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_IMPLEMENTATION_EVIDENCE',
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_ENGINEERING_SCOPE_EVIDENCE.evidenceId]),
  authorityClass: 'AUDIT_ONLY',
  authorityPosture: 'READ_ONLY_RUN_8E_ENGINEERING_PATH_REGISTRATION',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_RUN_8E_EXECUTION_AUTHORIZATION',
    'RUN_8A_PASS_CLOSED',
    'RUN_8B_PASS_CLOSED',
    'RUN_8C_PASS_CLOSED',
    'RUN_8D_PASS_CLOSED'
  ]),
  authorityScope: Object.freeze([
    'EXACT_RUN_8E_ENGINEERING_REPOSITORY_PATH_RESOLUTION',
    'RUN_8E_ENGINEERING_CHECKPOINT_PACKAGE_MEMBERSHIP',
    'AUTOMATIC_REPOSITORY_PREFLIGHT_SCOPE'
  ]),
  authorityLimitations: Object.freeze([
    'PATH_REGISTRATION_DOES_NOT_CREATE_ADMISSION_TRANSFER_RENDERER_ROUTE_OR_DEPLOYMENT_AUTHORITY',
    'ENGINEERING_EXECUTION_DOES_NOT_ESTABLISH_PHYSICAL_SAMSUNG_OR_LIVE_DEPLOYMENT_PROOF',
    'RUN_8E_PASS_CLOSED_REQUIRES_SEPARATE_CLOSURE_OCCURRENCES'
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
    'RUN_8B_SOURCE_GEOMETRY_MUTATION',
    'RUN_8C_PRESENTATION_LAW_MUTATION',
    'RUN_8D_WORLD_ATTACHMENT_MUTATION',
    'RUN_6_TERRAIN_FIELD_IN_PLACE_MUTATION',
    'LEGACY_PROXY_RECLASSIFICATION_AS_PROVEN_LOD',
    'UNDECLARED_PUBLIC_ROUTE_DEPLOYMENT_OR_LIVE_PROMOTION'
  ]),
  requiredValidations: Object.freeze([
    'EXACT_RUN_8E_ENGINEERING_PATH_RESOLUTION',
    'AUTOMATIC_REPOSITORY_PREFLIGHT',
    'RUN_8E_BRANCH_NATIVE_ENGINEERING_EXECUTION_PASS',
    'RUN_8E_PRE_UPDATE_BASELINE_COMPARISON_PASS'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_RUN_8E_ENGINEERING_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_ANY_RUN_8_PREDECESSOR_IS_REOPENED',
    'STOP_IF_LEGACY_PROXY_AND_SUCCESSOR_MOUNTAIN_IDENTITIES_COLLAPSE',
    'STOP_IF_ENGINEERING_RECEIPT_OVERCLAIMS_ROUTE_SAMSUNG_DEPLOYMENT_OR_LIVE_PROOF',
    'STOP_IF_BASELINE_COMPARISON_CLAIMS_VISUAL_QUALITY_SUPERIORITY'
  ]),
  currentIdentityReferences: Object.freeze([
    'H_EARTH_RUN_8E_INTEGRATION_AND_LIVE_DELIVERY_CONTROL_v1',
    'H_EARTH_RUN_8E_PACKET_002_SUCCESSOR_ENVIRONMENT_TRANSFER_v1',
    'H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1',
    '26bab1eb804a6e8737f551e1d1aa9d9cbbe4ae5f'
  ]),
  lifecycleStatus: 'CANDIDATE',
  unresolvedFields: Object.freeze([])
});

const pathIndex = new Map(H_EARTH_RUN_8E_ENGINEERING_SCOPE_PATHS.map((path) => [path, {
  node: H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === path)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_ENGINEERING_SCOPE_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE.nodeId
    ? H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_ENGINEERING_SCOPE_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_ENGINEERING_SCOPE_EVIDENCE
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
      nodeId: H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE.nodeId,
      node: H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE,
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
  const node = H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE;
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
    id === H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_ENGINEERING_SCOPE_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_ENGINEERING_RECONCILED_FACADE = freeze({
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

export default H_EARTH_RUN_8E_ENGINEERING_RECONCILED_FACADE;
