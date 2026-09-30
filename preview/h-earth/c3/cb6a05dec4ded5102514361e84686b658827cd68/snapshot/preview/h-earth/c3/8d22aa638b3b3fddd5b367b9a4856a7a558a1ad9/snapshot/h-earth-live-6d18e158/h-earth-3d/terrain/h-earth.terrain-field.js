/**
 * /h-earth-3d/terrain/h-earth.terrain-field.js
 *
 * H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1
 *
 * Canonical world-space elevation authority for the functional-landscape
 * successor. This repair preserves the installed Run 6 contract identity and
 * canonical shoreline backbone while binding Gratitude Bay and Gratitude
 * Harbor through a localized asymmetric continental-coast deformation. OW02
 * continues the primary mountain system inland as an articulated range with
 * passes, a receiving basin, watershed-directed valleys and foothill taper.
 * OW03 resolves that backbone into a compound, nonradial continental coast
 * with named peninsulas, bays, gulfs, coves and headlands. OW04 preserves each
 * named inland relief component while attenuating only additive positive-relief
 * overlap so the coastal-entry sightline reads as articulated terrain rather
 * than an enclosing composite wall. It creates no geometry, admission, frame,
 * renderer, or route.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
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
const bell = (value, center, radius) => {
  const d = Math.abs(value - center) / Math.max(radius, 1e-6);
  if (d >= 1) return 0;
  const retained = 1 - d * d;
  return retained * retained;
};

export const H_EARTH_TERRAIN_FIELD_CONTRACT_ID = 'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1';

export const H_EARTH_GRATITUDE_COASTAL_SYSTEM = deepFreeze({
  systemId: 'H_EARTH_GRATITUDE_TRUE_CONTINENTAL_COASTAL_ENTRY_v1',
  continent: 'GRATITUDE',
  continentalCoast: {
    identity: 'GRATITUDE_CONTINENTAL_COAST',
    baselineZ: -82,
    morphology: 'ASYMMETRIC_ORGANIC_COMPOUND_COAST'
  },
  bay: {
    identity: 'GRATITUDE_BAY',
    centerX: 118,
    halfWidth: 82,
    maximumInlandReach: 48,
    westernHeadlandX: 48,
    easternHeadlandX: 198,
    morphology: 'ASYMMETRIC_CURVED_INLAND_BAY_NOT_STRAIGHT_CUT'
  },
  harbor: {
    identity: 'GRATITUDE_HARBOR',
    parentIdentity: 'GRATITUDE_BAY',
    coastIdentity: 'GRATITUDE_CONTINENTAL_COAST',
    mouthCenterX: 132,
    shorelineRule: 'RESOLVE_FROM_CANONICAL_GRATITUDE_CONTINENTAL_SHORELINE',
    localGeometryRule: 'PRESERVE_REGIONAL_SCALE_CHARACTER_DO_NOT_COPY_PLANETARY_VERTICES'
  },
  compoundMorphology: {
    systemId: 'H_EARTH_GRATITUDE_ORGANIC_COMPOUND_CONTINENT_MORPHOLOGY_v1',
    morphology: 'NONRADIAL_ASYMMETRIC_MULTI_LOBE_CONTINENT',
    peninsulas: [
      { identity: 'GRATITUDE_WESTERN_PENINSULA', centerX: -220, halfWidth: 30, waterwardReach: 25 },
      { identity: 'GRATITUDE_EASTERN_PENINSULA', centerX: 232, halfWidth: 24, waterwardReach: 20 }
    ],
    gulfs: [
      { identity: 'GRATITUDE_WESTERN_GULF', centerX: -170, halfWidth: 30, inlandReach: 28 }
    ],
    bays: [
      { identity: 'GRATITUDE_SANCTUARY_BAY', centerX: -82, halfWidth: 24, inlandReach: 20 },
      { identity: 'GRATITUDE_BAY', centerX: 118, halfWidth: 82, inlandReach: 48 }
    ],
    headlands: [
      { identity: 'GRATITUDE_CENTRAL_HEADLAND', centerX: -125, halfWidth: 24, waterwardReach: 20 },
      { identity: 'GRATITUDE_HARBOR_HEADLAND', centerX: 48, halfWidth: 42, waterwardReach: 10.5 },
      { identity: 'GRATITUDE_EASTERN_HEADLAND', centerX: 198, halfWidth: 46, waterwardReach: 7.5 }
    ],
    coastalRhythmLaw: 'MAJOR_LOBES_AND_INLETS_MUST_DIFFER_IN_WIDTH_DEPTH_AND_SPACING',
    radialSymmetryProhibited: true,
    circularBlobMorphologyProhibited: true
  },
  sandbarTransferLaw: {
    count: 3,
    identityAndRelationshipTransferRequired: true,
    exactVertexTransferAcrossLodProhibited: true
  },
  transferLaw: 'TRANSFER_PROPERTY_TRUTH_NOT_REPRESENTATION_GEOMETRY'
});

export const H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM = deepFreeze({
  systemId: 'H_EARTH_GRATITUDE_INLAND_MOUNTAIN_WATERSHED_CONTINUATION_v1',
  continent: 'GRATITUDE',
  rangeIdentity: 'GRATITUDE_PRIMARY_INLAND_RANGE',
  morphology: 'CURVED_ASYMMETRIC_MULTI_RIDGE_RANGE_WITH_SADDLES',
  ridgelineSequence: [
    { identity: 'GRATITUDE_RIDGE_EAST', center: { x: 148, z: -224 }, role: 'COASTAL_RANGE_CONTINUATION' },
    { identity: 'GRATITUDE_RIDGE_CENTRAL', center: { x: 86, z: -235 }, role: 'PRIMARY_INLAND_SPINE' },
    { identity: 'GRATITUDE_RIDGE_WEST', center: { x: 18, z: -226 }, role: 'WESTERN_INLAND_ARTICULATION' },
    { identity: 'GRATITUDE_RIDGE_SHOULDER', center: { x: -52, z: -208 }, role: 'FOOTHILL_TRANSITION' }
  ],
  passes: [
    { identity: 'GRATITUDE_PASS_EAST', center: { x: 119, z: -226 }, connects: ['GRATITUDE_RIDGE_EAST', 'GRATITUDE_RIDGE_CENTRAL'] },
    { identity: 'GRATITUDE_PASS_CENTRAL', center: { x: 52, z: -230 }, connects: ['GRATITUDE_RIDGE_CENTRAL', 'GRATITUDE_RIDGE_WEST'] }
  ],
  basin: {
    identity: 'GRATITUDE_INLAND_RECEIVING_BASIN',
    center: { x: 18, z: -192 },
    drainageRole: 'RECEIVE_UPSLOPE_WATERSHED_FLOW_WITHOUT_REPLACING_PROTECTED_LOCAL_HYDROLOGY'
  },
  watershedLaw: {
    direction: 'RIDGELINES_TO_PASSES_AND_VALLEYS_TO_LOWER_GRATITUDE_TERRAIN',
    protectedHydrologyPreserved: true,
    waterfallReservoirRelationshipPreserved: true
  },
  overlapLaw: {
    identity: 'GRATITUDE_ARTICULATED_POSITIVE_RELIEF_OVERLAP_v1',
    strongestLocalPositiveReliefRetention: 1,
    secondaryOverlappingPositiveReliefRetention: 0.22,
    namedReliefComponentsPreserved: true,
    passesBasinsAndValleysExcludedFromCompression: true,
    purpose: 'PREVENT_MULTIPLE_VALID_RELIEF_FEATURES_FROM_SUMMING_INTO_AN_ENCLOSING_NEAR_FIELD_SCREEN'
  },
  rearBoundaryLaw: 'NO_RIDGE_OR_BLUFF_MAY_EXIST_SOLELY_AS_A_REAR_WORLD_BOX_TERMINUS',
  foothillLaw: 'PRIMARY_RELIEF_TAPERS_CONTINUOUSLY_INTO_NAVIGABLE_SURROUNDING_TERRAIN'
});

export const H_EARTH_TERRAIN_FIELD = deepFreeze({
  contractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  generationRevision: 3,
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  coreDomain: { xMinimum: -256, xMaximum: 256, zMinimum: -256, zMaximum: 64 },
  worldDomain: { xMinimum: -1024, xMaximum: 1024, zMinimum: -1024, zMaximum: 768, seaLevelY: 0 },
  boundaryPolicy: {
    mode: 'PROCEDURAL_CONTINUATION_BEYOND_CORE_DOMAIN',
    finitePerimeterWallProhibited: true,
    visibleRectangularTerminationProhibited: true,
    foundingPacketMutationPerformed: false
  },
  sampling: {
    derivativeStep: 0.5,
    sharedEdgeRule: 'SAME_WORLD_COORDINATE_SAMPLES_SAME_CANONICAL_FIELD',
    normalRule: 'CENTRAL_DIFFERENCE_FROM_CANONICAL_FIELD',
    numericTolerance: 1e-8
  },
  heightProfiles: {
    coast: 'GRATITUDE_TRUE_CONTINENTAL_COASTAL_ENTRY_PROFILE_v1',
    dune: 'COASTAL_BERM_PROFILE_v1',
    lowland: 'LOWLAND_PROFILE_v1',
    rolling: 'ROLLING_TERRAIN_PROFILE_v1',
    hill: 'NAVIGABLE_HILL_PROFILE_v1',
    ridge: 'RIDGE_BLUFF_PROFILE_v1',
    inlandRange: 'GRATITUDE_INLAND_MULTI_RIDGE_PROFILE_v1',
    pass: 'GRATITUDE_MOUNTAIN_PASS_PROFILE_v1',
    basin: 'GRATITUDE_RECEIVING_BASIN_PROFILE_v1',
    foothill: 'GRATITUDE_FOOTHILL_TAPER_PROFILE_v1',
    valley: 'DRAINAGE_VALLEY_PROFILE_v1',
    positiveReliefComposition: 'STRONGEST_LOCAL_FEATURE_PLUS_ATTENUATED_SECONDARY_OVERLAP_v1',
    water: 'COASTAL_WATER_DEPTH_PROFILE_v1'
  },
  coastalSystem: H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  inlandMountainWatershedSystem: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
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
  const coast = H_EARTH_GRATITUDE_COASTAL_SYSTEM.continentalCoast;
  const bay = H_EARTH_GRATITUDE_COASTAL_SYSTEM.bay;
  const canonicalBackbone = coast.baselineZ
    + 7.5 * Math.sin(worldX / 58)
    + 2.75 * Math.sin((worldX + 31) / 19);
  const westernPeninsula = 25 * bell(worldX, -220, 30);
  const westernGulf = -28 * bell(worldX, -170, 30);
  const centralHeadland = 20 * bell(worldX, -125, 24);
  const sanctuaryBay = -20 * bell(worldX, -82, 24);
  const bayCore = -bay.maximumInlandReach * bell(worldX, bay.centerX, bay.halfWidth);
  const bayAsymmetry = -9.0 * bell(worldX, bay.centerX + 22, 44);
  const westernHeadland = 10.5 * bell(worldX, bay.westernHeadlandX, 42);
  const easternHeadland = 7.5 * bell(worldX, bay.easternHeadlandX, 46);
  const easternPeninsula = 20 * bell(worldX, 232, 24);
  const westernRhythmWindow = bell(worldX, -166, 118);
  const easternRhythmWindow = bell(worldX, 220, 62);
  const nestedCoastalRhythm = (
    2.2 * Math.sin((worldX + 17) / 11) +
    1.1 * Math.sin((worldX - 9) / 6.5)
  ) * Math.max(westernRhythmWindow, easternRhythmWindow);
  return canonicalBackbone
    + westernPeninsula + westernGulf + centralHeadland
    + sanctuaryBay + westernHeadland
    + bayCore + bayAsymmetry
    + easternHeadland + easternPeninsula
    + nestedCoastalRhythm;
}

function evaluateRawElevation(worldX, worldZ) {
  const shorelineZ = getHEarthCanonicalShorelineZ(worldX);
  const inlandDistance = shorelineZ - worldZ;
  const waterwardDistance = worldZ - shorelineZ;
  if (waterwardDistance > 0) {
    const shallow = -0.35 - Math.min(waterwardDistance, 28) * 0.018;
    const openWater = -0.85 - Math.max(0, waterwardDistance - 28) * 0.012;
    return shallow * (1 - smoothstep(18, 38, waterwardDistance)) + openWater * smoothstep(18, 38, waterwardDistance);
  }
  const coastRise = 0.025 * Math.max(0, inlandDistance);
  const wetSandCompression = -0.22 * Math.exp(-Math.max(0, inlandDistance) / 16);
  const dune = gaussian(worldX, worldZ, 6, shorelineZ - 34, 190, 22, 5.8);
  const rolling = 1.7 * Math.sin((worldX + 22) / 48) * smoothstep(55, 180, inlandDistance)
    + 1.2 * Math.sin((worldZ + 140) / 29) * smoothstep(70, 200, inlandDistance);
  const hill = gaussian(worldX, worldZ, 72, -172, 62, 50, 27);

  const ridgeEast = gaussian(worldX, worldZ, 148, -224, 66, 34, 38);
  const ridgeCentral = gaussian(worldX, worldZ, 86, -235, 68, 37, 34);
  const ridgeWest = gaussian(worldX, worldZ, 18, -226, 76, 43, 29);
  const ridgeShoulder = gaussian(worldX, worldZ, -52, -208, 82, 52, 21);
  const passEast = gaussian(worldX, worldZ, 119, -226, 19, 23, -14);
  const passCentral = gaussian(worldX, worldZ, 52, -230, 20, 25, -12);
  const receivingBasin = gaussian(worldX, worldZ, 18, -192, 66, 46, -7.5);
  const foothillTaper = gaussian(worldX, worldZ, -12, -176, 126, 62, 8.5);

  const positiveReliefComponents = [
    hill,
    ridgeEast,
    ridgeCentral,
    ridgeWest,
    ridgeShoulder,
    foothillTaper
  ];
  const strongestPositiveRelief = Math.max(...positiveReliefComponents);
  const totalPositiveRelief = positiveReliefComponents.reduce((sum, value) => sum + value, 0);
  const secondaryPositiveRelief = Math.max(0, totalPositiveRelief - strongestPositiveRelief);
  const articulatedPositiveRelief = strongestPositiveRelief + secondaryPositiveRelief * 0.22;

  const lowland = gaussian(worldX, worldZ, -92, -152, 70, 58, -6.5);
  const valley = gaussian(worldX, worldZ, 2, -198, 44, 82, -11.5);
  return coastRise + wetSandCompression + dune + rolling + articulatedPositiveRelief
    + passEast + passCentral + receivingBasin
    + lowland + valley;
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
  return evaluateRawElevation(worldX, worldZ);
}

export function sampleHEarthTerrainField(worldX, worldZ) {
  if (!finite(worldX) || !finite(worldZ)) return deepFreeze({ valid: false, status: 'TERRAIN_SAMPLE_REJECTED_NONFINITE', worldX, worldZ });
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
  const curvature = (left - 2 * elevation + right) / (step * step) + (back - 2 * elevation + front) / (step * step);
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
    coastalSystemId: H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
    inlandMountainWatershedSystemId: H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
    gradient: { x: dx, z: dz },
    normal: { x: -dx / normalLength, y: 1 / normalLength, z: -dz / normalLength },
    slope,
    slopeClass: classifySlope(slope),
    curvature,
    curvatureClass: classifyCurvature(curvature),
    materialProfile: resolveMaterialProfile(shorelineDistance, elevation, slope)
  });
}

export function evaluateHEarthTerrainSharedEdge({ edgeA, edgeB, tolerance = H_EARTH_TERRAIN_FIELD.sampling.numericTolerance }) {
  const issues = [];
  if (!Array.isArray(edgeA) || !Array.isArray(edgeB) || edgeA.length !== edgeB.length) issues.push('EDGE_SAMPLE_COUNT_MISMATCH');
  else edgeA.forEach((a, index) => {
    const b = edgeB[index];
    if (!a || !b || a.key !== b.key) issues.push(`EDGE_KEY_MISMATCH:${index}`);
    for (const axis of ['x', 'y', 'z']) if (!finite(a?.world?.[axis]) || !finite(b?.world?.[axis]) || Math.abs(a.world[axis] - b.world[axis]) > tolerance) issues.push(`EDGE_POSITION_MISMATCH:${axis}:${index}`);
    for (const axis of ['x', 'y', 'z']) if (!finite(a?.normal?.[axis]) || !finite(b?.normal?.[axis]) || Math.abs(a.normal[axis] - b.normal[axis]) > tolerance) issues.push(`EDGE_NORMAL_MISMATCH:${axis}:${index}`);
  });
  return deepFreeze({ eligible: issues.length === 0, status: issues.length === 0 ? 'TERRAIN_SHARED_EDGE_PASS' : 'TERRAIN_SHARED_EDGE_FAIL', tolerance, issues });
}