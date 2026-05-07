// /assets/audralia/audralia.canvas.js
// AUDRALIA_CANVAS_SURFACE_TRUTH_DECOUPLED_ORTHOGRAPHIC_TNT_v12
// Full-file replacement. Canvas authority only.
// Purpose:
// - Canvas owns final visible composition.
// - Runtime owns motion only.
// - Surface bridge owns static surface truth.
// - Canvas must not ask runtime for land/water/terrain/ocean visual samples.
// - Preserve first-paint clarity after runtime starts.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_SURFACE_TRUTH_DECOUPLED_ORTHOGRAPHIC_TNT_v12";
const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11";
const VERSION = "2026-05-07.surface-truth-decoupled-orthographic-v12";

const SURFACE_PATH = "/assets/audralia/audralia.surface.js";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

let activeController = null;

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  version: VERSION,
  canonicalExport: "mountAudraliaCanvas",

  runtimeReceipt: "",
  runtimeSovereignty: "motion-only",
  runtimeVisualSovereignty: false,
  surfaceReceipt: "",
  surfaceTruthBridge: false,

  canvasOwnsFinalVisibleComposition: true,
  canvasUsesRuntimeForMotionOnly: true,
  canvasUsesSurfaceForSurfaceTruth: true,
  canvasUsesRuntimeForSurfaceTruth: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  frameCount: 0,
  pixelProof: null,
  errors: []
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function normalizeLongitudeRadians(lon) {
  let value = Number(lon) || 0;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) return target;
  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) return target.mount;
  if (target && typeof HTMLElement !== "undefined" && target.target instanceof HTMLElement) return target.target;
  if (target && typeof HTMLElement !== "undefined" && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
  }

  return (
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("#audralia-mount") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("#audralia-main") ||
    document.body
  );
}

function setRouteStatus(message) {
  const node =
    document.querySelector("#audralia-route-status") ||
    document.querySelector("[data-audralia-route-status]") ||
    document.querySelector("#audralia-status") ||
    document.querySelector("[data-route-status]");

  if (!node) return;

  node.textContent = message;
  node.setAttribute("data-audralia-canvas-loaded", "true");
  node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
  node.setAttribute("data-audralia-canvas-contract", CONTRACT);
}

function removeResidue() {
  const badText = {
    "Loading Audralia": true,
    "Audralia canvas authority import failed.": true,
    "Audralia canvas authority import failed. missing ) after argument list": true,
    "Canvas authority imported · no render export found": true,
    "Audralia canvas authority imported, but no render export was found.": true,
    "Audralia doorway is loading the current adopted canvas authority.": true
  };

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (const node of nodes) {
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && badText[text]) {
      node.remove();
    }
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");

  for (const node of nodes) {
    node.remove();
  }
}

function createCanvas(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "surface-truth-decoupled-orthographic-v12");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(10, 23, 45, 0.98), rgba(2, 7, 19, 1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0,0,0,0.52), inset 0 0 88px rgba(136,195,255,0.08)";
  frame.style.touchAction = "pan-y";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia surface-truth decoupled orthographic canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 820);
  const size = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.setAttribute("data-pixel-ratio", String(ratio));

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  if (!ctx) {
    throw new Error("Audralia canvas context unavailable.");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  return { ctx, size, ratio };
}

function makeBuffer(size) {
  const buffer = document.createElement("canvas");
  const resolution = Math.floor(clamp(size * 0.82, 360, 660));
  buffer.width = resolution;
  buffer.height = resolution;

  const bufferCtx = buffer.getContext("2d", { alpha: true });

  if (!bufferCtx) {
    throw new Error("Audralia surface buffer unavailable.");
  }

  return {
    canvas: buffer,
    ctx: bufferCtx,
    size: resolution
  };
}

