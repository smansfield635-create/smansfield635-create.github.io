// /world/render/boundary_primitive_engine.js
// MODE: DOWNSTREAM EXPRESSION ENGINE
// PURPOSE:
// 1. classify render-time boundary bands from existing truth signals
// 2. map boundary bands to primitive family + scale
// 3. output deterministic primitive instructions for render hub
//
// NOTE:
// - no upstream mutation
// - no canvas ownership
// - no runtime/gauge ownership
// - expression only

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

function hasRiverLakeSignal(sample) {
  return (
    sample?.riverCandidate === true ||
    sample?.lakeCandidate === true ||
    sample?.flowClass === "RIVER" ||
    sample?.flowClass === "STREAM" ||
    sample?.flowClass === "LAKE"
  );
}

function classifyBoundaryBand(sample, neighbors) {
  const waterNeighbors = countWaterNeighbors(neighbors);
  const landNeighbors = countLandNeighbors(neighbors);

  if (sample?.waterMask === 1) {
    if (landNeighbors > 0 && (sample?.distanceToLand === 0 || sample?.distanceToLand === 1)) {
      return "COAST_EDGE";
    }

    if (landNeighbors > 0 && sample?.distanceToLand === 2) {
      return "SHORELINE_OUTER";
    }

    if (hasRiverLakeSignal(sample)) {
      return "RIVER_LAKE_EDGE";
    }

    return "INTERIOR";
  }

  if (sample?.beachCandidate === true) {
    if (sample?.distanceToWater === 0 || sample?.distanceToWater === 1) {
      return "SAND_BAND";
    }
    return "BEACH_INNER";
  }

  if (sample?.shoreline === true || waterNeighbors > 0) {
    return "COAST_EDGE";
  }

  if (sample?.shorelineBand === true) {
    if (sample?.distanceToWater === 1) return "SHORELINE_OUTER";
    if (sample?.distanceToWater === 2) return "BEACH_INNER";
  }

  if (hasRiverLakeSignal(sample)) {
    return "RIVER_LAKE_EDGE";
  }

  return "INTERIOR";
}

function resolvePrimitiveTier(boundaryBandClass) {
  switch (boundaryBandClass) {
    case "RIVER_LAKE_EDGE":
      return {
        primitiveFamily: "TRIANGLE",
        primitiveType: "HALF_TRIANGLE",
        primitiveScale: 0.88,
        subdivisionTier: 2
      };

    case "COAST_EDGE":
      return {
        primitiveFamily: "TRIANGLE",
        primitiveType: "HALF_TRIANGLE",
        primitiveScale: 0.94,
        subdivisionTier: 2
      };

    case "SHORELINE_OUTER":
      return {
        primitiveFamily: "TRIANGLE",
        primitiveType: "QUARTER_TRIANGLE",
        primitiveScale: 0.62,
        subdivisionTier: 4
      };

    case "BEACH_INNER":
      return {
        primitiveFamily: "TRIANGLE",
        primitiveType: "EIGHTH_TRIANGLE",
        primitiveScale: 0.42,
        subdivisionTier: 8
      };

    case "SAND_BAND":
      return {
        primitiveFamily: "TRIANGLE",
        primitiveType: "EIGHTH_TRIANGLE",
        primitiveScale: 0.28,
        subdivisionTier: 8
      };

    default:
      return {
        primitiveFamily: "DIAMOND",
        primitiveType: "FULL_DIAMOND",
        primitiveScale: 1,
        subdivisionTier: 1
      };
  }
}

function resolveBoundaryOrientation(sample, neighbors) {
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

  const flow = typeof sample?.flowDirection === "string" ? sample.flowDirection : "NONE";

  if (flow === "N" || flow === "NE" || flow === "NW") return "N";
  if (flow === "E" || flow === "NE" || flow === "SE") return "E";
  if (flow === "S" || flow === "SE" || flow === "SW") return "S";
  if (flow === "W" || flow === "NW" || flow === "SW") return "W";

  return "N";
}

function scalePoints(points, center, scale) {
  return points.map((point) => ({
    ...point,
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale
  }));
}

function buildTriangleFromDiamond(points, orientation, center) {
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

function buildPrimitivePoints(signalCell, primitiveFamily, orientation, primitiveScale) {
  const center = averagePoint(signalCell.points);

  if (primitiveFamily === "DIAMOND") {
    return scalePoints(signalCell.points, center, primitiveScale);
  }

  const triangle = buildTriangleFromDiamond(signalCell.points, orientation, center);
  return scalePoints(triangle, center, primitiveScale);
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

export function resolveBoundaryPrimitive({
  sample,
  signalCell,
  x,
  y,
  grid
}) {
  const neighbors = getNeighbors4(grid, x, y);
  const boundaryBandClass = classifyBoundaryBand(sample, neighbors);
  const primitiveTier = resolvePrimitiveTier(boundaryBandClass);
  const orientation = resolveBoundaryOrientation(sample, neighbors);

  const primitivePoints = buildPrimitivePoints(
    signalCell,
    primitiveTier.primitiveFamily,
    orientation,
    primitiveTier.primitiveScale
  );

  return {
    boundaryBandClass,
    primitiveType: primitiveTier.primitiveType,
    primitiveScale: primitiveTier.primitiveScale,
    primitivePoints,
    subdivisionTier: primitiveTier.subdivisionTier,
    orientation,
    approxSpanPx: clamp(measurePrimitiveSpan(primitivePoints), 0, Number.MAX_SAFE_INTEGER)
  };
}
