/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8 */
/* Full-file replacement. Canvas authority only. */
/* Preserves v7 fail-open first paint, interaction freeze guard, route-owned call, and public exports. */
/* No GraphicBox. No image generation. No visual-pass claim. */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8";
const PREVIOUS_CONTRACT = "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7";
const RETIRED_CONTRACT = "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6";
const VERSION = "2026-05-07.runtime-backed-orthographic-realism-v8";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

let activeController = null;

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  retiredContract: RETIRED_CONTRACT,
  version: VERSION,
  runtimePath: RUNTIME_PATH,
  runtimeBacked: false,
  runtimeTextureReady: false,
  firstPaintForced: true,
  failOpenRenderer: true,
  interactionFreezeGuard: true,
  stripProjectionRemoved: true,
  orthographicProjectionActive: true,
  realismStage: "runtime-backed-orthographic-realism",
  animated: false,
  frameCount: 0,
  pixelProof: null,
  runtimeReceipt: "",
  runtimeError: "",
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  canonicalExport: "mountAudraliaCanvas"
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function rgba(r, g, b, a = 255) {
  return [
    clamp(Math.round(r), 0, 255),
    clamp(Math.round(g), 0, 255),
    clamp(Math.round(b), 0, 255),
    clamp(Math.round(a), 0, 255)
  ];
}

function mixRgba(a, b, t) {
  return rgba(
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
    mix(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], t)
  );
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function noise3(x, y, z) {
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

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += noise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridged3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = fbm3(x * frequency, y * frequency, z * frequency, 1);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.11;
  }

  return value / Math.max(0.000001, normalizer);
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
    document.querySelector("#audraliaRenderMount") ||
    document.querySelector("#audralia-canvas-mount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("#audralia-mount") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-audralia-render-mount]") ||
    document.querySelector("#audralia-main") ||
    document.body
  );
}

function applyNoSelect(node) {
  node.style.userSelect = "none";
  node.style.webkitUserSelect = "none";
  node.style.webkitTouchCallout = "none";
  node.style.touchAction = "manipulation";
}

function guardInteraction(node, state) {
  ["selectstart", "dragstart", "dblclick", "contextmenu"].forEach((type) => {
    node.addEventListener(
      type,
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 500;
      },
      { capture: true }
    );
  });

  node.addEventListener(
    "pointerdown",
    (event) => {
      if (event.detail >= 2) {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 500;
      }
    },
    { capture: true, passive: false }
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
  node.dataset.audraliaCanvasLoaded = "true";
  node.dataset.audraliaCanvasReceipt = RECEIPT;
  node.dataset.audraliaCanvasContract = CONTRACT;
  node.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
}

function clearOwnedNodes(mount) {
  mount.querySelectorAll("[data-audralia-canvas-authority='true']").forEach((node) => node.remove());
}

