/*
 * LAWS_DESTINATION_CAROUSEL_RUNTIME_v6
 * Continuous Euclidean pointer geometry for the existing Laws destination records.
 * Presentation/interaction only. It does not create or alter destination content,
 * routes, evidence, Compass state, controller authority, or claim authority.
 */
(() => {
  "use strict";

  const CONTRACT = "LAWS_DESTINATION_CAROUSEL_RUNTIME_v6";
  const ROOT_SELECTOR = "[data-laws-root-rolodex-section]";
  const FIELD_SELECTOR = ".laws-rolodex-field[data-rolodex-id]";
  const CLASSIFY_PX = 8;
  const AXIS_RATIO = 1.12;
  const STEP_VIEWPORT_RATIO = .72;
  const SETTLE_MS = 560;
  const stateByField = new WeakMap();
  const fieldByRolodexId = new Map();
  let installed = false;

  const wrap = (value, count) => count ? ((value % count) + count) % count : 0;
  const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  function nearestCircularRelativePosition(index, position, count) {
    const base = index - position;
    let best = base;
    for (const offset of [-count, count]) {
      const candidate = base + offset;
      if (Math.abs(candidate) < Math.abs(best)) best = candidate;
    }
    return best;
  }

  function geometryFor(relative, count) {
    const d = relative;
    const abs = Math.abs(d);
    const sign = Math.sign(d);
    const x = d * 86;
    const z = abs < .08 ? 78 : -Math.min(260, 96 + abs * 86);
    const rotate = -sign * Math.min(15, abs * 9);
    const scale = Math.max(.62, 1 - abs * .18);
    const opacity = abs < .08 ? 1 : abs <= 1.08 ? .24 : Math.max(.045, .1 - Math.max(0, abs - 2) * .04);
    const blur = abs < .08 ? 0 : Math.min(2.4, .55 + Math.max(0, abs - 1) * .9);
    const order = Math.max(1, count + 2 - Math.round(abs * 2));
    return { x, z, rotate, scale, opacity, blur, order };
  }

  function publish(field, state, reason) {
    const active = state.cards[state.index];
    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_CHANGED", {
      detail: Object.freeze({
        contract: CONTRACT,
        reason,
        rolodexId: field.dataset.rolodexId || "",
        index: state.index,
        count: state.cards.length,
        destinationId: active?.dataset.destinationId || "",
        dragging: state.gestureState === "dragging",
        settled: state.settled,
        continuousPointerGeometry: true,
        fractionalOrbitPosition: true,
        selectionDuringDrag: false,
        settleToNearestDetent: true,
        verticalGesturePassthrough: true,
        directionOnlyGesture: false,
        liveGestureGeometry: true,
        atomicRotation: false,
        navigationAuthority: false,
        contentAuthority: false,
        routeAuthority: false,
        evidenceAuthority: false
      })
    }));
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
    field.dataset.carouselDragging = String(state.gestureState === "dragging");
    field.dataset.carouselSettled = String(state.settled);
    field.dataset.carouselGestureState = state.gestureState;
  }

  function render(field, state, reason = "render", publishChange = true) {
    renderGeometry(field, state);
    if (publishChange) publish(field, state, reason);
  }

  function setDragTransitions(state, dragging) {
    state.viewport.dataset.dragging = String(dragging);
    state.cards.forEach(card => {
      if (dragging) {
        if (!card.dataset.carouselTransitionBeforeDrag) card.dataset.carouselTransitionBeforeDrag = card.style.transition || "";
        card.style.transition = "none";
      } else {
        card.style.transition = card.dataset.carouselTransitionBeforeDrag || "";
        delete card.dataset.carouselTransitionBeforeDrag;
      }
    });
  }

  function markSettled(field, state, reason) {
    clearTimeout(state.settleTimer);
    const settle = () => {
      state.settled = true;
      state.gestureState = "idle";
      state.orbitPosition = state.detentPosition;
      field.dataset.carouselSettled = "true";
      field.dataset.carouselGestureState = "idle";
      renderGeometry(field, state, state.detentPosition);
      publish(field, state, `${reason}-settled`);
    };
    if (reducedMotion()) settle();
    else state.settleTimer = setTimeout(settle, SETTLE_MS);
  }

  function settleTo(field, state, detent, reason = "settle", focus = false, animate = true) {
    const count = state.cards.length;
    const nextIndex = wrap(detent, count);
    const changed = nextIndex !== state.index || detent !== state.detentPosition;
    state.index = nextIndex;
    state.detentPosition = detent;
    state.settled = !animate || !changed || reducedMotion();
    state.gestureState = changed && animate ? "settling" : "idle";
    setDragTransitions(state, false);
    renderGeometry(field, state, detent);
    publish(field, state, reason);
    if (changed && animate && !reducedMotion()) markSettled(field, state, reason);
    else {
      state.orbitPosition = detent;
      state.settled = true;
      state.gestureState = "idle";
      renderGeometry(field, state, detent);
    }
    if (focus) state.cards[state.index].querySelector(".laws-rolodex-enter")?.focus({ preventScroll: true });
  }

  function select(field, state, index, reason = "select", focus = false, animate = true) {
    if (!state.cards.length) return;
    const wrappedTarget = wrap(index, state.cards.length);
    let delta = wrappedTarget - state.index;
    if (delta > state.cards.length / 2) delta -= state.cards.length;
    if (delta < -state.cards.length / 2) delta += state.cards.length;
    settleTo(field, state, state.detentPosition + delta, reason, focus, animate);
  }

  function chooseDetent(state) {
    const p = state.orbitPosition;
    const lower = Math.floor(p);
    const fraction = p - lower;
    if (Math.abs(fraction - .5) > 1e-7) return Math.round(p);
    if (state.lastVelocityX < 0) return lower + 1;
    if (state.lastVelocityX > 0) return lower;
    return state.accumulatedDeltaX < 0 ? lower + 1 : lower;
  }

  function resetPointer(state, pointerId) {
    try { state.viewport.releasePointerCapture?.(pointerId); } catch (_) {}
    state.pointerId = null;
    state.classification = "none";
    state.lastVelocityX = 0;
    state.lastMoveX = 0;
    state.lastMoveTime = 0;
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
      field.dataset.carouselGestureState = "idle";
      setDragTransitions(state, false);
      return;
    }

    const target = cancelled ? originalDetent : chooseDetent(state);
    resetPointer(state, pointerId);
    settleTo(field, state, target, cancelled ? "pointer-cancel" : "pointer-detent");
  }

  function removeSurrogateControls(field) {
    Array.from(field.querySelectorAll(".laws-rolodex-control")).forEach(control => control.remove());
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
      destinationId: state.cards[state.index]?.dataset.destinationId || "",
      settled: state.settled
    });
  }

  function restoreOrbitState(receipt = {}) {
    const entry = getFieldState(receipt.rolodexId);
    if (!entry) return false;
    const { field, state } = entry;
    let index = Number.isInteger(receipt.index) ? receipt.index : state.index;
    if (receipt.destinationId) {
      const byId = state.cards.findIndex(card => card.dataset.destinationId === receipt.destinationId);
      if (byId >= 0) index = byId;
    }
    resetPointer(state, state.pointerId);
    state.gestureState = "idle";
    select(field, state, index, "orbit-restore", false, false);
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
      dragOriginPosition: initialIndex,
      pointerId: null,
      startX: 0,
      startY: 0,
      stepPixels: 1,
      classification: "none",
      settled: true,
      gestureState: "idle",
      settleTimer: null,
      lastMoveX: 0,
      lastMoveTime: 0,
      lastVelocityX: 0,
      accumulatedDeltaX: 0
    };
    stateByField.set(field, state);
    fieldByRolodexId.set(field.dataset.rolodexId || "", field);
    field.dataset.lawsDestinationCarousel = "active";
    field.dataset.carouselGestureLaw = "continuous-pointer-fractional-orbit-then-detent";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim() || "Laws"} destinations. Drag horizontally to move the orbit continuously; release to settle to the nearest record. Vertical gestures scroll the page.`);

    field.addEventListener("click", event => {
      const card = event.target.closest(".laws-rolodex-card");
      if (!card || event.target.closest("button, a")) return;
      const index = state.cards.indexOf(card);
      if (index >= 0 && index !== state.index) select(field, state, index, "neighbor-select");
    }, true);

    viewport.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === "Home") select(field, state, 0, "keyboard-home", true);
      else if (event.key === "End") select(field, state, state.cards.length - 1, "keyboard-end", true);
      else select(field, state, state.index + (event.key === "ArrowRight" ? 1 : -1), "keyboard-step", true);
    }, true);

    viewport.addEventListener("pointerdown", event => {
      if (event.target.closest("button, a") || (event.pointerType === "mouse" && event.button !== 0)) return;
      clearTimeout(state.settleTimer);
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.dragOriginPosition = state.detentPosition;
      state.stepPixels = Math.max(1, viewport.getBoundingClientRect().width * STEP_VIEWPORT_RATIO);
      state.classification = "pending";
      state.settled = true;
      state.gestureState = "pending";
      state.lastMoveX = event.clientX;
      state.lastMoveTime = event.timeStamp;
      state.lastVelocityX = 0;
      state.accumulatedDeltaX = 0;
      field.dataset.carouselGestureState = "pending";
      viewport.setPointerCapture?.(event.pointerId);
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
          state.settled = false;
          setDragTransitions(state, true);
        } else if (absY > absX * AXIS_RATIO) {
          state.classification = "vertical";
          state.gestureState = "vertical-passthrough";
          try { viewport.releasePointerCapture?.(event.pointerId); } catch (_) {}
          return;
        } else return;
      }

      if (state.classification !== "horizontal") return;
      const dt = Math.max(1, event.timeStamp - state.lastMoveTime);
      state.lastVelocityX = (event.clientX - state.lastMoveX) / dt;
      state.lastMoveX = event.clientX;
      state.lastMoveTime = event.timeStamp;
      state.accumulatedDeltaX = deltaX;
      const p = state.dragOriginPosition - deltaX / state.stepPixels;
      renderGeometry(field, state, p);
    });

    viewport.addEventListener("pointerup", event => finishPointer(field, state, event, false));
    viewport.addEventListener("pointercancel", event => finishPointer(field, state, event, true));

    cards.forEach((card, index) => {
      card.addEventListener("focusin", () => {
        if (state.gestureState !== "dragging" && index !== state.index) select(field, state, index, "focus-custody");
      });
    });

    render(field, state, "mount");
  }

  function install() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return false;
    const fields = Array.from(root.querySelectorAll(FIELD_SELECTOR));
    if (!fields.length) return false;
    fields.forEach(bindField);
    normalizeOrbitTerminology();
    installed = fields.some(field => stateByField.has(field));
    if (installed) {
      document.documentElement.dataset.lawsDestinationCarouselRuntime = "active";
      document.documentElement.dataset.lawsCarouselGestureLaw = "continuous-pointer-fractional-orbit-then-detent";
      globalThis.DGB_LAWS_DESTINATION_CAROUSEL = Object.freeze({
        contract: CONTRACT,
        installed: true,
        reducedMotion: reducedMotion(),
        surrogateNavigation: false,
        continuousPointerGeometry: true,
        fractionalOrbitPosition: true,
        selectionDuringDrag: false,
        settleToNearestDetent: true,
        verticalGesturePassthrough: true,
        directionOnlyGesture: false,
        liveGestureGeometry: true,
        atomicRotation: false,
        returnLanguage: "Return to Orbit",
        getState: snapshot,
        restoreOrbitState,
        navigationAuthority: false,
        contentAuthority: false,
        routeAuthority: false,
        evidenceAuthority: false
      });
      globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_READY", {
        detail: Object.freeze({
          contract: CONTRACT,
          fieldCount: fields.length,
          continuousPointerGeometry: true,
          fractionalOrbitPosition: true,
          selectionDuringDrag: false,
          settleToNearestDetent: true,
          verticalGesturePassthrough: true,
          directionOnlyGesture: false,
          liveGestureGeometry: true,
          atomicRotation: false,
          returnLanguage: "Return to Orbit"
        })
      }));
    }
    return installed;
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
