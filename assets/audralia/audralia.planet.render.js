// /assets/audralia/audralia.planet.render.js
// AUDRALIA_G1_DRY_TERRAFORM_PARENT_RENDER_TNT_v1
// Role: Audralia parent renderer.
// Generation ladder correction:
// G1 = dry terraform land-only baseline.
// G2 = land + water.
// G3 = land + water + trees/foliage.
// G4 = land + water + trees/foliage + animals.
// This parent consumes terrain only for G1.
// Hydration and climate may exist as child files but are not consumed by this G1 visual parent.

import {
  getTerrainStatus,
  sampleTerrain
} from "/assets/audralia/audralia.terrain.render.js";

const RECEIPT = "AUDRALIA_G1_DRY_TERRAFORM_PARENT_RENDER_TNT_v1";
const FILE = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_PATH = "/assets/audralia/audralia.terrain.render.js";
const HYDRATION_PATH = "/assets/audralia/audralia.hydration.render.js";
const CLIMATE_PATH = "/assets/audralia/audralia.climate.render.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function noise2(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return a + (b - a) * ux + (c - a) * uy + (d - b - c + a) * ux * uy;
}

function fbm(x, y) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;

  for (let i = 0; i < 5; i += 1) {
    value += amp * noise2(x * freq, y * freq);
    freq *= 2.05;
    amp *= 0.52;
  }

  return value;
}

function createProfile(options = {}) {
  const terrainStatus = safeTerrainStatus();

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: "Audralia",
    publicName: "Audralia",
    generation: "G1",
    generationStatus: "AUDRALIA_G1_DRY_TERRAFORM_LAND_ONLY",
    generationClaimed: true,
    targetStandard: "AUDRALIA_G1_DRY_TERRAFORM_BASELINE",
    file: FILE,
    role: "audralia-g1-dry-terraform-parent-renderer",
    authority: FILE,

    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: ["terrain"],
    activeDownstreamPaths: [TERRAIN_PATH],

    terrainChildActive: true,
    terrainChildPath: TERRAIN_PATH,
    parentConsumesTerrain: true,
    terrainStatus,

    hydrationChildBuilt: true,
    hydrationChildPath: HYDRATION_PATH,
    hydrationChildActive: false,
    parentConsumesHydration: false,

    climateChildBuilt: true,
    climateChildPath: CLIMATE_PATH,
    climateChildActive: false,
    parentConsumesClimate: false,

    g1DryTerraformLandOnly: true,
    visualWaterActive: false,
    oceansActive: false,
    riversActive: false,
    foliageActive: false,
    faunaActive: false,
    ecologyActive: false,
    livingWorldRuntimeActive: false,

    g2Ready: false,
    g3Ready: false,
    g4Ready: false,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false,
    route: options.route || "/showroom/globe/"
  });
}

function buildTexture(profile = createProfile()) {
  return Object.freeze({
    receipt: RECEIPT,
    type: "audralia-g1-dry-terraform-texture",
    profile,
    terrainChildPath: TERRAIN_PATH,
    hydrationConsumed: false,
    climateConsumed: false,
    visualWaterActive: false
  });
}

function safeTerrainStatus() {
  try {
    return getTerrainStatus();
  } catch (error) {
    return Object.freeze({
      ok: false,
      status: "terrain-status-unavailable",
      error: String(error && error.message ? error.message : error),
      file: TERRAIN_PATH
    });
  }
}

function safeTerrainSample(lon, lat) {
  try {
    const direct = sampleTerrain(lon, lat, {
      generation: "G1",
      mode: "dry-terraform",
      parent: FILE
    });

    if (direct && typeof direct === "object") return direct;
  } catch (_) {}

  try {
    const objectCall = sampleTerrain({
      lon,
      lat,
      generation: "G1",
      mode: "dry-terraform",
      parent: FILE
    });

    if (objectCall && typeof objectCall === "object") return objectCall;
  } catch (_) {}

  return null;
}

