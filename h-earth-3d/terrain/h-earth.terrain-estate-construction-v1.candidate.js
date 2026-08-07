/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1
 *
 * Isolated, non-live successor terrain candidate. Run8B remains immutable
 * geometric truth. The candidate exposes a separate presentation elevation
 * composed from deterministic, band-limited macro/meso landform relief,
 * physically prepared estate-site terrain, and the accepted three-phase
 * virtual-normal relief direction from commit
 * 97003e9de386a8962fb46d0b370005b900a167d6.
 *
 * No camera, navigation, water, live runtime, registry, manor geometry,
 * deployment, merge, or release authority is created here.
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
  'H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v2';

const ESTATE_SITE_PREPARATION = freeze({
  center: { x: 80, z: -172 },
  buildablePad: {
    xMinimum: 69,
    xMaximum: 91,
    zMinimum: -181,
    zMaximum: -163
  },
  transitionMargin: 12,
  maximumCenterCutDepth: 4.5,
  minimumCenterCutDepth: 1.0,
  lowerPerimeterClearance: 0.65,
  treatment: 'CUT_AND_BLEND_BUILDABLE_TERRACE_WITHOUT_BUILDING_GEOMETRY'
});

function sampleRun8BElevation(worldX, worldZ) {
  const sample = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (sample?.valid !== true || !finite(sample.elevation)) {
    throw new Error(`ESTATE_SITE_PREPARATION_SOURCE_SAMPLE_INVALID:${worldX}:${worldZ}`);
  }
  return sample.elevation;
}

