// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Full-file replacement.
// Canvas receiver/output carrier only.
// Purpose:
// - Create or bind a real DOM <canvas> inside #hearthCanvasMount.
// - Preserve Canvas as receiver/output carrier, not terrain, hydrology, material, motion, route, or visual-pass authority.
// - Publish the Canvas parent contract and namespace aliases expected by the diagnostic rail.
// - Provide a first fast 2D surface preface so Canvas surface truth can inspect DOM, rect, visibility, context, and pixels.
// - Allow later downstream expression packets to replace the preface without requiring a baseline planetary rewrite.
// - Preserve controls/runtime separation.
// Does not own:
// - terrain truth
// - hydrology truth
// - material truth
// - route orchestration
// - controls or drag admission
// - runtime restart
// - diagnostic rail
// - final visual pass
// - F13/F21 latch
// - ready text
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_DOM_SURFACE_BINDING_AND_PREFACE_RECEIVER_TNT_v12_3_1";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_DOM_SURFACE_BINDING_AND_PREFACE_RECEIVER_RECEIPT_v12_3_1";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const MOUNT_SELECTOR = "#hearthCanvasMount";
  const CANVAS_ID = "hearthCanvasSurface";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
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
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    mounted: false,
    started: false,
    canvas: null,
    ctx: null,
    mount: null,
    sourcePacket: null,
    prefaceActive: true,
    downstreamExpressionAccepted: false,
    lastRenderStatus: "NOT_RENDERED",
    lastRenderReason: "CANVAS_NOT_MOUNTED",
    lastPixelSampleStatus: "NO_SAMPLE",
    lastPixelVisible: false,
    lastUpdatedAt: "",
    notes: []
  };

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
    return String(value);
  }

  function bounded(value, limit = 2000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
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

  function addNote(note) {
    const clean = bounded(note, 1200);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function isCanvasLike(value) {
    return Boolean(
      value &&
        value.nodeType === 1 &&
        safeString(value.tagName).toUpperCase() === "CANVAS" &&
        isFunction(value.getContext)
    );
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function resolveMount(target) {
    if (!doc) return null;

    if (isElement(target)) return target;

    if (isObject(target)) {
      if (isElement(target.mount)) return target.mount;
      if (isElement(target.mountElement)) return target.mountElement;
      if (isElement(target.targetElement)) return target.targetElement;

      const selector = firstKnownText(
        target.mountSelector,
        target.targetSelector,
        target.selector,
        MOUNT_SELECTOR
      );

      try {
        const selected = doc.querySelector(selector);
        if (selected) return selected;
      } catch (_error) {}
    }

    if (typeof target === "string" && target.trim()) {
      try {
        const selected = doc.querySelector(target.trim());
        if (selected) return selected;
      } catch (_error) {}
    }

    try {
      return doc.querySelector(MOUNT_SELECTOR);
    } catch (_error) {
      return null;
    }
  }

  function firstKnownText(...values) {
    for (const value of values) {
      const text = bounded(value, 2000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      return text;
    }

    return "UNKNOWN";
  }

  function findExistingCanvas(mount) {
    if (!doc) return null;

    const selectors = [
      `#${CANVAS_ID}`,
      'canvas[data-hearth-canvas-surface="true"]',
      'canvas[data-hearth-canvas="true"]',
      'canvas[data-hearth-canvas-contract]',
      `${MOUNT_SELECTOR} canvas`
    ];

    for (const selector of selectors) {
      try {
        const found = doc.querySelector(selector);
        if (isCanvasLike(found)) return found;
      } catch (_error) {}
    }

    if (mount) {
      try {
        const inMount = mount.querySelector("canvas");
        if (isCanvasLike(inMount)) return inMount;
      } catch (_error) {}
    }

    return null;
  }

  function prepareMount(mount) {
    if (!mount) return;

    try {
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasMountContract = CONTRACT;
      mount.dataset.hearthCanvasMountReceipt = RECEIPT;
      mount.dataset.hearthCanvasSurfaceExpected = "true";
      mount.dataset.generatedImage = "false";
      mount.dataset.graphicBox = "false";
      mount.dataset.webgl = "false";
      mount.dataset.visualPassClaimed = "false";
    } catch (_error) {}

    try {
      const computed = root.getComputedStyle ? root.getComputedStyle(mount) : null;

      if (!computed || computed.position === "static") {
        mount.style.position = "relative";
      }

      if (!mount.style.minHeight) {
        mount.style.minHeight = "320px";
      }

      if (!mount.style.overflow) {
        mount.style.overflow = "hidden";
      }
    } catch (_error) {}
  }

  function createCanvas() {
    if (!doc) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = CANVAS_ID;
    canvas.setAttribute("aria-label", "Hearth canvas surface");
    canvas.setAttribute("role", "img");
    return canvas;
  }

  function bindCanvas(canvas, mount) {
    if (!canvas || !mount) return false;

    try {
      if (canvas.parentElement !== mount) {
        mount.appendChild(canvas);
      }
    } catch (_error) {
      return false;
    }

    canvas.dataset.hearthCanvasSurface = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasFile = FILE;
    canvas.dataset.hearthCanvasParentContract = CONTRACT;
    canvas.dataset.hearthCanvasParentRecognized = "true";
    canvas.dataset.hearthCanvasAuthority = "receiver-output-carrier";
    canvas.dataset.hearthCanvasOwnsTerrainTruth = "false";
    canvas.dataset.hearthCanvasOwnsHydrologyTruth = "false";
    canvas.dataset.hearthCanvasOwnsMaterialTruth = "false";
    canvas.dataset.hearthCanvasOwnsMotion = "false";
    canvas.dataset.hearthCanvasOwnsFinalVisualPass = "false";
    canvas.dataset.hearthCanvasPrefaceActive = state.prefaceActive ? "true" : "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.f13Claimed = "false";
    canvas.dataset.f21Claimed = "false";
    canvas.dataset.readyTextClaimed = "false";

    canvas.style.display = "block";
    canvas.style.boxSizing = "border-box";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minHeight = "320px";
    canvas.style.maxWidth = "100%";
    canvas.style.touchAction = "none";
    canvas.style.pointerEvents = "auto";

    state.canvas = canvas;

    try {
      state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (_error) {
      state.ctx = null;
    }

    return Boolean(state.ctx);
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0
      };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        left: Number(rect.left) || 0,
        top: Number(rect.top) || 0,
        width: Number(rect.width) || 0,
        height: Number(rect.height) || 0,
        right: Number(rect.right) || 0,
        bottom: Number(rect.bottom) || 0
      };
    } catch (_error) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0
      };
    }
  }

  function rectNonzero(rect) {
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function viewportIntersecting(rect) {
    if (!rectNonzero(rect)) return false;

    const width =
      Number(root.innerWidth) ||
      Number(doc && doc.documentElement && doc.documentElement.clientWidth) ||
      0;
    const height =
      Number(root.innerHeight) ||
      Number(doc && doc.documentElement && doc.documentElement.clientHeight) ||
      0;

    if (width <= 0 || height <= 0) return false;

    return rect.right > 0 && rect.bottom > 0 && rect.left < width && rect.top < height;
  }

  function computedVisible(element) {
    if (!element) return false;

    try {
      const style = root.getComputedStyle ? root.getComputedStyle(element) : null;
      if (!style) return true;

      const displayOk = style.display !== "none";
      const visibilityOk = style.visibility !== "hidden" && style.visibility !== "collapse";
      const opacityOk = Number(style.opacity) > 0;

      return Boolean(displayOk && visibilityOk && opacityOk);
    } catch (_error) {
      return true;
    }
  }

  function resizeSurface() {
    const canvas = state.canvas;
    if (!canvas) return false;

    const rect = getRect(canvas);
    const mountRect = getRect(state.mount);
    const dpr = Math.max(1, Math.min(2.5, Number(root.devicePixelRatio) || 1));

    const cssWidth = Math.max(320, Math.round(rect.width || mountRect.width || 720));
    const cssHeight = Math.max(320, Math.round(rect.height || mountRect.height || 720));

    const nextWidth = Math.max(1, Math.round(cssWidth * dpr));
    const nextHeight = Math.max(1, Math.round(cssHeight * dpr));

    if (canvas.width !== nextWidth) canvas.width = nextWidth;
    if (canvas.height !== nextHeight) canvas.height = nextHeight;

    return true;
  }

  function clearSurface() {
    if (!state.ctx || !state.canvas) return;

    try {
      state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    } catch (_error) {}
  }

  function drawPreface() {
    if (!state.ctx || !state.canvas) {
      state.lastRenderStatus = "PREFACE_NOT_RENDERED";
      state.lastRenderReason = "CANVAS_CONTEXT_2D_NOT_READY";
      return false;
    }

    resizeSurface();

    const canvas = state.canvas;
    const ctx = state.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.38;

    try {
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#05070b");
      bg.addColorStop(0.5, "#07111d");
      bg.addColorStop(1, "#020308");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(cx, cy, radius * 0.12, cx, cy, radius * 1.55);
      glow.addColorStop(0, "rgba(76, 156, 255, 0.26)");
      glow.addColorStop(0.48, "rgba(24, 88, 160, 0.18)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      const sphere = ctx.createRadialGradient(
        cx - radius * 0.32,
        cy - radius * 0.36,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphere.addColorStop(0, "#8fc6ff");
      sphere.addColorStop(0.22, "#2d7fc1");
      sphere.addColorStop(0.56, "#17446d");
      sphere.addColorStop(1, "#071a2d");

      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = "rgba(61, 113, 67, 0.86)";
      ctx.beginPath();
      ctx.ellipse(cx - radius * 0.24, cy - radius * 0.08, radius * 0.24, radius * 0.36, -0.52, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx + radius * 0.22, cy + radius * 0.1, radius * 0.21, radius * 0.32, 0.38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(112, 96, 62, 0.58)";
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.52, cy + radius * 0.02);
      ctx.lineTo(cx - radius * 0.28, cy - radius * 0.18);
      ctx.lineTo(cx - radius * 0.08, cy + radius * 0.2);
      ctx.lineTo(cx - radius * 0.36, cy + radius * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + radius * 0.1, cy - radius * 0.3);
      ctx.lineTo(cx + radius * 0.42, cy - radius * 0.16);
      ctx.lineTo(cx + radius * 0.34, cy + radius * 0.18);
      ctx.lineTo(cx + radius * 0.02, cy + radius * 0.04);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      ctx.strokeStyle = "rgba(166, 213, 255, 0.46)";
      ctx.lineWidth = Math.max(1, size * 0.004);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      state.prefaceActive = true;
      state.downstreamExpressionAccepted = false;
      state.lastRenderStatus = "PREFACE_RENDERED";
      state.lastRenderReason = "FIRST_FAST_CANVAS_SURFACE_READY_WITHOUT_FINAL_VISUAL_PASS_CLAIM";
      state.lastUpdatedAt = nowIso();
      samplePixel();
      addNote("CANVAS_PREFACE_RENDERED_REAL_2D_SURFACE_NO_FINAL_VISUAL_PASS_CLAIM");
      publishGlobals();
      return true;
    } catch (error) {
      state.lastRenderStatus = "PREFACE_RENDER_FAILED";
      state.lastRenderReason = bounded(error && error.message ? error.message : error, 1000);
      addNote(`CANVAS_PREFACE_RENDER_FAILED:${state.lastRenderReason}`);
      publishGlobals();
      return false;
    }
  }

  function tryPutImageData(packet) {
    if (!state.ctx || !state.canvas || !isObject(packet)) return false;

    const imageData = packet.imageData || packet.IMAGE_DATA;
    const ImageDataCtor = root.ImageData;

    try {
      if (ImageDataCtor && imageData instanceof ImageDataCtor) {
        resizeSurface();
        state.ctx.putImageData(imageData, 0, 0);
        return true;
      }
    } catch (_error) {}

    const pixels = packet.pixels || packet.rgba || packet.RGBA;
    const width = Number(packet.width || packet.WIDTH || packet.pixelWidth || packet.PIXEL_WIDTH);
    const height = Number(packet.height || packet.HEIGHT || packet.pixelHeight || packet.PIXEL_HEIGHT);

    if (!pixels || !width || !height || !ImageDataCtor) return false;

    try {
      const data =
        pixels instanceof Uint8ClampedArray
          ? pixels
          : Array.isArray(pixels)
            ? new Uint8ClampedArray(pixels)
            : null;

      if (!data || data.length < width * height * 4) return false;

      const next = new ImageDataCtor(data, width, height);
      resizeSurface();
      state.ctx.putImageData(next, 0, 0);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function tryDrawCanvasSource(packet) {
    if (!state.ctx || !state.canvas || !isObject(packet)) return false;

    const candidates = [];

    if (isCanvasLike(packet)) candidates.push(packet);
    if (isCanvasLike(packet.canvas)) candidates.push(packet.canvas);
    if (isCanvasLike(packet.surfaceCanvas)) candidates.push(packet.surfaceCanvas);
    if (isCanvasLike(packet.textureCanvas)) candidates.push(packet.textureCanvas);

    for (const method of ["getCanvas", "getSurfaceCanvas", "getTextureCanvas"]) {
      if (!isFunction(packet[method])) continue;
      try {
        const output = packet[method]();
        if (isCanvasLike(output)) candidates.push(output);
      } catch (_error) {}
    }

    for (const candidate of candidates) {
      try {
        resizeSurface();
        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        state.ctx.drawImage(candidate, 0, 0, state.canvas.width, state.canvas.height);
        return true;
      } catch (_error) {}
    }

    return false;
  }

  function tryCallCanvasRenderer(packet) {
    if (!state.ctx || !state.canvas || !isObject(packet)) return false;

    const methods = [
      "renderToCanvas",
      "drawToCanvas",
      "paintToCanvas",
      "composeToCanvas",
      "receiveCanvas",
      "mountCanvasSurface"
    ];

    for (const method of methods) {
      if (!isFunction(packet[method])) continue;

      try {
        const output = packet[method]({
          canvas: state.canvas,
          context: state.ctx,
          ctx: state.ctx,
          width: state.canvas.width,
          height: state.canvas.height,
          contract: CONTRACT,
          receipt: RECEIPT,
          finalVisualPassClaimed: false,
          generatedImage: false,
          graphicBox: false,
          webgl: false
        });

        if (output !== false) return true;
      } catch (_error) {}
    }

    return false;
  }

  function renderSourcePacket(packet) {
    if (!state.canvas || !state.ctx) {
      state.lastRenderStatus = "SOURCE_NOT_RENDERED";
      state.lastRenderReason = "CANVAS_CONTEXT_2D_NOT_READY";
      publishGlobals();
      return false;
    }

    if (!packet || packet === api) {
      return drawPreface();
    }

    resizeSurface();

    const rendered =
      tryPutImageData(packet) ||
      tryDrawCanvasSource(packet) ||
      tryCallCanvasRenderer(packet) ||
      (isObject(packet.surface) && renderSourcePacket(packet.surface)) ||
      (isObject(packet.canvasSurface) && renderSourcePacket(packet.canvasSurface)) ||
      false;

    if (!rendered) {
      state.sourcePacket = packet;
      state.prefaceActive = true;
      state.downstreamExpressionAccepted = false;
      state.lastRenderStatus = "SOURCE_PACKET_NOT_RENDERABLE_PREFACE_RETAINED";
      state.lastRenderReason =
        "DOWNSTREAM_PACKET_DID_NOT_EXPOSE_RENDERABLE_2D_CANVAS_SURFACE";
      drawPreface();
      return false;
    }

    state.sourcePacket = packet;
    state.prefaceActive = false;
    state.downstreamExpressionAccepted = true;
    state.lastRenderStatus = "DOWNSTREAM_EXPRESSION_RENDERED_TO_CANVAS_SURFACE";
    state.lastRenderReason = "RENDERABLE_DOWNSTREAM_PACKET_ACCEPTED_BY_CANVAS_RECEIVER";
    state.lastUpdatedAt = nowIso();

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasPrefaceActive = "false";
      state.canvas.dataset.hearthDownstreamExpressionAccepted = "true";
    }

    samplePixel();
    addNote("DOWNSTREAM_EXPRESSION_RENDERED_TO_REAL_CANVAS_SURFACE_NO_FINAL_VISUAL_PASS_CLAIM");
    publishGlobals();
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

  function collectDeferredSourceCandidates() {
    return [
      "HEARTH.canvasSurfacePointer",
      "HEARTH.hexSurface",
      "HEARTH.hexFourPairAuthority",
      "HEARTH.fingerInspectComposite",
      "HEARTH.fingerExpressionComposite",
      "HEARTH.surfacePacket",
      "HEARTH.expressionPacket",
      "HEARTH.renderPacket",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_PACKET",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthCanvasExpressionPacket",
      "DEXTER_LAB.hearthCanvasSurfacePacket"
    ]
      .map((path) => ({ path, value: readPath(path) }))
      .filter((entry) => Boolean(entry.value && entry.value !== api));
  }

  function renderDeferredSourceIfAvailable() {
    const candidates = collectDeferredSourceCandidates();

    for (const candidate of candidates) {
      const rendered = renderSourcePacket(candidate.value);

      if (rendered) {
        addNote(`DEFERRED_SOURCE_ACCEPTED:${candidate.path}`);
        return true;
      }
    }

    addNote("DEFERRED_SOURCE_NOT_AVAILABLE_PREFACE_RETAINED");
    return false;
  }

  function samplePixel() {
    const canvas = state.canvas;
    const ctx = state.ctx;

    if (!canvas || !ctx) {
      state.lastPixelSampleStatus = "NO_CONTEXT";
      state.lastPixelVisible = false;
      return false;
    }

    try {
      const x = Math.max(0, Math.floor(canvas.width / 2));
      const y = Math.max(0, Math.floor(canvas.height / 2));
      const data = ctx.getImageData(x, y, 1, 1).data;
      const visible = Boolean(data && data.length >= 4 && data[3] > 0);

      state.lastPixelSampleStatus = visible
        ? "PIXEL_SAMPLE_VISIBLE"
        : "PIXEL_SAMPLE_TRANSPARENT_OR_EMPTY";
      state.lastPixelVisible = visible;
      return visible;
    } catch (error) {
      state.lastPixelSampleStatus = `PIXEL_SAMPLE_BLOCKED_OR_UNREADABLE:${bounded(
        error && error.message ? error.message : error,
        400
      )}`;
      state.lastPixelVisible = false;
      return false;
    }
  }

  function mountSurface(target, options = {}) {
    if (!doc) {
      state.lastRenderStatus = "MOUNT_FAILED";
      state.lastRenderReason = "DOCUMENT_UNAVAILABLE";
      publishGlobals();
      return false;
    }

    const resolvedTarget = isObject(target) && !isElement(target) ? target : options;
    const mount = resolveMount(target);

    if (!mount) {
      state.mounted = false;
      state.mount = null;
      state.canvas = null;
      state.ctx = null;
      state.lastRenderStatus = "MOUNT_WAITING";
      state.lastRenderReason = "HEARTH_CANVAS_MOUNT_NOT_FOUND";
      addNote("CANVAS_MOUNT_NOT_FOUND_NO_HTML_REPAIR_PERFORMED");
      publishGlobals();
      return false;
    }

    prepareMount(mount);

    let canvas = findExistingCanvas(mount);
    if (!canvas) {
      canvas = createCanvas();
      addNote("CANVAS_DOM_SURFACE_CREATED_BY_CANVAS_RECEIVER");
    } else {
      addNote("CANVAS_DOM_SURFACE_BOUND_BY_CANVAS_RECEIVER");
    }

    const contextReady = bindCanvas(canvas, mount);

    state.mount = mount;
    state.mounted = Boolean(canvas && contextReady);
    state.lastRenderStatus = state.mounted
      ? "CANVAS_SURFACE_MOUNTED"
      : "CANVAS_SURFACE_CONTEXT_2D_NOT_READY";
    state.lastRenderReason = state.mounted
      ? "REAL_DOM_CANVAS_BOUND_INSIDE_HEARTH_CANVAS_MOUNT"
      : "CANVAS_ELEMENT_PRESENT_BUT_2D_CONTEXT_UNAVAILABLE";

    if (state.mounted) {
      resizeSurface();

      if (resolvedTarget && resolvedTarget.sourcePacket) {
        renderSourcePacket(resolvedTarget.sourcePacket);
      } else if (resolvedTarget && resolvedTarget.packet) {
        renderSourcePacket(resolvedTarget.packet);
      } else {
        drawPreface();
        safeRequestFrame(() => {
          renderDeferredSourceIfAvailable();
          publishGlobals();
        });
      }
    }

    publishGlobals();
    return state.mounted;
  }

  function safeRequestFrame(callback) {
    if (isFunction(root.requestAnimationFrame)) {
      root.requestAnimationFrame(callback);
      return;
    }

    setTimeout(callback, 16);
  }

  function boot(options = {}) {
    mountSurface(options);
    state.started = true;
    publishGlobals();
    return api;
  }

  function init(options = {}) {
    return boot(options);
  }

  function start(options = {}) {
    return boot(options);
  }

  function receive(packet) {
    if (!state.mounted) mountSurface();

    if (!state.mounted) {
      state.sourcePacket = packet || null;
      state.lastRenderStatus = "SOURCE_RECEIVED_CANVAS_NOT_MOUNTED";
      state.lastRenderReason = "SOURCE_PACKET_STORED_UNTIL_CANVAS_SURFACE_AVAILABLE";
      publishGlobals();
      return false;
    }

    return renderSourcePacket(packet);
  }

  function render(packet) {
    return receive(packet);
  }

  function redraw(packet) {
    if (packet) return receive(packet);
    if (state.sourcePacket) return receive(state.sourcePacket);
    return drawPreface();
  }

  function resize() {
    const resized = resizeSurface();
    if (resized) redraw();
    publishGlobals();
    return resized;
  }

  function getCanvas() {
    return state.canvas || null;
  }

  function getContext() {
    return state.ctx || null;
  }

  function getSurface() {
    return {
      canvas: state.canvas || null,
      context: state.ctx || null,
      ctx: state.ctx || null,
      mount: state.mount || null,
      contract: CONTRACT,
      receipt: RECEIPT,
      finalVisualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webgl: false
    };
  }

  function inspectSurface() {
    const mount = state.mount || resolveMount();
    const canvas = state.canvas || findExistingCanvas(mount);
    const rect = getRect(canvas);
    const mountRect = getRect(mount);
    const canvasFound = isCanvasLike(canvas);
    const canvasInMount = Boolean(canvasFound && mount && canvas.parentElement === mount);
    const ctxReady = Boolean(state.ctx || (canvasFound && isFunction(canvas.getContext) && canvas.getContext("2d")));

    let computed = {};
    try {
      const style = canvas && root.getComputedStyle ? root.getComputedStyle(canvas) : null;
      computed = style
        ? {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position,
            zIndex: style.zIndex,
            pointerEvents: style.pointerEvents
          }
        : {};
    } catch (_error) {}

    const layerBlocked = false;

    return {
      CANVAS_MOUNT_FOUND: Boolean(mount),
      CANVAS_MOUNT_SELECTOR: mount ? MOUNT_SELECTOR : "UNKNOWN",
      CANVAS_MOUNT_DESCRIPTOR: mount
        ? `${safeString(mount.tagName).toLowerCase()}#${safeString(mount.id, "")}`
        : "UNKNOWN",
      CANVAS_ELEMENT_FOUND: canvasFound,
      CANVAS_SELECTOR: canvasFound ? `#${canvas.id || CANVAS_ID}` : "UNKNOWN",
      CANVAS_TAG: canvasFound ? safeString(canvas.tagName).toLowerCase() : "UNKNOWN",
      CANVAS_ID: canvasFound ? safeString(canvas.id, "UNKNOWN") : "UNKNOWN",
      CANVAS_CLASS: canvasFound ? safeString(canvas.className, "") : "UNKNOWN",
      CANVAS_DATASET_CONTRACT: canvasFound
        ? safeString(canvas.dataset.hearthCanvasContract, "UNKNOWN")
        : "UNKNOWN",
      CANVAS_DATASET_RECEIPT: canvasFound
        ? safeString(canvas.dataset.hearthCanvasReceipt, "UNKNOWN")
        : "UNKNOWN",
      CANVAS_IN_MOUNT: canvasInMount,
      CANVAS_WIDTH_ATTRIBUTE: canvasFound ? canvas.width : 0,
      CANVAS_HEIGHT_ATTRIBUTE: canvasFound ? canvas.height : 0,
      CANVAS_INTERNAL_SIZE_NONZERO: canvasFound ? canvas.width > 0 && canvas.height > 0 : false,
      CANVAS_RECT_LEFT: rect.left,
      CANVAS_RECT_TOP: rect.top,
      CANVAS_RECT_WIDTH: rect.width,
      CANVAS_RECT_HEIGHT: rect.height,
      CANVAS_RECT_NONZERO: rectNonzero(rect),
      CANVAS_COMPUTED_VISIBLE: canvasFound ? computedVisible(canvas) : false,
      CANVAS_COMPUTED_DISPLAY: computed.display || "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: computed.visibility || "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: computed.opacity || "UNKNOWN",
      CANVAS_COMPUTED_POSITION: computed.position || "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: computed.zIndex || "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: computed.pointerEvents || "UNKNOWN",
      CANVAS_VIEWPORT_WIDTH:
        Number(root.innerWidth) ||
        Number(doc && doc.documentElement && doc.documentElement.clientWidth) ||
        0,
      CANVAS_VIEWPORT_HEIGHT:
        Number(root.innerHeight) ||
        Number(doc && doc.documentElement && doc.documentElement.clientHeight) ||
        0,
      CANVAS_VIEWPORT_INTERSECTING: viewportIntersecting(rect),
      CANVAS_CONTEXT_2D_READY: ctxReady,
      CANVAS_CONTEXT_2D_STATUS: ctxReady ? "CANVAS_2D_CONTEXT_READY" : "CANVAS_2D_CONTEXT_NOT_READY",
      CANVAS_PIXEL_SAMPLE_STATUS: state.lastPixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: state.lastPixelVisible,
      CANVAS_LAYER_BLOCKED: layerBlocked,
      CANVAS_LAYER_BLOCKER: "NONE",
      CANVAS_NAMESPACE_PRESENT: true,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: canvasFound && state.canvas === canvas,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: true,
      CURRENT_CANVAS_PARENT_CONTRACT: CONTRACT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: true,
      CANVAS_MOUNT_RECT_WIDTH: mountRect.width,
      CANVAS_MOUNT_RECT_HEIGHT: mountRect.height
    };
  }

  function getReceiptLight() {
    const surface = inspectSurface();

    return {
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_CONTRACT,
      VERSION:
        "2026-06-07.hearth-canvas-dom-surface-binding-preface-receiver-v12-3-1",
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,

      parentRole: "CANVAS_RECEIVER_OUTPUT_CARRIER",
      canvasAuthority: "RECEIVER_OUTPUT_CARRIER_ONLY",
      canvasCreatesOrBindsRealDomCanvasSurface: true,
      canvasMountSelector: MOUNT_SELECTOR,
      canvasSelector: surface.CANVAS_SELECTOR,

      CANVAS_SURFACE_STATUS: state.mounted
        ? "REAL_DOM_CANVAS_SURFACE_BOUND"
        : "CANVAS_SURFACE_NOT_BOUND",
      CANVAS_SURFACE_TRUTH_AVAILABLE: surface.CANVAS_ELEMENT_FOUND,
      CANVAS_ELEMENT_FOUND: surface.CANVAS_ELEMENT_FOUND,
      CANVAS_MOUNT_FOUND: surface.CANVAS_MOUNT_FOUND,
      CANVAS_MOUNT_SELECTOR: surface.CANVAS_MOUNT_SELECTOR,
      CANVAS_IN_MOUNT: surface.CANVAS_IN_MOUNT,
      CANVAS_RECT_NONZERO: surface.CANVAS_RECT_NONZERO,
      CANVAS_COMPUTED_VISIBLE: surface.CANVAS_COMPUTED_VISIBLE,
      CANVAS_VIEWPORT_INTERSECTING: surface.CANVAS_VIEWPORT_INTERSECTING,
      CANVAS_CONTEXT_2D_READY: surface.CANVAS_CONTEXT_2D_READY,
      CANVAS_PIXEL_SAMPLE_STATUS: surface.CANVAS_PIXEL_SAMPLE_STATUS,
      CANVAS_PIXEL_VISIBLE: surface.CANVAS_PIXEL_VISIBLE,
      CANVAS_LAYER_BLOCKED: surface.CANVAS_LAYER_BLOCKED,
      CANVAS_LAYER_BLOCKER: surface.CANVAS_LAYER_BLOCKER,
      CANVAS_NAMESPACE_PRESENT: surface.CANVAS_NAMESPACE_PRESENT,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: surface.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: surface.CANVAS_PARENT_CONTRACT_RECOGNIZED,
      CURRENT_CANVAS_PARENT_CONTRACT: CONTRACT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: true,

      PREFACE_ACTIVE: state.prefaceActive,
      DOWNSTREAM_EXPRESSION_ACCEPTED: state.downstreamExpressionAccepted,
      LAST_RENDER_STATUS: state.lastRenderStatus,
      LAST_RENDER_REASON: state.lastRenderReason,
      LAST_UPDATED_AT: state.lastUpdatedAt,

      bootApiAvailable: true,
      initApiAvailable: true,
      startApiAvailable: true,
      mountApiAvailable: true,
      renderApiAvailable: true,
      receiveApiAvailable: true,
      redrawApiAvailable: true,
      resizeApiAvailable: true,
      getCanvasApiAvailable: true,
      getContextApiAvailable: true,
      getSurfaceApiAvailable: true,
      getReceiptApiAvailable: true,
      getReportApiAvailable: true,

      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsMaterialTruth: false,
      ownsMotionTruth: false,
      ownsControls: false,
      ownsRouteOrchestration: false,
      ownsRuntimeRestart: false,
      ownsDiagnosticRail: false,
      ownsFinalVisualPass: false,

      productionMutationAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasDrawingAuthorized: true,
      canvasCreationAuthorized: true,
      canvasRepairAuthorized: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webgl: false,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      surface: inspectSurface(),
      notes: state.notes.slice(),
      noClaims: clonePlain(NO_CLAIMS)
    };
  }

  function getReport() {
    const receipt = getReceipt();
    const surface = receipt.surface || {};

    return {
      PACKET_NAME: "HEARTH_CANVAS_SURFACE_RECEIVER_REPORT_PACKET_v12_3",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_FILE: FILE,
      CANVAS_CONTRACT: CONTRACT,
      CANVAS_RECEIPT: RECEIPT,
      CURRENT_CANVAS_PARENT_CONTRACT: CONTRACT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: true,

      CANVAS_SURFACE_TRUTH_AVAILABLE: surface.CANVAS_ELEMENT_FOUND,
      CANVAS_ELEMENT_FOUND: surface.CANVAS_ELEMENT_FOUND,
      CANVAS_SELECTOR: surface.CANVAS_SELECTOR,
      CANVAS_MOUNT_FOUND: surface.CANVAS_MOUNT_FOUND,
      CANVAS_MOUNT_SELECTOR: surface.CANVAS_MOUNT_SELECTOR,
      CANVAS_IN_MOUNT: surface.CANVAS_IN_MOUNT,
      CANVAS_RECT_NONZERO: surface.CANVAS_RECT_NONZERO,
      CANVAS_COMPUTED_VISIBLE: surface.CANVAS_COMPUTED_VISIBLE,
      CANVAS_VIEWPORT_INTERSECTING: surface.CANVAS_VIEWPORT_INTERSECTING,
      CANVAS_CONTEXT_2D_READY: surface.CANVAS_CONTEXT_2D_READY,
      CANVAS_PIXEL_SAMPLE_STATUS: surface.CANVAS_PIXEL_SAMPLE_STATUS,
      CANVAS_PIXEL_VISIBLE: surface.CANVAS_PIXEL_VISIBLE,
      CANVAS_LAYER_BLOCKED: surface.CANVAS_LAYER_BLOCKED,
      CANVAS_LAYER_BLOCKER: surface.CANVAS_LAYER_BLOCKER,
      CANVAS_NAMESPACE_PRESENT: surface.CANVAS_NAMESPACE_PRESENT,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: surface.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: surface.CANVAS_PARENT_CONTRACT_RECOGNIZED,

      PREFACE_ACTIVE: state.prefaceActive,
      DOWNSTREAM_EXPRESSION_ACCEPTED: state.downstreamExpressionAccepted,
      LAST_RENDER_STATUS: state.lastRenderStatus,
      LAST_RENDER_REASON: state.lastRenderReason,

      RECOMMENDED_NEXT_OWNER:
        surface.CANVAS_ELEMENT_FOUND && surface.CANVAS_CONTEXT_2D_READY
          ? "TEACHER_REVIEW"
          : "CANVAS_EXPRESSION_SURFACE",
      RECOMMENDED_NEXT_FILE: FILE,
      RECOMMENDED_NEXT_ACTION:
        surface.CANVAS_ELEMENT_FOUND && surface.CANVAS_CONTEXT_2D_READY
          ? "RERUN_DIAGNOSTIC_TO_CONFIRM_CANVAS_STANDARD_COORDINATES"
          : "VERIFY_CANVAS_FILE_CREATES_OR_BINDS_REAL_DOM_CANVAS_SURFACE",

      SECONDARY_EVIDENCE_NOTES: state.notes.join(" | ") || "none",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getState() {
    return {
      mounted: state.mounted,
      started: state.started,
      hasCanvas: Boolean(state.canvas),
      hasContext2d: Boolean(state.ctx),
      hasMount: Boolean(state.mount),
      prefaceActive: state.prefaceActive,
      downstreamExpressionAccepted: state.downstreamExpressionAccepted,
      lastRenderStatus: state.lastRenderStatus,
      lastRenderReason: state.lastRenderReason,
      lastPixelSampleStatus: state.lastPixelSampleStatus,
      lastPixelVisible: state.lastPixelVisible,
      lastUpdatedAt: state.lastUpdatedAt,
      notes: state.notes.slice(),
      receipt: getReceipt()
    };
  }

  function isReady() {
    const surface = inspectSurface();

    return Boolean(
      surface.CANVAS_ELEMENT_FOUND &&
        surface.CANVAS_IN_MOUNT &&
        surface.CANVAS_RECT_NONZERO &&
        surface.CANVAS_COMPUTED_VISIBLE &&
        surface.CANVAS_CONTEXT_2D_READY &&
        surface.CANVAS_PIXEL_VISIBLE
    );
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    root.HEARTH.canvasHub = api;
    root.HEARTH.canvas = api;
    root.HEARTH.canvasExpressionHub = api;
    root.HEARTH.canvasSurface = api;
    root.HEARTH.hearthCanvas = api;

    root.DEXTER_LAB.hearthCanvasHub = api;
    root.DEXTER_LAB.hearthCanvas = api;
    root.DEXTER_LAB.hearthCanvasExpressionHub = api;
    root.DEXTER_LAB.hearthCanvasSurface = api;

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_SURFACE = api;

    root.HEARTH_CANVAS_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_HUB_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_SURFACE_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_REPORT = getReport();
    root.HEARTH_CANVAS_SURFACE_REPORT = getReport();

    try {
      if (doc && isFunction(root.CustomEvent)) {
        doc.dispatchEvent(
          new CustomEvent("hearth:canvas-surface-receipt", {
            detail: getReceipt()
          })
        );
      }
    } catch (_error) {}
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    parentRole: "CANVAS_RECEIVER_OUTPUT_CARRIER",
    canvasAuthority: "RECEIVER_OUTPUT_CARRIER_ONLY",
    canvasCreatesOrBindsRealDomCanvasSurface: true,
    canvasMountSelector: MOUNT_SELECTOR,
    expectedCanvasSelector: `#${CANVAS_ID}`,

    boot,
    init,
    start,
    mount: mountSurface,
    bind: mountSurface,
    receive,
    accept: receive,
    acceptSource: receive,
    receiveExpressionPacket: receive,
    receiveSurfacePacket: receive,
    ingest: receive,
    render,
    redraw,
    paint: render,
    resize,

    getCanvas,
    getContext,
    getSurface,
    getReceipt,
    getReceiptLight,
    getReport,
    getState,
    inspectSurface,
    inspectCanvasSurfaceTruth: inspectSurface,
    runCanvasSurfaceTruthSelfCheck: inspectSurface,
    isReady,

    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsMotionTruth: false,
    ownsControls: false,
    ownsRouteOrchestration: false,
    ownsRuntimeRestart: false,
    ownsDiagnosticRail: false,
    ownsFinalVisualPass: false,

    productionMutationAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasDrawingAuthorized: true,
    canvasCreationAuthorized: true,
    canvasRepairAuthorized: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,

    supportsRealDomCanvasSurface: true,
    supportsCanvasSurfaceTruthProbe: true,
    supports2dContextTruth: true,
    supportsPixelSampleTruth: true,
    supportsDeferredExpressionPacket: true,
    supportsFirstFastViewPreface: true,
    supportsControlsSeparation: true,

    ...NO_CLAIMS
  });

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener(
        "DOMContentLoaded",
        () => {
          boot({ reason: "DOMContentLoaded_AUTO_BOOT" });
        },
        { once: true }
      );
    } else {
      boot({ reason: "IMMEDIATE_AUTO_BOOT" });
    }

    root.addEventListener(
      "resize",
      () => {
        resize();
      },
      { passive: true }
    );

    let retryCount = 0;
    const retryMount = () => {
      if (state.mounted || retryCount >= 12) return;
      retryCount += 1;
      boot({ reason: "BOUNDED_MOUNT_RETRY", retryCount });
      if (!state.mounted) setTimeout(retryMount, 80);
    };

    setTimeout(retryMount, 80);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
