// /world/render/terrain_render_engine.js
// MODE: EXECUTION-ONLY | NON-DRIFT | SIDESTREAM SPECIALIST
// OWNER_LAYER: EXPRESSION
// ROLE:
// - express terrain structure
// - classify landform bands
// - return a normalized render packet
// - preserve terrain as expression only, never truth authority

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

function normalizeTime(globalPrimitiveTime) {
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

function resolveTerrainClass(sample) {
  if (!sample || sample.landMask !== 1) return "NON_TERRAIN_DOMAIN";

  const terrainClass = typeof sample.terrainClass === "string" ? sample.terrainClass : "LOWLAND";

  if (terrainClass === "SUMMIT") return "SUMMIT";
  if (terrainClass === "MOUNTAIN") return "MOUNTAIN";
  if (terrainClass === "GLACIAL_HIGHLAND") return "GLACIAL_HIGHLAND";
  if (terrainClass === "RIDGE") return "RIDGE";
  if (terrainClass === "PLATEAU") return "PLATEAU";
  if (terrainClass === "CANYON") return "CANYON";
  if (terrainClass === "BASIN") return "BASIN";
  if (terrainClass === "FOOTHILL") return "FOOTHILL";
  if (terrainClass === "BEACH") return "BEACH";
  if (terrainClass === "SHORELINE") return "SHORELINE";

  if (sample.cavePotential >= 0.5) return "CAVERNOUS";
  return "LOWLAND";
}

function resolveTerrainBandClass(sample, terrainClass) {
  if (terrainClass === "NON_TERRAIN_DOMAIN") return "NONE";
  if (terrainClass === "SUMMIT") return "PEAK_CORE";
  if (terrainClass === "MOUNTAIN") return "MOUNTAIN_MASS";
  if (terrainClass === "GLACIAL_HIGHLAND") return "GLACIAL_RISE";
  if (terrainClass === "RIDGE") return "RIDGE_LINE";
  if (terrainClass === "PLATEAU") return "PLATEAU_SHELF";
  if (terrainClass === "CANYON") return "CANYON_CUT";
  if (terrainClass === "BASIN") return "BASIN_FLOOR";
  if (terrainClass === "FOOTHILL") return "FOOTHILL_BAND";
  if (terrainClass === "BEACH") return "LITTORAL_SAND";
  if (terrainClass === "SHORELINE") return "LITTORAL_EDGE";
  if (terrainClass === "CAVERNOUS") return "CAVERN_MOUTH";
  return "LOWLAND_FIELD";
}

function resolveTerrainOverlayClass(sample, terrainClass, primitiveTime) {
  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") {
    if (primitiveTime.cyclePhase === "DAWN" || primitiveTime.cyclePhase === "DUSK") return "RELIEF_GLOW";
    return "RELIEF_SHADE";
  }

  if (terrainClass === "GLACIAL_HIGHLAND") return "COLD_RELIEF";
  if (terrainClass === "RIDGE") return "RIDGE_SHADE";
  if (terrainClass === "PLATEAU") return "PLATEAU_LIGHT";
  if (terrainClass === "CANYON") return "CANYON_DEPTH";
  if (terrainClass === "BASIN") return "BASIN_SINK";
  if (terrainClass === "CAVERNOUS") return "SUBSURFACE_HINT";
  if (terrainClass === "BEACH") return "SAND_GLEAM";
  if (terrainClass === "SHORELINE") return "SHORE_SHADE";

  const freezePotential = clamp(isFiniteNumber(sample?.freezePotential) ? sample.freezePotential : 0, 0, 1);
  const seasonalPhase = primitiveTime.seasonalPhase;

  if (freezePotential >= 0.75) return "COLD_SURFACE";
  if (seasonalPhase === "WARM") return "THERMAL_BRIGHTEN";
  return "NONE";
}

