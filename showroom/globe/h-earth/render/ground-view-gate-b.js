/**
 * /showroom/globe/h-earth/render/ground-view-gate-b.js
 *
 * Phase 3 bounded Gate B terrain/water geometry provider.
 * Constructs exactly three projection-neutral primitives and performs no
 * admission, frame composition, route selection, renderer work, or visual claim.
 */

import {
  H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID,
  H_EARTH_GROUND_VIEW_PHASE_1_CONFIGURATION,
  H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY,
  H_EARTH_GROUND_VIEW_TERRAIN_TRUTH_ATTACHMENT_SEPARATION,
  evaluateHEarthGroundViewF,
  evaluateHEarthGroundViewGamma28,
  evaluateHEarthGroundViewOpenWater,
  evaluateHEarthGroundViewBeachField,
  evaluateHEarthGroundViewBluffField,
  evaluateHEarthGroundViewTidePool001Field,
  evaluateHEarthGroundViewTidePool002Field,
  evaluateHEarthGroundViewTidePool003Field,
  evaluateHEarthGroundViewTerrain
} from '../environment.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

export const H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID =
  'H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_TERRAIN_WATER_GEOMETRY_PROVIDER_v1';

export const H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_SOURCE_FILE =
  '/showroom/globe/h-earth/render/ground-view-gate-b.js';

export const H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS = Object.freeze({
  terrain: 'H_EARTH_GROUND_VIEW_CONTINUOUS_TERRAIN_TOPOLOGY',
  water: 'H_EARTH_GROUND_VIEW_CONTINUOUS_NEARSHORE_AND_OPEN_WATER_TOPOLOGY',
  diagnosticRibbon: 'H_EARTH_GROUND_VIEW_DIAGNOSTIC_SHORELINE_RIBBON'
});

export const H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION = Object.freeze({
  classification: 'PHYSICAL_LINEAR_TRIANGLES_APPROXIMATE_NONLINEAR_ANALYTICAL_IMAGE_SUBPATCHES',
  physicalTrianglesEqualExactNonlinearAnalyticalSurface: false
});

