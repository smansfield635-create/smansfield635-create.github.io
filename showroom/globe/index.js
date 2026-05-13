// /showroom/globe/index.js
// Globe Showcase public 256-cell portrait index.
// H-Earth geography dimension v1: fixed feature counts, deterministic 256-cell assignment,
// public-weight rendering of land bodies, oceans, seas, lakes, shelves, coastline, beaches,
// ridges, valleys, and polar zones.

const MODEL_NAME = "globe-showcase-h-earth-geography-dimension-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 58 : 42;

const DEFAULT_YAW = -0.64;
const DEFAULT_PITCH = -0.24;
const MIN_PITCH = -1.05;
const MAX_PITCH = 0.72;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;

const H_EARTH_GEOGRAPHY = Object.freeze({
  field: {
    latBands: 16,
    lonSectors: 16,
    totalCells: 256
  },
  landBodies: Object.freeze([
    "North Polar Landmass",
    "South Polar Landmass",
    "Western Primary Continent",
    "Eastern Primary Continent",
    "Northern Highland Continent",
    "Southern Shelf Continent",
    "Equatorial Island Chain"
  ]),
  oceans: Object.freeze([
    "West Deep Ocean",
    "East Deep Ocean",
    "Southern Circumpolar Ocean"
  ]),
  seas: Object.freeze([
    "Northwest Sea",
    "North Gate Sea",
    "Northeast Sea",
    "West Shelf Sea",
    "East Shelf Sea",
    "Equatorial Passage Sea",
    "Southwest Sea",
    "Southeast Sea"
  ]),
  lakes: 16,
  coastlineSegments: 64,
  beaches: 32,
  shelves: 32,
  mountainRidges: 16,
  valleyBasins: 16,
  polarCaps: Object.freeze(["North Polar Cap", "South Polar Cap"])
});

const H_EARTH_LAKE_SEATS = Object.freeze([
  [11, 3], [10, 4], [9, 2], [8, 5],
  [11, 11], [10, 12], [8, 10], [7, 13],
  [12, 7], [13, 8], [6, 7], [5, 8],
  [9, 6], [9, 9], [7, 4], [6, 11]
]);

const H_EARTH_RIDGE_SEATS = Object.freeze([
  [11, 2], [10, 3], [9, 4], [8, 5],
  [12, 10], [11, 11], [10, 12], [9, 13],
  [13, 6], [12, 7], [11, 8], [10, 9],
  [4, 4], [5, 5], [4, 11], [5, 10]
]);

const H_EARTH_VALLEY_SEATS = Object.freeze([
  [8, 2], [7, 3], [6, 4], [9, 5],
  [8, 11], [7, 12], [6, 13], [9, 10],
  [11, 6], [10, 7], [9, 8], [8, 9],
  [5, 6], [5, 9], [6, 6], [6, 9]
]);

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    palette: "earth",
    primary: [34, 126, 172],
    secondary: [60, 148, 85],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    palette: "hEarth",
    primary: [62, 142, 92],
    secondary: [42, 132, 142],
    glow: "rgba(143,240,195,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    palette: "audralia",
    primary: [170, 135, 82],
    secondary: [54, 112, 142],
    glow: "rgba(190,170,255,0.22)"
  }
});

const state = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  raf: 0,
  lastFrame: 0,
  visible: true,
  active: true,
  time: 0,
  stars: [],
  worldKey: "hEarth",

  yaw: DEFAULT_YAW,
  pitch: DEFAULT_PITCH,
  targetYaw: DEFAULT_YAW,
  targetPitch: DEFAULT_PITCH,
  velocityYaw: 0,
  velocityPitch: 0,
  interacted: false,

  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  lastPointerTime: 0,
  tapStartTime: 0,
  lastTapAt: 0
};

function $(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  };
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  };
}

function project(p, view) {
  return {
    x: view.cx + p.x * view.scale,
    y: view.cy - p.y * view.scale,
    z: p.z
  };
}

function sizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.round(rect.width));
  const cssHeight = Math.max(480, Math.round(rect.height));

  state.canvas.width = Math.round(cssWidth * DPR);
  state.canvas.height = Math.round(cssHeight * DPR);
  state.canvas.style.width = `${cssWidth}px`;
  state.canvas.style.height = `${cssHeight}px`;

  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", { alpha: false, desynchronized: true });

  createStars(MOBILE ? 58 : 120);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash(index, 1),
    y: hash(index, 2),
    r: 0.45 + hash(index, 3) * 1.9,
    a: 0.10 + hash(index, 4) * 0.36,
    p: hash(index, 5) * Math.PI * 2
  }));
}

function makePoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

function terrainNoise(lat, lon, band, sector, worldKey) {
  const worldShift = worldKey === "earth" ? 0.35 : worldKey === "audralia" ? 1.55 : 0.85;
  const n1 = Math.sin(lon * 2.1 + worldShift + Math.sin(lat * 3.0) * 1.4);
  const n2 = Math.cos(lon * 3.7 - lat * 2.2 - worldShift * 0.7);
  const n3 = Math.sin(lon * 6.0 + band * 0.47 + sector * 0.21 + worldShift);
  const n4 = Math.cos((lon + lat) * 4.1 + sector * 0.37 - worldShift);
  return n1 * 0.38 + n2 * 0.28 + n3 * 0.20 + n4 * 0.14;
}

function seatIndex(seats, band, sector) {
  for (let index = 0; index < seats.length; index += 1) {
    const seat = seats[index];
    if (seat[0] === band && seat[1] === sector) return index;
  }
  return -1;
}

