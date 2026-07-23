/*
 * ARCHCOIN Cross-Compass Calibration Chamber
 * Stage 1A explicit mathematical admission review.
 * Admission is bounded to candidate source construction only.
 * No live mutation, merge, deployment, production, or visual acceptance authority.
 */

import {
  ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT
} from "./stage-1a-fixed-axis-math.contract.js";

import {
  ARCHCOIN_STAGE_1_MATHEMATICAL_DEFINITION_CHECKPOINT
} from "./stage-1-mathematical-definition-checkpoint.js";

import {
  ARCHCOIN_STAGE_1_MATH_FIXTURE_EXECUTION_RECEIPT
} from "./stage-1-math-fixture-execution.receipt.js";

import {
  ARCHCOIN_STAGE_1_SOURCE_BINDING_PROOF
} from "./stage-1-source-binding-proof.js";

import {
  ARCHCOIN_STAGE_1_CAMERA_RIGHT_DEPENDENCY_AUDIT
} from "./stage-1-camera-right-dependency-audit.js";

import {
  ARCHCOIN_STAGE_1_DIRECT_GRAB_COMPATIBILITY_AUDIT
} from "./stage-1-direct-grab-compatibility-audit.js";

import {
  ARCHCOIN_STAGE_1_CAMERA_RIGHT_DIRECT_GRAB_FIXTURE_RECEIPT
} from "./stage-1-camera-right-direct-grab.fixture-receipt.js";

