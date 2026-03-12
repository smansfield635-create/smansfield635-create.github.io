import { coastalGenerator } from "./coastal_generator.js";
import { geometryClippingEngine } from "./geometry_clipping_engine.js";

function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) {
      freezeObjectTree(sub);
    }
  }
  return value;
}

function clonePoint(point) {
  if (!Array.isArray(point) || point.length !== 2) {
    throw new Error("Invalid point");
  }

  const [x, y] = point;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error("Non-numeric point");
  }

  return [x, y];
}

function clonePolygon(points, label) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error(`Invalid polygon for ${label}`);
  }

  return points.map((point) => clonePoint(point));
}

function mapValuesToArray(mapLike, label) {
  if (!mapLike || typeof mapLike.values !== "function") {
    throw new Error(`Expected map-like object for ${label}`);
  }
  return [...mapLike.values()];
}

function indexDomainOrder(coastalBlueprint) {
  const order = new Map();
  const domains = mapValuesToArray(
    coastalBlueprint.coastalDomainsById,
    "coastalBlueprint.coastalDomainsById"
  );

  for (let i = 0; i < domains.length; i += 1) {
    order.set(domains[i].domainId, i);
  }

  return order;
}

function indexStackOrder(coastalBlueprint) {
  const order = new Map();

  for (const [stackId, stackRows] of Object.entries(coastalBlueprint.materialStacks)) {
    const classOrder = new Map();
    for (let i = 0; i < stackRows.length; i += 1) {
      classOrder.set(stackRows[i], i);
    }
    order.set(stackId, classOrder);
  }

  return order;
}

function getCoastalRegionIds(coastalBlueprint) {
  const regionIds = new Set();

  for (const domain of mapValuesToArray(
    coastalBlueprint.coastalDomainsById,
    "coastalBlueprint.coastalDomainsById"
  )) {
    regionIds.add(domain.regionId);
  }

  return regionIds;
}

function buildBandSortKeyIndexes(coastalBlueprint) {
  return Object.freeze({
    domainOrder: indexDomainOrder(coastalBlueprint),
    stackOrder: indexStackOrder(coastalBlueprint)
  });
}

function bandComparator(indexes) {
  return (a, b) => {
    const domainA = indexes.domainOrder.get(a.domainId) ?? Number.MAX_SAFE_INTEGER;
    const domainB = indexes.domainOrder.get(b.domainId) ?? Number.MAX_SAFE_INTEGER;
    if (domainA !== domainB) return domainA - domainB;

    const stackRowsA = indexes.stackOrder.get(a.stackId);
    const stackRowsB = indexes.stackOrder.get(b.stackId);

    const stackA = stackRowsA?.get(a.coastalClassId) ?? Number.MAX_SAFE_INTEGER;
    const stackB = stackRowsB?.get(b.coastalClassId) ?? Number.MAX_SAFE_INTEGER;
    if (stackA !== stackB) return stackA - stackB;

    const classA = String(a.targetClass ?? "");
    const classB = String(b.targetClass ?? "");
    if (classA !== classB) return classA.localeCompare(classB);

    const idA = String(a.generatedBandId ?? "");
    const idB = String(b.generatedBandId ?? "");
    return idA.localeCompare(idB);
  };
}

