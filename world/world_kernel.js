import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  graphs: new URL("./data/graphs.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  environment: new URL("./data/environment.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),
  latticeMap: new URL("./data/lattice_encoding_map.json", import.meta.url),
  coastlines: new URL("./data/coastlines.json", import.meta.url),
  regionBoundaries: new URL("./data/region_boundaries.json", import.meta.url),
  terrainPolygons: new URL("./data/terrain_polygons.json", import.meta.url),
  substratePolygons: new URL("./data/substrate_polygons.json", import.meta.url),
  terrainTemplates: new URL("./templates/terrain_templates.json", import.meta.url),
  substrateTemplates: new URL("./templates/substrate_templates.json", import.meta.url),
  regionTemplates: new URL("./templates/region_templates.json", import.meta.url)
};

function indexBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    if (map.has(row[key])) throw new Error(`Duplicate ${key}: ${row[key]}`);
    map.set(row[key], Object.freeze({ ...row }));
  }
  return map;
}

function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) freezeObjectTree(sub);
  }
  return value;
}

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json();
}

function assertRoot(root, expectedSchema) {
  if (!root || typeof root !== "object") throw new Error(`Missing root for ${expectedSchema}`);
  if (root.schemaVersion !== expectedSchema) throw new Error(`Schema mismatch for ${expectedSchema}`);
  if (root.worldId !== "nine_summits_island") throw new Error(`worldId mismatch in ${expectedSchema}`);
  return true;
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

function validateEncodingRows(encodingsById) {
  for (const row of encodingsById.values()) {
    if (!row.byte) throw new Error(`Encoding row ${row.encodingId} missing byte`);
    validateByte(row.byte);
  }
}

function assertReferenceExists(map, id, label) {
  if (!map.has(id)) throw new Error(`Missing ${label}: ${id}`);
}

function validateHarborPolygonDatasets(coastlines, regionBoundariesById, terrainPolygonsById, substratePolygonsById) {
  assertPolygon(coastlines.coastlineOuter, "coastlineOuter");
  assertPolygon(coastlines.harborPeninsula, "harborPeninsula");
  assertPolygon(coastlines.harborBasin, "harborBasin");
  assertPolygon(coastlines.harborChannel, "harborChannel");

  const requiredBoundaryIds = [
    "harbor_peninsula",
    "harbor_basin",
    "harbor_channel",
    "harbor_approach_reef_band",
    "harbor_inner_shore_west",
    "harbor_inner_shore_east"
  ];

  for (const regionId of requiredBoundaryIds) {
    const row = regionBoundariesById.get(regionId);
    if (!row) throw new Error(`Missing harbor region boundary: ${regionId}`);
    assertPolygon(row.polygon, `region_boundaries.${regionId}`);
  }

  for (const row of terrainPolygonsById.values()) {
    assertReferenceExists(regionBoundariesById, row.regionId, "terrain.regionId");
    assertPolygon(row.polygon, `terrain.${row.terrainId}`);
  }

  for (const row of substratePolygonsById.values()) {
    assertReferenceExists(regionBoundariesById, row.regionId, "substrate.regionId");
    assertPolygon(row.polygon, `substrate.${row.substrateId}`);
  }
}

function validateTemplateLibrary(root, expectedSchema, containerKey) {
  assertRoot(root, expectedSchema);
  if (!Array.isArray(root[containerKey])) {
    throw new Error(`Missing ${containerKey} in ${expectedSchema}`);
  }
}

function validateRegionTemplates(regionTemplatesById) {
  const requiredTemplateIds = [
    "harbor_template",
    "market_template",
    "basin_template",
    "ridge_template",
    "canyon_template",
    "summit_template"
  ];

  for (const templateId of requiredTemplateIds) {
    const row = regionTemplatesById.get(templateId);
    if (!row) throw new Error(`Missing region template: ${templateId}`);
    if (typeof row.templateClass !== "string" || row.templateClass.length === 0) {
      throw new Error(`Invalid templateClass for ${templateId}`);
    }
    if (typeof row.defaultTerrain !== "string" || row.defaultTerrain.length === 0) {
      throw new Error(`Invalid defaultTerrain for ${templateId}`);
    }
    if (typeof row.defaultSubstrate !== "string" || row.defaultSubstrate.length === 0) {
      throw new Error(`Invalid defaultSubstrate for ${templateId}`);
    }
  }
}

function validateTerrainTemplateLibrary(terrainTemplatesById) {
  for (const row of terrainTemplatesById.values()) {
    if (typeof row.templateId !== "string" || row.templateId.length === 0) {
      throw new Error("Invalid terrain templateId");
    }
    if (!Array.isArray(row.terrain) || row.terrain.length === 0) {
      throw new Error(`Missing terrain array for ${row.templateId}`);
    }
    for (const item of row.terrain) {
      if (typeof item.terrainClass !== "string" || item.terrainClass.length === 0) {
        throw new Error(`Invalid terrainClass in ${row.templateId}`);
      }
      if (typeof item.shape !== "string" || item.shape.length === 0) {
        throw new Error(`Invalid terrain shape in ${row.templateId}`);
      }
    }
  }
}

function validateSubstrateTemplateLibrary(substrateTemplatesById) {
  for (const row of substrateTemplatesById.values()) {
    if (typeof row.templateId !== "string" || row.templateId.length === 0) {
      throw new Error("Invalid substrate templateId");
    }
    if (!Array.isArray(row.substrates) || row.substrates.length === 0) {
      throw new Error(`Missing substrates array for ${row.templateId}`);
    }
    for (const item of row.substrates) {
      if (typeof item.substrateClass !== "string" || item.substrateClass.length === 0) {
        throw new Error(`Invalid substrateClass in ${row.templateId}`);
      }
      if (typeof item.shape !== "string" || item.shape.length === 0) {
        throw new Error(`Invalid substrate shape in ${row.templateId}`);
      }
    }
  }
}

function validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById) {
  for (const regionTemplate of regionTemplatesById.values()) {
    assertReferenceExists(terrainTemplatesById, regionTemplate.defaultTerrain, "regionTemplate.defaultTerrain");
    assertReferenceExists(substrateTemplatesById, regionTemplate.defaultSubstrate, "regionTemplate.defaultSubstrate");
  }
}

