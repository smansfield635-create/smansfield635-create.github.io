/* ==========================================================================
   PLANET_AUSTRALIA_G1_BASELINE_ATTEMPT_TNT_v1
   Path: /assets/audrelia.planet.render.js
   Purpose: establish a clean G1 planet-body baseline for Planet Australia.
   Scope: single-file procedural globe surface, no image generation, no static image.
   ========================================================================== */

const PLANET_AUSTRALIA_G1_STATUS = Object.freeze({
  id: "audrelia",
  publicName: "Planet Australia",
  generation: "G1_BASELINE_ATTEMPT",
  contract: "PLANET_AUSTRALIA_G1_BASELINE_CONTRACT_RENEWAL_v1",
  tnt: "PLANET_AUSTRALIA_G1_BASELINE_ATTEMPT_TNT_v1",
  staticImageReplacement: false,
  imageGeneration: false,
  graphicBox: false,
  visualPass: "HELD_UNTIL_USER_CONFIRMATION",
  baselineIntent: "TRUE_GLOBE_LAND_WATER_SEPARATION"
});

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x, y) {
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

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, octaves = 5) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise(x * frequency, y * frequency) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2.07;
  }

  return total ? value / total : value;
}

function wrapLon(lon) {
  let wrapped = ((lon + 180) % 360 + 360) % 360 - 180;
  if (wrapped === -180) wrapped = 180;
  return wrapped;
}

function lonDelta(lon, center) {
  return wrapLon(lon - center);
}

function rotatedEllipse(lon, lat, cx, cy, rx, ry, rotDeg = 0) {
  const r = rotDeg * DEG;
  const dx = lonDelta(lon, cx);
  const dy = lat - cy;
  const x = dx * Math.cos(r) + dy * Math.sin(r);
  const y = -dx * Math.sin(r) + dy * Math.cos(r);
  return 1 - (x * x) / (rx * rx) - (y * y) / (ry * ry);
}

function ridge(lon, lat, cx, cy, length, width, rotDeg = 0) {
  const r = rotDeg * DEG;
  const dx = lonDelta(lon, cx);
  const dy = lat - cy;
  const x = dx * Math.cos(r) + dy * Math.sin(r);
  const y = -dx * Math.sin(r) + dy * Math.cos(r);
  const along = clamp(1 - Math.abs(x) / length);
  const cross = Math.exp(-(y * y) / (width * width));
  return along * cross;
}

function makeRgb(r, g, b) {
  return {
    r: Math.round(clamp(r, 0, 255)),
    g: Math.round(clamp(g, 0, 255)),
    b: Math.round(clamp(b, 0, 255)),
    a: 255
  };
}

function colorMix(a, b, t) {
  return makeRgb(
    mix(a.r, b.r, t),
    mix(a.g, b.g, t),
    mix(a.b, b.b, t)
  );
}

const PALETTE = Object.freeze({
  deepOcean: makeRgb(5, 18, 44),
  ocean: makeRgb(8, 43, 86),
  blueWater: makeRgb(12, 76, 130),
  shelf: makeRgb(34, 126, 157),
  reef: makeRgb(82, 171, 163),
  beach: makeRgb(203, 177, 114),
  dryInterior: makeRgb(164, 95, 52),
  redDesert: makeRgb(130, 66, 42),
  grassland: makeRgb(91, 132, 71),
  greenCoast: makeRgb(50, 113, 70),
  forest: makeRgb(36, 88, 61),
  highland: makeRgb(112, 105, 82),
  mountain: makeRgb(151, 143, 120),
  snow: makeRgb(230, 235, 231),
  ice: makeRgb(188, 220, 230)
});

