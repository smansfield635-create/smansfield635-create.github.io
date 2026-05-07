/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10 */
/*
  Result:
  - Renews the Audralia adopted canvas authority only.
  - Aligns canvas public route expectation to AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1.
  - Preserves V9 compatibility so the current V8 route caller accepts the canvas contract.
  - Removes stale V7 route-facing receipt/status residue from public flow.
  - Preserves runtime V8 land-water normalization.
  - Keeps rendering runtime-backed, fail-open, noninteractive, and mobile-safe.
  - Does not touch HTML shell, route shell, runtime file, Gauges, topology, terrain, hydration, oceans, or deep-ocean.
  - No GraphicBox. No image generation. No visual pass claim.
*/

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9_ROUTE_V8_ALIGNMENT_TNT_v10";
const ACTIVE_RENEWAL = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_ROUTE_V8_ALIGNMENT_TNT_v10";
const COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9";
const RETIRED_CANVAS_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1"
]);

const ROUTE_EXPECTED = "AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1";
const RETIRED_ROUTE_EXPECTATIONS = Object.freeze([
  "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
  "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1"
]);

const RUNTIME_EXPECTED = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const VERSION = "2026-05-07.canvas-runtime-backed-route-v8-alignment-v10";

const FRAME_RATE_TARGET = 22;
const FRAME_INTERVAL = 1000 / FRAME_RATE_TARGET;
const INITIAL_TEXTURE_WIDTH = 384;
const INITIAL_TEXTURE_HEIGHT = 192;
const RUNTIME_TEXTURE_WIDTH = 768;
const RUNTIME_TEXTURE_HEIGHT = 384;
const MAX_RENDER_SIZE = 740;

let activeController = null;

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  activeRenewal: ACTIVE_RENEWAL,
  compatibilityContract: COMPATIBILITY_CONTRACT,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
  routeExpected: ROUTE_EXPECTED,
  retiredRouteExpectations: RETIRED_ROUTE_EXPECTATIONS,
  runtimeExpected: RUNTIME_EXPECTED,
  version: VERSION,
  autoBoot: false,
  routeOwnsCall: true,
  renderMode: "runtime-backed-orthographic-realism-route-v8-aligned-v10",
  visualTarget: "cleaner 4k realism with route-v8 alignment, stronger land-water separation, ocean depth, coastlines, shelves, ice, and mineral relief",
  canvasOwns: Object.freeze([
    "canvas_creation",
    "orthographic_projection",
    "runtime_sample_consumption",
    "fail_open_first_paint",
    "visible_texture_expression",
    "mobile_safe_animation",
    "stale_route_status_cleanup",
    "pixel_proof_status"
  ]),
  canvasDoesNotOwn: Object.freeze([
    "html_shell",
    "route_shell",
    "runtime_truth",
    "topology_authority",
    "terrain_authority",
    "hydration_authority",
    "ocean_authority",
    "deep_ocean_authority",
    "gauges_scoring",
    "graphic_box",
    "image_generation",
    "visual_pass_claim"
  ]),
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const PALETTE = Object.freeze({
  space: [2, 6, 16, 255],
  star: [222, 236, 255, 255],
  gold: [244, 226, 178, 255],
  oceanDeep: [3, 18, 56, 255],
  oceanMid: [8, 54, 112, 255],
  oceanBlue: [18, 101, 171, 255],
  oceanLight: [61, 155, 203, 255],
  shelf: [49, 174, 188, 255],
  shelfBright: [94, 214, 207, 255],
  coastFoam: [219, 232, 204, 255],
  lowland: [75, 122, 83, 255],
  upland: [118, 117, 78, 255],
  highland: [172, 153, 100, 255],
  mineralGold: [201, 167, 85, 255],
  granite: [153, 146, 128, 255],
  slate: [70, 86, 96, 255],
  opal: [165, 219, 205, 255],
  diamond: [232, 244, 249, 255],
  ice: [229, 246, 252, 255],
  iceShadow: [153, 197, 215, 255],
  atmosphere: [91, 176, 218, 255],
  rim: [130, 207, 248, 255]
});

