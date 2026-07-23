import {
  PROJECT_AWARENESS_CONTRACT,
  createFact,
  deepFreeze,
  deterministicDigest
} from "./project-awareness.contract.js";

export const REPOSITORY_IDENTITY =
  "smansfield635-create/smansfield635-create.github.io";

export const BRANCH_IDENTITY =
  "agent/archcoin-compass-calibration-workspace-001";

export const SOURCE_INSPECTION_ANCHOR_COMMIT =
  "febf7ac9ca0bd69c791b70d3f914bbfff5403c1d";

export const SOURCE_INSPECTION_DATE =
  "2026-07-23";

const SOURCE_FAMILIES = Object.freeze([
  "MAIN_COMPASS",
  "LAW_COMPASS",
  "SHOWROOM_COMPASS",
  "ARCHCOIN_COMPASS"
]);

const DESTINATION_OWNERS = Object.freeze([
  "UNIVERSAL_COMPASS_PLANET",
  "UNIVERSAL_COMPASS_CRYSTALS",
  "UNIVERSAL_COMPASS_COMPOSITOR",
  "UNIVERSAL_COMPASS_CONTROLLER",
  "UNIVERSAL_COMPASS_INTERACTIONS",
  "UNIVERSAL_COMPASS_HTML",
  "UNIVERSAL_COMPASS_CSS"
]);

const SOURCE_ASSESSMENT_STATUSES = Object.freeze([
  "STRONG_CANDIDATE",
  "SUPPORTING",
  "CONFLICTED",
  "ABSENT",
  "OUT_OF_SCOPE"
]);

const SELECTION_STATUSES = Object.freeze([
  "BOUNDARY_CONTROLLING_IMPLEMENTATION_PENDING",
  "SUPPORTING_ONLY",
  "OUT_OF_SCOPE_FOR_CORE_RUNTIME"
]);

function provenance({
  evidencePosture,
  sourcePath = null,
  blobSha = null,
  declaredBy = "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_PASS_1",
  derivedFrom = null,
  unresolvedReason = null
}) {
  return {
    evidencePosture,
    repositoryIdentity: REPOSITORY_IDENTITY,
    inspectedCommit: SOURCE_INSPECTION_ANCHOR_COMMIT,
    branchIdentity: BRANCH_IDENTITY,
    sourcePath,
    blobSha,
    declaredBy,
    derivedFrom,
    verifiedAt:
      evidencePosture === "VERIFIED"
        ? SOURCE_INSPECTION_DATE
        : null,
    unresolvedReason
  };
}

function verified(
  value,
  sourcePath = null,
  blobSha = null,
  derivedFrom = "GITHUB_REPOSITORY_SOURCE_INSPECTION"
) {
  return createFact({
    value,
    ...provenance({
      evidencePosture: "VERIFIED",
      sourcePath,
      blobSha,
      derivedFrom
    })
  });
}

function declared(
  value,
  sourcePath = null,
  blobSha = null,
  derivedFrom = null
) {
  return createFact({
    value,
    ...provenance({
      evidencePosture: "DECLARED",
      sourcePath,
      blobSha,
      derivedFrom
    })
  });
}

function derived(
  value,
  derivedFrom,
  sourcePath = null,
  blobSha = null
) {
  return createFact({
    value,
    ...provenance({
      evidencePosture: "DERIVED",
      sourcePath,
      blobSha,
      derivedFrom
    })
  });
}

function unresolved(
  value,
  unresolvedReason,
  sourcePath = null,
  blobSha = null,
  derivedFrom = null
) {
  return createFact({
    value,
    ...provenance({
      evidencePosture: "UNRESOLVED",
      sourcePath,
      blobSha,
      derivedFrom,
      unresolvedReason
    })
  });
}

function absent(
  value,
  sourcePath,
  unresolvedReason,
  derivedFrom = "GITHUB_CONTENT_PATH_RESOLUTION"
) {
  return createFact({
    value,
    ...provenance({
      evidencePosture: "ABSENT",
      sourcePath,
      blobSha: null,
      derivedFrom,
      unresolvedReason
    })
  });
}

function sourceRecord({
  sourceId,
  family,
  path,
  blobSha,
  role,
  capabilityTags,
  lifecycleStatus = "ACTIVE",
  authorityClassification = "HISTORICAL_SOURCE"
}) {
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_SOURCE_POOL_RECORD_v1",
    recordKind: "FOUR_COMPASS_SOURCE_POOL_RECORD",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      sourceId: derived(sourceId, path, path, blobSha),
      family: verified(family, path, blobSha),
      path: verified(path, path, blobSha),
      blobSha: verified(blobSha, path, blobSha, "GITHUB_CONTENT_BLOB_SHA"),
      role: derived(role, "SOURCE_HEADER_AND_PUBLIC_SURFACE_INSPECTION", path, blobSha),
      capabilityTags: derived(
        capabilityTags.slice(),
        "SOURCE_HEADER_AND_PUBLIC_SURFACE_INSPECTION",
        path,
        blobSha
      ),
      lifecycleStatus: declared(lifecycleStatus, path, blobSha),
      authorityClassification: declared(
        authorityClassification,
        path,
        blobSha
      ),
      sourcePoolUse: declared(
        "CAPABILITY_CANDIDATE_NOT_TEMPLATE_NOT_DESTINATION_AUTHORITY",
        path,
        blobSha
      ),
      productionAuthorityTransferred: declared(false, path, blobSha)
    }
  });
}