function validateRegionTemplateBindings(regionsById, regionTemplatesById) {
  for (const region of regionsById.values()) {
    if (!region.templateId) continue;
    assertReferenceExists(regionTemplatesById, region.templateId, "region.templateId");
  }
}

function validateCrossReferences(data) {
  const {
    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,
    graphRows
  } = data;

  for (const region of regionsById.values()) {
    assertReferenceExists(encodingsById, region.stateEncodingId, "stateEncodingId");
    for (const pathId of region.pathAnchors) assertReferenceExists(pathsById, pathId, "pathId");
    for (const hazardId of region.hazardAdjacency) assertReferenceExists(hazardsById, hazardId, "hazardId");
    for (const waterId of region.waterAdjacency) assertReferenceExists(watersById, waterId, "waterId");
    for (const predecessorId of region.requiredPredecessors) assertReferenceExists(regionsById, predecessorId, "requiredPredecessor");
  }

  for (const path of pathsById.values()) {
    assertReferenceExists(regionsById, path.fromRegionId, "fromRegionId");
    assertReferenceExists(regionsById, path.toRegionId, "toRegionId");
    assertReferenceExists(encodingsById, path.stateEncodingId, "path.stateEncodingId");
  }

  for (const hazard of hazardsById.values()) {
    assertReferenceExists(encodingsById, hazard.stateEncodingId, "hazard.stateEncodingId");
    for (const regionId of hazard.affectedRegionIds) assertReferenceExists(regionsById, regionId, "hazard.affectedRegionId");
    for (const pathId of hazard.pathIds) assertReferenceExists(pathsById, pathId, "hazard.pathId");
  }

  for (const water of watersById.values()) {
    assertReferenceExists(encodingsById, water.stateEncodingId, "water.stateEncodingId");
  }

  for (const cell of diamondCellsById.values()) {
    assertReferenceExists(regionsById, cell.regionId, "cell.regionId");
    if (cell.pathId) assertReferenceExists(pathsById, cell.pathId, "cell.pathId");
    assertReferenceExists(encodingsById, cell.stateEncodingId, "cell.stateEncodingId");
    for (const neighborId of cell.neighborIds) assertReferenceExists(diamondCellsById, neighborId, "cell.neighborId");
  }

  for (const graphType of Object.keys(graphRows)) {
    for (const edge of graphRows[graphType]) {
      if (regionsById.has(edge.fromId) === false && hazardsById.has(edge.fromId) === false && watersById.has(edge.fromId) === false) {
        throw new Error(`Graph fromId missing: ${edge.fromId}`);
      }
      if (regionsById.has(edge.toId) === false && hazardsById.has(edge.toId) === false && watersById.has(edge.toId) === false) {
        throw new Error(`Graph toId missing: ${edge.toId}`);
      }
    }
  }
}

