/**
 * /showroom/globe/h-earth/render/geometry-shoreline.js
 *
 * C3C1 3D coastal-corner shoreline provider. The shoreline remains fully 3D;
 * only its horizontal planform changes from a single z=f(x) graph to one
 * continuous north-to-east coastal path. Elevation continues to come from the
 * canonical terrain field.
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
  getHEarthCanonicalShorelineZ,
  getHEarthCanonicalEasternShorelineX,
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const CP3D_CANONICAL_SCALE = 2 ** 24;
const CP3D_CANONICAL_SHORELINE_BANDS = new Set(['DRY_SAND_EDGE', 'DAMP_TRANSITION']);
const VISUAL_OCEAN_CONTINUATION_OFFSET = -1600;

function canonicalize(value) {
  const result = Math.round(value * CP3D_CANONICAL_SCALE) / CP3D_CANONICAL_SCALE;
  return Object.is(result, -0) ? 0 : result;
}
function canonicalizePoint(point, bandId) {
  if (!CP3D_CANONICAL_SHORELINE_BANDS.has(bandId)) return point;
  return { ...point, x: canonicalize(point.x), y: canonicalize(point.y), z: canonicalize(point.z) };
}

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_C3C1_NORTHEAST_COASTAL_CORNER_v1';

export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS = freeze([
  { bandId: 'DRY_SAND_EDGE', innerOffset: 34, outerOffset: 14, materialReference: 'H_EARTH_MATERIAL_DRY_SAND', materialIntent: 'DRY_SAND' },
  { bandId: 'DAMP_TRANSITION', innerOffset: 14, outerOffset: 4, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'DAMP_SAND_TRANSITION' },
  { bandId: 'WET_SAND', innerOffset: 4, outerOffset: 0, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'WET_SAND' },
  { bandId: 'FOAM_CONTACT', innerOffset: 0, outerOffset: -3.2, materialReference: 'H_EARTH_MATERIAL_FOAM', materialIntent: 'FOAM_CONTACT' },
  { bandId: 'SHALLOW_WATER', innerOffset: -3.2, outerOffset: -22, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'SHALLOW_WATER' },
  { bandId: 'NEARSHORE_WATER', innerOffset: -22, outerOffset: -58, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'NEARSHORE_WATER' },
  { bandId: 'OPEN_WATER', innerOffset: -58, outerOffset: VISUAL_OCEAN_CONTINUATION_OFFSET, materialReference: 'H_EARTH_MATERIAL_OPEN_WATER', materialIntent: 'OPEN_WATER_VISUAL_WORLD_CONTINUATION' }
]);

function buildCoastalCenterline() {
  const points = [];
  const northCount = 193;
  const northMinX = -1024;
  const seamX = 198;
  for (let i = 0; i < northCount; i += 1) {
    const x = lerp(northMinX, seamX, i / (northCount - 1));
    points.push({ x, z: getHEarthCanonicalShorelineZ(x), segment: 'NORTH' });
  }

  const seamZ = getHEarthCanonicalShorelineZ(seamX);
  const apexX = 232;
  const apexZ = -64.475;
  const cornerCount = 25;
  for (let i = 1; i < cornerCount; i += 1) {
    const t = i / (cornerCount - 1);
    const e = smooth(t);
    const x = lerp(seamX, apexX, e) + 3.5 * Math.sin(Math.PI * t) * Math.sin(Math.PI * t);
    const z = lerp(seamZ, apexZ, e) + 2.5 * Math.sin(Math.PI * t);
    points.push({ x, z, segment: 'CORNER' });
  }

  const eastCount = 97;
  const southZ = -1024;
  for (let i = 1; i < eastCount; i += 1) {
    const z = lerp(apexZ, southZ, i / (eastCount - 1));
    points.push({ x: getHEarthCanonicalEasternShorelineX(z), z, segment: 'EAST' });
  }
  return points;
}

const CENTERLINE = freeze(buildCoastalCenterline());

function tangentAt(index) {
  const previous = CENTERLINE[Math.max(0, index - 1)];
  const next = CENTERLINE[Math.min(CENTERLINE.length - 1, index + 1)];
  const dx = next.x - previous.x;
  const dz = next.z - previous.z;
  const length = Math.hypot(dx, dz) || 1;
  return { x: dx / length, z: dz / length };
}

function pointAtOffset(index, offset) {
  const coast = CENTERLINE[index];
  const tangent = tangentAt(index);
  // Path runs west->east along the north coast, then south down the east coast.
  // Its left normal therefore points consistently toward open ocean.
  const outward = { x: -tangent.z, z: tangent.x };
  const worldX = coast.x - outward.x * offset;
  const worldZ = coast.z - outward.z * offset;
  const sample = sampleHEarthTerrainField(worldX, worldZ);
  const waterward = offset <= 0;
  return {
    x: worldX,
    y: waterward
      ? H_EARTH_TERRAIN_FIELD.worldDomain.seaLevelY + (offset >= -3.2 ? 0.035 : 0.015)
      : sample.elevation,
    z: worldZ,
    sample,
    segment: coast.segment
  };
}

function constructBand(band) {
  const vertices = [];
  const indices = [];
  const sourceSampleIds = [];

  for (let index = 0; index < CENTERLINE.length; index += 1) {
    const inner = canonicalizePoint(pointAtOffset(index, band.innerOffset), band.bandId);
    const outer = canonicalizePoint(pointAtOffset(index, band.outerOffset), band.bandId);
    vertices.push(createHEarthVector3(inner.x, inner.y, inner.z), createHEarthVector3(outer.x, outer.y, outer.z));
    sourceSampleIds.push(`H_EARTH_C3C1_COASTAL_SAMPLE_${String(index).padStart(3, '0')}`);
  }

  for (let index = 0; index < CENTERLINE.length - 1; index += 1) {
    const a = index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }

  const primitiveId = `H_EARTH_FUNCTIONAL_SHORELINE:${band.bandId}`;
  const visualContinuation = band.bandId === 'OPEN_WATER';
  const construction = constructHEarthTriangleMesh({
    primitiveId,
    geometryId: `${primitiveId}:GEOMETRY`,
    primitiveType: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.primitiveType.TRIANGLE_MESH,
    vertices,
    indices,
    normalMode: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.normalMode.FACE_AND_VERTEX,
    expectedClosure: H_EARTH_3D_GEOMETRY_SOUTH_ENUMS.expectedClosure.OPEN_ALLOWED,
    semanticRole: `FUNCTIONAL_SHORELINE_${band.bandId}`,
    materialHint: freeze({ materialReference: band.materialReference, materialIntent: band.materialIntent }),
    source: freeze({ sourceType: 'H_EARTH_C3C1_COMPOUND_COASTAL_CENTERLINE', terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId: band.bandId,
      sourceBoundaryId: 'H_EARTH_C3C1_NORTHEAST_COASTAL_CORNER',
      sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
      innerOffset: band.innerOffset,
      outerOffset: band.outerOffset,
      sourceSampleIds,
      sampleCount: CENTERLINE.length,
      topologyLaw: 'CONTINUOUS_PARAMETRIC_NORTH_TO_EAST_COAST_WITH_OUTWARD_NORMAL_OFFSETS',
      waterSurfaceLaw: band.outerOffset <= 0 ? 'ONE_COHERENT_SEA_LEVEL_SURFACE' : 'CANONICAL_TERRAIN_FIELD',
      visualContinuationLayer: visualContinuation,
      primaryOceanExposure: '+Z_NORTH',
      secondaryOceanExposure: '+X_EAST',
      inlandReliefMutationAuthorized: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      oceanFacingLandProhibited: visualContinuation,
      continuationLaw: visualContinuation ? 'OPEN_WATER_FOLLOWS_NORTH_AND_EAST_CONTINENTAL_EDGES_BEYOND_FROZEN_ACCESSIBLE_REGION' : null,
      foundingPacketMutationPerformed: false,
      cp3dCanonicalCoordinateLaw: CP3D_CANONICAL_SHORELINE_BANDS.has(band.bandId) ? 'ROUND_TO_2_POW_NEGATIVE_24_BEFORE_BOUNDS_AND_NORMALS' : null,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({
    ok: construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord),
    bandId: band.bandId,
    primitive: construction?.primitiveRecord ?? null,
    issues: construction?.issues ?? []
  });
}

export function constructHEarthFunctionalShorelineGeometry() {
  const results = H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(constructBand);
  const issues = results.filter((result) => !result.ok).map((result) => `SHORELINE_BAND_INVALID:${result.bandId}`);
  const primitives = results.filter((result) => result.ok).map((result) => result.primitive);
  const bounds = primitives.length > 0 ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds)) : null;
  return freeze({
    ok: issues.length === 0 && primitives.length === H_EARTH_FUNCTIONAL_SHORELINE_BANDS.length,
    status: issues.length === 0 ? 'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE' : 'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
    sourceBoundaryId: 'H_EARTH_C3C1_NORTHEAST_COASTAL_CORNER',
    sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
    bandCount: primitives.length,
    centerlineSampleCount: CENTERLINE.length,
    results,
    primitives,
    bounds,
    visualOceanContinuation: true,
    accessibleRegionExpansion: false,
    admitted: false,
    issues
  });
}