const FALLBACK_MASSES = Object.freeze([
  { id: "western-mainland", lon: -106, lat: -18, rx: 54, ry: 28, height: 0.78, mineral: 0.62, green: 0.52 },
  { id: "eastern-mainland", lon: -18, lat: 6, rx: 42, ry: 32, height: 0.72, mineral: 0.54, green: 0.46 },
  { id: "southern-mass", lon: 78, lat: -55, rx: 48, ry: 22, height: 0.62, mineral: 0.58, green: 0.50 },
  { id: "equatorial-chain", lon: 123, lat: -8, rx: 34, ry: 19, height: 0.70, mineral: 0.70, green: 0.38 },
  { id: "north-polar-crown", lon: -74, lat: 66, rx: 52, ry: 17, height: 0.44, mineral: 0.35, green: 0.28 },
  { id: "far-east-reef", lon: 165, lat: -28, rx: 30, ry: 11, height: 0.36, mineral: 0.48, green: 0.44 }
]);

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  activeRenewal: ACTIVE_RENEWAL,
  compatibilityContract: COMPATIBILITY_CONTRACT,
  retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
  routeExpected: ROUTE_EXPECTED,
  retiredRouteExpectations: RETIRED_ROUTE_EXPECTATIONS,
  runtimeExpected: RUNTIME_EXPECTED,
  version: VERSION,
  canonicalExport: "mountAudraliaCanvas",
  renderMode: PLANET.renderMode,
  canvasPresent: false,
  mountPresent: false,
  runtimeImported: false,
  runtimeReceipt: "",
  runtimeError: "",
  runtimeTextureReady: false,
  fallbackTextureReady: false,
  animated: false,
  frameCount: 0,
  pixelProof: null,
  staleRouteV7Removed: true,
  staleCanvasV8Removed: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
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

function mixColor(a, b, t) {
  const amount = clamp01(t);
  return [
    Math.round(mix(a[0], b[0], amount)),
    Math.round(mix(a[1], b[1], amount)),
    Math.round(mix(a[2], b[2], amount)),
    255
  ];
}

