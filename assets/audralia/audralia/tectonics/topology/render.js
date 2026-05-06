// /assets/audralia/audralia/tectonics/topology/render.js
// AUDRALIA_TOPOLOGY_DOWNSTREAM_REBASE_TNT_v13
// Full-file replacement. Topology authority only.
// Purpose: define Audralia land/void/sea-level/coastline footprint for downstream terrain, hydration, oceans, deep-ocean, runtime, and canvas.
// Topology owns: land/void footprint, sea-level boundary, coastline bands, beaches/shelf seeds, topology proof.
// Topology does not own: terrain relief, hydration fill, ocean depth, deep-ocean biology, canvas drawing, route shell, Gauges scoring, GraphicBox, image generation.

const AUDRALIA_TOPOLOGY_RECEIPT = "AUDRALIA_TOPOLOGY_DOWNSTREAM_REBASE_TNT_v13";
const AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT = "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2";

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_VOID_RATIO = 0.708;
const TARGET_LIQUID_VOID_RATIO_MIN = 0.69;
const TARGET_LIQUID_VOID_RATIO_MAX = 0.76;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_TOPOLOGY_RECEIPT,
  compatibilityReceipt: AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT,
  activeRenewal: "AUDRALIA_TOPOLOGY_DOWNSTREAM_REBASE_CONTRACT_v13",
  file: "assets/audralia/audralia/tectonics/topology/render.js",
  role: "audralia-topology-land-void-sea-level-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",

  topologyOwnsLandVoid: true,
  topologyOwnsSeaLevelBoundary: true,
  topologyOwnsCoastlineSeed: true,
  topologyOwnsBeachSeed: true,
  topologyOwnsShelfSeed: true,

  topologyDefinesTerrainRelief: false,
  topologyDefinesHydrationFill: false,
  topologyDefinesOceanDepth: false,
  topologyDefinesDeepOcean: false,
  topologyDefinesClimate: false,
  topologyDrawsCanvas: false,

  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidVoidRatio: TARGET_LIQUID_VOID_RATIO,
  targetLiquidVoidRatioMin: TARGET_LIQUID_VOID_RATIO_MIN,
  targetLiquidVoidRatioMax: TARGET_LIQUID_VOID_RATIO_MAX,

  landVoidBoundaryActive: true,
  seaLevelBoundaryActive: true,
  downstreamReady: true,
  terrainReadyToConsume: true,
  hydrationReadyToConsume: true,
  oceansReadyToConsume: true,
  deepOceanReadyToConsume: true,
  runtimeReadyToConsume: true,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  api: {
    createAudraliaTopology: true,
    createAudraliaTopologyAsync: true,
    sampleTopology: true,
    sampleAudraliaTopology: true,
    sampleSurface: true,
    buildTopologyField: true,
    getStats: true,
    getTopologyStats: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedAuthority = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function wrapLongitude(lon) {
  let out = Number.isFinite(lon) ? lon : 0;
  while (out < -Math.PI) out += TAU;
  while (out > Math.PI) out -= TAU;
  return out;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg))
      ? Number(input.u ?? input.x ?? uArg)
      : 0.5;

    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg))
      ? Number(input.v ?? input.y ?? vArg)
      : 0.5;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * TAU;

    if (Math.abs(lat) > HALF_PI + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > TAU + 0.01) lon = lon * Math.PI / 180;

    return {
      lat: clamp(lat, -HALF_PI, HALF_PI),
      lon: wrapLongitude(lon),
      u,
      v
    };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * TAU;

  if (Math.abs(lat) > HALF_PI + 0.01) lat = lat * Math.PI / 180;
  if (Math.abs(lon) > TAU + 0.01) lon = lon * Math.PI / 180;

  return {
    lat: clamp(lat, -HALF_PI, HALF_PI),
    lon: wrapLongitude(lon),
    u,
    v
  };
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function sphericalVector(lon, lat) {
  const cosLat = Math.cos(lat);

  return {
    x: Math.sin(lon) * cosLat,
    y: Math.sin(lat),
    z: Math.cos(lon) * cosLat
  };
}

function angularDistance(lonA, latA, lonB, latB) {
  return Math.acos(clamp(dot(sphericalVector(lonA, latA), sphericalVector(lonB, latB)), -1, 1));
}

function waveNoise(lon, lat, scale, phase) {
  const a = Math.sin(lon * scale + phase) * 0.38;
  const b = Math.cos(lat * scale * 0.83 - phase * 0.7) * 0.3;
  const c = Math.sin((lon + lat) * scale * 0.47 + phase * 1.3) * 0.2;
  const d = Math.cos((lon - lat) * scale * 0.31 - phase * 0.4) * 0.12;

  return clamp01(0.5 + 0.5 * (a + b + c + d));
}