export const FOUR_SOURCE_POOL_RECORDS = deepFreeze([
  sourceRecord({
    sourceId: "MAIN_CONTROLLER",
    family: "MAIN_COMPASS",
    path: "/assets/compass/compass.controller.js",
    blobSha: "259e0d16b55c3986fec57db37fc057861483344a",
    role: "INTEGRATED_CONTROLLER_AND_LIFECYCLE_AUTHORITY",
    capabilityTags: [
      "CONSTELLATION_STATE",
      "CLUSTER_STATE",
      "SELECTION",
      "ORIENTATION_PREVIEW_COMMIT_CANCEL",
      "NAVIGATION",
      "HELD_STATE",
      "OPTIONAL_PARTICIPANT_LIFECYCLE",
      "RECEIPTS"
    ]
  }),
  sourceRecord({
    sourceId: "MAIN_CRYSTALS",
    family: "MAIN_COMPASS",
    path: "/assets/compass/compass.crystals.js",
    blobSha: "3d6427cbdb961576468d4aab05c0e4987549cea3",
    role: "HARDENED_INTEGRATED_CRYSTAL_RENDERER_AND_POINTER_RUNTIME",
    capabilityTags: [
      "CONSTELLATION_AND_CLUSTER_GEOMETRY",
      "WEBGL",
      "CAMERA_AND_PROJECTION",
      "SEMANTIC_POSITIONING",
      "HIT_TESTING",
      "POINTER_CAPTURE",
      "DRAG_FLICK_CLASSIFICATION",
      "INTERRUPTION_RECOVERY",
      "REDUCED_MOTION",
      "RESOURCE_LIFECYCLE"
    ]
  }),
  sourceRecord({
    sourceId: "MAIN_HTML",
    family: "MAIN_COMPASS",
    path: "/index.html",
    blobSha: "3e64bd9e36dbed25e57adc706c76e689c215910f",
    role: "SEMANTIC_ROUTE_AND_ACCESSIBILITY_COMPOSITION_ROOT",
    capabilityTags: [
      "SEMANTIC_CONTROLS",
      "ROUTE_DECLARATIONS",
      "ACCESSIBLE_DISCLOSURES",
      "KEYBOARD_LENS_CONTROLS",
      "STATUS_RECEIPTS",
      "MODULE_LOADING"
    ]
  }),
  sourceRecord({
    sourceId: "MAIN_CSS",
    family: "MAIN_COMPASS",
    path: "/assets/compass/compass.css",
    blobSha: "5e00eb9f981c540b85f310294b0c919fbab17f2d",
    role: "RESPONSIVE_AND_REDUCED_MOTION_PRESENTATION_STANDARD",
    capabilityTags: [
      "RESPONSIVE_PRESENTATION",
      "FOCUS_VISIBILITY",
      "REDUCED_MOTION",
      "PERFORMANCE_HARDENING",
      "SEMANTIC_LAYER_PRESENTATION"
    ]
  }),
  sourceRecord({
    sourceId: "MAIN_MIRRORLAND_WINDOW",
    family: "MAIN_COMPASS",
    path: "/assets/compass/compass.mirrorland-window.js",
    blobSha: "b3ef695c21d391301394d587f3d0f51caacb0add",
    role: "OPTIONAL_PARTICIPANT_LIFECYCLE_REFERENCE",
    capabilityTags: [
      "OPTIONAL_PARTICIPANT",
      "TRANSITION_IDENTIFIERS",
      "FAILURE_COMPLETION",
      "PARTIAL_INITIALIZATION_ROLLBACK",
      "DISPOSAL"
    ]
  }),
  sourceRecord({
    sourceId: "MAIN_COSMOS",
    family: "MAIN_COMPASS",
    path: "/assets/compass/compass.cosmos.js",
    blobSha: "27c39b34de64c8ee90a7920d4dc78eeec1fe4167",
    role: "OPTIONAL_ATMOSPHERE_AND_ENVIRONMENTAL_SUSPENSION_REFERENCE",
    capabilityTags: [
      "ADAPTIVE_QUALITY",
      "CAPPED_DPR",
      "FRAME_PACING",
      "VISIBILITY_SUSPENSION",
      "REDUCED_MOTION",
      "FAILURE_ISOLATION",
      "DISPOSAL"
    ]
  }),

  sourceRecord({
    sourceId: "LAWS_CONTROLLER",
    family: "LAW_COMPASS",
    path: "/laws/index.controller.js",
    blobSha: "5711c261d7fac96a3622ef80e98dacca845f7d96",
    role: "EXPLICIT_CONTROLLER_AUTHORITY_AND_ROUTE_ADMISSION_STANDARD",
    capabilityTags: [
      "CONTROLLER_AUTHORITY_SEPARATION",
      "LEGAL_STATE_TRANSITIONS",
      "DOM_DECLARED_ROUTE_ADMISSION",
      "GESTURE_TRANSACTIONS",
      "QUATERNION_VALIDATION",
      "HELD_STATE",
      "SEMANTIC_PROJECTION",
      "RECEIPTS"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_INTERACTIONS",
    family: "LAW_COMPASS",
    path: "/laws/index.interactions.js",
    blobSha: "6ee820886846cfe102d030389ca18ed4a13a1a23",
    role: "SEPARATE_POINTER_GESTURE_AND_HIT_PRIORITY_STANDARD",
    capabilityTags: [
      "POINTER_LIFECYCLE",
      "TAP_DRAG_SWIPE_ARBITRATION",
      "QUATERNION_GENERATION",
      "HIT_CORRIDORS",
      "MOBILE_TARGET_ADMISSION",
      "INTERACTION_PRIORITY",
      "REDUCED_MOTION"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_COMPOSITOR",
    family: "LAW_COMPASS",
    path: "/laws/index.compositor.js",
    blobSha: "66ca5b4f1fd25c591e74b109ba9ab6368b2c64aa",
    role: "SEPARATE_CAMERA_PROJECTION_AND_LAYER_ORCHESTRATION_STANDARD",
    capabilityTags: [
      "CAMERA_STATE",
      "VIEW_PROJECTION_MATRICES",
      "VIEWPORT_AND_DPR",
      "WORLD_TO_SCREEN",
      "DEPTH_HYSTERESIS",
      "REAR_FRONT_CANVASES",
      "PAGE_LAYER_ORDERING",
      "ROLLBACK_AND_DISPOSAL"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_CRYSTALS",
    family: "LAW_COMPASS",
    path: "/laws/index.crystals.js",
    blobSha: "3483e4a08913eb02f48fb2f981b1f7bcce1a5d4d",
    role: "CONTROLLER_DECOUPLED_CRYSTAL_RENDERER_STANDARD",
    capabilityTags: [
      "CRYSTAL_MESHES_AND_MATERIALS",
      "VISUAL_INTERPOLATION",
      "SEMANTIC_ASSOCIATION",
      "COMPOSITOR_DELIVERY",
      "OPTIONAL_PLANET_PARTICIPANT",
      "PROJECTION_RECORD_FORWARDING",
      "FAILURE_REPORTING"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_PLANET",
    family: "LAW_COMPASS",
    path: "/laws/index.planet.js",
    blobSha: "329d207fd5ad6d89e517f6c0fa992fb1a65b115a",
    role: "SEPARATELY_GOVERNED_SHARED_PASS_PLANET_PARTICIPANT",
    capabilityTags: [
      "AUDRALIA_GEOMETRY_CONSUMPTION",
      "CENTER_WORLD_PARTICIPANT",
      "INDEPENDENT_ROTATION",
      "SHARED_RENDER_PASS",
      "NO_INDEPENDENT_LOOP",
      "EXPLICIT_NON_OWNERSHIP"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_HTML",
    family: "LAW_COMPASS",
    path: "/laws/index.html",
    blobSha: "28c1041d0ad75f03a39092dc04b8785769ef4a6f",
    role: "DECLARATIVE_MODULE_CONTRACT_AND_FOUR_BY_SIXTEEN_ROUTE_ROOT",
    capabilityTags: [
      "MODULE_CONTRACT_DECLARATIONS",
      "FOUR_BY_SIXTEEN_ROUTES",
      "SEMANTIC_CONTROLS",
      "PLANET_PARTICIPANT_DECLARATION",
      "SOURCE_CONTRACT_METADATA"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_CSS",
    family: "LAW_COMPASS",
    path: "/laws/index.css",
    blobSha: "9b1435c5417b28d69d02ed0c9e963194b59fbb3d",
    role: "COMPACT_SEMANTIC_HIT_TARGET_AND_WORLD_PASS_PRESENTATION_STANDARD",
    capabilityTags: [
      "SEMANTIC_HIT_TARGETS",
      "COMPACT_DISCLOSURES",
      "PLANET_SHARED_PASS_PRESENTATION",
      "POINTER_AUTHORITY_EXCLUSION",
      "RESPONSIVE_PRESENTATION"
    ]
  }),
  sourceRecord({
    sourceId: "LAWS_COSMOS",
    family: "LAW_COMPASS",
    path: "/laws/index.cosmos.js",
    blobSha: "e607f5f0965153c9766326fdb9039e9eaa01a2ec",
    role: "INDEPENDENT_OPTIONAL_ATMOSPHERE_FAILURE_ISOLATION_REFERENCE",
    capabilityTags: [
      "VISIBILITY_SUSPENSION",
      "REDUCED_MOTION",
      "FAILURE_ISOLATION",
      "ROLLBACK",
      "DESTRUCTION",
      "ADAPTIVE_QUALITY"
    ]
  }),

  sourceRecord({
    sourceId: "SHOWROOM_CONTROLLER",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.controller.js",
    blobSha: "460d9a7beb323f62012683fbe6f27e3c98462705",
    role: "FOUR_BY_SIXTEEN_ROUTE_GATEWAY_AND_PRESENTATION_STATE_REFERENCE",
    capabilityTags: [
      "STATE_TRANSITIONS",
      "PRESENTATION_MODES",
      "CANONICAL_ROOM_RECORDS",
      "ROUTE_GATEWAY",
      "QUATERNION_NORMALIZATION",
      "HELD_STATE"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_INTERACTIONS",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.interactions.js",
    blobSha: "a6588645bef4071002f49690dcc6cd2a8e91db26",
    role: "EVENT_DRIVEN_INTERACTION_ORCHESTRATION_AND_RECOVERY_STANDARD",
    capabilityTags: [
      "DEPENDENCY_READINESS",
      "FAILURE_EVENTS",
      "SEMANTIC_CONTROL_RECOVERY",
      "PROTECTED_TARGETS",
      "ORBIT_AND_CLUSTER_SCOPES",
      "TERRITORY_CLASSIFICATION",
      "DISPOSAL"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_GESTURE_SUPPORT",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.interaction.gestures.js",
    blobSha: "bf4e773d4931d550ec34c33ef9614b332c11f8b2",
    role: "REUSABLE_GESTURE_VECTOR_AND_QUATERNION_SUPPORT",
    capabilityTags: [
      "CANONICAL_BASE_POSITIONS",
      "PRIMARY_ANCHORS",
      "MOTION_SAMPLING",
      "FLICK_CLASSIFICATION",
      "VECTOR_MATH",
      "QUATERNION_MATH"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_COMPOSITOR",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.compositor.js",
    blobSha: "c148364e1d15f6e90ced475654fd348fd68fcca5",
    role: "READINESS_AWARE_OWNED_LAYER_COMPOSITOR_STANDARD",
    capabilityTags: [
      "OWNED_LAYER_CREATION",
      "CAMERA",
      "DEPTH_CLASSIFICATION",
      "CONTROLLER_BINDING",
      "READINESS_STATES",
      "STYLE_ROLLBACK",
      "CANVAS_RESTORATION",
      "DISPOSAL"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_CRYSTALS",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.crystals.js",
    blobSha: "8695a62df8ecbf7088aa8377b4dda5e83131e3a3",
    role: "STARTUP_GOVERNED_NON_ADDITIVE_CRYSTAL_RENDERER",
    capabilityTags: [
      "CRYSTAL_GEOMETRY",
      "WEBGL_LIFECYCLE",
      "CANONICAL_FOUR_BY_FOUR_POSITIONS",
      "VISUAL_INTERPOLATION",
      "RENDERER_REGISTRATION",
      "EXCLUSIVE_CLEAR_CALLBACKS",
      "READINESS_TIMEOUT",
      "DUPLICATE_BOOTSTRAP_PREVENTION"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_PLANET",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.planet.js",
    blobSha: "a816b77b4f7d31ceff42fe298d358dbe90997698",
    role: "INDEPENDENT_DECORATIVE_AUDRALIA_PLANET_REFERENCE",
    capabilityTags: [
      "AUDRALIA_GEOMETRY_CONSUMPTION",
      "CENTER_PLANET",
      "FALLBACK_STATE",
      "PAUSE_RESUME",
      "FAILURE_STATE",
      "DISPOSAL",
      "NAVIGATION_AUTHORITY_EXCLUSION"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_HTML",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.html",
    blobSha: "63a17b61ddafdd2433023c8ba21b5c1a8d389eee",
    role: "DECLARATIVE_RUNTIME_ORCHESTRATION_AND_SEMANTIC_FALLBACK_ROOT",
    capabilityTags: [
      "MODULE_PATH_DECLARATIONS",
      "CONTRACT_IDENTITIES",
      "FOUR_BY_SIXTEEN_ROUTES",
      "SEMANTIC_FALLBACK_CONTROLS",
      "READINESS_DATASETS",
      "CENTER_PLANET_DECLARATION"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_CSS",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.css",
    blobSha: "976c78d2c2808d461d2fe2be1ce6c25332788e9d",
    role: "POINTER_TRANSPARENT_VISUAL_LAYER_AND_STAGE_PRESENTATION_STANDARD",
    capabilityTags: [
      "POINTER_TRANSPARENT_VISUAL_LAYERS",
      "POINTER_ACTIVE_SEMANTIC_CONTROLS",
      "TOUCH_AUTHORITY_EXCLUSION",
      "COSMOS_FALLBACK",
      "PLANET_OWNERSHIP_PRESERVATION"
    ]
  }),
  sourceRecord({
    sourceId: "SHOWROOM_COSMOS",
    family: "SHOWROOM_COMPASS",
    path: "/showroom/index.cosmos.js",
    blobSha: "b538c9303bcf3339eb498e45bef0cb5848ff7f09",
    role: "AUTONOMOUS_OPTIONAL_ATMOSPHERE_LIFECYCLE_STANDARD",
    capabilityTags: [
      "IRREGULAR_STARFIELD",
      "ADAPTIVE_QUALITY",
      "CAPPED_DPR",
      "FRAME_PACING",
      "VISIBILITY_SUSPENSION",
      "REDUCED_MOTION",
      "INDEPENDENT_FAILURE",
      "ROLLBACK_AND_DESTRUCTION"
    ]
  }),

  sourceRecord({
    sourceId: "ARCHCOIN_CONTROLLER",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.controller.js",
    blobSha: "133047093bcb9d795848cb9045c32c4321b0dbb9",
    role: "SEVEN_FILE_ACCEPTED_STATE_TRANSACTION_AND_NAVIGATION_AUTHORITY",
    capabilityTags: [
      "PLANET_OWNED_IDENTITY_BOUNDARY",
      "PRESENTATION_TRANSITIONS",
      "TRANSACTION_PHASES",
      "REVISION_EVENTS",
      "OPTIONAL_PARTICIPANT_TRANSITIONS",
      "ASSERTIONS",
      "DEEP_FREEZE",
      "QUATERNION_NORMALIZATION"
    ]
  }),
  sourceRecord({
    sourceId: "ARCHCOIN_INTERACTIONS",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.interactions.js",
    blobSha: "c425ece001586db09aeb7353bfde2ab8177db7c3",
    role: "TARGET_CONFIDENCE_HYSTERESIS_AND_POINTER_PROPOSAL_AUTHORITY",
    capabilityTags: [
      "POINTER_TYPE_NORMALIZATION",
      "TAP_DRAG_THRESHOLDS",
      "SMOOTHING",
      "DIRECT_GRAB",
      "OPEN_SPACE_ROTATION",
      "TARGET_CONFIDENCE",
      "SWITCH_HYSTERESIS",
      "OVERLAP_PENALTIES",
      "COMMIT_CONFIDENCE",
      "SWIPE_RETURN"
    ]
  }),
  sourceRecord({
    sourceId: "ARCHCOIN_COMPOSITOR",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.compositor.js",
    blobSha: "594eefa10bb7ad0583f7c3284a1e0daf28f34960",
    role: "CAMERA_DEPTH_LAYER_AND_COMPOSITE_PASS_AUTHORITY",
    capabilityTags: [
      "CAMERA_PRESETS",
      "VIEW_PROJECTION",
      "VIEWPORT_AND_DPR",
      "WORLD_TO_SCREEN",
      "OVERLAP",
      "DEPTH_HYSTERESIS",
      "REAR_FRONT_CANVASES",
      "LAYER_ORDERING",
      "DISPOSAL"
    ]
  }),
  sourceRecord({
    sourceId: "ARCHCOIN_CRYSTALS",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.crystals.js",
    blobSha: "a1e300c88035daf79de8acdd03ad2cce8b2acb6b",
    role: "SEVEN_FILE_PLANET_SNAPSHOT_CONSUMER_AND_TOPOLOGY_AUTHORITY",
    capabilityTags: [
      "PLANET_CONSUMPTION_BOUNDARY",
      "CRYSTAL_TOPOLOGY",
      "BOUNDS",
      "ANCHORS",
      "HIT_SHAPES",
      "STABLE_SERIALIZATION",
      "DETERMINISTIC_HASH",
      "GEOMETRY_VALIDATION",
      "IMMUTABLE_VISUAL_RECORDS"
    ]
  }),
  sourceRecord({
    sourceId: "ARCHCOIN_HTML",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.html",
    blobSha: "fc1c0872fee5d0fc0caae5767cc9fb72e6850d8f",
    role: "FOUR_BY_SIXTEEN_SEMANTIC_ROUTE_AND_RECEIPT_ROOT",
    capabilityTags: [
      "FOUR_BY_SIXTEEN_ROUTES",
      "SEMANTIC_CONTROLS",
      "STATUS_DATASETS",
      "RECEIPTS",
      "ACCESSIBLE_LENS_TABS",
      "ARROW_HOME_END_KEYS",
      "INLINE_PRESENTATION_MODULE"
    ]
  }),
  sourceRecord({
    sourceId: "ARCHCOIN_CSS",
    family: "ARCHCOIN_COMPASS",
    path: "/products/archcoin/index.css",
    blobSha: "cade394b5b1e009430a561e6c86711502f8a72a8",
    role: "COMPACT_LAYERED_SEMANTIC_CONTROL_PRESENTATION_STANDARD",
    capabilityTags: [
      "REAR_CENTER_FRONT_SEMANTIC_LAYERING",
      "SEMANTIC_CONTROLS",
      "POINTER_AUTHORITY_EXCLUSION",
      "RESPONSIVE_PRESENTATION",
      "VISUAL_STATUS_BOUNDARIES"
    ]
  })
]);

function destinationRecord({
  artifactId,
  path,
  blobSha,
  authorityScope
}) {
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_DESTINATION_RECORD_v1",
    recordKind: "SEVEN_FILE_DESTINATION",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      artifactId: derived(artifactId, path, path, blobSha),
      path: verified(path, path, blobSha),
      blobSha: verified(blobSha, path, blobSha),
      authorityScope: declared(authorityScope, path, blobSha),
      lifecycleStatus: declared("CANDIDATE", path, blobSha),
      executable: declared(false, path, blobSha),
      accepted: declared(false, path, blobSha),
      productionAuthorized: declared(false, path, blobSha)
    }
  });
}

export const UNIVERSAL_COMPASS_DESTINATIONS = deepFreeze([
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_PLANET",
    path: "/prototypes/universal-compass/index.planet.js",
    blobSha: "0d462361776288b88584a7272c8e42ea6b14f1fa",
    authorityScope: "OWNS_IMMUTABLE_WORLD_IDENTITY_MEMBERSHIP_TRANSFORMS_AND_SNAPSHOTS"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_CRYSTALS",
    path: "/prototypes/universal-compass/index.crystals.js",
    blobSha: "0bdf6bd08732d72935192dc211014cf7ec84dc15",
    authorityScope: "CONSUMES_PLANET_AND_OWNS_LOCAL_TOPOLOGY_AND_VISUAL_RECORDS_ONLY"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_COMPOSITOR",
    path: "/prototypes/universal-compass/index.compositor.js",
    blobSha: "2e496e4b2d2278e70a7b44bc6b6e714c86d343e8",
    authorityScope: "OWNS_CAMERA_PROJECTION_DEPTH_AND_COMPOSITE_FRAME_PUBLICATION"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_CONTROLLER",
    path: "/prototypes/universal-compass/index.controller.js",
    blobSha: "7eae298304d53c711adc1714fbc44dcd94f6b065",
    authorityScope: "OWNS_ACCEPTED_STATE_TRANSACTIONS_REVISIONS_AND_NAVIGATION"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_INTERACTIONS",
    path: "/prototypes/universal-compass/index.interactions.js",
    blobSha: "cf06c107a23115a809826b949e306e5c810e60f0",
    authorityScope: "OWNS_POINTER_INPUT_GESTURE_CLASSIFICATION_AND_PROPOSALS_ONLY"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_HTML",
    path: "/prototypes/universal-compass/index.html",
    blobSha: "cd1abe75ba93e5733514ad378f52223ec53805b2",
    authorityScope: "OWNS_MOUNTS_SEMANTIC_CONTROLS_ACCESSIBILITY_AND_COMPOSITION"
  }),
  destinationRecord({
    artifactId: "UNIVERSAL_COMPASS_CSS",
    path: "/prototypes/universal-compass/index.css",
    blobSha: "9265c26fd406ccc2c729c2c992c8d03ad6c1a4fa",
    authorityScope: "PRESENTS_PUBLISHED_STATE_WITHOUT_RUNTIME_AUTHORITY"
  })
]);

function assessment(
  family,
  status,
  sourceArtifactIds,
  observedStrengths,
  cautions = []
) {
  return deepFreeze({
    family,
    status,
    sourceArtifactIds: sourceArtifactIds.slice(),
    observedStrengths: observedStrengths.slice(),
    cautions: cautions.slice()
  });
}

function capability({
  capabilityId,
  destinationOwner,
  requiredForRuntimeClosure,
  sourceAssessments,
  selectionStatus =
    "BOUNDARY_CONTROLLING_IMPLEMENTATION_PENDING",
  governingBoundary,
  requiredOutcome
}) {
  return deepFreeze({
    schema: "DGB_UNIVERSAL_COMPASS_CAPABILITY_RECORD_v1",
    capabilityId,
    destinationOwner,
    requiredForRuntimeClosure: Boolean(requiredForRuntimeClosure),
    sourceAssessments: sourceAssessments.slice(),
    selectionStatus,
    governingBoundary,
    requiredOutcome
  });
}

export const FOUR_SOURCE_CAPABILITY_MATRIX = deepFreeze([
  capability({
    capabilityId: "WORLD_IDENTITY_MEMBERSHIP_AND_SNAPSHOT",
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CONTROLLER", "MAIN_CRYSTALS"], [
        "Preserved cardinal and room identities",
        "Separate constellation and cluster orientation records",
        "Deterministic primary focus"
      ], [
        "World identity is distributed across controller and integrated renderer"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_CONTROLLER", "LAWS_PLANET"], [
        "Explicit controller authority boundary",
        "Separately governed center-world participant"
      ], [
        "Planet occurrence is a render-pass participant rather than complete world truth owner"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_CONTROLLER", "SHOWROOM_PLANET"], [
        "Canonical route and child records",
        "Explicit center-planet non-navigation boundary"
      ], [
        "World truth remains distributed across runtime modules"
      ]),
      assessment("ARCHCOIN_COMPASS", "CONFLICTED", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_CRYSTALS"], [
        "Explicit seven-file planet-owned identity contract",
        "Crystals explicitly consume planet identity and membership"
      ], [
        "No /products/archcoin/index.planet.js occurrence resolved at the inspected ref"
      ])
    ],
    governingBoundary:
      "PLANET_EXCLUSIVELY_OWNS_WORLD_IDENTITY_MEMBERSHIP_SEATS_TRANSFORMS_PRIMARY_AND_WORLD_SNAPSHOTS",
    requiredOutcome:
      "A deterministic immutable world snapshot and read-only identity/membership interface"
  }),

  capability({
    capabilityId: "QUATERNION_VECTOR_AND_SETTLEMENT_MATHEMATICS",
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER", "MAIN_CRYSTALS"], [
        "Complete spherical constellation and cluster orientation behavior",
        "Release settlement and primary-anchor alignment"
      ], [
        "Math is embedded inside larger integrated files"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER", "LAWS_INTERACTIONS"], [
        "Complete-quaternion validation",
        "Motion generation separated from accepted-state authority"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_GESTURE_SUPPORT"], [
        "Reusable vector and quaternion support",
        "Primary anchors and sampling thresholds",
        "Flick and settlement support"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_INTERACTIONS"], [
        "Internalized quaternion normalization and multiplication",
        "Bounded incremental motion and direct-grab correction"
      ], [
        "Controller/interactions version anchors require reconciliation"
      ])
    ],
    governingBoundary:
      "PLANET_OWNS_WORLD_EVALUATION_MATH; INTERACTIONS_MAY_OWN_POINTER_TO_PROPOSAL_MATH_BUT_NOT_ACCEPTED_WORLD_STATE",
    requiredOutcome:
      "Finite normalized deterministic math with no retired support-file dependency"
  }),

  capability({
    capabilityId: "CONSTELLATION_AND_CLUSTER_SPATIAL_RELATIONS",
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER", "MAIN_CRYSTALS"], [
        "Four-cardinal sphere",
        "Independent room-cluster spheres",
        "Persistent orientation records"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CRYSTALS", "LAWS_CONTROLLER"], [
        "Right-handed Euclidean XYZ",
        "Four-category and sixteen-law structure",
        "Controller-decoupled visual interpolation"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_GESTURE_SUPPORT", "SHOWROOM_CRYSTALS"], [
        "Canonical cardinal and four-room positions",
        "Non-additive constellation/cluster populations"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CRYSTALS", "ARCHCOIN_CONTROLLER"], [
        "Planet-owned seats and transforms",
        "Variable-capacity topology support",
        "Constellation/cluster transition contract"
      ])
    ],
    governingBoundary:
      "PLANET_OWNS_CANONICAL_WORLD_RELATIONS; CRYSTALS_MAY_ONLY_APPLY_LOCAL_VISUAL_TOPOLOGY",
    requiredOutcome:
      "One canonical constellation relation and one canonical relation per active cluster"
  }),

  capability({
    capabilityId: "CRYSTAL_TOPOLOGY_BOUNDS_ANCHORS_AND_HIT_SHAPES",
    destinationOwner: "UNIVERSAL_COMPASS_CRYSTALS",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CRYSTALS"], [
        "Hardened crystal meshes, materials, hit testing, semantic correspondence"
      ], [
        "World geometry and visual behavior are combined"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_CRYSTALS"], [
        "Controller-decoupled meshes and materials",
        "Optional participant admission"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_CRYSTALS"], [
        "Canonical four-by-four crystal geometry",
        "Renderer registration and visual interpolation"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CRYSTALS"], [
        "Explicit planet-snapshot consumer boundary",
        "Deterministic topology, bounds, anchors and hit shapes",
        "Stable serialization and geometry validation"
      ])
    ],
    governingBoundary:
      "CRYSTALS_OWN_LOCAL_TOPOLOGY_BOUNDS_ANCHORS_HIT_SHAPES_MATERIALS_AND_VISUAL_RECORDS_NOT_WORLD_TRANSFORMS",
    requiredOutcome:
      "Immutable visual records joined to planet-issued identities and world transforms"
  }),

  capability({
    capabilityId: "CAMERA_WORLD_TO_SCREEN_AND_DEPTH_CLASSIFICATION",
    destinationOwner: "UNIVERSAL_COMPASS_COMPOSITOR",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CRYSTALS"], [
        "Executed integrated camera, projection and front-star detection patterns"
      ], [
        "Projection is not separated from crystal renderer"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_COMPOSITOR"], [
        "Dedicated camera and projection authority",
        "Viewport and DPR management",
        "Stable depth hysteresis"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_COMPOSITOR"], [
        "Dedicated camera and classification",
        "Readiness and restoration behavior"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_COMPOSITOR"], [
        "Dedicated world-to-screen projection",
        "Overlap measurement",
        "Mobile and normal camera presets"
      ], [
        "Controller and crystals compatibility anchors are stale relative to inspected product files"
      ])
    ],
    governingBoundary:
      "COMPOSITOR_EXCLUSIVELY_OWNS_CAMERA_SCREEN_COORDINATES_DEPTH_VISIBILITY_AND_HIT_ELIGIBILITY",
    requiredOutcome:
      "Deterministic projection snapshot from world snapshot plus crystal records"
  }),

  capability({
    capabilityId: "COMPOSITE_LAYER_AND_FRAME_ORCHESTRATION",
    destinationOwner: "UNIVERSAL_COMPASS_COMPOSITOR",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CRYSTALS", "MAIN_CSS"], [
        "Integrated visual ordering and semantic correspondence"
      ], [
        "Layer ownership is embedded in the renderer"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_COMPOSITOR"], [
        "Rear, center, front and semantic layer ordering",
        "Owned canvases and rollback"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_COMPOSITOR", "SHOWROOM_CSS"], [
        "Owned layers",
        "Exclusive canvas placement and restoration",
        "Pointer-transparent visual layers"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_COMPOSITOR", "ARCHCOIN_CSS"], [
        "Rear, Compass, front and semantic ordering",
        "Composite-pass orchestration"
      ])
    ],
    governingBoundary:
      "COMPOSITOR_OWNS_FRAME_CLEARING_LAYER_ORDER_AND_PROJECTION_PUBLICATION; CSS_ONLY_PRESENTS_LAYER_STATE",
    requiredOutcome:
      "One ordered frame with no competing camera, clearing or layer authority"
  }),

  capability({
    capabilityId: "CONTROLLER_ACCEPTED_STATE_AND_PRESENTATION_TRANSITIONS",
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER"], [
        "Persistent constellation and cluster orientation records",
        "Held and optional participant lifecycle",
        "Selection and navigation"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER"], [
        "Most explicit motion-versus-authority boundary",
        "Legal transitions and semantic projection publication"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_CONTROLLER"], [
        "Four-by-sixteen state and route gateway",
        "Canonical presentation mapping"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER"], [
        "Seven-file accepted-state authority",
        "Planet-owned identity boundary",
        "Compatibility mirrors and exact contracts"
      ])
    ],
    governingBoundary:
      "CONTROLLER_ACCEPTS_OR_REJECTS_STATE; INTERACTIONS_AND_RENDERERS_NEVER_COMMIT_CANONICAL_STATE",
    requiredOutcome:
      "Immutable accepted-state publications with lawful constellation and cluster transitions"
  }),

  capability({
    capabilityId: "TRANSACTION_PHASE_REVISION_AND_ROUTE_COMMIT",
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CONTROLLER"], [
        "Preview, commitment, cancellation, navigation and receipts"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER"], [
        "Gesture transaction begin, preview acceptance, commit and cancel",
        "Declared route admission"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_CONTROLLER"], [
        "Legal state transitions and route gateway"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER"], [
        "Explicit ORIENTATION through ROUTE_COMMIT phases",
        "Revision-advancing event taxonomy",
        "Stale and duplicate request handling"
      ])
    ],
    governingBoundary:
      "CONTROLLER_EXCLUSIVELY_OWNS_TRANSACTION_PHASE_REVISION_SETTLEMENT_AND_ROUTE_AUTHORIZATION",
    requiredOutcome:
      "Deterministic transition receipts and route commit only after lawful settlement"
  }),

  capability({
    capabilityId: "POINTER_CAPTURE_INTERRUPTION_AND_RESOURCE_CLEANUP",
    destinationOwner: "UNIVERSAL_COMPASS_INTERACTIONS",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CRYSTALS"], [
        "Pointer capture and cancellation",
        "Lost-capture, blur, visibility and pagehide recovery",
        "Partial initialization rollback and context-loss handling"
      ], [
        "Behavior is bundled with rendering"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_INTERACTIONS"], [
        "Pointer lifecycle isolated from controller authority"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_INTERACTIONS"], [
        "Dependency and failure event handling",
        "Protected targets and disposal"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_INTERACTIONS"], [
        "Stable active pointer record",
        "Pointer type normalization",
        "Deterministic interaction state cleanup"
      ])
    ],
    governingBoundary:
      "INTERACTIONS_OWNS_POINTER_CUSTODY_AND_CANCELLATION_BUT_MUST_ROUTE_ACCEPTED_STATE_THROUGH_CONTROLLER",
    requiredOutcome:
      "No stuck pointer, leaked capture, stale gesture or authority bypass"
  }),

  capability({
    capabilityId: "TARGET_CONFIDENCE_OVERLAP_AND_SWITCH_HYSTERESIS",
    destinationOwner: "UNIVERSAL_COMPASS_INTERACTIONS",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CRYSTALS"], [
        "Front-star detection, hit priority and accidental click suppression"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_INTERACTIONS"], [
        "Depth-aware hit corridors and mobile fallback target resolution"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_INTERACTIONS"], [
        "Territory classification and protected target handling"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_INTERACTIONS"], [
        "Confidence-weighted target scoring",
        "Retention bonus, switch margin, persistence, frame gate and cooldown",
        "Overlap and rear penalties",
        "Minimum commit confidence"
      ])
    ],
    governingBoundary:
      "INTERACTIONS_MAY_ARBITRATE_CANDIDATES_BUT_CONTROLLER_REMAINS_THE_ACCEPTED_SELECTION_AUTHORITY",
    requiredOutcome:
      "Stable target custody under overlap without accidental navigation"
  }),

  capability({
    capabilityId: "TAP_DRAG_FLICK_AND_RETURN_CLASSIFICATION",
    destinationOwner: "UNIVERSAL_COMPASS_INTERACTIONS",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CRYSTALS"], [
        "Duration, travel, release velocity, motion samples, efficiency and pause measurement",
        "Controlled settlement separated from quick flick return"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_INTERACTIONS"], [
        "Thresholds confined to interactions",
        "Tap, orbit rotate, cluster rotate and release swipe intents"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_GESTURE_SUPPORT", "SHOWROOM_INTERACTIONS"], [
        "Reusable sampling and flick classifier",
        "Orbit and cluster scopes"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_INTERACTIONS"], [
        "Device-adjusted tap/drag thresholds",
        "Smoothing and bounded deltas",
        "Release-only cluster swipe"
      ])
    ],
    governingBoundary:
      "INTERACTIONS_CLASSIFIES_GESTURES; RETURN_AND_NAVIGATION_EFFECTS_REQUIRE_CONTROLLER_ACCEPTANCE",
    requiredOutcome:
      "Deterministic tap, drag, settle, cancel and qualified return proposals"
  }),

  capability({
    capabilityId: "SEMANTIC_CONTROL_ASSOCIATION_AND_PROJECTION_CORRESPONDENCE",
    destinationOwner: "UNIVERSAL_COMPASS_HTML",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_HTML", "MAIN_CRYSTALS"], [
        "Rich semantic destination declarations",
        "Keyboard focus correspondence",
        "Rendered visual to semantic control alignment"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_HTML", "LAWS_CRYSTALS", "LAWS_CONTROLLER"], [
        "DOM-declared route admission",
        "Canonical crystal-to-control association",
        "Projection records published to controller"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_HTML", "SHOWROOM_CRYSTALS", "SHOWROOM_INTERACTIONS"], [
        "Semantic fallback controls",
        "No semantic-control creation by crystals",
        "Semantic recovery and protected targets"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_HTML", "ARCHCOIN_CSS"], [
        "Four-by-sixteen semantic routes",
        "Status datasets and transparent crystal-centered controls"
      ])
    ],
    governingBoundary:
      "HTML_OWNS_SEMANTIC_ELEMENTS; COMPOSITOR_PUBLISHES_PROJECTION; CSS_PRESENTS; CONTROLLER_AUTHORIZES_SELECTION",
    requiredOutcome:
      "One stable semantic control per navigable identity with projection correspondence"
  }),

  capability({
    capabilityId: "ACCESSIBILITY_KEYBOARD_FOCUS_AND_REDUCED_MOTION",
    destinationOwner: "UNIVERSAL_COMPASS_HTML",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_HTML", "MAIN_CSS", "MAIN_CRYSTALS"], [
        "Accessible disclosures, live receipts, focus correspondence and reduced-motion support"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_HTML", "LAWS_CSS", "LAWS_INTERACTIONS"], [
        "Semantic controls remain hit targets",
        "Reduced-motion authority and mobile target tuning"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_HTML", "SHOWROOM_CSS", "SHOWROOM_INTERACTIONS"], [
        "Pointer-active semantic controls",
        "Pointer-transparent visual layers",
        "Protected native controls"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_HTML", "ARCHCOIN_CSS"], [
        "Arrow, Home and End keyboard behavior",
        "ARIA-selected and roving tabindex",
        "Status and receipt surfaces"
      ])
    ],
    governingBoundary:
      "ACCESSIBILITY_IS_A_REQUIRED_RUNTIME_INTERFACE_NOT_A_VISUAL_AFTERTHOUGHT",
    requiredOutcome:
      "Keyboard, focus, reduced-motion and semantic-control operation remain functional"
  }),

  capability({
    capabilityId: "STARTUP_READINESS_FAILURE_ROLLBACK_AND_DISPOSAL",
    destinationOwner: "UNIVERSAL_COMPASS_HTML",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CRYSTALS", "MAIN_MIRRORLAND_WINDOW", "MAIN_COSMOS"], [
        "Partial initialization rollback",
        "Duplicate binding prevention",
        "Failure and disposal receipts"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_COMPOSITOR", "LAWS_CRYSTALS", "LAWS_COSMOS"], [
        "Owned-layer rollback",
        "Independent optional-module failure",
        "Complete destruction"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_COMPOSITOR", "SHOWROOM_CRYSTALS", "SHOWROOM_INTERACTIONS", "SHOWROOM_COSMOS"], [
        "Bounded readiness waiting",
        "Dependency ready/failure/disposed events",
        "Duplicate bootstrap prevention",
        "Native style and canvas restoration"
      ]),
      assessment("ARCHCOIN_COMPASS", "SUPPORTING", ["ARCHCOIN_HTML", "ARCHCOIN_CONTROLLER"], [
        "Status datasets, receipts and fail-closed assertions"
      ], [
        "Current product source set does not yet demonstrate one aligned seven-file startup contract"
      ])
    ],
    governingBoundary:
      "HTML_COMPOSES_MODULES; EACH_AUTHORITY_FAILS_CLOSED_AND_DISPOSES_ONLY_ITS_OWN_RESOURCES",
    requiredOutcome:
      "Deterministic initialization, bounded waiting, rollback and complete cleanup"
  }),

  capability({
    capabilityId: "CENTER_PLANET_OR_OPTIONAL_WORLD_PARTICIPANT",
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    requiredForRuntimeClosure: false,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_MIRRORLAND_WINDOW"], [
        "Optional participant lifecycle and restoration precedent"
      ], [
        "Mirrorland is not a planet and must not transfer identity"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_PLANET", "LAWS_CRYSTALS"], [
        "Separately governed center-world participant",
        "Shared-pass consumption without independent loop"
      ], [
        "Laws Main Compass identity and Audralia product semantics must not transfer"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_PLANET"], [
        "Independent center-planet renderer with failure and fallback states"
      ], [
        "Decorative Showroom identity and route semantics must not transfer"
      ]),
      assessment("ARCHCOIN_COMPASS", "ABSENT", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_CRYSTALS"], [
        "Architecture declares planet-owned identity and optional participant contracts"
      ], [
        "No product index.planet.js source occurrence resolved at the inspected ref"
      ])
    ],
    selectionStatus: "SUPPORTING_ONLY",
    governingBoundary:
      "OPTIONAL_CENTER_PARTICIPANT_MUST_REMAIN_SEPARATE_FROM_CARDINAL_IDENTITY_AND_CANNOT_ACQUIRE_NAVIGATION_AUTHORITY_BY_VISUAL_PRESENCE",
    requiredOutcome:
      "Optional participant may be admitted later without blocking the minimum prototype loop"
  }),

  capability({
    capabilityId: "ROUTE_ADMISSION_SELECTION_AND_NAVIGATION",
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER", "MAIN_HTML"], [
        "Preserved destination declarations, panels and navigation receipts"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER", "LAWS_HTML"], [
        "Controller admits declared DOM routes and does not invent destinations",
        "Explicit return action authority"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_CONTROLLER", "SHOWROOM_HTML"], [
        "Canonical four-by-sixteen route records and gateway"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_HTML"], [
        "Transaction-gated route commit",
        "Four-by-sixteen financial route declarations"
      ])
    ],
    governingBoundary:
      "HTML_DECLARES_ROUTES; CONTROLLER_ADMITS_AND_AUTHORIZES; INTERACTIONS_NEVER_NAVIGATES_DIRECTLY",
    requiredOutcome:
      "Synthetic prototype routes remain local and cannot silently inherit product destinations"
  }),

  capability({
    capabilityId: "RECEIPTS_VALIDATION_DETERMINISM_AND_IMMUTABILITY",
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CONTROLLER", "MAIN_CRYSTALS", "MAIN_MIRRORLAND_WINDOW", "MAIN_COSMOS"], [
        "Module receipts and lifecycle failure reporting"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER", "LAWS_COMPOSITOR", "LAWS_CRYSTALS", "LAWS_PLANET"], [
        "Explicit status ceilings and authority receipts",
        "Separated module contracts"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_CONTROLLER", "SHOWROOM_COMPOSITOR", "SHOWROOM_CRYSTALS", "SHOWROOM_INTERACTIONS"], [
        "Ready, failure, receipt and disposed event surfaces",
        "Bounded startup receipts"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_CRYSTALS", "ARCHCOIN_HTML"], [
        "Deep-freeze assertions",
        "Exact-key validation",
        "Revision receipts",
        "Stable serialization and deterministic hashes"
      ])
    ],
    governingBoundary:
      "EACH_AUTHORITY_PUBLISHES_IMMUTABLE_SCOPED_RECEIPTS; NO_RECEIPT_PROMOTES_PRODUCT_OR_VISUAL_STATUS",
    requiredOutcome:
      "Same admitted input produces the same semantic result and bounded receipt"
  }),

  capability({
    capabilityId: "RESPONSIVE_VIEWPORT_DPR_AND_PERFORMANCE_CONTROL",
    destinationOwner: "UNIVERSAL_COMPASS_COMPOSITOR",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CSS", "MAIN_COSMOS", "MAIN_CRYSTALS"], [
        "Adaptive density and quality",
        "Capped DPR and frame pacing",
        "Mobile atmosphere suspension"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_COMPOSITOR", "LAWS_CSS", "LAWS_COSMOS"], [
        "Mobile camera and DPR caps",
        "Responsive compact presentation",
        "Environmental suspension"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_COMPOSITOR", "SHOWROOM_CSS", "SHOWROOM_COSMOS"], [
        "Viewport-owned canvases",
        "Responsive stage",
        "Adaptive optional atmosphere"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_COMPOSITOR", "ARCHCOIN_CSS"], [
        "Normal/mobile camera presets",
        "DPR caps and low-power thresholds",
        "Compact layered field"
      ])
    ],
    governingBoundary:
      "COMPOSITOR_OWNS_VIEWPORT_AND_DPR; CSS_OWNS_RESPONSIVE_LAYOUT; OPTIONAL_ATMOSPHERE_CANNOT_BLOCK_CORE_RUNTIME",
    requiredOutcome:
      "Stable projection and interaction geometry across target viewport classes"
  }),

  capability({
    capabilityId: "OPTIONAL_PARTICIPANT_TRANSITION_AND_ROLLBACK",
    destinationOwner: "UNIVERSAL_COMPASS_CONTROLLER",
    requiredForRuntimeClosure: false,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER", "MAIN_MIRRORLAND_WINDOW"], [
        "Preserved Compass state through reveal, focus, withdrawal, timeout and failure",
        "Transition identifiers and completion events"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_PLANET"], [
        "Separately governed participant with explicit non-ownership"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_PLANET", "SHOWROOM_INTERACTIONS"], [
        "Independent participant failure states and semantic authority preservation"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER"], [
        "Capture, begin, complete and rollback participant transition records"
      ])
    ],
    selectionStatus: "SUPPORTING_ONLY",
    governingBoundary:
      "OPTIONAL_PARTICIPANT_STATE_MUST_BE_REVERSIBLE_AND_CANNOT_REWRITE_CORE_WORLD_OR_NAVIGATION_AUTHORITY",
    requiredOutcome:
      "Deferred capability remains compatible without blocking first execution"
  }),

  capability({
    capabilityId: "OPTIONAL_VISUAL_ATMOSPHERE_AND_BACKGROUND_RUNTIME",
    destinationOwner: "UNIVERSAL_COMPASS_CSS",
    requiredForRuntimeClosure: false,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_COSMOS", "MAIN_CSS"], [
        "Adaptive starfield and spacecraft atmosphere",
        "Reduced-motion and visibility suspension"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_COSMOS", "LAWS_CSS"], [
        "Independent failure and no functional authority"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_COSMOS", "SHOWROOM_CSS"], [
        "Natural irregular starfield, capped DPR, rollback and destruction"
      ]),
      assessment("ARCHCOIN_COMPASS", "SUPPORTING", ["ARCHCOIN_CSS"], [
        "Static atmosphere and compact stage presentation"
      ])
    ],
    selectionStatus: "OUT_OF_SCOPE_FOR_CORE_RUNTIME",
    governingBoundary:
      "ATMOSPHERE_IS_DECORATIVE_OPTIONAL_AND_CANNOT_BECOME_A_DEPENDENCY_OF_WORLD_CONTROLLER_OR_INTERACTION_EXECUTION",
    requiredOutcome:
      "Defer until the core seven-file loop executes"
  }),

  capability({
    capabilityId: "FOUR_BY_FOUR_BY_SIXTEEN_SEMANTIC_EXPANSION",
    destinationOwner: "UNIVERSAL_COMPASS_PLANET",
    requiredForRuntimeClosure: false,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "STRONG_CANDIDATE", ["MAIN_CONTROLLER", "MAIN_HTML", "MAIN_CRYSTALS"], [
        "Four cardinal groups and nineteen existing room stars",
        "Identity and semantic route preservation"
      ], [
        "Main contains a different child count and product-specific identities"
      ]),
      assessment("LAW_COMPASS", "STRONG_CANDIDATE", ["LAWS_CONTROLLER", "LAWS_HTML", "LAWS_CRYSTALS"], [
        "Exact four categories and sixteen laws",
        "Four children per category"
      ]),
      assessment("SHOWROOM_COMPASS", "STRONG_CANDIDATE", ["SHOWROOM_CONTROLLER", "SHOWROOM_HTML", "SHOWROOM_CRYSTALS"], [
        "Exact four cardinals and sixteen child routes",
        "Non-additive active population"
      ]),
      assessment("ARCHCOIN_COMPASS", "STRONG_CANDIDATE", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_HTML", "ARCHCOIN_CRYSTALS"], [
        "Exact four domains and sixteen room routes",
        "Planet-owned seat and membership boundary"
      ])
    ],
    selectionStatus: "SUPPORTING_ONLY",
    governingBoundary:
      "PLANET_OWNS_SYNTHETIC_IDENTITY_MEMBERSHIP_AND_SEATS; SOURCE_PRODUCT_IDENTITIES_AND_ROUTES_MUST_NOT_TRANSFER",
    requiredOutcome:
      "Defer expansion until the minimum runtime loop passes"
  }),

  capability({
    capabilityId: "SOURCE_SELECTION_AND_NONINTERFERENCE_GOVERNANCE",
    destinationOwner: "UNIVERSAL_COMPASS_HTML",
    requiredForRuntimeClosure: true,
    sourceAssessments: [
      assessment("MAIN_COMPASS", "SUPPORTING", ["MAIN_CONTROLLER", "MAIN_CRYSTALS"], [
        "Strong integrated execution precedents"
      ], [
        "No global template authority"
      ]),
      assessment("LAW_COMPASS", "SUPPORTING", ["LAWS_CONTROLLER", "LAWS_COMPOSITOR", "LAWS_CRYSTALS", "LAWS_INTERACTIONS"], [
        "Strong explicit authority separations"
      ], [
        "No global template authority"
      ]),
      assessment("SHOWROOM_COMPASS", "SUPPORTING", ["SHOWROOM_CONTROLLER", "SHOWROOM_COMPOSITOR", "SHOWROOM_CRYSTALS", "SHOWROOM_INTERACTIONS"], [
        "Strong orchestration and lifecycle isolation"
      ], [
        "No global template authority"
      ]),
      assessment("ARCHCOIN_COMPASS", "SUPPORTING", ["ARCHCOIN_CONTROLLER", "ARCHCOIN_COMPOSITOR", "ARCHCOIN_CRYSTALS", "ARCHCOIN_INTERACTIONS"], [
        "Strong transaction and confidence patterns"
      ], [
        "No global template authority",
        "Current internal version anchors require reconciliation"
      ])
    ],
    governingBoundary:
      "NO_GLOBAL_SOURCE_PRECEDENCE; SOURCE_CODE_MAY_INFORM_DESTINATION_IMPLEMENTATION_BUT_SOURCE_AUTHORITY_IDENTITY_ROUTES_AND_STATUS_DO_NOT_TRANSFER",
    requiredOutcome:
      "Every implementation decision is capability-scoped, evidence-backed, executed and recorded"
  })
]);

