/*
  /showroom/globe/h-earth/index.js
  COMPLETE RENEWED FILE
  H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_032F_RENDERER_032D_COMPOSITOR_SYNC_v1
*/

import {
  H_EARTH_3D_CAPACITY,
  H_EARTH_3D_CAPACITY_RECEIPT,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  getCapacityReceipt
} from './capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT,
  H_EARTH_3D_ENVIRONMENT_RECEIPT,
  getEnvironmentReceipt
} from './environment.js';

import {
  H_EARTH_3D_RENDERER,
  H_EARTH_3D_RENDERER_RECEIPT,
  H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  H_EARTH_3D_RENDER_VOLUME_MODEL,
  H_EARTH_3D_RENDER_PORTS,
  mountHEarthRenderer,
  destroyHEarthRenderer,
  selectHEarthRenderInput,
  getRendererReceipt
} from './renderer.js';

import {
  H_EARTH_3D_COMPOSITOR,
  H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  H_EARTH_3D_COMPOSITOR_RECEIPT,
  H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
  getCompositorReceipt
} from './compositor.js';

import {
  H_EARTH_3D_CONTROLLER,
  H_EARTH_3D_CONTROLLER_RECEIPT,
  H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,
  H_EARTH_3D_INSPECTION_ACTION_ROUTING,
  H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE,
  H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE,
  H_EARTH_3D_CONTEXT_ONLY_BLOCK_RESPONSES,
  H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES,
  H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES,
  H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES,
  H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES,
  H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
  getSelectableTarget,
  getControllerTargetClassification,
  resolveInspectGroundControllerBridge,
  resolveGroundConditionReadBridge,
  getControllerReceipt
} from './controller.js';

export const H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT',
  file: '/showroom/globe/h-earth/index.js',
  sourceArtifactTitle: 'ROOM_1_SOURCE_CANON_FORMAL_LATTICE_EXPOSURE_PACKET_v1',
  sourceArtifactFinalMarker:
    'FORMAL_16X16_ADDRESS_FIELD_SOURCE_AUTHORITY_NOT_EXPOSED = RESOLVED_BY_PLAN_A',
  status: 'FORMAL_SOURCE_LATTICE_AUTHORITY_EXPOSED_DESCRIPTOR_ONLY',
  planAResolved: true,
  descriptorOnly: true,
  descriptorAddressFieldDefined: true,
  addressFieldAuthorized: true,
  addressFieldRuntimeActive: false,
  sourceLatticeAuthority: true,
  source256AddressFieldDescriptor: true,
  source16x16DescriptorAuthorityDefined: true,
  latticeShape: '16x16',
  rowCount: 16,
  columnCount: 16,
  addressCount: 256,
  boundary: Object.freeze({
    reportOnly: true,
    descriptorOnlySourceAuthority: true,
    runtimeLatticeActivation: false,
    active16x16RuntimeClaim: false,
    active256AddressRuntimeClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  })
});

export function getSourceCanonLatticeExposureReceipt() {
  return H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT;
}