const EMPTY_FROZEN_ARRAY = Object.freeze([]);
const TERRAIN_REGION_IDS = Object.freeze([
  'BEACH',
  'BLUFF',
  'TIDE_POOL_001',
  'TIDE_POOL_002',
  'TIDE_POOL_003'
]);

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
}

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function exactArrayEqual(actual, expected) {
  return Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

function pad(value, length = 3) {
  return String(value).padStart(length, '0');
}

function createVectorFromWorldPoint(point) {
  return createHEarthVector3(point.world.x, point.world.y, point.world.z);
}

function edgeKey(vertexKeyA, vertexKeyB) {
  return vertexKeyA < vertexKeyB
    ? `${vertexKeyA}::${vertexKeyB}`
    : `${vertexKeyB}::${vertexKeyA}`;
}

function buildEdgeTable(faceTable, vertexTable, canonicalSeamEdgeByEndpointKey = null) {
  const map = new Map();
  for (const face of faceTable) {
    const pairs = [
      [face.vertexIndices[0], face.vertexIndices[1]],
      [face.vertexIndices[1], face.vertexIndices[2]],
      [face.vertexIndices[2], face.vertexIndices[0]]
    ];
    for (const [indexA, indexB] of pairs) {
      const vertexA = vertexTable[indexA];
      const vertexB = vertexTable[indexB];
      const key = edgeKey(vertexA.vertexKey, vertexB.vertexKey);
      let record = map.get(key);
      if (!record) {
        const canonicalResource = canonicalSeamEdgeByEndpointKey?.get(key) ?? null;
        record = {
          edgeKey: key,
          edgeId: canonicalResource?.edgeId ?? `H_EARTH_GROUND_VIEW_EDGE_${key}`,
          endpointVertexKeys: deepFreeze(
            vertexA.vertexKey < vertexB.vertexKey
              ? [vertexA.vertexKey, vertexB.vertexKey]
              : [vertexB.vertexKey, vertexA.vertexKey]
          ),
          endpointPhysicalIndices: deepFreeze(
            vertexA.vertexKey < vertexB.vertexKey
              ? [indexA, indexB]
              : [indexB, indexA]
          ),
          incidentFaceIds: [],
          canonicalResource,
          canonicalSharedSeam: canonicalResource !== null
        };
        map.set(key, record);
      }
      record.incidentFaceIds.push(face.faceId);
    }
  }
  return deepFreeze(
    Array.from(map.values())
      .sort((a, b) => a.edgeKey.localeCompare(b.edgeKey))
      .map((record) => deepFreeze({
        ...record,
        incidentFaceIds: deepFreeze(record.incidentFaceIds.slice().sort()),
        ownerFaceId: record.incidentFaceIds.slice().sort()[0],
        sharedEdgeOwnership: 'LOWEST_LEXICOGRAPHIC_INCIDENT_FACE_ID'
      }))
  );
}

function childRefinementPath(localColumn, localRow, level) {
  const labels = ['SW', 'SE', 'NW', 'NE'];
  const path = [];
  for (let depth = level - 1; depth >= 0; depth -= 1) {
    const xBit = (localColumn >> depth) & 1;
    const zBit = (localRow >> depth) & 1;
    const ordinal = xBit + 2 * zBit;
    path.push(`CHILD_${ordinal}_${labels[ordinal]}`);
  }
  return deepFreeze(path);
}

function classifyTerrainRegion(evaluation) {
  const candidates = [
    ['TIDE_POOL_001', Math.abs(evaluation.fields.tidePool001.contributionY)],
    ['TIDE_POOL_002', Math.abs(evaluation.fields.tidePool002.contributionY)],
    ['TIDE_POOL_003', Math.abs(evaluation.fields.tidePool003.contributionY)],
    ['BLUFF', Math.abs(evaluation.fields.bluff.contributionY)]
  ].sort((a, b) => b[1] - a[1]);
  return candidates[0][1] > 1e-12 ? candidates[0][0] : 'BEACH';
}

function validateFixedConfiguration() {
  const configuration = H_EARTH_GROUND_VIEW_PHASE_1_CONFIGURATION;
  invariant(configuration.finiteOpenWaterBoundR === 12, 'FINITE_OPEN_WATER_BOUND_R changed.');
  invariant(configuration.seamPartitionCount?.nodes === 25, 'Seam node count changed.');
  invariant(configuration.seamPartitionCount?.intervals === 24, 'Seam interval count changed.');
  invariant(exactArrayEqual(configuration.nearshoreDPartition, [0, 4, 8, 12, 16, 20, 24, 28]), 'Nearshore partition changed.');
  invariant(exactArrayEqual(configuration.openWaterRPartition, [0, 4, 8, 12]), 'Open-water partition changed.');
  invariant(configuration.terrainRootGridOrigin?.x === -96 && configuration.terrainRootGridOrigin?.y === 0 && configuration.terrainRootGridOrigin?.z === -114, 'Terrain root origin changed.');
  invariant(configuration.terrainRootCellSize === 32, 'Terrain root cell size changed.');
  invariant(configuration.terrainRootRows === 5, 'Terrain root row count changed.');
  invariant(configuration.terrainRootColumns === 6, 'Terrain root column count changed.');
  invariant(configuration.maximumRefinementLevel === 3, 'Maximum refinement level changed.');
  invariant(configuration.primitiveBudget === 3, 'Primitive budget changed.');
  invariant(configuration.vertexBudget === 4096, 'Vertex budget changed.');
  invariant(configuration.diagnosticRibbonWidth === 1, 'Diagnostic ribbon width changed.');
  invariant(configuration.diagnosticRibbonOffset === 0.08, 'Diagnostic ribbon offset changed.');
  invariant(H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY.vertexCount === 25, 'Canonical seam vertex count changed.');
  invariant(H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY.edgeCount === 24, 'Canonical seam edge count changed.');
  return configuration;
}

function createTerrainTopology() {
  const configuration = validateFixedConfiguration();
  const subdivisionsPerRoot = 2 ** configuration.maximumRefinementLevel;
  const xIntervalCount = configuration.terrainRootColumns * subdivisionsPerRoot;
  const zIntervalCount = configuration.terrainRootRows * subdivisionsPerRoot;
  const leafCellSize = configuration.terrainRootCellSize / subdivisionsPerRoot;
  const vertexTable = [];
  const vertices = [];
  const vertexIndex = (column, row) => row * (xIntervalCount + 1) + column;

  for (let row = 0; row <= zIntervalCount; row += 1) {
    for (let column = 0; column <= xIntervalCount; column += 1) {
      const x = configuration.terrainRootGridOrigin.x + column * leafCellSize;
      const z = configuration.terrainRootGridOrigin.z + row * leafCellSize;
      const terrain = evaluateHEarthGroundViewTerrain(x, z);
      const vertexKey = `TERRAIN_VERTEX_R${pad(row)}_C${pad(column)}`;
      vertices.push(createHEarthVector3(x, terrain.elevationY, z));
      vertexTable.push(deepFreeze({
        vertexKey,
        physicalIndex: vertexTable.length,
        gridColumn: column,
        gridRow: row,
        x,
        y: terrain.elevationY,
        z,
        primaryRegionId: classifyTerrainRegion(terrain),
        terrainTruth: terrain
      }));
    }
  }

  const indices = [];
  const cellTable = [];
  const faceTable = [];
  const faceRegionTable = Object.fromEntries(TERRAIN_REGION_IDS.map((id) => [id, []]));

  for (let row = 0; row < zIntervalCount; row += 1) {
    for (let column = 0; column < xIntervalCount; column += 1) {
      const a = vertexIndex(column, row);
      const b = vertexIndex(column + 1, row);
      const c = vertexIndex(column + 1, row + 1);
      const d = vertexIndex(column, row + 1);
      const rootColumn = Math.floor(column / subdivisionsPerRoot);
      const rootRow = Math.floor(row / subdivisionsPerRoot);
      const localColumn = column % subdivisionsPerRoot;
      const localRow = row % subdivisionsPerRoot;
      const rootCellId = `TERRAIN_ROOT_CELL_R${pad(rootRow, 2)}_C${pad(rootColumn, 2)}`;
      const cellKey = `${rootCellId}:${childRefinementPath(localColumn, localRow, configuration.maximumRefinementLevel).join('/')}`;
      const centerX = configuration.terrainRootGridOrigin.x + (column + 0.5) * leafCellSize;
      const centerZ = configuration.terrainRootGridOrigin.z + (row + 0.5) * leafCellSize;
      const regionId = classifyTerrainRegion(evaluateHEarthGroundViewTerrain(centerX, centerZ));
      const face0Id = `${cellKey}:FACE_0`;
      const face1Id = `${cellKey}:FACE_1`;

      indices.push(a, c, b, a, d, c);
      const face0 = deepFreeze({ faceId: face0Id, cellKey, localFaceOrdinal: 0, vertexIndices: deepFreeze([a, c, b]), regionId, winding: 'COUNTERCLOCKWISE_WHEN_VIEWED_FROM_POSITIVE_WORLD_Y' });
      const face1 = deepFreeze({ faceId: face1Id, cellKey, localFaceOrdinal: 1, vertexIndices: deepFreeze([a, d, c]), regionId, winding: 'COUNTERCLOCKWISE_WHEN_VIEWED_FROM_POSITIVE_WORLD_Y' });
      faceTable.push(face0, face1);
      faceRegionTable[regionId].push(face0Id, face1Id);
      cellTable.push(deepFreeze({
        cellKey,
        rootCellId,
        rootOrderingOrdinal: rootRow * configuration.terrainRootColumns + rootColumn,
        childRefinementPath: childRefinementPath(localColumn, localRow, configuration.maximumRefinementLevel),
        leafColumn: column,
        leafRow: row,
        vertexIndices: deepFreeze([a, b, c, d]),
        diagonal: deepFreeze([a, c]),
        faceIds: deepFreeze([face0Id, face1Id]),
        regionId
      }));
    }
  }

  const edgeTable = buildEdgeTable(faceTable, vertexTable);
  const meshIdentity = [
    'H_EARTH_GROUND_VIEW_TERRAIN_MESH',
    `ORIGIN_${configuration.terrainRootGridOrigin.x}_${configuration.terrainRootGridOrigin.z}`,
    `ROOT_${configuration.terrainRootColumns}x${configuration.terrainRootRows}`,
    `CELL_${configuration.terrainRootCellSize}`,
    `REFINE_${configuration.maximumRefinementLevel}`,
    'DIAGONAL_LL_UR',
    'WINDING_POSITIVE_Y'
  ].join(':');

  const result = constructHEarthTriangleMesh({
    primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.terrain,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'CONTINUOUS_TERRAIN_TOPOLOGY',
    materialHint: deepFreeze({ attachmentAuthority: 'DOWNSTREAM_ONLY', terrainTruthAuthority: H_EARTH_GROUND_VIEW_TERRAIN_TRUTH_ATTACHMENT_SEPARATION.terrainIntrinsicTruth.authorityId }),
    source: deepFreeze({ environmentAuthorityId: H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID, terrainEvaluator: 'evaluateHEarthGroundViewTerrain' }),
    attributes: deepFreeze({ vertexKeys: vertexTable.map((record) => record.vertexKey), primaryRegionIds: vertexTable.map((record) => record.primaryRegionId) }),
    metadata: deepFreeze({
      meshIdentity,
      topologyClass: 'ONE_PHYSICAL_TERRAIN_TOPOLOGY',
      rootCellOrdering: 'ROW_MAJOR_Z_THEN_X',
      childRefinementOrdering: 'SW_SE_NW_NE_PER_LEVEL',
      vertexKeyLaw: 'TERRAIN_VERTEX_R{ROW}_C{COLUMN}',
      edgeKeyLaw: 'SORTED_ENDPOINT_VERTEX_KEYS',
      cellKeyLaw: 'ROOT_CELL_ID_PLUS_CHILD_REFINEMENT_PATH',
      faceKeyLaw: 'CELL_KEY_PLUS_FACE_ORDINAL',
      diagonalLaw: 'LOWER_LEFT_TO_UPPER_RIGHT',
      windingLaw: 'POSITIVE_WORLD_Y',
      analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
      physicalTrianglesEqualExactNonlinearAnalyticalSurface: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.physicalTrianglesEqualExactNonlinearAnalyticalSurface,
      sharedEdgeOwnershipLaw: 'LOWEST_LEXICOGRAPHIC_INCIDENT_FACE_ID',
      vertexTable,
      edgeTable,
      cellTable,
      faceTable,
      faceRegionTable: deepFreeze(Object.fromEntries(Object.entries(faceRegionTable).map(([key, value]) => [key, deepFreeze(value)]))),
      overlappingSemanticGroundMeshes: false,
      terrainTruthAttachmentSeparation: H_EARTH_GROUND_VIEW_TERRAIN_TRUTH_ATTACHMENT_SEPARATION
    })
  });

  invariant(result?.valid === true, 'Terrain neutral mesh construction failed.');
  invariant(isHEarthNeutralPrimitiveRecord(result.primitiveRecord), 'Terrain primitive is not a neutral primitive record.');
  return deepFreeze({
    primitive: result.primitiveRecord,
    receipt: deepFreeze({
      meshIdentity,
      vertexCount: vertices.length,
      edgeCount: edgeTable.length,
      cellCount: cellTable.length,
      faceCount: faceTable.length,
      triangleCount: indices.length / 3,
      singlePhysicalTopology: true,
      terrainRegionIds: TERRAIN_REGION_IDS,
      deterministic: true,
      analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
      physicalTrianglesEqualExactNonlinearAnalyticalSurface: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.physicalTrianglesEqualExactNonlinearAnalyticalSurface
    })
  });
}

function createWaterTopology() {
  const configuration = validateFixedConfiguration();
  const seamAuthority = H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY;
  const parameterTable = seamAuthority.parameterTable;
  const nearshorePartition = configuration.nearshoreDPartition;
  const openWaterPartition = configuration.openWaterRPartition;
  const vertices = [];
  const vertexTable = [];
  const nearshoreGrid = [];
  const openWaterGrid = [];
  const canonicalSeamPhysicalIndices = [];

  for (let dOrdinal = 0; dOrdinal < nearshorePartition.length; dOrdinal += 1) {
    const d = nearshorePartition[dOrdinal];
    const row = [];
    for (let sOrdinal = 0; sOrdinal < parameterTable.length; sOrdinal += 1) {
      const parameterRecord = parameterTable[sOrdinal];
      const canonicalSeamVertex = d === 28 ? seamAuthority.vertexTable[sOrdinal] : null;
      const point = canonicalSeamVertex?.position ?? evaluateHEarthGroundViewF(parameterRecord.s, d);
      const physicalIndex = vertices.length;
      const vertexKey = canonicalSeamVertex?.vertexId ?? `NEARSHORE_VERTEX_D${pad(dOrdinal, 2)}_S${pad(sOrdinal, 2)}`;
      vertices.push(createVectorFromWorldPoint(point));
      vertexTable.push(deepFreeze({
        vertexKey,
        physicalIndex,
        region: d === 28 ? 'CANONICAL_GAMMA_28' : 'NEARSHORE',
        sOrdinal,
        s: parameterRecord.s,
        d,
        r: null,
        canonicalResource: canonicalSeamVertex,
        canonicalSharedSeam: canonicalSeamVertex !== null
      }));
      row.push(physicalIndex);
      if (d === 28) canonicalSeamPhysicalIndices.push(physicalIndex);
    }
    nearshoreGrid.push(deepFreeze(row));
  }

  openWaterGrid.push(deepFreeze(canonicalSeamPhysicalIndices.slice()));
  for (let rOrdinal = 1; rOrdinal < openWaterPartition.length; rOrdinal += 1) {
    const r = openWaterPartition[rOrdinal];
    const row = [];
    for (let sOrdinal = 0; sOrdinal < parameterTable.length; sOrdinal += 1) {
      const parameterRecord = parameterTable[sOrdinal];
      const point = evaluateHEarthGroundViewOpenWater(parameterRecord.s, r);
      const physicalIndex = vertices.length;
      const vertexKey = `OPEN_WATER_VERTEX_R${pad(rOrdinal, 2)}_S${pad(sOrdinal, 2)}`;
      vertices.push(createVectorFromWorldPoint(point));
      vertexTable.push(deepFreeze({
        vertexKey,
        physicalIndex,
        region: 'OPEN_WATER',
        sOrdinal,
        s: parameterRecord.s,
        d: null,
        r,
        canonicalResource: null,
        canonicalSharedSeam: false
      }));
      row.push(physicalIndex);
    }
    openWaterGrid.push(deepFreeze(row));
  }

  const canonicalSeamEdgeByEndpointKey = new Map();
  for (let ordinal = 0; ordinal < seamAuthority.edgeTable.length; ordinal += 1) {
    const edge = seamAuthority.edgeTable[ordinal];
    const startIndex = canonicalSeamPhysicalIndices[ordinal];
    const endIndex = canonicalSeamPhysicalIndices[ordinal + 1];
    const key = edgeKey(vertexTable[startIndex].vertexKey, vertexTable[endIndex].vertexKey);
    canonicalSeamEdgeByEndpointKey.set(key, edge);
  }

  const indices = [];
  const cellTable = [];
  const faceTable = [];
  const nearshoreFaceIds = [];
  const openWaterFaceIds = [];

  function addBandCells(grid, partition, regionId, coordinateName) {
    for (let band = 0; band < partition.length - 1; band += 1) {
      for (let segment = 0; segment < parameterTable.length - 1; segment += 1) {
        const a = grid[band][segment];
        const b = grid[band][segment + 1];
        const c = grid[band + 1][segment + 1];
        const d = grid[band + 1][segment];
        const cellKey = `${regionId}_CELL_${coordinateName}${pad(band, 2)}_S${pad(segment, 2)}`;
        const face0Id = `${cellKey}:FACE_0`;
        const face1Id = `${cellKey}:FACE_1`;
        indices.push(a, c, b, a, d, c);
        const face0 = deepFreeze({ faceId: face0Id, cellKey, localFaceOrdinal: 0, vertexIndices: deepFreeze([a, c, b]), regionId, winding: 'COUNTERCLOCKWISE_WHEN_VIEWED_FROM_POSITIVE_WORLD_Y' });
        const face1 = deepFreeze({ faceId: face1Id, cellKey, localFaceOrdinal: 1, vertexIndices: deepFreeze([a, d, c]), regionId, winding: 'COUNTERCLOCKWISE_WHEN_VIEWED_FROM_POSITIVE_WORLD_Y' });
        faceTable.push(face0, face1);
        (regionId === 'NEARSHORE' ? nearshoreFaceIds : openWaterFaceIds).push(face0Id, face1Id);
        cellTable.push(deepFreeze({
          cellKey,
          regionId,
          bandOrdinal: band,
          seamSegmentOrdinal: segment,
          coordinateRange: deepFreeze([partition[band], partition[band + 1]]),
          vertexIndices: deepFreeze([a, b, c, d]),
          diagonal: deepFreeze([a, c]),
          faceIds: deepFreeze([face0Id, face1Id])
        }));
      }
    }
  }

  addBandCells(nearshoreGrid, nearshorePartition, 'NEARSHORE', 'D');
  addBandCells(openWaterGrid, openWaterPartition, 'OPEN_WATER', 'R');

  const edgeTable = buildEdgeTable(faceTable, vertexTable, canonicalSeamEdgeByEndpointKey);
  const seamEdgeRecords = edgeTable.filter((edge) => edge.canonicalSharedSeam);
  const seamVertexRecords = canonicalSeamPhysicalIndices.map((physicalIndex, ordinal) => deepFreeze({
    physicalIndex,
    canonicalResource: seamAuthority.vertexTable[ordinal],
    canonicalVertexId: seamAuthority.vertexTable[ordinal].vertexId
  }));
  const meshIdentity = [
    'H_EARTH_GROUND_VIEW_WATER_MESH',
    seamAuthority.activePartitionId,
    `D_${nearshorePartition.join('_')}`,
    `R_${openWaterPartition.join('_')}`,
    'ONE_SHARED_SEAM_ROW',
    'DIAGONAL_LL_UR',
    'WINDING_POSITIVE_Y'
  ].join(':');

  const result = constructHEarthTriangleMesh({
    primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.water,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'CONTINUOUS_NEARSHORE_AND_OPEN_WATER_TOPOLOGY',
    materialHint: deepFreeze({ attachmentAuthority: 'DOWNSTREAM_ONLY', nearshoreRegionId: 'NEARSHORE', openWaterRegionId: 'OPEN_WATER' }),
    source: deepFreeze({ environmentAuthorityId: H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID, nearshoreEvaluator: 'evaluateHEarthGroundViewF', openWaterEvaluator: 'evaluateHEarthGroundViewOpenWater' }),
    attributes: deepFreeze({ vertexKeys: vertexTable.map((record) => record.vertexKey), regionIds: vertexTable.map((record) => record.region) }),
    metadata: deepFreeze({
      meshIdentity,
      topologyClass: 'ONE_PHYSICAL_NEARSHORE_AND_OPEN_WATER_TOPOLOGY',
      canonicalSeamId: seamAuthority.seamId,
      canonicalSeamPartitionId: seamAuthority.activePartitionId,
      canonicalSeamPhysicalIndices: deepFreeze(canonicalSeamPhysicalIndices),
      nearshoreGrid: deepFreeze(nearshoreGrid),
      openWaterGrid: deepFreeze(openWaterGrid),
      vertexTable,
      edgeTable,
      cellTable,
      faceTable,
      faceRegionTables: deepFreeze({ nearshore: deepFreeze(nearshoreFaceIds), openWater: deepFreeze(openWaterFaceIds) }),
      nearshoreMaximumD: 28,
      openWaterMaximumR: 12,
      certificationReserveEmissionCount: 0,
      consumerLocalSeamResourceCount: 0,
      duplicateSeamIdentityCount: 0,
      seamVertexUniquePhysicalCount: canonicalSeamPhysicalIndices.length,
      seamEdgeUniquePhysicalCount: seamEdgeRecords.length,
      seamVertexRegionReferenceCount: canonicalSeamPhysicalIndices.length * 2,
      seamEdgeRegionReferenceCount: seamEdgeRecords.length * 2,
      noNearshoreOpenWaterInteriorOverlap: true,
      strictOpenWaterOrdering: true,
      noReturnToGamma28ForPositiveR: true,
      diagonalLaw: 'LOWER_LEFT_TO_UPPER_RIGHT',
      windingLaw: 'POSITIVE_WORLD_Y',
      analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
      physicalTrianglesEqualExactNonlinearAnalyticalSurface: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.physicalTrianglesEqualExactNonlinearAnalyticalSurface
    })
  });

  invariant(result?.valid === true, 'Water neutral mesh construction failed.');
  invariant(isHEarthNeutralPrimitiveRecord(result.primitiveRecord), 'Water primitive is not a neutral primitive record.');
  invariant(canonicalSeamPhysicalIndices.length === 25, 'Canonical seam physical row does not contain 25 vertices.');
  invariant(seamEdgeRecords.length === 24, 'Canonical seam edge row does not contain 24 edges.');

  return deepFreeze({
    primitive: result.primitiveRecord,
    canonicalResourceCorrespondence: deepFreeze({
      seamAuthority,
      vertexRecords: seamVertexRecords,
      edgeRecords: deepFreeze(seamEdgeRecords.map((record) => deepFreeze({
        physicalEdgeKey: record.edgeKey,
        canonicalResource: record.canonicalResource,
        canonicalEdgeId: record.canonicalResource.edgeId
      }))),
      nearshoreReferencesExactPhysicalRow: true,
      openWaterReferencesExactPhysicalRow: true,
      resourceIdentitySharingIsPhysical: true
    }),
    receipt: deepFreeze({
      meshIdentity,
      vertexCount: vertices.length,
      edgeCount: edgeTable.length,
      cellCount: cellTable.length,
      faceCount: faceTable.length,
      triangleCount: indices.length / 3,
      nearshoreMaximumD: 28,
      openWaterMaximumR: 12,
      certificationReserveEmissionCount: 0,
      canonicalSeamVertexCount: 25,
      canonicalSeamEdgeCount: 24,
      seamVertexReferenceCount: 50,
      seamEdgeReferenceCount: 48,
      duplicateSeamIdentityCount: 0,
      consumerLocalSeamResourceCount: 0,
      singlePhysicalTopology: true,
      deterministic: true,
      analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
      physicalTrianglesEqualExactNonlinearAnalyticalSurface: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.physicalTrianglesEqualExactNonlinearAnalyticalSurface
    })
  });
}

function createDiagnosticRibbon() {
  const configuration = validateFixedConfiguration();
  const seamAuthority = H_EARTH_GROUND_VIEW_GAMMA_28_AUTHORITY;
  const halfWidth = configuration.diagnosticRibbonWidth / 2;
  const offsetY = configuration.diagnosticRibbonOffset;
  const vertices = [];
  const vertexTable = [];
  const landwardIndices = [];
  const waterwardIndices = [];

  for (let ordinal = 0; ordinal < seamAuthority.vertexTable.length; ordinal += 1) {
    const current = seamAuthority.vertexTable[ordinal].position.world;
    const previous = seamAuthority.vertexTable[Math.max(0, ordinal - 1)].position.world;
    const next = seamAuthority.vertexTable[Math.min(seamAuthority.vertexTable.length - 1, ordinal + 1)].position.world;
    const tangentX = next.x - previous.x;
    const tangentZ = next.z - previous.z;
    const tangentLength = Math.hypot(tangentX, tangentZ);
    invariant(tangentLength > 0, 'Diagnostic seam tangent is degenerate.');
    const waterwardX = -tangentZ / tangentLength;
    const waterwardZ = tangentX / tangentLength;
    const landwardIndex = vertices.length;
    vertices.push(createHEarthVector3(current.x - waterwardX * halfWidth, current.y + offsetY, current.z - waterwardZ * halfWidth));
    vertexTable.push(deepFreeze({ vertexKey: `DIAGNOSTIC_LANDWARD_${pad(ordinal, 2)}`, physicalIndex: landwardIndex, canonicalResource: seamAuthority.vertexTable[ordinal], side: 'LANDWARD' }));
    landwardIndices.push(landwardIndex);
    const waterwardIndex = vertices.length;
    vertices.push(createHEarthVector3(current.x + waterwardX * halfWidth, current.y + offsetY, current.z + waterwardZ * halfWidth));
    vertexTable.push(deepFreeze({ vertexKey: `DIAGNOSTIC_WATERWARD_${pad(ordinal, 2)}`, physicalIndex: waterwardIndex, canonicalResource: seamAuthority.vertexTable[ordinal], side: 'WATERWARD' }));
    waterwardIndices.push(waterwardIndex);
  }

  const indices = [];
  const faceTable = [];
  for (let segment = 0; segment < seamAuthority.edgeTable.length; segment += 1) {
    const a = landwardIndices[segment];
    const b = landwardIndices[segment + 1];
    const c = waterwardIndices[segment + 1];
    const d = waterwardIndices[segment];
    const face0Id = `DIAGNOSTIC_RIBBON_SEGMENT_${pad(segment, 2)}:FACE_0`;
    const face1Id = `DIAGNOSTIC_RIBBON_SEGMENT_${pad(segment, 2)}:FACE_1`;
    indices.push(a, c, b, a, d, c);
    faceTable.push(
      deepFreeze({ faceId: face0Id, vertexIndices: deepFreeze([a, c, b]), canonicalSeamEdge: seamAuthority.edgeTable[segment] }),
      deepFreeze({ faceId: face1Id, vertexIndices: deepFreeze([a, d, c]), canonicalSeamEdge: seamAuthority.edgeTable[segment] })
    );
  }

  const meshIdentity = `H_EARTH_GROUND_VIEW_DIAGNOSTIC_RIBBON:${seamAuthority.activePartitionId}:WIDTH_${configuration.diagnosticRibbonWidth}:OFFSET_${configuration.diagnosticRibbonOffset}`;
  const result = constructHEarthTriangleMesh({
    primitiveId: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS.diagnosticRibbon,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.XZ_RIBBON_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'DIAGNOSTIC_SHORELINE_RIBBON',
    materialHint: deepFreeze({ diagnosticOnly: true, authoritativeMaterialAssignment: false }),
    visibilityHint: deepFreeze({ intendedForControlledGateBValidationOnly: true }),
    source: deepFreeze({ canonicalSeamId: seamAuthority.seamId, canonicalSeamPartitionId: seamAuthority.activePartitionId }),
    metadata: deepFreeze({
      meshIdentity,
      classification: 'NON_AUTHORITATIVE_DIAGNOSTIC_ONLY',
      width: configuration.diagnosticRibbonWidth,
      worldYOffset: configuration.diagnosticRibbonOffset,
      ownsSeamResources: false,
      redefinesShorelineGeometry: false,
      canonicalSeamVertexIds: deepFreeze(seamAuthority.vertexTable.map((record) => record.vertexId)),
      canonicalSeamEdgeIds: deepFreeze(seamAuthority.edgeTable.map((record) => record.edgeId)),
      vertexTable,
      faceTable
    })
  });

  invariant(result?.valid === true, 'Diagnostic ribbon neutral mesh construction failed.');
  invariant(isHEarthNeutralPrimitiveRecord(result.primitiveRecord), 'Diagnostic ribbon is not a neutral primitive record.');
  return deepFreeze({
    primitive: result.primitiveRecord,
    receipt: deepFreeze({
      meshIdentity,
      vertexCount: vertices.length,
      triangleCount: indices.length / 3,
      canonicalSeamVertexReferenceCount: 25,
      canonicalSeamEdgeReferenceCount: 24,
      diagnosticOnly: true,
      ownsSeamResources: false,
      deterministic: true
    })
  });
}

function calculatePhysicalCounts(primitives) {
  return deepFreeze({
    vertexCount: primitives.reduce((sum, primitive) => sum + primitive.geometry.vertices.length, 0),
    triangleCount: primitives.reduce((sum, primitive) => sum + primitive.geometry.indices.length / 3, 0)
  });
}

export function constructHEarthGroundViewGateBGeometry() {
  const configuration = validateFixedConfiguration();
  const terrain = createTerrainTopology();
  const water = createWaterTopology();
  const diagnosticRibbon = createDiagnosticRibbon();
  const primitives = deepFreeze([terrain.primitive, water.primitive, diagnosticRibbon.primitive]);
  invariant(primitives.length === configuration.primitiveBudget, 'Gate B must construct exactly three neutral primitives.');
  invariant(primitives.every(isHEarthNeutralPrimitiveRecord), 'Gate B emitted a non-neutral primitive.');
  const physicalCounts = calculatePhysicalCounts(primitives);
  invariant(physicalCounts.vertexCount <= configuration.vertexBudget, 'Gate B physical vertex budget exceeded.');
  const logicalVertexCount = terrain.receipt.vertexCount + water.receipt.vertexCount + diagnosticRibbon.receipt.vertexCount;
  const logicalTriangleCount = terrain.receipt.triangleCount + water.receipt.triangleCount + diagnosticRibbon.receipt.triangleCount;
  const deterministicConstructionIdentity = [
    H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
    H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID,
    terrain.receipt.meshIdentity,
    water.receipt.meshIdentity,
    diagnosticRibbon.receipt.meshIdentity,
    `V_${physicalCounts.vertexCount}`,
    `T_${physicalCounts.triangleCount}`
  ].join('|');

  const receipt = deepFreeze({
    receiptId: 'H_EARTH_GROUND_VIEW_GATE_B_PHASE_3_CONSTRUCTION_RECEIPT_v1',
    occurrenceId: configuration.occurrenceId,
    configurationIdentity: deepFreeze({
      environmentAuthorityId: H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID,
      configuration,
      geometryKernelContractId: H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID
    }),
    terrainMeshIdentity: terrain.receipt.meshIdentity,
    waterMeshIdentity: water.receipt.meshIdentity,
    seamResourceCorrespondence: water.canonicalResourceCorrespondence,
    primitiveInventory: deepFreeze(primitives.map((primitive, ordinal) => deepFreeze({ ordinal, primitiveId: primitive.primitiveId, semanticRole: primitive.semanticRole, primitiveType: primitive.primitiveType }))),
    neutralPrimitiveCount: primitives.length,
    logicalVertexCount,
    physicalVertexCount: physicalCounts.vertexCount,
    logicalTriangleCount,
    physicalTriangleCount: physicalCounts.triangleCount,
    nearshoreMaximumD: water.receipt.nearshoreMaximumD,
    openWaterMaximumR: water.receipt.openWaterMaximumR,
    certificationReserveEmissionCount: water.receipt.certificationReserveEmissionCount,
    seamVertexReferenceCount: water.receipt.seamVertexReferenceCount,
    seamEdgeReferenceCount: water.receipt.seamEdgeReferenceCount,
    canonicalSeamUniqueVertexCount: water.receipt.canonicalSeamVertexCount,
    canonicalSeamUniqueEdgeCount: water.receipt.canonicalSeamEdgeCount,
    duplicateSeamIdentityCount: water.receipt.duplicateSeamIdentityCount,
    consumerLocalSeamResourceCount: water.receipt.consumerLocalSeamResourceCount,
    primitiveBudget: configuration.primitiveBudget,
    vertexBudget: configuration.vertexBudget,
    vertexBudgetPassed: physicalCounts.vertexCount <= configuration.vertexBudget,
    deterministicConstructionIdentity,
    analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.classification,
    physicalTrianglesEqualExactNonlinearAnalyticalSurface: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION.physicalTrianglesEqualExactNonlinearAnalyticalSurface,
    geometryBuffersConstructed: true,
    admissionIntegrated: false,
    routeIntegrated: false,
    rendererMaterialized: false,
    runtimeClaim: false,
    visualClaim: false,
    mathematicsReopened: false,
    configurationChanged: false
  });

  return deepFreeze({
    valid: true,
    constructionStatus: 'CONSTRUCTED_NEUTRAL_PRIMITIVES_NOT_ADMITTED',
    primitives,
    terrainTopology: terrain,
    waterTopology: water,
    diagnosticRibbon,
    receipt,
    issues: EMPTY_FROZEN_ARRAY
  });
}

export function evaluateHEarthGroundViewGateBDeterminism() {
  const first = constructHEarthGroundViewGateBGeometry();
  const second = constructHEarthGroundViewGateBGeometry();
  const passed = first.receipt.deterministicConstructionIdentity === second.receipt.deterministicConstructionIdentity &&
    first.receipt.physicalVertexCount === second.receipt.physicalVertexCount &&
    first.receipt.physicalTriangleCount === second.receipt.physicalTriangleCount &&
    first.primitives.every((primitive, index) =>
      primitive.primitiveId === second.primitives[index].primitiveId &&
      primitive.geometry.vertices.length === second.primitives[index].geometry.vertices.length &&
      primitive.geometry.indices.length === second.primitives[index].geometry.indices.length
    );
  return deepFreeze({
    passed,
    firstConstructionIdentity: first.receipt.deterministicConstructionIdentity,
    secondConstructionIdentity: second.receipt.deterministicConstructionIdentity,
    processingOrderDependency: false
  });
}

export const H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT = deepFreeze({
  contractId: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT_ID,
  sourceFile: H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_SOURCE_FILE,
  environmentAuthorityId: H_EARTH_GROUND_VIEW_GATE_B_ENVIRONMENT_AUTHORITY_ID,
  primitiveIds: H_EARTH_GROUND_VIEW_GATE_B_PRIMITIVE_IDS,
  neutralPrimitiveCount: 3,
  constructionEntryPoint: 'constructHEarthGroundViewGateBGeometry',
  determinismEntryPoint: 'evaluateHEarthGroundViewGateBDeterminism',
  analyticalPhysicalDistinction: H_EARTH_GROUND_VIEW_ANALYTICAL_PHYSICAL_DISTINCTION,
  admissionAuthority: false,
  frameAuthority: false,
  compositorAuthority: false,
  routeAuthority: false,
  rendererAuthority: false,
  runtimeClaim: false,
  visualClaim: false,
  productionClaim: false
});

export default H_EARTH_GROUND_VIEW_GATE_B_GEOMETRY_CONTRACT;