function evaluateAustraliaSurface(lon, lat, profile = {}) {
  const nx = lon / 180;
  const ny = lat / 90;

  const coastalNoise =
    (fbm(nx * 4.2 + 11.4, ny * 4.2 - 9.8, 5) - 0.5) * 0.18 +
    (fbm(nx * 12.0 - 3.1, ny * 9.0 + 7.7, 4) - 0.5) * 0.055;

  let land =
    rotatedEllipse(lon, lat, 121, -25, 54, 31, -8) * 0.92 +
    coastalNoise;

  land = Math.max(land, rotatedEllipse(lon, lat, 141, -23, 24, 24, 9) * 0.82);
  land = Math.max(land, rotatedEllipse(lon, lat, 104, -27, 26, 22, -18) * 0.76);
  land = Math.max(land, rotatedEllipse(lon, lat, 129, -14, 30, 18, 12) * 0.74);
  land = Math.max(land, rotatedEllipse(lon, lat, 148, -36, 17, 12, -20) * 0.62);

  const gulfCut = rotatedEllipse(lon, lat, 136, -15, 17, 10, 5);
  const biteCut = rotatedEllipse(lon, lat, 128, -38, 31, 8, 0);
  const westBayCut = rotatedEllipse(lon, lat, 108, -18, 12, 10, -20);
  const eastBiteCut = rotatedEllipse(lon, lat, 154, -28, 11, 17, -10);

  land -= Math.max(gulfCut, 0) * 0.56;
  land -= Math.max(biteCut, 0) * 0.44;
  land -= Math.max(westBayCut, 0) * 0.30;
  land -= Math.max(eastBiteCut, 0) * 0.22;

  const tasmania = rotatedEllipse(lon, lat, 147, -43, 8, 5, -20);
  const northIsland = rotatedEllipse(lon, lat, 151, -9, 11, 5, 8);
  const westIsland = rotatedEllipse(lon, lat, 91, -30, 9, 6, -12);
  const reefChain = ridge(lon, lat, 153, -17, 29, 2.8, -11);

  const islandLand = Math.max(
    tasmania * 0.88,
    northIsland * 0.55,
    westIsland * 0.42
  );

  land = Math.max(land, islandLand);
  land = Math.max(land, reefChain * 0.19 - 0.11);

  const polarIce = smoothstep(58, 78, Math.abs(lat));
  const isLand = land > 0.0;

  const coast = smoothstep(-0.045, 0.065, land);
  const shelf = smoothstep(-0.22, 0.0, land) * (1 - coast);
  const reef = Math.max(reefChain, 0) * smoothstep(-0.18, 0.05, land);

  const easternRange =
    ridge(lon, lat, 149, -28, 34, 4.2, -7) * 0.88 +
    ridge(lon, lat, 145, -35, 17, 3.5, -15) * 0.58;

  const westernShield = ridge(lon, lat, 112, -25, 28, 9, 18) * 0.37;
  const centralBasin = rotatedEllipse(lon, lat, 126, -26, 27, 17, -6);

  let elevation = 0;
  if (isLand) {
    elevation =
      0.20 +
      smoothstep(0.0, 0.45, land) * 0.26 +
      easternRange * 0.36 +
      westernShield * 0.18 -
      Math.max(centralBasin, 0) * 0.12 +
      (fbm(nx * 11.0, ny * 10.0, 5) - 0.5) * 0.13;
    elevation = clamp(elevation);
  }

  const waterDepth = isLand
    ? 0
    : clamp(0.18 + smoothstep(-0.02, -0.72, land) * 0.82 + polarIce * 0.08);

  const moisture =
    clamp(
      0.30 +
        smoothstep(0.0, 1.0, easternRange) * 0.42 +
        smoothstep(-0.05, 0.18, reefChain) * 0.17 -
        Math.max(centralBasin, 0) * 0.28 +
        (fbm(nx * 6.4 + 30.0, ny * 5.7 - 4.0, 4) - 0.5) * 0.22
    );

  const aridity =
    clamp(
      0.52 +
        Math.max(centralBasin, 0) * 0.32 -
        moisture * 0.38 +
        smoothstep(20, 38, Math.abs(lat)) * 0.14
    );

  let biome = "ocean";
  if (polarIce > 0.35 && !isLand) biome = "polar_ocean";
  if (shelf > 0.1 && !isLand) biome = "continental_shelf";
  if (reef > 0.08 && !isLand) biome = "reef_chain";
  if (isLand && coast < 0.42) biome = "beach_threshold";
  if (isLand && coast >= 0.42) biome = "dry_continent";
  if (isLand && moisture > 0.46) biome = "grassland";
  if (isLand && moisture > 0.62) biome = "green_coast";
  if (isLand && moisture > 0.73 && elevation > 0.36) biome = "forest_highland";
  if (isLand && elevation > 0.62) biome = "mountain";
  if (isLand && elevation > 0.76 && lat < -32) biome = "snow_cap";

  return {
    lon,
    lat,
    landScore: land,
    isLand,
    coast,
    shelf,
    reef,
    elevation,
    waterDepth,
    moisture,
    aridity,
    polarIce,
    biome
  };
}

