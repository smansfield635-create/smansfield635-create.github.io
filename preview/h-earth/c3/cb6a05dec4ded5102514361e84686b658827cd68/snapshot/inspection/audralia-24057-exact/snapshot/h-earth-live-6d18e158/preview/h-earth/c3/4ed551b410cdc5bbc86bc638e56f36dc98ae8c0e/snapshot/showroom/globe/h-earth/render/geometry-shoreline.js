/**
 * /showroom/globe/h-earth/render/geometry-shoreline.js
 *
 * C3C1 3D coastal-corner shoreline provider. Each canonical shoreline band is
 * one neutral primitive containing two open 3D strips: the existing north coast
 * and the derived east coast. They meet/overlap at the northeast corner without
 * forcing the 1600-unit open-ocean ribbon through a tight parametric bend.
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
const CP3D_CANONICAL_SCALE = 2 ** 24;
const CP3D_CANONICAL_SHORELINE_BANDS = new Set(['DRY_SAND_EDGE', 'DAMP_TRANSITION']);
const VISUAL_OCEAN_CONTINUATION_OFFSET = -1600;
const NORTH_X_MIN = -1024;
const CORNER_X = 232;
const CORNER_Z = -64.475;
const EAST_Z_MIN = -1024;
const NORTH_SAMPLE_COUNT = 257;
const EAST_SAMPLE_COUNT = 193;

function canonicalize(value) {
  const result = Math.round(value * CP3D_CANONICAL_SCALE) / CP3D_CANONICAL_SCALE;
  return Object.is(result, -0) ? 0 : result;
}
function canonicalizePoint(point, bandId) {
  if (!CP3D_CANONICAL_SHORELINE_BANDS.has(bandId)) return point;
  return { ...point, x: canonicalize(point.x), y: canonicalize(point.y), z: canonicalize(point.z) };
}

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_C3C1_NORTHEAST_COASTAL_CORNER_v2';

export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS = freeze([
  { bandId: 'DRY_SAND_EDGE', innerOffset: 34, outerOffset: 14, materialReference: 'H_EARTH_MATERIAL_DRY_SAND', materialIntent: 'DRY_SAND' },
  { bandId: 'DAMP_TRANSITION', innerOffset: 14, outerOffset: 4, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'DAMP_SAND_TRANSITION' },
  { bandId: 'WET_SAND', innerOffset: 4, outerOffset: 0, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'WET_SAND' },
  { bandId: 'FOAM_CONTACT', innerOffset: 0, outerOffset: -3.2, materialReference: 'H_EARTH_MATERIAL_FOAM', materialIntent: 'FOAM_CONTACT' },
  { bandId: 'SHALLOW_WATER', innerOffset: -3.2, outerOffset: -22, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'SHALLOW_WATER' },
  { bandId: 'NEARSHORE_WATER', innerOffset: -22, outerOffset: -58, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'NEARSHORE_WATER' },
  { bandId: 'OPEN_WATER', innerOffset: -58, outerOffset: VISUAL_OCEAN_CONTINUATION_OFFSET, materialReference: 'H_EARTH_MATERIAL_OPEN_WATER', materialIntent: 'OPEN_WATER_VISUAL_WORLD_CONTINUATION' }
]);

function elevationFor(worldX, worldZ, offset) {
  if (offset <= 0) {
    return H_EARTH_TERRAIN_FIELD.worldDomain.seaLevelY + (offset >= -3.2 ? 0.035 : 0.015);
  }
  return sampleHEarthTerrainField(worldX, worldZ).elevation;
}

function northPoint(x, offset, bandId) {
  const worldZ = getHEarthCanonicalShorelineZ(x) - offset;
  return canonicalizePoint({ x, y: elevationFor(x, worldZ, offset), z: worldZ }, bandId);
}

function eastPoint(z, offset, bandId) {
  const worldX = getHEarthCanonicalEasternShorelineX(z) - offset;
  return canonicalizePoint({ x: worldX, y: elevationFor(worldX, z, offset), z }, bandId);
}

function appendStrip({ vertices, indices, sourceSampleIds, count, innerAt, outerAt, samplePrefix }) {
  const baseVertex = vertices.length;
  for (let index = 0; index < count; index += 1) {
    const inner = innerAt(index);
    const outer = outerAt(index);
    vertices.push(
      createHEarthVector3(inner.x, inner.y, inner.z),
      createHEarthVector3(outer.x, outer.y, outer.z)
    );
    sourceSampleIds.push(`${samplePrefix}_${String(index).padStart(3, '0')}`);
  }
  for (let index = 0; index < count - 1; index += 1) {
    const a = baseVertex + index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }
}

function constructBand(band) {
  const vertices = [];
  const indices = [];
  const sourceSampleIds = [];

  appendStrip({
    vertices,
    indices,
    sourceSampleIds,
    count: NORTH_SAMPLE_COUNT,
    innerAt: (index) => {
      const x = lerp(NORTH_X_MIN, CORNER_X, index / (NORTH_SAMPLE_COUNT - 1));
      return northPoint(x, band.innerOffset, band.bandId);
    },
    outerAt: (index) => {
      const x = lerp(NORTH_X_MIN, CORNER_X, index / (NORTH_SAMPLE_COUNT - 1));
      return northPoint(x, band.outerOffset, band.bandId);
    },
    samplePrefix: 'H_EARTH_C3C1_NORTH_COAST_SAMPLE'
  });

  appendStrip({
    vertices,
    indices,
    sourceSampleIds,
    count: EAST_SAMPLE_COUNT,
    innerAt: (index) => {
      const z = lerp(CORNER_Z, EAST_Z_MIN, index / (EAST_SAMPLE_COUNT - 1));
      return eastPoint(z, band.innerOffset, band.bandId);
    },
    outerAt: (index) => {
      const z = lerp(CORNER_Z, EAST_Z_MIN, index / (EAST_SAMPLE_COUNT - 1));
      return eastPoint(z, band.outerOffset, band.bandId);
    },
    samplePrefix: 'H_EARTH_C3C1_EAST_COAST_SAMPLE'
  });

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
    source: freeze({ sourceType: 'H_EARTH_C3C1_COMPOUND_NORTH_AND_EAST_COASTAL_STRIPS', terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId: band.bandId,
      sourceBoundaryId: 'H_EARTH_C3C1_NORTHEAST_COASTAL_CORNER',
      sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
      innerOffset: band.innerOffset,
      outerOffset: band.outerOffset,
      sourceSampleIds,
      sampleCount: NORTH_SAMPLE_COUNT + EAST_SAMPLE_COUNT,
      northSampleCount: NORTH_SAMPLE_COUNT,
      eastSampleCount: EAST_SAMPLE_COUNT,
      topologyLaw: 'TWO_OPEN_3D_STRIPS_SHARE_NORTHEAST_CORNER_REGION_WITHOUT_FORCING_FAR_OCEAN_OFFSET_THROUGH_TIGHT_BEND',
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
      continuationLaw: visualContinuation ? 'OPEN_WATER_EXTENDS_INDEPENDENTLY_OUTWARD_FROM_NORTH_AND_EAST_CONTINENTAL_EDGES' : null,
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
    northSampleCount: NORTH_SAMPLE_COUNT,
    eastSampleCount: EAST_SAMPLE_COUNT,
    results,
    primitives,
    bounds,
    visualOceanContinuation: true,
    accessibleRegionExpansion: false,
    admitted: false,
    issues
  });
}
