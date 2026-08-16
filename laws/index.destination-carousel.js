/*
 * LAWS_DESTINATION_CAROUSEL_RUNTIME_v11_DIRECTION_ONLY_ATOMIC
 * Shared Methods ring geometry with Laws direction-only gesture custody.
 * v13 traversal repair: runtime-owned 500ms Euclidean ring motion before semantic landing.
 * transitionend is deliberately not settlement authority.
 */
(() => {
  "use strict";
  const CONTRACT = "LAWS_DESTINATION_CAROUSEL_RUNTIME_v11_DIRECTION_ONLY_ATOMIC";
  const REFERENCE = "METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1";
  const BUILD = "20260816E_DIRECTION_ONLY_CANONICAL";
  const PRODUCT_REFINEMENT = "20260816G_RUNTIME_OWNED_RING_TRAVERSAL";
  const ROOT_SELECTOR = "[data-laws-root-rolodex-section]";
  const FIELD_SELECTOR = ".laws-rolodex-field[data-rolodex-id]";
  const CLASSIFY_PX = 8;
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  const CANONICAL_EPSILON = .001;
  const POST_LANDING_GUARD_MS = 1000;
  const TRAVERSAL_MS = 500;
  const SETTLE_FALLBACK_MS = TRAVERSAL_MS + 48;
  const LANDING_PULSE_MS = 420;
  const stateByField = new WeakMap();
  const fieldById = new Map();
  let transactionSequence = 0;

  const normalize = (value, count) => ((value % count) + count) % count;
  const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const now = () => performance.now();

  function radius(viewport) {
    const width = Math.max(320, viewport.clientWidth || 960);
    if (width < 520) return Math.max(245, Math.min(330, width * .72));
    if (width < 820) return Math.max(320, Math.min(440, width * .58));
    return Math.max(430, Math.min(650, width * .49));
  }

  function angleForDetent(detent, count) { return -detent * (360 / count); }
  function isBusy(state) { return state.gestureState === "pending" || state.gestureState === "direction-locked" || state.gestureState === "settling"; }

  function trace(state, type, detail = {}) {
    const sample = Object.freeze({ type, t: now(), transactionId: state.transactionId, phase: state.gestureState, index: state.index, detent: state.detent, targetDetent: state.targetDetent, angle: state.angle, direction: state.direction, pressure: state.pressure, ...detail });
    state.trace.push(sample);
    if (state.trace.length > 500) state.trace.splice(0, state.trace.length - 500);
    return sample;
  }

  function clearTarget(state) { state.cards.forEach(card => { delete card.dataset.carouselTarget; }); }

  function setFeedback(field, state, mode = "idle", pressure = 0) {
    const bounded = Math.max(0, Math.min(1, Number.isFinite(pressure) ? pressure : 0));
    state.pressure = bounded;
    field.dataset.carouselFeedback = mode;
    field.dataset.carouselGestureReady = String(mode === "next" || mode === "previous");
    field.style.setProperty("--laws-gesture-pressure", bounded.toFixed(3));
  }

  function publish(field, state, reason) {
    const card = state.cards[state.index];
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_CHANGED", { detail: Object.freeze({ contract: CONTRACT, referenceContract: REFERENCE, buildId: BUILD, productRefinement: PRODUCT_REFINEMENT, reason, rolodexId: field.dataset.rolodexId || "", index: state.index, count: state.cards.length, destinationId: card?.dataset.destinationId || "", orbitAngle: state.angle, detent: state.detent, targetDetent: state.targetDetent, transactionId: state.transactionId, transactionPhase: state.gestureState, direction: state.direction, gesturePressure: state.pressure, boundedGestureFeedback: true, directionOnlyGesture: true, liveGestureGeometry: false, atomicRotation: true, oneGestureOneStep: true, canonicalFrameLockedDuringGesture: true, runtimeOwnedTraversal: true, traversalMs: TRAVERSAL_MS, velocityProjection: false, momentumTraversal: false, postLandingGuardMs: POST_LANDING_GUARD_MS, navigationAuthority: false, contentAuthority: false, routeAuthority: false, evidenceAuthority: false }) }));
  }

  function applyCanonicalSemantics(field, state, reason = "geometry") {
    const count = state.cards.length;
    const r = radius(state.viewport);
    state.track.style.setProperty("--laws-ring-rotation", `${state.angle}deg`);
    state.track.style.setProperty("--laws-ring-radius", `${r}px`);
    state.cards.forEach((card, index) => {
      card.style.setProperty("--laws-card-angle", `${index * (360 / count)}deg`);
      const active = index === state.index;
      card.dataset.active = String(active);
      card.setAttribute("aria-current", active ? "true" : "false");
      card.setAttribute("aria-hidden", active ? "false" : "true");
      const enter = card.querySelector(".laws-rolodex-enter");
      if (enter) enter.tabIndex = active ? 0 : -1;
    });
    state.position.textContent = `${state.index + 1} / ${count}`;
    field.dataset.carouselIndex = String(state.index);
    field.dataset.carouselOrbitAngle = String(state.angle);
    field.dataset.carouselDetent = String(state.detent);
    field.dataset.carouselTargetDetent = String(state.targetDetent);
    field.dataset.carouselGestureState = state.gestureState;
    field.dataset.carouselDirection = String(state.direction || 0);
    field.dataset.carouselCanonicalLanding = String(state.gestureState === "idle" && Math.abs(state.angle - angleForDetent(state.detent, count)) < CANONICAL_EPSILON);
    publish(field, state, reason);
  }

  function setRingAngle(field, state, angle) {
    state.angle = angle;
    state.track.style.setProperty("--laws-ring-rotation", `${angle}deg`);
    field.dataset.carouselOrbitAngle = String(angle);
  }

  function setTraversalTransition(state, enabled) {
    if (enabled && !reducedMotion()) state.track.style.setProperty("transition", `transform ${TRAVERSAL_MS}ms cubic-bezier(.16,.84,.18,1)`, "important");
    else state.track.style.setProperty("transition", "none", "important");
  }

  function pulseLanding(field) {
    field.dataset.carouselLandingPulse = "true";
    clearTimeout(field.__lawsLandingPulseTimer);
    field.__lawsLandingPulseTimer = setTimeout(() => { field.dataset.carouselLandingPulse = "false"; }, LANDING_PULSE_MS);
  }

  function finishLanding(field, state, targetDetent, reason, focus = false) {
    if (state.landingCommitted) return;
    state.landingCommitted = true;
    clearTimeout(state.settleTimer);
    state.detent = targetDetent;
    state.targetDetent = targetDetent;
    state.index = normalize(targetDetent, state.cards.length);
    state.angle = angleForDetent(targetDetent, state.cards.length);
    state.gestureState = "idle";
    state.direction = 0;
    state.viewport.dataset.dragging = "false";
    clearTarget(state);
    setFeedback(field, state, "idle", 0);
    setTraversalTransition(state, false);
    applyCanonicalSemantics(field, state, `${reason}-settled`);
    pulseLanding(field);
    state.lastLandingTime = now();
    state.guardUntil = state.lastLandingTime + POST_LANDING_GUARD_MS;
    field.dataset.carouselPostLandingGuardUntil = String(state.guardUntil);
    trace(state, "canonical-landing", { reason, canonical: field.dataset.carouselCanonicalLanding === "true", guardUntil: state.guardUntil });
    const transactionId = state.transactionId;
    state.transactionId = null;
    field.dataset.carouselTransactionId = "";
    if (focus) state.cards[state.index]?.querySelector(".laws-rolodex-enter")?.focus({ preventScroll: true });
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_LANDED", { detail: Object.freeze({ contract: CONTRACT, buildId: BUILD, productRefinement: PRODUCT_REFINEMENT, transactionId, index: state.index, detent: state.detent, traversalMs: TRAVERSAL_MS, postLandingGuardMs: POST_LANDING_GUARD_MS }) }));
  }

  function rotateToDetent(field, state, targetDetent, reason, focus = false) {
    if (state.gestureState === "settling") return false;
    const startAngle = angleForDetent(state.detent, state.cards.length);
    const targetAngle = angleForDetent(targetDetent, state.cards.length);
    state.targetDetent = targetDetent;
    state.gestureState = "settling";
    state.landingCommitted = false;
    field.dataset.carouselGestureState = "settling";
    field.dataset.carouselTargetDetent = String(targetDetent);
    field.dataset.carouselDirection = String(Math.sign(targetDetent - state.detent));
    field.dataset.carouselCanonicalLanding = "false";
    setFeedback(field, state, "release", 0);
    clearTarget(state);
    state.cards[normalize(targetDetent, state.cards.length)].dataset.carouselTarget = "true";
    setTraversalTransition(state, false);
    setRingAngle(field, state, startAngle);
    void state.track.offsetWidth;
    setTraversalTransition(state, true);
    void state.track.offsetWidth;
    trace(state, "atomic-rotation-begin", { reason, fromDetent: state.detent, targetDetent, traversalMs: TRAVERSAL_MS });
    publish(field, state, reason);
    if (reducedMotion()) {
      setRingAngle(field, state, targetAngle);
      finishLanding(field, state, targetDetent, reason, focus);
      return true;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setRingAngle(field, state, targetAngle);
      trace(state, "ring-traversal-painted", { fromAngle: startAngle, targetAngle, traversalMs: TRAVERSAL_MS });
      state.settleTimer = setTimeout(() => finishLanding(field, state, targetDetent, reason, focus), SETTLE_FALLBACK_MS);
    }));
    return true;
  }

  function rotateOne(field, state, direction, reason, focus = false) {
    if (!direction || state.gestureState === "settling") return false;
    if (!state.transactionId) state.transactionId = `laws-carousel-${++transactionSequence}`;
    field.dataset.carouselTransactionId = state.transactionId;
    return rotateToDetent(field, state, state.detent + (direction > 0 ? 1 : -1), reason, focus);
  }

  function selectIndex(field, state, index, reason = "select", focus = false) {
    if (isBusy(state)) return false;
    const target = normalize(index, state.cards.length);
    if (target === state.index) return true;
    let delta = target - state.index;
    if (delta > state.cards.length / 2) delta -= state.cards.length;
    if (delta < -state.cards.length / 2) delta += state.cards.length;
    state.transactionId = `laws-carousel-${++transactionSequence}`;
    field.dataset.carouselTransactionId = state.transactionId;
    if (Math.abs(delta) === 1) return rotateOne(field, state, Math.sign(delta), reason, focus);
    return rotateToDetent(field, state, state.detent + delta, reason, focus);
  }

  function resetPointer(state, pointerId) {
    try { if (pointerId != null) state.viewport.releasePointerCapture?.(pointerId); } catch (_) {}
    state.pointerId = null;
    state.classification = "none";
    state.startX = 0;
    state.startY = 0;
    state.travel = 0;
  }

  function finishPointer(field, state, event, cancelled = false) {
    if (event.pointerId !== state.pointerId) return;
    const pointerId = state.pointerId;
    const direction = state.classification === "horizontal" && state.travel >= COMMIT_PX ? state.direction : 0;
    trace(state, cancelled ? "pointer-cancel" : "pointer-release", { direction, classification: state.classification, travel: state.travel });
    resetPointer(state, pointerId);
    state.viewport.dataset.dragging = "false";
    if (cancelled || !direction) {
      state.gestureState = "idle";
      state.direction = 0;
      state.targetDetent = state.detent;
      setFeedback(field, state, "idle", 0);
      setTraversalTransition(state, false);
      setRingAngle(field, state, angleForDetent(state.detent, state.cards.length));
      applyCanonicalSemantics(field, state, cancelled ? "pointer-cancel-noop" : "pointer-unclassified-noop");
      state.transactionId = null;
      field.dataset.carouselTransactionId = "";
      return;
    }
    state.suppressClick = true;
    rotateOne(field, state, direction, "pointer-atomic-step");
  }

  function restoreOrbitState(receipt = {}) {
    const field = fieldById.get(String(receipt.rolodexId || ""));
    const state = field && stateByField.get(field);
    if (!field || !state || isBusy(state)) return false;
    let index = Number.isInteger(receipt.index) ? receipt.index : state.index;
    if (receipt.destinationId) { const found = state.cards.findIndex(card => card.dataset.destinationId === receipt.destinationId); if (found >= 0) index = found; }
    const target = normalize(index, state.cards.length);
    let delta = target - state.index;
    if (delta > state.cards.length / 2) delta -= state.cards.length;
    if (delta < -state.cards.length / 2) delta += state.cards.length;
    state.detent += delta;
    state.targetDetent = state.detent;
    state.index = target;
    state.angle = angleForDetent(state.detent, state.cards.length);
    state.gestureState = "idle";
    state.direction = 0;
    clearTarget(state);
    setFeedback(field, state, "idle", 0);
    setTraversalTransition(state, false);
    state.viewport.dataset.dragging = "true";
    applyCanonicalSemantics(field, state, "orbit-restore");
    void state.track.offsetWidth;
    state.viewport.dataset.dragging = "false";
    trace(state, "canonical-restore", { canonical: field.dataset.carouselCanonicalLanding === "true" });
    return true;
  }

  function snapshot(id) {
    const field = fieldById.get(String(id || ""));
    const state = field && stateByField.get(field);
    if (!field || !state) return null;
    return Object.freeze({ contract: CONTRACT, referenceContract: REFERENCE, buildId: BUILD, productRefinement: PRODUCT_REFINEMENT, rolodexId: field.dataset.rolodexId || "", index: state.index, detent: state.detent, targetDetent: state.targetDetent, orbitAngle: state.angle, transactionId: state.transactionId, gestureState: state.gestureState, direction: state.direction, pressure: state.pressure, destinationId: state.cards[state.index]?.dataset.destinationId || "", guardUntil: state.guardUntil });
  }

  function getTransactionTrace(id) {
    const field = fieldById.get(String(id || ""));
    const state = field && stateByField.get(field);
    return state ? state.trace.slice() : [];
  }

  function bindField(field) {
    if (stateByField.has(field)) return;
    const viewport = field.querySelector(".laws-rolodex-viewport");
    const track = field.querySelector(".laws-rolodex-track");
    const cards = Array.from(field.querySelectorAll(".laws-rolodex-card"));
    const position = field.querySelector(".laws-rolodex-position");
    if (!viewport || !track || !position || cards.length < 2) return;
    field.querySelectorAll(".laws-rolodex-control").forEach(control => control.remove());
    const initialIndex = Math.max(0, cards.findIndex(card => card.dataset.active === "true"));
    const state = { viewport, track, cards, position, index: initialIndex, detent: initialIndex, targetDetent: initialIndex, angle: angleForDetent(initialIndex, cards.length), gestureState: "idle", classification: "none", direction: 0, pressure: 0, travel: 0, pointerId: null, startX: 0, startY: 0, transactionId: null, suppressClick: false, settleTimer: null, landingCommitted: false, lastLandingTime: 0, guardUntil: 0, trace: [] };
    stateByField.set(field, state);
    fieldById.set(field.dataset.rolodexId || "", field);
    field.dataset.lawsDestinationCarousel = "active";
    field.dataset.carouselSpatialKernel = "methods-canonical-shared-ring";
    field.dataset.carouselGestureLaw = "direction-only-release-one-atomic-step";
    field.dataset.carouselProductRefinement = PRODUCT_REFINEMENT;
    setFeedback(field, state, "idle", 0);
    setTraversalTransition(state, false);
    viewport.style.touchAction = "pan-y";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim() || "Laws"} destinations. Swipe horizontally to rotate exactly one neighboring record after release. Vertical gestures scroll the page.`);

    viewport.addEventListener("pointerdown", event => {
      if (isBusy(state) || (event.pointerType === "mouse" && event.button !== 0) || event.target.closest("button, a")) return;
      state.transactionId = `laws-carousel-${++transactionSequence}`;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.travel = 0;
      state.classification = "pending";
      state.direction = 0;
      state.gestureState = "pending";
      state.targetDetent = state.detent;
      state.suppressClick = false;
      field.dataset.carouselTransactionId = state.transactionId;
      field.dataset.carouselGestureState = "pending";
      state.viewport.dataset.dragging = "false";
      setFeedback(field, state, "pending", 0);
      setTraversalTransition(state, false);
      setRingAngle(field, state, angleForDetent(state.detent, cards.length));
      trace(state, "transaction-begin", { source: "pointer", startX: state.startX, startY: state.startY });
      try { viewport.setPointerCapture?.(event.pointerId); } catch (_) {}
    });

    viewport.addEventListener("pointermove", event => {
      if (event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      state.travel = Math.max(state.travel, ax);
      if (state.classification === "pending") {
        if (Math.max(ax, ay) < CLASSIFY_PX) return;
        if (ax > ay * AXIS_RATIO) {
          state.classification = "horizontal";
          state.gestureState = "direction-locked";
          field.dataset.carouselGestureState = "direction-locked";
          trace(state, "direction-locked", { dx, dy });
        } else if (ay > ax * AXIS_RATIO) {
          state.classification = "vertical";
          state.gestureState = "vertical-passthrough";
          field.dataset.carouselGestureState = "vertical-passthrough";
          setFeedback(field, state, "idle", 0);
          trace(state, "vertical-passthrough", { dx, dy });
          return;
        } else return;
      }
      if (state.classification !== "horizontal") return;
      event.preventDefault();
      state.direction = dx < 0 ? 1 : -1;
      const pressureSpan = Math.max(72, viewport.clientWidth * .22);
      const pressure = Math.min(1, Math.max(0, (ax - CLASSIFY_PX) / Math.max(1, pressureSpan - CLASSIFY_PX)));
      const committed = ax >= COMMIT_PX;
      setFeedback(field, state, committed ? (state.direction > 0 ? "next" : "previous") : "pending", pressure);
      field.dataset.carouselDirection = String(state.direction);
      field.dataset.carouselGestureReady = String(committed);
      trace(state, "gesture-sample", { dx, dy, direction: state.direction, committed });
      setRingAngle(field, state, angleForDetent(state.detent, cards.length));
    }, { passive: false });

    viewport.addEventListener("pointerup", event => finishPointer(field, state, event, false));
    viewport.addEventListener("pointercancel", event => finishPointer(field, state, event, true));
    viewport.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || isBusy(state)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === "Home") selectIndex(field, state, 0, "keyboard-home", true);
      else if (event.key === "End") selectIndex(field, state, cards.length - 1, "keyboard-end", true);
      else rotateOne(field, state, event.key === "ArrowRight" ? 1 : -1, "keyboard-step", true);
    }, true);

    track.addEventListener("click", event => {
      if (state.suppressClick) { state.suppressClick = false; event.preventDefault(); return; }
      if (isBusy(state) || event.target.closest("button, a")) return;
      const card = event.target.closest(".laws-rolodex-card");
      if (!card) return;
      const index = cards.indexOf(card);
      if (index >= 0 && index !== state.index) selectIndex(field, state, index, "card-select");
    });
    cards.forEach((card, index) => card.addEventListener("focusin", () => { if (!isBusy(state) && index !== state.index) selectIndex(field, state, index, "focus-select"); }));
    applyCanonicalSemantics(field, state, "mount");
  }

  function normalizeOrbitTerminology() {
    document.querySelectorAll(".laws-exhibit-return").forEach(button => {
      button.textContent = "Return to Orbit";
      button.setAttribute("aria-label", "Return to Orbit");
    });
  }

  function install() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return false;
    const fields = Array.from(root.querySelectorAll(FIELD_SELECTOR));
    fields.forEach(bindField);
    normalizeOrbitTerminology();
    if (!fields.some(field => stateByField.has(field))) return false;
    document.documentElement.dataset.lawsDestinationCarouselRuntime = "active";
    document.documentElement.dataset.lawsCarouselContract = CONTRACT;
    document.documentElement.dataset.lawsCarouselReference = REFERENCE;
    document.documentElement.dataset.lawsCarouselBuild = BUILD;
    document.documentElement.dataset.lawsCarouselGestureLaw = "direction-only-release-one-atomic-step";
    document.documentElement.dataset.lawsCarouselProductRefinement = PRODUCT_REFINEMENT;
    globalThis.DGB_LAWS_DESTINATION_CAROUSEL = Object.freeze({ contract: CONTRACT, referenceContract: REFERENCE, buildId: BUILD, productRefinement: PRODUCT_REFINEMENT, installed: true, sharedRingAuthority: true, directManipulation: false, directionOnlyGesture: true, liveGestureGeometry: false, boundedGestureFeedback: true, atomicRotation: true, oneGestureOneStep: true, canonicalFrameLockedDuringGesture: true, runtimeOwnedTraversal: true, traversalMs: TRAVERSAL_MS, velocityProjection: false, momentumTraversal: false, verticalGesturePassthrough: true, postLandingGuardMs: POST_LANDING_GUARD_MS, surrogateNavigation: false, restoreOrbitState, getState: snapshot, getTransactionTrace, navigationAuthority: false, contentAuthority: false, routeAuthority: false, evidenceAuthority: false });
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_READY", { detail: Object.freeze({ contract: CONTRACT, referenceContract: REFERENCE, buildId: BUILD, productRefinement: PRODUCT_REFINEMENT, fieldCount: fields.length, boundedGestureFeedback: true, directionOnlyGesture: true, liveGestureGeometry: false, atomicRotation: true, oneGestureOneStep: true, canonicalFrameLockedDuringGesture: true, runtimeOwnedTraversal: true, traversalMs: TRAVERSAL_MS, postLandingGuardMs: POST_LANDING_GUARD_MS }) }));
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