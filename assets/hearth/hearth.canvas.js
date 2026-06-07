// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_5
// Full-file replacement.
// Canvas Hub / DOM canvas surface / launch-handshake authority only.
// Purpose:
// - Create or bind a real DOM <canvas> surface inside #hearthCanvasMount.
// - Publish Canvas Hub aliases expected by the diagnostic surface-truth probe.
// - Draw a first fast visible 2D Hearth surface before deferred downstream rendering.
// - Consume governed source packets through public APIs only.
// - Preserve Canvas as receiver/output carrier only.
// - Publish the narrow launch handshake consumed by /assets/hearth/hearth.canvas.launch.js.
// - Authorize preface decommission only after this Canvas Hub proves a real visible 2D surface.
// - Optionally admit the launch companion without requiring index.js changes.
// Does not own:
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
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
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT_v12_5";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_RECEIPT_v12_4";

  const VERSION =
    "2026-06-07.hearth-canvas-hub-source-hold-planet-surface-threshold-receiver-v12-5";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_ID = "hearthCanvas";
  const STYLE_ID = "hearthCanvasHubStyle";
  const LAUNCH_SCRIPT_ID = "hearth-canvas-launch-preface-hold-decommission-gate-script";

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

  const LAUNCH_API_PATHS = Object.freeze([
    "HEARTH.canvasLaunch",
    "HEARTH.canvasLaunchPrefaceGate",
    "HEARTH.canvasPrefaceHoldGate",
    "HEARTH.canvasPrefaceDecommissionGate",
    "HEARTH_CANVAS_LAUNCH",
    "HEARTH_CANVAS_LAUNCH_PREFACE_GATE",
    "HEARTH_CANVAS_PREFACE_HOLD_GATE",
    "HEARTH_CANVAS_PREFACE_DECOMMISSION_GATE",
    "DEXTER_LAB.hearthCanvasLaunch",
    "DEXTER_LAB.hearthCanvasLaunchPrefaceGate"
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
    version: VERSION,
    file: FILE,
    launchFile: LAUNCH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    started: false,
    disposed: false,

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

    surfaceWorthy: false,
    surfaceWorthinessStatus: "WAITING_CANVAS_SURFACE",
    surfaceWorthinessScore: 0,
    surfaceWorthinessFirstFailedCoordinate: "CANVAS_ELEMENT_FOUND",
    prefaceDecommissionAuthorized: false,
    prefaceHoldRequired: true,

    launchCompanionAdmissionAttempted: false,
    launchCompanionScriptPresent: false,
    launchCompanionScriptStatus: "NOT_ATTEMPTED",
    launchCompanionApiObserved: false,
    launchHandshakePublished: false,
    launchHandshakeDelivered: false,
    launchHandshakeMethod: "NONE",
    launchHandshakeStatus: "WAITING_CANVAS_SURFACE",

    governedSourcePacketObserved: false,
    governedSourcePacketAccepted: false,
    governedSourcePacketStatus: "NOT_OBSERVED",
    governedSourcePacketSource: "NONE",
    governedSourcePacketReceivedAt: "",
    sourceHoldActive: true,
    sourceHoldReason: "WAITING_GOVERNED_SOURCE_PACKET_OR_FIRST_FAST_SURFACE",
    fallbackSurfaceActive: true,
    fallbackSurfaceReason: "FIRST_FAST_CANVAS_SURFACE",

    controlHandshakeObserved: false,
    controlHandshakeAccepted: false,
    controlHandshakeStatus: "NOT_OBSERVED",
    viewControlObserved: false,

    hexSurfaceForwardAttempted: false,
    hexSurfaceForwardStatus: "NOT_ATTEMPTED",

    renderCount: 0,
    drawCount: 0,
    eventCount: 0,
    errorCount: 0,
    receiptPublishCount: 0,

    yaw: -0.42,
    pitch: 0.08,
    scale: 1,
    rotationEnabled: false,

    currentPacket: null,
    currentGovernedSourcePacket: null,
    currentControlHandshakePacket: null,
    currentLaunchPacket: null,

    latestEvent: "CANVAS_HUB_LOADED",
    lastError: "NONE",
    firstFailedCoordinate: "CANVAS_ELEMENT_FOUND",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_AND_BIND_REAL_DOM_CANVAS_SURFACE",
    postgameStatus: "LOADED",

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
    if (value === true || value === 1 || value === "1") return true;
    if (value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0") return false;
    if (value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clonePlain(value) {
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

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_HUB_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 160);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_HUB_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 90);
    state.errorCount = state.errors.length;
    state.lastError = item.message || item.code;
    state.latestEvent = item.code;

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
      if (!cursor || cursor[part] === undefined || cursor[part] === null) {
        return null;
      }
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const key = parts[index];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function q(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;
    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector, base = doc) {
    if (!base || !isFunction(base.querySelectorAll)) return [];
    try {
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function firstElement(selectors, base = doc) {
    for (const selector of selectors || []) {
      const element = q(selector, base);
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

  function currentRouteStatus() {
    try {
      const path = root.location && root.location.pathname ? root.location.pathname : "";
      if (path === DIAGNOSTIC_ROUTE || path === DIAGNOSTIC_ROUTE.replace(/\/$/, "")) {
        return "DIAGNOSTIC_ROUTE";
      }
      if (path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "")) {
        return "TARGET_ROUTE";
      }
      if (/\/showroom\/globe\/hearth\/?$/.test(path)) return "TARGET_ROUTE_PATTERN";
      return "UNKNOWN_ROUTE";
    } catch (_error) {
      return "UNKNOWN_ROUTE";
    }
  }

  function routeAllowsCompanionAdmission() {
    const status = currentRouteStatus();
    return status === "TARGET_ROUTE" || status === "TARGET_ROUTE_PATTERN";
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.dataset.hearthCanvasHubStyle = "true";
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

    const head = doc.head || doc.documentElement;
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
    if (!mount || !mount.style) return;

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(mount) : null;
      if (style && style.position === "static") mount.style.position = "relative";
    } catch (_error) {
      mount.style.position = mount.style.position || "relative";
    }

    if (!mount.dataset.hearthCanvasMount) {
      mount.dataset.hearthCanvasMount = "true";
    }

    mount.dataset.hearthCanvasHubMountPrepared = "true";
    mount.dataset.hearthCanvasContract = CONTRACT;
    mount.dataset.hearthCanvasReceipt = RECEIPT;

    if (!mount.style.minHeight) {
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

  function ensureCanvasSurface(reason = "ensure-canvas-surface") {
    if (!doc) {
      state.firstFailedCoordinate = "DOCUMENT_UNAVAILABLE";
      state.recommendedNextOwner = "ROUTE_DOCUMENT";
      state.recommendedNextFile = TARGET_ROUTE;
      state.recommendedNextAction = "LOAD_CANVAS_ON_BROWSER_DOCUMENT";
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

    updateCanvasSize("ensure");
    updateSurfaceProof("ensure");

    return canvas;
  }

  function updateCanvasSize(reason = "resize") {
    const canvas = canvasElement || findExistingCanvas();
    if (!canvas) return false;

    const rect = getRect(canvas);
    const dpr = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));

    let cssSize = Math.max(rect.width, rect.height);

    if (!cssSize || cssSize < 16) {
      cssSize = 512;
    }

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

  function drawJaggedLand(ctx, cx, cy, radius, seed, offsetX, offsetY, scaleX, scaleY) {
    const points = 18;
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

  function drawFirstFastSurface(reason = "first-fast-surface") {
    const canvas = ensureCanvasSurface(reason);
    if (!canvas || !ctx2d) {
      updateSurfaceProof("draw-failed");
      return false;
    }

    updateCanvasSize("draw");

    const ctx = ctx2d;
    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);
    const size = Math.min(width, height);

    if (size <= 0) {
      updateSurfaceProof("draw-zero-size");
      return false;
    }

    state.drawCount += 1;

    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.43;
    const yaw = state.yaw + state.drawCount * 0.003;

    ctx.clearRect(0, 0, width, height);

    const space = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.8);
    space.addColorStop(0, "rgba(15, 28, 55, 0.52)");
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
    ocean.addColorStop(0, "rgb(78, 146, 188)");
    ocean.addColorStop(0.48, "rgb(19, 74, 124)");
    ocean.addColorStop(1, "rgb(5, 23, 58)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.strokeStyle = "rgba(195, 226, 239, 0.23)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    for (let i = -3; i <= 3; i += 1) {
      const y = cy + i * radius * 0.24 + Math.sin(yaw + i) * radius * 0.018;
      ctx.beginPath();
      ctx.ellipse(cx, y, radius * 1.04, radius * 0.11, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(109, 105, 66, 0.96)";
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

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "rgb(199, 238, 255)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    for (let i = 0; i < 12; i += 1) {
      const a = yaw + i * 0.72;
      const x = cx + Math.cos(a) * radius * 0.18;
      const y = cy + Math.sin(a * 1.3) * radius * 0.34;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 0.28, radius * 0.025, a * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255, 238, 190, 0.18)");
    shade.addColorStop(0.47, "rgba(255, 255, 255, 0)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.44)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(150, 218, 255, 0.32)";
    ctx.lineWidth = Math.max(2, size * 0.006);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - radius * 0.12, cy - radius * 0.18, radius * 0.99, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 238, 188, 0.10)";
    ctx.lineWidth = Math.max(2, size * 0.012);
    ctx.stroke();

    updateSurfaceProof("draw-complete");
    publishCanvasPackets("draw-complete");
    maybeNotifyLaunch("draw-complete");

    return true;
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
        [0.65, 0.65]
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

  function updateSurfaceProof(reason = "surface-proof") {
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
      resolveWorthiness(reason);
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
      canvas.dataset.hearthCanvasSurfaceWorthy = String(state.surfaceWorthy);
      canvas.dataset.hearthCanvasPixelVisible = String(state.canvasPixelVisible);
      canvas.dataset.hearthCanvasPixelSampleStatus = state.canvasPixelSampleStatus;
    }

    resolveWorthiness(reason);
    return state.surfaceWorthy;
  }

  function resolveWorthiness(reason = "resolve-worthiness") {
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
      ["CANVAS_PIXEL_VISIBLE", state.canvasPixelVisible === true]
    ];

    const passed = checks.filter((entry) => entry[1]).length;
    const failed = checks.find((entry) => !entry[1]) || null;

    state.surfaceWorthinessScore = Math.round((passed / checks.length) * 100);
    state.surfaceWorthy = !failed;
    state.surfaceWorthinessFirstFailedCoordinate = failed ? failed[0] : "NONE";

    if (state.surfaceWorthy) {
      state.surfaceWorthinessStatus = "SURFACE_WORTHY_DOM_CANVAS_2D_PIXEL_PROOF";
      state.prefaceDecommissionAuthorized = true;
      state.prefaceHoldRequired = false;
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextOwner = "TEACHER_REVIEW";
      state.recommendedNextFile = LAUNCH_FILE;
      state.recommendedNextAction = "CONFIRM_LAUNCH_PREFACE_DECOMMISSION_HANDSHAKE";
      state.postgameStatus = "CANVAS_SURFACE_WORTHY_NO_FINAL_VISUAL_PASS_CLAIM";
    } else {
      state.surfaceWorthinessStatus = `SURFACE_HELD_AT_${state.surfaceWorthinessFirstFailedCoordinate}`;
      state.prefaceDecommissionAuthorized = false;
      state.prefaceHoldRequired = true;
      state.firstFailedCoordinate = state.surfaceWorthinessFirstFailedCoordinate;
      state.recommendedNextOwner = "CANVAS_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = `REPAIR_CANVAS_SURFACE_COORDINATE:${state.surfaceWorthinessFirstFailedCoordinate}`;
      state.postgameStatus = "CANVAS_SURFACE_HELD_BELOW_THRESHOLD";
    }

    state.launchHandshakeStatus = state.prefaceDecommissionAuthorized
      ? "CANVAS_AUTHORIZES_PREFACE_DECOMMISSION"
      : "CANVAS_REQUIRES_PREFACE_HOLD";

    record("HEARTH_CANVAS_HUB_SURFACE_WORTHINESS_RESOLVED", {
      reason,
      surfaceWorthy: state.surfaceWorthy,
      score: state.surfaceWorthinessScore,
      firstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate
    });

    return state.surfaceWorthy;
  }

  function composeLaunchHandshakePacket(reason = "compose-launch-handshake") {
    return {
      packetType: "HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET_v12_5",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-surface-worthiness-authority",
      targetFile: LAUNCH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reason,

      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,

      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,
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
      visiblePlanetProofReady: state.surfaceWorthy,
      planetSurfaceReady: state.surfaceWorthy,

      canvasOwnsSurfaceWorthinessAuthority: true,
      canvasOwnsPrefaceHold: false,
      canvasOwnsPrefaceDecommissionEnforcement: false,
      canvasOwnsSourceTruth: false,
      canvasOwnsTerrainTruth: false,
      canvasOwnsHydrologyTruth: false,
      canvasOwnsElevationTruth: false,
      canvasOwnsMaterialTruth: false,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptLight() {
    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_PACKET_v12_5",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,
      file: FILE,
      launchFile: LAUNCH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

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

      surfaceWorthy: state.surfaceWorthy,
      surfaceWorthinessStatus: state.surfaceWorthinessStatus,
      surfaceWorthinessScore: state.surfaceWorthinessScore,
      surfaceWorthinessFirstFailedCoordinate: state.surfaceWorthinessFirstFailedCoordinate,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      prefaceHoldRequired: state.prefaceHoldRequired,

      launchCompanionAdmissionAttempted: state.launchCompanionAdmissionAttempted,
      launchCompanionScriptPresent: state.launchCompanionScriptPresent,
      launchCompanionScriptStatus: state.launchCompanionScriptStatus,
      launchCompanionApiObserved: state.launchCompanionApiObserved,
      launchHandshakePublished: state.launchHandshakePublished,
      launchHandshakeDelivered: state.launchHandshakeDelivered,
      launchHandshakeMethod: state.launchHandshakeMethod,
      launchHandshakeStatus: state.launchHandshakeStatus,

      governedSourcePacketObserved: state.governedSourcePacketObserved,
      governedSourcePacketAccepted: state.governedSourcePacketAccepted,
      governedSourcePacketStatus: state.governedSourcePacketStatus,
      governedSourcePacketSource: state.governedSourcePacketSource,
      governedSourcePacketReceivedAt: state.governedSourcePacketReceivedAt,
      sourceHoldActive: state.sourceHoldActive,
      sourceHoldReason: state.sourceHoldReason,
      fallbackSurfaceActive: state.fallbackSurfaceActive,
      fallbackSurfaceReason: state.fallbackSurfaceReason,

      controlHandshakeObserved: state.controlHandshakeObserved,
      controlHandshakeAccepted: state.controlHandshakeAccepted,
      controlHandshakeStatus: state.controlHandshakeStatus,
      viewControlObserved: state.viewControlObserved,

      hexSurfaceForwardAttempted: state.hexSurfaceForwardAttempted,
      hexSurfaceForwardStatus: state.hexSurfaceForwardStatus,

      drawCount: state.drawCount,
      renderCount: state.renderCount,
      receiptPublishCount: state.receiptPublishCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsCanvasDrawing: true,
      ownsCanvasCreation: true,
      ownsCanvasSurfaceWorthinessAuthority: true,
      ownsPrefaceHold: false,
      ownsPrefaceDecommissionEnforcement: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsDiagnosticRail: false,
      ownsNorthF21: false,
      ownsReadyText: false,
      ownsVisualPass: false,

      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptLight() {
    updateSurfaceProof("get-receipt-light");
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentLaunchHandshakePacket: composeLaunchHandshakePacket("get-receipt"),
      currentGovernedSourcePacket: clonePlain(state.currentGovernedSourcePacket),
      currentControlHandshakePacket: clonePlain(state.currentControlHandshakePacket),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice()
    };
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_STATUS",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `internalRenewalContract=${r.internalRenewalContract}`,
      `file=${r.file}`,
      `canvasElementFound=${r.canvasElementFound}`,
      `canvasSelector=${r.canvasSelector}`,
      `canvasMountFound=${r.canvasMountFound}`,
      `canvasInMount=${r.canvasInMount}`,
      `canvasWidthAttribute=${r.canvasWidthAttribute}`,
      `canvasHeightAttribute=${r.canvasHeightAttribute}`,
      `canvasRectNonzero=${r.canvasRectNonzero}`,
      `canvasComputedVisible=${r.canvasComputedVisible}`,
      `canvasViewportIntersecting=${r.canvasViewportIntersecting}`,
      `canvasContext2DReady=${r.canvasContext2DReady}`,
      `canvasPixelSampleStatus=${r.canvasPixelSampleStatus}`,
      `canvasPixelVisible=${r.canvasPixelVisible}`,
      `surfaceWorthy=${r.surfaceWorthy}`,
      `surfaceWorthinessStatus=${r.surfaceWorthinessStatus}`,
      `surfaceWorthinessScore=${r.surfaceWorthinessScore}`,
      `surfaceWorthinessFirstFailedCoordinate=${r.surfaceWorthinessFirstFailedCoordinate}`,
      `prefaceDecommissionAuthorized=${r.prefaceDecommissionAuthorized}`,
      `launchHandshakeDelivered=${r.launchHandshakeDelivered}`,
      `launchHandshakeMethod=${r.launchHandshakeMethod}`,
      `governedSourcePacketAccepted=${r.governedSourcePacketAccepted}`,
      `fallbackSurfaceActive=${r.fallbackSurfaceActive}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `visualPassClaimed=false`,
      `generatedImage=false`,
      `graphicBox=false`,
      `webGL=false`,
      `updatedAt=${r.updatedAt}`
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

    setDataset("hearthCanvasSurfaceWorthy", String(state.surfaceWorthy));
    setDataset("hearthCanvasSurfaceWorthinessStatus", state.surfaceWorthinessStatus);
    setDataset("hearthCanvasSurfaceWorthinessScore", String(state.surfaceWorthinessScore));
    setDataset("hearthCanvasSurfaceWorthinessFirstFailedCoordinate", state.surfaceWorthinessFirstFailedCoordinate);
    setDataset("hearthCanvasPrefaceDecommissionAuthorized", String(state.prefaceDecommissionAuthorized));
    setDataset("hearthCanvasPrefaceHoldRequired", String(state.prefaceHoldRequired));

    setDataset("hearthCanvasLaunchHandshakePublished", String(state.launchHandshakePublished));
    setDataset("hearthCanvasLaunchHandshakeDelivered", String(state.launchHandshakeDelivered));
    setDataset("hearthCanvasLaunchHandshakeStatus", state.launchHandshakeStatus);

    setDataset("hearthCanvasGovernedSourcePacketObserved", String(state.governedSourcePacketObserved));
    setDataset("hearthCanvasGovernedSourcePacketAccepted", String(state.governedSourcePacketAccepted));
    setDataset("hearthCanvasSourceHoldActive", String(state.sourceHoldActive));
    setDataset("hearthCanvasSourceHoldReason", state.sourceHoldReason);
    setDataset("hearthCanvasFallbackSurfaceActive", String(state.fallbackSurfaceActive));

    setDataset("hearthCanvasOwnsSourceTruth", "false");
    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");
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

  function publishCanvasPackets(reason = "publish-canvas-packets") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();
    const launchPacket = composeLaunchHandshakePacket(reason);

    state.currentPacket = clonePlain(receipt);
    state.currentLaunchPacket = clonePlain(launchPacket);
    state.launchHandshakePublished = true;
    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_RECEIPT = receipt;

    root.HEARTH_CANVAS_PREFACE_HANDSHAKE_PACKET = launchPacket;
    root.HEARTH_CANVAS_SURFACE_WORTHINESS_PACKET = launchPacket;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_PACKET = launchPacket;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasExpressionHubReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubSourceHoldPlanetSurfaceThresholdReceiverReceipt = receipt;

    hearth.canvasPrefaceHandshakePacket = launchPacket;
    hearth.canvasSurfaceWorthinessPacket = launchPacket;
    hearth.canvasPrefaceDecommissionPacket = launchPacket;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasPrefaceHandshakePacket = launchPacket;
    lab.hearthCanvasSurfaceWorthinessPacket = launchPacket;
    lab.hearthCanvasPrefaceDecommissionPacket = launchPacket;

    updateDataset();

    try {
      if (doc && isFunction(doc.dispatchEvent)) {
        doc.dispatchEvent(new CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(launchPacket) }));
        doc.dispatchEvent(new CustomEvent("hearth:canvas-surface-worthiness", { detail: clonePlain(launchPacket) }));
        if (state.prefaceDecommissionAuthorized) {
          doc.dispatchEvent(new CustomEvent("hearth:canvas-preface-decommission", { detail: clonePlain(launchPacket) }));
        }
      }

      if (isFunction(root.dispatchEvent)) {
        root.dispatchEvent(new CustomEvent("hearth:canvas-preface-handshake", { detail: clonePlain(launchPacket) }));
        root.dispatchEvent(new CustomEvent("hearth:canvas-surface-worthiness", { detail: clonePlain(launchPacket) }));
        if (state.prefaceDecommissionAuthorized) {
          root.dispatchEvent(new CustomEvent("hearth:canvas-preface-decommission", { detail: clonePlain(launchPacket) }));
        }
      }
    } catch (_error) {}

    return launchPacket;
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
      "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER",

      "HEARTH.canvas",
      "HEARTH.canvasHub",
      "HEARTH.canvasParent",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHubSourceHoldPlanetSurfaceThresholdReceiver",

      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasAuthority",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
      "DEXTER_LAB.hearthCanvasHubSourceHoldPlanetSurfaceThresholdReceiver"
    ];

    for (const alias of aliases) setPath(alias, api);

    root.__HEARTH_CANVAS_HUB_PRESENT__ = true;
    root.__HEARTH_CANVAS_HUB_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_HUB_RECEIPT__ = RECEIPT;

    return true;
  }

  function findLaunchApi() {
    for (const path of LAUNCH_API_PATHS) {
      const candidate = readPath(path);
      if (candidate && candidate !== api && (isObject(candidate) || isFunction(candidate))) {
        state.launchCompanionApiObserved = true;
        return { path, api: candidate };
      }
    }

    state.launchCompanionApiObserved = false;
    return { path: "NONE", api: null };
  }

  function maybeNotifyLaunch(reason = "notify-launch") {
    const found = findLaunchApi();
    const launch = found.api;
    const packet = composeLaunchHandshakePacket(reason);

    if (!launch) {
      state.launchHandshakeDelivered = false;
      state.launchHandshakeMethod = "NONE";
      return false;
    }

    const methods = [
      "receiveCanvasPrefaceDecommissionPacket",
      "receiveCanvasSurfaceWorthinessPacket",
      "receiveCanvasPrefaceHandshakePacket",
      "consumeCanvasHandshakePacket",
      "inspectCanvasHandshake",
      "refresh",
      "mount",
      "boot"
    ];

    for (const method of methods) {
      if (!isFunction(launch[method])) continue;

      try {
        if (method === "refresh" || method === "mount" || method === "boot") {
          launch[method]({ reason: `canvas-hub-${reason}` });
        } else {
          launch[method](clonePlain(packet), {
            source: "HEARTH_CANVAS_HUB",
            sourceFile: FILE,
            reason
          });
        }

        state.launchHandshakeDelivered = true;
        state.launchHandshakeMethod = method;
        state.launchHandshakeStatus = state.prefaceDecommissionAuthorized
          ? "DELIVERED_PREFACE_DECOMMISSION_AUTHORIZATION"
          : "DELIVERED_PREFACE_HOLD_HANDSHAKE";

        record("HEARTH_CANVAS_HUB_LAUNCH_HANDSHAKE_DELIVERED", {
          method,
          launchPath: found.path,
          surfaceWorthy: state.surfaceWorthy,
          prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized
        });

        return true;
      } catch (error) {
        recordError("HEARTH_CANVAS_HUB_LAUNCH_HANDSHAKE_DELIVERY_FAILED", error, { method });
      }
    }

    state.launchHandshakeDelivered = false;
    state.launchHandshakeMethod = "NONE";
    state.launchHandshakeStatus = "LAUNCH_API_OBSERVED_NO_ACCEPTING_METHOD";
    return false;
  }

  function admitLaunchCompanion(reason = "admit-launch-companion") {
    if (!doc || !routeAllowsCompanionAdmission()) {
      state.launchCompanionScriptStatus = "HELD_ROUTE_NOT_TARGET";
      return false;
    }

    const existingApi = findLaunchApi();
    if (existingApi.api) {
      state.launchCompanionScriptPresent = true;
      state.launchCompanionScriptStatus = "LAUNCH_API_ALREADY_PRESENT";
      return true;
    }

    const existingScript =
      doc.getElementById(LAUNCH_SCRIPT_ID) ||
      qa("script[src]").find((script) => safeString(script.getAttribute("src")).includes(LAUNCH_FILE));

    if (existingScript) {
      state.launchCompanionScriptPresent = true;
      state.launchCompanionScriptStatus = "LAUNCH_SCRIPT_ALREADY_PRESENT";
      return true;
    }

    try {
      const script = doc.createElement("script");
      script.id = LAUNCH_SCRIPT_ID;
      script.src = `${LAUNCH_FILE}?v=${encodeURIComponent(INTERNAL_RENEWAL_CONTRACT)}`;
      script.async = false;
      script.defer = true;
      script.dataset.hearthCanvasLaunchCompanion = "true";
      script.dataset.admittedBy = CONTRACT;
      script.dataset.admissionReason = reason;
      script.dataset.canvasOwnsLaunchImplementation = "false";
      script.dataset.canvasOwnsPrefaceHold = "false";
      script.dataset.visualPassClaimed = "false";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";

      script.addEventListener("load", () => {
        state.launchCompanionScriptStatus = "LAUNCH_SCRIPT_LOAD_COMPLETE";
        record("HEARTH_CANVAS_HUB_LAUNCH_COMPANION_LOAD_COMPLETE", { reason });
        maybeNotifyLaunch("launch-script-loaded");
      }, { once: true });

      script.addEventListener("error", () => {
        state.launchCompanionScriptStatus = "LAUNCH_SCRIPT_LOAD_ERROR";
        recordError("HEARTH_CANVAS_HUB_LAUNCH_COMPANION_LOAD_ERROR", "LAUNCH_SCRIPT_LOAD_ERROR", { reason });
      }, { once: true });

      (doc.head || doc.documentElement || doc.body).appendChild(script);

      state.launchCompanionAdmissionAttempted = true;
      state.launchCompanionScriptPresent = true;
      state.launchCompanionScriptStatus = "LAUNCH_SCRIPT_ADMITTED_BY_CANVAS_HUB";

      record("HEARTH_CANVAS_HUB_LAUNCH_COMPANION_ADMITTED", { reason });

      return true;
    } catch (error) {
      state.launchCompanionScriptStatus = "LAUNCH_SCRIPT_ADMISSION_FAILED";
      recordError("HEARTH_CANVAS_HUB_LAUNCH_COMPANION_ADMISSION_FAILED", error, { reason });
      return false;
    }
  }

  function consumeGovernedSourcePacket(packet, options = {}) {
    state.currentGovernedSourcePacket = clonePlain(packet || {});
    state.governedSourcePacketObserved = true;
    state.governedSourcePacketAccepted = true;
    state.governedSourcePacketStatus = "GOVERNED_SOURCE_PACKET_ACCEPTED_BY_CANVAS_PUBLIC_API";
    state.governedSourcePacketSource = options.source || "PUBLIC_API";
    state.governedSourcePacketReceivedAt = nowIso();
    state.sourceHoldActive = false;
    state.sourceHoldReason = "NONE_GOVERNED_SOURCE_PACKET_ACCEPTED";
    state.fallbackSurfaceActive = false;
    state.fallbackSurfaceReason = "GOVERNED_SOURCE_PACKET_ACCEPTED_BUT_FIRST_FAST_SURFACE_REMAINS_VISIBLE_UNTIL_NEXT_DRAW";

    record("HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_ACCEPTED", {
      source: state.governedSourcePacketSource
    });

    requestRender("governed-source-packet");
    publishCanvasPackets("governed-source-packet");
    maybeNotifyLaunch("governed-source-packet");

    return {
      accepted: true,
      status: state.governedSourcePacketStatus,
      contract: CONTRACT,
      receipt: RECEIPT,
      surfaceWorthy: state.surfaceWorthy,
      prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receiveControlHandshake(packet, options = {}) {
    state.currentControlHandshakePacket = clonePlain(packet || {});
    state.controlHandshakeObserved = true;
    state.controlHandshakeAccepted = true;
    state.controlHandshakeStatus = "CONTROL_HANDSHAKE_ACCEPTED_NON_BLOCKING";
    state.viewControlObserved = true;

    record("HEARTH_CANVAS_HUB_CONTROL_HANDSHAKE_ACCEPTED", {
      source: options.source || "PUBLIC_API"
    });

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

  function receiveViewControlPacket(packet = {}, options = {}) {
    state.viewControlObserved = true;

    const yaw = safeNumber(packet.yaw ?? packet.longitude ?? packet.rotationY, state.yaw);
    const pitch = safeNumber(packet.pitch ?? packet.latitude ?? packet.rotationX, state.pitch);
    const scale = safeNumber(packet.scale ?? packet.zoom, state.scale);

    state.yaw = Number.isFinite(yaw) ? yaw : state.yaw;
    state.pitch = Number.isFinite(pitch) ? Math.max(-0.9, Math.min(0.9, pitch)) : state.pitch;
    state.scale = Number.isFinite(scale) ? Math.max(0.55, Math.min(2.2, scale)) : state.scale;

    record("HEARTH_CANVAS_HUB_VIEW_CONTROL_PACKET_RECEIVED", {
      source: options.source || "PUBLIC_API",
      yaw: state.yaw,
      pitch: state.pitch,
      scale: state.scale
    });

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

  function requestRender(reason = "request-render") {
    if (renderTimer || !root.setTimeout) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render(reason);
    }, 40);
  }

  function render(reason = "render") {
    state.renderCount += 1;
    drawFirstFastSurface(reason);
    return getReceiptLight();
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
      drawFirstFastSurface("resize-watch");
    }, 220);
  }

  function startAnimation(reason = "start-animation") {
    state.rotationEnabled = true;

    if (!root.requestAnimationFrame || rafId) return;

    const tick = () => {
      if (!state.rotationEnabled || state.disposed) {
        rafId = 0;
        return;
      }

      state.yaw += 0.0035;
      drawFirstFastSurface(reason);

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

  function boot(options = {}) {
    if (bootPromise && !options.force) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted && !options.force) return getReceipt();

      state.booting = true;
      state.started = true;

      publishApiAliases();
      updateDataset();

      ensureCanvasSurface(options.reason || "boot");
      admitLaunchCompanion(options.reason || "boot");
      drawFirstFastSurface(options.reason || "boot");

      state.booted = true;
      state.booting = false;

      publishCanvasPackets("boot");
      maybeNotifyLaunch("boot");

      if (root.setTimeout) {
        root.setTimeout(() => {
          drawFirstFastSurface("post-boot-120ms");
          maybeNotifyLaunch("post-boot-120ms");
        }, 120);

        root.setTimeout(() => {
          drawFirstFastSurface("post-boot-520ms");
          maybeNotifyLaunch("post-boot-520ms");
        }, 520);

        root.setTimeout(() => {
          drawFirstFastSurface("post-boot-1100ms");
          maybeNotifyLaunch("post-boot-1100ms");
        }, 1100);
      }

      if (root.addEventListener) {
        try {
          root.addEventListener("resize", scheduleResizeWatch, { passive: true });
        } catch (_error) {}
      }

      record("HEARTH_CANVAS_HUB_BOOT_COMPLETE", {
        surfaceWorthy: state.surfaceWorthy,
        prefaceDecommissionAuthorized: state.prefaceDecommissionAuthorized,
        canvasElementFound: state.canvasElementFound,
        canvasPixelVisible: state.canvasPixelVisible,
        visualPassClaimed: false
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function mount(options = {}) {
    ensureCanvasSurface(options.reason || "mount");
    drawFirstFastSurface(options.reason || "mount");
    publishCanvasPackets("mount");
    maybeNotifyLaunch("mount");
    return getReceiptLight();
  }

  function refresh(reason = "refresh") {
    ensureCanvasSurface(reason);
    drawFirstFastSurface(reason);
    publishCanvasPackets(reason);
    maybeNotifyLaunch(reason);
    return getReceipt();
  }

  function dispose(reason = "dispose") {
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

    record("HEARTH_CANVAS_HUB_DISPOSED", { reason });
    publishCanvasPackets("dispose");

    return getReceipt();
  }

  function getCanvasElement() {
    return canvasElement || findExistingCanvas();
  }

  function getPrefaceHandshakePacket(options = {}) {
    updateSurfaceProof("get-preface-handshake-packet");
    return composeLaunchHandshakePacket(options.reason || "getPrefaceHandshakePacket");
  }

  function getCanvasSurfaceWorthinessPacket(options = {}) {
    updateSurfaceProof("get-canvas-surface-worthiness-packet");
    return composeLaunchHandshakePacket(options.reason || "getCanvasSurfaceWorthinessPacket");
  }

  function getPrefaceDecommissionPacket(options = {}) {
    updateSurfaceProof("get-preface-decommission-packet");
    return composeLaunchHandshakePacket(options.reason || "getPrefaceDecommissionPacket");
  }

  function composePrefaceHandshakePacket(options = {}) {
    return getPrefaceHandshakePacket(options);
  }

  function releaseToPrefaceLaunch(options = {}) {
    updateSurfaceProof("release-to-preface-launch");
    const packet = composeLaunchHandshakePacket(options.reason || "releaseToPrefaceLaunch");
    publishCanvasPackets("release-to-preface-launch");
    maybeNotifyLaunch("release-to-preface-launch");
    return packet;
  }

  function receivePrefaceLaunchPacket(packet = {}, options = {}) {
    record("HEARTH_CANVAS_HUB_PREFACE_LAUNCH_PACKET_RECEIVED", {
      source: options.source || "PUBLIC_API",
      prefaceHoldRequired: safeBool(packet.prefaceHoldRequired, true)
    });

    publishCanvasPackets("receive-preface-launch-packet");
    maybeNotifyLaunch("receive-preface-launch-packet");

    return composeLaunchHandshakePacket("receivePrefaceLaunchPacket");
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    launchFile: LAUNCH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    mount,
    refresh,
    render,
    dispose,

    ensureCanvasSurface,
    drawFirstFastSurface,
    drawInteractiveFrame: drawFirstFastSurface,
    drawPairFrame: drawFirstFastSurface,
    requestRender,
    startAnimation,
    stopAnimation,

    receiveGovernedSourceStackPacket: consumeGovernedSourcePacket,
    consumeGovernedSourceStackPacket: consumeGovernedSourcePacket,
    acceptGovernedSourceStackPacket: consumeGovernedSourcePacket,
    receiveGovernedSourcePacket: consumeGovernedSourcePacket,
    consumeGovernedSourcePacket: consumeGovernedSourcePacket,
    acceptGovernedSourcePacket: consumeGovernedSourcePacket,
    receiveSourceStackPacket: consumeGovernedSourcePacket,
    consumeSourceStackPacket: consumeGovernedSourcePacket,
    acceptSourceStackPacket: consumeGovernedSourcePacket,
    receiveSourceTruthPacket: consumeGovernedSourcePacket,
    consumeSourceTruthPacket: consumeGovernedSourcePacket,
    receiveRouteConductorGovernedSourcePacket: consumeGovernedSourcePacket,
    consumeRouteConductorGovernedSourcePacket: consumeGovernedSourcePacket,
    receiveRouteConductorSourceStackPacket: consumeGovernedSourcePacket,
    consumeRouteConductorSourceStackPacket: consumeGovernedSourcePacket,
    receiveRouteConductorCanvasGovernedHandoffPacket: consumeGovernedSourcePacket,
    consumeRouteConductorCanvasGovernedHandoffPacket: consumeGovernedSourcePacket,

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
    receiveRouteConductorReleasePacket: consumeGovernedSourcePacket,
    consumeRouteConductorReleasePacket: consumeGovernedSourcePacket,
    receiveReleasePacket: consumeGovernedSourcePacket,
    consumeReleasePacket: consumeGovernedSourcePacket,
    acceptReleasePacket: consumeGovernedSourcePacket,
    receivePacket: consumeGovernedSourcePacket,

    receivePrefaceLaunchPacket,
    receiveCanvasLaunchPacket: receivePrefaceLaunchPacket,
    receiveLaunchPacket: receivePrefaceLaunchPacket,
    consumePrefaceLaunchPacket: receivePrefaceLaunchPacket,
    acceptPrefaceLaunchPacket: receivePrefaceLaunchPacket,

    getPrefaceHandshakePacket,
    composePrefaceHandshakePacket,
    getCanvasSurfaceWorthinessPacket,
    getPrefaceDecommissionPacket,
    releaseToPrefaceLaunch,

    getCanvasElement,
    getCanvas: getCanvasElement,
    getContext2d: () => ctx2d,

    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getSummary: getReceiptLight,
    getReport: getReceipt,
    getState: getReceiptLight,
    getStatusText,

    publishApiAliases,
    publishCanvasPackets,
    updateDataset,
    maybeNotifyLaunch,
    admitLaunchCompanion,

    supportsRealDomCanvasSurface: true,
    supportsCanvasSurfaceTruthProbe: true,
    supportsCanvasSurfaceWorthinessHandshake: true,
    supportsPrefaceDecommissionHandshake: true,
    supportsLaunchCompanionAdmission: true,
    supportsGovernedSourceStackPacket: true,
    supportsFirstFastVisible2dSurface: true,
    supportsDeferredHexRenderReceiver: true,

    ownsCanvasDrawing: true,
    ownsCanvasCreation: true,
    ownsCanvasSurfaceWorthinessAuthority: true,
    ownsLaunchCompanionAdmission: true,
    ownsPrefaceHold: false,
    ownsPrefaceDecommissionEnforcement: false,
    ownsSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsDiagnosticRail: false,
    ownsNorthF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

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
    recordError("HEARTH_CANVAS_HUB_INITIALIZATION_FAILED", error);

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