function radial(ctx, x0, y0, r0, x1, y1, r1, stops) {
  const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

  for (const stop of stops) {
    gradient.addColorStop(stop[0], stop[1]);
  }

  return gradient;
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 150; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.22 + 0.55 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245,221,166,0.86)" : "rgba(185,216,255,0.72)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.35 : 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function colorForSample(sample, light, edge, altitudeShade) {
  const relief = clamp01(sample.terrainReliefIndex ?? sample.terrainRelief ?? sample.elevation ?? 0);
  const mineral = clamp01(sample.mineralIndex ?? 0);
  const texture = clamp01(sample.colorBreak ?? sample.reliefTexture ?? 0);
  const turquoise = clamp01(sample.turquoiseIndex ?? sample.turquoise ?? 0);

  let r;
  let g;
  let b;

  if (sample.ice || sample.glacier || sample.visualSurfaceClass === "glacier_ice_snowpack_surface") {
    r = mix(188, 245, light);
    g = mix(207, 252, light);
    b = mix(216, 255, light);
    r = mix(r, 255, texture * 0.16);
    g = mix(g, 255, texture * 0.16);
    b = mix(b, 255, texture * 0.16);
  } else if (sample.liquidWater || sample.water || sample.ocean || sample.shelf) {
    const depth = clamp01(sample.depth ?? sample.oceanDepth ?? 0.4);
    const shelf = Boolean(sample.shelf);

    if (shelf) {
      r = mix(24, 92, turquoise);
      g = mix(114, 206, turquoise);
      b = mix(150, 219, turquoise);
    } else {
      r = mix(4, 20, depth);
      g = mix(50, 86, depth * 0.75);
      b = mix(93, 150, 1 - depth * 0.24);
    }

    r = mix(r, 9, depth * 0.22);
    g = mix(g, 33, depth * 0.18);
    b = mix(b, 83, depth * 0.12);
  } else {
    const gold = clamp01(sample.diamondSignal ?? mineral);
    const slate = clamp01(sample.slateSignal ?? relief);

    r = mix(70, 154, texture * 0.5 + relief * 0.18);
    g = mix(99, 143, texture * 0.34 + relief * 0.20);
    b = mix(72, 87, texture * 0.18);

    r = mix(r, 166, gold * 0.22);
    g = mix(g, 139, gold * 0.16);
    b = mix(b, 72, gold * 0.10);

    r = mix(r, 74, slate * 0.18);
    g = mix(g, 82, slate * 0.14);
    b = mix(b, 84, slate * 0.18);
  }

  const shade = clamp01(0.24 + light * 0.76);
  const limb = clamp01(0.50 + edge * 0.50);
  const finalShade = shade * limb * altitudeShade;

  return [
    Math.floor(clamp(r * finalShade, 0, 255)),
    Math.floor(clamp(g * finalShade, 0, 255)),
    Math.floor(clamp(b * finalShade, 0, 255)),
    255
  ];
}

function renderSurfaceBuffer(state, motion) {
  const buffer = state.buffer;
  const size = buffer.size;
  const radius = size * 0.43;
  const cx = size / 2;
  const cy = size / 2;
  const image = buffer.ctx.createImageData(size, size);
  const data = image.data;

  const rotationRad = Number.isFinite(Number(motion.rotationRad))
    ? Number(motion.rotationRad)
    : ((state.frameCount * 0.003) % (Math.PI * 2));

  const tiltRad = Number.isFinite(Number(motion.axialTiltRad))
    ? Number(motion.axialTiltRad)
    : -8.5 * Math.PI / 180;

  const cosTilt = Math.cos(-tiltRad);
  const sinTilt = Math.sin(-tiltRad);

  const lightPhase = Number.isFinite(Number(motion.lightPhase)) ? Number(motion.lightPhase) * Math.PI / 180 : 0;
  const lx = -0.38 + Math.sin(lightPhase) * 0.05;
  const ly = 0.24;
  const lz = 0.90;

  for (let py = 0; py < size; py += 1) {
    const ny = (py - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const nx = (px - cx) / radius;
      const rr = nx * nx + ny * ny;
      const offset = (py * size + px) * 4;

      if (rr > 1) {
        data[offset] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
        data[offset + 3] = 0;
        continue;
      }

      const zView = Math.sqrt(Math.max(0, 1 - rr));
      const xView = nx;
      const yView = -ny;

      const yWorld = yView * cosTilt - zView * sinTilt;
      const zTilted = yView * sinTilt + zView * cosTilt;

      const lon = normalizeLongitudeRadians(Math.atan2(xView, zTilted) - rotationRad);
      const lat = Math.asin(clamp(yWorld, -1, 1));

      const u = (lon / (Math.PI * 2)) + 0.5;
      const v = 0.5 - lat / Math.PI;

      const sample = state.surface.sampleSurface({ lat, lon, u, v });

      const light = clamp01((xView * lx + yWorld * ly + zView * lz) * 0.58 + 0.48);
      const edge = Math.pow(clamp01(zView), 0.58);
      const altitudeShade = sample.liquidWater ? 1 : clamp01(0.88 + (sample.elevation || 0) * 0.20);

      const color = colorForSample(sample, light, edge, altitudeShade);

      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = color[3];
    }
  }

  buffer.ctx.putImageData(image, 0, 0);
}

