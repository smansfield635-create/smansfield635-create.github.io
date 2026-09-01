/**
 * /showroom/globe/h-earth/render/planetary-world-frame.js
 *
 * H_EARTH_C3C3R5_REGION_TO_PLANET_TRANSFORM_v1
 *
 * Replaces the rejected C3C3R4 y-only sag proxy with a real region-to-planet
 * mapping. H-Earth remains an exact local Cartesian tangent patch inside the
 * protected playable envelope. Visible non-navigable continuation transitions
 * through an annular bridge into a spherical planetary surface where x, y and z
 * all participate in curvature and the surface normal rotates with position.
 */

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep01 = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const normalize = ({ x, y, z }) => {
  const length = Math.hypot(x, y, z);
  if (!(length > Number.EPSILON)) return freeze({ x: 0, y: 1, z: 0 });
  return freeze({ x: x / length, y: y / length, z: z / length });
};

export const H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID =
  'H_EARTH_C3C3R5_REGION_TO_PLANET_SPHERICAL_FRAME_v1';

export const H_EARTH_PLANETARY_WORLD_FRAME = freeze({
  contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  frameClass: 'LOCAL_CARTESIAN_TANGENT_PATCH_TO_TRUE_SPHERICAL_CONTINUATION',
  tangentOrigin: freeze({ x: 0, y: 0, z: 0 }),
  sphereCenter: freeze({ x: 0, y: -420000, z: 0 }),
  protectedTangentRadius: 1100,
  transitionWidth: 600,
  exactSphereRadius: 420000,
  nominalObserverHeight: 12,
  navigationAuthorityExpansion: false,
  collisionAuthorityExpansion: false,
  accessibleRegionExpansion: false,
  viewportFixedCurvature: false,
  yOnlySagProxyProhibited: true,
  fixedHorizonRadiusProhibited: true,
  localTerrainWarpProhibited: true,
  localShorelineWarpProhibited: true,
  sharedConsumersRequired: freeze(['OPEN_WATER', 'DISTANT_LAND_CONTINUATION']),
  requiredOutputs: freeze([
    'PLANET_POINT_XYZ',
    'PLANET_SURFACE_NORMAL',
    'LOCAL_TANGENT_BASIS',
    'PLANET_RELATIVE_UP',
    'DERIVED_GEOMETRIC_HORIZON'
  ])
});

export function getHEarthPlanetaryRadialDistance(worldX, worldZ) {
  return Math.hypot(
    worldX - H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.x,
    worldZ - H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.z
  );
}

export function getHEarthPlanetaryCurvatureBlend(worldX, worldZ) {
  const radial = getHEarthPlanetaryRadialDistance(worldX, worldZ);
  const start = H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius;
  return smoothstep01((radial - start) / H_EARTH_PLANETARY_WORLD_FRAME.transitionWidth);
}

function exactSpherePoint({ x, y, z }) {
  const radius = H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius;
  const radial = Math.hypot(x, z);
  if (radial <= Number.EPSILON) return freeze({ x: 0, y, z: 0, radialDistance: 0, angularDistance: 0 });
  const angularDistance = radial / radius;
  const horizontalRadius = (radius + y) * Math.sin(angularDistance);
  const scale = horizontalRadius / radial;
  return freeze({
    x: x * scale,
    y: (radius + y) * Math.cos(angularDistance) - radius,
    z: z * scale,
    radialDistance: radial,
    angularDistance
  });
}

export function regionToHEarthPlanetPoint({ x, y = 0, z }) {
  const radialDistance = getHEarthPlanetaryRadialDistance(x, z);
  const blend = getHEarthPlanetaryCurvatureBlend(x, z);
  if (blend <= 0) {
    return freeze({
      x,
      y,
      z,
      radialDistance,
      curvatureBlend: 0,
      spatialClass: 'LOCAL_TANGENT_PATCH',
      contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID
    });
  }

  const sphere = exactSpherePoint({ x, y, z });
  return freeze({
    x: lerp(x, sphere.x, blend),
    y: lerp(y, sphere.y, blend),
    z: lerp(z, sphere.z, blend),
    radialDistance,
    angularDistance: sphere.angularDistance,
    curvatureBlend: blend,
    spatialClass: blend >= 1 ? 'EXACT_SPHERICAL_CONTINUATION' : 'TANGENT_TO_SPHERE_TRANSITION_ANNULUS',
    contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID
  });
}

