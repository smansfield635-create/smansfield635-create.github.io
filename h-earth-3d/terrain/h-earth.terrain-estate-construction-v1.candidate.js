/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1
 *
 * Non-live terrain-authoring successor. Run8B remains immutable terrain truth.
 * This revision adds map-scale mountain depth, a bounded waterfall/reservoir/
 * cavern spatial system, and multi-hill estate terrain preparation. No live
 * runtime, camera, navigation, water system, manor geometry, merge, deployment,
 * or release authority is created here.
 */

import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from './h-earth.successor-terrain-field.run8b.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const GOVERNING_HEAD = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const POSITIVE_REFERENCE = '97003e9de386a8962fb46d0b370005b900a167d6';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID =
  'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID =
  'H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v3';

function sampleRun8BElevation(worldX, worldZ) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (sample?.valid !== true || !finite(sample.elevation)) {
    throw new Error(`MAP_RENEWAL_SOURCE_SAMPLE_INVALID:${worldX}:${worldZ}`);
  }
  return sample.elevation;
}

const ESTATE_TERRAIN_COMPOSITION = freeze({
  atriumTerrace: {
    id: 'ATRIUM_CROWN_TERRACE',
    center: { x: 80, z: -172 },
    radius: { x: 26, z: 22 },
    coreRadius: 0.58,
    cutDepth: 1.4,
    purpose: 'PRESERVE_HIGH_360_VIEW_ATRIUM_ANCHOR_WITH_BUILDABLE_CROWN'
  },
  connectiveSpine: {
    id: 'ESTATE_CONNECTIVE_SADDLE_SPINE',
    points: [
      { x: 80, z: -172 },
      { x: 112.41666666666667, z: -194.83333333333334 },
      { x: 136, z: -208 }
    ],
    coreHalfWidth: 10,
    featherHalfWidth: 25,
    boundedCutDepth: 0.8,
    purpose: 'RESERVE_IRREGULAR_MANOR_CONNECTION_ACROSS_SADDLE_WITHOUT_FINAL_ARCHITECTURE'
  },
  hillInterfaceTerrace: {
    id: 'LARGE_HILL_EMBEDDED_MANOR_INTERFACE',
    center: { x: 136, z: -208 },
    radius: { x: 30, z: 22 },
    coreRadius: 0.48,
    cutDepth: 2.2,
    purpose: 'CREATE_TERRAIN_RESPONSIVE_MANOR_INTERFACE_WHILE_PRESERVING_LARGE_HILL_MASS'
  },
  reservedEnvelope: {
    xMinimum: 52,
    xMaximum: 176,
    zMinimum: -242,
    zMaximum: -144
  },
  hiddenVaultReserve: {
    center: { x: 152, z: -224 },
    horizontalRadius: { x: 34, z: 34 },
    reservedDepthBelowSurface: 34,
    surfaceExpression: 'NONE',
    access: 'INTERNAL_MANOR_ONLY_FOR_NOW',
    purpose: 'PRESERVE_SUBSURFACE_MASS_FOR_SECRET_VAULT_ORCOIN_AND_WATER_INFRASTRUCTURE'
  },
  finalManorGeometryConstructed: false,
  treatment: 'MULTI_HILL_IRREGULAR_ESTATE_TERRAIN_PREPARATION_WITHOUT_BUILDING_GEOMETRY'
});

const ATRIUM_TARGET_ELEVATION =
  sampleRun8BElevation(
    ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center.x,
    ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center.z
  ) - ESTATE_TERRAIN_COMPOSITION.atriumTerrace.cutDepth;

const HILL_INTERFACE_TARGET_ELEVATION =
  sampleRun8BElevation(
    ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center.x,
    ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center.z
  ) - ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.cutDepth;

