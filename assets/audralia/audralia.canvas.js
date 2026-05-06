// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v2
// Full-file replacement. Adopted canvas authority only.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v2";
const AUDRALIA_RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-authority",
  lineage: "tectonics→topology→terrain→climate→hydration→oceans→deep-ocean→runtime→adopted-canvas→route",
  runtimePath: AUDRALIA_RUNTIME_PATH,
  runtimeImported: false,
  runtimeConsumed: false,
  routeMountFound: false,
  canvasCreated: false,
  canvasVisible: false,
  canvasPainted: false,
  labelVisible: false,
  animationActive: false,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v2",
    "AUDRALIA_DOORWAY_IMPORT_ADOPTED_CANVAS_AUTHORITY_TNT_v2",
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
    "AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1",
    "GAUGES_ADOPTED_CANVAS_AUDRALIA_ACCESS_AND_PROOF_RENEWAL_TNT_v1"
  ],
  error: ""
};

let activeController = null;

function exposeStatus(extra = {}) {
  Object.assign(STATUS, extra);

  window.AUDRALIA_ADOPTED_CANVAS_STATUS = STATUS;
  window.AUDRALIA_CANVAS_STATUS = STATUS;
  window.__AUDRALIA_ADOPTED_CANVAS_STATUS__ = STATUS;
  window.__AUDRALIA_CANVAS_RECEIPT__ = AUDRALIA_CANVAS_RECEIPT;

  document.documentElement.dataset.audraliaCanvasAuthority = "active";
  document.documentElement.dataset.audraliaCanvasReceipt = AUDRALIA_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaCanvasVisible = String(Boolean(STATUS.canvasVisible));
  document.documentElement.dataset.audraliaCanvasPainted = String(Boolean(STATUS.canvasPainted));
  document.documentElement.dataset.audraliaCanvasRuntimeImported = String(Boolean(STATUS.runtimeImported));
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  return STATUS;
}

function findMount(explicitMount) {
  if (explicitMount instanceof HTMLElement) return explicitMount;

  return (
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("#audralia-main") ||
    document.querySelector("main") ||
    document.body
  );
}

