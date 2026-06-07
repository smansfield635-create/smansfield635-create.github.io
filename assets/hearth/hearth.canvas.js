// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_TNT_v12_4_1
// Full-file replacement.
// Hearth Canvas presentation platter only.
//
// Purpose:
// - Preserve the public v12_3 Canvas contract expected by Route Conductor, Controls,
//   diagnostics, Hex Surface, Pointer/Finger inspection, and Index.
// - Preserve the v12_4 live-surface identity renewal as the current Canvas parent lane.
// - Repair the CANVAS_ZERO_RECT diagnosis by binding only the canonical visible canvas:
//   #hearthVisibleCanvas inside #hearthCanvasMount.
// - Refuse to treat temporary/offscreen canvases or generated image buffers as the
//   canonical visible Canvas surface.
// - Force a measurable DOM rectangle on the canonical canvas and mount before returning
//   Canvas surface truth receipts.
// - Continue returning canvas-side acceptance scan proof to the Route Conductor.
// - Receive Controls Queen view packets without owning Controls authority.
// - Remain the presentation platter and DOM canvas surface authority.
// - Do not own Route Conductor authority, Controls motion authority, terrain truth,
//   hydrology truth, elevation truth, material truth, Hex truth, Pointer Finger truth,
//   F13 claim, F21 claim, ready text, final visual pass, generated image,
//   GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_TNT_v12_4_1";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_RECEIPT_v12_4_1";

  const PREVIOUS_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const PREVIOUS_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const LINEAGE_V12_3_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const LINEAGE_V12_3_2_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const LINEAGE_V12_3_1_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1";
  const LINEAGE_V12_2_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const LINEAGE_V11_7_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";

  const VERSION =
    "2026-06-07.hearth-canvas-zero-rect-canonical-surface-binding-repair-v12-4-1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANONICAL_MOUNT_ID = "hearthCanvasMount";
  const CANONICAL_CANVAS_ID = "hearthVisibleCanvas";

  const ROUTE_PACKET_TYPE =
    "HEARTH_ROUTE_CONDUCTOR_TO_CANVAS_PRESENTATION_PLATTER_PACKET_v10_4";
  const CANVAS_ACCEPTANCE_PACKET =
    "HEARTH_CANVAS_PRESENTATION_PLATTER_ACCEPTANCE_SCAN_PACKET_v12_4_1";
  const CONTROL_PACKET_TYPE =
    "HEARTH_CONTROLS_HEX_GATE_VIEW_DELTA_PACKET_v5";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvas: false,
    f13ClaimedByRouteConductor: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByRouteConductor: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvas: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const ACCEPTED_ROUTE_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "CANVAS_V12_4_1_LOADED",

    canvasPresentationPlatterAuthority: true,
    liveSurfaceIdentityActive: true,
    unifiedVisible2dOutputActive: true,
    zeroRectCanonicalSurfaceBindingRepairActive: true,
    canonicalCanvasSelectionActive: true,
    temporaryCanvasDisambiguationActive: true,
    domSurfaceCreationAuthority: true,
    canvasAcceptanceScanAuthority: true,
    bilateralRouteCanvasAcceptanceActive: true,
    routeConductorPacketReceiverActive: true,
    controlsViewPacketReceiverActive: true,

    canvasOwnsDomSurface: true,
    canvasOwnsCanvasDrawing: true,
    canvasOwnsPresentationSurface: true,
    canvasDoesNotOwnSourceTruth: true,
    canvasDoesNotOwnRouteAuthority: true,
    canvasDoesNotOwnControlsAuthority: true,
    canvasDoesNotOwnHexTruth: true,
    canvasDoesNotOwnPointerFingerTruth: true,

    routeConductorObserved: false,
    routeConductorContract: "UNKNOWN",
    routeConductorReceipt: "UNKNOWN",
    routeConductorContractRecognized: false,

    controlObserved: false,
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

    hexAuthorityObserved: false,
    hexAuthorityContract: "UNKNOWN",
    hexSurfaceObserved: false,
    hexSurfaceContract: "UNKNOWN",
    pointerFingerObserved: false,
    pointerFingerContract: "UNKNOWN",

    mountFound: false,
    mountCreated: false,
    mountSelector: "UNKNOWN",
    mountRectNonzero: false,
    mountComputedVisible: false,

    canvasElementFound: false,
    canvasCreated: false,
    canvasMovedIntoMount: false,
    canvasInMount: false,
    canvasSelector: "UNKNOWN",
    canvasSelectionMode: "CANONICAL_SURFACE_ONLY",
    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalMountId: CANONICAL_MOUNT_ID,
    nonCanonicalCanvasCount: 0,
    temporaryCanvasIgnoredCount: 0,

    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasContext2dReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVisible: false,
    canvasSurfaceReady: false,
    visibleSurfacePermissionGranted: false,

    zeroRectRepairAttempted: false,
    zeroRectRepairApplied: false,
    zeroRectRepairReason: "NOT_RUN",
    concreteFallbackSizeApplied: false,
    concreteFallbackCssSize: "NONE",

    canvasAcceptanceScanRequested: false,
    canvasAcceptanceScanConfirmed: false,
    bilateralRouteCanvasScanConfirmed: false,
    routePresentationPacketAccepted: false,
    routePresentationPacketAcceptedAt: "",
    routePresentationPacketSourceContract: "UNKNOWN",
    routePresentationPacketType: "NONE",

    controlPacketAccepted: false,
    controlPacketAcceptedAt: "",
    controlPacketCount: 0,

    viewYaw: 0,
    viewPitch: 0,
    viewZoom: 1,
    viewPhase: 0,

    renderCount: 0,
    packetCount: 0,
    acceptanceCount: 0,
    rejectionCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    resizeCount: 0,

    firstFailedCoordinate: "CANVAS_BOOT_NOT_RUN",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_PRESENTATION_PLATTER",
    postgameStatus: "CANVAS_LOADED_WAITING_BOOT",

    lastRoutePacket: null,
    lastControlPacket: null,
    lastAcceptancePacket: null,
    lastReceipt: null,

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let mountElement = null;
  let canvasElement = null;
  let context2d = null;
  let bootPromise = null;
  let resizeRaf = 0;

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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
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
    if (value === undefined || value === null) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : safeString(value)}`;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path, base = root) {
    const parts = safeString(path).split(".");
    let cursor = base;

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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readField(source, keys, fallback = "") {
    const object = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys || []) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
        return object[key];
      }

      const lower = safeString(key).toLowerCase();

      for (const candidate of Object.keys(object)) {
        if (candidate.toLowerCase() === lower) {
          const value = object[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }

    return "";
  }

  function contractOf(source) {
    return firstNonEmpty(
      readField(source, [
        "internalRenewalContract",
        "renewalContract",
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "pointerFingerContract",
        "routeConductorContract",
        "sourceContract",
        "contract",
        "CONTRACT"
      ], ""),
      source && source.contract,
      source && source.CONTRACT
    );
  }

  function receiptOf(source) {
    return firstNonEmpty(
      readField(source, [
        "internalRenewalReceipt",
        "renewalReceipt",
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "pointerFingerReceipt",
        "routeConductorReceipt",
        "sourceReceipt",
        "receipt",
        "RECEIPT"
      ], ""),
      source && source.receipt,
      source && source.RECEIPT
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getDebugReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlsReceipt",
      "getControlHandshakeReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasSurfaceReceipt",
      "getCanvasSurfaceSummary",
      "getPresentationReceipt",
      "getPresentationPlatterReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getHexReceipt",
      "getPointerFingerReceipt",
      "getPointerFingerSummary",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 160);
    state.latestEvent = item.event;
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
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
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

  function qa(selector) {
    if (!doc) return [];

    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function describeElement(element) {
    if (!element || !element.tagName) return "NONE";
    const tag = safeString(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    return `${tag}${id}`;
  }

  function setImportant(element, property, value) {
    if (!element || !element.style || !element.style.setProperty) return false;

    try {
      element.style.setProperty(property, value, "important");
      return true;
    } catch (_error) {
      try {
        element.style[property] = value;
        return true;
      } catch (__error) {
        return false;
      }
    }
  }

  function routeContractRecognized(contract) {
    const text = safeString(contract);
    return Boolean(
      text &&
      (
        ACCEPTED_ROUTE_CONTRACTS.includes(text) ||
        text.includes("HEARTH_ROUTE_CONDUCTOR")
      )
    );
  }

  function observeNeighborAuthorities() {
    const route = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
      "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH.routeConductor",
      "HEARTH.routeConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "DEXTER_LAB.hearthRouteConductor"
    ]);
    const routeReceipt = readAuthorityReceipt(route.value) || {};
    state.routeConductorObserved = Boolean(route.value);
    state.routeConductorContract = firstNonEmpty(contractOf(routeReceipt), route.value && route.value.contract, "UNKNOWN");
    state.routeConductorReceipt = firstNonEmpty(receiptOf(routeReceipt), route.value && route.value.receipt, "UNKNOWN");
    state.routeConductorContractRecognized = routeContractRecognized(state.routeConductorContract);

    const controls = firstGlobal([
      "HEARTH_CONTROLS",
      "HEARTH_CONTROLS_QUEEN",
      "HEARTH_QUEEN_CONTROLS",
      "HEARTH.controls",
      "HEARTH.controlsQueen",
      "DEXTER_LAB.hearthControls"
    ]);
    const controlsReceipt = readAuthorityReceipt(controls.value) || {};
    state.controlObserved = Boolean(controls.value);
    state.controlContract = firstNonEmpty(contractOf(controlsReceipt), controls.value && controls.value.contract, "UNKNOWN");
    state.controlReceipt = firstNonEmpty(receiptOf(controlsReceipt), controls.value && controls.value.receipt, "UNKNOWN");

    const hexAuthority = firstGlobal([
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH.hexFourPairPixelHandshakeAuthority",
      "HEARTH.hexFourPairAuthority",
      "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority"
    ]);
    const hexAuthorityReceipt = readAuthorityReceipt(hexAuthority.value) || {};
    state.hexAuthorityObserved = Boolean(hexAuthority.value);
    state.hexAuthorityContract = firstNonEmpty(contractOf(hexAuthorityReceipt), hexAuthority.value && hexAuthority.value.contract, "UNKNOWN");

    const hexSurface = firstGlobal([
      "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
      "HEARTH_HEX_SURFACE_RENDERER",
      "HEARTH_HEX_SURFACE",
      "HEARTH.hexSurface",
      "HEARTH.hexSurfaceRenderer",
      "DEXTER_LAB.hearthHexSurface"
    ]);
    const hexSurfaceReceipt = readAuthorityReceipt(hexSurface.value) || {};
    state.hexSurfaceObserved = Boolean(hexSurface.value);
    state.hexSurfaceContract = firstNonEmpty(contractOf(hexSurfaceReceipt), hexSurface.value && hexSurface.value.contract, "UNKNOWN");

    const pointerFinger = firstGlobal([
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH_POINTER_FINGER",
      "HEARTH.pointerFingerReceiver",
      "HEARTH.canvasFingerInspect",
      "HEARTH.pointerFinger",
      "DEXTER_LAB.hearthCanvasFingerInspect"
    ]);
    const pointerFingerReceipt = readAuthorityReceipt(pointerFinger.value) || {};
    state.pointerFingerObserved = Boolean(pointerFinger.value);
    state.pointerFingerContract = firstNonEmpty(contractOf(pointerFingerReceipt), pointerFinger.value && pointerFinger.value.contract, "UNKNOWN");
  }

  function findMount() {
    if (!doc) return null;

    return (
      q(`#${CANONICAL_MOUNT_ID}`) ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-visible-planet-mount='true']")
    );
  }

  function createMount() {
    if (!doc || !isFunction(doc.createElement)) return null;

    const target =
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage='true']") ||
      q("#hearthPlanetStage") ||
      q("[data-hearth-planet-stage='true']") ||
      q("main") ||
      doc.body ||
      doc.documentElement;

    if (!target) return null;

    const mount = doc.createElement("section");
    mount.id = CANONICAL_MOUNT_ID;
    mount.setAttribute("data-hearth-canvas-mount", "true");
    mount.setAttribute("data-hearth-visible-planet-mount", "true");
    mount.setAttribute("aria-label", "Hearth visible canvas mount");

    target.appendChild(mount);
    state.mountCreated = true;

    return mount;
  }

  function normalizeMountLayout(mount) {
    if (!mount) return false;

    try {
      if (!mount.id) mount.id = CANONICAL_MOUNT_ID;
      mount.setAttribute("data-hearth-canvas-mount", "true");
      mount.setAttribute("data-hearth-visible-planet-mount", "true");
      mount.setAttribute("data-hearth-canonical-canvas-mount", "true");
      mount.setAttribute("data-hearth-canvas-zero-rect-repair-mount", "true");

      setImportant(mount, "position", "relative");
      setImportant(mount, "z-index", "4");
      setImportant(mount, "display", "grid");
      setImportant(mount, "place-items", "center");
      setImportant(mount, "width", "100%");
      setImportant(mount, "max-width", "100%");
      setImportant(mount, "min-width", "0");
      setImportant(mount, "min-height", "clamp(300px, 56svh, 680px)");
      setImportant(mount, "height", "auto");
      setImportant(mount, "overflow", "visible");
      setImportant(mount, "visibility", "visible");
      setImportant(mount, "opacity", "1");
      setImportant(mount, "pointer-events", "auto");
      setImportant(mount, "touch-action", "none");
      setImportant(mount, "contain", "none");
    } catch (error) {
      recordError("CANVAS_MOUNT_LAYOUT_NORMALIZE_ERROR", error);
      return false;
    }

    return true;
  }

  function ensureMount() {
    if (mountElement && doc && doc.contains && doc.contains(mountElement)) {
      normalizeMountLayout(mountElement);
      return mountElement;
    }

    mountElement = findMount();

    if (!mountElement) {
      mountElement = createMount();
    }

    state.mountFound = Boolean(mountElement);
    state.mountSelector = mountElement
      ? (mountElement.id ? `#${mountElement.id}` : describeElement(mountElement))
      : "UNKNOWN";

    normalizeMountLayout(mountElement);
    return mountElement;
  }

  function isCanonicalCanvasCandidate(canvas, mount) {
    if (!canvas || !canvas.tagName || safeString(canvas.tagName).toLowerCase() !== "canvas") return false;
    if (canvas.id === CANONICAL_CANVAS_ID) return true;
    if (mount && canvas.parentNode === mount && canvas.dataset && canvas.dataset.hearthVisibleCanvas === "true") return true;
    if (mount && canvas.parentNode === mount && canvas.dataset && canvas.dataset.hearthExpressionSurface === "true") return true;
    return false;
  }

  function countNonCanonicalCanvases(canonical) {
    const canvases = qa("canvas");
    state.nonCanonicalCanvasCount = canvases.filter((canvas) => canvas !== canonical).length;
    state.temporaryCanvasIgnoredCount = canvases.filter((canvas) => {
      if (canvas === canonical) return false;
      if (canvas.dataset && (
        canvas.dataset.hearthTemporaryCanvas === "true" ||
        canvas.dataset.hearthGeneratedImage === "true" ||
        canvas.dataset.generatedImage === "true" ||
        canvas.dataset.graphicBox === "true"
      )) {
        return true;
      }
      if (!canvas.id && (!canvas.parentNode || canvas.parentNode !== mountElement)) return true;
      return false;
    }).length;
  }

  function findCanonicalCanvas(mount) {
    if (!doc) return null;

    const byId = q(`#${CANONICAL_CANVAS_ID}`);
    if (byId && safeString(byId.tagName).toLowerCase() === "canvas") {
      return byId;
    }

    if (mount && mount.querySelector) {
      const local =
        mount.querySelector("canvas[data-hearth-visible-canvas='true']") ||
        mount.querySelector("canvas[data-hearth-expression-surface='true']") ||
        mount.querySelector("canvas[data-hearth-canvas-hub='true']") ||
        mount.querySelector("canvas[data-hearth-canvas='true']") ||
        mount.querySelector("canvas");

      if (local && isCanonicalCanvasCandidate(local, mount)) return local;
      if (local && !local.id) return local;
    }

    return null;
  }

  function createCanvas(mount) {
    if (!doc || !mount || !isFunction(doc.createElement)) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = CANONICAL_CANVAS_ID;
    canvas.setAttribute("aria-label", "Hearth visible 2D planet surface");
    canvas.setAttribute("role", "img");

    mount.appendChild(canvas);
    state.canvasCreated = true;

    return canvas;
  }

  function moveCanvasIntoMountIfNeeded(canvas, mount) {
    if (!canvas || !mount) return false;

    try {
      if (canvas.parentNode !== mount) {
        mount.appendChild(canvas);
        state.canvasMovedIntoMount = true;
        return true;
      }
    } catch (error) {
      recordError("CANVAS_MOVE_INTO_MOUNT_FAILED", error);
    }

    return false;
  }

  function markCanvas(canvas) {
    if (!canvas) return;

    try {
      canvas.id = CANONICAL_CANVAS_ID;
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-canonical-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-selection-mode", "CANONICAL_SURFACE_ONLY");
      canvas.setAttribute("data-hearth-canvas-contract", CONTRACT);
      canvas.setAttribute("data-hearth-canvas-receipt", RECEIPT);
      canvas.setAttribute("data-hearth-canvas-renewal-contract", RENEWAL_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-renewal-receipt", RENEWAL_RECEIPT);
      canvas.setAttribute("data-hearth-canvas-internal-renewal-contract", INTERNAL_RENEWAL_CONTRACT);
      canvas.setAttribute("data-hearth-canvas-internal-renewal-receipt", INTERNAL_RENEWAL_RECEIPT);
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
    } catch (error) {
      recordError("CANVAS_MARK_FAILED", error);
    }
  }

  function normalizeCanvasLayout(canvas) {
    if (!canvas) return false;

    try {
      setImportant(canvas, "position", "relative");
      setImportant(canvas, "z-index", "5");
      setImportant(canvas, "display", "block");
      setImportant(canvas, "visibility", "visible");
      setImportant(canvas, "opacity", "1");
      setImportant(canvas, "box-sizing", "border-box");
      setImportant(canvas, "width", "min(84vw, 56svh, 640px)");
      setImportant(canvas, "height", "min(84vw, 56svh, 640px)");
      setImportant(canvas, "min-width", "230px");
      setImportant(canvas, "min-height", "230px");
      setImportant(canvas, "max-width", "100%");
      setImportant(canvas, "max-height", "640px");
      setImportant(canvas, "aspect-ratio", "1 / 1");
      setImportant(canvas, "object-fit", "contain");
      setImportant(canvas, "margin", "auto");
      setImportant(canvas, "border-radius", "50%");
      setImportant(canvas, "transform", "none");
      setImportant(canvas, "translate", "none");
      setImportant(canvas, "pointer-events", "auto");
      setImportant(canvas, "touch-action", "none");
      setImportant(canvas, "user-select", "none");
      setImportant(canvas, "-webkit-user-select", "none");
    } catch (error) {
      recordError("CANVAS_LAYOUT_NORMALIZE_ERROR", error);
      return false;
    }

    return true;
  }

  function measure(element) {
    if (!element || !element.getBoundingClientRect) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0),
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0)
      };
    } catch (_error) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  function computedVisible(element) {
    if (!element) return false;

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(element) : null;
      if (!style) return true;

      return Boolean(
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.visibility !== "collapse" &&
        safeNumber(style.opacity, 1) > 0
      );
    } catch (_error) {
      return true;
    }
  }

  function fallbackCssSize() {
    const vw = Math.max(320, safeNumber(root.innerWidth, 720));
    const vh = Math.max(320, safeNumber(root.innerHeight, 720));
    const size = Math.max(230, Math.min(640, Math.floor(vw * 0.84), Math.floor(vh * 0.56)));
    return size;
  }

  function forceConcreteCanvasSize(canvas, reason) {
    if (!canvas) return false;

    const size = fallbackCssSize();

    setImportant(canvas, "width", `${size}px`);
    setImportant(canvas, "height", `${size}px`);
    setImportant(canvas, "min-width", `${Math.min(size, 230)}px`);
    setImportant(canvas, "min-height", `${Math.min(size, 230)}px`);

    if (mountElement) {
      setImportant(mountElement, "min-height", `${Math.max(size, 300)}px`);
    }

    state.zeroRectRepairAttempted = true;
    state.zeroRectRepairApplied = true;
    state.zeroRectRepairReason = reason || "CANVAS_RECT_ZERO_CONCRETE_SIZE_APPLIED";
    state.concreteFallbackSizeApplied = true;
    state.concreteFallbackCssSize = `${size}px`;

    record("CANVAS_ZERO_RECT_CONCRETE_SIZE_APPLIED", {
      reason,
      size
    });

    return true;
  }

  function resizeCanvasToDisplayedRect() {
    const canvas = canvasElement;
    if (!canvas) return false;

    let rect = measure(canvas);

    if (rect.width <= 0 || rect.height <= 0) {
      forceConcreteCanvasSize(canvas, "resize-before-buffer-zero-rect");
      rect = measure(canvas);
    }

    const cssWidth = Math.max(1, Math.floor(rect.width || fallbackCssSize()));
    const cssHeight = Math.max(1, Math.floor(rect.height || cssWidth));
    const dpr = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    const pixelWidth = Math.max(1, Math.floor(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.floor(cssHeight * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      state.resizeCount += 1;
    }

    try {
      context2d = context2d || canvas.getContext("2d", { willReadFrequently: true });
      if (context2d && isFunction(context2d.setTransform)) {
        context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    } catch (_error) {}

    return true;
  }

  function ensureCanvasSurface(reason = "manual") {
    const mount = ensureMount();

    if (!mount) {
      state.canvasElementFound = false;
      state.canvasSurfaceReady = false;
      state.visibleSurfacePermissionGranted = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HTML_CONTAINS_CANONICAL_CANVAS_MOUNT_OR_ALLOW_CANVAS_TO_CREATE_MOUNT";
      state.postgameStatus = "CANVAS_SURFACE_HELD_MOUNT_PENDING";
      updateDataset();
      return false;
    }

    let canvas = findCanonicalCanvas(mount);

    if (!canvas) {
      canvas = createCanvas(mount);
    }

    if (!canvas) {
      state.canvasElementFound = false;
      state.canvasSurfaceReady = false;
      state.visibleSurfacePermissionGranted = false;
      state.firstFailedCoordinate = "CANVAS_ELEMENT_CREATE_OR_BIND_FAILED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_CANONICAL_CANVAS_DOM_SURFACE_CREATION";
      state.postgameStatus = "CANVAS_SURFACE_HELD_ELEMENT_PENDING";
      updateDataset();
      return false;
    }

    canvasElement = canvas;
    moveCanvasIntoMountIfNeeded(canvasElement, mount);
    markCanvas(canvasElement);
    normalizeMountLayout(mount);
    normalizeCanvasLayout(canvasElement);
    countNonCanonicalCanvases(canvasElement);

    try {
      context2d = canvasElement.getContext("2d", { willReadFrequently: true });
    } catch (_error) {
      try {
        context2d = canvasElement.getContext("2d");
      } catch (__error) {
        context2d = null;
      }
    }

    resizeCanvasToDisplayedRect();
    scanCanvasSurface({ repairIfZero: true });

    if (!state.canvasSurfaceReady) {
      state.firstFailedCoordinate = state.canvasRectNonzero
        ? "CANVAS_SURFACE_CREATED_BUT_NOT_READY"
        : "CANVAS_RECT_NONZERO";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = state.canvasRectNonzero
        ? "RECHECK_CANVAS_CONTEXT_AND_COMPUTED_VISIBILITY"
        : "VERIFY_CANONICAL_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT";
      state.postgameStatus = "CANVAS_SURFACE_CREATED_PENDING_CONTEXT_RECT_OR_VISIBILITY";
    } else {
      state.firstFailedCoordinate = "NONE_CANVAS_DOM_SURFACE_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "ACCEPT_ROUTE_PRESENTATION_PACKET_AND_RENDER_VISIBLE_2D_OUTPUT";
      state.postgameStatus = "CANVAS_DOM_SURFACE_READY_WAITING_OR_ACCEPTING_PRESENTATION_PACKET";
    }

    record("CANONICAL_CANVAS_SURFACE_ENSURED", {
      reason,
      mountFound: state.mountFound,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasMovedIntoMount: state.canvasMovedIntoMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasSurfaceReady: state.canvasSurfaceReady,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount
    });

    updateDataset();
    return state.canvasSurfaceReady;
  }

  function sampleCanvasPixel(canvas, ctx) {
    if (!canvas || !ctx || canvas.width <= 0 || canvas.height <= 0) {
      return { status: "PIXEL_SAMPLE_UNREADABLE", visible: false };
    }

    const points = [
      [0.5, 0.5],
      [0.34, 0.5],
      [0.66, 0.5],
      [0.5, 0.34],
      [0.5, 0.66],
      [0.25, 0.25],
      [0.75, 0.75]
    ];

    let alpha = 0;
    let visible = 0;

    try {
      for (const point of points) {
        const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(canvas.width * point[0])));
        const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(canvas.height * point[1])));
        const data = ctx.getImageData(x, y, 1, 1).data;
        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alpha += 1;
        if (a > 0 && (r > 4 || g > 4 || b > 4)) visible += 1;
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        reason: safeString(error && error.message, "PIXEL_SAMPLE_ERROR")
      };
    }

    if (visible > 0) return { status: "PIXEL_SAMPLE_VISIBLE", visible: true };
    if (alpha > 0) return { status: "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK", visible: false };
    return { status: "PIXEL_SAMPLE_BLANK", visible: false };
  }

  function scanCanvasSurface(options = {}) {
    const repairIfZero = options.repairIfZero !== false;

    const mount = mountElement || findMount();
    const canvas = canvasElement || findCanonicalCanvas(mount);

    mountElement = mount || mountElement;
    canvasElement = canvas || canvasElement;

    if (mountElement) normalizeMountLayout(mountElement);
    if (canvasElement) {
      markCanvas(canvasElement);
      normalizeCanvasLayout(canvasElement);
    }

    let mountRect = measure(mountElement);
    let canvasRect = measure(canvasElement);

    if (repairIfZero && canvasElement && (canvasRect.width <= 0 || canvasRect.height <= 0)) {
      forceConcreteCanvasSize(canvasElement, "scan-canvas-zero-rect");
      resizeCanvasToDisplayedRect();
      canvasRect = measure(canvasElement);
      mountRect = measure(mountElement);
    }

    let contextReady = false;
    try {
      if (canvasElement && isFunction(canvasElement.getContext)) {
        context2d = context2d || canvasElement.getContext("2d", { willReadFrequently: true });
        contextReady = Boolean(context2d);
      }
    } catch (_error) {
      contextReady = Boolean(context2d);
    }

    const pixel = sampleCanvasPixel(canvasElement, context2d);
    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);

    state.mountFound = Boolean(mountElement);
    state.mountSelector = mountElement ? (mountElement.id ? `#${mountElement.id}` : describeElement(mountElement)) : "UNKNOWN";
    state.mountRectNonzero = mountRect.width > 0 && mountRect.height > 0;
    state.mountComputedVisible = computedVisible(mountElement);

    state.canvasElementFound = Boolean(canvasElement);
    state.canvasInMount = Boolean(mountElement && canvasElement && mountElement.contains && mountElement.contains(canvasElement));
    state.canvasSelector = canvasElement ? `#${CANONICAL_CANVAS_ID}` : "UNKNOWN";
    state.canvasRectNonzero = canvasRect.width > 0 && canvasRect.height > 0;
    state.canvasComputedVisible = computedVisible(canvasElement);
    state.canvasViewportIntersecting = Boolean(
      state.canvasRectNonzero &&
      viewportWidth > 0 &&
      viewportHeight > 0 &&
      canvasRect.left < viewportWidth &&
      canvasRect.right > 0 &&
      canvasRect.top < viewportHeight &&
      canvasRect.bottom > 0
    );
    state.canvasContext2dReady = contextReady;
    state.canvasPixelVisible = Boolean(pixel.visible);
    state.canvasPixelSampleStatus = pixel.status;
    state.canvasSurfaceReady = Boolean(
      state.mountFound &&
      state.canvasElementFound &&
      state.canvasInMount &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible &&
      state.canvasContext2dReady
    );
    state.visibleSurfacePermissionGranted = state.canvasSurfaceReady;

    countNonCanonicalCanvases(canvasElement);

    return {
      canvasMountFound: state.mountFound,
      canvasMountSelector: state.mountSelector,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSurfaceReady: state.canvasSurfaceReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      canvasSelector: state.canvasSelector,
      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      canvasSelectionMode: state.canvasSelectionMode,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied
    };
  }

  function drawPlanetSurface(reason = "manual") {
    if (!canvasElement || !context2d) {
      ensureCanvasSurface(`draw:${reason}`);
    }

    if (!canvasElement || !context2d) return false;

    resizeCanvasToDisplayedRect();

    const rect = measure(canvasElement);
    const cssWidth = Math.max(1, Math.floor(rect.width || fallbackCssSize()));
    const cssHeight = Math.max(1, Math.floor(rect.height || cssWidth));
    const w = cssWidth;
    const h = cssHeight;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.max(80, Math.min(w, h) * 0.46);
    const yaw = state.viewYaw;
    const pitch = state.viewPitch;
    const zoom = state.viewZoom;
    const ctx = context2d;

    try {
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.24);
      bg.addColorStop(0, "rgba(9, 20, 32, 0.10)");
      bg.addColorStop(1, "rgba(9, 20, 32, 0.72)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - radius * 0.24,
        cy - radius * 0.22,
        radius * 0.08,
        cx,
        cy,
        radius * 1.1
      );
      ocean.addColorStop(0, "#4da9cc");
      ocean.addColorStop(0.46, "#1c668d");
      ocean.addColorStop(1, "#082f4d");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.globalAlpha = 0.88;
      drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.16, -0.22, 0.42, 0.20);
      drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, -0.34, -0.08, 0.30, 0.17);
      drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.05, 0.27, 0.34, 0.16);
      drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, 0.42, 0.08, 0.18, 0.12);
      drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, -0.12, -0.46, 0.22, 0.08);
      ctx.globalAlpha = 1;

      const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      shade.addColorStop(0, "rgba(255,255,255,0.26)");
      shade.addColorStop(0.45, "rgba(255,255,255,0.02)");
      shade.addColorStop(1, "rgba(0,0,0,0.34)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(170, 225, 255, 0.34)";
      ctx.lineWidth = Math.max(1, radius * 0.012);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - radius * 0.08, cy - radius * 0.08, radius * 1.02, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(199, 236, 255, 0.10)";
      ctx.lineWidth = Math.max(1, radius * 0.035);
      ctx.stroke();

      state.renderCount += 1;
      state.updatedAt = nowIso();

      scanCanvasSurface({ repairIfZero: true });
      updateDataset();

      return true;
    } catch (error) {
      recordError("CANVAS_2D_RENDER_FAILED", error, { reason });
      scanCanvasSurface({ repairIfZero: true });
      updateDataset();
      return false;
    }
  }

  function drawLandMass(ctx, cx, cy, radius, yaw, pitch, zoom, ox, oy, sx, sy) {
    const points = 18;
    const x = cx + radius * (ox * Math.cos(yaw * 0.25) + Math.sin(yaw + ox) * 0.05) * zoom;
    const y = cy + radius * (oy + Math.sin(pitch + oy) * 0.045) * zoom;
    const rx = radius * sx * zoom;
    const ry = radius * sy * zoom;

    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const a = (Math.PI * 2 * i) / points;
      const irregular =
        1 +
        Math.sin(a * 3 + yaw * 0.9 + ox * 10) * 0.13 +
        Math.cos(a * 5 + pitch * 0.7 + oy * 12) * 0.08;

      const px = x + Math.cos(a) * rx * irregular;
      const py = y + Math.sin(a) * ry * irregular;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();

    const grad = ctx.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
    grad.addColorStop(0, "#9e8b52");
    grad.addColorStop(0.45, "#5f7d48");
    grad.addColorStop(1, "#3e5b3b");

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(218, 210, 148, 0.20)";
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.stroke();
  }

  function routePacketLooksValid(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type);
    const destination = safeString(packet.destinationFile || packet.targetFile || packet.canvasFile);
    const sourceFile = safeString(packet.sourceFile || packet.fromFile);
    const contract = safeString(packet.contract || packet.routeConductorContract || packet.sourceContract);

    return Boolean(
      packetType === ROUTE_PACKET_TYPE ||
      packetType.includes("PRESENTATION_PLATTER") ||
      packetType.includes("CANVAS_HANDOFF") ||
      destination === FILE ||
      destination.endsWith("/hearth.canvas.js") ||
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR")
    );
  }

  function composeAcceptancePacket(packet = {}) {
    const p = isObject(packet) ? packet : {};
    const routeActiveScanConfirmed = safeBool(p.routeActiveScanConfirmed, false);
    const accepted = Boolean(state.canvasSurfaceReady && routePacketLooksValid(p));

    const acceptance = {
      packetType: CANVAS_ACCEPTANCE_PACKET,
      type: CANVAS_ACCEPTANCE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_PRESENTATION_PLATTER",
      sourceRole: "canvas-presentation-platter-canonical-dom-surface-authority",
      targetFile: ROUTE_CONDUCTOR_FILE,
      destinationFile: ROUTE_CONDUCTOR_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      canvasFile: FILE,
      controlsFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      accepted,
      ok: accepted,
      routePresentationPacketAccepted: accepted,
      canvasAcceptanceScanConfirmed: accepted,
      canvasAcceptanceScanRequested: true,
      bilateralRouteCanvasScanConfirmed: Boolean(accepted && routeActiveScanConfirmed),

      canonicalCanvasSelectionActive: true,
      canvasSelectionMode: state.canvasSelectionMode,
      canonicalCanvasId: CANONICAL_CANVAS_ID,
      canonicalMountId: CANONICAL_MOUNT_ID,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,

      canvasMountFound: state.mountFound,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSurfaceReady: state.canvasSurfaceReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,

      zeroRectRepairAttempted: state.zeroRectRepairAttempted,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      zeroRectRepairReason: state.zeroRectRepairReason,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize,

      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasOwnsPresentationSurface: true,
      canvasDoesNotOwnSourceTruth: true,
      canvasDoesNotOwnRouteAuthority: true,
      canvasDoesNotOwnControlsAuthority: true,
      canvasDoesNotOwnHexTruth: true,
      canvasDoesNotOwnPointerFingerTruth: true,

      routePacketType: safeString(p.packetType || p.type || "UNKNOWN"),
      routePacketContract: safeString(p.contract || p.routeConductorContract || p.sourceContract || "UNKNOWN"),
      routeActiveScanConfirmed,
      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      firstFailedCoordinate: accepted ? "NONE_CANVAS_ACCEPTANCE_SCAN_CONFIRMED" : state.firstFailedCoordinate,
      recommendedNextFile: accepted ? FILE : state.recommendedNextFile,
      recommendedNextAction: accepted
        ? "OBSERVE_CANVAS_SURFACE_TRUTH_PROBE_AFTER_CANONICAL_RECT_REPAIR"
        : state.recommendedNextAction,
      postgameStatus: accepted
        ? "CANVAS_PRESENTATION_PLATTER_ACCEPTED_ROUTE_PACKET_CANONICAL_SURFACE_READY_NO_FINAL_CLAIM"
        : state.postgameStatus,

      acceptedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastAcceptancePacket = clonePlain(acceptance);
    return acceptance;
  }

  function receiveRoutePresentationPlatterPacket(packet) {
    state.packetCount += 1;
    state.canvasAcceptanceScanRequested = true;
    state.lastRoutePacket = clonePlain(packet || null);
    state.routePresentationPacketType = safeString(packet && (packet.packetType || packet.type), "UNKNOWN");
    state.routePresentationPacketSourceContract = safeString(
      packet && (packet.contract || packet.routeConductorContract || packet.sourceContract),
      "UNKNOWN"
    );

    observeNeighborAuthorities();
    ensureCanvasSurface("route-presentation-packet");
    drawPlanetSurface("route-presentation-packet");

    const accepted = Boolean(state.canvasSurfaceReady && routePacketLooksValid(packet));

    state.routePresentationPacketAccepted = accepted;
    state.canvasAcceptanceScanConfirmed = accepted;
    state.bilateralRouteCanvasScanConfirmed = Boolean(
      accepted && safeBool(packet && packet.routeActiveScanConfirmed, false)
    );

    if (accepted) {
      state.acceptanceCount += 1;
      state.routePresentationPacketAcceptedAt = nowIso();
      state.firstFailedCoordinate = "NONE_CANVAS_PRESENTATION_PLATTER_ACCEPTED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "RUN_CANVAS_SURFACE_TRUTH_PROBE_AND_CONFIRM_CANONICAL_DOM_CANVAS_RECT";
      state.postgameStatus = "CANVAS_ACCEPTED_ROUTE_PRESENTATION_PACKET_CANONICAL_DOM_SURFACE_READY";
    } else {
      state.rejectionCount += 1;
      state.firstFailedCoordinate = state.canvasSurfaceReady
        ? "ROUTE_PRESENTATION_PACKET_NOT_RECOGNIZED"
        : "CANONICAL_CANVAS_DOM_SURFACE_NOT_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_ROUTE_PRESENTATION_PACKET_OR_CANONICAL_CANVAS_DOM_SURFACE";
      state.postgameStatus = "CANVAS_PRESENTATION_PACKET_HELD";
    }

    const acceptance = composeAcceptancePacket(packet);

    publishPacketAliases(acceptance);
    updateDataset();
    publishReceiptAliases();

    record("CANVAS_ROUTE_PRESENTATION_PACKET_RECEIVED", {
      accepted,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      routePacketType: state.routePresentationPacketType
    });

    return acceptance;
  }

  function consumeRoutePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receivePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumePresentationPlatterPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveBilateralRouteCanvasPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeBilateralRouteCanvasPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRouteConductorPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRouteConductorPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRouteConductorPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRouteConductorPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveGovernedPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeGovernedPresentationPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveGovernedSourcePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeGovernedSourcePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveCanvasHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeCanvasHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeHandoffPacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function receiveRoutePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function consumeRoutePacket(packet) {
    return receiveRoutePresentationPlatterPacket(packet);
  }

  function applyControlPacket(packet = {}) {
    state.controlPacketCount += 1;
    state.controlPacketAccepted = true;
    state.controlPacketAcceptedAt = nowIso();
    state.lastControlPacket = clonePlain(packet);

    const viewState = isObject(packet.viewState) ? packet.viewState : packet;

    if (viewState.yaw !== undefined || packet.deltaYaw !== undefined) {
      state.viewYaw = safeNumber(
        viewState.yaw !== undefined ? viewState.yaw : state.viewYaw + safeNumber(packet.deltaYaw, 0),
        state.viewYaw
      );
    }

    if (viewState.pitch !== undefined || packet.deltaPitch !== undefined) {
      state.viewPitch = safeNumber(
        viewState.pitch !== undefined ? viewState.pitch : state.viewPitch + safeNumber(packet.deltaPitch, 0),
        state.viewPitch
      );
    }

    if (viewState.zoom !== undefined || packet.deltaZoom !== undefined) {
      state.viewZoom = Math.max(
        0.72,
        Math.min(
          1.55,
          safeNumber(
            viewState.zoom !== undefined ? viewState.zoom : state.viewZoom + safeNumber(packet.deltaZoom, 0),
            state.viewZoom
          )
        )
      );
    }

    state.viewPhase = 0;

    ensureCanvasSurface("control-view-packet");
    drawPlanetSurface("control-view-packet");

    updateDataset();
    publishReceiptAliases();

    return {
      packetType: "HEARTH_CANVAS_CONTROL_VIEW_PACKET_ACCEPTANCE_v12_4_1",
      accepted: true,
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      controlPacketType: safeString(packet.packetType || packet.type || CONTROL_PACKET_TYPE),
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasElementFound: state.canvasElementFound,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      viewState: {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      },
      ...NO_CLAIMS
    };
  }

  function receiveHexGateViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeHexGateViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlsHexGatePacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeControlsHexGatePacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveQueenHexGateViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeQueenHexGateViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function receivePlanetaryViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumePlanetaryViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function consumeViewControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveCanvasViewState(packet) {
    return applyControlPacket(packet);
  }

  function consumeCanvasViewState(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewState(packet) {
    return applyControlPacket(packet);
  }

  function setViewState(packet) {
    return applyControlPacket(packet);
  }

  function applyViewState(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlPacket(packet) {
    if (routePacketLooksValid(packet)) return receiveRoutePresentationPlatterPacket(packet);
    return applyControlPacket(packet);
  }

  function receiveControlViewPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveControlsPacket(packet) {
    return applyControlPacket(packet);
  }

  function receivePlanetaryControlPacket(packet) {
    return applyControlPacket(packet);
  }

  function receiveViewDelta(packet) {
    return applyControlPacket(packet);
  }

  function applyViewDelta(packet) {
    return applyControlPacket(packet);
  }

  function setView(packet) {
    return applyControlPacket(packet);
  }

  function updateView(packet) {
    return applyControlPacket(packet);
  }

  function publishPacketAliases(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_PRESENTATION_PLATTER_ACCEPTANCE_PACKET = cloned;
    root.HEARTH_CANVAS_ACCEPTANCE_SCAN_PACKET = cloned;
    root.HEARTH_CANVAS_BILATERAL_ROUTE_SCAN_RECEIPT = cloned;

    hearth.canvasPresentationPlatterAcceptancePacket = cloned;
    hearth.canvasAcceptanceScanPacket = cloned;
    hearth.canvasBilateralRouteScanReceipt = cloned;

    lab.hearthCanvasPresentationPlatterAcceptancePacket = cloned;
    lab.hearthCanvasAcceptanceScanPacket = cloned;

    return true;
  }

  function composeReceipt() {
    return {
      packetType: "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_RECEIPT_PACKET_v12_4_1",
      contract: CONTRACT,
      receipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: RENEWAL_CONTRACT,
      currentCanvasParentReceipt: RENEWAL_RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
      lineageV123Contract: LINEAGE_V12_3_CONTRACT,
      lineageV1232Contract: LINEAGE_V12_3_2_CONTRACT,
      lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
      lineageV122Contract: LINEAGE_V12_2_CONTRACT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      version: VERSION,

      route: ROUTE,
      file: FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "canvas-presentation-platter-canonical-dom-surface-authority",

      canvasPresentationPlatterAuthority: true,
      liveSurfaceIdentityActive: true,
      unifiedVisible2dOutputActive: true,
      zeroRectCanonicalSurfaceBindingRepairActive: true,
      canonicalCanvasSelectionActive: true,
      temporaryCanvasDisambiguationActive: true,
      domSurfaceCreationAuthority: true,
      canvasAcceptanceScanAuthority: true,
      bilateralRouteCanvasAcceptanceActive: true,
      routeConductorPacketReceiverActive: true,
      controlsViewPacketReceiverActive: true,

      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasOwnsPresentationSurface: true,
      canvasDoesNotOwnSourceTruth: true,
      canvasDoesNotOwnRouteAuthority: true,
      canvasDoesNotOwnControlsAuthority: true,
      canvasDoesNotOwnHexTruth: true,
      canvasDoesNotOwnPointerFingerTruth: true,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,

      controlObserved: state.controlObserved,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthorityContract: state.hexAuthorityContract,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceContract: state.hexSurfaceContract,
      pointerFingerObserved: state.pointerFingerObserved,
      pointerFingerContract: state.pointerFingerContract,

      canvasMountFound: state.mountFound,
      canvasMountCreated: state.mountCreated,
      canvasMountSelector: state.mountSelector,
      canvasMountRectNonzero: state.mountRectNonzero,
      canvasMountComputedVisible: state.mountComputedVisible,

      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasMovedIntoMount: state.canvasMovedIntoMount,
      canvasInMount: state.canvasInMount,
      canvasSelector: state.canvasSelector,
      canvasSelectionMode: state.canvasSelectionMode,
      canonicalCanvasId: state.canonicalCanvasId,
      canonicalMountId: state.canonicalMountId,
      nonCanonicalCanvasCount: state.nonCanonicalCanvasCount,
      temporaryCanvasIgnoredCount: state.temporaryCanvasIgnoredCount,

      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasSurfaceReady: state.canvasSurfaceReady,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,

      zeroRectRepairAttempted: state.zeroRectRepairAttempted,
      zeroRectRepairApplied: state.zeroRectRepairApplied,
      zeroRectRepairReason: state.zeroRectRepairReason,
      concreteFallbackSizeApplied: state.concreteFallbackSizeApplied,
      concreteFallbackCssSize: state.concreteFallbackCssSize,

      canvasAcceptanceScanRequested: state.canvasAcceptanceScanRequested,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      routePresentationPacketAccepted: state.routePresentationPacketAccepted,
      routePresentationPacketAcceptedAt: state.routePresentationPacketAcceptedAt,
      routePresentationPacketSourceContract: state.routePresentationPacketSourceContract,
      routePresentationPacketType: state.routePresentationPacketType,

      controlPacketAccepted: state.controlPacketAccepted,
      controlPacketAcceptedAt: state.controlPacketAcceptedAt,
      controlPacketCount: state.controlPacketCount,

      viewState: {
        yaw: state.viewYaw,
        pitch: state.viewPitch,
        zoom: state.viewZoom,
        phase: 0
      },

      renderCount: state.renderCount,
      packetCount: state.packetCount,
      acceptanceCount: state.acceptanceCount,
      rejectionCount: state.rejectionCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      resizeCount: state.resizeCount,
      booted: state.booted,
      disposed: state.disposed,
      latestEvent: state.latestEvent,
      errorCount: state.errors.length,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      supportsRoutePresentationPlatterPacket: true,
      supportsBilateralRouteCanvasScan: true,
      supportsCanvasAcceptanceScanReturn: true,
      supportsCanvasDomSurfaceCreation: true,
      supportsCanonicalVisibleCanvasSelection: true,
      supportsTemporaryCanvasDisambiguation: true,
      supportsZeroRectRepair: true,
      supportsVisible2dOutput: true,
      supportsControlsViewPackets: true,
      supportsPixelSampleSurfaceProof: true,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    observeNeighborAuthorities();
    ensureCanvasSurface("receipt-light");
    if (!state.canvasPixelVisible) drawPlanetSurface("receipt-light");
    scanCanvasSurface({ repairIfZero: true });

    const receipt = composeReceipt();
    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function getReceipt() {
    observeNeighborAuthorities();
    ensureCanvasSurface("receipt");
    if (!state.canvasPixelVisible) drawPlanetSurface("receipt");
    scanCanvasSurface({ repairIfZero: true });

    const receipt = {
      ...composeReceipt(),
      lastRoutePacket: clonePlain(state.lastRoutePacket),
      lastControlPacket: clonePlain(state.lastControlPacket),
      lastAcceptancePacket: clonePlain(state.lastAcceptancePacket),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };

    state.lastReceipt = clonePlain(receipt);
    return receipt;
  }

  function composeReceiptText(receipt = getReceiptLight()) {
    const r = isObject(receipt) ? receipt : getReceiptLight();

    return [
      "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("renewalContract", RENEWAL_CONTRACT),
      line("renewalReceipt", RENEWAL_RECEIPT),
      line("internalRenewalContract", INTERNAL_RENEWAL_CONTRACT),
      line("internalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT),
      line("previousRenewalContract", PREVIOUS_RENEWAL_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "ROLE",
      line("canvasPresentationPlatterAuthority", true),
      line("domSurfaceCreationAuthority", true),
      line("canvasAcceptanceScanAuthority", true),
      line("zeroRectCanonicalSurfaceBindingRepairActive", true),
      line("canonicalCanvasSelectionActive", true),
      line("temporaryCanvasDisambiguationActive", true),
      "",
      "CANONICAL_SURFACE",
      line("canvasSelectionMode", r.canvasSelectionMode),
      line("canonicalCanvasId", r.canonicalCanvasId),
      line("canonicalMountId", r.canonicalMountId),
      line("nonCanonicalCanvasCount", r.nonCanonicalCanvasCount),
      line("temporaryCanvasIgnoredCount", r.temporaryCanvasIgnoredCount),
      "",
      "SURFACE",
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountRectNonzero", r.canvasMountRectNonzero),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasSurfaceReady", r.canvasSurfaceReady),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      "",
      "ZERO_RECT_REPAIR",
      line("zeroRectRepairAttempted", r.zeroRectRepairAttempted),
      line("zeroRectRepairApplied", r.zeroRectRepairApplied),
      line("zeroRectRepairReason", r.zeroRectRepairReason),
      line("concreteFallbackSizeApplied", r.concreteFallbackSizeApplied),
      line("concreteFallbackCssSize", r.concreteFallbackCssSize),
      "",
      "BILATERAL_ACCEPTANCE",
      line("canvasAcceptanceScanRequested", r.canvasAcceptanceScanRequested),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("routePresentationPacketAccepted", r.routePresentationPacketAccepted),
      "",
      "NEIGHBORS",
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("controlObserved", r.controlObserved),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("pointerFingerObserved", r.pointerFingerObserved),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight());
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("internalRenewalContract", r.internalRenewalContract),
      line("canvasSelectionMode", r.canvasSelectionMode),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasSurfaceReady", r.canvasSurfaceReady),
      line("canvasAcceptanceScanConfirmed", r.canvasAcceptanceScanConfirmed),
      line("bilateralRouteCanvasScanConfirmed", r.bilateralRouteCanvasScanConfirmed),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("zeroRectRepairApplied", r.zeroRectRepairApplied),
      line("temporaryCanvasIgnoredCount", r.temporaryCanvasIgnoredCount),
      line("routePresentationPacketAccepted", r.routePresentationPacketAccepted),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      canvasElement: canvasElement ? describeElement(canvasElement) : "NONE",
      mountElement: mountElement ? describeElement(mountElement) : "NONE"
    };
  }

  function getCanvasSurfaceReceipt() {
    return getReceiptLight();
  }

  function getCanvasSurfaceSummary() {
    return getReceiptLight();
  }

  function getPresentationReceipt() {
    return getReceiptLight();
  }

  function getPresentationPlatterReceipt() {
    return getReceiptLight();
  }

  function getCanvasStationReceiptLight() {
    return getReceiptLight();
  }

  function getCanvasStationReceipt() {
    return getReceipt();
  }

  function getCanvasStationSummary() {
    return getReceiptLight();
  }

  function getExpressionHubReceipt() {
    return getReceiptLight();
  }

  function getVisiblePlanetReceipt() {
    return getReceiptLight();
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasCurrentParentContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasParentContract", RENEWAL_CONTRACT);
    setDataset("hearthCanvasParentReceipt", RENEWAL_RECEIPT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasPresentationPlatterAuthority", "true");
    setDataset("hearthCanvasLiveSurfaceIdentityActive", "true");
    setDataset("hearthCanvasUnifiedVisible2dOutputActive", "true");
    setDataset("hearthCanvasZeroRectCanonicalSurfaceBindingRepairActive", "true");
    setDataset("hearthCanvasCanonicalCanvasSelectionActive", "true");
    setDataset("hearthCanvasTemporaryCanvasDisambiguationActive", "true");
    setDataset("hearthCanvasDomSurfaceCreationAuthority", "true");
    setDataset("hearthCanvasAcceptanceScanAuthority", "true");
    setDataset("hearthCanvasBilateralRouteCanvasAcceptanceActive", "true");

    setDataset("hearthCanvasSelectionMode", state.canvasSelectionMode);
    setDataset("hearthCanvasCanonicalCanvasId", state.canonicalCanvasId);
    setDataset("hearthCanvasCanonicalMountId", state.canonicalMountId);
    setDataset("hearthCanvasNonCanonicalCanvasCount", String(state.nonCanonicalCanvasCount));
    setDataset("hearthCanvasTemporaryCanvasIgnoredCount", String(state.temporaryCanvasIgnoredCount));

    setDataset("hearthCanvasMountFound", String(state.mountFound));
    setDataset("hearthCanvasMountCreated", String(state.mountCreated));
    setDataset("hearthCanvasMountSelector", state.mountSelector);
    setDataset("hearthCanvasMountRectNonzero", String(state.mountRectNonzero));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasMovedIntoMount", String(state.canvasMovedIntoMount));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasSurfaceReady", String(state.canvasSurfaceReady));
    setDataset("hearthVisibleSurfacePermissionGranted", String(state.visibleSurfacePermissionGranted));

    setDataset("hearthCanvasZeroRectRepairAttempted", String(state.zeroRectRepairAttempted));
    setDataset("hearthCanvasZeroRectRepairApplied", String(state.zeroRectRepairApplied));
    setDataset("hearthCanvasZeroRectRepairReason", state.zeroRectRepairReason);
    setDataset("hearthCanvasConcreteFallbackSizeApplied", String(state.concreteFallbackSizeApplied));
    setDataset("hearthCanvasConcreteFallbackCssSize", state.concreteFallbackCssSize);

    setDataset("hearthCanvasAcceptanceScanRequested", String(state.canvasAcceptanceScanRequested));
    setDataset("hearthCanvasAcceptanceScanConfirmed", String(state.canvasAcceptanceScanConfirmed));
    setDataset("hearthBilateralRouteCanvasScanConfirmed", String(state.bilateralRouteCanvasScanConfirmed));
    setDataset("hearthRoutePresentationPacketAccepted", String(state.routePresentationPacketAccepted));

    setDataset("hearthCanvasRenderCount", String(state.renderCount));
    setDataset("hearthCanvasPacketCount", String(state.packetCount));
    setDataset("hearthCanvasControlPacketCount", String(state.controlPacketCount));

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasOwnsDomSurface", "true");
    setDataset("hearthCanvasOwnsCanvasDrawing", "true");
    setDataset("hearthCanvasDoesNotOwnSourceTruth", "true");
    setDataset("hearthCanvasDoesNotOwnRouteAuthority", "true");
    setDataset("hearthCanvasDoesNotOwnControlsAuthority", "true");
    setDataset("hearthCanvasDoesNotOwnHexTruth", "true");
    setDataset("hearthCanvasDoesNotOwnPointerFingerTruth", "true");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("hearthCanvasFinalVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const paths = [
      "HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR",
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
      "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
      "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH.canvasHubZeroRectCanonicalSurfaceBindingRepair",
      "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHubRafSphereRotationPairReceiver",
      "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
      "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
      "HEARTH.canvasPlanetaryViewControlReceiver",
      "HEARTH.canvasHub",
      "HEARTH.canvas",
      "HEARTH.canvasParent",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasHubZeroRectCanonicalSurfaceBindingRepair",
      "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasAuthority",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasVisiblePlanet"
    ];

    for (const path of paths) setPath(path, api);

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = composeReceipt();

    state.receiptPublishCount += 1;
    state.lastReceipt = clonePlain(receipt);

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_REPORT = receipt;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasHubZeroRectCanonicalSurfaceBindingRepairReceipt = receipt;
    hearth.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasReport = receipt;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasHubZeroRectCanonicalSurfaceBindingRepairReceipt = receipt;
    lab.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    lab.hearthCanvasReport = receipt;

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

    record("CANVAS_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      canvasSurfaceReady: state.canvasSurfaceReady,
      canvasRectNonzero: state.canvasRectNonzero,
      visualPassClaimed: false
    });

    return true;
  }

  function refresh() {
    observeNeighborAuthorities();
    ensureCanvasSurface("refresh");
    drawPlanetSurface("refresh");
    updateDataset();
    publishReceiptAliases();
    return getReceiptLight();
  }

  function mount() {
    return refresh();
  }

  function render() {
    ensureCanvasSurface("render");
    drawPlanetSurface("render");
    updateDataset();
    publishReceiptAliases();
    return getReceiptLight();
  }

  function drawFrame() {
    return render();
  }

  function drawVisibleExpression() {
    return render();
  }

  function start() {
    return boot();
  }

  function init() {
    return boot();
  }

  function run() {
    return boot();
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "CANVAS_BOOTING_ZERO_RECT_CANONICAL_SURFACE_BINDING_REPAIR";

      publishApiAliases();
      observeNeighborAuthorities();
      ensureCanvasSurface("boot");
      drawPlanetSurface("boot");

      state.booted = true;
      state.booting = false;
      state.updatedAt = nowIso();

      state.firstFailedCoordinate = state.canvasSurfaceReady
        ? "NONE_CANVAS_BOOTED_CANONICAL_DOM_SURFACE_READY"
        : state.firstFailedCoordinate;
      state.recommendedNextFile = state.canvasSurfaceReady ? ROUTE_CONDUCTOR_FILE : FILE;
      state.recommendedNextAction = state.canvasSurfaceReady
        ? "DELIVER_ROUTE_PRESENTATION_PLATTER_PACKET_OR_RUN_CANVAS_SURFACE_TRUTH_PROBE"
        : state.recommendedNextAction;
      state.postgameStatus = state.canvasSurfaceReady
        ? "CANVAS_BOOTED_CANONICAL_VISIBLE_2D_SURFACE_READY_WAITING_ROUTE_PACKET"
        : state.postgameStatus;

      publishGlobals("boot-complete");

      if (root.addEventListener) {
        root.addEventListener("resize", () => {
          if (resizeRaf && root.cancelAnimationFrame) root.cancelAnimationFrame(resizeRaf);

          const callback = () => {
            resizeRaf = 0;
            render();
          };

          resizeRaf = root.requestAnimationFrame
            ? root.requestAnimationFrame(callback)
            : root.setTimeout(callback, 33);
        }, { passive: true });
      }

      return getReceipt();
    }).catch((error) => {
      state.booting = false;
      recordError("CANVAS_BOOT_FAILED", error);
      updateDataset();
      publishReceiptAliases();
      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "CANVAS_DISPOSED";
    record("CANVAS_DISPOSED", { reason });
    updateDataset();
    publishReceiptAliases();
    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    canvasContract: CONTRACT,
    canvasReceipt: RECEIPT,
    currentCanvasParentContract: RENEWAL_CONTRACT,
    currentCanvasParentReceipt: RENEWAL_RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalMountId: CANONICAL_MOUNT_ID,
    canvasSelectionMode: "CANONICAL_SURFACE_ONLY",

    canvasPresentationPlatterAuthority: true,
    liveSurfaceIdentityActive: true,
    unifiedVisible2dOutputActive: true,
    zeroRectCanonicalSurfaceBindingRepairActive: true,
    canonicalCanvasSelectionActive: true,
    temporaryCanvasDisambiguationActive: true,
    domSurfaceCreationAuthority: true,
    canvasAcceptanceScanAuthority: true,
    bilateralRouteCanvasAcceptanceActive: true,
    routeConductorPacketReceiverActive: true,
    controlsViewPacketReceiverActive: true,

    boot,
    start,
    init,
    run,
    refresh,
    mount,
    render,
    drawFrame,
    drawVisibleExpression,
    dispose,

    ensureCanvasSurface,
    scanCanvasSurface,
    drawPlanetSurface,

    receiveRoutePresentationPlatterPacket,
    consumeRoutePresentationPlatterPacket,
    receivePresentationPlatterPacket,
    consumePresentationPlatterPacket,
    receiveBilateralRouteCanvasPacket,
    consumeBilateralRouteCanvasPacket,
    receiveRouteConductorPresentationPacket,
    consumeRouteConductorPresentationPacket,
    receiveRouteConductorPacket,
    consumeRouteConductorPacket,
    receiveGovernedPresentationPacket,
    consumeGovernedPresentationPacket,
    receiveGovernedSourcePacket,
    consumeGovernedSourcePacket,
    receiveCanvasHandoffPacket,
    consumeCanvasHandoffPacket,
    receiveHandoffPacket,
    consumeHandoffPacket,
    receiveRoutePacket,
    consumeRoutePacket,

    receiveHexGateViewControlPacket,
    consumeHexGateViewControlPacket,
    receiveControlsHexGatePacket,
    consumeControlsHexGatePacket,
    receiveQueenHexGateViewPacket,
    consumeQueenHexGateViewPacket,
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
    receiveControlViewPacket,
    receiveControlsPacket,
    receivePlanetaryControlPacket,
    receiveViewDelta,
    applyViewDelta,
    setView,
    updateView,

    composeAcceptancePacket,
    getReceipt,
    getReceiptLight,
    getCanvasSurfaceReceipt,
    getCanvasSurfaceSummary,
    getPresentationReceipt,
    getPresentationPlatterReceipt,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getCanvasStationSummary,
    getExpressionHubReceipt,
    getVisiblePlanetReceipt,
    getReceiptText,
    getStatusText,
    getState,

    publishApiAliases,
    publishGlobals,
    publishReceiptAliases,
    updateDataset,

    supportsRoutePresentationPlatterPacket: true,
    supportsBilateralRouteCanvasScan: true,
    supportsCanvasAcceptanceScanReturn: true,
    supportsCanvasDomSurfaceCreation: true,
    supportsCanonicalVisibleCanvasSelection: true,
    supportsTemporaryCanvasDisambiguation: true,
    supportsZeroRectRepair: true,
    supportsVisible2dOutput: true,
    supportsControlsViewPackets: true,
    supportsPixelSampleSurfaceProof: true,

    ownsCanvasDomSurface: true,
    ownsCanvasDrawing: true,
    ownsPresentationSurface: true,
    ownsSourceTruth: false,
    ownsRouteAuthority: false,
    ownsControlsAuthority: false,
    ownsHexTruth: false,
    ownsPointerFingerTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get receiptObject() {
      return getReceiptLight();
    },

    get report() {
      return getReceipt();
    }
  });

  try {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases();

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
    recordError("CANVAS_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
