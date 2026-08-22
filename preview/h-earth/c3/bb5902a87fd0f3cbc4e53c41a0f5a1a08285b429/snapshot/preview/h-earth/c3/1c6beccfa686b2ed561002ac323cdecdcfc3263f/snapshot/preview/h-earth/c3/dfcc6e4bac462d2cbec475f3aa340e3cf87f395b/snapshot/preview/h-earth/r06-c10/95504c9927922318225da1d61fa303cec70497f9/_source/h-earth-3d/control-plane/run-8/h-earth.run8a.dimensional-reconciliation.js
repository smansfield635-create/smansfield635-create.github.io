/**
 * H_EARTH_EXISTING_MATHEMATICAL_BASELINE_PACKET_CORRIDOR_AND_DIMENSIONAL_GEOMETRY_RECONCILIATION_RUN_8A_v1
 *
 * Contract and analytical-field package only. Existing NEWS geometry mathematics,
 * Run 6 terrain truth, legacy proxy, Packet 001, Packet 002, South construction,
 * and West admission remain unchanged. No neutral geometry, admission, transfer,
 * renderer, route, deployment, or public visual claim is created here.
 */
import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,
  H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID
} from '../../../showroom/globe/h-earth/render/geometry-kernel.js';
import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthTerrainElevation
} from '../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_TERRAIN_FORMATIONS,
  H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID
} from '../../terrain/h-earth.terrain-formations.js';
import {
  H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN
} from '../../integration/h-earth.landscape-realization-planner.js';
import {
  H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,
  H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT
} from '../../integration/h-earth.source-object-geometry-resolution.js';
import {
  H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID
} from '../../integration/h-earth.post-west-admitted-geometry-transfer.js';
import {
  H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID,
  H_EARTH_GEOMETRY_LANDSCAPE_PROFILE
} from '../../../showroom/globe/h-earth/render/geometry-landscape.js';
import {
  H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID
} from '../../../showroom/globe/h-earth/render/geometry-distant-context.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const smoothstep = (edge0, edge1, value) => {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const smootherstep01 = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const gaussian = (value, center, radius) => {
  const d = (value - center) / radius;
  return Math.exp(-(d * d));
};
const intervalEnvelope = (value, minimum, maximum, feather) =>
  smoothstep(minimum, minimum + feather, value) *
  (1 - smoothstep(maximum - feather, maximum, value));

export const H_EARTH_RUN_8A_CONTRACT_ID =
  'H_EARTH_EXISTING_MATHEMATICAL_BASELINE_PACKET_CORRIDOR_AND_DIMENSIONAL_GEOMETRY_RECONCILIATION_RUN_8A_v1';
export const H_EARTH_RUN_8A_SOURCE_FILE =
  '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js';