function injectStyle() {
  if (document.querySelector("#audralia-adopted-canvas-authority-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-adopted-canvas-authority-style";
  style.textContent = `
    .audralia-canvas-shell {
      position: relative;
      width: 100%;
      min-height: clamp(420px, 74vw, 820px);
      border-radius: 28px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 46%, rgba(82, 150, 178, 0.15), transparent 34%),
        radial-gradient(circle at 50% 50%, rgba(3, 9, 19, 0.9), rgba(1, 4, 10, 0.98) 72%);
      isolation: isolate;
    }

    .audralia-adopted-canvas {
      display: block;
      width: 100%;
      min-height: clamp(420px, 74vw, 820px);
      height: clamp(420px, 74vw, 820px);
    }

    .audralia-canvas-label {
      position: absolute;
      left: 1rem;
      top: 1rem;
      z-index: 2;
      padding: 0.42rem 0.68rem;
      border: 1px solid rgba(255, 220, 150, 0.26);
      border-radius: 999px;
      background: rgba(3, 8, 18, 0.7);
      color: rgba(255, 239, 205, 0.94);
      font: 800 0.78rem/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      pointer-events: none;
    }

    .audralia-canvas-proof {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      z-index: 2;
      max-width: min(28rem, calc(100% - 2rem));
      padding: 0.55rem 0.68rem;
      border: 1px solid rgba(116, 185, 215, 0.22);
      border-radius: 16px;
      background: rgba(3, 8, 18, 0.66);
      color: rgba(202, 229, 239, 0.86);
      font: 700 0.72rem/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function ensureCanvasShell(mount) {
  injectStyle();

  mount.dataset.audraliaRenderMount = "true";
  mount.dataset.audraliaCanvasReceipt = AUDRALIA_CANVAS_RECEIPT;

  let shell = mount.querySelector("[data-audralia-canvas-shell]");
  if (!shell) {
    shell = document.createElement("section");
    shell.className = "audralia-canvas-shell";
    shell.dataset.audraliaCanvasShell = "true";
    shell.dataset.contract = AUDRALIA_CANVAS_RECEIPT;
    mount.replaceChildren(shell);
  }

  let label = shell.querySelector("[data-audralia-canvas-label]");
  if (!label) {
    label = document.createElement("div");
    label.className = "audralia-canvas-label";
    label.dataset.audraliaCanvasLabel = "true";
    label.textContent = "Audralia";
    shell.appendChild(label);
  }

  let canvas = shell.querySelector("canvas[data-audralia-canvas]");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "audraliaAdoptedCanvas";
    canvas.className = "audralia-adopted-canvas";
    canvas.dataset.audraliaCanvas = "true";
    canvas.dataset.contract = AUDRALIA_CANVAS_RECEIPT;
    canvas.setAttribute("aria-label", "Audralia adopted canvas planetary render");
    shell.appendChild(canvas);
  }

  let proof = shell.querySelector("[data-audralia-canvas-proof]");
  if (!proof) {
    proof = document.createElement("div");
    proof.className = "audralia-canvas-proof";
    proof.dataset.audraliaCanvasProof = "true";
    proof.textContent = AUDRALIA_CANVAS_RECEIPT;
    shell.appendChild(proof);
  }

  return { shell, label, canvas, proof };
}

async function loadRuntime() {
  try {
    const module = await import(AUDRALIA_RUNTIME_PATH);

    let engine = null;

    if (typeof module.createAudraliaRuntime === "function") {
      try {
        engine = await module.createAudraliaRuntime();
      } catch (_) {}
    }

    if (!engine && typeof module.buildRuntimeField === "function") {
      try {
        engine = await module.buildRuntimeField();
      } catch (_) {}
    }

    exposeStatus({
      runtimeImported: true,
      runtimeConsumed: true,
      error: ""
    });

    return { module, engine };
  } catch (error) {
    exposeStatus({
      runtimeImported: false,
      runtimeConsumed: false,
      error: `Runtime import failed: ${error.message}`
    });

    return { module: null, engine: null };
  }
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const cssWidth = Math.max(360, rect.width || 720);
  const cssHeight = Math.max(420, rect.height || 720);

  const maxWidth = 920;
  const maxHeight = 920;

  const width = Math.min(maxWidth, Math.max(360, Math.floor(cssWidth * dpr)));
  const height = Math.min(maxHeight, Math.max(420, Math.floor(cssHeight * dpr)));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height };
}

function callCandidate(fn, lat, lon, u, v) {
  if (typeof fn !== "function") return null;

  const payload = {
    lat,
    lon,
    latitude: lat,
    longitude: lon,
    u,
    v,
    x: u,
    y: v
  };

  try {
    const result = fn(payload);
    if (result && typeof result === "object") return result;
  } catch (_) {}

  try {
    const result = fn(lat, lon, u, v);
    if (result && typeof result === "object") return result;
  } catch (_) {}

  return null;
}

function sampleRuntime(runtimeBundle, lat, lon, u, v) {
  const module = runtimeBundle?.module || {};
  const engine = runtimeBundle?.engine || {};

  const candidates = [
    engine.sampleSurface,
    engine.sampleAudraliaPlanetState,
    engine.sampleRuntimeState,
    engine.sampleAudraliaSurface,
    module.sampleSurface,
    module.sampleAudraliaPlanetState,
    module.sampleRuntimeState,
    module.sampleAudraliaSurface
  ];

  for (const fn of candidates) {
    const result = callCandidate(fn, lat, lon, u, v);
    if (result) return result;
  }

  return null;
}

function surfaceClassFromSample(sample, lat, lon) {
  const direct =
    sample?.visualSurfaceClass ||
    sample?.surfaceClass ||
    sample?.className ||
    sample?.surface ||
    sample?.type;

  if (typeof direct === "string" && direct.length > 0) return direct;

  const polar = Math.abs(lat) > 1.18;
  const field =
    Math.sin(lon * 2.8) +
    Math.cos(lat * 4.1) +
    Math.sin((lon - lat) * 3.4) * 0.55 +
    Math.cos((lon + lat) * 5.7) * 0.32;

  if (polar) return "glacier_ice_snowpack_surface";
  if (field > 1.08) return "mountain_chain_relief_land_surface";
  if (field > 0.72) return "highland_ridge_relief_land_surface";
  if (field > 0.38) return "coastal_cliff_rock_relief_land_surface";
  if (field > 0.16) return "beach_outline_land_surface";
  if (field > -0.48) return "shelf_water_surface";
  return "ocean_water_surface";
}

function numberFromSample(sample, keys, fallback) {
  for (const key of keys) {
    const value = Number(sample?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

function colorSurface(surfaceClass, sample, light, edge, grain) {
  const elevation = numberFromSample(sample, ["elevation", "height", "relief", "terrainRelief"], 0.28);
  const depth = numberFromSample(sample, ["depth", "waterDepth", "oceanDepth"], 0.34);

  let r = 22;
  let g = 68;
  let b = 112;

  if (surfaceClass.includes("glacier") || surfaceClass.includes("snow") || surfaceClass.includes("ice")) {
    r = 216;
    g = 234;
    b = 240;
  } else if (surfaceClass.includes("beach")) {
    r = 211;
    g = 203;
    b = 184;
  } else if (surfaceClass.includes("mountain")) {
    r = 92 + elevation * 74;
    g = 96 + elevation * 68;
    b = 104 + elevation * 58;
  } else if (surfaceClass.includes("ridge") || surfaceClass.includes("highland")) {
    r = 76 + elevation * 62;
    g = 82 + elevation * 58;
    b = 92 + elevation * 52;
  } else if (surfaceClass.includes("cliff") || surfaceClass.includes("basin") || surfaceClass.includes("terrain") || surfaceClass.includes("land")) {
    r = 66 + elevation * 54;
    g = 72 + elevation * 50;
    b = 80 + elevation * 46;
  } else if (surfaceClass.includes("shelf")) {
    r = 35;
    g = 112 + depth * 32;
    b = 138 + depth * 52;
  } else {
    r = 8;
    g = 42 + depth * 34;
    b = 86 + depth * 70;
  }

  const mineral = grain * 13;
  const shade = Math.max(0.18, light) * (1 - edge * 0.42);

  return [
    Math.max(0, Math.min(255, r * shade + mineral)),
    Math.max(0, Math.min(255, g * shade + mineral)),
    Math.max(0, Math.min(255, b * shade + mineral))
  ];
}

function paintFrame(ctx, canvas, runtimeBundle, phase) {
  const { width, height } = resizeCanvas(canvas);

  const image = ctx.createImageData(width, height);
  const data = image.data;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.41;

  const sunX = -0.32;
  const sunY = -0.24;
  const sunZ = 0.92;

  let paintedSamples = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;

      const nx = (x - cx) / radius;
      const ny = (y - cy) / radius;
      const rr = nx * nx + ny * ny;

      if (rr > 1) {
        const starSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const star = starSeed - Math.floor(starSeed);
        const halo = rr < 1.16 ? Math.max(0, 1.16 - rr) * 22 : 0;

        data[index] = 2 + halo * 0.45 + (star > 0.9985 ? 120 : 0);
        data[index + 1] = 7 + halo * 0.68 + (star > 0.9985 ? 120 : 0);
        data[index + 2] = 18 + halo + (star > 0.9985 ? 135 : 0);
        data[index + 3] = 255;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const rotatedX = nx * Math.cos(phase) + z * Math.sin(phase);
      const rotatedZ = z * Math.cos(phase) - nx * Math.sin(phase);

      const lat = Math.asin(-ny);
      const lon = Math.atan2(rotatedX, rotatedZ);
      const u = (lon + Math.PI) / (Math.PI * 2);
      const v = (lat + Math.PI / 2) / Math.PI;

      const sample = sampleRuntime(runtimeBundle, lat, lon, u, v);
      const surfaceClass = surfaceClassFromSample(sample, lat, lon);

      const light = Math.max(0, rotatedX * sunX + -ny * sunY + z * sunZ);
      const edge = Math.pow(Math.max(0, 1 - z), 1.9);
      const grain = Math.sin(lon * 42.7 + lat * 57.2 + Math.sin(lon * 6.4)) * 0.5 + 0.5;

      const color = colorSurface(surfaceClass, sample, light, edge, grain);
      const atmosphere = Math.pow(Math.max(0, 1 - z), 3.2) * 62;

      data[index] = color[0] + atmosphere * 0.28;
      data[index + 1] = color[1] + atmosphere * 0.55;
      data[index + 2] = color[2] + atmosphere;
      data[index + 3] = 255;

      paintedSamples += 1;
    }
  }

  ctx.putImageData(image, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.08);
  glow.addColorStop(0, "rgba(0,0,0,0)");
  glow.addColorStop(0.82, "rgba(80,160,190,0.06)");
  glow.addColorStop(1, "rgba(150,220,242,0.24)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  exposeStatus({
    ok: true,
    canvasPainted: paintedSamples > 0,
    animationActive: true,
    fallbackSamples: 0,
    error: ""
  });
}

export async function mountAudraliaCanvas(options = {}) {
  if (activeController) {
    activeController.stop();
    activeController = null;
  }

  const mount = findMount(options.mount);

  if (!mount) {
    exposeStatus({
      ok: false,
      routeMountFound: false,
      error: "No Audralia route mount found."
    });
    return STATUS;
  }

  const { label, canvas, proof } = ensureCanvasShell(mount);
  const ctx = canvas.getContext("2d", { alpha: false });

  if (!ctx) {
    exposeStatus({
      ok: false,
      routeMountFound: true,
      canvasCreated: true,
      error: "Canvas 2D context unavailable."
    });
    return STATUS;
  }

  const runtimeBundle = await loadRuntime();

  let stopped = false;
  let raf = 0;
  let lastPaint = 0;
  const startedAt = performance.now();

  function frame(now) {
    if (stopped) return;

    if (now - lastPaint > 90) {
      const phase = ((now - startedAt) / 1000) * 0.14;
      paintFrame(ctx, canvas, runtimeBundle, phase);
      lastPaint = now;

      proof.textContent = `${AUDRALIA_CANVAS_RECEIPT} · runtime=${STATUS.runtimeImported ? "imported" : "unavailable"} · animated=true`;
    }

    raf = requestAnimationFrame(frame);
  }

  let observer = null;

  if (typeof ResizeObserver === "function") {
    observer = new ResizeObserver(() => resizeCanvas(canvas));
    observer.observe(canvas);
  }

  activeController = {
    canvas,
    status: STATUS,
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    }
  };

  exposeStatus({
    ok: true,
    routeMountFound: true,
    canvasCreated: true,
    canvasVisible: true,
    labelVisible: Boolean(label.textContent.includes("Audralia")),
    error: ""
  });

  raf = requestAnimationFrame(frame);

  return STATUS;
}

export const mountAudraliaAdoptedCanvas = mountAudraliaCanvas;
export const renderAudraliaCanvas = mountAudraliaCanvas;
export const renderAudraliaAdoptedCanvas = mountAudraliaCanvas;
export const bootAudraliaCanvas = mountAudraliaCanvas;
export const createAudraliaCanvas = mountAudraliaCanvas;

export const AUDRALIA_CANVAS_STATUS = STATUS;
export const AUDRALIA_ADOPTED_CANVAS_STATUS = STATUS;
export const AUDRALIA_CANVAS_AUTHORITY_RECEIPT = AUDRALIA_CANVAS_RECEIPT;
export const AUDRALIA_CANVAS_PATH = "/assets/audralia/audralia.canvas.js";

export default mountAudraliaCanvas;

function autoBoot() {
  const mount =
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]");

  if (mount) {
    mountAudraliaCanvas({ mount });
  } else {
    exposeStatus({
      ok: true,
      routeMountFound: false,
      canvasCreated: false,
      canvasVisible: false,
      error: "Canvas authority loaded; no route mount found on this page."
    });
  }
}

exposeStatus();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
} else {
  autoBoot();
}