// Compatibility name retained for existing shoreline/distant-context consumers.
// Semantics are no longer y-only sag: this returns the full region-to-planet XYZ.
export function projectHEarthVisibleContinuationPoint(point) {
  return regionToHEarthPlanetPoint(point);
}

export function getHEarthPlanetSurfaceNormal({ x, y = 0, z }) {
  const blend = getHEarthPlanetaryCurvatureBlend(x, z);
  if (blend <= 0) return freeze({ x: 0, y: 1, z: 0 });
  const sphere = exactSpherePoint({ x, y, z });
  const center = H_EARTH_PLANETARY_WORLD_FRAME.sphereCenter;
  const sphericalNormal = normalize({ x: sphere.x - center.x, y: sphere.y - center.y, z: sphere.z - center.z });
  if (blend >= 1) return sphericalNormal;
  return normalize({
    x: lerp(0, sphericalNormal.x, blend),
    y: lerp(1, sphericalNormal.y, blend),
    z: lerp(0, sphericalNormal.z, blend)
  });
}

export function getHEarthPlanetRelativeUp(point) {
  return getHEarthPlanetSurfaceNormal(point);
}

export function getHEarthRegionTangentBasis(point = { x: 0, y: 0, z: 0 }) {
  const up = getHEarthPlanetRelativeUp(point);
  const reference = Math.abs(up.z) < 0.96 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  const east = normalize({
    x: reference.y * up.z - reference.z * up.y,
    y: reference.z * up.x - reference.x * up.z,
    z: reference.x * up.y - reference.y * up.x
  });
  const north = normalize({
    x: up.y * east.z - up.z * east.y,
    y: up.z * east.x - up.x * east.z,
    z: up.x * east.y - up.y * east.x
  });
  return freeze({ east, up, north, contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID });
}

export function getHEarthDerivedHorizonDistance(observerHeight = H_EARTH_PLANETARY_WORLD_FRAME.nominalObserverHeight) {
  const radius = H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius;
  const h = Math.max(0, Number(observerHeight) || 0);
  return Math.sqrt(Math.max(0, (radius + h) * (radius + h) - radius * radius));
}

// Retained for older distant-context call sites, but the radius is derived from
// planet scale and observer height rather than being an independent world truth.
export function getHEarthPlanetaryHorizonZForX(worldX, hemisphere = -1, observerHeight) {
  const horizonRadius = getHEarthDerivedHorizonDistance(observerHeight);
  const x = Math.min(horizonRadius, Math.abs(worldX));
  const zMagnitude = Math.sqrt(Math.max(0, horizonRadius * horizonRadius - x * x));
  return Math.sign(hemisphere || -1) * zMagnitude;
}

export function getHEarthPlanetaryHorizonXForZ(worldZ, hemisphere = -1, observerHeight) {
  const horizonRadius = getHEarthDerivedHorizonDistance(observerHeight);
  const z = Math.min(horizonRadius, Math.abs(worldZ));
  const xMagnitude = Math.sqrt(Math.max(0, horizonRadius * horizonRadius - z * z));
  return Math.sign(hemisphere || -1) * xMagnitude;
}

export function getHEarthPlanetarySag(worldX, worldZ) {
  const projected = regionToHEarthPlanetPoint({ x: worldX, y: 0, z: worldZ });
  return Math.max(0, -projected.y);
}

export function describeHEarthPlanetaryWorldFrame() {
  return freeze({
    ...H_EARTH_PLANETARY_WORLD_FRAME,
    derivedNominalHorizonDistance: getHEarthDerivedHorizonDistance(),
    transformLaw: 'REGION_XZ_TO_SPHERICAL_ANGULAR_DISPLACEMENT_ALL_XYZ_TRANSFORM',
    rejectedPredecessorLaw: 'X_Z_UNCHANGED_PLUS_Y_SAG'
  });
}