const ESTATE_SITE_TARGET_ELEVATION = (() => {
  const pad = ESTATE_SITE_PREPARATION.buildablePad;
  const centerElevation = sampleRun8BElevation(
    ESTATE_SITE_PREPARATION.center.x,
    ESTATE_SITE_PREPARATION.center.z
  );
  const perimeterElevations = [
    sampleRun8BElevation(pad.xMinimum, ESTATE_SITE_PREPARATION.center.z),
    sampleRun8BElevation(pad.xMaximum, ESTATE_SITE_PREPARATION.center.z),
    sampleRun8BElevation(ESTATE_SITE_PREPARATION.center.x, pad.zMinimum),
    sampleRun8BElevation(ESTATE_SITE_PREPARATION.center.x, pad.zMaximum)
  ];
  const lowerPerimeter = Math.min(...perimeterElevations);
  const desired = lowerPerimeter + ESTATE_SITE_PREPARATION.lowerPerimeterClearance;
  return clamp(
    desired,
    centerElevation - ESTATE_SITE_PREPARATION.maximumCenterCutDepth,
    centerElevation - ESTATE_SITE_PREPARATION.minimumCenterCutDepth
  );
})();

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE = freeze({
  profileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  governingHead: GOVERNING_HEAD,
  lockGeneration: 422,
  successorRepairRevision: 1,
  sourceIdentity: {
    classification: 'POSITIVE_DESIGN_SOURCE_NOT_MERGED_MAIN_NOT_AUTOMATIC_TRANSPLANT',
    commit: POSITIVE_REFERENCE,
    tree: '7cd51523649788ad6fb226aea16f6799a5c58177',
    sourceProfileId: 'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2'
  },
  implementationClass:
    'RUN8B_TRUTH_PLUS_BOUNDED_PRESENTATION_ELEVATION_SITE_PREPARATION_AND_VIRTUAL_NORMAL_RELIEF',
  macroLandforms: [
    { id: 'MOUNTAINWARD_BACKBONE', center: { x: -64, z: -274 }, radius: { x: 172, z: 72 }, amplitude: 18 },
    { id: 'WESTERN_SHOULDER', center: { x: -184, z: -212 }, radius: { x: 82, z: 92 }, amplitude: 9 },
    { id: 'EASTERN_SHOULDER', center: { x: 196, z: -252 }, radius: { x: 84, z: 88 }, amplitude: 12 }
  ],
  mesoLandform: {
    maximumMagnitude: 3.5,
    components: [
      { direction: { x: 0.83, z: 0.56 }, frequency: 0.018, phase: 0.37, weight: 0.46 },
      { direction: { x: -0.48, z: 0.88 }, frequency: 0.026, phase: 2.17, weight: 0.34 },
      { direction: { x: 0.67, z: -0.74 }, frequency: 0.039, phase: 4.11, weight: 0.20 }
    ]
  },
  protectedEstateCore: { xMinimum: 64, xMaximum: 96, zMinimum: -188, zMaximum: -156, transitionMargin: 12 },
  estateSitePreparation: { ...ESTATE_SITE_PREPARATION, targetElevation: ESTATE_SITE_TARGET_ELEVATION },
  entryCore: { xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88, transitionMargin: 8 },
  lowCorridor: {
    origin: { x: 112.41666666666667, z: -194.83333333333334 },
    axis: { x: 0.5931990380498502, z: 0.805055837353368 },
    hardHalfWidth: 10,
    transitionHalfWidth: 18,
    protectedHalfLength: 92,
    transitionHalfLength: 116
  },
  coastalProtection: { fullReliefByZ: -104, zeroReliefByZ: -72 },
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
    slopeEnvelope: { minimumInfluence: 0.82, maximumInfluence: 1, responseStart: 0.05, responseEnd: 0.55 }
  },
  baseTruthElevationMutation: false,
  baseTruthNormalMutation: false,
  presentationElevationEnabled: true,
  presentationNormalPerturbation: true,
  physicalEstateSitePreparationEnabled: true,
  deterministic: true
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE = freeze({
  contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
  operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
  lockGeneration: 422,
  successorRepairRevision: 1,
  governingHead: GOVERNING_HEAD,
  baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  baseTerrainFieldGenerationRevision: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  worldDomain: { ...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain },
  reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  mapWideApplication: 'ALL_VALID_RUN8B_TERRAIN_SAMPLES_WITH_PROTECTED_RELIEF_MASKS_AND_BOUNDED_SITE_PREPARATION',
  reservedEstateEnvelope: {
    center: { x: 80, z: -172 },
    bounds: { xMinimum: 64, xMaximum: 96, zMinimum: -188, zMaximum: -156 },
    effect: 'PHYSICALLY_PREPARED_FUTURE_CONSTRUCTION_SITE_WITHOUT_MANOR_GEOMETRY',
    buildablePad: { ...ESTATE_SITE_PREPARATION.buildablePad },
    targetElevation: ESTATE_SITE_TARGET_ELEVATION,
    manorGeometryConstructed: false
  },
  preservation: {
    run8BTruthElevationMutated: false,
    run8BSourceMutated: false,
    liveRuntimeMutated: false,
    cameraMutated: false,
    navigationMutated: false,
    waterMutated: false,
    registryMutated: false,
    manorGeometryConstructed: false,
    frontierPlainsConstructed: false,
    cavernInteriorConstructed: false,
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

function estateSitePreparationWeight(worldX, worldZ) {
  const site = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.estateSitePreparation;
  if (insideRectangle(worldX, worldZ, site.buildablePad)) return 1;
  return 1 - smoothstep(0, site.transitionMargin, distanceOutsideRectangle(worldX, worldZ, site.buildablePad));
}

function lowCorridorReleaseEnvelope(worldX, worldZ) {
  const corridor = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.lowCorridor;
  const dx = worldX - corridor.origin.x;
  const dz = worldZ - corridor.origin.z;
  const along = dx * corridor.axis.x + dz * corridor.axis.z;
  const across = Math.abs(-dx * corridor.axis.z + dz * corridor.axis.x);
  const acrossRelease = smoothstep(corridor.hardHalfWidth, corridor.transitionHalfWidth, across);
  const alongRelease = smoothstep(corridor.protectedHalfLength, corridor.transitionHalfLength, Math.abs(along));
  return Math.max(acrossRelease, alongRelease);
}

function coastalReleaseEnvelope(worldZ) {
  const coast = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.coastalProtection;
  return 1 - smoothstep(coast.fullReliefByZ, coast.zeroReliefByZ, worldZ);
}

export function resolveHEarthMapWideGeometricProtectionEnvelope(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  return Math.min(
    rectangleReleaseEnvelope(worldX, worldZ, profile.protectedEstateCore),
    rectangleReleaseEnvelope(worldX, worldZ, profile.entryCore),
    lowCorridorReleaseEnvelope(worldX, worldZ),
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
  return (macro + meso) * resolveHEarthMapWideGeometricProtectionEnvelope(worldX, worldZ);
}

export function sampleHEarthMapWidePresentationReliefOffset(worldX, worldZ) {
  if (![worldX, worldZ].every(finite)) return Number.NaN;
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) return Number.NaN;
  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(worldX, worldZ);
  const basePresentationElevation = source.elevation + environmentalReliefOffset;
  const siteWeight = estateSitePreparationWeight(worldX, worldZ);
  const targetElevation = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.estateSitePreparation.targetElevation;
  const preparedElevation = mix(basePresentationElevation, targetElevation, siteWeight);
  return preparedElevation - source.elevation;
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
  return finite(signal) ? signal * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief.virtualReliefHeightAmplitude : Number.NaN;
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
  if (![worldX, worldZ].every(finite)) return false;
  return insideRectangle(worldX, worldZ, H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE.reservedEstateEnvelope.bounds);
}

export function sampleHEarthMapWideEnvironmentTerrainCandidate(worldX, worldZ) {
  const source = sampleHEarthRun8BSuccessorTerrainField(worldX, worldZ);
  if (source?.valid !== true) {
    return freeze({ valid: false, status: 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_REJECTED', contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID, worldX, worldZ, sourceStatus: source?.status ?? null });
  }
  const environmentalReliefOffset = sampleHEarthMapWideEnvironmentalReliefOffset(source.world.x, source.world.z);
  const basePresentationElevation = source.elevation + environmentalReliefOffset;
  const sitePreparationWeight = estateSitePreparationWeight(source.world.x, source.world.z);
  const siteTargetElevation = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.estateSitePreparation.targetElevation;
  const presentationElevation = mix(basePresentationElevation, siteTargetElevation, sitePreparationWeight);
  const sitePreparationOffset = presentationElevation - basePresentationElevation;
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
    sitePreparationOffset,
    sitePreparation: {
      active: sitePreparationWeight > 0,
      fullyPrepared: sitePreparationWeight >= 1 - 1e-9,
      weight: sitePreparationWeight,
      targetElevation: siteTargetElevation,
      treatment: ESTATE_SITE_PREPARATION.treatment
    },
    presentationGeometryIsCandidateOnly: true,
    normal: source.normal ? { ...source.normal } : null,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    reliefSignal,
    virtualReliefHeight,
    insideReservedEstateEnvelope: isInsideHEarthReservedEstateEnvelope(source.world.x, source.world.z),
    manorGeometryConstructed: false
  });
}

export function evaluateHEarthMapWideEnvironmentTerrainCandidate() {
  const domain = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE.worldDomain;
  const issues = [];
  const protectedWitnesses = [[112.41666666666667, -194.83333333333334], [0, -96]].map(([x, z]) => sampleHEarthMapWideEnvironmentTerrainCandidate(x, z));
  const preparedWitnesses = [[80, -172], [70, -180], [90, -180], [70, -164], [90, -164]].map(([x, z]) => sampleHEarthMapWideEnvironmentTerrainCandidate(x, z));
  const reliefWitnesses = [[-64, -274], [-184, -212], [196, -252], [-96, -271], [32, -236]].map(([x, z]) => sampleHEarthMapWideEnvironmentTerrainCandidate(x, z));
  const edgeWitnesses = [[domain.xMinimum, domain.zMinimum], [domain.xMaximum, domain.zMaximum]].map(([x, z]) => sampleHEarthMapWideEnvironmentTerrainCandidate(x, z));
  const witnesses = [...protectedWitnesses, ...preparedWitnesses, ...reliefWitnesses, ...edgeWitnesses];
  if (witnesses.some((sample) => sample.valid !== true)) issues.push('MAP_WIDE_WITNESS_SAMPLE_INVALID');
  if (witnesses.some((sample) => !finite(sample.elevation) || !finite(sample.presentationElevation))) issues.push('MAP_WIDE_WITNESS_ELEVATION_NONFINITE');
  if (witnesses.some((sample) => sample.geometricElevationMutated !== false)) issues.push('RUN8B_GEOMETRIC_TRUTH_MUTATED');
  if (protectedWitnesses.some((sample) => Math.abs(sample.presentationReliefOffset) > 1e-9)) issues.push('NON_ESTATE_PROTECTED_REGION_PRESENTATION_OFFSET_NONZERO');
  if (!reliefWitnesses.some((sample) => Math.abs(sample.presentationReliefOffset) >= 4)) issues.push('MATERIAL_MACRO_RELIEF_NOT_DEMONSTRATED');
  if (witnesses.some((sample) => !finite(sample.virtualReliefHeight))) issues.push('VIRTUAL_RELIEF_WITNESS_NONFINITE');
  const estateCenter = preparedWitnesses[0];
  if (estateCenter.insideReservedEstateEnvelope !== true) issues.push('RESERVED_ESTATE_ENVELOPE_IDENTITY_FAILED');
  if (preparedWitnesses.some((sample) => sample.sitePreparation?.fullyPrepared !== true)) issues.push('ESTATE_BUILDABLE_PAD_NOT_FULLY_PREPARED');
  const preparedElevations = preparedWitnesses.map((sample) => sample.presentationElevation);
  if (Math.max(...preparedElevations) - Math.min(...preparedElevations) > 1e-6) issues.push('ESTATE_BUILDABLE_PAD_NOT_LEVEL');
  if (!(estateCenter.presentationElevation < estateCenter.elevation - 0.5)) issues.push('ESTATE_SITE_NOT_PHYSICALLY_CUT');
  if (witnesses.some((sample) => sample.manorGeometryConstructed !== false)) issues.push('MANOR_GEOMETRY_SCOPE_VIOLATION');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_PASS' : 'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_FAIL',
    contractId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,
    baseTerrainFieldContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    reliefProfileId: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
    protectedWitnessCount: protectedWitnesses.length,
    preparedSiteWitnessCount: preparedWitnesses.length,
    reliefWitnessCount: reliefWitnesses.length,
    witnesses,
    estateSitePreparation: {
      buildablePad: { ...ESTATE_SITE_PREPARATION.buildablePad },
      targetElevation: ESTATE_SITE_TARGET_ELEVATION,
      centerCutDepth: estateCenter.elevation - estateCenter.presentationElevation
    },
    run8BTruthElevationMutation: false,
    candidatePresentationElevationConstructed: true,
    physicalEstateSitePreparationConstructed: true,
    manorGeometryConstructed: false,
    issues: freeze(issues)
  });
}

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION = evaluateHEarthMapWideEnvironmentTerrainCandidate();
if (H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible !== true) {
  throw new Error(`H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_FAIL:${JSON.stringify(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.issues)}`);
}

export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE;
