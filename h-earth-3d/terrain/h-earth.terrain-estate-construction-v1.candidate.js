/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1
 *
 * Non-live map-authoring terrain successor. Run8B remains immutable terrain truth.
 * This revision renews mountain asymmetry, waterfall/reservoir scale, coastline,
 * beach morphology, and sandbars for user inspection only.
 */

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from './h-earth.successor-terrain-field.run8b.js';

const freeze = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const bell = (value, center, radius) => {
  const d = Math.abs(value - center) / Math.max(radius, 1e-6);
  if (d >= 1) return 0;
  const retained = 1 - d * d;
  return retained * retained;
};

const GOVERNING_HEAD = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const POSITIVE_REFERENCE = '97003e9de386a8962fb46d0b370005b900a167d6';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID =
  'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1';
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID =
  'H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v4';

function sampleRun8BElevation(worldX, worldZ) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (sample?.valid !== true || !finite(sample.elevation)) {
    throw new Error(`MAP_RENEWAL_SOURCE_SAMPLE_INVALID:${worldX}:${worldZ}`);
  }
  return sample.elevation;
}

const ESTATE_TERRAIN_COMPOSITION = freeze({
  atriumTerrace: freeze({
    id: 'ATRIUM_CROWN_TERRACE',
    center: freeze({ x: 80, z: -172 }),
    radius: freeze({ x: 28, z: 24 }),
    coreRadius: 0.56,
    cutDepth: 1.25,
    purpose: 'PRESERVE_HIGH_360_VIEW_ATRIUM_ANCHOR_WITH_BUILDABLE_CROWN'
  }),
  connectiveSpine: freeze({
    id: 'ESTATE_CONNECTIVE_SADDLE_SPINE',
    points: freeze([
      freeze({ x: 80, z: -172 }),
      freeze({ x: 111, z: -192 }),
      freeze({ x: 136, z: -208 })
    ]),
    coreHalfWidth: 12,
    featherHalfWidth: 28,
    boundedCutDepth: 0.72,
    purpose: 'RESERVE_IRREGULAR_MANOR_CONNECTION_ACROSS_SADDLE_WITHOUT_FINAL_ARCHITECTURE'
  }),
  hillInterfaceTerrace: freeze({
    id: 'LARGE_HILL_EMBEDDED_MANOR_INTERFACE',
    center: freeze({ x: 136, z: -208 }),
    radius: freeze({ x: 34, z: 25 }),
    coreRadius: 0.46,
    cutDepth: 1.9,
    purpose: 'CREATE_TERRAIN_RESPONSIVE_MANOR_INTERFACE_WHILE_PRESERVING_LARGE_HILL_MASS'
  }),
  reservedEnvelope: freeze({ xMinimum: 48, xMaximum: 182, zMinimum: -246, zMaximum: -140 }),
  hiddenVaultReserve: freeze({
    center: freeze({ x: 152, z: -224 }),
    horizontalRadius: freeze({ x: 40, z: 38 }),
    reservedDepthBelowSurface: 38,
    surfaceExpression: 'NONE',
    access: 'INTERNAL_MANOR_ONLY_FOR_NOW',
    purpose: 'PRESERVE_SUBSURFACE_MASS_FOR_SECRET_VAULT_ORCOIN_AND_WATER_INFRASTRUCTURE'
  }),
  finalManorGeometryConstructed: false,
  treatment: 'MULTI_HILL_IRREGULAR_ESTATE_TERRAIN_PREPARATION_WITHOUT_BUILDING_GEOMETRY'
});

const ATRIUM_TARGET_ELEVATION =
  sampleRun8BElevation(ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center.x, ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center.z) -
  ESTATE_TERRAIN_COMPOSITION.atriumTerrace.cutDepth;
const HILL_INTERFACE_TARGET_ELEVATION =
  sampleRun8BElevation(ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center.x, ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center.z) -
  ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.cutDepth;

const RESERVOIR_SOURCE_CENTER = freeze({ x: -44, z: -211 });
const RESERVOIR_SOURCE_ELEVATION = sampleRun8BElevation(RESERVOIR_SOURCE_CENTER.x, RESERVOIR_SOURCE_CENTER.z);
const RESERVOIR_WATER_SURFACE_ELEVATION = clamp(RESERVOIR_SOURCE_ELEVATION - 1.1, 2.2, 12.0);
const RESERVOIR_FLOOR_ELEVATION = RESERVOIR_WATER_SURFACE_ELEVATION - 5.8;