function primaryMainlandMask(lon, lat) {
  const wave = 0.1 * Math.sin(lon * Math.PI * 1.8) + 0.04 * Math.sin(lon * Math.PI * 5.4);
  const belt = 1 - smoothstep(0.18, 0.42, Math.abs(lat - wave));
  const taper = smoothstep(-0.98, -0.72, lon) * (1 - smoothstep(0.72, 0.98, lon));
  return clamp(belt * taper, 0, 1);
}

function landmassMask(lon, lat, cx, cy, rx, ry, warp = 0) {
  const wx = lon - cx + Math.sin(lat * 8 + warp) * 0.04;
  const wy = lat - cy + Math.sin(lon * 7 - warp) * 0.035;
  const d = (wx * wx) / (rx * rx) + (wy * wy) / (ry * ry);
  return 1 - smoothstep(0.76, 1.12, d);
}

function polarMask(lat, north = true) {
  const center = north ? 0.84 : -0.84;
  return 1 - smoothstep(0.08, 0.25, Math.abs(lat - center));
}

function computeLandMask(lon, lat) {
  const primary = primaryMainlandMask(lon, lat);

  const secondary =
    landmassMask(lon, lat, 0.62, 0.42, 0.26, 0.24, 1.1) * 0.92 +
    landmassMask(lon, lat, -0.66, 0.42, 0.28, 0.23, 2.7) * 0.9 +
    landmassMask(lon, lat, 0.54, -0.44, 0.28, 0.22, 4.1) * 0.92 +
    landmassMask(lon, lat, -0.58, -0.42, 0.25, 0.22, 5.4) * 0.84;

  const poles =
    polarMask(lat, true) * (0.82 + 0.12 * Math.sin(lon * 10)) +
    polarMask(lat, false) * (0.82 + 0.12 * Math.cos(lon * 9));

  const rough = fbm(lon * 4.2 + 8, lat * 4.2 - 2) * 0.22;
  return clamp(Math.max(primary, secondary, poles) + rough - 0.08, 0, 1);
}

function computeElevation(lon, lat, landMask) {
  const ridges =
    0.45 * fbm(lon * 7.0 + 11, lat * 6.2 - 5) +
    0.28 * fbm(lon * 14.5 - 3, lat * 12.0 + 19) +
    0.2 * Math.abs(Math.sin((lon * 2.3 + lat * 1.7) * Math.PI));

  const eastWestSpine = primaryMainlandMask(lon, lat) * (0.28 + 0.18 * Math.sin(lon * Math.PI * 3.0));
  const summitPressure = summitField(lon, lat) * 0.42;

  return clamp((0.18 + ridges + eastWestSpine + summitPressure) * landMask, 0, 1);
}

function summitField(lon, lat) {
  const anchors = [
    [-0.12, 0.02, 0.18],
    [0.16, 0.04, 0.2],
    [-0.52, 0.18, 0.23],
    [0.52, 0.16, 0.21],
    [-0.42, -0.18, 0.22],
    [0.42, -0.2, 0.19],
    [0.72, 0.48, 0.16],
    [-0.72, 0.5, 0.16],
    [0.02, -0.62, 0.2]
  ];

  let total = 0;

  for (const [x, y, radius] of anchors) {
    const dx = lon - x;
    const dy = lat - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    total = Math.max(total, 1 - smoothstep(radius * 0.25, radius, d));
  }

  return clamp(total, 0, 1);
}

