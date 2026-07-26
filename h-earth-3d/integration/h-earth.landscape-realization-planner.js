/**
 * /h-earth-3d/integration/h-earth.landscape-realization-planner.js
 * H_EARTH_LANDSCAPE_REALIZATION_PLANNER_RUN_6B_v1
 * Descriptor-only bridge from the existing 256-address lattice to sixteen
 * fixed 4x4 physical realization descriptors.
 */
import { getHEarthLandscapeLatticeMap } from '../zones/ground-cell-001.landscape-lattice.js';
import { H_EARTH_TERRAIN_FIELD, sampleHEarthTerrainField } from '../terrain/h-earth.terrain-field.js';
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
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID =
  'H_EARTH_LANDSCAPE_REALIZATION_PLANNER_RUN_6B_v1';

export const H_EARTH_LANDSCAPE_REALIZATION_PLANNER = freeze({
  contractId: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
  semanticAddressCountRequired: 256,
  physicalChunkCountRequired: 16,
  chunkLayout: 'FIXED_4_BY_4_ADDRESS_GROUPS',
  adjacentLodVariation: false,
  uniformSharedBoundaryResolution: true,
  owns: {
    addressParticipation: true,
    addressGrouping: true,
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

const worldX = (columnBoundary) => -256 + (columnBoundary / 16) * 512;
const worldZ = (rowBoundary) => -256 + (rowBoundary / 16) * 320;
const chunkId = (r, c) =>
  `H_EARTH_LANDSCAPE_CHUNK_R${String(r * 4 + 1).padStart(2, '0')}_R${String(r * 4 + 4).padStart(2, '0')}_C${String(c * 4 + 1).padStart(2, '0')}_C${String(c * 4 + 4).padStart(2, '0')}`;
const edgeKey = (side, r, c) => {
  if (side === 'north' || side === 'south') {
    const boundary = side === 'north' ? r * 4 : r * 4 + 4;
    return `H_EARTH_TERRAIN_EDGE_ROW_${String(boundary).padStart(2, '0')}_COLGROUP_${c}`;
  }
  const boundary = side === 'west' ? c * 4 : c * 4 + 4;
  return `H_EARTH_TERRAIN_EDGE_COLUMN_${String(boundary).padStart(2, '0')}_ROWGROUP_${r}`;
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

function makeChunk(r, c, records) {
  const rowMin = r * 4 + 1;
  const rowMax = rowMin + 3;
  const columnMin = c * 4 + 1;
  const columnMax = columnMin + 3;
  const members = records.filter((record) =>
    record.row >= rowMin && record.row <= rowMax &&
    record.column >= columnMin && record.column <= columnMax
  ).sort((a, b) => a.row - b.row || a.column - b.column);
  const regionGroups = group(members, (record) => record.regionId);
  const materialGroups = group(members, (record) => record.materialKey);
  const formationIds = [...new Set(
    members.flatMap(resolveHEarthFormationMembershipForAddress)
  )].sort();
  const bounds = freeze({
    xMin: worldX(c * 4),
    xMax: worldX(c * 4 + 4),
    zMin: worldZ(r * 4),
    zMax: worldZ(r * 4 + 4)
  });

  return freeze({
    chunkId: chunkId(r, c),
    rowGroup: r,
    columnGroup: c,
    addressRange: { rowMin, rowMax, columnMin, columnMax },
    memberAddressIds: members.map((record) => record.address),
    memberAddressCount: members.length,
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
    realizationState: members.every((record) => record.horizonBand === true)
      ? 'ATMOSPHERIC_OR_PROXY'
      : 'FULL_DETAIL_ACTIVE',
    lodState: 'LOD0_UNIFORM',
    sharedEdgeKeys: {
      north: edgeKey('north', r, c),
      south: edgeKey('south', r, c),
      west: edgeKey('west', r, c),
      east: edgeKey('east', r, c)
    },
    neighborChunkIds: {
      north: r > 0 ? chunkId(r - 1, c) : null,
      south: r < 3 ? chunkId(r + 1, c) : null,
      west: c > 0 ? chunkId(r, c - 1) : null,
      east: c < 3 ? chunkId(r, c + 1) : null
    },
    centerTerrainSample: sampleHEarthTerrainField(
      (bounds.xMin + bounds.xMax) / 2,
      (bounds.zMin + bounds.zMax) / 2
    ),
    constructsGeometry: false
  });
}

export function buildHEarthLandscapeRealizationPlan({
  latticeMap = getHEarthLandscapeLatticeMap()
} = {}) {
  const records = Object.values(latticeMap ?? {});
  const issues = [];
  if (records.length !== 256) issues.push(`SEMANTIC_ADDRESS_COUNT:${records.length}`);

  const chunks = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) chunks.push(makeChunk(r, c, records));
  }

  const allIds = chunks.flatMap((chunk) => chunk.memberAddressIds);
  const uniqueIds = new Set(allIds);
  if (chunks.length !== 16) issues.push(`PHYSICAL_CHUNK_COUNT:${chunks.length}`);
  if (allIds.length !== 256 || uniqueIds.size !== 256) {
    issues.push('ADDRESS_MEMBERSHIP_NOT_EXACTLY_ONCE');
  }
  if (chunks.some((chunk) => chunk.memberAddressCount !== 16)) {
    issues.push('CHUNK_MEMBER_COUNT_NOT_16');
  }

  const classes = new Set(chunks.flatMap((chunk) => chunk.formationClasses));
  [
    'HILL',
    'RIDGE_OR_BLUFF',
    'VALLEY_OR_DRAINAGE',
    'DISTANT_HIGHLAND_OR_MOUNTAIN'
  ].forEach((required) => {
    if (!classes.has(required)) issues.push(`FORMATION_CLASS_NOT_PLANNED:${required}`);
  });

  const core = {
    contractId: H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
    terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId,
    semanticAddressCount: uniqueIds.size,
    physicalChunkCount: chunks.length,
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
    physicalChunkCount: plan.physicalChunkCount,
    deterministicDigest: plan.deterministicDigest,
    formationClasses: [...new Set(
      plan.chunks.flatMap((chunk) => chunk.formationClasses)
    )].sort(),
    issues: plan.issues
  });
}
