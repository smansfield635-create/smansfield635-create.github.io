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

function indexBy(rows, key) {
  const map = new Map();

  for (const row of rows) {
    const id = row?.[key];
    if (typeof id !== "string" || id.length === 0) {
      throw new Error(`Invalid ${key} in indexed rows`);
    }
    if (map.has(id)) {
      throw new Error(`Duplicate ${key}: ${id}`);
    }
    map.set(id, Object.freeze({ ...row }));
  }

  return map;
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

function assertPolygon(points, label) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error(`Invalid polygon for ${label}`);
  }

  for (const point of points) {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new Error(`Invalid point in ${label}`);
    }
    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      throw new Error(`Non-numeric point in ${label}`);
    }
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

function assertCoastalBlueprint(coastalBlueprint) {
  assertPlainObject(coastalBlueprint, "coastalBlueprint");
  assertMap(coastalBlueprint.coastalDomainsById, "coastalBlueprint.coastalDomainsById");
  assertPlainObject(coastalBlueprint.materialStacks, "coastalBlueprint.materialStacks");
  assertPlainObject(coastalBlueprint.coastalClasses, "coastalBlueprint.coastalClasses");
}

function familyOrderValue(family) {
  if (family === "substrate") return 0;
  if (family === "terrain") return 1;
  return 2;
}