const COASTLINE = freeze({
  beachInlandWidth: 34,
  beachSeawardWidth: 10,
  shelfWidth: 46,
  dryBeachHighElevation: 4.8,
  wetBeachElevation: 0.46,
  shelfFloorElevation: -3.6,
  sandbars: freeze([
    freeze({ id: 'WEST_SANDBAR', center: freeze({ x: -132, z: 2 }), radius: freeze({ x: 48, z: 10 }), rotation: -0.12, crestElevation: 0.72 }),
    freeze({ id: 'CENTRAL_SANDBAR', center: freeze({ x: -12, z: 10 }), radius: freeze({ x: 58, z: 12 }), rotation: 0.07, crestElevation: 0.82 }),
    freeze({ id: 'EAST_SANDBAR', center: freeze({ x: 116, z: 0 }), radius: freeze({ x: 44, z: 9 }), rotation: -0.08, crestElevation: 0.64 })
  ])
});

export function resolveHEarthMapWideShorelineZ(worldX) {
  if (!finite(worldX)) return Number.NaN;
  const longWave = 9.5 * Math.sin((worldX + 34) / 72);
  const mediumWave = 4.6 * Math.sin((worldX - 18) / 31);
  const westCove = -7.5 * bell(worldX, -142, 92);
  const eastPoint = 6.0 * bell(worldX, 118, 84);
  return -47 + longWave + mediumWave + westCove + eastPoint;
}

function rotatedEllipseRadius(worldX, worldZ, zone) {
  const angle = zone.rotation ?? 0;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const dx = worldX - zone.center.x;
  const dz = worldZ - zone.center.z;
  const localX = dx * cosine + dz * sine;
  const localZ = -dx * sine + dz * cosine;
  return Math.hypot(localX / zone.radius.x, localZ / zone.radius.z);
}

function sandbarWeight(worldX, worldZ) {
  let weight = 0;
  for (const bar of COASTLINE.sandbars) {
    const radius = rotatedEllipseRadius(worldX, worldZ, bar);
    weight = Math.max(weight, 1 - smoothstep(0.58, 1, radius));
  }
  return weight;
}

