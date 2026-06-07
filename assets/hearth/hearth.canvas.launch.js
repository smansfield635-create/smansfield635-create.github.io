// /assets/hearth/hearth.canvas.launch.js
// HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_TNT_v1
// Full-file replacement.
// Canvas Launch / DOM surface preface holder only.
// Purpose:
// - Create or bind a real DOM canvas surface under the Hearth visible mount.
// - Prove CANVAS_ELEMENT_FOUND_TRUE without claiming final Canvas truth.
// - Preserve route conductor, controls, governed source, Hex, pointer-finger, and diagnostic boundaries.
// - Hold a lightweight preface surface until /assets/hearth/hearth.canvas.js consumes governed source truth.
// - Expose public handoff APIs that /assets/hearth/hearth.canvas.js may read or drain.
// - Keep any visible preface lawful as PREFACE_HELD / DOM_SURFACE_AVAILABLE_ONLY.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - route conductor authority
// - index/button authority
// - diagnostic rail case selection
// - controls/motion truth
// - terrain/elevation/composition/tectonics/hydrology/material truth
// - final Canvas rendering
// - Hex rendering
// - pointer-finger implementation
// - F21 latch
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT = "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_RECEIPT_v1";
  const VERSION = "2026-06-07.hearth-canvas-launch-dom-surface-preface-holder-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.launch.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const CANVAS_MOUNT_SELECTOR = "#hearthCanvasMount";
  const GLOBE_STAGE_SELECTOR = "#hearthGlobeStage";
  const LAUNCH_CANVAS_ID = "hearthCanvasLaunchSurface";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasLaunch: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvasLaunch: false,
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

  const DOWNSTREAM_CANVAS_ALIASES = Object.freeze([
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
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
    "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const DOWNSTREAM_CANVAS_RECEIVERS = Object.freeze([
    "receiveGovernedSourceStackPacket",
    "consumeGovernedSourceStackPacket",
    "acceptGovernedSourceStackPacket",
    "receiveGovernedSourcePacket",
    "consumeGovernedSourcePacket",
    "acceptGovernedSourcePacket",
    "receiveSourceStackPacket",
    "consumeSourceStackPacket",
    "acceptSourceStackPacket",
    "receiveSourceTruthPacket",
    "consumeSourceTruthPacket",
    "receiveRouteConductorGovernedSourcePacket",
    "consumeRouteConductorGovernedSourcePacket",
    "receiveRouteConductorSourceStackPacket",
    "consumeRouteConductorSourceStackPacket",
    "receiveRouteConductorCanvasGovernedHandoffPacket",
    "consumeRouteConductorCanvasGovernedHandoffPacket",
    "receiveCanvasLaunchPrefacePacket",
    "consumeCanvasLaunchPrefacePacket"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    canvasFile: CANVAS_FILE,

    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "CANVAS_LAUNCH_LOADED",

    launchPrefaceActive: true,
    launchPrefaceDecommissioned: false,
    domSurfaceCreatedOrBound: false,
    domSurfaceProofReady: false,
    domSurfaceProofScope: "PREFACE_DOM_CANVAS_ONLY",
    finalCanvasTruthClaimed: false,

    canvasMountFound: false,
    canvasMountSelector: CANVAS_MOUNT_SELECTOR,
    canvasElementFound: false,
    canvasCreatedByLaunch: false,
    canvasBoundByLaunch: false,
    canvasSelector: "UNKNOWN",
    canvasId: "",
    canvasInMount: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasContext2DReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasVisiblePixelCount: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasCssWidth: 0,
    canvasCssHeight: 0,

    governedSourcePacketHeld: false,
    governedSourcePacketForwardedToCanvas: false,
    governedSourcePacketForwardStatus: "NOT_REQUESTED",
    governedSourcePacketForwardMethod: "NONE",
    governedSourcePacketForwardReason: "NOT_REQUESTED",
    latestGovernedSourcePacket: null,
    latestCanvasLaunchPrefacePacket: null,

    downstreamCanvasObserved: false,
    downstreamCanvasSourcePath: "NONE",
    downstreamCanvasContract: "UNKNOWN",

    receiptPublishCount: 0,
    renderCount: 0,
    eventCount: 0,
    errorCount: 0,
    events: [],
    errors: [],

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS
  };

  let bootPromise = null;
  let resizeTimer = 0;

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
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_LAUNCH_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 120);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_LAUNCH_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 80);
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
      const key = parts[index];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function q(selector, context = doc) {
    if (!context || !isFunction(context.querySelector)) return null;

    try {
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector, context = doc) {
    if (!context || !isFunction(context.querySelectorAll)) return [];

    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function scriptByPath(path) {
    if (!doc) return null;

    return qa("script[src]").find((script) => {
      const src = safeString(script.getAttribute("src"), "");

      try {
        const base = root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com";
        const url = new URL(src, base);
        return url.pathname === path || url.pathname.endsWith(path);
      } catch (_error) {
        return src.includes(path);
      }
    }) || null;
  }

  function readField(source, keys, fallback = "") {
    const object = isObject(source) ? source : {};

    for (const key of keys) {
      if (object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];

      const lower = key.toLowerCase();

      for (const candidate of Object.keys(object)) {
        if (candidate.toLowerCase() === lower) {
          const value = object[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || authority === api || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getCanvasLaunchReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(authority) {
    const receipt = readAuthorityReceipt(authority) || {};

    return safeString(
      readField(receipt, [
        "currentCanvasParentContract",
        "canvasContract",
        "contract",
        "CONTRACT"
      ], authority && (authority.contract || authority.CONTRACT)) || "UNKNOWN",
      "UNKNOWN"
    );
  }

  function findMount() {
    if (!doc) return null;

    return (
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]") ||
      doc.getElementById("hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]") ||
      null
    );
  }

  function findCanvas(mount) {
    if (!doc) return null;

    const selectors = [
      `#${LAUNCH_CANVAS_ID}`,
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-canvas-launch-preface='true']",
      "canvas[data-hearth-expression-surface='true']",
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas[data-hearth-planet-canvas='true']"
    ];

    for (const selector of selectors) {
      const canvas = q(selector, mount || doc) || q(selector, doc);
      if (canvas) return canvas;
    }

    return null;
  }

  function setCanvasAttributes(canvas, createdByLaunch) {
    if (!canvas || !isFunction(canvas.setAttribute)) return;

    if (!canvas.id) canvas.id = LAUNCH_CANVAS_ID;

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth canvas launch preface surface");
    canvas.dataset.hearthCanvasLaunchPreface = "true";
    canvas.dataset.hearthCanvasLaunchContract = CONTRACT;
    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthPlanetCanvas = "true";
    canvas.dataset.hearthDomSurfaceTruth = "preface";
    canvas.dataset.hearthDomSurfaceOwner = "canvas-launch-preface";
    canvas.dataset.hearthFinalCanvasTruthClaimed = "false";
    canvas.dataset.f13Claimed = "false";
    canvas.dataset.f21Claimed = "false";
    canvas.dataset.readyTextClaimed = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";

    if (createdByLaunch) canvas.dataset.createdByHearthCanvasLaunch = "true";

    const style = canvas.style;
    if (style) {
      if (!style.display) style.display = "block";
      if (!style.width) style.width = "100%";
      if (!style.height) style.height = "100%";
      if (!style.maxWidth) style.maxWidth = "100%";
      if (!style.touchAction) style.touchAction = "none";
    }
  }

  function measureElement(element) {
    let rect = null;

    try {
      rect = element && isFunction(element.getBoundingClientRect) ? element.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    return {
      width: safeNumber(rect && rect.width, 0),
      height: safeNumber(rect && rect.height, 0)
    };
  }

  function ensureCanvasSize(canvas, mount) {
    if (!canvas) {
      return {
        width: 0,
        height: 0,
        cssWidth: 0,
        cssHeight: 0,
        resized: false
      };
    }

    const mountMeasure = measureElement(mount);
    const canvasMeasure = measureElement(canvas);

    const cssWidth = Math.max(
      240,
      Math.round(mountMeasure.width || canvasMeasure.width || canvas.clientWidth || 640)
    );

    const cssHeight = Math.max(
      240,
      Math.round(mountMeasure.height || canvasMeasure.height || canvas.clientHeight || 640)
    );

    const dpr = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    const width = Math.max(240, Math.round(cssWidth * dpr));
    const height = Math.max(240, Math.round(cssHeight * dpr));

    const resized = canvas.width !== width || canvas.height !== height;

    if (resized) {
      canvas.width = width;
      canvas.height = height;
    }

    return {
      width,
      height,
      cssWidth,
      cssHeight,
      resized
    };
  }

  function canvasLooksBlank(canvas) {
    if (!canvas || !isFunction(canvas.getContext) || !canvas.width || !canvas.height) return true;

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      const points = [
        [0.5, 0.5],
        [0.25, 0.25],
        [0.75, 0.25],
        [0.25, 0.75],
        [0.75, 0.75]
      ];

      for (const point of points) {
        const x = Math.max(0, Math.min(canvas.width - 1, Math.round(canvas.width * point[0])));
        const y = Math.max(0, Math.min(canvas.height - 1, Math.round(canvas.height * point[1])));
        const data = ctx.getImageData(x, y, 1, 1).data;

        if ((data[3] || 0) > 0 && ((data[0] || 0) > 0 || (data[1] || 0) > 0 || (data[2] || 0) > 0)) {
          return false;
        }
      }
    } catch (_error) {
      return false;
    }

    return true;
  }

  function drawPrefaceSurface(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const width = Math.max(1, canvas.width || 1);
    const height = Math.max(1, canvas.height || 1);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.max(1, Math.min(width, height) * 0.39);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(1, 7, 15, 0.94)";
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.45);
    glow.addColorStop(0, "rgba(64, 114, 150, 0.24)");
    glow.addColorStop(0.58, "rgba(17, 54, 83, 0.16)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.52, 0, Math.PI * 2);
    ctx.fill();

    const body = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.32,
      radius * 0.08,
      cx,
      cy,
      radius
    );
    body.addColorStop(0, "rgba(82, 143, 171, 1)");
    body.addColorStop(0.38, "rgba(35, 83, 113, 1)");
    body.addColorStop(0.72, "rgba(16, 47, 70, 1)");
    body.addColorStop(1, "rgba(5, 18, 31, 1)");

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = 0.88;
    ctx.fillStyle = "rgba(96, 118, 76, 0.72)";
    drawLandMass(ctx, cx, cy, radius, [
      [-0.54, -0.44], [-0.28, -0.58], [-0.05, -0.48], [0.08, -0.31],
      [-0.03, -0.12], [-0.27, -0.04], [-0.49, -0.18]
    ]);
    drawLandMass(ctx, cx, cy, radius, [
      [0.18, -0.50], [0.46, -0.39], [0.60, -0.13], [0.46, 0.05],
      [0.25, 0.02], [0.15, -0.21]
    ]);
    drawLandMass(ctx, cx, cy, radius, [
      [-0.38, 0.08], [-0.10, 0.02], [0.10, 0.20], [0.02, 0.44],
      [-0.24, 0.55], [-0.48, 0.34]
    ]);
    drawLandMass(ctx, cx, cy, radius, [
      [0.25, 0.18], [0.55, 0.25], [0.62, 0.48], [0.35, 0.58],
      [0.16, 0.41]
    ]);

    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = "rgba(197, 187, 126, 0.55)";
    ctx.lineWidth = Math.max(1, radius * 0.006);

    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + i * radius * 0.22, radius * 0.94, radius * 0.14, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(132, 186, 211, 0.62)";
    ctx.lineWidth = Math.max(1, radius * 0.018);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(229, 238, 242, 0.22)";
    ctx.lineWidth = Math.max(1, radius * 0.008);
    ctx.beginPath();
    ctx.arc(cx - radius * 0.05, cy - radius * 0.05, radius * 0.86, Math.PI * 1.15, Math.PI * 1.72);
    ctx.stroke();

    return true;
  }

  function drawLandMass(ctx, cx, cy, radius, points) {
    if (!points || points.length < 3) return;

    ctx.beginPath();

    points.forEach((point, index) => {
      const x = cx + point[0] * radius;
      const y = cy + point[1] * radius;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
  }

  function sampleCanvas(canvas) {
    const result = {
      canvasContext2DReady: false,
      canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
      canvasVisiblePixelCount: 0
    };

    if (!canvas || !isFunction(canvas.getContext) || !canvas.width || !canvas.height) return result;

    try {
      const ctx = canvas.getContext("2d");
      result.canvasContext2DReady = Boolean(ctx);

      if (!ctx) return result;

      const points = [
        [0.16, 0.16],
        [0.34, 0.34],
        [0.50, 0.50],
        [0.66, 0.66],
        [0.84, 0.84]
      ];

      for (const point of points) {
        const x = Math.max(0, Math.min(canvas.width - 1, Math.round(canvas.width * point[0])));
        const y = Math.max(0, Math.min(canvas.height - 1, Math.round(canvas.height * point[1])));
        const data = ctx.getImageData(x, y, 1, 1).data;
        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0 && (r > 0 || g > 0 || b > 0)) result.canvasVisiblePixelCount += 1;
      }

      result.canvasPixelSampleStatus =
        result.canvasVisiblePixelCount > 0 ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_NO_VISIBLE_RGB";
    } catch (error) {
      result.canvasPixelSampleStatus =
        `PIXEL_SAMPLE_UNREADABLE:${safeString(error && error.message ? error.message : error).slice(0, 120)}`;
    }

    return result;
  }

  function computedVisible(canvas) {
    if (!canvas) return false;

    try {
      if (root.getComputedStyle) {
        const style = root.getComputedStyle(canvas);
        return Boolean(
          style &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          safeNumber(style.opacity, 1) > 0
        );
      }
    } catch (_error) {}

    return true;
  }

  function ensureDomSurface(reason = "ensure-dom-surface") {
    const surface = {
      mount: null,
      canvas: null,
      mountFound: false,
      canvasFound: false,
      canvasCreated: false,
      canvasBound: false,
      drewPreface: false,
      reason
    };

    if (!doc) {
      updateSurfaceState(surface);
      return surface;
    }

    const mount = findMount();
    surface.mount = mount;
    surface.mountFound = Boolean(mount);

    if (!mount) {
      updateSurfaceState(surface);
      return surface;
    }

    if (mount.style) {
      const measured = measureElement(mount);
      if (!measured.width || !measured.height) {
        if (!mount.style.minHeight) mount.style.minHeight = "320px";
        if (!mount.style.position) mount.style.position = "relative";
      }
    }

    let canvas = findCanvas(mount);
    let created = false;

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.id = LAUNCH_CANVAS_ID;
      mount.appendChild(canvas);
      created = true;
      record("HEARTH_CANVAS_LAUNCH_CREATED_DOM_CANVAS_SURFACE", {
        mountSelector: mount.id ? `#${mount.id}` : mount.tagName,
        reason
      });
    }

    setCanvasAttributes(canvas, created);

    const size = ensureCanvasSize(canvas, mount);
    const shouldDraw = created || canvas.dataset.hearthCanvasLaunchPreface === "true" || canvasLooksBlank(canvas);
    const drew = shouldDraw ? drawPrefaceSurface(canvas) : false;
    const sample = sampleCanvas(canvas);
    const canvasMeasure = measureElement(canvas);

    surface.canvas = canvas;
    surface.canvasFound = Boolean(canvas);
    surface.canvasCreated = created;
    surface.canvasBound = Boolean(canvas && !created);
    surface.drewPreface = drew;
    surface.size = size;
    surface.sample = sample;
    surface.rect = canvasMeasure;
    surface.computedVisible = computedVisible(canvas);
    surface.canvasInMount = Boolean(canvas && mount && mount.contains(canvas));

    updateSurfaceState(surface);
    return surface;
  }

  function updateSurfaceState(surface) {
    const mount = surface.mount || null;
    const canvas = surface.canvas || null;
    const size = surface.size || {};
    const sample = surface.sample || {};
    const rect = surface.rect || {};

    state.canvasMountFound = Boolean(surface.mountFound);
    state.canvasMountSelector = mount && mount.id ? `#${mount.id}` : state.canvasMountFound ? "HEARTH_VISIBLE_MOUNT" : "NONE";
    state.canvasElementFound = Boolean(surface.canvasFound);
    state.canvasCreatedByLaunch = Boolean(surface.canvasCreated || state.canvasCreatedByLaunch);
    state.canvasBoundByLaunch = Boolean(surface.canvasBound || state.canvasBoundByLaunch);
    state.canvasSelector = canvas && canvas.id ? `#${canvas.id}` : state.canvasElementFound ? "canvas[data-hearth-expression-surface='true']" : "UNKNOWN";
    state.canvasId = canvas && canvas.id ? canvas.id : "";
    state.canvasInMount = Boolean(surface.canvasInMount);
    state.canvasRectNonzero = Boolean(
      canvas &&
      ((safeNumber(size.width, 0) > 0 && safeNumber(size.height, 0) > 0) ||
        (safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0))
    );
    state.canvasComputedVisible = Boolean(surface.computedVisible);
    state.canvasContext2DReady = Boolean(sample.canvasContext2DReady);
    state.canvasPixelSampleStatus = sample.canvasPixelSampleStatus || "NO_PIXEL_SAMPLE";
    state.canvasVisiblePixelCount = safeNumber(sample.canvasVisiblePixelCount, 0);
    state.canvasWidth = safeNumber(size.width, 0);
    state.canvasHeight = safeNumber(size.height, 0);
    state.canvasCssWidth = safeNumber(size.cssWidth, 0);
    state.canvasCssHeight = safeNumber(size.cssHeight, 0);

    state.domSurfaceCreatedOrBound = Boolean(state.canvasMountFound && state.canvasElementFound);
    state.domSurfaceProofReady = Boolean(
      state.canvasMountFound &&
      state.canvasElementFound &&
      state.canvasRectNonzero &&
      state.canvasComputedVisible &&
      state.canvasContext2DReady
    );

    state.updatedAt = nowIso();
    updateDataset();
    return state.domSurfaceProofReady;
  }

  function findDownstreamCanvasAuthority() {
    for (const path of DOWNSTREAM_CANVAS_ALIASES) {
      const value = readPath(path);

      if (!value || value === api || (!isObject(value) && !isFunction(value))) continue;

      const contract = contractOf(value);
      const receipt = readAuthorityReceipt(value) || {};

      return {
        observed: true,
        path,
        value,
        contract,
        receipt
      };
    }

    return {
      observed: false,
      path: "NONE",
      value: null,
      contract: "UNKNOWN",
      receipt: {}
    };
  }

  function forwardToDownstreamCanvas(packet, reason = "forward-to-downstream-canvas") {
    const target = findDownstreamCanvasAuthority();

    state.downstreamCanvasObserved = target.observed;
    state.downstreamCanvasSourcePath = target.path;
    state.downstreamCanvasContract = target.contract;

    if (!target.observed || !target.value) {
      state.governedSourcePacketForwardedToCanvas = false;
      state.governedSourcePacketForwardStatus = "DOWNSTREAM_CANVAS_AUTHORITY_NOT_OBSERVED";
      state.governedSourcePacketForwardMethod = "NONE";
      state.governedSourcePacketForwardReason = "WAITING_FOR_HEARTH_CANVAS_JS_AUTHORITY";
      updateDataset();

      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        status: state.governedSourcePacketForwardStatus,
        reason: state.governedSourcePacketForwardReason
      };
    }

    for (const method of DOWNSTREAM_CANVAS_RECEIVERS) {
      if (!isFunction(target.value[method])) continue;

      try {
        const result = target.value[method](clonePlain(packet), {
          source: "HEARTH_CANVAS_LAUNCH",
          contract: CONTRACT,
          reason
        });

        const receipt = isObject(result) ? result : readAuthorityReceipt(target.value) || {};
        const accepted = Boolean(
          result === true ||
          safeBool(readField(receipt, [
            "accepted",
            "sourceAccepted",
            "governedSourceAccepted",
            "governedSourceStackAccepted",
            "canvasGovernedSourceAccepted"
          ], false), false) ||
          /ACCEPTED|CONSUMED|READY|ACTIVE|BOUND|CONFIRMED/i.test(safeString(readField(receipt, [
            "status",
            "sourceStatus",
            "governedSourceStatus",
            "canvasStatus"
          ], "")))
        );

        state.governedSourcePacketForwardedToCanvas = true;
        state.governedSourcePacketForwardStatus = accepted
          ? "FORWARDED_TO_DOWNSTREAM_CANVAS_ACCEPTED"
          : "FORWARDED_TO_DOWNSTREAM_CANVAS_NOT_CONFIRMED_ACCEPTED";
        state.governedSourcePacketForwardMethod = method;
        state.governedSourcePacketForwardReason = accepted
          ? "DOWNSTREAM_CANVAS_PUBLIC_API_ACCEPTED_PACKET"
          : "DOWNSTREAM_CANVAS_PUBLIC_API_CALLED_WITHOUT_ACCEPTANCE_PROOF";

        record("HEARTH_CANVAS_LAUNCH_FORWARDED_PACKET_TO_DOWNSTREAM_CANVAS", {
          method,
          accepted,
          targetPath: target.path,
          targetContract: target.contract
        });

        updateDataset();

        return {
          delivered: true,
          accepted,
          method,
          status: state.governedSourcePacketForwardStatus,
          reason: state.governedSourcePacketForwardReason,
          receipt: clonePlain(receipt)
        };
      } catch (error) {
        recordError("HEARTH_CANVAS_LAUNCH_DOWNSTREAM_CANVAS_FORWARD_FAILED", error, {
          method,
          targetPath: target.path
        });
      }
    }

    state.governedSourcePacketForwardedToCanvas = false;
    state.governedSourcePacketForwardStatus = "DOWNSTREAM_CANVAS_PUBLIC_SOURCE_RECEIVER_MISSING";
    state.governedSourcePacketForwardMethod = "NONE";
    state.governedSourcePacketForwardReason = "DOWNSTREAM_CANVAS_OBSERVED_BUT_NO_PUBLIC_SOURCE_RECEIVER";

    updateDataset();

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      status: state.governedSourcePacketForwardStatus,
      reason: state.governedSourcePacketForwardReason
    };
  }

  function receiveCanvasLaunchPacket(packet, meta = {}) {
    const held = {
      packetType: "HEARTH_CANVAS_LAUNCH_PREFACE_HELD_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: CANVAS_FILE,
      receivedAt: nowIso(),
      meta: clonePlain(meta),
      packet: clonePlain(packet),
      acceptedForPrefaceHolding: true,
      acceptedForFinalCanvasRendering: false,
      sourceAccepted: false,
      governedSourceAccepted: false,
      governedSourceStackAccepted: false,
      canvasGovernedSourceAccepted: false,
      status: "PREFACE_HELD_FOR_DOWNSTREAM_CANVAS",
      reason: "CANVAS_LAUNCH_IS_NOT_FINAL_CANVAS_SOURCE_CONSUMER",
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    state.latestGovernedSourcePacket = clonePlain(packet);
    state.latestCanvasLaunchPrefacePacket = clonePlain(held);
    state.governedSourcePacketHeld = true;

    ensureDomSurface("packet-received");
    const delivery = forwardToDownstreamCanvas(packet, "packet-received");

    return {
      ...composeReceipt(),
      prefaceHeldPacket: clonePlain(held),
      downstreamDelivery: clonePlain(delivery),
      accepted: false,
      acceptedForPrefaceHolding: true,
      acceptedForFinalCanvasRendering: false,
      sourceAccepted: false,
      governedSourceAccepted: false,
      governedSourceStackAccepted: false,
      canvasGovernedSourceAccepted: false,
      status: delivery.accepted
        ? "PREFACE_HELD_AND_DOWNSTREAM_CANVAS_ACCEPTED"
        : "PREFACE_HELD_WAITING_DOWNSTREAM_CANVAS_ACCEPTANCE",
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function registerCanvasAuthority(authority, label = "registered-canvas-authority") {
    if (!authority || (!isObject(authority) && !isFunction(authority))) {
      return {
        registered: false,
        reason: "INVALID_CANVAS_AUTHORITY",
        receipt: composeReceipt()
      };
    }

    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    root.HEARTH.canvasLaunchRegisteredAuthority = authority;
    root.DEXTER_LAB.hearthCanvasLaunchRegisteredAuthority = authority;

    record("HEARTH_CANVAS_LAUNCH_REGISTERED_DOWNSTREAM_CANVAS_AUTHORITY", { label });

    if (state.latestGovernedSourcePacket) {
      forwardToDownstreamCanvas(state.latestGovernedSourcePacket, "registered-authority-forward");
    }

    return {
      registered: true,
      reason: "CANVAS_AUTHORITY_REGISTERED",
      receipt: composeReceipt()
    };
  }

  function getHeldPacket() {
    return clonePlain(state.latestCanvasLaunchPrefacePacket || null);
  }

  function getHeldGovernedSourcePacket() {
    return clonePlain(state.latestGovernedSourcePacket || null);
  }

  function composeSurfacePacket() {
    return {
      packetType: "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      targetCanvasFile: CANVAS_FILE,

      launchPrefaceActive: state.launchPrefaceActive,
      launchPrefaceDecommissioned: state.launchPrefaceDecommissioned,
      domSurfaceCreatedOrBound: state.domSurfaceCreatedOrBound,
      domSurfaceProofReady: state.domSurfaceProofReady,
      domSurfaceProofScope: state.domSurfaceProofScope,

      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasCreatedByLaunch: state.canvasCreatedByLaunch,
      canvasBoundByLaunch: state.canvasBoundByLaunch,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,

      visiblePlanetProofReady: state.domSurfaceProofReady,
      visiblePlanetProofSource: state.domSurfaceProofReady
        ? "CANVAS_LAUNCH_DOM_2D_PREFACE_SURFACE"
        : "NONE",
      visiblePlanetProofIsSourceTruth: false,
      canvasSurfaceTruthAvailable: state.domSurfaceProofReady,
      canvasSurfaceTruthScope: "DOM_SURFACE_ONLY_NOT_GOVERNED_SOURCE_RENDER",
      canvasOwnsSourceTruth: false,
      canvasLaunchOwnsSourceTruth: false,
      finalCanvasTruthClaimed: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function composeReceipt() {
    const surfacePacket = composeSurfacePacket();

    return {
      packetType: "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_RECEIPT_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      launchPrefaceActive: state.launchPrefaceActive,
      launchPrefaceDecommissioned: state.launchPrefaceDecommissioned,
      launchOwnsDomSurfacePrefaceOnly: true,
      launchOwnsFinalCanvasRendering: false,
      launchOwnsCanvasSourceTruth: false,
      launchMayHoldGovernedSourcePacket: true,
      launchMayForwardToDownstreamCanvas: true,

      surfacePacket,
      domSurfaceCreatedOrBound: state.domSurfaceCreatedOrBound,
      domSurfaceProofReady: state.domSurfaceProofReady,
      domSurfaceProofScope: state.domSurfaceProofScope,

      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasCreatedByLaunch: state.canvasCreatedByLaunch,
      canvasBoundByLaunch: state.canvasBoundByLaunch,
      canvasSelector: state.canvasSelector,
      canvasId: state.canvasId,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,

      CANVAS_SURFACE_TRUTH_AVAILABLE: state.domSurfaceProofReady,
      DOM_EXPRESSION_SURFACE_PROOF_READY: state.domSurfaceProofReady,
      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      CANVAS_MOUNT_FOUND: state.canvasMountFound,
      CANVAS_IN_MOUNT: state.canvasInMount,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_COMPUTED_VISIBLE: state.canvasComputedVisible,
      CANVAS_CONTEXT_2D_READY: state.canvasContext2DReady,
      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: state.canvasVisiblePixelCount > 0,

      governedSourcePacketHeld: state.governedSourcePacketHeld,
      governedSourcePacketForwardedToCanvas: state.governedSourcePacketForwardedToCanvas,
      governedSourcePacketForwardStatus: state.governedSourcePacketForwardStatus,
      governedSourcePacketForwardMethod: state.governedSourcePacketForwardMethod,
      governedSourcePacketForwardReason: state.governedSourcePacketForwardReason,

      downstreamCanvasObserved: state.downstreamCanvasObserved,
      downstreamCanvasSourcePath: state.downstreamCanvasSourcePath,
      downstreamCanvasContract: state.downstreamCanvasContract,

      status: state.domSurfaceProofReady
        ? "CANVAS_LAUNCH_DOM_SURFACE_READY_PREFACE_ONLY"
        : "CANVAS_LAUNCH_DOM_SURFACE_NOT_READY",
      recommendedNextOwner: "CANVAS_EXPRESSION_SURFACE",
      recommendedNextFile: CANVAS_FILE,
      recommendedNextAction: "LOAD_OR_RENEW_HEARTH_CANVAS_JS_TO_CONSUME_GOVERNED_SOURCE_AND_OWN_FINAL_RENDERING",

      receiptPublishCount: state.receiptPublishCount,
      eventCount: state.eventCount,
      errorCount: state.errorCount,
      renderCount: state.renderCount,
      updatedAt: nowIso(),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = composeReceipt()) {
    const r = isObject(receipt) ? receipt : composeReceipt();

    return [
      "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_RECEIPT",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("canvasFile", r.canvasFile),
      "",
      "SURFACE",
      line("launchPrefaceActive", r.launchPrefaceActive),
      line("launchPrefaceDecommissioned", r.launchPrefaceDecommissioned),
      line("domSurfaceCreatedOrBound", r.domSurfaceCreatedOrBound),
      line("domSurfaceProofReady", r.domSurfaceProofReady),
      line("domSurfaceProofScope", r.domSurfaceProofScope),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasCreatedByLaunch", r.canvasCreatedByLaunch),
      line("canvasBoundByLaunch", r.canvasBoundByLaunch),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasContext2DReady", r.canvasContext2DReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasVisiblePixelCount", r.canvasVisiblePixelCount),
      "",
      "HANDOFF",
      line("governedSourcePacketHeld", r.governedSourcePacketHeld),
      line("governedSourcePacketForwardedToCanvas", r.governedSourcePacketForwardedToCanvas),
      line("governedSourcePacketForwardStatus", r.governedSourcePacketForwardStatus),
      line("governedSourcePacketForwardMethod", r.governedSourcePacketForwardMethod),
      line("governedSourcePacketForwardReason", r.governedSourcePacketForwardReason),
      line("downstreamCanvasObserved", r.downstreamCanvasObserved),
      line("downstreamCanvasSourcePath", r.downstreamCanvasSourcePath),
      line("downstreamCanvasContract", r.downstreamCanvasContract),
      "",
      "BOUNDARIES",
      line("launchOwnsDomSurfacePrefaceOnly", true),
      line("launchOwnsFinalCanvasRendering", false),
      line("launchOwnsCanvasSourceTruth", false),
      line("visiblePlanetProofIsSourceTruth", false),
      line("finalCanvasTruthClaimed", false),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("status", r.status),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh("get-receipt-light-refresh");
    return composeReceipt();
  }

  function getReceipt() {
    return {
      ...composeReceipt(),
      currentReceiptText: composeReceiptText(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      heldPacket: getHeldPacket(),
      heldGovernedSourcePacket: getHeldGovernedSourcePacket(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getStatus() {
    return composeReceipt();
  }

  function getReport() {
    return getReceipt();
  }

  function getState() {
    return clonePlain(state);
  }

  function getCanvasLaunchReceipt() {
    return getReceipt();
  }

  function getVisibleSurfacePacket() {
    return composeSurfacePacket();
  }

  function getSurfacePacket() {
    return composeSurfacePacket();
  }

  function getReceiptText() {
    return composeReceiptText(composeReceipt());
  }

  function updateDataset() {
    setDataset("hearthCanvasLaunchLoaded", "true");
    setDataset("hearthCanvasLaunchContract", CONTRACT);
    setDataset("hearthCanvasLaunchReceipt", RECEIPT);
    setDataset("hearthCanvasLaunchVersion", VERSION);
    setDataset("hearthCanvasLaunchFile", FILE);
    setDataset("hearthCanvasLaunchTargetCanvasFile", CANVAS_FILE);

    setDataset("hearthCanvasLaunchPrefaceActive", String(state.launchPrefaceActive === true));
    setDataset("hearthCanvasLaunchPrefaceDecommissioned", String(state.launchPrefaceDecommissioned === true));
    setDataset("hearthCanvasLaunchDomSurfaceCreatedOrBound", String(state.domSurfaceCreatedOrBound === true));
    setDataset("hearthCanvasLaunchDomSurfaceProofReady", String(state.domSurfaceProofReady === true));
    setDataset("hearthCanvasLaunchDomSurfaceProofScope", state.domSurfaceProofScope);

    setDataset("hearthCanvasLaunchCanvasMountFound", String(state.canvasMountFound === true));
    setDataset("hearthCanvasLaunchCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasLaunchCanvasElementFound", String(state.canvasElementFound === true));
    setDataset("hearthCanvasLaunchCanvasCreatedByLaunch", String(state.canvasCreatedByLaunch === true));
    setDataset("hearthCanvasLaunchCanvasBoundByLaunch", String(state.canvasBoundByLaunch === true));
    setDataset("hearthCanvasLaunchCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasLaunchCanvasId", state.canvasId);
    setDataset("hearthCanvasLaunchCanvasInMount", String(state.canvasInMount === true));
    setDataset("hearthCanvasLaunchCanvasRectNonzero", String(state.canvasRectNonzero === true));
    setDataset("hearthCanvasLaunchCanvasComputedVisible", String(state.canvasComputedVisible === true));
    setDataset("hearthCanvasLaunchCanvasContext2dReady", String(state.canvasContext2DReady === true));
    setDataset("hearthCanvasLaunchCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasLaunchCanvasVisiblePixelCount", String(state.canvasVisiblePixelCount || 0));

    setDataset("hearthCanvasLaunchGovernedSourcePacketHeld", String(state.governedSourcePacketHeld === true));
    setDataset("hearthCanvasLaunchGovernedSourcePacketForwardedToCanvas", String(state.governedSourcePacketForwardedToCanvas === true));
    setDataset("hearthCanvasLaunchGovernedSourcePacketForwardStatus", state.governedSourcePacketForwardStatus);
    setDataset("hearthCanvasLaunchGovernedSourcePacketForwardMethod", state.governedSourcePacketForwardMethod);
    setDataset("hearthCanvasLaunchGovernedSourcePacketForwardReason", state.governedSourcePacketForwardReason);

    setDataset("hearthCanvasLaunchDownstreamCanvasObserved", String(state.downstreamCanvasObserved === true));
    setDataset("hearthCanvasLaunchDownstreamCanvasSourcePath", state.downstreamCanvasSourcePath);
    setDataset("hearthCanvasLaunchDownstreamCanvasContract", state.downstreamCanvasContract);

    setDataset("hearthCanvasLaunchOwnsDomSurfacePrefaceOnly", "true");
    setDataset("hearthCanvasLaunchOwnsFinalCanvasRendering", "false");
    setDataset("hearthCanvasLaunchOwnsCanvasSourceTruth", "false");
    setDataset("hearthCanvasLaunchVisiblePlanetProofIsSourceTruth", "false");
    setDataset("hearthCanvasLaunchFinalCanvasTruthClaimed", "false");

    setDataset("hearthCanvasLaunchF13Claimed", "false");
    setDataset("hearthCanvasLaunchF21EligibleForNorth", "false");
    setDataset("hearthCanvasLaunchF21Claimed", "false");
    setDataset("hearthCanvasLaunchReadyTextAllowed", "false");
    setDataset("hearthCanvasLaunchReadyTextClaimed", "false");
    setDataset("hearthCanvasLaunchVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals(reason = "publish-globals") {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const aliases = [
      "HEARTH_CANVAS_LAUNCH",
      "HEARTH_CANVAS_LAUNCH_PREFACE",
      "HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER",
      "HEARTH.canvasLaunch",
      "HEARTH.canvasLaunchPreface",
      "HEARTH.canvasLaunchDomSurfacePrefaceHolder",
      "DEXTER_LAB.hearthCanvasLaunch",
      "DEXTER_LAB.hearthCanvasLaunchPreface",
      "DEXTER_LAB.hearthCanvasLaunchDomSurfacePrefaceHolder"
    ];

    for (const alias of aliases) setPath(alias, api);

    const receipt = composeReceipt();
    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_LAUNCH_RECEIPT = receipt;
    root.HEARTH_CANVAS_LAUNCH_PREFACE_RECEIPT = receipt;
    root.HEARTH_CANVAS_LAUNCH_DOM_SURFACE_PREFACE_HOLDER_RECEIPT = receipt;
    root.HEARTH.canvasLaunchReceipt = receipt;
    root.HEARTH.canvasLaunchPrefaceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasLaunchReceipt = receipt;

    root.HEARTH_CANVAS_LAUNCH_SURFACE_PACKET = composeSurfacePacket();
    root.HEARTH.canvasLaunchSurfacePacket = composeSurfacePacket();
    root.DEXTER_LAB.hearthCanvasLaunchSurfacePacket = composeSurfacePacket();

    if (state.latestCanvasLaunchPrefacePacket) {
      root.HEARTH_CANVAS_LAUNCH_PREFACE_HELD_PACKET = clonePlain(state.latestCanvasLaunchPrefacePacket);
      root.HEARTH.canvasLaunchPrefaceHeldPacket = clonePlain(state.latestCanvasLaunchPrefacePacket);
      root.DEXTER_LAB.hearthCanvasLaunchPrefaceHeldPacket = clonePlain(state.latestCanvasLaunchPrefacePacket);
    }

    updateDataset();

    record("HEARTH_CANVAS_LAUNCH_PUBLISHED_GLOBALS", {
      reason,
      domSurfaceProofReady: state.domSurfaceProofReady,
      canvasElementFound: state.canvasElementFound,
      downstreamCanvasObserved: state.downstreamCanvasObserved,
      visualPassClaimed: false
    });

    return true;
  }

  function refresh(reason = "refresh") {
    ensureDomSurface(reason);

    if (state.latestGovernedSourcePacket) {
      forwardToDownstreamCanvas(state.latestGovernedSourcePacket, reason);
    } else {
      const target = findDownstreamCanvasAuthority();
      state.downstreamCanvasObserved = target.observed;
      state.downstreamCanvasSourcePath = target.path;
      state.downstreamCanvasContract = target.contract;
    }

    publishGlobals(reason);
    return getReceiptLight(false);
  }

  function scheduleResizeRefresh() {
    if (!root.setTimeout || resizeTimer) return;

    resizeTimer = root.setTimeout(() => {
      resizeTimer = 0;
      refresh("resize-refresh");
    }, 120);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;

      publishGlobals("boot-early");

      refresh("boot");

      state.booting = false;
      state.booted = true;

      if (root.addEventListener) {
        root.addEventListener("resize", scheduleResizeRefresh, { passive: true });
      }

      if (root.setTimeout) {
        root.setTimeout(() => refresh("post-boot-250ms"), 250);
        root.setTimeout(() => refresh("post-boot-900ms"), 900);
        root.setTimeout(() => refresh("post-boot-1800ms"), 1800);
      }

      record("HEARTH_CANVAS_LAUNCH_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        canvasElementFound: state.canvasElementFound,
        domSurfaceProofReady: state.domSurfaceProofReady,
        canvasFile: CANVAS_FILE,
        visualPassClaimed: false
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (root.removeEventListener) {
      try {
        root.removeEventListener("resize", scheduleResizeRefresh);
      } catch (_error) {}
    }

    if (resizeTimer && root.clearTimeout) {
      root.clearTimeout(resizeTimer);
      resizeTimer = 0;
    }

    state.disposed = true;
    record("HEARTH_CANVAS_LAUNCH_DISPOSED", { reason });
    publishGlobals("dispose");

    return getReceipt();
  }

  function decommissionPreface(reason = "downstream-canvas-ready") {
    state.launchPrefaceActive = false;
    state.launchPrefaceDecommissioned = true;
    state.finalCanvasTruthClaimed = false;

    const canvas = doc ? doc.getElementById(LAUNCH_CANVAS_ID) : null;
    if (canvas && canvas.dataset) {
      canvas.dataset.hearthCanvasLaunchPreface = "decommissioned";
      canvas.dataset.hearthFinalCanvasTruthClaimed = "false";
    }

    record("HEARTH_CANVAS_LAUNCH_PREFACE_DECOMMISSIONED", { reason });
    publishGlobals("decommission-preface");

    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    canvasFile: CANVAS_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    boot,
    start: boot,
    init: boot,
    run: boot,
    mount: boot,
    refresh,
    dispose,
    decommissionPreface,

    ensureDomSurface,
    getVisibleSurfacePacket,
    getSurfacePacket,
    composeSurfacePacket,

    receiveCanvasLaunchPrefacePacket: receiveCanvasLaunchPacket,
    consumeCanvasLaunchPrefacePacket: receiveCanvasLaunchPacket,

    receiveRouteConductorCanvasGovernedHandoffPacket: receiveCanvasLaunchPacket,
    consumeRouteConductorCanvasGovernedHandoffPacket: receiveCanvasLaunchPacket,
    receiveRouteConductorGovernedSourcePacket: receiveCanvasLaunchPacket,
    consumeRouteConductorGovernedSourcePacket: receiveCanvasLaunchPacket,
    receiveRouteConductorSourceStackPacket: receiveCanvasLaunchPacket,
    consumeRouteConductorSourceStackPacket: receiveCanvasLaunchPacket,
    receiveGovernedSourceStackPacket: receiveCanvasLaunchPacket,
    consumeGovernedSourceStackPacket: receiveCanvasLaunchPacket,
    acceptGovernedSourceStackPacket: receiveCanvasLaunchPacket,
    receiveGovernedSourcePacket: receiveCanvasLaunchPacket,
    consumeGovernedSourcePacket: receiveCanvasLaunchPacket,
    acceptGovernedSourcePacket: receiveCanvasLaunchPacket,
    receiveSourceStackPacket: receiveCanvasLaunchPacket,
    consumeSourceStackPacket: receiveCanvasLaunchPacket,
    receiveSourceTruthPacket: receiveCanvasLaunchPacket,
    consumeSourceTruthPacket: receiveCanvasLaunchPacket,
    receivePacket: receiveCanvasLaunchPacket,

    registerCanvasAuthority,
    bindCanvasAuthority: registerCanvasAuthority,
    attachCanvasAuthority: registerCanvasAuthority,

    getHeldPacket,
    getHeldGovernedSourcePacket,

    composeReceipt,
    composeReceiptText,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatus,
    getReport,
    getState,
    getCanvasLaunchReceipt,

    publishGlobals,
    updateDataset,

    supportsDomCanvasSurfaceCreation: true,
    supportsDomCanvasSurfaceBinding: true,
    supportsCanvasLaunchPrefaceHolding: true,
    supportsGovernedSourcePacketHolding: true,
    supportsDownstreamCanvasForwarding: true,
    supportsCanvasSurfaceTruthProbeRecovery: true,

    ownsCanvasLaunchPreface: true,
    ownsDomSurfaceCreation: true,
    ownsDomSurfaceBinding: true,
    ownsFinalCanvasRendering: false,
    ownsCanvasSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsControlsTruth: false,
    ownsRouteConductorTruth: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsHexRendering: false,
    ownsPointerFingerImplementation: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    launchPrefaceActive: true,
    finalCanvasTruthClaimed: false,
    visiblePlanetProofIsSourceTruth: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get state() {
      return state;
    }
  });

  publishGlobals("immediate-api-publication");

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