export const SOURCE_POOL_ABSENCE_RECORDS = deepFreeze([
  {
    schema: "DGB_UNIVERSAL_COMPASS_SOURCE_POOL_ABSENCE_v1",
    recordKind: "SOURCE_POOL_ABSENCE",
    recordAuthorityClassification: "DERIVED_AWARENESS_RECORD",
    facts: {
      absenceId: derived(
        "ARCHCOIN_PLANET_SOURCE_OCCURRENCE_ABSENT",
        "/products/archcoin/index.planet.js"
      ),
      family: verified("ARCHCOIN_COMPASS"),
      path: absent(
        "/products/archcoin/index.planet.js",
        "/products/archcoin/index.planet.js",
        "NO_REPOSITORY_FILE_OCCURRENCE_RESOLVED_AT_INSPECTED_REF"
      ),
      status: absent(
        "ABSENT",
        "/products/archcoin/index.planet.js",
        "NO_REPOSITORY_FILE_OCCURRENCE_RESOLVED_AT_INSPECTED_REF"
      ),
      interpretation: declared(
        "ARCHITECTURAL_DECLARATIONS_EXIST_BUT_A_PRODUCT_PLANET_IMPLEMENTATION_IS_NOT_SOURCE_EVIDENCE"
      ),
      prototypeDefectCreated: declared(false),
      recoveryRequired: declared(false)
    }
  }
]);

