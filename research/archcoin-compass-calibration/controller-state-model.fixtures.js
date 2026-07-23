import { createCompassController } from "../../assets/compass-model/compass.controller.js";
import { PRESENTATION } from "../../assets/compass-model/compass.contracts.js";

const nodesById = new Map([
  [
    "constellation-a",
    Object.freeze({
      id: "constellation-a",
      presentation: PRESENTATION.CONSTELLATION
    })
  ],
  [
    "cluster-a",
    Object.freeze({
      id: "cluster-a",
      presentation: PRESENTATION.CLUSTER
    })
  ]
]);

const nodes = Object.freeze({
  has: id => nodesById.has(id),
  get: id => nodesById.get(id) || null
});

const adapters = Object.freeze({
  resolveRoute: key => key === "route-a" ? "#a" : null,
  navigate: route => Object.freeze({ route })
});

let worldBasisRevision = 1;

const world = Object.freeze({
  getWorldBasisRevision: () => worldBasisRevision
});

const profile = Object.freeze({ id: "CONTROLLER_STATE_MODEL_TEST_PROFILE" });

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

const results = [];

function test(name, operation) {
  operation();
  results.push(Object.freeze({ test: name, status: "PASS" }));
}

test("HELD_PRESERVES_PRESENTATION_ORIENTATION_SELECTION", () => {
  const controller = createController();
  controller.select("constellation-a");
  const before = controller.getState();
  controller.enterHeld("fixture");
  const after = controller.getState();

  if (
    after.presentation !== before.presentation ||
    after.orientation !== before.orientation ||
    after.selectedId !== before.selectedId ||
    after.held !== true
  ) {
    throw new Error("HELD_PRESERVATION_FAILED");
  }
});

test("HELD_BLOCKS_GESTURE_AND_PRESENTATION", () => {
  const controller = createController();
  controller.enterHeld("fixture");
  expectCode(() => controller.beginGesture(), "COMPASS_HELD");
  expectCode(
    () => controller.openCluster(),
    "COMPASS_HELD_PRESENTATION_LOCK"
  );
});

test("LEAVE_HELD_RESTORES_FUNCTION", () => {
  const controller = createController();
  controller.enterHeld("fixture");
  controller.leaveHeld();
  controller.openCluster();

  if (controller.getState().presentation !== PRESENTATION.CLUSTER) {
    throw new Error("LEAVE_HELD_RECOVERY_FAILED");
  }
});

test("HELD_PRESENTATION_REJECTED", () => {
  const controller = createController();
  expectCode(
    () => controller.setPresentation(PRESENTATION.HELD),
    "COMPASS_CANONICAL_PRESENTATION_REQUIRED"
  );
});

test("MATCHING_PREVIEW_ACCEPTED", () => {
  const controller = createController();
  controller.beginGesture();
  controller.preview({
    quaternion: [0, 0, 0, 1],
    primaryId: "constellation-a",
    worldBasisRevision: 1
  });

  if (controller.getState().primaryId !== "constellation-a") {
    throw new Error("MATCHING_PREVIEW_NOT_ACCEPTED");
  }
});

test("CROSS_PRESENTATION_PRIMARY_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();
  expectCode(
    () => controller.preview({
      quaternion: [0, 0, 0, 1],
      primaryId: "cluster-a",
      worldBasisRevision: 1
    }),
    "COMPASS_PRIMARY_PRESENTATION_MISMATCH"
  );
});

test("STALE_WORLD_BASIS_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();
  worldBasisRevision = 2;

  try {
    expectCode(
      () => controller.preview({
        quaternion: [0, 0, 0, 1],
        primaryId: "constellation-a",
        worldBasisRevision: 1
      }),
      "COMPASS_WORLD_BASIS_REVISION_STALE"
    );
  } finally {
    worldBasisRevision = 1;
  }
});

test("UNKNOWN_PREVIEW_FIELD_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();
  expectCode(
    () => controller.preview({
      quaternion: [0, 0, 0, 1],
      primaryId: "constellation-a",
      worldBasisRevision: 1,
      extra: true
    }),
    "COMPASS_CONTROLLER_PREVIEW_KEYS_INVALID"
  );
});

test("CANCEL_RESTORES_ORIGIN", () => {
  const controller = createController();
  const origin = controller.getState().orientation;
  controller.beginGesture();
  controller.preview({
    quaternion: [0, 1, 0, 1],
    primaryId: "constellation-a",
    worldBasisRevision: 1
  });
  controller.cancel("fixture");

  if (controller.getState().orientation !== origin) {
    throw new Error("CANCEL_DID_NOT_RESTORE_ORIGIN");
  }
});

test("HOLD_DURING_ACTIVE_GESTURE_REJECTED", () => {
  const controller = createController();
  controller.beginGesture();
  expectCode(
    () => controller.enterHeld("fixture"),
    "COMPASS_HOLD_DURING_ACTIVE_GESTURE"
  );
});

export const CONTROLLER_STATE_MODEL_FIXTURE_RESULT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_CONTROLLER_STATE_MODEL_FIXTURE_RESULT_v1",
  status: "PASS",
  testCount: results.length,
  passed: results.length,
  failed: 0,
  results: Object.freeze(results),
  productionAuthority: false
});

if (typeof process !== "undefined" && process.argv?.[1]) {
  const target = new URL(import.meta.url).pathname;
  if (target === process.argv[1]) {
    console.log(JSON.stringify(CONTROLLER_STATE_MODEL_FIXTURE_RESULT));
  }
}
