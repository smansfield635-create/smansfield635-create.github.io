// /assets/AdreliaPlanetRendered.js
// AUDRALIA_G1_PARENT_COMPOSITOR_VISUAL_BALANCE_TNT_v2
// Role: Audralia parent planet render authority.
// Owns: body identity, downstream imports, composition order, final render API, visual compositor balance.
// Does not own: route shell, HTML, Earth, Sun, Moon, Gauges, Products, image generation, GraphicBox.

import {
  createLivingWorldProfile,
  createLivingWorldState,
  buildLivingWorldFields,
  sampleLivingWorld,
  getLivingWorldStatus
} from "/assets/audralia.planet.render-living-world.js";

const RECEIPT = "AUDRALIA_G1_PARENT_COMPOSITOR_VISUAL_BALANCE_TNT_v2";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const FILE = "/assets/AdreliaPlanetRendered.js";

const CHILD_PATHS = Object.freeze({
  topography: "/assets/audralia.planet.render-topography.js",
  hydration: "/assets/audralia.planet.render-hydration.js",
  climate: "/assets/audralia.planet.render-climate.js",
  ecology: "/assets/audralia.planet.render-ecology.js",
  fauna: "/assets/audralia.planet.render-fauna.js",
  livingWorld: "/assets/audralia.planet.render-living-world.js",
  runtimeBridge: "/assets/audralia.living-world.runtime.js"
});