export const H_EARTH_3D_INDEX_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_032F_RENDERER_032D_COMPOSITOR_SYNC_v1',
  renewedFrom:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029G_SOURCE_CANON_LATTICE_EXPOSURE_SYNC_v1',
  rendererCompatibilityTarget:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032D_OPTIMIZED_LATTICE_ADMISSION_RENDERER_WIRING_v1',
  compositorCompatibilityTarget:
    'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_032E_RENDERER_032D_PARENT_DESCRIPTOR_SYNC_v1',
  file: '/showroom/globe/h-earth/index.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  fileClass: 'ROUTE_BOOTSTRAP_DOM_CSS_3D_CANDIDATE_PREVIEW_ORCHESTRATOR',
  activationScope: 'AUTHORIZED_ROUTE_SIDE_CANDIDATE_ACTIVATION_DOM_CSS_3D_ONLY',
  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  renewalScope: Object.freeze({
    renderer032DMountReceiptConsumption: true,
    compositorParentDescriptorFrameConsumption: true,
    latticeSourceCanonMirrorPreserved: true,
    reportLayerEvidenceCompressionPreserved: true,
    compactBootstrapReceiptPreserved: true,
    advancedRawEvidenceBundlePreserved: true,
    noRenderingBehaviorInvented: true,
    noHtmlShellMutation: true,
    noCssMutation: true,
    latticeActivationAdded: false,
    active16x16RuntimeClaimAdded: false,
    active256AddressRuntimeClaimAdded: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false
  }),
  boundaryClaims: Object.freeze({
    mutatesGitHub: false,
    installsRoute: false,
    activatesWebGL: false,
    activatesCanvas: false,
    claimsFinalRenderer: false,
    claimsRendererPass: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    claimsOpenWorldTraversal: false,
    claimsSurvivalSimulation: false,
    claimsSwimming: false,
    claimsFluidSimulation: false,
    claimsManorInteriorAccess: false,
    claimsDistantTraversal: false,
    claimsLatticeActivation: false,
    claimsActive16x16Runtime: false,
    claimsActive256AddressRuntime: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS = Object.freeze({
  routeBootstrapOrchestrator: true,
  authorizedRouteSideCandidateActivationDomCss3dOnly: true,
  directDomControlBindingAllowedWithinCandidateBoundary: true,
  statusDomUpdateAllowedWithinCandidateBoundary: true,
  descriptorDisplayAllowedWithinCandidateBoundary: true,
  compactReportLayerEvidenceAllowedWithinCandidateBoundary: true,
  spatialReceiptExposureAllowedWithinCandidateBoundary: true,
  explicitAdvancedRawEvidenceBundleAllowedWithinCandidateBoundary: true,
  latticeScopeEvidenceReadingAllowedWithinCandidateBoundary: true,
  sourceCanonLatticeExposureReadingAllowedWithinCandidateBoundary: true,
  rendererMountOnlyIfCanonApiExists: true,
  aggregateRendererMountApiPreferred: true,
  namedRendererMountApiAllowed: true,
  noSpeculativeRendererApi: true,
  noInventedRendererApi: true,
  mountReceiptMustConfirmMounted: true,
  destroyReceiptMustConfirmDestroyed: true,
  runtimeFailureCodesRequiredForMountFailure: true,
  noThrowDoesNotEqualMountSuccess: true,
  noThrowDoesNotEqualDestroySuccess: true,
  repositoryMutation: false,
  unauthorizedRouteExpansion: false,
  webglActivation: false,
  canvasActivation: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  openWorldTraversalClaim: false,
  survivalSimulationClaim: false,
  swimmingClaim: false,
  fluidSimulationClaim: false,
  manorInteriorAccessClaim: false,
  distantTraversalClaim: false,
  gameplayExecutionClaim: false,
  latticeActivationClaim: false,
  active16x16LatticeClaim: false,
  active256AddressRuntimeClaim: false,
  matrixCollapse: false
});

export const H_EARTH_3D_INDEX_BOUND_CHAIN = Object.freeze({
  sourceCanonLatticeExposure: Object.freeze({
    file: '/showroom/globe/h-earth/index.js',
    aggregate: H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT,
    receipt: H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT
  }),
  capacity: Object.freeze({
    file: '/showroom/globe/h-earth/capacity.js',
    aggregate: H_EARTH_3D_CAPACITY,
    receipt: H_EARTH_3D_CAPACITY_RECEIPT
  }),
  environment: Object.freeze({
    file: '/showroom/globe/h-earth/environment.js',
    aggregate: H_EARTH_3D_ENVIRONMENT,
    receipt: H_EARTH_3D_ENVIRONMENT_RECEIPT
  }),
  renderer: Object.freeze({
    file: '/showroom/globe/h-earth/renderer.js',
    aggregate: H_EARTH_3D_RENDERER,
    candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
    renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
    renderPorts: H_EARTH_3D_RENDER_PORTS,
    boundaryFlags: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
    aggregateMountApiAvailable:
      typeof H_EARTH_3D_RENDERER?.mountHEarthRenderer === 'function',
    aggregateDestroyApiAvailable:
      typeof H_EARTH_3D_RENDERER?.destroyHEarthRenderer === 'function',
    namedMountApiAvailable: typeof mountHEarthRenderer === 'function',
    namedDestroyApiAvailable: typeof destroyHEarthRenderer === 'function',
    receipt: H_EARTH_3D_RENDERER_RECEIPT
  }),
  compositor: Object.freeze({
    file: '/showroom/globe/h-earth/compositor.js',
    aggregate: H_EARTH_3D_COMPOSITOR,
    composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
    boundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
    receipt: H_EARTH_3D_COMPOSITOR_RECEIPT
  }),
  controller: Object.freeze({
    file: '/showroom/globe/h-earth/controller.js',
    aggregate: H_EARTH_3D_CONTROLLER,
    targetRegistry: H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,
    boundaryFlags: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
    receipt: H_EARTH_3D_CONTROLLER_RECEIPT
  })
});

export const H_EARTH_3D_ROUTE_MOUNT_CONTRACT = Object.freeze({
  strictRequiredIds: Object.freeze({
    routeRoot: 'h-earth-3d-route-root',
    status: 'h-earth-3d-status',
    fallback: 'h-earth-3d-fallback'
  }),
  conditionallyRequiredIds: Object.freeze({
    rendererMount: 'h-earth-3d-renderer-mount'
  }),
  optionalIds: Object.freeze({
    hud: 'h-earth-3d-hud',
    inspectionPanel: 'h-earth-3d-inspection-panel',
    targetList: 'h-earth-3d-target-list',
    debug: 'h-earth-3d-debug',
    inspectGroundAction: 'h-earth-3d-action-inspect-ground'
  }),
  spatialDiagnosticIds: Object.freeze({
    spatialSummary: 'h-earth-3d-spatial-summary-payload',
    composedFrame: 'h-earth-3d-composed-frame-payload',
    compositorReceipt: 'h-earth-3d-compositor-receipt-payload',
    rendererPlacement: 'h-earth-3d-renderer-placement-payload',
    environmentPlacement: 'h-earth-3d-environment-placement-payload'
  }),
  rendererMountPolicy: Object.freeze({
    rendererMountNodeRequiredWhenRendererMountApiExists: true,
    mountReceiptRequiredForMountedStatus: true,
    noWebGLFallback: true,
    noCanvasFallback: true,
    noFakeRendererMount: true
  })
});

export const H_EARTH_3D_ROUTE_FAILURE_CODES = Object.freeze({
  MISSING_CAPACITY_RECEIPT: 'MISSING_CAPACITY_RECEIPT',
  MISSING_ENVIRONMENT_RECEIPT: 'MISSING_ENVIRONMENT_RECEIPT',
  MISSING_RENDERER_RECEIPT: 'MISSING_RENDERER_RECEIPT',
  MISSING_COMPOSITOR_RECEIPT: 'MISSING_COMPOSITOR_RECEIPT',
  MISSING_CONTROLLER_RECEIPT: 'MISSING_CONTROLLER_RECEIPT',
  MISSING_ROUTE_ROOT: 'MISSING_ROUTE_ROOT',
  MISSING_STATUS_NODE: 'MISSING_STATUS_NODE',
  MISSING_FALLBACK_NODE: 'MISSING_FALLBACK_NODE',
  MISSING_RENDERER_MOUNT_NODE: 'MISSING_RENDERER_MOUNT_NODE',
  MISSING_RENDERER_MOUNT_API: 'MISSING_RENDERER_MOUNT_API',
  RENDERER_MOUNT_FAILED: 'RENDERER_MOUNT_FAILED',
  RENDERER_DESTROY_FAILED: 'RENDERER_DESTROY_FAILED',
  BOOTSTRAP_FALLBACK_ACTIVE: 'BOOTSTRAP_FALLBACK_ACTIVE'
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS = Object.freeze({
  CHAIN_READY: 'CHAIN_READY',
  DOM_READY: 'DOM_READY',
  CONTROLLER_READY: 'CONTROLLER_READY',
  RENDERER_MOUNT_READY: 'RENDERER_MOUNT_READY',
  BOOTSTRAP_READY_CANDIDATE_ONLY: 'BOOTSTRAP_READY_CANDIDATE_ONLY',
  BOOTSTRAP_READY_DESCRIPTOR_ONLY_NO_RENDERER_MOUNT_API:
    'BOOTSTRAP_READY_DESCRIPTOR_ONLY_NO_RENDERER_MOUNT_API',
  BOOTSTRAP_FALLBACK_ACTIVE: 'BOOTSTRAP_FALLBACK_ACTIVE',
  BOOTSTRAP_NOT_STARTED: 'BOOTSTRAP_NOT_STARTED'
});

export const H_EARTH_3D_LATTICE_SCOPE_STATUS = Object.freeze({
  SCENE_SCOPED_LATTICE_NOT_EXPOSED: 'SCENE_SCOPED_LATTICE_NOT_EXPOSED',
  LATTICE_SCOPE_HINTS_PRESENT: 'LATTICE_SCOPE_HINTS_PRESENT',
  LATTICE_SCOPE_RECEIPT_EXPOSED: 'LATTICE_SCOPE_RECEIPT_EXPOSED',
  SCENE_SCOPED_16X16_LATTICE_EXPOSED:
    'SCENE_SCOPED_16X16_LATTICE_EXPOSED',
  FORMAL_SOURCE_LATTICE_AUTHORITY_EXPOSED_DESCRIPTOR_ONLY:
    'FORMAL_SOURCE_LATTICE_AUTHORITY_EXPOSED_DESCRIPTOR_ONLY'
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_ORDER = Object.freeze([
  'import capacity',
  'import environment',
  'import renderer',
  'import compositor',
  'import controller',
  'verify receipts/contracts',
  'resolve DOM mount points',
  'initialize route status',
  'mount DOM/CSS-3D candidate renderer only if canon renderer API exists',
  'read renderer mount receipt before declaring mounted',
  'bind safe inspection controls',
  'expose compact route receipt/status',
  'expose compact spatial diagnostics',
  'preserve advanced raw evidence bundle behind explicit function',
  'fail safely if any required dependency is missing'
]);

const H_EARTH_SCENE_IDENTITY = Object.freeze({
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  mirrorManorStatus: 'STRATEGICALLY_IMPLIED_NOT_ROUTE_CANON_NAMED'
});

const H_EARTH_EXPECTED_ENVIRONMENT_TOKENS = Object.freeze([
  'shoreline',
  'wet',
  'sand',
  'dry',
  'foam',
  'water',
  'rock',
  'tide',
  'air',
  'haze',
  'manor',
  'distant'
]);

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeSerialize(value, options = {}) {
  const maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 6;
  const maxArrayLength = Number.isFinite(options.maxArrayLength)
    ? options.maxArrayLength
    : 80;
  const seen = new WeakSet();

  function visit(input, depth) {
    if (input === null) return null;
    const type = typeof input;

    if (type === 'string' || type === 'number' || type === 'boolean') return input;
    if (type === 'bigint') return String(input);
    if (type === 'undefined') return null;
    if (type === 'function') return `[Function ${input.name || 'anonymous'}]`;
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
          key === 'mountNode' ||
          key === 'routeRoot' ||
          key === 'statusNode' ||
          key === 'fallbackNode' ||
          key === 'rendererMount'
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

function writeText(node, value) {
  if (!node) return false;
  node.textContent = String(value);
  return true;
}

function writeJson(node, value, options = {}) {
  if (!node) return false;
  node.textContent = JSON.stringify(safeSerialize(value, options), null, 2);
  return true;
}

function addClass(node, className) {
  if (!node?.classList) return false;
  node.classList.add(className);
  return true;
}

function removeClass(node, className) {
  if (!node?.classList) return false;
  node.classList.remove(className);
  return true;
}

function lowerSerialized(value) {
  try {
    return JSON.stringify(safeSerialize(value, { maxDepth: 5, maxArrayLength: 80 })).toLowerCase();
  } catch (_error) {
    return '';
  }
}

function getObjectKeys(value) {
  return value && typeof value === 'object' ? Object.keys(value) : [];
}

function freezeStatus(status) {
  return Object.freeze({
    timestamp: status.timestamp || null,
    chainReady: status.chainReady === true,
    domReady: status.domReady === true,
    controllerReady: status.controllerReady === true,
    rendererMountReady: status.rendererMountReady === true,
    bootstrapReadyCandidateOnly: status.bootstrapReadyCandidateOnly === true,
    bootstrapReadyDescriptorOnlyNoRendererMountApi:
      status.bootstrapReadyDescriptorOnlyNoRendererMountApi === true,
    bootstrapFallbackActive: status.bootstrapFallbackActive === true,
    statusLevel:
      status.statusLevel ||
      H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_NOT_STARTED,
    failureCodes: Object.freeze(asArray(status.failureCodes)),
    warningCodes: Object.freeze(asArray(status.warningCodes)),
    rendererMountApiConfirmed: status.rendererMountApiConfirmed === true,
    rendererDestroyApiConfirmed: status.rendererDestroyApiConfirmed === true,
    rendererMountAttempted: status.rendererMountAttempted === true,
    rendererMounted: status.rendererMounted === true,
    rendererMountSkipped: status.rendererMountSkipped === true,
    rendererMountSkipReason: status.rendererMountSkipReason || null,
    rendererMountError: status.rendererMountError || null,
    rendererMountReceipt: status.rendererMountReceipt || null,
    rendererDestroyAttempted: status.rendererDestroyAttempted === true,
    rendererDestroyed: status.rendererDestroyed === true,
    rendererDestroyError: status.rendererDestroyError || null,
    rendererDestroyReceipt: status.rendererDestroyReceipt || null,
    rendererApiSource: status.rendererApiSource || null,
    rendererDestroyApiSource: status.rendererDestroyApiSource || null,
    routeRootFound: status.routeRootFound === true,
    statusNodeFound: status.statusNodeFound === true,
    fallbackNodeFound: status.fallbackNodeFound === true,
    rendererMountNodeFound: status.rendererMountNodeFound === true,
    targetListBound: status.targetListBound === true,
    inspectGroundControlBound: status.inspectGroundControlBound === true,
    debugStatusExposed: status.debugStatusExposed === true,
    spatialDiagnosticsExposed: status.spatialDiagnosticsExposed === true,
    advancedRawEvidenceExposed: status.advancedRawEvidenceExposed === true,
    latticeScopeStatusExposed: status.latticeScopeStatusExposed === true,
    selectedObjectId:
      status.selectedObjectId ||
      H_EARTH_3D_CONTROLLER_RECEIPT?.primaryInspectionTarget ||
      'OBJ_002_FOREGROUND_WET_SAND',
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

let latestRouteBootstrapStatus = freezeStatus({
  statusLevel: H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_NOT_STARTED,
  selectedObjectId: 'OBJ_002_FOREGROUND_WET_SAND'
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS = latestRouteBootstrapStatus;

export function getRouteBootstrapStatus() {
  return latestRouteBootstrapStatus;
}

function setRouteBootstrapStatus(nextStatus) {
  latestRouteBootstrapStatus = freezeStatus({
    ...latestRouteBootstrapStatus,
    ...nextStatus,
    timestamp: new Date().toISOString()
  });

  return latestRouteBootstrapStatus;
}

export function getRendererMountApi() {
  if (typeof H_EARTH_3D_RENDERER?.mountHEarthRenderer === 'function') {
    return H_EARTH_3D_RENDERER.mountHEarthRenderer;
  }

  if (typeof mountHEarthRenderer === 'function') {
    return mountHEarthRenderer;
  }

  return null;
}

export function getRendererMountApiSource() {
  if (typeof H_EARTH_3D_RENDERER?.mountHEarthRenderer === 'function') {
    return 'AGGREGATE_PROPERTY_H_EARTH_3D_RENDERER.mountHEarthRenderer';
  }

  if (typeof mountHEarthRenderer === 'function') {
    return 'NAMED_EXPORT_mountHEarthRenderer';
  }

  return null;
}

export function getRendererDestroyApi() {
  if (typeof H_EARTH_3D_RENDERER?.destroyHEarthRenderer === 'function') {
    return H_EARTH_3D_RENDERER.destroyHEarthRenderer;
  }

  if (typeof destroyHEarthRenderer === 'function') {
    return destroyHEarthRenderer;
  }

  return null;
}

export function getRendererDestroyApiSource() {
  if (typeof H_EARTH_3D_RENDERER?.destroyHEarthRenderer === 'function') {
    return 'AGGREGATE_PROPERTY_H_EARTH_3D_RENDERER.destroyHEarthRenderer';
  }

  if (typeof destroyHEarthRenderer === 'function') {
    return 'NAMED_EXPORT_destroyHEarthRenderer';
  }

  return null;
}

export function isRendererMountReceiptMounted(receipt) {
  return receipt?.rendererMounted === true || receipt?.mounted === true;
}

export function isRendererDestroyReceiptDestroyed(receipt) {
  return receipt?.destroyed === true;
}

export function verifyHEarthRouteBoundChain() {
  const checks = Object.freeze({
    sourceCanonLatticeExposureReceiptPresent:
      Boolean(getSourceCanonLatticeExposureReceipt()),
    capacityReceiptPresent: Boolean(getCapacityReceipt()),
    environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
    rendererReceiptPresent: Boolean(getRendererReceipt()),
    compositorReceiptPresent: Boolean(getCompositorReceipt()),
    controllerReceiptPresent: Boolean(getControllerReceipt()),
    capacityAggregatePresent: Boolean(H_EARTH_3D_CAPACITY),
    environmentAggregatePresent: Boolean(H_EARTH_3D_ENVIRONMENT),
    rendererAggregatePresent: Boolean(H_EARTH_3D_RENDERER),
    compositorAggregatePresent: Boolean(H_EARTH_3D_COMPOSITOR),
    controllerAggregatePresent: Boolean(H_EARTH_3D_CONTROLLER),
    rendererMountApiPresent: Boolean(getRendererMountApi()),
    rendererDestroyApiPresent: Boolean(getRendererDestroyApi()),
    rendererMountApiSource: getRendererMountApiSource(),
    rendererDestroyApiSource: getRendererDestroyApiSource(),
    rendererInputSelectorPresent: typeof selectHEarthRenderInput === 'function',
    composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
    candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE)
  });

  const failureCodes = [];
  if (!checks.capacityReceiptPresent) failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_CAPACITY_RECEIPT);
  if (!checks.environmentReceiptPresent) failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_ENVIRONMENT_RECEIPT);
  if (!checks.rendererReceiptPresent) failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_RENDERER_RECEIPT);
  if (!checks.compositorReceiptPresent) failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_COMPOSITOR_RECEIPT);
  if (!checks.controllerReceiptPresent) failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_CONTROLLER_RECEIPT);

  return Object.freeze({
    checks,
    chainReady: failureCodes.length === 0,
    failureCodes: Object.freeze(failureCodes),
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function resolveHEarthRouteMountPoints(rootDocument = globalThis.document) {
  if (!rootDocument || typeof rootDocument.getElementById !== 'function') {
    return Object.freeze({
      documentAvailable: false,
      routeRoot: null,
      rendererMount: null,
      statusNode: null,
      fallbackNode: null,
      hud: null,
      inspectionPanel: null,
      targetList: null,
      debug: null,
      inspectGroundAction: null,
      spatialSummary: null,
      composedFramePayload: null,
      compositorReceiptPayload: null,
      rendererPlacementPayload: null,
      environmentPlacementPayload: null,
      strictRequiredFound: false,
      rendererMountFound: false,
      missingStrictRequiredIds: Object.freeze([
        H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.routeRoot,
        H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.status,
        H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.fallback
      ]),
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  const strictIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds;
  const conditionalIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.conditionallyRequiredIds;
  const optionalIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.optionalIds;
  const spatialIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.spatialDiagnosticIds;

  const routeRoot = rootDocument.getElementById(strictIds.routeRoot);
  const statusNode = rootDocument.getElementById(strictIds.status);
  const fallbackNode = rootDocument.getElementById(strictIds.fallback);
  const rendererMount = rootDocument.getElementById(conditionalIds.rendererMount);

  const missingStrictRequiredIds = [];
  if (!routeRoot) missingStrictRequiredIds.push(strictIds.routeRoot);
  if (!statusNode) missingStrictRequiredIds.push(strictIds.status);
  if (!fallbackNode) missingStrictRequiredIds.push(strictIds.fallback);

  return Object.freeze({
    documentAvailable: true,
    routeRoot,
    rendererMount,
    statusNode,
    fallbackNode,
    hud: rootDocument.getElementById(optionalIds.hud),
    inspectionPanel: rootDocument.getElementById(optionalIds.inspectionPanel),
    targetList: rootDocument.getElementById(optionalIds.targetList),
    debug: rootDocument.getElementById(optionalIds.debug),
    inspectGroundAction: rootDocument.getElementById(optionalIds.inspectGroundAction),
    spatialSummary: rootDocument.getElementById(spatialIds.spatialSummary),
    composedFramePayload: rootDocument.getElementById(spatialIds.composedFrame),
    compositorReceiptPayload: rootDocument.getElementById(spatialIds.compositorReceipt),
    rendererPlacementPayload: rootDocument.getElementById(spatialIds.rendererPlacement),
    environmentPlacementPayload: rootDocument.getElementById(spatialIds.environmentPlacement),
    strictRequiredFound: missingStrictRequiredIds.length === 0,
    rendererMountFound: Boolean(rendererMount),
    missingStrictRequiredIds: Object.freeze(missingStrictRequiredIds),
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

function summarizeReceiptHeader(receipt, fallback = {}) {
  if (!receipt) return null;

  return Object.freeze({
    receiptType: receipt.receiptType || fallback.receiptType || null,
    status: receipt.status || fallback.status || null,
    contractId: receipt.contractId || fallback.contractId || null,
    file: receipt.file || fallback.file || null,
    matrix: receipt.matrix || fallback.matrix || 'H-Earth',
    matrixRole: receipt.matrixRole || fallback.matrixRole || 'Ground-View Matrix',
    activeCell: receipt.activeCell || fallback.activeCell || 'H_EARTH_GROUND_CELL_001',
    sceneIdentity:
      receipt.sceneIdentity ||
      fallback.sceneIdentity ||
      'earth-water-air-survival-shoreline-manor',
    warningCodes: Object.freeze(asArray(receipt.warningCodes)),
    failureCodes: Object.freeze(asArray(receipt.failureCodes))
  });
}

function summarizeRendererMountReceipt(receipt) {
  if (!receipt) return null;

  return Object.freeze({
    receiptType: receipt.receiptType || null,
    contractId: receipt.contractId || null,
    rendererMounted: receipt.rendererMounted === true,
    mounted: receipt.mounted === true,
    mountAttempted: receipt.mountAttempted === true,
    mountNodeAccepted: receipt.mountNodeAccepted === true,
    renderRootCreated: receipt.renderRootCreated === true,
    layerContainerCount: receipt.layerContainerCount ?? receipt.layerCount ?? null,
    selectedRenderInputSource: receipt.selectedRenderInputSource || null,
    sourceDescriptorType: receipt.sourceDescriptorType || null,
    rawSourceNodeCount: receipt.rawSourceNodeCount ?? null,
    usedComposedFrame: receipt.usedComposedFrame === true,
    usedRenderSceneFallback: receipt.usedRenderSceneFallback === true,
    geometryPortUsed: receipt.geometryPortUsed === true,
    geometryExpansionApplied: receipt.geometryExpansionApplied === true,
    geometryExpansionSkippedBecauseAlreadyExpanded:
      receipt.geometryExpansionSkippedBecauseAlreadyExpanded === true,
    geometrySourceNodeCount: receipt.geometrySourceNodeCount ?? null,
    geometryExpandedNodeCount: receipt.geometryExpandedNodeCount ?? null,
    geometryReturnedNodeCount: receipt.geometryReturnedNodeCount ?? null,
    geometryParentNodeCount: receipt.geometryParentNodeCount ?? null,
    geometryChildNodeCount: receipt.geometryChildNodeCount ?? null,
    landscapeLatticeBundleForwarded:
      receipt.landscapeLatticeBundleForwarded === true,
    descriptorLandscapeLatticeAdmitted:
      receipt.descriptorLandscapeLatticeAdmitted === true,
    geometryLatticeAdmissionStatus:
      receipt.geometryLatticeAdmissionStatus || null,
    geometryLatticeAdmissionFailed:
      receipt.geometryLatticeAdmissionFailed === true,
    mountedNodeCount: receipt.mountedNodeCount ?? null,
    objectNodeCount: receipt.objectNodeCount ?? null,
    placedNodeCount: receipt.placedNodeCount ?? null,
    skippedNodeCount: receipt.skippedNodeCount ?? null,
    transformDescriptorAppliedCount:
      receipt.transformDescriptorAppliedCount ?? null,
    primitiveGeometryAppliedCount:
      receipt.primitiveGeometryAppliedCount ?? null,
    visualGrammarReadyCount: receipt.visualGrammarReadyCount ?? null,
    materialPortUsed: receipt.materialPortUsed === true,
    layerPortUsed: receipt.layerPortUsed === true,
    nodeFactoryPortUsed: receipt.nodeFactoryPortUsed === true,
    warningCodes: Object.freeze(asArray(receipt.warningCodes)),
    failureCodes: Object.freeze(asArray(receipt.failureCodes)),
    claimBoundaryPreserved: receipt.claimBoundaryPreserved === true,
    boundaryPresent: Boolean(receipt.boundary)
  });
}

function extractComposedNodes(frame) {
  if (!frame) return null;
  if (Array.isArray(frame.composedNodes)) return frame.composedNodes;
  if (Array.isArray(frame.nodes)) return frame.nodes;
  if (Array.isArray(frame.candidateNodes)) return frame.candidateNodes;
  return null;
}

function summarizeComposedFrame(frame) {
  if (!frame) return null;

  const composedNodes = extractComposedNodes(frame);

  return Object.freeze({
    framePresent: true,
    id: frame.id || frame.frameId || null,
    matrix: frame.matrix || 'H-Earth',
    matrixRole: frame.matrixRole || 'Ground-View Matrix',
    sceneIdentity: frame.sceneIdentity || 'earth-water-air-survival-shoreline-manor',
    primaryFocusObjectId:
      frame.primaryFocusObjectId ||
      frame.focusPriority?.primaryFocusObjectId ||
      H_EARTH_3D_COMPOSITOR_RECEIPT?.primaryFocusObjectId ||
      null,
    composedNodeCount:
      frame.composedNodeCount ??
      frame.nodeCount ??
      composedNodes?.length ??
      H_EARTH_3D_COMPOSITOR_RECEIPT?.composedNodeCount ??
      null,
    cameraFrameResolved: Boolean(frame.cameraFrame),
    depthCompositionResolved: Boolean(frame.depthComposition),
    layerCompositionResolved: Boolean(frame.layerComposition),
    focusPriorityResolved: Boolean(frame.focusPriority),
    contextCompositionResolved: Boolean(frame.contextComposition),
    viewportFitResolved: Boolean(frame.viewportFit),
    compositionPressureClass:
      frame.compositionPressure?.pressureClass ||
      H_EARTH_3D_COMPOSITOR_RECEIPT?.compositionPressureClass ||
      null,
    composedNodeDigest: Array.isArray(composedNodes)
      ? composedNodes.slice(0, 24).map((node) =>
          Object.freeze({
            nodeId: node.nodeId || node.sourceNodeId || node.id || null,
            sourceNodeId: node.sourceNodeId || null,
            objectId: node.objectId || null,
            label: node.label || node.objectLabel || null,
            layerId: node.layerId || null,
            primitiveType: node.primitiveType || null,
            materialKey: node.materialKey || null,
            normalizedDepth: node.normalizedDepth ?? null,
            depthClass: node.depthClass || null,
            primaryDepthClass: node.primaryDepthClass || null,
            viewportOverflowClass: node.viewportOverflowClass || null,
            primitiveGeometryPresent: Boolean(node.primitiveGeometry),
            cssTransformDescriptorPresent: Boolean(node.cssTransformDescriptor)
          })
        )
      : null,
    boundaryPresent: Boolean(frame.boundary || H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS)
  });
}

function summarizeCompositorReceipt(receipt = getCompositorReceipt()) {
  if (!receipt) return null;

  return Object.freeze({
    ...summarizeReceiptHeader(receipt),
    sourceCandidateRenderNodeCount:
      receipt.sourceCandidateRenderNodeCount ?? null,
    composedNodeCount: receipt.composedNodeCount ?? null,
    cameraFrameResolved: receipt.cameraFrameResolved ?? null,
    depthCompositionResolved: receipt.depthCompositionResolved ?? null,
    layerCompositionResolved: receipt.layerCompositionResolved ?? null,
    focusPriorityResolved: receipt.focusPriorityResolved ?? null,
    contextCompositionResolved: receipt.contextCompositionResolved ?? null,
    viewportFitResolved: receipt.viewportFitResolved ?? null,
    nodeBudgetCompositionResolved:
      receipt.nodeBudgetCompositionResolved ?? null,
    composedCandidateFrameResolved:
      receipt.composedCandidateFrameResolved ?? null,
    compositionPressureClass: receipt.compositionPressureClass || null,
    primaryFocusObjectId: receipt.primaryFocusObjectId || null,
    primaryInspectionTargetPreserved:
      receipt.primaryInspectionTargetPreserved ?? null,
    matrixSeparationPreserved: receipt.matrixSeparationPreserved ?? null,
    boundaryPresent: Boolean(receipt.boundary)
  });
}

function summarizeEnvironmentPlacement(receipt = getEnvironmentReceipt()) {
  if (!receipt) return null;

  const serialized = lowerSerialized(receipt);
  const detectedSceneTokens = H_EARTH_EXPECTED_ENVIRONMENT_TOKENS.filter((token) =>
    serialized.includes(token)
  );

  return Object.freeze({
    ...summarizeReceiptHeader(receipt),
    resolvedObjects: receipt.resolvedObjects ?? null,
    resolvedZones: receipt.resolvedZones ?? null,
    resolvedInspectableAnchors: receipt.resolvedInspectableAnchors ?? null,
    resolvedContextOnlyGuards: receipt.resolvedContextOnlyGuards ?? null,
    resolvedMaterialChannels: receipt.resolvedMaterialChannels ?? null,
    resolvedPrimitiveLinks: receipt.resolvedPrimitiveLinks ?? null,
    environmentCoverageRatio: receipt.environmentCoverageRatio ?? null,
    detectedSceneTokens: Object.freeze(detectedSceneTokens),
    expectedSceneTokens: H_EARTH_EXPECTED_ENVIRONMENT_TOKENS,
    firstAction: receipt.firstAction || 'Inspect Ground',
    firstReadout: receipt.firstReadout || 'Ground Condition Read',
    firstReceipt: receipt.firstReceipt || 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    boundaryPresent: Boolean(receipt.boundary)
  });
}

function summarizeRendererReceipt(receipt = getRendererReceipt()) {
  if (!receipt) return null;

  return Object.freeze({
    ...summarizeReceiptHeader(receipt),
    candidateRenderSceneParentDescriptorsOnly:
      receipt.candidateRenderSceneParentDescriptorsOnly ?? null,
    geometryExpansionAfterCompositorHandoffOnly:
      receipt.geometryExpansionAfterCompositorHandoffOnly ?? null,
    alreadyExpandedInputGuardDefined:
      receipt.alreadyExpandedInputGuardDefined ?? null,
    createsDomCss3DCandidateNodes:
      receipt.createsDomCss3DCandidateNodes ?? null,
    mountsCandidateDomDescriptors:
      receipt.mountsCandidateDomDescriptors ?? null,
    expandsCandidateGeometryDescriptorsAtMountOnly:
      receipt.expandsCandidateGeometryDescriptorsAtMountOnly ?? null,
    descriptorLandscapeLatticeAdmitted:
      receipt.descriptorLandscapeLatticeAdmitted ?? null,
    boundaryPresent: Boolean(receipt.boundary)
  });
}

function summarizeRendererPlacement(status = latestRouteBootstrapStatus) {
  const candidateScene = H_EARTH_3D_CANDIDATE_RENDER_SCENE;
  const nodes = Array.isArray(candidateScene?.nodes) ? candidateScene.nodes : [];

  return Object.freeze({
    purpose:
      'Compact renderer placement summary for report-layer break-location classification.',
    rendererReceiptSummary: summarizeRendererReceipt(getRendererReceipt()),
    renderVolumeModelPresent: Boolean(H_EARTH_3D_RENDER_VOLUME_MODEL),
    renderPortsPresent: Boolean(H_EARTH_3D_RENDER_PORTS),
    candidateRenderScenePresent: Boolean(candidateScene),
    candidateRenderSceneNodeCount:
      candidateScene?.nodeCount ?? candidateScene?.sourceNodeCount ?? nodes.length ?? null,
    candidateRenderSceneParentDescriptorsOnly:
      candidateScene?.candidateRenderSceneParentDescriptorsOnly === true,
    mountedReceiptSummary: summarizeRendererMountReceipt(status.rendererMountReceipt),
    rendererTransformDigest: nodes.slice(0, 24).map((node) =>
      Object.freeze({
        nodeId: node.nodeId || null,
        objectId: node.objectId || null,
        label: node.label || node.objectLabel || null,
        layerId: node.layerId || null,
        primitiveType: node.primitiveType || null,
        materialKey: node.materialKey || null,
        landscapeClassName: node.landscapeClassName || null,
        primitiveClassName: node.primitiveClassName || null,
        renderWidthPx: node.renderWidthPx ?? null,
        renderHeightPx: node.renderHeightPx ?? null,
        renderDepthPx: node.renderDepthPx ?? null,
        normalizedDepth: node.normalizedDepth ?? null,
        depthClass: node.depthClass || null,
        primaryDepthClass: node.primaryDepthClass || null,
        cssTransformPresent: Boolean(node.cssTransformDescriptor?.cssTransform),
        landscapeProjectionApplied:
          node.cssTransformDescriptor?.landscapeProjectionApplied ?? null
      })
    ),
    renderBoundaryFlagsPresent: Boolean(H_EARTH_3D_RENDER_BOUNDARY_FLAGS)
  });
}

function getLatticeCandidateObjects() {
  return Object.freeze([
    getSourceCanonLatticeExposureReceipt(),
    H_EARTH_3D_INDEX_BOUND_CHAIN?.sourceCanonLatticeExposure?.receipt,
    H_EARTH_3D_CAPACITY?.latticeScope,
    H_EARTH_3D_CAPACITY?.sceneLattice,
    H_EARTH_3D_CAPACITY?.macroEnvironmentLattice,
    getCapacityReceipt()?.latticeScope,
    getCapacityReceipt()?.sceneLattice,
    H_EARTH_3D_ENVIRONMENT?.latticeScope,
    H_EARTH_3D_ENVIRONMENT?.sceneLattice,
    getEnvironmentReceipt()?.latticeScope,
    getRendererReceipt()?.latticeScope,
    getCompositorReceipt()?.latticeScope
  ].filter(Boolean));
}

function detectLatticeHints() {
  const combined = [
    lowerSerialized(getSourceCanonLatticeExposureReceipt()),
    lowerSerialized(H_EARTH_3D_CAPACITY),
    lowerSerialized(getCapacityReceipt()),
    lowerSerialized(H_EARTH_3D_ENVIRONMENT),
    lowerSerialized(getEnvironmentReceipt())
  ].join('\n');

  const tokens = Object.freeze({
    lattice: combined.includes('lattice'),
    sixteenBySixteen:
      combined.includes('16x16') ||
      combined.includes('16×16') ||
      combined.includes('"rowcount":16') ||
      combined.includes('"columncount":16'),
    twoHundredFiftySix:
      combined.includes('256') ||
      combined.includes('"addresscount":256'),
    addressField:
      combined.includes('addressfield') ||
      combined.includes('address field') ||
      combined.includes('descriptoraddressfielddefined')
  });

  return Object.freeze({
    hintsPresent: Boolean(
      tokens.lattice ||
      tokens.sixteenBySixteen ||
      tokens.twoHundredFiftySix ||
      tokens.addressField
    ),
    tokens
  });
}

export function summarizeHEarthLatticeScope() {
  const latticeCandidates = getLatticeCandidateObjects();
  const hints = detectLatticeHints();

  const formalLatticeObject =
    latticeCandidates.find((candidate) => {
      const serialized = lowerSerialized(candidate);
      return (
        serialized.includes('formal_source_lattice_authority_exposed_descriptor_only') ||
        serialized.includes('sourcelatticeauthority') ||
        serialized.includes('source256addressfielddescriptor') ||
        serialized.includes('descriptoraddressfielddefined') ||
        serialized.includes('addressfieldauthorized') ||
        serialized.includes('16x16') ||
        serialized.includes('256')
      );
    }) || null;

  const formalText = lowerSerialized(formalLatticeObject);

  const has16x16 =
    formalText.includes('16x16') ||
    formalText.includes('16×16') ||
    formalText.includes('"rowcount":16') ||
    formalText.includes('"columncount":16');

  const has256 =
    formalText.includes('256') || formalText.includes('"addresscount":256');

  const hasAddressField =
    formalText.includes('addressfield') ||
    formalText.includes('address field') ||
    formalText.includes('addressfieldauthorized') ||
    formalText.includes('descriptoraddressfielddefined');

  const sourceCanonResolved =
    formalText.includes('resolved_by_plan_a') ||
    formalText.includes('planaresolved') ||
    formalText.includes('formal_source_lattice_authority_exposed_descriptor_only');

  let status = H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_LATTICE_NOT_EXPOSED;

  if (formalLatticeObject && sourceCanonResolved && has16x16 && has256 && hasAddressField) {
    status =
      H_EARTH_3D_LATTICE_SCOPE_STATUS
        .FORMAL_SOURCE_LATTICE_AUTHORITY_EXPOSED_DESCRIPTOR_ONLY;
  } else if (formalLatticeObject && has16x16 && has256) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_16X16_LATTICE_EXPOSED;
  } else if (formalLatticeObject) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.LATTICE_SCOPE_RECEIPT_EXPOSED;
  } else if (hints.hintsPresent) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.LATTICE_SCOPE_HINTS_PRESENT;
  }

  return Object.freeze({
    receiptType: 'H_EARTH_3D_LATTICE_SCOPE_REPORT_SOURCE',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    status,
    ...H_EARTH_SCENE_IDENTITY,
    strategicRule:
      'The scene scopes the lattice. The lattice makes the scene addressable.',
    latticeScopeEvidencePresent: Boolean(formalLatticeObject),
    latticeHintEvidencePresent: hints.hintsPresent,
    formal16x16EvidencePresent: Boolean(has16x16 && has256),
    addressField: Boolean(hasAddressField),
    sourceLatticeAuthority:
      Boolean(sourceCanonResolved || formalText.includes('sourcelatticeauthority')),
    source256AddressFieldDescriptor: Boolean(has256),
    sourceCanonExposureArtifactPresent: Boolean(sourceCanonResolved),
    candidateEvidenceObjectCount: latticeCandidates.length,
    evidenceSummary: formalLatticeObject
      ? Object.freeze({
          keys: Object.freeze(getObjectKeys(formalLatticeObject)),
          has16x16,
          has256,
          hasAddressField,
          sourceCanonResolved,
          compactEvidence: safeSerialize(formalLatticeObject, {
            maxDepth: 4,
            maxArrayLength: 32
          })
        })
      : null,
    hintSummary: hints,
    boundary: Object.freeze({
      reportOnly: true,
      latticeActivationClaim: false,
      runtimeLatticeActivation: false,
      active16x16RuntimeClaim: false,
      active256AddressRuntimeClaim: false,
      matrixCollapse: false
    })
  });
}

export function getLatticeScopeReceipt() {
  return summarizeHEarthLatticeScope();
}

export function buildHEarthOperationalReportSourceSummary(status = latestRouteBootstrapStatus) {
  const latticeScopeSummary = summarizeHEarthLatticeScope();

  return Object.freeze({
    receiptType: 'H_EARTH_3D_OPERATIONAL_REPORT_SOURCE_SUMMARY',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    status: status.statusLevel,
    generatedAt: new Date().toISOString(),
    ...H_EARTH_SCENE_IDENTITY,
    routeReady: Object.freeze({
      chainReady: status.chainReady,
      domReady: status.domReady,
      controllerReady: status.controllerReady,
      rendererMountReady: status.rendererMountReady,
      bootstrapReadyCandidateOnly: status.bootstrapReadyCandidateOnly,
      bootstrapReadyDescriptorOnlyNoRendererMountApi:
        status.bootstrapReadyDescriptorOnlyNoRendererMountApi,
      bootstrapFallbackActive: status.bootstrapFallbackActive,
      failureCodes: status.failureCodes,
      warningCodes: status.warningCodes
    }),
    evidenceAvailability: Object.freeze({
      sourceCanonLatticeExposureReceiptPresent:
        Boolean(getSourceCanonLatticeExposureReceipt()),
      capacityReceiptPresent: Boolean(getCapacityReceipt()),
      environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
      rendererReceiptPresent: Boolean(getRendererReceipt()),
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      controllerReceiptPresent: Boolean(getControllerReceipt()),
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
      candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE),
      rendererMountReceiptPresent: Boolean(status.rendererMountReceipt),
      latticeScopeEvidencePresent: latticeScopeSummary.latticeScopeEvidencePresent,
      formal16x16EvidencePresent: latticeScopeSummary.formal16x16EvidencePresent,
      sourceLatticeAuthority: latticeScopeSummary.sourceLatticeAuthority,
      source256AddressFieldDescriptor:
        latticeScopeSummary.source256AddressFieldDescriptor,
      advancedRawEvidenceBundleAvailable: true
    }),
    sourceCanonLatticeExposureSummary:
      getSourceCanonLatticeExposureReceipt(),
    latticeScopeSummary,
    environmentSummary: summarizeEnvironmentPlacement(getEnvironmentReceipt()),
    compositorSummary: summarizeCompositorReceipt(getCompositorReceipt()),
    composedFrameSummary: summarizeComposedFrame(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
    rendererMountSummary: summarizeRendererMountReceipt(status.rendererMountReceipt),
    rendererPlacementSummary: summarizeRendererPlacement(status),
    actionBridgeSummary: Object.freeze({
      selectedObjectId: status.selectedObjectId,
      selectedObjectPresent: Boolean(getSelectableTarget(status.selectedObjectId)),
      classification:
        getControllerTargetClassification(status.selectedObjectId) || null,
      action: 'Inspect Ground',
      readout: 'Ground Condition Read',
      receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      descriptorOnly: true,
      runtimeActionExecutionClaim: false,
      receiptCreationClaim: false
    }),
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function buildHEarthSpatialDiagnosticReceipt(status = latestRouteBootstrapStatus) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_RECEIPT_COMPACT',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_INDEX_CONTRACT.renewedFrom,
    status: status.statusLevel,
    purpose:
      'Compact report-layer evidence source for break-location classification without embedding full raw receipt trees.',
    reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',
    currentDiagnosticQuestion:
      'Which lane owns the next break: source-canon, environment, compositor, geometry, renderer, CSS, action bridge, or boundary?',
    reportSourceSummary: buildHEarthOperationalReportSourceSummary(status),
    rawEvidencePolicy: Object.freeze({
      defaultReceiptIsCompact: true,
      fullRawEvidenceEmbeddedInBootstrapReceipt: false,
      fullRawEvidenceAvailableThroughExplicitAdvancedBundle: true,
      advancedBundleFunction:
        'buildHEarthSpatialDiagnosticEvidenceBundle(status)'
    }),
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function buildHEarthSpatialDiagnosticEvidenceBundle(status = latestRouteBootstrapStatus) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_EVIDENCE_BUNDLE_ADVANCED',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    generatedAt: new Date().toISOString(),
    purpose:
      'Explicit advanced evidence bundle. This is not the default bootstrap receipt payload.',
    ...H_EARTH_SCENE_IDENTITY,
    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(status),
    sourceCanonLatticeExposure:
      getSourceCanonLatticeExposureReceipt(),
    latticeScope: summarizeHEarthLatticeScope(),
    rawEvidence: Object.freeze({
      sourceCanonLatticeExposureReceipt:
        getSourceCanonLatticeExposureReceipt(),
      capacityReceipt: getCapacityReceipt(),
      environmentReceipt: getEnvironmentReceipt(),
      rendererReceipt: getRendererReceipt(),
      compositorReceipt: getCompositorReceipt(),
      controllerReceipt: getControllerReceipt(),
      capacityAggregate: H_EARTH_3D_CAPACITY,
      environmentAggregate: H_EARTH_3D_ENVIRONMENT,
      rendererAggregate: H_EARTH_3D_RENDERER,
      compositorAggregate: H_EARTH_3D_COMPOSITOR,
      controllerAggregate: H_EARTH_3D_CONTROLLER,
      composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
      candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
      renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
      renderPorts: H_EARTH_3D_RENDER_PORTS,
      rendererMountReceipt: status.rendererMountReceipt
    }),
    boundary: Object.freeze({
      advancedRawEvidenceOnly: true,
      defaultBootstrapReceiptPayload: false,
      routeReportLayerEvidence: true,
      mutationClaim: false,
      renderingBehaviorChangeClaim: false,
      latticeActivationClaim: false,
      active16x16RuntimeClaim: false,
      active256AddressRuntimeClaim: false,
      matrixCollapse: false
    })
  });
}

export function getSpatialDiagnosticReceipt() {
  return buildHEarthSpatialDiagnosticReceipt(latestRouteBootstrapStatus);
}

export function getSpatialDiagnosticEvidenceBundle() {
  return buildHEarthSpatialDiagnosticEvidenceBundle(latestRouteBootstrapStatus);
}

export function renderHEarthSpatialDiagnosticSurfaces(
  mountPoints,
  status = latestRouteBootstrapStatus
) {
  if (!mountPoints) return false;

  const compactReceipt = buildHEarthSpatialDiagnosticReceipt(status);
  const evidenceBundle = buildHEarthSpatialDiagnosticEvidenceBundle(status);
  const reportSourceSummary = buildHEarthOperationalReportSourceSummary(status);

  const wroteSpatialSummary = writeJson(
    mountPoints.spatialSummary,
    compactReceipt,
    { maxDepth: 7, maxArrayLength: 96 }
  );

  const wroteComposedFrame = writeJson(
    mountPoints.composedFramePayload,
    Object.freeze({
      receiptType:
        'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      source: 'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME',
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
      composedCandidateFrameSummary:
        reportSourceSummary.composedFrameSummary,
      composedCandidateFrameRawAvailableInAdvancedBundle: true,
      boundary: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  const wroteCompositorReceipt = writeJson(
    mountPoints.compositorReceiptPayload,
    Object.freeze({
      receiptType: 'H_EARTH_3D_COMPOSITOR_RECEIPT_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      source: 'getCompositorReceipt()',
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      compositorSummary: reportSourceSummary.compositorSummary,
      rawCompositorReceiptAvailableInAdvancedBundle: true,
      compositionBoundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  const wroteRendererPlacement = writeJson(
    mountPoints.rendererPlacementPayload,
    Object.freeze({
      receiptType:
        'H_EARTH_3D_RENDERER_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      rendererPlacementEvidence:
        reportSourceSummary.rendererPlacementSummary,
      rawRendererEvidenceAvailableInAdvancedBundle: true
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  const wroteEnvironmentPlacement = writeJson(
    mountPoints.environmentPlacementPayload,
    Object.freeze({
      receiptType:
        'H_EARTH_3D_ENVIRONMENT_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      environmentPlacementSummary:
        reportSourceSummary.environmentSummary,
      sourceCanonLatticeExposureSummary:
        reportSourceSummary.sourceCanonLatticeExposureSummary,
      latticeScopeSummary:
        reportSourceSummary.latticeScopeSummary,
      rawEnvironmentEvidenceAvailableInAdvancedBundle: true,
      advancedEvidenceBundleSummary: Object.freeze({
        receiptType: evidenceBundle.receiptType,
        generatedAt: evidenceBundle.generatedAt,
        rawEvidenceKeys: Object.freeze(getObjectKeys(evidenceBundle.rawEvidence))
      })
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  return Boolean(
    wroteSpatialSummary ||
    wroteComposedFrame ||
    wroteCompositorReceipt ||
    wroteRendererPlacement ||
    wroteEnvironmentPlacement
  );
}

export function renderHEarthRouteStatus(
  mountPoints,
  status = latestRouteBootstrapStatus
) {
  if (!mountPoints) return false;

  writeText(mountPoints.statusNode, status.statusLevel);

  if (mountPoints.fallbackNode) {
    const fallbackMessage = status.bootstrapFallbackActive
      ? `H-Earth bootstrap fallback active: ${status.failureCodes.join(', ')}`
      : status.bootstrapReadyDescriptorOnlyNoRendererMountApi
        ? 'H-Earth descriptor bootstrap ready. Renderer mount skipped because canon renderer mount API is missing.'
        : status.bootstrapReadyCandidateOnly
          ? 'H-Earth DOM/CSS-3D candidate bootstrap ready. Renderer mount receipt confirmed mounted.'
          : 'H-Earth route bootstrap status pending.';

    writeText(mountPoints.fallbackNode, fallbackMessage);
  }

  if (mountPoints.routeRoot) {
    removeClass(mountPoints.routeRoot, 'h-earth-3d-boot-ready');
    removeClass(mountPoints.routeRoot, 'h-earth-3d-boot-fallback');
    removeClass(mountPoints.routeRoot, 'h-earth-3d-boot-error');

    if (
      status.bootstrapReadyCandidateOnly ||
      status.bootstrapReadyDescriptorOnlyNoRendererMountApi
    ) {
      addClass(mountPoints.routeRoot, 'h-earth-3d-boot-ready');
    } else if (status.bootstrapFallbackActive) {
      addClass(mountPoints.routeRoot, 'h-earth-3d-boot-fallback');
    } else {
      addClass(mountPoints.routeRoot, 'h-earth-3d-boot-error');
    }
  }

  writeJson(
    mountPoints.debug,
    Object.freeze({
      ...status,
      sourceCanonLatticeExposure:
        getSourceCanonLatticeExposureReceipt(),
      spatialDiagnosticReceipt: buildHEarthSpatialDiagnosticReceipt(status),
      latticeScope: summarizeHEarthLatticeScope(),
      operationalReportSourceSummary:
        buildHEarthOperationalReportSourceSummary(status),
      advancedRawEvidenceAvailable: true
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  renderHEarthSpatialDiagnosticSurfaces(mountPoints, status);
  return true;
}

export function createTargetButtonDescriptor(target) {
  return Object.freeze({
    tagName: 'button',
    className: 'h-earth-3d-target-button',
    dataset: Object.freeze({
      hEarthObjectId: target.objectId,
      hEarthTargetClassification: target.classification
    }),
    label: target.label || target.objectId,
    selectable: target.selectable === true,
    inspectable: target.inspectable === true,
    descriptorOnly: true,
    domMutationClaim: false,
    gameplayExecutionClaim: false,
    runtimeReceiptPersistence: false
  });
}

export function renderHEarthTargetList(mountPoints, selectedObjectId) {
  if (!mountPoints?.targetList || !globalThis.document) return false;

  const targetList = mountPoints.targetList;
  targetList.textContent = '';

  Object.values(H_EARTH_3D_SELECTABLE_TARGET_REGISTRY).forEach((target) => {
    if (!target || target.targetResolved !== true) return;

    const descriptor = createTargetButtonDescriptor(target);
    const button = globalThis.document.createElement(descriptor.tagName);

    button.type = 'button';
    button.className = descriptor.className;
    button.textContent = descriptor.label;
    button.dataset.hEarthObjectId = descriptor.dataset.hEarthObjectId;
    button.dataset.hEarthTargetClassification =
      descriptor.dataset.hEarthTargetClassification;
    button.disabled = descriptor.selectable !== true;

    if (target.objectId === selectedObjectId) {
      button.setAttribute('aria-current', 'true');
    }

    button.addEventListener('click', () => {
      const nextObjectId = target.objectId;
      const nextStatus = setRouteBootstrapStatus({
        selectedObjectId: nextObjectId
      });

      renderHEarthTargetList(mountPoints, nextObjectId);
      renderHEarthInspectionPanel(mountPoints, nextObjectId);
      renderHEarthRouteStatus(mountPoints, nextStatus);
    });

    targetList.appendChild(button);
  });

  return true;
}

export function renderHEarthInspectionPanel(mountPoints, objectId) {
  if (!mountPoints?.inspectionPanel) return false;

  const selectedObjectId =
    objectId ||
    latestRouteBootstrapStatus.selectedObjectId ||
    'OBJ_002_FOREGROUND_WET_SAND';

  const target = getSelectableTarget(selectedObjectId);
  const classification = getControllerTargetClassification(selectedObjectId);
  const actionBridge = resolveInspectGroundControllerBridge(selectedObjectId);
  const readoutBridge = resolveGroundConditionReadBridge(selectedObjectId);

  const blockedResponse =
    actionBridge?.contextOnlyBlockResponse ||
    actionBridge?.waterAtmosphericContextResponse?.blockResponse ||
    actionBridge?.secondarySurfaceContextResponse ||
    null;

  writeJson(
    mountPoints.inspectionPanel,
    Object.freeze({
      selectedObjectId,
      label: target?.label || selectedObjectId,
      classification,
      selectable: target?.selectable === true,
      inspectable: target?.inspectable === true,
      actionBridgeResolved: actionBridge?.bridgeResolved === true,
      readoutBridgeResolved: readoutBridge?.bridgeResolved === true,
      firstAction: 'Inspect Ground',
      firstReadout: 'Ground Condition Read',
      firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      blockedResponse,
      descriptorOnly: true,
      runtimeActionExecutionClaim: false,
      readoutProductionClaim: false,
      receiptCreationClaim: false,
      runtimeReceiptPersistence: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  return true;
}

export function bindHEarthInspectionControls(mountPoints) {
  if (!mountPoints) {
    return Object.freeze({
      targetListBound: false,
      inspectGroundControlBound: false,
      reason: 'MISSING_MOUNT_POINTS',
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  const selectedObjectId =
    latestRouteBootstrapStatus.selectedObjectId ||
    'OBJ_002_FOREGROUND_WET_SAND';

  const targetListBound = renderHEarthTargetList(mountPoints, selectedObjectId);
  const inspectionPanelRendered = renderHEarthInspectionPanel(
    mountPoints,
    selectedObjectId
  );

  let inspectGroundControlBound = false;

  if (mountPoints.inspectGroundAction) {
    mountPoints.inspectGroundAction.addEventListener('click', () => {
      const currentObjectId =
        latestRouteBootstrapStatus.selectedObjectId ||
        'OBJ_002_FOREGROUND_WET_SAND';

      const actionBridge = resolveInspectGroundControllerBridge(currentObjectId);
      const readoutBridge = resolveGroundConditionReadBridge(currentObjectId);

      const displayPayload = Object.freeze({
        event: 'Inspect Ground',
        selectedObjectId: currentObjectId,
        actionBridge,
        readoutBridge,
        descriptorOnly: true,
        runtimeActionExecutionClaim: false,
        receiptCreationClaim: false,
        runtimeReceiptPersistence: false,
        visualPassClaim: false,
        validationClaim: false,
        productionClaim: false,
        matrixCollapse: false
      });

      writeJson(mountPoints.inspectionPanel, displayPayload, {
        maxDepth: 8,
        maxArrayLength: 128
      });

      writeJson(
        mountPoints.debug,
        Object.freeze({
          ...latestRouteBootstrapStatus,
          sourceCanonLatticeExposure:
            getSourceCanonLatticeExposureReceipt(),
          lastInspectGroundDescriptor: displayPayload,
          spatialDiagnosticReceipt:
            buildHEarthSpatialDiagnosticReceipt(latestRouteBootstrapStatus),
          latticeScope: summarizeHEarthLatticeScope(),
          operationalReportSourceSummary:
            buildHEarthOperationalReportSourceSummary(latestRouteBootstrapStatus)
        }),
        { maxDepth: 8, maxArrayLength: 128 }
      );

      renderHEarthSpatialDiagnosticSurfaces(
        mountPoints,
        latestRouteBootstrapStatus
      );
    });

    inspectGroundControlBound = true;
  }

  return Object.freeze({
    targetListBound,
    inspectionPanelRendered,
    inspectGroundControlBound,
    controllerReady: Boolean(
      targetListBound ||
      inspectionPanelRendered ||
      inspectGroundControlBound
    ),
    descriptorOnly: true,
    gameplayExecutionClaim: false,
    runtimeReceiptPersistence: false,
    validationClaim: false,
    matrixCollapse: false
  });
}

export function attemptHEarthRendererMount(mountPoints, options = {}) {
  const rendererMountApi = getRendererMountApi();
  const rendererDestroyApi = getRendererDestroyApi();
  const rendererApiSource = getRendererMountApiSource();
  const rendererDestroyApiSource = getRendererDestroyApiSource();

  if (!rendererMountApi) {
    return Object.freeze({
      rendererMountApiConfirmed: false,
      rendererDestroyApiConfirmed: Boolean(rendererDestroyApi),
      rendererApiSource,
      rendererDestroyApiSource,
      rendererMountAttempted: false,
      rendererMounted: false,
      rendererMountSkipped: true,
      rendererMountSkipReason:
        H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_RENDERER_MOUNT_API,
      rendererMountError: null,
      rendererMountReceipt: null,
      statusLevel:
        H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS
          .BOOTSTRAP_READY_DESCRIPTOR_ONLY_NO_RENDERER_MOUNT_API,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  if (!mountPoints?.rendererMount) {
    return Object.freeze({
      rendererMountApiConfirmed: true,
      rendererDestroyApiConfirmed: Boolean(rendererDestroyApi),
      rendererApiSource,
      rendererDestroyApiSource,
      rendererMountAttempted: false,
      rendererMounted: false,
      rendererMountSkipped: true,
      rendererMountSkipReason:
        H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_RENDERER_MOUNT_NODE,
      rendererMountError: null,
      rendererMountReceipt: null,
      statusLevel:
        H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_FALLBACK_ACTIVE,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  try {
    const result = rendererMountApi({
      mountNode: mountPoints.rendererMount,
      renderer: H_EARTH_3D_RENDERER,
      candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
      composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
      controller: H_EARTH_3D_CONTROLLER,
      options: Object.freeze({ ...options }),
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });

    const mounted = isRendererMountReceiptMounted(result);

    return Object.freeze({
      rendererMountApiConfirmed: true,
      rendererDestroyApiConfirmed: Boolean(rendererDestroyApi),
      rendererApiSource,
      rendererDestroyApiSource,
      rendererMountAttempted: true,
      rendererMounted: mounted,
      rendererMountSkipped: false,
      rendererMountSkipReason: mounted
        ? null
        : H_EARTH_3D_ROUTE_FAILURE_CODES.RENDERER_MOUNT_FAILED,
      rendererMountError: null,
      rendererMountReceipt: result || null,
      statusLevel: mounted
        ? H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_READY_CANDIDATE_ONLY
        : H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_FALLBACK_ACTIVE,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  } catch (error) {
    return Object.freeze({
      rendererMountApiConfirmed: true,
      rendererDestroyApiConfirmed: Boolean(rendererDestroyApi),
      rendererApiSource,
      rendererDestroyApiSource,
      rendererMountAttempted: true,
      rendererMounted: false,
      rendererMountSkipped: false,
      rendererMountSkipReason:
        H_EARTH_3D_ROUTE_FAILURE_CODES.RENDERER_MOUNT_FAILED,
      rendererMountError: error instanceof Error ? error.message : String(error),
      rendererMountReceipt: null,
      statusLevel:
        H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_FALLBACK_ACTIVE,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }
}

export function initializeHEarthRoute(options = {}) {
  const rootDocument = options.document || globalThis.document;
  const chain = verifyHEarthRouteBoundChain();
  const mountPoints = resolveHEarthRouteMountPoints(rootDocument);
  const rendererMountApi = getRendererMountApi();

  const failureCodes = [...chain.failureCodes];

  if (!mountPoints.strictRequiredFound) {
    mountPoints.missingStrictRequiredIds.forEach((id) => {
      if (id === H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.routeRoot) {
        failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_ROUTE_ROOT);
      }

      if (id === H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.status) {
        failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_STATUS_NODE);
      }

      if (id === H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds.fallback) {
        failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_FALLBACK_NODE);
      }
    });
  }

  if (failureCodes.length > 0) {
    const failedStatus = setRouteBootstrapStatus({
      chainReady: chain.chainReady,
      domReady: mountPoints.strictRequiredFound,
      controllerReady: false,
      rendererMountReady: false,
      bootstrapReadyCandidateOnly: false,
      bootstrapReadyDescriptorOnlyNoRendererMountApi: false,
      bootstrapFallbackActive: true,
      statusLevel:
        H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_FALLBACK_ACTIVE,
      failureCodes,
      routeRootFound: Boolean(mountPoints.routeRoot),
      statusNodeFound: Boolean(mountPoints.statusNode),
      fallbackNodeFound: Boolean(mountPoints.fallbackNode),
      rendererMountNodeFound: Boolean(mountPoints.rendererMount),
      rendererMountApiConfirmed: Boolean(rendererMountApi),
      rendererDestroyApiConfirmed: Boolean(getRendererDestroyApi()),
      rendererApiSource: getRendererMountApiSource(),
      rendererDestroyApiSource: getRendererDestroyApiSource(),
      rendererMountAttempted: false,
      rendererMounted: false,
      rendererMountSkipped: true,
      rendererMountSkipReason:
        H_EARTH_3D_ROUTE_FAILURE_CODES.BOOTSTRAP_FALLBACK_ACTIVE,
      rendererMountReceipt: null,
      spatialDiagnosticsExposed: false,
      advancedRawEvidenceExposed: false,
      latticeScopeStatusExposed: false
    });

    renderHEarthRouteStatus(mountPoints, failedStatus);

    return Object.freeze({
      initialized: false,
      status: failedStatus,
      mountPoints,
      chain,
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  const controllerBinding = bindHEarthInspectionControls(mountPoints);
  const rendererMount = attemptHEarthRendererMount(
    mountPoints,
    options.rendererOptions || {}
  );

  const warningCodes = [];
  const runtimeFailureCodes = [];

  if (rendererMount.rendererMountSkipped && rendererMount.rendererMountSkipReason) {
    warningCodes.push(rendererMount.rendererMountSkipReason);
  }

  if (
    rendererMount.rendererMountAttempted === true &&
    rendererMount.rendererMounted !== true &&
    rendererMount.rendererMountSkipReason
  ) {
    warningCodes.push(rendererMount.rendererMountSkipReason);
  }

  if (
    rendererMount.rendererMountApiConfirmed === true &&
    rendererMount.rendererMounted !== true &&
    rendererMount.rendererMountSkipReason
  ) {
    runtimeFailureCodes.push(rendererMount.rendererMountSkipReason);
  }

  const descriptorReadyNoMount =
    chain.chainReady === true &&
    mountPoints.strictRequiredFound === true &&
    controllerBinding.controllerReady === true &&
    rendererMount.rendererMountApiConfirmed === false;

  const candidateReady =
    chain.chainReady === true &&
    mountPoints.strictRequiredFound === true &&
    controllerBinding.controllerReady === true &&
    rendererMount.rendererMounted === true;

  const finalStatusLevel = candidateReady
    ? H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_READY_CANDIDATE_ONLY
    : descriptorReadyNoMount
      ? H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS
          .BOOTSTRAP_READY_DESCRIPTOR_ONLY_NO_RENDERER_MOUNT_API
      : rendererMount.statusLevel;

  const spatialDiagnosticsExposed = Boolean(
    mountPoints.spatialSummary ||
    mountPoints.composedFramePayload ||
    mountPoints.compositorReceiptPayload ||
    mountPoints.rendererPlacementPayload ||
    mountPoints.environmentPlacementPayload
  );

  const nextStatus = setRouteBootstrapStatus({
    chainReady: chain.chainReady,
    domReady: mountPoints.strictRequiredFound,
    controllerReady: controllerBinding.controllerReady,
    rendererMountReady:
      rendererMount.rendererMountApiConfirmed &&
      Boolean(mountPoints.rendererMount) &&
      rendererMount.rendererMounted === true,
    bootstrapReadyCandidateOnly: candidateReady,
    bootstrapReadyDescriptorOnlyNoRendererMountApi: descriptorReadyNoMount,
    bootstrapFallbackActive:
      finalStatusLevel ===
      H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_FALLBACK_ACTIVE,
    statusLevel: finalStatusLevel,
    failureCodes: Object.freeze(runtimeFailureCodes),
    warningCodes: Object.freeze(warningCodes),
    rendererMountApiConfirmed: rendererMount.rendererMountApiConfirmed,
    rendererDestroyApiConfirmed: rendererMount.rendererDestroyApiConfirmed,
    rendererMountAttempted: rendererMount.rendererMountAttempted,
    rendererMounted: rendererMount.rendererMounted,
    rendererMountSkipped: rendererMount.rendererMountSkipped,
    rendererMountSkipReason: rendererMount.rendererMountSkipReason,
    rendererMountError: rendererMount.rendererMountError,
    rendererMountReceipt: rendererMount.rendererMountReceipt,
    rendererApiSource: rendererMount.rendererApiSource,
    rendererDestroyApiSource: rendererMount.rendererDestroyApiSource,
    routeRootFound: Boolean(mountPoints.routeRoot),
    statusNodeFound: Boolean(mountPoints.statusNode),
    fallbackNodeFound: Boolean(mountPoints.fallbackNode),
    rendererMountNodeFound: Boolean(mountPoints.rendererMount),
    targetListBound: controllerBinding.targetListBound,
    inspectGroundControlBound: controllerBinding.inspectGroundControlBound,
    debugStatusExposed: Boolean(mountPoints.debug),
    spatialDiagnosticsExposed,
    advancedRawEvidenceExposed: spatialDiagnosticsExposed,
    latticeScopeStatusExposed: true
  });

  renderHEarthRouteStatus(mountPoints, nextStatus);

  return Object.freeze({
    initialized: true,
    status: nextStatus,
    mountPoints,
    chain,
    controllerBinding,
    rendererMount,
    spatialDiagnosticReceipt: buildHEarthSpatialDiagnosticReceipt(nextStatus),
    spatialDiagnosticEvidenceBundle:
      buildHEarthSpatialDiagnosticEvidenceBundle(nextStatus),
    sourceCanonLatticeExposure:
      getSourceCanonLatticeExposureReceipt(),
    latticeScope: summarizeHEarthLatticeScope(),
    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(nextStatus),
    runtimeFailureCodes: Object.freeze(runtimeFailureCodes),
    renderInputSelector: selectHEarthRenderInput,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function destroyHEarthRoute(options = {}) {
  const destroyApi = getRendererDestroyApi();
  const mountPoints = resolveHEarthRouteMountPoints(
    options.document || globalThis.document
  );

  let rendererDestroyed = false;
  let rendererDestroyError = null;
  let rendererDestroyReceipt = null;
  let rendererDestroyAttempted = false;

  if (destroyApi) {
    rendererDestroyAttempted = true;

    try {
      rendererDestroyReceipt = destroyApi({
        mountNode: mountPoints.rendererMount,
        boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
      });

      rendererDestroyed = isRendererDestroyReceiptDestroyed(rendererDestroyReceipt);
    } catch (error) {
      rendererDestroyError = error instanceof Error ? error.message : String(error);
      rendererDestroyed = false;
    }
  }

  const nextStatus = setRouteBootstrapStatus({
    bootstrapReadyCandidateOnly: false,
    bootstrapReadyDescriptorOnlyNoRendererMountApi: false,
    bootstrapFallbackActive: false,
    statusLevel: H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_NOT_STARTED,
    rendererMounted: false,
    rendererMountAttempted: false,
    rendererMountSkipped: true,
    rendererDestroyAttempted,
    rendererDestroyed,
    rendererDestroyApiConfirmed: Boolean(destroyApi),
    rendererDestroyApiSource: getRendererDestroyApiSource(),
    rendererDestroyReceipt,
    rendererDestroyError,
    rendererMountSkipReason: rendererDestroyed
      ? null
      : H_EARTH_3D_ROUTE_FAILURE_CODES.RENDERER_DESTROY_FAILED,
    rendererMountError: rendererDestroyError,
    targetListBound: false,
    inspectGroundControlBound: false,
    spatialDiagnosticsExposed: false,
    advancedRawEvidenceExposed: false,
    latticeScopeStatusExposed: false
  });

  renderHEarthRouteStatus(mountPoints, nextStatus);

  return Object.freeze({
    destroyed: rendererDestroyed,
    rendererDestroyed,
    rendererDestroyAttempted,
    rendererDestroyReceipt,
    rendererDestroyError,
    status: nextStatus,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function buildHEarthRouteBootstrapReceipt(status = latestRouteBootstrapStatus) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT_COMPACT',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_INDEX_CONTRACT.renewedFrom,
    status: status.statusLevel,
    activationScope: H_EARTH_3D_INDEX_CONTRACT.activationScope,
    reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',
    compactReceipt: true,
    fullRawEvidenceEmbedded: false,
    fullRawEvidenceAvailableThrough:
      'buildHEarthSpatialDiagnosticEvidenceBundle(status)',
    sourceCanonLatticeExposureReceipt:
      getSourceCanonLatticeExposureReceipt(),
    upstreamReceiptAvailability: Object.freeze({
      sourceCanonLatticeExposure:
        Boolean(getSourceCanonLatticeExposureReceipt()),
      capacity: Boolean(getCapacityReceipt()),
      environment: Boolean(getEnvironmentReceipt()),
      renderer: Boolean(getRendererReceipt()),
      compositor: Boolean(getCompositorReceipt()),
      controller: Boolean(getControllerReceipt())
    }),
    upstreamReceiptHeaders: Object.freeze({
      sourceCanonLatticeExposure:
        summarizeReceiptHeader(getSourceCanonLatticeExposureReceipt()),
      capacity: summarizeReceiptHeader(getCapacityReceipt()),
      environment: summarizeReceiptHeader(getEnvironmentReceipt()),
      renderer: summarizeReceiptHeader(getRendererReceipt()),
      compositor: summarizeReceiptHeader(getCompositorReceipt()),
      controller: summarizeReceiptHeader(getControllerReceipt())
    }),
    spatialDiagnosticReceipt: buildHEarthSpatialDiagnosticReceipt(status),
    latticeScope: summarizeHEarthLatticeScope(),
    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(status),
    chainReady: status.chainReady,
    domReady: status.domReady,
    controllerReady: status.controllerReady,
    rendererMountReady: status.rendererMountReady,
    bootstrapReadyCandidateOnly: status.bootstrapReadyCandidateOnly,
    bootstrapReadyDescriptorOnlyNoRendererMountApi:
      status.bootstrapReadyDescriptorOnlyNoRendererMountApi,
    bootstrapFallbackActive: status.bootstrapFallbackActive,
    rendererMountApiConfirmed: status.rendererMountApiConfirmed,
    rendererDestroyApiConfirmed: status.rendererDestroyApiConfirmed,
    rendererApiSource: status.rendererApiSource,
    rendererDestroyApiSource: status.rendererDestroyApiSource,
    rendererMountAttempted: status.rendererMountAttempted,
    rendererMounted: status.rendererMounted,
    rendererMountSkipped: status.rendererMountSkipped,
    rendererMountSkipReason: status.rendererMountSkipReason,
    rendererMountError: status.rendererMountError,
    rendererMountReceiptSummary:
      summarizeRendererMountReceipt(status.rendererMountReceipt),
    rendererDestroyAttempted: status.rendererDestroyAttempted,
    rendererDestroyed: status.rendererDestroyed,
    rendererDestroyError: status.rendererDestroyError,
    rendererDestroyReceiptSummary:
      summarizeRendererMountReceipt(status.rendererDestroyReceipt),
    failureCodes: status.failureCodes,
    warningCodes: status.warningCodes,
    routeRootFound: status.routeRootFound,
    statusNodeFound: status.statusNodeFound,
    fallbackNodeFound: status.fallbackNodeFound,
    rendererMountNodeFound: status.rendererMountNodeFound,
    targetListBound: status.targetListBound,
    inspectGroundControlBound: status.inspectGroundControlBound,
    debugStatusExposed: status.debugStatusExposed,
    spatialDiagnosticsExposed: status.spatialDiagnosticsExposed,
    advancedRawEvidenceExposed: status.advancedRawEvidenceExposed,
    latticeScopeStatusExposed: status.latticeScopeStatusExposed,
    firstAction: 'Inspect Ground',
    firstReadout: 'Ground Condition Read',
    firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
    ...H_EARTH_SCENE_IDENTITY,
    matrixSeparation: Object.freeze({
      hEarth: 'Ground-View Matrix',
      hearth: 'support/control context only',
      audralia: 'planetary-world context only',
      matrixCollapse: false
    }),
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
    forbiddenCapabilityFlagsPreserved: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
    rendererBoundaryFlagsPreserved: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
    compositionBoundaryFlagsPreserved: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
    controllerBoundaryFlagsPreserved: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
  });
}

export const H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT =
  buildHEarthRouteBootstrapReceipt(H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS);

export function getIndexReceipt() {
  return buildHEarthRouteBootstrapReceipt(latestRouteBootstrapStatus);
}

export function getRouteBootstrapReceipt() {
  return getIndexReceipt();
}

export const H_EARTH_3D_INDEX = Object.freeze({
  id: 'H_EARTH_3D_INDEX',
  file: '/showroom/globe/h-earth/index.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  contract: H_EARTH_3D_INDEX_CONTRACT,
  boundChain: H_EARTH_3D_INDEX_BOUND_CHAIN,
  mountContract: H_EARTH_3D_ROUTE_MOUNT_CONTRACT,
  boundaryFlags: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
  failureCodes: H_EARTH_3D_ROUTE_FAILURE_CODES,
  bootstrapOrder: H_EARTH_3D_ROUTE_BOOTSTRAP_ORDER,
  statusLevels: H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS,
  latticeScopeStatus: H_EARTH_3D_LATTICE_SCOPE_STATUS,

  sourceCanonLatticeExposureReceipt:
    H_EARTH_3D_SOURCE_CANON_LATTICE_EXPOSURE_RECEIPT,

  capacity: H_EARTH_3D_CAPACITY,
  environment: H_EARTH_3D_ENVIRONMENT,
  renderer: H_EARTH_3D_RENDERER,
  compositor: H_EARTH_3D_COMPOSITOR,
  controller: H_EARTH_3D_CONTROLLER,

  capacityReceipt: H_EARTH_3D_CAPACITY_RECEIPT,
  environmentReceipt: H_EARTH_3D_ENVIRONMENT_RECEIPT,
  rendererReceipt: H_EARTH_3D_RENDERER_RECEIPT,
  compositorReceipt: H_EARTH_3D_COMPOSITOR_RECEIPT,
  controllerReceipt: H_EARTH_3D_CONTROLLER_RECEIPT,

  renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
  renderPorts: H_EARTH_3D_RENDER_PORTS,
  candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  selectableTargetRegistry: H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,
  inspectionActionRouting: H_EARTH_3D_INSPECTION_ACTION_ROUTING,
  groundConditionReadBridge: H_EARTH_3D_GROUND_CONDITION_READ_BRIDGE,
  groundInspectionReceiptBridge: H_EARTH_3D_GROUND_INSPECTION_RECEIPT_BRIDGE,
  contextOnlyBlockResponses: H_EARTH_3D_CONTEXT_ONLY_BLOCK_RESPONSES,
  secondarySurfaceContextResponses: H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES,
  waterAtmosphericContextResponses: H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES,
  blockedBehaviorResponses: H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES,
  composedFrameSelectionReferences: H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES,

  getSourceCanonLatticeExposureReceipt,
  getRouteBootstrapStatus,
  getIndexReceipt,
  getRouteBootstrapReceipt,
  getSpatialDiagnosticReceipt,
  getSpatialDiagnosticEvidenceBundle,
  buildHEarthSpatialDiagnosticReceipt,
  buildHEarthSpatialDiagnosticEvidenceBundle,
  buildHEarthOperationalReportSourceSummary,
  renderHEarthSpatialDiagnosticSurfaces,
  summarizeHEarthLatticeScope,
  getLatticeScopeReceipt,
  getRendererMountApi,
  getRendererDestroyApi,
  getRendererMountApiSource,
  getRendererDestroyApiSource,
  isRendererMountReceiptMounted,
  isRendererDestroyReceiptDestroyed,
  verifyHEarthRouteBoundChain,
  resolveHEarthRouteMountPoints,
  initializeHEarthRoute,
  destroyHEarthRoute,

  receipt: H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT,
  getReceipt: getIndexReceipt
});

export default H_EARTH_3D_INDEX;
