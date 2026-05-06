// assets/audralia/audralia.canvas.js
// AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2
// Active renewal: AUDRALIA_CANVAS_IMPORT_SAFE_ANIMATED_MAP_RECOVERY_TNT_v1
// Role: import-safe adopted canvas authority for Audralia. Owns canvas creation,
// runtime sampling, visible animation, terrain definition, coastline contrast,
// water motion, and proof datasets. Does not mutate runtime, topology, terrain,
// hydration, oceans, route shell, Gauges, or Earth. No GraphicBox. No image generation.

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2";
const ACTIVE_RENEWAL = "AUDRALIA_CANVAS_IMPORT_SAFE_ANIMATED_MAP_RECOVERY_TNT_v1";
const ROUTE_RECEIPT = "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1";
const ROUTE_RENEWAL = "AUDRALIA_ROUTE_ADOPTED_CANVAS_DOORWAY_TNT_v2";
const RUNTIME_AUTHORITY = "/assets/audralia/audralia.runtime.js";
const RUNTIME_IMPORT_URL = "/assets/audralia/audralia.runtime.js?v=AUDRALIA_RUNTIME_ORGANIC_OCEAN_PLACEMENT_CONTRACT_v1";
const HEX_AUTHORITY = "/assets/audralia/audralia.hex.surface.js";
const BODY = "audralia";
const ROUTE = "/showroom/globe/audralia/";

const CFG = Object.freeze({
  canvasSize: 640,
  textureWidth: 384,
  textureHeight: 192,
  radiusRatio: 0.405,
  phase: 0.18084,
  velocity: 0.00055,
  frameIntervalMs: 105
});

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function noise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return mix(
    mix(hash2(ix, iy, seed), hash2(ix + 1, iy, seed), ux),
    mix(hash2(ix, iy + 1, seed), hash2(ix + 1, iy + 1, seed), ux),
    uy
  );
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    total += noise(x * freq, y * freq, seed + i * 29.37) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return total / Math.max(0.000001, norm);
}

function colorMix(a, b, t) {
  return [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t)),
    255
  ];
}

