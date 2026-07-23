import {
  POINTER_KIND,
  assertContract,
  assertFiniteNumber,
  deepFreeze
} from "./compass.contracts.js";
import {
  cameraBasis,
  fixedBasisIncrement,
  multiplyQuaternion,
  normalizeQuaternion
} from "./compass.math.js";

export const POINTER_PHASE = Object.freeze({
  PENDING: "PENDING",
  DRAGGING: "DRAGGING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
});

const SUPPORTED_POINTER_KINDS = Object.freeze([
  POINTER_KIND.MOUSE,
  POINTER_KIND.TOUCH,
  POINTER_KIND.PEN
]);

function finiteCoordinate(value, code) {
  return assertFiniteNumber(value, code);
}

function elapsedMilliseconds(startedAt, endedAt) {
  return Math.max(0, endedAt - startedAt);
}

export function createInteractionAuthority({
  profile,
  controller,
  compositor,
  world,
  clock = () => Date.now(),
  reducedMotion = false
}) {
  assertContract(
    profile && profile.interactions,
    "COMPASS_INTERACTION_PROFILE_REQUIRED"
  );
  assertContract(
    controller &&
      typeof controller.getState === "function" &&
      typeof controller.beginGesture === "function" &&
      typeof controller.preview === "function" &&
      typeof controller.commit === "function" &&
      typeof controller.cancel === "function",
    "COMPASS_INTERACTION_CONTROLLER_REQUIRED"
  );
  assertContract(
    compositor && typeof compositor.getCamera === "function",
    "COMPASS_INTERACTION_COMPOSITOR_REQUIRED"
  );
  assertContract(
    world && typeof world.evaluateOrientationProposal === "function",
    "COMPASS_INTERACTION_WORLD_REQUIRED"
  );
  assertContract(
    typeof clock === "function",
    "COMPASS_INTERACTION_CLOCK_REQUIRED"
  );

  let active = null;
  let reducedMotionEnabled = Boolean(reducedMotion);

  const smoothingFor = kind => profile.interactions.smoothing[kind];

  const effectiveRadiansPerPixel = () =>
    profile.interactions.radiansPerPixel *
    (reducedMotionEnabled
      ? profile.interactions.reducedMotionMultiplier
      : 1);

  function snapshotActive() {
    return active ? deepFreeze(structuredClone(active)) : null;
  }

  function begin(pointer) {
    assertContract(!active, "COMPASS_POINTER_ALREADY_ACTIVE");
    assertContract(
      pointer && typeof pointer === "object",
      "COMPASS_POINTER_RECORD_REQUIRED"
    );
    assertContract(
      SUPPORTED_POINTER_KINDS.includes(pointer.kind),
      "COMPASS_POINTER_KIND_UNSUPPORTED",
      pointer.kind
    );
    assertContract(
      pointer.id !== undefined && pointer.id !== null,
      "COMPASS_POINTER_ID_REQUIRED"
    );

    const x = finiteCoordinate(pointer.x, "COMPASS_POINTER_X_INVALID");
    const y = finiteCoordinate(pointer.y, "COMPASS_POINTER_Y_INVALID");
    const startedAt = Number.isFinite(Number(pointer.timestamp))
      ? Number(pointer.timestamp)
      : Number(clock());

    active = {
      id: pointer.id,
      kind: pointer.kind,
      phase: POINTER_PHASE.PENDING,
      startX: x,
      startY: y,
      x,
      y,
      filteredDx: 0,
      filteredDy: 0,
      totalDistance: 0,
      startedAt,
      targetId: pointer.targetId ? String(pointer.targetId) : ""
    };

    return deepFreeze({
      accepted: true,
      pointerId: pointer.id,
      phase: POINTER_PHASE.PENDING,
      transactionStarted: false
    });
  }

  function move(pointer) {
    if (!active || active.id !== pointer.id) {
      return deepFreeze({ accepted: false });
    }

    const nextX = finiteCoordinate(pointer.x, "COMPASS_POINTER_X_INVALID");
    const nextY = finiteCoordinate(pointer.y, "COMPASS_POINTER_Y_INVALID");
    const stepDx = nextX - active.x;
    const stepDy = nextY - active.y;
    const totalDx = nextX - active.startX;
    const totalDy = nextY - active.startY;
    const totalDistance = Math.hypot(totalDx, totalDy);

    active.x = nextX;
    active.y = nextY;
    active.totalDistance = totalDistance;

    if (
      active.phase === POINTER_PHASE.PENDING &&
      totalDistance < profile.interactions.dragActivationDistancePx
    ) {
      return deepFreeze({
        accepted: true,
        phase: POINTER_PHASE.PENDING,
        transactionStarted: false,
        totalDistance
      });
    }

    let transactionStarted = false;
    if (active.phase === POINTER_PHASE.PENDING) {
      controller.beginGesture();
      active.phase = POINTER_PHASE.DRAGGING;
      transactionStarted = true;
    }

    const alpha = smoothingFor(active.kind);
    active.filteredDx = active.filteredDx * (1 - alpha) + stepDx * alpha;
    active.filteredDy = active.filteredDy * (1 - alpha) + stepDy * alpha;

    const camera = compositor.getCamera();
    const basis = cameraBasis(camera);
    const state = controller.getState();
    const delta = fixedBasisIncrement({
      dx: active.filteredDx,
      dy: active.filteredDy,
      rightAxis: basis.right,
      radiansPerPixel: effectiveRadiansPerPixel(),
      maximumAngle: profile.interactions.maximumIncrementalAngle
    });
    const quaternion = normalizeQuaternion(
      multiplyQuaternion(delta, state.orientation)
    );
    const evaluation = world.evaluateOrientationProposal({
      presentation: state.presentation,
      quaternion
    });

    controller.preview({
      quaternion: evaluation.quaternion,
      primaryId: evaluation.primaryId,
      worldBasisRevision: evaluation.worldBasisRevision
    });

    return deepFreeze({
      accepted: true,
      phase: POINTER_PHASE.DRAGGING,
      transactionStarted,
      quaternion: evaluation.quaternion,
      primaryId: evaluation.primaryId,
      primaryScore: evaluation.primaryScore,
      worldBasisRevision: evaluation.worldBasisRevision,
      reducedMotion: reducedMotionEnabled
    });
  }

  function end(pointer, { cancel = false } = {}) {
    if (!active || active.id !== pointer.id) {
      return deepFreeze({ accepted: false });
    }

    const completed = active;
    active = null;
    const endedAt = Number.isFinite(Number(pointer.timestamp))
      ? Number(pointer.timestamp)
      : Number(clock());
    const durationMs = elapsedMilliseconds(completed.startedAt, endedAt);

    if (completed.phase === POINTER_PHASE.PENDING) {
      return deepFreeze({
        accepted: true,
        phase: cancel ? POINTER_PHASE.CANCELLED : POINTER_PHASE.COMPLETED,
        mode: cancel ? "PENDING_CANCEL" : "TAP_PROPOSAL",
        cancelled: Boolean(cancel),
        targetId: completed.targetId,
        durationMs,
        withinTapDistance:
          completed.totalDistance <=
          profile.interactions.tapMaximumDistancePx,
        withinTapDuration:
          durationMs <= profile.interactions.tapMaximumDurationMs,
        transactionStarted: false
      });
    }

    if (cancel) {
      controller.cancel("pointer-end");
    } else {
      controller.commit();
    }

    return deepFreeze({
      accepted: true,
      phase: cancel ? POINTER_PHASE.CANCELLED : POINTER_PHASE.COMPLETED,
      mode: cancel ? "DRAG_CANCEL" : "DRAG_COMMIT",
      cancelled: Boolean(cancel),
      targetId: completed.targetId,
      durationMs,
      transactionStarted: true
    });
  }

  function interrupt(reason = "interrupted") {
    if (!active) {
      return deepFreeze({ accepted: false });
    }

    const interrupted = active;
    active = null;

    if (interrupted.phase === POINTER_PHASE.DRAGGING) {
      controller.cancel(String(reason));
    }

    return deepFreeze({
      accepted: true,
      phase: POINTER_PHASE.CANCELLED,
      mode:
        interrupted.phase === POINTER_PHASE.DRAGGING
          ? "DRAG_INTERRUPT"
          : "PENDING_INTERRUPT",
      transactionStarted:
        interrupted.phase === POINTER_PHASE.DRAGGING,
      reason: String(reason)
    });
  }

  function setReducedMotion(enabled) {
    reducedMotionEnabled = Boolean(enabled);
    return reducedMotionEnabled;
  }

  return Object.freeze({
    begin,
    move,
    end,
    interrupt,
    setReducedMotion,
    getReducedMotion: () => reducedMotionEnabled,
    getEffectiveRadiansPerPixel: effectiveRadiansPerPixel,
    getActive: snapshotActive
  });
}
