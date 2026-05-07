/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10 */
/*
  Full-file replacement. Canvas authority only.

  Result:
  - Canvas no longer writes public route status.
  - Canvas no longer creates public route proof panels.
  - First paint is fail-open and never waits on runtime.
  - Runtime is consumed after first paint when available.
  - Mobile interaction remains safe: canvas is noninteractive.
  - Text outside canvas remains selectable.
  - Route owns the public status line.
  - Runtime V8 remains expected.
  - No GraphicBox.
  - No image generation.
  - No visual-pass claim.
*/

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10";
const COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9";
const RUNTIME_EXPECTED = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const ROUTE_EXPECTED = "AUDRALIA_ROUTE_V11_SINGLE_STATUS_CANVAS_V10_CALLER_TNT_v1";
const VERSION = "2026-05-07.canvas-render-only-orthographic-realism-v10";
const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const DEFAULTS = Object.freeze({
  maxRenderSize: 720,
  minRenderSize: 320,
  firstPaintTextureWidth: 360,
  firstPaintTextureHeight: 180,
  runtimeTextureWidth: 720,
  runtimeTextureHeight: 360,
  frameRateTarget: 24,
  radiusRatio: 0.395,
  axialTiltDegrees: -8.5,
  rotationSpeed: 0.000055,
  visibleCanvasReceipt: false
});

const PALETTE = Object.freeze({
  space: [2, 6, 16, 255],
  oceanAbyss: [2, 14, 42, 255],
  oceanDeep: [3, 24, 70, 255],
  oceanMid: [9, 67, 126, 255],
  oceanBlue: [18, 104, 174, 255],
  shelf: [48, 164, 184, 255],
  shelfBright: [94, 214, 209, 255],
  coastFoam: [214, 229, 204, 255],
  lowland: [74, 119, 84, 255],
  upland: [124, 118, 78, 255],
  highland: [168, 152, 100, 255],
  mineralGold: [202, 170, 88, 255],
  granite: [158, 150, 132, 255],
  slate: [68, 82, 92, 255],
  opal: [160, 220, 206, 255],
  diamond: [230, 246, 250, 255],
  ice: [231, 247, 253, 255],
  iceShadow: [149, 196, 216, 255],
  atmosphere: [88, 177, 221, 255],
  rim: [139, 211, 250, 255],
  labelGold: [244, 226, 178, 255],
  labelMuted: [184, 204, 226, 255]
});

