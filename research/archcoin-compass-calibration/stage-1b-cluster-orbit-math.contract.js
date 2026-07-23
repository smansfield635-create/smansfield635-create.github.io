/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1B exact shared cluster-seat and orbit-relation candidate.
 * Research contract only. No live mutation or admission authority.
 */

const TWO_PI = Math.PI * 2;

function normalizeVector(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (!Number.isFinite(length) || length <= 1e-12) {
    throw new Error("ARCHCOIN_STAGE_1B_VECTOR_INVALID");
  }
  return Object.freeze(vector.map(component => component / length));
}

function seatUnitVector(index, count, latitudeAmplitude, latitudeFrequency) {
  const safeCount = Math.max(1, Number(count) || 1);
  const longitude = TWO_PI * index / safeCount - Math.PI / 2;
  const latitude = Math.sin((index + 0.5) * latitudeFrequency) * latitudeAmplitude;
  const cosineLatitude = Math.cos(latitude);
  return normalizeVector([
    Math.cos(longitude) * cosineLatitude,
    Math.sin(latitude),
    Math.sin(longitude) * cosineLatitude
  ]);
}

const SEAT_COUNT = 4;
const LATITUDE_AMPLITUDE = 0.48;
const LATITUDE_FREQUENCY = 1.73;
const BASE_SEATS = Object.freeze(
  Array.from({ length: SEAT_COUNT }, (_, index) =>
    seatUnitVector(index, SEAT_COUNT, LATITUDE_AMPLITUDE, LATITUDE_FREQUENCY)
  )
);

export const ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT_v1",
  status: "EXACT_BASELINE_PRESERVING_CANDIDATE_DEFINED_NOT_ADMITTED",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  sourceBlob: "570c8b64f803b46c3ff2eb22d650596d832467af",
  liveMutationAuthorized: false,
  admissionAuthority: "WITHHELD",

  coordinateContract: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "COMPLETE_NORMALIZED_UNIT_QUATERNION_XYZW",
    clusterDomain: "ONE_INDEPENDENT_ORIENTATION_PER_ACTIVE_CARDINAL_CLUSTER",
    memberTransform: "ONE_SHARED_CLUSTER_QUATERNION_APPLIED_TO_EVERY_BASE_SEAT",
    cumulativeClusterRoll: "PROHIBITED_BY_STAGE_1A_BASIS",
    independentMemberDrift: "PROHIBITED_FOR_CANONICAL_WORLD_AND_ACQUISITION_FACTS"
  }),

  seatPolicy: Object.freeze({
    policyId: "ARCHCOIN_EXISTING_DETERMINISTIC_FOUR_SEAT_RELATION_v1",
    seatCount: SEAT_COUNT,
    indexOrder: Object.freeze([0, 1, 2, 3]),
    longitudeDefinition: "2π * index / count - π/2",
    latitudeDefinition: "sin((index + 0.5) * 1.73) * 0.48",
    latitudeAmplitude: LATITUDE_AMPLITUDE,
    latitudeFrequency: LATITUDE_FREQUENCY,
    baseUnitVectors: BASE_SEATS,
    angularOrderPolicy: "INDEX_ORDER_MUST_NEVER_SWAP",
    memberIdentityPolicy: "ROOM_ID_REMAINS_BOUND_TO_ITS_BASE_SEAT_INDEX"
  }),

  radiusPolicy: Object.freeze({
    shape: "AXIS_SCALED_ELLIPSOIDAL_CLUSTER",
    horizontalRadiusX: 1.04,
    verticalRadiusY: 0.90,
    depthRadiusZ: 0.84,
    centerRadius: 0.26,
    worldPositionDefinition: "[rotated.x * 1.04, rotated.y * 0.90, rotated.z * 0.84]",
    radiusMutationAuthorized: false,
    tolerance: 1e-9
  }),

  primaryAnchorPolicy: Object.freeze({
    rawAnchor: Object.freeze([0, 0.70, 0.714]),
    normalizedAnchor: normalizeVector([0, 0.70, 0.714]),
    scoreDefinition: "dot(rotatedUnitVector, normalizedPrimaryAnchor)",
    primaryDefinition: "maximum score with deterministic lowest-seat-index tie break",
    tieTolerance: 1e-10
  }),

  worldRelation: Object.freeze({
    rotatedSeatDefinition: "normalize(quaternionRotateVector(clusterQuaternion, baseSeatUnitVector))",
    worldPositionDefinition: "componentWiseScale(rotatedSeat, [1.04,0.90,0.84])",
    pairwiseInvariant: "dot(rotatedSeat_i, rotatedSeat_j) equals dot(baseSeat_i, baseSeat_j)",
    handednessInvariant: "ordered triple orientation sign is preserved by every admitted unit quaternion",
    centerInvariant: "the cluster frame origin remains [0,0,0] before page-level translation",
    sharedQuaternionInvariant: "all four seats consume the exact same normalized cluster quaternion and revision"
  }),

  visualSeparation: Object.freeze({
    canonicalPositionMayIncludeAmbientOffset: false,
    acquisitionPositionMayIncludeAmbientOffset: false,
    renderOnlyFloatPermitted: true,
    renderOnlyLocalRotationPermitted: true,
    renderOnlyScaleAndHaloPermitted: true,
    primaryInferenceUsesCanonicalRotatedSeat: true,
    projectionUsesCanonicalWorldPosition: true
  }),

  noMutationProofRequirements: Object.freeze([
    "SOURCE_PROOF_ALL_ROOM_NODES_BIND_TO_DETERMINISTIC_INDEX_0_THROUGH_3",
    "SOURCE_PROOF_ALL_ROOM_WORLD_POSITIONS_USE_ONE_CLUSTER_QUATERNION",
    "EXECUTABLE_PAIRWISE_DOT_INVARIANCE_FOR_RANDOM_NORMALIZED_QUATERNIONS",
    "EXECUTABLE_ANGULAR_ORDER_PRESERVATION",
    "EXECUTABLE_DETERMINISTIC_PRIMARY_TIE_BREAK",
    "EXECUTABLE_NO_MEMBER_SPECIFIC_CANONICAL_OFFSET",
    "PROJECTION_FINITE_ACROSS_ADMITTED_STAGE_1A_CORRIDOR"
  ]),

  currentNoMutationProof: "RESEARCH_FIXTURES_DEFINED_EXECUTION_NOT_YET_RECORDED",
  candidateMutationScopeAfterProof: Object.freeze({
    crystals: "VERIFY_ONLY_IF_ALL_PROOFS_PASS",
    interactions: "STAGE_1A_CANDIDATE_OWNER",
    controller: "VERIFY_ONLY_UNLESS_ACCEPTANCE_SCHEMA_CHANGES",
    compositor: "VERIFY_ONLY_UNTIL_FOUNDATION_B"
  }),

  unresolvedBeforeAdmission: Object.freeze([
    "EXECUTABLE_FIXTURE_RESULTS",
    "SOURCE_LEVEL_ROOM_INDEX_BINDING_AUDIT",
    "VISUAL_CONFIRMATION_NO_PERCEIVED_SEAT_SWAP",
    "PHYSICAL_DEVICE_ACCEPTANCE",
    "LIVE_MUTATION_AUTHORITY"
  ])
});

export { seatUnitVector };
