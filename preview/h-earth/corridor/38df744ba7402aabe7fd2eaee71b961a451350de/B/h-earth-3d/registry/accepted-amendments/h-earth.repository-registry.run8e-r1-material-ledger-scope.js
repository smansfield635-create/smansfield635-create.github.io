/** Read-only Run 8E-R1 reference-device material-ledger preservation overlay. */
import baseFacade from './h-earth.repository-registry.run8e-r1-reference-device-mobile-compatibility-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const BRANCH = 'agent/h-earth-run8e-r1-material-ledger-preservation-001';
const BASE_MAIN_HEAD = 'd73b241006c1cf43e8a6ad220fd192d55f51c6e8';

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_PATHS = Object.freeze([
  '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.reference-device.architecture-probe-001.transcribed.json',
  '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.reference-device.architecture-probe-002.transcribed.json',
  '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.reference-device.physical-interaction.transcribed.json',
  '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.reference-device.material-ledger.json',
  '/h-earth-3d/validation/h-earth.run8e-r1.material-ledger.validation.mjs',
  '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r1-material-ledger-scope.js',
  '/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  '/.github/workflows/h-earth-run8e-r1-material-ledger.yml'
]);

const OCCURRENCES = Object.freeze(H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_PATHS.map((repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'VERIFIED_ON_R1_MATERIAL_LEDGER_BRANCH',
  occurrenceClass: 'RUN_8E_R1_REFERENCE_DEVICE_MATERIAL_LEDGER_PRESERVATION'
})));

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MATERIAL_LEDGER_v1',
  evidenceClass: 'TWO_ARCHITECTURE_PROBES_AND_PHYSICAL_INTERACTION_BASELINE',
  sourceKind: 'CONVERSATION_TRANSCRIBED_JSON_WITH_REPOSITORY_BYTE_CUSTODY',
  sourceIdOrPath: '/h-earth-3d/validation/run-8e-r1-material-ledger/h-earth.run8e-r1.reference-device.material-ledger.json',
  sourceOccurrenceOrRevision: BRANCH,
  assertionScope: Object.freeze([
    'TWO_REFERENCE_DEVICE_ARCHITECTURE_PROBE_RECEIPTS_PRESERVED',
    'REFERENCE_DEVICE_PHYSICAL_INTERACTION_RECEIPT_PRESERVED',
    'REPOSITORY_TRANSCRIPTION_HASHES_AND_BYTE_COUNTS_BOUND',
    'CURRENT_CPU_PUBLIC_SUITABILITY_FAILED_PHYSICAL_EVIDENCE',
    'REFERENCE_DEVICE_WEBGL2_FUNCTIONAL_VIABILITY_ESTABLISHED',
    'CAMERA_AND_NAVIGATION_AUTHORITY_FUNCTIONING',
    'TRUTHFUL_CONTINUOUS_REALTIME_INTERACTION_NOT_ESTABLISHED',
    'RUN_8E_R1_DIAGNOSTIC_CHECKPOINT_PASS_CLOSED',
    'RUN_8E_REMAINS_FAIL_OPEN',
    'STOP_BEFORE_RUN_8E_R2'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    baseMainHead: BASE_MAIN_HEAD,
    branch: BRANCH,
    sourceOccurrenceClass: 'CONVERSATION_TRANSCRIBED_JSON',
    originalBrowserDownloadByteIdentityEstablished: false,
    repositoryTranscriptionByteIdentityEstablished: true,
    architectureProbeReceiptCount: 2,
    physicalInteractionReceiptCount: 1,
    productMutationPerformed: false,
    run8ER2Started: false
  }),
  evidenceLimitations: Object.freeze([
    'ORIGINAL_BROWSER_DOWNLOAD_FILES_NOT_UPLOADED',
    'SCREEN_RECORDING_NOT_RECEIVED',
    'EMPTY_POINTER_TO_NAVIGATION_AND_RELEASE_TO_FRAME_ARRAYS_ARE_NOT_ZERO_LATENCY_PROOF',
    'WEBGL_PROBE_TIMING_IS_NOT_END_TO_END_POINTER_TO_PRESENT_AUTHORITY',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R1_REFERENCE_DEVICE_MATERIAL_LEDGER_PACKAGE',
  nodeType: 'RECOVERY_EVIDENCE_PRESERVATION_PACKET',
  nodeSubtype: 'RUN_8E_R1_DIAGNOSTIC_CLOSURE_AND_R2_STOPPING_BOUNDARY',
  displayName: 'H-Earth Run 8E-R1 Reference-Device Material Ledger',
  description: 'Preserves two physical architecture probes and the physical interaction baseline, closes R1 as a diagnostic checkpoint, retains Run 8E fail-open, and stops before R2 construction.',
  repositoryPaths: [...H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_PATHS],
  repositoryOccurrences: OCCURRENCES,
  evidenceClass: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE.evidenceId]),
  authorityClass: 'DURABLE_EVIDENCE_PRESERVATION_AND_CHECKPOINT_DISPOSITION',
  authorityPosture: 'R1_DIAGNOSTIC_PASS_CLOSED_R2_AUTHORIZED_NOT_STARTED',
  authoritySource: Object.freeze([
    'USER_SUPPLIED_REFERENCE_DEVICE_RECEIPTS',
    'RUN_8E_R1_ARCHITECTURE_DISPOSITION',
    'DEVICE_NEUTRAL_REFERENCE_DEVICE_CORRECTION'
  ]),
  authorityScope: Object.freeze([
    'PRESERVE_THREE_REFERENCE_DEVICE_RECEIPTS',
    'BIND_TRANSCRIPTION_HASHES_BLOBS_AND_BYTE_COUNTS',
    'CLOSE_R1_DIAGNOSTIC_OBJECTIVE',
    'AUTHORIZE_R2_AFTER_PRESERVATION',
    'STOP_BEFORE_R2_EXECUTION'
  ]),
  authorityLimitations: Object.freeze([
    'NO_ORIGINAL_BROWSER_DOWNLOAD_BYTE_IDENTITY_CLAIM',
    'NO_REFERENCE_DEVICE_USABILITY_PASS',
    'NO_RUN_8E_PASS_CLOSED',
    'NO_R2_SOURCE_OR_PRODUCT_MUTATION'
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
    'R1_ARCHITECTURE_PROBES_BEFORE_MATERIAL_LEDGER',
    'R1_PHYSICAL_INTERACTION_BASELINE_BEFORE_DIAGNOSTIC_CLOSURE',
    'MATERIAL_LEDGER_PRESERVATION_BEFORE_R2',
    'STOP_BEFORE_R2_CONSTRUCTION'
  ]),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'RECEIPTS_LEDGER_REGISTRY_VALIDATION_WORKFLOW_ONLY',
  prohibitedMutations: Object.freeze([
    'PUBLIC_ROUTE_MUTATION',
    'RENDERER_IMPLEMENTATION',
    'WORLD_CAMERA_OR_NAVIGATION_AUTHORITY_MUTATION',
    'RUN_8E_R2_CONSTRUCTION',
    'RUN_8E_PASS_CLOSED'
  ]),
  requiredValidations: Object.freeze([
    'JSON_PARSE_AND_RECEIPT_TYPE_VALIDATION',
    'SHA_256_AND_BYTE_COUNT_VALIDATION',
    'MATERIAL_LEDGER_CROSS_REFERENCE_VALIDATION',
    'REGISTRY_LOADER_ACTIVATION',
    'BOUNDED_NON_PRODUCT_SCOPE',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT'
  ]),
  stoppingBoundaries: Object.freeze([
    'STOP_BEFORE_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION'
  ]),
  currentIdentityReferences: Object.freeze([BASE_MAIN_HEAD, BRANCH]),
  lifecycleStatus: 'R1_MATERIAL_LEDGER_PRESERVATION_CANDIDATE',
  unresolvedFields: Object.freeze([
    'FINAL_BRANCH_HEAD',
    'VALIDATION_RUN_IDENTITY',
    'MERGE_COMMIT'
  ])
});

