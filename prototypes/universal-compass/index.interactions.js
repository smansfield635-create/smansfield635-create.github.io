/*
 * Universal Compass pointer-input and gesture-proposal authority.
 * Neutral seven-file compatibility implementation.
 *
 * Consumes accepted Controller state, immutable Planet identity/membership
 * facts, and the latest immutable Compositor projection facts. Publishes
 * bounded pointer and gesture proposals only. It owns no world, visual,
 * camera, projection, controller-state, target-acceptance, navigation,
 * product, or production authority.
 */

function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function assert(condition, code, details = null) {
  if (!condition) fail(code, details);
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    seen.has(value)
  ) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}

function plainRecord(value, code) {
  assert(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      [Object.prototype, null].includes(Object.getPrototypeOf(value)),
    code,
    value
  );
  return value;
}

function exactKeys(value, keys, code) {
  plainRecord(value, code);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    deepFreeze({ actual, expected })
  );
  return value;
}

function finite(value, code) {
  const admitted = Number(value);
  assert(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function nonnegativeFinite(value, code) {
  const admitted = finite(value, code);
  assert(admitted >= 0, code, value);
  return admitted;
}

function identifier(value, code) {
  const admitted = String(value ?? "").trim();
  assert(admitted.length > 0, code, value);
  return admitted;
}

function optionalIdentifier(value) {
  return String(value ?? "").trim();
}

function vector3(value, code) {
  assert(Array.isArray(value) && value.length === 3, code, value);
  return value.map(component => finite(component, code));
}

function quaternion(value, code) {
  assert(Array.isArray(value) && value.length === 4, code, value);
  const admitted = value.map(component => finite(component, code));
  const length = Math.hypot(...admitted);
  assert(length > 1e-8, code, value);
  return admitted.map(component => component / length);
}

function normalize3(value, code) {
  const admitted = vector3(value, code);
  const length = Math.hypot(...admitted);
  assert(length > 1e-8, code, value);
  return admitted.map(component => component / length);
}

function multiplyQuaternion(a, b) {
  const left = quaternion(a, "COMPASS_INTERACTION_QUATERNION_INVALID");
  const right = quaternion(b, "COMPASS_INTERACTION_QUATERNION_INVALID");
  return quaternion([
    left[3] * right[0] + left[0] * right[3] + left[1] * right[2] - left[2] * right[1],
    left[3] * right[1] - left[0] * right[2] + left[1] * right[3] + left[2] * right[0],
    left[3] * right[2] + left[0] * right[1] - left[1] * right[0] + left[2] * right[3],
    left[3] * right[3] - left[0] * right[0] - left[1] * right[1] - left[2] * right[2]
  ], "COMPASS_INTERACTION_QUATERNION_COMPOSITION_INVALID");
}

function quaternionFromAxisAngle(axis, angle) {
  const admittedAxis = normalize3(axis, "COMPASS_INTERACTION_ROTATION_AXIS_INVALID");
  const admittedAngle = finite(angle, "COMPASS_INTERACTION_ROTATION_ANGLE_INVALID");
  const half = admittedAngle * 0.5;
  const sine = Math.sin(half);
  return quaternion([
    admittedAxis[0] * sine,
    admittedAxis[1] * sine,
    admittedAxis[2] * sine,
    Math.cos(half)
  ], "COMPASS_INTERACTION_AXIS_ANGLE_QUATERNION_INVALID");
}

function clampMagnitude2(x, y, maximum) {
  const length = Math.hypot(x, y);
  if (length <= maximum || length <= 1e-12) return [x, y];
  const scale = maximum / length;
  return [x * scale, y * scale];
}

export const POINTER_KIND = deepFreeze({
  MOUSE: "MOUSE",
  TOUCH: "TOUCH",
  PEN: "PEN"
});

export const POINTER_PHASE = deepFreeze({
  PENDING: "PENDING",
  DRAGGING: "DRAGGING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
});

export const UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT = deepFreeze({
  id: "DGB_UNIVERSAL_COMPASS_INTERACTIONS_NEUTRAL_COMPATIBILITY_v1",
  namespace: "DGB_UNIVERSAL_COMPASS",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  authority: "POINTER_INPUT_AND_GESTURE_PROPOSALS",
  worldAuthority: false,
  visualGeometryAuthority: false,
  cameraAuthority: false,
  projectionAuthority: false,
  controllerStateAuthority: false,
  targetAcceptanceAuthority: false,
  navigationAuthority: false,
  routeAuthority: false,
  productAuthority: false,
  productionAuthority: false,
  externalContractAuthority: false,
  externalMathAuthority: false,
  externalProfileAuthority: false,
  reducedMotionAuthority: false,
  recordImmutability: "DEEP"
});

const SCHEMA = deepFreeze({
  profile: "UNIVERSAL_COMPASS_INTERACTION_PROFILE_v1",
  validation: "UNIVERSAL_COMPASS_INTERACTION_VALIDATION_RECEIPT_v1",
  targetProposal: "UNIVERSAL_COMPASS_TARGET_PROPOSAL_v1"
});

const BEGIN_KEYS = deepFreeze([
  "id", "kind", "x", "y", "timestamp", "targetId"
]);
const MOVE_KEYS = deepFreeze([
  "id", "x", "y", "timestamp"
]);
const END_KEYS = deepFreeze([
  "id", "x", "y", "timestamp", "cancel"
]);

const PROFILE = deepFreeze({
  schema: SCHEMA.profile,
  id: "DGB_UNIVERSAL_COMPASS_LOCKED_NEUTRAL_INTERACTION_PROFILE_v1",
  profileRevision: 1,
  supportedPointerKinds: Object.values(POINTER_KIND),
  smoothingByKind: {
    MOUSE: 0.65,
    TOUCH: 0.50,
    PEN: 0.70
  },
  dragActivationDistancePx: 6,
  tapMaximumDistancePx: 8,
  tapMaximumDurationMs: 500,
  radiansPerPixel: 0.006,
  reducedMotionMultiplier: 0.35,
  maximumIncrementalAngleRadians: 0.18
});

function validateDependencies({ controller, planet, compositor }) {
  assert(controller && typeof controller === "object", "COMPASS_INTERACTION_CONTROLLER_REQUIRED");
  for (const method of ["getState", "beginGesture", "preview", "commit", "cancel"]) {
    assert(
      typeof controller[method] === "function",
      `COMPASS_INTERACTION_CONTROLLER_${method.toUpperCase()}_REQUIRED`
    );
  }
  assert(planet && typeof planet === "object", "COMPASS_INTERACTION_PLANET_REQUIRED");
  for (const method of ["getWorldRevision", "hasCardinal", "hasChild", "isChildOfCardinal"]) {
    assert(
      typeof planet[method] === "function",
      `COMPASS_INTERACTION_PLANET_${method.toUpperCase()}_REQUIRED`
    );
  }
  assert(compositor && typeof compositor === "object", "COMPASS_INTERACTION_COMPOSITOR_REQUIRED");
  assert(
    typeof compositor.getLastProjection === "function",
    "COMPASS_INTERACTION_COMPOSITOR_GETLASTPROJECTION_REQUIRED"
  );
}

function admitBeginPointer(pointer) {
  exactKeys(pointer, BEGIN_KEYS, "COMPASS_INTERACTION_BEGIN_POINTER_KEYS_INVALID");
  const kind = String(pointer.kind ?? "").toUpperCase();
  assert(
    PROFILE.supportedPointerKinds.includes(kind),
    "COMPASS_INTERACTION_POINTER_KIND_UNSUPPORTED",
    kind
  );
  return deepFreeze({
    id: identifier(pointer.id, "COMPASS_INTERACTION_POINTER_ID_REQUIRED"),
    kind,
    x: finite(pointer.x, "COMPASS_INTERACTION_POINTER_X_INVALID"),
    y: finite(pointer.y, "COMPASS_INTERACTION_POINTER_Y_INVALID"),
    timestamp: nonnegativeFinite(pointer.timestamp, "COMPASS_INTERACTION_POINTER_TIMESTAMP_INVALID"),
    targetId: optionalIdentifier(pointer.targetId)
  });
}

function admitMovePointer(pointer) {
  exactKeys(pointer, MOVE_KEYS, "COMPASS_INTERACTION_MOVE_POINTER_KEYS_INVALID");
  return deepFreeze({
    id: identifier(pointer.id, "COMPASS_INTERACTION_POINTER_ID_REQUIRED"),
    x: finite(pointer.x, "COMPASS_INTERACTION_POINTER_X_INVALID"),
    y: finite(pointer.y, "COMPASS_INTERACTION_POINTER_Y_INVALID"),
    timestamp: nonnegativeFinite(pointer.timestamp, "COMPASS_INTERACTION_POINTER_TIMESTAMP_INVALID")
  });
}

function admitEndPointer(pointer) {
  exactKeys(pointer, END_KEYS, "COMPASS_INTERACTION_END_POINTER_KEYS_INVALID");
  assert(
    typeof pointer.cancel === "boolean",
    "COMPASS_INTERACTION_POINTER_CANCEL_INVALID",
    pointer.cancel
  );
  return deepFreeze({
    id: identifier(pointer.id, "COMPASS_INTERACTION_POINTER_ID_REQUIRED"),
    x: finite(pointer.x, "COMPASS_INTERACTION_POINTER_X_INVALID"),
    y: finite(pointer.y, "COMPASS_INTERACTION_POINTER_Y_INVALID"),
    timestamp: nonnegativeFinite(pointer.timestamp, "COMPASS_INTERACTION_POINTER_TIMESTAMP_INVALID"),
    cancel: pointer.cancel
  });
}

function activeOrientation(state) {
  plainRecord(state, "COMPASS_INTERACTION_CONTROLLER_STATE_INVALID");
  if (state.presentation === "CONSTELLATION") {
    plainRecord(state.constellation, "COMPASS_INTERACTION_CONSTELLATION_ORIENTATION_REQUIRED");
    return state.constellation;
  }
  assert(state.presentation === "CLUSTER", "COMPASS_INTERACTION_PRESENTATION_INVALID", state.presentation);
  const cardinalId = identifier(
    state.activeCardinalId,
    "COMPASS_INTERACTION_ACTIVE_CARDINAL_REQUIRED"
  );
  const orientation = state.clusters?.[cardinalId];
  plainRecord(orientation, "COMPASS_INTERACTION_CLUSTER_ORIENTATION_REQUIRED");
  return orientation;
}

function controllerGestureActive(state) {
  try {
    return Boolean(activeOrientation(state).gestureActive);
  } catch {
    return false;
  }
}

function latestProjection(compositor, planet) {
  const snapshot = compositor.getLastProjection();
  plainRecord(snapshot, "COMPASS_INTERACTION_PROJECTION_REQUIRED");
  const worldRevision = planet.getWorldRevision();
  assert(
    Number.isInteger(worldRevision) && worldRevision >= 0,
    "COMPASS_INTERACTION_WORLD_REVISION_INVALID",
    worldRevision
  );
  assert(
    snapshot.worldRevision === worldRevision,
    "COMPASS_INTERACTION_PROJECTION_WORLD_REVISION_STALE",
    deepFreeze({ projection: snapshot.worldRevision, planet: worldRevision })
  );
  plainRecord(snapshot.cameraBasis, "COMPASS_INTERACTION_CAMERA_BASIS_REQUIRED");
  const cameraBasis = deepFreeze({
    right: normalize3(snapshot.cameraBasis.right, "COMPASS_INTERACTION_CAMERA_RIGHT_INVALID"),
    up: normalize3(snapshot.cameraBasis.up, "COMPASS_INTERACTION_CAMERA_UP_INVALID"),
    forward: normalize3(snapshot.cameraBasis.forward, "COMPASS_INTERACTION_CAMERA_FORWARD_INVALID")
  });
  assert(
    Array.isArray(snapshot.interactionProjectionRecords),
    "COMPASS_INTERACTION_PROJECTION_RECORDS_REQUIRED"
  );
  return deepFreeze({ snapshot, cameraBasis, worldRevision });
}

function eligibleRecords({ snapshot, state, planet }) {
  return snapshot.interactionProjectionRecords.filter(record => {
    if (!record || record.interactionEligible !== true || record.visible !== true) return false;
    if (state.presentation === "CONSTELLATION") {
      return record.kind === "CARDINAL" && planet.hasCardinal(record.id);
    }
    return (
      state.presentation === "CLUSTER" &&
      record.kind === "CHILD" &&
      record.parentId === state.activeCardinalId &&
      planet.hasChild(record.id) &&
      planet.isChildOfCardinal(record.id, state.activeCardinalId)
    );
  });
}

function recordDistance(record, x, y) {
  const centerX = finite(
    record.projectedSphere?.centerX ?? record.screenX,
    "COMPASS_INTERACTION_PROJECTED_CENTER_X_INVALID"
  );
  const centerY = finite(
    record.projectedSphere?.centerY ?? record.screenY,
    "COMPASS_INTERACTION_PROJECTED_CENTER_Y_INVALID"
  );
  const radius = Math.max(
    1,
    Math.abs(finite(
      record.projectedSphere?.radiusPx ?? 1,
      "COMPASS_INTERACTION_PROJECTED_RADIUS_INVALID"
    ))
  );
  const distance = Math.hypot(x - centerX, y - centerY);
  return deepFreeze({
    distance,
    normalizedDistance: distance / radius,
    inside: distance <= radius
  });
}

function proposePrimary({ snapshot, state, planet, x, y, worldRevision }) {
  const ranked = eligibleRecords({ snapshot, state, planet }).map(record => ({
    record,
    distance: recordDistance(record, x, y)
  }));
  ranked.sort((a, b) =>
    Number(b.distance.inside) - Number(a.distance.inside) ||
    a.distance.normalizedDistance - b.distance.normalizedDistance ||
    finite(a.record.viewDepth, "COMPASS_INTERACTION_VIEW_DEPTH_INVALID") -
      finite(b.record.viewDepth, "COMPASS_INTERACTION_VIEW_DEPTH_INVALID") ||
    Number(a.record.canonicalOrder) - Number(b.record.canonicalOrder) ||
    String(a.record.id).localeCompare(String(b.record.id))
  );
  assert(
    ranked.length > 0,
    "COMPASS_INTERACTION_PRIMARY_PROPOSAL_UNAVAILABLE",
    state.presentation
  );
  const selected = ranked[0];
  return deepFreeze({
    schema: SCHEMA.targetProposal,
    targetId: identifier(selected.record.id, "COMPASS_INTERACTION_PRIMARY_ID_INVALID"),
    kind: selected.record.kind,
    parentId: optionalIdentifier(selected.record.parentId),
    worldRevision,
    projectionRevision: selected.record.projectionRevision,
    canonicalOrder: selected.record.canonicalOrder,
    distancePx: selected.distance.distance,
    normalizedDistance: selected.distance.normalizedDistance,
    insideProjectedSphere: selected.distance.inside,
    acceptanceAuthority: false
  });
}

function validateTapTarget({ targetId, snapshot, state, planet, worldRevision }) {
  if (!targetId) return null;
  const record = eligibleRecords({ snapshot, state, planet })
    .find(candidate => candidate.id === targetId);
  if (!record) return null;
  return deepFreeze({
    schema: SCHEMA.targetProposal,
    targetId: record.id,
    kind: record.kind,
    parentId: optionalIdentifier(record.parentId),
    worldRevision,
    projectionRevision: record.projectionRevision,
    canonicalOrder: record.canonicalOrder,
    acceptanceAuthority: false
  });
}

function incrementalQuaternion({ dx, dy, cameraBasis, state }) {
  const reducedMotion = Boolean(state.reducedMotion);
  const radiansPerPixel = PROFILE.radiansPerPixel *
    (reducedMotion ? PROFILE.reducedMotionMultiplier : 1);
  const maximumPixels = PROFILE.maximumIncrementalAngleRadians / radiansPerPixel;
  const [boundedDx, boundedDy] = clampMagnitude2(dx, dy, maximumPixels);
  const yaw = quaternionFromAxisAngle(cameraBasis.up, -boundedDx * radiansPerPixel);
  const pitch = quaternionFromAxisAngle(cameraBasis.right, -boundedDy * radiansPerPixel);
  return deepFreeze({
    quaternion: multiplyQuaternion(yaw, pitch),
    boundedDx,
    boundedDy,
    radiansPerPixel,
    reducedMotion
  });
}

function createValidationReceipt() {
  const findings = [
    ["LOCKED_INTERNAL_PROFILE", Object.isFrozen(PROFILE)],
    ["EXACT_SUPPORTED_POINTER_KINDS", PROFILE.supportedPointerKinds.length === 3],
    ["POSITIVE_DRAG_THRESHOLD", PROFILE.dragActivationDistancePx > 0],
    ["POSITIVE_TAP_LIMITS", PROFILE.tapMaximumDistancePx > 0 && PROFILE.tapMaximumDurationMs > 0],
    ["POSITIVE_ROTATION_RATE", PROFILE.radiansPerPixel > 0],
    ["BOUNDED_INCREMENT", PROFILE.maximumIncrementalAngleRadians > 0 && PROFILE.maximumIncrementalAngleRadians < Math.PI],
    ["NO_EXTERNAL_PROFILE_AUTHORITY", UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.externalProfileAuthority === false],
    ["NO_REDUCED_MOTION_AUTHORITY", UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.reducedMotionAuthority === false],
    ["NO_TARGET_ACCEPTANCE_AUTHORITY", UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.targetAcceptanceAuthority === false],
    ["NO_PRODUCT_OR_PRODUCTION_AUTHORITY", UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.productAuthority === false && UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.productionAuthority === false]
  ].map(([id, pass]) => deepFreeze({ id, pass, status: pass ? "PASS" : "FAIL" }));
  const failed = findings.filter(finding => !finding.pass);
  return deepFreeze({
    schema: SCHEMA.validation,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length
    }),
    profileRevision: PROFILE.profileRevision,
    findings,
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  });
}