function light(color, amount) {
  return [
    clamp(Math.round(color[0] * amount), 0, 255),
    clamp(Math.round(color[1] * amount), 0, 255),
    clamp(Math.round(color[2] * amount), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function num(sample, keys, fallback = 0) {
  if (!sample || typeof sample !== "object") return fallback;
  for (const key of keys) {
    const value = Number(sample[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

function cls(sample) {
  const text = [sample && sample.visualSurfaceClass, sample && sample.surfaceClass, sample && sample.waterClass].join(" ");
  const ice = Boolean(sample && (sample.isIce || sample.isGlacier || sample.isSnowpack || text.includes("ice") || text.includes("glacier") || text.includes("snowpack")));
  const land = Boolean(sample && (sample.visibleTerrainLand || sample.landVisibleToRoute || sample.isLand || sample.land || sample.isAboveWaterLandFootprint));
  const solid = Boolean(sample && (sample.solidSurfaceLand || sample.solidSurface || sample.topologyLandFootprint || land || ice));
  const shelf = Boolean(sample && (sample.isShelfWater || sample.isCoastalWater || Number(sample.shelfWaterIndex) > 0.3 || Number(sample.coastalTurquoiseIndex) > 0.34 || sample.waterClass === "shelf_water" || sample.waterClass === "coastal_water" || text.includes("shelf")) && !land && !ice);
  const water = Boolean(sample && (sample.isOceanWater || sample.isWater || sample.waterVisibleToRoute || sample.waterClass === "ocean_water" || sample.waterClass === "shelf_water" || sample.waterClass === "coastal_water" || sample.waterClass === "terrain_moisture" || shelf) && !land && !ice);
  return { ice, land, solid, shelf, water };
}

function runtimeApi(module) {
  return module && module.default && typeof module.default === "object" ? module.default : module;
}

function createRuntime(api) {
  if (api && typeof api.createAudraliaRuntime === "function") {
    return api.createAudraliaRuntime({ fieldWidth: 384, fieldHeight: 192 });
  }
  return api;
}

function statusOf(runtime, api) {
  try {
    if (runtime && typeof runtime.getStatus === "function") return runtime.getStatus();
    if (api && typeof api.getStatus === "function") return api.getStatus();
  } catch (error) {
    return { ok: false, error: String(error && error.message ? error.message : error) };
  }
  return { ok: true, receipt: "AUDRALIA_RUNTIME_STATUS_METHOD_ABSENT_IMPORT_OK" };
}

function statsOf(runtime, api) {
  try {
    if (runtime && typeof runtime.getRuntimeStats === "function") return runtime.getRuntimeStats();
    if (runtime && typeof runtime.getStats === "function") return runtime.getStats();
    if (api && typeof api.getRuntimeStats === "function") return api.getRuntimeStats();
    if (api && typeof api.getStats === "function") return api.getStats();
  } catch (error) {
    return { error: String(error && error.message ? error.message : error) };
  }
  return {};
}

function sampleRuntime(runtime, api, u, v) {
  const input = { u: wrap01(u), v: clamp(v, 0, 1), x: wrap01(u), y: clamp(v, 0, 1) };
  try {
    if (runtime && typeof runtime.sampleRuntimeState === "function") return runtime.sampleRuntimeState(input);
    if (runtime && typeof runtime.sampleAudraliaPlanetState === "function") return runtime.sampleAudraliaPlanetState(input);
    if (runtime && typeof runtime.sampleSurface === "function") return runtime.sampleSurface(input);
    if (api && typeof api.sampleRuntimeState === "function") return api.sampleRuntimeState(input);
    if (api && typeof api.sampleAudraliaPlanetState === "function") return api.sampleAudraliaPlanetState(input);
    if (api && typeof api.sampleSurface === "function") return api.sampleSurface(input);
  } catch (error) {
    return { routeSampleError: true, routeSampleErrorMessage: String(error && error.message ? error.message : error) };
  }
  return { routeSampleError: true, routeSampleErrorMessage: "AUDRALIA_RUNTIME_SAMPLE_UNAVAILABLE" };
}

function neighbor(runtime, api, u, v, du, dv) {
  return cls(sampleRuntime(runtime, api, wrap01(u + du), clamp(v + dv, 0, 1)));
}

function coast(runtime, api, sample, u, v) {
  const c = cls(sample);
  if (!c.land && !c.water && !c.solid) return 0;
  const du = 1 / CFG.textureWidth;
  const dv = 1 / CFG.textureHeight;
  const list = [neighbor(runtime, api, u, v, du, 0), neighbor(runtime, api, u, v, -du, 0), neighbor(runtime, api, u, v, 0, dv), neighbor(runtime, api, u, v, 0, -dv)];
  let opposite = 0;
  for (const n of list) {
    if ((c.land || c.solid) && n.water) opposite += 1;
    if (c.water && (n.land || n.solid)) opposite += 1;
  }
  return clamp(opposite / 4, 0, 1);
}

function landColor(sample, u, v, coastPressure) {
  const elevation = clamp(num(sample, ["normalizedElevation", "elevation", "maxElevation"], 0.3), 0, 1);
  const ridge = clamp(num(sample, ["ridgePressure", "mountainPressure", "terrainPressureHandoff"], 0.26), 0, 1);
  const mineral = clamp(num(sample, ["mineralReliefIndex", "exposedMineralHardnessIndex", "diamondGraniteSlateReliefIndex"], 0.34), 0, 1);
  const basin = clamp(num(sample, ["basinPressure", "ancientWeatheringIndex", "erosionMemoryIndex"], 0.24), 0, 1);
  const grain = fbm(u * 54, v * 38, 5101, 4);
  const veins = fbm(u * 112 + 4.1, v * 90 - 2.3, 6101, 3);
  let color = colorMix([130, 104, 72, 255], [162, 132, 88, 255], clamp(elevation * 0.84 + basin * 0.12, 0, 1));
  color = colorMix(color, [194, 166, 116, 255], clamp(elevation * 0.3, 0, 0.48));
  color = colorMix(color, [112, 108, 102, 255], clamp(mineral * ridge * 0.24, 0, 0.32));
  if (coastPressure > 0.03 || sample && sample.isBeach) color = colorMix(color, [204, 184, 130, 255], clamp(0.18 + coastPressure * 0.44, 0.16, 0.54));
  color = colorMix(color, [46, 172, 204, 255], 0.1);
  return light(color, clamp(0.94 + (grain - 0.5) * 0.13 + (veins > 0.66 ? 0.04 : 0) + ridge * 0.05 - basin * 0.025, 0.84, 1.16));
}

function iceColor(sample, u, v) {
  const relief = clamp(num(sample, ["glacierSeatPressure", "snowpackPressure", "ridgePressure"], 0.5), 0, 1);
  const grain = fbm(u * 28, v * 22, 8101, 3);
  let color = colorMix([206, 226, 232, 255], [246, 252, 254, 255], clamp(0.36 + relief * 0.32, 0, 1));
  color = colorMix(color, [110, 199, 224, 255], 0.035);
  return light(color, clamp(0.96 + (grain - 0.5) * 0.05, 0.9, 1.08));
}

function waterColor(sample, u, v, coastPressure, phase) {
  const shelf = clamp(num(sample, ["coastalTurquoiseIndex", "shelfWaterIndex", "coastalShelfBlueIndex", "shelfDepthIndex"], 0), 0, 1);
  const depth = clamp(num(sample, ["oceanDepthIndex", "visibleWaterDepthIndex", "bathymetryHydrationIndex", "basinDepthIndex", "maxDepth"], 0.28), 0, 1);
  const softDeep = clamp(num(sample, ["deepOceanBlendIndex", "deepOceanFeatherIndex", "organicDeepOceanPresenceIndex"], 0), 0, 1);
  const hydration = clamp(num(sample, ["surfaceWaterIndex", "hydrationActivationIndex", "hydrationConductionIndex"], 0.58), 0, 1);
  let color = colorMix([42, 148, 198, 255], [36, 136, 194, 255], clamp(depth * 0.22, 0, 0.28));
  color = colorMix(color, [30, 126, 188, 255], clamp(softDeep * 0.06, 0, 0.08));
  color = colorMix(color, [58, 206, 211, 255], clamp(shelf * 0.56 + coastPressure * 0.18, 0, 0.68));
  color = colorMix(color, [102, 225, 216, 255], clamp(Math.max(0, shelf - 0.58) * 0.24, 0, 0.24));
  if (coastPressure > 0.3) color = colorMix(color, [154, 235, 224, 255], clamp((coastPressure - 0.3) * 0.18, 0, 0.14));
  const shimmer = fbm(u * 62 + phase * 220, v * 38 - phase * 130, 9103, 3);
  const ripple = fbm(u * 76, v * 44, 7109, 3);
  const liftAmount = (ripple - 0.5) * 0.035 + (shimmer - 0.5) * 0.028 + clamp((hydration - 0.45) * 0.035, -0.012, 0.03);
  return light(color, clamp(1 + liftAmount, 0.92, 1.1));
}

function surfaceColor(sample, runtime, api, u, v, phase) {
  if (!sample || sample.routeSampleError) return [48, 132, 176, 255];
  const c = cls(sample);
  const cp = coast(runtime, api, sample, u, v);
  if (c.ice) return iceColor(sample, u, v);
  if (c.land) return landColor(sample, u, v, cp);
  if (c.water) return waterColor(sample, u, v, cp, phase);
  if (c.solid) return landColor(sample, u, v, cp);
  return waterColor(sample, u, v, cp, phase);
}

function buildTexture(runtime, api, phase) {
  const width = CFG.textureWidth;
  const height = CFG.textureHeight;
  const data = new Uint8ClampedArray(width * height * 4);
  const counters = { textureWidth: width, textureHeight: height, runtimeSamples: 0, solidSurfaceSamples: 0, landSamples: 0, waterSamples: 0, iceSamples: 0, shelfSamples: 0, coastSamples: 0, terrainDefinitionSamples: 0, fallbackSamples: 0, maxTurquoise: 0, maxElevation: 0 };

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const u = x / Math.max(1, width - 1);
      const sample = sampleRuntime(runtime, api, u, v);
      const c = cls(sample);
      const color = surfaceColor(sample, runtime, api, u, v, phase);
      const index = (y * width + x) * 4;
      data[index] = color[0]; data[index + 1] = color[1]; data[index + 2] = color[2]; data[index + 3] = color[3];
      counters.runtimeSamples += 1;
      if (sample && sample.routeSampleError) counters.fallbackSamples += 1;
      if (c.solid) counters.solidSurfaceSamples += 1;
      if (c.land) counters.landSamples += 1;
      if (c.water) counters.waterSamples += 1;
      if (c.ice) counters.iceSamples += 1;
      if (c.shelf) counters.shelfSamples += 1;
      const relief = Math.max(num(sample, ["terrainReliefIndex", "terrainRelief", "ridgePressure", "mountainPressure"], 0), num(sample, ["normalizedElevation", "elevation"], 0));
      if (relief > 0.08) counters.terrainDefinitionSamples += 1;
      counters.maxTurquoise = Math.max(counters.maxTurquoise, num(sample, ["coastalTurquoiseIndex", "shelfWaterIndex"], 0));
      counters.maxElevation = Math.max(counters.maxElevation, num(sample, ["maxElevation", "normalizedElevation", "elevation"], 0));
    }
  }

  counters.solidSurfaceRatio = counters.solidSurfaceSamples / Math.max(1, counters.runtimeSamples);
  counters.landRatio = counters.landSamples / Math.max(1, counters.runtimeSamples);
  counters.waterRatio = counters.waterSamples / Math.max(1, counters.runtimeSamples);
  counters.iceRatio = counters.iceSamples / Math.max(1, counters.runtimeSamples);
  counters.terrainDefinitionRatio = counters.terrainDefinitionSamples / Math.max(1, counters.runtimeSamples);
  counters.fallbackRatio = counters.fallbackSamples / Math.max(1, counters.runtimeSamples);
  return { width, height, data, counters };
}

function sampleTexture(texture, u, v) {
  const tx = Math.floor(wrap01(u) * (texture.width - 1));
  const ty = Math.floor(clamp(v, 0, 1) * (texture.height - 1));
  const i = (ty * texture.width + tx) * 4;
  return [texture.data[i] || 0, texture.data[i + 1] || 0, texture.data[i + 2] || 0, texture.data[i + 3] === undefined ? 255 : texture.data[i + 3]];
}

function drawAtmosphere(ctx, size, radius) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  const h = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.36, radius * 0.02, cx, cy, radius * 1.18);
  h.addColorStop(0, "rgba(255,255,255,0.15)"); h.addColorStop(0.32, "rgba(255,255,255,0.04)"); h.addColorStop(0.78, "rgba(0,0,0,0.08)"); h.addColorStop(1, "rgba(0,0,0,0.30)");
  ctx.fillStyle = h; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  const rim = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius);
  rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(0.82, "rgba(8,23,44,0.10)"); rim.addColorStop(1, "rgba(4,10,20,0.36)");
  ctx.fillStyle = rim; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2); ctx.strokeStyle = "rgba(190,226,255,0.28)"; ctx.lineWidth = Math.max(1, size * 0.003); ctx.stroke(); ctx.restore();
}

function drawFrame(canvas, texture, phase) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const cx = size / 2, cy = size / 2, radius = size * CFG.radiusRatio;
  const lightX = -0.42, lightY = 0.36, lightZ = 0.83;
  let opaqueSamples = 0;

  for (let py = 0; py < size; py += 1) {
    const y = (py + 0.5 - cy) / radius;
    for (let px = 0; px < size; px += 1) {
      const x = (px + 0.5 - cx) / radius;
      const r2 = x * x + y * y;
      const out = (py * size + px) * 4;
      if (r2 > 1) { data[out] = 0; data[out + 1] = 0; data[out + 2] = 0; data[out + 3] = 0; continue; }
      const z = Math.sqrt(Math.max(0, 1 - r2));
      const u = wrap01(phase + Math.atan2(x, z) / (Math.PI * 2));
      const v = clamp(0.5 - Math.asin(clamp(-y, -1, 1)) / Math.PI, 0, 1);
      const color = sampleTexture(texture, u, v);
      const dot = clamp(x * lightX + (-y) * lightY + z * lightZ, -1, 1);
      const shade = clamp((1 - Math.pow(r2, 1.85) * 0.24) * (0.82 + dot * 0.22), 0.68, 1.1);
      data[out] = clamp(Math.round(color[0] * shade), 0, 255);
      data[out + 1] = clamp(Math.round(color[1] * shade), 0, 255);
      data[out + 2] = clamp(Math.round(color[2] * shade), 0, 255);
      data[out + 3] = color[3];
      opaqueSamples += 1;
    }
  }

  ctx.putImageData(image, 0, 0);
  drawAtmosphere(ctx, size, radius);
  return { opaqueSamples };
}

function createCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  canvas.className = "audralia-true-globe-canvas audralia-adopted-canvas audralia-animated-terrain-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Audralia animated terrain-definition globe rendered by adopted canvas authority");
  canvas.style.display = "block"; canvas.style.width = "100%"; canvas.style.maxWidth = `${size}px`; canvas.style.aspectRatio = "1 / 1"; canvas.style.borderRadius = "50%"; canvas.style.background = "transparent";
  return canvas;
}

function createLabel() {
  const label = document.createElement("div");
  label.className = "audralia-globe-label";
  label.textContent = "AUDRALIA · ANIMATED MAP";
  label.dataset.labelText = "AUDRALIA · ANIMATED MAP";
  return label;
}

function createReceipt(result) {
  const receipt = document.createElement("div");
  receipt.hidden = true; receipt.setAttribute("aria-hidden", "true"); receipt.className = "audralia-canvas-receipt";
  receipt.dataset.body = BODY; receipt.dataset.route = ROUTE; receipt.dataset.receipt = RECEIPT; receipt.dataset.activeRenewal = ACTIVE_RENEWAL; receipt.dataset.routeReceipt = ROUTE_RECEIPT; receipt.dataset.routeRenewal = ROUTE_RENEWAL; receipt.dataset.runtimeAuthority = RUNTIME_AUTHORITY; receipt.dataset.hexAuthority = HEX_AUTHORITY; receipt.dataset.runtimeVersion = result.runtimeVersion || ""; receipt.dataset.animationActive = String(Boolean(result.animationActive)); receipt.dataset.terrainDefinitionActive = "true"; receipt.dataset.visualPassClaimed = "false";
  receipt.textContent = "AUDRALIA_CANVAS=IMPORT_SAFE_ANIMATED_MAP · ROUTE=DOORWAY_ONLY · RUNTIME=SOURCE_TRUTH · HEX=HELD_UNTIL_IMPORT_STABLE · VISUAL_PASS=HELD";
  return receipt;
}

