/**
 * /h-earth-3d/terrain/h-earth.terrain-formations.js
 *
 * H_EARTH_TERRAIN_FORMATIONS_RUN_6B_v2
 *
 * Durable geographic-formation identities aligned to existing lattice region
 * semantics. The records define membership and envelopes only; they create no
 * vertices, chunks, proxies, admission, or rendering. OW02 adds the articulated
 * inland range, pass, basin and foothill identities without replacing the
 * previously qualified coastal or local formation truths. OW03 adds explicit
 * compound-coast identities for the Gratitude continent's peninsulas, bays,
 * gulf and headlands without replacing the OW02 watershed system.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};

export const H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID =
  'H_EARTH_TERRAIN_FORMATIONS_RUN_6B_v2_LATTICE_SEMANTIC_ALIGNMENT';

const formation = ({
  formationId,
  formationClass,
  addressPartitions,
  worldBounds,
  elevationEnvelope,
  heightProfileReference,
  fullRealizationEligibility,
  proxyRealizationEligibility,
  navigationClass
}) => deepFreeze({
  formationId,
  formationClass,
  addressPartitions,
  worldBounds,
  elevationEnvelope,
  heightProfileReference,
  fullRealizationEligibility,
  proxyRealizationEligibility,
  navigationClass,
  generationRevision: 2,
  replacesSemanticAddressIdentity: false,
  createsGeometry: false
});

export const H_EARTH_TERRAIN_FORMATIONS = deepFreeze({
  GRATITUDE_WESTERN_PENINSULA_001: formation({
    formationId: 'H_EARTH_GRATITUDE_WESTERN_PENINSULA_001',
    formationClass: 'CONTINENTAL_PENINSULA',
    addressPartitions: [
      { rows: [4, 8], columns: [1, 4] }
    ],
    worldBounds: { xMin: -250, xMax: -190, zMin: -145, zMax: -48 },
    elevationEnvelope: { minimum: -1, maximum: 20 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_WESTERN_GULF_001: formation({
    formationId: 'H_EARTH_GRATITUDE_WESTERN_GULF_001',
    formationClass: 'CONTINENTAL_GULF',
    addressPartitions: [
      { rows: [4, 9], columns: [3, 7] }
    ],
    worldBounds: { xMin: -200, xMax: -140, zMin: -164, zMax: -72 },
    elevationEnvelope: { minimum: -3, maximum: 16 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_CENTRAL_HEADLAND_001: formation({
    formationId: 'H_EARTH_GRATITUDE_CENTRAL_HEADLAND_001',
    formationClass: 'CONTINENTAL_HEADLAND',
    addressPartitions: [
      { rows: [4, 8], columns: [6, 9] }
    ],
    worldBounds: { xMin: -149, xMax: -101, zMin: -141, zMax: -57 },
    elevationEnvelope: { minimum: -1, maximum: 24 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_SANCTUARY_BAY_001: formation({
    formationId: 'H_EARTH_GRATITUDE_SANCTUARY_BAY_001',
    formationClass: 'CONTINENTAL_BAY',
    addressPartitions: [
      { rows: [4, 9], columns: [8, 11] }
    ],
    worldBounds: { xMin: -106, xMax: -58, zMin: -157, zMax: -72 },
    elevationEnvelope: { minimum: -3, maximum: 18 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_HARBOR_HEADLAND_001: formation({
    formationId: 'H_EARTH_GRATITUDE_HARBOR_HEADLAND_001',
    formationClass: 'CONTINENTAL_HEADLAND',
    addressPartitions: [
      { rows: [4, 8], columns: [10, 12] }
    ],
    worldBounds: { xMin: 36, xMax: 86, zMin: -139, zMax: -55 },
    elevationEnvelope: { minimum: -1, maximum: 22 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_BAY_001: formation({
    formationId: 'H_EARTH_GRATITUDE_BAY_001',
    formationClass: 'CONTINENTAL_BAY',
    addressPartitions: [
      { rows: [4, 10], columns: [11, 16] }
    ],
    worldBounds: { xMin: 36, xMax: 200, zMin: -181, zMax: -69 },
    elevationEnvelope: { minimum: -3, maximum: 22 },
    heightProfileReference: 'GRATITUDE_TRUE_CONTINENTAL_COASTAL_ENTRY_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  GRATITUDE_EASTERN_PENINSULA_001: formation({
    formationId: 'H_EARTH_GRATITUDE_EASTERN_PENINSULA_001',
    formationClass: 'CONTINENTAL_PENINSULA',
    addressPartitions: [
      { rows: [4, 8], columns: [14, 16] }
    ],
    worldBounds: { xMin: 208, xMax: 256, zMin: -139, zMax: -49 },
    elevationEnvelope: { minimum: -1, maximum: 24 },
    heightProfileReference: 'GRATITUDE_COMPOUND_COAST_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_COAST'
  }),
  COASTAL_BERM_001: formation({
    formationId: 'H_EARTH_COASTAL_BERM_001',
    formationClass: 'COASTAL_BERM_OR_DUNE',
    addressPartitions: [
      { rows: [5, 7], columns: [1, 16] }
    ],
    worldBounds: { xMin: -256, xMax: 256, zMin: -148, zMax: -94 },
    elevationEnvelope: { minimum: -0.5, maximum: 9 },
    heightProfileReference: 'COASTAL_BERM_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: false,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  LOWLAND_001: formation({
    formationId: 'H_EARTH_LOWLAND_001',
    formationClass: 'LOWLAND',
    addressPartitions: [
      { rows: [5, 7], columns: [1, 8] }
    ],
    worldBounds: { xMin: -176, xMax: -18, zMin: -210, zMax: -125 },
    elevationEnvelope: { minimum: -4, maximum: 12 },
    heightProfileReference: 'LOWLAND_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  HILL_001: formation({
    formationId: 'H_EARTH_NAVIGABLE_HILL_001',
    formationClass: 'HILL',
    addressPartitions: [
      { rows: [5, 7], columns: [9, 13] }
    ],
    worldBounds: { xMin: 18, xMax: 132, zMin: -210, zMax: -125 },
    elevationEnvelope: { minimum: 2, maximum: 42 },
    heightProfileReference: 'NAVIGABLE_HILL_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  RIDGE_001: formation({
    formationId: 'H_EARTH_RIDGE_BLUFF_001',
    formationClass: 'RIDGE_OR_BLUFF',
    addressPartitions: [
      { rows: [14, 15], columns: [13, 16] }
    ],
    worldBounds: { xMin: 96, xMax: 224, zMin: -256, zMax: -210 },
    elevationEnvelope: { minimum: 10, maximum: 64 },
    heightProfileReference: 'RIDGE_BLUFF_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_BOUNDED_SLOPE'
  }),
  VALLEY_001: formation({
    formationId: 'H_EARTH_DRAINAGE_VALLEY_001',
    formationClass: 'VALLEY_OR_DRAINAGE',
    addressPartitions: [
      { rows: [5, 7], columns: [6, 10] }
    ],
    worldBounds: { xMin: -54, xMax: 52, zMin: -210, zMax: -128 },
    elevationEnvelope: { minimum: -12, maximum: 18 },
    heightProfileReference: 'DRAINAGE_VALLEY_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: false,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  GRATITUDE_INLAND_RANGE_001: formation({
    formationId: 'H_EARTH_GRATITUDE_INLAND_RANGE_001',
    formationClass: 'INLAND_MOUNTAIN_RANGE',
    addressPartitions: [
      { rows: [11, 16], columns: [2, 16] }
    ],
    worldBounds: { xMin: -126, xMax: 222, zMin: -254, zMax: -176 },
    elevationEnvelope: { minimum: 8, maximum: 112 },
    heightProfileReference: 'GRATITUDE_INLAND_MULTI_RIDGE_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_MIXED_NAVIGABLE_AND_BOUNDED_SLOPE'
  }),
  GRATITUDE_PASS_EAST_001: formation({
    formationId: 'H_EARTH_GRATITUDE_PASS_EAST_001',
    formationClass: 'MOUNTAIN_PASS',
    addressPartitions: [
      { rows: [13, 16], columns: [11, 14] }
    ],
    worldBounds: { xMin: 94, xMax: 142, zMin: -252, zMax: -202 },
    elevationEnvelope: { minimum: 12, maximum: 58 },
    heightProfileReference: 'GRATITUDE_MOUNTAIN_PASS_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: false,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_PASS'
  }),
  GRATITUDE_PASS_CENTRAL_001: formation({
    formationId: 'H_EARTH_GRATITUDE_PASS_CENTRAL_001',
    formationClass: 'MOUNTAIN_PASS',
    addressPartitions: [
      { rows: [13, 16], columns: [8, 11] }
    ],
    worldBounds: { xMin: 28, xMax: 76, zMin: -255, zMax: -204 },
    elevationEnvelope: { minimum: 10, maximum: 54 },
    heightProfileReference: 'GRATITUDE_MOUNTAIN_PASS_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: false,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE_PASS'
  }),
  GRATITUDE_RECEIVING_BASIN_001: formation({
    formationId: 'H_EARTH_GRATITUDE_RECEIVING_BASIN_001',
    formationClass: 'WATERSHED_RECEIVING_BASIN',
    addressPartitions: [
      { rows: [9, 13], columns: [5, 11] }
    ],
    worldBounds: { xMin: -58, xMax: 92, zMin: -228, zMax: -148 },
    elevationEnvelope: { minimum: -8, maximum: 28 },
    heightProfileReference: 'GRATITUDE_RECEIVING_BASIN_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: false,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  GRATITUDE_FOOTHILL_TRANSITION_001: formation({
    formationId: 'H_EARTH_GRATITUDE_FOOTHILL_TRANSITION_001',
    formationClass: 'FOOTHILL_TRANSITION',
    addressPartitions: [
      { rows: [8, 13], columns: [1, 12] }
    ],
    worldBounds: { xMin: -168, xMax: 116, zMin: -224, zMax: -132 },
    elevationEnvelope: { minimum: 2, maximum: 42 },
    heightProfileReference: 'GRATITUDE_FOOTHILL_TAPER_PROFILE_v1',
    fullRealizationEligibility: true,
    proxyRealizationEligibility: true,
    navigationClass: 'GROUND_OBSERVER_NAVIGABLE'
  }),
  DISTANT_HIGHLAND_001: formation({
    formationId: 'H_EARTH_DISTANT_HIGHLAND_001',
    formationClass: 'DISTANT_HIGHLAND_OR_MOUNTAIN',
    addressPartitions: [
      { rows: [14, 15], columns: [1, 10] },
      { rows: [16, 16], columns: [1, 16] }
    ],
    worldBounds: { xMin: -224, xMax: 32, zMin: -292, zMax: -236 },
    elevationEnvelope: { minimum: 28, maximum: 108 },
    heightProfileReference: 'DISTANT_HIGHLAND_PROXY_PROFILE_v1',
    fullRealizationEligibility: false,
    proxyRealizationEligibility: true,
    navigationClass: 'NON_NAVIGABLE_PROXY_ONLY'
  })
});

export function getHEarthTerrainFormation(formationId) {
  return Object.values(H_EARTH_TERRAIN_FORMATIONS)
    .find((entry) => entry.formationId === formationId) ?? null;
}

const partitionContainsAddress = (partition, addressRecord) => {
  const [rowMin, rowMax] = partition.rows;
  const [columnMin, columnMax] = partition.columns;
  return addressRecord.row >= rowMin && addressRecord.row <= rowMax &&
    addressRecord.column >= columnMin && addressRecord.column <= columnMax;
};

export function resolveHEarthFormationMembershipForAddress(addressRecord) {
  if (!addressRecord || !Number.isInteger(addressRecord.row) ||
    !Number.isInteger(addressRecord.column)) {
    return deepFreeze([]);
  }
  return deepFreeze(
    Object.values(H_EARTH_TERRAIN_FORMATIONS)
      .filter((entry) => entry.addressPartitions.some(
        (partition) => partitionContainsAddress(partition, addressRecord)
      ))
      .map((entry) => entry.formationId)
  );
}

export function evaluateHEarthTerrainFormations() {
  const values = Object.values(H_EARTH_TERRAIN_FORMATIONS);
  const classes = new Set(values.map((entry) => entry.formationClass));
  const required = [
    'CONTINENTAL_PENINSULA',
    'CONTINENTAL_BAY',
    'CONTINENTAL_GULF',
    'CONTINENTAL_HEADLAND',
    'HILL',
    'RIDGE_OR_BLUFF',
    'VALLEY_OR_DRAINAGE',
    'DISTANT_HIGHLAND_OR_MOUNTAIN',
    'INLAND_MOUNTAIN_RANGE',
    'MOUNTAIN_PASS',
    'WATERSHED_RECEIVING_BASIN',
    'FOOTHILL_TRANSITION'
  ];
  const issues = required
    .filter((formationClass) => !classes.has(formationClass))
    .map((formationClass) => `MISSING_FORMATION_CLASS:${formationClass}`);

  for (const entry of values) {
    if (!Array.isArray(entry.addressPartitions) ||
      entry.addressPartitions.length === 0) {
      issues.push(`FORMATION_ADDRESS_PARTITIONS_MISSING:${entry.formationId}`);
    }
  }

  return deepFreeze({
    contractId: H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'TERRAIN_FORMATIONS_PASS'
      : 'TERRAIN_FORMATIONS_FAIL',
    formationCount: values.length,
    issues
  });
}
