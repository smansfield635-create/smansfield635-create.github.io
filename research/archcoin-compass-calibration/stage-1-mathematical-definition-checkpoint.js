/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1A / Stage 1B mathematical definition checkpoint.
 * This resolves research definitions only; it does not authorize live mutation.
 */

import {
  ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT
} from "./stage-1a-fixed-axis-math.contract.js";

import {
  ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT
} from "./stage-1b-cluster-orbit-math.contract.js";

import {
  ARCHCOIN_STAGE_1_MATH_FIXTURE_CONTRACT
} from "./stage-1-math-fixtures.js";

export const ARCHCOIN_STAGE_1_MATHEMATICAL_DEFINITION_CHECKPOINT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_MATHEMATICAL_DEFINITION_CHECKPOINT_v1",
  status: "EXACT_RESEARCH_CANDIDATE_DEFINED_EXECUTION_AND_ADMISSION_PENDING",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",

  resolvedResearchFields: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "COMPLETE_NORMALIZED_UNIT_QUATERNION_XYZW",
    exactAxisBasis: ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT.admittedCandidateBasis,
    exactPitchPolicy: ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT.pitchPolicy,
    exactSeatPolicy: ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT.seatPolicy,
    exactRadiusPolicy: ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT.radiusPolicy,
    exactPrimaryAnchorRelation: ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT.primaryAnchorPolicy,
    cumulativeClusterRoll: "PROHIBITED",
    independentMemberDrift: "PROHIBITED"
  }),

  definitionBasis: Object.freeze({
    stage1A: "Preserve current ARCHCOIN horizontal sign and sensitivity while replacing the free screen-plane axis with explicit world-Y yaw and camera-right pitch, fixed composition order, bounded cumulative pitch, and no roll.",
    stage1B: "Preserve the restored baseline four deterministic seat vectors, seat index identity, ellipsoidal radii, normalized primary anchor, and one shared cluster quaternion. Do not invent a planar ring or new radii during this stage."
  }),

  exactCandidateDecisions: Object.freeze([
    "POSITIVE_SCREEN_DX_MAPS_TO_POSITIVE_WORLD_Y_YAW",
    "POSITIVE_SCREEN_DY_MAPS_TO_POSITIVE_CAMERA_RIGHT_PITCH",
    "PITCH_DELTA_LEFT_MULTIPLIES_YAW_DELTA_LEFT_MULTIPLIES_CURRENT_ORIENTATION",
    "CUMULATIVE_PITCH_LIMIT_IS_PI_TIMES_0_32",
    "ROLL_AXIS_IS_NOT_AVAILABLE",
    "FOUR_BASE_SEATS_USE_EXISTING_LONGITUDE_AND_LATITUDE_FORMULAS",
    "BASE_SEAT_INDEX_AND_ROOM_ID_BINDING_IS_STABLE",
    "ALL_SEATS_CONSUME_ONE_NORMALIZED_CLUSTER_QUATERNION",
    "WORLD_POSITION_USES_EXISTING_1_04_0_90_0_84_AXIS_RADII",
    "PRIMARY_USES_NORMALIZED_0_0_70_0_714_ANCHOR_AND_LOWEST_INDEX_TIE_BREAK",
    "CANONICAL_POSITION_EXCLUDES_AMBIENT_MEMBER_OFFSETS"
  ]),

  fixtureState: Object.freeze({
    contract: ARCHCOIN_STAGE_1_MATH_FIXTURE_CONTRACT.schema,
    fixturesCreated: true,
    deterministicRunnerCreated: true,
    executionReceiptRecorded: false,
    browserVisualAcceptancePerformed: false,
    physicalDeviceAcceptancePerformed: false
  }),

  stage1ACandidateScope: Object.freeze({
    required: Object.freeze(["/products/archcoin/index.interactions.js"]),
    conditional: Object.freeze(["/products/archcoin/index.controller.js"]),
    controllerCondition: "Only if axis/frame identity or stale-revision enforcement becomes part of the accepted payload contract."
  }),

  stage1BCandidateScope: Object.freeze({
    currentOwner: "/products/archcoin/index.crystals.js",
    defaultCandidateScope: Object.freeze(["/products/archcoin/index.crystals.js"]),
    noMutationOutcomePermittedOnlyAfter: Object.freeze([
      "source-level room-index binding proof",
      "shared-quaternion proof",
      "fixture execution pass",
      "no member-specific canonical offset proof",
      "finite projection proof"
    ]),
    noMutationProofEstablished: false
  }),

  supersededUnresolvedFields: Object.freeze([
    "EXACT_FIXED_AXIS_BASIS_NOT_DEFINED",
    "EXACT_PITCH_POLICY_NOT_DEFINED",
    "EXACT_CLUSTER_SEAT_RELATION_NOT_DEFINED",
    "EXACT_RADIUS_POLICY_NOT_DEFINED",
    "EXACT_PRIMARY_ANCHOR_RELATION_NOT_DEFINED",
    "STAGE_1A_AND_1B_TEST_FIXTURES_NOT_CREATED"
  ]),

  remainingBlockers: Object.freeze([
    "MATHEMATICAL_CANDIDATE_NOT_ADMITTED",
    "FIXTURE_EXECUTION_RECEIPT_NOT_RECORDED",
    "SOURCE_LEVEL_ROOM_INDEX_BINDING_PROOF_NOT_RECORDED",
    "CRYSTALS_NO_MUTATION_PROOF_ABSENT",
    "CAMERA_RIGHT_DEPENDENCY_COMPATIBILITY_NOT_PROVEN",
    "LIVE_VISUAL_AND_PHYSICAL_DEVICE_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_MUTATION_AUTHORITY_WITHHELD"
  ]),

  classification: Object.freeze({
    exactMathematicalDefinitionComplete: true,
    mathematicalAdmissionComplete: false,
    stage1ImplementationReady: false,
    liveArchcoinMutationAuthorized: false,
    referenceModelAuthority: false,
    productionAuthority: false
  })
});
