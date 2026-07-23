import {
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";
import {
  UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
} from "./universal-compass-four-source-capability-map.v3.js";

const REPOSITORY =
  "smansfield635-create/smansfield635-create.github.io";
const ACTIVE_BRANCH =
  "agent/archcoin-compass-calibration-workspace-001";
const SHELL_COPY_COMMIT =
  "febf7ac9ca0bd69c791b70d3f914bbfff5403c1d";
const HISTORICAL_SUPPORT_COMMIT =
  "495a62a74076ff12a68de270ae3249e8595f286d";

export const UNIVERSAL_COMPASS_LOCKED_TARGET_PROFILE = deepFreeze({
  profileId: "UNIVERSAL_COMPASS_NEUTRAL_CALIBRATION_TARGET_v1",
  packageDirectory: "/prototypes/universal-compass/",
  moduleNamespace: "DGB_UNIVERSAL_COMPASS",
  contractIdentity:
    "DGB_UNIVERSAL_COMPASS_SEVEN_FILE_PROTOTYPE_CONTRACT_v1",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  centerReferenceFrameCount: 1,
  cardinalStarCount: 4,
  clusterCount: 4,
  childStarCount: 16,
  childStarsPerCluster: 4,
  cardinalIds: deepFreeze(["NORTH", "EAST", "SOUTH", "WEST"]),
  childLabels: "NEUTRAL_PLACEHOLDERS",
  localSelection: true,
  localFocus: true,
  localClusterOpen: true,
  localClusterClose: true,
  localClusterRotation: true,
  constellationRotation: true,
  cardinalDirectManipulation: true,
  clusterReturnGesture: true,
  routes: false,
  destinations: false,
  navigationExecution: false,
  locationChange: false,
  financialSemantics: false,
  productAuthority: false,
  sourceCardinalityEvidenceRole:
    "COMPARATIVE_EVIDENCE_ONLY_NOT_RUNTIME_TOPOLOGY_AUTHORITY"
});

export const UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_RECORDS = deepFreeze([
  {
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    sourcePath: "/assets/compass-model/compass.world.js",
    sourceBlob: "0d462361776288b88584a7272c8e42ea6b14f1fa",
    destinationPath: "/prototypes/universal-compass/index.planet.js",
    destinationBlob: "0d462361776288b88584a7272c8e42ea6b14f1fa",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING",
    primaryResponsibilities: deepFreeze([
      "CENTER_REFERENCE_FRAME",
      "FOUR_CARDINAL_IDENTITIES",
      "FOUR_CLUSTER_MEMBERSHIPS",
      "SIXTEEN_CHILD_IDENTITIES",
      "WORLD_POSITION_ORIENTATION_SCALE",
      "IMMUTABLE_WORLD_SNAPSHOTS",
      "WORLD_REVISIONS_AND_HASHES"
    ]),
    requiredInternalizations: deepFreeze([
      "CONTRACT_ASSERTION_AND_WORLD_SCHEMA_MECHANISMS",
      "VECTOR_AND_QUATERNION_WORLD_MATH",
      "NODE_IDENTITY_AND_MEMBERSHIP_REGISTRY",
      "LOCKED_NEUTRAL_PROFILE_FACTS"
    ]),
    residueToRemove: deepFreeze([
      "ROUTE_KEYS",
      "PRODUCT_DOMAINS",
      "DESTINATION_FACTS",
      "NAVIGATION_FACTS"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_CRYSTALS",
    sourcePath: "/assets/compass-model/compass.geometry.js",
    sourceBlob: "0bdf6bd08732d72935192dc211014cf7ec84dc15",
    destinationPath: "/prototypes/universal-compass/index.crystals.js",
    destinationBlob: "0bdf6bd08732d72935192dc211014cf7ec84dc15",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING",
    primaryResponsibilities: deepFreeze([
      "MESH_TOPOLOGY",
      "LOCAL_BOUNDS",
      "VISUAL_SCALE",
      "VISUAL_SEMANTIC_AND_LABEL_ANCHORS",
      "LOCAL_SPHERE_AND_AABB_HIT_SHAPES",
      "IMMUTABLE_VISUAL_RECORDS",
      "COMPOSITOR_INPUT_PUBLICATION",
      "DETERMINISTIC_HASHES_AND_RECEIPTS"
    ]),
    requiredInternalizations: deepFreeze([
      "CONTRACT_ASSERTION_AND_VISUAL_SCHEMA_MECHANISMS",
      "GEOMETRY_MATH"
    ]),
    residueToRemove: deepFreeze([
      "IDENTITY_OWNERSHIP",
      "MEMBERSHIP_OWNERSHIP",
      "WORLD_TRANSFORM_OWNERSHIP",
      "CAMERA_OR_PROJECTION_OWNERSHIP",
      "RENDERER_LIFECYCLE_OWNERSHIP",
      "PRODUCT_SEMANTICS"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_COMPOSITOR",
    sourcePath: "/assets/compass-model/compass.compositor.js",
    sourceBlob: "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
    destinationPath: "/prototypes/universal-compass/index.compositor.js",
    destinationBlob: "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "NEXT_UNFINISHED_FUNCTIONAL_ROLE",
    primaryResponsibilities: deepFreeze([
      "CAMERA_PROFILE_AND_INTERPOLATION",
      "VIEW_AND_PROJECTION_MATRICES",
      "WORLD_TO_SCREEN_PROJECTION",
      "PROJECTED_SPHERE_AND_AABB_RADIUS",
      "VISIBILITY_AND_DEPTH_HYSTERESIS",
      "FRONT_REAR_CLASSIFICATION",
      "OVERLAP_FACTS",
      "DETERMINISTIC_PROJECTION_ORDER",
      "HIDDEN_RECORDS_AND_ONE_FRAME_TOMBSTONES",
      "IMMUTABLE_PROJECTION_SNAPSHOTS",
      "PROJECTION_REVISIONS_AND_RECEIPTS"
    ]),
    requiredInternalizations: deepFreeze([
      "CONTRACT_PROJECTION_AND_CAMERA_SCHEMAS",
      "CAMERA_AND_PROJECTION_MATH",
      "ADMISSIBLE_PROJECT_WORLD_POINT_MECHANISMS"
    ]),
    residueToRemove: deepFreeze([
      "ADAPTER_OWNED_RENDERING",
      "RENDERER_CALLBACKS",
      "CONTROLLER_DISCOVERY_OR_WRITES",
      "DOM_OWNERSHIP",
      "CANVAS_OWNERSHIP",
      "POINTER_DECISIONS",
      "PRODUCT_ASSUMPTIONS"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    sourcePath: "/assets/compass-model/compass.controller.js",
    sourceBlob: "7eae298304d53c711adc1714fbc44dcd94f6b065",
    destinationPath: "/prototypes/universal-compass/index.controller.js",
    destinationBlob: "7eae298304d53c711adc1714fbc44dcd94f6b065",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING_CORE_INTERFACE_ALIGNMENT",
    primaryResponsibilities: deepFreeze([
      "CONSTELLATION_AND_CLUSTER_STATE",
      "ACTIVE_CARDINAL_IDENTITY",
      "LOCALLY_SELECTED_CHILD_IDENTITY",
      "GESTURE_BEGIN_PREVIEW_COMMIT_CANCEL",
      "STATE_REVISIONS_AND_STALE_OPERATION_REJECTION",
      "HELD_STATE",
      "REDUCED_MOTION_STATE",
      "IMMUTABLE_STATE_PUBLICATION"
    ]),
    requiredInternalizations: deepFreeze([
      "CONTROLLER_CONTRACT_ENUMS_AND_ASSERTIONS",
      "QUATERNION_NORMALIZATION"
    ]),
    residueToRemove: deepFreeze([
      "PRODUCT_TRANSACTION_PHASES",
      "ROUTE_COMMITMENT",
      "NAVIGATION_AUTHORIZATION",
      "NAVIGATION_EXECUTION",
      "ROUTE_REGISTRY",
      "DESTINATION_TYPES",
      "FINANCIAL_SEMANTICS"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_INTERACTIONS",
    sourcePath: "/assets/compass-model/compass.interactions.js",
    sourceBlob: "cf06c107a23115a809826b949e306e5c810e60f0",
    destinationPath: "/prototypes/universal-compass/index.interactions.js",
    destinationBlob: "cf06c107a23115a809826b949e306e5c810e60f0",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING_AFTER_CORE_COMPATIBILITY",
    primaryResponsibilities: deepFreeze([
      "MOUSE_TOUCH_AND_PEN_PARITY",
      "POINTER_CAPTURE_RELEASE_AND_CANCELLATION",
      "BLUR_AND_VISIBILITY_INTERRUPTION",
      "TAP_DRAG_ARBITRATION",
      "CANDIDATE_SCORING_AND_STABLE_TARGET_LOCKING",
      "CONFIDENCE_MARGIN_AND_PERSISTENCE_GATED_SWITCHING",
      "INTERACTION_HYSTERESIS",
      "CONSTELLATION_AND_CLUSTER_ROTATION",
      "CARDINAL_DIRECT_MANIPULATION",
      "CLUSTER_RETURN_GESTURE",
      "QUATERNION_AND_LOCAL_SELECTION_PROPOSALS"
    ]),
    requiredInternalizations: deepFreeze([
      "POINTER_CONTRACT_ENUMS_AND_ASSERTIONS",
      "CAMERA_BASIS_AND_FIXED_BASIS_MATH"
    ]),
    residueToRemove: deepFreeze([
      "ACCEPTED_STATE_OWNERSHIP",
      "WORLD_TRUTH_OWNERSHIP",
      "PROJECTION_OWNERSHIP",
      "RENDERING_OWNERSHIP",
      "NAVIGATION"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_HTML",
    sourcePath:
      "/research/archcoin-compass-calibration/neutral-reference-compass/index.html",
    sourceBlob: "cd1abe75ba93e5733514ad378f52223ec53805b2",
    destinationPath: "/prototypes/universal-compass/index.html",
    destinationBlob: "cd1abe75ba93e5733514ad378f52223ec53805b2",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING_RUNTIME_MOUNT_AND_LOADING_REPAIR",
    primaryResponsibilities: deepFreeze([
      "NEUTRAL_SEMANTIC_CONTROLS",
      "FOUR_CARDINAL_CONTROLS",
      "FOUR_CLUSTER_STRUCTURES",
      "SIXTEEN_CHILD_CONTROLS",
      "ACCESSIBLE_LOCAL_OPEN_CLOSE",
      "RUNTIME_MOUNTS",
      "STATUS_AND_RECEIPT_OUTPUTS"
    ]),
    requiredInternalizations: deepFreeze([
      "ADMISSIBLE_NEUTRAL_REFERENCE_RUNTIME_MOUNT_SEQUENCE"
    ]),
    residueToRemove: deepFreeze([
      "ROUTE_LANGUAGE",
      "NAVIGATION_LANGUAGE",
      "PRODUCT_CHAMBER_LANGUAGE",
      "FINANCIAL_MEANINGS",
      "PRODUCT_DESTINATIONS",
      "EXTERNAL_OLD_PACKAGE_LOADING"
    ])
  },
  {
    destinationOwner: "UNIVERSAL_COMPASS_CSS",
    sourcePath:
      "/research/archcoin-compass-calibration/neutral-reference-compass/index.css",
    sourceBlob: "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa",
    destinationPath: "/prototypes/universal-compass/index.css",
    destinationBlob: "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa",
    transferStatus: "EXACT_SHELL_COPY_COMPLETE",
    compatibilityStatus: "PENDING_PRESENTATION_EXPANSION",
    primaryResponsibilities: deepFreeze([
      "NEUTRAL_VISUAL_PRESENTATION",
      "RESPONSIVE_LAYOUT",
      "FOCUS_AND_SELECTED_STATES",
      "HELD_AND_DISABLED_STATES",
      "FRONT_REAR_VISUAL_EXPRESSION",
      "REDUCED_MOTION_PRESENTATION"
    ]),
    requiredInternalizations: deepFreeze([]),
    residueToRemove: deepFreeze([
      "AUTHORITY_INFERENCE_FROM_CLASSES_OR_ATTRIBUTES"
    ])
  }
]);

export const UNIVERSAL_COMPASS_SUPPORT_MECHANISM_RECORDS = deepFreeze([
  {
    supportId: "COMPASS_CONTRACTS",
    historicalPath: "/assets/compass-model/compass.contracts.js",
    historicalCommit: HISTORICAL_SUPPORT_COMMIT,
    recoveredBlob: "946e7d9df63546e17104a0a8c849d8a58dbf91ce",
    recoveryStatus: "EXACT_HISTORICAL_BYTES_RECOVERED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "DISTRIBUTE_ADMISSIBLE_ASSERTIONS_ENUMS_SCHEMAS_AND_VALIDATORS_ACROSS_SEVEN_FILES",
    prohibitedResidue: deepFreeze([
      "ROUTE_KEY_FIELDS",
      "TRANSACTION_ROUTE_COMMIT_PHASE",
      "ADAPTER_RUNTIME_AUTHORITY",
      "PRODUCT_OR_NAVIGATION_AUTHORITY"
    ])
  },
  {
    supportId: "COMPASS_ADAPTERS",
    historicalPath: "/assets/compass-model/compass.adapters.js",
    historicalCommit: HISTORICAL_SUPPORT_COMMIT,
    recoveredBlob: "7291ff640e55c81671d2581da19599e7cb94bbbe",
    recoveryStatus: "EXACT_HISTORICAL_BYTES_RECOVERED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "INTERNALIZE_ONLY_PROJECTION_INPUT_VALIDATION_IMMUTABILITY_AND_REVERSIBLE_LOCAL_BOUNDARY_MECHANISMS_WHERE_REQUIRED",
    prohibitedResidue: deepFreeze([
      "ROUTE_MAP",
      "NAVIGATE_ADAPTER",
      "LOCATION_FRAGMENT",
      "HISTORY_PUSH",
      "LOCATION_ASSIGN",
      "EXTERNAL_NAVIGATION",
      "ADAPTER_OWNED_RENDERING",
      "EIGHTH_RUNTIME_FILE"
    ])
  },
  {
    supportId: "COMPASS_MATH",
    currentPath: "/assets/compass-model/compass.math.js",
    currentBlob: "0f1aca8d8bcd9f7a471cadec8bb569109ec8c557",
    recoveryStatus: "CURRENT_SOURCE_BYTES_VERIFIED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "DISTRIBUTE_VECTOR_QUATERNION_CAMERA_AND_FIXED_BASIS_MATH_TO_OWNING_RUNTIME_FILES"
  },
  {
    supportId: "COMPASS_NODES",
    currentPath: "/assets/compass-model/compass.nodes.js",
    currentBlob: "7322ca21fc585fe233ec3156258a6e2a75d23c7b",
    recoveryStatus: "CURRENT_SOURCE_BYTES_VERIFIED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "INTERNALIZE_NEUTRAL_IDENTITY_AND_MEMBERSHIP_MECHANISMS_IN_INDEX_PLANET"
  },
  {
    supportId: "COMPASS_PROFILES",
    currentPath: "/assets/compass-model/compass.profiles.js",
    currentBlob: "692d333b1516ae3094bd052c61e818ad3b1b6bb7",
    recoveryStatus: "CURRENT_SOURCE_BYTES_VERIFIED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "DISTRIBUTE_LOCKED_WORLD_CAMERA_POINTER_AND_REDUCED_MOTION_FACTS_TO_OWNING_FILES"
  },
  {
    supportId: "COMPASS_VALIDATION",
    currentPath: "/assets/compass-model/compass.validation.js",
    currentBlob: "5da559dc27605ffb89d0a41c37ff41f0d4cda5cb",
    recoveryStatus: "CURRENT_SOURCE_BYTES_VERIFIED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "RETAIN_AS_RESEARCH_VALIDATION_EVIDENCE_AND_INTERNALIZE_ONLY_REQUIRED_RUNTIME_RECEIPT_CHECKS"
  },
  {
    supportId: "NEUTRAL_REFERENCE_RUNTIME",
    currentPath:
      "/research/archcoin-compass-calibration/neutral-reference-compass/index.js",
    currentBlob: "d475cd1c427f6e83a29f44f40b57df4a49cd21c4",
    recoveryStatus: "CURRENT_SOURCE_BYTES_VERIFIED",
    destinationRuntimeFileAdmitted: false,
    disposition:
      "DISTRIBUTE_ADMISSIBLE_BOOTSTRAP_POINTER_AND_LOCAL_SELECTION_MECHANISMS_ACROSS_HTML_AND_FIVE_RUNTIME_AUTHORITIES"
  }
]);

const MAP_V4_BODY = {
  artifactId: "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_PASS_1_v4",
  schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v4",
  mode: "READ_ONLY_SOURCE_TO_SEVEN_FILE_TRANSITION_SUPPORT",
  supersedesArtifactId:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.artifactId,
  supersessionScope:
    "ADD_EXACT_SEVEN_FILE_TRANSITION_SUPPORT_RECOVERY_AND_EXPLICIT_NEUTRAL_TARGET_PROFILE",
  repositoryIdentity: REPOSITORY,
  branchIdentity: ACTIVE_BRANCH,
  inspectedShellCopyCommit: SHELL_COPY_COMMIT,
  previousMapDigest:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.deterministicDigest,
  sourceFamilies:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.sourceFamilies,
  sourceRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.sourceRecords,
  destinationRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.destinationRecords,
  capabilityMatrix:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.capabilityMatrix,
  knownConflictAndBoundaryRecords:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3
      .knownConflictAndBoundaryRecords,
  sourceMembershipCensus:
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V3.membershipCensus,
  sourceMembershipCensusRole:
    "COMPARATIVE_SOURCE_EVIDENCE_NOT_A_BLOCKING_RUNTIME_TOPOLOGY_AUTHORITY",
  lockedTargetProfile: UNIVERSAL_COMPASS_LOCKED_TARGET_PROFILE,
  sevenFileTransitionRecords:
    UNIVERSAL_COMPASS_SEVEN_FILE_TRANSITION_RECORDS,
  supportMechanismRecords:
    UNIVERSAL_COMPASS_SUPPORT_MECHANISM_RECORDS,
  currentTransitionStatus: deepFreeze({
    exactShellCopyComplete: true,
    exactDestinationBlobIdentityVerified: true,
    sourceFilesDeleted: false,
    compatibilityEditsApplied: false,
    importRepairComplete: false,
    supportCodeInternalized: false,
    htmlLoadingOrderRepaired: false,
    runtimeExecutable: false,
    prototypeAccepted: false,
    productCalibrationAuthorized: false
  }),
  coreCompatibilityHandoff: deepFreeze({
    activePackage: "/prototypes/universal-compass/",
    nextUnfinishedFunctionalRole:
      "/prototypes/universal-compass/index.compositor.js",
    coordinatedInterfaceFiles: deepFreeze([
      "/prototypes/universal-compass/index.planet.js",
      "/prototypes/universal-compass/index.crystals.js",
      "/prototypes/universal-compass/index.controller.js"
    ]),
    requiredDataFlow: deepFreeze([
      "PLANET_PUBLISHES_IMMUTABLE_WORLD_SNAPSHOT",
      "CRYSTALS_CONSUMES_WORLD_AND_PUBLISHES_VISUAL_RECORDS",
      "CONTROLLER_PUBLISHES_IMMUTABLE_LOCAL_PRESENTATION_CONTEXT",
      "COMPOSITOR_CONSUMES_WORLD_VISUAL_AND_PRESENTATION_CONTEXT",
      "COMPOSITOR_PUBLISHES_IMMUTABLE_PROJECTION_AND_INTERACTION_RECORDS"
    ]),
    supportRecoveryComplete: true,
    sourceExtractionRepeatRequired: false,
    blankFileReconstructionRequired: false,
    projectAwarenessRuntimeImportPermitted: false,
    implementationAuthority:
      "REQUIRES_SEPARATE_EXPLICIT_CONSTRUCTION_AUTHORIZATION"
  }),
  permittedUses: deepFreeze([
    "BOUNDED_SOURCE_LOOKUP",
    "SEVEN_FILE_TRANSFER_TRACEABILITY",
    "SUPPORT_MECHANISM_DISTRIBUTION_PLANNING",
    "CORE_INTERFACE_COMPATIBILITY_PREPARATION",
    "AWARENESS_SNAPSHOT_GENERATION",
    "POST_CHANGE_COMPARISON"
  ]),
  prohibitedUses: deepFreeze([
    "AUTOMATIC_CODE_SELECTION",
    "AUTOMATIC_MUTATION",
    "IMPORT_PROJECT_AWARENESS_INTO_RUNTIME",
    "CREATE_EIGHTH_RUNTIME_FILE",
    "RESTORE_SUPPORT_FILES_AS_RUNTIME_FILES",
    "MUTATE_ARCHCOIN_PRODUCT_PATHS",
    "CREATE_ROUTES_DESTINATIONS_OR_NAVIGATION",
    "PROMOTE_PROTOTYPE",
    "AUTHORIZE_PRODUCT_CALIBRATION"
  ]),
  awarenessOnlyArtifact: true,
  prototypeModifiedByThisArtifact: false,
  sourceCompassesModifiedByThisArtifact: false,
  productAuthority: false,
  runtimeAuthority: false,
  implementationAuthority: false,
  mutationAuthority: false
};

export const UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4 = deepFreeze({
  ...MAP_V4_BODY,
  deterministicDigest: deterministicDigest(MAP_V4_BODY)
});

function finding(id, pass, details = null) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

export function validateUniversalCompassFourSourceCapabilityMapV4(
  candidate = UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4
) {
  const findings = [];

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v4",
    candidate.schema
  ));
  findings.push(finding(
    "SEVEN_DESTINATION_RECORDS_EXACT",
    candidate.sevenFileTransitionRecords.length === 7 &&
      new Set(
        candidate.sevenFileTransitionRecords.map(record => record.destinationPath)
      ).size === 7,
    candidate.sevenFileTransitionRecords.map(record => record.destinationPath)
  ));
  findings.push(finding(
    "EXACT_SHELL_BLOB_IDENTITY_PRESERVED",
    candidate.sevenFileTransitionRecords.every(
      record =>
        record.transferStatus === "EXACT_SHELL_COPY_COMPLETE" &&
        record.sourceBlob === record.destinationBlob
    ),
    candidate.sevenFileTransitionRecords.map(record => ({
      sourceBlob: record.sourceBlob,
      destinationBlob: record.destinationBlob
    }))
  ));
  findings.push(finding(
    "LOCKED_FOUR_BY_FOUR_TARGET_PROFILE",
    candidate.lockedTargetProfile.cardinalStarCount === 4 &&
      candidate.lockedTargetProfile.clusterCount === 4 &&
      candidate.lockedTargetProfile.childStarCount === 16 &&
      candidate.lockedTargetProfile.childStarsPerCluster === 4,
    candidate.lockedTargetProfile
  ));
  findings.push(finding(
    "ZERO_PRODUCT_NAVIGATION",
    candidate.lockedTargetProfile.routes === false &&
      candidate.lockedTargetProfile.destinations === false &&
      candidate.lockedTargetProfile.navigationExecution === false &&
      candidate.lockedTargetProfile.productAuthority === false,
    candidate.lockedTargetProfile
  ));
  findings.push(finding(
    "EXACT_HISTORICAL_SUPPORT_RECOVERY",
    candidate.supportMechanismRecords.some(
      record =>
        record.supportId === "COMPASS_CONTRACTS" &&
        record.recoveredBlob ===
          "946e7d9df63546e17104a0a8c849d8a58dbf91ce" &&
        record.recoveryStatus === "EXACT_HISTORICAL_BYTES_RECOVERED"
    ) &&
      candidate.supportMechanismRecords.some(
        record =>
          record.supportId === "COMPASS_ADAPTERS" &&
          record.recoveredBlob ===
            "7291ff640e55c81671d2581da19599e7cb94bbbe" &&
          record.recoveryStatus === "EXACT_HISTORICAL_BYTES_RECOVERED"
      ),
    candidate.supportMechanismRecords
  ));
  findings.push(finding(
    "NO_EIGHTH_RUNTIME_FILE",
    candidate.supportMechanismRecords.every(
      record => record.destinationRuntimeFileAdmitted === false
    ) &&
      candidate.prohibitedUses.includes("CREATE_EIGHTH_RUNTIME_FILE"),
    candidate.supportMechanismRecords
  ));
  findings.push(finding(
    "COMPOSITOR_NEXT_ROLE",
    candidate.coreCompatibilityHandoff.nextUnfinishedFunctionalRole ===
      "/prototypes/universal-compass/index.compositor.js",
    candidate.coreCompatibilityHandoff
  ));
  findings.push(finding(
    "NO_AUTHORITY_CREATED",
    candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModifiedByThisArtifact === false &&
      candidate.productAuthority === false &&
      candidate.runtimeAuthority === false &&
      candidate.implementationAuthority === false &&
      candidate.mutationAuthority === false,
    {
      productAuthority: candidate.productAuthority,
      runtimeAuthority: candidate.runtimeAuthority,
      mutationAuthority: candidate.mutationAuthority
    }
  ));

  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  const recomputedDigest = deterministicDigest(digestBody);
  findings.push(finding(
    "DETERMINISTIC_DIGEST_MATCH",
    candidate.deterministicDigest === recomputedDigest,
    {
      recorded: candidate.deterministicDigest,
      recomputed: recomputedDigest
    }
  ));

  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema:
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      transitionRecordCount: candidate.sevenFileTransitionRecords.length,
      supportMechanismRecordCount: candidate.supportMechanismRecords.length
    }),
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    runtimeAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT =
  validateUniversalCompassFourSourceCapabilityMapV4();

if (FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT.status !== "PASS") {
  const error = new Error(
    "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_FAILED"
  );
  error.receipt = FOUR_SOURCE_CAPABILITY_MAP_V4_VALIDATION_RECEIPT;
  throw error;
}
