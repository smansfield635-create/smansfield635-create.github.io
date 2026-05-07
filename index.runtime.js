/* /index.runtime.js
   COMPASS_THREE_LENS_RUNTIME_TNT_v2
   Full-file replacement.
   Purpose:
   - Runtime layer for the Compass three-lens public command gate.
   - Audits the three lenses, round preview, interplanetary background, and route authority split.
   - Publishes runtime receipts for Gauges/source inspection.
   - Does not render planets.
   - Does not create canvas.
   - Does not touch Gauges logic.
   - Does not use image generation.
   - Does not use GraphicBox.
   - Does not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_THREE_LENS_RUNTIME_TNT_v2";
  var PREVIOUS_CONTRACT = "COMPASS_INTERPLANETARY_UNIFORMITY_RUNTIME_TNT_v1";
  var PAGE_CONTRACT = "COMPASS_THREE_LENS_INTERPLANETARY_GATE_TNT_v7";
  var ROUTE_JS_CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v3";
  var BACKGROUND_CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  var state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    pageContract: PAGE_CONTRACT,
    routeJsContract: ROUTE_JS_CONTRACT,
    backgroundContract: BACKGROUND_CONTRACT,
    route: "/",
    room: "compass",
    lensCards: 0,
    flatLens: false,
    roundLens: false,
    globeLens: false,
    flatRoute: "",
    roundRoute: "",
    globeRoute: "",
    innerNodes: 0,
    outerNodes: 0,
    totalNodes: 0,
    roundPreviewDetected: false,
    interplanetaryBackgroundDetected: false,
    activeLens: "",
    activeRoute: "",
    authoritySplitValid: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    warnings: [],
    errors: [],
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

  function hrefOf(selector) {
    var node = $(selector);
    return node ? node.getAttribute("href") || "" : "";
  }

  function tagRoot() {
    document.documentElement.dataset.compassRuntime = CONTRACT;
    document.documentElement.dataset.compassRuntimePrevious = PREVIOUS_CONTRACT;
    document.documentElement.dataset.compassPageContract = PAGE_CONTRACT;
    document.documentElement.dataset.compassRouteJsContract = ROUTE_JS_CONTRACT;
    document.documentElement.dataset.room = "compass";
    document.documentElement.dataset.route = "/";
    document.documentElement.dataset.threeLensRuntime = "active";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.compassRuntime = CONTRACT;
      document.body.dataset.threeLensRuntime = "active";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function auditLenses() {
    var lenses = $all("[data-lens]");
    var flat = $("[data-lens='flat']");
    var round = $("[data-lens='round']");
    var globe = $("[data-lens='globe']");

    state.lensCards = lenses.length;
    state.flatLens = Boolean(flat);
    state.roundLens = Boolean(round);
    state.globeLens = Boolean(globe);

    state.flatRoute = hrefOf("[data-lens-link='flat']");
    state.roundRoute = hrefOf("[data-lens-link='round']");
    state.globeRoute = hrefOf("[data-lens-link='globe']");

    if (state.lensCards !== 3) recordError("expected_three_lens_cards");
    if (!state.flatLens) recordError("flat_lens_missing");
    if (!state.roundLens) recordError("round_lens_missing");
    if (!state.globeLens) recordError("globe_lens_missing");

    if (state.flatRoute.indexOf("/door/") !== 0 || state.flatRoute.indexOf("view=flat") === -1) {
      recordError("flat_lens_must_route_to_door_view_flat");
    }

    if (state.roundRoute.indexOf("/door/") !== 0 || state.roundRoute.indexOf("view=round") === -1) {
      recordError("round_lens_must_route_to_door_view_round");
    }

    if (state.globeRoute.indexOf("/nine-summits/universe/") !== 0) {
      recordError("globe_lens_must_route_to_nine_summits_universe");
    }

    state.authoritySplitValid = Boolean(
      state.flatRoute.indexOf("/door/") === 0 &&
      state.flatRoute.indexOf("view=flat") !== -1 &&
      state.roundRoute.indexOf("/door/") === 0 &&
      state.roundRoute.indexOf("view=round") !== -1 &&
      state.globeRoute.indexOf("/nine-summits/universe/") === 0
    );

    document.documentElement.dataset.compassLensCount = String(state.lensCards);
    document.documentElement.dataset.compassFlatRoute = state.flatRoute;
    document.documentElement.dataset.compassRoundRoute = state.roundRoute;
    document.documentElement.dataset.compassGlobeRoute = state.globeRoute;
    document.documentElement.dataset.compassAuthoritySplitValid = String(state.authoritySplitValid);
  }

  function auditRoundPreview() {
    var inner = $all(".orbit-ring.inner .diamond-node");
    var outer = $all(".orbit-ring.outer .diamond-node");
    var preview = $("[data-round-preview='true']") || $(".compass-card");

    state.innerNodes = inner.length;
    state.outerNodes = outer.length;
    state.totalNodes = inner.length + outer.length;
    state.roundPreviewDetected = Boolean(preview);

    if (inner.length !== 4) recordWarning("round_preview_inner_orbit_expected_4_nodes");
    if (outer.length !== 16) recordWarning("round_preview_outer_orbit_expected_16_nodes");
    if (!preview) recordWarning("round_preview_missing");

    if (preview) {
      preview.dataset.compassRuntime = CONTRACT;
      preview.dataset.innerNodes = String(inner.length);
      preview.dataset.outerNodes = String(outer.length);
      preview.dataset.totalNodes = String(state.totalNodes);
      preview.dataset.roundPreviewDetected = "true";
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

  function bindLensFocus() {
    var links = $all("[data-lens-link]");

    links.forEach(function (link) {
      function activate() {
        state.activeLens = link.dataset.lensLink || "";
        state.activeRoute = link.getAttribute("href") || "";

        document.documentElement.dataset.activeCompassLens = state.activeLens;
        document.documentElement.dataset.activeCompassRoute = state.activeRoute;

        publish();
      }

      link.addEventListener("mouseenter", activate);
      link.addEventListener("focus", activate);
    });
  }

  function bindRoundPreviewFocus() {
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

    status.dataset.compassRuntime = CONTRACT;
    status.dataset.compassPageContract = PAGE_CONTRACT;
    status.dataset.lensCards = String(state.lensCards);
    status.dataset.flatRoute = state.flatRoute;
    status.dataset.roundRoute = state.roundRoute;
    status.dataset.globeRoute = state.globeRoute;
    status.dataset.authoritySplitValid = String(state.authoritySplitValid);
    status.dataset.innerNodes = String(state.innerNodes);
    status.dataset.outerNodes = String(state.outerNodes);
    status.dataset.totalNodes = String(state.totalNodes);
  }

  function publish() {
    state.timestamp = new Date().toISOString();

    window.DGB_COMPASS_THREE_LENS_RUNTIME_RECEIPT = {
      contract: state.contract,
      previousContract: state.previousContract,
      pageContract: state.pageContract,
      routeJsContract: state.routeJsContract,
      backgroundContract: state.backgroundContract,
      route: state.route,
      room: state.room,
      lensCards: state.lensCards,
      lenses: {
        flat: {
          present: state.flatLens,
          route: state.flatRoute,
          authority: "door"
        },
        round: {
          present: state.roundLens,
          route: state.roundRoute,
          authority: "door"
        },
        globe: {
          present: state.globeLens,
          route: state.globeRoute,
          authority: "nine_summits_universe"
        }
      },
      roundPreview: {
        present: state.roundPreviewDetected,
        innerNodes: state.innerNodes,
        outerNodes: state.outerNodes,
        totalNodes: state.totalNodes
      },
      authoritySplitValid: state.authoritySplitValid,
      interplanetaryBackgroundDetected: state.interplanetaryBackgroundDetected,
      activeLens: state.activeLens,
      activeRoute: state.activeRoute,
      owns: [
        "three_lens_runtime_receipt",
        "lens_route_audit",
        "authority_split_audit",
        "round_preview_node_count_audit",
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
      window.dispatchEvent(new CustomEvent("dgb:compass:three-lens-runtime", {
        detail: window.DGB_COMPASS_THREE_LENS_RUNTIME_RECEIPT
      }));
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
    auditLenses();
    auditRoundPreview();
    detectBackground();
    bindLensFocus();
    bindRoundPreviewFocus();
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
