// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal renewal:
// HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE_TNT_v12_3_3
// Full-file replacement.
// Canvas Hub / Hex Surface projection-anchor receiver / throttled interactive bridge.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by Route Conductor, diagnostics, Controls, and Hex Surface.
// - Treat Hex Surface v4 as the projection anchor and Hex Four-Pair Authority as the source/addressing anchor.
// - Explicitly recognize the actual Hex Surface v4 contract:
//   HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4.
// - Preserve compatibility with the earlier paired-name expectation:
//   HEARTH_HEX_SURFACE_CANVAS_HUB_SPHERE_ROTATION_PAIR_RENDERER_TNT_v4.
// - Bind or create the real DOM canvas surface inside #hearthCanvasMount.
// - Receive view-control packets from Controls through public Canvas APIs only.
// - Treat touch/drag/wheel/keyboard motion as spherical view-state change, never as bitmap translation.
// - Schedule one interactive rAF draw per frame and one deferred settled draw after input settles.
// - Avoid remounting, pixel sampling, full receipt publication, and route notification during active drag frames.
// - Do not invert vertical polarity here; Canvas preserves incoming pitch/yaw semantics from Controls.
// - Preserve immediate visible planet proof with a spherical 2D fallback if Hex Surface is unavailable.
// - Preserve Canvas as receiver/output carrier only.
// - Preserve no F13 claim, no F21 latch, no ready text, no final visual pass, no generated image,
//   no GraphicBox, and no WebGL.
// Does not own:
// - HTML shell
// - index/button authority
// - route orchestration
// - control-file admission
// - control runtime truth
// - pointer polarity truth
// - Hex Four-Pair truth
// - Hex Surface truth
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - atmosphere truth
// - lighting truth
// - diagnostic rail case selection
// - F13 claim
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE_TNT_v12_3_3";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE_RECEIPT_v12_3_3";

  const PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_RECEIPT_v12_3_2";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_RECEIPT_v12_2";

  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_1_RECEIPT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT_v12_1";

  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_V12_RECEIPT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12";

  const VERSION =
    "2026-06-06.hearth-canvas-hub-hex-surface-anchor-receiver-throttled-interactive-v12-3-3";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const HEX_SURFACE_ACTUAL_V4_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const HEX_SURFACE_ACTUAL_V4_RECEIPT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT_v4";

  const HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_HUB_SPHERE_ROTATION_PAIR_RENDERER_TNT_v4";
  const HEX_SURFACE_EXPECTED_PAIR_V4_RECEIPT =
    "HEARTH_HEX_SURFACE_CANVAS_HUB_SPHERE_ROTATION_PAIR_RENDERER_RECEIPT_v4";

  const HEX_SURFACE_V3_CONTRACT =
    "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE_TNT_v3";
  const HEX_SURFACE_V2_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const HEX_SURFACE_V1_CONTRACT =
    "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";

  const HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const HEX_AUTHORITY_RECEIPT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT_v1";

  const PLANET_ID = "hearth";
  const PLANET_LABEL = "Hearth";
  const MOUNT_SELECTOR = "#hearthCanvasMount";
  const STAGE_SELECTOR = "#hearthGlobeStage";
  const CANVAS_ID = "hearthCanvasSurface";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const INTERACTIVE_SETTLE_DELAY_MS = 150;
  const FULL_RECEIPT_THROTTLE_MS = 520;
  const INTERACTIVE_FALLBACK_SIDE = 360;
  const SETTLED_FALLBACK_SIDE = 660;

  const ACCEPTED_HEX_SURFACE_CONTRACTS = Object.freeze([
    HEX_SURFACE_ACTUAL_V4_CONTRACT,
    HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT,
    HEX_SURFACE_V3_CONTRACT,
    HEX_SURFACE_V2_CONTRACT,
    HEX_SURFACE_V1_CONTRACT
  ]);

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13ClaimedByCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const COLORS = Object.freeze({
    abyss: [2, 9, 27, 255],
    deep: [5, 28, 70, 255],
    ocean: [8, 69, 126, 255],
    shelf: [30, 128, 148, 255],
    foam: [116, 184, 174, 255],
    landLow: [86, 116, 70, 255],
    landWarm: [144, 128, 76, 255],
    landWet: [38, 104, 66, 255],
    ridge: [92, 88, 78, 255],
    granite: [140, 132, 118, 255],
    snow: [218, 230, 228, 255]
  });

  const BODY_MASSES = Object.freeze([
    { key: "north-crown", lat: 74 * DEG, lon: -18 * DEG, rx: 40 * DEG, ry: 13 * DEG, angle: -10 * DEG },
    { key: "great-equatorial-body", lat: 4 * DEG, lon: -12 * DEG, rx: 68 * DEG, ry: 28 * DEG, angle: -8 * DEG },
    { key: "northwest-temperate-body", lat: 41 * DEG, lon: -108 * DEG, rx: 34 * DEG, ry: 18 * DEG, angle: 26 * DEG },
    { key: "northeast-broken-shelf", lat: 33 * DEG, lon: 104 * DEG, rx: 35 * DEG, ry: 16 * DEG, angle: -24 * DEG },
    { key: "southeast-warm-body", lat: -24 * DEG, lon: 142 * DEG, rx: 40 * DEG, ry: 20 * DEG, angle: 18 * DEG },
    { key: "southwest-ridge-body", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG },
    { key: "south-transition-body", lat: -58 * DEG, lon: 36 * DEG, rx: 42 * DEG, ry: 14 * DEG, angle: 9 * DEG }
  ]);

  const api = {};

  const refs = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null
  };

  const scratch = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0
  };

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV121Receipt: LINEAGE_V12_1_RECEIPT,
    lineageV12Contract: LINEAGE_V12_CONTRACT,
    lineageV12Receipt: LINEAGE_V12_RECEIPT,
    version: VERSION,

    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,

    role: "canvas-hub-hex-surface-anchor-receiver-throttled-interactive",
    planetId: PLANET_ID,
    planetLabel: PLANET_LABEL,

    bootStarted: false,
    bootComplete: false,
    bootCount: 0,
    startedAt: "",
    updatedAt: "",

    canvasHubActive: true,
    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,
    compositeFirstVisiblePathActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    childDistributionSwitchboardActive: true,
    routeConductorSummarySurfaceActive: true,

    mountPresent: false,
    stagePresent: false,
    canvasElementFound: false,
    canvasCreatedByHub: false,
    canvasInMount: false,
    canvasMounted: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectNonzero: false,
    canvasContext2dReady: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,

    hexSurfaceProjectionAnchorActive: true,
    hexFourPairSourceAnchorActive: true,
    actualHexSurfaceV4RecognizedByName: false,
    legacyPairHexSurfaceV4RecognizedByName: false,
    pairedHexSurfaceExpected: true,
    pairedHexSurfaceObserved: false,
    pairedHexSurfaceContract: "UNKNOWN",
    pairedHexSurfaceReceipt: "UNKNOWN",
    pairedHexSurfaceRecognized: false,
    pairedHexSurfaceApiReady: false,

    bitmapSlidingUsed: false,
    cssTranslationUsed: false,
    canvasTransformMotionUsed: false,
    priorFrameTranslationUsed: false,
    interactiveSphereRecomputeUsed: false,
    interactiveSphereProjectionRecomputed: false,
    settledSphereProjectionRecomputed: false,
    verticalPolarityCorrectedByCanvas: false,
    pointerPolarityOwnedByControls: true,

    rafSchedulerActive: true,
    requestAnimationFrameAvailable: false,
    motionUsesRequestAnimationFrame: true,
    setTimeout40MotionPathRemoved: true,
    fullHexRenderDeferredDuringInput: true,
    datasetPublicationThrottledDuringMotion: true,
    receiptPublicationThrottledDuringMotion: true,
    routeNotifySuppressedDuringInteractiveMotion: true,
    pixelSamplingSuppressedDuringInteractiveMotion: true,
    mountSuppressedDuringInteractiveMotion: true,
    inputSettleDelayMs: INTERACTIVE_SETTLE_DELAY_MS,

    drawCount: 0,
    interactiveDrawCount: 0,
    settledDrawCount: 0,
    fallbackDrawCount: 0,
    hexDrawCount: 0,
    lastDrawAt: "",
    lastDrawReason: "NOT_RUN",
    lastDrawOk: false,
    lastDrawMode: "NONE",
    lastDrawError: "",
    lastInteractiveDrawMethod: "NONE",
    lastSettledDrawMethod: "NONE",
    lastPairDrawMethod: "NONE",
    lastRenderWidth: 0,
    lastRenderHeight: 0,
    lastDrawSamples: 0,
    canvasDrawComplete: false,
    baseGlobeDrawComplete: false,
    holdingFieldDrawComplete: false,
    rendererDrawComplete: false,

    canvasPixelSampleStatus: "NOT_RUN",
    canvasPixelSampleReadable: false,
    canvasPixelNonempty: false,
    canvasPixelUniqueColorCount: 0,
    canvasPixelVarianceStatus: "NOT_RUN",
    canvasPixelVisible: false,
    canvasVisiblePixelCount: 0,
    canvasAlphaPixelCount: 0,

    visiblePlanetProofReady: false,
    domVisiblePlanetProofReady: false,
    currentVisibleProofValid: false,
    visiblePlanetProofSource: "NONE",
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,

    hexAuthorityObserved: false,
    hexAuthorityContract: "UNKNOWN",
    hexAuthorityReceipt: "UNKNOWN",
    hexAuthorityRecognized: false,
    hexAuthorityWideProbeReady: false,
    hexAuthorityWideProbeFailedCount: "UNKNOWN",

    dependencyScriptAdmissionAttempted: false,
    dependencyScriptAdmissionStatus: "NOT_RUN",
    dependencyScriptAdmissionReason: "NOT_RUN",
    dependencyScriptLoadError: "",

    routeConductorObserved: false,
    routeConductorNotifyCount: 0,
    routeConductorNotifyMethod: "NONE",
    routeConductorNotifyStatus: "NOT_RUN",

    releasePacketObserved: false,
    releasePacketAccepted: false,
    releasePacketLawful: false,
    releasePacketCount: 0,
    releasePacketLastAt: "",
    releasePacketLastSource: "NONE",
    canvasParentReleaseAccepted: false,
    canvasParentReleaseLawful: false,
    parentAcceptedRouteConductorRelease: false,
    parentReleasePacketLawful: false,

    viewStateAccepted: true,
    viewStateSource: "DEFAULT_VIEW_STATE",
    viewYaw: 0,
    viewPitch: 0,
    viewZoom: 1,
    viewPhase: 0,
    canonicalRotationYaw: 0,
    renderedYaw: 0,
    renderedPitch: 0,
    renderedZoom: 1,
    renderedPhase: 0,
    viewStatePacketCount: 0,
    viewStateLastAcceptedAt: "",
    viewStateRejectedCount: 0,
    viewStateRejectionReason: "",
    lastControlPacketType: "NONE",
    lastControlInputType: "NONE",

    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    firstFingerGap: "STRICT_FINGER_BISHOP_EVIDENCE_NOT_YET_WIRED",
    firstFingerGapFile: "/assets/hearth/hearth.canvas.finger.inspect.js",
    nextFingerKey: "inspect",
    nextFingerFile: "/assets/hearth/hearth.canvas.finger.inspect.js",
    pointerFingerObserved: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_MOUNTED_CANVAS_SURFACE",
    f13StrictEvidenceRepairTarget: "/assets/hearth/hearth.canvas.finger.inspect.js",

    receiptPublishCount: 0,
    datasetPublishCount: 0,
    lightDatasetPublishCount: 0,
    localEvents: [],
    errors: [],

    ownsCanvasDrawing: true,
    ownsCanvasMounting: true,
    ownsCanvasSurfaceReception: true,
    ownsCanvasOutputCarrier: true,
    ownsHtmlShell: false,
    ownsIndexButtonAuthority: false,
    ownsRouteConductorAuthority: false,
    ownsControlAdmission: false,
    ownsControlTruth: false,
    ownsControlPolarityTruth: false,
    ownsHexTruth: false,
    ownsHexSurfaceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsDiagnosticRailCaseSelection: false,

    ...FINAL_FALSE
  };

  let interactiveRaf = 0;
  let settledTimer = 0;
  let routeNotifyTimer = 0;
  let dependencyPromise = null;
  let resizeBound = false;
  let lastFullPublishMs = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    try {
      return Date.now();
    } catch (_error) {
      return 0;
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

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const number = safeNumber(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents, 140);
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
    trimLog(state.errors, 80);
    state.updatedAt = item.at;
    return item;
  }

  function q(selector) {
    if (!doc) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector) {
    if (!doc) return [];

    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
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

  function firstGlobal(names) {
    for (const name of names) {
      const value = readPath(name);
      if (value) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setNodeDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function contractOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.canvasContract ||
      value.currentCanvasParentContract ||
      value.sourceContract ||
      value.hexSurfaceContract ||
      value.hexAuthorityContract ||
      "",
      ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.canvasReceipt ||
      value.currentCanvasParentReceipt ||
      value.sourceReceipt ||
      value.hexSurfaceReceipt ||
      value.hexAuthorityReceipt ||
      "",
      ""
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getCanvasVisibleProofReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function scheduleAnimationFrame(callback) {
    state.requestAnimationFrameAvailable = isFunction(root.requestAnimationFrame);

    if (isFunction(root.requestAnimationFrame)) return root.requestAnimationFrame(callback);
    if (isFunction(root.setTimeout)) return root.setTimeout(() => callback(nowMs()), 16);

    callback(nowMs());
    return 0;
  }

  function cancelAnimationFrameSafe(id) {
    if (!id) return;

    try {
      if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(id);
      else if (isFunction(root.clearTimeout)) root.clearTimeout(id);
    } catch (_error) {}
  }

  function scriptByPath(path) {
    if (!doc) return null;

    const scripts = qa("script[src]");

    for (const script of scripts) {
      const src = safeString(script.getAttribute("src"), "");

      try {
        const url = new URL(
          src,
          root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com"
        );

        if (url.pathname === path || url.pathname.endsWith(path)) return script;
      } catch (_error) {
        if (src.includes(path)) return script;
      }
    }

    return null;
  }

  function resolveHexSurface() {
    const found = firstGlobal([
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
      "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
      "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",

      "HEARTH_HEX_SURFACE_CANVAS_HUB_SPHERE_ROTATION_PAIR_RENDERER",
      "HEARTH_HEX_SURFACE_PAIR_RENDERER",
      "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER",
      "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER_HANDSHAKE",
      "HEARTH_HEX_SURFACE_RENDERER",
      "HEARTH_HEX_SURFACE",

      "HEARTH.hexSurfaceCanvasHubSphereRotationPairRenderer",
      "HEARTH.hexSurfacePairRenderer",
      "HEARTH.hexSurfacePlanetaryViewControlRenderer",
      "HEARTH.hexSurfaceRenderer",
      "HEARTH.hexSurface",

      "DEXTER_LAB.hearthHexSurfaceCanvasHubSphereRotationPairRenderer",
      "DEXTER_LAB.hearthHexSurfacePairRenderer",
      "DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer",
      "DEXTER_LAB.hearthHexSurfaceRenderer",
      "DEXTER_LAB.hearthHexSurface"
    ]);

    if (found.value === api) return null;
    return found.value;
  }

  function resolveHexAuthority() {
    return firstGlobal([
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_HANDSHAKE_AUTHORITY",
      "HEARTH_HEXGRID_AUTHORITY",
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hexAuthority",
      "DEXTER_LAB.hearthHexFourPairAuthority",
      "DEXTER_LAB.hearthHexAuthority"
    ]).value;
  }

  function resolveRouteConductor() {
    return firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductor",
      "HEARTH.routeNorthBishop",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteNorthBishop"
    ]).value;
  }

  function validateHexAuthority() {
    const authority = resolveHexAuthority();
    const receipt = readAuthorityReceipt(authority) || authority || {};
    const contract =
      contractOf(receipt || authority) ||
      datasetValue("hearthHexFourPairAuthorityContract") ||
      datasetValue("hearthHexAuthorityContract") ||
      "UNKNOWN";
    const receiptName =
      receiptOf(receipt || authority) ||
      datasetValue("hearthHexFourPairAuthorityReceipt") ||
      "UNKNOWN";

    state.hexAuthorityObserved = Boolean(authority || contract !== "UNKNOWN");
    state.hexAuthorityContract = contract;
    state.hexAuthorityReceipt = receiptName;
    state.hexAuthorityRecognized = contract === HEX_AUTHORITY_CONTRACT;

    if (authority && isFunction(authority.wideProbe)) {
      try {
        const probe = authority.wideProbe({
          rows: 5,
          columns: 9,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          purpose: "canvas-anchor-validation",
          ...FINAL_FALSE
        });

        state.hexAuthorityWideProbeReady = Boolean(probe && probe.wideProbeReady === true);
        state.hexAuthorityWideProbeFailedCount = String(
          probe && probe.failedCount !== undefined ? probe.failedCount : "UNKNOWN"
        );
      } catch (_error) {}
    }

    return {
      authority,
      contract,
      receipt: receiptName,
      observed: state.hexAuthorityObserved,
      recognized: state.hexAuthorityRecognized,
      wideProbeReady: state.hexAuthorityWideProbeReady
    };
  }

  function validateHexSurface() {
    const renderer = resolveHexSurface();
    const receipt = readAuthorityReceipt(renderer) || renderer || {};
    const contract =
      contractOf(receipt || renderer) ||
      datasetValue("hearthHexSurfaceRendererContract") ||
      datasetValue("hearthHexSurfaceContract") ||
      "UNKNOWN";
    const receiptName =
      receiptOf(receipt || renderer) ||
      datasetValue("hearthHexSurfaceRendererReceipt") ||
      "UNKNOWN";

    const apiReady = Boolean(
      renderer &&
      (
        isFunction(renderer.drawInteractiveFrame) ||
        isFunction(renderer.drawSettledFrame) ||
        isFunction(renderer.drawPairFrame) ||
        isFunction(renderer.drawHearthHexSurfaceFrame) ||
        isFunction(renderer.drawFrame) ||
        isFunction(renderer.renderFrame) ||
        isFunction(renderer.render)
      )
    );

    state.pairedHexSurfaceObserved = Boolean(renderer || contract !== "UNKNOWN");
    state.pairedHexSurfaceContract = contract;
    state.pairedHexSurfaceReceipt = receiptName;
    state.pairedHexSurfaceRecognized =
      ACCEPTED_HEX_SURFACE_CONTRACTS.includes(contract) ||
      safeString(contract).includes("HEARTH_HEX_SURFACE");
    state.pairedHexSurfaceApiReady = apiReady;
    state.actualHexSurfaceV4RecognizedByName = contract === HEX_SURFACE_ACTUAL_V4_CONTRACT;
    state.legacyPairHexSurfaceV4RecognizedByName = contract === HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT;

    return {
      renderer,
      contract,
      receipt: receiptName,
      observed: state.pairedHexSurfaceObserved,
      recognized: state.pairedHexSurfaceRecognized,
      apiReady
    };
  }

  function refreshRefs() {
    refs.stage =
      q(STAGE_SELECTOR) ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]");

    refs.mount =
      q(MOUNT_SELECTOR) ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]");

    refs.canvas =
      q(`#${CANVAS_ID}`) ||
      q("canvas[data-hearth-visible-canvas='true']") ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-canvas-texture='true']") ||
      q("canvas[data-hearth-planet-canvas='true']");

    state.stagePresent = Boolean(refs.stage);
    state.mountPresent = Boolean(refs.mount);
    state.canvasElementFound = Boolean(refs.canvas);

    return refs;
  }

  function ensureMount() {
    refreshRefs();

    if (refs.mount) return refs.mount;
    if (!doc || !doc.body) return null;

    const parent = refs.stage || doc.body;
    const mount = doc.createElement("div");

    mount.id = "hearthCanvasMount";
    mount.setAttribute("data-hearth-canvas-mount", "true");
    mount.setAttribute("data-hearth-visible-planet-mount", "true");
    mount.setAttribute("data-hearth-canvas-mount-created-by", CONTRACT);

    parent.appendChild(mount);

    refs.mount = mount;
    state.mountPresent = true;

    return mount;
  }

  function applyMountStyle(mount) {
    if (!mount || !mount.style) return;

    mount.style.position = mount.style.position || "relative";
    mount.style.display = "grid";
    mount.style.placeItems = "center";
    mount.style.width = mount.style.width || "100%";
    mount.style.minHeight = mount.style.minHeight || "360px";
    mount.style.pointerEvents = "auto";
    mount.style.overflow = "visible";

    setNodeDataset(mount, "hearthCanvasMount", "true");
    setNodeDataset(mount, "hearthVisiblePlanetMount", "true");
    setNodeDataset(mount, "hearthCanvasHubContract", CONTRACT);
  }

  function ensureCanvasSurface() {
    const mount = ensureMount();
    if (!mount || !doc) return null;

    applyMountStyle(mount);
    refreshRefs();

    let canvas = refs.canvas;

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.id = CANVAS_ID;
      canvas.setAttribute("aria-label", "Hearth mounted planet surface");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-created-by", CONTRACT);
      mount.appendChild(canvas);
      state.canvasCreatedByHub = true;
    }

    canvas.style.display = "block";
    canvas.style.width = "min(100%, 860px)";
    canvas.style.maxWidth = "860px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.height = "auto";
    canvas.style.minHeight = "320px";
    canvas.style.borderRadius = "50%";
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.transform = "none";

    setNodeDataset(canvas, "hearthVisibleCanvas", "true");
    setNodeDataset(canvas, "hearthCanvasHub", "true");
    setNodeDataset(canvas, "hearthCanvas", "true");
    setNodeDataset(canvas, "hearthCanvasTexture", "true");
    setNodeDataset(canvas, "hearthPlanetCanvas", "true");
    setNodeDataset(canvas, "hearthCanvasContract", CONTRACT);
    setNodeDataset(canvas, "hearthCanvasReceipt", RECEIPT);
    setNodeDataset(canvas, "hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setNodeDataset(canvas, "hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setNodeDataset(canvas, "hearthCanvasFile", FILE);
    setNodeDataset(canvas, "hearthCanvasBitmapSlidingUsed", "false");
    setNodeDataset(canvas, "hearthCanvasCssTranslationUsed", "false");
    setNodeDataset(canvas, "hearthCanvasTransformMotionUsed", "false");
    setNodeDataset(canvas, "hearthCanvasPriorFrameTranslationUsed", "false");
    setNodeDataset(canvas, "hearthCanvasPointerPolarityOwnedByControls", "true");
    setNodeDataset(canvas, "hearthCanvasVerticalPolarityCorrectedByCanvas", "false");
    setNodeDataset(canvas, "generatedImage", "false");
    setNodeDataset(canvas, "graphicBox", "false");
    setNodeDataset(canvas, "webgl", "false");
    setNodeDataset(canvas, "visualPassClaimed", "false");

    refs.canvas = canvas;
    state.canvasElementFound = true;
    state.canvasInMount = Boolean(mount.contains(canvas));
    state.canvasMounted = state.canvasInMount;

    state.bitmapSlidingUsed = false;
    state.cssTranslationUsed = false;
    state.canvasTransformMotionUsed = false;
    state.priorFrameTranslationUsed = false;

    return canvas;
  }

  function getContext2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) return null;

    try {
      return canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_error) {
      try {
        return canvas.getContext("2d");
      } catch (__error) {
        return null;
      }
    }
  }

  function updateCanvasRectState(canvas) {
    state.canvasWidth = safeNumber(canvas && canvas.width, state.canvasWidth);
    state.canvasHeight = safeNumber(canvas && canvas.height, state.canvasHeight);

    try {
      const rect = canvas && isFunction(canvas.getBoundingClientRect)
        ? canvas.getBoundingClientRect()
        : null;

      state.canvasRectNonzero = Boolean(rect && rect.width > 0 && rect.height > 0);
      state.canvasComputedVisible = Boolean(rect && rect.width > 0 && rect.height > 0);
      state.canvasViewportIntersecting = Boolean(
        rect &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (root.innerHeight || rect.bottom) &&
        rect.left <= (root.innerWidth || rect.right)
      );
    } catch (_error) {
      state.canvasRectNonzero = true;
      state.canvasComputedVisible = true;
      state.canvasViewportIntersecting = true;
    }
  }

  function sizeCanvasToMount(canvas, force = false) {
    if (!canvas) return false;

    const mount = refs.mount || ensureMount();
    let cssSide = 720;

    try {
      const mountRect = mount && isFunction(mount.getBoundingClientRect)
        ? mount.getBoundingClientRect()
        : null;
      const canvasRect = isFunction(canvas.getBoundingClientRect)
        ? canvas.getBoundingClientRect()
        : null;

      const candidate = Math.max(
        320,
        safeNumber(mountRect && mountRect.width, 0),
        safeNumber(canvasRect && canvasRect.width, 0),
        safeNumber(canvas.clientWidth, 0),
        720
      );

      cssSide = clamp(candidate, 320, 960);
    } catch (_error) {
      cssSide = 720;
    }

    const dpr = clamp(root.devicePixelRatio || 1, 1, 1.75);
    const pixelSide = Math.max(320, Math.round(cssSide * dpr));

    if (!force && canvas.width === pixelSide && canvas.height === pixelSide) {
      updateCanvasRectState(canvas);
      return true;
    }

    canvas.width = pixelSide;
    canvas.height = pixelSide;

    state.canvasWidth = canvas.width;
    state.canvasHeight = canvas.height;

    updateCanvasRectState(canvas);
    return true;
  }

  function ensureCanvasReady(reason = "ensure-canvas-ready", forceSize = false) {
    const canvas = refs.canvas || ensureCanvasSurface();
    if (!canvas) return false;

    if (!refs.ctx) refs.ctx = getContext2d(canvas);

    state.canvasContext2dReady = Boolean(refs.ctx);
    state.canvasElementFound = Boolean(canvas);
    state.canvasInMount = Boolean(refs.mount && refs.mount.contains(canvas));
    state.canvasMounted = state.canvasInMount;

    if (forceSize || !canvas.width || !canvas.height) sizeCanvasToMount(canvas, true);
    else updateCanvasRectState(canvas);

    if (refs.ctx) {
      state.visibleBaseGlobeCarrierActive = true;
      state.canvasVisibleBaseGlobeCarrierActive = true;
      state.baseGlobeVisibleCarrierReady = true;
      state.visibleGlobeCarrierReady = true;
      state.f13CanvasReadinessObserved = true;
      state.f13StrictEvidenceGap = "STRICT_FINGER_BISHOP_EVIDENCE_NOT_YET_WIRED";
    }

    setNodeDataset(canvas, "hearthCanvasEnsureReason", reason);

    return Boolean(canvas && refs.ctx);
  }

  function mountCanvas(reason = "mountCanvas") {
    const ready = ensureCanvasReady(reason, true);

    publishDatasetThrottled(true);

    record("CANVAS_SURFACE_MOUNTED_OR_BOUND", {
      reason,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      verticalPolarityCorrectedByCanvas: false
    });

    return ready ? getCanvasStationReceiptLight(false) : getCanvasStationReceiptLight(false);
  }

  function norm3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return { x: x / length, y: y / length, z: z / length };
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
  }

  function vectorToCoordinate(v) {
    const n = norm3(v.x, v.y, v.z);
    const lon = Math.atan2(n.x, n.z);
    const lat = Math.asin(clamp(n.y, -1, 1));

    return {
      x: n.x,
      y: n.y,
      z: n.z,
      lon,
      lat,
      lonDegrees: lon / DEG,
      latDegrees: lat / DEG,
      u: wrap01((lon / DEG + 180) / 360),
      v: clamp01((90 - lat / DEG) / 180)
    };
  }

  function hash2(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.54;
    let frequency = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2.03;
    }

    return total / Math.max(0.000001, norm);
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);

    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k)),
      Math.round(lerp(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], k))
    ];
  }

  function multiplyColor(color, amount) {
    const k = clamp(amount, 0, 2);

    return [
      clamp(Math.round(color[0] * k), 0, 255),
      clamp(Math.round(color[1] * k), 0, 255),
      clamp(Math.round(color[2] * k), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function landField(coord) {
    let best = {
      field: -999,
      coast: 0,
      ridge: 0,
      basin: 0,
      mineral: 0,
      massKey: "ocean"
    };

    for (let i = 0; i < BODY_MASSES.length; i += 1) {
      const mass = BODY_MASSES[i];
      const dx = wrapPi(coord.lon - mass.lon) * Math.cos(mass.lat);
      const dy = coord.lat - mass.lat;
      const ca = Math.cos(mass.angle);
      const sa = Math.sin(mass.angle);
      const x = dx * ca - dy * sa;
      const y = dx * sa + dy * ca;
      const nx = x / mass.rx;
      const ny = y / mass.ry;
      const theta = Math.atan2(ny, nx);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const angularCut =
        Math.sin(theta * (5 + i) + i * 0.71) * 0.055 +
        Math.sin(theta * (9 + i) - i * 0.43) * 0.038;

      const fracture =
        (fbm(coord.u * 18 + i * 3.1, coord.v * 12 - i * 2.4, 710 + i * 53, 4) - 0.5) * 0.22;
      const bayCut =
        smoothstep(0.58, 0.92, fbm(coord.u * 36 - i * 2.7, coord.v * 26 + i * 4.2, 910 + i * 79, 3)) * 0.11;
      const field = 1 - dist + angularCut + fracture - bayCut;

      if (field > best.field) {
        best = {
          field,
          coast: smoothstep(0, 0.88, 1 - clamp(Math.abs(field) * 16, 0, 1)),
          ridge: smoothstep(0.44, 0.91, fbm(coord.u * 12 + i, coord.v * 15 - i, 1200 + i * 41, 4)),
          basin: smoothstep(0.10, 0.38, 1 - fbm(coord.u * 12 + i, coord.v * 15 - i, 1300 + i * 41, 3)),
          mineral: smoothstep(0.62, 0.96, fbm(coord.u * 44 + i * 2, coord.v * 41 - i * 3, 1500 + i * 83, 3)),
          massKey: mass.key
        };
      }
    }

    return best;
  }

  function fallbackSurfaceColor(coord, shade, edgeFactor, quality) {
    const field = landField(coord);
    const isLand = field.field > 0;
    const latAbs = Math.abs(coord.latDegrees) / 90;
    const grain = fbm(coord.u * 32, coord.v * 24, 2200, quality === "interactive" ? 3 : 4);
    const cold = smoothstep(0.68, 0.98, latAbs);
    const shelf = !isLand ? smoothstep(-0.24, 0.04, field.field) * (0.45 + grain * 0.35) : 0;
    const deep = !isLand ? clamp01(1 - shelf * 0.72) : 0;
    const relief = isLand ? clamp01(field.ridge * 0.76 + grain * 0.24) : 0;
    const arid = isLand ? smoothstep(0.62, 0.88, fbm(coord.u * 7, coord.v * 5, 2500, 3)) * (1 - cold * 0.4) : 0;
    const wet = isLand ? smoothstep(0.50, 0.86, fbm(coord.u * 9 + 8, coord.v * 8 - 4, 2600, 3)) * (1 - arid * 0.45) : 0;

    let color;

    if (isLand) {
      color = COLORS.landLow.slice();
      color = mixColor(color, COLORS.landWarm, arid * 0.42);
      color = mixColor(color, COLORS.landWet, wet * 0.38);
      color = mixColor(color, COLORS.ridge, relief * 0.34);
      color = mixColor(color, COLORS.granite, relief * relief * 0.30);
      color = mixColor(color, COLORS.snow, cold * relief * 0.48);
    } else {
      color = COLORS.ocean.slice();
      color = mixColor(color, COLORS.deep, deep * 0.55);
      color = mixColor(color, COLORS.abyss, deep * deep * 0.36);
      color = mixColor(color, COLORS.shelf, shelf * 0.58);
      color = mixColor(color, COLORS.foam, shelf * field.coast * 0.16);
    }

    const micro = (grain - 0.5) * 0.24 + (relief - 0.5) * 0.16;
    color = multiplyColor(color, clamp(1 + micro, 0.74, 1.26));

    const limb = clamp(0.50 + shade.depth * 0.56, 0.44, 1.08);
    const light = clamp(0.70 + shade.light * 0.43, 0.52, 1.16);
    const seam = clamp(1 - edgeFactor * 0.045, 0.86, 1.02);

    return multiplyColor(color, limb * light * seam);
  }

  function drawAtmosphere(ctx, width, height, cx, cy, radius, quality) {
    ctx.save();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.32);
    glow.addColorStop(0, "rgba(112,194,255,0.02)");
    glow.addColorStop(0.46, quality === "interactive" ? "rgba(114,198,255,0.12)" : "rgba(114,198,255,0.17)");
    glow.addColorStop(1, "rgba(30,48,100,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.32, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, radius * 0.012), 0, TAU);
    ctx.strokeStyle = quality === "interactive" ? "rgba(190,226,255,0.21)" : "rgba(190,226,255,0.30)";
    ctx.lineWidth = Math.max(1, radius * 0.012);
    ctx.stroke();

    ctx.restore();
  }

  function ensureScratchSurface(width, height) {
    if (scratch.canvas && scratch.ctx && scratch.width === width && scratch.height === height) {
      return scratch;
    }

    scratch.canvas = null;
    scratch.ctx = null;
    scratch.width = width;
    scratch.height = height;

    try {
      if (doc && isFunction(doc.createElement)) {
        scratch.canvas = doc.createElement("canvas");
        scratch.canvas.width = width;
        scratch.canvas.height = height;
        scratch.ctx = scratch.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      }

      if (!scratch.ctx && typeof OffscreenCanvas !== "undefined") {
        scratch.canvas = new OffscreenCanvas(width, height);
        scratch.ctx = scratch.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      }
    } catch (error) {
      recordError("SCRATCH_SURFACE_CREATION_FAILED", error, { width, height });
    }

    return scratch;
  }

  function drawFallbackSphereFrame(mode = "interactive", reason = "fallback-sphere-frame") {
    if (!ensureCanvasReady(reason, false)) {
      state.lastDrawOk = false;
      state.lastDrawError = "CANVAS_CONTEXT_2D_UNAVAILABLE_FOR_SPHERE_FALLBACK";
      return false;
    }

    const canvas = refs.canvas;
    const ctx = refs.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const sideLimit = mode === "interactive" ? INTERACTIVE_FALLBACK_SIDE : SETTLED_FALLBACK_SIDE;
    const side = clamp(Math.round(Math.min(width, height, sideLimit)), 220, sideLimit);
    const surface = ensureScratchSurface(side, side);

    if (!surface.ctx || !surface.canvas) {
      state.lastDrawOk = false;
      state.lastDrawError = "SPHERE_FALLBACK_SURFACE_UNAVAILABLE";
      return false;
    }

    const renderCtx = surface.ctx;
    const image = renderCtx.createImageData(side, side);
    const data = image.data;
    const cx = side / 2;
    const cy = side / 2;
    const radius = side * clamp(0.456 * (1 + (state.viewZoom - 1) * 0.12), 0.34, 0.49);
    const light = norm3(-0.48, 0.28, 0.84);

    let samples = 0;

    try {
      for (let py = 0; py < side; py += 1) {
        const yRaw = py + 0.5 - cy;
        const ny = yRaw / radius;

        for (let px = 0; px < side; px += 1) {
          const xRaw = px + 0.5 - cx;
          const nx = xRaw / radius;
          const r2 = nx * nx + ny * ny;

          if (r2 > 1) continue;

          const z = Math.sqrt(Math.max(0, 1 - r2));
          let vector = { x: nx, y: -ny, z };

          vector = rotateX(vector, -0.22 + state.viewPitch * 0.38);
          vector = rotateY(vector, state.canonicalRotationYaw);

          const coord = vectorToCoordinate(vector);
          const rawNormal = norm3(nx, -ny, z);
          const lightValue = clamp01(rawNormal.x * light.x + rawNormal.y * light.y + rawNormal.z * light.z);
          const edgeFactor = smoothstep(0.84, 1.0, Math.sqrt(r2));
          const color = fallbackSurfaceColor(coord, { light: lightValue, depth: z }, edgeFactor, mode);
          const index = (py * side + px) * 4;

          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];

          samples += 1;
        }
      }

      renderCtx.clearRect(0, 0, side, side);
      renderCtx.putImageData(image, 0, 0);
      drawAtmosphere(renderCtx, side, side, cx, cy, radius, mode);

      ctx.save();
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(surface.canvas, 0, 0, width, height);
      ctx.restore();

      state.drawCount += 1;
      state.fallbackDrawCount += 1;
      if (mode === "interactive") state.interactiveDrawCount += 1;
      else state.settledDrawCount += 1;

      state.lastDrawAt = nowIso();
      state.lastDrawReason = reason;
      state.lastDrawOk = true;
      state.lastDrawMode = mode === "interactive"
        ? "CANVAS_FALLBACK_INTERACTIVE_SPHERE_RECOMPUTE"
        : "CANVAS_FALLBACK_SETTLED_SPHERE_RECOMPUTE";
      state.lastDrawError = "";
      state.lastDrawSamples = samples;
      state.lastRenderWidth = side;
      state.lastRenderHeight = side;

      state.interactiveSphereRecomputeUsed = state.interactiveSphereRecomputeUsed || mode === "interactive";
      state.interactiveSphereProjectionRecomputed = state.interactiveSphereProjectionRecomputed || mode === "interactive";
      state.settledSphereProjectionRecomputed = state.settledSphereProjectionRecomputed || mode !== "interactive";
      state.bitmapSlidingUsed = false;
      state.cssTranslationUsed = false;
      state.canvasTransformMotionUsed = false;
      state.priorFrameTranslationUsed = false;

      state.canvasDrawComplete = true;
      state.baseGlobeDrawComplete = true;
      state.holdingFieldDrawComplete = true;
      state.visibleBaseGlobeCarrierActive = true;
      state.canvasVisibleBaseGlobeCarrierActive = true;
      state.baseGlobeVisibleCarrierReady = true;
      state.visibleGlobeCarrierReady = true;
      state.visiblePlanetProofSource = "DOM_CANVAS_2D_MOUNTED_PLANET_SURFACE";
      state.renderedYaw = state.viewYaw;
      state.renderedPitch = state.viewPitch;
      state.renderedZoom = state.viewZoom;
      state.renderedPhase = state.viewPhase;
      state.updatedAt = state.lastDrawAt;

      setNodeDataset(canvas, "hearthCanvasDrawComplete", "true");
      setNodeDataset(canvas, "hearthCanvasBaseGlobeDrawComplete", "true");
      setNodeDataset(canvas, "hearthCanvasInteractiveSphereRecomputeUsed", String(state.interactiveSphereRecomputeUsed));
      setNodeDataset(canvas, "hearthCanvasBitmapSlidingUsed", "false");
      setNodeDataset(canvas, "hearthCanvasCssTranslationUsed", "false");
      setNodeDataset(canvas, "hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
      setNodeDataset(canvas, "hearthCanvasDrawSamples", String(samples));

      if (mode !== "interactive") {
        samplePixels();
        publishDatasetThrottled(true);
        scheduleRouteNotify("settled-fallback-sphere-render-complete");
      } else {
        refreshProofFlags();
        publishViewDatasetLight();
      }

      publishViewGlobalsLight();

      return true;
    } catch (error) {
      state.lastDrawOk = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("FALLBACK_SPHERE_RECOMPUTE_FAILED", error, { mode, reason });
      if (mode !== "interactive") publishDatasetThrottled(true);
      else publishViewDatasetLight();
      return false;
    }
  }

  function getViewStatePacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      viewStateAccepted: state.viewStateAccepted,
      viewStateSource: state.viewStateSource,
      yaw: state.viewYaw,
      pitch: state.viewPitch,
      zoom: state.viewZoom,
      phase: state.viewPhase,
      canonicalRotationYaw: state.canonicalRotationYaw,
      minPitch: -1.25,
      maxPitch: 1.25,
      minZoom: 0.55,
      maxZoom: 2.4,
      bitmapSlidingAllowed: false,
      cssTranslationAllowed: false,
      pairedSphereRotation: true,
      hexSurfaceProjectionAnchorActive: true,
      hexFourPairSourceAnchorActive: true,
      interactiveSphereRecomputeRequired: true,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,
      ...FINAL_FALSE
    };
  }

  function normalizeViewState(packet = {}, source = "VIEW_STATE_PACKET") {
    const p = isObject(packet) ? packet : {};
    const nested = isObject(p.viewState) ? p.viewState : p;

    let yaw = safeNumber(firstDefined(nested.yaw, nested.viewYaw, nested.rotationYaw, state.viewYaw), state.viewYaw);
    let pitch = safeNumber(firstDefined(nested.pitch, nested.viewPitch, state.viewPitch), state.viewPitch);
    let zoom = safeNumber(firstDefined(nested.zoom, nested.viewZoom, state.viewZoom), state.viewZoom);
    let phase = safeNumber(firstDefined(nested.phase, nested.viewPhase, state.viewPhase), state.viewPhase);

    if (!isObject(p.viewState)) {
      if (nested.deltaYaw !== undefined) yaw += safeNumber(nested.deltaYaw, 0);
      if (nested.deltaPitch !== undefined) pitch += safeNumber(nested.deltaPitch, 0);
      if (nested.deltaZoom !== undefined) zoom += safeNumber(nested.deltaZoom, 0);
      if (nested.deltaPhase !== undefined) phase += safeNumber(nested.deltaPhase, 0);
      if (nested.wheelDelta !== undefined) zoom += safeNumber(nested.wheelDelta, 0) * -0.001;
    }

    return {
      yaw,
      pitch: clamp(pitch, -1.25, 1.25),
      zoom: clamp(zoom, 0.55, 2.4),
      phase,
      canonicalRotationYaw: yaw,
      source
    };
  }

  function composeRendererTarget(mode, reason) {
    const canvas = refs.canvas || ensureCanvasSurface();
    const ctx = refs.ctx || getContext2d(canvas);

    refs.ctx = ctx;

    return {
      canvas,
      ctx,
      context: ctx,
      mode,
      reason,
      sourceFile: FILE,
      sourceContract: CONTRACT,
      canvasHubContract: CONTRACT,
      canvasHubReceipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      route: ROUTE,
      viewState: getViewStatePacket(),
      yaw: state.viewYaw,
      pitch: state.viewPitch,
      zoom: state.viewZoom,
      phase: state.viewPhase,
      canonicalRotationYaw: state.canonicalRotationYaw,
      pairedSphereRotation: true,
      hexSurfaceProjectionAnchorActive: true,
      hexFourPairSourceAnchorActive: true,
      interactiveSphereRecomputeRequired: true,
      bitmapSlidingAllowed: false,
      cssTranslationAllowed: false,
      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,
      ...FINAL_FALSE
    };
  }

  function composeRendererOptions(mode, reason) {
    return {
      reason,
      mode,
      interactive: mode === "interactive",
      settled: mode === "settled",
      pairMode: mode,
      viewState: getViewStatePacket(),
      yaw: state.viewYaw,
      pitch: state.viewPitch,
      zoom: state.viewZoom,
      phase: state.viewPhase,
      canonicalRotationYaw: state.canonicalRotationYaw,
      pairedSphereRotation: true,
      forceSphereRecompute: true,
      recomputeProjection: true,
      bitmapSlidingAllowed: false,
      cssTranslationAllowed: false,
      priorFrameTranslationAllowed: false,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,
      ...FINAL_FALSE
    };
  }

  function callHexSurfaceRenderer(mode, reason) {
    const validation = validateHexSurface();
    const renderer = validation.renderer;

    if (!renderer || !isObject(renderer)) return false;
    if (!ensureCanvasReady(reason, false)) return false;

    const target = composeRendererTarget(mode, reason);
    const options = composeRendererOptions(mode, reason);

    const methodNames = mode === "interactive"
      ? [
          "drawInteractiveFrame",
          "drawPairFrame",
          "drawSphereInteractiveFrame",
          "drawPairInteractiveFrame",
          "drawHearthHexSurfaceFrame",
          "drawFrame",
          "renderFrame",
          "render"
        ]
      : [
          "drawSettledFrame",
          "drawPairFrame",
          "drawSphereSettledFrame",
          "drawPairSettledFrame",
          "drawHearthHexSurfaceFrame",
          "drawFrame",
          "renderFrame",
          "render"
        ];

    for (const method of methodNames) {
      if (!isFunction(renderer[method])) continue;

      try {
        const result = renderer[method](target, options);

        state.drawCount += 1;
        state.hexDrawCount += 1;
        if (mode === "interactive") state.interactiveDrawCount += 1;
        else state.settledDrawCount += 1;

        state.lastDrawAt = nowIso();
        state.lastDrawReason = reason;
        state.lastDrawOk = true;
        state.lastDrawMode = mode === "interactive"
          ? "HEX_SURFACE_ANCHORED_INTERACTIVE_SPHERE_RECOMPUTE"
          : "HEX_SURFACE_ANCHORED_SETTLED_SPHERE_RECOMPUTE";
        state.lastDrawError = "";
        state.lastPairDrawMethod = method;

        if (mode === "interactive") {
          state.lastInteractiveDrawMethod = method;
          state.interactiveSphereRecomputeUsed = true;
          state.interactiveSphereProjectionRecomputed = true;
        } else {
          state.lastSettledDrawMethod = method;
          state.settledSphereProjectionRecomputed = true;
        }

        state.bitmapSlidingUsed = false;
        state.cssTranslationUsed = false;
        state.canvasTransformMotionUsed = false;
        state.priorFrameTranslationUsed = false;
        state.verticalPolarityCorrectedByCanvas = false;
        state.pointerPolarityOwnedByControls = true;

        state.canvasDrawComplete = true;
        state.baseGlobeDrawComplete = true;
        state.rendererDrawComplete = true;
        state.visibleBaseGlobeCarrierActive = true;
        state.canvasVisibleBaseGlobeCarrierActive = true;
        state.baseGlobeVisibleCarrierReady = true;
        state.visibleGlobeCarrierReady = true;
        state.visiblePlanetProofSource = "DOM_CANVAS_2D_MOUNTED_PLANET_SURFACE";
        state.renderedYaw = state.viewYaw;
        state.renderedPitch = state.viewPitch;
        state.renderedZoom = state.viewZoom;
        state.renderedPhase = state.viewPhase;
        state.updatedAt = state.lastDrawAt;

        if (isObject(result)) {
          state.lastRenderWidth = safeNumber(result.renderWidth || result.width, state.lastRenderWidth);
          state.lastRenderHeight = safeNumber(result.renderHeight || result.height, state.lastRenderHeight);
          state.lastDrawSamples = safeNumber(result.samples || result.lastDrawSamples, state.lastDrawSamples);
          setNodeDataset(refs.canvas, "hearthHexSurfaceRendererReceipt", result.receipt || validation.receipt);
          setNodeDataset(refs.canvas, "hearthHexSurfaceRendererContract", result.contract || validation.contract);
        }

        setNodeDataset(refs.canvas, "hearthCanvasDrawComplete", "true");
        setNodeDataset(refs.canvas, "hearthCanvasBaseGlobeDrawComplete", "true");
        setNodeDataset(refs.canvas, "hearthCanvasInteractiveSphereRecomputeUsed", String(state.interactiveSphereRecomputeUsed));
        setNodeDataset(refs.canvas, "hearthCanvasInteractiveSphereProjectionRecomputed", String(state.interactiveSphereProjectionRecomputed));
        setNodeDataset(refs.canvas, "hearthCanvasSettledSphereProjectionRecomputed", String(state.settledSphereProjectionRecomputed));
        setNodeDataset(refs.canvas, "hearthCanvasBitmapSlidingUsed", "false");
        setNodeDataset(refs.canvas, "hearthCanvasCssTranslationUsed", "false");
        setNodeDataset(refs.canvas, "hearthCanvasPointerPolarityOwnedByControls", "true");
        setNodeDataset(refs.canvas, "hearthCanvasVerticalPolarityCorrectedByCanvas", "false");
        setNodeDataset(refs.canvas, "hearthCanvasLastInteractiveDrawMethod", state.lastInteractiveDrawMethod);
        setNodeDataset(refs.canvas, "hearthCanvasLastSettledDrawMethod", state.lastSettledDrawMethod);
        setNodeDataset(refs.canvas, "hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);

        if (mode === "interactive") {
          refreshProofFlags();
          publishViewDatasetLight();
        } else {
          samplePixels();
          publishDatasetThrottled(true);
          scheduleRouteNotify("settled-hex-surface-anchor-render-complete");
        }

        publishViewGlobalsLight();

        return true;
      } catch (error) {
        recordError("HEX_SURFACE_ANCHOR_RENDER_METHOD_FAILED", error, { mode, reason, method });
        state.lastDrawOk = false;
        state.lastDrawError = error && error.message ? String(error.message) : String(error);
      }
    }

    return false;
  }

  function drawInteractiveSphere(reason = "interactive-sphere-rAF") {
    if (!ensureCanvasReady(reason, false)) return false;

    const hexDrawn = callHexSurfaceRenderer("interactive", reason);
    if (!hexDrawn) return drawFallbackSphereFrame("interactive", reason);

    return true;
  }

  function drawSettledSphere(reason = "settled-sphere-render") {
    if (!ensureCanvasReady(reason, true)) return false;

    validateHexAuthority();

    const hexDrawn = callHexSurfaceRenderer("settled", reason);
    if (!hexDrawn) return drawFallbackSphereFrame("settled", reason);

    return true;
  }

  function drawFrame(reason = "drawFrame") {
    drawSettledSphere(reason);
    scheduleRouteNotify(reason);
    return getCanvasStationReceiptLight(false);
  }

  function scheduleInteractiveSphereFrame(reason = "view-state-interactive") {
    if (interactiveRaf) return;

    interactiveRaf = scheduleAnimationFrame(() => {
      interactiveRaf = 0;
      drawInteractiveSphere(reason);
    });
  }

  function scheduleSettledSphereFrame(reason = "view-state-settled") {
    if (settledTimer && isFunction(root.clearTimeout)) {
      root.clearTimeout(settledTimer);
      settledTimer = 0;
    }

    if (!isFunction(root.setTimeout)) {
      drawSettledSphere(reason);
      return;
    }

    settledTimer = root.setTimeout(() => {
      settledTimer = 0;
      drawSettledSphere(reason);
    }, INTERACTIVE_SETTLE_DELAY_MS);
  }

  function scheduleDraw(reason = "scheduled-draw") {
    scheduleSettledSphereFrame(reason);
  }

  function receiveViewState(packet = {}, source = "DIRECT_VIEW_STATE_PACKET") {
    if (!isObject(packet)) {
      state.viewStateRejectedCount += 1;
      state.viewStateRejectionReason = "VIEW_STATE_PACKET_NOT_OBJECT";
      publishViewDatasetLight();
      return getCanvasStationReceiptLight(false);
    }

    const view = normalizeViewState(packet, source);

    state.viewStateAccepted = true;
    state.viewStateSource = view.source;
    state.viewYaw = view.yaw;
    state.viewPitch = view.pitch;
    state.viewZoom = view.zoom;
    state.viewPhase = view.phase;
    state.canonicalRotationYaw = view.canonicalRotationYaw;
    state.viewStatePacketCount += 1;
    state.viewStateLastAcceptedAt = nowIso();
    state.viewStateRejectionReason = "";
    state.lastControlPacketType = safeString(packet.packetType || packet.type || "VIEW_STATE_PACKET");
    state.lastControlInputType = safeString(packet.inputType || "view-control");

    state.bitmapSlidingUsed = false;
    state.cssTranslationUsed = false;
    state.canvasTransformMotionUsed = false;
    state.priorFrameTranslationUsed = false;
    state.verticalPolarityCorrectedByCanvas = false;
    state.pointerPolarityOwnedByControls = true;

    publishViewGlobalsLight();
    publishViewDatasetLight();

    scheduleInteractiveSphereFrame("view-state-rAF-hex-surface-anchor-recompute");
    scheduleSettledSphereFrame("view-state-settled-hex-surface-anchor-recompute");

    return getCanvasStationReceiptLight(false);
  }

  function receiveCanvasViewState(packet) { return receiveViewState(packet, "CANVAS_VIEW_STATE_PACKET"); }
  function consumeCanvasViewState(packet) { return receiveViewState(packet, "CONSUME_CANVAS_VIEW_STATE_PACKET"); }
  function receiveViewControlPacket(packet) { return receiveViewState(packet, "VIEW_CONTROL_PACKET"); }
  function consumeViewControlPacket(packet) { return receiveViewState(packet, "CONSUME_VIEW_CONTROL_PACKET"); }
  function receivePlanetaryViewControlPacket(packet) { return receiveViewState(packet, "PLANETARY_VIEW_CONTROL_PACKET"); }
  function consumePlanetaryViewControlPacket(packet) { return receiveViewState(packet, "CONSUME_PLANETARY_VIEW_CONTROL_PACKET"); }
  function receiveControlsPacket(packet) { return receiveViewState(packet, "CONTROLS_PACKET"); }
  function receiveControlViewPacket(packet) { return receiveViewState(packet, "CONTROL_VIEW_PACKET"); }
  function receiveControlPacket(packet) { return receiveViewState(packet, "CONTROL_PACKET"); }
  function receivePlanetaryControlPacket(packet) { return receiveViewState(packet, "PLANETARY_CONTROL_PACKET"); }
  function receiveViewDelta(packet) { return receiveViewState(packet, "VIEW_DELTA_PACKET"); }
  function applyViewDelta(packet) { return receiveViewState(packet, "APPLY_VIEW_DELTA"); }
  function applyViewState(packet) { return receiveViewState(packet, "APPLY_VIEW_STATE"); }
  function setViewState(packet) { return receiveViewState(packet, "SET_VIEW_STATE"); }
  function setView(packet) { return receiveViewState(packet, "SET_VIEW"); }
  function updateView(packet) { return receiveViewState(packet, "UPDATE_VIEW"); }

  function drawVisibleExpression(packet = {}) {
    if (isObject(packet) && (packet.viewState || packet.yaw !== undefined || packet.deltaYaw !== undefined)) {
      receiveViewState(packet, "DRAW_VISIBLE_EXPRESSION_VIEW_PACKET");
      return getCanvasStationReceiptLight(false);
    }

    scheduleDraw("draw-visible-expression");
    return getCanvasStationReceiptLight(false);
  }

  function acceptReleasePacket(packet = {}, source = "ROUTE_CONDUCTOR_RELEASE_PACKET") {
    state.releasePacketObserved = true;
    state.releasePacketCount += 1;
    state.releasePacketLastAt = nowIso();
    state.releasePacketLastSource = source;

    const p = isObject(packet) ? packet : {};
    const authorized =
      p.canvasReleaseAuthorized === true ||
      p.canvasReleasePacketReady === true ||
      p.handoffTo === "CANVAS" ||
      p.destinationFile === FILE ||
      p.targetFile === FILE ||
      p.canvasReceiverBishopExpected === true;

    state.releasePacketAccepted = Boolean(authorized || state.canvasMounted);
    state.releasePacketLawful = state.releasePacketAccepted;
    state.canvasParentReleaseAccepted = state.releasePacketAccepted;
    state.canvasParentReleaseLawful = state.releasePacketAccepted;
    state.parentAcceptedRouteConductorRelease = state.releasePacketAccepted;
    state.parentReleasePacketLawful = state.releasePacketAccepted;

    record("ROUTE_CONDUCTOR_RELEASE_PACKET_ACCEPTED_BY_CANVAS", {
      source,
      accepted: state.releasePacketAccepted,
      authorized,
      targetFile: p.targetFile || "",
      destinationFile: p.destinationFile || ""
    });

    scheduleDraw("route-conductor-release-packet");

    return {
      ...getCanvasStationReceiptLight(false),
      releasePacketAccepted: state.releasePacketAccepted,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.canvasParentReleaseLawful,
      releasePacketLawful: state.releasePacketLawful
    };
  }

  function consumeRouteConductorReleasePacket(packet) { return acceptReleasePacket(packet, "consumeRouteConductorReleasePacket"); }
  function receiveRouteConductorReleasePacket(packet) { return acceptReleasePacket(packet, "receiveRouteConductorReleasePacket"); }
  function consumeReleasePacket(packet) { return acceptReleasePacket(packet, "consumeReleasePacket"); }
  function receiveReleasePacket(packet) { return acceptReleasePacket(packet, "receiveReleasePacket"); }
  function receiveCanvasReleasePacket(packet) { return acceptReleasePacket(packet, "receiveCanvasReleasePacket"); }
  function receiveCanvasParentPacket(packet) { return acceptReleasePacket(packet, "receiveCanvasParentPacket"); }

  function ensureScript(path, id, contract) {
    if (!doc || !doc.head) return Promise.resolve(false);

    const existing = scriptByPath(path) || doc.getElementById(id);
    if (existing) return Promise.resolve(true);

    return new Promise((resolve) => {
      try {
        const script = doc.createElement("script");
        script.id = id;
        script.src = `${path}?v=${encodeURIComponent(contract)}`;
        script.async = false;
        script.defer = true;
        script.dataset.admittedBy = CONTRACT;
        script.dataset.dependencyFor = FILE;
        script.dataset.dependencyContract = contract;
        script.dataset.generatedImage = "false";
        script.dataset.graphicBox = "false";
        script.dataset.webgl = "false";
        script.dataset.visualPassClaimed = "false";

        script.addEventListener("load", () => resolve(true), { once: true });
        script.addEventListener("error", () => resolve(false), { once: true });

        doc.head.appendChild(script);
      } catch (_error) {
        resolve(false);
      }
    });
  }

  function ensureDependencyScripts(reason = "canvas-hex-surface-anchor-dependency-admission") {
    if (dependencyPromise) return dependencyPromise;

    state.dependencyScriptAdmissionAttempted = true;
    state.dependencyScriptAdmissionStatus = "DEPENDENCY_ADMISSION_STARTED";
    state.dependencyScriptAdmissionReason = reason;
    publishDatasetThrottled(true);

    dependencyPromise = Promise.resolve()
      .then(() => {
        const authority = resolveHexAuthority();
        if (authority) return true;

        return ensureScript(
          HEX_AUTHORITY_FILE,
          "hearth-canvas-admitted-hex-four-pair-authority",
          HEX_AUTHORITY_CONTRACT
        );
      })
      .then(() => {
        const surface = resolveHexSurface();
        if (surface) return true;

        return ensureScript(
          HEX_SURFACE_FILE,
          "hearth-canvas-admitted-hex-surface-anchor-renderer",
          HEX_SURFACE_ACTUAL_V4_CONTRACT
        );
      })
      .then((ok) => {
        validateHexAuthority();
        validateHexSurface();

        state.dependencyScriptAdmissionStatus = ok
          ? "DEPENDENCY_ADMISSION_COMPLETE_OR_ALREADY_PRESENT"
          : "DEPENDENCY_ADMISSION_PARTIAL_OR_HELD";
        state.dependencyScriptAdmissionReason = reason;
        state.dependencyScriptLoadError = "";

        publishDatasetThrottled(true);
        publishGlobals();

        scheduleSettledSphereFrame("hex-surface-anchor-dependency-ready");

        return ok;
      })
      .catch((error) => {
        state.dependencyScriptAdmissionStatus = "DEPENDENCY_ADMISSION_ERROR";
        state.dependencyScriptLoadError = error && error.message ? String(error.message) : String(error);
        recordError("CANVAS_DEPENDENCY_SCRIPT_ADMISSION_FAILED", error, { reason });
        publishDatasetThrottled(true);
        publishGlobals();
        return false;
      });

    return dependencyPromise;
  }

  function samplePixels() {
    const canvas = refs.canvas || ensureCanvasSurface();
    const ctx = refs.ctx || getContext2d(canvas);

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.canvasPixelSampleStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelSampleReadable = false;
      state.canvasPixelNonempty = false;
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelVisible = false;
      refreshProofFlags();
      return false;
    }

    try {
      const points = [
        [0.50, 0.50], [0.40, 0.50], [0.60, 0.50], [0.50, 0.40], [0.50, 0.60],
        [0.35, 0.35], [0.65, 0.35], [0.35, 0.65], [0.65, 0.65],
        [0.50, 0.28], [0.50, 0.72], [0.28, 0.50], [0.72, 0.50]
      ];

      const colors = new Set();
      let alpha = 0;

      for (const point of points) {
        const x = clamp(Math.round(canvas.width * point[0]), 0, canvas.width - 1);
        const y = clamp(Math.round(canvas.height * point[1]), 0, canvas.height - 1);
        const data = ctx.getImageData(x, y, 1, 1).data;
        const key = `${data[0]},${data[1]},${data[2]},${data[3]}`;

        if (data[3] > 0) alpha += 1;
        colors.add(key);
      }

      state.canvasPixelSampleStatus = alpha > 0 ? "PIXEL_SAMPLE_READABLE" : "PIXEL_SAMPLE_EMPTY";
      state.canvasPixelSampleReadable = true;
      state.canvasPixelNonempty = alpha > 0;
      state.canvasPixelUniqueColorCount = colors.size;
      state.canvasPixelVarianceStatus = colors.size >= 4 && alpha > 0
        ? "PIXEL_VARIANCE_PRESENT"
        : "PIXEL_VARIANCE_INSUFFICIENT";
      state.canvasPixelVisible = alpha > 0 && colors.size >= 4;
      state.canvasVisiblePixelCount = alpha;
      state.canvasAlphaPixelCount = alpha;

      refreshProofFlags();
      return true;
    } catch (error) {
      state.canvasPixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.canvasPixelSampleReadable = false;
      state.canvasPixelNonempty = false;
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_ERROR";
      state.canvasPixelVisible = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("CANVAS_PIXEL_SAMPLE_FAILED", error);
      refreshProofFlags();
      return false;
    }
  }

  function refreshProofFlags() {
    const proofReady = Boolean(
      state.canvasElementFound &&
      state.canvasInMount &&
      (state.canvasRectNonzero || (state.canvasWidth > 0 && state.canvasHeight > 0)) &&
      state.canvasContext2dReady &&
      state.canvasDrawComplete &&
      (state.canvasPixelVisible || state.interactiveDrawCount > 0 || state.settledDrawCount > 0)
    );

    state.visiblePlanetProofReady = proofReady;
    state.domVisiblePlanetProofReady = proofReady;
    state.currentVisibleProofValid = proofReady;
    state.f13VisibleEvidenceAvailable = proofReady;
    state.f13CanvasReadinessObserved = proofReady;
    state.f13CanvasEvidenceComplete = proofReady;
    state.f13CanvasEvidenceDegraded = proofReady;
    state.f13CanvasEvidenceStrict = false;
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = proofReady
      ? "STRICT_FINGER_BISHOP_EVIDENCE_NOT_YET_WIRED"
      : "WAITING_DOM_CANVAS_PIXEL_VARIANCE";

    return proofReady;
  }

  function scheduleRouteNotify(reason = "route-notify") {
    if (routeNotifyTimer || !isFunction(root.setTimeout)) return;

    routeNotifyTimer = root.setTimeout(() => {
      routeNotifyTimer = 0;
      notifyRouteConductor(reason);
    }, 90);
  }

  function notifyRouteConductor(reason = "route-notify") {
    const route = resolveRouteConductor();

    state.routeConductorObserved = Boolean(route);

    if (!route || !isObject(route)) {
      state.routeConductorNotifyStatus = "ROUTE_CONDUCTOR_NOT_OBSERVED";
      state.routeConductorNotifyMethod = "NONE";
      publishDatasetThrottled(true);
      return false;
    }

    const receipt = getCanvasStationReceiptLight(false);
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
      "reconcileCanvas"
    ];

    for (const method of methods) {
      if (!isFunction(route[method])) continue;

      try {
        route[method]({
          ...clonePlain(receipt),
          notifyReason: reason,
          sourceFile: FILE,
          sourceContract: CONTRACT,
          bitmapSlidingUsed: false,
          cssTranslationUsed: false,
          interactiveSphereRecomputeUsed: state.interactiveSphereRecomputeUsed,
          verticalPolarityCorrectedByCanvas: false,
          pointerPolarityOwnedByControls: true,
          ...FINAL_FALSE
        });

        state.routeConductorNotifyCount += 1;
        state.routeConductorNotifyMethod = method;
        state.routeConductorNotifyStatus = "ROUTE_CONDUCTOR_NOTIFIED";
        publishDatasetThrottled(true);
        return true;
      } catch (error) {
        recordError("ROUTE_CONDUCTOR_NOTIFY_METHOD_FAILED", error, { method, reason });
      }
    }

    state.routeConductorNotifyStatus = "ROUTE_CONDUCTOR_RECEIVE_METHOD_NOT_FOUND";
    state.routeConductorNotifyMethod = "NONE";
    publishDatasetThrottled(true);
    return false;
  }

  function composeSummary() {
    const rectReady = state.canvasRectNonzero || (state.canvasWidth > 0 && state.canvasHeight > 0);
    const proofReady = Boolean(
      state.canvasElementFound &&
      state.canvasInMount &&
      rectReady &&
      state.canvasContext2dReady &&
      state.canvasDrawComplete &&
      (state.canvasPixelVisible || state.interactiveDrawCount > 0 || state.settledDrawCount > 0)
    );

    state.visiblePlanetProofReady = proofReady;
    state.domVisiblePlanetProofReady = proofReady;
    state.currentVisibleProofValid = proofReady;
    state.f13CanvasReadinessObserved = proofReady;
    state.f13VisibleEvidenceAvailable = proofReady;
    state.f13CanvasEvidenceComplete = proofReady;
    state.f13CanvasEvidenceDegraded = proofReady;
    state.f13CanvasEvidenceStrict = false;
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = proofReady
      ? "STRICT_FINGER_BISHOP_EVIDENCE_NOT_YET_WIRED"
      : "WAITING_DOM_CANVAS_SURFACE_PROOF";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV121Receipt: LINEAGE_V12_1_RECEIPT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV12Receipt: LINEAGE_V12_RECEIPT,
      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      packetType: "HEARTH_CANVAS_LOCAL_STATION_HEX_SURFACE_ANCHOR_RECEIPT",
      role: "canvas-local-station-hex-surface-anchor-receiver",
      authority: "canvas-hub-hex-surface-anchor-receiver-throttled-interactive",

      planetId: PLANET_ID,
      planetLabel: PLANET_LABEL,

      canvasHubActive: true,
      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,
      routeConductorSummarySurfaceActive: true,
      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,

      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      compositeFirstVisiblePathActive: true,
      currentCanvasParentIsLocalStation: true,
      currentCanvasParentIsExpressionHub: true,
      currentCanvasParentIsFingerManager: true,
      currentCanvasParentIsVisibleBaseGlobeCarrier: true,
      canvasLocalStationApiReady: true,
      canvasParentBootMethodAvailable: true,
      canvasContractAccepted: true,
      canvasSummaryAcceptedByContract: true,
      canvasSummaryAcceptedByShape: true,
      canvasSummaryShapeTrusted: true,
      canvasBaselineOnly: false,

      hexSurfaceProjectionAnchorActive: true,
      hexFourPairSourceAnchorActive: true,
      pairedHexSurfaceExpected: true,
      pairedHexSurfaceObserved: state.pairedHexSurfaceObserved,
      pairedHexSurfaceContract: state.pairedHexSurfaceContract,
      pairedHexSurfaceReceipt: state.pairedHexSurfaceReceipt,
      pairedHexSurfaceRecognized: state.pairedHexSurfaceRecognized,
      pairedHexSurfaceApiReady: state.pairedHexSurfaceApiReady,
      actualHexSurfaceV4Contract: HEX_SURFACE_ACTUAL_V4_CONTRACT,
      actualHexSurfaceV4Receipt: HEX_SURFACE_ACTUAL_V4_RECEIPT,
      actualHexSurfaceV4RecognizedByName: state.actualHexSurfaceV4RecognizedByName,
      legacyPairHexSurfaceV4Contract: HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT,
      legacyPairHexSurfaceV4Receipt: HEX_SURFACE_EXPECTED_PAIR_V4_RECEIPT,
      legacyPairHexSurfaceV4RecognizedByName: state.legacyPairHexSurfaceV4RecognizedByName,
      acceptedHexSurfaceContracts: ACCEPTED_HEX_SURFACE_CONTRACTS.slice(),

      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      canvasTransformMotionUsed: false,
      priorFrameTranslationUsed: false,
      interactiveSphereRecomputeUsed: state.interactiveSphereRecomputeUsed,
      interactiveSphereProjectionRecomputed: state.interactiveSphereProjectionRecomputed,
      settledSphereProjectionRecomputed: state.settledSphereProjectionRecomputed,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,

      rafSchedulerActive: true,
      requestAnimationFrameAvailable: state.requestAnimationFrameAvailable,
      setTimeout40MotionPathRemoved: true,
      motionUsesRequestAnimationFrame: true,
      fullHexRenderDeferredDuringInput: true,
      datasetPublicationThrottledDuringMotion: true,
      receiptPublicationThrottledDuringMotion: true,
      routeNotifySuppressedDuringInteractiveMotion: true,
      pixelSamplingSuppressedDuringInteractiveMotion: true,
      mountSuppressedDuringInteractiveMotion: true,
      inputSettleDelayMs: INTERACTIVE_SETTLE_DELAY_MS,

      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      canvasMounted: state.canvasMounted,
      canvasDrawComplete: state.canvasDrawComplete,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: proofReady,
      domVisiblePlanetProofReady: proofReady,
      currentVisibleProofValid: proofReady,
      visiblePlanetProofSource: proofReady ? "DOM_CANVAS_2D_MOUNTED_PLANET_SURFACE" : state.visiblePlanetProofSource,
      visiblePlanetReceiptObserved: proofReady,

      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasElementFound ? `#${CANVAS_ID}` : "NONE",
      canvasTag: state.canvasElementFound ? "CANVAS" : "NONE",
      canvasId: state.canvasElementFound ? CANVAS_ID : "NONE",
      canvasInMount: state.canvasInMount,
      canvasMountFound: state.mountPresent,
      canvasMountSelector: MOUNT_SELECTOR,
      canvasWidthAttribute: state.canvasWidth,
      canvasHeightAttribute: state.canvasHeight,
      canvasRectNonzero: rectReady,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,

      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelSampleReadable: state.canvasPixelSampleReadable,
      canvasPixelNonempty: state.canvasPixelNonempty,
      canvasPixelUniqueColorCount: state.canvasPixelUniqueColorCount,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,

      drawCount: state.drawCount,
      interactiveDrawCount: state.interactiveDrawCount,
      settledDrawCount: state.settledDrawCount,
      fallbackDrawCount: state.fallbackDrawCount,
      hexDrawCount: state.hexDrawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawReason: state.lastDrawReason,
      lastDrawOk: state.lastDrawOk,
      lastDrawMode: state.lastDrawMode,
      lastDrawError: state.lastDrawError,
      lastInteractiveDrawMethod: state.lastInteractiveDrawMethod,
      lastSettledDrawMethod: state.lastSettledDrawMethod,
      lastPairDrawMethod: state.lastPairDrawMethod,
      lastRenderWidth: state.lastRenderWidth,
      lastRenderHeight: state.lastRenderHeight,
      lastDrawSamples: state.lastDrawSamples,
      holdingFieldDrawComplete: state.holdingFieldDrawComplete,
      rendererDrawComplete: state.rendererDrawComplete,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      hexAuthorityWideProbeReady: state.hexAuthorityWideProbeReady,
      hexAuthorityWideProbeFailedCount: state.hexAuthorityWideProbeFailedCount,

      dependencyScriptAdmissionAttempted: state.dependencyScriptAdmissionAttempted,
      dependencyScriptAdmissionStatus: state.dependencyScriptAdmissionStatus,
      dependencyScriptAdmissionReason: state.dependencyScriptAdmissionReason,
      dependencyScriptLoadError: state.dependencyScriptLoadError,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketAccepted: state.releasePacketAccepted,
      releasePacketLawful: state.releasePacketLawful,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseObserved: state.releasePacketObserved,
      parentReleaseLawful: state.canvasParentReleaseLawful,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,
      parentReleasePacketLawful: state.parentReleasePacketLawful,

      viewStateAccepted: state.viewStateAccepted,
      viewStateSource: state.viewStateSource,
      viewYaw: state.viewYaw,
      viewPitch: state.viewPitch,
      viewZoom: state.viewZoom,
      viewPhase: state.viewPhase,
      canonicalRotationYaw: state.canonicalRotationYaw,
      renderedYaw: state.renderedYaw,
      renderedPitch: state.renderedPitch,
      renderedZoom: state.renderedZoom,
      renderedPhase: state.renderedPhase,
      viewStatePacketCount: state.viewStatePacketCount,
      lastControlPacketType: state.lastControlPacketType,
      lastControlInputType: state.lastControlInputType,

      namedFingerFilesEmbedded: true,
      downstreamFingerTracksDeclared: true,
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
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,
      degradedF13IsFunctional: state.f13CanvasEvidenceDegraded,
      strictVisualProofPending: proofReady,
      functionalPageObserved: proofReady,

      ownsCanvasDrawing: true,
      ownsCanvasMounting: true,
      ownsCanvasSurfaceReception: true,
      ownsCanvasOutputCarrier: true,
      ownsHtmlShell: false,
      ownsIndexButtonAuthority: false,
      ownsRouteConductorAuthority: false,
      ownsControlAdmission: false,
      ownsControlTruth: false,
      ownsControlPolarityTruth: false,
      ownsHexTruth: false,
      ownsHexSurfaceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
      ownsDiagnosticRailCaseSelection: false,

      updatedAt: state.updatedAt || nowIso(),
      ...FINAL_FALSE
    };
  }

  function getCanvasStationReceiptLight(doRefresh = false) {
    if (doRefresh) {
      validateHexAuthority();
      validateHexSurface();
      refreshRefs();
      samplePixels();
    }

    return composeSummary();
  }

  function getCanvasStationSummary() { return getCanvasStationReceiptLight(false); }
  function getCanvasStationReceipt() { return getReceipt(); }
  function getExpressionHubSummary() { return getCanvasStationReceiptLight(false); }
  function getExpressionHubReceipt() { return getReceipt(); }
  function getVisibleBaseGlobeReceipt() { return getCanvasStationReceiptLight(false); }
  function getBaseGlobeReceipt() { return getCanvasStationReceiptLight(false); }
  function getVisibleGlobeReceipt() { return getCanvasStationReceiptLight(false); }
  function getVisiblePlanetReceipt() { return getCanvasStationReceiptLight(false); }
  function getCanvasVisibleProofReceipt() { return getCanvasStationReceiptLight(false); }
  function getStructuralCarrier() { return getCanvasStationReceiptLight(false); }
  function readStructuralCarrier() { return getCanvasStationReceiptLight(false); }
  function getCanvasCarrier() { return getCanvasStationReceiptLight(false); }
  function getCarrierReceipt() { return getCanvasStationReceiptLight(false); }
  function getStatus() { return getCanvasStationReceiptLight(true); }
  function getReport() { return getReceipt(); }
  function getState() { return state; }

  function getReceipt() {
    return {
      ...getCanvasStationReceiptLight(false),
      currentReceipt: true,
      receiptComposed: true,
      exposedMethods: [
        "boot",
        "init",
        "start",
        "mount",
        "drawFrame",
        "scheduleDraw",
        "receiveRouteConductorReleasePacket",
        "consumeRouteConductorReleasePacket",
        "receiveCanvasViewState",
        "receiveViewControlPacket",
        "receivePlanetaryViewControlPacket",
        "receiveControlPacket",
        "receiveControlsPacket",
        "receivePlanetaryControlPacket",
        "receiveViewDelta",
        "applyViewDelta",
        "setView",
        "updateView",
        "drawVisibleExpression",
        "drawInteractiveSphere",
        "drawSettledSphere",
        "getCanvasStationReceiptLight",
        "getCanvasStationReceipt",
        "getVisiblePlanetReceipt",
        "getCanvasVisibleProofReceipt",
        "getReceipt",
        "getReceiptText"
      ],
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      ...FINAL_FALSE
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getCanvasStationReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousInternalImplementationContract", PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT),
      line("previousInternalImplementationReceipt", PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "ANCHORS",
      line("hexSurfaceProjectionAnchorActive", true),
      line("hexFourPairSourceAnchorActive", true),
      line("actualHexSurfaceV4Contract", HEX_SURFACE_ACTUAL_V4_CONTRACT),
      line("actualHexSurfaceV4RecognizedByName", r.actualHexSurfaceV4RecognizedByName),
      line("legacyPairHexSurfaceV4Contract", HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT),
      line("legacyPairHexSurfaceV4RecognizedByName", r.legacyPairHexSurfaceV4RecognizedByName),
      line("pairedHexSurfaceObserved", r.pairedHexSurfaceObserved),
      line("pairedHexSurfaceContract", r.pairedHexSurfaceContract),
      line("pairedHexSurfaceRecognized", r.pairedHexSurfaceRecognized),
      line("pairedHexSurfaceApiReady", r.pairedHexSurfaceApiReady),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexAuthorityRecognized", r.hexAuthorityRecognized),
      line("hexAuthorityWideProbeReady", r.hexAuthorityWideProbeReady),
      "",
      "NO_SLIDE_PROOF",
      line("bitmapSlidingUsed", false),
      line("cssTranslationUsed", false),
      line("canvasTransformMotionUsed", false),
      line("priorFrameTranslationUsed", false),
      line("interactiveSphereRecomputeUsed", r.interactiveSphereRecomputeUsed),
      line("interactiveSphereProjectionRecomputed", r.interactiveSphereProjectionRecomputed),
      line("settledSphereProjectionRecomputed", r.settledSphereProjectionRecomputed),
      line("verticalPolarityCorrectedByCanvas", false),
      line("pointerPolarityOwnedByControls", true),
      "",
      "MOTION_SCHEDULER",
      line("rafSchedulerActive", r.rafSchedulerActive),
      line("requestAnimationFrameAvailable", r.requestAnimationFrameAvailable),
      line("setTimeout40MotionPathRemoved", r.setTimeout40MotionPathRemoved),
      line("motionUsesRequestAnimationFrame", r.motionUsesRequestAnimationFrame),
      line("fullHexRenderDeferredDuringInput", r.fullHexRenderDeferredDuringInput),
      line("datasetPublicationThrottledDuringMotion", r.datasetPublicationThrottledDuringMotion),
      line("receiptPublicationThrottledDuringMotion", r.receiptPublicationThrottledDuringMotion),
      line("routeNotifySuppressedDuringInteractiveMotion", r.routeNotifySuppressedDuringInteractiveMotion),
      line("pixelSamplingSuppressedDuringInteractiveMotion", r.pixelSamplingSuppressedDuringInteractiveMotion),
      line("mountSuppressedDuringInteractiveMotion", r.mountSuppressedDuringInteractiveMotion),
      line("inputSettleDelayMs", r.inputSettleDelayMs),
      "",
      "DRAW",
      line("drawCount", r.drawCount),
      line("interactiveDrawCount", r.interactiveDrawCount),
      line("settledDrawCount", r.settledDrawCount),
      line("fallbackDrawCount", r.fallbackDrawCount),
      line("hexDrawCount", r.hexDrawCount),
      line("lastDrawOk", r.lastDrawOk),
      line("lastDrawMode", r.lastDrawMode),
      line("lastInteractiveDrawMethod", r.lastInteractiveDrawMethod),
      line("lastSettledDrawMethod", r.lastSettledDrawMethod),
      line("lastPairDrawMethod", r.lastPairDrawMethod),
      line("lastDrawError", r.lastDrawError),
      "",
      "VIEW",
      line("viewStateAccepted", r.viewStateAccepted),
      line("viewStateSource", r.viewStateSource),
      line("viewYaw", r.viewYaw),
      line("viewPitch", r.viewPitch),
      line("viewZoom", r.viewZoom),
      line("viewPhase", r.viewPhase),
      line("canonicalRotationYaw", r.canonicalRotationYaw),
      line("viewStatePacketCount", r.viewStatePacketCount),
      line("lastControlInputType", r.lastControlInputType),
      "",
      "DOM_SURFACE",
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasInMount", r.canvasInMount),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasWidthAttribute", r.canvasWidthAttribute),
      line("canvasHeightAttribute", r.canvasHeightAttribute),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasContext2dReady", r.canvasContext2dReady),
      "",
      "PIXEL_PROOF",
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelSampleReadable", r.canvasPixelSampleReadable),
      line("canvasPixelNonempty", r.canvasPixelNonempty),
      line("canvasPixelUniqueColorCount", r.canvasPixelUniqueColorCount),
      line("canvasPixelVarianceStatus", r.canvasPixelVarianceStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      "",
      "VISIBLE_PLANET",
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("domVisiblePlanetProofReady", r.domVisiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("canvasMounted", r.canvasMounted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("baseGlobeDrawComplete", r.baseGlobeDrawComplete),
      line("visibleBaseGlobeCarrierActive", r.visibleBaseGlobeCarrierActive),
      line("visibleGlobeCarrierReady", r.visibleGlobeCarrierReady),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function publishViewDatasetLight() {
    state.lightDatasetPublishCount += 1;

    setDataset("hearthCanvasViewStateAccepted", String(state.viewStateAccepted));
    setDataset("hearthCanvasViewStateSource", state.viewStateSource);
    setDataset("hearthCanvasViewYaw", String(state.viewYaw));
    setDataset("hearthCanvasViewPitch", String(state.viewPitch));
    setDataset("hearthCanvasViewZoom", String(state.viewZoom));
    setDataset("hearthCanvasViewPhase", String(state.viewPhase));
    setDataset("hearthCanvasCanonicalRotationYaw", String(state.canonicalRotationYaw));
    setDataset("hearthCanvasViewStatePacketCount", String(state.viewStatePacketCount));
    setDataset("hearthCanvasLastControlPacketType", state.lastControlPacketType);
    setDataset("hearthCanvasLastControlInputType", state.lastControlInputType);

    setDataset("hearthCanvasBitmapSlidingUsed", "false");
    setDataset("hearthCanvasCssTranslationUsed", "false");
    setDataset("hearthCanvasTransformMotionUsed", "false");
    setDataset("hearthCanvasPriorFrameTranslationUsed", "false");
    setDataset("hearthCanvasInteractiveSphereRecomputeUsed", String(state.interactiveSphereRecomputeUsed));
    setDataset("hearthCanvasInteractiveSphereProjectionRecomputed", String(state.interactiveSphereProjectionRecomputed));
    setDataset("hearthCanvasSettledSphereProjectionRecomputed", String(state.settledSphereProjectionRecomputed));
    setDataset("hearthCanvasVerticalPolarityCorrectedByCanvas", "false");
    setDataset("hearthCanvasPointerPolarityOwnedByControls", "true");

    setDataset("hearthCanvasLastDrawMode", state.lastDrawMode);
    setDataset("hearthCanvasInteractiveDrawCount", String(state.interactiveDrawCount));
    setDataset("hearthCanvasSettledDrawCount", String(state.settledDrawCount));
    setDataset("hearthCanvasLastInteractiveDrawMethod", state.lastInteractiveDrawMethod);
    setDataset("hearthCanvasLastSettledDrawMethod", state.lastSettledDrawMethod);

    setDataset("visualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
  }

  function publishDatasetThrottled(force = false) {
    const ms = nowMs();

    if (!force && ms - lastFullPublishMs < FULL_RECEIPT_THROTTLE_MS) {
      publishViewDatasetLight();
      return false;
    }

    lastFullPublishMs = ms;
    publishDataset();
    return true;
  }

  function publishDataset() {
    state.datasetPublishCount += 1;

    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasLocalStationActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousInternalImplementationContract", PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasCurrentParentContract", CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", RECEIPT);
    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasHexSurfaceProjectionAnchorActive", "true");
    setDataset("hearthCanvasHexFourPairSourceAnchorActive", "true");
    setDataset("hearthCanvasPairedHexSurfaceExpected", "true");
    setDataset("hearthCanvasActualHexSurfaceV4Contract", HEX_SURFACE_ACTUAL_V4_CONTRACT);
    setDataset("hearthCanvasActualHexSurfaceV4RecognizedByName", String(state.actualHexSurfaceV4RecognizedByName));
    setDataset("hearthCanvasLegacyPairHexSurfaceV4Contract", HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT);
    setDataset("hearthCanvasLegacyPairHexSurfaceV4RecognizedByName", String(state.legacyPairHexSurfaceV4RecognizedByName));
    setDataset("hearthCanvasPairedHexSurfaceObserved", String(state.pairedHexSurfaceObserved));
    setDataset("hearthCanvasPairedHexSurfaceContract", state.pairedHexSurfaceContract);
    setDataset("hearthCanvasPairedHexSurfaceReceipt", state.pairedHexSurfaceReceipt);
    setDataset("hearthCanvasPairedHexSurfaceRecognized", String(state.pairedHexSurfaceRecognized));
    setDataset("hearthCanvasPairedHexSurfaceApiReady", String(state.pairedHexSurfaceApiReady));

    setDataset("hearthCanvasBitmapSlidingUsed", "false");
    setDataset("hearthCanvasCssTranslationUsed", "false");
    setDataset("hearthCanvasTransformMotionUsed", "false");
    setDataset("hearthCanvasPriorFrameTranslationUsed", "false");
    setDataset("hearthCanvasInteractiveSphereRecomputeUsed", String(state.interactiveSphereRecomputeUsed));
    setDataset("hearthCanvasInteractiveSphereProjectionRecomputed", String(state.interactiveSphereProjectionRecomputed));
    setDataset("hearthCanvasSettledSphereProjectionRecomputed", String(state.settledSphereProjectionRecomputed));
    setDataset("hearthCanvasVerticalPolarityCorrectedByCanvas", "false");
    setDataset("hearthCanvasPointerPolarityOwnedByControls", "true");

    setDataset("hearthCanvasRafSchedulerActive", "true");
    setDataset("hearthCanvasRequestAnimationFrameAvailable", String(state.requestAnimationFrameAvailable));
    setDataset("hearthCanvasSetTimeout40MotionPathRemoved", "true");
    setDataset("hearthCanvasMotionUsesRequestAnimationFrame", "true");
    setDataset("hearthCanvasFullHexRenderDeferredDuringInput", "true");
    setDataset("hearthCanvasDatasetPublicationThrottledDuringMotion", "true");
    setDataset("hearthCanvasReceiptPublicationThrottledDuringMotion", "true");
    setDataset("hearthCanvasRouteNotifySuppressedDuringInteractiveMotion", "true");
    setDataset("hearthCanvasPixelSamplingSuppressedDuringInteractiveMotion", "true");
    setDataset("hearthCanvasMountSuppressedDuringInteractiveMotion", "true");
    setDataset("hearthCanvasInputSettleDelayMs", String(INTERACTIVE_SETTLE_DELAY_MS));

    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasMounted", String(state.canvasMounted));
    setDataset("hearthCanvasMountFound", String(state.mountPresent));
    setDataset("hearthCanvasMountSelector", MOUNT_SELECTOR);
    setDataset("hearthCanvasSelector", state.canvasElementFound ? `#${CANVAS_ID}` : "NONE");
    setDataset("hearthCanvasWidthAttribute", String(state.canvasWidth));
    setDataset("hearthCanvasHeightAttribute", String(state.canvasHeight));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));

    setDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));
    setDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthCanvasHoldingFieldDrawComplete", String(state.holdingFieldDrawComplete));
    setDataset("hearthCanvasRendererDrawComplete", String(state.rendererDrawComplete));
    setDataset("hearthCanvasDrawCount", String(state.drawCount));
    setDataset("hearthCanvasInteractiveDrawCount", String(state.interactiveDrawCount));
    setDataset("hearthCanvasSettledDrawCount", String(state.settledDrawCount));
    setDataset("hearthCanvasFallbackDrawCount", String(state.fallbackDrawCount));
    setDataset("hearthCanvasHexDrawCount", String(state.hexDrawCount));
    setDataset("hearthCanvasLastDrawMode", state.lastDrawMode);
    setDataset("hearthCanvasLastDrawReason", state.lastDrawReason);
    setDataset("hearthCanvasLastDrawOk", String(state.lastDrawOk));
    setDataset("hearthCanvasLastDrawError", state.lastDrawError);
    setDataset("hearthCanvasLastInteractiveDrawMethod", state.lastInteractiveDrawMethod);
    setDataset("hearthCanvasLastSettledDrawMethod", state.lastSettledDrawMethod);
    setDataset("hearthCanvasLastPairDrawMethod", state.lastPairDrawMethod);

    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelSampleReadable", String(state.canvasPixelSampleReadable));
    setDataset("hearthCanvasPixelNonempty", String(state.canvasPixelNonempty));
    setDataset("hearthCanvasPixelUniqueColorCount", String(state.canvasPixelUniqueColorCount));
    setDataset("hearthCanvasPixelVarianceStatus", state.canvasPixelVarianceStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));

    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.canvasVisibleBaseGlobeCarrierActive));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasDomVisiblePlanetProofReady", String(state.domVisiblePlanetProofReady));
    setDataset("hearthCanvasCurrentVisibleProofValid", String(state.currentVisibleProofValid));

    setDataset("hearthCanvasHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthCanvasHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthCanvasHexAuthorityReceipt", state.hexAuthorityReceipt);
    setDataset("hearthCanvasHexAuthorityRecognized", String(state.hexAuthorityRecognized));
    setDataset("hearthCanvasHexAuthorityWideProbeReady", String(state.hexAuthorityWideProbeReady));
    setDataset("hearthCanvasHexAuthorityWideProbeFailedCount", state.hexAuthorityWideProbeFailedCount);

    setDataset("hearthCanvasDependencyScriptAdmissionAttempted", String(state.dependencyScriptAdmissionAttempted));
    setDataset("hearthCanvasDependencyScriptAdmissionStatus", state.dependencyScriptAdmissionStatus);
    setDataset("hearthCanvasDependencyScriptAdmissionReason", state.dependencyScriptAdmissionReason);

    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));
    setDataset("hearthCanvasParentReleaseObserved", String(state.releasePacketObserved));

    setDataset("hearthCanvasViewStateAccepted", String(state.viewStateAccepted));
    setDataset("hearthCanvasViewStateSource", state.viewStateSource);
    setDataset("hearthCanvasViewYaw", String(state.viewYaw));
    setDataset("hearthCanvasViewPitch", String(state.viewPitch));
    setDataset("hearthCanvasViewZoom", String(state.viewZoom));
    setDataset("hearthCanvasViewPhase", String(state.viewPhase));
    setDataset("hearthCanvasCanonicalRotationYaw", String(state.canonicalRotationYaw));
    setDataset("hearthCanvasRenderedYaw", String(state.renderedYaw));
    setDataset("hearthCanvasRenderedPitch", String(state.renderedPitch));
    setDataset("hearthCanvasRenderedZoom", String(state.renderedZoom));
    setDataset("hearthCanvasRenderedPhase", String(state.renderedPhase));
    setDataset("hearthCanvasViewStatePacketCount", String(state.viewStatePacketCount));
    setDataset("hearthCanvasLastControlPacketType", state.lastControlPacketType);
    setDataset("hearthCanvasLastControlInputType", state.lastControlInputType);

    setDataset("hearthCanvasF13CanvasReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13CanvasEvidenceStrict", "false");
    setDataset("hearthCanvasF13CanvasEvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13HardFail", "false");
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);

    setDataset("hearthCanvasOwnsCanvasDrawing", "true");
    setDataset("hearthCanvasOwnsCanvasMounting", "true");
    setDataset("hearthCanvasOwnsRouteConductorAuthority", "false");
    setDataset("hearthCanvasOwnsControlAdmission", "false");
    setDataset("hearthCanvasOwnsControlTruth", "false");
    setDataset("hearthCanvasOwnsControlPolarityTruth", "false");
    setDataset("hearthCanvasOwnsHexTruth", "false");
    setDataset("hearthCanvasOwnsHexSurfaceTruth", "false");
    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishViewGlobalsLight() {
    root.HEARTH_CANVAS_VIEW_STATE = getViewStatePacket();
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = {
      ...getViewStatePacket(),
      lastControlPacketType: state.lastControlPacketType,
      lastControlInputType: state.lastControlInputType,
      updatedAt: state.viewStateLastAcceptedAt,
      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,
      interactiveSphereRecomputeUsed: state.interactiveSphereRecomputeUsed,
      ...FINAL_FALSE
    };

    if (root.HEARTH && typeof root.HEARTH === "object") {
      root.HEARTH.canvasViewState = root.HEARTH_CANVAS_VIEW_STATE;
      root.HEARTH.canvasLastViewPacket = root.HEARTH_CANVAS_LAST_VIEW_PACKET;
    }

    if (root.DEXTER_LAB && typeof root.DEXTER_LAB === "object") {
      root.DEXTER_LAB.hearthCanvasViewState = root.HEARTH_CANVAS_VIEW_STATE;
      root.DEXTER_LAB.hearthCanvasLastViewPacket = root.HEARTH_CANVAS_LAST_VIEW_PACKET;
    }
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE = api;
    root.HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER = api;
    root.HEARTH_CANVAS_VISIBLE_PLANET = api;

    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasHubHexSurfaceAnchorReceiverThrottledInteractive = api;
    hearth.canvasHubRafSphereRotationPairReceiver = api;
    hearth.canvasHubRafFastInteractiveDeferredHexRenderReceiver = api;
    hearth.canvasHubFastViewTransformDeferredRenderReceiver = api;
    hearth.canvasPlanetaryViewControlReceiver = api;
    hearth.canvasHub = api;
    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasAuthority = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasVisibleBaseGlobeCarrier = api;
    hearth.canvasVisiblePlanet = api;

    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasHubHexSurfaceAnchorReceiverThrottledInteractive = api;
    lab.hearthCanvasHubRafSphereRotationPairReceiver = api;
    lab.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver = api;
    lab.hearthCanvasHubFastViewTransformDeferredRenderReceiver = api;
    lab.hearthCanvasPlanetaryViewControlReceiver = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasVisiblePlanet = api;

    const receipt = getCanvasStationReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_HEX_SURFACE_ANCHOR_RECEIVER_THROTTLED_INTERACTIVE_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_STATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PROOF_RECEIPT = receipt;

    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubHexSurfaceAnchorReceiverThrottledInteractiveReceipt = receipt;
    hearth.canvasHubRafSphereRotationPairReceiverReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasReceipt = receipt;
    hearth.canvasLocalStationReceipt = receipt;
    hearth.canvasStationReceipt = receipt;
    hearth.canvasExpressionHubReceipt = receipt;
    hearth.canvasFingerManagerReceipt = receipt;
    hearth.canvasVisibleBaseGlobeCarrierReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasVisibleProofReceipt = receipt;

    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasHubHexSurfaceAnchorReceiverThrottledInteractiveReceipt = receipt;
    lab.hearthCanvasHubRafSphereRotationPairReceiverReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasLocalStationReceipt = receipt;
    lab.hearthCanvasExpressionHubReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;

    publishViewGlobalsLight();
    publishDatasetThrottled(true);

    return api;
  }

  function boot(reason = "boot") {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.bootCount += 1;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.requestAnimationFrameAvailable = isFunction(root.requestAnimationFrame);

    publishDatasetThrottled(true);
    publishGlobals();

    mountCanvas(reason);

    validateHexAuthority();
    validateHexSurface();

    drawInteractiveSphere("first-hex-surface-anchor-mounted-view");

    ensureDependencyScripts("boot-hex-surface-anchor-dependency-admission").then(() => {
      validateHexAuthority();
      validateHexSurface();
      scheduleSettledSphereFrame("boot-hex-surface-anchor-settled-render");
    });

    if (root.addEventListener && !resizeBound) {
      resizeBound = true;

      try {
        root.addEventListener("resize", () => {
          const canvas = refs.canvas || ensureCanvasSurface();
          if (canvas) sizeCanvasToMount(canvas, true);
          scheduleDraw("viewport-resize");
        }, { passive: true });
      } catch (_error) {}
    }

    state.bootComplete = true;
    state.updatedAt = nowIso();

    publishDatasetThrottled(true);
    publishGlobals();
    scheduleRouteNotify("canvas-boot-complete");

    record("HEARTH_CANVAS_V12_3_3_HEX_SURFACE_ANCHOR_BOOT_COMPLETE", {
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasContext2dReady: state.canvasContext2dReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      hexSurfaceProjectionAnchorActive: true,
      hexFourPairSourceAnchorActive: true,
      actualHexSurfaceV4Contract: HEX_SURFACE_ACTUAL_V4_CONTRACT,
      pairedHexSurfaceContract: state.pairedHexSurfaceContract,
      bitmapSlidingUsed: false,
      cssTranslationUsed: false,
      verticalPolarityCorrectedByCanvas: false,
      pointerPolarityOwnedByControls: true,
      noFinalClaimsPreserved: true
    });

    return getReceipt();
  }

  function mount(reason = "mount") {
    mountCanvas(reason);
    drawSettledSphere(reason);
    return getReceipt();
  }

  function init(reason = "init") { return boot(reason); }
  function start(reason = "start") { return boot(reason); }
  function run(reason = "run") { return boot(reason); }

  function dispose(reason = "dispose") {
    cancelAnimationFrameSafe(interactiveRaf);
    interactiveRaf = 0;

    if (settledTimer && isFunction(root.clearTimeout)) {
      root.clearTimeout(settledTimer);
      settledTimer = 0;
    }

    if (routeNotifyTimer && isFunction(root.clearTimeout)) {
      root.clearTimeout(routeNotifyTimer);
      routeNotifyTimer = 0;
    }

    record("HEARTH_CANVAS_V12_3_3_DISPOSED", { reason });
    publishDatasetThrottled(true);
    publishGlobals();

    return getReceipt();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    INTERNAL_IMPLEMENTATION_CONTRACT,
    INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_1_RECEIPT,
    LINEAGE_V12_CONTRACT,
    LINEAGE_V12_RECEIPT,
    VERSION,
    ROUTE,
    FILE,
    HTML_FILE,
    INDEX_FILE,
    ROUTE_CONDUCTOR_FILE,
    CONTROL_FILE,
    HEX_AUTHORITY_FILE,
    HEX_SURFACE_FILE,
    HEX_SURFACE_ACTUAL_V4_CONTRACT,
    HEX_SURFACE_ACTUAL_V4_RECEIPT,
    HEX_SURFACE_EXPECTED_PAIR_V4_CONTRACT,
    HEX_SURFACE_EXPECTED_PAIR_V4_RECEIPT,
    HEX_AUTHORITY_CONTRACT,
    HEX_AUTHORITY_RECEIPT,

    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    role: "canvas-hub-hex-surface-anchor-receiver-throttled-interactive",

    boot,
    init,
    start,
    run,
    mount,
    dispose,

    mountCanvas,
    drawFrame,
    scheduleDraw,
    drawInteractiveSphere,
    drawSettledSphere,
    drawFallbackSphereFrame,
    callHexSurfaceRenderer,
    drawVisibleExpression,

    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,
    receiveCanvasReleasePacket,
    receiveCanvasParentPacket,
    acceptReleasePacket,

    receiveViewState,
    receiveCanvasViewState,
    consumeCanvasViewState,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveControlsPacket,
    receiveControlViewPacket,
    receiveControlPacket,
    receivePlanetaryControlPacket,
    receiveViewDelta,
    applyViewDelta,
    applyViewState,
    setViewState,
    setView,
    updateView,
    getViewStatePacket,

    validateHexAuthority,
    validateHexSurface,
    resolveHexAuthority,
    resolveHexSurface,
    ensureDependencyScripts,
    notifyRouteConductor,

    getCanvasStationSummary,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getExpressionHubSummary,
    getExpressionHubReceipt,
    getVisibleBaseGlobeReceipt,
    getBaseGlobeReceipt,
    getVisibleGlobeReceipt,
    getVisiblePlanetReceipt,
    getCanvasVisibleProofReceipt,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getStatus,
    getReport,
    getState,
    getReceipt,
    getReceiptText,
    publishDataset,
    publishDatasetThrottled,
    publishViewDatasetLight,
    publishGlobals,
    publishViewGlobalsLight,

    canvasHubActive: true,
    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    compositeFirstVisiblePathActive: true,
    childDistributionSwitchboardActive: true,
    routeConductorSummarySurfaceActive: true,
    canvasLocalStationApiReady: true,
    canvasParentBootMethodAvailable: true,

    hexSurfaceProjectionAnchorActive: true,
    hexFourPairSourceAnchorActive: true,
    pairedHexSurfaceExpected: true,
    acceptedHexSurfaceContracts: ACCEPTED_HEX_SURFACE_CONTRACTS.slice(),

    bitmapSlidingUsed: false,
    cssTranslationUsed: false,
    canvasTransformMotionUsed: false,
    priorFrameTranslationUsed: false,
    verticalPolarityCorrectedByCanvas: false,
    pointerPolarityOwnedByControls: true,

    rafSchedulerActive: true,
    setTimeout40MotionPathRemoved: true,
    motionUsesRequestAnimationFrame: true,
    fullHexRenderDeferredDuringInput: true,
    datasetPublicationThrottledDuringMotion: true,
    receiptPublicationThrottledDuringMotion: true,
    routeNotifySuppressedDuringInteractiveMotion: true,
    pixelSamplingSuppressedDuringInteractiveMotion: true,
    mountSuppressedDuringInteractiveMotion: true,

    ownsCanvasDrawing: true,
    ownsCanvasMounting: true,
    ownsCanvasSurfaceReception: true,
    ownsCanvasOutputCarrier: true,
    ownsHtmlShell: false,
    ownsIndexButtonAuthority: false,
    ownsRouteConductorAuthority: false,
    ownsControlAdmission: false,
    ownsControlTruth: false,
    ownsControlPolarityTruth: false,
    ownsHexTruth: false,
    ownsHexSurfaceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsDiagnosticRailCaseSelection: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    publishDatasetThrottled(true);
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot("dom-content-loaded"), { once: true });
      } else {
        boot("document-ready");
      }
    } else {
      boot("no-document");
    }
  } catch (error) {
    state.lastDrawError = error && error.message ? String(error.message) : String(error);
    recordError("HEARTH_CANVAS_V12_3_3_INITIALIZATION_FAILED", error);

    try {
      publishDatasetThrottled(true);
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