function findMount(mount) {
  if (typeof mount === "string") return document.querySelector(mount);
  if (mount && mount.nodeType === 1) return mount;
  return document.getElementById("audraliaRenderMount") || document.getElementById("audreliaRenderMount") || document.querySelector("[data-audralia-render-mount]") || document.querySelector("[data-audrelia-render-mount]") || document.querySelector("[data-body='audralia'][data-render-mount]") || document.querySelector("[data-body='audrelia'][data-render-mount]");
}

function writeDataset(target, result) {
  if (!target) return;
  const tc = result.textureCounters || {}, rs = result.runtimeStats || {}, c = result.counters || {};
  target.dataset.audraliaRenderMount = "true";
  target.dataset.renderMount = "true";
  target.dataset.body = BODY;
  target.dataset.route = ROUTE;
  target.dataset.contract = ROUTE_RECEIPT;
  target.dataset.activeRenewal = ROUTE_RENEWAL;
  target.dataset.canvasAuthority = "assets/audralia/audralia.canvas.js";
  target.dataset.canvasAuthorityReceipt = RECEIPT;
  target.dataset.canvasActiveRenewal = ACTIVE_RENEWAL;
  target.dataset.runtimeAuthority = RUNTIME_AUTHORITY;
  target.dataset.runtimeVersion = result.runtimeVersion || "";
  target.dataset.runtimeActiveRenewal = result.runtimeActiveRenewal || "";
  target.dataset.runtimeAuthorityLoaded = String(Boolean(result.runtimeLoaded));
  target.dataset.runtimeInstanceLoaded = String(Boolean(result.runtimeInstanceLoaded));
  target.dataset.hexAuthority = HEX_AUTHORITY;
  target.dataset.hexRendererUsed = "false";
  target.dataset.hexHeldUntilImportStable = "true";
  target.dataset.compositorModel = "adopted-column-import-safe-animated-canvas-authority";
  target.dataset.activeSurfaceRenderer = "import-safe-runtime-texture-orthographic-painter";
  target.dataset.rotationModel = "animated-true-orthographic-front-hemisphere";
  target.dataset.animationActive = String(Boolean(result.animationActive));
  target.dataset.frameCount = String(c.frameCount || 0);
  target.dataset.phase = String(result.phase || CFG.phase);
  target.dataset.velocity = String(result.velocity || CFG.velocity);
  target.dataset.terrainDefinitionActive = "true";
  target.dataset.coastlineDefinitionActive = "true";
  target.dataset.waterMotionActive = "true";
  target.dataset.runtimeSamples = String(tc.runtimeSamples || 0);
  target.dataset.solidSurfaceSamples = String(tc.solidSurfaceSamples || 0);
  target.dataset.landSamples = String(tc.landSamples || 0);
  target.dataset.waterSamples = String(tc.waterSamples || 0);
  target.dataset.iceSamples = String(tc.iceSamples || 0);
  target.dataset.terrainDefinitionSamples = String(tc.terrainDefinitionSamples || 0);
  target.dataset.fallbackSamples = String(tc.fallbackSamples || 0);
  target.dataset.solidSurfaceRatio = String(tc.solidSurfaceRatio || "");
  target.dataset.waterRatio = String(tc.waterRatio || "");
  target.dataset.terrainDefinitionRatio = String(tc.terrainDefinitionRatio || "");
  target.dataset.fallbackRatio = String(tc.fallbackRatio || "");
  target.dataset.runtimeSolidSurfaceLandRatio = String(rs.solidSurfaceLandRatio || tc.solidSurfaceRatio || "");
  target.dataset.runtimeLiquidWaterRatio = String(rs.liquidWaterRatio || tc.waterRatio || "");
  target.dataset.routeOwnedLandGeneration = "forbidden";
  target.dataset.routeOwnedWaterGeneration = "forbidden";
  target.dataset.canvasOwnedLandGeneration = "false";
  target.dataset.canvasOwnedWaterGeneration = "false";
  target.dataset.topologyRewrittenHere = "false";
  target.dataset.terrainRewrittenHere = "false";
  target.dataset.hydrationRewrittenHere = "false";
  target.dataset.oceansRewrittenHere = "false";
  target.dataset.runtimeRewrittenHere = "false";
  target.dataset.graphicBox = "false";
  target.dataset.imageGeneration = "false";
  target.dataset.visualPassClaimed = "false";
  target.dataset.renderMode = "audralia-import-safe-animated-terrain-map";
}

