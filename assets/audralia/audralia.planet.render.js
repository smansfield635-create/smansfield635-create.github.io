// /assets/audralia/audralia.planet.render.js
// AUDRALIA_GROUND_ZERO_G1_PARENT_RENDER_TNT_v1
// Role: single-file Audralia Generation 1 parent renderer.
// Scope: ground-zero world-body render only.
// No downstream children, no route shell ownership, no Earth ownership, no Sun/Moon ownership, no visual pass claim.

const RECEIPT = "AUDRALIA_GROUND_ZERO_G1_PARENT_RENDER_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const FILE = "/assets/audralia/audralia.planet.render.js";

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
  const d = hash2(ix + 1, iy + 1, seed);

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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.19) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function lobe(lon, lat, cx, cy, sx, sy, power = 1) {
  const dx = (lon - cx) / sx;
  const dy = (lat - cy) / sy;
  return Math.exp(-(dx * dx + dy * dy) * power);
}

function landField(lon, lat) {
  const mainland =
    lobe(lon, lat, -0.18, -0.02, 0.66, 0.42, 0.92) * 0.94;

  const westernShelf =
    lobe(lon, lat, -0.78, -0.08, 0.22, 0.34, 1.1) * 0.46;

  const easternRise =
    lobe(lon, lat, 0.48, 0.04, 0.34, 0.46, 1.0) * 0.52;

  const northernIsles =
    lobe(lon, lat, -0.08, 0.56, 0.48, 0.18, 1.1) * 0.34;

  const southernBelt =
    lobe(lon, lat, 0.12, -0.62, 0.58, 0.18, 1.2) * 0.34;

  const coastlineNoise =
    (fbm(lon * 4.7 + 2.2, lat * 4.7 - 1.3, 11, 6) - 0.5) * 0.28;

  const fineBreak =
    (fbm(lon * 14.0 - 3.5, lat * 14.0 + 6.2, 19, 4) - 0.5) * 0.12;

  return mainland + westernShelf + easternRise + northernIsles + southernBelt + coastlineNoise + fineBreak;
}

function mountainField(lon, lat) {
  const axialRidge =
    Math.exp(-Math.pow((lat - (-0.08 + Math.sin(lon * 3.8) * 0.08)) / 0.08, 2)) *
    smoothstep(0.86, 0.12, Math.abs(lon - 0.1));

  const easternCrown =
    lobe(lon, lat, 0.44, 0.12, 0.22, 0.36, 1.1);

  const southernHighlands =
    lobe(lon, lat, -0.04, -0.46, 0.52, 0.14, 1.2);

  return clamp(axialRidge * 0.58 + easternCrown * 0.42 + southernHighlands * 0.34, 0, 1);
}

function waterDepthFromLand(landScore) {
  return clamp(0.34 + (0.46 - landScore) * 1.18, 0, 1);
}

function climateBand(lat) {
  const absLat = Math.abs(lat);
  const equatorialWet = 1 - smoothstep(0.12, 0.42, absLat);
  const dryBelt = smoothstep(0.18, 0.42, absLat) * (1 - smoothstep(0.48, 0.72, absLat));
  const coldBelt = smoothstep(0.72, 0.96, absLat);

  return { equatorialWet, dryBelt, coldBelt };
}

function sampleCore(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);
  const lon = u * 2 - 1;
  const lat = 1 - v * 2;

  const landScore = landField(lon, lat);
  const isLand = landScore > 0.46;
  const coast = clamp(1 - Math.abs(landScore - 0.46) / 0.18, 0, 1);
  const depth = isLand ? 0 : waterDepthFromLand(landScore);
  const mountain = isLand ? mountainField(lon, lat) : 0;

  const climate = climateBand(lat);
  const moistureNoise = fbm(lon * 5.5 + 1.8, lat * 5.5 - 9.2, 41, 5);
  const terrainNoise = fbm(lon * 7.0 - 5.0, lat * 7.0 + 4.0, 43, 5);

  const moisture = clamp(
    climate.equatorialWet * 0.62 +
      coast * 0.28 +
      moistureNoise * 0.28 -
      climate.dryBelt * 0.34 -
      mountain * 0.08,
    0,
    1
  );

  const aridity = clamp(climate.dryBelt * 0.78 + (1 - moisture) * 0.24 + terrainNoise * 0.12, 0, 1);
  const vegetation = isLand
    ? clamp(moisture * 0.72 + (1 - aridity) * 0.22 - mountain * 0.12, 0, 1)
    : 0;

  const ice = clamp(
    climate.coldBelt * 0.44 +
      mountain * climate.coldBelt * 0.28 +
      mountain * smoothstep(0.72, 0.94, Math.abs(lat)) * 0.22,
    0,
    0.72
  );

  const reef = !isLand ? clamp(coast * (1 - depth) * (1 - climate.coldBelt) * 0.9, 0, 1) : 0;

  return Object.freeze({
    u,
    v,
    lon,
    lat,
    landScore,
    isLand,
    isWater: !isLand,
    coast,
    depth,
    mountain,
    moisture,
    aridity,
    vegetation,
    ice,
    reef,
    equatorialWet: climate.equatorialWet,
    dryBelt: climate.dryBelt,
    coldBelt: climate.coldBelt
  });
}

