// /showroom/globe/h-earth/diagnostic/index.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033F_PANEL_WRITE_AND_GEOMETRY_CONTRACT_CORRECTION_v1
//
// Renews:
// H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033E_LIVE_PUBLIC_RENDERER_SYNC_EVIDENCE_REQUEST_v1
//
// Preserves repair:
// Removes the unsupported named import `buildHEarthPublicReadoutPayload` from
// ../index.js and removes the same symbol from the diagnostic aggregate export.
// The diagnostic route must not require the public route to export a public
// readout helper.
//
// Preserves clarification:
// The diagnostic route imports /showroom/globe/h-earth/index.js as a module.
// That imported public module state is not the same thing as the already-mounted
// live public route page at /showroom/globe/h-earth/. Therefore, reports
// distinguish imported static public module state from live public route DOM
// bootstrap state.
//
// Preserves 033E renewal:
// Adds live public renderer/geometry sync evidence request logic. The diagnostic
// route still does not claim that it can observe the mounted public route, but it
// exposes the exact public-route receipt extractor and classifies live public
// renderer evidence when such a receipt is supplied/imported.
//
// New 033F renewal:
// 1. Corrects expected geometry contract to the actual 032D geometry file:
//    H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032D_ORGANIC_LANDSCAPE_CHILD_VARIATION_v1
// 2. Adds the live-public-renderer-sync payload panel mount ID to the diagnostic
//    mount contract.
// 3. Writes payloads.livePublicRendererSync into
//    h-earth-3d-live-public-renderer-sync-payload.
// 4. Exposes panel write evidence in renderResult:
//    livePublicRendererSyncPayloadPanelWriteAttempted,
//    livePublicRendererSyncPayloadPanelFound,
//    livePublicRendererSyncPayloadPanelWritten.
// 5. Exposes globalThis.H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_REQUEST after
//    initialization for quick public evidence handoff.
//
// Extracts diagnostic/report logic from:
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1
//
// Complements:
// H_EARTH_3D_DIAGNOSTIC_ROUTE_SHELL_FILE_BIRTH_STEP_033F_LIVE_PUBLIC_RENDERER_SYNC_PANEL_v1
// H_EARTH_3D_DIAGNOSTIC_ROUTE_STYLE_FILE_BIRTH_STEP_033G_LIVE_PUBLIC_RENDERER_SYNC_PANEL_v1
// H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_032G_ENVIRONMENT_021B_DESCRIPTOR_EXPOSURE_SYNC_v1
// H_EARTH_3D_ROUTE_SHELL_FILE_BIRTH_STEP_033G_PUBLIC_SHELL_ANCHOR_RESTORATION_FOR_LANDSCAPE_GRAMMAR_v1
// H_EARTH_3D_ROUTE_SHELL_STYLE_FILE_BIRTH_STEP_033H_030F_LANDSCAPE_GRAMMAR_RESTORATION_CURRENT_RENDERER_SYNC_v1
//
// Purpose:
// Dedicated H-Earth diagnostic route bootstrap.
// Owns operational reports, compact spatial diagnostics, advanced raw evidence,
// lattice-scope evidence reading, receipt payloads, boundary payloads, copy
// surfaces, public-state scope clarification, live-public renderer sync evidence
// request, live-public sync payload panel write, and diagnostic route status.
//
// Boundary:
// Diagnostic/report route only. Does not mount the public scene renderer as a
// visual route. Does not create scene geometry. Does not mutate renderer,
// compositor, environment, controller, capacity, public index, public HTML, or
// public CSS. No WebGL. No canvas. No SVG. No iframe. No final renderer claim.
// No renderer-pass claim. No visual-pass claim. No validation claim. No
// production claim. No traversal. No survival simulation. No swimming.
// No fluid simulation. No manor interior access. No distant traversal.
// No runtime lattice activation. No active 16x16 runtime lattice claim.
// No active 256-address runtime claim. No Mirror Manor route-canon naming.
// No matrix collapse.

import {
  H_EARTH_3D_CAPACITY,
  H_EARTH_3D_CAPACITY_RECEIPT,
  H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
  getCapacityReceipt
} from '../capacity.js';

import {
  H_EARTH_3D_ENVIRONMENT,
  H_EARTH_3D_ENVIRONMENT_RECEIPT,
  getEnvironmentReceipt
} from '../environment.js';

import {
  H_EARTH_3D_RENDERER,
  H_EARTH_3D_RENDERER_RECEIPT,
  H_EARTH_3D_CANDIDATE_RENDER_SCENE,
  H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
  H_EARTH_3D_RENDER_VOLUME_MODEL,
  H_EARTH_3D_RENDER_PORTS,
  getRendererReceipt
} from '../renderer.js';

import {
  H_EARTH_3D_COMPOSITOR,
  H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
  H_EARTH_3D_COMPOSITOR_RECEIPT,
  H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
  getCompositorReceipt
} from '../compositor.js';

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
  getControllerReceipt
} from '../controller.js';

import {
  H_EARTH_3D_INDEX,
  H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT,
  H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
  getRouteBootstrapReceipt,
  getRouteBootstrapStatus
} from '../index.js';

export const H_EARTH_EXPECTED_RENDERER_CONTRACT =
  'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_032E_GEOMETRY_032D_ORGANIC_VARIATION_SYNC_v1';

export const H_EARTH_EXPECTED_GEOMETRY_CONTRACT =
  'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_032D_ORGANIC_LANDSCAPE_CHILD_VARIATION_v1';

export const H_EARTH_3D_PUBLIC_ROUTE_RENDERER_SYNC_EXTRACTOR = `copy(JSON.stringify({
  rendererReceiptContract:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.contractId || null,
  complementaryGeometryPort:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.complementaryGeometryPort || null,
  geometryReceiptContract:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.geometryReceipt?.contractId || null,
  rendererMounted:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.rendererMounted || false,
  geometryExpandedNodeCount:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.geometryExpandedNodeCount || null,
  geometryParentNodeCount:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.geometryParentNodeCount || null,
  geometryChildNodeCount:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.geometryChildNodeCount || null,
  geometryOrganicVariationApplied:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.geometryOrganicVariationApplied || false,
  organicLandscapeChildVariationDefined:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.organicLandscapeChildVariationDefined || false,
  primitiveSpecificChildPlacementApplied:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.primitiveSpecificChildPlacementApplied || false,
  latticeRegularBandingMitigated:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.latticeRegularBandingMitigated || false,
  organicVariationSeededDeterministically:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.organicVariationSeededDeterministically || false,
  randomRuntimeVariationUsed:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.randomRuntimeVariationUsed || false,
  organicClassEmissionCount:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.organicClassEmissionCount || 0,
  organicVariationReadyCount:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.organicVariationReadyCount || 0,
  warningCodes:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.warningCodes || [],
  failureCodes:
    globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.rendererMountReceipt?.failureCodes || []
}, null, 2));`;

