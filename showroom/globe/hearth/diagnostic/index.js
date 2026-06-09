// /showroom/globe/hearth/diagnostic/index.js
// HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6
// Full-file replacement.
// JS only.
// Renewal: return-to-Hearth support + production manifest awareness.
// No production/canvas/controls/runtime-route/target-renderer mutation.

(function hearthDiagnosticWorkbenchButtonController(global) {
  "use strict"; 

  var root = global || window;
  var doc = root.document;

  var CONTRACT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_TNT_v8";
  var RECEIPT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_RECEIPT_v8";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_RECEIPT_v9_4_6";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_5";

  var HTML_SHELL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_STATIC_SHELL_TNT_v9_4_6";
  var CSS_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_STYLE_TNT_v9_4_6";

  var VERSION =
    "2026-06-09.hearth-diagnostic-route-single-audit-workbench-button-controller-v9-4-6";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

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
    generatedImage: false,
    graphicBox: false,
    webGL: false
  };

  var PRODUCTION_MANIFEST = [
    { key: "HTML_SHELL", path: "/showroom/globe/hearth/index.html", kind: "route-shell", required: true },
    { key: "ROUTE_CONTROLLER", path: "/showroom/globe/hearth/index.js", kind: "route-controller", required: true },
    { key: "CANVAS_BISHOP", path: "/assets/hearth/hearth.canvas.js", kind: "chapel-one-bishop", required: true },
    { key: "HAND_GEOMETRY", path: "/assets/hearth/hearth.canvas.hand.geometry.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_CONTEXT", path: "/assets/hearth/hearth.canvas.hand.context.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_PAINT", path: "/assets/hearth/hearth.canvas.hand.paint.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_VIEW", path: "/assets/hearth/hearth.canvas.hand.view.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_INSPECT", path: "/assets/hearth/hearth.canvas.hand.inspect.js", kind: "chapel-one-hand", required: false },
    { key: "HEX_AUTHORITY_BRIDGE", path: "/assets/hearth/hearth.hex.four-pair.authority.js", kind: "congressional-bridge", required: false },
    { key: "HEX_SURFACE_BRIDGE", path: "/assets/hearth/hearth.hex.surface.js", kind: "congressional-bridge", required: false },
    { key: "FINGER_SURFACE", path: "/assets/hearth/hearth.canvas.finger.surface.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_BOUNDARY", path: "/assets/hearth/hearth.canvas.finger.boundary.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_INSPECT", path: "/assets/hearth/hearth.canvas.finger.inspect.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_LIGHT", path: "/assets/hearth/hearth.canvas.finger.light.js", kind: "chapel-two-finger", required: false }
  ];

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try { return String(value); } catch (_error) { return fallback; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function $(id) {
    return doc.getElementById(id);
  }

  function readPath(path) {
    var parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;
    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
      cursor = cursor[parts[i]];
    }
    return cursor;
  }

  function methodKeys(value) {
    if (!isObject(value) && !isFunction(value)) return [];
    try {
      return Object.keys(value).filter(function each(key) {
        return isFunction(value[key]);
      });
    } catch (_error) {
      return [];
    }
  }

  function readReceipt(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return {};
    var methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport"];
    for (var i = 0; i < methods.length; i += 1) {
      try {
        if (isFunction(value[methods[i]])) {
          var out = value[methods[i]]();
          if (isObject(out)) return out;
        }
      } catch (_error) {}
    }
    return isObject(value) ? value : {};
  }

  function normalizePath(src) {
    try { return new URL(src, root.location.origin).pathname; }
    catch (_error) { return safeString(src); }
  }

  function findScript(path) {
    var scripts = Array.prototype.slice.call(doc.querySelectorAll("script[src]"));
    return scripts.find(function each(script) {
      var src = script.getAttribute("src") || script.src || "";
      return normalizePath(src) === path || src.indexOf(path) !== -1;
    }) || null;
  }

  function inspectProductionManifest() {
    var frame = $("hearthDiagnosticTargetFrame");
    var frameDoc = null;
    var frameWin = null;

    try {
      frameDoc = frame && (frame.contentDocument || (frame.contentWindow && frame.contentWindow.document));
      frameWin = frame && frame.contentWindow ? frame.contentWindow : null;
    } catch (_error) {}

    return PRODUCTION_MANIFEST.map(function each(item) {
      var scriptInDiagnostic = Boolean(findScript(item.path));
      var scriptInTarget = false;

      if (frameDoc) {
        try {
          scriptInTarget = Boolean(
            Array.prototype.slice.call(frameDoc.querySelectorAll("script[src]")).find(function findTargetScript(script) {
              var src = script.getAttribute("src") || script.src || "";
              return normalizePath(src) === item.path || src.indexOf(item.path) !== -1;
            })
          );
        } catch (_error) {}
      }

      var aliases = guessAliases(item.key);
      var observedAlias = "NONE";
      var observed = null;

      for (var i = 0; i < aliases.length; i += 1) {
        observed = readPath(aliases[i]);
        if (!observed && frameWin) {
          try {
            observed = aliases[i].split(".").reduce(function walk(cursor, part) {
              return cursor && cursor[part] !== undefined ? cursor[part] : null;
            }, frameWin);
          } catch (_error) {
            observed = null;
          }
        }
        if (observed) {
          observedAlias = aliases[i];
          break;
        }
      }

      var receipt = readReceipt(observed);
      var methods = methodKeys(observed);

      return {
        key: item.key,
        path: item.path,
        kind: item.kind,
        required: item.required,
        scriptInDiagnostic: scriptInDiagnostic,
        scriptInTarget: scriptInTarget,
        authorityObserved: Boolean(observed),
        authorityAlias: observedAlias,
        methodCount: methods.length,
        methodKeys: methods.join(","),
        contract: safeString(receipt.CONTRACT || receipt.contract || "UNKNOWN"),
        receipt: safeString(receipt.RECEIPT || receipt.receipt || "UNKNOWN"),
        componentStatus: safeString(receipt.componentStatus || receipt.status || "UNKNOWN")
      };
    });
  }

  function guessAliases(key) {
    var map = {
      CANVAS_BISHOP: ["HEARTH_CANVAS_BISHOP", "HEARTH.canvasBishop", "HEARTH.canvas", "DEXTER_LAB.hearthCanvasBishop"],
      HAND_GEOMETRY: ["HEARTH_CANVAS_HAND_GEOMETRY", "HEARTH.canvasHandGeometry", "DEXTER_LAB.hearthCanvasHandGeometry"],
      HAND_CONTEXT: ["HEARTH_CANVAS_HAND_CONTEXT", "HEARTH.canvasHandContext", "DEXTER_LAB.hearthCanvasHandContext"],
      HAND_PAINT: ["HEARTH_CANVAS_HAND_PAINT", "HEARTH.canvasHandPaint", "DEXTER_LAB.hearthCanvasHandPaint"],
      HAND_VIEW: ["HEARTH_CANVAS_HAND_VIEW", "HEARTH.canvasHandView", "DEXTER_LAB.hearthCanvasHandView"],
      HAND_INSPECT: ["HEARTH_CANVAS_HAND_INSPECT", "HEARTH.canvasHandInspect", "DEXTER_LAB.hearthCanvasHandInspect"],
      HEX_AUTHORITY_BRIDGE: ["HEARTH_HEX_FOUR_PAIR_AUTHORITY", "HEARTH.hexFourPairAuthority", "HEARTH.hexAuthority"],
      HEX_SURFACE_BRIDGE: ["HEARTH_HEX_SURFACE", "HEARTH.hexSurface", "HEARTH_HEX_SURFACE_RENDERER"],
      FINGER_SURFACE: ["HEARTH_CANVAS_FINGER_SURFACE", "HEARTH.canvasFingerSurface"],
      FINGER_BOUNDARY: ["HEARTH_CANVAS_FINGER_BOUNDARY", "HEARTH.canvasFingerBoundary"],
      FINGER_INSPECT: ["HEARTH_CANVAS_FINGER_INSPECT", "HEARTH.canvasFingerInspect"],
      FINGER_LIGHT: ["HEARTH_CANVAS_FINGER_LIGHT", "HEARTH.canvasFingerLight"]
    };
    return map[key] || [];
  }

  function productionManifestReport() {
    var manifest = inspectProductionManifest();
    var observed = manifest.filter(function each(item) {
      return item.scriptInTarget || item.authorityObserved;
    }).length;

    return basePacket("22", "Production Manifest", "PRODUCTION_MANIFEST", {
      RECEIPT_LEVEL: "4_PRODUCTION_AWARENESS_REPORT",
      AUDIT_ID: "productionManifest",
      PRODUCTION_MANIFEST_AWARENESS_ACTIVE: true,
      PRODUCTION_MANIFEST_COUNT: manifest.length,
      PRODUCTION_MANIFEST_OBSERVED_COUNT: observed,
      PRODUCTION_MANIFEST: manifest,
      NEXT_ACTION: observed ? "USE_MANIFEST_TO_SELECT_NEXT_DIAGNOSTIC_FILE" : "OPEN_TARGET_OR_LOAD_TARGET_FRAME",
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,TARGET_RENDERER"
    });
  }

  function basePacket(seq, label, component, extra) {
    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_WORKBENCH_REPORT_" + safeString(seq).replace(/[^A-Z0-9]/gi, "_") + "_v9_4_6",
      RECEIPT_LEVEL: "2_SINGLE_AUDIT_WORKBENCH_REPORT",
      AUDIT_SEQUENCE: seq,
      AUDIT_LABEL: label,
      COMPONENT: component,
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      CSS_CONTRACT: CSS_CONTRACT,
      HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      WORKBENCH_MODEL: "CATEGORY_BUBBLE_FILTERS_AUDIT_BUBBLE_LOCAL_REPORT_ACTIONS_WITH_RETURN_AND_MANIFEST_AWARENESS",
      REPORT_SOURCE_OF_TRUTH: "BUTTON_CONTROLLER_STATE",
      RUN_STATE: "REPORT_CREATED",
      TRUST_STATE: "CURRENT",
      BLOCKING: false,
      UPDATED_AT: nowIso()
    };

    Object.assign(packet, extra || {});
    Object.assign(packet, NO_CLAIMS);
    return packet;
  }

  function packetText(packet) {
    return Object.keys(packet || {}).map(function line(key) {
      var value = packet[key];
      if (value === undefined || value === null || value === "") return key + "=UNKNOWN";
      if (isObject(value) || Array.isArray(value)) {
        try { return key + "=" + JSON.stringify(value); }
        catch (_error) { return key + "=[object]"; }
      }
      return key + "=" + safeString(value);
    }).join("\n");
  }

  function renderManifestPanel() {
    var holder = $("manifestGrid");
    if (!holder) return;

    var manifest = inspectProductionManifest();
    holder.innerHTML = manifest.map(function card(item) {
      var found = item.scriptInTarget || item.authorityObserved;
      var cls = found ? "good" : item.required ? "bad" : "warn";
      return [
        '<div class="manifest-card ', cls, '">',
        '<b>', item.key, '</b>',
        '<span>', found ? "OBSERVED" : "HELD", '</span>',
        '</div>'
      ].join("");
    }).join("");
  }

  function createManifestReport() {
    var packet = productionManifestReport();
    setText("reportTitle", "Production Manifest");
    setText("reportMeta", "MANIFEST_REPORT_CREATED");
    setText("generatedReport", packetText(packet));
    setText("rawReport", JSON.stringify(packet, null, 2));
    var output = $("reportOutput");
    if (output) output.hidden = false;
    return packet;
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = safeString(value);
  }

  function goToHearth() {
    root.location.href = TARGET_ROUTE;
  }

  function toggleManifest() {
    var panel = $("manifestPanel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    if (!panel.hidden) renderManifestPanel();
  }

  function bind(id, eventName, handler) {
    var node = $(id);
    if (node) node.addEventListener(eventName, handler);
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      cssContract: CSS_CONTRACT,
      htmlShellContract: HTML_SHELL_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      productionManifest: PRODUCTION_MANIFEST,
      inspectProductionManifest: inspectProductionManifest,
      productionManifestReport: productionManifestReport,
      createManifestReport: createManifestReport,
      goToHearth: goToHearth
    };

    root.HEARTH_DIAGNOSTIC_CHAMBER_V946 = api;
    root.HEARTH.diagnosticChamberV946 = api;
    root.DEXTER_LAB.hearthDiagnosticChamberV946 = api;

    root.__HEARTH_DIAGNOSTIC_CHAMBER_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RETURN_TO_HEARTH_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PRODUCTION_MANIFEST_AWARENESS_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_RELEASE_AUTHORIZED__ = false;
  }

  function boot() {
    setText("controllerContract", INTERNAL_RENEWAL_CONTRACT);

    bind("returnToHearth", "click", goToHearth);
    bind("toggleManifest", "click", toggleManifest);
    bind("createManifestReport", "click", createManifestReport);

    var frame = $("hearthDiagnosticTargetFrame");
    if (frame) {
      frame.addEventListener("load", function onFrameLoad() {
        renderManifestPanel();
      });
    }

    publishApi();
    renderManifestPanel();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
