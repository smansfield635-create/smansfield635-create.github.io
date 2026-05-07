/* /assets/audralia/audralia/tectonics/topology/terrain.render.js */
/* AUDRALIA_TERRAIN_RELIEF_AUTHORITY */
/* TNT: AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v1 */

const RECEIPT = "AUDRALIA_TERRAIN_RELIEF_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v1";
const VERSION = "2026-05-06.terrain-4k-relief-detail-v1";

const TERRAIN_AUTHORITY = Object.freeze({
  name: "Audralia Terrain Relief Authority",
  planet: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  lineage: "tectonics -> topology -> terrain",
  role: "above-sea-level-relief-expression",
  precinct: "terrain-height-mineral-relief-glacier-slope-and-surface-detail",
  jurisdiction: [
    "elevation",
    "relief",
    "slope",
    "ridge-field",
    "valley-field",
    "mineral-pressure-expression",
    "glacier-height",
    "rock-texture",
    "surface-roughness",
    "terrain-color-hints"
  ],
  nonJurisdiction: [
    "route-shell",
    "html",
    "canvas-mount",
    "final-canvas-composition",
    "runtime-boot",
    "hydration-ownership",
    "ocean-depth-ownership",
    "GraphicBox",
    "image-generation"
  ],
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  renderResolutionIntent: "4k-procedural-sampling-authority",
  exportedSurface: "terrain-sampler-and-payload"
});

const GEOLOGY = Object.freeze({
  dominant: ["diamond", "opal", "granite", "slate"],
  sands: ["white-opal-sand", "black-diamond-sand"],
  reliefMemory: "ancient-eroded-mountain-systems",
  weatheringAge: "approximately-forty-billion-year-surface-memory",
  newbornComparison: "newborn-Audralia-mountains-dwarfed-Earth-Himalayan-standard",
  currentExpression: "ancient-weathered-rocky-relief-with-mineral-pressure"
});

const TERRAIN_REGIONS = Object.freeze([
  {
    id: "western-mainland-arc",
    region: 2,
    className: "weathered-granite-slate-mainland",
    center: [-25, -111],
    influence: 44,
    maxRelief: 0.78,
    erosion: 0.62,
    glacierBias: 0.08,
    geology: ["granite", "slate", "diamond-vein"],
    ridgeLines: [
      [[-51, -151], [-43, -134], [-35, -112], [-27, -91], [-18, -70]],
      [[-41, -141], [-26, -122], [-10, -108], [9, -92], [22, -77]],
      [[-48, -124], [-34, -103], [-21, -84], [-5, -63]]
    ]
  },
  {
    id: "eastern-attached-mainland",
    region: 3,
    className: "opal-granite-coastal-rise",
    center: [4, -17],
    influence: 42,
    maxRelief: 0.66,
    erosion: 0.56,
    glacierBias: 0.04,
    geology: ["opal", "granite", "slate"],
    ridgeLines: [
      [[-26, -61], [-12, -44], [4, -24], [20, -6], [34, 17]],
      [[-28, -33], [-16, -10], [-4, 14], [8, 38], [22, 54]],
      [[-21, 36], [-5, 47], [13, 50], [29, 39]]
    ]
  },
  {
    id: "northern-rock-crown",
    region: 1,
    className: "ice-reserve-and-pressure-cap",
    center: [55, -73],
    influence: 39,
    maxRelief: 0.86,
    erosion: 0.48,
    glacierBias: 0.88,
    geology: ["ice", "slate", "diamond-understone"],
    ridgeLines: [
      [[43, -148], [53, -112], [61, -72], [62, -31], [50, 12]],
      [[37, -93], [48, -69], [58, -43], [64, -14]],
      [[39, -4], [46, 11], [55, 20]]
    ]
  },
  {
    id: "southern-weathered-mass",
    region: 5,
    className: "diamond-opal-wet-edge",
    center: [-58, 79],
    influence: 45,
    maxRelief: 0.72,
    erosion: 0.70,
    glacierBias: 0.64,
    geology: ["diamond", "opal", "slate"],
    ridgeLines: [
      [[-70, -39], [-61, 3], [-51, 45], [-38, 82], [-29, 119]],
      [[-77, 53], [-65, 82], [-52, 111], [-41, 142], [-54, 166]],
      [[-58, 17], [-48, 54], [-39, 91], [-31, 130]]
    ]
  },
  {
    id: "equatorial-ancient-chain",
    region: 4,
    className: "ancient-eroded-mountain-memory",
    center: [-7, 120],
    influence: 34,
    maxRelief: 0.81,
    erosion: 0.74,
    glacierBias: 0.02,
    geology: ["granite", "diamond", "opal"],
    ridgeLines: [
      [[-16, 69], [-5, 91], [8, 113], [16, 137], [6, 160]],
      [[-21, 101], [-12, 122], [-4, 145], [1, 164]],
      [[-11, 76], [3, 98], [15, 121]]
    ]
  },
  {
    id: "island-and-shelf-relief",
    region: 6,
    className: "island-and-shelf-expression",
    center: [-36, 132],
    influence: 25,
    maxRelief: 0.44,
    erosion: 0.67,
    glacierBias: 0.00,
    geology: ["opal", "diamond-sand", "granite"],
    ridgeLines: [
      [[-42, 96], [-34, 112], [-31, 129], [-40, 140]],
      [[-50, 101], [-44, 118], [-37, 134]],
      [[-47, 142], [-36, 154], [-21, 168]]
    ]
  },
  {
    id: "western-pressure-islands",
    region: 7,
    className: "miscellaneous-territory-expression",
    center: [8, -150],
    influence: 24,
    maxRelief: 0.38,
    erosion: 0.58,
    glacierBias: 0.00,
    geology: ["slate", "opal", "black-diamond-sand"],
    ridgeLines: [
      [[2, -171], [11, -160], [19, -147], [16, -135]],
      [[-6, -152], [4, -142], [14, -134]],
      [[8, -166], [18, -154], [22, -140]]
    ]
  }
]);

