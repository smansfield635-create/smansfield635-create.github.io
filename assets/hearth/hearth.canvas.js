// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas Hub / visible 2D receiver authority only.
// Purpose:
// - Create or bind the real Hearth DOM canvas surface inside #hearthCanvasMount.
// - Publish the Canvas Hub authority under current and compatibility aliases.
// - Keep the initial visible globe surface present until a stronger downstream expression replaces it.
// - Receive governed packets from Route Conductor, controls, Hex, finger, bridge, diagnostic, and downstream expression files.
// - Draw only what is available; when source truth is incomplete, draw the native initial holding globe.
// - Publish canvas surface truth, pixel proof, and receiver receipts upward.
// - Preserve Canvas as receiver/output carrier only.
// Does not own terrain truth, hydrology truth, elevation truth, materials truth, Hex truth,
// controls truth, route-conductor truth, diagnostic truth, F13, F21, ready text,
// final completion, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_2";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const NO_FINAL_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-expression-mount] canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-visible-globe-mount]",
    "[data-hearth-expression-mount]",
    "[data-hearth-canvas-expression-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-visible-globe-stage]",
    "[data-hearth-expression-stage]",
    "main",
    "body"
  ]);

  const DOWNSTREAM_DRAWABLE_PATHS = Object.freeze([
    "HEARTH.canvasFingerComposite",
    "HEARTH_CANVAS_FINGER_COMPOSITE",
    "DEXTER_LAB.hearthCanvasFingerComposite",

    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH_HEX_SURFACE",
    "DEXTER_LAB.hearthHexSurface",

    "HEARTH.canvasExpressionBridge",
    "HEARTH.canvasVisibleExpressionBridge",
    "HEARTH_CANVAS_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE",
    "DEXTER_LAB.hearthCanvasExpressionBridge",

    "HEARTH.landChannel",
    "HEARTH.waterChannel",
    "HEARTH.airChannel"
  ]);

  const OWN_ALIAS_PATHS = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubGovernedSourcePacketVisible2dReceiver",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent"
  ]);

  const api = {};

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,

    canvasElementFound: false,
    canvasCreated: false,
    canvasSelector: "UNKNOWN",
    canvasMountFound: false,
    canvasMountSelector: "UNKNOWN",
    canvasInMount: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasContext2dReady: false,
    canvasPixelVisible: false,
    canvasPixelVarianceStatus: "NO_PIXEL_SAMPLE",

    initialSurfaceActive: false,
    initialSurfaceDrawn: false,
    downstreamExpressionDrawn: false,
    downstreamExpressionSource: "NONE",
    downstreamExpressionMethod: "NONE",

    drawAttempted: false,
    drawComplete: false,
    drawCount: 0,
    lastDrawAt: "",
    lastDrawReason: "NOT_DRAWN",
    lastDrawSource: "NONE",
    lastDrawError: "",

    routeConductorObserved: false,
    routeConductorContract: "",
    controlObserved: false,
    controlContract: "",
    controlHandshakeStatus: "UNKNOWN",
    motionTouchStatus: "UNKNOWN",
    dragStatus: "UNKNOWN",
    viewControlStatus: "UNKNOWN",

    packetCount: 0,
    lastPacket: null,
    lastViewState: {
      yaw: 0,
      pitch: 0,
      scale: 1
    },

    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    renderedPlanetProofReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",

    receiptPublishCount: 0,
    updatedAt: "",

    ...NO_FINAL_CLAIMS
  };

  let canvas = null;
  let ctx = null;
  let drawTimer = 0;

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

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
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

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function q(selector) {
    try {
      return doc && selector ? doc.querySelector(selector) : null;
    } catch (_error) {
      return null;
    }
  }

  function firstElement(selectors) {
    for (const selector of selectors) {
      const found = q(selector);
      if (found) return { element: found, selector };
    }

    return { element: null, selector: "UNKNOWN" };
  }

  function getRect(element) {
    try {
      return element && isFunction(element.getBoundingClientRect)
        ? element.getBoundingClientRect()
        : null;
    } catch (_error) {
      return null;
    }
  }

  function rectNonzero(element) {
    const rect = getRect(element);
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function computedVisible(element) {
    try {
      if (!element || !root.getComputedStyle) return false;
      const style = root.getComputedStyle(element);
      return Boolean(
        style &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0
      );
    } catch (_error) {
      return false;
    }
  }

  function setRootDataset(key, value) {
    try {
      if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
      doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
    } catch (_error) {}
  }

  function chooseCanvasPixels(mount) {
    let cssWidth = 720;

    const rect = getRect(mount);
    if (rect && rect.width > 0) cssWidth = rect.width;

    if ((!cssWidth || cssWidth < 300) && root.innerWidth) {
      cssWidth = Math.min(820, Math.max(340, root.innerWidth * 0.86));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(cssWidth * ratio)));
  }

  function markCanvasSurface(targetCanvas) {
    if (!targetCanvas) return;

    targetCanvas.id = targetCanvas.id || "hearthCanvas";

    targetCanvas.setAttribute("data-hearth-visible-canvas", "true");
    targetCanvas.setAttribute("data-hearth-expression-surface", "true");
    targetCanvas.setAttribute("data-hearth-canvas", "true");
    targetCanvas.setAttribute("data-hearth-canvas-texture", "true");
    targetCanvas.setAttribute("data-hearth-planet-canvas", "true");
    targetCanvas.setAttribute("data-hearth-canvas-hub", "true");
    targetCanvas.setAttribute("data-contract", CONTRACT);
    targetCanvas.setAttribute("aria-label", "Hearth visible canvas surface");

    if (targetCanvas.dataset) {
      targetCanvas.dataset.hearthCanvasContract = CONTRACT;
      targetCanvas.dataset.hearthCanvasReceipt = RECEIPT;
      targetCanvas.dataset.hearthCanvasHub = "true";
      targetCanvas.dataset.hearthVisibleCanvas = "true";
      targetCanvas.dataset.hearthExpressionSurface = "true";
      targetCanvas.dataset.hearthCanvasTexture = "true";
      targetCanvas.dataset.generatedImage = "false";
      targetCanvas.dataset.graphicBox = "false";
      targetCanvas.dataset.webgl = "false";
      targetCanvas.dataset.visualPassClaimed = "false";
    }

    if (targetCanvas.style) {
      targetCanvas.style.display = "block";
      targetCanvas.style.width = "100%";
      targetCanvas.style.maxWidth = "min(88vw, 760px)";
      targetCanvas.style.height = "auto";
      targetCanvas.style.aspectRatio = "1 / 1";
      targetCanvas.style.margin = "0 auto";
      targetCanvas.style.borderRadius = "50%";
      targetCanvas.style.boxSizing = "border-box";
      targetCanvas.style.touchAction = "none";
      targetCanvas.style.background = "radial-gradient(circle at 50% 50%, rgba(7,21,48,.96), rgba(0,0,0,1))";
    }
  }

  function mountCanvas() {
    if (!doc) return false;

    let foundCanvas = null;
    let foundSelector = "UNKNOWN";

    for (const selector of CANVAS_SELECTORS) {
      const found = q(selector);
      if (found && found.tagName && found.tagName.toLowerCase() === "canvas") {
        foundCanvas = found;
        foundSelector = selector;
        break;
      }
    }

    const mountResult = firstElement(MOUNT_SELECTORS);
    const mount = mountResult.element;

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;

    if (!foundCanvas && mount) {
      foundCanvas = doc.createElement("canvas");
      foundCanvas.id = "hearthCanvas";
      foundCanvas.setAttribute("data-hearth-visible-canvas", "true");
      foundCanvas.setAttribute("data-hearth-expression-surface", "true");

      if (mount.firstChild) mount.insertBefore(foundCanvas, mount.firstChild);
      else mount.appendChild(foundCanvas);

      state.canvasCreated = true;
      foundSelector = "CREATED_BY_CANVAS_HUB";
    }

    if (!foundCanvas) {
      state.canvasElementFound = false;
      state.canvasSelector = "UNKNOWN";
      state.canvasContext2dReady = false;
      return false;
    }

    const px = chooseCanvasPixels(mount || foundCanvas.parentElement);

    if (!foundCanvas.width || foundCanvas.width < 256) foundCanvas.width = px;
    if (!foundCanvas.height || foundCanvas.height < 256) foundCanvas.height = px;

    markCanvasSurface(foundCanvas);

    try {
      ctx = foundCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_error) {
      ctx = null;
    }

    canvas = foundCanvas;

    state.canvasElementFound = true;
    state.canvasSelector = foundSelector;
    state.canvasInMount = Boolean(mount && mount.contains && mount.contains(foundCanvas));
    state.canvasWidth = safeNumber(foundCanvas.width, 0);
    state.canvasHeight = safeNumber(foundCanvas.height, 0);
    state.canvasRectNonzero = rectNonzero(foundCanvas) || Boolean(foundCanvas.width > 0 && foundCanvas.height > 0);
    state.canvasComputedVisible = computedVisible(foundCanvas);
    state.canvasContext2dReady = Boolean(ctx);
    state.mounted = Boolean(canvas && ctx);

    updateDataset();

    return state.mounted;
  }

  function canvasHasVisiblePixels() {
    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      state.canvasPixelVisible = false;
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.max(8, Math.min(28, Math.floor(Math.min(w, h) / 32)));
      const points = [
        [Math.floor(w * 0.5), Math.floor(h * 0.5)],
        [Math.floor(w * 0.36), Math.floor(h * 0.42)],
        [Math.floor(w * 0.64), Math.floor(h * 0.58)],
        [Math.floor(w * 0.48), Math.floor(h * 0.72)]
      ];

      let visible = 0;

      for (const point of points) {
        const x = Math.max(0, point[0] - Math.floor(size / 2));
        const y = Math.max(0, point[1] - Math.floor(size / 2));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let i = 0; i < data.length; i += 4) {
          if (
            data[i + 3] > 0 &&
            (data[i] > 5 || data[i + 1] > 5 || data[i + 2] > 5)
          ) {
            visible += 1;
            break;
          }
        }
      }

      state.canvasPixelVisible = visible > 0;
      state.canvasPixelVarianceStatus = visible > 0
        ? "PIXEL_SAMPLE_VISIBLE"
        : "PIXEL_SAMPLE_BLANK";

      return state.canvasPixelVisible;
    } catch (_error) {
      state.canvasPixelVisible = true;
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNREADABLE_ASSUME_DRAWN";
      return true;
    }
  }

  function drawBlob(targetCtx, cx, cy, r, seed, sx, sy, rotation) {
    const points = 22;
    targetCtx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wave =
        0.76 +
        Math.sin(t * 2 + seed) * 0.12 +
        Math.sin(t * 3.3 - seed) * 0.075 +
        Math.sin(t * 6.1 + seed * 0.4) * 0.045;

      const a = t + rotation;
      const x = cx + Math.cos(a) * r * wave * sx;
      const y = cy + Math.sin(a) * r * wave * sy;

      if (i === 0) targetCtx.moveTo(x, y);
      else targetCtx.lineTo(x, y);
    }

    targetCtx.closePath();
  }

  function drawInitialGlobe(reason = "initial-holding-surface") {
    if (!canvas || !ctx) return false;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.39;

      const view = state.lastViewState || {};
      const yaw = safeNumber(view.yaw, 0);
      const pitch = Math.max(-1.1, Math.min(1.1, safeNumber(view.pitch, 0)));
      const phase = yaw * 0.32;

      ctx.clearRect(0, 0, w, h);

      const back = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      back.addColorStop(0, "rgba(20,38,72,0.94)");
      back.addColorStop(0.62, "rgba(4,13,32,0.98)");
      back.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = back;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - r * 0.32,
        cy - r * 0.38 + pitch * r * 0.08,
        r * 0.08,
        cx,
        cy,
        r * 1.08
      );
      ocean.addColorStop(0, "rgba(95,178,231,0.98)");
      ocean.addColorStop(0.42, "rgba(19,95,153,0.98)");
      ocean.addColorStop(0.78, "rgba(7,42,104,1)");
      ocean.addColorStop(1, "rgba(1,7,30,1)");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = "rgba(215,238,255,0.26)";
      ctx.lineWidth = Math.max(1, r * 0.005);

      for (let i = -4; i <= 4; i += 1) {
        const y = cy + (i / 5) * r * 0.74 + Math.sin(phase + i) * r * 0.018 + pitch * r * 0.09;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.96, r * 0.105, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 8; i += 1) {
        const x = cx + Math.sin(phase + i * 0.7) * r * 0.74;
        ctx.beginPath();
        ctx.ellipse(x, cy + pitch * r * 0.04, r * 0.115, r * 0.94, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const masses = [
        [-0.36, -0.22, 0.34, 1.12, 0.70, 0.10],
        [0.22, -0.31, 0.24, 0.86, 1.18, 1.40],
        [0.35, 0.16, 0.30, 0.78, 1.04, 2.20],
        [-0.19, 0.20, 0.28, 1.08, 0.86, 3.10],
        [-0.55, 0.07, 0.17, 0.76, 1.34, 4.20],
        [0.03, -0.02, 0.18, 1.50, 0.56, 5.40],
        [0.00, 0.58, 0.21, 1.54, 0.36, 6.40]
      ];

      for (let i = 0; i < masses.length; i += 1) {
        const m = masses[i];
        const px = cx + m[0] * r + Math.sin(phase + i) * r * 0.03;
        const py = cy + m[1] * r + pitch * r * 0.12 + Math.cos(phase + i * 0.9) * r * 0.02;
        const rr = m[2] * r;

        const land = ctx.createLinearGradient(px - rr, py - rr, px + rr, py + rr);
        land.addColorStop(0, "rgba(155,128,74,0.98)");
        land.addColorStop(0.46, "rgba(91,128,76,0.98)");
        land.addColorStop(1, "rgba(49,76,54,0.98)");

        ctx.fillStyle = land;
        drawBlob(ctx, px, py, rr, m[5] + phase, m[3], m[4], phase * 0.18 + i * 0.2);
        ctx.fill();

        ctx.strokeStyle = "rgba(232,214,154,0.28)";
        ctx.lineWidth = Math.max(1, r * 0.004);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "rgba(255,255,255,0.60)";
      drawBlob(ctx, cx - r * 0.42, cy - r * 0.48 + pitch * r * 0.06, r * 0.10, 8.2 + phase, 1.8, 0.5, 0.1);
      ctx.fill();
      drawBlob(ctx, cx + r * 0.24, cy - r * 0.58 + pitch * r * 0.05, r * 0.08, 9.1 + phase, 2.2, 0.44, -0.2);
      ctx.fill();
      drawBlob(ctx, cx + r * 0.10, cy + r * 0.50 + pitch * r * 0.03, r * 0.12, 10.4 + phase, 1.9, 0.42, 0.05);
      ctx.fill();
      ctx.globalAlpha = 1;

      const shade = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.44, r * 0.1, cx, cy, r * 1.03);
      shade.addColorStop(0, "rgba(255,255,255,0.22)");
      shade.addColorStop(0.56, "rgba(255,255,255,0)");
      shade.addColorStop(0.88, "rgba(0,0,0,0.25)");
      shade.addColorStop(1, "rgba(0,0,0,0.66)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.strokeStyle = "rgba(210,234,255,0.55)";
      ctx.lineWidth = Math.max(1, r * 0.011);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      state.initialSurfaceActive = true;
      state.initialSurfaceDrawn = true;
      state.lastDrawSource = "CANVAS_NATIVE_INITIAL_SURFACE";
      state.lastDrawReason = reason;
      return true;
    } catch (error) {
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      return false;
    }
  }

  function drawableMethods(authority) {
    if (!authority || authority === api || !isObject(authority)) return [];

    return [
      "drawToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "renderToCanvas",
      "renderComposite",
      "renderFrame",
      "drawFrame",
      "render",
      "draw",
      "compose"
    ].filter((method) => isFunction(authority[method]));
  }

  function tryDownstreamDraw(packet = {}) {
    if (!canvas || !ctx) return false;

    for (const path of DOWNSTREAM_DRAWABLE_PATHS) {
      const authority = readPath(path);
      const methods = drawableMethods(authority);

      for (const method of methods) {
        try {
          let result;

          if (method === "drawToCanvas" || method === "renderToCanvas") {
            result = authority[method](canvas, makeDrawPacket(packet));
          } else {
            result = authority[method](makeDrawPacket(packet));
          }

          if (result === false) continue;

          if (canvasHasVisiblePixels()) {
            state.downstreamExpressionDrawn = true;
            state.downstreamExpressionSource = path;
            state.downstreamExpressionMethod = method;
            state.lastDrawSource = `DOWNSTREAM:${path}`;
            return true;
          }
        } catch (_error) {}
      }
    }

    return false;
  }

  function makeDrawPacket(packet = {}) {
    return {
      packetType: "HEARTH_CANVAS_HUB_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      canvas,
      ctx,
      context: ctx,
      viewState: clonePlain(state.lastViewState || {}),
      upstreamPacket: isObject(packet) ? clonePlain(packet) : null,
      receiverOnly: true,
      canvasHubActive: true,
      canvasMounted: Boolean(canvas && ctx),
      initialSurfaceActive: state.initialSurfaceActive,
      ...NO_FINAL_CLAIMS
    };
  }

  function updateProof() {
    const pixelReady = canvasHasVisiblePixels();

    state.canvasExpressionSurfaceReady = Boolean(canvas && ctx);
    state.domExpressionSurfaceProofReady = Boolean(canvas && ctx && state.canvasElementFound);
    state.canvasExpressionRichnessReady = Boolean(pixelReady);
    state.renderedPlanetProofReady = Boolean(pixelReady);
    state.visiblePlanetProofReady = Boolean(pixelReady);
    state.visiblePlanetProofSource = pixelReady
      ? state.lastDrawSource || "CANVAS_HUB_PIXEL_PROOF"
      : "NONE";

    state.drawComplete = Boolean(pixelReady);
    state.canvasRectNonzero = canvas ? rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0) : false;
    state.canvasComputedVisible = canvas ? computedVisible(canvas) : false;

    updateDataset();
  }

  function draw(packet = {}) {
    state.drawAttempted = true;
    state.drawCount += 1;
    state.lastDrawAt = nowIso();
    state.lastDrawReason = safeString(packet.reason || packet.drawReason || "draw", "draw");

    if (isObject(packet.viewState)) {
      state.lastViewState = {
        ...state.lastViewState,
        ...clonePlain(packet.viewState)
      };
    }

    if (!canvas || !ctx) mountCanvas();

    if (!canvas || !ctx) {
      state.drawComplete = false;
      state.lastDrawError = "CANVAS_OR_CONTEXT_NOT_AVAILABLE";
      updateProof();
      publishReceipts();
      return getReceiptLight();
    }

    const downstreamOk = tryDownstreamDraw(packet);

    if (!downstreamOk) {
      drawInitialGlobe(state.lastDrawReason);
    }

    updateProof();
    publishReceipts();
    notifyUpstream("draw");

    return getReceiptLight();
  }

  function scheduleDraw(reason = "scheduled-draw") {
    if (!root.setTimeout) return draw({ reason });
    if (drawTimer) return true;

    drawTimer = root.setTimeout(() => {
      drawTimer = 0;
      draw({ reason });
    }, 60);

    return true;
  }

  function receivePacket(packet = {}, lane = "GENERIC") {
    if (!isObject(packet)) return getReceiptLight();

    state.packetCount += 1;
    state.lastPacket = clonePlain(packet);

    if (isObject(packet.viewState)) {
      state.lastViewState = {
        ...state.lastViewState,
        ...clonePlain(packet.viewState)
      };
    }

    const contract = safeString(
      packet.contract ||
      packet.CONTRACT ||
      packet.currentContract ||
      packet.routeConductorContract ||
      packet.controlsContract ||
      ""
    );

    if (lane === "ROUTE_CONDUCTOR" || contract === ROUTE_CONDUCTOR_CONTRACT) {
      state.routeConductorObserved = true;
      state.routeConductorContract = contract || ROUTE_CONDUCTOR_CONTRACT;
    }

    if (lane === "CONTROL" || contract === CONTROL_CONTRACT) {
      state.controlObserved = true;
      state.controlContract = contract || CONTROL_CONTRACT;
      state.controlHandshakeStatus = "HANDSHAKE_VALID";
      state.motionTouchStatus = "ACTIVE";
      state.dragStatus = "ACTIVE";
      state.viewControlStatus = "ACTIVE";
    }

    if (
      packet.drawNow === true ||
      packet.visibleExpressionRequested === true ||
      packet.canvasReleaseAuthorized === true ||
      packet.canvas ||
      packet.ctx ||
      packet.context
    ) {
      return draw(packet);
    }

    scheduleDraw(`packet:${lane}`);
    publishReceipts();

    return getReceiptLight();
  }

  function receiveRouteConductorPacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function receiveCanvasReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function receiveReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function receiveCanvasHandoffPacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }

  function receiveControlPacket(packet = {}) { return receivePacket(packet, "CONTROL"); }
  function receiveControlsPacket(packet = {}) { return receivePacket(packet, "CONTROL"); }
  function receiveControlViewPacket(packet = {}) { return receivePacket(packet, "CONTROL"); }
  function receiveViewControlPacket(packet = {}) { return receivePacket(packet, "CONTROL"); }
  function receivePlanetaryControlPacket(packet = {}) { return receivePacket(packet, "CONTROL"); }

  function receiveHexPacket(packet = {}) { return receivePacket(packet, "HEX"); }
  function receiveFingerPacket(packet = {}) { return receivePacket(packet, "FINGER"); }
  function receiveCompositePacket(packet = {}) { return receivePacket(packet, "COMPOSITE"); }
  function receiveCanvasExpressionPacket(packet = {}) { return receivePacket(packet, "EXPRESSION"); }
  function receiveExpressionHubSummary(packet = {}) { return receivePacket(packet, "EXPRESSION"); }
  function receiveCanvasExpressionHubSummary(packet = {}) { return receivePacket(packet, "EXPRESSION"); }
  function receiveDiagnosticPacket(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }

  function updateDataset() {
    setRootDataset("hearthCanvasContract", CONTRACT);
    setRootDataset("hearthCanvasReceipt", RECEIPT);
    setRootDataset("hearthCanvasLoaded", "true");
    setRootDataset("hearthCanvasHubActive", "true");
    setRootDataset("hearthCanvasMounted", String(Boolean(canvas && ctx)));
    setRootDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setRootDataset("hearthCanvasSelector", state.canvasSelector);
    setRootDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setRootDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setRootDataset("hearthCanvasInMount", String(state.canvasInMount));
    setRootDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setRootDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setRootDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setRootDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setRootDataset("hearthCanvasPixelVarianceStatus", state.canvasPixelVarianceStatus);

    setRootDataset("hearthCanvasExpressionSurfaceReady", String(state.canvasExpressionSurfaceReady));
    setRootDataset("hearthCanvasExpressionRichnessReady", String(state.canvasExpressionRichnessReady));
    setRootDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));
    setRootDataset("hearthRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setRootDataset("hearthVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setRootDataset("hearthVisiblePlanetProofSource", state.visiblePlanetProofSource);

    setRootDataset("generatedImage", "false");
    setRootDataset("graphicBox", "false");
    setRootDataset("webgl", "false");
    setRootDataset("visualPassClaimed", "false");
    setRootDataset("hearthCanvasF13Claimed", "false");
    setRootDataset("hearthCanvasF21EligibleForNorth", "false");
    setRootDataset("hearthCanvasReadyTextAllowed", "false");
  }

  function publishOwnAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    OWN_ALIAS_PATHS.forEach((path) => setPath(path, api));

    return true;
  }

  function getReceiptLight() {
    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      loaded: state.loaded,
      booted: state.booted,
      mounted: state.mounted,
      canvasHubActive: true,
      receiverOnly: true,

      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasSelector: state.canvasSelector,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasInMount: state.canvasInMount,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,

      initialSurfaceActive: state.initialSurfaceActive,
      initialSurfaceDrawn: state.initialSurfaceDrawn,
      downstreamExpressionDrawn: state.downstreamExpressionDrawn,
      downstreamExpressionSource: state.downstreamExpressionSource,
      downstreamExpressionMethod: state.downstreamExpressionMethod,

      drawAttempted: state.drawAttempted,
      drawComplete: state.drawComplete,
      canvasDrawComplete: state.drawComplete,
      baseGlobeDrawComplete: state.drawComplete,
      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawReason: state.lastDrawReason,
      lastDrawSource: state.lastDrawSource,
      lastDrawError: state.lastDrawError,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      controlObserved: state.controlObserved,
      controlContract: state.controlContract,
      controlHandshakeStatus: state.controlHandshakeStatus,
      motionTouchStatus: state.motionTouchStatus,
      dragStatus: state.dragStatus,
      viewControlStatus: state.viewControlStatus,

      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,

      currentCanvasParentContract: CONTRACT,
      currentCanvasParentRecognized: true,
      canvasParentContractRecognized: true,

      ownsCanvasDomSurface: true,
      ownsCanvasMountBinding: true,
      ownsCanvasDrawing: true,
      ownsInitialHoldingSurface: true,
      ownsPixelProofPublication: true,

      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsControlTruth: false,
      ownsRouteConductorTruth: false,
      ownsDiagnosticTruth: false,

      packetCount: state.packetCount,
      receiptPublishCount: state.receiptPublishCount,
      updatedAt: state.updatedAt || nowIso(),

      ...NO_FINAL_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      packetType: "HEARTH_CANVAS_HUB_RECEIPT",
      ownAliasPaths: OWN_ALIAS_PATHS.slice(),
      downstreamDrawablePaths: DOWNSTREAM_DRAWABLE_PATHS.slice(),
      lastPacket: clonePlain(state.lastPacket),
      lastViewState: clonePlain(state.lastViewState),
      state: clonePlain(state),
      ...NO_FINAL_CLAIMS
    };
  }

  function publishReceipts() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const light = getReceiptLight();
    const full = getReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_HUB_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER_RECEIPT = full;

    hearth.canvasReceipt = light;
    hearth.canvasHubReceipt = full;
    hearth.canvasVisiblePlanetReceipt = light;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasHubReceipt = full;

    state.receiptPublishCount += 1;
    state.updatedAt = nowIso();

    updateDataset();

    return true;
  }

  function notifyUpstream(reason = "canvas-hub-update") {
    const receipt = getReceiptLight();

    const targets = [
      readPath("HEARTH.routeConductor"),
      readPath("HEARTH_ROUTE_CONDUCTOR"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("HEARTH.canvasExpressionBridge"),
      readPath("HEARTH_CANVAS_EXPRESSION_BRIDGE"),
      readPath("DEXTER_LAB.hearthCanvasExpressionBridge")
    ].filter((target) => target && target !== api && isObject(target));

    const methods = [
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasHubReceipt",
      "receiveCanvasVisibleProof",
      "receiveVisiblePlanetReceipt",
      "receiveCanvasExpressionPacket",
      "receivePacket"
    ];

    targets.forEach((target) => {
      methods.forEach((method) => {
        if (!isFunction(target[method])) return;

        try {
          target[method]({
            ...clonePlain(receipt),
            packetType: "HEARTH_CANVAS_HUB_UPSTREAM_NOTICE",
            noticeReason: reason,
            sourceFile: FILE,
            ...NO_FINAL_CLAIMS
          });
        } catch (_error) {}
      });
    });

    return true;
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;

    try {
      publishOwnAliases();
      mountCanvas();

      state.booted = true;
      state.updatedAt = nowIso();

      updateDataset();
      publishReceipts();

      if (options.drawNow !== false) {
        scheduleDraw(options.reason || "boot");
      }

      notifyUpstream("boot");

      return getReceipt();
    } finally {
      state.booting = false;
    }
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function mount(options = {}) { return boot(options); }
  function render(packet = {}) { return draw(packet); }
  function drawToCanvas(targetCanvas, packet = {}) {
    if (targetCanvas && targetCanvas.getContext) {
      canvas = targetCanvas;
      markCanvasSurface(canvas);

      try {
        ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      } catch (_error) {
        ctx = null;
      }

      state.canvasElementFound = true;
      state.canvasSelector = "ARGUMENT";
      state.canvasContext2dReady = Boolean(ctx);
      state.mounted = Boolean(canvas && ctx);
    }

    return draw(packet);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    boot,
    init,
    start,
    mount,
    render,
    draw,
    drawToCanvas,
    scheduleDraw,

    receivePacket,
    receiveRouteConductorPacket,
    receiveCanvasReleasePacket,
    receiveReleasePacket,
    receiveCanvasHandoffPacket,

    receiveControlPacket,
    receiveControlsPacket,
    receiveControlViewPacket,
    receiveViewControlPacket,
    receivePlanetaryControlPacket,

    receiveHexPacket,
    receiveFingerPacket,
    receiveCompositePacket,
    receiveCanvasExpressionPacket,
    receiveExpressionHubSummary,
    receiveCanvasExpressionHubSummary,
    receiveDiagnosticPacket,

    getReceiptLight,
    getReceipt,
    getCanvasStationSummary: getReceiptLight,
    getCanvasStationReceiptLight: getReceiptLight,
    getCanvasStationReceipt: getReceipt,
    getVisiblePlanetReceipt: getReceiptLight,
    getVisibleGlobeReceipt: getReceiptLight,
    getStructuralCarrier: getReceiptLight,
    readStructuralCarrier: getReceiptLight,
    getCarrierReceipt: getReceiptLight,
    getState: () => clonePlain(state),

    publishOwnAliases,
    publishReceipts,
    updateDataset,
    notifyUpstream,

    supportsCanvasDomSurfaceCreation: true,
    supportsCanvasMountBinding: true,
    supportsVisible2dCanvas: true,
    supportsInitialHoldingSurface: true,
    supportsDownstreamExpressionReplacement: true,
    supportsPixelProofPublication: true,
    supportsRouteConductorHandshake: true,
    supportsControlPacketReceipt: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,
    supportsNoWebGL: true,

    ownsCanvasDomSurface: true,
    ownsCanvasMountBinding: true,
    ownsCanvasDrawing: true,
    ownsInitialHoldingSurface: true,
    ownsPixelProofPublication: true,

    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsHexTruth: false,
    ownsFingerTruth: false,
    ownsControlTruth: false,
    ownsRouteConductorTruth: false,
    ownsDiagnosticTruth: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...NO_FINAL_CLAIMS,

    get canvas() {
      return canvas;
    },

    get context() {
      return ctx;
    },

    get ctx() {
      return ctx;
    },

    get state() {
      return state;
    }
  });

  try {
    publishOwnAliases();
    updateDataset();
    publishReceipts();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener(
          "DOMContentLoaded",
          () => boot({ reason: "dom-content-loaded" }),
          { once: true }
        );
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime", drawNow: false });
    }

    if (root.setTimeout) {
      root.setTimeout(() => {
        publishOwnAliases();
        mountCanvas();
        draw({ reason: "post-publication-surface-confirmation" });
        notifyUpstream("post-publication-surface-confirmation");
      }, 220);

      root.setTimeout(() => {
        publishOwnAliases();
        mountCanvas();
        draw({ reason: "post-publication-expression-confirmation" });
        notifyUpstream("post-publication-expression-confirmation");
      }, 880);
    }
  } catch (_error) {
    try {
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
