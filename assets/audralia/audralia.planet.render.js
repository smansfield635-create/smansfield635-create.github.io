// /assets/audralia/audralia.planet.render.js
// AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR_TNT_v1
// Role: Audralia Generation 1 parent renderer.
// Scope: parent compositor consuming first downstream child terrain.
// Owns: visible Audralia globe composition.
// Consumes: ./audralia.terrain.render.js
// Does not own: route shell, Earth, hydration, climate, ecology, fauna, runtime, visual pass claim.

import {
  createTerrainProfile,
  sampleTerrain,
  buildTerrainField,
  getTerrainStatus
} from "./audralia.terrain.render.js";

const RECEIPT = "AUDRALIA_G1_PARENT_TERRAIN_ACTIVE_COMPOSITOR_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const FILE = "/assets/audralia/audralia.planet.render.js";
const TERRAIN_CHILD_PATH = "/assets/audralia/audralia.terrain.render.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function blend(a, b, t) {
  return [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t)
  ];
}

function toRgb(rgb) {
  return `rgb(${Math.round(clamp(rgb[0], 0, 255))}, ${Math.round(clamp(rgb[1], 0, 255))}, ${Math.round(clamp(rgb[2], 0, 255))})`;
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function getTerrainContext(context = {}) {
  return Object.freeze({
    coherenceIndex: Number.isFinite(Number(context.coherenceIndex))
      ? clamp(Number(context.coherenceIndex), 0, 1)
      : 0.92,
    collaborativeExpression: Number.isFinite(Number(context.collaborativeExpression))
      ? clamp(Number(context.collaborativeExpression), 0, 1)
      : 0.88
  });
}

function colorFromTerrain(terrain) {
  const influence = terrain.terrainColorInfluence || {};

  if (!terrain.isLand) {
    const oceanDepth = clamp(Math.abs(terrain.normalizedElevation || 0), 0, 1);
    const shelf = clamp(terrain.shelfPermission || influence.shelf || 0, 0, 1);
    const coast = clamp(terrain.coastPressure || influence.coast || 0, 0, 1);

    let color = blend([7, 24, 70], [18, 92, 142], 1 - oceanDepth);

    if (shelf > 0.22) {
      color = blend(color, [47, 150, 176], shelf * 0.56);
    }

    if (coast > 0.42) {
      color = blend(color, [73, 180, 184], coast * 0.38);
    }

    return color;
  }

  const elevation = clamp(terrain.normalizedElevation || 0, 0, 1);
  const ridge = clamp(terrain.ridge || 0, 0, 1);
  const basin = clamp(terrain.basin || 0, 0, 1);
  const dry = clamp(terrain.dryInteriorPressure || 0, 0, 1);
  const polar = clamp(terrain.polarSeat || 0, 0, 1);
  const summit = clamp(terrain.summitExpressionWeight || 0, 0, 1);
  const coast = clamp(terrain.coastPressure || 0, 0, 1);

  let color = [92, 126, 78];

  if (dry > 0.18) {
    color = blend(color, [168, 123, 72], dry * 0.72);
  }

  if (basin > 0.28) {
    color = blend(color, [52, 112, 72], basin * 0.44);
  }

  if (ridge > 0.2) {
    color = blend(color, [132, 126, 112], ridge * 0.64);
  }

  if (elevation > 0.52) {
    color = blend(color, [150, 145, 132], (elevation - 0.52) * 0.72);
  }

  if (summit > 0.68) {
    color = blend(color, [142, 156, 104], (summit - 0.68) * 0.26);
  }

  if (coast > 0.55) {
    color = blend(color, [118, 138, 98], coast * 0.16);
  }

  if (polar > 0.26) {
    color = blend(color, [218, 232, 238], polar * 0.82);
  }

  return color;
}

function applyLighting(rgb, nx, ny, nz, terrain) {
  const lightX = -0.38;
  const lightY = -0.24;
  const lightZ = 0.9;

  const dot = clamp(nx * lightX + ny * lightY + nz * lightZ, 0, 1);
  const limb = clamp(nz, 0, 1);
  const atmosphere = clamp(1 - limb, 0, 1);
  const ridge = terrain && terrain.isLand ? clamp(terrain.ridge || 0, 0, 1) : 0;
  const waterBoost = terrain && terrain.isWater ? 0.04 : 0;

  let shade = 0.36 + dot * 0.74 + waterBoost - ridge * 0.035;
  let color = [
    rgb[0] * shade,
    rgb[1] * shade,
    rgb[2] * shade
  ];

  if (atmosphere > 0.58) {
    color = blend(color, [92, 172, 232], (atmosphere - 0.58) * 0.34);
  }

  return color;
}

export function createProfile(options = {}) {
  const terrainStatus = getTerrainStatus();
  const terrainProfile = createTerrainProfile({
    parentAuthority: FILE,
    coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
    collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
  });

  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    generationClaimed: true,
    file: FILE,
    role: "audralia-g1-parent-terrain-active-compositor",
    authority: FILE,

    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: Object.freeze(["terrain"]),
    activeDownstreamPaths: Object.freeze([TERRAIN_CHILD_PATH]),

    terrainChildActive: true,
    terrainChildPath: TERRAIN_CHILD_PATH,
    terrainStatus,
    terrainProfile,

    radius: options.radius || 0.34,
    pixelStep: options.pixelStep || 2,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function buildTexture(profile = createProfile(), options = {}) {
  const terrainField = buildTerrainField(
    options.terrainWidth || 128,
    options.terrainHeight || 128,
    {
      coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
      collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88
    }
  );

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    profile,
    terrainField,

    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: Object.freeze(["terrain"]),
    activeDownstreamPaths: Object.freeze([TERRAIN_CHILD_PATH]),
    terrainChildActive: true,
    terrainChildPath: TERRAIN_CHILD_PATH,

    width: options.width || 512,
    height: options.height || 256,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function sampleSurface(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const terrainContext = getTerrainContext(context);
  const terrain = sampleTerrain(point.u, point.v, terrainContext);

  const color = colorFromTerrain(terrain);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    terrain,

    isLand: terrain.isLand === true,
    isWater: terrain.isWater === true,

    landBodyCount: terrain.landBodyCount,
    landBodyId: terrain.landBodyId,
    landBodyKey: terrain.landBodyKey,
    landBodyName: terrain.landBodyName,

    summitRegionId: terrain.summitRegionId,
    summitRegionKey: terrain.summitRegionKey,
    summitRegionName: terrain.summitRegionName,
    coherenceThreshold: terrain.coherenceThreshold,
    summitAccessStrength: terrain.summitAccessStrength,
    summitExpressionWeight: terrain.summitExpressionWeight,

    elevation: terrain.normalizedElevation,
    elevationMeters: terrain.elevationMeters,
    oceanDepth: terrain.isWater ? Math.abs(terrain.normalizedElevation || 0) : 0,
    ridge: terrain.ridge,
    basin: terrain.basin,
    slope: terrain.slope,
    coastPressure: terrain.coastPressure,
    shelfPermission: terrain.shelfPermission,
    dryInteriorPressure: terrain.dryInteriorPressure,
    polarSeat: terrain.polarSeat,
    horizontalMainlandContinuity: terrain.horizontalMainlandContinuity,

    renderColor: color,

    terrainChildActive: true,
    terrainChildPath: TERRAIN_CHILD_PATH,
    parentConsumesTerrain: true,
    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: Object.freeze(["terrain"]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function renderSurface(canvas, options = {}) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("AUDRALIA_G1_TERRAIN_ACTIVE_CANVAS_REQUIRED");
  }

  const profile = options.profile || createProfile(options);
  const texture = options.texture || buildTexture(profile, options);
  const ctx = canvas.getContext("2d", { alpha: true });

  const width = canvas.width || 1024;
  const height = canvas.height || 1024;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (profile.radius || 0.34);
  const pixelStep = Math.max(1, Math.min(3, Math.floor(options.pixelStep || profile.pixelStep || 2)));

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py += pixelStep) {
    for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px += pixelStep) {
      const nx = (px - cx) / radius;
      const ny = (py - cy) / radius;
      const d2 = nx * nx + ny * ny;

      if (d2 > 1) continue;

      const nz = Math.sqrt(1 - d2);
      const longitudeShift = Number.isFinite(options.longitudeShift) ? options.longitudeShift : 0.09;
      const u = ((0.5 + Math.atan2(nx, nz) / (Math.PI * 2) + longitudeShift) % 1 + 1) % 1;
      const v = clamp(0.5 + Math.asin(ny) / Math.PI, 0, 1);

      const surface = sampleSurface(u, v, {
        coherenceIndex: Number.isFinite(Number(options.coherenceIndex)) ? options.coherenceIndex : 0.92,
        collaborativeExpression: Number.isFinite(Number(options.collaborativeExpression)) ? options.collaborativeExpression : 0.88,
        profile,
        texture
      });

      const litColor = applyLighting(surface.renderColor, nx, ny, nz, surface.terrain);

      ctx.fillStyle = toRgb(litColor);
      ctx.fillRect(px, py, pixelStep + 0.35, pixelStep + 0.35);
    }
  }

  const atmosphere = ctx.createRadialGradient(
    cx - radius * 0.2,
    cy - radius * 0.26,
    radius * 0.12,
    cx,
    cy,
    radius * 1.08
  );

  atmosphere.addColorStop(0, "rgba(255,255,255,0.08)");
  atmosphere.addColorStop(0.68, "rgba(82,162,220,0.06)");
  atmosphere.addColorStop(1, "rgba(102,184,238,0.34)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.018, 0, Math.PI * 2);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  ctx.lineWidth = Math.max(2, Math.round(radius * 0.011));
  ctx.strokeStyle = "rgba(185,220,244,0.42)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(245,248,255,0.96)";
  ctx.font = "700 34px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Audralia", cx, height - Math.max(42, radius * 0.12));

  return Object.freeze({
    receipt: RECEIPT,
    rendered: true,
    method: "renderSurface",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    terrainChildActive: true,
    terrainChildPath: TERRAIN_CHILD_PATH,
    parentConsumesTerrain: true,
    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: Object.freeze(["terrain"]),
    activeDownstreamPaths: Object.freeze([TERRAIN_CHILD_PATH]),

    terrainStats: texture && texture.terrainField ? texture.terrainField.stats : null,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export function render(canvas, options = {}) {
  return renderSurface(canvas, options);
}

export function renderPlanet(canvas, options = {}) {
  return renderSurface(canvas, options);
}

export function getStatus() {
  const terrainStatus = getTerrainStatus();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g1-parent-terrain-active-compositor",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    generationClaimed: true,
    file: FILE,
    role: "parent-terrain-active-compositor",
    authority: FILE,

    groundZeroParentOnly: false,
    downstreamChildrenActive: true,
    activeDownstreamChildren: Object.freeze(["terrain"]),
    activeDownstreamPaths: Object.freeze([TERRAIN_CHILD_PATH]),

    terrainChildActive: true,
    terrainChildPath: TERRAIN_CHILD_PATH,
    parentConsumesTerrain: true,
    terrainStatus,

    exports: Object.freeze([
      "createProfile",
      "buildTexture",
      "sampleSurface",
      "renderSurface",
      "render",
      "renderPlanet",
      "getStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  render,
  renderPlanet,
  getStatus
});