const RELIEF_PALETTE = Object.freeze({
  deepShadow: "rgba(28, 32, 34, 0.42)",
  lowland: "rgba(94, 117, 84, 0.92)",
  weatheredStone: "rgba(127, 118, 91, 0.94)",
  highGranite: "rgba(202, 199, 168, 0.72)",
  opalLight: "rgba(207, 236, 224, 0.68)",
  diamondGlint: "rgba(246, 252, 255, 0.76)",
  slateLine: "rgba(76, 89, 96, 0.58)",
  glacier: "rgba(235, 247, 255, 0.82)",
  whiteSand: "rgba(246, 231, 188, 0.72)",
  blackSand: "rgba(42, 39, 36, 0.56)"
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeLongitude(lon) {
  let value = Number(lon) || 0;

  while (value > 180) value -= 360;
  while (value < -180) value += 360;

  return value;
}

function normalizeLatitude(lat) {
  return clamp(Number(lat) || 0, -90, 90);
}

function hash01(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function distanceLatLon(latA, lonA, latB, lonB) {
  const dLat = latA - latB;
  const dLon = normalizeLongitude(lonA - lonB);
  return Math.sqrt((dLat * dLat) + (dLon * dLon));
}

function distanceToSegment(lat, lon, start, end) {
  const x = normalizeLongitude(lon);
  const y = lat;
  const x1 = normalizeLongitude(start[1]);
  const y1 = start[0];
  let x2 = normalizeLongitude(end[1]);
  const y2 = end[0];

  if (Math.abs(x2 - x1) > 180) {
    x2 += x2 < x1 ? 360 : -360;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) return distanceLatLon(lat, lon, y1, x1);

  const t = clamp(((x - x1) * dx + (y - y1) * dy) / lengthSq, 0, 1);
  const px = x1 + t * dx;
  const py = y1 + t * dy;

  return distanceLatLon(lat, lon, py, px);
}

function ridgeInfluence(lat, lon, ridgeLines) {
  let influence = 0;

  for (let lineIndex = 0; lineIndex < ridgeLines.length; lineIndex += 1) {
    const line = ridgeLines[lineIndex];

    for (let pointIndex = 0; pointIndex < line.length - 1; pointIndex += 1) {
      const distance = distanceToSegment(lat, lon, line[pointIndex], line[pointIndex + 1]);
      const local = smoothstep(18, 0, distance);

      influence = Math.max(influence, local);
    }
  }

  return clamp(influence, 0, 1);
}

function regionInfluence(lat, lon, region) {
  const distance = distanceLatLon(lat, lon, region.center[0], region.center[1]);
  const base = smoothstep(region.influence, 0, distance);
  const ridge = ridgeInfluence(lat, lon, region.ridgeLines);

  return clamp(base * 0.72 + ridge * 0.52, 0, 1);
}

function octaveNoise(lat, lon, scale, seed) {
  const a = Math.sin((lat + seed * 17.13) * scale) * Math.cos((lon - seed * 9.71) * scale * 0.73);
  const b = Math.sin((lat * 0.61 + lon * 0.23 + seed) * scale * 1.71);
  const c = Math.cos((lon - lat * 0.31 + seed * 3.19) * scale * 0.49);

  return clamp((a + b * 0.55 + c * 0.35 + 1.9) / 3.8, 0, 1);
}

function mineralPressure(lat, lon) {
  const pressure =
    octaveNoise(lat, lon, 0.077, 7) * 0.36 +
    octaveNoise(lat, lon, 0.141, 19) * 0.29 +
    octaveNoise(lat, lon, 0.027, 31) * 0.35;

  const diamondBand = Math.abs(Math.sin((lat * 0.19) + (lon * 0.043)));
  const opalBand = Math.abs(Math.cos((lat * 0.071) - (lon * 0.113)));

  return clamp(pressure * 0.72 + diamondBand * 0.17 + opalBand * 0.11, 0, 1);
}

function sampleTerrain(latInput, lonInput, options = {}) {
  const lat = normalizeLatitude(latInput);
  const lon = normalizeLongitude(lonInput);
  const absoluteLatitude = Math.abs(lat);

  let region = null;
  let bestInfluence = 0;

  for (let index = 0; index < TERRAIN_REGIONS.length; index += 1) {
    const current = TERRAIN_REGIONS[index];
    const influence = regionInfluence(lat, lon, current);

    if (influence > bestInfluence) {
      bestInfluence = influence;
      region = current;
    }
  }

  const regionRelief = region ? region.maxRelief : 0;
  const ridge = region ? ridgeInfluence(lat, lon, region.ridgeLines) : 0;
  const pressure = mineralPressure(lat, lon);
  const broadWeathering = octaveNoise(lat, lon, 0.031, 41);
  const stoneNoise = octaveNoise(lat, lon, 0.119, 53);
  const fineNoise = octaveNoise(lat, lon, 0.311, 71);
  const erosion = region ? region.erosion : 0.7;
  const erosionCut = smoothstep(0.2, 1, broadWeathering) * erosion;
  const polarIce = smoothstep(55, 82, absoluteLatitude) * (region ? region.glacierBias : 0.15);
  const coastlineSoftening = smoothstep(0.12, 0.44, bestInfluence);
  const rawElevation =
    bestInfluence * regionRelief * 0.84 +
    ridge * 0.34 +
    pressure * 0.18 +
    stoneNoise * 0.11 +
    fineNoise * 0.045 -
    erosionCut * 0.19;

  const elevation = clamp(rawElevation, 0, 1);
  const slope = clamp(ridge * 0.58 + Math.abs(fineNoise - broadWeathering) * 0.42, 0, 1);
  const roughness = clamp(stoneNoise * 0.45 + fineNoise * 0.35 + pressure * 0.20, 0, 1);
  const glacier = clamp(polarIce + smoothstep(0.72, 1, elevation) * (region ? region.glacierBias : 0), 0, 1);
  const beach = bestInfluence > 0.12 && bestInfluence < 0.32 ? smoothstep(0.32, 0.12, bestInfluence) : 0;
  const blackSand = beach * smoothstep(0.62, 1, pressure);
  const whiteSand = beach * (1 - blackSand) * smoothstep(0.15, 0.8, stoneNoise);
  const exposedRock = smoothstep(0.34, 0.82, elevation) * (1 - glacier * 0.65);
  const opalSignal = clamp(pressure * 0.44 + octaveNoise(lat, lon, 0.091, 89) * 0.56, 0, 1);
  const diamondSignal = clamp(pressure * 0.66 + ridge * 0.24 + fineNoise * 0.10, 0, 1);
  const slateSignal = clamp(slope * 0.50 + roughness * 0.34 + (1 - opalSignal) * 0.16, 0, 1);
  const graniteSignal = clamp(exposedRock * 0.52 + stoneNoise * 0.32 + ridge * 0.16, 0, 1);

  let material = "submerged-or-unassigned";
  let colorHint = RELIEF_PALETTE.lowland;

  if (glacier > 0.48) {
    material = "glacier-over-slate-diamond";
    colorHint = RELIEF_PALETTE.glacier;
  } else if (blackSand > 0.28) {
    material = "black-diamond-sand";
    colorHint = RELIEF_PALETTE.blackSand;
  } else if (whiteSand > 0.24) {
    material = "white-opal-sand";
    colorHint = RELIEF_PALETTE.whiteSand;
  } else if (diamondSignal > 0.74 && exposedRock > 0.35) {
    material = "diamond-granite-pressure-ridge";
    colorHint = RELIEF_PALETTE.diamondGlint;
  } else if (opalSignal > 0.68 && exposedRock > 0.18) {
    material = "opal-granite-weathered-rise";
    colorHint = RELIEF_PALETTE.opalLight;
  } else if (slateSignal > 0.62) {
    material = "slate-weathered-slope";
    colorHint = RELIEF_PALETTE.slateLine;
  } else if (graniteSignal > 0.48) {
    material = "granite-ancient-relief";
    colorHint = RELIEF_PALETTE.highGranite;
  } else if (bestInfluence > 0.2) {
    material = "weathered-lowland";
    colorHint = RELIEF_PALETTE.weatheredStone;
  }

  const detailLevel = options.detailLevel || "4k";
  const admissible = bestInfluence > 0.08;

  return {
    lat,
    lon,
    admissible,
    detailLevel,
    regionId: region ? region.id : "void-or-ocean",
    regionClass: region ? region.className : "void-or-ocean",
    regionNumber: region ? region.region : 8,
    influence: Number(bestInfluence.toFixed(4)),
    elevation: Number(elevation.toFixed(4)),
    slope: Number(slope.toFixed(4)),
    roughness: Number(roughness.toFixed(4)),
    ridge: Number(ridge.toFixed(4)),
    pressure: Number(pressure.toFixed(4)),
    erosion: Number(erosion.toFixed(4)),
    glacier: Number(glacier.toFixed(4)),
    beach: Number(beach.toFixed(4)),
    blackSand: Number(blackSand.toFixed(4)),
    whiteSand: Number(whiteSand.toFixed(4)),
    exposedRock: Number(exposedRock.toFixed(4)),
    opalSignal: Number(opalSignal.toFixed(4)),
    diamondSignal: Number(diamondSignal.toFixed(4)),
    slateSignal: Number(slateSignal.toFixed(4)),
    graniteSignal: Number(graniteSignal.toFixed(4)),
    material,
    colorHint,
    terrainAuthority: RECEIPT,
    contract: CONTRACT
  };
}

function buildTerrainGrid(options = {}) {
  const latStep = options.latStep || 6;
  const lonStep = options.lonStep || 6;
  const grid = [];

  for (let lat = -84; lat <= 84; lat += latStep) {
    for (let lon = -180; lon < 180; lon += lonStep) {
      grid.push(sampleTerrain(lat, lon, {
        detailLevel: options.detailLevel || "diagnostic-grid"
      }));
    }
  }

  return grid;
}

function summarizeTerrain(options = {}) {
  const grid = buildTerrainGrid(options);
  const total = grid.length || 1;
  let admissible = 0;
  let glacier = 0;
  let beach = 0;
  let exposedRock = 0;
  let highRelief = 0;
  let diamond = 0;
  let opal = 0;
  let slate = 0;
  let granite = 0;

  for (let index = 0; index < grid.length; index += 1) {
    const sample = grid[index];

    if (sample.admissible) admissible += 1;
    if (sample.glacier > 0.35) glacier += 1;
    if (sample.beach > 0.25) beach += 1;
    if (sample.exposedRock > 0.4) exposedRock += 1;
    if (sample.elevation > 0.62) highRelief += 1;
    if (sample.diamondSignal > 0.68) diamond += 1;
    if (sample.opalSignal > 0.64) opal += 1;
    if (sample.slateSignal > 0.62) slate += 1;
    if (sample.graniteSignal > 0.56) granite += 1;
  }

  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    totalSamples: total,
    admissibleRatio: Number((admissible / total).toFixed(4)),
    glacierRatio: Number((glacier / total).toFixed(4)),
    beachRatio: Number((beach / total).toFixed(4)),
    exposedRockRatio: Number((exposedRock / total).toFixed(4)),
    highReliefRatio: Number((highRelief / total).toFixed(4)),
    diamondSignalRatio: Number((diamond / total).toFixed(4)),
    opalSignalRatio: Number((opal / total).toFixed(4)),
    slateSignalRatio: Number((slate / total).toFixed(4)),
    graniteSignalRatio: Number((granite / total).toFixed(4)),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

const TERRAIN_SUMMARY = Object.freeze(summarizeTerrain({ latStep: 8, lonStep: 8 }));

function publishTerrainAuthority() {
  if (typeof window === "undefined") {
    return TERRAIN_AUTHORITY;
  }

  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    authority: TERRAIN_AUTHORITY,
    geology: GEOLOGY,
    summary: TERRAIN_SUMMARY,
    exposesSampleTerrain: true,
    exposesTerrainGrid: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_TERRAIN_AUTHORITY__ = status;
  window.__AUDRALIA_TERRAIN_STATUS__ = status;
  window.AudraliaTerrainAuthority = api;

  try {
    window.dispatchEvent(new CustomEvent("audralia:terrain-authority-ready", {
      detail: status
    }));
  } catch (_) {
    /* no-op */
  }

  return status;
}

function getTerrainAuthority() {
  return TERRAIN_AUTHORITY;
}

function getTerrainGeology() {
  return GEOLOGY;
}

function getTerrainRegions() {
  return TERRAIN_REGIONS;
}

function getTerrainSummary() {
  return TERRAIN_SUMMARY;
}

function getTerrainPalette() {
  return RELIEF_PALETTE;
}

const api = {
  RECEIPT,
  CONTRACT,
  VERSION,
  TERRAIN_AUTHORITY,
  GEOLOGY,
  TERRAIN_REGIONS,
  RELIEF_PALETTE,
  TERRAIN_SUMMARY,
  sampleTerrain,
  buildTerrainGrid,
  summarizeTerrain,
  publishTerrainAuthority,
  getTerrainAuthority,
  getTerrainGeology,
  getTerrainRegions,
  getTerrainSummary,
  getTerrainPalette
};

publishTerrainAuthority();

export {
  RECEIPT,
  CONTRACT,
  VERSION,
  TERRAIN_AUTHORITY,
  GEOLOGY,
  TERRAIN_REGIONS,
  RELIEF_PALETTE,
  TERRAIN_SUMMARY,
  sampleTerrain,
  buildTerrainGrid,
  summarizeTerrain,
  publishTerrainAuthority,
  getTerrainAuthority,
  getTerrainGeology,
  getTerrainRegions,
  getTerrainSummary,
  getTerrainPalette
};

export default api;