function drawLatitudeLines(ctx, size, motion) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;
  const rotation = (Number(motion.rotationDeg) || 0) * Math.PI / 180;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(235,244,255,0.45)";
  ctx.lineWidth = 0.7;

  for (let lat = -60; lat <= 60; lat += 15) {
    const latRad = lat * Math.PI / 180;
    const y = cy - Math.sin(latRad) * radius * 0.94;
    const rx = Math.cos(latRad) * radius;

    ctx.beginPath();

    for (let i = 0; i <= 80; i += 1) {
      const t = (i / 80) * Math.PI * 2;
      const wave = Math.sin(t * 4 + rotation) * 1.2;
      const x = cx + Math.cos(t) * rx;
      const yy = y + Math.sin(t) * radius * 0.018 + wave;

      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawGlobe(ctx, size, buffer, motion) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(buffer.canvas, cx - radius, cy - radius, radius * 2, radius * 2);

  const shade = radial(ctx, cx - radius * 0.45, cy - radius * 0.42, radius * 0.08, cx + radius * 0.20, cy + radius * 0.16, radius * 1.18, [
    [0, "rgba(255,255,255,0.14)"],
    [0.48, "rgba(255,255,255,0.018)"],
    [0.74, "rgba(0,0,0,0.18)"],
    [1, "rgba(0,0,0,0.68)"]
  ]);

  ctx.fillStyle = shade;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  drawLatitudeLines(ctx, size, motion);
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;
  const pulse = 0.42 + Math.sin(time * 0.0013) * 0.045;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(145,205,255,${pulse.toFixed(3)})`;
  ctx.lineWidth = size * 0.011;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(74,138,214,0.22)";
  ctx.lineWidth = size * 0.006;
  ctx.stroke();

  ctx.restore();
}

function drawDiagnostics(ctx, size) {
  ctx.save();

  ctx.fillStyle = "rgba(255,244,216,0.94)";
  ctx.font = `800 ${Math.max(12, size * 0.024)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.846);

  ctx.fillStyle = "rgba(205,220,238,0.76)";
  ctx.font = `700 ${Math.max(9, size * 0.013)}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillText("SURFACE TRUTH DECOUPLED · ORTHOGRAPHIC V12", size / 2, size * 0.872);

  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const sample = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;

    return {
      r: sample[0],
      g: sample[1],
      b: sample[2],
      a: sample[3],
      notBlank: sample[3] > 0 && sample[0] + sample[1] + sample[2] > 12
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state) {
  STATUS.loaded = true;
  STATUS.runtimeReceipt = state.runtimeReceipt || "";
  STATUS.runtimeSovereignty = "motion-only";
  STATUS.runtimeVisualSovereignty = false;
  STATUS.surfaceReceipt = state.surfaceReceipt || "";
  STATUS.surfaceTruthBridge = Boolean(state.surface);
  STATUS.frameCount = state.frameCount;
  STATUS.pixelProof = state.pixelProof || null;

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
    window.DGBAudraliaCanvasStatus = STATUS;

    try {
      window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: STATUS }));
    } catch (_) {}
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasUsesRuntimeForMotionOnly = "true";
    document.documentElement.dataset.audraliaCanvasUsesSurfaceForSurfaceTruth = "true";
    document.documentElement.dataset.audraliaCanvasUsesRuntimeForSurfaceTruth = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

async function loadAuthorities(state) {
  try {
    const surface = await import(`${SURFACE_PATH}?canvas=${encodeURIComponent(CONTRACT)}`);
    state.surface = surface;
    state.surfaceReceipt =
      surface.AUDRALIA_SURFACE_RECEIPT_VALUE ||
      surface.default?.receipt ||
      "AUDRALIA_SURFACE_TRUTH_BRIDGE_STATIC_AUTHORITY_TNT_v1";
  } catch (error) {
    state.errors.push(`surface import failed: ${String(error?.message || error || "unknown")}`);
  }

  try {
    const runtime = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}`);
    state.runtime = runtime;
    state.runtimeReceipt =
      runtime.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      runtime.default?.receipt ||
      "AUDRALIA_RUNTIME_MOTION_ONLY_FULL_POTENTIAL_TNT_v10";

    if (typeof runtime.start === "function") {
      runtime.start();
    }
  } catch (error) {
    state.errors.push(`runtime import failed: ${String(error?.message || error || "unknown")}`);
  }

  if (!state.surface || typeof state.surface.sampleSurface !== "function") {
    throw new Error("Audralia surface truth bridge missing sampleSurface export.");
  }

  state.ready = true;
  publishStatus(state);
}

