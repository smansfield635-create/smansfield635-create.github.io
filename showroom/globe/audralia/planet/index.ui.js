// TARGET FILE: /showroom/globe/audralia/planet/index.ui.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_REMOTE_UI_GEM_TABS_TNT_v1
//
// Role:
// - Remote control / UI authority.
// - Owns menu, mode buttons, gem navigation, Platform / Engineering tabs,
//   chamber open behavior, Return to Orbit, compact metadata exposure, and UI receipt.
// - Calls the canvas TV screen API when available.
//
// Does not own:
// - Canvas pixels.
// - Globe drawing.
// - Sphere projection.
// - Latitude / longitude construction.
// - Clay body expression.
// - Planet truth.
// - Downstream feed truth.
// - Active water.
// - Final visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_REMOTE_UI_GEM_TABS_TNT_v1";
  const CANVAS_CONTRACT = "AUDRALIA_G2_PLANET_CLAY_GLOBE_TV_SCREEN_CANVAS_TNT_v1";
  const API_NAME = "DGBAudraliaPlanetCanvas";
  const ROUTE = "/showroom/globe/audralia/planet/";

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
      handoff: "Canvas screen baseline feed"
    },
    "surface-console": {
      gem: "Surface Console",
      coordinate: "NE / ENE",
      version: "Dry surface preview",
      duty: "Material readability",
      handoff: "Future surface feed"
    },
    "terrain-deck": {
      gem: "Terrain Deck",
      coordinate: "E / ESE",
      version: "Terrain pressure preview",
      duty: "Relief direction",
      handoff: "Future above-sea-level terrain feed"
    },
    "lattice-scope": {
      gem: "Lattice Scope",
      coordinate: "SE / SSE",
      version: "16 × 16 inspection",
      duty: "Coordinate proof",
      handoff: "Receipt / lattice feed"
    },
    "water-hold": {
      gem: "Water Hold",
      coordinate: "S / SSW",
      version: "Water inactive",
      duty: "Block false hydration",
      handoff: "Future sea-level feed"
    },
    "canvas-screen": {
      gem: "Canvas Screen",
      coordinate: "SW / WSW",
      version: "TV screen canvas",
      duty: "Transmit lawful feed",
      handoff: "Downstream feed packets"
    },
    "receipt-dock": {
      gem: "Receipt Dock",
      coordinate: "W / WNW",
      version: "Handoff proof",
      duty: "Receipt state",
      handoff: "Audit / next protocol"
    },
    "contract-seal": {
      gem: "Contract Seal",
      coordinate: "NW / NNW",
      version: "Three-file authority",
      duty: "Boundary lock",
      handoff: "Execution review"
    }
  });

  const state = {
    initialized: false,
    canvasApiDetected: false,
    currentMode: "body",
    currentChamber: "body-glass",
    currentLens: "platform",
    errors: []
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
    document.documentElement.dataset.audraliaUiError = message;
  }

  function getCanvasApi() {
    const api = window[API_NAME];
    const valid = Boolean(
      api &&
      typeof api.setMode === "function" &&
      typeof api.setFeed === "function" &&
      typeof api.resetView === "function" &&
      typeof api.status === "function"
    );

    state.canvasApiDetected = valid;
    document.documentElement.dataset.audraliaUiCanvasApiDetected = valid ? "true" : "false";

    return valid ? api : null;
  }

  function updateModeCopy(mode) {
    const copy = MODES[mode] || MODES.body;

    const title = $("[data-audralia-mode-title]");
    const status = $("[data-audralia-mode-status]");
    const platform = $("[data-audralia-mode-platform]");
    const engineering = $("[data-audralia-mode-engineering]");

    if (title) title.textContent = copy.title;
    if (status) status.textContent = copy.status;
    if (platform) platform.textContent = copy.platform;
    if (engineering) engineering.textContent = copy.engineering;
  }

  function setMode(mode) {
    const next = MODES[mode] ? mode : "body";
    state.currentMode = next;

    $all("[data-audralia-mode]").forEach((button) => {
      const active = button.dataset.audraliaMode === next;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    updateModeCopy(next);

    const api = getCanvasApi();
    if (api) {
      try {
        api.setMode(next);
      } catch (error) {
        recordError("canvas-set-mode", error);
      }
    }

    document.documentElement.dataset.audraliaUiMode = next;
    if (document.body) document.body.dataset.audraliaUiMode = next;

    publishReceipt("set-mode");
  }

  function selectLens(chamber, lens) {
    if (!chamber) return;

    const next = lens === "engineering" ? "engineering" : "platform";
    state.currentLens = next;

    $all("[data-lens-tab]", chamber).forEach((button) => {
      const active = button.dataset.lensTab === next;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    $all("[data-lens-pane]", chamber).forEach((pane) => {
      const active = pane.dataset.lensPane === next;
      pane.hidden = !active;
      pane.toggleAttribute("data-active", active);
    });

    chamber.dataset.activeLens = next;

    publishReceipt("select-lens");
  }

  function openChamber(id) {
    const chamber = document.getElementById(id);
    if (!chamber || chamber.tagName.toLowerCase() !== "details") return;

    state.currentChamber = id;

    $all("details[data-audralia-chamber]").forEach((item) => {
      item.open = item === chamber;
      item.toggleAttribute("data-active-chamber", item === chamber);
    });

    chamber.open = true;
    selectLens(chamber, "platform");

    $all("[data-gem-anchor]").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const active = href === `#${id}`;
      anchor.toggleAttribute("data-active-gem", active);
      anchor.setAttribute("aria-current", active ? "location" : "false");
    });

    history.replaceState(null, "", `#${id}`);

    requestAnimationFrame(() => {
      chamber.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    publishReceipt("open-chamber");
  }

  function returnToOrbit() {
    state.currentChamber = "";
    $all("[data-gem-anchor]").forEach((anchor) => {
      anchor.removeAttribute("data-active-gem");
      anchor.setAttribute("aria-current", "false");
    });

    document.documentElement.dataset.audraliaReturnToOrbit = "true";

    const orbit = $("#planet-orbit") || $("[data-audralia-planet-stage]");
    if (orbit) {
      requestAnimationFrame(() => {
        orbit.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    publishReceipt("return-to-orbit");
  }

  function bindModeButtons() {
    $all("[data-audralia-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.dataset.audraliaMode);
      });
    });

    setMode("body");
  }

  function bindTabs() {
    $all("[data-lens-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const chamber = button.closest("[data-audralia-chamber]");
        selectLens(chamber, button.dataset.lensTab);
      });
    });

    $all("[data-audralia-chamber]").forEach((chamber) => {
      selectLens(chamber, "platform");
    });
  }

  function bindGemNavigation() {
    $all("[data-gem-anchor]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href") || "";
        if (!href.startsWith("#")) return;

        const id = href.slice(1);
        if (!document.getElementById(id)) return;

        event.preventDefault();
        openChamber(id);
      });
    });
  }

  function bindReturnToOrbit() {
    $all(".return-orbit,[data-return-orbit]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (href === "#planet-orbit" || link.hasAttribute("data-return-orbit")) {
          event.preventDefault();
          returnToOrbit();
        }
      });
    });
  }

  function bindMenu() {
    const menu = $(".planet-menu");

    $all(".planet-menu-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        if (menu) menu.open = false;
      });
    });
  }

  function bindInspectButton() {
    const inspect = $("[data-audralia-inspect-planet]");
    if (!inspect) return;

    inspect.addEventListener("click", () => {
      const api = getCanvasApi();
      const status = api ? api.status() : null;
      const statusNode = $("[data-audralia-renderer-status]");

      if (statusNode) {
        statusNode.textContent = api
          ? `Canvas screen active · feed ${status.feed || "clay globe"} · mode ${status.currentMode || state.currentMode}`
          : "Fallback clay globe visible · canvas API not detected";
      }

      document.documentElement.dataset.audraliaPlanetInspection = api ? "canvas-api-detected" : "fallback-visible";
      publishReceipt("inspect");
    });
  }

  function bindResetView() {
    $all("[data-reset-canvas-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const api = getCanvasApi();
        if (!api) return;

        try {
          api.resetView();
          publishReceipt("reset-view");
        } catch (error) {
          recordError("reset-view", error);
        }
      });
    });
  }

  function hydrateMetadata() {
    Object.entries(CHAMBERS).forEach(([id, meta]) => {
      const chamber = document.getElementById(id);
      if (!chamber) return;

      const coordinate = $("[data-meta-coordinate]", chamber);
      const version = $("[data-meta-version]", chamber);
      const duty = $("[data-meta-duty]", chamber);
      const handoff = $("[data-meta-handoff]", chamber);

      if (coordinate) coordinate.textContent = meta.coordinate;
      if (version) version.textContent = meta.version;
      if (duty) duty.textContent = meta.duty;
      if (handoff) handoff.textContent = meta.handoff;

      chamber.dataset.coordinate = meta.coordinate;
      chamber.dataset.versionIdentity = meta.version;
      chamber.dataset.expressiveDuty = meta.duty;
      chamber.dataset.handoff = meta.handoff;
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
      anchor.dataset.gemNavigation = "true";
      anchor.dataset.modeControl = "false";
    });
  }

  function publishReceipt(scope = "status") {
    const api = getCanvasApi();
    let canvasStatus = null;

    if (api) {
      try {
        canvasStatus = api.status();
      } catch (error) {
        recordError("canvas-status", error);
      }
    }

    const payload = Object.freeze({
      contract: CONTRACT,
      canvasContract: CANVAS_CONTRACT,
      route: ROUTE,
      scope,
      uiRole: "REMOTE_CONTROL",
      canvasApiDetected: Boolean(api),
      currentMode: state.currentMode,
      currentChamber: state.currentChamber,
      currentLens: state.currentLens,
      gemsNavigation: true,
      modeControlsBound: true,
      platformEngineeringTabs: true,
      metadataCompressed: true,
      returnToOrbitBound: true,
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

    document.documentElement.dataset.audraliaUiContract = CONTRACT;
    document.documentElement.dataset.audraliaUiRole = "remote-control";
    document.documentElement.dataset.audraliaUiGemsNavigation = "true";
    document.documentElement.dataset.audraliaUiTabs = "platform-engineering";
    document.documentElement.dataset.audraliaUiMetadataCompressed = "true";
    document.documentElement.dataset.audraliaUiCanvasApiDetected = api ? "true" : "false";
    document.documentElement.dataset.audraliaUiActiveWater = "false";
    document.documentElement.dataset.audraliaUiFinalVisualPass = "false";

    return payload;
  }

  function exposeUiApi() {
    window.DGBAudraliaPlanetUI = Object.freeze({
      contract: CONTRACT,
      setMode,
      openChamber,
      returnToOrbit,
      selectLensById(chamberId, lens) {
        const chamber = document.getElementById(chamberId);
        selectLens(chamber, lens);
      },
      status() {
        return publishReceipt("status");
      }
    });
  }

  function initHash() {
    const hash = window.location.hash ? window.location.hash.slice(1) : "";
    if (hash && document.getElementById(hash)) {
      openChamber(hash);
      return;
    }

    const defaultChamber = $("#body-glass");
    if (defaultChamber && defaultChamber.matches("[data-audralia-chamber]")) {
      defaultChamber.open = true;
      selectLens(defaultChamber, "platform");
    }
  }

  function init() {
    try {
      exposeUiApi();
      hydrateMetadata();
      markGemReceipts();

      bindModeButtons();
      bindTabs();
      bindGemNavigation();
      bindReturnToOrbit();
      bindMenu();
      bindInspectButton();
      bindResetView();

      state.initialized = true;
      initHash();

      publishReceipt("init-complete");
    } catch (error) {
      recordError("init", error);
      state.initialized = true;
      publishReceipt("init-error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
