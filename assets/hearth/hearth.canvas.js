// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_TNT_v12_6
// Full-file replacement.
// Canvas Hub / DOM canvas surface / functional fallback / Hex + Finger expression convergence only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by Route, Controls, Hex, and diagnostics.
// - Create or bind a real DOM <canvas> surface inside #hearthCanvasMount.
// - Draw a first fast functional fallback planet as a visible mount/surface threshold.
// - Keep the fallback active only until enough downstream expression data is available.
// - Consume governed source packets through public APIs only.
// - Send lawful Canvas Hex Gate packets to /assets/hearth/hearth.hex.surface.js through public APIs.
// - Read renderable expression samples from /assets/hearth/hearth.canvas.finger.surface.js through public APIs.
// - Remove/deactivate the simple fallback once expression convergence threshold is met.
// - Publish an internalized preface/launch handshake without requiring /assets/hearth/hearth.canvas.launch.js.
// - Preserve Canvas as receiver/output carrier only.
// Does not own:
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - source truth
// - Hex authority truth
// - Pointer Finger truth
// - route conductor
// - controls
// - diagnostic rail
// - North F21
// - ready text
// - final visual pass
// - generated image
// - GraphicBox
// - WebGL

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
    "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_TNT_v12_6";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_RECEIPT_v12_6";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_5";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_v12_5";

  const LINEAGE_V12_4_CONTRACT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4";
  const LINEAGE_V12_3_2_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";
  const LINEAGE_V12_3_1_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1";

  const VERSION =
    "2026-06-07.hearth-canvas-hub-functional-fallback-hex-finger-expression-convergence-v12-6";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const FINGER_MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const INTERNALIZED_LAUNCH_FILE = "INTERNALIZED_IN_CANVAS_HUB_NO_SEPARATE_LAUNCH_FILE";

  const CANVAS_ID = "hearthCanvas";
  const STYLE_ID = "hearthCanvasHubFunctionalConvergenceStyle";

  const FALLBACK_MIN_VISIBLE_PIXEL_COUNT = 8;
  const EXPRESSION_MIN_SAMPLE_COUNT = 42;
  const EXPRESSION_MIN_LAND_SAMPLES = 6;
  const EXPRESSION_MIN_WATER_SAMPLES = 6;
  const EXPRESSION_MAX_NEW_SAMPLES_PER_PASS = 54;

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-expression-stage]"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    `#${CANVAS_ID}`,
    "#hearthCanvasMount canvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_PAIR_RENDERER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexPairRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission"
  ]);

  const FINGER_SURFACE_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_BISHOP",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "HEARTH.canvasFingerSurfacePointer",
    "HEARTH.canvasPointerBishop",
    "HEARTH.canvasSurfacePointerBishop",
    "HEARTH.canvasFingerSurfacePointerBishop",
    "HEARTH.surfaceExpressionAuthority",
    "HEARTH.hexSurfaceExpressionAuthority",
    "HEARTH.canvasFingerSurfaceHexExpressionSocket",
    "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
    "HEARTH.canvasFingerSurfacePointerBishopHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasPointerFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface",
    "DEXTER_LAB.hearthCanvasPointerBishop",
    "DEXTER_LAB.hearthCanvasSurfacePointerBishop",
    "DEXTER_LAB.hearthSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthHexSurfaceExpressionAuthority"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
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
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV124Contract: LINEAGE_V12_4_CONTRACT,
    lineageV1232Contract: LINEAGE_V12_3_2_CONTRACT,
    lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    fingerSurfaceFile: FINGER_SURFACE_FILE,
    fingerBoundaryFile: FINGER_BOUNDARY_FILE,
    fingerMassFile: FINGER_MASS_FILE,
    fingerLightFile: FINGER_LIGHT_FILE,
    fingerInspectFile: FINGER_INSPECT_FILE,
    internalizedLaunchFile: INTERNALIZED_LAUNCH_FILE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    started: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",

    canvasCreated: false,
    canvasBound: false,
    canvasElementFound: false,
    canvasId: CANVAS_ID,
    canvasSelector: "NONE",
    canvasInMount: false,
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasMountDescriptor: "NONE",
    canvasWidthAttribute: 0,
    canvasHeightAttribute: 0,
    canvasInternalSizeNonzero: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasContext2DReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasPixelVisible: false,
    canvasVisiblePixelCount: 0,
    canvasAlphaPixelCount: 0,

    functionalFallbackThresholdActive: true,
    functionalFallbackThresholdMet: false,
    functionalFallbackDrawn: false,
    functionalFallbackActive: true,
    functionalFallbackReason: "WAITING_CANVAS_SURFACE",
    functionalFallbackRemoved: false,

    hexGateThresholdActive: true,
    hexGateThresholdMet: false,
    hexSurfaceObserved: false,
    hexSurfaceSourcePath: "NONE",
    hexSurfacePublicReceiver: "NONE",
    hexGateDeliveryAttempted: false,
    hexGateDeliveryAccepted: false,
    hexGateDeliveryStatus: "WAITING_CANVAS_HEX_GATE_PACKET",
    hexGateDeliveryReason: "WAITING_CANVAS_SURFACE",

    fingerExpressionThresholdActive: true,
    fingerExpressionThresholdMet: false,
    fingerSurfaceObserved: false,
    fingerSurfaceSourcePath: "NONE",
    fingerSurfaceSampleMethod: "NONE",
    fingerSurfaceSampleCount: 0,
    fingerSurfaceLandSampleCount: 0,
    fingerSurfaceWaterSampleCount: 0,
    fingerSurfaceRejectedSampleCount: 0,
    fingerSurfaceExpressionStatus: "WAITING_FINGER_SURFACE",
    directFingerBridgeThresholdMet: false,

    expressionConvergenceThresholdMet: false,
    expressionConvergenceStatus: "WAITING_FUNCTIONAL_SURFACE",
    expressionConvergenceReason: "WAITING_CANVAS_SURFACE",
    expressionRenderMode: "FUNCTIONAL_FALLBACK",
    expressionSurfaceDrawn: false,

    governedSourcePacketObserved: false,
    governedSourcePacketAccepted: false,
    governedSourcePacketStatus: "NOT_OBSERVED",
    governedSourcePacketSource: "NONE",
    governedSourcePacketReceivedAt: "",
    sourceHoldActive: true,
    sourceHoldReason: "WAITING_GOVERNED_SOURCE_PACKET_OR_FUNCTIONAL_FALLBACK",

    controlHandshakeObserved: false,
    controlHandshakeAccepted: false,
    controlHandshakeStatus: "NOT_OBSERVED",
    viewControlObserved: false,

    internalizedLaunchGateActive: true,
    separateLaunchFileRequired: false,
    launchCompanionAdmissionSuppressed: true,
    launchHandshakePublished: false,
    prefaceHoldRequired: true,
    prefaceDecommissionAuthorized: false,
    prefaceDecommissionStatus: "WAITING_FUNCTIONAL_FALLBACK_THRESHOLD",

    yaw: -0.42,
    pitch: 0.08,
    scale: 1,
    rotationEnabled: false,

    renderCount: 0,
    drawCount: 0,
    receiptPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    latestEvent: "CANVAS_HUB_FUNCTIONAL_CONVERGENCE_LOADED",
    lastError: "NONE",
    firstFailedCoordinate: "CANVAS_ELEMENT_FOUND",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_AND_BIND_REAL_DOM_CANVAS_SURFACE",
    postgameStatus: "LOADED",

    currentPacket: null,
    currentGovernedSourcePacket: null,
    currentControlHandshakePacket: null,
    currentHexGatePacket: null,
    currentPrefacePacket: null,
    expressionSamples: [],
    expressionSampleLedger: [],
    events: [],
    errors: [],

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  };

  let canvasElement = null;
  let mountElement = null;
  let ctx2d = null;
  let bootPromise = null;
  let renderTimer = 0;
  let resizeTimer = 0;
  let rafId = 0;

  const sampleCache = new Map();

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function firstDefined() {
    for (let i = 0; i < arguments.length; i += 1) {
      const value = arguments[i];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_HUB_EVENT"),
      detail: clonePlain(detail || {})
    };

    state.events.push(item);
    trim(state.events, 180);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_HUB_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail || {})
    };

    state.errors.push(item);
    trim(state.errors, 100);
    state.errorCount = state.errors.length;
    state.lastError = item.message || item.code;
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

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
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
      if (value && (isObject(value) || isFunction(value))) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function q(selector, base) {
    const scope = base || doc;
    if (!scope || !isFunction(scope.querySelector)) return null;

    try {
      return scope.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector, base) {
    const scope = base || doc;
    if (!scope || !isFunction(scope.querySelectorAll)) return [];

    try {
      return Array.from(scope.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function firstElement(selectors, base) {
    for (const selector of selectors || []) {
      const element = q(selector, base || doc);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function elementDescriptor(element) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "unknown").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes = element.classList && element.classList.length
        ? `.${Array.from(element.classList).slice(0, 4).join(".")}`
        : "";
    } catch (_error) {}

    return `${tag}${id}${classes}` || "UNKNOWN_ELEMENT";
  }

  function containsOrEquals(parent, child) {
    if (!parent || !child) return false;
    if (parent === child) return true;

    try {
      return Boolean(parent.contains(child));
    } catch (_error) {
      return false;
    }
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0),
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0)
      };
    } catch (_error) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
  }

  function rectNonzero(rect) {
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.dataset.hearthCanvasHubFunctionalConvergenceStyle = "true";
    style.textContent = `
      #${CANVAS_ID} {
        display: block;
        width: clamp(260px, 62vmin, 640px);
        height: clamp(260px, 62vmin, 640px);
        max-width: 100%;
        max-height: 72vh;
        margin: 0 auto;
        border-radius: 50%;
        position: relative;
        z-index: 1;
        pointer-events: auto;
        opacity: 1;
        visibility: visible;
        background: transparent;
        touch-action: none;
      }
      [data-hearth-canvas-mount],
      #hearthCanvasMount {
        position: relative;
        display: grid;
        place-items: center;
        min-height: clamp(280px, 68vmin, 680px);
      }
    `;

    const head = doc.head || doc.documentElement || doc.body;
    if (head && isFunction(head.appendChild)) head.appendChild(style);
  }

  function findMount() {
    if (!doc) return null;

    const found = firstElement(MOUNT_SELECTORS, doc);
    mountElement = found.element;

    state.canvasMountFound = Boolean(found.element);
    state.canvasMountSelector = found.selector;
    state.canvasMountDescriptor = elementDescriptor(found.element);

    return found.element;
  }

  function findExistingCanvas() {
    if (!doc) return null;

    const found = firstElement(CANVAS_SELECTORS, doc);
    if (found.element) {
      canvasElement = found.element;
      state.canvasSelector = found.selector;
      state.canvasElementFound = true;
      return found.element;
    }

    state.canvasSelector = "NONE";
    state.canvasElementFound = false;
    return null;
  }

  function prepareMount(mount) {
    if (!mount) return;

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(mount) : null;
      if (style && style.position === "static" && mount.style) mount.style.position = "relative";
    } catch (_error) {
      if (mount.style && !mount.style.position) mount.style.position = "relative";
    }

    if (mount.dataset) {
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasHubMountPrepared = "true";
      mount.dataset.hearthCanvasContract = CONTRACT;
      mount.dataset.hearthCanvasReceipt = RECEIPT;
      mount.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    }

    if (mount.style && !mount.style.minHeight) {
      mount.style.minHeight = "clamp(280px, 68vmin, 680px)";
    }
  }

  function stampCanvas(canvas) {
    if (!canvas) return;

    canvas.id = canvas.id || CANVAS_ID;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth visible planet canvas surface");

    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthBaseGlobeCanvas = "true";
    canvas.dataset.hearthPlanetCanvas = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasCurrentParentContract = CONTRACT;
    canvas.dataset.hearthCanvasCurrentParentReceipt = RECEIPT;
    canvas.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    canvas.dataset.hearthCanvasInternalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    canvas.dataset.hearthCanvasOwnsSourceTruth = "false";
    canvas.dataset.hearthCanvasOwnsTerrainTruth = "false";
    canvas.dataset.hearthCanvasOwnsHydrologyTruth = "false";
    canvas.dataset.hearthCanvasOwnsElevationTruth = "false";
    canvas.dataset.hearthCanvasOwnsMaterialTruth = "false";
    canvas.dataset.hearthCanvasOwnsVisualPass = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    if (canvas.style) {
      canvas.style.display = "block";
      canvas.style.width = "clamp(260px, 62vmin, 640px)";
      canvas.style.height = "clamp(260px, 62vmin, 640px)";
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "72vh";
      canvas.style.margin = "0 auto";
      canvas.style.borderRadius = "50%";
      canvas.style.position = "relative";
      canvas.style.zIndex = "1";
      canvas.style.opacity = "1";
      canvas.style.visibility = "visible";
      canvas.style.pointerEvents = "auto";
      canvas.style.touchAction = "none";
      canvas.style.background = "transparent";
    }
  }

  function ensureCanvasSurface(reason) {
    if (!doc) {
      state.firstFailedCoordinate = "DOCUMENT_UNAVAILABLE";
      state.recommendedNextOwner = "ROUTE_DOCUMENT";
      state.recommendedNextFile = TARGET_ROUTE;
      state.recommendedNextAction = "LOAD_CANVAS_ON_BROWSER_DOCUMENT";
      state.postgameStatus = "HELD_DOCUMENT_UNAVAILABLE";
      return null;
    }

    ensureStyle();

    const mount = findMount();
    if (!mount) {
      state.firstFailedCoordinate = "CANVAS_MOUNT_FOUND";
      state.recommendedNextOwner = "HTML_SHELL_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = "/showroom/globe/hearth/index.html";
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS";
      state.postgameStatus = "HELD_CANVAS_MOUNT_NOT_FOUND";
      return null;
    }

    prepareMount(mount);

    let canvas = findExistingCanvas();

    if (!canvas) {
      try {
        canvas = doc.createElement("canvas");
        canvas.id = CANVAS_ID;
        canvas.dataset.hearthCanvasCreatedBy = CONTRACT;
        canvas.dataset.hearthCanvasCreationReason = safeString(reason, "ensureCanvasSurface");
        mount.appendChild(canvas);

        state.canvasCreated = true;
        state.canvasBound = true;

        record("HEARTH_CANVAS_HUB_DOM_CANVAS_CREATED", {
          reason,
          mountSelector: state.canvasMountSelector
        });
      } catch (error) {
        recordError("HEARTH_CANVAS_HUB_DOM_CANVAS_CREATE_FAILED", error, { reason });
        state.firstFailedCoordinate = "CANVAS_ELEMENT_FOUND";
        state.recommendedNextOwner = "CANVAS_HUB";
        state.recommendedNextFile = FILE;
        state.recommendedNextAction = "ALLOW_CANVAS_FILE_TO_CREATE_DOM_CANVAS_SURFACE";
        return null;
      }
    } else {
      state.canvasBound = true;
      record("HEARTH_CANVAS_HUB_DOM_CANVAS_BOUND", {
        reason,
        selector: state.canvasSelector
      });
    }

    canvasElement = canvas;
    stampCanvas(canvas);

    state.canvasElementFound = true;
    state.canvasSelector = canvas.id === CANVAS_ID ? `#${CANVAS_ID}` : state.canvasSelector;
    state.canvasInMount = Boolean(mount && canvas && containsOrEquals(mount, canvas));
    state.mounted = true;

    updateCanvasSize("ensure-canvas-surface");
    updateSurfaceProof("ensure-canvas-surface");
    return canvas;
  }

  function updateCanvasSize(reason) {
    const canvas = canvasElement || findExistingCanvas();
    if (!canvas) return false;

    const rect = getRect(canvas);
    const dpr = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    let cssSize = Math.max(rect.width, rect.height);

    if (!cssSize || cssSize < 16) cssSize = 512;

    const target = Math.max(256, Math.min(1280, Math.round(cssSize * dpr)));

    if (safeNumber(canvas.width, 0) !== target) canvas.width = target;
    if (safeNumber(canvas.height, 0) !== target) canvas.height = target;

    state.canvasWidthAttribute = safeNumber(canvas.width, 0);
    state.canvasHeightAttribute = safeNumber(canvas.height, 0);
    state.canvasInternalSizeNonzero = Boolean(canvas.width > 0 && canvas.height > 0);

    try {
      ctx2d = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      state.canvasContext2DReady = Boolean(ctx2d);
    } catch (error) {
      ctx2d = null;
      state.canvasContext2DReady = false;
      recordError("HEARTH_CANVAS_HUB_CONTEXT_2D_FAILED", error, { reason });
    }

    return Boolean(ctx2d);
  }

  function samplePixels() {
    const canvas = canvasElement;
    const ctx = ctx2d;

    if (!canvas || !ctx || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        visiblePixelCount: 0,
        alphaPixelCount: 0
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        visiblePixelCount: 0,
        alphaPixelCount: 0
      };
    }

    try {
      const size = Math.max(4, Math.min(20, Math.floor(Math.min(width, height) / 32)));
      const points = [
        [0.50, 0.50],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.50, 0.25],
        [0.50, 0.75]
      ];

      let visiblePixelCount = 0;
      let alphaPixelCount = 0;

      for (const point of points) {
        const x = Math.max(0, Math.min(width - size, Math.floor(width * point[0] - size / 2)));
        const y = Math.max(0, Math.min(height - size, Math.floor(height * point[1] - size / 2)));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] || 0;
          const g = data[i + 1] || 0;
          const b = data[i + 2] || 0;
          const a = data[i + 3] || 0;

          if (a > 0) alphaPixelCount += 1;
          if (a > 0 && (r > 4 || g > 4 || b > 4)) visiblePixelCount += 1;
        }
      }

      return {
        status: visiblePixelCount > 0
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY"
            : "PIXEL_SAMPLE_BLANK",
        visible: visiblePixelCount > 0,
        visiblePixelCount,
        alphaPixelCount
      };
    } catch (error) {
      return {
        status: `PIXEL_SAMPLE_UNREADABLE:${safeString(error && error.message ? error.message : error).slice(0, 160)}`,
        visible: false,
        visiblePixelCount: 0,
        alphaPixelCount: 0
      };
    }
  }

  function updateSurfaceProof(reason) {
    const canvas = canvasElement || findExistingCanvas();
    const mount = mountElement || findMount();

    state.canvasElementFound = Boolean(canvas);
    state.canvasMountFound = Boolean(mount);
    state.canvasInMount = Boolean(canvas && mount && containsOrEquals(mount, canvas));

    if (!canvas) {
      state.canvasRectNonzero = false;
      state.canvasComputedVisible = false;
      state.canvasViewportIntersecting = false;
      state.canvasContext2DReady = false;
      state.canvasPixelSampleStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelVisible = false;
      resolveFunctionalFallbackThreshold(reason);
      return false;
    }

    const rect = getRect(canvas);
    state.canvasRectNonzero = rectNonzero(rect);
    state.canvasWidthAttribute = safeNumber(canvas.width, 0);
    state.canvasHeightAttribute = safeNumber(canvas.height, 0);
    state.canvasInternalSizeNonzero = Boolean(canvas.width > 0 && canvas.height > 0);

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
      state.canvasComputedVisible = Boolean(
        style &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.visibility !== "collapse" &&
        safeNumber(style.opacity, 1) > 0
      );
    } catch (_error) {
      state.canvasComputedVisible = state.canvasRectNonzero;
    }

    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);
    state.canvasViewportIntersecting = Boolean(
      state.canvasRectNonzero &&
      viewportWidth > 0 &&
      viewportHeight > 0 &&
      rect.right > 0 &&
      rect.bottom > 0 &&
      rect.left < viewportWidth &&
      rect.top < viewportHeight
    );

    if (!ctx2d && canvas && isFunction(canvas.getContext)) {
      try {
        ctx2d = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      } catch (_error) {
        ctx2d = null;
      }
    }

    state.canvasContext2DReady = Boolean(ctx2d);

    const pixels = samplePixels();
    state.canvasPixelSampleStatus = pixels.status;
    state.canvasPixelVisible = pixels.visible;
    state.canvasVisiblePixelCount = pixels.visiblePixelCount;
    state.canvasAlphaPixelCount = pixels.alphaPixelCount;

    if (canvas.dataset) {
      canvas.dataset.hearthCanvasFunctionalFallbackThresholdMet = String(state.functionalFallbackThresholdMet);
      canvas.dataset.hearthCanvasPixelVisible = String(state.canvasPixelVisible);
      canvas.dataset.hearthCanvasPixelSampleStatus = state.canvasPixelSampleStatus;
      canvas.dataset.hearthCanvasExpressionRenderMode = state.expressionRenderMode;
    }

    resolveFunctionalFallbackThreshold(reason);
    return state.functionalFallbackThresholdMet;
  }

  function resolveFunctionalFallbackThreshold(reason) {
    const checks = [
      ["CANVAS_MOUNT_FOUND", state.canvasMountFound === true],
      ["CANVAS_ELEMENT_FOUND", state.canvasElementFound === true],
      ["CANVAS_IN_MOUNT", state.canvasInMount === true],
      ["CANVAS_WIDTH_ATTRIBUTE", safeNumber(state.canvasWidthAttribute, 0) > 0],
      ["CANVAS_HEIGHT_ATTRIBUTE", safeNumber(state.canvasHeightAttribute, 0) > 0],
      ["CANVAS_RECT_NONZERO", state.canvasRectNonzero === true],
      ["CANVAS_COMPUTED_VISIBLE", state.canvasComputedVisible === true],
      ["CANVAS_VIEWPORT_INTERSECTING", state.canvasViewportIntersecting === true],
      ["CANVAS_CONTEXT_2D_READY", state.canvasContext2DReady === true],
      ["CANVAS_PIXEL_VISIBLE", state.canvasPixelVisible === true],
      ["CANVAS_VISIBLE_PIXEL_COUNT", safeNumber(state.canvasVisiblePixelCount, 0) >= FALLBACK_MIN_VISIBLE_PIXEL_COUNT]
    ];

    const failed = checks.find((entry) => !entry[1]) || null;

    state.functionalFallbackThresholdMet = !failed;
    state.functionalFallbackReason = failed ? `FUNCTIONAL_FALLBACK_HELD_AT_${failed[0]}` : "FUNCTIONAL_FALLBACK_THRESHOLD_MET";

    if (!state.functionalFallbackThresholdMet) {
      state.firstFailedCoordinate = failed ? failed[0] : "CANVAS_FUNCTIONAL_FALLBACK_THRESHOLD";
      state.recommendedNextOwner = "CANVAS_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = `REPAIR_CANVAS_FUNCTIONAL_SURFACE_COORDINATE:${state.firstFailedCoordinate}`;
      state.postgameStatus = "CANVAS_FUNCTIONAL_FALLBACK_THRESHOLD_HELD";
    }

    record("HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_THRESHOLD_RESOLVED", {
      reason,
      thresholdMet: state.functionalFallbackThresholdMet,
      firstFailedCoordinate: failed ? failed[0] : "NONE"
    });

    return state.functionalFallbackThresholdMet;
  }

  function drawJaggedLand(ctx, cx, cy, radius, seed, offsetX, offsetY, scaleX, scaleY) {
    const points = 22;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const rough =
        0.74 +
        0.16 * Math.sin(t * 3 + seed) +
        0.09 * Math.sin(t * 7 + seed * 0.7) +
        0.05 * Math.cos(t * 11 - seed);

      const x = cx + radius * offsetX + Math.cos(t) * radius * scaleX * rough;
      const y = cy + radius * offsetY + Math.sin(t) * radius * scaleY * rough;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawFunctionalFallback(reason) {
    const canvas = ensureCanvasSurface(reason || "draw-functional-fallback");
    if (!canvas || !ctx2d) {
      updateSurfaceProof("draw-functional-fallback-failed");
      return false;
    }

    updateCanvasSize("draw-functional-fallback");

    const ctx = ctx2d;
    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);
    const size = Math.min(width, height);

    if (size <= 0) {
      updateSurfaceProof("draw-functional-fallback-zero-size");
      return false;
    }

    state.drawCount += 1;
    state.functionalFallbackDrawn = true;

    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.43;
    const yaw = state.yaw + state.drawCount * 0.0015;

    ctx.clearRect(0, 0, width, height);

    const space = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.8);
    space.addColorStop(0, "rgba(16, 30, 58, 0.54)");
    space.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.32,
      radius * 0.08,
      cx,
      cy,
      radius * 1.08
    );
    ocean.addColorStop(0, "rgb(80, 148, 190)");
    ocean.addColorStop(0.48, "rgb(18, 72, 122)");
    ocean.addColorStop(1, "rgb(4, 20, 54)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.strokeStyle = "rgba(195, 226, 239, 0.22)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    for (let i = -3; i <= 3; i += 1) {
      const y = cy + i * radius * 0.24 + Math.sin(yaw + i) * radius * 0.018;
      ctx.beginPath();
      ctx.ellipse(cx, y, radius * 1.04, radius * 0.11, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(107, 105, 67, 0.96)";
    ctx.strokeStyle = "rgba(228, 190, 104, 0.58)";
    ctx.lineWidth = Math.max(1, size * 0.003);

    drawJaggedLand(ctx, cx + Math.sin(yaw) * radius * 0.07, cy, radius, 1.1, -0.34, -0.22, 0.34, 0.27);
    drawJaggedLand(ctx, cx + Math.sin(yaw + 1.9) * radius * 0.05, cy, radius, 2.4, 0.25, -0.10, 0.29, 0.22);
    drawJaggedLand(ctx, cx + Math.sin(yaw + 3.1) * radius * 0.06, cy, radius, 4.0, -0.08, 0.28, 0.42, 0.24);
    drawJaggedLand(ctx, cx + Math.sin(yaw + 4.2) * radius * 0.04, cy, radius, 5.3, 0.42, 0.26, 0.18, 0.16);
    drawJaggedLand(ctx, cx + Math.sin(yaw + 5.6) * radius * 0.05, cy, radius, 6.8, -0.50, 0.22, 0.16, 0.13);

    ctx.fillStyle = "rgba(176, 139, 78, 0.72)";
    ctx.strokeStyle = "rgba(239, 205, 132, 0.42)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    drawJaggedLand(ctx, cx, cy, radius, 8.1, 0.02, -0.54, 0.24, 0.10);
    drawJaggedLand(ctx, cx, cy, radius, 9.4, -0.06, 0.55, 0.31, 0.09);

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255, 238, 190, 0.18)");
    shade.addColorStop(0.47, "rgba(255, 255, 255, 0)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.44)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(150, 218, 255, 0.34)";
    ctx.lineWidth = Math.max(2, size * 0.006);
    ctx.stroke();

    updateSurfaceProof("draw-functional-fallback-complete");
    return true;
  }

  function normalizeColor(expression) {
    if (!expression || !isObject(expression)) return [96, 122, 88, 255];

    const color = expression.rgba || expression.rgb || expression.color;
    if (Array.isArray(color) && color.length >= 3) {
      return [
        clamp(Math.round(safeNumber(color[0], 96)), 0, 255),
        clamp(Math.round(safeNumber(color[1], 122)), 0, 255),
        clamp(Math.round(safeNumber(color[2], 88)), 0, 255),
        clamp(Math.round(safeNumber(color[3], 255)), 0, 255)
      ];
    }

    if (expression.isWater || safeNumber(expression.waterPresence, 0) > safeNumber(expression.landPresence, 0)) {
      return [12, 76, 130, 255];
    }

    return [104, 118, 78, 255];
  }

  function colorString(color, alphaOverride) {
    const a = alphaOverride === undefined ? safeNumber(color[3], 255) / 255 : alphaOverride;
    return `rgba(${clamp(color[0], 0, 255)}, ${clamp(color[1], 0, 255)}, ${clamp(color[2], 0, 255)}, ${clamp(a, 0, 1)})`;
  }

  function buildSamplePlan() {
    const plan = [];
    const rings = [
      { r: 0.00, n: 1 },
      { r: 0.23, n: 8 },
      { r: 0.42, n: 12 },
      { r: 0.60, n: 16 },
      { r: 0.76, n: 20 },
      { r: 0.90, n: 24 }
    ];

    let index = 0;

    for (const ring of rings) {
      for (let i = 0; i < ring.n; i += 1) {
        const t = ring.n === 1 ? 0 : (i / ring.n) * Math.PI * 2 + ring.r * 0.8;
        const sx = ring.r * Math.cos(t);
        const sy = ring.r * Math.sin(t);
        const z = Math.sqrt(Math.max(0.0001, 1 - sx * sx - sy * sy));
        const lon = ((((Math.atan2(sx, z) + state.yaw) * 180 / Math.PI + 180) % 360) + 360) % 360 - 180;
        const lat = clamp((Math.asin(clamp(-sy + state.pitch * 0.18, -1, 1)) * 180 / Math.PI), -88, 88);
        const u = ((lon + 180) / 360 + 1) % 1;
        const v = clamp01((90 - lat) / 180);

        plan.push({
          index,
          sx,
          sy,
          lon,
          lat,
          u,
          v,
          cellId: `CANVAS_CONVERGENCE_SAMPLE_${index}`,
          stateId: index
        });

        index += 1;
      }
    }

    return plan;
  }

  function findHexSurfaceApi() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const authority = found.value;

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "drawInteractiveFrame",
      "drawPairFrame"
    ];

    const method = authority
      ? (methods.find((candidate) => isFunction(authority[candidate])) || "NONE")
      : "NONE";

    state.hexSurfaceObserved = Boolean(authority);
    state.hexSurfaceSourcePath = found.path;
    state.hexSurfacePublicReceiver = method;
    state.hexGateThresholdMet = Boolean(authority && method !== "NONE");

    return {
      path: found.path,
      authority,
      method,
      observed: Boolean(authority),
      thresholdMet: state.hexGateThresholdMet
    };
  }

  function findFingerSurfaceApi() {
    const found = firstGlobal(FINGER_SURFACE_ALIASES);
    const authority = found.value;

    const methods = [
      "sampleHexSurfaceExpression",
      "sampleSurfaceExpression",
      "getRenderableSurfaceExpression",
      "getSurfaceExpressionAt",
      "receiveHexSurfaceExpressionRequest",
      "sample"
    ];

    const method = authority
      ? (methods.find((candidate) => isFunction(authority[candidate])) || "NONE")
      : "NONE";

    state.fingerSurfaceObserved = Boolean(authority);
    state.fingerSurfaceSourcePath = found.path;
    state.fingerSurfaceSampleMethod = method;
    state.directFingerBridgeThresholdMet = Boolean(authority && method !== "NONE");

    return {
      path: found.path,
      authority,
      method,
      observed: Boolean(authority),
      thresholdMet: state.directFingerBridgeThresholdMet
    };
  }

  function composeCanvasHexGatePacket(reason) {
    return {
      packetType: "HEARTH_CANVAS_HUB_TO_HEX_SURFACE_GATE_PACKET_v12_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-functional-fallback-hex-finger-expression-convergence",
      targetFile: HEX_SURFACE_FILE,
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEX_SURFACE_GATE",

      canvasContract: CONTRACT,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      targetRoute: TARGET_ROUTE,
      reason: reason || "canvas-hex-gate",

      canvasElementFound: state.canvasElementFound,
      canvasMountFound: state.canvasMountFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,

      functionalFallbackThresholdMet: state.functionalFallbackThresholdMet,
      functionalFallbackActive: state.functionalFallbackActive,
      expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,

      hexSurfaceGateAuthorized: true,
      canvasHexGateAuthorized: true,
      pointerFingerTransmissionAuthorized: true,
      viewState: {
        yaw: state.yaw,
        pitch: state.pitch,
        zoom: state.scale,
        phase: state.renderCount
      },
      yaw: state.yaw,
      pitch: state.pitch,
      zoom: state.scale,
      phase: state.renderCount,

      canvasOwnsSourceTruth: false,
      canvasOwnsTerrainTruth: false,
      canvasOwnsHydrologyTruth: false,
      canvasOwnsElevationTruth: false,
      canvasOwnsMaterialTruth: false,
      canvasOwnsPointerFingerTruth: false,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function deliverCanvasHexGate(reason) {
    const hex = findHexSurfaceApi();
    const packet = composeCanvasHexGatePacket(reason);

    state.currentHexGatePacket = clonePlain(packet);
    state.hexGateDeliveryAttempted = true;

    if (!hex.authority || hex.method === "NONE") {
      state.hexGateDeliveryAccepted = false;
      state.hexGateDeliveryStatus = "HEX_SURFACE_PUBLIC_RECEIVER_NOT_OBSERVED";
      state.hexGateDeliveryReason = hex.observed
        ? "HEX_SURFACE_OBSERVED_WITHOUT_PUBLIC_CANVAS_GATE_RECEIVER"
        : "HEX_SURFACE_AUTHORITY_NOT_OBSERVED";
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        status: state.hexGateDeliveryStatus,
        reason: state.hexGateDeliveryReason
      };
    }

    try {
      const result = hex.authority[hex.method](clonePlain(packet), {
        source: "HEARTH_CANVAS_HUB",
        sourceFile: FILE,
        reason
      });

      const accepted = Boolean(
        result === true ||
        (isObject(result) && (
          safeBool(result.accepted, false) ||
          safeBool(result.hexSurfaceGateActive, false) ||
          safeBool(result.pointerFingerTransmissionActive, false) ||
          safeBool(result.pointerFingerTransmissionAuthorized, false) ||
          /ACCEPTED|DELIVERED|ACTIVE|READY/i.test(safeString(result.postgameStatus || result.status || ""))
        ))
      );

      state.hexGateDeliveryAccepted = accepted;
      state.hexGateDeliveryStatus = accepted
        ? "HEX_SURFACE_GATE_PACKET_ACCEPTED_OR_ACTIVE"
        : "HEX_SURFACE_GATE_PACKET_DELIVERED_WAITING_ACCEPTANCE";
      state.hexGateDeliveryReason = accepted
        ? "HEX_SURFACE_PUBLIC_API_ACCEPTED_OR_REPORTED_ACTIVE"
        : "HEX_SURFACE_PUBLIC_API_RETURNED_WITHOUT_ACCEPTANCE_FLAG";
      state.hexGateThresholdMet = true;

      record("HEARTH_CANVAS_HUB_HEX_GATE_PACKET_DELIVERED", {
        method: hex.method,
        accepted,
        status: state.hexGateDeliveryStatus
      });

      return {
        delivered: true,
        accepted,
        method: hex.method,
        status: state.hexGateDeliveryStatus,
        reason: state.hexGateDeliveryReason,
        resultObserved: isObject(result)
      };
    } catch (error) {
      state.hexGateDeliveryAccepted = false;
      state.hexGateDeliveryStatus = "HEX_SURFACE_GATE_DELIVERY_THROWN";
      state.hexGateDeliveryReason = error && error.message ? String(error.message) : String(error);

      recordError("HEARTH_CANVAS_HUB_HEX_GATE_PACKET_DELIVERY_FAILED", error, {
        method: hex.method
      });

      return {
        delivered: false,
        accepted: false,
        method: hex.method,
        status: state.hexGateDeliveryStatus,
        reason: state.hexGateDeliveryReason
      };
    }
  }

  function collectExpressionSamples(reason) {
    const finger = findFingerSurfaceApi();

    if (!finger.authority || finger.method === "NONE") {
      state.fingerExpressionThresholdMet = false;
      state.fingerSurfaceExpressionStatus = finger.observed
        ? "FINGER_SURFACE_OBSERVED_NO_SAMPLE_METHOD"
        : "FINGER_SURFACE_NOT_OBSERVED";
      return [];
    }

    const plan = buildSamplePlan();
    const samples = [];
    let newSamples = 0;

    for (const point of plan) {
      const key = `${point.index}:${point.u.toFixed(3)}:${point.v.toFixed(3)}:${state.yaw.toFixed(2)}:${state.pitch.toFixed(2)}`;

      if (sampleCache.has(key)) {
        samples.push(sampleCache.get(key));
        continue;
      }

      if (newSamples >= EXPRESSION_MAX_NEW_SAMPLES_PER_PASS) continue;

      try {
        const request = {
          packetType: "HEARTH_CANVAS_HUB_FINGER_SURFACE_EXPRESSION_SAMPLE_REQUEST_v12_6",
          sourceFile: FILE,
          sourceAuthority: "HEARTH_CANVAS_HUB",
          consumerFile: FILE,
          targetFile: FINGER_SURFACE_FILE,
          cellId: point.cellId,
          hexId: point.cellId,
          stateId: point.stateId,
          u: point.u,
          v: point.v,
          lon: point.lon,
          lat: point.lat,
          coord: {
            u: point.u,
            v: point.v,
            lon: point.lon,
            lat: point.lat
          },
          projectionPoint: {
            sx: point.sx,
            sy: point.sy
          },
          reason: reason || "collect-expression-samples",
          ...NO_CLAIMS,
          ...UPPER_NO_CLAIMS
        };

        const response = finger.authority[finger.method](clonePlain(request), {
          source: "HEARTH_CANVAS_HUB",
          sourceFile: FILE,
          reason
        });

        const accepted = isObject(response) && response.ok !== false && response.rejected !== true;
        const sample = {
          key,
          accepted,
          rejected: !accepted,
          method: finger.method,
          sourcePath: finger.path,
          point,
          expression: accepted ? clonePlain(response) : null,
          sampledAt: nowIso()
        };

        sampleCache.set(key, sample);
        samples.push(sample);
        newSamples += 1;
      } catch (error) {
        const sample = {
          key,
          accepted: false,
          rejected: true,
          method: finger.method,
          sourcePath: finger.path,
          point,
          expression: null,
          error: error && error.message ? String(error.message) : String(error),
          sampledAt: nowIso()
        };

        sampleCache.set(key, sample);
        samples.push(sample);
        newSamples += 1;
        recordError("HEARTH_CANVAS_HUB_FINGER_SURFACE_SAMPLE_FAILED", error, {
          method: finger.method,
          cellId: point.cellId
        });
      }
    }

    if (sampleCache.size > 240) {
      const keys = Array.from(sampleCache.keys());
      while (sampleCache.size > 180 && keys.length) sampleCache.delete(keys.shift());
    }

    state.expressionSamples = clonePlain(samples);

    const acceptedSamples = samples.filter((sample) => sample.accepted && sample.expression);
    const landSamples = acceptedSamples.filter((sample) => {
      const expression = sample.expression || {};
      return expression.isLand === true || safeNumber(expression.landPresence, 0) >= safeNumber(expression.waterPresence, 0);
    });
    const waterSamples = acceptedSamples.filter((sample) => {
      const expression = sample.expression || {};
      return expression.isWater === true || safeNumber(expression.waterPresence, 0) > safeNumber(expression.landPresence, 0);
    });
    const rejectedSamples = samples.filter((sample) => sample.rejected);

    state.fingerSurfaceSampleCount = acceptedSamples.length;
    state.fingerSurfaceLandSampleCount = landSamples.length;
    state.fingerSurfaceWaterSampleCount = waterSamples.length;
    state.fingerSurfaceRejectedSampleCount = rejectedSamples.length;

    state.fingerExpressionThresholdMet = Boolean(
      acceptedSamples.length >= EXPRESSION_MIN_SAMPLE_COUNT &&
      landSamples.length >= EXPRESSION_MIN_LAND_SAMPLES &&
      waterSamples.length >= EXPRESSION_MIN_WATER_SAMPLES
    );

    state.fingerSurfaceExpressionStatus = state.fingerExpressionThresholdMet
      ? "FINGER_SURFACE_EXPRESSION_THRESHOLD_MET"
      : "FINGER_SURFACE_EXPRESSION_THRESHOLD_PARTIAL";

    state.expressionSampleLedger.push({
      at: nowIso(),
      reason: reason || "collect-expression-samples",
      sampleCount: state.fingerSurfaceSampleCount,
      landSampleCount: state.fingerSurfaceLandSampleCount,
      waterSampleCount: state.fingerSurfaceWaterSampleCount,
      rejectedSampleCount: state.fingerSurfaceRejectedSampleCount,
      thresholdMet: state.fingerExpressionThresholdMet,
      method: finger.method,
      sourcePath: finger.path
    });
    trim(state.expressionSampleLedger, 80);

    return acceptedSamples;
  }

  function resolveExpressionConvergence(reason) {
    findHexSurfaceApi();
    findFingerSurfaceApi();

    state.expressionConvergenceThresholdMet = Boolean(
      state.functionalFallbackThresholdMet &&
      state.fingerExpressionThresholdMet &&
      (state.hexGateThresholdMet || state.directFingerBridgeThresholdMet)
    );

    if (state.expressionConvergenceThresholdMet) {
      state.expressionConvergenceStatus = "EXPRESSION_CONVERGENCE_THRESHOLD_MET";
      state.expressionConvergenceReason = state.hexGateThresholdMet
        ? "FUNCTIONAL_CANVAS_PLUS_HEX_GATE_PLUS_FINGER_SURFACE_SAMPLES"
        : "FUNCTIONAL_CANVAS_PLUS_DIRECT_FINGER_SURFACE_SAMPLES";
      state.functionalFallbackActive = false;
      state.functionalFallbackRemoved = true;
      state.prefaceHoldRequired = false;
      state.prefaceDecommissionAuthorized = true;
      state.prefaceDecommissionStatus = "AUTHORIZED_BY_EXPRESSION_CONVERGENCE_THRESHOLD";
      state.expressionRenderMode = "FINGER_SURFACE_EXPRESSION";
      state.firstFailedCoordinate = "NONE_EXPRESSION_CONVERGENCE_THRESHOLD_MET";
      state.recommendedNextOwner = "DIAGNOSTIC_RAIL";
      state.recommendedNextFile = DIAGNOSTIC_ROUTE;
      state.recommendedNextAction = "RERUN_DIAGNOSTIC_TO_CONFIRM_CANVAS_DOM_SURFACE_AND_EXPRESSION_CONVERGENCE";
      state.postgameStatus = "CANVAS_EXPRESSION_CONVERGENCE_RENDERED_NO_FINAL_VISUAL_PASS_CLAIM";
    } else if (!state.functionalFallbackThresholdMet) {
      state.expressionConvergenceStatus = "WAITING_FUNCTIONAL_FALLBACK_THRESHOLD";
      state.expressionConvergenceReason = state.functionalFallbackReason;
      state.functionalFallbackActive = true;
      state.prefaceHoldRequired = true;
      state.prefaceDecommissionAuthorized = false;
      state.prefaceDecommissionStatus = "HELD_FUNCTIONAL_FALLBACK_THRESHOLD_NOT_MET";
    } else if (!state.fingerExpressionThresholdMet) {
      state.expressionConvergenceStatus = "WAITING_FINGER_SURFACE_EXPRESSION_THRESHOLD";
      state.expressionConvergenceReason = state.fingerSurfaceExpressionStatus;
      state.functionalFallbackActive = true;
      state.prefaceHoldRequired = true;
      state.prefaceDecommissionAuthorized = false;
      state.prefaceDecommissionStatus = "HELD_WAITING_FINGER_SURFACE_EXPRESSION";
      state.firstFailedCoordinate = "FINGER_SURFACE_EXPRESSION_THRESHOLD";
      state.recommendedNextOwner = "FINGER_SURFACE";
      state.recommendedNextFile = FINGER_SURFACE_FILE;
      state.recommendedNextAction = "VERIFY_FINGER_SURFACE_PUBLIC_SAMPLE_API_AND_RENDERABLE_EXPRESSION_OUTPUT";
      state.postgameStatus = "FUNCTIONAL_CANVAS_VISIBLE_WAITING_FINGER_SURFACE_EXPRESSION_THRESHOLD";
    } else if (!state.hexGateThresholdMet && !state.directFingerBridgeThresholdMet) {
      state.expressionConvergenceStatus = "WAITING_HEX_OR_DIRECT_FINGER_BRIDGE_THRESHOLD";
      state.expressionConvergenceReason = "NO_HEX_GATE_OR_DIRECT_FINGER_SAMPLE_BRIDGE";
      state.functionalFallbackActive = true;
      state.prefaceHoldRequired = true;
      state.prefaceDecommissionAuthorized = false;
      state.prefaceDecommissionStatus = "HELD_WAITING_BRIDGE_THRESHOLD";
      state.firstFailedCoordinate = "HEX_OR_DIRECT_FINGER_BRIDGE_THRESHOLD";
      state.recommendedNextOwner = "HEX_SURFACE_OR_FINGER_SURFACE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "VERIFY_HEX_SURFACE_PUBLIC_RECEIVER_OR_FINGER_SURFACE_SAMPLE_BRIDGE";
      state.postgameStatus = "FUNCTIONAL_CANVAS_VISIBLE_WAITING_BRIDGE_THRESHOLD";
    }

    record("HEARTH_CANVAS_HUB_EXPRESSION_CONVERGENCE_RESOLVED", {
      reason,
      expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,
      expressionConvergenceStatus: state.expressionConvergenceStatus,
      hexGateThresholdMet: state.hexGateThresholdMet,
      directFingerBridgeThresholdMet: state.directFingerBridgeThresholdMet,
      fingerExpressionThresholdMet: state.fingerExpressionThresholdMet
    });

    return state.expressionConvergenceThresholdMet;
  }

  function drawExpressionSurface(reason) {
    const canvas = ensureCanvasSurface(reason || "draw-expression-surface");
    if (!canvas || !ctx2d) {
      updateSurfaceProof("draw-expression-surface-failed");
      return false;
    }

    updateCanvasSize("draw-expression-surface");

    const samples = collectExpressionSamples(reason || "draw-expression-surface");
    resolveExpressionConvergence(reason || "draw-expression-surface");

    if (!state.expressionConvergenceThresholdMet) {
      return drawFunctionalFallback(reason || "draw-expression-surface-fallback-held");
    }

    const ctx = ctx2d;
    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.43;

    state.drawCount += 1;
    state.expressionSurfaceDrawn = true;

    ctx.clearRect(0, 0, width, height);

    const space = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.9);
    space.addColorStop(0, "rgba(18, 31, 60, 0.50)");
    space.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.32,
      radius * 0.10,
      cx,
      cy,
      radius * 1.08
    );
    ocean.addColorStop(0, "rgb(72, 142, 184)");
    ocean.addColorStop(0.46, "rgb(13, 70, 126)");
    ocean.addColorStop(1, "rgb(4, 18, 50)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const sortedSamples = samples.slice().sort((a, b) => {
      const ay = a.point && a.point.sy !== undefined ? a.point.sy : 0;
      const by = b.point && b.point.sy !== undefined ? b.point.sy : 0;
      return ay - by;
    });

    for (const sample of sortedSamples) {
      const expression = sample.expression || {};
      const point = sample.point || {};
      const sx = safeNumber(point.sx, 0);
      const sy = safeNumber(point.sy, 0);
      const color = normalizeColor(expression);
      const isLand = expression.isLand === true || safeNumber(expression.landPresence, 0) >= safeNumber(expression.waterPresence, 0);
      const x = cx + sx * radius;
      const y = cy + sy * radius;
      const patchW = radius * (isLand ? 0.17 : 0.13) * (1 - Math.abs(sx) * 0.22);
      const patchH = radius * (isLand ? 0.08 : 0.045) * (1 - Math.abs(sy) * 0.18);
      const angle = (safeNumber(point.lon, 0) / 180) * 0.42 + state.yaw * 0.22;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(2, patchW), Math.max(2, patchH), 0, 0, Math.PI * 2);
      ctx.fillStyle = colorString(color, isLand ? 0.88 : 0.42);
      ctx.fill();

      if (isLand) {
        ctx.strokeStyle = "rgba(226, 196, 116, 0.28)";
        ctx.lineWidth = Math.max(1, size * 0.0018);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgb(202, 234, 247)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    for (let i = -3; i <= 3; i += 1) {
      const y = cy + i * radius * 0.23;
      ctx.beginPath();
      ctx.ellipse(cx, y, radius * 1.05, radius * 0.10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255, 240, 196, 0.17)");
    shade.addColorStop(0.50, "rgba(255, 255, 255, 0)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.46)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(150, 218, 255, 0.34)";
    ctx.lineWidth = Math.max(2, size * 0.006);
    ctx.stroke();

    updateSurfaceProof("draw-expression-surface-complete");
    publishCanvasPackets("draw-expression-surface");
    return true;
  }

  function receiveGovernedSourcePacket(packet, options) {
    state.currentGovernedSourcePacket = clonePlain(packet || {});
    state.governedSourcePacketObserved = true;
    state.governedSourcePacketAccepted = true;
    state.governedSourcePacketStatus = "GOVERNED_SOURCE_PACKET_ACCEPTED_BY_CANVAS_PUBLIC_API";
    state.governedSourcePacketSource = options && options.source ? options.source : "PUBLIC_API";
    state.governedSourcePacketReceivedAt = nowIso();
    state.sourceHoldActive = false;
    state.sourceHoldReason = "NONE_GOVERNED_SOURCE_PACKET_ACCEPTED";

    record("HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_ACCEPTED", {
      source: state.governedSourcePacketSource
    });

    deliverCanvasHexGate("governed-source-packet");
    requestRender("governed-source-packet");
    publishCanvasPackets("governed-source-packet");

    return {
      accepted: true,
      status: state.governedSourcePacketStatus,
      contract: CONTRACT,
      receipt: RECEIPT,
      functionalFallbackThresholdMet: state.functionalFallbackThresholdMet,
      expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receiveControlHandshake(packet, options) {
    state.currentControlHandshakePacket = clonePlain(packet || {});
    state.controlHandshakeObserved = true;
    state.controlHandshakeAccepted = true;
    state.controlHandshakeStatus = "CONTROL_HANDSHAKE_ACCEPTED_NON_BLOCKING";
    state.viewControlObserved = true;

    record("HEARTH_CANVAS_HUB_CONTROL_HANDSHAKE_ACCEPTED", {
      source: options && options.source ? options.source : "PUBLIC_API"
    });

    deliverCanvasHexGate("control-handshake");
    publishCanvasPackets("control-handshake");

    return {
      accepted: true,
      status: state.controlHandshakeStatus,
      contract: CONTRACT,
      receipt: RECEIPT,
      visiblePlanetAllowedWithoutControls: true,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receiveViewControlPacket(packet, options) {
    const p = isObject(packet) ? packet : {};
    state.viewControlObserved = true;

    const yaw = safeNumber(firstDefined(p.yaw, p.longitude, p.rotationY, p.viewState && p.viewState.yaw), state.yaw);
    const pitch = safeNumber(firstDefined(p.pitch, p.latitude, p.rotationX, p.viewState && p.viewState.pitch), state.pitch);
    const scale = safeNumber(firstDefined(p.scale, p.zoom, p.viewState && p.viewState.zoom), state.scale);

    state.yaw = Number.isFinite(yaw) ? yaw : state.yaw;
    state.pitch = Number.isFinite(pitch) ? clamp(pitch, -0.9, 0.9) : state.pitch;
    state.scale = Number.isFinite(scale) ? clamp(scale, 0.55, 2.2) : state.scale;

    record("HEARTH_CANVAS_HUB_VIEW_CONTROL_PACKET_RECEIVED", {
      source: options && options.source ? options.source : "PUBLIC_API",
      yaw: state.yaw,
      pitch: state.pitch,
      scale: state.scale
    });

    deliverCanvasHexGate("view-control-packet");
    requestRender("view-control-packet");

    return {
      accepted: true,
      status: "VIEW_CONTROL_PACKET_ACCEPTED",
      contract: CONTRACT,
      receipt: RECEIPT,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composePrefacePacket(reason) {
    return {
      packetType: "HEARTH_CANVAS_INTERNALIZED_PREFACE_HANDSHAKE_PACKET_v12_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-internalized-preface-gate",
      targetFile: INTERNALIZED_LAUNCH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reason: reason || "compose-preface-packet",

      internalizedLaunchGateActive: true,
      separateLaunchFileRequired: false,
      launchCompanionAdmissionSuppressed: true,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceDecommissionStatus: state.prefaceDecommissionStatus,

      functionalFallbackThresholdMet: state.functionalFallbackThresholdMet,
      functionalFallbackActive: state.functionalFallbackActive,
      functionalFallbackRemoved: state.functionalFallbackRemoved,
      hexGateThresholdMet: state.hexGateThresholdMet,
      fingerExpressionThresholdMet: state.fingerExpressionThresholdMet,
      directFingerBridgeThresholdMet: state.directFingerBridgeThresholdMet,
      expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,
      expressionConvergenceStatus: state.expressionConvergenceStatus,
      expressionRenderMode: state.expressionRenderMode,

      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasId: CANVAS_ID,
      canvasMountFound: state.canvasMountFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,

      canvasOwnsSourceTruth: false,
      canvasOwnsTerrainTruth: false,
      canvasOwnsHydrologyTruth: false,
      canvasOwnsElevationTruth: false,
      canvasOwnsMaterialTruth: false,
      canvasOwnsPointerFingerTruth: false,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptLight() {
    updateSurfaceProof("compose-receipt-light");
    findHexSurfaceApi();
    findFingerSurfaceApi();
    resolveExpressionConvergence("compose-receipt-light");

    return {
      packetType: "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_RECEIPT_PACKET_v12_6",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV124Contract: LINEAGE_V12_4_CONTRACT,
      lineageV1232Contract: LINEAGE_V12_3_2_CONTRACT,
      lineageV1231Contract: LINEAGE_V12_3_1_CONTRACT,
      version: VERSION,

      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      fingerSurfaceFile: FINGER_SURFACE_FILE,
      fingerBoundaryFile: FINGER_BOUNDARY_FILE,
      fingerMassFile: FINGER_MASS_FILE,
      fingerLightFile: FINGER_LIGHT_FILE,
      fingerInspectFile: FINGER_INSPECT_FILE,
      internalizedLaunchFile: INTERNALIZED_LAUNCH_FILE,

      loaded: state.loaded,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      canvasCreated: state.canvasCreated,
      canvasBound: state.canvasBound,
      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasId: CANVAS_ID,
      canvasInMount: state.canvasInMount,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMountDescriptor: state.canvasMountDescriptor,
      canvasWidthAttribute: state.canvasWidthAttribute,
      canvasHeightAttribute: state.canvasHeightAttribute,
      canvasInternalSizeNonzero: state.canvasInternalSizeNonzero,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,

      functionalFallbackThresholdActive: state.functionalFallbackThresholdActive,
      functionalFallbackThresholdMet: state.functionalFallbackThresholdMet,
      functionalFallbackDrawn: state.functionalFallbackDrawn,
      functionalFallbackActive: state.functionalFallbackActive,
      functionalFallbackReason: state.functionalFallbackReason,
      functionalFallbackRemoved: state.functionalFallbackRemoved,

      hexGateThresholdActive: state.hexGateThresholdActive,
      hexGateThresholdMet: state.hexGateThresholdMet,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSourcePath: state.hexSurfaceSourcePath,
      hexSurfacePublicReceiver: state.hexSurfacePublicReceiver,
      hexGateDeliveryAttempted: state.hexGateDeliveryAttempted,
      hexGateDeliveryAccepted: state.hexGateDeliveryAccepted,
      hexGateDeliveryStatus: state.hexGateDeliveryStatus,
      hexGateDeliveryReason: state.hexGateDeliveryReason,

      fingerExpressionThresholdActive: state.fingerExpressionThresholdActive,
      fingerExpressionThresholdMet: state.fingerExpressionThresholdMet,
      fingerSurfaceObserved: state.fingerSurfaceObserved,
      fingerSurfaceSourcePath: state.fingerSurfaceSourcePath,
      fingerSurfaceSampleMethod: state.fingerSurfaceSampleMethod,
      fingerSurfaceSampleCount: state.fingerSurfaceSampleCount,
      fingerSurfaceLandSampleCount: state.fingerSurfaceLandSampleCount,
      fingerSurfaceWaterSampleCount: state.fingerSurfaceWaterSampleCount,
      fingerSurfaceRejectedSampleCount: state.fingerSurfaceRejectedSampleCount,
      fingerSurfaceExpressionStatus: state.fingerSurfaceExpressionStatus,
      directFingerBridgeThresholdMet: state.directFingerBridgeThresholdMet,

      expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,
      expressionConvergenceStatus: state.expressionConvergenceStatus,
      expressionConvergenceReason: state.expressionConvergenceReason,
      expressionRenderMode: state.expressionRenderMode,
      expressionSurfaceDrawn: state.expressionSurfaceDrawn,

      governedSourcePacketObserved: state.governedSourcePacketObserved,
      governedSourcePacketAccepted: state.governedSourcePacketAccepted,
      governedSourcePacketStatus: state.governedSourcePacketStatus,
      governedSourcePacketSource: state.governedSourcePacketSource,
      governedSourcePacketReceivedAt: state.governedSourcePacketReceivedAt,
      sourceHoldActive: state.sourceHoldActive,
      sourceHoldReason: state.sourceHoldReason,

      controlHandshakeObserved: state.controlHandshakeObserved,
      controlHandshakeAccepted: state.controlHandshakeAccepted,
      controlHandshakeStatus: state.controlHandshakeStatus,
      viewControlObserved: state.viewControlObserved,

      internalizedLaunchGateActive: true,
      separateLaunchFileRequired: false,
      launchCompanionAdmissionSuppressed: true,
      launchHandshakePublished: state.launchHandshakePublished,
      prefaceHoldRequired: state.prefaceHoldRequired,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceDecommissionStatus: state.prefaceDecommissionStatus,

      drawCount: state.drawCount,
      renderCount: state.renderCount,
      receiptPublishCount: state.receiptPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsCanvasDrawing: true,
      ownsCanvasCreation: true,
      ownsFunctionalFallbackThreshold: true,
      ownsExpressionRenderSurface: true,
      ownsInternalizedPrefaceGate: true,
      ownsLaunchCompanionAdmission: false,

      ownsSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexAuthorityTruth: false,
      ownsPointerFingerTruth: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsDiagnosticRail: false,
      ownsNorthF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return composeReceiptLight();
  }

  function getReceipt() {
    const receipt = getReceiptLight();

    return {
      ...receipt,
      currentGovernedSourcePacket: clonePlain(state.currentGovernedSourcePacket),
      currentControlHandshakePacket: clonePlain(state.currentControlHandshakePacket),
      currentHexGatePacket: clonePlain(state.currentHexGatePacket),
      currentPrefacePacket: composePrefacePacket("get-receipt"),
      expressionSamples: clonePlain(state.expressionSamples),
      expressionSampleLedger: clonePlain(state.expressionSampleLedger),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice(),
      hexSurfaceAliases: HEX_SURFACE_ALIASES.slice(),
      fingerSurfaceAliases: FINGER_SURFACE_ALIASES.slice()
    };
  }

  function composeReceiptText(receipt) {
    const r = isObject(receipt) ? receipt : getReceiptLight();

    return [
      "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalRenewalContract", r.internalRenewalContract),
      line("internalRenewalReceipt", r.internalRenewalReceipt),
      line("previousContract", r.previousContract),
      line("version", r.version),
      line("file", r.file),
      line("targetRoute", r.targetRoute),
      "",
      "DOM_CANVAS_SURFACE",
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasWidthAttribute", r.canvasWidthAttribute),
      line("canvasHeightAttribute", r.canvasHeightAttribute),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasContext2DReady", r.canvasContext2DReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasVisiblePixelCount", r.canvasVisiblePixelCount),
      "",
      "FUNCTIONAL_FALLBACK_THRESHOLD",
      line("functionalFallbackThresholdMet", r.functionalFallbackThresholdMet),
      line("functionalFallbackDrawn", r.functionalFallbackDrawn),
      line("functionalFallbackActive", r.functionalFallbackActive),
      line("functionalFallbackReason", r.functionalFallbackReason),
      line("functionalFallbackRemoved", r.functionalFallbackRemoved),
      "",
      "HEX_GATE_THRESHOLD",
      line("hexGateThresholdMet", r.hexGateThresholdMet),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceSourcePath", r.hexSurfaceSourcePath),
      line("hexSurfacePublicReceiver", r.hexSurfacePublicReceiver),
      line("hexGateDeliveryAttempted", r.hexGateDeliveryAttempted),
      line("hexGateDeliveryAccepted", r.hexGateDeliveryAccepted),
      line("hexGateDeliveryStatus", r.hexGateDeliveryStatus),
      line("hexGateDeliveryReason", r.hexGateDeliveryReason),
      "",
      "FINGER_SURFACE_THRESHOLD",
      line("fingerExpressionThresholdMet", r.fingerExpressionThresholdMet),
      line("fingerSurfaceObserved", r.fingerSurfaceObserved),
      line("fingerSurfaceSourcePath", r.fingerSurfaceSourcePath),
      line("fingerSurfaceSampleMethod", r.fingerSurfaceSampleMethod),
      line("fingerSurfaceSampleCount", r.fingerSurfaceSampleCount),
      line("fingerSurfaceLandSampleCount", r.fingerSurfaceLandSampleCount),
      line("fingerSurfaceWaterSampleCount", r.fingerSurfaceWaterSampleCount),
      line("fingerSurfaceRejectedSampleCount", r.fingerSurfaceRejectedSampleCount),
      line("fingerSurfaceExpressionStatus", r.fingerSurfaceExpressionStatus),
      "",
      "EXPRESSION_CONVERGENCE",
      line("expressionConvergenceThresholdMet", r.expressionConvergenceThresholdMet),
      line("expressionConvergenceStatus", r.expressionConvergenceStatus),
      line("expressionConvergenceReason", r.expressionConvergenceReason),
      line("expressionRenderMode", r.expressionRenderMode),
      line("expressionSurfaceDrawn", r.expressionSurfaceDrawn),
      "",
      "GOVERNED_SOURCE",
      line("governedSourcePacketObserved", r.governedSourcePacketObserved),
      line("governedSourcePacketAccepted", r.governedSourcePacketAccepted),
      line("governedSourcePacketStatus", r.governedSourcePacketStatus),
      line("sourceHoldActive", r.sourceHoldActive),
      line("sourceHoldReason", r.sourceHoldReason),
      "",
      "INTERNALIZED_PREFACE_GATE",
      line("internalizedLaunchGateActive", r.internalizedLaunchGateActive),
      line("separateLaunchFileRequired", r.separateLaunchFileRequired),
      line("launchCompanionAdmissionSuppressed", r.launchCompanionAdmissionSuppressed),
      line("prefaceHoldRequired", r.prefaceHoldRequired),
      line("prefaceDecommissionAuthorized", r.prefaceDecommissionAuthorized),
      line("prefaceDecommissionStatus", r.prefaceDecommissionStatus),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
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
    return composeReceiptText(getReceiptLight());
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_STATUS",
      line("contract", r.contract),
      line("internalRenewalContract", r.internalRenewalContract),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("functionalFallbackThresholdMet", r.functionalFallbackThresholdMet),
      line("functionalFallbackActive", r.functionalFallbackActive),
      line("hexGateThresholdMet", r.hexGateThresholdMet),
      line("fingerExpressionThresholdMet", r.fingerExpressionThresholdMet),
      line("expressionConvergenceThresholdMet", r.expressionConvergenceThresholdMet),
      line("expressionRenderMode", r.expressionRenderMode),
      line("prefaceDecommissionAuthorized", r.prefaceDecommissionAuthorized),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasCurrentParentContract", CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasFile", FILE);

    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setDataset("hearthCanvasContext2DReady", String(state.canvasContext2DReady));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasVisiblePixelCount", String(state.canvasVisiblePixelCount));

    setDataset("hearthCanvasFunctionalFallbackThresholdMet", String(state.functionalFallbackThresholdMet));
    setDataset("hearthCanvasFunctionalFallbackActive", String(state.functionalFallbackActive));
    setDataset("hearthCanvasFunctionalFallbackRemoved", String(state.functionalFallbackRemoved));
    setDataset("hearthCanvasFunctionalFallbackReason", state.functionalFallbackReason);

    setDataset("hearthCanvasHexGateThresholdMet", String(state.hexGateThresholdMet));
    setDataset("hearthCanvasHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasHexSurfaceSourcePath", state.hexSurfaceSourcePath);
    setDataset("hearthCanvasHexSurfacePublicReceiver", state.hexSurfacePublicReceiver);
    setDataset("hearthCanvasHexGateDeliveryStatus", state.hexGateDeliveryStatus);

    setDataset("hearthCanvasFingerExpressionThresholdMet", String(state.fingerExpressionThresholdMet));
    setDataset("hearthCanvasFingerSurfaceObserved", String(state.fingerSurfaceObserved));
    setDataset("hearthCanvasFingerSurfaceSourcePath", state.fingerSurfaceSourcePath);
    setDataset("hearthCanvasFingerSurfaceSampleMethod", state.fingerSurfaceSampleMethod);
    setDataset("hearthCanvasFingerSurfaceSampleCount", String(state.fingerSurfaceSampleCount));
    setDataset("hearthCanvasFingerSurfaceLandSampleCount", String(state.fingerSurfaceLandSampleCount));
    setDataset("hearthCanvasFingerSurfaceWaterSampleCount", String(state.fingerSurfaceWaterSampleCount));
    setDataset("hearthCanvasFingerSurfaceExpressionStatus", state.fingerSurfaceExpressionStatus);

    setDataset("hearthCanvasExpressionConvergenceThresholdMet", String(state.expressionConvergenceThresholdMet));
    setDataset("hearthCanvasExpressionConvergenceStatus", state.expressionConvergenceStatus);
    setDataset("hearthCanvasExpressionConvergenceReason", state.expressionConvergenceReason);
    setDataset("hearthCanvasExpressionRenderMode", state.expressionRenderMode);
    setDataset("hearthCanvasExpressionSurfaceDrawn", String(state.expressionSurfaceDrawn));

    setDataset("hearthCanvasGovernedSourcePacketObserved", String(state.governedSourcePacketObserved));
    setDataset("hearthCanvasGovernedSourcePacketAccepted", String(state.governedSourcePacketAccepted));
    setDataset("hearthCanvasSourceHoldActive", String(state.sourceHoldActive));
    setDataset("hearthCanvasSourceHoldReason", state.sourceHoldReason);

    setDataset("hearthCanvasInternalizedLaunchGateActive", "true");
    setDataset("hearthCanvasSeparateLaunchFileRequired", "false");
    setDataset("hearthCanvasLaunchCompanionAdmissionSuppressed", "true");
    setDataset("hearthCanvasLaunchPrefaceDecommissioned", String(state.prefaceDecommissionAuthorized));
    setDataset("hearthCanvasPrefaceDecommissionAuthorized", String(state.prefaceDecommissionAuthorized));
    setDataset("hearthCanvasPrefaceHoldRequired", String(state.prefaceHoldRequired));
    setDataset("hearthCanvasPrefaceDecommissionStatus", state.prefaceDecommissionStatus);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextOwner", state.recommendedNextOwner);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasOwnsSourceTruth", "false");
    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");
    setDataset("hearthCanvasOwnsPointerFingerTruth", "false");
    setDataset("hearthCanvasOwnsVisualPass", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const aliases = [
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE",

      "HEARTH_CANVAS_LAUNCH",
      "HEARTH_CANVAS_LAUNCH_PREFACE_GATE",
      "HEARTH_CANVAS_PREFACE_HOLD_GATE",
      "HEARTH_CANVAS_PREFACE_DECOMMISSION_GATE",

      "HEARTH.canvas",
      "HEARTH.canvasHub",
      "HEARTH.canvasParent",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHubFunctionalFallbackHexFingerExpressionConvergence",

      "HEARTH.canvasLaunch",
      "HEARTH.canvasLaunchPrefaceGate",
      "HEARTH.canvasPrefaceHoldGate",
      "HEARTH.canvasPrefaceDecommissionGate",

      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasAuthority",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasHubFunctionalFallbackHexFingerExpressionConvergence",
      "DEXTER_LAB.hearthCanvasLaunch",
      "DEXTER_LAB.hearthCanvasPrefaceDecommissionGate"
    ];

    for (const alias of aliases) setPath(alias, api);

    root.__HEARTH_CANVAS_HUB_PRESENT__ = true;
    root.__HEARTH_CANVAS_HUB_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_HUB_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_INTERNALIZED_LAUNCH_GATE__ = true;

    return true;
  }

  function publishCanvasPackets(reason) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();
    const prefacePacket = composePrefacePacket(reason || "publish-canvas-packets");

    state.currentPacket = clonePlain(receipt);
    state.currentPrefacePacket = clonePlain(prefacePacket);
    state.launchHandshakePublished = true;
    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_EXPRESSION_CONVERGENCE_RECEIPT = receipt;

    root.HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET = prefacePacket;
    root.HEARTH_CANVAS_INTERNALIZED_PREFACE_HANDSHAKE_PACKET = prefacePacket;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_PACKET = prefacePacket;
    root.HEARTH_CANVAS_SURFACE_THRESHOLD_PACKET = prefacePacket;
    root.HEARTH_CANVAS_EXPRESSION_CONVERGENCE_PACKET = prefacePacket;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasExpressionHubReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubFunctionalFallbackHexFingerExpressionConvergenceReceipt = receipt;

    hearth.canvasPrefaceHandshakePacket = prefacePacket;
    hearth.canvasInternalizedPrefaceHandshakePacket = prefacePacket;
    hearth.canvasPrefaceDecommissionPacket = prefacePacket;
    hearth.canvasSurfaceThresholdPacket = prefacePacket;
    hearth.canvasExpressionConvergencePacket = prefacePacket;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasPrefaceHandshakePacket = prefacePacket;
    lab.hearthCanvasPrefaceDecommissionPacket = prefacePacket;
    lab.hearthCanvasExpressionConvergencePacket = prefacePacket;

    updateDataset();

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(prefacePacket) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-surface-threshold", { detail: clonePlain(prefacePacket) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-expression-convergence", { detail: clonePlain(prefacePacket) }));
        if (state.prefaceDecommissionAuthorized) {
          doc.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-decommission", { detail: clonePlain(prefacePacket) }));
        }
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(prefacePacket) }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-surface-threshold", { detail: clonePlain(prefacePacket) }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-expression-convergence", { detail: clonePlain(prefacePacket) }));
        if (state.prefaceDecommissionAuthorized) {
          root.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-decommission", { detail: clonePlain(prefacePacket) }));
        }
      }
    } catch (_error) {}

    return prefacePacket;
  }

  function requestRender(reason) {
    if (renderTimer || !root.setTimeout) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render(reason || "request-render");
    }, 45);
  }

  function render(reason) {
    state.renderCount += 1;

    ensureCanvasSurface(reason || "render");
    drawFunctionalFallback(reason || "render-functional-threshold");
    deliverCanvasHexGate(reason || "render-hex-gate");
    collectExpressionSamples(reason || "render-expression-samples");
    resolveExpressionConvergence(reason || "render");

    if (state.expressionConvergenceThresholdMet) {
      drawExpressionSurface(reason || "render-expression-surface");
    }

    publishCanvasPackets(reason || "render");
    return getReceiptLight();
  }

  function refresh(reason) {
    return render(reason || "refresh");
  }

  function mount(options) {
    const reason = options && options.reason ? options.reason : "mount";
    ensureCanvasSurface(reason);
    drawFunctionalFallback(reason);
    deliverCanvasHexGate(reason);
    collectExpressionSamples(reason);
    resolveExpressionConvergence(reason);
    if (state.expressionConvergenceThresholdMet) drawExpressionSurface(reason);
    publishCanvasPackets(reason);
    return getReceiptLight();
  }

  function boot(options) {
    if (bootPromise && !(options && options.force)) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted && !(options && options.force)) return getReceipt();

      state.booting = true;
      state.started = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "CANVAS_HUB_BOOTING_FUNCTIONAL_FALLBACK_HEX_FINGER_CONVERGENCE";

      publishApiAliases();
      updateDataset();

      ensureCanvasSurface(options && options.reason ? options.reason : "boot");
      drawFunctionalFallback("boot");
      deliverCanvasHexGate("boot");
      collectExpressionSamples("boot");
      resolveExpressionConvergence("boot");

      if (state.expressionConvergenceThresholdMet) {
        drawExpressionSurface("boot-expression-convergence");
      }

      state.booted = true;
      state.booting = false;

      publishCanvasPackets("boot");

      if (root.setTimeout) {
        root.setTimeout(() => render("post-boot-160ms"), 160);
        root.setTimeout(() => render("post-boot-640ms"), 640);
        root.setTimeout(() => render("post-boot-1400ms"), 1400);
      }

      if (root.addEventListener) {
        try {
          root.addEventListener("resize", scheduleResizeWatch, { passive: true });
        } catch (_error) {}
      }

      record("HEARTH_CANVAS_HUB_FUNCTIONAL_FALLBACK_HEX_FINGER_CONVERGENCE_BOOT_COMPLETE", {
        canvasElementFound: state.canvasElementFound,
        canvasPixelVisible: state.canvasPixelVisible,
        functionalFallbackThresholdMet: state.functionalFallbackThresholdMet,
        hexGateThresholdMet: state.hexGateThresholdMet,
        fingerExpressionThresholdMet: state.fingerExpressionThresholdMet,
        expressionConvergenceThresholdMet: state.expressionConvergenceThresholdMet,
        visualPassClaimed: false
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function scheduleResizeWatch() {
    if (!root.setTimeout) return;

    if (resizeTimer) {
      try {
        root.clearTimeout(resizeTimer);
      } catch (_error) {}
    }

    resizeTimer = root.setTimeout(() => {
      resizeTimer = 0;
      updateCanvasSize("resize-watch");
      render("resize-watch");
    }, 220);
  }

  function startAnimation(reason) {
    state.rotationEnabled = true;

    if (!root.requestAnimationFrame || rafId) return;

    const tick = () => {
      if (!state.rotationEnabled || state.disposed) {
        rafId = 0;
        return;
      }

      state.yaw += 0.0024;
      render(reason || "animation-frame");
      rafId = root.requestAnimationFrame(tick);
    };

    rafId = root.requestAnimationFrame(tick);
  }

  function stopAnimation() {
    state.rotationEnabled = false;

    if (rafId && root.cancelAnimationFrame) {
      try {
        root.cancelAnimationFrame(rafId);
      } catch (_error) {}
    }

    rafId = 0;
  }

  function dispose(reason) {
    stopAnimation();

    if (renderTimer) {
      try {
        root.clearTimeout(renderTimer);
      } catch (_error) {}
      renderTimer = 0;
    }

    if (resizeTimer) {
      try {
        root.clearTimeout(resizeTimer);
      } catch (_error) {}
      resizeTimer = 0;
    }

    state.disposed = true;
    state.started = false;
    state.postgameStatus = "CANVAS_HUB_DISPOSED";

    record("HEARTH_CANVAS_HUB_DISPOSED", { reason: reason || "dispose" });
    publishCanvasPackets("dispose");
    return getReceipt();
  }

  function getCanvasElement() {
    return canvasElement || findExistingCanvas();
  }

  function getPrefaceHandshakePacket(options) {
    updateSurfaceProof("get-preface-handshake-packet");
    resolveExpressionConvergence("get-preface-handshake-packet");
    return composePrefacePacket(options && options.reason ? options.reason : "getPrefaceHandshakePacket");
  }

  function getCanvasSurfaceThresholdPacket(options) {
    updateSurfaceProof("get-canvas-surface-threshold-packet");
    resolveExpressionConvergence("get-canvas-surface-threshold-packet");
    return composePrefacePacket(options && options.reason ? options.reason : "getCanvasSurfaceThresholdPacket");
  }

  function getPrefaceDecommissionPacket(options) {
    updateSurfaceProof("get-preface-decommission-packet");
    resolveExpressionConvergence("get-preface-decommission-packet");
    return composePrefacePacket(options && options.reason ? options.reason : "getPrefaceDecommissionPacket");
  }

  function releaseToPrefaceLaunch(options) {
    const packet = getPrefaceDecommissionPacket(options || {});
    publishCanvasPackets("release-to-internalized-preface-gate");
    return packet;
  }

  function receivePrefaceLaunchPacket(packet, options) {
    record("HEARTH_CANVAS_HUB_INTERNALIZED_PREFACE_PACKET_RECEIVED", {
      source: options && options.source ? options.source : "PUBLIC_API",
      prefaceHoldRequired: safeBool(packet && packet.prefaceHoldRequired, true)
    });

    publishCanvasPackets("receive-preface-launch-packet");
    return composePrefacePacket("receivePrefaceLaunchPacket");
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    fingerSurfaceFile: FINGER_SURFACE_FILE,
    fingerBoundaryFile: FINGER_BOUNDARY_FILE,
    fingerMassFile: FINGER_MASS_FILE,
    fingerLightFile: FINGER_LIGHT_FILE,
    fingerInspectFile: FINGER_INSPECT_FILE,
    internalizedLaunchFile: INTERNALIZED_LAUNCH_FILE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    mount,
    refresh,
    render,
    dispose,

    ensureCanvasSurface,
    drawFunctionalFallback,
    drawFirstFastSurface: drawFunctionalFallback,
    drawExpressionSurface,
    drawInteractiveFrame: render,
    drawPairFrame: render,
    requestRender,
    startAnimation,
    stopAnimation,

    receiveGovernedSourceStackPacket: receiveGovernedSourcePacket,
    consumeGovernedSourceStackPacket: receiveGovernedSourcePacket,
    acceptGovernedSourceStackPacket: receiveGovernedSourcePacket,
    receiveGovernedSourcePacket,
    consumeGovernedSourcePacket: receiveGovernedSourcePacket,
    acceptGovernedSourcePacket: receiveGovernedSourcePacket,
    receiveSourceStackPacket: receiveGovernedSourcePacket,
    consumeSourceStackPacket: receiveGovernedSourcePacket,
    acceptSourceStackPacket: receiveGovernedSourcePacket,
    receiveSourceTruthPacket: receiveGovernedSourcePacket,
    consumeSourceTruthPacket: receiveGovernedSourcePacket,
    receiveRouteConductorGovernedSourcePacket: receiveGovernedSourcePacket,
    consumeRouteConductorGovernedSourcePacket: receiveGovernedSourcePacket,
    receiveRouteConductorSourceStackPacket: receiveGovernedSourcePacket,
    consumeRouteConductorSourceStackPacket: receiveGovernedSourcePacket,
    receiveRouteConductorCanvasGovernedHandoffPacket: receiveGovernedSourcePacket,
    consumeRouteConductorCanvasGovernedHandoffPacket: receiveGovernedSourcePacket,

    receiveRouteConductorControlHandshake: receiveControlHandshake,
    consumeRouteConductorControlHandshake: receiveControlHandshake,
    receiveControlHandshake,
    consumeControlHandshake: receiveControlHandshake,
    receiveControlHandshakePacket: receiveControlHandshake,
    acceptControlHandshakePacket: receiveControlHandshake,
    receiveQueenControlHandshake: receiveControlHandshake,
    consumeQueenControlHandshake: receiveControlHandshake,

    receiveViewControlPacket,
    consumeViewControlPacket: receiveViewControlPacket,
    receiveControlPacket: receiveViewControlPacket,
    receiveCanvasViewPacket: receiveViewControlPacket,
    receiveRouteConductorReleasePacket: receiveGovernedSourcePacket,
    consumeRouteConductorReleasePacket: receiveGovernedSourcePacket,
    receiveReleasePacket: receiveGovernedSourcePacket,
    consumeReleasePacket: receiveGovernedSourcePacket,
    acceptReleasePacket: receiveGovernedSourcePacket,
    receivePacket: receiveGovernedSourcePacket,

    composeCanvasHexGatePacket,
    deliverCanvasHexGate,
    collectExpressionSamples,
    resolveExpressionConvergence,
    findHexSurfaceApi,
    findFingerSurfaceApi,

    getPrefaceHandshakePacket,
    composePrefaceHandshakePacket: getPrefaceHandshakePacket,
    getCanvasSurfaceThresholdPacket,
    getCanvasSurfaceWorthinessPacket: getCanvasSurfaceThresholdPacket,
    getPrefaceDecommissionPacket,
    releaseToPrefaceLaunch,
    receivePrefaceLaunchPacket,
    receiveCanvasLaunchPacket: receivePrefaceLaunchPacket,
    receiveLaunchPacket: receivePrefaceLaunchPacket,
    consumePrefaceLaunchPacket: receivePrefaceLaunchPacket,
    acceptPrefaceLaunchPacket: receivePrefaceLaunchPacket,

    getCanvasElement,
    getCanvas: getCanvasElement,
    getContext2d: () => ctx2d,

    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getSummary: getReceiptLight,
    getReport: getReceipt,
    getState: getReceiptLight,
    getReceiptText,
    getStatusText,
    composeReceiptText,

    publishApiAliases,
    publishCanvasPackets,
    updateDataset,

    supportsRealDomCanvasSurface: true,
    supportsCanvasSurfaceTruthProbe: true,
    supportsFunctionalFallbackThreshold: true,
    supportsFirstFastVisible2dSurface: true,
    supportsGovernedSourceStackPacket: true,
    supportsHexGateThreshold: true,
    supportsFingerSurfaceExpressionThreshold: true,
    supportsDirectFingerSurfaceBridge: true,
    supportsExpressionConvergenceThreshold: true,
    supportsInternalizedPrefaceGate: true,
    supportsLaunchCompanionAdmission: false,
    supportsDeferredHexRenderReceiver: true,

    ownsCanvasDrawing: true,
    ownsCanvasCreation: true,
    ownsFunctionalFallbackThreshold: true,
    ownsExpressionRenderSurface: true,
    ownsInternalizedPrefaceGate: true,
    ownsLaunchCompanionAdmission: false,

    ownsSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexAuthorityTruth: false,
    ownsPointerFingerTruth: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsDiagnosticRail: false,
    ownsNorthF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,
    ownsFinalVisualPassClaim: false,

    separateLaunchFileRequired: false,
    internalizedLaunchGateActive: true,
    launchCompanionAdmissionSuppressed: true,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishApiAliases();
    updateDataset();
    publishCanvasPackets("immediate-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "DOMContentLoaded" }), { once: true });
      } else {
        boot({ reason: "script-load" });
      }
    } else {
      boot({ reason: "no-document" });
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_HUB_FUNCTIONAL_CONVERGENCE_INITIALIZATION_FAILED", error);

    try {
      publishApiAliases();
      updateDataset();
      publishCanvasPackets("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
