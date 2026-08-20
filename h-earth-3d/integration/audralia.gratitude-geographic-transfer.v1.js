/**
 * AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1
 *
 * One-world transfer authority between canonical Gratitude regional geography
 * and the existing Audralia planetary representation. Geographic identity is
 * canonical; rendering radius is representational. This module intentionally
 * exposes compatibility aliases used by the current Audralia renderer/runtime
 * so those consumers can be rebound without changing zoom, camera, weather or
 * H-Earth proximity semantics.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';
import { H_EARTH_TERRAIN_FORMATIONS } from '../terrain/h-earth.terrain-formations.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as PROTECTED_LOCAL_HYDROLOGY,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE as LEGACY_LOCAL_PRESENTATION,
  resolveHEarthMapWideReservoirBoundaryPoint as resolveProtectedReservoirBoundaryPoint
} from '../terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freeze(nested, seen);
  return Object.freeze(value);
};
const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const smoothstep = (a, b, value) => {
  if (a === b) return value < a ? 0 : 1;
  const t = clamp((value - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const bell = (value, center, radius) => {
  const d = Math.abs(value - center) / Math.max(radius, 1e-9);
  if (d >= 1) return 0;
  const retained = 1 - d * d;
  return retained * retained;
};

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID =
  'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER = freeze({
  contractId: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  worldIdentity: 'AUDRALIA',
  continentIdentity: 'GRATITUDE',
  proximityExpression: 'H_EARTH',
  worldLaw: 'ONE_WORLD_ONE_GEOGRAPHY_MULTIPLE_SCALES_OF_ACCESS',
  sourceTerrainContractId: H_EARTH_TERRAIN_FIELD.contractId,
  sourceFormationContractId: 'H_EARTH_TERRAIN_FORMATIONS_RUN_6B_v2_LATTICE_SEMANTIC_ALIGNMENT',
  coordinateLaw: 'GEOGRAPHIC_POSITION_CANONICAL_RENDERING_RADIUS_REPRESENTATIONAL',
  lodLaw: 'LOD_CHANGES_SAMPLING_DENSITY_NOT_GEOGRAPHIC_STATE',
  completionLaw: 'FIXED_RESOLVED_GEOGRAPHY_THEN_DETERMINISTIC_CONSTRAINED_CONTINUATION',
  resolvedEnvelope: freeze({ ...H_EARTH_TERRAIN_FIELD.worldDomain }),
  resolvedCore: freeze({ ...H_EARTH_TERRAIN_FIELD.coreDomain }),
  coastalSystemId: H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
  inlandWatershedSystemId: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
  otherContinentsCanonical: false,
  hEarthQualifiedPresentationRadiusMutated: false,
  audraliaPresentationRadiusAuthorityCreated: false,
  weatherAuthorityCreated: false,
  cloudAuthorityCreated: false,
  cameraAuthorityCreated: false,
  zoomAuthorityCreated: false
});

const FIXED_COASTAL_ORDER = freeze([
  'GRATITUDE_WESTERN_PENINSULA',
  'GRATITUDE_WESTERN_GULF',
  'GRATITUDE_CENTRAL_HEADLAND',
  'GRATITUDE_SANCTUARY_BAY',
  'GRATITUDE_HARBOR_HEADLAND',
  'GRATITUDE_BAY',
  'GRATITUDE_EASTERN_HEADLAND',
  'GRATITUDE_EASTERN_PENINSULA'
]);

export const AUDRALIA_GRATITUDE_FIXED_GEOGRAPHIC_CONTROLS = freeze({
  coastalOrder: FIXED_COASTAL_ORDER,
  coast: H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  inland: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  formations: H_EARTH_TERRAIN_FORMATIONS
});

/**
 * Deterministic continuation of the already-canonical regional shoreline.
 * Within the canonical extended world envelope the canonical shoreline is
 * used directly. Beyond that envelope, a low-frequency continuation departs
 * from the boundary tangent without changing any resolved named feature.
 */
export function resolveAudraliaGratitudeShorelineZ(worldX) {
  if (!finite(worldX)) return Number.NaN;
  const domain = H_EARTH_TERRAIN_FIELD.worldDomain;
  if (worldX >= domain.xMinimum && worldX <= domain.xMaximum) {
    return getHEarthCanonicalShorelineZ(worldX);
  }
  const boundaryX = worldX < domain.xMinimum ? domain.xMinimum : domain.xMaximum;
  const side = worldX < domain.xMinimum ? -1 : 1;
  const boundaryZ = getHEarthCanonicalShorelineZ(boundaryX);
  const probe = 8;
  const interiorX = boundaryX - side * probe;
  const interiorZ = getHEarthCanonicalShorelineZ(interiorX);
  const tangent = (boundaryZ - interiorZ) / probe * side;
  const d = Math.abs(worldX - boundaryX);
  const tangentEnvelope = 1 - smoothstep(280, 920, d);
  const broad = 16 * Math.sin((worldX + side * 137) / 410)
    + 7 * Math.sin((worldX - side * 91) / 173);
  return boundaryZ + tangent * d * tangentEnvelope + broad * smoothstep(120, 760, d);
}

