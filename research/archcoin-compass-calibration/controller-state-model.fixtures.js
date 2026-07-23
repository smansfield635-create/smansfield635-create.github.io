import {
  PRESENTATION,
  TRANSACTION_PHASE
} from "../../assets/compass-model/compass.contracts.js";
import { createCompassController } from "../../assets/compass-model/compass.controller.js";

const definitions = Object.freeze([
  Object.freeze({
    id: "north",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "north",
    routeKey: "north-route",
    semantic: Object.freeze({ label: "North" })
  }),
  Object.freeze({
    id: "east",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "east",
    routeKey: "east-route",
    semantic: Object.freeze({ label: "East" })
  }),
  Object.freeze({
    id: "south",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "south",
    routeKey: "south-route",
    semantic: Object.freeze({ label: "South" })
  }),
  Object.freeze({
    id: "west",
    kind: "cardinal",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "west",
    routeKey: "west-route",
    semantic: Object.freeze({ label: "West" })
  }),
  Object.freeze({
    id: "north-1",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    domain: "north",
    routeKey: "north-1-route",
    semantic: Object.freeze({
      label: "North 1",
      cardinalId: "north"
    })
  }),
  Object.freeze({
    id: "north-2",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    domain: "north",
    routeKey: "north-2-route",
    semantic: Object.freeze({
      label: "North 2",
      cardinalId: "north"
    })
  }),
  Object.freeze({
    id: "east-1",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    domain: "east",
    routeKey: "east-1-route",
    semantic: Object.freeze({
      label: "East 1",
      cardinalId: "east"
    })
  }),
  Object.freeze({
    id: "east-2",
    kind: "member",
    presentation: PRESENTATION.CLUSTER,
    domain: "east",
    routeKey: "east-2-route",
    semantic: Object.freeze({
      label: "East 2",
      cardinalId: "east"
    })
  })
]);

const byId = new Map(
  definitions.map(record => [record.id, record])
);

const nodes = Object.freeze({
  all: () => Object.freeze(definitions.slice()),
  get: id => byId.get(id) || null,
  has: id => byId.has(id),
  forPresentation: presentation =>
    Object.freeze(
      definitions.filter(
        record => record.presentation === presentation
      )
    )
});

const navigationCalls = [];
const adapters = Object.freeze({
  resolveRoute: key =>
    typeof key === "string" && key.length
      ? `#${key}`
      : null,
  navigate: route => {
    navigationCalls.push(route);
    return Object.freeze({
      accepted: true,
      route
    });
  }
});

let worldBasisRevision = 7;
const world = Object.freeze({
  getWorldBasisRevision: () => worldBasisRevision
});

const profile = Object.freeze({
  id: "CONTROLLER_SOURCE_DERIVED_FIXTURE_PROFILE"
});

function createController() {
  return createCompassController({
    profile,
    adapters,
    nodes,
    world
  });
}

function expectCode(operation, expectedCode) {
  try {
    operation();
  } catch (error) {
    if (error?.code === expectedCode) {
      return;
    }
    throw error;
  }
  throw new Error(`EXPECTED_${expectedCode}`);
}

function assert(condition, code) {
  if (!condition) {
    throw new Error(code);
  }
}

const results = [];

function test(name, operation) {
  operation();
  results.push(
    Object.freeze({
      test: name,
      status: "PASS"
    })
  );
}

test("CANONICAL_INITIAL_STATE_AND_DEEP_IMMUTABILITY", () => {
  const controller = createController();
  const state = controller.getState();

  assert(
    state.presentation === PRESENTATION.CONSTELLATION,
    "INITIAL_PRESENTATION_INVALID"
  );
  assert(state.held === false, "INITIAL_HELD_INVALID");
  assert(
    state.transaction.phase === TRANSACTION_PHASE.ORIENTATION,
    "INITIAL_TRANSACTION_PHASE_INVALID"
  );
  assert(
    Object.isFrozen(state) &&
      Object.isFrozen(state.constellation) &&
      Object.isFrozen(state.transaction),
    "INITIAL_STATE_NOT_DEEPLY_FROZEN"
  );
});