function expose(result) {
  const status = Object.freeze({
    ok: Boolean(result.ok), receipt: RECEIPT, activeRenewal: ACTIVE_RENEWAL, routeReceipt: ROUTE_RECEIPT, routeRenewal: ROUTE_RENEWAL, body: BODY, route: ROUTE, canvasAuthority: "assets/audralia/audralia.canvas.js", runtimeAuthority: RUNTIME_AUTHORITY, hexAuthority: HEX_AUTHORITY,
    runtimeVersion: result.runtimeVersion || "", runtimeActiveRenewal: result.runtimeActiveRenewal || "", runtimeLoaded: Boolean(result.runtimeLoaded), runtimeInstanceLoaded: Boolean(result.runtimeInstanceLoaded), hexRendererUsed: false, hexHeldUntilImportStable: true, canvasRendered: Boolean(result.canvasRendered), animationActive: Boolean(result.animationActive), terrainDefinitionActive: true, coastlineDefinitionActive: true, waterMotionActive: true, phase: result.phase || CFG.phase, velocity: result.velocity || CFG.velocity, routeOwnedLandGeneration: false, routeOwnedWaterGeneration: false, canvasOwnedLandGeneration: false, canvasOwnedWaterGeneration: false, graphicBox: false, imageGeneration: false, visualPassClaimed: false, counters: result.counters || null, textureCounters: result.textureCounters || null, runtimeStats: result.runtimeStats || null, error: result.error || ""
  });
  if (typeof window !== "undefined") {
    window.DGBAudraliaCanvasStatus = status;
    window.AudraliaCanvasStatus = status;
    window.audraliaCanvasStatus = status;
    window.dispatchEvent(new CustomEvent("dgb:audralia-canvas-status", { detail: status }));
  }
  return status;
}

