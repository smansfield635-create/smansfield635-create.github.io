/*
AUDRALIA_G2_HARD_CONTINENT_PLANET_RENDER_TNT_v4
FULL-FILE REPLACEMENT
TARGET=/assets/audrelia.planet.render.js

Purpose:
- Replace failed / non-holding Audralia render body.
- Establish hard land/water separation.
- Prevent translucent blob collapse.
- Preserve module import compatibility.
- Preserve global registration compatibility.
- Provide buildTexture(), renderSurface(), sampleSurface(), createProfile(), getStatus().
*/

const AUDRALIA_VERSION = "AUDRALIA_G2_HARD_CONTINENT_PLANET_RENDER_TNT_v4";
const TAU = Math.PI * 2;

function clamp(n, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
    255
  ];
}

function wrapLonDelta(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
}

function hash(x, y, z) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return v - Math.floor(v);
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

  const c000 = hash(ix, iy, iz);
  const c100 = hash(ix + 1, iy, iz);
  const c010 = hash(ix, iy + 1, iz);
  const c110 = hash(ix + 1, iy + 1, iz);
  const c001 = hash(ix, iy, iz + 1);
  const c101 = hash(ix + 1, iy, iz + 1);
  const c011 = hash(ix, iy + 1, iz + 1);
  const c111 = hash(ix + 1, iy + 1, iz + 1);

  const x00 = lerp(c000, c100, ux);
  const x10 = lerp(c010, c110, ux);
  const x01 = lerp(c001, c101, ux);
  const x11 = lerp(c011, c111, ux);

  return lerp(lerp(x00, x10, uy), lerp(x01, x11, uy), uz);
}

function fbm(x, y, z, octaves = 5) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += noise3(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.04;
  }

  return value / norm;
}