function resolveTerrainNarrativeClass(sample, terrainClass) {
  if (terrainClass === "SUMMIT") return "ASCENT";
  if (terrainClass === "MOUNTAIN") return "MASS";
  if (terrainClass === "GLACIAL_HIGHLAND") return "AUSTERITY";
  if (terrainClass === "RIDGE") return "DIVIDE";
  if (terrainClass === "PLATEAU") return "TABLE";
  if (terrainClass === "CANYON") return "CUT";
  if (terrainClass === "BASIN") return "HOLLOW";
  if (terrainClass === "CAVERNOUS") return "DEPTH";
  if (terrainClass === "BEACH" || terrainClass === "SHORELINE") return "LITTORAL";
  if (sample?.strongestSummitScore >= 0.2) return "UPLIFT";
  if (sample?.strongestBasinScore >= 0.06) return "DESCENT";
  return "PLAIN";
}

function resolveTerrainReliefStrength(sample, terrainClass) {
  const elevation = clamp(isFiniteNumber(sample?.elevation) ? sample.elevation : 0, -1, 1);
  const ridgeStrength = clamp(isFiniteNumber(sample?.ridgeStrength) ? sample.ridgeStrength : 0, 0, 1);
  const basinStrength = clamp(isFiniteNumber(sample?.basinStrength) ? sample.basinStrength : 0, 0, 1);
  const canyonStrength = clamp(isFiniteNumber(sample?.canyonStrength) ? sample.canyonStrength : 0, 0, 1);
  const plateauStrength = clamp(isFiniteNumber(sample?.plateauStrength) ? sample.plateauStrength : 0, 0, 1);
  const slope = clamp(isFiniteNumber(sample?.slope) ? sample.slope : 0, 0, 1);

  let relief =
    Math.max(0, elevation) * 0.35 +
    ridgeStrength * 0.25 +
    canyonStrength * 0.20 +
    plateauStrength * 0.12 +
    slope * 0.08;

  if (terrainClass === "BASIN") relief = Math.max(relief, basinStrength * 0.55);
  if (terrainClass === "SUMMIT") relief = Math.max(relief, 0.82);
  if (terrainClass === "MOUNTAIN") relief = Math.max(relief, 0.62);
  if (terrainClass === "CANYON") relief = Math.max(relief, 0.58);
  if (terrainClass === "PLATEAU") relief = Math.max(relief, 0.46);
  if (terrainClass === "FOOTHILL") relief = Math.max(relief, 0.28);

  return clamp(relief, 0, 1);
}

function resolveTerrainEdgeClass(sample, terrainClass) {
  if (terrainClass === "SHORELINE" || terrainClass === "BEACH") return "COASTAL_EDGE";
  if (terrainClass === "CANYON") return "CUT_EDGE";
  if (terrainClass === "RIDGE") return "RIDGE_EDGE";
  if (terrainClass === "PLATEAU") return "SHELF_EDGE";
  if (terrainClass === "BASIN") return "BASIN_EDGE";
  if (sample?.distanceToWater === 0 || sample?.shoreline === true) return "WATER_ADJACENT";
  return "INTERIOR";
}

function resolveTerrainPrimitiveType(terrainClass, terrainBandClass) {
  if (terrainClass === "SUMMIT") return "PEAK_DIAMOND";
  if (terrainClass === "MOUNTAIN") return "MASS_DIAMOND";
  if (terrainClass === "GLACIAL_HIGHLAND") return "MASS_DIAMOND";
  if (terrainClass === "RIDGE") return "RIDGE_DIAMOND";
  if (terrainClass === "PLATEAU") return "PLATEAU_DIAMOND";
  if (terrainClass === "CANYON") return "CUT_DIAMOND";
  if (terrainClass === "BASIN") return "BASIN_DIAMOND";
  if (terrainBandClass === "LITTORAL_EDGE" || terrainBandClass === "LITTORAL_SAND") return "HALF_TRIANGLE";
  if (terrainClass === "CAVERNOUS") return "CAVERN_DIAMOND";
  return "FULL_DIAMOND";
}