function lexicalCompare(a, b) {
  return String(a).localeCompare(String(b));
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

function getStackScaleConfig(domain) {
  const coastType = String(domain?.coastType ?? "");
  const exposureClass = String(domain?.exposureClass ?? "");

  let startInset = 6;
  let insetStep = 8;

  if (coastType.includes("exposed")) {
    startInset = 8;
    insetStep = 10;
  } else if (coastType.includes("sheltered")) {
    startInset = 5;
    insetStep = 7;
  } else if (coastType.includes("rock")) {
    startInset = 7;
    insetStep = 9;
  } else if (coastType.includes("basin")) {
    startInset = 4;
    insetStep = 6;
  } else if (coastType.includes("channel")) {
    startInset = 5;
    insetStep = 7;
  }

  if (exposureClass.includes("moderate")) insetStep += 1;
  if (exposureClass.includes("exposed")) insetStep += 2;
  if (exposureClass.includes("sheltered")) insetStep -= 1;

  return Object.freeze({
    startInset: Math.max(2, startInset),
    insetStep: Math.max(2, insetStep)
  });
}

function buildBandGeometry({
  engine,
  sourcePolygon,
  regionPolygon,
  masks,
  domain,
  stackIndex,
  stackLength
}) {
  const { startInset, insetStep } = getStackScaleConfig(domain);
  const outerInset = startInset + (stackIndex * insetStep);
  const innerInset = stackIndex === stackLength - 1
    ? outerInset + insetStep + 1000
    : startInset + ((stackIndex + 1) * insetStep);

  const candidatePolygon = engine.createInsetBandPolygon({
    sourcePolygon,
    outerInset,
    innerInset
  });

  if (!candidatePolygon) return null;

  let clipped = engine.clipPolygonToPolygon(candidatePolygon, regionPolygon);
  if (!clipped) return null;

  clipped = engine.subtractMasks(clipped, masks);
  if (!clipped) return null;

  clipped = engine.normalizePolygon(clipped);
  if (!clipped) return null;

  assertPolygon(clipped, `generatedBand.${domain.domainId}.${stackIndex}`);
  return clipped;
}

function createBandReceipt({
  generatedBandId,
  domain,
  stackId,
  coastalClassId,
  coastalClass,
  polygon
}) {
  return Object.freeze({
    generatedBandId,
    domainId: domain.domainId,
    stackId,
    coastalClassId,
    targetClass: coastalClass.targetClass,
    family: coastalClass.family,
    regionId: domain.regionId,
    plantable: coastalClass.plantable,
    geometrySource: domain.geometrySource,
    status: coastalClass.status,
    polygon
  });
}

function createBandRow({
  generatedBandId,
  domain,
  stackId,
  coastalClassId,
  coastalClass,
  polygon
}) {
  return Object.freeze({
    generatedBandId,
    domainId: domain.domainId,
    stackId,
    coastalClassId,
    targetClass: coastalClass.targetClass,
    family: coastalClass.family,
    regionId: domain.regionId,
    plantable: coastalClass.plantable,
    geometrySource: domain.geometrySource,
    status: coastalClass.status,
    polygon
  });
}

function sortGeneratedRows(rows, domainOrderIndexMap) {
  return [...rows].sort((a, b) => {
    const domainCmp =
      (domainOrderIndexMap.get(a.domainId) ?? Infinity) -
      (domainOrderIndexMap.get(b.domainId) ?? Infinity);
    if (domainCmp !== 0) return domainCmp;

    const stackCmp = lexicalCompare(a.stackId, b.stackId);
    if (stackCmp !== 0) return stackCmp;

    const familyCmp = familyOrderValue(a.family) - familyOrderValue(b.family);
    if (familyCmp !== 0) return familyCmp;

    const targetCmp = lexicalCompare(a.targetClass, b.targetClass);
    if (targetCmp !== 0) return targetCmp;

    return lexicalCompare(a.generatedBandId, b.generatedBandId);
  });
}

function generateCoastalBands(input) {
  const {
    coastlineModel,
    coastalBlueprint,
    regionBoundariesById,
    watersById = new Map(),
    geometryClippingEngine
  } = input ?? {};

  assertPlainObject(coastlineModel, "coastlineModel");
  assertCoastalBlueprint(coastalBlueprint);
  assertMap(regionBoundariesById, "regionBoundariesById");
  assertMap(watersById, "watersById");
  assertGeometryClippingEngine(geometryClippingEngine);

  const generatedTerrainBands = [];
  const generatedSubstrateBands = [];
  const receipts = [];

  const domainOrderIndexMap = getDomainOrderIndexMap(coastalBlueprint.coastalDomainsById);

  for (const domain of coastalBlueprint.coastalDomainsById.values()) {
    const regionBoundary = regionBoundariesById.get(domain.regionId);
    if (!regionBoundary?.polygon) {
      throw new Error(`Missing owning region polygon for coastal domain: ${domain.domainId}`);
    }

    const regionPolygon = geometryClippingEngine.normalizePolygon(regionBoundary.polygon);
    if (!regionPolygon) {
      throw new Error(`Unable to normalize region polygon for coastal domain: ${domain.domainId}`);
    }

    const sourcePolygon = geometryClippingEngine.resolveGeometrySource({
      geometrySource: domain.geometrySource,
      coastlineModel,
      regionBoundariesById,
      watersById
    });

    if (!sourcePolygon) {
      throw new Error(`Unresolvable geometrySource for coastal domain: ${domain.domainId}`);
    }

    assertPolygon(sourcePolygon, `coastalDomain.${domain.domainId}.sourcePolygon`);

    const stack = coastalBlueprint.materialStacks[domain.stackId];
    if (!Array.isArray(stack) || stack.length === 0) {
      throw new Error(`Invalid or missing stack for coastal domain: ${domain.domainId}`);
    }

    const masks = [];

    for (let stackIndex = 0; stackIndex < stack.length; stackIndex += 1) {
      const coastalClassId = stack[stackIndex];
      const coastalClass = coastalBlueprint.coastalClasses[coastalClassId];

      if (!coastalClass) {
        throw new Error(`Missing coastal class ${coastalClassId} for domain ${domain.domainId}`);
      }

      const polygon = buildBandGeometry({
        engine: geometryClippingEngine,
        sourcePolygon,
        regionPolygon,
        masks,
        domain,
        stackIndex,
        stackLength: stack.length
      });

      const generatedBandId = `${domain.domainId}__${domain.stackId}__${stackIndex}`;

      if (!polygon) {
        receipts.push(
          createBandReceipt({
            generatedBandId,
            domain,
            stackId: domain.stackId,
            coastalClassId,
            coastalClass,
            polygon: null
          })
        );
        continue;
      }

      const receipt = createBandReceipt({
        generatedBandId,
        domain,
        stackId: domain.stackId,
        coastalClassId,
        coastalClass,
        polygon
      });

      receipts.push(receipt);
      masks.push(polygon);

      if (coastalClass.status === "NEW_CLASS_PENDING_BINDING") {
        continue;
      }

      const row = createBandRow({
        generatedBandId,
        domain,
        stackId: domain.stackId,
        coastalClassId,
        coastalClass,
        polygon
      });

      if (coastalClass.family === "terrain") {
        generatedTerrainBands.push(row);
      } else if (coastalClass.family === "substrate") {
        generatedSubstrateBands.push(row);
      } else {
        throw new Error(`Invalid family for coastal class ${coastalClassId}`);
      }
    }
  }

  const sortedTerrainBands = sortGeneratedRows(generatedTerrainBands, domainOrderIndexMap);
  const sortedSubstrateBands = sortGeneratedRows(generatedSubstrateBands, domainOrderIndexMap);
  const sortedReceipts = sortGeneratedRows(receipts, domainOrderIndexMap);

  return freezeObjectTree({
    generatedTerrainBands: sortedTerrainBands,
    generatedSubstrateBands: sortedSubstrateBands,
    receipts: sortedReceipts,
    generatedTerrainBandsById: indexBy(sortedTerrainBands, "generatedBandId"),
    generatedSubstrateBandsById: indexBy(sortedSubstrateBands, "generatedBandId"),
    receiptsById: indexBy(sortedReceipts, "generatedBandId")
  });
}

function generateTerrainBands(input) {
  return generateCoastalBands(input).generatedTerrainBands;
}

function generateSubstrateBands(input) {
  return generateCoastalBands(input).generatedSubstrateBands;
}

export const coastalGenerator = Object.freeze({
  generateCoastalBands,
  generateTerrainBands,
  generateSubstrateBands
});
