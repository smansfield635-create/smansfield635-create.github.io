// TARGET FILE: /showroom/index.ui.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_UI_TNT_v1
//
// Role:
// - Showroom UI authority.
// - Owns lens controls, jump-pad behavior, inspect/reset controls,
//   route-menu closure, return-to-diamond behavior, UI receipt, and fail-open state.
// - Consumes window.DGBShowroomDiamondG2 when available.
//
// Does not own:
// - HTML shell.
// - Diamond geometry.
// - Diamond pixels.
// - Lattice construction.
// - Renderer authority.
// - Generated images.
// - GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_UI_TNT_v1";
  const FAMILY = "SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_THREE_FILE_FAMILY_v1";
  const HTML_CONTRACT = "SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_HTML_TNT_v1";
  const RENDERER_CONTRACT = "SHOWROOM_DIAMOND_G2_GEM_GLOBE_PROOF_OBJECT_RENDERER_TNT_v1";
  const ROUTE = "/showroom/";
  const TARGET = "/showroom/index.ui.js";
  const RENDERER_API = "DGBShowroomDiamondG2";

  const LENS_COPY = Object.freeze({
    crystal: {
      title: "Crystal Form",
      route: "Crystal Form → G2 gem-globe proof object",
      copy:
        "Crystal Form shows the renewed G2 Diamond as a globe-inspired but gem-governed proof object: imperfect facets, internal world pressure, and a touchable crystalline body."
    },
    lattice: {
      title: "Lattice Structure",
      route: "Lattice Structure → 16 radial nodes × 16 Fibonacci bands = 256 lattice seats",
      copy:
        "Lattice Structure reveals the computable proof field beneath the Diamond: sixteen radial nodes through sixteen Fibonacci-governed bands, producing 256 addressable lattice seats."
    }
  });

  const state = {
    initialized: false,
    activeLens: "crystal",
    rendererApiDetected: false,
    reducedMotion: false,
    listenerCount: 0,
    jumpPadCount: 0,
    menuCount: 0,
    errors: []
  };

  if (
    window.__SHOWROOM_DIAMOND_G2_UI_CONTROLLER__ &&
    typeof window.__SHOWROOM_DIAMOND_G2_UI_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__SHOWROOM_DIAMOND_G2_UI_CONTROLLER__.stop();
    } catch (_error) {}
  }

  const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = abortController ? abortController.signal : undefined;

  function query(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function all(selector, root = document) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setDataset(key, value) {
    const text = String(value);

    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
    } catch (_error) {}
  }

  function setText(selector, value) {
    const node = query(selector);
    if (!node) return false;

    const text = String(value);
    if (node.textContent !== text) node.textContent = text;
    return true;
  }

  function addListener(node, type, handler, options = {}) {
    if (!node || typeof node.addEventListener !== "function") return;

    const finalOptions = signal ? { ...options, signal } : options;

    node.addEventListener(type, handler, finalOptions);
    state.listenerCount += 1;
  }

  function detectReducedMotion() {
    try {
      state.reducedMotion = Boolean(
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_error) {
      state.reducedMotion = false;
    }

    setDataset("showroomDiamondG2ReducedMotion", state.reducedMotion ? "true" : "false");
  }

  function scrollToNode(node, block = "start") {
    if (!node || typeof node.scrollIntoView !== "function") return;

    requestAnimationFrame(() => {
      node.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block
      });
    });
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    setDataset("showroomDiamondG2UiError", message);
    publishReceipt("error:" + scope, { includeRendererStatus: false });
  }

  function getRendererApi() {
    const api = window[RENDERER_API];

    const valid = Boolean(
      api &&
      typeof api.setLens === "function" &&
      typeof api.reset === "function" &&
      typeof api.status === "function"
    );

    state.rendererApiDetected = valid;
    setDataset("showroomDiamondG2RendererApiDetected", valid ? "true" : "false");

    return valid ? api : null;
  }

  function readRendererStatus() {
    const api = getRendererApi();
    if (!api) return null;

    try {
      return api.status();
    } catch (error) {
      recordError("renderer-status", error);
      return null;
    }
  }

  function updateLensCopy(lens) {
    const copy = LENS_COPY[lens] || LENS_COPY.crystal;

    setText("[data-diamond-lens-title]", copy.title);
    setText("[data-diamond-route-label]", copy.route);
    setText("[data-diamond-lens-copy]", copy.copy);
  }

  function updateLensButtons(lens) {
    all("[data-diamond-lens]").forEach((button) => {
      const active = button.dataset.diamondLens === lens;

      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
      button.toggleAttribute("data-active-lens", active);
    });
  }

  function updateStatusText(text) {
    const node = query("[data-showroom-diamond-status]");
    if (!node) return false;

    node.textContent = text;
    return true;
  }

  function setLens(nextLens, options = {}) {
    const lens = nextLens === "lattice" ? "lattice" : "crystal";
    const source = options.source || "ui";

    state.activeLens = lens;

    updateLensButtons(lens);
    updateLensCopy(lens);

    setDataset("showroomDiamondG2UiLens", lens);
    setDataset("showroomDiamondG2UiLensSource", source);

    const api = getRendererApi();

    if (api && options.callRenderer !== false) {
      try {
        api.setLens(lens);
      } catch (error) {
        recordError("renderer-set-lens", error);
      }
    }

    const label = lens === "lattice"
      ? "Lattice Structure active · 16 × 16 / 256 proof field"
      : "Crystal Form active · G2 gem-globe proof object";

    updateStatusText(label);
    publishReceipt("set-lens:" + source, { includeRendererStatus: false });

    return lens;
  }

  function resetDiamond(options = {}) {
    const api = getRendererApi();

    if (api && options.callRenderer !== false) {
      try {
        api.reset();
        updateStatusText("Diamond reset · G2 proof object");
      } catch (error) {
        recordError("renderer-reset", error);
      }
    } else {
      updateStatusText("Diamond controls active · renderer API not detected yet");
    }

    publishReceipt("reset-diamond", { includeRendererStatus: true });
  }

  function inspectDiamond() {
    const rendererStatus = readRendererStatus();

    if (rendererStatus) {
      updateStatusText(
        `G2 Diamond active · ${rendererStatus.activeLens || state.activeLens} · ${rendererStatus.latticeSeats || 256} seats · gem-governed`
      );
    } else {
      updateStatusText("Showroom shell active · renderer API not detected · page remains readable");
    }

    publishReceipt("inspect", { rendererStatus });
  }

  function closeRouteMenus() {
    all("details.route-menu, details.planet-menu, details.cockpit-menu").forEach((details) => {
      try {
        details.open = false;
      } catch (_error) {}
    });
  }

  function bindLensControls() {
    all("[data-diamond-lens]").forEach((button) => {
      addListener(button, "click", () => {
        setLens(button.dataset.diamondLens, { source: "lens-button" });
      });
    });
  }

  function bindResetAndInspect() {
    const reset = query("[data-showroom-diamond-reset]");
    const inspect = query("[data-showroom-diamond-inspect]");

    addListener(reset, "click", () => {
      resetDiamond();
    });

    addListener(inspect, "click", () => {
      inspectDiamond();
    });
  }

  function bindJumpPads() {
    const pads = all(".jump-pad[href], .button[href]");
    state.jumpPadCount = pads.length;

    pads.forEach((link) => {
      addListener(link, "click", (event) => {
        const href = link.getAttribute("href") || "";

        if (!href.startsWith("#")) {
          closeRouteMenus();
          publishReceipt("jump-external", { includeRendererStatus: false });
          return;
        }

        const target = query(href);
        if (!target) return;

        event.preventDefault();
        closeRouteMenus();
        scrollToNode(target);

        if (href === "#diamond-object") {
          setLens(state.activeLens, {
            source: "jump-to-diamond",
            callRenderer: true
          });
        }

        publishReceipt("jump-internal:" + href.slice(1), { includeRendererStatus: false });
      });
    });
  }

  function bindMenus() {
    const menus = all("details.route-menu, details.planet-menu, details.cockpit-menu");
    state.menuCount = menus.length;

    menus.forEach((details) => {
      addListener(details, "toggle", () => {
        if (!details.open) return;

        menus.forEach((other) => {
          if (other !== details) {
            try {
              other.open = false;
            } catch (_error) {}
          }
        });
      });
    });

    all(".route-menu-panel a, .planet-menu-panel a, .cockpit-menu-panel a").forEach((link) => {
      addListener(link, "click", () => {
        closeRouteMenus();
      });
    });
  }

  function bindRendererReadyEvent() {
    addListener(window, "showroom-diamond-g2-ready", () => {
      setLens(state.activeLens, {
        source: "renderer-ready",
        callRenderer: true
      });

      publishReceipt("renderer-ready", { includeRendererStatus: true });
    });
  }

  function applyInitialState() {
    const requestedLens = document.documentElement.dataset.showroomDiamondG2Lens;
    const initial = requestedLens === "lattice" ? "lattice" : "crystal";

    setLens(initial, {
      source: "init",
      callRenderer: true
    });
  }

  function status() {
    const rendererApiDetected = Boolean(getRendererApi());

    return Object.freeze({
      contract: CONTRACT,
      contractFamily: FAMILY,
      htmlContract: HTML_CONTRACT,
      rendererContract: RENDERER_CONTRACT,
      route: ROUTE,
      target: TARGET,
      role: "ui_controller",

      activeLens: state.activeLens,
      rendererApiDetected,
      reducedMotion: state.reducedMotion,
      listenerCount: state.listenerCount,
      jumpPadCount: state.jumpPadCount,
      menuCount: state.menuCount,

      lensSwitching: true,
      jumpPads: true,
      rendererApiOptional: true,
      failOpen: true,

      generatedImage: false,
      graphicBox: false,
      externalImageAsset: false,
      audraliaInheritance: false,
      planetTemplateInheritance: false,
      initialized: state.initialized,
      errors: state.errors.slice()
    });
  }

  function publishReceipt(scope = "status", options = {}) {
    const rendererStatus = Object.prototype.hasOwnProperty.call(options, "rendererStatus")
      ? options.rendererStatus
      : options.includeRendererStatus
        ? readRendererStatus()
        : null;

    const payload = Object.freeze({
      ...status(),
      scope,
      rendererStatus,
      time: new Date().toISOString()
    });

    window.SHOWROOM_DIAMOND_G2_UI_RECEIPT = payload;
    window.SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_UI_STATUS = payload;
    window.DGB_SHOWROOM_DIAMOND_G2_UI_STATUS = payload;

    setDataset("showroomDiamondG2UiContract", CONTRACT);
    setDataset("showroomDiamondG2UiActive", "true");
    setDataset("showroomDiamondG2UiLens", state.activeLens);
    setDataset("showroomDiamondG2UiLensSwitching", "true");
    setDataset("showroomDiamondG2UiJumpPads", "true");
    setDataset("showroomDiamondG2UiFailOpen", "true");
    setDataset("showroomDiamondG2UiRendererApiOptional", "true");
    setDataset("showroomDiamondG2UiRendererApiDetected", state.rendererApiDetected ? "true" : "false");
    setDataset("showroomDiamondG2UiGeneratedImage", "false");
    setDataset("showroomDiamondG2UiGraphicBox", "false");
    setDataset("showroomDiamondG2UiInitialized", state.initialized ? "true" : "false");

    return payload;
  }

  function exposeApi() {
    window.DGBShowroomDiamondG2UI = Object.freeze({
      contract: CONTRACT,
      contractFamily: FAMILY,
      setLens,
      resetDiamond,
      inspectDiamond,
      status() {
        return publishReceipt("status", { includeRendererStatus: true });
      }
    });
  }

  function stop() {
    if (abortController) {
      try {
        abortController.abort();
      } catch (_error) {}
    }
  }

  window.__SHOWROOM_DIAMOND_G2_UI_CONTROLLER__ = {
    stop,
    state,
    contract: CONTRACT,
    setLens,
    resetDiamond,
    inspectDiamond,
    status() {
      return publishReceipt("controller-status", { includeRendererStatus: true });
    }
  };

  function init() {
    try {
      detectReducedMotion();
      exposeApi();

      bindLensControls();
      bindResetAndInspect();
      bindJumpPads();
      bindMenus();
      bindRendererReadyEvent();

      state.initialized = true;
      applyInitialState();

      publishReceipt("init-complete", { includeRendererStatus: true });
    } catch (error) {
      recordError("init", error);
      state.initialized = true;
      publishReceipt("init-error", { includeRendererStatus: false });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal, once: true } : { once: true });
  } else {
    init();
  }
})();