function nearestCell(cells, x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const cell of cells.values()) {
    const dx = cell.centerPoint[0] - x;
    const dy = cell.centerPoint[1] - y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDistance) {
      bestDistance = d2;
      best = cell;
    }
  }
  return best;
}

function sectorFromVector(dx, dy) {
  const sectors = ["E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N", "NNE", "NE", "ENE"];
  const angle = Math.atan2(dy, dx);
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const idx = Math.round(normalized / (Math.PI * 2 / 16)) % 16;
  return sectors[idx];
}

function roundPoint(value) {
  return Math.round(value * 1000) / 1000;
}

function regularPolygon(cx, cy, radius, sides, rotation = -Math.PI / 2) {
  const points = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + ((Math.PI * 2 * i) / sides);
    points.push([
      roundPoint(cx + Math.cos(angle) * radius),
      roundPoint(cy + Math.sin(angle) * radius)
    ]);
  }
  return points;
}

function ellipsePolygon(cx, cy, radiusX, radiusY, segments = 16) {
  const points = [];
  for (let i = 0; i < segments; i += 1) {
    const angle = -Math.PI / 2 + ((Math.PI * 2 * i) / segments);
    points.push([
      roundPoint(cx + Math.cos(angle) * radiusX),
      roundPoint(cy + Math.sin(angle) * radiusY)
    ]);
  }
  return points;
}

function rectPolygon(cx, cy, width, height) {
  const hw = width * 0.5;
  const hh = height * 0.5;
  return [
    [roundPoint(cx - hw), roundPoint(cy - hh)],
    [roundPoint(cx + hw), roundPoint(cy - hh)],
    [roundPoint(cx + hw), roundPoint(cy + hh)],
    [roundPoint(cx - hw), roundPoint(cy + hh)]
  ];
}

function shapeToPolygon(shapeSpec, centerPoint) {
  const [cx, cy] = centerPoint;
  const shape = shapeSpec.shape;

  if (shape === "hex") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 48, 6);
  }

  if (shape === "diamond") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 36, 4, 0);
  }

  if (shape === "oval") {
    return ellipsePolygon(cx, cy, shapeSpec.radiusX ?? 48, shapeSpec.radiusY ?? 28, 18);
  }

  if (shape === "rect") {
    return rectPolygon(cx, cy, shapeSpec.width ?? 72, shapeSpec.height ?? 36);
  }

  if (shape === "ring") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 64, 8);
  }

  return regularPolygon(cx, cy, shapeSpec.radius ?? 40, 6);
}

