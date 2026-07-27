/** Read-only accepted-amendment facade for Run 8E R2A-R2E registry and execution custody. */
import baseFacade from './h-earth.repository-registry.run8e-r1-material-ledger-execution-scope.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const R2E_BRANCH = 'agent/h-earth-run8e-r2e-registry-execution-custody-001';
const R2D_EXACT_HEAD = '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9';

export const H_EARTH_RUN_8E_R2_CHECKPOINT_RECORDS = freeze([
  {
    "checkpointId": "RUN_8E_R2A",
    "pullRequest": 217,
    "branch": "agent/h-earth-run8e-r2-immutable-live-render-package-001",
    "baseHead": "a660d54b0df30e768b95e2314b918d0f263883ed",
    "finalHead": "22b23594005dabdd9374501dae1c561f2dafa648",
    "executions": [
      {
        "purpose": "SUCCESSFUL_PACKAGE_EXECUTION",
        "runId": 30235565337,
        "jobId": 89882629845,
        "artifactId": 8641519551,
        "artifactDigest": "sha256:605f28dd6e2eb6410126773cee6dc672ff40f964d88e4a7ffbfbf223ecfe095c"
      },
      {
        "purpose": "FINAL_CLOSURE_VALIDATION",
        "runId": 30236189527,
        "jobId": 89884338910,
        "artifactId": 8641707377,
        "artifactDigest": "sha256:08d916a884c35b38b079b3df15ee5efe26a54043d080fb28949f59d4b531d886"
      }
    ],
    "passReceipt": "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json",
    "stoppingBoundary": "STOP_BEFORE_DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY_R2B",
    "paths": [
      "/.github/workflows/h-earth-run8e-r2-immutable-live-render-package.yml",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js",
      "/h-earth-3d/validation/h-earth.run8e-r2.immutable-live-render-package.validation.mjs",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.attempt-001.failure.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json",
      "/showroom/globe/h-earth/render/live-render-package.run8e-r2.js"
    ]
  },
  {
    "checkpointId": "RUN_8E_R2B",
    "pullRequest": 218,
    "branch": "agent/h-earth-run8e-r2b-immutable-buffer-custody-001",
    "baseHead": "22b23594005dabdd9374501dae1c561f2dafa648",
    "finalHead": "39de87edefcc037eaafa8a988dc0c84e40e3d1ba",
    "executions": [
      {
        "purpose": "SUCCESSFUL_CUSTODY_EXECUTION",
        "runId": 30236786081,
        "jobId": 89885991485,
        "artifactId": 8641894512,
        "artifactDigest": "sha256:fa602494403da07fe834d436b37089f66509af8a5beacf0873ff5b7ac237782e"
      },
      {
        "purpose": "FINAL_CLOSURE_VALIDATION",
        "runId": 30237455069,
        "jobId": 89887842669,
        "artifactId": 8642098670,
        "artifactDigest": "sha256:c76ac69d171d37d2b1a15b49bafd1201bc33eabaab3cdcef2cdfe370b3068054"
      }
    ],
    "passReceipt": "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json",
    "stoppingBoundary": "STOP_BEFORE_SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_AUDIT_R2C",
    "paths": [
      "/.github/workflows/h-earth-run8e-r2b-immutable-buffer-custody.yml",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2b.immutable-buffer-custody.js",
      "/h-earth-3d/validation/h-earth.run8e-r2b.immutable-buffer-custody.validation.mjs",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json"
    ]
  },
  {
    "checkpointId": "RUN_8E_R2C",
    "pullRequest": 219,
    "branch": "agent/h-earth-run8e-r2c-authority-correspondence-001",
    "baseHead": "39de87edefcc037eaafa8a988dc0c84e40e3d1ba",
    "finalHead": "845b6d6acffdd461153b3474044ec533ffd4403b",
    "executions": [
      {
        "purpose": "SUCCESSFUL_CORRESPONDENCE_EXECUTION",
        "runId": 30238237230,
        "jobId": 89890046797,
        "artifactId": 8642344020,
        "artifactDigest": "sha256:012a3c3ba16659fc93da4b62cf38a2c64f3dfc84a925551a10470ef6dcc99556"
      },
      {
        "purpose": "FINAL_CLOSURE_VALIDATION",
        "runId": 30238540238,
        "jobId": 89890901624,
        "artifactId": 8642442814,
        "artifactDigest": "sha256:545b1e1d04d58128bb2ba0caf4086621c3f52bb88e8ff2b24b64270af60a087c"
      }
    ],
    "passReceipt": "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json",
    "stoppingBoundary": "STOP_BEFORE_GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION_R2D",
    "paths": [
      "/.github/workflows/h-earth-run8e-r2c-authority-correspondence.yml",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2c.source-authority-correspondence.js",
      "/h-earth-3d/validation/h-earth.run8e-r2c.source-authority-correspondence.validation.mjs",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.attempt-001.failure.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json"
    ]
  },
  {
    "checkpointId": "RUN_8E_R2D",
    "pullRequest": 220,
    "branch": "agent/h-earth-run8e-r2d-gpu-resource-lifecycle-001",
    "baseHead": "845b6d6acffdd461153b3474044ec533ffd4403b",
    "finalHead": "9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9",
    "executions": [
      {
        "purpose": "SUCCESSFUL_GPU_LIFECYCLE_EXECUTION",
        "runId": 30240226591,
        "jobId": 89895687377,
        "artifactId": 8642985618,
        "artifactDigest": "sha256:9b1006036a93bfb3cf6c532c21068a37d5013ab5f8d1635cdd917655870de03c"
      },
      {
        "purpose": "FINAL_CLOSURE_VALIDATION",
        "runId": 30240950430,
        "jobId": 89897847174,
        "artifactId": 8643236615,
        "artifactDigest": "sha256:6e8f87f8b30fd7bb5fc889d3c0d238da64ce555163a416c6d3b878c5261bdc23"
      }
    ],
    "passReceipt": "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json",
    "stoppingBoundary": "STOP_BEFORE_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT_R2E",
    "paths": [
      "/.github/workflows/h-earth-run8e-r2d-gpu-resource-lifecycle.yml",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js",
      "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2d.gpu-upload-and-resource-lifecycle.js",
      "/h-earth-3d/validation/h-earth.run8e-r2d.canonical-gpu-resource-lifecycle.harness.mjs",
      "/h-earth-3d/validation/h-earth.run8e-r2d.gpu-resource-lifecycle.harness.mjs",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-001.failure.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-002.failure.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-003.failure.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.canonical-webgl-probe.js",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.html",
      "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.webgl-resource-probe.js",
      "/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js"
    ]
  }
]);

