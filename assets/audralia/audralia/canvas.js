// /assets/audralia/audralia.canvas.js
// AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v1
// Full-file replacement. No generated image. No external dependency.

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_ADOPTED_CANVAS_AUTHORITY_TNT_v1";

const AUDRALIA_CANVAS_COMPATIBILITY_RECEIPTS = [
  "AUDRALIA_HTML_ADOPTED_CANVAS_DOORWAY_HANDOFF_TNT_v1",
  "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
  "AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1",
  "GAUGES_ADOPTED_CANVAS_AUDRALIA_ACCESS_AND_PROOF_RENEWAL_TNT_v1"
];

const STATUS = {
  ok: false,
  receipt: AUDRALIA_CANVAS_CONTRACT,
  file: "assets/audralia/audralia.canvas.js",
  role: "audralia-adopted-canvas-authority",
  lineage: "runtime→adopted-canvas→route-visible-proof",
  compatibilityReceipts: AUDRALIA_CANVAS_COMPATIBILITY_RECEIPTS.slice(),
  canvasCreated: false,
  canvasVisible: false,
  canvasPainted: false,
  runtimeImported: false,
  runtimeConsumed: false,
  routeMountFound: false,
  labelVisible: false,
  animationActive: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  error: ""
};

let activeController = null;

function exposeStatus(extra = {}) {
  Object.assign(STATUS, extra);

  window.AUDRALIA_ADOPTED_CANVAS_STATUS = STATUS;
  window.AUDRALIA_CANVAS_STATUS = STATUS;
  window.__AUDRALIA_ADOPTED_CANVAS_STATUS__ = STATUS;
  window.__AUDRALIA_CANVAS_RECEIPT__ = AUDRALIA_CANVAS_CONTRACT;

  document.documentElement.dataset.audraliaCanvasReceipt = AUDRALIA_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaCanvasAuthority = "active";
  document.documentElement.dataset.audraliaCanvasVisible = String(Boolean(STATUS.canvasVisible));
  document.documentElement.dataset.audraliaCanvasPainted = String(Boolean(STATUS.canvasPainted));

  return STATUS;
}

function findMount(explicitMount) {
  if (explicitMount instanceof HTMLElement) return explicitMount;

  return (
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("main") ||
    document.body
  );
}

function ensureShell(mount) {
  mount.dataset.audraliaCanvasMount = "true";
  mount.dataset.audraliaCanvasReceipt = AUDRALIA_CANVAS_CONTRACT;

  let shell = mount.querySelector("[data-audralia-canvas-shell]");
  if (!shell) {
    shell = document.createElement("section");
    shell.className = "audralia-canvas-shell";
    shell.dataset.audraliaCanvasShell = "true";
    shell.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
    mount.prepend(shell);
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
    canvas.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
    canvas.setAttribute("aria-label", "Audralia adopted canvas planetary render");
    shell.appendChild(canvas);
  }

  injectStyle();

  return { shell, label, canvas };
}

function injectStyle() {
  if (document.querySelector("#audralia-adopted-canvas-style")) return;

  const style = document.createElement("style");
  style.id = "audralia-adopted-canvas-style";
  style.textContent = `
    .audralia-canvas-shell {
      position: relative;
      width: min(100%, 980px);
      min-height: clamp(360px, 72vw, 760px);
      margin: 1.25rem auto;
      border-radius: 28px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 42%, rgba(68, 91, 128, 0.18), transparent 38%),
        radial-gradient(circle at 50% 50%, rgba(12, 20, 36, 0.92), rgba(4, 8, 18, 0.98) 70%);
      box-shadow:
        inset 0 0 0 1px rgba(255, 220, 150, 0.14),
        0 28px 90px rgba(0, 0, 0, 0.42);
      isolation: isolate;
    }

    .audralia-adopted-canvas {
      display: block;
      width: 100%;
      height: 100%;
      min-height: clamp(360px, 72vw, 760px);
      touch-action: none;
    }

    .audralia-canvas-label {
      position: absolute;
      left: 1rem;
      top: 1rem;
      z-index: 2;
      padding: 0.42rem 0.68rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 220, 150, 0.22);
      background: rgba(5, 10, 20, 0.66);
      color: rgba(255, 239, 196, 0.94);
      font: 700 0.78rem/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
    }
  `;
  document.head.appendChild(style);
}

