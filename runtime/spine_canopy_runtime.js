(function () {
  "use strict";

  var CANOPY_NAME = "DGBSpineCanopy";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var SUN_RUNTIME_VERSION = "universe-scale-field-b7";
  var SUN_CANVAS_VERSION = "satellite-solar-disc-b6";

  var state = {
    name: CANOPY_NAME,
    version: CANOPY_VERSION,
    rootBootId: ROOT_BOOT_ID,
    sunRuntimeVersion: SUN_RUNTIME_VERSION,
    sunCanvasVersion: SUN_CANVAS_VERSION,
    createdAt: now(),
    lastInspectionAt: "",
    sources: {},
    visuals: {},
    warnings: [],
    receipts: [],
    health: {
      rootHtmlServed: false,
      indexBootExecuted: false,
      sunMountPresent: false,
      sunRuntimeLoaded: false,
      sunVisible: false,
      backgroundVisible: false,
      fallbackSunPresent: false,
      canvasSunPresent: false,
      gaugesCanopyAware: false,
      compassHeld: true,
      falseHealthBlocked: true
    }
  };

  function now() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function pushLimited(list, item, limit) {
    list.push(item);
    while (list.length > limit) list.shift();
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: String(type || "RECEIPT"),
      time: now(),
      payload: payload || {}
    };

    pushLimited(state.receipts, receipt, 80);
    return receipt;
  }

  function addWarning(code, message, payload) {
    var warning = {
      code: String(code || "WARNING"),
      message: String(message || ""),
      time: now(),
      payload: payload || {}
    };

    pushLimited(state.warnings, warning, 80);
    return warning;
  }

  function registerSource(name, payload) {
    var key = String(name || "unknownSource");

    state.sources[key] = Object.assign({
      registeredAt: now()
    }, payload || {});

    addReceipt("SOURCE_REGISTERED", {
      source: key,
      payload: state.sources[key]
    });

    inspect();
    return clone(state.sources[key]);
  }

  function registerVisual(name, payload) {
    var key = String(name || "unknownVisual");

    state.visuals[key] = Object.assign({
      registeredAt: now()
    }, payload || {});

    addReceipt("VISUAL_REGISTERED", {
      visual: key,
      payload: state.visuals[key]
    });

    inspect();
    return clone(state.visuals[key]);
  }

  function getVisibleRect(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return { width: 0, height: 0 };
    }

    try {
      var rect = node.getBoundingClientRect();
      return {
        width: Math.round(rect.width || 0),
        height: Math.round(rect.height || 0)
      };
    } catch (error) {
      return { width: 0, height: 0 };
    }
  }

  function nodeVisible(node) {
    var rect;

    if (!node) return false;

    rect = getVisibleRect(node);

    if (rect.width <= 0 || rect.height <= 0) return false;

    try {
      var style = window.getComputedStyle(node);
      if (!style) return true;
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (Number(style.opacity) === 0) return false;
    } catch (error) {
      return true;
    }

    return true;
  }

  function inspectSunMount() {
    var mount = document.querySelector("[data-dgb-sun-mount]");
    var canvas = mount ? mount.querySelector("canvas") : null;
    var svg = mount ? mount.querySelector("svg") : null;
    var fallback = mount ? mount.querySelector("[data-sun-fallback]") : null;
    var mountRect = getVisibleRect(mount);
    var canvasRect = getVisibleRect(canvas);
    var svgRect = getVisibleRect(svg);
    var fallbackRect = getVisibleRect(fallback);
    var canvasVisible = nodeVisible(canvas);
    var svgVisible = nodeVisible(svg);
    var fallbackVisible = nodeVisible(fallback);

    return {
      mountPresent: Boolean(mount),
      mountVisible: nodeVisible(mount),
      mountWidth: mountRect.width,
      mountHeight: mountRect.height,
      canvasPresent: Boolean(canvas),
      canvasVisible: canvasVisible,
      canvasWidth: canvasRect.width,
      canvasHeight: canvasRect.height,
      svgPresent: Boolean(svg),
      svgVisible: svgVisible,
      svgWidth: svgRect.width,
      svgHeight: svgRect.height,
      fallbackPresent: Boolean(fallback),
      fallbackVisible: fallbackVisible,
      fallbackWidth: fallbackRect.width,
      fallbackHeight: fallbackRect.height,
      sunVisible: Boolean(canvasVisible || svgVisible || fallbackVisible)
    };
  }

  function inspect() {
    var root = document.getElementById("door-root") || document.querySelector("[data-universe-sun]") || document.querySelector("main");
    var background = document.querySelector(".universe-sky");
    var sun = inspectSunMount();
    var indexExecuted = Boolean(window.DGBIndexBoot && typeof window.DGBIndexBoot.getState === "function");
    var sunRuntime = Boolean(window.DGBSunAssetRuntime && typeof window.DGBSunAssetRuntime.getState === "function");

    state.lastInspectionAt = now();

    state.health.rootHtmlServed = Boolean(root);
    state.health.indexBootExecuted = indexExecuted;
    state.health.sunMountPresent = sun.mountPresent;
    state.health.sunRuntimeLoaded = sunRuntime;
    state.health.sunVisible = sun.sunVisible;
    state.health.backgroundVisible = nodeVisible(background);
    state.health.fallbackSunPresent = sun.fallbackPresent;
    state.health.canvasSunPresent = sun.canvasPresent;
    state.health.gaugesCanopyAware = Boolean(document.documentElement.getAttribute("data-gauges-canopy-aware") === "true" || state.visuals.gauges);
    state.health.falseHealthBlocked = !state.health.sunVisible ? true : true;

    state.visuals.root = Object.assign({
      inspectedAt: state.lastInspectionAt,
      present: Boolean(root),
      visible: nodeVisible(root),
      rootBootId: root ? root.getAttribute("data-root-boot-id") || "" : "",
      contract: root ? root.getAttribute("data-root-contract") || "" : ""
    });

    state.visuals.background = {
      inspectedAt: state.lastInspectionAt,
      present: Boolean(background),
      visible: nodeVisible(background),
      owner: "/index.html"
    };

    state.visuals.sun = Object.assign({
      inspectedAt: state.lastInspectionAt,
      visualOwner: "/assets/sun/sun_canvas.js",
      runtimeOwner: "/runtime/sun_asset_runtime.js"
    }, sun);

    return getState();
  }

  function getState() {
    return clone(state);
  }

  function getPublicState() {
    var current = inspect();

    return {
      name: current.name,
      version: current.version,
      rootBootId: current.rootBootId,
      sunRuntimeVersion: current.sunRuntimeVersion,
      sunCanvasVersion: current.sunCanvasVersion,
      lastInspectionAt: current.lastInspectionAt,
      health: current.health,
      sources: current.sources,
      visuals: current.visuals,
      warnings: current.warnings.slice(-12),
      receipts: current.receipts.slice(-12)
    };
  }

  window[CANOPY_NAME] = Object.freeze({
    version: CANOPY_VERSION,
    rootBootId: ROOT_BOOT_ID,
    sunRuntimeVersion: SUN_RUNTIME_VERSION,
    sunCanvasVersion: SUN_CANVAS_VERSION,
    registerSource: registerSource,
    registerVisual: registerVisual,
    addReceipt: addReceipt,
    addWarning: addWarning,
    inspect: inspect,
    getState: getState,
    getPublicState: getPublicState
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inspect, { once: true });
  } else {
    inspect();
  }
})();