export const H_EARTH_RUN_8E_R2E_PATHS = Object.freeze([
  "/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-r2-execution-scope.js",
  "/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js",
  "/.github/workflows/h-earth-run8e-r2e-registry-execution-custody.yml",
  "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2.immutable-live-render-package.js",
  "/h-earth-3d/control-plane/run-8/recovery/h-earth.run8e-r2e.registry-execution-custody.js",
  "/h-earth-3d/validation/h-earth.run8e-r2e.registry-execution-custody.validation.mjs",
  "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.path-inventory.json",
  "/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json"
]);

const checkpointOccurrence = (checkpoint, repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'COMMIT',
  refName: checkpoint.finalHead,
  commitSha: checkpoint.finalHead,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PRESENT',
  fetchbackStatus: 'EXACT_COMMIT_PATH_EXISTENCE_REVALIDATED_BY_R2E_WORKFLOW',
  occurrenceClass: `${checkpoint.checkpointId}_PASS_CLOSED_REPOSITORY_OCCURRENCE`
});

const r2eOccurrence = (repositoryPath) => freeze({
  repository: REPOSITORY,
  refType: 'BRANCH',
  refName: R2E_BRANCH,
  commitSha: null,
  path: repositoryPath,
  gitBlobSha: null,
  contentSha256: null,
  byteCount: null,
  existenceStatus: 'PLANNED_OR_PRESENT',
  fetchbackStatus: 'R2E_CORE_EXACT_HEAD_EXECUTION_PENDING',
  occurrenceClass: 'RUN_8E_R2E_REGISTRY_EXECUTION_CUSTODY_OCCURRENCE'
});

