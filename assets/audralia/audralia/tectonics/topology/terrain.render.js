/* /assets/audralia/audralia/tectonics/topology/terrain.render.js */
/* AUDRALIA_TERRAIN_RELIEF_AUTHORITY */
/* TNT: AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2 */

const RECEIPT = "AUDRALIA_TERRAIN_RELIEF_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2";
const VERSION = "2026-05-06.terrain-4k-relief-detail-v2";

const TERRAIN_AUTHORITY = Object.freeze({
  name: "Audralia Terrain Relief Authority",
  planet: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  lineage: "tectonics -> topology -> terrain",
  role: "above-sea-level-relief-expression",
  precinct: "above-water terrain relief, ridges, slopes, mineral weathering, glacier height, coastal roughness, and 4k procedural surface detail",
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
    "coastal-terrain-transition",
    "terrain-color-hints",
    "canvas-consumable-terrain-samples"
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
  renderResolutionIntent: "4k-procedural-terrain-sampling-authority",
  exportedSurface: "terrain-sampler-grid-palette-ridge-relief-layer"
});

const GEOLOGY = Object.freeze({
  dominant: ["diamond", "opal", "granite", "slate"],
  sands: ["white-opal-sand", "black-diamond-sand"],
  reliefMemory: "ancient-eroded-mountain-systems",
  weatheringAge: "approximately-forty-billion-year-surface-memory",
  newbornComparison: "newborn-Audralia-mountains-dwarfed-Earth-Himalayan-standard",
  currentExpression: "ancient-weathered-rocky-relief-with-mineral-pressure",
  rule: "terrain expresses above-sea relief; topology owns land/void footprint; hydration owns water"
});