function multiplyColor(color, shade) {
  return [
    clamp(Math.round(color[0] * shade), 0, 255),
    clamp(Math.round(color[1] * shade), 0, 255),
    clamp(Math.round(color[2] * shade), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function lighten(color, amount) {
  return mixColor(color, [255, 255, 255, 255], amount);
}

function darken(color, amount) {
  return mixColor(color, [0, 0, 0, 255], amount);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function normalizeLongitudeDegrees(lon) {
  let value = Number(lon) || 0;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function longitudeDistanceDegrees(a, b) {
  const direct = Math.abs(normalizeLongitudeDegrees(a - b));
  return Math.min(direct, 360 - direct);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function valueNoise(x, y, z) {
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
  let total = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    total += valueNoise(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.05;
  }

  return total / Math.max(0.000001, normalizer);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function vectorToLatLon(x, y, z, rotation) {
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);
  const xr = x * cosRot - z * sinRot;
  const zr = x * sinRot + z * cosRot;

  return {
    lat: Math.asin(clamp(y, -1, 1)),
    lon: Math.atan2(xr, zr)
  };
}

function normalizeRuntimeSurface(raw, lat, lon, u, v) {
  const visualSurfaceClass = String(
    raw?.visualSurfaceClass ||
    raw?.surfaceClass ||
    raw?.className ||
    raw?.type ||
    ""
  );

  const ice = Boolean(
    raw?.ice ||
      raw?.glacier ||
      visualSurfaceClass.includes("ice") ||
      visualSurfaceClass.includes("snow")
  );

  const water = Boolean(
    raw?.liquidWater ||
      raw?.water ||
      raw?.ocean ||
      raw?.shelf ||
      visualSurfaceClass.includes("water") ||
      visualSurfaceClass.includes("ocean") ||
      visualSurfaceClass.includes("shelf")
  );

  const shelf = Boolean(raw?.shelf || visualSurfaceClass.includes("shelf"));
  const ocean = Boolean(raw?.ocean || visualSurfaceClass.includes("ocean"));

  const land = Boolean(
    raw?.land ||
      raw?.visibleLand ||
      raw?.exposedTerrainLand ||
      raw?.solidSurfaceLand ||
      visualSurfaceClass.includes("land") ||
      visualSurfaceClass.includes("terrain")
  ) && !water && !ice;

  const solidSurfaceLand = Boolean(raw?.solidSurfaceLand || land || ice) && !water;
  const depth = water ? clamp01(Number(raw?.depth ?? raw?.oceanDepth ?? raw?.routeSafeDepth ?? 0.48)) : 0;
  const elevation = solidSurfaceLand ? clamp01(Number(raw?.elevation ?? raw?.maxElevation ?? raw?.terrainRelief ?? 0.22)) : 0;
  const relief = solidSurfaceLand ? clamp01(Number(raw?.terrainRelief ?? raw?.terrainReliefIndex ?? elevation)) : 0;
  const mineral = clamp01(Number(raw?.mineralIndex ?? raw?.diamondSignal ?? raw?.opalSignal ?? 0.32));
  const coast = clamp01(Number(raw?.coastlineIndex ?? raw?.coastalFeather ?? raw?.coastWaterMask ?? (shelf ? 0.65 : 0)));
  const turquoise = clamp01(Number(raw?.turquoiseIndex ?? raw?.turquoise ?? raw?.visibleTurquoiseIndex ?? (shelf ? 0.64 : 0.12)));
  const mountain = clamp01(Number(raw?.mountainIndex ?? elevation));
  const cliff = clamp01(Number(raw?.coastalCliffIndex ?? raw?.cliff ?? 0));
  const deep = clamp01(Number(raw?.deepOceanBlend ?? raw?.organicDeepOceanPresence ?? raw?.routeSafeDepth ?? depth));

  return {
    raw,
    ok: true,
    lat,
    lon,
    u,
    v,
    visualSurfaceClass,
    water,
    land,
    solidSurfaceLand,
    ice,
    shelf,
    ocean,
    depth,
    elevation,
    relief,
    mineral,
    coast,
    turquoise,
    mountain,
    cliff,
    deep,
    fallback: Boolean(raw?.fallback || raw?.fallbackSample || raw?.isFallback)
  };
}

function fallbackMassInfluence(latDeg, lonDeg, mass) {
  const dx = longitudeDistanceDegrees(lonDeg, mass.lon) / mass.rx;
  const dy = Math.abs(latDeg - mass.lat) / mass.ry;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const noise = fbm3(
    Math.sin((lonDeg + mass.lon) * Math.PI / 180) * 4 + mass.height,
    Math.sin((latDeg + mass.lat) * Math.PI / 180) * 4 - mass.green,
    mass.mineral * 9,
    4
  );

  return smoothstep(1.05, 0.32, distance + (noise - 0.5) * 0.22);
}

function fallbackSurface(lat, lon, u, v) {
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = normalizeLongitudeDegrees(lon * 180 / Math.PI);

  let landScore = -0.42;
  let mineral = 0.18;
  let green = 0.24;
  let massStrength = 0;

  for (const mass of FALLBACK_MASSES) {
    const influence = fallbackMassInfluence(latDeg, lonDeg, mass);
    landScore += influence * mass.height;
    mineral += influence * mass.mineral * 0.22;
    green += influence * mass.green * 0.18;
    massStrength = Math.max(massStrength, influence);
  }

  const shapeNoise = fbm3(
    Math.cos(lat) * Math.sin(lon) * 3.8,
    Math.sin(lat) * 3.8,
    Math.cos(lat) * Math.cos(lon) * 3.8,
    5
  );

  const detailNoise = fbm3(
    Math.cos(lat) * Math.sin(lon) * 17.2,
    Math.sin(lat) * 17.2,
    Math.cos(lat) * Math.cos(lon) * 17.2,
    4
  );

  landScore += (shapeNoise - 0.5) * 0.18 * Math.max(0.3, massStrength);

  const polar = Math.abs(latDeg) > 72;
  const ice = polar && (latDeg > 0 || landScore > -0.26);
  const land = landScore > 0.03 && !ice;
  const shelf = !land && !ice && landScore > -0.18;
  const water = !land && !ice;
  const depth = water ? clamp01(Math.abs(landScore) * 1.2 + (1 - detailNoise) * 0.22) : 0;
  const elevation = land ? clamp01(landScore * 0.86 + detailNoise * 0.18) : ice ? 0.32 : 0;

  return {
    ok: true,
    lat,
    lon,
    u,
    v,
    visualSurfaceClass: ice
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    water,
    liquidWater: water,
    ocean: water && !shelf,
    shelf,
    land,
    exposedTerrainLand: land,
    visibleLand: land,
    solidSurfaceLand: land || ice,
    ice,
    glacier: ice,
    depth,
    oceanDepth: depth,
    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
    mineralIndex: clamp01(mineral),
    turquoiseIndex: shelf ? 0.72 : water ? 0.22 : 0.08,
    coastlineIndex: shelf ? 0.58 : land && landScore < 0.16 ? 0.42 : 0,
    mountainIndex: land ? clamp01(elevation * 0.82 + detailNoise * 0.24) : 0,
    coastalCliffIndex: land && landScore < 0.16 ? 0.34 : 0,
    deepOceanBlend: water ? clamp01(depth * 0.8) : 0,
    greenIndex: green,
    fallback: false,
    fallbackSample: false
  };
}

function surfaceToColor(sample, normal, lighting) {
  const micro = fbm3(
    normal.x * 21.5 + 1.7,
    normal.y * 21.5 - 4.3,
    normal.z * 21.5 + 8.1,
    4
  );

  const grain = fbm3(
    normal.x * 56.0 - 3.1,
    normal.y * 56.0 + 9.2,
    normal.z * 56.0 - 6.4,
    3
  );

  let color;

  if (sample.ice) {
    color = mixColor(PALETTE.iceShadow, PALETTE.ice, 0.58 + micro * 0.30);
    color = lighten(color, clamp01(sample.elevation * 0.18 + lighting.highlight * 0.1));
  } else if (sample.water) {
    const depth = clamp01(sample.depth);
    const deepBlend = clamp01(sample.deep || depth);
    const shelf = clamp01(sample.turquoise);

    color = mixColor(PALETTE.oceanBlue, PALETTE.oceanDeep, clamp01(depth * 0.92 + deepBlend * 0.28));
    color = mixColor(color, PALETTE.oceanMid, clamp01(0.18 + micro * 0.12));
    color = mixColor(color, PALETTE.shelf, clamp01(shelf * 0.58));
    color = mixColor(color, PALETTE.shelfBright, clamp01(sample.shelf ? 0.24 + shelf * 0.18 : shelf * 0.08));

    const current = Math.sin((normal.x * 18.0) + (normal.z * 9.0) + micro * 4.0) * 0.5 + 0.5;
    color = lighten(color, current * 0.035 + lighting.highlight * 0.04);
  } else {
    const relief = clamp01(sample.relief || sample.elevation);
    const mineral = clamp01(sample.mineral);
    const coast = clamp01(sample.coast);
    const mountain = clamp01(sample.mountain);

    color = mixColor(PALETTE.lowland, PALETTE.upland, clamp01(relief * 0.55 + mineral * 0.16));
    color = mixColor(color, PALETTE.highland, clamp01(mountain * 0.32));
    color = mixColor(color, PALETTE.granite, clamp01(mineral * 0.22 + grain * 0.08));
    color = mixColor(color, PALETTE.slate, clamp01(sample.cliff * 0.18 + (1 - lighting.light) * 0.05));
    color = mixColor(color, PALETTE.mineralGold, clamp01(mineral * 0.18 + relief * 0.07));
    color = mixColor(color, PALETTE.opal, clamp01(coast * 0.18));
    color = mixColor(color, PALETTE.coastFoam, clamp01(coast * 0.16));

    const pitting = (grain - 0.5) * 0.08 + (micro - 0.5) * 0.06;
    color = multiplyColor(color, 1 + pitting);
  }

  const finalShade = clamp(
    0.42 + lighting.light * 0.72 + lighting.rim * 0.18 - lighting.edge * 0.18,
    0.36,
    1.22
  );

  color = multiplyColor(color, finalShade);

  if (lighting.highlight > 0) {
    color = lighten(color, lighting.highlight * 0.10);
  }

  return color;
}

function normalizeRuntimeModule(module) {
  if (!module) return null;

  if (typeof module.createAudraliaRuntime === "function") {
    try {
      const created = module.createAudraliaRuntime();
      if (created && typeof created === "object") return created;
    } catch (_) {}
  }

  if (module.default && typeof module.default === "function") {
    try {
      const created = module.default();
      if (created && typeof created === "object") return created;
    } catch (_) {}
  }

  if (module.default && typeof module.default === "object") {
    return module.default;
  }

  return module;
}

function sampleRuntime(runtime, lat, lon, u, v) {
  const sampler =
    runtime?.sampleSurface ||
    runtime?.sampleAudraliaSurface ||
    runtime?.sampleRuntimeState ||
    runtime?.sampleAudraliaPlanetState ||
    runtime?.sampleAudraliaRuntime ||
    runtime?.buildRuntimeField ||
    null;

  if (typeof sampler !== "function") {
    return normalizeRuntimeSurface(fallbackSurface(lat, lon, u, v), lat, lon, u, v);
  }

  try {
    const raw = sampler({ lat, lon, u, v }, lon, u, v);

    if (raw && typeof raw === "object") {
      return normalizeRuntimeSurface(raw, lat, lon, u, v);
    }
  } catch (_) {}

  return normalizeRuntimeSurface(fallbackSurface(lat, lon, u, v), lat, lon, u, v);
}

function createTextureCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.dataset.audraliaTexture = "true";
  return canvas;
}

function buildTextureSync(runtime, width, height) {
  const texture = createTextureCanvas(width, height);
  const ctx = texture.getContext("2d", { willReadFrequently: false });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  for (let py = 0; py < height; py += 1) {
    const v = height <= 1 ? 0.5 : py / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let px = 0; px < width; px += 1) {
      const u = width <= 1 ? 0.5 : px / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const normal = {
        x: Math.cos(lat) * Math.sin(lon),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.cos(lon)
      };

      const sample = sampleRuntime(runtime, lat, lon, u, v);
      const light = clamp01(normal.x * -0.38 + normal.y * 0.32 + normal.z * 0.74);
      const edge = clamp01(1 - normal.z);
      const highlight = clamp01(Math.pow(light, 6) * 0.42);
      const color = surfaceToColor(sample, normal, { light, edge, rim: edge, highlight });

      const index = (py * width + px) * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return texture;
}

async function buildTextureAsync(runtime, width, height, signal) {
  const texture = createTextureCanvas(width, height);
  const ctx = texture.getContext("2d", { willReadFrequently: false });
  const image = ctx.createImageData(width, height);
  const data = image.data;
  const rowsPerChunk = 8;

  for (let py = 0; py < height; py += 1) {
    if (signal?.aborted) return null;

    const v = height <= 1 ? 0.5 : py / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let px = 0; px < width; px += 1) {
      const u = width <= 1 ? 0.5 : px / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const normal = {
        x: Math.cos(lat) * Math.sin(lon),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.cos(lon)
      };

      const sample = sampleRuntime(runtime, lat, lon, u, v);
      const light = clamp01(normal.x * -0.38 + normal.y * 0.32 + normal.z * 0.74);
      const edge = clamp01(1 - normal.z);
      const highlight = clamp01(Math.pow(light, 6) * 0.42);
      const color = surfaceToColor(sample, normal, { light, edge, rim: edge, highlight });

      const index = (py * width + px) * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;
    }

    if (py % rowsPerChunk === rowsPerChunk - 1) {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
    }
  }

  ctx.putImageData(image, 0, 0);
  return texture;
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

  const selectors = [
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audraliaRenderMount",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (const selector of selectors) {
    const selected = document.querySelector(selector);
    if (selected) return selected;
  }

  return document.body;
}

function removeStaleVisibleReceipts() {
  if (typeof document === "undefined") return;

  const staleTokens = [
    "AUDRALIA_ROUTE_V7_HARD_BIND_CANVAS_CALLER_TNT_v1",
    "AUDRALIA_ROUTE_V6_HARD_BIND_CANVAS_CALLER_TNT_v1",
    "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v8",
    "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
    "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
    "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5"
  ];

  const selectors = [
    "[data-audralia-route-v7-proof]",
    "[data-audralia-route-v6-proof]",
    "[data-audralia-canvas-v8-proof]",
    "[data-audralia-stale-proof]",
    "section",
    "aside",
    "p",
    "div"
  ];

  document.querySelectorAll(selectors.join(",")).forEach((node) => {
    if (!node || node === document.body || node === document.documentElement) return;

    const isStatusTarget =
      node.matches("#audralia-route-status, [data-audralia-route-status], #audralia-status, [data-route-status]");

    if (isStatusTarget) return;

    const text = (node.textContent || "").trim();
    if (!text) return;

    const containsStale = staleTokens.some((token) => text.includes(token));
    const smallNode = text.length < 900 && node.querySelectorAll("a, button, canvas").length === 0;

    if (containsStale && smallNode) {
      node.remove();
    }
  });
}

function clearOwnedNodes(mount) {
  mount.querySelectorAll("[data-audralia-canvas-authority='true']").forEach((node) => {
    node.remove();
  });
}

function setRouteStatus(message, state = null) {
  const selectors = [
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ];

  const detail = state
    ? [
        `Route ${ROUTE_EXPECTED}`,
        `Canvas ${ACTIVE_RENEWAL}`,
        `Compatibility ${COMPATIBILITY_CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Runtime ${RUNTIME_EXPECTED}`,
        `Retired ${RETIRED_CANVAS_CONTRACTS.join(", ")}`,
        "GraphicBox false",
        "Image generation false",
        "Visual pass claimed false"
      ].join(" · ")
    : "";

  for (const selector of selectors) {
    const node = document.querySelector(selector);

    if (node) {
      node.textContent = detail ? `${message}\n${detail}` : message;
      node.setAttribute("data-audralia-canvas-loaded", "true");
      node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
      node.setAttribute("data-audralia-canvas-contract", CONTRACT);
      node.setAttribute("data-audralia-canvas-active-renewal", ACTIVE_RENEWAL);
      node.setAttribute("data-audralia-canvas-compatibility-contract", COMPATIBILITY_CONTRACT);
      node.setAttribute("data-audralia-route-expected", ROUTE_EXPECTED);
      node.setAttribute("data-audralia-retired-route-expectations", RETIRED_ROUTE_EXPECTATIONS.join(","));
      node.setAttribute("data-audralia-runtime-contract", RUNTIME_EXPECTED);
      node.setAttribute("data-graphic-box", "false");
      node.setAttribute("data-image-generation", "false");
      node.setAttribute("data-visual-pass-claimed", "false");
      return;
    }
  }
}

function createCanvasShell(mount) {
  clearOwnedNodes(mount);
  removeStaleVisibleReceipts();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.setAttribute("data-audralia-active-renewal", ACTIVE_RENEWAL);
  shell.setAttribute("data-audralia-route-expected", ROUTE_EXPECTED);
  shell.setAttribute("data-audralia-runtime-expected", RUNTIME_EXPECTED);
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";
  shell.style.userSelect = "none";
  shell.style.webkitUserSelect = "none";
  shell.style.touchAction = "pan-y";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "runtime-backed-route-v8-aligned-v10");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(23, 54, 86, 0.98), rgba(2, 7, 19, 1) 70%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.52), inset 0 0 88px rgba(136, 195, 255, 0.09)";
  frame.style.userSelect = "none";
  frame.style.webkitUserSelect = "none";
  frame.style.touchAction = "pan-y";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia runtime-backed orthographic planet canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.touchAction = "pan-y";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.hidden = true;
  proof.setAttribute("aria-hidden", "true");
  proof.style.display = "none";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame, options = {}) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 820);
  const cssSize = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback, options.maxRenderSize || MAX_RENDER_SIZE)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 1.75);
  const backingSize = Math.floor(Math.min(cssSize * ratio, MAX_RENDER_SIZE));

  canvas.width = backingSize;
  canvas.height = backingSize;
  canvas.setAttribute("data-pixel-ratio", String(ratio));
  canvas.setAttribute("data-backing-size", String(backingSize));

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  return {
    ctx,
    size: backingSize,
    ratio,
    cssSize
  };
}