export const KNOWN_CONFLICT_AND_BOUNDARY_RECORDS = deepFreeze([
  {
    conflictId: "ARCHCOIN_CONTROLLER_VERSION_ANCHOR_DRIFT",
    evidencePosture: "VERIFIED",
    sourcePaths: [
      "/products/archcoin/index.controller.js",
      "/products/archcoin/index.interactions.js",
      "/products/archcoin/index.compositor.js",
      "/products/archcoin/index.css"
    ],
    finding:
      "Controller is version 8.0.0 while interactions, compositor and CSS headers still declare controller 7.0.0 compatibility anchors.",
    consequence:
      "ARCHCOIN behavior remains a source pool candidate but cannot be transplanted as one assumed-aligned package.",
    requiredTreatment:
      "RECONCILE_INTERFACES_CAPABILITY_BY_CAPABILITY_AND_EXECUTE"
  },
  {
    conflictId: "ARCHCOIN_CRYSTALS_VERSION_ANCHOR_DRIFT",
    evidencePosture: "VERIFIED",
    sourcePaths: [
      "/products/archcoin/index.crystals.js",
      "/products/archcoin/index.compositor.js",
      "/products/archcoin/index.css"
    ],
    finding:
      "Crystals is version 3.0.0 while compositor and CSS headers still declare crystals 2.0.0 compatibility anchors.",
    consequence:
      "Current product source cannot establish automatic compositor/crystals compatibility for the prototype.",
    requiredTreatment:
      "RECONCILE_PUBLIC_RECORDS_AND_EXECUTE"
  },
  {
    conflictId: "MAIN_COMBINED_RESPONSIBILITY_SOURCE",
    evidencePosture: "VERIFIED",
    sourcePaths: [
      "/assets/compass/compass.crystals.js"
    ],
    finding:
      "Main crystals currently combines rendering, projection, hit testing, pointer handling and gesture classification.",
    consequence:
      "Main provides proven behavior but not the destination authority decomposition.",
    requiredTreatment:
      "EXTRACT_BEHAVIOR_WITHOUT_COPYING_COMBINED_OWNERSHIP"
  },
  {
    conflictId: "SOURCE_STATUS_CLAIM_CEILINGS",
    evidencePosture: "VERIFIED",
    sourcePaths: [
      "/assets/compass/compass.controller.js",
      "/assets/compass/compass.crystals.js",
      "/laws/index.controller.js",
      "/laws/index.interactions.js",
      "/laws/index.compositor.js",
      "/laws/index.crystals.js",
      "/products/archcoin/index.controller.js",
      "/products/archcoin/index.compositor.js",
      "/products/archcoin/index.crystals.js",
      "/products/archcoin/index.css"
    ],
    finding:
      "Multiple source headers explicitly withhold runtime, visual, deployment or production claims.",
    consequence:
      "Source presence and source architecture do not establish destination execution or acceptance.",
    requiredTreatment:
      "EXECUTE_DESTINATION_FIXTURES_AND_BROWSER_ROUTE_SEPARATELY"
  },
  {
    conflictId: "PLANET_IDENTITY_TRANSFER_PROHIBITED",
    evidencePosture: "DECLARED",
    sourcePaths: [
      "/laws/index.planet.js",
      "/showroom/index.planet.js",
      "/assets/audralia/audralia.planet.js"
    ],
    finding:
      "Laws and Showroom planet implementations carry page-specific center identity and Audralia geometry relationships.",
    consequence:
      "Tools and lifecycle patterns may be reused; product identity, route semantics and source authority may not transfer.",
    requiredTreatment:
      "PRESERVE_SYNTHETIC_PROTOTYPE_IDENTITY_AND_PLANET_AUTHORITY"
  },
  {
    conflictId: "RETIRED_SUPPORT_FILE_RECOVERY_PROHIBITED",
    evidencePosture: "DECLARED",
    sourcePaths: [
      "/prototypes/universal-compass/"
    ],
    finding:
      "Previously abandoned support and bootstrap files are outside the controlling seven-file architecture.",
    consequence:
      "Their absence is not a defect and they are not members of the source pool.",
    requiredTreatment:
      "INTERNALIZE_OR_REIMPLEMENT_REQUIRED_BEHAVIOR_WITHIN_THE_SEVEN_AUTHORIZED_FILES"
  },
  {
    conflictId: "CROSS_PROJECT_SOURCE_INTRUSION_PROHIBITED",
    evidencePosture: "DECLARED",
    sourcePaths: [
      "/prototypes/universal-compass/"
    ],
    finding:
      "H-Earth and project-awareness runtime code are outside the Compass implementation source pool.",
    consequence:
      "Awareness may inspect and record; it may not become a Compass runtime dependency.",
    requiredTreatment:
      "NO_H_EARTH_SOURCE_AND_NO_AWARENESS_RUNTIME_IMPORT"
  }
]);