export const resolveHEarthMapWideShorelineZ = resolveAudraliaGratitudeShorelineZ;

export function sampleAudraliaGratitudeTerrain(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) {
    return freeze({ valid: false, status: 'AUDRALIA_GRATITUDE_TRANSFER_REJECTED_NONFINITE', worldX, worldZ });
  }
  const canonical = sampleHEarthTerrainField(worldX, worldZ);
  if (canonical?.valid !== true) {
    return freeze({ valid: false, status: 'AUDRALIA_GRATITUDE_TRANSFER_SOURCE_INVALID', worldX, worldZ });
  }
  const shorelineZ = resolveAudraliaGratitudeShorelineZ(worldX);
  const shorelineDistance = shorelineZ - worldZ;
  const beachWeight = smoothstep(-4, 4, shorelineDistance) * (1 - smoothstep(34, 52, shorelineDistance));
  const wetSandWeight = smoothstep(-2, 2, shorelineDistance) * (1 - smoothstep(8, 15, shorelineDistance));
  const protectedPresentation = LEGACY_LOCAL_PRESENTATION?.worldDomain &&
    worldX >= H_EARTH_TERRAIN_FIELD.coreDomain.xMinimum &&
    worldX <= H_EARTH_TERRAIN_FIELD.coreDomain.xMaximum &&
    worldZ >= H_EARTH_TERRAIN_FIELD.coreDomain.zMinimum &&
    worldZ <= H_EARTH_TERRAIN_FIELD.coreDomain.zMaximum
      ? LEGACY_LOCAL_PRESENTATION
      : null;
  return freeze({
    valid: true,
    status: 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_SAMPLE_COMPLETE',
    contractId: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    worldX,
    worldZ,
    world: canonical.world,
    elevation: canonical.elevation,
    presentationElevation: canonical.elevation,
    normal: canonical.normal,
    slope: canonical.slope,
    slopeClass: canonical.slopeClass,
    curvature: canonical.curvature,
    curvatureClass: canonical.curvatureClass,
    materialProfile: canonical.materialProfile,
    shorelineZ,
    shorelineDistance,
    coastalSystemId: canonical.coastalSystemId,
    inlandMountainWatershedSystemId: canonical.inlandMountainWatershedSystemId,
    coastline: freeze({ beachWeight, wetSandWeight, canonical: true }),
    sitePreparation: freeze({ weight: 0, authorityCreated: false }),
    insideReservedEstateEnvelope: false,
    protectedLocalPresentationReferenceAvailable: Boolean(protectedPresentation),
    geographyAuthority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
  });
}

export const sampleHEarthMapWideEnvironmentTerrainCandidate = sampleAudraliaGratitudeTerrain;

// Local reservoir/waterfall relationships remain protected inputs. They do not
// own the continental coastline, continental completion, or planetary scale.
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY = PROTECTED_LOCAL_HYDROLOGY;
export const resolveHEarthMapWideReservoirBoundaryPoint = resolveProtectedReservoirBoundaryPoint;

// Compatibility packet for the current planetary renderer. Only sandbar/local
// hydrology presentation data are inherited from the predecessor candidate;
// continental coastline and elevation authority are canonicalized above.
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE = freeze({
  contractId: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  worldDomain: freeze({ ...H_EARTH_TERRAIN_FIELD.worldDomain }),
  coastline: freeze({
    systemId: H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
    sandbars: freeze([...(LEGACY_LOCAL_PRESENTATION?.coastline?.sandbars ?? [])]),
    authority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
  }),
  hydrology: PROTECTED_LOCAL_HYDROLOGY,
  coastalSystem: H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  inlandMountainWatershedSystem: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  geographicTransferAuthority: AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  deterministic: true
});

export function describeAudraliaGratitudeGeographicTransfer() {
  return freeze({
    ...AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER,
    fixedCoastalOrder: FIXED_COASTAL_ORDER,
    formationCount: Object.keys(H_EARTH_TERRAIN_FORMATIONS).length,
    canonicalWorldDomain: freeze({ ...H_EARTH_TERRAIN_FIELD.worldDomain }),
    protectedLocalHydrology: true,
    legacyContinentalGeographyAuthority: false
  });
}
