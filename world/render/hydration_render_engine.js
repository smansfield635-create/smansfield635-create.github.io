// /world/render/hydration_render_engine.js
// MODE: EXECUTION-ONLY | NON-DRIFT | SIDESTREAM SPECIALIST
// OWNER_LAYER: EXPRESSION
// ROLE:
// - express non-ocean hydration
// - classify inland/coastal hydration bands
// - return a normalized render packet
// - provide ocean-adjacent handoff without owning ocean fill

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function averagePoint(points) {
  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < points.length; i += 1) {
    x += points[i].x;
    y += points[i].y;
    z += points[i].z ?? 0;
  }

  const n = points.length || 1;

  return {
    x: x / n,
    y: y / n,
    z: z / n
  };
}

function scalePoints(points, center, scale) {
  return points.map((point) => ({
    ...point,
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale
  }));
}

function measurePrimitiveSpan(points) {
  let span = 0;

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    span = Math.max(span, Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  return span;
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
    (isFiniteNumber(sample?.basinAccumulation) && sample.basinAccumulation >= 0.58 && sample?.slope <= 0.12)
  );
}

function getPrimitiveTimeState(globalPrimitiveTime) {
  const time = globalPrimitiveTime && typeof globalPrimitiveTime === "object" ? globalPrimitiveTime : {};

  return {
    tick: isFiniteNumber(time.tick) ? time.tick : 0,
    cycle: isFiniteNumber(time.cycle) ? time.cycle : 0,
    day: isFiniteNumber(time.day) ? time.day : 0,
    yearDayIndex: isFiniteNumber(time.yearDayIndex) ? time.yearDayIndex : 0,
    yearLength: isFiniteNumber(time.yearLength) ? time.yearLength : 256,
    cyclePhase: typeof time.cyclePhase === "string" ? time.cyclePhase : "DAY",
    seasonalPhase: typeof time.seasonalPhase === "string" ? time.seasonalPhase : "MID"
  };
}

function resolveHydrationClass(sample) {
  if (isOceanOwnerDomain(sample)) return "NON_HYDRATION_DOMAIN";

  if (sample?.waterMask === 1) {
    if (sample?.flowClass === "RIVER") return "RIVER";
    if (sample?.flowClass === "STREAM") return "STREAM";
    if (sample?.flowClass === "LAKE") return "LAKE";
    if (isSeaAdjacentHydration(sample)) return "LITTORAL_WATER";
  }

  if (isWetlandLike(sample)) return "WETLAND";
  if (sample?.riverCandidate === true) return "RIVER_BANK";
  if (sample?.lakeCandidate === true) return "LAKE_MARGIN";
  if (sample?.shoreline === true || sample?.shorelineBand === true) return "COASTAL_HYDRATION_EDGE";

  return "NONE";
}

function resolveHydrationBandClass(sample, neighbors) {
  if (isOceanOwnerDomain(sample)) return "NONE";

  const waterNeighborCount = countWaterNeighbors(neighbors);
  const landNeighborCount = countLandNeighbors(neighbors);

  if (sample?.waterMask === 1) {
    if (sample?.flowClass === "RIVER") return "CHANNEL_CORE";
    if (sample?.flowClass === "STREAM") return "STREAM_THREAD";
    if (sample?.flowClass === "LAKE") return landNeighborCount > 0 ? "LAKE_EDGE" : "LAKE_CORE";
    if (isSeaAdjacentHydration(sample)) return landNeighborCount > 0 ? "SEA_EDGE" : "SEA_NEARSHORE";
  }

  if (sample?.biomeType === "WETLAND") return "WETLAND_BAND";
  if (sample?.shoreline === true) return "COAST_EDGE";
  if (sample?.shorelineBand === true) return "COAST_BAND";
  if (sample?.riverCandidate === true && waterNeighborCount > 0) return "RIVER_BANK";
  if (sample?.lakeCandidate === true && waterNeighborCount > 0) return "LAKE_MARGIN";

  return "NONE";
}

function resolveFreezeThawClass(sample, primitiveTime) {
  const freeze = clamp(isFiniteNumber(sample?.freezePotential) ? sample.freezePotential : 0, 0, 1);
  const melt = clamp(isFiniteNumber(sample?.meltPotential) ? sample.meltPotential : 0, 0, 1);
  const cyclePhase = primitiveTime.cyclePhase;
  const seasonalPhase = primitiveTime.seasonalPhase;

  if (freeze >= 0.82 && melt <= 0.18) return "FROZEN";
  if (freeze >= 0.58 && melt <= 0.34) return "PARTIAL_FREEZE";
  if (melt >= 0.72 && (cyclePhase === "DAY" || cyclePhase === "DAWN" || seasonalPhase === "WARM")) return "THAW_ACTIVE";
  if (freeze >= 0.34 || melt >= 0.34) return "TRANSITION";
  return "NONE";
}

