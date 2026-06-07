// /assets/hearth/hearth.canvas.preface.launch.js
// HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_BOOT_HANDSHAKE_TNT_v1
// Full-file addition.
// Canvas Preface Launch / threshold boot handshake only.
// Purpose:
// - Attach to /assets/hearth/hearth.canvas.js without renewing the route conductor.
// - Boot or mount the Canvas Hub through public APIs only.
// - Create and hold a visible preface carrier inside the existing Hearth canvas mount.
// - Treat the preface as the initial state, not as a completed fallback planet.
// - Keep the preface present until the Canvas Hub returns a worthy governed 2D canvas surface.
// - Decommission the preface only after canvas surface, source threshold, pixel variance, and visible planet proof are all confirmed.
// - Publish a launch-threshold handshake packet for the Canvas Hub.
// - Accept a return packet from Canvas when Canvas has drawn what it can.
// - Launch only by releasing the preface hold; do not claim final readiness or visual pass.
// Does not own:
// - governed source truth
// - elevation, hydrology, terrain, material, tectonic, ocean, land/water/air truth
// - Canvas drawing of the final planet
// - Hex Surface drawing
// - route conductor authority
// - controls authority
// - diagnostic rail authority
// - F13
// - F21
// - ready text
// - final completion
// - visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_BOOT_HANDSHAKE_TNT_v1";
  const RECEIPT =
    "HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_BOOT_HANDSHAKE_RECEIPT_v1";

  const VERSION =
    "2026-06-07.hearth-canvas-preface-launch-threshold-boot-handshake-v1";

  const FILE = "/assets/hearth/hearth.canvas.preface.launch.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_CANVAS_PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const HANDSHAKE_PACKET =
    "HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_HANDSHAKE_PACKET_v1";
  const RETURN_PACKET =
    "HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_RETURN_PACKET_v1";
  const PREFACE_PACKET =
    "HEARTH_CANVAS_PREFACE_INITIAL_CARRIER_PACKET_v1";
  const RELEASE_PACKET =
    "HEARTH_CANVAS_PREFACE_DECOMMISSION_RELEASE_PACKET_v1";

  const CHECK_INTERVAL_MS = 280;
  const PREFACE_FRAME_MS = 84;
  const MAX_BOOT_ATTEMPTS = 8;

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
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
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
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
    F21_CLAIMED: false,
    F21_CLAIMED_BY_CANVAS: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const api = {};

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    canvasFile: CANVAS_FILE,
    expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,

    loaded: true,
    booted: false,
    mounted: false,
    active: false,
    disposed: false,

    prefaceState: "PREFACE_NOT_MOUNTED",
    prefaceVisible: false,
    prefaceMounted: false,
    prefaceDecommissioned: false,
    prefaceRearmedAfterLoss: false,
    prefaceCanvasFound: false,
    prefaceCanvasId: "NONE",
    prefaceCanvasSelector: "NONE",
    prefaceContext2dReady: false,
    prefaceRectNonzero: false,
    prefaceDrawCount: 0,
    prefaceFrameCount: 0,
    prefaceLastDrawReason: "NOT_DRAWN",

    canvasObserved: false,
    canvasSourcePath: "NONE",
    canvasContract: "UNKNOWN",
    canvasReceipt: "UNKNOWN",
    canvasBootApiObserved: false,
    canvasMountApiObserved: false,
    canvasRefreshApiObserved: false,
    canvasReceivePacketApiObserved: false,
    canvasReceiptApiObserved: false,

    canvasBootAttempted: false,
    canvasBootAttempts: 0,
    canvasBootStatus: "NOT_ATTEMPTED",
    canvasBootError: "NONE",

    handshakePublished: false,
    handshakeDeliveredToCanvas: false,
    handshakeDeliveryStatus: "NOT_DELIVERED",
    handshakeDeliveryMethod: "NONE",

    returnPacketObserved: false,
    returnPacketSource: "NONE",
    returnPacketStatus: "NONE",
    returnPacketCount: 0,

    launchThresholdStatus: "WAITING_BOOT",
    launchHold: true,
    launchReleased: false,
    launchReleaseReason: "NONE",
    launchReleaseCount: 0,
    launchBlockedReason: "WAITING_BOOT",
    launchFirstFailedCoordinate: "WAITING_BOOT",

    worthySurfaceConfirmed: false,
    worthySurfaceReason: "WAITING_BOOT",
    worthySurfaceScore: 0,

    canvasCarrierSurfaceReady: false,
    canvasElementFound: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasSurfaceIdentityUnified: false,

    canvasPlanetSurfaceThresholdPassed: false,
    canvasPlanetSurfaceReady: false,
    canvasVisiblePlanetProofReady: false,
    canvasVisiblePlanetProofSource: "NONE",
    canvasSourceHold: true,
    canvasSourceHoldClass: "UNKNOWN",
    canvasSourceHoldReason: "UNKNOWN",

    canvasSourceSampleCapableCount: 0,
    canvasThresholdSampleSuccessRatio: 0,
    canvasTextureBuiltFromGovernedSource: false,
    canvasTexturePixelVariancePresent: false,
    canvasPixelVisible: false,
    canvasPixelSampleStatus: "UNKNOWN",
    canvasVisiblePixelCount: 0,
    canvasPixelVariancePresent: false,
    canvasCurrentParentContractRecognized: false,

    currentCanvasReceiptStatus: "NONE",
    currentCanvasReceiptUpdatedAt: "NONE",

    checkLoopActive: false,
    checkLoopCount: 0,
    prefaceLoopActive: false,
    bootLoopActive: false,

    lastCheckAt: "NONE",
    lastPublishedAt: "NONE",
    lastReleaseAt: "NONE",
    updatedAt: "NONE",

    eventCount: 0,
    errorCount: 0,
    events: [],
    errors: [],

    recommendedNextOwner: "CANVAS_PREFACE_LAUNCH",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_PREFACE_LAUNCH_AND_WAIT_FOR_CANVAS_WORTHY_SURFACE",

    ...NO_CLAIMS
  };

  let checkTimer = 0;
  let prefaceTimer = 0;
  let lastCanvasReceipt = null;
  let lastHandshakePacket = null;
  let lastReturnPacket = null;

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

  function boolValue(value) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    return false;
  }

  function boolText(value) {
    return boolValue(value) ? "true" : "false";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return Object.assign({}, value);
      return value;
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_PREFACE_LAUNCH_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 120);
    state.eventCount = state.events.length;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_PREFACE_LAUNCH_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 80);
    state.errorCount = state.errors.length;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = root;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function setPath(path, value) {
    try {
      const parts = safeString(path).split(".");
      let cursor = root;

      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index];
        if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
        cursor = cursor[part];
      }

      cursor[parts[parts.length - 1]] = value;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) {
        return { path, value };
      }
    }

    return { path: "NONE", value: null };
  }

  function safeQuery(selector, base = doc) {
    try {
      if (!base || !isFunction(base.querySelector)) return null;
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function safeQueryAll(selector, base = doc) {
    try {
      if (!base || !isFunction(base.querySelectorAll)) return [];
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function getMount() {
    return (
      safeQuery("#hearthCanvasMount") ||
      safeQuery("[data-hearth-canvas-mount='true']") ||
      safeQuery("[data-hearth-visible-planet-mount='true']") ||
      safeQuery("[data-hearth-planet-engine-mount='true']")
    );
  }

  function getStage() {
    return (
      safeQuery("#hearthGlobeStage") ||
      safeQuery("[data-hearth-globe-stage='true']") ||
      safeQuery("[data-hearth-planet-engine-stage='true']")
    );
  }

  function setDataset(key, value) {
    try {
      if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
      doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
    } catch (_error) {}
  }

  function applyImportantStyle(node, key, value) {
    try {
      if (node && node.style && isFunction(node.style.setProperty)) {
        node.style.setProperty(key, value, "important");
      }
    } catch (_error) {}
  }

  function measurePrefaceSize() {
    const mount = getMount();
    const stage = getStage();
    let mountRect = null;
    let stageRect = null;

    try {
      mountRect = mount && isFunction(mount.getBoundingClientRect) ? mount.getBoundingClientRect() : null;
    } catch (_error) {}

    try {
      stageRect = stage && isFunction(stage.getBoundingClientRect) ? stage.getBoundingClientRect() : null;
    } catch (_error) {}

    const viewportW = root.innerWidth || 720;
    const viewportH = root.innerHeight || 720;
    const viewportSize = Math.min(viewportW, viewportH);

    const mountSize = mountRect ? Math.min(mountRect.width || 0, mountRect.height || 0) : 0;
    const stageSize = stageRect ? Math.min(stageRect.width || 0, stageRect.height || 0) : 0;

    const size =
      mountSize > 32
        ? mountSize
        : stageSize > 32
          ? Math.max(238, stageSize - 112)
          : Math.max(238, Math.min(860, viewportSize * 0.78));

    return clamp(size, 238, Math.min(920, Math.max(238, viewportSize * 0.92)));
  }

  function prepareMountForPreface() {
    const mount = getMount();
    if (!mount) return null;

    applyImportantStyle(mount, "position", "relative");
    applyImportantStyle(mount, "display", "grid");
    applyImportantStyle(mount, "place-items", "center");
    applyImportantStyle(mount, "isolation", "isolate");

    return mount;
  }

  function getOrCreatePrefaceCanvas() {
    const mount = prepareMountForPreface();
    if (!mount || !doc || !isFunction(doc.createElement)) return null;

    let canvas =
      safeQuery("canvas[data-hearth-canvas-preface='true']", mount) ||
      safeQuery("#hearthCanvasPrefaceCarrier", mount);

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvasPrefaceCarrier";
      canvas.setAttribute("data-hearth-canvas-preface", "true");
      canvas.setAttribute("data-hearth-canvas-preface-initial-state", "true");
      canvas.setAttribute("data-hearth-canvas-preface-contract", CONTRACT);
      canvas.setAttribute("data-hearth-canvas-preface-receipt", RECEIPT);
      canvas.setAttribute("aria-label", "Hearth preface carrier");
      canvas.setAttribute("role", "img");
      mount.appendChild(canvas);

      record("HEARTH_CANVAS_PREFACE_CARRIER_CREATED", {
        mountSelector: "#hearthCanvasMount"
      });
    }

    canvas.dataset.hearthCanvasPreface = "true";
    canvas.dataset.hearthCanvasPrefaceInitialState = "true";
    canvas.dataset.hearthCanvasPrefaceContract = CONTRACT;
    canvas.dataset.hearthCanvasPrefaceReceipt = RECEIPT;
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    const cssSize = measurePrefaceSize();
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const size = Math.max(238, Math.min(760, Math.round(cssSize * dpr)));

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }

    const sizeText = `${Math.round(cssSize)}px`;

    applyImportantStyle(canvas, "position", "absolute");
    applyImportantStyle(canvas, "inset", "auto");
    applyImportantStyle(canvas, "width", sizeText);
    applyImportantStyle(canvas, "height", sizeText);
    applyImportantStyle(canvas, "min-width", "238px");
    applyImportantStyle(canvas, "min-height", "238px");
    applyImportantStyle(canvas, "max-width", "100%");
    applyImportantStyle(canvas, "max-height", "calc(100svh - 144px)");
    applyImportantStyle(canvas, "aspect-ratio", "1 / 1");
    applyImportantStyle(canvas, "display", "block");
    applyImportantStyle(canvas, "border-radius", "50%");
    applyImportantStyle(canvas, "pointer-events", "none");
    applyImportantStyle(canvas, "touch-action", "none");
    applyImportantStyle(canvas, "user-select", "none");
    applyImportantStyle(canvas, "z-index", state.prefaceDecommissioned ? "0" : "20");
    applyImportantStyle(canvas, "opacity", state.prefaceDecommissioned ? "0" : "1");
    applyImportantStyle(canvas, "visibility", state.prefaceDecommissioned ? "hidden" : "visible");
    applyImportantStyle(canvas, "transition", "opacity 260ms ease, visibility 260ms ease");
    applyImportantStyle(canvas, "background", "transparent");

    state.prefaceCanvasFound = true;
    state.prefaceCanvasId = canvas.id || "hearthCanvasPrefaceCarrier";
    state.prefaceCanvasSelector = "canvas[data-hearth-canvas-preface='true']";

    return canvas;
  }

  function inspectPrefaceCanvas(canvas) {
    let rect = null;

    try {
      rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {}

    state.prefaceRectNonzero = Boolean(rect && rect.width > 0 && rect.height > 0);
    state.prefaceVisible = Boolean(!state.prefaceDecommissioned && state.prefaceRectNonzero);
  }

  function drawPreface(reason = "draw-preface") {
    const canvas = getOrCreatePrefaceCanvas();

    if (!canvas) {
      state.prefaceState = "PREFACE_MOUNT_NOT_AVAILABLE";
      state.prefaceMounted = false;
      state.prefaceContext2dReady = false;
      state.launchFirstFailedCoordinate = "PREFACE_MOUNT";
      state.launchBlockedReason = "HEARTH_CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = TARGET_ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS";
      publishAll("preface-mount-missing");
      return getReceiptLight();
    }

    let ctx = null;

    try {
      ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_firstError) {
      try {
        ctx = canvas.getContext("2d");
      } catch (error) {
        recordError("HEARTH_CANVAS_PREFACE_CONTEXT_FAILED", error);
      }
    }

    state.prefaceContext2dReady = Boolean(ctx);
    state.prefaceMounted = Boolean(ctx);
    state.mounted = Boolean(ctx);

    inspectPrefaceCanvas(canvas);

    if (!ctx) {
      state.prefaceState = "PREFACE_CONTEXT_2D_NOT_READY";
      state.launchFirstFailedCoordinate = "PREFACE_CONTEXT_2D";
      state.launchBlockedReason = "PREFACE_CONTEXT_2D_NOT_READY";
      publishAll("preface-context-missing");
      return getReceiptLight();
    }

    const w = canvas.width || 320;
    const h = canvas.height || 320;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const r = min * 0.42;
    const phase = state.prefaceFrameCount * 0.032;

    resetCtx(ctx);
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx * 0.55, cy * 0.34, min * 0.04, cx, cy, min * 0.72);
    bg.addColorStop(0, "rgba(16,43,76,1)");
    bg.addColorStop(0.42, "rgba(4,13,30,1)");
    bg.addColorStop(1, "rgba(1,4,12,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawPrefaceStars(ctx, w, h, phase);

    const globe = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.42, r * 0.04, cx, cy, r);
    globe.addColorStop(0, "rgba(54,95,128,1)");
    globe.addColorStop(0.44, "rgba(13,38,72,1)");
    globe.addColorStop(0.82, "rgba(6,18,42,1)");
    globe.addColorStop(1, "rgba(2,8,22,1)");

    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.strokeStyle = "rgba(205,232,255,.16)";

    for (let i = -3; i <= 3; i += 1) {
      const y = cy + (i / 4) * r * 0.72;
      const rx = r * Math.sqrt(Math.max(0.04, 1 - Math.pow((y - cy) / r, 2)));
      ctx.beginPath();
      ctx.ellipse(cx, y, rx, r * 0.055, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8 + phase * 0.16;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    drawPrefaceAtmosphere(ctx, cx, cy, r);

    ctx.save();
    ctx.fillStyle = "rgba(255,231,162,.92)";
    ctx.font = `${Math.max(12, Math.round(r * 0.052))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HEARTH PREFACE", cx, cy - r * 0.08);

    ctx.fillStyle = "rgba(232,241,255,.74)";
    ctx.font = `${Math.max(8, Math.round(r * 0.032))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("initial carrier held", cx, cy + r * 0.045);
    ctx.fillText("waiting for worthy canvas surface", cx, cy + r * 0.13);
    ctx.restore();

    state.prefaceState = state.prefaceDecommissioned
      ? "PREFACE_DECOMMISSIONED_AFTER_WORTHY_SURFACE"
      : "PREFACE_VISIBLE_INITIAL_STATE";
    state.prefaceDrawCount += 1;
    state.prefaceFrameCount += 1;
    state.prefaceLastDrawReason = reason;
    state.prefaceVisible = !state.prefaceDecommissioned;
    state.updatedAt = nowIso();

    canvas.dataset.hearthCanvasPrefaceState = state.prefaceState;
    canvas.dataset.hearthCanvasPrefaceVisible = String(state.prefaceVisible);
    canvas.dataset.hearthCanvasPrefaceDecommissioned = String(state.prefaceDecommissioned);
    canvas.dataset.hearthCanvasLaunchThresholdStatus = state.launchThresholdStatus;
    canvas.dataset.hearthCanvasLaunchHold = String(state.launchHold);
    canvas.dataset.hearthCanvasLaunchReleased = String(state.launchReleased);
    canvas.dataset.hearthCanvasWorthySurfaceConfirmed = String(state.worthySurfaceConfirmed);

    publishAll(reason);

    return getReceiptLight();
  }

  function resetCtx(ctx) {
    try {
      if (isFunction(ctx.resetTransform)) ctx.resetTransform();
      else ctx.setTransform(1, 0, 0, 1, 0, 0);
    } catch (_error) {
      try {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } catch (__error) {}
    }
  }

  function drawPrefaceStars(ctx, w, h, phase) {
    ctx.save();
    ctx.globalAlpha = 0.48;

    for (let i = 0; i < 72; i += 1) {
      const x = pseudo(i * 17.13) * w;
      const y = pseudo(i * 31.71) * h;
      const flicker = 0.24 + 0.22 * Math.sin(phase + i * 0.91);
      const radius = 0.55 + pseudo(i * 7.91) * 1.3;

      ctx.fillStyle = `rgba(210,238,255,${flicker})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPrefaceAtmosphere(ctx, cx, cy, r) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.005, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, r * 0.022);
    ctx.strokeStyle = "rgba(127,220,255,.24)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.035, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, r * 0.01);
    ctx.strokeStyle = "rgba(255,231,162,.13)";
    ctx.stroke();

    const glow = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.24);
    glow.addColorStop(0, "rgba(127,220,255,0)");
    glow.addColorStop(0.68, "rgba(127,220,255,.10)");
    glow.addColorStop(1, "rgba(127,220,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function pseudo(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function startPrefaceLoop(reason = "start-preface-loop") {
    if (state.prefaceLoopActive || state.disposed) return getReceiptLight();

    state.prefaceLoopActive = true;

    drawPreface(reason);

    prefaceTimer = root.setInterval(() => {
      if (state.disposed || state.prefaceDecommissioned) {
        stopPrefaceLoop("preface-decommissioned-or-disposed");
        return;
      }

      drawPreface("preface-loop");
    }, PREFACE_FRAME_MS);

    record("HEARTH_CANVAS_PREFACE_LOOP_STARTED", { reason });
    publishAll(reason);

    return getReceiptLight();
  }

  function stopPrefaceLoop(reason = "stop-preface-loop") {
    if (prefaceTimer) {
      try {
        root.clearInterval(prefaceTimer);
      } catch (_error) {}
      prefaceTimer = 0;
    }

    state.prefaceLoopActive = false;

    record("HEARTH_CANVAS_PREFACE_LOOP_STOPPED", { reason });
    publishAll(reason);

    return getReceiptLight();
  }

  function findCanvasApi() {
    const found = firstGlobal(CANVAS_ALIASES);
    const canvasApi = found.value;

    state.canvasObserved = Boolean(canvasApi);
    state.canvasSourcePath = found.path;
    state.canvasBootApiObserved = Boolean(canvasApi && (isFunction(canvasApi.boot) || isFunction(canvasApi.init) || isFunction(canvasApi.start)));
    state.canvasMountApiObserved = Boolean(canvasApi && isFunction(canvasApi.mount));
    state.canvasRefreshApiObserved = Boolean(canvasApi && isFunction(canvasApi.refresh));
    state.canvasReceivePacketApiObserved = Boolean(
      canvasApi &&
      (
        isFunction(canvasApi.receivePacket) ||
        isFunction(canvasApi.receiveCanvasViewPacket) ||
        isFunction(canvasApi.receiveCanvasHexGatePacket)
      )
    );
    state.canvasReceiptApiObserved = Boolean(
      canvasApi &&
      (
        isFunction(canvasApi.getReceiptLight) ||
        isFunction(canvasApi.getReceipt) ||
        isFunction(canvasApi.getStatus) ||
        isFunction(canvasApi.getSummary)
      )
    );

    state.canvasContract = safeString(
      canvasApi && (canvasApi.contract || canvasApi.CONTRACT || canvasApi.canvasContract),
      "UNKNOWN"
    );

    state.canvasReceipt = safeString(
      canvasApi && (canvasApi.receipt || canvasApi.RECEIPT || canvasApi.canvasReceipt),
      "UNKNOWN"
    );

    return {
      path: found.path,
      api: canvasApi
    };
  }

  function bootCanvas(reason = "boot-canvas") {
    const found = findCanvasApi();

    if (!found.api) {
      state.canvasBootAttempted = true;
      state.canvasBootStatus = "CANVAS_API_NOT_OBSERVED";
      state.canvasBootError = "CANVAS_API_NOT_OBSERVED";
      return false;
    }

    if (state.canvasBootAttempts >= MAX_BOOT_ATTEMPTS) {
      state.canvasBootStatus = "CANVAS_BOOT_ATTEMPT_LIMIT_REACHED";
      state.canvasBootError = "CANVAS_BOOT_ATTEMPT_LIMIT_REACHED";
      return false;
    }

    state.canvasBootAttempted = true;
    state.canvasBootAttempts += 1;

    try {
      const packet = composeHandshakePacket(reason);

      if (isFunction(found.api.boot)) {
        found.api.boot({ source: FILE, packet, reason });
        state.canvasBootStatus = "CANVAS_BOOT_CALLED";
      } else if (isFunction(found.api.init)) {
        found.api.init({ source: FILE, packet, reason });
        state.canvasBootStatus = "CANVAS_INIT_CALLED";
      } else if (isFunction(found.api.start)) {
        found.api.start({ source: FILE, packet, reason });
        state.canvasBootStatus = "CANVAS_START_CALLED";
      } else if (isFunction(found.api.mount)) {
        found.api.mount({ source: FILE, packet, reason });
        state.canvasBootStatus = "CANVAS_MOUNT_CALLED";
      } else {
        state.canvasBootStatus = "CANVAS_BOOT_API_NOT_AVAILABLE";
        state.canvasBootError = "CANVAS_BOOT_API_NOT_AVAILABLE";
        return false;
      }

      state.canvasBootError = "NONE";

      if (isFunction(found.api.mount)) {
        try {
          found.api.mount({ source: FILE, packet, reason: `${reason}:mount-confirm` });
        } catch (_mountError) {}
      }

      deliverHandshakeToCanvas(reason);

      record("HEARTH_CANVAS_PREFACE_CALLED_CANVAS_BOOT_API", {
        reason,
        canvasSourcePath: state.canvasSourcePath,
        canvasBootStatus: state.canvasBootStatus
      });

      return true;
    } catch (error) {
      state.canvasBootStatus = "CANVAS_BOOT_THROWN";
      state.canvasBootError = error && error.message ? String(error.message) : safeString(error);
      recordError("HEARTH_CANVAS_PREFACE_CANVAS_BOOT_FAILED", error, { reason });
      return false;
    }
  }

  function readCanvasReceipt() {
    const found = findCanvasApi();
    const canvasApi = found.api;

    if (!canvasApi) {
      lastCanvasReceipt = null;
      state.currentCanvasReceiptStatus = "CANVAS_API_NOT_OBSERVED";
      return null;
    }

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getSummary",
      "getCanvasStationReceipt",
      "getVisiblePlanetReceipt",
      "getCanvasParentReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(canvasApi[method])) continue;

      try {
        const receipt =
          method === "getReceiptLight"
            ? canvasApi[method](true)
            : canvasApi[method]();

        if (isObject(receipt)) {
          lastCanvasReceipt = receipt;
          state.currentCanvasReceiptStatus = `READ_FROM_${method}`;
          state.currentCanvasReceiptUpdatedAt = nowIso();
          return receipt;
        }
      } catch (error) {
        recordError("HEARTH_CANVAS_PREFACE_CANVAS_RECEIPT_READ_FAILED", error, { method });
      }
    }

    if (isObject(root.HEARTH_CANVAS_RECEIPT)) {
      lastCanvasReceipt = root.HEARTH_CANVAS_RECEIPT;
      state.currentCanvasReceiptStatus = "READ_FROM_GLOBAL_HEARTH_CANVAS_RECEIPT";
      state.currentCanvasReceiptUpdatedAt = nowIso();
      return lastCanvasReceipt;
    }

    state.currentCanvasReceiptStatus = "CANVAS_RECEIPT_NOT_READABLE";
    return null;
  }

  function getAny(source, keys, fallback = undefined) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return source[key];
      }

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(source)) {
        if (candidate.toLowerCase() === lower) {
          const value = source[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function normalizeCanvasReceipt(receipt) {
    const r = isObject(receipt) ? receipt : {};

    state.canvasContract = safeString(
      getAny(r, ["currentCanvasParentContract", "canvasContract", "contract", "CONTRACT"], state.canvasContract),
      "UNKNOWN"
    );

    state.canvasReceipt = safeString(
      getAny(r, ["currentCanvasParentReceipt", "canvasReceipt", "receipt", "RECEIPT"], state.canvasReceipt),
      "UNKNOWN"
    );

    state.canvasCurrentParentContractRecognized =
      state.canvasContract === EXPECTED_CANVAS_PUBLIC_CONTRACT ||
      boolValue(getAny(r, ["currentCanvasParentRecognized", "CURRENT_CANVAS_PARENT_RECOGNIZED"], false));

    state.canvasCarrierSurfaceReady = boolValue(getAny(r, [
      "carrierSurfaceReady",
      "CARRIER_SURFACE_READY",
      "carrierSurfaceProofReady",
      "CARRIER_SURFACE_PROOF_READY"
    ], false));

    state.canvasElementFound = boolValue(getAny(r, [
      "canvasElementFound",
      "CANVAS_ELEMENT_FOUND"
    ], false));

    state.canvasContext2dReady = boolValue(getAny(r, [
      "canvasContext2dReady",
      "CANVAS_CONTEXT_2D_READY"
    ], false));

    state.canvasRectNonzero = boolValue(getAny(r, [
      "canvasRectNonzero",
      "CANVAS_RECT_NONZERO"
    ], false));

    state.canvasComputedVisible = boolValue(getAny(r, [
      "canvasComputedVisible",
      "CANVAS_COMPUTED_VISIBLE"
    ], false));

    state.canvasViewportIntersecting = boolValue(getAny(r, [
      "canvasViewportIntersecting",
      "CANVAS_VIEWPORT_INTERSECTING"
    ], false));

    state.canvasSurfaceIdentityUnified = boolValue(getAny(r, [
      "surfaceIdentityUnified",
      "SURFACE_IDENTITY_UNIFIED"
    ], false));

    state.canvasPlanetSurfaceThresholdPassed = boolValue(getAny(r, [
      "planetSurfaceThresholdPassed",
      "PLANET_SURFACE_THRESHOLD_PASSED"
    ], false));

    state.canvasPlanetSurfaceReady = boolValue(getAny(r, [
      "planetSurfaceReady",
      "PLANET_SURFACE_READY"
    ], false));

    state.canvasVisiblePlanetProofReady = boolValue(getAny(r, [
      "visiblePlanetProofReady",
      "VISIBLE_PLANET_PROOF_READY"
    ], false));

    state.canvasVisiblePlanetProofSource = safeString(getAny(r, [
      "visiblePlanetProofSource",
      "VISIBLE_PLANET_PROOF_SOURCE"
    ], "NONE"), "NONE");

    state.canvasSourceHold = boolValue(getAny(r, [
      "sourceHold",
      "SOURCE_HOLD"
    ], true));

    state.canvasSourceHoldClass = safeString(getAny(r, [
      "sourceHoldClass",
      "SOURCE_HOLD_CLASS"
    ], "UNKNOWN"), "UNKNOWN");

    state.canvasSourceHoldReason = safeString(getAny(r, [
      "sourceHoldReason",
      "SOURCE_HOLD_REASON"
    ], "UNKNOWN"), "UNKNOWN");

    state.canvasSourceSampleCapableCount = safeNumber(getAny(r, [
      "sourceSampleCapableCount",
      "SOURCE_SAMPLE_CAPABLE_COUNT"
    ], 0), 0);

    state.canvasThresholdSampleSuccessRatio = safeNumber(getAny(r, [
      "thresholdSampleSuccessRatio",
      "THRESHOLD_SAMPLE_SUCCESS_RATIO"
    ], 0), 0);

    state.canvasTextureBuiltFromGovernedSource = boolValue(getAny(r, [
      "textureBuiltFromGovernedSource",
      "TEXTURE_BUILT_FROM_GOVERNED_SOURCE"
    ], false));

    state.canvasTexturePixelVariancePresent = boolValue(getAny(r, [
      "texturePixelVariancePresent",
      "TEXTURE_PIXEL_VARIANCE_PRESENT"
    ], false));

    state.canvasPixelVisible = boolValue(getAny(r, [
      "canvasPixelVisible",
      "pixelVisible",
      "CANVAS_PIXEL_VISIBLE"
    ], false));

    state.canvasPixelSampleStatus = safeString(getAny(r, [
      "canvasPixelSampleStatus",
      "pixelSampleStatus",
      "CANVAS_PIXEL_SAMPLE_STATUS"
    ], "UNKNOWN"), "UNKNOWN");

    state.canvasVisiblePixelCount = safeNumber(getAny(r, [
      "visiblePixelCount",
      "CANVAS_VISIBLE_PIXEL_COUNT"
    ], 0), 0);

    state.canvasPixelVariancePresent = boolValue(getAny(r, [
      "pixelVariancePresent",
      "PIXEL_VARIANCE_PRESENT"
    ], false));
  }

  function scoreCanvasWorthiness() {
    let score = 0;
    const failed = [];

    function pass(condition, coordinate, weight = 1) {
      if (condition) score += weight;
      else failed.push(coordinate);
    }

    pass(state.canvasObserved, "CANVAS_API_OBSERVED", 1);
    pass(state.canvasCurrentParentContractRecognized, "CANVAS_PARENT_CONTRACT_RECOGNIZED", 1);
    pass(state.canvasCarrierSurfaceReady, "CARRIER_SURFACE_READY", 1);
    pass(state.canvasElementFound, "CANVAS_ELEMENT_FOUND", 1);
    pass(state.canvasContext2dReady, "CANVAS_CONTEXT_2D_READY", 1);
    pass(state.canvasRectNonzero, "CANVAS_RECT_NONZERO", 1);
    pass(state.canvasComputedVisible, "CANVAS_COMPUTED_VISIBLE", 1);
    pass(state.canvasViewportIntersecting, "CANVAS_VIEWPORT_INTERSECTING", 1);
    pass(state.canvasSurfaceIdentityUnified, "SURFACE_IDENTITY_UNIFIED", 1);
    pass(state.canvasSourceHold === false, "SOURCE_HOLD_FALSE", 1);
    pass(state.canvasSourceSampleCapableCount >= 1, "SOURCE_SAMPLE_CAPABLE_COUNT", 1);
    pass(state.canvasThresholdSampleSuccessRatio >= 0.6, "THRESHOLD_SAMPLE_SUCCESS_RATIO", 1);
    pass(state.canvasTextureBuiltFromGovernedSource, "TEXTURE_BUILT_FROM_GOVERNED_SOURCE", 1);
    pass(state.canvasTexturePixelVariancePresent, "TEXTURE_PIXEL_VARIANCE_PRESENT", 1);
    pass(state.canvasPixelVisible, "CANVAS_PIXEL_VISIBLE", 1);
    pass(state.canvasVisiblePixelCount > 0, "VISIBLE_PIXEL_COUNT", 1);
    pass(state.canvasPixelVariancePresent, "PIXEL_VARIANCE_PRESENT", 1);
    pass(state.canvasPlanetSurfaceThresholdPassed, "PLANET_SURFACE_THRESHOLD_PASSED", 2);
    pass(state.canvasPlanetSurfaceReady, "PLANET_SURFACE_READY", 2);
    pass(state.canvasVisiblePlanetProofReady, "VISIBLE_PLANET_PROOF_READY", 2);

    const required =
      state.canvasObserved &&
      state.canvasCurrentParentContractRecognized &&
      state.canvasCarrierSurfaceReady &&
      state.canvasElementFound &&
      state.canvasContext2dReady &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible &&
      state.canvasViewportIntersecting &&
      state.canvasSurfaceIdentityUnified &&
      state.canvasSourceHold === false &&
      state.canvasSourceSampleCapableCount >= 1 &&
      state.canvasThresholdSampleSuccessRatio >= 0.6 &&
      state.canvasTextureBuiltFromGovernedSource &&
      state.canvasTexturePixelVariancePresent &&
      state.canvasPixelVisible &&
      state.canvasVisiblePixelCount > 0 &&
      state.canvasPixelVariancePresent &&
      state.canvasPlanetSurfaceThresholdPassed &&
      state.canvasPlanetSurfaceReady &&
      state.canvasVisiblePlanetProofReady;

    state.worthySurfaceScore = score;
    state.worthySurfaceConfirmed = Boolean(required);
    state.worthySurfaceReason = required
      ? "CANVAS_SURFACE_SOURCE_THRESHOLD_PIXEL_VARIANCE_AND_VISIBLE_PLANET_PROOF_CONFIRMED"
      : `WAITING_FOR_${failed[0] || "UNKNOWN"}`;

    state.launchFirstFailedCoordinate = required
      ? "NONE"
      : failed[0] || "UNKNOWN";

    return {
      worthy: Boolean(required),
      score,
      failed,
      firstFailedCoordinate: state.launchFirstFailedCoordinate
    };
  }

  function evaluateLaunchThreshold(reason = "evaluate-launch-threshold") {
    const receipt = readCanvasReceipt();
    if (receipt) normalizeCanvasReceipt(receipt);

    const result = scoreCanvasWorthiness();

    if (result.worthy) {
      state.launchThresholdStatus = "LAUNCH_THRESHOLD_PASSED";
      state.launchBlockedReason = "NONE";
      state.recommendedNextOwner = "TEACHER_REVIEW";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction =
        "REVIEW_PREFACE_DECOMMISSIONED_AFTER_WORTHY_CANVAS_SURFACE_WITH_NO_READY_OR_VISUAL_PASS_CLAIM";

      releasePreface(`threshold-passed:${reason}`);
    } else {
      state.launchThresholdStatus = "LAUNCH_HELD_PREFACE_INITIAL_STATE_ACTIVE";
      state.launchHold = true;
      state.launchReleased = false;
      state.launchBlockedReason = result.firstFailedCoordinate;
      state.recommendedNextOwner =
        result.firstFailedCoordinate === "CANVAS_API_OBSERVED"
          ? "CANVAS_BOOT_PAIR"
          : "CANVAS_HUB";
      state.recommendedNextFile =
        result.firstFailedCoordinate === "CANVAS_API_OBSERVED"
          ? CANVAS_FILE
          : CANVAS_FILE;
      state.recommendedNextAction =
        "KEEP_PREFACE_ACTIVE_AND_CONTINUE_CANVAS_BOOT_THRESHOLD_CHECK";

      if (state.prefaceDecommissioned) {
        rearmPreface(`threshold-lost:${reason}`);
      }
    }

    state.lastCheckAt = nowIso();

    publishAll(reason);

    return {
      ...result,
      launchThresholdStatus: state.launchThresholdStatus,
      launchHold: state.launchHold,
      launchReleased: state.launchReleased,
      launchBlockedReason: state.launchBlockedReason
    };
  }

  function releasePreface(reason = "release-preface") {
    if (state.launchReleased && state.prefaceDecommissioned) return getReceiptLight();

    const canvas =
      safeQuery("canvas[data-hearth-canvas-preface='true']") ||
      safeQuery("#hearthCanvasPrefaceCarrier");

    state.launchHold = false;
    state.launchReleased = true;
    state.launchReleaseReason = reason;
    state.launchReleaseCount += 1;
    state.prefaceDecommissioned = true;
    state.prefaceVisible = false;
    state.prefaceState = "PREFACE_DECOMMISSIONED_AFTER_WORTHY_SURFACE";
    state.lastReleaseAt = nowIso();

    if (canvas) {
      canvas.dataset.hearthCanvasPrefaceState = state.prefaceState;
      canvas.dataset.hearthCanvasPrefaceVisible = "false";
      canvas.dataset.hearthCanvasPrefaceDecommissioned = "true";
      canvas.dataset.hearthCanvasLaunchReleased = "true";
      canvas.dataset.hearthCanvasLaunchReleaseReason = reason;

      applyImportantStyle(canvas, "opacity", "0");
      applyImportantStyle(canvas, "visibility", "hidden");
      applyImportantStyle(canvas, "z-index", "0");
    }

    stopPrefaceLoop("release-preface");

    record("HEARTH_CANVAS_PREFACE_DECOMMISSIONED_AFTER_WORTHY_SURFACE", {
      reason,
      launchReleaseCount: state.launchReleaseCount,
      worthySurfaceScore: state.worthySurfaceScore
    });

    publishReleasePacket(reason);
    publishAll(reason);

    return getReceiptLight();
  }

  function rearmPreface(reason = "rearm-preface") {
    state.launchHold = true;
    state.launchReleased = false;
    state.prefaceDecommissioned = false;
    state.prefaceVisible = true;
    state.prefaceRearmedAfterLoss = true;
    state.prefaceState = "PREFACE_REARMED_AFTER_THRESHOLD_LOSS";

    const canvas = getOrCreatePrefaceCanvas();
    if (canvas) {
      canvas.dataset.hearthCanvasPrefaceState = state.prefaceState;
      canvas.dataset.hearthCanvasPrefaceVisible = "true";
      canvas.dataset.hearthCanvasPrefaceDecommissioned = "false";
      canvas.dataset.hearthCanvasLaunchReleased = "false";

      applyImportantStyle(canvas, "opacity", "1");
      applyImportantStyle(canvas, "visibility", "visible");
      applyImportantStyle(canvas, "z-index", "20");
    }

    startPrefaceLoop(reason);

    record("HEARTH_CANVAS_PREFACE_REARMED_AFTER_THRESHOLD_LOSS", { reason });

    publishAll(reason);

    return getReceiptLight();
  }

  function composeHandshakePacket(reason = "handshake") {
    const packet = {
      packetType: HANDSHAKE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,

      sourceAuthority: "HEARTH_CANVAS_PREFACE_LAUNCH",
      destinationAuthority: "HEARTH_CANVAS_HUB",
      reason,

      prefaceInitialStateActive: true,
      prefaceIsInitialCarrierNotCompletedFallback: true,
      prefaceMustRemainUntilWorthySurface: true,
      prefaceDecommissionOnlyAfterWorthySurface: true,

      launchThresholdOwnedByPrefaceFile: true,
      canvasDrawingOwnedByCanvasHub: true,
      canvasTruthOwnedByCanvasHub: false,
      governedSourceTruthOwnedByCanvas: false,
      productionMutationAuthorized: false,

      launchThresholdRequires: {
        canvasApiObserved: true,
        canvasParentContractRecognized: EXPECTED_CANVAS_PUBLIC_CONTRACT,
        carrierSurfaceReady: true,
        canvasElementFound: true,
        canvasContext2dReady: true,
        canvasRectNonzero: true,
        canvasComputedVisible: true,
        canvasViewportIntersecting: true,
        surfaceIdentityUnified: true,
        sourceHold: false,
        sourceSampleCapableCountMinimum: 1,
        thresholdSampleSuccessRatioMinimum: 0.6,
        textureBuiltFromGovernedSource: true,
        texturePixelVariancePresent: true,
        pixelVisible: true,
        visiblePixelCountGreaterThan: 0,
        pixelVariancePresent: true,
        planetSurfaceThresholdPassed: true,
        planetSurfaceReady: true,
        visiblePlanetProofReady: true
      },

      launchHold: state.launchHold,
      launchReleased: state.launchReleased,
      prefaceState: state.prefaceState,
      prefaceVisible: state.prefaceVisible,
      worthySurfaceConfirmed: state.worthySurfaceConfirmed,
      launchThresholdStatus: state.launchThresholdStatus,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    lastHandshakePacket = clonePlain(packet);
    state.handshakePublished = true;
    state.lastPublishedAt = nowIso();

    return packet;
  }

  function deliverHandshakeToCanvas(reason = "deliver-handshake") {
    const found = findCanvasApi();
    const canvasApi = found.api;
    const packet = composeHandshakePacket(reason);

    if (!canvasApi) {
      state.handshakeDeliveredToCanvas = false;
      state.handshakeDeliveryStatus = "CANVAS_API_NOT_OBSERVED";
      state.handshakeDeliveryMethod = "NONE";
      publishHandshakePacket(packet);
      return false;
    }

    const methods = [
      "receivePrefaceLaunchThresholdPacket",
      "receiveCanvasPrefaceLaunchPacket",
      "receiveCanvasLaunchThresholdPacket",
      "receivePacket",
      "receiveCanvasViewPacket"
    ];

    for (const method of methods) {
      if (!isFunction(canvasApi[method])) continue;

      try {
        canvasApi[method](clonePlain(packet), {
          source: FILE,
          reason,
          prefaceLaunchHandshake: true
        });

        state.handshakeDeliveredToCanvas = true;
        state.handshakeDeliveryStatus = "DELIVERED_TO_CANVAS_PUBLIC_API";
        state.handshakeDeliveryMethod = method;

        publishHandshakePacket(packet);

        record("HEARTH_CANVAS_PREFACE_HANDSHAKE_DELIVERED_TO_CANVAS", {
          reason,
          method,
          canvasSourcePath: state.canvasSourcePath
        });

        return true;
      } catch (error) {
        recordError("HEARTH_CANVAS_PREFACE_HANDSHAKE_DELIVERY_METHOD_FAILED", error, {
          method
        });
      }
    }

    state.handshakeDeliveredToCanvas = false;
    state.handshakeDeliveryStatus = "CANVAS_PUBLIC_RECEIVE_METHOD_NOT_AVAILABLE";
    state.handshakeDeliveryMethod = "NONE";
    publishHandshakePacket(packet);

    return false;
  }

  function receiveCanvasReturnPacket(packet = {}, options = {}) {
    state.returnPacketObserved = true;
    state.returnPacketCount += 1;
    state.returnPacketSource = safeString(
      packet.sourceAuthority || packet.sourceFile || options.source || "CANVAS",
      "CANVAS"
    );

    lastReturnPacket = clonePlain(packet);

    if (isObject(packet.receipt)) {
      lastCanvasReceipt = packet.receipt;
      normalizeCanvasReceipt(packet.receipt);
      state.returnPacketStatus = "RETURN_PACKET_WITH_RECEIPT_ACCEPTED";
    } else if (isObject(packet.canvasReceipt)) {
      lastCanvasReceipt = packet.canvasReceipt;
      normalizeCanvasReceipt(packet.canvasReceipt);
      state.returnPacketStatus = "RETURN_PACKET_WITH_CANVAS_RECEIPT_ACCEPTED";
    } else {
      normalizeCanvasReceipt(packet);
      state.returnPacketStatus = "RETURN_PACKET_FIELDS_ACCEPTED";
    }

    record("HEARTH_CANVAS_PREFACE_RECEIVED_CANVAS_RETURN_PACKET", {
      source: state.returnPacketSource,
      returnPacketStatus: state.returnPacketStatus
    });

    const result = evaluateLaunchThreshold("canvas-return-packet");

    publishAll("canvas-return-packet");

    return {
      packetType: RETURN_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      accepted: true,
      returnPacketStatus: state.returnPacketStatus,
      launchThresholdStatus: state.launchThresholdStatus,
      launchHold: state.launchHold,
      launchReleased: state.launchReleased,
      worthySurfaceConfirmed: state.worthySurfaceConfirmed,
      launchBlockedReason: state.launchBlockedReason,
      result,
      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function publishHandshakePacket(packet = composeHandshakePacket("publish")) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_PREFACE_LAUNCH_HANDSHAKE_PACKET = cloned;
    root.HEARTH_CANVAS_LAUNCH_THRESHOLD_HANDSHAKE_PACKET = cloned;

    hearth.canvasPrefaceLaunchHandshakePacket = cloned;
    hearth.canvasLaunchThresholdHandshakePacket = cloned;

    lab.hearthCanvasPrefaceLaunchHandshakePacket = cloned;
    lab.hearthCanvasLaunchThresholdHandshakePacket = cloned;

    try {
      if (doc && typeof root.CustomEvent === "function" && isFunction(doc.dispatchEvent)) {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-launch-handshake", { detail: cloned }));
      }
    } catch (_error) {}

    return cloned;
  }

  function publishReleasePacket(reason = "release") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const packet = {
      packetType: RELEASE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      canvasFile: CANVAS_FILE,
      reason,
      prefaceDecommissioned: state.prefaceDecommissioned,
      launchReleased: state.launchReleased,
      launchHold: state.launchHold,
      worthySurfaceConfirmed: state.worthySurfaceConfirmed,
      worthySurfaceReason: state.worthySurfaceReason,
      worthySurfaceScore: state.worthySurfaceScore,
      visiblePlanetProofReady: state.canvasVisiblePlanetProofReady,
      visualPassClaimed: false,
      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_PREFACE_RELEASE_PACKET = cloned;
    root.HEARTH_CANVAS_PREFACE_DECOMMISSION_RELEASE_PACKET = cloned;

    hearth.canvasPrefaceReleasePacket = cloned;
    hearth.canvasPrefaceDecommissionReleasePacket = cloned;

    lab.hearthCanvasPrefaceReleasePacket = cloned;
    lab.hearthCanvasPrefaceDecommissionReleasePacket = cloned;

    try {
      if (doc && typeof root.CustomEvent === "function" && isFunction(doc.dispatchEvent)) {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-preface-release", { detail: cloned }));
      }
    } catch (_error) {}

    return cloned;
  }

  function startCheckLoop(reason = "start-check-loop") {
    if (state.checkLoopActive || state.disposed) return getReceiptLight();

    state.checkLoopActive = true;
    state.active = true;

    checkTimer = root.setInterval(() => {
      if (state.disposed) {
        stopCheckLoop("disposed");
        return;
      }

      state.checkLoopCount += 1;

      if (!state.canvasObserved && state.canvasBootAttempts < MAX_BOOT_ATTEMPTS) {
        bootCanvas(`check-loop-${state.checkLoopCount}`);
      }

      evaluateLaunchThreshold(`check-loop-${state.checkLoopCount}`);

      if (state.launchReleased && state.worthySurfaceConfirmed) {
        stopCheckLoop("launch-released");
      }
    }, CHECK_INTERVAL_MS);

    record("HEARTH_CANVAS_PREFACE_CHECK_LOOP_STARTED", { reason });
    publishAll(reason);

    return getReceiptLight();
  }

  function stopCheckLoop(reason = "stop-check-loop") {
    if (checkTimer) {
      try {
        root.clearInterval(checkTimer);
      } catch (_error) {}
      checkTimer = 0;
    }

    state.checkLoopActive = false;

    record("HEARTH_CANVAS_PREFACE_CHECK_LOOP_STOPPED", { reason });
    publishAll(reason);

    return getReceiptLight();
  }

  function mount(reason = "mount") {
    drawPreface(reason);
    startPrefaceLoop(reason);

    state.mounted = true;
    state.prefaceState = state.prefaceDecommissioned
      ? "PREFACE_DECOMMISSIONED_AFTER_WORTHY_SURFACE"
      : "PREFACE_VISIBLE_INITIAL_STATE";

    publishAll(reason);

    return getReceiptLight();
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booted = true;
    state.active = true;
    state.disposed = false;
    state.launchHold = true;

    record("HEARTH_CANVAS_PREFACE_LAUNCH_BOOT_START", {
      contract: CONTRACT,
      canvasFile: CANVAS_FILE,
      expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT
    });

    publishAliasPaths();
    mount("boot");
    bootCanvas("boot");
    deliverHandshakeToCanvas("boot");
    evaluateLaunchThreshold("boot");
    startCheckLoop("boot");

    if (!state.launchReleased) startPrefaceLoop("boot-hold");

    publishAll("boot-complete");

    return getReceipt();
  }

  function refresh(reason = "refresh") {
    drawPreface(reason);
    findCanvasApi();

    if (!state.canvasObserved && state.canvasBootAttempts < MAX_BOOT_ATTEMPTS) {
      bootCanvas(reason);
    }

    deliverHandshakeToCanvas(reason);
    evaluateLaunchThreshold(reason);

    if (!state.launchReleased) {
      startPrefaceLoop(`${reason}:preface-hold`);
      startCheckLoop(`${reason}:check-loop`);
    }

    publishAll(reason);

    return getReceipt();
  }

  function dispose(reason = "dispose") {
    stopCheckLoop(reason);
    stopPrefaceLoop(reason);

    state.disposed = true;
    state.active = false;
    state.prefaceState = "PREFACE_LAUNCH_DISPOSED";
    state.recommendedNextAction = "REBOOT_PREFACE_LAUNCH_IF_CANVAS_THRESHOLD_CHECK_REQUIRED";

    record("HEARTH_CANVAS_PREFACE_LAUNCH_DISPOSED", { reason });
    publishAll(reason);

    return getReceipt();
  }

  function updateDataset() {
    setDataset("hearthCanvasPrefaceLaunchLoaded", "true");
    setDataset("hearthCanvasPrefaceLaunchContract", CONTRACT);
    setDataset("hearthCanvasPrefaceLaunchReceipt", RECEIPT);
    setDataset("hearthCanvasPrefaceLaunchVersion", VERSION);
    setDataset("hearthCanvasPrefaceLaunchFile", FILE);

    setDataset("hearthCanvasPrefaceInitialStateActive", String(!state.prefaceDecommissioned));
    setDataset("hearthCanvasPrefaceState", state.prefaceState);
    setDataset("hearthCanvasPrefaceVisible", String(state.prefaceVisible));
    setDataset("hearthCanvasPrefaceMounted", String(state.prefaceMounted));
    setDataset("hearthCanvasPrefaceDecommissioned", String(state.prefaceDecommissioned));
    setDataset("hearthCanvasPrefaceRearmedAfterLoss", String(state.prefaceRearmedAfterLoss));

    setDataset("hearthCanvasLaunchThresholdStatus", state.launchThresholdStatus);
    setDataset("hearthCanvasLaunchHold", String(state.launchHold));
    setDataset("hearthCanvasLaunchReleased", String(state.launchReleased));
    setDataset("hearthCanvasLaunchReleaseReason", state.launchReleaseReason);
    setDataset("hearthCanvasLaunchBlockedReason", state.launchBlockedReason);
    setDataset("hearthCanvasLaunchFirstFailedCoordinate", state.launchFirstFailedCoordinate);

    setDataset("hearthCanvasWorthySurfaceConfirmed", String(state.worthySurfaceConfirmed));
    setDataset("hearthCanvasWorthySurfaceReason", state.worthySurfaceReason);
    setDataset("hearthCanvasWorthySurfaceScore", String(state.worthySurfaceScore));

    setDataset("hearthCanvasPrefaceCanvasFound", String(state.prefaceCanvasFound));
    setDataset("hearthCanvasPrefaceCanvasId", state.prefaceCanvasId);
    setDataset("hearthCanvasPrefaceContext2dReady", String(state.prefaceContext2dReady));
    setDataset("hearthCanvasPrefaceRectNonzero", String(state.prefaceRectNonzero));

    setDataset("hearthCanvasLaunchCanvasObserved", String(state.canvasObserved));
    setDataset("hearthCanvasLaunchCanvasSourcePath", state.canvasSourcePath);
    setDataset("hearthCanvasLaunchCanvasContract", state.canvasContract);
    setDataset("hearthCanvasLaunchCanvasReceipt", state.canvasReceipt);
    setDataset("hearthCanvasLaunchCanvasBootStatus", state.canvasBootStatus);
    setDataset("hearthCanvasLaunchHandshakeDeliveryStatus", state.handshakeDeliveryStatus);
    setDataset("hearthCanvasLaunchReturnPacketObserved", String(state.returnPacketObserved));

    setDataset("hearthCanvasLaunchCanvasCarrierSurfaceReady", String(state.canvasCarrierSurfaceReady));
    setDataset("hearthCanvasLaunchCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasLaunchCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasLaunchCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasLaunchCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasLaunchCanvasViewportIntersecting", String(state.canvasViewportIntersecting));
    setDataset("hearthCanvasLaunchCanvasSourceHold", String(state.canvasSourceHold));
    setDataset("hearthCanvasLaunchCanvasPlanetSurfaceThresholdPassed", String(state.canvasPlanetSurfaceThresholdPassed));
    setDataset("hearthCanvasLaunchCanvasPlanetSurfaceReady", String(state.canvasPlanetSurfaceReady));
    setDataset("hearthCanvasLaunchCanvasVisiblePlanetProofReady", String(state.canvasVisiblePlanetProofReady));
    setDataset("hearthCanvasLaunchCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasLaunchCanvasPixelVariancePresent", String(state.canvasPixelVariancePresent));

    setDataset("hearthCanvasPrefaceLaunchRecommendedNextOwner", state.recommendedNextOwner);
    setDataset("hearthCanvasPrefaceLaunchRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasPrefaceLaunchRecommendedNextAction", state.recommendedNextAction);

    setDataset("hearthCanvasPrefaceLaunchF13Claimed", "false");
    setDataset("hearthCanvasPrefaceLaunchF21EligibleForNorth", "false");
    setDataset("hearthCanvasPrefaceLaunchReadyTextAllowed", "false");
    setDataset("hearthCanvasPrefaceLaunchReadyTextClaimed", "false");
    setDataset("hearthCanvasPrefaceLaunchVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function composePrefacePacket(reason = "preface") {
    return {
      packetType: PREFACE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      canvasFile: CANVAS_FILE,
      reason,

      prefaceInitialStateActive: !state.prefaceDecommissioned,
      prefaceVisible: state.prefaceVisible,
      prefaceMounted: state.prefaceMounted,
      prefaceState: state.prefaceState,
      prefaceDecommissioned: state.prefaceDecommissioned,
      prefaceIsInitialCarrierNotCompletedFallback: true,

      launchHold: state.launchHold,
      launchReleased: state.launchReleased,
      worthySurfaceConfirmed: state.worthySurfaceConfirmed,
      launchThresholdStatus: state.launchThresholdStatus,
      launchBlockedReason: state.launchBlockedReason,

      composedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeDiagnosticFields() {
    return {
      PREFACE_LAUNCH_FILE: FILE,
      PREFACE_LAUNCH_CONTRACT: CONTRACT,
      PREFACE_LAUNCH_RECEIPT: RECEIPT,
      PREFACE_LAUNCH_VERSION: VERSION,

      CANVAS_FILE,
      EXPECTED_CANVAS_PUBLIC_CONTRACT,
      CANVAS_OBSERVED: boolText(state.canvasObserved),
      CANVAS_SOURCE_PATH: state.canvasSourcePath,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_RECEIPT: state.canvasReceipt,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: boolText(state.canvasCurrentParentContractRecognized),

      PREFACE_IS_INITIAL_STATE: "true",
      PREFACE_VISIBLE: boolText(state.prefaceVisible),
      PREFACE_MOUNTED: boolText(state.prefaceMounted),
      PREFACE_DECOMMISSIONED: boolText(state.prefaceDecommissioned),
      PREFACE_STATE: state.prefaceState,
      PREFACE_CANVAS_FOUND: boolText(state.prefaceCanvasFound),
      PREFACE_CONTEXT_2D_READY: boolText(state.prefaceContext2dReady),
      PREFACE_RECT_NONZERO: boolText(state.prefaceRectNonzero),
      PREFACE_DRAW_COUNT: String(state.prefaceDrawCount),

      LAUNCH_THRESHOLD_STATUS: state.launchThresholdStatus,
      LAUNCH_HOLD: boolText(state.launchHold),
      LAUNCH_RELEASED: boolText(state.launchReleased),
      LAUNCH_RELEASE_REASON: state.launchReleaseReason,
      LAUNCH_BLOCKED_REASON: state.launchBlockedReason,
      LAUNCH_FIRST_FAILED_COORDINATE: state.launchFirstFailedCoordinate,
      WORTHY_SURFACE_CONFIRMED: boolText(state.worthySurfaceConfirmed),
      WORTHY_SURFACE_REASON: state.worthySurfaceReason,
      WORTHY_SURFACE_SCORE: String(state.worthySurfaceScore),

      CANVAS_CARRIER_SURFACE_READY: boolText(state.canvasCarrierSurfaceReady),
      CANVAS_ELEMENT_FOUND: boolText(state.canvasElementFound),
      CANVAS_CONTEXT_2D_READY: boolText(state.canvasContext2dReady),
      CANVAS_RECT_NONZERO: boolText(state.canvasRectNonzero),
      CANVAS_COMPUTED_VISIBLE: boolText(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: boolText(state.canvasViewportIntersecting),
      CANVAS_SURFACE_IDENTITY_UNIFIED: boolText(state.canvasSurfaceIdentityUnified),
      CANVAS_SOURCE_HOLD: boolText(state.canvasSourceHold),
      CANVAS_SOURCE_HOLD_CLASS: state.canvasSourceHoldClass,
      CANVAS_SOURCE_HOLD_REASON: state.canvasSourceHoldReason,
      CANVAS_SOURCE_SAMPLE_CAPABLE_COUNT: String(state.canvasSourceSampleCapableCount),
      CANVAS_THRESHOLD_SAMPLE_SUCCESS_RATIO: String(state.canvasThresholdSampleSuccessRatio),
      CANVAS_TEXTURE_BUILT_FROM_GOVERNED_SOURCE: boolText(state.canvasTextureBuiltFromGovernedSource),
      CANVAS_TEXTURE_PIXEL_VARIANCE_PRESENT: boolText(state.canvasTexturePixelVariancePresent),
      CANVAS_PIXEL_VISIBLE: boolText(state.canvasPixelVisible),
      CANVAS_VISIBLE_PIXEL_COUNT: String(state.canvasVisiblePixelCount),
      CANVAS_PIXEL_VARIANCE_PRESENT: boolText(state.canvasPixelVariancePresent),
      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PLANET_SURFACE_THRESHOLD_PASSED: boolText(state.canvasPlanetSurfaceThresholdPassed),
      CANVAS_PLANET_SURFACE_READY: boolText(state.canvasPlanetSurfaceReady),
      CANVAS_VISIBLE_PLANET_PROOF_READY: boolText(state.canvasVisiblePlanetProofReady),
      CANVAS_VISIBLE_PLANET_PROOF_SOURCE: state.canvasVisiblePlanetProofSource,

      HANDSHAKE_PUBLISHED: boolText(state.handshakePublished),
      HANDSHAKE_DELIVERED_TO_CANVAS: boolText(state.handshakeDeliveredToCanvas),
      HANDSHAKE_DELIVERY_STATUS: state.handshakeDeliveryStatus,
      HANDSHAKE_DELIVERY_METHOD: state.handshakeDeliveryMethod,
      RETURN_PACKET_OBSERVED: boolText(state.returnPacketObserved),
      RETURN_PACKET_STATUS: state.returnPacketStatus,
      RETURN_PACKET_COUNT: String(state.returnPacketCount),

      CHECK_LOOP_ACTIVE: boolText(state.checkLoopActive),
      CHECK_LOOP_COUNT: String(state.checkLoopCount),
      PREFACE_LOOP_ACTIVE: boolText(state.prefaceLoopActive),

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByCanvas: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      finalVisualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function getReceiptLight() {
    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_PREFACE_LAUNCH_RECEIPT_PACKET",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,

      loaded: state.loaded,
      booted: state.booted,
      mounted: state.mounted,
      active: state.active,
      disposed: state.disposed,

      prefaceInitialStateActive: !state.prefaceDecommissioned,
      prefaceIsInitialCarrierNotCompletedFallback: true,
      prefaceMustRemainUntilWorthySurface: true,
      prefaceDecommissionOnlyAfterWorthySurface: true,
      prefaceState: state.prefaceState,
      prefaceVisible: state.prefaceVisible,
      prefaceMounted: state.prefaceMounted,
      prefaceDecommissioned: state.prefaceDecommissioned,
      prefaceRearmedAfterLoss: state.prefaceRearmedAfterLoss,
      prefaceCanvasFound: state.prefaceCanvasFound,
      prefaceCanvasId: state.prefaceCanvasId,
      prefaceCanvasSelector: state.prefaceCanvasSelector,
      prefaceContext2dReady: state.prefaceContext2dReady,
      prefaceRectNonzero: state.prefaceRectNonzero,
      prefaceDrawCount: state.prefaceDrawCount,
      prefaceFrameCount: state.prefaceFrameCount,
      prefaceLastDrawReason: state.prefaceLastDrawReason,

      canvasObserved: state.canvasObserved,
      canvasSourcePath: state.canvasSourcePath,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,
      canvasCurrentParentContractRecognized: state.canvasCurrentParentContractRecognized,
      canvasBootApiObserved: state.canvasBootApiObserved,
      canvasMountApiObserved: state.canvasMountApiObserved,
      canvasRefreshApiObserved: state.canvasRefreshApiObserved,
      canvasReceivePacketApiObserved: state.canvasReceivePacketApiObserved,
      canvasReceiptApiObserved: state.canvasReceiptApiObserved,
      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootStatus: state.canvasBootStatus,
      canvasBootError: state.canvasBootError,

      handshakePublished: state.handshakePublished,
      handshakeDeliveredToCanvas: state.handshakeDeliveredToCanvas,
      handshakeDeliveryStatus: state.handshakeDeliveryStatus,
      handshakeDeliveryMethod: state.handshakeDeliveryMethod,

      returnPacketObserved: state.returnPacketObserved,
      returnPacketSource: state.returnPacketSource,
      returnPacketStatus: state.returnPacketStatus,
      returnPacketCount: state.returnPacketCount,

      launchThresholdStatus: state.launchThresholdStatus,
      launchHold: state.launchHold,
      launchReleased: state.launchReleased,
      launchReleaseReason: state.launchReleaseReason,
      launchReleaseCount: state.launchReleaseCount,
      launchBlockedReason: state.launchBlockedReason,
      launchFirstFailedCoordinate: state.launchFirstFailedCoordinate,

      worthySurfaceConfirmed: state.worthySurfaceConfirmed,
      worthySurfaceReason: state.worthySurfaceReason,
      worthySurfaceScore: state.worthySurfaceScore,

      canvasCarrierSurfaceReady: state.canvasCarrierSurfaceReady,
      canvasElementFound: state.canvasElementFound,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasSurfaceIdentityUnified: state.canvasSurfaceIdentityUnified,
      canvasSourceHold: state.canvasSourceHold,
      canvasSourceHoldClass: state.canvasSourceHoldClass,
      canvasSourceHoldReason: state.canvasSourceHoldReason,
      canvasSourceSampleCapableCount: state.canvasSourceSampleCapableCount,
      canvasThresholdSampleSuccessRatio: state.canvasThresholdSampleSuccessRatio,
      canvasTextureBuiltFromGovernedSource: state.canvasTextureBuiltFromGovernedSource,
      canvasTexturePixelVariancePresent: state.canvasTexturePixelVariancePresent,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasPixelVariancePresent: state.canvasPixelVariancePresent,
      canvasPlanetSurfaceThresholdPassed: state.canvasPlanetSurfaceThresholdPassed,
      canvasPlanetSurfaceReady: state.canvasPlanetSurfaceReady,
      canvasVisiblePlanetProofReady: state.canvasVisiblePlanetProofReady,
      canvasVisiblePlanetProofSource: state.canvasVisiblePlanetProofSource,

      checkLoopActive: state.checkLoopActive,
      checkLoopCount: state.checkLoopCount,
      prefaceLoopActive: state.prefaceLoopActive,

      currentCanvasReceiptStatus: state.currentCanvasReceiptStatus,
      currentCanvasReceiptUpdatedAt: state.currentCanvasReceiptUpdatedAt,

      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      diagnosticFields,
      ...diagnosticFields,

      ownsPrefaceInitialCarrier: true,
      ownsLaunchThreshold: true,
      ownsCanvasBootHandshake: true,
      ownsCanvasDrawing: false,
      ownsCanvasTruth: false,
      ownsGovernedSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsDiagnostics: false,
      ownsReadyText: false,
      ownsFinalVisualPass: false,

      lastCheckAt: state.lastCheckAt,
      lastPublishedAt: state.lastPublishedAt,
      lastReleaseAt: state.lastReleaseAt,
      updatedAt: nowIso(),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      lastCanvasReceipt: clonePlain(lastCanvasReceipt),
      lastHandshakePacket: clonePlain(lastHandshakePacket),
      lastReturnPacket: clonePlain(lastReturnPacket),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_BOOT_HANDSHAKE_RECEIPT",
      "",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("canvasFile", CANVAS_FILE),
      line("expectedCanvasPublicContract", EXPECTED_CANVAS_PUBLIC_CONTRACT),
      "",
      "PREFACE",
      line("prefaceInitialStateActive", r.prefaceInitialStateActive),
      line("prefaceIsInitialCarrierNotCompletedFallback", true),
      line("prefaceState", r.prefaceState),
      line("prefaceVisible", r.prefaceVisible),
      line("prefaceMounted", r.prefaceMounted),
      line("prefaceDecommissioned", r.prefaceDecommissioned),
      line("prefaceCanvasFound", r.prefaceCanvasFound),
      line("prefaceContext2dReady", r.prefaceContext2dReady),
      line("prefaceRectNonzero", r.prefaceRectNonzero),
      line("prefaceDrawCount", r.prefaceDrawCount),
      "",
      "CANVAS",
      line("canvasObserved", r.canvasObserved),
      line("canvasSourcePath", r.canvasSourcePath),
      line("canvasContract", r.canvasContract),
      line("canvasCurrentParentContractRecognized", r.canvasCurrentParentContractRecognized),
      line("canvasBootStatus", r.canvasBootStatus),
      line("canvasCarrierSurfaceReady", r.canvasCarrierSurfaceReady),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      line("canvasSourceHold", r.canvasSourceHold),
      line("canvasPlanetSurfaceThresholdPassed", r.canvasPlanetSurfaceThresholdPassed),
      line("canvasPlanetSurfaceReady", r.canvasPlanetSurfaceReady),
      line("canvasVisiblePlanetProofReady", r.canvasVisiblePlanetProofReady),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasPixelVariancePresent", r.canvasPixelVariancePresent),
      "",
      "LAUNCH",
      line("launchThresholdStatus", r.launchThresholdStatus),
      line("launchHold", r.launchHold),
      line("launchReleased", r.launchReleased),
      line("launchReleaseReason", r.launchReleaseReason),
      line("launchBlockedReason", r.launchBlockedReason),
      line("launchFirstFailedCoordinate", r.launchFirstFailedCoordinate),
      line("worthySurfaceConfirmed", r.worthySurfaceConfirmed),
      line("worthySurfaceReason", r.worthySurfaceReason),
      line("worthySurfaceScore", r.worthySurfaceScore),
      "",
      "HANDSHAKE",
      line("handshakePublished", r.handshakePublished),
      line("handshakeDeliveredToCanvas", r.handshakeDeliveredToCanvas),
      line("handshakeDeliveryStatus", r.handshakeDeliveryStatus),
      line("handshakeDeliveryMethod", r.handshakeDeliveryMethod),
      line("returnPacketObserved", r.returnPacketObserved),
      line("returnPacketStatus", r.returnPacketStatus),
      "",
      "NEXT",
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
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

  function getState() {
    return {
      ...clonePlain(state),
      lastCanvasReceipt: clonePlain(lastCanvasReceipt),
      lastHandshakePacket: clonePlain(lastHandshakePacket),
      lastReturnPacket: clonePlain(lastReturnPacket),
      diagnosticFields: composeDiagnosticFields(),
      ...NO_CLAIMS
    };
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    setPath("HEARTH_CANVAS_PREFACE_LAUNCH", api);
    setPath("HEARTH_CANVAS_LAUNCH_THRESHOLD", api);
    setPath("HEARTH_CANVAS_PREFACE_LAUNCH_THRESHOLD_BOOT_HANDSHAKE", api);

    setPath("HEARTH.canvasPrefaceLaunch", api);
    setPath("HEARTH.canvasLaunchThreshold", api);
    setPath("HEARTH.canvasPrefaceLaunchThresholdBootHandshake", api);

    setPath("DEXTER_LAB.hearthCanvasPrefaceLaunch", api);
    setPath("DEXTER_LAB.hearthCanvasLaunchThreshold", api);
    setPath("DEXTER_LAB.hearthCanvasPrefaceLaunchThresholdBootHandshake", api);

    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const receipt = getReceiptLight();
    const prefacePacket = composePrefacePacket("receipt-publication");

    root.HEARTH_CANVAS_PREFACE_LAUNCH_RECEIPT = receipt;
    root.HEARTH_CANVAS_LAUNCH_THRESHOLD_RECEIPT = receipt;
    root.HEARTH_CANVAS_PREFACE_PACKET = prefacePacket;
    root.HEARTH_CANVAS_PREFACE_LAUNCH_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

    hearth.canvasPrefaceLaunchReceipt = receipt;
    hearth.canvasLaunchThresholdReceipt = receipt;
    hearth.canvasPrefacePacket = prefacePacket;
    hearth.canvasPrefaceLaunchDiagnosticFields = clonePlain(receipt.diagnosticFields);

    lab.hearthCanvasPrefaceLaunchReceipt = receipt;
    lab.hearthCanvasLaunchThresholdReceipt = receipt;
    lab.hearthCanvasPrefacePacket = prefacePacket;
    lab.hearthCanvasPrefaceLaunchDiagnosticFields = clonePlain(receipt.diagnosticFields);

    return true;
  }

  function publishAll(reason = "publish") {
    updateDataset();
    publishAliasPaths();
    publishReceiptAliases();
    publishHandshakePacket(composeHandshakePacket(reason));

    state.lastPublishedAt = nowIso();

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    canvasFile: CANVAS_FILE,
    expectedCanvasPublicContract: EXPECTED_CANVAS_PUBLIC_CONTRACT,

    handshakePacket: HANDSHAKE_PACKET,
    returnPacket: RETURN_PACKET,
    prefacePacket: PREFACE_PACKET,
    releasePacket: RELEASE_PACKET,

    boot,
    init: boot,
    start: boot,
    run: boot,
    mount,
    refresh,
    dispose,

    drawPreface,
    startPrefaceLoop,
    stopPrefaceLoop,
    startCheckLoop,
    stopCheckLoop,

    findCanvasApi,
    bootCanvas,
    readCanvasReceipt,
    normalizeCanvasReceipt,
    scoreCanvasWorthiness,
    evaluateLaunchThreshold,
    releasePreface,
    rearmPreface,

    composeHandshakePacket,
    composePrefacePacket,
    publishHandshakePacket,
    publishReleasePacket,
    deliverHandshakeToCanvas,
    receiveCanvasReturnPacket,
    receiveCanvasLaunchReturnPacket: receiveCanvasReturnPacket,
    receiveCanvasThresholdReturnPacket: receiveCanvasReturnPacket,
    receiveCanvasSurfaceWorthyPacket: receiveCanvasReturnPacket,

    getReceipt,
    getReceiptLight,
    getStatus: getReceiptLight,
    getSummary: getReceiptLight,
    getReport: getReceipt,
    getState,
    getReceiptText,
    composeDiagnosticFields,

    publishAll,
    publishAliasPaths,
    publishReceiptAliases,
    updateDataset,

    supportsCanvasBootHandshake: true,
    supportsPrefaceInitialCarrier: true,
    supportsLaunchThreshold: true,
    supportsCanvasReturnPacket: true,
    supportsPrefaceDecommissionAfterWorthySurface: true,
    supportsPrefaceRearmAfterThresholdLoss: true,

    ownsPrefaceInitialCarrier: true,
    ownsLaunchThreshold: true,
    ownsCanvasBootHandshake: true,
    ownsCanvasDrawing: false,
    ownsCanvasTruth: false,
    ownsGovernedSourceTruth: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsDiagnostics: false,
    ownsReadyText: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishAll("immediate-publication");

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
    recordError("HEARTH_CANVAS_PREFACE_LAUNCH_INITIALIZATION_FAILED", error);

    try {
      publishAll("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
