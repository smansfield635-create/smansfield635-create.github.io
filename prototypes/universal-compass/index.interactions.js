/*
 * Universal Compass pointer-input and gesture-proposal authority.
 * Neutral seven-file compatibility implementation.
 *
 * Consumes accepted Controller state, immutable Planet identity facts, and the
 * latest immutable Compositor projection. Publishes bounded pointer results and
 * nonauthoritative target/orientation proposals only. It owns no world,
 * geometry, camera, projection, controller-state, target-acceptance,
 * navigation, route, product, or production authority.
 */

export const UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT = Object.freeze({
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
  recordImmutability: "DEEP"
});

export const POINTER_KIND = Object.freeze({
  MOUSE: "MOUSE",
  TOUCH: "TOUCH",
  PEN: "PEN"
});

export const POINTER_PHASE = Object.freeze({
  PENDING: "PENDING",
  DRAGGING: "DRAGGING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
});

const PRESENTATION = Object.freeze({
  CONSTELLATION: "CONSTELLATION",
  CLUSTER: "CLUSTER"
});

const RESULT_SCHEMA = "UNIVERSAL_COMPASS_INTERACTION_RESULT_v1";
const TARGET_PROPOSAL_SCHEMA =
  "UNIVERSAL_COMPASS_TARGET_PROPOSAL_v1";
const VALIDATION_SCHEMA =
  "UNIVERSAL_COMPASS_INTERACTION_VALIDATION_RECEIPT_v1";
const EPSILON = 1e-8;

const LOCKED_PROFILE = deepFreeze({
  id: "DGB_UNIVERSAL_COMPASS_LOCKED_NEUTRAL_INTERACTION_PROFILE_v1",
  revision: 1,
  smoothing: {
    MOUSE: 0.72,
    TOUCH: 0.48,
    PEN: 0.64
  },
  radiansPerPixel: 0.0065,
  reducedMotionMultiplier: 0.42,
  maximumIncrementalAngle: Math.PI / 12,
  dragActivationDistancePx: 7,
  tapMaximumDistancePx: 10,
  tapMaximumDurationMs: 650
});

const BEGIN_REQUIRED_KEYS = Object.freeze(["id", "kind", "x", "y"]);
const BEGIN_ALLOWED_KEYS = Object.freeze([
  "id", "kind", "x", "y", "timestamp", "targetId"
]);
const MOVE_REQUIRED_KEYS = Object.freeze(["id", "x", "y"]);
const MOVE_ALLOWED_KEYS = Object.freeze(["id", "x", "y", "timestamp"]);
const END_REQUIRED_KEYS = Object.freeze(["id"]);
const END_ALLOWED_KEYS = Object.freeze([
  "id", "x", "y", "timestamp", "targetId"
]);
const END_OPTION_ALLOWED_KEYS = Object.freeze(["cancel"]);

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
  ) {
    return value;
  }
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

function admittedRecord(value, requiredKeys, allowedKeys, code) {
  plainRecord(value, code);
  const actual = Object.keys(value);
  const unknown = actual.filter(key => !allowedKeys.includes(key));
  const missing = requiredKeys.filter(key => !(key in value));
  assert(
    unknown.length === 0 && missing.length === 0,
    code,
    deepFreeze({
      actual,
      allowed: [...allowedKeys],
      required: [...requiredKeys],
      unknown,
      missing
    })
  );
  return value;
}

