// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas Hub / receiver-output bishop / visible surface proof standard.
// Served CONTRACT intentionally remains v12_3 so Route Conductor, LabWest,
// diagnostics, and accepted lineage tables continue to recognize the Canvas parent.
// Internal renewal: HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_TNT_v12_5
//
// Purpose:
// - Preserve Canvas as receiver/output carrier only.
// - Stop treating namespace proof, mount proof, bridge proof, motion proof,
//   control proof, or route-conductor proof as visible-globe proof.
// - Require direct visible-surface proof:
//   1. Canvas element exists or is created.
//   2. 2D context exists.
//   3. Canvas geometry is nonzero and DOM-visible.
//   4. Draw attempt completes.
//   5. Pixel sample proves visible pixels and color variance.
// - Publish a separate Canvas standards NEWS alignment and Fibonacci synchronization.
// - Publish current Canvas Hub, Canvas receiver, expression surface, visible planet,
//   visible globe, and compatibility aliases.
// - Accept Route Conductor, LabWest, Queen, diagnostic, and finger packets as
//   external context only.
// - Draw through a real downstream drawable adapter when present and lawful.
// - Otherwise draw a native 2D projected globe expression surface.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth,
//   Hex truth, finger truth, pointer truth, Queen truth, LabWest truth,
//   Route Conductor truth, F13 final claim, F21 latch, ready text,
//   completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_RECEIPT_v12_5";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_RECEIPT_v12_4";

  const LINEAGE_V12_2_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_V11_7_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";
  const LINEAGE_V11_6_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";

  const EXPRESSION_SURFACE_CONTRACT =
    "HEARTH_CANVAS_VISIBLE_SURFACE_PIXEL_PROOF_STANDARD_TNT_v1";
  const EXPRESSION_SURFACE_RECEIPT =
    "HEARTH_CANVAS_VISIBLE_SURFACE_PIXEL_PROOF_STANDARD_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const VERSION =
    "2026-06-06.hearth-canvas-hub-visible-surface-proof-standard-v12-5-served-v12-3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvas: false,
    f13ClaimedByExpressionSurface: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    downstreamReleaseClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const GATES = Object.freeze({
    ELEMENT: "CANVAS_ELEMENT_GATE",
    CONTEXT: "CANVAS_2D_CONTEXT_GATE",
    GEOMETRY: "CANVAS_NONZERO_GEOMETRY_GATE",
    DRAW: "CANVAS_DRAW_COMPLETION_GATE",
    PIXEL: "CANVAS_PIXEL_PROOF_GATE",
    RECEIPT: "CANVAS_RECEIPT_PUBLICATION_GATE"
  });

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_VISIBLE_SURFACE",
    "HEARTH_CANVAS_EXPRESSION_SURFACE",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_GLOBE",
    "HEARTH_CANVAS_VISIBLE_PLANET",

    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasVisibleSurface",
    "HEARTH.canvasExpressionSurface",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisibleGlobe",
    "HEARTH.canvasVisiblePlanet",

    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisibleSurface",
    "DEXTER_LAB.hearthCanvasExpressionSurface",
    "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrier",
    "DEXTER_LAB.hearthCanvasVisibleGlobe",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const RECEIPT_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT",
    "HEARTH_CANVAS_HUB_RECEIPT",
    "HEARTH_CANVAS_RECEIPT",
    "HEARTH_CANVAS_PARENT_RECEIPT",
    "HEARTH_CANVAS_LOCAL_STATION_RECEIPT",
    "HEARTH_CANVAS_STATION_RECEIPT",
    "HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT",
    "HEARTH_CANVAS_FINGER_MANAGER_RECEIPT",
    "HEARTH_CANVAS_VISIBLE_SURFACE_RECEIPT",
    "HEARTH_CANVAS_EXPRESSION_SURFACE_RECEIPT",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT",
    "HEARTH_CANVAS_VISIBLE_GLOBE_RECEIPT",
    "HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT",

    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiverReceipt",
    "HEARTH.canvasHubReceipt",
    "HEARTH.canvasReceipt",
    "HEARTH.canvasParentReceipt",
    "HEARTH.canvasLocalStationReceipt",
    "HEARTH.canvasStationReceipt",
    "HEARTH.canvasExpressionHubReceipt",
    "HEARTH.canvasFingerManagerReceipt",
    "HEARTH.canvasVisibleSurfaceReceipt",
    "HEARTH.canvasExpressionSurfaceReceipt",
    "HEARTH.canvasVisibleBaseGlobeCarrierReceipt",
    "HEARTH.canvasVisibleGlobeReceipt",
    "HEARTH.canvasVisiblePlanetReceipt",

    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt",
    "DEXTER_LAB.hearthCanvasHubReceipt",
    "DEXTER_LAB.hearthCanvasReceipt",
    "DEXTER_LAB.hearthCanvasParentReceipt",
    "DEXTER_LAB.hearthCanvasLocalStationReceipt",
    "DEXTER_LAB.hearthCanvasStationReceipt",
    "DEXTER_LAB.hearthCanvasExpressionHubReceipt",
    "DEXTER_LAB.hearthCanvasFingerManagerReceipt",
    "DEXTER_LAB.hearthCanvasVisibleSurfaceReceipt",
    "DEXTER_LAB.hearthCanvasExpressionSurfaceReceipt",
    "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrierReceipt",
    "DEXTER_LAB.hearthCanvasVisibleGlobeReceipt",
    "DEXTER_LAB.hearthCanvasVisiblePlanetReceipt"
  ]);

  const UPSTREAM_ALIAS_PATHS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_NORTH_BISHOP",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop",

    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH.westRuntimeTable",
    "HEARTH.runtimeTableWest",
    "HEARTH.westAdmissibility",
    "HEARTH.westBishopChordCanvasReleaseBridge",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge",

    "HEARTH_CONTROLS",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH.controls",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthQueenControls"
  ]);

  const DRAWABLE_ADAPTER_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_COMPOSITE",
    "HEARTH_CANVAS_COMPOSITE_FINGER",
    "HEARTH_CANVAS_COMPOSITE",
    "HEARTH.canvasFingerComposite",
    "HEARTH.canvasCompositeFinger",
    "HEARTH.canvasComposite",
    "DEXTER_LAB.hearthCanvasFingerComposite",
    "DEXTER_LAB.hearthCanvasCompositeFinger",
    "DEXTER_LAB.hearthCanvasComposite",

    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",

    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_POINTER_FINGER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasPointerFinger",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFinger",

    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount='true']",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-visible-surface='true']",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-visible-planet-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas"
  ]);

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: "/assets/hearth/hearth.canvas.finger.composite.js"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    version: VERSION,

    role: "canvas-hub-receiver-output-bishop-visible-surface-proof-standard",
    servedContractPreservedForUpstreamRecognition: true,
    visibleSurfaceProofStandardActive: true,
    namespaceProofIsVisibleProof: false,
    mountProofIsVisibleProof: false,
    bridgeProofIsVisibleProof: false,
    motionProofIsVisibleProof: false,
    controlProofIsVisibleProof: false,

    loaded: true,
    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",

    aliasPublishCount: 0,
    receiptPublishCount: 0,
    upstreamNotifyCount: 0,

    canvasElementGate: false,
    canvasElementGateReason: "WAITING_CANVAS_ELEMENT",
    canvas2dContextGate: false,
    canvas2dContextGateReason: "WAITING_2D_CONTEXT",
    canvasGeometryGate: false,
    canvasGeometryGateReason: "WAITING_NONZERO_CANVAS_GEOMETRY",
    canvasDrawGate: false,
    canvasDrawGateReason: "WAITING_DRAW_ATTEMPT",
    canvasPixelProofGate: false,
    canvasPixelProofGateReason: "WAITING_PIXEL_PROOF",
    canvasReceiptPublicationGate: false,
    canvasReceiptPublicationGateReason: "WAITING_RECEIPT_PUBLICATION",

    canvasLocated: false,
    canvasCreated: false,
    canvasSelector: "NONE",
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectWidth: 0,
    canvasRectHeight: 0,
    canvasRectNonzero: false,
    canvasDomVisible: false,
    context2dReady: false,

    drawAttempted: false,
    drawComplete: false,
    canvasDrawComplete: false,
    baseGlobeDrawComplete: false,
    drawCount: 0,
    lastDrawAt: "",
    lastDrawReason: "NOT_DRAWN",
    lastDrawSource: "NONE",
    lastDrawError: "",

    adapterDrawAttempted: false,
    adapterDrawComplete: false,
    adapterSourceName: "NONE",
    adapterMethod: "NONE",
    adapterContract: "",
    adapterReceipt: "",
    adapterError: "",
    externalAdapterCount: 0,
    externalAdapterNames: "NONE",

    nativeDrawAttempted: false,
    nativeDrawComplete: false,

    pixelSampleAttempted: false,
    pixelSampleComplete: false,
    pixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVarianceStatus: "NO_PIXEL_SAMPLE",
    pixelSampleNonTransparentCount: 0,
    pixelSampleColorSpread: 0,
    pixelSampleUniqueColorCount: 0,
    pixelSampleError: "",

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    visibleSurfaceActive: true,
    expressionSurfaceActive: true,
    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    visiblePlanetProofReady: false,
    renderedPlanetProofReady: false,
    currentVisibleProofValid: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "VISIBLE_SURFACE_PIXEL_PROOF_NOT_READY",
    visiblePlanetReceiptObserved: false,

    structuralCarrierReady: false,
    structuralCarrierSafe: false,
    canvasParentCarrierSafe: false,
    structuralCarrierSafeForCanvasRelease: false,
    canvasPreReleaseCarrierSafeForWest: false,
    canvasParentReleaseAccepted: false,
    canvasParentReleaseLawful: false,
    releasePacketReceived: false,
    releasePacketAccepted: false,

    routeConductorObserved: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    labWestObserved: false,
    labWestContract: "",
    labWestReceipt: "",
    queenObserved: false,
    queenContract: "",
    queenReceipt: "",

    packetCount: 0,
    routeConductorPacketCount: 0,
    labWestPacketCount: 0,
    queenPacketCount: 0,
    fingerPacketCount: 0,
    diagnosticPacketCount: 0,
    lastPacket: null,
    lastRouteConductorPacket: null,
    lastLabWestPacket: null,
    lastQueenPacket: null,
    lastFingerPacket: null,
    lastDiagnosticPacket: null,
    lastViewState: null,

    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    firstFingerGap: "WAITING_FINGER_PACKET_OR_VISIBLE_SURFACE_PIXEL_PROOF",
    firstFingerGapFile: FINGER_FILES.inspect,
    nextFingerKey: "inspect",
    nextFingerFile: FINGER_FILES.inspect,
    pointerFingerObserved: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_SURFACE_PIXEL_PROOF_NOT_READY",
    f13StrictEvidenceRepairTarget: FILE,

    canvasStandardsNewsAlignmentActive: true,
    canvasStandardsNewsAlignmentStatus: "WAITING_VISIBLE_SURFACE_PIXEL_PROOF",
    canvasStandardsNewsAlignmentScore: 0,
    canvasStandardsNewsAlignmentFirstFailedStage: GATES.ELEMENT,

    canvasStandardsFibonacciSynchronizationActive: true,
    canvasStandardsFibonacciSynchronizationStatus: "WAITING_VISIBLE_SURFACE_PIXEL_PROOF",
    canvasStandardsFibonacciSynchronizationScore: 0,
    canvasStandardsFibonacciSynchronizationFirstFailedStage: "F1_CANVAS_ELEMENT",

    firstFailedGate: GATES.ELEMENT,
    firstFailedCoordinate: "WAITING_CANVAS_ELEMENT",
    recommendedNextFile: FILE,
    recommendedNextAction: "CREATE_OR_LOCATE_CANVAS_ELEMENT",
    postgameStatus: "CANVAS_HUB_LOADED_WAITING_VISIBLE_SURFACE_PIXEL_PROOF",

    events: [],
    errors: [],

    ...FINAL_FALSE
  };

  const externalAdapters = [];
  let activeCanvas = null;
  let activeContext = null;
  let drawTimer = 0;
  let publishTimer = 0;
  let notifyGuard = false;
  let drawingGuard = false;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 100);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector, scope = doc) {
    if (!scope || !selector) return null;

    try {
      return scope.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(selectors, scope = doc) {
    for (const selector of selectors) {
      const element = q(selector, scope);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function contractOf(value) {
    if (!isObject(value)) return "";
    return safeString(
      value.currentCanvasParentContract ||
        value.canvasLocalStationContract ||
        value.canvasContract ||
        value.hearthCanvasContract ||
        value.controlContract ||
        value.controlsContract ||
        value.routeConductorContract ||
        value.labWestContract ||
        value.contract ||
        value.CONTRACT ||
        value.sourceContract ||
        ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";
    return safeString(
      value.currentCanvasParentReceipt ||
        value.canvasLocalStationReceipt ||
        value.canvasReceipt ||
        value.hearthCanvasReceipt ||
        value.controlReceipt ||
        value.controlsReceipt ||
        value.routeConductorReceipt ||
        value.labWestReceipt ||
        value.receipt ||
        value.RECEIPT ||
        value.sourceReceipt ||
        ""
    );
  }

  function noFinalClaims(value) {
    const s = isObject(value) ? value : {};
    return !(
      s.f13Claimed === true ||
      s.f13ClaimedByCanvas === true ||
      s.f13ClaimedByExpressionSurface === true ||
      s.f21EligibleForNorth === true ||
      s.f21SubmittedToNorth === true ||
      s.f21Claimed === true ||
      s.readyTextAllowed === true ||
      s.readyTextClaimed === true ||
      s.completionLatched === true ||
      s.finalCompletionLatched === true ||
      s.degradedCompletionLatched === true ||
      s.visualPassClaimed === true ||
      s.finalVisualPassClaimed === true ||
      s.generatedImage === true ||
      s.graphicBox === true ||
      s.webGL === true ||
      s.webgl === true
    );
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getCanvasVisibleProofReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output =
          method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
            ? authority[method](false)
            : authority[method]();

        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.summary)) return authority.summary;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function setGate(gateName, passed, reason) {
    if (gateName === GATES.ELEMENT) {
      state.canvasElementGate = Boolean(passed);
      state.canvasElementGateReason = reason;
    }

    if (gateName === GATES.CONTEXT) {
      state.canvas2dContextGate = Boolean(passed);
      state.canvas2dContextGateReason = reason;
    }

    if (gateName === GATES.GEOMETRY) {
      state.canvasGeometryGate = Boolean(passed);
      state.canvasGeometryGateReason = reason;
    }

    if (gateName === GATES.DRAW) {
      state.canvasDrawGate = Boolean(passed);
      state.canvasDrawGateReason = reason;
    }

    if (gateName === GATES.PIXEL) {
      state.canvasPixelProofGate = Boolean(passed);
      state.canvasPixelProofGateReason = reason;
    }

    if (gateName === GATES.RECEIPT) {
      state.canvasReceiptPublicationGate = Boolean(passed);
      state.canvasReceiptPublicationGateReason = reason;
    }
  }

  function getProofGateList() {
    return [
      {
        id: GATES.ELEMENT,
        fibonacci: "F1_CANVAS_ELEMENT",
        passed: state.canvasElementGate,
        reason: state.canvasElementGateReason,
        next: "CREATE_OR_LOCATE_CANVAS_ELEMENT"
      },
      {
        id: GATES.CONTEXT,
        fibonacci: "F2_2D_CONTEXT",
        passed: state.canvas2dContextGate,
        reason: state.canvas2dContextGateReason,
        next: "OBTAIN_2D_CONTEXT"
      },
      {
        id: GATES.GEOMETRY,
        fibonacci: "F3_NONZERO_GEOMETRY",
        passed: state.canvasGeometryGate,
        reason: state.canvasGeometryGateReason,
        next: "REPAIR_CANVAS_GEOMETRY_OR_DOM_VISIBILITY"
      },
      {
        id: GATES.DRAW,
        fibonacci: "F5_DRAW_COMPLETION",
        passed: state.canvasDrawGate,
        reason: state.canvasDrawGateReason,
        next: "DRAW_VISIBLE_SURFACE"
      },
      {
        id: GATES.PIXEL,
        fibonacci: "F8_PIXEL_PROOF",
        passed: state.canvasPixelProofGate,
        reason: state.canvasPixelProofGateReason,
        next: "REPAIR_PIXEL_VISIBLE_EXPRESSION_SURFACE"
      },
      {
        id: GATES.RECEIPT,
        fibonacci: "F13_CANVAS_RECEIPT_PUBLICATION_NOT_FINAL_CLAIM",
        passed: state.canvasReceiptPublicationGate,
        reason: state.canvasReceiptPublicationGateReason,
        next: "PUBLISH_VISIBLE_SURFACE_RECEIPT"
      }
    ];
  }

  function updateStandardAudit() {
    const gates = getProofGateList();
    const firstFailed = gates.find((gate) => !gate.passed) || null;
    const passedCount = gates.filter((gate) => gate.passed).length;
    const score = Math.round((passedCount / gates.length) * 100);

    state.canvasStandardsNewsAlignmentScore = score;
    state.canvasStandardsNewsAlignmentFirstFailedStage = firstFailed ? firstFailed.id : "NONE";
    state.canvasStandardsNewsAlignmentStatus = firstFailed
      ? `WAITING_${firstFailed.id}`
      : "CANVAS_STANDARDS_NEWS_ALIGNMENT_COMPLETE";

    state.canvasStandardsFibonacciSynchronizationScore = score;
    state.canvasStandardsFibonacciSynchronizationFirstFailedStage = firstFailed ? firstFailed.fibonacci : "NONE";
    state.canvasStandardsFibonacciSynchronizationStatus = firstFailed
      ? `WAITING_${firstFailed.fibonacci}`
      : "CANVAS_STANDARDS_FIBONACCI_SYNCHRONIZATION_COMPLETE";

    state.firstFailedGate = firstFailed ? firstFailed.id : "NONE";
    state.firstFailedCoordinate = firstFailed ? firstFailed.reason : "NONE_VISIBLE_SURFACE_PIXEL_PROOF_COMPLETE";
    state.recommendedNextAction = firstFailed ? firstFailed.next : "RETURN_CANVAS_VISIBLE_SURFACE_RECEIPT_UPSTREAM";
    state.recommendedNextFile = FILE;

    if (state.visiblePlanetProofReady) {
      state.postgameStatus = "CANVAS_VISIBLE_SURFACE_PIXEL_PROOF_READY_NO_FINAL_CLAIM";
    } else {
      state.postgameStatus = firstFailed
        ? `CANVAS_VISIBLE_SURFACE_HELD_AT_${firstFailed.id}`
        : "CANVAS_VISIBLE_SURFACE_WAITING_UNKNOWN";
    }
  }

  function computedDomVisibility(element) {
    if (!element) return false;

    let rect = { width: 0, height: 0 };

    try {
      rect = isFunction(element.getBoundingClientRect)
        ? element.getBoundingClientRect()
        : rect;
    } catch (_error) {}

    state.canvasRectWidth = safeNumber(rect.width, 0);
    state.canvasRectHeight = safeNumber(rect.height, 0);
    state.canvasRectNonzero = Boolean(rect && rect.width > 0 && rect.height > 0);

    if (!doc || !root.getComputedStyle) return state.canvasRectNonzero;

    try {
      const style = root.getComputedStyle(element);
      const visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        safeNumber(style.opacity, 1) > 0 &&
        state.canvasRectNonzero;

      return Boolean(visible);
    } catch (_error) {
      return state.canvasRectNonzero;
    }
  }

  function chooseCanvasPixels(mount) {
    let cssWidth = 720;

    if (mount && isFunction(mount.getBoundingClientRect)) {
      try {
        const rect = mount.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 320) && root.innerWidth) {
      cssWidth = Math.min(880, Math.max(360, root.innerWidth * 0.86));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(cssWidth * ratio)));
  }

  function prepareCanvasElement(canvas, mount) {
    if (!canvas) return;

    const px = chooseCanvasPixels(mount);

    if (!canvas.width || canvas.width < 256) canvas.width = px;
    if (!canvas.height || canvas.height < 256) canvas.height = px;

    canvas.id = canvas.id || "hearthCanvas";
    canvas.setAttribute("aria-label", "Hearth visible surface canvas");

    if (canvas.dataset) {
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasHub = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.dataset.hearthVisibleSurface = "true";
      canvas.dataset.hearthExpressionSurface = "true";
      canvas.dataset.hearthVisiblePlanetCanvas = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.dataset.hearthCanvasReceipt = RECEIPT;
      canvas.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
      canvas.dataset.hearthCanvasExpressionSurfaceContract = EXPRESSION_SURFACE_CONTRACT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
    }

    if (canvas.style) {
      canvas.style.display = "block";
      canvas.style.width = "min(100%, 760px)";
      canvas.style.maxWidth = "min(88vw, 760px)";
      canvas.style.height = "auto";
      canvas.style.maxHeight = "100%";
      canvas.style.aspectRatio = "1 / 1";
      canvas.style.margin = "0 auto";
      canvas.style.borderRadius = "50%";
      canvas.style.boxSizing = "border-box";
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";
      canvas.style.background = "transparent";
    }
  }

  function locateOrCreateCanvas() {
    if (!doc) {
      setGate(GATES.ELEMENT, false, "DOCUMENT_UNAVAILABLE");
      setGate(GATES.CONTEXT, false, "DOCUMENT_UNAVAILABLE");
      setGate(GATES.GEOMETRY, false, "DOCUMENT_UNAVAILABLE");
      updateStandardAudit();
      return { canvas: null, ctx: null, mount: null };
    }

    const mountResult = firstElement(MOUNT_SELECTORS, doc);
    const mount = mountResult.element;

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;

    let canvas = null;
    let selector = "NONE";

    if (mount) {
      const mounted = firstElement(CANVAS_SELECTORS, mount);
      if (mounted.element && mounted.element.tagName && mounted.element.tagName.toLowerCase() === "canvas") {
        canvas = mounted.element;
        selector = `MOUNT:${mounted.selector}`;
      }
    }

    if (!canvas) {
      const global = firstElement(CANVAS_SELECTORS, doc);
      if (global.element && global.element.tagName && global.element.tagName.toLowerCase() === "canvas") {
        canvas = global.element;
        selector = global.selector;
      }
    }

    if (!canvas && mount) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvas.setAttribute("data-hearth-visible-surface", "true");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      selector = "CREATED_BY_HEARTH_CANVAS_HUB";
    }

    state.canvasLocated = Boolean(canvas);
    state.canvasSelector = selector;

    if (!canvas) {
      setGate(GATES.ELEMENT, false, "CANVAS_ELEMENT_NOT_FOUND_AND_MOUNT_UNAVAILABLE");
      setGate(GATES.CONTEXT, false, "CANVAS_ELEMENT_NOT_FOUND");
      setGate(GATES.GEOMETRY, false, "CANVAS_ELEMENT_NOT_FOUND");
      updateStandardAudit();
      return { canvas: null, ctx: null, mount };
    }

    prepareCanvasElement(canvas, mount);

    let ctx = null;

    try {
      ctx = isFunction(canvas.getContext)
        ? canvas.getContext("2d", { alpha: true, willReadFrequently: true })
        : null;
    } catch (_error) {
      try {
        ctx = isFunction(canvas.getContext) ? canvas.getContext("2d") : null;
      } catch (__error) {
        ctx = null;
      }
    }

    activeCanvas = canvas;
    activeContext = ctx;

    state.canvasWidth = safeNumber(canvas.width, 0);
    state.canvasHeight = safeNumber(canvas.height, 0);
    state.context2dReady = Boolean(ctx);
    state.canvasDomVisible = computedDomVisibility(canvas);

    const intrinsicNonzero = state.canvasWidth > 0 && state.canvasHeight > 0;
    const geometryPassed = Boolean(intrinsicNonzero && state.canvasDomVisible);

    setGate(GATES.ELEMENT, true, "CANVAS_ELEMENT_AVAILABLE");
    setGate(GATES.CONTEXT, Boolean(ctx), ctx ? "CANVAS_2D_CONTEXT_AVAILABLE" : "CANVAS_2D_CONTEXT_UNAVAILABLE");
    setGate(
      GATES.GEOMETRY,
      geometryPassed,
      geometryPassed
        ? "CANVAS_INTRINSIC_AND_DOM_GEOMETRY_NONZERO"
        : !intrinsicNonzero
          ? "CANVAS_INTRINSIC_SIZE_ZERO"
          : "CANVAS_DOM_RECT_ZERO_OR_NOT_VISIBLE"
    );

    updateStandardAudit();
    return { canvas, ctx, mount };
  }

  function canvasContextFrom(value) {
    if (!value) return { canvas: null, ctx: null };

    if (value.canvas && isFunction(value.getImageData)) {
      return { canvas: value.canvas, ctx: value };
    }

    if (value.canvas && value.canvas.getContext && isFunction(value.canvas.getContext)) {
      let ctx = null;
      try {
        ctx = value.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      } catch (_error) {
        ctx = value.canvas.getContext("2d");
      }

      return { canvas: value.canvas, ctx };
    }

    if (value.getContext && isFunction(value.getContext)) {
      let ctx = null;
      try {
        ctx = value.getContext("2d", { alpha: true, willReadFrequently: true });
      } catch (_error) {
        ctx = value.getContext("2d");
      }

      return { canvas: value, ctx };
    }

    if (isObject(value.context)) return canvasContextFrom(value.context);
    if (isObject(value.ctx)) return canvasContextFrom(value.ctx);
    if (isObject(value.canvasOrContext)) return canvasContextFrom(value.canvasOrContext);
    if (isObject(value.targetCanvas)) return canvasContextFrom(value.targetCanvas);
    if (isObject(value.canvasTarget)) return canvasContextFrom(value.canvasTarget);

    return { canvas: null, ctx: null };
  }

  function resolveCanvasTarget(target) {
    const direct = canvasContextFrom(target);

    if (direct.canvas && direct.ctx) {
      prepareCanvasElement(direct.canvas, direct.canvas.parentElement || null);
      activeCanvas = direct.canvas;
      activeContext = direct.ctx;

      state.canvasLocated = true;
      state.canvasSelector = "ARGUMENT";
      state.canvasWidth = safeNumber(direct.canvas.width, 0);
      state.canvasHeight = safeNumber(direct.canvas.height, 0);
      state.context2dReady = true;
      state.canvasDomVisible = computedDomVisibility(direct.canvas);

      setGate(GATES.ELEMENT, true, "CANVAS_ELEMENT_AVAILABLE_FROM_ARGUMENT");
      setGate(GATES.CONTEXT, true, "CANVAS_2D_CONTEXT_AVAILABLE_FROM_ARGUMENT");
      setGate(
        GATES.GEOMETRY,
        Boolean(state.canvasWidth > 0 && state.canvasHeight > 0 && state.canvasDomVisible),
        state.canvasWidth > 0 && state.canvasHeight > 0 && state.canvasDomVisible
          ? "CANVAS_ARGUMENT_GEOMETRY_NONZERO"
          : "CANVAS_ARGUMENT_GEOMETRY_ZERO_OR_HIDDEN"
      );

      updateStandardAudit();
      return { canvas: direct.canvas, ctx: direct.ctx, mount: direct.canvas.parentElement || null };
    }

    return locateOrCreateCanvas();
  }

  function invoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) {
      return { ok: false, value: null, error: `METHOD_UNAVAILABLE:${method}` };
    }

    try {
      return {
        ok: true,
        value: target[method](...(Array.isArray(args) ? args : [args])),
        error: ""
      };
    } catch (error) {
      return {
        ok: false,
        value: null,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function drawMethods(authority) {
    if (!authority || !isObject(authority) || authority === api) return [];

    return [
      "drawToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "renderFrame",
      "renderToCanvas",
      "render",
      "draw",
      "compose"
    ].filter((method) => isFunction(authority[method]));
  }

  function scanExternalAdapters() {
    externalAdapters.length = 0;

    for (const path of DRAWABLE_ADAPTER_PATHS) {
      const authority = readPath(path);
      if (!authority || !isObject(authority) || authority === api) continue;

      const methods = drawMethods(authority);
      if (!methods.length) continue;

      const receipt = readReceipt(authority) || {};
      const contract = contractOf(receipt) || contractOf(authority);
      const receiptName = receiptOf(receipt) || receiptOf(authority);

      if (contract === CONTRACT || contract === INTERNAL_RENEWAL_CONTRACT) continue;

      externalAdapters.push({
        path,
        authority,
        contract,
        receipt: receiptName,
        methods
      });
    }

    state.externalAdapterCount = externalAdapters.length;
    state.externalAdapterNames = externalAdapters.map((item) => item.path).join(",") || "NONE";

    return externalAdapters.slice();
  }

  function buildDrawPacket(canvas, ctx, packet = {}) {
    return {
      packetType: "HEARTH_CANVAS_VISIBLE_SURFACE_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      expressionSurfaceContract: EXPRESSION_SURFACE_CONTRACT,
      expressionSurfaceReceipt: EXPRESSION_SURFACE_RECEIPT,
      sourceFile: FILE,
      canvas,
      ctx,
      context: ctx,
      parentCanvasFile: FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      labWestFile: LABWEST_FILE,
      viewState: isObject(packet.viewState)
        ? clonePlain(packet.viewState)
        : isObject(state.lastViewState)
          ? clonePlain(state.lastViewState)
          : {},
      receiverOnly: true,
      visibleSurfaceProofRequired: true,
      namespaceProofIsVisibleProof: false,
      mountProofIsVisibleProof: false,
      motionProofIsVisibleProof: false,
      ...FINAL_FALSE
    };
  }

  function attemptExternalAdapterDraw(canvas, ctx, packet = {}) {
    const adapters = scanExternalAdapters();
    state.adapterDrawAttempted = adapters.length > 0;

    for (const adapter of adapters) {
      for (const method of adapter.methods) {
        let result;

        if (method === "drawToCanvas" || method === "renderToCanvas") {
          result = invoke(adapter.authority, method, [
            canvas,
            {
              ...buildDrawPacket(canvas, ctx, packet),
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract
            }
          ]);
        } else {
          result = invoke(adapter.authority, method, [
            buildDrawPacket(canvas, ctx, packet),
            {
              source: "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_STANDARD",
              contract: CONTRACT,
              receipt: RECEIPT,
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract,
              ...FINAL_FALSE
            }
          ]);

          if (!result.ok) {
            result = invoke(adapter.authority, method, [
              ctx,
              {
                canvas,
                source: "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_STANDARD",
                contract: CONTRACT,
                receipt: RECEIPT,
                adapterSourceName: adapter.path,
                adapterContract: adapter.contract,
                ...FINAL_FALSE
              }
            ]);
          }
        }

        if (!result.ok) {
          state.adapterError = result.error;
          continue;
        }

        if (!noFinalClaims(result.value)) {
          state.adapterError = `ADAPTER_RETURNED_FORBIDDEN_FINAL_CLAIM:${adapter.path}`;
          continue;
        }

        state.adapterDrawComplete = true;
        state.adapterSourceName = adapter.path;
        state.adapterMethod = method;
        state.adapterContract = adapter.contract || "";
        state.adapterReceipt = adapter.receipt || "";
        state.adapterError = "";
        return true;
      }
    }

    state.adapterDrawComplete = false;
    return false;
  }

  function drawIrregularMass(ctx, cx, cy, radius, seed, sx, sy, rotation) {
    const points = 26;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wave =
        0.76 +
        Math.sin(t * 2.0 + seed) * 0.13 +
        Math.sin(t * 3.0 + seed * 0.71) * 0.08 +
        Math.sin(t * 5.0 - seed * 0.41) * 0.055 +
        Math.sin(t * 9.0 + seed * 0.2) * 0.025;

      const a = t + rotation;
      const x = cx + Math.cos(a) * radius * wave * sx;
      const y = cy + Math.sin(a) * radius * wave * sy;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }

  function drawNativeVisibleGlobe(canvas, ctx, packet = {}) {
    state.nativeDrawAttempted = true;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.39;

      const view = isObject(packet.viewState) ? packet.viewState : {};
      const yaw = safeNumber(view.yaw, safeNumber(packet.yaw, 0));
      const pitch = Math.max(-0.9, Math.min(0.9, safeNumber(view.pitch, safeNumber(packet.pitch, 0))));
      const phase = yaw * 0.35 + safeNumber(view.phase, 0);

      ctx.clearRect(0, 0, w, h);

      const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      field.addColorStop(0, "rgba(18,40,78,1)");
      field.addColorStop(0.5, "rgba(4,13,34,1)");
      field.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = field;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - r * 0.36,
        cy - r * 0.34 + pitch * r * 0.08,
        r * 0.08,
        cx,
        cy,
        r * 1.12
      );
      ocean.addColorStop(0, "rgba(113,190,235,1)");
      ocean.addColorStop(0.35, "rgba(26,105,165,1)");
      ocean.addColorStop(0.75, "rgba(7,45,111,1)");
      ocean.addColorStop(1, "rgba(1,8,32,1)");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.globalAlpha = 0.34;
      ctx.strokeStyle = "rgba(220,244,255,0.26)";
      ctx.lineWidth = Math.max(1, r * 0.005);

      for (let i = -5; i <= 5; i += 1) {
        const y = cy + (i / 6) * r * 0.78 + Math.sin(phase + i) * r * 0.018 + pitch * r * 0.08;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.99, r * 0.095, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 9; i += 1) {
        const x = cx + Math.sin(phase + i * 0.72) * r * 0.74;
        ctx.beginPath();
        ctx.ellipse(x, cy + pitch * r * 0.03, r * 0.105, r * 0.97, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const masses = [
        [-0.38, -0.24, 0.33, 1.16, 0.72, 0.1],
        [0.24, -0.31, 0.25, 0.86, 1.2, 1.4],
        [0.36, 0.14, 0.3, 0.8, 1.08, 2.2],
        [-0.18, 0.2, 0.28, 1.12, 0.88, 3.1],
        [-0.56, 0.05, 0.17, 0.78, 1.36, 4.2],
        [0.02, -0.03, 0.18, 1.52, 0.56, 5.4],
        [0, 0.59, 0.21, 1.58, 0.36, 6.4]
      ];

      for (let i = 0; i < masses.length; i += 1) {
        const item = masses[i];
        const px = cx + item[0] * r + Math.sin(phase + i) * r * 0.035;
        const py = cy + item[1] * r + pitch * r * 0.12 + Math.cos(phase + i * 0.9) * r * 0.02;
        const rr = item[2] * r;

        const land = ctx.createLinearGradient(px - rr, py - rr, px + rr, py + rr);
        land.addColorStop(0, "rgba(168,139,78,1)");
        land.addColorStop(0.45, "rgba(93,132,76,1)");
        land.addColorStop(1, "rgba(41,75,54,1)");
        ctx.fillStyle = land;
        drawIrregularMass(ctx, px, py, rr, item[5] + phase, item[3], item[4], phase * 0.16 + i * 0.21);

        ctx.strokeStyle = "rgba(238,218,150,0.26)";
        ctx.lineWidth = Math.max(1, r * 0.004);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      drawIrregularMass(ctx, cx - r * 0.42, cy - r * 0.47 + pitch * r * 0.06, r * 0.1, 8.2 + phase, 1.8, 0.48, 0.1);
      drawIrregularMass(ctx, cx + r * 0.22, cy - r * 0.58 + pitch * r * 0.05, r * 0.08, 9.1 + phase, 2.2, 0.44, -0.2);
      drawIrregularMass(ctx, cx + r * 0.1, cy + r * 0.49 + pitch * r * 0.03, r * 0.12, 10.4 + phase, 1.9, 0.42, 0.05);
      ctx.globalAlpha = 1;

      const shade = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.43, r * 0.1, cx, cy, r * 1.03);
      shade.addColorStop(0, "rgba(255,255,255,0.22)");
      shade.addColorStop(0.55, "rgba(255,255,255,0)");
      shade.addColorStop(0.86, "rgba(0,0,0,0.26)");
      shade.addColorStop(1, "rgba(0,0,0,0.66)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.strokeStyle = "rgba(207,233,255,0.58)";
      ctx.lineWidth = Math.max(1, r * 0.011);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      state.nativeDrawComplete = true;
      return true;
    } catch (error) {
      state.nativeDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("NATIVE_VISIBLE_GLOBE_DRAW_FAILED", error);
      return false;
    }
  }

  function samplePixelProof(canvas, ctx) {
    state.pixelSampleAttempted = true;

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.pixelSampleStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      state.pixelSampleComplete = false;
      setGate(GATES.PIXEL, false, "PIXEL_SAMPLE_TARGET_UNAVAILABLE");
      updateStandardAudit();
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.max(3, Math.min(22, Math.floor(Math.min(w, h) / 42)));
      const points = [
        [0.5, 0.5],
        [0.35, 0.42],
        [0.64, 0.58],
        [0.5, 0.72],
        [0.26, 0.52],
        [0.75, 0.5],
        [0.5, 0.22],
        [0.5, 0.86]
      ];

      let nonTransparent = 0;
      let minLuma = 999;
      let maxLuma = -999;
      const colors = new Set();

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(w - size, Math.floor(w * px - size / 2)));
        const y = Math.max(0, Math.min(h - size, Math.floor(h * py - size / 2)));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a > 0) {
            nonTransparent += 1;
            const luma = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
            minLuma = Math.min(minLuma, luma);
            maxLuma = Math.max(maxLuma, luma);
            colors.add(`${Math.round(r / 12)}:${Math.round(g / 12)}:${Math.round(b / 12)}:${Math.round(a / 32)}`);
          }
        }
      }

      const spread = maxLuma - minLuma;
      const unique = colors.size;
      const ok = Boolean(nonTransparent > 0 && spread >= 18 && unique >= 4);

      state.pixelSampleComplete = true;
      state.pixelSampleNonTransparentCount = nonTransparent;
      state.pixelSampleColorSpread = spread;
      state.pixelSampleUniqueColorCount = unique;
      state.pixelSampleStatus = ok ? "PIXEL_SAMPLE_VISIBLE_VARIANT" : "PIXEL_SAMPLE_INSUFFICIENT_VARIANCE";
      state.canvasPixelVarianceStatus = state.pixelSampleStatus;
      state.pixelSampleError = "";

      setGate(
        GATES.PIXEL,
        ok,
        ok
          ? "CANVAS_PIXEL_SAMPLE_VISIBLE_AND_VARIANT"
          : `CANVAS_PIXEL_SAMPLE_INSUFFICIENT_VARIANCE:nonTransparent=${nonTransparent}:spread=${spread}:unique=${unique}`
      );

      updateStandardAudit();
      return ok;
    } catch (error) {
      state.pixelSampleComplete = false;
      state.pixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_ERROR";
      state.pixelSampleError = error && error.message ? String(error.message) : String(error);

      setGate(GATES.PIXEL, false, `PIXEL_SAMPLE_ERROR:${state.pixelSampleError}`);
      updateStandardAudit();
      recordError("PIXEL_SAMPLE_FAILED", error);
      return false;
    }
  }

  function updateVisibleSurfaceProof(pixelReady, source, reason) {
    state.visibleBaseGlobeCarrierActive = Boolean(pixelReady);
    state.canvasVisibleBaseGlobeCarrierActive = Boolean(pixelReady);
    state.baseGlobeVisibleCarrierReady = Boolean(pixelReady);
    state.visibleGlobeCarrierReady = Boolean(pixelReady);
    state.canvasExpressionSurfaceReady = Boolean(pixelReady);
    state.canvasExpressionRichnessReady = Boolean(pixelReady);
    state.domExpressionSurfaceProofReady = Boolean(pixelReady);
    state.visiblePlanetProofReady = Boolean(pixelReady);
    state.renderedPlanetProofReady = Boolean(pixelReady);
    state.currentVisibleProofValid = Boolean(pixelReady);
    state.visiblePlanetReceiptObserved = Boolean(pixelReady);
    state.visiblePlanetProofSource = pixelReady ? source : "NONE";
    state.visiblePlanetProofReason = pixelReady ? reason : "VISIBLE_SURFACE_PIXEL_PROOF_NOT_READY";

    state.structuralCarrierReady = Boolean(pixelReady);
    state.structuralCarrierSafe = Boolean(pixelReady);
    state.canvasParentCarrierSafe = Boolean(pixelReady);
    state.structuralCarrierSafeForCanvasRelease = Boolean(pixelReady);
    state.canvasPreReleaseCarrierSafeForWest = Boolean(pixelReady);
    state.canvasParentReleaseAccepted = Boolean(pixelReady || state.releasePacketReceived);
    state.canvasParentReleaseLawful = Boolean(pixelReady || state.releasePacketReceived);
    state.releasePacketAccepted = Boolean(pixelReady || state.releasePacketReceived);

    state.f13CanvasReadinessObserved = Boolean(state.canvasLocated && state.context2dReady && state.canvasGeometryGate);
    state.f13VisibleEvidenceAvailable = Boolean(pixelReady);
    state.f13InspectEvidenceAvailable = Boolean(pixelReady || state.pointerFingerObserved);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(pixelReady);
    state.f13CanvasEvidenceComplete = Boolean(pixelReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = pixelReady
      ? "VISIBLE_SURFACE_PIXEL_PROOF_READY_STRICT_F13_PENDING"
      : "VISIBLE_SURFACE_PIXEL_PROOF_NOT_READY";
    state.f13StrictEvidenceRepairTarget = pixelReady ? FINGER_FILES.composite : FILE;

    updateStandardAudit();
  }

  function drawToCanvas(canvasOrContext = null, packet = {}) {
    if (drawingGuard) return getReceiptLight(false);
    drawingGuard = true;

    try {
      state.drawAttempted = true;
      state.drawCount += 1;
      state.lastDrawAt = nowIso();
      state.lastDrawReason = safeString(packet.reason || packet.drawReason || "drawToCanvas");
      state.lastPacket = isObject(packet) ? clonePlain(packet) : state.lastPacket;

      if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

      const target = resolveCanvasTarget(canvasOrContext || packet);

      if (!target.canvas) {
        state.drawComplete = false;
        state.canvasDrawComplete = false;
        state.baseGlobeDrawComplete = false;
        state.lastDrawSource = "NONE";
        state.lastDrawError = "CANVAS_ELEMENT_UNAVAILABLE";

        setGate(GATES.DRAW, false, "DRAW_BLOCKED_CANVAS_ELEMENT_UNAVAILABLE");
        updateVisibleSurfaceProof(false, "NONE", state.lastDrawError);
        updateDataset();
        schedulePublish();
        return getReceiptLight(false);
      }

      if (!target.ctx) {
        state.drawComplete = false;
        state.canvasDrawComplete = false;
        state.baseGlobeDrawComplete = false;
        state.lastDrawSource = "NONE";
        state.lastDrawError = "CANVAS_2D_CONTEXT_UNAVAILABLE";

        setGate(GATES.DRAW, false, "DRAW_BLOCKED_2D_CONTEXT_UNAVAILABLE");
        updateVisibleSurfaceProof(false, "NONE", state.lastDrawError);
        updateDataset();
        schedulePublish();
        return getReceiptLight(false);
      }

      if (!state.canvasGeometryGate) {
        state.drawComplete = false;
        state.canvasDrawComplete = false;
        state.baseGlobeDrawComplete = false;
        state.lastDrawSource = "NONE";
        state.lastDrawError = state.canvasGeometryGateReason;

        setGate(GATES.DRAW, false, `DRAW_BLOCKED_${state.canvasGeometryGateReason}`);
        updateVisibleSurfaceProof(false, "NONE", state.lastDrawError);
        updateDataset();
        schedulePublish();
        return getReceiptLight(false);
      }

      let source = "NONE";
      let reason = "DRAW_NOT_COMPLETE";

      const adapterOk = attemptExternalAdapterDraw(target.canvas, target.ctx, packet);
      let pixelReadyAfterAdapter = false;

      if (adapterOk) {
        pixelReadyAfterAdapter = samplePixelProof(target.canvas, target.ctx);

        if (pixelReadyAfterAdapter) {
          source = `DOWNSTREAM_DRAWABLE_ADAPTER:${state.adapterSourceName}`;
          reason = `DOWNSTREAM_DRAWABLE_ADAPTER_PIXEL_PROOF:${state.adapterMethod}`;
        }
      }

      if (!pixelReadyAfterAdapter) {
        const nativeOk = drawNativeVisibleGlobe(target.canvas, target.ctx, packet);
        source = "CANVAS_HUB_NATIVE_2D_VISIBLE_SURFACE";
        reason = nativeOk
          ? "NATIVE_2D_VISIBLE_SURFACE_DRAW_COMPLETE"
          : "NATIVE_2D_VISIBLE_SURFACE_DRAW_FAILED";
      }

      const pixelReady = samplePixelProof(target.canvas, target.ctx);

      state.drawComplete = Boolean(pixelReady);
      state.canvasDrawComplete = Boolean(pixelReady);
      state.baseGlobeDrawComplete = Boolean(pixelReady);
      state.lastDrawSource = pixelReady ? source : "NONE";
      state.lastDrawError = pixelReady ? "" : state.pixelSampleError || state.pixelSampleStatus || "PIXEL_PROOF_FAILED";

      setGate(
        GATES.DRAW,
        Boolean(pixelReady || state.nativeDrawComplete || state.adapterDrawComplete),
        pixelReady || state.nativeDrawComplete || state.adapterDrawComplete
          ? "CANVAS_DRAW_ATTEMPT_COMPLETE"
          : "CANVAS_DRAW_ATTEMPT_FAILED"
      );

      updateVisibleSurfaceProof(pixelReady, source, reason);
      updateDataset();
      publishReceipts();
      notifyUpstream("drawToCanvas");

      return getReceiptLight(false);
    } catch (error) {
      state.drawComplete = false;
      state.canvasDrawComplete = false;
      state.baseGlobeDrawComplete = false;
      state.lastDrawSource = "NONE";
      state.lastDrawError = error && error.message ? String(error.message) : String(error);

      setGate(GATES.DRAW, false, `DRAW_EXCEPTION:${state.lastDrawError}`);
      setGate(GATES.PIXEL, false, "PIXEL_PROOF_BLOCKED_BY_DRAW_EXCEPTION");
      updateVisibleSurfaceProof(false, "NONE", state.lastDrawError);
      recordError("DRAW_TO_CANVAS_FAILED", error);
      updateDataset();
      publishReceipts();

      return getReceiptLight(false);
    } finally {
      drawingGuard = false;
    }
  }

  function drawVisibleExpression(targetOrPacket = {}, maybePacket = {}) {
    const looksLikeTarget =
      targetOrPacket &&
      (
        isFunction(targetOrPacket.getContext) ||
        (targetOrPacket.canvas && isFunction(targetOrPacket.getImageData)) ||
        (targetOrPacket.canvas && isFunction(targetOrPacket.canvas.getContext))
      );

    if (looksLikeTarget) return drawToCanvas(targetOrPacket, maybePacket);
    return drawToCanvas(null, targetOrPacket);
  }

  function render(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function draw(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function scheduleDraw(reason = "scheduled-draw") {
    if (!root.setTimeout) return drawVisibleExpression({ reason });

    if (drawTimer) return true;

    drawTimer = root.setTimeout(() => {
      drawTimer = 0;
      drawVisibleExpression({ reason });
    }, 80);

    return true;
  }

  function receivePacket(packet = {}, lane = "GENERIC") {
    if (!isObject(packet)) return getReceiptLight(false);

    state.packetCount += 1;
    state.lastPacket = clonePlain(packet);

    if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

    const contract = contractOf(packet);
    const receipt = receiptOf(packet);
    const sourceFile = safeString(packet.sourceFile || packet.file || "");

    if (lane === "ROUTE_CONDUCTOR") {
      state.routeConductorPacketCount += 1;
      state.lastRouteConductorPacket = clonePlain(packet);
      state.routeConductorObserved = true;
      state.routeConductorContract = contract || state.routeConductorContract;
      state.routeConductorReceipt = receipt || state.routeConductorReceipt;
      state.releasePacketReceived = true;
    }

    if (lane === "LABWEST") {
      state.labWestPacketCount += 1;
      state.lastLabWestPacket = clonePlain(packet);
      state.labWestObserved = true;
      state.labWestContract = contract || state.labWestContract;
      state.labWestReceipt = receipt || state.labWestReceipt;
      state.releasePacketReceived = true;
    }

    if (lane === "QUEEN") {
      state.queenPacketCount += 1;
      state.lastQueenPacket = clonePlain(packet);
      state.queenObserved = true;
      state.queenContract = contract || state.queenContract;
      state.queenReceipt = receipt || state.queenReceipt;
    }

    if (lane === "FINGER") {
      state.fingerPacketCount += 1;
      state.lastFingerPacket = clonePlain(packet);
      state.anyFingerTrackActive = true;
      state.fingerAuthorityObservedCount = Math.max(1, state.fingerAuthorityObservedCount);
      state.fingerApiReadyCount = Math.max(1, state.fingerApiReadyCount);
      state.fingerExpressionPacketCount += safeString(packet.packetType || packet.type).includes("EXPRESSION") ? 1 : 0;
      state.fingerReceiptPacketCount += receipt ? 1 : 0;
      state.fingerTrackReadyCount = Math.max(1, state.fingerTrackReadyCount);
      state.pointerFingerObserved = Boolean(
        state.pointerFingerObserved ||
          sourceFile === FINGER_FILES.inspect ||
          safeString(packet.fingerKey || packet.key || "").toLowerCase() === "inspect"
      );
    }

    if (lane === "DIAGNOSTIC") {
      state.diagnosticPacketCount += 1;
      state.lastDiagnosticPacket = clonePlain(packet);
    }

    record("CANVAS_PACKET_RECEIVED", {
      lane,
      packetType: packet.packetType || packet.type || "",
      contract,
      sourceFile,
      targetFile: packet.targetFile || ""
    });

    if (
      packet.canvas ||
      packet.ctx ||
      packet.context ||
      packet.drawNow === true ||
      packet.visibleExpressionRequested === true ||
      packet.canvasReleaseAuthorized === true ||
      lane === "ROUTE_CONDUCTOR" ||
      lane === "LABWEST"
    ) {
      drawToCanvas(packet.canvas || packet.ctx || packet.context || null, packet);
    } else {
      scheduleDraw(`packet-received:${lane}`);
    }

    updateDataset();
    schedulePublish();
    return getReceiptLight(false);
  }

  function receiveRouteConductorReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function consumeRouteConductorReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveCanvasReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function consumeReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function acceptReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }

  function receiveLabWestPacket(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveLabWestContext(packet = {}) { return receiveLabWestPacket(packet); }
  function receiveWestGateContext(packet = {}) { return receiveLabWestPacket(packet); }
  function receiveAdmissibilityContext(packet = {}) { return receiveLabWestPacket(packet); }

  function receiveQueenPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveQueenContext(packet = {}) { return receiveQueenPacket(packet); }
  function receiveControlPacket(packet = {}) { return receiveQueenPacket(packet); }
  function receiveControlsPacket(packet = {}) { return receiveQueenPacket(packet); }
  function receiveControlViewPacket(packet = {}) { return receiveQueenPacket(packet); }
  function receiveViewControlPacket(packet = {}) { return receiveQueenPacket(packet); }
  function receivePlanetaryControlPacket(packet = {}) { return receiveQueenPacket(packet); }

  function receiveFingerPacket(packet = {}) { return receivePacket(packet, "FINGER"); }
  function receiveCanvasFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveExpressionFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveFingerReceipt(packet = {}) { return receiveFingerPacket(packet); }
  function receiveCanvasExpressionPacket(packet = {}) { return receiveFingerPacket(packet); }
  function registerCanvasFinger(packet = {}) { return receiveFingerPacket(packet); }
  function registerExpressionFinger(packet = {}) { return receiveFingerPacket(packet); }
  function receiveBishopPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveCanvasBishopPacket(packet = {}) { return receiveFingerPacket(packet); }
  function registerCanvasBishop(packet = {}) { return receiveFingerPacket(packet); }
  function registerExpressionBishop(packet = {}) { return receiveFingerPacket(packet); }

  function receiveDiagnosticPacket(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }
  function receiveHierarchyContext(packet = {}) { return receiveDiagnosticPacket(packet); }

  function scanUpstreamAuthorities() {
    for (const path of UPSTREAM_ALIAS_PATHS) {
      const authority = readPath(path);
      if (!authority || authority === api || !isObject(authority)) continue;

      const receipt = readReceipt(authority) || {};
      const contract = contractOf(receipt) || contractOf(authority);
      const receiptName = receiptOf(receipt) || receiptOf(authority);

      if (path.includes("ROUTE") || path.includes("routeConductor") || path.includes("routeNorth")) {
        state.routeConductorObserved = true;
        state.routeConductorContract = contract || state.routeConductorContract;
        state.routeConductorReceipt = receiptName || state.routeConductorReceipt;
      } else if (path.includes("WEST") || path.includes("West") || path.includes("west")) {
        state.labWestObserved = true;
        state.labWestContract = contract || state.labWestContract;
        state.labWestReceipt = receiptName || state.labWestReceipt;
      } else if (path.includes("CONTROL") || path.includes("QUEEN") || path.includes("controls") || path.includes("queen")) {
        state.queenObserved = true;
        state.queenContract = contract || state.queenContract;
        state.queenReceipt = receiptName || state.queenReceipt;
      }
    }

    return getReceiptLight(false);
  }

  function composeCanvasStandardNews() {
    const gates = getProofGateList();

    return {
      packetType: "HEARTH_CANVAS_STANDARD_NEWS_ALIGNMENT_PACKET",
      status: state.canvasStandardsNewsAlignmentStatus,
      score: state.canvasStandardsNewsAlignmentScore,
      firstFailedStage: state.canvasStandardsNewsAlignmentFirstFailedStage,
      sequence: [
        "NORTH_CANVAS_PARENT_RECOGNITION",
        "EAST_CANVAS_ELEMENT_AND_CONTEXT",
        "WEST_NONZERO_GEOMETRY_AND_PIXEL_STANDARD",
        "SOUTH_VISIBLE_SURFACE_RECEIPT_PUBLICATION",
        "NORTH_RETURN_WITHOUT_F13_OR_F21_CLAIM"
      ],
      gates: clonePlain(gates),
      complete: state.canvasStandardsNewsAlignmentFirstFailedStage === "NONE",
      diagnosticTrackSeparate: true,
      productionCanvasStandardsSeparate: true,
      ...FINAL_FALSE
    };
  }

  function composeCanvasStandardFibonacci() {
    const gates = getProofGateList();

    return {
      packetType: "HEARTH_CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_PACKET",
      status: state.canvasStandardsFibonacciSynchronizationStatus,
      score: state.canvasStandardsFibonacciSynchronizationScore,
      firstFailedStage: state.canvasStandardsFibonacciSynchronizationFirstFailedStage,
      ladder: gates.map((gate) => ({
        fibonacci: gate.fibonacci,
        gate: gate.id,
        passed: gate.passed,
        reason: gate.reason
      })),
      complete: state.canvasStandardsFibonacciSynchronizationFirstFailedStage === "NONE",
      f13HereMeansCanvasReceiptPublicationOnly: true,
      f13FinalClaimed: false,
      f21NorthLatchClaimed: false,
      ...FINAL_FALSE
    };
  }

  function composeReceiptLight() {
    updateStandardAudit();

    return {
      packetType: "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV122Contract: LINEAGE_V12_2_CONTRACT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      lineageV116Contract: LINEAGE_V11_6_CONTRACT,
      expressionSurfaceContract: EXPRESSION_SURFACE_CONTRACT,
      expressionSurfaceReceipt: EXPRESSION_SURFACE_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      servedContractPreservedForUpstreamRecognition: true,
      receiverOnly: true,
      visibleSurfaceProofStandardActive: true,

      namespaceProofIsVisibleProof: false,
      mountProofIsVisibleProof: false,
      bridgeProofIsVisibleProof: false,
      motionProofIsVisibleProof: false,
      controlProofIsVisibleProof: false,

      loaded: true,
      booted: state.booted,
      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      currentCanvasParentRecognized: true,
      currentCanvasParentIsCurrentCanvas: true,
      currentCanvasParentIsLocalStation: true,
      currentCanvasParentIsExpressionHub: true,
      currentCanvasParentIsFingerManager: true,
      currentCanvasParentIsVisibleBaseGlobeCarrier: state.visibleBaseGlobeCarrierActive,

      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      canvasLocalStationContract: CONTRACT,
      canvasLocalStationReceipt: RECEIPT,
      hearthCanvasContract: CONTRACT,
      hearthCanvasReceipt: RECEIPT,
      canvasV123Recognized: true,
      canvasContractAccepted: true,
      canvasSummaryAcceptedByContract: true,
      canvasSummaryAcceptedByShape: true,
      canvasSummaryShapeTrusted: true,
      canvasBaselineOnly: false,
      canvasLocalStationApiReady: true,
      canvasParentBootMethodAvailable: true,
      receiveSurfaceReady: true,

      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      visibleSurfaceActive: true,
      expressionSurfaceActive: true,

      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      upstreamNotifyCount: state.upstreamNotifyCount,

      canvasElementGate: state.canvasElementGate,
      canvasElementGateReason: state.canvasElementGateReason,
      canvas2dContextGate: state.canvas2dContextGate,
      canvas2dContextGateReason: state.canvas2dContextGateReason,
      canvasGeometryGate: state.canvasGeometryGate,
      canvasGeometryGateReason: state.canvasGeometryGateReason,
      canvasDrawGate: state.canvasDrawGate,
      canvasDrawGateReason: state.canvasDrawGateReason,
      canvasPixelProofGate: state.canvasPixelProofGate,
      canvasPixelProofGateReason: state.canvasPixelProofGateReason,
      canvasReceiptPublicationGate: state.canvasReceiptPublicationGate,
      canvasReceiptPublicationGateReason: state.canvasReceiptPublicationGateReason,
      proofGates: clonePlain(getProofGateList()),

      canvasLocated: state.canvasLocated,
      canvasCreated: state.canvasCreated,
      canvasSelector: state.canvasSelector,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMounted: Boolean(state.canvasLocated && state.context2dReady && state.canvasGeometryGate),
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectWidth: state.canvasRectWidth,
      canvasRectHeight: state.canvasRectHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasDomVisible: state.canvasDomVisible,
      canvasContext2dReady: state.context2dReady,

      drawAttempted: state.drawAttempted,
      drawComplete: state.drawComplete,
      canvasDrawComplete: state.canvasDrawComplete,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      holdingFieldDrawComplete: state.drawComplete,
      imageRendered: state.drawComplete,
      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawReason: state.lastDrawReason,
      lastDrawSource: state.lastDrawSource,
      lastDrawError: state.lastDrawError,

      adapterDrawAttempted: state.adapterDrawAttempted,
      adapterDrawComplete: state.adapterDrawComplete,
      adapterSourceName: state.adapterSourceName,
      adapterMethod: state.adapterMethod,
      adapterContract: state.adapterContract,
      adapterReceipt: state.adapterReceipt,
      adapterError: state.adapterError,
      externalAdapterCount: state.externalAdapterCount,
      externalAdapterNames: state.externalAdapterNames,

      nativeDrawAttempted: state.nativeDrawAttempted,
      nativeDrawComplete: state.nativeDrawComplete,

      pixelSampleAttempted: state.pixelSampleAttempted,
      pixelSampleComplete: state.pixelSampleComplete,
      pixelSampleStatus: state.pixelSampleStatus,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,
      pixelSampleNonTransparentCount: state.pixelSampleNonTransparentCount,
      pixelSampleColorSpread: state.pixelSampleColorSpread,
      pixelSampleUniqueColorCount: state.pixelSampleUniqueColorCount,
      pixelSampleError: state.pixelSampleError,

      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      currentVisibleProofValid: state.currentVisibleProofValid,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofReady,
      visiblePlanetReceiptObserved: state.visiblePlanetReceiptObserved,

      structuralCarrierReady: state.structuralCarrierReady,
      hearthCanvasStructuralCarrierReady: state.structuralCarrierReady,
      structuralCarrierSafe: state.structuralCarrierSafe,
      hearthCanvasStructuralCarrierSafe: state.structuralCarrierSafe,
      canvasParentCarrierSafe: state.canvasParentCarrierSafe,
      hearthCanvasParentCarrierSafe: state.canvasParentCarrierSafe,
      structuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      hearthCanvasStructuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      canvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      hearthCanvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseAccepted: state.canvasParentReleaseAccepted,
      releasePacketAccepted: state.releasePacketAccepted,
      canvasParentReleaseObserved: state.releasePacketReceived || state.canvasParentReleaseAccepted,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      parentReleaseLawful: state.canvasParentReleaseLawful,
      parentAcceptedRouteConductorRelease: state.canvasParentReleaseAccepted,
      parentReleasePacketLawful: state.canvasParentReleaseLawful,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      labWestObserved: state.labWestObserved,
      labWestContract: state.labWestContract,
      labWestReceipt: state.labWestReceipt,
      queenObserved: state.queenObserved,
      queenContract: state.queenContract,
      queenReceipt: state.queenReceipt,

      packetCount: state.packetCount,
      routeConductorPacketCount: state.routeConductorPacketCount,
      labWestPacketCount: state.labWestPacketCount,
      queenPacketCount: state.queenPacketCount,
      fingerPacketCount: state.fingerPacketCount,
      diagnosticPacketCount: state.diagnosticPacketCount,

      anyFingerTrackActive: state.anyFingerTrackActive,
      allDeclaredFingerTracksReady: state.allDeclaredFingerTracksReady,
      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,
      firstFingerGap: state.firstFingerGap,
      firstFingerGapFile: state.firstFingerGapFile,
      nextFingerKey: state.nextFingerKey,
      nextFingerFile: state.nextFingerFile,
      pointerFingerObserved: state.pointerFingerObserved,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: false,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: false,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,
      degradedF13IsFunctional: Boolean(state.f13CanvasEvidenceDegraded && state.f13CanvasEvidenceComplete),
      strictVisualProofPending: Boolean(state.f13CanvasEvidenceComplete),
      functionalPageObserved: Boolean(state.visiblePlanetProofReady),

      canvasStandardsNewsAlignmentActive: true,
      canvasStandardsNewsAlignmentStatus: state.canvasStandardsNewsAlignmentStatus,
      canvasStandardsNewsAlignmentScore: state.canvasStandardsNewsAlignmentScore,
      canvasStandardsNewsAlignmentFirstFailedStage: state.canvasStandardsNewsAlignmentFirstFailedStage,

      canvasStandardsFibonacciSynchronizationActive: true,
      canvasStandardsFibonacciSynchronizationStatus: state.canvasStandardsFibonacciSynchronizationStatus,
      canvasStandardsFibonacciSynchronizationScore: state.canvasStandardsFibonacciSynchronizationScore,
      canvasStandardsFibonacciSynchronizationFirstFailedStage: state.canvasStandardsFibonacciSynchronizationFirstFailedStage,

      firstFailedGate: state.firstFailedGate,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,
      updatedAt: state.updatedAt || nowIso(),

      ownsCanvasReceiverOutputCarrier: true,
      ownsOwnCanvasAliases: true,
      ownsCanvasPlacementFallback: true,
      owns2DExpressionSurfaceFallback: true,
      ownsVisibleSurfacePixelProofPublication: true,

      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
      ownsCompositeTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      ownsQueenTruth: false,
      ownsControlRuntimeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsDiagnosticRailCaseSelection: false,
      ownsF13: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsCompletionLatch: false,
      ownsFinalVisualPassClaim: false,

      ...FINAL_FALSE
    };
  }

  function getReceiptLight(doScan = false) {
    if (doScan) {
      scanExternalAdapters();
      scanUpstreamAuthorities();
    }

    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      packetType: "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_RECEIPT",
      currentReceipt: true,
      canvasStandardsNewsAlignment: composeCanvasStandardNews(),
      canvasStandardsFibonacciSynchronization: composeCanvasStandardFibonacci(),
      canvasAliasPaths: CANVAS_ALIAS_PATHS.slice(),
      receiptAliasPaths: RECEIPT_ALIAS_PATHS.slice(),
      drawableAdapterPathsReadOnly: DRAWABLE_ADAPTER_PATHS.slice(),
      upstreamAliasPaths: UPSTREAM_ALIAS_PATHS.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      lastPacket: clonePlain(state.lastPacket),
      lastRouteConductorPacket: clonePlain(state.lastRouteConductorPacket),
      lastLabWestPacket: clonePlain(state.lastLabWestPacket),
      lastQueenPacket: clonePlain(state.lastQueenPacket),
      lastFingerPacket: clonePlain(state.lastFingerPacket),
      lastDiagnosticPacket: clonePlain(state.lastDiagnosticPacket),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `internalRenewalContract=${r.internalRenewalContract}`,
      `internalRenewalReceipt=${r.internalRenewalReceipt}`,
      `servedContractPreservedForUpstreamRecognition=${r.servedContractPreservedForUpstreamRecognition}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `expressionSurfaceContract=${r.expressionSurfaceContract}`,
      `expressionSurfaceReceipt=${r.expressionSurfaceReceipt}`,
      `file=${FILE}`,
      `route=${ROUTE}`,
      `version=${VERSION}`,
      "",
      "VISIBLE_PROOF_STANDARD",
      `namespaceProofIsVisibleProof=${r.namespaceProofIsVisibleProof}`,
      `mountProofIsVisibleProof=${r.mountProofIsVisibleProof}`,
      `bridgeProofIsVisibleProof=${r.bridgeProofIsVisibleProof}`,
      `motionProofIsVisibleProof=${r.motionProofIsVisibleProof}`,
      `controlProofIsVisibleProof=${r.controlProofIsVisibleProof}`,
      `canvasElementGate=${r.canvasElementGate}`,
      `canvasElementGateReason=${r.canvasElementGateReason}`,
      `canvas2dContextGate=${r.canvas2dContextGate}`,
      `canvas2dContextGateReason=${r.canvas2dContextGateReason}`,
      `canvasGeometryGate=${r.canvasGeometryGate}`,
      `canvasGeometryGateReason=${r.canvasGeometryGateReason}`,
      `canvasDrawGate=${r.canvasDrawGate}`,
      `canvasDrawGateReason=${r.canvasDrawGateReason}`,
      `canvasPixelProofGate=${r.canvasPixelProofGate}`,
      `canvasPixelProofGateReason=${r.canvasPixelProofGateReason}`,
      `canvasReceiptPublicationGate=${r.canvasReceiptPublicationGate}`,
      `canvasReceiptPublicationGateReason=${r.canvasReceiptPublicationGateReason}`,
      "",
      "CANVAS_PARENT",
      `currentCanvasParentObserved=${r.currentCanvasParentObserved}`,
      `currentCanvasParentContract=${r.currentCanvasParentContract}`,
      `currentCanvasParentReceipt=${r.currentCanvasParentReceipt}`,
      `currentCanvasParentRecognized=${r.currentCanvasParentRecognized}`,
      `canvasV123Recognized=${r.canvasV123Recognized}`,
      `canvasContractAccepted=${r.canvasContractAccepted}`,
      `canvasLocalStationApiReady=${r.canvasLocalStationApiReady}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      "",
      "SURFACE",
      `canvasLocated=${r.canvasLocated}`,
      `canvasCreated=${r.canvasCreated}`,
      `canvasSelector=${r.canvasSelector}`,
      `canvasMountFound=${r.canvasMountFound}`,
      `canvasMountSelector=${r.canvasMountSelector}`,
      `canvasMounted=${r.canvasMounted}`,
      `canvasWidth=${r.canvasWidth}`,
      `canvasHeight=${r.canvasHeight}`,
      `canvasRectWidth=${r.canvasRectWidth}`,
      `canvasRectHeight=${r.canvasRectHeight}`,
      `canvasDomVisible=${r.canvasDomVisible}`,
      `canvasContext2dReady=${r.canvasContext2dReady}`,
      `drawAttempted=${r.drawAttempted}`,
      `drawComplete=${r.drawComplete}`,
      `lastDrawSource=${r.lastDrawSource}`,
      `lastDrawError=${r.lastDrawError}`,
      `adapterDrawComplete=${r.adapterDrawComplete}`,
      `nativeDrawComplete=${r.nativeDrawComplete}`,
      `pixelSampleStatus=${r.pixelSampleStatus}`,
      `canvasPixelVarianceStatus=${r.canvasPixelVarianceStatus}`,
      `pixelSampleColorSpread=${r.pixelSampleColorSpread}`,
      `pixelSampleUniqueColorCount=${r.pixelSampleUniqueColorCount}`,
      "",
      "VISIBLE_PLANET",
      `canvasExpressionSurfaceReady=${r.canvasExpressionSurfaceReady}`,
      `canvasExpressionRichnessReady=${r.canvasExpressionRichnessReady}`,
      `domExpressionSurfaceProofReady=${r.domExpressionSurfaceProofReady}`,
      `visiblePlanetProofReady=${r.visiblePlanetProofReady}`,
      `visiblePlanetProofSource=${r.visiblePlanetProofSource}`,
      `visiblePlanetProofReason=${r.visiblePlanetProofReason}`,
      "",
      "CANVAS_STANDARDS_NEWS_ALIGNMENT",
      `canvasStandardsNewsAlignmentStatus=${r.canvasStandardsNewsAlignmentStatus}`,
      `canvasStandardsNewsAlignmentScore=${r.canvasStandardsNewsAlignmentScore}`,
      `canvasStandardsNewsAlignmentFirstFailedStage=${r.canvasStandardsNewsAlignmentFirstFailedStage}`,
      "",
      "CANVAS_STANDARDS_FIBONACCI_SYNCHRONIZATION",
      `canvasStandardsFibonacciSynchronizationStatus=${r.canvasStandardsFibonacciSynchronizationStatus}`,
      `canvasStandardsFibonacciSynchronizationScore=${r.canvasStandardsFibonacciSynchronizationScore}`,
      `canvasStandardsFibonacciSynchronizationFirstFailedStage=${r.canvasStandardsFibonacciSynchronizationFirstFailedStage}`,
      "",
      "F13_F21_BOUNDARY",
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13Claimed=false`,
      `f21EligibleForNorth=false`,
      `f21SubmittedToNorth=false`,
      "",
      "BOUNDARIES",
      `ownsTerrainTruth=false`,
      `ownsHydrologyTruth=false`,
      `ownsElevationTruth=false`,
      `ownsMaterialTruth=false`,
      `ownsCompositeTruth=false`,
      `ownsHexTruth=false`,
      `ownsFingerTruth=false`,
      `ownsPointerTruth=false`,
      `ownsQueenTruth=false`,
      `ownsLabWestAdmissibilityTruth=false`,
      `ownsRouteConductorHandshakeTruth=false`,
      `visualPassClaimed=false`,
      `generatedImage=false`,
      `graphicBox=false`,
      `webGL=false`,
      "",
      "NEXT",
      `firstFailedGate=${r.firstFailedGate}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `postgameStatus=${r.postgameStatus}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasCurrentCanvasParentContract", CONTRACT);
    setDataset("hearthCanvasCurrentCanvasParentReceipt", RECEIPT);
    setDataset("hearthCanvasCurrentCanvasParentRecognized", "true");
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasExpressionSurfaceContract", EXPRESSION_SURFACE_CONTRACT);
    setDataset("hearthCanvasExpressionSurfaceReceipt", EXPRESSION_SURFACE_RECEIPT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasNamespaceProofIsVisibleProof", "false");
    setDataset("hearthCanvasMountProofIsVisibleProof", "false");
    setDataset("hearthCanvasBridgeProofIsVisibleProof", "false");
    setDataset("hearthCanvasMotionProofIsVisibleProof", "false");
    setDataset("hearthCanvasControlProofIsVisibleProof", "false");

    setDataset("hearthCanvasElementGate", String(state.canvasElementGate));
    setDataset("hearthCanvasElementGateReason", state.canvasElementGateReason);
    setDataset("hearthCanvas2dContextGate", String(state.canvas2dContextGate));
    setDataset("hearthCanvas2dContextGateReason", state.canvas2dContextGateReason);
    setDataset("hearthCanvasGeometryGate", String(state.canvasGeometryGate));
    setDataset("hearthCanvasGeometryGateReason", state.canvasGeometryGateReason);
    setDataset("hearthCanvasDrawGate", String(state.canvasDrawGate));
    setDataset("hearthCanvasDrawGateReason", state.canvasDrawGateReason);
    setDataset("hearthCanvasPixelProofGate", String(state.canvasPixelProofGate));
    setDataset("hearthCanvasPixelProofGateReason", state.canvasPixelProofGateReason);
    setDataset("hearthCanvasReceiptPublicationGate", String(state.canvasReceiptPublicationGate));
    setDataset("hearthCanvasReceiptPublicationGateReason", state.canvasReceiptPublicationGateReason);

    setDataset("hearthCanvasLocated", String(state.canvasLocated));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasMounted", String(Boolean(state.canvasLocated && state.context2dReady && state.canvasGeometryGate)));
    setDataset("hearthCanvasWidth", String(state.canvasWidth));
    setDataset("hearthCanvasHeight", String(state.canvasHeight));
    setDataset("hearthCanvasRectWidth", String(state.canvasRectWidth));
    setDataset("hearthCanvasRectHeight", String(state.canvasRectHeight));
    setDataset("hearthCanvasDomVisible", String(state.canvasDomVisible));
    setDataset("hearthCanvasContext2dReady", String(state.context2dReady));

    setDataset("hearthCanvasDrawAttempted", String(state.drawAttempted));
    setDataset("hearthCanvasDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthCanvasHoldingFieldDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasLastDrawSource", state.lastDrawSource);
    setDataset("hearthCanvasLastDrawError", state.lastDrawError);

    setDataset("hearthCanvasNativeDrawComplete", String(state.nativeDrawComplete));
    setDataset("hearthCanvasAdapterDrawComplete", String(state.adapterDrawComplete));
    setDataset("hearthCanvasAdapterSourceName", state.adapterSourceName);

    setDataset("hearthCanvasPixelSampleAttempted", String(state.pixelSampleAttempted));
    setDataset("hearthCanvasPixelSampleComplete", String(state.pixelSampleComplete));
    setDataset("hearthCanvasPixelSampleStatus", state.pixelSampleStatus);
    setDataset("hearthCanvasPixelVarianceStatus", state.canvasPixelVarianceStatus);
    setDataset("hearthCanvasPixelSampleColorSpread", String(state.pixelSampleColorSpread));
    setDataset("hearthCanvasPixelSampleUniqueColorCount", String(state.pixelSampleUniqueColorCount));

    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasVisibleSurfaceActive", "true");
    setDataset("hearthCanvasExpressionSurfaceActive", "true");
    setDataset("hearthCanvasExpressionSurfaceReady", String(state.canvasExpressionSurfaceReady));
    setDataset("hearthCanvasExpressionRichnessReady", String(state.canvasExpressionRichnessReady));
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));

    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setDataset("hearthCanvasBaseGlobeVisibleCarrierReady", String(state.baseGlobeVisibleCarrierReady));
    setDataset("hearthCanvasVisibleGlobeCarrierReady", String(state.visibleGlobeCarrierReady));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasCurrentVisibleProofValid", String(state.currentVisibleProofValid));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);

    setDataset("hearthCanvasStructuralCarrierReady", String(state.structuralCarrierReady));
    setDataset("hearthCanvasStructuralCarrierSafe", String(state.structuralCarrierSafe));
    setDataset("hearthCanvasParentCarrierSafe", String(state.canvasParentCarrierSafe));
    setDataset("hearthCanvasStructuralCarrierSafeForCanvasRelease", String(state.structuralCarrierSafeForCanvasRelease));
    setDataset("hearthCanvasPreReleaseCarrierSafeForWest", String(state.canvasPreReleaseCarrierSafeForWest));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));

    setDataset("hearthCanvasF13EvidenceStrict", "false");
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13HardFail", "false");
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasStandardsNewsAlignmentStatus", state.canvasStandardsNewsAlignmentStatus);
    setDataset("hearthCanvasStandardsNewsAlignmentScore", String(state.canvasStandardsNewsAlignmentScore));
    setDataset("hearthCanvasStandardsNewsAlignmentFirstFailedStage", state.canvasStandardsNewsAlignmentFirstFailedStage);
    setDataset("hearthCanvasStandardsFibonacciSynchronizationStatus", state.canvasStandardsFibonacciSynchronizationStatus);
    setDataset("hearthCanvasStandardsFibonacciSynchronizationScore", String(state.canvasStandardsFibonacciSynchronizationScore));
    setDataset("hearthCanvasStandardsFibonacciSynchronizationFirstFailedStage", state.canvasStandardsFibonacciSynchronizationFirstFailedStage);

    setDataset("hearthCanvasFirstFailedGate", state.firstFailedGate);
    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");
    setDataset("hearthCanvasOwnsHexTruth", "false");
    setDataset("hearthCanvasOwnsFingerTruth", "false");
    setDataset("hearthCanvasOwnsPointerTruth", "false");
    setDataset("hearthCanvasOwnsQueenTruth", "false");
    setDataset("hearthCanvasOwnsLabWestAdmissibilityTruth", "false");
    setDataset("hearthCanvasOwnsRouteConductorHandshakeTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);

    root.__HEARTH_CANVAS_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_FILE__ = FILE;
    root.__HEARTH_CANVAS_VISIBLE_SURFACE_PROOF_STANDARD__ = true;

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();
    updateDataset();
    return true;
  }

  function publishReceipts() {
    const light = getReceiptLight(false);
    const full = {
      ...light,
      packetType: "HEARTH_CANVAS_HUB_VISIBLE_SURFACE_PROOF_STANDARD_RECEIPT_PUBLICATION",
      canvasStandardsNewsAlignment: composeCanvasStandardNews(),
      canvasStandardsFibonacciSynchronization: composeCanvasStandardFibonacci(),
      ...FINAL_FALSE
    };

    for (const path of RECEIPT_ALIAS_PATHS) {
      const useFull =
        path.includes("COMPOSITE_FIRST_FAST_VIEW") ||
        path.includes("VisibleSurface") ||
        path.includes("VISIBLE_SURFACE") ||
        path.includes("ExpressionSurface") ||
        path.includes("EXPRESSION_SURFACE");

      setPath(path, useFull ? full : light);
    }

    state.receiptPublishCount += 1;
    setGate(GATES.RECEIPT, true, "CANVAS_RECEIPT_PUBLICATION_COMPLETE");
    updateStandardAudit();
    updateDataset();

    return true;
  }

  function schedulePublish() {
    if (!root.setTimeout) return publishReceipts();
    if (publishTimer) return true;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishReceipts();
    }, 50);

    return true;
  }

  function notifyUpstream(reason = "canvas-visible-surface-proof") {
    if (notifyGuard) return false;
    notifyGuard = true;

    try {
      const receipt = getReceiptLight(false);
      const targets = [];

      for (const path of UPSTREAM_ALIAS_PATHS) {
        const target = readPath(path);
        if (target && target !== api && isObject(target) && !targets.includes(target)) targets.push(target);
      }

      const methods = [
        "receiveCanvasStationSummary",
        "receiveCanvasLocalStationSummary",
        "receiveCanvasParentSummary",
        "receiveCanvasExpressionHubSummary",
        "receiveExpressionHubSummary",
        "receiveVisibleBaseGlobeReceipt",
        "receiveVisibleGlobeReceipt",
        "receiveVisiblePlanetReceipt",
        "receiveCanvasVisibleProof",
        "receiveCanvasExpressionPacket",
        "reconcileCanvas"
      ];

      for (const target of targets) {
        for (const method of methods) {
          if (!isFunction(target[method])) continue;

          invoke(target, method, [{
            ...clonePlain(receipt),
            packetType: "HEARTH_CANVAS_VISIBLE_SURFACE_PROOF_NOTICE",
            noticeReason: reason,
            sourceFile: FILE,
            targetFile: ROUTE_CONDUCTOR_FILE,
            packetLane: "CANVAS_VISIBLE_SURFACE_PROOF",
            ...FINAL_FALSE
          }]);
        }
      }

      state.upstreamNotifyCount += 1;
      return true;
    } finally {
      notifyGuard = false;
    }
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliases();
    publishReceipts();

    record(reason, {
      contract: CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      firstFailedGate: state.firstFailedGate,
      firstFailedCoordinate: state.firstFailedCoordinate
    });

    return api;
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();

    try {
      publishAliases();
      locateOrCreateCanvas();
      scanExternalAdapters();
      scanUpstreamAuthorities();
      updateDataset();
      publishReceipts();

      const packet =
        isObject(options.routeConductorReleasePacket)
          ? options.routeConductorReleasePacket
          : isObject(options.releasePacket)
            ? options.releasePacket
            : options;

      if (packet && isObject(packet) && packet.canvasReleaseAuthorized === true) {
        receiveRouteConductorReleasePacket(packet);
      }

      if (options.drawNow !== false) {
        drawVisibleExpression({ reason: options.reason || "boot-visible-surface-proof" });
        scheduleDraw("boot-visible-surface-proof-retry");
      }

      state.booted = true;
      updateStandardAudit();
      updateDataset();
      publishReceipts();
      notifyUpstream("boot");

      record("HEARTH_CANVAS_VISIBLE_SURFACE_PROOF_STANDARD_BOOTED", {
        contract: CONTRACT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        canvasElementGate: state.canvasElementGate,
        canvas2dContextGate: state.canvas2dContextGate,
        canvasGeometryGate: state.canvasGeometryGate,
        canvasDrawGate: state.canvasDrawGate,
        canvasPixelProofGate: state.canvasPixelProofGate,
        visiblePlanetProofReady: state.visiblePlanetProofReady,
        firstFailedCoordinate: state.firstFailedCoordinate
      });

      return getReceipt();
    } catch (error) {
      recordError("CANVAS_BOOT_FAILED", error);
      updateDataset();
      publishReceipts();
      return getReceipt();
    } finally {
      state.booting = false;
    }
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function mount(options = {}) { return boot(options); }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V12_2_CONTRACT,
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_CONTRACT,
    LINEAGE_V11_7_CONTRACT,
    LINEAGE_V11_6_CONTRACT,
    EXPRESSION_SURFACE_CONTRACT,
    EXPRESSION_SURFACE_RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    version: VERSION,

    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    ROUTE_CONDUCTOR_FILE,
    CONTROL_FILE,
    LABWEST_FILE,
    FINGER_FILES,
    GATES,
    CANVAS_ALIAS_PATHS,
    RECEIPT_ALIAS_PATHS,
    DRAWABLE_ADAPTER_PATHS,
    UPSTREAM_ALIAS_PATHS,

    boot,
    init,
    start,
    mount,

    locateOrCreateCanvas,
    drawToCanvas,
    drawVisibleExpression,
    render,
    draw,
    scheduleDraw,
    samplePixelProof,
    scanExternalAdapters,
    scanUpstreamAuthorities,

    receivePacket,
    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveCanvasReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,
    acceptReleasePacket,

    receiveLabWestPacket,
    receiveLabWestContext,
    receiveWestGateContext,
    receiveAdmissibilityContext,

    receiveQueenPacket,
    receiveQueenContext,
    receiveControlPacket,
    receiveControlsPacket,
    receiveControlViewPacket,
    receiveViewControlPacket,
    receivePlanetaryControlPacket,

    receiveFingerPacket,
    receiveCanvasFingerPacket,
    receiveExpressionFingerPacket,
    receiveFingerReceipt,
    receiveCanvasExpressionPacket,
    registerCanvasFinger,
    registerExpressionFinger,
    receiveBishopPacket,
    receiveCanvasBishopPacket,
    registerCanvasBishop,
    registerExpressionBishop,

    receiveDiagnosticPacket,
    receiveHierarchyContext,

    composeCanvasStandardNews,
    composeCanvasStandardFibonacci,

    getReceiptLight,
    getReceipt,
    getCanvasStationSummary: getReceiptLight,
    getCanvasStationReceiptLight: getReceiptLight,
    getCanvasStationReceipt: getReceipt,
    getExpressionHubSummary: getReceiptLight,
    getExpressionHubReceipt: getReceiptLight,
    getVisibleBaseGlobeReceipt: getReceiptLight,
    getBaseGlobeReceipt: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getVisibleGlobeReceipt: getReceiptLight,
    getCanvasVisibleProofReceipt: getReceiptLight,
    getStructuralCarrier: getReceiptLight,
    readStructuralCarrier: getReceiptLight,
    getCanvasCarrier: getReceiptLight,
    getCarrierReceipt: getReceiptLight,
    getCompositePacket: getReceiptLight,
    getCompositeModel: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getReceiptText,

    updateDataset,
    publishAliases,
    publishReceipts,
    publishGlobals,
    notifyUpstream,

    supportsCurrentCanvasV123Recognition: true,
    supportsVisibleSurfaceProofStandard: true,
    supportsPixelVisibleProof: true,
    supportsCanvasElementGate: true,
    supportsCanvas2dContextGate: true,
    supportsCanvasGeometryGate: true,
    supportsCanvasDrawGate: true,
    supportsCanvasPixelProofGate: true,
    supportsSeparateCanvasStandardsNewsAlignment: true,
    supportsSeparateCanvasStandardsFibonacciSynchronization: true,
    supportsCanvasLocationFallback: true,
    supportsNative2DVisibleSurfaceFallback: true,
    supportsExternalAdapterReadOnlyScan: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    namespaceProofIsVisibleProof: false,
    mountProofIsVisibleProof: false,
    bridgeProofIsVisibleProof: false,
    motionProofIsVisibleProof: false,
    controlProofIsVisibleProof: false,

    ownsCanvasReceiverOutputCarrier: true,
    ownsOwnCanvasAliases: true,
    ownsCanvasPlacementFallback: true,
    owns2DExpressionSurfaceFallback: true,
    ownsVisibleSurfacePixelProofPublication: true,

    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsHexTruth: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsQueenTruth: false,
    ownsControlRuntimeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE
  });

  Object.defineProperty(api, "state", {
    enumerable: true,
    get() {
      return state;
    }
  });

  try {
    publishGlobals("immediate-visible-surface-proof-standard-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime", drawNow: false });
    }

    if (root.setTimeout) {
      root.setTimeout(() => {
        publishGlobals("post-publication-proof-retry-1");
        locateOrCreateCanvas();
        scheduleDraw("post-publication-proof-retry-1");
        notifyUpstream("post-publication-proof-retry-1");
      }, 260);

      root.setTimeout(() => {
        publishGlobals("post-publication-proof-retry-2");
        locateOrCreateCanvas();
        scheduleDraw("post-publication-proof-retry-2");
        notifyUpstream("post-publication-proof-retry-2");
      }, 920);

      root.setTimeout(() => {
        publishGlobals("post-publication-proof-retry-3");
        locateOrCreateCanvas();
        scheduleDraw("post-publication-proof-retry-3");
        notifyUpstream("post-publication-proof-retry-3");
      }, 1800);
    }
  } catch (error) {
    recordError("CANVAS_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