const FALLBACK_MASSES = Object.freeze([
  { id: "western-mainland", lon: -106, lat: -18, rx: 55, ry: 29, height: 0.78, mineral: 0.62, green: 0.50 },
  { id: "eastern-mainland", lon: -18, lat: 6, rx: 43, ry: 33, height: 0.72, mineral: 0.54, green: 0.46 },
  { id: "southern-mass", lon: 78, lat: -55, rx: 49, ry: 23, height: 0.62, mineral: 0.58, green: 0.49 },
  { id: "equatorial-chain", lon: 123, lat: -8, rx: 35, ry: 20, height: 0.70, mineral: 0.70, green: 0.38 },
  { id: "north-polar-crown", lon: -74, lat: 66, rx: 52, ry: 18, height: 0.44, mineral: 0.35, green: 0.28 },
  { id: "far-east-reef", lon: 165, lat: -28, rx: 31, ry: 12, height: 0.36, mineral: 0.48, green: 0.44 },
  { id: "western-island-belt", lon: -154, lat: 8, rx: 25, ry: 14, height: 0.34, mineral: 0.52, green: 0.38 },
  { id: "southeast-shelf-islands", lon: 132, lat: -38, rx: 28, ry: 13, height: 0.38, mineral: 0.48, green: 0.48 }
]);

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  compatibilityContract: COMPATIBILITY_CONTRACT,
  routeExpected: ROUTE_EXPECTED,
  runtimeExpected: RUNTIME_EXPECTED,
  version: VERSION,
  autoBoot: false,
  routeOwnsCall: true,
  publicStatusWriter: "route-only",
  canvasWritesRouteStatus: false,
  createsRouteProofPanel: false,
  canvasOwns: Object.freeze([
    "canvas_creation",
    "orthographic_projection",
    "fail_open_first_paint",
    "runtime_sample_consumption",
    "visible_texture_expression",
    "mobile_safe_animation",
    "pixel_proof_status"
  ]),
  canvasDoesNotOwn: Object.freeze([
    "html_shell",
    "route_shell",
    "public_route_status",
    "route_proof_panel",
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
  renderMode: "render-only-orthographic-realism-v10",
  visualTarget: "stable first paint, no blank canvas, no stale public route status, runtime-backed texture after mount",
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

let activeController = null;

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

function normalizeConfig(options = {}) {
  return Object.freeze({
    maxRenderSize: clamp(Number(options.maxRenderSize) || DEFAULTS.maxRenderSize, 320, 920),
    minRenderSize: clamp(Number(options.minRenderSize) || DEFAULTS.minRenderSize, 280, 520),
    firstPaintTextureWidth: clamp(Number(options.firstPaintTextureWidth) || DEFAULTS.firstPaintTextureWidth, 180, 640),
    firstPaintTextureHeight: clamp(Number(options.firstPaintTextureHeight) || DEFAULTS.firstPaintTextureHeight, 90, 320),
    runtimeTextureWidth: clamp(Number(options.runtimeTextureWidth) || DEFAULTS.runtimeTextureWidth, 256, 1024),
    runtimeTextureHeight: clamp(Number(options.runtimeTextureHeight) || DEFAULTS.runtimeTextureHeight, 128, 512),
    frameRateTarget: clamp(Number(options.frameRateTarget) || DEFAULTS.frameRateTarget, 10, 30),
    radiusRatio: clamp(Number(options.radiusRatio) || DEFAULTS.radiusRatio, 0.32, 0.44),
    axialTiltDegrees: Number(options.axialTiltDegrees) || DEFAULTS.axialTiltDegrees,
    rotationSpeed: Number(options.rotationSpeed) || DEFAULTS.rotationSpeed,
    visibleCanvasReceipt: Boolean(options.visibleCanvasReceipt ?? DEFAULTS.visibleCanvasReceipt),
    routeReceipt: String(options.routeReceipt || ROUTE_EXPECTED),
    runtimeReceipt: String(options.runtimeReceipt || RUNTIME_EXPECTED)
  });
}

function latLonToVector(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function vectorToLatLon(x, y, z, rotation) {
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);
  const xr = x * cosRot - z * sinRot;
  const zr = x * sinRot + z * cosRot;
  const lat = Math.asin(clamp(y, -1, 1));
  const lon = Math.atan2(xr, zr);

  return { lat, lon };
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

  let landScore = -0.48;
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

  const point = latLonToVector(lat, lon);

  const shapeNoise = fbm3(point.x * 3.8, point.y * 3.8, point.z * 3.8, 5);
  const detailNoise = fbm3(point.x * 17.2, point.y * 17.2, point.z * 17.2, 4);
  const coastalNoise = fbm3(point.x * 38.0, point.y * 38.0, point.z * 38.0, 3);

  landScore += (shapeNoise - 0.5) * 0.18 * Math.max(0.3, massStrength);

  const polarIce = Math.abs(latDeg) > 74;
  const ice = polarIce && (latDeg > 0 || landScore > -0.26);
  const land = landScore > 0.04 && !ice;
  const shelf = !land && !ice && landScore > -0.18;
  const water = !land && !ice;

  const depth = water ? clamp01(Math.abs(landScore) * 1.25 + (1 - detailNoise) * 0.20) : 0;
  const elevation = land ? clamp01(landScore * 0.88 + detailNoise * 0.16) : ice ? 0.34 : 0;
  const coastlineIndex = shelf ? 0.62 : land && landScore < 0.18 ? 0.46 + coastalNoise * 0.18 : 0;
  const mountain = land ? clamp01(elevation * 0.82 + detailNoise * 0.24) : 0;

  return {
    ok: true,
    source: "canvas-v10-fail-open-surface",
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
    greenIndex: clamp01(green),
    turquoiseIndex: shelf ? 0.72 : water ? 0.22 : 0.08,
    coastlineIndex,
    mountainIndex: mountain,
    coastalCliffIndex: land && landScore < 0.18 ? 0.32 : 0,
    deepOceanBlend: water ? clamp01(depth * 0.84) : 0,
    fallback: false,
    fallbackSample: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
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

  const depth = water
    ? clamp01(Number(raw?.depth ?? raw?.oceanDepth ?? raw?.routeSafeDepth ?? 0.48))
    : 0;

  const elevation = solidSurfaceLand
    ? clamp01(Number(raw?.elevation ?? raw?.maxElevation ?? raw?.terrainRelief ?? 0.22))
    : 0;

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
    relief: solidSurfaceLand
      ? clamp01(Number(raw?.terrainRelief ?? raw?.terrainReliefIndex ?? elevation))
      : 0,
    mineral: clamp01(Number(raw?.mineralIndex ?? raw?.diamondSignal ?? raw?.opalSignal ?? 0.32)),
    coast: clamp01(Number(raw?.coastlineIndex ?? raw?.coastalFeather ?? raw?.coastWaterMask ?? (shelf ? 0.65 : 0))),
    turquoise: clamp01(Number(raw?.turquoiseIndex ?? raw?.turquoise ?? raw?.visibleTurquoiseIndex ?? (shelf ? 0.64 : 0.12))),
    mountain: clamp01(Number(raw?.mountainIndex ?? elevation)),
    cliff: clamp01(Number(raw?.coastalCliffIndex ?? raw?.cliff ?? 0)),
    deep: clamp01(Number(raw?.deepOceanBlend ?? raw?.organicDeepOceanPresence ?? raw?.routeSafeDepth ?? depth)),
    fallback: Boolean(raw?.fallback || raw?.fallbackSample || raw?.isFallback),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function getSampler(runtime) {
  if (!runtime || typeof runtime !== "object") return null;

  return (
    runtime.sampleSurface ||
    runtime.sampleAudraliaSurface ||
    runtime.sampleRuntimeState ||
    runtime.sampleAudraliaPlanetState ||
    runtime.sampleAudraliaRuntime ||
    runtime.buildRuntimeField ||
    runtime.default?.sampleSurface ||
    runtime.default?.sampleAudraliaSurface ||
    runtime.default?.sampleRuntimeState ||
    runtime.default?.sampleAudraliaPlanetState ||
    runtime.default?.sampleAudraliaRuntime ||
    runtime.default?.buildRuntimeField ||
    null
  );
}

function sampleRuntime(runtime, lat, lon, u, v) {
  const sampler = getSampler(runtime);

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

function surfaceToColor(sample, normal, lighting) {
  const micro = fbm3(normal.x * 21.5 + 1.7, normal.y * 21.5 - 4.3, normal.z * 21.5 + 8.1, 4);
  const grain = fbm3(normal.x * 56.0 - 3.1, normal.y * 56.0 + 9.2, normal.z * 56.0 - 6.4, 3);

  let color;

  if (sample.ice) {
    color = mixColor(PALETTE.iceShadow, PALETTE.ice, 0.58 + micro * 0.30);
    color = lighten(color, clamp01(sample.elevation * 0.18 + lighting.highlight * 0.1));
  } else if (sample.water) {
    const depth = clamp01(sample.depth);
    const deepBlend = clamp01(sample.deep || depth);
    const shelf = clamp01(sample.turquoise);

    color = mixColor(PALETTE.oceanBlue, PALETTE.oceanAbyss, clamp01(depth * 0.78 + deepBlend * 0.24));
    color = mixColor(color, PALETTE.oceanMid, clamp01(0.16 + micro * 0.10));
    color = mixColor(color, PALETTE.shelf, clamp01(shelf * 0.50));
    color = mixColor(color, PALETTE.shelfBright, clamp01(sample.shelf ? 0.18 + shelf * 0.14 : shelf * 0.06));

    const current = Math.sin(normal.x * 18.0 + normal.z * 9.0 + micro * 4.0) * 0.5 + 0.5;
    color = lighten(color, current * 0.024 + lighting.highlight * 0.035);
  } else {
    const relief = clamp01(sample.relief || sample.elevation);
    const mineral = clamp01(sample.mineral);
    const coast = clamp01(sample.coast);
    const mountain = clamp01(sample.mountain);

    color = mixColor(PALETTE.lowland, PALETTE.upland, clamp01(relief * 0.52 + mineral * 0.14));
    color = mixColor(color, PALETTE.highland, clamp01(mountain * 0.30));
    color = mixColor(color, PALETTE.granite, clamp01(mineral * 0.20 + grain * 0.08));
    color = mixColor(color, PALETTE.slate, clamp01(sample.cliff * 0.18 + (1 - lighting.light) * 0.05));
    color = mixColor(color, PALETTE.mineralGold, clamp01(mineral * 0.16 + relief * 0.06));
    color = mixColor(color, PALETTE.opal, clamp01(coast * 0.16));
    color = mixColor(color, PALETTE.coastFoam, clamp01(coast * 0.14));

    const pitting = (grain - 0.5) * 0.07 + (micro - 0.5) * 0.05;
    color = multiplyColor(color, 1 + pitting);
  }

  const finalShade = clamp(0.42 + lighting.light * 0.72 + lighting.rim * 0.18 - lighting.edge * 0.18, 0.36, 1.20);
  color = multiplyColor(color, finalShade);

  if (lighting.highlight > 0) {
    color = lighten(color, lighting.highlight * 0.09);
  }

  return color;
}

function buildTexture(runtime, width, height, status) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  let waterPixels = 0;
  let landPixels = 0;
  let shelfPixels = 0;
  let icePixels = 0;

  for (let py = 0; py < height; py += 1) {
    const v = height <= 1 ? 0.5 : py / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let px = 0; px < width; px += 1) {
      const u = px / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const point = latLonToVector(lat, lon);
      const sample = sampleRuntime(runtime, lat, lon, u, v);

      const lightVector = { x: -0.42, y: 0.34, z: 0.84 };
      const light = clamp01(point.x * lightVector.x + point.y * lightVector.y + point.z * lightVector.z);
      const rim = clamp01(1 - Math.abs(point.z));
      const highlight = clamp01((point.x * -0.48 + point.y * 0.46 + point.z * 0.74) - 0.72) * 2.2;
      const edge = clamp01(Math.abs(point.y) * 0.04);

      const color = surfaceToColor(sample, point, { light, rim, highlight, edge });
      const index = (py * width + px) * 4;

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = 255;

      if (sample.water) waterPixels += 1;
      if (sample.land || sample.solidSurfaceLand) landPixels += 1;
      if (sample.shelf) shelfPixels += 1;
      if (sample.ice) icePixels += 1;
    }
  }

  ctx.putImageData(image, 0, 0);

  status.textureWidth = width;
  status.textureHeight = height;
  status.texturePixels = width * height;
  status.waterPixels = waterPixels;
  status.landPixels = landPixels;
  status.shelfPixels = shelfPixels;
  status.icePixels = icePixels;
  status.waterRatio = waterPixels / Math.max(1, width * height);
  status.landRatio = landPixels / Math.max(1, width * height);
  status.shelfRatio = shelfPixels / Math.max(1, width * height);
  status.iceRatio = icePixels / Math.max(1, width * height);

  return canvas;
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

function clearOwnedNodes(mount) {
  mount.querySelectorAll("[data-audralia-canvas-authority='true']").forEach((node) => {
    node.remove();
  });
}

function createCanvasShell(mount, config) {
  clearOwnedNodes(mount);

  const shell = document.createElement("section");
  shell.dataset.audraliaCanvasAuthority = "true";
  shell.dataset.audraliaReceipt = RECEIPT;
  shell.dataset.audraliaContract = CONTRACT;
  shell.dataset.audraliaRuntimeExpected = config.runtimeReceipt;
  shell.dataset.publicStatusWriter = "route-only";
  shell.dataset.canvasWritesRouteStatus = "false";
  shell.dataset.routeProofPanel = "false";
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.dataset.audraliaCanvasFrame = "render-only-orthographic-realism-v10";
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.24)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(23, 54, 86, 0.98), rgba(2, 7, 19, 1) 70%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.52), inset 0 0 88px rgba(136, 195, 255, 0.09)";

  const canvas = document.createElement("canvas");
  canvas.dataset.audraliaCanvas = "true";
  canvas.dataset.audraliaContract = CONTRACT;
  canvas.dataset.audraliaReceipt = RECEIPT;
  canvas.setAttribute("aria-label", "Audralia render-only orthographic realism canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.touchAction = "pan-y";
  canvas.style.contain = "layout paint size";

  frame.appendChild(canvas);
  shell.appendChild(frame);

  if (config.visibleCanvasReceipt) {
    const proof = document.createElement("p");
    proof.dataset.audraliaCanvasProof = "true";
    proof.hidden = true;
    proof.setAttribute("aria-hidden", "true");
    proof.textContent = RECEIPT;
    proof.style.display = "none";
    shell.appendChild(proof);
  }

  mount.replaceChildren(shell);

  return { shell, frame, canvas };
}

function setupCanvas(canvas, frame, config) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, config.maxRenderSize);
  const size = clamp(
    Math.floor(Math.min(rect.width || fallback, rect.height || fallback, config.maxRenderSize)),
    config.minRenderSize,
    config.maxRenderSize
  );

  const ratio = clamp(window.devicePixelRatio || 1, 1, 2);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.dataset.pixelRatio = String(ratio);
  canvas.dataset.logicalSize = String(size);

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { ctx, size, ratio };
}

function drawBackground(ctx, size, time) {
  ctx.save();

  const bg = ctx.createRadialGradient(
    size * 0.5,
    size * 0.45,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.72
  );

  bg.addColorStop(0, "rgba(14, 35, 67, 1)");
  bg.addColorStop(0.54, "rgba(4, 12, 30, 1)");
  bg.addColorStop(1, "rgba(1, 5, 16, 1)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 110; index += 1) {
    const x = fract(Math.sin(index * 917.17) * 10000) * size;
    const y = fract(Math.sin(index * 421.91) * 10000) * size;
    const pulse = 0.18 + 0.44 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245, 221, 166, 0.78)" : "rgba(185, 216, 255, 0.66)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.25 : 0.68, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
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

function drawSphere(ctx, texture, size, phase, config) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * config.radiusRatio;
  const stripHeight = Math.max(1, Math.floor(size / 280));
  const sourceHeight = texture.height || 180;

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
    const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.7));

    drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
  }

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const light = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.34,
    radius * 0.03,
    cx + radius * 0.12,
    cy + radius * 0.10,
    radius * 1.16
  );

  light.addColorStop(0, "rgba(255, 255, 255, 0.16)");
  light.addColorStop(0.36, "rgba(255, 255, 255, 0.045)");
  light.addColorStop(0.76, "rgba(0, 0, 0, 0.13)");
  light.addColorStop(1, "rgba(0, 0, 0, 0.58)");

  ctx.fillStyle = light;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.74, cx, cy, radius * 1.04);
  atmosphere.addColorStop(0, "rgba(0, 0, 0, 0)");
  atmosphere.addColorStop(0.72, "rgba(54, 139, 190, 0.06)");
  atmosphere.addColorStop(1, "rgba(125, 211, 255, 0.24)");

  ctx.fillStyle = atmosphere;
  ctx.fillRect(cx - radius * 1.05, cy - radius * 1.05, radius * 2.1, radius * 2.1);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(176, 218, 255, 0.28)";
  ctx.lineWidth = Math.max(1, size * 0.003);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(3, size * 0.008), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(105, 184, 231, 0.12)";
  ctx.lineWidth = Math.max(2, size * 0.006);
  ctx.stroke();

  ctx.restore();
}