function buildGeneratedTerrainPolygons(regionsById, regionTemplatesById, terrainTemplatesById) {
  const generated = [];

  for (const region of regionsById.values()) {
    if (!region.templateId) continue;

    const regionTemplate = regionTemplatesById.get(region.templateId);
    if (!regionTemplate) continue;

    const terrainTemplate = terrainTemplatesById.get(regionTemplate.defaultTerrain);
    if (!terrainTemplate) continue;

    for (let index = 0; index < terrainTemplate.terrain.length; index += 1) {
      const item = terrainTemplate.terrain[index];
      generated.push(Object.freeze({
        terrainId: `${region.regionId}__generated_terrain__${index}`,
        terrainClass: item.terrainClass,
        regionId: region.regionId,
        polygon: shapeToPolygon(item, region.centerPoint),
        generationSource: {
          regionId: region.regionId,
          templateId: region.templateId,
          terrainTemplateId: terrainTemplate.templateId,
          index
        }
      }));
    }
  }

  return indexBy(generated, "terrainId");
}

function buildGeneratedSubstratePolygons(regionsById, regionTemplatesById, substrateTemplatesById) {
  const generated = [];

  for (const region of regionsById.values()) {
    if (!region.templateId) continue;

    const regionTemplate = regionTemplatesById.get(region.templateId);
    if (!regionTemplate) continue;

    const substrateTemplate = substrateTemplatesById.get(regionTemplate.defaultSubstrate);
    if (!substrateTemplate) continue;

    for (let index = 0; index < substrateTemplate.substrates.length; index += 1) {
      const item = substrateTemplate.substrates[index];
      generated.push(Object.freeze({
        substrateId: `${region.regionId}__generated_substrate__${index}`,
        substrateClass: item.substrateClass,
        regionId: region.regionId,
        polygon: shapeToPolygon(item, region.centerPoint),
        generationSource: {
          regionId: region.regionId,
          templateId: region.templateId,
          substrateTemplateId: substrateTemplate.templateId,
          index
        }
      }));
    }
  }

  return indexBy(generated, "substrateId");
}

