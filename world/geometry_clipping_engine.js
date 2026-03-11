function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) {
      freezeObjectTree(sub);
    }
  }
  return value;
}

function roundPoint(value) {
  return Math.round(value * 1000) / 1000;
}

function clonePoint(point, label = "point") {
  if (!Array.isArray(point) || point.length !== 2) {
    throw new Error(`Invalid ${label}`);
  }

  const [x, y] = point;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error(`Non-numeric ${label}`);
  }

  return [roundPoint(x), roundPoint(y)];
}

function clonePolygon(points, label = "polygon") {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error(`Invalid ${label}`);
  }

  return points.map((point, index) => clonePoint(point, `${label}[${index}]`));
}

function polygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    area += (x1 * y2) - (x2 * y1);
  }
  return area * 0.5;
}

function isValidPolygon(points) {
  return Array.isArray(points) && points.length >= 3 && Math.abs(polygonArea(points)) > 0.5;
}

function ensureCounterClockwise(points) {
  const polygon = clonePolygon(points, "ensureCounterClockwise");
  return polygonArea(polygon) < 0 ? polygon.reverse() : polygon;
}

function distance(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function pointKey(point) {
  return `${roundPoint(point[0])},${roundPoint(point[1])}`;
}

function pointsEqual(a, b, epsilon = 1e-6) {
  return Math.abs(a[0] - b[0]) <= epsilon && Math.abs(a[1] - b[1]) <= epsilon;
}

function dedupeSequentialPoints(points) {
  const out = [];
  for (const point of points) {
    const normalized = [roundPoint(point[0]), roundPoint(point[1])];
    if (out.length === 0 || !pointsEqual(out[out.length - 1], normalized)) {
      out.push(normalized);
    }
  }

  if (out.length >= 2 && pointsEqual(out[0], out[out.length - 1])) {
    out.pop();
  }

  return out;
}

function removeCollinearPoints(points, epsilon = 1e-6) {
  if (!Array.isArray(points) || points.length < 3) return points ?? [];

  const cleaned = [];
  for (let i = 0; i < points.length; i += 1) {
    const prev = points[(i - 1 + points.length) % points.length];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    const v1x = curr[0] - prev[0];
    const v1y = curr[1] - prev[1];
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const cross = (v1x * v2y) - (v1y * v2x);

    if (Math.abs(cross) > epsilon || points.length <= 3) {
      cleaned.push(curr);
    }
  }

  return cleaned.length >= 3 ? cleaned : points;
}

function normalizePolygon(points) {
  if (!Array.isArray(points) || points.length < 3) return null;

  let polygon = clonePolygon(points, "normalizePolygon");
  polygon = dedupeSequentialPoints(polygon);
  if (polygon.length < 3) return null;

  polygon = removeCollinearPoints(polygon);
  if (polygon.length < 3) return null;

  polygon = ensureCounterClockwise(polygon);
  if (!isValidPolygon(polygon)) return null;

  return polygon.map((point) => [roundPoint(point[0]), roundPoint(point[1])]);
}

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const onSegment =
      Math.abs(((x - xi) * (yj - yi)) - ((y - yi) * (xj - xi))) <= 1e-6 &&
      x >= Math.min(xi, xj) - 1e-6 &&
      x <= Math.max(xi, xj) + 1e-6 &&
      y >= Math.min(yi, yj) - 1e-6 &&
      y <= Math.max(yi, yj) + 1e-6;

    if (onSegment) return true;

    const intersects =
      ((yi > y) !== (yj > y)) &&
      (x < (((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON)) + xi);

    if (intersects) inside = !inside;
  }

  return inside;
}

