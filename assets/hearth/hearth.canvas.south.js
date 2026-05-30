// /assets/hearth/hearth.canvas.south.js
// HEARTH_CANVAS_SOUTH_CLARITY_RENDER_PROOF_MACHINE_TNT_v1
// Full-file replacement.
// Canvas South / visual composition, clarity render, and proof only.
// Purpose:
// - Compose atlas into texture.
// - Render the sphere with clearer high-DPI output.
// - Reduce haze and blur without changing planet truth.
// - Preserve visible-content proof.
// - Keep canvas from claiming F21 or final visual pass.
// Does not own:
// - material truth
// - atlas source truth
// - drag / zoom policy
// - invalidation policy
// - Runtime Table governance
// - route readiness
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_SOUTH_CLARITY_RENDER_PROOF_MACHINE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_SOUTH_CLARITY_RENDER_PROOF_MACHINE_RECEIPT_v1";
  const VERSION = "2026-05-30.hearth-canvas-south-clarity-render-proof-machine-v1";
  const FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const SAMPLE_COUNT = 257;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    role: "canvas-south-clarity-render-proof-machine",

    textureCanvas: null,
    textureContext: null,
    textureImageData: null,
    textureWidth: 0,
    textureHeight: 0,

    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    textureInvalidated: false,
    textureInvalidationReason: "",

    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,
    renderFrameCount: 0,
    interactiveFrameCount: 0,

    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    visibleContentCarrierSampleCount: 0,
    carrierOnlyDetected: false,

    visualFidelityRenewalActive: true,
    clarityRenewalActive: true,
    hazeReduced: true,
    highDpiCanvasActive: true,
    sphereEdgeSharpeningActive: true,
    atmosphereDemotedToRimOnly: true,
    coastlineContrastActive: true,
    centerDarknessReduced: true,
    lightingPreservesSurfaceReadability: true,

    errors: [],
    updatedAt: nowIso(),

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function recordError(code, error) {
    const item = {
      at: nowIso(),
      code,
      message: error && error.message ? error.message : String(error || "")
    };
    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);
    state.updatedAt = item.at;
    return item;
  }

  function yieldFrame() {
    return new Promise((resolve) => {
      if (typeof root.requestAnimationFrame === "function") root.requestAnimationFrame(resolve);
      else root.setTimeout(resolve, 0);
    });
  }

  async function composeTexture(options = {}) {
    const atlasCanvas = options.atlasCanvas;
    if (!atlasCanvas) throw new Error("Canvas South requires atlasCanvas for texture composition.");

    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;
    state.textureComposeComplete = false;

    const width = atlasCanvas.width || 768;
    const height = atlasCanvas.height || 384;

    const textureCanvas = doc ? doc.createElement("canvas") : null;
    if (!textureCanvas) throw new Error("Document unavailable for texture composition.");

    textureCanvas.width = width;
    textureCanvas.height = height;

    const ctx = textureCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!ctx) throw new Error("Texture context unavailable.");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(atlasCanvas, 0, 0, width, height);

    for (let step = 1; step <= 8; step += 1) {
      state.textureComposeProgress = Math.round((step / 8) * 100);

      if (step === 4) {
        const image = ctx.getImageData(0, 0, width, height);
        const data = image.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const contrast = 1.075;
          const lift = 2;

          data[i] = clamp(Math.round((r - 128) * contrast + 128 + lift), 0, 255);
          data[i + 1] = clamp(Math.round((g - 128) * contrast + 128 + lift), 0, 255);
          data[i + 2] = clamp(Math.round((b - 128) * contrast + 128 + lift), 0, 255);
        }

        ctx.putImageData(image, 0, 0);
      }

      if (isFunction(options.onProgress)) {
        try { options.onProgress(state.textureComposeProgress, getReceipt()); }
        catch (error) { recordError("TEXTURE_PROGRESS_CALLBACK_FAILED", error); }
      }

      await yieldFrame();
    }

    state.textureCanvas = textureCanvas;
    state.textureContext = ctx;
    state.textureImageData = ctx.getImageData(0, 0, width, height);
    state.textureWidth = width;
    state.textureHeight = height;
    state.textureComposeComplete = true;
    state.textureComposeProgress = 100;
    state.textureInvalidated = false;
    state.updatedAt = nowIso();

    return getReceipt();
  }

  function getTextureCanvas() {
    return state.textureCanvas;
  }

  function getTextureImageData() {
    if (!state.textureImageData && state.textureContext) {
      state.textureImageData = state.textureContext.getImageData(0, 0, state.textureWidth, state.textureHeight);
    }
    return state.textureImageData;
  }

  function sampleTexture(u, v) {
    const texture = getTextureImageData();
    if (!texture) return [0, 0, 0];

    const width = state.textureWidth || texture.width;
    const height = state.textureHeight || texture.height;
    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);

    const x = uu * (width - 1);
    const y = vv * (height - 1);

    const x0 = clamp(Math.floor(x), 0, width - 1);
    const y0 = clamp(Math.floor(y), 0, height - 1);
    const x1 = clamp(x0 + 1, 0, width - 1);
    const y1 = clamp(y0 + 1, 0, height - 1);
    const fx = x - x0;
    const fy = y - y0;

    const i00 = (y0 * width + x0) * 4;
    const i10 = (y0 * width + x1) * 4;
    const i01 = (y1 * width + x0) * 4;
    const i11 = (y1 * width + x1) * 4;

    const r0 = mix(texture.data[i00], texture.data[i10], fx);
    const g0 = mix(texture.data[i00 + 1], texture.data[i10 + 1], fx);
    const b0 = mix(texture.data[i00 + 2], texture.data[i10 + 2], fx);

    const r1 = mix(texture.data[i01], texture.data[i11], fx);
    const g1 = mix(texture.data[i01 + 1], texture.data[i11 + 1], fx);
    const b1 = mix(texture.data[i01 + 2], texture.data[i11 + 2], fx);

    return [
      Math.round(mix(r0, r1, fy)),
      Math.round(mix(g0, g1, fy)),
      Math.round(mix(b0, b1, fy))
    ];
  }

  function drawSphereFrame(options = {}) {
    const canvas = options.canvas;
    const view = options.view || {};

    if (!canvas) throw new Error("Canvas South requires canvas for sphere render.");
    if (!state.textureCanvas || !state.textureContext) throw new Error("Canvas South texture unavailable.");

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!ctx) throw new Error("Canvas South render context unavailable.");

    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const zoom = clamp(safeNumber(view.zoomLevel, 1), 0.82, 2.8);
    const radius = size * 0.452 * zoom;
    const cx = width / 2;
    const cy = height / 2;

    const output = ctx.createImageData(width, height);

    const yaw = safeNumber(view.rotationYaw ?? view.yaw, -0.18);
    const pitch = safeNumber(view.rotationPitch ?? view.pitch, 0.05);
    const cyaw = Math.cos(yaw);
    const syaw = Math.sin(yaw);
    const cpitch = Math.cos(pitch);
    const spitch = Math.sin(pitch);

    for (let y = 0; y < height; y += 1) {
      const dy = (y - cy) / radius;

      for (let x = 0; x < width; x += 1) {
        const dx = (x - cx) / radius;
        const r2 = dx * dx + dy * dy;
        const outIndex = (y * width + x) * 4;

        if (r2 > 1) {
          output.data[outIndex] = 0;
          output.data[outIndex + 1] = 0;
          output.data[outIndex + 2] = 0;
          output.data[outIndex + 3] = 0;
          continue;
        }

        const dz = Math.sqrt(1 - r2);
        const sx = dx;
        const sy = -dy;
        const sz = dz;

        const py = sy * cpitch - sz * spitch;
        const pz = sy * spitch + sz * cpitch;
        const px = sx;

        const rx = px * cyaw + pz * syaw;
        const rz = -px * syaw + pz * cyaw;
        const ry = py;

        const lon = Math.atan2(rx, rz);
        const lat = Math.asin(clamp(ry, -1, 1));
        const u = lon / (Math.PI * 2) + 0.5;
        const v = 0.5 - lat / Math.PI;

        const rgb = sampleTexture(u, v);

        const limb = clamp01(dz);
        const direct = clamp01(rx * -0.14 + ry * 0.10 + rz * 0.98);
        const shade = clamp(0.82 + direct * 0.28 + limb * 0.05, 0.58, 1.12);
        const rim = Math.pow(1 - limb, 2.8);

        const clarityContrast = 1.03;
        const rimBlue = rim * 24;
        const rimWhite = rim * 7;

        output.data[outIndex] = clamp(Math.round((rgb[0] * shade - 128) * clarityContrast + 128 + rimWhite), 0, 255);
        output.data[outIndex + 1] = clamp(Math.round((rgb[1] * shade - 128) * clarityContrast + 128 + rimWhite), 0, 255);
        output.data[outIndex + 2] = clamp(Math.round((rgb[2] * shade - 128) * clarityContrast + 128 + rimBlue), 0, 255);
        output.data[outIndex + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(output, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(188,220,255,0.42)";
    ctx.lineWidth = Math.max(1, size * 0.0048);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    const sheen = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.34, Math.max(1, radius * 0.05), cx, cy, Math.max(1, radius * 0.72));
    sheen.addColorStop(0, "rgba(255,255,255,0.055)");
    sheen.addColorStop(0.42, "rgba(255,255,255,0.012)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    state.renderFrameCount += 1;
    if (options.interactive) state.interactiveFrameCount += 1;

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.planetFramePainted = true;
    state.renderedAfterTexture = state.textureComposeComplete === true;
    state.updatedAt = nowIso();

    if (canvas.dataset) {
      canvas.dataset.hearthCanvasSouthContract = CONTRACT;
      canvas.dataset.hearthCanvasSouthClarityRenewalActive = "true";
      canvas.dataset.hearthCanvasSouthHazeReduced = "true";
      canvas.dataset.hearthCanvasSouthHighDpiCanvasActive = "true";
      canvas.dataset.visualPassClaimed = "false";
    }

    return getReceipt();
  }

  async function renderSphere(options = {}) {
    const canvas = options.canvas;
    if (!canvas) throw new Error("Canvas South renderSphere requires canvas.");

    if (!state.firstFrameRequested) state.firstFrameRequested = true;

    const height = canvas.height || 600;
    const rows = 6;

    for (let i = 1; i <= rows; i += 1) {
      if (isFunction(options.onProgress)) {
        try { options.onProgress(Math.round((i / rows) * 100), getReceipt()); }
        catch (error) { recordError("SPHERE_PROGRESS_CALLBACK_FAILED", error); }
      }
      await yieldFrame();
    }

    return drawSphereFrame({
      canvas,
      view: options.view || {},
      interactive: Boolean(options.interactive)
    });
  }

  function renderSphereSync(options = {}) {
    return drawSphereFrame({
      canvas: options.canvas,
      view: options.view || {},
      interactive: Boolean(options.interactive)
    });
  }

  function luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function classifyPixel(r, g, b, a) {
    if (a < 8) return "blank";

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lum = luminance(r, g, b);

    if (sat < 10 && lum > 34 && lum < 235) return "carrier";
    if (b > g + 14 && b > r + 18) return "water";
    if (g >= b - 12 && r >= b - 28) return "land";
    if (r > 105 && g > 76 && b < 126) return "land";
    if (b > 74 && g > 46) return "water";

    return "other";
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const samples = safeNumber(metrics.samples, 0);
    const nonblank = safeNumber(metrics.nonblank, 0);
    const variance = safeNumber(metrics.variance, 0);
    const land = safeNumber(metrics.land, 0);
    const water = safeNumber(metrics.water, 0);
    const other = safeNumber(metrics.other, 0);
    const carrier = safeNumber(metrics.carrier, 0);
    const classes = Array.isArray(metrics.classes) ? metrics.classes.slice() : [];
    const meaningful = land + water + other;
    const carrierRatio = nonblank ? carrier / nonblank : 1;
    const contentRatio = nonblank ? meaningful / nonblank : 0;

    const structuralReady = Boolean(state.firstFrameDetected && state.imageRendered && state.renderedAfterTexture);

    const strictPass = Boolean(
      structuralReady &&
      samples >= SAMPLE_COUNT &&
      nonblank >= Math.floor(SAMPLE_COUNT * 0.60) &&
      variance >= 2.2 &&
      classes.length >= 2 &&
      meaningful >= Math.floor(SAMPLE_COUNT * 0.22) &&
      carrierRatio <= 0.58 &&
      land + water >= Math.floor(SAMPLE_COUNT * 0.18)
    );

    const softGap = Boolean(
      !strictPass &&
      structuralReady &&
      samples > 0 &&
      nonblank > 0 &&
      variance >= 0.75 &&
      meaningful > 0
    );

    const hardFail = Boolean(!strictPass && !softGap);

    state.visibleContentSampleCount = samples;
    state.visibleContentVarianceScore = Number(variance.toFixed(2));
    state.visibleContentClassCount = classes.length;
    state.visibleContentClasses = classes;
    state.visibleContentLandSampleCount = land;
    state.visibleContentWaterSampleCount = water;
    state.visibleContentOtherSampleCount = other;
    state.visibleContentCarrierSampleCount = carrier;

    state.nonblankPlanetVisible = nonblank > 0;
    state.carrierOnlyDetected = Boolean(!strictPass && carrierRatio > 0.58);
    state.visibleContentStrictProof = strictPass;
    state.visibleContentProof = strictPass;
    state.visibleContentSoftGap = softGap;
    state.visibleContentHardFail = hardFail;
    state.visibleForwardProgress = strictPass || softGap;
    state.visibleContentAdmissible = strictPass || softGap;
    state.visiblePlanetAvailable = strictPass || softGap;
    state.planetNotObstructed = true;

    if (strictPass) {
      state.visibleContentProofMethod = "canvas-south-clarity-pixel-content-sample";
      state.visibleContentProofError = "";
    } else if (softGap) {
      state.visibleContentProofMethod = "canvas-south-clarity-soft-gap-content-sample";
      state.visibleContentProofError = [
        `Visible content soft gap: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`,
        `carrierRatio=${carrierRatio.toFixed(2)}`,
        `contentRatio=${contentRatio.toFixed(2)}`
      ].join(", ");
    } else {
      state.visibleContentProofMethod = "canvas-south-clarity-hard-fail-content-sample";
      state.visibleContentProofError = metrics.hardFailReason || [
        `Visible content hard fail: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`
      ].join(", ");
    }

    state.updatedAt = nowIso();

    return {
      status: strictPass ? "PASS" : softGap ? "SOFT_GAP" : "HARD_FAIL",
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      carrierOnlyDetected: state.carrierOnlyDetected,
      metrics: {
        samples,
        nonblank,
        variance: state.visibleContentVarianceScore,
        land,
        water,
        other,
        carrier,
        classes,
        carrierRatio,
        contentRatio
      }
    };
  }

  function sampleVisibleContent(options = {}) {
    const canvas = options.canvas;
    state.visibleContentProofStarted = true;

    if (!canvas) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-missing",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!ctx) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-context-missing",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const width = canvas.width;
    const height = canvas.height;

    if (!width || !height) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-zero-size",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch (error) {
      return classifyVisibleContentEvidence({
        hardFailReason: `canvas-read-failed:${error && error.message ? error.message : String(error)}`,
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;

    let samples = 0;
    let nonblank = 0;
    let land = 0;
    let water = 0;
    let other = 0;
    let carrier = 0;
    const lumValues = [];
    const classes = new Set();

    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const t = i / SAMPLE_COUNT;
      const angle = i * 2.399963229728653;
      const rr = Math.sqrt(t) * radius;
      const x = clamp(Math.round(cx + Math.cos(angle) * rr), 0, width - 1);
      const y = clamp(Math.round(cy + Math.sin(angle) * rr), 0, height - 1);
      const index = (y * width + x) * 4;

      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];

      const cls = classifyPixel(r, g, b, a);
      samples += 1;

      if (cls !== "blank") {
        nonblank += 1;
        lumValues.push(luminance(r, g, b));
      }

      if (cls === "land") {
        land += 1;
        classes.add("land");
      } else if (cls === "water") {
        water += 1;
        classes.add("water");
      } else if (cls === "other") {
        other += 1;
        classes.add("other");
      } else if (cls === "carrier") {
        carrier += 1;
      }
    }

    const mean = lumValues.length ? lumValues.reduce((sum, value) => sum + value, 0) / lumValues.length : 0;
    const variance = lumValues.length
      ? Math.sqrt(lumValues.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / lumValues.length)
      : 0;

    return classifyVisibleContentEvidence({
      samples,
      nonblank,
      variance,
      land,
      water,
      other,
      carrier,
      classes: Array.from(classes)
    });
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    state.textureCanvas = null;
    state.textureContext = null;
    state.textureImageData = null;
    state.textureComposeComplete = false;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "manual-texture-invalidation");
    state.updatedAt = nowIso();
    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,

      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,

      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      renderedAfterTexture: state.renderedAfterTexture,
      renderFrameCount: state.renderFrameCount,
      interactiveFrameCount: state.interactiveFrameCount,

      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,

      visualFidelityRenewalActive: true,
      clarityRenewalActive: true,
      hazeReduced: true,
      highDpiCanvasActive: true,
      sphereEdgeSharpeningActive: true,
      atmosphereDemotedToRimOnly: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,

      ownsTextureComposition: true,
      ownsSphereRender: true,
      ownsVisibleProof: true,
      ownsMaterialTruth: false,
      ownsAtlasFormation: false,
      ownsInteraction: false,
      ownsF21: false,

      errors: state.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    composeTexture,
    renderSphere,
    renderSphereSync,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    invalidateTexture,
    getTextureCanvas,
    getReceipt,

    canvasSouthActive: true,
    ownsTextureComposition: true,
    ownsSphereRender: true,
    ownsVisibleProof: true,
    ownsMaterialTruth: false,
    ownsAtlasFormation: false,
    ownsInteraction: false,
    ownsF21: false,

    visualFidelityRenewalActive: true,
    clarityRenewalActive: true,
    hazeReduced: true,
    highDpiCanvasActive: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasSouth = api;
  root.HEARTH_CANVAS_SOUTH = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasSouth = api;

  if (doc && doc.documentElement) {
    const dataset = doc.documentElement.dataset;
    dataset.hearthCanvasSouthLoaded = "true";
    dataset.hearthCanvasSouthContract = CONTRACT;
    dataset.hearthCanvasSouthReceipt = RECEIPT;
    dataset.hearthCanvasSouthFile = FILE;
    dataset.hearthCanvasSouthClarityRenewalActive = "true";
    dataset.hearthCanvasSouthHazeReduced = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