function sandbarTargetElevation(worldX, worldZ) {
  let weighted = 0;
  let total = 0;
  for (const bar of COASTLINE.sandbars) {
    const radius = rotatedEllipseRadius(worldX, worldZ, bar);
    const weight = 1 - smoothstep(0.45, 1, radius);
    weighted += bar.crestElevation * weight;
    total += weight;
  }
  return total > 0 ? weighted / total : H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY - 1;
}

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY = freeze({
  seaLevelY: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY ?? 0,
  coastlineContext: freeze({
    currentShorelineClass: 'RECEDED_LOCAL_COASTLINE_AFTER_BOUNDED_WATER_CONTROL',
    formerWaterExtent: 'FARTHER_INLAND_THAN_CURRENT_BEACH',
    oceanLevelChangedByEstateSystem: false,
    localHydrologyChangedByEstateSystem: true,
    mapPreviewWaterContextAuthorized: true,
    liveWaterMutationAuthorized: false,
    shorelineGeometry: 'IRREGULAR_CURVED_COAST_WITH_GRADED_FULL_BEACH',
    sandbarSystem: 'THREE_SEPARATED_EMERGENT_SANDBARS_WITH_SHALLOW_CHANNELS'
  }),
  waterfall: freeze({
    hiddenUpperSource: freeze({ x: -50, z: -314 }),
    visibleCrest: freeze({ x: -50, z: -278 }),
    landing: freeze({ x: -44, z: -235 }),
    halfWidth: 13,
    transitionHalfWidth: 27,
    terrainChannelCutDepth: 7.2,
    visibleWaterHalfWidth: 7.5,
    sourceNarrative: 'UNDEVELOPED_INACCESSIBLE_UPPER_WATERSHED_BEHIND_MOUNTAIN_BARRIER'
  }),
  reservoir: freeze({
    center: RESERVOIR_SOURCE_CENTER,
    radius: freeze({ x: 52, z: 36 }),
    coreRadius: 0.60,
    rimOuterRadius: 1.30,
    waterSurfaceElevation: RESERVOIR_WATER_SURFACE_ELEVATION,
    floorElevation: RESERVOIR_FLOOR_ELEVATION,
    enclosed: true,
    visibleDrainageToCoast: false,
    concealedPumpIntakeReserved: true,
    pumpConstructionAuthorized: false,
    intendedRead: 'NATURAL_POND_OR_SMALL_LAKE_NOT_MANUFACTURED_PUMP_HOLE'
  }),
  cavern: freeze({
    center: freeze({ x: -7, z: -238 }),
    radius: freeze({ x: 23, z: 17 }),
    coreRadius: 0.56,
    shallowApronCutDepth: 1.3,
    interiorConstructed: false,
    relationship: 'RIGHT_OF_WATERFALL_CONNECTED_INTO_MOUNTAIN_MASS'
  }),
  hiddenInfrastructure: freeze({
    reservoirPumpToVaultRouteReserved: true,
    waterChamberInVaultCompoundReserved: true,
    renderedOnSurface: false,
    constructed: false,
    publicKnowledge: 'SECRET'
  })
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE = freeze({
  profileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  governingHead: GOVERNING_HEAD,
  lockGeneration: 422,
  successorRepairRevision: 6,
  sourceIdentity: freeze({
    classification: 'POSITIVE_DESIGN_SOURCE_NOT_MERGED_MAIN_NOT_AUTOMATIC_TRANSPLANT',
    commit: POSITIVE_REFERENCE,
    tree: '7cd51523649788ad6fb226aea16f6799a5c58177',
    sourceProfileId: 'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2'
  }),
  implementationClass: 'RUN8B_TRUTH_PLUS_ASYMMETRIC_MOUNTAIN_RANGE_FULL_BEACH_SANDBARS_LARGE_RESERVOIR_WIDE_WATERFALL_AND_MULTI_HILL_ESTATE_PREPARATION',
  macroLandforms: freeze([
    freeze({ id: 'REAR_WATERSHED_MASS', center: freeze({ x: -62, z: -300 }), radius: freeze({ x: 206, z: 90 }), amplitude: 11 }),
    freeze({ id: 'WESTERN_HIGH_PEAK', center: freeze({ x: -168, z: -286 }), radius: freeze({ x: 74, z: 58 }), amplitude: 24 }),
    freeze({ id: 'WESTERN_SHOULDER', center: freeze({ x: -118, z: -268 }), radius: freeze({ x: 94, z: 67 }), amplitude: 12 }),
    freeze({ id: 'WATERFALL_LEFT_PEAK', center: freeze({ x: -79, z: -286 }), radius: freeze({ x: 57, z: 54 }), amplitude: 21 }),
    freeze({ id: 'WATERFALL_RIGHT_PEAK', center: freeze({ x: -12, z: -282 }), radius: freeze({ x: 61, z: 56 }), amplitude: 16 }),
    freeze({ id: 'EASTERN_RIDGE', center: freeze({ x: 47, z: -266 }), radius: freeze({ x: 108, z: 74 }), amplitude: 13 }),
    freeze({ id: 'MOUNTAIN_FRONT_APRON', center: freeze({ x: -52, z: -238 }), radius: freeze({ x: 188, z: 78 }), amplitude: 5.5 }),
    freeze({ id: 'FAR_EAST_HIGHLAND', center: freeze({ x: 198, z: -251 }), radius: freeze({ x: 82, z: 78 }), amplitude: 8.5 })
  ]),
  rearBoundaryBarrier: freeze({
    xMinimum: -242,
    xMaximum: 104,
    zFullBy: -308,
    zZeroBy: -251,
    maximumAddedElevation: 13,
    traversalBehindRange: 'PROHIBITED_IN_EVENTUAL_LIVE_INTEGRATION',
    visibilityBehindRange: 'PROHIBITED_IN_EVENTUAL_LIVE_INTEGRATION'
  }),
  mesoLandform: freeze({
    maximumMagnitude: 1.9,
    components: freeze([
      freeze({ direction: freeze({ x: 0.83, z: 0.56 }), frequency: 0.012, phase: 0.37, weight: 0.39 }),
      freeze({ direction: freeze({ x: -0.48, z: 0.88 }), frequency: 0.019, phase: 2.17, weight: 0.34 }),
      freeze({ direction: freeze({ x: 0.67, z: -0.74 }), frequency: 0.028, phase: 4.11, weight: 0.27 })
    ])
  }),
  estateTerrainComposition: ESTATE_TERRAIN_COMPOSITION,
  entryCore: freeze({ xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88, transitionMargin: 8 }),
  coastalProtection: freeze({ fullReliefByZ: -118, zeroReliefByZ: -78 }),
  coastline: COASTLINE,
  hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  virtualNormalRelief: freeze({
    directionalPhases: freeze([
      freeze({ id: 'A', direction: freeze({ x: 0.8164965809277260, y: 0.4082482904638630, z: 0.4082482904638630 }), frequency: 3.306939635357677, offset: 0.37, weight: 0.50 }),
      freeze({ id: 'B', direction: freeze({ x: -0.4082482904638630, y: 0.8164965809277260, z: 0.4082482904638630 }), frequency: 2.7318196987737333, offset: 2.17, weight: 0.30 }),
      freeze({ id: 'C', direction: freeze({ x: 0.4082482904638630, y: -0.4082482904638630, z: 0.8164965809277260 }), frequency: 2.243994752564138, offset: 4.11, weight: 0.20 })
    ]),
    virtualReliefHeightAmplitude: 0.22,
    maximumNormalDeviationDegrees: 22,
    antialiasFootprint: freeze({ fullThrough: 0.45, zeroBy: 0.95 }),
    distanceEnvelope: freeze({ fullInfluenceThrough: 120, zeroInfluenceBy: 300 }),
    slopeEnvelope: freeze({ minimumInfluence: 0.82, maximumInfluence: 1, responseStart: 0.05, responseEnd: 0.55 }),
    authoringInspectorScale: 0.42
  }),
  baseTruthElevationMutation: false,
  baseTruthNormalMutation: false,
  presentationElevationEnabled: true,
  presentationNormalPerturbation: true,
  physicalEstateTerrainPreparationEnabled: true,
  mapHydrologyContextEnabled: true,
  deterministic: true
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE = freeze({
  contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  successorRepairRevision: 6,
  governingHead: GOVERNING_HEAD,
  baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  baseTerrainFieldGenerationRevision: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  worldDomain: freeze({ ...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain }),
  reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  mapWideApplication: 'ALL_VALID_RUN8B_TERRAIN_SAMPLES_WITH_BOUNDED_AUTHORING_RELIEF_HYDROLOGY_COASTAL_MORPHOLOGY_AND_ESTATE_PREPARATION',
  reservedEstateEnvelope: freeze({
    bounds: ESTATE_TERRAIN_COMPOSITION.reservedEnvelope,
    atriumAnchor: ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center,
    connectiveSaddle: ESTATE_TERRAIN_COMPOSITION.connectiveSpine.points[1],
    largeHillInterface: ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center,
    hiddenVaultReserve: ESTATE_TERRAIN_COMPOSITION.hiddenVaultReserve,
    effect: 'IRREGULAR_MULTI_HILL_ESTATE_TERRAIN_COMPOSITION_WITHOUT_MANOR_GEOMETRY',
    manorGeometryConstructed: false
  }),
  hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  coastline: COASTLINE,
  preservation: freeze({
    run8BTruthElevationMutated: false,
    run8BSourceMutated: false,
    liveRuntimeMutated: false,
    liveCameraMutated: false,
    liveNavigationMutated: false,
    liveWaterMutated: false,
    registryMutated: false,
    manorGeometryConstructed: false,
    cavernInteriorConstructed: false,
    vaultInteriorConstructed: false,
    deploymentOrReleaseCreated: false
  })
});

function ellipticalBump(worldX, worldZ, landform) {
  const dx = (worldX - landform.center.x) / landform.radius.x;
  const dz = (worldZ - landform.center.z) / landform.radius.z;
  const radiusSquared = dx * dx + dz * dz;
  if (radiusSquared >= 1) return 0;
  const retained = 1 - radiusSquared;
  const base = landform.amplitude * retained * retained;
  const irregularity = 0.82 +
    0.10 * Math.sin(worldX * 0.031 + worldZ * 0.013 + landform.amplitude) +
    0.08 * Math.sin(worldX * 0.017 - worldZ * 0.027 + landform.radius.x * 0.01);
  return base * clamp(irregularity, 0.64, 1.16);
}

function ellipseRadius(worldX, worldZ, zone) {
  return Math.hypot((worldX - zone.center.x) / zone.radius.x, (worldZ - zone.center.z) / zone.radius.z);
}
function ellipseWeight(worldX, worldZ, zone) {
  const radius = ellipseRadius(worldX, worldZ, zone);
  return 1 - smoothstep(zone.coreRadius ?? 0.6, 1, radius);
}
function distanceToSegment(worldX, worldZ, start, end) {
  const vx = end.x - start.x;
  const vz = end.z - start.z;
  const lengthSquared = vx * vx + vz * vz || 1;
  const t = clamp(((worldX - start.x) * vx + (worldZ - start.z) * vz) / lengthSquared, 0, 1);
  const closestX = start.x + vx * t;
  const closestZ = start.z + vz * t;
  return { distance: Math.hypot(worldX - closestX, worldZ - closestZ), t };
}
function polylineDistance(worldX, worldZ, points) {
  let best = { distance: Infinity, progress: 0 };
  const segmentCount = Math.max(1, points.length - 1);
  for (let index = 0; index < points.length - 1; index += 1) {
    const candidate = distanceToSegment(worldX, worldZ, points[index], points[index + 1]);
    if (candidate.distance < best.distance) best = { distance: candidate.distance, progress: (index + candidate.t) / segmentCount };
  }
  return best;
}
function insideRectangle(worldX, worldZ, rectangle) {
  return worldX >= rectangle.xMinimum && worldX <= rectangle.xMaximum && worldZ >= rectangle.zMinimum && worldZ <= rectangle.zMaximum;
}
function distanceOutsideRectangle(worldX, worldZ, rectangle) {
  const dx = Math.max(rectangle.xMinimum - worldX, 0, worldX - rectangle.xMaximum);
  const dz = Math.max(rectangle.zMinimum - worldZ, 0, worldZ - rectangle.zMaximum);
  return Math.hypot(dx, dz);
}
function rectangleReleaseEnvelope(worldX, worldZ, rectangle) {
  return smoothstep(0, rectangle.transitionMargin, distanceOutsideRectangle(worldX, worldZ, rectangle));
}
function coastalReleaseEnvelope(worldZ) {
  const coast = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.coastalProtection;
  return 1 - smoothstep(coast.fullReliefByZ, coast.zeroReliefByZ, worldZ);
}

function rearBoundaryBarrierOffset(worldX, worldZ) {
  const barrier = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.rearBoundaryBarrier;
  const xWeight = smoothstep(barrier.xMinimum, barrier.xMinimum + 34, worldX) *
    (1 - smoothstep(barrier.xMaximum - 34, barrier.xMaximum, worldX));
  const zWeight = 1 - smoothstep(barrier.zFullBy, barrier.zZeroBy, worldZ);
  const ridgeVariation = 0.72 +
    0.14 * Math.sin((worldX + 92) / 31) +
    0.09 * Math.sin((worldX - 11) / 17) +
    0.10 * bell(worldX, -170, 70) +
    0.07 * bell(worldX, -28, 58);
  return barrier.maximumAddedElevation * xWeight * zWeight * clamp(ridgeVariation, 0.48, 1.12);
}

function waterfallCorridorWeight(worldX, worldZ) {
  const waterfall = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.waterfall;
  const result = distanceToSegment(worldX, worldZ, waterfall.visibleCrest, waterfall.landing);
  return 1 - smoothstep(waterfall.halfWidth, waterfall.transitionHalfWidth, result.distance);
}
function reservoirWeight(worldX, worldZ) {
  const reservoir = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir;
  return 1 - smoothstep(reservoir.coreRadius, 1, ellipseRadius(worldX, worldZ, reservoir));
}
function reservoirRimWeight(worldX, worldZ) {
  const reservoir = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir;
  const radius = ellipseRadius(worldX, worldZ, reservoir);
  return smoothstep(0.74, 0.96, radius) * (1 - smoothstep(1.06, reservoir.rimOuterRadius, radius));
}
function cavernReserveWeight(worldX, worldZ) {
  return ellipseWeight(worldX, worldZ, H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.cavern);
}

function estatePreparation(worldX, worldZ, basePresentationElevation) {
  const estate = ESTATE_TERRAIN_COMPOSITION;
  const atriumWeight = ellipseWeight(worldX, worldZ, estate.atriumTerrace);
  const interfaceWeight = ellipseWeight(worldX, worldZ, estate.hillInterfaceTerrace);
  const spine = polylineDistance(worldX, worldZ, estate.connectiveSpine.points);
  const spineWeight = 1 - smoothstep(estate.connectiveSpine.coreHalfWidth, estate.connectiveSpine.featherHalfWidth, spine.distance);
  let elevation = basePresentationElevation;
  elevation = mix(elevation, ATRIUM_TARGET_ELEVATION, atriumWeight);
  elevation -= estate.connectiveSpine.boundedCutDepth * spineWeight;
  elevation = mix(elevation, HILL_INTERFACE_TARGET_ELEVATION, interfaceWeight);
  return {
    elevation,
    weight: Math.max(atriumWeight, spineWeight, interfaceWeight),
    zoneWeights: freeze({ atrium: atriumWeight, connectiveSpine: spineWeight, hillInterface: interfaceWeight }),
    atriumTargetElevation: ATRIUM_TARGET_ELEVATION,
    hillInterfaceTargetElevation: HILL_INTERFACE_TARGET_ELEVATION
  };
}

function applyCoastalTerrain(worldX, worldZ, elevation) {
  const shorelineZ = resolveHEarthMapWideShorelineZ(worldX);
  const distanceToShore = worldZ - shorelineZ;
  const coast = COASTLINE;
  const sea = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY;
  const inlandWeight = 1 - smoothstep(-coast.beachInlandWidth - 12, -coast.beachInlandWidth, distanceToShore);
  const coastalZoneWeight = smoothstep(-coast.beachInlandWidth - 16, -coast.beachInlandWidth, distanceToShore) *
    (1 - smoothstep(coast.shelfWidth, coast.shelfWidth + 18, distanceToShore));

  let target = elevation;
  let beachWeight = 0;
  let wetSandWeight = 0;
  let shelfWeight = 0;

  if (distanceToShore >= -coast.beachInlandWidth && distanceToShore <= 0) {
    const t = smoothstep(-coast.beachInlandWidth, 0, distanceToShore);
    target = mix(coast.dryBeachHighElevation, coast.wetBeachElevation, t);
    beachWeight = 1;
    wetSandWeight = smoothstep(-10, 2, distanceToShore);
  } else if (distanceToShore > 0 && distanceToShore <= coast.shelfWidth) {
    const t = smoothstep(0, coast.shelfWidth, distanceToShore);
    target = mix(coast.wetBeachElevation, sea + coast.shelfFloorElevation, t);
    beachWeight = 1 - smoothstep(0, coast.beachSeawardWidth, distanceToShore);
    wetSandWeight = 1 - smoothstep(0, 7, distanceToShore);
    shelfWeight = smoothstep(0, 12, distanceToShore);
  }

  let result = mix(elevation, target, coastalZoneWeight);
  const barWeight = sandbarWeight(worldX, worldZ);
  if (barWeight > 0) {
    const barTarget = sandbarTargetElevation(worldX, worldZ);
    result = mix(result, Math.max(barTarget, sea + 0.38), barWeight);
  }

  return {
    elevation: result,
    shorelineZ,
    distanceToShore,
    beachWeight: beachWeight * coastalZoneWeight,
    wetSandWeight: wetSandWeight * coastalZoneWeight,
    shelfWeight: shelfWeight * coastalZoneWeight,
    sandbarWeight: barWeight,
    coastalZoneWeight,
    inlandUnchangedWeight: inlandWeight
  };
}

export function resolveHEarthMapWideGeometricProtectionEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  return Math.min(rectangleReleaseEnvelope(worldX, worldZ, profile.entryCore), coastalReleaseEnvelope(worldZ));
}

export function sampleHEarthMapWideEnvironmentalReliefOffset(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  const macro = profile.macroLandforms.reduce((sum, landform) => sum + ellipticalBump(worldX, worldZ, landform), 0);
  let mesoSignal = 0;
  for (const component of profile.mesoLandform.components) {
    const phase = (worldX * component.direction.x + worldZ * component.direction.z) * component.frequency + component.phase;
    mesoSignal += Math.sin(phase) * component.weight;
  }
  const meso = mesoSignal * profile.mesoLandform.maximumMagnitude;
  const barrier = rearBoundaryBarrierOffset(worldX, worldZ);
  return (macro + meso + barrier) * resolveHEarthMapWideGeometricProtectionEnvelope(worldX, worldZ);
}

function applyHydrologyTerrain(worldX, worldZ, basePresentationElevation) {
  const hydro = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY;
  const waterfallWeight = waterfallCorridorWeight(worldX, worldZ);
  const reservoirBasinWeight = reservoirWeight(worldX, worldZ);
  const reservoirRim = reservoirRimWeight(worldX, worldZ);
  const cavernWeight = cavernReserveWeight(worldX, worldZ);
  let elevation = basePresentationElevation;
  elevation -= waterfallWeight * hydro.waterfall.terrainChannelCutDepth;
  elevation += reservoirRim * 1.05;
  elevation = mix(elevation, hydro.reservoir.floorElevation, reservoirBasinWeight);
  elevation -= cavernWeight * hydro.cavern.shallowApronCutDepth;
  return freeze({ elevation, waterfallWeight, reservoirWeight: reservoirBasinWeight, reservoirRimWeight: reservoirRim, cavernReserveWeight: cavernWeight });
}

export function sampleHEarthMapWidePresentationReliefOffset(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) return Number.NaN;
  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(worldX, worldZ);
  const hydro = applyHydrologyTerrain(worldX, worldZ, source.elevation + environmentalReliefOffset);
  const estate = estatePreparation(worldX, worldZ, hydro.elevation);
  const coastal = applyCoastalTerrain(worldX, worldZ, estate.elevation);
  return coastal.elevation - source.elevation;
}

export function sampleHEarthMapWideReliefSignal(worldX, worldY, worldZ) {
  if (![worldX, worldY, worldZ].every(finite)) return Number.NaN;
  let signal = 0;
  for (const phase of H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief.directionalPhases) {
    const dot = worldX * phase.direction.x + worldY * phase.direction.y + worldZ * phase.direction.z;
    signal += Math.sin(dot * phase.frequency + phase.offset) * phase.weight;
  }
  return signal;
}
export function sampleHEarthMapWideVirtualReliefHeight(worldX, worldY, worldZ) {
  const signal = sampleHEarthMapWideReliefSignal(worldX, worldY, worldZ);
  return finite(signal) ? signal * 0.22 : Number.NaN;
}
export function resolveHEarthMapWideReliefEnvelope({ distanceToCamera, slope, maximumPhaseFootprint = 0 } = {}) {
  if (![distanceToCamera, slope, maximumPhaseFootprint].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief;
  const distanceEnvelope = 1 - smoothstep(profile.distanceEnvelope.fullInfluenceThrough, profile.distanceEnvelope.zeroInfluenceBy, Math.max(0, distanceToCamera));
  const slopeEnvelope = mix(profile.slopeEnvelope.minimumInfluence, profile.slopeEnvelope.maximumInfluence, smoothstep(profile.slopeEnvelope.responseStart, profile.slopeEnvelope.responseEnd, clamp(slope, 0, 1)));
  const antialiasEnvelope = 1 - smoothstep(profile.antialiasFootprint.fullThrough, profile.antialiasFootprint.zeroBy, Math.max(0, maximumPhaseFootprint));
  return clamp(distanceEnvelope * slopeEnvelope * antialiasEnvelope, 0, 1);
}

export function isInsideHEarthReservedEstateEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite) || !insideRectangle(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.reservedEnvelope)) return false;
  const atrium = ellipseWeight(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.atriumTerrace);
  const hill = ellipseWeight(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace);
  const spine = polylineDistance(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.connectiveSpine.points);
  const spineWeight = 1 - smoothstep(ESTATE_TERRAIN_COMPOSITION.connectiveSpine.coreHalfWidth, ESTATE_TERRAIN_COMPOSITION.connectiveSpine.featherHalfWidth, spine.distance);
  return Math.max(atrium, hill, spineWeight) > 0.05;
}

