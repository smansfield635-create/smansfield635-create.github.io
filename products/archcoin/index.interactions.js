/* /products/archcoin/index.interactions.js
   ARCHCOIN pointer, keyboard, territory and confidence interpreter.
   DGB_ARCHCOIN_INTERACTIONS 2.0.0-transactional-confidence
*/
(() => {
  "use strict";
  const MODULE = Object.freeze({ id: "DGB_ARCHCOIN_INTERACTIONS", version: "2.0.0-transactional-confidence" });
  const CONFIG = Object.freeze({
    dragActivationDistancePx: 7,
    tapMaximumDistancePx: 9,
    tapMaximumDurationMs: 600,
    orbitRadiansPerPixel: 0.0060,
    clusterRadiansPerPixel: 0.0068,
    clusterSwipeMinimumHorizontalDistancePx: 72,
    clusterSwipeMaximumVerticalDistancePx: 92,
    clusterSwipeHorizontalDominanceRatio: 1.6,
    clusterSwipeMaximumDurationMs: 560,
    clusterSwipeMinimumHorizontalVelocity: 0.3,
    clickSuppressionMs: 320
  });

  let controller;
  let root;
  let field;
  let pointer = null;
  let suppressUntil = 0;
  let initialized = false;

  const targetRecord = element => {
    const target = element?.closest?.("[data-archcoin-destination]");
    if (!target) return null;
    return {
      element: target,
      targetType: target.dataset.destinationType === "room" ? "room" : "cardinal",
      targetId: target.dataset.destinationId || target.dataset.cardinalId || target.dataset.roomId || "",
      semantic: true
    };
  };

  function territory(event) {
    const element = event.target;
    if (element.closest("[data-archcoin-confirm], [data-archcoin-cancel], [data-archcoin-return-to-orbit], [data-upstream-compass-control], a, summary, [role='tab']")) return "BLOCKED_UI_CONTROL";
    const record = targetRecord(element);
    if (record) return record.targetType === "room" ? "ROOM_CONTROL" : "CARDINAL_CONTROL";
    if (field.contains(element)) return controller.getFrame().structuralState === "CONSTELLATION" ? "OPEN_CONSTELLATION_FIELD" : "OPEN_CLUSTER_FIELD";
    return "OUTSIDE_FIELD";
  }

  function begin(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const area = territory(event);
    if (area === "BLOCKED_UI_CONTROL" || area === "OUTSIDE_FIELD") return;
    pointer = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startedAt: performance.now(),
      area,
      target: targetRecord(event.target),
      dragging: false,
      totalX: 0,
      totalY: 0
    };
    field.setPointerCapture?.(event.pointerId);
  }

  function move(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.lastX;
    const dy = event.clientY - pointer.lastY;
    pointer.totalX = event.clientX - pointer.startX;
    pointer.totalY = event.clientY - pointer.startY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    if (!pointer.dragging && Math.hypot(pointer.totalX, pointer.totalY) >= CONFIG.dragActivationDistancePx) {
      pointer.dragging = true;
      controller.beginAllocation({ source: pointer.area });
    }
    if (!pointer.dragging) return;
    event.preventDefault();
    const frame = controller.getFrame();
    const sensitivity = frame.structuralState === "CONSTELLATION" ? CONFIG.orbitRadiansPerPixel : CONFIG.clusterRadiansPerPixel;
    const orientation = frame.structuralState === "CONSTELLATION" ? frame.orientation : frame.clusterOrientation;
    controller.updateOrientation({ yaw: orientation.yaw + dx * sensitivity, pitch: orientation.pitch - dy * sensitivity });
    controller.updateAllocation(inferCandidate(event.clientX, event.clientY));
  }

  function inferCandidate(x, y) {
    const candidates = [...field.querySelectorAll("[data-archcoin-destination][data-visible='true']")].map(element => {
      const rect = element.getBoundingClientRect();
      const d = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
      const proximity = Math.max(0, 1 - d / Math.max(field.clientWidth, field.clientHeight));
      return {
        targetType: element.dataset.destinationType === "room" ? "room" : "cardinal",
        targetId: element.dataset.destinationId,
        score: Math.min(1, proximity + (element.matches(":hover") ? 0.22 : 0) + 0.08)
      };
    }).sort((a, b) => b.score - a.score);
    const primary = candidates[0] || { targetType: "", targetId: "", score: 0 };
    const runner = candidates[1] || { targetId: "", score: 0 };
    return {
      targetType: primary.targetType,
      targetId: primary.targetId,
      confidence: primary.score,
      runnerUpId: runner.targetId,
      margin: Math.max(0, primary.score - runner.score)
    };
  }

  function end(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const completed = pointer;
    pointer = null;
    field.releasePointerCapture?.(event.pointerId);
    const duration = performance.now() - completed.startedAt;
    const horizontal = Math.abs(completed.totalX);
    const vertical = Math.abs(completed.totalY);
    const velocity = duration > 0 ? horizontal / duration : 0;
    const frame = controller.getFrame();
    const clusterReturn = frame.structuralState !== "CONSTELLATION" && completed.dragging && horizontal >= CONFIG.clusterSwipeMinimumHorizontalDistancePx && vertical <= CONFIG.clusterSwipeMaximumVerticalDistancePx && horizontal / Math.max(1, vertical) >= CONFIG.clusterSwipeHorizontalDominanceRatio && duration <= CONFIG.clusterSwipeMaximumDurationMs && velocity >= CONFIG.clusterSwipeMinimumHorizontalVelocity;
    if (clusterReturn) {
      suppressUntil = performance.now() + CONFIG.clickSuppressionMs;
      controller.returnToConstellation("CLUSTER_RETURN_SWIPE");
      return;
    }
    if (completed.dragging) {
      suppressUntil = performance.now() + CONFIG.clickSuppressionMs;
      controller.commitOrientation();
      controller.completeAllocation({ deliberate: false });
      return;
    }
    if (duration <= CONFIG.tapMaximumDurationMs && Math.hypot(completed.totalX, completed.totalY) <= CONFIG.tapMaximumDistancePx && completed.target) controller.selectDestination({ ...completed.target, deliberate: true });
  }

  function cancelPointer(reason) {
    if (!pointer) return;
    pointer = null;
    controller.cancelTransaction({ reason });
  }

  function click(event) {
    if (performance.now() < suppressUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const record = targetRecord(event.target);
    if (!record) return;
    event.preventDefault();
    controller.selectDestination({ ...record, deliberate: true });
  }

  function keydown(event) {
    if (event.key === "Escape") {
      const frame = controller.getFrame();
      if (frame.structuralState !== "CONSTELLATION") controller.returnToConstellation("ESCAPE");
      else controller.cancelTransaction({ reason: "ESCAPE" });
      return;
    }
    if (!["Enter", " "].includes(event.key)) return;
    const record = targetRecord(event.target);
    if (!record) return;
    event.preventDefault();
    controller.selectDestination({ ...record, deliberate: true });
  }

  function initialize() {
    if (initialized) return true;
    controller = window.DGB_ARCHCOIN_CONTROLLER;
    root = document.querySelector("[data-archcoin-root]");
    field = document.querySelector("[data-archcoin-scene-field]");
    if (!controller || !root || !field) return false;
    field.addEventListener("pointerdown", begin);
    field.addEventListener("pointermove", move, { passive: false });
    field.addEventListener("pointerup", end);
    field.addEventListener("pointercancel", () => cancelPointer("POINTER_CANCEL"));
    field.addEventListener("lostpointercapture", () => cancelPointer("LOST_POINTER_CAPTURE"));
    field.addEventListener("click", click, true);
    field.addEventListener("keydown", keydown);
    window.addEventListener("blur", () => cancelPointer("WINDOW_BLUR"));
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelPointer("PAGE_HIDDEN"); });
    root.dataset.archcoinInteractionsStatus = "ready";
    root.dataset.archcoinInteractionsReceipt = JSON.stringify({ module: MODULE, bidirectionalClusterReturn: true, routeAuthority: false });
    initialized = true;
    return true;
  }

  window.DGB_ARCHCOIN_INTERACTIONS = Object.freeze({ MODULE, CONFIG, initialize });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();