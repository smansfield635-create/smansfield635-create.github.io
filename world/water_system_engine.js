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

function normalizePolygon(points, label = "polygon") {
  const polygon = ensureCounterClockwise(points);
  if (polygon.length < 3 || Math.abs(polygonArea(polygon)) <= 0.5) {
    throw new Error(`Degenerate ${label}`);
  }
  return polygon.map(([x, y]) => [roundPoint(x), roundPoint(y)]);
}

function assertMap(value, label) {
  if (!(value instanceof Map)) {
    throw new Error(`${label} must be a Map`);
  }
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertGeometryClippingEngine(engine) {
  assertPlainObject(engine, "geometryClippingEngine");

  const required = [
    "resolveGeometrySource",
    "createInsetBandPolygon",
    "clipPolygonToPolygon",
    "subtractMasks",
    "normalizePolygon"
  ];

  for (const fnName of required) {
    if (typeof engine[fnName] !== "function") {
      throw new Error(`geometryClippingEngine missing required method: ${fnName}`);
    }
  }
}

function getDomainOrderIndexMap(coastalDomainsById) {
  const map = new Map();
  let index = 0;

  for (const domain of coastalDomainsById.values()) {
    map.set(domain.domainId, index);
    index += 1;
  }

  return map;
}

function familyOrderValue(family) {
  if (family === "water") return 0;
  if (family === "mask") return 1;
  if (family === "channel") return 2;
  return 3;
}

function lexicalCompare(a, b) {
  return String(a).localeCompare(String(b));
}

function sortRows(rows, domainOrderIndexMap) {
  return [...rows].sort((a, b) => {
    const domainCmp =
      (domainOrderIndexMap.get(a.domainId) ?? Number.MAX_SAFE_INTEGER) -
      (domainOrderIndexMap.get(b.domainId) ?? Number.MAX_SAFE_INTEGER);
    if (domainCmp !== 0) return domainCmp;

    const familyCmp = familyOrderValue(a.family) - familyOrderValue(b.family);
    if (familyCmp !== 0) return familyCmp;

    const classCmp = lexicalCompare(a.waterClass, b.waterClass);
    if (classCmp !== 0) return classCmp;

    return lexicalCompare(a.generatedWaterBandId, b.generatedWaterBandId);
  });
}

function getWaterScaleConfig(domain) {
  const coastType = String(domain?.coastType ?? "").toLowerCase();
  const exposureClass = String(domain?.exposureClass ?? "").toLowerCase();

  let startInset = 0;
  let bandStep = 10;

  if (coastType.includes("basin")) {
    startInset = 0;
    bandStep = 8;
  } else if (coastType.includes("channel")) {
    startInset = 0;
    bandStep = 9;
  } else if (coastType.includes("sheltered")) {
    startInset = 0;
    bandStep = 10;
  } else if (coastType.includes("exposed")) {
    startInset = 0;
    bandStep = 12;
  }

  if (exposureClass.includes("moderate")) bandStep += 1;
  if (exposureClass.includes("light")) bandStep -= 1;

  return Object.freeze({
    startInset: Math.max(0, startInset),
    bandStep: Math.max(4, bandStep)
  });
}

function getWaterBandPlan(domain) {
  const coastType = String(domain?.coastType ?? "").toLowerCase();

  if (coastType.includes("channel")) {
    return Object.freeze([
      Object.freeze({ waterClass: "channel_edge_shallow", outerOffset: 0, innerOffset: 10, family: "water" }),
      Object.freeze({ waterClass: "channel_mid", outerOffset: 10, innerOffset: 22, family: "channel" }),
      Object.freeze({ waterClass: "channel_core", outerOffset: 22, innerOffset: 44, family: "channel" })
    ]);
  }

  if (coastType.includes("basin")) {
    return Object.freeze([
      Object.freeze({ waterClass: "basin_shallow_margin", outerOffset: 0, innerOffset: 8, family: "water" }),
      Object.freeze({ waterClass: "basin_mid", outerOffset: 8, innerOffset: 20, family: "water" }),
      Object.freeze({ waterClass: "basin_deep_core", outerOffset: 20, innerOffset: 42, family: "water" })
    ]);
  }

  return Object.freeze([
    Object.freeze({ waterClass: "shoreline_shallow", outerOffset: 0, innerOffset: 10, family: "water" }),
    Object.freeze({ waterClass: "harbor_midwater", outerOffset: 10, innerOffset: 24, family: "water" }),
    Object.freeze({ waterClass: "harbor_deepwater", outerOffset: 24, innerOffset: 52, family: "water" })
  ]);
}

function buildBandGeometry({
  geometryClippingEngine,
  sourcePolygon,
  regionPolygon,
  masks,
  domain,
  planRow
}) {
  const scale = getWaterScaleConfig(domain);

  const outerInset = scale.startInset + planRow.outerOffset;
  const innerInset = scale.startInset + planRow.innerOffset;

  const candidatePolygon = geometryClippingEngine.createInsetBandPolygon({
    sourcePolygon,
    outerInset,
    innerInset
  });

  if (!candidatePolygon) return null;

  let clipped = geometryClippingEngine.clipPolygonToPolygon(candidatePolygon, regionPolygon);
  if (!clipped) return null;

  clipped = geometryClippingEngine.subtractMasks(clipped, masks);
  if (!clipped) return null;

  clipped = geometryClippingEngine.normalizePolygon(clipped);
  if (!clipped) return null;

  return normalizePolygon(clipped, `waterBand.${domain.domainId}.${planRow.waterClass}`);
}

function buildMaskPolygon({ geometryClippingEngine, sourcePolygon, regionPolygon }) {
  let clipped = geometryClippingEngine.clipPolygonToPolygon(sourcePolygon, regionPolygon);
  if (!clipped) return null;

  clipped = geometryClippingEngine.normalizePolygon(clipped);
  if (!clipped) return null;

  return normalizePolygon(clipped, "waterMask");
}

function createGeneratedWaterBand({
  generatedWaterBandId,
  domain,
  waterClass,
  family,
  polygon
}) {
  return Object.freeze({
    generatedWaterBandId,
    domainId: domain.domainId,
    regionId: domain.regionId,
    geometrySource: domain.geometrySource,
    waterClass,
    family,
    polygon
  });
}

function createReceipt({
  generatedWaterBandId,
  domain,
  waterClass,
  family,
  polygon,
  status
}) {
  return Object.freeze({
    generatedWaterBandId,
    domainId: domain.domainId,
    regionId: domain.regionId,
    geometrySource: domain.geometrySource,
    waterClass,
    family,
    status,
    polygon
  });
}

function generateWaterBands(input) {
  const {
    coastlineModel,
    coastalBlueprint,
    regionBoundariesById,
    watersById = new Map(),
    geometryClippingEngine
  } = input ?? {};

  assertPlainObject(coastlineModel, "coastlineModel");
  assertPlainObject(coastalBlueprint, "coastalBlueprint");
  assertMap(coastalBlueprint.coastalDomainsById, "coastalBlueprint.coastalDomainsById");
  assertMap(regionBoundariesById, "regionBoundariesById");
  assertMap(watersById, "watersById");
  assertGeometryClippingEngine(geometryClippingEngine);

  const generatedWaterBands = [];
  const receipts = [];
  const domainOrderIndexMap = getDomainOrderIndexMap(coastalBlueprint.coastalDomainsById);

  for (const domain of coastalBlueprint.coastalDomainsById.values()) {
    const regionBoundary = regionBoundariesById.get(domain.regionId);
    if (!regionBoundary?.polygon) {
      throw new Error(`Missing owning region polygon for water domain: ${domain.domainId}`);
    }

    const regionPolygon = geometryClippingEngine.normalizePolygon(regionBoundary.polygon);
    if (!regionPolygon) {
      throw new Error(`Unable to normalize region polygon for water domain: ${domain.domainId}`);
    }

    const sourcePolygon = geometryClippingEngine.resolveGeometrySource({
      geometrySource: domain.geometrySource,
      coastlineModel,
      regionBoundariesById,
      watersById
    });

    if (!sourcePolygon) {
      throw new Error(`Unresolvable geometrySource for water domain: ${domain.domainId}`);
    }

    const normalizedSource = geometryClippingEngine.normalizePolygon(sourcePolygon);
    if (!normalizedSource) {
      throw new Error(`Invalid source geometry for water domain: ${domain.domainId}`);
    }

    const waterMaskPolygon = buildMaskPolygon({
      geometryClippingEngine,
      sourcePolygon: normalizedSource,
      regionPolygon
    });

    if (waterMaskPolygon) {
      const maskId = `${domain.domainId}__water_mask`;
      receipts.push(
        createReceipt({
          generatedWaterBandId: maskId,
          domain,
          waterClass: "water_mask",
          family: "mask",
          status: "BOUND",
          polygon: waterMaskPolygon
        })
      );
    }

    const masks = [];
    const bandPlan = getWaterBandPlan(domain);

    for (let i = 0; i < bandPlan.length; i += 1) {
      const planRow = bandPlan[i];
      const polygon = buildBandGeometry({
        geometryClippingEngine,
        sourcePolygon: normalizedSource,
        regionPolygon,
        masks,
        domain,
        planRow
      });

      const generatedWaterBandId = `${domain.domainId}__water__${i}`;

      if (!polygon) {
        receipts.push(
          createReceipt({
            generatedWaterBandId,
            domain,
            waterClass: planRow.waterClass,
            family: planRow.family,
            status: "OMITTED_NO_GEOMETRY",
            polygon: null
          })
        );
        continue;
      }

      generatedWaterBands.push(
        createGeneratedWaterBand({
          generatedWaterBandId,
          domain,
          waterClass: planRow.waterClass,
          family: planRow.family,
          polygon
        })
      );

      receipts.push(
        createReceipt({
          generatedWaterBandId,
          domain,
          waterClass: planRow.waterClass,
          family: planRow.family,
          status: "BOUND",
          polygon
        })
      );

      masks.push(polygon);
    }
  }

  const sortedBands = sortRows(generatedWaterBands, domainOrderIndexMap);
  const sortedReceipts = sortRows(receipts, domainOrderIndexMap);

  return freezeObjectTree({
    generatedWaterBands: sortedBands,
    generatedWaterBandsById: indexBy(sortedBands, "generatedWaterBandId"),
    receipts: sortedReceipts,
    receiptsById: indexBy(sortedReceipts, "generatedWaterBandId")
  });
}

function generateWaterMaskBands(input) {
  return generateWaterBands(input).generatedWaterBands.filter((row) => row.family === "mask");
}

function generateChannelBands(input) {
  return generateWaterBands(input).generatedWaterBands.filter((row) => row.family === "channel");
}

export const waterSystemEngine = Object.freeze({
  generateWaterBands,
  generateWaterMaskBands,
  generateChannelBands
});

freezeObjectTree(waterSystemEngine);