function drawLabel(ctx, size) {
  ctx.save();

  ctx.fillStyle = "rgba(244, 226, 178, 0.94)";
  ctx.font = `800 ${Math.max(13, size * 0.028)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AUDRALIA", size / 2, size * 0.842);

  ctx.fillStyle = "rgba(184, 204, 226, 0.74)";
  ctx.font = `650 ${Math.max(9, size * 0.014)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("RENDER-ONLY ORTHOGRAPHIC REALISM V10", size / 2, size * 0.875);

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

function publishStatus(state, extra = {}) {
  const status = {
    loaded: Boolean(state?.canvas),
    receipt: RECEIPT,
    contract: CONTRACT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    version: VERSION,
    routeExpected: state?.config?.routeReceipt || ROUTE_EXPECTED,
    runtimeExpected: state?.config?.runtimeReceipt || RUNTIME_EXPECTED,
    runtimeLoaded: Boolean(state?.runtime),
    runtimeImportAttempted: Boolean(state?.runtimeImportAttempted),
    runtimeImportError: state?.runtimeImportError || "",
    publicStatusWriter: "route-only",
    canvasWritesRouteStatus: false,
    createsRouteProofPanel: false,
    canonicalExport: "mountAudraliaCanvas",
    renderMode: PLANET.renderMode,
    canvasPresent: Boolean(state?.canvas),
    mountPresent: Boolean(state?.mount),
    animated: Boolean(state && !state.stopped),
    frameCount: state?.frameCount || 0,
    textureSource: state?.textureSource || "fail-open",
    textureWidth: state?.textureStats?.textureWidth || null,
    textureHeight: state?.textureStats?.textureHeight || null,
    waterRatio: state?.textureStats?.waterRatio || null,
    landRatio: state?.textureStats?.landRatio || null,
    shelfRatio: state?.textureStats?.shelfRatio || null,
    iceRatio: state?.textureStats?.iceRatio || null,
    pixelProof: state?.pixelProof || null,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    ...extra
  };

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = status;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
    window.AUDRALIA_CANVAS_RECEIPT = RECEIPT;

    try {
      window.dispatchEvent(
        new CustomEvent("audralia:canvas-authority-status", {
          detail: Object.freeze({ ...status })
        })
      );
    } catch (_) {}
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasPublicStatusWriter = "route-only";
    document.documentElement.dataset.audraliaCanvasWritesRouteStatus = "false";
    document.documentElement.dataset.audraliaCanvasCreatesRouteProofPanel = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return status;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;
  const texture = state.texture;

  if (!ctx || !size || !texture) return;

  const phase = wrap01(0.18 + time * state.config.rotationSpeed);

  ctx.clearRect(0, 0, size, size);
  drawBackground(ctx, size, time);
  drawSphere(ctx, texture, size, phase, state.config);
  drawLabel(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 1 || state.frameCount === 4 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

async function importRuntimeForState(state) {
  state.runtimeImportAttempted = true;
  publishStatus(state);

  try {
    const runtime = await import(`${RUNTIME_PATH}?canvas=${CONTRACT}&runtime=${RUNTIME_EXPECTED}&cache=2026-05-07-canvas-v10-runtime-v8`);
    state.runtime = runtime;
    state.runtimeImportError = "";
    state.textureStats = {};
    state.texture = buildTexture(
      runtime,
      state.config.runtimeTextureWidth,
      state.config.runtimeTextureHeight,
      state.textureStats
    );
    state.textureSource = "runtime-v8";
    publishStatus(state);
  } catch (error) {
    state.runtime = null;
    state.runtimeImportError = error instanceof Error ? error.message : String(error);
    state.textureSource = "fail-open-runtime-import-held";
    publishStatus(state);
  }
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

  const config = normalizeConfig(options);
  const mount = resolveMount(target);
  const nodes = createCanvasShell(mount, config);
  const setup = setupCanvas(nodes.canvas, nodes.frame, config);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    ctx: setup.ctx,
    size: setup.size,
    ratio: setup.ratio,
    mount,
    config,
    runtime: null,
    runtimeImportAttempted: false,
    runtimeImportError: "",
    texture: null,
    textureStats: {},
    textureSource: "fail-open",
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    resizeTimer: 0,
    lastFrameTime: 0,
    frameInterval: 1000 / config.frameRateTarget
  };

  state.texture = buildTexture(
    null,
    config.firstPaintTextureWidth,
    config.firstPaintTextureHeight,
    state.textureStats
  );

  function animate(frameTime) {
    if (state.stopped) return;

    if (!state.lastFrameTime || frameTime - state.lastFrameTime >= state.frameInterval) {
      renderFrame(state, frameTime || performance.now());
      state.lastFrameTime = frameTime;
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame, config);
      state.ctx = next.ctx;
      state.size = next.size;
      state.ratio = next.ratio;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 140);
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

  publishStatus(state);
  renderFrame(state, performance.now());
  state.rafId = window.requestAnimationFrame(animate);

  window.setTimeout(() => {
    importRuntimeForState(state);
  }, 40);

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
  return window.__AUDRALIA_CANVAS_STATUS__ || {
    loaded: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    version: VERSION,
    routeExpected: ROUTE_EXPECTED,
    runtimeExpected: RUNTIME_EXPECTED,
    publicStatusWriter: "route-only",
    canvasWritesRouteStatus: false,
    createsRouteProofPanel: false,
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

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

const api = Object.freeze({
  RECEIPT,
  CONTRACT,
  COMPATIBILITY_CONTRACT,
  ROUTE_EXPECTED,
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

  publishStatus(null, {
    loaded: false,
    moduleLoaded: true,
    canonicalExport: "mountAudraliaCanvas"
  });
}

export default api;
