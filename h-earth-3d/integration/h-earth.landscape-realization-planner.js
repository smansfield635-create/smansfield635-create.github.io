/**
 * /h-earth-3d/integration/h-earth.landscape-realization-planner.js
 *
 * H_EARTH_LANDSCAPE_REALIZATION_PLANNER_RUN_6B_v2
 *
 * Descriptor-only bridge from the existing 256-address semantic lattice to
 * sixteen fixed 4x4 address groups with independently assigned physical
 * realization roles. Semantic row order is not treated as a literal Z grid.
 */

import {
  getHEarthLandscapeLatticeMap
} from '../zones/ground-cell-001.landscape-lattice.js';

import {
  H_EARTH_TERRAIN_FIELD,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';

import {
  H_EARTH_TERRAIN_FORMATIONS,
  resolveHEarthFormationMembershipForAddress
} from '../terrain/h-earth.terrain-formations.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const stable = (value) => value === null || typeof value !== 'object'
  ? JSON.stringify(value)
  : Array.isArray(value)
    ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map((key) =>
        `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;

const digest32 = (text) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID =
  'H_EARTH_LANDSCAPE_REALIZATION_PLANNER_RUN_6B_v2_SEMANTIC_PHYSICAL_SEPARATION';

export const H_EARTH_LANDSCAPE_REALIZATION_PLANNER = freeze({
  contractId: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
  semanticAddressCountRequired: 256,
  physicalChunkCountRequired: 16,
  chunkLayout: 'FIXED_4_BY_4_ADDRESS_GROUPS',
  physicalBoundsRule: 'ASSIGNED_BY_REALIZATION_ROLE_NOT_SEMANTIC_ROW_ORDINAL',
  adjacentLodVariation: false,
  uniformSharedBoundaryResolution: true,
  owns: {
    addressParticipation: true,
    addressGrouping: true,
    physicalRealizationRole: true,
    physicalBoundsAssignment: true,
    realizationState: true,
    lodState: true,
    proxySelection: true,
    geometry: false,
    semanticLattice: false,
    terrainField: false,
    formationIdentity: false,
    admission: false,
    renderer: false
  }
});

const TERRAIN_REGION_IDS = new Set([
  'FOREGROUND_INSPECTION_GROUND',
  'DRY_SAND_UPPER_BEACH',
  'ELEVATED_MANOR_CONTEXT'
]);

const SHORELINE_WATER_REGION_IDS = new Set([
  'SHORELINE_CONTACT',
  'NEARSHORE_WAVE_BAND',
  'WATER_SURFACE_PLANE'
]);

const PROXY_REGION_IDS = new Set([
  'OFFSHORE_ROCK_STACKS_AND_ISLETS',
  'AIR_HAZE_DISTANT_ATMOSPHERE'
]);

const worldX = (columnBoundary) =>
  -256 + (columnBoundary / 16) * 512;

const chunkId = (rowGroup, columnGroup) =>
  `H_EARTH_LANDSCAPE_CHUNK_R${String(rowGroup * 4 + 1).padStart(2, '0')}_R${String(rowGroup * 4 + 4).padStart(2, '0')}_C${String(columnGroup * 4 + 1).padStart(2, '0')}_C${String(columnGroup * 4 + 4).padStart(2, '0')}`;

const physicalProfile = (rowGroup, columnGroup) => {
  const xMin = worldX(columnGroup * 4);
  const xMax = worldX(columnGroup * 4 + 4);

  if (rowGroup === 0) {
    return {
      physicalRole: 'COASTAL_FOREGROUND_TERRAIN',
      realizationState: 'FULL_DETAIL_ACTIVE',
      worldBounds: { xMin, xMax, zMin: -125, zMax: -80 }
    };
  }
  if (rowGroup === 1) {
    return {
      physicalRole: 'COASTAL_TO_INLAND_TRANSITION_TERRAIN',
      realizationState: 'FULL_DETAIL_ACTIVE',
      worldBounds: { xMin, xMax, zMin: -210, zMax: -125 }
    };
  }
  if (rowGroup === 2) {
    return {
      physicalRole: 'SHORELINE_AND_WATER_REALIZATION',
      realizationState: 'SHORELINE_AND_WATER',
      worldBounds: { xMin, xMax, zMin: -80, zMax: 20 }
    };
  }
  if (columnGroup >= 2) {
    return {
      physicalRole: 'INLAND_ELEVATED_TERRAIN_WITH_PROXY_PARTITIONS',
      realizationState: 'FULL_DETAIL_WITH_PROXY_PARTITIONS',
      worldBounds: { xMin, xMax, zMin: -256, zMax: -210 }
    };
  }
  return {
    physicalRole: 'DISTANT_OFFSHORE_AND_ATMOSPHERIC_PROXY',
    realizationState: 'DISTANT_PROXY',
    worldBounds: { xMin, xMax, zMin: -320, zMax: -256 }
  };
};

const numberToken = (value) => String(value)
  .replace('-', 'NEG_')
  .replace('.', '_');

const edgeKey = (side, bounds) => {
  if (side === 'north' || side === 'south') {
    const z = side === 'north' ? bounds.zMin : bounds.zMax;
    return `H_EARTH_PHYSICAL_EDGE_Z_${numberToken(z)}_X_${numberToken(bounds.xMin)}_${numberToken(bounds.xMax)}`;
  }
  const x = side === 'west' ? bounds.xMin : bounds.xMax;
  return `H_EARTH_PHYSICAL_EDGE_X_${numberToken(x)}_Z_${numberToken(bounds.zMin)}_${numberToken(bounds.zMax)}`;
};

const group = (values, select) => {
  const result = new Map();
  values.forEach((value) => {
    const key = select(value);
    if (!result.has(key)) result.set(key, []);
    result.get(key).push(value);
  });
  return result;
};

function makeRawChunk(rowGroup, columnGroup, records) {
  const rowMin = rowGroup * 4 + 1;
  const rowMax = rowMin + 3;
  const columnMin = columnGroup * 4 + 1;
  const columnMax = columnMin + 3;
  const members = records.filter((record) =>
    record.row >= rowMin && record.row <= rowMax &&
    record.column >= columnMin && record.column <= columnMax
  ).sort((left, right) =>
    left.row - right.row || left.column - right.column);

  const regionGroups = group(members, (record) => record.regionId);
  const materialGroups = group(members, (record) => record.materialKey);
  const formationIds = [...new Set(
    members.flatMap(resolveHEarthFormationMembershipForAddress)
  )].sort();
  const profile = physicalProfile(rowGroup, columnGroup);
  const bounds = profile.worldBounds;

  const terrainMemberAddressIds = members
    .filter((record) => TERRAIN_REGION_IDS.has(record.regionId))
    .map((record) => record.address);
  const shorelineWaterMemberAddressIds = members
    .filter((record) => SHORELINE_WATER_REGION_IDS.has(record.regionId))
    .map((record) => record.address);
  const proxyMemberAddressIds = members
    .filter((record) => PROXY_REGION_IDS.has(record.regionId))
    .map((record) => record.address);

  return {
    chunkId: chunkId(rowGroup, columnGroup),
    rowGroup,
    columnGroup,
    addressRange: { rowMin, rowMax, columnMin, columnMax },
    memberAddressIds: members.map((record) => record.address),
    memberAddressCount: members.length,
    terrainMemberAddressIds,
    shorelineWaterMemberAddressIds,
    proxyMemberAddressIds,
    physicalRole: profile.physicalRole,
    worldBounds: bounds,
    regionProfilePartitions: [...regionGroups].map(([regionId, values]) => ({
      regionId,
      memberAddressIds: values.map((record) => record.address),
      primitiveIntents: [...new Set(values.map((record) => record.primitiveIntent))],
      surfaceFamilies: [...new Set(values.map((record) => record.surfaceFamily))]
    })),
    materialPartitions: [...materialGroups].map(([materialKey, values]) => ({
      materialKey,
      memberAddressIds: values.map((record) => record.address)
    })),
    formationIds,
    formationClasses: formationIds.map((id) =>
      Object.values(H_EARTH_TERRAIN_FORMATIONS)
        .find((formation) => formation.formationId === id)?.formationClass
    ).filter(Boolean),
    heightFieldProfileId: 'CANONICAL_TERRAIN_FIELD_REVISION_1',
    realizationLevel: 'FULL_FUNCTIONAL_PROOF',
    realizationState: profile.realizationState,
    lodState: 'LOD0_UNIFORM',
    sharedEdgeKeys: {
      north: edgeKey('north', bounds),
      south: edgeKey('south', bounds),
      west: edgeKey('west', bounds),
      east: edgeKey('east', bounds)
    },
    centerTerrainSample: profile.physicalRole.includes('TERRAIN')
      ? sampleHEarthTerrainField(
          (bounds.xMin + bounds.xMax) / 2,
          (bounds.zMin + bounds.zMax) / 2
        )
      : null,
    constructsGeometry: false
  };
}

const oppositeSide = {
  north: 'south',
  south: 'north',
  west: 'east',
  east: 'west'
};

function attachPhysicalNeighbors(rawChunks) {
  return rawChunks.map((chunk) => {
    const physicalNeighborChunkIds = {};
    for (const side of Object.keys(oppositeSide)) {
      const key = chunk.sharedEdgeKeys[side];
      const opposite = oppositeSide[side];
      const neighbor = rawChunks.find((candidate) =>
        candidate.chunkId !== chunk.chunkId &&
        candidate.sharedEdgeKeys[opposite] === key);
      physicalNeighborChunkIds[side] = neighbor?.chunkId ?? null;
    }
    return freeze({
      ...chunk,
      physicalNeighborChunkIds: freeze(physicalNeighborChunkIds)
    });
  });
}

export function buildHEarthLandscapeRealizationPlan({
  latticeMap = getHEarthLandscapeLatticeMap()
} = {}) {
  const records = Object.values(latticeMap ?? {});
  const issues = [];
  if (records.length !== 256) {
    issues.push(`SEMANTIC_ADDRESS_COUNT:${records.length}`);
  }

  const rawChunks = [];
  for (let rowGroup = 0; rowGroup < 4; rowGroup += 1) {
    for (let columnGroup = 0; columnGroup < 4; columnGroup += 1) {
      rawChunks.push(makeRawChunk(rowGroup, columnGroup, records));
    }
  }
  const chunks = attachPhysicalNeighbors(rawChunks);

  const allIds = chunks.flatMap((chunk) => chunk.memberAddressIds);
  const uniqueIds = new Set(allIds);
  if (chunks.length !== 16) {
    issues.push(`PHYSICAL_CHUNK_COUNT:${chunks.length}`);
  }
  if (allIds.length !== 256 || uniqueIds.size !== 256) {
    issues.push('ADDRESS_MEMBERSHIP_NOT_EXACTLY_ONCE');
  }
  if (chunks.some((chunk) => chunk.memberAddressCount !== 16)) {
    issues.push('CHUNK_MEMBER_COUNT_NOT_16');
  }

  const terrainIds = chunks.flatMap((chunk) => chunk.terrainMemberAddressIds);
  const shorelineWaterIds = chunks.flatMap(
    (chunk) => chunk.shorelineWaterMemberAddressIds);
  const proxyIds = chunks.flatMap((chunk) => chunk.proxyMemberAddressIds);
  const realizationPartitionIds = [
    ...terrainIds,
    ...shorelineWaterIds,
    ...proxyIds
  ];
  if (realizationPartitionIds.length !== 256 ||
      new Set(realizationPartitionIds).size !== 256) {
    issues.push('SEMANTIC_REALIZATION_PARTITIONS_NOT_DISJOINT_AND_EXHAUSTIVE');
  }
  if (terrainIds.length !== 124) {
    issues.push(`TERRAIN_ADDRESS_COUNT_EXPECTED_124_ACTUAL_${terrainIds.length}`);
  }
  if (shorelineWaterIds.length !== 96) {
    issues.push(`SHORELINE_WATER_ADDRESS_COUNT_EXPECTED_96_ACTUAL_${shorelineWaterIds.length}`);
  }
  if (proxyIds.length !== 36) {
    issues.push(`PROXY_ADDRESS_COUNT_EXPECTED_36_ACTUAL_${proxyIds.length}`);
  }

  const classes = new Set(chunks.flatMap((chunk) => chunk.formationClasses));
  [
    'HILL',
    'RIDGE_OR_BLUFF',
    'VALLEY_OR_DRAINAGE',
    'DISTANT_HIGHLAND_OR_MOUNTAIN'
  ].forEach((required) => {
    if (!classes.has(required)) {
      issues.push(`FORMATION_CLASS_NOT_PLANNED:${required}`);
    }
  });

  const terrainChunks = chunks.filter((chunk) =>
    chunk.terrainMemberAddressIds.length > 0 &&
    chunk.physicalRole.includes('TERRAIN'));
  if (terrainChunks.length !== 10) {
    issues.push(`TERRAIN_CHUNK_COUNT_EXPECTED_10_ACTUAL_${terrainChunks.length}`);
  }

  const core = {
    contractId: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
    terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId,
    semanticAddressCount: uniqueIds.size,
    terrainAddressCount: terrainIds.length,
    shorelineWaterAddressCount: shorelineWaterIds.length,
    proxyAddressCount: proxyIds.length,
    physicalChunkCount: chunks.length,
    terrainChunkCount: terrainChunks.length,
    chunkLayout: H_EARTH_LANDSCAPE_REALIZATION_PLANNER.chunkLayout,
    chunks
  };

  return freeze({
    ...core,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN_PASS'
      : 'FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN_FAIL',
    deterministicDigestAlgorithm: 'FNV1A_32_STABLE_SERIALIZATION',
    deterministicDigest: digest32(stable(core)),
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN =
  buildHEarthLandscapeRealizationPlan();

export function getHEarthFunctionalLandscapeRealizationReceipt() {
  const plan = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN;
  return freeze({
    receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6B_RECEIPT',
    contractId: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
    eligible: plan.eligible,
    status: plan.status,
    semanticAddressCount: plan.semanticAddressCount,
    terrainAddressCount: plan.terrainAddressCount,
    shorelineWaterAddressCount: plan.shorelineWaterAddressCount,
    proxyAddressCount: plan.proxyAddressCount,
    physicalChunkCount: plan.physicalChunkCount,
    terrainChunkCount: plan.terrainChunkCount,
    deterministicDigest: plan.deterministicDigest,
    formationClasses: [...new Set(
      plan.chunks.flatMap((chunk) => chunk.formationClasses)
    )].sort(),
    issues: plan.issues
  });
}