export const H_EARTH_RUN_8A_BASELINE_INTAKE_AND_PRESERVATION_LEDGER = freeze({
  outputId: 'RUN_8A_OUTPUT_1_EXISTING_MATHEMATICAL_BASELINE_INTAKE_AND_PRESERVATION_LEDGER',
  controllingRepositoryCommit: 'bb1273ecad6ad1441555e035a58d2ae7a1c3dc91',
  records: [
    ['GEOMETRY_MATHEMATICS_CONSTITUTION', H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID, 'PRESERVE'],
    ['NEWS_GEOMETRY_PUBLIC_FACADE', H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID, 'PRESERVE'],
    ['NEWS_GEOMETRY_OWNERSHIP', H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID, 'PRESERVE'],
    ['NORTH_FOUNDATIONAL_MATHEMATICS', H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID, 'PRESERVE'],
    ['EAST_DESCRIPTION_TOPOLOGY_NORMALS', H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID, 'PRESERVE'],
    ['SOUTH_NEUTRAL_CONSTRUCTION', H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID, 'PRESERVE'],
    ['WEST_ADMISSION', H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID, 'PRESERVE'],
    ['RUN_6_TERRAIN_FIELD', H_EARTH_TERRAIN_FIELD_CONTRACT_ID, 'PRESERVE_AS_BASELINE_OCCURRENCE'],
    ['RUN_6_TERRAIN_FORMATIONS', H_EARTH_TERRAIN_FORMATIONS_CONTRACT_ID, 'PRESERVE_AS_BASELINE_OCCURRENCE'],
    ['RUN_6_REALIZATION_PLANNER', H_EARTH_LANDSCAPE_REALIZATION_PLANNER_CONTRACT_ID, 'PRESERVE_PENDING_SUCCESSOR'],
    ['RUN_6_TERRAIN_PROVIDER', H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID, 'PRESERVE_AS_9_BY_9_BASELINE'],
    ['RUN_6_DISTANT_PROXY', H_EARTH_GEOMETRY_DISTANT_CONTEXT_CONTRACT_ID, 'PRESERVE_AS_LEGACY_PROXY_OCCURRENCE'],
    ['PACKET_001', H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID, 'PRESERVE_AS_PRECEDENT'],
    ['PACKET_002', H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID, 'PRESERVE_AS_DOWNSTREAM_PRECEDENT']
  ].map(([authority, identity, disposition]) => freeze({ authority, identity, disposition })),
  forbiddenReinvention: [
    'VECTOR_MATHEMATICS', 'MATRIX_MATHEMATICS', 'FINITE_NUMBER_LAWS',
    'BOUNDS', 'TOLERANCES', 'HEIGHT_FIELD_SAMPLING_FOUNDATIONS',
    'FACE_AND_VERTEX_NORMAL_FOUNDATIONS', 'INDEXED_MESH_VALIDATION',
    'NEUTRAL_PRIMITIVE_CONSTRUCTION', 'WEST_ADMISSION'
  ]
});

export const H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION = freeze({
  outputId: 'RUN_8A_OUTPUT_2_PACKET_001_AND_PACKET_002_APPLICABILITY_DISPOSITION',
  packet001: {
    currentContractId: H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,
    currentScope: H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT.packetName,
    disposition: 'PRESERVE_UNMODIFIED',
    universalResolver: false,
    successorMountainDisposition: 'NEW_PACKET_001_STYLE_FORMATION_RESOLUTION_LANE_REQUIRED',
    vegetationDisposition: 'NEW_OBJECT_ARCHETYPE_AND_INSTANCE_RESOLUTION_LANE_REQUIRED',
    silentGeneralization: 'PROHIBITED'
  },
  packet002: {
    currentContractId: H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_CONTRACT_ID,
    disposition: 'PRESERVE_UNMODIFIED',
    shapeDefinitionAuthority: false,
    successorDisposition: 'NEW_NARROW_SUCCESSOR_POST_WEST_TRANSFER_LANE_REQUIRED',
    renewalTiming: 'RUN_8E_AFTER_RUN_8B_TO_8D_EXECUTED_IDENTITIES_EXIST',
    preemptiveMutation: 'PROHIBITED'
  }
});

export const H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION = freeze({
  outputId: 'RUN_8A_OUTPUT_3_MOUNTAIN_REALIZATION_CLASS_DECISION',
  predecessorFormationId: 'H_EARTH_DISTANT_HIGHLAND_001',
  predecessorDisposition: 'PRESERVE_CURRENT_BASELINE_AND_HISTORY',
  predecessorProviderRealization: 'LEGACY_RUN_6_17_SAMPLE_OPEN_CREST_STRIP',
  inPlaceReclassification: 'PROHIBITED',
  successorFormationId: 'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001',
  successorFormationClass: 'CONTINUOUS_HIGHLAND_OR_MOUNTAIN',
  supersedesForFullRealization: 'H_EARTH_DISTANT_HIGHLAND_001',
  fullRealizationEligibility: true,
  proxyRealizationEligibility: true,
  geometricConnectionToTerrain: 'REQUIRED',
  detachedCurtainRealization: 'PROHIBITED',
  navigationClass: 'CONTINUOUS_TERRAIN_WITH_BOUNDED_TRAVERSAL',
  traversalPartitions: {
    foothills: 'POTENTIALLY_NAVIGABLE',
    moderateSlopes: 'TRAVERSAL_PROJECTION_REQUIRED',
    steepRidgesAndCliffs: 'POTENTIALLY_NON_NAVIGABLE',
    summitAccess: 'NOT_PREDECLARED'
  },
  continuousGeometryImpliesUniversalNavigability: false,
  legacyProxyFutureRole: 'DISTANT_LOD_CANDIDATE_AFTER_SUCCESSOR_CORRESPONDENCE_VALIDATION'
});

