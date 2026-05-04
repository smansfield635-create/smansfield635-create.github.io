/*
AUDRALIA_G2_ORGANIC_CLIMATE_PLANET_TERRAIN_TNT_v3
FULL-FILE REPLACEMENT
TARGET=/assets/audrelia.planet.render.js

Purpose:
- Stop translucent/globby terrain collapse.
- Establish definitive land/water separation.
- Preserve Audralia route/render/instrument compatibility.
- Express organic climate-bearing terrain, shelves, reefs, mountains, basins, glaciers, and hydrology-ready land cuts.
*/

const AUDRALIA_TNT_VERSION = "AUDRALIA_G2_ORGANIC_CLIMATE_PLANET_TERRAIN_TNT_v3";
const TAU = Math.PI * 2;

function clamp(n, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function wrap01(n) {
  return ((n % 1) + 1) % 1;
}

function lonDelta(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
    255
  ];
}

function hash3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  const c000 = hash3(ix, iy, iz);
  const c100 = hash3(ix + 1, iy, iz);
  const c010 = hash3(ix, iy + 1, iz);
  const c110 = hash3(ix + 1, iy + 1, iz);
  const c001 = hash3(ix, iy, iz + 1);
  const c101 = hash3(ix + 1, iy, iz + 1);
  const c011 = hash3(ix, iy + 1, iz + 1);
  const c111 = hash3(ix + 1, iy + 1, iz + 1);

  const x00 = lerp(c000, c100, ux);
  const x10 = lerp(c010, c110, ux);
  const x01 = lerp(c001, c101, ux);
  const x11 = lerp(c011, c111, ux);

  const y0 = lerp(x00, x10, uy);
  const y1 = lerp(x01, x11, uy);

  return lerp(y0, y1, uz);
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }

  return value / norm;
}

