/**
 * /showroom/globe/h-earth/render/geometry-shoreline.js
 *
 * C3C3R4 planetary world-frame reconstruction. Shoreline contact remains on the
 * protected local tangent patch. OPEN_WATER alone continues outward through the
 * shared planetary-world-frame transform used by distant land continuation.
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

import {
  H_EARTH_PLANETARY_WORLD_FRAME,
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  projectHEarthVisibleContinuationPoint
} from './planetary-world-frame.js';

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
const VISUAL_OCEAN_CONTINUATION_OFFSET = -3600;
const NORTH_X_MIN = -1024;
const CORNER_X = 232;
const CORNER_Z = -64.475;
const EAST_Z_MIN = -1024;
const NORTH_SAMPLE_COUNT = 257;
const EAST_SAMPLE_COUNT = 193;
const OPEN_WATER_SEGMENT_OFFSETS = freeze([
  -58, -180, -360, -620, -920, -1280, -1680, -2120, -2600, -3100,
  VISUAL_OCEAN_CONTINUATION_OFFSET
]);

function canonicalize(value) {
  const result = Math.round(value * CP3D_CANONICAL_SCALE) / CP3D_CANONICAL_SCALE;
  return Object.is(result, -0) ? 0 : result;
}
function canonicalizePoint(point, bandId) {
  if (!CP3D_CANONICAL_SHORELINE_BANDS.has(bandId)) return point;
  return { ...point, x: canonicalize(point.x), y: canonicalize(point.y), z: canonicalize(point.z) };
}

export const H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_C3C3R4_SHARED_PLANETARY_FRAME_v1';

export const H_EARTH_FUNCTIONAL_SHORELINE_BANDS = freeze([
  { bandId: 'DRY_SAND_EDGE', innerOffset: 34, outerOffset: 14, materialReference: 'H_EARTH_MATERIAL_DRY_SAND', materialIntent: 'DRY_SAND' },
  { bandId: 'DAMP_TRANSITION', innerOffset: 14, outerOffset: 4, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'DAMP_SAND_TRANSITION' },
  { bandId: 'WET_SAND', innerOffset: 4, outerOffset: 0, materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'WET_SAND' },
  { bandId: 'FOAM_CONTACT', innerOffset: 0, outerOffset: -3.2, materialReference: 'H_EARTH_MATERIAL_FOAM', materialIntent: 'FOAM_CONTACT' },
  { bandId: 'SHALLOW_WATER', innerOffset: -3.2, outerOffset: -22, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'SHALLOW_WATER' },
  { bandId: 'NEARSHORE_WATER', innerOffset: -22, outerOffset: -58, materialReference: 'H_EARTH_MATERIAL_NEARSHORE_WATER', materialIntent: 'NEARSHORE_WATER' },
  { bandId: 'OPEN_WATER', innerOffset: -58, outerOffset: VISUAL_OCEAN_CONTINUATION_OFFSET, materialReference: 'H_EARTH_MATERIAL_OPEN_WATER', materialIntent: 'OPEN_WATER_SHARED_PLANETARY_WORLD_CONTINUATION' }
]);

function baseElevationFor(worldX, worldZ, offset) {
  if (offset <= 0) {
    return H_EARTH_TERRAIN_FIELD.worldDomain.seaLevelY + (offset >= -3.2 ? 0.035 : 0.015);
  }
  return sampleHEarthTerrainField(worldX, worldZ).elevation;
}
function maybeProject(point, bandId) {
  if (bandId !== 'OPEN_WATER') return point;
  return projectHEarthVisibleContinuationPoint(point);
}
function northPoint(x, offset, bandId) {
  const worldZ = getHEarthCanonicalShorelineZ(x) - offset;
  const point = maybeProject({ x, y: baseElevationFor(x, worldZ, offset), z: worldZ }, bandId);
  return canonicalizePoint(point, bandId);
}
function eastPoint(z, offset, bandId) {
  const worldX = getHEarthCanonicalEasternShorelineX(z) - offset;
  const point = maybeProject({ x: worldX, y: baseElevationFor(worldX, z, offset), z }, bandId);
  return canonicalizePoint(point, bandId);
}

function appendStrip({ vertices, indices, sourceSampleIds, count, innerAt, outerAt, samplePrefix }) {
  const baseVertex = vertices.length;
  for (let index = 0; index < count; index += 1) {
    const inner = innerAt(index);
    const outer = outerAt(index);
    vertices.push(createHEarthVector3(inner.x, inner.y, inner.z), createHEarthVector3(outer.x, outer.y, outer.z));
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

function appendNorthSegment(vertices, indices, sourceSampleIds, bandId, innerOffset, outerOffset, segmentIndex = null) {
  appendStrip({
    vertices, indices, sourceSampleIds, count: NORTH_SAMPLE_COUNT,
    innerAt: (index) => { const x = lerp(NORTH_X_MIN, CORNER_X, index / (NORTH_SAMPLE_COUNT - 1)); return northPoint(x, innerOffset, bandId); },
    outerAt: (index) => { const x = lerp(NORTH_X_MIN, CORNER_X, index / (NORTH_SAMPLE_COUNT - 1)); return northPoint(x, outerOffset, bandId); },
    samplePrefix: segmentIndex === null ? 'H_EARTH_C3C1_NORTH_COAST_SAMPLE' : `H_EARTH_C3C3R4_NORTH_OCEAN_SEGMENT_${segmentIndex}`
  });
}
function appendEastSegment(vertices, indices, sourceSampleIds, bandId, innerOffset, outerOffset, segmentIndex = null) {
  appendStrip({
    vertices, indices, sourceSampleIds, count: EAST_SAMPLE_COUNT,
    innerAt: (index) => { const z = lerp(CORNER_Z, EAST_Z_MIN, index / (EAST_SAMPLE_COUNT - 1)); return eastPoint(z, innerOffset, bandId); },
    outerAt: (index) => { const z = lerp(CORNER_Z, EAST_Z_MIN, index / (EAST_SAMPLE_COUNT - 1)); return eastPoint(z, outerOffset, bandId); },
    samplePrefix: segmentIndex === null ? 'H_EARTH_C3C1_EAST_COAST_SAMPLE' : `H_EARTH_C3C3R4_EAST_OCEAN_SEGMENT_${segmentIndex}`
  });
}

function constructBand(band) {
  const vertices = [];
  const indices = [];
  const sourceSampleIds = [];
  const visualContinuation = band.bandId === 'OPEN_WATER';
  if (visualContinuation) {
    for (let index = 0; index < OPEN_WATER_SEGMENT_OFFSETS.length - 1; index += 1) {
      appendNorthSegment(vertices, indices, sourceSampleIds, band.bandId, OPEN_WATER_SEGMENT_OFFSETS[index], OPEN_WATER_SEGMENT_OFFSETS[index + 1], index);
      appendEastSegment(vertices, indices, sourceSampleIds, band.bandId, OPEN_WATER_SEGMENT_OFFSETS[index], OPEN_WATER_SEGMENT_OFFSETS[index + 1], index);
    }
  } else {
    appendNorthSegment(vertices, indices, sourceSampleIds, band.bandId, band.innerOffset, band.outerOffset);
    appendEastSegment(vertices, indices, sourceSampleIds, band.bandId, band.innerOffset, band.outerOffset);
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
    source: freeze({ sourceType: 'H_EARTH_C3C3R4_COMPOUND_COAST_WITH_SHARED_PLANETARY_FRAME', terrainFieldContractId: H_EARTH_TERRAIN_FIELD.contractId }),
    metadata: freeze({
      providerContractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
      bandId: band.bandId,
      sourceBoundaryId: 'H_EARTH_C3C1_NORTHEAST_COASTAL_CORNER',
      sourceBoundaryContractId: H_EARTH_TERRAIN_FIELD.contractId,
      innerOffset: band.innerOffset,
      outerOffset: band.outerOffset,
      sourceSampleIds,
      sampleCount: sourceSampleIds.length,
      topologyLaw: visualContinuation ? 'SEGMENTED_OPEN_WATER_CONSUMES_SHARED_PLANETARY_WORLD_FRAME' : 'TWO_OPEN_3D_STRIPS_SHARE_NORTHEAST_CORNER_REGION',
      waterSurfaceLaw: visualContinuation ? 'SHARED_WORLD_SPACE_PLANETARY_FRAME_AFTER_PROTECTED_LOCAL_TANGENT_PATCH' : band.outerOffset <= 0 ? 'ONE_COHERENT_SEA_LEVEL_SURFACE' : 'CANONICAL_TERRAIN_FIELD',
      visualContinuationLayer: visualContinuation,
      renderedLandscapeMemberRequired: true,
      sharedPlanetaryWorldFrame: visualContinuation,
      sharedPlanetaryWorldFrameContractId: visualContinuation ? H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID : null,
      planetaryOceanLimb: visualContinuation,
      objectiveVisiblePlanetaryLimb: visualContinuation,
      worldSpaceCurvature: visualContinuation,
      planetaryRadius: visualContinuation ? H_EARTH_PLANETARY_WORLD_FRAME.effectivePlanetRadius : null,
      planetaryLimbStartDistance: visualContinuation ? H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius : null,
      planetaryMaximumDrop: visualContinuation ? H_EARTH_PLANETARY_WORLD_FRAME.maximumVisibleSag : null,
      viewportFixedArc: false,
      localShorelineDeformation: false,
      primaryOceanExposure: '+Z_NORTH',
      secondaryOceanExposure: '+X_EAST',
      inlandReliefMutationAuthorized: false,
      navigationAddressIds: [],
      navigable: false,
      collisionAuthority: false,
      accessibleRegionExpansion: false,
      oceanFacingLandProhibited: visualContinuation,
      rectangularTerminalGeometryProhibited: visualContinuation,
      continuationLaw: visualContinuation ? 'OPEN_WATER_AND_DISTANT_LAND_SHARE_ONE_PLANETARY_CURVATURE_AUTHORITY' : null,
      foundingPacketMutationPerformed: false,
      cp3dCanonicalCoordinateLaw: CP3D_CANONICAL_SHORELINE_BANDS.has(band.bandId) ? 'ROUND_TO_2_POW_NEGATIVE_24_BEFORE_BOUNDS_AND_NORMALS' : null,
      admitted: false,
      aggregateFrameAuthority: false
    })
  });
  return freeze({ ok: construction?.valid === true && isHEarthNeutralPrimitiveRecord(construction?.primitiveRecord), bandId: band.bandId, primitive: construction?.primitiveRecord ?? null, issues: construction?.issues ?? [] });
}

export function constructHEarthFunctionalShorelineGeometry() {
  const results = H_EARTH_FUNCTIONAL_SHORELINE_BANDS.map(constructBand);
  const issues = results.flatMap((result) => result.issues);
  const primitives = results.filter((result) => result.ok).map((result) => result.primitive);
  const openWaterPrimitive = primitives.find((primitive) => primitive.metadata?.bandId === 'OPEN_WATER') ?? null;
  return freeze({
    ok: results.every((result) => result.ok),
    status: results.every((result) => result.ok) ? 'FUNCTIONAL_SHORELINE_GEOMETRY_COMPLETE' : 'FUNCTIONAL_SHORELINE_GEOMETRY_FAILED',
    contractId: H_EARTH_GEOMETRY_SHORELINE_CONTRACT_ID,
    primitives,
    bounds: primitives.length ? mergeHEarthGeometryBounds(primitives.map((primitive) => primitive.geometry.bounds)) : null,
    renderedPlanetaryOpenWater: openWaterPrimitive?.metadata?.planetaryOceanLimb === true,
    sharedPlanetaryWorldFrameContractId: openWaterPrimitive?.metadata?.sharedPlanetaryWorldFrameContractId ?? null,
    objectiveVisiblePlanetaryLimb: openWaterPrimitive?.metadata?.objectiveVisiblePlanetaryLimb === true,
    openWaterPrimitiveId: openWaterPrimitive?.primitiveId ?? null,
    accessibleRegionExpansion: false,
    issues
  });
}