function gaussianDistance(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = Math.atan2(Math.sin(lon - centerLon), Math.cos(lon - centerLon)) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function getOceanName(sector, band) {
  if (band <= 3) return H_EARTH_GEOGRAPHY.oceans[2];
  return sector < 8 ? H_EARTH_GEOGRAPHY.oceans[0] : H_EARTH_GEOGRAPHY.oceans[1];
}

function getSeaName(sector, band) {
  if (band >= 12 && sector < 5) return H_EARTH_GEOGRAPHY.seas[0];
  if (band >= 12 && sector < 11) return H_EARTH_GEOGRAPHY.seas[1];
  if (band >= 12) return H_EARTH_GEOGRAPHY.seas[2];
  if (sector < 4) return H_EARTH_GEOGRAPHY.seas[3];
  if (sector > 11) return H_EARTH_GEOGRAPHY.seas[4];
  if (band >= 6 && band <= 10) return H_EARTH_GEOGRAPHY.seas[5];
  if (sector < 8) return H_EARTH_GEOGRAPHY.seas[6];
  return H_EARTH_GEOGRAPHY.seas[7];
}

function classifyHEarthCell(latMid, lonMid, band, sector) {
  const polar = Math.abs(latMid) / (Math.PI / 2);
  const detail = hash(band, sector, 31);
  const south = latMid < 0;

  const masks = [
    { name: "North Polar Landmass", score: band >= 14 ? 1.15 : gaussianDistance(latMid, lonMid, 1.33, 0.0, 0.28, 3.2) },
    { name: "South Polar Landmass", score: band <= 1 ? 1.15 : gaussianDistance(latMid, lonMid, -1.33, 0.0, 0.28, 3.2) },
    { name: "Western Primary Continent", score: gaussianDistance(latMid, lonMid, 0.16, -2.02, 0.72, 0.92) + gaussianDistance(latMid, lonMid, -0.24, -1.52, 0.52, 0.62) * 0.62 },
    { name: "Eastern Primary Continent", score: gaussianDistance(latMid, lonMid, 0.18, 1.55, 0.76, 0.88) + gaussianDistance(latMid, lonMid, -0.10, 2.25, 0.46, 0.62) * 0.55 },
    { name: "Northern Highland Continent", score: gaussianDistance(latMid, lonMid, 0.76, -0.25, 0.46, 0.96) + gaussianDistance(latMid, lonMid, 0.58, 0.55, 0.34, 0.58) * 0.52 },
    { name: "Southern Shelf Continent", score: gaussianDistance(latMid, lonMid, -0.72, 0.18, 0.44, 1.05) + gaussianDistance(latMid, lonMid, -0.52, -0.55, 0.32, 0.52) * 0.44 },
    { name: "Equatorial Island Chain", score: gaussianDistance(latMid, lonMid, 0.00, -0.60, 0.23, 0.48) + gaussianDistance(latMid, lonMid, 0.08, 0.12, 0.22, 0.42) + gaussianDistance(latMid, lonMid, -0.08, 0.82, 0.24, 0.45) }
  ];

  const winner = masks.reduce((best, item) => item.score > best.score ? item : best, masks[0]);
  const landScore = winner.score + terrainNoise(latMid, lonMid, band, sector, "hEarth") * 0.10;
  const lakeIndex = seatIndex(H_EARTH_LAKE_SEATS, band, sector);
  const ridgeIndex = seatIndex(H_EARTH_RIDGE_SEATS, band, sector);
  const valleyIndex = seatIndex(H_EARTH_VALLEY_SEATS, band, sector);

  const isPolarCap = band === 0 || band === 15;
  const isPolarLand = winner.name === "North Polar Landmass" || winner.name === "South Polar Landmass";
  const isIslandChain = winner.name === "Equatorial Island Chain";
  const islandThreshold = isIslandChain ? 0.52 : 0.42;
  const isLand = isPolarLand || landScore > islandThreshold || lakeIndex >= 0;
  const coastBand = Math.abs(landScore - islandThreshold);
  const isCoast = isLand && !isPolarCap && coastBand < 0.12;
  const isShelf = !isLand && coastBand < 0.17;
  const sea = !isLand && (isShelf || coastBand < 0.25);
  const water = !isLand;
  const beachSegment = isCoast && ((band * 16 + sector) % 2 === 0);

  const elevation = clamp(
    (landScore - islandThreshold) * 1.25 +
    (ridgeIndex >= 0 ? 0.42 : 0) -
    (valleyIndex >= 0 ? 0.22 : 0) +
    (isPolarCap ? 0.10 : 0),
    -0.65,
    0.90
  );

  return {
    geographyModel: "h-earth-dimension-v1",
    elevation,
    polar,
    detail,
    landBody: isLand ? winner.name : null,
    ocean: water && !sea ? getOceanName(sector, band) : null,
    sea: water && sea ? getSeaName(sector, band) : null,
    lake: lakeIndex >= 0 ? `Major Lake ${String(lakeIndex + 1).padStart(2, "0")}` : null,
    coastlineSegment: isCoast ? ((band * 16 + sector) % H_EARTH_GEOGRAPHY.coastlineSegments) + 1 : null,
    beach: beachSegment ? `Beach ${String(((band * 16 + sector) % H_EARTH_GEOGRAPHY.beaches) + 1).padStart(2, "0")}` : null,
    shelf: isShelf ? `Shelf Zone ${String(((band * 16 + sector) % H_EARTH_GEOGRAPHY.shelves) + 1).padStart(2, "0")}` : null,
    ridge: ridgeIndex >= 0 ? `Ridge ${String(ridgeIndex + 1).padStart(2, "0")}` : null,
    valley: valleyIndex >= 0 ? `Valley Basin ${String(valleyIndex + 1).padStart(2, "0")}` : null,
    polarCap: isPolarCap ? (south ? H_EARTH_GEOGRAPHY.polarCaps[1] : H_EARTH_GEOGRAPHY.polarCaps[0]) : null,
    ice: isPolarCap || (polar > 0.86 && isLand),
    coast: isCoast,
    water,
    shelfZone: isShelf,
    seaZone: sea,
    mountain: ridgeIndex >= 0 || (isLand && elevation > 0.45 && detail > 0.35),
    highland: isLand && elevation > 0.24,
    valleyZone: valleyIndex >= 0,
    lakeZone: lakeIndex >= 0,
    dry: isLand && !isCoast && !isPolarCap && elevation > 0.18 && detail > 0.55,
    ridgeField: Math.sin(lonMid * 4.4 + band * 0.51) + Math.cos(latMid * 6.2 - sector * 0.31)
  };
}

function makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey }) {
  const detail = hash(band, sector, worldKey.length);
  const ridgeField = Math.sin(lonMid * 5.2 + band * 0.48) + Math.cos(latMid * 7.4 - sector * 0.29);
  const ridge = elevation > 0.30 && ridgeField > 0.42;
  const valley = elevation > 0.08 && elevation < 0.32 && ridgeField < -0.55;
  const ice = polar > (worldKey === "audralia" ? 0.88 : 0.80);
  const coast = Math.abs(elevation) < 0.13;
  const water = elevation < (worldKey === "audralia" ? 0.03 : -0.05) && !ice;
  const shelf = water && elevation > -0.22;
  const mountain = elevation > 0.48 && !ice;
  const highland = elevation > 0.24 && !ice;
  const dry = elevation > (worldKey === "audralia" ? 0.10 : 0.35) && !ice && !water;

  return {
    geographyModel: `${worldKey}-generic-portrait`,
    elevation,
    ice,
    coast,
    water,
    shelfZone: shelf,
    seaZone: shelf,
    mountain,
    highland,
    dry,
    ridge,
    valley,
    lakeZone: false,
    polar,
    detail,
    ridgeField
  };
}

