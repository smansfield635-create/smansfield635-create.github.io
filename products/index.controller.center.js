/* /products/index.controller.center.js
   PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_CONTINUITY_EXTENSION_v2
   Bounded center-world disclosure and optional double-tap return adaptation.
   Creates no second Products state machine, product registry, gesture authority,
   canvas, animation loop, or product route table.
 */
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_CONTROLLER_CENTER";
  const RECEIPT_KEY = "DGB_PRODUCTS_CENTER_CONTROL_RECEIPT";
  const CONTROLLER_KEY = "DGB_PRODUCTS_CONTROLLER";
  const ROUTE = "/";
  const ALLOWED_STATES = new Set(["CLUSTER_OPEN", "PRODUCT_SELECTED"]);
  const DOUBLE_TAP_WINDOW_MS = 300;
  const TAP_MAX_MOVEMENT_PX = 10;

  if (globalThis[MODULE]?.initialized) return;

  const state = {
    initialized: false,
    failed: false,
    root: null,
    control: null,
    returnOption: null,
    output: null,
    observer: null,
    disclosureOpen: false,
    activationCount: 0,
    navigationCount: 0,
    lastTapAt: 0,
    pointer: null,
    suppressClickUntil: 0,
    lastFailure: null
  };

  function controller() {
    const api = globalThis[CONTROLLER_KEY];
    return api && typeof api.getFrameState === "function" ? api : null;
  }

  function frameState() {
    const api = controller();
    if (!api) return null;
    try {
      return api.getFrameState();
    } catch (_) {
      return null;
    }
  }

  function currentState() {
    return String(frameState()?.state || state.root?.dataset.productsState || "").trim();
  }

  function receipt(extra = {}) {
    return Object.freeze({
      contract: "PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_CONTINUITY_EXTENSION_v2",
      module: MODULE,
      authorityLayer: "PRODUCTS_CONTROLLER",
      subordinateTo: CONTROLLER_KEY,
      initialized: state.initialized,
      failed: state.failed,
      status: state.failed ? "held" : state.initialized ? "available" : "pending",
      role: "MAIN_COMPASS_RETURN_DISCLOSURE",
      route: ROUTE,
      routeValidated: true,
      activationAuthority: "PRODUCTS_CONTROLLER",
      createsSecondController: false,
      ownsProductState: false,
      ownsProductRegistry: false,
      ownsGesture: false,
      ownsCanvas: false,
      ownsAnimationLoop: false,
      disclosureOpen: state.disclosureOpen,
      doubleTapWindowMs: DOUBLE_TAP_WINDOW_MS,
      tapMaximumMovementPx: TAP_MAX_MOVEMENT_PX,
      activationCount: state.activationCount,
      navigationCount: state.navigationCount,
      currentState: currentState(),
      navigationRequested: false,
      lastAction: "",
      lastFailure: state.lastFailure,
      visualPassClaimed: false,
      ...extra
    });
  }

  function publish(extra = {}) {
    const next = receipt(extra);
    globalThis[RECEIPT_KEY] = next;

    if (state.root) {
      state.root.dataset.productsCenterControlStatus = next.status;
      state.root.dataset.productsCenterControlCount = state.control ? "1" : "0";
      state.root.dataset.productsCenterDisclosure = state.disclosureOpen ? "open" : "closed";
      state.root.dataset.productsCenterControlReceipt = JSON.stringify(next);
    }

    if (state.output) {
      const serialized = JSON.stringify(next);
      state.output.value = serialized;
      state.output.textContent = serialized;
    }

    return next;
  }

  function setDisclosure(open, action = "center-disclosure-synchronized") {
    state.disclosureOpen = Boolean(open) && ALLOWED_STATES.has(currentState()) && !state.failed;

    if (state.control) {
      state.control.setAttribute("aria-expanded", state.disclosureOpen ? "true" : "false");
    }

    if (state.returnOption) {
      state.returnOption.hidden = !state.disclosureOpen;
      state.returnOption.setAttribute("aria-hidden", state.disclosureOpen ? "false" : "true");
      state.returnOption.tabIndex = state.disclosureOpen ? 0 : -1;
    }

    publish({ lastAction: action });
    return state.disclosureOpen;
  }

  function syncAvailability() {
    if (!state.control) return false;
    const available = ALLOWED_STATES.has(currentState()) && !state.failed;
    state.control.hidden = !available;
    state.control.disabled = !available;
    state.control.setAttribute("aria-hidden", available ? "false" : "true");
    state.control.setAttribute("aria-disabled", available ? "false" : "true");
    state.control.tabIndex = available ? 0 : -1;

    if (!available) {
      state.lastTapAt = 0;
      state.pointer = null;
      setDisclosure(false, "center-unavailable-disclosure-closed");
    } else {
      publish({ lastAction: "center-availability-synchronized" });
    }

    return available;
  }

  function validateReturnRequest() {
    const sourceState = currentState();
    const route = String(state.control?.dataset.productsCenterRoute || "").trim();

    if (route !== ROUTE) {
      state.lastFailure = `INVALID_CENTER_ROUTE:${route}`;
      publish({ status: "held", lastAction: "center-route-rejected", lastFailure: state.lastFailure });
      return null;
    }

    if (!ALLOWED_STATES.has(sourceState)) {
      state.lastFailure = `INVALID_CENTER_STATE:${sourceState}`;
      publish({ status: "held", lastAction: "center-state-rejected", lastFailure: state.lastFailure });
      return null;
    }

    return { route, sourceState };
  }

  function navigateToMainCompass(action, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const request = validateReturnRequest();
    if (!request) return false;

    state.navigationCount += 1;
    state.lastFailure = null;
    publish({
      lastAction: action,
      lastFailure: null,
      navigationRequested: true,
      sourceState: request.sourceState
    });

    globalThis.location.assign(ROUTE);
    return true;
  }

  function activateDisclosure(event, source = "single-tap") {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!ALLOWED_STATES.has(currentState()) || state.failed) return false;

    state.activationCount += 1;
    state.lastFailure = null;
    setDisclosure(!state.disclosureOpen, `${source}-center-disclosure-${state.disclosureOpen ? "opened" : "closed"}`);
    return true;
  }

  function resetPointer() {
    if (state.pointer && state.control?.hasPointerCapture?.(state.pointer.id)) {
      try { state.control.releasePointerCapture(state.pointer.id); } catch (_) {}
    }
    state.pointer = null;
  }

  function onPointerDown(event) {
    if (!ALLOWED_STATES.has(currentState()) || state.failed) return;
    state.pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false
    };
    try { state.control.setPointerCapture(event.pointerId); } catch (_) {}
  }

  function onPointerMove(event) {
    if (!state.pointer || event.pointerId !== state.pointer.id) return;
    const distance = Math.hypot(
      event.clientX - state.pointer.x,
      event.clientY - state.pointer.y
    );
    if (distance > TAP_MAX_MOVEMENT_PX) {
      state.pointer.moved = true;
      state.lastTapAt = 0;
      publish({ lastAction: "center-tap-cancelled-for-drag", pointerMovementPx: distance });
    }
  }

  function onPointerCancel(event) {
    if (!state.pointer || event.pointerId !== state.pointer.id) return;
    state.lastTapAt = 0;
    resetPointer();
    publish({ lastAction: "center-pointer-cancelled" });
  }

  function onPointerUp(event) {
    if (!state.pointer || event.pointerId !== state.pointer.id) return;

    const moved = state.pointer.moved;
    resetPointer();

    if (moved) return;

    event.preventDefault();
    event.stopPropagation();
    state.suppressClickUntil = performance.now() + 500;

    const now = performance.now();
    const isDoubleTap = state.lastTapAt > 0 && now - state.lastTapAt <= DOUBLE_TAP_WINDOW_MS;

    if (isDoubleTap) {
      state.lastTapAt = 0;
      navigateToMainCompass("double-tap-main-compass-navigation-requested", event);
      return;
    }

    state.lastTapAt = now;
    activateDisclosure(event, "single-tap");
  }

  function onControlClick(event) {
    if (performance.now() < state.suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    activateDisclosure(event, "keyboard-or-click");
  }

  function onReturnOptionClick(event) {
    navigateToMainCompass("explicit-main-compass-navigation-requested", event);
  }

  function fail(error) {
    state.failed = true;
    state.lastFailure = error instanceof Error ? error.message : String(error);
    setDisclosure(false, "center-control-held");
    publish({ status: "held", lastAction: "center-control-held", lastFailure: state.lastFailure });
  }

  function initialize() {
    try {
      state.root = document.querySelector('[data-page-id="products"]');
      if (!state.root) throw new Error("PRODUCTS_ROOT_NOT_FOUND");

      state.control = state.root.querySelector("[data-products-center-control]");
      if (!state.control) throw new Error("PRODUCTS_CENTER_CONTROL_NOT_FOUND");

      state.returnOption = state.root.querySelector("[data-products-return-main-compass]");
      if (!state.returnOption) throw new Error("PRODUCTS_CENTER_RETURN_OPTION_NOT_FOUND");

      state.output = state.root.querySelector("[data-products-center-control-receipt]");
      if (!controller()) throw new Error("PRODUCTS_CONTROLLER_NOT_AVAILABLE");
      if (String(state.control.dataset.productsCenterRoute || "").trim() !== ROUTE) {
        throw new Error("PRODUCTS_CENTER_ROUTE_INVALID");
      }
      if (String(state.returnOption.getAttribute("href") || "").trim() !== ROUTE) {
        throw new Error("PRODUCTS_CENTER_RETURN_OPTION_ROUTE_INVALID");
      }

      state.control.addEventListener("pointerdown", onPointerDown);
      state.control.addEventListener("pointermove", onPointerMove);
      state.control.addEventListener("pointerup", onPointerUp);
      state.control.addEventListener("pointercancel", onPointerCancel);
      state.control.addEventListener("click", onControlClick);
      state.returnOption.addEventListener("click", onReturnOptionClick);

      state.observer = new MutationObserver(syncAvailability);
      state.observer.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-products-state"]
      });

      state.initialized = true;
      setDisclosure(false, "center-control-initialized");
      syncAvailability();

      globalThis[MODULE] = Object.freeze({
        initialized: true,
        contract: "PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_CONTINUITY_EXTENSION_v2",
        setDisclosure,
        syncAvailability,
        navigateToMainCompass,
        receipt: () => receipt(),
        dispose: () => {
          state.observer?.disconnect();
          state.control?.removeEventListener("pointerdown", onPointerDown);
          state.control?.removeEventListener("pointermove", onPointerMove);
          state.control?.removeEventListener("pointerup", onPointerUp);
          state.control?.removeEventListener("pointercancel", onPointerCancel);
          state.control?.removeEventListener("click", onControlClick);
          state.returnOption?.removeEventListener("click", onReturnOptionClick);
          resetPointer();
          return true;
        }
      });
    } catch (error) {
      fail(error);
    }
  }

  globalThis[RECEIPT_KEY] = receipt();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