function sphere(u, v) {
  const lon = u * TAU - Math.PI;
  const lat = Math.PI / 2 - v * Math.PI;
  const cosLat = Math.cos(lat);

  return {
    u,
    v,
    lon,
    lat,
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

function ellipse(lon, lat, cx, cy, rx, ry, power = 1.7) {
  const dx = wrapLonDelta(lon, cx) / rx;
  const dy = (lat - cy) / ry;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.pow(clamp(1 - d), power);
}

function ridge(lon, lat, cx, cy, rx, ry, strength = 1) {
  const dx = wrapLonDelta(lon, cx) / rx;
  const dy = (lat - cy) / ry;
  return Math.exp(-(dx * dx * 1.2 + dy * dy * 10.5)) * strength;
}

function createProfile(overrides = {}) {
  return {
    id: "audrelia",
    alias: "audralia",
    label: "Audralia",
    generation: "G2",
    version: AUDRALIA_VERSION,
    width: 2048,
    height: 1024,
    seaLevel: 0.48,
    ...overrides
  };
}

function landField(s) {
  /*
    Hard continent rule:
    The continent mask is intentionally explicit and thresholded.
    Noise modifies coastlines but does not own the land/water decision.
  */

  const mainWest =
    ellipse(s.lon, s.lat, -1.55, 0.12, 0.95, 0.58, 1.35) * 1.15 +
    ellipse(s.lon, s.lat, -0.95, 0.04, 0.86, 0.50, 1.45) * 0.88 +
    ellipse(s.lon, s.lat, -0.42, -0.14, 0.72, 0.45, 1.55) * 0.72;

  const mainEast =
    ellipse(s.lon, s.lat, 0.36, 0.08, 0.84, 0.52, 1.45) * 0.92 +
    ellipse(s.lon, s.lat, 0.92, -0.16, 0.72, 0.48, 1.55) * 0.82 +
    ellipse(s.lon, s.lat, 1.28, 0.18, 0.50, 0.34, 1.8) * 0.45;

  const westernCrown =
    ellipse(s.lon, s.lat, -2.35, 0.28, 0.48, 0.34, 1.7) * 0.58 +
    ellipse(s.lon, s.lat, -2.72, -0.22, 0.46, 0.30, 1.9) * 0.42;

  const southernReach =
    ellipse(s.lon, s.lat, 0.14, -0.62, 0.72, 0.28, 1.55) * 0.50 +
    ellipse(s.lon, s.lat, 0.84, -0.58, 0.44, 0.24, 1.8) * 0.34;

  const archipelago =
    ellipse(s.lon, s.lat, 1.86, 0.24, 0.30, 0.22, 1.7) * 0.34 +
    ellipse(s.lon, s.lat, 2.22, 0.05, 0.24, 0.18, 1.8) * 0.25 +
    ellipse(s.lon, s.lat, 2.56, -0.20, 0.22, 0.16, 1.9) * 0.22;

  const polarNorth = smoothstep(1.28, 1.48, s.lat) * 0.50;
  const polarSouth = smoothstep(1.22, 1.47, -s.lat) * 0.40;

  const base =
    mainWest +
    mainEast +
    westernCrown +
    southernReach +
    archipelago +
    polarNorth +
    polarSouth;

  const coastlineNoise =
    (fbm(s.x * 3.6 + 12, s.y * 3.6 - 7, s.z * 3.6 + 4, 5) - 0.5) * 0.22 +
    (fbm(s.x * 9.5 - 3, s.y * 9.5 + 18, s.z * 9.5 - 11, 4) - 0.5) * 0.08;

  return base + coastlineNoise;
}

function terrainField(s, landScore) {
  const n1 = fbm(s.x * 4.4 + 5, s.y * 4.4 - 8, s.z * 4.4 + 14, 5);
  const n2 = fbm(s.x * 12.0 - 9, s.y * 12.0 + 3, s.z * 12.0 + 21, 4);

  const mountainChain =
    ridge(s.lon, s.lat, -1.34, 0.30, 0.78, 0.20, 0.36) +
    ridge(s.lon, s.lat, -0.55, 0.16, 0.72, 0.18, 0.26) +
    ridge(s.lon, s.lat, 0.52, 0.18, 0.74, 0.18, 0.24) +
    ridge(s.lon, s.lat, 1.04, -0.08, 0.62, 0.16, 0.20) +
    ridge(s.lon, s.lat, -2.28, 0.38, 0.38, 0.14, 0.24);

  const basin =
    ellipse(s.lon, s.lat, -0.10, -0.28, 0.62, 0.30, 1.7) * 0.14 +
    ellipse(s.lon, s.lat, 0.78, -0.32, 0.48, 0.26, 1.8) * 0.10;

  const riverCut =
    Math.pow(1 - Math.abs(Math.sin(s.lon * 2.4 - s.lat * 3.2 + n1 * 2.6)), 9) * 0.08 +
    Math.pow(1 - Math.abs(Math.sin(s.lon * 4.3 + s.lat * 1.7 - n2 * 2.2)), 11) * 0.05;

  const interior = smoothstep(0.54, 0.90, landScore);

  return {
    n1,
    n2,
    mountain: mountainChain * interior,
    basin: basin * interior,
    riverCut: riverCut * interior,
    relief: (n1 - 0.45) * 0.16 + (n2 - 0.5) * 0.07
  };
}

function sampleSurface(uInput = 0.5, vInput = 0.5, profileInput = {}) {
  let u = uInput;
  let v = vInput;

  if (typeof uInput === "object" && uInput !== null) {
    u = uInput.u ?? uInput.x ?? 0.5;
    v = uInput.v ?? uInput.y ?? 0.5;
  }

  u = ((u % 1) + 1) % 1;
  v = clamp(v);

  const profile = createProfile(profileInput);
  const s = sphere(u, v);

  const landScore = landField(s);
  const terrain = terrainField(s, landScore);

  const coastThreshold = profile.seaLevel;
  const landHardness = landScore - coastThreshold;
  const isLand = landHardness >= 0;

  const coast = 1 - smoothstep(0.01, 0.12, Math.abs(landHardness));
  const shelf = !isLand ? smoothstep(-0.16, 0.05, landHardness) : 0;
  const shallow = !isLand ? smoothstep(-0.08, 0.02, landHardness) : 0;

  const polar = smoothstep(1.12, 1.46, Math.abs(s.lat));
  const elevation = isLand
    ? clamp(landHardness * 1.1 + terrain.relief + terrain.mountain - terrain.basin - terrain.riverCut, 0, 1)
    : clamp(0.32 + landHardness * 0.55 + terrain.relief * 0.2, 0, 1);

  const moisture = clamp(
    0.60 +
      Math.cos(s.lat * 2.0) * 0.20 +
      terrain.n1 * 0.18 -
      terrain.basin * 0.25 -
      terrain.mountain * 0.18
  );

  const arid = clamp(
    smoothstep(0.18, 0.72, Math.abs(s.lat)) *
      smoothstep(0.18, 0.75, elevation) *
      (1 - moisture * 0.45)
  );

  const glacier = isLand
    ? clamp(smoothstep(0.62, 0.90, elevation) + polar * 0.92)
    : polar * smoothstep(-0.04, 0.10, landHardness);

  const reef =
    shallow *
    (1 - polar) *
    smoothstep(0.56, 0.76, fbm(s.x * 20 + 2, s.y * 20 - 4, s.z * 20 + 9, 3));

  return {
    ...s,
    landScore,
    landHardness,
    isLand,
    isWater: !isLand,
    elevation,
    coast,
    shelf,
    shallow,
    reef,
    polar,
    moisture,
    arid,
    glacier,
    mountain: terrain.mountain,
    basin: terrain.basin,
    riverCut: terrain.riverCut,
    terrain
  };
}

function colorSurface(surface) {
  if (!surface.isLand) {
    let c = mixColor([3, 13, 38], [7, 42, 86], smoothstep(0.10, 0.44, surface.elevation));
    c = mixColor(c, [22, 91, 124], surface.shelf * 0.75);
    c = mixColor(c, [55, 139, 148], surface.shallow * 0.88);
    c = mixColor(c, [91, 178, 160], surface.reef * 0.70);
    c = mixColor(c, [160, 191, 208], surface.polar * 0.34);
    return c;
  }

  let c = mixColor([44, 94, 66], [84, 133, 70], surface.moisture);
  c = mixColor(c, [186, 170, 112], surface.coast * 0.92);
  c = mixColor(c, [151, 126, 80], surface.arid * 0.58);
  c = mixColor(c, [118, 112, 98], smoothstep(0.34, 0.68, surface.elevation) * 0.55);
  c = mixColor(c, [160, 158, 148], smoothstep(0.56, 0.86, surface.elevation) * 0.55);
  c = mixColor(c, [34, 82, 78], surface.riverCut * 0.72);
  c = mixColor(c, [230, 235, 234], surface.glacier * 0.88);

  const detail = (surface.terrain.n2 - 0.5) * 15;
  c[0] = clamp(Math.round(c[0] + detail), 0, 255);
  c[1] = clamp(Math.round(c[1] + detail), 0, 255);
  c[2] = clamp(Math.round(c[2] + detail), 0, 255);

  return c;
}

const textureCache = new Map();

function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  return null;
}

function buildTexture(options = {}) {
  const profile = createProfile(options.profile || {});
  const width = Math.max(256, options.width || profile.width || 2048);
  const height = Math.max(128, options.height || profile.height || 1024);
  const cacheKey = `${AUDRALIA_VERSION}:${width}x${height}`;

  if (!options.noCache && textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = options.canvas || createCanvas(width, height);

  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("Audralia renderer requires canvas support.");
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  let p = 0;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const surface = sampleSurface(u, v, profile);
      const color = colorSurface(surface);

      data[p] = color[0];
      data[p + 1] = color[1];
      data[p + 2] = color[2];
      data[p + 3] = 255;

      p += 4;
    }
  }

  ctx.putImageData(image, 0, 0);

  canvas.audralia = true;
  canvas.audrelia = true;
  canvas.version = AUDRALIA_VERSION;
  canvas.getStatus = getStatus;

  if (!options.noCache) {
    textureCache.set(cacheKey, canvas);
  }

  return canvas;
}