function sampleCell(latMid, lonMid, band, sector, worldKey) {
  if (worldKey === "hEarth") {
    return classifyHEarthCell(latMid, lonMid, band, sector);
  }

  const polar = Math.abs(latMid) / (Math.PI / 2);
  const noise = terrainNoise(latMid, lonMid, band, sector, worldKey);

  if (worldKey === "audralia") {
    const islandCore =
      Math.sin(lonMid * 1.18 - 0.6) * 0.30 +
      Math.cos(lonMid * 2.25 + latMid * 1.05) * 0.24 +
      Math.sin(latMid * 1.7 - 0.3) * 0.12;
    const elevation = noise * 0.76 + islandCore - 0.19 + polar * 0.04;

    return makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey });
  }

  const continentBias =
    Math.sin(lonMid * 1.55 + 0.4) * 0.24 +
    Math.cos(lonMid * 2.8 - latMid * 1.25) * 0.21 +
    Math.sin(latMid * 2.45) * 0.10;

  const elevation = noise + continentBias - 0.10 + polar * 0.08;
  return makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey });
}

function buildMesh(view) {
  const rings = [];

  for (let latIndex = 0; latIndex <= LAT_BANDS; latIndex += 1) {
    const v = latIndex / LAT_BANDS;
    const lat = -Math.PI / 2 + v * Math.PI;
    rings[latIndex] = [];

    for (let lonIndex = 0; lonIndex <= LON_SECTORS; lonIndex += 1) {
      const u = lonIndex / LON_SECTORS;
      const lon = -Math.PI + u * Math.PI * 2;

      const base = makePoint(lat, lon);
      let rotated = rotateY(base, view.yaw);
      rotated = rotateX(rotated, view.pitch);

      rings[latIndex][lonIndex] = {
        local: base,
        world: rotated,
        screen: project(rotated, view),
        lat,
        lon
      };
    }
  }

  return rings;
}

function createCells(mesh, worldKey) {
  const cells = [];
  const lightAngle = state.time * 0.00042;

  const light = normalize({
    x: Math.cos(lightAngle) * 0.72,
    y: 0.54,
    z: Math.sin(lightAngle) * 0.72 + 0.28
  });

  const rimLight = normalize({ x: -0.52, y: 0.28, z: 0.86 });
  const viewDir = normalize({ x: 0, y: 0, z: 1 });

  for (let band = 0; band < LAT_BANDS; band += 1) {
    for (let sector = 0; sector < LON_SECTORS; sector += 1) {
      const p00 = mesh[band][sector];
      const p01 = mesh[band][sector + 1];
      const p11 = mesh[band + 1][sector + 1];
      const p10 = mesh[band + 1][sector];

      const avgWorld = normalize({
        x: (p00.world.x + p01.world.x + p11.world.x + p10.world.x) / 4,
        y: (p00.world.y + p01.world.y + p11.world.y + p10.world.y) / 4,
        z: (p00.world.z + p01.world.z + p11.world.z + p10.world.z) / 4
      });

      if (avgWorld.z < -0.06) continue;

      const latMid = (p00.lat + p10.lat) / 2;
      const lonMid = (p00.lon + p01.lon) / 2;
      const terrain = sampleCell(latMid, lonMid, band, sector, worldKey);

      const e1 = subtract(p01.world, p00.world);
      const e2 = subtract(p10.world, p00.world);
      const faceNormal = normalize(cross(e1, e2));
      const normal = dot(faceNormal, avgWorld) < 0
        ? { x: -faceNormal.x, y: -faceNormal.y, z: -faceNormal.z }
        : faceNormal;

      const diffuse = clamp(dot(avgWorld, light), 0, 1);
      const rim = Math.pow(clamp(1 - Math.abs(dot(avgWorld, viewDir)), 0, 1), 2.2);
      const secondary = clamp(dot(avgWorld, rimLight), 0, 1);

      cells.push({
        points: [p00.screen, p01.screen, p11.screen, p10.screen],
        depth: avgWorld.z,
        band,
        sector,
        terrain,
        diffuse,
        rim,
        secondary,
        normal,
        worldKey
      });
    }
  }

  return cells.sort((a, b) => a.depth - b.depth);
}

