// /world/render/terrain_render_engine.js
// MODE: TNT FULL FILE REPLACEMENT
// ROLE: TERRAIN FAMILY BRIDGE
// RESULT:
// - Implements N/S/E/W terrain subsidiary constructs
// - Tightens admissibility before directional participation
// - Does not invent terrain identity from UNKNOWN
// - Arbitrates internally to one normalized terrain packet
// - Returns safe NON_TERRAIN_DOMAIN packets instead of hard null exits
// - Preserves render as final bridge authority
// - Reads shared truth + shared time only
// - Writes no truth, no time

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function measurePolygonSpan(points) {
  if (!Array.isArray(points) || points.length < 2) return 0;

  let span = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    span = Math.max(span, Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }
  return span;
}

function averagePoint(points) {
  let x = 0;
  let y = 0;
  let z = 0;

  for (const p of points) {
    x += p.x;
    y += p.y;
    z += p.z ?? 0;
  }

  const n = Math.max(1, points.length);

  return {
    x: x / n,
    y: y / n,
    z: z / n,
    visible: points.some((p) => p.visible === true),
  };
}

function pointBetween(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: (a.z ?? 0) + ((b.z ?? 0) - (a.z ?? 0)) * t,
    visible: (a.visible === true) || (b.visible === true),
  };
}

function insetToward(point, center, amount) {
  return {
    x: point.x + (center.x - point.x) * amount,
    y: point.y + (center.y - point.y) * amount,
    z: (point.z ?? 0) + ((center.z ?? 0) - (point.z ?? 0)) * amount,
    visible: point.visible === true || center.visible === true,
  };
}

function normalizePrimitivePoints(points) {
  if (!Array.isArray(points) || points.length < 3) return null;
  return points.map((p) => ({
    x: p.x,
    y: p.y,
    z: p.z ?? 0,
    visible: p.visible === true,
  }));
}

function deriveTerrainClass(sample) {
  if (typeof sample?.terrainClass === "string" && sample.terrainClass.length > 0) {
    return sample.terrainClass;
  }
  return "UNKNOWN";
}

function deriveBiomeType(sample) {
  if (typeof sample?.biomeType === "string" && sample.biomeType.length > 0) {
    return sample.biomeType;
  }
  return "NONE";
}

function buildNonTerrainPacket() {
  return {
    terrainClassResolved: "NON_TERRAIN_DOMAIN",
    terrainBandClass: "NONE",
    terrainOverlayClass: "NONE",
    terrainEdgeClass: "NONE",
    terrainNarrativeClass: "NONE",
    terrainReliefStrength: 0,
    terrainPrimitiveType: "NONE",
    terrainPrimitivePoints: null,
    subdivisionTier: 0,
    approxSpanPx: 0,
    dominantDirection: "NONE",
    arbitrationRule: "NORTH_SOUTH_EAST_WEST_INTERNAL_SELECTION",
    failureCondition: "FAIL_IF_TERRAIN_WRITES_TRUTH_OR_TIME",
    terrainFamilyClass: "TERRAIN_FAMILY_BRIDGE",
    terrainDirectionScores: {
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    },
  };
}

