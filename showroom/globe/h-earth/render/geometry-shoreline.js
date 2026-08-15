/**
 * /showroom/globe/h-earth/render/geometry-shoreline.js
 *
 * H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_RUN_6C_v2
 * HC05 visual-maturity renewal. The accepted Gratitude shoreline/hydrology
 * remains authoritative; presentation sampling is densified and the seven
 * material bands are narrowed so the coast reads as one continuous shoreline
 * rather than large stepped ribbons at ground-view scale.
 */

import {
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const CP3D_CANONICAL_SCALE = 2 ** 24;
const CP3D_CANONICAL_SHORELINE_BANDS = new Set(['DRY_SAND_EDGE', 'DAMP_TRANSITION']);
const canonicalizeCP3DCoordinate = (value) => {
  const canonical = Math.round(value * CP3D_CANONICAL_SCALE) / CP3D_CANONICAL_SCALE;
  return Object.is(canonical, -0) ? 0 : canonical;
};
const canonicalizeCP3DShorelinePoint = (point, bandId) =>
  CP3D_CANONICAL_SHORELINE_BANDS.has(bandId)
    ? { ...point, x: canonicalizeCP3DCoordinate(point.x), y: canonicalizeCP3DCoordinate(point.y), z: canonicalizeCP3DCoordinate(point.z) }
    : point;

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_RUN_6C_v2';
export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS = freeze([
  { bandId: 'DRY_SAND_EDGE', innerOffset: 20, outerOffset: 8, materialReference: 'H_EARTH_MATERIAL_DRY_SAND', materialIntent: 'DRY_SAND' },
  { bandId: 'DAMP_TRANSITION', innerOffset: 8, outerOffset: 2.5, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'DAMP_SAND_TRANSITION' },
  { bandId: 'WET_SAND', innerOffset: 2.5, outerOffset: 0, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'WET_SAND' },
  { bandId: 'FOAM_CONTACT', innerOffset: 0, outerOffset: -1.5, materialReference: 'H_EARTH_MATERIAL_FOAM', materialIntent: 'FOAM_CONTACT' },
  { bandId: 'SHALLOW_WATER', innerOffset: -1.5, outerOffset: -14, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'SHALLOW_WATER' },
  { bandId: 'NEARSHORE_WATER', innerOffset: -14, outerOffset: -42, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'NEARSHORE_WATER' },
  { bandId: 'OPEN_WATER', innerOffset: -42, outerOffset: -146, materialReference: 'H_EARTH_MATERIAL_OPEN_WATER', materialIntent: 'OPEN_WATER' }
]);

const sampleCount = 129;
const xAt = (index) => -256 + (index / (sampleCount - 1)) * 512;
const seaLevelY = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY;

function tangentAndWaterwardNormal(x) {
  const step = 0.25;
  const z0 = resolveHEarthMapWideShorelineZ(x - step);
  const z1 = resolveHEarthMapWideShorelineZ(x + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  let normalX = -tangentZ / length;
  let normalZ = tangentX / length;
  if (normalZ < 0) { normalX *= -1; normalZ *= -1; }
  return { x: normalX, z: normalZ };
}

function pointAtOffset(x, offset) {
  const shorelineZ = resolveHEarthMapWideShorelineZ(x);
  const normal = tangentAndWaterwardNormal(x);
  const worldX = x - normal.x * offset;
  const worldZ = shorelineZ - normal.z * offset;
  const acceptedSample = sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ);
  const landElevation = acceptedSample?.valid === true && Number.isFinite(acceptedSample.presentationElevation)
    ? acceptedSample.presentationElevation
    : seaLevelY;
  const waterward = offset <= 0;
  const waterDepthBias = waterward ? Math.min(0.055, 0.018 + Math.abs(offset) * 0.00022) : 0;
  return {
    x: worldX,
    y: waterward ? seaLevelY + waterDepthBias : landElevation,
    z: worldZ,
    sample: acceptedSample?.valid === true ? acceptedSample : freeze({ valid: true, presentationElevation: seaLevelY, waterSurfaceFallback: true }),
    waterward
  };
}

function constructBand(band) {
  const vertices = [];
  const indices = [];
  const sourceSampleIds = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const x = xAt(index);
    const inner = canonicalizeCP3DShorelinePoint(pointAtOffset(x, band.innerOffset), band.bandId);
    const outer = canonicalizeCP3DShorelinePoint(pointAtOffset(x, band.outerOffset), band.bandId);
    vertices.push(createHEarthVector3(inner.x, inner.y, inner.z), createHEarthVector3(outer.x, outer.y, outer.z));
    sourceSampleIds.push(`H_EARTH_FUNCTIONAL_SHORELINE_SAMPLE_${String(index).padStart(3, '0')}`);
  }
  for (let index = 0; index < sampleCount - 1; index += 1) {
    const a = index * 2, b = a + 1, c = a + 2, d = a + 3;
    if (index % 2 === 0) indices.push(a, c, b, b, c, d);
    else indices.push(a, c, d, a, d, b);
  }
  const primitiveId = `H_EARTH_FUNCTIONAL_SHORELINE:${band.bandId}`;
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
    source: freeze({
      sourceType: 'HC05_ACCEPTED_MAP_WIDE_GRATITUDE_SHORELINE_PROJECTION',
      terrainFieldContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId: band.bandId,
      sourceBoundaryId: 'H_EARTH_FUNCTIONAL_SHORELINE_FIELD_REVISION_1',
      sourceBoundaryContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      hc05GroundProjection: true,
      acceptedWorldSourceMutated: false,
      seaLevelY,
      innerOffset: band.innerOffset,
      outerOffset: band.outerOffset,
      presentationSampleCount: sampleCount,
      sourceSampleIds,
      cp3dCanonicalCoordinateLaw: CP3D_CANONICAL_SHORELINE_BANDS.has(band.bandId)
        ? 'ROUND_TO_2_POW_NEGATIVE_24_BEFORE_BOUNDS_AND_NORMALS' : null,
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
  const bounds = primitives.length > 0
    ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds)) : null;
  return freeze({
    ok: issues.length === 0 && primitives.length === H_EARTH_FUNCTIONAL_SHORELINE_BANDS.length,
    status: issues.length === 0 ? 'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE' : 'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
    sourceBoundaryId: 'H_EARTH_FUNCTIONAL_SHORELINE_FIELD_REVISION_1',
    sourceBoundaryContractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    acceptedWorldProjection: true,
    acceptedWorldSourceMutated: false,
    presentationSampleCount: sampleCount,
    bandCount: primitives.length,
    results,
    primitives,
    bounds,
    admitted: false,
    issues
  });
}
