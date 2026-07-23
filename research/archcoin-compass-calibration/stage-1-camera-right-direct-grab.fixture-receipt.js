/*
 * ARCHCOIN Compass Calibration Workspace
 * Deterministic execution receipt for Stage 1A camera-right and direct-grab fixtures.
 * Research evidence only. No live mutation or production authority.
 */

export const ARCHCOIN_STAGE_1_CAMERA_RIGHT_DIRECT_GRAB_FIXTURE_RECEIPT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_CAMERA_RIGHT_DIRECT_GRAB_FIXTURE_RECEIPT_v1",
  status: "PASS",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  evidenceBase: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
  fixtureArtifact:
    "/research/archcoin-compass-calibration/stage-1-camera-right-direct-grab.behavioral-fixtures.js",
  executionEnvironment: "Node.js v22.16.0",
  executionMode: "DETERMINISTIC_RESEARCH_FIXTURE_EXECUTION",
  liveArchcoinMutationAuthorized: false,
  productionAuthority: false,

  summary: Object.freeze({
    testCount: 12,
    passed: 12,
    failed: 0
  }),

  results: Object.freeze([
    Object.freeze({
      test: "CAMERA_RIGHT_DEFAULT_PRESET",
      status: "PASS",
      admittedRight: Object.freeze([1, 0, 0])
    }),
    Object.freeze({
      test: "CAMERA_RIGHT_MOBILE_PRESET",
      status: "PASS",
      admittedRight: Object.freeze([1, 0, 0])
    }),
    Object.freeze({
      test: "CAMERA_RIGHT_CLUSTER_PRESET",
      status: "PASS",
      admittedRight: Object.freeze([1, 0, 0])
    }),
    Object.freeze({
      test: "CAMERA_RIGHT_DEGENERATE_FALLBACK",
      status: "PASS",
      admittedRight: Object.freeze([1, 0, 0])
    }),
    Object.freeze({
      test: "CAMERA_TRANSITION_NO_AXIS_FLIP",
      status: "PASS",
      minimumAdjacentDot: 1
    }),
    Object.freeze({
      test: "HORIZONTAL_CLUSTER_MOTION_WORLD_Y_ONLY",
      status: "PASS",
      quaternion: Object.freeze([
        0,
        0.061960286300408236,
        0,
        0.9980786156017829
      ])
    }),
    Object.freeze({
      test: "VERTICAL_CLUSTER_MOTION_CAMERA_RIGHT_ONLY",
      status: "PASS",
      quaternion: Object.freeze([
        0.061960286300408236,
        0,
        0,
        0.9980786156017829
      ])
    }),
    Object.freeze({
      test: "MOVEMENT_AND_DIRECT_GRAB_OUTPUT_NORMALIZED",
      status: "PASS",
      quaternionLengthTolerance: 1e-9
    }),
    Object.freeze({
      test: "DIRECT_GRAB_HORIZONTAL_CORRECTION_WORLD_Y_ONLY",
      status: "PASS",
      quaternion: Object.freeze([
        0,
        0.026246985455424855,
        0,
        0.999655488533176
      ])
    }),
    Object.freeze({
      test: "POST_COMPOSITION_CUMULATIVE_PITCH_CLAMP",
      status: "PASS",
      measuredPitch: 1.005309649148734,
      admittedLimit: 1.0053096491487339
    }),
    Object.freeze({
      test: "REDUCED_MOTION_REMAINS_FUNCTIONAL_AND_SCALED",
      status: "PASS",
      normalAngle: 0.12764905202989177,
      reducedAngle: 0.09191253303845306
    }),
    Object.freeze({
      test: "CANCEL_RESTORES_EXACT_GESTURE_ORIGIN",
      status: "PASS"
    })
  ]),

  supersededBlockers: Object.freeze([
    "CAMERA_RIGHT_AND_DIRECT_GRAB_BEHAVIORAL_FIXTURES_NOT_EXECUTED"
  ]),

  remainingBlockers: Object.freeze([
    "MATHEMATICAL_CANDIDATE_NOT_ADMITTED",
    "FIXED_AXIS_INTERACTION_SOURCE_CHANGE_NOT_CONSTRUCTED",
    "LIVE_MOUSE_TOUCH_PEN_DIRECTION_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_VISUAL_AND_PHYSICAL_DEVICE_ACCEPTANCE_NOT_PERFORMED",
    "LIVE_MUTATION_AUTHORITY_WITHHELD"
  ]),

  classification: Object.freeze({
    cameraRightBehavioralFixturesExecuted: true,
    directGrabBehavioralFixturesExecuted: true,
    deterministicFixturePass: true,
    liveBehavioralAcceptance: false,
    mathematicalAdmissionComplete: false,
    stage1ImplementationReady: false,
    liveMutationAuthorized: false,
    productionAuthority: false
  })
});