let cachedTexture = null;

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

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function normalizeInput(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function createDefaultState(profile, options = {}) {
  return createLivingWorldState({
    profile,
    elapsedHours: normalizeInput(options.elapsedHours, 64)
  });
}

function getSafeFields(profile, options = {}) {
  const fieldSize = Math.max(64, Math.min(144, Math.floor(options.fieldSize || 112)));

  return buildLivingWorldFields({
    width: fieldSize,
    height: fieldSize,
    profile
  });
}

function getIceSignal(surface) {
  const topography = surface.topography || {};
  const hydration = surface.hydration || {};
  const climate = surface.climate || {};
  const lat = Math.abs(Number(topography.lat) || 0);
  const elevation = Number(topography.elevationMeters) || 0;
  const temperature = Number(climate.temperatureC) || 18;

  const polarGate = smoothstep(0.76, 0.96, lat);
  const highMountainGate = smoothstep(5000, 8200, elevation);
  const coldGate = 1 - smoothstep(-10, 8, temperature);
  const glacierGate = clamp(hydration.glacierPermission || 0, 0, 1);

  return clamp(
    polarGate * 0.78 +
      highMountainGate * coldGate * 0.72 +
      glacierGate * polarGate * 0.32,
    0,
    1
  );
}

function getLandColor(surface) {
  const topography = surface.topography || {};
  const climate = surface.climate || {};
  const ecology = surface.ecology || {};
  const hydration = surface.hydration || {};

  const vegetation = clamp(ecology.vegetationDensity || 0, 0, 1);
  const canopy = clamp(ecology.canopyPotential || 0, 0, 1);
  const grass = clamp(ecology.grasslandPotential || 0, 0, 1);
  const wetland = clamp(ecology.wetlandPotential || 0, 0, 1);
  const aridity = clamp(climate.aridity || 0, 0, 1);
  const mountain = clamp(topography.mountainPermission || 0, 0, 1);
  const slope = clamp(topography.slope || 0, 0, 1);
  const coastal = clamp(hydration.coastalPermission || 0, 0, 1);

  let color = [112, 102, 76];

  if (aridity > 0.45) {
    color = blend(color, [174, 130, 70], (aridity - 0.45) * 1.05);
  }

  if (grass > 0.22) {
    color = blend(color, [86, 139, 73], grass * 0.82);
  }

  if (vegetation > 0.28) {
    color = blend(color, [54, 124, 74], vegetation * 0.88);
  }

  if (canopy > 0.38) {
    color = blend(color, [32, 88, 58], canopy * 0.82);
  }

  if (wetland > 0.36) {
    color = blend(color, [46, 118, 94], wetland * 0.72);
  }

  if (coastal > 0.44) {
    color = blend(color, [92, 126, 94], coastal * 0.34);
  }

  if (mountain > 0.42) {
    color = blend(color, [126, 118, 103], mountain * 0.62);
  }

  if (slope > 0.64) {
    color = blend(color, [104, 96, 88], (slope - 0.64) * 0.7);
  }

  return color;
}

function getWaterColor(surface) {
  const hydration = surface.hydration || {};
  const fauna = surface.fauna || {};
  const climate = surface.climate || {};

  const depth = clamp(hydration.normalizedDepth || 0, 0, 1);
  const shelf = clamp(hydration.shelfWaterPermission || 0, 0, 1);
  const coast = clamp(hydration.coastalPermission || 0, 0, 1);
  const humidity = clamp(climate.humidity || 0, 0, 1);
  const marine = clamp(fauna.guildScores && fauna.guildScores.marine_guild ? fauna.guildScores.marine_guild : 0, 0, 1);

  let color = blend([18, 92, 152], [7, 28, 74], depth);

  if (shelf > 0.24) {
    color = blend(color, [43, 152, 178], shelf * 0.8);
  }

  if (coast > 0.5) {
    color = blend(color, [74, 174, 182], coast * 0.42);
  }

  if (marine > 0.42) {
    color = blend(color, [64, 180, 174], marine * 0.28);
  }

  if (humidity > 0.74) {
    color = blend(color, [52, 126, 166], (humidity - 0.74) * 0.24);
  }

  return color;
}

function classifySurfaceColor(surface) {
  const hydration = surface.hydration || {};
  const ice = getIceSignal(surface);

  if (hydration.isOcean) {
    let color = getWaterColor(surface);

    if (ice > 0.42) {
      color = blend(color, [205, 224, 232], (ice - 0.42) * 0.72);
    }

    return color;
  }

  let color = getLandColor(surface);

  if (ice > 0.34) {
    color = blend(color, [224, 236, 240], (ice - 0.34) * 0.78);
  }

  return color;
}

function applyLighting(rgb, normalX, normalY, normalZ, surface) {
  const climate = surface.climate || {};
  const activity = surface.activity || {};
  const topography = surface.topography || {};
  const hydration = surface.hydration || {};

  const lightX = -0.38;
  const lightY = -0.24;
  const lightZ = 0.9;

  const dot = clamp(normalX * lightX + normalY * lightY + normalZ * lightZ, 0, 1);
  const limb = clamp(normalZ, 0, 1);
  const atmosphere = clamp(1 - limb, 0, 1);

  let shade = 0.42 + dot * 0.66;
  shade -= clamp(topography.slope || 0, 0, 1) * 0.05;
  shade += hydration.isOcean ? 0.04 : 0;
  shade += clamp(activity.daylight || 0, 0, 1) * 0.03;

  let color = [
    rgb[0] * shade,
    rgb[1] * shade,
    rgb[2] * shade
  ];

  if ((climate.stormPermission || 0) > 0.62) {
    color = blend(color, [156, 166, 176], (climate.stormPermission - 0.62) * 0.22);
  }

  if (atmosphere > 0.62) {
    color = blend(color, [88, 162, 210], (atmosphere - 0.62) * 0.24);
  }

  return color;
}

export function createProfile(options = {}) {
  const livingWorldProfile = createLivingWorldProfile({
    lattice: options.lattice || 112
  });

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: options.generation || GENERATION,
    body: options.body || PLANETARY_OBJECT,
    file: FILE,
    role: "parent-planet-render-compositor",
    parentAuthority: FILE,
    downstreamChildren: CHILD_PATHS,
    livingWorldProfile,
    radius: options.radius || 0.33,
    fieldSize: options.fieldSize || 112,
    pixelStep: options.pixelStep || 2,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function buildTexture(profile = createProfile(), options = {}) {
  const textureProfile = profile && profile.livingWorldProfile
    ? profile.livingWorldProfile
    : createLivingWorldProfile({ lattice: options.fieldSize || 112 });

  const state = options.state || createDefaultState(textureProfile, options);
  const fields = options.fields || getSafeFields(textureProfile, {
    fieldSize: options.fieldSize || profile.fieldSize || 112
  });

  const texture = Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: FILE,
    width: options.width || 512,
    height: options.height || 256,
    profile,
    livingWorldProfile: textureProfile,
    state,
    fields,
    downstreamChildren: CHILD_PATHS,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  cachedTexture = texture;
  return texture;
}

export function sampleSurface(uInput, vInput, context = {}) {
  const u = ((normalizeInput(uInput, 0.5) % 1) + 1) % 1;
  const v = clamp(normalizeInput(vInput, 0.5), 0, 1);

  const profile = context.profile || createProfile();
  const texture = context.texture || cachedTexture || buildTexture(profile);
  const state = context.state || texture.state;
  const fields = context.fields || texture.fields;

  const sample = sampleLivingWorld(u, v, {
    profile: texture.livingWorldProfile,
    state,
    topographyField: fields.topographyField,
    hydrationField: fields.hydrationField,
    climateField: fields.climateField,
    ecologyField: fields.ecologyField,
    faunaField: fields.faunaField
  });

  return Object.freeze({
    ...sample,
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: FILE,
    downstreamChildren: CHILD_PATHS,
    renderColor: classifySurfaceColor(sample),
    iceSignal: getIceSignal(sample),
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function renderSurface(canvas, options = {}) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("AUDRALIA_RENDER_CANVAS_REQUIRED");
  }

  const profile = options.profile || createProfile(options);
  const texture = options.texture || cachedTexture || buildTexture(profile, options);
  const ctx = canvas.getContext("2d", { alpha: true });

  const width = canvas.width || 1024;
  const height = canvas.height || 1024;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (profile.radius || 0.33);
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
      const longitudeShift = Number.isFinite(options.longitudeShift) ? options.longitudeShift : 0.1;
      const u = ((0.5 + Math.atan2(nx, nz) / (Math.PI * 2) + longitudeShift) % 1 + 1) % 1;
      const v = clamp(0.5 + Math.asin(ny) / Math.PI, 0, 1);

      const surface = sampleSurface(u, v, {
        profile,
        texture,
        state: texture.state,
        fields: texture.fields
      });

      const baseColor = surface.renderColor || [90, 110, 120];
      const litColor = applyLighting(baseColor, nx, ny, nz, surface);

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
    parentAuthority: FILE,
    downstreamChildren: CHILD_PATHS,
    visualPassClaimed: false
  });
}

export function render(canvas, options = {}) {
  return renderSurface(canvas, options);
}

export function renderPlanet(canvas, options = {}) {
  return renderSurface(canvas, options);
}

export function getStatus() {
  let livingWorldStatus = null;

  try {
    livingWorldStatus = getLivingWorldStatus();
  } catch (error) {
    livingWorldStatus = {
      ok: false,
      error: String(error && error.message ? error.message : error)
    };
  }

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-parent-planet-render",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    role: "parent-planet-render-compositor",
    downstreamChildren: CHILD_PATHS,
    livingWorldStatus,
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