function fallbackTexture() {
  const width = CFG.textureWidth, height = CFG.textureHeight, data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const u = x / Math.max(1, width - 1);
      const band = Math.sin((v * 5.8 + fbm(u * 4, v * 3, 10, 3)) * Math.PI);
      const land = band > 0.5 && fbm(u * 9, v * 7, 20, 3) > 0.46;
      const shelf = Math.abs(band - 0.5) < 0.2;
      const color = land ? colorMix([150, 122, 84, 255], [204, 184, 130, 255], fbm(u * 20, v * 15, 31, 3) * 0.35) : shelf ? [66, 199, 209, 255] : [38, 142, 198, 255];
      const i = (y * width + x) * 4; data[i] = color[0]; data[i + 1] = color[1]; data[i + 2] = color[2]; data[i + 3] = 255;
    }
  }
  return { width, height, data, counters: { textureWidth: width, textureHeight: height, runtimeSamples: 0, fallbackSamples: width * height, fallbackRatio: 1 } };
}

function failureCanvas(mount, message) {
  const canvas = createCanvas(CFG.canvasSize), label = createLabel(), texture = fallbackTexture();
  drawFrame(canvas, texture, CFG.phase);
  const result = { ok: false, runtimeLoaded: false, runtimeInstanceLoaded: false, canvasRendered: true, animationActive: false, runtimeVersion: "", runtimeActiveRenewal: "", runtimeStats: {}, textureCounters: texture.counters, counters: { frameCount: 1 }, phase: CFG.phase, velocity: 0, error: message };
  if (mount) { mount.replaceChildren(); mount.appendChild(canvas); mount.appendChild(label); mount.appendChild(createReceipt(result)); writeDataset(mount, result); }
  writeDataset(canvas, result);
  return expose(result);
}