const makeCheckpointEvidence = (checkpoint) => freeze({
  evidenceId: `EVIDENCE_H_EARTH_${checkpoint.checkpointId}_PASS_CLOSED_v1`,
  evidenceClass: 'EXECUTED_PASS_CLOSED_CHECKPOINT',
  sourceKind: 'DURABLE_REPOSITORY_RECEIPT_AND_GITHUB_ACTIONS_EXECUTION',
  sourceIdOrPath: checkpoint.passReceipt,
  sourceOccurrenceOrRevision: checkpoint.finalHead,
  assertionScope: Object.freeze([
    `${checkpoint.checkpointId}_PASS_CLOSED`,
    'EXACT_STACK_BASE_AND_FINAL_HEAD',
    'WORKFLOW_JOB_ARTIFACT_CUSTODY',
    'UNMERGED_DRAFT_BRANCH_POSTURE',
    'RUN_8E_FAIL_OPEN'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    pullRequest: checkpoint.pullRequest,
    branch: checkpoint.branch,
    baseHead: checkpoint.baseHead,
    finalHead: checkpoint.finalHead,
    executions: checkpoint.executions,
    stoppingBoundary: checkpoint.stoppingBoundary
  }),
  evidenceLimitations: Object.freeze([
    'R2_STACK_UNMERGED',
    'NO_PUBLIC_RENDERER_AUTHORITY',
    'NO_RUN_8E_PASS_CLOSED'
  ])
});

const makeCheckpointNode = (checkpoint, evidence) => {
  const occurrences = Object.freeze(checkpoint.paths.map((repositoryPath) =>
    checkpointOccurrence(checkpoint, repositoryPath)));
  return freeze({
    nodeId: `H_EARTH_${checkpoint.checkpointId}_PASS_CLOSED_CHECKPOINT`,
    nodeType: 'RUN_8E_RECOVERY_CHECKPOINT',
    nodeSubtype: `${checkpoint.checkpointId}_EXECUTED_PASS_CLOSED`,
    displayName: `H-Earth ${checkpoint.checkpointId} Pass-Closed Checkpoint`,
    description: 'Preserves the exact stacked branch, governed paths, workflow custody, durable receipt, and stopping boundary for this bounded R2 checkpoint.',
    repositoryPaths: [...checkpoint.paths],
    repositoryOccurrences: occurrences,
    evidenceClass: evidence.evidenceClass,
    evidenceReferences: Object.freeze([evidence.evidenceId]),
    authorityClass: 'EXECUTED_CHECKPOINT_EVIDENCE_PRESERVATION',
    authorityPosture: 'PASS_CLOSED_UNMERGED_DRAFT_RUN_8E_FAIL_OPEN',
    authoritySource: Object.freeze(['EXACT_REPOSITORY_HEAD', 'GITHUB_ACTIONS_EXECUTION', 'DURABLE_PASS_RECEIPT']),
    authorityScope: Object.freeze(['PRESERVE_CHECKPOINT', 'PRESERVE_STACK_ORDER', 'PRESERVE_STOPPING_BOUNDARY']),
    authorityLimitations: Object.freeze(['NO_CANONICAL_AUTHORITY', 'NO_PRODUCTION_AUTHORITY', 'NO_MERGE_AUTHORITY', 'NO_DEPLOYMENT_AUTHORITY']),
    parentRelations: Object.freeze([]),
    childRelations: Object.freeze([]),
    peerRelations: Object.freeze([]),
    upstreamBoundaries: Object.freeze([]),
    downstreamBoundaries: Object.freeze([]),
    cardinalRole: 'NONE',
    cardinalStatus: 'NONE',
    cardinalCompleteness: 'NOT_APPLICABLE',
    orderingRules: Object.freeze(['EXACT_BASE_BEFORE_FINAL_HEAD', 'PASS_CLOSED_BEFORE_SUCCESSOR_CHECKPOINT']),
    dependencyRelations: Object.freeze([]),
    allowedMutationScope: 'NONE_CHECKPOINT_IS_PRESERVED',
    prohibitedMutations: Object.freeze(['CHECKPOINT_REWRITE', 'PRODUCT_SOURCE_MUTATION', 'RUN_8E_PASS_CLOSED']),
    requiredValidations: Object.freeze(['EXACT_HEAD_PATH_EXISTENCE', 'PASS_RECEIPT_IDENTITY', 'WORKFLOW_ARTIFACT_IDENTITY']),
    stoppingBoundaries: Object.freeze([checkpoint.stoppingBoundary]),
    currentIdentityReferences: Object.freeze([checkpoint.finalHead, checkpoint.passReceipt]),
    lifecycleStatus: 'PASS_CLOSED_UNMERGED',
    unresolvedFields: Object.freeze(['MERGE_COMMIT'])
  });
};

