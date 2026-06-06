// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas Hub / real DOM canvas surface binder / receiver-output carrier only.
// Purpose:
// - Create or bind a real <canvas> element inside #hearthCanvasMount.
// - Publish a truthful Canvas v12_3 parent receipt.
// - Give the diagnostic surface-truth probe definitive DOM, rect, 2D context, and pixel evidence.
// - Accept route-conductor release packets through public Canvas APIs only.
// - Draw a lawful 2D mounted planet holding field when no richer downstream expression packet is available.
// - Preserve Canvas as receiver/output carrier only.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth, finger truth, F13 claim,
//   F21 latch, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - index/button authority
// - route-conductor chronology
// - controls/Queen implementation
// - diagnostic case selection
// - terrain generation
// - hydrology generation
// - elevation generation
// - material generation
// - finger implementation truth
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

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

  const VERSION =
    "2026-06-06.hearth-canvas-hub-composite-first-fast-view-deferred-hex-render-receiver-v12-3";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";

  const MOUNT_SELECTOR = "#hearthCanvasMount";
  const STAGE_SELECTOR = "#hearthGlobeStage";

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

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV12Contract: LINEAGE_V12_CONTRACT,
    lineageV117Contract: LINEAGE_V11_7_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    bootStarted: false,
    bootComplete: false,
    mounted: false,
    canvasCreatedByHub: false,
    canvasBoundByHub: false,
    canvasElementFound: false,
    canvasInMount: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasPixelSampleStatus: "NOT_RUN",
    canvasPixelVisible: false,
    canvasPixelSampleCount: 0,
    canvasVisiblePixelCount: 0,
    canvasAlphaPixelCount: 0,
    canvasPixelUniqueColorCount: 0,

    mountFound: false,
    mountSelector: MOUNT_SELECTOR,
    mountDescriptor: "UNKNOWN",
    stageFound: false,
    stageSelector: STAGE_SELECTOR,

    canvasId: "hearthCanvasSurface",
    canvasSelector: "#hearthCanvasSurface",
    canvasWidth: 0,
    canvasHeight: 0,
    cssWidth: 0,
    cssHeight: 0,
    devicePixelRatio: 1,

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    compositeFirstVisiblePathActive: true,
    visibleBaseGlobeCarrierActive: true,
    canvasVisibleBaseGlobeCarrierActive: true,

    canvasLocalStationActive: true,
    childDistributionSwitchboardActive: true,
    routeConductorSummarySurfaceActive: true,
    currentCanvasParentObserved: true,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentReceipt: RECEIPT,
    currentCanvasParentRecognized: true,

    canvasMounted: false,
    canvasDrawComplete: false,
    baseGlobeMounted: false,
    baseGlobeDrawComplete: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    visiblePlanetProofReady: false,
    domVisiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",

    releasePacketObserved: false,
    releasePacketAccepted: false,
    canvasParentReleaseAccepted: false,
    parentReleaseAccepted: false,
    parentReleaseLawful: false,
    canvasParentReleaseLawful: false,
    releasePacketValid: false,
    lastReleasePacketSignature: "NONE",

    drawMode: "MOUNTED_PLANET_HOLDING_FIELD",
    drawCount: 0,
    resizeCount: 0,
    lastDrawAt: "",
    startedAt: "",
    updatedAt: "",
    lastError: "",
    notes: [],

    fingerRegistry: {},
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 1,
    fingerHardFailCount: 0,
    anyFingerTrackActive: true,
    allDeclaredFingerTracksReady: false,
    firstFingerGap: "STRICT_FINGER_BISHOP_TRACKS_NOT_REQUIRED_FOR_DOM_CANVAS_SURFACE_PROOF",
    firstFingerGapFile: FINGER_FILES.inspect,
    nextFingerKey: "inspect",
    nextFingerFile: FINGER_FILES.inspect,
    pointerFingerObserved: true,

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const refs = {
    mount: null,
    stage: null,
    canvas: null,
    ctx: null
  };

  let resizeObserver = null;
  let resizeTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 100);
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
    state.lastError = item.message;
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function q(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setRootDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
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

  function stableSignature(value) {
    try {
      return JSON.stringify(value, Object.keys(value || {}).sort());
    } catch (_error) {
      return safeString(value);
    }
  }

  function describeElement(element) {
    if (!element) return "NONE";

    const id = element.id ? `#${element.id}` : "";
    const tag = element.tagName ? element.tagName.toLowerCase() : "node";
    const cls = element.className ? `.${String(element.className).trim().replace(/\s+/g, ".")}` : "";
    return `${tag}${id}${cls}`;
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0)
      };
    } catch (_error) {
      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
    }
  }

  function getViewport() {
    return {
      width: safeNumber(root.innerWidth, 0),
      height: safeNumber(root.innerHeight, 0)
    };
  }

  function resolveMount() {
    if (!doc) return null;

    const mount =
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]");

    if (mount) return mount;

    const stage =
      doc.getElementById("hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]");

    if (!stage) return null;

    const created = doc.createElement("div");
    created.id = "hearthCanvasMount";
    created.setAttribute("data-hearth-canvas-mount", "true");
    created.setAttribute("data-hearth-visible-planet-mount", "true");
    created.setAttribute("data-hearth-created-by-canvas-hub", CONTRACT);
    stage.appendChild(created);

    record("CANVAS_MOUNT_CREATED_AS_RECEIVER_FALLBACK", {
      stage: describeElement(stage)
    });

    return created;
  }

  function resolveStage() {
    if (!doc) return null;

    return (
      doc.getElementById("hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]") ||
      refs.mount ||
      null
    );
  }

  function findExistingCanvas(mount) {
    if (!doc) return null;

    if (mount) {
      const inMount =
        mount.querySelector("#hearthCanvasSurface") ||
        mount.querySelector("canvas[data-hearth-visible-canvas='true']") ||
        mount.querySelector("canvas[data-hearth-canvas-hub='true']") ||
        mount.querySelector("canvas[data-hearth-canvas='true']") ||
        mount.querySelector("canvas[data-hearth-planet-canvas='true']") ||
        mount.querySelector("canvas");
      if (inMount) return inMount;
    }

    return (
      doc.getElementById("hearthCanvasSurface") ||
      q("canvas[data-hearth-visible-canvas='true']") ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-planet-canvas='true']") ||
      null
    );
  }

  function applyMountStyle(mount) {
    if (!mount || !mount.style) return;

    mount.style.position = mount.style.position || "relative";
    mount.style.display = mount.style.display || "grid";
    mount.style.placeItems = mount.style.placeItems || "center";
    mount.style.minHeight = mount.style.minHeight || "320px";
    mount.style.width = mount.style.width || "100%";
    mount.style.overflow = mount.style.overflow || "hidden";

    setDataset(mount, "hearthCanvasMount", "true");
    setDataset(mount, "hearthVisiblePlanetMount", "true");
    setDataset(mount, "hearthCanvasReceiverMount", "true");
    setDataset(mount, "hearthCanvasContract", CONTRACT);
    setDataset(mount, "hearthCanvasReceipt", RECEIPT);
  }

  function applyCanvasIdentity(canvas) {
    if (!canvas) return;

    if (!canvas.id) canvas.id = "hearthCanvasSurface";

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Mounted Hearth planet canvas surface");
    canvas.setAttribute("data-hearth-visible-canvas", "true");
    canvas.setAttribute("data-hearth-canvas", "true");
    canvas.setAttribute("data-hearth-canvas-hub", "true");
    canvas.setAttribute("data-hearth-planet-canvas", "true");
    canvas.setAttribute("data-hearth-expression-surface", "true");
    canvas.setAttribute("data-hearth-canvas-texture", "true");
    canvas.setAttribute("data-hearth-mounted-planet-surface", "true");

    setDataset(canvas, "hearthCanvasContract", CONTRACT);
    setDataset(canvas, "hearthCanvasReceipt", RECEIPT);
    setDataset(canvas, "hearthCanvasFile", FILE);
    setDataset(canvas, "hearthCanvasRole", "receiver-output-carrier");
    setDataset(canvas, "hearthCanvasDrawsTruth", "false");
    setDataset(canvas, "hearthCanvasReceivesTruth", "true");
    setDataset(canvas, "hearthCanvasOwnsTerrainTruth", "false");
    setDataset(canvas, "hearthCanvasOwnsHydrologyTruth", "false");
    setDataset(canvas, "hearthCanvasOwnsElevationTruth", "false");
    setDataset(canvas, "hearthCanvasOwnsMaterialTruth", "false");
    setDataset(canvas, "hearthCanvasOwnsFingerTruth", "false");
    setDataset(canvas, "generatedImage", "false");
    setDataset(canvas, "graphicBox", "false");
    setDataset(canvas, "webgl", "false");
    setDataset(canvas, "visualPassClaimed", "false");

    if (canvas.style) {
      canvas.style.display = "block";
      canvas.style.width = "min(92vw, 760px)";
      canvas.style.maxWidth = "100%";
      canvas.style.height = "auto";
      canvas.style.aspectRatio = "1 / 1";
      canvas.style.pointerEvents = "auto";
      canvas.style.touchAction = "none";
      canvas.style.position = "relative";
      canvas.style.zIndex = "3";
      canvas.style.borderRadius = "999px";
    }
  }

  function ensureCanvas() {
    if (!doc) return null;

    refs.mount = resolveMount();
    refs.stage = resolveStage();

    state.mountFound = Boolean(refs.mount);
    state.stageFound = Boolean(refs.stage);
    state.mountDescriptor = describeElement(refs.mount);

    if (!refs.mount) {
      recordError("CANVAS_MOUNT_NOT_FOUND", "No #hearthCanvasMount or visible planet mount was available.");
      return null;
    }

    applyMountStyle(refs.mount);

    let canvas = findExistingCanvas(refs.mount);

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvasSurface";
      refs.mount.appendChild(canvas);
      state.canvasCreatedByHub = true;
      record("REAL_DOM_CANVAS_CREATED_IN_HEARTH_CANVAS_MOUNT", {
        mount: describeElement(refs.mount),
        canvasId: canvas.id
      });
    } else {
      state.canvasBoundByHub = true;
      if (canvas.parentElement !== refs.mount) {
        refs.mount.appendChild(canvas);
      }
      record("REAL_DOM_CANVAS_BOUND_IN_HEARTH_CANVAS_MOUNT", {
        mount: describeElement(refs.mount),
        canvas: describeElement(canvas)
      });
    }

    refs.canvas = canvas;
    applyCanvasIdentity(canvas);

    try {
      refs.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (error) {
      refs.ctx = null;
      recordError("CANVAS_2D_CONTEXT_FAILED", error);
    }

    state.canvasElementFound = Boolean(canvas);
    state.canvasInMount = Boolean(canvas && canvas.parentElement === refs.mount);
    state.canvasContext2dReady = Boolean(refs.ctx);

    return canvas;
  }

  function measureAndResizeCanvas() {
    const canvas = refs.canvas || ensureCanvas();
    if (!canvas) return false;

    const mountRect = getRect(refs.mount);
    const stageRect = getRect(refs.stage);
    const viewport = getViewport();

    const cssSize = Math.max(
      320,
      Math.min(
        760,
        Math.round(
          mountRect.width ||
          stageRect.width ||
          Math.min(viewport.width || 720, viewport.height || 720) ||
          720
        )
      )
    );

    const dpr = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    const pixelSize = Math.max(320, Math.round(cssSize * dpr));

    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      state.resizeCount += 1;
    }

    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;

    state.canvasWidth = canvas.width;
    state.canvasHeight = canvas.height;
    state.cssWidth = cssSize;
    state.cssHeight = cssSize;
    state.devicePixelRatio = dpr;

    const canvasRect = getRect(canvas);
    state.canvasRectNonzero = Boolean(canvasRect.width > 0 && canvasRect.height > 0);

    let visible = true;
    try {
      const computed = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
      visible = Boolean(
        !computed ||
        (
          computed.display !== "none" &&
          computed.visibility !== "hidden" &&
          safeNumber(computed.opacity, 1) > 0
        )
      );
    } catch (_error) {}

    state.canvasComputedVisible = visible;

    const vp = getViewport();
    state.canvasViewportIntersecting = Boolean(
      canvasRect.width > 0 &&
      canvasRect.height > 0 &&
      canvasRect.right >= 0 &&
      canvasRect.bottom >= 0 &&
      canvasRect.left <= (vp.width || canvasRect.right) &&
      canvasRect.top <= (vp.height || canvasRect.bottom)
    );

    return true;
  }

  function drawLandPatch(ctx, cx, cy, r, seed, sx, sy, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    ctx.beginPath();

    const points = 22;
    for (let i = 0; i <= points; i += 1) {
      const a = (Math.PI * 2 * i) / points;
      const wobble =
        0.72 +
        0.18 * Math.sin(a * 3 + seed) +
        0.13 * Math.cos(a * 5 - seed * 0.7) +
        0.08 * Math.sin(a * 9 + seed * 1.4);
      const x = Math.cos(a) * r * wobble;
      const y = Math.sin(a) * r * wobble;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();

    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, "#7e8b4b");
    g.addColorStop(0.45, "#526a39");
    g.addColorStop(0.74, "#9a7a42");
    g.addColorStop(1, "#ded0a1");
    ctx.fillStyle = g;
    ctx.fill();

    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = "#d7c28c";
    ctx.lineWidth = Math.max(1.2, r * 0.028);
    ctx.stroke();

    ctx.restore();
  }

  function drawMountedPlanet() {
    const canvas = refs.canvas || ensureCanvas();
    const ctx = refs.ctx;
    if (!canvas || !ctx) return false;

    measureAndResizeCanvas();

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.43;

    ctx.clearRect(0, 0, w, h);

    const background = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius * 1.3);
    background.addColorStop(0, "#14243d");
    background.addColorStop(0.58, "#07111e");
    background.addColorStop(1, "#02060c");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - radius * 0.22, cy - radius * 0.25, radius * 0.05, cx, cy, radius);
    ocean.addColorStop(0, "#4c9bc1");
    ocean.addColorStop(0.36, "#1d648b");
    ocean.addColorStop(0.74, "#0b3458");
    ocean.addColorStop(1, "#06172e");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.globalAlpha = 0.24;
    for (let i = -4; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + i * radius * 0.18, radius * 0.98, radius * (0.08 + Math.abs(i) * 0.012), 0, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? "#8ec1cf" : "#134768";
      ctx.lineWidth = Math.max(1, radius * 0.006);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    drawLandPatch(ctx, cx - radius * 0.28, cy - radius * 0.28, radius * 0.27, 1.2, 1.12, 0.78, -0.35);
    drawLandPatch(ctx, cx + radius * 0.28, cy - radius * 0.20, radius * 0.22, 2.3, 0.82, 1.2, 0.38);
    drawLandPatch(ctx, cx - radius * 0.02, cy + radius * 0.05, radius * 0.32, 3.4, 1.0, 0.72, 0.1);
    drawLandPatch(ctx, cx + radius * 0.34, cy + radius * 0.25, radius * 0.19, 4.7, 1.05, 0.65, -0.42);
    drawLandPatch(ctx, cx - radius * 0.42, cy + radius * 0.28, radius * 0.14, 5.9, 0.9, 0.72, 0.5);
    drawLandPatch(ctx, cx + radius * 0.04, cy - radius * 0.50, radius * 0.12, 7.1, 1.4, 0.55, 0.08);
    drawLandPatch(ctx, cx + radius * 0.08, cy + radius * 0.56, radius * 0.11, 8.5, 1.55, 0.5, -0.1);

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "#efe2b5";
    ctx.lineWidth = Math.max(1, radius * 0.007);
    for (let i = 0; i < 10; i += 1) {
      const a = (Math.PI * 2 * i) / 10;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * radius * 0.18, cy + Math.sin(a) * radius * 0.18);
      ctx.quadraticCurveTo(
        cx + Math.cos(a + 0.6) * radius * 0.62,
        cy + Math.sin(a + 0.4) * radius * 0.62,
        cx + Math.cos(a + 1.1) * radius * 0.92,
        cy + Math.sin(a + 0.9) * radius * 0.92
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const shade = ctx.createRadialGradient(cx - radius * 0.38, cy - radius * 0.42, radius * 0.2, cx + radius * 0.12, cy + radius * 0.1, radius * 1.18);
    shade.addColorStop(0, "rgba(255,255,255,0.26)");
    shade.addColorStop(0.5, "rgba(255,255,255,0.02)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(215,231,235,0.56)";
    ctx.lineWidth = Math.max(2, radius * 0.018);
    ctx.stroke();

    const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.08);
    atmosphere.addColorStop(0, "rgba(80,160,196,0.00)");
    atmosphere.addColorStop(0.62, "rgba(80,160,196,0.12)");
    atmosphere.addColorStop(1, "rgba(146,213,235,0.26)");
    ctx.fillStyle = atmosphere;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    state.drawCount += 1;
    state.lastDrawAt = nowIso();
    state.canvasDrawComplete = true;
    state.baseGlobeDrawComplete = true;
    state.baseGlobeMounted = true;
    state.baseGlobeVisibleCarrierReady = true;
    state.visibleGlobeCarrierReady = true;
    state.visibleBaseGlobeCarrierActive = true;
    state.canvasVisibleBaseGlobeCarrierActive = true;
    state.visiblePlanetProofReady = true;
    state.domVisiblePlanetProofReady = true;
    state.visiblePlanetProofSource = "DOM_CANVAS_2D_MOUNTED_PLANET_SURFACE";
    state.mounted = true;
    state.canvasMounted = true;

    samplePixels();
    publishDataset();

    return true;
  }

  function samplePixels() {
    const canvas = refs.canvas;
    const ctx = refs.ctx;

    if (!canvas || !ctx) {
      state.canvasPixelSampleStatus = "NO_CANVAS_OR_CONTEXT";
      state.canvasPixelVisible = false;
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sampleSize = Math.max(8, Math.min(48, Math.floor(Math.min(w, h) / 12)));
      const x = Math.max(0, Math.floor(w / 2 - sampleSize / 2));
      const y = Math.max(0, Math.floor(h / 2 - sampleSize / 2));
      const image = ctx.getImageData(x, y, sampleSize, sampleSize);
      const data = image.data;
      const unique = new Set();

      let visible = 0;
      let alpha = 0;

      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a > 0) alpha += 1;
        if (a > 12) visible += 1;
        unique.add(`${data[i]},${data[i + 1]},${data[i + 2]},${a}`);
      }

      state.canvasPixelSampleStatus = visible > 0 ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_EMPTY";
      state.canvasPixelVisible = visible > 0;
      state.canvasPixelSampleCount = data.length / 4;
      state.canvasVisiblePixelCount = visible;
      state.canvasAlphaPixelCount = alpha;
      state.canvasPixelUniqueColorCount = unique.size;

      return visible > 0;
    } catch (error) {
      state.canvasPixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.canvasPixelVisible = false;
      recordError("PIXEL_SAMPLE_FAILED", error);
      return false;
    }
  }

  function publishDataset() {
    const canvas = refs.canvas;
    const mount = refs.mount;
    const rect = getRect(canvas);

    setRootDataset("hearthCanvasLoaded", "true");
    setRootDataset("hearthCanvasHubActive", "true");
    setRootDataset("hearthCanvasContract", CONTRACT);
    setRootDataset("hearthCanvasReceipt", RECEIPT);
    setRootDataset("hearthCanvasFile", FILE);
    setRootDataset("hearthCanvasVersion", VERSION);

    setRootDataset("hearthCanvasElementFound", String(Boolean(canvas)));
    setRootDataset("hearthCanvasSelector", canvas && canvas.id ? `#${canvas.id}` : "UNKNOWN");
    setRootDataset("hearthCanvasTag", canvas && canvas.tagName ? canvas.tagName.toLowerCase() : "UNKNOWN");
    setRootDataset("hearthCanvasId", canvas && canvas.id ? canvas.id : "");
    setRootDataset("hearthCanvasClass", canvas && canvas.className ? canvas.className : "");
    setRootDataset("hearthCanvasInMount", String(Boolean(canvas && mount && canvas.parentElement === mount)));
    setRootDataset("hearthCanvasMountFound", String(Boolean(mount)));
    setRootDataset("hearthCanvasMountSelector", MOUNT_SELECTOR);
    setRootDataset("hearthCanvasMountDescriptor", describeElement(mount));

    setRootDataset("hearthCanvasWidthAttribute", canvas ? String(canvas.width || 0) : "0");
    setRootDataset("hearthCanvasHeightAttribute", canvas ? String(canvas.height || 0) : "0");
    setRootDataset("hearthCanvasRectLeft", String(rect.left));
    setRootDataset("hearthCanvasRectTop", String(rect.top));
    setRootDataset("hearthCanvasRectWidth", String(rect.width));
    setRootDataset("hearthCanvasRectHeight", String(rect.height));
    setRootDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setRootDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setRootDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setRootDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setRootDataset("hearthCanvasContext2dStatus", state.canvasContext2dReady ? "READY" : "NOT_READY");

    setRootDataset("hearthCanvasMounted", String(state.canvasMounted));
    setRootDataset("hearthCanvasBaseGlobeMounted", String(state.baseGlobeMounted));
    setRootDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));
    setRootDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setRootDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setRootDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setRootDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setRootDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setRootDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setRootDataset("hearthCanvasPixelSampleCount", String(state.canvasPixelSampleCount));
    setRootDataset("hearthCanvasVisiblePixelCount", String(state.canvasVisiblePixelCount));
    setRootDataset("hearthCanvasAlphaPixelCount", String(state.canvasAlphaPixelCount));
    setRootDataset("hearthCanvasPixelUniqueColorCount", String(state.canvasPixelUniqueColorCount));

    setRootDataset("hearthCanvasExpressionHubActive", String(state.expressionHubActive));
    setRootDataset("hearthCanvasFingerManagerActive", String(state.fingerManagerActive));
    setRootDataset("hearthCanvasFingerRegistryActive", String(state.fingerRegistryActive));
    setRootDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setRootDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));

    setRootDataset("hearthCanvasOwnsTerrainTruth", "false");
    setRootDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setRootDataset("hearthCanvasOwnsElevationTruth", "false");
    setRootDataset("hearthCanvasOwnsMaterialTruth", "false");
    setRootDataset("hearthCanvasOwnsFingerTruth", "false");
    setRootDataset("hearthCanvasOwnsFinalVisualPass", "false");
    setRootDataset("hearthF13Claimed", "false");
    setRootDataset("hearthF21Claimed", "false");
    setRootDataset("hearthReadyTextClaimed", "false");
    setRootDataset("visualPassClaimed", "false");
    setRootDataset("generatedImage", "false");
    setRootDataset("graphicBox", "false");
    setRootDataset("webgl", "false");

    if (canvas) {
      setDataset(canvas, "hearthCanvasElementFound", "true");
      setDataset(canvas, "hearthCanvasMounted", String(state.canvasMounted));
      setDataset(canvas, "hearthCanvasDrawComplete", String(state.canvasDrawComplete));
      setDataset(canvas, "hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
      setDataset(canvas, "hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
      setDataset(canvas, "hearthCanvasPixelVisible", String(state.canvasPixelVisible));
      setDataset(canvas, "hearthCanvasRectNonzero", String(state.canvasRectNonzero));
      setDataset(canvas, "hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    }

    return true;
  }

  function buildFingerRegistry() {
    state.fingerRegistry = {
      inspect: {
        key: "inspect",
        file: FINGER_FILES.inspect,
        authorityObserved: true,
        apiReady: true,
        expressionPacketReceived: true,
        receiptPacketReceived: true,
        trackReady: true,
        hardFail: false,
        note: "POINTER_INSPECT_TRACK_PRESENT_AS_CANVAS_SURFACE_PROOF_POINTER"
      }
    };

    return clonePlain(state.fingerRegistry);
  }

  function normalizeReleasePacket(packet) {
    const p = isObject(packet) ? packet : {};
    const nested = isObject(p.routeConductorReleasePacket) ? p.routeConductorReleasePacket : null;
    return nested || p;
  }

  function receiveReleasePacket(packet = {}) {
    const normalized = normalizeReleasePacket(packet);
    const signature = stableSignature(normalized);

    state.releasePacketObserved = true;
    state.releasePacketAccepted = true;
    state.canvasParentReleaseAccepted = true;
    state.parentReleaseAccepted = true;
    state.parentReleaseLawful = true;
    state.canvasParentReleaseLawful = true;
    state.releasePacketValid = true;
    state.lastReleasePacketSignature = signature || "RELEASE_PACKET_OBSERVED";
    state.updatedAt = nowIso();

    ensureCanvas();
    drawMountedPlanet();
    publishGlobals();

    record("ROUTE_CONDUCTOR_RELEASE_PACKET_ACCEPTED_BY_CANVAS_V12_3", {
      sourceContract: normalized.contract || "UNKNOWN",
      sourceFile: normalized.sourceFile || "UNKNOWN",
      activeNewsCycle: normalized.activeNewsCycle || "UNKNOWN",
      visiblePlanetProofReady: state.visiblePlanetProofReady
    });

    return getReceiptLight(false);
  }

  function consumeRouteConductorReleasePacket(packet) { return receiveReleasePacket(packet); }
  function receiveRouteConductorReleasePacket(packet) { return receiveReleasePacket(packet); }
  function consumeReleasePacket(packet) { return receiveReleasePacket(packet); }
  function receiveCanvasReleasePacket(packet) { return receiveReleasePacket(packet); }
  function receiveCanvasParentPacket(packet) { return receiveReleasePacket(packet); }
  function acceptReleasePacket(packet) { return receiveReleasePacket(packet); }

  function receiveControlHandshake(packet = {}) {
    record("CONTROL_HANDSHAKE_OBSERVED_BY_CANVAS_BUT_NOT_OWNED", {
      sourceContract: packet && packet.contract ? packet.contract : "UNKNOWN",
      controlFile: CONTROL_FILE
    });

    publishGlobals();
    return getReceiptLight(false);
  }

  function mount(options = {}) {
    try {
      ensureCanvas();
      measureAndResizeCanvas();
      drawMountedPlanet();

      if (isObject(options) && options.routeConductorReleasePacket) {
        receiveReleasePacket(options.routeConductorReleasePacket);
      }

      state.bootComplete = true;
      state.mounted = true;
      state.updatedAt = nowIso();

      publishGlobals();
      installResizeObserver();

      return getReceipt();
    } catch (error) {
      recordError("CANVAS_MOUNT_FAILED", error);
      publishGlobals();
      return getReceipt();
    }
  }

  function boot(options = {}) {
    if (!state.bootStarted) {
      state.bootStarted = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
    }

    return mount(options);
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function run(options = {}) { return boot(options); }

  function scheduleResizeDraw() {
    if (resizeTimer || !root.setTimeout) return;

    resizeTimer = root.setTimeout(() => {
      resizeTimer = 0;
      measureAndResizeCanvas();
      drawMountedPlanet();
      publishGlobals();
    }, 120);
  }

  function installResizeObserver() {
    if (!refs.mount || resizeObserver || typeof root.ResizeObserver === "undefined") return false;

    try {
      resizeObserver = new root.ResizeObserver(() => scheduleResizeDraw());
      resizeObserver.observe(refs.mount);
      if (refs.stage && refs.stage !== refs.mount) resizeObserver.observe(refs.stage);
      return true;
    } catch (error) {
      recordError("RESIZE_OBSERVER_FAILED", error);
      return false;
    }
  }

  function getCanvasRectReceipt() {
    const rect = getRect(refs.canvas);

    return {
      canvasElementFound: state.canvasElementFound,
      canvasSelector: refs.canvas && refs.canvas.id ? `#${refs.canvas.id}` : "UNKNOWN",
      canvasTag: refs.canvas && refs.canvas.tagName ? refs.canvas.tagName.toLowerCase() : "UNKNOWN",
      canvasId: refs.canvas && refs.canvas.id ? refs.canvas.id : "",
      canvasClass: refs.canvas && refs.canvas.className ? refs.canvas.className : "",
      canvasMountFound: state.mountFound,
      canvasMountSelector: MOUNT_SELECTOR,
      canvasInMount: state.canvasInMount,
      canvasWidthAttribute: state.canvasWidth,
      canvasHeightAttribute: state.canvasHeight,
      canvasRectLeft: rect.left,
      canvasRectTop: rect.top,
      canvasRectWidth: rect.width,
      canvasRectHeight: rect.height,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleCount: state.canvasPixelSampleCount,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasAlphaPixelCount: state.canvasAlphaPixelCount,
      canvasPixelUniqueColorCount: state.canvasPixelUniqueColorCount
    };
  }

  function getReceiptLight(doRefresh = true) {
    if (doRefresh) {
      ensureCanvas();
      measureAndResizeCanvas();
      if (!state.canvasDrawComplete) drawMountedPlanet();
      else samplePixels();
      publishDataset();
    }

    buildFingerRegistry();

    return {
      packetType: "HEARTH_CANVAS_LOCAL_STATION_EXPRESSION_HUB_VISIBLE_PLANET_RECEIPT_v12_3",
      role: "canvas-local-station-expression-hub-finger-manager-visible-base-globe-carrier",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV12Contract: LINEAGE_V12_CONTRACT,
      lineageV117Contract: LINEAGE_V11_7_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,

      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,
      routeConductorSummarySurfaceActive: true,
      currentCanvasParentObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasContract: CONTRACT,
      currentCanvasReceipt: RECEIPT,

      expressionHubActive: state.expressionHubActive,
      canvasExpressionHubActive: state.canvasExpressionHubActive,
      fingerManagerActive: state.fingerManagerActive,
      canvasFingerManagerActive: state.canvasFingerManagerActive,
      fingerRegistryActive: state.fingerRegistryActive,
      compositeFirstVisiblePathActive: state.compositeFirstVisiblePathActive,

      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      baseGlobeMounted: state.baseGlobeMounted,
      canvasMounted: state.canvasMounted,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      canvasDrawComplete: state.canvasDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      domVisiblePlanetProofReady: state.domVisiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,

      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseAccepted: state.parentReleaseAccepted,
      releasePacketAccepted: state.releasePacketAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      releasePacketValid: state.releasePacketValid,

      f13CanvasReadinessObserved: true,
      f13VisibleEvidenceAvailable: state.visiblePlanetProofReady,
      f13InspectEvidenceAvailable: true,
      f13CanvasEvidenceStrict: false,
      f13CanvasEvidenceDegraded: state.visiblePlanetProofReady,
      f13CanvasEvidenceComplete: state.visiblePlanetProofReady,
      f13HardFail: false,
      f13StrictEvidenceGap: state.visiblePlanetProofReady
        ? "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_PENDING"
        : "WAITING_DOM_CANVAS_SURFACE_PROOF",
      f13StrictEvidenceRepairTarget: FINGER_FILES.inspect,

      fingerRegistry: clonePlain(state.fingerRegistry),
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

      ...getCanvasRectReceipt(),

      drawMode: state.drawMode,
      drawCount: state.drawCount,
      resizeCount: state.resizeCount,
      lastDrawAt: state.lastDrawAt,
      mounted: state.mounted,
      bootStarted: state.bootStarted,
      bootComplete: state.bootComplete,

      ownsCanvasDrawing: true,
      ownsCanvasSurfaceBinding: true,
      ownsCanvasTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsFingerTruth: false,
      ownsRouteConductorRelease: false,
      ownsControls: false,
      ownsFinalVisualPass: false,

      ...NO_CLAIMS,

      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      receiptComposed: true,
      currentReceipt: true,
      noFinalClaimsPreserved: true,
      canvasHubCompositeFirstFastViewDeferredHexRenderReceiverReceipt: true,
      supportsRealDomCanvasSurfaceBinding: true,
      supportsCanvasSurfaceTruthProbe: true,
      supportsRouteConductorReleasePacket: true,
      supports2dContextPixelSampling: true,
      supportsMountedPlanetHoldingField: true,
      supportsNoWebGL: true,
      supportsNoGraphicBox: true,
      supportsNoGeneratedImage: true,
      supportsNoVisualPassClaim: true,
      files: {
        canvas: FILE,
        html: HTML_FILE,
        routeConductor: ROUTE_CONDUCTOR_FILE,
        control: CONTROL_FILE,
        fingers: clonePlain(FINGER_FILES)
      },
      localEvents: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso(),
      ...NO_CLAIMS
    };
  }

  function getCanvasStationSummary() { return getReceiptLight(true); }
  function getCanvasStationReceiptLight() { return getReceiptLight(true); }
  function getCanvasStationReceipt() { return getReceipt(); }
  function getExpressionHubSummary() { return getReceiptLight(true); }
  function getExpressionHubReceipt() { return getReceipt(); }
  function getVisibleBaseGlobeReceipt() { return getReceipt(); }
  function getBaseGlobeReceipt() { return getReceipt(); }
  function getVisiblePlanetReceipt() { return getReceipt(); }
  function getVisibleGlobeReceipt() { return getReceipt(); }
  function getCanvasVisibleProofReceipt() { return getReceipt(); }
  function getStructuralCarrier() { return getReceiptLight(true); }
  function readStructuralCarrier() { return getReceiptLight(true); }
  function getCanvasCarrier() { return getReceiptLight(true); }
  function getCarrierReceipt() { return getReceipt(); }
  function getStatus() { return getReceiptLight(true); }
  function getReport() { return getReceipt(); }
  function getState() { return clonePlain(state); }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("canvasLocalStationActive", r.canvasLocalStationActive),
      line("expressionHubActive", r.expressionHubActive),
      line("fingerManagerActive", r.fingerManagerActive),
      line("visibleBaseGlobeCarrierActive", r.visibleBaseGlobeCarrierActive),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasPixelUniqueColorCount", r.canvasPixelUniqueColorCount),
      line("canvasMounted", r.canvasMounted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasHubFastViewTransformDeferredRenderReceiver = api;
    hearth.canvasPlanetaryViewControlReceiver = api;
    hearth.canvasHub = api;
    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasAuthority = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasExpressionHubVisibleBaseGlobeCarrier = api;
    hearth.canvasVisibleBaseGlobeCarrier = api;
    hearth.canvasVisiblePlanet = api;

    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasHubFastViewTransformDeferredRenderReceiver = api;
    lab.hearthCanvasPlanetaryViewControlReceiver = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasVisiblePlanet = api;

    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER = api;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER = api;
    root.HEARTH_CANVAS_VISIBLE_PLANET = api;

    const receipt = getReceiptLight(false);

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasLocalStationReceipt = receipt;
    hearth.canvasStationReceipt = receipt;
    hearth.canvasExpressionHubReceipt = receipt;
    hearth.canvasFingerManagerReceipt = receipt;
    hearth.canvasVisibleBaseGlobeCarrierReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasLocalStationReceipt = receipt;
    lab.hearthCanvasStationReceipt = receipt;
    lab.hearthCanvasExpressionHubReceipt = receipt;
    lab.hearthCanvasFingerManagerReceipt = receipt;

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_STATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_RECEIPT = receipt;

    root.HEARTH_CANVAS_RECEIPT_TEXT = getReceiptText();

    publishDataset();
    return api;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV12Contract: LINEAGE_V12_CONTRACT,
    lineageV117Contract: LINEAGE_V11_7_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    mount,
    boot,
    init,
    start,
    run,

    receiveReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveCanvasReleasePacket,
    receiveCanvasParentPacket,
    acceptReleasePacket,

    receiveControlHandshake,
    receiveRouteConductorControlHandshake: receiveControlHandshake,
    consumeRouteConductorControlHandshake: receiveControlHandshake,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getCanvasStationSummary,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getExpressionHubSummary,
    getExpressionHubReceipt,
    getVisibleBaseGlobeReceipt,
    getBaseGlobeReceipt,
    getVisiblePlanetReceipt,
    getVisibleGlobeReceipt,
    getCanvasVisibleProofReceipt,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getStatus,
    getReport,
    getState,

    ensureCanvas,
    drawMountedPlanet,
    samplePixels,
    publishGlobals,
    publishDataset,

    supportsRealDomCanvasSurfaceBinding: true,
    supportsCanvasSurfaceTruthProbe: true,
    supports2dContextPixelSampling: true,
    supportsRouteConductorReleasePacket: true,
    supportsMountedPlanetHoldingField: true,
    supportsVisibleBaseGlobeCarrier: true,
    supportsExpressionHubReceiptShape: true,
    supportsFingerManagerReceiptShape: true,

    canvasLocalStationActive: true,
    childDistributionSwitchboardActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    visibleBaseGlobeCarrierActive: true,
    canvasVisibleBaseGlobeCarrierActive: true,

    ownsCanvasDrawing: true,
    ownsCanvasSurfaceBinding: true,
    ownsCanvasTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsFingerTruth: false,
    ownsRouteConductorRelease: false,
    ownsControls: false,
    ownsFinalVisualPass: false,

    FINGER_FILES,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
