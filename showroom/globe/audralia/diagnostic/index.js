// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v1
// Full-file replacement.
// Reader-first controller.
// Owns: diagnostic route UI wiring, tab controls, target frame toggle, readable report rendering,
// station receipt rendering, copy actions, and explicit nine-cycle run orchestration.
// Does not own: diagnostic station logic, engine implementation, production mutation, renderer mutation,
// runtime restart, repair authorization, readiness claim, visual pass, WebGL/WebGPU initialization.

(function audraliaDiagnosticRouteReaderFirstController(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root.document || null;

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v1";
  var VERSION =
    "2026-06-14.audralia-diagnostic-route-reader-first-nine-cycle-read-3d-controller-v1";
  var FILE = "/showroom/globe/audralia/diagnostic/index.js";
  var TARGET_ROUTE = "/showroom/globe/audralia/";

  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";
  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var STATIONS = [
    {
      position: 1,
      stationId: "NORTH_PROBE_INTAKE",
      apiPath: "AUDRALIA_DIAGNOSTIC_PROBE_NORTH",
      label: "North Intake",
      fibonacci: "F1"
    },
    {
      position: 2,
      stationId: "EAST_PROBE_SOURCE",
      apiPath: "AUDRALIA_DIAGNOSTIC_PROBE_EAST",
      label: "East Source",
      fibonacci: "F3"
    },
    {
      position: 3,
      stationId: "EAST_CONSTRUCTION_INTERPRETATION",
      apiPath: "AUDRALIA_DIAGNOSTIC_EAST",
      label: "East Construction",
      fibonacci: "F5"
    },
    {
      position: 4,
      stationId: "CANVAS_SURFACE_TRUTH",
      apiPath: "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      label: "3D Surface Truth",
      fibonacci: "F8"
    },
    {
      position: 5,
      stationId: "WEST_PROBE_RUNTIME",
      apiPath: "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
      label: "West Runtime",
      fibonacci: "F13"
    },
    {
      position: 6,
      stationId: "WEST_RUNTIME_INTERPRETATION",
      apiPath: "AUDRALIA_DIAGNOSTIC_WEST",
      label: "West Interpretation",
      fibonacci: "F21"
    },
    {
      position: 7,
      stationId: "SOUTH_PROBE_HANDOFF",
      apiPath: "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
      label: "South Handoff",
      fibonacci: "F34"
    },
    {
      position: 8,
      stationId: "SOUTH_RESTITUTION_INTERPRETATION",
      apiPath: "AUDRALIA_DIAGNOSTIC_SOUTH",
      label: "South Restitution",
      fibonacci: "F55"
    },
    {
      position: 9,
      stationId: "RAIL_TERMINAL_SYNTHESIS",
      apiPath: "AUDRALIA_DIAGNOSTIC_RAIL",
      label: "Rail Synthesis",
      fibonacci: "F89"
    }
  ];

  var state = {
    cycleId: "",
    receipts: [],
    ledger: null,
    readerReport: "",
    rawLedgerText: "",
    lastRunAt: null
  };

  function $(id) {
    return doc ? doc.getElementById(id) : null;
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) {
        return null;
      }

      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function safeJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (_error) {
      return String(value);
    }
  }

  function toast(message) {
    var node = $("toast");
    if (!node) return;

    node.textContent = message;
    node.classList.add("show");

    root.clearTimeout(toast._timer);
    toast._timer = root.setTimeout(function hide() {
      node.classList.remove("show");
    }, 1800);
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = value;
  }

  function setDisabled(id, value) {
    var node = $(id);
    if (node) node.disabled = Boolean(value);
  }

  function setGauge(percent, className) {
    var gauge = $("overallGauge");
    var value = $("overallGaugeValue");

    if (!gauge || !value) return;

    var safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
    gauge.style.setProperty("--gauge", String(Math.round(safePercent * 3.6)) + "deg");
    gauge.classList.remove("good", "warn", "bad", "waiting");
    gauge.classList.add(className || "waiting");

    value.textContent = String(Math.round(safePercent)) + "%";
  }

  function makeCycleRequest(station) {
    return {
      schema: REQUEST_SCHEMA,
      cycleId: state.cycleId,
      position: station.position,
      stationId: station.stationId,
      mode: "AUDIT",
      subject: {
        subjectId: "AUDRALIA_DIAGNOSTIC_READER_ROUTE",
        subjectType: "THREE_D_DIAGNOSTIC_ROUTE",
        contract: CONTRACT,
        version: VERSION,
        file: FILE
      },
      engine: {
        contract: "DGB_ENGINE_SUBJECT_DECLARATION_PENDING",
        version: "UNKNOWN",
        file: "/assets/engine/dgb.engine.contract.js",
        surface: {
          backend: "WEBGL2",
          hostDeclared: true,
          contextDeclared: true,
          presentationDeclared: true,
          hostId: "audraliaDiagnosticTargetFrame",
          hostFile: "/showroom/globe/audralia/diagnostic/index.html",
          presentationTarget: "/showroom/globe/audralia/"
        },
        runtime: {
          evidenceKind: "DECLARED",
          runtimeId: "AUDRALIA_RUNTIME_SUBJECT",
          rendererKind: "THREE_D_ENGINE",
          backend: "WEBGL2",
          runtimeDeclared: true,
          runtimeActive: true,
          scenePresent: true,
          cameraPresent: true,
          geometryPresent: true,
          materialPresent: true,
          shaderOrPipelinePresent: true,
          renderPassObserved: true,
          commandSubmitted: true,
          presentationObserved: true,
          interactionObserved: false
        },
        handoff: {
          targetFile: "/assets/audralia/audralia.diagnostic.rail.js",
          targetRoute: "/showroom/globe/audralia/diagnostic/",
          returnMode: "DIAGNOSTIC_RESTITUTION",
          packetKind: "DIAGNOSTIC_HANDOFF_PACKET",
          downstreamOwner: "AUDRALIA_DIAGNOSTIC_RAIL",
          restitutionCandidateFile: "/assets/audralia/audralia.diagnostic.rail.js",
          packetIntegrity: true,
          provenanceContinuity: true,
          outputCompleteness: true
        },
        restitution: {
          mode: "AUDIT",
          ownerType: "DIAGNOSTIC_ROUTE",
          ownerFile: "/showroom/globe/audralia/diagnostic/index.js",
          ownerContract: CONTRACT,
          ownerComponent: "READER_FIRST_CONTROLLER",
          recommendedFile: "/showroom/globe/audralia/diagnostic/index.js",
          recommendedAction: "REVIEW_READER_FIRST_DIAGNOSTIC_OUTPUT"
        }
      },
      construct: {
        constructId: "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_NINE_CYCLE_READ_3D",
        contract: "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_NINE_CYCLE_READ_3D_STATIC_SHELL_TNT_v1",
        version: "1.0.0",
        route: "/showroom/globe/audralia/diagnostic/",
        rootFile: "/showroom/globe/audralia/diagnostic/index.html",
        dependencies: [
          "/showroom/globe/audralia/diagnostic/index.css",
          "/showroom/globe/audralia/diagnostic/index.js"
        ],
        surface: {
          backend: "WEBGL2",
          hostDeclared: true,
          contextDeclared: true,
          presentationDeclared: true,
          hostId: "audraliaDiagnosticTargetFrame",
          hostFile: "/showroom/globe/audralia/diagnostic/index.html",
          hostSelector: "#audraliaDiagnosticTargetFrame",
          presentationTarget: "/showroom/globe/audralia/",
          hostEvidenceKind: "DECLARED",
          contextEvidenceKind: "DECLARED"
        },
        runtime: {
          evidenceKind: "DECLARED",
          runtimeId: "AUDRALIA_RUNTIME_SUBJECT",
          rendererKind: "THREE_D_ENGINE",
          backend: "WEBGL2",
          runtimeDeclared: true,
          runtimeActive: true,
          scenePresent: true,
          cameraPresent: true,
          geometryPresent: true,
          materialPresent: true,
          shaderOrPipelinePresent: true,
          renderPassObserved: true,
          commandSubmitted: true,
          presentationObserved: true,
          interactionObserved: false
        },
        handoff: {
          targetFile: "/assets/audralia/audralia.diagnostic.rail.js",
          targetRoute: "/showroom/globe/audralia/diagnostic/",
          returnMode: "DIAGNOSTIC_RESTITUTION",
          packetKind: "DIAGNOSTIC_HANDOFF_PACKET",
          downstreamOwner: "AUDRALIA_DIAGNOSTIC_RAIL",
          restitutionCandidateFile: "/assets/audralia/audralia.diagnostic.rail.js",
          packetIntegrity: true,
          provenanceContinuity: true,
          outputCompleteness: true
        },
        restitution: {
          mode: "AUDIT",
          ownerType: "DIAGNOSTIC_ROUTE",
          ownerFile: "/showroom/globe/audralia/diagnostic/index.js",
          ownerContract: CONTRACT,
          ownerComponent: "READER_FIRST_CONTROLLER",
          recommendedFile: "/showroom/globe/audralia/diagnostic/index.js",
          recommendedAction: "REVIEW_READER_FIRST_DIAGNOSTIC_OUTPUT"
        }
      },
      extensions: {},
      priorStationReceipts: state.receipts.slice(),
      priorLedgerHash: state.ledger && state.ledger.ledgerHash ? state.ledger.ledgerHash : null,
      terminalSynthesisMode: station.stationId === "RAIL_TERMINAL_SYNTHESIS"
    };
  }

  function executeStation(station) {
    var api = readPath(station.apiPath);

    if (!api || !isFunction(api.executeCycleStation)) {
      return {
        schema: RECEIPT_SCHEMA,
        cycleId: state.cycleId,
        position: station.position,
        stationId: station.stationId,
        contract: "MISSING_STATION_API",
        version: "UNKNOWN",
        file: "UNKNOWN",
        status: "ERROR",
        completed: false,
        handoffEligible: false,
        summary: "Station API was not found on the page.",
        observations: [],
        evidence: [],
        issues: [
          {
            code: "STATION_API_NOT_FOUND",
            path: station.apiPath,
            detail: "Expected global station API is missing."
          }
        ],
        firstHeldCoordinate: null,
        firstFailedCoordinate: null,
        firstConflictCoordinate: null,
        generatedAt: nowIso(),
        noClaims: {}
      };
    }

    try {
      return api.executeCycleStation(makeCycleRequest(station));
    } catch (error) {
      return {
        schema: RECEIPT_SCHEMA,
        cycleId: state.cycleId,
        position: station.position,
        stationId: station.stationId,
        contract: api.CONTRACT || "STATION_API_THROW",
        version: api.VERSION || "UNKNOWN",
        file: api.FILE || "UNKNOWN",
        status: "ERROR",
        completed: false,
        handoffEligible: false,
        summary: "Station threw during execution.",
        observations: [],
        evidence: [],
        issues: [
          {
            code: "STATION_EXECUTION_THROW",
            path: station.apiPath,
            detail: String(error && error.message ? error.message : error)
          }
        ],
        firstHeldCoordinate: null,
        firstFailedCoordinate: null,
        firstConflictCoordinate: null,
        generatedAt: nowIso(),
        noClaims: {}
      };
    }
  }

  function runDiagnostic() {
    state.cycleId = "AUDRALIA_DIAGNOSTIC_CYCLE_" + Date.now();
    state.receipts = [];
    state.ledger = null;
    state.lastRunAt = nowIso();

    STATIONS.forEach(function each(station) {
      var receipt = executeStation(station);
      state.receipts.push(receipt);
    });

    state.ledger = composeLedger();
    state.rawLedgerText = safeJson(state.ledger);
    state.readerReport = composeReaderReport(state.ledger);

    renderAll();

    toast("Diagnostic run complete.");
  }

  function composeLedger() {
    var pass = state.receipts.filter(function count(r) { return r.status === "PASS"; }).length;
    var hold = state.receipts.filter(function count(r) { return r.status === "HOLD"; }).length;
    var fail = state.receipts.filter(function count(r) { return r.status === "FAIL"; }).length;
    var conflict = state.receipts.filter(function count(r) { return r.status === "CONFLICT"; }).length;
    var error = state.receipts.filter(function count(r) { return r.status === "ERROR"; }).length;

    var terminal = state.receipts[state.receipts.length - 1] || null;

    var ledger = {
      schema: "AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v1",
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      cycleId: state.cycleId,
      generatedAt: nowIso(),
      targetRoute: TARGET_ROUTE,
      receiptCount: state.receipts.length,
      passCount: pass,
      holdCount: hold,
      failCount: fail,
      conflictCount: conflict,
      errorCount: error,
      terminalStatus: terminal ? terminal.status : "UNKNOWN",
      terminalSummary: terminal ? terminal.summary : "No terminal receipt.",
      receipts: state.receipts,
      noClaims: {
        productionMutationAuthorized: false,
        runtimeRestartAuthorized: false,
        rendererMutationAuthorized: false,
        repairAuthorized: false,
        readyClaimed: false,
        visualPassClaimed: false
      }
    };

    ledger.ledgerHash = hashObject(ledger);
    return ledger;
  }

  function hashObject(value) {
    var text = safeJson(value);
    var h = 0x811c9dc5;

    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function composeReaderReport(ledger) {
    var attention = ledger.failCount + ledger.conflictCount + ledger.errorCount;

    return [
      "AUDRALIA DIAGNOSTIC READER REPORT",
      "",
      "Overall status: " + readableOverall(ledger),
      "Passed stations: " + ledger.passCount + " of " + ledger.receiptCount,
      "Held stations: " + ledger.holdCount,
      "Attention items: " + attention,
      "",
      "Plain-language reading:",
      plainLanguage(ledger),
      "",
      "Terminal summary:",
      ledger.terminalSummary,
      "",
      "Boundary:",
      "This report does not authorize production mutation, runtime restart, renderer mutation, repair, readiness, or visual pass.",
      "",
      "Ledger hash:",
      ledger.ledgerHash
    ].join("\n");
  }

  function readableOverall(ledger) {
    if (!ledger) return "Waiting";
    if (ledger.errorCount) return "Error reported";
    if (ledger.conflictCount) return "Conflict reported";
    if (ledger.failCount) return "Failure reported";
    if (ledger.holdCount) return "Held for evidence";
    if (ledger.passCount === ledger.receiptCount) return "Complete diagnostic path";
    return "Incomplete diagnostic path";
  }

  function plainLanguage(ledger) {
    if (!ledger) {
      return "No diagnostic ledger has been produced yet.";
    }

    if (ledger.errorCount) {
      return "The diagnostic path encountered a technical execution error. Open the receipt list to locate the station that failed to run.";
    }

    if (ledger.conflictCount) {
      return "The diagnostic path found incompatible claims. The technical receipts identify where the conflict occurred.";
    }

    if (ledger.failCount) {
      return "The diagnostic path found a failed condition. This does not authorize repair; it identifies what needs separate review.";
    }

    if (ledger.holdCount) {
      return "The diagnostic path is held because one or more stations need more evidence before a positive reading can be made.";
    }

    if (ledger.passCount === ledger.receiptCount) {
      return "All nine diagnostic stations returned a passing diagnostic receipt. This is a diagnostic completion only, not an engine-ready claim.";
    }

    return "The diagnostic path is incomplete. Run the diagnostic again or inspect missing station receipts.";
  }

  function renderAll() {
    renderSummary();
    renderCycleMap();
    renderReceipts();
    renderTechnical();
  }

  function renderSummary() {
    var ledger = state.ledger;
    var attention = ledger ? ledger.failCount + ledger.conflictCount + ledger.errorCount : 0;
    var percent = ledger && ledger.receiptCount ? (ledger.passCount / ledger.receiptCount) * 100 : 0;

    setText("passedCount", ledger ? String(ledger.passCount) : "0");
    setText("heldCount", ledger ? String(ledger.holdCount) : "0");
    setText("attentionCount", ledger ? String(attention) : "0");
    setText("plainSummary", plainLanguage(ledger));
    setText("overallStatus", readableOverall(ledger));
    setText(
      "overallStatusDetail",
      ledger
        ? ledger.terminalSummary
        : "The system has not produced a ledger yet."
    );

    setGauge(
      percent,
      !ledger
        ? "waiting"
        : attention
          ? "bad"
          : ledger.holdCount
            ? "warn"
            : "good"
    );

    setDisabled("copyReaderReport", !ledger);
    setDisabled("copyReceiptLedger", !ledger);
  }

  function renderCycleMap() {
    if (!doc) return;

    STATIONS.forEach(function each(station) {
      var node = doc.querySelector('[data-station="' + station.stationId + '"]');
      var receipt = state.receipts.find(function find(r) {
        return r.stationId === station.stationId;
      });

      if (!node) return;

      node.classList.remove("pass", "hold", "fail", "conflict", "error");

      if (!receipt) return;

      node.classList.add(String(receipt.status || "").toLowerCase());
      node.setAttribute(
        "title",
        station.label + ": " + (receipt.summary || receipt.status || "UNKNOWN")
      );
    });
  }

  function renderReceipts() {
    var list = $("receiptList");
    if (!list) return;

    if (!state.receipts.length) {
      list.innerHTML =
        '<article class="receipt-empty"><h3>No receipts yet</h3><p>Run the diagnostic track to populate station receipts.</p></article>';
      return;
    }

    list.innerHTML = state.receipts.map(function map(receipt, index) {
      var label = stationLabel(receipt.stationId);
      var status = receipt.status || "UNKNOWN";
      var summary = receipt.summary || "No summary.";
      var issueCount = Array.isArray(receipt.issues) ? receipt.issues.length : 0;

      return [
        '<details class="receipt-card ' + escapeHtml(status.toLowerCase()) + '">',
        '<summary>' + escapeHtml(String(index + 1)) + " · " + escapeHtml(label) + " · " + escapeHtml(status) + '</summary>',
        '<div class="receipt-meta">',
        '<span>' + escapeHtml(receipt.stationId || "UNKNOWN") + '</span>',
        '<span>' + escapeHtml(receipt.fibonacci || "") + '</span>',
        '<span>Issues: ' + escapeHtml(String(issueCount)) + '</span>',
        '</div>',
        '<p>' + escapeHtml(summary) + '</p>',
        '<pre>' + escapeHtml(safeJson(receipt)) + '</pre>',
        '</details>'
      ].join("");
    }).join("");
  }

  function renderTechnical() {
    setText("ledgerOutput", state.ledger ? state.rawLedgerText : "No ledger produced yet.");
    setText("rawReceiptsOutput", state.receipts.length ? safeJson(state.receipts) : "No receipts produced yet.");
  }

  function stationLabel(stationId) {
    var found = STATIONS.find(function find(station) {
      return station.stationId === stationId;
    });

    return found ? found.label : stationId || "Unknown Station";
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function copyText(text, message) {
    if (!text) return;

    if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
      root.navigator.clipboard.writeText(text).then(function copied() {
        toast(message || "Copied.");
      }).catch(function failed() {
        fallbackCopy(text, message);
      });
      return;
    }

    fallbackCopy(text, message);
  }

  function fallbackCopy(text, message) {
    if (!doc) return;

    var area = doc.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "true");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    doc.body.appendChild(area);
    area.select();

    try {
      doc.execCommand("copy");
      toast(message || "Copied.");
    } catch (_error) {
      toast("Copy unavailable.");
    }

    doc.body.removeChild(area);
  }

  function wireTabs() {
    if (!doc) return;

    var buttons = Array.prototype.slice.call(doc.querySelectorAll("[data-tab]"));
    var panels = {
      ledger: $("tabLedger"),
      receipts: $("tabReceipts"),
      contracts: $("tabContracts"),
      boundary: $("tabBoundary")
    };

    buttons.forEach(function each(button) {
      button.addEventListener("click", function onClick() {
        var tab = button.getAttribute("data-tab");

        buttons.forEach(function reset(other) {
          other.setAttribute("aria-selected", other === button ? "true" : "false");
        });

        Object.keys(panels).forEach(function eachPanel(key) {
          if (panels[key]) panels[key].hidden = key !== tab;
        });
      });
    });
  }

  function wireUi() {
    var run = $("runDiagnostic");
    var target = $("toggleTargetFrame");
    var copyReader = $("copyReaderReport");
    var copyLedger = $("copyReceiptLedger");

    if (run) {
      run.addEventListener("click", runDiagnostic);
    }

    if (target) {
      target.addEventListener("click", function toggleTarget() {
        var shell = $("targetFrameShell");
        if (!shell) return;
        shell.hidden = !shell.hidden;
      });
    }

    if (copyReader) {
      copyReader.addEventListener("click", function copyReport() {
        copyText(state.readerReport, "Reader report copied.");
      });
    }

    if (copyLedger) {
      copyLedger.addEventListener("click", function copyLedgerText() {
        copyText(state.rawLedgerText, "Receipt ledger copied.");
      });
    }

    wireTabs();
  }

  function publishApi() {
    var api = {
      CONTRACT: CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      runDiagnostic: runDiagnostic,
      getState: function getState() {
        return {
          cycleId: state.cycleId,
          lastRunAt: state.lastRunAt,
          receiptCount: state.receipts.length,
          ledger: state.ledger,
          receipts: state.receipts
        };
      },
      getLedger: function getLedger() {
        return state.ledger;
      },
      getReaderReport: function getReaderReport() {
        return state.readerReport;
      }
    };

    root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER = api;

    if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.diagnosticRouteController = api;
    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_VERSION__ = VERSION;

    return api;
  }

  function init() {
    wireUi();
    publishApi();
    renderAll();
    toast("Audralia diagnostic page loaded.");
  }

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
