// /showroom/globe/h-earth/index.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034E_PUBLIC_STAGE_ADAPTER_LAYER_4_STATUS_PROJECTION_v1
//
// Renews:
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_033B_STRUCTURAL_BASELINE_HANDOFF_AND_PUBLIC_SPLIT_ALIGNMENT_v1
//
// Companion route shell:
// /showroom/globe/h-earth/index.html
// H_EARTH_3D_ROUTE_SHELL_FILE_RENEWAL_STEP_034C_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_PROJECTION_v1
//
// Companion stylesheet:
// /showroom/globe/h-earth/index.css
// H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_RENEWAL_STEP_034D_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_SUPPORT_v1
//
// Diagnostic route:
// /showroom/globe/h-earth/diagnostic/
//
// Purpose:
// Public-stage adapter for the H-Earth environment host. This file connects the
// public route shell to a visible environment stage, selected-surface readout,
// compact public receipts, and a narrow read-only Layer 4 / Step 012J status
// projection.
//
// Controlling relationship:
// STEP_012H_1_HEADLESS_REPLAY_FIXTURE_SIDE
//   ->
// STEP_012J_READ_ONLY_RELATIONSHIP_DESCRIPTOR
//   ->
// PUBLIC_STAGE_STATUS_PROJECTION
//
// Public-stage adapter rule:
// This file may read or dynamically import the Step 012J relationship
// descriptor when the deployed path supports it. If that import succeeds,
// normal JavaScript module initialization for Step 012J and its declared
// dependencies may be observed. That is not runner execution.
//
// The public stage must distinguish:
//
// MODULE_INITIALIZATION_OBSERVED
//
// from:
//
// RUN_FUNCTION_EXECUTED
// REPLAY_EXECUTED
// VECTOR_RUNNER_EXECUTED
// RUNTIME_EXECUTED
// CANONICAL_DIGEST_GENERATED
// REPLAY_COMPARISON
//
// The first may become true when Step 012J is imported.
// The others remain false.
//
// Boundary:
// Public route only.
// Environment host authorized.
// Visible stage authorized.
// Renderer mount support authorized as public-stage candidate display only.
// Read-only Step 012J descriptor projection authorized.
// Public-stage receipt definition authorized.
// Diagnostic route handoff authorized.
// Does not invoke Step 012H.1 run functions.
// Does not invoke Step 012I canonicalizers.
// Does not invoke Step 012I digest helpers.
// Does not invoke Step 012I snapshot functions.
// Does not invoke Step 012I vector runner.
// Does not invoke Target 002 runtime functions.
// Does not invoke Target 003 replay functions.
// Does not generate canonical digests.
// Does not compare replay results.
// Does not validate.
// Does not claim production.
// Does not claim visual pass.
// Does not collapse the matrix.

export const H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID =
  'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034E_PUBLIC_STAGE_ADAPTER_LAYER_4_STATUS_PROJECTION_v1';

export const H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_FILE_RENEWAL_STEP_034C_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_PROJECTION_v1';

export const H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID =
  'H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_RENEWAL_STEP_034D_PUBLIC_ENVIRONMENT_HOST_AND_LAYER_4_STATUS_SUPPORT_v1';

export const H_EARTH_3D_PUBLIC_ROUTE_FILE =
  '/showroom/globe/h-earth/index.js';

export const H_EARTH_3D_PUBLIC_ROUTE =
  '/showroom/globe/h-earth/';

export const H_EARTH_3D_DIAGNOSTIC_ROUTE =
  '/showroom/globe/h-earth/diagnostic/';

export const H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH =
  '../../../h-earth-3d/runtime/tests/h-earth.headless-serialization-bridge.js';

export const H_EARTH_3D_PUBLIC_RENDERER_MODULE_PATH =
  './renderer.js';

export const H_EARTH_3D_PUBLIC_STAGE_STATUS = Object.freeze({
  NOT_STARTED: 'PUBLIC_STAGE_NOT_STARTED',
  INITIALIZING: 'PUBLIC_STAGE_INITIALIZING',
  READY: 'PUBLIC_STAGE_READY',
  PARTIAL: 'PUBLIC_STAGE_PARTIAL',
  FALLBACK: 'PUBLIC_STAGE_FALLBACK',
  ERROR: 'PUBLIC_STAGE_ERROR'
});

export const H_EARTH_3D_LAYER_4_STATUS = Object.freeze({
  STATIC_METADATA_PROJECTED: 'LAYER_4_STATIC_METADATA_PROJECTED',
  DESCRIPTOR_IMPORT_PENDING: 'LAYER_4_DESCRIPTOR_IMPORT_PENDING',
  DESCRIPTOR_IMPORT_OBSERVED: 'LAYER_4_DESCRIPTOR_IMPORT_OBSERVED',
  DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED:
    'LAYER_4_DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED',
  DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED:
    'LAYER_4_DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED'
});

export const H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING = Object.freeze({
  moduleInitializationObservedMayBecomeTrue: true,

  runFunctionExecuted: false,
  step012H1RunExecuted: false,
  step012IVectorExecuted: false,
  step012IRunnerExecuted: false,
  target002RuntimeExecuted: false,
  target003ReplayExecuted: false,
  runtimeExecuted: false,
  replayExecuted: false,
  vectorRunnerExecuted: false,
  canonicalDigestGenerated: false,
  replayComparison: false,

  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  matrixCollapse: false
});

export const H_EARTH_3D_LAYER_4_CONTRACTS = Object.freeze({
  step012JContractId:
    'H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_FILE_BIRTH_STEP_012J_v1',

  step012H1ContractId:
    'H_EARTH_HEADLESS_REPLAY_CONTRACT_FILE_RENEWAL_STEP_012H_1_HISTORICAL_FIXTURE_ALIGNMENT_v1',

  step012IContractId:
    'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1',

  step012ICanonicalizationId:
    'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_UTF16_UTF8_SHA256_v1',

  target002ContractId:
    'H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

  target003ContractId:
    'H_EARTH_CANONICAL_REPLAY_FILE_RENEWAL_STEP_012G_TARGET_003_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

  step012IRunnerContractId:
    'H_EARTH_SERIALIZATION_VECTOR_RUNNER_FILE_BIRTH_STEP_012I_RUNNER_v1'
});