function finite(value, code) {
  const admitted = Number(value);
  assert(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function nonnegativeTime(value, fallback, code) {
  const admitted = value === undefined
    ? finite(fallback(), code)
    : finite(value, code);
  assert(admitted >= 0, code, admitted);
  return admitted;
}

function requirePointerId(value) {
  assert(
    value !== undefined && value !== null,
    "COMPASS_INTERACTION_POINTER_ID_REQUIRED",
    value
  );
  const admitted = String(value);
  assert(
    admitted.length > 0,
    "COMPASS_INTERACTION_POINTER_ID_REQUIRED",
    value
  );
  return admitted;
}

function optionalId(value) {
  return String(value ?? "").trim();
}

function vector3(value, code) {
  assert(Array.isArray(value) && value.length === 3, code, value);
  return value.map(component => finite(component, code));
}

function normalize3(value, code) {
  const admitted = vector3(value, code);
  const length = Math.hypot(...admitted);
  assert(length > EPSILON, code, value);
  return admitted.map(component => component / length);
}

function quaternion(value, code) {
  assert(Array.isArray(value) && value.length === 4, code, value);
  const admitted = value.map(component => finite(component, code));
  const length = Math.hypot(...admitted);
  assert(length > EPSILON, code, value);
  return admitted.map(component => component / length);
}

function multiplyQuaternion(leftValue, rightValue) {
  const left = quaternion(
    leftValue,
    "COMPASS_INTERACTION_LEFT_QUATERNION_INVALID"
  );
  const right = quaternion(
    rightValue,
    "COMPASS_INTERACTION_RIGHT_QUATERNION_INVALID"
  );
  return quaternion([
    left[3] * right[0] + left[0] * right[3] + left[1] * right[2] - left[2] * right[1],
    left[3] * right[1] - left[0] * right[2] + left[1] * right[3] + left[2] * right[0],
    left[3] * right[2] + left[0] * right[1] - left[1] * right[0] + left[2] * right[3],
    left[3] * right[3] - left[0] * right[0] - left[1] * right[1] - left[2] * right[2]
  ], "COMPASS_INTERACTION_QUATERNION_COMPOSITION_INVALID");
}

function quaternionFromAxisAngle(axisValue, angleValue) {
  const axis = normalize3(
    axisValue,
    "COMPASS_INTERACTION_ROTATION_AXIS_INVALID"
  );
  const angle = finite(
    angleValue,
    "COMPASS_INTERACTION_ROTATION_ANGLE_INVALID"
  );
  const half = angle * 0.5;
  const sine = Math.sin(half);
  return quaternion([
    axis[0] * sine,
    axis[1] * sine,
    axis[2] * sine,
    Math.cos(half)
  ], "COMPASS_INTERACTION_AXIS_ANGLE_QUATERNION_INVALID");
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, stableValue(value[key])])
    );
  }
  return typeof value === "number"
    ? finite(value, "COMPASS_INTERACTION_NONFINITE_NUMBER")
    : value;
}

