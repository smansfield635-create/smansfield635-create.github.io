// /showroom/globe/h-earth/index.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_INDEX_PUBLIC_BOOTSTRAP_FILE_BIRTH_STEP_033A_DIAGNOSTIC_ROUTE_SPLIT_RENDERER_031D_COMPAT_v1
//
// Renews:
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1
//
// Preserves public-route compatibility from:
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029E_SPATIAL_RECEIPT_EXPOSURE_v1
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029D_RUNTIME_FAILURE_CODE_CLEANUP_v1
//
// Renderer compatibility target:
// H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031D_SINGLE_PASS_GEOMETRY_EXPANSION_GUARDED_BINDING_v1
//
// Purpose:
// Public H-Earth route bootstrap only.
// Mounts the DOM/CSS3D candidate renderer when the canon renderer mount API is
// available, binds compact public inspection/readout controls, exposes compact
// route status/receipt, and links to the separate diagnostic route.
//
// Diagnostic split:
// The former Step 029F report-layer, lattice-scope reader, raw spatial evidence
// bundle, operational report source summary, report cards, receipt wall, copy
// surfaces, and advanced diagnostic payload surfaces are intentionally removed
// from this public route bootstrap and assigned to:
//
// /showroom/globe/h-earth/diagnostic/index.js
//
// Report principle preserved:
// Receipts prove.
// Reports diagnose.
// Scene remains primary.
//
// Boundary:
// Route-side public bootstrap only.
// No diagnostic wall.
// No source mutation.
// No GitHub mutation.
// No route install claim.
// No WebGL.
// No canvas.
// No SVG.
// No iframe.
// No fake HTML scene geometry.
// No shell-owned scene objects.
// No final renderer claim.
// No renderer-pass claim.
// No visual-pass claim.
// No validation claim.
// No production claim.
// No traversal.
// No survival simulation.
// No swimming.
// No fluid simulation.
// No manor interior access.
// No distant traversal.
// No runtime lattice activation.
// No active 16x16 lattice runtime claim.
// No active 256-address runtime claim.
// No Mirror Manor route-canon naming.
// No matrix collapse.

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
    'H_EARTH_3D_INDEX_PUBLIC_BOOTSTRAP_FILE_BIRTH_STEP_033A_DIAGNOSTIC_ROUTE_SPLIT_RENDERER_031D_COMPAT_v1',
  renewedFrom:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',

  file: '/showroom/globe/h-earth/index.js',
  route: '/showroom/globe/h-earth/',
  diagnosticRoute: '/showroom/globe/h-earth/diagnostic/',
  sourceRoot: '/h-earth-3d/',
  createdFor: 'H_EARTH_3D_CANDIDATE_PREVIEW',

  fileClass:
    'PUBLIC_ROUTE_BOOTSTRAP_DOM_CSS_3D_CANDIDATE_PREVIEW_ORCHESTRATOR_DIAGNOSTIC_SPLIT',
  activationScope:
    'AUTHORIZED_PUBLIC_ROUTE_SIDE_CANDIDATE_ACTIVATION_DOM_CSS_3D_ONLY',
  activationOption:
    'STEP_033A_PUBLIC_ROUTE_BOOTSTRAP_DIAGNOSTIC_ROUTE_SPLIT',

  upstreamCapacityFile: '/showroom/globe/h-earth/capacity.js',
  upstreamEnvironmentFile: '/showroom/globe/h-earth/environment.js',
  upstreamRendererFile: '/showroom/globe/h-earth/renderer.js',
  upstreamCompositorFile: '/showroom/globe/h-earth/compositor.js',
  upstreamControllerFile: '/showroom/globe/h-earth/controller.js',

  rendererCompatibilityTarget:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031D_SINGLE_PASS_GEOMETRY_EXPANSION_GUARDED_BINDING_v1',
  diagnosticRouteCompatibilityTarget:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033D_ROUTE_REPORT_SPLIT_v1',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',

  renewalScope: Object.freeze({
    publicBootstrapOnly: true,
    diagnosticRouteSplitApplied: true,
    renderer031DCompatibilityDeclared: true,

    runtimeFailureCodeCleanupPreserved: true,
    externalRouteAutostartPreserved: true,
    rendererMountReceiptStatusRead: true,
    htmlCompatibilityPreservedForPublicShell: true,
    cssCompatibilityPreservedForPublicShell: true,
    existingPublicExportsPreserved: true,

    rendererMountOrchestrationPreserved: true,
    controllerInspectionBridgePreserved: true,
    compactPublicReadoutAdded: true,
    compactRouteReceiptPreserved: true,
    diagnosticRouteHandoffAdded: true,

    former029FReportLayerMovedOut: true,
    former029FLatticeScopeReaderMovedOut: true,
    former029FSpatialDiagnosticReceiptMovedOut: true,
    former029FSpatialDiagnosticEvidenceBundleMovedOut: true,
    former029FOperationalReportSourceSummaryMovedOut: true,
    former029FAdvancedRawEvidenceSurfacesMovedOut: true,

    publicRouteRequiresDiagnosticPayloadIds: false,
    publicRouteWritesDiagnosticPayloadIds: false,
    publicRouteEmbedsDiagnosticWall: false,
    publicRouteEmbedsReceiptWall: false,
    publicRouteEmbedsCopySurface: false,
    publicRouteEmbedsOperationalReports: false,

    renderingBehaviorChanged: false,
    compositorLogicChanged: false,
    environmentMutation: false,
    rendererMutation: false,
    controllerMutation: false,
    routeShellHtmlMutation: false,
    routeCssMutation: false,

    latticeActivationAdded: false,
    mirrorManorRouteCanonNamingAdded: false,
    claimUpgradeAdded: false,
    redesignClaim: false
  }),

  indexRole: Object.freeze({
    verifiesCanonChain: true,
    resolvesRouteDomMountPoints: true,
    initializesRouteStatus: true,
    mayBindSafeControllerControls: true,
    mayExposeDebugStatus: true,
    mayCallRendererMountApiIfCanonExposed: true,
    mayUseNoMountFallbackIfRendererApiMissing: true,
    mayLinkDiagnosticRoute: true,

    ownsRenderLogic: false,
    ownsCompositorOrdering: false,
    ownsControllerCanon: false,
    ownsRouteShellHtml: false,
    ownsRouteCss: false,
    ownsDiagnosticReports: false,
    ownsRawEvidenceWall: false,
    ownsCopySurface: false,
    ownsReceiptWall: false,
    ownsLatticeCanon: false,
    ownsMirrorManorNaming: false,
    ownsWebGL: false,
    ownsCanvas: false
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
    activatesSvg: false,
    activatesIframe: false,
    createsShellOwnedSceneObjects: false,
    createsFakeHtmlSceneGeometry: false,
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
    claimsMirrorManorRouteCanonName: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_INDEX_BOUND_CHAIN = Object.freeze({
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
    compatibilityTarget:
      'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_031D_SINGLE_PASS_GEOMETRY_EXPANSION_GUARDED_BINDING_v1',
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
    selectRenderInputHelperAvailable:
      typeof selectHEarthRenderInput === 'function',
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

export const H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS = Object.freeze({
  routeBootstrapOrchestrator: true,
  publicRouteBootstrapOnly: true,
  diagnosticRouteSplit: true,
  authorizedRouteSideCandidateActivationDomCss3dOnly: true,

  directDomControlBindingAllowedWithinCandidateBoundary: true,
  statusDomUpdateAllowedWithinCandidateBoundary: true,
  descriptorDisplayAllowedWithinCandidateBoundary: true,
  compactPublicReadoutAllowedWithinCandidateBoundary: true,
  diagnosticRouteLinkAllowedWithinCandidateBoundary: true,

  diagnosticReportLayerAllowedInPublicRoute: false,
  spatialReceiptExposureAllowedInPublicRoute: false,
  explicitAdvancedRawEvidenceBundleAllowedInPublicRoute: false,
  latticeScopeEvidenceReadingAllowedInPublicRoute: false,
  copySurfaceAllowedInPublicRoute: false,
  receiptWallAllowedInPublicRoute: false,
  reportCardClassificationAllowedInPublicRoute: false,

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
  svgActivation: false,
  iframeActivation: false,
  shellOwnedSceneObjectCreation: false,
  fakeHtmlSceneGeometry: false,
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
  active256AddressRuntimeClaim: false,
  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false,
  claimBoundaryPreserved: true
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

  optionalPublicIds: Object.freeze({
    hud: 'h-earth-3d-hud',
    inspectionPanel: 'h-earth-3d-inspection-panel',
    targetList: 'h-earth-3d-target-list',
    debug: 'h-earth-3d-debug',
    inspectGroundAction: 'h-earth-3d-action-inspect-ground',
    selectedTargetLabel: 'h-earth-3d-selected-target-label',
    selectedTargetClassification:
      'h-earth-3d-selected-target-classification',
    selectedTargetObjectId: 'h-earth-3d-selected-target-object-id',
    publicReadout: 'h-earth-3d-public-readout',
    publicReadoutTitle: 'h-earth-3d-public-readout-title',
    publicReadoutLine: 'h-earth-3d-public-readout-line',
    diagnosticLink: 'h-earth-3d-diagnostic-link'
  }),

  diagnosticIdsRemovedFromPublicRoute: Object.freeze([
    'h-earth-3d-operational-report-stack-payload',
    'h-earth-3d-report-layer-status',
    'h-earth-3d-spatial-summary-payload',
    'h-earth-3d-composed-frame-payload',
    'h-earth-3d-compositor-receipt-payload',
    'h-earth-3d-renderer-placement-payload',
    'h-earth-3d-environment-placement-payload',
    'h-earth-3d-route-bootstrap-receipt',
    'h-earth-3d-renderer-mount-receipt',
    'h-earth-3d-boundary-flags',
    'h-earth-3d-index-contract',
    'h-earth-3d-copy-status'
  ]),

  classHooks: Object.freeze([
    'h-earth-3d-route-root',
    'h-earth-3d-renderer-mount',
    'h-earth-3d-status',
    'h-earth-3d-fallback',
    'h-earth-3d-hud',
    'h-earth-3d-inspection-panel',
    'h-earth-3d-target-list',
    'h-earth-3d-target-button',
    'h-earth-3d-action-button',
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
  'resolve public route DOM mount points',
  'initialize route status',
  'mount DOM/CSS-3D candidate renderer only if canon renderer API exists',
  'read renderer mount receipt before declaring mounted',
  'record runtime failure code if renderer API exists but mount does not succeed',
  'bind safe public inspection controls',
  'expose compact public route receipt/status',
  'link separate diagnostic route',
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

const H_EARTH_SCENE_IDENTITY = Object.freeze({
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  mirrorManorStatus: 'STRATEGICALLY_IMPLIED_NOT_ROUTE_CANON_NAMED'
});

const H_EARTH_DEFAULT_SELECTED_OBJECT_ID = 'OBJ_002_FOREGROUND_WET_SAND';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function nowIso() {
  return new Date().toISOString();
}

function getDocumentFromOptions(options = {}) {
  return options.document || globalThis.document || null;
}

function safeSerialize(value, options = {}) {
  const maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 5;
  const maxArrayLength = Number.isFinite(options.maxArrayLength)
    ? options.maxArrayLength
    : 60;
  const seen = new WeakSet();

  function visit(input, depth) {
    if (input === null) return null;

    const type = typeof input;

    if (type === 'string' || type === 'number' || type === 'boolean') {
      return input;
    }

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
  node.textContent = String(value ?? '');
  return true;
}

function writeJson(node, value, options = {}) {
  if (!node) return false;
  node.textContent = JSON.stringify(safeSerialize(value, options), null, 2);
  return true;
}

function addClass(node, className) {
  if (!node?.classList || !className) return false;
  node.classList.add(className);
  return true;
}

function removeClass(node, className) {
  if (!node?.classList || !className) return false;
  node.classList.remove(className);
  return true;
}

function setNodeDataset(node, key, value) {
  if (!node?.dataset || !key) return false;
  node.dataset[key] = value === null || value === undefined ? '' : String(value);
  return true;
}

function getTargetLabel(target, objectId) {
  return (
    target?.label ||
    target?.objectLabel ||
    target?.objectId ||
    objectId ||
    H_EARTH_DEFAULT_SELECTED_OBJECT_ID
  );
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
    selectedTargetCardUpdated: status.selectedTargetCardUpdated === true,
    compactReadoutRendered: status.compactReadoutRendered === true,
    debugStatusExposed: status.debugStatusExposed === true,
    diagnosticRouteLinked: status.diagnosticRouteLinked === true,

    selectedObjectId:
      status.selectedObjectId ||
      H_EARTH_DEFAULT_SELECTED_OBJECT_ID,

    publicBootstrapOnly: true,
    diagnosticRoute:
      status.diagnosticRoute ||
      H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

let latestRouteBootstrapStatus = freezeStatus({
  statusLevel: H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_NOT_STARTED,
  selectedObjectId: H_EARTH_DEFAULT_SELECTED_OBJECT_ID
});

export const H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS =
  latestRouteBootstrapStatus;

export function getRouteBootstrapStatus() {
  return latestRouteBootstrapStatus;
}

function setRouteBootstrapStatus(nextStatus) {
  latestRouteBootstrapStatus = freezeStatus({
    ...latestRouteBootstrapStatus,
    ...nextStatus,
    timestamp: nowIso()
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
  const strictIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.strictRequiredIds;
  const conditionalIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.conditionallyRequiredIds;
  const optionalIds = H_EARTH_3D_ROUTE_MOUNT_CONTRACT.optionalPublicIds;

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
      selectedTargetLabel: null,
      selectedTargetClassification: null,
      selectedTargetObjectId: null,
      publicReadout: null,
      publicReadoutTitle: null,
      publicReadoutLine: null,
      diagnosticLink: null,
      strictRequiredFound: false,
      rendererMountFound: false,
      missingStrictRequiredIds: Object.freeze([
        strictIds.routeRoot,
        strictIds.status,
        strictIds.fallback
      ]),
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

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
    inspectGroundAction:
      rootDocument.getElementById(optionalIds.inspectGroundAction),
    selectedTargetLabel:
      rootDocument.getElementById(optionalIds.selectedTargetLabel),
    selectedTargetClassification:
      rootDocument.getElementById(optionalIds.selectedTargetClassification),
    selectedTargetObjectId:
      rootDocument.getElementById(optionalIds.selectedTargetObjectId),
    publicReadout: rootDocument.getElementById(optionalIds.publicReadout),
    publicReadoutTitle:
      rootDocument.getElementById(optionalIds.publicReadoutTitle),
    publicReadoutLine:
      rootDocument.getElementById(optionalIds.publicReadoutLine),
    diagnosticLink: rootDocument.getElementById(optionalIds.diagnosticLink),
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
    matrixRole:
      receipt.matrixRole || fallback.matrixRole || 'Ground-View Matrix',
    activeCell:
      receipt.activeCell || fallback.activeCell || 'H_EARTH_GROUND_CELL_001',
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
    layerContainerCount:
      receipt.layerContainerCount ?? receipt.layerCount ?? null,

    selectedRenderInputSource: receipt.selectedRenderInputSource || null,
    sourceDescriptorType: receipt.sourceDescriptorType || null,
    rawSourceNodeCount: receipt.rawSourceNodeCount ?? null,
    usedComposedFrame: receipt.usedComposedFrame === true,
    usedRenderSceneFallback: receipt.usedRenderSceneFallback === true,

    geometryPortUsed: receipt.geometryPortUsed === true,
    geometryExpansionApplied: receipt.geometryExpansionApplied === true,
    geometryExpansionSkippedBecauseAlreadyExpanded:
      receipt.geometryExpansionSkippedBecauseAlreadyExpanded === true,
    geometryExpansionSource: receipt.geometryExpansionSource || null,
    geometrySourceNodeCount: receipt.geometrySourceNodeCount ?? null,
    geometryExpandedNodeCount: receipt.geometryExpandedNodeCount ?? null,
    geometryReturnedNodeCount: receipt.geometryReturnedNodeCount ?? null,
    geometrySkippedNodeCount: receipt.geometrySkippedNodeCount ?? null,
    geometryBudgetSkippedNodeCount:
      receipt.geometryBudgetSkippedNodeCount ?? null,
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

function summarizeRendererDestroyReceipt(receipt) {
  if (!receipt) return null;

  return Object.freeze({
    receiptType: receipt.receiptType || null,
    contractId: receipt.contractId || null,
    destroyAttempted: receipt.destroyAttempted === true,
    destroyed: receipt.destroyed === true,
    mountNodeAccepted: receipt.mountNodeAccepted === true,
    mountNodeValid: receipt.mountNodeValid === true,
    removedOwnedNodeCount:
      receipt.removedOwnedNodeCount ?? receipt.removedNodeCount ?? null,
    routeShellPreserved: receipt.routeShellPreserved === true,
    canonDescriptorsPreserved: receipt.canonDescriptorsPreserved === true,
    warningCodes: Object.freeze(asArray(receipt.warningCodes)),
    failureCodes: Object.freeze(asArray(receipt.failureCodes)),
    claimBoundaryPreserved: receipt.claimBoundaryPreserved === true,
    boundaryPresent: Boolean(receipt.boundary)
  });
}

export function buildHEarthPublicReadoutPayload(objectId) {
  const selectedObjectId = objectId || H_EARTH_DEFAULT_SELECTED_OBJECT_ID;
  const target = getSelectableTarget(selectedObjectId);
  const classification = getControllerTargetClassification(selectedObjectId);
  const actionBridge = resolveInspectGroundControllerBridge(selectedObjectId);
  const readoutBridge = resolveGroundConditionReadBridge(selectedObjectId);

  const blockedResponse =
    actionBridge?.contextOnlyBlockResponse ||
    actionBridge?.waterAtmosphericContextResponse?.blockResponse ||
    actionBridge?.secondarySurfaceContextResponse ||
    null;

  return Object.freeze({
    receiptType: 'H_EARTH_3D_PUBLIC_GROUND_CONDITION_READOUT',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,

    ...H_EARTH_SCENE_IDENTITY,

    selectedObjectId,
    label: getTargetLabel(target, selectedObjectId),
    classification,
    selectable: target?.selectable === true,
    inspectable: target?.inspectable === true,

    action: 'Inspect Ground',
    actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
    readout: 'Ground Condition Read',
    readoutId: 'H_EARTH_GROUND_CONDITION_READ',
    receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    actionBridgeResolved: actionBridge?.bridgeResolved === true,
    readoutBridgeResolved: readoutBridge?.bridgeResolved === true,
    bridgeResolved:
      actionBridge?.bridgeResolved === true ||
      readoutBridge?.bridgeResolved === true,

    blockedResponse,

    descriptorOnly: true,
    publicRouteReadoutOnly: true,
    runtimeActionExecutionClaim: false,
    readoutProductionClaim: false,
    receiptCreationClaim: false,
    runtimeReceiptPersistence: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,

    actionBridge,
    readoutBridge,

    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function renderHEarthSelectedTargetCard(mountPoints, objectId) {
  if (!mountPoints) return false;

  const selectedObjectId = objectId || H_EARTH_DEFAULT_SELECTED_OBJECT_ID;
  const target = getSelectableTarget(selectedObjectId);
  const classification = getControllerTargetClassification(selectedObjectId);
  const label = getTargetLabel(target, selectedObjectId);

  const wroteLabel = writeText(mountPoints.selectedTargetLabel, label);

  const wroteClassification = writeText(
    mountPoints.selectedTargetClassification,
    classification || 'UNCLASSIFIED_TARGET'
  );

  const wroteObjectId = writeText(
    mountPoints.selectedTargetObjectId,
    selectedObjectId
  );

  if (mountPoints.routeRoot) {
    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthSelectedObjectId',
      selectedObjectId
    );

    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthSelectedObjectLabel',
      label
    );

    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthSelectedTargetClassification',
      classification || 'UNCLASSIFIED_TARGET'
    );
  }

  return Boolean(wroteLabel || wroteClassification || wroteObjectId);
}

export function renderHEarthPublicReadout(mountPoints, objectId) {
  if (!mountPoints) return false;

  const selectedObjectId = objectId || H_EARTH_DEFAULT_SELECTED_OBJECT_ID;
  const payload = buildHEarthPublicReadoutPayload(selectedObjectId);
  const title = `${payload.label} · Inspect Ground`;

  const line =
    payload.blockedResponse?.message ||
    (
      payload.readoutBridgeResolved
        ? 'Descriptor-only Ground Condition Read bridge is available for this target.'
        : 'This target is selectable as a descriptor, but it does not create runtime action execution or receipt production.'
    );

  const wroteTitle = writeText(mountPoints.publicReadoutTitle, title);
  const wroteLine = writeText(mountPoints.publicReadoutLine, line);

  const wrotePanel = writeJson(mountPoints.inspectionPanel, payload, {
    maxDepth: 7,
    maxArrayLength: 80
  });

  return Boolean(wroteTitle || wroteLine || wrotePanel);
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
    publicRouteControlOnly: true,
    domMutationClaim: false,
    gameplayExecutionClaim: false,
    runtimeReceiptPersistence: false
  });
}

export function renderHEarthTargetList(mountPoints, selectedObjectId) {
  const documentRef =
    mountPoints?.targetList?.ownerDocument || globalThis.document || null;

  if (!mountPoints?.targetList || !documentRef) return false;

  const targetList = mountPoints.targetList;
  targetList.textContent = '';

  Object.values(H_EARTH_3D_SELECTABLE_TARGET_REGISTRY).forEach((target) => {
    if (!target || target.targetResolved !== true) return;

    const descriptor = createTargetButtonDescriptor(target);
    const button = documentRef.createElement(descriptor.tagName);

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
      selectHEarthPublicTarget({
        mountPoints,
        objectId: target.objectId
      });
    });

    targetList.appendChild(button);
  });

  return true;
}

export function selectHEarthPublicTarget({
  mountPoints,
  objectId
} = {}) {
  const selectedObjectId = objectId || H_EARTH_DEFAULT_SELECTED_OBJECT_ID;

  const nextStatus = setRouteBootstrapStatus({
    selectedObjectId
  });

  const selectedTargetCardUpdated = renderHEarthSelectedTargetCard(
    mountPoints,
    selectedObjectId
  );

  const compactReadoutRendered = renderHEarthPublicReadout(
    mountPoints,
    selectedObjectId
  );

  renderHEarthTargetList(mountPoints, selectedObjectId);

  renderHEarthRouteStatus(mountPoints, {
    ...nextStatus,
    selectedTargetCardUpdated,
    compactReadoutRendered
  });

  return Object.freeze({
    selected: true,
    selectedObjectId,
    selectedTargetCardUpdated,
    compactReadoutRendered,
    descriptorOnly: true,
    runtimeActionExecutionClaim: false,
    receiptCreationClaim: false,
    runtimeReceiptPersistence: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function bindHEarthInspectionControls(mountPoints) {
  if (!mountPoints) {
    return Object.freeze({
      targetListBound: false,
      inspectionPanelRendered: false,
      selectedTargetCardUpdated: false,
      compactReadoutRendered: false,
      inspectGroundControlBound: false,
      controllerReady: false,
      reason: 'MISSING_MOUNT_POINTS',
      boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
    });
  }

  const selectedObjectId =
    latestRouteBootstrapStatus.selectedObjectId ||
    H_EARTH_DEFAULT_SELECTED_OBJECT_ID;

  const targetListBound = renderHEarthTargetList(mountPoints, selectedObjectId);

  const selectedTargetCardUpdated = renderHEarthSelectedTargetCard(
    mountPoints,
    selectedObjectId
  );

  const compactReadoutRendered = renderHEarthPublicReadout(
    mountPoints,
    selectedObjectId
  );

  let inspectGroundControlBound = false;

  if (mountPoints.inspectGroundAction) {
    mountPoints.inspectGroundAction.addEventListener('click', () => {
      const currentObjectId =
        latestRouteBootstrapStatus.selectedObjectId ||
        H_EARTH_DEFAULT_SELECTED_OBJECT_ID;

      renderHEarthPublicReadout(mountPoints, currentObjectId);
      renderHEarthRouteStatus(mountPoints, latestRouteBootstrapStatus);
    });

    inspectGroundControlBound = true;
  }

  return Object.freeze({
    targetListBound,
    inspectionPanelRendered: Boolean(mountPoints.inspectionPanel),
    selectedTargetCardUpdated,
    compactReadoutRendered,
    inspectGroundControlBound,
    controllerReady: Boolean(
      targetListBound ||
      compactReadoutRendered ||
      selectedTargetCardUpdated ||
      inspectGroundControlBound
    ),
    descriptorOnly: true,
    publicRouteControlOnly: true,
    gameplayExecutionClaim: false,
    runtimeReceiptPersistence: false,
    validationClaim: false,
    matrixCollapse: false,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
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

    setNodeDataset(mountPoints.routeRoot, 'hEarthStatusLevel', status.statusLevel);

    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthRendererMounted',
      String(status.rendererMounted === true)
    );

    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthDiagnosticRoute',
      H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute
    );

    setNodeDataset(
      mountPoints.routeRoot,
      'hEarthPublicBootstrapOnly',
      'true'
    );
  }

  if (mountPoints.diagnosticLink) {
    mountPoints.diagnosticLink.setAttribute(
      'href',
      H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute
    );
  }

  if (mountPoints.debug) {
    writeJson(
      mountPoints.debug,
      Object.freeze({
        ...status,
        publicBootstrapOnly: true,
        diagnosticRoute: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,
        compactReceipt: buildHEarthRouteBootstrapReceipt(status),
        rendererMountReceiptSummary:
          summarizeRendererMountReceipt(status.rendererMountReceipt),
        diagnosticWallEmbedded: false,
        rawSpatialEvidenceEmbedded: false,
        receiptWallEmbedded: false,
        copySurfaceEmbedded: false
      }),
      { maxDepth: 6, maxArrayLength: 80 }
    );
  }

  return true;
}

export function initializeHEarthRoute(options = {}) {
  const rootDocument = getDocumentFromOptions(options);
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
      diagnosticRouteLinked: Boolean(mountPoints.diagnosticLink)
    });

    renderHEarthRouteStatus(mountPoints, failedStatus);

    return Object.freeze({
      initialized: false,
      status: failedStatus,
      mountPoints,
      chain,
      publicBootstrapOnly: true,
      diagnosticRoute: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,
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
    selectedTargetCardUpdated: controllerBinding.selectedTargetCardUpdated,
    compactReadoutRendered: controllerBinding.compactReadoutRendered,
    debugStatusExposed: Boolean(mountPoints.debug),
    diagnosticRouteLinked: Boolean(mountPoints.diagnosticLink)
  });

  renderHEarthRouteStatus(mountPoints, nextStatus);

  return Object.freeze({
    initialized: true,
    status: nextStatus,
    mountPoints,
    chain,
    controllerBinding,
    rendererMount,
    compactReceipt: buildHEarthRouteBootstrapReceipt(nextStatus),
    publicReadout: buildHEarthPublicReadoutPayload(nextStatus.selectedObjectId),
    runtimeFailureCodes: Object.freeze(runtimeFailureCodes),
    renderInputSelector: selectHEarthRenderInput,
    publicBootstrapOnly: true,
    diagnosticRoute: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function destroyHEarthRoute(options = {}) {
  const destroyApi = getRendererDestroyApi();
  const mountPoints = resolveHEarthRouteMountPoints(
    getDocumentFromOptions(options)
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

      rendererDestroyed =
        isRendererDestroyReceiptDestroyed(rendererDestroyReceipt);
    } catch (error) {
      rendererDestroyError =
        error instanceof Error ? error.message : String(error);
      rendererDestroyed = false;
    }
  }

  const nextStatus = setRouteBootstrapStatus({
    bootstrapReadyCandidateOnly: false,
    bootstrapReadyDescriptorOnlyNoRendererMountApi: false,
    bootstrapFallbackActive: false,
    statusLevel:
      H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS.BOOTSTRAP_NOT_STARTED,
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
    selectedTargetCardUpdated: false,
    compactReadoutRendered: false
  });

  renderHEarthRouteStatus(mountPoints, nextStatus);

  return Object.freeze({
    destroyed: rendererDestroyed,
    rendererDestroyed,
    rendererDestroyAttempted,
    rendererDestroyReceipt,
    rendererDestroyError,
    rendererDestroyReceiptSummary:
      summarizeRendererDestroyReceipt(rendererDestroyReceipt),
    status: nextStatus,
    publicBootstrapOnly: true,
    diagnosticRoute: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,
    boundary: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS
  });
}

export function buildHEarthRouteBootstrapReceipt(
  status = latestRouteBootstrapStatus
) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_PUBLIC_ROUTE_BOOTSTRAP_RECEIPT_COMPACT',
    file: '/showroom/globe/h-earth/index.js',
    contractId: H_EARTH_3D_INDEX_CONTRACT.contractId,
    renewedFrom: H_EARTH_3D_INDEX_CONTRACT.renewedFrom,
    status: status.statusLevel,

    activationScope: H_EARTH_3D_INDEX_CONTRACT.activationScope,
    activationOption: H_EARTH_3D_INDEX_CONTRACT.activationOption,
    reportPrinciple: H_EARTH_3D_INDEX_CONTRACT.reportPrinciple,

    publicBootstrapOnly: true,
    diagnosticRouteSplit: true,
    diagnosticRoute: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute,

    diagnosticWallEmbedded: false,
    rawSpatialEvidenceEmbedded: false,
    spatialDiagnosticReceiptEmbedded: false,
    operationalReportSourceSummaryEmbedded: false,
    latticeScopeReaderEmbedded: false,
    reportCardClassificationEmbedded: false,
    receiptWallEmbedded: false,
    copySurfaceEmbedded: false,

    movedToDiagnosticRoute: Object.freeze({
      former029FReportLayer: true,
      former029FLatticeScopeReader: true,
      former029FSpatialDiagnosticReceipt: true,
      former029FSpatialDiagnosticEvidenceBundle: true,
      former029FOperationalReportSourceSummary: true,
      former029FAdvancedRawEvidenceSurfaces: true,
      destination: H_EARTH_3D_INDEX_CONTRACT.diagnosticRoute
    }),

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

    functionalStatusCleanup: Object.freeze({
      rendererMountedDerivedFromMountReceipt: true,
      rendererDestroyedDerivedFromDestroyReceipt: true,
      runtimeFailureCodesReportedForRendererMountFallback: true,
      missingRendererApiFallbackWarningOnly: true,
      noThrowDoesNotEqualMountSuccess: true,
      noThrowDoesNotEqualDestroySuccess: true,
      moduleLevelAutoStartAdded: false,
      externalHtmlBootstrapCallExpected: true
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
      summarizeRendererDestroyReceipt(status.rendererDestroyReceipt),

    failureCodes: status.failureCodes,
    warningCodes: status.warningCodes,

    routeRootFound: status.routeRootFound,
    statusNodeFound: status.statusNodeFound,
    fallbackNodeFound: status.fallbackNodeFound,
    rendererMountNodeFound: status.rendererMountNodeFound,

    targetListBound: status.targetListBound,
    inspectGroundControlBound: status.inspectGroundControlBound,
    selectedTargetCardUpdated: status.selectedTargetCardUpdated,
    compactReadoutRendered: status.compactReadoutRendered,
    debugStatusExposed: status.debugStatusExposed,
    diagnosticRouteLinked: status.diagnosticRouteLinked,

    selectedObjectId: status.selectedObjectId,
    selectedTargetClassification:
      getControllerTargetClassification(status.selectedObjectId) ||
      'UNCLASSIFIED_TARGET',

    publicReadoutSummary: Object.freeze({
      action: 'Inspect Ground',
      readout: 'Ground Condition Read',
      receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      descriptorOnly: true,
      runtimeActionExecutionClaim: false,
      receiptCreationClaim: false,
      runtimeReceiptPersistence: false
    }),

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
  diagnosticRoute: '/showroom/globe/h-earth/diagnostic/',
  sourceRoot: '/h-earth-3d/',

  contract: H_EARTH_3D_INDEX_CONTRACT,
  boundChain: H_EARTH_3D_INDEX_BOUND_CHAIN,
  mountContract: H_EARTH_3D_ROUTE_MOUNT_CONTRACT,
  boundaryFlags: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
  failureCodes: H_EARTH_3D_ROUTE_FAILURE_CODES,
  bootstrapOrder: H_EARTH_3D_ROUTE_BOOTSTRAP_ORDER,
  statusLevels: H_EARTH_3D_ROUTE_BOOTSTRAP_STATUS_LEVELS,

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
  secondarySurfaceContextResponses:
    H_EARTH_3D_SECONDARY_SURFACE_CONTEXT_RESPONSES,
  waterAtmosphericContextResponses:
    H_EARTH_3D_WATER_ATMOSPHERIC_CONTEXT_RESPONSES,
  blockedBehaviorResponses: H_EARTH_3D_BLOCKED_BEHAVIOR_RESPONSES,
  composedFrameSelectionReferences:
    H_EARTH_3D_COMPOSED_FRAME_SELECTION_REFERENCES,

  getRouteBootstrapStatus,
  getIndexReceipt,
  getRouteBootstrapReceipt,

  getRendererMountApi,
  getRendererDestroyApi,
  getRendererMountApiSource,
  getRendererDestroyApiSource,
  isRendererMountReceiptMounted,
  isRendererDestroyReceiptDestroyed,

  verifyHEarthRouteBoundChain,
  resolveHEarthRouteMountPoints,

  buildHEarthPublicReadoutPayload,
  renderHEarthSelectedTargetCard,
  renderHEarthPublicReadout,
  createTargetButtonDescriptor,
  renderHEarthTargetList,
  selectHEarthPublicTarget,
  bindHEarthInspectionControls,

  attemptHEarthRendererMount,
  renderHEarthRouteStatus,
  initializeHEarthRoute,
  destroyHEarthRoute,

  receipt: H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT,
  getReceipt: getIndexReceipt
});

export default H_EARTH_3D_INDEX;
