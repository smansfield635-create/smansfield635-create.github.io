// /showroom/globe/hearth/index.js
// HEARTH_PUBLIC_ROUTE_3D_FRONT_STAGE_AND_DIAGNOSTIC_DOOR_JS_TNT_v1
// Full-file replacement.
// JS authority for Hearth public route only.
// Owns: public page behavior, 3D front-stage state, diagnostic door,
// globe mount readiness reporting, future release gate, visible status slots.
// Does not own: canvas drawing, hands, fingers, hex rendering, controls,
// diagnostic workbench internals, production release, WebGL, GraphicBox, generated images.

(function hearthPublicRoute3DFrontStageController(global) {
  "use strict";

  var root = global || window;
  var doc = root.document;

  var CONTRACT = "HEARTH_PUBLIC_ROUTE_3D_FRONT_STAGE_AND_DIAGNOSTIC_DOOR_JS_TNT_v1";
  var HTML_CONTRACT = "HEARTH_PUBLIC_ROUTE_3D_FRONT_STAGE_AND_DIAGNOSTIC_DOOR_HTML_TNT_v1";
  var CSS_CONTRACT = "HEARTH_PUBLIC_ROUTE_3D_FRONT_STAGE_AND_DIAGNOSTIC_DOOR_CSS_TNT_v1";
  var PREBUILD_BINDING = "HEARTH_PUBLIC_ROUTE_FINAL_STRATEGIC_BINDING_v1";

  var ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var REQUIRED_RELEASE_SIGNALS = [
    "bishop",
    "hands",
    "fingers",
    "hex",
    "mount",
    "diagnostic"
  ];

  var state = {
    bootedAt: nowIso(),
    updatedAt: nowIso(),
    activeLens: "overview",
    activeNode: "hearth",
    orbitOpen: false,
    diagnosticDoorReady: false,
    diagnosticDoorOpened: false,
    mountPresent: false,
    mountRectNonZero: false,
    canvasPresent: false,
    canvasRectNonZero: false,
    bishopObserved: false,
    handsObserved: false,
    fingersObserved: false,
    hexObserved: false,
    releaseThresholdMet: false,
    releaseAuthorized: false,
    globeReleased: false,
    lastAction: "boot",
    errors: []
  };

  var NO_CLAIMS = {
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  };

  var SELECTORS = {
    lensButton: "[data-hearth-lens-button]",
    lensPanel: "[data-hearth-lens-panel]",
    orbitNode: "[data-hearth-orbit-node]",
    returnOrbit: "[data-hearth-return-orbit]",
    diagnosticDoor: "[data-hearth-diagnostic-door]",
    mount: "#hearthCanvasMount, [data-hearth-canvas-mount='true']",
    canvas: "#hearthVisibleCanvas, canvas[data-hearth-visible-canvas='true'], canvas[data-hearth-canvas='true'], canvas[data-planet='hearth'], canvas",
    releaseReadout: "[data-hearth-release-readout]",
    statusReadout: "[data-hearth-status-readout]",
    mountReadout: "[data-hearth-mount-readout]",
    diagnosticReadout: "[data-hearth-diagnostic-readout]",
    stage: "[data-hearth-3d-stage]",
    shell: "[data-hearth-public-shell]"
  };

  var LENS_COPY = {
    overview: {
      title: "Hearth Overview",
      status: "3D front-stage active · globe release held",
      copy: "Hearth is staged as a modern 3D public route while the globe remains gated behind bishop, hands, fingers, hex, mount, and diagnostic evidence."
    },
    structure: {
      title: "Structure",
      status: "HTML duties active · route slots measurable",
      copy: "The public HTML page provides the page shell, diagnostic door, globe mount location, status slots, and front-stage navigation surface."
    },
    globe: {
      title: "Globe Gate",
      status: "mount observed only after lawful evidence",
      copy: "The globe mount is prepared here. Canvas release remains false until the upstream hands/fingers/hex chain reaches threshold."
    },
    diagnostics: {
      title: "Diagnostics",
      status: "diagnostic door connected",
      copy: "The diagnostic workbench remains the inspection chamber. This page exposes a route back into that chamber without mutating it."
    }
  };

  function nowIso() {
    try { return new Date().toISOString(); }
    catch (_error) { return ""; }
  }

  function one(selector, base) {
    try { return (base || doc).querySelector(selector); }
    catch (_error) { return null; }
  }

  function all(selector, base) {
    try { return Array.prototype.slice.call((base || doc).querySelectorAll(selector)); }
    catch (_error) { return []; }
  }

  function setText(selector, value) {
    var node = one(selector);
    if (node) node.textContent = String(value == null ? "" : value);
    return Boolean(node);
  }

  function setAttr(node, name, value) {
    if (!node) return;
    try { node.setAttribute(name, value ? "true" : "false"); }
    catch (_error) {}
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] == null) return null;
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function rectOf(node) {
    if (!node || typeof node.getBoundingClientRect !== "function") {
      return { width: 0, height: 0 };
    }

    try {
      var rect = node.getBoundingClientRect();
      return {
        width: Number(rect.width) || 0,
        height: Number(rect.height) || 0
      };
    } catch (_error) {
      return { width: 0, height: 0 };
    }
  }

  function observed(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      if (readPath(paths[i])) return true;
    }
    return false;
  }

  function inspectMount() {
    var mount = one(SELECTORS.mount);
    var canvas = mount ? one(SELECTORS.canvas, mount) : one(SELECTORS.canvas);
    var mountRect = rectOf(mount);
    var canvasRect = rectOf(canvas);

    state.mountPresent = Boolean(mount);
    state.mountRectNonZero = Boolean(mountRect.width > 0 && mountRect.height > 0);
    state.canvasPresent = Boolean(canvas);
    state.canvasRectNonZero = Boolean(canvasRect.width > 0 && canvasRect.height > 0);

    return {
      mount: mount,
      canvas: canvas,
      mountRect: mountRect,
      canvasRect: canvasRect
    };
  }

  function inspectAuthorities() {
    state.bishopObserved = observed([
      "HEARTH_CANVAS_BISHOP",
      "HEARTH.canvasBishop",
      "DEXTER_LAB.hearthCanvasBishop"
    ]);

    state.handsObserved = observed([
      "HEARTH.canvasHandGeometry",
      "HEARTH.canvasHandContext",
      "HEARTH.canvasHandPaint",
      "HEARTH.canvasHandView",
      "HEARTH.canvasHandInspect",
      "HEARTH_CANVAS_HAND_GEOMETRY"
    ]);

    state.fingersObserved = observed([
      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasFingerBoundary",
      "HEARTH.canvasFingerInspect",
      "HEARTH.canvasFingerLight"
    ]);

    state.hexObserved = observed([
      "HEARTH.hexSurface",
      "HEARTH.hexFourPairAuthority",
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY"
    ]);

    state.diagnosticDoorReady = Boolean(one(SELECTORS.diagnosticDoor));
  }

  function evaluateReleaseThreshold() {
    var checks = {
      bishop: state.bishopObserved,
      hands: state.handsObserved,
      fingers: state.fingersObserved,
      hex: state.hexObserved,
      mount: state.mountPresent && state.mountRectNonZero,
      diagnostic: state.diagnosticDoorReady
    };

    state.releaseThresholdMet = REQUIRED_RELEASE_SIGNALS.every(function each(key) {
      return Boolean(checks[key]);
    });

    state.releaseAuthorized = false;
    state.globeReleased = false;

    return checks;
  }

  function publishStatus() {
    inspectMount();
    inspectAuthorities();

    var checks = evaluateReleaseThreshold();

    state.updatedAt = nowIso();

    var payload = Object.assign({
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      cssContract: CSS_CONTRACT,
      prebuildBinding: PREBUILD_BINDING,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      publicRouteController: true,
      threeFileSplit: true,
      pageDutiesActive: true,
      diagnosticDoorReady: state.diagnosticDoorReady,

      activeLens: state.activeLens,
      activeNode: state.activeNode,
      orbitOpen: state.orbitOpen,

      bishopObserved: state.bishopObserved,
      handsObserved: state.handsObserved,
      fingersObserved: state.fingersObserved,
      hexObserved: state.hexObserved,
      mountPresent: state.mountPresent,
      mountRectNonZero: state.mountRectNonZero,
      canvasPresent: state.canvasPresent,
      canvasRectNonZero: state.canvasRectNonZero,

      releaseChecks: checks,
      releaseThresholdMet: state.releaseThresholdMet,
      releaseAuthorized: false,
      globeReleased: false,

      lastAction: state.lastAction,
      updatedAt: state.updatedAt,
      errors: state.errors.slice()
    }, NO_CLAIMS);

    root.HEARTH_PUBLIC_ROUTE_STATUS = payload;
    root.HEARTH_PUBLIC_ROUTE_3D_FRONT_STAGE_STATUS = payload;

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.publicRouteStatus = payload;

    try {
      doc.documentElement.dataset.hearthPublicRouteContract = CONTRACT;
      doc.documentElement.dataset.hearthPublicRouteActiveLens = state.activeLens;
      doc.documentElement.dataset.hearthPublicRouteDiagnosticDoorReady = String(state.diagnosticDoorReady);
      doc.documentElement.dataset.hearthPublicRouteMountPresent = String(state.mountPresent);
      doc.documentElement.dataset.hearthPublicRouteMountRectNonZero = String(state.mountRectNonZero);
      doc.documentElement.dataset.hearthPublicRouteReleaseThresholdMet = String(state.releaseThresholdMet);
      doc.documentElement.dataset.hearthPublicRouteGlobeReleased = "false";
      doc.documentElement.dataset.hearthPublicRouteCanvasReleaseAuthorized = "false";
    } catch (_error) {}

    writeReadouts(payload);
    return payload;
  }

  function writeReadouts(payload) {
    setText(SELECTORS.statusReadout, LENS_COPY[state.activeLens].status);
    setText(
      SELECTORS.mountReadout,
      payload.mountPresent
        ? payload.mountRectNonZero ? "mount present · nonzero" : "mount present · zero rect"
        : "mount pending"
    );
    setText(
      SELECTORS.releaseReadout,
      payload.releaseThresholdMet
        ? "threshold measured · release still not authorized"
        : "release held · evidence incomplete"
    );
    setText(
      SELECTORS.diagnosticReadout,
      payload.diagnosticDoorReady ? "diagnostic door ready" : "diagnostic door pending"
    );
  }

  function activateLens(lens) {
    var next = LENS_COPY[lens] ? lens : "overview";
    state.activeLens = next;
    state.lastAction = "activate-lens:" + next;

    all(SELECTORS.lensButton).forEach(function each(button) {
      var active = button.getAttribute("data-hearth-lens-button") === next;
      setAttr(button, "aria-pressed", active);
      setAttr(button, "data-active", active);
      setAttr(button, "data-muted", !active);
    });

    all(SELECTORS.lensPanel).forEach(function each(panel) {
      var active = panel.getAttribute("data-hearth-lens-panel") === next;
      setAttr(panel, "data-active", active);
      panel.hidden = !active;
    });

    var copy = LENS_COPY[next];
    setText("[data-hearth-lens-title]", copy.title);
    setText("[data-hearth-lens-copy]", copy.copy);

    publishStatus();
  }

  function activateNode(nodeKey) {
    var key = String(nodeKey || "hearth");
    state.activeNode = key;
    state.orbitOpen = true;
    state.lastAction = "activate-node:" + key;

    all(SELECTORS.orbitNode).forEach(function each(node) {
      var active = node.getAttribute("data-hearth-orbit-node") === key;
      setAttr(node, "data-active", active);
      setAttr(node, "data-muted", !active);
    });

    publishStatus();
  }

  function returnToOrbit() {
    state.activeNode = "hearth";
    state.orbitOpen = false;
    state.lastAction = "return-to-orbit";

    all(SELECTORS.orbitNode).forEach(function each(node) {
      setAttr(node, "data-active", false);
      setAttr(node, "data-muted", false);
    });

    activateLens("overview");
    publishStatus();
  }

  function openDiagnosticDoor(event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();

    state.diagnosticDoorOpened = true;
    state.lastAction = "open-diagnostic-door";
    publishStatus();

    root.location.href = DIAGNOSTIC_ROUTE;
  }

  function installEvents() {
    all(SELECTORS.lensButton).forEach(function each(button) {
      button.addEventListener("click", function clickLens() {
        activateLens(button.getAttribute("data-hearth-lens-button"));
      });
    });

    all(SELECTORS.orbitNode).forEach(function each(node) {
      node.addEventListener("click", function clickNode() {
        activateNode(node.getAttribute("data-hearth-orbit-node"));
      });
    });

    all(SELECTORS.returnOrbit).forEach(function each(button) {
      button.addEventListener("click", function clickReturn(event) {
        event.preventDefault();
        returnToOrbit();
      });
    });

    all(SELECTORS.diagnosticDoor).forEach(function each(link) {
      link.addEventListener("click", openDiagnosticDoor);
    });

    root.addEventListener("resize", function resize() {
      state.lastAction = "resize";
      publishStatus();
    }, { passive: true });
  }

  function exposeApi() {
    var api = {
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      cssContract: CSS_CONTRACT,
      prebuildBinding: PREBUILD_BINDING,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      state: state,
      noClaims: NO_CLAIMS,
      activateLens: activateLens,
      activateNode: activateNode,
      returnToOrbit: returnToOrbit,
      inspectMount: inspectMount,
      inspectAuthorities: inspectAuthorities,
      evaluateReleaseThreshold: evaluateReleaseThreshold,
      publishStatus: publishStatus
    };

    root.HEARTH_PUBLIC_ROUTE_CONTROLLER = api;
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.publicRouteController = api;

    return api;
  }

  function boot() {
    try {
      exposeApi();
      installEvents();
      activateLens("overview");
      publishStatus();
      state.lastAction = "boot-complete";
      publishStatus();
    } catch (error) {
      state.errors.push({
        scope: "boot",
        message: error && error.message ? error.message : String(error),
        time: nowIso()
      });
      publishStatus();
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