function drawBackground(ctx, size, time) {
  ctx.fillStyle = "#020610";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 132; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.20 + 0.48 * Math.abs(Math.sin(time * 0.0008 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 9 === 0 ? "rgba(245, 221, 166, 0.86)" : "rgba(185, 216, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(x, y, index % 17 === 0 ? 1.35 : 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
  if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

  const sourceWidth = texture.width;
  const sourceHeight = texture.height;
  const start = wrap01(phase) * sourceWidth;
  const safeSy = clamp(sy, 0, sourceHeight - 1);
  const safeSh = clamp(sh, 1, sourceHeight - safeSy);
  const firstSourceWidth = sourceWidth - start;
  const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
  const secondDestWidth = dw - firstDestWidth;

  ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

  if (secondDestWidth > 0.5) {
    ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
  }
}

function drawSphereTexture(ctx, texture, phase, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.355;
  const stripHeight = Math.max(1, Math.floor(size / 360));
  const sourceHeight = texture.height || 192;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  for (let y = -radius; y <= radius; y += stripHeight) {
    const yMid = y + stripHeight / 2;
    const normalizedY = yMid / radius;
    const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
    const destWidth = radius * 2 * chord;
    const destX = cx - destWidth / 2;
    const destY = cy + y;
    const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
    const sy = Math.floor(v * (sourceHeight - 1));
    const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.85));

    drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
  }

  ctx.restore();
}

