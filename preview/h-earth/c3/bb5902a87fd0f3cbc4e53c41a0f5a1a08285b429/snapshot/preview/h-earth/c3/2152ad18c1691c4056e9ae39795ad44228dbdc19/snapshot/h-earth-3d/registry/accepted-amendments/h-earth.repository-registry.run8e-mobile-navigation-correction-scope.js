/** Read-only Run 8E mobile-navigation-correction registry overlay. */
import baseFacade from './h-earth.repository-registry.run8-phase3-live-browser-proof-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-mobile-navigation-correction-001';
const BASE_MAIN_HEAD = 'cabe801ec64cb3e58a404774e9408a1b58de285b';

export const H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PATHS = Object.freeze([
  '/.github/workflows/h-earth-run8e-mobile-navigation-correction.yml',
  '/h-earth-3d/validation/h-earth.run8e-mobile-navigation-correction.constructor.mjs',
  '/h-earth-3d/validation/h-earth.run8e-mobile-navigation-correction.reset-fix.mjs',
  '/h-earth-3d/validation/h-earth.run8e-mobile-navigation-correction.harness.mjs',
  '/h-earth-3d/validation/h-earth.run8e-mobile-navigation-correction.receipt.json',
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/functional-landscape/index.js',
  '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
  '/showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-mobile-navigation-correction-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);

const OCCURRENCES = Object.freeze(
  H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PATHS.map((repositoryPath) => freeze({
    repository: REPOSITORY,
    refType: 'BRANCH',
    refName: BRANCH,
    commitSha: null,
    path: repositoryPath,
    gitBlobSha: repositoryPath.endsWith('h-earth.run8e-mobile-navigation-correction.receipt.json')
      ? 'bc904ffd0d4f4e9f26b055256b99f92bc0422980'
      : null,
    contentSha256: repositoryPath.endsWith('h-earth.run8e-mobile-navigation-correction.receipt.json')
      ? '9bd9f4c40df39c1e4f9c864c851fce5c544716da4ef4e8e66e64b9c33150cd21'
      : null,
    byteCount: repositoryPath.endsWith('h-earth.run8e-mobile-navigation-correction.receipt.json')
      ? 2444
      : null,
    existenceStatus: 'PRESENT',
    fetchbackStatus: 'VERIFIED_ON_MOBILE_CORRECTION_BRANCH',
    occurrenceClass: 'RUN_8E_MOBILE_NAVIGATION_CORRECTION'
  }))
);

export const H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_v1',
  evidenceClass: 'EXECUTED_BROWSER_CORRECTION_EVIDENCE',
  sourceKind: 'SAMSUNG_PORTRAIT_AND_LANDSCAPE_MOBILE_NAVIGATION_EXECUTION',
  sourceIdOrPath:
    '/h-earth-3d/validation/h-earth.run8e-mobile-navigation-correction.receipt.json',
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: Object.freeze([
    'EXPLICIT_COARSE_POINTER_MOVEMENT_CONTROLS_PRESENT',
    'FORWARD_BACKWARD_LEFT_RIGHT_CONTROLS_VISIBLE',
    'PRESS_AND_HOLD_MOVEMENT_IMPLEMENTED',
    'COAST_RESET_CONTROL_EXECUTED',
    'SAMSUNG_PORTRAIT_EMULATION_MOVEMENT_PASS',
    'SAMSUNG_LANDSCAPE_EMULATION_MOVEMENT_PASS',
    'RUN_6F_DUPLICATE_RENDER_SUPPRESSED',
    'RUN_8E_RENDER_SEQUENCE_ADVANCED',
    'RUN_8_RENDERER_PRESERVED',
    'TERRAIN_AND_LIGHTING_LAWS_UNCHANGED',
    'ZERO_BROWSER_ERRORS'
  ]),
  verifiedOn: '2026-07-26',
  evidenceMetadata: freeze({
    baseMainHead: BASE_MAIN_HEAD,
    branch: BRANCH,
    durableReceiptGitBlob: 'bc904ffd0d4f4e9f26b055256b99f92bc0422980',
    durableReceiptSha256:
      '9bd9f4c40df39c1e4f9c864c851fce5c544716da4ef4e8e66e64b9c33150cd21',
    durableReceiptByteCount: 2444,
    configurationCount: 2,
    directionalControlCount: 4,
    resetControlCount: 1
  }),
  evidenceLimitations: Object.freeze([
    'BROWSER_EMULATION_IS_NOT_POST_DEPLOYMENT_PHYSICAL_SAMSUNG_EXECUTION',
    'CORRECTION_NOT_YET_MERGED_TO_MAIN',
    'CORRECTION_NOT_YET_DEPLOYED',
    'RUN_8E_PASS_CLOSED_NOT_CLAIMED'
  ])
});