export const H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION = freeze({
  outputId: 'RUN_8A_OUTPUT_4_WORLD_DOMAIN_RECONCILIATION',
  currentTerrainFieldContractId: H_EARTH_TERRAIN_FIELD_CONTRACT_ID,
  currentTerrainFieldDisposition: 'PRESERVE_AS_RUN_6_BASELINE',
  terrainFieldMutationInPlace: 'PROHIBITED',
  successorTerrainFieldContractId: 'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1',
  successorWorldDomain: { xMinimum: -256, xMaximum: 256, zMinimum: -320, zMaximum: 64, seaLevelY: 0 },
  newlyAuthorizedFieldRegion: { zMinimum: -320, zMaximum: -256 },
  successorMountainCoreBounds: { xMinimum: -224, xMaximum: 32, zMinimum: -292, zMaximum: -236 },
  successorMountainTransitionBounds: { xMinimum: -240, xMaximum: 56, zMinimum: -312, zMaximum: -220 },
  rearWorldBuffer: 28,
  formerBoundaryZ: -256,
  continuityLaw: {
    c0HeightContinuity: 'REQUIRED',
    c1GradientContinuity: 'REQUIRED_WHERE_PRACTICABLE',
    normalContinuity: 'REQUIRED',
    visibleSeam: 'PROHIBITED',
    verticalSkirtAsPrimaryConnection: 'PROHIBITED'
  },
  mereDomainConstantChangeWithoutSurfaceLaw: 'PROHIBITED',
  run8BConstructionBeforeSuccessorFieldLaw: 'PROHIBITED'
});

const DOMAIN = H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain;
const FORMER_BOUNDARY_Z = -256;
const STEP = 0.5;
const BOUNDARY_DERIVATIVE_EPSILON = 0.01;
const baselineBoundaryDerivativeZ = (x) =>
  (sampleHEarthTerrainElevation(
    x,
    FORMER_BOUNDARY_Z + BOUNDARY_DERIVATIVE_EPSILON
  ) - sampleHEarthTerrainElevation(x, FORMER_BOUNDARY_Z)) /
  BOUNDARY_DERIVATIVE_EPSILON;
const rearTerrainLevel = (x) =>
  16 + 3.5 * Math.sin((x + 40) / 76) + 1.5 * Math.sin((x - 18) / 31);
const successorBaseElevation = (x, z) => {
  if (z >= FORMER_BOUNDARY_Z) return sampleHEarthTerrainElevation(x, z);
  const boundaryHeight = sampleHEarthTerrainElevation(x, FORMER_BOUNDARY_Z);
  const tangent = boundaryHeight + baselineBoundaryDerivativeZ(x) * (z - FORMER_BOUNDARY_Z);
  const progress = (FORMER_BOUNDARY_Z - z) / (FORMER_BOUNDARY_Z - DOMAIN.zMinimum);
  const blend = smootherstep01(progress);
  return tangent * (1 - blend) + rearTerrainLevel(x) * blend;
};

export const H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT = freeze({
  outputId: 'RUN_8A_OUTPUT_5_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT',
  contractId: 'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_DIMENSIONAL_SURFACE_RUN_8A_v1',
  formationId: 'H_EARTH_CONTINUOUS_HIGHLAND_MOUNTAIN_001',
  coordinateFrame: 'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS',
  surfaceLaw: 'Y=SUCCESSOR_BASE_TERRAIN(X,Z)+MOUNTAIN_CONTRIBUTION(X,Z)',
  dimensionality: 'XZ_FOOTPRINT_WITH_Y_ELEVATION',
  coreBounds: H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorMountainCoreBounds,
  transitionBounds: H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorMountainTransitionBounds,
  elevationEnvelope: { minimum: 8, maximum: 124 },
  primaryRidgePathLaw: 'Z=-266+7*sin((X+104)/54)+3*sin((X-12)/21)',
  constituentLaws: [
    'PRIMARY_RIDGE_MASS', 'SUMMIT_MASS', 'SECONDARY_RIDGE_MASS',
    'FOOTHILL_CONNECTION', 'VALLEY_CUT', 'REAR_FALLOFF'
  ],
  requiresMultipleZBands: true,
  requiresGroundConnection: true,
  requiresSharedTerrainTruth: true,
  independentProxyShapeInvention: 'PROHIBITED',
  derivationChain: [
    'SUCCESSOR_MOUNTAIN_DIMENSIONAL_TRUTH', 'FULL_DETAIL_TERRAIN_MESH',
    'REDUCED_DETAIL_TERRAIN_MESH', 'DISTANT_PROXY_MESH'
  ]
});