function segmentIntersection(a1, a2, b1, b2) {
  const x1 = a1[0];
  const y1 = a1[1];
  const x2 = a2[0];
  const y2 = a2[1];
  const x3 = b1[0];
  const y3 = b1[1];
  const x4 = b2[0];
  const y4 = b2[1];

  const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
  if (Math.abs(denominator) < 1e-9) return null;

  const pre = (x1 * y2) - (y1 * x2);
  const post = (x3 * y4) - (y3 * x4);

  const x = ((pre * (x3 - x4)) - ((x1 - x2) * post)) / denominator;
  const y = ((pre * (y3 - y4)) - ((y1 - y2) * post)) / denominator;

  const withinA =
    x >= Math.min(x1, x2) - 1e-6 &&
    x <= Math.max(x1, x2) + 1e-6 &&
    y >= Math.min(y1, y2) - 1e-6 &&
    y <= Math.max(y1, y2) + 1e-6;

  const withinB =
    x >= Math.min(x3, x4) - 1e-6 &&
    x <= Math.max(x3, x4) + 1e-6 &&
    y >= Math.min(y3, y4) - 1e-6 &&
    y <= Math.max(y3, y4) + 1e-6;

  if (!withinA || !withinB) return null;
  return [roundPoint(x), roundPoint(y)];
}

function collectIntersections(polyA, polyB) {
  const intersections = [];

  for (let i = 0; i < polyA.length; i += 1) {
    const a1 = polyA[i];
    const a2 = polyA[(i + 1) % polyA.length];

    for (let j = 0; j < polyB.length; j += 1) {
      const b1 = polyB[j];
      const b2 = polyB[(j + 1) % polyB.length];
      const hit = segmentIntersection(a1, a2, b1, b2);
      if (hit) intersections.push(hit);
    }
  }

  return intersections;
}

function inwardNormal(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy);

  if (len < 1e-9) {
    return [0, 0];
  }

  return [-(dy / len), dx / len];
}

function lineIntersection(p1, p2, p3, p4) {
  const x1 = p1[0];
  const y1 = p1[1];
  const x2 = p2[0];
  const y2 = p2[1];
  const x3 = p3[0];
  const y3 = p3[1];
  const x4 = p4[0];
  const y4 = p4[1];

  const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
  if (Math.abs(denominator) < 1e-9) return null;

  const pre = (x1 * y2) - (y1 * x2);
  const post = (x3 * y4) - (y3 * x4);

  const x = ((pre * (x3 - x4)) - ((x1 - x2) * post)) / denominator;
  const y = ((pre * (y3 - y4)) - ((y1 - y2) * post)) / denominator;

  return [roundPoint(x), roundPoint(y)];
}

function insetPolygon(points, insetDistance) {
  const polygon = normalizePolygon(points);
  if (!polygon) return null;
  if (insetDistance <= 0) return polygon;

  const inset = [];

  for (let i = 0; i < polygon.length; i += 1) {
    const prev = polygon[(i - 1 + polygon.length) % polygon.length];
    const curr = polygon[i];
    const next = polygon[(i + 1) % polygon.length];

    const n1 = inwardNormal(prev, curr);
    const n2 = inwardNormal(curr, next);

    const p1a = [prev[0] + (n1[0] * insetDistance), prev[1] + (n1[1] * insetDistance)];
    const p1b = [curr[0] + (n1[0] * insetDistance), curr[1] + (n1[1] * insetDistance)];
    const p2a = [curr[0] + (n2[0] * insetDistance), curr[1] + (n2[1] * insetDistance)];
    const p2b = [next[0] + (n2[0] * insetDistance), next[1] + (n2[1] * insetDistance)];

    let intersection = lineIntersection(p1a, p1b, p2a, p2b);

    if (!intersection) {
      const avgNx = (n1[0] + n2[0]) * 0.5;
      const avgNy = (n1[1] + n2[1]) * 0.5;
      const len = Math.hypot(avgNx, avgNy) || 1;
      intersection = [
        roundPoint(curr[0] + ((avgNx / len) * insetDistance)),
        roundPoint(curr[1] + ((avgNy / len) * insetDistance))
      ];
    }

    inset.push(intersection);
  }

  return normalizePolygon(inset);
}

function findClosestVertexPair(outer, inner) {
  let best = { outerIndex: 0, innerIndex: 0, distance: Infinity };

  for (let i = 0; i < outer.length; i += 1) {
    for (let j = 0; j < inner.length; j += 1) {
      const d = distance(outer[i][0], outer[i][1], inner[j][0], inner[j][1]);
      if (d < best.distance) {
        best = { outerIndex: i, innerIndex: j, distance: d };
      }
    }
  }

  return best;
}

