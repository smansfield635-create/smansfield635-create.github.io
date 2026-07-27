/* /products/index.controller.center.js
   PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_NAVIGATION_EXTENSION_v1
   Controller-lane extension for the fixed center-globe return to the Main
   Compass. It creates no second Products state machine, product registry,
   gesture authority, canvas, animation loop, or product route table.
*/
(() => {
  "use strict";

  const MODULE = "DGB_PRODUCTS_CONTROLLER_CENTER";
  const RECEIPT_KEY = "DGB_PRODUCTS_CENTER_CONTROL_RECEIPT";
  const CONTROLLER_KEY = "DGB_PRODUCTS_CONTROLLER";
  const ROUTE = "/";
  const ALLOWED_STATES = new Set(["CLUSTER_OPEN", "PRODUCT_SELECTED"]);

  if (globalThis[MODULE]?.initialized) return;

  const state = {
    initialized: false,
    failed: false,
    root: null,
    control: null,
    output: null,
    observer: null,
    activationCount: 0,
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
      contract: "PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_NAVIGATION_EXTENSION_v1",
      module: MODULE,
      authorityLayer: "PRODUCTS_CONTROLLER",
      subordinateTo: CONTROLLER_KEY,
      initialized: state.initialized,
      failed: state.failed,
      status: state.failed ? "held" : state.initialized ? "available" : "pending",
      role: "MAIN_COMPASS_RETURN",
      route: ROUTE,
      routeValidated: true,
      activationAuthority: "PRODUCTS_CONTROLLER",
      createsSecondController: false,
      ownsProductState: false,
      ownsProductRegistry: false,
      ownsGesture: false,
      ownsCanvas: false,
      ownsAnimationLoop: false,
      activationCount: state.activationCount,
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
      state.root.dataset.productsCenterControlReceipt = JSON.stringify(next);
    }

    if (state.output) {
      const serialized = JSON.stringify(next);
      state.output.value = serialized;
      state.output.textContent = serialized;
    }

    return next;
  }

  function syncAvailability() {
    if (!state.control) return false;
    const available = ALLOWED_STATES.has(currentState()) && !state.failed;
    state.control.hidden = !available;
    state.control.disabled = !available;
    state.control.setAttribute("aria-hidden", available ? "false" : "true");
    state.control.setAttribute("aria-disabled", available ? "false" : "true");
    state.control.tabIndex = available ? 0 : -1;
    publish({ lastAction: "center-availability-synchronized" });
    return available;
  }

  function requestMainCompassReturn(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const sourceState = currentState();
    const route = String(state.control?.dataset.productsCenterRoute || "").trim();

    if (route !== ROUTE) {
      state.lastFailure = `INVALID_CENTER_ROUTE:${route}`;
      publish({ status: "held", lastAction: "center-route-rejected", lastFailure: state.lastFailure });
      return false;
    }

    if (!ALLOWED_STATES.has(sourceState)) {
      state.lastFailure = `INVALID_CENTER_STATE:${sourceState}`;
      publish({ status: "held", lastAction: "center-state-rejected", lastFailure: state.lastFailure });
      return false;
    }

    state.activationCount += 1;
    state.lastFailure = null;
    publish({
      lastAction: "main-compass-navigation-requested",
      lastFailure: null,
      navigationRequested: true,
      sourceState
    });

    globalThis.location.assign(ROUTE);
    return true;
  }

  function fail(error) {
    state.failed = true;
    state.lastFailure = error instanceof Error ? error.message : String(error);
    publish({ status: "held", lastAction: "center-control-held", lastFailure: state.lastFailure });
  }

  function initialize() {
    try {
      state.root = document.querySelector('[data-page-id="products"]');
      if (!state.root) throw new Error("PRODUCTS_ROOT_NOT_FOUND");

      state.control = state.root.querySelector("[data-products-center-control]");
      if (!state.control) throw new Error("PRODUCTS_CENTER_CONTROL_NOT_FOUND");

      state.output = state.root.querySelector("[data-products-center-control-receipt]");
      if (!controller()) throw new Error("PRODUCTS_CONTROLLER_NOT_AVAILABLE");
      if (String(state.control.dataset.productsCenterRoute || "").trim() !== ROUTE) {
        throw new Error("PRODUCTS_CENTER_ROUTE_INVALID");
      }

      state.control.addEventListener("click", requestMainCompassReturn);
      state.observer = new MutationObserver(syncAvailability);
      state.observer.observe(state.root, {
        attributes: true,
        attributeFilter: ["data-products-state"]
      });

      state.initialized = true;
      syncAvailability();
      publish({ lastAction: "center-control-initialized", lastFailure: null });

      globalThis[MODULE] = Object.freeze({
        initialized: true,
        contract: "PRODUCTS_ARENA_CLUSTER_CONTROLLER_CENTER_NAVIGATION_EXTENSION_v1",
        requestMainCompassReturn,
        syncAvailability,
        receipt: () => receipt(),
        dispose: () => {
          state.observer?.disconnect();
          state.control?.removeEventListener("click", requestMainCompassReturn);
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
