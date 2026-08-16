/*
 * LAWS_DESTINATION_CAROUSEL_RUNTIME_v7
 * Single-trajectory Euclidean pointer transaction for the existing Laws destination records.
 * Presentation/interaction only. No content, route, evidence, Compass, or claim authority.
 */
(() => {
  "use strict";

  const CONTRACT = "LAWS_DESTINATION_CAROUSEL_RUNTIME_v7";
  const ROOT_SELECTOR = "[data-laws-root-rolodex-section]";
  const FIELD_SELECTOR = ".laws-rolodex-field[data-rolodex-id]";
  const CLASSIFY_PX = 8;
  const AXIS_RATIO = 1.12;
  const STEP_VIEWPORT_RATIO = .72;
  const SETTLE_DURATION_MS = 420;
  const CANONICAL_EPSILON = 1e-7;
  const POST_LANDING_GUARD_MS = 1000;
  const stateByField = new WeakMap();
  const fieldByRolodexId = new Map();
  let installed = false;
  let transactionSequence = 0;

  const wrap = (value, count) => count ? ((value % count) + count) % count : 0;
  const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };
  const now = () => performance.now();

  function nearestCircularRelativePosition(index, position, count) {
    const virtualIndex = index + Math.round((position - index) / count) * count;
    return virtualIndex - position;
  }

  function geometryFor(relative, count) {
    const d = relative;
    const abs = Math.abs(d);
    const sign = Math.sign(d);
    const near = smoothstep(Math.min(abs, 1));
    const x = d * 86;
    const z = abs <= 1 ? 78 - 260 * near : Math.max(-260, -182 - (abs - 1) * 78);
    const rotate = -sign * Math.min(15, abs * 9);
    const scale = Math.max(.62, 1 - abs * .18);
    const opacity = abs <= 1 ? 1 - .76 * near : Math.max(.045, .24 - (abs - 1) * .12);
    const blur = abs <= 1 ? .55 * near : Math.min(2.4, .55 + (abs - 1) * .9);
    const order = Math.max(1, count + 2 - Math.round(abs * 2));
    return { x, z, rotate, scale, opacity, blur, order };
  }

  function spatiallyBusy(state) {
    return state.gestureState === "pending" || state.gestureState === "dragging" || state.gestureState === "settling";
  }

  function trace(state, type, detail = {}) {
    const sample = Object.freeze({
      type,
      t: now(),
      transactionId: state.transactionId,
      phase: state.gestureState,
      p: state.orbitPosition,
      q: state.targetDetent,
      committedIndex: state.index,
      ...detail
    });
    state.trace.push(sample);
    if (state.trace.length > 600) state.trace.splice(0, state.trace.length - 600);
    return sample;
  }

  function contractDetail(field, state, reason) {
    const active = state.cards[state.index];
    return Object.freeze({
      contract: CONTRACT,
      reason,
      rolodexId: field.dataset.rolodexId || "",
      index: state.index,
      count: state.cards.length,
      destinationId: active?.dataset.destinationId || "",
      orbitPosition: state.orbitPosition,
      targetDetent: state.targetDetent,
      transactionId: state.transactionId,
      transactionPhase: state.gestureState,
      dragging: state.gestureState === "dragging",
      settling: state.gestureState === "settling",
      settled: state.settled,
      continuousPointerGeometry: true,
      fractionalOrbitPosition: true,
      singleAuthoritativeOrbitCoordinate: true,
      singleTrajectorySettlement: true,
      selectionDuringDrag: false,
      semanticIndexCommandsGeometry: false,
      settleToNearestDetent: true,
      geometryOwnedSettlementCompletion: true,
      timerOwnedSettlementCompletion: false,
      verticalGesturePassthrough: true,
      directionOnlyGesture: false,
      liveGestureGeometry: true,
      atomicRotation: false,
      postLandingGuardMs: POST_LANDING_GUARD_MS,
      navigationAuthority: false,
      contentAuthority: false,
      routeAuthority: false,
      evidenceAuthority: false
    });
  }

  function publish(field, state, reason) {
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_CHANGED", { detail: contractDetail(field, state, reason) }));
  }

  function renderGeometry(field, state, position = state.orbitPosition) {
    const count = state.cards.length;
    state.orbitPosition = position;
    state.cards.forEach((card, index) => {
      const relative = nearestCircularRelativePosition(index, position, count);
      const g = geometryFor(relative, count);
      const active = index === state.index;
      card.dataset.active = String(active);
      card.dataset.carouselRelative = String(relative);
      card.setAttribute("aria-current", active ? "true" : "false");
      card.setAttribute("aria-hidden", active ? "false" : "true");
      card.style.setProperty("--laws-carousel-x", `${g.x}%`);
      card.style.setProperty("--laws-carousel-z", `${g.z}px`);
      card.style.setProperty("--laws-carousel-rotate", `${g.rotate}deg`);
      card.style.setProperty("--laws-carousel-scale", String(g.scale));
      card.style.setProperty("--laws-carousel-opacity", String(g.opacity));
      card.style.setProperty("--laws-carousel-blur", `${g.blur}px`);
      card.style.zIndex = String(g.order);
      const enter = card.querySelector(".laws-rolodex-enter");
      if (enter) enter.tabIndex = active ? 0 : -1;
    });
    state.position.textContent = `${state.index + 1} / ${count}`;
    field.dataset.carouselIndex = String(state.index);
    field.dataset.carouselOrbitPosition = String(position);
    field.dataset.carouselTargetDetent = state.targetDetent == null ? "" : String(state.targetDetent);
    field.dataset.carouselTransactionId = state.transactionId || "";
    field.dataset.carouselDragging = String(state.gestureState === "dragging");
    field.dataset.carouselSettled = String(state.settled);
    field.dataset.carouselGestureState = state.gestureState;
  }

  function setSpatialTransitionsDisabled(state, disabled) {
    state.viewport.dataset.carouselDirectGeometry = String(disabled);
    for (const card of state.cards) {
      if (disabled) card.style.setProperty("transition", "none", "important");
      else card.style.removeProperty("transition");
    }
  }

  function canonicalGeometryMatches(state, detent) {
    if (Math.abs(state.orbitPosition - detent) > CANONICAL_EPSILON) return false;
    return state.cards.every((card, index) => {
      const expectedRelative = nearestCircularRelativePosition(index, detent, state.cards.length);
      const actualRelative = Number(card.dataset.carouselRelative);
      return Number.isFinite(actualRelative) && Math.abs(actualRelative - expectedRelative) <= CANONICAL_EPSILON;
    });
  }

  function closeTransaction(field, state, detent, reason, focus = false) {
    if (state.settleFrame) cancelAnimationFrame(state.settleFrame);
    state.settleFrame = 0;
    state.orbitPosition = detent;
    state.targetDetent = detent;
    state.detentPosition = detent;
    state.index = wrap(detent, state.cards.length);
    state.settled = true;
    state.gestureState = "idle";
    renderGeometry(field, state, detent);
    const canonical = canonicalGeometryMatches(state, detent);
    field.dataset.carouselCanonicalLanding = String(canonical);
    state.lastLandingTime = now();
    state.guardUntil = state.lastLandingTime + POST_LANDING_GUARD_MS;
    trace(state, "canonical-landing", { reason, detent, canonical, guardUntil: state.guardUntil });
    setSpatialTransitionsDisabled(state, false);
    publish(field, state, `${reason}-settled`);
    if (focus) state.cards[state.index]?.querySelector(".laws-rolodex-enter")?.focus({ preventScroll: true });
    state.transactionId = null;
    field.dataset.carouselTransactionId = "";
  }

  function settleSameCoordinate(field, state, detent, reason, focus = false) {
    if (state.settleFrame) cancelAnimationFrame(state.settleFrame);
    state.targetDetent = detent;
    const startPosition = state.orbitPosition;
    const distance = detent - startPosition;
    state.settled = false;
    state.gestureState = "settling";
    setSpatialTransitionsDisabled(state, true);
    trace(state, "settlement-begin", { reason, startPosition, detent });
    renderGeometry(field, state, startPosition);
    publish(field, state, reason);

    if (reducedMotion() || Math.abs(distance) <= CANONICAL_EPSILON) {
      closeTransaction(field, state, detent, reason, focus);
      return;
    }

    const startedAt = now();
    let lastPosition = startPosition;
    const direction = Math.sign(distance);

    const frame = timestamp => {
      if (state.gestureState !== "settling" || state.targetDetent !== detent) return;
      const progress = clamp01((timestamp - startedAt) / SETTLE_DURATION_MS);
      const eased = smoothstep(progress);
      let next = startPosition + distance * eased;
      if (direction > 0) next = Math.max(lastPosition, Math.min(detent, next));
      if (direction < 0) next = Math.min(lastPosition, Math.max(detent, next));
      lastPosition = next;
      renderGeometry(field, state, next);
      trace(state, "settlement-frame", { progress, next });

      const reached = Math.abs(next - detent) <= CANONICAL_EPSILON || progress >= 1;
      if (reached) {
        renderGeometry(field, state, detent);
        if (!canonicalGeometryMatches(state, detent)) {
          field.dataset.carouselCanonicalLanding = "false";
          trace(state, "canonical-landing-failed", { reason, detent });
          return;
        }
        closeTransaction(field, state, detent, reason, focus);
        return;
      }
      state.settleFrame = requestAnimationFrame(frame);
    };
    state.settleFrame = requestAnimationFrame(frame);
  }

  function beginCommandTransaction(state, source) {
    if (spatiallyBusy(state)) return false;
    state.transactionId = `laws-carousel-${++transactionSequence}`;
    state.gestureState = "settling";
    state.settled = false;
    trace(state, "transaction-begin", { source });
    return true;
  }

  function commandDetent(field, state, detent, reason = "select", focus = false, animate = true) {
    if (!state.cards.length || spatiallyBusy(state)) return false;
    const target = Number(detent);
    if (!Number.isFinite(target)) return false;
    if (!beginCommandTransaction(state, reason)) return false;
    if (!animate || reducedMotion()) closeTransaction(field, state, target, reason, focus);
    else settleSameCoordinate(field, state, target, reason, focus);
    return true;
  }

  function select(field, state, index, reason = "select", focus = false, animate = true) {
    if (!state.cards.length || spatiallyBusy(state)) return false;
    const target = wrap(index, state.cards.length);
    let delta = target - state.index;
    if (delta > state.cards.length / 2) delta -= state.cards.length;
    if (delta < -state.cards.length / 2) delta += state.cards.length;
    return commandDetent(field, state, state.detentPosition + delta, reason, focus, animate);
  }

  function chooseDetent(state) {
    const p = state.orbitPosition;
    const lower = Math.floor(p);
    const fraction = p - lower;
    if (Math.abs(fraction - .5) > CANONICAL_EPSILON) return Math.round(p);
    if (state.lastVelocityX < 0) return lower + 1;
    if (state.lastVelocityX > 0) return lower;
    return state.accumulatedDeltaX < 0 ? lower + 1 : lower;
  }

  function resetPointer(state, pointerId) {
    try { if (pointerId != null) state.viewport.releasePointerCapture?.(pointerId); } catch (_) {}
    state.pointerId = null;
    state.classification = "none";
    state.lastMoveX = 0;
    state.lastMoveTime = 0;
    state.lastVelocityX = 0;
    state.accumulatedDeltaX = 0;
  }

  function finishPointer(field, state, event, cancelled = false) {
    if (event.pointerId !== state.pointerId) return;
    const wasDragging = state.gestureState === "dragging";
    const originalDetent = state.dragOriginPosition;
    const pointerId = state.pointerId;

    if (!wasDragging) {
      resetPointer(state, pointerId);
      state.gestureState = "idle";
      state.settled = true;
      state.transactionId = null;
      setSpatialTransitionsDisabled(state, false);
      renderGeometry(field, state, state.detentPosition);
      return;
    }

    const releasePosition = state.orbitPosition;
    const target = cancelled ? originalDetent : chooseDetent(state);
    state.targetDetent = target;
    trace(state, "release-target", { cancelled, releasePosition, target });
    resetPointer(state, pointerId);
    settleSameCoordinate(field, state, target, cancelled ? "pointer-cancel" : "pointer-detent");
  }

  function removeSurrogateControls(field) {
    field.querySelectorAll(".laws-rolodex-control").forEach(control => control.remove());
    field.dataset.surrogateNavigation = "removed";
  }

  function normalizeOrbitTerminology() {
    document.querySelectorAll(".laws-exhibit-return").forEach(button => {
      button.textContent = "Return to Orbit";
      button.setAttribute("aria-label", "Return to Orbit");
    });
  }

  function getFieldState(rolodexId) {
    const field = fieldByRolodexId.get(String(rolodexId || ""));
    const state = field && stateByField.get(field);
    return field && state ? { field, state } : null;
  }

  function snapshot(rolodexId) {
    const entry = getFieldState(rolodexId);
    if (!entry) return null;
    const { field, state } = entry;
    return Object.freeze({
      contract: CONTRACT,
      rolodexId: field.dataset.rolodexId || "",
      index: state.index,
      orbitPosition: state.orbitPosition,
      detentPosition: state.detentPosition,
      targetDetent: state.targetDetent,
      destinationId: state.cards[state.index]?.dataset.destinationId || "",
      transactionId: state.transactionId,
      gestureState: state.gestureState,
      settled: state.settled,
      lastLandingTime: state.lastLandingTime,
      guardUntil: state.guardUntil
    });
  }

  function getTransactionTrace(rolodexId) {
    const entry = getFieldState(rolodexId);
    return entry ? entry.state.trace.slice() : [];
  }

  function restoreOrbitState(receipt = {}) {
    const entry = getFieldState(receipt.rolodexId);
    if (!entry) return false;
    const { field, state } = entry;
    if (spatiallyBusy(state)) return false;
    let index = Number.isInteger(receipt.index) ? receipt.index : state.index;
    if (receipt.destinationId) {
      const byId = state.cards.findIndex(card => card.dataset.destinationId === receipt.destinationId);
      if (byId >= 0) index = byId;
    }
    const target = wrap(index, state.cards.length);
    let delta = target - state.index;
    if (delta > state.cards.length / 2) delta -= state.cards.length;
    if (delta < -state.cards.length / 2) delta += state.cards.length;
    const detent = state.detentPosition + delta;
    state.transactionId = `laws-carousel-${++transactionSequence}`;
    state.gestureState = "settling";
    state.settled = false;
    trace(state, "transaction-begin", { source: "orbit-restore" });
    closeTransaction(field, state, detent, "orbit-restore", false);
    return true;
  }

  function bindField(field) {
    if (stateByField.has(field)) return;
    const viewport = field.querySelector(".laws-rolodex-viewport");
    const cards = Array.from(field.querySelectorAll(".laws-rolodex-card"));
    const position = field.querySelector(".laws-rolodex-position");
    if (!viewport || !position || cards.length < 2) return;

    removeSurrogateControls(field);
    viewport.style.touchAction = "pan-y";
    const initialIndex = Math.max(0, cards.findIndex(card => card.dataset.active === "true"));
    const state = {
      viewport,
      cards,
      position,
      index: initialIndex,
      orbitPosition: initialIndex,
      detentPosition: initialIndex,
      targetDetent: initialIndex,
      dragOriginPosition: initialIndex,
      pointerId: null,
      transactionId: null,
      startX: 0,
      startY: 0,
      stepPixels: 1,
      classification: "none",
      settled: true,
      gestureState: "idle",
      settleFrame: 0,
      lastMoveX: 0,
      lastMoveTime: 0,
      lastVelocityX: 0,
      accumulatedDeltaX: 0,
      lastLandingTime: 0,
      guardUntil: 0,
      trace: []
    };
    stateByField.set(field, state);
    fieldByRolodexId.set(field.dataset.rolodexId || "", field);
    field.dataset.lawsDestinationCarousel = "active";
    field.dataset.carouselGestureLaw = "one-gesture-one-trajectory-one-canonical-landing";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim() || "Laws"} destinations. Drag horizontally to directly move the orbit; release to settle on one record. Vertical gestures scroll the page.`);

    field.addEventListener("click", event => {
      const card = event.target.closest(".laws-rolodex-card");
      if (!card || event.target.closest("button, a") || spatiallyBusy(state)) return;
      const index = state.cards.indexOf(card);
      if (index >= 0 && index !== state.index) select(field, state, index, "neighbor-select");
    }, true);

    viewport.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || spatiallyBusy(state)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === "Home") select(field, state, 0, "keyboard-home", true);
      else if (event.key === "End") select(field, state, state.cards.length - 1, "keyboard-end", true);
      else select(field, state, state.index + (event.key === "ArrowRight" ? 1 : -1), "keyboard-step", true);
    }, true);

    viewport.addEventListener("pointerdown", event => {
      if (spatiallyBusy(state) || event.target.closest("button, a") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.transactionId = `laws-carousel-${++transactionSequence}`;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.dragOriginPosition = state.detentPosition;
      state.targetDetent = state.detentPosition;
      state.stepPixels = Math.max(1, viewport.getBoundingClientRect().width * STEP_VIEWPORT_RATIO);
      state.classification = "pending";
      state.settled = false;
      state.gestureState = "pending";
      state.lastMoveX = event.clientX;
      state.lastMoveTime = event.timeStamp;
      state.lastVelocityX = 0;
      state.accumulatedDeltaX = 0;
      setSpatialTransitionsDisabled(state, true);
      renderGeometry(field, state, state.orbitPosition);
      trace(state, "transaction-begin", { source: "pointer", startX: state.startX, startY: state.startY, origin: state.dragOriginPosition });
      try { viewport.setPointerCapture?.(event.pointerId); } catch (_) {}
    });

    viewport.addEventListener("pointermove", event => {
      if (event.pointerId !== state.pointerId) return;
      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (state.classification === "pending") {
        if (Math.max(absX, absY) < CLASSIFY_PX) return;
        if (absX > absY * AXIS_RATIO) {
          state.classification = "horizontal";
          state.gestureState = "dragging";
          trace(state, "horizontal-custody", { deltaX, deltaY });
        } else if (absY > absX * AXIS_RATIO) {
          state.classification = "vertical";
          state.gestureState = "vertical-passthrough";
          trace(state, "vertical-passthrough", { deltaX, deltaY });
          return;
        } else return;
      }
      if (state.classification !== "horizontal") return;
      const dt = Math.max(1, event.timeStamp - state.lastMoveTime);
      state.lastVelocityX = (event.clientX - state.lastMoveX) / dt;
      state.lastMoveX = event.clientX;
      state.lastMoveTime = event.timeStamp;
      state.accumulatedDeltaX = deltaX;
      const nextPosition = state.dragOriginPosition - deltaX / state.stepPixels;
      renderGeometry(field, state, nextPosition);
      trace(state, "pointer-geometry", { deltaX, deltaY, nextPosition });
    });

    viewport.addEventListener("pointerup", event => finishPointer(field, state, event, false));
    viewport.addEventListener("pointercancel", event => finishPointer(field, state, event, true));

    cards.forEach((card, index) => card.addEventListener("focusin", () => {
      if (!spatiallyBusy(state) && index !== state.index) select(field, state, index, "focus-custody");
    }));

    renderGeometry(field, state, initialIndex);
    field.dataset.carouselCanonicalLanding = "true";
    publish(field, state, "mount");
  }

  function install() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return false;
    const fields = Array.from(root.querySelectorAll(FIELD_SELECTOR));
    if (!fields.length) return false;
    fields.forEach(bindField);
    normalizeOrbitTerminology();
    installed = fields.some(field => stateByField.has(field));
    if (!installed) return false;
    document.documentElement.dataset.lawsDestinationCarouselRuntime = "active";
    document.documentElement.dataset.lawsCarouselGestureLaw = "one-gesture-one-trajectory-one-canonical-landing";
    globalThis.DGB_LAWS_DESTINATION_CAROUSEL = Object.freeze({
      contract: CONTRACT,
      installed: true,
      reducedMotion: reducedMotion(),
      surrogateNavigation: false,
      continuousPointerGeometry: true,
      fractionalOrbitPosition: true,
      singleAuthoritativeOrbitCoordinate: true,
      singleTrajectorySettlement: true,
      selectionDuringDrag: false,
      semanticIndexCommandsGeometry: false,
      settleToNearestDetent: true,
      geometryOwnedSettlementCompletion: true,
      timerOwnedSettlementCompletion: false,
      verticalGesturePassthrough: true,
      directionOnlyGesture: false,
      liveGestureGeometry: true,
      atomicRotation: false,
      postLandingGuardMs: POST_LANDING_GUARD_MS,
      returnLanguage: "Return to Orbit",
      getState: snapshot,
      getTransactionTrace,
      restoreOrbitState,
      navigationAuthority: false,
      contentAuthority: false,
      routeAuthority: false,
      evidenceAuthority: false
    });
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_READY", { detail: Object.freeze({
      contract: CONTRACT,
      fieldCount: fields.length,
      continuousPointerGeometry: true,
      fractionalOrbitPosition: true,
      singleAuthoritativeOrbitCoordinate: true,
      singleTrajectorySettlement: true,
      selectionDuringDrag: false,
      semanticIndexCommandsGeometry: false,
      settleToNearestDetent: true,
      geometryOwnedSettlementCompletion: true,
      timerOwnedSettlementCompletion: false,
      verticalGesturePassthrough: true,
      directionOnlyGesture: false,
      liveGestureGeometry: true,
      atomicRotation: false,
      postLandingGuardMs: POST_LANDING_GUARD_MS,
      returnLanguage: "Return to Orbit"
    }) }));
    return true;
  }

  function initialize() {
    install();
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", () => requestAnimationFrame(install));
    globalThis.addEventListener("LAWS_ROLODEX_PLACEMENT_READY", () => requestAnimationFrame(install));
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_OPENED", () => requestAnimationFrame(normalizeOrbitTerminology));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();