test("REVISIONED_SUBSCRIPTION_PUBLICATION", () => {
  const controller = createController();
  const publications = [];
  const unsubscribe = controller.subscribe(
    state => publications.push(state)
  );

  controller.select("north");
  unsubscribe();
  controller.select("east");

  assert(
    publications.length === 1 &&
      publications[0].revision === 1 &&
      publications[0].selectedId === "north",
    "SUBSCRIPTION_PUBLICATION_INVALID"
  );
});

test("STRICT_CONSTELLATION_PREVIEW_AND_COMMIT", () => {
  const controller = createController();

  controller.beginGesture();
  controller.preview({
    quaternion: [0, 1, 0, 1],
    primaryId: "north",
    worldBasisRevision
  });
  controller.commit();

  const state = controller.getState();
  assert(
    state.constellation.primaryId === "north" &&
      state.orientationPhase === "COMMITTED" &&
      state.constellation.revision === 1,
    "CONSTELLATION_COMMIT_INVALID"
  );
});

test("COMMIT_REQUIRES_ACCEPTED_PREVIEW", () => {
  const controller = createController();
  controller.beginGesture();

  expectCode(
    () => controller.commit(),
    "COMPASS_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
  );
});

test("UNKNOWN_PREVIEW_FIELD_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();

  expectCode(
    () =>
      controller.preview({
        quaternion: [0, 0, 0, 1],
        primaryId: "north",
        worldBasisRevision,
        dx: 10
      }),
    "COMPASS_CONTROLLER_PREVIEW_KEYS_INVALID"
  );
});

test("CROSS_PRESENTATION_PRIMARY_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();

  expectCode(
    () =>
      controller.preview({
        quaternion: [0, 0, 0, 1],
        primaryId: "north-1",
        worldBasisRevision
      }),
    "COMPASS_PRIMARY_PRESENTATION_MISMATCH"
  );
});

test("STALE_WORLD_BASIS_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();
  worldBasisRevision = 8;

  try {
    expectCode(
      () =>
        controller.preview({
          quaternion: [0, 0, 0, 1],
          primaryId: "north",
          worldBasisRevision: 7
        }),
      "COMPASS_WORLD_BASIS_REVISION_STALE"
    );
  } finally {
    worldBasisRevision = 7;
  }
});

test("CANCEL_RESTORES_GESTURE_ORIGIN", () => {
  const controller = createController();
  const origin = controller.getState().orientation;

  controller.beginGesture();
  controller.preview({
    quaternion: [0, 1, 0, 1],
    primaryId: "north",
    worldBasisRevision
  });
  controller.cancel("fixture");

  const state = controller.getState();
  assert(
    JSON.stringify(state.orientation) === JSON.stringify(origin) &&
      state.orientationPhase === "CANCELLED" &&
      state.constellation.gestureActive === false,
    "CONSTELLATION_CANCEL_INVALID"
  );
});

test("DIRECT_CARDINAL_ACTIVATION_OPENS_CLUSTER", () => {
  const controller = createController();
  controller.activateCardinal("north");

  const state = controller.getState();
  assert(
    state.presentation === PRESENTATION.CLUSTER &&
      state.activeCardinalId === "north" &&
      state.clusters.north.memberIds.length === 2,
    "DIRECT_CARDINAL_ACTIVATION_INVALID"
  );
});

test("OPEN_CLUSTER_COMPATIBILITY_USES_CURRENT_OR_FIRST_CARDINAL", () => {
  const controller = createController();
  controller.openCluster();

  assert(
    controller.getState().activeCardinalId === "north",
    "OPEN_CLUSTER_COMPATIBILITY_INVALID"
  );
});

test("CLUSTER_PREVIEW_REJECTS_FOREIGN_MEMBER", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.beginGesture();

  expectCode(
    () =>
      controller.preview({
        quaternion: [0, 0, 0, 1],
        primaryId: "east-1",
        worldBasisRevision
      }),
    "COMPASS_PRIMARY_OUTSIDE_ACTIVE_CLUSTER"
  );
});

test("CLUSTER_ORIENTATION_PERSISTS_INDEPENDENTLY", () => {
  const controller = createController();
  controller.activateCardinal("north");

  controller.beginGesture();
  controller.preview({
    quaternion: [1, 0, 0, 1],
    primaryId: "north-2",
    worldBasisRevision
  });
  controller.commit();

  const committed = controller.getState().clusters.north;
  controller.returnToConstellation();
  controller.activateCardinal("east");
  controller.returnToConstellation();
  controller.activateCardinal("north");

  const restored = controller.getState().clusters.north;
  assert(
    restored.primaryId === "north-2" &&
      restored.revision === committed.revision &&
      JSON.stringify(restored.committedQuaternion) ===
        JSON.stringify(committed.committedQuaternion),
    "CLUSTER_ORIENTATION_NOT_PRESERVED"
  );
});

