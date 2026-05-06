// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_STABLE_OCEAN_WORLD_DESIGN_TNT_v6
// Full-file replacement. Canvas authority only.
// Purpose: take over visual design until Audralia is stable.
// Runtime remains imported for proof/accounting only.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_STABLE_OCEAN_WORLD_DESIGN_TNT_v6";
const AUDRALIA_RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-stable-ocean-world-design-authority",
  lineage: "runtime-proof→canvas-design-takeover→stable-ocean-world",
  runtimePath: AUDRALIA_RUNTIME_PATH,
  runtimeImported: false,
  runtimeConsumedForAccountingOnly: true,
  routeMountFound: false,
  canvasCreated: false,
  canvasVisible: false,
  canvasPainted: false,
  labelVisible: false,
  animationActive: false,
  designTakeoverActive: true,
  visualDesignAuthority: "canvas-temporary-stabilization",
  runtimeVisualOverride: true,
  oceanDominant: true,
  targetSolidSurfaceRatio: 0.292,
  targetWaterRatio: 0.708,
  stablePlanetExpression: true,
  giantGrayCapSuppressed: true,
  polarIceLimited: true,
  horizontalBandingSuppressed: true,
  sphericalContinuityActive: true,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v2",
    "AUDRALIA_DOORWAY_FORCE_CANVAS_AUTHORITY_REFRESH_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_DESIGN_TAKEOVER_STABLE_PLANET_TNT_v5",
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1"
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
  document.documentElement.dataset.audraliaDesignTakeover = "active";
  document.documentElement.dataset.audraliaRuntimeVisualOverride = "true";
  document.documentElement.dataset.audraliaStableOceanWorld = "true";
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
  if (document.querySelector("#audralia-stable-ocean-world-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-stable-ocean-world-style";
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
    mount.replaceChildren(shell);
  }

  shell.dataset.contract = AUDRALIA_CANVAS_RECEIPT;

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
    canvas.setAttribute("aria-label", "Audralia adopted canvas planetary render");
    shell.appendChild(canvas);
  }

  canvas.dataset.contract = AUDRALIA_CANVAS_RECEIPT;

  let proof = shell.querySelector("[data-audralia-canvas-proof]");
  if (!proof) {
    proof = document.createElement("div");
    proof.className = "audralia-canvas-proof";
    proof.dataset.audraliaCanvasProof = "true";
    shell.appendChild(proof);
  }

  return { shell, label, canvas, proof };
}

function callGetter(fn, ctx) {
  if (typeof fn !== "function") return null;
  try {
    const value = fn.call(ctx);
    if (value && typeof value === "object") return value;
  } catch (_) {}
  return null;
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

    const stats =
      callGetter(engine?.getStats, engine) ||
      callGetter(engine?.getRuntimeStats, engine) ||
      callGetter(module.getStats, module) ||
      callGetter(module.getRuntimeStats, module) ||
      {};

    exposeStatus({
      runtimeImported: true,
      error: ""
    });

    return { module, engine, stats };
  } catch (error) {
    exposeStatus({
      runtimeImported: false,
      error: `Runtime import failed: ${error.message}`
    });

    return { module: null, engine: null, stats: {} };
  }
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const cssWidth = Math.max(360, rect.width || 720);
  const cssHeight = Math.max(420, rect.height || 720);

  const width = Math.min(980, Math.max(460, Math.floor(cssWidth * dpr)));
  const height = Math.min(980, Math.max(500, Math.floor(cssHeight * dpr)));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
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

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    frequency *= 2.03;
    amplitude *= 0.5;
  }

  return value;
}

