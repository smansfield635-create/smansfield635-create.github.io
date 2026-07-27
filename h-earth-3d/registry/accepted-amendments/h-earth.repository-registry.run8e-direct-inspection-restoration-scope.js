/** Read-only Run 8E direct-inspection-restoration registry overlay. */
import baseFacade from './h-earth.repository-registry.run8e-mobile-navigation-correction-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-direct-inspection-restoration-001';
const BASE_MAIN_HEAD = '43cf9be1397a756a3620166e498db10cc9d754b4';
const RECEIPT_PATH =
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.receipt.json';
const RECEIPT_GIT_BLOB = '706aa420092ef67c2b9a4a4cdfa942516b4687bf';
const RECEIPT_SHA256 =
  '8027f0e2e04c2be0672e07270c4beabf038af98ad2fe4ae3cff84b00e02bd455';
const RECEIPT_BYTE_COUNT = 3450;

export const H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-direct-inspection-restoration.yml',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.active-viewport-dedup-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.constructor.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.harness-accounting-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.idempotency-gate.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.pointer-isolation-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.resize-dedup-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.harness.mjs',
  RECEIPT_PATH,
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
  '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js',
  '/showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js',
  '/h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-direct-inspection-restoration-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_PATHS.map((repositoryPath) => {
    const controllerRemoved = repositoryPath.endsWith('mobile-navigation-controls.js');
    const receipt = repositoryPath === RECEIPT_PATH;
    return freeze({
      repository: REPOSITORY,
      refType: 'BRANCH',
      refName: BRANCH,
      commitSha: null,
      path: repositoryPath,
      gitBlobSha: receipt ? RECEIPT_GIT_BLOB : null,
      contentSha256: receipt ? RECEIPT_SHA256 : null,
      byteCount: receipt ? RECEIPT_BYTE_COUNT : null,
      existenceStatus: controllerRemoved ? 'REMOVED' : 'PRESENT',
      fetchbackStatus: controllerRemoved
        ? 'VERIFIED_ABSENT_AFTER_DIRECT_INSPECTION_RESTORATION'
        : 'VERIFIED_ON_DIRECT_INSPECTION_RESTORATION_BRANCH',
      occurrenceClass: controllerRemoved
        ? 'SUPERSEDED_USER_FACING_CONTROLLER_PATH'
        : 'RUN_8E_DIRECT_INSPECTION_RESTORATION'
    });
  })
);