function sphereFromUV(u, v) {
  const lon = wrap01(u) * TAU - Math.PI;
  const lat = Math.PI / 2 - clamp(v, 0, 1) * Math.PI;
  const cosLat = Math.cos(lat);

  return {
    u: wrap01(u),
    v: clamp(v, 0, 1),
    lon,
    lat,
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

const LAND_LOBES = [
  { lon: -1.15, lat: 0.18, rx: 1.22, ry: 0.72, h: 1.08, name: "origin-ridge" },
  { lon: -0.25, lat: 0.06, rx: 1.05, ry: 0.66, h: 0.98, name: "structure-plateau" },
  { lon: 0.82, lat: -0.10, rx: 1.10, ry: 0.62, h: 0.94, name: "frontier-belt" },
  { lon: 1.88, lat: 0.24, rx: 0.58, ry: 0.42, h: 0.68, name: "joy-archipelago" },
  { lon: -2.58, lat: -0.22, rx: 0.72, ry: 0.46, h: 0.78, name: "protected-basin" },
  { lon: 2.75, lat: -0.62, rx: 0.62, ry: 0.36, h: 0.56, name: "southern-shelf" }
];

const SUMMIT_REGIONS = [
  { key: "character", lon: -1.45, lat: 0.44, rx: 0.52, ry: 0.30, lift: 0.26 },
  { key: "structure", lon: -0.75, lat: 0.24, rx: 0.56, ry: 0.34, lift: 0.20 },
  { key: "balance", lon: -0.12, lat: -0.02, rx: 0.52, ry: 0.32, lift: 0.10 },
  { key: "stability", lon: 0.42, lat: 0.18, rx: 0.54, ry: 0.32, lift: 0.12 },
  { key: "peace", lon: 0.86, lat: -0.24, rx: 0.44, ry: 0.26, lift: 0.08 },
  { key: "joy", lon: 1.74, lat: 0.24, rx: 0.48, ry: 0.28, lift: 0.06 },
  { key: "dignity", lon: -2.10, lat: 0.16, rx: 0.48, ry: 0.30, lift: 0.22 },
  { key: "free-will", lon: 2.55, lat: -0.18, rx: 0.50, ry: 0.30, lift: 0.09 },
  { key: "love", lon: 0.12, lat: -0.44, rx: 0.58, ry: 0.34, lift: 0.14 }
];

function ellipsePotential(lon, lat, node, power = 2.2) {
  const dx = lonDelta(lon, node.lon) / node.rx;
  const dy = (lat - node.lat) / node.ry;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.pow(clamp(1 - d), power);
}

function ridgePotential(lon, lat, node) {
  const dx = Math.abs(lonDelta(lon, node.lon)) / node.rx;
  const dy = Math.abs(lat - node.lat) / node.ry;
  const band = Math.exp(-(dx * dx * 1.2 + dy * dy * 8.5));
  return clamp(band);
}

function createProfile(overrides = {}) {
  return {
    id: "audrelia",
    canonicalName: "Audralia",
    generation: "G2",
    tnt: AUDRALIA_TNT_VERSION,
    textureWidth: 2048,
    textureHeight: 1024,
    seaLevel: 0,
    oceanFloor: -0.42,
    shelfDepth: -0.105,
    coastBand: 0.035,
    mountainSnowLine: 0.66,
    polarIceLatitude: 1.15,
    atmosphereBias: 0.16,
    seed: 256,
    ...overrides
  };
}

function computeSurface(uInput, vInput, profile = createProfile()) {
  const s = sphereFromUV(uInput, vInput);
  const n1 = fbm3(s.x * 1.4 + 11, s.y * 1.4 - 3, s.z * 1.4 + 7, 5);
  const n2 = fbm3(s.x * 4.2 - 5, s.y * 4.2 + 13, s.z * 4.2 - 2, 5);
  const n3 = fbm3(s.x * 11.0 + 21, s.y * 11.0 - 19, s.z * 11.0 + 4, 4);

  let landMass = 0;
  let attachedMass = 0;

  for (const lobe of LAND_LOBES) {
    const p = ellipsePotential(s.lon, s.lat, lobe, 1.72) * lobe.h;
    landMass = Math.max(landMass, p);
    attachedMass += p * 0.23;
  }

  landMass = Math.max(landMass, attachedMass);

  let summitLift = 0;
  let dominantSummit = "ocean";
  let dominantSummitScore = 0;

  for (const region of SUMMIT_REGIONS) {
    const p = ellipsePotential(s.lon, s.lat, region, 1.95);
    const r = ridgePotential(s.lon, s.lat, region);
    const score = Math.max(p, r * 0.72);

    summitLift += score * region.lift;

    if (score > dominantSummitScore) {
      dominantSummitScore = score;
      dominantSummit = region.key;
    }
  }

  const tectonicBreak =
    Math.abs(Math.sin(s.lon * 1.35 + s.lat * 2.45 + n2 * 2.8));

  const ridgeNoise =
    Math.pow(1 - tectonicBreak, 5.2) *
    smoothstep(0.26, 0.92, landMass) *
    (0.16 + n3 * 0.16);

  const inlandBasin =
    smoothstep(0.45, 0.95, landMass) *
    smoothstep(0.25, 0.75, n1) *
    (1 - smoothstep(0.68, 1.0, Math.abs(s.lat)));

  const hydrologyCutA =
    Math.pow(
      1 -
        Math.abs(
          Math.sin(s.lon * 2.35 - s.lat * 3.1 + n2 * 2.35)
        ),
      8
    );

  const hydrologyCutB =
    Math.pow(
      1 -
        Math.abs(
          Math.sin(s.lon * 3.8 + s.lat * 2.1 - n1 * 2.2)
        ),
      10
    );

  const hydrologyCut =
    clamp((hydrologyCutA * 0.65 + hydrologyCutB * 0.45) *
      smoothstep(0.38, 0.88, landMass) *
      (1 - smoothstep(0.62, 1.0, ridgeNoise)));

  const polarPressure = smoothstep(1.03, 1.42, Math.abs(s.lat));
  const oceanRelief = (n1 - 0.5) * 0.13 + (n2 - 0.5) * 0.055;
  const coastFracture = (n2 - 0.5) * 0.13 + (n3 - 0.5) * 0.045;

  let elevation =
    profile.oceanFloor +
    landMass * 0.83 +
    summitLift +
    ridgeNoise -
    inlandBasin * 0.10 -
    hydrologyCut * 0.13 +
    coastFracture;

  if (landMass < 0.22) {
    elevation += oceanRelief;
  }

  elevation += polarPressure * 0.045;

  const isLand = elevation >= profile.seaLevel;
  const coast = 1 - smoothstep(0.004, profile.coastBand, Math.abs(elevation - profile.seaLevel));
  const shelf = !isLand
    ? smoothstep(profile.oceanFloor, profile.shelfDepth, elevation) *
      (1 - smoothstep(profile.shelfDepth, profile.seaLevel, elevation))
    : 0;

  const shallowWater = !isLand
    ? smoothstep(profile.shelfDepth, profile.seaLevel + 0.012, elevation)
    : 0;

  const reef =
    shallowWater *
    smoothstep(0.46, 0.78, fbm3(s.x * 18 + 2, s.y * 18 - 9, s.z * 18 + 8, 3)) *
    (1 - polarPressure);

  const moisture =
    clamp(
      0.58 +
        Math.cos(s.lat * 2.1) * 0.22 +
        n1 * 0.18 -
        inlandBasin * 0.28 -
        ridgeNoise * 0.10
    );

  const aridity =
    clamp(
      smoothstep(0.16, 0.68, Math.abs(s.lat)) *
        smoothstep(0.46, 0.86, landMass) *
        (0.55 + (1 - n2) * 0.35)
    );

  const glacier =
    isLand
      ? clamp(
          smoothstep(profile.mountainSnowLine, profile.mountainSnowLine + 0.22, elevation) +
            polarPressure * 0.92
        )
      : clamp(polarPressure * smoothstep(-0.18, profile.seaLevel + 0.04, elevation) * 0.7);

  return {
    ...s,
    elevation,
    isLand,
    isWater: !isLand,
    coast,
    shelf,
    shallowWater,
    reef,
    ridge: ridgeNoise,
    basin: inlandBasin,
    hydrologyCut,
    moisture,
    aridity,
    glacier,
    polarPressure,
    summit: dominantSummit,
    summitScore: dominantSummitScore,
    noise: { n1, n2, n3 }
  };
}

function colorSurface(surface) {
  const {
    elevation,
    isLand,
    coast,
    shelf,
    shallowWater,
    reef,
    ridge,
    basin,
    hydrologyCut,
    moisture,
    aridity,
    glacier,
    polarPressure,
    noise
  } = surface;

  if (!isLand) {
    const deep = [3, 14, 42];
    const open = [6, 38, 82];
    const shelfColor = [24, 96, 123];
    const shallow = [55, 143, 145];
    const reefColor = [94, 179, 160];
    const iceWater = [142, 178, 194];

    let c = mixColor(deep, open, smoothstep(-0.46, -0.16, elevation));
    c = mixColor(c, shelfColor, shelf * 0.72);
    c = mixColor(c, shallow, shallowWater * 0.86);
    c = mixColor(c, reefColor, reef * 0.68);
    c = mixColor(c, iceWater, polarPressure * 0.34);
    return c;
  }

  const coastalSand = [205, 188, 134];
  const wetLowland = [38, 96, 72];
  const temperate = [70, 126, 67];
  const highGreen = [88, 117, 62];
  const drySteppe = [151, 124, 75];
  const desert = [173, 139, 82];
  const mountain = [122, 113, 98];
  const highRock = [158, 155, 145];
  const snow = [224, 231, 229];
  const glacierBlue = [185, 215, 226];

  let c = mixColor(wetLowland, temperate, moisture);
  c = mixColor(c, highGreen, smoothstep(0.16, 0.38, elevation) * 0.44);
  c = mixColor(c, drySteppe, aridity * 0.62);
  c = mixColor(c, desert, aridity * smoothstep(0.18, 0.48, basin) * 0.42);
  c = mixColor(c, mountain, smoothstep(0.38, 0.66, elevation) * 0.58);
  c = mixColor(c, highRock, smoothstep(0.58, 0.82, elevation) * 0.62);
  c = mixColor(c, coastalSand, coast * 0.92);
  c = mixColor(c, [34, 84, 76], hydrologyCut * 0.44);
  c = mixColor(c, [93, 88, 78], ridge * 0.36);
  c = mixColor(c, glacierBlue, glacier * 0.26);
  c = mixColor(c, snow, glacier * 0.88);

  const detail = (noise.n3 - 0.5) * 18;
  c[0] = clamp(Math.round(c[0] + detail), 0, 255);
  c[1] = clamp(Math.round(c[1] + detail), 0, 255);
  c[2] = clamp(Math.round(c[2] + detail), 0, 255);

  return c;
}

function sampleSurface(u = 0.5, v = 0.5, profileInput) {
  let uu = u;
  let vv = v;

  if (typeof u === "object" && u !== null) {
    uu = u.u ?? u.x ?? u.longitude ?? 0.5;
    vv = u.v ?? u.y ?? u.latitude ?? 0.5;
  }

  const profile = profileInput || createProfile();
  const surface = computeSurface(uu, vv, profile);
  const color = colorSurface(surface);

  return {
    ...surface,
    color,
    rgba: color,
    land: surface.isLand,
    water: surface.isWater,
    height: surface.elevation,
    terrain:
      surface.isWater
        ? surface.shallowWater > 0.55
          ? "shallow-shelf"
          : "deep-ocean"
        : surface.glacier > 0.58
          ? "glacier"
          : surface.ridge > 0.34
            ? "mountain"
            : surface.hydrologyCut > 0.52
              ? "hydrology-cut"
              : surface.coast > 0.55
                ? "coast"
                : "land"
  };
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
  const width = Math.max(256, options.width || profile.textureWidth);
  const height = Math.max(128, options.height || profile.textureHeight);
  const key = `${profile.id}:${profile.seed}:${width}x${height}:${AUDRALIA_TNT_VERSION}`;

  if (!options.noCache && textureCache.has(key)) {
    return textureCache.get(key);
  }

  const canvas = options.canvas || createCanvas(width, height);

  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("Audralia renderer requires a 2D canvas-capable environment.");
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
      const s = sampleSurface(u, v, profile);
      data[p] = s.color[0];
      data[p + 1] = s.color[1];
      data[p + 2] = s.color[2];
      data[p + 3] = 255;
      p += 4;
    }
  }

  ctx.putImageData(image, 0, 0);

  canvas.canvas = canvas;
  canvas.texture = canvas;
  canvas.profile = profile;
  canvas.audralia = true;
  canvas.audrelia = true;
  canvas.tnt = AUDRALIA_TNT_VERSION;
  canvas.getStatus = getStatus;

  if (!options.noCache) {
    textureCache.set(key, canvas);
  }

  return canvas;
}

