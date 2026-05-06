// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9
// Full-file replacement. Canvas authority only.
// Purpose: keep canvas as final downstream renderer, remove load-stage stretching,
// lock the globe viewport to a square internal bitmap, expose downstream sweep metrics.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_CANVAS_RECEIPT = "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9";
const AUDRALIA_RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const TEXTURE_WIDTH = 448;
const TEXTURE_HEIGHT = 224;
const MAX_CANVAS_SIDE = 840;
const FRAME_RATE_TARGET = 30;

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-fixed-aspect-final-render-layer",
  lineage: "tectonics→topology→terrain→hydration→oceans→runtime→canvas-renderer→route",
  runtimePath: AUDRALIA_RUNTIME_PATH,
  runtimeImported: false,
  runtimeConsumedForVisibleExpression: true,
  routeMountFound: false,
  canvasCreated: false,
  canvasVisible: false,
  canvasPainted: false,
  labelVisible: false,
  animationActive: false,
  downstreamObedienceActive: true,
  downstreamSweepActive: true,
  fixedAspectActive: true,
  squareViewportLocked: true,
  canvasDefinesLandWater: false,
  canvasDefinesTerrain: false,
  canvasDefinesHydration: false,
  canvasDefinesOceans: false,
  canvasOwnsFinalRenderingOnly: true,
  textureBuiltFromRuntime: false,
  smoothRotationActive: true,
  downstreamBandingDetected: false,
  downstreamCollapseRiskDetected: false,
  downstreamBullseyeRiskDetected: false,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_ADOPTED_CANVAS_DOWNSTREAM_SWEEP_ENTRY_TNT_v8",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v2"
  ],
  error: ""
};

const SWEEP_REPORT = {
  receipt: AUDRALIA_CANVAS_RECEIPT,
  file: "assets/audralia/audralia.canvas.js",
  downstreamFilesToSweepNext: [
    "/assets/audralia/audralia/tectonics/topology/render.js",
    "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
    "/assets/audralia/audralia/hydration/render.js",
    "/assets/audralia/audralia/hydration/oceans.render.js",
    "/assets/audralia/audralia/hydration/deep-ocean.render.js"
  ],
  textureWidth: TEXTURE_WIDTH,
  textureHeight: TEXTURE_HEIGHT,
  totalSamples: 0,
  fallbackSamples: 0,
  uniqueSurfaceClasses: [],
  rowBandingIndex: 0,
  columnCollapseIndex: 0,
  bullseyeRiskIndex: 0,
  horizontalStripeRows: 0,
  dominantClassRatio: 0,
  landWaterTransitionRatio: 0,
  status: "not-run"
};

let activeController = null;

