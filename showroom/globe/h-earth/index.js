/*
  /showroom/globe/h-earth/index.js
  COMPLETE RENEWED FILE
  H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1

  Renews:
  H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029E_SPATIAL_RECEIPT_EXPOSURE_v1
  H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029D_RUNTIME_FAILURE_CODE_CLEANUP_v1

  Purpose:
  Defines the H-Earth 3D Candidate Preview route bootstrap and route-side
  activation orchestrator.

  Step 029F renewal purpose:
  Upgrades the route bootstrap from raw spatial receipt exposure to compact
  report-layer evidence compression, while adding an honest lattice-scope
  evidence reader.

  Report principle:
  Receipts prove.
  Reports diagnose.
  Scene remains primary.

  029F correction:
  - The default route bootstrap receipt must not carry the whole world.
  - The default spatial diagnostic receipt must be compact.
  - Full raw evidence must remain available only through explicit advanced
    evidence payloads.
  - Lattice scope must be read honestly and reported as not exposed unless an
    upstream source actually exposes lattice evidence.

  Renewal scope:
  - Preserve Step 029D runtime failure-code cleanup.
  - Preserve Step 029E spatial evidence access.
  - Preserve external route autostart discipline through index.html.
  - Preserve renderer mount status handling from mount receipt.
  - Preserve HTML/CSS shell compatibility.
  - Preserve existing public exports used by index.html.
  - Add compact report-layer summaries.
  - Add lattice-scope evidence detection.
  - Add full raw evidence bundle only for advanced raw evidence surfaces.
  - Prevent the route bootstrap receipt from embedding full heavy receipt trees.
  - No rendering behavior change.
  - No compositor logic change.
  - No environment mutation.
  - No renderer mutation.
  - No controller mutation.
  - No CSS/HTML scene invention.
  - No lattice activation.
  - No Mirror Manor route-canon naming.
  - No claim upgrade.

  Boundaries:
  This file may lawfully touch the route page and bind DOM controls only inside
  the authorized DOM/CSS-3D candidate boundary. It does not mutate GitHub,
  create WebGL/canvas, claim final renderer, claim renderer pass, claim visual
  pass, claim validation, claim production, create open-world traversal, create
  survival simulation, authorize swimming or fluid simulation, authorize manor
  interior, authorize distant traversal, activate a 16x16 lattice, name Mirror
  Manor as the route-canon title, or collapse matrices.
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

export const H_EARTH_3D_INDEX_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
  renewedFrom:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029E_SPATIAL_RECEIPT_EXPOSURE_v1',

  file: '/showroom/globe/h-earth/index.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  createdFor: 'H_EARTH_3D_CANDIDATE_PREVIEW',

  fileClass: 'ROUTE_BOOTSTRAP_DOM_CSS_3D_CANDIDATE_PREVIEW_ORCHESTRATOR',
  activationScope: 'AUTHORIZED_ROUTE_SIDE_CANDIDATE_ACTIVATION_DOM_CSS_3D_ONLY',
  activationOption:
    'STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION',

  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamCompositorFile: '/showroom/globe/h-earth/compositor.js',
  upstreamControllerFile: '/showroom/globe/h-earth/controller.js',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  renewalScope: Object.freeze({
    runtimeFailureCodeCleanupPreserved: true,
    externalRouteAutostartPreserved: true,
    rendererMountReceiptStatusRead: true,
    htmlCompatibilityPreserved: true,
    cssCompatibilityPreserved: true,
    spatialReceiptExposurePreserved: true,
    reportLayerEvidenceCompressionAdded: true,
    compactDefaultBootstrapReceiptAdded: true,
    compactDefaultSpatialDiagnosticReceiptAdded: true,
    explicitRawEvidenceBundleAdded: true,
    latticeScopeEvidenceReaderAdded: true,
    latticeActivationAdded: false,
    mirrorManorRouteCanonNamingAdded: false,
    renderingBehaviorChanged: false,
    compositorLogicChanged: false,
    environmentMutation: false,
    rendererMutation: false,
    controllerMutation: false,
    routeShellHtmlMutation: false,
    routeCssMutation: false,
    redesignClaim: false
  }),

  indexRole: Object.freeze({
    verifiesCanonChain: true,
    resolvesRouteDomMountPoints: true,
    initializesRouteStatus: true,
    mayBindSafeControllerControls: true,
    mayExposeDebugStatus: true,
    mayExposeCompactSpatialDiagnosticReceipts: true,
    mayExposeExplicitAdvancedRawEvidenceBundle: true,
    mayExposeLatticeScopeStatus: true,
    mayCallRendererMountApiIfCanonExposed: true,
    mayUseNoMountFallbackIfRendererApiMissing: true,

    ownsRenderLogic: false,
    ownsCompositorOrdering: false,
    ownsControllerCanon: false,
    ownsRouteShellHtml: false,
    ownsRouteCss: false,
    ownsWebGL: false,
    ownsCanvas: false,
    ownsLatticeCanon: false,
    ownsMirrorManorNaming: false
  }),

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  }),

  mirrorManorBoundary: Object.freeze({
    shorelineManorSceneIdentity: 'earth-water-air-survival-shoreline-manor',
    mirrorManorStrategicallyImplied: true,
    mirrorManorRouteCanonNamed: false
  }),

  boundaryClaims: Object.freeze({
    mutatesGitHub: false,
    installsRoute: false,
    expandsRoute: false,
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
    claimsMirrorManorRouteCanonName: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_INDEX_BOUND_CHAIN = Object.freeze({
  capacity: Object.freeze({
    file: '/showroom/globe/h-earth/capacity.js',
    contractId: 'H_EARTH_3D_CAPACITY_FILE_BIRTH_STEP_019_v1',
    aggregate: H_EARTH_3D_CAPACITY,
    receipt: H_EARTH_3D_CAPACITY_RECEIPT
  }),

  environment: Object.freeze({
    file: '/showroom/globe/h-earth/environment.js',
    contractId:
      'H_EARTH_3D_ENVIRONMENT_FILE_BIRTH_STEP_021A_RENEWAL_CLEANUP_PACKET_v1',
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
    contractId:
      'H_EARTH_3D_COMPOSITOR_FILE_BIRTH_STEP_025A_RENEWAL_CLEANUP_PACKET_v1',
    aggregate: H_EARTH_3D_COMPOSITOR,
    composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
    boundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
    receipt: H_EARTH_3D_COMPOSITOR_RECEIPT
  }),

  controller: Object.freeze({
    file: '/showroom/globe/h-earth/controller.js',
    contractId:
      'H_EARTH_3D_CONTROLLER_FILE_BIRTH_STEP_027A_RENEWAL_CLEANUP_PACKET_v1',
    aggregate: H_EARTH_3D_CONTROLLER,
    targetRegistry: H_EARTH_3D_SELECTABLE_TARGET_REGISTRY,
    boundaryFlags: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS,
    receipt: H_EARTH_3D_CONTROLLER_RECEIPT
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
  missingRendererMountApiIsControlledDescriptorReadyState: true,

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
  runtimeReceiptPersistence: false,
  survivalScoreClaim: false,
  healthScoreClaim: false,
  diagnosticScoreClaim: false,
  latticeActivationClaim: false,
  active16x16LatticeClaim: false,
  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false
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

  classHooks: Object.freeze([
    'h-earth-3d-route-root',
    'h-earth-3d-renderer-mount',
    'h-earth-3d-status',
    'h-earth-3d-fallback',
    'h-earth-3d-hud',
    'h-earth-3d-inspection-panel',
    'h-earth-3d-target-list',
    'h-earth-3d-target-button',
    'h-earth-3d-blocked-response',
    'h-earth-3d-boot-ready',
    'h-earth-3d-boot-fallback',
    'h-earth-3d-boot-error'
  ]),

  rendererMountPolicy: Object.freeze({
    rendererMountNodeRequiredWhenRendererMountApiExists: true,
    rendererMountNodeMissingWithoutRendererApiIsNotCanonChainFailure: true,
    mountReceiptRequiredForMountedStatus: true,
    runtimeFailureCodeRequiredForMountFallback: true,
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
  CONTROLLER_BINDING_SKIPPED: 'CONTROLLER_BINDING_SKIPPED',
  BOOTSTRAP_FALLBACK_ACTIVE: 'BOOTSTRAP_FALLBACK_ACTIVE'
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
  'record runtime failure code if renderer API exists but mount does not succeed',
  'bind safe inspection controls',
  'expose compact route receipt/status',
  'expose compact report-layer spatial diagnostics',
  'expose explicit advanced raw evidence only to advanced evidence surfaces',
  'expose honest lattice-scope status without lattice activation',
  'fail safely if any required dependency is missing'
]);

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
    'SCENE_SCOPED_16X16_LATTICE_EXPOSED'
});

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

    failureCodes: Object.freeze([...(status.failureCodes || [])]),
    warningCodes: Object.freeze([...(status.warningCodes || [])]),

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
      H_EARTH_3D_CONTROLLER_RECEIPT.primaryInspectionTarget ||
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

function safeSerialize(value, options = {}) {
  const maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 6;
  const maxArrayLength = Number.isFinite(options.maxArrayLength)
    ? options.maxArrayLength
    : 80;
  const seen = new WeakSet();

  function visit(input, depth) {
    if (input === null) return null;

    const type = typeof input;

    if (type === 'string' || type === 'number' || type === 'boolean') {
      return input;
    }

    if (type === 'bigint') {
      return String(input);
    }

    if (type === 'undefined') {
      return null;
    }

    if (type === 'function') {
      return `[Function ${input.name || 'anonymous'}]`;
    }

    if (depth > maxDepth) {
      return '[MaxDepthExceeded]';
    }

    if (type === 'object') {
      if (seen.has(input)) {
        return '[Circular]';
      }

      seen.add(input);

      if (Array.isArray(input)) {
        const sliced = input.slice(0, maxArrayLength).map((item) => visit(item, depth + 1));

        if (input.length > maxArrayLength) {
          sliced.push(`[ArrayTruncated ${input.length - maxArrayLength}]`);
        }

        return sliced;
      }

      const output = {};

      Object.keys(input).forEach((key) => {
        if (
          key === 'mountNode' ||
          key === 'routeRoot' ||
          key === 'statusNode' ||
          key === 'fallbackNode'
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
  if (!node || !node.classList) return false;
  node.classList.add(className);
  return true;
}

function removeClass(node, className) {
  if (!node || !node.classList) return false;
  node.classList.remove(className);
  return true;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function readNumber(value, fallback = null) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getObjectKeys(value) {
  if (!value || typeof value !== 'object') return [];
  return Object.keys(value);
}

function lowerSerialized(value) {
  try {
    return JSON.stringify(safeSerialize(value, { maxDepth: 5, maxArrayLength: 80 })).toLowerCase();
  } catch (_error) {
    return '';
  }
}

function getObjectAtPath(source, path) {
  if (!source || typeof source !== 'object') return null;

  return path.reduce((current, segment) => {
    if (!current || typeof current !== 'object') return null;
    return current[segment] ?? null;
  }, source);
}

function findFirstObjectByKeys(source, candidateKeys = []) {
  if (!source || typeof source !== 'object') return null;

  for (const key of candidateKeys) {
    if (source[key]) return source[key];
  }

  return null;
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
    capacityReceiptPresent: Boolean(getCapacityReceipt()),
    environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
    rendererReceiptPresent: Boolean(getRendererReceipt()),
    compositorReceiptPresent: Boolean(getCompositorReceipt()),
    controllerReceiptPresent: Boolean(getControllerReceipt()),

    capacityReceiptConstantPresent: Boolean(H_EARTH_3D_CAPACITY_RECEIPT),
    environmentReceiptConstantPresent: Boolean(H_EARTH_3D_ENVIRONMENT_RECEIPT),
    rendererReceiptConstantPresent: Boolean(H_EARTH_3D_RENDERER_RECEIPT),
    compositorReceiptConstantPresent: Boolean(H_EARTH_3D_COMPOSITOR_RECEIPT),
    controllerReceiptConstantPresent: Boolean(H_EARTH_3D_CONTROLLER_RECEIPT),

    capacityAggregatePresent: Boolean(H_EARTH_3D_CAPACITY),
    environmentAggregatePresent: Boolean(H_EARTH_3D_ENVIRONMENT),
    rendererAggregatePresent: Boolean(H_EARTH_3D_RENDERER),
    compositorAggregatePresent: Boolean(H_EARTH_3D_COMPOSITOR),
    controllerAggregatePresent: Boolean(H_EARTH_3D_CONTROLLER),

    rendererMountApiPresent: Boolean(getRendererMountApi()),
    rendererDestroyApiPresent: Boolean(getRendererDestroyApi()),
    rendererMountApiSource: getRendererMountApiSource(),
    rendererDestroyApiSource: getRendererDestroyApiSource(),

    rendererVolumeModelPresent: Boolean(H_EARTH_3D_RENDER_VOLUME_MODEL),
    rendererPortsPresent: Boolean(H_EARTH_3D_RENDER_PORTS),
    rendererInputSelectorPresent: typeof selectHEarthRenderInput === 'function',

    composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
    candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE)
  });

  const failureCodes = [];

  if (!checks.capacityReceiptPresent) {
    failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_CAPACITY_RECEIPT);
  }

  if (!checks.environmentReceiptPresent) {
    failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_ENVIRONMENT_RECEIPT);
  }

  if (!checks.rendererReceiptPresent) {
    failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_RENDERER_RECEIPT);
  }

  if (!checks.compositorReceiptPresent) {
    failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_COMPOSITOR_RECEIPT);
  }

  if (!checks.controllerReceiptPresent) {
    failureCodes.push(H_EARTH_3D_ROUTE_FAILURE_CODES.MISSING_CONTROLLER_RECEIPT);
  }

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
    mountNodeValid: receipt.mountNodeValid === true,
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
    geometrySkippedNodeCount: receipt.geometrySkippedNodeCount ?? null,
    geometryBudgetSkippedNodeCount: receipt.geometryBudgetSkippedNodeCount ?? null,
    geometryParentNodeCount: receipt.geometryParentNodeCount ?? null,
    geometryChildNodeCount: receipt.geometryChildNodeCount ?? null,

    sourceNodeCount: receipt.sourceNodeCount ?? null,
    mountedNodeCount: receipt.mountedNodeCount ?? null,
    objectNodeCount: receipt.objectNodeCount ?? null,
    placedNodeCount: receipt.placedNodeCount ?? null,
    skippedNodeCount: receipt.skippedNodeCount ?? null,
    transformDescriptorAppliedCount:
      receipt.transformDescriptorAppliedCount ?? null,
    transformDescriptorMissingCount:
      receipt.transformDescriptorMissingCount ?? null,
    primitiveGeometryAppliedCount:
      receipt.primitiveGeometryAppliedCount ?? null,

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
    status: frame.status || null,
    matrix: frame.matrix || 'H-Earth',
    matrixRole: frame.matrixRole || 'Ground-View Matrix',
    sceneIdentity: frame.sceneIdentity || 'earth-water-air-survival-shoreline-manor',
    primaryFocusObjectId:
      frame.primaryFocusObjectId ||
      frame.primaryObjectId ||
      frame.focusPriority?.primaryFocusObjectId ||
      H_EARTH_3D_COMPOSITOR_RECEIPT?.primaryFocusObjectId ||
      null,
    composedNodeCount:
      frame.composedNodeCount ??
      frame.nodeCount ??
      composedNodes?.length ??
      H_EARTH_3D_COMPOSITOR_RECEIPT?.composedNodeCount ??
      null,
    cameraFrameResolved: Boolean(frame.cameraFrame || frame.camera),
    depthCompositionResolved: Boolean(frame.depthComposition || frame.depth),
    layerCompositionResolved: Boolean(frame.layerComposition || frame.layers),
    focusPriorityResolved: Boolean(frame.focusPriority || frame.focusPriorityModel),
    contextCompositionResolved: Boolean(frame.contextComposition),
    viewportFitResolved: Boolean(frame.viewportFit || frame.viewport),
    compositionPressureClass:
      frame.compositionPressure?.pressureClass ||
      frame.compositionPressureClass ||
      H_EARTH_3D_COMPOSITOR_RECEIPT?.compositionPressureClass ||
      null,
    composedNodeDigest: Array.isArray(composedNodes)
      ? composedNodes.slice(0, 16).map((node) =>
          Object.freeze({
            nodeId: node.nodeId || node.id || null,
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
    candidateRenderSceneParentDescriptorsOnly:
      receipt.candidateRenderSceneParentDescriptorsOnly ?? null,
    compositorReceivesParentDescriptorsOnly:
      receipt.compositorReceivesParentDescriptorsOnly ?? null,
    sourceCandidateRenderNodeCount:
      receipt.sourceCandidateRenderNodeCount ?? null,
    composedNodeCount: receipt.composedNodeCount ?? null,
    cameraFrameResolved: receipt.cameraFrameResolved ?? null,
    depthCompositionResolved: receipt.depthCompositionResolved ?? null,
    layerCompositionResolved: receipt.layerCompositionResolved ?? null,
    focusPriorityResolved: receipt.focusPriorityResolved ?? null,
    contextCompositionResolved: receipt.contextCompositionResolved ?? null,
    viewportFitResolved: receipt.viewportFitResolved ?? null,
    composedCandidateFrameResolved:
      receipt.composedCandidateFrameResolved ?? null,
    compositionPressureClass:
      receipt.compositionPressureClass || null,
    primaryFocusObjectId: receipt.primaryFocusObjectId || null,
    primaryInspectionTargetPreserved:
      receipt.primaryInspectionTargetPreserved ?? null,
    matrixSeparationPreserved:
      receipt.matrixSeparationPreserved ?? null,
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
    coordinateSystemConsumed: receipt.coordinateSystemConsumed === true,
    scaleModelConsumed: receipt.scaleModelConsumed === true,
    worldBoundsConsumed: receipt.worldBoundsConsumed === true,
    depthModelConsumed: receipt.depthModelConsumed === true,
    zoneBandsConsumed: receipt.zoneBandsConsumed === true,
    primitiveSchemaConsumed: receipt.primitiveSchemaConsumed === true,
    materialIdentitiesConsumed: receipt.materialIdentitiesConsumed === true,
    objectCapacityReferencesConsumed:
      receipt.objectCapacityReferencesConsumed === true,
    candidatePlacementHintsConsumed:
      receipt.candidatePlacementHintsConsumed === true,
    environmentalFormGrammarConsumed:
      receipt.environmentalFormGrammarConsumed === true,
    cameraCapacityReferenced: receipt.cameraCapacityReferenced === true,
    inspectionAnchorsConsumed: receipt.inspectionAnchorsConsumed === true,

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
    geometryExpansionDeferredUntilMountSelection:
      receipt.geometryExpansionDeferredUntilMountSelection ?? null,
    createsDomCss3DCandidateNodes:
      receipt.createsDomCss3DCandidateNodes ?? null,
    emitsLandscapeGradeCssTransforms:
      receipt.emitsLandscapeGradeCssTransforms ?? null,
    emitsPrimitiveGeometryDescriptors:
      receipt.emitsPrimitiveGeometryDescriptors ?? null,
    expandsGeometryDescriptors:
      receipt.expandsGeometryDescriptors ?? null,
    mountsExpandedGeometryDescriptors:
      receipt.mountsExpandedGeometryDescriptors ?? null,
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
    mountedReceiptSummary: summarizeRendererMountReceipt(status.rendererMountReceipt),
    rendererTransformDigest: nodes.slice(0, 16).map((node) =>
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
  const capacityReceipt = getCapacityReceipt();
  const environmentReceipt = getEnvironmentReceipt();
  const rendererReceipt = getRendererReceipt();
  const compositorReceipt = getCompositorReceipt();

  const candidateObjects = [
    H_EARTH_3D_CAPACITY?.latticeScope,
    H_EARTH_3D_CAPACITY?.sceneLattice,
    H_EARTH_3D_CAPACITY?.macroEnvironmentLattice,
    H_EARTH_3D_CAPACITY?.latticeScopeReceipt,
    H_EARTH_3D_CAPACITY?.latticeReport,

    capacityReceipt?.latticeScope,
    capacityReceipt?.sceneLattice,
    capacityReceipt?.macroEnvironmentLattice,
    capacityReceipt?.latticeScopeReceipt,
    capacityReceipt?.latticeReport,

    H_EARTH_3D_ENVIRONMENT?.latticeScope,
    H_EARTH_3D_ENVIRONMENT?.sceneLattice,
    H_EARTH_3D_ENVIRONMENT?.macroEnvironmentLattice,
    H_EARTH_3D_ENVIRONMENT?.latticeScopeReceipt,
    H_EARTH_3D_ENVIRONMENT?.latticeReport,

    environmentReceipt?.latticeScope,
    environmentReceipt?.sceneLattice,
    environmentReceipt?.macroEnvironmentLattice,
    environmentReceipt?.latticeScopeReceipt,
    environmentReceipt?.latticeReport,

    H_EARTH_3D_RENDERER?.latticeScope,
    rendererReceipt?.latticeScope,
    H_EARTH_3D_COMPOSITOR?.latticeScope,
    compositorReceipt?.latticeScope
  ].filter(Boolean);

  return Object.freeze(candidateObjects);
}

function detectLatticeHints() {
  const capacityReceipt = getCapacityReceipt();
  const environmentReceipt = getEnvironmentReceipt();
  const capacityAggregateText = lowerSerialized(H_EARTH_3D_CAPACITY);
  const environmentAggregateText = lowerSerialized(H_EARTH_3D_ENVIRONMENT);
  const capacityReceiptText = lowerSerialized(capacityReceipt);
  const environmentReceiptText = lowerSerialized(environmentReceipt);

  const combined = [
    capacityAggregateText,
    environmentAggregateText,
    capacityReceiptText,
    environmentReceiptText
  ].join('\n');

  const tokens = Object.freeze({
    lattice: combined.includes('lattice'),
    sixteenBySixteen:
      combined.includes('16x16') ||
      combined.includes('16×16') ||
      combined.includes('"rows":16') ||
      combined.includes('"columns":16') ||
      combined.includes('"rowcount":16') ||
      combined.includes('"columncount":16'),
    twoHundredFiftySix:
      combined.includes('256') ||
      combined.includes('"cellcount":256') ||
      combined.includes('"addresscount":256'),
    shorelineManor:
      combined.includes('shoreline-manor') ||
      combined.includes('shoreline') && combined.includes('manor'),
    addressField:
      combined.includes('addressfield') ||
      combined.includes('address field') ||
      combined.includes('addressable')
  });

  return Object.freeze({
    hintsPresent: Boolean(
      tokens.lattice ||
      tokens.sixteenBySixteen ||
      tokens.twoHundredFiftySix ||
      tokens.addressField
    ),
    tokens,
    searchedSources: Object.freeze([
      'H_EARTH_3D_CAPACITY',
      'getCapacityReceipt()',
      'H_EARTH_3D_ENVIRONMENT',
      'getEnvironmentReceipt()'
    ])
  });
}

export function summarizeHEarthLatticeScope() {
  const latticeCandidates = getLatticeCandidateObjects();
  const hints = detectLatticeHints();

  const formalLatticeObject =
    latticeCandidates.find((candidate) => {
      const serialized = lowerSerialized(candidate);
      return (
        serialized.includes('latticescope') ||
        serialized.includes('lattice scope') ||
        serialized.includes('scenelattice') ||
        serialized.includes('macroenvironmentlattice') ||
        serialized.includes('16x16') ||
        serialized.includes('16×16') ||
        serialized.includes('256')
      );
    }) || null;

  const formalText = lowerSerialized(formalLatticeObject);

  const has16x16 =
    formalText.includes('16x16') ||
    formalText.includes('16×16') ||
    formalText.includes('"rows":16') ||
    formalText.includes('"columns":16') ||
    formalText.includes('"rowcount":16') ||
    formalText.includes('"columncount":16');

  const has256 =
    formalText.includes('256') ||
    formalText.includes('"cellcount":256') ||
    formalText.includes('"addresscount":256');

  let status = H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_LATTICE_NOT_EXPOSED;

  if (formalLatticeObject && has16x16 && has256) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_16X16_LATTICE_EXPOSED;
  } else if (formalLatticeObject) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.LATTICE_SCOPE_RECEIPT_EXPOSED;
  } else if (hints.hintsPresent) {
    status = H_EARTH_3D_LATTICE_SCOPE_STATUS.LATTICE_SCOPE_HINTS_PRESENT;
  }

  return Object.freeze({
    receiptType: 'H_EARTH_3D_LATTICE_SCOPE_REPORT_SOURCE',
    file: '/showroom/globe/h-earth/index.js',
    contractId:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
    status,
    ...H_EARTH_SCENE_IDENTITY,
    strategicRule:
      'The scene scopes the lattice. The lattice makes the scene addressable.',
    latticeScopeEvidencePresent: Boolean(formalLatticeObject),
    latticeHintEvidencePresent: hints.hintsPresent,
    formal16x16EvidencePresent: Boolean(has16x16 && has256),
    candidateEvidenceObjectCount: latticeCandidates.length,
    evidenceSummary: formalLatticeObject
      ? Object.freeze({
          keys: Object.freeze(getObjectKeys(formalLatticeObject)),
          has16x16,
          has256,
          compactEvidence: safeSerialize(formalLatticeObject, {
            maxDepth: 4,
            maxArrayLength: 32
          })
        })
      : null,
    hintSummary: hints,
    nextEvidenceNeeded:
      status === H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_LATTICE_NOT_EXPOSED
        ? 'Expose source/environment lattice scope receipt before claiming scene-scoped 16x16 addressability.'
        : status === H_EARTH_3D_LATTICE_SCOPE_STATUS.LATTICE_SCOPE_HINTS_PRESENT
          ? 'Promote hints into formal source/environment lattice scope receipt if authorized.'
          : 'Inspect formal lattice evidence before environment/rendering renewal.',
    boundary: Object.freeze({
      reportOnly: true,
      latticeActivationClaim: false,
      active16x16LatticeClaim:
        status === H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_16X16_LATTICE_EXPOSED
          ? 'evidence-exposed-only-not-activated'
          : false,
      mirrorManorRouteCanonNameClaim: false,
      matrixCollapse: false
    })
  });
}

export function getLatticeScopeReceipt() {
  return summarizeHEarthLatticeScope();
}

export function buildHEarthOperationalReportSourceSummary(status = latestRouteBootstrapStatus) {
  const rendererMountSummary = summarizeRendererMountReceipt(status.rendererMountReceipt);
  const environmentSummary = summarizeEnvironmentPlacement(getEnvironmentReceipt());
  const compositorSummary = summarizeCompositorReceipt(getCompositorReceipt());
  const composedFrameSummary = summarizeComposedFrame(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME);
  const rendererPlacementSummary = summarizeRendererPlacement(status);
  const latticeScopeSummary = summarizeHEarthLatticeScope();

  return Object.freeze({
    receiptType: 'H_EARTH_3D_OPERATIONAL_REPORT_SOURCE_SUMMARY',
    file: '/showroom/globe/h-earth/index.js',
    contractId:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
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
      capacityReceiptPresent: Boolean(getCapacityReceipt()),
      environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
      rendererReceiptPresent: Boolean(getRendererReceipt()),
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      controllerReceiptPresent: Boolean(getControllerReceipt()),
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
      candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE),
      rendererMountReceiptPresent: Boolean(status.rendererMountReceipt),
      latticeScopeEvidencePresent: latticeScopeSummary.latticeScopeEvidencePresent,
      latticeHintEvidencePresent: latticeScopeSummary.latticeHintEvidencePresent,
      advancedRawEvidenceBundleAvailable: true
    }),

    latticeScopeSummary,
    environmentSummary,
    compositorSummary,
    composedFrameSummary,
    rendererMountSummary,
    rendererPlacementSummary,

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
  const reportSourceSummary = buildHEarthOperationalReportSourceSummary(status);

  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_RECEIPT_COMPACT',
    file: '/showroom/globe/h-earth/index.js',
    contractId:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
    renewedFrom:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029E_SPATIAL_RECEIPT_EXPOSURE_v1',
    status: status.statusLevel,
    purpose:
      'Compact report-layer evidence source for break-location classification without embedding the full raw receipt tree.',
    reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',

    currentDiagnosticQuestion:
      'Which lane owns the next break: lattice/source, environment, compositor, geometry, renderer, CSS, action bridge, or boundary?',

    reportSourceSummary,

    nextDecisionRule: Object.freeze({
      ifLatticeStatusNotExposed:
        'Do not claim active lattice. Inspect source/environment for formal lattice scope before lattice mapping.',
      ifEnvironmentCoveragePartial:
        'Inspect environment summary before environment renewal.',
      ifCompositorFrameClean:
        'Proceed to geometry and renderer reports.',
      ifGeometryAndRendererCleanButVisualWrong:
        'CSS interpretation becomes plausible break owner.',
      ifBoundaryRisk:
        'Stop construction and inspect boundary flags.'
    }),

    rawEvidencePolicy: Object.freeze({
      defaultReceiptIsCompact: true,
      fullRawEvidenceEmbeddedInBootstrapReceipt: false,
      fullRawEvidenceAvailableThroughExplicitAdvancedBundle: true,
      advancedBundleFunction:
        'buildHEarthSpatialDiagnosticEvidenceBundle(status)',
      advancedSurfacesMayReceiveFullBundle: true
    }),

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function buildHEarthSpatialDiagnosticEvidenceBundle(status = latestRouteBootstrapStatus) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_EVIDENCE_BUNDLE_ADVANCED',
    file: '/showroom/globe/h-earth/index.js',
    contractId:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
    generatedAt: new Date().toISOString(),
    purpose:
      'Explicit advanced evidence bundle. This is not the default bootstrap receipt payload.',
    ...H_EARTH_SCENE_IDENTITY,

    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(status),

    latticeScope: summarizeHEarthLatticeScope(),

    rawEvidence: Object.freeze({
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
      mirrorManorRouteCanonNameClaim: false,
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

export function renderHEarthSpatialDiagnosticSurfaces(mountPoints, status = latestRouteBootstrapStatus) {
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
      receiptType: 'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME_EXPOSURE_COMPACT_WITH_ADVANCED_DIGEST',
      file: '/showroom/globe/h-earth/index.js',
      source: 'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME',
      purpose:
        'Compact composed candidate frame exposure for report routing. Full raw frame is available in advanced evidence bundle.',
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
      purpose:
        'Compact compositor evidence for camera, depth, layer composition, viewport fit, primary focus, and composed frame resolution.',
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
      receiptType: 'H_EARTH_3D_RENDERER_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      purpose:
        'Compact renderer placement evidence for transform/placement/geometry break-location classification.',
      rendererPlacementEvidence:
        reportSourceSummary.rendererPlacementSummary,
      rawRendererEvidenceAvailableInAdvancedBundle: true
    }),
    { maxDepth: 7, maxArrayLength: 96 }
  );

  const wroteEnvironmentPlacement = writeJson(
    mountPoints.environmentPlacementPayload,
    Object.freeze({
      receiptType: 'H_EARTH_3D_ENVIRONMENT_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/index.js',
      purpose:
        'Compact environment placement and lattice-scope evidence before environment/lattice routing.',
      environmentPlacementSummary:
        reportSourceSummary.environmentSummary,
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

export function renderHEarthRouteStatus(mountPoints, status = latestRouteBootstrapStatus) {
  if (!mountPoints) return false;

  const label = status.statusLevel;

  writeText(mountPoints.statusNode, label);

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

  const panelPayload = Object.freeze({
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
  });

  writeJson(mountPoints.inspectionPanel, panelPayload, {
    maxDepth: 7,
    maxArrayLength: 96
  });

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
        {
          ...latestRouteBootstrapStatus,
          lastInspectGroundDescriptor: displayPayload,
          spatialDiagnosticReceipt:
            buildHEarthSpatialDiagnosticReceipt(latestRouteBootstrapStatus),
          latticeScope: summarizeHEarthLatticeScope(),
          operationalReportSourceSummary:
            buildHEarthOperationalReportSourceSummary(latestRouteBootstrapStatus)
        },
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

  const strictFailure = failureCodes.length > 0;

  if (strictFailure) {
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

  const runtimeFailureCodes = [];

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
    contractId:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
    renewedFrom:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029E_SPATIAL_RECEIPT_EXPOSURE_v1',
    status: status.statusLevel,

    activationScope: 'AUTHORIZED_ROUTE_SIDE_CANDIDATE_ACTIVATION_DOM_CSS_3D_ONLY',
    activationOption:
      'STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION',

    reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',

    compactReceipt: true,
    fullRawEvidenceEmbedded: false,
    fullRawEvidenceAvailableThrough:
      'buildHEarthSpatialDiagnosticEvidenceBundle(status)',

    upstreamReceiptAvailability: Object.freeze({
      capacity: Boolean(getCapacityReceipt()),
      environment: Boolean(getEnvironmentReceipt()),
      renderer: Boolean(getRendererReceipt()),
      compositor: Boolean(getCompositorReceipt()),
      controller: Boolean(getControllerReceipt())
    }),

    upstreamReceiptHeaders: Object.freeze({
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

    functionalStatusCleanup: Object.freeze({
      rendererMountedDerivedFromMountReceipt: true,
      rendererDestroyedDerivedFromDestroyReceipt: true,
      runtimeFailureCodesReportedForRendererMountFallback: true,
      missingRendererApiFallbackWarningOnly: true,
      noThrowDoesNotEqualMountSuccess: true,
      noThrowDoesNotEqualDestroySuccess: true,
      moduleLevelAutoStartAdded: false,
      externalHtmlBootstrapCallExpected: true,
      spatialReceiptExposurePreserved: true,
      reportLayerEvidenceCompressionAdded: true,
      latticeScopeReaderAdded: true,
      rawEvidenceBundleSeparatedFromDefaultBootstrapReceipt: true
    }),

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
  initializeHEarthRoute,
  destroyHEarthRoute
});

export default H_EARTH_3D_INDEX;
