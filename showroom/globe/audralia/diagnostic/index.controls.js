// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v2
// Full-file replacement.
// Functional coordinative renewal.
//
// CANONICAL AUTHORITY:
// - AUDRALIA_DIAGNOSTIC_OWNERSHIP_STANDARD_LOCK_v1
// - AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1
// - AUDRALIA_DIAGNOSTIC_CONTROLS_NEWS_FIBONACCI_COORDINATIVE_AUDIT_v1
//
// N.E.W.S. / FIBONACCI AUTHORITY:
// - SOUTH / F34:
//   Human-command handoff.
// - SOUTH / F55:
//   Participant-facing restitution and control presentation.
//
// FUNCTIONAL TARGET:
// - Parse successfully.
// - Bind all controls.
// - Observe Create Report activation.
// - Resolve the renewed engine API.
// - Invoke engine.createReport().
// - Render the returned canonical READ report.
// - Expose report, engine, inspection, cycle, and control receipts.
// - Produce and render a fallback READ report if engine invocation fails.
// - Never leave Create Report at unchanged READY after activation.
//
// DOES NOT OWN:
// - unsafe external inspection;
// - participant discovery;
// - diagnostic interpretation;
// - Fibonacci synchronization judgment;
// - canonical report construction when the engine is healthy;
// - direct execution implementation;
// - conductor execution;
// - nine-cycle validation;
// - report archive authority;
// - F21 interpretation;
// - F89 terminal commitment;
// - production mutation;
// - runtime repair;
// - renderer repair;
// - canvas repair.
//
// LOAD ORDER:
// 15. index.inspection.lane.js
// 16. index.js
// 17. index.controls.js

