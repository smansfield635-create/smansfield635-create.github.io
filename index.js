/* TNT RENEWAL — /index.js
   ROOT INDEX JS · GENERATION 2 COMPASS · SIMPLE FILTER + SATELLITE SUN B8
   SOURCE_MARKER=ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1
   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_VERSION = "root-compass-cockpit-b1"

   PURPOSE:
     - Preserve current passing Compass page contract.
     - Bind the three-option world filter.
     - Preserve DGBIndexBoot.
     - Preserve DGBCompassCockpit.
     - Call DGBSunAssetRuntime when available.
     - Do not draw the sun here.
     - Do not create a graphic box.
     - Keep gauges-readable markers:
       DGBSpineCanopy
       ensureFallbackSun
       held-by-canopy
       root-compass-cockpit-b1
*/

(function () {
  "use strict";

  var VERSION = "root-sun-asset-b1-satellite-sun-b8";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var SUN_RUNTIME_NAME = "DGBSunAssetRuntime";
  var STATE_EVENT = "dgb:cockpit:viewchange";

  var REQUIRED_MARKERS = [
    'ROOT_BOOT_ID = "root-sun-asset-b1"',
    "DGBSpineCanopy",
    "ensureFallbackSun",
    "held-by-canopy",
    "root-compass-cockpit-b1",
    "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1"
  ];

  var FILTER_COPY = {
    flat: {
      title: "Flat view: what is right in front of me?",
      text: "Start with the surface. What is visible, immediate, and practical? This is the fastest way to stop spinning and take the next step.",
      one: "Simple view active",
      two: "Surface first",
      three: "Protected view active",
      view: "cinematic",
      mode: "Flat"
    },
    round: {
      title: "Round view: how are the pieces connected?",
      text: "Now look for relationship. What keeps circling back? What affects what? This view helps you see the pattern instead of chasing one loose piece.",
      one: "Pattern view active",
      two: "Connections visible",
      three: "Protected view active",
      view: "paths",
      mode: "Round"
    },
    globe: {
      title: "Globe view: what is the whole system doing?",
      text: "Now zoom all the way out. What is the full field? What direction is the system moving? This view is for decisions that need the whole picture.",
      one: "Whole-field view active",
      two: "Big picture visible",
      three: "Protected view active",
      view: "galaxy",
      mode: "Globe"
    }
  };

  var state = {
    booted: false,
    filter: "flat",
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

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]");
  }

  function sunMount() {
    return $("[data-dgb-sun-mount]");
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function setTextSelector(selector, value) {
    var node = $(selector);
    if (node) node.textContent = value;
  }

  function setPressed(node, pressed) {
    if (!node) return;

    node.setAttribute("aria-pressed", pressed ? "true" : "false");

    if (pressed) node.setAttribute("data-active", "true");
    else node.removeAttribute("data-active");
  }

  function ensureFallbackSun() {
    var mount = sunMount();
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
    var mount = sunMount();
    var fallback = ensureFallbackSun();
    var canvas = mount ? mount.querySelector("canvas") : null;
    var svg = mount ? mount.querySelector("svg") : null;

    state.rootPresent = Boolean(root);
    state.fallbackVisible = Boolean(fallback);
    state.canvasVisible = Boolean(canvas);
    state.svgVisible = Boolean(svg);
    state.sunVisible = Boolean(mount && (fallback || canvas || svg));

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

  function applyDataset(packet) {
    var root = rootNode();

    document.body.setAttribute("data-world-filter", state.filter);
    document.body.setAttribute("data-cockpit-view", packet.view);

    if (root) {
      root.setAttribute("data-world-filter", state.filter);
      root.setAttribute("data-cockpit-view", packet.view);
      root.setAttribute("data-cockpit-label", packet.mode);
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1");
    }
  }

  function applyButtons() {
    all("[data-world-filter-button]").forEach(function (button) {
      setPressed(button, button.getAttribute("data-world-filter-button") === state.filter);
    });

    all("[data-filter]").forEach(function (button) {
      setPressed(button, button.getAttribute("data-filter") === state.filter);
    });
  }

  function applyFilter(name, options) {
    var next = FILTER_COPY[name] ? name : "flat";
    var packet = FILTER_COPY[next];

    state.filter = next;

    applyDataset(packet);
    applyButtons();

    setText("resultTitle", packet.title);
    setText("resultText", packet.text);
    setText("stateOne", packet.one);
    setText("stateTwo", packet.two);
    setText("stateThree", packet.three);

    setTextSelector("[data-cockpit-view-label]", packet.view);
    setTextSelector("[data-cockpit-mode-pill]", packet.mode);
    setTextSelector("[data-cockpit-narrative]", "The field stays steady while the filter changes.");
    setTextSelector("[data-cockpit-status]", "Compass filter active · satellite sun spine protected");

    setTextSelector("[data-door-boot-status]", state.heldByCanopy ? "Protected view active" : "Visible-first fallback active");

    detectSunTruth();
    detectCanopyTruth();

    if (!options || options.dispatch !== false) {
      dispatchState();
    }
  }

  function bindFilters() {
    all("[data-world-filter-button]").forEach(function (button) {
      if (button.__dgbWorldFilterBound) return;
      button.__dgbWorldFilterBound = true;

      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-world-filter-button"));
      });
    });

    all("[data-filter]").forEach(function (button) {
      if (button.__dgbFilterBound) return;
      button.__dgbFilterBound = true;

      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-filter"));
      });
    });
  }

  function startSunRuntime() {
    if (!window[SUN_RUNTIME_NAME] || typeof window[SUN_RUNTIME_NAME].start !== "function") {
      return false;
    }

    try {
      window[SUN_RUNTIME_NAME].start({
        selector: "[data-dgb-sun-mount]",
        animate: false,
        seed: 4217,
        intensity: 0.98
      }).then(function () {
        detectSunTruth();
        dispatchState();
      }).catch(function () {
        detectSunTruth();
        dispatchState();
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  function retrySunRuntime() {
    startSunRuntime();
    window.setTimeout(startSunRuntime, 120);
    window.setTimeout(startSunRuntime, 420);
    window.setTimeout(startSunRuntime, 1000);
  }

  function dispatchState() {
    try {
      window.dispatchEvent(new CustomEvent(STATE_EVENT, {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  function getPublicState() {
    return {
      version: VERSION,
      sourceMarker: "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1",
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      canopyVersion: CANOPY_VERSION,
      status: "held-by-canopy",
      filter: state.filter,
      view: FILTER_COPY[state.filter] ? FILTER_COPY[state.filter].view : "cinematic",
      rootPresent: state.rootPresent,
      sunVisible: state.sunVisible,
      fallbackVisible: state.fallbackVisible,
      canvasVisible: state.canvasVisible,
      svgVisible: state.svgVisible,
      canopyPresent: state.canopyPresent,
      heldByCanopy: state.heldByCanopy,
      sunRuntimePresent: Boolean(window[SUN_RUNTIME_NAME]),
      sourceMarkers: REQUIRED_MARKERS.slice()
    };
  }

  function exposePublicApi() {
    window.DGBIndexBoot = {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyFilter: applyFilter,
      applyView: function (view) {
        if (view === "paths") return applyFilter("round");
        if (view === "galaxy") return applyFilter("globe");
        return applyFilter("flat");
      },
      getPublicState: getPublicState
    };

    window.DGBCompassCockpit = {
      version: COCKPIT_VERSION,
      indexVersion: VERSION,
      rootBootId: ROOT_BOOT_ID,
      status: "held-by-canopy",
      ensureFallbackSun: ensureFallbackSun,
      applyFilter: applyFilter,
      applyView: window.DGBIndexBoot.applyView,
      getPublicState: getPublicState
    };
  }

  function boot() {
    var root = rootNode();

    state.booted = true;

    if (root) {
      root.setAttribute("data-index-boot", VERSION);
      root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
      root.setAttribute("data-canopy-relationship", "held-by-canopy");
      root.setAttribute("data-js-source-marker", "ROOT_COMPASS_COCKPIT_GENERATION_2_JS_SOURCE_MARKER_B1");
    }

    ensureFallbackSun();
    detectSunTruth();
    detectCanopyTruth();
    exposePublicApi();
    bindFilters();
    applyFilter(document.body.getAttribute("data-world-filter") || "flat", { dispatch: false });
    retrySunRuntime();
    dispatchState();
  }

  exposePublicApi();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
