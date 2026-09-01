/**
 * /showroom/globe/h-earth/render/geometry-landscape.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_GEOMETRY_PROVIDER_RUN_6C_v2
 *
 * Constructs connected neutral terrain chunks from the Run 6B realization
 * descriptors and canonical terrain field. Semantic group membership remains
 * distinct from the subset physically realized as terrain in each chunk.
 */

import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';

import {
  H_EARTH_TERRAIN_FIELD,
  sampleHEarthTerrainField,
  evaluateHEarthTerrainSharedEdge
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../../../../h-earth-3d/integration/h-earth.landscape-realization-planner.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_GEOMETRY_PROVIDER_OW04_SUBTROPICAL_CAUSAL_v6';

export const H_EARTH_GEOMETRY_LANDSCAPE_PROFILE = freeze({
  contractId: H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID,
  samplesPerAxis: 25,
  adjacentLodVariation: false,
  uniformSharedBoundaryResolution: true,
  terrainChunkMaximum: 10,
  worldFieldContractId: H_EARTH_TERRAIN_FIELD.contractId,
  accessibleRegionExtent: {
    xMinimum: H_EARTH_TERRAIN_FIELD.worldDomain.xMinimum,
    xMaximum: H_EARTH_TERRAIN_FIELD.worldDomain.xMaximum,
    zMinimum: H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum,
    zMaximum: H_EARTH_TERRAIN_FIELD.coreDomain.zMaximum
  },
  accessibleRegionExtentFrozen: true,
  furtherTerrainExpansionProhibited: true,
  visibleWorldContinuationOwnedElsewhere: true,
  climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
  materialResponseLaw: 'COASTAL_FOREGROUND_IS_A_MIXED_GROUNDCOVER_AND_EXPOSED_SAND_SOIL_MOSAIC_WHILE_TRANSITION_AND_INLAND_TERRAIN_CARRY_STRONGER_VEGETATED_SUBTROPICAL_SIGNAL',
  neutralPrimitiveOnly: true,
  semanticGroupIdentityPreserved: true,
  physicalTerrainMembershipSeparated: true,
  ownsAdmission: false,
  ownsFrame: false,
  ownsRenderer: false
});

function realizeFrozenAccessibleBoundary(bounds) {
  const domain = H_EARTH_TERRAIN_FIELD.worldDomain;
  return freeze({
    xMin: bounds.xMin === -256 ? domain.xMinimum : bounds.xMin,
    xMax: bounds.xMax === 256 ? domain.xMaximum : bounds.xMax,
    zMin: bounds.zMin <= -256 ? domain.zMinimum : bounds.zMin,
    zMax: bounds.zMax
  });
}

const lerp = (a, b, t) => a + (b - a) * t;

function edgeSampleKey(sharedEdgeKey, ordinal) {
  return `${sharedEdgeKey}:S${String(ordinal).padStart(2, '0')}`;
}

function makeEdgeSamples(chunk, grid) {
  const size = H_EARTH_GEOMETRY_LANDSCAPE_PROFILE.samplesPerAxis;
  const edge = (side) => {
    const samples = [];
    for (let ordinal = 0; ordinal < size; ordinal += 1) {
      let row;
      let column;
      if (side === 'north') {
        row = 0;
        column = ordinal;
      } else if (side === 'south') {
        row = size - 1;
        column = ordinal;
      } else if (side === 'west') {
        row = ordinal;
        column = 0;
      } else {
        row = ordinal;
        column = size - 1;
      }
      const sample = grid[row][column];
      samples.push(freeze({
        key: edgeSampleKey(chunk.sharedEdgeKeys[side], ordinal),
        world: sample.world,
        normal: sample.normal,
        materialProfile: sample.materialProfile,
        sourceFieldContractId: sample.contractId
      }));
    }
    return freeze(samples);
  };

  return freeze({
    north: edge('north'),
    south: edge('south'),
    west: edge('west'),
    east: edge('east')
  });
}

function resolveSubtropicalMaterialIntent(chunk) {
  if (chunk.physicalRole === 'COASTAL_FOREGROUND_TERRAIN') {
    // The central coastal sectors carry the dominant humid groundcover signal,
    // while the flanking sectors retain exposed sand/soil. This prevents the
    // desert read without replacing it with a uniform green sheet.
    return chunk.columnGroup === 1 || chunk.columnGroup === 2
      ? 'HIGHLAND_SUBTROPICAL_COASTAL_GROUNDCOVER_WITH_EXPOSED_SAND_SOIL'
      : 'SUBTROPICAL_COASTAL_EXPOSED_SAND_SOIL_WITH_SPARSE_GROUNDCOVER';
  }
  if (chunk.physicalRole === 'COASTAL_TO_INLAND_TRANSITION_TERRAIN') {
    return 'HIGHLAND_SUBTROPICAL_COASTAL_SCRUB_GRASS_AND_HUMID_SOIL';
  }
  if (chunk.physicalRole === 'INLAND_ELEVATED_TERRAIN_WITH_PROXY_PARTITIONS') {
    return 'HIGHLAND_SUBTROPICAL_VEGETATED_FOOTHILL_AND_EXPOSED_STONE';
  }
  return 'SUBTROPICAL_CAUSAL_TERRAIN';
}

function constructChunk(chunk) {
  const size = H_EARTH_GEOMETRY_LANDSCAPE_PROFILE.samplesPerAxis;
  const worldBounds = realizeFrozenAccessibleBoundary(chunk.worldBounds);
  const vertices = [];
  const indices = [];
  const grid = [];

  for (let row = 0; row < size; row += 1) {
    const rowSamples = [];
    const z = lerp(worldBounds.zMin, worldBounds.zMax, row / (size - 1));
    for (let column = 0; column < size; column += 1) {
      const x = lerp(worldBounds.xMin, worldBounds.xMax, column / (size - 1));
      const sample = sampleHEarthTerrainField(x, z);
      rowSamples.push(sample);
      vertices.push(createHEarthVector3(x, sample.elevation, z));
    }
    grid.push(rowSamples);
  }

  for (let row = 0; row < size - 1; row += 1) {
    for (let column = 0; column < size - 1; column += 1) {
      const a = row * size + column;
      const b = a + 1;
      const c = (row + 1) * size + column;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const edgeSamples = makeEdgeSamples(chunk, grid);
  const primitiveId = `${chunk.chunkId}:TERRAIN`;
  const materialIntent = resolveSubtropicalMaterialIntent(chunk);
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: 'FUNCTIONAL_LANDSCAPE_TERRAIN_CHUNK',
    materialHint: freeze({
      materialKey: 'worldTerrainField',
      materialIntent,
      climateIdentity: 'WARM_SUBTROPICAL_COASTAL'
    }),
    source: freeze({
      sourceType: 'H_EARTH_CANONICAL_TERRAIN_FIELD_CHUNK',
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId,
      realizationPlannerContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.contractId
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID,
      chunkId: chunk.chunkId,
      physicalRole: chunk.physicalRole,
      semanticGroupMemberAddressIds: chunk.memberAddressIds,
      memberAddressIds: chunk.terrainMemberAddressIds,
      realizedTerrainAddressIds: chunk.terrainMemberAddressIds,
      shorelineWaterAddressIds: chunk.shorelineWaterMemberAddressIds,
      proxyAddressIds: chunk.proxyMemberAddressIds,
      formationIds: chunk.formationIds,
      sharedEdgeKeys: chunk.sharedEdgeKeys,
      edgeSamples,
      lodState: chunk.lodState,
      realizationState: chunk.realizationState,
      sourceWorldBounds: chunk.worldBounds,
      realizedWorldBounds: worldBounds,
      climateIdentity: 'WARM_SUBTROPICAL_COASTAL',
      environmentalCausality: 'LOCAL_ELEVATION_SLOPE_DRAINAGE_EXPOSURE_AND_COASTAL_INFLUENCE_NOT_OUTER_PERIMETER_DISTANCE',
      accessibleRegionExtentFrozen: true,
      accessibleRegionExtentPolicy: 'PRESERVE_OW03_ENLARGED_REGION_NO_FURTHER_TERRAIN_EXPANSION',
      visualWorldContinuationRequiredOutsideAccessibleExtent: true,
      visibleRectangularTerminationProhibited: true,
      foundingPacketMutationPerformed: false,
      semanticIdentityIndependentOfPhysicalGranularity: true,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({
    ok: construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord),
    chunkId: chunk.chunkId,
    physicalRole: chunk.physicalRole,
    realizedTerrainAddressCount: chunk.terrainMemberAddressIds.length,
    primitive: construction?.primitiveRecord ?? null,
    edgeSamples,
    issues: construction?.issues ?? []
  });
}

export function constructHEarthFunctionalLandscapeTerrain({
  realizationPlan = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} = {}) {
  const issues = [];
  if (realizationPlan?.eligible !== true || realizationPlan.physicalChunkCount !== 16 || realizationPlan.terrainChunkCount !== 10) {
    return freeze({ ok: false, status: 'FUNCTIONAL_LANDSCAPE_TERRAIN_REJECTED', contractId: H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID, chunkResults: [], primitives: [], bounds: null, issues: ['REALIZATION_PLAN_INVALID'] });
  }

  const terrainChunks = realizationPlan.chunks.filter((chunk) =>
    chunk.terrainMemberAddressIds.length > 0 && chunk.physicalRole.includes('TERRAIN')
  );
  const chunkResults = terrainChunks.map(constructChunk);
  chunkResults.forEach((result) => {
    if (!result.ok) issues.push(`TERRAIN_CHUNK_INVALID:${result.chunkId}`);
  });

  const byId = new Map(chunkResults.map((result) => [result.chunkId, result]));
  for (const chunk of terrainChunks) {
    const current = byId.get(chunk.chunkId);
    for (const side of ['east', 'south']) {
      const neighborId = chunk.physicalNeighborChunkIds[side];
      if (!neighborId || !byId.has(neighborId)) continue;
      const opposite = side === 'east' ? 'west' : 'north';
      const evaluation = evaluateHEarthTerrainSharedEdge({
        edgeA: current.edgeSamples[side],
        edgeB: byId.get(neighborId).edgeSamples[opposite]
      });
      if (!evaluation.eligible) issues.push(`SHARED_EDGE_FAILED:${chunk.chunkId}:${side}:${neighborId}`);
    }
  }

  const primitives = chunkResults.filter((result) => result.ok).map((result) => result.primitive);
  const bounds = primitives.length > 0
    ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds))
    : null;
  const realizedTerrainAddressIds = [...new Set(terrainChunks.flatMap((chunk) => chunk.terrainMemberAddressIds))].sort();

  if (realizedTerrainAddressIds.length !== 124) {
    issues.push(`REALIZED_TERRAIN_ADDRESS_COUNT_EXPECTED_124_ACTUAL_${realizedTerrainAddressIds.length}`);
  }

  return freeze({
    ok: issues.length === 0 && primitives.length === terrainChunks.length,
    status: issues.length === 0 ? 'FUNCTIONAL_LANDSCAPE_TERRAIN_COMPLETE' : 'FUNCTIONAL_LANDSCAPE_TERRAIN_FAILED',
    contractId: H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID,
    requestedChunkCount: terrainChunks.length,
    constructedChunkCount: primitives.length,
    realizedTerrainAddressCount: realizedTerrainAddressIds.length,
    realizedTerrainAddressIds,
    chunkResults,
    primitives,
    bounds,
    accessibleRegionExtent: H_EARTH_GEOMETRY_LANDSCAPE_PROFILE.accessibleRegionExtent,
    accessibleRegionExtentFrozen: true,
    accessibleRegionExpansion: false,
    admitted: false,
    issues
  });
}