export function evaluateHEarthRun8AMountainContribution(x, z) {
  if (!finite(x) || !finite(z)) return Number.NaN;
  const b = H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.transitionBounds;
  if (x < b.xMinimum || x > b.xMaximum || z < b.zMinimum || z > b.zMaximum) return 0;
  const xEnvelope = intervalEnvelope(x, b.xMinimum, b.xMaximum, 24);
  const zEnvelope = intervalEnvelope(z, b.zMinimum, b.zMaximum, 20);
  const ridgeZ = -266 + 7 * Math.sin((x + 104) / 54) + 3 * Math.sin((x - 12) / 21);
  const primary = 62 * xEnvelope * gaussian(z, ridgeZ, 22);
  const summit = 27 * gaussian(x, -92, 38) * gaussian(z, -271, 17);
  const secondary = 24 * gaussian(x, -6, 52) * gaussian(z, -250, 20);
  const foothill = 13 * xEnvelope * zEnvelope;
  const valleyCut = 15 * gaussian(x, -48, 26) * gaussian(z, -256, 13);
  return zEnvelope * Math.max(0, primary + summit + secondary + foothill - valleyCut);
}

export function sampleHEarthRun8ASuccessorTerrainElevation(x, z) {
  if (!finite(x) || !finite(z)) return Number.NaN;
  if (x < DOMAIN.xMinimum || x > DOMAIN.xMaximum || z < DOMAIN.zMinimum || z > DOMAIN.zMaximum) {
    return Number.NaN;
  }
  return successorBaseElevation(x, z) + evaluateHEarthRun8AMountainContribution(x, z);
}

export function sampleHEarthRun8ASuccessorTerrainField(x, z) {
  const elevation = sampleHEarthRun8ASuccessorTerrainElevation(x, z);
  if (!finite(elevation)) return freeze({ valid: false, status: 'RUN_8A_SUCCESSOR_TERRAIN_SAMPLE_REJECTED', worldX: x, worldZ: z });
  const xl = Math.max(DOMAIN.xMinimum, x - STEP);
  const xr = Math.min(DOMAIN.xMaximum, x + STEP);
  const zb = Math.max(DOMAIN.zMinimum, z - STEP);
  const zf = Math.min(DOMAIN.zMaximum, z + STEP);
  const dx = (sampleHEarthRun8ASuccessorTerrainElevation(xr, z) - sampleHEarthRun8ASuccessorTerrainElevation(xl, z)) / Math.max(Number.EPSILON, xr - xl);
  const dz = (sampleHEarthRun8ASuccessorTerrainElevation(x, zf) - sampleHEarthRun8ASuccessorTerrainElevation(x, zb)) / Math.max(Number.EPSILON, zf - zb);
  const normalLength = Math.hypot(-dx, 1, -dz);
  const curvature =
    sampleHEarthRun8ASuccessorTerrainElevation(xl, z) - 2 * elevation + sampleHEarthRun8ASuccessorTerrainElevation(xr, z) +
    sampleHEarthRun8ASuccessorTerrainElevation(x, zb) - 2 * elevation + sampleHEarthRun8ASuccessorTerrainElevation(x, zf);
  return freeze({
    valid: true,
    status: 'RUN_8A_SUCCESSOR_TERRAIN_SAMPLE_COMPLETE',
    contractId: H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT.contractId,
    world: { x, y: elevation, z },
    elevation,
    gradient: { x: dx, z: dz },
    normal: { x: -dx / normalLength, y: 1 / normalLength, z: -dz / normalLength },
    slope: Math.hypot(dx, dz),
    curvature,
    mountainContribution: evaluateHEarthRun8AMountainContribution(x, z),
    domainRegion: z < FORMER_BOUNDARY_Z
      ? 'SUCCESSOR_EXTENSION_REGION'
      : 'LEGACY_DOMAIN_WITH_SUCCESSOR_FORMATION_SPECIALIZATION'
  });
}