function resolveShoreHandoffClass(sample, neighbors) {
  if (isOceanOwnerDomain(sample)) return "NONE";

  const landNeighborCount = countLandNeighbors(neighbors);
  const waterNeighborCount = countWaterNeighbors(neighbors);

  if (isSeaAdjacentHydration(sample)) {
    if (landNeighborCount > 0) return "SEA_TO_LAND_EDGE";
    return "SEA_TO_WATER_BLEND";
  }

  if (sample?.shoreline === true || sample?.shorelineBand === true) {
    if (waterNeighborCount > 0) return "LAND_TO_WATER_EDGE";
  }

  if (sample?.riverCandidate === true || sample?.lakeCandidate === true) return "INLAND_TO_SURFACE_WATER";
  if (sample?.biomeType === "WETLAND") return "WETLAND_TO_LAND";

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

function resolveHydrationPrimitiveType(hydrationBandClass) {
  switch (hydrationBandClass) {
    case "CHANNEL_CORE":
      return "RIVER_THREAD";
    case "STREAM_THREAD":
      return "STREAM_THREAD";
    case "LAKE_EDGE":
      return "HALF_TRIANGLE";
    case "LAKE_CORE":
      return "FULL_DIAMOND";
    case "SEA_EDGE":
      return "HALF_TRIANGLE";
    case "SEA_NEARSHORE":
      return "FULL_DIAMOND";
    case "WETLAND_BAND":
      return "FULL_DIAMOND";
    case "COAST_EDGE":
      return "HALF_TRIANGLE";
    case "COAST_BAND":
      return "QUARTER_TRIANGLE";
    case "RIVER_BANK":
      return "QUARTER_TRIANGLE";
    case "LAKE_MARGIN":
      return "QUARTER_TRIANGLE";
    default:
      return "FULL_DIAMOND";
  }
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

function resolveOrientation(sample, neighbors) {
  const northWater = neighbors.north?.waterMask === 1 ? 1 : 0;
  const eastWater = neighbors.east?.waterMask === 1 ? 1 : 0;
  const southWater = neighbors.south?.waterMask === 1 ? 1 : 0;
  const westWater = neighbors.west?.waterMask === 1 ? 1 : 0;

  const maxWater = Math.max(northWater, eastWater, southWater, westWater);

  if (maxWater > 0) {
    if (northWater === maxWater) return "N";
    if (eastWater === maxWater) return "E";
    if (southWater === maxWater) return "S";
    return "W";
  }

  const flowDirection = typeof sample?.flowDirection === "string" ? sample.flowDirection : "NONE";

  if (flowDirection === "N" || flowDirection === "NE" || flowDirection === "NW") return "N";
  if (flowDirection === "E" || flowDirection === "NE" || flowDirection === "SE") return "E";
  if (flowDirection === "S" || flowDirection === "SE" || flowDirection === "SW") return "S";
  if (flowDirection === "W" || flowDirection === "NW" || flowDirection === "SW") return "W";

  return "CENTER";
}

function buildTriangleFromDiamond(points, orientation) {
  const north = points[0];
  const east = points[1];
  const south = points[2];
  const west = points[3];

  switch (orientation) {
    case "N":
      return [north, east, west];
    case "E":
      return [east, north, south];
    case "S":
      return [south, east, west];
    case "W":
      return [west, north, south];
    default:
      return [north, east, west];
  }
}

function buildRiverThread(points, orientation, scalePrimary, scaleSecondary) {
  const center = averagePoint(points);
  const diamond = scalePoints(points, center, scalePrimary);
  const triangle = buildTriangleFromDiamond(points, orientation);
  const thread = scalePoints(triangle, center, scaleSecondary);

  if (thread.length >= 3) return thread;
  return diamond;
}

function buildPrimitivePoints(signalCell, primitiveType, orientation) {
  const center = averagePoint(signalCell.points);

  if (primitiveType === "FULL_DIAMOND") {
    return scalePoints(signalCell.points, center, 1);
  }

  if (primitiveType === "HALF_TRIANGLE") {
    return scalePoints(buildTriangleFromDiamond(signalCell.points, orientation), center, 0.90);
  }

  if (primitiveType === "QUARTER_TRIANGLE") {
    return scalePoints(buildTriangleFromDiamond(signalCell.points, orientation), center, 0.58);
  }

  if (primitiveType === "RIVER_THREAD") {
    return buildRiverThread(signalCell.points, orientation, 0.52, 0.34);
  }

  if (primitiveType === "STREAM_THREAD") {
    return buildRiverThread(signalCell.points, orientation, 0.42, 0.24);
  }

  return scalePoints(signalCell.points, center, 1);
}

export function resolveHydrationPacket({
  sample,
  signalCell,
  x,
  y,
  grid,
  globalPrimitiveTime = null
}) {
  const primitiveTime = getPrimitiveTimeState(globalPrimitiveTime);
  const neighbors = getNeighbors4(grid, x, y);

  const hydrationClass = resolveHydrationClass(sample);
  const hydrationBandClass = resolveHydrationBandClass(sample, neighbors);
  const freezeThawClass = resolveFreezeThawClass(sample, primitiveTime);
  const hydrationOverlayClass = resolveHydrationOverlayClass(sample, primitiveTime);
  const shoreHandoffClass = resolveShoreHandoffClass(sample, neighbors);
  const orientation = resolveOrientation(sample, neighbors);

  const hydrationPrimitiveType =
    hydrationClass === "NON_HYDRATION_DOMAIN" || hydrationClass === "NONE"
      ? "FULL_DIAMOND"
      : resolveHydrationPrimitiveType(hydrationBandClass);

  const hydrationPrimitivePoints = buildPrimitivePoints(
    signalCell,
    hydrationPrimitiveType,
    orientation
  );

  const subdivisionTier =
    hydrationClass === "NON_HYDRATION_DOMAIN" || hydrationClass === "NONE"
      ? 1
      : resolveSubdivisionTier(hydrationBandClass);

  const hydrationBlendStrength =
    hydrationClass === "NON_HYDRATION_DOMAIN" || hydrationClass === "NONE"
      ? 0
      : resolveHydrationBlendStrength(sample, hydrationBandClass);

  return {
    hydrationClass,
    hydrationBandClass,
    hydrationPrimitiveType,
    hydrationPrimitivePoints,
    hydrationBlendStrength,
    hydrationOverlayClass,
    shoreHandoffClass,
    freezeThawClass,
    subdivisionTier,
    approxSpanPx: clamp(measurePrimitiveSpan(hydrationPrimitivePoints), 0, Number.MAX_SAFE_INTEGER)
  };
}
