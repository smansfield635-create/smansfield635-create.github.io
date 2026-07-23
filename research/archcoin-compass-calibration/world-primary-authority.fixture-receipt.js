/*
 * Universal Compass world-primary authority fixture receipt.
 * Deterministic research evidence only. No reference-model or production authority.
 */

export const UNIVERSAL_WORLD_PRIMARY_AUTHORITY_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_WORLD_PRIMARY_AUTHORITY_FIXTURE_RECEIPT_v1",
  status: "PASS",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  fixtureArtifact:
    "/research/archcoin-compass-calibration/world-primary-authority.fixtures.js",
  targetArtifact:
    "/assets/compass-model/compass.world.js",
  executionEnvironment: "Node.js v22.16.0",
  executionMode: "DETERMINISTIC_RESEARCH_FIXTURE_EXECUTION",
  summary: Object.freeze({
    testCount: 9,
    passed: 9,
    failed: 0
  }),
  passedCases: Object.freeze([
    "IDENTITY_PRIMARY_IS_WORLD_ANCHOR_ALIGNED",
    "ROTATED_PRIMARY_USES_PROPOSED_QUATERNION",
    "PRIMARY_TIE_BREAK_USES_LOWEST_STABLE_INDEX",
    "PROPOSAL_EVALUATION_DOES_NOT_INCREMENT_WORLD_REVISION",
    "WORLD_SNAPSHOT_MATCHES_PROPOSAL_PRIMARY",
    "PROPOSAL_RECORDS_ARE_DEEPLY_IMMUTABLE",
    "HELD_PRESENTATION_REJECTED",
    "UNKNOWN_PROPOSAL_FIELD_REJECTED",
    "DISPOSED_WORLD_REJECTS_EVALUATION"
  ]),
  established: Object.freeze({
    canonicalPrimaryOwner: "WORLD",
    orientationProposalEvaluationAvailable: true,
    proposalPrimaryUsesWorldAnchor: true,
    proposalPrimaryUsesProposedQuaternion: true,
    primaryTieBreakDeterministic: true,
    proposalEvaluationMutatesWorldRevision: false,
    snapshotAndProposalPrimaryAgreement: true,
    proposalRecordsDeeplyImmutable: true,
    heldPresentationAdmittedAsWorldTruth: false
  }),
  migrationState: Object.freeze({
    controllerConsumesWorldProposalEvaluation: false,
    interactionsConsumeWorldProposalEvaluation: false,
    compositorPrimaryInferenceRemoved: false,
    downstreamMigrationComplete: false
  }),
  referenceModelAuthority: false,
  liveRebuildAuthority: false,
  productionAuthority: false
});