function sampleSurface(lon = 0, lat = 0, options = {}) {
  const x = clamp(Number(lon) || 0, -1, 1);
  const y = clamp(Number(lat) || 0, -1, 1);

  const child = safeTerrainSample(x, y);

  const landMask = computeLandMask(x, y);
  const elevation = computeElevation(x, y, landMask);

  let landBodyId = child?.landBodyId || child?.bodyId || null;
  let summitRegionId = child?.summitRegionId || child?.regionId || null;

  return Object.freeze({
    receipt: RECEIPT,
    body: "Audralia",
    generation: "G1",
    generationStatus: "AUDRALIA_G1_DRY_TERRAFORM_LAND_ONLY",
    lon: x,
    lat: y,
    landMask,
    elevation,
    isLand: landMask > 0.18,
    isWater: false,
    water: 0,
    hydration: 0,
    ocean: 0,
    river: 0,
    foliage: 0,
    fauna: 0,
    landBodyId,
    summitRegionId,
    terrainChildUsed: Boolean(child),
    terrainChildPath: TERRAIN_PATH,
    visualWaterActive: false
  });
}

function chooseDryTerrainColor(sample, light) {
  const e = sample.elevation;
  const n = fbm(sample.lon * 18 + 3, sample.lat * 18 - 9);

  let r;
  let g;
  let b;

  if (e > 0.78) {
    r = 185;
    g = 175;
    b = 152;
  } else if (e > 0.58) {
    r = 145;
    g = 126;
    b = 92;
  } else if (e > 0.38) {
    r = 122;
    g = 112;
    b = 76;
  } else if (sample.landMask > 0.42) {
    r = 128;
    g = 122;
    b = 82;
  } else {
    r = 98;
    g = 94;
    b = 72;
  }

  const variation = (n - 0.5) * 34;
  const summit = summitField(sample.lon, sample.lat) * 28;
  const shade = clamp(light, 0.15, 1.08);

  return [
    clamp(Math.round((r + variation + summit) * shade), 0, 255),
    clamp(Math.round((g + variation * 0.75 + summit * 0.75) * shade), 0, 255),
    clamp(Math.round((b + variation * 0.45 + summit * 0.5) * shade), 0, 255)
  ];
}

