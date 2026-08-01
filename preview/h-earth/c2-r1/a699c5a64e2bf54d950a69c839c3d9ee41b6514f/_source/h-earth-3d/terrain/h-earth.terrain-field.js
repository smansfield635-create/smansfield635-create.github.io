/**
 * /h-earth-3d/terrain/h-earth.terrain-field.js
 *
 * H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1
 *
 * Canonical world-space elevation authority for the functional-landscape
 * successor. It creates no geometry, admission, frame, renderer, or route.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const gaussian = (x, z, centerX, centerZ, radiusX, radiusZ, amplitude) => {
  const dx = (x - centerX) / radiusX;
  const dz = (z - centerZ) / radiusZ;
  return amplitude * Math.exp(-(dx * dx + dz * dz) * 1.6);
};

export const H_EARTH_TERRAIN_FIELD_CONTRACT_ID =
  'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1';

export const H_EARTH_TERRAIN_FIELD = deepFreeze({
  contractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  generationRevision: 1,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  worldDomain: {
    xMinimum: -256,
    xMaximum: 256,
    zMinimum: -256,
    zMaximum: 64,
    seaLevelY: 0
  },
  sampling: {
    derivativeStep: 0.5,
    sharedEdgeRule: 'SAME_WORLD_COORDINATE_SAMPLES_SAME_CANONICAL_FIELD',
    normalRule: 'CENTRAL_DIFFERENCE_FROM_CANONICAL_FIELD',
    numericTolerance: 1e-8
  },
  heightProfiles: {
    coast: 'COASTAL_ENTRY_PROFILE_v1',
    dune: 'COASTAL_BERM_PROFILE_v1',
    lowland: 'LOWLAND_PROFILE_v1',
    rolling: 'ROLLING_TERRAIN_PROFILE_v1',
    hill: 'NAVIGABLE_HILL_PROFILE_v1',
    ridge: 'RIDGE_BLUFF_PROFILE_v1',
    valley: 'DRAINAGE_VALLEY_PROFILE_v1',
    water: 'COASTAL_WATER_DEPTH_PROFILE_v1'
  },
  ownership: {
    ownsWorldSpaceElevationLaw: true,
    ownsDerivativeAndNormalSampleLaw: true,
    ownsGeometry: false,
    ownsSemanticLattice: false,
    ownsFormationIdentity: false,
    ownsRealizationSelection: false,
    ownsAdmission: false,
    ownsRenderer: false
  }
});

export function getHEarthCanonicalShorelineZ(worldX) {
  if (!finite(worldX)) return Number.NaN;
  return -82
    + 7.5 * Math.sin(worldX / 58)
    + 2.75 * Math.sin((worldX + 31) / 19);
}

function evaluateRawElevation(worldX, worldZ) {
  const shorelineZ = getHEarthCanonicalShorelineZ(worldX);
  const inlandDistance = shorelineZ - worldZ;
  const waterwardDistance = worldZ - shorelineZ;

  if (waterwardDistance > 0) {
    const shallow = -0.35 - Math.min(waterwardDistance, 28) * 0.018;
    const openWater = -0.85 - Math.max(0, waterwardDistance - 28) * 0.012;
    return shallow * (1 - smoothstep(18, 38, waterwardDistance))
      + openWater * smoothstep(18, 38, waterwardDistance);
  }

  const coastRise = 0.025 * Math.max(0, inlandDistance);
  const wetSandCompression = -0.22 * Math.exp(-Math.max(0, inlandDistance) / 16);
  const dune = gaussian(worldX, worldZ, 6, shorelineZ - 34, 190, 22, 5.8);
  const rolling =
    1.7 * Math.sin((worldX + 22) / 48) * smoothstep(55, 180, inlandDistance)
    + 1.2 * Math.sin((worldZ + 140) / 29) * smoothstep(70, 200, inlandDistance);
  const hill = gaussian(worldX, worldZ, 72, -172, 62, 50, 27);
  const ridge = gaussian(worldX, worldZ, 145, -225, 78, 30, 38);
  const lowland = gaussian(worldX, worldZ, -92, -152, 70, 58, -6.5);
  const valley = gaussian(worldX, worldZ, 2, -198, 44, 82, -11.5);
  const bluff = gaussian(worldX, worldZ, 188, -245, 48, 24, 18);

  return coastRise + wetSandCompression + dune + rolling
    + hill + ridge + lowland + valley + bluff;
}

function classifySlope(slope) {
  if (slope < 0.08) return 'LEVEL';
  if (slope < 0.22) return 'GENTLE';
  if (slope < 0.48) return 'MODERATE';
  return 'STEEP_NONCLIMBING';
}

function classifyCurvature(curvature) {
  if (curvature < -0.04) return 'CONCAVE';
  if (curvature > 0.04) return 'CONVEX';
  return 'NEAR_PLANAR';
}

function resolveMaterialProfile(shorelineDistance, elevation, slope) {
  if (shorelineDistance < -18) return 'OPEN_WATER';
  if (shorelineDistance < 0) return 'NEARSHORE_WATER';
  if (shorelineDistance < 12) return 'WET_SAND';
  if (shorelineDistance < 42) return 'DRY_SAND';
  if (elevation > 24 || slope > 0.35) return 'STONE_AND_SPARSE_SOIL';
  if (elevation > 8) return 'COASTAL_SOIL';
  return 'LOWLAND_SOIL';
}

export function sampleHEarthTerrainElevation(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) return Number.NaN;
  const { worldDomain } = H_EARTH_TERRAIN_FIELD;
  const x = clamp(worldX, worldDomain.xMinimum, worldDomain.xMaximum);
  const z = clamp(worldZ, worldDomain.zMinimum, worldDomain.zMaximum);
  return evaluateRawElevation(x, z);
}

export function sampleHEarthTerrainField(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return deepFreeze({
      valid: false,
      status: 'TERRAIN_SAMPLE_REJECTED_NONFINITE',
      worldX,
      worldZ
    });
  }

  const step = H_EARTH_TERRAIN_FIELD.sampling.derivativeStep;
  const elevation = sampleHEarthTerrainElevation(worldX, worldZ);
  const left = sampleHEarthTerrainElevation(worldX - step, worldZ);
  const right = sampleHEarthTerrainElevation(worldX + step, worldZ);
  const back = sampleHEarthTerrainElevation(worldX, worldZ - step);
  const front = sampleHEarthTerrainElevation(worldX, worldZ + step);
  const dx = (right - left) / (2 * step);
  const dz = (front - back) / (2 * step);
  const normalLength = Math.hypot(-dx, 1, -dz);
  const slope = Math.hypot(dx, dz);
  const curvature =
    (left - 2 * elevation + right) / (step * step)
    + (back - 2 * elevation + front) / (step * step);
  const shorelineZ = getHEarthCanonicalShorelineZ(worldX);
  const shorelineDistance = shorelineZ - worldZ;

  return deepFreeze({
    valid: true,
    status: 'TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
    generationRevision: H_EARTH_TERRAIN_FIELD.generationRevision,
    world: { x: worldX, y: elevation, z: worldZ },
    elevation,
    shorelineZ,
    shorelineDistance,
    gradient: { x: dx, z: dz },
    normal: {
      x: -dx / normalLength,
      y: 1 / normalLength,
      z: -dz / normalLength
    },
    slope,
    slopeClass: classifySlope(slope),
    curvature,
    curvatureClass: classifyCurvature(curvature),
    materialProfile: resolveMaterialProfile(
      shorelineDistance,
      elevation,
      slope
    )
  });
}

export function evaluateHEarthTerrainSharedEdge({
  edgeA,
  edgeB,
  tolerance = H_EARTH_TERRAIN_FIELD.sampling.numericTolerance
}) {
  const issues = [];
  if (!Array.isArray(edgeA) || !Array.isArray(edgeB) || edgeA.length !== edgeB.length) {
    issues.push('EDGE_SAMPLE_COUNT_MISMATCH');
  } else {
    edgeA.forEach((a, index) => {
      const b = edgeB[index];
      if (!a || !b || a.key !== b.key) issues.push(`EDGE_KEY_MISMATCH:${index}`);
      for (const axis of ['x', 'y', 'z']) {
        if (!finite(a?.world?.[axis]) || !finite(b?.world?.[axis])
          || Math.abs(a.world[axis] - b.world[axis]) > tolerance) {
          issues.push(`EDGE_POSITION_MISMATCH:${axis}:${index}`);
        }
      }
      for (const axis of ['x', 'y', 'z']) {
        if (!finite(a?.normal?.[axis]) || !finite(b?.normal?.[axis])
          || Math.abs(a.normal[axis] - b.normal[axis]) > tolerance) {
          issues.push(`EDGE_NORMAL_MISMATCH:${axis}:${index}`);
        }
      }
    });
  }

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'TERRAIN_SHARED_EDGE_PASS'
      : 'TERRAIN_SHARED_EDGE_FAIL',
    tolerance,
    issues
  });
}
