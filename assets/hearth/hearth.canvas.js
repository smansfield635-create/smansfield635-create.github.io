// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_TNT_v1
// Full-file replacement.
// Canvas / visible-carrier authority only.
// Purpose:
// - Preserve a visible Hearth planet carrier.
// - Convert canvas boot from one long synchronous handoff into cooperative phases.
// - Yield during atlas/texture composition so the loading cockpit can repaint.
// - Stream F13 canvas progress into the shared Hearth load ledger.
// - Preserve drag inspection, first-frame proof, copyable receipt support, and no visual-pass claim.
// Does not own:
// - HTML first paint
// - route conduction
// - Runtime Table source code
// - tectonic cause
// - elevation truth
// - composition truth
// - hydrology truth
// - source material authority
// - climate route authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.hearth-canvas-cooperative-boot-progress-handoff-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const PHASE_PROGRESS = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: 78,
    CANVAS_MOUNT_CREATED: 81,
    CANVAS_CONTEXT_READY: 84,
    ATLAS_BUILD_STARTED: 84,
    ATLAS_BUILD_PROGRESS_MIN: 84,
    ATLAS_BUILD_PROGRESS_MAX: 91,
    ATLAS_BUILD_COMPLETE: 91,
    TEXTURE_COMPOSE_STARTED: 91,
    TEXTURE_COMPOSE_PROGRESS_MIN: 91,
    TEXTURE_COMPOSE_PROGRESS_MAX: 96,
    TEXTURE_COMPOSE_COMPLETE: 96,
    FIRST_FRAME_REQUESTED: 97,
    FIRST_FRAME_DETECTED: 98,
    DRAG_INSPECTION_BOUND: 99,
    CANVAS_READY: 100
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    cooperativeBootAvailable: true,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,

    bootInProgress: false,
    bootComplete: false,
    bootPromise: null,
    bootPayload: null,

    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootStartedAtMs: 0,
    canvasBootCompletedAtMs: 0,
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,
    lastCanvasPhase: "",
    lastCanvasProgress: 0,
    loaderRepaintDuringCanvasBoot: false,
    f13ProgressStreamActive: false,

    mountId: "hearthCanvasMount",
    mountPresent: false,
    canvasElementPresent: false,
    contextReady: false,
    canvasCarrierMounted: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "bootCooperative",

    atlasWidth: 512,
    atlasHeight: 256,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,

    firstFrameRequested: false,
    firstFrameDetected: false,
    dragInspectionBound: false,
    imageRendered: false,
    canvasReady: false,

    frames: 0,
    renderLoopActive: false,
    animationFrameId: 0,
    lastRenderAt: 0,

    rotation: 0.24,
    tilt: -0.06,
    spinRate: 0.000045,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    dragStartedAt: 0,

    sourceAuthorityHeld: true,
    runtimeTableOptional: true,
    runtimeTableMissingDoesNotBlockCarrier: true,
    visibleCarrierFirst: true,
    wideProbeDeferred: true,

    coherentExpressionPass: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    postgameStatus: "COOPERATIVE_CANVAS_BOOT_PENDING",
    firstFailedCoordinate: "F13_CANVAS_BOOT_PENDING",
    recommendedNextRenewalTarget: "execute-hearth-js-cooperative-handoff-second",

    phaseEvents: [],
    errors: [],
    updatedAt: ""
  };

  const refs = {
    mount: null,
    canvas: null,
    ctx: null,
    bufferCanvas: null,
    bufferCtx: null,
    textureCanvas: null,
    textureCtx: null,
    textureImage: null,
    atlas: null,
    resizeObserver: null
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function ease(t) {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function safeJson(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function phasePercent(name, localPercent = 0) {
    if (name === "ATLAS_BUILD_PROGRESS") {
      return Math.round(lerp(
        PHASE_PROGRESS.ATLAS_BUILD_PROGRESS_MIN,
        PHASE_PROGRESS.ATLAS_BUILD_PROGRESS_MAX,
        clamp(localPercent, 0, 1)
      ));
    }

    if (name === "TEXTURE_COMPOSE_PROGRESS") {
      return Math.round(lerp(
        PHASE_PROGRESS.TEXTURE_COMPOSE_PROGRESS_MIN,
        PHASE_PROGRESS.TEXTURE_COMPOSE_PROGRESS_MAX,
        clamp(localPercent, 0, 1)
      ));
    }

    return PHASE_PROGRESS[name] || state.lastCanvasProgress || 78;
  }

  function getLedger() {
    return root.HEARTH_LOAD_LEDGER || null;
  }

  function ledgerSetLane(eventName, percent, status, message, detail) {
    const ledger = getLedger();
    if (!ledger || !isFunction(ledger.setLane)) return;

    try {
      ledger.setLane("canvasAndDiagnostic", {
        status: status || "LOADING",
        progress: percent,
        event: eventName,
        stage: "F13",
        owner: "hearth.canvas.js",
        file: FILE,
        message: message || eventName,
        detail: detail || {}
      });
    } catch (_error) {}
  }

  function ledgerPush(eventName, percent, status, message, detail) {
    const ledger = getLedger();
    if (!ledger || !isFunction(ledger.push)) return;

    try {
      ledger.push({
        id: eventName,
        stage: "F13",
        owner: "hearth.canvas.js",
        file: FILE,
        lane: "canvasAndDiagnostic",
        status: status || "LOADING",
        message: message || eventName,
        detail: detail || {},
        progress: percent
      });
    } catch (_error) {}
  }

  function invokeCallback(name, value) {
    const payload = state.bootPayload || {};
    const callbacks = payload.callbacks || {};

    if (isFunction(callbacks[name])) {
      try {
        callbacks[name](value);
      } catch (error) {
        recordError(`CALLBACK_${name}_FAILED`, error && error.message ? error.message : String(error));
      }
    }
  }

  function reportPhase(name, options = {}) {
    const localPercent = Number(options.localPercent || 0);
    const percent = clamp(Number(options.percent ?? phasePercent(name, localPercent)), 0, 100);
    const elapsedMs = state.canvasBootStartedAtMs ? nowMs() - state.canvasBootStartedAtMs : 0;

    state.canvasPhaseCount += 1;
    state.lastCanvasPhase = name;
    state.lastCanvasProgress = percent;
    state.canvasBootElapsedMs = elapsedMs;
    state.f13ProgressStreamActive = true;
    state.updatedAt = nowIso();

    const detail = {
      phase: name,
      percent,
      elapsedMs,
      elapsed: formatElapsed(elapsedMs),
      chunkIndex: options.chunkIndex ?? "",
      totalChunks: options.totalChunks ?? "",
      stillAlive: true,
      cooperativeBootUsed: state.cooperativeBootUsed,
      canvasYieldCount: state.canvasYieldCount,
      ...safeJson(options.detail || {})
    };

    const event = {
      at: state.updatedAt,
      phase: name,
      percent,
      message: options.message || name,
      detail
    };

    state.phaseEvents.push(event);
    if (state.phaseEvents.length > 180) {
      state.phaseEvents.splice(0, state.phaseEvents.length - 180);
    }

    ledgerSetLane(name, percent, options.status || "LOADING", options.message || name, detail);
    ledgerPush(name, percent, options.status || "LOADING", options.message || name, detail);

    invokeCallback("onCanvasPhase", event);
    invokeCallback("onCanvasProgress", event);

    publishDataset();
    publishGlobals();
    return event;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message,
      detail: safeJson(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    state.postgameStatus = "CANVAS_BOOT_PHASE_ERROR";
    state.firstFailedCoordinate = code;
    state.canvasCarrierHandoffError = message;

    ledgerSetLane(code, 100, "FAILED", message, detail);
    ledgerPush(code, 100, "FAILED", message, detail);

    publishDataset();
    publishGlobals();
    return item;
  }

  async function yieldBrowser(reason = "yield") {
    state.canvasYieldCount += 1;
    state.loaderRepaintDuringCanvasBoot = state.canvasYieldCount > 0;

    if (reason) {
      const elapsedMs = state.canvasBootStartedAtMs ? nowMs() - state.canvasBootStartedAtMs : 0;
      const detail = {
        reason,
        yieldCount: state.canvasYieldCount,
        elapsedMs,
        elapsed: formatElapsed(elapsedMs)
      };
      ledgerPush("CANVAS_BOOT_YIELD", state.lastCanvasProgress || 78, "LOADING", `yield · ${reason}`, detail);
    }

    await new Promise((resolve) => {
      if (root.requestAnimationFrame) {
        root.requestAnimationFrame(() => resolve());
      } else {
        root.setTimeout(resolve, 0);
      }
    });
  }

  function createElementCanvas(width = 1, height = 1) {
    const canvas = doc ? doc.createElement("canvas") : null;
    if (!canvas) return null;
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function ensureMount(payload = {}) {
    if (!doc) return null;

    const mountId = payload.mountId || payload.mountID || state.mountId || "hearthCanvasMount";
    state.mountId = mountId;

    let mount =
      doc.getElementById(mountId) ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = mountId;
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasMountCreatedByCanvas = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = mount.id || mountId;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCanvasContract = CONTRACT;
    mount.dataset.hearthCanvasReceipt = RECEIPT;
    mount.dataset.hearthCanvasCooperativeBoot = "true";
    mount.dataset.hearthReceiptOverlayIndependent = "true";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    refs.mount = mount;
    state.mountPresent = true;

    return mount;
  }

  function ensureCanvas(payload = {}) {
    const mount = ensureMount(payload);
    if (!mount || !doc) return null;

    let canvas =
      mount.querySelector("canvas[data-hearth-canvas='true']") ||
      mount.querySelector("canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.dataset.hearthCanvasCooperativeBoot = "true";
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasCooperativeBoot = "true";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";

    refs.canvas = canvas;
    refs.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true }) || canvas.getContext("2d");

    state.canvasElementPresent = Boolean(canvas);
    state.contextReady = Boolean(refs.ctx);

    if (!refs.ctx) {
      throw new Error("2D canvas context unavailable.");
    }

    sizeCanvas();
    return canvas;
  }

  function sizeCanvas() {
    const canvas = refs.canvas;
    const mount = refs.mount;
    if (!canvas || !mount) return;

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 360, height: 360 };
    const cssSize = Math.max(280, Math.min(720, Math.floor(Math.min(rect.width || 360, rect.height || rect.width || 360))));
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const pixel = Math.max(280, Math.floor(cssSize * dpr));

    if (canvas.width !== pixel || canvas.height !== pixel) {
      canvas.width = pixel;
      canvas.height = pixel;
    }

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const bufferSize = Math.max(260, Math.min(520, Math.floor(pixel)));
    if (!refs.bufferCanvas || refs.bufferCanvas.width !== bufferSize || refs.bufferCanvas.height !== bufferSize) {
      refs.bufferCanvas = createElementCanvas(bufferSize, bufferSize);
      refs.bufferCtx = refs.bufferCanvas ? refs.bufferCanvas.getContext("2d", { alpha: true }) : null;
    }
  }

  function bindResize() {
    if (!refs.mount || !doc) return;

    if (refs.resizeObserver && isFunction(refs.resizeObserver.disconnect)) {
      try {
        refs.resizeObserver.disconnect();
      } catch (_error) {}
    }

    if ("ResizeObserver" in root) {
      refs.resizeObserver = new ResizeObserver(() => {
        sizeCanvas();
        drawFrame(true);
      });
      refs.resizeObserver.observe(refs.mount);
    } else {
      root.addEventListener("resize", () => {
        sizeCanvas();
        drawFrame(true);
      }, { passive: true });
    }
  }

  function drawPlaceholder() {
    const ctx = refs.ctx;
    const canvas = refs.canvas;
    if (!ctx || !canvas) return;

    sizeCanvas();

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.38;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.8);
    bg.addColorStop(0, "rgba(26,68,84,0.24)");
    bg.addColorStop(0.58, "rgba(3,12,22,0.72)");
    bg.addColorStop(1, "rgba(1,4,10,0.96)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const globe = ctx.createRadialGradient(cx - r * 0.26, cy - r * 0.28, r * 0.05, cx, cy, r);
    globe.addColorStop(0, "rgba(76,121,126,0.35)");
    globe.addColorStop(0.56, "rgba(17,43,51,0.82)");
    globe.addColorStop(1, "rgba(4,13,21,0.95)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.fillStyle = globe;
    ctx.fill();

    ctx.strokeStyle = "rgba(141,216,255,0.16)";
    ctx.lineWidth = Math.max(1, w * 0.003);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.045, 0, TWO_PI);
    ctx.strokeStyle = "rgba(141,216,255,0.07)";
    ctx.lineWidth = Math.max(1, w * 0.006);
    ctx.stroke();
  }

  function hash2(x, y, seed = 19.19) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function noise2(x, y, seed = 11.1) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed = 1.0, octaves = 5) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += noise2(x * freq, y * freq, seed + i * 13.37) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }

    return norm ? value / norm : 0;
  }

  function wrapLonDelta(a, b) {
    let d = a - b;
    while (d > Math.PI) d -= TWO_PI;
    while (d < -Math.PI) d += TWO_PI;
    return d;
  }

  function ellipseInfluence(lon, lat, centerLon, centerLat, sx, sy, angle, strength) {
    const dx = wrapLonDelta(lon, centerLon);
    const dy = lat - centerLat;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const rx = dx * ca + dy * sa;
    const ry = -dx * sa + dy * ca;
    const q = (rx * rx) / (sx * sx) + (ry * ry) / (sy * sy);
    return Math.exp(-q) * strength;
  }

  function terrainSample(lon, lat) {
    const u = (lon / TWO_PI + 1) % 1;
    const v = 0.5 - lat / Math.PI;

    const continental =
      ellipseInfluence(lon, lat, -2.45, -0.35, 0.42, 0.82, -0.28, 1.05) +
      ellipseInfluence(lon, lat, -1.58, 0.38, 0.34, 0.56, 0.72, 0.84) +
      ellipseInfluence(lon, lat, -0.18, -0.56, 0.68, 0.34, 0.12, 0.88) +
      ellipseInfluence(lon, lat, 0.82, 0.30, 0.72, 0.45, -0.42, 0.98) +
      ellipseInfluence(lon, lat, 1.72, -0.18, 0.36, 0.66, 0.16, 0.72) +
      ellipseInfluence(lon, lat, 2.55, 0.56, 0.48, 0.32, -0.20, 0.48);

    const islands =
      ellipseInfluence(lon, lat, -2.92, 0.08, 0.16, 0.18, 0.0, 0.58) +
      ellipseInfluence(lon, lat, 2.38, -0.55, 0.22, 0.16, 0.35, 0.52) +
      ellipseInfluence(lon, lat, 0.10, 0.72, 0.18, 0.13, -0.2, 0.42);

    const fracture =
      (fbm(u * 7.4 + 10.2, v * 5.1 - 3.4, 21.4, 5) - 0.5) * 0.56 +
      (fbm(u * 21.0, v * 13.0, 44.1, 3) - 0.5) * 0.22;

    const ridge =
      Math.abs(Math.sin((u * 5.0 + fbm(u * 4, v * 4, 71, 4) * 0.45) * Math.PI)) * 0.10 +
      Math.abs(Math.sin((v * 7.0 + fbm(u * 6, v * 5, 83, 3) * 0.30) * Math.PI)) * 0.06;

    const polarDamp = smoothstep(1.50, 1.06, Math.abs(lat));
    const raw = (continental + islands + fracture + ridge - 0.78) * polarDamp;

    const land = raw > 0;
    const shelf = raw > -0.16 && raw <= 0;
    const elevation = clamp((raw + 0.06) / 0.78, 0, 1);
    const depth = clamp((-raw) / 0.62, 0, 1);

    const materialNoise = fbm(u * 36.0, v * 20.0, 99.9, 4);
    const wetEdge = smoothstep(-0.14, 0.10, raw) * (1 - smoothstep(0.12, 0.42, raw));

    return {
      land,
      shelf,
      raw,
      elevation,
      depth,
      wetEdge,
      materialNoise,
      u,
      v
    };
  }

  function colorForSample(sample, lon, lat) {
    const haze = 0.88 + fbm(sample.u * 8, sample.v * 8, 110.4, 3) * 0.12;
    const ice = smoothstep(1.02, 1.42, Math.abs(lat));

    if (sample.land) {
      const high = sample.elevation;
      const n = sample.materialNoise;
      const green = smoothstep(0.10, 0.62, 1 - high) * (0.55 + n * 0.32);
      const dry = smoothstep(0.30, 0.88, high);
      const cliff = smoothstep(0.48, 0.86, high) * (0.45 + n * 0.38);

      let r = lerp(66, 148, green);
      let g = lerp(86, 132, green);
      let b = lerp(64, 88, green);

      r = lerp(r, 174, dry * 0.62);
      g = lerp(g, 148, dry * 0.44);
      b = lerp(b, 92, dry * 0.34);

      r = lerp(r, 126, cliff * 0.42);
      g = lerp(g, 119, cliff * 0.38);
      b = lerp(b, 102, cliff * 0.46);

      r = lerp(r, 218, ice * 0.55);
      g = lerp(g, 228, ice * 0.55);
      b = lerp(b, 220, ice * 0.58);

      return [
        Math.round(r * haze),
        Math.round(g * haze),
        Math.round(b * haze),
        255
      ];
    }

    const shallow = sample.shelf ? smoothstep(1.0, 0.0, sample.depth) : 0;
    const waterNoise = fbm(sample.u * 18.0, sample.v * 13.0, 57.8, 3);
    const deep = sample.depth;

    let r = lerp(6, 28, shallow);
    let g = lerp(31, 76, shallow);
    let b = lerp(47, 82, shallow);

    r = lerp(r, 10, deep * 0.36);
    g = lerp(g, 26, deep * 0.28);
    b = lerp(b, 39, deep * 0.20);

    r += waterNoise * 8;
    g += waterNoise * 13;
    b += waterNoise * 15;

    if (sample.wetEdge > 0) {
      r = lerp(r, 58, sample.wetEdge * 0.34);
      g = lerp(g, 103, sample.wetEdge * 0.32);
      b = lerp(b, 100, sample.wetEdge * 0.30);
    }

    return [
      Math.round(clamp(r, 0, 255)),
      Math.round(clamp(g, 0, 255)),
      Math.round(clamp(b, 0, 255)),
      255
    ];
  }

  async function buildAtlas(width, height) {
    state.atlasWidth = width;
    state.atlasHeight = height;
    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;

    reportPhase("ATLAS_BUILD_STARTED", {
      status: "LOADING",
      message: "Atlas build started.",
      percent: PHASE_PROGRESS.ATLAS_BUILD_STARTED,
      detail: { width, height }
    });

    const total = width * height;
    const raw = new Float32Array(total);
    const elevation = new Float32Array(total);
    const depth = new Float32Array(total);
    const flags = new Uint8Array(total);

    const rowsPerChunk = 8;
    const totalChunks = Math.ceil(height / rowsPerChunk);

    for (let y = 0; y < height; y += rowsPerChunk) {
      const yEnd = Math.min(height, y + rowsPerChunk);

      for (let row = y; row < yEnd; row += 1) {
        const v = row / Math.max(1, height - 1);
        const lat = (0.5 - v) * Math.PI;

        for (let x = 0; x < width; x += 1) {
          const u = x / Math.max(1, width - 1);
          const lon = (u - 0.5) * TWO_PI;
          const sample = terrainSample(lon, lat);
          const index = row * width + x;

          raw[index] = sample.raw;
          elevation[index] = sample.elevation;
          depth[index] = sample.depth;
          flags[index] = sample.land ? 1 : (sample.shelf ? 2 : 0);
        }
      }

      const chunkIndex = Math.floor(y / rowsPerChunk) + 1;
      const local = chunkIndex / totalChunks;
      state.atlasBuildProgress = Math.round(local * 100);

      reportPhase("ATLAS_BUILD_PROGRESS", {
        status: "LOADING",
        localPercent: local,
        message: `Atlas build active · ${chunkIndex}/${totalChunks} chunks · elapsed ${formatElapsed(nowMs() - state.canvasBootStartedAtMs)}`,
        chunkIndex,
        totalChunks,
        detail: {
          atlasBuildProgress: state.atlasBuildProgress,
          rowsComplete: yEnd,
          totalRows: height
        }
      });

      await yieldBrowser("atlas-build");
    }

    state.atlasBuildComplete = true;
    state.atlasBuildProgress = 100;

    refs.atlas = {
      width,
      height,
      raw,
      elevation,
      depth,
      flags
    };

    reportPhase("ATLAS_BUILD_COMPLETE", {
      status: "READY",
      percent: PHASE_PROGRESS.ATLAS_BUILD_COMPLETE,
      message: "Atlas build complete.",
      detail: { width, height }
    });

    return refs.atlas;
  }

  async function composeTexture(atlas) {
    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;

    reportPhase("TEXTURE_COMPOSE_STARTED", {
      status: "LOADING",
      percent: PHASE_PROGRESS.TEXTURE_COMPOSE_STARTED,
      message: "Texture composition started.",
      detail: { width: atlas.width, height: atlas.height }
    });

    if (!refs.textureCanvas) {
      refs.textureCanvas = createElementCanvas(atlas.width, atlas.height);
      refs.textureCtx = refs.textureCanvas ? refs.textureCanvas.getContext("2d", { alpha: false }) : null;
    }

    refs.textureCanvas.width = atlas.width;
    refs.textureCanvas.height = atlas.height;

    const image = refs.textureCtx.createImageData(atlas.width, atlas.height);
    const data = image.data;

    const rowsPerChunk = 8;
    const totalChunks = Math.ceil(atlas.height / rowsPerChunk);

    for (let y = 0; y < atlas.height; y += rowsPerChunk) {
      const yEnd = Math.min(atlas.height, y + rowsPerChunk);

      for (let row = y; row < yEnd; row += 1) {
        const v = row / Math.max(1, atlas.height - 1);
        const lat = (0.5 - v) * Math.PI;

        for (let x = 0; x < atlas.width; x += 1) {
          const u = x / Math.max(1, atlas.width - 1);
          const lon = (u - 0.5) * TWO_PI;
          const index = row * atlas.width + x;
          const sample = {
            raw: atlas.raw[index],
            elevation: atlas.elevation[index],
            depth: atlas.depth[index],
            land: atlas.flags[index] === 1,
            shelf: atlas.flags[index] === 2,
            wetEdge: smoothstep(-0.14, 0.10, atlas.raw[index]) * (1 - smoothstep(0.12, 0.42, atlas.raw[index])),
            materialNoise: fbm(u * 36.0, v * 20.0, 99.9, 4),
            u,
            v
          };
          const color = colorForSample(sample, lon, lat);
          const p = index * 4;

          data[p] = color[0];
          data[p + 1] = color[1];
          data[p + 2] = color[2];
          data[p + 3] = color[3];
        }
      }

      const chunkIndex = Math.floor(y / rowsPerChunk) + 1;
      const local = chunkIndex / totalChunks;
      state.textureComposeProgress = Math.round(local * 100);

      reportPhase("TEXTURE_COMPOSE_PROGRESS", {
        status: "LOADING",
        localPercent: local,
        message: `Texture composition active · ${state.textureComposeProgress}% · elapsed ${formatElapsed(nowMs() - state.canvasBootStartedAtMs)}`,
        chunkIndex,
        totalChunks,
        detail: {
          textureComposeProgress: state.textureComposeProgress,
          rowsComplete: yEnd,
          totalRows: atlas.height
        }
      });

      await yieldBrowser("texture-compose");
    }

    refs.textureCtx.putImageData(image, 0, 0);
    refs.textureImage = refs.textureCtx.getImageData(0, 0, atlas.width, atlas.height);

    state.textureComposeComplete = true;
    state.textureComposeProgress = 100;

    reportPhase("TEXTURE_COMPOSE_COMPLETE", {
      status: "READY",
      percent: PHASE_PROGRESS.TEXTURE_COMPOSE_COMPLETE,
      message: "Texture composition complete.",
      detail: { width: atlas.width, height: atlas.height }
    });

    return refs.textureImage;
  }

  function sampleTexture(u, v) {
    const texture = refs.textureImage;
    if (!texture) return [18, 46, 56, 255];

    const width = texture.width;
    const height = texture.height;
    const x = Math.floor(((u % 1 + 1) % 1) * (width - 1));
    const y = Math.floor(clamp(v, 0, 1) * (height - 1));
    const index = (y * width + x) * 4;
    const data = texture.data;

    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  }

  function drawSphereToBuffer(force = false) {
    if (!refs.bufferCanvas || !refs.bufferCtx || !refs.textureImage) return false;

    const canvas = refs.bufferCanvas;
    const ctx = refs.bufferCtx;
    const w = canvas.width;
    const h = canvas.height;
    const d = Math.min(w, h);
    const cx = w / 2;
    const cy = h / 2;
    const radius = d * 0.468;

    const image = ctx.createImageData(w, h);
    const data = image.data;

    const sinTilt = Math.sin(state.tilt);
    const cosTilt = Math.cos(state.tilt);

    for (let y = 0; y < h; y += 1) {
      const ny = (y + 0.5 - cy) / radius;

      for (let x = 0; x < w; x += 1) {
        const nx = (x + 0.5 - cx) / radius;
        const r2 = nx * nx + ny * ny;
        const p = (y * w + x) * 4;

        if (r2 > 1) {
          data[p] = 0;
          data[p + 1] = 0;
          data[p + 2] = 0;
          data[p + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - r2);

        const yy = ny * cosTilt - z * sinTilt;
        const zz = ny * sinTilt + z * cosTilt;

        const lon = Math.atan2(nx, zz) + state.rotation;
        const lat = Math.asin(clamp(-yy, -1, 1));

        const u = (lon / TWO_PI + 1) % 1;
        const v = 0.5 - lat / Math.PI;
        const c = sampleTexture(u, v);

        const limb = smoothstep(1.0, 0.58, Math.sqrt(r2));
        const day = 0.34 + 0.66 * Math.pow(clamp(zz * 0.72 + 0.42, 0, 1), 0.72);
        const atmospheric = smoothstep(0.76, 1.0, Math.sqrt(r2));
        const shade = clamp(day * (0.58 + limb * 0.42), 0.12, 1.05);

        data[p] = clamp(c[0] * shade + atmospheric * 6, 0, 255);
        data[p + 1] = clamp(c[1] * shade + atmospheric * 18, 0, 255);
        data[p + 2] = clamp(c[2] * shade + atmospheric * 24, 0, 255);
        data[p + 3] = Math.round(255 * smoothstep(1.01, 0.965, Math.sqrt(r2)));
      }
    }

    ctx.putImageData(image, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const glow = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.34, radius * 0.08, cx, cy, radius);
    glow.addColorStop(0, "rgba(255,244,216,0.10)");
    glow.addColorStop(0.44, "rgba(141,216,255,0.035)");
    glow.addColorStop(1, "rgba(141,216,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.006, 0, TWO_PI);
    ctx.strokeStyle = "rgba(141,216,255,0.15)";
    ctx.lineWidth = Math.max(1, d * 0.006);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.045, 0, TWO_PI);
    ctx.strokeStyle = "rgba(141,216,255,0.052)";
    ctx.lineWidth = Math.max(1, d * 0.014);
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function drawFrame(force = false) {
    const canvas = refs.canvas;
    const ctx = refs.ctx;
    if (!canvas || !ctx) return false;

    sizeCanvas();

    const now = nowMs();
    const shouldDraw = force || state.dragging || !state.lastRenderAt || now - state.lastRenderAt >= 42;
    if (!shouldDraw) return false;

    state.lastRenderAt = now;

    if (!state.dragging) {
      state.rotation += state.spinRate * Math.max(16, Math.min(48, now - (state.lastRenderAt || now)));
    }

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.39;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.8);
    bg.addColorStop(0, "rgba(26,68,84,0.22)");
    bg.addColorStop(0.62, "rgba(3,12,22,0.76)");
    bg.addColorStop(1, "rgba(1,4,10,0.97)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    if (refs.textureImage && refs.bufferCanvas) {
      drawSphereToBuffer(force);
      ctx.drawImage(refs.bufferCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
    } else {
      drawPlaceholder();
    }

    state.frames += 1;
    state.imageRendered = true;

    return true;
  }

  function startRenderLoop() {
    if (state.renderLoopActive) return;

    state.renderLoopActive = true;

    const loop = () => {
      if (!state.renderLoopActive) return;
      drawFrame(false);
      state.animationFrameId = root.requestAnimationFrame ? root.requestAnimationFrame(loop) : root.setTimeout(loop, 42);
    };

    state.animationFrameId = root.requestAnimationFrame ? root.requestAnimationFrame(loop) : root.setTimeout(loop, 42);
  }

  function stopRenderLoop() {
    state.renderLoopActive = false;

    if (state.animationFrameId) {
      if (root.cancelAnimationFrame) root.cancelAnimationFrame(state.animationFrameId);
      else root.clearTimeout(state.animationFrameId);
      state.animationFrameId = 0;
    }
  }

  function bindDrag() {
    const canvas = refs.canvas;
    const mount = refs.mount;
    const target = canvas || mount;
    if (!target || target.dataset.hearthDragInspectionBound === "true") return;

    const onDown = (event) => {
      state.dragging = true;
      state.lastPointerX = event.clientX ?? (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
      state.lastPointerY = event.clientY ?? (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
      state.dragStartedAt = nowMs();

      try {
        if (target.setPointerCapture && event.pointerId != null) target.setPointerCapture(event.pointerId);
      } catch (_error) {}
    };

    const onMove = (event) => {
      if (!state.dragging) return;

      const x = event.clientX ?? (event.touches && event.touches[0] ? event.touches[0].clientX : state.lastPointerX);
      const y = event.clientY ?? (event.touches && event.touches[0] ? event.touches[0].clientY : state.lastPointerY);
      const dx = x - state.lastPointerX;
      const dy = y - state.lastPointerY;

      state.lastPointerX = x;
      state.lastPointerY = y;
      state.rotation -= dx * 0.0085;
      state.tilt = clamp(state.tilt + dy * 0.0035, -0.72, 0.72);

      drawFrame(true);

      if (event.cancelable) event.preventDefault();
    };

    const onUp = (event) => {
      state.dragging = false;

      try {
        if (target.releasePointerCapture && event.pointerId != null) target.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    };

    target.addEventListener("pointerdown", onDown, { passive: false });
    target.addEventListener("pointermove", onMove, { passive: false });
    target.addEventListener("pointerup", onUp, { passive: true });
    target.addEventListener("pointercancel", onUp, { passive: true });
    target.addEventListener("lostpointercapture", onUp, { passive: true });

    target.dataset.hearthDragInspectionBound = "true";
    if (mount) mount.dataset.hearthDragInspectionBound = "true";
    if (doc && doc.documentElement) doc.documentElement.dataset.hearthDragInspectionBound = "true";

    state.dragInspectionBound = true;

    reportPhase("DRAG_INSPECTION_BOUND", {
      status: "BOUND",
      percent: PHASE_PROGRESS.DRAG_INSPECTION_BOUND,
      message: "Drag inspection bound.",
      detail: { target: target === canvas ? "canvas" : "mount" }
    });

    invokeCallback("onDragBound", getReceipt());
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasVersion = VERSION;

    dataset.hearthCanvasCooperativeBootAvailable = String(state.cooperativeBootAvailable);
    dataset.hearthCanvasCooperativeBootUsed = String(state.cooperativeBootUsed);
    dataset.hearthCanvasSyncBootFallbackUsed = String(state.syncBootFallbackUsed);
    dataset.hearthCanvasBootInProgress = String(state.bootInProgress);
    dataset.hearthCanvasBootComplete = String(state.bootComplete);

    dataset.hearthCanvasMountPresent = String(state.mountPresent);
    dataset.hearthCanvasElementPresent = String(state.canvasElementPresent);
    dataset.hearthCanvasContextReady = String(state.contextReady);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthVisibleCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;

    dataset.hearthCanvasBootStartedAt = state.canvasBootStartedAt;
    dataset.hearthCanvasBootCompletedAt = state.canvasBootCompletedAt;
    dataset.hearthCanvasBootElapsedMs = String(state.canvasBootElapsedMs);
    dataset.hearthCanvasYieldCount = String(state.canvasYieldCount);
    dataset.hearthCanvasPhaseCount = String(state.canvasPhaseCount);
    dataset.hearthCanvasLastPhase = state.lastCanvasPhase;
    dataset.hearthCanvasLastProgress = String(state.lastCanvasProgress);
    dataset.hearthLoaderRepaintDuringCanvasBoot = String(state.loaderRepaintDuringCanvasBoot);
    dataset.hearthF13ProgressStreamActive = String(state.f13ProgressStreamActive);

    dataset.hearthAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthTextureComposeComplete = String(state.textureComposeComplete);

    dataset.hearthFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasPostgameStatus = state.postgameStatus;
    dataset.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthCanvasRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthSourceAuthorityHeld = "true";
    dataset.hearthRuntimeTableOptional = "true";
    dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";
    dataset.hearthVisibleCarrierFirst = "true";
    dataset.hearthWideProbeDeferred = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.canvas = api;

    root.HEARTH_CANVAS = api;
    root.HearthCanvas = api;
    root.HEARTH_CANVAS_CONTRACT = CONTRACT;
    root.HEARTH_CANVAS_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_POSTGAME_RECEIPT = root.HEARTH_CANVAS_RECEIPT;

    root.__HEARTH_CANVAS_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_COOPERATIVE_BOOT_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_VISUAL_PASS_CLAIMED__ = false;

    publishDataset();
  }

  async function bootCooperative(payload = {}) {
    if (state.bootInProgress && state.bootPromise) return state.bootPromise;

    state.bootPayload = payload || {};
    state.cooperativeBootUsed = true;
    state.syncBootFallbackUsed = false;
    state.canvasCarrierMethod = "bootCooperative";
    state.bootInProgress = true;
    state.bootComplete = false;
    state.canvasBootStartedAt = nowIso();
    state.canvasBootStartedAtMs = nowMs();
    state.canvasBootCompletedAt = "";
    state.canvasBootCompletedAtMs = 0;
    state.canvasBootElapsedMs = 0;
    state.canvasYieldCount = 0;
    state.canvasPhaseCount = 0;
    state.lastCanvasPhase = "";
    state.lastCanvasProgress = 0;
    state.loaderRepaintDuringCanvasBoot = false;
    state.f13ProgressStreamActive = true;
    state.postgameStatus = "COOPERATIVE_CANVAS_BOOT_PENDING";
    state.firstFailedCoordinate = "F13_CANVAS_BOOT_STARTED";
    state.recommendedNextRenewalTarget = "execute-hearth-js-cooperative-handoff-second";
    state.phaseEvents = [];
    state.errors = [];

    state.bootPromise = (async () => {
      try {
        reportPhase("CANVAS_COOPERATIVE_BOOT_STARTED", {
          status: "LOADING",
          percent: PHASE_PROGRESS.CANVAS_COOPERATIVE_BOOT_STARTED,
          message: "Canvas cooperative boot started.",
          detail: {
            mountId: payload.mountId || payload.mountID || state.mountId,
            conductor: CONDUCTOR_FILE
          }
        });

        await yieldBrowser("before-mount");

        ensureMount(payload);
        ensureCanvas(payload);
        bindResize();
        drawPlaceholder();

        state.canvasCarrierMounted = true;
        state.canvasCarrierHandoffOk = true;

        if (refs.mount) {
          refs.mount.dataset.hearthCanvasMounted = "true";
          refs.mount.dataset.hearthVisibleCarrierMounted = "true";
        }

        reportPhase("CANVAS_MOUNT_CREATED", {
          status: "MOUNTED",
          percent: PHASE_PROGRESS.CANVAS_MOUNT_CREATED,
          message: "Canvas mount created.",
          detail: {
            mountId: refs.mount ? refs.mount.id : "",
            width: refs.canvas ? refs.canvas.width : 0,
            height: refs.canvas ? refs.canvas.height : 0
          }
        });

        invokeCallback("onMounted", getReceipt());

        await yieldBrowser("after-mount");

        reportPhase("CANVAS_CONTEXT_READY", {
          status: "READY",
          percent: PHASE_PROGRESS.CANVAS_CONTEXT_READY,
          message: "Canvas context ready.",
          detail: { context: "2d" }
        });

        bindDrag();

        await yieldBrowser("before-atlas");

        const atlasWidth = clamp(Number(payload.atlasWidth || payload.textureWidth || 512), 256, 768);
        const atlasHeight = clamp(Number(payload.atlasHeight || payload.textureHeight || 256), 128, 384);

        const atlas = await buildAtlas(atlasWidth, atlasHeight);

        await yieldBrowser("before-texture-compose");

        await composeTexture(atlas);

        await yieldBrowser("before-first-frame");

        state.firstFrameRequested = true;

        reportPhase("FIRST_FRAME_REQUESTED", {
          status: "LOADING",
          percent: PHASE_PROGRESS.FIRST_FRAME_REQUESTED,
          message: "First frame requested.",
          detail: {
            framesBeforeRequest: state.frames
          }
        });

        drawFrame(true);
        startRenderLoop();

        await yieldBrowser("first-frame-paint");

        state.firstFrameDetected = true;
        state.imageRendered = true;

        if (doc && doc.documentElement) {
          doc.documentElement.dataset.hearthFirstFrameDetected = "true";
          doc.documentElement.dataset.hearthImageRendered = "true";
        }

        reportPhase("FIRST_FRAME_DETECTED", {
          status: "RENDERED",
          percent: PHASE_PROGRESS.FIRST_FRAME_DETECTED,
          message: "First frame detected.",
          detail: {
            frames: state.frames,
            imageRendered: true
          }
        });

        invokeCallback("onFirstFrame", getReceipt());
        invokeCallback("onRendered", getReceipt());

        await yieldBrowser("after-first-frame");

        if (!state.dragInspectionBound) bindDrag();

        state.canvasReady = true;
        state.bootComplete = true;
        state.bootInProgress = false;
        state.canvasBootCompletedAt = nowIso();
        state.canvasBootCompletedAtMs = nowMs();
        state.canvasBootElapsedMs = state.canvasBootCompletedAtMs - state.canvasBootStartedAtMs;
        state.postgameStatus = "CANVAS_READY_DIAGNOSTIC_DOCK_ACTIVE";
        state.firstFailedCoordinate = "NONE_CANVAS_READY";
        state.recommendedNextRenewalTarget = "execute-hearth-js-cooperative-handoff-second";

        reportPhase("CANVAS_READY", {
          status: "FINAL_READY",
          percent: PHASE_PROGRESS.CANVAS_READY,
          message: "Canvas ready.",
          detail: {
            canvasBootElapsedMs: state.canvasBootElapsedMs,
            canvasYieldCount: state.canvasYieldCount,
            loaderRepaintDuringCanvasBoot: state.loaderRepaintDuringCanvasBoot,
            frames: state.frames
          }
        });

        invokeCallback("onReady", getReceipt());

        publishGlobals();
        return getReceipt();
      } catch (error) {
        state.bootInProgress = false;
        state.bootComplete = false;
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
        state.postgameStatus = "CANVAS_BOOT_PHASE_ERROR";
        state.firstFailedCoordinate = "CANVAS_COOPERATIVE_BOOT_ERROR";
        state.recommendedNextRenewalTarget = "canvas-cooperative-boot-error-receipt-review";

        recordError("CANVAS_COOPERATIVE_BOOT_ERROR", state.canvasCarrierHandoffError);

        invokeCallback("onError", getReceipt());

        publishGlobals();
        return getReceipt();
      }
    })();

    return state.bootPromise;
  }

  function boot(payload = {}) {
    state.syncBootFallbackUsed = false;
    return bootCooperative(payload);
  }

  function mountVisibleCarrier(payload = {}) {
    return bootCooperative(payload);
  }

  function bootVisibleCarrier(payload = {}) {
    return bootCooperative(payload);
  }

  function mount(payload = {}) {
    return bootCooperative(payload);
  }

  function start(payload = {}) {
    return bootCooperative(payload);
  }

  function init(payload = {}) {
    return bootCooperative(payload);
  }

  function render(payload = {}) {
    if (!refs.canvas) {
      return bootCooperative(payload);
    }

    drawFrame(true);
    return getReceipt();
  }

  function conduct(payload = {}) {
    return bootCooperative(payload);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      route: ROUTE,
      file: FILE,

      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,

      bootInProgress: state.bootInProgress,
      bootComplete: state.bootComplete,

      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,
      lastCanvasPhase: state.lastCanvasPhase,
      lastCanvasProgress: state.lastCanvasProgress,
      loaderRepaintDuringCanvasBoot: state.loaderRepaintDuringCanvasBoot,
      f13ProgressStreamActive: state.f13ProgressStreamActive,

      mountId: state.mountId,
      mountPresent: state.mountPresent,
      canvasElementPresent: state.canvasElementPresent,
      contextReady: state.contextReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      visibleCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,

      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      dragInspectionBound: state.dragInspectionBound,
      imageRendered: state.imageRendered,
      canvasReady: state.canvasReady,

      frames: state.frames,
      renderLoopActive: state.renderLoopActive,

      sourceAuthorityHeld: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      visibleCarrierFirst: true,
      wideProbeDeferred: true,

      coherentExpressionPass: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      phaseEvents: safeJson(state.phaseEvents),
      errors: safeJson(state.errors),
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const phases = receipt.phaseEvents.map((event) => {
      return `- ${event.at} :: ${event.phase} :: progress=${event.percent} :: ${event.message}`;
    }).join("\n") || "- none";

    const errors = receipt.errors.map((error) => {
      return `- ${error.at} :: ${error.code} :: ${error.message}`;
    }).join("\n") || "- none";

    return [
      "HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `route=${receipt.route}`,
      `file=${receipt.file}`,
      "",
      `cooperativeBootAvailable=${receipt.cooperativeBootAvailable}`,
      `cooperativeBootUsed=${receipt.cooperativeBootUsed}`,
      `syncBootFallbackUsed=${receipt.syncBootFallbackUsed}`,
      `bootInProgress=${receipt.bootInProgress}`,
      `bootComplete=${receipt.bootComplete}`,
      "",
      `canvasBootStartedAt=${receipt.canvasBootStartedAt}`,
      `canvasBootCompletedAt=${receipt.canvasBootCompletedAt}`,
      `canvasBootElapsedMs=${receipt.canvasBootElapsedMs}`,
      `canvasYieldCount=${receipt.canvasYieldCount}`,
      `canvasPhaseCount=${receipt.canvasPhaseCount}`,
      `lastCanvasPhase=${receipt.lastCanvasPhase}`,
      `lastCanvasProgress=${receipt.lastCanvasProgress}`,
      `loaderRepaintDuringCanvasBoot=${receipt.loaderRepaintDuringCanvasBoot}`,
      `f13ProgressStreamActive=${receipt.f13ProgressStreamActive}`,
      "",
      `mountId=${receipt.mountId}`,
      `mountPresent=${receipt.mountPresent}`,
      `canvasElementPresent=${receipt.canvasElementPresent}`,
      `contextReady=${receipt.contextReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `visibleCarrierMounted=${receipt.visibleCarrierMounted}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      "",
      `atlasWidth=${receipt.atlasWidth}`,
      `atlasHeight=${receipt.atlasHeight}`,
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      "",
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `imageRendered=${receipt.imageRendered}`,
      `canvasReady=${receipt.canvasReady}`,
      `frames=${receipt.frames}`,
      `renderLoopActive=${receipt.renderLoopActive}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `runtimeTableOptional=${receipt.runtimeTableOptional}`,
      `runtimeTableMissingDoesNotBlockCarrier=${receipt.runtimeTableMissingDoesNotBlockCarrier}`,
      `visibleCarrierFirst=${receipt.visibleCarrierFirst}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      "",
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      "PHASE_EVENTS",
      phases,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function dispose(reason = "manual-dispose") {
    stopRenderLoop();

    if (refs.resizeObserver && isFunction(refs.resizeObserver.disconnect)) {
      try {
        refs.resizeObserver.disconnect();
      } catch (_error) {}
      refs.resizeObserver = null;
    }

    state.bootInProgress = false;
    state.renderLoopActive = false;
    state.postgameStatus = "CANVAS_DISPOSED";
    state.recommendedNextRenewalTarget = reason;

    publishGlobals();
    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    bootCooperative,
    boot,
    mountVisibleCarrier,
    bootVisibleCarrier,
    mount,
    start,
    init,
    render,
    conduct,
    getReceipt,
    getReceiptText,
    dispose,

    supportsCooperativeBoot: true,
    supportsCanvasProgressStream: true,
    supportsF13ProgressStream: true,
    supportsLedgerCallbacks: true,
    supportsDragInspection: true,
    supportsVisibleCarrierFirst: true,
    supportsReceiptIndependence: true,

    ownsPlanetDrawing: true,
    ownsRuntimeMotion: false,
    ownsRouteConduction: false,
    ownsSourceTruth: false,
    ownsTectonicCause: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialPalette: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