function getMotion(state, time) {
  if (state.runtime && typeof state.runtime.sampleMotionState === "function") {
    try {
      return state.runtime.sampleMotionState(time);
    } catch (_) {}
  }

  return {
    rotationDeg: ((time * 0.0048) % 360),
    rotationRad: ((time * 0.0048) % 360) * Math.PI / 180,
    axialTiltDeg: -8.5,
    axialTiltRad: -8.5 * Math.PI / 180,
    cloudPhase: ((time * 0.0062) % 360),
    oceanPhase: ((time * 0.0026) % 360),
    lightPhase: ((time * 0.00115) % 360),
    motionIntensity: 1
  };
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);

  if (!state.ready || !state.surface) {
    ctx.save();
    ctx.fillStyle = "rgba(255,244,216,0.82)";
    ctx.font = `800 ${Math.max(13, size * 0.024)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText("AUDRALIA SURFACE BRIDGE LOADING", size / 2, size / 2);
    ctx.restore();
  } else {
    const motion = getMotion(state, time);

    if (
      !state.lastSurfacePaint ||
      time - state.lastSurfacePaint > 42 ||
      Math.abs((motion.rotationDeg || 0) - state.lastRotationDeg) > 0.28
    ) {
      renderSurfaceBuffer(state, motion);
      state.lastSurfacePaint = time;
      state.lastRotationDeg = motion.rotationDeg || 0;
    }

    drawGlobe(ctx, size, state.buffer, motion);
    drawAtmosphere(ctx, size, time);
    drawDiagnostics(ctx, size);
  }

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

function startCanvas(target, options) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvas(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);
  const buffer = makeBuffer(setup.size);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    buffer,
    mount,
    options: options || {},
    frameCount: 0,
    pixelProof: null,
    ready: false,
    stopped: false,
    rafId: null,
    resizeTimer: null,
    lastSurfacePaint: 0,
    lastRotationDeg: -999,
    runtime: null,
    runtimeReceipt: "",
    surface: null,
    surfaceReceipt: "",
    errors: []
  };

  function animate(frameTime) {
    if (state.stopped) return;
    renderFrame(state, frameTime || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      state.buffer = makeBuffer(next.size);
      state.lastSurfacePaint = 0;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function stop() {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;

  setRouteStatus(
    `Audralia adopted canvas authority loaded. Canvas ${CONTRACT} · Surface bridge pending · Runtime motion-only · GraphicBox false · Image generation false · Visual pass claimed false`
  );

  publishStatus(state);

  loadAuthorities(state)
    .then(() => {
      setRouteStatus(
        `Audralia adopted canvas authority loaded. Canvas ${CONTRACT} · Surface ${state.surfaceReceipt} · Runtime ${state.runtimeReceipt} · Runtime sovereignty motion-only · Runtime visual sovereignty false · GraphicBox false · Image generation false · Visual pass claimed false`
      );
      state.lastSurfacePaint = 0;
      publishStatus(state);
    })
    .catch((error) => {
      state.errors.push(String(error?.message || error || "authority load failure"));
      STATUS.errors = state.errors.slice();
      publishStatus(state);
    });

  animate(performance.now());

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function mountAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function render(target, options) {
  return startCanvas(target, options || {});
}

export function mount(target, options) {
  return startCanvas(target, options || {});
}

export function init(target, options) {
  return startCanvas(target, options || {});
}

export function getAudraliaCanvasStatus() {
  return window.__AUDRALIA_CANVAS_STATUS__ || STATUS;
}

export function getAudraliaSurfaceDataset() {
  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    surfaceReceipt: STATUS.surfaceReceipt,
    runtimeReceipt: STATUS.runtimeReceipt,
    canvasUsesRuntimeForMotionOnly: true,
    canvasUsesSurfaceForSurfaceTruth: true,
    canvasUsesRuntimeForSurfaceTruth: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION
  };
}

const api = {
  RECEIPT,
  CONTRACT,
  VERSION,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  renderAudralia,
  mountAudralia,
  render,
  mount,
  init,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
}

export default api;