function resolveSubdivisionTier(terrainClass, terrainBandClass) {
  if (terrainClass === "SUMMIT") return 4;
  if (terrainClass === "MOUNTAIN") return 3;
  if (terrainClass === "GLACIAL_HIGHLAND") return 3;
  if (terrainClass === "RIDGE") return 3;
  if (terrainClass === "CANYON") return 3;
  if (terrainClass === "PLATEAU") return 2;
  if (terrainClass === "BASIN") return 2;
  if (terrainBandClass === "LITTORAL_EDGE" || terrainBandClass === "LITTORAL_SAND") return 2;
  return 1;
}

function buildPrimitivePoints(signalCell, primitiveType, terrainReliefStrength) {
  const center = averagePoint(signalCell.points);

  if (primitiveType === "PEAK_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.46);
  }

  if (primitiveType === "MASS_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.66);
  }

  if (primitiveType === "RIDGE_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.78);
  }

  if (primitiveType === "PLATEAU_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.88);
  }

  if (primitiveType === "CUT_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.58);
  }

  if (primitiveType === "BASIN_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.62);
  }

  if (primitiveType === "CAVERN_DIAMOND") {
    return scalePoints(signalCell.points, center, 0.52);
  }

  if (primitiveType === "HALF_TRIANGLE") {
    const a = signalCell.points[0];
    const b = signalCell.points[1];
    const d = signalCell.points[3];
    return scalePoints([a, b, d], center, 0.84);
  }

  const adaptiveScale = clamp(0.92 - terrainReliefStrength * 0.18, 0.64, 0.96);
  return scalePoints(signalCell.points, center, adaptiveScale);
}

export function resolveTerrainPacket({
  sample,
  signalCell,
  globalPrimitiveTime = null
}) {
  const primitiveTime = normalizeTime(globalPrimitiveTime);
  const terrainClassResolved = resolveTerrainClass(sample);

  if (terrainClassResolved === "NON_TERRAIN_DOMAIN") {
    return {
      terrainClassResolved,
      terrainBandClass: "NONE",
      terrainPrimitiveType: "FULL_DIAMOND",
      terrainPrimitivePoints: signalCell.points,
      terrainOverlayClass: "NONE",
      terrainReliefStrength: 0,
      terrainEdgeClass: "NONE",
      terrainNarrativeClass: "NONE",
      subdivisionTier: 1,
      approxSpanPx: measurePrimitiveSpan(signalCell.points)
    };
  }

  const terrainBandClass = resolveTerrainBandClass(sample, terrainClassResolved);
  const terrainOverlayClass = resolveTerrainOverlayClass(sample, terrainClassResolved, primitiveTime);
  const terrainNarrativeClass = resolveTerrainNarrativeClass(sample, terrainClassResolved);
  const terrainReliefStrength = resolveTerrainReliefStrength(sample, terrainClassResolved);
  const terrainEdgeClass = resolveTerrainEdgeClass(sample, terrainClassResolved);
  const terrainPrimitiveType = resolveTerrainPrimitiveType(terrainClassResolved, terrainBandClass);
  const subdivisionTier = resolveSubdivisionTier(terrainClassResolved, terrainBandClass);
  const terrainPrimitivePoints = buildPrimitivePoints(signalCell, terrainPrimitiveType, terrainReliefStrength);

  return {
    terrainClassResolved,
    terrainBandClass,
    terrainPrimitiveType,
    terrainPrimitivePoints,
    terrainOverlayClass,
    terrainReliefStrength,
    terrainEdgeClass,
    terrainNarrativeClass,
    subdivisionTier,
    approxSpanPx: clamp(measurePrimitiveSpan(terrainPrimitivePoints), 0, Number.MAX_SAFE_INTEGER)
  };
}
