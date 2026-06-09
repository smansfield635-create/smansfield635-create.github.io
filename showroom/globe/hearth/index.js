// /showroom/globe/hearth/index.js
// HEARTH_SHOWROOM_GATE_CONTROLLER_CHAPEL_ONE_BISHOP_AWARE_TNT_v1
// Full-file replacement.
// Owns: Hearth showroom page-level controls only.
// Does not own: canvas drawing, WebGL, runtime restart, controls mutation, visual pass, F13/F21 claims.

(function hearthShowroomGateController(global) {
  "use strict";

  var root = global || window;
  var doc = root.document;

  var CONTRACT =
    "HEARTH_SHOWROOM_GATE_CONTROLLER_CHAPEL_ONE_BISHOP_AWARE_TNT_v1";
  var RECEIPT =
    "HEARTH_SHOWROOM_GATE_CONTROLLER_CHAPEL_ONE_BISHOP_AWARE_RECEIPT_v1";

  var VERSION =
    "2026-06-09.hearth-showroom-gate-controller-chapel-one-bishop-aware-v1";

  var FILE = "/showroom/globe/hearth/index.js";
  var ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var CANVAS_BISHOP_FILE = "/assets/hearth/hearth.canvas.js";
  var HEX_BRIDGE_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  var HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  var NO_TOUCH = {
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
    generatedImage: false,
    graphicBox: false,
    webGL: false
  };

  var SELECTORS = {
    diagnosticButtons: [
      "#openDiagnostic",
      "#diagnosticButton",
      "[data-hearth-open-diagnostic]",
      "[data-open-diagnostic]",
      "[data-route='diagnostic']"
    ],
    reloadButtons: [
      "#reloadHearth",
      "#reloadShowroom",
      "[data-hearth-reload]",
      "[data-reload-route]"
    ],
    manifestButtons: [
      "#toggleManifest",
      "#manifestButton",
      "[data-hearth-toggle-manifest]",
      "[data-toggle-manifest]"
    ],
    statusButtons: [
      "#showStatus",
      "#statusButton",
      "[data-hearth-show-status]",
      "[data-show-status]"
    ],
    receiptButtons: [
      "#copyReceipt",
      "#copyShowroomReceipt",
      "[data-hearth-copy-receipt]",
      "[data-copy-receipt]"
    ],
    manifestPanel: [
      "#hearthManifestPanel",
      "#manifestPanel",
      "[data-hearth-manifest-panel]"
    ],
    statusPanel: [
      "#hearthStatusPanel",
      "#statusPanel",
      "[data-hearth-status-panel]"
    ],
    statusOutput: [
      "#hearthStatusOutput",
      "#statusOutput",
      "[data-hearth-status-output]"
    ]
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function asString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function readPath(path) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) {
        return null;
      }
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function setPath(path, value) {
    var parts = asString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    var cursor = root;
    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") {
        cursor[parts[i]] = {};
      }
      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function queryFirst(selectors) {
    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = doc.querySelector(selectors[i]);
        if (found) return found;
      } catch (_error) {}
    }
    return null;
  }

  function queryAll(selectors) {
    var out = [];
    selectors.forEach(function each(selector) {
      try {
        Array.prototype.slice.call(doc.querySelectorAll(selector)).forEach(function add(node) {
          if (out.indexOf(node) === -1) out.push(node);
        });
      } catch (_error) {}
    });
    return out;
  }

  function methodKeys(value) {
    if (!isObject(value) && !isFunction(value)) return [];
    try {
      return Object.keys(value).filter(function filter(key) {
        return isFunction(value[key]);
      });
    } catch (_error) {
      return [];
    }
  }

  function readAuthority(paths, file) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value) {
        return {
          found: true,
          aliasPath: paths[i],
          file: file,
          methodCount: methodKeys(value).length,
          contract: asString(value.CONTRACT || value.contract || "UNKNOWN"),
          receipt: asString(value.RECEIPT || value.receipt || "UNKNOWN")
        };
      }
    }

    return {
      found: false,
      aliasPath: "NONE",
      file: file,
      methodCount: 0,
      contract: "UNKNOWN",
      receipt: "UNKNOWN"
    };
  }

  function inspectManifest() {
    return {
      canvasBishop: readAuthority(
        [
          "HEARTH_CANVAS_BISHOP",
          "HEARTH_CANVAS",
          "HEARTH.canvasBishop",
          "HEARTH.canvas",
          "DEXTER_LAB.hearthCanvasBishop"
        ],
        CANVAS_BISHOP_FILE
      ),
      hexBridge: readAuthority(
        [
          "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
          "HEARTH.hexFourPairAuthority",
          "HEARTH.hexAuthority",
          "DEXTER_LAB.hearthHexFourPairAuthority"
        ],
        HEX_BRIDGE_FILE
      ),
      hexSurface: readAuthority(
        [
          "HEARTH_HEX_SURFACE",
          "HEARTH.hexSurface",
          "HEARTH_HEX_SURFACE_RENDERER",
          "DEXTER_LAB.hearthHexSurface"
        ],
        HEX_SURFACE_FILE
      )
    };
  }

  function getReceipt() {
    var manifest = inspectManifest();

    var packet = {
      PACKET: "HEARTH_SHOWROOM_GATE_CONTROLLER_RECEIPT_PACKET_v1",
      RECEIPT_LEVEL: "1_SHOWROOM_GATE_CONTROLLER",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      RUN_STATE: "SHOWROOM_GATE_CONTROLLER_ACTIVE",
      TRUST_STATE: "PAGE_LEVEL_GATE_READY",
      BLOCKING: false,
      CHAPEL_ONE_BISHOP_AWARE: true,
      DIAGNOSTIC_BRIDGE_AWARE: true,
      PRODUCTION_MANIFEST_AWARE: true,
      CANVAS_BISHOP_PRESENT: manifest.canvasBishop.found,
      CANVAS_BISHOP_ALIAS_PATH: manifest.canvasBishop.aliasPath,
      CANVAS_BISHOP_FILE: manifest.canvasBishop.file,
      CANVAS_BISHOP_CONTRACT: manifest.canvasBishop.contract,
      HEX_BRIDGE_PRESENT: manifest.hexBridge.found,
      HEX_BRIDGE_FILE: manifest.hexBridge.file,
      HEX_SURFACE_PRESENT: manifest.hexSurface.found,
      HEX_SURFACE_FILE: manifest.hexSurface.file,
      NEXT_ACTION: manifest.canvasBishop.found
        ? "OPEN_DIAGNOSTIC_AND_MEASURE_SURFACE_TRUTH"
        : "LOAD_OR_RENEW_CANVAS_BISHOP_STANDARD",
      UPDATED_AT: nowIso()
    };

    Object.assign(packet, NO_TOUCH);
    return packet;
  }

  function packetText(packet) {
    return Object.keys(packet || {}).map(function line(key) {
      var value = packet[key];
      if (value === undefined || value === null || value === "") value = "UNKNOWN";
      if (Array.isArray(value) || isObject(value)) {
        try {
          value = JSON.stringify(value);
        } catch (_error) {
          value = "[object]";
        }
      }
      return key + "=" + asString(value);
    }).join("\n");
  }

  function writeStatus() {
    var output = queryFirst(SELECTORS.statusOutput);
    if (!output) return false;

    output.textContent = packetText(getReceipt());
    return true;
  }

  function togglePanel(selectors) {
    var panel = queryFirst(selectors);
    if (!panel) return false;

    panel.hidden = !panel.hidden;
    return true;
  }

  function openDiagnostic() {
    root.location.href = DIAGNOSTIC_ROUTE;
  }

  function reloadRoute() {
    root.location.reload();
  }

  function copyReceipt() {
    var text = packetText(getReceipt());

    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(text).catch(function noop() {});
      return text;
    }

    var area = doc.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    doc.body.appendChild(area);
    area.select();

    try {
      doc.execCommand("copy");
    } catch (_error) {}

    doc.body.removeChild(area);
    return text;
  }

  function bindMany(selectors, handler) {
    queryAll(selectors).forEach(function bind(node) {
      if (node.dataset.hearthGateBound === "true") return;
      node.dataset.hearthGateBound = "true";
      node.addEventListener("click", function click(event) {
        event.preventDefault();
        handler(event);
      });
    });
  }

  function installBindings() {
    bindMany(SELECTORS.diagnosticButtons, openDiagnostic);
    bindMany(SELECTORS.reloadButtons, reloadRoute);
    bindMany(SELECTORS.manifestButtons, function manifest() {
      togglePanel(SELECTORS.manifestPanel);
      writeStatus();
    });
    bindMany(SELECTORS.statusButtons, function status() {
      togglePanel(SELECTORS.statusPanel);
      writeStatus();
    });
    bindMany(SELECTORS.receiptButtons, copyReceipt);
  }

  function publishDataset() {
    var receipt = getReceipt();

    try {
      doc.documentElement.dataset.hearthShowroomGateController = "active";
      doc.documentElement.dataset.hearthShowroomGateContract = CONTRACT;
      doc.documentElement.dataset.hearthShowroomGateReceipt = RECEIPT;
      doc.documentElement.dataset.hearthShowroomGateVersion = VERSION;
      doc.documentElement.dataset.hearthCanvasBishopPresent = receipt.CANVAS_BISHOP_PRESENT ? "true" : "false";
      doc.documentElement.dataset.hearthDiagnosticBridgeAware = "true";
      doc.documentElement.dataset.hearthProductionMutationAuthorized = "false";
      doc.documentElement.dataset.hearthCanvasBuildAuthorized = "false";
      doc.documentElement.dataset.hearthCanvasReleaseAuthorized = "false";
    } catch (_error) {}
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      getReceipt: getReceipt,
      getReceiptText: function getReceiptText() {
        return packetText(getReceipt());
      },
      getStatus: getReceipt,
      inspectManifest: inspectManifest,
      openDiagnostic: openDiagnostic,
      reloadRoute: reloadRoute,
      copyReceipt: copyReceipt,
      writeStatus: writeStatus
    };

    Object.assign(api, NO_TOUCH);

    root.HEARTH_SHOWROOM_GATE_CONTROLLER = api;
    root.HEARTH.showroomGateController = api;
    root.HEARTH.showroomGate = api;
    root.DEXTER_LAB.hearthShowroomGateController = api;

    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_LOADED__ = true;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CONTRACT__ = CONTRACT;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_RECEIPT__ = RECEIPT;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_DIAGNOSTIC_BRIDGE_AWARE__ = true;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_SHOWROOM_GATE_CONTROLLER_CANVAS_RELEASE_AUTHORIZED__ = false;

    return api;
  }

  function boot() {
    installBindings();
    publishDataset();
    publishApi();
    writeStatus();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