function renderSurface(target, options = {}) {
  const texture = buildTexture({
    width: options.textureWidth || options.width || 2048,
    height: options.textureHeight || options.height || 1024,
    profile: options.profile || {},
    noCache: options.noCache === true
  });

  let ctx = null;
  let canvas = null;

  if (target && typeof target.getContext === "function") {
    canvas = target;
    ctx = target.getContext("2d");
  } else if (target && typeof target.drawImage === "function") {
    ctx = target;
    canvas = target.canvas;
  }

  if (ctx && canvas) {
    const width = canvas.width || texture.width;
    const height = canvas.height || texture.height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(texture, 0, 0, width, height);
  }

  return texture;
}

function getStatus() {
  return {
    id: "audrelia",
    alias: "audralia",
    label: "Audralia",
    generation: "G2",
    version: AUDRALIA_VERSION,
    file: "/assets/audrelia.planet.render.js",
    api: [
      "createProfile",
      "sampleSurface",
      "buildTexture",
      "renderSurface",
      "getStatus",
      "registerExtension"
    ],
    landWaterSeparation: "hard-thresholded",
    continentMask: "explicit",
    translucentBlobCollapse: "blocked",
    visualPassClaim: "held-for-screenshot"
  };
}

function registerExtension(host = globalThis) {
  const api = AUDRALIA_PLANET_RENDERER;

  if (!host) {
    return { registered: false, renderer: api, status: getStatus() };
  }

  host.AUDRALIA_PLANET_RENDERER = api;
  host.AudraliaPlanetRenderer = api;
  host.AudreliaPlanetRenderer = api;

  host.DiamondGateBridge = host.DiamondGateBridge || {};
  host.DiamondGateBridge.planets = host.DiamondGateBridge.planets || {};
  host.DiamondGateBridge.renderers = host.DiamondGateBridge.renderers || {};

  host.DiamondGateBridge.planets.audralia = api;
  host.DiamondGateBridge.planets.audrelia = api;
  host.DiamondGateBridge.renderers.audralia = api;
  host.DiamondGateBridge.renderers.audrelia = api;

  if (typeof host.registerPlanetRenderer === "function") {
    try {
      host.registerPlanetRenderer(api);
    } catch (_) {}
  }

  if (typeof host.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    host.dispatchEvent(
      new CustomEvent("audralia-renderer-ready", {
        detail: getStatus()
      })
    );
  }

  return { registered: true, renderer: api, status: getStatus() };
}

const AUDRALIA_PLANET_RENDERER = {
  id: "audrelia",
  alias: "audralia",
  label: "Audralia",
  name: "Audralia",
  generation: "G2",
  version: AUDRALIA_VERSION,
  createProfile,
  sampleSurface,
  buildTexture,
  renderSurface,
  getStatus,
  registerExtension
};

registerExtension(globalThis);

export {
  AUDRALIA_PLANET_RENDERER,
  AUDRALIA_PLANET_RENDERER as AudraliaPlanetRenderer,
  AUDRALIA_PLANET_RENDERER as AudreliaPlanetRenderer,
  createProfile,
  sampleSurface,
  buildTexture,
  renderSurface,
  getStatus,
  registerExtension
};

export default AUDRALIA_PLANET_RENDERER;