const RESERVOIR_SOURCE_CENTER = { x: -44, z: -216 };
const RESERVOIR_SOURCE_ELEVATION = sampleRun8BElevation(
  RESERVOIR_SOURCE_CENTER.x,
  RESERVOIR_SOURCE_CENTER.z
);
const RESERVOIR_WATER_SURFACE_ELEVATION = clamp(RESERVOIR_SOURCE_ELEVATION - 1.6, 1.5, 10.0);
const RESERVOIR_FLOOR_ELEVATION = RESERVOIR_WATER_SURFACE_ELEVATION - 3.4;

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY = freeze({
  seaLevelY: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY ?? 0,
  coastlineContext: {
    currentShorelineClass: 'RECEDED_LOCAL_COASTLINE_AFTER_BOUNDED_WATER_CONTROL',
    formerWaterExtent: 'FARTHER_INLAND_THAN_CURRENT_BEACH',
    oceanLevelChangedByEstateSystem: false,
    localHydrologyChangedByEstateSystem: true,
    mapPreviewWaterContextAuthorized: true,
    liveWaterMutationAuthorized: false
  },
  waterfall: {
    hiddenUpperSource: { x: -48, z: -310 },
    visibleCrest: { x: -48, z: -268 },
    landing: { x: -44, z: -230 },
    halfWidth: 6,
    transitionHalfWidth: 15,
    terrainChannelCutDepth: 4.2,
    sourceNarrative: 'UNDEVELOPED_INACCESSIBLE_UPPER_WATERSHED_BEHIND_MOUNTAIN_BARRIER'
  },
  reservoir: {
    center: RESERVOIR_SOURCE_CENTER,
    radius: { x: 28, z: 20 },
    coreRadius: 0.64,
    rimOuterRadius: 1.32,
    waterSurfaceElevation: RESERVOIR_WATER_SURFACE_ELEVATION,
    floorElevation: RESERVOIR_FLOOR_ELEVATION,
    enclosed: true,
    visibleDrainageToCoast: false,
    concealedPumpIntakeReserved: true,
    pumpConstructionAuthorized: false
  },
  cavern: {
    exteriorReserveCenter: { x: -16, z: -236 },
    radius: { x: 16, z: 13 },
    coreRadius: 0.58,
    shallowApronCutDepth: 1.5,
    interiorConstructed: false,
    relationship: 'RIGHT_OF_WATERFALL_CONNECTED_INTO_MOUNTAIN_MASS'
  },
  hiddenInfrastructure: {
    reservoirPumpToVaultRouteReserved: true,
    waterChamberInVaultCompoundReserved: true,
    renderedOnSurface: false,
    constructed: false,
    publicKnowledge: 'SECRET'
  }
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE = freeze({
  profileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  governingHead: GOVERNING_HEAD,
  lockGeneration: 422,
  successorRepairRevision: 3,
  sourceIdentity: {
    classification: 'POSITIVE_DESIGN_SOURCE_NOT_MERGED_MAIN_NOT_AUTOMATIC_TRANSPLANT',
    commit: POSITIVE_REFERENCE,
    tree: '7cd51523649788ad6fb226aea16f6799a5c58177',
    sourceProfileId: 'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2'
  },
  implementationClass:
    'RUN8B_TRUTH_PLUS_MAP_AUTHORING_MOUNTAIN_DEPTH_HYDROLOGY_RESERVATIONS_MULTI_HILL_ESTATE_PREPARATION_AND_VIRTUAL_NORMAL_RELIEF',
  macroLandforms: [
    { id: 'REAR_WATERSHED_MASS', center: { x: -72, z: -294 }, radius: { x: 194, z: 92 }, amplitude: 18 },
    { id: 'WESTERN_MOUNTAIN_DEPTH', center: { x: -148, z: -262 }, radius: { x: 118, z: 86 }, amplitude: 10 },
    { id: 'EASTERN_MOUNTAIN_DEPTH', center: { x: 2, z: -258 }, radius: { x: 108, z: 82 }, amplitude: 10 },
    { id: 'MOUNTAIN_FRONT_APRON', center: { x: -54, z: -236 }, radius: { x: 184, z: 76 }, amplitude: 6.5 },
    { id: 'FAR_EAST_HIGHLAND_BALANCE', center: { x: 202, z: -252 }, radius: { x: 78, z: 82 }, amplitude: 7 }
  ],
  rearBoundaryBarrier: {
    xMinimum: -238,
    xMaximum: 92,
    zFullBy: -306,
    zZeroBy: -252,
    maximumAddedElevation: 11,
    traversalBehindRange: 'PROHIBITED_IN_EVENTUAL_LIVE_INTEGRATION',
    visibilityBehindRange: 'PROHIBITED_IN_EVENTUAL_LIVE_INTEGRATION'
  },
  mesoLandform: {
    maximumMagnitude: 1.65,
    components: [
      { direction: { x: 0.83, z: 0.56 }, frequency: 0.014, phase: 0.37, weight: 0.46 },
      { direction: { x: -0.48, z: 0.88 }, frequency: 0.020, phase: 2.17, weight: 0.34 },
      { direction: { x: 0.67, z: -0.74 }, frequency: 0.027, phase: 4.11, weight: 0.20 }
    ]
  },
  estateTerrainComposition: {
    ...ESTATE_TERRAIN_COMPOSITION,
    atriumTargetElevation: ATRIUM_TARGET_ELEVATION,
    hillInterfaceTargetElevation: HILL_INTERFACE_TARGET_ELEVATION
  },
  entryCore: { xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88, transitionMargin: 8 },
  coastalProtection: { fullReliefByZ: -110, zeroReliefByZ: -72 },
  hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  virtualNormalRelief: {
    directionalPhases: [
      { id: 'A', direction: { x: 0.8164965809277260, y: 0.4082482904638630, z: 0.4082482904638630 }, frequency: 3.306939635357677, offset: 0.37, weight: 0.50 },
      { id: 'B', direction: { x: -0.4082482904638630, y: 0.8164965809277260, z: 0.4082482904638630 }, frequency: 2.7318196987737333, offset: 2.17, weight: 0.30 },
      { id: 'C', direction: { x: 0.4082482904638630, y: -0.4082482904638630, z: 0.8164965809277260 }, frequency: 2.243994752564138, offset: 4.11, weight: 0.20 }
    ],
    virtualReliefHeightAmplitude: 0.22,
    maximumNormalDeviationDegrees: 22,
    maximumNormalDeviationCosine: 0.9271838545667874,
    maximumNormalDeviationSine: 0.3746065934159120,
    antialiasFootprint: { fullThrough: 0.45, zeroBy: 0.95 },
    distanceEnvelope: { fullInfluenceThrough: 120, zeroInfluenceBy: 300 },
    slopeEnvelope: { minimumInfluence: 0.82, maximumInfluence: 1, responseStart: 0.05, responseEnd: 0.55 },
    authoringInspectorScale: 0.42
  },
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
  successorRepairRevision: 3,
  governingHead: GOVERNING_HEAD,
  baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  baseTerrainFieldGenerationRevision: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  worldDomain: { ...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain },
  reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  mapWideApplication: 'ALL_VALID_RUN8B_TERRAIN_SAMPLES_WITH_BOUNDED_AUTHORING_RELIEF_HYDROLOGY_AND_ESTATE_PREPARATION',
  reservedEstateEnvelope: {
    bounds: { ...ESTATE_TERRAIN_COMPOSITION.reservedEnvelope },
    atriumAnchor: { ...ESTATE_TERRAIN_COMPOSITION.atriumTerrace.center },
    connectiveSaddle: { ...ESTATE_TERRAIN_COMPOSITION.connectiveSpine.points[1] },
    largeHillInterface: { ...ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace.center },
    hiddenVaultReserve: { ...ESTATE_TERRAIN_COMPOSITION.hiddenVaultReserve },
    effect: 'IRREGULAR_MULTI_HILL_ESTATE_TERRAIN_COMPOSITION_WITHOUT_MANOR_GEOMETRY',
    manorGeometryConstructed: false
  },
  hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  preservation: {
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
  }
});

function ellipticalBump(worldX, worldZ, landform) {
  const dx = (worldX - landform.center.x) / landform.radius.x;
  const dz = (worldZ - landform.center.z) / landform.radius.z;
  const radiusSquared = dx * dx + dz * dz;
  if (radiusSquared >= 1) return 0;
  const retained = 1 - radiusSquared;
  return landform.amplitude * retained * retained;
}

function ellipseRadius(worldX, worldZ, zone) {
  return Math.hypot(
    (worldX - zone.center.x) / zone.radius.x,
    (worldZ - zone.center.z) / zone.radius.z
  );
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
    if (candidate.distance < best.distance) {
      best = {
        distance: candidate.distance,
        progress: (index + candidate.t) / segmentCount
      };
    }
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
  const xVariation = 0.82 + 0.18 * Math.sin((worldX + 86) / 43);
  return barrier.maximumAddedElevation * xWeight * zWeight * xVariation;
}

function waterfallCorridorWeight(worldX, worldZ) {
  const waterfall = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.waterfall;
  const result = distanceToSegment(worldX, worldZ, waterfall.visibleCrest, waterfall.landing);
  return 1 - smoothstep(waterfall.halfWidth, waterfall.transitionHalfWidth, result.distance);
}

function reservoirWeight(worldX, worldZ) {
  const reservoir = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir;
  const radius = ellipseRadius(worldX, worldZ, reservoir);
  return 1 - smoothstep(reservoir.coreRadius, 1, radius);
}

function reservoirRimWeight(worldX, worldZ) {
  const reservoir = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir;
  const radius = ellipseRadius(worldX, worldZ, reservoir);
  return smoothstep(0.72, 0.96, radius) * (1 - smoothstep(1.08, reservoir.rimOuterRadius, radius));
}

function cavernReserveWeight(worldX, worldZ) {
  const cavern = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.cavern;
  return ellipseWeight(worldX, worldZ, cavern);
}

function estatePreparation(worldX, worldZ, basePresentationElevation) {
  const estate = ESTATE_TERRAIN_COMPOSITION;
  const atriumWeight = ellipseWeight(worldX, worldZ, estate.atriumTerrace);
  const interfaceWeight = ellipseWeight(worldX, worldZ, estate.hillInterfaceTerrace);
  const spine = polylineDistance(worldX, worldZ, estate.connectiveSpine.points);
  const spineWeight = 1 - smoothstep(
    estate.connectiveSpine.coreHalfWidth,
    estate.connectiveSpine.featherHalfWidth,
    spine.distance
  );

  let elevation = basePresentationElevation;
  elevation = mix(elevation, ATRIUM_TARGET_ELEVATION, atriumWeight);
  elevation -= estate.connectiveSpine.boundedCutDepth * spineWeight;
  elevation = mix(elevation, HILL_INTERFACE_TARGET_ELEVATION, interfaceWeight);

  return {
    elevation,
    weight: Math.max(atriumWeight, spineWeight, interfaceWeight),
    zoneWeights: { atrium: atriumWeight, connectiveSpine: spineWeight, hillInterface: interfaceWeight },
    atriumTargetElevation: ATRIUM_TARGET_ELEVATION,
    hillInterfaceTargetElevation: HILL_INTERFACE_TARGET_ELEVATION
  };
}

export function resolveHEarthMapWideGeometricProtectionEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  return Math.min(
    rectangleReleaseEnvelope(worldX, worldZ, profile.entryCore),
    coastalReleaseEnvelope(worldZ)
  );
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
  elevation += reservoirRim * 1.35;
  elevation = mix(elevation, hydro.reservoir.floorElevation, reservoirBasinWeight);
  elevation -= cavernWeight * hydro.cavern.shallowApronCutDepth;

  return {
    elevation,
    waterfallWeight,
    reservoirWeight: reservoirBasinWeight,
    reservoirRimWeight: reservoirRim,
    cavernReserveWeight: cavernWeight
  };
}

export function sampleHEarthMapWidePresentationReliefOffset(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) return Number.NaN;
  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(worldX, worldZ);
  const basePresentationElevation = source.elevation + environmentalReliefOffset;
  const hydro = applyHydrologyTerrain(worldX, worldZ, basePresentationElevation);
  const estate = estatePreparation(worldX, worldZ, hydro.elevation);
  return estate.elevation - source.elevation;
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
  return finite(signal)
    ? signal * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief.virtualReliefHeightAmplitude
    : Number.NaN;
}