function renderSurface(target, options = {}) {
  let canvas = null;
  let ctx = null;

  if (target && typeof target.getContext === "function") {
    canvas = target;
    ctx = target.getContext("2d");
  } else if (target && target.canvas && typeof target.canvas.getContext === "function") {
    canvas = target.canvas;
    ctx = target;
  } else if (target && typeof target.drawImage === "function") {
    ctx = target;
    canvas = target.canvas || null;
  }

  const texture = buildTexture({
    width: options.textureWidth || options.width || 2048,
    height: options.textureHeight || options.height || 1024,
    profile: options.profile || {},
    noCache: options.noCache === true
  });

  if (ctx && canvas) {
    const width = canvas.width || options.width || texture.width;
    const height = canvas.height || options.height || texture.height;
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
    tnt: AUDRALIA_TNT_VERSION,
    file: "/assets/audrelia.planet.render.js",
    route: "/showroom/globe/",
    renderBodyTerrain: "active",
    landWaterSeparation: "definitive",
    translucentBlobCollapse: "blocked",
    routeShellMutation: false,
    runtimeMutation: false,
    instrumentMutation: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaim: "held-for-user-screenshot"
  };
}

function registerExtension(host = globalThis) {
  const api = AUDRALIA_PLANET_RENDERER;
  let registered = false;

  const registerNames = [
    "registerPlanetRenderer",
    "registerPlanet",
    "registerRenderer",
    "registerExtension"
  ];

  for (const name of registerNames) {
    if (host && typeof host[name] === "function" && host[name] !== registerExtension) {
      try {
        host[name](api);
        registered = true;
      } catch (_) {
        /* Preserve compatibility with hosts that expect a different registration signature. */
      }
    }
  }

  if (host) {
    host.AudraliaPlanetRenderer = api;
    host.AudreliaPlanetRenderer = api;

    const bridge = host.DiamondGateBridge || {};
    bridge.planets = bridge.planets || {};
    bridge.planets.audrelia = api;
    bridge.planets.audralia = api;
    bridge.renderers = bridge.renderers || {};
    bridge.renderers.audrelia = api;
    bridge.renderers.audralia = api;
    host.DiamondGateBridge = bridge;

    if (typeof host.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
      host.dispatchEvent(
        new CustomEvent("audralia-renderer-ready", {
          detail: getStatus()
        })
      );
    }
  }

  return {
    registered,
    renderer: api,
    status: getStatus()
  };
}

const AUDRALIA_PLANET_RENDERER = {
  id: "audrelia",
  alias: "audralia",
  label: "Audralia",
  name: "Audralia",
  generation: "G2",
  version: AUDRALIA_TNT_VERSION,
  tnt: AUDRALIA_TNT_VERSION,
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  getStatus,
  registerExtension
};

if (typeof globalThis !== "undefined") {
  registerExtension(globalThis);
}

export {
  AUDRALIA_PLANET_RENDERER,
  createProfile,
  buildTexture,
  sampleSurface,
  renderSurface,
  getStatus,
  registerExtension
};

export default AUDRALIA_PLANET_RENDERER;