export function evaluateHEarthRun8AFormerBoundaryContinuity({
  xSamples = [-224, -192, -160, -128, -96, -64, -32, 0, 32],
  epsilon = 0.01
} = {}) {
  const samples = xSamples.map((x) => {
    const center = sampleHEarthRun8ASuccessorTerrainElevation(x, FORMER_BOUNDARY_Z);
    const north = sampleHEarthRun8ASuccessorTerrainElevation(x, FORMER_BOUNDARY_Z + epsilon);
    const south = sampleHEarthRun8ASuccessorTerrainElevation(x, FORMER_BOUNDARY_Z - epsilon);
    return freeze({
      worldX: x,
      center,
      north,
      south,
      heightDiscontinuity: Math.abs((north + south) / 2 - center),
      gradientDiscontinuity: Math.abs((north - center) / epsilon - (center - south) / epsilon)
    });
  });
  const maximumHeightDiscontinuity = Math.max(...samples.map((s) => s.heightDiscontinuity));
  const maximumGradientDiscontinuity = Math.max(...samples.map((s) => s.gradientDiscontinuity));
  return freeze({
    eligible: maximumHeightDiscontinuity <= 0.05 && maximumGradientDiscontinuity <= 0.5,
    status: 'RUN_8A_FORMER_BOUNDARY_CONTINUITY_EVALUATED',
    formerBoundaryZ: FORMER_BOUNDARY_Z,
    c0Tolerance: 0.05,
    c1Tolerance: 0.5,
    maximumHeightDiscontinuity,
    maximumGradientDiscontinuity,
    samples
  });
}

export const H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT = freeze({
  outputId: 'RUN_8A_OUTPUT_6_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT',
  contractId: 'H_EARTH_TERRAIN_SAMPLING_AND_REFINEMENT_RUN_8A_v1',
  currentBaseline: {
    providerContractId: H_EARTH_GEOMETRY_LANDSCAPE_CONTRACT_ID,
    samplesPerAxis: H_EARTH_GEOMETRY_LANDSCAPE_PROFILE.samplesPerAxis,
    disposition: 'PRESERVE_AS_RUN_6_BASELINE'
  },
  profiles: {
    FULL_DETAIL: {
      baseSpacingWorldUnits: 4,
      refinementSpacingWorldUnits: 2,
      refinementTriggers: [
        'ABS_CURVATURE_GREATER_THAN_0_04', 'SLOPE_GREATER_THAN_0_22',
        'MOUNTAIN_CONTRIBUTION_GREATER_THAN_8', 'FORMATION_BOUNDARY_WITHIN_8_WORLD_UNITS'
      ],
      maximumVerticalApproximationError: 0.75,
      maximumNormalAngularErrorDegrees: 6
    },
    REDUCED_DETAIL: {
      baseSpacingWorldUnits: 8,
      refinementSpacingWorldUnits: 4,
      maximumVerticalApproximationError: 2.5,
      maximumNormalAngularErrorDegrees: 14
    },
    DISTANT_PROXY: {
      baseSpacingWorldUnits: 16,
      silhouetteRefinementSpacingWorldUnits: 8,
      maximumSilhouetteVerticalError: 4,
      requiresSourceTruthCorrespondence: true
    }
  },
  topology: {
    surfaceType: 'INDEXED_XZ_HEIGHT_FIELD_TRIANGLE_MESH',
    diagonalRule: 'DETERMINISTIC_CURVATURE_AWARE_OR_FIXED_CANONICAL',
    sharedEdgeRule: 'SAME_WORLD_COORDINATE_SAME_SAMPLE_AND_NORMAL',
    nondegenerateTrianglesRequired: true,
    connectedTerrainRequired: true,
    verticalSkirtPrimaryConnectionProhibited: true
  },
  run8BMayChooseHigherResolution: true,
  run8BMayChooseLowerResolutionThanContract: false
});