function deterministicHash(value) {
  const source = JSON.stringify(stableValue(value));
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, "0")}`;
}

function immutableResult(body) {
  const result = {
    schema: RESULT_SCHEMA,
    ...body
  };
  return deepFreeze({
    ...result,
    resultHash: deterministicHash(result)
  });
}

function activeOrientation(state) {
  plainRecord(
    state,
    "COMPASS_INTERACTION_CONTROLLER_STATE_REQUIRED"
  );
  assert(
    Object.values(PRESENTATION).includes(state.presentation),
    "COMPASS_INTERACTION_PRESENTATION_INVALID",
    state.presentation
  );
  if (state.presentation === PRESENTATION.CONSTELLATION) {
    plainRecord(
      state.constellation,
      "COMPASS_INTERACTION_CONSTELLATION_ORIENTATION_REQUIRED"
    );
    return state.constellation;
  }
  const cardinalId = optionalId(state.activeCardinalId);
  assert(
    cardinalId.length > 0,
    "COMPASS_INTERACTION_ACTIVE_CARDINAL_REQUIRED"
  );
  plainRecord(
    state.clusters,
    "COMPASS_INTERACTION_CLUSTER_STATE_REQUIRED"
  );
  const record = state.clusters[cardinalId];
  plainRecord(
    record,
    "COMPASS_INTERACTION_ACTIVE_CLUSTER_ORIENTATION_REQUIRED"
  );
  return record;
}

function validateController(controller) {
  plainRecord(controller, "COMPASS_INTERACTION_CONTROLLER_REQUIRED");
  for (const method of [
    "getState",
    "beginGesture",
    "preview",
    "commit",
    "cancel"
  ]) {
    assert(
      typeof controller[method] === "function",
      `COMPASS_INTERACTION_CONTROLLER_${method.toUpperCase()}_REQUIRED`
    );
  }
  return controller;
}

function validatePlanet(planet) {
  plainRecord(planet, "COMPASS_INTERACTION_PLANET_REQUIRED");
  for (const method of [
    "getWorldRevision",
    "hasCardinal",
    "hasChild",
    "isChildOfCardinal"
  ]) {
    assert(
      typeof planet[method] === "function",
      `COMPASS_INTERACTION_PLANET_${method.toUpperCase()}_REQUIRED`
    );
  }
  return planet;
}

function validateCompositor(compositor) {
  plainRecord(
    compositor,
    "COMPASS_INTERACTION_COMPOSITOR_REQUIRED"
  );
  assert(
    typeof compositor.getLastProjection === "function",
    "COMPASS_INTERACTION_COMPOSITOR_GETLASTPROJECTION_REQUIRED"
  );
  return compositor;
}

function validateProjectionSnapshot(snapshot, worldRevision) {
  plainRecord(
    snapshot,
    "COMPASS_INTERACTION_PROJECTION_REQUIRED"
  );
  assert(
    Number.isInteger(snapshot.projectionRevision) &&
      snapshot.projectionRevision > 0,
    "COMPASS_INTERACTION_PROJECTION_REVISION_INVALID",
    snapshot.projectionRevision
  );
  assert(
    snapshot.worldRevision === worldRevision,
    "COMPASS_INTERACTION_PROJECTION_WORLD_REVISION_STALE",
    deepFreeze({
      projection: snapshot.worldRevision,
      planet: worldRevision
    })
  );
  plainRecord(
    snapshot.viewport,
    "COMPASS_INTERACTION_VIEWPORT_REQUIRED"
  );
  const width = finite(
    snapshot.viewport.width,
    "COMPASS_INTERACTION_VIEWPORT_WIDTH_INVALID"
  );
  const height = finite(
    snapshot.viewport.height,
    "COMPASS_INTERACTION_VIEWPORT_HEIGHT_INVALID"
  );
  assert(
    width > 0 && height > 0,
    "COMPASS_INTERACTION_VIEWPORT_INVALID"
  );
  plainRecord(
    snapshot.cameraBasis,
    "COMPASS_INTERACTION_CAMERA_BASIS_REQUIRED"
  );
  const cameraBasis = deepFreeze({
    right: normalize3(
      snapshot.cameraBasis.right,
      "COMPASS_INTERACTION_CAMERA_RIGHT_INVALID"
    ),
    up: normalize3(
      snapshot.cameraBasis.up,
      "COMPASS_INTERACTION_CAMERA_UP_INVALID"
    ),
    forward: normalize3(
      snapshot.cameraBasis.forward,
      "COMPASS_INTERACTION_CAMERA_FORWARD_INVALID"
    )
  });
  assert(
    Array.isArray(snapshot.interactionProjectionRecords),
    "COMPASS_INTERACTION_PROJECTION_RECORDS_REQUIRED"
  );
  return deepFreeze({
    snapshot,
    viewport: deepFreeze({ width, height }),
    cameraBasis,
    records: snapshot.interactionProjectionRecords
  });
}

function recordEligibleForState(record, state, planet) {
  if (
    !record ||
    record.interactionEligible !== true ||
    record.visible !== true
  ) {
    return false;
  }
  if (state.presentation === PRESENTATION.CONSTELLATION) {
    return record.kind === "CARDINAL" && planet.hasCardinal(record.id);
  }
  return (
    record.kind === "CHILD" &&
    record.parentId === state.activeCardinalId &&
    planet.hasChild(record.id) &&
    planet.isChildOfCardinal(record.id, state.activeCardinalId)
  );
}

function eligibleRecords(projection, state, planet) {
  return projection.records.filter(record =>
    recordEligibleForState(record, state, planet)
  );
}

function primaryProposal(projection, state, planet) {
  const candidates = eligibleRecords(projection, state, planet);
  assert(
    candidates.length > 0,
    "COMPASS_INTERACTION_PRIMARY_PROPOSAL_UNAVAILABLE",
    deepFreeze({
      presentation: state.presentation,
      activeCardinalId: optionalId(state.activeCardinalId),
      projectionRevision: projection.snapshot.projectionRevision
    })
  );
  const centerX = projection.viewport.width * 0.5;
  const centerY = projection.viewport.height * 0.5;
  const ranked = candidates
    .map(record => {
      const screenX = finite(
        record.screenX,
        "COMPASS_INTERACTION_RECORD_SCREEN_X_INVALID"
      );
      const screenY = finite(
        record.screenY,
        "COMPASS_INTERACTION_RECORD_SCREEN_Y_INVALID"
      );
      const dx = screenX - centerX;
      const dy = screenY - centerY;
      return {
        record,
        distanceSquared: dx * dx + dy * dy,
        viewDepth: finite(
          record.viewDepth,
          "COMPASS_INTERACTION_RECORD_VIEW_DEPTH_INVALID"
        ),
        canonicalOrder: Number.isInteger(record.canonicalOrder)
          ? record.canonicalOrder
          : Number.MAX_SAFE_INTEGER
      };
    })
    .sort((a, b) =>
      a.distanceSquared - b.distanceSquared ||
      a.viewDepth - b.viewDepth ||
      a.canonicalOrder - b.canonicalOrder ||
      String(a.record.id).localeCompare(String(b.record.id))
    );
  return deepFreeze({
    id: String(ranked[0].record.id),
    distanceSquared: ranked[0].distanceSquared,
    projectionRevision: projection.snapshot.projectionRevision
  });
}

function validateTargetId(targetId, projection, state, planet) {
  const id = optionalId(targetId);
  assert(id.length > 0, "COMPASS_INTERACTION_TARGET_ID_REQUIRED");
  const record = projection.records.find(candidate => candidate.id === id);
  assert(
    recordEligibleForState(record, state, planet),
    "COMPASS_INTERACTION_TARGET_NOT_INTERACTION_ELIGIBLE",
    deepFreeze({
      targetId: id,
      presentation: state.presentation,
      activeCardinalId: optionalId(state.activeCardinalId),
      projectionRevision: projection.snapshot.projectionRevision
    })
  );
  return deepFreeze({ id, record });
}

function gestureQuaternion({
  dx,
  dy,
  orientation,
  basis,
  reducedMotion
}) {
  const multiplier = reducedMotion
    ? LOCKED_PROFILE.reducedMotionMultiplier
    : 1;
  const radiansPerPixel = LOCKED_PROFILE.radiansPerPixel * multiplier;
  const yaw = clamp(
    -dx * radiansPerPixel,
    -LOCKED_PROFILE.maximumIncrementalAngle,
    LOCKED_PROFILE.maximumIncrementalAngle
  );
  const pitch = clamp(
    -dy * radiansPerPixel,
    -LOCKED_PROFILE.maximumIncrementalAngle,
    LOCKED_PROFILE.maximumIncrementalAngle
  );
  const yawQuaternion = quaternionFromAxisAngle(basis.up, yaw);
  const pitchQuaternion = quaternionFromAxisAngle(basis.right, pitch);
  const delta = multiplyQuaternion(yawQuaternion, pitchQuaternion);
  return deepFreeze(
    multiplyQuaternion(
      delta,
      quaternion(
        orientation.quaternion,
        "COMPASS_INTERACTION_ACTIVE_ORIENTATION_QUATERNION_INVALID"
      )
    )
  );
}

function validateLockedProfile() {
  const smoothingValues = Object.values(LOCKED_PROFILE.smoothing);
  const findings = [
    ["LOCKED_PROFILE_IMMUTABLE", Object.isFrozen(LOCKED_PROFILE)],
    ["SUPPORTED_POINTER_KIND_COUNT", Object.keys(POINTER_KIND).length === 3],
    [
      "SMOOTHING_FINITE_BOUNDED",
      smoothingValues.every(value =>
        Number.isFinite(value) && value > 0 && value <= 1
      )
    ],
    [
      "RADIANS_PER_PIXEL_POSITIVE",
      LOCKED_PROFILE.radiansPerPixel > 0
    ],
    [
      "REDUCED_MOTION_MULTIPLIER_BOUNDED",
      LOCKED_PROFILE.reducedMotionMultiplier > 0 &&
        LOCKED_PROFILE.reducedMotionMultiplier <= 1
    ],
    [
      "MAXIMUM_ANGLE_POSITIVE",
      LOCKED_PROFILE.maximumIncrementalAngle > 0
    ],
    [
      "DRAG_THRESHOLD_POSITIVE",
      LOCKED_PROFILE.dragActivationDistancePx > 0
    ],
    [
      "TAP_DISTANCE_NONNEGATIVE",
      LOCKED_PROFILE.tapMaximumDistancePx >= 0
    ],
    [
      "TAP_DURATION_POSITIVE",
      LOCKED_PROFILE.tapMaximumDurationMs > 0
    ],
    [
      "NO_WORLD_AUTHORITY",
      UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.worldAuthority === false
    ],
    [
      "NO_PROJECTION_AUTHORITY",
      UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.projectionAuthority === false
    ],
    [
      "NO_TARGET_ACCEPTANCE_AUTHORITY",
      UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.targetAcceptanceAuthority === false
    ],
    [
      "NO_PRODUCT_AUTHORITY",
      UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT.productAuthority === false
    ]
  ].map(([id, pass]) =>
    deepFreeze({
      id,
      status: pass ? "PASS" : "FAIL",
      pass
    })
  );
  const failed = findings.filter(finding => !finding.pass);
  const body = {
    schema: VALIDATION_SCHEMA,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: {
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length
    },
    profileId: LOCKED_PROFILE.id,
    profileRevision: LOCKED_PROFILE.revision,
    findings,
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  };
  return deepFreeze({
    ...body,
    receiptHash: deterministicHash(body)
  });
}

const STATIC_VALIDATION_RECEIPT = validateLockedProfile();
assert(
  STATIC_VALIDATION_RECEIPT.status === "PASS",
  "COMPASS_INTERACTION_STATIC_VALIDATION_FAILED",
  STATIC_VALIDATION_RECEIPT
);

export function createInteractionAuthority({
  controller,
  planet,
  compositor,
  clock = () => Date.now()
} = {}) {
  const controllerAuthority = validateController(controller);
  const planetAuthority = validatePlanet(planet);
  const compositorAuthority = validateCompositor(compositor);
  assert(
    typeof clock === "function",
    "COMPASS_INTERACTION_CLOCK_REQUIRED"
  );

  let active = null;

  function controllerState() {
    const state = controllerAuthority.getState();
    plainRecord(
      state,
      "COMPASS_INTERACTION_CONTROLLER_STATE_REQUIRED"
    );
    assert(
      typeof state.held === "boolean",
      "COMPASS_INTERACTION_HELD_STATE_INVALID"
    );
    assert(
      typeof state.reducedMotion === "boolean",
      "COMPASS_INTERACTION_REDUCED_MOTION_INVALID"
    );
    activeOrientation(state);
    return state;
  }

  function projectionForState(state) {
    const worldRevision = planetAuthority.getWorldRevision();
    assert(
      Number.isInteger(worldRevision) && worldRevision >= 0,
      "COMPASS_INTERACTION_WORLD_REVISION_INVALID",
      worldRevision
    );
    return validateProjectionSnapshot(
      compositorAuthority.getLastProjection(),
      worldRevision
    );
  }

  function snapshotActive() {
    return active ? deepFreeze(structuredClone(active)) : null;
  }

  function rejectHeldActive(state) {
    if (!state.held || !active) return null;
    const interrupted = active;
    active = null;
    if (interrupted.phase === POINTER_PHASE.DRAGGING) {
      controllerAuthority.cancel("held-state");
    }
    return immutableResult({
      accepted: false,
      reason: "HELD",
      phase: POINTER_PHASE.CANCELLED,
      mode: interrupted.phase === POINTER_PHASE.DRAGGING
        ? "DRAG_HELD_CANCEL"
        : "PENDING_HELD_CANCEL",
      pointerId: interrupted.id,
      transactionStarted:
        interrupted.phase === POINTER_PHASE.DRAGGING
    });
  }

  function begin(pointer) {
    admittedRecord(
      pointer,
      BEGIN_REQUIRED_KEYS,
      BEGIN_ALLOWED_KEYS,
      "COMPASS_INTERACTION_BEGIN_POINTER_KEYS_INVALID"
    );
    assert(
      !active,
      "COMPASS_INTERACTION_POINTER_ALREADY_ACTIVE"
    );
    const state = controllerState();
    if (state.held) {
      return immutableResult({
        accepted: false,
        reason: "HELD",
        phase: POINTER_PHASE.CANCELLED,
        mode: "BEGIN_REJECTED",
        transactionStarted: false
      });
    }
    const kind = String(pointer.kind ?? "").toUpperCase();
    assert(
      Object.values(POINTER_KIND).includes(kind),
      "COMPASS_INTERACTION_POINTER_KIND_UNSUPPORTED",
      pointer.kind
    );
    const projection = projectionForState(state);
    const targetId = optionalId(pointer.targetId);
    if (targetId) {
      validateTargetId(
        targetId,
        projection,
        state,
        planetAuthority
      );
    }
    const id = requirePointerId(pointer.id);
    const x = finite(
      pointer.x,
      "COMPASS_INTERACTION_POINTER_X_INVALID"
    );
    const y = finite(
      pointer.y,
      "COMPASS_INTERACTION_POINTER_Y_INVALID"
    );
    const startedAt = nonnegativeTime(
      pointer.timestamp,
      clock,
      "COMPASS_INTERACTION_POINTER_TIMESTAMP_INVALID"
    );
    active = {
      id,
      kind,
      phase: POINTER_PHASE.PENDING,
      startX: x,
      startY: y,
      x,
      y,
      filteredDx: 0,
      filteredDy: 0,
      totalDistance: 0,
      startedAt,
      targetId,
      startingProjectionRevision:
        projection.snapshot.projectionRevision
    };
    return immutableResult({
      accepted: true,
      pointerId: id,
      pointerKind: kind,
      phase: POINTER_PHASE.PENDING,
      transactionStarted: false,
      targetId,
      projectionRevision: projection.snapshot.projectionRevision
    });
  }

  function move(pointer) {
    admittedRecord(
      pointer,
      MOVE_REQUIRED_KEYS,
      MOVE_ALLOWED_KEYS,
      "COMPASS_INTERACTION_MOVE_POINTER_KEYS_INVALID"
    );
    const pointerId = requirePointerId(pointer.id);
    if (!active || active.id !== pointerId) {
      return immutableResult({
        accepted: false,
        reason: "POINTER_NOT_ACTIVE",
        pointerId,
        transactionStarted: false
      });
    }
    const stateBefore = controllerState();
    const heldResult = rejectHeldActive(stateBefore);
    if (heldResult) return heldResult;
    const nextX = finite(
      pointer.x,
      "COMPASS_INTERACTION_POINTER_X_INVALID"
    );
    const nextY = finite(
      pointer.y,
      "COMPASS_INTERACTION_POINTER_Y_INVALID"
    );
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
      totalDistance < LOCKED_PROFILE.dragActivationDistancePx
    ) {
      return immutableResult({
        accepted: true,
        pointerId,
        phase: POINTER_PHASE.PENDING,
        transactionStarted: false,
        totalDistance
      });
    }

    const projection = projectionForState(stateBefore);
    const proposal = primaryProposal(
      projection,
      stateBefore,
      planetAuthority
    );
    const alpha = LOCKED_PROFILE.smoothing[active.kind];
    active.filteredDx =
      active.filteredDx * (1 - alpha) + stepDx * alpha;
    active.filteredDy =
      active.filteredDy * (1 - alpha) + stepDy * alpha;
    const orientation = activeOrientation(stateBefore);
    const proposedQuaternion = gestureQuaternion({
      dx: active.filteredDx,
      dy: active.filteredDy,
      orientation,
      basis: projection.cameraBasis,
      reducedMotion: stateBefore.reducedMotion
    });
    let transactionStarted = false;
    try {
      if (active.phase === POINTER_PHASE.PENDING) {
        controllerAuthority.beginGesture({
          presentation: stateBefore.presentation,
          ...(stateBefore.presentation === PRESENTATION.CLUSTER
            ? { cardinalId: stateBefore.activeCardinalId }
            : {})
        });
        active.phase = POINTER_PHASE.DRAGGING;
        transactionStarted = true;
      }
      const worldRevision = planetAuthority.getWorldRevision();
      controllerAuthority.preview({
        quaternion: proposedQuaternion,
        primaryId: proposal.id,
        worldRevision
      });
      return immutableResult({
        accepted: true,
        pointerId,
        phase: POINTER_PHASE.DRAGGING,
        transactionStarted,
        quaternion: proposedQuaternion,
        primaryId: proposal.id,
        worldRevision,
        projectionRevision: proposal.projectionRevision,
        primaryDistanceSquared: proposal.distanceSquared,
        reducedMotion: stateBefore.reducedMotion,
        effectiveRadiansPerPixel:
          LOCKED_PROFILE.radiansPerPixel *
          (stateBefore.reducedMotion
            ? LOCKED_PROFILE.reducedMotionMultiplier
            : 1)
      });
    } catch (error) {
      if (active?.phase === POINTER_PHASE.DRAGGING) {
        try {
          controllerAuthority.cancel(
            "interaction-preview-failed"
          );
        } finally {
          active = null;
        }
      }
      throw error;
    }
  }

  function end(pointer, options = {}) {
    admittedRecord(
      pointer,
      END_REQUIRED_KEYS,
      END_ALLOWED_KEYS,
      "COMPASS_INTERACTION_END_POINTER_KEYS_INVALID"
    );
    admittedRecord(
      options,
      [],
      END_OPTION_ALLOWED_KEYS,
      "COMPASS_INTERACTION_END_OPTIONS_KEYS_INVALID"
    );
    assert(
      options.cancel === undefined ||
        typeof options.cancel === "boolean",
      "COMPASS_INTERACTION_END_CANCEL_INVALID",
      options.cancel
    );
    const cancel = Boolean(options.cancel);
    const pointerId = requirePointerId(pointer.id);
    if (!active || active.id !== pointerId) {
      return immutableResult({
        accepted: false,
        reason: "POINTER_NOT_ACTIVE",
        pointerId,
        transactionStarted: false
      });
    }
    const state = controllerState();
    const heldResult = rejectHeldActive(state);
    if (heldResult) return heldResult;
    if (pointer.x !== undefined || pointer.y !== undefined) {
      assert(
        pointer.x !== undefined && pointer.y !== undefined,
        "COMPASS_INTERACTION_END_COORDINATES_INCOMPLETE"
      );
      const endX = finite(
        pointer.x,
        "COMPASS_INTERACTION_POINTER_X_INVALID"
      );
      const endY = finite(
        pointer.y,
        "COMPASS_INTERACTION_POINTER_Y_INVALID"
      );
      active.x = endX;
      active.y = endY;
      active.totalDistance = Math.hypot(
        endX - active.startX,
        endY - active.startY
      );
    }
    const endedAt = nonnegativeTime(
      pointer.timestamp,
      clock,
      "COMPASS_INTERACTION_POINTER_TIMESTAMP_INVALID"
    );
    const completed = active;
    active = null;
    const durationMs = Math.max(
      0,
      endedAt - completed.startedAt
    );

    if (completed.phase === POINTER_PHASE.PENDING) {
      const endTargetId = optionalId(pointer.targetId);
      assert(
        !(
          completed.targetId &&
          endTargetId &&
          completed.targetId !== endTargetId
        ),
        "COMPASS_INTERACTION_TARGET_ID_CHANGED",
        deepFreeze({
          beganWith: completed.targetId,
          endedWith: endTargetId
        })
      );
      const targetId = endTargetId || completed.targetId;
      const withinTapDistance =
        completed.totalDistance <=
        LOCKED_PROFILE.tapMaximumDistancePx;
      const withinTapDuration =
        durationMs <= LOCKED_PROFILE.tapMaximumDurationMs;
      if (cancel) {
        return immutableResult({
          accepted: true,
          pointerId,
          phase: POINTER_PHASE.CANCELLED,
          mode: "PENDING_CANCEL",
          cancelled: true,
          transactionStarted: false,
          durationMs,
          totalDistance: completed.totalDistance
        });
      }
      if (
        !withinTapDistance ||
        !withinTapDuration ||
        !targetId
      ) {
        return immutableResult({
          accepted: true,
          pointerId,
          phase: POINTER_PHASE.COMPLETED,
          mode: "TAP_REJECTED",
          cancelled: false,
          transactionStarted: false,
          targetId,
          durationMs,
          totalDistance: completed.totalDistance,
          withinTapDistance,
          withinTapDuration,
          reason: !targetId
            ? "TARGET_REQUIRED"
            : !withinTapDistance
              ? "DISTANCE_EXCEEDED"
              : "DURATION_EXCEEDED",
          targetProposal: null
        });
      }
      const projection = projectionForState(state);
      const admittedTarget = validateTargetId(
        targetId,
        projection,
        state,
        planetAuthority
      );
      const proposalBody = {
        schema: TARGET_PROPOSAL_SCHEMA,
        targetId: admittedTarget.id,
        kind: admittedTarget.record.kind,
        parentId: optionalId(admittedTarget.record.parentId),
        presentation: state.presentation,
        activeCardinalId: optionalId(state.activeCardinalId),
        worldRevision: planetAuthority.getWorldRevision(),
        projectionRevision: projection.snapshot.projectionRevision,
        controllerRevision: Number.isInteger(state.revision)
          ? state.revision
          : 0,
        acceptedByController: false,
        targetAcceptanceAuthority: false
      };
      const targetProposal = deepFreeze({
        ...proposalBody,
        proposalHash: deterministicHash(proposalBody)
      });
      return immutableResult({
        accepted: true,
        pointerId,
        phase: POINTER_PHASE.COMPLETED,
        mode: "TAP_PROPOSAL",
        cancelled: false,
        transactionStarted: false,
        targetId: admittedTarget.id,
        durationMs,
        totalDistance: completed.totalDistance,
        withinTapDistance,
        withinTapDuration,
        targetProposal
      });
    }

    if (cancel) {
      controllerAuthority.cancel("pointer-end");
    } else {
      controllerAuthority.commit();
    }
    return immutableResult({
      accepted: true,
      pointerId,
      phase: cancel
        ? POINTER_PHASE.CANCELLED
        : POINTER_PHASE.COMPLETED,
      mode: cancel ? "DRAG_CANCEL" : "DRAG_COMMIT",
      cancelled: cancel,
      durationMs,
      totalDistance: completed.totalDistance,
      transactionStarted: true
    });
  }

  function interrupt(reason = "interrupted") {
    if (!active) {
      return immutableResult({
        accepted: false,
        reason: "POINTER_NOT_ACTIVE",
        transactionStarted: false
      });
    }
    const interrupted = active;
    active = null;
    const normalizedReason = String(reason || "interrupted");
    if (interrupted.phase === POINTER_PHASE.DRAGGING) {
      controllerAuthority.cancel(normalizedReason);
    }
    return immutableResult({
      accepted: true,
      pointerId: interrupted.id,
      phase: POINTER_PHASE.CANCELLED,
      mode: interrupted.phase === POINTER_PHASE.DRAGGING
        ? "DRAG_INTERRUPT"
        : "PENDING_INTERRUPT",
      transactionStarted:
        interrupted.phase === POINTER_PHASE.DRAGGING,
      reason: normalizedReason
    });
  }

  function getEffectiveRadiansPerPixel() {
    const state = controllerState();
    return LOCKED_PROFILE.radiansPerPixel *
      (state.reducedMotion
        ? LOCKED_PROFILE.reducedMotionMultiplier
        : 1);
  }

  return Object.freeze({
    contract: UNIVERSAL_COMPASS_INTERACTIONS_CONTRACT,
    begin,
    move,
    end,
    interrupt,
    getActive: snapshotActive,
    getLockedProfile: () => LOCKED_PROFILE,
    getEffectiveRadiansPerPixel,
    validate: () => STATIC_VALIDATION_RECEIPT
  });
}