function continentCap(lon, lat, centerLon, centerLat, radius, strength, warp) {
  const noise = waveNoise(lon + centerLon, lat + centerLat, 4.8, warp);
  const brokenRadius = radius * (0.9 + noise * 0.2);
  const distance = angularDistance(lon, lat, centerLon, centerLat);
  const body = Math.max(0, 1 - distance / Math.max(0.001, brokenRadius));

  return smoothstep(0, 0.92, body) * strength;
}

function plateCurve(lon, lat, centerLon, centerLat, length, thickness, phase, bend, strength) {
  const dLon = wrapLongitude(lon - centerLon);

  const trail =
    centerLat +
    Math.sin(dLon * 1.8 + phase) * bend +
    Math.sin(dLon * 4.8 - phase) * bend * 0.22;

  const along =
    smoothstep(-length, -length * 0.76, dLon) *
    (1 - smoothstep(length * 0.76, length, dLon));

  const cross = 1 - smoothstep(thickness * 0.3, thickness, Math.abs(lat - trail));

  return clamp01(along * cross * strength);
}

function topologyRawField(lon, lat) {
  const broad = waveNoise(lon, lat, 2.2, 0.7);
  const coastNoise = waveNoise(lon, lat, 7.2, 2.1);

  const westernBody =
    continentCap(lon, lat, -2.55, 0.08, 0.6, 1.08, 1.1) +
    continentCap(lon, lat, -2.02, -0.18, 0.43, 0.72, 2.2) +
    continentCap(lon, lat, -2.94, -0.28, 0.31, 0.38, 3.3) +
    continentCap(lon, lat, -2.35, 0.42, 0.22, 0.28, 15.1);

  const centralBody =
    continentCap(lon, lat, -0.82, -0.04, 0.54, 0.76, 4.4) +
    continentCap(lon, lat, -0.28, 0.2, 0.36, 0.5, 5.5) +
    continentCap(lon, lat, 0.28, -0.18, 0.32, 0.38, 6.6) +
    continentCap(lon, lat, -1.34, -0.46, 0.24, 0.26, 16.2) +
    continentCap(lon, lat, -1.48, 0.24, 0.2, 0.24, 17.3);

  const easternBody =
    continentCap(lon, lat, 1.28, -0.06, 0.45, 0.78, 7.7) +
    continentCap(lon, lat, 1.84, 0.22, 0.3, 0.42, 8.8) +
    continentCap(lon, lat, 1.02, -0.42, 0.24, 0.32, 9.9);

  const islands =
    continentCap(lon, lat, 2.52, -0.08, 0.18, 0.28, 10.1) +
    continentCap(lon, lat, -3.02, 0.24, 0.17, 0.24, 11.2) +
    continentCap(lon, lat, 0.74, -0.62, 0.18, 0.22, 12.3) +
    continentCap(lon, lat, -1.24, 0.62, 0.13, 0.16, 14.5);

  const northPole =
    smoothstep(1.06, 1.45, lat) *
    (0.52 + coastNoise * 0.16);

  const southPole =
    smoothstep(1.06, 1.45, -lat) *
    (0.5 + coastNoise * 0.16);

  const bodyField = Math.max(
    westernBody,
    centralBody,
    easternBody,
    islands,
    northPole,
    southPole
  );

  const inheritedTectonicRidgeSeed =
    plateCurve(lon, lat, -2.2, -0.04, 0.95, 0.095, 0.6, 0.16, 0.18) +
    plateCurve(lon, lat, -0.35, 0.02, 0.88, 0.085, -1.2, 0.12, 0.16) +
    plateCurve(lon, lat, 1.48, 0.06, 0.74, 0.08, 2.1, 0.1, 0.14);

  const tectonicMemory =
    Math.sin(lon * 3.8 + lat * 2.1) * 0.035 +
    Math.sin(lon * -5.2 + lat * 4.2) * 0.02;

  return {
    raw:
      bodyField +
      inheritedTectonicRidgeSeed +
      (broad - 0.5) * 0.14 +
      (coastNoise - 0.5) * 0.1 +
      tectonicMemory,
    bodyField,
    westernBody,
    centralBody,
    easternBody,
    islands,
    northPole,
    southPole,
    inheritedTectonicRidgeSeed,
    tectonicMemory,
    broad,
    coastNoise
  };
}