export const SOURCE_SELECTION_RULES = deepFreeze({
  globalSourcePrecedence: null,
  sourceFamilyTemplate: null,
  capabilitySelectionOrder: [
    "ACCEPTED_UNIVERSAL_AUTHORITY_BOUNDARIES",
    "EXECUTED_BEHAVIOR",
    "CROSS_COMPASS_COMPATIBILITY",
    "ACCESSIBILITY_AND_DEVICE_SAFETY",
    "SOURCE_SPECIFIC_CONVENIENCE"
  ],
  permittedReuse: [
    "TOOLS",
    "ALGORITHMS",
    "VALIDATION_PATTERNS",
    "INTERACTION_PATTERNS",
    "ACCESSIBILITY_PATTERNS",
    "PROJECTION_METHODS",
    "TRANSACTION_METHODS",
    "LIFECYCLE_AND_FAILURE_PATTERNS"
  ],
  prohibitedTransfer: [
    "SOURCE_PRODUCT_IDENTITY",
    "SOURCE_ROUTES",
    "SOURCE_BRANDING",
    "SOURCE_AUTHORITY",
    "SOURCE_VALIDATION_STATUS",
    "SOURCE_PRODUCTION_STATUS",
    "SOURCE_SPECIFIC_ASSUMPTIONS_WITHOUT_ADMISSION"
  ],
  decisionRequirement:
    "SOURCE_READ_THEN_CAPABILITY_DECISION_THEN_BOUNDED_IMPLEMENTATION_THEN_EXECUTION_THEN_RECEIPT"
});