export function resolveHEarthMapWideReliefEnvelope({ distanceToCamera, slope, maximumPhaseFootprint = 0 } = {}) {
  if (![distanceToCamera, slope, maximumPhaseFootprint].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief;
  const distanceEnvelope = 1 - smoothstep(
    profile.distanceEnvelope.fullInfluenceThrough,
    profile.distanceEnvelope.zeroInfluenceBy,
    Math.max(0, distanceToCamera)
  );
  const slopeEnvelope = mix(
    profile.slopeEnvelope.minimumInfluence,
    profile.slopeEnvelope.maximumInfluence,
    smoothstep(profile.slopeEnvelope.responseStart, profile.slopeEnvelope.responseEnd, clamp(slope, 0, 1))
  );
  const antialiasEnvelope = 1 - smoothstep(
    profile.antialiasFootprint.fullThrough,
    profile.antialiasFootprint.zeroBy,
    Math.max(0, maximumPhaseFootprint)
  );
  return clamp(distanceEnvelope * slopeEnvelope * antialiasEnvelope, 0, 1);
}

export function isInsideHEarthReservedEstateEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return false;
  if (!insideRectangle(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.reservedEnvelope)) return false;
  const atrium = ellipseWeight(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.atriumTerrace);
  const hill = ellipseWeight(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.hillInterfaceTerrace);
  const spine = polylineDistance(worldX, worldZ, ESTATE_TERRAIN_COMPOSITION.connectiveSpine.points);
  const spineWeight = 1 - smoothstep(
    ESTATE_TERRAIN_COMPOSITION.connectiveSpine.coreHalfWidth,
    ESTATE_TERRAIN_COMPOSITION.connectiveSpine.featherHalfWidth,
    spine.distance
  );
  return Math.max(atrium, hill, spineWeight) > 0.05;
}

