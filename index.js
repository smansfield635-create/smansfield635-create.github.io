/* TNT RENEWAL — /index.js
   ROOT INDEX JS · COMPASS COCKPIT BUTTON-BINDING RENEWAL B2

   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_CONTRACT = "root-compass-cockpit-b1"
   SOURCE_MARKER=ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1
   RENEWAL_MARKER=ROOT_COMPASS_COCKPIT_INDEX_JS_BINDING_REPAIR_B2

   PURPOSE:
     - Renew /index.js only.
     - Bind cockpit buttons directly and safely.
     - Preserve DGBIndexBoot.
     - Expose DGBCompassCockpit.
     - Preserve visible sun fallback.
     - Preserve canopy relationship.
     - Do not depend on /world/control.js.
     - Do not require module imports.
     - Do not move the galaxy/environment.
     - Reposition cockpit view posture relative to fixed field.

   REQUIRED GAUGE MARKERS:
     DGBSpineCanopy
     DGBCompassCockpit
     DGBIndexBoot
     ensureFallbackSun
     held-by-canopy
     root-compass-cockpit-b1
*/

(function () {
  "use strict";

  var VERSION = "root-compass-cockpit-b1";
  var RENEWAL = "ROOT_COMPASS_COCKPIT_INDEX_JS_BINDING_REPAIR_B2";
  var SOURCE_MARKER = "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var STATE_EVENT = "dgb:cockpit:viewchange";

  var VIEW_ORDER = [
    "cinematic",
    "wide",
    "local",
    "axis",
    "paths",
    "galaxy",
    "nebula",
    "control"
  ];

  var DEFAULT_TOGGLES = Object.freeze({
    planets: true,
    paths: false,
    axes: false,
    nebula: true,
    milkyWay: true,
    solarWind: true
  });

  var VIEW_COPY = Object.freeze({
    cinematic: {
      label: "Cinematic",
      status: "Compass Cockpit B1 · cinematic posture · fixed galaxy truth",
      narrative: "Cockpit settled into cinematic posture. The ship is reading the existing galaxy without moving the field.",
      posture: {
        scale: 1,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.72,
        axis: 0.08,
        paths: 0.12
      }
    },
    wide: {
      label: "Wide",
      status: "Compass Cockpit B1 · wide survey · scale pulled back",
      narrative: "Cockpit widened its observation cone. The galaxy remains fixed while the ship surveys more of the field.",
      posture: {
        scale: 0.92,
        tilt: "-0.7deg",
        panX: "0px",
        panY: "4px",
        hud: 0.62,
        axis: 0.08,
        paths: 0.13
      }
    },
    local: {
      label: "Local",
      status: "Compass Cockpit B1 · local solar proximity · sun spine protected",
      narrative: "Cockpit moved into local solar read. The sun spine remains protected while nearby pressure becomes easier to inspect.",
      posture: {
        scale: 1.035,
        tilt: "0.45deg",
        panX: "0px",
        panY: "0px",
        hud: 0.78,
        axis: 0.07,
        paths: 0.10
      }
    },
    axis: {
      label: "Axis",
      status: "Compass Cockpit B1 · Euclidean axis view · coordinate truth exposed",
      narrative: "Cockpit raised the coordinate grid. This view reads position and axis without pretending the environment moved.",
      posture: {
        scale: 0.98,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.88,
        axis: 0.33,
        paths: 0.10
      }
    },
    paths: {
      label: "Paths",
      status: "Compass Cockpit B1 · route lanes visible · orbital path read",
      narrative: "Cockpit opened path instrumentation. Travel lanes are visible as a navigation read over the same universe field.",
      posture: {
        scale: 0.96,
        tilt: "-1.2deg",
        panX: "0px",
        panY: "0px",
        hud: 0.86,
        axis: 0.16,
        paths: 0.38
      }
    },
    galaxy: {
      label: "Galaxy",
      status: "Compass Cockpit B1 · galaxy emphasis · external field fixed",
      narrative: "Cockpit pulled toward galactic emphasis. The Milky Way layer becomes legible while the ship changes posture around it.",
      posture: {
        scale: 0.90,
        tilt: "0.8deg",
        panX: "0px",
        panY: "6px",
        hud: 0.58,
        axis: 0.07,
        paths: 0.08
      }
    },
    nebula: {
      label: "Nebula",
      status: "Compass Cockpit B1 · nebula emphasis · environmental density read",
      narrative: "Cockpit tuned for nebula density. The view reads atmospheric color and depth without relocating the galaxy.",
      posture: {
        scale: 0.96,
        tilt: "-0.5deg",
        panX: "0px",
        panY: "0px",
        hud: 0.62,
        axis: 0.05,
        paths: 0.09
      }
    },
    control: {
      label: "Control",
      status: "Compass Cockpit B1 · instrument control · full HUD exposed",
      narrative: "Cockpit exposed control instrumentation. This is the technical view for verifying posture, toggles, and field protection.",
      posture: {
        scale: 0.99,
        tilt: "0deg",
        panX: "0px",
        panY: "0px",
        hud: 0.98,
        axis: 0.24,
        paths: 0.26
      }
    }
  });

  var REQUIRED_MARKERS = [
    'ROOT_BOOT_ID = "root-sun-asset-b1"',
    "DGBSpineCanopy",
    "DGBCompassCockpit",
    "DGBIndexBoot",
    "ensureFallbackSun",
    "held-by-canopy",
    "root-compass-cockpit-b1",
    "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1",
    "ROOT_COMPASS_COCKPIT_INDEX_JS_BINDING_REPAIR_B2"
  ];

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
    heldByCanopy: false,
    lastAction: "boot"
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]") || $(".page") || document.body;
  }

  function setText(selector, value) {
    var node = $(selector);
    if (node) node.textContent = String(value);
  }

  function setCssVar(node, name, value) {
    if (node && node.style) node.style.setProperty(name, String(value));
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function normalizeView(view) {
    var next = String(view || "").trim();
    return hasOwn(VIEW_COPY, next) ? next : "cinematic";
  }

  function normalizeToggleName(name) {
    var next = String(name || "").trim();

    if (hasOwn(DEFAULT_TOGGLES, next)) return next;
    if (next === "milkyway" || next === "milky_way" || next === "milky-way") return "milkyWay";
    if (next === "solarwind" || next === "solar_wind" || next === "solar-wind") return "solarWind";

    return null;
  }

  function readBooleanAttribute(node, name, fallback) {
    var value;

    if (!node) return Boolean(fallback);

    value = node.getAttribute(name);
    if (value === "true") return true;
    if (value === "false") return false;

    return Boolean(fallback);
  }

  function visibleNode(node) {
    var rect;
    var style;

    if (!node || !node.ownerDocument || !node.ownerDocument.defaultView) return false;

    rect = node.getBoundingClientRect();
    style = node.ownerDocument.defaultView.getComputedStyle(node);

    return Boolean(
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0
    );
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
    var root = rootNode();
    var mount = $("[data-dgb-sun-mount]");
    var fallback = ensureFallbackSun();
    var canvas = mount ? mount.querySelector("canvas") : null;
    var svg = mount ? mount.querySelector("svg") : null;

    state.rootPresent = Boolean(root);
    state.fallbackVisible = Boolean(fallback && visibleNode(fallback));
    state.canvasVisible = Boolean(canvas && visibleNode(canvas));
    state.svgVisible = Boolean(svg && visibleNode(svg));
    state.sunVisible = Boolean(
      mount &&
      (
        state.fallbackVisible ||
        state.canvasVisible ||
        state.svgVisible ||
        visibleNode(mount)
      )
    );

    if (mount && (canvas || svg)) {
      mount.setAttribute("data-runtime-mounted", "true");
    }

    return state.sunVisible;
  }

  function detectCanopyTruth() {
    var canopy = window.DGBSpineCanopy;
    var canopyState = null;

    if (canopy && typeof canopy.getPublicState === "function") {
      try {
        canopyState = canopy.getPublicState();
      } catch (error) {
        canopyState = null;
      }
    }

    state.canopyPresent = Boolean(canopy || canopyState);
    state.heldByCanopy = state.canopyPresent;

    return state.heldByCanopy;
  }

  function readInitialStateFromDom() {
    var root = rootNode();
    var body = document.body;
    var activeViewButton;
    var rootView;
    var bodyView;

    bodyView = body ? body.getAttribute("data-cockpit-view") : "";
    rootView = root ? root.getAttribute("data-cockpit-view") : "";
    activeViewButton = $("[data-cockpit-view-button][aria-pressed='true'], [data-cosmic-view-button][aria-pressed='true']");

    state.view = normalizeView(
      rootView ||
      bodyView ||
      (activeViewButton && (activeViewButton.getAttribute("data-cockpit-view-button") || activeViewButton.getAttribute("data-cosmic-view-button"))) ||
      "cinematic"
    );

    state.toggles.planets = readBooleanAttribute(body, "data-layer-planets", true);
    state.toggles.paths = readBooleanAttribute(body, "data-layer-paths", false);
    state.toggles.axes = readBooleanAttribute(body, "data-layer-axes", false);
    state.toggles.nebula = readBooleanAttribute(body, "data-layer-nebula", true);
    state.toggles.milkyWay = readBooleanAttribute(body, "data-layer-milkyway", true);
    state.toggles.solarWind = readBooleanAttribute(body, "data-layer-solarwind", true);

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      var key = normalizeToggleName(button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle"));
      if (!key) return;
      state.toggles[key] = button.getAttribute("aria-pressed") === "true";
    });
  }

  function applyDataset() {
    var root = rootNode();
    var body = document.body;

    if (body) {
      body.setAttribute("data-cockpit-view", state.view);
      body.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
      body.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
      body.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
      body.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
      body.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
      body.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");
    }

    if (root) {
      root.setAttribute("data-cockpit-view", state.view);
      root.setAttribute("data-cosmic-view", state.view);
      root.setAttribute("data-compass-cockpit", VERSION);
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", SOURCE_MARKER);
      root.setAttribute("data-js-renewal-marker", RENEWAL);

      root.setAttribute("data-layer-planets", state.toggles.planets ? "true" : "false");
      root.setAttribute("data-layer-paths", state.toggles.paths ? "true" : "false");
      root.setAttribute("data-layer-axes", state.toggles.axes ? "true" : "false");
      root.setAttribute("data-layer-nebula", state.toggles.nebula ? "true" : "false");
      root.setAttribute("data-layer-milkyway", state.toggles.milkyWay ? "true" : "false");
      root.setAttribute("data-layer-solarwind", state.toggles.solarWind ? "true" : "false");
    }
  }

  function applyCockpitPosture() {
    var root = rootNode();
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var posture = copy.posture || VIEW_COPY.cinematic.posture;

    setCssVar(root, "--cockpit-scale", posture.scale);
    setCssVar(root, "--cockpit-tilt", posture.tilt);
    setCssVar(root, "--cockpit-pan-x", posture.panX);
    setCssVar(root, "--cockpit-pan-y", posture.panY);
    setCssVar(root, "--hud-strength", posture.hud);
    setCssVar(root, "--axis-opacity", posture.axis);
    setCssVar(root, "--path-opacity", posture.paths);
  }

  function setButtonPressed(button, pressed) {
    if (!button) return;

    button.setAttribute("aria-pressed", pressed ? "true" : "false");

    if (pressed) {
      button.setAttribute("data-active", "true");
    } else {
      button.removeAttribute("data-active");
    }
  }

  function applyButtonState() {
    $all("[data-cockpit-view-button], [data-cosmic-view-button]").forEach(function (button) {
      var view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
      setButtonPressed(button, normalizeView(view) === state.view);
    });

    $all("[data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      var key = normalizeToggleName(button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle"));
      setButtonPressed(button, key ? Boolean(state.toggles[key]) : false);
    });
  }

  function applyNarrative() {
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    var status = copy.status;

    if (!state.sunVisible) {
      status = status + " · visible sun fallback required";
    }

    if (!state.heldByCanopy) {
      status = status + " · canopy pending";
    }

    setText("[data-cockpit-view-label]", state.view);
    setText("[data-cosmic-control-view]", state.view);
    setText("[data-cockpit-mode-pill]", copy.label);
    setText("[data-cockpit-narrative]", copy.narrative);
    setText("[data-cockpit-status]", status);
    setText("[data-cosmic-control-status]", status);
    setText("[data-door-boot-status]", state.heldByCanopy ? "Held by canopy" : "Visible-first fallback active");
  }

  function enforceModeSideEffects(view) {
    if (view === "axis") {
      state.toggles.axes = true;
    }

    if (view === "paths") {
      state.toggles.paths = true;
    }

    if (view === "galaxy") {
      state.toggles.milkyWay = true;
    }

    if (view === "nebula") {
      state.toggles.nebula = true;
    }

    if (view === "control") {
      state.toggles.axes = true;
      state.toggles.paths = true;
      state.toggles.planets = true;
    }

    if (view === "local") {
      state.toggles.planets = true;
    }
  }

  function sync(options) {
    detectSunTruth();
    detectCanopyTruth();
    applyDataset();
    applyCockpitPosture();
    applyButtonState();
    applyNarrative();

    if (!options || options.dispatch !== false) {
      dispatchState();
    }
  }

  function applyView(view, options) {
    var next = normalizeView(view);

    state.view = next;
    state.lastAction = "view:" + next;

    enforceModeSideEffects(next);
    sync(options);
  }

  function toggleLayer(name, options) {
    var key = normalizeToggleName(name);

    if (!key) return;

    state.toggles[key] = !state.toggles[key];
    state.lastAction = "toggle:" + key;

    sync(options);
  }

  function setLayer(name, value, options) {
    var key = normalizeToggleName(name);

    if (!key) return;

    state.toggles[key] = Boolean(value);
    state.lastAction = "set:" + key;

    sync(options);
  }

  function actionFromButton(button) {
    var view;
    var toggle;

    if (!button) return false;

    view = button.getAttribute("data-cockpit-view-button") || button.getAttribute("data-cosmic-view-button");
    toggle = button.getAttribute("data-cockpit-toggle") || button.getAttribute("data-cosmic-toggle");

    if (view) {
      applyView(view);
      return true;
    }

    if (toggle) {
      toggleLayer(toggle);
      return true;
    }

    return false;
  }

  function findActionButton(target) {
    if (!target || !target.closest) return null;

    return target.closest(
      "[data-cockpit-view-button], [data-cosmic-view-button], [data-cockpit-toggle], [data-cosmic-toggle]"
    );
  }

  function delegatedCaptureHandler(event) {
    var button = findActionButton(event.target);

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    actionFromButton(button);
  }

  function directButtonHandler(event) {
    var button = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    actionFromButton(button);
  }

  function bindControls() {
    document.addEventListener("click", delegatedCaptureHandler, true);

    $all("[data-cockpit-view-button], [data-cosmic-view-button], [data-cockpit-toggle], [data-cosmic-toggle]").forEach(function (button) {
      if (button.__dgbCockpitBound) return;

      button.__dgbCockpitBound = true;
      button.addEventListener("click", directButtonHandler, false);
    });
  }

  function installRuntimeObserver() {
    var root = rootNode();
    var mount = $("[data-dgb-sun-mount]");

    if (mount && typeof MutationObserver !== "undefined" && !mount.__dgbCockpitObserver) {
      mount.__dgbCockpitObserver = true;

      new MutationObserver(function () {
        sync();
      }).observe(mount, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    if (root && typeof MutationObserver !== "undefined" && !root.__dgbCockpitRootObserver) {
      root.__dgbCockpitRootObserver = true;

      new MutationObserver(function () {
        applyButtonState();
        applyCockpitPosture();
        applyNarrative();
      }).observe(root, {
        attributes: true,
        attributeFilter: ["data-cockpit-view", "data-cosmic-view"]
      });
    }
  }

  function schedulePostRuntimeSync() {
    window.requestAnimationFrame(function () {
      sync({ dispatch: false });
    });

    [80, 250, 750, 1500].forEach(function (delay) {
      window.setTimeout(function () {
        bindControls();
        sync({ dispatch: false });
      }, delay);
    });
  }

  function dispatchState() {
    try {
      window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: getPublicState() }));
    } catch (error) {
      /* no-op */
    }
  }

  function getCameraPosture() {
    var copy = VIEW_COPY[state.view] || VIEW_COPY.cinematic;
    return {
      view: state.view,
      label: copy.label,
      posture: {
        scale: copy.posture.scale,
        tilt: copy.posture.tilt,
        panX: copy.posture.panX,
        panY: copy.posture.panY,
        hud: copy.posture.hud,
        axis: copy.posture.axis,
        paths: copy.posture.paths
      },
      truth: "cockpit_repositions_relative_to_fixed_environment"
    };
  }

  function getPublicState() {
    return {
      version: VERSION,
      renewal: RENEWAL,
      sourceMarker: SOURCE_MARKER,
      rootBootId: ROOT_BOOT_ID,
      canopyVersion: CANOPY_VERSION,
      status: "held-by-canopy",
      view: state.view,
      lastAction: state.lastAction,
      cameraPosture: getCameraPosture(),
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
      falseHealthBlocked: true,
      environmentMoved: false,
      cockpitRepositioned: true,
      sourceMarkers: REQUIRED_MARKERS.slice(),
      viewOrder: VIEW_ORDER.slice()
    };
  }

  function exposePublicApi() {
    window.DGBIndexBoot = {
      version: VERSION,
      renewal: RENEWAL,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyView: applyView,
      toggleLayer: toggleLayer,
      setLayer: setLayer,
      sync: sync,
      getPublicState: getPublicState
    };

    window.DGBCompassCockpit = {
      version: VERSION,
      renewal: RENEWAL,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyView: applyView,
      toggleLayer: toggleLayer,
      setLayer: setLayer,
      sync: sync,
      getCameraPosture: getCameraPosture,
      getPublicState: getPublicState
    };
  }

  function boot() {
    var root = rootNode();

    if (root) {
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", SOURCE_MARKER);
      root.setAttribute("data-js-renewal-marker", RENEWAL);
      root.setAttribute("data-compass-cockpit", VERSION);
    }

    readInitialStateFromDom();
    ensureFallbackSun();
    exposePublicApi();
    bindControls();
    installRuntimeObserver();
    sync({ dispatch: false });
    schedulePostRuntimeSync();
    dispatchState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