function normalizeGeneratedBand(row, family, label) {
  if (!row || typeof row !== "object") {
    throw new Error(`Invalid generated ${family} band: ${label}`);
  }

  if (row.family !== family) {
    throw new Error(`Family mismatch for generated ${family} band: ${label}`);
  }

  if (typeof row.generatedBandId !== "string" || row.generatedBandId.length === 0) {
    throw new Error(`Missing generatedBandId for ${label}`);
  }

  if (typeof row.domainId !== "string" || row.domainId.length === 0) {
    throw new Error(`Missing domainId for ${label}`);
  }

  if (typeof row.stackId !== "string" || row.stackId.length === 0) {
    throw new Error(`Missing stackId for ${label}`);
  }

  if (typeof row.coastalClassId !== "string" || row.coastalClassId.length === 0) {
    throw new Error(`Missing coastalClassId for ${label}`);
  }

  if (typeof row.targetClass !== "string" || row.targetClass.length === 0) {
    throw new Error(`Missing targetClass for ${label}`);
  }

  if (typeof row.regionId !== "string" || row.regionId.length === 0) {
    throw new Error(`Missing regionId for ${label}`);
  }

  if (typeof row.plantable !== "boolean") {
    throw new Error(`Invalid plantable flag for ${label}`);
  }

  const status =
    typeof row.status === "string" && row.status.length > 0
      ? row.status
      : "BOUND";

  const geometrySource =
    typeof row.geometrySource === "string" && row.geometrySource.length > 0
      ? row.geometrySource
      : "";

  return Object.freeze({
    generatedBandId: row.generatedBandId,
    domainId: row.domainId,
    stackId: row.stackId,
    coastalClassId: row.coastalClassId,
    targetClass: row.targetClass,
    family: row.family,
    regionId: row.regionId,
    plantable: row.plantable,
    status,
    geometrySource,
    polygon: clonePolygon(row.polygon, label)
  });
}

function normalizeGeneratedBands(rows, family) {
  if (!Array.isArray(rows)) {
    throw new Error(`Expected array for generated ${family} bands`);
  }

  const normalized = [];
  const ids = new Set();

  for (let i = 0; i < rows.length; i += 1) {
    const row = normalizeGeneratedBand(rows[i], family, `${family}[${i}]`);
    if (ids.has(row.generatedBandId)) {
      throw new Error(`Duplicate generatedBandId: ${row.generatedBandId}`);
    }
    ids.add(row.generatedBandId);
    normalized.push(row);
  }

  return normalized;
}

function filterActiveBoundBands(rows) {
  return rows.filter((row) => row.status === "BOUND");
}

function preserveNonCoastalManualTerrainRows(kernel, coastalRegionIds) {
  const preserved = [];

  for (const row of kernel.terrainPolygonsById.values()) {
    if (!coastalRegionIds.has(row.regionId)) {
      preserved.push(
        Object.freeze({
          terrainId: row.terrainId,
          terrainClass: row.terrainClass,
          regionId: row.regionId,
          polygon: clonePolygon(row.polygon, `terrain.${row.terrainId}`)
        })
      );
    }
  }

  return preserved;
}

function preserveNonCoastalManualSubstrateRows(kernel, coastalRegionIds) {
  const preserved = [];

  for (const row of kernel.substratePolygonsById.values()) {
    if (!coastalRegionIds.has(row.regionId)) {
      preserved.push(
        Object.freeze({
          substrateId: row.substrateId,
          substrateClass: row.substrateClass,
          regionId: row.regionId,
          polygon: clonePolygon(row.polygon, `substrate.${row.substrateId}`)
        })
      );
    }
  }

  return preserved;
}

function convertGeneratedTerrainBandsToDatasetRows(rows) {
  return rows.map((row) =>
    Object.freeze({
      terrainId: row.generatedBandId,
      terrainClass: row.targetClass,
      regionId: row.regionId,
      polygon: clonePolygon(row.polygon, `generatedTerrain.${row.generatedBandId}`)
    })
  );
}

function convertGeneratedSubstrateBandsToDatasetRows(rows) {
  return rows.map((row) =>
    Object.freeze({
      substrateId: row.generatedBandId,
      substrateClass: row.targetClass,
      regionId: row.regionId,
      polygon: clonePolygon(row.polygon, `generatedSubstrate.${row.generatedBandId}`)
    })
  );
}

function buildPendingReceipts(rows) {
  return rows
    .filter((row) => row.status === "NEW_CLASS_PENDING_BINDING")
    .map((row) =>
      Object.freeze({
        generatedBandId: row.generatedBandId,
        domainId: row.domainId,
        stackId: row.stackId,
        coastalClassId: row.coastalClassId,
        targetClass: row.targetClass,
        family: row.family,
        regionId: row.regionId,
        plantable: row.plantable,
        status: row.status,
        geometrySource: row.geometrySource
      })
    );
}

