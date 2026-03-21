// /world/render/hydration_render_engine.js
// MODE: RENDER EXTENSION FACTOR
// STATUS: HYDRATION PORT AUTHORITY
// ROLE:
// - express non-ocean hydration only
// - classify inland/coastal hydration bands
// - return a normalized packet or null
// - provide ocean-adjacent handoff without owning ocean fill
// - own no boot, no runtime, no truth

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeColor(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return {
    engineKey: "hydration",
    layer: typeof packet.layer === "string" ? packet.layer : "hydration",
    color: normalizeColor(packet.color, fallbackColor),
    radiusPx: clamp(
      isFiniteNumber(packet.radiusPx) ? packet.radiusPx : fallbackRadiusPx,
      0.6,
      12
    ),
    alpha: clamp(
      isFiniteNumber(packet.alpha) ? packet.alpha : 1,
      0,
      1
    ),
    overlayOnly: packet.overlayOnly === true,
    hydrationClass: typeof packet.hydrationClass === "string" ? packet.hydrationClass : "NONE",
    hydrationBandClass: typeof packet.hydrationBandClass === "string" ? packet.hydrationBandClass : "NONE",
    hydrationOverlayClass: typeof packet.hydrationOverlayClass === "string" ? packet.hydrationOverlayClass : "NONE",
    shoreHandoffClass: typeof packet.shoreHandoffClass === "string" ? packet.shoreHandoffClass : "NONE",
    freezeThawClass: typeof packet.freezeThawClass === "string" ? packet.freezeThawClass : "NONE",
    subdivisionTier: Number.isInteger(packet.subdivisionTier) ? packet.subdivisionTier : 1,
    hydrationBlendStrength: clamp(
      isFiniteNumber(packet.hydrationBlendStrength) ? packet.hydrationBlendStrength : 0,
      0,
      1
    )
  };
}

function getWrappedX(x, width) {
  if (width <= 0) return 0;
  if (x < 0) return width - 1;
  if (x >= width) return 0;
  return x;
}

function getCell(grid, x, y) {
  const height = Array.isArray(grid) ? grid.length : 0;
  const width = Array.isArray(grid?.[0]) ? grid[0].length : 0;

  if (height <= 0 || width <= 0) return null;
  if (y < 0 || y >= height) return null;

  return grid[y]?.[getWrappedX(x, width)] ?? null;
}

function getNeighbors4(grid, x, y) {
  return {
    north: getCell(grid, x, y - 1),
    east: getCell(grid, x + 1, y),
    south: getCell(grid, x, y + 1),
    west: getCell(grid, x - 1, y)
  };
}

function countWaterNeighbors(neighbors) {
  let count = 0;
  if (neighbors.north?.waterMask === 1) count += 1;
  if (neighbors.east?.waterMask === 1) count += 1;
  if (neighbors.south?.waterMask === 1) count += 1;
  if (neighbors.west?.waterMask === 1) count += 1;
  return count;
}

function countLandNeighbors(neighbors) {
  let count = 0;
  if (neighbors.north?.landMask === 1) count += 1;
  if (neighbors.east?.landMask === 1) count += 1;
  if (neighbors.south?.landMask === 1) count += 1;
  if (neighbors.west?.landMask === 1) count += 1;
  return count;
}

function isOceanOwnerDomain(sample) {
  return sample?.waterMask === 1 && !(
    sample?.flowClass === "RIVER" ||
    sample?.flowClass === "STREAM" ||
    sample?.flowClass === "LAKE" ||
    sample?.flowClass === "SEA" ||
    sample?.riverCandidate === true ||
    sample?.lakeCandidate === true ||
    sample?.macroWaterClass === "SEA"
  );
}

function isSeaAdjacentHydration(sample) {
  return sample?.macroWaterClass === "SEA" || sample?.flowClass === "SEA";
}

function isWetlandLike(sample) {
  return (
    sample?.biomeType === "WETLAND" ||
    (
      isFiniteNumber(sample?.basinAccumulation) &&
      sample.basinAccumulation >= 0.58 &&
      isFiniteNumber(sample?.slope) &&
      sample.slope <= 0.12
    )
  );
}