export function sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ) {
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) {
    return freeze({ valid: false, status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_REJECTED', contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID, worldX, worldZ, sourceStatus: source?.status ?? null });
  }
  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(source.world.x, source.world.z);
  const hydro = applyHydrologyTerrain(source.world.x, source.world.z, source.elevation + environmentalReliefOffset);
  const estate = estatePreparation(source.world.x, source.world.z, hydro.elevation);
  const coastal = applyCoastalTerrain(source.world.x, source.world.z, estate.elevation);
  const presentationElevation = coastal.elevation;
  const presentationReliefOffset = presentationElevation - source.elevation;
  const reliefSignal = sampleHEarthMapWideReliefSignal(source.world.x, source.elevation, source.world.z);
  return freeze({
    valid: true,
    status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    sourceContractId: source.contractId,
    sourceGenerationRevision: source.generationRevision,
    world: source.world,
    elevation: source.elevation,
    geometricElevation: source.elevation,
    geometricElevationMutated: false,
    presentationElevation,
    presentationReliefOffset,
    environmentalReliefOffset,
    sitePreparationOffset: estate.elevation - hydro.elevation,
    sitePreparation: freeze({ active: estate.weight > 0, fullyPrepared: estate.weight >= 1 - 1e-9, weight: estate.weight, zoneWeights: estate.zoneWeights, atriumTargetElevation: estate.atriumTargetElevation, hillInterfaceTargetElevation: estate.hillInterfaceTargetElevation, treatment: ESTATE_TERRAIN_COMPOSITION.treatment }),
    hydrology: freeze({ waterfallWeight: hydro.waterfallWeight, reservoirWeight: hydro.reservoirWeight, reservoirRimWeight: hydro.reservoirRimWeight, cavernReserveWeight: hydro.cavernReserveWeight, reservoirWaterSurfaceElevation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.waterSurfaceElevation, reservoirFloorElevation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.floorElevation, enclosedReservoir: true, visibleDrainageToCoast: false }),
    coastline: freeze({ shorelineZ: coastal.shorelineZ, distanceToShore: coastal.distanceToShore, beachWeight: coastal.beachWeight, wetSandWeight: coastal.wetSandWeight, shelfWeight: coastal.shelfWeight, sandbarWeight: coastal.sandbarWeight, fullBeachConstructed: true, sandbarsConstructed: true }),
    presentationGeometryIsCandidateOnly: true,
    normal: source.normal ?? null,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    reliefSignal,
    virtualReliefHeight: reliefSignal * 0.22,
    insideReservedEstateEnvelope: isInsideHEarthReservedEstateEnvelope(source.world.x, source.world.z),
    rearBoundaryBarrierOffset: rearBoundaryBarrierOffset(source.world.x, source.world.z),
    manorGeometryConstructed: false,
    cavernInteriorConstructed: false,
    vaultInteriorConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentTerrainCandidate() {
  const domain = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE.worldDomain;
  const issues = [];
  const entry = sampleHEarthMapWideEnvironmentTerrainCandidate(0, -96);
  const atrium = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  const saddle = sampleHEarthMapWideEnvironmentTerrainCandidate(111, -192);
  const hillInterface = sampleHEarthMapWideEnvironmentTerrainCandidate(136, -208);
  const reservoir = sampleHEarthMapWideEnvironmentTerrainCandidate(-44, -211);
  const waterfall = sampleHEarthMapWideEnvironmentTerrainCandidate(-48, -252);
  const cavern = sampleHEarthMapWideEnvironmentTerrainCandidate(-7, -238);
  const rearBarrier = sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -310);
  const beach = sampleHEarthMapWideEnvironmentTerrainCandidate(0, resolveHEarthMapWideShorelineZ(0) - 12);
  const centralSandbar = sampleHEarthMapWideEnvironmentTerrainCandidate(-12, 10);
  const reliefWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(-96, -271),
    sampleHEarthMapWideEnvironmentTerrainCandidate(-8, -258),
    sampleHEarthMapWideEnvironmentTerrainCandidate(196, -252)
  ];
  const edges = [sampleHEarthMapWideEnvironmentTerrainCandidate(domain.xMinimum, domain.zMinimum), sampleHEarthMapWideEnvironmentTerrainCandidate(domain.xMaximum, domain.zMaximum)];
  const witnesses = [entry, atrium, saddle, hillInterface, reservoir, waterfall, cavern, rearBarrier, beach, centralSandbar, ...reliefWitnesses, ...edges];
  if (witnesses.some((sample) => sample.valid !== true)) issues.push('MAP_WIDE_WITNESS_SAMPLE_INVALID');
  if (witnesses.some((sample) => !finite(sample.elevation) || !finite(sample.presentationElevation))) issues.push('MAP_WIDE_WITNESS_ELEVATION_NONFINITE');
  if (witnesses.some((sample) => sample.geometricElevationMutated !== false)) issues.push('RUN8B_GEOMETRIC_TRUTH_MUTATED');
  if (Math.abs(entry.presentationReliefOffset) > 1e-9) issues.push('ENTRY_REGION_PRESENTATION_OFFSET_NONZERO');
  if (!reliefWitnesses.some((sample) => Math.abs(sample.presentationReliefOffset) >= 4)) issues.push('MATERIAL_MACRO_RELIEF_NOT_DEMONSTRATED');
  if (!(rearBarrier.rearBoundaryBarrierOffset > 2)) issues.push('REAR_MOUNTAIN_BARRIER_NOT_EXTENDED_TO_WORLD_EDGE');
  if (!(atrium.sitePreparation?.zoneWeights?.atrium > 0.9)) issues.push('ATRIUM_TERRACE_NOT_PREPARED');
  if (!(saddle.sitePreparation?.zoneWeights?.connectiveSpine > 0.9)) issues.push('ESTATE_CONNECTIVE_SADDLE_NOT_RESERVED');
  if (!(hillInterface.sitePreparation?.zoneWeights?.hillInterface > 0.9)) issues.push('LARGE_HILL_ESTATE_INTERFACE_NOT_PREPARED');
  if (!(reservoir.hydrology?.reservoirWeight > 0.9)) issues.push('RESERVOIR_BASIN_NOT_CONSTRUCTED');
  if (!(reservoir.presentationElevation < reservoir.hydrology.reservoirWaterSurfaceElevation - 4)) issues.push('RESERVOIR_DEPTH_INSUFFICIENT');
  if (!(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.radius.x >= 48 && H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.radius.z >= 32)) issues.push('RESERVOIR_NOT_SMALL_LAKE_SCALE');
  if (!(waterfall.hydrology?.waterfallWeight > 0.5 && H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.waterfall.halfWidth >= 12)) issues.push('WATERFALL_CLEFT_NOT_BROAD_ENOUGH');
  if (!(cavern.hydrology?.cavernReserveWeight > 0.5)) issues.push('CAVERN_EXTERIOR_RESERVE_NOT_CONSTRUCTED');
  if (!(beach.coastline?.beachWeight > 0.5 && beach.coastline?.fullBeachConstructed === true)) issues.push('FULL_BEACH_NOT_CONSTRUCTED');
  if (!(centralSandbar.coastline?.sandbarWeight > 0.5 && centralSandbar.presentationElevation > H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY)) issues.push('SANDBAR_NOT_EMERGENT');
  if (witnesses.some((sample) => !finite(sample.virtualReliefHeight))) issues.push('VIRTUAL_RELIEF_WITNESS_NONFINITE');
  if (witnesses.some((sample) => sample.manorGeometryConstructed !== false || sample.cavernInteriorConstructed !== false || sample.vaultInteriorConstructed !== false)) issues.push('DEFERRED_INTERIOR_OR_MANOR_SCOPE_VIOLATION');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_PASS' : 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_FAIL',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    successorRepairRevision: 6,
    witnesses,
    estateTerrainComposition: freeze({ atriumTargetElevation: ATRIUM_TARGET_ELEVATION, hillInterfaceTargetElevation: HILL_INTERFACE_TARGET_ELEVATION, reservedEnvelope: ESTATE_TERRAIN_COMPOSITION.reservedEnvelope }),
    hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
    coastline: COASTLINE,
    run8BTruthElevationMutation: false,
    candidatePresentationElevationConstructed: true,
    physicalEstateTerrainPreparationConstructed: true,
    mapHydrologyContextConstructed: true,
    fullBeachConstructed: true,
    sandbarsConstructed: true,
    manorGeometryConstructed: false,
    issues: freeze(issues)
  });
}

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION = evaluateHEarthMapWideEnvironmentTerrainCandidate();

if (H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible !== true) {
  throw new Error(`H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_FAIL:${JSON.stringify(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.issues)}`);
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE;