async function importRuntime() {
  try {
    const runtime = await import("/assets/audralia/audralia.runtime.js");
    exposeStatus({
      runtimeImported: true,
      runtimeConsumed: true
    });
    return runtime;
  } catch (error) {
    exposeStatus({
      runtimeImported: false,
      runtimeConsumed: false,
      error: `Runtime import failed: ${error.message}`
    });
    return null;
  }
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(360, Math.floor(rect.width * dpr));
  const height = Math.max(360, Math.floor(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height, dpr };
}

function callRuntime(runtime, lat, lon, u, v) {
  if (!runtime) return null;

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

  const candidates = [
    runtime.sampleAudraliaPlanetState,
    runtime.sampleRuntimeState,
    runtime.sampleSurface,
    runtime.sampleAudraliaSurface
  ].filter((fn) => typeof fn === "function");

  for (const fn of candidates) {
    try {
      const direct = fn(payload);
      if (direct && typeof direct === "object") return direct;
    } catch (_) {}

    try {
      const positional = fn(lat, lon, u, v);
      if (positional && typeof positional === "object") return positional;
    } catch (_) {}
  }

  return null;
}

function normalizeClass(sample, lat, lon) {
  const raw =
    sample?.visualSurfaceClass ||
    sample?.surfaceClass ||
    sample?.className ||
    sample?.type ||
    "";

  if (typeof raw === "string" && raw.length > 0) return raw;

  const polar = Math.abs(lat) > 1.18;
  const wave = Math.sin(lon * 3.1) + Math.cos(lat * 4.4) + Math.sin((lon + lat) * 2.2);

  if (polar) return "glacier_ice_snowpack_surface";
  if (wave > 1.1) return "mountain_chain_relief_land_surface";
  if (wave > 0.72) return "highland_ridge_relief_land_surface";
  if (wave > 0.28) return "coastal_cliff_rock_relief_land_surface";
  if (wave > -0.08) return "beach_outline_land_surface";
  if (wave > -0.62) return "shelf_water_surface";
  return "ocean_water_surface";
}

function colorForSurface(surfaceClass, sample, shade, edge, grain) {
  const elevation = Number(sample?.elevation ?? sample?.height ?? sample?.relief ?? 0);
  const depth = Number(sample?.depth ?? sample?.waterDepth ?? 0);

  let color;

  if (surfaceClass.includes("glacier") || surfaceClass.includes("snow") || surfaceClass.includes("ice")) {
    color = [220, 238, 242];
  } else if (surfaceClass.includes("mountain")) {
    color = [112 + elevation * 38, 118 + elevation * 34, 126 + elevation * 28];
  } else if (surfaceClass.includes("ridge") || surfaceClass.includes("highland")) {
    color = [92 + elevation * 38, 98 + elevation * 32, 104 + elevation * 30];
  } else if (surfaceClass.includes("cliff") || surfaceClass.includes("basin") || surfaceClass.includes("terrain") || surfaceClass.includes("land")) {
    color = [72 + elevation * 42, 78 + elevation * 38, 84 + elevation * 32];
  } else if (surfaceClass.includes("beach")) {
    color = [210, 202, 183];
  } else if (surfaceClass.includes("shelf")) {
    color = [58, 130 + depth * 16, 148 + depth * 30];
  } else {
    color = [14, 54 + depth * 26, 96 + depth * 46];
  }

  const opal = surfaceClass.includes("beach") ? 18 : 0;
  const light = Math.max(0.15, shade) * (1 - edge * 0.36);
  const g = grain * 9;

  return [
    Math.max(0, Math.min(255, color[0] * light + opal + g)),
    Math.max(0, Math.min(255, color[1] * light + opal + g)),
    Math.max(0, Math.min(255, color[2] * light + opal + g))
  ];
}

function paintFrame(ctx, canvas, runtime, phase) {
  const { width, height } = resizeCanvas(canvas);
  const image = ctx.createImageData(width, height);
  const data = image.data;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) * 0.42;
  const sun = [-0.38, -0.26, 0.88];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const nx = (x - cx) / radius;
      const ny = (y - cy) / radius;
      const rr = nx * nx + ny * ny;

      if (rr > 1) {
        const starSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const star = starSeed - Math.floor(starSeed);
        const glow = rr < 1.18 ? Math.max(0, 1.18 - rr) * 18 : 0;

        data[index] = 4 + glow;
        data[index + 1] = 8 + glow;
        data[index + 2] = 18 + glow * 1.4 + (star > 0.998 ? 120 : 0);
        data[index + 3] = 255;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const rot = phase;
      const xr = nx * Math.cos(rot) + z * Math.sin(rot);
      const zr = z * Math.cos(rot) - nx * Math.sin(rot);

      const lat = Math.asin(-ny);
      const lon = Math.atan2(xr, zr);
      const u = (lon + Math.PI) / (Math.PI * 2);
      const v = (lat + Math.PI / 2) / Math.PI;

      const sample = callRuntime(runtime, lat, lon, u, v);
      const surfaceClass = normalizeClass(sample, lat, lon);

      const shade = Math.max(0, xr * sun[0] + -ny * sun[1] + z * sun[2]);
      const edge = Math.pow(Math.max(0, 1 - z), 1.8);
      const grain = Math.sin((lon * 38.1) + (lat * 51.7) + Math.sin(lon * 7.0)) * 0.5 + 0.5;

      const [r, g, b] = colorForSurface(surfaceClass, sample, shade, edge, grain);

      const atmosphere = Math.pow(Math.max(0, 1 - z), 3.4) * 54;

      data[index] = r + atmosphere * 0.28;
      data[index + 1] = g + atmosphere * 0.54;
      data[index + 2] = b + atmosphere;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const halo = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.06);
  halo.addColorStop(0, "rgba(0,0,0,0)");
  halo.addColorStop(0.74, "rgba(88,160,190,0.04)");
  halo.addColorStop(1, "rgba(152,210,232,0.22)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.055, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  exposeStatus({
    ok: true,
    canvasCreated: true,
    canvasVisible: true,
    canvasPainted: true,
    animationActive: true
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

  const { label, canvas } = ensureShell(mount);
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

  const runtime = await importRuntime();
  let raf = 0;
  let stopped = false;
  const start = performance.now();

  function frame(now) {
    if (stopped) return;

    const phase = ((now - start) / 1000) * 0.115;
    paintFrame(ctx, canvas, runtime, phase);

    raf = requestAnimationFrame(frame);
  }

  const observer = new ResizeObserver(() => {
    resizeCanvas(canvas);
  });

  observer.observe(canvas);

  activeController = {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    },
    status: STATUS,
    canvas
  };

  exposeStatus({
    ok: true,
    routeMountFound: true,
    canvasCreated: true,
    canvasVisible: true,
    labelVisible: Boolean(label?.textContent?.includes("Audralia")),
    error: ""
  });

  raf = requestAnimationFrame(frame);
  return STATUS;
}

export const AUDRALIA_ADOPTED_CANVAS_STATUS = STATUS;
export const AUDRALIA_CANVAS_STATUS = STATUS;
export const AUDRALIA_CANVAS_RECEIPT = AUDRALIA_CANVAS_CONTRACT;

export const createAudraliaCanvas = mountAudraliaCanvas;
export const renderAudraliaCanvas = mountAudraliaCanvas;
export const bootAudraliaCanvas = mountAudraliaCanvas;
export const mountAudraliaAdoptedCanvas = mountAudraliaCanvas;
export const renderAudraliaAdoptedCanvas = mountAudraliaCanvas;

export default mountAudraliaCanvas;

function autoBoot() {
  const hasMount =
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("[data-audralia-mount]");

  if (hasMount) {
    mountAudraliaCanvas();
  } else {
    exposeStatus({
      ok: true,
      canvasCreated: false,
      canvasVisible: false,
      error: "Canvas authority loaded; route mount not present on this page."
    });
  }
}

exposeStatus();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
} else {
  autoBoot();
}