function drawOrbitalField(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.355;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00022) * 0.12);

  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius * (1.08 + index * 0.06),
      radius * (0.16 + index * 0.026),
      0,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.10)" : "rgba(127, 194, 255, 0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawClouds(ctx, size, time, phase) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.355;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = "rgba(245, 250, 255, 0.55)";
  ctx.lineWidth = Math.max(1, size * 0.0018);

  for (let band = 0; band < 9; band += 1) {
    const y = cy - radius * 0.66 + (band / 8) * radius * 1.32;
    const widthFactor = Math.sqrt(Math.max(0, 1 - Math.pow((y - cy) / radius, 2)));
    const left = cx - radius * widthFactor;
    const right = cx + radius * widthFactor;
    const cloudPhase = time * 0.001 + band * 1.7 + phase * 5.2;

    ctx.beginPath();

    for (let x = left; x <= right; x += 8) {
      const wave = Math.sin(x * 0.023 + cloudPhase) * radius * 0.014;
      const ripple = Math.cos(x * 0.041 - cloudPhase) * radius * 0.006;
      const yy = y + wave + ripple;

      if (x === left) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.355;
  const pulse = 0.42 + Math.sin(time * 0.0013) * 0.04;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + size * 0.003, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(159, 214, 255, ${pulse.toFixed(3)})`;
  ctx.lineWidth = Math.max(2, size * 0.010);
  ctx.stroke();

  const shade = ctx.createRadialGradient(
    cx - radius * 0.42,
    cy - radius * 0.46,
    radius * 0.05,
    cx + radius * 0.18,
    cy + radius * 0.16,
    radius * 1.18
  );

  shade.addColorStop(0, "rgba(255, 255, 255, 0.13)");
  shade.addColorStop(0.52, "rgba(255, 255, 255, 0.018)");
  shade.addColorStop(0.76, "rgba(0, 0, 0, 0.17)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.68)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.restore();
}

function drawDiagnostics(ctx, size) {
  ctx.save();
  ctx.fillStyle = "rgba(244, 226, 178, 0.90)";
  ctx.font = `700 ${Math.max(13, size * 0.027)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.864);

  ctx.fillStyle = "rgba(174, 204, 225, 0.70)";
  ctx.font = `500 ${Math.max(10, size * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("RUNTIME-BACKED · ROUTE V8 ALIGNED", size / 2, size * 0.895);
  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const center = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;
    const quarter = ctx.getImageData(Math.floor(size * 0.64), Math.floor(size * 0.44), 1, 1).data;

    return {
      center: { r: center[0], g: center[1], b: center[2], a: center[3] },
      quarter: { r: quarter[0], g: quarter[1], b: quarter[2], a: quarter[3] },
      notBlank:
        (center[3] > 0 && center[0] + center[1] + center[2] > 12) ||
        (quarter[3] > 0 && quarter[0] + quarter[1] + quarter[2] > 12)
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state = null, extra = {}) {
  Object.assign(STATUS, {
    loaded: Boolean(state),
    canvasPresent: Boolean(state?.canvas),
    mountPresent: Boolean(state?.mount),
    animated: Boolean(state && !state.stopped),
    frameCount: state?.frameCount || STATUS.frameCount,
    pixelProof: state?.pixelProof || STATUS.pixelProof,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  }, extra);

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;

    try {
      window.dispatchEvent(
        new CustomEvent("audralia:canvas-authority-status", {
          detail: Object.freeze({ ...STATUS })
        })
      );
    } catch (_) {}
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasActiveRenewal = ACTIVE_RENEWAL;
    document.documentElement.dataset.audraliaCanvasCompatibilityContract = COMPATIBILITY_CONTRACT;
    document.documentElement.dataset.audraliaCanvasRouteExpected = ROUTE_EXPECTED;
    document.documentElement.dataset.audraliaCanvasRuntimeExpected = RUNTIME_EXPECTED;
    document.documentElement.dataset.audraliaCanvasLoaded = String(Boolean(state));
    document.documentElement.dataset.audraliaCanvasRuntimeTextureReady = String(Boolean(STATUS.runtimeTextureReady));
    document.documentElement.dataset.audraliaCanvasFallbackTextureReady = String(Boolean(STATUS.fallbackTextureReady));
    document.documentElement.dataset.audraliaCanvasStaleRouteV7Removed = "true";
    document.documentElement.dataset.audraliaCanvasStaleCanvasV8Removed = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function renderFrame(state, time) {
  if (!state || state.stopped) return;

  const elapsed = time - state.lastFrameTime;

  if (elapsed < FRAME_INTERVAL && state.frameCount > 0) {
    state.rafId = window.requestAnimationFrame((nextTime) => renderFrame(state, nextTime));
    return;
  }

  state.lastFrameTime = time;

  const ctx = state.ctx;
  const size = state.size;
  const phase = wrap01((time * 0.000026) + state.phaseOffset);
  const texture = state.runtimeTexture || state.fallbackTexture;

  ctx.clearRect(0, 0, size, size);

  drawBackground(ctx, size, time);
  drawOrbitalField(ctx, size, time);

  if (texture) {
    drawSphereTexture(ctx, texture, phase, size);
  }

  drawClouds(ctx, size, time, phase);
  drawAtmosphere(ctx, size, time);
  drawDiagnostics(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 90 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }

  state.rafId = window.requestAnimationFrame((nextTime) => renderFrame(state, nextTime));
}

async function importRuntimeForState(state) {
  try {
    const module = await import(
      `${RUNTIME_PATH}?canvas=${encodeURIComponent(ACTIVE_RENEWAL)}&runtime=${encodeURIComponent(RUNTIME_EXPECTED)}&cache=2026-05-07-canvas-v10-runtime-v8`
    );

    const runtime = normalizeRuntimeModule(module);
    const runtimeReceipt =
      module.AUDRALIA_RUNTIME_RECEIPT_VALUE ||
      module.AUDRALIA_RUNTIME_STATUS?.receipt ||
      runtime?.receipt ||
      runtime?.status?.receipt ||
      RUNTIME_EXPECTED;

    state.runtime = runtime;

    publishStatus(state, {
      runtimeImported: true,
      runtimeReceipt,
      runtimeError: ""
    });

    return runtime;
  } catch (error) {
    const runtimeError = error instanceof Error ? error.message : String(error);

    publishStatus(state, {
      runtimeImported: false,
      runtimeReceipt: "",
      runtimeError
    });

    return null;
  }
}

async function buildRuntimeTextureForState(state) {
  const runtime = await importRuntimeForState(state);
  if (!runtime || state.stopped) return;

  const abortSignal = state.abortController?.signal || null;
  const texture = await buildTextureAsync(
    runtime,
    Number(state.options.textureWidth) || RUNTIME_TEXTURE_WIDTH,
    Number(state.options.textureHeight) || RUNTIME_TEXTURE_HEIGHT,
    abortSignal
  );

  if (!texture || state.stopped) return;

  state.runtimeTexture = texture;

  publishStatus(state, {
    runtimeTextureReady: true
  });
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

function startCanvas(target, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();
  removeStaleVisibleReceipts();

  const mount = resolveMount(target);
  const nodes = createCanvasShell(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame, options);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    cssSize: setup.cssSize,
    mount,
    options,
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    rafId: 0,
    resizeTimer: 0,
    lastFrameTime: 0,
    phaseOffset: 0.18,
    runtime: null,
    fallbackTexture: null,
    runtimeTexture: null,
    abortController: typeof AbortController !== "undefined" ? new AbortController() : null
  };

  state.fallbackTexture = buildTextureSync(
    null,
    Number(options.initialTextureWidth) || INITIAL_TEXTURE_WIDTH,
    Number(options.initialTextureHeight) || INITIAL_TEXTURE_HEIGHT
  );

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame, state.options);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      state.cssSize = next.cssSize;
      state.pixelProof = null;
      publishStatus(state);
    }, 140);
  }

  state.stop = function stop() {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    if (state.abortController) {
      state.abortController.abort();
    }

    window.clearTimeout(state.resizeTimer);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", visibilityHandler);
  };

  function visibilityHandler() {
    if (document.hidden) {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      return;
    }

    if (!state.rafId && !state.stopped) {
      state.lastFrameTime = 0;
      state.rafId = window.requestAnimationFrame((time) => renderFrame(state, time));
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", visibilityHandler);

  activeController = state;

  publishStatus(state, {
    fallbackTextureReady: true
  });

  setRouteStatus("Audralia adopted canvas authority loaded.", state);

  state.rafId = window.requestAnimationFrame((time) => renderFrame(state, time));
  buildRuntimeTextureForState(state);

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
  publishStatus(activeController);

  return {
    ...STATUS,
    loaded: Boolean(activeController),
    receipt: RECEIPT,
    contract: CONTRACT,
    activeRenewal: ACTIVE_RENEWAL,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    routeExpected: ROUTE_EXPECTED,
    retiredRouteExpectations: RETIRED_ROUTE_EXPECTATIONS,
    runtimeExpected: RUNTIME_EXPECTED,
    version: VERSION,
    canonicalExport: "mountAudraliaCanvas",
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

export function getAudraliaSurfaceDataset() {
  return PLANET;
}

export function stopAudraliaCanvas() {
  stopActiveController();

  publishStatus(null, {
    loaded: false,
    animated: false
  });

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    activeRenewal: ACTIVE_RENEWAL,
    routeExpected: ROUTE_EXPECTED,
    runtimeExpected: RUNTIME_EXPECTED,
    version: VERSION
  };
}

export {
  RECEIPT,
  CONTRACT,
  ACTIVE_RENEWAL,
  COMPATIBILITY_CONTRACT,
  RETIRED_CANVAS_CONTRACTS,
  ROUTE_EXPECTED,
  RETIRED_ROUTE_EXPECTATIONS,
  RUNTIME_EXPECTED,
  VERSION,
  PLANET
};

const api = Object.freeze({
  RECEIPT,
  CONTRACT,
  ACTIVE_RENEWAL,
  COMPATIBILITY_CONTRACT,
  RETIRED_CANVAS_CONTRACTS,
  ROUTE_EXPECTED,
  RETIRED_ROUTE_EXPECTATIONS,
  RUNTIME_EXPECTED,
  VERSION,
  PLANET,
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
});

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
  window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
}

publishStatus(null);

export default api;
