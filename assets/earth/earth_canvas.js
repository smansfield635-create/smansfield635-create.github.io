// /assets/earth/earth_canvas.js
// EARTH_G4_RENDER_API_COMPATIBILITY_ADAPTER_TNT_v1
// Role: Earth Generation 4 render API adapter for /showroom/globe/index.js.
// Owns: Earth render API compatibility only.
// Does not own: route shell, Audralia, Sun, Moon, Gauges, Products, visual pass claim.

const RECEIPT = "EARTH_G4_RENDER_API_COMPATIBILITY_ADAPTER_TNT_v1";
const PLANETARY_OBJECT = "Earth";
const GENERATION = "G4";
const FILE = "/assets/earth/earth_canvas.js";

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

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed = 0, octaves = 5) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 17.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function continentField(lon, lat) {
  const northMass =
    smoothstep(0.08, 0.42, lat) *
    smoothstep(0.92, 0.42, Math.abs(lon + 0.18)) *
    0.82;

  const eastMass =
    smoothstep(-0.36, 0.08, lat) *
    smoothstep(0.82, 0.26, Math.abs(lon - 0.42)) *
    0.78;

  const westMass =
    smoothstep(-0.48, 0.18, lat) *
    smoothstep(0.76, 0.28, Math.abs(lon + 0.56)) *
    0.7;

  const southMass =
    smoothstep(-0.9, -0.56, lat) *
    smoothstep(1.0, 0.18, Math.abs(lon + 0.02)) *
    0.9;

  const islandArc =
    smoothstep(0.72, 0.9, Math.sin((lon + 0.2) * Math.PI * 4.2)) *
    smoothstep(0.38, 0.02, Math.abs(lat + 0.12)) *
    0.42;

  const detail = (fbm(lon * 4.8 + 9.4, lat * 4.8 - 3.1, 101, 6) - 0.5) * 0.36;
  const coastalBreakup = (fbm(lon * 13.5 - 4.2, lat * 13.5 + 7.7, 209, 4) - 0.5) * 0.18;

  return northMass + eastMass + westMass + southMass + islandArc + detail + coastalBreakup;
}

function polarIce(lat) {
  const northIce = smoothstep(0.66, 0.92, lat);
  const southIce = smoothstep(0.58, 0.9, -lat);
  return clamp(Math.max(northIce, southIce), 0, 1);
}

function cloudField(lon, lat) {
  const band =
    smoothstep(0.04, 0.22, Math.abs(lat)) *
    (1 - smoothstep(0.52, 0.9, Math.abs(lat)));

  const swirl =
    fbm(lon * 7.2 + lat * 1.8 + 1.4, lat * 7.2 - lon * 1.4, 401, 5);

  const highCloud =
    fbm(lon * 13.0 - 8.1, lat * 13.0 + 3.7, 503, 4);

  return clamp((swirl - 0.48) * 1.4 + band * 0.18 + (highCloud - 0.62) * 0.7, 0, 1);
}