export const H_EARTH_3D_DIAGNOSTIC_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033F_PANEL_WRITE_AND_GEOMETRY_CONTRACT_CORRECTION_v1',
  renews:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033E_LIVE_PUBLIC_RENDERER_SYNC_EVIDENCE_REQUEST_v1',
  previousRenewal:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033D_2_PUBLIC_STATE_SCOPE_CLARIFICATION_v1',
  extractedFrom:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',

  file: '/showroom/globe/h-earth/diagnostic/index.js',
  route: '/showroom/globe/h-earth/diagnostic/',
  publicRoute: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass:
    'DEDICATED_DIAGNOSTIC_ROUTE_BOOTSTRAP_REPORT_EVIDENCE_RECEIPT_SURFACE_WITH_LIVE_PUBLIC_RENDERER_SYNC_PANEL_WRITE',
  activationScope:
    'AUTHORIZED_DIAGNOSTIC_ROUTE_SIDE_REPORT_EVIDENCE_EXPOSURE_ONLY',

  repair: Object.freeze({
    importContractRepair: true,
    removedUnsupportedPublicReadoutImport: true,
    removedUnsupportedPublicReadoutAggregateMember: true,
    unsupportedImportRemoved: 'buildHEarthPublicReadoutPayload',
    publicRouteMutationRequired: false
  }),

  renewalScope: Object.freeze({
    publicStateScopeClarificationPreserved: true,
    livePublicRendererSyncEvidenceRequestDefined: true,
    publicRouteConsoleExtractorExposed: true,
    rendererGeometrySyncDecisionBlockDefined: true,
    diagnosticStillDoesNotClaimLivePublicRendererMount: true,
    importedRendererReceiptComparisonDefined: true,
    expectedRendererContractExposed: true,
    expectedGeometryContractCorrectedToChildVariation032D: true,
    nextLaneClassificationDefined: true,
    copyPayloadsReceiveRendererSyncRequest: true,
    reportCardsReceiveRendererSyncRequest: true,
    livePublicRendererSyncPanelMountIdRegistered: true,
    livePublicRendererSyncPanelWriteEvidenceDefined: true,
    livePublicRendererSyncGlobalRequestExposedAfterInitialization: true
  }),

  publicStateScopeClarification: Object.freeze({
    importedPublicModuleState: true,
    importedPublicModuleStateIsLivePublicPageState: false,
    livePublicRouteStateObservableFromDiagnosticPage: false,
    livePublicRouteReceiptRequiredFromPublicPage: true,
    livePublicRouteReceiptGlobalName:
      'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    livePublicRouteResultGlobalName:
      'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT',
    diagnosticRouteMayReadStaticDescriptors: true,
    diagnosticRouteMayNotClaimLivePublicRendererMount: true
  }),

  livePublicRendererSyncTarget: Object.freeze({
    expectedRendererContract: H_EARTH_EXPECTED_RENDERER_CONTRACT,
    expectedGeometryContract: H_EARTH_EXPECTED_GEOMETRY_CONTRACT,
    publicRouteRendererSyncExtractorDefined: true,
    extractorPurpose:
      'Copy compact renderer/geometry/organic-class evidence from the live public route page context.',
    requiredPublicPage: '/showroom/globe/h-earth/',
    requiredPublicGlobal: 'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    diagnosticPayloadPanelId: 'h-earth-3d-live-public-renderer-sync-payload'
  }),

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  reportPrinciple: 'Receipts prove. Reports diagnose. Scene remains primary.',

  diagnosticOwnership: Object.freeze({
    operationalReportSourceSummary: true,
    compactSpatialDiagnosticReceipt: true,
    advancedRawEvidenceBundle: true,
    latticeScopeEvidenceReader: true,
    importedPublicModuleStateExposure: true,
    livePublicRouteStateClarification: true,
    livePublicRendererSyncEvidenceRequest: true,
    livePublicRendererSyncPayloadPanelWrite: true,
    publicRouteRendererSyncExtractorExposure: true,
    rendererMountReceiptExposure: true,
    composedFramePayloadExposure: true,
    compositorReceiptPayloadExposure: true,
    rendererPlacementPayloadExposure: true,
    environmentPlacementPayloadExposure: true,
    routeBootstrapReceiptExposure: true,
    boundaryFlagsExposure: true,
    indexContractExposure: true,
    copySurface: true,
    reportWall: true
  }),

  publicRouteOwnershipDenied: Object.freeze({
    mountsPublicRenderer: false,
    createsSceneGeometry: false,
    mutatesPublicRouteShell: false,
    mutatesPublicRouteCss: false,
    mutatesPublicRouteBootstrap: false,
    requiresPublicReadoutHelperExport: false,
    observesMountedPublicRouteDom: false,
    claimsLivePublicRendererMount: false
  }),

  boundaryClaims: Object.freeze({
    mutatesGitHub: false,
    installsRoute: false,
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
    claimsLivePublicPageBootstrap: false,
    claimsLivePublicRendererMount: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS = Object.freeze({
  diagnosticRouteOnly: true,
  reportEvidenceExposureOnly: true,
  reportWallAllowed: true,
  receiptPayloadExposureAllowed: true,
  compactReceiptAllowed: true,
  advancedRawEvidenceBundleAllowed: true,
  copySurfaceAllowed: true,
  latticeScopeEvidenceReadingAllowed: true,
  importedPublicModuleStateReadingAllowed: true,
  livePublicRouteStateObservableFromDiagnosticPage: false,
  livePublicRendererMountClaimFromDiagnosticPage: false,

  publicSceneRendererMount: false,
  publicRouteMutation: false,
  publicCssMutation: false,
  sourceMutation: false,
  repositoryMutation: false,
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
  latticeActivationClaim: false,
  active16x16LatticeClaim: false,
  active256AddressRuntimeClaim: false,
  mirrorManorRouteCanonNameClaim: false,
  matrixCollapse: false,
  claimBoundaryPreserved: true
});

export const H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT = Object.freeze({
  strictRequiredIds: Object.freeze({
    routeRoot: 'h-earth-3d-diagnostic-route-root',
    status: 'h-earth-3d-diagnostic-status'
  }),

  payloadIds: Object.freeze({
    operationalReportStack: 'h-earth-3d-operational-report-stack-payload',
    reportLayerStatus: 'h-earth-3d-report-layer-status',
    spatialSummary: 'h-earth-3d-spatial-summary-payload',
    livePublicRendererSync: 'h-earth-3d-live-public-renderer-sync-payload',
    composedFrame: 'h-earth-3d-composed-frame-payload',
    compositorReceipt: 'h-earth-3d-compositor-receipt-payload',
    rendererPlacement: 'h-earth-3d-renderer-placement-payload',
    environmentPlacement: 'h-earth-3d-environment-placement-payload',
    routeBootstrapReceipt: 'h-earth-3d-route-bootstrap-receipt',
    rendererMountReceipt: 'h-earth-3d-renderer-mount-receipt',
    boundaryFlags: 'h-earth-3d-boundary-flags',
    indexContract: 'h-earth-3d-index-contract',
    diagnosticContract: 'h-earth-3d-diagnostic-contract',
    copyStatus: 'h-earth-3d-copy-status'
  }),

  optionalIds: Object.freeze({
    reportCards: 'h-earth-3d-report-cards',
    copyAllButton: 'h-earth-3d-copy-all',
    copyCompactButton: 'h-earth-3d-copy-compact',
    copyRawButton: 'h-earth-3d-copy-raw',
    publicRouteLink: 'h-earth-3d-public-route-link'
  })
});

export const H_EARTH_3D_LATTICE_SCOPE_STATUS = Object.freeze({
  SCENE_SCOPED_LATTICE_NOT_EXPOSED: 'SCENE_SCOPED_LATTICE_NOT_EXPOSED',
  LATTICE_SCOPE_HINTS_PRESENT: 'LATTICE_SCOPE_HINTS_PRESENT',
  LATTICE_SCOPE_RECEIPT_EXPOSED: 'LATTICE_SCOPE_RECEIPT_EXPOSED',
  SCENE_SCOPED_16X16_LATTICE_EXPOSED:
    'SCENE_SCOPED_16X16_LATTICE_EXPOSED'
});

export const H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS = Object.freeze({
  DIAGNOSTIC_NOT_STARTED: 'DIAGNOSTIC_NOT_STARTED',
  DIAGNOSTIC_READY: 'DIAGNOSTIC_READY',
  DIAGNOSTIC_PARTIAL: 'DIAGNOSTIC_PARTIAL',
  DIAGNOSTIC_FALLBACK_ACTIVE: 'DIAGNOSTIC_FALLBACK_ACTIVE'
});

export const H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS = Object.freeze({
  PUBLIC_ROUTE_IMPORTED_STATIC_STATE:
    'PUBLIC_ROUTE_IMPORTED_STATIC_STATE',
  PUBLIC_ROUTE_LIVE_BOOTSTRAP_NOT_OBSERVABLE_FROM_DIAGNOSTIC_ROUTE:
    'PUBLIC_ROUTE_LIVE_BOOTSTRAP_NOT_OBSERVABLE_FROM_DIAGNOSTIC_ROUTE',
  PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED_FROM_PUBLIC_PAGE:
    'PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED_FROM_PUBLIC_PAGE'
});

export const H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS = Object.freeze({
  PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED: 'PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED',
  LIVE_PUBLIC_RECEIPT_PRESENT: 'LIVE_PUBLIC_RECEIPT_PRESENT',
  RENDERER_STALE: 'RENDERER_STALE',
  GEOMETRY_STALE: 'GEOMETRY_STALE',
  ORGANIC_EVIDENCE_PRESENT: 'ORGANIC_EVIDENCE_PRESENT',
  ORGANIC_CLASS_SURFACE_MISSING: 'ORGANIC_CLASS_SURFACE_MISSING',
  CSS_INTERPRETATION_NEXT: 'CSS_INTERPRETATION_NEXT',
  NODE_FACTORY_OR_MATERIAL_CLASS_SURFACE_NEXT:
    'NODE_FACTORY_OR_MATERIAL_CLASS_SURFACE_NEXT',
  DEPLOYMENT_CACHE_OR_STALE_FILE_NEXT:
    'DEPLOYMENT_CACHE_OR_STALE_FILE_NEXT',
  FAILURE_CODE_NEXT: 'FAILURE_CODE_NEXT'
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

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function nowIso() {
  return new Date().toISOString();
}

function getDocumentFromOptions(options = {}) {
  return options.document || globalThis.document || null;
}

function getObjectKeys(value) {
  if (!value || typeof value !== 'object') return [];
  return Object.keys(value);
}

function safeSerialize(value, options = {}) {
  const maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 7;
  const maxArrayLength = Number.isFinite(options.maxArrayLength)
    ? options.maxArrayLength
    : 96;
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

function lowerSerialized(value) {
  try {
    return JSON.stringify(
      safeSerialize(value, { maxDepth: 6, maxArrayLength: 120 })
    ).toLowerCase();
  } catch (_error) {
    return '';
  }
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

function resolveDiagnosticMountPoints(rootDocument = globalThis.document) {
  const strictIds = H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.strictRequiredIds;
  const payloadIds = H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.payloadIds;
  const optionalIds = H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.optionalIds;

  if (!rootDocument || typeof rootDocument.getElementById !== 'function') {
    return Object.freeze({
      documentAvailable: false,
      routeRoot: null,
      statusNode: null,
      operationalReportStack: null,
      reportLayerStatus: null,
      spatialSummary: null,
      livePublicRendererSyncPayload: null,
      composedFramePayload: null,
      compositorReceiptPayload: null,
      rendererPlacementPayload: null,
      environmentPlacementPayload: null,
      routeBootstrapReceiptPayload: null,
      rendererMountReceiptPayload: null,
      boundaryFlagsPayload: null,
      indexContractPayload: null,
      diagnosticContractPayload: null,
      copyStatus: null,
      reportCards: null,
      copyAllButton: null,
      copyCompactButton: null,
      copyRawButton: null,
      publicRouteLink: null,
      strictRequiredFound: false,
      missingStrictRequiredIds: Object.freeze([
        strictIds.routeRoot,
        strictIds.status
      ])
    });
  }

  const routeRoot = rootDocument.getElementById(strictIds.routeRoot);
  const statusNode = rootDocument.getElementById(strictIds.status);

  const missingStrictRequiredIds = [];

  if (!routeRoot) missingStrictRequiredIds.push(strictIds.routeRoot);
  if (!statusNode) missingStrictRequiredIds.push(strictIds.status);

  return Object.freeze({
    documentAvailable: true,
    routeRoot,
    statusNode,

    operationalReportStack:
      rootDocument.getElementById(payloadIds.operationalReportStack),
    reportLayerStatus:
      rootDocument.getElementById(payloadIds.reportLayerStatus),
    spatialSummary:
      rootDocument.getElementById(payloadIds.spatialSummary),
    livePublicRendererSyncPayload:
      rootDocument.getElementById(payloadIds.livePublicRendererSync),
    composedFramePayload:
      rootDocument.getElementById(payloadIds.composedFrame),
    compositorReceiptPayload:
      rootDocument.getElementById(payloadIds.compositorReceipt),
    rendererPlacementPayload:
      rootDocument.getElementById(payloadIds.rendererPlacement),
    environmentPlacementPayload:
      rootDocument.getElementById(payloadIds.environmentPlacement),
    routeBootstrapReceiptPayload:
      rootDocument.getElementById(payloadIds.routeBootstrapReceipt),
    rendererMountReceiptPayload:
      rootDocument.getElementById(payloadIds.rendererMountReceipt),
    boundaryFlagsPayload:
      rootDocument.getElementById(payloadIds.boundaryFlags),
    indexContractPayload:
      rootDocument.getElementById(payloadIds.indexContract),
    diagnosticContractPayload:
      rootDocument.getElementById(payloadIds.diagnosticContract),
    copyStatus:
      rootDocument.getElementById(payloadIds.copyStatus),

    reportCards:
      rootDocument.getElementById(optionalIds.reportCards),
    copyAllButton:
      rootDocument.getElementById(optionalIds.copyAllButton),
    copyCompactButton:
      rootDocument.getElementById(optionalIds.copyCompactButton),
    copyRawButton:
      rootDocument.getElementById(optionalIds.copyRawButton),
    publicRouteLink:
      rootDocument.getElementById(optionalIds.publicRouteLink),

    strictRequiredFound: missingStrictRequiredIds.length === 0,
    missingStrictRequiredIds: Object.freeze(missingStrictRequiredIds)
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

function summarizeImportedPublicModuleState(routeStatus = getRouteBootstrapStatus()) {
  const publicReceipt = getRouteBootstrapReceipt();

  return Object.freeze({
    receiptType: 'H_EARTH_3D_IMPORTED_PUBLIC_MODULE_STATE_SCOPE',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    status:
      H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS.PUBLIC_ROUTE_IMPORTED_STATIC_STATE,
    publicRouteModule: '/showroom/globe/h-earth/index.js',
    publicRoutePage: '/showroom/globe/h-earth/',
    importedPublicModuleState: true,
    importedPublicModuleStateIsLivePublicPageState: false,
    livePublicRouteStateObservableFromDiagnosticPage: false,
    livePublicRouteReceiptRequiredFromPublicPage: true,
    requiredPublicPageGlobals: Object.freeze([
      'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
      'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RESULT'
    ]),

    importedStatus: routeStatus?.status || routeStatus?.statusLevel || null,
    importedReceiptStatus: publicReceipt?.status || null,

    importedDomProbe: Object.freeze({
      routeRootFound: routeStatus?.routeRootFound === true,
      statusNodeFound: routeStatus?.statusNodeFound === true,
      fallbackNodeFound: routeStatus?.fallbackNodeFound === true,
      rendererMountNodeFound: routeStatus?.rendererMountNodeFound === true,
      note:
        'False values here are expected when ../index.js is imported by the diagnostic page, because the diagnostic page does not contain the public route DOM mount IDs.'
    }),

    importedRendererMountState: Object.freeze({
      rendererMountAttempted: routeStatus?.rendererMountAttempted === true,
      rendererMounted: routeStatus?.rendererMounted === true,
      rendererMountReceiptPresent: Boolean(routeStatus?.rendererMountReceipt),
      rendererMountReceiptIsLivePublicRouteProof: false,
      note:
        'This diagnostic route does not mount the public renderer. Live renderer mount must be confirmed on the public route page.'
    }),

    publicRouteDomIdsNotExpectedOnDiagnosticPage: Object.freeze([
      'h-earth-3d-route-root',
      'h-earth-3d-status',
      'h-earth-3d-fallback',
      'h-earth-3d-renderer-mount'
    ]),

    sourceDescriptorEvidenceStillReadable: Object.freeze({
      publicIndexAggregatePresent: Boolean(H_EARTH_3D_INDEX),
      publicRouteBootstrapReceiptPresent: Boolean(publicReceipt),
      capacityReceiptPresent: Boolean(getCapacityReceipt()),
      environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
      rendererReceiptPresent: Boolean(getRendererReceipt()),
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      controllerReceiptPresent: Boolean(getControllerReceipt()),
      candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE),
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME)
    }),

    boundary: Object.freeze({
      diagnosticRouteOnly: true,
      importedModuleStateOnly: true,
      livePublicPageStateClaim: false,
      publicRendererMountClaim: false,
      publicRouteMutation: false,
      matrixCollapse: false
    })
  });
}

export function getImportedPublicModuleStateReceipt() {
  return summarizeImportedPublicModuleState(getRouteBootstrapStatus());
}

function summarizeRendererMountReceipt(receipt) {
  if (!receipt) return null;

  return Object.freeze({
    receiptType: receipt.receiptType || null,
    contractId: receipt.contractId || null,
    complementaryGeometryPort: receipt.complementaryGeometryPort || null,
    geometryReceiptContractId: receipt.geometryReceipt?.contractId || null,

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
    geometrySourceNodeCount: receipt.geometrySourceNodeCount ?? null,
    geometryExpandedNodeCount: receipt.geometryExpandedNodeCount ?? null,
    geometryReturnedNodeCount: receipt.geometryReturnedNodeCount ?? null,
    geometrySkippedNodeCount: receipt.geometrySkippedNodeCount ?? null,
    geometryBudgetSkippedNodeCount:
      receipt.geometryBudgetSkippedNodeCount ?? null,
    geometryParentNodeCount: receipt.geometryParentNodeCount ?? null,
    geometryChildNodeCount: receipt.geometryChildNodeCount ?? null,

    geometryOrganicVariationApplied:
      receipt.geometryOrganicVariationApplied === true,
    organicLandscapeChildVariationDefined:
      receipt.organicLandscapeChildVariationDefined === true,
    primitiveSpecificChildPlacementApplied:
      receipt.primitiveSpecificChildPlacementApplied === true,
    latticeRegularBandingMitigated:
      receipt.latticeRegularBandingMitigated === true,
    organicVariationSeededDeterministically:
      receipt.organicVariationSeededDeterministically === true,
    randomRuntimeVariationUsed:
      receipt.randomRuntimeVariationUsed === true,
    organicVariationSummary: receipt.organicVariationSummary || null,
    organicClassEmissionCount: receipt.organicClassEmissionCount ?? 0,
    organicVariationReadyCount: receipt.organicVariationReadyCount ?? 0,

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

export function classifyHEarthLivePublicRendererSyncEvidence(liveReceipt = null) {
  const mountReceipt = liveReceipt?.rendererMountReceipt || liveReceipt || null;

  if (!mountReceipt) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED,
      nextLane: 'PUBLIC_ROUTE_RECEIPT_COLLECTION',
      reason:
        'Diagnostic route cannot observe live public page mount. Public route receipt is required.',
      livePublicReceiptPresent: false,
      diagnosticCanObserveLivePublicPage: false,
      requiredPublicPage: '/showroom/globe/h-earth/',
      requiredPublicGlobal: 'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  const rendererContract = mountReceipt.contractId || null;
  const geometryContract = mountReceipt.geometryReceipt?.contractId || null;
  const warningCodes = asArray(mountReceipt.warningCodes);
  const failureCodes = asArray(mountReceipt.failureCodes);

  if (failureCodes.length > 0 || warningCodes.length > 0) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.FAILURE_CODE_NEXT,
      nextLane: 'FIRST_WARNING_OR_FAILURE_CODE',
      reason:
        'Live public mount receipt contains warning/failure evidence.',
      firstWarningCode: warningCodes[0] || null,
      firstFailureCode: failureCodes[0] || null,
      livePublicReceiptPresent: true,
      rendererContract,
      geometryContract,
      warningCodes: Object.freeze(warningCodes),
      failureCodes: Object.freeze(failureCodes),
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  if (rendererContract !== H_EARTH_EXPECTED_RENDERER_CONTRACT) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.RENDERER_STALE,
      nextLane: 'DEPLOYMENT_CACHE_OR_RENDERER_FILE',
      reason:
        'Live public mount is not using the expected renderer contract.',
      expectedRendererContract: H_EARTH_EXPECTED_RENDERER_CONTRACT,
      observedRendererContract: rendererContract,
      livePublicReceiptPresent: true,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  if (geometryContract !== H_EARTH_EXPECTED_GEOMETRY_CONTRACT) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.GEOMETRY_STALE,
      nextLane: 'DEPLOYMENT_CACHE_OR_GEOMETRY_FILE',
      reason:
        'Live public mount is not using the expected geometry contract.',
      expectedGeometryContract: H_EARTH_EXPECTED_GEOMETRY_CONTRACT,
      observedGeometryContract: geometryContract,
      livePublicReceiptPresent: true,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  const organicApplied =
    mountReceipt.geometryOrganicVariationApplied === true ||
    mountReceipt.organicLandscapeChildVariationDefined === true ||
    mountReceipt.primitiveSpecificChildPlacementApplied === true ||
    mountReceipt.latticeRegularBandingMitigated === true;

  const organicClassCount = Number(mountReceipt.organicClassEmissionCount || 0);
  const organicReadyCount = Number(mountReceipt.organicVariationReadyCount || 0);

  if (organicApplied && organicClassCount > 0 && organicReadyCount > 0) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.CSS_INTERPRETATION_NEXT,
      nextLane: 'CSS_INTERPRETATION',
      reason:
        'Renderer and geometry are current, organic evidence exists, and organic class surface reached DOM.',
      livePublicReceiptPresent: true,
      rendererContract,
      geometryContract,
      organicClassEmissionCount: organicClassCount,
      organicVariationReadyCount: organicReadyCount,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  if (organicApplied && organicClassCount === 0) {
    return Object.freeze({
      status:
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.NODE_FACTORY_OR_MATERIAL_CLASS_SURFACE_NEXT,
      nextLane: 'NODE_FACTORY_OR_MATERIAL_CLASS_SURFACE',
      reason:
        'Geometry organic evidence exists, but organic class surface did not reach mounted DOM.',
      livePublicReceiptPresent: true,
      rendererContract,
      geometryContract,
      organicClassEmissionCount: organicClassCount,
      organicVariationReadyCount: organicReadyCount,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  return Object.freeze({
    status:
      H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.LIVE_PUBLIC_RECEIPT_PRESENT,
    nextLane: 'RENDERER_GEOMETRY_RECEIPT_REVIEW',
    reason:
      'Live receipt is present, but organic evidence is not clearly exposed.',
    livePublicReceiptPresent: true,
    rendererContract,
    geometryContract,
    organicClassEmissionCount: organicClassCount,
    organicVariationReadyCount: organicReadyCount,
    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });
}

export function buildHEarthLivePublicRendererSyncRequest(
  routeStatus = getRouteBootstrapStatus()
) {
  const importedMountReceipt = routeStatus?.rendererMountReceipt || null;
  const classification =
    classifyHEarthLivePublicRendererSyncEvidence(importedMountReceipt);

  return Object.freeze({
    receiptType: 'H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_REQUEST_COMPACT',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    status: classification.status,
    ...H_EARTH_SCENE_IDENTITY,

    diagnosticCanObserveLivePublicPage: false,
    diagnosticCanClaimLivePublicRendererMount: false,
    importedPublicModuleStateOnly: true,
    livePublicRouteReceiptRequired: true,

    requiredPublicPage: '/showroom/globe/h-earth/',
    requiredPublicGlobal:
      'globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT',
    publicRouteRendererSyncExtractor:
      H_EARTH_3D_PUBLIC_ROUTE_RENDERER_SYNC_EXTRACTOR,

    expectedRendererContract: H_EARTH_EXPECTED_RENDERER_CONTRACT,
    expectedGeometryContract: H_EARTH_EXPECTED_GEOMETRY_CONTRACT,

    importedRendererReceiptContract:
      getRendererReceipt()?.contractId || null,
    importedGeometryPortContract:
      H_EARTH_3D_RENDER_PORTS?.geometryPort?.contract?.contractId ||
      H_EARTH_3D_RENDER_PORTS?.geometryPort?.receipt?.contractId ||
      null,

    expectedGeometryContractMatchesImportedGeometryPort:
      (
        H_EARTH_3D_RENDER_PORTS?.geometryPort?.contract?.contractId ||
        H_EARTH_3D_RENDER_PORTS?.geometryPort?.receipt?.contractId ||
        null
      ) === H_EARTH_EXPECTED_GEOMETRY_CONTRACT,

    importedRendererMountReceiptPresent: Boolean(importedMountReceipt),
    importedRendererMountReceiptIsLivePublicRouteProof: false,

    classification,

    decisionRules: Object.freeze({
      rendererStale:
        'If live public receipt renderer contract is not expected renderer contract, inspect deployment/cache or renderer.js.',
      geometryStale:
        'If live public receipt geometry contract is not expected geometry contract, inspect deployment/cache or render/geometry.js.',
      organicEvidencePresentClassesPresent:
        'If organic evidence and organic DOM classes are present, next lane is CSS interpretation.',
      organicEvidencePresentClassesMissing:
        'If organic evidence exists but organic DOM classes are missing, next lane is node factory/material class surface.',
      warningOrFailurePresent:
        'If warning/failure codes exist, follow first concrete code.'
    }),

    boundary: Object.freeze({
      diagnosticRouteOnly: true,
      evidenceRequestOnly: true,
      livePublicPageStateClaim: false,
      publicRendererMountClaim: false,
      publicRouteMutation: false,
      publicCssMutation: false,
      sourceMutation: false,
      repositoryMutation: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    })
  });
}

export function getLivePublicRendererSyncRequest() {
  return buildHEarthLivePublicRendererSyncRequest(getRouteBootstrapStatus());
}

export function getLivePublicRendererSyncReceipt() {
  return getLivePublicRendererSyncRequest();
}

function extractComposedNodes(frame) {
  if (!frame) return null;

  if (Array.isArray(frame.composedNodes)) return frame.composedNodes;
  if (Array.isArray(frame.nodes)) return frame.nodes;
  if (Array.isArray(frame.candidateNodes)) return frame.candidateNodes;

  return null;
}

function summarizeComposedFrame(frame = H_EARTH_3D_COMPOSED_CANDIDATE_FRAME) {
  if (!frame) return null;

  const composedNodes = extractComposedNodes(frame);

  return Object.freeze({
    framePresent: true,
    id: frame.id || frame.frameId || null,
    status: frame.status || null,
    matrix: frame.matrix || 'H-Earth',
    matrixRole: frame.matrixRole || 'Ground-View Matrix',
    sceneIdentity:
      frame.sceneIdentity || 'earth-water-air-survival-shoreline-manor',
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
      ? composedNodes.slice(0, 24).map((node) =>
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

  const resolvedDetectedTokens = Array.isArray(receipt.detectedSceneTokens)
    ? [...receipt.detectedSceneTokens]
    : [...detectedSceneTokens];

  const resolvedExpectedTokens = Array.isArray(receipt.expectedSceneTokens)
    ? [...receipt.expectedSceneTokens]
    : [...H_EARTH_EXPECTED_ENVIRONMENT_TOKENS];

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

    descriptorCoveragePresent: receipt.descriptorCoveragePresent === true,
    fullDescriptorCoverage: receipt.fullDescriptorCoverage === true,
    descriptorCoverageRatio: receipt.descriptorCoverageRatio ?? null,
    missingSceneTokens: Object.freeze([...asArray(receipt.missingSceneTokens)]),

    detectedSceneTokens: Object.freeze(resolvedDetectedTokens),
    expectedSceneTokens: Object.freeze(resolvedExpectedTokens),

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
    complementaryGeometryPort: receipt.complementaryGeometryPort || null,
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
    organicVariationSyncDefined:
      receipt.organicVariationSyncDefined ??
      receipt.geometryOrganicVariationSyncDefined ??
      null,
    boundaryPresent: Boolean(receipt.boundary)
  });
}

function summarizeRendererPlacement(routeStatus = getRouteBootstrapStatus()) {
  const candidateScene = H_EARTH_3D_CANDIDATE_RENDER_SCENE;
  const nodes = Array.isArray(candidateScene?.nodes) ? candidateScene.nodes : [];

  return Object.freeze({
    purpose:
      'Compact renderer placement summary for break-location classification.',
    rendererReceiptSummary: summarizeRendererReceipt(getRendererReceipt()),
    renderVolumeModelPresent: Boolean(H_EARTH_3D_RENDER_VOLUME_MODEL),
    renderPortsPresent: Boolean(H_EARTH_3D_RENDER_PORTS),
    candidateRenderScenePresent: Boolean(candidateScene),
    candidateRenderSceneParentDescriptorsOnly:
      candidateScene?.candidateRenderSceneParentDescriptorsOnly ?? null,
    candidateRenderSceneGeometryExpansionApplied:
      candidateScene?.geometryExpansionApplied ?? null,
    candidateRenderSceneGeometryExpansionDeferredUntilMountSelection:
      candidateScene?.geometryExpansionDeferredUntilMountSelection ?? null,
    candidateRenderSceneNodeCount:
      candidateScene?.nodeCount ??
      candidateScene?.sourceNodeCount ??
      nodes.length ??
      null,
    mountedReceiptSummary:
      summarizeRendererMountReceipt(routeStatus?.rendererMountReceipt),
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

  const combined = [
    lowerSerialized(H_EARTH_3D_CAPACITY),
    lowerSerialized(H_EARTH_3D_ENVIRONMENT),
    lowerSerialized(capacityReceipt),
    lowerSerialized(environmentReceipt)
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
      (combined.includes('shoreline') && combined.includes('manor')),
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
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
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
      active256AddressRuntimeClaim: false,
      mirrorManorRouteCanonNameClaim: false,
      matrixCollapse: false
    })
  });
}

export function getLatticeScopeReceipt() {
  return summarizeHEarthLatticeScope();
}

export function buildHEarthOperationalReportSourceSummary(
  routeStatus = getRouteBootstrapStatus()
) {
  const importedPublicModuleState =
    summarizeImportedPublicModuleState(routeStatus);
  const livePublicRendererSyncRequest =
    buildHEarthLivePublicRendererSyncRequest(routeStatus);
  const rendererMountSummary =
    summarizeRendererMountReceipt(routeStatus?.rendererMountReceipt);
  const environmentSummary = summarizeEnvironmentPlacement(getEnvironmentReceipt());
  const compositorSummary = summarizeCompositorReceipt(getCompositorReceipt());
  const composedFrameSummary = summarizeComposedFrame(
    H_EARTH_3D_COMPOSED_CANDIDATE_FRAME
  );
  const rendererPlacementSummary = summarizeRendererPlacement(routeStatus);
  const latticeScopeSummary = summarizeHEarthLatticeScope();

  return Object.freeze({
    receiptType: 'H_EARTH_3D_OPERATIONAL_REPORT_SOURCE_SUMMARY',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    status:
      routeStatus?.statusLevel ||
      routeStatus?.status ||
      H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_READY,
    generatedAt: nowIso(),
    ...H_EARTH_SCENE_IDENTITY,

    publicStateScope: importedPublicModuleState,
    livePublicRendererSyncRequest,

    routeReady: Object.freeze({
      scope:
        H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS.PUBLIC_ROUTE_IMPORTED_STATIC_STATE,
      importedStaticPublicModuleState: true,
      livePublicRouteStateObservableFromDiagnosticPage: false,
      livePublicRouteReceiptRequiredFromPublicPage: true,
      livePublicRendererSyncStatus: livePublicRendererSyncRequest.status,
      livePublicRendererSyncNextLane:
        livePublicRendererSyncRequest.classification?.nextLane || null,
      chainReady: routeStatus?.chainReady === true,
      domReady: routeStatus?.domReady === true,
      controllerReady: routeStatus?.controllerReady === true,
      rendererMountReady: routeStatus?.rendererMountReady === true,
      bootstrapReadyCandidateOnly:
        routeStatus?.bootstrapReadyCandidateOnly === true,
      bootstrapReadyDescriptorOnlyNoRendererMountApi:
        routeStatus?.bootstrapReadyDescriptorOnlyNoRendererMountApi === true,
      bootstrapFallbackActive: routeStatus?.bootstrapFallbackActive === true,
      failureCodes: Object.freeze(asArray(routeStatus?.failureCodes)),
      warningCodes: Object.freeze(asArray(routeStatus?.warningCodes)),
      interpretation:
        'These booleans describe the imported ../index.js module inside the diagnostic page, not the mounted public route page.'
    }),

    evidenceAvailability: Object.freeze({
      capacityReceiptPresent: Boolean(getCapacityReceipt()),
      environmentReceiptPresent: Boolean(getEnvironmentReceipt()),
      rendererReceiptPresent: Boolean(getRendererReceipt()),
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      controllerReceiptPresent: Boolean(getControllerReceipt()),
      routeBootstrapReceiptPresent: Boolean(getRouteBootstrapReceipt()),
      publicIndexAggregatePresent: Boolean(H_EARTH_3D_INDEX),
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
      candidateRenderScenePresent: Boolean(H_EARTH_3D_CANDIDATE_RENDER_SCENE),
      rendererMountReceiptPresent: Boolean(routeStatus?.rendererMountReceipt),
      rendererMountReceiptPresentMeansLivePublicRouteMounted: false,
      livePublicRendererSyncRequestPresent: true,
      publicRouteRendererSyncExtractorPresent: true,
      latticeScopeEvidencePresent:
        latticeScopeSummary.latticeScopeEvidencePresent,
      latticeHintEvidencePresent:
        latticeScopeSummary.latticeHintEvidencePresent,
      advancedRawEvidenceBundleAvailable: true
    }),

    latticeScopeSummary,
    environmentSummary,
    compositorSummary,
    composedFrameSummary,
    rendererMountSummary,
    rendererPlacementSummary,

    actionBridgeSummary: Object.freeze({
      selectedObjectId:
        routeStatus?.selectedObjectId || 'OBJ_002_FOREGROUND_WET_SAND',
      selectedObjectPresent: Boolean(
        getSelectableTarget(routeStatus?.selectedObjectId || 'OBJ_002_FOREGROUND_WET_SAND')
      ),
      classification:
        getControllerTargetClassification(
          routeStatus?.selectedObjectId || 'OBJ_002_FOREGROUND_WET_SAND'
        ) || null,
      action: 'Inspect Ground',
      readout: 'Ground Condition Read',
      receipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
      descriptorOnly: true,
      runtimeActionExecutionClaim: false,
      receiptCreationClaim: false
    }),

    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });
}

export function buildHEarthSpatialDiagnosticReceipt(
  routeStatus = getRouteBootstrapStatus()
) {
  const reportSourceSummary =
    buildHEarthOperationalReportSourceSummary(routeStatus);

  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_RECEIPT_COMPACT',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    extractedFrom:
      'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
    status:
      routeStatus?.statusLevel ||
      routeStatus?.status ||
      H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_READY,
    purpose:
      'Compact report-layer evidence source for break-location classification without embedding the full raw receipt tree.',
    reportPrinciple: H_EARTH_3D_DIAGNOSTIC_CONTRACT.reportPrinciple,

    publicStateScope:
      summarizeImportedPublicModuleState(routeStatus),

    livePublicRendererSyncRequest:
      buildHEarthLivePublicRendererSyncRequest(routeStatus),

    currentDiagnosticQuestion:
      'Which lane owns the next break: live public renderer sync, deployment/cache, geometry, node factory/material class surface, CSS, environment, compositor, action bridge, boundary, or scene model?',

    reportSourceSummary,

    nextDecisionRule: Object.freeze({
      ifLivePublicRouteStateNeeded:
        'Open /showroom/globe/h-earth/ and read globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT from that public page context.',
      ifImportedPublicModuleShowsBootstrapNotStarted:
        'Do not treat this alone as public route failure. Diagnostic page imports ../index.js without the public route DOM mount IDs.',
      ifRendererStale:
        'If live public receipt renderer contract is not expected renderer contract, inspect deployment/cache or renderer.js.',
      ifGeometryStale:
        'If live public receipt geometry contract is not expected geometry contract, inspect deployment/cache or render/geometry.js.',
      ifOrganicEvidenceAndClassesPresent:
        'CSS interpretation becomes next lane.',
      ifOrganicEvidencePresentButClassesMissing:
        'Node factory or material class surface becomes next lane.',
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
        'buildHEarthSpatialDiagnosticEvidenceBundle(routeStatus)',
      advancedSurfacesMayReceiveFullBundle: true
    }),

    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });
}

export function buildHEarthSpatialDiagnosticEvidenceBundle(
  routeStatus = getRouteBootstrapStatus()
) {
  return Object.freeze({
    receiptType: 'H_EARTH_3D_SPATIAL_DIAGNOSTIC_EVIDENCE_BUNDLE_ADVANCED',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    generatedAt: nowIso(),
    purpose:
      'Explicit advanced evidence bundle. This is not the default public route bootstrap receipt payload.',
    ...H_EARTH_SCENE_IDENTITY,

    publicStateScope:
      summarizeImportedPublicModuleState(routeStatus),

    livePublicRendererSyncRequest:
      buildHEarthLivePublicRendererSyncRequest(routeStatus),

    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(routeStatus),

    latticeScope: summarizeHEarthLatticeScope(),

    rawEvidence: Object.freeze({
      capacityReceipt: getCapacityReceipt(),
      environmentReceipt: getEnvironmentReceipt(),
      rendererReceipt: getRendererReceipt(),
      compositorReceipt: getCompositorReceipt(),
      controllerReceipt: getControllerReceipt(),
      importedPublicRouteBootstrapReceipt: getRouteBootstrapReceipt(),
      importedPublicRouteBootstrapStatus: getRouteBootstrapStatus(),
      publicIndexAggregate: H_EARTH_3D_INDEX,

      capacityAggregate: H_EARTH_3D_CAPACITY,
      environmentAggregate: H_EARTH_3D_ENVIRONMENT,
      rendererAggregate: H_EARTH_3D_RENDERER,
      compositorAggregate: H_EARTH_3D_COMPOSITOR,
      controllerAggregate: H_EARTH_3D_CONTROLLER,

      composedCandidateFrame: H_EARTH_3D_COMPOSED_CANDIDATE_FRAME,
      candidateRenderScene: H_EARTH_3D_CANDIDATE_RENDER_SCENE,
      renderVolumeModel: H_EARTH_3D_RENDER_VOLUME_MODEL,
      renderPorts: H_EARTH_3D_RENDER_PORTS,
      importedRendererMountReceipt: routeStatus?.rendererMountReceipt || null,

      livePublicRendererSyncExtractor:
        H_EARTH_3D_PUBLIC_ROUTE_RENDERER_SYNC_EXTRACTOR,
      expectedRendererContract:
        H_EARTH_EXPECTED_RENDERER_CONTRACT,
      expectedGeometryContract:
        H_EARTH_EXPECTED_GEOMETRY_CONTRACT
    }),

    boundary: Object.freeze({
      advancedRawEvidenceOnly: true,
      defaultBootstrapReceiptPayload: false,
      routeReportLayerEvidence: true,
      importedPublicModuleStateOnly: true,
      livePublicPageStateClaim: false,
      mutationClaim: false,
      renderingBehaviorChangeClaim: false,
      latticeActivationClaim: false,
      mirrorManorRouteCanonNameClaim: false,
      matrixCollapse: false
    })
  });
}

export function getSpatialDiagnosticReceipt() {
  return buildHEarthSpatialDiagnosticReceipt(getRouteBootstrapStatus());
}

export function getSpatialDiagnosticEvidenceBundle() {
  return buildHEarthSpatialDiagnosticEvidenceBundle(getRouteBootstrapStatus());
}

function buildDiagnosticReportCards(routeStatus = getRouteBootstrapStatus()) {
  const reportSourceSummary =
    buildHEarthOperationalReportSourceSummary(routeStatus);
  const liveSync = buildHEarthLivePublicRendererSyncRequest(routeStatus);
  const lattice = reportSourceSummary.latticeScopeSummary;
  const environment = reportSourceSummary.environmentSummary;
  const compositor = reportSourceSummary.compositorSummary;
  const renderer = reportSourceSummary.rendererPlacementSummary;

  return Object.freeze([
    Object.freeze({
      id: 'route',
      title: 'Public Route State Scope',
      status:
        H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS.PUBLIC_ROUTE_IMPORTED_STATIC_STATE,
      severity: 'INFO',
      summary:
        'Public route source/module state is available. Live public route DOM bootstrap is not observable from this diagnostic page.'
    }),
    Object.freeze({
      id: 'live-public-route',
      title: 'Live Public Route Receipt',
      status:
        H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS.PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED_FROM_PUBLIC_PAGE,
      severity: 'HELD',
      summary:
        'To prove live renderer mount, open the public H-Earth route and read globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT from that page context.'
    }),
    Object.freeze({
      id: 'live-public-renderer-sync',
      title: 'Live Public Renderer Sync',
      status: liveSync.status,
      severity:
        liveSync.status ===
        H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.CSS_INTERPRETATION_NEXT
          ? 'OK'
          : liveSync.status ===
              H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS.PUBLIC_ROUTE_LIVE_RECEIPT_REQUIRED
            ? 'HELD'
            : 'WARN',
      summary:
        liveSync.classification?.reason ||
        'Live public renderer sync evidence requires public route receipt.'
    }),
    Object.freeze({
      id: 'lattice',
      title: 'Lattice Scope',
      status: lattice?.status || 'UNKNOWN',
      severity:
        lattice?.status ===
        H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_16X16_LATTICE_EXPOSED
          ? 'OK'
          : lattice?.status ===
              H_EARTH_3D_LATTICE_SCOPE_STATUS.SCENE_SCOPED_LATTICE_NOT_EXPOSED
            ? 'HELD'
            : 'INFO',
      summary:
        lattice?.nextEvidenceNeeded ||
        'Lattice-scope evidence unavailable.'
    }),
    Object.freeze({
      id: 'environment',
      title: 'Environment Placement',
      status: environment ? 'PRESENT' : 'MISSING',
      severity: environment ? 'INFO' : 'WARN',
      summary: environment
        ? `${environment.detectedSceneTokens?.length || 0} expected scene tokens detected in environment receipt.`
        : 'Environment receipt unavailable.'
    }),
    Object.freeze({
      id: 'compositor',
      title: 'Compositor Frame',
      status: compositor ? 'PRESENT' : 'MISSING',
      severity: compositor ? 'INFO' : 'WARN',
      summary: compositor
        ? `Composed node count: ${compositor.composedNodeCount ?? 'unreported'}.`
        : 'Compositor receipt unavailable.'
    }),
    Object.freeze({
      id: 'renderer',
      title: 'Renderer Placement',
      status: renderer?.candidateRenderScenePresent ? 'PRESENT' : 'MISSING',
      severity: renderer?.candidateRenderScenePresent ? 'INFO' : 'WARN',
      summary:
        'Renderer descriptors and candidate scene are readable here. Live renderer mount receipt must be confirmed on the public route page.'
    }),
    Object.freeze({
      id: 'boundary',
      title: 'Boundary Flags',
      status: 'PRESERVED',
      severity: 'OK',
      summary:
        'Diagnostic route does not claim renderer pass, visual pass, validation, production, lattice activation, live public route bootstrap, or matrix collapse.'
    })
  ]);
}

function renderDiagnosticReportCards(mountPoints, cards) {
  if (!mountPoints?.reportCards || !mountPoints.reportCards.ownerDocument) {
    return false;
  }

  const documentRef = mountPoints.reportCards.ownerDocument;
  mountPoints.reportCards.textContent = '';

  cards.forEach((card) => {
    const article = documentRef.createElement('article');
    article.className = 'h-earth-3d-report-card';
    article.dataset.hEarthReportId = card.id;
    article.dataset.hEarthReportSeverity = card.severity;

    const title = documentRef.createElement('h2');
    title.textContent = card.title;

    const status = documentRef.createElement('p');
    status.className = 'h-earth-3d-report-status';
    status.textContent = card.status;

    const summary = documentRef.createElement('p');
    summary.className = 'h-earth-3d-report-summary';
    summary.textContent = card.summary;

    article.appendChild(title);
    article.appendChild(status);
    article.appendChild(summary);

    mountPoints.reportCards.appendChild(article);
  });

  return true;
}

function buildDiagnosticPayloadSet(routeStatus = getRouteBootstrapStatus()) {
  const livePublicRendererSyncRequest =
    buildHEarthLivePublicRendererSyncRequest(routeStatus);
  const compactReceipt = buildHEarthSpatialDiagnosticReceipt(routeStatus);
  const evidenceBundle = buildHEarthSpatialDiagnosticEvidenceBundle(routeStatus);
  const reportSourceSummary =
    buildHEarthOperationalReportSourceSummary(routeStatus);
  const routeBootstrapReceipt = getRouteBootstrapReceipt();
  const publicStateScope = summarizeImportedPublicModuleState(routeStatus);

  return Object.freeze({
    status: Object.freeze({
      receiptType: 'H_EARTH_3D_DIAGNOSTIC_ROUTE_STATUS',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
      generatedAt: nowIso(),
      statusLevel: H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_READY,
      importedPublicModuleStatus: routeStatus || null,
      importedPublicRouteReceiptPresent: Boolean(routeBootstrapReceipt),
      publicStateScope,
      livePublicRendererSyncStatus:
        livePublicRendererSyncRequest.status,
      livePublicRendererSyncNextLane:
        livePublicRendererSyncRequest.classification?.nextLane || null,
      livePublicRendererSyncPayloadPanelExpected: true,
      livePublicRendererSyncPayloadPanelId:
        H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.payloadIds.livePublicRendererSync,
      diagnosticRouteOnly: true,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    }),

    operationalReportStack: reportSourceSummary,

    livePublicRendererSync: livePublicRendererSyncRequest,

    spatialSummary: compactReceipt,

    composedFrame: Object.freeze({
      receiptType:
        'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME_EXPOSURE_COMPACT_WITH_ADVANCED_DIGEST',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      source: 'H_EARTH_3D_COMPOSED_CANDIDATE_FRAME',
      purpose:
        'Compact composed candidate frame exposure for report routing. Full raw frame is available in advanced evidence bundle.',
      composedCandidateFramePresent: Boolean(H_EARTH_3D_COMPOSED_CANDIDATE_FRAME),
      composedCandidateFrameSummary:
        reportSourceSummary.composedFrameSummary,
      composedCandidateFrameRawAvailableInAdvancedBundle: true,
      boundary: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS
    }),

    compositorReceipt: Object.freeze({
      receiptType: 'H_EARTH_3D_COMPOSITOR_RECEIPT_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      source: 'getCompositorReceipt()',
      purpose:
        'Compact compositor evidence for camera, depth, layer composition, viewport fit, primary focus, and composed frame resolution.',
      compositorReceiptPresent: Boolean(getCompositorReceipt()),
      compositorSummary: reportSourceSummary.compositorSummary,
      rawCompositorReceiptAvailableInAdvancedBundle: true,
      compositionBoundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS
    }),

    rendererPlacement: Object.freeze({
      receiptType:
        'H_EARTH_3D_RENDERER_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      purpose:
        'Compact renderer placement evidence for transform/placement/geometry break-location classification. This does not prove live public route renderer mount.',
      rendererPlacementEvidence:
        reportSourceSummary.rendererPlacementSummary,
      liveRendererMountMustBeConfirmedOnPublicRoute: true,
      livePublicRendererSyncRequest,
      rawRendererEvidenceAvailableInAdvancedBundle: true
    }),

    environmentPlacement: Object.freeze({
      receiptType:
        'H_EARTH_3D_ENVIRONMENT_PLACEMENT_EVIDENCE_EXPOSURE_COMPACT',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
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

    routeBootstrapReceipt: Object.freeze({
      receiptType:
        'H_EARTH_3D_IMPORTED_PUBLIC_ROUTE_BOOTSTRAP_RECEIPT_DIAGNOSTIC_EXPOSURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      source: '../index.js',
      publicStateScope,
      importedPublicRouteBootstrapReceipt: routeBootstrapReceipt,
      livePublicRouteReceiptRequiredFromPublicPage: true,
      livePublicRendererSyncRequest
    }),

    rendererMountReceipt: Object.freeze({
      receiptType: 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT_DIAGNOSTIC_EXPOSURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      rendererMountReceiptPresent: Boolean(routeStatus?.rendererMountReceipt),
      rendererMountReceiptSummary:
        summarizeRendererMountReceipt(routeStatus?.rendererMountReceipt),
      publicStateScope,
      livePublicRendererSyncRequest,
      liveRendererMountMustBeConfirmedOnPublicRoute: true,
      rawRendererMountReceiptAvailableInAdvancedBundle: true
    }),

    boundaryFlags: Object.freeze({
      receiptType: 'H_EARTH_3D_BOUNDARY_FLAGS_DIAGNOSTIC_EXPOSURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      diagnosticBoundaryFlags: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS,
      publicRouteBoundaryFlags: H_EARTH_3D_ROUTE_BOOTSTRAP_BOUNDARY_FLAGS,
      forbiddenCapabilityFlags: H_EARTH_3D_FORBIDDEN_CAPABILITY_FLAGS,
      rendererBoundaryFlags: H_EARTH_3D_RENDER_BOUNDARY_FLAGS,
      compositionBoundaryFlags: H_EARTH_3D_COMPOSITION_BOUNDARY_FLAGS,
      controllerBoundaryFlags: H_EARTH_3D_CONTROLLER_BOUNDARY_FLAGS
    }),

    indexContract: Object.freeze({
      receiptType: 'H_EARTH_3D_INDEX_CONTRACT_DIAGNOSTIC_EXPOSURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      publicIndexContract: H_EARTH_3D_INDEX?.contract || null,
      importedPublicIndexReceipt: routeBootstrapReceipt || null,
      publicStateScope,
      livePublicRendererSyncRequest
    }),

    diagnosticContract: Object.freeze({
      receiptType: 'H_EARTH_3D_DIAGNOSTIC_CONTRACT_EXPOSURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      diagnosticContract: H_EARTH_3D_DIAGNOSTIC_CONTRACT,
      diagnosticBoundaryFlags: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    }),

    advancedRawEvidence: evidenceBundle,

    reportCards: buildDiagnosticReportCards(routeStatus)
  });
}

export function renderHEarthDiagnosticSurfaces(
  mountPoints,
  routeStatus = getRouteBootstrapStatus()
) {
  if (!mountPoints) return false;

  const payloads = buildDiagnosticPayloadSet(routeStatus);

  const writes = Object.freeze({
    status: writeText(
      mountPoints.statusNode,
      payloads.status.statusLevel
    ),

    reportLayerStatus: writeJson(
      mountPoints.reportLayerStatus,
      payloads.status,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    operationalReportStack: writeJson(
      mountPoints.operationalReportStack,
      payloads.operationalReportStack,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    spatialSummary: writeJson(
      mountPoints.spatialSummary,
      payloads.spatialSummary,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    livePublicRendererSync: writeJson(
      mountPoints.livePublicRendererSyncPayload,
      payloads.livePublicRendererSync,
      { maxDepth: 9, maxArrayLength: 180 }
    ),

    composedFrame: writeJson(
      mountPoints.composedFramePayload,
      payloads.composedFrame,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    compositorReceipt: writeJson(
      mountPoints.compositorReceiptPayload,
      payloads.compositorReceipt,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    rendererPlacement: writeJson(
      mountPoints.rendererPlacementPayload,
      payloads.rendererPlacement,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    environmentPlacement: writeJson(
      mountPoints.environmentPlacementPayload,
      payloads.environmentPlacement,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    routeBootstrapReceipt: writeJson(
      mountPoints.routeBootstrapReceiptPayload,
      payloads.routeBootstrapReceipt,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    rendererMountReceipt: writeJson(
      mountPoints.rendererMountReceiptPayload,
      payloads.rendererMountReceipt,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    boundaryFlags: writeJson(
      mountPoints.boundaryFlagsPayload,
      payloads.boundaryFlags,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    indexContract: writeJson(
      mountPoints.indexContractPayload,
      payloads.indexContract,
      { maxDepth: 9, maxArrayLength: 160 }
    ),

    diagnosticContract: writeJson(
      mountPoints.diagnosticContractPayload,
      payloads.diagnosticContract,
      { maxDepth: 8, maxArrayLength: 128 }
    ),

    reportCards: renderDiagnosticReportCards(
      mountPoints,
      payloads.reportCards
    )
  });

  const livePublicRendererSyncPanelWriteReceipt = Object.freeze({
    receiptType:
      'H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_PAYLOAD_PANEL_WRITE_RECEIPT',
    file: '/showroom/globe/h-earth/diagnostic/index.js',
    contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
    payloadPanelId:
      H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.payloadIds.livePublicRendererSync,
    livePublicRendererSyncPayloadPanelWriteAttempted: true,
    livePublicRendererSyncPayloadPanelFound:
      Boolean(mountPoints.livePublicRendererSyncPayload),
    livePublicRendererSyncPayloadPanelWritten:
      writes.livePublicRendererSync === true,
    payloadReceiptType:
      payloads.livePublicRendererSync?.receiptType || null,
    payloadStatus:
      payloads.livePublicRendererSync?.status || null,
    boundary: Object.freeze({
      diagnosticRouteOnly: true,
      panelWriteOnly: true,
      publicRouteMutation: false,
      publicRendererMountClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      matrixCollapse: false
    })
  });

  if (mountPoints.publicRouteLink) {
    mountPoints.publicRouteLink.setAttribute(
      'href',
      H_EARTH_3D_DIAGNOSTIC_CONTRACT.publicRoute
    );
  }

  return Object.freeze({
    rendered: Object.values(writes).some(Boolean),
    writes,
    payloads,
    livePublicRendererSyncPanelWriteReceipt,
    livePublicRendererSyncPayloadPanelWriteAttempted:
      livePublicRendererSyncPanelWriteReceipt.livePublicRendererSyncPayloadPanelWriteAttempted,
    livePublicRendererSyncPayloadPanelFound:
      livePublicRendererSyncPanelWriteReceipt.livePublicRendererSyncPayloadPanelFound,
    livePublicRendererSyncPayloadPanelWritten:
      livePublicRendererSyncPanelWriteReceipt.livePublicRendererSyncPayloadPanelWritten,
    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });
}

async function copyTextToClipboard(text) {
  if (
    globalThis.navigator?.clipboard &&
    typeof globalThis.navigator.clipboard.writeText === 'function'
  ) {
    await globalThis.navigator.clipboard.writeText(text);
    return true;
  }

  return false;
}

function bindCopyButton(button, copyStatusNode, label, getPayload) {
  if (!button) return false;

  button.addEventListener('click', async () => {
    const payload = getPayload();
    const text = JSON.stringify(safeSerialize(payload, {
      maxDepth: 12,
      maxArrayLength: 260
    }), null, 2);

    try {
      const copied = await copyTextToClipboard(text);

      writeText(
        copyStatusNode,
        copied
          ? `${label} copied.`
          : `${label} prepared, but Clipboard API is unavailable.`
      );
    } catch (error) {
      writeText(
        copyStatusNode,
        `${label} copy failed: ${String(error?.message || error)}`
      );
    }
  });

  return true;
}

export function bindHEarthDiagnosticCopyControls(
  mountPoints,
  routeStatus = getRouteBootstrapStatus()
) {
  if (!mountPoints) {
    return Object.freeze({
      copyAllBound: false,
      copyCompactBound: false,
      copyRawBound: false,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  const copyAllBound = bindCopyButton(
    mountPoints.copyAllButton,
    mountPoints.copyStatus,
    'All diagnostic payloads',
    () => buildDiagnosticPayloadSet(routeStatus)
  );

  const copyCompactBound = bindCopyButton(
    mountPoints.copyCompactButton,
    mountPoints.copyStatus,
    'Compact diagnostic receipt',
    () => buildHEarthSpatialDiagnosticReceipt(routeStatus)
  );

  const copyRawBound = bindCopyButton(
    mountPoints.copyRawButton,
    mountPoints.copyStatus,
    'Advanced raw evidence bundle',
    () => buildHEarthSpatialDiagnosticEvidenceBundle(routeStatus)
  );

  return Object.freeze({
    copyAllBound,
    copyCompactBound,
    copyRawBound,
    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });
}

export function initializeHEarthDiagnosticRoute(options = {}) {
  const rootDocument = getDocumentFromOptions(options);
  const mountPoints = resolveDiagnosticMountPoints(rootDocument);
  const routeStatus = getRouteBootstrapStatus();

  if (!mountPoints.strictRequiredFound) {
    const fallbackPayload = Object.freeze({
      receiptType: 'H_EARTH_3D_DIAGNOSTIC_ROUTE_BOOTSTRAP_FAILURE',
      file: '/showroom/globe/h-earth/diagnostic/index.js',
      contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
      statusLevel:
        H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_FALLBACK_ACTIVE,
      missingStrictRequiredIds: mountPoints.missingStrictRequiredIds,
      diagnosticRouteOnly: true,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });

    writeText(
      mountPoints.statusNode,
      H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_FALLBACK_ACTIVE
    );

    return Object.freeze({
      initialized: false,
      status:
        H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_FALLBACK_ACTIVE,
      mountPoints,
      fallbackPayload,
      boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
    });
  }

  const renderResult = renderHEarthDiagnosticSurfaces(
    mountPoints,
    routeStatus
  );

  const copyControls = bindHEarthDiagnosticCopyControls(
    mountPoints,
    routeStatus
  );

  const initialized = renderResult.rendered === true;

  const livePublicRendererSyncRequest =
    buildHEarthLivePublicRendererSyncRequest(routeStatus);

  const result = Object.freeze({
    initialized,
    status: initialized
      ? H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_READY
      : H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS.DIAGNOSTIC_PARTIAL,
    generatedAt: nowIso(),
    mountPoints,
    renderResult,
    copyControls,
    routeStatus,
    publicStateScope:
      summarizeImportedPublicModuleState(routeStatus),
    livePublicRendererSyncRequest,
    livePublicRendererSyncPanelWriteReceipt:
      renderResult.livePublicRendererSyncPanelWriteReceipt,
    spatialDiagnosticReceipt:
      buildHEarthSpatialDiagnosticReceipt(routeStatus),
    spatialDiagnosticEvidenceBundle:
      buildHEarthSpatialDiagnosticEvidenceBundle(routeStatus),
    latticeScope: summarizeHEarthLatticeScope(),
    operationalReportSourceSummary:
      buildHEarthOperationalReportSourceSummary(routeStatus),
    boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
  });

  writeText(
    mountPoints.statusNode,
    result.status
  );

  globalThis.H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_REQUEST =
    livePublicRendererSyncRequest;

  globalThis.H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_PANEL_WRITE_RECEIPT =
    renderResult.livePublicRendererSyncPanelWriteReceipt;

  return result;
}

export const H_EARTH_3D_DIAGNOSTIC_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_RECEIPT',
  file: '/showroom/globe/h-earth/diagnostic/index.js',
  contractId: H_EARTH_3D_DIAGNOSTIC_CONTRACT.contractId,
  renews:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033E_LIVE_PUBLIC_RENDERER_SYNC_EVIDENCE_REQUEST_v1',
  previousRenewal:
    'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_BIRTH_STEP_033D_2_PUBLIC_STATE_SCOPE_CLARIFICATION_v1',
  extractedFrom:
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_BIRTH_STEP_029F_REPORT_LAYER_LATTICE_SCOPE_EVIDENCE_COMPRESSION_v1',
  diagnosticRouteOnly: true,
  importContractRepairApplied: true,
  unsupportedPublicReadoutImportRemoved: true,
  publicStateScopeClarificationApplied: true,
  importedPublicModuleStateReadable: true,
  importedPublicModuleStateIsLivePublicPageState: false,
  livePublicRouteStateObservableFromDiagnosticPage: false,
  livePublicRouteReceiptRequiredFromPublicPage: true,

  livePublicRendererSyncEvidenceRequestDefined: true,
  publicRouteRendererSyncExtractorDefined: true,
  rendererGeometrySyncDecisionBlockDefined: true,
  diagnosticStillDoesNotClaimLivePublicRendererMount: true,
  expectedRendererContract: H_EARTH_EXPECTED_RENDERER_CONTRACT,
  expectedGeometryContract: H_EARTH_EXPECTED_GEOMETRY_CONTRACT,
  expectedGeometryContractCorrectedToChildVariation032D: true,

  livePublicRendererSyncPayloadPanelMountIdRegistered: true,
  livePublicRendererSyncPayloadPanelId:
    H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT.payloadIds.livePublicRendererSync,
  livePublicRendererSyncPayloadPanelWriteEvidenceDefined: true,
  livePublicRendererSyncGlobalRequestExposedAfterInitialization: true,

  operationalReportSourceSummaryDefined: true,
  compactSpatialDiagnosticReceiptDefined: true,
  advancedRawEvidenceBundleDefined: true,
  latticeScopeReaderDefined: true,
  copyControlsDefined: true,
  publicRendererMountClaim: false,
  publicRouteMutationClaim: false,
  publicReadoutHelperDependency: false,
  webglActivation: false,
  canvasActivation: false,
  svgActivation: false,
  finalRendererClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  productionClaim: false,
  latticeActivationClaim: false,
  matrixCollapse: false,
  boundary: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS
});

export function getDiagnosticReceipt() {
  return H_EARTH_3D_DIAGNOSTIC_RECEIPT;
}

export const H_EARTH_3D_DIAGNOSTIC = Object.freeze({
  id: 'H_EARTH_3D_DIAGNOSTIC',
  file: '/showroom/globe/h-earth/diagnostic/index.js',
  route: '/showroom/globe/h-earth/diagnostic/',
  publicRoute: '/showroom/globe/h-earth/',

  contract: H_EARTH_3D_DIAGNOSTIC_CONTRACT,
  boundaryFlags: H_EARTH_3D_DIAGNOSTIC_BOUNDARY_FLAGS,
  mountContract: H_EARTH_3D_DIAGNOSTIC_MOUNT_CONTRACT,
  latticeScopeStatus: H_EARTH_3D_LATTICE_SCOPE_STATUS,
  statusLevels: H_EARTH_3D_DIAGNOSTIC_STATUS_LEVELS,
  publicStateScopeStatus: H_EARTH_3D_PUBLIC_STATE_SCOPE_STATUS,
  livePublicRendererSyncStatus:
    H_EARTH_3D_LIVE_PUBLIC_RENDERER_SYNC_STATUS,

  expectedRendererContract: H_EARTH_EXPECTED_RENDERER_CONTRACT,
  expectedGeometryContract: H_EARTH_EXPECTED_GEOMETRY_CONTRACT,
  publicRouteRendererSyncExtractor:
    H_EARTH_3D_PUBLIC_ROUTE_RENDERER_SYNC_EXTRACTOR,

  capacity: H_EARTH_3D_CAPACITY,
  environment: H_EARTH_3D_ENVIRONMENT,
  renderer: H_EARTH_3D_RENDERER,
  compositor: H_EARTH_3D_COMPOSITOR,
  controller: H_EARTH_3D_CONTROLLER,
  publicIndex: H_EARTH_3D_INDEX,

  capacityReceipt: H_EARTH_3D_CAPACITY_RECEIPT,
  environmentReceipt: H_EARTH_3D_ENVIRONMENT_RECEIPT,
  rendererReceipt: H_EARTH_3D_RENDERER_RECEIPT,
  compositorReceipt: H_EARTH_3D_COMPOSITOR_RECEIPT,
  controllerReceipt: H_EARTH_3D_CONTROLLER_RECEIPT,
  importedPublicRouteBootstrapReceipt: H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT,

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

  getRouteBootstrapReceipt,
  getRouteBootstrapStatus,
  summarizeImportedPublicModuleState,
  getImportedPublicModuleStateReceipt,

  classifyHEarthLivePublicRendererSyncEvidence,
  buildHEarthLivePublicRendererSyncRequest,
  getLivePublicRendererSyncRequest,
  getLivePublicRendererSyncReceipt,

  summarizeHEarthLatticeScope,
  getLatticeScopeReceipt,
  buildHEarthOperationalReportSourceSummary,
  buildHEarthSpatialDiagnosticReceipt,
  buildHEarthSpatialDiagnosticEvidenceBundle,
  getSpatialDiagnosticReceipt,
  getSpatialDiagnosticEvidenceBundle,
  renderHEarthDiagnosticSurfaces,
  bindHEarthDiagnosticCopyControls,
  initializeHEarthDiagnosticRoute,

  getReceipt: getDiagnosticReceipt,
  receipt: H_EARTH_3D_DIAGNOSTIC_RECEIPT
});

export default H_EARTH_3D_DIAGNOSTIC;