export const PASS_2_HANDOFF = deepFreeze({
  schema: "DGB_UNIVERSAL_COMPASS_PASS_2_HANDOFF_v1",
  status: "READY_FOR_EXPLICIT_USER_AUTHORIZATION",
  primaryTarget: "/prototypes/universal-compass/index.planet.js",
  destinationOwner: "UNIVERSAL_COMPASS_PLANET",
  requiredCapabilities: [
    "WORLD_IDENTITY_MEMBERSHIP_AND_SNAPSHOT",
    "QUATERNION_VECTOR_AND_SETTLEMENT_MATHEMATICS",
    "CONSTELLATION_AND_CLUSTER_SPATIAL_RELATIONS",
    "RECEIPTS_VALIDATION_DETERMINISM_AND_IMMUTABILITY"
  ],
  requiredSourceReads: [
    "MAIN_CONTROLLER",
    "MAIN_CRYSTALS",
    "LAWS_CONTROLLER",
    "LAWS_PLANET",
    "LAWS_INTERACTIONS",
    "SHOWROOM_CONTROLLER",
    "SHOWROOM_GESTURE_SUPPORT",
    "SHOWROOM_PLANET",
    "ARCHCOIN_CONTROLLER",
    "ARCHCOIN_CRYSTALS",
    "ARCHCOIN_INTERACTIONS"
  ],
  proposedMutationScope: [
    "/prototypes/universal-compass/index.planet.js"
  ],
  mutationAuthority: "NOT_GRANTED_BY_THIS_ARTIFACT",
  requiresExplicitUserAuthorization: true,
  forbiddenInPass2: [
    "RESTORE_RETIRED_SUPPORT_FILES",
    "CREATE_EIGHTH_RUNTIME_FILE",
    "IMPORT_PROJECT_AWARENESS_INTO_RUNTIME",
    "IMPORT_H_EARTH_SOURCE",
    "MUTATE_SOURCE_COMPASSES",
    "PROMOTE_OR_ACCEPT_PROTOTYPE",
    "BEGIN_FOUR_BY_FOUR_BY_SIXTEEN_EXPANSION"
  ],
  passCriteria: [
    "NO_RETIRED_RUNTIME_IMPORTS",
    "IMMUTABLE_WORLD_IDENTITY_AND_MEMBERSHIP",
    "DETERMINISTIC_WORLD_SNAPSHOT",
    "READ_ONLY_NODE_AND_PRESENTATION_INTERFACES",
    "FINITE_NORMALIZED_QUATERNION_BEHAVIOR",
    "PLANET_AUTHORITY_BOUNDARY_PRESERVED",
    "MODULE_IMPORT_AND_FIXTURE_EXECUTION_PASS",
    "BOUNDED_ENGINEERING_RECEIPT_PRODUCED"
  ]
});

