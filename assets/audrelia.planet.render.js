/* ==========================================================================
   PLANET_AUSTRALIA_G1_COASTAL_TERRAIN_CLASSIFICATION_TNT_v1
   Path: /assets/audrelia.planet.render.js
   Purpose:
   Renew Planet Australia / Audralia G1 terrain so coast does not default
   to beach. Coast is now classified by geology, slope, exposure, shelf,
   moisture, drainage, reef proximity, and regional pressure.
   ========================================================================== */

const PLANET_AUSTRALIA_G1_TERRAIN_STATUS = Object.freeze({
  id: "audrelia",
  publicName: "Planet Australia",
  generation: "G1_TERRAIN_MAPPING",
  contract: "PLANET_AUSTRALIA_G1_TERRAIN_MAPPING_BINDING_v1",
  tnt: "PLANET_AUSTRALIA_G1_COASTAL_TERRAIN_CLASSIFICATION_TNT_v1",
  staticImageReplacement: false,
  imageGeneration: false,
  graphicBox: false,
  visualPass: "HELD_UNTIL_USER_CONFIRMATION",
  terrainIntent: "COAST_IS_NOT_BEACH_BY_DEFAULT"
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

function addGrain(color, amount) {
  return makeRgb(
    color.r + amount,
    color.g + amount * 0.92,
    color.b + amount * 0.78
  );
}

const PALETTE = Object.freeze({
  deepOcean: makeRgb(4, 13, 32),
  ocean: makeRgb(6, 32, 70),
  blueWater: makeRgb(10, 66, 116),
  shelf: makeRgb(30, 112, 143),
  reef: makeRgb(72, 160, 154),
  surfFoam: makeRgb(148, 184, 174),

  sand: makeRgb(190, 166, 104),
  paleSand: makeRgb(212, 193, 136),
  mudflat: makeRgb(114, 99, 74),
  marsh: makeRgb(61, 101, 67),
  mangrove: makeRgb(34, 82, 58),

  rock: makeRgb(91, 86, 77),
  darkRock: makeRgb(54, 58, 61),
  cliff: makeRgb(118, 108, 91),
  redStone: makeRgb(132, 70, 44),

  dryInterior: makeRgb(157, 91, 49),
  redDesert: makeRgb(122, 61, 41),
  scrub: makeRgb(113, 118, 67),
  grassland: makeRgb(83, 126, 70),
  greenCoast: makeRgb(46, 108, 68),
  forest: makeRgb(31, 82, 57),

  highland: makeRgb(112, 105, 84),
  mountain: makeRgb(148, 141, 121),
  snow: makeRgb(229, 235, 232),
  ice: makeRgb(188, 220, 230)
});

function baseLandScore(lon, lat) {
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

  return land;
}

function terrainSlope(lon, lat) {
  const dLon = 0.75;
  const dLat = 0.75;

  const center = baseLandScore(lon, lat);
  const east = baseLandScore(wrapLon(lon + dLon), lat);
  const west = baseLandScore(wrapLon(lon - dLon), lat);
  const north = baseLandScore(lon, clamp(lat + dLat, -90, 90));
  const south = baseLandScore(lon, clamp(lat - dLat, -90, 90));

  const dx = Math.abs(east - west);
  const dy = Math.abs(north - south);
  const edge = Math.abs(center);

  return clamp((dx + dy) * 3.2 + smoothstep(0.08, 0.0, edge) * 0.22);
}

function drainageSignal(lon, lat) {
  const eastDrain = ridge(lon, lat, 147, -25, 25, 1.5, -8);
  const northDrain = ridge(lon, lat, 134, -17, 21, 1.7, 12);
  const southDrain = ridge(lon, lat, 138, -35, 18, 1.6, -20);
  const westDrain = ridge(lon, lat, 114, -24, 22, 1.4, 16);
  const basinDrain = ridge(lon, lat, 127, -29, 28, 1.8, -5);

  return clamp(Math.max(eastDrain, northDrain, southDrain, westDrain, basinDrain));
}

function protectedBaySignal(lon, lat) {
  const gulf = Math.max(rotatedEllipse(lon, lat, 136, -15, 17, 10, 5), 0);
  const southBite = Math.max(rotatedEllipse(lon, lat, 128, -38, 31, 8, 0), 0);
  const eastBite = Math.max(rotatedEllipse(lon, lat, 154, -28, 11, 17, -10), 0);
  const westBay = Math.max(rotatedEllipse(lon, lat, 108, -18, 12, 10, -20), 0);

  return clamp(Math.max(gulf, southBite * 0.75, eastBite * 0.66, westBay * 0.72));
}

function regionSignals(lon, lat) {
  const north = smoothstep(-28, -9, lat);
  const south = smoothstep(-29, -45, lat);
  const east = smoothstep(132, 156, lon);
  const west = smoothstep(126, 94, lon);
  const center = Math.max(rotatedEllipse(lon, lat, 126, -26, 27, 17, -6), 0);

  return {
    north: clamp(north),
    south: clamp(south),
    east: clamp(east),
    west: clamp(west),
    center: clamp(center)
  };
}

function evaluateAustraliaSurface(lon, lat, profile = {}) {
  const nx = lon / 180;
  const ny = lat / 90;

  const land = baseLandScore(lon, lat);
  const isLand = land > 0.0;

  const reefChain = ridge(lon, lat, 153, -17, 29, 2.8, -11);
  const easternRange =
    ridge(lon, lat, 149, -28, 34, 4.2, -7) * 0.88 +
    ridge(lon, lat, 145, -35, 17, 3.5, -15) * 0.58;

  const westernShield = ridge(lon, lat, 112, -25, 28, 9, 18) * 0.37;
  const centralBasin = Math.max(rotatedEllipse(lon, lat, 126, -26, 27, 17, -6), 0);
  const slope = terrainSlope(lon, lat);
  const drainage = drainageSignal(lon, lat);
  const protectedBay = protectedBaySignal(lon, lat);
  const regions = regionSignals(lon, lat);

  const polarIce = smoothstep(58, 78, Math.abs(lat));
  const shelf = smoothstep(-0.22, 0.0, land) * (1 - smoothstep(-0.045, 0.08, land));
  const reef = Math.max(reefChain, 0) * smoothstep(-0.18, 0.05, land);

  let elevation = 0;
  if (isLand) {
    elevation =
      0.19 +
      smoothstep(0.0, 0.45, land) * 0.25 +
      easternRange * 0.37 +
      westernShield * 0.22 -
      centralBasin * 0.13 +
      (fbm(nx * 11.0, ny * 10.0, 5) - 0.5) * 0.13;

    elevation = clamp(elevation);
  }

  const waterDepth = isLand
    ? 0
    : clamp(0.18 + smoothstep(-0.02, -0.72, land) * 0.82 + polarIce * 0.08);

  const moisture = clamp(
    0.26 +
      easternRange * 0.39 +
      reefChain * 0.13 +
      protectedBay * 0.18 +
      drainage * 0.19 +
      regions.north * 0.16 -
      centralBasin * 0.30 -
      regions.west * 0.12 +
      (fbm(nx * 6.4 + 30.0, ny * 5.7 - 4.0, 4) - 0.5) * 0.21
  );

  const aridity = clamp(
    0.54 +
      centralBasin * 0.33 +
      regions.west * 0.22 +
      regions.south * 0.07 -
      moisture * 0.36 +
      smoothstep(18, 39, Math.abs(lat)) * 0.10
  );

  const coastalProximity = isLand
    ? smoothstep(0.18, 0.0, land)
    : smoothstep(-0.24, 0.0, land);

  const rockHardness = clamp(
    0.28 +
      westernShield * 1.1 +
      easternRange * 0.72 +
      regions.west * 0.28 +
      regions.south * 0.20 +
      slope * 0.55 +
      (fbm(nx * 15.0 - 4.0, ny * 13.0 + 9.0, 4) - 0.5) * 0.20
  );

  const waveExposure = clamp(
    0.34 +
      regions.west * 0.32 +
      regions.south * 0.36 +
      regions.east * 0.18 -
      protectedBay * 0.42 +
      slope * 0.22
  );

  const sediment = clamp(
    0.34 +
      drainage * 0.31 +
      protectedBay * 0.18 +
      shelf * 0.22 -
      rockHardness * 0.28 -
      slope * 0.16
  );

  const deltaPotential = clamp(drainage * coastalProximity * (0.55 + protectedBay * 0.35));
  const marshPotential = clamp(coastalProximity * moisture * protectedBay * (1 - slope) * 1.6);
  const mangrovePotential = clamp(marshPotential * regions.north * 1.45);
  const cliffPotential = clamp(coastalProximity * (slope * 0.72 + elevation * 0.33 + waveExposure * 0.25 + rockHardness * 0.22));
  const rockyPotential = clamp(coastalProximity * (rockHardness * 0.72 + waveExposure * 0.25 + slope * 0.20));
  const sandPotential = clamp(coastalProximity * sediment * (1 - cliffPotential * 0.78) * (1 - rockHardness * 0.36));
  const reefPotential = clamp((reef + shelf * 0.35) * regions.east * (1 - waterDepth * 0.3));

  let coastClass = "none";
  if (coastalProximity > 0.18) {
    if (deltaPotential > 0.56) {
      coastClass = "delta_mouth";
    } else if (mangrovePotential > 0.42) {
      coastClass = "mangrove_edge";
    } else if (marshPotential > 0.36) {
      coastClass = "marsh_mudflat";
    } else if (cliffPotential > 0.62) {
      coastClass = "cliff_coast";
    } else if (rockyPotential > 0.55) {
      coastClass = "rocky_beach";
    } else if (reefPotential > 0.30) {
      coastClass = "reef_limestone_shore";
    } else if (sandPotential > 0.36) {
      coastClass = "sandy_beach";
    } else {
      coastClass = waveExposure > 0.52 ? "eroded_headland" : "mixed_shore";
    }
  }

  let biome = "ocean";
  if (!isLand && polarIce > 0.35) biome = "polar_ocean";
  if (!isLand && shelf > 0.1) biome = "continental_shelf";
  if (!isLand && reefPotential > 0.28) biome = "reef_shelf";
  if (!isLand && deltaPotential > 0.32) biome = "delta_plume";

  if (isLand && coastalProximity > 0.18) biome = coastClass;
  if (isLand && coastalProximity <= 0.18) biome = "dry_continent";
  if (isLand && coastalProximity <= 0.18 && moisture > 0.43) biome = "scrub_grassland";
  if (isLand && coastalProximity <= 0.18 && moisture > 0.58) biome = "green_belt";
  if (isLand && moisture > 0.72 && elevation > 0.36) biome = "forest_highland";
  if (isLand && elevation > 0.62) biome = "mountain";
  if (isLand && elevation > 0.77 && (regions.south > 0.42 || lat < -34)) biome = "snow_cap";

  return {
    lon,
    lat,
    landScore: land,
    isLand,
    shelf,
    reef,
    reefPotential,
    elevation,
    waterDepth,
    moisture,
    aridity,
    polarIce,
    slope,
    drainage,
    protectedBay,
    coastalProximity,
    rockHardness,
    waveExposure,
    sediment,
    deltaPotential,
    marshPotential,
    mangrovePotential,
    cliffPotential,
    rockyPotential,
    sandPotential,
    coastClass,
    biome,
    regions
  };
}

function surfaceColor(sample) {
  const n = fbm(sample.lon * 0.08 + 17, sample.lat * 0.08 - 21, 4);
  const fine = fbm(sample.lon * 0.26 - 5, sample.lat * 0.22 + 12, 4);
  const grain = (n - 0.5) * 18 + (fine - 0.5) * 7;

  if (!sample.isLand) {
    let c = colorMix(PALETTE.deepOcean, PALETTE.ocean, clamp(1 - sample.waterDepth));
    c = colorMix(c, PALETTE.blueWater, sample.shelf * 0.72);
    c = colorMix(c, PALETTE.shelf, sample.shelf * 0.54);
    c = colorMix(c, PALETTE.reef, sample.reefPotential * 0.82);
    c = colorMix(c, PALETTE.mudflat, sample.deltaPotential * 0.28);
    c = colorMix(c, PALETTE.ice, sample.polarIce * 0.70);
    return addGrain(c, grain * 0.22);
  }

  let c = colorMix(PALETTE.redDesert, PALETTE.dryInterior, sample.aridity);
  c = colorMix(c, PALETTE.scrub, clamp(sample.moisture * 0.52));
  c = colorMix(c, PALETTE.grassland, clamp((sample.moisture - 0.32) * 1.05));
  c = colorMix(c, PALETTE.greenCoast, clamp((sample.moisture - 0.50) * 1.35));
  c = colorMix(c, PALETTE.forest, clamp((sample.moisture - 0.68) * 1.8));
  c = colorMix(c, PALETTE.highland, clamp((sample.elevation - 0.47) * 1.5));
  c = colorMix(c, PALETTE.mountain, clamp((sample.elevation - 0.63) * 1.8));
  c = colorMix(c, PALETTE.snow, clamp((sample.elevation - 0.77) * 2.3));

  if (sample.coastalProximity > 0.18) {
    switch (sample.coastClass) {
      case "sandy_beach":
        c = colorMix(c, PALETTE.sand, 0.74);
        c = colorMix(c, PALETTE.paleSand, sample.sediment * 0.26);
        break;

      case "rocky_beach":
        c = colorMix(c, PALETTE.rock, 0.72);
        c = colorMix(c, PALETTE.darkRock, sample.waveExposure * 0.30);
        break;

      case "cliff_coast":
        c = colorMix(c, PALETTE.cliff, 0.70);
        c = colorMix(c, PALETTE.darkRock, sample.slope * 0.42);
        break;

      case "reef_limestone_shore":
        c = colorMix(c, PALETTE.rock, 0.38);
        c = colorMix(c, PALETTE.reef, 0.33);
        break;

      case "mangrove_edge":
        c = colorMix(c, PALETTE.mangrove, 0.78);
        break;

      case "marsh_mudflat":
        c = colorMix(c, PALETTE.marsh, 0.46);
        c = colorMix(c, PALETTE.mudflat, 0.34);
        break;

      case "delta_mouth":
        c = colorMix(c, PALETTE.mudflat, 0.50);
        c = colorMix(c, PALETTE.greenCoast, sample.moisture * 0.32);
        break;

      case "eroded_headland":
        c = colorMix(c, PALETTE.redStone, 0.36);
        c = colorMix(c, PALETTE.darkRock, 0.34);
        break;

      case "mixed_shore":
      default:
        c = colorMix(c, PALETTE.rock, 0.32);
        c = colorMix(c, PALETTE.sand, sample.sediment * 0.22);
        break;
    }
  }

  return addGrain(c, grain * 0.28);
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
    terrainMapping: true,
    seed: options.seed || 256,
    width: options.width || 2048,
    height: options.height || 1024,
    centerLon: typeof options.centerLon === "number" ? options.centerLon : 132,
    centerLat: typeof options.centerLat === "number" ? options.centerLat : -25,
    status: PLANET_AUSTRALIA_G1_TERRAIN_STATUS
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
        ...PLANET_AUSTRALIA_G1_TERRAIN_STATUS,
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
      ...PLANET_AUSTRALIA_G1_TERRAIN_STATUS,
      canvasAvailable: true,
      landWaterSeparation: "ACTIVE",
      coastalClassifier: "ACTIVE",
      uniformBeachRule: "REMOVED",
      terrainClasses: [
        "deep_ocean",
        "continental_shelf",
        "reef_shelf",
        "sandy_beach",
        "rocky_beach",
        "cliff_coast",
        "eroded_headland",
        "mangrove_edge",
        "marsh_mudflat",
        "delta_mouth",
        "dry_interior",
        "scrub_grassland",
        "green_belt",
        "forest_highland",
        "mountain",
        "snow_cap"
      ]
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
    ...PLANET_AUSTRALIA_G1_TERRAIN_STATUS,
    receipts: {
      G1_TERRAIN_MAPPING_EXECUTED: true,
      COAST_IS_NOT_BEACH_BY_DEFAULT: true,
      COASTAL_CLASSIFICATION_ACTIVE: true,
      CLIFF_COAST_ENABLED: true,
      ROCKY_BEACH_ENABLED: true,
      SANDY_BEACH_LIMITED_TO_CONDITIONS: true,
      REEF_SHELF_ENABLED: true,
      MANGROVE_AND_MARSH_ENABLED: true,
      DELTA_MOUTH_ENABLED: true,
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

const PlanetAustraliaG1TerrainRenderer = registerExtension();

if (typeof window !== "undefined") {
  window.AudreliaPlanetRenderer = PlanetAustraliaG1TerrainRenderer;
  window.AudraliaPlanetRenderer = PlanetAustraliaG1TerrainRenderer;
  window.AdraliaPlanetRenderer = PlanetAustraliaG1TerrainRenderer;
  window.PlanetAustraliaG1Renderer = PlanetAustraliaG1TerrainRenderer;
  window.PlanetAustraliaG1TerrainRenderer = PlanetAustraliaG1TerrainRenderer;

  window.__PLANET_AUSTRALIA_G1_TERRAIN_MAPPING__ = {
    status: getStatus(),
    renderer: PlanetAustraliaG1TerrainRenderer
  };

  if (window.DiamondGateBridge && typeof window.DiamondGateBridge.registerExtension === "function") {
    window.DiamondGateBridge.registerExtension(PlanetAustraliaG1TerrainRenderer);
  }

  if (window.DGBAssets && typeof window.DGBAssets.registerPlanet === "function") {
    window.DGBAssets.registerPlanet(PlanetAustraliaG1TerrainRenderer);
  }

  if (window.ShowroomGlobe && typeof window.ShowroomGlobe.registerPlanet === "function") {
    window.ShowroomGlobe.registerPlanet(PlanetAustraliaG1TerrainRenderer);
  }
}

export default PlanetAustraliaG1TerrainRenderer;