function startAnimation({ canvas, texture, mount, label, baseResult }) {
  let running = true, rafId = 0, lastDrawAt = 0, phase = CFG.phase;
  const counters = { frameCount: 0, lastFrameTime: 0, lastDrawDurationMs: 0, lastOpaqueSamples: 0 };
  function loop(timestamp) {
    if (!running) return;
    if (!lastDrawAt || timestamp - lastDrawAt >= CFG.frameIntervalMs) {
      const start = performance.now();
      phase = wrap01(phase + CFG.velocity * Math.max(1, (timestamp - (lastDrawAt || timestamp)) / 16.667));
      const frame = drawFrame(canvas, texture, phase);
      counters.frameCount += 1; counters.lastFrameTime = timestamp; counters.lastDrawDurationMs = performance.now() - start; counters.lastOpaqueSamples = frame.opaqueSamples; lastDrawAt = timestamp;
      const live = Object.assign({}, baseResult, { ok: true, canvasRendered: true, animationActive: true, phase, velocity: CFG.velocity, lastFrameTime: timestamp, counters });
      writeDataset(mount, live); writeDataset(canvas, live); expose(live);
      if (label) { label.dataset.frameCount = String(counters.frameCount); label.dataset.phase = phase.toFixed(5); }
    }
    rafId = window.requestAnimationFrame(loop);
  }
  rafId = window.requestAnimationFrame(loop);
  return Object.freeze({ stop() { running = false; if (rafId) window.cancelAnimationFrame(rafId); }, getState() { return Object.freeze({ running, phase, velocity: CFG.velocity, frameCount: counters.frameCount, lastFrameTime: counters.lastFrameTime, lastDrawDurationMs: counters.lastDrawDurationMs }); } });
}