function sampleBaseSurface(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const lon = u * 2 - 1;
  const lat = 1 - v * 2;

  const landScore = continentField(lon, lat);
  const ice = polarIce(lat);
  const cloud = cloudField(lon, lat);
  const isLand = landScore > 0.36 && ice < 0.72;
  const coastal = clamp(1 - Math.abs(landScore - 0.36) / 0.16, 0, 1);

  const vegetation = isLand
    ? clamp(
        0.62 -
          Math.abs(lat) * 0.45 +
          fbm(lon * 6.0, lat * 6.0, 607, 4) * 0.42 -
          coastal * 0.08,
        0,
        1
      )
    : 0;

  const arid = isLand
    ? clamp(
        smoothstep(0.05, 0.4, Math.abs(lat)) *
          (1 - vegetation) *
          (0.7 + fbm(lon * 5.0 + 2, lat * 5.0 - 8, 701, 4) * 0.3),
        0,
        1
      )
    : 0;

  const depth = isLand ? 0 : clamp(0.35 + (0.36 - landScore) * 0.9, 0, 1);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    u,
    v,
    lon,
    lat,
    isLand,
    isWater: !isLand && ice < 0.76,
    landScore,
    coastal,
    depth,
    vegetation,
    arid,
    ice,
    cloud,
    renderColor: null,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

function colorForSurface(surface) {
  let color;

  if (surface.ice > 0.72) {
    color = blend([210, 226, 232], [248, 252, 255], surface.ice);
  } else if (surface.isLand) {
    const green = [58, 120, 70];
    const dry = [154, 132, 88];
    const mountain = [126, 118, 98];

    color = blend(dry, green, surface.vegetation);

    if (surface.arid > 0.46) {
      color = blend(color, [174, 140, 82], surface.arid * 0.64);
    }

    if (surface.landScore > 0.72) {
      color = blend(color, mountain, (surface.landScore - 0.72) * 1.8);
    }
  } else {
    const deep = [7, 30, 76];
    const open = [20, 88, 150];
    const shelf = [42, 150, 188];

    color = blend(open, deep, surface.depth);

    if (surface.coastal > 0.42) {
      color = blend(color, shelf, surface.coastal * 0.62);
    }
  }

  if (surface.cloud > 0.12) {
    color = blend(color, [230, 236, 240], surface.cloud * 0.58);
  }

  return color;
}

function applyLighting(rgb, nx, ny, nz, surface) {
  const lightX = -0.36;
  const lightY = -0.24;
  const lightZ = 0.9;

  const dot = clamp(nx * lightX + ny * lightY + nz * lightZ, 0, 1);
  const limb = clamp(nz, 0, 1);
  const atmosphere = clamp(1 - limb, 0, 1);

  let shade = 0.34 + dot * 0.76;
  shade += surface.isWater ? 0.05 : 0;
  shade += surface.cloud * 0.08;

  let color = [
    rgb[0] * shade,
    rgb[1] * shade,
    rgb[2] * shade
  ];

  if (atmosphere > 0.55) {
    color = blend(color, [92, 176, 238], (atmosphere - 0.55) * 0.34);
  }

  return color;
}

export function createProfile(options = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: options.generation || GENERATION,
    body: options.body || PLANETARY_OBJECT,
    file: FILE,
    role: "earth-g4-render-api-adapter",
    authority: "EARTH_FILE_CHAIN",
    sourceMode: "local-render-adapter",
    targetMode: "satellite-reference-compatible",
    radius: options.radius || 0.36,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function buildTexture(profile = createProfile(), options = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: profile.generation || GENERATION,
    profile,
    width: options.width || 512,
    height: options.height || 256,
    sourceMode: "local-render-adapter",
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function sampleSurface(u, v, context = {}) {
  const surface = sampleBaseSurface(u, v);

  return Object.freeze({
    ...surface,
    renderColor: colorForSurface(surface),
    profile: context.profile || null,
    texture: context.texture || null
  });
}

export function renderSurface(canvas, options = {}) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("EARTH_RENDER_CANVAS_REQUIRED");
  }

  const profile = options.profile || createProfile(options);
  const texture = options.texture || buildTexture(profile, options);
  const ctx = canvas.getContext("2d");

  const width = canvas.width || 1024;
  const height = canvas.height || 1024;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (profile.radius || 0.36);
  const pixelStep = Math.max(2, Math.min(4, Math.floor(options.pixelStep || 2)));

  ctx.clearRect(0, 0, width, height);

  for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py += pixelStep) {
    for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px += pixelStep) {
      const nx = (px - cx) / radius;
      const ny = (py - cy) / radius;
      const d2 = nx * nx + ny * ny;

      if (d2 > 1) continue;

      const nz = Math.sqrt(1 - d2);
      const longitudeShift = Number.isFinite(options.longitudeShift) ? options.longitudeShift : 0.12;
      const u = ((0.5 + Math.atan2(nx, nz) / (Math.PI * 2) + longitudeShift) % 1 + 1) % 1;
      const v = clamp(0.5 + Math.asin(ny) / Math.PI, 0, 1);

      const surface = sampleSurface(u, v, { profile, texture });
      const baseColor = surface.renderColor || [80, 110, 140];
      const litColor = applyLighting(baseColor, nx, ny, nz, surface);

      ctx.fillStyle = toRgb(litColor);
      ctx.fillRect(px, py, pixelStep + 0.5, pixelStep + 0.5);
    }
  }

  const atmosphere = ctx.createRadialGradient(
    cx - radius * 0.22,
    cy - radius * 0.28,
    radius * 0.1,
    cx,
    cy,
    radius * 1.08
  );

  atmosphere.addColorStop(0, "rgba(255,255,255,0.12)");
  atmosphere.addColorStop(0.68, "rgba(92,172,235,0.07)");
  atmosphere.addColorStop(1, "rgba(110,190,248,0.36)");

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
  ctx.fillText("Earth", cx, height - Math.max(42, radius * 0.12));

  return Object.freeze({
    receipt: RECEIPT,
    rendered: true,
    method: "renderSurface",
    planetaryObject: PLANETARY_OBJECT,
    generation: profile.generation || GENERATION,
    file: FILE,
    sourceMode: "local-render-adapter",
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
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
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    statusAvailable: true,
    id: "earth-g4-render-api-adapter",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    role: "earth-g4-render-api-adapter",
    authority: "EARTH_FILE_CHAIN",
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