function buildTerrainDataset(kernel, preservedRows, generatedRows) {
  const sourceVersion = Number.isFinite(kernel?.terrainDatasetMeta?.version)
    ? kernel.terrainDatasetMeta.version
    : Number.isFinite(kernel?.terrainPolygonsMeta?.version)
      ? kernel.terrainPolygonsMeta.version
      : Number.isFinite(kernel?.terrainPolygonsVersion)
        ? kernel.terrainPolygonsVersion
        : 1;

  return freezeObjectTree({
    schemaVersion: "HARBOR_TERRAIN_POLYGONS_DATASET_v1",
    worldId: kernel.worldMeta.worldId,
    encodingFamilyVersion: kernel.worldMeta.encodingFamilyVersion,
    version: sourceVersion + 1,
    terrain: [...preservedRows, ...generatedRows]
  });
}

function buildSubstrateDataset(kernel, preservedRows, generatedRows) {
  const sourceVersion = Number.isFinite(kernel?.substrateDatasetMeta?.version)
    ? kernel.substrateDatasetMeta.version
    : Number.isFinite(kernel?.substratePolygonsMeta?.version)
      ? kernel.substratePolygonsMeta.version
      : Number.isFinite(kernel?.substratePolygonsVersion)
        ? kernel.substratePolygonsVersion
        : 1;

  return freezeObjectTree({
    schemaVersion: "HARBOR_SUBSTRATE_POLYGONS_DATASET_v1",
    worldId: kernel.worldMeta.worldId,
    encodingFamilyVersion: kernel.worldMeta.encodingFamilyVersion,
    version: sourceVersion + 1,
    substrates: [...preservedRows, ...generatedRows]
  });
}

function assertKernelInput(kernel) {
  if (!kernel || typeof kernel !== "object") {
    throw new Error("Missing kernel input");
  }

  if (!kernel.worldMeta || kernel.worldMeta.worldId !== "nine_summits_island") {
    throw new Error("Invalid kernel.worldMeta");
  }

  if (!kernel.coastlineModel || typeof kernel.coastlineModel !== "object") {
    throw new Error("Missing kernel.coastlineModel");
  }

  if (!kernel.coastalBlueprint || typeof kernel.coastalBlueprint !== "object") {
    throw new Error("Missing kernel.coastalBlueprint");
  }

  if (!kernel.regionBoundariesById || typeof kernel.regionBoundariesById.values !== "function") {
    throw new Error("Missing kernel.regionBoundariesById");
  }

  if (!kernel.watersById || typeof kernel.watersById.values !== "function") {
    throw new Error("Missing kernel.watersById");
  }

  if (!kernel.terrainPolygonsById || typeof kernel.terrainPolygonsById.values !== "function") {
    throw new Error("Missing kernel.terrainPolygonsById");
  }

  if (!kernel.substratePolygonsById || typeof kernel.substratePolygonsById.values !== "function") {
    throw new Error("Missing kernel.substratePolygonsById");
  }

  if (!geometryClippingEngine || typeof geometryClippingEngine !== "object") {
    throw new Error("Missing geometryClippingEngine");
  }
}

function generateCoastalBands(input) {
  const { kernel } = input ?? {};
  assertKernelInput(kernel);

  const result = coastalGenerator.generateCoastalBands({
    coastlineModel: kernel.coastlineModel,
    coastalBlueprint: kernel.coastalBlueprint,
    regionBoundariesById: kernel.regionBoundariesById,
    watersById: kernel.watersById,
    geometryClippingEngine
  });

  const generatedTerrainBands = normalizeGeneratedBands(
    result.generatedTerrainBands ?? [],
    "terrain"
  );
  const generatedSubstrateBands = normalizeGeneratedBands(
    result.generatedSubstrateBands ?? [],
    "substrate"
  );

  return freezeObjectTree({
    generatedTerrainBands,
    generatedSubstrateBands,
    receipts: Array.isArray(result.receipts) ? result.receipts : []
  });
}

