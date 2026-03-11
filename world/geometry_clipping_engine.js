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

function dedupePoints(points) {
  const out = [];
  const seen = new Set();

  for (const point of points) {
    const normalized = [roundPoint(point[0]), roundPoint(point[1])];
    const key = pointKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }

  return out;
}

function sortPointsRadially(points) {
  const unique = dedupePoints(points);
  if (unique.length < 3) return null;

  const [cx, cy] = centroid(unique);
  unique.sort((a, b) => {
    const aa = Math.atan2(a[1] - cy, a[0] - cx);
    const ab = Math.atan2(b[1] - cy, b[0] - cx);
    if (aa !== ab) return aa - ab;
    const da = distance(cx, cy, a[0], a[1]);
    const db = distance(cx, cy, b[0], b[1]);
    return da - db;
  });

  return unique;
}

function isValidPolygon(points) {
  return Array.isArray(points) && points.length >= 3 && Math.abs(polygonArea(points)) > 0.5;
}

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

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

function collectIntersectionPolygon(subjectPolygon, clipPolygon) {
  const candidates = [];

  for (const point of subjectPolygon) {
    if (pointInPolygon(point, clipPolygon)) candidates.push(point);
  }

  for (const point of clipPolygon) {
    if (pointInPolygon(point, subjectPolygon)) candidates.push(point);
  }

  candidates.push(...collectIntersections(subjectPolygon, clipPolygon));

  const sorted = sortPointsRadially(candidates);
  if (!sorted || !isValidPolygon(sorted)) return null;
  return ensureCounterClockwise(sorted);
}

function collectDifferencePolygon(subjectPolygon, maskPolygon) {
  const candidates = [];

  for (const point of subjectPolygon) {
    if (!pointInPolygon(point, maskPolygon)) candidates.push(point);
  }

  candidates.push(...collectIntersections(subjectPolygon, maskPolygon));

  const sorted = sortPointsRadially(candidates);
  if (!sorted || !isValidPolygon(sorted)) return null;
  return ensureCounterClockwise(sorted);
}

function insetPolygon(points, insetDistance) {
  const polygon = ensureCounterClockwise(points);
  const [cx, cy] = centroid(polygon);
  const inset = [];

  for (const [x, y] of polygon) {
    const dx = cx - x;
    const dy = cy - y;
    const len = Math.hypot(dx, dy);

    if (len <= insetDistance + 1) {
      return null;
    }

    const nx = x + ((dx / len) * insetDistance);
    const ny = y + ((dy / len) * insetDistance);
    inset.push([roundPoint(nx), roundPoint(ny)]);
  }

  if (!isValidPolygon(inset)) return null;
  return ensureCounterClockwise(inset);
}

function buildRingPolygon(outerPolygon, innerPolygon) {
  if (!outerPolygon && !innerPolygon) return null;
  if (outerPolygon && !innerPolygon) return ensureCounterClockwise(outerPolygon);

  const outer = ensureCounterClockwise(outerPolygon);
  const inner = ensureCounterClockwise(innerPolygon).reverse();

  const ring = [
    ...outer,
    ...inner
  ];

  if (!isValidPolygon(ring)) {
    return ensureCounterClockwise(outer);
  }

  return ensureCounterClockwise(ring);
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

function clipPolygonToPolygon(subjectPolygon, clipPolygon) {
  const subject = normalizePolygon(subjectPolygon);
  const clip = normalizePolygon(clipPolygon);

  if (!subject || !clip) return null;
  return normalizePolygon(collectIntersectionPolygon(subject, clip));
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

function normalizePolygon(points) {
  if (!Array.isArray(points) || points.length < 3) return null;

  const cleaned = dedupePoints(points.map((point) => clonePoint(point, "normalizePolygon.point")));
  if (cleaned.length < 3) return null;

  const sorted = sortPointsRadially(cleaned);
  if (!sorted || !isValidPolygon(sorted)) return null;

  return ensureCounterClockwise(sorted);
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
