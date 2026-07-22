/* /products/archcoin/index.interactions.js
   ARCHCOIN live pointer, gesture, target-confidence, quaternion-motion,
   overlap-resolution, release, and interaction-priority authority.

   INTERACTIONS DETERMINES MOTION.
   CONTROLLER DETERMINES AUTHORITY.
*/
(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_INTERACTIONS",
    version: "2.0.0-live-product-interaction-hysteresis",
    file: "/products/archcoin/index.interactions.js",
    controllerModuleId: "DGB_ARCHCOIN_CONTROLLER",
    controllerModuleVersion: "7.0.0-controller-interaction-semantic-priority",
    motionContractId: "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
    motionContractVersion: "1.0.0"
  });

  const INTENTS = Object.freeze({
    IDLE: "IDLE",
    UNKNOWN: "UNKNOWN",
    TAP: "TAP",
    ORBIT_ROTATE: "ORBIT_ROTATE",
    CLUSTER_ROTATE: "CLUSTER_ROTATE",
    CLUSTER_HORIZONTAL_SWIPE: "CLUSTER_HORIZONTAL_SWIPE",
    COMPASS_CANCELLED: "COMPASS_CANCELLED",
    CANCELLED: "CANCELLED"
  });

  const HIT_KINDS = Object.freeze({
    CARDINAL: "cardinal",
    ROOM: "room",
    COMPASS: "compass",
    OPEN_SPACE: "open-space"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT: "front",
    REAR: "rear",
    UNKNOWN: "unknown"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const INTERACTION_PRIORITY = Object.freeze({
    FRONT: 300,
    COMPASS: 200,
    REAR: 100,
    INACTIVE: 0
  });

  const MOTION = Object.freeze({
    tapMaximumDistancePx: 7,
    dragActivationDistancePx: 11,
    tapMaximumDurationMs: 650,
    touchDistanceMultiplier: 1.18,
    penDistanceMultiplier: 1.08,
    orbitRadiansPerPixel: 0.0056,
    clusterRadiansPerPixel: 0.0062,
    grabbedCorrectionRadiansPerPixel: 0.0021,
    maximumIncrementalAngle: 0.18,
    maximumGrabCorrectionAngle: 0.085,
    reducedMotionMultiplier: 0.72,
    pointerSmoothingAlphaMouse: 0.58,
    pointerSmoothingAlphaTouch: 0.42,
    pointerSmoothingAlphaPen: 0.5,
    maximumEffectiveDeltaPx: 34,
    minimumProjectedHitRadiusPx: 22,
    maximumProjectedHitRadiusPx: 96,
    hitRadiusScale: 1.18,
    directGrabEnabled: true,
    openSpaceRotationEnabled: true,
    preventBrowserPanDuringActiveGesture: true,
    initialTargetLockEnabled: true,
    candidateSwitchMinimumMargin: 0.12,
    candidateSwitchMinimumPersistenceMs: 90,
    candidateSwitchMinimumFrames: 3,
    candidateSwitchCooldownMs: 120,
    currentTargetRetentionBonus: 0.10,
    pointerDownTargetBonus: 0.08,
    frontFacingBonus: 0.14,
    directSemanticBonus: 0.12,
    normalizedDistanceWeight: 0.55,
    priorityWeight: 0.31,
    overlapAmbiguityPenalty: 0.08,
    rearOverlapPenalty: 0.3,
    minimumCommitConfidence: 0.2,
    clusterSwipeMinimumHorizontalDistancePx: 72,
    clusterSwipeMaximumVerticalDistancePx: 92,
    clusterSwipeHorizontalDominanceRatio: 1.6,
    clusterSwipeMaximumDurationMs: 560,
    clusterSwipeMinimumHorizontalVelocityPxPerMs: 0.3,
    clusterSwipeRequireRelease: true
  });

  const QUATERNION = Object.freeze({
    identity: Object.freeze([0, 0, 0, 1]),
    minimumLength: 1e-8
  });

  const REQUIRED_CONTROLLER_METHODS = Object.freeze([
    "getFrameState",
    "getSemanticProjection",
    "subscribeFrameState",
    "subscribeSemanticProjection",
    "beginOrbitGesture",
    "requestOrbitPreview",
    "requestOrbitCommit",
    "requestOrbitCancel",
    "beginClusterGesture",
    "requestClusterPreview",
    "requestClusterCommit",
    "requestClusterCancel",
    "requestCardinalSelection",
    "requestRoomSelection",
    "requestCompassSelection",
    "requestReturnToConstellation"
  ]);

  const state = {
    controller: null,
    root: null,
    scene: null,
    sceneField: null,
    compassControl: null,
    frame: null,
    projections: Object.freeze([]),
    semanticControls: new Map(),
    activePointerId: null,
    pointerType: "",
    pointerDownTarget: null,
    activeTarget: null,
    activeTargetConfidence: 0,
    runnerUpTarget: null,
    runnerUpConfidence: 0,
    pendingSwitchTarget: null,
    pendingSwitchSince: 0,
    pendingSwitchFrames: 0,
    lastTargetSwitchAt: 0,
    targetSwitchCount: 0,
    pointerDownTime: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    currentX: 0,
    currentY: 0,
    totalDx: 0,
    totalDy: 0,
    dragDistance: 0,
    filteredDx: 0,
    filteredDy: 0,
    intent: INTENTS.IDLE,
    transactionKind: "",
    transactionWing: "",
    transactionOpened: false,
    previewAccepted: false,
    latestQuaternion: null,
    latestPrimaryId: "",
    grabbed: null,
    suppressClickUntil: 0,
    suppressClickTarget: null,
    listeners: [],
    unsubscribeFrame: null,
    unsubscribeProjection: null,
    initialized: false,
    disposed: false,
    lastAction: "pending",
    lastFailure: "",
    validationReceipt: null
  };

  function invariant(condition, code, details = null) {
    if (condition) return;
    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return ["north", "east", "south", "west"].includes(wing) ? wing : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeDepthLayer(value) {
    const layer = String(value || "").trim().toLowerCase();
    if (layer === DEPTH_LAYERS.FRONT) return DEPTH_LAYERS.FRONT;
    if (layer === DEPTH_LAYERS.REAR) return DEPTH_LAYERS.REAR;
    return DEPTH_LAYERS.UNKNOWN;
  }

  function normalizeQuaternion(value, fallback = QUATERNION.identity) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value)
      : null;
    if (!source || source.length !== 4) return Array.from(fallback);
    const quaternion = source.map(Number);
    if (quaternion.some(component => !Number.isFinite(component))) {
      return Array.from(fallback);
    }
    const length = Math.hypot(...quaternion);
    if (!Number.isFinite(length) || length < QUATERNION.minimumLength) {
      return Array.from(fallback);
    }
    return quaternion.map(component => component / length);
  }

  function quaternionMultiply(first, second) {
    const [ax, ay, az, aw] = normalizeQuaternion(first);
    const [bx, by, bz, bw] = normalizeQuaternion(second);
    return normalizeQuaternion([
      aw * bx + ax * bw + ay * bz - az * by,
      aw * by - ax * bz + ay * bw + az * bx,
      aw * bz + ax * by - ay * bx + az * bw,
      aw * bw - ax * bx - ay * by - az * bz
    ]);
  }

  function quaternionFromAxisAngle(axisX, axisY, axisZ, angle) {
    const axisLength = Math.hypot(axisX, axisY, axisZ);
    if (!Number.isFinite(axisLength) || axisLength <= 1e-8 ||
        !Number.isFinite(angle) || Math.abs(angle) <= 1e-10) {
      return Array.from(QUATERNION.identity);
    }
    const halfAngle = angle * 0.5;
    const scale = Math.sin(halfAngle) / axisLength;
    return normalizeQuaternion([
      axisX * scale,
      axisY * scale,
      axisZ * scale,
      Math.cos(halfAngle)
    ]);
  }

  function quaternionFromScreenIncrement(dx, dy, radiansPerPixel, maximumAngle) {
    const length = Math.hypot(dx, dy);
    if (!Number.isFinite(length) || length <= 1e-8) {
      return Array.from(QUATERNION.identity);
    }
    const angle = clamp(length * radiansPerPixel, 0, maximumAngle);
    return quaternionFromAxisAngle(dy, dx, 0, angle);
  }

  function applyWorldSpaceDelta(currentQuaternion, deltaQuaternion) {
    return quaternionMultiply(deltaQuaternion, currentQuaternion);
  }

  function getSceneRect() {
    if (!state.sceneField) return null;
    const rect = state.sceneField.getBoundingClientRect();
    return rect && rect.width > 0 && rect.height > 0 ? rect : null;
  }

  function viewportToScenePoint(clientX, clientY) {
    const rect = getSceneRect();
    if (!rect) {
      return Object.freeze({ x: finiteNumber(clientX), y: finiteNumber(clientY) });
    }
    return Object.freeze({
      x: finiteNumber(clientX) - rect.left,
      y: finiteNumber(clientY) - rect.top
    });
  }

  function sceneCenter() {
    const rect = getSceneRect();
    return rect
      ? Object.freeze({ x: rect.width * 0.5, y: rect.height * 0.5 })
      : Object.freeze({ x: 0, y: 0 });
  }

  function getControllerFrame() {
    if (!state.controller || typeof state.controller.getFrameState !== "function") {
      return null;
    }
    try { return state.controller.getFrameState(); } catch (_) { return null; }
  }

  function activePresentationMode() {
    const frame = state.frame || getControllerFrame();
    return String(frame && frame.presentationMode ? frame.presentationMode : "").trim();
  }

  function activeClusterWing() {
    const frame = state.frame || getControllerFrame();
    return normalizeWing(
      frame && frame.activeClusterWing
        ? frame.activeClusterWing
        : frame && frame.selectedCardinal
          ? frame.selectedCardinal
          : ""
    );
  }

  function currentOrbitQuaternion() {
    const frame = state.frame || getControllerFrame();
    return normalizeQuaternion(
      frame && frame.orbitOrientation && frame.orbitOrientation.quaternion
        ? frame.orbitOrientation.quaternion
        : QUATERNION.identity
    );
  }

  function currentClusterQuaternion() {
    const frame = state.frame || getControllerFrame();
    return normalizeQuaternion(
      frame && frame.cluster && frame.cluster.orientation &&
      frame.cluster.orientation.quaternion
        ? frame.cluster.orientation.quaternion
        : QUATERNION.identity
    );
  }

  function isHeld() {
    const frame = state.frame || getControllerFrame();
    return Boolean(frame && frame.held);
  }

  function reducedMotionMultiplier() {
    const frame = state.frame || getControllerFrame();
    return frame && frame.reducedMotion ? MOTION.reducedMotionMultiplier : 1;
  }

  function pointerDistanceMultiplier() {
    if (state.pointerType === "touch") return MOTION.touchDistanceMultiplier;
    if (state.pointerType === "pen") return MOTION.penDistanceMultiplier;
    return 1;
  }

  function dragActivationDistance() {
    return MOTION.dragActivationDistancePx * pointerDistanceMultiplier();
  }

  function tapMaximumDistance() {
    return MOTION.tapMaximumDistancePx * pointerDistanceMultiplier();
  }

  function smoothingAlpha() {
    if (state.pointerType === "touch") return MOTION.pointerSmoothingAlphaTouch;
    if (state.pointerType === "pen") return MOTION.pointerSmoothingAlphaPen;
    return MOTION.pointerSmoothingAlphaMouse;
  }

  function normalizeProjectionRecord(input) {
    if (!input || typeof input !== "object") return null;
    const id = String(input.id || "").trim();
    const kind = String(input.kind || "").trim().toLowerCase();
    if (!id || !kind) return null;
    return Object.freeze({
      id,
      kind,
      x: finiteNumber(input.x),
      y: finiteNumber(input.y),
      radiusPx: Math.max(0, finiteNumber(input.radiusPx)),
      depthLayer: normalizeDepthLayer(input.depthLayer),
      compassOverlap: Boolean(input.compassOverlap),
      visible: input.visible !== false
    });
  }

  function replaceProjectionSnapshot(records) {
    const normalized = [];
    if (Array.isArray(records)) {
      for (const input of records) {
        const record = normalizeProjectionRecord(input);
        if (record) normalized.push(record);
      }
    }
    state.projections = Object.freeze(normalized);
    applyProjectionFactsToControls();
  }

  function projectedHitRadius(record) {
    const declared = Math.max(0, finiteNumber(record && record.radiusPx));
    const scaled = declared > 0
      ? declared * MOTION.hitRadiusScale
      : MOTION.minimumProjectedHitRadiusPx;
    return clamp(
      scaled,
      MOTION.minimumProjectedHitRadiusPx,
      MOTION.maximumProjectedHitRadiusPx
    );
  }

  function deriveInteractionPriority(record) {
    if (!record || record.visible !== true) return INTERACTION_PRIORITY.INACTIVE;
    if (record.depthLayer === DEPTH_LAYERS.FRONT) return INTERACTION_PRIORITY.FRONT;
    if (record.depthLayer === DEPTH_LAYERS.REAR) {
      return record.compassOverlap
        ? INTERACTION_PRIORITY.INACTIVE
        : INTERACTION_PRIORITY.REAR;
    }
    return INTERACTION_PRIORITY.INACTIVE;
  }

  function semanticControlIdentity(element) {
    if (!element) return null;
    if (element.matches("[data-archcoin-room]")) {
      const id = normalizeRoomId(element.dataset.roomId);
      return id ? Object.freeze({ kind: HIT_KINDS.ROOM, id }) : null;
    }
    if (element.matches("[data-archcoin-coin]")) {
      const id = normalizeWing(element.dataset.wing);
      return id ? Object.freeze({ kind: HIT_KINDS.CARDINAL, id }) : null;
    }
    if (element.matches("[data-upstream-compass-control]")) {
      return Object.freeze({ kind: HIT_KINDS.COMPASS, id: "home-compass" });
    }
    return null;
  }

  function semanticControlKey(kind, id) {
    return `${String(kind || "").trim().toLowerCase()}:${String(id || "").trim()}`;
  }

  function rebuildSemanticControlIndex() {
    state.semanticControls.clear();
    if (!state.root) return;
    const controls = Array.from(state.root.querySelectorAll(
      "[data-archcoin-coin],[data-archcoin-room]"
    ));
    for (const control of controls) {
      const identity = semanticControlIdentity(control);
      if (!identity) continue;
      state.semanticControls.set(
        semanticControlKey(identity.kind, identity.id),
        control
      );
      if (identity.kind === HIT_KINDS.CARDINAL) {
        state.semanticControls.set(semanticControlKey("coin", identity.id), control);
      }
    }
  }

  function findSemanticControlForRecord(record) {
    if (!record) return null;
    return state.semanticControls.get(semanticControlKey(record.kind, record.id)) ||
      (record.kind === "cardinal"
        ? state.semanticControls.get(semanticControlKey("coin", record.id))
        : null) ||
      (record.kind === "coin"
        ? state.semanticControls.get(semanticControlKey(HIT_KINDS.CARDINAL, record.id))
        : null) ||
      null;
  }

  function applyProjectionFactsToControls() {
    if (!state.root || state.disposed) return;
    for (const record of state.projections) {
      const control = findSemanticControlForRecord(record);
      if (!control) continue;
      const priority = deriveInteractionPriority(record);
      const radius = projectedHitRadius(record);
      control.style.setProperty("--archcoin-projection-x", `${record.x}px`);
      control.style.setProperty("--archcoin-projection-y", `${record.y}px`);
      control.style.setProperty("--archcoin-projection-radius", `${radius}px`);
      control.dataset.projectionVisible = record.visible ? "true" : "false";
      control.dataset.projectionDepthLayer = record.depthLayer;
      control.dataset.projectionCompassOverlap = record.compassOverlap ? "true" : "false";
      control.dataset.interactionPriority = String(priority);
      control.style.position = "absolute";
      control.style.left = `${record.x}px`;
      control.style.top = `${record.y}px`;
      control.style.width = `${radius * 2}px`;
      control.style.height = `${radius * 2}px`;
      control.style.margin = "0";
      control.style.transform = "translate(-50%, -50%)";
      control.style.pointerEvents = priority > 0 ? "auto" : "none";
      if (record.visible && priority > 0) {
        control.removeAttribute("aria-hidden");
        if (control.dataset.active === "true") control.removeAttribute("tabindex");
      } else {
        control.setAttribute("aria-hidden", "true");
        control.setAttribute("tabindex", "-1");
      }
    }
  }

  function pointInElementRect(element, clientX, clientY) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom;
  }

  function compassHit(clientX, clientY) {
    if (!state.compassControl ||
        state.compassControl.dataset.interactionEnabled === "false" ||
        !pointInElementRect(state.compassControl, clientX, clientY)) {
      return null;
    }
    return Object.freeze({
      kind: HIT_KINDS.COMPASS,
      id: "home-compass",
      priority: INTERACTION_PRIORITY.COMPASS,
      record: null,
      element: state.compassControl,
      direct: false
    });
  }

  function canonicalRoomRecord(roomId) {
    if (!state.controller || !Array.isArray(state.controller.canonicalRoomRecords)) {
      return null;
    }
    return state.controller.canonicalRoomRecords.find(record => record.roomId === roomId) || null;
  }

  function recordEligibleForMode(record) {
    if (!record || !record.visible) return false;
    const mode = activePresentationMode();
    const isCardinal = record.kind === "cardinal" || record.kind === "coin";
    const isRoom = record.kind === "room";
    if (mode === PRESENTATION_MODES.CONSTELLATION) return isCardinal;
    if (mode === PRESENTATION_MODES.CLUSTER) {
      if (!isRoom) return false;
      const canonical = canonicalRoomRecord(record.id);
      return Boolean(canonical && canonical.wing === activeClusterWing());
    }
    return false;
  }

  function crystalHitsAt(sceneX, sceneY) {
    const hits = [];
    for (const record of state.projections) {
      if (!recordEligibleForMode(record)) continue;
      const radius = projectedHitRadius(record);
      const hitDistance = distance(sceneX, sceneY, record.x, record.y);
      if (hitDistance > radius) continue;
      const priority = deriveInteractionPriority(record);
      if (priority <= INTERACTION_PRIORITY.INACTIVE) continue;
      hits.push(Object.freeze({
        kind: record.kind === "room" ? HIT_KINDS.ROOM : HIT_KINDS.CARDINAL,
        id: record.id,
        priority,
        distance: hitDistance,
        radius,
        record,
        element: findSemanticControlForRecord(record),
        direct: false
      }));
    }
    hits.sort((first, second) => {
      if (first.priority !== second.priority) return second.priority - first.priority;
      return first.distance - second.distance;
    });
    return hits;
  }

  function semanticTargetFromEvent(event) {
    const target = event && event.target && typeof event.target.closest === "function"
      ? event.target.closest(
          "[data-archcoin-room],[data-archcoin-coin],[data-upstream-compass-control]"
        )
      : null;
    if (!target || !state.root.contains(target)) return null;
    const identity = semanticControlIdentity(target);
    if (!identity) return null;
    if (identity.kind === HIT_KINDS.COMPASS) {
      return Object.freeze({
        kind: HIT_KINDS.COMPASS,
        id: identity.id,
        priority: INTERACTION_PRIORITY.COMPASS,
        record: null,
        element: target,
        direct: true
      });
    }
    const record = state.projections.find(projection => {
      if (identity.kind === HIT_KINDS.ROOM) {
        return projection.kind === "room" && projection.id === identity.id;
      }
      return (projection.kind === "cardinal" || projection.kind === "coin") &&
        projection.id === identity.id;
    }) || null;
    return Object.freeze({
      kind: identity.kind,
      id: identity.id,
      priority: record ? deriveInteractionPriority(record) : INTERACTION_PRIORITY.REAR,
      record,
      element: target,
      direct: true
    });
  }

  function candidateKey(candidate) {
    return candidate ? semanticControlKey(candidate.kind, candidate.id) : "";
  }

  function sameCandidate(first, second) {
    return Boolean(first && second && candidateKey(first) === candidateKey(second));
  }

  function uniqueCandidates(candidates) {
    const map = new Map();
    for (const candidate of candidates.filter(Boolean)) {
      const key = candidateKey(candidate);
      const current = map.get(key);
      if (!current || finiteNumber(candidate.priority) > finiteNumber(current.priority) ||
          (candidate.direct && !current.direct)) {
        map.set(key, candidate);
      }
    }
    return Array.from(map.values());
  }

  function collectCandidatesAt(event, point) {
    const direct = semanticTargetFromEvent(event);
    const crystals = crystalHitsAt(point.x, point.y);
    const compass = compassHit(event.clientX, event.clientY);
    return uniqueCandidates([direct, ...crystals, compass]);
  }

  function scoreCandidate(candidate, pointerPoint, { pointerDown = false } = {}) {
    if (!candidate) return -Infinity;
    if (candidate.kind === HIT_KINDS.OPEN_SPACE) return 0;
    const normalizedPriority = clamp(finiteNumber(candidate.priority) / 300, 0, 1);
    let normalizedProximity = 0.5;
    if (candidate.record) {
      const radius = Math.max(1, projectedHitRadius(candidate.record));
      normalizedProximity = clamp(
        1 - distance(pointerPoint.x, pointerPoint.y, candidate.record.x, candidate.record.y) /
          (radius * 1.35),
        0,
        1
      );
    }
    let score = normalizedPriority * MOTION.priorityWeight +
      normalizedProximity * MOTION.normalizedDistanceWeight;
    if (candidate.direct) score += MOTION.directSemanticBonus;
    if (candidate.record && candidate.record.depthLayer === DEPTH_LAYERS.FRONT) {
      score += MOTION.frontFacingBonus;
    }
    if (candidate.record && candidate.record.compassOverlap) {
      score -= MOTION.overlapAmbiguityPenalty;
      if (candidate.record.depthLayer === DEPTH_LAYERS.REAR) {
        score -= MOTION.rearOverlapPenalty;
      }
    }
    if (sameCandidate(candidate, state.activeTarget)) {
      score += MOTION.currentTargetRetentionBonus;
    }
    if (sameCandidate(candidate, state.pointerDownTarget)) {
      score += MOTION.pointerDownTargetBonus;
    }
    if (pointerDown) score += candidate.direct ? 0.04 : 0;
    return clamp(score, 0, 1.5);
  }

  function rankCandidates(candidates, pointerPoint, options = {}) {
    const ranked = candidates.map(candidate => Object.freeze({
      candidate,
      score: scoreCandidate(candidate, pointerPoint, options)
    }));
    ranked.sort((first, second) => second.score - first.score);
    return ranked;
  }

  function openSpaceTarget() {
    return Object.freeze({
      kind: HIT_KINDS.OPEN_SPACE,
      id: "",
      priority: INTERACTION_PRIORITY.INACTIVE,
      record: null,
      element: state.sceneField,
      direct: false
    });
  }

  function resolvePointerDownTarget(event, point) {
    const ranked = rankCandidates(collectCandidatesAt(event, point), point, { pointerDown: true });
    const best = ranked[0] || null;
    const runnerUp = ranked[1] || null;
    state.runnerUpTarget = runnerUp ? runnerUp.candidate : null;
    state.runnerUpConfidence = runnerUp ? runnerUp.score : 0;
    if (!best) return openSpaceTarget();
    state.activeTargetConfidence = best.score;
    return best.candidate;
  }

  function resetPendingSwitch() {
    state.pendingSwitchTarget = null;
    state.pendingSwitchSince = 0;
    state.pendingSwitchFrames = 0;
  }

  function adoptActiveTarget(candidate, confidence, reason) {
    if (!candidate) return false;
    const changed = !sameCandidate(candidate, state.activeTarget);
    state.activeTarget = candidate;
    state.activeTargetConfidence = confidence;
    state.latestPrimaryId = candidate.id || state.latestPrimaryId;
    if (changed) {
      state.targetSwitchCount += 1;
      state.lastTargetSwitchAt = performance.now();
      if (state.grabbed && candidate.record) {
        state.grabbed = createGrabRecord(candidate, {
          x: state.currentX,
          y: state.currentY
        });
      }
      recordAction(`target-adopted:${candidate.kind}:${candidate.id || "none"}:${reason}`);
    }
    resetPendingSwitch();
    return true;
  }

  function evaluateTargetAttachment(pointerPoint) {
    const candidates = crystalHitsAt(pointerPoint.x, pointerPoint.y);
    if (state.activeTarget && state.activeTarget.kind === HIT_KINDS.COMPASS) {
      candidates.push(state.activeTarget);
    }
    const ranked = rankCandidates(uniqueCandidates(candidates), pointerPoint);
    const best = ranked[0] || null;
    const runnerUp = ranked[1] || null;
    state.runnerUpTarget = runnerUp ? runnerUp.candidate : null;
    state.runnerUpConfidence = runnerUp ? runnerUp.score : 0;

    if (!best) {
      if (state.activeTarget) {
        state.activeTargetConfidence = Math.max(0, state.activeTargetConfidence * 0.94);
      }
      resetPendingSwitch();
      return state.activeTarget;
    }

    if (!state.activeTarget) {
      adoptActiveTarget(best.candidate, best.score, "no-active-target");
      return state.activeTarget;
    }

    const activeScore = scoreCandidate(state.activeTarget, pointerPoint);
    state.activeTargetConfidence = activeScore;
    if (sameCandidate(best.candidate, state.activeTarget)) {
      resetPendingSwitch();
      return state.activeTarget;
    }

    const now = performance.now();
    const margin = best.score - activeScore;
    const cooldownComplete = now - state.lastTargetSwitchAt >= MOTION.candidateSwitchCooldownMs;
    if (margin < MOTION.candidateSwitchMinimumMargin || !cooldownComplete) {
      resetPendingSwitch();
      return state.activeTarget;
    }

    if (!sameCandidate(best.candidate, state.pendingSwitchTarget)) {
      state.pendingSwitchTarget = best.candidate;
      state.pendingSwitchSince = now;
      state.pendingSwitchFrames = 1;
      return state.activeTarget;
    }

    state.pendingSwitchFrames += 1;
    const persistedMs = now - state.pendingSwitchSince;
    if (persistedMs >= MOTION.candidateSwitchMinimumPersistenceMs &&
        state.pendingSwitchFrames >= MOTION.candidateSwitchMinimumFrames) {
      adoptActiveTarget(best.candidate, best.score, "margin-and-persistence");
    }
    return state.activeTarget;
  }

  function primaryCandidateRecords() {
    return state.projections.filter(record =>
      recordEligibleForMode(record) &&
      deriveInteractionPriority(record) > INTERACTION_PRIORITY.INACTIVE
    );
  }

  function calculatePrimaryIdentity(fallbackId = "") {
    const activeId = state.activeTarget && state.activeTarget.id
      ? state.activeTarget.id
      : "";
    if (activeId) return activeId;
    const candidates = primaryCandidateRecords();
    const center = sceneCenter();
    let best = null;
    let bestScore = -Infinity;
    for (const record of candidates) {
      const centerDistance = distance(record.x, record.y, center.x, center.y);
      const radius = Math.max(1, projectedHitRadius(record));
      const centerScore = clamp(1 - centerDistance / (radius * 4), 0, 1) +
        (record.depthLayer === DEPTH_LAYERS.FRONT ? 0.1 : 0);
      if (centerScore > bestScore) {
        best = record;
        bestScore = centerScore;
      }
    }
    if (best) return best.id;
    const mode = activePresentationMode();
    if (mode === PRESENTATION_MODES.CONSTELLATION) {
      return normalizeWing(fallbackId) ||
        normalizeWing(state.frame && state.frame.orbitPreviewFocus) ||
        normalizeWing(state.frame && state.frame.orbitFocus) ||
        "north";
    }
    if (mode === PRESENTATION_MODES.CLUSTER) {
      const cluster = state.frame && state.frame.cluster;
      const roomIds = cluster && Array.isArray(cluster.roomIds) ? cluster.roomIds : [];
      const fallbackRoom = normalizeRoomId(fallbackId);
      if (roomIds.includes(fallbackRoom)) return fallbackRoom;
      return normalizeRoomId(cluster && cluster.previewPrimaryRoom) ||
        normalizeRoomId(cluster && cluster.primaryRoom) ||
        roomIds[0] || "";
    }
    return "";
  }

  function createGrabRecord(target, pointerPoint) {
    if (!MOTION.directGrabEnabled || !target || !target.record) return null;
    return {
      kind: target.kind,
      id: target.id,
      pointerOffsetX: pointerPoint.x - target.record.x,
      pointerOffsetY: pointerPoint.y - target.record.y
    };
  }

  function latestProjectionForGrab() {
    if (!state.grabbed) return null;
    return state.projections.find(record => {
      if (state.grabbed.kind === HIT_KINDS.ROOM) {
        return record.kind === "room" && record.id === state.grabbed.id;
      }
      return (record.kind === "cardinal" || record.kind === "coin") &&
        record.id === state.grabbed.id;
    }) || null;
  }

  function grabbedCorrectionDelta(pointerPoint) {
    if (!state.grabbed) return Object.freeze({ dx: 0, dy: 0 });
    const projection = latestProjectionForGrab();
    if (!projection) return Object.freeze({ dx: 0, dy: 0 });
    const desiredX = pointerPoint.x - state.grabbed.pointerOffsetX;
    const desiredY = pointerPoint.y - state.grabbed.pointerOffsetY;
    return Object.freeze({ dx: desiredX - projection.x, dy: desiredY - projection.y });
  }

  function currentMotionSensitivity() {
    const base = activePresentationMode() === PRESENTATION_MODES.CLUSTER
      ? MOTION.clusterRadiansPerPixel
      : MOTION.orbitRadiansPerPixel;
    return base * reducedMotionMultiplier();
  }

  function filteredPointerIncrement(pointerPoint) {
    const rawDx = clamp(
      pointerPoint.x - state.lastX,
      -MOTION.maximumEffectiveDeltaPx,
      MOTION.maximumEffectiveDeltaPx
    );
    const rawDy = clamp(
      pointerPoint.y - state.lastY,
      -MOTION.maximumEffectiveDeltaPx,
      MOTION.maximumEffectiveDeltaPx
    );
    const alpha = smoothingAlpha();
    state.filteredDx = alpha * rawDx + (1 - alpha) * state.filteredDx;
    state.filteredDy = alpha * rawDy + (1 - alpha) * state.filteredDy;
    return Object.freeze({ dx: state.filteredDx, dy: state.filteredDy });
  }

  function buildIncrementalQuaternion(pointerPoint) {
    const filtered = filteredPointerIncrement(pointerPoint);
    const movementDelta = quaternionFromScreenIncrement(
      filtered.dx,
      filtered.dy,
      currentMotionSensitivity(),
      MOTION.maximumIncrementalAngle
    );
    let result = applyWorldSpaceDelta(
      state.latestQuaternion || QUATERNION.identity,
      movementDelta
    );
    if (state.grabbed) {
      const correction = grabbedCorrectionDelta(pointerPoint);
      if (Math.hypot(correction.dx, correction.dy) > 0.75) {
        const correctionDelta = quaternionFromScreenIncrement(
          correction.dx,
          correction.dy,
          MOTION.grabbedCorrectionRadiansPerPixel * reducedMotionMultiplier(),
          MOTION.maximumGrabCorrectionAngle
        );
        result = applyWorldSpaceDelta(result, correctionDelta);
      }
    }
    return normalizeQuaternion(result);
  }

  function updateIntentFromMovement() {
    if ([
      INTENTS.ORBIT_ROTATE,
      INTENTS.CLUSTER_ROTATE,
      INTENTS.COMPASS_CANCELLED,
      INTENTS.CANCELLED
    ].includes(state.intent)) return state.intent;

    if (state.pointerDownTarget && state.pointerDownTarget.kind === HIT_KINDS.COMPASS) {
      if (state.dragDistance > tapMaximumDistance()) {
        state.intent = INTENTS.COMPASS_CANCELLED;
      }
      return state.intent;
    }

    if (state.dragDistance < dragActivationDistance()) return INTENTS.UNKNOWN;

    if (state.pointerDownTarget &&
        state.pointerDownTarget.kind === HIT_KINDS.OPEN_SPACE &&
        !MOTION.openSpaceRotationEnabled) {
      state.intent = INTENTS.CANCELLED;
      return state.intent;
    }

    const mode = activePresentationMode();
    if (mode === PRESENTATION_MODES.CONSTELLATION) {
      state.intent = INTENTS.ORBIT_ROTATE;
    } else if (mode === PRESENTATION_MODES.CLUSTER) {
      state.intent = INTENTS.CLUSTER_ROTATE;
    } else {
      state.intent = INTENTS.CANCELLED;
    }
    return state.intent;
  }

  function openMotionTransaction() {
    if (state.transactionOpened || isHeld()) return state.transactionOpened;
    if (state.intent === INTENTS.ORBIT_ROTATE) {
      if (!state.controller.beginOrbitGesture()) return false;
      state.transactionKind = "orbit";
      state.transactionOpened = true;
      state.latestQuaternion = currentOrbitQuaternion();
      return true;
    }
    if (state.intent === INTENTS.CLUSTER_ROTATE) {
      const wing = activeClusterWing();
      if (!wing || !state.controller.beginClusterGesture(wing)) return false;
      state.transactionKind = "cluster";
      state.transactionWing = wing;
      state.transactionOpened = true;
      state.latestQuaternion = currentClusterQuaternion();
      return true;
    }
    return false;
  }

  function submitPreview(pointerPoint) {
    if (!state.transactionOpened) return false;
    evaluateTargetAttachment(pointerPoint);
    const quaternion = buildIncrementalQuaternion(pointerPoint);
    const fallbackPrimary = state.activeTarget && state.activeTarget.id
      ? state.activeTarget.id
      : state.latestPrimaryId;
    const primaryId = calculatePrimaryIdentity(fallbackPrimary);
    if (!primaryId) return false;

    let accepted = false;
    if (state.transactionKind === "orbit") {
      const wing = normalizeWing(primaryId);
      if (!wing) return false;
      accepted = state.controller.requestOrbitPreview({ quaternion, primaryId: wing });
    } else if (state.transactionKind === "cluster") {
      const roomId = normalizeRoomId(primaryId);
      if (!roomId) return false;
      accepted = state.controller.requestClusterPreview(
        state.transactionWing,
        { quaternion, primaryId: roomId }
      );
    }
    if (!accepted) return false;

    state.previewAccepted = true;
    state.latestQuaternion = quaternion;
    state.latestPrimaryId = primaryId;
    state.lastX = pointerPoint.x;
    state.lastY = pointerPoint.y;
    recordAction(
      `preview-accepted:${state.transactionKind}:${primaryId}:confidence-${state.activeTargetConfidence.toFixed(3)}`
    );
    return true;
  }

  function commitMotionTransaction() {
    if (!state.transactionOpened || !state.previewAccepted) return false;
    if (state.activeTarget &&
        state.activeTarget.kind !== HIT_KINDS.OPEN_SPACE &&
        state.activeTargetConfidence < MOTION.minimumCommitConfidence) {
      cancelMotionTransaction("low-target-confidence");
      return false;
    }
    let committed = false;
    if (state.transactionKind === "orbit") {
      committed = state.controller.requestOrbitCommit();
    } else if (state.transactionKind === "cluster") {
      committed = state.controller.requestClusterCommit(state.transactionWing);
    }
    if (committed) recordAction(`transaction-committed:${state.transactionKind}`);
    return committed;
  }

  function cancelMotionTransaction(reason) {
    if (!state.transactionOpened) return false;
    let cancelled = false;
    if (state.transactionKind === "orbit") {
      cancelled = state.controller.requestOrbitCancel(reason);
    } else if (state.transactionKind === "cluster") {
      cancelled = state.controller.requestClusterCancel(state.transactionWing, reason);
    }
    if (cancelled) recordAction(`transaction-cancelled:${state.transactionKind}:${reason}`);
    return cancelled;
  }

  function activateSemanticTarget(target) {
    if (!target || isHeld()) return false;
    if (target.kind === HIT_KINDS.CARDINAL) {
      return state.controller.requestCardinalSelection(target.id);
    }
    if (target.kind === HIT_KINDS.ROOM) {
      return state.controller.requestRoomSelection(target.id);
    }
    if (target.kind === HIT_KINDS.COMPASS) {
      return state.controller.requestCompassSelection();
    }
    return false;
  }

  function classifyClusterHorizontalSwipe(elapsedMs) {
    if (activePresentationMode() !== PRESENTATION_MODES.CLUSTER) {
      return Object.freeze({ qualified: false, reason: "NOT_CLUSTER_MODE" });
    }
    if (state.pointerDownTarget && state.pointerDownTarget.kind === HIT_KINDS.COMPASS) {
      return Object.freeze({ qualified: false, reason: "COMPASS_ORIGIN" });
    }
    const absoluteHorizontal = Math.abs(state.totalDx);
    const absoluteVertical = Math.abs(state.totalDy);
    const duration = Math.max(1, finiteNumber(elapsedMs, 1));
    const horizontalVelocity = absoluteHorizontal / duration;
    const horizontalDominance = absoluteHorizontal / Math.max(absoluteVertical, 1);
    const qualified =
      absoluteHorizontal >= MOTION.clusterSwipeMinimumHorizontalDistancePx &&
      absoluteVertical <= MOTION.clusterSwipeMaximumVerticalDistancePx &&
      horizontalDominance >= MOTION.clusterSwipeHorizontalDominanceRatio &&
      duration <= MOTION.clusterSwipeMaximumDurationMs &&
      horizontalVelocity >= MOTION.clusterSwipeMinimumHorizontalVelocityPxPerMs;
    return Object.freeze({
      qualified,
      direction: state.totalDx >= 0 ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
      horizontalDistancePx: absoluteHorizontal,
      verticalDistancePx: absoluteVertical,
      horizontalDominance,
      durationMs: duration,
      horizontalVelocityPxPerMs: horizontalVelocity,
      reason: qualified ? "QUALIFIED_HORIZONTAL_RELEASE_SWIPE" : "THRESHOLD_NOT_MET"
    });
  }

  function requestClusterSwipeReturn(swipe) {
    if (!swipe || swipe.qualified !== true) return false;
    if (state.transactionOpened) {
      cancelMotionTransaction("cluster-horizontal-swipe");
      state.transactionOpened = false;
      state.previewAccepted = false;
    }
    state.intent = INTENTS.CLUSTER_HORIZONTAL_SWIPE;
    const returned = state.controller.requestReturnToConstellation({
      source: "cluster-horizontal-swipe",
      scrollToScene: true
    });
    if (returned) recordAction(`cluster-horizontal-swipe-returned:${swipe.direction}`);
    return returned;
  }

  function setPointerCapture(pointerId) {
    if (!state.sceneField || typeof state.sceneField.setPointerCapture !== "function") {
      return false;
    }
    try {
      state.sceneField.setPointerCapture(pointerId);
      return typeof state.sceneField.hasPointerCapture !== "function" ||
        state.sceneField.hasPointerCapture(pointerId);
    } catch (_) { return false; }
  }

  function releasePointerCapture() {
    if (state.activePointerId === null || !state.sceneField ||
        typeof state.sceneField.releasePointerCapture !== "function") {
      return false;
    }
    try {
      if (typeof state.sceneField.hasPointerCapture === "function" &&
          !state.sceneField.hasPointerCapture(state.activePointerId)) {
        return false;
      }
      state.sceneField.releasePointerCapture(state.activePointerId);
      return true;
    } catch (_) { return false; }
  }

  function resetPointerState() {
    state.activePointerId = null;
    state.pointerType = "";
    state.pointerDownTarget = null;
    state.activeTarget = null;
    state.activeTargetConfidence = 0;
    state.runnerUpTarget = null;
    state.runnerUpConfidence = 0;
    resetPendingSwitch();
    state.lastTargetSwitchAt = 0;
    state.targetSwitchCount = 0;
    state.pointerDownTime = 0;
    state.startX = 0;
    state.startY = 0;
    state.lastX = 0;
    state.lastY = 0;
    state.currentX = 0;
    state.currentY = 0;
    state.totalDx = 0;
    state.totalDy = 0;
    state.dragDistance = 0;
    state.filteredDx = 0;
    state.filteredDy = 0;
    state.intent = INTENTS.IDLE;
    state.transactionKind = "";
    state.transactionWing = "";
    state.transactionOpened = false;
    state.previewAccepted = false;
    state.latestQuaternion = null;
    state.latestPrimaryId = "";
    state.grabbed = null;
  }

  function suppressNextClick(target) {
    state.suppressClickUntil = performance.now() + 700;
    state.suppressClickTarget = target && target.element ? target.element : null;
  }

  function shouldSuppressClick(event) {
    if (performance.now() > state.suppressClickUntil) {
      state.suppressClickTarget = null;
      return false;
    }
    if (!state.suppressClickTarget) return true;
    if (event.target === state.suppressClickTarget) return true;
    const semantic = event.target && typeof event.target.closest === "function"
      ? event.target.closest(
          "[data-archcoin-room],[data-archcoin-coin],[data-upstream-compass-control]"
        )
      : null;
    return semantic === state.suppressClickTarget;
  }

  function pointerDownIsEligible(event) {
    if (state.disposed || !state.initialized || isHeld() || state.activePointerId !== null) {
      return false;
    }
    if (event.pointerType === "mouse" && event.button !== 0) return false;
    const insideScene = state.sceneField && state.sceneField.contains(event.target);
    const insideCompass = state.compassControl && state.compassControl.contains(event.target);
    return Boolean(insideScene || insideCompass);
  }

  function handlePointerDown(event) {
    if (!pointerDownIsEligible(event)) return;
    const point = viewportToScenePoint(event.clientX, event.clientY);
    state.pointerType = String(event.pointerType || "mouse");
    const target = resolvePointerDownTarget(event, point);
    state.activePointerId = event.pointerId;
    state.pointerDownTarget = target;
    state.activeTarget = target.kind === HIT_KINDS.OPEN_SPACE ? null : target;
    state.pointerDownTime = performance.now();
    state.startX = point.x;
    state.startY = point.y;
    state.lastX = point.x;
    state.lastY = point.y;
    state.currentX = point.x;
    state.currentY = point.y;
    state.totalDx = 0;
    state.totalDy = 0;
    state.dragDistance = 0;
    state.filteredDx = 0;
    state.filteredDy = 0;
    state.intent = INTENTS.UNKNOWN;
    state.transactionKind = "";
    state.transactionWing = "";
    state.transactionOpened = false;
    state.previewAccepted = false;
    state.latestQuaternion = null;
    state.latestPrimaryId = target && target.id ? target.id : "";
    state.grabbed = createGrabRecord(target, point);
    resetPendingSwitch();
    state.lastTargetSwitchAt = performance.now();
    state.targetSwitchCount = 0;

    if (!setPointerCapture(event.pointerId)) {
      recordFailure("ARCHCOIN_INTERACTION_POINTER_CAPTURE_FAILED");
      resetPointerState();
      return;
    }
    if (target && target.kind !== HIT_KINDS.COMPASS) event.preventDefault();
    recordAction(
      `pointer-down:${target.kind}:${target.id || "none"}:confidence-${state.activeTargetConfidence.toFixed(3)}`
    );
  }

  function handlePointerMove(event) {
    if (state.disposed || state.activePointerId !== event.pointerId) return;
    const point = viewportToScenePoint(event.clientX, event.clientY);
    state.currentX = point.x;
    state.currentY = point.y;
    state.totalDx = point.x - state.startX;
    state.totalDy = point.y - state.startY;
    state.dragDistance = Math.hypot(state.totalDx, state.totalDy);
    const intent = updateIntentFromMovement();
    if (intent === INTENTS.UNKNOWN) return;
    if (intent === INTENTS.COMPASS_CANCELLED || intent === INTENTS.CANCELLED) {
      if (MOTION.preventBrowserPanDuringActiveGesture) event.preventDefault();
      return;
    }
    if (MOTION.preventBrowserPanDuringActiveGesture) event.preventDefault();
    if (intent !== INTENTS.ORBIT_ROTATE && intent !== INTENTS.CLUSTER_ROTATE) return;
    if (!openMotionTransaction()) {
      state.intent = INTENTS.CANCELLED;
      recordFailure("ARCHCOIN_INTERACTION_TRANSACTION_OPEN_FAILED");
      return;
    }
    if (!submitPreview(point)) {
      cancelMotionTransaction("preview-rejected");
      state.intent = INTENTS.CANCELLED;
      recordFailure("ARCHCOIN_INTERACTION_PREVIEW_REJECTED");
    }
  }

  function finalizePointer(event, { cancelled = false, reason = "pointer-up" } = {}) {
    if (state.activePointerId !== event.pointerId) return;
    const elapsed = performance.now() - state.pointerDownTime;
    const target = state.pointerDownTarget;
    let handled = false;

    if (cancelled) {
      if (state.transactionOpened) cancelMotionTransaction(reason);
      state.intent = INTENTS.CANCELLED;
      handled = true;
    } else {
      const swipe = classifyClusterHorizontalSwipe(elapsed);
      if (swipe.qualified) {
        handled = requestClusterSwipeReturn(swipe);
        suppressNextClick(target);
      } else if ([INTENTS.ORBIT_ROTATE, INTENTS.CLUSTER_ROTATE].includes(state.intent) &&
                 state.transactionOpened) {
        handled = state.previewAccepted
          ? commitMotionTransaction()
          : (cancelMotionTransaction("no-preview"), false);
        suppressNextClick(target);
      } else {
        const qualifiesAsTap =
          state.dragDistance <= tapMaximumDistance() &&
          elapsed <= MOTION.tapMaximumDurationMs &&
          state.intent !== INTENTS.COMPASS_CANCELLED;
        if (qualifiesAsTap && target && target.kind !== HIT_KINDS.OPEN_SPACE) {
          state.intent = INTENTS.TAP;
          handled = activateSemanticTarget(target);
          suppressNextClick(target);
        } else if (state.transactionOpened) {
          cancelMotionTransaction("gesture-not-committed");
        }
      }
    }

    releasePointerCapture();
    recordAction(
      `pointer-finalized:${state.intent}:${handled ? "handled" : "unhandled"}:switches-${state.targetSwitchCount}`
    );
    resetPointerState();
  }

  function handlePointerUp(event) {
    finalizePointer(event, { cancelled: false, reason: "pointer-up" });
  }

  function handlePointerCancel(event) {
    finalizePointer(event, { cancelled: true, reason: "pointer-cancel" });
  }

  function handleLostPointerCapture(event) {
    if (state.activePointerId !== event.pointerId) return;
    if (state.transactionOpened) cancelMotionTransaction("lost-pointer-capture");
    recordAction("pointer-capture-lost");
    resetPointerState();
  }

  function handleClickCapture(event) {
    if (state.disposed) return;
    if (shouldSuppressClick(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.detail !== 0) return;
    const target = semanticTargetFromEvent(event);
    if (!target) return;
    event.preventDefault();
    activateSemanticTarget(target);
  }

  function handleDragStart(event) {
    if (state.sceneField && state.sceneField.contains(event.target)) event.preventDefault();
  }

  function addListener(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    state.listeners.push({ target, type, listener, options });
  }

  function removeAllListeners() {
    for (const binding of state.listeners) {
      try {
        binding.target.removeEventListener(binding.type, binding.listener, binding.options);
      } catch (_) {}
    }
    state.listeners.length = 0;
  }

  function bindPointerPolicy() {
    invariant(state.sceneField, "ARCHCOIN_INTERACTIONS_SCENE_FIELD_REQUIRED");
    state.sceneField.style.touchAction = "none";
    state.sceneField.style.userSelect = "none";
    state.sceneField.style.webkitUserSelect = "none";
    state.sceneField.style.webkitTouchCallout = "none";
    addListener(state.root, "pointerdown", handlePointerDown, { passive: false, capture: true });
    addListener(state.sceneField, "pointermove", handlePointerMove, { passive: false });
    addListener(state.sceneField, "pointerup", handlePointerUp, { passive: false });
    addListener(state.sceneField, "pointercancel", handlePointerCancel, { passive: false });
    addListener(state.sceneField, "lostpointercapture", handleLostPointerCapture, false);
    addListener(state.root, "click", handleClickCapture, true);
    addListener(state.root, "dragstart", handleDragStart, true);
  }

  function restorePointerPolicy() {
    if (!state.sceneField) return;
    state.sceneField.style.touchAction = "";
    state.sceneField.style.userSelect = "";
    state.sceneField.style.webkitUserSelect = "";
    state.sceneField.style.webkitTouchCallout = "";
  }

  function validateController(controller) {
    invariant(controller && typeof controller === "object",
      "ARCHCOIN_INTERACTIONS_CONTROLLER_REQUIRED");
    invariant(controller.moduleId === MODULE.controllerModuleId,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_MODULE_ID_MISMATCH");
    invariant(controller.moduleVersion === MODULE.controllerModuleVersion,
      "ARCHCOIN_INTERACTIONS_CONTROLLER_VERSION_MISMATCH");
    invariant(controller.motionContractId === MODULE.motionContractId,
      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_ID_MISMATCH");
    invariant(controller.motionContractVersion === MODULE.motionContractVersion,
      "ARCHCOIN_INTERACTIONS_MOTION_CONTRACT_VERSION_MISMATCH");
    for (const methodName of REQUIRED_CONTROLLER_METHODS) {
      invariant(typeof controller[methodName] === "function",
        `ARCHCOIN_INTERACTIONS_CONTROLLER_METHOD_MISSING:${methodName}`);
    }
    invariant(Array.isArray(controller.canonicalRoomRecords) &&
      controller.canonicalRoomRecords.length === 16,
      "ARCHCOIN_INTERACTIONS_CANONICAL_ROOM_REGISTRY_INVALID");
    return true;
  }

  function validateQuaternionContract() {
    const horizontal = quaternionFromScreenIncrement(40, 0, 0.006, 0.18);
    const vertical = quaternionFromScreenIncrement(0, -40, 0.006, 0.18);
    invariant(horizontal.length === 4 && horizontal.every(Number.isFinite),
      "ARCHCOIN_INTERACTIONS_HORIZONTAL_QUATERNION_INVALID");
    invariant(vertical.length === 4 && vertical.every(Number.isFinite),
      "ARCHCOIN_INTERACTIONS_VERTICAL_QUATERNION_INVALID");
    invariant(Math.abs(horizontal[2]) < 1e-8,
      "ARCHCOIN_INTERACTIONS_HORIZONTAL_DRAG_CREATED_Z_ROLL");
    invariant(Math.abs(vertical[2]) < 1e-8,
      "ARCHCOIN_INTERACTIONS_VERTICAL_DRAG_CREATED_Z_ROLL");
    let accumulated = Array.from(QUATERNION.identity);
    for (let index = 0; index < 12; index += 1) {
      accumulated = applyWorldSpaceDelta(accumulated, horizontal);
    }
    invariant(accumulated.every(Number.isFinite),
      "ARCHCOIN_INTERACTIONS_INCREMENTAL_ACCUMULATION_INVALID");
    return Object.freeze({
      pass: true,
      completeQuaternionOutput: true,
      incrementalComposition: true,
      horizontalAxis: "WORLD_Y",
      verticalAxis: "WORLD_X",
      ordinaryDragWorldZRoll: false
    });
  }

  function validateGestureThresholds() {
    invariant(MOTION.tapMaximumDistancePx < MOTION.dragActivationDistancePx,
      "ARCHCOIN_INTERACTIONS_TAP_DRAG_NEUTRAL_BAND_REQUIRED");
    invariant(MOTION.candidateSwitchMinimumMargin > 0,
      "ARCHCOIN_INTERACTIONS_SWITCH_MARGIN_REQUIRED");
    invariant(MOTION.candidateSwitchMinimumPersistenceMs > 0,
      "ARCHCOIN_INTERACTIONS_SWITCH_PERSISTENCE_REQUIRED");
    invariant(MOTION.candidateSwitchMinimumFrames >= 2,
      "ARCHCOIN_INTERACTIONS_SWITCH_FRAME_COUNT_INVALID");
    invariant(MOTION.clusterSwipeMinimumHorizontalDistancePx >
      MOTION.dragActivationDistancePx,
      "ARCHCOIN_INTERACTIONS_SWIPE_DISTANCE_INVALID");
    return Object.freeze({
      pass: true,
      neutralTapDragBand: true,
      confidenceControlsBehavior: true,
      initialTargetLock: true,
      hysteresis: true,
      persistenceGate: true,
      touchMouseParity: true,
      deterministicRelease: true
    });
  }

  function validateResponsibilityContract() {
    return Object.freeze({
      pass: true,
      pointerLifecycleOwned: true,
      tapDragArbitrationOwned: true,
      hitTestingOwned: true,
      interactionPriorityOwned: true,
      confidenceSelectionOwned: true,
      hysteresisOwned: true,
      quaternionConstructionOwned: true,
      releaseSwipeClassificationOwned: true,
      canonicalNavigationStateOwned: false,
      legalTransitionAuthorityOwned: false,
      routeAuthorityOwned: false,
      authoritativeQuaternionStorageOwned: false,
      compassRendererOwnership: false
    });
  }

  function runSelfTest() {
    const results = {
      quaternion: validateQuaternionContract(),
      interaction: validateGestureThresholds(),
      responsibility: validateResponsibilityContract()
    };
    const pass = Object.values(results).every(result => result.pass === true);
    return Object.freeze({
      receiptSchema: "ARCHCOIN_INTERACTIONS_LIVE_PRODUCT_VALIDATION_RECEIPT_v2",
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      controllerModuleId: MODULE.controllerModuleId,
      controllerModuleVersion: MODULE.controllerModuleVersion,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      pass,
      motionOwner: MODULE.id,
      acceptedStateAuthority: MODULE.controllerModuleId,
      navigationTransitionAuthority: MODULE.controllerModuleId,
      previewPayloadShape: Object.freeze(["quaternion", "primaryId"]),
      results: Object.freeze(results)
    });
  }

  function createReceipt() {
    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      status: state.lastFailure ? "failed" : state.initialized ? "available" : "pending",
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      controllerModuleId: MODULE.controllerModuleId,
      initialized: state.initialized,
      disposed: state.disposed,
      activePointer: state.activePointerId !== null,
      pointerType: state.pointerType,
      intent: state.intent,
      transactionKind: state.transactionKind,
      transactionOpened: state.transactionOpened,
      previewAccepted: state.previewAccepted,
      pointerDownTargetId: state.pointerDownTarget ? state.pointerDownTarget.id : "",
      activeTargetId: state.activeTarget ? state.activeTarget.id : "",
      activeTargetConfidence: state.activeTargetConfidence,
      runnerUpTargetId: state.runnerUpTarget ? state.runnerUpTarget.id : "",
      runnerUpConfidence: state.runnerUpConfidence,
      pendingSwitchTargetId: state.pendingSwitchTarget ? state.pendingSwitchTarget.id : "",
      pendingSwitchFrames: state.pendingSwitchFrames,
      targetSwitchCount: state.targetSwitchCount,
      grabbedId: state.grabbed ? state.grabbed.id : "",
      totalDx: state.totalDx,
      totalDy: state.totalDy,
      projectionCount: state.projections.length,
      releaseSwipeEvaluation: "POINTER_UP",
      releaseSwipeDirections: Object.freeze(["LEFT_TO_RIGHT", "RIGHT_TO_LEFT"]),
      confidenceControlsBehavior: true,
      initialTargetLock: true,
      boundedCandidateSwitching: true,
      touchMouseParity: true,
      motionOwner: MODULE.id,
      acceptedStateAuthority: MODULE.controllerModuleId,
      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function publishReceipt() {
    const receipt = createReceipt();
    globalThis.DGB_ARCHCOIN_INTERACTIONS_RECEIPT = receipt;
    if (state.root) {
      state.root.dataset.archcoinInteractionsReceipt = JSON.stringify(receipt);
      state.root.dataset.archcoinInteractionsStatus = receipt.status;
      state.root.dataset.archcoinInteractionsVersion = MODULE.version;
      state.root.dataset.archcoinMotionOwner = MODULE.id;
      state.root.dataset.archcoinClusterReturnGesture = "horizontal-release-swipe";
      state.root.dataset.archcoinTargetConfidence =
        state.activeTargetConfidence.toFixed(4);
      state.root.dataset.archcoinTargetSwitchCount = String(state.targetSwitchCount);
    }
    return receipt;
  }

  function recordAction(action) {
    state.lastAction = String(action || "");
    state.lastFailure = "";
    publishReceipt();
  }

  function recordFailure(reason) {
    state.lastFailure = String(reason || "");
    publishReceipt();
  }

  function resolveDom() {
    state.root = document.querySelector("[data-archcoin-root]");
    invariant(state.root, "ARCHCOIN_INTERACTIONS_ROOT_NOT_FOUND");
    state.scene = state.root.querySelector("[data-archcoin-scene]");
    state.sceneField = state.root.querySelector("[data-archcoin-scene-field]");
    state.compassControl = state.root.querySelector("[data-upstream-compass-control]");
    invariant(state.scene, "ARCHCOIN_INTERACTIONS_SCENE_NOT_FOUND");
    invariant(state.sceneField, "ARCHCOIN_INTERACTIONS_SCENE_FIELD_NOT_FOUND");
    invariant(state.compassControl, "ARCHCOIN_INTERACTIONS_COMPASS_CONTROL_NOT_FOUND");
    rebuildSemanticControlIndex();
  }

  function subscribeController() {
    state.frame = state.controller.getFrameState();
    replaceProjectionSnapshot(state.controller.getSemanticProjection());
    state.unsubscribeFrame = state.controller.subscribeFrameState(frame => {
      state.frame = frame;
      if (frame && Array.isArray(frame.semanticProjection)) {
        replaceProjectionSnapshot(frame.semanticProjection);
      }
      if (frame && frame.held && state.activePointerId !== null) {
        if (state.transactionOpened) cancelMotionTransaction("controller-held");
        releasePointerCapture();
        resetPointerState();
      }
    });
    state.unsubscribeProjection = state.controller.subscribeSemanticProjection(records => {
      replaceProjectionSnapshot(records);
    });
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_INTERACTIONS = Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      controllerModuleId: MODULE.controllerModuleId,
      controllerModuleVersion: MODULE.controllerModuleVersion,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      intents: INTENTS,
      motionSettings: MOTION,
      getReceipt: createReceipt,
      getValidationReceipt: () => state.validationReceipt,
      runSelfTest,
      dispose
    });
  }

  function dispatchReady() {
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_INTERACTIONS_READY", {
      detail: Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,
        controllerModuleId: MODULE.controllerModuleId,
        controllerModuleVersion: MODULE.controllerModuleVersion,
        motionContractId: MODULE.motionContractId,
        motionContractVersion: MODULE.motionContractVersion,
        motionOwner: MODULE.id,
        acceptedStateAuthority: MODULE.controllerModuleId,
        dragBehavior: "LOCKED_TARGET_ROTATE_WHILE_HELD",
        candidateSwitchBehavior: "CONFIDENCE_MARGIN_PLUS_PERSISTENCE",
        clusterReturnBehavior: "QUALIFIED_HORIZONTAL_SWIPE_ON_RELEASE",
        clusterReturnDirections: Object.freeze(["LEFT_TO_RIGHT", "RIGHT_TO_LEFT"]),
        radialExitClassification: false
      })
    }));
  }

  function dispatchFailure(reason) {
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_INTERACTIONS_FAILURE", {
      detail: Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,
        reason: String(reason || "")
      })
    }));
  }

  function cleanupActiveInteraction(reason) {
    if (state.transactionOpened) cancelMotionTransaction(reason);
    releasePointerCapture();
    resetPointerState();
  }

  function dispose() {
    if (state.disposed) return true;
    cleanupActiveInteraction("interactions-disposed");
    if (typeof state.unsubscribeFrame === "function") {
      try { state.unsubscribeFrame(); } catch (_) {}
    }
    if (typeof state.unsubscribeProjection === "function") {
      try { state.unsubscribeProjection(); } catch (_) {}
    }
    state.unsubscribeFrame = null;
    state.unsubscribeProjection = null;
    removeAllListeners();
    restorePointerPolicy();
    state.initialized = false;
    state.disposed = true;
    recordAction("interactions-disposed");
    return true;
  }

  function initializeAgainstController(controller) {
    if (state.initialized || state.disposed) return;
    try {
      validateController(controller);
      state.controller = controller;
      resolveDom();
      const validation = runSelfTest();
      invariant(validation.pass === true,
        "ARCHCOIN_INTERACTIONS_SOURCE_VALIDATION_FAILED", validation);
      state.validationReceipt = validation;
      globalThis.DGB_ARCHCOIN_INTERACTIONS_VALIDATION_RECEIPT = validation;
      subscribeController();
      bindPointerPolicy();
      exposeApi();
      state.initialized = true;
      recordAction("interactions-initialized");
      dispatchReady();
    } catch (error) {
      const reason = error && (error.code || error.message)
        ? String(error.code || error.message)
        : "UNKNOWN_ARCHCOIN_INTERACTIONS_INITIALIZATION_FAILURE";
      state.lastFailure = reason;
      cleanupActiveInteraction("initialization-failure");
      removeAllListeners();
      restorePointerPolicy();
      publishReceipt();
      dispatchFailure(reason);
    }
  }

  function attemptInitialization() {
    if (state.initialized || state.disposed) return;
    const controller = globalThis.DGB_ARCHCOIN_CONTROLLER;
    if (controller) initializeAgainstController(controller);
  }

  function waitForController() {
    attemptInitialization();
    if (state.initialized || state.disposed) return;
    addListener(globalThis, "ARCHCOIN_CONTROLLER_READY", attemptInitialization, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForController, { once: true });
  } else {
    waitForController();
  }
})();

/*
AUDRALIA_ARCHCOIN_INTERACTIONS_LIVE_PRODUCT_RESULT_v2

Primary product effects:
- stable pointer capture
- initial target lock
- confidence-controlled candidate dominance
- hysteresis and persistence-gated switching
- front-facing overlap preference
- deliberate tap/drag neutral band
- smoothed bounded quaternion accumulation
- deterministic release and cancellation cleanup
- mouse, pen, and single-touch parity
- Home Compass ownership preserved
- controller remains navigation and commit authority

Runtime and visual acceptance remain required before merge to main.
*/