export const H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT = freeze({
  outputId: 'RUN_8A_OUTPUT_7_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT',
  contractId: 'H_EARTH_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_RUN_8A_v1',
  localCoordinateFrame: { xAxis: 'LOCAL_WIDTH', yAxis: 'LOCAL_UP', zAxis: 'LOCAL_DEPTH', rootAnchor: { x: 0, y: 0, z: 0 } },
  archetypes: {
    COASTAL_GRASS_TUFT: { bounds: { x: 0.42, y: 0.8, z: 0.42 }, topologyLaw: 'THREE_CROSSED_TAPERED_RIBBON_PAIRS', minimumDirectionalFaces: 6, southConstructionStrategy: 'INDEXED_TRIANGLE_MESH' },
    LOWLAND_SHRUB: { bounds: { x: 1.4, y: 1.15, z: 1.2 }, topologyLaw: 'RADIAL_BRANCH_CORE_WITH_LAYERED_CANOPY_SHELL', minimumRadialSegments: 8, southConstructionStrategy: 'TRIANGLE_MESH_PLUS_RADIAL_SHELL' },
    HIGHLAND_CONIFER_SAPLING: { bounds: { x: 1.2, y: 3.8, z: 1.2 }, topologyLaw: 'TRUNK_PRISM_WITH_THREE_TAPERED_RADIAL_CANOPY_TIERS', minimumRadialSegments: 8, southConstructionStrategy: 'PRISM_PLUS_RADIAL_SHELL' }
  },
  worldAnchorLaw: {
    worldXSource: 'DETERMINISTIC_POPULATION_INSTANCE_RECORD',
    worldZSource: 'DETERMINISTIC_POPULATION_INSTANCE_RECORD',
    worldYLaw: 'SUCCESSOR_TERRAIN_ELEVATION(WORLD_X,WORLD_Z)+ROOT_EMBED',
    rootEmbedWorldUnits: -0.03,
    upAlignment: 'SUCCESSOR_TERRAIN_NORMAL',
    yawLaw: 'DETERMINISTIC_INSTANCE_HASH',
    scaleLaw: 'DETERMINISTIC_BOUNDED_ARCHETYPE_SCALE',
    cameraRelativePosition: 'PROHIBITED',
    screenRelativePosition: 'PROHIBITED',
    sameWorldToCameraTransformAsTerrain: 'REQUIRED',
    samePhysicalDepthDomainAsTerrain: 'REQUIRED',
    terrainOcclusion: 'REQUIRED'
  },
  lifecycleDoesNotOwnWorldPosition: true,
  populationPlannerDoesNotOwnGeometry: true
});

export const H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT = freeze({
  outputId: 'RUN_8A_OUTPUT_8_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT',
  contractId: 'H_EARTH_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_RUN_8A_v1',
  requiredInputs: [
    'WORLD_POSITION', 'WORLD_NORMAL', 'SLOPE', 'CURVATURE', 'SURFACE_STATE',
    'ATMOSPHERE_STATE', 'SUN_DIRECTION_NORMALIZED', 'SUN_ELEVATION', 'CAMERA_DISTANCE'
  ],
  requiredOutputs: [
    'DIFFUSE_LIGHT_FACTOR', 'AMBIENT_LIGHT_FACTOR', 'SLOPE_SHADE_FACTOR',
    'CURVATURE_OCCLUSION_FACTOR', 'DISTANCE_HAZE_FACTOR', 'WETNESS_RESPONSE',
    'ROUGHNESS_RESPONSE', 'MATERIAL_BASE_RESPONSE'
  ],
  laws: {
    diffuse: 'MAX(0,DOT(WORLD_NORMAL,SUN_DIRECTION))',
    ambient: 'BOUNDED_NONZERO_SKY_AND_GROUND_AMBIENT',
    distanceHaze: 'MONOTONIC_WITH_CAMERA_DISTANCE_AND_ATMOSPHERE_STATE',
    wetness: 'SURFACE_STATE_MODULATES_DARKENING_AND_REFLECTANCE',
    geometryPrecedesLighting: true,
    flatColorAsDepthSubstitute: 'PROHIBITED'
  },
  visibleSunDiscRequirement: 'RUN_8C_PRESENTATION_REQUIREMENT',
  weatherAndDayNightStateVisibilityRequirement: 'RUN_8C_PRESENTATION_REQUIREMENT',
  rendererMayProjectAndRasterize: true,
  rendererMayInventMountainGeometry: false
});