function renderSurface(canvas, options = {}) {
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  const w = canvas.width || 1024;
  const h = canvas.height || 1024;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.38;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.45);
  bg.addColorStop(0, "rgba(40,54,76,0.08)");
  bg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const image = ctx.createImageData(w, h);
  const data = image.data;

  for (let py = 0; py < h; py += 1) {
    const dy = (py - cy) / r;

    for (let px = 0; px < w; px += 1) {
      const dx = (px - cx) / r;
      const d2 = dx * dx + dy * dy;
      const i = (py * w + px) * 4;

      if (d2 > 1) {
        data[i + 3] = 0;
        continue;
      }

      const z = Math.sqrt(1 - d2);
      const lon = clamp(dx / Math.max(0.22, z + 0.28), -1, 1);
      const lat = clamp(dy, -1, 1);

      const sample = sampleSurface(lon, lat, options);
      const light = clamp(0.35 + 0.68 * (z * 0.82 + -dx * 0.18 + -dy * 0.1), 0.16, 1.08);

      const [rr, gg, bb] = chooseDryTerrainColor(sample, light);

      const atmosphere = smoothstep(0.82, 1.0, Math.sqrt(d2));
      data[i] = clamp(Math.round(rr + atmosphere * 24), 0, 255);
      data[i + 1] = clamp(Math.round(gg + atmosphere * 38), 0, 255);
      data[i + 2] = clamp(Math.round(bb + atmosphere * 56), 0, 255);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  drawDryReliefOverlay(ctx, cx, cy, r);
  drawPlanetRim(ctx, cx, cy, r);
  drawDryGenerationStamp(ctx, cx, cy, r);

  return Object.freeze({
    rendered: true,
    method: "renderSurface",
    receipt: RECEIPT,
    body: "Audralia",
    generation: "G1",
    generationStatus: "AUDRALIA_G1_DRY_TERRAFORM_LAND_ONLY",
    targetStandard: "AUDRALIA_G1_DRY_TERRAFORM_BASELINE",
    terrainChildActive: true,
    parentConsumesTerrain: true,
    parentConsumesHydration: false,
    parentConsumesClimate: false,
    visualWaterActive: false,
    oceansActive: false,
    riversActive: false,
    foliageActive: false,
    faunaActive: false,
    visualPassClaimed: false
  });
}

function drawDryReliefOverlay(ctx, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  for (let i = 0; i < 90; i += 1) {
    const lon = -0.95 + (i / 89) * 1.9;
    const lat = 0.1 * Math.sin(i * 0.5) + 0.05 * Math.sin(i * 1.9);
    const x = cx + lon * r * 0.82;
    const y = cy + lat * r * 0.62;
    const z = Math.sqrt(Math.max(0, 1 - lon * lon * 0.62 - lat * lat * 0.62));

    if (z <= 0.05) continue;

    ctx.strokeStyle = `rgba(238,220,176,${0.035 + z * 0.05})`;
    ctx.lineWidth = Math.max(1, r * 0.004 * z);
    ctx.beginPath();
    ctx.moveTo(x - r * 0.035 * z, y);
    ctx.lineTo(x + r * 0.04 * z, y + r * 0.01 * Math.sin(i));
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetRim(ctx, cx, cy, r) {
  const shade = ctx.createRadialGradient(
    cx - r * 0.35,
    cy - r * 0.35,
    r * 0.2,
    cx + r * 0.18,
    cy + r * 0.1,
    r * 1.22
  );
  shade.addColorStop(0, "rgba(255,255,255,0.16)");
  shade.addColorStop(0.5, "rgba(255,255,255,0.02)");
  shade.addColorStop(0.82, "rgba(0,0,0,0.16)");
  shade.addColorStop(1, "rgba(0,0,0,0.54)");

  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = Math.max(2, r * 0.012);
  ctx.strokeStyle = "rgba(156, 204, 228, 0.46)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(1, r * 0.006);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.985, 0, Math.PI * 2);
  ctx.stroke();
}

function drawDryGenerationStamp(ctx, cx, cy, r) {
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.textAlign = "center";
  ctx.font = `700 ${Math.round(r * 0.045)}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("G1 DRY TERRAFORM", cx, cy + r * 0.72);
}

function render(canvas, options = {}) {
  return renderSurface(canvas, options);
}

function renderPlanet(canvas, options = {}) {
  return renderSurface(canvas, options);
}

function getStatus() {
  const terrainStatus = safeTerrainStatus();

  return Object.freeze({
    statusAvailable: true,
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g1-dry-terraform-parent-renderer",
    planetaryObject: "Audralia",
    publicName: "Audralia",
    generation: "G1",
    generationStatus: "AUDRALIA_G1_DRY_TERRAFORM_LAND_ONLY",
    generationClaimed: true,
    targetStandard: "AUDRALIA_G1_DRY_TERRAFORM_BASELINE",
    file: FILE,
    role: "audralia-g1-dry-terraform-parent-renderer",
    authority: FILE,

    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: ["terrain"],
    activeDownstreamPaths: [TERRAIN_PATH],

    terrainChildActive: true,
    terrainChildPath: TERRAIN_PATH,
    parentConsumesTerrain: true,
    terrainStatus,

    hydrationChildBuilt: true,
    hydrationChildPath: HYDRATION_PATH,
    hydrationChildActive: false,
    parentConsumesHydration: false,

    climateChildBuilt: true,
    climateChildPath: CLIMATE_PATH,
    climateChildActive: false,
    parentConsumesClimate: false,

    g1DryTerraformLandOnly: true,
    visualWaterActive: false,
    oceansActive: false,
    riversActive: false,
    foliageActive: false,
    ecologyActive: false,
    faunaActive: false,
    livingWorldRuntimeActive: false,

    g2Ready: false,
    g3Ready: false,
    g4Ready: false,

    exports: [
      "createProfile",
      "buildTexture",
      "sampleSurface",
      "renderSurface",
      "render",
      "renderPlanet",
      "getStatus"
    ],
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

const api = Object.freeze({
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  render,
  renderPlanet,
  getStatus
});

export {
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  render,
  renderPlanet,
  getStatus
};

export default api;