async function renderAudraliaCanvas(mountInput, options = {}) {
  const mount = findMount(mountInput);
  if (!mount) return expose({ ok: false, runtimeLoaded: false, runtimeInstanceLoaded: false, canvasRendered: false, animationActive: false, error: "AUDRALIA_CANVAS_MOUNT_NOT_FOUND" });

  let module;
  try { module = await import(RUNTIME_IMPORT_URL); }
  catch (error) { return failureCanvas(mount, `Audralia runtime module import failed: ${String(error && error.message ? error.message : error)}`); }

  const api = runtimeApi(module);
  const runtime = createRuntime(api);
  const runtimeStatus = statusOf(runtime, api);
  const runtimeStats = statsOf(runtime, api);
  if (!runtime || runtimeStatus.ok === false) return failureCanvas(mount, "Audralia runtime did not expose a usable runtime instance.");

  const canvas = createCanvas(Number(options.canvasSize) || CFG.canvasSize);
  const label = createLabel();
  const texture = buildTexture(runtime, api, CFG.phase);
  const baseResult = { ok: true, runtimeLoaded: true, runtimeInstanceLoaded: true, canvasRendered: true, animationActive: true, runtimeVersion: runtimeStatus && runtimeStatus.receipt ? runtimeStatus.receipt : "", runtimeActiveRenewal: runtimeStatus && runtimeStatus.activeRenewal ? runtimeStatus.activeRenewal : "", runtimeStats, textureCounters: texture.counters, counters: { frameCount: 0, lastFrameTime: 0, lastDrawDurationMs: 0, lastOpaqueSamples: 0 }, phase: CFG.phase, velocity: CFG.velocity, error: "" };

  mount.replaceChildren(); mount.appendChild(canvas); mount.appendChild(label); mount.appendChild(createReceipt(baseResult));
  writeDataset(mount, baseResult); writeDataset(canvas, baseResult); expose(baseResult);

  if (typeof window !== "undefined" && window.DGBAudraliaCanvasAnimation && typeof window.DGBAudraliaCanvasAnimation.stop === "function") window.DGBAudraliaCanvasAnimation.stop();
  const controller = startAnimation({ canvas, texture, mount, label, baseResult });
  if (typeof window !== "undefined") { window.DGBAudraliaCanvasAnimation = controller; window.AudraliaCanvasAnimation = controller; window.audraliaCanvasAnimation = controller; }
  return expose(baseResult);
}

function getAudraliaCanvasStatus() {
  if (typeof window !== "undefined" && window.DGBAudraliaCanvasStatus) return window.DGBAudraliaCanvasStatus;
  return Object.freeze({ ok: false, receipt: RECEIPT, activeRenewal: ACTIVE_RENEWAL, routeReceipt: ROUTE_RECEIPT, routeRenewal: ROUTE_RENEWAL, canvasAuthority: "assets/audralia/audralia.canvas.js", canvasRendered: false, animationActive: false, terrainDefinitionActive: true });
}

const api = Object.freeze({ receipt: RECEIPT, activeRenewal: ACTIVE_RENEWAL, routeReceipt: ROUTE_RECEIPT, routeRenewal: ROUTE_RENEWAL, renderAudraliaCanvas, getAudraliaCanvasStatus });

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvas = api;
  window.AudraliaCanvas = api;
  window.audraliaCanvas = api;
}

export { RECEIPT, ACTIVE_RENEWAL, ROUTE_RECEIPT, ROUTE_RENEWAL, renderAudraliaCanvas, getAudraliaCanvasStatus };
export default api;
