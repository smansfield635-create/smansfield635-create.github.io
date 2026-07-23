/*
 * Universal compass compositor authority fixture receipt.
 * Candidate research evidence only. No reference-model, rebuild, or production authority.
 */

export const COMPOSITOR_AUTHORITY_FIXTURE_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_COMPOSITOR_AUTHORITY_FIXTURE_EXECUTION_RECEIPT_v1",
  status: "SOURCE_READY_EXECUTION_PENDING",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  compositorCommit: "b2f72e550749e262d7cc3d195ab55bbdf9ded6fa",
  fixtureCommit: "b6409b467cd466a1851152ecf865def4dcc091c2",
  compositorPath: "/assets/compass-model/compass.compositor.js",
  fixturePath: "/research/archcoin-compass-calibration/compositor-authority.fixtures.js",
  sourceFetchBackVerified: true,
  repositoryNativeExecutionPerformed: false,
  localRepositoryCheckoutAvailable: false,
  executionEnvironmentLimitation:
    "The active execution container could not resolve github.com and no repository-native CI runner was invoked.",
  declaredTestCount: 11,
  declaredCases: Object.freeze([
    "COMPOSITE_RECORDS_ARE_NESTED_AND_DEEPLY_IMMUTABLE",
    "CANONICAL_PRIMARY_API_IS_ABSENT",
    "ADAPTER_INPUT_IDENTITY_REVISION_AND_IMMUTABILITY",
    "ADAPTER_NODE_ID_MISMATCH_REJECTED",
    "ADAPTER_WORLD_REVISION_MISMATCH_REJECTED",
    "INVALID_PROJECTION_GEOMETRY_REJECTED",
    "DEPTH_CLASSIFICATION_USES_POSITIVE_FORWARD_DISTANCE",
    "VISUAL_RECORD_IDENTITY_AND_DUPLICATION_ENFORCED",
    "VISUAL_RECORD_CANNOT_OVERWRITE_WORLD_OR_PROJECTION",
    "ONLY_CURRENT_PROJECTION_MAY_RENDER",
    "DISPOSED_COMPOSITOR_REJECTS_OPERATIONS"
  ]),
  correctedProperties: Object.freeze({
    canonicalPrimaryAuthorityRemoved: true,
    nestedCompositeRecordsRequired: true,
    visualWorldOverwriteProhibited: true,
    projectionWorldOverwriteProhibited: true,
    adapterNodeIdentityValidated: true,
    adapterWorldRevisionValidated: true,
    positiveForwardDepthConventionEnforced: true,
    currentProjectionRenderCustodyEnforced: true,
    deepImmutabilityApplied: true
  }),
  downstreamMigration: Object.freeze({
    adaptersMigratedToStructuredProjectionInput: false,
    interactionsMigratedAwayFromCompositorPrimaryInference: false,
    neutralReferenceMigratedToNestedProjectionRecords: false
  }),
  referenceModelAuthority: false,
  liveRebuildAuthority: false,
  productionAuthority: false
});