function rebuildTerrainDataset(input) {
  const { kernel } = input ?? {};
  assertKernelInput(kernel);

  const coastalBands = generateCoastalBands({ kernel });
  const coastalRegionIds = getCoastalRegionIds(kernel.coastalBlueprint);
  const indexes = buildBandSortKeyIndexes(kernel.coastalBlueprint);

  const activeGeneratedTerrainBands = filterActiveBoundBands(
    coastalBands.generatedTerrainBands
  ).sort(bandComparator(indexes));

  const preservedManualTerrainRows = preserveNonCoastalManualTerrainRows(
    kernel,
    coastalRegionIds
  );
  const generatedTerrainRows = convertGeneratedTerrainBandsToDatasetRows(
    activeGeneratedTerrainBands
  );

  return buildTerrainDataset(kernel, preservedManualTerrainRows, generatedTerrainRows);
}

function rebuildSubstrateDataset(input) {
  const { kernel } = input ?? {};
  assertKernelInput(kernel);

  const coastalBands = generateCoastalBands({ kernel });
  const coastalRegionIds = getCoastalRegionIds(kernel.coastalBlueprint);
  const indexes = buildBandSortKeyIndexes(kernel.coastalBlueprint);

  const activeGeneratedSubstrateBands = filterActiveBoundBands(
    coastalBands.generatedSubstrateBands
  ).sort(bandComparator(indexes));

  const preservedManualSubstrateRows = preserveNonCoastalManualSubstrateRows(
    kernel,
    coastalRegionIds
  );
  const generatedSubstrateRows = convertGeneratedSubstrateBandsToDatasetRows(
    activeGeneratedSubstrateBands
  );

  return buildSubstrateDataset(
    kernel,
    preservedManualSubstrateRows,
    generatedSubstrateRows
  );
}

function rebuildTerrainAndSubstrateDatasets(input) {
  const { kernel } = input ?? {};
  assertKernelInput(kernel);

  const coastalBands = generateCoastalBands({ kernel });
  const coastalRegionIds = getCoastalRegionIds(kernel.coastalBlueprint);
  const indexes = buildBandSortKeyIndexes(kernel.coastalBlueprint);

  const activeGeneratedTerrainBands = filterActiveBoundBands(
    coastalBands.generatedTerrainBands
  ).sort(bandComparator(indexes));

  const activeGeneratedSubstrateBands = filterActiveBoundBands(
    coastalBands.generatedSubstrateBands
  ).sort(bandComparator(indexes));

  const preservedManualTerrainRows = preserveNonCoastalManualTerrainRows(
    kernel,
    coastalRegionIds
  );
  const preservedManualSubstrateRows = preserveNonCoastalManualSubstrateRows(
    kernel,
    coastalRegionIds
  );

  const generatedTerrainRows = convertGeneratedTerrainBandsToDatasetRows(
    activeGeneratedTerrainBands
  );
  const generatedSubstrateRows = convertGeneratedSubstrateBandsToDatasetRows(
    activeGeneratedSubstrateBands
  );

  const terrainDataset = buildTerrainDataset(
    kernel,
    preservedManualTerrainRows,
    generatedTerrainRows
  );
  const substrateDataset = buildSubstrateDataset(
    kernel,
    preservedManualSubstrateRows,
    generatedSubstrateRows
  );

  const pendingTerrainReceipts = buildPendingReceipts(coastalBands.generatedTerrainBands);
  const pendingSubstrateReceipts = buildPendingReceipts(
    coastalBands.generatedSubstrateBands
  );

  return freezeObjectTree({
    terrainDataset,
    substrateDataset,
    receipts: {
      coastalDomainCount: kernel.coastalBlueprint.coastalDomainsById.size,
      activeTerrainBandCount: activeGeneratedTerrainBands.length,
      activeSubstrateBandCount: activeGeneratedSubstrateBands.length,
      pendingTerrainReceipts,
      pendingSubstrateReceipts,
      preservedManualTerrainRowCount: preservedManualTerrainRows.length,
      preservedManualSubstrateRowCount: preservedManualSubstrateRows.length,
      generationReceipts: coastalBands.receipts
    }
  });
}

export const terrainSubstrateRebuildTool = Object.freeze({
  generateCoastalBands,
  rebuildTerrainDataset,
  rebuildSubstrateDataset,
  rebuildTerrainAndSubstrateDatasets
});