const checkpointEvidences = H_EARTH_RUN_8E_R2_CHECKPOINT_RECORDS.map(makeCheckpointEvidence);
const checkpointNodes = H_EARTH_RUN_8E_R2_CHECKPOINT_RECORDS.map((checkpoint, index) =>
  makeCheckpointNode(checkpoint, checkpointEvidences[index]));

export const H_EARTH_RUN_8E_R2E_CORE_EVIDENCE = freeze({
  evidenceId: 'EVIDENCE_H_EARTH_RUN_8E_R2E_REGISTRY_CORE_CANDIDATE_v1',
  evidenceClass: 'REGISTRY_AND_SCOPE_AUDIT_CORE_PENDING_EXECUTION',
  sourceKind: 'R2E_ACCEPTED_AMENDMENT_AND_VALIDATION_PACKAGE',
  sourceIdOrPath: '/h-earth-3d/validation/h-earth.run8e-r2e.registry-execution-custody.validation.mjs',
  sourceOccurrenceOrRevision: R2D_EXACT_HEAD,
  assertionScope: Object.freeze([
    'ALL_R2_PATHS_REGISTERED',
    'ALL_R2E_NON_REGISTRY_PATHS_REGISTERED',
    'R2A_THROUGH_R2D_PASS_CLOSED',
    'R2E_EXECUTION_ONLY',
    'R2F_NOT_STARTED',
    'R3_NOT_STARTED',
    'RUN_8E_FAIL_OPEN'
  ]),
  verifiedOn: '2026-07-27',
  evidenceMetadata: freeze({
    branch: R2E_BRANCH,
    baseHead: R2D_EXACT_HEAD,
    executionRun: null,
    executionJob: null,
    evidenceArtifact: null,
    evidenceArtifactDigest: null,
    finalExactHead: null
  }),
  evidenceLimitations: Object.freeze([
    'R2E_CORE_EXECUTION_PENDING',
    'R2E_PASS_RECEIPT_NOT_YET_PRESERVED',
    'R2F_NOT_STARTED',
    'RUN_8E_REMAINS_FAIL_OPEN'
  ])
});

const r2eOccurrences = Object.freeze(H_EARTH_RUN_8E_R2E_PATHS.map(r2eOccurrence));

