(function () {
  "use strict";

  var VERSION = "root-compass-cockpit-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var STATE_EVENT = "dgb:cockpit:viewchange";

  var REQUIRED_MARKERS = [
    'ROOT_BOOT_ID = "root-sun-asset-b1"',
    "DGBSpineCanopy",
    "ensureFallbackSun",
    "held-by-canopy",
    "root-compass-cockpit-b1"
  ];

  var VIEW_COPY = {
    cinematic: {
      label: "Cinematic",
      status: "Compass Cockpit B1 · cinematic posture · fixed galaxy truth",
      narrative: "Cockpit settled into cinematic posture. The ship is reading the existing galaxy without moving the field."
    },
    wide: {
      label: "Wide",
      status: "Compass Cockpit B1 · wide survey · scale pulled back",
      narrative: "Cockpit widened its observation cone. The galaxy remains fixed while the ship surveys more of the field."
    },
    local: {
      label: "Local",
      status: "Compass Cockpit B1 · local solar proximity · sun spine protected",
      narrative: "Cockpit moved into local solar read. The sun spine remains protected while nearby pressure becomes easier to inspect."
    },
    axis: {
      label: "Axis",
      status: "Compass Cockpit B1 · Euclidean axis view · coordinate truth exposed",
      narrative: "Cockpit raised the coordinate grid. This view reads position and axis without pretending the environment moved."
    },
    paths: {
      label: "Paths",
      status: "Compass Cockpit B1 · route lanes visible · orbital path read",
      narrative: "Cockpit opened path instrumentation. Travel lanes are visible as a navigation read over the same universe field."
    },
    galaxy: {
      label: "Galaxy",
      status: "Compass Cockpit B1 · galaxy emphasis · external field fixed",
      narrative: "Cockpit pulled toward galactic emphasis. The Milky Way layer becomes legible while the ship changes posture around it."
    },
    nebula: {
      label: "Nebula",
      status: "Compass Cockpit B1 · nebula emphasis · environmental density read",
      narrative: "Cockpit tuned for nebula density. The view reads atmospheric color and depth without relocating the galaxy."
    },
    control: {
      label: "Control",
      status: "Compass Cockpit B1 · instrument control · full HUD exposed",
      narrative: "Cockpit exposed control instrumentation. This is the technical view for verifying posture, toggles, and field protection."
    }
  };

  var DEFAULT_TOGGLES = {
    planets: true,
    paths: false,
    axes: false,
    nebula: true,
    milkyWay: true,
    solarWind: true
  };

  var state = {
    view: "cinematic",
    toggles: {
      planets: true,
      paths: false,
      axes: false,
      nebula: true,
      milkyWay: true,
      solarWind: true
    },
    rootPresent: false,
    sunVisible: false,
    fallbackVisible: false,
    canvasVisible: false,
    svgVisible: false,
    canopyPresent: false,
    heldByCanopy: false
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(selector, value) {
    var node = $(selector);
    if (node) node.textContent = value;
  }

  function boolAttr(node, name, value) {
    if (node) node.setAttribute(name, value ? "true" : "false");
  }

  function normalizeView(view) {
    return VIEW_COPY[view] ? view : "cinematic";
  }

  function normalizeToggleName(name) {
    if (Object.prototype.hasOwnProperty.call(DEFAULT_TOGGLES, name)) return name;
    if (name === "milkyway") return "milkyWay";
    if (name === "milky_way") return "milkyWay";
    if (name === "solarwind") return "solarWind";
    if (name === "solar_wind") return "solarWind";
    return null;
  }

  function ensureFallbackSun() {
    var mount = $("[data-dgb-sun-mount]");
    var fallback;

    if (!mount) return null;

    fallback = mount.querySelector("[data-sun-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.className = "sun-fallback";
      fallback.setAttribute("data-sun-fallback", "");
      fallback.setAttribute("aria-hidden", "true");
      mount.appendChild(fallback);
    }

    return fallback;
  }

  function detectSunTruth() {
    var root = $("#door-root") || $("[data-root-door]");
    var mount = $("[data-dgb-sun-mount]");
    var fallback = ensureFallbackSun();
    var canvas = mount ? mount.querySelector("canvas") : null;
    var svg = mount ? mount.querySelector("svg") : null;
    var fallbackVisible = Boolean(fallback);
    var canvasVisible = Boolean(canvas);
    var svgVisible = Boolean(svg);
    var sunVisible = Boolean(mount && (fallbackVisible || canvasVisible || svgVisible));

    if (mount && (canvasVisible || svgVisible)) {
      mount.setAttribute("data-runtime-mounted", "true");
    }

    state.rootPresent = Boolean(root);
    state.fallbackVisible = fallbackVisible;
    state.canvasVisible = canvasVisible;
    state.svgVisible = svgVisible;
    state.sunVisible = sunVisible;

    return sunVisible;
  }

  function detectCanopyTruth() {
    var canopy = window.DGBSpineCanopy;
    var canopyState = null;
    var held = false;

    if (canopy && typeof canopy.getPublicState === "function") {
      try {
        canopyState = canopy.getPublicState();
      } catch (error) {
        canopyState = null;
      }
    }

    held = Boolean(canopy || canopyState);

    state.canopyPresent = held;
    state.heldByCanopy = held;

    return held;
  }

  function applyLayerDataset() {
    var root = $("#door-root") || document.body;
    var body = document.body;

    Object.keys(state.toggles).forEach(function (key) {
      var datasetName = "layer" + key.charAt(0).toUpperCase() + key.slice(1);
      if (key === "milkyWay") datasetName = "layerMilkyway";
      if (key === "solarWind") datasetName = "layerSolarwind";

      body.dataset[datasetName] = state.toggles[key] ? "true" : "false";
      if (root) root.dataset[datasetName] = state.toggles[key] ? "true" : "false";
    });

    body.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
    body.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
    body.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
    body.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
    body.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
    body.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");

    if (root) {
      root.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
      root.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
      root.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
      root.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
      root.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
      root.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");
    }
  }

  function applyButtonState() {
    $all("[data-cockpit-view-button], [data-cosmic-view-button]").forEach(function (button) {
      var view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
      boolAttr(button, "aria-pressed", view === state.view);
      if (view === state.view) {
        button.setAttribute("data-active", "true");
      } else {
        button.removeAttribute("data-active");
      }
    });

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      var raw = button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle");
      var name = normalizeToggleName(raw);
      var active = name ? Boolean(state.toggles[name]) : false;

      boolAttr(button, "aria-pressed", active);
      if (active) {
        button.setAttribute("data-active", "true");
      } else {
        button.removeAttribute("data-active");
      }
    });
  }

  function applyNarrative() {
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var status = copy.status;

    if (!state.sunVisible) {
      status = status + " · visible sun fallback required";
    }

    setText("[data-cockpit-view-label]", state.view);
    setText("[data-cosmic-control-view]", state.view);
    setText("[data-cockpit-mode-pill]", copy.label);
    setText("[data-cockpit-narrative]", copy.narrative);
    setText("[data-cockpit-status]", status);
    setText("[data-cosmic-control-status]", status);
    setText("[data-door-boot-status]", state.heldByCanopy ? "Held by canopy" : "Visible-first fallback active");
  }

  function dispatchState() {
    var detail = getPublicState();

    try {
      window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: detail }));
    } catch (error) {
      /* no-op */
    }
  }

  function applyView(view, options) {
    var root = $("#door-root") || document.body;
    var next = normalizeView(view);
    var copy;

    state.view = next;
    copy = VIEW_COPY[next] || VIEW_COPY.cinematic;

    document.body.setAttribute("data-cockpit-view", next);

    if (root) {
      root.setAttribute("data-cockpit-view", next);
      root.setAttribute("data-cosmic-view", next);
      root.setAttribute("data-cockpit-label", copy.label);
    }

    if (next === "axis") {
      state.toggles.axes = true;
    }

    if (next === "paths") {
      state.toggles.paths = true;
    }

    if (next === "galaxy") {
      state.toggles.milkyWay = true;
    }

    if (next === "nebula") {
      state.toggles.nebula = true;
    }

    if (next === "control") {
      state.toggles.axes = true;
      state.toggles.paths = true;
    }

    detectSunTruth();
    detectCanopyTruth();
    applyLayerDataset();
    applyButtonState();
    applyNarrative();

    if (!options || options.dispatch !== false) {
      dispatchState();
    }
  }

  function toggleLayer(name) {
    var key = normalizeToggleName(name);
    if (!key) return;

    state.toggles[key] = !state.toggles[key];

    detectSunTruth();
    detectCanopyTruth();
    applyLayerDataset();
    applyButtonState();
    applyNarrative();
    dispatchState();
  }

  function bindControls() {
    $all("[data-cockpit-view-button], [data-cosmic-view-button]").forEach(function (button) {
      if (button.__dgbCockpitViewBound) return;
      button.__dgbCockpitViewBound = true;

      button.addEventListener("click", function () {
        var view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
        applyView(view);
      });
    });

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      if (button.__dgbCockpitToggleBound) return;
      button.__dgbCockpitToggleBound = true;

      button.addEventListener("click", function () {
        var name = button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle");
        toggleLayer(name);
      });
    });
  }

  function installRuntimeObserver() {
    var mount = $("[data-dgb-sun-mount]");

    if (!mount || typeof MutationObserver === "undefined") return;

    if (mount.__dgbCockpitObserver) return;
    mount.__dgbCockpitObserver = true;

    new MutationObserver(function () {
      detectSunTruth();
      applyNarrative();
      dispatchState();
    }).observe(mount, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  function getPublicState() {
    return {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canopyVersion: CANOPY_VERSION,
      view: state.view,
      toggles: {
        planets: state.toggles.planets,
        paths: state.toggles.paths,
        axes: state.toggles.axes,
        nebula: state.toggles.nebula,
        milkyWay: state.toggles.milkyWay,
        solarWind: state.toggles.solarWind
      },
      rootPresent: state.rootPresent,
      sunVisible: state.sunVisible,
      fallbackVisible: state.fallbackVisible,
      canvasVisible: state.canvasVisible,
      svgVisible: state.svgVisible,
      canopyPresent: state.canopyPresent,
      heldByCanopy: state.heldByCanopy,
      sourceMarkers: REQUIRED_MARKERS.slice()
    };
  }

  function exposePublicApi() {
    window.DGBIndexBoot = {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyView: applyView,
      toggleLayer: toggleLayer,
      getPublicState: getPublicState
    };

    window.DGBCompassCockpit = {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      applyView: applyView,
      toggleLayer: toggleLayer,
      ensureFallbackSun: ensureFallbackSun,
      getPublicState: getPublicState
    };
  }

  function boot() {
    var root = $("#door-root") || $("[data-root-door]");

    if (root) {
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
    }

    ensureFallbackSun();
    detectSunTruth();
    detectCanopyTruth();
    exposePublicApi();
    bindControls();
    installRuntimeObserver();
    applyView("cinematic", { dispatch: false });
    dispatchState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
