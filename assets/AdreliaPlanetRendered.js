// /assets/AdreliaPlanetRendered.js
// AUDRALIA_G1_PARENT_PLANET_RENDER_COMPOSITOR_TNT_v1
// Role: Audralia parent planet render authority.
// Owns: body identity, downstream imports, composition order, final render API, status receipts.
// Does not own: route shell, HTML, Earth, Sun, Moon, Gauges, Products, image generation, GraphicBox.

import {
  createLivingWorldProfile,
  createLivingWorldState,
  buildLivingWorldFields,
  sampleLivingWorld,
  getLivingWorldStatus
} from "/assets/audralia.planet.render-living-world.js";

const RECEIPT = "AUDRALIA_G1_PARENT_PLANET_RENDER_COMPOSITOR_TNT_v1";
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

function toRgb(rgb) {
  return `rgb(${Math.round(clamp(rgb[0], 0, 255))}, ${Math.round(clamp(rgb[1], 0, 255))}, ${Math.round(clamp(rgb[2], 0, 255))})`;
}

function blend(a, b, t) {
  return [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t)
  ];
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
  const fieldSize = Math.max(48, Math.min(160, Math.floor(options.fieldSize || 96)));

  return buildLivingWorldFields({
    width: fieldSize,
    height: fieldSize,
    profile
  });
}

function classifySurfaceColor(surface) {
  const topography = surface.topography || {};
  const hydration = surface.hydration || {};
  const climate = surface.climate || {};
  const ecology = surface.ecology || {};
  const fauna = surface.fauna || {};
  const activity = surface.activity || {};

  if (hydration.isOcean) {
    const deep = [8, 28, 70];
    const open = [15, 76, 132];
    const shelf = [38, 148, 176];
    const reef = [66, 188, 184];

    let color = blend(open, deep, hydration.normalizedDepth || 0);

    if ((hydration.shelfWaterPermission || 0) > 0.28) {
      color = blend(color, shelf, hydration.shelfWaterPermission);
    }

    if ((fauna.guildScores && fauna.guildScores.marine_guild > 0.45) || (hydration.coastalPermission || 0) > 0.62) {
      color = blend(color, reef, Math.max(hydration.coastalPermission || 0, 0.18));
    }

    return color;
  }

  if ((hydration.glacierPermission || 0) > 0.58 || (activity.snowIceActivity || 0) > 0.66) {
    return blend([190, 210, 218], [246, 250, 252], Math.max(hydration.glacierPermission || 0, activity.snowIceActivity || 0));
  }

  const vegetation = ecology.vegetationDensity || 0;
  const canopy = ecology.canopyPotential || 0;
  const grass = ecology.grasslandPotential || 0;
  const wetland = ecology.wetlandPotential || 0;
  const aridity = climate.aridity || 0;
  const mountain = topography.mountainPermission || 0;
  const basin = topography.basinPermission || 0;

  let color = [112, 104, 76];

  if (aridity > 0.62) {
    color = blend([137, 106, 64], [185, 139, 76], aridity);
  }

  if (grass > 0.28) {
    color = blend(color, [78, 132, 72], grass);
  }

  if (vegetation > 0.35) {
    color = blend(color, [48, 116, 72], vegetation);
  }

  if (canopy > 0.42) {
    color = blend(color, [30, 86, 57], canopy);
  }

  if (wetland > 0.38) {
    color = blend(color, [42, 114, 91], wetland);
  }

  if (basin > 0.52 && vegetation < 0.3) {
    color = blend(color, [132, 112, 82], basin * 0.42);
  }

  if (mountain > 0.48) {
    color = blend(color, [128, 119, 104], mountain * 0.72);
  }

  return color;
}

function applyLighting(rgb, normalX, normalY, normalZ, surface) {
  const hydration = surface.hydration || {};
  const climate = surface.climate || {};
  const activity = surface.activity || {};
  const topography = surface.topography || {};

  const lightX = -0.42;
  const lightY = -0.28;
  const lightZ = 0.86;

  const dot = clamp(normalX * lightX + normalY * lightY + normalZ * lightZ, 0, 1);
  const limb = clamp(normalZ, 0, 1);
  const atmosphere = clamp(1 - limb, 0, 1);

  let shade = 0.36 + dot * 0.74;
  shade -= (topography.slope || 0) * 0.08;
  shade += (hydration.isOcean ? 0.06 : 0);
  shade += (activity.daylight || 0) * 0.04;

  let color = [
    rgb[0] * shade,
    rgb[1] * shade,
    rgb[2] * shade
  ];

  if ((climate.stormPermission || 0) > 0.6) {
    color = blend(color, [168, 178, 186], (climate.stormPermission - 0.6) * 0.28);
  }

  if (atmosphere > 0.62) {
    color = blend(color, [104, 178, 224], (atmosphere - 0.62) * 0.26);
  }

  return color;
}

export function createProfile(options = {}) {
  const livingWorldProfile = createLivingWorldProfile({
    lattice: options.lattice || 96
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
    radius: options.radius || 0.38,
    fieldSize: options.fieldSize || 96,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function buildTexture(profile = createProfile(), options = {}) {
  const textureProfile = profile && profile.livingWorldProfile
    ? profile.livingWorldProfile
    : createLivingWorldProfile({ lattice: options.fieldSize || 96 });

  const state = options.state || createDefaultState(textureProfile, options);
  const fields = options.fields || getSafeFields(textureProfile, {
    fieldSize: options.fieldSize || profile.fieldSize || 96
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
  const ctx = canvas.getContext("2d");

  const width = canvas.width || 1024;
  const height = canvas.height || 1024;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (profile.radius || 0.38);
  const pixelStep = Math.max(2, Math.min(5, Math.floor(options.pixelStep || 3)));

  ctx.clearRect(0, 0, width, height);

  ctx.save();

  for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py += pixelStep) {
    for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px += pixelStep) {
      const nx = (px - cx) / radius;
      const ny = (py - cy) / radius;
      const d2 = nx * nx + ny * ny;

      if (d2 > 1) continue;

      const nz = Math.sqrt(1 - d2);
      const longitudeShift = Number.isFinite(options.longitudeShift) ? options.longitudeShift : 0.08;
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
      ctx.fillRect(px, py, pixelStep + 0.5, pixelStep + 0.5);
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

  atmosphere.addColorStop(0, "rgba(255,255,255,0.10)");
  atmosphere.addColorStop(0.68, "rgba(100,180,230,0.06)");
  atmosphere.addColorStop(1, "rgba(116,192,244,0.38)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.018, 0, Math.PI * 2);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  ctx.lineWidth = Math.max(2, Math.round(radius * 0.012));
  ctx.strokeStyle = "rgba(190,220,245,0.42)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(245,248,255,0.96)";
  ctx.font = "700 34px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Audralia", cx, height - Math.max(42, radius * 0.12));

  ctx.restore();

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
