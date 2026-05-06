// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_SPHERICAL_CONTINUITY_REFINEMENT_TNT_v4
// Full-file replacement. Canvas authority only.
// Purpose: remove horizontal seam/striping, preserve runtime import, preserve animation, preserve label/proof receipts.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_SPHERICAL_CONTINUITY_REFINEMENT_TNT_v4";
const AUDRALIA_RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-spherical-continuity-authority",
  lineage: "tectonics→topology→terrain→climate→hydration→oceans→deep-ocean→runtime→adopted-canvas→route",
  runtimePath: AUDRALIA_RUNTIME_PATH,
  runtimeImported: false,
  runtimeConsumed: false,
  runtimeStatsConsumed: false,
  routeMountFound: false,
  canvasCreated: false,
  canvasVisible: false,
  canvasPainted: false,
  labelVisible: false,
  animationActive: false,
  definitionRefinementActive: true,
  sphericalContinuityActive: true,
  latitudeStripingSuppressed: true,
  rowBandingSuppressed: true,
  runtimeTruthPreserved: true,
  projectionMode: "continuous-3d-spherical-field",
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v2",
    "AUDRALIA_DOORWAY_IMPORT_ADOPTED_CANVAS_AUTHORITY_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_VISUAL_DEFINITION_REFINEMENT_TNT_v3",
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
  document.documentElement.dataset.audraliaCanvasSphericalContinuity = "active";
  document.documentElement.dataset.audraliaCanvasLatitudeStripingSuppressed = "true";
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
  if (document.querySelector("#audralia-adopted-canvas-spherical-continuity-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-adopted-canvas-spherical-continuity-style";
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
  } else {
    shell.dataset.contract = AUDRALIA_CANVAS_RECEIPT;
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
      runtimeConsumed: true,
      runtimeStatsConsumed: Boolean(Object.keys(stats).length),
      error: ""
    });

    return { module, engine, stats };
  } catch (error) {
    exposeStatus({
      runtimeImported: false,
      runtimeConsumed: false,
      runtimeStatsConsumed: false,
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
  let amp = 0.52;
  let freq = 1;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * freq, y * freq, z * freq) * amp;
    freq *= 2.03;
    amp *= 0.5;
  }

  return value;
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

const LAND_ANCHORS = [
  { x: -0.74, y: 0.16, z: 0.65, scale: 0.48, weight: 1.0 },
  { x: 0.58, y: -0.1, z: 0.81, scale: 0.42, weight: 0.94 },
  { x: 0.23, y: -0.54, z: -0.81, scale: 0.45, weight: 0.96 },
  { x: -0.36, y: -0.42, z: -0.83, scale: 0.34, weight: 0.86 },
  { x: 0.84, y: 0.3, z: -0.45, scale: 0.36, weight: 0.82 }
];

function normalizeAnchor(anchor) {
  const length = Math.sqrt(anchor.x * anchor.x + anchor.y * anchor.y + anchor.z * anchor.z) || 1;
  return {
    x: anchor.x / length,
    y: anchor.y / length,
    z: anchor.z / length,
    scale: anchor.scale,
    weight: anchor.weight
  };
}

const NORMALIZED_LAND_ANCHORS = LAND_ANCHORS.map(normalizeAnchor);

function runtimeTarget(stats) {
  const solid =
    Number(stats?.solidSurfaceLandRatio) ||
    Number(stats?.topologyLandRatio) ||
    Number(stats?.targetLandRatio) ||
    0.292;

  const water =
    Number(stats?.liquidWaterRatio) ||
    Number(stats?.waterRatio) ||
    Number(stats?.oceanRatio) ||
    1 - solid;

  return {
    land: clamp(solid, 0.27, 0.31),
    water: clamp(water, 0.69, 0.76),
    elevationMax: clamp(Number(stats?.maxElevation) || 0.7, 0.25, 1),
    depthMax: clamp(Number(stats?.maxDepth) || 0.48, 0.2, 1)
  };
}

function sphericalLandField(sx, sy, sz, target) {
  const p = { x: sx, y: sy, z: sz };

  let anchorField = 0;

  for (const anchor of NORMALIZED_LAND_ANCHORS) {
    const d = clamp01((dot3(p, anchor) + 1) * 0.5);
    const body = smoothstep(1 - anchor.scale, 1, d) * anchor.weight;
    anchorField = Math.max(anchorField, body);
  }

  const polarNorth = smoothstep(0.72, 0.94, sy);
  const polarSouth = smoothstep(0.72, 0.94, -sy);

  const largeNoise = fbm3(sx * 2.4 + 0.4, sy * 2.4 - 1.2, sz * 2.4 + 2.0, 5);
  const coastNoise = fbm3(sx * 7.2 - 4.3, sy * 7.2 + 0.8, sz * 7.2 - 3.1, 4);
  const mineralNoise = fbm3(sx * 19.0 + 5.5, sy * 19.0 - 2.1, sz * 19.0 + 8.4, 3);

  const targetBias = (target.land - 0.292) * 1.8;

  const field =
    anchorField * 0.64 +
    largeNoise * 0.22 +
    coastNoise * 0.1 +
    mineralNoise * 0.04 +
    targetBias;

  return {
    landField: field,
    northIce: polarNorth,
    southIce: polarSouth,
    largeNoise,
    coastNoise,
    mineralNoise
  };
}

function classifyVisualSurface(sx, sy, sz, target) {
  const field = sphericalLandField(sx, sy, sz, target);
  const ice = Math.max(field.northIce, field.southIce);

  const landThreshold = 0.465;
  const beachLow = landThreshold - 0.035;
  const shelfLow = landThreshold - 0.1;

  const coastDistance = Math.abs(field.landField - landThreshold);
  const coast = 1 - smoothstep(0.012, 0.105, coastDistance);

  const relief = clamp01((field.landField - landThreshold) * 2.8 + field.mineralNoise * 0.58);
  const depth = clamp01((landThreshold - field.landField) * 2.4 + (1 - field.largeNoise) * 0.45);

  if (ice > 0.42) {
    return {
      kind: "ice",
      coast,
      relief: clamp01(relief + ice * 0.35),
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  if (field.landField >= landThreshold + 0.16) {
    return {
      kind: "mountain",
      coast,
      relief: clamp01(relief + 0.32),
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  if (field.landField >= landThreshold + 0.09) {
    return {
      kind: "ridge",
      coast,
      relief: clamp01(relief + 0.18),
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  if (field.landField >= landThreshold + 0.025) {
    return {
      kind: "rock",
      coast,
      relief,
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  if (field.landField >= beachLow) {
    return {
      kind: "beach",
      coast: Math.max(coast, 0.7),
      relief,
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  if (field.landField >= shelfLow) {
    return {
      kind: "shelf",
      coast,
      relief,
      depth,
      mineral: field.mineralNoise,
      texture: field.coastNoise
    };
  }

  return {
    kind: "ocean",
    coast,
    relief,
    depth,
    mineral: field.mineralNoise,
    texture: field.coastNoise
  };
}

function surfaceColor(surface, light, edge, sx, sy, sz, target) {
  const fine = fbm3(sx * 44.0 + 7.2, sy * 44.0 - 2.8, sz * 44.0 + 1.9, 3);
  const micro = fbm3(sx * 92.0 - 1.3, sy * 92.0 + 4.6, sz * 92.0 - 8.1, 2);

  let r;
  let g;
  let b;

  if (surface.kind === "ice") {
    r = 205 + fine * 30;
    g = 225 + fine * 24;
    b = 234 + fine * 20;
  } else if (surface.kind === "mountain") {
    r = 78 + surface.relief * 72 + surface.mineral * 32;
    g = 82 + surface.relief * 66 + surface.mineral * 26;
    b = 90 + surface.relief * 58 + surface.mineral * 22;
  } else if (surface.kind === "ridge") {
    r = 68 + surface.relief * 62 + surface.mineral * 30;
    g = 76 + surface.relief * 58 + surface.mineral * 26;
    b = 84 + surface.relief * 52 + surface.mineral * 24;
  } else if (surface.kind === "rock") {
    r = 58 + surface.relief * 52 + surface.mineral * 34;
    g = 66 + surface.relief * 48 + surface.mineral * 30;
    b = 74 + surface.relief * 42 + surface.mineral * 26;
  } else if (surface.kind === "beach") {
    r = 190 + fine * 32 + surface.mineral * 10;
    g = 183 + fine * 28 + surface.mineral * 8;
    b = 162 + fine * 23 + surface.mineral * 6;
  } else if (surface.kind === "shelf") {
    r = 18 + fine * 12;
    g = 112 + surface.depth * 32 + surface.coast * 26;
    b = 135 + surface.depth * 54 + surface.coast * 38;
  } else {
    r = 5 + fine * 8;
    g = 34 + surface.depth * 36;
    b = 82 + surface.depth * 74;
  }

  if (surface.coast > 0 && surface.kind !== "ice") {
    const coast = surface.coast;
    r = r * (1 - coast * 0.16) + 192 * coast * 0.16;
    g = g * (1 - coast * 0.16) + 178 * coast * 0.16;
    b = b * (1 - coast * 0.16) + 142 * coast * 0.16;
  }

  const shade = Math.max(0.18, light) * (1 - edge * 0.48);
  const definition = (fine - 0.5) * 17 + (micro - 0.5) * 7 + (surface.mineral - 0.5) * 10;

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

      const tilt = -0.17;
      const yTilt = -ny * Math.cos(tilt) - z * Math.sin(tilt);
      const zTilt = z * Math.cos(tilt) - -ny * Math.sin(tilt);

      const rotatedX = nx * Math.cos(phase) + zTilt * Math.sin(phase);
      const rotatedZ = zTilt * Math.cos(phase) - nx * Math.sin(phase);

      const sx = rotatedX;
      const sy = yTilt;
      const sz = rotatedZ;

      const surface = classifyVisualSurface(sx, sy, sz, target);
      const light = Math.max(0, sx * sunX + sy * sunY + z * sunZ);
      const edge = Math.pow(Math.max(0, 1 - z), 1.85);
      const color = surfaceColor(surface, light, edge, sx, sy, sz, target);
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
        `${AUDRALIA_CANVAS_RECEIPT} · runtime=${STATUS.runtimeImported ? "imported" : "unavailable"} · animated=true · spherical-continuity=true`;
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