test("MEMBER_SELECTION_REQUIRES_ACTIVE_CLUSTER", () => {
  const controller = createController();
  controller.activateCardinal("north");

  expectCode(
    () => controller.select("east-1"),
    "COMPASS_SELECTION_OUTSIDE_ACTIVE_CLUSTER"
  );
});

test("MEMBER_SELECTION_CANCELS_ACTIVE_CLUSTER_PREVIEW", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.beginGesture();
  controller.preview({
    quaternion: [1, 0, 0, 1],
    primaryId: "north-2",
    worldBasisRevision
  });
  controller.select("north-1");

  const state = controller.getState();
  assert(
    state.selectedId === "north-1" &&
      state.clusters.north.gestureActive === false &&
      state.clusters.north.phase === "CANCELLED",
    "SELECTION_DID_NOT_CANCEL_CLUSTER_PREVIEW"
  );
});

test("RETURN_TO_ORBIT_CLEARS_SELECTION_ONLY", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.select("north-1");
  const before = controller.getState().clusters.north;

  controller.returnToOrbit();
  const state = controller.getState();

  assert(
    state.presentation === PRESENTATION.CLUSTER &&
      state.activeCardinalId === "north" &&
      state.selectedId === "" &&
      state.clusters.north === before,
    "RETURN_TO_ORBIT_INVALID"
  );
});

test("RETURN_TO_CONSTELLATION_PRESERVES_CLUSTER_STATE", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.beginGesture();
  controller.preview({
    quaternion: [1, 0, 0, 1],
    primaryId: "north-2",
    worldBasisRevision
  });
  controller.commit();

  const cluster = controller.getState().clusters.north;
  controller.returnToConstellation();

  const state = controller.getState();
  assert(
    state.presentation === PRESENTATION.CONSTELLATION &&
      state.activeCardinalId === "" &&
      state.lastActiveCardinalId === "north" &&
      state.clusters.north === cluster,
    "RETURN_TO_CONSTELLATION_INVALID"
  );
});

test("HELD_IS_BOOLEAN_OVERLAY", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.select("north-1");
  const before = controller.getState();

  controller.enterHeld("fixture");
  const held = controller.getState();

  assert(
    held.held === true &&
      held.presentation === before.presentation &&
      held.activeCardinalId === before.activeCardinalId &&
      held.selectedId === before.selectedId,
    "HELD_OVERLAY_INVALID"
  );
});

test("HOLD_CANCELS_ACTIVE_GESTURE_BEFORE_LOCK", () => {
  const controller = createController();
  controller.beginGesture();
  controller.preview({
    quaternion: [0, 1, 0, 1],
    primaryId: "north",
    worldBasisRevision
  });
  controller.enterHeld("fixture");

  const state = controller.getState();
  assert(
    state.held === true &&
      state.constellation.gestureActive === false &&
      state.orientationPhase === "CANCELLED",
    "HOLD_ACTIVE_GESTURE_CANCELLATION_INVALID"
  );
});

test("HELD_BLOCKS_NEW_CONTROLLER_TRANSACTIONS", () => {
  const controller = createController();
  controller.enterHeld("fixture");

  expectCode(
    () => controller.beginGesture(),
    "COMPASS_HELD"
  );
  expectCode(
    () => controller.openCluster(),
    "COMPASS_HELD_PRESENTATION_LOCK"
  );
  expectCode(
    () => controller.select("north"),
    "COMPASS_HELD"
  );
});

test("LEAVE_HELD_RESTORES_FUNCTION", () => {
  const controller = createController();
  controller.enterHeld("fixture");
  controller.leaveHeld();
  controller.activateCardinal("north");

  assert(
    controller.getState().presentation === PRESENTATION.CLUSTER,
    "LEAVE_HELD_RECOVERY_INVALID"
  );
});

