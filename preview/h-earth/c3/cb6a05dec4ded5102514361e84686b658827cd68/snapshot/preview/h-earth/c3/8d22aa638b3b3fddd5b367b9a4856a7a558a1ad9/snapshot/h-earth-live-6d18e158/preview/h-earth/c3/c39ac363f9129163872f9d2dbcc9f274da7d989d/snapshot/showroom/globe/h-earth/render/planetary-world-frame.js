/**
 * /showroom/globe/h-earth/render/planetary-world-frame.js
 *
 * H_EARTH_C3C3R4_PLANETARY_WORLD_FRAME_v1
 *
 * One shared world-space curvature authority for visible continuation beyond
 * the established H-Earth playable region. The existing navigable terrain
 * remains a protected local tangent patch. Ocean and distant non-navigable land
 * consume this same transform so the visible world can no longer terminate as
 * independent rectangular edge treatments.
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

export const H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID =
  'H_EARTH_C3C3R4_SHARED_PLANETARY_WORLD_FRAME_v1';

export const H_EARTH_PLANETARY_WORLD_FRAME = freeze({
  contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  frameClass: 'LOCAL_TANGENT_PATCH_WITH_SHARED_CURVED_VISIBLE_CONTINUATION',
  tangentOrigin: freeze({ x: 0, y: 0, z: 0 }),
  protectedTangentRadius: 1500,
  curvatureBlendWidth: 520,
  effectivePlanetRadius: 12000,
  maximumVisibleSag: 520,
  visibleHorizonRadius: 4200,
  navigationAuthorityExpansion: false,
  collisionAuthorityExpansion: false,
  accessibleRegionExpansion: false,
  viewportFixedCurvature: false,
  sharedConsumersRequired: freeze(['OPEN_WATER', 'DISTANT_LAND_CONTINUATION']),
  rectangularTerminalGeometryProhibited: true,
  localTerrainWarpProhibited: true,
  localShorelineWarpProhibited: true
});

export function getHEarthPlanetaryRadialDistance(worldX, worldZ) {
  return Math.hypot(worldX - H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.x,
    worldZ - H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.z);
}

export function getHEarthPlanetaryCurvatureBlend(worldX, worldZ) {
  const radial = getHEarthPlanetaryRadialDistance(worldX, worldZ);
  const start = H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius;
  const width = H_EARTH_PLANETARY_WORLD_FRAME.curvatureBlendWidth;
  return smoothstep01((radial - start) / width);
}

export function getHEarthPlanetarySag(worldX, worldZ) {
  const radial = getHEarthPlanetaryRadialDistance(worldX, worldZ);
  const start = H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius;
  if (radial <= start) return 0;
  const radius = H_EARTH_PLANETARY_WORLD_FRAME.effectivePlanetRadius;
  const rawSag = Math.max(0, (radial * radial - start * start) / (2 * radius));
  const blend = getHEarthPlanetaryCurvatureBlend(worldX, worldZ);
  return Math.min(H_EARTH_PLANETARY_WORLD_FRAME.maximumVisibleSag, rawSag * blend);
}

export function projectHEarthVisibleContinuationPoint({ x, y, z }) {
  const sag = getHEarthPlanetarySag(x, z);
  return freeze({
    x,
    y: y - sag,
    z,
    sag,
    curvatureBlend: getHEarthPlanetaryCurvatureBlend(x, z),
    radialDistance: getHEarthPlanetaryRadialDistance(x, z),
    contractId: H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID
  });
}

export function getHEarthPlanetaryHorizonZForX(worldX, hemisphere = -1) {
  const radius = H_EARTH_PLANETARY_WORLD_FRAME.visibleHorizonRadius;
  const x = Math.min(radius - 1e-6, Math.abs(worldX));
  const zMagnitude = Math.sqrt(Math.max(0, radius * radius - x * x));
  return Math.sign(hemisphere || -1) * zMagnitude;
}

export function getHEarthPlanetaryHorizonXForZ(worldZ, hemisphere = -1) {
  const radius = H_EARTH_PLANETARY_WORLD_FRAME.visibleHorizonRadius;
  const z = Math.min(radius - 1e-6, Math.abs(worldZ));
  const xMagnitude = Math.sqrt(Math.max(0, radius * radius - z * z));
  return Math.sign(hemisphere || -1) * xMagnitude;
}

export function describeHEarthPlanetaryWorldFrame() {
  return H_EARTH_PLANETARY_WORLD_FRAME;
}