export const H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY = Object.freeze({
  custodyClass:
    'BACKED_STATIC_SUPPORT_METADATA_FOR_PUBLIC_STAGE_PROJECTION',

  step012JBackupComplete: true,
  step012JArchiveTitle:
    'h-earth-headless-serialization-bridge-step-012j-backup',
  step012JDriveDocumentId:
    '1zt8rsROGF8roudC3re1KOwmU5KSws6pQIap7kd0gQpw',

  step012H1ArchiveTitle:
    'h-earth-headless-replay-step-012h-1-backup',
  step012H1DriveDocumentId:
    '1DfSsDzKRYQNJn9S43hmA8gMeebY_7WeQ0ygoIl6Qt2Y',

  step012IArchiveTitle:
    'h-earth-canonical-state-serialization-law-step-012i-backup',
  step012IDriveDocumentId:
    '1K8bszh6SMeutLpCeyCjK6D9r8m6zsIEP3R6soBip6GA',

  step012IRunnerArchiveTitle:
    'h-earth-serialization-vector-runner-step-012i-backup',
  step012IRunnerDriveDocumentId:
    '1EcXxqb2M_MwdiHFVDX95klU4Dh6X1Be8Q5TFNDyCIUE',

  target002ArchiveTitle:
    'h-earth-deterministic-runtime-step-012g-target-002-backup',
  target002DriveDocumentId:
    '1AYVrqdmnBEdM5k4pop8wJNXMThXxdLZd7TNkhgkq2Z0',

  target003ArchiveTitle:
    'h-earth-canonical-replay-step-012g-target-003-backup',
  target003DriveDocumentId:
    '1qbNHRW9L3l7FjfJW04x30J9qNO9dNvWTR8b6Vh0C3vU',

  archiveCustodyStatus:
    'BACKED_OCCURRENCE_RECORDED_BY_CONSTRUCTION_BASIS',

  publicStageReverifiesDriveArchive: false,
  publicStageClaimsNetworkBackup: false
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS = Object.freeze({
  publicRouteOnly: true,
  publicEnvironmentHost: true,
  visibleStageAuthorized: true,
  rendererMountSupportAuthorized: true,
  selectedSurfaceDisplayAuthorized: true,
  groundConditionReadDisplayAuthorized: true,
  layer4StatusProjectionAuthorized: true,
  publicStageReceiptDefinitionAuthorized: true,
  diagnosticRouteHandoffAuthorized: true,

  diagnosticWallEmbedded: false,
  reportWallEmbedded: false,
  rawEvidenceWallEmbedded: false,
  receiptWallEmbedded: false,
  advancedCopySurfaceEmbedded: false,

  shellOwnedSceneObjects: false,
  fakeSceneGeometry: false,
  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  iframeActivation: false,

  step012H1RunExecution: false,
  step012IVectorExecution: false,
  step012IRunnerExecution: false,
  target002RuntimeExecution: false,
  target003ReplayExecution: false,
  canonicalDigestGeneration: false,
  replayComparison: false,

  runtimeActivation: false,
  routeActivationProof: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  deploymentClaim: false,

  traversal: false,
  survivalSimulation: false,
  swimming: false,
  fluidSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,
  runtimeLatticeActivation: false,
  active16x16RuntimeLatticeClaim: false,
  active256AddressRuntimeClaim: false,
  mirrorManorRouteCanonNaming: false,
  matrixCollapse: false
});

export const H_EARTH_3D_PUBLIC_MOUNT_IDS = Object.freeze({
  routeRoot: 'h-earth-3d-route-root',
  status: 'h-earth-3d-status',
  fallback: 'h-earth-3d-fallback',
  rendererMount: 'h-earth-3d-renderer-mount',

  actionInspectGround: 'h-earth-3d-action-inspect-ground',

  selectedTargetCard: 'h-earth-3d-selected-target-card',
  selectedTargetLabel: 'h-earth-3d-selected-target-label',
  selectedTargetObjectId: 'h-earth-3d-selected-target-object-id',
  selectedTargetClassification:
    'h-earth-3d-selected-target-classification',

  publicReadoutTitle: 'h-earth-3d-public-readout-title',
  publicReadoutLine: 'h-earth-3d-public-readout-line',
  publicReadout: 'h-earth-3d-public-readout',

  targetList: 'h-earth-3d-target-list',

  layer4StatusCard: 'h-earth-3d-layer-4-status-card',
  layer4Status: 'h-earth-3d-layer-4-status',
  layer4Summary: 'h-earth-3d-layer-4-summary',
  layer4ProjectionPayload: 'h-earth-3d-layer-4-projection-payload',

  step012JContractId: 'h-earth-3d-step-012j-contract-id',
  step012H1ContractId: 'h-earth-3d-step-012h-1-contract-id',
  step012IContractId: 'h-earth-3d-step-012i-contract-id',
  step012ICanonicalizationId:
    'h-earth-3d-step-012i-canonicalization-id',

  inspectionPanel: 'h-earth-3d-inspection-panel',
  debug: 'h-earth-3d-debug',
  publicStageReceipt: 'h-earth-3d-public-stage-receipt',
  copyStatus: 'h-earth-3d-copy-status',

  diagnosticLink: 'h-earth-3d-diagnostic-link'
});

export const H_EARTH_3D_PUBLIC_TARGETS = Object.freeze([
  Object.freeze({
    objectId: 'OBJ_002_FOREGROUND_WET_SAND',
    label: 'Foreground Wet Sand',
    classification: 'PRIMARY_INSPECTION_TARGET',
    material: 'wet-sand',
    action: 'Inspect Ground',
    readout: 'Ground Condition Read',
    receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    publicLine:
      'Foreground wet sand is the first readable surface. It is descriptor-only until a later authorized runtime execution lane exists.'
  }),

  Object.freeze({
    objectId: 'OBJ_003_SHORELINE_FOAM',
    label: 'Shoreline Foam',
    classification: 'SUPPORTING_SURFACE_CONTEXT',
    material: 'foam',
    action: 'Inspect Context',
    readout: 'Surface Context Read',
    receipt: 'H_EARTH_SURFACE_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Shoreline foam is context for the Ground-View Matrix. It does not create swimming, fluid simulation, or traversal authority.'
  }),

  Object.freeze({
    objectId: 'OBJ_004_NEARSHORE_WATER',
    label: 'Nearshore Water',
    classification: 'WATER_ATMOSPHERIC_CONTEXT',
    material: 'water',
    action: 'Inspect Context',
    readout: 'Water Context Read',
    receipt: 'H_EARTH_WATER_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'Nearshore water is public-stage context. It does not activate swimming, fluid simulation, or survival simulation.'
  }),

  Object.freeze({
    objectId: 'OBJ_009_DISTANCE_MANOR_CONTEXT',
    label: 'Distant Manor Context',
    classification: 'DISTANT_CONTEXT_ONLY',
    material: 'manor-context',
    action: 'Inspect Context',
    readout: 'Distant Context Read',
    receipt: 'H_EARTH_DISTANT_CONTEXT_RECEIPT_CANDIDATE',
    publicLine:
      'The distant manor remains contextual. It does not grant manor interior access or distant traversal.'
  })
]);

const MODULE_STATE = {
  initialized: false,
  status: H_EARTH_3D_PUBLIC_STAGE_STATUS.NOT_STARTED,

  mountPoints: null,
  selectedTargetId: 'OBJ_002_FOREGROUND_WET_SAND',

  generatedAt: null,

  rendererImportReceipt: null,
  rendererMountReceipt: null,

  layer4ImportReceipt: null,
  layer4StatusProjection: null,
  layer4PublicStageReceipt: null,

  routeBootstrapReceipt: null,
  routeBootstrapResult: null,

  asyncInitializationStarted: false,
  asyncInitializationComplete: false
};

function nowIso() {
  return new Date().toISOString();
}

function freeze(value) {
  return Object.freeze(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getDocumentFromOptions(options = {}) {
  return options.document || globalThis.document || null;
}

function getById(rootDocument, id) {
  if (!rootDocument || typeof rootDocument.getElementById !== 'function') {
    return null;
  }

  return rootDocument.getElementById(id);
}

function safeSerialize(value, options = {}) {
  const maxDepth =
    Number.isFinite(options.maxDepth) ? options.maxDepth : 7;
  const maxArrayLength =
    Number.isFinite(options.maxArrayLength) ? options.maxArrayLength : 120;

  const seen = new WeakSet();

  function visit(input, depth) {
    if (input === null) return null;

    const type = typeof input;

    if (
      type === 'string' ||
      type === 'number' ||
      type === 'boolean'
    ) {
      if (typeof input === 'number' && !Number.isFinite(input)) {
        return String(input);
      }

      return input;
    }

    if (type === 'bigint') return String(input);
    if (type === 'undefined') return null;
    if (type === 'function') return `[Function ${input.name || 'anonymous'}]`;
    if (type === 'symbol') return String(input);

    if (depth > maxDepth) return '[MaxDepthExceeded]';

    if (type === 'object') {
      if (seen.has(input)) return '[Circular]';
      seen.add(input);

      if (Array.isArray(input)) {
        const output = input
          .slice(0, maxArrayLength)
          .map((entry) => visit(entry, depth + 1));

        if (input.length > maxArrayLength) {
          output.push(`[ArrayTruncated ${input.length - maxArrayLength}]`);
        }

        return output;
      }

      const output = {};

      Object.keys(input).forEach((key) => {
        if (
          key === 'document' ||
          key === 'ownerDocument' ||
          key === 'mountNode' ||
          key === 'routeRoot' ||
          key === 'statusNode' ||
          key === 'fallbackNode' ||
          key === 'rendererMount' ||
          key === 'target'
        ) {
          output[key] = '[DOMNodeOmitted]';
          return;
        }

        output[key] = visit(input[key], depth + 1);
      });

      return output;
    }

    return String(input);
  }

  return visit(value, 0);
}

function stringifyPayload(value, options = {}) {
  return JSON.stringify(
    safeSerialize(value, options),
    null,
    2
  );
}

function writeText(node, value) {
  if (!node) return false;
  node.textContent = String(value ?? '');
  return true;
}

function writeJson(node, value, options = {}) {
  if (!node) return false;
  node.textContent = stringifyPayload(value, options);
  return true;
}

function setDatasetBoolean(node, key, value) {
  if (!node?.dataset) return false;
  node.dataset[key] = value === true ? 'true' : 'false';
  return true;
}

function setRouteClass(routeRoot, className) {
  if (!routeRoot) return false;

  routeRoot.classList.remove(
    'h-earth-3d-boot-ready',
    'h-earth-3d-boot-fallback',
    'h-earth-3d-boot-error'
  );

  if (className) {
    routeRoot.classList.add(className);
  }

  return true;
}

function resolveMountPoints(rootDocument = globalThis.document) {
  const ids = H_EARTH_3D_PUBLIC_MOUNT_IDS;

  const routeRoot = getById(rootDocument, ids.routeRoot);
  const statusNode = getById(rootDocument, ids.status);
  const fallbackNode = getById(rootDocument, ids.fallback);
  const rendererMount = getById(rootDocument, ids.rendererMount);

  const missingRequiredIds = [];

  if (!routeRoot) missingRequiredIds.push(ids.routeRoot);
  if (!statusNode) missingRequiredIds.push(ids.status);
  if (!fallbackNode) missingRequiredIds.push(ids.fallback);
  if (!rendererMount) missingRequiredIds.push(ids.rendererMount);

  return freeze({
    documentAvailable:
      Boolean(rootDocument && typeof rootDocument.getElementById === 'function'),
    routeRoot,
    statusNode,
    fallbackNode,
    rendererMount,

    actionInspectGround:
      getById(rootDocument, ids.actionInspectGround),

    selectedTargetCard:
      getById(rootDocument, ids.selectedTargetCard),
    selectedTargetLabel:
      getById(rootDocument, ids.selectedTargetLabel),
    selectedTargetObjectId:
      getById(rootDocument, ids.selectedTargetObjectId),
    selectedTargetClassification:
      getById(rootDocument, ids.selectedTargetClassification),

    publicReadoutTitle:
      getById(rootDocument, ids.publicReadoutTitle),
    publicReadoutLine:
      getById(rootDocument, ids.publicReadoutLine),
    publicReadout:
      getById(rootDocument, ids.publicReadout),

    targetList:
      getById(rootDocument, ids.targetList),

    layer4StatusCard:
      getById(rootDocument, ids.layer4StatusCard),
    layer4Status:
      getById(rootDocument, ids.layer4Status),
    layer4Summary:
      getById(rootDocument, ids.layer4Summary),
    layer4ProjectionPayload:
      getById(rootDocument, ids.layer4ProjectionPayload),

    step012JContractId:
      getById(rootDocument, ids.step012JContractId),
    step012H1ContractId:
      getById(rootDocument, ids.step012H1ContractId),
    step012IContractId:
      getById(rootDocument, ids.step012IContractId),
    step012ICanonicalizationId:
      getById(rootDocument, ids.step012ICanonicalizationId),

    inspectionPanel:
      getById(rootDocument, ids.inspectionPanel),
    debug:
      getById(rootDocument, ids.debug),
    publicStageReceipt:
      getById(rootDocument, ids.publicStageReceipt),
    copyStatus:
      getById(rootDocument, ids.copyStatus),

    diagnosticLink:
      getById(rootDocument, ids.diagnosticLink),

    requiredFound: missingRequiredIds.length === 0,
    missingRequiredIds: freeze(missingRequiredIds)
  });
}

function getTarget(targetId) {
  return (
    H_EARTH_3D_PUBLIC_TARGETS.find((target) => target.objectId === targetId) ||
    H_EARTH_3D_PUBLIC_TARGETS[0]
  );
}

function buildGroundConditionReadPayload(target = getTarget(MODULE_STATE.selectedTargetId)) {
  return freeze({
    receiptType: 'H_EARTH_3D_PUBLIC_GROUND_CONDITION_READ_PAYLOAD',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    selectedObjectId: target.objectId,
    selectedObjectLabel: target.label,
    selectedObjectClassification: target.classification,
    selectedMaterial: target.material,

    action: target.action,
    readout: target.readout,
    receipt: target.receipt,
    publicLine: target.publicLine,

    descriptorOnly: true,
    runtimeActionExecutionClaim: false,
    receiptPersistenceClaim: false,
    survivalSimulationClaim: false,
    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function renderSelectedTarget(mountPoints, target) {
  if (!mountPoints || !target) return false;

  writeText(mountPoints.selectedTargetLabel, target.label);
  writeText(mountPoints.selectedTargetObjectId, target.objectId);
  writeText(mountPoints.selectedTargetClassification, target.classification);

  writeText(
    mountPoints.publicReadoutTitle,
    `${target.label} · ${target.action}`
  );

  writeText(
    mountPoints.publicReadoutLine,
    target.publicLine
  );

  writeJson(
    mountPoints.inspectionPanel,
    buildGroundConditionReadPayload(target),
    { maxDepth: 7, maxArrayLength: 80 }
  );

  return true;
}

function renderTargetList(mountPoints) {
  if (!mountPoints?.targetList || !mountPoints.targetList.ownerDocument) {
    return false;
  }

  const rootDocument = mountPoints.targetList.ownerDocument;

  mountPoints.targetList.textContent = '';

  H_EARTH_3D_PUBLIC_TARGETS.forEach((target) => {
    const button = rootDocument.createElement('button');
    button.type = 'button';
    button.className = 'h-earth-3d-target-button';
    button.dataset.hEarthTargetId = target.objectId;
    button.dataset.hEarthTargetClassification = target.classification;
    button.setAttribute(
      'aria-current',
      target.objectId === MODULE_STATE.selectedTargetId ? 'true' : 'false'
    );

    button.textContent = `${target.label} · ${target.classification}`;

    button.addEventListener('click', () => {
      MODULE_STATE.selectedTargetId = target.objectId;

      Array.from(
        mountPoints.targetList.querySelectorAll('[data-h-earth-target-id]')
      ).forEach((node) => {
        node.setAttribute(
          'aria-current',
          node.getAttribute('data-h-earth-target-id') === target.objectId
            ? 'true'
            : 'false'
        );
      });

      renderSelectedTarget(mountPoints, target);
      rebuildAndRenderPublicReceipts(mountPoints);
    });

    mountPoints.targetList.appendChild(button);
  });

  return true;
}

function buildStaticLayer4Projection(status = H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED) {
  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_LAYER_4_STATUS_PROJECTION',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    projectionClass:
      'NARROW_PUBLIC_STAGE_PLAIN_DATA_PROJECTION',

    bridgeStatus: status,
    bridgeMode:
      'STEP_012J_READ_ONLY_RELATIONSHIP_DESCRIPTOR',

    step012JContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012JContractId,
    step012H1ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012H1ContractId,
    step012IContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012IContractId,
    step012ICanonicalizationId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012ICanonicalizationId,

    relationshipMembers: freeze({
      step012H1HeadlessReplayFixtureSide: true,
      step012ICanonicalSerializationLawMember: true,
      step012IRunnerRelationshipMember: false,
      target002IdentifiedSupportSurface: true,
      target003IdentifiedSupportSurface: true
    }),

    target002ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.target002ContractId,
    target003ContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.target003ContractId,
    step012IRunnerContractId:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012IRunnerContractId,

    archiveCustodyStatus:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY.archiveCustodyStatus,
    archiveCustody: H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    moduleImportAttempted: false,
    moduleInitializationObserved: false,
    importedDescriptorContractMatchesExpected: false,
    importedStep012H1ContractMatchesExpected: false,
    importedStep012IContractMatchesExpected: false,
    importedStep012ICanonicalizationMatchesExpected: false,

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    claimCeiling: H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    displayPolicy: freeze({
      narrowPlainDataProjectionOnly: true,
      callableFunctionsDisplayedAsInputs: false,
      wholeStep012JAggregateDisplayed: false,
      wholeStep012JAggregatePassedIntoStep012I: false,
      descriptorClaimsReinterpretedAsExecutionEvidence: false,
      successfulRenderingLabeledAsValidation: false
    }),

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function normalizeImportedBridgeProjection(importReceipt, bridgeModule) {
  const targetClassification =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_TARGET_CLASSIFICATION ||
    bridgeModule?.default?.targetClassification ||
    null;

  const authority =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_AUTHORITY ||
    bridgeModule?.default?.authority ||
    null;

  const contractId =
    bridgeModule?.H_EARTH_HEADLESS_SERIALIZATION_BRIDGE_CONTRACT_ID ||
    bridgeModule?.default?.contractId ||
    authority?.contractId ||
    null;

  const expected = H_EARTH_3D_LAYER_4_CONTRACTS;

  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_LAYER_4_STATUS_PROJECTION',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    projectionClass:
      'NARROW_PUBLIC_STAGE_PLAIN_DATA_PROJECTION',

    bridgeStatus:
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_OBSERVED,
    bridgeMode:
      authority?.activeStatusCeiling ||
      'STATIC_BRIDGE_DESCRIPTOR_ONLY',

    step012JContractId:
      contractId || expected.step012JContractId,

    step012H1ContractId:
      targetClassification?.importedStep012H1ContractId ||
      targetClassification?.expectedStep012H1ContractId ||
      expected.step012H1ContractId,

    step012IContractId:
      targetClassification?.importedStep012IContractId ||
      targetClassification?.expectedStep012IContractId ||
      expected.step012IContractId,

    step012ICanonicalizationId:
      targetClassification?.importedStep012ICanonicalizationId ||
      targetClassification?.expectedStep012ICanonicalizationId ||
      expected.step012ICanonicalizationId,

    relationshipMembers: freeze({
      step012H1HeadlessReplayFixtureSide:
        authority?.step012H1RelationshipMember === true ||
        true,
      step012ICanonicalSerializationLawMember:
        authority?.step012IRelationshipMember === true ||
        true,
      step012IRunnerRelationshipMember:
        authority?.step012IRunnerRelationshipMember === true,
      target002IdentifiedSupportSurface: true,
      target003IdentifiedSupportSurface: true
    }),

    target002ContractId:
      expected.target002ContractId,
    target003ContractId:
      expected.target003ContractId,
    step012IRunnerContractId:
      expected.step012IRunnerContractId,

    archiveCustodyStatus:
      H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY.archiveCustodyStatus,
    archiveCustody: H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,

    moduleImportAttempted: true,
    moduleInitializationObserved: importReceipt?.importSucceeded === true,
    importedDescriptorContractMatchesExpected:
      contractId === expected.step012JContractId,

    importedStep012H1ContractMatchesExpected:
      (
        targetClassification?.declaredStep012H1ContractMatchesExpected === true ||
        targetClassification?.importedStep012H1ContractId === expected.step012H1ContractId
      ),

    importedStep012IContractMatchesExpected:
      (
        targetClassification?.declaredStep012IContractMatchesExpected === true ||
        targetClassification?.importedStep012IContractId === expected.step012IContractId
      ),

    importedStep012ICanonicalizationMatchesExpected:
      (
        targetClassification?.declaredStep012ICanonicalizationMatchesExpected === true ||
        targetClassification?.importedStep012ICanonicalizationId === expected.step012ICanonicalizationId
      ),

    sourceDefinedBridgeClassification: freeze({
      importDeclarationPresent:
        targetClassification?.importDeclarationPresent === true,
      importResolutionProof:
        targetClassification?.importResolutionProof === true,
      installedModuleEvaluationProof:
        targetClassification?.installedModuleEvaluationProof === true,
      moduleGraphExecutionProof:
        targetClassification?.moduleGraphExecutionProof === true,
      bridgeExecutionProof:
        targetClassification?.bridgeExecutionProof === true
    }),

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    claimCeiling: H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    displayPolicy: freeze({
      narrowPlainDataProjectionOnly: true,
      callableFunctionsDisplayedAsInputs: false,
      wholeStep012JAggregateDisplayed: false,
      wholeStep012JAggregatePassedIntoStep012I: false,
      descriptorClaimsReinterpretedAsExecutionEvidence: false,
      successfulRenderingLabeledAsValidation: false
    }),

    importReceipt,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildLayer4ImportFailureProjection(importReceipt) {
  return freeze({
    ...buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_FAILED_STATIC_METADATA_RETAINED
    ),
    moduleImportAttempted: true,
    moduleInitializationObserved: false,
    importedDescriptorContractMatchesExpected: false,
    importReceipt
  });
}

function renderLayer4Projection(mountPoints, projection) {
  if (!mountPoints || !projection) return false;

  writeText(
    mountPoints.layer4Status,
    projection.bridgeStatus || H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED
  );

  if (mountPoints.layer4Status?.dataset) {
    mountPoints.layer4Status.dataset.hEarthLayer4Status =
      projection.bridgeStatus || 'projected';
  }

  writeText(
    mountPoints.layer4Summary,
    projection.moduleInitializationObserved === true
      ? 'Step 012J descriptor module initialization was observed through public-stage import. No runner, replay, vector, runtime, digest, comparison, validation, production, visual-pass, or matrix-collapse execution is claimed.'
      : 'Step 012J is projected as backed read-only static custody metadata. No runner, replay, vector, runtime, digest, comparison, validation, production, visual-pass, or matrix-collapse execution is claimed.'
  );

  writeText(
    mountPoints.step012JContractId,
    projection.step012JContractId
  );

  writeText(
    mountPoints.step012H1ContractId,
    projection.step012H1ContractId
  );

  writeText(
    mountPoints.step012IContractId,
    projection.step012IContractId
  );

  writeText(
    mountPoints.step012ICanonicalizationId,
    projection.step012ICanonicalizationId
  );

  writeJson(
    mountPoints.layer4ProjectionPayload,
    projection,
    { maxDepth: 9, maxArrayLength: 160 }
  );

  return true;
}

function buildLayer4PublicStageReceipt() {
  const projection =
    MODULE_STATE.layer4StatusProjection ||
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
    );

  return freeze({
    receiptType:
      'H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    publicRoute: H_EARTH_3D_PUBLIC_ROUTE,
    diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

    publicStageAdapter: true,
    readOnlyLayer4StatusProjection: true,
    environmentHostAuthorized: true,
    visibleStageAuthorized: true,

    step012JDescriptorReadAuthorized: true,
    layer4StatusProjection: projection,

    moduleInitializationObserved:
      projection.moduleInitializationObserved === true,

    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapStatus() {
  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_ROUTE_BOOTSTRAP_STATUS',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),

    status: MODULE_STATE.status,
    initialized: MODULE_STATE.initialized === true,
    asyncInitializationStarted:
      MODULE_STATE.asyncInitializationStarted === true,
    asyncInitializationComplete:
      MODULE_STATE.asyncInitializationComplete === true,

    selectedTargetId: MODULE_STATE.selectedTargetId,

    routeRootFound:
      Boolean(MODULE_STATE.mountPoints?.routeRoot),
    statusNodeFound:
      Boolean(MODULE_STATE.mountPoints?.statusNode),
    fallbackNodeFound:
      Boolean(MODULE_STATE.mountPoints?.fallbackNode),
    rendererMountNodeFound:
      Boolean(MODULE_STATE.mountPoints?.rendererMount),

    publicEnvironmentHost: true,
    visibleStageAuthorized: true,
    layer4StatusProjectionAuthorized: true,

    rendererImportReceipt: MODULE_STATE.rendererImportReceipt,
    rendererMountReceipt: MODULE_STATE.rendererMountReceipt,

    layer4ImportReceipt: MODULE_STATE.layer4ImportReceipt,
    layer4StatusProjection:
      MODULE_STATE.layer4StatusProjection,

    moduleInitializationObserved:
      MODULE_STATE.layer4StatusProjection?.moduleInitializationObserved === true,

    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function buildRouteBootstrapReceipt() {
  return freeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,
    generatedAt: nowIso(),

    publicRoute: H_EARTH_3D_PUBLIC_ROUTE,
    diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

    status: MODULE_STATE.status,
    initialized: MODULE_STATE.initialized === true,

    matrix: 'H-Earth',
    matrixRole: 'Ground-View Matrix',
    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    selectedTarget:
      getTarget(MODULE_STATE.selectedTargetId),

    publicEnvironmentHost: true,
    visibleStageAuthorized: true,
    rendererMountSupportAuthorized: true,
    layer4StatusProjectionAuthorized: true,

    routeStatus:
      buildRouteBootstrapStatus(),

    rendererImportReceipt:
      MODULE_STATE.rendererImportReceipt,
    rendererMountReceipt:
      MODULE_STATE.rendererMountReceipt,

    layer4PublicStageReceipt:
      MODULE_STATE.layer4PublicStageReceipt,
    layer4StatusProjection:
      MODULE_STATE.layer4StatusProjection,

    publicStageExecutionStatus:
      H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function rebuildAndRenderPublicReceipts(mountPoints = MODULE_STATE.mountPoints) {
  MODULE_STATE.layer4PublicStageReceipt =
    buildLayer4PublicStageReceipt();

  MODULE_STATE.routeBootstrapReceipt =
    buildRouteBootstrapReceipt();

  writeJson(
    mountPoints?.publicStageReceipt,
    MODULE_STATE.layer4PublicStageReceipt,
    { maxDepth: 9, maxArrayLength: 160 }
  );

  writeJson(
    mountPoints?.debug,
    MODULE_STATE.routeBootstrapReceipt,
    { maxDepth: 8, maxArrayLength: 120 }
  );

  return freeze({
    layer4PublicStageReceipt: MODULE_STATE.layer4PublicStageReceipt,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt
  });
}

function resolveRendererMountFunction(rendererModule) {
  if (!rendererModule || typeof rendererModule !== 'object') return null;

  const directCandidates = [
    rendererModule.mountHEarthRenderer,
    rendererModule.mountHEarth3DRenderer,
    rendererModule.mountHEarthCandidateRenderer,
    rendererModule.mountHEarthCandidateScene,
    rendererModule.mountHEarthRenderScene,
    rendererModule.renderHEarthCandidateScene,
    rendererModule.initializeHEarthRenderer,
    rendererModule.default?.mountHEarthRenderer,
    rendererModule.default?.mountHEarthCandidateScene,
    rendererModule.default?.mount,
    rendererModule.default?.render,
    rendererModule.default?.initialize
  ];

  return directCandidates.find((candidate) => typeof candidate === 'function') || null;
}

async function attemptPublicRendererMount(mountPoints, options = {}) {
  const rendererPath =
    options.rendererModulePath ||
    H_EARTH_3D_PUBLIC_RENDERER_MODULE_PATH;

  const importReceiptBase = {
    receiptType:
      'H_EARTH_3D_PUBLIC_RENDERER_IMPORT_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    rendererModulePath: rendererPath,
    importAttempted: true,
    importSucceeded: false,
    mountAttempted: false,
    mounted: false,
    publicStageCandidateOnly: true,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  };

  try {
    const rendererModule = await import(rendererPath);
    const mountFn = resolveRendererMountFunction(rendererModule);

    const importReceipt = freeze({
      ...importReceiptBase,
      importSucceeded: true,
      rendererModuleKeys: freeze(Object.keys(rendererModule || {})),
      mountFunctionFound: Boolean(mountFn)
    });

    MODULE_STATE.rendererImportReceipt = importReceipt;

    if (!mountFn || !mountPoints?.rendererMount) {
      MODULE_STATE.rendererMountReceipt = freeze({
        receiptType:
          'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
        file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
        contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
        rendererModulePath: rendererPath,
        importSucceeded: true,
        mountAttempted: false,
        mounted: false,
        reason: !mountFn
          ? 'NO_COMPATIBLE_RENDERER_MOUNT_FUNCTION_EXPORTED'
          : 'RENDERER_MOUNT_NODE_MISSING',
        publicStageCandidateOnly: true,
        rendererPassClaim: false,
        visualPassClaim: false,
        validationClaim: false,
        productionClaim: false,
        matrixCollapse: false
      });

      return MODULE_STATE.rendererMountReceipt;
    }

    let rawMountResult = null;

    try {
      rawMountResult = mountFn({
        document: mountPoints.rendererMount.ownerDocument,
        routeRoot: mountPoints.routeRoot,
        mountNode: mountPoints.rendererMount,
        rendererMount: mountPoints.rendererMount,
        selectedTargetId: MODULE_STATE.selectedTargetId,
        publicStageCandidateOnly: true
      });
    } catch (_firstError) {
      rawMountResult = mountFn(
        mountPoints.rendererMount,
        {
          document: mountPoints.rendererMount.ownerDocument,
          routeRoot: mountPoints.routeRoot,
          selectedTargetId: MODULE_STATE.selectedTargetId,
          publicStageCandidateOnly: true
        }
      );
    }

    MODULE_STATE.rendererMountReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      rendererModulePath: rendererPath,
      importSucceeded: true,
      mountFunctionFound: true,
      mountAttempted: true,
      mounted:
        Boolean(rawMountResult?.mounted) ||
        Boolean(rawMountResult?.rendererMounted) ||
        mountPoints.rendererMount.childNodes.length > 0,
      rawMountResult: safeSerialize(rawMountResult, {
        maxDepth: 5,
        maxArrayLength: 80
      }),
      mountedNodeCount:
        mountPoints.rendererMount.childNodes.length,
      publicStageCandidateOnly: true,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    });

    return MODULE_STATE.rendererMountReceipt;
  } catch (error) {
    MODULE_STATE.rendererImportReceipt = freeze({
      ...importReceiptBase,
      importSucceeded: false,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error)
    });

    MODULE_STATE.rendererMountReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      rendererModulePath: rendererPath,
      importSucceeded: false,
      mountAttempted: false,
      mounted: false,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),
      publicStageCandidateOnly: true,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    });

    return MODULE_STATE.rendererMountReceipt;
  }
}

async function readLayer4BridgeDescriptor(options = {}) {
  if (options.skipLayer4DescriptorImport === true) {
    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: false,
      importSkipped: true,
      importSucceeded: false,
      moduleInitializationObserved: false,
      layer4BridgeModulePath:
        options.layer4BridgeModulePath ||
        H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH,
      reason:
        'skipLayer4DescriptorImport option was true.',
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      buildStaticLayer4Projection(
        H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_SKIPPED_STATIC_METADATA_RETAINED
      );

    return MODULE_STATE.layer4StatusProjection;
  }

  const modulePath =
    options.layer4BridgeModulePath ||
    H_EARTH_3D_LAYER_4_BRIDGE_DEFAULT_MODULE_PATH;

  try {
    const bridgeModule = await import(modulePath);

    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: true,
      importSkipped: false,
      importSucceeded: true,
      moduleInitializationObserved: true,
      layer4BridgeModulePath: modulePath,
      moduleExportKeys: freeze(Object.keys(bridgeModule || {})),

      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      normalizeImportedBridgeProjection(importReceipt, bridgeModule);

    return MODULE_STATE.layer4StatusProjection;
  } catch (error) {
    const importReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_STEP_012J_IMPORT_RECEIPT',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      importAttempted: true,
      importSkipped: false,
      importSucceeded: false,
      moduleInitializationObserved: false,
      layer4BridgeModulePath: modulePath,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),

      staticCustodyMetadataRetained: true,

      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false
    });

    MODULE_STATE.layer4ImportReceipt = importReceipt;
    MODULE_STATE.layer4StatusProjection =
      buildLayer4ImportFailureProjection(importReceipt);

    return MODULE_STATE.layer4StatusProjection;
  }
}

function updateRouteRootExecutionDataset(mountPoints) {
  const routeRoot = mountPoints?.routeRoot;

  if (!routeRoot?.dataset) return false;

  routeRoot.dataset.hEarthModuleInitializationObserved =
    MODULE_STATE.layer4StatusProjection?.moduleInitializationObserved === true
      ? 'true'
      : 'false';

  routeRoot.dataset.hEarthRunFunctionExecuted = 'false';
  routeRoot.dataset.hEarthReplayExecuted = 'false';
  routeRoot.dataset.hEarthVectorRunnerExecuted = 'false';
  routeRoot.dataset.hEarthRuntimeExecuted = 'false';
  routeRoot.dataset.hEarthCanonicalDigestGenerated = 'false';
  routeRoot.dataset.hEarthReplayComparison = 'false';
  routeRoot.dataset.hEarthValidationClaim = 'false';
  routeRoot.dataset.hEarthProductionClaim = 'false';
  routeRoot.dataset.hEarthVisualPassClaim = 'false';
  routeRoot.dataset.hEarthMatrixCollapse = 'false';

  return true;
}

async function completeAsyncPublicStageInitialization(mountPoints, options = {}) {
  MODULE_STATE.asyncInitializationStarted = true;

  writeText(
    mountPoints?.layer4Status,
    H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
  );

  const [layer4Projection, rendererMountReceipt] =
    await Promise.all([
      readLayer4BridgeDescriptor(options),
      options.skipRendererMount === true
        ? Promise.resolve(freeze({
            receiptType:
              'H_EARTH_3D_PUBLIC_RENDERER_MOUNT_RECEIPT',
            file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
            contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
            mountAttempted: false,
            mounted: false,
            reason: 'skipRendererMount option was true.',
            publicStageCandidateOnly: true,
            rendererPassClaim: false,
            visualPassClaim: false,
            validationClaim: false,
            productionClaim: false,
            matrixCollapse: false
          }))
        : attemptPublicRendererMount(mountPoints, options)
    ]);

  MODULE_STATE.layer4StatusProjection = layer4Projection;
  MODULE_STATE.rendererMountReceipt = rendererMountReceipt;

  const rendererMounted =
    rendererMountReceipt?.mounted === true;

  if (rendererMounted) {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.READY;
    setRouteClass(mountPoints?.routeRoot, 'h-earth-3d-boot-ready');
    writeText(
      mountPoints?.statusNode,
      'PUBLIC_STAGE_READY'
    );
    writeText(
      mountPoints?.fallbackNode,
      'H-Earth public environment stage mounted as candidate display.'
    );
  } else {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.PARTIAL;
    setRouteClass(mountPoints?.routeRoot, 'h-earth-3d-boot-fallback');
    writeText(
      mountPoints?.statusNode,
      'PUBLIC_STAGE_PARTIAL'
    );
    writeText(
      mountPoints?.fallbackNode,
      'H-Earth public route is available. Renderer mount support is held or unavailable; Layer 4 status projection remains read-only.'
    );
  }

  renderLayer4Projection(mountPoints, layer4Projection);
  updateRouteRootExecutionDataset(mountPoints);
  rebuildAndRenderPublicReceipts(mountPoints);

  MODULE_STATE.asyncInitializationComplete = true;

  globalThis.H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
    MODULE_STATE.layer4StatusProjection;
  globalThis.H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
    MODULE_STATE.layer4PublicStageReceipt;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    MODULE_STATE.routeBootstrapReceipt;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
    buildRouteBootstrapStatus();

  return freeze({
    initialized: MODULE_STATE.initialized,
    status: MODULE_STATE.status,
    layer4StatusProjection: MODULE_STATE.layer4StatusProjection,
    rendererMountReceipt: MODULE_STATE.rendererMountReceipt,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function bindActionControls(mountPoints) {
  if (!mountPoints?.actionInspectGround) {
    return freeze({
      inspectGroundBound: false
    });
  }

  mountPoints.actionInspectGround.addEventListener('click', () => {
    const target = getTarget(MODULE_STATE.selectedTargetId);

    renderSelectedTarget(mountPoints, target);
    rebuildAndRenderPublicReceipts(mountPoints);

    writeText(
      mountPoints.statusNode,
      'GROUND_CONDITION_READ_DISPLAYED_DESCRIPTOR_ONLY'
    );
  });

  return freeze({
    inspectGroundBound: true
  });
}

function bindCopyControls(rootDocument = globalThis.document) {
  if (!rootDocument || typeof rootDocument.querySelectorAll !== 'function') {
    return freeze({
      copyButtonsBound: 0
    });
  }

  const buttons = Array.from(
    rootDocument.querySelectorAll(
      '[data-h-earth-receipt-copy-button="true"][data-h-earth-copy-target]'
    )
  );

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-h-earth-copy-target');
      const label =
        button.getAttribute('data-h-earth-copy-label') ||
        targetId ||
        'Receipt';
      const copyStatus =
        getById(rootDocument, H_EARTH_3D_PUBLIC_MOUNT_IDS.copyStatus);
      const targetNode =
        targetId ? getById(rootDocument, targetId) : null;

      if (!targetNode) {
        writeText(copyStatus, `${label} copy failed: target not found.`);
        setDatasetBoolean(copyStatus, 'hEarthCopyFailure', true);
        return;
      }

      const text = targetNode.textContent || '';

      if (!text.trim()) {
        writeText(copyStatus, `${label} copy failed: payload is empty.`);
        setDatasetBoolean(copyStatus, 'hEarthCopyFailure', true);
        return;
      }

      try {
        if (
          globalThis.navigator?.clipboard &&
          typeof globalThis.navigator.clipboard.writeText === 'function'
        ) {
          await globalThis.navigator.clipboard.writeText(text);
          writeText(copyStatus, `${label} copied.`);
          if (copyStatus?.dataset) {
            copyStatus.dataset.hEarthCopyState = 'success';
          }
          return;
        }

        writeText(
          copyStatus,
          `${label} prepared, but Clipboard API is unavailable in this context.`
        );

        if (copyStatus?.dataset) {
          copyStatus.dataset.hEarthCopyState = 'held';
        }
      } catch (error) {
        writeText(
          copyStatus,
          `${label} copy failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );

        if (copyStatus?.dataset) {
          copyStatus.dataset.hEarthCopyState = 'failure';
        }
      }
    });
  });

  return freeze({
    copyButtonsBound: buttons.length
  });
}

function renderInitialStaticRoute(mountPoints) {
  const target = getTarget(MODULE_STATE.selectedTargetId);

  renderSelectedTarget(mountPoints, target);
  renderTargetList(mountPoints);

  MODULE_STATE.layer4StatusProjection =
    buildStaticLayer4Projection(
      H_EARTH_3D_LAYER_4_STATUS.DESCRIPTOR_IMPORT_PENDING
    );

  renderLayer4Projection(
    mountPoints,
    MODULE_STATE.layer4StatusProjection
  );

  rebuildAndRenderPublicReceipts(mountPoints);

  writeText(
    mountPoints.statusNode,
    'PUBLIC_STAGE_INITIALIZING'
  );

  writeText(
    mountPoints.fallbackNode,
    'H-Earth public route is loading the public-stage adapter.'
  );

  return true;
}

export function initializeHEarthRoute(options = {}) {
  const rootDocument = getDocumentFromOptions(options);
  const mountPoints = resolveMountPoints(rootDocument);

  MODULE_STATE.generatedAt = nowIso();
  MODULE_STATE.mountPoints = mountPoints;
  MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.INITIALIZING;

  bindCopyControls(rootDocument);

  if (!mountPoints.requiredFound) {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.ERROR;
    MODULE_STATE.initialized = false;

    const failureReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_MOUNT_FAILURE',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      generatedAt: nowIso(),
      status: MODULE_STATE.status,
      missingRequiredIds: mountPoints.missingRequiredIds,
      publicEnvironmentHost: true,
      layer4StatusProjectionAuthorized: true,
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    MODULE_STATE.routeBootstrapReceipt = failureReceipt;
    MODULE_STATE.routeBootstrapResult = failureReceipt;

    writeText(
      mountPoints.statusNode,
      'PUBLIC_STAGE_MOUNT_FAILURE'
    );

    writeJson(
      mountPoints.debug,
      failureReceipt,
      { maxDepth: 7, maxArrayLength: 80 }
    );

    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
      failureReceipt;

    return freeze({
      initialized: false,
      status: MODULE_STATE.status,
      mountPoints,
      failureReceipt,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  MODULE_STATE.initialized = true;

  renderInitialStaticRoute(mountPoints);
  bindActionControls(mountPoints);

  if (mountPoints.diagnosticLink) {
    mountPoints.diagnosticLink.setAttribute(
      'href',
      H_EARTH_3D_DIAGNOSTIC_ROUTE
    );
  }

  updateRouteRootExecutionDataset(mountPoints);

  const immediateResult = freeze({
    initialized: true,
    status: MODULE_STATE.status,
    generatedAt: MODULE_STATE.generatedAt,
    mountPoints,
    routeBootstrapReceipt: MODULE_STATE.routeBootstrapReceipt,
    layer4StatusProjection: MODULE_STATE.layer4StatusProjection,
    layer4PublicStageReceipt: MODULE_STATE.layer4PublicStageReceipt,
    asyncCompletion:
      'PENDING_DYNAMIC_DESCRIPTOR_AND_RENDERER_IMPORTS',
    publicStageAdapter: true,
    readOnlyLayer4StatusProjection: true,
    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });

  MODULE_STATE.routeBootstrapResult = immediateResult;

  globalThis.H_EARTH_3D_INDEX = H_EARTH_3D_INDEX;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT = immediateResult;
  globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
    MODULE_STATE.routeBootstrapReceipt;
  globalThis.H_EARTH_3D_LAYER_4_STATUS_PROJECTION =
    MODULE_STATE.layer4StatusProjection;
  globalThis.H_EARTH_3D_LAYER_4_PUBLIC_STAGE_RECEIPT =
    MODULE_STATE.layer4PublicStageReceipt;

  completeAsyncPublicStageInitialization(mountPoints, options).catch((error) => {
    MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.ERROR;

    const failureReceipt = freeze({
      receiptType:
        'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_ASYNC_FAILURE',
      file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
      contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
      generatedAt: nowIso(),
      status: MODULE_STATE.status,
      errorName:
        error instanceof Error ? error.name : 'UnknownError',
      errorMessage:
        error instanceof Error ? error.message : String(error),
      staticLayer4ProjectionRetained: true,
      publicStageAdapter: true,
      readOnlyLayer4StatusProjection: true,
      runFunctionExecuted: false,
      replayExecuted: false,
      vectorRunnerExecuted: false,
      runtimeExecuted: false,
      canonicalDigestGenerated: false,
      replayComparison: false,
      validationClaim: false,
      productionClaim: false,
      visualPassClaim: false,
      matrixCollapse: false,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    MODULE_STATE.routeBootstrapReceipt = failureReceipt;

    setRouteClass(mountPoints.routeRoot, 'h-earth-3d-boot-error');
    writeText(mountPoints.statusNode, 'PUBLIC_STAGE_ASYNC_FAILURE');
    writeText(
      mountPoints.fallbackNode,
      `Public-stage adapter async completion failed: ${failureReceipt.errorMessage}`
    );
    writeJson(
      mountPoints.debug,
      failureReceipt,
      { maxDepth: 8, maxArrayLength: 120 }
    );

    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
      failureReceipt;
    globalThis.H_EARTH_3D_PUBLIC_STAGE_ASYNC_FAILURE =
      failureReceipt;
  });

  return immediateResult;
}

export function getRouteBootstrapStatus() {
  return buildRouteBootstrapStatus();
}

export function getRouteBootstrapReceipt() {
  if (!MODULE_STATE.routeBootstrapReceipt) {
    MODULE_STATE.routeBootstrapReceipt = buildRouteBootstrapReceipt();
  }

  return MODULE_STATE.routeBootstrapReceipt;
}

export function getLayer4StatusProjection() {
  if (!MODULE_STATE.layer4StatusProjection) {
    MODULE_STATE.layer4StatusProjection =
      buildStaticLayer4Projection(
        H_EARTH_3D_LAYER_4_STATUS.STATIC_METADATA_PROJECTED
      );
  }

  return MODULE_STATE.layer4StatusProjection;
}

export function getLayer4PublicStageReceipt() {
  if (!MODULE_STATE.layer4PublicStageReceipt) {
    MODULE_STATE.layer4PublicStageReceipt =
      buildLayer4PublicStageReceipt();
  }

  return MODULE_STATE.layer4PublicStageReceipt;
}

export function getPublicGroundConditionReadPayload() {
  return buildGroundConditionReadPayload(
    getTarget(MODULE_STATE.selectedTargetId)
  );
}

export function destroyHEarthRoute() {
  const previousReceipt = buildRouteBootstrapReceipt();

  MODULE_STATE.initialized = false;
  MODULE_STATE.status = H_EARTH_3D_PUBLIC_STAGE_STATUS.NOT_STARTED;
  MODULE_STATE.mountPoints = null;
  MODULE_STATE.routeBootstrapResult = null;

  return freeze({
    receiptType:
      'H_EARTH_3D_PUBLIC_STAGE_ADAPTER_DESTROY_RECEIPT',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    generatedAt: nowIso(),
    previousReceipt,
    domMutationClaim: false,
    layer4ExecutionClaim: false,
    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export const H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
  freeze({
    receiptType:
      'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT_STATIC_DESCRIPTOR',
    file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
    contractId: H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
    routeShellContractId:
      H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
    routeStyleContractId:
      H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

    publicStageAdapterDefined: true,
    publicEnvironmentHostAuthorized: true,
    visibleStageAuthorized: true,
    readOnlyLayer4StatusProjectionDefined: true,
    publicStageReceiptDefinitionDefined: true,
    diagnosticRouteHandoffDefined: true,

    layer4BridgeContract:
      H_EARTH_3D_LAYER_4_CONTRACTS.step012JContractId,

    moduleInitializationObserved:
      'runtime-observation-only-after-dynamic-import',
    runFunctionExecuted: false,
    replayExecuted: false,
    vectorRunnerExecuted: false,
    runtimeExecuted: false,
    canonicalDigestGenerated: false,
    replayComparison: false,

    validationClaim: false,
    productionClaim: false,
    visualPassClaim: false,
    matrixCollapse: false,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });

export const H_EARTH_3D_INDEX = freeze({
  id: 'H_EARTH_3D_INDEX',
  file: H_EARTH_3D_PUBLIC_ROUTE_FILE,
  route: H_EARTH_3D_PUBLIC_ROUTE,
  diagnosticRoute: H_EARTH_3D_DIAGNOSTIC_ROUTE,

  contractId:
    H_EARTH_3D_INDEX_BOOTSTRAP_CONTRACT_ID,
  routeShellContractId:
    H_EARTH_3D_ROUTE_SHELL_CONTRACT_ID,
  routeStyleContractId:
    H_EARTH_3D_ROUTE_STYLE_CONTRACT_ID,

  publicStageAdapter: true,
  readOnlyLayer4StatusProjection: true,
  publicEnvironmentHost: true,
  visibleStageAuthorized: true,

  layer4Contracts:
    H_EARTH_3D_LAYER_4_CONTRACTS,
  layer4ArchiveCustody:
    H_EARTH_3D_LAYER_4_ARCHIVE_CUSTODY,
  executionCeiling:
    H_EARTH_3D_PUBLIC_STAGE_EXECUTION_CEILING,
  boundaryFlags:
    H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
  mountIds:
    H_EARTH_3D_PUBLIC_MOUNT_IDS,
  targets:
    H_EARTH_3D_PUBLIC_TARGETS,

  initializeHEarthRoute,
  destroyHEarthRoute,
  getRouteBootstrapStatus,
  getRouteBootstrapReceipt,
  getLayer4StatusProjection,
  getLayer4PublicStageReceipt,
  getPublicGroundConditionReadPayload,

  receipt:
    H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT
});

export default H_EARTH_3D_INDEX;