export const H_EARTH_RUN_8A_SOUTH_AND_WEST_COMPATIBILITY_MAP = freeze({
  outputId: 'RUN_8A_OUTPUT_9_SOUTH_CONSTRUCTION_AND_WEST_ADMISSION_COMPATIBILITY_MAP',
  south: {
    contractId: H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_CONTRACT_ID,
    status: 'COMPATIBLE_NO_KERNEL_RENEWAL_REQUIRED',
    requiredOperations: [
      'CONSTRUCT_HEIGHT_FIELD_MESH', 'CONSTRUCT_TRIANGLE_MESH',
      'CALCULATE_FACE_AND_VERTEX_NORMALS', 'VALIDATE_INDEXED_MESH',
      'CONSTRUCT_PRISM_AND_RADIAL_SHELL_FOR_VEGETATION'
    ]
  },
  west: {
    contractId: H_EARTH_3D_GEOMETRY_KERNEL_WEST_CONTRACT_ID,
    status: 'COMPATIBLE_NO_ADMISSION_RENEWAL_REQUIRED',
    requiredOperations: ['PRIMITIVE_ADMISSION', 'BATCH_ADMISSION', 'AGGREGATE_FRAME_ADMISSION']
  },
  packet001SuccessorResolutionRequired: true,
  packet002SuccessorTransferRequired: true,
  kernelDefectEstablished: false,
  constructionAuthorityCreatedByRun8A: false,
  admissionAuthorityCreatedByRun8A: false
});

export const H_EARTH_RUN_8A_FUTURE_PACKET_002_PROVENANCE_REQUIREMENTS = freeze({
  outputId: 'RUN_8A_OUTPUT_10_FUTURE_PACKET_002_PROVENANCE_REQUIREMENTS',
  requiredFields: [
    'PREDECESSOR_FORMATION_ID', 'SUCCESSOR_FORMATION_ID', 'TERRAIN_FIELD_REVISION',
    'DIMENSIONAL_CONTRACT_ID', 'SAMPLING_PROFILE_ID', 'TOPOLOGY_PROFILE_ID',
    'NORMAL_PROFILE_ID', 'FULL_OR_PROXY_REALIZATION_CLASS',
    'SOURCE_OBJECT_OR_FORMATION_RESOLUTION_RECEIPT', 'GEOMETRY_CONSTRUCTION_RECEIPT',
    'SOUTH_NEUTRAL_PRIMITIVE_IDENTITY', 'WEST_ADMISSION_IDENTITY',
    'AGGREGATE_FRAME_MEMBERSHIP_IDENTITY'
  ],
  provenanceLossAllowed: false,
  fullAndProxySourceTruthMustMatch: true,
  currentPacket002MutationAuthorized: false,
  successorPacket002ConstructionAuthorizedInRun8A: false
});

export const H_EARTH_RUN_8A_OUTPUTS = freeze([
  H_EARTH_RUN_8A_BASELINE_INTAKE_AND_PRESERVATION_LEDGER,
  H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION,
  H_EARTH_RUN_8A_MOUNTAIN_REALIZATION_CLASS_DECISION,
  H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION,
  H_EARTH_RUN_8A_MOUNTAIN_DIMENSIONAL_SURFACE_CONTRACT,
  H_EARTH_RUN_8A_TERRAIN_SAMPLING_AND_REFINEMENT_CONTRACT,
  H_EARTH_RUN_8A_VEGETATION_LOCAL_GEOMETRY_AND_WORLD_ANCHOR_CONTRACT,
  H_EARTH_RUN_8A_NORMAL_LIGHT_AND_MATERIAL_INTERFACE_CONTRACT,
  H_EARTH_RUN_8A_SOUTH_AND_WEST_COMPATIBILITY_MAP,
  H_EARTH_RUN_8A_FUTURE_PACKET_002_PROVENANCE_REQUIREMENTS
]);