function colorForCell(cell) {
  const t = cell.terrain;
  const world = WORLDS[cell.worldKey];
  const light = 0.33 + cell.diffuse * 0.54 + cell.secondary * 0.10 + cell.rim * 0.20;

  let r;
  let g;
  let b;

  if (cell.worldKey === "hEarth") {
    if (t.ice || t.polarCap) {
      r = 182; g = 220; b = 238;
    } else if (t.lakeZone) {
      r = 28; g = 128; b = 154;
    } else if (t.water) {
      if (t.shelfZone) {
        r = 62; g = 154; b = 168;
      } else if (t.seaZone) {
        r = 24; g = 96; b = 146;
      } else {
        r = 8; g = 38; b = 104;
      }
    } else if (t.beach) {
      r = 218; g = 194; b = 122;
    } else if (t.coast) {
      r = 190; g = 168; b = 108;
    } else if (t.mountain) {
      r = 142; g = 132; b = 122;
    } else if (t.highland) {
      r = 72; g = 144; b = 82;
    } else if (t.valleyZone) {
      r = 42; g = 128; b = 78;
    } else if (t.dry) {
      r = 156; g = 132; b = 84;
    } else {
      r = 50; g = 136; b = 84;
    }
  } else if (t.ice) {
    r = 170; g = 213; b = 238;
  } else if (t.water) {
    if (t.shelfZone) {
      r = world.secondary[0] + 18;
      g = world.secondary[1] + 38;
      b = world.secondary[2] + 30;
    } else {
      r = Math.max(4, world.secondary[0] * 0.18);
      g = Math.max(22, world.secondary[1] * 0.32);
      b = Math.max(72, world.secondary[2] * 0.76);
    }
  } else if (t.coast) {
    r = 186; g = 168; b = 101;
  } else if (t.mountain) {
    r = 150; g = 136; b = 118;
  } else if (t.highland) {
    r = world.primary[0] + 24;
    g = world.primary[1] + 14;
    b = world.primary[2] - 2;
  } else if (t.valley) {
    r = Math.max(24, world.primary[0] - 12);
    g = world.primary[1] + 20;
    b = Math.max(44, world.primary[2] - 18);
  } else if (t.dry) {
    r = 156; g = 128; b = 82;
  } else {
    r = world.primary[0];
    g = world.primary[1];
    b = world.primary[2];
  }

  const elevationWarmth = clamp(t.elevation, -0.5, 0.65);
  const detailShift = (t.detail - 0.5) * (cell.worldKey === "hEarth" ? 20 : 14);

  r += elevationWarmth * 22 + detailShift;
  g += elevationWarmth * 10 + detailShift * 0.35;
  b += t.water ? 18 : -elevationWarmth * 7 - detailShift * 0.22;

  r = Math.round(clamp(r * light, 0, 255));
  g = Math.round(clamp(g * light, 0, 255));
  b = Math.round(clamp(b * light, 0, 255));

  const alpha = clamp(0.79 + cell.diffuse * 0.15 + cell.rim * 0.06, 0.73, 0.98);

  return `rgba(${r},${g},${b},${alpha})`;
}