(function installAudraliaDiagnosticControlPanel(global) {
  "use strict";

  var root =
    global ||
    (
      typeof window !== "undefined"
        ? window
        : typeof globalThis !== "undefined"
          ? globalThis
          : this
    );

  var doc =
    root && root.document
      ? root.document
      : null;

  if (!doc) {
    return;
  }

  var CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v2";

  var VERSION =
    "2.1.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.controls.js";

  var AUTHORITY =
    "AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1";

  var EXPECTED_ENGINE_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var FALLBACK_REPORT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v2";

  var FALLBACK_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v2";

  var CONTROL_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT_v2";

  var ENGINE_GLOBAL_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
      "AUDRALIA.diagnosticEngine",

      // Compatibility paths.
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
      "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
      "AUDRALIA.dropWithReadDiagnosticObservatory",
      "AUDRALIA.diagnosticRouteController"
    ]);

  var VALID_ENGINE_STATES =
    Object.freeze([
      "READY",
      "AVAILABLE",
      "ACTIVE"
    ]);

  var CONTROL_IDS =
    Object.freeze([
      "returnToAudralia",
      "toggleObservationTarget",
      "reloadObservatory",
      "createDeepArchive",
      "resetWorkbench",

      "auditOrbitButton",
      "participantConstellationButton",

      "categorySelectorButton",
      "auditSelectorButton",

      "createReport",
      "runDirectCheck",
      "runNineCycle",
      "copyReadableReport",
      "copyPacketReport",
      "copyRawReport",
      "addReportToArchive",
      "resetCurrentReport",

      "reportReadButton",
      "reportPacketButton",
      "reportRawButton",
      "reportEvidenceButton",

      "targetLensButton",
      "runtimeLensButton",
      "surfaceLensButton",
      "targetWindowButton",

      "expandTargetWindow",
      "reloadTargetFrame",

      "cycleChamberButton",
      "registryChamberButton",
      "receiptChamberButton",
      "archiveChamberButton",
      "boundaryChamberButton"
    ]);

  var NO_CLAIMS =
    Object.freeze({
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      rendererMutationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      diagnosticInterpretationOwned: false,
      fibonacciJudgmentOwned: false,
      reportCommitOwned: false,
      f21Claimed: false,
      f89Claimed: false
    });

  var state = {
    initialized: false,
    initializedAt: null,

    engine: {
      resolved: false,
      compatible: false,
      ready: false,
      path: null,
      contract: null,
      status: null,
      reason: "ENGINE_NOT_RESOLVED"
    },

    controls: {
      manifestCount: CONTROL_IDS.length,
      discoveredCount: 0,
      missingCount: 0,
      missing: [],
      createReportPresent: false,
      eventDelegationActive: false
    },

    ui: {
      leftOrbit: "audits",
      reportMode: "read",
      observationLens: "target",
      instrumentChamber: "cycle",
      categoryMenuOpen: false,
      auditMenuOpen: false,
      targetVisible: false,
      targetExpanded: false,
      receiptFilter: "all",
      selectedReceiptIndex: null,
      selectedCategory: "ALL",
      selectedAudit: "READ",
      selectedParticipant: "ALL"
    },

    report: {
      current: null,
      receipt: null,
      source: null,
      fallbackHistory: []
    },

    cycleReceipt: null,
    visibleReceipts: [],

    actionCount: 0,
    clickCount: 0,
    createReportClickCount: 0,
    errorCount: 0,

    lastAction: null,
    lastError: null
  };

  function byId(id) {
    return doc.getElementById(id);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isObject(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function clone(value, seen) {
    var memory =
      seen || [];

    var output;
    var keys;

    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "function") {
      return {
        type: "Function",
        name: value.name || "anonymous"
      };
    }

    if (memory.indexOf(value) !== -1) {
      return "[Circular]";
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value.map(function cloneArrayEntry(entry) {
        return clone(
          entry,
          memory.slice()
        );
      });
    }

    output = {};

    try {
      keys = Object.keys(value);
    } catch (_error) {
      return {
        unreadable: true
      };
    }

    keys.forEach(function cloneProperty(key) {
      try {
        output[key] =
          clone(
            value[key],
            memory.slice()
          );
      } catch (_error) {
        output[key] =
          "[Unreadable]";
      }
    });

    return output;
  }

  function deepFreeze(value, seen) {
    var memory =
      seen || [];

    if (
      !value ||
      (
        typeof value !== "object" &&
        typeof value !== "function"
      )
    ) {
      return value;
    }

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    try {
      Object.keys(value).forEach(function freezeProperty(key) {
        try {
          deepFreeze(
            value[key],
            memory
          );
        } catch (_error) {}
      });

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function frozenClone(value) {
    return deepFreeze(
      clone(value)
    );
  }

  function safeJson(value) {
    try {
      return JSON.stringify(
        clone(value),
        null,
        2
      );
    } catch (_error) {
      return String(value);
    }
  }

  function escapeHtml(value) {
    return String(
      value === null ||
      value === undefined
        ? ""
        : value
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cssEscape(value) {
    if (
      root.CSS &&
      isFunction(root.CSS.escape)
    ) {
      return root.CSS.escape(
        String(value)
      );
    }

    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      root;

    var index;

    for (
      index = 0;
      index < parts.length;
      index += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined
      ) {
        return null;
      }

      try {
        cursor =
          cursor[parts[index]];
      } catch (_error) {
        return null;
      }

      if (
        cursor === null ||
        cursor === undefined
      ) {
        return null;
      }
    }

    return cursor;
  }

  function setText(id, value) {
    var node =
      byId(id);

    if (!node) {
      return;
    }

    node.textContent =
      value === null ||
      value === undefined
        ? ""
        : String(value);
  }

  function setHtml(id, value) {
    var node =
      byId(id);

    if (!node) {
      return;
    }

    node.innerHTML =
      String(value || "");
  }

  function setHidden(id, hidden) {
    var node =
      byId(id);

    if (node) {
      node.hidden =
        Boolean(hidden);
    }
  }

  function setDisabled(id, disabled) {
    var node =
      byId(id);

    if (node) {
      node.disabled =
        Boolean(disabled);
    }
  }

  function setStatus(idOrNode, status) {
    var node =
      typeof idOrNode === "string"
        ? byId(idOrNode)
        : idOrNode;

    if (!node) {
      return;
    }

    node.setAttribute(
      "data-status",
      String(status || "UNKNOWN")
        .trim()
        .toUpperCase()
    );
  }

  function toast(message, status) {
    var node =
      byId("toast");

    if (!node) {
      return;
    }

    node.textContent =
      String(message || "");

    node.setAttribute(
      "data-status",
      String(status || "READY")
        .toUpperCase()
    );

    node.classList.add("show");
    node.classList.add("visible");

    node.setAttribute(
      "data-visible",
      "true"
    );

    if (
      toast._timer &&
      root.clearTimeout
    ) {
      root.clearTimeout(
        toast._timer
      );
    }

    toast._timer =
      root.setTimeout(function hideToast() {
        node.classList.remove("show");
        node.classList.remove("visible");

        node.setAttribute(
          "data-visible",
          "false"
        );
      }, 2800);
  }

  function recordAction(action, detail) {
    state.actionCount += 1;

    state.lastAction = {
      action: action,
      detail:
        clone(detail || null),
      actionNumber:
        state.actionCount,
      occurredAt:
        nowIso()
    };

    publishReceipt();
  }

  function recordError(action, error, detail) {
    state.errorCount += 1;

    state.lastError = {
      action: action,
      message:
        String(
          error &&
          error.message
            ? error.message
            : error
        ),
      detail:
        clone(detail || null),
      errorNumber:
        state.errorCount,
      occurredAt:
        nowIso()
    };

    setText(
      "controllerState",
      "CONTROL ERROR"
    );

    setStatus(
      "controllerState",
      "ERROR"
    );

    publishReceipt();

    toast(
      state.lastError.message,
      "ERROR"
    );

    return frozenClone(
      state.lastError
    );
  }

  function deriveEngineStatus(
    engine,
    publicState
  ) {
    var candidates = [
      engine && engine.STATUS,
      engine && engine.status,
      publicState && publicState.status,
      publicState && publicState.engineStatus,
      publicState && publicState.reportStatus
    ];

    var index;

    for (
      index = 0;
      index < candidates.length;
      index += 1
    ) {
      if (
        typeof candidates[index] === "string" &&
        candidates[index].trim()
      ) {
        return candidates[index]
          .trim()
          .toUpperCase();
      }
    }

    if (
      publicState &&
      publicState.initialized === true
    ) {
      return "READY";
    }

    return "UNKNOWN";
  }

  function resolveEngine() {
    var index;
    var candidate;
    var candidatePath;
    var publicState;
    var status;
    var contract;

    state.engine = {
      resolved: false,
      compatible: false,
      ready: false,
      path: null,
      contract: null,
      status: null,
      reason: "ENGINE_NOT_FOUND"
    };

    for (
      index = 0;
      index < ENGINE_GLOBAL_PATHS.length;
      index += 1
    ) {
      candidatePath =
        ENGINE_GLOBAL_PATHS[index];

      candidate =
        readPath(candidatePath);

      if (
        !candidate ||
        typeof candidate !== "object"
      ) {
        continue;
      }

      contract =
        typeof candidate.CONTRACT === "string"
          ? candidate.CONTRACT
          : typeof candidate.contract === "string"
            ? candidate.contract
            : null;

      state.engine.resolved =
        true;

      state.engine.path =
        candidatePath;

      state.engine.contract =
        contract;

      if (
        contract !==
        EXPECTED_ENGINE_CONTRACT
      ) {
        state.engine.reason =
          "ENGINE_CONTRACT_MISMATCH";

        continue;
      }

      state.engine.compatible =
        true;

      try {
        publicState =
          isFunction(candidate.getState)
            ? candidate.getState()
            : null;
      } catch (_error) {
        publicState =
          null;
      }

      status =
        deriveEngineStatus(
          candidate,
          publicState
        );

      state.engine.status =
        status;

      state.engine.ready =
        VALID_ENGINE_STATES.indexOf(
          status
        ) !== -1 &&
        isFunction(
          candidate.createReport
        );

      state.engine.reason =
        state.engine.ready
          ? "ENGINE_READY"
          : isFunction(candidate.createReport)
            ? "ENGINE_NOT_READY"
            : "ENGINE_CREATE_REPORT_MISSING";

      if (state.engine.ready) {
        publishReceipt();
        return candidate;
      }
    }

    publishReceipt();

    return null;
  }

  function getCompatibleEngine() {
    var engine =
      resolveEngine();

    if (engine) {
      return engine;
    }

    var index;
    var candidate;
    var contract;

    for (
      index = 0;
      index < ENGINE_GLOBAL_PATHS.length;
      index += 1
    ) {
      candidate =
        readPath(
          ENGINE_GLOBAL_PATHS[index]
        );

      if (
        !candidate ||
        typeof candidate !== "object"
      ) {
        continue;
      }

      contract =
        candidate.CONTRACT ||
        candidate.contract ||
        null;

      if (
        contract ===
        EXPECTED_ENGINE_CONTRACT
      ) {
        return candidate;
      }
    }

    return null;
  }

  function validateReport(report) {
    return Boolean(
      isObject(report) &&
      (
        report.reportId ||
        report.schema ||
        report.READ ||
        report.read
      )
    );
  }

  function normalizeRead(report) {
    var canonical =
      report && report.READ
        ? report.READ
        : report && report.read
          ? report.read
          : null;

    return {
      Result:
        canonical && canonical.Result !== undefined
          ? canonical.Result
          : canonical && canonical.result !== undefined
            ? canonical.result
            : report && report.result !== undefined
              ? report.result
              : "A report was created.",

      Evidence:
        canonical && Array.isArray(canonical.Evidence)
          ? canonical.Evidence
          : canonical && Array.isArray(canonical.evidence)
            ? canonical.evidence
            : report && Array.isArray(report.evidence)
              ? report.evidence
              : [],

      Absence:
        canonical && Array.isArray(canonical.Absence)
          ? canonical.Absence
          : canonical && Array.isArray(canonical.absence)
            ? canonical.absence
            : report && Array.isArray(report.absence)
              ? report.absence
              : [],

      Direction:
        canonical && Array.isArray(canonical.Direction)
          ? canonical.Direction
          : canonical && Array.isArray(canonical.direction)
            ? canonical.direction
            : report && Array.isArray(report.direction)
              ? report.direction
              : []
    };
  }

  function getEngineReportReceipt(engine) {
    var receipt = null;

    try {
      if (
        engine &&
        isFunction(engine.getReportReceipt)
      ) {
        receipt =
          engine.getReportReceipt();
      }
    } catch (_error) {}

    if (!receipt) {
      receipt =
        root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT ||
        null;
    }

    return receipt;
  }

  function getEngineReport(engine) {
    var report = null;

    try {
      if (
        engine &&
        isFunction(engine.getReport)
      ) {
        report =
          engine.getReport();
      }
    } catch (_error) {}

    if (!report) {
      report =
        root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT ||
        null;
    }

    return report;
  }

  function renderReadRegion(
    id,
    letter,
    label,
    headline,
    entries
  ) {
    var values =
      Array.isArray(entries)
        ? entries
        : [entries];

    setHtml(
      id,
      "<header>" +
        "<span>" +
        escapeHtml(letter) +
        "</span>" +
        "<div>" +
        "<p>" +
        escapeHtml(label) +
        "</p>" +
        "<strong>" +
        escapeHtml(headline) +
        "</strong>" +
        "</div>" +
        "</header>" +
        (
          values.length > 1
            ? "<ul>" +
              values
                .map(function renderEntry(entry) {
                  return (
                    "<li>" +
                    escapeHtml(entry) +
                    "</li>"
                  );
                })
                .join("") +
              "</ul>"
            : "<p>" +
              escapeHtml(
                values[0] || ""
              ) +
              "</p>"
        )
    );
  }

  function deriveReadableReport(
    report,
    receipt
  ) {
    var read =
      normalizeRead(report);

    return [
      "AUDRALIA DROP WITH READ DIAGNOSTIC REPORT",
      "REPORT_ID=" +
        String(
          report.reportId || "UNKNOWN"
        ),
      "STATUS=" +
        String(
          report.status || "AVAILABLE"
        ),
      "CREATED_AT=" +
        String(
          report.createdAt || "UNKNOWN"
        ),
      receipt
        ? "RECEIPT_ID=" +
          String(
            receipt.receiptId || "UNKNOWN"
          )
        : "RECEIPT_ID=UNAVAILABLE",
      "",
      "RESULT",
      String(read.Result),
      "",
      "EVIDENCE",
      read.Evidence
        .map(function mapEvidence(entry) {
          return "- " + entry;
        })
        .join("\n"),
      "",
      "ABSENCE",
      read.Absence
        .map(function mapAbsence(entry) {
          return "- " + entry;
        })
        .join("\n"),
      "",
      "DIRECTION",
      read.Direction
        .map(function mapDirection(entry) {
          return "- " + entry;
        })
        .join("\n")
    ].join("\n");
  }

  function renderHealthyReport(
    report,
    receipt
  ) {
    var read =
      normalizeRead(report);

    var status =
      String(
        report.status || "AVAILABLE"
      ).toUpperCase();

    renderReadRegion(
      "readResult",
      "R",
      "Result",
      "Diagnostic report",
      read.Result
    );

    renderReadRegion(
      "readEvidence",
      "E",
      "Evidence",
      "Bounded evidence",
      read.Evidence.length
        ? read.Evidence
        : [
            "No evidence entries were returned."
          ]
    );

    renderReadRegion(
      "readAbsence",
      "A",
      "Absence",
      "Bounded absence",
      read.Absence.length
        ? read.Absence
        : [
            "No absence entries were returned."
          ]
    );

    renderReadRegion(
      "readDirection",
      "D",
      "Direction",
      "Next diagnostic direction",
      read.Direction.length
        ? read.Direction
        : [
            "Inspect the report receipt."
          ]
    );

    setText(
      "reportStatus",
      status
    );

    setStatus(
      "reportStatus",
      status
    );

    setText(
      "reportTitle",
      "Diagnostic Report"
    );

    setText(
      "reportCreatedAt",
      report.createdAt || nowIso()
    );

    setText(
      "reportMeta",
      [
        report.reportId || "REPORT",
        receipt && receipt.receiptId
          ? receipt.receiptId
          : "RECEIPT UNAVAILABLE"
      ].join(" · ")
    );

    setText(
      "packetOutput",
      safeJson({
        schema:
          report.schema || null,
        reportId:
          report.reportId || null,
        status:
          report.status || null,
        createdAt:
          report.createdAt || null,
        READ:
          read,
        receipt:
          receipt || null
      })
    );

    setText(
      "rawOutput",
      safeJson({
        report:
          report,
        receipt:
          receipt
      })
    );

    setHtml(
      "evidenceOutput",
      read.Evidence.length
        ? read.Evidence
            .map(function renderEvidence(entry) {
              return (
                "<article>" +
                  "<h3>Diagnostic Evidence</h3>" +
                  "<p>" +
                  escapeHtml(entry) +
                  "</p>" +
                  "</article>"
              );
            })
            .join("")
        : (
            '<article class="empty-state">' +
              "<h3>No evidence entries</h3>" +
              "<p>The report did not include an evidence list.</p>" +
              "</article>"
          )
    );

    setDisabled(
      "copyReadableReport",
      false
    );

    setDisabled(
      "copyPacketReport",
      false
    );

    setDisabled(
      "copyRawReport",
      false
    );

    setDisabled(
      "addReportToArchive",
      false
    );

    setText(
      "dropReportState",
      status
    );

    setStatus(
      "dropReportCell",
      status
    );

    setText(
      "dropReportAvailableCount",
      "1"
    );

    setText(
      "dropReportHeldCount",
      status === "HELD"
        ? "1"
        : "0"
    );

    setText(
      "dropReportLastAction",
      "Report created at " +
        String(
          report.createdAt || nowIso()
        )
    );

    setText(
      "controllerState",
      "REPORT READY"
    );

    setStatus(
      "controllerState",
      "READY"
    );

    state.report.current =
      deepFreeze(
        clone(report)
      );

    state.report.receipt =
      receipt
        ? deepFreeze(
            clone(receipt)
          )
        : null;

    state.report.source =
      "ENGINE";

    selectReportModeLocal(
      "read"
    );

    renderReceiptList();
    publishReceipt();
  }

  function createFallbackReport(context) {
    var reason =
      context && context.reason
        ? context.reason
        : "ENGINE_UNAVAILABLE";

    var errorMessage =
      context &&
      context.error &&
      context.error.message
        ? context.error.message
        : null;

    var report = {
      schema:
        FALLBACK_REPORT_SCHEMA,

      reportId:
        "AUDRALIA_CONTROL_FALLBACK_" +
        Date.now(),

      status:
        "HELD",

      classification:
        "CONTROL_FALLBACK_REPORT",

      createdAt:
        nowIso(),

      result:
        "The Create Report command was received, but the authoritative diagnostic engine could not produce a healthy report.",

      evidence: [
        "The Create Report control received a user activation.",
        "The controls file parsed and initialized.",
        "Delegated event handling observed the command.",
        "The fallback READ path remained available."
      ],

      absence: [
        reason,
        errorMessage ||
          "No additional engine exception message was supplied.",
        "Healthy engine-backed report construction was unavailable."
      ],

      direction: [
        "Inspect the control-panel receipt.",
        "Inspect the engine receipt.",
        "Inspect the inspection-lane receipt.",
        "Verify the current engine global and contract."
      ],

      engineResolution:
        frozenClone(
          state.engine
        ),

      noClaims:
        NO_CLAIMS
    };

    var receipt = {
      schema:
        FALLBACK_RECEIPT_SCHEMA,

      receiptId:
        "AUDRALIA_CONTROL_FALLBACK_RECEIPT_" +
        Date.now(),

      reportId:
        report.reportId,

      status:
        "HELD",

      reason:
        reason,

      createdAt:
        report.createdAt
    };

    state.report.current =
      deepFreeze(report);

    state.report.receipt =
      deepFreeze(receipt);

    state.report.source =
      "CONTROL_FALLBACK";

    state.report.fallbackHistory.push(
      state.report.current
    );

    renderReadRegion(
      "readResult",
      "R",
      "Result",
      "Diagnostic engine unavailable",
      report.result
    );

    renderReadRegion(
      "readEvidence",
      "E",
      "Evidence",
      "Control activation confirmed",
      report.evidence
    );

    renderReadRegion(
      "readAbsence",
      "A",
      "Absence",
      "Engine-backed report unavailable",
      report.absence
    );

    renderReadRegion(
      "readDirection",
      "D",
      "Direction",
      "Inspect the diagnostic receipts",
      report.direction
    );

    setText(
      "reportStatus",
      "HELD"
    );

    setStatus(
      "reportStatus",
      "HELD"
    );

    setText(
      "reportTitle",
      "Control Fallback Report"
    );

    setText(
      "reportCreatedAt",
      report.createdAt
    );

    setText(
      "reportMeta",
      report.reportId +
        " · " +
        receipt.receiptId
    );

    setText(
      "packetOutput",
      safeJson({
        report:
          report,
        receipt:
          receipt
      })
    );

    setText(
      "rawOutput",
      safeJson({
        report:
          report,
        receipt:
          receipt,
        controlReceipt:
          root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT ||
          null
      })
    );

    setHtml(
      "evidenceOutput",
      report.evidence
        .map(function renderEvidence(entry) {
          return (
            "<article>" +
              "<h3>Control Evidence</h3>" +
              "<p>" +
              escapeHtml(entry) +
              "</p>" +
              "</article>"
          );
        })
        .join("")
    );

    setDisabled(
      "copyReadableReport",
      false
    );

    setDisabled(
      "copyPacketReport",
      false
    );

    setDisabled(
      "copyRawReport",
      false
    );

    setDisabled(
      "addReportToArchive",
      true
    );

    setText(
      "dropReportState",
      "HELD"
    );

    setStatus(
      "dropReportCell",
      "HELD"
    );

    setText(
      "dropReportAvailableCount",
      String(
        state.report.fallbackHistory.length
      )
    );

    setText(
      "dropReportHeldCount",
      "1"
    );

    setText(
      "dropReportLastAction",
      "Fallback report created at " +
        report.createdAt
    );

    setText(
      "controllerState",
      "ENGINE HELD"
    );

    setStatus(
      "controllerState",
      "HELD"
    );

    recordAction(
      "createFallbackReport",
      {
        reportId:
          report.reportId,
        receiptId:
          receipt.receiptId,
        reason:
          reason
      }
    );

    selectReportModeLocal(
      "read"
    );

    renderReceiptList();

    toast(
      "Fallback READ report created.",
      "HELD"
    );

    return frozenClone(report);
  }

  function invokeEngine(
    methodName,
    args,
    options
  ) {
    var settings =
      options || {};

    var engine =
      resolveEngine();

    if (
      !engine ||
      !isFunction(engine[methodName])
    ) {
      if (isFunction(settings.fallback)) {
        return Promise.resolve(
          settings.fallback({
            reason:
              !engine
                ? state.engine.reason
                : "ENGINE_METHOD_MISSING",
            methodName:
              methodName
          })
        );
      }

      return Promise.resolve(
        recordError(
          methodName,
          new Error(
            !engine
              ? state.engine.reason
              : "ENGINE_METHOD_MISSING:" +
                methodName
          )
        )
      );
    }

    recordAction(
      "invokeEngine." + methodName,
      {
        enginePath:
          state.engine.path,
        engineContract:
          state.engine.contract
      }
    );

    var result;

    try {
      result =
        engine[methodName].apply(
          engine,
          Array.isArray(args)
            ? args
            : []
        );
    } catch (error) {
      if (isFunction(settings.fallback)) {
        return Promise.resolve(
          settings.fallback({
            reason:
              "ENGINE_METHOD_THROW",
            methodName:
              methodName,
            error:
              error
          })
        );
      }

      return Promise.resolve(
        recordError(
          methodName,
          error
        )
      );
    }

    return Promise.resolve(result)
      .then(function engineResolved(value) {
        if (
          isFunction(settings.validate) &&
          !settings.validate(value)
        ) {
          if (isFunction(settings.fallback)) {
            return settings.fallback({
              reason:
                "ENGINE_RESULT_INVALID",
              methodName:
                methodName,
              result:
                clone(value)
            });
          }

          return recordError(
            methodName,
            new Error(
              "ENGINE_RESULT_INVALID:" +
                methodName
            )
          );
        }

        return value;
      })
      .catch(function engineRejected(error) {
        if (isFunction(settings.fallback)) {
          return settings.fallback({
            reason:
              "ENGINE_METHOD_REJECTED",
            methodName:
              methodName,
            error:
              error
          });
        }

        return recordError(
          methodName,
          error
        );
      });
  }

  function createReport() {
    setText(
      "controllerState",
      "CREATING REPORT"
    );

    setStatus(
      "controllerState",
      "RUNNING"
    );

    setText(
      "reportStatus",
      "CREATING"
    );

    setStatus(
      "reportStatus",
      "RUNNING"
    );

    recordAction(
      "createReport.begin",
      {
        category:
          state.ui.selectedCategory,
        audit:
          state.ui.selectedAudit,
        participant:
          state.ui.selectedParticipant
      }
    );

    return invokeEngine(
      "createReport",
      [
        {
          category:
            state.ui.selectedCategory,
          audit:
            state.ui.selectedAudit,
          participant:
            state.ui.selectedParticipant
        }
      ],
      {
        validate:
          validateReport,

        fallback:
          createFallbackReport
      }
    )
      .then(function reportCreated(result) {
        if (
          result &&
          result.schema ===
            FALLBACK_REPORT_SCHEMA
        ) {
          return result;
        }

        var engine =
          getCompatibleEngine();

        var report =
          validateReport(result)
            ? result
            : getEngineReport(engine);

        if (!validateReport(report)) {
          return createFallbackReport({
            reason:
              "ENGINE_REPORT_UNAVAILABLE_AFTER_CREATE"
          });
        }

        var receipt =
          getEngineReportReceipt(
            engine
          );

        renderHealthyReport(
          report,
          receipt
        );

        recordAction(
          "createReport.complete",
          {
            reportId:
              report.reportId || null,
            receiptId:
              receipt &&
              receipt.receiptId
                ? receipt.receiptId
                : null
          }
        );

        toast(
          "Diagnostic report created.",
          "READY"
        );

        return frozenClone(report);
      });
  }

  function runDirectCheck() {
    var role =
      state.ui.selectedParticipant;

    if (
      !role ||
      role === "ALL"
    ) {
      setText(
        "controllerState",
        "DIRECT HELD"
      );

      setStatus(
        "controllerState",
        "HELD"
      );

      toast(
        "Select a participant before direct execution.",
        "HELD"
      );

      return Promise.resolve(null);
    }

    setText(
      "controllerState",
      "DIRECT CHECK"
    );

    setStatus(
      "controllerState",
      "RUNNING"
    );

    return invokeEngine(
      "runDirect",
      [
        role,
        {
          source:
            "CONTROL_PANEL",
          requestedAt:
            nowIso()
        }
      ],
      {
        validate:
          function validDirectReceipt(value) {
            return Boolean(value);
          },

        fallback:
          function directFallback(context) {
            setText(
              "controllerState",
              "DIRECT HELD"
            );

            setStatus(
              "controllerState",
              "HELD"
            );

            setText(
              "dropDirectState",
              "HELD"
            );

            setStatus(
              "dropDirectCell",
              "HELD"
            );

            setText(
              "dropDirectHeldCount",
              "1"
            );

            setText(
              "dropDirectLastAction",
              "Direct execution unavailable: " +
                context.reason
            );

            return null;
          }
      }
    )
      .then(function directComplete(receipt) {
        if (!receipt) {
          return null;
        }

        setText(
          "dropDirectState",
          receipt.status || "AVAILABLE"
        );

        setStatus(
          "dropDirectCell",
          receipt.status || "AVAILABLE"
        );

        setText(
          "dropDirectAvailableCount",
          receipt.status === "ERROR"
            ? "0"
            : "1"
        );

        setText(
          "dropDirectHeldCount",
          receipt.status === "HELD" ||
          receipt.status === "MISSING"
            ? "1"
            : "0"
        );

        setText(
          "dropDirectLastAction",
          "Direct receipt created for " +
            role
        );

        setText(
          "controllerState",
          "DIRECT COMPLETE"
        );

        setStatus(
          "controllerState",
          receipt.status || "AVAILABLE"
        );

        recordAction(
          "runDirect.complete",
          {
            role:
              role,
            status:
              receipt.status || null
          }
        );

        renderReceiptList();

        return receipt;
      });
  }

  function runNineCycle() {
    setText(
      "controllerState",
      "NINE-CYCLE"
    );

    setStatus(
      "controllerState",
      "RUNNING"
    );

    recordAction(
      "runNineCycle.begin"
    );

    return invokeEngine(
      "runNineCycle",
      [
        {
          source:
            "CONTROL_PANEL",
          requestedAt:
            nowIso()
        }
      ],
      {
        validate:
          function validCycleReceipt(value) {
            return Boolean(
              value &&
              typeof value === "object"
            );
          },

        fallback:
          function cycleFallback(context) {
            setText(
              "controllerState",
              "CYCLE HELD"
            );

            setStatus(
              "controllerState",
              "HELD"
            );

            setText(
              "cycleState",
              "HELD"
            );

            setStatus(
              "cycleState",
              "HELD"
            );

            toast(
              "Nine-cycle unavailable: " +
                context.reason,
              "HELD"
            );

            return null;
          }
      }
    )
      .then(function cycleComplete(receipt) {
        if (!receipt) {
          return null;
        }

        state.cycleReceipt =
          deepFreeze(
            clone(receipt)
          );

        setText(
          "controllerState",
          receipt.status === "COMMITTED"
            ? "CYCLE COMMITTED"
            : "CYCLE HELD"
        );

        setStatus(
          "controllerState",
          receipt.status || "AVAILABLE"
        );

        setText(
          "cycleState",
          receipt.status || "AVAILABLE"
        );

        setStatus(
          "cycleState",
          receipt.status || "AVAILABLE"
        );

        recordAction(
          "runNineCycle.complete",
          {
            status:
              receipt.status || null,
            receiptCount:
              receipt.receiptCount || 0
          }
        );

        renderReceiptList();

        return receipt;
      });
  }

  function forwardSelection(
    key,
    value
  ) {
    var selection = {};

    selection[key] =
      value;

    var engine =
      getCompatibleEngine();

    if (
      engine &&
      isFunction(engine.setSelection)
    ) {
      try {
        engine.setSelection(
          selection
        );
      } catch (error) {
        recordError(
          "setSelection." + key,
          error
        );
      }
    }

    recordAction(
      "setSelection." + key,
      selection
    );
  }

  function closeAllSelectors() {
    var categoryButton =
      byId("categorySelectorButton");

    var categoryMenu =
      byId("categorySelectorMenu");

    var auditButton =
      byId("auditSelectorButton");

    var auditMenu =
      byId("auditSelectorMenu");

    if (categoryButton) {
      categoryButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (categoryMenu) {
      categoryMenu.hidden =
        true;
    }

    if (auditButton) {
      auditButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (auditMenu) {
      auditMenu.hidden =
        true;
    }

    state.ui.categoryMenuOpen =
      false;

    state.ui.auditMenuOpen =
      false;
  }

  function toggleSelector(
    buttonId,
    menuId,
    stateKey
  ) {
    var button =
      byId(buttonId);

    var menu =
      byId(menuId);

    if (
      !button ||
      !menu
    ) {
      recordError(
        "toggleSelector",
        new Error(
          "SELECTOR_CONTROL_MISSING"
        ),
        {
          buttonId:
            buttonId,
          menuId:
            menuId
        }
      );

      return;
    }

    var shouldOpen =
      menu.hidden;

    closeAllSelectors();

    menu.hidden =
      !shouldOpen;

    button.setAttribute(
      "aria-expanded",
      shouldOpen
        ? "true"
        : "false"
    );

    state.ui[stateKey] =
      shouldOpen;
  }

  function selectCategory(categoryId) {
    state.ui.selectedCategory =
      categoryId;

    closeAllSelectors();

    var option =
      doc.querySelector(
        '[data-category-id="' +
          cssEscape(categoryId) +
          '"]'
      );

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-category-id]"
      )
    ).forEach(function updateCategory(node) {
      node.setAttribute(
        "aria-selected",
        node === option
          ? "true"
          : "false"
      );
    });

    if (option) {
      var title =
        option.querySelector("strong");

      setText(
        "categorySelectorLabel",
        title
          ? title.textContent
          : categoryId
      );
    }

    forwardSelection(
      "category",
      categoryId
    );
  }

  function selectAudit(auditId) {
    state.ui.selectedAudit =
      auditId;

    closeAllSelectors();

    var option =
      doc.querySelector(
        '[data-audit-id="' +
          cssEscape(auditId) +
          '"]'
      );

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-audit-id]"
      )
    ).forEach(function updateAudit(node) {
      node.setAttribute(
        "aria-selected",
        node === option
          ? "true"
          : "false"
      );
    });

    if (option) {
      var title =
        option.querySelector("strong");

      var summary =
        option.querySelector("span");

      setText(
        "auditSelectorLabel",
        title
          ? title.textContent
          : auditId
      );

      setText(
        "selectedAuditTitle",
        title
          ? title.textContent
          : auditId
      );

      setText(
        "selectedAuditSummary",
        summary
          ? summary.textContent
          : "Selected audit."
      );
    }

    forwardSelection(
      "audit",
      auditId
    );
  }

  function selectParticipant(role) {
    state.ui.selectedParticipant =
      role;

    var node =
      doc.querySelector(
        '[data-participant-role="' +
          cssEscape(role) +
          '"]'
      );

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-participant-role]"
      )
    ).forEach(function updateParticipant(entry) {
      entry.setAttribute(
        "aria-selected",
        entry === node
          ? "true"
          : "false"
      );
    });

    if (node) {
      setHtml(
        "participantDetail",
        "<h3>" +
          escapeHtml(
            node.querySelector("strong")
              ? node.querySelector("strong").textContent
              : role
          ) +
          "</h3>" +
          "<p>Participant selected for diagnostic handoff.</p>"
      );
    }

    forwardSelection(
      "participant",
      role
    );
  }

  function selectLeftOrbitLocal(view) {
    state.ui.leftOrbit =
      view;

    setHidden(
      "auditOrbit",
      view !== "audits"
    );

    setHidden(
      "participantConstellation",
      view !== "participants"
    );

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-left-orbit-view]"
      )
    ).forEach(function updateButton(button) {
      button.setAttribute(
        "aria-selected",
        button.getAttribute(
          "data-left-orbit-view"
        ) === view
          ? "true"
          : "false"
      );
    });
  }

  function selectReportModeLocal(mode) {
    state.ui.reportMode =
      mode;

    [
      "read",
      "packet",
      "raw",
      "evidence"
    ].forEach(function updateMode(entry) {
      var capitalized =
        entry.charAt(0).toUpperCase() +
        entry.slice(1);

      var button =
        byId(
          "report" +
            capitalized +
            "Button"
        );

      var panel =
        byId(
          "report" +
            capitalized +
            "Panel"
        );

      if (button) {
        button.setAttribute(
          "aria-selected",
          entry === mode
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          entry !== mode;
      }
    });
  }

  function selectObservationLensLocal(lens) {
    state.ui.observationLens =
      lens;

    var map = {
      target:
        "targetLens",
      runtime:
        "runtimeLens",
      surface:
        "surfaceLens",
      window:
        "targetWindow"
    };

    Object.keys(map).forEach(function updateLens(key) {
      var button =
        doc.querySelector(
          '[data-observation-lens="' +
            key +
            '"]'
        );

      var panel =
        byId(map[key]);

      if (button) {
        button.setAttribute(
          "aria-selected",
          key === lens
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          key !== lens;
      }
    });
  }

  function selectInstrumentChamberLocal(chamber) {
    state.ui.instrumentChamber =
      chamber;

    var map = {
      cycle:
        "cycleChamber",
      registry:
        "registryChamber",
      receipts:
        "receiptChamber",
      archive:
        "archiveChamber",
      boundary:
        "boundaryChamber"
    };

    Object.keys(map).forEach(function updateChamber(key) {
      var button =
        doc.querySelector(
          '[data-instrument-chamber="' +
            key +
            '"]'
        );

      var panel =
        byId(map[key]);

      if (button) {
        button.setAttribute(
          "aria-selected",
          key === chamber
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          key !== chamber;
      }
    });
  }

  function setTargetVisible(visible) {
    state.ui.targetVisible =
      Boolean(visible);

    var button =
      byId(
        "toggleObservationTarget"
      );

    if (button) {
      button.setAttribute(
        "aria-expanded",
        state.ui.targetVisible
          ? "true"
          : "false"
      );

      button.textContent =
        state.ui.targetVisible
          ? "Hide Target"
          : "Show Target";
    }

    selectObservationLensLocal(
      state.ui.targetVisible
        ? "window"
        : "target"
    );
  }

  function setTargetExpanded(expanded) {
    state.ui.targetExpanded =
      Boolean(expanded);

    var targetWindow =
      byId("targetWindow");

    var button =
      byId("expandTargetWindow");

    if (targetWindow) {
      targetWindow.classList.toggle(
        "is-expanded",
        state.ui.targetExpanded
      );
    }

    if (button) {
      button.setAttribute(
        "aria-pressed",
        state.ui.targetExpanded
          ? "true"
          : "false"
      );

      button.textContent =
        state.ui.targetExpanded
          ? "Collapse"
          : "Expand";
    }
  }

  function reloadTargetFrame() {
    var frame =
      byId(TARGET_FRAME_ID);

    if (!frame) {
      recordError(
        "reloadTargetFrame",
        new Error(
          "TARGET_FRAME_NOT_FOUND"
        )
      );

      return;
    }

    frame.src =
      TARGET_ROUTE +
      "?diagnosticReload=" +
      Date.now();

    recordAction(
      "reloadTargetFrame"
    );

    toast(
      "Target frame reloading.",
      "RUNNING"
    );
  }

  function currentReadableText() {
    if (!state.report.current) {
      return "";
    }

    return deriveReadableReport(
      state.report.current,
      state.report.receipt
    );
  }

  function copyText(
    text,
    successMessage
  ) {
    if (!text) {
      toast(
        "Nothing available to copy.",
        "HELD"
      );

      return Promise.resolve(false);
    }

    if (
      root.navigator &&
      root.navigator.clipboard &&
      isFunction(
        root.navigator.clipboard.writeText
      )
    ) {
      return root.navigator.clipboard
        .writeText(text)
        .then(function clipboardSuccess() {
          toast(
            successMessage || "Copied.",
            "READY"
          );

          return true;
        })
        .catch(function clipboardFailure() {
          return fallbackCopy(
            text,
            successMessage
          );
        });
    }

    return Promise.resolve(
      fallbackCopy(
        text,
        successMessage
      )
    );
  }

  function fallbackCopy(
    text,
    successMessage
  ) {
    var area =
      doc.createElement("textarea");

    area.value =
      text;

    area.setAttribute(
      "readonly",
      "true"
    );

    area.style.position =
      "fixed";

    area.style.left =
      "-9999px";

    doc.body.appendChild(area);

    area.select();

    var copied =
      false;

    try {
      copied =
        doc.execCommand("copy");
    } catch (_error) {
      copied =
        false;
    }

    doc.body.removeChild(area);

    toast(
      copied
        ? successMessage || "Copied."
        : "Copy unavailable.",
      copied
        ? "READY"
        : "HELD"
    );

    return copied;
  }

  function copyReadableReport() {
    recordAction(
      "copyReadableReport"
    );

    return copyText(
      currentReadableText(),
      "Readable report copied."
    );
  }

  function copyPacketReport() {
    var packetNode =
      byId("packetOutput");

    recordAction(
      "copyPacketReport"
    );

    return copyText(
      packetNode
        ? packetNode.textContent
        : "",
      "Report packet copied."
    );
  }

  function copyRawReport() {
    var rawNode =
      byId("rawOutput");

    recordAction(
      "copyRawReport"
    );

    return copyText(
      rawNode
        ? rawNode.textContent
        : "",
      "Raw report copied."
    );
  }

  function resetCurrentReport() {
    var engine =
      getCompatibleEngine();

    if (
      engine &&
      isFunction(engine.resetWorkbench)
    ) {
      try {
        engine.resetWorkbench();
      } catch (error) {
        recordError(
          "resetWorkbench",
          error
        );
      }
    }

    state.report.current =
      null;

    state.report.receipt =
      null;

    state.report.source =
      null;

    setText(
      "reportStatus",
      "READY"
    );

    setStatus(
      "reportStatus",
      "READY"
    );

    setText(
      "reportTitle",
      "No report created"
    );

    setText(
      "reportCreatedAt",
      "—"
    );

    setText(
      "reportMeta",
      "Choose an audit and create a report."
    );

    renderReadRegion(
      "readResult",
      "R",
      "Result",
      "Observatory available",
      "Create a report to evaluate the selected audit."
    );

    renderReadRegion(
      "readEvidence",
      "E",
      "Evidence",
      "Control panel available",
      "The control panel is bound."
    );

    renderReadRegion(
      "readAbsence",
      "A",
      "Absence",
      "No report yet",
      "No current report is displayed."
    );

    renderReadRegion(
      "readDirection",
      "D",
      "Direction",
      "Create the first report",
      "Use Create Report to inspect the current diagnostic state."
    );

    setText(
      "packetOutput",
      "No report packet has been created."
    );

    setText(
      "rawOutput",
      "No raw report has been created."
    );

    setDisabled(
      "copyReadableReport",
      true
    );

    setDisabled(
      "copyPacketReport",
      true
    );

    setDisabled(
      "copyRawReport",
      true
    );

    setDisabled(
      "addReportToArchive",
      true
    );

    selectReportModeLocal(
      "read"
    );

    renderReceiptList();

    recordAction(
      "resetCurrentReport"
    );

    toast(
      "Current report reset.",
      "READY"
    );
  }

  function resetWorkbench() {
    resetCurrentReport();
    closeAllSelectors();

    selectLeftOrbitLocal(
      "audits"
    );

    selectObservationLensLocal(
      "target"
    );

    selectInstrumentChamberLocal(
      "cycle"
    );

    setTargetVisible(false);
    setTargetExpanded(false);

    state.ui.receiptFilter =
      "all";

    state.ui.selectedReceiptIndex =
      null;

    renderReceiptList();

    recordAction(
      "resetWorkbench"
    );
  }

  function addReportToArchive() {
    if (!state.report.current) {
      toast(
        "No current report is available.",
        "HELD"
      );

      return;
    }

    toast(
      "The current engine report was archived during creation.",
      "READY"
    );

    recordAction(
      "confirmReportArchived",
      {
        reportId:
          state.report.current.reportId || null
      }
    );
  }

  function createDeepArchive() {
    var engine =
      getCompatibleEngine();

    var archive =
      engine &&
      isFunction(engine.getArchive)
        ? engine.getArchive()
        : state.report.fallbackHistory.slice();

    setText(
      "archiveSessionCount",
      Array.isArray(archive)
        ? archive.length
        : 0
    );

    setText(
      "archiveRawOutput",
      safeJson(archive)
    );

    selectInstrumentChamberLocal(
      "archive"
    );

    recordAction(
      "createDeepArchive"
    );
  }

  function getReceiptEntries() {
    var entries = [];

    function addReceipt(
      type,
      label,
      record
    ) {
      if (!record) {
        return;
      }

      entries.push({
        type:
          type,
        label:
          label,
        record:
          frozenClone(record)
      });
    }

    addReceipt(
      "inspection",
      "Inspection Lane Receipt",
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT
    );

    addReceipt(
      "engine",
      "Diagnostic Engine Receipt",
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT
    );

    addReceipt(
      "report",
      "Diagnostic Report Receipt",
      state.report.receipt ||
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT
    );

    addReceipt(
      "cycle",
      "Nine-Cycle Receipt",
      state.cycleReceipt
    );

    addReceipt(
      "control",
      "Control Panel Receipt",
      root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT
    );

    return entries;
  }

  function renderReceiptList() {
    var entries =
      getReceiptEntries();

    var filter =
      state.ui.receiptFilter;

    var visible =
      filter === "all"
        ? entries
        : entries.filter(function filterReceipt(entry) {
            return entry.type === filter;
          });

    state.visibleReceipts =
      visible;

    setHtml(
      "receiptList",
      visible.length
        ? visible
            .map(function renderReceipt(entry, index) {
              return (
                '<article tabindex="0" role="button" ' +
                  'data-receipt-index="' +
                  String(index) +
                  '" data-receipt-type="' +
                  escapeHtml(entry.type) +
                  '">' +
                  "<h4>" +
                  escapeHtml(entry.label) +
                  "</h4>" +
                  "<p>Type: " +
                  escapeHtml(entry.type) +
                  "</p>" +
                  "</article>"
              );
            })
            .join("")
        : (
            '<article class="empty-state">' +
              "<h4>No matching receipts</h4>" +
              "<p>No receipts match the selected filter.</p>" +
              "</article>"
          )
    );
  }

  function applyReceiptFilter(filter) {
    state.ui.receiptFilter =
      filter || "all";

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-receipt-filter]"
      )
    ).forEach(function updateFilter(button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute(
          "data-receipt-filter"
        ) === state.ui.receiptFilter
          ? "true"
          : "false"
      );
    });

    renderReceiptList();

    recordAction(
      "applyReceiptFilter",
      {
        filter:
          state.ui.receiptFilter
      }
    );
  }

  function selectReceipt(index) {
    var entry =
      state.visibleReceipts[index] ||
      null;

    state.ui.selectedReceiptIndex =
      entry
        ? index
        : null;

    if (!entry) {
      setHtml(
        "selectedReceiptDetail",
        "<h4>Receipt unavailable</h4>" +
          "<p>The selected receipt could not be resolved.</p>"
      );

      return;
    }

    setHtml(
      "selectedReceiptDetail",
      "<h4>" +
        escapeHtml(entry.label) +
        "</h4>" +
        "<pre>" +
        escapeHtml(
          safeJson(entry.record)
        ) +
        "</pre>"
    );

    recordAction(
      "selectReceipt",
      {
        index:
          index,
        type:
          entry.type,
        label:
          entry.label
      }
    );
  }

  function inspectControls() {
    var missing = [];

    CONTROL_IDS.forEach(function inspectControl(id) {
      if (!byId(id)) {
        missing.push(id);
      }
    });

    state.controls.discoveredCount =
      CONTROL_IDS.length -
      missing.length;

    state.controls.missing =
      missing;

    state.controls.missingCount =
      missing.length;

    state.controls.createReportPresent =
      Boolean(
        byId("createReport")
      );

    publishReceipt();

    return frozenClone(
      state.controls
    );
  }

  function renderEngineState() {
    var engine =
      resolveEngine();

    if (engine) {
      setText(
        "controllerState",
        "REPORT READY"
      );

      setStatus(
        "controllerState",
        "READY"
      );

      setText(
        "controllerContract",
        state.engine.contract
      );

      setText(
        "dropReportState",
        "READY"
      );

      setStatus(
        "dropReportCell",
        "READY"
      );

      setText(
        "dropReportLastAction",
        "Controls bound; compatible engine ready."
      );

      return;
    }

    setText(
      "controllerState",
      "ENGINE HELD"
    );

    setStatus(
      "controllerState",
      "HELD"
    );

    setText(
      "controllerContract",
      "Control panel active · " +
        state.engine.reason
    );

    setText(
      "dropReportState",
      "READY"
    );

    setStatus(
      "dropReportCell",
      "READY"
    );

    setText(
      "dropReportLastAction",
      "Fallback READ report path available."
    );
  }

  function handleClick(event) {
    var rawTarget =
      event.target;

    if (
      !rawTarget ||
      !isFunction(rawTarget.closest)
    ) {
      return;
    }

    var target =
      rawTarget.closest(
        "button, a[href], [role='button'], [role='tab'], [role='option']"
      );

    if (!target) {
      if (
        !rawTarget.closest(
          ".custom-selector"
        )
      ) {
        closeAllSelectors();
      }

      return;
    }

    state.clickCount += 1;

    var id =
      target.id || "";

    recordAction(
      "clickObserved",
      {
        id:
          id || null,
        text:
          String(
            target.textContent || ""
          )
            .trim()
            .slice(0, 100)
      }
    );

    if (id === "createReport") {
      event.preventDefault();

      state.createReportClickCount += 1;

      recordAction(
        "createReportClickObserved",
        {
          clickNumber:
            state.createReportClickCount
        }
      );

      createReport();
      return;
    }

    if (id === "runDirectCheck") {
      event.preventDefault();
      runDirectCheck();
      return;
    }

    if (id === "runNineCycle") {
      event.preventDefault();
      runNineCycle();
      return;
    }

    if (id === "copyReadableReport") {
      event.preventDefault();
      copyReadableReport();
      return;
    }

    if (id === "copyPacketReport") {
      event.preventDefault();
      copyPacketReport();
      return;
    }

    if (id === "copyRawReport") {
      event.preventDefault();
      copyRawReport();
      return;
    }

    if (id === "addReportToArchive") {
      event.preventDefault();
      addReportToArchive();
      return;
    }

    if (id === "resetCurrentReport") {
      event.preventDefault();
      resetCurrentReport();
      return;
    }

    if (id === "resetWorkbench") {
      event.preventDefault();
      resetWorkbench();
      return;
    }

    if (id === "createDeepArchive") {
      event.preventDefault();
      createDeepArchive();
      return;
    }

    if (id === "reloadObservatory") {
      event.preventDefault();

      recordAction(
        "reloadObservatory"
      );

      root.location.reload();
      return;
    }

    if (id === "toggleObservationTarget") {
      event.preventDefault();

      setTargetVisible(
        !state.ui.targetVisible
      );

      return;
    }

    if (id === "expandTargetWindow") {
      event.preventDefault();

      setTargetExpanded(
        !state.ui.targetExpanded
      );

      return;
    }

    if (id === "reloadTargetFrame") {
      event.preventDefault();
      reloadTargetFrame();
      return;
    }

    if (id === "categorySelectorButton") {
      event.preventDefault();

      toggleSelector(
        "categorySelectorButton",
        "categorySelectorMenu",
        "categoryMenuOpen"
      );

      return;
    }

    if (id === "auditSelectorButton") {
      event.preventDefault();

      toggleSelector(
        "auditSelectorButton",
        "auditSelectorMenu",
        "auditMenuOpen"
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-category-id"
      )
    ) {
      event.preventDefault();

      selectCategory(
        target.getAttribute(
          "data-category-id"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-audit-id"
      )
    ) {
      event.preventDefault();

      selectAudit(
        target.getAttribute(
          "data-audit-id"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-participant-role"
      )
    ) {
      event.preventDefault();

      selectParticipant(
        target.getAttribute(
          "data-participant-role"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-left-orbit-view"
      )
    ) {
      event.preventDefault();

      selectLeftOrbitLocal(
        target.getAttribute(
          "data-left-orbit-view"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-report-mode"
      )
    ) {
      event.preventDefault();

      selectReportModeLocal(
        target.getAttribute(
          "data-report-mode"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-observation-lens"
      )
    ) {
      event.preventDefault();

      selectObservationLensLocal(
        target.getAttribute(
          "data-observation-lens"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-instrument-chamber"
      )
    ) {
      event.preventDefault();

      selectInstrumentChamberLocal(
        target.getAttribute(
          "data-instrument-chamber"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-receipt-filter"
      )
    ) {
      event.preventDefault();

      applyReceiptFilter(
        target.getAttribute(
          "data-receipt-filter"
        )
      );

      return;
    }

    if (
      target.hasAttribute(
        "data-receipt-index"
      )
    ) {
      event.preventDefault();

      selectReceipt(
        Number(
          target.getAttribute(
            "data-receipt-index"
          )
        )
      );

      return;
    }

    if (
      !target.closest(
        ".custom-selector"
      )
    ) {
      closeAllSelectors();
    }
  }

  function handleKeydown(event) {
    var rawTarget =
      event.target;

    if (
      !rawTarget ||
      !isFunction(rawTarget.closest)
    ) {
      return;
    }

    var target =
      rawTarget.closest(
        "[role='button'], [role='option'], [role='tab']"
      );

    if (
      target &&
      (
        event.key === "Enter" ||
        event.key === " "
      )
    ) {
      event.preventDefault();
      target.click();
      return;
    }

    if (event.key === "Escape") {
      closeAllSelectors();

      if (state.ui.targetExpanded) {
        setTargetExpanded(false);
      }
    }
  }

  function handleTargetFrameLoad() {
    recordAction(
      "targetFrameLoad"
    );
  }

  function bindEvents() {
    doc.addEventListener(
      "click",
      handleClick
    );

    doc.addEventListener(
      "keydown",
      handleKeydown
    );

    var frame =
      byId(TARGET_FRAME_ID);

    if (frame) {
      frame.addEventListener(
        "load",
        handleTargetFrameLoad
      );
    }

    state.controls.eventDelegationActive =
      true;
  }

  function publishReceipt() {
    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT =
      deepFreeze({
        schema:
          CONTROL_RECEIPT_SCHEMA,

        contract:
          CONTRACT,

        version:
          VERSION,

        file:
          FILE,

        authority:
          AUTHORITY,

        initialized:
          state.initialized,

        initializedAt:
          state.initializedAt,

        eventDelegationActive:
          state.controls.eventDelegationActive,

        createReportControlPresent:
          state.controls.createReportPresent,

        engineLookupPaths:
          ENGINE_GLOBAL_PATHS.slice(),

        engine:
          frozenClone(
            state.engine
          ),

        controlManifestCount:
          state.controls.manifestCount,

        discoveredControlCount:
          state.controls.discoveredCount,

        missingControlCount:
          state.controls.missingCount,

        missingControls:
          state.controls.missing.slice(),

        clickCount:
          state.clickCount,

        createReportClickCount:
          state.createReportClickCount,

        currentReportId:
          state.report.current
            ? state.report.current.reportId || null
            : null,

        currentReportReceiptId:
          state.report.receipt
            ? state.report.receipt.receiptId || null
            : null,

        currentReportSource:
          state.report.source,

        fallbackReportCount:
          state.report.fallbackHistory.length,

        actionCount:
          state.actionCount,

        errorCount:
          state.errorCount,

        lastAction:
          frozenClone(
            state.lastAction
          ),

        lastError:
          frozenClone(
            state.lastError
          ),

        newsAuthority: {
          direction:
            "SOUTH",
          commandHandoff:
            "F34",
          restitution:
            "F55"
        },

        noClaims:
          NO_CLAIMS,

        generatedAt:
          nowIso()
      });
  }

  function getPublicState() {
    return frozenClone({
      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      authority:
        AUTHORITY,

      initialized:
        state.initialized,

      initializedAt:
        state.initializedAt,

      engine:
        state.engine,

      controls:
        state.controls,

      ui:
        state.ui,

      report:
        state.report,

      cycleReceipt:
        state.cycleReceipt,

      actionCount:
        state.actionCount,

      clickCount:
        state.clickCount,

      createReportClickCount:
        state.createReportClickCount,

      errorCount:
        state.errorCount,

      lastAction:
        state.lastAction,

      lastError:
        state.lastError
    });
  }

  function publishApi() {
    var api =
      Object.freeze({
        CONTRACT:
          CONTRACT,

        contract:
          CONTRACT,

        VERSION:
          VERSION,

        version:
          VERSION,

        FILE:
          FILE,

        file:
          FILE,

        AUTHORITY:
          AUTHORITY,

        authority:
          AUTHORITY,

        STATUS:
          "READY",

        status:
          "READY",

        createReport:
          createReport,

        runDirectCheck:
          runDirectCheck,

        runNineCycle:
          runNineCycle,

        addReportToArchive:
          addReportToArchive,

        createDeepArchive:
          createDeepArchive,

        resetCurrentReport:
          resetCurrentReport,

        resetWorkbench:
          resetWorkbench,

        selectCategory:
          selectCategory,

        selectAudit:
          selectAudit,

        selectParticipant:
          selectParticipant,

        selectReportMode:
          selectReportModeLocal,

        selectObservationLens:
          selectObservationLensLocal,

        selectInstrumentChamber:
          selectInstrumentChamberLocal,

        setTargetVisible:
          setTargetVisible,

        setTargetExpanded:
          setTargetExpanded,

        reloadTargetFrame:
          reloadTargetFrame,

        applyReceiptFilter:
          applyReceiptFilter,

        selectReceipt:
          selectReceipt,

        inspectControls:
          inspectControls,

        resolveEngine:
          resolveEngine,

        closeAllSelectors:
          closeAllSelectors,

        getState:
          getPublicState,

        getCurrentReport:
          function getCurrentReport() {
            return frozenClone(
              state.report.current
            );
          },

        getCurrentReportReceipt:
          function getCurrentReportReceipt() {
            return frozenClone(
              state.report.receipt
            );
          },

        getReceipt:
          function getReceipt() {
            return frozenClone(
              root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT ||
              null
            );
          }
      });

    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL =
      api;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.dropWithReadControlPanel =
      api;

    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_LOADED__ =
      true;

    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_VERSION__ =
      VERSION;

    return api;
  }

  function initializeLocalUiState() {
    selectLeftOrbitLocal(
      "audits"
    );

    selectReportModeLocal(
      "read"
    );

    selectObservationLensLocal(
      "target"
    );

    selectInstrumentChamberLocal(
      "cycle"
    );

    setTargetExpanded(false);

    state.ui.receiptFilter =
      "all";
  }

  function init() {
    if (state.initialized) {
      return;
    }

    state.initialized =
      true;

    state.initializedAt =
      nowIso();

    bindEvents();
    publishApi();
    initializeLocalUiState();
    inspectControls();
    renderEngineState();
    renderReceiptList();
    publishReceipt();

    recordAction(
      "initialize",
      {
        eventDelegationActive:
          state.controls.eventDelegationActive,
        createReportControlPresent:
          state.controls.createReportPresent,
        engineReady:
          state.engine.ready
      }
    );

    toast(
      state.engine.ready
        ? "Audralia control panel bound."
        : "Control panel bound; fallback READ path active.",
      state.engine.ready
        ? "READY"
        : "HELD"
    );
  }

  var existing =
    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL;

  if (
    existing &&
    (
      existing.CONTRACT === CONTRACT ||
      existing.contract === CONTRACT
    )
  ) {
    return;
  }

  if (
    doc.readyState === "loading"
  ) {
    doc.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
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