export function sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ) {
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) {
    return freeze({
      valid: false,
      status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_REJECTED',
      contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
      worldX,
      worldZ,
      sourceStatus: source?.status ?? null
    });
  }

  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(source.world.x, source.world.z);
  const basePresentationElevation = source.elevation + environmentalReliefOffset;
  const hydro = applyHydrologyTerrain(source.world.x, source.world.z, basePresentationElevation);
  const estate = estatePreparation(source.world.x, source.world.z, hydro.elevation);
  const presentationElevation = estate.elevation;
  const presentationReliefOffset = presentationElevation - source.elevation;
  const reliefSignal = sampleHEarthMapWideReliefSignal(source.world.x, source.elevation, source.world.z);
  const virtualReliefHeight = reliefSignal * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief.virtualReliefHeightAmplitude;

  return freeze({
    valid: true,
    status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    sourceContractId: source.contractId,
    sourceGenerationRevision: source.generationRevision,
    world: { ...source.world },
    elevation: source.elevation,
    geometricElevation: source.elevation,
    geometricElevationMutated: false,
    presentationElevation,
    presentationReliefOffset,
    environmentalReliefOffset,
    sitePreparationOffset: presentationElevation - hydro.elevation,
    sitePreparation: {
      active: estate.weight > 0,
      fullyPrepared: estate.weight >= 1 - 1e-9,
      weight: estate.weight,
      zoneWeights: estate.zoneWeights,
      atriumTargetElevation: estate.atriumTargetElevation,
      hillInterfaceTargetElevation: estate.hillInterfaceTargetElevation,
      treatment: ESTATE_TERRAIN_COMPOSITION.treatment
    },
    hydrology: {
      waterfallWeight: hydro.waterfallWeight,
      reservoirWeight: hydro.reservoirWeight,
      reservoirRimWeight: hydro.reservoirRimWeight,
      cavernReserveWeight: hydro.cavernReserveWeight,
      reservoirWaterSurfaceElevation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.waterSurfaceElevation,
      reservoirFloorElevation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.floorElevation,
      enclosedReservoir: true,
      visibleDrainageToCoast: false
    },
    presentationGeometryIsCandidateOnly: true,
    normal: source.normal ? { ...source.normal } : null,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    reliefSignal,
    virtualReliefHeight,
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
  const saddle = sampleHEarthMapWideEnvironmentTerrainCandidate(112.41666666666667, -194.83333333333334);
  const hillInterface = sampleHEarthMapWideEnvironmentTerrainCandidate(136, -208);
  const reservoir = sampleHEarthMapWideEnvironmentTerrainCandidate(-44, -216);
  const waterfall = sampleHEarthMapWideEnvironmentTerrainCandidate(-48, -250);
  const cavern = sampleHEarthMapWideEnvironmentTerrainCandidate(-16, -236);
  const rearBarrier = sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -310);
  const reliefWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(-96, -271),
    sampleHEarthMapWideEnvironmentTerrainCandidate(-8, -258),
    sampleHEarthMapWideEnvironmentTerrainCandidate(196, -252)
  ];
  const edges = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(domain.xMinimum, domain.zMinimum),
    sampleHEarthMapWideEnvironmentTerrainCandidate(domain.xMaximum, domain.zMaximum)
  ];
  const witnesses = [entry, atrium, saddle, hillInterface, reservoir, waterfall, cavern, rearBarrier, ...reliefWitnesses, ...edges];

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
  if (!(reservoir.presentationElevation < reservoir.hydrology.reservoirWaterSurfaceElevation - 2)) issues.push('RESERVOIR_FLOOR_NOT_BELOW_WATER_SURFACE');
  if (!(waterfall.hydrology?.waterfallWeight > 0.5)) issues.push('WATERFALL_CORRIDOR_NOT_CONSTRUCTED');
  if (!(cavern.hydrology?.cavernReserveWeight > 0.5)) issues.push('CAVERN_EXTERIOR_RESERVE_NOT_CONSTRUCTED');
  if (witnesses.some((sample) => !finite(sample.virtualReliefHeight))) issues.push('VIRTUAL_RELIEF_WITNESS_NONFINITE');
  if (witnesses.some((sample) => sample.manorGeometryConstructed !== false || sample.cavernInteriorConstructed !== false || sample.vaultInteriorConstructed !== false)) {
    issues.push('DEFERRED_INTERIOR_OR_MANOR_SCOPE_VIOLATION');
  }

  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_PASS'
      : 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_FAIL',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    successorRepairRevision: 3,
    witnesses,
    estateTerrainComposition: {
      atriumTargetElevation: ATRIUM_TARGET_ELEVATION,
      hillInterfaceTargetElevation: HILL_INTERFACE_TARGET_ELEVATION,
      reservedEnvelope: ESTATE_TERRAIN_COMPOSITION.reservedEnvelope
    },
    hydrology: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
    run8BTruthElevationMutation: false,
    candidatePresentationElevationConstructed: true,
    physicalEstateTerrainPreparationConstructed: true,
    mapHydrologyContextConstructed: true,
    manorGeometryConstructed: false,
    issues: freeze(issues)
  });
}

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION =
  evaluateHEarthMapWideEnvironmentTerrainCandidate();

if (H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible !== true) {
  throw new Error(
    `H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_FAIL:${JSON.stringify(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.issues)}`
  );
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE;
