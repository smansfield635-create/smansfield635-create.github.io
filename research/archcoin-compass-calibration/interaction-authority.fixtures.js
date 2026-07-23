import { POINTER_KIND } from "../../assets/compass-model/compass.contracts.js";
import {
  POINTER_PHASE,
  createInteractionAuthority
} from "../../assets/compass-model/compass.interactions.js";
import { NEUTRAL_REFERENCE_PROFILE } from "../../assets/compass-model/compass.profiles.js";

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function expectThrow(code, operation) {
  try {
    operation();
  } catch (error) {
    assert(error.code === code, `EXPECTED_${code}_RECEIVED_${error.code || error.message}`);
    return;
  }
  throw new Error(`EXPECTED_THROW_${code}`);
}

function createHarness({ reducedMotion = false } = {}) {
  let now = 1000;
  const calls = [];
  const controllerState = {
    presentation: "CONSTELLATION",
    orientation: [0, 0, 0, 1]
  };

  const controller = {
    getState: () => controllerState,
    beginGesture() {
      calls.push(["beginGesture"]);
    },
    preview(proposal) {
      calls.push(["preview", proposal]);
      controllerState.orientation = proposal.quaternion;
    },
    commit() {
      calls.push(["commit"]);
    },
    cancel(reason) {
      calls.push(["cancel", reason]);
      controllerState.orientation = [0, 0, 0, 1];
    }
  };

  const compositor = {
    getCamera: () => NEUTRAL_REFERENCE_PROFILE.compositor.camera
  };

  const world = {
    evaluateOrientationProposal({ presentation, quaternion }) {
      calls.push(["world", { presentation, quaternion }]);
      return Object.freeze({
        schema: "UNIVERSAL_COMPASS_ORIENTATION_PROPOSAL_EVALUATION_v1",
        presentation,
        quaternion: Object.freeze([...quaternion]),
        primaryId: "neutral-cardinal-1",
        primaryScore: 0.875,
        records: Object.freeze([]),
        worldBasisRevision: 1
      });
    }
  };

  const interactions = createInteractionAuthority({
    profile: NEUTRAL_REFERENCE_PROFILE,
    controller,
    compositor,
    world,
    clock: () => now,
    reducedMotion
  });

  return {
    calls,
    controllerState,
    interactions,
    advance(milliseconds) {
      now += milliseconds;
    }
  };
}