export async function loadWorldKernel() {
  const [
    regions,
    graphs,
    paths,
    hazards,
    waters,
    environment,
    diamondGrid,
    stateEncodings,
    latticeMap,
    coastlines,
    regionBoundaries,
    terrainPolygons,
    substratePolygons,
    terrainTemplates,
    substrateTemplates,
    regionTemplates
  ] = await Promise.all([
    readJson(DATA_FILES.regions),
    readJson(DATA_FILES.graphs),
    readJson(DATA_FILES.paths),
    readJson(DATA_FILES.hazards),
    readJson(DATA_FILES.waters),
    readJson(DATA_FILES.environment),
    readJson(DATA_FILES.diamondGrid),
    readJson(DATA_FILES.stateEncodings),
    readJson(DATA_FILES.latticeMap),
    readJson(DATA_FILES.coastlines),
    readJson(DATA_FILES.regionBoundaries),
    readJson(DATA_FILES.terrainPolygons),
    readJson(DATA_FILES.substratePolygons),
    readJson(DATA_FILES.terrainTemplates),
    readJson(DATA_FILES.substrateTemplates),
    readJson(DATA_FILES.regionTemplates)
  ]);

  assertRoot(regions, "WORLD_REGION_DATA_SCHEMA_v1");
  assertRoot(graphs, "WORLD_RELATIONSHIP_GRAPH_v1");
  assertRoot(paths, "WORLD_TRAVERSAL_RULES_v1");
  assertRoot(hazards, "WORLD_HAZARD_DATA_SCHEMA_v1");
  assertRoot(waters, "WORLD_WATER_DATA_SCHEMA_v1");
  assertRoot(environment, "WORLD_ENVIRONMENT_MODEL_v1");
  assertRoot(diamondGrid, "DIAMOND_RUNTIME_NAVIGATION_GRID_KERNEL_v1");
  assertRoot(stateEncodings, "STATE_ENCODINGS_v1");
  assertRoot(latticeMap, "LATTICE_ENCODING_MAP_v1");
  assertRoot(coastlines, "HARBOR_COASTLINE_DATASET_v1");
  assertRoot(regionBoundaries, "HARBOR_REGION_BOUNDARIES_DATASET_v1");
  assertRoot(terrainPolygons, "HARBOR_TERRAIN_POLYGONS_DATASET_v1");
  assertRoot(substratePolygons, "HARBOR_SUBSTRATE_POLYGONS_DATASET_v1");
  validateTemplateLibrary(terrainTemplates, "TERRAIN_TEMPLATE_LIBRARY_v1", "templates");
  validateTemplateLibrary(substrateTemplates, "SUBSTRATE_TEMPLATE_LIBRARY_v1", "templates");
  validateTemplateLibrary(regionTemplates, "REGION_TEMPLATE_LIBRARY_v1", "templates");

  const regionsById = indexBy(regions.regionRows, "regionId");
  const pathsById = indexBy(paths.pathRows, "pathId");
  const hazardsById = indexBy(hazards.hazardRows, "hazardId");
  const watersById = indexBy(waters.waterRows, "waterId");
  const encodingsById = indexBy(stateEncodings.encodingRows, "encodingId");
  const diamondCellsById = indexBy(diamondGrid.diamondCells, "diamondCellId");
  const regionBoundariesById = indexBy(regionBoundaries.regions, "regionId");
  const terrainPolygonsById = indexBy(terrainPolygons.terrain, "terrainId");
  const substratePolygonsById = indexBy(substratePolygons.substrates, "substrateId");
  const terrainTemplatesById = indexBy(terrainTemplates.templates, "templateId");
  const substrateTemplatesById = indexBy(substrateTemplates.templates, "templateId");
  const regionTemplatesById = indexBy(regionTemplates.templates, "templateId");

  validateEncodingRows(encodingsById);

  const graphRows = freezeObjectTree({
    spatialAdjacencyGraph: graphs.graphRows.spatialAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    traversalGraph: graphs.graphRows.traversalGraph.map((edge) => Object.freeze({ ...edge })),
    progressionGraph: graphs.graphRows.progressionGraph.map((edge) => Object.freeze({ ...edge })),
    hazardAdjacencyGraph: graphs.graphRows.hazardAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    waterAdjacencyGraph: graphs.graphRows.waterAdjacencyGraph.map((edge) => Object.freeze({ ...edge }))
  });

  validateHarborPolygonDatasets(
    coastlines,
    regionBoundariesById,
    terrainPolygonsById,
    substratePolygonsById
  );

  validateTerrainTemplateLibrary(terrainTemplatesById);
  validateSubstrateTemplateLibrary(substrateTemplatesById);
  validateRegionTemplates(regionTemplatesById);
  validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById);
  validateRegionTemplateBindings(regionsById, regionTemplatesById);

  const generatedTerrainPolygonsById = buildGeneratedTerrainPolygons(
    regionsById,
    regionTemplatesById,
    terrainTemplatesById
  );

  const generatedSubstratePolygonsById = buildGeneratedSubstratePolygons(
    regionsById,
    regionTemplatesById,
    substrateTemplatesById
  );

  const kernel = {
    worldMeta: Object.freeze({
      worldId: regions.worldId,
      encodingFamilyVersion: regions.encodingFamilyVersion
    }),
    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    latticeEncodingLaw: Object.freeze(latticeMap),
    environmentModel: freezeObjectTree(environment.environmentModel),
    diamondCellsById,
    graphRows,
    coastlineModel: freezeObjectTree({
      version: coastlines.version,
      coastlineOuter: coastlines.coastlineOuter,
      harborPeninsula: coastlines.harborPeninsula,
      harborBasin: coastlines.harborBasin,
      harborChannel: coastlines.harborChannel,
      coastalSegmentMap: coastlines.coastalSegmentMap ?? {},
      reefZones: coastlines.reefZones ?? [],
      exposureZones: coastlines.exposureZones ?? [],
      firmnessZones: coastlines.firmnessZones ?? []
    }),
    regionBoundariesById,
    terrainPolygonsById,
    substratePolygonsById,
    generatedTerrainPolygonsById,
    generatedSubstratePolygonsById,
    templateRegistry: freezeObjectTree({
      terrainTemplatesById,
      substrateTemplatesById,
      regionTemplatesById
    }),
    helpers: {
      getRegion(regionId) {
        return regionsById.get(regionId) ?? null;
      },
      getPath(pathId) {
        return pathsById.get(pathId) ?? null;
      },
      getHazard(hazardId) {
        return hazardsById.get(hazardId) ?? null;
      },
      getWater(waterId) {
        return watersById.get(waterId) ?? null;
      },
      getCell(cellId) {
        return diamondCellsById.get(cellId) ?? null;
      },
      getNeighbors(cellId) {
        const cell = diamondCellsById.get(cellId);
        if (!cell) return [];
        return cell.neighborIds.map((id) => diamondCellsById.get(id)).filter(Boolean);
      },
      getTraversalEdge(fromId, toId) {
        return graphRows.traversalGraph.find((edge) => edge.fromId === fromId && edge.toId === toId) ?? null;
      },
      getRequiredPredecessors(regionId) {
        return regionsById.get(regionId)?.requiredPredecessors ?? [];
      },
      getEncoding(encodingId) {
        return encodingsById.get(encodingId) ?? null;
      },
      getRegionBoundary(regionId) {
        return regionBoundariesById.get(regionId) ?? null;
      },
      getTerrainPolygon(terrainId) {
        return terrainPolygonsById.get(terrainId) ?? null;
      },
      getSubstratePolygon(substrateId) {
        return substratePolygonsById.get(substrateId) ?? null;
      },
      getGeneratedTerrainPolygon(terrainId) {
        return generatedTerrainPolygonsById.get(terrainId) ?? null;
      },
      getGeneratedSubstratePolygon(substrateId) {
        return generatedSubstratePolygonsById.get(substrateId) ?? null;
      },
      getTerrainTemplate(templateId) {
        return terrainTemplatesById.get(templateId) ?? null;
      },
      getSubstrateTemplate(templateId) {
        return substrateTemplatesById.get(templateId) ?? null;
      },
      getRegionTemplate(templateId) {
        return regionTemplatesById.get(templateId) ?? null;
      },
      getGeneratedTerrainForRegion(regionId) {
        return [...generatedTerrainPolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      getGeneratedSubstrateForRegion(regionId) {
        return [...generatedSubstratePolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      decodeStateByte(byte) {
        validateByte(byte);
        return byteToStateVector(byte);
      },
      projectWorldPositionToCell(input) {
        const { x, y, previousCellId = null } = input;
        const activeCell = nearestCell(diamondCellsById, x, y);
        const previousCell = previousCellId ? diamondCellsById.get(previousCellId) : null;
        const dx = activeCell.centerPoint[0] - x;
        const dy = activeCell.centerPoint[1] - y;
        const encoding = encodingsById.get(activeCell.stateEncodingId);
        return Object.freeze({
          regionId: activeCell.regionId,
          pathId: activeCell.pathId,
          cellId: activeCell.diamondCellId,
          bandIndex: activeCell.bandIndex,
          sector: activeCell.sector || sectorFromVector(dx, dy),
          stateByte: encoding.byte,
          stateEncodingId: activeCell.stateEncodingId,
          previousCellId: previousCell?.diamondCellId ?? null
        });
      },
      assertValidWorld() {
        validateCrossReferences({
          regionsById,
          pathsById,
          hazardsById,
          watersById,
          encodingsById,
          diamondCellsById,
          graphRows
        });
        validateHarborPolygonDatasets(
          coastlines,
          regionBoundariesById,
          terrainPolygonsById,
          substratePolygonsById
        );
        validateTerrainTemplateLibrary(terrainTemplatesById);
        validateSubstrateTemplateLibrary(substrateTemplatesById);
        validateRegionTemplates(regionTemplatesById);
        validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById);
        validateRegionTemplateBindings(regionsById, regionTemplatesById);

        for (const row of generatedTerrainPolygonsById.values()) {
          assertPolygon(row.polygon, `generatedTerrain.${row.terrainId}`);
        }

        for (const row of generatedSubstratePolygonsById.values()) {
          assertPolygon(row.polygon, `generatedSubstrate.${row.substrateId}`);
        }

        return true;
      }
    }
  };

  kernel.helpers.assertValidWorld();
  return freezeObjectTree(kernel);
}
