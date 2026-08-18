/**
 * /showroom/globe/h-earth/render/geometry-shoreline.js
 *
 * H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_RUN_6C_v1
 *
 * Successor shoreline-band construction derived from the canonical Run 6B
 * shoreline law. Packet 001 and the three-primitive shoreline preview remain
 * unchanged compatibility corridors.
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
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

const CP3D_CANONICAL_SCALE = 2 ** 24;
const CP3D_CANONICAL_SHORELINE_BANDS = new Set([
  'DRY_SAND_EDGE',
  'DAMP_TRANSITION'
]);

function canonicalizeCP3DCoordinate(value) {
  const canonical = Math.round(value * CP3D_CANONICAL_SCALE) / CP3D_CANONICAL_SCALE;
  return Object.is(canonical, -0) ? 0 : canonical;
}

function canonicalizeCP3DShorelinePoint(point, bandId) {
  if (!CP3D_CANONICAL_SHORELINE_BANDS.has(bandId)) return point;
  return {
    ...point,
    x: canonicalizeCP3DCoordinate(point.x),
    y: canonicalizeCP3DCoordinate(point.y),
    z: canonicalizeCP3DCoordinate(point.z)
  };
}

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_RUN_6C_v1';

export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS = freeze([
  {
    bandId: 'DRY_SAND_EDGE',
    innerOffset: 34,
    outerOffset: 14,
    materialReference: 'H_EARTH_MATERIAL_DRY_SAND',
    materialIntent: 'DRY_SAND'
  },
  {
    bandId: 'DAMP_TRANSITION',
    innerOffset: 14,
    outerOffset: 4,
    materialReference: 'H_EARTH_MATERIAL_WET_SAND',
    materialIntent: 'DAMP_SAND_TRANSITION'
  },
  {
    bandId: 'WET_SAND',
    innerOffset: 4,
    outerOffset: 0,
    materialReference: 'H_EARTH_MATERIAL_WET_SAND',
    materialIntent: 'WET_SAND'
  },
  {
    bandId: 'FOAM_CONTACT',
    innerOffset: 0,
    outerOffset: -3.2,
    materialReference: 'H_EARTH_MATERIAL_FOAM',
    materialIntent: 'FOAM_CONTACT'
  },
  {
    bandId: 'SHALLOW_WATER',
    innerOffset: -3.2,
    outerOffset: -22,
    materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER',
    materialIntent: 'SHALLOW_WATER'
  },
  {
    bandId: 'NEARSHORE_WATER',
    innerOffset: -22,
    outerOffset: -58,
    materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER',
    materialIntent: 'NEARSHORE_WATER'
  },
  {
    bandId: 'OPEN_WATER',
    innerOffset: -58,
    outerOffset: -146,
    materialReference: 'H_EARTH_MATERIAL_OPEN_WATER',
    materialIntent: 'OPEN_WATER'
  }
]);

const sampleCount = 33;
const xAt = (index) => -256 + (index / (sampleCount - 1)) * 512;

function tangentAndWaterwardNormal(x) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(x - step);
  const z1 = getHEarthCanonicalShorelineZ(x + step);
  const tangentX = 2 * step;
  const tangentZ = z1 - z0;
  const length = Math.hypot(tangentX, tangentZ);
  let normalX = -tangentZ / length;
  let normalZ = tangentX / length;
  if (normalZ < 0) {
    normalX *= -1;
    normalZ *= -1;
  }
  return { x: normalX, z: normalZ };
}

function pointAtOffset(x, offset) {
  const shorelineZ = getHEarthCanonicalShorelineZ(x);
  const normal = tangentAndWaterwardNormal(x);
  const worldX = x - normal.x * offset;
  const worldZ = shorelineZ - normal.z * offset;
  const sample = sampleHEarthTerrainField(worldX, worldZ);
  return {
    x: worldX,
    y: sample.elevation + (offset <= 0 ? 0.04 : 0),
    z: worldZ,
    sample
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
    vertices.push(
      createHEarthVector3(inner.x, inner.y, inner.z),
      createHEarthVector3(outer.x, outer.y, outer.z)
    );
    sourceSampleIds.push(`H_EARTH_FUNCTIONAL_SHORELINE_SAMPLE_${String(index).padStart(2, '0')}`);
  }

  for (let index = 0; index < sampleCount - 1; index += 1) {
    const a = index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
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
    materialHint: freeze({
      materialReference: band.materialReference,
      materialIntent: band.materialIntent
    }),
    source: freeze({
      sourceType: 'H_EARTH_CANONICAL_TERRAIN_FIELD_SHORELINE',
      terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId
    }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId: band.bandId,
      sourceBoundaryId: 'H_EARTH_FUNCTIONAL_SHORELINE_FIELD_REVISION_1',
      sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
      innerOffset: band.innerOffset,
      outerOffset: band.outerOffset,
      sourceSampleIds,
      cp3dCanonicalCoordinateLaw: CP3D_CANONICAL_SHORELINE_BANDS.has(band.bandId)
        ? 'ROUND_TO_2_POW_NEGATIVE_24_BEFORE_BOUNDS_AND_NORMALS'
        : null,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });

  return freeze({
    ok: construction?.valid === true &&
      isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord),
    bandId: band.bandId,
    primitive: construction?.primitiveRecord ?? null,
    issues: construction?.issues ?? []
  });
}

export function constructHEarthFunctionalShorelineGeometry() {
  const results = H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(constructBand);
  const issues = results
    .filter((result) => !result.ok)
    .map((result) => `SHORELINE_BAND_INVALID:${result.bandId}`);
  const primitives = results.filter((result) => result.ok)
    .map((result) => result.primitive);
  const bounds = primitives.length > 0
    ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds))
    : null;

  return freeze({
    ok: issues.length === 0 &&
      primitives.length === H_EARTH_FUNCTIONAL_SHORELINE_BANDS.length,
    status: issues.length === 0
      ? 'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE'
      : 'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
    sourceBoundaryId: 'H_EARTH_FUNCTIONAL_SHORELINE_FIELD_REVISION_1',
    sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
    bandCount: primitives.length,
    results,
    primitives,
    bounds,
    admitted: false,
    issues
  });
}