test("HELD_PRESENTATION_REMAINS_NONCANONICAL", () => {
  const controller = createController();

  expectCode(
    () => controller.setPresentation(PRESENTATION.HELD),
    "COMPASS_CANONICAL_PRESENTATION_REQUIRED"
  );
});

test("TRANSACTION_EVALUATOR_ACCEPTS_LEGAL_REVISIONED_STEP", () => {
  const controller = createController();
  const receipt = controller.evaluateTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.SELECTION,
    transactionRevision: 0,
    revisionEvent: "NEW_TRANSACTION",
    targetType: "CARDINAL",
    targetId: "north"
  });

  assert(
    receipt.accepted === true &&
      receipt.resultingPhase === TRANSACTION_PHASE.SELECTION &&
      receipt.transactionRevision === 1 &&
      receipt.revisionAdvanced === true,
    "TRANSACTION_LEGAL_STEP_INVALID"
  );
});

test("TRANSACTION_EVALUATOR_REJECTS_ILLEGAL_DIRECT_ROUTE_COMMIT", () => {
  const controller = createController();
  const receipt = controller.evaluateTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.ROUTE_COMMIT,
    transactionRevision: 0,
    revisionEvent: "ROUTE_COMMIT",
    targetType: "MEMBER",
    targetId: "north-1"
  });

  assert(
    receipt.accepted === false &&
      receipt.rejectionReason ===
        "COMPASS_TRANSACTION_PHASE_TRANSITION_ILLEGAL",
    "TRANSACTION_ILLEGAL_PATH_ACCEPTED"
  );
});

test("TRANSACTION_EVALUATOR_REJECTS_STALE_REVISION", () => {
  const controller = createController();

  controller.requestTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.SELECTION,
    transactionRevision: 0,
    revisionEvent: "NEW_TRANSACTION",
    targetType: "CARDINAL",
    targetId: "north"
  });

  const receipt = controller.evaluateTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.PREVIEW,
    transactionRevision: 0,
    revisionEvent: "PREVIEW_OPENED",
    targetType: "CARDINAL",
    targetId: "north"
  });

  assert(
    receipt.accepted === false &&
      receipt.rejectionReason ===
        "COMPASS_TRANSACTION_REVISION_STALE",
    "TRANSACTION_STALE_REVISION_ACCEPTED"
  );
});

test("HOME_PARTICIPANT_TRANSACTION_EXCLUSION", () => {
  const controller = createController();
  const receipt = controller.evaluateTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.SELECTION,
    transactionRevision: 0,
    revisionEvent: "NEW_TRANSACTION",
    targetType: "HOME_COMPASS",
    targetId: "home"
  });

  assert(
    receipt.accepted === false &&
      receipt.rejectionReason ===
        "COMPASS_HOME_PARTICIPANT_TRANSACTION_FORBIDDEN",
    "HOME_PARTICIPANT_TRANSACTION_ACCEPTED"
  );
});

test("TRANSACTION_REQUEST_APPLIES_ACCEPTED_RECEIPT", () => {
  const controller = createController();
  const receipt = controller.requestTransactionTransition({
    requestedPhase: TRANSACTION_PHASE.SELECTION,
    transactionRevision: 0,
    revisionEvent: "NEW_TRANSACTION",
    targetType: "CARDINAL",
    targetId: "north"
  });

  const state = controller.getState();
  assert(
    receipt.accepted === true &&
      state.transaction.phase === TRANSACTION_PHASE.SELECTION &&
      state.transaction.revision === 1 &&
      state.transaction.lastReceipt === receipt,
    "TRANSACTION_REQUEST_NOT_APPLIED"
  );
});

test("NAVIGATION_AUTHORIZATION_REQUIRES_SELECTION", () => {
  const controller = createController();

  expectCode(
    () =>
      controller.authorizeNavigation({
        routeKey: "north-route",
        transactionRevision: 0
      }),
    "COMPASS_NAVIGATION_SELECTION_REQUIRED"
  );
});

test("NAVIGATION_INTENT_PRECEDES_ADAPTER_EXECUTION", () => {
  navigationCalls.length = 0;
  const controller = createController();
  controller.select("north");

  const intent = controller.authorizeNavigation({
    routeKey: "north-route",
    transactionRevision:
      controller.getState().transaction.revision
  });

  assert(
    intent.authorized === true &&
      navigationCalls.length === 0 &&
      controller.getState().navigationIntent === intent,
    "NAVIGATION_INTENT_BOUNDARY_INVALID"
  );

  const adapterReceipt = controller.navigate("north-route");
  assert(
    adapterReceipt.route === "#north-route" &&
      navigationCalls.length === 1,
    "NAVIGATION_ADAPTER_EXECUTION_INVALID"
  );
});

