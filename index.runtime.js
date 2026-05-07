/* /index.runtime.js
   COMPASS_INTERPLANETARY_UNIFORMITY_RUNTIME_TNT_v1
   Full-file replacement.
   Purpose:
   - Runtime layer for the Compass public command surface.
   - Coordinates interplanetary background compatibility with foreground Compass orbit instrumentation.
   - Audits inner/outer route nodes and publishes runtime receipts.
   - Does not render planets.
   - Does not create canvas.
   - Does not touch Gauges logic.
   - Does not use image generation.
   - Does not use GraphicBox.
   - Does not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_INTERPLANETARY_UNIFORMITY_RUNTIME_TNT_v1";
  var PAGE_CONTRACT = "COMPASS_INTERPLANETARY_4_PLUS_16_COMMAND_SURFACE_TNT_v6";
  var PREVIOUS_RUNTIME = "G5_COMPASS_ROUTE_ONLY_VIEW_CARRY_TNT_v1";
  var BACKGROUND_CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  var state = {
    contract: CONTRACT,
    pageContract: PAGE_CONTRACT,
    previousRuntime: PREVIOUS_RUNTIME,
    route: "/",
    room: "compass",
    backgroundContract: BACKGROUND_CONTRACT,
    innerNodes: 0,
    outerNodes: 0,
    totalNodes: 0,
    activeRoute: "",
    interplanetaryBackgroundDetected: false,
    foregroundCompassDetected: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    errors: [],
    warnings: [],
    timestamp: ""
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function recordWarning(text) {
    if (state.warnings.indexOf(text) === -1) state.warnings.push(text);
  }

  function recordError(text) {
    if (state.errors.indexOf(text) === -1) state.errors.push(text);
  }

  function tagRoot() {
    document.documentElement.dataset.compassRuntime = CONTRACT;
    document.documentElement.dataset.compassRuntimePrevious = PREVIOUS_RUNTIME;
    document.documentElement.dataset.compassPageContract = PAGE_CONTRACT;
    document.documentElement.dataset.room = "compass";
    document.documentElement.dataset.route = "/";
    document.documentElement.dataset.interplanetaryUniformity = "active";
    document.documentElement.dataset.compassRuntimeLoaded = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.compassRuntime = CONTRACT;
      document.body.dataset.room = "compass";
      document.body.dataset.interplanetaryUniformity = "active";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function auditNodes() {
    var inner = $all(".orbit-ring.inner .diamond-node");
    var outer = $all(".orbit-ring.outer .diamond-node");
    var stage = $(".compass-stage");
    var card = $(".compass-card");

    state.innerNodes = inner.length;
    state.outerNodes = outer.length;
    state.totalNodes = inner.length + outer.length;
    state.foregroundCompassDetected = Boolean(stage && card);

    if (inner.length !== 4) recordWarning("inner_orbit_expected_4_nodes");
    if (outer.length !== 16) recordWarning("outer_orbit_expected_16_nodes");
    if (!stage || !card) recordError("foreground_compass_stage_missing");

    if (stage) {
      stage.dataset.compassRuntime = CONTRACT;
      stage.dataset.innerNodes = String(inner.length);
      stage.dataset.outerNodes = String(outer.length);
      stage.dataset.totalNodes = String(state.totalNodes);
      stage.dataset.foregroundCompassInstrument = "true";
    }
  }

  function detectBackground() {
    state.interplanetaryBackgroundDetected = Boolean(
      window.DGB_INTERPLANETARY_BACKGROUND_RECEIPT ||
      document.querySelector("[data-dgb-interplanetary-background-field='true']") ||
      document.documentElement.dataset.dgbInterplanetaryBackground === "true"
    );

    document.documentElement.dataset.interplanetaryBackgroundDetected = String(state.interplanetaryBackgroundDetected);

    if (!state.interplanetaryBackgroundDetected) {
      recordWarning("interplanetary_background_not_detected_yet");
    }
  }

  function bindRouteNodeFocus() {
    var nodes = $all(".diamond-node[href]");

    nodes.forEach(function (node) {
      function activate() {
        state.activeRoute = node.getAttribute("href") || "";
        document.documentElement.dataset.activeCompassRoute = state.activeRoute;
        publish();
      }

      node.addEventListener("mouseenter", activate);
      node.addEventListener("focus", activate);
    });
  }

  function exposeStatus() {
    var status = $("[data-compass-status]");
    if (!status) return;

    status.setAttribute("data-compass-runtime", CONTRACT);
    status.setAttribute("data-compass-page-contract", PAGE_CONTRACT);
    status.setAttribute("data-inner-nodes", String(state.innerNodes));
    status.setAttribute("data-outer-nodes", String(state.outerNodes));
    status.setAttribute("data-total-nodes", String(state.totalNodes));
  }

  function publish() {
    state.timestamp = new Date().toISOString();
    window.DGB_COMPASS_RUNTIME_RECEIPT = {
      contract: state.contract,
      pageContract: state.pageContract,
      previousRuntime: state.previousRuntime,
      route: state.route,
      room: state.room,
      backgroundContract: state.backgroundContract,
      innerNodes: state.innerNodes,
      outerNodes: state.outerNodes,
      totalNodes: state.totalNodes,
      activeRoute: state.activeRoute,
      interplanetaryBackgroundDetected: state.interplanetaryBackgroundDetected,
      foregroundCompassDetected: state.foregroundCompassDetected,
      owns: [
        "foreground_compass_runtime_receipt",
        "route_node_count_audit",
        "interplanetary_background_detection",
        "hover_focus_active_route_signal"
      ],
      doesNotOwn: [
        "planet_rendering",
        "canvas_creation",
        "view_selector_authority",
        "Gauges_logic",
        "GraphicBox",
        "image_generation",
        "visual_pass_claim"
      ],
      warnings: state.warnings.slice(),
      errors: state.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: state.timestamp
    };

    try {
      window.dispatchEvent(new CustomEvent("dgb:compass:runtime", { detail: window.DGB_COMPASS_RUNTIME_RECEIPT }));
    } catch (error) {
      /* Event dispatch is optional. */
    }
  }

  function refreshLater() {
    [100, 500, 1200, 2400].forEach(function (delay) {
      window.setTimeout(function () {
        detectBackground();
        exposeStatus();
        publish();
      }, delay);
    });
  }

  function init() {
    tagRoot();
    auditNodes();
    detectBackground();
    bindRouteNodeFocus();
    exposeStatus();
    publish();
    refreshLater();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