function classifyLandmass(raw) {
  if (raw.northPole > 0.18) return "north-polar-cap";
  if (raw.southPole > 0.18) return "south-polar-cap";

  const bodyScores = [
    ["western-mainland-lobe", raw.westernBody],
    ["central-mainland-lobe", raw.centralBody],
    ["eastern-region-lobe", raw.easternBody],
    ["island-territory", raw.islands]
  ];

  bodyScores.sort((a, b) => b[1] - a[1]);
  return bodyScores[0][1] > 0.08 ? bodyScores[0][0] : "open-void";
}

function classifyTopologyZone(sample) {
  if (sample.polarIceSeed > 0.5) return "polar-solid-surface";
  if (sample.landMask > 0.64 && sample.coastBand < 0.22) return "inland-solid-surface";
  if (sample.landMask > 0.5 && sample.coastBand >= 0.22) return "coastal-solid-surface";
  if (sample.landMask <= 0.5 && sample.shelfSeed > 0.35) return "shelf-void";
  if (sample.landMask <= 0.5 && sample.slopeSeed > 0.28) return "slope-void";
  return "open-ocean-void";
}

function evaluateTopology(lon, lat) {
  const raw = topologyRawField(lon, lat);
  const seaLevel = 0.15;

  const landMask = smoothstep(seaLevel - 0.035, seaLevel + 0.052, raw.raw);
  const voidMask = 1 - landMask;
  const aboveSeaLevel = raw.raw - seaLevel;

  const coastBand =
    smoothstep(seaLevel - 0.08, seaLevel + 0.025, raw.raw) *
    (1 - smoothstep(seaLevel + 0.055, seaLevel + 0.19, raw.raw));

  const coastlineIndex = clamp01(coastBand);
  const shelfSeed = clamp01(voidMask * (1 - Math.abs(raw.raw - seaLevel) * 5.8));
  const slopeSeed = clamp01(voidMask * (1 - Math.abs(raw.raw - (seaLevel - 0.14)) * 5.2));
  const basinSeed = clamp01(voidMask * smoothstep(seaLevel - 0.18, seaLevel - 0.42, raw.raw));
  const beachSeed = clamp01(coastBand * (0.28 + raw.coastNoise * 0.58));
  const whiteSandSeed = clamp01(beachSeed * smoothstep(0.46, 0.88, raw.coastNoise));
  const blackSandSeed = clamp01(beachSeed * (1 - whiteSandSeed) * (0.45 + raw.broad * 0.35));

  const polarIceSeed = clamp01(
    smoothstep(1.04, 1.43, lat) * 0.88 +
    smoothstep(1.04, 1.43, -lat) * 0.86
  );

  const topologyLand = landMask > 0.5;
  const topologyVoid = !topologyLand;
  const landmassId = classifyLandmass(raw);

  const plateStressSeed = clamp01(
    raw.inheritedTectonicRidgeSeed * 0.82 +
    Math.abs(raw.tectonicMemory) * 4.2 +
    coastBand * 0.18
  );

  const topologySample = {
    seaLevel,
    rawTopologyField: raw.raw,
    topologyField: raw.raw,
    aboveSeaLevel,
    landMask,
    voidMask,
    topologyLand,
    topologyVoid,
    solidSurfaceLand: topologyLand,
    liquidVoid: topologyVoid,
    waterVoid: topologyVoid,
    oceanVoidCandidate: topologyVoid && shelfSeed <= 0.35,
    shelfVoidCandidate: topologyVoid && shelfSeed > 0.35,
    landVoidBoundary: coastBand > 0.08,
    coastBand,
    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfSeed,
    slopeSeed,
    basinSeed,
    beachSeed,
    whiteSandSeed,
    blackSandSeed,
    polarIceSeed,
    landmassId,
    inheritedTectonicRidgeSeed: raw.inheritedTectonicRidgeSeed,
    plateStressSeed,
    topologyZone: "",
    topologyClass: "",
    surfaceClass: "",
    visualSurfaceClass: ""
  };

  topologySample.topologyZone = classifyTopologyZone(topologySample);

  topologySample.topologyClass = topologyLand
    ? polarIceSeed > 0.5
      ? "solid-polar-surface"
      : coastBand > 0.2
        ? "solid-coastal-surface"
        : "solid-inland-surface"
    : shelfSeed > 0.35
      ? "void-shelf-water-candidate"
      : slopeSeed > 0.28
        ? "void-slope-water-candidate"
        : "void-ocean-candidate";

  topologySample.surfaceClass = topologySample.topologyClass;
  topologySample.visualSurfaceClass = topologySample.topologyClass;

  return topologySample;
}