function createNodes(mount, state) {
  clearOwnedNodes(mount);

  const shell = document.createElement("section");
  shell.dataset.audraliaCanvasAuthority = "true";
  shell.dataset.audraliaReceipt = RECEIPT;
  shell.dataset.audraliaContract = CONTRACT;
  shell.dataset.audraliaPreviousContract = PREVIOUS_CONTRACT;
  shell.style.width = "min(100%, 980px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.dataset.audraliaCanvasFrame = "runtime-backed-orthographic-realism-v8";
  frame.style.width = "min(92vw, 860px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231,204,142,0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(13,32,58,0.98), rgba(2,7,19,1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0,0,0,0.54), inset 0 0 90px rgba(136,195,255,0.10)";

  const canvas = document.createElement("canvas");
  canvas.dataset.audraliaCanvas = "true";
  canvas.setAttribute("aria-label", "Audralia runtime-backed orthographic realism canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.dataset.audraliaCanvasProof = "true";
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245,233,199,0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  [shell, frame, canvas, proof].forEach(applyNoSelect);
  [shell, frame, canvas].forEach((node) => guardInteraction(node, state));

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame, options = {}) {
  const rect = frame.getBoundingClientRect();
  const visible = Math.max(
    320,
    Math.floor(Math.min(rect.width || window.innerWidth || 420, rect.height || window.innerWidth || 420))
  );
  const size = Math.max(360, Math.min(visible, Number(options.maxRenderSize) || 540));

  canvas.width = size;
  canvas.height = size;
  canvas.dataset.renderSize = String(size);

  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  if (!ctx) throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");

  return { ctx, size };
}

function latLonPoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function fallbackSurface(lat, lon) {
  const p = latLonPoint(lat, lon);
  const latitude = Math.abs(p.y);

  const continent =
    fbm3(p.x * 1.68 + 2.8, p.y * 1.68 - 4.2, p.z * 1.68 + 7.1, 5) * 0.56 +
    fbm3(p.x * 3.95 - 6.3, p.y * 3.95 + 1.8, p.z * 3.95 - 3.4, 4) * 0.25 +
    fbm3(p.x * 8.2 + 1.9, p.y * 8.2 - 2.6, p.z * 8.2 + 5.8, 3) * 0.08 +
    (1 - latitude * 0.35) * 0.11;

  const threshold = 0.675;
  const ice = latitude > 0.90 || (latitude > 0.78 && continent > 0.62);
  const land = !ice && continent > threshold;
  const shelf = !ice && !land && continent > threshold - 0.095;
  const water = !land && !ice;
  const coast = clamp01(1 - Math.abs(continent - threshold) / 0.06);
  const depth = water ? clamp01((threshold - continent) * 2.35 + 0.22) : 0;
  const relief = land ? clamp01((continent - threshold) * 2.4 + ridged3(p.x * 12, p.y * 12, p.z * 12, 4) * 0.30) : 0;
  const mineral = land ? clamp01(fbm3(p.x * 22 + 4, p.y * 22 - 7, p.z * 22 + 2, 3)) : 0;
  const turquoise = shelf ? clamp01(0.56 + coast * 0.32) : water ? clamp01((1 - depth) * 0.22) : coast * 0.16;

  return {
    ok: true,
    source: "fail-open-deterministic-realism",
    x: p.x,
    y: p.y,
    z: p.z,
    land,
    water,
    shelf,
    ice,
    ocean: water && !shelf,
    coastal: coast > 0.24,
    depth,
    elevation: relief,
    relief,
    mineral,
    turquoise,
    coast,
    className: ice ? "glacier_ice_snowpack_surface" : land ? "inland_terrain_land_surface" : shelf ? "shelf_water_surface" : "ocean_water_surface"
  };
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeRuntimeSample(sample, lat, lon, u, v) {
  if (!sample || typeof sample !== "object") return fallbackSurface(lat, lon);

  const p = latLonPoint(lat, lon);
  const className = String(sample.visualSurfaceClass || sample.surfaceClass || sample.className || sample.type || "");
  const ice = Boolean(sample.ice || sample.glacier || className.includes("ice") || className.includes("snow"));
  const water = Boolean(sample.water || sample.liquidWater || sample.ocean || sample.shelf || className.includes("water") || className.includes("ocean") || className.includes("shelf"));
  const land = Boolean(sample.land || sample.exposedTerrainLand || sample.visibleLand || className.includes("land") || className.includes("terrain")) && !water && !ice;
  const shelf = Boolean(sample.shelf || className.includes("shelf"));
  const coastal = Boolean(sample.coastal || sample.beach || shelf || safeNumber(sample.coastlineIndex, 0) > 0.12 || safeNumber(sample.coastalFeather, 0) > 0.12);
  const depth = water ? clamp01(safeNumber(sample.depth ?? sample.oceanDepth ?? sample.maxDepth ?? sample.routeSafeDepth, shelf ? 0.22 : 0.58)) : 0;
  const relief = land || ice ? clamp01(safeNumber(sample.terrainRelief ?? sample.terrainReliefIndex ?? sample.elevation ?? sample.maxElevation, ice ? 0.52 : 0.28)) : 0;
  const mineral = clamp01(safeNumber(sample.mineralIndex, land ? 0.42 : 0.08));
  const turquoise = clamp01(safeNumber(sample.turquoise ?? sample.turquoiseIndex ?? sample.visibleTurquoiseIndex, shelf ? 0.62 : water ? 0.18 : 0.08));
  const coast = clamp01(safeNumber(sample.coastlineIndex ?? sample.coastalFeather ?? sample.coastWaterMask, coastal ? 0.55 : 0));

  return {
    ok: true,
    source: "runtime-normalized-realism",
    x: p.x,
    y: p.y,
    z: p.z,
    lat,
    lon,
    u,
    v,
    land,
    water: water || (!land && !ice),
    shelf,
    ice,
    ocean: Boolean(sample.ocean) || (water && !shelf),
    coastal,
    depth,
    elevation: relief,
    relief,
    mineral,
    turquoise,
    coast,
    className: className || (ice ? "glacier_ice_snowpack_surface" : land ? "inland_terrain_land_surface" : shelf ? "shelf_water_surface" : "ocean_water_surface")
  };
}

function resolveRuntimeSampler(module) {
  const candidates = [
    module?.sampleAudraliaPlanetState,
    module?.sampleRuntimeState,
    module?.sampleAudraliaSurface,
    module?.sampleAudraliaRuntime,
    module?.sampleSurface,
    module?.buildRuntimeField,
    module?.default?.sampleAudraliaPlanetState,
    module?.default?.sampleRuntimeState,
    module?.default?.sampleAudraliaSurface,
    module?.default?.sampleSurface,
    module?.default?.buildRuntimeField
  ];

  return candidates.find((fn) => typeof fn === "function") || null;
}

function sampleRuntimeTexture(texture, u, v) {
  if (!texture || !texture.ready || !texture.data) return null;

  const x = wrap01(u) * (texture.width - 1);
  const y = clamp01(v) * (texture.height - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(texture.width - 1, x0 + 1);
  const y1 = Math.min(texture.height - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;

  function read(px, py) {
    const i = (py * texture.width + px) * 4;
    return [texture.data[i], texture.data[i + 1], texture.data[i + 2], texture.data[i + 3]];
  }

  const a = mixRgba(read(x0, y0), read(x1, y0), tx);
  const b = mixRgba(read(x0, y1), read(x1, y1), tx);
  return mixRgba(a, b, ty);
}

function surfaceToColor(surface) {
  if (surface.ice) {
    return mixRgba(rgba(196, 226, 238), rgba(255, 255, 255), clamp01(0.42 + surface.relief * 0.34));
  }

  if (surface.water) {
    const abyss = rgba(2, 11, 42);
    const deep = rgba(4, 37, 96);
    const blue = rgba(10, 91, 162);
    const shelf = rgba(42, 182, 199);
    const reef = rgba(99, 218, 207);
    let c = mixRgba(blue, deep, clamp01(surface.depth * 0.78));
    c = mixRgba(c, abyss, clamp01(surface.depth * surface.depth * 0.36));
    c = mixRgba(c, shelf, clamp01(surface.turquoise * 0.58));
    c = mixRgba(c, reef, clamp01(surface.turquoise * surface.coast * 0.32));
    return c;
  }

  const green = rgba(55, 116, 75);
  const ochre = rgba(155, 126, 75);
  const stone = rgba(151, 144, 113);
  const high = rgba(218, 206, 160);
  let c = mixRgba(green, ochre, clamp01(surface.mineral * 0.42 + surface.relief * 0.22));
  c = mixRgba(c, stone, clamp01(surface.relief * 0.30));
  c = mixRgba(c, high, clamp01(surface.relief * surface.mineral * 0.18));
  c = mixRgba(c, rgba(232, 211, 158), clamp01(surface.coast * 0.20));
  return c;
}

function runtimeSampleToTextureColor(sample) {
  const base = surfaceToColor(sample);
  const detail = fbm3(sample.x * 16 + 2, sample.y * 16 - 5, sample.z * 16 + 9, 3);
  const relief = sample.land || sample.ice ? sample.relief : sample.depth;
  const shade = clamp(0.92 + (detail - 0.5) * 0.10 + relief * 0.05, 0.78, 1.10);
  return rgba(base[0] * shade, base[1] * shade, base[2] * shade, 255);
}

function buildRuntimeTexture(state, sampler) {
  const width = 144;
  const height = 72;
  const data = new Uint8ClampedArray(width * height * 4);
  let row = 0;
  let water = 0;
  let land = 0;
  let ice = 0;
  let fallback = 0;

  state.runtimeTexture = { ready: false, width, height, data };

  function step() {
    if (state.stopped) return;

    const rowsPerStep = 4;
    const end = Math.min(height, row + rowsPerStep);

    for (; row < end; row += 1) {
      const v = (row + 0.5) / height;
      const lat = (0.5 - v) * Math.PI;

      for (let col = 0; col < width; col += 1) {
        const u = (col + 0.5) / width;
        const lon = (u - 0.5) * Math.PI * 2;
        let normalized;

        try {
          normalized = normalizeRuntimeSample(sampler({ lat, lon, u, v }), lat, lon, u, v);
        } catch (_) {
          normalized = fallbackSurface(lat, lon);
          fallback += 1;
        }

        if (normalized.water) water += 1;
        if (normalized.land) land += 1;
        if (normalized.ice) ice += 1;

        const c = runtimeSampleToTextureColor(normalized);
        const i = (row * width + col) * 4;
        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = 255;
      }
    }

    if (row < height) {
      window.requestAnimationFrame(step);
      return;
    }

    state.runtimeTexture.ready = true;
    state.runtimeBacked = true;
    state.runtimeTextureStats = {
      width,
      height,
      samples: width * height,
      waterRatio: water / Math.max(1, width * height),
      landRatio: land / Math.max(1, width * height),
      iceRatio: ice / Math.max(1, width * height),
      fallbackRatio: fallback / Math.max(1, width * height)
    };
    publishStatus(state);
  }

  window.requestAnimationFrame(step);
}

async function loadRuntime(state) {
  try {
    const module = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}&cache=${Date.now()}`);
    const sampler = resolveRuntimeSampler(module);

    state.runtimeLoaded = true;
    state.runtimeReceipt =
      module.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      module.AUDRALIA_RUNTIME_STATUS?.receipt ||
      module.default?.receipt ||
      "runtime-loaded";

    if (sampler) {
      state.runtimeSampler = sampler;
      buildRuntimeTexture(state, sampler);
    }
  } catch (error) {
    state.runtimeLoaded = false;
    state.runtimeError = error instanceof Error ? error.message : String(error);
  }

  publishStatus(state);
}

function drawStars(ctx, size, time) {
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 118; i += 1) {
    const x = fract(Math.sin(i * 917.17) * 10000) * size;
    const y = fract(Math.sin(i * 421.91) * 10000) * size;
    const pulse = 0.20 + 0.54 * Math.abs(Math.sin(time * 0.001 + i));
    ctx.globalAlpha = pulse;
    ctx.fillStyle = i % 7 === 0 ? "rgba(245,221,166,0.82)" : "rgba(185,216,255,0.68)";
    ctx.beginPath();
    ctx.arc(x, y, i % 13 === 0 ? 1.16 : 0.62, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function shadeSurfaceColor(colorValue, x, y, z, surface, edge) {
  const light = { x: -0.38, y: -0.31, z: 0.86 };
  const dot = clamp(x * light.x + (-y) * light.y + z * light.z, -1, 1);
  const macro = fbm3(x * 9 + 5, y * 9 - 3, z * 9 + 8, 4);
  const micro = fbm3(x * 38 - 11, y * 38 + 4, z * 38 - 7, 3);
  const relief = surface.land || surface.ice ? surface.relief : surface.depth;
  const atmosphereLift = surface.water ? surface.turquoise * 0.035 : surface.coast * 0.025;
  const shade = clamp(
    0.70 + dot * 0.30 - Math.pow(edge, 3.15) * 0.25 + (macro - 0.5) * 0.065 + (micro - 0.5) * 0.035 + relief * 0.035 + atmosphereLift,
    0.34,
    1.15
  );

  return rgba(colorValue[0] * shade, colorValue[1] * shade, colorValue[2] * shade, 255);
}

function drawGlobe(ctx, state, time) {
  const size = state.size;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const phase = wrap01(time * 0.000027 + 0.18);

  let waterPixels = 0;
  let solidPixels = 0;
  let turquoisePixels = 0;

  for (let py = 0; py < size; py += 1) {
    const yy = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const xx = (px + 0.5 - cx) / radius;
      const r2 = xx * xx + yy * yy;
      const out = (py * size + px) * 4;

      if (r2 > 1) continue;

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const lat = Math.asin(clamp(-yy, -1, 1));
      const lon = Math.atan2(xx, z) + (phase - 0.5) * Math.PI * 2;
      const u = wrap01(lon / (Math.PI * 2) + 0.5);
      const v = clamp01(0.5 - lat / Math.PI);

      const fallback = fallbackSurface(lat, lon);
      const runtimeColor = sampleRuntimeTexture(state.runtimeTexture, u, v);
      const base = runtimeColor ? mixRgba(surfaceToColor(fallback), runtimeColor, 0.72) : surfaceToColor(fallback);
      const finalColor = shadeSurfaceColor(base, fallback.x, fallback.y, fallback.z, fallback, Math.sqrt(r2));

      data[out] = finalColor[0];
      data[out + 1] = finalColor[1];
      data[out + 2] = finalColor[2];
      data[out + 3] = 255;

      if (finalColor[2] > finalColor[0] * 1.05 && finalColor[1] > finalColor[0] * 0.62) waterPixels += 1;
      if (finalColor[0] > 56 && finalColor[1] > 50 && !(finalColor[2] > finalColor[0] * 1.05 && finalColor[1] > finalColor[0] * 0.62)) solidPixels += 1;
      if (finalColor[1] > 130 && finalColor[2] > 130 && finalColor[0] < 90) turquoisePixels += 1;
    }
  }

  ctx.putImageData(image, 0, 0);

  const glow = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.40, radius * 0.02, cx, cy, radius * 1.20);
  glow.addColorStop(0, "rgba(255,255,255,0.15)");
  glow.addColorStop(0.30, "rgba(255,255,255,0.035)");
  glow.addColorStop(0.70, "rgba(0,0,0,0.12)");
  glow.addColorStop(1, "rgba(0,0,0,0.68)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.80, cx, cy, radius * 1.04);
  rim.addColorStop(0, "rgba(100,180,255,0)");
  rim.addColorStop(0.72, "rgba(100,190,255,0.08)");
  rim.addColorStop(1, "rgba(175,224,255,0.34)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(159,214,255,0.44)";
  ctx.lineWidth = Math.max(1, size * 0.008);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  state.lastPixelRatios = {
    waterPixelRatio: waterPixels / Math.max(1, Math.PI * radius * radius),
    solidSurfacePixelRatio: solidPixels / Math.max(1, Math.PI * radius * radius),
    turquoisePixelRatio: turquoisePixels / Math.max(1, Math.PI * radius * radius)
  };
}

function drawDiagnostics(ctx, state) {
  const size = state.size;
  ctx.fillStyle = "rgba(244,226,178,0.92)";
  ctx.font = "700 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.864);

  ctx.fillStyle = "rgba(174,204,225,0.72)";
  ctx.font = "500 " + Math.max(9, size * 0.014) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(state.runtimeTexture?.ready ? "RUNTIME-BACKED ORTHOGRAPHIC · REALISM V8" : "ORTHOGRAPHIC REALISM · SAFE FIRST PAINT", size / 2, size * 0.895);
}

function samplePixelProof(ctx, size) {
  try {
    const image = ctx.getImageData(Math.floor(size * 0.22), Math.floor(size * 0.22), Math.floor(size * 0.56), Math.floor(size * 0.56)).data;
    let opaque = 0;
    let water = 0;
    let solid = 0;
    let turquoise = 0;

    for (let i = 0; i < image.length; i += 16) {
      const r = image[i];
      const g = image[i + 1];
      const b = image[i + 2];
      const a = image[i + 3];

      if (a > 0) opaque += 1;
      if (b > r * 1.05 && g > r * 0.62) water += 1;
      if (r > 56 && g > 50 && !(b > r * 1.05 && g > r * 0.62)) solid += 1;
      if (g > 130 && b > 130 && r < 90) turquoise += 1;
    }

    const denominator = Math.max(1, image.length / 16);
    return {
      opaqueRatio: opaque / denominator,
      waterPixelRatio: water / denominator,
      solidSurfacePixelRatio: solid / denominator,
      turquoisePixelRatio: turquoise / denominator,
      notBlank: opaque > 50
    };
  } catch (error) {
    return { notBlank: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function publishStatus(state) {
  Object.assign(STATUS, {
    loaded: true,
    runtimeBacked: Boolean(state.runtimeBacked || state.runtimeTexture?.ready),
    runtimeTextureReady: Boolean(state.runtimeTexture?.ready),
    runtimeLoaded: Boolean(state.runtimeLoaded),
    runtimeReceipt: state.runtimeReceipt || "",
    runtimeError: state.runtimeError || "",
    animated: !state.stopped,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof,
    runtimeTextureStats: state.runtimeTextureStats || null,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    lastPixelRatios: state.lastPixelRatios || null
  });

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
    window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.audraliaCanvasRuntimeBacked = String(Boolean(STATUS.runtimeBacked));
    document.documentElement.dataset.audraliaCanvasRuntimeTextureReady = String(Boolean(STATUS.runtimeTextureReady));
    document.documentElement.dataset.audraliaCanvasFirstPaintForced = "true";
    document.documentElement.dataset.audraliaCanvasFailOpenRenderer = "true";
    document.documentElement.dataset.audraliaCanvasOrthographicProjection = "true";
    document.documentElement.dataset.audraliaCanvasStripProjectionRemoved = "true";
    document.documentElement.dataset.audraliaCanvasInteractionFreezeGuard = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (state.canvas) {
    state.canvas.dataset.audraliaCanvasStatus = CONTRACT;
    state.canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    state.canvas.dataset.audraliaRuntimeBacked = String(Boolean(STATUS.runtimeBacked));
    state.canvas.dataset.audraliaFailOpenFirstPaint = "true";
    state.canvas.dataset.audraliaOrthographicProjection = "true";
    state.canvas.dataset.audraliaInteractionFreezeGuard = "true";
  }

  try {
    window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: STATUS }));
  } catch (_) {}
}

function renderFrame(state, time) {
  if (!state.ctx || !state.size) return;

  drawStars(state.ctx, state.size, time);
  drawGlobe(state.ctx, state, time);
  drawDiagnostics(state.ctx, state);

  state.frameCount += 1;

  if (state.frameCount === 1 || state.frameCount % 24 === 0) {
    state.pixelProof = samplePixelProof(state.ctx, state.size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") activeController.stop();
  activeController = null;
}

function startCanvas(target, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const state = {
    mount,
    shell: null,
    frame: null,
    canvas: null,
    proof: null,
    ctx: null,
    size: 0,
    frameCount: 0,
    frameCap: clamp(Number(options.frameCap) || 10, 8, 16),
    lastFrameTime: 0,
    pauseUntil: 0,
    pixelProof: null,
    lastPixelRatios: null,
    stopped: false,
    rafId: null,
    resizeTimer: null,
    runtimeLoaded: false,
    runtimeBacked: false,
    runtimeSampler: null,
    runtimeTexture: null,
    runtimeTextureStats: null,
    runtimeReceipt: "",
    runtimeError: ""
  };

  const nodes = createNodes(mount, state);
  const setup = setupCanvas(nodes.canvas, nodes.frame, options);

  state.shell = nodes.shell;
  state.frame = nodes.frame;
  state.canvas = nodes.canvas;
  state.proof = nodes.proof;
  state.ctx = setup.ctx;
  state.size = setup.size;

  function animate(time) {
    if (state.stopped) return;

    const gap = 1000 / state.frameCap;
    const paused = time < state.pauseUntil;

    if (!document.hidden && !paused && time - state.lastFrameTime >= gap) {
      state.lastFrameTime = time;
      renderFrame(state, time);
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame, options);
      state.ctx = next.ctx;
      state.size = next.size;
      state.frameCount = 0;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 180);
  }

  function selectionPause() {
    const selection = document.getSelection ? document.getSelection() : null;
    if (selection && !selection.isCollapsed) state.pauseUntil = performance.now() + 900;
  }

  state.stop = function () {
    state.stopped = true;
    if (state.rafId) window.cancelAnimationFrame(state.rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("selectionchange", selectionPause);
  };

  activeController = state;

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("selectionchange", selectionPause, { passive: true });

  setRouteStatus("Audralia adopted canvas authority loaded.");
  renderFrame(state, performance.now());
  publishStatus(state);
  animate(performance.now());
  loadRuntime(state);

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options);
}

export function renderAudralia(target, options) {
  return startCanvas(target, options);
}

export function mountAudralia(target, options) {
  return startCanvas(target, options);
}

export function render(target, options) {
  return startCanvas(target, options);
}

export function mount(target, options) {
  return startCanvas(target, options);
}

export function init(target, options) {
  return startCanvas(target, options);
}

export function getAudraliaCanvasStatus() {
  return STATUS;
}

export function getAudraliaSurfaceDataset() {
  return Object.freeze({
    name: "Audralia",
    receipt: RECEIPT,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    retiredContract: RETIRED_CONTRACT,
    version: VERSION,
    runtimePath: RUNTIME_PATH,
    runtimeBacked: STATUS.runtimeBacked,
    runtimeTextureReady: STATUS.runtimeTextureReady,
    firstPaintForced: true,
    failOpenRenderer: true,
    interactionFreezeGuard: true,
    stripProjectionRemoved: true,
    orthographicProjectionActive: true,
    realismStage: "runtime-backed-orthographic-realism",
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function stopAudraliaCanvas() {
  stopActiveController();
  return { stopped: true, receipt: RECEIPT, contract: CONTRACT, previousContract: PREVIOUS_CONTRACT, version: VERSION };
}

const api = {
  RECEIPT,
  CONTRACT,
  PREVIOUS_CONTRACT,
  RETIRED_CONTRACT,
  VERSION,
  RUNTIME_PATH,
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
  window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
  window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
}

export default api;