export const ARCHCOIN_STAGE_1A_MATHEMATICAL_ADMISSION_REVIEW = Object.freeze({
  schema: "ARCHCOIN_STAGE_1A_MATHEMATICAL_ADMISSION_REVIEW_v1",
  status: "ADMITTED_FOR_COMPLETE_CANDIDATE_SOURCE_CONSTRUCTION_ONLY",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",

  reviewTarget: Object.freeze({
    stage: "STAGE_1A_FIXED_AXIS_GESTURE_BASIS",
    targetSource: "/products/archcoin/index.interactions.js",
    targetBaselineBlob: "c425ece001586db09aeb7353bfde2ab8177db7c3",
    mathematicalContract: ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT.schema,
    proposalPayloadSchemaChanged: false
  }),

  evidenceReviewed: Object.freeze([
    ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT.schema,
    ARCHCOIN_STAGE_1_MATHEMATICAL_DEFINITION_CHECKPOINT.schema,
    ARCHCOIN_STAGE_1_MATH_FIXTURE_EXECUTION_RECEIPT.schema,
    ARCHCOIN_STAGE_1_SOURCE_BINDING_PROOF.schema,
    ARCHCOIN_STAGE_1_CAMERA_RIGHT_DEPENDENCY_AUDIT.schema,
    ARCHCOIN_STAGE_1_DIRECT_GRAB_COMPATIBILITY_AUDIT.schema,
    ARCHCOIN_STAGE_1_CAMERA_RIGHT_DIRECT_GRAB_FIXTURE_RECEIPT.schema
  ]),

  admissionChecks: Object.freeze([
    Object.freeze({
      id: "A01_EXACT_MATHEMATICAL_DEFINITION",
      result: "PASS",
      basis: "World-Y yaw, camera-right-XZ pitch, fixed composition order, no roll, and bounded cumulative pitch are exactly defined."
    }),
    Object.freeze({
      id: "A02_NORMALIZED_TRANSACTION_COMPATIBILITY",
      result: "PASS",
      basis: "The admitted builder produces complete normalized XYZW quaternions and preserves the existing { quaternion, primaryId } preview payload."
    }),
    Object.freeze({
      id: "A03_CAMERA_RIGHT_SOURCE_COMPATIBILITY",
      result: "PASS",
      basis: "DGB_ARCHCOIN_COMPOSITOR.getCamera() already exposes finite eye and target facts; no compositor schema or source mutation is required."
    }),
    Object.freeze({
      id: "A04_DIRECT_GRAB_COMPATIBILITY",
      result: "PASS",
      basis: "Movement and direct-grab correction can share one fixed-basis increment builder, with the cumulative pitch clamp applied after both increments."
    }),
    Object.freeze({
      id: "A05_BASELINE_CLUSTER_GEOMETRY_COMPATIBILITY",
      result: "PASS",
      basis: "The restored crystals use one shared effective quaternion for four deterministic room seats; crystals remain verify-only in Stage 1A."
    }),
    Object.freeze({
      id: "A06_DETERMINISTIC_FIXTURE_EXECUTION",
      result: "PASS",
      basis: "Nine base mathematical checks and twelve camera-right/direct-grab behavioral checks passed with zero failures."
    }),
    Object.freeze({
      id: "A07_BASELINE_BEHAVIOR_PRESERVATION",
      result: "PASS_WITH_CONSTRUCTION_GATES",
      basis: "Orbit mapping, target custody, pointer smoothing, direct-grab offsets, return-swipe classification, cancellation, and controller authority remain preservation requirements for the candidate replacement."
    }),
    Object.freeze({
      id: "A08_LIVE_ACCEPTANCE",
      result: "NOT_PERFORMED",
      basis: "Mouse, touch, pen, visual, accessibility, and physical-device acceptance remain post-construction gates."
    })
  ]),

  admittedMathematicalContract: Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "COMPLETE_NORMALIZED_UNIT_QUATERNION_XYZW",
    horizontalAxis: Object.freeze([0, 1, 0]),
    horizontalSign: "POSITIVE_SCREEN_DX_PRODUCES_POSITIVE_WORLD_Y_YAW",
    verticalAxis: "NORMALIZED_CAMERA_RIGHT_PROJECTED_TO_WORLD_XZ_WITH_POSITIVE_X_FALLBACK",
    verticalSign: "POSITIVE_SCREEN_DY_PRODUCES_POSITIVE_PITCH_ABOUT_ADMITTED_CAMERA_RIGHT",
    compositionOrder: "PITCH_DELTA_TIMES_YAW_DELTA_TIMES_CURRENT_ORIENTATION",
    cumulativePitchLimitRadians: Math.PI * 0.32,
    roll: "PROHIBITED",
    orbitMapping: "UNCHANGED",
    clusterGeometry: "UNCHANGED_VERIFY_ONLY",
    directGrabCorrection: "SAME_FIXED_BASIS_BUILDER_THEN_POST_COMPOSITION_PITCH_CLAMP"
  }),

  preservedNumericalParameters: Object.freeze({
    clusterRadiansPerPixel: 0.0062,
    grabbedCorrectionRadiansPerPixel: 0.0021,
    maximumIncrementalAngle: 0.18,
    maximumGrabCorrectionAngle: 0.085,
    reducedMotionMultiplier: 0.72,
    maximumEffectiveDeltaPx: 34,
    pointerSmoothingAlphaMouse: 0.58,
    pointerSmoothingAlphaTouch: 0.42,
    pointerSmoothingAlphaPen: 0.50,
    targetSwitchMinimumMargin: 0.12,
    targetSwitchMinimumPersistenceMs: 90,
    targetSwitchMinimumFrames: 3,
    targetSwitchCooldownMs: 120
  }),

  authorizedCandidateScope: Object.freeze({
    branchRequirement: "SEPARATE_LIVE_CALIBRATION_BRANCH_FROM_CURRENT_MAIN_BASE",
    requiredReplacement: Object.freeze([
      "/products/archcoin/index.interactions.js"
    ]),
    verifyOnly: Object.freeze([
      "/products/archcoin/index.controller.js",
      "/products/archcoin/index.crystals.js",
      "/products/archcoin/index.compositor.js",
      "/products/archcoin/index.html",
      "/products/archcoin/index.css"
    ]),
    prohibitedAdditions: Object.freeze([
      "/products/archcoin/index.planet.js",
      "PROPOSAL_SCHEMA_EXPANSION",
      "CONTROLLER_AUTHORITY_CHANGE",
      "CRYSTAL_GEOMETRY_CHANGE",
      "COMPOSITOR_CAMERA_OR_PROJECTION_CHANGE",
      "RETURN_SWIPE_RECALIBRATION",
      "AMBIENT_DAMPING_CHANGE",
      "LABEL_POLICY_CHANGE",
      "CENTER_GLOBE_CHANGE"
    ])
  }),

  constructionAcceptanceGates: Object.freeze([
    "COMPLETE_FULL_FILE_REPLACEMENT_BODY",
    "TARGET_BASELINE_BLOB_IDENTITY_CONFIRMED",
    "STATIC_SYNTAX_PASS",
    "EXISTING_PUBLIC_SURFACE_PRESERVED",
    "ONLY_CLUSTER_INCREMENT_PATH_RENEWED",
    "ORBIT_PATH_BYTE_OR_SEMANTIC_EQUIVALENCE_PROVEN",
    "DIRECT_GRAB_USES_FIXED_BASIS_BUILDER",
    "PITCH_CLAMP_OCCURS_AFTER_MOVEMENT_AND_CORRECTION",
    "CONTROLLER_PREVIEW_PAYLOAD_REMAINS_QUATERNION_AND_PRIMARY_ID",
    "RESEARCH_FIXTURES_REEXECUTED_AGAINST_CANDIDATE",
    "SOURCE_DIFF_REVIEW_PASS",
    "NO_LIVE_PRODUCT_WRITE_BEFORE_CANDIDATE_AUDIT"
  ]),

  remainingAfterAdmission: Object.freeze([
    "FIXED_AXIS_INTERACTION_SOURCE_CHANGE_NOT_CONSTRUCTED",
    "CANDIDATE_SOURCE_STATIC_AND_BEHAVIORAL_AUDIT_NOT_PERFORMED",
    "LIVE_MOUSE_TOUCH_PEN_DIRECTION_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_VISUAL_AND_PHYSICAL_DEVICE_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_MUTATION_AUTHORITY_WITHHELD"
  ]),

  boundedAuthority: Object.freeze({
    mathematicalCandidateAdmitted: true,
    candidateSourceConstructionAuthorized: true,
    researchWorkspaceOnly: true,
    liveProductMutationAuthorized: false,
    branchMergeAuthorized: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    universalStandardAdmitted: false,
    referenceModelAuthorityEstablished: false
  })
});