function rotatePolygon(points, startIndex) {
  return [...points.slice(startIndex), ...points.slice(0, startIndex)];
}

function buildRingPolygon(outerPolygon, innerPolygon) {
  if (!outerPolygon && !innerPolygon) return null;
  if (outerPolygon && !innerPolygon) return normalizePolygon(outerPolygon);

  const outer = normalizePolygon(outerPolygon);
  const inner = normalizePolygon(innerPolygon);

  if (!outer) return null;
  if (!inner) return outer;

  const pair = findClosestVertexPair(outer, inner);
  const outerRotated = rotatePolygon(outer, pair.outerIndex);
  const innerRotated = rotatePolygon(inner, pair.innerIndex).reverse();

  const ring = [
    ...outerRotated,
    outerRotated[0],
    innerRotated[0],
    ...innerRotated,
    innerRotated[0],
    outerRotated[0]
  ];

  const cleaned = dedupeSequentialPoints(ring);
  if (!isValidPolygon(cleaned)) {
    return outer;
  }

  return ensureCounterClockwise(cleaned);
}

function getPolygonBySourceName(name, coastlineModel, regionBoundariesById, watersById) {
  if (name === "coastlineOuter") return coastlineModel.coastlineOuter ?? null;
  if (name === "harborPeninsula") return coastlineModel.harborPeninsula ?? null;
  if (name === "harborBasin") return coastlineModel.harborBasin ?? null;
  if (name === "harborChannel") return coastlineModel.harborChannel ?? null;

  const regionBoundary = regionBoundariesById.get(name);
  if (regionBoundary?.polygon) return regionBoundary.polygon;

  const water = watersById.get(name);
  if (water?.polygon) return water.polygon;

  return null;
}

function resolveGeometrySource({
  geometrySource,
  coastlineModel,
  regionBoundariesById,
  watersById = new Map()
}) {
  if (typeof geometrySource !== "string" || geometrySource.length === 0) {
    throw new Error("geometrySource must be a non-empty string");
  }

  if (!coastlineModel || typeof coastlineModel !== "object") {
    throw new Error("Missing coastlineModel");
  }

  if (!(regionBoundariesById instanceof Map)) {
    throw new Error("regionBoundariesById must be a Map");
  }

  if (!(watersById instanceof Map)) {
    throw new Error("watersById must be a Map");
  }

  const segmentMap = coastlineModel.coastalSegmentMap ?? {};
  const [sourceName, selector = ""] = geometrySource.split(":");

  if (selector && typeof segmentMap[selector] === "string") {
    const mappedName = segmentMap[selector];
    const mappedPolygon = getPolygonBySourceName(mappedName, coastlineModel, regionBoundariesById, watersById);
    if (mappedPolygon) return normalizePolygon(mappedPolygon);
  }

  const directPolygon = getPolygonBySourceName(sourceName, coastlineModel, regionBoundariesById, watersById);
  if (directPolygon) return normalizePolygon(directPolygon);

  if (typeof segmentMap[geometrySource] === "string") {
    const mappedName = segmentMap[geometrySource];
    const mappedPolygon = getPolygonBySourceName(mappedName, coastlineModel, regionBoundariesById, watersById);
    if (mappedPolygon) return normalizePolygon(mappedPolygon);
  }

  throw new Error(`Unresolvable geometrySource: ${geometrySource}`);
}

function createInsetBandPolygon({
  sourcePolygon,
  outerInset = 0,
  innerInset = 0
}) {
  const normalizedSource = normalizePolygon(sourcePolygon);
  if (!normalizedSource) return null;

  const outerPolygon = outerInset > 0
    ? insetPolygon(normalizedSource, outerInset)
    : normalizedSource;

  if (!outerPolygon) return null;

  const innerPolygon = innerInset > 0
    ? insetPolygon(normalizedSource, innerInset)
    : null;

  return normalizePolygon(buildRingPolygon(outerPolygon, innerPolygon));
}

