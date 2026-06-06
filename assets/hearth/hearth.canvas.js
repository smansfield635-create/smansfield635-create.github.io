// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas Hub / receiver-output bishop / internalized visible-expression bridge.
// Served CONTRACT intentionally remains v12_3 so Route Conductor, LabWest, diagnostics,
// and accepted lineage tables continue to recognize the Canvas parent without upstream churn.
// Internal renewal: HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4
//
// Purpose:
// - Preserve Canvas as receiver/output carrier only.
// - Internalize the former expression bridge so the expression surface is inspectable through Canvas.
// - Publish Canvas Hub, Canvas receiver, Canvas station, expression hub, visible planet, and expression bridge aliases.
// - Locate or create the 2D canvas expression surface under the existing Hearth stage/mount.
// - Accept Route Conductor, LabWest, Queen, diagnostic, and finger packets.
// - Read downstream drawable adapters as external authorities only.
// - Delegate drawing to a real downstream drawable adapter when present.
// - Otherwise draw a native 2D projected globe expression surface.
// - Publish pixel-visible proof upward from the Canvas file itself.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth, Hex truth,
//   finger truth, pointer truth, Queen truth, LabWest truth, Route Conductor truth,
//   F13 final claim, F21 latch, ready text, completion latch, final visual pass,
//   generated image, graphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_RECEIPT_v12_4";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_RECEIPT_v12_2";

  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_V11_7_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";
  const LINEAGE_V11_6_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";

  const EXPRESSION_BRIDGE_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v2";
  const EXPRESSION_BRIDGE_RECEIPT =
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const QUEEN_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const LABWEST_V4_9_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9";
  const LABWEST_V4_7_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";

  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const COMPOSITE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";

  const VERSION =
    "2026-06-06.hearth-canvas-hub-internalized-expression-surface-proof-receiver-v12-4-served-v12-3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};
  const externalAdapters = [];

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvas: false,
    f13ClaimedByExpressionBridge: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
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

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_PLANET",

    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisiblePlanet",

    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const EXPRESSION_BRIDGE_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_SECOND_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR",
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v2",
    "HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE",

    "HEARTH.canvasExpressionBridge",
    "HEARTH.canvasVisibleExpressionBridge",
    "HEARTH.canvasSecondExpressionBridge",
    "HEARTH.canvasExpressionBridgeSecondPair",
    "HEARTH.canvasExpressionSurfaceBridge",

    "DEXTER_LAB.hearthCanvasExpressionBridge",
    "DEXTER_LAB.hearthCanvasVisibleExpressionBridge",
    "DEXTER_LAB.hearthCanvasSecondExpressionBridge",
    "DEXTER_LAB.hearthCanvasExpressionBridgeSecondPair",
    "DEXTER_LAB.hearthCanvasExpressionSurfaceBridge"
  ]);

  const EXTERNAL_ADAPTER_ALIAS_PATHS = Object.freeze([
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
    "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER",
    "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",

    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const UPSTREAM_TARGET_ALIAS_PATHS = Object.freeze([
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

    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_FILE",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlFile",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: SURFACE_FINGER_FILE,
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: POINTER_FINGER_FILE,
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: COMPOSITE_FINGER_FILE
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

    role: "canvas-hub-receiver-output-bishop-internalized-expression-surface",
    servedContractPreservedForUpstreamRecognition: true,
    internalizedExpressionBridgeActive: true,
    expressionBridgeContract: EXPRESSION_BRIDGE_CONTRACT,
    expressionBridgeReceipt: EXPRESSION_BRIDGE_RECEIPT,

    loaded: true,
    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    publishedAt: "",

    ownAliasesPublished: false,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    upstreamNotifyCount: 0,

    externalAliasOverwriteBlocked: true,
    externalAliasesReadOnly: true,
    externalAdapterCount: 0,
    externalAdapterNames: "NONE",

    canvasLocated: false,
    canvasCreated: false,
    canvasSelector: "NONE",
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectNonzero: false,
    context2dReady: false,

    releasePacketReceived: false,
    releasePacketAccepted: false,
    routeConductorObserved: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    queenObserved: false,
    queenContract: "",
    queenReceipt: "",
    labWestObserved: false,
    labWestContract: "",
    labWestReceipt: "",

    packetCount: 0,
    authorityPacketCount: 0,
    routeConductorPacketCount: 0,
    queenPacketCount: 0,
    labWestPacketCount: 0,
    fingerPacketCount: 0,
    diagnosticPacketCount: 0,
    lastPacket: null,
    lastAuthorityPacket: null,
    lastRouteConductorPacket: null,
    lastQueenPacket: null,
    lastLabWestPacket: null,
    lastFingerPacket: null,
    lastDiagnosticPacket: null,
    lastViewState: null,

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
    adapterContract: "",
    adapterReceipt: "",
    adapterMethod: "NONE",
    adapterError: "",

    nativeExpressionDrawAttempted: false,
    nativeExpressionDrawComplete: false,

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    visibleExpressionBridgeActive: true,
    compositeCompatibilityBridgeActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,

    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    visibleExpressionBridgeReady: false,
    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "VISIBLE_EXPRESSION_NOT_DRAWN",
    renderedPlanetProofReady: false,
    visiblePlanetReceiptObserved: false,
    canvasPixelVarianceStatus: "NO_PIXEL_SAMPLE",

    structuralCarrierReady: false,
    structuralCarrierSafe: false,
    canvasParentCarrierSafe: false,
    structuralCarrierSafeForCanvasRelease: false,
    canvasPreReleaseCarrierSafeForWest: false,
    canvasParentReleaseAccepted: false,
    canvasParentReleaseLawful: false,
    releasePacketAccepted: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_EXPRESSION_NOT_DRAWN",
    f13StrictEvidenceRepairTarget: FILE,

    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    firstFingerGap: "WAITING_FINGER_PACKET_OR_VISIBLE_EXPRESSION_PROOF",
    firstFingerGapFile: POINTER_FINGER_FILE,
    nextFingerKey: "inspect",
    nextFingerFile: POINTER_FINGER_FILE,
    pointerFingerObserved: false,

    firstFailedCoordinate: "VISIBLE_EXPRESSION_NOT_DRAWN",
    recommendedNextFile: FILE,
    recommendedNextAction: "CALL_CANVAS_DRAW_OR_ROUTE_RELEASE_PACKET",
    postgameStatus: "CANVAS_HUB_LOADED_WAITING_EXPRESSION_SURFACE_PROOF",

    events: [],
    errors: [],

    ...FINAL_FALSE
  };

  let drawTimer = 0;
  let publishTimer = 0;
  let notifyGuard = false;
  let drawingGuard = false;
  let scanningGuard = false;

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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
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
      event: safeString(event, "CANVAS_HUB_EVENT"),
      detail: clonePlain(detail)
    };
    state.events.push(item);
    trim(state.events, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_HUB_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };
    state.errors.push(item);
    trim(state.errors, 120);
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
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
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

  function q(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };

    for (const selector of selectors) {
      const element = q(selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function rectNonzero(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) return false;

    try {
      const rect = element.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
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
      s.f13ClaimedByExpressionBridge === true ||
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

  function safeInvoke(target, method, args = []) {
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
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCarrierReceipt",
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

  function canvasContextFrom(value) {
    if (!value) return { canvas: null, ctx: null };

    if (value.canvas && isFunction(value.getImageData)) {
      return { canvas: value.canvas, ctx: value };
    }

    if (value.canvas && value.canvas.getContext && isFunction(value.canvas.getContext)) {
      const ctx = value.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      return { canvas: value.canvas, ctx };
    }

    if (value.getContext && isFunction(value.getContext)) {
      const ctx = value.getContext("2d", { alpha: true, willReadFrequently: true });
      return { canvas: value, ctx };
    }

    if (isObject(value.canvasOrContext)) return canvasContextFrom(value.canvasOrContext);
    if (isObject(value.targetCanvas)) return canvasContextFrom(value.targetCanvas);
    if (isObject(value.canvasTarget)) return canvasContextFrom(value.canvasTarget);
    if (isObject(value.context)) return canvasContextFrom(value.context);
    if (isObject(value.ctx)) return canvasContextFrom(value.ctx);

    return { canvas: null, ctx: null };
  }

  function choosePixelSize(mount) {
    let cssWidth = 720;

    if (mount && isFunction(mount.getBoundingClientRect)) {
      try {
        const rect = mount.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 280) && root.innerWidth) {
      cssWidth = Math.min(880, Math.max(320, root.innerWidth * 0.86));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(cssWidth * ratio)));
  }

  function sizeCanvas(canvas, mount) {
    if (!canvas) return;

    const px = choosePixelSize(mount);

    if (!canvas.width || canvas.width < 256) canvas.width = px;
    if (!canvas.height || canvas.height < 256) canvas.height = px;

    if (canvas.style) {
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.maxWidth = "min(88vw, 760px)";
      canvas.style.height = "auto";
      canvas.style.aspectRatio = "1 / 1";
      canvas.style.margin = "0 auto";
      canvas.style.borderRadius = "50%";
      canvas.style.boxSizing = "border-box";
      canvas.style.touchAction = "none";
      canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    }

    if (canvas.dataset) {
      canvas.dataset.hearthExpressionSurface = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.dataset.hearthCanvasHub = "true";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthCanvasExpressionBridge = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.dataset.hearthCanvasReceipt = RECEIPT;
      canvas.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
      canvas.dataset.hearthCanvasExpressionBridgeContract = EXPRESSION_BRIDGE_CONTRACT;
      canvas.dataset.hearthCanvasExpressionBridgeReceipt = EXPRESSION_BRIDGE_RECEIPT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
    }
  }

  function locateOrCreateCanvas() {
    if (!doc) return { canvas: null, ctx: null, mount: null };

    let canvas = null;
    let canvasSelector = "NONE";

    for (const selector of CANVAS_SELECTORS) {
      const found = q(selector);
      if (found && found.tagName && found.tagName.toLowerCase() === "canvas") {
        canvas = found;
        canvasSelector = selector;
        break;
      }
    }

    const mountResult = firstElement(MOUNT_SELECTORS);
    const mount = mountResult.element;

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;

    if (!canvas && mount) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvas.setAttribute("aria-label", "Hearth visible expression canvas");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-contract", CONTRACT);

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      canvasSelector = "CREATED_BY_CANVAS_HUB";
    }

    if (!canvas) return { canvas: null, ctx: null, mount };

    sizeCanvas(canvas, mount);

    let ctx = null;
    try {
      ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;
    } catch (_error) {
      ctx = null;
    }

    state.canvasLocated = true;
    state.canvasSelector = canvasSelector;
    state.canvasWidth = safeNumber(canvas.width, 0);
    state.canvasHeight = safeNumber(canvas.height, 0);
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.context2dReady = Boolean(ctx);

    return { canvas, ctx, mount };
  }

  function resolveCanvasTarget(canvasOrContext) {
    const direct = canvasContextFrom(canvasOrContext);

    if (direct.canvas && direct.ctx) {
      sizeCanvas(direct.canvas, direct.canvas.parentElement || null);
      state.canvasLocated = true;
      state.canvasSelector = "ARGUMENT";
      state.canvasWidth = safeNumber(direct.canvas.width, 0);
      state.canvasHeight = safeNumber(direct.canvas.height, 0);
      state.canvasRectNonzero = rectNonzero(direct.canvas) || Boolean(direct.canvas.width > 0 && direct.canvas.height > 0);
      state.context2dReady = true;
      return { canvas: direct.canvas, ctx: direct.ctx, mount: direct.canvas.parentElement || null };
    }

    return locateOrCreateCanvas();
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sample = Math.max(4, Math.min(28, Math.floor(Math.min(w, h) / 34)));
      const points = [
        [Math.floor(w * 0.5 - sample / 2), Math.floor(h * 0.5 - sample / 2)],
        [Math.floor(w * 0.36 - sample / 2), Math.floor(h * 0.42 - sample / 2)],
        [Math.floor(w * 0.62 - sample / 2), Math.floor(h * 0.58 - sample / 2)],
        [Math.floor(w * 0.49 - sample / 2), Math.floor(h * 0.73 - sample / 2)]
      ];

      let nonBlank = 0;
      let alpha = 0;

      for (const [x, y] of points) {
        const data = ctx.getImageData(
          Math.max(0, x),
          Math.max(0, y),
          sample,
          sample
        ).data;

        for (let index = 0; index < data.length; index += 4) {
          if (data[index + 3] > 0) alpha += 1;
          if (
            data[index + 3] > 0 &&
            (data[index] > 4 || data[index + 1] > 4 || data[index + 2] > 4)
          ) {
            nonBlank += 1;
          }
        }
      }

      const visible = nonBlank > 0 && alpha > 0;
      state.canvasPixelVarianceStatus = visible ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_BLANK";
      return visible;
    } catch (_error) {
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNREADABLE_ASSUME_DRAWN";
      return Boolean(state.drawAttempted);
    }
  }

  function drawIrregularMass(ctx, cx, cy, radius, seed, sx, sy, rotation) {
    const points = 22;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wave =
        0.74 +
        Math.sin(t * 2.0 + seed) * 0.13 +
        Math.sin(t * 3.0 + seed * 0.7) * 0.09 +
        Math.sin(t * 5.0 - seed * 0.4) * 0.055 +
        Math.sin(t * 8.0 + seed * 0.19) * 0.025;

      const a = t + rotation;
      const x = cx + Math.cos(a) * radius * wave * sx;
      const y = cy + Math.sin(a) * radius * wave * sy;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }

  function drawNative2DProjectedGlobe(canvas, ctx, packet = {}) {
    if (!canvas || !ctx) return false;

    state.nativeExpressionDrawAttempted = true;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.385;

      const view = isObject(packet.viewState) ? packet.viewState : {};
      const yaw = safeNumber(view.yaw, safeNumber(packet.yaw, 0));
      const pitch = Math.max(-1.1, Math.min(1.1, safeNumber(view.pitch, safeNumber(packet.pitch, 0))));
      const phase = safeNumber(view.phase, 0) + yaw * 0.22;

      ctx.clearRect(0, 0, w, h);

      const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      outer.addColorStop(0, "rgba(19,39,71,0.96)");
      outer.addColorStop(0.52, "rgba(4,12,30,0.98)");
      outer.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = outer;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - r * 0.35,
        cy - r * 0.38 + pitch * r * 0.08,
        r * 0.08,
        cx,
        cy,
        r * 1.12
      );
      ocean.addColorStop(0, "rgba(95,176,229,0.96)");
      ocean.addColorStop(0.35, "rgba(19,95,154,0.98)");
      ocean.addColorStop(0.72, "rgba(8,43,104,0.98)");
      ocean.addColorStop(1, "rgba(1,8,32,1)");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.globalAlpha = 0.44;
      ctx.strokeStyle = "rgba(220,240,255,0.22)";
      ctx.lineWidth = Math.max(1, r * 0.005);

      for (let i = -5; i <= 5; i += 1) {
        const y = cy + (i / 6) * r * 0.78 + Math.sin(phase + i) * r * 0.015 + pitch * r * 0.08;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.98, r * 0.095, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 9; i += 1) {
        const x = cx + Math.sin(phase + i * 0.72) * r * 0.72;
        ctx.beginPath();
        ctx.ellipse(x, cy + pitch * r * 0.03, r * 0.11, r * 0.96, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const landMasses = [
        [-0.39, -0.22, 0.33, 1.17, 0.72, 0.10],
        [0.23, -0.30, 0.25, 0.86, 1.22, 1.40],
        [0.35, 0.15, 0.30, 0.80, 1.05, 2.20],
        [-0.18, 0.19, 0.28, 1.12, 0.88, 3.10],
        [-0.56, 0.05, 0.17, 0.78, 1.36, 4.20],
        [0.02, -0.02, 0.18, 1.52, 0.56, 5.40],
        [0.00, 0.58, 0.22, 1.58, 0.36, 6.40]
      ];

      for (let index = 0; index < landMasses.length; index += 1) {
        const item = landMasses[index];
        const px = cx + item[0] * r + Math.sin(phase + index) * r * 0.03;
        const py = cy + item[1] * r + pitch * r * 0.12 + Math.cos(phase + index * 0.9) * r * 0.02;
        const rr = item[2] * r;

        const land = ctx.createLinearGradient(px - rr, py - rr, px + rr, py + rr);
        land.addColorStop(0, "rgba(155,130,76,0.98)");
        land.addColorStop(0.45, "rgba(96,130,78,0.98)");
        land.addColorStop(1, "rgba(48,76,54,0.98)");
        ctx.fillStyle = land;
        drawIrregularMass(ctx, px, py, rr, item[5] + phase, item[3], item[4], phase * 0.18 + index * 0.21);

        ctx.strokeStyle = "rgba(232,214,152,0.25)";
        ctx.lineWidth = Math.max(1, r * 0.004);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "rgba(255,255,255,0.62)";
      drawIrregularMass(ctx, cx - r * 0.42, cy - r * 0.47 + pitch * r * 0.06, r * 0.10, 8.2 + phase, 1.8, 0.5, 0.1);
      drawIrregularMass(ctx, cx + r * 0.22, cy - r * 0.58 + pitch * r * 0.05, r * 0.08, 9.1 + phase, 2.2, 0.44, -0.2);
      drawIrregularMass(ctx, cx + r * 0.10, cy + r * 0.49 + pitch * r * 0.03, r * 0.12, 10.4 + phase, 1.9, 0.42, 0.05);
      ctx.globalAlpha = 1;

      const shade = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.44, r * 0.1, cx, cy, r * 1.02);
      shade.addColorStop(0, "rgba(255,255,255,0.20)");
      shade.addColorStop(0.56, "rgba(255,255,255,0)");
      shade.addColorStop(0.88, "rgba(0,0,0,0.24)");
      shade.addColorStop(1, "rgba(0,0,0,0.62)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.strokeStyle = "rgba(207,233,255,0.54)";
      ctx.lineWidth = Math.max(1, r * 0.011);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      state.nativeExpressionDrawComplete = true;
      return true;
    } catch (error) {
      state.nativeExpressionDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("NATIVE_2D_PROJECTED_GLOBE_DRAW_FAILED", error);
      return false;
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

  function isExternalDrawableAuthority(path, authority) {
    if (!authority || !isObject(authority) || authority === api) return false;

    const receipt = readReceipt(authority) || {};
    const contract = contractOf(receipt) || contractOf(authority);

    if (contract === CONTRACT || contract === INTERNAL_RENEWAL_CONTRACT || contract === EXPRESSION_BRIDGE_CONTRACT) return false;
    if (safeString(path).includes("EXPRESSION_BRIDGE")) return false;
    if (!drawMethods(authority).length) return false;

    return true;
  }

  function rememberExternalAdapter(path, authority) {
    if (!isExternalDrawableAuthority(path, authority)) return false;
    if (externalAdapters.some((item) => item.authority === authority)) return false;

    const receipt = readReceipt(authority) || {};
    externalAdapters.push({
      path,
      authority,
      contract: contractOf(receipt) || contractOf(authority),
      receipt: receiptOf(receipt) || receiptOf(authority),
      methods: drawMethods(authority)
    });

    trim(externalAdapters, 40);
    return true;
  }

  function scanExternalAdapters() {
    if (scanningGuard) return externalAdapters.slice();
    scanningGuard = true;

    try {
      for (const path of EXTERNAL_ADAPTER_ALIAS_PATHS) {
        const authority = readPath(path);
        rememberExternalAdapter(path, authority);
      }

      state.externalAdapterCount = externalAdapters.length;
      state.externalAdapterNames = externalAdapters.map((item) => item.path).join(",") || "NONE";
      return externalAdapters.slice();
    } finally {
      scanningGuard = false;
    }
  }

  function buildDrawPacket(canvas, ctx, packet = {}) {
    return {
      packetType: "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      expressionBridgeContract: EXPRESSION_BRIDGE_CONTRACT,
      expressionBridgeReceipt: EXPRESSION_BRIDGE_RECEIPT,
      sourceFile: FILE,
      parentCanvasFile: FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      labWestFile: LABWEST_FILE,
      canvas,
      ctx,
      context: ctx,
      viewState: isObject(packet.viewState)
        ? clonePlain(packet.viewState)
        : isObject(state.lastViewState)
          ? clonePlain(state.lastViewState)
          : {},
      projectionMode: "2D_CANVAS_PROJECTED_GLOBE",
      receiverOnly: true,
      externalAdapterAliasesReadOnly: true,
      externalAdapterOverwriteBlocked: true,
      ...FINAL_FALSE
    };
  }

  function attemptAdapterDraw(canvas, ctx, packet = {}) {
    const adapters = scanExternalAdapters();

    state.adapterDrawAttempted = adapters.length > 0;

    for (const adapter of adapters) {
      const methods = adapter.methods || [];

      for (const method of methods) {
        let result;

        if (method === "drawToCanvas" || method === "renderToCanvas") {
          result = safeInvoke(adapter.authority, method, [
            canvas,
            {
              ...buildDrawPacket(canvas, ctx, packet),
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract
            }
          ]);
        } else {
          result = safeInvoke(adapter.authority, method, [
            buildDrawPacket(canvas, ctx, packet),
            {
              source: "Hearth Canvas Hub",
              contract: CONTRACT,
              receipt: RECEIPT,
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract,
              ...FINAL_FALSE
            }
          ]);

          if (!result.ok) {
            result = safeInvoke(adapter.authority, method, [
              ctx,
              {
                canvas,
                source: "Hearth Canvas Hub",
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

        const pixelReady = canvasHasVisiblePixels(canvas, ctx);
        const explicitFalse = result.value === false;

        if (pixelReady && !explicitFalse) {
          state.adapterDrawComplete = true;
          state.adapterSourceName = adapter.path;
          state.adapterContract = adapter.contract || "";
          state.adapterReceipt = adapter.receipt || "";
          state.adapterMethod = method;
          state.adapterError = "";
          return true;
        }
      }
    }

    state.adapterDrawComplete = false;
    return false;
  }

  function updateVisibleProof(source, reason, pixelReady) {
    state.canvasExpressionSurfaceReady = Boolean(pixelReady);
    state.canvasExpressionRichnessReady = Boolean(pixelReady);
    state.domExpressionSurfaceProofReady = Boolean(pixelReady);
    state.visibleExpressionBridgeReady = Boolean(pixelReady);
    state.visibleBaseGlobeCarrierActive = Boolean(pixelReady);
    state.canvasVisibleBaseGlobeCarrierActive = Boolean(pixelReady);
    state.baseGlobeVisibleCarrierReady = Boolean(pixelReady);
    state.visibleGlobeCarrierReady = Boolean(pixelReady);
    state.visiblePlanetProofReady = Boolean(pixelReady);
    state.renderedPlanetProofReady = Boolean(pixelReady);
    state.visiblePlanetReceiptObserved = Boolean(pixelReady);
    state.visiblePlanetProofSource = pixelReady ? source : "NONE";
    state.visiblePlanetProofReason = pixelReady ? reason : "VISIBLE_EXPRESSION_NOT_PROVEN";

    state.structuralCarrierReady = Boolean(pixelReady);
    state.structuralCarrierSafe = Boolean(pixelReady);
    state.canvasParentCarrierSafe = Boolean(pixelReady);
    state.structuralCarrierSafeForCanvasRelease = Boolean(pixelReady);
    state.canvasPreReleaseCarrierSafeForWest = Boolean(pixelReady);
    state.canvasParentReleaseAccepted = Boolean(pixelReady || state.releasePacketReceived);
    state.canvasParentReleaseLawful = Boolean(pixelReady || state.releasePacketReceived);
    state.releasePacketAccepted = Boolean(pixelReady || state.releasePacketReceived);

    state.f13CanvasReadinessObserved = Boolean(state.drawAttempted || state.canvasLocated);
    state.f13VisibleEvidenceAvailable = Boolean(pixelReady);
    state.f13InspectEvidenceAvailable = Boolean(state.pointerFingerObserved || pixelReady);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(pixelReady);
    state.f13CanvasEvidenceComplete = Boolean(pixelReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = pixelReady
      ? "VISIBLE_EXPRESSION_SURFACE_PIXEL_PROOF_READY_STRICT_F13_PENDING"
      : "VISIBLE_EXPRESSION_SURFACE_PIXEL_PROOF_NOT_READY";
    state.f13StrictEvidenceRepairTarget = pixelReady ? COMPOSITE_FINGER_FILE : FILE;

    state.firstFailedCoordinate = pixelReady
      ? "NONE_CANVAS_EXPRESSION_SURFACE_PIXEL_PROOF_READY"
      : state.f13StrictEvidenceGap;
    state.recommendedNextFile = pixelReady ? FILE : FILE;
    state.recommendedNextAction = pixelReady
      ? "RETURN_CANVAS_HUB_VISIBLE_EXPRESSION_RECEIPT_UPSTREAM"
      : "CALL_CANVAS_DRAW_OR_LOAD_DOWNSTREAM_EXPRESSION_ADAPTER";
    state.postgameStatus = pixelReady
      ? "CANVAS_EXPRESSION_SURFACE_PIXEL_PROOF_READY_NO_FINAL_CLAIM"
      : "CANVAS_EXPRESSION_SURFACE_WAITING_PIXEL_PROOF";
  }

  function drawToCanvas(canvasOrContext, packet = {}) {
    if (drawingGuard) {
      return getReceiptLight(false);
    }

    drawingGuard = true;

    try {
      state.drawAttempted = true;
      state.drawCount += 1;
      state.lastDrawAt = nowIso();
      state.lastDrawReason = safeString(packet.reason || packet.drawReason || "drawToCanvas", "drawToCanvas");
      state.lastPacket = isObject(packet) ? clonePlain(packet) : state.lastPacket;

      if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

      const target = resolveCanvasTarget(canvasOrContext || packet);

      if (!target.canvas || !target.ctx) {
        state.drawComplete = false;
        state.canvasDrawComplete = false;
        state.baseGlobeDrawComplete = false;
        state.lastDrawError = "CANVAS_OR_2D_CONTEXT_NOT_AVAILABLE";
        updateVisibleProof("NONE", state.lastDrawError, false);
        updateDataset();
        schedulePublish();
        return getReceiptLight(false);
      }

      const adapterOk = attemptAdapterDraw(target.canvas, target.ctx, packet);

      let source = "DOWNSTREAM_EXPRESSION_ADAPTER";
      let reason = "DOWNSTREAM_EXPRESSION_ADAPTER_DRAW_COMPLETE";

      if (!adapterOk) {
        const nativeOk = drawNative2DProjectedGlobe(target.canvas, target.ctx, packet);
        source = "CANVAS_HUB_NATIVE_2D_PROJECTED_GLOBE";
        reason = nativeOk
          ? "NATIVE_2D_PROJECTED_GLOBE_DRAW_COMPLETE"
          : "NATIVE_2D_PROJECTED_GLOBE_DRAW_FAILED";
      }

      const pixelReady = canvasHasVisiblePixels(target.canvas, target.ctx);

      state.drawComplete = Boolean(pixelReady);
      state.canvasDrawComplete = Boolean(pixelReady);
      state.baseGlobeDrawComplete = Boolean(pixelReady);
      state.lastDrawSource = pixelReady ? source : "NONE";
      state.lastDrawError = pixelReady ? "" : state.lastDrawError || "VISIBLE_PIXEL_EVIDENCE_NOT_AVAILABLE";

      updateVisibleProof(source, reason, pixelReady);
      updateDataset();
      publishReceipts();
      notifyUpstream("drawToCanvas");

      return getReceiptLight(false);
    } catch (error) {
      state.drawComplete = false;
      state.canvasDrawComplete = false;
      state.baseGlobeDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("DRAW_TO_CANVAS_FAILED", error);
      updateVisibleProof("NONE", state.lastDrawError, false);
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
        (targetOrPacket.canvas && isFunction(targetOrPacket.getImageData))
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

    const packetContract = contractOf(packet);
    const packetReceipt = receiptOf(packet);
    const sourceFile = safeString(packet.sourceFile || packet.file || "");

    if (lane === "AUTHORITY") {
      state.authorityPacketCount += 1;
      state.lastAuthorityPacket = clonePlain(packet);
    }

    if (lane === "ROUTE_CONDUCTOR") {
      state.routeConductorPacketCount += 1;
      state.lastRouteConductorPacket = clonePlain(packet);
      state.routeConductorObserved = true;
      state.routeConductorContract = packetContract || state.routeConductorContract || ROUTE_CONDUCTOR_CONTRACT;
      state.routeConductorReceipt = packetReceipt || state.routeConductorReceipt;
      state.releasePacketReceived = true;
    }

    if (lane === "QUEEN") {
      state.queenPacketCount += 1;
      state.lastQueenPacket = clonePlain(packet);
      state.queenObserved = true;
      state.queenContract = packetContract || state.queenContract || QUEEN_CONTROL_CONTRACT;
      state.queenReceipt = packetReceipt || state.queenReceipt;
    }

    if (lane === "LABWEST") {
      state.labWestPacketCount += 1;
      state.lastLabWestPacket = clonePlain(packet);
      state.labWestObserved = true;
      state.labWestContract = packetContract || state.labWestContract || LABWEST_V4_9_CONTRACT;
      state.labWestReceipt = packetReceipt || state.labWestReceipt;
      state.releasePacketReceived = true;
    }

    if (lane === "FINGER") {
      state.fingerPacketCount += 1;
      state.lastFingerPacket = clonePlain(packet);
      state.anyFingerTrackActive = true;
      state.fingerAuthorityObservedCount = Math.max(1, state.fingerAuthorityObservedCount);
      state.fingerApiReadyCount = Math.max(1, state.fingerApiReadyCount);
      state.fingerExpressionPacketCount += packet.packetType && safeString(packet.packetType).includes("EXPRESSION") ? 1 : 0;
      state.fingerReceiptPacketCount += packet.receipt || packet.RECEIPT ? 1 : 0;
      state.fingerTrackReadyCount = Math.max(1, state.fingerTrackReadyCount);
      state.pointerFingerObserved = Boolean(
        state.pointerFingerObserved ||
        sourceFile === POINTER_FINGER_FILE ||
        safeString(packet.fingerKey || packet.key || "").toLowerCase() === "inspect"
      );
    }

    if (lane === "DIAGNOSTIC") {
      state.diagnosticPacketCount += 1;
      state.lastDiagnosticPacket = clonePlain(packet);
    }

    if (packetContract === ROUTE_CONDUCTOR_CONTRACT || sourceFile === ROUTE_CONDUCTOR_FILE) {
      state.routeConductorObserved = true;
      state.routeConductorContract = packetContract || ROUTE_CONDUCTOR_CONTRACT;
      state.routeConductorReceipt = packetReceipt || state.routeConductorReceipt;
    }

    if (packetContract === QUEEN_CONTROL_CONTRACT || sourceFile === CONTROL_FILE) {
      state.queenObserved = true;
      state.queenContract = packetContract || QUEEN_CONTROL_CONTRACT;
      state.queenReceipt = packetReceipt || state.queenReceipt;
    }

    if (packetContract === LABWEST_V4_9_CONTRACT || packetContract === LABWEST_V4_7_CONTRACT || sourceFile === LABWEST_FILE) {
      state.labWestObserved = true;
      state.labWestContract = packetContract || state.labWestContract || LABWEST_V4_9_CONTRACT;
      state.labWestReceipt = packetReceipt || state.labWestReceipt;
    }

    record("CANVAS_HUB_PACKET_RECEIVED", {
      lane,
      packetType: packet.packetType || packet.type || "",
      contract: packetContract,
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
      lane === "AUTHORITY" ||
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

  function receiveCanvasAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receivePublicAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveCanvasAuthorityPacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveCanvasHubPacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveCanvasParentPacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }

  function receiveRouteConductorReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function consumeRouteConductorReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveCanvasReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function consumeReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function acceptReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }

  function receiveQueenPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveQueenContext(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlViewPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveViewControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlsPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receivePlanetaryControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }

  function receiveLabWestPacket(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveLabWestContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveWestGateContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveAdmissibilityContext(packet = {}) { return receivePacket(packet, "LABWEST"); }

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
  function receiveHierarchyContext(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }

  function scanUpstreamAuthorities() {
    if (scanningGuard) return getReceiptLight(false);
    scanningGuard = true;

    try {
      for (const path of UPSTREAM_TARGET_ALIAS_PATHS) {
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

      scanExternalAdapters();
      return getReceiptLight(false);
    } finally {
      scanningGuard = false;
    }
  }

  function composeReceiptLight() {
    return {
      packetType: "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      lineageV116Contract: LINEAGE_V11_6_CONTRACT,
      expressionBridgeContract: EXPRESSION_BRIDGE_CONTRACT,
      expressionBridgeReceipt: EXPRESSION_BRIDGE_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      servedContractPreservedForUpstreamRecognition: true,
      internalizedExpressionBridgeActive: true,
      receiverOnly: true,
      projectionMode: "2D_CANVAS_PROJECTED_GLOBE",

      loaded: true,
      booted: state.booted,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      visibleExpressionBridgeActive: true,
      compositeCompatibilityBridgeActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      compositeFirstVisiblePathActive: true,
      hexRenderReceiverExpected: true,

      ownAliasesPublished: state.ownAliasesPublished,
      aliasPublishCount: state.aliasPublishCount,
      externalAliasOverwriteBlocked: true,
      externalAliasesReadOnly: true,
      externalAdapterCount: state.externalAdapterCount,
      externalAdapterNames: state.externalAdapterNames,

      canvasLocated: state.canvasLocated,
      canvasCreated: state.canvasCreated,
      canvasSelector: state.canvasSelector,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMounted: Boolean(state.canvasLocated && state.context2dReady),
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.context2dReady,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      canvasLocalStationContract: CONTRACT,
      canvasLocalStationReceipt: RECEIPT,
      canvasContract: CONTRACT,
      hearthCanvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      hearthCanvasReceipt: RECEIPT,
      currentCanvasParentIsCurrentCanvas: true,
      currentCanvasParentIsLocalStation: true,
      currentCanvasParentIsExpressionHub: true,
      currentCanvasParentIsFingerManager: true,
      currentCanvasParentIsVisibleBaseGlobeCarrier: state.visiblePlanetProofReady,
      canvasContractAccepted: true,
      canvasSummaryAcceptedByContract: true,
      canvasSummaryAcceptedByShape: true,
      canvasSummaryShapeTrusted: true,

      canvasV123Recognized: true,
      canvasV122Recognized: false,
      canvasV121LineageAccepted: false,
      canvasV12LineageAccepted: false,
      canvasV11LineageAccepted: false,
      canvasBaselineOnly: false,
      canvasLocalStationApiReady: true,
      canvasParentBootMethodAvailable: true,
      canvasLocalStationReceiveSurfaceReady: true,
      receiveSurfaceReady: true,

      releasePacketReceived: state.releasePacketReceived,
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
      queenObserved: state.queenObserved,
      queenContract: state.queenContract,
      queenReceipt: state.queenReceipt,
      labWestObserved: state.labWestObserved,
      labWestContract: state.labWestContract,
      labWestReceipt: state.labWestReceipt,

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
      adapterContract: state.adapterContract,
      adapterReceipt: state.adapterReceipt,
      adapterMethod: state.adapterMethod,
      adapterError: state.adapterError,

      nativeExpressionDrawAttempted: state.nativeExpressionDrawAttempted,
      nativeExpressionDrawComplete: state.nativeExpressionDrawComplete,

      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      visibleExpressionBridgeReady: state.visibleExpressionBridgeReady,
      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      currentVisibleProofValid: state.visiblePlanetProofReady,
      domVisiblePlanetProofReady: state.domExpressionSurfaceProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofReady,
      visiblePlanetReceiptObserved: state.visiblePlanetReceiptObserved,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,

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

      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,
      anyFingerTrackActive: state.anyFingerTrackActive,
      allDeclaredFingerTracksReady: state.allDeclaredFingerTracksReady,
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

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      packetCount: state.packetCount,
      authorityPacketCount: state.authorityPacketCount,
      routeConductorPacketCount: state.routeConductorPacketCount,
      queenPacketCount: state.queenPacketCount,
      labWestPacketCount: state.labWestPacketCount,
      fingerPacketCount: state.fingerPacketCount,
      diagnosticPacketCount: state.diagnosticPacketCount,
      receiptPublishCount: state.receiptPublishCount,
      upstreamNotifyCount: state.upstreamNotifyCount,
      updatedAt: state.updatedAt || nowIso(),

      ownsCanvasReceiverOutputCarrier: true,
      ownsOwnCanvasAliases: true,
      ownsInternalizedExpressionBridgeAliases: true,
      ownsCanvasPlacementFallback: true,
      owns2DExpressionSurface: true,
      ownsPixelProofPublication: true,

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
      ownsCanvasFinalVisualPass: false,

      ...FINAL_FALSE
    };
  }

  function getReceiptLight(doScan = false) {
    if (doScan) scanUpstreamAuthorities();
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      packetType: "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_RECEIPT",
      currentReceipt: true,
      canvasAliasPaths: CANVAS_ALIAS_PATHS.slice(),
      expressionBridgeAliasPaths: EXPRESSION_BRIDGE_ALIAS_PATHS.slice(),
      externalAdapterAliasPathsReadOnly: EXTERNAL_ADAPTER_ALIAS_PATHS.slice(),
      externalAdapters: externalAdapters.map((item) => ({
        path: item.path,
        contract: item.contract,
        receipt: item.receipt,
        methods: item.methods
      })),
      fingerFiles: clonePlain(FINGER_FILES),
      lastPacket: clonePlain(state.lastPacket),
      lastAuthorityPacket: clonePlain(state.lastAuthorityPacket),
      lastRouteConductorPacket: clonePlain(state.lastRouteConductorPacket),
      lastQueenPacket: clonePlain(state.lastQueenPacket),
      lastLabWestPacket: clonePlain(state.lastLabWestPacket),
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
      "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `internalRenewalContract=${r.internalRenewalContract}`,
      `internalRenewalReceipt=${r.internalRenewalReceipt}`,
      `servedContractPreservedForUpstreamRecognition=${r.servedContractPreservedForUpstreamRecognition}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `expressionBridgeContract=${r.expressionBridgeContract}`,
      `expressionBridgeReceipt=${r.expressionBridgeReceipt}`,
      `file=${FILE}`,
      `route=${ROUTE}`,
      `version=${VERSION}`,
      "",
      "CANVAS_PARENT",
      `currentCanvasParentObserved=${r.currentCanvasParentObserved}`,
      `currentCanvasParentContract=${r.currentCanvasParentContract}`,
      `currentCanvasParentReceipt=${r.currentCanvasParentReceipt}`,
      `canvasV123Recognized=${r.canvasV123Recognized}`,
      `canvasContractAccepted=${r.canvasContractAccepted}`,
      `canvasLocalStationApiReady=${r.canvasLocalStationApiReady}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      "",
      "EXPRESSION_SURFACE",
      `internalizedExpressionBridgeActive=${r.internalizedExpressionBridgeActive}`,
      `canvasMounted=${r.canvasMounted}`,
      `canvasContext2dReady=${r.canvasContext2dReady}`,
      `drawAttempted=${r.drawAttempted}`,
      `drawComplete=${r.drawComplete}`,
      `lastDrawSource=${r.lastDrawSource}`,
      `adapterDrawComplete=${r.adapterDrawComplete}`,
      `nativeExpressionDrawComplete=${r.nativeExpressionDrawComplete}`,
      `canvasExpressionSurfaceReady=${r.canvasExpressionSurfaceReady}`,
      `canvasExpressionRichnessReady=${r.canvasExpressionRichnessReady}`,
      `domExpressionSurfaceProofReady=${r.domExpressionSurfaceProofReady}`,
      `visiblePlanetProofReady=${r.visiblePlanetProofReady}`,
      `visiblePlanetProofSource=${r.visiblePlanetProofSource}`,
      `canvasPixelVarianceStatus=${r.canvasPixelVarianceStatus}`,
      "",
      "CARRIER",
      `structuralCarrierReady=${r.structuralCarrierReady}`,
      `structuralCarrierSafe=${r.structuralCarrierSafe}`,
      `canvasParentCarrierSafe=${r.canvasParentCarrierSafe}`,
      `structuralCarrierSafeForCanvasRelease=${r.structuralCarrierSafeForCanvasRelease}`,
      `canvasPreReleaseCarrierSafeForWest=${r.canvasPreReleaseCarrierSafeForWest}`,
      "",
      "F13_NO_FINAL_CLAIM",
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13Claimed=false`,
      `f21EligibleForNorth=false`,
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
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasExpressionBridgeLoaded", "true");
    setDataset("hearthCanvasExpressionBridgeContract", EXPRESSION_BRIDGE_CONTRACT);
    setDataset("hearthCanvasExpressionBridgeReceipt", EXPRESSION_BRIDGE_RECEIPT);
    setDataset("hearthCanvasExpressionBridgeFile", FILE);
    setDataset("hearthCanvasExpressionBridgeInternalized", "true");

    setDataset("hearthCanvasAliasPublishCount", String(state.aliasPublishCount));
    setDataset("hearthCanvasOwnAliasesPublished", String(state.ownAliasesPublished));
    setDataset("hearthCanvasExternalAliasOverwriteBlocked", "true");
    setDataset("hearthCanvasExternalAliasesReadOnly", "true");
    setDataset("hearthCanvasExternalAdapterCount", String(state.externalAdapterCount));
    setDataset("hearthCanvasExternalAdapterNames", state.externalAdapterNames);

    setDataset("hearthCanvasLocated", String(state.canvasLocated));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasMounted", String(Boolean(state.canvasLocated && state.context2dReady)));
    setDataset("hearthCanvasDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthCanvasHoldingFieldDrawComplete", String(state.drawComplete));

    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasVisibleExpressionBridgeActive", "true");
    setDataset("hearthCanvasCompositeCompatibilityBridgeActive", "true");
    setDataset("hearthCanvasExpressionSurfaceReady", String(state.canvasExpressionSurfaceReady));
    setDataset("hearthCanvasExpressionRichnessReady", String(state.canvasExpressionRichnessReady));
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));

    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setDataset("hearthCanvasBaseGlobeVisibleCarrierReady", String(state.baseGlobeVisibleCarrierReady));
    setDataset("hearthCanvasVisibleGlobeCarrierReady", String(state.visibleGlobeCarrierReady));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasPixelVarianceStatus", state.canvasPixelVarianceStatus);

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

    setDataset("hearthCanvasPointerFingerObserved", String(state.pointerFingerObserved));
    setDataset("hearthCanvasFingerAuthorityObservedCount", String(state.fingerAuthorityObservedCount));
    setDataset("hearthCanvasFingerApiReadyCount", String(state.fingerApiReadyCount));
    setDataset("hearthCanvasFingerExpressionPacketCount", String(state.fingerExpressionPacketCount));
    setDataset("hearthCanvasFingerReceiptPacketCount", String(state.fingerReceiptPacketCount));
    setDataset("hearthCanvasFingerTrackReadyCount", String(state.fingerTrackReadyCount));
    setDataset("hearthCanvasFingerHardFailCount", String(state.fingerHardFailCount));

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

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);
    for (const path of EXPRESSION_BRIDGE_ALIAS_PATHS) setPath(path, api);

    state.ownAliasesPublished = true;
    state.aliasPublishCount += 1;
    state.publishedAt = nowIso();
    state.updatedAt = state.publishedAt;

    return true;
  }

  function publishReceipts() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const light = getReceiptLight(false);
    const full = getReceipt();

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_RECEIPT = light;
    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = light;
    root.HEARTH_CANVAS_STATION_RECEIPT = light;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = light;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_GLOBE_RECEIPT = light;

    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_SECOND_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v2 = full;
    root.HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE_RECEIPT = light;

    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasHubReceipt = light;
    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = light;
    hearth.canvasStationReceipt = light;
    hearth.canvasExpressionHubReceipt = light;
    hearth.canvasFingerManagerReceipt = light;
    hearth.canvasVisibleBaseGlobeCarrierReceipt = light;
    hearth.canvasVisiblePlanetReceipt = light;
    hearth.canvasVisibleGlobeReceipt = light;
    hearth.canvasExpressionBridgeReceipt = light;
    hearth.canvasVisibleExpressionBridgeReceipt = light;
    hearth.canvasSecondExpressionBridgeReceipt = light;
    hearth.canvasExpressionBridgeSecondPairReceipt = full;
    hearth.canvasExpressionSurfaceBridgeReceipt = light;

    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    lab.hearthCanvasHubReceipt = light;
    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = light;
    lab.hearthCanvasStationReceipt = light;
    lab.hearthCanvasExpressionHubReceipt = light;
    lab.hearthCanvasFingerManagerReceipt = light;
    lab.hearthCanvasVisiblePlanetReceipt = light;
    lab.hearthCanvasExpressionBridgeReceipt = light;
    lab.hearthCanvasVisibleExpressionBridgeReceipt = light;
    lab.hearthCanvasSecondExpressionBridgeReceipt = light;
    lab.hearthCanvasExpressionBridgeSecondPairReceipt = full;
    lab.hearthCanvasExpressionSurfaceBridgeReceipt = light;

    state.receiptPublishCount += 1;
    state.updatedAt = nowIso();
    updateDataset();

    return true;
  }

  function schedulePublish() {
    if (!root.setTimeout) return publishReceipts();
    if (publishTimer) return true;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishReceipts();
    }, 60);

    return true;
  }

  function notifyUpstream(reason = "notify-upstream") {
    if (notifyGuard) return false;
    notifyGuard = true;

    try {
      const receipt = getReceiptLight(false);
      const targets = [];

      for (const path of UPSTREAM_TARGET_ALIAS_PATHS) {
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

          safeInvoke(target, method, [{
            ...clonePlain(receipt),
            packetType: "HEARTH_CANVAS_HUB_UPSTREAM_VISIBLE_EXPRESSION_NOTICE",
            noticeReason: reason,
            sourceFile: FILE,
            targetFile: ROUTE_CONDUCTOR_FILE,
            packetLane: "CANVAS_EXPRESSION",
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
    publishAliasPaths();
    publishReceipts();
    record(reason, {
      contract: CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,
      firstFailedCoordinate: state.firstFailedCoordinate
    });
    return api;
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();

    try {
      publishAliasPaths();
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
        drawVisibleExpression({ reason: options.reason || "boot" });
        scheduleDraw("boot-retry");
      }

      state.booted = true;
      state.postgameStatus = state.visiblePlanetProofReady
        ? "CANVAS_EXPRESSION_SURFACE_PIXEL_PROOF_READY_NO_FINAL_CLAIM"
        : "CANVAS_HUB_BOOTED_WAITING_EXPRESSION_SURFACE_PROOF";
      state.updatedAt = nowIso();

      record("CANVAS_HUB_BOOTED", {
        contract: CONTRACT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        expressionBridgeContract: EXPRESSION_BRIDGE_CONTRACT,
        ownAliasesPublished: state.ownAliasesPublished,
        externalAdapterCount: state.externalAdapterCount,
        visiblePlanetProofReady: state.visiblePlanetProofReady
      });

      updateDataset();
      publishReceipts();
      notifyUpstream("boot");

      return getReceipt();
    } catch (error) {
      recordError("CANVAS_HUB_BOOT_FAILED", error);
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
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_CONTRACT,
    LINEAGE_V11_7_CONTRACT,
    LINEAGE_V11_6_CONTRACT,
    EXPRESSION_BRIDGE_CONTRACT,
    EXPRESSION_BRIDGE_RECEIPT,
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
    POINTER_FINGER_FILE,
    SURFACE_FINGER_FILE,
    COMPOSITE_FINGER_FILE,
    FINGER_FILES,

    CANVAS_ALIAS_PATHS,
    EXPRESSION_BRIDGE_ALIAS_PATHS,
    EXTERNAL_ADAPTER_ALIAS_PATHS,

    boot,
    init,
    start,
    mount,

    drawToCanvas,
    drawVisibleExpression,
    render,
    draw,
    scheduleDraw,

    receivePacket,
    receiveCanvasAuthorityBridgePacket,
    receiveAuthorityBridgePacket,
    receivePublicAuthorityBridgePacket,
    receiveBridgePacket,
    receiveCanvasAuthorityPacket,
    receiveCanvasHubPacket,
    receiveCanvasParentPacket,

    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveCanvasReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,
    acceptReleasePacket,

    receiveQueenPacket,
    receiveQueenContext,
    receiveControlPacket,
    receiveControlViewPacket,
    receiveViewControlPacket,
    receiveControlsPacket,
    receivePlanetaryControlPacket,

    receiveLabWestPacket,
    receiveLabWestContext,
    receiveWestGateContext,
    receiveAdmissibilityContext,

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

    scanExternalAdapters,
    scanUpstreamAuthorities,

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
    getExpressionBridgeReceipt: getReceipt,
    getVisibleExpressionBridgeReceipt: getReceipt,
    getCompositePacket: getReceiptLight,
    getCompositeModel: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getReceiptText,

    updateDataset,
    publishAliasPaths,
    publishReceipts,
    publishGlobals,
    notifyUpstream,

    supportsCurrentCanvasV123Recognition: true,
    supportsInternalizedExpressionBridge: true,
    supportsCanvasExpressionBridge: true,
    supportsVisibleExpressionBridge: true,
    supportsCompositeCompatibilityBridge: true,
    supportsDrawToCanvas: true,
    supportsCanvasContextAcceptance: true,
    supportsCanvasLocationFallback: true,
    supportsPixelVisibleProof: true,
    supportsUpstreamReceiptPublication: true,
    supportsOwnAliasPublicationOnly: true,
    supportsExternalAdapterReadOnlyScan: true,
    supportsNoExternalAliasOverwrite: true,
    supports2DCanvasProjectedGlobe: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasReceiverOutputCarrier: true,
    ownsOwnCanvasAliases: true,
    ownsInternalizedExpressionBridgeAliases: true,
    ownsCanvasPlacementFallback: true,
    owns2DExpressionSurface: true,
    ownsPixelProofPublication: true,

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

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    publishGlobals("immediate-canvas-hub-v12-3-internalized-expression-publication");

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
        publishGlobals("post-publication-retry-1");
        scanExternalAdapters();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-1");
        notifyUpstream("post-publication-retry-1");
      }, 260);

      root.setTimeout(() => {
        publishGlobals("post-publication-retry-2");
        scanExternalAdapters();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-2");
        notifyUpstream("post-publication-retry-2");
      }, 920);

      root.setTimeout(() => {
        publishGlobals("post-publication-retry-3");
        scanExternalAdapters();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-3");
        notifyUpstream("post-publication-retry-3");
      }, 1800);
    }
  } catch (error) {
    recordError("CANVAS_HUB_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
