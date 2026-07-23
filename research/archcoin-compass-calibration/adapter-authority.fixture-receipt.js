/*
 * Bounded execution-status receipt for the universal Compass adapter authority.
 * Fixture source is committed. Repository-native execution is not claimed.
 */

export const ADAPTER_AUTHORITY_FIXTURE_EXECUTION_RECEIPT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_ADAPTER_AUTHORITY_FIXTURE_EXECUTION_RECEIPT_v1",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  target: "/assets/compass-model/compass.adapters.js",
  fixtureSource:
    "/research/archcoin-compass-calibration/adapter-authority.fixtures.js",
  committedFixtureSourcePresent: true,
  sourceFetchBackVerified: false,
  declaredCaseCount: 12,
  repositoryNativeFixtureExecution: false,
  localNetworkedCheckoutAvailable: false,
  status: "SOURCE_READY_EXECUTION_PENDING",
  coveredContracts: Object.freeze([
    "TYPED_PROJECTION_INPUT_AND_OUTPUT",
    "PROJECTION_INPUT_DEEP_IMMUTABILITY",
    "PROJECTOR_NODE_IDENTITY_PRESERVATION",
    "PROJECTOR_WORLD_REVISION_PRESERVATION",
    "ADMITTED_ROUTE_OBJECT_ENFORCEMENT",
    "DECLARED_NAVIGATION_SIDE_EFFECT",
    "EXTERNAL_NAVIGATION_ROLLBACK_REQUIREMENT",
    "LOCAL_NAVIGATION_REVERSIBILITY",
    "RENDER_SNAPSHOT_PRESERVATION",
    "SEMANTIC_SNAPSHOT_PRESERVATION",
    "RESOURCE_DISPOSAL_REQUIREMENT",
    "IDEMPOTENT_DISPOSAL_AND_POST_DISPOSAL_LOCKOUT"
  ]),
  adapterAuthorityCorrected: true,
  downstreamCompositorCompatibilityTargeted: true,
  neutralReferenceMigrated: false,
  repositoryMutationBeyondDeclaredFiles: false,
  sourceCompassMutation: false,
  referenceModelAuthority: false,
  liveRebuildAuthority: false,
  productionAuthority: false
});
