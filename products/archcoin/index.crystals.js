/* /products/archcoin/index.crystals.js
   ARCHCOIN transactional constellation renderer.
   DGB_ARCHCOIN_CRYSTALS 3.0.0-transactional-postures
*/
(() => {
  "use strict";
  const MODULE = Object.freeze({ id: "DGB_ARCHCOIN_CRYSTALS", version: "3.0.0-transactional-postures" });
  const CARDINAL = Object.freeze({ north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] });
  const ROOM_OFFSETS = Object.freeze([[-0.72, -0.58], [0.72, -0.58], [0.72, 0.58], [-0.72, 0.58]]);
  let root, field, semantic, controller, initialized = false;
  let roomButtons = [];
  let settlement = null;
  let raf = 0;

  function createRoomButtons() {
    roomButtons = [...document.querySelectorAll("[data-archcoin-room]")].map(source => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "archcoin-room-star";
      button.dataset.archcoinDestination = "";
      button.dataset.archcoinRoomProxy = "";
      button.dataset.destinationType = "room";
      button.dataset.destinationId = source.dataset.destinationId;
      button.dataset.roomId = source.dataset.roomId;
      button.dataset.wing = source.dataset.wing;
      button.dataset.label = source.dataset.label;
      button.dataset.route = source.dataset.route;
      button.dataset.visible = "false";
      button.setAttribute("aria-label", source.dataset.label || source.textContent.trim());
      button.innerHTML = `<span class="archcoin-star-core" aria-hidden="true"></span><span class="archcoin-star-label">${source.dataset.label || source.textContent.trim()}</span>`;
      semantic.appendChild(button);
      return button;
    });
  }

  function rotate2D(vector, yaw, pitch) {
    const angle = yaw * 2.7;
    const c = Math.cos(angle), s = Math.sin(angle);
    return [vector[0] * c - vector[1] * s, vector[0] * s + vector[1] * c + pitch * 1.8];
  }

  function place(element, x, y, depth, priority, visible) {
    element.style.setProperty("--star-x", `${50 + x * 33}%`);
    element.style.setProperty("--star-y", `${50 + y * 33}%`);
    element.style.setProperty("--star-depth", depth.toFixed(3));
    element.style.setProperty("--primary-weight", priority.toFixed(3));
    element.style.zIndex = String(30 + Math.round(depth * 10));
    element.dataset.visible = String(visible);
    element.hidden = !visible;
  }

  function targetPriority(frame, type, id) {
    if (frame.confirmationTargetType === type && frame.confirmationTargetId === id) return 1;
    if (frame.previewTargetType === type && frame.previewTargetId === id) return 0.82;
    if (frame.allocation.targetType === type && frame.allocation.targetId === id && !frame.allocation.ambiguous) return 0.45;
    return 0;
  }

  function render(frame) {
    root.dataset.archcoinCrystalsStatus = "ready";
    root.dataset.archcoinCrystalsReceipt = JSON.stringify({ module: MODULE, homeCompassIncluded: false, springPhysics: false, visualPrimary: frame.previewTargetId || frame.allocation.targetId || "" });
    const isConstellation = frame.structuralState === "CONSTELLATION";
    [...semantic.querySelectorAll("[data-archcoin-coin]")].forEach(button => {
      const id = button.dataset.destinationId;
      const vector = rotate2D(CARDINAL[id], frame.orientation.yaw, frame.orientation.pitch);
      place(button, vector[0] * 0.92, vector[1] * 0.92, 0.55 + vector[1] * -0.18, targetPriority(frame, "cardinal", id), isConstellation);
    });
    roomButtons.forEach(button => button.hidden = true);
    roomButtons.filter(button => button.dataset.wing === frame.activeWing).forEach((button, index) => {
      const vector = rotate2D(ROOM_OFFSETS[index], frame.clusterOrientation.yaw, frame.clusterOrientation.pitch);
      place(button, vector[0], vector[1], 0.55 + vector[1] * -0.14, targetPriority(frame, "room", button.dataset.destinationId), !isConstellation);
    });
    const primaryId = frame.confirmationTargetId || frame.previewTargetId || (!frame.allocation.ambiguous ? frame.allocation.targetId : "");
    semantic.querySelectorAll("[data-archcoin-destination]").forEach(element => {
      const isPrimary = element.dataset.destinationId === primaryId;
      element.dataset.transactionPrimary = String(isPrimary);
      element.dataset.transactionPhase = isPrimary ? frame.transactionPhase : "";
      element.setAttribute("aria-current", isPrimary ? "true" : "false");
    });
    if (frame.transactionPhase === "SETTLEMENT" && !settlement) startSettlement(frame);
  }

  function startSettlement(frame) {
    settlement = { revision: frame.transactionRevision, targetType: frame.settlementTargetType, targetId: frame.settlementTargetId, startedAt: performance.now(), lastError: 1 };
    cancelAnimationFrame(raf);
    tickSettlement();
  }

  function tickSettlement() {
    if (!settlement) return;
    const elapsed = performance.now() - settlement.startedAt;
    settlement.lastError *= 0.78;
    if (settlement.lastError <= 0.008) {
      const complete = settlement;
      settlement = null;
      controller.completeSettlement({ revision: complete.revision, targetType: complete.targetType, targetId: complete.targetId, finalAngularError: 0.006, finalPositionError: 0.006, finalVisualError: complete.lastError });
      return;
    }
    if (elapsed >= 700) {
      const failed = settlement;
      settlement = null;
      controller.completeSettlement({ revision: failed.revision, targetType: failed.targetType, targetId: failed.targetId, timedOut: true });
      return;
    }
    raf = requestAnimationFrame(tickSettlement);
  }

  function initialize() {
    if (initialized) return true;
    root = document.querySelector("[data-archcoin-root]");
    field = document.querySelector("[data-archcoin-scene-field]");
    semantic = document.querySelector("[data-archcoin-objects]");
    controller = window.DGB_ARCHCOIN_CONTROLLER;
    if (!root || !field || !semantic || !controller) return false;
    createRoomButtons();
    controller.subscribe(render);
    initialized = true;
    return true;
  }

  window.DGB_ARCHCOIN_CRYSTALS = Object.freeze({ MODULE, initialize });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true }); else initialize();
})();