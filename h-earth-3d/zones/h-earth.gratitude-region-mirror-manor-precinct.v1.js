/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_v1
 *
 * Environmental precinct classifier for the map-wide redevelopment candidate.
 * The historical path name is preserved by the admitted 28-path scope, but this
 * module constructs no manor geometry, architecture, foundation, entrance,
 * garden, or sculpture placement.
 */

import {
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
  reservedEstateEnvelope: {
    center: { x: 80, z: -172 },
    bounds: { xMinimum: 64, xMaximum: 96, zMinimum: -188, zMaximum: -156 },
    constructionStatus: 'RESERVED_ONLY',
    manorGeometryConstructed: false
  },
  entryRegion: {
    bounds: { xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88 },
    activeArrival: { waypointId: 'COAST', x: 0, z: -96 },
    status: 'SEPARATE_AND_REGIONALLY_CONNECTED'
  },
  twoHillRelation: {
    leftHill: { x: 76, z: -168 },
    rightHill: { x: 152, z: -224 },
    saddle: { x: 112.41666666666667, z: -194.83333333333334 }
  },
  environmentalBands: {
    coastToLowlandMaximumElevation: 8,
    meadowMaximumElevation: 26,
    uplandMaximumElevation: 42,
    highlandStartsAtElevation: 42
  },
  limitations: [
    'NO_MANOR_GEOMETRY',
    'NO_FOUNDATION_OR_GRADING',
    'NO_FRONTIER_PLAINS_CONSTRUCTION',
    'NO_CAVERN_INTERIOR_CONSTRUCTION',
    'NO_WATER_CAMERA_NAVIGATION_OR_LIVE_RUNTIME_MUTATION'
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
  const precinct = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT;
  if (inside(precinct.entryRegion.bounds, worldX, worldZ)) return 'ENTRY_REGION';
  if (isInsideHEarthReservedEstateEnvelope(worldX, worldZ)) return 'RESERVED_ESTATE_CORE';
  if (proximity(worldX, worldZ, 80, -172, 20, 60) > 0) return 'ESTATE_CONTEXT';
  if (worldZ <= -246) return 'MOUNTAINWARD_HIGHLAND';
  if (worldZ >= -104) return 'COASTAL_APPROACH';
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
  const estateContext = proximity(worldX, worldZ, 80, -172, 18, 76);
  const highland = smoothstep(28, 52, presentationElevation);
  const lowland = 1 - smoothstep(10, 30, presentationElevation);
  const meadow = clamp01(1 - Math.abs(presentationElevation - 22) / 24);
  const woodland = clamp01(
    (1 - highland * 0.65) *
    (1 - lowland * 0.45) *
    (0.46 + 0.34 * estateContext)
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
      estateContext
    },
    manorGeometryConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentPrecinct() {
  const witnesses = [
    [80, -172],
    [0, -96],
    [112.41666666666667, -194.83333333333334],
    [-64, -274],
    [196, -252],
    [-140, -180]
  ].map(([x, z]) => sampleHEarthMapWideEnvironmentPrecinct(x, z));
  const issues = [];
  if (witnesses.some((sample) => sample.valid !== true)) issues.push('PRECINCT_WITNESS_INVALID');
  if (witnesses[0]?.classId !== 'RESERVED_ESTATE_CORE') issues.push('ESTATE_CORE_CLASSIFICATION_FAILED');
  if (witnesses[1]?.classId !== 'ENTRY_REGION') issues.push('ENTRY_REGION_CLASSIFICATION_FAILED');
  if (witnesses.some((sample) => sample.manorGeometryConstructed !== false)) issues.push('MANOR_SCOPE_VIOLATION');
  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT_EVALUATION_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    witnessCount: witnesses.length,
    witnesses,
    issues: freeze(issues)
  });
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PRECINCT;
