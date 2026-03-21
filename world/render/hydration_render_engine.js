// /world/render/hydration_render_engine.js
// MODE: RENDER EXTENSION CONTRACT EXPANSION
// STATUS: HYDRATION FACTOR AUTHORITY (EXPANDED)
// ROLE:
// - express non-ocean hydration only
// - classify inland/coastal hydration bands
// - classify flow / retention / organ-side hydration roles
// - return a normalized packet or null
// - provide ocean-adjacent handoff without owning ocean fill
// - aligned with terrain contract family
// - own no boot, no runtime, no truth

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeString(value, fallback = "NONE") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizeColor(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
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
    sample?.flowClass === "BROOK" ||
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
  const time = globalPrimitiveTime && typeof globalPrimitiveTime === "object"
    ? globalPrimitiveTime
    : {};

  return {
    tick: isFiniteNumber(time.tick) ? time.tick : 0,
    cycle: isFiniteNumber(time.cycle) ? time.cycle : 0,
    day: isFiniteNumber(time.day) ? time.day : 0,
    yearDayIndex: isFiniteNumber(time.yearDayIndex) ? time.yearDayIndex : 0,
    yearLength: isFiniteNumber(time.yearLength) ? time.yearLength : 256,
    cyclePhase: normalizeString(time.cyclePhase, "DAY"),
    seasonalPhase: normalizeString(time.seasonalPhase, "MID")
  };
}

/* =========================
   HYDRATION / FLOW CLASSIFICATION
========================= */

function classifyFlowStrength(sample) {
  const runoff = clamp(isFiniteNumber(sample?.runoff) ? sample.runoff : 0, 0, 1);
  const rainfall = clamp(isFiniteNumber(sample?.rainfall) ? sample.rainfall : 0, 0, 1);
  const basinAccumulation = clamp(isFiniteNumber(sample?.basinAccumulation) ? sample.basinAccumulation : 0, 0, 1);
  const slope = clamp(isFiniteNumber(sample?.slope) ? sample.slope : 0, 0, 1);

  return clamp(
    runoff * 0.42 +
    rainfall * 0.18 +
    basinAccumulation * 0.24 +
    slope * 0.16,
    0,
    1
  );
}

function classifyFlowClass(sample) {
  const explicit = normalizeString(sample?.flowClass, "NONE");
  if (explicit === "RIVER" || explicit === "STREAM" || explicit === "BROOK" || explicit === "LAKE" || explicit === "SEA") {
    return explicit;
  }

  const flowStrength = classifyFlowStrength(sample);

  if (sample?.lakeCandidate === true && flowStrength >= 0.40) return "LAKE";
  if (sample?.riverCandidate === true && flowStrength >= 0.52) return "RIVER";
  if (sample?.riverCandidate === true || flowStrength >= 0.34) return "STREAM";
  if (flowStrength >= 0.22) return "BROOK";

  return "NONE";
}

function classifyRetentionClass(sample, flowClass) {
  const basinAccumulation = clamp(isFiniteNumber(sample?.basinAccumulation) ? sample.basinAccumulation : 0, 0, 1);
  const slope = clamp(isFiniteNumber(sample?.slope) ? sample.slope : 0, 0, 1);

  if (flowClass === "LAKE" && basinAccumulation >= 0.68 && slope <= 0.10) return "MAJOR_LAKE";
  if (flowClass === "LAKE" && basinAccumulation >= 0.56 && slope <= 0.10) return "LAKE";
  if (sample?.biomeType === "WETLAND" || (basinAccumulation >= 0.48 && slope <= 0.12 && flowClass === "NONE")) {
    return "WETLAND";
  }
  if (basinAccumulation >= 0.42 && slope <= 0.14 && flowClass === "NONE") return "MICRO_RESERVOIR";

  return "NONE";
}

function classifyHydrationOrgan(sample, flowClass, retentionClass) {
  if (retentionClass === "MAJOR_LAKE" || retentionClass === "LAKE") return "RESERVOIR_ORGAN";
  if (retentionClass === "WETLAND") return "DIFFUSION_ORGAN";
  if (sample?.terrainClass === "BASIN") return "INTAKE_BASIN";
  if (flowClass === "RIVER") return "ARTERY_PATH";
  if (flowClass === "STREAM") return "VEIN_PATH";
  if (flowClass === "BROOK") return "CAPILLARY_ZONE";

  return "NONE";
}

function resolveHydrationClass(sample) {
  if (!sample) return "NONE";
  if (isOceanOwnerDomain(sample)) return "NON_HYDRATION_DOMAIN";

  const flowClass = classifyFlowClass(sample);
  const retentionClass = classifyRetentionClass(sample, flowClass);

  if (sample.waterMask === 1) {
    if (flowClass === "RIVER") return "RIVER";
    if (flowClass === "STREAM" || flowClass === "BROOK") return "STREAM";
    if (flowClass === "LAKE") return "LAKE";
    if (isSeaAdjacentHydration(sample)) return "LITTORAL_WATER";
  }

  if (retentionClass === "WETLAND" || isWetlandLike(sample)) return "WETLAND";
  if (sample.riverCandidate === true) return "RIVER_BANK";
  if (sample.lakeCandidate === true) return "LAKE_MARGIN";
  if (sample.shoreline === true || sample.shorelineBand === true) return "COASTAL_HYDRATION_EDGE";

  return "NONE";
}