function colorForSample(sample) {
  if (sample.isWater) {
    let color = blend([18, 94, 154], [5, 28, 72], sample.depth);

    if (sample.coast > 0.35) {
      color = blend(color, [55, 158, 185], sample.coast * 0.48);
    }

    if (sample.reef > 0.35) {
      color = blend(color, [78, 185, 174], sample.reef * 0.38);
    }

    return color;
  }

  let color = [118, 105, 77];

  if (sample.aridity > 0.42) {
    color = blend(color, [172, 126, 69], sample.aridity * 0.78);
  }

  if (sample.vegetation > 0.22) {
    color = blend(color, [76, 132, 74], sample.vegetation * 0.78);
  }

  if (sample.vegetation > 0.58) {
    color = blend(color, [35, 92, 58], (sample.vegetation - 0.58) * 0.84);
  }

  if (sample.coast > 0.52) {
    color = blend(color, [116, 132, 98], sample.coast * 0.24);
  }

  if (sample.mountain > 0.34) {
    color = blend(color, [126, 118, 104], sample.mountain * 0.62);
  }

  if (sample.ice > 0.2) {
    color = blend(color, [220, 234, 238], sample.ice * 0.72);
  }

  return color;
}

function applyLighting(rgb, nx, ny, nz, sample) {
  const lightX = -0.38;
  const lightY = -0.24;
  const lightZ = 0.9;

  const dot = clamp(nx * lightX + ny * lightY + nz * lightZ, 0, 1);
  const limb = clamp(nz, 0, 1);
  const atmosphere = clamp(1 - limb, 0, 1);

  let shade = 0.38 + dot * 0.72;
  shade += sample.isWater ? 0.04 : 0;
  shade -= sample.mountain * 0.04;

  let color = [rgb[0] * shade, rgb[1] * shade, rgb[2] * shade];

  if (atmosphere > 0.58) {
    color = blend(color, [90, 168, 224], (atmosphere - 0.58) * 0.32);
  }

  return color;
}

export function createProfile(options = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    generationClaimed: true,
    file: FILE,
    role: "ground-zero-g1-parent-renderer",
    authority: FILE,
    downstreamChildrenActive: false,
    groundZeroParentOnly: true,
    radius: options.radius || 0.34,
    pixelStep: options.pixelStep || 2,
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
    generation: GENERATION,
    file: FILE,
    profile,
    width: options.width || 512,
    height: options.height || 256,
    groundZeroParentOnly: true,
    downstreamChildrenActive: false,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function sampleSurface(u, v, context = {}) {
  const sample = sampleCore(u, v);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    ...sample,
    elevation: sample.isLand ? clamp((sample.landScore - 0.46) * 1.4 + sample.mountain * 0.32, 0, 1) : -sample.depth,
    oceanDepth: sample.isWater ? sample.depth : 0,
    renderColor: colorForSample(sample),
    profile: context.profile || null,
    texture: context.texture || null,
    groundZeroParentOnly: true,
    downstreamChildrenActive: false,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function renderSurface(canvas, options = {}) {
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("AUDRALIA_GROUND_ZERO_CANVAS_REQUIRED");
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

      const surface = sampleSurface(u, v, { profile, texture });
      const litColor = applyLighting(surface.renderColor, nx, ny, nz, surface);

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
    groundZeroParentOnly: true,
    downstreamChildrenActive: false,
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
    id: "audralia-ground-zero-g1-parent-render",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    generationClaimed: true,
    file: FILE,
    role: "ground-zero-g1-parent-renderer",
    authority: FILE,
    groundZeroParentOnly: true,
    downstreamChildrenActive: false,
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