function getPrimitiveTimeState(globalPrimitiveTime) {
  const time = globalPrimitiveTime && typeof globalPrimitiveTime === "object" ? globalPrimitiveTime : {};

  return {
    cyclePhase: typeof time.cyclePhase === "string" ? time.cyclePhase : "DAY",
    seasonalPhase: typeof time.seasonalPhase === "string" ? time.seasonalPhase : "MID"
  };
}

function resolveHydrationClass(sample) {
  if (!sample) return "NONE";
  if (isOceanOwnerDomain(sample)) return "NON_HYDRATION_DOMAIN";

  if (sample.waterMask === 1) {
    if (sample.flowClass === "RIVER") return "RIVER";
    if (sample.flowClass === "STREAM") return "STREAM";
    if (sample.flowClass === "LAKE") return "LAKE";
    if (isSeaAdjacentHydration(sample)) return "LITTORAL_WATER";
  }

  if (isWetlandLike(sample)) return "WETLAND";
  if (sample.riverCandidate === true) return "RIVER_BANK";
  if (sample.lakeCandidate === true) return "LAKE_MARGIN";
  if (sample.shoreline === true || sample.shorelineBand === true) return "COASTAL_HYDRATION_EDGE";

  return "NONE";
}

function resolveHydrationBandClass(sample, neighbors) {
  if (!sample) return "NONE";
  if (isOceanOwnerDomain(sample)) return "NONE";

  const waterNeighborCount = countWaterNeighbors(neighbors);
  const landNeighborCount = countLandNeighbors(neighbors);

  if (sample.waterMask === 1) {
    if (sample.flowClass === "RIVER") return "CHANNEL_CORE";
    if (sample.flowClass === "STREAM") return "STREAM_THREAD";
    if (sample.flowClass === "LAKE") return landNeighborCount > 0 ? "LAKE_EDGE" : "LAKE_CORE";
    if (isSeaAdjacentHydration(sample)) return landNeighborCount > 0 ? "SEA_EDGE" : "SEA_NEARSHORE";
  }

  if (sample.biomeType === "WETLAND") return "WETLAND_BAND";
  if (sample.shoreline === true) return "COAST_EDGE";
  if (sample.shorelineBand === true) return "COAST_BAND";
  if (sample.riverCandidate === true && waterNeighborCount > 0) return "RIVER_BANK";
  if (sample.lakeCandidate === true && waterNeighborCount > 0) return "LAKE_MARGIN";

  return "NONE";
}

function resolveFreezeThawClass(sample, primitiveTime) {
  const freeze = clamp(isFiniteNumber(sample?.freezePotential) ? sample.freezePotential : 0, 0, 1);
  const melt = clamp(isFiniteNumber(sample?.meltPotential) ? sample.meltPotential : 0, 0, 1);
  const cyclePhase = primitiveTime.cyclePhase;
  const seasonalPhase = primitiveTime.seasonalPhase;

  if (freeze >= 0.82 && melt <= 0.18) return "FROZEN";
  if (freeze >= 0.58 && melt <= 0.34) return "PARTIAL_FREEZE";
  if (melt >= 0.72 && (cyclePhase === "DAY" || cyclePhase === "DAWN" || seasonalPhase === "WARM")) {
    return "THAW_ACTIVE";
  }
  if (freeze >= 0.34 || melt >= 0.34) return "TRANSITION";
  return "NONE";
}

function resolveShoreHandoffClass(sample, neighbors) {
  if (!sample) return "NONE";
  if (isOceanOwnerDomain(sample)) return "NONE";

  const landNeighborCount = countLandNeighbors(neighbors);
  const waterNeighborCount = countWaterNeighbors(neighbors);

  if (isSeaAdjacentHydration(sample)) {
    if (landNeighborCount > 0) return "SEA_TO_LAND_EDGE";
    return "SEA_TO_WATER_BLEND";
  }

  if (sample.shoreline === true || sample.shorelineBand === true) {
    if (waterNeighborCount > 0) return "LAND_TO_WATER_EDGE";
  }

  if (sample.riverCandidate === true || sample.lakeCandidate === true) return "INLAND_TO_SURFACE_WATER";
  if (sample.biomeType === "WETLAND") return "WETLAND_TO_LAND";

  return "NONE";
}