export const H_EARTH_RUN_8E_R2E_CORE_NODE = freeze({
  nodeId: 'H_EARTH_RUN_8E_R2E_REGISTRY_EXECUTION_CUSTODY',
  nodeType: 'RUN_8E_RECOVERY_CHECKPOINT',
  nodeSubtype: 'R2E_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
  displayName: 'H-Earth Run 8E R2E Registry and Execution Custody',
  description: 'Registers the complete R2A-R2D governed path set and the bounded R2E registry, validation, workflow, inventory, and receipt package.',
  repositoryPaths: [...H_EARTH_RUN_8E_R2E_PATHS],
  repositoryOccurrences: r2eOccurrences,
  evidenceClass: H_EARTH_RUN_8E_R2E_CORE_EVIDENCE.evidenceClass,
  evidenceReferences: Object.freeze([H_EARTH_RUN_8E_R2E_CORE_EVIDENCE.evidenceId]),
  authorityClass: 'R2E_EXECUTION_ONLY_REGISTRY_REPRESENTATION',
  authorityPosture: 'R2E_CORE_PENDING_EXECUTION_R2F_NOT_STARTED_RUN_8E_FAIL_OPEN',
  authoritySource: Object.freeze(['R2D_EXACT_HEAD', 'R2E_ACCEPTED_AMENDMENT', 'R2E_INDEPENDENT_VALIDATION']),
  authorityScope: Object.freeze(['REGISTER_R2_PATHS', 'EXECUTE_EXACT_SCOPE_AUDIT', 'PRESERVE_DURABLE_EXECUTION_CUSTODY', 'STOP_BEFORE_R2F']),
  authorityLimitations: Object.freeze(['NO_CANONICAL_AUTHORITY', 'NO_PRODUCTION_AUTHORITY', 'NO_MERGE_AUTHORITY', 'NO_DEPLOYMENT_AUTHORITY', 'NO_R2F_AUTHORITY', 'NO_R3_AUTHORITY']),
  parentRelations: Object.freeze([]),
  childRelations: Object.freeze([]),
  peerRelations: Object.freeze([]),
  upstreamBoundaries: Object.freeze([]),
  downstreamBoundaries: Object.freeze([]),
  cardinalRole: 'NONE',
  cardinalStatus: 'NONE',
  cardinalCompleteness: 'NOT_APPLICABLE',
  orderingRules: Object.freeze(['R2A_THROUGH_R2D_PASS_CLOSED_BEFORE_R2E', 'R2E_PASS_CLOSED_BEFORE_R2F', 'STOP_BEFORE_R2F']),
  dependencyRelations: Object.freeze([]),
  allowedMutationScope: 'REGISTRY_CONTROL_VALIDATION_WORKFLOW_RECEIPT_ONLY',
  prohibitedMutations: Object.freeze([
    'LIVE_RENDER_PACKAGE_MUTATION',
    'GPU_TRANSPORT_ADAPTER_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_ROUTE_MUTATION',
    'CAMERA_NAVIGATION_OR_GESTURE_MUTATION',
    'SHADER_PROGRAM_RENDER_LOOP_OR_VISIBLE_PRESENTATION',
    'DEPLOYMENT',
    'R2F_WORK',
    'R3_WORK',
    'RUN_8E_PASS_CLOSED',
    'R2_STACK_MERGE'
  ]),
  requiredValidations: Object.freeze([
    'JAVASCRIPT_AND_JSON_SYNTAX',
    'REGISTRY_LOADER_IDENTITY',
    'ALL_R2_PATH_RESOLUTION',
    'ALL_R2E_NON_REGISTRY_PATH_RESOLUTION',
    'EXACT_OCCURRENCE_CUSTODY',
    'CHECKPOINT_AND_PR_STACK_SEQUENCE',
    'DURABLE_RECEIPT_IDENTITY',
    'AUTOMATIC_REPOSITORY_REGISTRY_PREFLIGHT',
    'EXACT_BOUNDED_SCOPE',
    'R2F_STOPPING_BOUNDARY'
  ]),
  stoppingBoundaries: Object.freeze(['STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F']),
  currentIdentityReferences: Object.freeze([R2D_EXACT_HEAD, R2E_BRANCH]),
  lifecycleStatus: 'R2E_CORE_EXECUTION_PENDING',
  unresolvedFields: Object.freeze(['CORE_EXECUTION_HEAD', 'WORKFLOW_RUN', 'WORKFLOW_JOB', 'ARTIFACT_ID', 'ARTIFACT_DIGEST', 'FINAL_EXACT_HEAD'])
});