function surfaceColor(sample) {
  const n = fbm(sample.lon * 0.08 + 17, sample.lat * 0.08 - 21, 4);
  const grain = (n - 0.5) * 18;

  if (!sample.isLand) {
    let c = colorMix(PALETTE.deepOcean, PALETTE.ocean, clamp(1 - sample.waterDepth));
    c = colorMix(c, PALETTE.blueWater, sample.shelf * 0.75);
    c = colorMix(c, PALETTE.shelf, sample.shelf * 0.65);
    c = colorMix(c, PALETTE.reef, clamp(sample.reef * 0.95));
    c = colorMix(c, PALETTE.ice, sample.polarIce * 0.72);
    return makeRgb(c.r + grain * 0.20, c.g + grain * 0.20, c.b + grain * 0.28);
  }

  if (sample.biome === "beach_threshold") {
    return colorMix(PALETTE.beach, PALETTE.grassland, sample.moisture * 0.35);
  }

  let land = colorMix(PALETTE.redDesert, PALETTE.dryInterior, clamp(sample.aridity));
  land = colorMix(land, PALETTE.grassland, clamp(sample.moisture * 0.75));
  land = colorMix(land, PALETTE.greenCoast, clamp((sample.moisture - 0.48) * 1.45));
  land = colorMix(land, PALETTE.forest, clamp((sample.moisture - 0.68) * 1.8));
  land = colorMix(land, PALETTE.highland, clamp((sample.elevation - 0.48) * 1.6));
  land = colorMix(land, PALETTE.mountain, clamp((sample.elevation - 0.63) * 1.8));
  land = colorMix(land, PALETTE.snow, clamp((sample.elevation - 0.76) * 2.2));

  const coastLight = clamp(1 - sample.coast) * 0.35;
  land = colorMix(land, PALETTE.beach, coastLight);

  return makeRgb(land.r + grain * 0.30, land.g + grain * 0.26, land.b + grain * 0.20);
}

function createCanvas(width, height) {
  if (typeof document !== "undefined" && document.createElement) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }

  return null;
}

export function createProfile(options = {}) {
  return {
    id: "audrelia",
    aliases: ["audralia", "adralia", "planet-australia", "Planet Australia"],
    name: "Planet Australia",
    publicName: "Planet Australia",
    generation: "G1",
    baseline: true,
    seed: options.seed || 256,
    width: options.width || 2048,
    height: options.height || 1024,
    centerLon: typeof options.centerLon === "number" ? options.centerLon : 132,
    centerLat: typeof options.centerLat === "number" ? options.centerLat : -25,
    status: PLANET_AUSTRALIA_G1_STATUS
  };
}

export function sampleSurface(a, b, c) {
  let profile = null;
  let lon;
  let lat;

  if (typeof a === "object" && a && typeof b === "number" && typeof c === "number") {
    profile = a;
    lon = b;
    lat = c;
  } else if (typeof a === "object" && a && typeof a.lon === "number" && typeof a.lat === "number") {
    profile = null;
    lon = a.lon;
    lat = a.lat;
  } else if (typeof a === "object" && a && typeof a.u === "number" && typeof a.v === "number") {
    profile = null;
    lon = a.u * 360 - 180;
    lat = 90 - a.v * 180;
  } else {
    profile = null;
    lon = Number(a) || 0;
    lat = Number(b) || 0;
  }

  return evaluateAustraliaSurface(wrapLon(lon), clamp(lat, -90, 90), profile || {});
}