function resolveHydrationOverlayClass(sample, primitiveTime) {
  const freezeThawClass = resolveFreezeThawClass(sample, primitiveTime);

  if (freezeThawClass === "FROZEN") return "ICE_SHEEN";
  if (freezeThawClass === "PARTIAL_FREEZE") return "PARTIAL_ICE";
  if (freezeThawClass === "THAW_ACTIVE") return "THAW_GLEAM";

  if (sample?.biomeType === "WETLAND") return "SATURATED_GROUND";
  if (sample?.flowClass === "RIVER" || sample?.flowClass === "STREAM") return "FLOW_HIGHLIGHT";
  if (sample?.flowClass === "LAKE") return "STILL_WATER_GLOSS";
  if (sample?.shoreline === true || sample?.shorelineBand === true) return "LITTORAL_MOISTURE";

  return "NONE";
}

function resolveSubdivisionTier(hydrationBandClass) {
  switch (hydrationBandClass) {
    case "CHANNEL_CORE":
    case "STREAM_THREAD":
      return 8;
    case "RIVER_BANK":
    case "LAKE_MARGIN":
    case "COAST_BAND":
      return 4;
    case "LAKE_EDGE":
    case "SEA_EDGE":
    case "COAST_EDGE":
      return 2;
    default:
      return 1;
  }
}

function resolveHydrationBlendStrength(sample, hydrationBandClass) {
  const runoff = clamp(isFiniteNumber(sample?.runoff) ? sample.runoff : 0, 0, 1);
  const rainfall = clamp(isFiniteNumber(sample?.rainfall) ? sample.rainfall : 0, 0, 1);
  const basinAccumulation = clamp(isFiniteNumber(sample?.basinAccumulation) ? sample.basinAccumulation : 0, 0, 1);

  const base =
    runoff * 0.40 +
    rainfall * 0.25 +
    basinAccumulation * 0.20 +
    (sample?.shoreline === true ? 0.10 : 0) +
    (sample?.biomeType === "WETLAND" ? 0.15 : 0);

  switch (hydrationBandClass) {
    case "CHANNEL_CORE":
    case "STREAM_THREAD":
      return clamp(base + 0.25, 0, 1);
    case "LAKE_CORE":
    case "LAKE_EDGE":
      return clamp(base + 0.18, 0, 1);
    case "SEA_EDGE":
    case "COAST_EDGE":
      return clamp(base + 0.14, 0, 1);
    case "WETLAND_BAND":
      return clamp(base + 0.20, 0, 1);
    default:
      return clamp(base, 0, 1);
  }
}

function resolveHydrationRadius(pointSizePx, hydrationBandClass, overlayClass) {
  if (overlayClass === "ICE_SHEEN" || overlayClass === "PARTIAL_ICE") {
    return pointSizePx * 1.18;
  }

  switch (hydrationBandClass) {
    case "CHANNEL_CORE":
    case "STREAM_THREAD":
      return pointSizePx * 0.84;
    case "LAKE_EDGE":
    case "SEA_EDGE":
      return pointSizePx * 0.94;
    case "LAKE_CORE":
    case "SEA_NEARSHORE":
      return pointSizePx * 1.00;
    case "WETLAND_BAND":
      return pointSizePx * 1.08;
    case "COAST_EDGE":
      return pointSizePx * 1.02;
    case "COAST_BAND":
      return pointSizePx * 0.96;
    case "RIVER_BANK":
    case "LAKE_MARGIN":
      return pointSizePx * 0.90;
    default:
      return pointSizePx;
  }
}