function exposeStatus(extra = {}) {
  Object.assign(STATUS, extra);

  window.AUDRALIA_ADOPTED_CANVAS_STATUS = STATUS;
  window.AUDRALIA_CANVAS_STATUS = STATUS;
  window.__AUDRALIA_ADOPTED_CANVAS_STATUS__ = STATUS;
  window.__AUDRALIA_CANVAS_RECEIPT__ = AUDRALIA_CANVAS_RECEIPT;
  window.AUDRALIA_DOWNSTREAM_SWEEP_REPORT = SWEEP_REPORT;
  window.__AUDRALIA_DOWNSTREAM_SWEEP_REPORT__ = SWEEP_REPORT;

  document.documentElement.dataset.audraliaCanvasAuthority = "active";
  document.documentElement.dataset.audraliaCanvasReceipt = AUDRALIA_CANVAS_RECEIPT;
  document.documentElement.dataset.audraliaCanvasVisible = String(Boolean(STATUS.canvasVisible));
  document.documentElement.dataset.audraliaCanvasPainted = String(Boolean(STATUS.canvasPainted));
  document.documentElement.dataset.audraliaCanvasRuntimeImported = String(Boolean(STATUS.runtimeImported));
  document.documentElement.dataset.audraliaCanvasDownstreamObedience = "true";
  document.documentElement.dataset.audraliaCanvasDownstreamSweep = "true";
  document.documentElement.dataset.audraliaCanvasFixedAspect = "true";
  document.documentElement.dataset.audraliaCanvasDefinesLandWater = "false";
  document.documentElement.dataset.audraliaCanvasFinalRenderOnly = "true";
  document.documentElement.dataset.audraliaDownstreamBandingDetected = String(Boolean(STATUS.downstreamBandingDetected));
  document.documentElement.dataset.audraliaDownstreamCollapseRiskDetected = String(Boolean(STATUS.downstreamCollapseRiskDetected));
  document.documentElement.dataset.audraliaDownstreamBullseyeRiskDetected = String(Boolean(STATUS.downstreamBullseyeRiskDetected));
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
  if (document.querySelector("#audralia-fixed-aspect-downstream-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-fixed-aspect-downstream-style";
  style.textContent = `
    .audralia-canvas-shell {
      position: relative;
      width: min(100%, 820px);
      aspect-ratio: 1 / 1;
      min-height: 0;
      margin: 0 auto;
      border-radius: 28px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 50%, rgba(20, 54, 76, 0.22), transparent 48%),
        radial-gradient(circle at 50% 50%, rgba(3, 9, 19, 0.94), rgba(1, 4, 10, 0.99) 72%);
      isolation: isolate;
    }

    .audralia-adopted-canvas {
      display: block;
      width: 100%;
      height: 100%;
      aspect-ratio: 1 / 1;
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
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      z-index: 2;
      padding: 0.55rem 0.68rem;
      border: 1px solid rgba(116, 185, 215, 0.22);
      border-radius: 16px;
      background: rgba(3, 8, 18, 0.66);
      color: rgba(202, 229, 239, 0.86);
      font: 700 0.72rem/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      pointer-events: none;
      overflow: hidden;
      text-overflow: ellipsis;
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

function runtimeSampler(runtimeBundle) {
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

  return function sample(lat, lon, u, v) {
    const payload = { lat, lon, latitude: lat, longitude: lon, u, v, x: u, y: v };

    for (const candidate of candidates) {
      if (typeof candidate.fn !== "function") continue;

      try {
        const result = candidate.fn.call(candidate.ctx, payload);
        if (result && typeof result === "object") return result;
      } catch (_) {}

      try {
        const result = candidate.fn.call(candidate.ctx, lat, lon, u, v);
        if (result && typeof result === "object") return result;
      } catch (_) {}
    }

    return {
      visualSurfaceClass: "ocean_water_surface",
      liquidWater: true,
      depth: 0.5,
      fallback: true
    };
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
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

function fbm3(x, y, z, octaves = 4) {
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

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssSide = Math.max(320, Math.min(rect.width || 720, rect.height || rect.width || 720));
  const side = Math.min(MAX_CANVAS_SIDE, Math.max(420, Math.floor(cssSide * dpr)));

  if (canvas.width !== side || canvas.height !== side) {
    canvas.width = side;
    canvas.height = side;
  }

  return { width: side, height: side, side };
}

function paintHoldingFrame(ctx, canvas) {
  const { width, height } = resizeCanvas(canvas);
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.405;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.2);
  bg.addColorStop(0, "rgba(5, 18, 34, 1)");
  bg.addColorStop(0.72, "rgba(2, 7, 16, 1)");
  bg.addColorStop(1, "rgba(0, 0, 0, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.09);
  glow.addColorStop(0, "rgba(0,0,0,0)");
  glow.addColorStop(1, "rgba(90,160,190,0.18)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function surfaceClass(sample) {
  return String(
    sample?.visualSurfaceClass ||
    sample?.surfaceClass ||
    sample?.className ||
    sample?.type ||
    ""
  );
}

function numberValue(sample, keys, fallback) {
  for (const key of keys) {
    const value = Number(sample?.[key]);
    if (Number.isFinite(value)) return value;
  }

  return fallback;
}

function boolValue(sample, keys) {
  return keys.some((key) => Boolean(sample?.[key]));
}

function sampleToKind(sample) {
  const cls = surfaceClass(sample);

  if (boolValue(sample, ["ice", "glacier"]) || cls.includes("ice") || cls.includes("snow") || cls.includes("glacier")) return "ice";
  if (cls.includes("mountain")) return "mountain";
  if (cls.includes("ridge") || cls.includes("highland")) return "ridge";
  if (cls.includes("beach") || Boolean(sample?.beach)) return "beach";
  if (cls.includes("shelf") || Boolean(sample?.shelf)) return "shelf";
  if (cls.includes("ocean") || Boolean(sample?.ocean) || Boolean(sample?.liquidWater)) return "ocean";
  if (cls.includes("cliff") || cls.includes("rock") || cls.includes("terrain") || cls.includes("basin") || boolValue(sample, ["land", "solidSurfaceLand"])) return "rock";

  return "unknown";
}

function colorFromRuntimeSample(sample, sx, sy, sz) {
  const kind = sampleToKind(sample);

  const elevation = clamp01(numberValue(sample, ["elevation", "terrainRelief", "terrainReliefIndex"], 0));
  const depth = clamp01(numberValue(sample, ["depth", "surfaceWaterIndex"], 0.34));
  const coast = clamp01(numberValue(sample, ["coastlineIndex", "coastalFeather"], 0));
  const mineral = clamp01(numberValue(sample, ["mineralIndex", "diamondSignal", "graniteSignal"], 0.38));
  const fine = fbm3(sx * 58.0 - 1.7, sy * 58.0 + 4.9, sz * 58.0 - 8.2, 3);

  let r;
  let g;
  let b;

  if (kind === "ice") {
    r = 198 + fine * 28;
    g = 220 + fine * 22;
    b = 232 + fine * 20;
  } else if (kind === "mountain") {
    r = 72 + elevation * 78 + mineral * 28;
    g = 76 + elevation * 70 + mineral * 24;
    b = 84 + elevation * 62 + mineral * 20;
  } else if (kind === "ridge") {
    r = 66 + elevation * 58 + mineral * 26;
    g = 74 + elevation * 54 + mineral * 22;
    b = 84 + elevation * 48 + mineral * 20;
  } else if (kind === "beach") {
    r = 190 + fine * 34;
    g = 183 + fine * 29;
    b = 160 + fine * 23;
  } else if (kind === "rock") {
    r = 56 + elevation * 44 + mineral * 28;
    g = 65 + elevation * 40 + mineral * 24;
    b = 74 + elevation * 36 + mineral * 22;
  } else if (kind === "shelf") {
    r = 14 + fine * 10;
    g = 112 + depth * 34 + coast * 24;
    b = 138 + depth * 58 + coast * 36;
  } else if (kind === "ocean") {
    r = 3 + fine * 8;
    g = 34 + depth * 34;
    b = 86 + depth * 78;
  } else {
    r = 7;
    g = 46;
    b = 90;
  }

  if (coast > 0 && kind !== "ice") {
    r = r * (1 - coast * 0.12) + 190 * coast * 0.12;
    g = g * (1 - coast * 0.12) + 178 * coast * 0.12;
    b = b * (1 - coast * 0.12) + 144 * coast * 0.12;
  }

  return [
    clamp(r, 0, 255),
    clamp(g, 0, 255),
    clamp(b, 0, 255),
    kind
  ];
}

function analyzeRows(kindRows, classCounts, fallbackSamples) {
  let horizontalStripeRows = 0;
  let rowDominanceSum = 0;
  let rowClassChanges = 0;

  for (const row of kindRows) {
    const counts = {};
    for (const kind of row) counts[kind] = (counts[kind] || 0) + 1;

    const maxCount = Math.max(...Object.values(counts));
    const dominance = maxCount / row.length;
    rowDominanceSum += dominance;

    if (dominance > 0.86) horizontalStripeRows += 1;

    for (let i = 1; i < row.length; i += 1) {
      if (row[i] !== row[i - 1]) rowClassChanges += 1;
    }
  }

  const total = kindRows.length * (kindRows[0]?.length || 1);
  const dominantClassRatio = Math.max(...Object.values(classCounts)) / Math.max(1, total);
  const rowBandingIndex = horizontalStripeRows / Math.max(1, kindRows.length);
  const landWaterTransitionRatio = rowClassChanges / Math.max(1, total);
  const columnCollapseIndex = dominantClassRatio;
  const bullseyeRiskIndex = clamp01(rowBandingIndex * 0.48 + dominantClassRatio * 0.34 + (fallbackSamples / Math.max(1, total)) * 0.18);

  return {
    horizontalStripeRows,
    dominantClassRatio,
    rowBandingIndex,
    columnCollapseIndex,
    landWaterTransitionRatio,
    bullseyeRiskIndex
  };
}

function buildRuntimeTexture(runtimeBundle) {
  const sampler = runtimeSampler(runtimeBundle);
  const pixels = new Uint8ClampedArray(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4);

  let fallbackSamples = 0;
  const classCounts = {};
  const kindRows = [];

  for (let y = 0; y < TEXTURE_HEIGHT; y += 1) {
    const rowKinds = [];
    const v = (y + 0.5) / TEXTURE_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let x = 0; x < TEXTURE_WIDTH; x += 1) {
      const u = (x + 0.5) / TEXTURE_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;

      const cosLat = Math.cos(lat);
      const sx = cosLat * Math.sin(lon);
      const sy = Math.sin(lat);
      const sz = cosLat * Math.cos(lon);

      const sample = sampler(lat, lon, u, v);
      if (sample?.fallback || sample?.fallbackSample) fallbackSamples += 1;

      const color = colorFromRuntimeSample(sample, sx, sy, sz);
      const kind = color[3];

      classCounts[kind] = (classCounts[kind] || 0) + 1;
      rowKinds.push(kind);

      const index = (y * TEXTURE_WIDTH + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = 255;
    }

    kindRows.push(rowKinds);
  }

  const analysis = analyzeRows(kindRows, classCounts, fallbackSamples);

  Object.assign(SWEEP_REPORT, {
    textureWidth: TEXTURE_WIDTH,
    textureHeight: TEXTURE_HEIGHT,
    totalSamples: TEXTURE_WIDTH * TEXTURE_HEIGHT,
    fallbackSamples,
    uniqueSurfaceClasses: Object.keys(classCounts),
    ...analysis,
    status: "complete"
  });

  exposeStatus({
    textureBuiltFromRuntime: true,
    fallbackSamples,
    downstreamBandingDetected: analysis.rowBandingIndex > 0.18,
    downstreamCollapseRiskDetected: analysis.dominantClassRatio > 0.72,
    downstreamBullseyeRiskDetected: analysis.bullseyeRiskIndex > 0.44
  });

  return {
    width: TEXTURE_WIDTH,
    height: TEXTURE_HEIGHT,
    pixels,
    analysis
  };
}

function sampleTexture(texture, u, v) {
  const x = Math.floor(((u % 1 + 1) % 1) * texture.width);
  const y = clamp(Math.floor(clamp01(v) * texture.height), 0, texture.height - 1);
  const index = (y * texture.width + x) * 4;

  return [
    texture.pixels[index],
    texture.pixels[index + 1],
    texture.pixels[index + 2]
  ];
}

function paintFrame(ctx, canvas, texture, phase) {
  const { width, height } = resizeCanvas(canvas);
  const image = ctx.createImageData(width, height);
  const data = image.data;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = width * 0.405;

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

      const lat = Math.asin(clamp(sy, -1, 1));
      const lon = Math.atan2(sx, sz);
      const u = (lon + Math.PI) / (Math.PI * 2);
      const v = 0.5 - lat / Math.PI;

      const base = sampleTexture(texture, u, v);
      const light = Math.max(0, sx * sunX + sy * sunY + z * sunZ);
      const edge = Math.pow(Math.max(0, 1 - z), 1.85);
      const shade = Math.max(0.18, light) * (1 - edge * 0.48);
      const atmosphere = Math.pow(Math.max(0, 1 - z), 3.15) * 64;

      data[index] = clamp(base[0] * shade + atmosphere * 0.26, 0, 255);
      data[index + 1] = clamp(base[1] * shade + atmosphere * 0.55, 0, 255);
      data[index + 2] = clamp(base[2] * shade + atmosphere, 0, 255);
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

  resizeCanvas(canvas);
  paintHoldingFrame(ctx, canvas);

  exposeStatus({
    ok: true,
    routeMountFound: true,
    canvasCreated: true,
    canvasVisible: true,
    labelVisible: Boolean(label.textContent.includes("Audralia")),
    canvasPainted: true,
    error: ""
  });

  proof.textContent = `${AUDRALIA_CANVAS_RECEIPT} · building-runtime-texture=true`;

  const runtimeBundle = await loadRuntime();
  const texture = buildRuntimeTexture(runtimeBundle);

  paintFrame(ctx, canvas, texture, 0);

  let stopped = false;
  let raf = 0;
  let lastPaint = 0;
  const startedAt = performance.now();
  const frameInterval = 1000 / FRAME_RATE_TARGET;

  function frame(now) {
    if (stopped) return;

    if (now - lastPaint >= frameInterval) {
      const phase = ((now - startedAt) / 1000) * 0.13;
      paintFrame(ctx, canvas, texture, phase);
      lastPaint = now;

      proof.textContent =
        `${AUDRALIA_CANVAS_RECEIPT} · runtime=${STATUS.runtimeImported ? "imported" : "unavailable"} · fixed-aspect=true · banding=${STATUS.downstreamBandingDetected ? "detected" : "clear"}`;
    }

    raf = requestAnimationFrame(frame);
  }

  let observer = null;

  if (typeof ResizeObserver === "function") {
    observer = new ResizeObserver(() => {
      resizeCanvas(canvas);
      paintFrame(ctx, canvas, texture, ((performance.now() - startedAt) / 1000) * 0.13);
    });
    observer.observe(canvas);
  }

  activeController = {
    canvas,
    status: STATUS,
    sweepReport: SWEEP_REPORT,
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    }
  };

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
export const AUDRALIA_DOWNSTREAM_SWEEP_REPORT_VALUE = SWEEP_REPORT;
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
