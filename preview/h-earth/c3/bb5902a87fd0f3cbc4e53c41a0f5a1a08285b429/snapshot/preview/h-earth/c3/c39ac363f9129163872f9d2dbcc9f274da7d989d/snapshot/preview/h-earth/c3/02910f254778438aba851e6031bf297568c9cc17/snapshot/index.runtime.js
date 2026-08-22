/* /index.runtime.js
   COMPASS_THREE_LENS_RUNTIME_TNT_v4
   Full-file replacement.
   Purpose:
   - Runtime layer for the Compass three-lens public command gate.
   - Audits Flat as homepage-local 2D only.
   - Audits Round as original Compass orbit with interplanetary background.
   - Audits Products as Round node only, not Round authority.
   - Audits Globe as /nine-summits/universe/.
   - Does not render planets.
   - Does not create canvas.
   - Does not touch Gauges logic.
   - Does not use image generation.
   - Does not use GraphicBox.
   - Does not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_THREE_LENS_RUNTIME_TNT_v4";
  var PREVIOUS_CONTRACT = "COMPASS_THREE_LENS_RUNTIME_TNT_v3";
  var PAGE_CONTRACT = "COMPASS_THREE_LENS_FLAT_HOME_ROUND_ORBIT_GLOBE_UNIVERSE_TNT_v9";
  var ROUTE_JS_CONTRACT = "COMPASS_THREE_LENS_ROUTE_ONLY_JS_TNT_v5";
  var ROUND_BACKGROUND_CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  var state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    pageContract: PAGE_CONTRACT,
    routeJsContract: ROUTE_JS_CONTRACT,
    roundBackgroundContract: ROUND_BACKGROUND_CONTRACT,
    route: "/",
    room: "compass",
    activeLens: "gate",
    lensCards: 0,
    flatPanel: false,
    roundPanel: false,
    flatCells: 0,
    flatRoute: "",
    roundRoute: "",
    globeRoute: "",
    productsRoundNode: false,
    productsRoundAuthority: false,
    innerNodes: 0,
    outerNodes: 0,
    roundTotalNodes: 0,
    flatIsHomepageLocal: false,
    flatIs2DOnly: false,
    roundHasOrbit: false,
    roundBackgroundDetected: false,
    globeRoutesToUniverse: false,
    authoritySplitValid: false,
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
    var cards = $all("[data-lens]");
    var flatPanel = $(".flat-panel");
    var roundPanel = $(".round-panel");

    state.lensCards = cards.length;
    state.flatPanel = Boolean(flatPanel);
    state.roundPanel = Boolean(roundPanel);
    state.flatCells = $all(".flat-map .flat-cell").length;

    state.flatRoute = hrefOf("[data-lens-link='flat']");
    state.roundRoute = hrefOf("[data-lens-link='round']");
    state.globeRoute = hrefOf("[data-lens-link='globe']");

    state.flatIsHomepageLocal = state.flatRoute === "/";
    state.globeRoutesToUniverse = state.globeRoute.indexOf("/nine-summits/universe/") === 0;

    if (state.lensCards !== 3) recordError("expected_three_front_lens_cards");
    if (!state.flatPanel) recordError("flat_panel_missing");
    if (!state.roundPanel) recordError("round_panel_missing");
    if (state.flatCells < 8) recordWarning("flat_2d_map_has_low_cell_count");
    if (!state.flatIsHomepageLocal) recordError("flat_lens_must_route_to_homepage_root");
    if (state.flatRoute.indexOf("/door/") === 0) recordError("flat_lens_must_not_enter_door");
    if (state.roundRoute !== "/?lens=round") recordError("round_lens_must_route_to_original_compass_round_state");
    if (!state.globeRoutesToUniverse) recordError("globe_must_route_to_nine_summits_universe");

    state.flatIs2DOnly = Boolean(
      flatPanel &&
      flatPanel.querySelector(".flat-map") &&
      !flatPanel.querySelector(".orbit-ring") &&
      !flatPanel.querySelector(".compass-card") &&
      !flatPanel.querySelector("canvas")
    );

    if (!state.flatIs2DOnly) recordError("flat_lens_must_be_2d_only_no_orbit_no_canvas");
  }

  function auditRound() {
    var inner = $all(".round-panel .orbit-ring.inner .diamond-node");
    var outer = $all(".round-panel .orbit-ring.outer .diamond-node");
    var preview = $(".round-panel [data-round-preview='true']") || $(".round-panel .compass-card");
    var productLinks = $all(".round-panel a[href*='/products/']");

    state.innerNodes = inner.length;
    state.outerNodes = outer.length;
    state.roundTotalNodes = inner.length + outer.length;
    state.roundHasOrbit = Boolean(preview && inner.length === 4 && outer.length === 16);
    state.productsRoundNode = productLinks.length > 0;
    state.productsRoundAuthority = state.roundRoute.indexOf("/products/") === 0;

    if (!preview) recordWarning("round_preview_missing");
    if (inner.length !== 4) recordWarning("round_preview_inner_orbit_expected_4_nodes");
    if (outer.length !== 16) recordWarning("round_preview_outer_orbit_expected_16_nodes");
    if (!state.productsRoundNode) recordWarning("products_should_remain_a_round_node");
    if (state.productsRoundAuthority) recordError("products_must_not_be_round_authority");

    if (preview) {
      preview.dataset.compassRuntime = CONTRACT;
      preview.dataset.innerNodes = String(inner.length);
      preview.dataset.outerNodes = String(outer.length);
      preview.dataset.totalNodes = String(state.roundTotalNodes);
      preview.dataset.roundPreviewDetected = "true";
    }
  }

  function detectRoundBackground() {
    state.activeLens = document.body ? document.body.dataset.activeLens || "gate" : "gate";

    state.roundBackgroundDetected = Boolean(
      window.DGB_INTERPLANETARY_BACKGROUND_RECEIPT ||
      document.querySelector("[data-dgb-interplanetary-background-field='true']") ||
      document.documentElement.dataset.dgbInterplanetaryBackground === "true"
    );

    if (state.activeLens === "round" && !state.roundBackgroundDetected) {
      recordWarning("round_background_not_detected_yet");
    }

    document.documentElement.dataset.compassActiveLensRuntime = state.activeLens;
    document.documentElement.dataset.roundBackgroundDetected = String(state.roundBackgroundDetected);
  }

  function auditAuthority() {
    state.authoritySplitValid = Boolean(
      state.flatIsHomepageLocal &&
      state.flatIs2DOnly &&
      state.roundRoute === "/?lens=round" &&
      state.roundHasOrbit &&
      state.productsRoundNode &&
      !state.productsRoundAuthority &&
      state.globeRoutesToUniverse
    );

    document.documentElement.dataset.compassFlatIsHomepageLocal = String(state.flatIsHomepageLocal);
    document.documentElement.dataset.compassFlatIs2DOnly = String(state.flatIs2DOnly);
    document.documentElement.dataset.compassRoundHasOrbit = String(state.roundHasOrbit);
    document.documentElement.dataset.compassProductsRoundNode = String(state.productsRoundNode);
    document.documentElement.dataset.compassProductsRoundAuthority = String(state.productsRoundAuthority);
    document.documentElement.dataset.compassGlobeRoutesToUniverse = String(state.globeRoutesToUniverse);
    document.documentElement.dataset.compassAuthoritySplitValid = String(state.authoritySplitValid);
  }

  function exposeStatus() {
    var status = $("[data-compass-status]");
    if (!status) return;

    status.dataset.compassRuntime = CONTRACT;
    status.dataset.compassPageContract = PAGE_CONTRACT;
    status.dataset.activeLens = state.activeLens;
    status.dataset.lensCards = String(state.lensCards);
    status.dataset.flatRoute = state.flatRoute;
    status.dataset.roundRoute = state.roundRoute;
    status.dataset.globeRoute = state.globeRoute;
    status.dataset.flatCells = String(state.flatCells);
    status.dataset.flatIsHomepageLocal = String(state.flatIsHomepageLocal);
    status.dataset.flatIs2DOnly = String(state.flatIs2DOnly);
    status.dataset.roundHasOrbit = String(state.roundHasOrbit);
    status.dataset.roundBackgroundDetected = String(state.roundBackgroundDetected);
    status.dataset.productsRoundNode = String(state.productsRoundNode);
    status.dataset.productsRoundAuthority = String(state.productsRoundAuthority);
    status.dataset.authoritySplitValid = String(state.authoritySplitValid);
  }

  function publish() {
    state.timestamp = new Date().toISOString();

    window.DGB_COMPASS_THREE_LENS_RUNTIME_RECEIPT = {
      contract: state.contract,
      previousContract: state.previousContract,
      pageContract: state.pageContract,
      routeJsContract: state.routeJsContract,
      roundBackgroundContract: state.roundBackgroundContract,
      route: state.route,
      room: state.room,
      activeLens: state.activeLens,
      lensCards: state.lensCards,
      flat: {
        route: state.flatRoute,
        homepageLocal: state.flatIsHomepageLocal,
        panelPresent: state.flatPanel,
        cells: state.flatCells,
        is2DOnly: state.flatIs2DOnly,
        entersDoor: state.flatRoute.indexOf("/door/") === 0,
        behavior: "in_page_2d_homepage_only"
      },
      round: {
        route: state.roundRoute,
        panelPresent: state.roundPanel,
        innerNodes: state.innerNodes,
        outerNodes: state.outerNodes,
        totalNodes: state.roundTotalNodes,
        hasOrbit: state.roundHasOrbit,
        backgroundDetected: state.roundBackgroundDetected,
        productsNode: state.productsRoundNode,
        productsAuthority: state.productsRoundAuthority,
        behavior: "original_compass_orbit_with_interplanetary_background"
      },
      globe: {
        route: state.globeRoute,
        routesToUniverse: state.globeRoutesToUniverse,
        behavior: "route_to_nine_summits_universe"
      },
      authoritySplitValid: state.authoritySplitValid,
      owns: [
        "three_lens_runtime_receipt",
        "flat_homepage_2d_only_audit",
        "round_original_compass_orbit_audit",
        "products_as_round_node_audit",
        "round_background_detection",
        "globe_route_audit"
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

  function runAudit() {
    state.warnings = [];
    state.errors = [];

    auditLenses();
    auditRound();
    detectRoundBackground();
    auditAuthority();
    exposeStatus();
    publish();
  }

  function bindEvents() {
    window.addEventListener("dgb:compass:lens-ready", runAudit);
    window.addEventListener("popstate", runAudit);

    document.addEventListener("click", function () {
      window.setTimeout(runAudit, 40);
    });
  }

  function refreshLater() {
    [100, 500, 1200, 2400].forEach(function (delay) {
      window.setTimeout(runAudit, delay);
    });
  }

  function init() {
    tagRoot();
    bindEvents();
    runAudit();
    refreshLater();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