const tests = [
  {
    id: "POINTER_DOWN_CREATES_PENDING_WITHOUT_TRANSACTION",
    run() {
      const harness = createHarness();
      const receipt = harness.interactions.begin({
        id: 1,
        kind: POINTER_KIND.MOUSE,
        x: 10,
        y: 20,
        targetId: "neutral-cardinal-1"
      });
      assert(receipt.phase === POINTER_PHASE.PENDING, "BEGIN_NOT_PENDING");
      assert(receipt.transactionStarted === false, "BEGIN_STARTED_TRANSACTION");
      assert(harness.calls.length === 0, "BEGIN_CALLED_CONTROLLER");
    }
  },
  {
    id: "NEUTRAL_BAND_REMAINS_PENDING",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 2, kind: POINTER_KIND.TOUCH, x: 0, y: 0 });
      const receipt = harness.interactions.move({ id: 2, x: 4, y: 3 });
      assert(receipt.phase === POINTER_PHASE.PENDING, "NEUTRAL_BAND_LEFT_PENDING");
      assert(receipt.transactionStarted === false, "NEUTRAL_BAND_STARTED_TRANSACTION");
      assert(harness.calls.length === 0, "NEUTRAL_BAND_CALLED_DEPENDENCY");
    }
  },
  {
    id: "DRAG_THRESHOLD_STARTS_TRANSACTION_ONCE",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 3, kind: POINTER_KIND.MOUSE, x: 0, y: 0 });
      const first = harness.interactions.move({ id: 3, x: 9, y: 0 });
      const second = harness.interactions.move({ id: 3, x: 12, y: 0 });
      assert(first.phase === POINTER_PHASE.DRAGGING, "FIRST_DRAG_NOT_ACTIVE");
      assert(first.transactionStarted === true, "FIRST_DRAG_DID_NOT_START");
      assert(second.transactionStarted === false, "SECOND_DRAG_RESTARTED");
      assert(harness.calls.filter(call => call[0] === "beginGesture").length === 1, "GESTURE_BEGIN_COUNT_INVALID");
    }
  },
  {
    id: "WORLD_EVALUATION_SUPPLIES_CONTROLLER_PREVIEW",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 4, kind: POINTER_KIND.PEN, x: 0, y: 0 });
      const receipt = harness.interactions.move({ id: 4, x: 10, y: 2 });
      const worldCall = harness.calls.find(call => call[0] === "world");
      const previewCall = harness.calls.find(call => call[0] === "preview");
      assert(Boolean(worldCall), "WORLD_NOT_CALLED");
      assert(Boolean(previewCall), "PREVIEW_NOT_CALLED");
      assert(previewCall[1].primaryId === "neutral-cardinal-1", "PREVIEW_PRIMARY_NOT_WORLD_PRIMARY");
      assert(previewCall[1].worldBasisRevision === 1, "PREVIEW_WORLD_REVISION_NOT_FORWARDED");
      assert(receipt.primaryId === previewCall[1].primaryId, "RECEIPT_PRIMARY_DIVERGED");
    }
  },
  {
    id: "REDUCED_MOTION_REMAINS_FUNCTIONAL",
    run() {
      const normal = createHarness();
      const reduced = createHarness({ reducedMotion: true });
      const normalRate = normal.interactions.getEffectiveRadiansPerPixel();
      const reducedRate = reduced.interactions.getEffectiveRadiansPerPixel();
      assert(reducedRate > 0, "REDUCED_MOTION_DISABLED_FUNCTION");
      assert(reducedRate < normalRate, "REDUCED_MOTION_DID_NOT_REDUCE_RATE");
      reduced.interactions.setReducedMotion(false);
      assert(reduced.interactions.getEffectiveRadiansPerPixel() === normalRate, "REDUCED_MOTION_TOGGLE_FAILED");
    }
  },
  {
    id: "TAP_RELEASE_DOES_NOT_ROTATE_OR_COMMIT",
    run() {
      const harness = createHarness();
      harness.interactions.begin({
        id: 5,
        kind: POINTER_KIND.MOUSE,
        x: 0,
        y: 0,
        targetId: "neutral-cardinal-2"
      });
      harness.advance(100);
      const receipt = harness.interactions.end({ id: 5 });
      assert(receipt.mode === "TAP_PROPOSAL", "TAP_MODE_INVALID");
      assert(receipt.targetId === "neutral-cardinal-2", "TAP_TARGET_LOST");
      assert(receipt.withinTapDistance === true, "TAP_DISTANCE_INVALID");
      assert(receipt.withinTapDuration === true, "TAP_DURATION_INVALID");
      assert(harness.calls.length === 0, "TAP_CALLED_CONTROLLER");
    }
  },
  {
    id: "DRAG_RELEASE_COMMITS",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 6, kind: POINTER_KIND.MOUSE, x: 0, y: 0 });
      harness.interactions.move({ id: 6, x: 10, y: 0 });
      const receipt = harness.interactions.end({ id: 6 });
      assert(receipt.mode === "DRAG_COMMIT", "DRAG_COMMIT_MODE_INVALID");
      assert(harness.calls.filter(call => call[0] === "commit").length === 1, "DRAG_COMMIT_NOT_CALLED");
    }
  },
  {
    id: "DRAG_CANCEL_AND_INTERRUPT_CANCEL_CONTROLLER",
    run() {
      const cancelHarness = createHarness();
      cancelHarness.interactions.begin({ id: 7, kind: POINTER_KIND.MOUSE, x: 0, y: 0 });
      cancelHarness.interactions.move({ id: 7, x: 10, y: 0 });
      cancelHarness.interactions.end({ id: 7 }, { cancel: true });
      assert(cancelHarness.calls.some(call => call[0] === "cancel"), "DRAG_END_CANCEL_NOT_CALLED");

      const interruptHarness = createHarness();
      interruptHarness.interactions.begin({ id: 8, kind: POINTER_KIND.TOUCH, x: 0, y: 0 });
      interruptHarness.interactions.move({ id: 8, x: 10, y: 0 });
      const receipt = interruptHarness.interactions.interrupt("visibility-hidden");
      assert(receipt.mode === "DRAG_INTERRUPT", "DRAG_INTERRUPT_MODE_INVALID");
      assert(interruptHarness.calls.some(call => call[0] === "cancel" && call[1] === "visibility-hidden"), "DRAG_INTERRUPT_CANCEL_NOT_FORWARDED");
    }
  },
  {
    id: "PENDING_INTERRUPT_HAS_ZERO_CONTROLLER_SIDE_EFFECT",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 9, kind: POINTER_KIND.PEN, x: 0, y: 0 });
      const receipt = harness.interactions.interrupt("blur");
      assert(receipt.mode === "PENDING_INTERRUPT", "PENDING_INTERRUPT_MODE_INVALID");
      assert(receipt.transactionStarted === false, "PENDING_INTERRUPT_CLAIMED_TRANSACTION");
      assert(harness.calls.length === 0, "PENDING_INTERRUPT_CALLED_CONTROLLER");
    }
  },
  {
    id: "MISMATCHED_POINTER_IS_REJECTED_WITHOUT_MUTATION",
    run() {
      const harness = createHarness();
      harness.interactions.begin({ id: 10, kind: POINTER_KIND.MOUSE, x: 0, y: 0 });
      const before = harness.interactions.getActive();
      const receipt = harness.interactions.move({ id: 999, x: 20, y: 20 });
      const after = harness.interactions.getActive();
      assert(receipt.accepted === false, "MISMATCHED_POINTER_ACCEPTED");
      assert(JSON.stringify(before) === JSON.stringify(after), "MISMATCHED_POINTER_MUTATED_ACTIVE");
    }
  },
  {
    id: "UNSUPPORTED_POINTER_KIND_REJECTED",
    run() {
      const harness = createHarness();
      expectThrow("COMPASS_POINTER_KIND_UNSUPPORTED", () =>
        harness.interactions.begin({ id: 11, kind: "keyboard", x: 0, y: 0 })
      );
    }
  },
  {
    id: "COMPOSITOR_PRIMARY_API_IS_NOT_REQUIRED",
    run() {
      const harness = createHarness();
      assert(typeof harness.interactions.move === "function", "INTERACTION_AUTHORITY_NOT_CREATED");
      harness.interactions.begin({ id: 12, kind: POINTER_KIND.MOUSE, x: 0, y: 0 });
      const receipt = harness.interactions.move({ id: 12, x: 10, y: 0 });
      assert(receipt.primaryId === "neutral-cardinal-1", "WORLD_PRIMARY_NOT_USED");
    }
  }
];

export function runInteractionAuthorityFixtures() {
  const results = tests.map(test => {
    try {
      test.run();
      return Object.freeze({ id: test.id, status: "PASS" });
    } catch (error) {
      return Object.freeze({
        id: test.id,
        status: "FAIL",
        error: error.code || error.message
      });
    }
  });

  return Object.freeze({
    schema: "UNIVERSAL_COMPASS_INTERACTION_AUTHORITY_FIXTURE_RECEIPT_v1",
    status: results.every(result => result.status === "PASS") ? "PASS" : "FAIL",
    testCount: results.length,
    passed: results.filter(result => result.status === "PASS").length,
    failed: results.filter(result => result.status === "FAIL").length,
    results: Object.freeze(results)
  });
}

if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("interaction-authority.fixtures.js")) {
  const receipt = runInteractionAuthorityFixtures();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 1;
}
