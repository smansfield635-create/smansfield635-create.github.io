/* /prototypes/universal-compass/archcoin.interactions.round1.js
   ARCHCOIN calibration lab · interaction round 1.
   Loads the exact source interaction module, disposes its listeners, then installs
   corrected drag direction, deterministic focus acquisition, nearest-target
   settlement, projection-driven semantic controls, tap selection, and cluster
   swipe return. Production ARCHCOIN files are not modified.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND1_v1";
  const SOURCE_URL = `./archcoin.index.interactions.source.js?build=${encodeURIComponent(BUILD)}`;
  const READY_EVENT = "ARCHCOIN_INTERACTIONS_READY";
  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const QUATERNION_IDENTITY = Object.freeze([0, 0, 0, 1]);
  const SETTINGS = Object.freeze({
    dragThresholdPx: 8,
    tapMaximumDurationMs: 650,
    orbitRadiansPerPixel: 0.0058,
    clusterRadiansPerPixel: 0.0062,
    maximumIncrementalAngle: 0.17,
    maximumDeltaPx: 36,
    clusterSwipeMinimumDistancePx: 72,
    clusterSwipeMaximumDurationMs: 560,
    clusterSwipeDominanceRatio: 1.55,
    cardinalLabelOffsetPx: 42,
    cardinalLabelEdgePaddingPx: 56
  });

  let installed = false;
  let sourceScript = null;

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeQuaternion(value, fallback = QUATERNION_IDENTITY) {
    const source = Array.isArray(value) || ArrayBuffer.isView(value)
      ? Array.from(value, Number)
      : null;
    if (!source || source.length !== 4 || source.some(component => !Number.isFinite(component))) {
      return Array.from(fallback);
    }
    const length = Math.hypot(...source);
    if (!Number.isFinite(length) || length < 1e-8) return Array.from(fallback);
    return source.map(component => component / length);
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
    if (!Number.isFinite(axisLength) || axisLength < 1e-8 || !Number.isFinite(angle)) {
      return Array.from(QUATERNION_IDENTITY);
    }
    const half = angle * 0.5;
    const scale = Math.sin(half) / axisLength;
    return normalizeQuaternion([
      axisX * scale,
      axisY * scale,
      axisZ * scale,
      Math.cos(half)
    ]);
  }

  function correctedIncrementQuaternion(dx, dy, radiansPerPixel) {
    const boundedDx = clamp(dx, -SETTINGS.maximumDeltaPx, SETTINGS.maximumDeltaPx);
    const boundedDy = clamp(dy, -SETTINGS.maximumDeltaPx, SETTINGS.maximumDeltaPx);
    const length = Math.hypot(boundedDx, boundedDy);
    if (length < 1e-8) return Array.from(QUATERNION_IDENTITY);
    const angle = clamp(length * radiansPerPixel, 0, SETTINGS.maximumIncrementalAngle);

    // Corrected physical mapping:
    // dragging left moves the grabbed constellation left, rather than reversing it.
    return quaternionFromAxisAngle(boundedDy, -boundedDx, 0, angle);
  }

  function installCalibrationInteractions() {
    if (installed) return;

    const controller = globalThis.DGB_ARCHCOIN_CONTROLLER;
    const root = document.querySelector("[data-archcoin-root]");
    const field = root && root.querySelector("[data-archcoin-scene-field]");
    if (!controller || !root || !field) {
      throw new Error("ARCHCOIN_CALIBRATION_ROUND1_FOUNDATION_MISSING");
    }

    installed = true;
    const listeners = [];
    let unsubscribeProjection = null;
    let unsubscribeFrame = null;

    const state = {
      projections: Array.from(controller.getSemanticProjection() || []),
      frame: controller.getFrameState(),
      activePointerId: null,
      pointerType: "",
      pointerDownAt: 0,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      totalDx: 0,
      totalDy: 0,
      dragActive: false,
      transactionOpen: false,
      transactionKind: "",
      transactionWing: "",
      latestQuaternion: Array.from(QUATERNION_IDENTITY),
      pointerDownTarget: null,
      focusedRecord: null,
      suppressClickUntil: 0
    };

    root.dataset.archcoinCalibrationRound = BUILD;
    root.dataset.archcoinCalibrationInteraction = "corrected-drag-and-target-settlement";
    field.style.touchAction = "none";
    field.style.userSelect = "none";

    const focusReadout = document.createElement("output");
    focusReadout.className = "archcoin-calibration-focus";
    focusReadout.setAttribute("aria-live", "polite");
    focusReadout.textContent = "Focused target · Contract";
    field.append(focusReadout);

    function addListener(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      listeners.push({ target, type, handler, options });
    }

    function scenePoint(event) {
      const rect = field.getBoundingClientRect();
      return {
        x: finite(event.clientX) - rect.left,
        y: finite(event.clientY) - rect.top,
        width: rect.width,
        height: rect.height
      };
    }

    function mode() {
      const value = String(controller.getPresentationMode ? controller.getPresentationMode() : "");
      return value === "CLUSTER" ? "CLUSTER" : value === "CONSTELLATION" ? "CONSTELLATION" : "HELD";
    }

    function activeWing() {
      const frame = state.frame || controller.getFrameState();
      return normalizeWing(
        frame && (frame.activeClusterWing || frame.selectedCardinal || frame.orbitFocus)
      );
    }

    function orbitQuaternion() {
      const frame = state.frame || controller.getFrameState();
      return normalizeQuaternion(
        frame && frame.orbitOrientation && frame.orbitOrientation.quaternion
      );
    }

    function clusterQuaternion() {
      const frame = state.frame || controller.getFrameState();
      return normalizeQuaternion(
        frame && frame.cluster && frame.cluster.orientation && frame.cluster.orientation.quaternion
      );
    }

    function eligibleRecord(record, requestedMode = mode()) {
      if (!record || record.visible === false) return false;
      const kind = String(record.kind || "").toLowerCase();
      if (requestedMode === "CONSTELLATION") {
        return (kind === "cardinal" || kind === "coin") && Boolean(normalizeWing(record.id));
      }
      if (requestedMode === "CLUSTER") return kind === "room" && Boolean(String(record.id || "").trim());
      return false;
    }

    function controlForRecord(record) {
      if (!record) return null;
      const id = CSS.escape(String(record.id || ""));
      const kind = String(record.kind || "").toLowerCase();
      if (kind === "room") {
        return root.querySelector(`[data-archcoin-room][data-room-id="${id}"]`);
      }
      const wing = normalizeWing(record.id);
      return wing ? root.querySelector(`[data-archcoin-coin][data-wing="${wing}"]`) : null;
    }

    function labelForRecord(record) {
      const control = controlForRecord(record);
      if (!control) return String(record && record.id ? record.id : "Target");
      return String(
        control.dataset.label ||
        control.dataset.panelTitle ||
        control.dataset.coordinateLabel ||
        control.textContent ||
        record.id ||
        "Target"
      ).replace(/\s+/g, " ").trim();
    }

    function candidateScore(record, centerX, centerY) {
      const distance = Math.hypot(finite(record.x) - centerX, finite(record.y) - centerY);
      const radius = Math.max(16, finite(record.radiusPx, 24));
      const rearPenalty = String(record.depthLayer || "").toLowerCase() === "rear" ? 0.42 : 0;
      const overlapPenalty = record.compassOverlap ? 0.12 : 0;
      return distance / radius + rearPenalty + overlapPenalty;
    }

    function nearestPrimary(requestedMode = mode()) {
      const rect = field.getBoundingClientRect();
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;
      const candidates = state.projections.filter(record => eligibleRecord(record, requestedMode));
      candidates.sort((a, b) => candidateScore(a, centerX, centerY) - candidateScore(b, centerX, centerY));
      return candidates[0] || null;
    }

    function setFocusedRecord(record, reason = "projection") {
      if (!record) return;
      state.focusedRecord = record;
      root.querySelectorAll("[data-calibration-primary]").forEach(element => {
        element.removeAttribute("data-calibration-primary");
        element.removeAttribute("aria-current");
      });
      const control = controlForRecord(record);
      if (control) {
        control.dataset.calibrationPrimary = "true";
        control.setAttribute("aria-current", "true");
      }
      const label = labelForRecord(record);
      root.dataset.archcoinCalibrationFocusId = String(record.id || "");
      root.dataset.archcoinCalibrationFocusLabel = label;
      root.dataset.archcoinCalibrationFocusReason = reason;
      focusReadout.textContent = `Focused target · ${label}`;
    }

    function applyCardinalOffset(control, record, rect) {
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;
      const dx = finite(record.x) - centerX;
      const dy = finite(record.y) - centerY;
      const length = Math.max(1, Math.hypot(dx, dy));
      const offset = SETTINGS.cardinalLabelOffsetPx;
      const desiredX = clamp(
        finite(record.x) + dx / length * offset,
        SETTINGS.cardinalLabelEdgePaddingPx,
        rect.width - SETTINGS.cardinalLabelEdgePaddingPx
      );
      const desiredY = clamp(
        finite(record.y) + dy / length * offset,
        30,
        rect.height - 30
      );
      control.style.setProperty("--archcoin-label-offset-x", `${desiredX - finite(record.x)}px`);
      control.style.setProperty("--archcoin-label-offset-y", `${desiredY - finite(record.y)}px`);
    }

    function applyProjectionUi() {
      const rect = field.getBoundingClientRect();
      for (const record of state.projections) {
        const control = controlForRecord(record);
        if (!control) continue;
        const visible = record.visible !== false;
        const depth = String(record.depthLayer || "unknown").toLowerCase();
        control.style.setProperty("--archcoin-label-x", `${finite(record.x, rect.width * 0.5)}px`);
        control.style.setProperty("--archcoin-label-y", `${finite(record.y, rect.height * 0.5)}px`);
        control.dataset.archcoinProjectionVisible = visible ? "true" : "false";
        control.dataset.projectionVisible = visible ? "true" : "false";
        control.dataset.archcoinDepthLayer = depth;
        control.dataset.projectionDepthLayer = depth;
        control.dataset.archcoinCompassOverlap = record.compassOverlap ? "true" : "false";
        control.dataset.projectionCompassOverlap = record.compassOverlap ? "true" : "false";
        control.dataset.archcoinInteractionPriority = visible ? (depth === "front" ? "300" : "100") : "0";
        control.dataset.interactionPriority = control.dataset.archcoinInteractionPriority;
        control.style.pointerEvents = visible ? "auto" : "none";
        if (String(record.kind || "").toLowerCase() !== "room") {
          applyCardinalOffset(control, record, rect);
        }
      }
      if (!state.dragActive) {
        const primary = nearestPrimary();
        if (primary) setFocusedRecord(primary, "nearest-projection");
      }
    }

    function recordAtPoint(point) {
      const requestedMode = mode();
      const candidates = state.projections
        .filter(record => eligibleRecord(record, requestedMode))
        .map(record => {
          const radius = clamp(finite(record.radiusPx, 28) * 1.32, 24, 100);
          const distance = Math.hypot(finite(record.x) - point.x, finite(record.y) - point.y);
          const depthPenalty = String(record.depthLayer || "").toLowerCase() === "rear" ? 0.25 : 0;
          return { record, radius, distance, score: distance / radius + depthPenalty };
        })
        .filter(candidate => candidate.distance <= candidate.radius)
        .sort((a, b) => a.score - b.score);
      return candidates[0] ? candidates[0].record : null;
    }

    function semanticTargetFromEvent(event, point) {
      const element = event.target instanceof Element ? event.target : null;
      const compass = element && element.closest("[data-upstream-compass-control]");
      if (compass && field.contains(compass)) return { kind: "compass", id: "home-compass" };
      const room = element && element.closest("[data-archcoin-room]");
      if (room && field.contains(room)) {
        return { kind: "room", id: String(room.dataset.roomId || "").trim() };
      }
      const coin = element && element.closest("[data-archcoin-coin]");
      if (coin && field.contains(coin)) {
        return { kind: "cardinal", id: normalizeWing(coin.dataset.wing || coin.dataset.cardinalId) };
      }
      const record = recordAtPoint(point);
      if (!record) return { kind: "open-space", id: "" };
      return {
        kind: String(record.kind || "").toLowerCase() === "room" ? "room" : "cardinal",
        id: String(record.id || "").trim()
      };
    }

    function openTransaction() {
      if (state.transactionOpen) return true;
      const currentMode = mode();
      if (currentMode === "CONSTELLATION") {
        if (!controller.beginOrbitGesture()) return false;
        state.transactionKind = "orbit";
        state.latestQuaternion = orbitQuaternion();
      } else if (currentMode === "CLUSTER") {
        const wing = activeWing();
        if (!wing || !controller.beginClusterGesture(wing)) return false;
        state.transactionKind = "cluster";
        state.transactionWing = wing;
        state.latestQuaternion = clusterQuaternion();
      } else {
        return false;
      }
      state.transactionOpen = true;
      return true;
    }

    function cancelTransaction(reason) {
      if (!state.transactionOpen) return false;
      const cancelled = state.transactionKind === "orbit"
        ? controller.requestOrbitCancel(reason)
        : controller.requestClusterCancel(state.transactionWing, reason);
      state.transactionOpen = false;
      return cancelled;
    }

    function submitPreview(dx, dy) {
      if (!state.transactionOpen) return false;
      const sensitivity = state.transactionKind === "cluster"
        ? SETTINGS.clusterRadiansPerPixel
        : SETTINGS.orbitRadiansPerPixel;
      const delta = correctedIncrementQuaternion(dx, dy, sensitivity);
      const quaternion = quaternionMultiply(delta, state.latestQuaternion);
      const primary = nearestPrimary(state.transactionKind === "cluster" ? "CLUSTER" : "CONSTELLATION");
      const primaryId = primary
        ? String(primary.id || "")
        : state.transactionKind === "cluster"
          ? String(state.frame && state.frame.cluster && state.frame.cluster.previewPrimaryRoom || "")
          : normalizeWing(state.frame && (state.frame.orbitPreviewFocus || state.frame.orbitFocus)) || "north";
      if (!primaryId) return false;
      const accepted = state.transactionKind === "orbit"
        ? controller.requestOrbitPreview({ quaternion, primaryId: normalizeWing(primaryId) || "north" })
        : controller.requestClusterPreview(state.transactionWing, { quaternion, primaryId });
      if (accepted) {
        state.latestQuaternion = quaternion;
        if (primary) setFocusedRecord(primary, "drag-preview");
      }
      return accepted;
    }

    function commitAndSettle() {
      if (!state.transactionOpen) return false;
      const transactionKind = state.transactionKind;
      const focus = nearestPrimary(transactionKind === "cluster" ? "CLUSTER" : "CONSTELLATION") || state.focusedRecord;
      let committed = false;
      if (transactionKind === "orbit") {
        committed = controller.requestOrbitCommit();
        if (committed && focus) {
          const wing = normalizeWing(focus.id);
          if (wing) controller.requestOrbitFocus(wing);
        }
      } else {
        committed = controller.requestClusterCommit(state.transactionWing);
      }
      state.transactionOpen = false;
      if (focus) setFocusedRecord(focus, committed ? "release-settlement" : "release-uncommitted");
      return committed;
    }

    function activateTarget(target) {
      if (!target || !target.id && target.kind !== "compass") return false;
      if (target.kind === "cardinal") return controller.requestCardinalSelection(normalizeWing(target.id));
      if (target.kind === "room") return controller.requestRoomSelection(String(target.id));
      if (target.kind === "compass") return controller.requestCompassSelection();
      return false;
    }

    function resetPointer() {
      state.activePointerId = null;
      state.pointerType = "";
      state.pointerDownAt = 0;
      state.startX = 0;
      state.startY = 0;
      state.lastX = 0;
      state.lastY = 0;
      state.totalDx = 0;
      state.totalDy = 0;
      state.dragActive = false;
      state.transactionOpen = false;
      state.transactionKind = "";
      state.transactionWing = "";
      state.pointerDownTarget = null;
      field.classList.remove("is-calibration-dragging");
    }

    function handlePointerDown(event) {
      if (state.activePointerId !== null) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (mode() === "HELD") return;
      const point = scenePoint(event);
      state.activePointerId = event.pointerId;
      state.pointerType = String(event.pointerType || "mouse");
      state.pointerDownAt = performance.now();
      state.startX = state.lastX = point.x;
      state.startY = state.lastY = point.y;
      state.pointerDownTarget = semanticTargetFromEvent(event, point);
      const hitRecord = recordAtPoint(point);
      if (hitRecord) setFocusedRecord(hitRecord, "pointer-down");
      try { field.setPointerCapture(event.pointerId); } catch (_) {}
      event.preventDefault();
    }

    function handlePointerMove(event) {
      const point = scenePoint(event);
      if (state.activePointerId === null) {
        if (event.pointerType === "mouse") {
          const hoverRecord = recordAtPoint(point);
          if (hoverRecord) setFocusedRecord(hoverRecord, "pointer-hover");
        }
        return;
      }
      if (state.activePointerId !== event.pointerId) return;
      const dxFromStart = point.x - state.startX;
      const dyFromStart = point.y - state.startY;
      state.totalDx = dxFromStart;
      state.totalDy = dyFromStart;
      const distance = Math.hypot(dxFromStart, dyFromStart);
      if (!state.dragActive && distance >= SETTINGS.dragThresholdPx && state.pointerDownTarget.kind !== "compass") {
        state.dragActive = openTransaction();
        if (state.dragActive) field.classList.add("is-calibration-dragging");
      }
      if (!state.dragActive) return;
      event.preventDefault();
      const dx = point.x - state.lastX;
      const dy = point.y - state.lastY;
      if (submitPreview(dx, dy)) {
        state.lastX = point.x;
        state.lastY = point.y;
      }
    }

    function finalizePointer(event, cancelled = false) {
      if (state.activePointerId !== event.pointerId) return;
      const elapsed = performance.now() - state.pointerDownAt;
      let handled = false;
      if (cancelled) {
        handled = cancelTransaction("pointer-cancel");
      } else if (state.dragActive) {
        const currentMode = mode();
        const swipeQualified = currentMode === "CLUSTER" &&
          elapsed <= SETTINGS.clusterSwipeMaximumDurationMs &&
          Math.abs(state.totalDx) >= SETTINGS.clusterSwipeMinimumDistancePx &&
          Math.abs(state.totalDx) >= Math.abs(state.totalDy) * SETTINGS.clusterSwipeDominanceRatio;
        if (swipeQualified) {
          cancelTransaction("cluster-return-swipe");
          handled = controller.requestReturnToConstellation();
        } else {
          handled = commitAndSettle();
        }
      } else if (elapsed <= SETTINGS.tapMaximumDurationMs) {
        handled = activateTarget(state.pointerDownTarget);
      }
      state.suppressClickUntil = performance.now() + 420;
      try { field.releasePointerCapture(event.pointerId); } catch (_) {}
      resetPointer();
      root.dataset.archcoinCalibrationLastGesture = handled ? "handled" : "unhandled";
    }

    function handleClickCapture(event) {
      if (performance.now() < state.suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (event.detail !== 0) return;
      const point = scenePoint(event);
      const target = semanticTargetFromEvent(event, point);
      if (target.kind !== "open-space") {
        event.preventDefault();
        activateTarget(target);
      }
    }

    function handleFocusIn(event) {
      const point = { x: 0, y: 0 };
      const target = semanticTargetFromEvent(event, point);
      const record = state.projections.find(candidate => String(candidate.id || "") === target.id);
      if (record) setFocusedRecord(record, "keyboard-focus");
    }

    addListener(field, "pointerdown", handlePointerDown, { passive: false });
    addListener(field, "pointermove", handlePointerMove, { passive: false });
    addListener(field, "pointerup", event => finalizePointer(event, false), { passive: false });
    addListener(field, "pointercancel", event => finalizePointer(event, true), { passive: false });
    addListener(field, "lostpointercapture", event => {
      if (state.activePointerId === event.pointerId) finalizePointer(event, true);
    }, false);
    addListener(root, "click", handleClickCapture, true);
    addListener(field, "focusin", handleFocusIn, true);
    addListener(field, "dragstart", event => event.preventDefault(), true);

    unsubscribeProjection = controller.subscribeSemanticProjection(records => {
      state.projections = Array.from(records || []);
      requestAnimationFrame(applyProjectionUi);
    });
    unsubscribeFrame = controller.subscribeFrameState(frame => {
      state.frame = frame;
      if (frame && Array.isArray(frame.semanticProjection)) {
        state.projections = Array.from(frame.semanticProjection);
      }
      requestAnimationFrame(applyProjectionUi);
    });

    requestAnimationFrame(applyProjectionUi);

    const calibrationApi = Object.freeze({
      moduleId: "DGB_ARCHCOIN_INTERACTIONS",
      moduleVersion: "3.0.0-calibration-round1-main-focus-settlement",
      build: BUILD,
      correctedHorizontalDrag: true,
      nearestTargetSettlement: true,
      liveTargetIdentification: true,
      projectionDomApplication: true,
      getFocusedTarget: () => state.focusedRecord,
      getReceipt: () => Object.freeze({
        build: BUILD,
        installed,
        correctedHorizontalDrag: true,
        nearestTargetSettlement: true,
        focusId: state.focusedRecord ? state.focusedRecord.id : "",
        projectionCount: state.projections.length
      }),
      dispose: () => {
        listeners.forEach(binding => {
          try { binding.target.removeEventListener(binding.type, binding.handler, binding.options); } catch (_) {}
        });
        if (typeof unsubscribeProjection === "function") unsubscribeProjection();
        if (typeof unsubscribeFrame === "function") unsubscribeFrame();
        focusReadout.remove();
        installed = false;
        return true;
      }
    });

    globalThis.DGB_ARCHCOIN_INTERACTIONS = calibrationApi;
    globalThis.DGB_ARCHCOIN_CALIBRATION_INTERACTIONS = calibrationApi;
    globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CALIBRATION_ROUND1_READY", {
      detail: calibrationApi.getReceipt()
    }));
  }

  function replaceSourceInteractions() {
    const sourceApi = globalThis.DGB_ARCHCOIN_INTERACTIONS;
    if (!sourceApi || typeof sourceApi.dispose !== "function") return;
    globalThis.removeEventListener(READY_EVENT, replaceSourceInteractions);
    globalThis.DGB_ARCHCOIN_INTERACTIONS_SOURCE = sourceApi;
    sourceApi.dispose();
    installCalibrationInteractions();
  }

  globalThis.addEventListener(READY_EVENT, replaceSourceInteractions);
  sourceScript = document.createElement("script");
  sourceScript.src = SOURCE_URL;
  sourceScript.async = false;
  sourceScript.dataset.archcoinCalibrationSource = BUILD;
  sourceScript.addEventListener("load", () => {
    if (globalThis.DGB_ARCHCOIN_INTERACTIONS && !installed) replaceSourceInteractions();
  }, { once: true });
  sourceScript.addEventListener("error", () => {
    throw new Error("ARCHCOIN_CALIBRATION_SOURCE_INTERACTIONS_LOAD_FAILED");
  }, { once: true });
  document.head.append(sourceScript);
})();