function drawBackground(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  const bg = ctx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.82);
  bg.addColorStop(0, "#13264a");
  bg.addColorStop(0.30, "#091832");
  bg.addColorStop(0.68, "#041021");
  bg.addColorStop(1, "#01040c");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(width * 0.5, height * 0.49, 0, width * 0.5, height * 0.49, width * 0.39);
  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.34, height * 0.31, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.20, width * 0.5, height * 0.5, width * 0.74);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.48)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const star of state.stars) {
    const pulse = REDUCED_MOTION ? 0.55 : 0.55 + Math.sin(state.time * 0.001 + star.p) * 0.45;
    const alpha = star.a * pulse;
    const x = star.x * width;
    const y = star.y * height;
    const radius = star.r * DPR;

    ctx.fillStyle = `rgba(235,242,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.r > 1.35) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.44})`;
      ctx.lineWidth = Math.max(0.6, DPR * 0.55);
      ctx.beginPath();
      ctx.moveTo(x - 3.2 * DPR, y);
      ctx.lineTo(x + 3.2 * DPR, y);
      ctx.moveTo(x, y - 3.2 * DPR);
      ctx.lineTo(x, y + 3.2 * DPR);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function pathCell(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.lineTo(points[3].x, points[3].y);
  ctx.closePath();
}

function drawCellDetail(ctx, cell) {
  const t = cell.terrain;
  const pts = cell.points;
  const depthAlpha = clamp(0.25 + cell.depth * 0.65, 0.12, 0.86);

  ctx.save();
  pathCell(ctx, pts);
  ctx.clip();

  const midLeft = {
    x: (pts[0].x + pts[3].x) / 2,
    y: (pts[0].y + pts[3].y) / 2
  };
  const midRight = {
    x: (pts[1].x + pts[2].x) / 2,
    y: (pts[1].y + pts[2].y) / 2
  };
  const topMid = {
    x: (pts[0].x + pts[1].x) / 2,
    y: (pts[0].y + pts[1].y) / 2
  };
  const bottomMid = {
    x: (pts[2].x + pts[3].x) / 2,
    y: (pts[2].y + pts[3].y) / 2
  };

  if (cell.worldKey === "hEarth") {
    if (t.coastlineSegment || t.shelfZone || t.lakeZone || t.beach) {
      ctx.strokeStyle = `rgba(226,238,210,${0.18 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.8, DPR * 0.75);
      ctx.beginPath();
      ctx.moveTo(midLeft.x, midLeft.y);
      ctx.bezierCurveTo(topMid.x, topMid.y, bottomMid.x, bottomMid.y, midRight.x, midRight.y);
      ctx.stroke();
    }

    if (t.beach) {
      ctx.strokeStyle = `rgba(255,232,163,${0.22 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.7, DPR * 0.68);
      ctx.beginPath();
      ctx.moveTo(pts[0].x * 0.62 + pts[3].x * 0.38, pts[0].y * 0.62 + pts[3].y * 0.38);
      ctx.lineTo(pts[1].x * 0.62 + pts[2].x * 0.38, pts[1].y * 0.62 + pts[2].y * 0.38);
      ctx.stroke();
    }

    if (t.ridge || t.mountain) {
      ctx.strokeStyle = `rgba(236,230,207,${0.25 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.65, DPR * 0.62);
      ctx.beginPath();
      ctx.moveTo(pts[3].x * 0.55 + pts[0].x * 0.45, pts[3].y * 0.55 + pts[0].y * 0.45);
      ctx.lineTo(pts[1].x * 0.64 + pts[2].x * 0.36, pts[1].y * 0.64 + pts[2].y * 0.36);
      ctx.moveTo(pts[0].x * 0.58 + pts[1].x * 0.42, pts[0].y * 0.58 + pts[1].y * 0.42);
      ctx.lineTo(pts[3].x * 0.36 + pts[2].x * 0.64, pts[3].y * 0.36 + pts[2].y * 0.64);
      ctx.stroke();
    }

    if (t.valley || t.valleyZone) {
      ctx.strokeStyle = `rgba(20,70,55,${0.24 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.7, DPR * 0.66);
      ctx.beginPath();
      ctx.moveTo(topMid.x, topMid.y);
      ctx.bezierCurveTo(pts[0].x, pts[0].y, pts[2].x, pts[2].y, bottomMid.x, bottomMid.y);
      ctx.stroke();
    }

    if (t.water && !t.shelfZone) {
      ctx.strokeStyle = `rgba(120,194,228,${0.11 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.5, DPR * 0.50);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y * 0.64 + pts[3].y * 0.36);
      ctx.lineTo(pts[1].x, pts[1].y * 0.64 + pts[2].y * 0.36);
      ctx.moveTo(pts[0].x * 0.42 + pts[3].x * 0.58, pts[0].y * 0.42 + pts[3].y * 0.58);
      ctx.lineTo(pts[1].x * 0.42 + pts[2].x * 0.58, pts[1].y * 0.42 + pts[2].y * 0.58);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.34, height * 0.37);

  const view = {
    cx: width * 0.50,
    cy: height * 0.49,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawPlanetShadow(ctx, view);

  const mesh = buildMesh(view);
  const cells = createCells(mesh, state.worldKey);

  ctx.save();

  for (const cell of cells) {
    pathCell(ctx, cell.points);
    ctx.fillStyle = colorForCell(cell);
    ctx.fill();

    const gridAlpha = cell.worldKey === "hEarth" ? 0.062 : 0.040;
    ctx.strokeStyle = `rgba(230,244,255,${gridAlpha + cell.rim * 0.12})`;
    ctx.lineWidth = Math.max(0.35, DPR * 0.38);
    ctx.stroke();

    drawCellDetail(ctx, cell);
  }

  ctx.restore();

  drawLatLongDefinition(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.portraitCellCount = String(CELL_COUNT);
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.hEarthGeography = state.worldKey === "hEarth" ? "dimension-v1" : "inactive";
}

function drawLatLongDefinition(ctx, view) {
  if (state.worldKey !== "hEarth") return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(210,238,255,0.075)";
  ctx.lineWidth = Math.max(0.5, DPR * 0.55);

  for (let i = 1; i < 4; i += 1) {
    const w = view.scale * (0.36 + i * 0.18);
    const h = view.scale * (0.94 - i * 0.08);
    ctx.beginPath();
    ctx.ellipse(view.cx, view.cy, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      view.cx,
      view.cy + i * view.scale * 0.18,
      view.scale * Math.sqrt(Math.max(0.18, 1 - Math.abs(i) * 0.16)),
      view.scale * 0.18,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const y = view.cy + view.scale * 1.05;
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.66);
  glow.addColorStop(0, world.glow);
  glow.addColorStop(0.38, "rgba(80,120,180,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.58, view.scale * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(view.cx, view.cy, view.scale * 0.76, view.cx, view.cy, view.scale * 1.12);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.72, "rgba(142,190,255,0.10)");
  outer.addColorStop(1, world.glow);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(210,240,255,0.24)";
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.005, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.10)";
  ctx.lineWidth = Math.max(0.7, DPR * 0.75);

  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.34, view.scale * 0.53, 0.28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawWorldTitle(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(244,191,96,0.92)";
  ctx.font = `950 ${Math.max(18 * DPR, width * 0.038)}px Inter, system-ui, sans-serif`;
  ctx.fillText(world.title, width * 0.5, height * 0.165);

  ctx.fillStyle = "rgba(186,197,212,0.72)";
  ctx.font = `850 ${Math.max(11 * DPR, width * 0.014)}px Inter, system-ui, sans-serif`;
  ctx.fillText(`${world.subtitle} · 256-cell public portrait`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Select a world · Open room for private engine", width * 0.5, height * 0.90);
  ctx.restore();
}

function render() {
  const ctx = state.ctx;
  if (!ctx) return;

  drawBackground(ctx, state.width, state.height);
  drawPlanet(ctx, state.width, state.height);
}

function updateInspectionMotion() {
  if (!state.dragging) {
    if (!state.interacted && !REDUCED_MOTION) {
      state.targetYaw += 0.0010;
    }

    state.targetYaw += state.velocityYaw;
    state.targetPitch = clamp(state.targetPitch + state.velocityPitch, MIN_PITCH, MAX_PITCH);

    state.velocityYaw *= 0.925;
    state.velocityPitch *= 0.905;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
  }

  state.yaw += (state.targetYaw - state.yaw) * 0.22;
  state.pitch += (state.targetPitch - state.pitch) * 0.22;
  state.pitch = clamp(state.pitch, MIN_PITCH, MAX_PITCH);
}

function frame(now) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  if (!state.lastFrame || now - state.lastFrame >= FRAME_MS) {
    state.lastFrame = now;
    state.time = now;
    updateInspectionMotion();
    render();
  }

  state.raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (state.raf) return;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (!state.raf) return;
  window.cancelAnimationFrame(state.raf);
  state.raf = 0;
}

function resetInspection() {
  state.targetYaw = DEFAULT_YAW;
  state.targetPitch = DEFAULT_PITCH;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.interacted = false;
}

function setWorld(worldKey) {
  if (!WORLDS[worldKey]) return;

  state.worldKey = worldKey;
  resetInspection();
  updateControls();
  render();
}

function updateControls() {
  const world = WORLDS[state.worldKey];

  document.querySelectorAll("[data-world]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.world === state.worldKey));
  });

  const link = $("activeWorldLink");
  if (link) {
    link.href = world.route;
    link.textContent = `Open ${world.title}`;
  }
}

function installWorldControls() {
  document.querySelectorAll("[data-world]").forEach((button) => {
    button.addEventListener("click", () => {
      setWorld(button.dataset.world);
    });
  });
}

function installPointerInspection() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.style.touchAction = "none";

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = performance.now();
    state.tapStartTime = performance.now();
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.interacted = true;

    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const dt = Math.max(12, now - state.lastPointerTime);
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    const yawDelta = dx * 0.0085;
    const pitchDelta = dy * 0.0065;

    state.targetYaw += yawDelta;
    state.targetPitch = clamp(state.targetPitch + pitchDelta, MIN_PITCH, MAX_PITCH);

    state.velocityYaw = clamp((yawDelta / dt) * 18, -0.045, 0.045);
    state.velocityPitch = clamp((pitchDelta / dt) * 14, -0.030, 0.030);

    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = now;

    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const travel = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
    const tapDuration = now - state.tapStartTime;
    const isTap = travel < 10 && tapDuration < 260;
    const isDoubleTap = isTap && now - state.lastTapAt < 340;

    if (isDoubleTap) {
      resetInspection();
      state.lastTapAt = 0;
    } else if (isTap) {
      state.lastTapAt = now;
    }

    state.dragging = false;
    state.pointerId = null;

    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.16 : 0.075;

    if (event.key === "ArrowLeft") {
      state.interacted = true;
      state.targetYaw -= step;
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      state.interacted = true;
      state.targetYaw += step;
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch + step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch - step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "Home" || event.key === "0") {
      resetInspection();
      event.preventDefault();
    }
  });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";
    if (state.active) startLoop();
    else stopLoop();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.canvas) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;
      if (state.visible) startLoop();
      else stopLoop();
    }, { threshold: 0.05 });

    observer.observe(state.canvas);
  }
}

function installResize() {
  let timer = 0;

  window.addEventListener("resize", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      sizeCanvas();
      render();
    }, 120);
  }, { passive: true });
}

function boot() {
  state.canvas = $("globeShowcaseCanvas");
  if (!state.canvas) return;

  sizeCanvas();
  installWorldControls();
  installPointerInspection();
  installVisibility();
  installResize();
  updateControls();
  render();
  startLoop();

  window.DGBGlobeShowcase = {
    model: MODEL_NAME,
    cellCount: CELL_COUNT,
    latBands: LAT_BANDS,
    lonSectors: LON_SECTORS,
    privateEnginesAsleep: true,
    fixedStructure: true,
    inspectable: true,
    generatedImage: false,
    graphicBox: false,
    hEarthGeography: H_EARTH_GEOGRAPHY,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        cellCount: CELL_COUNT,
        latBands: LAT_BANDS,
        lonSectors: LON_SECTORS,
        privateEnginesAsleep: true,
        fixedStructure: true,
        inspectable: true,
        hEarthGeography: state.worldKey === "hEarth" ? "dimension-v1" : "inactive",
        hEarthCounts: H_EARTH_GEOGRAPHY,
        yaw: state.yaw,
        pitch: state.pitch
      };
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export default {
  model: MODEL_NAME,
  cellCount: CELL_COUNT,
  privateEnginesAsleep: true,
  inspectable: true,
  hEarthGeography: H_EARTH_GEOGRAPHY
};