export const H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_v1',
  evidenceClass: 'EXECUTED_BROWSER_RESTORATION_AND_RENDER_SCHEDULING_EVIDENCE',
  sourceKind: 'SAMSUNG_PORTRAIT_AND_LANDSCAPE_DIRECT_POINTER_EXECUTION',
  sourceIdOrPath: RECEIPT_PATH,
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: Object.freeze([
    'ONE_FINGER_CONTINUOUS_LOOK_RESTORED',
    'TWO_FINGER_CONTINUOUS_FORWARD_BACKWARD_TRAVEL_RESTORED',
    'PINCH_ZOOM_RESTORED',
    'UNOBSTRUCTED_ENVIRONMENT_INSPECTION_RESTORED',
    'VISIBLE_DIRECTIONAL_CONTROLLER_REMOVED',
    'COAST_CONTROLLER_PANEL_REMOVED',
    'PRESS_AND_HOLD_CONTROLLER_MODEL_REMOVED',
    'NAVIGATION_STATE_MUTATES_DURING_ACTIVE_GESTURE',
    'FULL_SUCCESSOR_RENDER_SUPPRESSED_DURING_ACTIVE_GESTURE',
    'ONE_SUCCESSOR_RENDER_COMMITTED_AFTER_EACH_SETTLED_GESTURE',
    'INITIAL_SUCCESSOR_RENDER_DEFERRED',
    'RENDER_STAGES_YIELD_TO_BROWSER',
    'COMPLETED_AND_ACTIVE_VIEWPORT_DUPLICATE_RENDERS_SUPPRESSED',
    'SAMSUNG_PORTRAIT_EMULATION_PASS',
    'SAMSUNG_LANDSCAPE_EMULATION_PASS',
    'ZERO_BROWSER_ERRORS'
  ]),
  verifiedOn: '2026-07-26',
  evidenceMetadata: freeze({
    baseMainHead: BASE_MAIN_HEAD,
    branch: BRANCH,
    durableReceiptGitBlob: RECEIPT_GIT_BLOB,
    durableReceiptSha256: RECEIPT_SHA256,
    durableReceiptByteCount: RECEIPT_BYTE_COUNT,
    finalPersistenceRun: 30225506434,
    finalPersistenceJob: 89854921928,
    finalEvidenceArtifact: 8638398130,
    finalEvidenceArtifactDigest:
      'sha256:e775fed59257163f66ea0cefa3e5d669ab34348a0abfb5b80661949ac941d7e5',
    configurationCount: 2,
    settledSuccessorRenderCountPerConfiguration: 3,
    totalCompletedRenderCountPerConfiguration: 4
  }),
  evidenceLimitations: Object.freeze([
    'BROWSER_EMULATION_IS_NOT_POST_DEPLOYMENT_PHYSICAL_SAMSUNG_EXECUTION',
    'RESTORATION_NOT_YET_MERGED_TO_MAIN',
    'RESTORATION_NOT_YET_DEPLOYED',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_PACKAGE',
  nodeType: 'CORRECTION_PACKET',
  nodeSubtype: 'RUN_8E_ACCEPTED_INTERACTION_AUTHORITY_RESTORATION',
  displayName: 'H-Earth Run 8E Direct Inspection Restoration',
  description:
    'Restores the accepted direct-manipulation inspection model, removes the rejected controller redesign, and confines correction to render scheduling beneath the preserved interaction authority.',
  repositoryPaths: [...H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_BROWSER_RESTORATION_AND_RENDER_SCHEDULING_EVIDENCE',
  evidenceReferences: Object.freeze([
    H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_EVIDENCE.evidenceId
  ]),
  authorityClass: 'BOUNDED_RESTORATION_AND_PERFORMANCE_CORRECTION',
  authorityPosture: 'TESTED_CANDIDATE_NOT_YET_DEPLOYED',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_DIRECTION_TO_COMPLETE_THE_RESTORATION_ROUND',
    'USER_CORRECTION_THAT_PRE_RUN_8_INTERACTION_REQUIRED_NO_REPAIR',
    'PHYSICAL_SAMSUNG_EVIDENCE_OF_CONTROLLER_REGRESSION',
    'RUN_8_DIMENSIONAL_SCOPE_BOUNDARY'
  ]),
  authorityScope: Object.freeze([
    'RESTORE_ONE_FINGER_CONTINUOUS_LOOK',
    'RESTORE_TWO_FINGER_CONTINUOUS_TRAVEL',
    'RESTORE_PINCH_ZOOM',
    'REMOVE_USER_FACING_CONTROLLER',
    'COALESCE_SUCCESSOR_RENDER_REQUESTS',
    'DEFER_INITIAL_SUCCESSOR_RENDER',
    'YIELD_BETWEEN_HEAVY_RENDER_STAGES',
    'SUPPRESS_REDUNDANT_VIEWPORT_RENDERS'
  ]),
  authorityLimitations: Object.freeze([
    'NO_INTERACTION_REDESIGN_AUTHORITY',
    'NO_TERRAIN_OR_MOUNTAIN_GEOMETRY_MUTATION',
    'NO_X_Y_OR_Z_DIMENSIONAL_LAW_MUTATION',
    'NO_NORMAL_LIGHT_MATERIAL_LAW_MUTATION',
    'NO_VEGETATION_GEOMETRY_MUTATION',
    'NO_CAMERA_AUTHORITY_CREATION',
    'NO_NAVIGATION_AUTHORITY_CREATION',
    'NO_PHYSICAL_SAMSUNG_PASS_CLAIM',
    'NO_RUN_8E_CLOSURE_CLAIM'
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
    'RUN_8E_MOBILE_CONTROLLER_CORRECTION_BEFORE_DIRECT_INSPECTION_RESTORATION',
    'DIRECT_INSPECTION_RESTORATION_BEFORE_RENEWED_PHYSICAL_SAMSUNG_VALIDATION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope:
    'DIRECT_INTERACTION_RESTORATION_AND_UNDERLYING_RENDER_SCHEDULING_ONLY',
  prohibitedMutations: Object.freeze([
    'VISIBLE_DIRECTIONAL_CONTROLLER_REINTRODUCTION',
    'COAST_CONTROLLER_PANEL_REINTRODUCTION',
    'RUN_8_TERRAIN_OR_MOUNTAIN_RECONSTRUCTION',
    'RUN_8C_LIGHTING_LAW_REOPENING',
    'RUN_8D_VEGETATION_GEOMETRY_REOPENING',
    'PHYSICAL_SAMSUNG_PASS_WITHOUT_POST_DEPLOYMENT_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'REAL_POINTER_ONE_FINGER_LOOK_MATRIX',
    'REAL_POINTER_TWO_FINGER_TRAVEL_MATRIX',
    'REAL_POINTER_PINCH_ZOOM_MATRIX',
    'NO_FULL_SUCCESSOR_RENDER_DURING_ACTIVE_GESTURE',
    'EXACTLY_ONE_SETTLED_SUCCESSOR_RENDER_PER_GESTURE',
    'VISIBLE_CONTROLLER_ABSENCE',
    'SAMSUNG_PORTRAIT_AND_LANDSCAPE_EMULATION',
    'ZERO_BROWSER_ERRORS',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_ANY_ACCEPTED_GESTURE_SEMANTIC_CHANGES',
    'STOP_IF_CONTROLLER_REMAINS_VISIBLE',
    'STOP_IF_FULL_SUCCESSOR_RENDER_OCCURS_DURING_ACTIVE_GESTURE',
    'STOP_IF_ANY_DIMENSIONAL_GEOMETRY_OR_LIGHTING_SOURCE_CHANGES',
    'STOP_BEFORE_PHYSICAL_SAMSUNG_PASS_CLAIM'
  ]),
  currentIdentityReferences: Object.freeze([
    BASE_MAIN_HEAD,
    BRANCH,
    'H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_RECEIPT'
  ]),
  lifecycleStatus: 'TESTED_BRANCH_CANDIDATE',
  unresolvedFields: Object.freeze([
    'FINAL_BRANCH_HEAD_AFTER_REGISTRY_RECONCILIATION',
    'MERGE_COMMIT',
    'DEPLOYED_MAIN_HEAD',
    'POST_DEPLOYMENT_PHYSICAL_SAMSUNG_RECEIPT'
  ])
});

export const H_EARTH_RUN_8E_MOBILE_CONTROLLER_DISPOSITION = freeze({
  priorNodeId: 'H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PACKAGE',
  disposition: 'USER_FACING_CONTROLLER_SUPERSEDED_AND_REMOVED',
  retainedElements: Object.freeze([
    'NAVIGATION_ONLY_STATE_MUTATION_PATH',
    'DUPLICATE_RUN_6_RENDER_SUPPRESSION',
    'RUN_8_CACHE_IDENTITY_UPDATE'
  ]),
  rejectedElements: Object.freeze([
    'VISIBLE_DIRECTIONAL_CONTROLLER',
    'COAST_CONTROLLER_PANEL',
    'PRESS_AND_HOLD_CONTROLLER_MODEL',
    'INTERACTION_REPAIR_REQUIREMENT'
  ]),
  basis: 'PRE_RUN_8_DIRECT_MANIPULATION_WAS_ACCEPTED_AND_REQUIRED_NO_REPAIR'
});

const pathIndex = new Map(
  H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_PATHS.map((repositoryPath) => [repositoryPath, {
    node: H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE,
    occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
  }])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE.nodeId
    ? H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_EVIDENCE
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
      nodeId: H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE.nodeId,
      node: H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE,
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
  const node = H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE;
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
    id === H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_FACADE = freeze({
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

export default H_EARTH_RUN_8E_DIRECT_INSPECTION_RESTORATION_FACADE;