function isInsideHalfPlane(point, edgeStart, edgeEnd) {
  const cross =
    ((edgeEnd[0] - edgeStart[0]) * (point[1] - edgeStart[1])) -
    ((edgeEnd[1] - edgeStart[1]) * (point[0] - edgeStart[0]));
  return cross >= -1e-6;
}

function clipAgainstEdge(subjectPolygon, edgeStart, edgeEnd) {
  const output = [];
  if (!subjectPolygon.length) return output;

  for (let i = 0; i < subjectPolygon.length; i += 1) {
    const current = subjectPolygon[i];
    const previous = subjectPolygon[(i - 1 + subjectPolygon.length) % subjectPolygon.length];
    const currentInside = isInsideHalfPlane(current, edgeStart, edgeEnd);
    const previousInside = isInsideHalfPlane(previous, edgeStart, edgeEnd);

    if (currentInside) {
      if (!previousInside) {
        const hit = segmentIntersection(previous, current, edgeStart, edgeEnd);
        if (hit) output.push(hit);
      }
      output.push(current);
    } else if (previousInside) {
      const hit = segmentIntersection(previous, current, edgeStart, edgeEnd);
      if (hit) output.push(hit);
    }
  }

  return output;
}

function clipPolygonToPolygon(subjectPolygon, clipPolygon) {
  let subject = normalizePolygon(subjectPolygon);
  const clip = normalizePolygon(clipPolygon);

  if (!subject || !clip) return null;

  for (let i = 0; i < clip.length; i += 1) {
    const edgeStart = clip[i];
    const edgeEnd = clip[(i + 1) % clip.length];
    subject = clipAgainstEdge(subject, edgeStart, edgeEnd);
    subject = normalizePolygon(subject);
    if (!subject) return null;
  }

  return subject;
}

function collectDifferencePolygon(subjectPolygon, maskPolygon) {
  const subject = normalizePolygon(subjectPolygon);
  const mask = normalizePolygon(maskPolygon);

  if (!subject) return null;
  if (!mask) return subject;

  const intersections = collectIntersections(subject, mask);
  const hasOutsideVertex = subject.some((point) => !pointInPolygon(point, mask));

  if (intersections.length === 0 && hasOutsideVertex) {
    return subject;
  }

  if (intersections.length === 0 && !hasOutsideVertex) {
    return null;
  }

  const result = [];

  for (let i = 0; i < subject.length; i += 1) {
    const current = subject[i];
    const next = subject[(i + 1) % subject.length];
    const currentOutside = !pointInPolygon(current, mask);
    const nextOutside = !pointInPolygon(next, mask);

    if (currentOutside) {
      result.push(current);
    }

    const hit = segmentIntersection(current, next, mask[0], mask[1]);
    if (hit) {
      result.push(hit);
    }

    if (currentOutside !== nextOutside) {
      for (let j = 0; j < mask.length; j += 1) {
        const m1 = mask[j];
        const m2 = mask[(j + 1) % mask.length];
        const edgeHit = segmentIntersection(current, next, m1, m2);
        if (edgeHit) {
          result.push(edgeHit);
        }
      }
    }
  }

  return normalizePolygon(result);
}

function subtractMasks(subjectPolygon, masks = []) {
  let current = normalizePolygon(subjectPolygon);
  if (!current) return null;

  for (const mask of masks) {
    const normalizedMask = normalizePolygon(mask);
    if (!normalizedMask) continue;

    const intersections = collectIntersections(current, normalizedMask);
    const anyPointInsideMask = current.some((point) => pointInPolygon(point, normalizedMask));

    if (intersections.length === 0 && !anyPointInsideMask) {
      continue;
    }

    const next = collectDifferencePolygon(current, normalizedMask);
    if (!next) return null;
    current = normalizePolygon(next);
    if (!current) return null;
  }

  return current;
}

export const geometryClippingEngine = Object.freeze({
  resolveGeometrySource,
  createInsetBandPolygon,
  clipPolygonToPolygon,
  subtractMasks,
  normalizePolygon
});

export {
  resolveGeometrySource,
  createInsetBandPolygon,
  clipPolygonToPolygon,
  subtractMasks,
  normalizePolygon
};