export function evaluateHEarthRun8AContract() {
  const issues = [];
  const predecessor = H_EARTH_TERRAIN_FORMATIONS.DISTANT_HIGHLAND_001;
  const proxyBand = H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN.chunks.find(
    (chunk) => chunk.realizationState === 'DISTANT_PROXY' &&
      chunk.worldBounds.zMin === -320 && chunk.worldBounds.zMax === -256
  );
  if (H_EARTH_RUN_8A_OUTPUTS.length !== 10) issues.push('OUTPUT_COUNT_NOT_10');
  if (H_EARTH_TERRAIN_FIELD.worldDomain.zMinimum !== -256) issues.push('RUN_6_TERRAIN_BASELINE_CHANGED');
  if (predecessor?.fullRealizationEligibility !== false ||
      predecessor?.proxyRealizationEligibility !== true ||
      predecessor?.navigationClass !== 'NON_NAVIGABLE_PROXY_ONLY') {
    issues.push('LEGACY_PROXY_CLASSIFICATION_NOT_PRESERVED');
  }
  if (!proxyBand) issues.push('RUN_6_PROXY_BAND_MINUS_320_TO_MINUS_256_MISSING');
  if (H_EARTH_RUN_8A_WORLD_DOMAIN_RECONCILIATION.successorWorldDomain.zMinimum !== -320) {
    issues.push('SUCCESSOR_DOMAIN_Z_MINIMUM_NOT_MINUS_320');
  }
  if (H_EARTH_RUN_8A_PACKET_APPLICABILITY_DISPOSITION.packet001.successorMountainDisposition !==
      'NEW_PACKET_001_STYLE_FORMATION_RESOLUTION_LANE_REQUIRED') {
    issues.push('PACKET_001_DISPOSITION_INVALID');
  }
  const continuity = evaluateHEarthRun8AFormerBoundaryContinuity();
  if (!continuity.eligible) issues.push('FORMER_BOUNDARY_CONTINUITY_FAILED');
  const mountainMass = Math.max(
    evaluateHEarthRun8AMountainContribution(-160, -280),
    evaluateHEarthRun8AMountainContribution(-96, -270),
    evaluateHEarthRun8AMountainContribution(-32, -252)
  );
  if (mountainMass <= 20) issues.push('MOUNTAIN_DIMENSIONAL_MASS_NOT_ESTABLISHED');
  if (evaluateHEarthRun8AMountainContribution(200, -270) !== 0 ||
      evaluateHEarthRun8AMountainContribution(-96, -319) !== 0) {
    issues.push('MOUNTAIN_TRANSITION_BOUNDS_NOT_FAIL_CLOSED');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_8A_DIMENSIONAL_RECONCILIATION_PASS'
      : 'RUN_8A_DIMENSIONAL_RECONCILIATION_FAIL',
    contractId: H_EARTH_RUN_8A_CONTRACT_ID,
    outputCount: H_EARTH_RUN_8A_OUTPUTS.length,
    continuity,
    run8BConstructionAuthority: 'WITHHELD_PENDING_RUN_8A_PASS',
    publicVisualClaim: false,
    productMutationAuthority: false,
    issues
  });
}

export const H_EARTH_RUN_8A_PACKAGE = freeze({
  contractId: H_EARTH_RUN_8A_CONTRACT_ID,
  sourceFile: H_EARTH_RUN_8A_SOURCE_FILE,
  programClass: 'BASELINE_INTAKE_AUTHORITY_RECONCILIATION_AND_DIMENSIONAL_DEFINITION',
  outputs: H_EARTH_RUN_8A_OUTPUTS,
  preservationLaw: {
    existingFoundationalMathematics: 'PRESERVE',
    existingTopologyAndNormalLaws: 'PRESERVE',
    existingNeutralConstructionKernel: 'PRESERVE',
    existingWestAdmissionAuthority: 'PRESERVE',
    terrainFieldReopening: 'SUCCESSOR_REVISION_ONLY_FOR_EXPLICIT_DOMAIN_AND_SURFACE_LAW',
    packet001Renewal: 'NEW_NARROW_SUCCESSOR_LANE_REQUIRED_NO_CURRENT_MUTATION',
    packet002Renewal: 'NEW_NARROW_SUCCESSOR_LANE_REQUIRED_AFTER_EXECUTED_IDENTITIES_EXIST'
  },
  stoppingBoundary: {
    run8BConstructionAuthorized: false,
    publicVisualClaimAuthorized: false,
    routeMutationAuthorized: false,
    deploymentAuthorized: false
  }
});

export default H_EARTH_RUN_8A_PACKAGE;