const MAP_BODY = {
  schema: "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v1",
  artifactId:
    "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_PASS_1_v1",
  classification:
    "COMPLETE_DERIVED_AWARENESS_ARTIFACT_NOT_IMPLEMENTATION_AUTHORITY",
  contractIdentity: PROJECT_AWARENESS_CONTRACT.id,
  mode: "READ_ONLY_SOURCE_SELECTION_SUPPORT",
  repositoryIdentity: REPOSITORY_IDENTITY,
  branchIdentity: BRANCH_IDENTITY,
  sourceInspectionAnchorCommit: SOURCE_INSPECTION_ANCHOR_COMMIT,
  sourceInspectionDate: SOURCE_INSPECTION_DATE,
  sourceDriftSinceAnchor:
    "NO_COMPASS_SOURCE_DRIFT_OBSERVED_IN_BRANCH_COMPARISON; AWARENESS_FILES_ONLY",
  passOneStatus: "COMPLETE",
  sourcePoolStatus: "FOUR_COMPASS_OPEN_POOL_MAPPED",
  engineeringSelectionComplete: false,
  prototypeModifiedByPassOne: false,
  sourceCompassesModifiedByPassOne: false,
  productAuthorityCreated: false,
  runtimeAuthorityCreated: false,
  awarenessOnlyArtifact: true,
  sourceFamilies: SOURCE_FAMILIES.slice(),
  destinationOwners: DESTINATION_OWNERS.slice(),
  sourceRecords: FOUR_SOURCE_POOL_RECORDS,
  destinationRecords: UNIVERSAL_COMPASS_DESTINATIONS,
  capabilityMatrix: FOUR_SOURCE_CAPABILITY_MATRIX,
  absenceRecords: SOURCE_POOL_ABSENCE_RECORDS,
  knownConflictAndBoundaryRecords:
    KNOWN_CONFLICT_AND_BOUNDARY_RECORDS,
  sourceSelectionRules: SOURCE_SELECTION_RULES,
  pass2Handoff: PASS_2_HANDOFF,
  permittedUses: [
    "BOUNDED_SOURCE_LOOKUP",
    "CAPABILITY_COMPARISON",
    "DESTINATION_OWNER_ROUTING",
    "CONFLICT_VISIBILITY",
    "PASS_2_INPUT_SELECTION",
    "AWARENESS_RECEIPT_GENERATION"
  ],
  prohibitedUses: [
    "AUTOMATIC_CODE_SELECTION",
    "AUTOMATIC_PRODUCT_MUTATION",
    "SOURCE_AUTHORITY_TRANSFER",
    "SOURCE_STATUS_TRANSFER",
    "PROTOTYPE_ACCEPTANCE",
    "RUNTIME_ACCEPTANCE",
    "VISUAL_ACCEPTANCE",
    "PRODUCTION_AUTHORIZATION"
  ]
};

const MAP_DIGEST = deterministicDigest(MAP_BODY);

export const UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP =
  deepFreeze({
    ...MAP_BODY,
    deterministicDigest: MAP_DIGEST
  });

function finding(id, pass, details) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

function valueOf(fact) {
  return fact && typeof fact === "object" && "value" in fact
    ? fact.value
    : fact;
}