test("INTERRUPTION_SNAPSHOT_IS_COMPLETE_AND_IMMUTABLE", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.select("north-1");

  const snapshot =
    controller.captureInterruptionSnapshot("center");

  assert(
    snapshot.presentation === PRESENTATION.CLUSTER &&
      snapshot.activeCardinalId === "north" &&
      snapshot.selectedId === "north-1" &&
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.clusters),
    "INTERRUPTION_SNAPSHOT_INVALID"
  );
});

test("OPTIONAL_PARTICIPANT_ROLLBACK_RESTORES_ACCEPTED_STATE", () => {
  const controller = createController();
  controller.activateCardinal("north");
  controller.select("north-1");
  const before = controller.getState();

  controller.beginOptionalParticipantTransition({
    participantId: "center",
    transitionId: "transition-1"
  });
  controller.returnToOrbit();
  controller.completeOptionalParticipantTransition({
    transitionId: "transition-1",
    status: "complete"
  });
  controller.rollbackOptionalParticipantTransition({
    transitionId: "transition-1",
    reason: "fixture"
  });

  const restored = controller.getState();
  assert(
    restored.presentation === before.presentation &&
      restored.activeCardinalId === before.activeCardinalId &&
      restored.selectedId === before.selectedId &&
      restored.clusters === before.clusters &&
      restored.optionalParticipantLifecycle === null,
    "OPTIONAL_PARTICIPANT_ROLLBACK_INVALID"
  );
});

test("OPTIONAL_PARTICIPANT_TRANSITION_ID_ENFORCED", () => {
  const controller = createController();
  controller.beginOptionalParticipantTransition({
    participantId: "center",
    transitionId: "transition-1"
  });

  expectCode(
    () =>
      controller.rollbackOptionalParticipantTransition({
        transitionId: "transition-2"
      }),
    "COMPASS_PARTICIPANT_TRANSITION_ID_MISMATCH"
  );
});

test("INTEGRATED_CONTROLLER_PUBLIC_CORRIDOR", () => {
  navigationCalls.length = 0;
  const controller = createController();

  controller.beginGesture();
  controller.preview({
    quaternion: [0, 1, 0, 1],
    primaryId: "north",
    worldBasisRevision
  });
  controller.commit();

  controller.activateCardinal("north");
  controller.beginGesture();
  controller.preview({
    quaternion: [1, 0, 0, 1],
    primaryId: "north-2",
    worldBasisRevision
  });
  controller.commit();

  controller.select("north-1");
  controller.returnToOrbit();
  controller.select("north-2");

  const intent = controller.authorizeNavigation({
    routeKey: "north-2-route",
    transactionRevision:
      controller.getState().transaction.revision
  });

  controller.enterHeld("fixture");
  controller.leaveHeld();
  controller.returnToConstellation();

  const state = controller.getState();
  assert(
    intent.authorized === true &&
      state.presentation === PRESENTATION.CONSTELLATION &&
      state.lastActiveCardinalId === "north" &&
      state.clusters.north.primaryId === "north-2" &&
      state.held === false,
    "INTEGRATED_CONTROLLER_CORRIDOR_INVALID"
  );
});

export const CONTROLLER_STATE_MODEL_FIXTURE_RESULT =
  Object.freeze({
    schema:
      "UNIVERSAL_COMPASS_CONTROLLER_SOURCE_DERIVED_FIXTURE_RESULT_v2",
    status: "PASS",
    testCount: results.length,
    passed: results.length,
    failed: 0,
    results: Object.freeze(results),
    sourceDerived: true,
    sourceCompassMutation: false,
    productionAuthority: false
  });

if (
  typeof process !== "undefined" &&
  process.argv?.[1]
) {
  const target = new URL(import.meta.url).pathname;
  if (target === process.argv[1]) {
    console.log(
      JSON.stringify(
        CONTROLLER_STATE_MODEL_FIXTURE_RESULT
      )
    );
  }
}
