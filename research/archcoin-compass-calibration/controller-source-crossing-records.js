/*
 * Universal Compass controller source-crossing records.
 * Candidate research evidence only.
 */

const SOURCE = Object.freeze({
  MAIN: Object.freeze({
    family: "MAIN",
    path: "/assets/compass/compass.controller.js",
    blob: "259e0d16b55c3986fec57db37fc057861483344a"
  }),
  LAW: Object.freeze({
    family: "LAW",
    path: "/laws/index.controller.js",
    blob: "5711c261d7fac96a3622ef80e98dacca845f7d96"
  }),
  SHOWROOM: Object.freeze({
    family: "SHOWROOM",
    path: "/showroom/index.controller.js",
    blob: "460d9a7beb323f62012683fbe6f27e3c98462705"
  }),
  ARCHCOIN: Object.freeze({
    family: "ARCHCOIN",
    path: "/products/archcoin/index.controller.js",
    blob: "8d60a21863012d4a5ec8b6224cee845a2fd7178d"
  })
});

function record(
  universalMechanism,
  sourceKeys,
  sourceSymbols,
  preservedBehavior,
  excludedCoupling,
  normalizedForm,
  parityTests
) {
  return Object.freeze({
    universalMechanism,
    sources: Object.freeze(
      sourceKeys.map(key => SOURCE[key])
    ),
    sourceSymbols: Object.freeze(sourceSymbols),
    preservedBehavior: Object.freeze(preservedBehavior),
    excludedCoupling: Object.freeze(excludedCoupling),
    normalizedForm,
    parityTests: Object.freeze(parityTests)
  });
}

