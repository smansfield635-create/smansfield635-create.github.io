// TARGET FILE: /showroom/globe/audralia/planet/index.ui.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_OPERATION_C_UI_JS_OPTIMIZATION_ONLY_TNT_v1
//
// Operation C revision:
// - UI JS optimization only.
// - HTML is held for Operation B.
// - Canvas is protected from this pass.
//
// Owns:
// - Remote control / UI behavior.
// - Gem navigation behavior.
// - Active gem/chamber state.
// - Platform / Engineering tabs.
// - Return to Orbit.
// - Canvas API handoff only.
// - Compact metadata hydration.
// - Fail-open UI behavior.
//
// Does not own:
// - HTML structure rewrite.
// - SVG gem definitions.
// - Canvas pixels.
// - Globe drawing.
// - Sphere projection.
// - Clay body expression.
// - Billboard/stat-card materialization.
// - Active water.
// - Final visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_OPERATION_C_UI_JS_OPTIMIZATION_ONLY_TNT_v1";
  const PREVIOUS_UI_CONTRACT = "AUDRALIA_G2_PLANET_REMOTE_UI_GEM_TABS_TNT_v1";
  const CANVAS_CONTRACT = "AUDRALIA_G2_PLANET_OPERATION_A_DONOR_CANVAS_FEED_EVOLUTION_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const TARGET = "/showroom/globe/audralia/planet/index.ui.js";
  const API_NAME = "DGBAudraliaPlanetCanvas";

  const MODES = Object.freeze({
    body: {
      title: "Body",
      status: "CLAY GLOBE · BASELINE FEED",
      platform:
        "Audralia begins as a moldable clay globe: a world body on screen before landform, sea level, subterranean structure, or above-sea-level terrain is finalized.",
      engineering:
        "UI requests Body mode from the canvas API. Canvas displays the Clay Globe Baseline Feed using predestined latitude / longitude disposition from the hidden Australia-template scaffold."
    },
    surface: {
      title: "Surface",
      status: "DRY SURFACE · CHILD HELD",
      platform:
        "Surface mode lets the visitor inspect dry material readability without turning the body into a finished map or polished gem.",
      engineering:
        "UI requests Surface mode only. Canonical surface child truth remains inactive. Canvas may preview dry surface emphasis, but it does not author surface truth."
    },
    terrain: {
      title: "Terrain",
      status: "RELIEF PREVIEW · TERRAIN CHILD HELD",
      platform:
        "Terrain mode previews where the clay body may later receive ridges, basins, plateaus, escarpments, and above-sea-level definition.",
      engineering:
        "UI requests Terrain mode only. Terrain child truth remains inactive. Canvas transmits a preview state, not a final terrain authority."
    },
    lattice: {
      title: "Lattice",
      status: "16 × 16 · 256 COORDINATE STATES",
      platform:
        "Lattice mode shows that the body carries an ordered coordinate disposition beneath the public globe read.",
      engineering:
        "UI requests Lattice mode. The canvas may expose the 16 × 16 inspection overlay while preserving Audralia as the public identity and Australia-template as hidden scaffold only."
    },
    receipt: {
      title: "Receipt",
      status: "HANDOFF · NO FINAL PASS",
      platform:
        "Receipt mode explains what is loaded, what is held, and what must be fed downstream later.",
      engineering:
        "UI requests Receipt mode. Active water, hydration, terrain child, surface child, datum child, and final visual pass remain false."
    }
  });

  const CHAMBERS = Object.freeze({
    "body-glass": {
      gem: "Body Glass",
      coordinate: "N / NNE",
      version: "Clay globe baseline",
      duty: "World body first read",
      handoff: "Canvas screen baseline feed",
      mode: "body"
    },
    "surface-console": {
      gem: "Surface Console",
      coordinate: "NE / ENE",
      version: "Dry surface preview",
      duty: "Material readability",
      handoff: "Future surface feed",
      mode: "surface"
    },
    "terrain-deck": {
      gem: "Terrain Deck",
      coordinate: "E / ESE",
      version: "Terrain pressure preview",
      duty: "Relief direction",
      handoff: "Future above-sea-level terrain feed",
      mode: "terrain"
    },
    "lattice-scope": {
      gem: "Lattice Scope",
      coordinate: "SE / SSE",
      version: "16 × 16 inspection",
      duty: "Coordinate proof",
      handoff: "Receipt / lattice feed",
      mode: "lattice"
    },
    "water-hold": {
      gem: "Water Hold",
      coordinate: "S / SSW",
      version: "Water inactive",
      duty: "Block false hydration",
      handoff: "Future sea-level feed",
      mode: "receipt"
    },
    "canvas-screen": {
      gem: "Canvas Screen",
      coordinate: "SW / WSW",
      version: "TV screen canvas",
      duty: "Transmit lawful feed",
      handoff: "Downstream feed packets",
      mode: "body"
    },
    "receipt-dock": {
      gem: "Receipt Dock",
      coordinate: "W / WNW",
      version: "Handoff proof",
      duty: "Receipt state",
      handoff: "Audit / next protocol",
      mode: "receipt"
    },
    "contract-seal": {
      gem: "Contract Seal",
      coordinate: "NW / NNW",
      version: "Three-file authority",
      duty: "Boundary lock",
      handoff: "Execution review",
      mode: "receipt"
    }
  });

  const state = {
    initialized: false,
    currentMode: "body",
    currentChamber: "body-glass",
    currentLens: "platform",
    canvasApiDetected: false,
    listenerCount: 0,
    reducedMotion: false,
    errors: []
  };

  if (
    window.__AUDRALIA_G2_PLANET_OPERATION_C_UI_CONTROLLER__ &&
    typeof window.__AUDRALIA_G2_PLANET_OPERATION_C_UI_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_G2_PLANET_OPERATION_C_UI_CONTROLLER__.stop();
    } catch (_error) {}
  }

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = controller ? controller.signal : undefined;

  function $(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function $all(selector, root = document) {
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

  function setText(selector, value, root = document) {
    const node = $(selector, root);
    if (!node) return false;

    const text = String(value);
    if (node.textContent !== text) node.textContent = text;
    return true;
  }

  function addListener(node, type, handler, options = {}) {
    if (!node || typeof node.addEventListener !== "function") return;

    const listenerOptions = signal
      ? { ...options, signal }
      : options;

    node.addEventListener(type, handler, listenerOptions);
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

    setDataset("audraliaUiReducedMotion", state.reducedMotion ? "true" : "false");
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

    setDataset("audraliaUiError", message);
  }

  function getCanvasApi() {
    const api = window[API_NAME];

    const valid = Boolean(
      api &&
      typeof api.setMode === "function" &&
      typeof api.resetView === "function" &&
      typeof api.status === "function"
    );

    state.canvasApiDetected = valid;
    setDataset("audraliaUiCanvasApiDetected", valid ? "true" : "false");

    return valid ? api : null;
  }

  function readCanvasStatus() {
    const api = getCanvasApi();
    if (!api) return null;

    try {
      return api.status();
    } catch (error) {
      recordError("canvas-status", error);
      return null;
    }
  }

  function updateModeCopy(mode) {
    const copy = MODES[mode] || MODES.body;

    setText("[data-audralia-mode-title]", copy.title);
    setText("[data-audralia-mode-status]", copy.status);
    setText("[data-audralia-mode-platform]", copy.platform);
    setText("[data-audralia-mode-engineering]", copy.engineering);
  }

  function applyModeButtonState(mode) {
    $all("[data-audralia-mode]").forEach((button) => {
      const active = button.dataset.audraliaMode === mode;

      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
      button.toggleAttribute("data-active-mode", active);
    });
  }

  function setMode(mode, options = {}) {
    const next = MODES[mode] ? mode : "body";
    const source = options.source || "ui";

    state.currentMode = next;

    applyModeButtonState(next);
    updateModeCopy(next);

    setDataset("audraliaUiMode", next);
    setDataset("audraliaUiModeSource", source);

    const api = getCanvasApi();

    if (api && options.callCanvas !== false) {
      try {
        api.setMode(next);
      } catch (error) {
        recordError("canvas-set-mode", error);
      }
    }

    publishReceipt("set-mode:" + source, { includeCanvasStatus: false });

    return next;
  }

  function chamberMode(id) {
    return CHAMBERS[id] && CHAMBERS[id].mode ? CHAMBERS[id].mode : "body";
  }

  function selectLens(chamber, lens, options = {}) {
    if (!chamber) return;

    const next = lens === "engineering" ? "engineering" : "platform";
    state.currentLens = next;

    $all("[data-lens-tab]", chamber).forEach((button) => {
      const active = button.dataset.lensTab === next;

      button.setAttribute("aria-selected", active ? "true" : "false");
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
      button.toggleAttribute("data-active-lens-tab", active);
    });

    $all("[data-lens-pane]", chamber).forEach((pane) => {
      const active = pane.dataset.lensPane === next;

      pane.hidden = !active;
      pane.toggleAttribute("data-active", active);
      pane.toggleAttribute("data-active-lens-pane", active);
    });

    chamber.dataset.activeLens = next;

    if (options.publish !== false) {
      publishReceipt("select-lens", { includeCanvasStatus: false });
    }
  }

  function setActiveGem(id) {
    $all("[data-gem-anchor]").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const active = href === `#${id}`;

      anchor.toggleAttribute("data-active-gem", active);

      if (active) {
        anchor.setAttribute("aria-current", "location");
      } else {
        anchor.removeAttribute("aria-current");
      }
    });
  }

  function closeSiblingChambers(activeChamber) {
    $all("details[data-audralia-chamber]").forEach((item) => {
      const active = item === activeChamber;

      if (!active && item.open) item.open = false;
      item.toggleAttribute("data-active-chamber", active);
    });
  }

  function openChamber(id, options = {}) {
    const chamber = document.getElementById(id);

    if (!chamber || chamber.tagName.toLowerCase() !== "details") return false;

    state.currentChamber = id;

    closeSiblingChambers(chamber);

    chamber.open = true;
    chamber.toggleAttribute("data-active-chamber", true);

    if (options.preserveLens !== true) {
      selectLens(chamber, "platform", { publish: false });
    }

    setActiveGem(id);

    const mode = chamberMode(id);
    setMode(mode, {
      source: "chamber:" + id,
      callCanvas: options.callCanvas !== false
    });

    if (options.updateHash !== false) {
      try {
        history.replaceState(null, "", "#" + id);
      } catch (_error) {}
    }

    if (options.scroll !== false) {
      scrollToNode(chamber);
    }

    publishReceipt("open-chamber", { includeCanvasStatus: false });

    return true;
  }

  function returnToOrbit(options = {}) {
    state.currentChamber = "orbit";

    $all("details[data-audralia-chamber]").forEach((item) => {
      item.open = false;
      item.removeAttribute("data-active-chamber");
    });

    $all("[data-gem-anchor]").forEach((anchor) => {
      anchor.removeAttribute("data-active-gem");
      anchor.removeAttribute("aria-current");
    });

    setMode("body", {
      source: "return-to-orbit",
      callCanvas: options.callCanvas !== false
    });

    const api = getCanvasApi();

    if (api && options.resetCanvas !== false) {
      try {
        api.resetView();
      } catch (error) {
        recordError("return-reset-view", error);
      }
    }

    setDataset("audraliaReturnToOrbit", "true");

    try {
      history.replaceState(null, "", "#planet-orbit");
    } catch (_error) {}

    const orbit = $("#planet-orbit") || $("[data-audralia-planet-stage]");
    if (orbit) scrollToNode(orbit);

    publishReceipt("return-to-orbit", { includeCanvasStatus: false });
  }

  function bindModeButtons() {
    $all("[data-audralia-mode]").forEach((button) => {
      addListener(button, "click", () => {
        const mode = button.dataset.audraliaMode;
        setMode(mode, { source: "mode-button" });
      });
    });
  }

  function bindTabs() {
    $all("[data-lens-tab]").forEach((button) => {
      addListener(button, "click", () => {
        const chamber = button.closest("[data-audralia-chamber]");
        selectLens(chamber, button.dataset.lensTab);
      });
    });

    $all("[data-audralia-chamber]").forEach((chamber) => {
      selectLens(chamber, "platform", { publish: false });
    });
  }

  function bindGemNavigation() {
    $all("[data-gem-anchor]").forEach((anchor) => {
      addListener(anchor, "click", (event) => {
        const href = anchor.getAttribute("href") || "";
        if (!href.startsWith("#")) return;

        const id = href.slice(1);
        if (!document.getElementById(id)) return;

        event.preventDefault();
        openChamber(id);
      });
    });
  }

  function bindChamberToggles() {
    $all("details[data-audralia-chamber]").forEach((chamber) => {
      addListener(chamber, "toggle", () => {
        if (!chamber.open) return;

        const id = chamber.id;
        if (!id) return;

        state.currentChamber = id;
        closeSiblingChambers(chamber);
        setActiveGem(id);
        selectLens(chamber, chamber.dataset.activeLens || "platform", { publish: false });

        setMode(chamberMode(id), {
          source: "details-toggle:" + id
        });

        publishReceipt("details-toggle", { includeCanvasStatus: false });
      });
    });
  }

  function bindReturnToOrbit() {
    $all(".return-orbit,[data-return-orbit]").forEach((link) => {
      addListener(link, "click", (event) => {
        const href = link.getAttribute("href") || "";

        if (
          href === "#planet-orbit" ||
          href === "#orbit" ||
          link.hasAttribute("data-return-orbit")
        ) {
          event.preventDefault();
          returnToOrbit();
        }
      });
    });
  }

  function bindMenu() {
    const menu = $(".planet-menu");

    $all(".planet-menu-panel a").forEach((link) => {
      addListener(link, "click", () => {
        if (menu) menu.open = false;
      });
    });

    $all("details.planet-menu,details.cockpit-menu,details.route-menu").forEach((details) => {
      addListener(details, "toggle", () => {
        if (!details.open) return;

        $all("details.planet-menu,details.cockpit-menu,details.route-menu").forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    });
  }

  function bindInspectButton() {
    const inspect = $("[data-audralia-inspect-planet]");
    if (!inspect) return;

    addListener(inspect, "click", () => {
      const canvasStatus = readCanvasStatus();
      const statusNode = $("[data-audralia-renderer-status]");

      if (statusNode) {
        statusNode.textContent = canvasStatus
          ? `Canvas screen active · feed ${canvasStatus.feed || "clay globe"} · mode ${canvasStatus.currentMode || state.currentMode}`
          : "Fallback clay globe visible · canvas API not detected";
      }

      setDataset("audraliaPlanetInspection", canvasStatus ? "canvas-api-detected" : "fallback-visible");
      publishReceipt("inspect", { canvasStatus });
    });
  }

  function bindResetView() {
    $all("[data-reset-canvas-view]").forEach((button) => {
      addListener(button, "click", () => {
        const api = getCanvasApi();

        if (!api) {
          publishReceipt("reset-view-api-missing", { includeCanvasStatus: false });
          return;
        }

        try {
          api.resetView();
          publishReceipt("reset-view", { includeCanvasStatus: true });
        } catch (error) {
          recordError("reset-view", error);
        }
      });
    });
  }

  function bindHashChange() {
    addListener(window, "hashchange", () => {
      const hash = window.location.hash ? window.location.hash.slice(1) : "";

      if (!hash || hash === "planet-orbit" || hash === "orbit") {
        returnToOrbit({ resetCanvas: false });
        return;
      }

      if (document.getElementById(hash)) {
        openChamber(hash, { updateHash: false });
      }
    }, { passive: true });
  }

  function hydrateMetadata() {
    Object.entries(CHAMBERS).forEach(([id, meta]) => {
      const chamber = document.getElementById(id);
      if (!chamber) return;

      setText("[data-meta-coordinate]", meta.coordinate, chamber);
      setText("[data-meta-version]", meta.version, chamber);
      setText("[data-meta-duty]", meta.duty, chamber);
      setText("[data-meta-handoff]", meta.handoff, chamber);

      chamber.dataset.coordinate = meta.coordinate;
      chamber.dataset.versionIdentity = meta.version;
      chamber.dataset.expressiveDuty = meta.duty;
      chamber.dataset.handoff = meta.handoff;
      chamber.dataset.canvasMode = meta.mode;
      chamber.dataset.operationCMetadata = "true";
    });
  }

  function markGemReceipts() {
    $all("[data-gem-anchor]").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      const meta = CHAMBERS[id];

      if (!meta) return;

      anchor.dataset.coordinate = meta.coordinate;
      anchor.dataset.versionIdentity = meta.version;
      anchor.dataset.expressiveDuty = meta.duty;
      anchor.dataset.handoff = meta.handoff;
      anchor.dataset.canvasMode = meta.mode;
      anchor.dataset.gemNavigation = "true";
      anchor.dataset.operationC = "ui-js-optimized";

      if (!anchor.getAttribute("aria-label")) {
        anchor.setAttribute(
          "aria-label",
          `${meta.gem}: ${meta.coordinate}. ${meta.duty}.`
        );
      }
    });
  }

  function publishReceipt(scope = "status", options = {}) {
    const canvasStatus = Object.prototype.hasOwnProperty.call(options, "canvasStatus")
      ? options.canvasStatus
      : options.includeCanvasStatus
        ? readCanvasStatus()
        : null;

    const payload = Object.freeze({
      contract: CONTRACT,
      previousUiContract: PREVIOUS_UI_CONTRACT,
      canvasContract: CANVAS_CONTRACT,
      route: ROUTE,
      target: TARGET,
      scope,
      uiRole: "REMOTE_CONTROL",
      uiScope: "index-ui-js-only",
      htmlHeldForOperationB: true,
      canvasProtected: true,
      canvasApiDetected: state.canvasApiDetected,
      currentMode: state.currentMode,
      currentChamber: state.currentChamber,
      currentLens: state.currentLens,
      reducedMotion: state.reducedMotion,
      listenerCount: state.listenerCount,
      gemsNavigation: true,
      modeControlsBound: true,
      platformEngineeringTabs: true,
      metadataCompressed: true,
      returnToOrbitBound: true,
      failOpen: true,
      canvasStatus,
      publicIdentity: "Audralia",
      templateSource: "AUSTRALIA_TEMPLATE_HIDDEN_SCAFFOLD",
      activeWater: false,
      hydrationActive: false,
      terrainChildActive: false,
      surfaceChildActive: false,
      datumChildActive: false,
      generatedImage: false,
      graphicBox: false,
      finalVisualPass: false,
      initialized: state.initialized,
      errors: state.errors.slice(),
      time: new Date().toISOString()
    });

    window.AUDRALIA_G2_PLANET_UI_RECEIPT = payload;
    window.AUDRALIA_G2_PLANET_OPERATION_C_UI_STATUS = payload;
    window.AUDRALIA_G2_PLANET_OPERATION_C_UI_JS_OPTIMIZATION_STATUS = payload;

    setDataset("audraliaUiContract", CONTRACT);
    setDataset("audraliaUiPreviousContract", PREVIOUS_UI_CONTRACT);
    setDataset("audraliaUiRole", "remote-control");
    setDataset("audraliaUiScope", "index-ui-js-only");
    setDataset("audraliaUiHtmlHeldForOperationB", "true");
    setDataset("audraliaUiCanvasProtected", "true");
    setDataset("audraliaUiGemsNavigation", "true");
    setDataset("audraliaUiTabs", "platform-engineering");
    setDataset("audraliaUiMetadataCompressed", "true");
    setDataset("audraliaUiCanvasApiDetected", state.canvasApiDetected ? "true" : "false");
    setDataset("audraliaUiActiveWater", "false");
    setDataset("audraliaUiHydrationActive", "false");
    setDataset("audraliaUiTerrainChildActive", "false");
    setDataset("audraliaUiSurfaceChildActive", "false");
    setDataset("audraliaUiDatumChildActive", "false");
    setDataset("audraliaUiGeneratedImage", "false");
    setDataset("audraliaUiGraphicBox", "false");
    setDataset("audraliaUiFinalVisualPass", "false");
    setDataset("audraliaUiInitialized", state.initialized ? "true" : "false");

    return payload;
  }

  function exposeUiApi() {
    window.DGBAudraliaPlanetUI = Object.freeze({
      contract: CONTRACT,
      previousUiContract: PREVIOUS_UI_CONTRACT,
      canvasContract: CANVAS_CONTRACT,
      setMode,
      openChamber,
      returnToOrbit,
      selectLensById(chamberId, lens) {
        const chamber = document.getElementById(chamberId);
        selectLens(chamber, lens);
      },
      status() {
        return publishReceipt("status", { includeCanvasStatus: true });
      }
    });
  }

  function initOpenState() {
    const hash = window.location.hash ? window.location.hash.slice(1) : "";

    if (hash && document.getElementById(hash) && CHAMBERS[hash]) {
      openChamber(hash, {
        updateHash: false,
        scroll: true
      });
      return;
    }

    const defaultId = document.getElementById("body-glass") ? "body-glass" : Object.keys(CHAMBERS)[0];
    const defaultChamber = document.getElementById(defaultId);

    if (defaultChamber && defaultChamber.matches("[data-audralia-chamber]")) {
      defaultChamber.open = true;
      defaultChamber.toggleAttribute("data-active-chamber", true);
      state.currentChamber = defaultId;
      setActiveGem(defaultId);
      selectLens(defaultChamber, "platform", { publish: false });
      setMode(chamberMode(defaultId), {
        source: "init-default",
        callCanvas: true
      });
      return;
    }

    setMode("body", {
      source: "init-no-chamber",
      callCanvas: true
    });
  }

  function stop() {
    if (controller) {
      try {
        controller.abort();
      } catch (_error) {}
    }
  }

  window.__AUDRALIA_G2_PLANET_OPERATION_C_UI_CONTROLLER__ = {
    stop,
    state,
    contract: CONTRACT,
    status() {
      return publishReceipt("controller-status", { includeCanvasStatus: true });
    }
  };

  function init() {
    try {
      detectReducedMotion();
      exposeUiApi();
      hydrateMetadata();
      markGemReceipts();

      bindModeButtons();
      bindTabs();
      bindGemNavigation();
      bindChamberToggles();
      bindReturnToOrbit();
      bindMenu();
      bindInspectButton();
      bindResetView();
      bindHashChange();

      state.initialized = true;
      initOpenState();

      publishReceipt("init-complete", { includeCanvasStatus: true });
    } catch (error) {
      recordError("init", error);
      state.initialized = true;
      publishReceipt("init-error", { includeCanvasStatus: false });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