export const H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PACKAGE',
  nodeType: 'CORRECTION_PACKET',
  nodeSubtype: 'RUN_8E_PHYSICAL_SAMSUNG_NAVIGATION_USABILITY_CORRECTION',
  displayName: 'H-Earth Run 8E Mobile Navigation Correction',
  description:
    'Registers the bounded coarse-pointer controls, Coast reset, cache-key update, and duplicate legacy-render suppression required before renewed physical Samsung validation.',
  repositoryPaths: [...H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: 'EXECUTED_BROWSER_CORRECTION_EVIDENCE',
  evidenceReferences: Object.freeze([
    H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_EVIDENCE.evidenceId
  ]),
  authorityClass: 'BOUNDED_CORRECTION',
  authorityPosture: 'CANDIDATE_CORRECTION_NOT_YET_DEPLOYED',
  authoritySource: Object.freeze([
    'EXPLICIT_USER_AUTHORIZATION_TO_START_NEXT_ROUND',
    'PHYSICAL_SAMSUNG_NAVIGATION_USABILITY_FAILURE_EVIDENCE',
    'RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PASS'
  ]),
  authorityScope: Object.freeze([
    'MOBILE_MOVEMENT_CONTROL_SURFACE',
    'COAST_AND_LEVEL_RESET',
    'TOUCH_GUIDANCE_AND_CACHE_KEY',
    'NAVIGATION_ONLY_STATE_MUTATION_PATH',
    'DUPLICATE_LEGACY_RENDER_SUPPRESSION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_TERRAIN_GEOMETRY_MUTATION',
    'NO_LIGHTING_OR_MATERIAL_LAW_MUTATION',
    'NO_RUN_8_RENDERER_REPLACEMENT',
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
    'PHASE_3_LIVE_BROWSER_PROOF_BEFORE_MOBILE_CORRECTION',
    'MOBILE_CORRECTION_BEFORE_RENEWED_PHYSICAL_SAMSUNG_VALIDATION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'BOUNDED_MOBILE_INTERACTION_AND_RENDER_BRIDGE_CORRECTION_ONLY',
  prohibitedMutations: Object.freeze([
    'RUN_8_TERRAIN_OR_MOUNTAIN_RECONSTRUCTION',
    'RUN_8C_LIGHTING_LAW_REOPENING',
    'RUN_8D_VEGETATION_GEOMETRY_REOPENING',
    'PHYSICAL_SAMSUNG_PASS_WITHOUT_POST_DEPLOYMENT_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'SAMSUNG_PORTRAIT_MOVEMENT_MATRIX',
    'SAMSUNG_LANDSCAPE_MOVEMENT_MATRIX',
    'COAST_RESET_EXECUTION',
    'RUN_6F_RENDER_SEQUENCE_UNCHANGED_DURING_RUN_8_MOVEMENT',
    'RUN_8E_RENDER_SEQUENCE_ADVANCED',
    'ZERO_BROWSER_ERRORS',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_IF_MOVEMENT_DOES_NOT_CHANGE_WORLD_POSITION',
    'STOP_IF_COAST_RESET_DOES_NOT_RESTORE_INITIAL_POSITION',
    'STOP_IF_RUN_6F_DUPLICATE_RENDER_REMAINS',
    'STOP_IF_ANY_RUN_8_GEOMETRY_OR_LIGHTING_SOURCE_CHANGES',
    'STOP_BEFORE_PHYSICAL_SAMSUNG_PASS_CLAIM'
  ]),
  currentIdentityReferences: Object.freeze([
    BASE_MAIN_HEAD,
    BRANCH,
    'H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_RECEIPT'
  ]),
  lifecycleStatus: 'TESTED_BRANCH_CANDIDATE',
  unresolvedFields: Object.freeze([
    'FINAL_BRANCH_HEAD_AFTER_REGISTRY_RECONCILIATION',
    'MERGE_COMMIT',
    'DEPLOYED_MAIN_HEAD',
    'POST_DEPLOYMENT_PHYSICAL_SAMSUNG_RECEIPT'
  ])
});

const pathIndex = new Map(
  H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_PATHS.map((repositoryPath) => [repositoryPath, {
    node: H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE,
    occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
  }])
);

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [
    ...baseInstance.evidenceRecords,
    H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_EVIDENCE
  ],
  nodes: [
    ...baseInstance.nodes,
    H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE
  ]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE.nodeId
    ? H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_EVIDENCE
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
      nodeId: H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE.nodeId,
      node: H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE,
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
  const node = H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE;
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
    id === H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE.nodeId
      ? Object.freeze([])
      : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE.nodeId
    ? freeze({
        nodeId: id,
        nodes: [H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_NODE],
        relations: [],
        unresolved: false
      })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_FACADE = freeze({
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

export default H_EARTH_RUN_8E_MOBILE_NAVIGATION_CORRECTION_FACADE;
