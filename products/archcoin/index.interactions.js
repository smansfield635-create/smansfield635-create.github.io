/* /products/archcoin/index.interactions.js
   ARCHCOIN pointer lifecycle, gesture classification, target proposal,
   and controller-request authority.

   INTERACTIONS DETERMINES MOTION PROPOSALS.
   CONTROLLER DETERMINES AUTHORITY.
   PLANET DETERMINES WORLD TRUTH.
   COMPOSITOR DETERMINES PROJECTION.
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_INTERACTIONS",
    version: "3.0.0-controller-proposal-boundary",
    file: "/products/archcoin/index.interactions.js",
    projectionSchema: "ARCHCOIN_SHARED_PROJECTION_SNAPSHOT_v2",
    controllerFrameSchema: "ARCHCOIN_CONTROLLER_FRAME_v8"
  });

  const INTENTS = Object.freeze({
    IDLE: "IDLE",
    TAP: "TAP",
    ORBIT_ROTATE: "ORBIT_ROTATE",
    CLUSTER_ROTATE: "CLUSTER_ROTATE",
    CANCELLED: "CANCELLED"
  });

  const TARGET_KINDS = Object.freeze({
    CARDINAL: "cardinal",
    ROOM: "room",
    COMPASS: "compass",
    OPEN_SPACE: "open-space"
  });

  const DEFAULTS = Object.freeze({
    tapMaximumDistancePx: 7,
    tapMaximumDurationMs: 650,
    dragActivationDistancePx: 11,
    orbitRadiansPerPixel: 0.0056,
    clusterRadiansPerPixel: 0.0062,
    maximumIncrementalAngle: 0.18,
    minimumHitRadiusPx: 22,
    maximumHitRadiusPx: 96,
    hitRadiusScale: 1.18,
    targetRetentionBonus: 0.1,
    frontFacingBonus: 0.14,
    directSemanticBonus: 0.12,
    normalizedDistanceWeight: 0.55,
    priorityWeight: 0.31,
    rearPenalty: 0.3,
    reducedMotionMultiplier: 0.72
  });

  const state = {
    controller: null,
    root: null,
    projectionSnapshot: null,
    frameState: null,
    active: null,
    options: { ...DEFAULTS },
    listeners: [],
    initialized: false,
    disposed: false,
    lastIntent: INTENTS.IDLE,
    lastTarget: null,
    lastError: "",
    lastAction: "pending"
  };

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function distance(a, b) {
    return Math.hypot(finite(a.x) - finite(b.x), finite(a.y) - finite(b.y));
  }

  function normalizePoint(input) {
    return Object.freeze({
      x: finite(input && (input.clientX ?? input.x)),
      y: finite(input && (input.clientY ?? input.y)),
      time: finite(input && input.timeStamp, Date.now()),
      pointerId: input && input.pointerId != null ? input.pointerId : 0,
      pointerType: String(input && input.pointerType || "mouse"),
      button: finite(input && input.button, 0),
      buttons: finite(input && input.buttons, 0)
    });
  }

  function quaternionNormalize(value) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : [0, 0, 0, 1];
    if (source.length !== 4) return [0, 0, 0, 1];
    const q = source.map((item, index) => finite(item, index === 3 ? 1 : 0));
    const length = Math.hypot(...q);
    return length > 1e-12 ? q.map(item => item / length) : [0, 0, 0, 1];
  }

  function quaternionMultiply(a, b) {
    const first = quaternionNormalize(a);
    const second = quaternionNormalize(b);
    return quaternionNormalize([
      first[3] * second[0] + first[0] * second[3] + first[1] * second[2] - first[2] * second[1],
      first[3] * second[1] - first[0] * second[2] + first[1] * second[3] + first[2] * second[0],
      first[3] * second[2] + first[0] * second[1] - first[1] * second[0] + first[2] * second[3],
      first[3] * second[3] - first[0] * second[0] - first[1] * second[1] - first[2] * second[2]
    ]);
  }

  function quaternionFromAxisAngle(axis, angle) {
    const source = Array.isArray(axis) ? axis : [0, 1, 0];
    const length = Math.hypot(finite(source[0]), finite(source[1]), finite(source[2])) || 1;
    const half = finite(angle) / 2;
    const sine = Math.sin(half);
    return quaternionNormalize([
      finite(source[0]) / length * sine,
      finite(source[1]) / length * sine,
      finite(source[2]) / length * sine,
      Math.cos(half)
    ]);
  }

  function gestureQuaternion(dx, dy, scale) {
    const multiplier = state.frameState && state.frameState.reducedMotion
      ? state.options.reducedMotionMultiplier
      : 1;
    const yaw = clamp(dx * scale * multiplier, -state.options.maximumIncrementalAngle, state.options.maximumIncrementalAngle);
    const pitch = clamp(dy * scale * multiplier, -state.options.maximumIncrementalAngle, state.options.maximumIncrementalAngle);
    return quaternionMultiply(
      quaternionFromAxisAngle([0, 1, 0], yaw),
      quaternionFromAxisAngle([1, 0, 0], pitch)
    );
  }

  function records() {
    const snapshot = state.projectionSnapshot;
    return snapshot && Array.isArray(snapshot.records) ? snapshot.records : [];
  }

  function targetKind(record) {
    if (!record) return TARGET_KINDS.OPEN_SPACE;
    if (record.kind === "cardinal") return TARGET_KINDS.CARDINAL;
    if (record.kind === "room") return TARGET_KINDS.ROOM;
    if (record.kind === "compass") return TARGET_KINDS.COMPASS;
    return TARGET_KINDS.OPEN_SPACE;
  }

  function interactionPriority(record) {
    if (!record || record.selectable !== true || record.visible === false) return 0;
    if (record.depthLayer === "front") return 300;
    if (record.kind === "compass") return 200;
    if (record.depthLayer === "rear") return 100;
    return 50;
  }

  function scoreTarget(record, point, currentTarget) {
    if (!record || record.selectable !== true || record.visible === false || record.kind === "planet") {
      return -Infinity;
    }
    const radius = clamp(
      finite(record.radiusPx, state.options.minimumHitRadiusPx) * state.options.hitRadiusScale,
      state.options.minimumHitRadiusPx,
      state.options.maximumHitRadiusPx
    );
    const targetPoint = { x: finite(record.x), y: finite(record.y) };
    const normalizedDistance = distance(targetPoint, point) / radius;
    if (normalizedDistance > 1) return -Infinity;
    let score = (1 - normalizedDistance) * state.options.normalizedDistanceWeight;
    score += interactionPriority(record) / 300 * state.options.priorityWeight;
    if (record.depthLayer === "front") score += state.options.frontFacingBonus;
    if (record.depthLayer === "rear") score -= state.options.rearPenalty;
    if (currentTarget && currentTarget.nodeKey === record.nodeKey) score += state.options.targetRetentionBonus;
    if (record.semanticIdentity) score += state.options.directSemanticBonus;
    return score;
  }

  function resolveTarget(point, currentTarget = null) {
    let winner = null;
    let winnerScore = -Infinity;
    for (const record of records()) {
      const score = scoreTarget(record, point, currentTarget);
      if (score > winnerScore) {
        winner = record;
        winnerScore = score;
      }
    }
    return winner
      ? Object.freeze({
          nodeKey: winner.nodeKey,
          id: winner.semanticIdentity || winner.id || "",
          wing: winner.wing || "",
          kind: targetKind(winner),
          score: winnerScore,
          record: winner
        })
      : Object.freeze({
          nodeKey: "",
          id: "",
          wing: "",
          kind: TARGET_KINDS.OPEN_SPACE,
          score: 0,
          record: null
        });
  }

  function callController(method, ...args) {
    const controller = state.controller;
    if (!controller || typeof controller[method] !== "function") return false;
    try {
      return controller[method](...args);
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      state.lastAction = `controller-error:${method}`;
      return false;
    }
  }

  function currentPresentationMode() {
    return String(state.frameState && state.frameState.presentationMode || "CONSTELLATION");
  }

  function startGesture(point, target) {
    const scope = currentPresentationMode() === "CLUSTER" ? "CLUSTER" : "ORBIT";
    const wing = target.wing || (state.frameState && state.frameState.selectedWing) || "north";
    if (scope === "CLUSTER") callController("beginClusterGesture", wing);
    else callController("beginOrbitGesture");
    callController("beginGesture", {
      scope,
      target: target.nodeKey || "",
      pointerId: point.pointerId,
      startedAt: point.time
    });
    return scope;
  }

  function updateGesture(point) {
    const active = state.active;
    if (!active) return false;
    const dx = point.x - active.last.x;
    const dy = point.y - active.last.y;
    const totalDistance = distance(point, active.start);
    const nextTarget = resolveTarget(point, active.target);
    if (nextTarget.nodeKey !== active.target.nodeKey && nextTarget.nodeKey) {
      callController("replaceGestureTarget", nextTarget.nodeKey);
      active.target = nextTarget;
    }
    if (!active.dragging && totalDistance >= state.options.dragActivationDistancePx) {
      active.dragging = true;
      active.intent = active.scope === "CLUSTER" ? INTENTS.CLUSTER_ROTATE : INTENTS.ORBIT_ROTATE;
    }
    if (active.dragging) {
      const scale = active.scope === "CLUSTER"
        ? state.options.clusterRadiansPerPixel
        : state.options.orbitRadiansPerPixel;
      const quaternion = gestureQuaternion(dx, dy, scale);
      if (active.scope === "CLUSTER") {
        callController("requestClusterPreview", active.wing, {
          quaternion,
          primaryId: active.target.id || ""
        });
      } else {
        callController("requestOrbitPreview", {
          quaternion,
          primaryId: active.target.wing || active.target.id || ""
        });
      }
    }
    active.last = point;
    state.lastTarget = active.target;
    state.lastIntent = active.intent;
    state.lastAction = "pointer-move";
    return true;
  }

  function commitTap(target) {
    if (!target || target.kind === TARGET_KINDS.OPEN_SPACE) return false;
    if (target.kind === TARGET_KINDS.CARDINAL) return Boolean(callController("requestCardinalSelection", target.wing || target.id));
    if (target.kind === TARGET_KINDS.ROOM) return Boolean(callController("requestRoomSelection", target.id));
    if (target.kind === TARGET_KINDS.COMPASS) return Boolean(callController("requestCompassSelection"));
    return false;
  }

  function finishGesture(point, cancelled = false) {
    const active = state.active;
    if (!active) return false;
    const elapsed = Math.max(0, point.time - active.start.time);
    const travelled = distance(point, active.start);
    let committed = false;
    if (cancelled) {
      if (active.scope === "CLUSTER") callController("requestClusterCancel", active.wing, "pointer-cancel");
      else callController("requestOrbitCancel", "pointer-cancel");
      state.lastIntent = INTENTS.CANCELLED;
    } else if (!active.dragging && travelled <= state.options.tapMaximumDistancePx && elapsed <= state.options.tapMaximumDurationMs) {
      active.intent = INTENTS.TAP;
      committed = commitTap(resolveTarget(point, active.target));
      state.lastIntent = INTENTS.TAP;
    } else if (active.dragging) {
      if (active.scope === "CLUSTER") committed = Boolean(callController("requestClusterCommit", active.wing));
      else committed = Boolean(callController("requestOrbitCommit"));
      state.lastIntent = active.intent;
    } else {
      if (active.scope === "CLUSTER") callController("requestClusterCancel", active.wing, "gesture-below-threshold");
      else callController("requestOrbitCancel", "gesture-below-threshold");
      state.lastIntent = INTENTS.CANCELLED;
    }
    callController("endGesture", {
      committed,
      cancelled,
      intent: state.lastIntent,
      pointerId: point.pointerId
    });
    state.active = null;
    state.lastAction = cancelled ? "pointer-cancel" : "pointer-up";
    return committed;
  }

  function onPointerDown(event) {
    const point = normalizePoint(event);
    if (point.button !== 0 || state.active) return false;
    const target = resolveTarget(point);
    const scope = startGesture(point, target);
    state.active = {
      pointerId: point.pointerId,
      pointerType: point.pointerType,
      start: point,
      last: point,
      target,
      wing: target.wing || (state.frameState && state.frameState.selectedWing) || "north",
      scope,
      intent: INTENTS.IDLE,
      dragging: false
    };
    state.lastTarget = target;
    state.lastIntent = INTENTS.IDLE;
    state.lastAction = "pointer-down";
    if (event && event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
      try { event.currentTarget.setPointerCapture(point.pointerId); } catch (_) {}
    }
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    return true;
  }

  function onPointerMove(event) {
    const point = normalizePoint(event);
    if (!state.active || point.pointerId !== state.active.pointerId) return false;
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    return updateGesture(point);
  }

  function onPointerUp(event) {
    const point = normalizePoint(event);
    if (!state.active || point.pointerId !== state.active.pointerId) return false;
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    return finishGesture(point, false);
  }

  function onPointerCancel(event) {
    const point = normalizePoint(event);
    if (!state.active || point.pointerId !== state.active.pointerId) return false;
    return finishGesture(point, true);
  }

  function setProjectionSnapshot(snapshot) {
    if (!snapshot || snapshot.schema !== MODULE.projectionSchema) {
      throw new TypeError(`Expected ${MODULE.projectionSchema}.`);
    }
    state.projectionSnapshot = snapshot;
    state.lastAction = "projection-update";
    return true;
  }

  function setFrameState(frame) {
    state.frameState = frame || null;
    state.lastAction = "frame-update";
    return true;
  }

  function bindListener(target, type, handler, options) {
    if (!target || typeof target.addEventListener !== "function") return;
    target.addEventListener(type, handler, options);
    state.listeners.push(() => target.removeEventListener(type, handler, options));
  }

  function initialize(options = {}) {
    state.controller = options.controller || globalThis.DGB_ARCHCOIN_CONTROLLER || null;
    state.root = options.root || (typeof document !== "undefined" ? document : null);
    state.options = { ...DEFAULTS, ...(options.motion || {}) };
    state.projectionSnapshot = options.projectionSnapshot || null;
    state.frameState = options.frameState || (
      state.controller && typeof state.controller.getFrameState === "function"
        ? state.controller.getFrameState()
        : null
    );
    const target = options.pointerTarget
      || (state.root && typeof state.root.querySelector === "function"
        ? state.root.querySelector("[data-archcoin-world-mount]")
        : null);
    bindListener(target, "pointerdown", onPointerDown, { passive: false });
    bindListener(target, "pointermove", onPointerMove, { passive: false });
    bindListener(target, "pointerup", onPointerUp, { passive: false });
    bindListener(target, "pointercancel", onPointerCancel, { passive: false });
    state.initialized = true;
    state.disposed = false;
    state.lastError = "";
    state.lastAction = "initialize";
    return receipt();
  }

  function getInteractionContract() {
    return Object.freeze({
      module: MODULE,
      ownsPointerLifecycle: true,
      ownsGestureClassification: true,
      ownsMotionProposal: true,
      ownsNavigationAuthority: false,
      ownsWorldGeometry: false,
      ownsCommittedState: false,
      projectionSchema: MODULE.projectionSchema
    });
  }

  function receipt() {
    return Object.freeze({
      module: MODULE.id,
      version: MODULE.version,
      initialized: state.initialized,
      disposed: state.disposed,
      activePointerId: state.active ? state.active.pointerId : null,
      lastIntent: state.lastIntent,
      lastTargetKey: state.lastTarget ? state.lastTarget.nodeKey : "",
      lastError: state.lastError,
      lastAction: state.lastAction
    });
  }

  function dispose() {
    while (state.listeners.length) {
      const remove = state.listeners.pop();
      try { remove(); } catch (_) {}
    }
    if (state.active) {
      callController("endGesture", {
        committed: false,
        cancelled: true,
        intent: INTENTS.CANCELLED,
        pointerId: state.active.pointerId
      });
    }
    state.controller = null;
    state.root = null;
    state.projectionSnapshot = null;
    state.frameState = null;
    state.active = null;
    state.initialized = false;
    state.disposed = true;
    state.lastAction = "dispose";
    return receipt();
  }

  const API = Object.freeze({
    MODULE,
    INTENTS,
    TARGET_KINDS,
    initialize,
    setProjectionSnapshot,
    setFrameState,
    resolveTarget,
    scoreTarget,
    gestureQuaternion,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    getInteractionContract,
    receipt,
    dispose
  });

  globalThis.DGB_ARCHCOIN_INTERACTIONS = API;
})();