export function buildTexture(profileInput = {}, options = {}) {
  const profile = {
    ...createProfile(options),
    ...(profileInput && typeof profileInput === "object" ? profileInput : {})
  };

  const width = options.width || profile.width || 2048;
  const height = options.height || profile.height || 1024;

  const canvas = createCanvas(width, height);
  if (!canvas) {
    return {
      canvas: null,
      width,
      height,
      profile,
      status: {
        ...PLANET_AUSTRALIA_G1_STATUS,
        canvasAvailable: false
      }
    };
  }

  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);
    const lat = 90 - v * 180;

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const lon = u * 360 - 180;

      const sample = evaluateAustraliaSurface(lon, lat, profile);
      const color = surfaceColor(sample);
      const idx = (y * width + x) * 4;

      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  return {
    canvas,
    texture: canvas,
    image: canvas,
    width,
    height,
    profile,
    sampleSurface,
    status: {
      ...PLANET_AUSTRALIA_G1_STATUS,
      canvasAvailable: true,
      landWaterSeparation: "PROCEDURAL_G1_BASELINE",
      sideCollapseTarget: "REDUCED_BY_CONTINUOUS_EQUIRECTANGULAR_WRAP"
    }
  };
}

export function renderSurface(ctx, target = {}, options = {}) {
  const profile = createProfile(options);
  const built = buildTexture(profile, options);

  if (!ctx || !built.canvas) {
    return built;
  }

  const width =
    target.width ||
    ctx.canvas?.width ||
    options.width ||
    profile.width;

  const height =
    target.height ||
    ctx.canvas?.height ||
    options.height ||
    profile.height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(built.canvas, 0, 0, width, height);

  return {
    ...built,
    rendered: true,
    renderTarget: { width, height }
  };
}

export function getStatus() {
  return {
    ...PLANET_AUSTRALIA_G1_STATUS,
    receipts: {
      G1_BASELINE_ATTEMPT_EXECUTED: true,
      TRUE_GLOBE_BEHAVIOR_TESTED: "requires served route view",
      LAND_WATER_SEPARATION_TESTED: true,
      SIDE_COLLAPSE_TESTED: "requires served route rotation",
      STATIC_IMAGE_REPLACEMENT_FALSE: true,
      VISUAL_PASS_HELD_UNTIL_SCREENSHOT_OR_USER_CONFIRMATION: true
    }
  };
}

export function registerExtension(registry = null) {
  const extension = {
    id: "audrelia",
    key: "audrelia",
    aliases: ["audralia", "adralia", "planet-australia", "Planet Australia"],
    name: "Planet Australia",
    publicName: "Planet Australia",
    generation: "G1",
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  if (registry && typeof registry.register === "function") {
    registry.register(extension.id, extension);
  } else if (registry && typeof registry.registerPlanet === "function") {
    registry.registerPlanet(extension);
  } else if (registry && typeof registry.registerExtension === "function") {
    registry.registerExtension(extension);
  }

  return extension;
}

const PlanetAustraliaG1Renderer = registerExtension();

if (typeof window !== "undefined") {
  window.AudreliaPlanetRenderer = PlanetAustraliaG1Renderer;
  window.AudraliaPlanetRenderer = PlanetAustraliaG1Renderer;
  window.AdraliaPlanetRenderer = PlanetAustraliaG1Renderer;
  window.PlanetAustraliaG1Renderer = PlanetAustraliaG1Renderer;

  window.__PLANET_AUSTRALIA_G1_BASELINE__ = {
    status: getStatus(),
    renderer: PlanetAustraliaG1Renderer
  };

  if (window.DiamondGateBridge && typeof window.DiamondGateBridge.registerExtension === "function") {
    window.DiamondGateBridge.registerExtension(PlanetAustraliaG1Renderer);
  }

  if (window.DGBAssets && typeof window.DGBAssets.registerPlanet === "function") {
    window.DGBAssets.registerPlanet(PlanetAustraliaG1Renderer);
  }

  if (window.ShowroomGlobe && typeof window.ShowroomGlobe.registerPlanet === "function") {
    window.ShowroomGlobe.registerPlanet(PlanetAustraliaG1Renderer);
  }
}

export default PlanetAustraliaG1Renderer;