export const CONTROLLER_SOURCE_CROSSING_RECORDS =
  Object.freeze([
    record(
      "CANONICAL_STATE_AND_FRAME_PUBLICATION",
      ["MAIN", "LAW"],
      [
        "state",
        "clusterFrameSnapshot",
        "getFrameState",
        "createFrameState",
        "publishFrame"
      ],
      [
        "separate constellation and per-cluster state",
        "primary distinct from selection",
        "deeply immutable revisioned publication"
      ],
      [
        "DOM datasets",
        "panel content",
        "page route registries"
      ],
      "one immutable universal controller frame with compatibility mirrors",
      [
        "CANONICAL_INITIAL_STATE_AND_DEEP_IMMUTABILITY",
        "REVISIONED_SUBSCRIPTION_PUBLICATION"
      ]
    ),

    record(
      "CONSTELLATION_ORIENTATION_TRANSACTION",
      ["LAW", "ARCHCOIN"],
      [
        "beginOrbitGesture",
        "requestOrbitPreview",
        "requestOrbitCommit",
        "requestOrbitCancel",
        "validateOrbitPreviewPayload"
      ],
      [
        "exact quaternion and primary payload",
        "accepted preview required before commit",
        "gesture-origin rollback",
        "revisioned commitment"
      ],
      [
        "Euler input",
        "drag deltas",
        "gesture-axis logic",
        "controller primary inference"
      ],
      "beginGesture -> exact preview -> commit or origin cancellation",
      [
        "STRICT_CONSTELLATION_PREVIEW_AND_COMMIT",
        "COMMIT_REQUIRES_ACCEPTED_PREVIEW",
        "UNKNOWN_PREVIEW_FIELD_REJECTED",
        "CROSS_PRESENTATION_PRIMARY_REJECTED",
        "STALE_WORLD_BASIS_REJECTED",
        "CANCEL_RESTORES_GESTURE_ORIGIN"
      ]
    ),

    record(
      "INDEPENDENT_CLUSTER_ORIENTATION_TRANSACTION",
      ["MAIN", "SHOWROOM"],
      [
        "createClusterState",
        "beginClusterGesture",
        "requestClusterPreview",
        "requestClusterCommit",
        "requestClusterCancel",
        "validateClusterPreviewPayload"
      ],
      [
        "one orientation per cardinal cluster",
        "cluster primary distinct from selected member",
        "foreign member rejection",
        "commit does not select or navigate"
      ],
      [
        "room content",
        "route identity",
        "cluster geometry",
        "pointer interpretation"
      ],
      "cluster records keyed by cardinal with committed-orientation custody",
      [
        "CLUSTER_PREVIEW_REJECTS_FOREIGN_MEMBER",
        "CLUSTER_ORIENTATION_PERSISTS_INDEPENDENTLY"
      ]
    ),

    record(
      "DIRECT_CARDINAL_ACTIVATION_AND_CLUSTER_ENTRY",
      ["MAIN", "SHOWROOM", "ARCHCOIN"],
      [
        "requestCardinalSelection",
        "requestOrbitFocus",
        "canonicalConstellationOrientation",
        "applyState"
      ],
      [
        "direct object activation",
        "active preview cancellation",
        "selection clearing",
        "single active cluster entry"
      ],
      [
        "top presentation buttons",
        "coin identity",
        "panel rendering",
        "controller-owned world orientation"
      ],
      "activateCardinal(cardinalId) opens one cluster from scene identity",
      [
        "DIRECT_CARDINAL_ACTIVATION_OPENS_CLUSTER",
        "OPEN_CLUSTER_COMPATIBILITY_USES_CURRENT_OR_FIRST_CARDINAL"
      ]
    ),

    record(
      "ACTIVE_CLUSTER_MEMBER_SELECTION",
      ["MAIN", "LAW"],
      [
        "requestRoomSelection",
        "requestLawSelection"
      ],
      [
        "active-cluster membership validation",
        "gesture cancellation before selection",
        "selection without immediate navigation"
      ],
      [
        "law identity",
        "room prose",
        "panel descent",
        "route execution"
      ],
      "select(nodeId) admits only the active presentation and cluster",
      [
        "MEMBER_SELECTION_REQUIRES_ACTIVE_CLUSTER",
        "MEMBER_SELECTION_CANCELS_ACTIVE_CLUSTER_PREVIEW"
      ]
    ),

    record(
      "RETURN_TO_ORBIT",
      ["MAIN", "ARCHCOIN"],
      ["requestReturnToOrbit"],
      [
        "member selection cleared",
        "active cardinal retained",
        "cluster orientation and primary retained"
      ],
      [
        "viewport scrolling",
        "panel reconstruction",
        "Home control state"
      ],
      "clear member selection while remaining in the active cluster",
      ["RETURN_TO_ORBIT_CLEARS_SELECTION_ONLY"]
    ),

    record(
      "RETURN_TO_CONSTELLATION",
      ["MAIN", "SHOWROOM"],
      ["requestReturnToConstellation"],
      [
        "cluster gesture cancellation",
        "last cardinal preservation",
        "cluster state retention",
        "constellation restoration"
      ],
      [
        "scene scrolling",
        "page guidance",
        "source labels"
      ],
      "clear active selection while preserving cluster records",
      ["RETURN_TO_CONSTELLATION_PRESERVES_CLUSTER_STATE"]
    ),

    record(
      "HELD_BOOLEAN_OVERLAY",
      ["MAIN", "LAW"],
      [
        "cancelAllGestures",
        "fail",
        "enterHeldState",
        "createHeldState"
      ],
      [
        "active previews cancelled before hold",
        "accepted orientation preserved",
        "interaction locked",
        "bounded reason published"
      ],
      [
        "HELD presentation",
        "terminal held state",
        "renderer failure event names"
      ],
      "enterHeld/leaveHeld overlay preserves current presentation",
      [
        "HELD_IS_BOOLEAN_OVERLAY",
        "HOLD_CANCELS_ACTIVE_GESTURE_BEFORE_LOCK",
        "HELD_BLOCKS_NEW_CONTROLLER_TRANSACTIONS",
        "LEAVE_HELD_RESTORES_FUNCTION",
        "HELD_PRESENTATION_REMAINS_NONCANONICAL"
      ]
    ),

    record(
      "TRANSACTION_PHASE_EVALUATION_AND_REVISION",
      ["ARCHCOIN"],
      [
        "TRANSACTION_PHASES",
        "TRANSACTION_PHASE_TRANSITIONS",
        "evaluateTransactionPhaseTransition",
        "requestTransactionPhaseTransition",
        "createTransactionReceipt"
      ],
      [
        "pure evaluation before mutation",
        "stale revision rejection",
        "illegal transition rejection",
        "immutable receipts"
      ],
      [
        "financial ALLOCATION phase",
        "ARCHCOIN identities",
        "inactive source runtime claim"
      ],
      "seven-phase universal evaluator using existing contract phases",
      [
        "TRANSACTION_EVALUATOR_ACCEPTS_LEGAL_REVISIONED_STEP",
        "TRANSACTION_EVALUATOR_REJECTS_ILLEGAL_DIRECT_ROUTE_COMMIT",
        "TRANSACTION_EVALUATOR_REJECTS_STALE_REVISION",
        "HOME_PARTICIPANT_TRANSACTION_EXCLUSION",
        "TRANSACTION_REQUEST_APPLIES_ACCEPTED_RECEIPT"
      ]
    ),

    record(
      "NAVIGATION_AUTHORIZATION",
      ["LAW", "SHOWROOM", "ARCHCOIN"],
      [
        "requestEnterSelection",
        "lawRecordByRoute",
        "validateRouteGatewayContract"
      ],
      [
        "selected identity required",
        "route authorization follows selection",
        "external effects remain separate"
      ],
      [
        "location.assign",
        "route DOM registry",
        "page navigation side effects"
      ],
      "authorizeNavigation returns intent; navigate delegates to adapters",
      [
        "NAVIGATION_AUTHORIZATION_REQUIRES_SELECTION",
        "NAVIGATION_INTENT_PRECEDES_ADAPTER_EXECUTION"
      ]
    ),

    record(
      "OPTIONAL_PARTICIPANT_SNAPSHOT_AND_ROLLBACK",
      ["MAIN", "SHOWROOM"],
      [
        "preserveCompassState",
        "applyPreservedState",
        "normalizeRestoredState",
        "restorePreservedCompassState",
        "createCompassState"
      ],
      [
        "complete accepted-state snapshot",
        "per-cluster and selection restoration",
        "participant remains nonsettling"
      ],
      [
        "Mirrorland identity",
        "window events",
        "timeouts",
        "center navigation authority"
      ],
      "capture, begin, complete, and rollback by participant transition id",
      [
        "INTERRUPTION_SNAPSHOT_IS_COMPLETE_AND_IMMUTABLE",
        "OPTIONAL_PARTICIPANT_ROLLBACK_RESTORES_ACCEPTED_STATE",
        "OPTIONAL_PARTICIPANT_TRANSITION_ID_ENFORCED"
      ]
    ),

    record(
      "INTEGRATED_CONTROLLER_CORRIDOR",
      ["MAIN", "LAW", "SHOWROOM", "ARCHCOIN"],
      [
        "getFrameState",
        "runControllerSelfTest",
        "validatePresentationContract",
        "validateTransactionPhaseContract"
      ],
      [
        "complete constellation, cluster, selection, return, hold, navigation, and recovery path",
        "strict authority separation"
      ],
      [
        "source identities",
        "source DOM",
        "source page presentation",
        "source route execution"
      ],
      "one universally integratable controller consumed through the existing API",
      ["INTEGRATED_CONTROLLER_PUBLIC_CORRIDOR"]
    )
  ]);

export const CONTROLLER_SOURCE_CROSSING_SUMMARY =
  Object.freeze({
    schema:
      "UNIVERSAL_COMPASS_CONTROLLER_SOURCE_CROSSING_SUMMARY_v1",
    targetFile:
      "/assets/compass-model/compass.controller.js",
    sourceFamilyCount: 4,
    mechanismCount:
      CONTROLLER_SOURCE_CROSSING_RECORDS.length,
    sourceCodeDuplicated: false,
    pageIdentityExcluded: true,
    sourceCompassMutation: false,
    implementationAuthority:
      "CONTROLLER_LANE_ONLY",
    productionAuthority: false
  });