export function validateUniversalCompassFourSourceCapabilityMap(
  candidate =
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP
) {
  const findings = [];

  findings.push(finding(
    "SCHEMA_EXACT",
    candidate.schema ===
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_v1",
    candidate.schema
  ));

  findings.push(finding(
    "READ_ONLY_MODE",
    candidate.mode === "READ_ONLY_SOURCE_SELECTION_SUPPORT" &&
      candidate.awarenessOnlyArtifact === true &&
      candidate.prototypeModifiedByPassOne === false &&
      candidate.sourceCompassesModifiedByPassOne === false,
    {
      mode: candidate.mode,
      awarenessOnlyArtifact: candidate.awarenessOnlyArtifact,
      prototypeModifiedByPassOne:
        candidate.prototypeModifiedByPassOne,
      sourceCompassesModifiedByPassOne:
        candidate.sourceCompassesModifiedByPassOne
    }
  ));

  const families = new Set(candidate.sourceFamilies);
  findings.push(finding(
    "EXACT_FOUR_SOURCE_FAMILIES",
    families.size === SOURCE_FAMILIES.length &&
      SOURCE_FAMILIES.every(family => families.has(family)),
    Array.from(families)
  ));

  const sourceIds = candidate.sourceRecords.map(record =>
    valueOf(record.facts.sourceId)
  );
  const sourcePaths = candidate.sourceRecords.map(record =>
    valueOf(record.facts.path)
  );
  const sourceBlobs = candidate.sourceRecords.map(record =>
    valueOf(record.facts.blobSha)
  );

  findings.push(finding(
    "SOURCE_IDS_UNIQUE",
    new Set(sourceIds).size === sourceIds.length,
    sourceIds
  ));

  findings.push(finding(
    "SOURCE_PATHS_UNIQUE",
    new Set(sourcePaths).size === sourcePaths.length,
    sourcePaths
  ));

  findings.push(finding(
    "SOURCE_BLOBS_VALID",
    sourceBlobs.every(blob =>
      /^[0-9a-f]{40}$/.test(String(blob || ""))
    ),
    sourceBlobs
  ));

  findings.push(finding(
    "SOURCE_FAMILY_ASSIGNMENTS_VALID",
    candidate.sourceRecords.every(record =>
      SOURCE_FAMILIES.includes(valueOf(record.facts.family))
    ),
    candidate.sourceRecords.map(record => ({
      sourceId: valueOf(record.facts.sourceId),
      family: valueOf(record.facts.family)
    }))
  ));

  const destinationIds = candidate.destinationRecords.map(record =>
    valueOf(record.facts.artifactId)
  );
  const destinationPaths = candidate.destinationRecords.map(record =>
    valueOf(record.facts.path)
  );

  findings.push(finding(
    "EXACT_SEVEN_DESTINATIONS",
    destinationIds.length === 7 &&
      new Set(destinationIds).size === 7 &&
      DESTINATION_OWNERS.every(owner =>
        destinationIds.includes(owner)
      ),
    destinationIds
  ));

  findings.push(finding(
    "DESTINATION_PATHS_BOUNDED",
    destinationPaths.every(path =>
      path.startsWith("/prototypes/universal-compass/")
    ),
    destinationPaths
  ));

  findings.push(finding(
    "CAPABILITY_IDS_UNIQUE",
    new Set(
      candidate.capabilityMatrix.map(
        record => record.capabilityId
      )
    ).size === candidate.capabilityMatrix.length,
    candidate.capabilityMatrix.map(record => record.capabilityId)
  ));

  findings.push(finding(
    "ALL_CAPABILITIES_HAVE_VALID_DESTINATION_OWNER",
    candidate.capabilityMatrix.every(record =>
      DESTINATION_OWNERS.includes(record.destinationOwner)
    ),
    candidate.capabilityMatrix.map(record => ({
      capabilityId: record.capabilityId,
      destinationOwner: record.destinationOwner
    }))
  ));

  findings.push(finding(
    "ALL_CAPABILITIES_MAP_ALL_FOUR_SOURCE_FAMILIES",
    candidate.capabilityMatrix.every(record => {
      const mapped = new Set(
        record.sourceAssessments.map(
          assessmentRecord => assessmentRecord.family
        )
      );
      return SOURCE_FAMILIES.every(family => mapped.has(family));
    }),
    candidate.capabilityMatrix.map(record => ({
      capabilityId: record.capabilityId,
      families: record.sourceAssessments.map(
        assessmentRecord => assessmentRecord.family
      )
    }))
  ));

  findings.push(finding(
    "SOURCE_ASSESSMENT_STATUSES_VALID",
    candidate.capabilityMatrix.every(record =>
      record.sourceAssessments.every(assessmentRecord =>
        SOURCE_ASSESSMENT_STATUSES.includes(
          assessmentRecord.status
        )
      )
    ),
    candidate.capabilityMatrix.map(record => ({
      capabilityId: record.capabilityId,
      statuses: record.sourceAssessments.map(
        assessmentRecord => assessmentRecord.status
      )
    }))
  ));

  findings.push(finding(
    "SELECTION_STATUSES_VALID",
    candidate.capabilityMatrix.every(record =>
      SELECTION_STATUSES.includes(record.selectionStatus)
    ),
    candidate.capabilityMatrix.map(record => ({
      capabilityId: record.capabilityId,
      selectionStatus: record.selectionStatus
    }))
  ));

  findings.push(finding(
    "NO_GLOBAL_SOURCE_PRECEDENCE",
    candidate.sourceSelectionRules.globalSourcePrecedence === null &&
      candidate.sourceSelectionRules.sourceFamilyTemplate === null,
    candidate.sourceSelectionRules
  ));

  findings.push(finding(
    "NO_H_EARTH_SOURCE_PATHS",
    sourcePaths.every(path =>
      !String(path).toLowerCase().includes("h-earth")
    ),
    sourcePaths.filter(path =>
      String(path).toLowerCase().includes("h-earth")
    )
  ));

  findings.push(finding(
    "NO_AWARENESS_RUNTIME_IMPORT",
    candidate.prohibitedUses.includes(
      "AUTOMATIC_PRODUCT_MUTATION"
    ) &&
      candidate.pass2Handoff.forbiddenInPass2.includes(
        "IMPORT_PROJECT_AWARENESS_INTO_RUNTIME"
      ),
    {
      prohibitedUses: candidate.prohibitedUses,
      pass2Forbidden:
        candidate.pass2Handoff.forbiddenInPass2
    }
  ));

  findings.push(finding(
    "RETIRED_SUPPORT_RESTORATION_PROHIBITED",
    candidate.pass2Handoff.forbiddenInPass2.includes(
      "RESTORE_RETIRED_SUPPORT_FILES"
    ) &&
      candidate.knownConflictAndBoundaryRecords.some(
        record =>
          record.conflictId ===
          "RETIRED_SUPPORT_FILE_RECOVERY_PROHIBITED"
      ),
    candidate.pass2Handoff.forbiddenInPass2
  ));

  findings.push(finding(
    "ARCHCOIN_PLANET_ABSENCE_RECORDED_WITHOUT_DEFECT_UPGRADE",
    candidate.absenceRecords.some(record =>
      valueOf(record.facts.absenceId) ===
        "ARCHCOIN_PLANET_SOURCE_OCCURRENCE_ABSENT" &&
      valueOf(record.facts.prototypeDefectCreated) === false &&
      valueOf(record.facts.recoveryRequired) === false
    ),
    candidate.absenceRecords
  ));

  findings.push(finding(
    "KNOWN_VERSION_DRIFT_RECORDED",
    [
      "ARCHCOIN_CONTROLLER_VERSION_ANCHOR_DRIFT",
      "ARCHCOIN_CRYSTALS_VERSION_ANCHOR_DRIFT"
    ].every(conflictId =>
      candidate.knownConflictAndBoundaryRecords.some(
        record => record.conflictId === conflictId
      )
    ),
    candidate.knownConflictAndBoundaryRecords.map(
      record => record.conflictId
    )
  ));

  findings.push(finding(
    "PASS_2_SCOPE_BOUNDED_TO_PLANET",
    candidate.pass2Handoff.primaryTarget ===
      "/prototypes/universal-compass/index.planet.js" &&
      candidate.pass2Handoff.proposedMutationScope.length === 1 &&
      candidate.pass2Handoff.proposedMutationScope[0] ===
        "/prototypes/universal-compass/index.planet.js" &&
      candidate.pass2Handoff.mutationAuthority ===
        "NOT_GRANTED_BY_THIS_ARTIFACT",
    candidate.pass2Handoff
  ));

  const expectedDigest = deterministicDigest({
    ...candidate,
    deterministicDigest: undefined
  });
  const digestBody = { ...candidate };
  delete digestBody.deterministicDigest;
  const recomputedDigest = deterministicDigest(digestBody);

  findings.push(finding(
    "DETERMINISTIC_DIGEST_MATCH",
    candidate.deterministicDigest === recomputedDigest &&
      expectedDigest !== "",
    {
      recorded: candidate.deterministicDigest,
      recomputed: recomputedDigest
    }
  ));

  const failed = findings.filter(record => !record.pass);

  return deepFreeze({
    schema:
      "DGB_UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT_v1",
    artifactId: candidate.artifactId,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: {
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      sourceRecordCount: candidate.sourceRecords.length,
      destinationCount: candidate.destinationRecords.length,
      capabilityCount: candidate.capabilityMatrix.length,
      sourceFamilyCount: candidate.sourceFamilies.length
    },
    deterministicDigest: candidate.deterministicDigest,
    findings,
    productAuthority: false,
    implementationAuthority: false,
    mutationAuthority: false,
    prototypeModified: false
  });
}

export const FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT =
  validateUniversalCompassFourSourceCapabilityMap();

if (
  FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT.status !==
  "PASS"
) {
  const error = new Error(
    "UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_FAILED"
  );
  error.receipt =
    FOUR_SOURCE_CAPABILITY_MAP_VALIDATION_RECEIPT;
  throw error;
}

export function runUniversalCompassFourSourceCapabilityMapValidation() {
  return validateUniversalCompassFourSourceCapabilityMap(
    UNIVERSAL_COMPASS_FOUR_SOURCE_CAPABILITY_MAP
  );
}