function sampleAudraliaTopology(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const topology = evaluateTopology(coordinate.lon, coordinate.lat);

  return {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipt: AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT,
    source: "audralia-topology-downstream-rebase",
    lineage: STATUS.lineage,

    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,

    ...topology,

    land: topology.topologyLand,
    water: topology.topologyVoid,
    liquidWaterCandidate: topology.topologyVoid,
    solidSurface: topology.topologyLand,
    solidSurfaceLand: topology.topologyLand,
    exposedTerrainLand: topology.topologyLand && topology.polarIceSeed <= 0.5,
    visibleLand: topology.topologyLand && topology.polarIceSeed <= 0.5,
    iceCandidate: topology.polarIceSeed > 0.5,
    glacierCandidate: topology.polarIceSeed > 0.5,

    terrainReliefDefined: false,
    terrainMayConsume: topology.topologyLand,
    terrainReliefSeed: topology.topologyLand
      ? clamp01(0.12 + topology.inheritedTectonicRidgeSeed * 0.72 + topology.plateStressSeed * 0.22)
      : 0,

    hydrationDefined: false,
    hydrationMayConsume: true,
    hydrationVoidCandidate: topology.topologyVoid,
    hydrationCoastalCandidate: topology.coastlineIndex > 0.08,
    hydrationShelfCandidate: topology.shelfSeed > 0.22,

    oceansDefined: false,
    oceansMayFillOnlyVoid: topology.topologyVoid,
    oceansMustNotEraseLand: topology.topologyLand,

    deepOceanDefined: false,
    deepOceanMayConsumeVoidDepthOnly: topology.topologyVoid,

    topologyOwnsLandVoid: true,
    topologyOwnsSeaLevelBoundary: true,
    topologyOwnsCoastlineSeed: true,
    topologyDefinesTerrainRelief: false,
    topologyDefinesHydrationFill: false,
    topologyDefinesOceanDepth: false,
    topologyDefinesDeepOcean: false,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function buildTopologyField(options = {}) {
  const width = Math.max(8, Math.floor(safeNumber(options.width ?? options.columns, 128)));
  const height = Math.max(4, Math.floor(safeNumber(options.height ?? options.rows, 64)));
  const includeCells = Boolean(options.includeCells);

  const cells = [];
  const classCounts = {};
  const landmassCounts = {};
  const rowDominance = [];

  let solidSurfaceSamples = 0;
  let liquidVoidSamples = 0;
  let coastlineSamples = 0;
  let shelfSamples = 0;
  let beachSamples = 0;
  let polarSamples = 0;
  let weightedTotal = 0;
  let weightedLand = 0;
  let weightedVoid = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * TAU;
      const sample = sampleAudraliaTopology({ lat, lon, u, v });
      const weight = Math.max(0.000001, Math.cos(lat));

      classCounts[sample.topologyClass] = (classCounts[sample.topologyClass] || 0) + 1;
      landmassCounts[sample.landmassId] = (landmassCounts[sample.landmassId] || 0) + 1;
      rowCounts[sample.topologyClass] = (rowCounts[sample.topologyClass] || 0) + 1;

      if (sample.topologyLand) solidSurfaceSamples += 1;
      if (sample.topologyVoid) liquidVoidSamples += 1;
      if (sample.coastlineIndex > 0.08) coastlineSamples += 1;
      if (sample.shelfSeed > 0.22) shelfSamples += 1;
      if (sample.beachSeed > 0.18) beachSamples += 1;
      if (sample.polarIceSeed > 0.5) polarSamples += 1;

      weightedTotal += weight;
      if (sample.topologyLand) weightedLand += weight;
      if (sample.topologyVoid) weightedVoid += weight;

      if (includeCells) cells.push(sample);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const totalSamples = Math.max(1, width * height);
  const solidSurfaceRatio = solidSurfaceSamples / totalSamples;
  const liquidVoidRatio = liquidVoidSamples / totalSamples;
  const weightedSolidSurfaceRatio = weightedLand / Math.max(0.000001, weightedTotal);
  const weightedLiquidVoidRatio = weightedVoid / Math.max(0.000001, weightedTotal);
  const coastlineRatio = coastlineSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const polarRatio = polarSamples / totalSamples;
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;
  const maxDominantRowRatio = Math.max(...rowDominance);

  return {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipt: AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT,
    status: "topology-field-ready",
    width,
    height,
    totalSamples,
    classCounts,
    landmassCounts,

    solidSurfaceSamples,
    liquidVoidSamples,
    coastlineSamples,
    shelfSamples,
    beachSamples,
    polarSamples,

    solidSurfaceRatio,
    liquidVoidRatio,
    weightedSolidSurfaceRatio,
    weightedLiquidVoidRatio,
    coastlineRatio,
    shelfRatio,
    beachRatio,
    polarRatio,

    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidVoidRatio: TARGET_LIQUID_VOID_RATIO,
    targetLiquidVoidRatioMin: TARGET_LIQUID_VOID_RATIO_MIN,
    targetLiquidVoidRatioMax: TARGET_LIQUID_VOID_RATIO_MAX,

    solidSurfaceRatioTargetMet:
      weightedSolidSurfaceRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      weightedSolidSurfaceRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidVoidRatioTargetMet:
      weightedLiquidVoidRatio >= TARGET_LIQUID_VOID_RATIO_MIN &&
      weightedLiquidVoidRatio <= TARGET_LIQUID_VOID_RATIO_MAX,

    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    averageRowDominance,
    maxDominantRowRatio,

    topologyOwnsLandVoid: true,
    topologyOwnsSeaLevelBoundary: true,
    topologyOwnsCoastlineSeed: true,
    topologyDefinesTerrainRelief: false,
    topologyDefinesHydrationFill: false,
    topologyDefinesOceanDepth: false,
    topologyDefinesDeepOcean: false,

    terrainReadyToConsume: true,
    hydrationReadyToConsume: true,
    oceansReadyToConsume: true,
    deepOceanReadyToConsume: true,
    runtimeReadyToConsume: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,

    cells: includeCells ? cells : undefined
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  cachedStats = buildTopologyField({
    width: 192,
    height: 96,
    includeCells: false
  });

  exposeTopologyStatus({
    measuredSolidSurfaceRatio: cachedStats.weightedSolidSurfaceRatio,
    measuredLiquidVoidRatio: cachedStats.weightedLiquidVoidRatio,
    solidSurfaceRatioTargetMet: cachedStats.solidSurfaceRatioTargetMet,
    liquidVoidRatioTargetMet: cachedStats.liquidVoidRatioTargetMet
  });

  return cachedStats;
}

function exposeTopologyStatus(extra = {}) {
  Object.assign(STATUS, extra);

  if (typeof window !== "undefined") {
    window.AUDRALIA_TOPOLOGY_STATUS = STATUS;
    window.AUDRALIA_TOPOLOGY_RECEIPT = AUDRALIA_TOPOLOGY_RECEIPT;
    window.__AUDRALIA_TOPOLOGY_STATUS__ = STATUS;
    window.__AUDRALIA_TOPOLOGY_RECEIPT__ = AUDRALIA_TOPOLOGY_RECEIPT;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaTopologyReceipt = AUDRALIA_TOPOLOGY_RECEIPT;
    document.documentElement.dataset.audraliaTopologyCompatibilityReceipt = AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT;
    document.documentElement.dataset.audraliaTopologyLandVoidBoundary = "true";
    document.documentElement.dataset.audraliaTopologySeaLevelBoundary = "true";
    document.documentElement.dataset.audraliaTopologyDownstreamReady = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function createAuthority() {
  if (cachedAuthority) return cachedAuthority;

  cachedAuthority = {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipt: AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT,
    status: STATUS,
    sampleTopology: sampleAudraliaTopology,
    sampleAudraliaTopology,
    sampleSurface: sampleAudraliaTopology,
    buildTopologyField,
    getStats,
    getTopologyStats,
    getStatus
  };

  return cachedAuthority;
}

export function getStatus() {
  return {
    ...STATUS,
    stats: computeStats()
  };
}

export function getStats() {
  return computeStats();
}

export function getTopologyStats() {
  return computeStats();
}

export function sampleTopology(input, lonArg, uArg, vArg) {
  return sampleAudraliaTopology(input, lonArg, uArg, vArg);
}

export function sampleAudraliaTopologyState(input, lonArg, uArg, vArg) {
  return sampleAudraliaTopology(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleAudraliaTopology(input, lonArg, uArg, vArg);
}

export function createAudraliaTopology() {
  return createAuthority();
}

export async function createAudraliaTopologyAsync() {
  return createAuthority();
}

export {
  AUDRALIA_TOPOLOGY_RECEIPT,
  AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPT,
  STATUS as AUDRALIA_TOPOLOGY_STATUS,
  buildTopologyField,
  sampleAudraliaTopology
};

exposeTopologyStatus();

export default createAudraliaTopology;
