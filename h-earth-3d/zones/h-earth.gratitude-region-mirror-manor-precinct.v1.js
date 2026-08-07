/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_v1
 *
 * Map-authoring precinct classifier for the renewed H-Earth world field.
 * It classifies terrain and reserved spatial systems only. It constructs no
 * manor, cavern interior, vault interior, navigation, or live water system.
 */

import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  sampleHEarthMapWideEnvironmentTerrainCandidate,
  isInsideHEarthReservedEstateEnvelope
} from '../terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_ID =
  'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_GRATITUDE_PRECINCT_v1';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT = freeze({
  precinctId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_ID,
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  successorRepairRevision: 3,
  estateSystem: {
    atriumAnchor: { x: 80, z: -172 },
    connectiveSaddle: { x: 112.41666666666667, z: -194.83333333333334 },
    largeHillInterface: { x: 136, z: -208 },
    hiddenVaultMassCenter: { x: 152, z: -224 },
    manorGeometryConstructed: false
  },
  hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  entryRegion: {
    bounds: { xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88 },
    activeArrival: { waypointId: 'COAST', x: 0, z: -96 },
    status: 'SEPARATE_AND_REGIONALLY_CONNECTED'
  },
  environmentalBands: {
    beachMaximumElevation: 5.5,
    coastToLowlandMaximumElevation: 10,
    meadowMaximumElevation: 28,
    uplandMaximumElevation: 44,
    highlandStartsAtElevation: 44
  },
  limitations: [
    'NO_MANOR_GEOMETRY',
    'NO_CAVERN_INTERIOR',
    'NO_VAULT_INTERIOR',
    'NO_LIVE_WATER_SYSTEM_MUTATION',
    'NO_LIVE_CAMERA_NAVIGATION_OR_RUNTIME_MUTATION'
  ]
});

function inside(bounds, x, z) {
  return x >= bounds.xMinimum && x <= bounds.xMaximum &&
    z >= bounds.zMinimum && z <= bounds.zMaximum;
}

function proximity(x, z, centerX, centerZ, innerRadius, outerRadius) {
  const distance = Math.hypot(x - centerX, z - centerZ);
  return 1 - smoothstep(innerRadius, outerRadius, distance);
}

export function classifyHEarthMapWideEnvironmentPrecinct(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return 'INVALID';
  const terrain = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  if (terrain?.valid !== true) return 'INVALID';
  const zoneWeights = terrain.sitePreparation?.zoneWeights ?? {};
  const hydro = terrain.hydrology ?? {};
  const precinct = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT;

  if (hydro.reservoirWeight > 0.12) return 'ENCLOSED_RESERVOIR_BASIN';
  if (hydro.waterfallWeight > 0.22) return 'WATERFALL_GORGE';
  if (hydro.cavernReserveWeight > 0.22) return 'CAVERN_APPROACH_RESERVE';
  if ((zoneWeights.atrium ?? 0) > 0.18) return 'ESTATE_ATRIUM_CROWN';
  if ((zoneWeights.hillInterface ?? 0) > 0.18) return 'ESTATE_LARGE_HILL_INTERFACE';
  if ((zoneWeights.connectiveSpine ?? 0) > 0.18 || isInsideHEarthReservedEstateEnvelope(worldX, worldZ)) {
    return 'ESTATE_CONNECTIVE_CONTEXT';
  }
  if (inside(precinct.entryRegion.bounds, worldX, worldZ)) return 'ENTRY_REGION';
  if (worldZ <= -246 || terrain.rearBoundaryBarrierOffset > 1) return 'MOUNTAIN_BARRIER';
  if (worldZ >= -138) return 'COASTAL_APPROACH';
  return 'CONTINUOUS_INTERIOR';
}

export function sampleHEarthMapWideEnvironmentPrecinct(worldX, worldZ) {
  const terrain = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  if (terrain?.valid !== true) {
    return freeze({
      valid: false,
      status: 'H_EARTH_MAP_WIDE_PRECINCT_SAMPLE_REJECTED',
      worldX,
      worldZ,
      terrain
    });
  }

  const presentationElevation = terrain.presentationElevation;
  const classId = classifyHEarthMapWideEnvironmentPrecinct(worldX, worldZ);
  const estateContext = Math.max(
    proximity(worldX, worldZ, 80, -172, 16, 86),
    proximity(worldX, worldZ, 112.41666666666667, -194.83333333333334, 12, 62),
    proximity(worldX, worldZ, 136, -208, 16, 72)
  );
  const coastal = smoothstep(-154, -76, worldZ);
  const highland = smoothstep(30, 58, presentationElevation);
  const lowland = 1 - smoothstep(9, 31, presentationElevation);
  const meadow = clamp01(1 - Math.abs(presentationElevation - 22) / 26);
  const formerInundation = clamp01(coastal * (1 - smoothstep(5, 15, presentationElevation)));
  const mountainBarrier = clamp01((1 - smoothstep(-246, -214, worldZ)) * smoothstep(24, 62, presentationElevation));
  const woodland = clamp01(
    (1 - highland * 0.62) *
    (1 - lowland * 0.40) *
    (0.44 + 0.36 * estateContext) *
    (1 - formerInundation * 0.38)
  );

  return freeze({
    valid: true,
    status: 'H_EARTH_MAP_WIDE_PRECINCT_SAMPLE_COMPLETE',
    precinctId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_ID,
    classId,
    worldX,
    worldZ,
    terrain,
    environmentalWeights: {
      lowland,
      meadow,
      woodland,
      highland,
      coastal,
      formerInundation,
      mountainBarrier,
      estateContext
    },
    manorGeometryConstructed: false,
    cavernInteriorConstructed: false,
    vaultInteriorConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentPrecinct() {
  const witnesses = [
    [80, -172, 'ESTATE_ATRIUM_CROWN'],
    [112.41666666666667, -194.83333333333334, 'ESTATE_CONNECTIVE_CONTEXT'],
    [136, -208, 'ESTATE_LARGE_HILL_INTERFACE'],
    [-44, -216, 'ENCLOSED_RESERVOIR_BASIN'],
    [-48, -250, 'WATERFALL_GORGE'],
    [-16, -236, 'CAVERN_APPROACH_RESERVE'],
    [0, -96, 'ENTRY_REGION'],
    [-64, -300, 'MOUNTAIN_BARRIER']
  ].map(([x, z, expected]) => ({ expected, sample: sampleHEarthMapWideEnvironmentPrecinct(x, z) }));

  const issues = [];
  if (witnesses.some(({ sample }) => sample.valid !== true)) issues.push('PRECINCT_WITNESS_INVALID');
  for (const witness of witnesses) {
    if (witness.sample.classId !== witness.expected) {
      issues.push(`PRECINCT_CLASSIFICATION_FAILED:${witness.expected}:${witness.sample.classId}`);
    }
  }
  if (witnesses.some(({ sample }) => sample.manorGeometryConstructed !== false || sample.cavernInteriorConstructed !== false || sample.vaultInteriorConstructed !== false)) {
    issues.push('DEFERRED_GEOMETRY_SCOPE_VIOLATION');
  }

  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_EVALUATION_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    successorRepairRevision: 3,
    witnessCount: witnesses.length,
    witnesses,
    issues: freeze(issues)
  });
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT;
