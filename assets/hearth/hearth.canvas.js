// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_BISHOP_UNIVERSAL_ALIAS_ROOM_POINTER_SURFACE_ASSUMPTION_TNT_v12_3_1
// Full-file replacement.
// Canvas Bishop / receiver-output carrier / universal alias room.
// Served CONTRACT intentionally remains v12_3 for current West + Showroom compatibility.
// Internal room renewal:
// - Treats Showroom / Route Conductor as expected-correct next cleanup target.
// - Assumes Surface is the Pointer Finger / Pointer Bishop.
// - Treats Inspect as Inspect Finger / Inspect Bishop only.
// - Does not normalize stale Showroom pointer language.
// - If Showroom appoints Inspect as pointer, Canvas holds release and points next repair to Showroom.
// - Publishes unconditional Canvas, station, expression hub, finger manager, receipt, carrier, and release aliases.
// - Preserves Canvas as receiver/output carrier only.
// - Does not own terrain truth, hydrology truth, material truth, elevation truth, finger truth, Queen behavior,
//   West admissibility truth, Showroom truth, F13 claim, F21 claim, ready text, completion latch,
//   final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const ROOM_VERSION =
    "HEARTH_CANVAS_BISHOP_UNIVERSAL_ALIAS_ROOM_POINTER_SURFACE_ASSUMPTION_TNT_v12_3_1";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

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

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const SHOWROOM_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const QUEEN_FILE = "/assets/hearth/hearth.controls.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";

  const POINTER_FINGER_KEY = "surface";
  const POINTER_FINGER_FILE = SURFACE_FILE;
  const POINTER_BISHOP_KEY = "surface";
  const POINTER_BISHOP_FILE = SURFACE_FILE;

  const INSPECT_FINGER_KEY = "inspect";
  const INSPECT_FINGER_FILE = INSPECT_FILE;
  const INSPECT_BISHOP_KEY = "inspect";
  const INSPECT_BISHOP_FILE = INSPECT_FILE;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvasParent: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    mountainTruthClaimed: false,
    biomeTruthClaimed: false,
    atmosphereTruthClaimed: false,
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const FINGER_FILES = Object.freeze({
    boundary: BOUNDARY_FILE,
    mass: MASS_FILE,
    surface: SURFACE_FILE,
    light: LIGHT_FILE,
    inspect: INSPECT_FILE,
    composite: COMPOSITE_FILE
  });

  const FINGER_SEQUENCE = Object.freeze([
    "boundary",
    "mass",
    "surface",
    "light",
    "inspect",
    "composite"
  ]);

  const CANVAS_API_ALIASES = Object.freeze([
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
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

    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
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

    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrier",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const RELEASE_PACKET_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET",
    "HEARTH_CANVAS_RELEASE_PACKET",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RELEASE_PACKET",
    "HEARTH_WEST_CANVAS_RELEASE_PACKET",
    "LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET",
    "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET",
    "HEARTH_WEST_GATE_HIERARCHY_RELEASE_PACKET",

    "HEARTH.routeConductorCanvasReleasePacket",
    "HEARTH.canvasReleasePacket",
    "HEARTH.routeConductorBishopQueenCanvasReleasePacket",
    "HEARTH.westCanvasReleasePacket",
    "HEARTH.bishopChordCanvasReleasePacket",
    "HEARTH.westGateHierarchyReleasePacket",

    "DEXTER_LAB.hearthWestCanvasReleasePacket",
    "DEXTER_LAB.hearthRuntimeTableWestReleasePacket",
    "DEXTER_LAB.hearthWestBishopChordCanvasReleasePacket",
    "DEXTER_LAB.hearthWestGateHierarchyReleasePacket"
  ]);

  const SURFACE_POINTER_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_BISHOP",
    "HEARTH_CANVAS_SURFACE_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
    "HEARTH_CANVAS_FINGER_SURFACE_INTERNAL_EXTERNAL_SOCKET",
    "HEARTH_CANVAS_BISHOP_SURFACE_INTERNAL_EXTERNAL_SOCKET",

    "HEARTH.canvasPointerBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasSurfaceBishop",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasFingerSurfacePointer",
    "HEARTH.canvasFingerSurfaceInternalExternalSocket",
    "HEARTH.canvasBishopSurfaceInternalExternalSocket",

    "DEXTER_LAB.hearthCanvasPointerBishop",
    "DEXTER_LAB.hearthCanvasBishopSurfacePointer",
    "DEXTER_LAB.hearthCanvasSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasPointerFinger",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointer",
    "DEXTER_LAB.hearthCanvasFingerSurfaceInternalExternalSocket",
    "DEXTER_LAB.hearthCanvasBishopSurfaceInternalExternalSocket"
  ]);

  const INSPECT_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_INSPECT_FINGER",
    "HEARTH_CANVAS_BISHOP_INSPECT",
    "HEARTH_CANVAS_INSPECT_BISHOP",

    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasInspectFinger",
    "HEARTH.canvasBishopInspect",
    "HEARTH.canvasInspectBishop",

    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasInspectFinger",
    "DEXTER_LAB.hearthCanvasBishopInspect",
    "DEXTER_LAB.hearthCanvasInspectBishop"
  ]);

  const FINGER_ALIASES = Object.freeze({
    boundary: Object.freeze([
      "HEARTH.canvasFingerBoundary",
      "HEARTH.canvasBoundaryFinger",
      "HEARTH.canvasBishopBoundary",
      "HEARTH.canvasBoundaryBishop",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "HEARTH_CANVAS_BOUNDARY_FINGER",
      "HEARTH_CANVAS_BISHOP_BOUNDARY",
      "HEARTH_CANVAS_BOUNDARY_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerBoundary",
      "DEXTER_LAB.hearthCanvasBoundaryFinger",
      "DEXTER_LAB.hearthCanvasBishopBoundary",
      "DEXTER_LAB.hearthCanvasBoundaryBishop"
    ]),
    mass: Object.freeze([
      "HEARTH.canvasFingerMass",
      "HEARTH.canvasMassFinger",
      "HEARTH.canvasBishopMass",
      "HEARTH.canvasMassBishop",
      "HEARTH_CANVAS_FINGER_MASS",
      "HEARTH_CANVAS_MASS_FINGER",
      "HEARTH_CANVAS_BISHOP_MASS",
      "HEARTH_CANVAS_MASS_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerMass",
      "DEXTER_LAB.hearthCanvasMassFinger",
      "DEXTER_LAB.hearthCanvasBishopMass",
      "DEXTER_LAB.hearthCanvasMassBishop"
    ]),
    surface: SURFACE_POINTER_ALIASES,
    light: Object.freeze([
      "HEARTH.canvasFingerLight",
      "HEARTH.canvasLightFinger",
      "HEARTH.canvasBishopLight",
      "HEARTH.canvasLightBishop",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "HEARTH_CANVAS_LIGHT_FINGER",
      "HEARTH_CANVAS_BISHOP_LIGHT",
      "HEARTH_CANVAS_LIGHT_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerLight",
      "DEXTER_LAB.hearthCanvasLightFinger",
      "DEXTER_LAB.hearthCanvasBishopLight",
      "DEXTER_LAB.hearthCanvasLightBishop"
    ]),
    inspect: INSPECT_ALIASES,
    composite: Object.freeze([
      "HEARTH.canvasFingerComposite",
      "HEARTH.canvasCompositeFinger",
      "HEARTH.canvasBishopComposite",
      "HEARTH.canvasCompositeBishop",
      "HEARTH_CANVAS_FINGER_COMPOSITE",
      "HEARTH_CANVAS_COMPOSITE_FINGER",
      "HEARTH_CANVAS_BISHOP_COMPOSITE",
      "HEARTH_CANVAS_COMPOSITE_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerComposite",
      "DEXTER_LAB.hearthCanvasCompositeFinger",
      "DEXTER_LAB.hearthCanvasBishopComposite",
      "DEXTER_LAB.hearthCanvasCompositeBishop"
    ])
  });

  const RELEASE_METHODS = Object.freeze([
    "consumeRouteConductorReleasePacket",
    "receiveRouteConductorReleasePacket",
    "consumeReleasePacket",
    "receiveReleasePacket",
    "receiveCanvasReleasePacket",
    "receiveCanvasParentPacket",
    "acceptReleasePacket"
  ]);

  const BISHOP_FINGER_METHODS = Object.freeze([
    "receiveBishopPacket",
    "receiveCanvasBishopPacket",
    "registerCanvasBishop",
    "registerExpressionBishop",
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "registerCanvasFinger",
    "registerExpressionFinger",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "receiveSurfaceBishopPacket",
    "receivePointerBishopPacket",
    "receiveSurfacePointerBishopPacket",
    "receiveSurfaceFingerPacket",
    "receivePointerFingerPacket",
    "receiveInspectFingerPacket",
    "receiveInspectBishopPacket",
    "receiveCompositeFingerPacket",
    "receiveCompositeBishopPacket",
    "receiveWorldExpressionPacket",
    "receiveInternalFingerPacket",
    "receiveInternalBishopPacket",
    "receiveExpansionFingerPacket",
    "receiveExpansionBishopPacket"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",
    mountedAt: "",
    lastRenderAt: "",

    roomVersion: ROOM_VERSION,
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV12Contract: LINEAGE_V12_CONTRACT,
    lineageV117Contract: LINEAGE_V11_7_CONTRACT,
    lineageV116Contract: LINEAGE_V11_6_CONTRACT,

    file: FILE,
    route: ROUTE,
    showroomFile: SHOWROOM_FILE,
    indexFile: INDEX_FILE,
    queenFile: QUEEN_FILE,
    westFile: WEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canvasBishopActive: true,
    receiverOutputCarrierActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,

    showroomExpectedCorrect: true,
    stalePointerNormalizationEnabled: false,
    stalePointerLanguageObserved: false,
    showroomPointerLanguageMismatch: false,
    showroomPointerLanguageAccepted: true,
    pointerLanguageNormalized: false,
    pointerMismatchSource: "NONE",
    pointerMismatchValue: "",
    pointerMismatchFile: "",

    pointerFingerKey: POINTER_FINGER_KEY,
    pointerFingerFile: POINTER_FINGER_FILE,
    pointerBishopKey: POINTER_BISHOP_KEY,
    pointerBishopFile: POINTER_BISHOP_FILE,
    inspectFingerKey: INSPECT_FINGER_KEY,
    inspectFingerFile: INSPECT_FINGER_FILE,
    inspectBishopKey: INSPECT_BISHOP_KEY,
    inspectBishopFile: INSPECT_BISHOP_FILE,

    releasePacketObserved: false,
    releasePacketSource: "NONE",
    releasePacketAccepted: false,
    releasePacketRejected: false,
    releasePacketHeldReason: "WAITING_RELEASE_PACKET",
    canvasParentReleaseAccepted: false,
    canvasParentReleaseObserved: false,
    parentReleaseLawful: false,
    parentAcceptedRouteConductorRelease: false,
    parentReleasePacketLawful: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,

    canvasReceiverApiReady: true,
    canvasReceiveSurfaceReady: true,
    canvasSummaryObserved: true,

    mountElementFound: false,
    canvasElementFound: false,
    canvasMounted: false,
    canvasDrawComplete: false,
    baseGlobeMounted: false,
    baseGlobeDrawComplete: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofIngestedByRoute: false,
    visiblePlanetReceiptObserved: false,

    structuralCarrierReady: false,
    structuralCarrierSafe: false,
    structuralCarrierSafeForCanvasRelease: false,
    canvasPreReleaseCarrierSafeForWest: false,
    carrierHoldReason: "WAITING_RENDER",

    fingerRegistry: {},
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    firstFingerGap: "WAITING_SURFACE_POINTER_BISHOP",
    firstFingerGapFile: SURFACE_FILE,
    nextFingerKey: "surface",
    nextFingerFile: SURFACE_FILE,

    surfacePointerBishopObserved: false,
    surfacePointerBishopAccepted: false,
    inspectFingerObserved: false,
    inspectBishopObserved: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_RENDER",
    f13StrictEvidenceRepairTarget: FILE,
    degradedF13IsFunctional: false,
    strictVisualProofPending: false,
    functionalPageObserved: false,

    view: {
      yaw: 0,
      pitch: 0,
      zoom: 1,
      autoRotate: false
    },

    currentReleasePacket: null,
    currentCanvasSummary: null,
    currentStructuralCarrier: null,
    lastFingerPacket: null,
    lastExpressionPacket: null,
    lastControlPacket: null,
    lastRegistrationResponse: null,

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "CANVAS_BISHOP_WAITING_BOOT",

    localEvents: [],
    errors: [],
    booted: false,
    mounted: false,

    ...NO_CLAIMS
  };

  let renderTimer = 0;
  let republishTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) array.splice(0, array.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_BISHOP_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_BISHOP_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 120);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function ensureNamespaces() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");
    return true;
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

  function writePath(path, value) {
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

  function firstAuthority(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, authority: value };
    }
    return { name: "NONE", authority: null };
  }

  function safeInvoke(authority, method, args = []) {
    if (!authority || !isFunction(authority[method])) return null;
    try {
      return authority[method](...args);
    } catch (error) {
      recordError("CANVAS_BISHOP_SAFE_INVOKE_FAILED", error, { method });
      return null;
    }
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getBishopPacket",
      "getPointerBishopPacket",
      "getPointerFingerPacket",
      "getSurfacePacket",
      "getInspectionPacket",
      "getInspectionSummary",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getVisibleGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getStatus",
      "getReport",
      "getState",
      "read"
    ];

    for (const method of methods) {
      const output = safeInvoke(authority, method, method === "getReceiptLight" || method === "getCanvasStationReceiptLight" ? [false] : []);
      if (isObject(output)) return output;
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.packet)) return authority.packet;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function stableStringify(value) {
    try {
      return JSON.stringify(value, Object.keys(value || {}).sort());
    } catch (_error) {
      return safeString(value);
    }
  }

  function classifyFingerPacket(packet = {}) {
    const p = isObject(packet) ? packet : {};
    const text = [
      p.fingerName,
      p.fingerKey,
      p.bishopName,
      p.bishopKey,
      p.category,
      p.packetType,
      p.packetName,
      p.file,
      p.sourceFile
    ].map((value) => safeString(value).toLowerCase()).join(" ");

    if (text.includes("surface") || text.includes("pointer")) return "surface";
    if (text.includes("inspect")) return "inspect";
    if (text.includes("boundary")) return "boundary";
    if (text.includes("mass")) return "mass";
    if (text.includes("light")) return "light";
    if (text.includes("composite") || text.includes("world-expression") || text.includes("world expression")) return "composite";

    return "unknown";
  }

  function readFingerBishops() {
    const registry = {};

    for (const key of FINGER_SEQUENCE) {
      const found = firstAuthority(FINGER_ALIASES[key] || []);
      const receipt = found.authority ? readAuthorityReceipt(found.authority) : null;

      const contract = safeString(
        (receipt && (receipt.contract || receipt.CONTRACT)) ||
        (found.authority && (found.authority.contract || found.authority.CONTRACT)) ||
        ""
      );

      const hardFail = Boolean(
        receipt &&
        (
          receipt.hardFail === true ||
          receipt.bishopHardBlock === true ||
          receipt.f13HardFail === true ||
          receipt.visibleContentHardFail === true
        )
      );

      const apiReady = Boolean(
        found.authority &&
        (
          isFunction(found.authority.getReceipt) ||
          isFunction(found.authority.getReceiptLight) ||
          isFunction(found.authority.getBishopPacket) ||
          isFunction(found.authority.getPointerBishopPacket) ||
          isFunction(found.authority.getSurfacePacket) ||
          isFunction(found.authority.drawToCanvas) ||
          isFunction(found.authority.sample) ||
          isFunction(found.authority.sampleSurface) ||
          receipt
        )
      );

      const packetReady = Boolean(
        receipt &&
        (
          receipt.surfacePacketReady === true ||
          receipt.pointerBishopPacketReady === true ||
          receipt.boundaryPacketReady === true ||
          receipt.massPacketReady === true ||
          receipt.lightPacketReady === true ||
          receipt.allFingerReady === true ||
          receipt.visibleContributionAvailable === true ||
          receipt.baseCanvasGlobeEvidenceReady === true
        )
      );

      const trackReady = Boolean(found.authority && apiReady && !hardFail && (packetReady || key === "surface" || key === "inspect"));

      registry[key] = {
        key,
        file: FINGER_FILES[key],
        sourceName: found.name,
        authorityObserved: Boolean(found.authority),
        receiptObserved: Boolean(receipt),
        apiReady,
        packetReady,
        trackReady,
        hardFail,
        contract,
        receipt: clonePlain(receipt)
      };
    }

    state.fingerRegistry = registry;
    state.fingerAuthorityObservedCount = Object.values(registry).filter((item) => item.authorityObserved).length;
    state.fingerApiReadyCount = Object.values(registry).filter((item) => item.apiReady).length;
    state.fingerReceiptPacketCount = Object.values(registry).filter((item) => item.receiptObserved).length;
    state.fingerTrackReadyCount = Object.values(registry).filter((item) => item.trackReady).length;
    state.fingerHardFailCount = Object.values(registry).filter((item) => item.hardFail).length;
    state.anyFingerTrackActive = state.fingerAuthorityObservedCount > 0 || state.fingerApiReadyCount > 0 || state.fingerTrackReadyCount > 0;

    state.surfacePointerBishopObserved = Boolean(registry.surface && registry.surface.authorityObserved);
    state.surfacePointerBishopAccepted = Boolean(registry.surface && registry.surface.trackReady);
    state.inspectFingerObserved = Boolean(registry.inspect && registry.inspect.authorityObserved);
    state.inspectBishopObserved = state.inspectFingerObserved;

    if (!state.surfacePointerBishopAccepted) {
      state.firstFingerGap = state.surfacePointerBishopObserved
        ? "WAITING_SURFACE_POINTER_BISHOP_READY"
        : "WAITING_SURFACE_POINTER_BISHOP";
      state.firstFingerGapFile = SURFACE_FILE;
      state.nextFingerKey = "surface";
      state.nextFingerFile = SURFACE_FILE;
    } else if (!state.inspectFingerObserved) {
      state.firstFingerGap = "WAITING_INSPECT_BISHOP";
      state.firstFingerGapFile = INSPECT_FILE;
      state.nextFingerKey = "inspect";
      state.nextFingerFile = INSPECT_FILE;
    } else {
      state.firstFingerGap = "NONE_REQUIRED_FINGER_BISHOPS_OBSERVED";
      state.firstFingerGapFile = "NONE";
      state.nextFingerKey = "none";
      state.nextFingerFile = "NONE";
    }

    state.allDeclaredFingerTracksReady = Boolean(
      state.surfacePointerBishopAccepted &&
      state.inspectFingerObserved &&
      state.fingerHardFailCount === 0
    );

    return clonePlain(registry);
  }

  function pointerLanguageFromPacket(packet = {}) {
    const p = isObject(packet) ? packet : {};

    const keyValues = [
      p.pointerFingerBishopKey,
      p.pointerFingerKey,
      p.pointerBishopKey,
      p.pointerKey,
      p.pointerFingerBishop,
      p.pointerFinger,
      p.pointerBishop
    ].map((value) => safeString(value).trim().toLowerCase()).filter(Boolean);

    const fileValues = [
      p.pointerFingerBishopFile,
      p.pointerFingerFile,
      p.pointerBishopFile,
      p.pointerFile
    ].map((value) => safeString(value).trim()).filter(Boolean);

    const inspectKey = keyValues.find((value) => value === "inspect" || value.includes("inspect"));
    const inspectFile = fileValues.find((value) => value === INSPECT_FILE || value.includes("hearth.canvas.finger.inspect.js"));
    const surfaceKey = keyValues.find((value) => value === "surface" || value.includes("surface"));
    const surfaceFile = fileValues.find((value) => value === SURFACE_FILE || value.includes("hearth.canvas.finger.surface.js"));

    const mismatch = Boolean(inspectKey || inspectFile);

    return {
      explicitPointerLanguageObserved: Boolean(keyValues.length || fileValues.length),
      keyValues,
      fileValues,
      inspectKey: inspectKey || "",
      inspectFile: inspectFile || "",
      surfaceKey: surfaceKey || "",
      surfaceFile: surfaceFile || "",
      mismatch,
      accepted: !mismatch
    };
  }

  function resolveReleaseAuthorization(packet = {}) {
    const p = isObject(packet) ? packet : {};

    return Boolean(
      p.canvasReleaseAuthorized === true ||
      p.canvasReleasePacketReady === true ||
      p.releaseToCanvas === true ||
      p.westDecision === "RELEASE_TO_CANVAS" ||
      p.westCanvasReleaseApproved === true ||
      p.canvasReleaseApprovedByWest === true ||
      p.handoffTo === "CANVAS" ||
      p.destinationFile === FILE ||
      p.targetFile === FILE ||
      p.destinationFile === "/assets/hearth/hearth.canvas.js" ||
      p.targetFile === "/assets/hearth/hearth.canvas.js"
    );
  }

  function receiveReleaseEnvelope(packet = {}, sourceMethod = "receiveReleaseEnvelope") {
    const input = isObject(packet) ? packet : {};
    const pointer = pointerLanguageFromPacket(input);
    const authorized = resolveReleaseAuthorization(input);
    const signature = stableStringify({
      sourceMethod,
      contract: input.contract,
      receipt: input.receipt,
      packetType: input.packetType,
      pointerFingerBishopKey: input.pointerFingerBishopKey,
      pointerFingerBishopFile: input.pointerFingerBishopFile,
      canvasReleaseAuthorized: input.canvasReleaseAuthorized,
      releaseToCanvas: input.releaseToCanvas
    });

    state.releasePacketObserved = true;
    state.releasePacketSource = sourceMethod;
    state.currentReleasePacket = clonePlain(input);
    state.canvasReleaseAuthorized = authorized;
    state.canvasReleasePacketReady = authorized;

    if (pointer.mismatch) {
      state.stalePointerLanguageObserved = true;
      state.showroomPointerLanguageMismatch = true;
      state.showroomPointerLanguageAccepted = false;
      state.pointerLanguageNormalized = false;
      state.pointerMismatchSource = sourceMethod;
      state.pointerMismatchValue = pointer.inspectKey || "inspect";
      state.pointerMismatchFile = pointer.inspectFile || INSPECT_FILE;

      state.releasePacketAccepted = false;
      state.releasePacketRejected = false;
      state.releasePacketHeldReason = "SHOWROOM_POINTER_LANGUAGE_MISMATCH_INSPECT_APPOINTED_AS_POINTER";
      state.canvasParentReleaseAccepted = false;
      state.canvasParentReleaseObserved = true;
      state.parentReleaseLawful = false;
      state.parentAcceptedRouteConductorRelease = false;
      state.parentReleasePacketLawful = false;

      state.firstFailedCoordinate = "SHOWROOM_POINTER_LANGUAGE_MISMATCH_INSPECT_APPOINTED_AS_POINTER";
      state.recommendedNextFile = SHOWROOM_FILE;
      state.recommendedNextRenewalTarget = SHOWROOM_FILE;
      state.postgameStatus = "CANVAS_RELEASE_HELD_SHOWROOM_POINTER_LANGUAGE_MISMATCH";

      record("CANVAS_RELEASE_HELD_SHOWROOM_POINTER_LANGUAGE_MISMATCH", {
        sourceMethod,
        pointer,
        signature,
        recommendedNextFile: SHOWROOM_FILE
      });

      updateDerivedReadiness();
      updateDataset();
      publishGlobals();
      return getReceiptLight(false);
    }

    state.showroomPointerLanguageMismatch = false;
    state.showroomPointerLanguageAccepted = true;
    state.pointerMismatchSource = "NONE";
    state.pointerMismatchValue = "";
    state.pointerMismatchFile = "";

    state.releasePacketAccepted = Boolean(authorized);
    state.releasePacketRejected = false;
    state.releasePacketHeldReason = authorized ? "NONE_RELEASE_ACCEPTED" : "WAITING_CANVAS_RELEASE_AUTHORIZATION";
    state.canvasParentReleaseAccepted = Boolean(authorized);
    state.canvasParentReleaseObserved = true;
    state.parentReleaseLawful = Boolean(authorized);
    state.parentAcceptedRouteConductorRelease = Boolean(authorized);
    state.parentReleasePacketLawful = Boolean(authorized);

    record("CANVAS_RELEASE_ENVELOPE_RECEIVED", {
      sourceMethod,
      authorized,
      pointerLanguageAccepted: true,
      signature
    });

    updateDerivedReadiness();
    scheduleRender();
    updateDataset();
    publishGlobals();
    return getReceiptLight(false);
  }

  function receiveExpressionAuthorityPacket(packet = {}, sourceMethod = "receiveExpressionAuthorityPacket") {
    const input = isObject(packet) ? packet : {};
    const key = classifyFingerPacket(input);

    state.lastExpressionPacket = clonePlain(input);
    state.lastFingerPacket = clonePlain(input);
    state.fingerExpressionPacketCount += 1;

    if (key !== "unknown") {
      const existing = state.fingerRegistry[key] || {
        key,
        file: FINGER_FILES[key] || "UNKNOWN",
        sourceName: sourceMethod,
        authorityObserved: true,
        receiptObserved: false,
        apiReady: true,
        packetReady: true,
        trackReady: true,
        hardFail: false,
        contract: ""
      };

      state.fingerRegistry[key] = {
        ...existing,
        sourceName: sourceMethod,
        authorityObserved: true,
        apiReady: true,
        packetReady: true,
        trackReady: true,
        hardFail: false,
        lastPacket: clonePlain(input)
      };
    }

    if (key === "surface") {
      state.surfacePointerBishopObserved = true;
      state.surfacePointerBishopAccepted = true;
    }

    if (key === "inspect") {
      state.inspectFingerObserved = true;
      state.inspectBishopObserved = true;
    }

    updateDerivedReadiness();
    scheduleRender();
    updateDataset();
    publishGlobals();

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      acceptedByCanvasBishop: true,
      sourceMethod,
      classifiedFingerKey: key,
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      inspectFingerKey: INSPECT_FINGER_KEY,
      inspectFingerFile: INSPECT_FINGER_FILE,
      ...NO_CLAIMS
    };
  }

  function readAmbientReleasePackets() {
    for (const alias of RELEASE_PACKET_ALIASES) {
      const packet = readPath(alias);
      if (isObject(packet)) {
        receiveReleaseEnvelope(packet, `ambient:${alias}`);
        return true;
      }
    }
    return false;
  }

  function findMount() {
    if (!doc) return null;

    return (
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-visible-planet-mount]") ||
      doc.querySelector("[data-hearth-globe-stage]") ||
      doc.querySelector("#hearthGlobeStage")
    );
  }

  function ensureCanvas() {
    if (!doc) return null;

    const mount = findMount();
    state.mountElementFound = Boolean(mount);

    let canvas = mount ? mount.querySelector("canvas[data-hearth-canvas-bishop='true']") : null;
    if (!canvas && mount) canvas = mount.querySelector("canvas");

    if (!canvas && mount) {
      canvas = doc.createElement("canvas");
      canvas.dataset.hearthCanvasBishop = "true";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);
    }

    state.canvasElementFound = Boolean(canvas);
    return canvas;
  }

  function resizeCanvas(canvas) {
    if (!canvas) return { width: 0, height: 0 };

    const rect = isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    const parent = canvas.parentElement || null;
    const parentRect = parent && isFunction(parent.getBoundingClientRect) ? parent.getBoundingClientRect() : null;

    const cssWidth = Math.max(
      320,
      Math.round((rect && rect.width) || (parentRect && parentRect.width) || canvas.clientWidth || 920)
    );

    const cssHeight = Math.max(
      320,
      Math.round((rect && rect.height) || (parentRect && parentRect.height) || canvas.clientHeight || 620)
    );

    const ratio = Math.max(1, Math.min(2, root.devicePixelRatio || 1));
    const width = Math.round(cssWidth * ratio);
    const height = Math.round(cssHeight * ratio);

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    return { width, height, ratio };
  }

  function drawBaseGlobe(context, width, height) {
    const min = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = min * 0.39 * clamp(state.view.zoom, 0.78, 1.35);

    context.clearRect(0, 0, width, height);

    const bg = context.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(10, 18, 28, 1)");
    bg.addColorStop(0.52, "rgba(22, 31, 43, 1)");
    bg.addColorStop(1, "rgba(8, 10, 16, 1)");
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    const halo = context.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.45);
    halo.addColorStop(0, "rgba(110, 140, 170, 0.18)");
    halo.addColorStop(0.55, "rgba(70, 102, 126, 0.10)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
    context.fill();

    const ocean = context.createRadialGradient(cx - radius * 0.24, cy - radius * 0.28, radius * 0.08, cx, cy, radius);
    ocean.addColorStop(0, "rgba(55, 109, 139, 1)");
    ocean.addColorStop(0.48, "rgba(30, 82, 113, 1)");
    ocean.addColorStop(1, "rgba(10, 34, 58, 1)");
    context.fillStyle = ocean;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.beginPath();
    context.arc(cx, cy, radius * 0.992, 0, Math.PI * 2);
    context.clip();

    const yaw = state.view.yaw || 0;
    const land = [
      [-0.34, -0.22, 0.24, 0.14, -0.28],
      [0.02, -0.31, 0.18, 0.10, 0.18],
      [0.28, -0.06, 0.21, 0.15, -0.12],
      [-0.12, 0.11, 0.28, 0.17, 0.08],
      [0.18, 0.24, 0.18, 0.12, 0.34],
      [-0.31, 0.31, 0.15, 0.10, -0.08]
    ];

    for (const item of land) {
      const x = cx + (item[0] + Math.sin(yaw) * 0.035) * radius;
      const y = cy + item[1] * radius;
      const rx = item[2] * radius;
      const ry = item[3] * radius;
      const rot = item[4] + yaw * 0.08;

      context.globalAlpha = 0.56;
      context.fillStyle = "rgba(127, 121, 83, 0.64)";
      context.beginPath();
      context.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = 0.28;
      context.strokeStyle = "rgba(204, 185, 126, 0.42)";
      context.lineWidth = Math.max(1, min * 0.0025);
      context.stroke();
    }

    context.restore();

    const surface = state.fingerRegistry.surface && state.fingerRegistry.surface.authorityObserved
      ? firstAuthority(SURFACE_POINTER_ALIASES).authority
      : null;

    if (surface && isFunction(surface.drawToCanvas)) {
      try {
        surface.drawToCanvas(context, {
          width,
          height,
          surfaceOpacity: 0.42,
          bodyGlazeOpacity: 0.08,
          edgeSurfaceOpacity: 0.15
        });
      } catch (error) {
        recordError("SURFACE_POINTER_BISHOP_DRAW_CONTRIBUTION_FAILED", error);
      }
    }

    const light = context.createRadialGradient(cx - radius * 0.34, cy - radius * 0.38, radius * 0.05, cx, cy, radius * 1.05);
    light.addColorStop(0, "rgba(255, 245, 196, 0.32)");
    light.addColorStop(0.5, "rgba(255, 240, 190, 0.08)");
    light.addColorStop(1, "rgba(0, 0, 0, 0.42)");
    context.fillStyle = light;
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 1;
    context.strokeStyle = "rgba(217, 197, 129, 0.34)";
    context.lineWidth = Math.max(1, min * 0.006);
    context.beginPath();
    context.arc(cx, cy, radius * 1.002, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = "rgba(104, 168, 203, 0.22)";
    context.lineWidth = Math.max(1, min * 0.012);
    context.beginPath();
    context.arc(cx, cy, radius * 1.032, 0, Math.PI * 2);
    context.stroke();

    return {
      centerX: cx,
      centerY: cy,
      radius,
      width,
      height
    };
  }

  function renderCanvas() {
    const canvas = ensureCanvas();
    if (!canvas || !isFunction(canvas.getContext)) {
      state.canvasMounted = false;
      state.canvasDrawComplete = false;
      state.visiblePlanetProofReady = false;
      state.carrierHoldReason = "NO_CANVAS_ELEMENT";
      updateDerivedReadiness();
      updateDataset();
      publishGlobals();
      return getReceiptLight(false);
    }

    const context = canvas.getContext("2d");
    if (!context) {
      state.canvasMounted = false;
      state.canvasDrawComplete = false;
      state.visiblePlanetProofReady = false;
      state.carrierHoldReason = "NO_2D_CONTEXT";
      updateDerivedReadiness();
      updateDataset();
      publishGlobals();
      return getReceiptLight(false);
    }

    const size = resizeCanvas(canvas);
    if (!size.width || !size.height) {
      state.canvasMounted = false;
      state.canvasDrawComplete = false;
      state.visiblePlanetProofReady = false;
      state.carrierHoldReason = "CANVAS_DIMENSIONS_UNAVAILABLE";
      updateDerivedReadiness();
      updateDataset();
      publishGlobals();
      return getReceiptLight(false);
    }

    try {
      drawBaseGlobe(context, size.width, size.height);

      state.canvasMounted = true;
      state.mounted = true;
      state.baseGlobeMounted = true;
      state.canvasDrawComplete = true;
      state.baseGlobeDrawComplete = true;
      state.visibleBaseGlobeCarrierActive = true;
      state.canvasVisibleBaseGlobeCarrierActive = true;
      state.baseGlobeVisibleCarrierReady = true;
      state.visibleGlobeCarrierReady = true;
      state.visiblePlanetProofReady = true;
      state.visiblePlanetProofSource = "CANVAS_BISHOP_BASE_GLOBE_RENDER";
      state.visiblePlanetProofIngestedByRoute = state.releasePacketAccepted === true;
      state.visiblePlanetReceiptObserved = true;
      state.mountedAt = state.mountedAt || nowIso();
      state.lastRenderAt = nowIso();

      updateDerivedReadiness();

      record("CANVAS_BISHOP_RENDER_COMPLETE", {
        width: size.width,
        height: size.height,
        surfacePointerBishopAccepted: state.surfacePointerBishopAccepted,
        visiblePlanetProofReady: true,
        showroomPointerLanguageMismatch: state.showroomPointerLanguageMismatch
      });
    } catch (error) {
      state.canvasMounted = false;
      state.canvasDrawComplete = false;
      state.visiblePlanetProofReady = false;
      state.carrierHoldReason = "CANVAS_RENDER_FAILED";
      recordError("CANVAS_BISHOP_RENDER_FAILED", error);
      updateDerivedReadiness();
    }

    updateDataset();
    publishGlobals();
    return getReceiptLight(false);
  }

  function scheduleRender() {
    if (!root.setTimeout) return renderCanvas();
    if (renderTimer) return getReceiptLight(false);

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      renderCanvas();
    }, 40);

    return getReceiptLight(false);
  }

  function updateDerivedReadiness() {
    state.structuralCarrierReady = Boolean(state.canvasMounted && state.canvasDrawComplete);
    state.structuralCarrierSafe = Boolean(state.structuralCarrierReady && !state.showroomPointerLanguageMismatch);
    state.structuralCarrierSafeForCanvasRelease = state.structuralCarrierSafe;
    state.canvasPreReleaseCarrierSafeForWest = Boolean(state.structuralCarrierSafe && state.canvasReceiverApiReady);

    if (state.showroomPointerLanguageMismatch) {
      state.carrierHoldReason = "SHOWROOM_POINTER_LANGUAGE_MISMATCH_INSPECT_APPOINTED_AS_POINTER";
    } else if (!state.structuralCarrierReady) {
      state.carrierHoldReason = "WAITING_RENDER";
    } else {
      state.carrierHoldReason = "NONE_CARRIER_SAFE";
    }

    state.f13VisibleEvidenceAvailable = Boolean(state.visiblePlanetProofReady);
    state.f13InspectEvidenceAvailable = Boolean(state.inspectFingerObserved || state.inspectBishopObserved);
    state.f13CanvasReadinessObserved = Boolean(state.canvasMounted || state.visiblePlanetProofReady);
    state.f13HardFail = false;

    state.f13CanvasEvidenceStrict = Boolean(
      state.visiblePlanetProofReady &&
      state.surfacePointerBishopAccepted &&
      state.inspectFingerObserved &&
      !state.showroomPointerLanguageMismatch
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      state.visiblePlanetProofReady &&
      !state.f13CanvasEvidenceStrict &&
      !state.showroomPointerLanguageMismatch
    );

    state.f13CanvasEvidenceComplete = Boolean(
      state.f13CanvasEvidenceStrict ||
      state.f13CanvasEvidenceDegraded ||
      state.visiblePlanetProofReady
    );

    state.degradedF13IsFunctional = Boolean(state.f13CanvasEvidenceDegraded && state.f13CanvasEvidenceComplete);
    state.strictVisualProofPending = Boolean(state.f13CanvasEvidenceComplete && !state.f13CanvasEvidenceStrict);
    state.functionalPageObserved = Boolean(state.visiblePlanetProofReady && !state.f13HardFail);

    if (state.showroomPointerLanguageMismatch) {
      state.f13StrictEvidenceGap = "SHOWROOM_POINTER_LANGUAGE_MISMATCH_INSPECT_APPOINTED_AS_POINTER";
      state.f13StrictEvidenceRepairTarget = SHOWROOM_FILE;
      state.firstFailedCoordinate = "SHOWROOM_POINTER_LANGUAGE_MISMATCH_INSPECT_APPOINTED_AS_POINTER";
      state.recommendedNextFile = SHOWROOM_FILE;
      state.recommendedNextRenewalTarget = SHOWROOM_FILE;
      state.postgameStatus = "CANVAS_HELD_FOR_SHOWROOM_POINTER_LANGUAGE_CLEANUP";
      return;
    }

    if (!state.canvasMounted || !state.canvasDrawComplete) {
      state.f13StrictEvidenceGap = "WAITING_CANVAS_RENDER";
      state.f13StrictEvidenceRepairTarget = FILE;
      state.firstFailedCoordinate = "WAITING_CANVAS_RENDER";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = "CANVAS_BISHOP_WAITING_RENDER";
      return;
    }

    if (!state.surfacePointerBishopAccepted) {
      state.f13StrictEvidenceGap = "WAITING_SURFACE_POINTER_BISHOP";
      state.f13StrictEvidenceRepairTarget = SURFACE_FILE;
      state.firstFailedCoordinate = "WAITING_SURFACE_POINTER_BISHOP";
      state.recommendedNextFile = SURFACE_FILE;
      state.recommendedNextRenewalTarget = SURFACE_FILE;
      state.postgameStatus = "CANVAS_VISIBLE_PROOF_READY_WAITING_SURFACE_POINTER_BISHOP";
      return;
    }

    if (!state.inspectFingerObserved) {
      state.f13StrictEvidenceGap = "WAITING_INSPECT_BISHOP";
      state.f13StrictEvidenceRepairTarget = INSPECT_FILE;
      state.firstFailedCoordinate = "WAITING_INSPECT_BISHOP";
      state.recommendedNextFile = INSPECT_FILE;
      state.recommendedNextRenewalTarget = INSPECT_FILE;
      state.postgameStatus = "CANVAS_VISIBLE_PROOF_READY_WAITING_INSPECT_BISHOP";
      return;
    }

    state.f13StrictEvidenceGap = "NONE_CANVAS_BISHOP_STRICT_EVIDENCE_AVAILABLE";
    state.f13StrictEvidenceRepairTarget = "NONE";
    state.firstFailedCoordinate = state.releasePacketAccepted
      ? "NONE_CANVAS_RELEASE_ACCEPTED_VISIBLE_PROOF_READY"
      : "WAITING_SHOWROOM_RELEASE_PACKET";
    state.recommendedNextFile = state.releasePacketAccepted ? SHOWROOM_FILE : SHOWROOM_FILE;
    state.recommendedNextRenewalTarget = state.releasePacketAccepted ? SHOWROOM_FILE : SHOWROOM_FILE;
    state.postgameStatus = state.releasePacketAccepted
      ? "CANVAS_BISHOP_RELEASE_ACCEPTED_VISIBLE_PROOF_READY"
      : "CANVAS_BISHOP_VISIBLE_PROOF_READY_WAITING_SHOWROOM_RELEASE";
  }

  function receiveControlPacket(packet = {}, sourceMethod = "receiveControlPacket") {
    const input = isObject(packet) ? packet : {};
    state.lastControlPacket = clonePlain(input);

    const view = input.view || input.planetaryView || input.transform || input;

    if (isObject(view)) {
      if (view.yaw !== undefined) state.view.yaw = safeNumber(view.yaw, state.view.yaw);
      if (view.pitch !== undefined) state.view.pitch = clamp(view.pitch, -0.9, 0.9);
      if (view.zoom !== undefined) state.view.zoom = clamp(view.zoom, 0.65, 1.55);
      if (view.autoRotate !== undefined) state.view.autoRotate = safeBool(view.autoRotate, state.view.autoRotate);
      if (view.deltaYaw !== undefined) state.view.yaw += safeNumber(view.deltaYaw, 0);
      if (view.deltaPitch !== undefined) state.view.pitch = clamp(state.view.pitch + safeNumber(view.deltaPitch, 0), -0.9, 0.9);
      if (view.deltaZoom !== undefined) state.view.zoom = clamp(state.view.zoom + safeNumber(view.deltaZoom, 0), 0.65, 1.55);
    }

    record("CANVAS_BISHOP_CONTROL_PACKET_RECEIVED", {
      sourceMethod,
      view: clonePlain(state.view)
    });

    scheduleRender();

    return {
      ok: true,
      accepted: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceMethod,
      view: clonePlain(state.view),
      canvasOwnsControlRuntimeTruth: false,
      ...NO_CLAIMS
    };
  }

  function getStructuralCarrier() {
    const carrier = {
      packetType: "HEARTH_CANVAS_BISHOP_STRUCTURAL_CARRIER",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      roomVersion: ROOM_VERSION,
      file: FILE,
      route: ROUTE,

      structuralCarrierReady: state.structuralCarrierReady,
      structuralCarrierSafe: state.structuralCarrierSafe,
      structuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      hearthCanvasStructuralCarrierSafe: state.structuralCarrierSafe,
      hearthCanvasStructuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      canvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      hearthCanvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      carrierHoldReason: state.carrierHoldReason,

      showroomExpectedCorrect: true,
      showroomPointerLanguageMismatch: state.showroomPointerLanguageMismatch,
      stalePointerNormalizationEnabled: false,
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      inspectFingerKey: INSPECT_FINGER_KEY,
      inspectFingerFile: INSPECT_FINGER_FILE,

      canvasMounted: state.canvasMounted,
      canvasDrawComplete: state.canvasDrawComplete,
      visiblePlanetProofReady: state.visiblePlanetProofReady,

      ...NO_CLAIMS
    };

    state.currentStructuralCarrier = clonePlain(carrier);
    return carrier;
  }

  function readStructuralCarrier() {
    return getStructuralCarrier();
  }

  function getCanvasCarrier() {
    return getStructuralCarrier();
  }

  function getCarrierReceipt() {
    return getStructuralCarrier();
  }

  function getVisiblePlanetReceipt() {
    return {
      packetType: "HEARTH_CANVAS_BISHOP_VISIBLE_PLANET_RECEIPT",
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofIngestedByRoute,
      visiblePlanetReceiptObserved: state.visiblePlanetReceiptObserved,
      canvasMounted: state.canvasMounted,
      canvasDrawComplete: state.canvasDrawComplete,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      ...NO_CLAIMS
    };
  }

  function getVisibleGlobeReceipt() {
    return getVisiblePlanetReceipt();
  }

  function getVisibleBaseGlobeReceipt() {
    return getVisiblePlanetReceipt();
  }

  function getBaseGlobeReceipt() {
    return getVisiblePlanetReceipt();
  }

  function getCanvasVisibleProofReceipt() {
    return getVisiblePlanetReceipt();
  }

  function getCanvasStationSummary() {
    return getReceiptLight(false);
  }

  function getCanvasStationReceiptLight() {
    return getReceiptLight(false);
  }

  function getCanvasStationReceipt() {
    return getReceipt();
  }

  function getExpressionHubSummary() {
    return getReceiptLight(false);
  }

  function getExpressionHubReceipt() {
    return getReceipt();
  }

  function getStatus() {
    return getReceiptLight(false);
  }

  function getReport() {
    return getReceipt();
  }

  function getState() {
    return clonePlain(state);
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) {
      readFingerBishops();
      updateDerivedReadiness();
    }

    return {
      timestamp: state.timestamp || nowIso(),
      roomVersion: ROOM_VERSION,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      lineageV116Contract: LINEAGE_V11_6_CONTRACT,
      file: FILE,
      route: ROUTE,
      showroomFile: SHOWROOM_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      currentCanvasParentIsCurrentCanvas: true,
      canvasContractAccepted: true,
      canvasV123Recognized: true,
      canvasV122Recognized: false,
      canvasV121Recognized: false,
      canvasV12LineageAccepted: false,
      canvasV11LineageAccepted: false,
      canvasReceiverApiReady: true,
      canvasReceiveSurfaceReady: true,
      canvasSummaryObserved: true,

      canvasBishopActive: true,
      receiverOutputCarrierActive: true,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,

      showroomExpectedCorrect: true,
      stalePointerNormalizationEnabled: false,
      stalePointerLanguageObserved: state.stalePointerLanguageObserved,
      showroomPointerLanguageMismatch: state.showroomPointerLanguageMismatch,
      showroomPointerLanguageAccepted: state.showroomPointerLanguageAccepted,
      pointerLanguageNormalized: false,
      pointerMismatchSource: state.pointerMismatchSource,
      pointerMismatchValue: state.pointerMismatchValue,
      pointerMismatchFile: state.pointerMismatchFile,

      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      pointerBishopKey: POINTER_BISHOP_KEY,
      pointerBishopFile: POINTER_BISHOP_FILE,
      inspectFingerKey: INSPECT_FINGER_KEY,
      inspectFingerFile: INSPECT_FINGER_FILE,
      inspectBishopKey: INSPECT_BISHOP_KEY,
      inspectBishopFile: INSPECT_BISHOP_FILE,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketSource: state.releasePacketSource,
      releasePacketAccepted: state.releasePacketAccepted,
      releasePacketHeldReason: state.releasePacketHeldReason,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      parentReleaseLawful: state.parentReleaseLawful,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,

      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      canvasMounted: state.canvasMounted,
      canvasDrawComplete: state.canvasDrawComplete,
      baseGlobeMounted: state.baseGlobeMounted,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofIngestedByRoute,
      visiblePlanetReceiptObserved: state.visiblePlanetReceiptObserved,

      structuralCarrierReady: state.structuralCarrierReady,
      structuralCarrierSafe: state.structuralCarrierSafe,
      hearthCanvasStructuralCarrierSafe: state.structuralCarrierSafe,
      structuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      hearthCanvasStructuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      canvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      hearthCanvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      carrierHoldReason: state.carrierHoldReason,

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
      surfacePointerBishopObserved: state.surfacePointerBishopObserved,
      surfacePointerBishopAccepted: state.surfacePointerBishopAccepted,
      pointerFingerObserved: state.surfacePointerBishopObserved,
      inspectFingerObserved: state.inspectFingerObserved,
      inspectBishopObserved: state.inspectBishopObserved,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,
      degradedF13IsFunctional: state.degradedF13IsFunctional,
      strictVisualProofPending: state.strictVisualProofPending,
      functionalPageObserved: state.functionalPageObserved,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      booted: state.booted,
      mounted: state.mounted,
      updatedAt: state.updatedAt || nowIso(),
      publishedAt: state.publishedAt,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      currentReceipt: true,
      releasePacket: clonePlain(state.currentReleasePacket),
      currentReleasePacket: clonePlain(state.currentReleasePacket),
      structuralCarrier: getStructuralCarrier(),
      visiblePlanetReceipt: getVisiblePlanetReceipt(),
      fingerRegistry: clonePlain(state.fingerRegistry),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerSequence: FINGER_SEQUENCE.slice(),
      canvasApiAliases: CANVAS_API_ALIASES.slice(),
      releasePacketAliases: RELEASE_PACKET_ALIASES.slice(),
      releaseMethods: RELEASE_METHODS.slice(),
      bishopFingerMethods: BISHOP_FINGER_METHODS.slice(),
      surfacePointerAliases: SURFACE_POINTER_ALIASES.slice(),
      inspectAliases: INSPECT_ALIASES.slice(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      view: clonePlain(state.view),
      lastControlPacket: clonePlain(state.lastControlPacket),
      lastExpressionPacket: clonePlain(state.lastExpressionPacket),
      lastRenderAt: state.lastRenderAt,
      noClaimsPreserved: true,
      ...NO_CLAIMS
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_BISHOP_UNIVERSAL_ALIAS_ROOM_POINTER_SURFACE_ASSUMPTION_RECEIPT",
      "",
      "HEADER",
      line("timestamp", r.timestamp),
      line("roomVersion", r.roomVersion),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("file", r.file),
      line("route", r.route),
      line("showroomFile", r.showroomFile),
      "",
      "CANVAS_IDENTITY",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("canvasV123Recognized", r.canvasV123Recognized),
      line("canvasReceiverApiReady", r.canvasReceiverApiReady),
      line("canvasReceiveSurfaceReady", r.canvasReceiveSurfaceReady),
      line("expressionHubActive", r.expressionHubActive),
      line("fingerManagerActive", r.fingerManagerActive),
      "",
      "POINTER_LANGUAGE",
      line("showroomExpectedCorrect", r.showroomExpectedCorrect),
      line("stalePointerNormalizationEnabled", r.stalePointerNormalizationEnabled),
      line("stalePointerLanguageObserved", r.stalePointerLanguageObserved),
      line("showroomPointerLanguageMismatch", r.showroomPointerLanguageMismatch),
      line("showroomPointerLanguageAccepted", r.showroomPointerLanguageAccepted),
      line("pointerLanguageNormalized", r.pointerLanguageNormalized),
      line("pointerFingerKey", r.pointerFingerKey),
      line("pointerFingerFile", r.pointerFingerFile),
      line("inspectFingerKey", r.inspectFingerKey),
      line("inspectFingerFile", r.inspectFingerFile),
      line("pointerMismatchSource", r.pointerMismatchSource),
      line("pointerMismatchValue", r.pointerMismatchValue),
      line("pointerMismatchFile", r.pointerMismatchFile),
      "",
      "RELEASE",
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketSource", r.releasePacketSource),
      line("releasePacketAccepted", r.releasePacketAccepted),
      line("releasePacketHeldReason", r.releasePacketHeldReason),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      "",
      "VISIBLE_CARRIER",
      line("canvasMounted", r.canvasMounted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("baseGlobeVisibleCarrierReady", r.baseGlobeVisibleCarrierReady),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("structuralCarrierSafe", r.structuralCarrierSafe),
      line("canvasPreReleaseCarrierSafeForWest", r.canvasPreReleaseCarrierSafeForWest),
      line("carrierHoldReason", r.carrierHoldReason),
      "",
      "FINGERS",
      line("surfacePointerBishopObserved", r.surfacePointerBishopObserved),
      line("surfacePointerBishopAccepted", r.surfacePointerBishopAccepted),
      line("inspectFingerObserved", r.inspectFingerObserved),
      line("inspectBishopObserved", r.inspectBishopObserved),
      line("fingerAuthorityObservedCount", r.fingerAuthorityObservedCount),
      line("fingerApiReadyCount", r.fingerApiReadyCount),
      line("fingerTrackReadyCount", r.fingerTrackReadyCount),
      line("firstFingerGap", r.firstFingerGap),
      line("firstFingerGapFile", r.firstFingerGapFile),
      "",
      "F13",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("f21SubmittedToNorth", false),
      line("completionLatched", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasRoomVersion", ROOM_VERSION);
    setDataset("hearthCanvasFile", FILE);

    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasParentActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasMounted", String(state.canvasMounted));
    setDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));

    setDataset("hearthCanvasPointerFingerKey", POINTER_FINGER_KEY);
    setDataset("hearthCanvasPointerFingerFile", POINTER_FINGER_FILE);
    setDataset("hearthCanvasPointerBishopKey", POINTER_BISHOP_KEY);
    setDataset("hearthCanvasPointerBishopFile", POINTER_BISHOP_FILE);
    setDataset("hearthCanvasSurfacePointerBishopObserved", String(state.surfacePointerBishopObserved));
    setDataset("hearthCanvasSurfacePointerBishopAccepted", String(state.surfacePointerBishopAccepted));
    setDataset("hearthCanvasInspectFingerKey", INSPECT_FINGER_KEY);
    setDataset("hearthCanvasInspectFingerFile", INSPECT_FINGER_FILE);
    setDataset("hearthCanvasInspectBishopObserved", String(state.inspectBishopObserved));
    setDataset("hearthCanvasStalePointerLanguageObserved", String(state.stalePointerLanguageObserved));
    setDataset("hearthCanvasShowroomPointerLanguageMismatch", String(state.showroomPointerLanguageMismatch));
    setDataset("hearthCanvasPointerLanguageNormalized", "false");

    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.parentReleaseLawful));
    setDataset("hearthCanvasPreReleaseCarrierSafeForWest", String(state.canvasPreReleaseCarrierSafeForWest));
    setDataset("hearthCanvasStructuralCarrierSafe", String(state.structuralCarrierSafe));
    setDataset("hearthCanvasStructuralCarrierSafeForCanvasRelease", String(state.structuralCarrierSafeForCanvasRelease));
    setDataset("hearthCanvasCarrierHoldReason", state.carrierHoldReason);

    setDataset("hearthCanvasF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishCanvasApiAliases() {
    ensureNamespaces();
    for (const alias of CANVAS_API_ALIASES) writePath(alias, api);
    return true;
  }

  function publishReceiptAliases() {
    ensureNamespaces();

    const light = getReceiptLight(false);
    const full = getReceipt();

    writePath("HEARTH_CANVAS_RECEIPT", light);
    writePath("HEARTH_CANVAS_HUB_RECEIPT", light);
    writePath("HEARTH_CANVAS_PARENT_RECEIPT", light);
    writePath("HEARTH_CANVAS_LOCAL_STATION_RECEIPT", light);
    writePath("HEARTH_CANVAS_STATION_RECEIPT", light);
    writePath("HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT", light);
    writePath("HEARTH_CANVAS_FINGER_MANAGER_RECEIPT", light);
    writePath("HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT", getVisiblePlanetReceipt());
    writePath("HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT", getVisiblePlanetReceipt());
    writePath("HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT", full);

    writePath("HEARTH.canvasReceipt", light);
    writePath("HEARTH.canvasHubReceipt", light);
    writePath("HEARTH.canvasParentReceipt", light);
    writePath("HEARTH.canvasLocalStationReceipt", light);
    writePath("HEARTH.canvasStationReceipt", light);
    writePath("HEARTH.canvasExpressionHubReceipt", light);
    writePath("HEARTH.canvasFingerManagerReceipt", light);
    writePath("HEARTH.canvasVisibleBaseGlobeCarrierReceipt", getVisiblePlanetReceipt());
    writePath("HEARTH.canvasVisiblePlanetReceipt", getVisiblePlanetReceipt());

    writePath("DEXTER_LAB.hearthCanvasReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasHubReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasParentReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasLocalStationReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasStationReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasExpressionHubReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasFingerManagerReceipt", light);
    writePath("DEXTER_LAB.hearthCanvasVisiblePlanetReceipt", getVisiblePlanetReceipt());

    return true;
  }

  function publishReleaseAliases() {
    ensureNamespaces();

    if (state.currentReleasePacket) {
      writePath("HEARTH.canvasAcceptedReleasePacket", clonePlain(state.currentReleasePacket));
      writePath("HEARTH.canvasCurrentReleasePacket", clonePlain(state.currentReleasePacket));
      writePath("DEXTER_LAB.hearthCanvasAcceptedReleasePacket", clonePlain(state.currentReleasePacket));
      writePath("HEARTH_CANVAS_ACCEPTED_RELEASE_PACKET", clonePlain(state.currentReleasePacket));
      writePath("HEARTH_CANVAS_CURRENT_RELEASE_PACKET", clonePlain(state.currentReleasePacket));
    }

    return true;
  }

  function publishGlobals() {
    publishCanvasApiAliases();
    publishReleaseAliases();
    publishReceiptAliases();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function scheduleRepublish() {
    if (!root.setTimeout || republishTimer) return;

    republishTimer = root.setTimeout(() => {
      republishTimer = 0;
      updateDataset();
      publishGlobals();
    }, 120);
  }

  function boot(options = {}) {
    state.timestamp = state.timestamp || nowIso();

    ensureNamespaces();
    publishCanvasApiAliases();

    readFingerBishops();

    if (options.releasePacket && isObject(options.releasePacket)) {
      receiveReleaseEnvelope(options.releasePacket, "boot.options.releasePacket");
    } else if (options.routeConductorReleasePacket && isObject(options.routeConductorReleasePacket)) {
      receiveReleaseEnvelope(options.routeConductorReleasePacket, "boot.options.routeConductorReleasePacket");
    } else {
      readAmbientReleasePackets();
    }

    updateDerivedReadiness();
    updateDataset();
    publishGlobals();

    renderCanvas();

    state.booted = true;
    state.mounted = state.canvasMounted;

    record("CANVAS_BISHOP_BOOT_COMPLETE", {
      contract: CONTRACT,
      roomVersion: ROOM_VERSION,
      servedContractPreserved: true,
      showroomExpectedCorrect: true,
      pointerFingerKey: POINTER_FINGER_KEY,
      inspectFingerKey: INSPECT_FINGER_KEY,
      showroomPointerLanguageMismatch: state.showroomPointerLanguageMismatch,
      recommendedNextFile: state.recommendedNextFile
    });

    updateDataset();
    publishGlobals();
    scheduleRepublish();

    return getReceipt();
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function mount(options = {}) {
    return boot(options);
  }

  function refresh(options = {}) {
    readFingerBishops();

    if (options.releasePacket) receiveReleaseEnvelope(options.releasePacket, "refresh.options.releasePacket");
    else readAmbientReleasePackets();

    updateDerivedReadiness();
    renderCanvas();
    updateDataset();
    publishGlobals();

    return getReceiptLight(false);
  }

  for (const method of RELEASE_METHODS) {
    api[method] = function releaseMethod(packet = {}) {
      return receiveReleaseEnvelope(packet, method);
    };
  }

  for (const method of BISHOP_FINGER_METHODS) {
    api[method] = function bishopFingerMethod(packet = {}) {
      return receiveExpressionAuthorityPacket(packet, method);
    };
  }

  Object.assign(api, {
    ROOM_VERSION,
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_CONTRACT,
    LINEAGE_V11_7_CONTRACT,
    LINEAGE_V11_6_CONTRACT,

    contract: CONTRACT,
    receipt: RECEIPT,
    roomVersion: ROOM_VERSION,
    file: FILE,
    route: ROUTE,
    showroomFile: SHOWROOM_FILE,
    queenFile: QUEEN_FILE,
    westFile: WEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    POINTER_FINGER_KEY,
    POINTER_FINGER_FILE,
    POINTER_BISHOP_KEY,
    POINTER_BISHOP_FILE,
    INSPECT_FINGER_KEY,
    INSPECT_FINGER_FILE,
    INSPECT_BISHOP_KEY,
    INSPECT_BISHOP_FILE,

    pointerFingerKey: POINTER_FINGER_KEY,
    pointerFingerFile: POINTER_FINGER_FILE,
    pointerBishopKey: POINTER_BISHOP_KEY,
    pointerBishopFile: POINTER_BISHOP_FILE,
    inspectFingerKey: INSPECT_FINGER_KEY,
    inspectFingerFile: INSPECT_FINGER_FILE,
    inspectBishopKey: INSPECT_BISHOP_KEY,
    inspectBishopFile: INSPECT_BISHOP_FILE,

    FINGER_FILES,
    FINGER_SEQUENCE,
    CANVAS_API_ALIASES,
    RELEASE_PACKET_ALIASES,
    SURFACE_POINTER_ALIASES,
    INSPECT_ALIASES,
    RELEASE_METHODS,
    BISHOP_FINGER_METHODS,

    boot,
    init,
    start,
    mount,
    refresh,
    render: renderCanvas,
    redraw: renderCanvas,
    scheduleRender,

    receiveReleaseEnvelope,
    receiveExpressionAuthorityPacket,
    receiveControlPacket,
    receiveControlsPacket: (packet = {}) => receiveControlPacket(packet, "receiveControlsPacket"),
    receiveControlHandshake: (packet = {}) => receiveControlPacket(packet, "receiveControlHandshake"),
    receiveQueenControlHandshake: (packet = {}) => receiveControlPacket(packet, "receiveQueenControlHandshake"),
    receivePlanetaryViewPacket: (packet = {}) => receiveControlPacket(packet, "receivePlanetaryViewPacket"),
    receivePlanetaryViewControlPacket: (packet = {}) => receiveControlPacket(packet, "receivePlanetaryViewControlPacket"),
    receiveViewPacket: (packet = {}) => receiveControlPacket(packet, "receiveViewPacket"),
    setViewTransform: (packet = {}) => receiveControlPacket(packet, "setViewTransform"),
    applyViewTransform: (packet = {}) => receiveControlPacket(packet, "applyViewTransform"),

    readFingerBishops,
    pointerLanguageFromPacket,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,

    getVisiblePlanetReceipt,
    getVisibleGlobeReceipt,
    getVisibleBaseGlobeReceipt,
    getBaseGlobeReceipt,
    getCanvasVisibleProofReceipt,

    getCanvasStationSummary,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getExpressionHubSummary,
    getExpressionHubReceipt,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    getStatus,
    getReport,
    getState,

    updateDataset,
    publishGlobals,
    publishCanvasApiAliases,
    publishReceiptAliases,
    publishReleaseAliases,

    supportsUniversalAliasRoom: true,
    supportsCurrentCanvasV123Recognition: true,
    supportsServedContractPreservation: true,
    supportsCanvasReleasePacketComposition: true,
    supportsRouteConductorReleasePacketConsumption: true,
    supportsWestReleasePacketConsumption: true,
    supportsSurfacePointerBishopRecognition: true,
    supportsInspectBishopRecognition: true,
    supportsPointerSurfaceAssumption: true,
    supportsShowroomPointerMismatchEscalation: true,
    supportsStalePointerNormalization: false,
    supportsCanvasExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsVisibleBaseGlobeCarrier: true,
    supportsStructuralCarrierReceipt: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsCanvasBishopIdentity: true,
    ownsCanvasReceiverOutputCarrier: true,
    ownsCanvasExpressionHubAliasRoom: true,
    ownsCanvasFingerManagerAliasRoom: true,
    ownsCanvasVisibleCarrier: true,
    ownsShowroomTruth: false,
    ownsWestAdmissibilityTruth: false,
    ownsQueenBehavior: false,
    ownsSurfacePointerBishop: false,
    ownsInspectBishop: false,
    ownsFingerTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    ensureNamespaces();
    publishCanvasApiAliases();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({}), { once: true });
      } else {
        boot({});
      }
    } else {
      boot({});
    }
  } catch (error) {
    recordError("CANVAS_BISHOP_INITIALIZATION_FAILED", error);

    try {
      updateDerivedReadiness();
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
