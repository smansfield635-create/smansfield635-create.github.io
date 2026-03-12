function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) {
      freezeObjectTree(sub);
    }
  }
  return value;
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

function getStackScaleConfig(domain, stackIndex) {
  const coastType = String(domain?.coastType ?? "").toLowerCase();
  const exposureClass = String(domain?.exposureClass ?? "").toLowerCase();
  const sedimentType = String(domain?.sedimentType ?? "").toLowerCase();

  let startInset = 8;
  let insetStep = 11;

  if (coastType.includes("sheltered")) {
    startInset = 6;
    insetStep = 9;
  }

  if (coastType.includes("basin")) {
    startInset = 4;
    insetStep = 7;
  }

  if (coastType.includes("channel")) {
    startInset = 5;
    insetStep = 8;
  }

  if (coastType.includes("rock")) {
    startInset = 7;
    insetStep = 10;
  }

  if (exposureClass.includes("moderate")) {
    insetStep += 1;
  }

  if (exposureClass.includes("exposed")) {
    insetStep += 2;
  }

  if (exposureClass.includes("light") || exposureClass.includes("sheltered")) {
    insetStep -= 1;
  }

  if (sedimentType.includes("sand")) {
    insetStep += 1;
  }

  if (sedimentType.includes("rock") || sedimentType.includes("bedrock")) {
    startInset += 1;
  }

  const shorelineBias = stackIndex === 0 ? 0 : Math.min(stackIndex, 2);

  return Object.freeze({
    startInset: Math.max(2, startInset + shorelineBias),
    insetStep: Math.max(2, insetStep)
  });
}

function normalizeBandGeometry(engine, polygon, label) {
  const normalized = engine.normalizePolygon(polygon);
  if (!normalized) return null;
  assertPolygon(normalized, label);
  return normalized;
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
  const { startInset, insetStep } = getStackScaleConfig(domain, stackIndex);

  const outerInset = startInset + (stackIndex * insetStep);
  const innerInset = stackIndex === stackLength - 1
    ? outerInset + insetStep + 2000
    : startInset + ((stackIndex + 1) * insetStep);

  const candidatePolygon = engine.createInsetBandPolygon({
    sourcePolygon,
    outerInset,
    innerInset
  });

  if (!candidatePolygon) return null;

  const clippedToRegion = engine.clipPolygonToPolygon(candidatePolygon, regionPolygon);
  if (!clippedToRegion) return null;

  const withMasksRemoved = engine.subtractMasks(clippedToRegion, masks);
  if (!withMasksRemoved) return null;

  return normalizeBandGeometry(
    engine,
    withMasksRemoved,
    `generatedBand.${domain.domainId}.${stackIndex}`
  );
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

function sortGeneratedRows(rows, domainOrderIndexMap, coastalBlueprint) {
  return [...rows].sort((a, b) => {
    const domainCmp =
      (domainOrderIndexMap.get(a.domainId) ?? Infinity) -
      (domainOrderIndexMap.get(b.domainId) ?? Infinity);
    if (domainCmp !== 0) return domainCmp;

    const stackA = coastalBlueprint.materialStacks[a.stackId] ?? [];
    const stackB = coastalBlueprint.materialStacks[b.stackId] ?? [];

    const stackIndexA = stackA.indexOf(a.coastalClassId);
    const stackIndexB = stackB.indexOf(b.coastalClassId);
    if (stackIndexA !== stackIndexB) return stackIndexA - stackIndexB;

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

    const regionPolygon = normalizeBandGeometry(
      geometryClippingEngine,
      regionBoundary.polygon,
      `regionBoundary.${domain.regionId}`
    );
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
        continue;
      }

      if (coastalClass.family === "substrate") {
        generatedSubstrateBands.push(row);
        continue;
      }

      throw new Error(`Invalid family for coastal class ${coastalClassId}`);
    }
  }

  const sortedTerrainBands = sortGeneratedRows(
    generatedTerrainBands,
    domainOrderIndexMap,
    coastalBlueprint
  );
  const sortedSubstrateBands = sortGeneratedRows(
    generatedSubstrateBands,
    domainOrderIndexMap,
    coastalBlueprint
  );
  const sortedReceipts = sortGeneratedRows(
    receipts,
    domainOrderIndexMap,
    coastalBlueprint
  );

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

freezeObjectTree(coastalGenerator);