function normalize(v) {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

const LAND_BODIES = [
  { x: -0.72, y: 0.12, z: 0.68, width: 0.31, strength: 0.95 },
  { x: 0.62, y: -0.08, z: 0.78, width: 0.29, strength: 0.91 },
  { x: 0.16, y: -0.48, z: -0.86, width: 0.28, strength: 0.88 },
  { x: -0.54, y: -0.2, z: -0.82, width: 0.24, strength: 0.78 },
  { x: 0.8, y: 0.2, z: -0.56, width: 0.23, strength: 0.72 }
].map((body) => ({
  ...body,
  normal: normalize(body)
}));

function runtimeTarget(stats) {
  const solid =
    Number(stats?.solidSurfaceLandRatio) ||
    Number(stats?.topologyLandRatio) ||
    Number(stats?.targetLandRatio) ||
    0.292;

  const land = clamp(solid, 0.27, 0.31);

  return {
    land,
    water: 1 - land
  };
}

function angularBodyField(p, body) {
  const facing = clamp(dot3(p, body.normal), -1, 1);
  const angle = Math.acos(facing);
  const falloff = Math.exp(-Math.pow(angle / body.width, 2.0));
  return falloff * body.strength;
}

function designField(sx, sy, sz, target) {
  const p = { x: sx, y: sy, z: sz };

  let bodyField = 0;

  for (const body of LAND_BODIES) {
    bodyField = Math.max(bodyField, angularBodyField(p, body));
  }

  const polarNorth = smoothstep(0.88, 0.98, sy);
  const polarSouth = smoothstep(0.9, 0.99, -sy);

  const continentalBreak = fbm3(sx * 2.35 + 2.0, sy * 2.35 - 0.7, sz * 2.35 + 4.3, 5);
  const coastalBreak = fbm3(sx * 9.2 - 1.2, sy * 9.2 + 3.5, sz * 9.2 - 5.4, 4);
  const mineral = fbm3(sx * 24.0 + 7.1, sy * 24.0 - 6.8, sz * 24.0 + 2.6, 4);
  const fine = fbm3(sx * 62.0 - 1.7, sy * 62.0 + 4.9, sz * 62.0 - 8.2, 3);

  const landTargetShift = (target.land - 0.292) * 0.8;

  const land =
    bodyField * 0.76 +
    continentalBreak * 0.13 +
    coastalBreak * 0.07 +
    mineral * 0.04 +
    landTargetShift;

  return {
    land,
    polarNorth,
    polarSouth,
    continentalBreak,
    coastalBreak,
    mineral,
    fine
  };
}

function classifyDesignSurface(sx, sy, sz, target) {
  const field = designField(sx, sy, sz, target);

  const iceSignal = Math.max(field.polarNorth, field.polarSouth);
  const threshold = 0.52;
  const coastDistance = Math.abs(field.land - threshold);
  const coast = 1 - smoothstep(0.01, 0.105, coastDistance);

  const relief = clamp01((field.land - threshold) * 3.0 + field.mineral * 0.48);
  const depth = clamp01((threshold - field.land) * 2.4 + (1 - field.continentalBreak) * 0.32);

  if (iceSignal > 0.66) {
    return {
      kind: "ice",
      relief: clamp01(relief + iceSignal * 0.16),
      depth,
      coast,
      mineral: field.mineral,
      fine: field.fine
    };
  }

  if (field.land > threshold + 0.2) {
    return {
      kind: "mountain",
      relief: clamp01(relief + 0.28),
      depth,
      coast,
      mineral: field.mineral,
      fine: field.fine
    };
  }

  if (field.land > threshold + 0.12) {
    return {
      kind: "ridge",
      relief: clamp01(relief + 0.16),
      depth,
      coast,
      mineral: field.mineral,
      fine: field.fine
    };
  }

  if (field.land > threshold + 0.04) {
    return {
      kind: "rock",
      relief,
      depth,
      coast,
      mineral: field.mineral,
      fine: field.fine
    };
  }

  if (field.land > threshold - 0.035) {
    return {
      kind: "beach",
      relief,
      depth,
      coast: Math.max(coast, 0.74),
      mineral: field.mineral,
      fine: field.fine
    };
  }

  if (field.land > threshold - 0.11) {
    return {
      kind: "shelf",
      relief,
      depth,
      coast,
      mineral: field.mineral,
      fine: field.fine
    };
  }

  return {
    kind: "ocean",
    relief,
    depth,
    coast,
    mineral: field.mineral,
    fine: field.fine
  };
}

function surfaceColor(surface, light, edge, sx, sy, sz) {
  const micro = fbm3(sx * 118.0 + 0.9, sy * 118.0 - 2.1, sz * 118.0 + 8.4, 2);

  let r;
  let g;
  let b;

  if (surface.kind === "ice") {
    r = 198 + surface.fine * 28;
    g = 220 + surface.fine * 22;
    b = 232 + surface.fine * 20;
  } else if (surface.kind === "mountain") {
    r = 72 + surface.relief * 74 + surface.mineral * 28;
    g = 76 + surface.relief * 66 + surface.mineral * 24;
    b = 84 + surface.relief * 58 + surface.mineral * 20;
  } else if (surface.kind === "ridge") {
    r = 66 + surface.relief * 58 + surface.mineral * 26;
    g = 74 + surface.relief * 54 + surface.mineral * 22;
    b = 84 + surface.relief * 48 + surface.mineral * 20;
  } else if (surface.kind === "rock") {
    r = 56 + surface.relief * 44 + surface.mineral * 28;
    g = 65 + surface.relief * 40 + surface.mineral * 24;
    b = 74 + surface.relief * 36 + surface.mineral * 22;
  } else if (surface.kind === "beach") {
    r = 190 + surface.fine * 34;
    g = 183 + surface.fine * 29;
    b = 160 + surface.fine * 23;
  } else if (surface.kind === "shelf") {
    r = 14 + surface.fine * 10;
    g = 112 + surface.depth * 34 + surface.coast * 24;
    b = 138 + surface.depth * 58 + surface.coast * 36;
  } else {
    r = 3 + surface.fine * 8;
    g = 34 + surface.depth * 34;
    b = 86 + surface.depth * 78;
  }

  if (surface.coast > 0 && surface.kind !== "ice") {
    const c = surface.coast;
    r = r * (1 - c * 0.13) + 190 * c * 0.13;
    g = g * (1 - c * 0.13) + 178 * c * 0.13;
    b = b * (1 - c * 0.13) + 144 * c * 0.13;
  }

  const shade = Math.max(0.18, light) * (1 - edge * 0.48);
  const definition = (surface.fine - 0.5) * 15 + (micro - 0.5) * 6 + (surface.mineral - 0.5) * 8;

  return [
    clamp(r * shade + definition, 0, 255),
    clamp(g * shade + definition, 0, 255),
    clamp(b * shade + definition, 0, 255)
  ];
}

function paintFrame(ctx, canvas, runtimeBundle, phase) {
  const { width, height } = resizeCanvas(canvas);
  const image = ctx.createImageData(width, height);
  const data = image.data;

  const target = runtimeTarget(runtimeBundle?.stats || {});
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.405;

  const sunX = -0.35;
  const sunY = -0.22;
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

      const axialTilt = -0.08;
      const tiltedY = -ny * Math.cos(axialTilt) - z * Math.sin(axialTilt);
      const tiltedZ = z * Math.cos(axialTilt) + ny * Math.sin(axialTilt);

      const sx = nx * Math.cos(phase) + tiltedZ * Math.sin(phase);
      const sy = tiltedY;
      const sz = tiltedZ * Math.cos(phase) - nx * Math.sin(phase);

      const surface = classifyDesignSurface(sx, sy, sz, target);
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
      const phase = ((now - startedAt) / 1000) * 0.13;
      paintFrame(ctx, canvas, runtimeBundle, phase);
      lastPaint = now;

      proof.textContent =
        `${AUDRALIA_CANVAS_RECEIPT} · runtime=${STATUS.runtimeImported ? "imported" : "unavailable"} · stable-ocean-world=true`;
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