const TERRAIN_REGIONS = Object.freeze([
  {
    id: "western-mainland-arc",
    region: 2,
    className: "weathered-granite-slate-mainland",
    center: [-25, -111],
    influence: 46,
    maxRelief: 0.80,
    erosion: 0.64,
    glacierBias: 0.08,
    geology: ["granite", "slate", "diamond-vein"],
    ridgeLines: [
      [[-51, -151], [-43, -134], [-35, -112], [-27, -91], [-18, -70]],
      [[-41, -141], [-26, -122], [-10, -108], [9, -92], [22, -77]],
      [[-48, -124], [-34, -103], [-21, -84], [-5, -63]],
      [[-52, -145], [-38, -128], [-24, -116], [-9, -101], [12, -83]]
    ],
    valleys: [
      [[-48, -136], [-35, -120], [-21, -106], [-8, -92]],
      [[-38, -93], [-25, -82], [-12, -72], [3, -61]]
    ]
  },
  {
    id: "eastern-attached-mainland",
    region: 3,
    className: "opal-granite-coastal-rise",
    center: [4, -17],
    influence: 43,
    maxRelief: 0.68,
    erosion: 0.57,
    glacierBias: 0.04,
    geology: ["opal", "granite", "slate"],
    ridgeLines: [
      [[-26, -61], [-12, -44], [4, -24], [20, -6], [34, 17]],
      [[-28, -33], [-16, -10], [-4, 14], [8, 38], [22, 54]],
      [[-21, 36], [-5, 47], [13, 50], [29, 39]],
      [[-5, -43], [9, -23], [21, -1], [31, 24]]
    ],
    valleys: [
      [[-24, -48], [-10, -28], [7, -8], [24, 12]],
      [[-15, 42], [1, 49], [18, 48]]
    ]
  },
  {
    id: "northern-rock-crown",
    region: 1,
    className: "ice-reserve-and-pressure-cap",
    center: [55, -73],
    influence: 40,
    maxRelief: 0.88,
    erosion: 0.49,
    glacierBias: 0.90,
    geology: ["ice", "slate", "diamond-understone"],
    ridgeLines: [
      [[43, -148], [53, -112], [61, -72], [62, -31], [50, 12]],
      [[37, -93], [48, -69], [58, -43], [64, -14]],
      [[39, -4], [46, 11], [55, 20]],
      [[45, -132], [56, -96], [63, -55]]
    ],
    valleys: [
      [[44, -120], [51, -87], [55, -52], [53, -20]],
      [[41, -46], [47, -25], [50, 4]]
    ]
  },
  {
    id: "southern-weathered-mass",
    region: 5,
    className: "diamond-opal-wet-edge",
    center: [-58, 79],
    influence: 46,
    maxRelief: 0.74,
    erosion: 0.72,
    glacierBias: 0.66,
    geology: ["diamond", "opal", "slate"],
    ridgeLines: [
      [[-70, -39], [-61, 3], [-51, 45], [-38, 82], [-29, 119]],
      [[-77, 53], [-65, 82], [-52, 111], [-41, 142], [-54, 166]],
      [[-58, 17], [-48, 54], [-39, 91], [-31, 130]],
      [[-74, 93], [-61, 111], [-48, 131], [-39, 154]]
    ],
    valleys: [
      [[-66, 8], [-57, 44], [-47, 78], [-37, 112]],
      [[-73, 74], [-61, 93], [-50, 118], [-47, 146]]
    ]
  },
  {
    id: "equatorial-ancient-chain",
    region: 4,
    className: "ancient-eroded-mountain-memory",
    center: [-7, 120],
    influence: 35,
    maxRelief: 0.84,
    erosion: 0.76,
    glacierBias: 0.02,
    geology: ["granite", "diamond", "opal"],
    ridgeLines: [
      [[-16, 69], [-5, 91], [8, 113], [16, 137], [6, 160]],
      [[-21, 101], [-12, 122], [-4, 145], [1, 164]],
      [[-11, 76], [3, 98], [15, 121]],
      [[-20, 84], [-8, 109], [3, 132], [-1, 157]]
    ],
    valleys: [
      [[-18, 93], [-8, 116], [3, 139]],
      [[-11, 70], [-1, 92], [10, 115]]
    ]
  },
  {
    id: "island-and-shelf-relief",
    region: 6,
    className: "island-and-shelf-expression",
    center: [-36, 132],
    influence: 26,
    maxRelief: 0.46,
    erosion: 0.69,
    glacierBias: 0.00,
    geology: ["opal", "diamond-sand", "granite"],
    ridgeLines: [
      [[-42, 96], [-34, 112], [-31, 129], [-40, 140]],
      [[-50, 101], [-44, 118], [-37, 134]],
      [[-47, 142], [-36, 154], [-21, 168]]
    ],
    valleys: [
      [[-48, 105], [-41, 119], [-36, 133]],
      [[-42, 145], [-32, 155], [-19, 166]]
    ]
  },
  {
    id: "western-pressure-islands",
    region: 7,
    className: "miscellaneous-territory-expression",
    center: [8, -150],
    influence: 24,
    maxRelief: 0.40,
    erosion: 0.59,
    glacierBias: 0.00,
    geology: ["slate", "opal", "black-diamond-sand"],
    ridgeLines: [
      [[2, -171], [11, -160], [19, -147], [16, -135]],
      [[-6, -152], [4, -142], [14, -134]],
      [[8, -166], [18, -154], [22, -140]]
    ],
    valleys: [
      [[2, -162], [10, -150], [17, -139]],
      [[-4, -151], [7, -143], [17, -136]]
    ]
  },
  {
    id: "far-east-reef-knife",
    region: 8,
    className: "thin-reef-knife-relief",
    center: [-28, 166],
    influence: 28,
    maxRelief: 0.50,
    erosion: 0.68,
    glacierBias: 0.00,
    geology: ["opal", "slate", "white-opal-sand"],
    ridgeLines: [
      [[-49, 144], [-36, 156], [-20, 168], [-2, 179]],
      [[-51, 155], [-36, 166], [-18, 177], [0, -172]],
      [[-42, 137], [-28, 152], [-12, 166]]
    ],
    valleys: [
      [[-48, 151], [-34, 162], [-17, 174]],
      [[-39, 145], [-26, 158], [-10, 171]]
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
  blackSand: "rgba(42, 39, 36, 0.56)",
  cliffShadow: "rgba(35, 39, 39, 0.52)",
  valleyBlue: "rgba(85, 132, 150, 0.36)"
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
  return Math.sqrt(dLat * dLat + dLon * dLon);
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

function lineInfluence(lat, lon, lines, width) {
  let influence = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    for (let pointIndex = 0; pointIndex < line.length - 1; pointIndex += 1) {
      const distance = distanceToSegment(lat, lon, line[pointIndex], line[pointIndex + 1]);
      influence = Math.max(influence, smoothstep(width, 0, distance));
    }
  }

  return clamp(influence, 0, 1);
}

function regionInfluence(lat, lon, region) {
  const distance = distanceLatLon(lat, lon, region.center[0], region.center[1]);
  const base = smoothstep(region.influence, 0, distance);
  const ridge = lineInfluence(lat, lon, region.ridgeLines, 18);
  const valley = lineInfluence(lat, lon, region.valleys || [], 12);

  return clamp(base * 0.70 + ridge * 0.52 - valley * 0.16, 0, 1);
}

function octaveNoise(lat, lon, scale, seed) {
  const a = Math.sin((lat + seed * 17.13) * scale) * Math.cos((lon - seed * 9.71) * scale * 0.73);
  const b = Math.sin((lat * 0.61 + lon * 0.23 + seed) * scale * 1.71);
  const c = Math.cos((lon - lat * 0.31 + seed * 3.19) * scale * 0.49);
  return clamp((a + b * 0.55 + c * 0.35 + 1.9) / 3.8, 0, 1);
}

function fractalNoise(lat, lon, seed) {
  const low = octaveNoise(lat, lon, 0.027, seed);
  const mid = octaveNoise(lat, lon, 0.083, seed + 17);
  const high = octaveNoise(lat, lon, 0.191, seed + 41);
  const micro = octaveNoise(lat, lon, 0.417, seed + 73);
  return clamp(low * 0.42 + mid * 0.30 + high * 0.20 + micro * 0.08, 0, 1);
}

function mineralPressure(lat, lon) {
  const pressure =
    fractalNoise(lat, lon, 7) * 0.42 +
    fractalNoise(lat * 0.7, lon * 1.2, 19) * 0.31 +
    fractalNoise(lat * 1.4, lon * 0.5, 31) * 0.27;

  const diamondBand = Math.abs(Math.sin((lat * 0.19) + (lon * 0.043)));
  const opalBand = Math.abs(Math.cos((lat * 0.071) - (lon * 0.113)));

  return clamp(pressure * 0.72 + diamondBand * 0.17 + opalBand * 0.11, 0, 1);
}

function resolveRegion(lat, lon) {
  let region = null;
  let influence = 0;

  for (let index = 0; index < TERRAIN_REGIONS.length; index += 1) {
    const candidate = TERRAIN_REGIONS[index];
    const candidateInfluence = regionInfluence(lat, lon, candidate);

    if (candidateInfluence > influence) {
      region = candidate;
      influence = candidateInfluence;
    }
  }

  return { region, influence };
}

function sampleTerrain(latInput, lonInput, options = {}) {
  const lat = normalizeLatitude(latInput);
  const lon = normalizeLongitude(lonInput);
  const absoluteLatitude = Math.abs(lat);
  const resolved = resolveRegion(lat, lon);
  const region = resolved.region;
  const bestInfluence = resolved.influence;
  const ridge = region ? lineInfluence(lat, lon, region.ridgeLines, 18) : 0;
  const valley = region ? lineInfluence(lat, lon, region.valleys || [], 12) : 0;
  const pressure = mineralPressure(lat, lon);
  const broadWeathering = fractalNoise(lat, lon, 41);
  const stoneNoise = fractalNoise(lat, lon, 53);
  const fineNoise = fractalNoise(lat, lon, 71);
  const microPitting = fractalNoise(lat * 2.2, lon * 2.2, 97);
  const erosion = region ? region.erosion : 0.7;
  const regionRelief = region ? region.maxRelief : 0;
  const erosionCut = smoothstep(0.2, 1, broadWeathering) * erosion;
  const polarIce = smoothstep(55, 82, absoluteLatitude) * (region ? region.glacierBias : 0.15);
  const coastalCut = bestInfluence > 0.1 && bestInfluence < 0.42 ? smoothstep(0.42, 0.1, bestInfluence) : 0;

  const rawElevation =
    bestInfluence * regionRelief * 0.84 +
    ridge * 0.36 +
    pressure * 0.18 +
    stoneNoise * 0.11 +
    fineNoise * 0.045 -
    valley * 0.18 -
    erosionCut * 0.17 -
    coastalCut * 0.08;

  const elevation = clamp(rawElevation, 0, 1);
  const slope = clamp(ridge * 0.60 + Math.abs(fineNoise - broadWeathering) * 0.32 + valley * 0.08, 0, 1);
  const roughness = clamp(stoneNoise * 0.40 + fineNoise * 0.25 + microPitting * 0.18 + pressure * 0.17, 0, 1);
  const cliff = clamp(slope * 0.55 + ridge * 0.35 + coastalCut * 0.22 - valley * 0.12, 0, 1);
  const glacier = clamp(polarIce + smoothstep(0.72, 1, elevation) * (region ? region.glacierBias : 0), 0, 1);
  const beach = bestInfluence > 0.11 && bestInfluence < 0.34 ? smoothstep(0.34, 0.11, bestInfluence) : 0;
  const blackSand = beach * smoothstep(0.62, 1, pressure);
  const whiteSand = beach * (1 - blackSand) * smoothstep(0.15, 0.8, stoneNoise);
  const exposedRock = smoothstep(0.34, 0.82, elevation) * (1 - glacier * 0.65);
  const valleyBlue = valley * smoothstep(0.20, 0.72, bestInfluence);
  const opalSignal = clamp(pressure * 0.44 + fractalNoise(lat, lon, 89) * 0.56, 0, 1);
  const diamondSignal = clamp(pressure * 0.66 + ridge * 0.24 + fineNoise * 0.10, 0, 1);
  const slateSignal = clamp(slope * 0.50 + roughness * 0.34 + (1 - opalSignal) * 0.16, 0, 1);
  const graniteSignal = clamp(exposedRock * 0.52 + stoneNoise * 0.32 + ridge * 0.16, 0, 1);
  const ancientWeathering = clamp(erosion * 0.48 + broadWeathering * 0.34 + microPitting * 0.18, 0, 1);

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

  return {
    lat,
    lon,
    admissible: bestInfluence > 0.08,
    detailLevel: options.detailLevel || "4k",
    regionId: region ? region.id : "void-or-ocean",
    regionClass: region ? region.className : "void-or-ocean",
    regionNumber: region ? region.region : 8,
    influence: Number(bestInfluence.toFixed(4)),
    elevation: Number(elevation.toFixed(4)),
    slope: Number(slope.toFixed(4)),
    roughness: Number(roughness.toFixed(4)),
    cliff: Number(cliff.toFixed(4)),
    ridge: Number(ridge.toFixed(4)),
    valley: Number(valley.toFixed(4)),
    valleyBlue: Number(valleyBlue.toFixed(4)),
    pressure: Number(pressure.toFixed(4)),
    erosion: Number(erosion.toFixed(4)),
    ancientWeathering: Number(ancientWeathering.toFixed(4)),
    glacier: Number(glacier.toFixed(4)),
    beach: Number(beach.toFixed(4)),
    blackSand: Number(blackSand.toFixed(4)),
    whiteSand: Number(whiteSand.toFixed(4)),
    exposedRock: Number(exposedRock.toFixed(4)),
    opalSignal: Number(opalSignal.toFixed(4)),
    diamondSignal: Number(diamondSignal.toFixed(4)),
    slateSignal: Number(slateSignal.toFixed(4)),
    graniteSignal: Number(graniteSignal.toFixed(4)),
    microPitting: Number(microPitting.toFixed(4)),
    material,
    colorHint,
    terrainAuthority: RECEIPT,
    contract: CONTRACT
  };
}

function sampleTerrainColor(lat, lon, options = {}) {
  const sample = sampleTerrain(lat, lon, options);

  return {
    color: sample.colorHint,
    material: sample.material,
    alpha: clamp(0.18 + sample.influence * 0.64 + sample.exposedRock * 0.18, 0, 0.96),
    highlight: sample.diamondSignal > 0.72 || sample.opalSignal > 0.72,
    shadow: sample.cliff > 0.62,
    sample
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

function buildReliefLayer(options = {}) {
  const latStep = options.latStep || 4;
  const lonStep = options.lonStep || 4;
  const minInfluence = options.minInfluence || 0.12;
  const points = [];

  for (let lat = -84; lat <= 84; lat += latStep) {
    for (let lon = -180; lon < 180; lon += lonStep) {
      const sample = sampleTerrain(lat, lon, { detailLevel: "relief-layer" });

      if (sample.influence >= minInfluence) {
        points.push({
          lat: sample.lat,
          lon: sample.lon,
          elevation: sample.elevation,
          slope: sample.slope,
          roughness: sample.roughness,
          cliff: sample.cliff,
          material: sample.material,
          colorHint: sample.colorHint,
          alpha: clamp(0.15 + sample.influence * 0.55 + sample.exposedRock * 0.20, 0.12, 0.94)
        });
      }
    }
  }

  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    pointCount: points.length,
    points
  };
}

function traceRidgeLines() {
  const ridges = [];

  for (let regionIndex = 0; regionIndex < TERRAIN_REGIONS.length; regionIndex += 1) {
    const region = TERRAIN_REGIONS[regionIndex];

    for (let lineIndex = 0; lineIndex < region.ridgeLines.length; lineIndex += 1) {
      ridges.push({
        regionId: region.id,
        regionClass: region.className,
        geology: region.geology,
        line: region.ridgeLines[lineIndex]
      });
    }
  }

  return ridges;
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
  let cliff = 0;
  let valley = 0;

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
    if (sample.cliff > 0.60) cliff += 1;
    if (sample.valley > 0.46) valley += 1;
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
    cliffRatio: Number((cliff / total).toFixed(4)),
    valleyRatio: Number((valley / total).toFixed(4)),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

const TERRAIN_SUMMARY = Object.freeze(summarizeTerrain({ latStep: 8, lonStep: 8 }));

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
    exposesSampleTerrainColor: true,
    exposesTerrainGrid: true,
    exposesReliefLayer: true,
    exposesRidgeLines: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_TERRAIN_AUTHORITY__ = status;
  window.__AUDRALIA_TERRAIN_STATUS__ = status;

  try {
    window.dispatchEvent(new CustomEvent("audralia:terrain-authority-ready", {
      detail: status
    }));
  } catch (_) {
    /* no-op */
  }

  return status;
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
  sampleTerrainColor,
  buildTerrainGrid,
  buildReliefLayer,
  traceRidgeLines,
  summarizeTerrain,
  publishTerrainAuthority,
  getTerrainAuthority,
  getTerrainGeology,
  getTerrainRegions,
  getTerrainSummary,
  getTerrainPalette
};

if (typeof window !== "undefined") {
  window.AudraliaTerrainAuthority = api;
}

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
  sampleTerrainColor,
  buildTerrainGrid,
  buildReliefLayer,
  traceRidgeLines,
  summarizeTerrain,
  publishTerrainAuthority,
  getTerrainAuthority,
  getTerrainGeology,
  getTerrainRegions,
  getTerrainSummary,
  getTerrainPalette
};

export default api;
