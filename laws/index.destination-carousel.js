/*
 * LAWS_DESTINATION_CAROUSEL_RUNTIME_v3
 * True single-state spatial carousel for the existing Laws destination records.
 * Presentation/interaction only. It does not create or alter destination content,
 * routes, evidence, Compass state, controller authority, or claim authority.
 */
(() => {
  "use strict";

  const CONTRACT = "LAWS_DESTINATION_CAROUSEL_RUNTIME_v3";
  const ROOT_SELECTOR = "[data-laws-root-rolodex-section]";
  const FIELD_SELECTOR = ".laws-rolodex-field[data-rolodex-id]";
  const stateByField = new WeakMap();
  let installed = false;

  const wrap = (value, count) => count ? ((value % count) + count) % count : 0;
  const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  function signedDistance(index, active, count) {
    let delta = wrap(index - active, count);
    if (delta > count / 2) delta -= count;
    return delta;
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
        dragging: state.dragging,
        navigationAuthority: false,
        contentAuthority: false,
        routeAuthority: false,
        evidenceAuthority: false
      })
    }));
  }

  function geometryFor(relative, dragProgress, count) {
    const d = relative - dragProgress;
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

  function render(field, state, reason = "render") {
    const count = state.cards.length;
    state.cards.forEach((card, index) => {
      const relative = signedDistance(index, state.index, count);
      const g = geometryFor(relative, state.dragProgress, count);
      const active = index === state.index && Math.abs(state.dragProgress) < .45;
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
    field.dataset.carouselDragging = String(state.dragging);
    publish(field, state, reason);
  }

  function select(field, state, index, reason = "select", focus = false) {
    if (!state.cards.length) return;
    state.index = wrap(index, state.cards.length);
    state.dragProgress = 0;
    render(field, state, reason);
    if (focus) {
      state.cards[state.index].querySelector(".laws-rolodex-enter")?.focus({ preventScroll: true });
    }
  }

  function finishDrag(field, state, event) {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const projected = state.dragProgress + Math.max(-.7, Math.min(.7, state.velocity * 130));
    const travel = Math.abs(event.clientX - state.startX);
    state.dragging = false;
    field.dataset.carouselDragging = "false";
    state.viewport.dataset.dragging = "false";
    try { state.viewport.releasePointerCapture?.(event.pointerId); } catch (_) {}
    state.pointerId = null;

    if (travel < 7) {
      state.dragProgress = 0;
      render(field, state, "pointer-tap");
      return;
    }

    let advance = 0;
    if (Math.abs(projected) >= .18) advance = projected > 0 ? 1 : -1;
    select(field, state, state.index + advance, "drag-snap");
  }

  function removeSurrogateControls(field) {
    const controls = Array.from(field.querySelectorAll(".laws-rolodex-control"));
    controls.forEach(control => control.remove());
    field.dataset.surrogateNavigation = "removed";
  }

  function bindField(field) {
    if (stateByField.has(field)) return;
    const viewport = field.querySelector(".laws-rolodex-viewport");
    const cards = Array.from(field.querySelectorAll(".laws-rolodex-card"));
    const position = field.querySelector(".laws-rolodex-position");
    if (!viewport || !position || cards.length < 2) return;

    removeSurrogateControls(field);

    const state = {
      viewport,
      cards,
      position,
      index: Math.max(0, cards.findIndex(card => card.dataset.active === "true")),
      dragging: false,
      pointerId: null,
      startX: 0,
      lastX: 0,
      lastTime: 0,
      velocity: 0,
      dragProgress: 0
    };
    stateByField.set(field, state);
    field.dataset.lawsDestinationCarousel = "active";
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim() || "Laws"} destinations. Drag horizontally or use Left and Right Arrow keys.`);

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
      else select(field, state, state.index + (event.key === "ArrowRight" ? 1 : -1), "keyboard-arrow", true);
    }, true);

    viewport.addEventListener("pointerdown", event => {
      if (event.target.closest("button, a") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.lastX = event.clientX;
      state.lastTime = performance.now();
      state.velocity = 0;
      state.dragProgress = 0;
      field.dataset.carouselDragging = "true";
      viewport.dataset.dragging = "true";
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const now = performance.now();
      const width = Math.max(280, viewport.clientWidth);
      const delta = event.clientX - state.startX;
      state.dragProgress = Math.max(-1.15, Math.min(1.15, -delta / (width * .48)));
      const elapsed = Math.max(8, now - state.lastTime);
      state.velocity = (state.lastX - event.clientX) / elapsed;
      state.lastX = event.clientX;
      state.lastTime = now;
      render(field, state, "drag-progress");
    });

    viewport.addEventListener("pointerup", event => finishDrag(field, state, event));
    viewport.addEventListener("pointercancel", event => finishDrag(field, state, event));

    cards.forEach((card, index) => {
      card.addEventListener("focusin", () => {
        if (index !== state.index) select(field, state, index, "focus-custody");
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
    installed = fields.some(field => stateByField.has(field));
    if (installed) {
      document.documentElement.dataset.lawsDestinationCarouselRuntime = "active";
      globalThis.DGB_LAWS_DESTINATION_CAROUSEL = Object.freeze({
        contract: CONTRACT,
        installed: true,
        reducedMotion: reducedMotion(),
        surrogateNavigation: false,
        navigationAuthority: false,
        contentAuthority: false,
        routeAuthority: false,
        evidenceAuthority: false
      });
      globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_CAROUSEL_READY", {
        detail: Object.freeze({ contract: CONTRACT, fieldCount: fields.length, surrogateNavigation: false })
      }));
    }
    return installed;
  }

  function initialize() {
    install();
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", () => requestAnimationFrame(install));
    globalThis.addEventListener("LAWS_ROLODEX_PLACEMENT_READY", () => requestAnimationFrame(install));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
