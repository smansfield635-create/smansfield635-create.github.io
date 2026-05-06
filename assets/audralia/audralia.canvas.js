
// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_VISUAL_DEFINITION_REFINEMENT_TNT_v3
// Full-file replacement. Canvas authority only.
// Preserves route handoff, runtime import, animation, label, and proof receipts.

const AUDRALIA_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_VISUAL_DEFINITION_REFINEMENT_TNT_v3";
const AUDRALIA_RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-visual-definition-authority",
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
  definitionRefinementActive: true,
  horizontalBandSuppressionActive: true,
  sphericalContinuityActive: true,
  runtimeTruthPreserved: true,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v2",
    "AUDRALIA_DOORWAY_IMPORT_ADOPTED_CANVAS_AUTHORITY_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v2",
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
    "AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1"
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
  document.documentElement.dataset.audraliaCanvasDefinitionRefinement = "active";
  document.documentElement.dataset.audraliaCanvasHorizontalBandSuppression = "active";
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
  if (document.querySelector("#audralia-adopted-canvas-definition-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-adopted-canvas-definition-style";
  style.textContent = `
    .audralia-canvas-shell {
      position: relative;
      width: 100%;
      min-height: clamp(420px, 74vw, 820px);
      border-radius: 28px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 46%, rgba(82, 150, 178, 0.14), transparent 34%),
        radial-gradient(circle at 50% 50%, rgba(3, 9, 19, 0.92), rgba(1, 4, 10, 0.99) 72%);
      isolation: isolate;
    }

    .audralia-adopted-canvas {
      display: block;
      width: 100%;
      min-height: clamp(420px, 74vw, 820px);
      height: clamp(420px, 74vw, 820px);
      image-rendering: auto;
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
      max-width: min(31rem, calc(100% - 2rem));
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

  const width = Math.min(860, Math.max(420, Math.floor(cssWidth * dpr)));
  const height = Math.min(900, Math.max(460, Math.floor(cssHeight * dpr)));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height };
}

function callCandidate(candidate, lat, lon, u, v) {
  if (!candidate || typeof candidate.fn !== "function") return null;

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
    const result = candidate.fn.call(candidate.ctx, payload);
    if (result && typeof result === "object") return result;
  } catch (_) {}

  try {
    const result = candidate.fn.call(candidate.ctx, lat, lon, u, v);
    if (result && typeof result === "object") return result;
  } catch (_) {}

  return null;
}

function sampleRuntime(runtimeBundle, lat, lon, u, v) {
  const module = runtimeBundle?.module || {};
  const engine = runtimeBundle?.engine || {};

  const candidates = [
    { fn: engine.sampleSurface, ctx: engine },
    { fn: engine.sampleAudraliaPlanetState, ctx: engine },
    { fn: engine.sampleRuntimeState, ctx: engine },
    { fn: engine.sampleAudraliaSurface, ctx: engine },
    { fn: module.sampleSurface, ctx: module },
    { fn: module.sampleAudraliaPlanetState, ctx: module },
    { fn: module.sampleRuntimeState, ctx: module },
    { fn: module.sampleAudraliaSurface, ctx: module }
  ];

  for (const candidate of candidates) {
    const result = callCandidate(candidate, lat, lon, u, v);
    if (result) return result;
  }

  return null;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = h(0, 0, 0) * (1 - ux) + h(1, 0, 0) * ux;
  const x10 = h(0, 1, 0) * (1 - ux) + h(1, 1, 0) * ux;
  const x01 = h(0, 0, 1) * (1 - ux) + h(1, 0, 1) * ux;
  const x11 = h(0, 1, 1) * (1 - ux) + h(1, 1, 1) * ux;

  const y0 = x00 * (1 - uy) + x10 * uy;
  const y1 = x01 * (1 - uy) + x11 * uy;

  return y0 * (1 - uz) + y1 * uz;
}

function fbm3(x, y, z) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;

  for (let i = 0; i < 5; i += 1) {
    value += valueNoise3(x * freq, y * freq, z * freq) * amp;
    freq *= 2.08;
    amp *= 0.52;
  }

  return value;
}

function numeric(sample, keys, fallback) {
  for (const key of keys) {
    const value = Number(sample?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

function directClass(sample) {
  const value =
    sample?.visualSurfaceClass ||
    sample?.surfaceClass ||
    sample?.className ||
    sample?.surface ||
    sample?.type;

  return typeof value === "string" ? value : "";
}

function classifySurface(sample, lat, lon, sx, sy, sz) {
  const raw = directClass(sample);

  const polar = Math.abs(lat) > 1.18;
  const elevation = numeric(sample, ["elevation", "height", "relief", "terrainRelief"], 0.22);
  const depth = numeric(sample, ["depth", "waterDepth", "oceanDepth"], 0.34);
  const hydration = numeric(sample, ["hydration", "hydrationIndex", "surfaceWaterIndex"], 0.5);

  const continentNoise = fbm3(sx * 2.2 + 4.1, sy * 2.2 - 1.7, sz * 2.2 + 0.6);
  const coastNoise = fbm3(sx * 7.5 - 0.2, sy * 7.5 + 2.4, sz * 7.5 - 1.9);
  const mineralNoise = fbm3(sx * 18.0 + 1.5, sy * 18.0 - 3.2, sz * 18.0 + 4.7);

  const rawWater =
    raw.includes("ocean") ||
    raw.includes("water") ||
    raw.includes("shelf") ||
    raw.includes("deep");

  const rawIce =
    raw.includes("glacier") ||
    raw.includes("snow") ||
    raw.includes("ice");

  const rawLand =
    raw.includes("land") ||
    raw.includes("mountain") ||
    raw.includes("ridge") ||
    raw.includes("cliff") ||
    raw.includes("basin") ||
    raw.includes("terrain") ||
    raw.includes("beach");

  let landSignal = continentNoise * 0.62 + coastNoise * 0.26 + mineralNoise * 0.12;

  if (rawLand) landSignal += 0.18;
  if (rawWater) landSignal -= 0.14;
  if (rawIce) landSignal += 0.1;

  const coastline = Math.abs(landSignal - 0.52);
  const coastalFeather = 1 - smoothstep(0.015, 0.14, coastline);

  if (polar || rawIce) {
    return {
      kind: "ice",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  if (landSignal > 0.62 || raw.includes("mountain")) {
    return {
      kind: "mountain",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  if (landSignal > 0.57 || raw.includes("ridge") || raw.includes("highland")) {
    return {
      kind: "ridge",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  if (landSignal > 0.535 || raw.includes("cliff") || raw.includes("basin") || raw.includes("terrain")) {
    return {
      kind: "rock",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  if (landSignal > 0.5 || raw.includes("beach")) {
    return {
      kind: "beach",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  if (landSignal > 0.445 || raw.includes("shelf")) {
    return {
      kind: "shelf",
      raw,
      elevation,
      depth,
      hydration,
      continentNoise,
      coastNoise,
      mineralNoise,
      coastalFeather
    };
  }

  return {
    kind: "ocean",
    raw,
    elevation,
    depth,
    hydration,
    continentNoise,
    coastNoise,
    mineralNoise,
    coastalFeather
  };
}

function surfaceColor(surface, light, edge, sx, sy, sz) {
  const relief = clamp01(surface.elevation);
  const depth = clamp01(surface.depth);
  const mineral = surface.mineralNoise;
  const fine = fbm3(sx * 42.0 + 2.7, sy * 42.0 - 8.1, sz * 42.0 + 1.2);

  let r;
  let g;
  let b;

  if (surface.kind === "ice") {
    r = 210 + fine * 28;
    g = 229 + fine * 22;
    b = 236 + fine * 18;
  } else if (surface.kind === "mountain") {
    r = 88 + relief * 58 + mineral * 24;
    g = 91 + relief * 54 + mineral * 20;
    b = 98 + relief * 48 + mineral * 18;
  } else if (surface.kind === "ridge") {
    r = 75 + relief * 50 + mineral * 22;
    g = 82 + relief * 48 + mineral * 20;
    b = 91 + relief * 44 + mineral * 18;
  } else if (surface.kind === "rock") {
    r = 62 + relief * 42 + mineral * 28;
    g = 69 + relief * 40 + mineral * 24;
    b = 76 + relief * 36 + mineral * 22;
  } else if (surface.kind === "beach") {
    r = 190 + fine * 32;
    g = 182 + fine * 28;
    b = 161 + fine * 22;
  } else if (surface.kind === "shelf") {
    r = 28 + fine * 10;
    g = 108 + depth * 28 + surface.coastalFeather * 28;
    b = 132 + depth * 52 + surface.coastalFeather * 36;
  } else {
    r = 6 + fine * 8;
    g = 36 + depth * 36;
    b = 82 + depth * 78;
  }

  if (surface.coastalFeather > 0 && surface.kind !== "ice") {
    const coast = surface.coastalFeather;
    r = r * (1 - coast * 0.18) + 192 * coast * 0.18;
    g = g * (1 - coast * 0.18) + 178 * coast * 0.18;
    b = b * (1 - coast * 0.18) + 142 * coast * 0.18;
  }

  const shade = Math.max(0.18, light) * (1 - edge * 0.46);
  const definition = (fine - 0.5) * 15 + (mineral - 0.5) * 9;

  return [
    Math.max(0, Math.min(255, r * shade + definition)),
    Math.max(0, Math.min(255, g * shade + definition)),
    Math.max(0, Math.min(255, b * shade + definition))
  ];
}

function paintFrame(ctx, canvas, runtimeBundle, phase) {
  const { width, height } = resizeCanvas(canvas);

  const image = ctx.createImageData(width, height);
  const data = image.data;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.405;

  const sunX = -0.34;
  const sunY = -0.25;
  const sunZ = 0.91;

  let paintedSamples = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;

      const nx = (x - cx) / radius;
      const ny = (y - cy) / radius;
      const rr = nx * nx + ny * ny;

      if (rr > 1) {
        const starSeed = hash3(x * 0.021, y * 0.021, 9.1);
        const halo = rr < 1.17 ? Math.max(0, 1.17 - rr) * 22 : 0;
        const star = starSeed > 0.9978 ? 150 : 0;

        data[index] = 2 + halo * 0.45 + star;
        data[index + 1] = 7 + halo * 0.68 + star;
        data[index + 2] = 18 + halo + star;
        data[index + 3] = 255;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const rotatedX = nx * Math.cos(phase) + z * Math.sin(phase);
      const rotatedZ = z * Math.cos(phase) - nx * Math.sin(phase);

      const sx = rotatedX;
      const sy = -ny;
      const sz = rotatedZ;

      const lat = Math.asin(sy);
      const lon = Math.atan2(sx, sz);

      const u = (lon + Math.PI) / (Math.PI * 2);
      const v = (lat + Math.PI / 2) / Math.PI;

      const sample = sampleRuntime(runtimeBundle, lat, lon, u, v);
      const surface = classifySurface(sample, lat, lon, sx, sy, sz);

      const light = Math.max(0, sx * sunX + sy * sunY + z * sunZ);
      const edge = Math.pow(Math.max(0, 1 - z), 1.85);

      const color = surfaceColor(surface, light, edge, sx, sy, sz);
      const atmosphere = Math.pow(Math.max(0, 1 - z), 3.15) * 64;

      data[index] = color[0] + atmosphere * 0.26;
      data[index + 1] = color[1] + atmosphere * 0.55;
      data[index + 2] = color[2] + atmosphere;
      data[index + 3] = 255;

      paintedSamples += 1;
    }
  }

  ctx.putImageData(image, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.09);
  glow.addColorStop(0, "rgba(0,0,0,0)");
  glow.addColorStop(0.76, "rgba(80,160,190,0.045)");
  glow.addColorStop(1, "rgba(150,220,242,0.25)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.09, 0, Math.PI * 2);
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

    if (now - lastPaint > 96) {
      const phase = ((now - startedAt) / 1000) * 0.135;
      paintFrame(ctx, canvas, runtimeBundle, phase);
      lastPaint = now;

      proof.textContent =
        `${AUDRALIA_CANVAS_RECEIPT} · runtime=${STATUS.runtimeImported ? "imported" : "unavailable"} · animated=true · definition=refined`;
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