function computeDirectionalEvidence(sample, topology) {
  const terrainClass = deriveTerrainClass(sample);
  const biomeType = deriveBiomeType(sample);

  const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  const ridgeStrength = clamp(
    isFiniteNumber(topology?.ridgeStrength) ? topology.ridgeStrength : sample?.ridgeStrength ?? 0,
    0,
    1
  );
  const basinStrength = clamp(
    isFiniteNumber(topology?.basinStrength) ? topology.basinStrength : sample?.basinStrength ?? 0,
    0,
    1
  );
  const canyonStrength = clamp(
    isFiniteNumber(topology?.canyonStrength) ? topology.canyonStrength : sample?.canyonStrength ?? 0,
    0,
    1
  );
  const plateauStrength = clamp(
    isFiniteNumber(topology?.plateauStrength) ? topology.plateauStrength : sample?.plateauStrength ?? 0,
    0,
    1
  );
  const slope = clamp(
    Math.abs(isFiniteNumber(topology?.slope) ? topology.slope : sample?.slope ?? 0),
    0,
    1
  );

  const rangeDirection =
    typeof sample?.rangeDirection === "string" ? sample.rangeDirection : "NONE";
  const valleyDirection =
    typeof sample?.valleyDirection === "string" ? sample.valleyDirection : "NONE";
  const canyonDirection =
    typeof sample?.canyonDirection === "string" ? sample.canyonDirection : "NONE";
  const plateauOrientation =
    typeof sample?.plateauOrientation === "string" ? sample.plateauOrientation : "NONE";
  const dominantAxis =
    typeof sample?.dominantAxis === "string" ? sample.dominantAxis : "NONE";

  const northScore =
    ridgeStrength * 0.68 +
    (elevation > 0 ? clamp(elevation, 0, 1) * 0.24 : 0) +
    (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN" || terrainClass === "RIDGE" ? 0.32 : 0) +
    (rangeDirection === "NS" ? 0.08 : 0);

  const southScore =
    basinStrength * 0.50 +
    canyonStrength * 0.46 +
    (terrainClass === "BASIN" || terrainClass === "CANYON" || terrainClass === "VALLEY" ? 0.28 : 0) +
    (valleyDirection === "S" || canyonDirection === "S" ? 0.08 : 0);

  const eastScore =
    (dominantAxis === "EW" ? 0.18 : 0) +
    (rangeDirection === "EW" ? 0.16 : 0) +
    (valleyDirection === "E" || canyonDirection === "E" ? 0.12 : 0) +
    slope * 0.28 +
    (terrainClass === "SLOPE" || terrainClass === "PASS" ? 0.18 : 0);

  const westScore =
    plateauStrength * 0.62 +
    (plateauOrientation === "EW" || plateauOrientation === "NS" ? 0.12 : 0) +
    (terrainClass === "PLATEAU" || terrainClass === "CAVERN" ? 0.26 : 0) +
    (sample?.cavePotential >= 0.5 ? 0.12 : 0);

  const reliefStrength = clamp(
    ridgeStrength * 0.40 +
    basinStrength * 0.18 +
    canyonStrength * 0.20 +
    plateauStrength * 0.14 +
    slope * 0.08,
    0,
    1
  );

  return {
    terrainClass,
    biomeType,
    rangeDirection,
    valleyDirection,
    canyonDirection,
    plateauOrientation,
    dominantAxis,
    elevation,
    ridgeStrength,
    basinStrength,
    canyonStrength,
    plateauStrength,
    slope,
    northScore,
    southScore,
    eastScore,
    westScore,
    reliefStrength,
  };
}

function getDirectionThresholds(terrainClass) {
  switch (terrainClass) {
    case "SUMMIT":
    case "MOUNTAIN":
    case "RIDGE":
      return { north: 0.42, south: 0.28, east: 0.22, west: 0.22 };
    case "BASIN":
    case "CANYON":
    case "VALLEY":
      return { north: 0.22, south: 0.40, east: 0.24, west: 0.22 };
    case "PLATEAU":
    case "CAVERN":
      return { north: 0.22, south: 0.22, east: 0.24, west: 0.38 };
    case "SLOPE":
    case "PASS":
      return { north: 0.18, south: 0.18, east: 0.34, west: 0.20 };
    case "BEACH":
    case "SHORELINE":
      return { north: 0.16, south: 0.16, east: 0.16, west: 0.16 };
    case "UNKNOWN":
    default:
      return { north: 0.38, south: 0.38, east: 0.38, west: 0.38 };
  }
}

function isDirectionAdmissible(direction, evidence) {
  const thresholds = getDirectionThresholds(evidence.terrainClass);

  if (evidence.terrainClass === "UNKNOWN" && evidence.reliefStrength < 0.26) {
    return false;
  }

  if (direction === "NORTH") {
    return evidence.northScore >= thresholds.north;
  }

  if (direction === "SOUTH") {
    return evidence.southScore >= thresholds.south;
  }

  if (direction === "EAST") {
    return evidence.eastScore >= thresholds.east;
  }

  if (direction === "WEST") {
    return evidence.westScore >= thresholds.west;
  }

  return false;
}

function resolveNorthTerrainClass(evidence) {
  if (evidence.terrainClass === "UNKNOWN") return "UNKNOWN";
  return evidence.terrainClass;
}

function resolveSouthTerrainClass(evidence) {
  if (evidence.terrainClass === "UNKNOWN") return "UNKNOWN";
  return evidence.terrainClass;
}

function resolveEastTerrainClass(evidence) {
  if (evidence.terrainClass === "UNKNOWN") return "UNKNOWN";
  return evidence.terrainClass;
}

function resolveWestTerrainClass(evidence) {
  if (evidence.terrainClass === "UNKNOWN") return "UNKNOWN";
  return evidence.terrainClass;
}

function buildNorthPacket(signalCell, evidence, projectionState) {
  if (!isDirectionAdmissible("NORTH", evidence)) return null;

  const p = signalCell.points;
  const center = averagePoint(p);

  const north = p[0];
  const east = p[1];
  const west = p[3];

  const packetPoints = normalizePrimitivePoints([
    north,
    pointBetween(north, east, 0.42),
    insetToward(east, center, 0.34),
    insetToward(west, center, 0.34),
    pointBetween(west, north, 0.42),
  ]);

  return {
    direction: "NORTH",
    score: evidence.northScore,
    terrainClassResolved: resolveNorthTerrainClass(evidence),
    terrainBandClass: "UPLIFT",
    terrainOverlayClass: evidence.biomeType,
    terrainEdgeClass: "RIDGE_EDGE",
    terrainNarrativeClass: "SOURCE_RISE",
    terrainReliefStrength: evidence.reliefStrength,
    terrainPrimitiveType: "TERRAIN_NORTH_SIGNAL",
    terrainPrimitivePoints: packetPoints,
    subdivisionTier: projectionState.lensTier,
    approxSpanPx: measurePolygonSpan(packetPoints),
  };
}

function buildSouthPacket(signalCell, evidence, projectionState) {
  if (!isDirectionAdmissible("SOUTH", evidence)) return null;

  const p = signalCell.points;
  const center = averagePoint(p);

  const east = p[1];
  const south = p[2];
  const west = p[3];

  const packetPoints = normalizePrimitivePoints([
    insetToward(east, center, 0.30),
    pointBetween(east, south, 0.48),
    south,
    pointBetween(south, west, 0.48),
    insetToward(west, center, 0.30),
  ]);

  return {
    direction: "SOUTH",
    score: evidence.southScore,
    terrainClassResolved: resolveSouthTerrainClass(evidence),
    terrainBandClass: "DESCENT",
    terrainOverlayClass: evidence.biomeType,
    terrainEdgeClass: "BASIN_EDGE",
    terrainNarrativeClass: "SINK_DROP",
    terrainReliefStrength: evidence.reliefStrength,
    terrainPrimitiveType: "TERRAIN_SOUTH_SIGNAL",
    terrainPrimitivePoints: packetPoints,
    subdivisionTier: projectionState.lensTier,
    approxSpanPx: measurePolygonSpan(packetPoints),
  };
}

function buildEastPacket(signalCell, evidence, projectionState) {
  if (!isDirectionAdmissible("EAST", evidence)) return null;

  const p = signalCell.points;
  const center = averagePoint(p);

  const north = p[0];
  const east = p[1];
  const south = p[2];

  const packetPoints = normalizePrimitivePoints([
    insetToward(north, center, 0.34),
    pointBetween(north, east, 0.56),
    east,
    pointBetween(east, south, 0.56),
    insetToward(south, center, 0.34),
  ]);

  return {
    direction: "EAST",
    score: evidence.eastScore,
    terrainClassResolved: resolveEastTerrainClass(evidence),
    terrainBandClass: "TRAVERSAL",
    terrainOverlayClass: evidence.biomeType,
    terrainEdgeClass: "FLOW_EDGE",
    terrainNarrativeClass: "PROPAGATION",
    terrainReliefStrength: evidence.reliefStrength,
    terrainPrimitiveType: "TERRAIN_EAST_SIGNAL",
    terrainPrimitivePoints: packetPoints,
    subdivisionTier: projectionState.lensTier,
    approxSpanPx: measurePolygonSpan(packetPoints),
  };
}

function buildWestPacket(signalCell, evidence, projectionState) {
  if (!isDirectionAdmissible("WEST", evidence)) return null;

  const p = signalCell.points;
  const center = averagePoint(p);

  const north = p[0];
  const south = p[2];
  const west = p[3];

  const packetPoints = normalizePrimitivePoints([
    pointBetween(west, north, 0.50),
    insetToward(north, center, 0.32),
    insetToward(south, center, 0.32),
    pointBetween(south, west, 0.50),
    west,
  ]);

  return {
    direction: "WEST",
    score: evidence.westScore,
    terrainClassResolved: resolveWestTerrainClass(evidence),
    terrainBandClass: "RETENTION",
    terrainOverlayClass: evidence.biomeType,
    terrainEdgeClass: "PLATEAU_EDGE",
    terrainNarrativeClass: "STRUCTURAL_HOLD",
    terrainReliefStrength: evidence.reliefStrength,
    terrainPrimitiveType: "TERRAIN_WEST_SIGNAL",
    terrainPrimitivePoints: packetPoints,
    subdivisionTier: projectionState.lensTier,
    approxSpanPx: measurePolygonSpan(packetPoints),
  };
}

function chooseTerrainPacket(candidates, evidence) {
  let winner = null;

  for (const candidate of candidates) {
    if (!candidate || !Array.isArray(candidate.terrainPrimitivePoints) || candidate.terrainPrimitivePoints.length < 3) {
      continue;
    }

    if (!winner) {
      winner = candidate;
      continue;
    }

    if (candidate.score > winner.score) {
      winner = candidate;
      continue;
    }

    if (candidate.score === winner.score) {
      const precedence = ["NORTH", "SOUTH", "EAST", "WEST"];
      if (precedence.indexOf(candidate.direction) < precedence.indexOf(winner.direction)) {
        winner = candidate;
      }
    }
  }

  if (!winner) {
    const nonTerrainPacket = buildNonTerrainPacket();
    return {
      ...nonTerrainPacket,
      terrainDirectionScores: {
        north: evidence.northScore,
        south: evidence.southScore,
        east: evidence.eastScore,
        west: evidence.westScore,
      },
    };
  }

  return {
    terrainClassResolved: winner.terrainClassResolved,
    terrainBandClass: winner.terrainBandClass,
    terrainOverlayClass: winner.terrainOverlayClass,
    terrainEdgeClass: winner.terrainEdgeClass,
    terrainNarrativeClass: winner.terrainNarrativeClass,
    terrainReliefStrength: winner.terrainReliefStrength,
    terrainPrimitiveType: winner.terrainPrimitiveType,
    terrainPrimitivePoints: winner.terrainPrimitivePoints,
    subdivisionTier: winner.subdivisionTier,
    approxSpanPx: winner.approxSpanPx,
    dominantDirection: winner.direction,
    arbitrationRule: "NORTH_SOUTH_EAST_WEST_INTERNAL_SELECTION",
    failureCondition: "FAIL_IF_TERRAIN_WRITES_TRUTH_OR_TIME",
    terrainFamilyClass: "TERRAIN_FAMILY_BRIDGE",
    terrainDirectionScores: {
      north: evidence.northScore,
      south: evidence.southScore,
      east: evidence.eastScore,
      west: evidence.westScore,
    },
  };
}

export function resolveTerrainPacket({
  sample,
  signalCell,
  topology = null,
  x = 0,
  y = 0,
  grid = null,
  projectionState = {},
  globalPrimitiveTime = null,
}) {
  void x;
  void y;
  void grid;
  void globalPrimitiveTime;

  if (!sample || !signalCell || !Array.isArray(signalCell.points) || signalCell.points.length < 4) {
    return buildNonTerrainPacket();
  }

  if (sample.landMask !== 1) {
    return buildNonTerrainPacket();
  }

  const safeTopology = normalizeObject(topology);
  const safeProjectionState = normalizeObject(projectionState);
  const evidence = computeDirectionalEvidence(sample, safeTopology);

  const northPacket = buildNorthPacket(signalCell, evidence, safeProjectionState);
  const southPacket = buildSouthPacket(signalCell, evidence, safeProjectionState);
  const eastPacket = buildEastPacket(signalCell, evidence, safeProjectionState);
  const westPacket = buildWestPacket(signalCell, evidence, safeProjectionState);

  return chooseTerrainPacket(
    [northPacket, southPacket, eastPacket, westPacket],
    evidence
  );
}