const pathIndex = new Map(H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_PATHS.map((repositoryPath) => [repositoryPath, {
  node: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE,
  occurrences: OCCURRENCES.filter((entry) => entry.path === repositoryPath)
}]));

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE],
  nodes: [...baseInstance.nodes, H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId
    ? H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE
    : baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE.evidenceId
    ? H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_EVIDENCE
    : baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({ repositoryPath, resolved: true, nodes: [indexed.node], occurrences: indexed.occurrences, unresolved: false })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = OCCURRENCES
    .filter((entry) =>
      (input.path == null || entry.path === input.path) &&
      (input.commitSha == null || entry.commitSha === input.commitSha) &&
      (input.gitBlobSha == null || entry.gitBlobSha === input.gitBlobSha) &&
      (input.refName == null || entry.refName === input.refName))
    .map((occurrence) => freeze({ nodeId: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId, node: H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE, occurrence }));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({ query: base.query, matches: [...base.matches, ...local], resolved: base.resolved || local.length > 0 });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const node = H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE;
  const match =
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus);
  return freeze(match ? [...base, node] : base);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);
export const getHEarthRepositoryRegistryDependencyClosure = (id) =>
  id === H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE.nodeId
    ? freeze({ nodeId: id, nodes: [H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_NODE], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);

export const H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R1_MATERIAL_LEDGER_FACADE;