function resolveHydrationBandClass(sample, neighbors) {
  if (!sample) return "NONE";
  if (isOceanOwnerDomain(sample)) return "NONE";

  const flowClass = classifyFlowClass(sample);
  const retentionClass = classifyRetentionClass(sample, flowClass);
  const waterNeighborCount = countWaterNeighbors(neighbors);
  const landNeighborCount = countLandNeighbors(neighbors);

  if (sample.waterMask === 1) {
    if (flowClass === "RIVER") return "CHANNEL_CORE";
    if (flowClass === "STREAM" || flowClass === "BROOK") return "STREAM_THREAD";
    if (flowClass === "LAKE") return landNeighborCount > 0 ? "LAKE_EDGE" : "LAKE_CORE";
    if (isSeaAdjacentHydration(sample)) return landNeighborCount > 0 ? "SEA_EDGE" : "SEA_NEARSHORE";
  }

  if (retentionClass === "WETLAND" || sample.biomeType === "WETLAND") return "WETLAND_BAND";
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
  const flowClass = classifyFlowClass(sample);

  if (freezeThawClass === "FROZEN") return "ICE_SHEEN";
  if (freezeThawClass === "PARTIAL_FREEZE") return "PARTIAL_ICE";
  if (freezeThawClass === "THAW_ACTIVE") return "THAW_GLEAM";

  if (sample?.biomeType === "WETLAND") return "SATURATED_GROUND";
  if (flowClass === "RIVER" || flowClass === "STREAM" || flowClass === "BROOK") return "FLOW_HIGHLIGHT";
  if (flowClass === "LAKE") return "STILL_WATER_GLOSS";
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

function resolveDropClass(sample, flowClass) {
  const slope = clamp(isFiniteNumber(sample?.slope) ? sample.slope : 0, 0, 1);
  const canyonStrength = clamp(isFiniteNumber(sample?.canyonStrength) ? sample.canyonStrength : 0, 0, 1);
  const plateauStrength = clamp(isFiniteNumber(sample?.plateauStrength) ? sample.plateauStrength : 0, 0, 1);

  if ((flowClass === "RIVER" || flowClass === "STREAM" || flowClass === "BROOK") && slope >= 0.48 && canyonStrength >= 0.24) {
    return "WATERFALL";
  }
  if ((flowClass === "RIVER" || flowClass === "STREAM") && slope >= 0.34 && plateauStrength >= 0.40) {
    return "ESCARPMENT_FALL";
  }

  return "NONE";
}

function resolveHydrationRadius(pointSizePx, hydrationBandClass, overlayClass, flowClass, retentionClass) {
  if (overlayClass === "ICE_SHEEN" || overlayClass === "PARTIAL_ICE") {
    return pointSizePx * 1.18;
  }

  if (retentionClass === "MAJOR_LAKE") return pointSizePx * 1.02;
  if (retentionClass === "LAKE") return pointSizePx * 0.96;
  if (retentionClass === "WETLAND") return pointSizePx * 0.94;
  if (flowClass === "RIVER") return pointSizePx * 0.86;
  if (flowClass === "STREAM") return pointSizePx * 0.78;
  if (flowClass === "BROOK") return pointSizePx * 0.68;

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

function resolveHydrationColor(hydrationClass, hydrationBandClass, overlayClass, flowClass, retentionClass, dropClass) {
  if (dropClass === "WATERFALL" || dropClass === "ESCARPMENT_FALL") return "rgba(210,236,255,0.96)";
  if (overlayClass === "ICE_SHEEN") return "rgba(232,244,255,0.90)";
  if (overlayClass === "PARTIAL_ICE") return "rgba(206,230,248,0.82)";
  if (overlayClass === "THAW_GLEAM") return "rgba(144,214,255,0.28)";

  if (retentionClass === "MAJOR_LAKE") return "rgba(82,166,224,0.94)";
  if (retentionClass === "LAKE" || retentionClass === "MICRO_RESERVOIR") return "rgba(92,176,232,0.92)";
  if (retentionClass === "WETLAND") return "rgba(110,168,126,0.88)";
  if (flowClass === "RIVER") return "rgba(98,188,236,0.94)";
  if (flowClass === "STREAM") return "rgba(118,198,240,0.90)";
  if (flowClass === "BROOK") return "rgba(146,208,242,0.82)";

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

function resolveHydrationAlpha(hydrationBlendStrength, overlayClass, hydrationClass, flowClass, retentionClass, dropClass) {
  if (dropClass === "WATERFALL" || dropClass === "ESCARPMENT_FALL") return 0.96;
  if (overlayClass === "THAW_GLEAM") return 0.22;
  if (overlayClass === "ICE_SHEEN") return 0.90;
  if (overlayClass === "PARTIAL_ICE") return 0.82;
  if (retentionClass === "WETLAND") return 0.88;
  if (retentionClass === "MAJOR_LAKE" || retentionClass === "LAKE") return 0.92;
  if (flowClass === "RIVER") return 0.94;
  if (flowClass === "STREAM") return 0.90;
  if (flowClass === "BROOK") return 0.82;

  const base =
    hydrationClass === "WETLAND"
      ? 0.90
      : hydrationClass === "COASTAL_HYDRATION_EDGE"
        ? 0.86
        : 0.92;

  return clamp(base * (0.72 + hydrationBlendStrength * 0.28), 0.18, 1);
}

function resolveOverlayOnly(overlayClass, flowClass, retentionClass, dropClass) {
  if (dropClass === "WATERFALL" || dropClass === "ESCARPMENT_FALL") return true;
  if (retentionClass === "MAJOR_LAKE" || retentionClass === "LAKE" || retentionClass === "MICRO_RESERVOIR" || retentionClass === "WETLAND") {
    return true;
  }
  if (flowClass === "RIVER" || flowClass === "STREAM" || flowClass === "BROOK") return true;

  return (
    overlayClass === "THAW_GLEAM" ||
    overlayClass === "ICE_SHEEN" ||
    overlayClass === "PARTIAL_ICE"
  );
}

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "HYDRATION_RENDER_CONTRACT_v3",
    engineKey: "hydration",
    layer: normalizeString(packet.layer, "hydration"),
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

    hydrationClass: normalizeString(packet.hydrationClass, "NONE"),
    hydrationBandClass: normalizeString(packet.hydrationBandClass, "NONE"),
    hydrationOverlayClass: normalizeString(packet.hydrationOverlayClass, "NONE"),
    shoreHandoffClass: normalizeString(packet.shoreHandoffClass, "NONE"),
    freezeThawClass: normalizeString(packet.freezeThawClass, "NONE"),

    flowClass: normalizeString(packet.flowClass, "NONE"),
    retentionClass: normalizeString(packet.retentionClass, "NONE"),
    hydrationOrgan: normalizeString(packet.hydrationOrgan, "NONE"),
    dropClass: normalizeString(packet.dropClass, "NONE"),
    flowDirection: normalizeString(packet.flowDirection, "NONE"),

    subdivisionTier: Number.isInteger(packet.subdivisionTier) ? packet.subdivisionTier : 1,
    hydrationBlendStrength: clamp(
      isFiniteNumber(packet.hydrationBlendStrength) ? packet.hydrationBlendStrength : 0,
      0,
      1
    ),
    flowStrength: clamp(
      isFiniteNumber(packet.flowStrength) ? packet.flowStrength : 0,
      0,
      1
    ),

    renderIntent: Object.freeze({
      drawsHydration: true,
      ownsOceanFill: false,
      ownsBoot: false,
      ownsRuntime: false,
      ownsTruth: false
    })
  });
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

  const flowClass = classifyFlowClass(sample);
  const retentionClass = classifyRetentionClass(sample, flowClass);
  const hydrationOrgan = classifyHydrationOrgan(sample, flowClass, retentionClass);
  const dropClass = resolveDropClass(sample, flowClass);
  const flowDirection = normalizeString(sample?.flowDirection, "NONE");

  const subdivisionTier = resolveSubdivisionTier(hydrationBandClass);
  const hydrationBlendStrength = resolveHydrationBlendStrength(sample, hydrationBandClass);
  const flowStrength = classifyFlowStrength(sample);

  const safePointSizePx = clamp(
    isFiniteNumber(pointSizePx) ? pointSizePx : 1,
    0.6,
    12
  );

  const radiusPx = resolveHydrationRadius(
    safePointSizePx,
    hydrationBandClass,
    hydrationOverlayClass,
    flowClass,
    retentionClass
  );

  const color = resolveHydrationColor(
    hydrationClass,
    hydrationBandClass,
    hydrationOverlayClass,
    flowClass,
    retentionClass,
    dropClass
  );

  const alpha = resolveHydrationAlpha(
    hydrationBlendStrength,
    hydrationOverlayClass,
    hydrationClass,
    flowClass,
    retentionClass,
    dropClass
  );

  const overlayOnly = resolveOverlayOnly(
    hydrationOverlayClass,
    flowClass,
    retentionClass,
    dropClass
  );

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

    flowClass,
    retentionClass,
    hydrationOrgan,
    dropClass,
    flowDirection,

    subdivisionTier,
    hydrationBlendStrength,
    flowStrength
  }, baseColor, safePointSizePx);
}

export default Object.freeze({
  resolveHydrationPacket
});