export function createInteractionAuthority(options = {}) {
  exactKeys(
    options,
    ["controller", "planet", "compositor"],
    "COMPASS_INTERACTION_FACTORY_KEYS_INVALID"
  );
  const { controller, planet, compositor } = options;
  validateDependencies({ controller, planet, compositor });
  const validationReceipt = createValidationReceipt();
  assert(
    validationReceipt.status === "PASS",
    "COMPASS_INTERACTION_PROFILE_VALIDATION_FAILED",
    validationReceipt
  );

  let active = null;
  let inputRevision = 0;

  function snapshotActive() {
    return active ? deepFreeze(structuredClone(active)) : null;
  }

  function heldRejection(pointerId, transactionCancelled = false) {
    return deepFreeze({
      accepted: false,
      reason: "HELD",
      pointerId,
      phase: null,
      transactionStarted: false,
      transactionCancelled,
      inputRevision
    });
  }

  function clearForHeld(pointerId) {
    const state = controller.getState();
    let transactionCancelled = false;
    if (active?.phase === POINTER_PHASE.DRAGGING && controllerGestureActive(state)) {
      controller.cancel("held-state");
      transactionCancelled = true;
    }
    active = null;
    inputRevision += 1;
    return heldRejection(pointerId, transactionCancelled);
  }

  function begin(pointer) {
    const admitted = admitBeginPointer(pointer);
    const state = controller.getState();
    if (state.held) return clearForHeld(admitted.id);
    assert(!active, "COMPASS_INTERACTION_POINTER_ALREADY_ACTIVE", active?.id);
    active = {
      id: admitted.id,
      kind: admitted.kind,
      phase: POINTER_PHASE.PENDING,
      startX: admitted.x,
      startY: admitted.y,
      x: admitted.x,
      y: admitted.y,
      filteredDx: 0,
      filteredDy: 0,
      totalDistance: 0,
      startedAt: admitted.timestamp,
      timestamp: admitted.timestamp,
      targetId: admitted.targetId
    };
    inputRevision += 1;
    return deepFreeze({
      accepted: true,
      pointerId: admitted.id,
      phase: POINTER_PHASE.PENDING,
      transactionStarted: false,
      inputRevision
    });
  }

  function move(pointer) {
    const admitted = admitMovePointer(pointer);
    if (!active || active.id !== admitted.id) {
      return deepFreeze({
        accepted: false,
        reason: active ? "POINTER_ID_MISMATCH" : "NO_ACTIVE_POINTER",
        pointerId: admitted.id,
        transactionStarted: false,
        inputRevision
      });
    }
    const stateBefore = controller.getState();
    if (stateBefore.held) return clearForHeld(admitted.id);
    assert(
      admitted.timestamp >= active.timestamp,
      "COMPASS_INTERACTION_POINTER_TIMESTAMP_REGRESSION",
      deepFreeze({ previous: active.timestamp, next: admitted.timestamp })
    );

    const stepDx = admitted.x - active.x;
    const stepDy = admitted.y - active.y;
    const totalDx = admitted.x - active.startX;
    const totalDy = admitted.y - active.startY;
    active.x = admitted.x;
    active.y = admitted.y;
    active.timestamp = admitted.timestamp;
    active.totalDistance = Math.hypot(totalDx, totalDy);

    if (
      active.phase === POINTER_PHASE.PENDING &&
      active.totalDistance < PROFILE.dragActivationDistancePx
    ) {
      inputRevision += 1;
      return deepFreeze({
        accepted: true,
        phase: POINTER_PHASE.PENDING,
        transactionStarted: false,
        totalDistance: active.totalDistance,
        inputRevision
      });
    }

    let transactionStarted = false;
    try {
      if (active.phase === POINTER_PHASE.PENDING) {
        controller.beginGesture();
        active.phase = POINTER_PHASE.DRAGGING;
        transactionStarted = true;
      }
      const state = controller.getState();
      const orientation = activeOrientation(state);
      const alpha = PROFILE.smoothingByKind[active.kind];
      active.filteredDx = active.filteredDx * (1 - alpha) + stepDx * alpha;
      active.filteredDy = active.filteredDy * (1 - alpha) + stepDy * alpha;
      const projection = latestProjection(compositor, planet);
      const increment = incrementalQuaternion({
        dx: active.filteredDx,
        dy: active.filteredDy,
        cameraBasis: projection.cameraBasis,
        state
      });
      const proposedQuaternion = quaternion(
        multiplyQuaternion(increment.quaternion, orientation.quaternion),
        "COMPASS_INTERACTION_PROPOSED_QUATERNION_INVALID"
      );
      const targetProposal = proposePrimary({
        snapshot: projection.snapshot,
        state,
        planet,
        x: admitted.x,
        y: admitted.y,
        worldRevision: projection.worldRevision
      });
      controller.preview({
        quaternion: proposedQuaternion,
        primaryId: targetProposal.targetId,
        worldRevision: projection.worldRevision
      });
      inputRevision += 1;
      return deepFreeze({
        accepted: true,
        phase: POINTER_PHASE.DRAGGING,
        transactionStarted,
        quaternion: proposedQuaternion,
        primaryId: targetProposal.targetId,
        targetProposal,
        worldRevision: projection.worldRevision,
        projectionRevision: targetProposal.projectionRevision,
        reducedMotion: increment.reducedMotion,
        radiansPerPixel: increment.radiansPerPixel,
        boundedDx: increment.boundedDx,
        boundedDy: increment.boundedDy,
        inputRevision
      });
    } catch (error) {
      const state = controller.getState();
      if (active?.phase === POINTER_PHASE.DRAGGING && controllerGestureActive(state)) {
        controller.cancel("interaction-preview-failure");
      }
      active = null;
      inputRevision += 1;
      throw error;
    }
  }

  function end(pointer) {
    const admitted = admitEndPointer(pointer);
    if (!active || active.id !== admitted.id) {
      return deepFreeze({
        accepted: false,
        reason: active ? "POINTER_ID_MISMATCH" : "NO_ACTIVE_POINTER",
        pointerId: admitted.id,
        transactionStarted: false,
        inputRevision
      });
    }
    const state = controller.getState();
    if (state.held) return clearForHeld(admitted.id);
    assert(
      admitted.timestamp >= active.timestamp,
      "COMPASS_INTERACTION_POINTER_TIMESTAMP_REGRESSION",
      deepFreeze({ previous: active.timestamp, next: admitted.timestamp })
    );

    const completed = active;
    active = null;
    completed.x = admitted.x;
    completed.y = admitted.y;
    completed.timestamp = admitted.timestamp;
    completed.totalDistance = Math.hypot(
      admitted.x - completed.startX,
      admitted.y - completed.startY
    );
    const durationMs = admitted.timestamp - completed.startedAt;
    inputRevision += 1;

    if (completed.phase === POINTER_PHASE.PENDING) {
      if (admitted.cancel) {
        return deepFreeze({
          accepted: true,
          phase: POINTER_PHASE.CANCELLED,
          mode: "PENDING_CANCEL",
          cancelled: true,
          transactionStarted: false,
          durationMs,
          distancePx: completed.totalDistance,
          targetProposal: null,
          inputRevision
        });
      }
      const withinTapDistance = completed.totalDistance <= PROFILE.tapMaximumDistancePx;
      const withinTapDuration = durationMs <= PROFILE.tapMaximumDurationMs;
      let targetProposal = null;
      if (withinTapDistance && withinTapDuration) {
        const projection = latestProjection(compositor, planet);
        targetProposal = validateTapTarget({
          targetId: completed.targetId,
          snapshot: projection.snapshot,
          state: controller.getState(),
          planet,
          worldRevision: projection.worldRevision
        });
      }
      return deepFreeze({
        accepted: true,
        phase: POINTER_PHASE.COMPLETED,
        mode: targetProposal ? "TAP_PROPOSAL" : "TAP_NO_PROPOSAL",
        cancelled: false,
        transactionStarted: false,
        durationMs,
        distancePx: completed.totalDistance,
        withinTapDistance,
        withinTapDuration,
        targetProposal,
        inputRevision
      });
    }

    if (admitted.cancel) {
      controller.cancel("pointer-end-cancel");
    } else {
      controller.commit();
    }
    return deepFreeze({
      accepted: true,
      phase: admitted.cancel ? POINTER_PHASE.CANCELLED : POINTER_PHASE.COMPLETED,
      mode: admitted.cancel ? "DRAG_CANCEL" : "DRAG_COMMIT",
      cancelled: admitted.cancel,
      transactionStarted: true,
      durationMs,
      distancePx: completed.totalDistance,
      inputRevision
    });
  }

  function interrupt(reason = "interrupted") {
    if (!active) {
      return deepFreeze({
        accepted: false,
        reason: "NO_ACTIVE_POINTER",
        transactionStarted: false,
        inputRevision
      });
    }
    const interrupted = active;
    active = null;
    const state = controller.getState();
    let transactionCancelled = false;
    if (interrupted.phase === POINTER_PHASE.DRAGGING && controllerGestureActive(state)) {
      controller.cancel(String(reason));
      transactionCancelled = true;
    }
    inputRevision += 1;
    return deepFreeze({
      accepted: true,
      phase: POINTER_PHASE.CANCELLED,
      mode: interrupted.phase === POINTER_PHASE.DRAGGING
        ? "DRAG_INTERRUPT"
        : "PENDING_INTERRUPT",
      transactionStarted: interrupted.phase === POINTER_PHASE.DRAGGING,
      transactionCancelled,
      reason: String(reason),
      inputRevision
    });
  }

  return Object.freeze({
    contract: UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT,
    begin,
    move,
    end,
    interrupt,
    getActive: snapshotActive,
    getInputRevision: () => inputRevision,
    getProfile: () => PROFILE,
    getValidationReceipt: () => validationReceipt,
    validate: () => validationReceipt
  });
}