function resolveHydrationColor(hydrationClass, hydrationBandClass, overlayClass) {
  if (overlayClass === "ICE_SHEEN") return "rgba(232,244,255,0.90)";
  if (overlayClass === "PARTIAL_ICE") return "rgba(206,230,248,0.82)";
  if (overlayClass === "THAW_GLEAM") return "rgba(144,214,255,0.28)";

  switch (hydrationBandClass) {
    case "CHANNEL_CORE":
      return "rgba(88,176,228,0.94)";
    case "STREAM_THREAD":
      return "rgba(100,186,234,0.92)";
    case "LAKE_EDGE":
      return "rgba(82,166,224,0.94)";
    case "LAKE_CORE":
      return "rgba(74,154,214,0.94)";
    case "SEA_EDGE":
      return "rgba(70,150,212,0.88)";
    case "SEA_NEARSHORE":
      return "rgba(62,142,206,0.84)";
    case "WETLAND_BAND":
      return "rgba(92,154,112,0.90)";
    case "COAST_EDGE":
      return "rgba(214,202,144,0.92)";
    case "COAST_BAND":
      return "rgba(200,190,138,0.88)";
    case "RIVER_BANK":
      return "rgba(132,188,162,0.86)";
    case "LAKE_MARGIN":
      return "rgba(122,182,170,0.84)";
    default:
      if (hydrationClass === "WETLAND") return "rgba(92,154,112,0.90)";
      if (hydrationClass === "RIVER") return "rgba(88,176,228,0.94)";
      if (hydrationClass === "STREAM") return "rgba(100,186,234,0.92)";
      if (hydrationClass === "LAKE") return "rgba(74,154,214,0.94)";
      if (hydrationClass === "COASTAL_HYDRATION_EDGE") return "rgba(206,196,138,0.88)";
      return "rgba(88,176,228,0.90)";
  }
}

function resolveHydrationAlpha(hydrationBlendStrength, overlayClass, hydrationClass) {
  if (overlayClass === "THAW_GLEAM") return 0.22;
  if (overlayClass === "ICE_SHEEN") return 0.90;
  if (overlayClass === "PARTIAL_ICE") return 0.82;

  const base =
    hydrationClass === "WETLAND"
      ? 0.90
      : hydrationClass === "COASTAL_HYDRATION_EDGE"
        ? 0.86
        : 0.92;

  return clamp(base * (0.72 + hydrationBlendStrength * 0.28), 0.18, 1);
}

function resolveOverlayOnly(overlayClass) {
  return (
    overlayClass === "THAW_GLEAM" ||
    overlayClass === "ICE_SHEEN" ||
    overlayClass === "PARTIAL_ICE"
  );
}

export function resolveHydrationPacket({
  sample,
  pointSizePx,
  grid = null,
  x = 0,
  y = 0,
  globalPrimitiveTime = null,
  baseColor = "rgba(88,176,228,0.90)"
}) {
  if (!sample) return null;

  const primitiveTime = getPrimitiveTimeState(globalPrimitiveTime);
  const neighbors = getNeighbors4(grid, x, y);

  const hydrationClass = resolveHydrationClass(sample);
  if (hydrationClass === "NON_HYDRATION_DOMAIN" || hydrationClass === "NONE") return null;

  const hydrationBandClass = resolveHydrationBandClass(sample, neighbors);
  const freezeThawClass = resolveFreezeThawClass(sample, primitiveTime);
  const hydrationOverlayClass = resolveHydrationOverlayClass(sample, primitiveTime);
  const shoreHandoffClass = resolveShoreHandoffClass(sample, neighbors);
  const subdivisionTier = resolveSubdivisionTier(hydrationBandClass);
  const hydrationBlendStrength = resolveHydrationBlendStrength(sample, hydrationBandClass);

  const radiusPx = resolveHydrationRadius(pointSizePx, hydrationBandClass, hydrationOverlayClass);
  const color = resolveHydrationColor(hydrationClass, hydrationBandClass, hydrationOverlayClass);
  const alpha = resolveHydrationAlpha(hydrationBlendStrength, hydrationOverlayClass, hydrationClass);
  const overlayOnly = resolveOverlayOnly(hydrationOverlayClass);

  return normalizePacket({
    layer: "hydration",
    color,
    radiusPx,
    alpha,
    overlayOnly,
    hydrationClass,
    hydrationBandClass,
    hydrationOverlayClass,
    shoreHandoffClass,
    freezeThawClass,
    subdivisionTier,
    hydrationBlendStrength
  }, baseColor, pointSizePx);
}
