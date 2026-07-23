/*
 * Universal Compass controller state-model fixture receipt.
 * Candidate research evidence only. No live rebuild or production authority.
 */

export const CONTROLLER_STATE_MODEL_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_CONTROLLER_STATE_MODEL_FIXTURE_RECEIPT_v1",
  status: "PASS",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  fixtureArtifact:
    "/research/archcoin-compass-calibration/controller-state-model.fixtures.js",
  executionEnvironment: "Node.js v22.16.0",
  executionMode: "DETERMINISTIC_RESEARCH_FIXTURE_EXECUTION",
  summary: Object.freeze({
    testCount: 10,
    passed: 10,
    failed: 0
  }),
  passedCases: Object.freeze([
    "HELD_PRESERVES_PRESENTATION_ORIENTATION_SELECTION",
    "HELD_BLOCKS_GESTURE_AND_PRESENTATION",
    "LEAVE_HELD_RESTORES_FUNCTION",
    "HELD_PRESENTATION_REJECTED",
    "MATCHING_PREVIEW_ACCEPTED",
    "CROSS_PRESENTATION_PRIMARY_REJECTED",
    "STALE_WORLD_BASIS_REJECTED",
    "UNKNOWN_PREVIEW_FIELD_REJECTED",
    "CANCEL_RESTORES_ORIGIN",
    "HOLD_DURING_ACTIVE_GESTURE_REJECTED"
  ]),
  correctedContracts: Object.freeze({
    heldModel: "CONTROLLER_BOOLEAN_OVERLAY",
    heldChangesPresentation: false,
    previewPresentationBounded: true,
    previewPayloadExact: Object.freeze([
      "quaternion",
      "primaryId",
      "worldBasisRevision"
    ]),
    staleWorldBasisRejected: true,
    heldPresentationAdmissible: false
  }),
  downstreamMigration: Object.freeze({
    interactionsPassesWorldBasisRevision: false,
    neutralReferenceSuppliesWorldAuthorityToController: false,
    compositorPrimaryInferenceRemoved: false
  }),
  referenceModelAuthority: false,
  liveRebuildAuthority: false,
  productionAuthority: false
});
