// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIVER_TNT_v12_5
// Full-file replacement.
// Canvas Hub / receiver-output carrier / local visible-pixel proof / Hex-gate transmission only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by Route Conductor, Controls, diagnostics, and Hex Surface.
// - Preserve v12_3_2 / v12_3_1 / v12_2 / v12_1 / v12 lineage aliases.
// - Keep Canvas as receiver/output carrier only.
// - Bind a real mounted 2D canvas surface.
// - Perform a lawful Canvas-owned receiver/output-carrier draw so the surface is no longer blank.
// - Publish exact post-draw pixel-sample coordinates so the diagnostic rail can distinguish:
//   1. Canvas did not mount,
//   2. Canvas mounted but did not draw,
//   3. Canvas drew visible pixels,
//   4. Hex Surface gate was missing,
//   5. Hex Surface accepted the packet,
//   6. Pointer Finger transmission was observed downstream.
// - Route all downstream transmission through Hex Surface as the gate before Pointer Finger.
// - Do not call Pointer Finger directly.
// - Do not reopen Canvas Bishops, terrain truth, hydrology truth, elevation truth, material truth, diagnostic truth,
//   Hex truth, or Pointer Finger truth.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - index priest / button authority
// - Route Conductor authority
// - Queen/Controls authority
// - Hex Surface truth
// - Pointer Finger truth
// - Canvas Bishop internals
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIVER_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIVER_RECEIPT_v12_5";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIVER_TNT_v12_4";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIVER_RECEIPT_v12_4";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_RECEIPT_v12_3_2";

  const LINEAGE_V12_3_1_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1";
  const LINEAGE_V12_2_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";

  const VERSION =
    "2026-06-06.hearth-canvas-local-visible-pixel-proof-hex-gate-receiver-v12-5";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const CANVAS_MOUNT_SELECTOR = "#hearthCanvasMount";
  const GLOBE_STAGE_SELECTOR = "#hearthGlobeStage";
  const CANVAS_SELECTOR = "canvas[data-hearth-visible-canvas='true']";

  const CONTROL_PACKET_TYPE = "HEARTH_CONTROLS_PLANETARY_VIEW_DELTA_PACKET";
  const CANVAS_HEX_GATE_PACKET_TYPE =
    "HEARTH_CANVAS_TO_HEX_SURFACE_POINTER_FINGER_GATE_PACKET_v12_5";

  const TRANSMISSION_CHRONOLOGY = Object.freeze([
    "ROUTE_CONDUCTOR",
    "CONTROLS_QUEEN",
    "CANVAS_RECEIVER_OUTPUT_CARRIER",
    "CANVAS_LOCAL_VISIBLE_PIXEL_PROOF",
    "HEX_SURFACE_GATE",
    "POINTER_FINGER_DOWNSTREAM_PUBLIC_RECEIVER"
  ]);

  const ACTIVE_CANVAS_CONTRACTS = Object.freeze([
    CONTRACT,
    INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_CONTRACT,
    LINEAGE_V12_3_1_CONTRACT,
    LINEAGE_V12_2_CONTRACT,
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_CONTRACT,
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const ACCEPTED_CONTROL_CONTRACTS = Object.freeze([
    EXPECTED_CONTROL_CONTRACT,
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v5",
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4",
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "HEARTH.hexPairRenderer",
    "HEARTH.hexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexPairRenderer"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "HEARTH.hexAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexAuthority"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f13EligibleForCanvas: false,
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
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CANVAS_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_CANVAS: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const view = {
    yaw: 0,
    pitch: 0,
    zoom: 1,
    phase: 0,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4
  };

  const surface = {
    mount: null,
    canvas: null,
    ctx: null,
    selector: "UNKNOWN",
    mountSelector: "UNKNOWN",
    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    dpr: 1
  };

  const frame = {
    scheduled: false,
    rafId: 0,
    pendingReason: "",
    pendingPacket: null,
    flushCount: 0
  };

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
    lineageV122Contract: LINEAGE_V12_2_CONTRACT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV12Contract: LINEAGE_V12_CONTRACT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    mounted: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_V12_5_LOADED",

    receiverOutputCarrierActive: true,
    localVisiblePixelProofActive: true,
    hexGateTransmissionActive: true,
    hexGateRequired: true,
    pointerFingerDirectCallSuppressed: true,
    canvasBishopInspectionSuppressed: true,
    canvasBishopMutationSuppressed: true,
    canvasExpressionTruthOwned: false,
    canvasSurfaceCarrierOwned: true,
    canvasOutputCarrierOwned: true,

    routeReleaseAccepted: false,
    routeReleasePacket: null,
    routeReleaseSource: "NONE",
    routeReleaseStatus: "WAITING_ROUTE_CONDUCTOR_RELEASE_OR_BOOT_FRAME",

    controlsObserved: false,
    controlContract: "",
    controlReceipt: "",
    controlPacketAccepted: false,
    controlPacketRejected: false,
    controlPacketRejectionReason: "",
    lastControlPacketSignature: "",
    lastControlPacketAt: "",
    lastControlPacketType: "NONE",

    canvasMountFound: false,
    canvasMountSelector: "UNKNOWN",
    canvasElementFound: false,
    canvasSelector: "UNKNOWN",
    canvasInMount: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasContext2DReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVisible: false,
    canvasPixelSampleCount: 0,
    canvasVisiblePixelCount: 0,
    canvasAlphaPixelCount: 0,
    canvasUniqueColorCount: 0,
    canvasDomSurfaceMounted: false,
    canvasDomSurfaceProofReady: false,

    canvasLocalVisibleDrawAttempted: false,
    canvasLocalVisibleDrawExecuted: false,
    canvasLocalVisibleDrawReason: "NOT_ATTEMPTED",
    canvasLocalVisibleDrawCount: 0,
    canvasLocalPixelSampleBeforeDraw: null,
    canvasLocalPixelSampleAfterDraw: null,
    canvasLocalDrawFailureReason: "NONE",

    downstreamExpressionPacketObserved: false,
    downstreamExpressionPacketSource: "NONE",
    downstreamExpressionPacketDrawable: false,
    downstreamExpressionPacketDrawableReason: "NO_DOWNSTREAM_PACKET_OBSERVED",

    hexSurfaceObserved: false,
    hexSurfaceAuthoritySource: "NONE",
    hexSurfaceContract: "",
    hexSurfaceReceipt: "",
    hexSurfaceContractRecognized: false,
    hexSurfaceReceiverReady: false,
    hexSurfaceDeliveryStatus: "WAITING_HEX_SURFACE_GATE",
    hexSurfaceDeliveryMethod: "NONE",
    hexSurfaceDeliveryReason: "NO_PACKET_DELIVERED",
    hexSurfaceAcceptedPacket: false,

    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "",
    hexAuthorityReceipt: "",
    hexAuthorityRecognized: false,

    hexGatePacketDelivered: false,
    hexGateAcceptedByHexSurface: false,
    pointerFingerTransmissionObserved: false,
    pointerFingerTransmissionSource: "NONE",

    packetCount: 0,
    hexGatePacketCount: 0,
    hexGateDeliveryCount: 0,
    hexGateMissCount: 0,
    eventCount: 0,
    errorCount: 0,
    receiptPublishCount: 0,
    aliasPublishCount: 0,
    renderFrameCount: 0,
    listenerBound: false,

    lastViewPacket: null,
    lastHexGatePacket: null,
    lastHexGatePacketAt: "",
    lastHexGateReason: "NONE",
    lastHexGateDeliveryReceipt: null,

    finalCanvasPixelVisible: false,
    finalCanvasPixelFailureClass: "NOT_RUN",
    firstFailedCoordinate: "BOOT_NOT_RUN",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_AND_SAMPLE_LOCAL_VISIBLE_PIXELS",
    postgameStatus: "CANVAS_LOADED_WAITING_BOOT",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let bootPromise = null;

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 160);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 100);
    state.errorCount = state.errors.length;
    state.latestEvent = item.code;
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

  function firstGlobal(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    if (!doc || !doc.querySelector) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readAuthoritySnapshot(authority) {
    if (!authority || !isObject(authority)) return {};
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;
    return {};
  }

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasContract",
        "canvasLocalStationContract",
        "hexSurfaceContract",
        "hexContract",
        "controlContract",
        "controlsContract",
        "routeConductorContract",
        "sourceContract",
        "contract",
        "CONTRACT"
      ]),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "canvasLocalStationReceipt",
        "hexSurfaceReceipt",
        "hexReceipt",
        "controlReceipt",
        "controlsReceipt",
        "routeConductorReceipt",
        "sourceReceipt",
        "receipt",
        "RECEIPT"
      ]),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function routeContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(text) || text.includes("HEARTH_ROUTE_CONDUCTOR");
  }

  function controlContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_CONTROL_CONTRACTS.includes(text) || text.includes("HEARTH_CONTROLS");
  }

  function hexContractRecognized(contract) {
    const text = safeString(contract);
    return (
      text === EXPECTED_HEX_SURFACE_CONTRACT ||
      text.includes("HEARTH_HEX_SURFACE") ||
      text.includes("HEARTH_HEX")
    );
  }

  function hasNoForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return !(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f13ClaimedByCanvas === true ||
      p.f21EligibleForNorth === true ||
      p.f21Claimed === true ||
      p.f21ClaimedByCanvas === true ||
      p.f21SubmittedToNorth === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
      p.controlReadyClaimed === true ||
      p.motionReadyClaimed === true ||
      p.touchReadyClaimed === true ||
      p.dragReadyClaimed === true ||
      p.completionLatched === true ||
      p.finalCompletionLatched === true ||
      p.degradedCompletionLatched === true ||
      p.visualPassClaimed === true ||
      p.finalVisualPassClaimed === true ||
      p.generatedImage === true ||
      p.graphicBox === true ||
      p.webGL === true ||
      p.webgl === true
    );
  }

  function findMount(preferred = null) {
    if (preferred && preferred.nodeType === 1) return preferred;
    if (!doc) return null;

    return (
      q(CANVAS_MOUNT_SELECTOR) ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]") ||
      q(GLOBE_STAGE_SELECTOR) ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]") ||
      q("main") ||
      q("body")
    );
  }

  function findCanvas(mount = null) {
    if (!doc) return null;

    return (
      (mount && mount.querySelector && mount.querySelector(CANVAS_SELECTOR)) ||
      q(CANVAS_SELECTOR) ||
      (mount && mount.querySelector && mount.querySelector("canvas[data-hearth-canvas-hub='true']")) ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      (mount && mount.querySelector && mount.querySelector("canvas[data-hearth-canvas='true']")) ||
      q("canvas[data-hearth-canvas='true']") ||
      (mount && mount.querySelector && mount.querySelector("canvas[data-hearth-canvas-texture='true']")) ||
      q("canvas[data-hearth-canvas-texture='true']") ||
      (mount && mount.querySelector && mount.querySelector("canvas")) ||
      q("#hearthCanvasMount canvas") ||
      q("canvas")
    );
  }

  function describeElement(element) {
    if (!element || !element.tagName) return "NONE";
    const tag = safeString(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const role =
      element.getAttribute && element.getAttribute("data-hearth-visible-canvas") !== null
        ? "[data-hearth-visible-canvas]"
        : element.getAttribute && element.getAttribute("data-hearth-canvas-mount") !== null
          ? "[data-hearth-canvas-mount]"
          : element.getAttribute && element.getAttribute("data-hearth-globe-stage") !== null
            ? "[data-hearth-globe-stage]"
            : "";
    return `${tag}${id}${role}`;
  }

  function bindSurface(options = {}) {
    if (!doc || state.disposed) return false;

    const preferredMount = options.mount && options.mount.nodeType === 1 ? options.mount : null;
    const mount = findMount(preferredMount);

    if (!mount) {
      state.canvasMountFound = false;
      state.canvasMountSelector = "UNKNOWN";
      state.canvasElementFound = false;
      state.canvasDomSurfaceMounted = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_MOUNT";
      state.recommendedNextFile = HTML_FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_CANVAS_MOUNT_EXISTS";
      state.postgameStatus = "CANVAS_RECEIVER_WAITING_DOM_MOUNT";
      updateDatasetLight();
      return false;
    }

    let canvas = findCanvas(mount);

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("aria-label", "Hearth canvas surface");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.maxWidth = "100%";
      canvas.style.touchAction = "none";
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    canvas.dataset.hearthCanvasInternalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    canvas.dataset.hearthCanvasLocalVisiblePixelProofActive = "true";
    canvas.dataset.hearthCanvasHexGateTransmissionActive = "true";
    canvas.dataset.hearthCanvasPointerFingerDirectCallSuppressed = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    surface.mount = mount;
    surface.canvas = canvas;
    surface.selector = CANVAS_SELECTOR;
    surface.mountSelector =
      mount.id === "hearthCanvasMount"
        ? CANVAS_MOUNT_SELECTOR
        : mount.id === "hearthGlobeStage"
          ? GLOBE_STAGE_SELECTOR
          : describeElement(mount);

    try {
      surface.ctx =
        canvas.getContext("2d", { alpha: true, desynchronized: true, willReadFrequently: true }) ||
        canvas.getContext("2d", { willReadFrequently: true }) ||
        canvas.getContext("2d");
    } catch (_error) {
      surface.ctx = null;
    }

    resizeSurface();

    state.mounted = true;
    state.canvasMountFound = true;
    state.canvasMountSelector = surface.mountSelector;
    state.canvasElementFound = true;
    state.canvasSelector = surface.selector;
    state.canvasInMount = Boolean(mount.contains && mount.contains(canvas));
    state.canvasContext2DReady = Boolean(surface.ctx);

    scanCanvasSurface();
    updateDatasetLight();

    return true;
  }

  function resizeSurface() {
    if (!surface.canvas || !surface.mount) return false;

    let rect = null;
    try {
      rect = surface.mount.getBoundingClientRect ? surface.mount.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    const rectWidth = safeNumber(rect && rect.width, 0);
    const rectHeight = safeNumber(rect && rect.height, 0);

    const fallbackWidth =
      safeNumber(surface.mount.clientWidth, 0) ||
      safeNumber(root.innerWidth, 0) ||
      720;
    const fallbackHeight =
      safeNumber(surface.mount.clientHeight, 0) ||
      Math.round(fallbackWidth * 0.75) ||
      720;

    const cssWidth = Math.max(1, Math.round(rectWidth || fallbackWidth));
    const cssHeight = Math.max(1, Math.round(rectHeight || fallbackHeight));
    const dpr = Math.max(1, Math.min(2.5, safeNumber(root.devicePixelRatio, 1)));

    const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

    if (surface.canvas.width !== pixelWidth) surface.canvas.width = pixelWidth;
    if (surface.canvas.height !== pixelHeight) surface.canvas.height = pixelHeight;

    surface.canvas.style.width = `${cssWidth}px`;
    surface.canvas.style.height = `${cssHeight}px`;

    surface.width = pixelWidth;
    surface.height = pixelHeight;
    surface.cssWidth = cssWidth;
    surface.cssHeight = cssHeight;
    surface.dpr = dpr;

    return true;
  }

  function sampleCanvasPixels() {
    const canvas = surface.canvas || findCanvas(surface.mount || findMount());
    const ctx = surface.ctx || (canvas && canvas.getContext && canvas.getContext("2d", { willReadFrequently: true }));

    if (!canvas || !ctx) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "NO_CANVAS_CONTEXT"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "CANVAS_DIMENSIONS_ZERO"
      };
    }

    const points = [
      [0.12, 0.12],
      [0.25, 0.25],
      [0.5, 0.25],
      [0.75, 0.25],
      [0.25, 0.5],
      [0.5, 0.5],
      [0.75, 0.5],
      [0.25, 0.75],
      [0.5, 0.75],
      [0.75, 0.75],
      [0.88, 0.88]
    ];

    let sampleCount = 0;
    let visiblePixelCount = 0;
    let alphaPixelCount = 0;
    const unique = new Set();

    try {
      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - 1, Math.floor(width * px)));
        const y = Math.max(0, Math.min(height - 1, Math.floor(height * py)));
        const data = ctx.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const red = data[0] || 0;
        const green = data[1] || 0;
        const blue = data[2] || 0;
        const alpha = data[3] || 0;

        if (alpha > 0) alphaPixelCount += 1;
        if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;
        unique.add(`${red},${green},${blue},${alpha}`);
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        reason: safeString(error && error.message ? error.message : error).slice(0, 600)
      };
    }

    const visible = visiblePixelCount > 0;

    return {
      status: visible
        ? "PIXEL_SAMPLE_VISIBLE"
        : alphaPixelCount > 0
          ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
          : "PIXEL_SAMPLE_BLANK",
      visible,
      sampleCount,
      visiblePixelCount,
      alphaPixelCount,
      uniqueColorCount: unique.size,
      reason: visible
        ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
        : alphaPixelCount > 0
          ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
          : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID"
    };
  }

  function scanCanvasSurface() {
    const canvas = surface.canvas || findCanvas(surface.mount || findMount());
    const mount = surface.mount || findMount();

    let rect = null;
    try {
      rect = canvas && canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    const attrWidth = safeNumber(canvas && canvas.width, 0);
    const attrHeight = safeNumber(canvas && canvas.height, 0);
    const rectWidth = safeNumber(rect && rect.width, 0);
    const rectHeight = safeNumber(rect && rect.height, 0);
    const rectNonzero = Boolean(canvas && ((attrWidth > 0 && attrHeight > 0) || (rectWidth > 0 && rectHeight > 0)));

    let computedVisible = false;
    try {
      if (canvas && root.getComputedStyle) {
        const style = root.getComputedStyle(canvas);
        computedVisible = Boolean(
          style &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.visibility !== "collapse" &&
          safeNumber(style.opacity, 1) > 0
        );
      }
    } catch (_error) {
      computedVisible = rectNonzero;
    }

    const sample = sampleCanvasPixels();

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mount ? surface.mountSelector || describeElement(mount) : "UNKNOWN";
    state.canvasElementFound = Boolean(canvas);
    state.canvasSelector = canvas ? surface.selector || describeElement(canvas) : "UNKNOWN";
    state.canvasInMount = Boolean(canvas && mount && mount.contains && mount.contains(canvas));
    state.canvasRectNonzero = rectNonzero;
    state.canvasComputedVisible = computedVisible;
    state.canvasContext2DReady = Boolean(surface.ctx || (canvas && canvas.getContext));
    state.canvasPixelSampleStatus = sample.status;
    state.canvasPixelVisible = sample.visible;
    state.canvasPixelSampleCount = sample.sampleCount;
    state.canvasVisiblePixelCount = sample.visiblePixelCount;
    state.canvasAlphaPixelCount = sample.alphaPixelCount;
    state.canvasUniqueColorCount = sample.uniqueColorCount;
    state.canvasDomSurfaceMounted = Boolean(canvas && rectNonzero && computedVisible);
    state.canvasDomSurfaceProofReady = Boolean(state.canvasDomSurfaceMounted && sample.visible);
    state.finalCanvasPixelVisible = sample.visible;
    state.finalCanvasPixelFailureClass = sample.visible
      ? "NONE_CANVAS_VISIBLE_PIXELS_PRESENT"
      : sample.status === "PIXEL_SAMPLE_BLANK"
        ? "CANVAS_PIXEL_SAMPLE_BLANK"
        : sample.status;

    return {
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,
      canvasUniqueColorCount: state.canvasUniqueColorCount,
      canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
      canvasDomSurfaceProofReady: state.canvasDomSurfaceProofReady
    };
  }

  function drawLocalVisibleCarrierFrame(reason = "manual") {
    state.canvasLocalVisibleDrawAttempted = true;
    state.canvasLocalVisibleDrawReason = reason;

    if (!bindSurface()) {
      state.canvasLocalVisibleDrawExecuted = false;
      state.canvasLocalDrawFailureReason = "CANVAS_SURFACE_NOT_BOUND";
      scanCanvasSurface();
      return false;
    }

    resizeSurface();

    const canvas = surface.canvas;
    const ctx = surface.ctx;

    state.canvasLocalPixelSampleBeforeDraw = sampleCanvasPixels();

    if (!canvas || !ctx) {
      state.canvasLocalVisibleDrawExecuted = false;
      state.canvasLocalDrawFailureReason = "CANVAS_CONTEXT_2D_UNAVAILABLE";
      scanCanvasSurface();
      return false;
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0) {
      state.canvasLocalVisibleDrawExecuted = false;
      state.canvasLocalDrawFailureReason = "CANVAS_DIMENSIONS_ZERO";
      scanCanvasSurface();
      return false;
    }

    try {
      if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(7, 17, 26, 1)";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const baseRadius = Math.max(12, Math.min(width, height) * 0.38 * clamp(view.zoom, 0.72, 1.28));
      const pitchOffset = clamp(view.pitch, -1.25, 1.25) * baseRadius * 0.18;

      const atmosphere = ctx.createRadialGradient(cx - baseRadius * 0.28, cy - baseRadius * 0.35 + pitchOffset, baseRadius * 0.05, cx, cy + pitchOffset, baseRadius * 1.16);
      atmosphere.addColorStop(0, "rgba(108, 184, 255, 0.72)");
      atmosphere.addColorStop(0.38, "rgba(37, 93, 136, 0.88)");
      atmosphere.addColorStop(0.78, "rgba(13, 42, 66, 0.95)");
      atmosphere.addColorStop(1, "rgba(2, 9, 15, 1)");

      ctx.beginPath();
      ctx.arc(cx, cy + pitchOffset, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = atmosphere;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy + pitchOffset, baseRadius * 0.985, 0, Math.PI * 2);
      ctx.clip();

      const yaw = safeNumber(view.yaw, 0);
      const pitch = safeNumber(view.pitch, 0);

      ctx.globalAlpha = 0.92;
      for (let band = -4; band <= 4; band += 1) {
        const y = cy + pitchOffset + (band / 5) * baseRadius * 0.75 + Math.sin(yaw + band) * baseRadius * 0.025;
        const bandWidth = baseRadius * (0.95 - Math.abs(band) * 0.075);
        const x = cx + Math.sin(yaw * 0.7 + band * 1.7) * baseRadius * 0.18;
        const h = Math.max(5, baseRadius * (0.06 + (band % 2 === 0 ? 0.025 : 0.012)));

        ctx.beginPath();
        ctx.ellipse(x, y, bandWidth * 0.52, h, Math.sin(yaw + band) * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = band % 2 === 0
          ? "rgba(118, 150, 96, 0.72)"
          : "rgba(88, 122, 86, 0.54)";
        ctx.fill();
      }

      ctx.globalAlpha = 0.52;
      for (let mark = 0; mark < 18; mark += 1) {
        const angle = yaw * 0.55 + mark * 2.3999632297;
        const r = baseRadius * (0.18 + ((mark * 37) % 61) / 100);
        const x = cx + Math.cos(angle) * r * 0.82;
        const y = cy + pitchOffset + Math.sin(angle + pitch) * r * 0.55;
        const w = baseRadius * (0.035 + ((mark * 11) % 17) / 800);
        const h = baseRadius * (0.012 + ((mark * 7) % 13) / 1200);

        ctx.beginPath();
        ctx.ellipse(x, y, w, h, angle * 0.37, 0, Math.PI * 2);
        ctx.fillStyle = mark % 3 === 0
          ? "rgba(175, 148, 101, 0.7)"
          : "rgba(71, 118, 92, 0.64)";
        ctx.fill();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy + pitchOffset, baseRadius, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, baseRadius * 0.018);
      ctx.strokeStyle = "rgba(185, 229, 255, 0.64)";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - baseRadius * 0.18, cy - baseRadius * 0.18 + pitchOffset, baseRadius * 0.28, 0, Math.PI * 2);
      const highlight = ctx.createRadialGradient(
        cx - baseRadius * 0.22,
        cy - baseRadius * 0.22 + pitchOffset,
        0,
        cx - baseRadius * 0.18,
        cy - baseRadius * 0.18 + pitchOffset,
        baseRadius * 0.42
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.22)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = highlight;
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(142, 218, 255, 0.55)";
      ctx.fillRect(Math.max(0, cx - 2), Math.max(0, cy + pitchOffset - 2), 4, 4);

      state.canvasLocalVisibleDrawExecuted = true;
      state.canvasLocalDrawFailureReason = "NONE";
      state.canvasLocalVisibleDrawCount += 1;
      state.renderFrameCount += 1;

      state.canvasLocalPixelSampleAfterDraw = sampleCanvasPixels();
      scanCanvasSurface();

      if (state.finalCanvasPixelVisible) {
        state.firstFailedCoordinate = "NONE_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_READY";
        state.recommendedNextFile = HEX_SURFACE_FILE;
        state.recommendedNextAction = state.hexSurfaceReceiverReady
          ? "OBSERVE_HEX_SURFACE_GATE_AND_POINTER_FINGER_TRANSMISSION"
          : "CONFIRM_HEX_SURFACE_PUBLIC_GATE_RECEIVER";
        state.postgameStatus = "CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_READY";
      } else {
        state.firstFailedCoordinate = "CANVAS_LOCAL_DRAW_EXECUTED_BUT_PIXEL_SAMPLE_NOT_VISIBLE";
        state.recommendedNextFile = FILE;
        state.recommendedNextAction = "AUDIT_CANVAS_LOCAL_VISIBLE_DRAW_PATH_AND_PIXEL_SAMPLE_GRID";
        state.postgameStatus = "CANVAS_LOCAL_DRAW_EXECUTED_PIXEL_PROOF_FAILED";
      }

      record("HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_FRAME_DRAWN", {
        reason,
        sampleStatus: state.canvasPixelSampleStatus,
        visiblePixelCount: state.canvasVisiblePixelCount,
        finalCanvasPixelVisible: state.finalCanvasPixelVisible,
        visualPassClaimed: false
      });

      updateDatasetLight();
      return true;
    } catch (error) {
      state.canvasLocalVisibleDrawExecuted = false;
      state.canvasLocalDrawFailureReason = safeString(error && error.message ? error.message : error).slice(0, 700);
      state.firstFailedCoordinate = "CANVAS_LOCAL_DRAW_THROWN";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "AUDIT_CANVAS_LOCAL_VISIBLE_DRAW_EXCEPTION";
      state.postgameStatus = "CANVAS_LOCAL_VISIBLE_DRAW_FAILED";
      recordError("HEARTH_CANVAS_LOCAL_VISIBLE_DRAW_FAILED", error, { reason });
      scanCanvasSurface();
      updateDatasetLight();
      return false;
    }
  }

  function readHexAuthority() {
    const found = firstGlobal(HEX_AUTHORITY_ALIASES);
    const receipt = readAuthoritySnapshot(found.value);
    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthHexAuthorityContract")
    );
    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      datasetValue("hearthHexAuthorityReceipt")
    );

    state.hexAuthorityObserved = Boolean(found.value || contract);
    state.hexAuthoritySource = found.name;
    state.hexAuthorityContract = contract || "";
    state.hexAuthorityReceipt = receiptName || "";
    state.hexAuthorityRecognized = Boolean(contract === EXPECTED_HEX_AUTHORITY_CONTRACT || safeString(contract).includes("HEARTH_HEX"));

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName,
      recognized: state.hexAuthorityRecognized
    };
  }

  function getHexSurfaceReceiverMethods() {
    return [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveCanvasFramePacket",
      "consumeCanvasFramePacket",
      "receivePlanetaryViewControlPacket",
      "consumePlanetaryViewControlPacket",
      "receiveViewControlPacket",
      "consumeViewControlPacket",
      "receiveInteractiveFramePacket",
      "consumeInteractiveFramePacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "drawFrame",
      "renderFrame"
    ];
  }

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readAuthoritySnapshot(found.value);
    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthHexSurfaceContract")
    );
    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      datasetValue("hearthHexSurfaceReceipt")
    );

    let receiverReady = false;
    let firstMethod = "NONE";

    if (found.value) {
      for (const method of getHexSurfaceReceiverMethods()) {
        if (isFunction(found.value[method])) {
          receiverReady = true;
          firstMethod = method;
          break;
        }
      }
    }

    state.hexSurfaceObserved = Boolean(found.value || contract);
    state.hexSurfaceAuthoritySource = found.name;
    state.hexSurfaceContract = contract || "";
    state.hexSurfaceReceipt = receiptName || "";
    state.hexSurfaceContractRecognized = hexContractRecognized(contract);
    state.hexSurfaceReceiverReady = receiverReady;

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName,
      recognized: state.hexSurfaceContractRecognized,
      receiverReady,
      firstMethod
    };
  }

  function packetTargetsCanvas(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type || "");
    const targetFile = safeString(
      packet.targetFile ||
      packet.destinationFile ||
      packet.canvasFile ||
      packet.expectedCanvasFile ||
      ""
    );
    const handoffTo = safeString(packet.handoffTo || packet.destination || packet.target || "");

    return Boolean(
      packetType.includes("CANVAS") ||
      handoffTo.toUpperCase().includes("CANVAS") ||
      targetFile === FILE ||
      targetFile.endsWith("/hearth.canvas.js") ||
      packet.canvasReleaseAuthorized === true ||
      packet.canvasReleasePacketReady === true ||
      packet.visiblePlanetProofReady === true ||
      packet.renderedPlanetProofReady === true
    );
  }

  function packetSourceIsRouteConductor(packet) {
    if (!isObject(packet)) return false;

    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "");
    const sourceRole = safeString(packet.sourceRole || packet.role || packet.authority || packet.sourceAuthority || "");
    const contract = safeString(packet.sourceContract || packet.routeConductorContract || packet.contract || packet.CONTRACT || "");

    return Boolean(
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      sourceRole.includes("route-conductor") ||
      sourceRole.includes("ROUTE_CONDUCTOR") ||
      routeContractRecognized(contract)
    );
  }

  function validateRouteRelease(packet) {
    if (!isObject(packet)) return { accepted: false, reason: "ROUTE_RELEASE_PACKET_NOT_OBJECT" };
    if (!hasNoForbiddenClaims(packet)) return { accepted: false, reason: "ROUTE_RELEASE_PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };

    const targetsCanvas = packetTargetsCanvas(packet);
    const sourceIsRoute = packetSourceIsRouteConductor(packet);

    if (!targetsCanvas && !sourceIsRoute) {
      return { accepted: false, reason: "ROUTE_RELEASE_PACKET_DOES_NOT_TARGET_CANVAS_OR_ROUTE_CONDUCTOR" };
    }

    return { accepted: true, reason: "ROUTE_RELEASE_ACCEPTED_BY_CANVAS" };
  }

  function acceptRouteRelease(packet, source = "direct") {
    const validation = validateRouteRelease(packet);

    if (!validation.accepted) {
      state.routeReleaseAccepted = false;
      state.routeReleasePacket = clonePlain(packet || null);
      state.routeReleaseSource = source;
      state.routeReleaseStatus = `REJECTED:${validation.reason}`;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "REISSUE_LAWFUL_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET";
      state.postgameStatus = "CANVAS_ROUTE_RELEASE_REJECTED";

      record("HEARTH_CANVAS_ROUTE_RELEASE_REJECTED", {
        source,
        reason: validation.reason
      });

      updateDataset();
      publishGlobals("route-release-rejected");
      return getReceiptLight(false);
    }

    state.routeReleaseAccepted = true;
    state.routeReleasePacket = clonePlain(packet);
    state.routeReleaseSource = source;
    state.routeReleaseStatus = "ACCEPTED_ROUTE_CONDUCTOR_CANVAS_RELEASE";
    state.downstreamExpressionPacketObserved = true;
    state.downstreamExpressionPacketSource = source;
    state.downstreamExpressionPacketDrawable = true;
    state.downstreamExpressionPacketDrawableReason = "ROUTE_RELEASE_PACKET_ACCEPTED_AS_CANVAS_DRAWABLE_CARRIER_CONTEXT";

    bindSurface({
      mount: packet.mount && packet.mount.nodeType === 1 ? packet.mount : null
    });

    readHexAuthority();
    readHexSurfaceAuthority();

    drawLocalVisibleCarrierFrame("route-release");

    state.firstFailedCoordinate = state.finalCanvasPixelVisible
      ? "NONE_ROUTE_RELEASE_ACCEPTED_LOCAL_PIXEL_VISIBLE"
      : "CANVAS_ROUTE_RELEASE_ACCEPTED_PIXEL_NOT_VISIBLE";
    state.recommendedNextFile = state.hexSurfaceReceiverReady ? HEX_SURFACE_FILE : FILE;
    state.recommendedNextAction = state.hexSurfaceReceiverReady
      ? "DELIVER_CANVAS_SURFACE_VIEW_PACKET_THROUGH_HEX_GATE"
      : "VERIFY_LOCAL_DRAW_AND_HEX_SURFACE_GATE";
    state.postgameStatus = state.finalCanvasPixelVisible
      ? "CANVAS_ROUTE_RELEASE_ACCEPTED_LOCAL_PIXEL_VISIBLE"
      : "CANVAS_ROUTE_RELEASE_ACCEPTED_PIXEL_PROOF_FAILED";

    record("HEARTH_CANVAS_ROUTE_RELEASE_ACCEPTED", {
      source,
      routeConductorContract: packet.contract || packet.sourceContract || "",
      canvasSurfaceMounted: state.canvasDomSurfaceMounted,
      finalCanvasPixelVisible: state.finalCanvasPixelVisible,
      hexSurfaceReceiverReady: state.hexSurfaceReceiverReady
    });

    scheduleHexGateFrame("route-release", null);
    publishGlobals("route-release-accepted");
    return getReceiptLight(false);
  }

  function receiveRouteConductorReleasePacket(packet) {
    return acceptRouteRelease(packet, "receiveRouteConductorReleasePacket");
  }

  function consumeRouteConductorReleasePacket(packet) {
    return acceptRouteRelease(packet, "consumeRouteConductorReleasePacket");
  }

  function receiveReleasePacket(packet) {
    return acceptRouteRelease(packet, "receiveReleasePacket");
  }

  function consumeReleasePacket(packet) {
    return acceptRouteRelease(packet, "consumeReleasePacket");
  }

  function receiveCanvasReleasePacket(packet) {
    return acceptRouteRelease(packet, "receiveCanvasReleasePacket");
  }

  function acceptReleasePacket(packet) {
    return acceptRouteRelease(packet, "acceptReleasePacket");
  }

  function signatureOfControlPacket(packet) {
    if (!isObject(packet)) return "";

    const viewState = isObject(packet.viewState) ? packet.viewState : {};
    return [
      packet.packetType || packet.type || "CONTROL",
      packet.composedAt || packet.updatedAt || "",
      packet.inputType || "",
      packet.deltaYaw || 0,
      packet.deltaPitch || 0,
      packet.deltaZoom || 0,
      viewState.yaw || packet.yaw || 0,
      viewState.pitch || packet.pitch || 0,
      viewState.zoom || packet.zoom || 1
    ].join("|");
  }

  function validateControlPacket(packet) {
    if (!isObject(packet)) return { accepted: false, reason: "CONTROL_PACKET_NOT_OBJECT" };
    if (!hasNoForbiddenClaims(packet)) return { accepted: false, reason: "CONTROL_PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };

    const contract = safeString(packet.controlContract || packet.controlsContract || packet.sourceContract || packet.contract || packet.CONTRACT || "");
    const packetType = safeString(packet.packetType || packet.type || "");
    const sourceFile = safeString(packet.sourceFile || "");
    const handoffTo = safeString(packet.handoffTo || packet.destination || packet.target || "");
    const targetFile = safeString(packet.targetFile || packet.destinationFile || packet.canvasFile || "");

    const looksLikeControl =
      packetType.includes("CONTROL") ||
      packetType.includes("CONTROLS") ||
      packetType.includes("QUEEN") ||
      sourceFile.endsWith("/hearth.controls.js") ||
      controlContractRecognized(contract) ||
      packet.viewState ||
      packet.deltaYaw !== undefined ||
      packet.deltaPitch !== undefined ||
      packet.deltaZoom !== undefined ||
      packet.yaw !== undefined ||
      packet.pitch !== undefined ||
      packet.zoom !== undefined;

    const targetsCanvas =
      handoffTo.toUpperCase().includes("CANVAS") ||
      targetFile === FILE ||
      targetFile.endsWith("/hearth.canvas.js") ||
      targetFile === "" ||
      packet.canvasFile === FILE ||
      packet.destinationFile === FILE;

    if (!looksLikeControl) return { accepted: false, reason: "PACKET_NOT_RECOGNIZED_AS_CONTROL_VIEW_PACKET" };
    if (!targetsCanvas) return { accepted: false, reason: "CONTROL_PACKET_DOES_NOT_TARGET_CANVAS" };

    return { accepted: true, reason: "CONTROL_PACKET_ACCEPTED_BY_CANVAS" };
  }

  function normalizeViewFromPacket(packet) {
    const viewState = isObject(packet && packet.viewState) ? packet.viewState : null;

    if (viewState) {
      view.yaw = safeNumber(viewState.yaw, view.yaw);
      view.pitch = clamp(safeNumber(viewState.pitch, view.pitch), view.minPitch, view.maxPitch);
      view.zoom = clamp(safeNumber(viewState.zoom, view.zoom), view.minZoom, view.maxZoom);
      view.phase = 0;
      return;
    }

    view.yaw += safeNumber(packet && packet.deltaYaw, 0);
    view.pitch = clamp(view.pitch + safeNumber(packet && packet.deltaPitch, 0), view.minPitch, view.maxPitch);
    view.zoom = clamp(view.zoom + safeNumber(packet && packet.deltaZoom, 0), view.minZoom, view.maxZoom);

    if (packet && packet.yaw !== undefined) view.yaw = safeNumber(packet.yaw, view.yaw);
    if (packet && packet.pitch !== undefined) view.pitch = clamp(packet.pitch, view.minPitch, view.maxPitch);
    if (packet && packet.zoom !== undefined) view.zoom = clamp(packet.zoom, view.minZoom, view.maxZoom);

    view.phase = 0;
  }

  function receiveControlViewPacket(packet, source = "direct") {
    const validation = validateControlPacket(packet);

    if (!validation.accepted) {
      state.controlPacketAccepted = false;
      state.controlPacketRejected = true;
      state.controlPacketRejectionReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = CONTROL_FILE;
      state.recommendedNextAction = "REISSUE_LAWFUL_QUEEN_CONTROLS_VIEW_PACKET";
      state.postgameStatus = "CANVAS_REJECTED_CONTROL_PACKET";

      record("HEARTH_CANVAS_CONTROL_PACKET_REJECTED", {
        source,
        reason: validation.reason
      });

      updateDataset();
      return getReceiptLight(false);
    }

    const signature = signatureOfControlPacket(packet);
    if (signature && signature === state.lastControlPacketSignature) {
      return getReceiptLight(false);
    }

    state.lastControlPacketSignature = signature;
    state.controlPacketAccepted = true;
    state.controlPacketRejected = false;
    state.controlPacketRejectionReason = "";
    state.controlsObserved = true;
    state.controlContract = safeString(packet.controlContract || packet.controlsContract || packet.sourceContract || packet.contract || EXPECTED_CONTROL_CONTRACT);
    state.controlReceipt = safeString(packet.controlReceipt || packet.controlsReceipt || packet.sourceReceipt || packet.receipt || "");
    state.lastControlPacketAt = nowIso();
    state.lastControlPacketType = safeString(packet.packetType || packet.type || CONTROL_PACKET_TYPE);
    state.lastViewPacket = clonePlain(packet);
    state.packetCount += 1;

    state.downstreamExpressionPacketObserved = true;
    state.downstreamExpressionPacketSource = source;
    state.downstreamExpressionPacketDrawable = true;
    state.downstreamExpressionPacketDrawableReason = "CONTROL_VIEW_PACKET_ACCEPTED_AS_CANVAS_DRAWABLE_VIEW_CONTEXT";

    normalizeViewFromPacket(packet);
    bindSurface();
    readHexAuthority();
    readHexSurfaceAuthority();
    drawLocalVisibleCarrierFrame("control-view-packet");

    state.firstFailedCoordinate = state.finalCanvasPixelVisible
      ? "NONE_CONTROL_PACKET_ACCEPTED_LOCAL_PIXEL_VISIBLE"
      : "CANVAS_CONTROL_PACKET_ACCEPTED_PIXEL_NOT_VISIBLE";
    state.recommendedNextFile = state.hexSurfaceReceiverReady ? HEX_SURFACE_FILE : FILE;
    state.recommendedNextAction = state.hexSurfaceReceiverReady
      ? "TRANSMIT_CANVAS_VIEW_PACKET_THROUGH_HEX_GATE"
      : "VERIFY_HEX_SURFACE_PUBLIC_GATE_RECEIVER";
    state.postgameStatus = state.finalCanvasPixelVisible
      ? "CANVAS_CONTROL_PACKET_ACCEPTED_LOCAL_PIXEL_VISIBLE_HEX_GATE_PENDING"
      : "CANVAS_CONTROL_PACKET_ACCEPTED_LOCAL_PIXEL_PROOF_FAILED";

    scheduleHexGateFrame("control-view-packet", packet);
    updateDatasetLight();

    return getReceiptLight(false);
  }

  function receivePlanetaryViewControlPacket(packet) {
    return receiveControlViewPacket(packet, "receivePlanetaryViewControlPacket");
  }

  function consumePlanetaryViewControlPacket(packet) {
    return receiveControlViewPacket(packet, "consumePlanetaryViewControlPacket");
  }

  function receiveViewControlPacket(packet) {
    return receiveControlViewPacket(packet, "receiveViewControlPacket");
  }

  function consumeViewControlPacket(packet) {
    return receiveControlViewPacket(packet, "consumeViewControlPacket");
  }

  function receiveCanvasViewState(packet) {
    return receiveControlViewPacket(packet, "receiveCanvasViewState");
  }

  function consumeCanvasViewState(packet) {
    return receiveControlViewPacket(packet, "consumeCanvasViewState");
  }

  function receiveViewState(packet) {
    return receiveControlViewPacket(packet, "receiveViewState");
  }

  function setViewState(packet) {
    return receiveControlViewPacket(packet, "setViewState");
  }

  function applyViewState(packet) {
    return receiveControlViewPacket(packet, "applyViewState");
  }

  function receiveControlPacket(packet) {
    return receiveControlViewPacket(packet, "receiveControlPacket");
  }

  function receiveControlViewPacketAlias(packet) {
    return receiveControlViewPacket(packet, "receiveControlViewPacket");
  }

  function receiveControlsPacket(packet) {
    return receiveControlViewPacket(packet, "receiveControlsPacket");
  }

  function receivePlanetaryControlPacket(packet) {
    return receiveControlViewPacket(packet, "receivePlanetaryControlPacket");
  }

  function receiveViewDelta(packet) {
    return receiveControlViewPacket(packet, "receiveViewDelta");
  }

  function applyViewDelta(packet) {
    return receiveControlViewPacket(packet, "applyViewDelta");
  }

  function setView(packet) {
    return receiveControlViewPacket(packet, "setView");
  }

  function updateView(packet) {
    return receiveControlViewPacket(packet, "updateView");
  }

  function composeHexGatePacket(sourcePacket = null, includeRuntimeHandles = false) {
    const control = isObject(sourcePacket) ? sourcePacket : state.lastViewPacket || {};
    const surfaceScan = scanCanvasSurface();

    const packet = {
      packetType: CANVAS_HEX_GATE_PACKET_TYPE,
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-receiver-output-carrier-local-visible-pixel-proof",
      destinationFile: HEX_SURFACE_FILE,
      targetFile: HEX_SURFACE_FILE,
      handoffTo: "HEX_SURFACE_GATE",

      route: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      pointerFingerFile: POINTER_FINGER_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
      pointerFingerDirectCallSuppressed: true,

      transmissionChronology: TRANSMISSION_CHRONOLOGY.slice(),
      transmissionGate: "HEX_SURFACE",
      transmissionToPointerFingerMustPassThroughHex: true,
      canvasDoesNotCallPointerFingerDirectly: true,

      routeReleaseAccepted: state.routeReleaseAccepted,
      controlsObserved: state.controlsObserved,
      controlPacketAccepted: state.controlPacketAccepted,
      controlPacketType: state.lastControlPacketType,

      sourceControlPacket: clonePlain(control),
      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        phase: 0,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      phase: 0,

      canvasSurface: {
        mountFound: state.canvasMountFound,
        mountSelector: state.canvasMountSelector,
        canvasElementFound: state.canvasElementFound,
        canvasSelector: state.canvasSelector,
        canvasInMount: state.canvasInMount,
        width: surface.width || (surface.canvas && surface.canvas.width) || 0,
        height: surface.height || (surface.canvas && surface.canvas.height) || 0,
        dpr: surface.dpr || 1,
        rectNonzero: state.canvasRectNonzero,
        computedVisible: state.canvasComputedVisible,
        context2DReady: state.canvasContext2DReady,
        pixelSampleStatus: state.canvasPixelSampleStatus,
        pixelVisible: state.canvasPixelVisible,
        visiblePixelCount: state.canvasVisiblePixelCount,
        domSurfaceMounted: state.canvasDomSurfaceMounted,
        domSurfaceProofReady: state.canvasDomSurfaceProofReady,
        scan: clonePlain(surfaceScan)
      },

      localVisiblePixelProof: {
        attempted: state.canvasLocalVisibleDrawAttempted,
        executed: state.canvasLocalVisibleDrawExecuted,
        drawCount: state.canvasLocalVisibleDrawCount,
        reason: state.canvasLocalVisibleDrawReason,
        sampleBeforeDraw: clonePlain(state.canvasLocalPixelSampleBeforeDraw),
        sampleAfterDraw: clonePlain(state.canvasLocalPixelSampleAfterDraw),
        finalCanvasPixelVisible: state.finalCanvasPixelVisible,
        finalCanvasPixelFailureClass: state.finalCanvasPixelFailureClass
      },

      downstreamExpression: {
        packetObserved: state.downstreamExpressionPacketObserved,
        packetSource: state.downstreamExpressionPacketSource,
        packetDrawable: state.downstreamExpressionPacketDrawable,
        packetDrawableReason: state.downstreamExpressionPacketDrawableReason
      },

      hexSurfaceGate: {
        observed: state.hexSurfaceObserved,
        authoritySource: state.hexSurfaceAuthoritySource,
        contract: state.hexSurfaceContract,
        receipt: state.hexSurfaceReceipt,
        contractRecognized: state.hexSurfaceContractRecognized,
        receiverReady: state.hexSurfaceReceiverReady
      },

      hexAuthority: {
        observed: state.hexAuthorityObserved,
        authoritySource: state.hexAuthoritySource,
        contract: state.hexAuthorityContract,
        receipt: state.hexAuthorityReceipt,
        recognized: state.hexAuthorityRecognized
      },

      canvasReceiverOutputCarrierActive: true,
      canvasLocalVisiblePixelProofActive: true,
      hexGateTransmissionActive: true,
      canvasBishopInspectionSuppressed: true,
      canvasBishopMutationSuppressed: true,
      canvasExpressionTruthOwned: false,
      terrainTruthOwned: false,
      hydrologyTruthOwned: false,
      elevationTruthOwned: false,
      materialTruthOwned: false,

      composedAt: nowIso(),
      frameCoalescedByCanvas: true,
      packetPhaseFixedAtZero: true,

      ...NO_CLAIMS
    };

    if (includeRuntimeHandles) {
      packet.runtimeHandles = {
        canvas: surface.canvas,
        context2d: surface.ctx,
        ctx: surface.ctx,
        mount: surface.mount,
        mountSelector: state.canvasMountSelector,
        canvasSelector: state.canvasSelector
      };
    }

    return packet;
  }

  function publishHexGatePacketLight(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const plain = clonePlain(packet);

    root.HEARTH_CANVAS_HEX_GATE_PACKET = plain;
    root.HEARTH_CANVAS_TO_HEX_SURFACE_PACKET = plain;
    root.HEARTH_HEX_GATE_PACKET = plain;
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = clonePlain(state.lastViewPacket);
    root.HEARTH_CANVAS_VIEW_STATE = clonePlain(packet.viewState);

    hearth.canvasHexGatePacket = plain;
    hearth.canvasToHexSurfacePacket = plain;
    hearth.hexGatePacket = plain;
    hearth.canvasLastViewPacket = clonePlain(state.lastViewPacket);
    hearth.canvasViewState = clonePlain(packet.viewState);

    lab.hearthCanvasHexGatePacket = plain;
    lab.hearthCanvasToHexSurfacePacket = plain;
    lab.hearthHexGatePacket = plain;
    lab.hearthCanvasViewState = clonePlain(packet.viewState);
  }

  function broadcastHexGatePacket(packet) {
    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: clonePlain(packet) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail: clonePlain(packet) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: clonePlain(packet) }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail: clonePlain(packet) }));
      }
    } catch (_error) {}
  }

  function deliveryReceiptIndicatesAcceptance(receipt, method) {
    if (!isObject(receipt)) {
      return Boolean(
        method.includes("draw") ||
        method.includes("receive") ||
        method.includes("consume") ||
        method.includes("accept")
      );
    }

    return Boolean(
      safeBool(readField(receipt, [
        "hexGatePacketAccepted",
        "canvasHexGatePacketAccepted",
        "canvasPacketAccepted",
        "viewPacketAccepted",
        "interactiveFrameAccepted",
        "drawAccepted",
        "pairFrameAccepted",
        "pointerFingerGateOpen",
        "hexSurfaceReceivesCorrectedProjectionState",
        "accepted"
      ], false), false) ||
      safeString(readField(receipt, [
        "lastValidationStatus",
        "validationStatus",
        "pointerFingerTransmissionStatus",
        "postgameStatus"
      ], "")).includes("ACCEPTED") ||
      safeString(readField(receipt, [
        "pointerFingerTransmissionStatus",
        "postgameStatus"
      ], "")).includes("DELIVERED") ||
      method.includes("draw") ||
      method.includes("receive") ||
      method.includes("consume") ||
      method.includes("accept")
    );
  }

  function inspectPointerFingerObservationFromReceipt(receipt) {
    if (!isObject(receipt)) return { observed: false, source: "NONE" };

    const transmissionPacket = receipt.transmissionPacket || receipt.lastPointerFingerTransmissionPacket;
    const delivery = receipt.delivery;

    if (transmissionPacket || isObject(delivery)) {
      return {
        observed: true,
        source: transmissionPacket ? "HEX_SURFACE_TRANSMISSION_PACKET" : "HEX_SURFACE_DELIVERY_OBJECT"
      };
    }

    const statusText = [
      receipt.pointerFingerTransmissionStatus,
      receipt.POINTER_FINGER_TRANSMISSION_STATUS,
      receipt.postgameStatus,
      receipt.POSTGAME_STATUS
    ].map((value) => safeString(value)).join(" ");

    if (/POINTER_FINGER|TRANSMISSION_DELIVERED|WAITING_POINTER_FINGER/i.test(statusText)) {
      return {
        observed: true,
        source: "HEX_SURFACE_RECEIPT_STATUS_TEXT"
      };
    }

    return { observed: false, source: "NONE" };
  }

  function deliverHexGatePacket(packet) {
    bindSurface();
    scanCanvasSurface();
    readHexAuthority();

    const hex = readHexSurfaceAuthority();
    const payload = composeHexGatePacket(packet && packet.sourceControlPacket ? packet.sourceControlPacket : state.lastViewPacket, true);

    state.lastHexGatePacket = clonePlain(payload);
    state.lastHexGatePacketAt = payload.composedAt;
    state.hexGatePacketCount += 1;

    publishHexGatePacketLight(payload);

    if (!hex.authority || !isObject(hex.authority) || !hex.receiverReady) {
      state.hexGateMissCount += 1;
      state.hexGatePacketDelivered = false;
      state.hexGateAcceptedByHexSurface = false;
      state.hexSurfaceDeliveryStatus = "HEX_SURFACE_GATE_PENDING_PACKET_PUBLISHED";
      state.hexSurfaceDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.hexSurfaceDeliveryReason = "WAITING_HEX_SURFACE_PUBLIC_GATE_RECEIVER";
      state.hexSurfaceAcceptedPacket = false;
      state.firstFailedCoordinate = state.finalCanvasPixelVisible
        ? "WAITING_HEX_SURFACE_PUBLIC_GATE_RECEIVER_AFTER_LOCAL_PIXEL_VISIBLE"
        : "WAITING_HEX_SURFACE_PUBLIC_GATE_RECEIVER_AND_PIXEL_NOT_VISIBLE";
      state.recommendedNextFile = state.finalCanvasPixelVisible ? HEX_SURFACE_FILE : FILE;
      state.recommendedNextAction = state.finalCanvasPixelVisible
        ? "CONFIRM_HEX_SURFACE_PUBLIC_GATE_RECEIVER"
        : "VERIFY_CANVAS_LOCAL_DRAW_THEN_HEX_SURFACE_PUBLIC_GATE_RECEIVER";
      state.postgameStatus = state.finalCanvasPixelVisible
        ? "CANVAS_PIXEL_VISIBLE_PACKET_PUBLISHED_WAITING_HEX_GATE"
        : "CANVAS_PACKET_PUBLISHED_WAITING_HEX_GATE_PIXEL_NOT_VISIBLE";

      broadcastHexGatePacket(payload);
      updateDatasetLight();
      return {
        delivered: false,
        accepted: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.hexSurfaceDeliveryReason
      };
    }

    for (const method of getHexSurfaceReceiverMethods()) {
      if (!isFunction(hex.authority[method])) continue;

      try {
        let result;

        if (
          method === "drawInteractiveFrame" ||
          method === "drawPairFrame" ||
          method === "drawFrame" ||
          method === "renderFrame"
        ) {
          result = hex.authority[method](payload, {
            sourceFile: FILE,
            targetRoute: ROUTE,
            canvas: surface.canvas,
            ctx: surface.ctx,
            context2d: surface.ctx,
            mount: surface.mount,
            mountSelector: state.canvasMountSelector,
            canvasSelector: state.canvasSelector,
            pointerFingerDirectCallSuppressed: true,
            canvasLocalVisiblePixelProofAlreadyExecuted: state.canvasLocalVisibleDrawExecuted,
            finalCanvasPixelVisible: state.finalCanvasPixelVisible,
            ...NO_CLAIMS
          });
        } else {
          result = hex.authority[method](payload, {
            sourceFile: FILE,
            targetRoute: ROUTE,
            pointerFingerDirectCallSuppressed: true,
            finalCanvasPixelVisible: state.finalCanvasPixelVisible,
            ...NO_CLAIMS
          });
        }

        const receipt = isObject(result) ? result : readAuthoritySnapshot(hex.authority);
        const accepted = deliveryReceiptIndicatesAcceptance(receipt, method);
        const pointerObservation = inspectPointerFingerObservationFromReceipt(receipt);

        state.hexGateDeliveryCount += 1;
        state.hexGatePacketDelivered = true;
        state.hexGateAcceptedByHexSurface = accepted;
        state.hexSurfaceDeliveryStatus = accepted
          ? "CANVAS_PACKET_DELIVERED_THROUGH_HEX_GATE"
          : "HEX_SURFACE_CALLED_WITHOUT_ACCEPTANCE_RECEIPT";
        state.hexSurfaceDeliveryMethod = method;
        state.hexSurfaceDeliveryReason = accepted
          ? "HEX_SURFACE_PUBLIC_GATE_RECEIVER_CALLED"
          : "HEX_SURFACE_PUBLIC_GATE_RETURNED_WITHOUT_ACCEPTANCE";
        state.hexSurfaceAcceptedPacket = accepted;
        state.pointerFingerTransmissionObserved = pointerObservation.observed;
        state.pointerFingerTransmissionSource = pointerObservation.source;
        state.lastHexGateDeliveryReceipt = clonePlain(receipt);

        state.firstFailedCoordinate = accepted
          ? state.finalCanvasPixelVisible
            ? "NONE_LOCAL_PIXEL_VISIBLE_HEX_GATE_ACCEPTED"
            : "HEX_GATE_ACCEPTED_BUT_CANVAS_PIXEL_NOT_VISIBLE"
          : "HEX_GATE_ACCEPTANCE_NOT_CONFIRMED";
        state.recommendedNextFile = accepted
          ? state.pointerFingerTransmissionObserved
            ? POINTER_FINGER_FILE
            : HEX_SURFACE_FILE
          : HEX_SURFACE_FILE;
        state.recommendedNextAction = accepted
          ? state.pointerFingerTransmissionObserved
            ? "OBSERVE_POINTER_FINGER_DOWNSTREAM_RESPONSE"
            : "VERIFY_HEX_SURFACE_PUBLISHES_POINTER_FINGER_TRANSMISSION_RECEIPT"
          : "CONFIRM_HEX_SURFACE_ACCEPTANCE_RECEIPT";
        state.postgameStatus = accepted
          ? state.finalCanvasPixelVisible
            ? "CANVAS_LOCAL_PIXEL_VISIBLE_AND_HEX_GATE_ACCEPTED"
            : "HEX_GATE_ACCEPTED_CANVAS_PIXEL_STILL_NOT_VISIBLE"
          : "CANVAS_TRANSMISSION_REACHED_HEX_GATE_ACCEPTANCE_UNCONFIRMED";

        broadcastHexGatePacket(payload);
        scanCanvasSurface();
        updateDatasetLight();

        record("HEARTH_CANVAS_HEX_GATE_PACKET_DELIVERED", {
          method,
          accepted,
          hexSurfaceContract: state.hexSurfaceContract,
          canvasLocalVisibleDrawExecuted: state.canvasLocalVisibleDrawExecuted,
          finalCanvasPixelVisible: state.finalCanvasPixelVisible,
          pointerFingerTransmissionObserved: state.pointerFingerTransmissionObserved,
          pointerFingerDirectCallSuppressed: true
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: state.hexSurfaceDeliveryReason,
          receipt: clonePlain(receipt),
          pointerFingerTransmissionObserved: state.pointerFingerTransmissionObserved
        };
      } catch (error) {
        recordError("HEARTH_CANVAS_HEX_GATE_METHOD_FAILED", error, { method });
      }
    }

    state.hexGateMissCount += 1;
    state.hexGatePacketDelivered = false;
    state.hexGateAcceptedByHexSurface = false;
    state.hexSurfaceDeliveryStatus = "HEX_SURFACE_METHODS_FAILED_PACKET_PUBLISHED";
    state.hexSurfaceDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
    state.hexSurfaceDeliveryReason = "HEX_SURFACE_PUBLIC_METHODS_FAILED";
    state.hexSurfaceAcceptedPacket = false;
    state.firstFailedCoordinate = "HEX_SURFACE_PUBLIC_METHODS_FAILED";
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextAction = "RENEW_HEX_SURFACE_PUBLIC_GATE_METHOD";
    state.postgameStatus = "CANVAS_PACKET_PUBLISHED_HEX_GATE_METHOD_FAILURE";

    broadcastHexGatePacket(payload);
    updateDatasetLight();

    return {
      delivered: false,
      accepted: false,
      method: "GLOBAL_PACKET_PUBLICATION",
      reason: state.hexSurfaceDeliveryReason
    };
  }

  function requestFrame(callback) {
    if (isFunction(root.requestAnimationFrame)) return root.requestAnimationFrame(callback);
    if (isFunction(root.setTimeout)) return root.setTimeout(() => callback(nowMs()), 16);
    callback(nowMs());
    return 0;
  }

  function cancelFrame(id) {
    if (!id) return;
    if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(id);
    else if (isFunction(root.clearTimeout)) root.clearTimeout(id);
  }

  function scheduleHexGateFrame(reason = "manual", sourcePacket = null) {
    if (state.disposed) return null;

    frame.pendingReason = reason;
    frame.pendingPacket = sourcePacket ? clonePlain(sourcePacket) : null;

    if (frame.scheduled) return getReceiptLight(false);

    frame.scheduled = true;
    frame.rafId = requestFrame(() => flushHexGateFrame(reason));
    return getReceiptLight(false);
  }

  function flushHexGateFrame(reason = "manual") {
    if (state.disposed) return null;

    const sourcePacket = frame.pendingPacket ? clonePlain(frame.pendingPacket) : state.lastViewPacket;
    frame.scheduled = false;
    frame.rafId = 0;
    frame.pendingPacket = null;
    frame.pendingReason = "";
    frame.flushCount += 1;

    state.lastHexGateReason = reason;

    drawLocalVisibleCarrierFrame(`frame:${reason}`);

    const packet = composeHexGatePacket(sourcePacket, false);
    return deliverHexGatePacket(packet);
  }

  function bindEventListeners() {
    if (!doc || state.listenerBound) return false;

    const receiveEvent = (event) => {
      const detail = event && event.detail;
      if (isObject(detail)) receiveControlViewPacket(detail, `event:${event.type}`);
    };

    try {
      doc.addEventListener("hearth:planetary-view-control", receiveEvent, { passive: true });
      doc.addEventListener("hearth:queen-view-control", receiveEvent, { passive: true });
      doc.addEventListener("hearth:canvas-view-state", receiveEvent, { passive: true });
      doc.addEventListener("hearth:controls-view-delta", receiveEvent, { passive: true });

      if (root && isFunction(root.addEventListener)) {
        root.addEventListener("hearth:planetary-view-control", receiveEvent, { passive: true });
        root.addEventListener("hearth:queen-view-control", receiveEvent, { passive: true });
        root.addEventListener("hearth:canvas-view-state", receiveEvent, { passive: true });
        root.addEventListener("hearth:controls-view-delta", receiveEvent, { passive: true });
      }

      state.listenerBound = true;
      return true;
    } catch (error) {
      recordError("HEARTH_CANVAS_EVENT_LISTENER_BIND_FAILED", error);
      return false;
    }
  }

  function deriveNextCoordinates() {
    if (!state.canvasMountFound) {
      state.firstFailedCoordinate = "CANVAS_MOUNT_FOUND";
      state.recommendedNextFile = HTML_FILE;
      state.recommendedNextAction = "RESTORE_OR_EXPOSE_HEARTH_CANVAS_MOUNT";
      state.postgameStatus = "CANVAS_MOUNT_NOT_FOUND";
      return;
    }

    if (!state.canvasElementFound) {
      state.firstFailedCoordinate = "CANVAS_ELEMENT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CREATE_OR_BIND_REAL_CANVAS_ELEMENT";
      state.postgameStatus = "CANVAS_ELEMENT_NOT_FOUND";
      return;
    }

    if (!state.canvasContext2DReady) {
      state.firstFailedCoordinate = "CANVAS_CONTEXT_2D_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "VERIFY_STANDARD_2D_CANVAS_CONTEXT";
      state.postgameStatus = "CANVAS_2D_CONTEXT_NOT_READY";
      return;
    }

    if (!state.canvasLocalVisibleDrawExecuted) {
      state.firstFailedCoordinate = "CANVAS_LOCAL_VISIBLE_DRAW_EXECUTED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "AUDIT_LOCAL_VISIBLE_DRAW_EXECUTION";
      state.postgameStatus = "CANVAS_LOCAL_DRAW_NOT_EXECUTED";
      return;
    }

    if (!state.finalCanvasPixelVisible) {
      state.firstFailedCoordinate = "FINAL_CANVAS_PIXEL_VISIBLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "AUDIT_CANVAS_LOCAL_DRAW_PATH_AND_PIXEL_SAMPLE";
      state.postgameStatus = "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE";
      return;
    }

    if (!state.hexSurfaceReceiverReady) {
      state.firstFailedCoordinate = "HEX_SURFACE_PUBLIC_GATE_RECEIVER_READY";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "CONFIRM_HEX_SURFACE_PUBLIC_GATE_RECEIVER";
      state.postgameStatus = "CANVAS_PIXEL_VISIBLE_WAITING_HEX_SURFACE_GATE";
      return;
    }

    if (!state.hexGateAcceptedByHexSurface) {
      state.firstFailedCoordinate = "HEX_GATE_ACCEPTED_BY_HEX_SURFACE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "VERIFY_HEX_SURFACE_ACCEPTANCE_RECEIPT";
      state.postgameStatus = "CANVAS_PIXEL_VISIBLE_HEX_GATE_ACCEPTANCE_PENDING";
      return;
    }

    if (!state.pointerFingerTransmissionObserved) {
      state.firstFailedCoordinate = "POINTER_FINGER_TRANSMISSION_OBSERVED";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "VERIFY_HEX_SURFACE_PUBLISHES_POINTER_FINGER_TRANSMISSION";
      state.postgameStatus = "CANVAS_PIXEL_VISIBLE_HEX_GATE_ACCEPTED_POINTER_TRANSMISSION_PENDING";
      return;
    }

    state.firstFailedCoordinate = "NONE";
    state.recommendedNextFile = POINTER_FINGER_FILE;
    state.recommendedNextAction = "OBSERVE_DOWNSTREAM_POINTER_FINGER_RESPONSE";
    state.postgameStatus = "CANVAS_PIXEL_VISIBLE_HEX_GATE_ACCEPTED_POINTER_TRANSMISSION_OBSERVED_NO_FINAL_CLAIM";
  }

  function updateDatasetLight() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasPreviousInternalRenewalContract", PREVIOUS_INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasReceiverOutputCarrierActive", "true");
    setDataset("hearthCanvasLocalVisiblePixelProofActive", "true");
    setDataset("hearthCanvasHexGateTransmissionActive", "true");
    setDataset("hearthCanvasHexGateRequired", "true");
    setDataset("hearthCanvasPointerFingerDirectCallSuppressed", "true");
    setDataset("hearthCanvasBishopInspectionSuppressed", "true");
    setDataset("hearthCanvasBishopMutationSuppressed", "true");
    setDataset("hearthCanvasExpressionTruthOwned", "false");

    setDataset("hearthCanvasViewYaw", String(view.yaw));
    setDataset("hearthCanvasViewPitch", String(view.pitch));
    setDataset("hearthCanvasViewZoom", String(view.zoom));
    setDataset("hearthCanvasViewPhase", "0");

    setDataset("hearthCanvasMountFound", String(state.canvasMountFound === true));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound === true));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasInMount", String(state.canvasInMount === true));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero === true));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible === true));
    setDataset("hearthCanvasContext2DReady", String(state.canvasContext2DReady === true));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible === true));
    setDataset("hearthCanvasPixelSampleCount", String(state.canvasPixelSampleCount || 0));
    setDataset("hearthCanvasVisiblePixelCount", String(state.canvasVisiblePixelCount || 0));
    setDataset("hearthCanvasAlphaPixelCount", String(state.canvasAlphaPixelCount || 0));
    setDataset("hearthCanvasUniqueColorCount", String(state.canvasUniqueColorCount || 0));
    setDataset("hearthCanvasDomSurfaceMounted", String(state.canvasDomSurfaceMounted === true));
    setDataset("hearthCanvasDomSurfaceProofReady", String(state.canvasDomSurfaceProofReady === true));
    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.canvasDomSurfaceProofReady === true));

    setDataset("hearthCanvasLocalVisibleDrawAttempted", String(state.canvasLocalVisibleDrawAttempted === true));
    setDataset("hearthCanvasLocalVisibleDrawExecuted", String(state.canvasLocalVisibleDrawExecuted === true));
    setDataset("hearthCanvasLocalVisibleDrawCount", String(state.canvasLocalVisibleDrawCount || 0));
    setDataset("hearthCanvasLocalVisibleDrawReason", state.canvasLocalVisibleDrawReason);
    setDataset("hearthCanvasLocalDrawFailureReason", state.canvasLocalDrawFailureReason);
    setDataset("hearthCanvasLocalPixelSampleAfterDraw", state.canvasLocalPixelSampleAfterDraw ? state.canvasLocalPixelSampleAfterDraw.status : "NOT_RUN");

    setDataset("hearthCanvasDownstreamExpressionPacketObserved", String(state.downstreamExpressionPacketObserved === true));
    setDataset("hearthCanvasDownstreamExpressionPacketSource", state.downstreamExpressionPacketSource);
    setDataset("hearthCanvasDownstreamExpressionPacketDrawable", String(state.downstreamExpressionPacketDrawable === true));
    setDataset("hearthCanvasDownstreamExpressionPacketDrawableReason", state.downstreamExpressionPacketDrawableReason);

    setDataset("hearthCanvasControlsObserved", String(state.controlsObserved === true));
    setDataset("hearthCanvasControlPacketAccepted", String(state.controlPacketAccepted === true));
    setDataset("hearthCanvasControlPacketType", state.lastControlPacketType);
    setDataset("hearthCanvasControlPacketAt", state.lastControlPacketAt);

    setDataset("hearthCanvasHexSurfaceObserved", String(state.hexSurfaceObserved === true));
    setDataset("hearthCanvasHexSurfaceAuthoritySource", state.hexSurfaceAuthoritySource);
    setDataset("hearthCanvasHexSurfaceContract", state.hexSurfaceContract);
    setDataset("hearthCanvasHexSurfaceReceipt", state.hexSurfaceReceipt);
    setDataset("hearthCanvasHexSurfaceContractRecognized", String(state.hexSurfaceContractRecognized === true));
    setDataset("hearthCanvasHexSurfaceReceiverReady", String(state.hexSurfaceReceiverReady === true));
    setDataset("hearthCanvasHexSurfaceDeliveryStatus", state.hexSurfaceDeliveryStatus);
    setDataset("hearthCanvasHexSurfaceDeliveryMethod", state.hexSurfaceDeliveryMethod);
    setDataset("hearthCanvasHexSurfaceDeliveryReason", state.hexSurfaceDeliveryReason);
    setDataset("hearthCanvasHexSurfaceAcceptedPacket", String(state.hexSurfaceAcceptedPacket === true));

    setDataset("hearthCanvasHexAuthorityObserved", String(state.hexAuthorityObserved === true));
    setDataset("hearthCanvasHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthCanvasHexAuthorityRecognized", String(state.hexAuthorityRecognized === true));

    setDataset("hearthCanvasHexGatePacketCount", String(state.hexGatePacketCount));
    setDataset("hearthCanvasHexGateDeliveryCount", String(state.hexGateDeliveryCount));
    setDataset("hearthCanvasHexGateMissCount", String(state.hexGateMissCount));
    setDataset("hearthCanvasHexGatePacketDelivered", String(state.hexGatePacketDelivered === true));
    setDataset("hearthCanvasHexGateAcceptedByHexSurface", String(state.hexGateAcceptedByHexSurface === true));

    setDataset("hearthCanvasPointerFingerTransmissionObserved", String(state.pointerFingerTransmissionObserved === true));
    setDataset("hearthCanvasPointerFingerTransmissionSource", state.pointerFingerTransmissionSource);

    setDataset("hearthCanvasFinalCanvasPixelVisible", String(state.finalCanvasPixelVisible === true));
    setDataset("hearthCanvasFinalCanvasPixelFailureClass", state.finalCanvasPixelFailureClass);
    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    if (surface.canvas && surface.canvas.dataset) {
      surface.canvas.dataset.hearthCanvasPixelSampleStatus = state.canvasPixelSampleStatus;
      surface.canvas.dataset.hearthCanvasPixelVisible = String(state.canvasPixelVisible === true);
      surface.canvas.dataset.hearthCanvasFinalCanvasPixelVisible = String(state.finalCanvasPixelVisible === true);
      surface.canvas.dataset.hearthCanvasLocalVisibleDrawExecuted = String(state.canvasLocalVisibleDrawExecuted === true);
      surface.canvas.dataset.hearthCanvasFinalCanvasPixelFailureClass = state.finalCanvasPixelFailureClass;
    }
  }

  function updateDataset() {
    updateDatasetLight();

    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRoute", ROUTE);
    setDataset("hearthCanvasRouteConductorFile", ROUTE_CONDUCTOR_FILE);
    setDataset("hearthCanvasControlFile", CONTROL_FILE);
    setDataset("hearthCanvasHexSurfaceFile", HEX_SURFACE_FILE);
    setDataset("hearthCanvasHexAuthorityFile", HEX_AUTHORITY_FILE);
    setDataset("hearthCanvasPointerFingerFile", POINTER_FINGER_FILE);
    setDataset("hearthCanvasTransmissionChronology", TRANSMISSION_CHRONOLOGY.join(" -> "));
    setDataset("hearthCanvasRouteReleaseAccepted", String(state.routeReleaseAccepted === true));
    setDataset("hearthCanvasRouteReleaseStatus", state.routeReleaseStatus);
  }

  function composeReceiptLight() {
    scanCanvasSurface();
    deriveNextCoordinates();

    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
      lineageV122Contract: LINEAGE_V12_2_CONTRACT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      version: VERSION,

      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "canvas-receiver-output-carrier-local-visible-pixel-proof-hex-gate-transmission",
      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      disposed: state.disposed,

      receiverOutputCarrierActive: true,
      localVisiblePixelProofActive: true,
      hexGateTransmissionActive: true,
      hexGateRequired: true,
      pointerFingerDirectCallSuppressed: true,
      transmissionChronology: TRANSMISSION_CHRONOLOGY.slice(),

      routeReleaseAccepted: state.routeReleaseAccepted,
      routeReleaseStatus: state.routeReleaseStatus,
      routeReleaseSource: state.routeReleaseSource,

      controlsObserved: state.controlsObserved,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,
      controlPacketAccepted: state.controlPacketAccepted,
      controlPacketRejected: state.controlPacketRejected,
      controlPacketRejectionReason: state.controlPacketRejectionReason,
      lastControlPacketType: state.lastControlPacketType,
      lastControlPacketAt: state.lastControlPacketAt,

      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleCount: state.canvasPixelSampleCount,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,
      canvasUniqueColorCount: state.canvasUniqueColorCount,
      canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
      canvasDomSurfaceProofReady: state.canvasDomSurfaceProofReady,
      visiblePlanetProofReady: state.canvasDomSurfaceProofReady,
      visiblePlanetProofSource: state.canvasDomSurfaceProofReady
        ? "DOM_CANVAS_2D_LOCAL_VISIBLE_PIXEL_PROOF"
        : "NONE",

      canvasLocalVisibleDrawAttempted: state.canvasLocalVisibleDrawAttempted,
      canvasLocalVisibleDrawExecuted: state.canvasLocalVisibleDrawExecuted,
      canvasLocalVisibleDrawReason: state.canvasLocalVisibleDrawReason,
      canvasLocalVisibleDrawCount: state.canvasLocalVisibleDrawCount,
      canvasLocalPixelSampleBeforeDraw: clonePlain(state.canvasLocalPixelSampleBeforeDraw),
      canvasLocalPixelSampleAfterDraw: clonePlain(state.canvasLocalPixelSampleAfterDraw),
      canvasLocalDrawFailureReason: state.canvasLocalDrawFailureReason,

      downstreamExpressionPacketObserved: state.downstreamExpressionPacketObserved,
      downstreamExpressionPacketSource: state.downstreamExpressionPacketSource,
      downstreamExpressionPacketDrawable: state.downstreamExpressionPacketDrawable,
      downstreamExpressionPacketDrawableReason: state.downstreamExpressionPacketDrawableReason,

      finalCanvasPixelVisible: state.finalCanvasPixelVisible,
      finalCanvasPixelFailureClass: state.finalCanvasPixelFailureClass,

      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        phase: 0,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceAuthoritySource: state.hexSurfaceAuthoritySource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,
      hexSurfaceReceiverReady: state.hexSurfaceReceiverReady,
      hexSurfaceDeliveryStatus: state.hexSurfaceDeliveryStatus,
      hexSurfaceDeliveryMethod: state.hexSurfaceDeliveryMethod,
      hexSurfaceDeliveryReason: state.hexSurfaceDeliveryReason,
      hexSurfaceAcceptedPacket: state.hexSurfaceAcceptedPacket,

      hexGatePacketDelivered: state.hexGatePacketDelivered,
      hexGateAcceptedByHexSurface: state.hexGateAcceptedByHexSurface,
      pointerFingerTransmissionObserved: state.pointerFingerTransmissionObserved,
      pointerFingerTransmissionSource: state.pointerFingerTransmissionSource,

      lastHexGatePacket: clonePlain(state.lastHexGatePacket),
      lastHexGatePacketAt: state.lastHexGatePacketAt,
      lastHexGateReason: state.lastHexGateReason,
      packetCount: state.packetCount,
      hexGatePacketCount: state.hexGatePacketCount,
      hexGateDeliveryCount: state.hexGateDeliveryCount,
      hexGateMissCount: state.hexGateMissCount,
      renderFrameCount: state.renderFrameCount,
      receiptPublishCount: state.receiptPublishCount,
      aliasPublishCount: state.aliasPublishCount,
      eventCount: state.eventCount,
      errorCount: state.errorCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      CANVAS_LOCAL_VISIBLE_DRAW_ATTEMPTED: state.canvasLocalVisibleDrawAttempted,
      CANVAS_LOCAL_VISIBLE_DRAW_EXECUTED: state.canvasLocalVisibleDrawExecuted,
      CANVAS_LOCAL_PIXEL_SAMPLE_AFTER_DRAW: state.canvasLocalPixelSampleAfterDraw ? state.canvasLocalPixelSampleAfterDraw.status : "NOT_RUN",
      HEX_GATE_PACKET_DELIVERED: state.hexGatePacketDelivered,
      HEX_GATE_ACCEPTED_BY_HEX_SURFACE: state.hexGateAcceptedByHexSurface,
      POINTER_FINGER_TRANSMISSION_OBSERVED: state.pointerFingerTransmissionObserved,
      DOWNSTREAM_EXPRESSION_PACKET_OBSERVED: state.downstreamExpressionPacketObserved,
      DOWNSTREAM_EXPRESSION_PACKET_DRAWABLE: state.downstreamExpressionPacketDrawable,
      FINAL_CANVAS_PIXEL_VISIBLE: state.finalCanvasPixelVisible,
      FINAL_CANVAS_PIXEL_FAILURE_CLASS: state.finalCanvasPixelFailureClass,

      supportsRouteConductorReleasePacket: true,
      supportsPlanetaryViewControlPacket: true,
      supportsCanvasPublicViewReceivers: true,
      supportsLocalVisiblePixelProof: true,
      supportsHexGateTransmission: true,
      supportsPointerFingerViaHexGateOnly: true,
      supportsCanvasSurfaceTruthReceipt: true,
      supportsV123PublicContract: true,
      supportsV1232Aliases: true,
      supportsV1231Aliases: true,

      ownsCanvasReceiverOutputCarrier: true,
      ownsCanvasSurfaceBinding: true,
      ownsCanvasViewPacketReception: true,
      ownsLocalVisiblePixelProofDraw: true,
      ownsHexGateTransmission: true,
      ownsPointerFingerDirectCall: false,
      ownsCanvasBishopInternals: false,
      ownsCanvasExpressionTruth: false,
      ownsHexTruth: false,
      ownsHexSurfaceTruth: false,
      ownsPointerFingerTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh();
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(),
      routeReleasePacket: clonePlain(state.routeReleasePacket),
      lastViewPacket: clonePlain(state.lastViewPacket),
      lastHexGateDeliveryReceipt: clonePlain(state.lastHexGateDeliveryReceipt),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      surface: {
        selector: surface.selector,
        mountSelector: surface.mountSelector,
        width: surface.width,
        height: surface.height,
        cssWidth: surface.cssWidth,
        cssHeight: surface.cssHeight,
        dpr: surface.dpr
      },
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalRenewalContract", INTERNAL_RENEWAL_CONTRACT),
      line("internalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT),
      line("previousInternalRenewalContract", PREVIOUS_INTERNAL_RENEWAL_CONTRACT),
      line("previousContract", PREVIOUS_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "SURFACE",
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasContext2DReady", r.canvasContext2DReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasVisiblePixelCount", r.canvasVisiblePixelCount),
      line("canvasAlphaPixelCount", r.canvasAlphaPixelCount),
      line("canvasUniqueColorCount", r.canvasUniqueColorCount),
      line("canvasDomSurfaceMounted", r.canvasDomSurfaceMounted),
      line("canvasDomSurfaceProofReady", r.canvasDomSurfaceProofReady),
      "",
      "LOCAL_VISIBLE_PIXEL_PROOF",
      line("canvasLocalVisibleDrawAttempted", r.canvasLocalVisibleDrawAttempted),
      line("canvasLocalVisibleDrawExecuted", r.canvasLocalVisibleDrawExecuted),
      line("canvasLocalVisibleDrawReason", r.canvasLocalVisibleDrawReason),
      line("canvasLocalVisibleDrawCount", r.canvasLocalVisibleDrawCount),
      line("canvasLocalPixelSampleAfterDraw", r.canvasLocalPixelSampleAfterDraw ? r.canvasLocalPixelSampleAfterDraw.status : "NOT_RUN"),
      line("finalCanvasPixelVisible", r.finalCanvasPixelVisible),
      line("finalCanvasPixelFailureClass", r.finalCanvasPixelFailureClass),
      "",
      "DOWNSTREAM_EXPRESSION",
      line("downstreamExpressionPacketObserved", r.downstreamExpressionPacketObserved),
      line("downstreamExpressionPacketSource", r.downstreamExpressionPacketSource),
      line("downstreamExpressionPacketDrawable", r.downstreamExpressionPacketDrawable),
      line("downstreamExpressionPacketDrawableReason", r.downstreamExpressionPacketDrawableReason),
      "",
      "HEX_GATE",
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceAuthoritySource", r.hexSurfaceAuthoritySource),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceContractRecognized", r.hexSurfaceContractRecognized),
      line("hexSurfaceReceiverReady", r.hexSurfaceReceiverReady),
      line("hexSurfaceDeliveryStatus", r.hexSurfaceDeliveryStatus),
      line("hexSurfaceDeliveryMethod", r.hexSurfaceDeliveryMethod),
      line("hexSurfaceDeliveryReason", r.hexSurfaceDeliveryReason),
      line("hexSurfaceAcceptedPacket", r.hexSurfaceAcceptedPacket),
      line("hexGatePacketDelivered", r.hexGatePacketDelivered),
      line("hexGateAcceptedByHexSurface", r.hexGateAcceptedByHexSurface),
      line("pointerFingerTransmissionObserved", r.pointerFingerTransmissionObserved),
      line("pointerFingerTransmissionSource", r.pointerFingerTransmissionSource),
      "",
      "VIEW",
      line("yaw", r.viewState && r.viewState.yaw),
      line("pitch", r.viewState && r.viewState.pitch),
      line("zoom", r.viewState && r.viewState.zoom),
      line("phase", 0),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13CanvasClaimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByCanvas", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getPacketText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_STATUS",
      line("contract", r.contract),
      line("internalRenewalContract", r.internalRenewalContract),
      line("canvasDomSurfaceMounted", r.canvasDomSurfaceMounted),
      line("canvasLocalVisibleDrawExecuted", r.canvasLocalVisibleDrawExecuted),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("finalCanvasPixelVisible", r.finalCanvasPixelVisible),
      line("finalCanvasPixelFailureClass", r.finalCanvasPixelFailureClass),
      line("controlsObserved", r.controlsObserved),
      line("controlPacketAccepted", r.controlPacketAccepted),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceReceiverReady", r.hexSurfaceReceiverReady),
      line("hexGateAcceptedByHexSurface", r.hexGateAcceptedByHexSurface),
      line("pointerFingerTransmissionObserved", r.pointerFingerTransmissionObserved),
      line("pointerFingerDirectCallSuppressed", true),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function refresh() {
    bindSurface();
    readHexAuthority();
    readHexSurfaceAuthority();
    drawLocalVisibleCarrierFrame("refresh");
    scanCanvasSurface();
    deriveNextCoordinates();

    updateDataset();
    publishGlobals("refresh");
    return getReceiptLight(false);
  }

  function mount(options = {}) {
    bindSurface(options || {});
    bindEventListeners();
    readHexAuthority();
    readHexSurfaceAuthority();
    drawLocalVisibleCarrierFrame("mount");
    deriveNextCoordinates();

    record("HEARTH_CANVAS_MOUNT_CALLED", {
      canvasSurfaceMounted: state.canvasDomSurfaceMounted,
      localVisiblePixelProof: state.finalCanvasPixelVisible,
      hexSurfaceReceiverReady: state.hexSurfaceReceiverReady
    });

    updateDataset();
    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "CANVAS_BOOTING_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE";

      publishGlobals("boot-early");
      mount(options || {});
      refresh();

      state.booted = true;
      state.booting = false;

      scheduleHexGateFrame("boot", null);

      record("HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_BOOTED", {
        contract: CONTRACT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        canvasSurfaceMounted: state.canvasDomSurfaceMounted,
        localVisiblePixelProof: state.finalCanvasPixelVisible,
        hexSurfaceReceiverReady: state.hexSurfaceReceiverReady,
        pointerFingerDirectCallSuppressed: true,
        visualPassClaimed: false
      });

      publishGlobals("boot-complete");
      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (frame.rafId) cancelFrame(frame.rafId);

    frame.scheduled = false;
    frame.rafId = 0;
    frame.pendingPacket = null;
    frame.pendingReason = "";

    state.disposed = true;
    state.postgameStatus = "CANVAS_DISPOSED";
    state.firstFailedCoordinate = "CANVAS_DISPOSED";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "REBOOT_CANVAS_IF_ROUTE_REQUIRES_TRANSMISSION";

    record("HEARTH_CANVAS_DISPOSED", { reason });
    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  function publishApiAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const aliases = [
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIVER",
      "HEARTH_CANVAS_HUB_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIVER",
      "HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIVER",
      "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
      "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
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
      "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasLocalVisiblePixelProofHexGateReceiver",
      "HEARTH.canvasHubLocalVisiblePixelProofHexGateReceiver",
      "HEARTH.canvasHexGatePointerFingerTransmissionReceiver",
      "HEARTH.canvasHubRafSphereRotationPairReceiver",
      "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
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
      "HEARTH.canvasVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasLocalVisiblePixelProofHexGateReceiver",
      "DEXTER_LAB.hearthCanvasHubLocalVisiblePixelProofHexGateReceiver",
      "DEXTER_LAB.hearthCanvasHexGatePointerFingerTransmissionReceiver",
      "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
      "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
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
    ];

    for (const alias of aliases) setPath(alias, api);

    hearth.canvasHub = api;
    hearth.canvas = api;
    hearth.canvasAuthority = api;
    hearth.canvasLocalVisiblePixelProofHexGateReceiver = api;
    hearth.canvasHexGatePointerFingerTransmissionReceiver = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvas = api;
    lab.hearthCanvasAuthority = api;
    lab.hearthCanvasLocalVisiblePixelProofHexGateReceiver = api;

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIPT = receipt;
    root.HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_RECEIPT_v12_5 = receipt;
    root.HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT = receipt;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasLocalVisiblePixelProofHexGateReceipt = receipt;
    hearth.canvasHexGatePointerFingerTransmissionReceipt = receipt;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasAuthorityReceipt = receipt;
    lab.hearthCanvasLocalVisiblePixelProofHexGateReceipt = receipt;

    root.HEARTH_CANVAS_LOCAL_VISIBLE_PIXEL_PROOF_HEX_GATE_PACKET_TEXT = composeReceiptText(receipt);

    updateDatasetLight();
    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

    if (reason !== "control-frame") {
      record("HEARTH_CANVAS_GLOBALS_PUBLISHED", {
        reason,
        contract: CONTRACT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        canvasSurfaceMounted: state.canvasDomSurfaceMounted,
        localVisiblePixelProof: state.finalCanvasPixelVisible,
        hexSurfaceReceiverReady: state.hexSurfaceReceiverReady,
        hexSurfaceDeliveryStatus: state.hexSurfaceDeliveryStatus,
        hexGateAcceptedByHexSurface: state.hexGateAcceptedByHexSurface,
        pointerFingerDirectCallSuppressed: true,
        visualPassClaimed: false
      });
    }

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    canvasContract: CONTRACT,
    canvasReceipt: RECEIPT,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentReceipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

    activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
    acceptedControlContracts: ACCEPTED_CONTROL_CONTRACTS.slice(),
    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
    transmissionChronology: TRANSMISSION_CHRONOLOGY.slice(),

    boot,
    start: boot,
    init: boot,
    run: boot,
    mount,
    dispose,
    refresh,

    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,
    receiveCanvasReleasePacket,
    acceptReleasePacket,

    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveCanvasViewState,
    consumeCanvasViewState,
    receiveViewState,
    setViewState,
    applyViewState,
    receiveControlPacket,
    receiveControlViewPacket: receiveControlViewPacketAlias,
    receiveControlsPacket,
    receivePlanetaryControlPacket,
    receiveViewDelta,
    applyViewDelta,
    setView,
    updateView,

    bindSurface,
    resizeSurface,
    scanCanvasSurface,
    sampleCanvasPixels,
    drawLocalVisibleCarrierFrame,
    readHexAuthority,
    readHexSurfaceAuthority,
    composeHexGatePacket,
    deliverHexGatePacket,
    scheduleHexGateFrame,
    flushHexGateFrame,
    bindEventListeners,

    getReceipt,
    getReceiptLight,
    getCanvasStationReceipt: getReceipt,
    getCanvasStationReceiptLight: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getCanvasVisibleProofReceipt: getReceiptLight,
    getCanvasSurfaceTruthReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getReceiptText,
    getPacketText,
    getStatusText,

    publishGlobals,
    publishApiAliases,
    publishReceiptAliases,
    updateDataset,
    updateDatasetLight,

    supportsRouteConductorReleasePacket: true,
    supportsPlanetaryViewControlPacket: true,
    supportsCanvasPublicViewReceivers: true,
    supportsLocalVisiblePixelProof: true,
    supportsHexGateTransmission: true,
    supportsPointerFingerViaHexGateOnly: true,
    supportsCanvasSurfaceTruthReceipt: true,
    supportsV123PublicContract: true,
    supportsV1232Aliases: true,
    supportsV1231Aliases: true,

    receiverOutputCarrierActive: true,
    localVisiblePixelProofActive: true,
    hexGateTransmissionActive: true,
    hexGateRequired: true,
    pointerFingerDirectCallSuppressed: true,
    canvasBishopInspectionSuppressed: true,
    canvasBishopMutationSuppressed: true,
    canvasExpressionTruthOwned: false,

    ownsCanvasReceiverOutputCarrier: true,
    ownsCanvasSurfaceBinding: true,
    ownsCanvasViewPacketReception: true,
    ownsLocalVisiblePixelProofDraw: true,
    ownsHexGateTransmission: true,
    ownsPointerFingerDirectCall: false,
    ownsCanvasBishopInternals: false,
    ownsCanvasExpressionTruth: false,
    ownsHexTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    },

    get view() {
      return view;
    },

    get surface() {
      return {
        mount: surface.mount,
        canvas: surface.canvas,
        ctx: surface.ctx,
        selector: surface.selector,
        mountSelector: surface.mountSelector,
        width: surface.width,
        height: surface.height,
        cssWidth: surface.cssWidth,
        cssHeight: surface.cssHeight,
        dpr: surface.dpr
      };
    }
  });

  try {
    publishGlobals("immediate-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