const localNodes = Object.freeze([...checkpointNodes, H_EARTH_RUN_8E_R2E_CORE_NODE]);
const localEvidence = Object.freeze([...checkpointEvidences, H_EARTH_RUN_8E_R2E_CORE_EVIDENCE]);
const localOccurrences = Object.freeze(localNodes.flatMap((node) =>
  node.repositoryOccurrences.map((occurrence) => freeze({ nodeId: node.nodeId, node, occurrence }))));

const pathIndex = new Map();
for (const node of localNodes) {
  for (const repositoryPath of node.repositoryPaths) {
    const current = pathIndex.get(repositoryPath) ?? { nodes: [], occurrences: [] };
    current.nodes.push(node);
    current.occurrences.push(...node.repositoryOccurrences.filter((entry) => entry.path === repositoryPath));
    pathIndex.set(repositoryPath, current);
  }
}

const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const combinedInstance = freeze({
  ...baseInstance,
  evidenceRecords: [...baseInstance.evidenceRecords, ...localEvidence],
  nodes: [...baseInstance.nodes, ...localNodes]
});

export const getHEarthRepositoryRegistryInstance = () => combinedInstance;
export const getHEarthRepositoryRegistryNode = (id) =>
  localNodes.find((node) => node.nodeId === id) ?? baseFacade.getHEarthRepositoryRegistryNode(id);
export const getHEarthRepositoryRegistryEvidence = (id) =>
  localEvidence.find((entry) => entry.evidenceId === id) ?? baseFacade.getHEarthRepositoryRegistryEvidence(id);

export function resolveHEarthRepositoryRegistryPath(repositoryPath) {
  const indexed = pathIndex.get(repositoryPath);
  return indexed
    ? freeze({
        repositoryPath,
        resolved: true,
        nodes: [...indexed.nodes],
        occurrences: [...indexed.occurrences],
        unresolved: false
      })
    : baseFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
}

export function resolveHEarthRepositoryRegistryOccurrence(input = {}) {
  const local = localOccurrences.filter((entry) =>
    (input.path == null || entry.occurrence.path === input.path) &&
    (input.commitSha == null || entry.occurrence.commitSha === input.commitSha) &&
    (input.gitBlobSha == null || entry.occurrence.gitBlobSha === input.gitBlobSha) &&
    (input.refName == null || entry.occurrence.refName === input.refName));
  const base = baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);
  return freeze({
    query: base.query,
    matches: [...base.matches, ...local],
    resolved: base.resolved || local.length > 0
  });
}

export function findHEarthRepositoryRegistryNodes(criteria = {}) {
  const base = baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const matches = localNodes.filter((node) =>
    (criteria.repositoryPath == null || node.repositoryPaths.includes(criteria.repositoryPath)) &&
    (criteria.nodeType == null || criteria.nodeType === node.nodeType) &&
    (criteria.nodeSubtype == null || criteria.nodeSubtype === node.nodeSubtype) &&
    (criteria.authorityClass == null || criteria.authorityClass === node.authorityClass) &&
    (criteria.lifecycleStatus == null || criteria.lifecycleStatus === node.lifecycleStatus));
  return freeze([...base, ...matches]);
}

export const getHEarthRepositoryRegistryRelationsForNode = (id, direction = 'BOTH') =>
  localNodes.some((node) => node.nodeId === id)
    ? Object.freeze([])
    : baseFacade.getHEarthRepositoryRegistryRelationsForNode(id, direction);

export const getHEarthRepositoryRegistryDependencyClosure = (id) => {
  const node = localNodes.find((entry) => entry.nodeId === id);
  return node
    ? freeze({ nodeId: id, nodes: [node], relations: [], unresolved: false })
    : baseFacade.getHEarthRepositoryRegistryDependencyClosure(id);
};

export const H_EARTH_RUN_8E_R2_EXECUTION_FACADE = freeze({
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

export default H_EARTH_RUN_8E_R2_EXECUTION_FACADE;
