// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v3
// Full-file replacement.
//
// AUTHORITY:
// - F34 SOUTH_PROBE_HANDOFF
// - F55 SOUTH_RESTITUTION_INTERPRETATION
//
// PURPOSE:
// - Preserve the working canonical control IDs.
// - Preserve engine-backed Create Report behavior.
// - Preserve a visible fallback READ report when the engine is unavailable.
// - Add distributed Create, View, Copy, Receipt, Archive, and Reset commands.
// - Commit report state before rendering and command enablement.
// - Harvest bounded receipt families without executing participants or cycles.
// - Normalize and deduplicate receipt records for visible filters.
// - Leave index.js and index.inspection.lane.js unchanged.
//
// DISTRIBUTED COMMANDS:
//   data-report-command="create"
//   data-report-command="view"
//   data-report-command="copy-readable"
//   data-report-command="copy-packet"
//   data-report-command="copy-raw"
//   data-report-command="open-receipts"
//   data-report-command="open-archive"
//   data-report-command="reset"
//
// OPTIONAL CONTEXT:
//   data-report-category
//   data-report-audit
//   data-report-participant
//   data-report-chamber
//   data-report-mode
//   data-report-source
//   data-report-view-after-create
//
// USER-FACING RECEIPT FILTERS:
//   all
//   participant
//   observation
//   cycle
//   error

(function installAudraliaDistributedDiagnosticControls(global) {
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
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v3";

  var VERSION =
    "3.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.controls.js";

  var AUTHORITY =
    "F34_SOUTH_PROBE_HANDOFF_F55_SOUTH_RESTITUTION_INTERPRETATION";

  var ENGINE_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

  var INSPECTION_LANE_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var FALLBACK_REPORT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v3";

  var FALLBACK_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v3";

  var CONTROL_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DISTRIBUTED_CONTROL_PANEL_RECEIPT_v3";

  var ENGINE_GLOBAL_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
      "AUDRALIA.diagnosticEngine",
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
      "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
      "AUDRALIA.dropWithReadDiagnosticObservatory",
      "AUDRALIA.diagnosticRouteController"
    ]);

  var INSPECTION_GLOBAL_PATHS =
    Object.freeze([
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
      "AUDRALIA.diagnosticInspectionLane"
    ]);

  var HEALTHY_ENGINE_STATES =
    Object.freeze([
      "READY",
      "AVAILABLE",
      "ACTIVE"
    ]);

  var DISTRIBUTED_COMMANDS =
    Object.freeze([
      "create",
      "view",
      "copy-readable",
      "copy-packet",
      "copy-raw",
      "open-receipts",
      "open-archive",
      "reset"
    ]);

  var RECEIPT_FILTERS =
    Object.freeze([
      "all",
      "participant",
      "observation",
      "cycle",
      "error"
    ]);

  var CANONICAL_CONTROL_IDS =
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
      controlsRepairAuthorized: false,
      routeRepairAuthorized: false,
      readinessClaimed: false,
      visualPassClaimed: false,
      cyclePassClaimed: false,
      f21Claimed: false,
      f89Claimed: false
    });

  var RECEIPT_FIELD_NAMES =
    Object.freeze([
      "receipt",
      "receipts",
      "receiptList",
      "receiptMap",
      "receiptRegistry",
      "participantReceipts",
      "inspectionReceipts",
      "observationReceipts",
      "directReceipts",
      "cycleReceipts",
      "stationReceipts",
      "errors",
      "errorList",
      "archive",
      "records",
      "ledger",
      "packets",
      "entries"
    ]);

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

    inspectionLane: {
      resolved: false,
      path: null,
      contract: null,
      receiptPresent: false,
      errorPresent: false
    },

    controls: {
      manifestCount: CANONICAL_CONTROL_IDS.length,
      discoveredCount: 0,
      missingCount: 0,
      missing: [],
      createReportPresent: false,
      delegatedEventsActive: false,
      distributedDeclarationCount: 0,
      distributedDeclarations: []
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
      selectedCategory: "observatoryReceiver",
      selectedAudit: "observatoryIndex",
      selectedParticipant: "ALL",
      lastReportCommand: null,
      lastReportCommandSource: null
    },

    report: {
      current: null,
      receipt: null,
      source: null,
      fallbackHistory: []
    },

    directReceipts: [],
    cycleReceipt: null,
    normalizedReceipts: [],
    visibleReceipts: [],

    actionCount: 0,
    clickCount: 0,
    createReportClickCount: 0,
    distributedExecutionCount: 0,
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
        .trim()
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

  function resolveFirst(paths) {
    var index;
    var value;

    for (
      index = 0;
      index < paths.length;
      index += 1
    ) {
      value =
        readPath(
          paths[index]
        );

      if (value) {
        return {
          path:
            paths[index],
          value:
            value
        };
      }
    }

    return null;
  }

  function inspectInspectionLane() {
    var resolved =
      resolveFirst(
        INSPECTION_GLOBAL_PATHS
      );

    var receipt =
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT ||
      null;

    var error =
      root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__ ||
      null;

    state.inspectionLane = {
      resolved:
        Boolean(resolved),
      path:
        resolved
          ? resolved.path
          : null,
      contract:
        resolved &&
        resolved.value
          ? (
              resolved.value.CONTRACT ||
              resolved.value.contract ||
              null
            )
          : null,
      receiptPresent:
        Boolean(receipt),
      errorPresent:
        Boolean(error)
    };

    return frozenClone(
      state.inspectionLane
    );
  }

  function deriveEngineStatus(engine, publicState) {
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
        ENGINE_CONTRACT
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
        HEALTHY_ENGINE_STATES.indexOf(
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
        ENGINE_CONTRACT
      ) {
        return candidate;
      }
    }

    return null;
  }

  function getInspectionLane() {
    var resolved =
      resolveFirst(
        INSPECTION_GLOBAL_PATHS
      );

    return resolved
      ? resolved.value
      : null;
  }

  function invokeEngine(methodName, args, options) {
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
              : "A diagnostic report was created.",

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

  function deriveReadableReport(report, receipt) {
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
      read.Evidence.length
        ? read.Evidence
            .map(function mapEvidence(entry) {
              return "- " + entry;
            })
            .join("\n")
        : "- No evidence entries were returned.",
      "",
      "ABSENCE",
      read.Absence.length
        ? read.Absence
            .map(function mapAbsence(entry) {
              return "- " + entry;
            })
            .join("\n")
        : "- No absence entries were returned.",
      "",
      "DIRECTION",
      read.Direction.length
        ? read.Direction
            .map(function mapDirection(entry) {
              return "- " + entry;
            })
            .join("\n")
        : "- Inspect the report receipt."
    ].join("\n");
  }

  function renderCommittedReport(report, receipt) {
    var read =
      normalizeRead(report);

    var status =
      String(
        report.status || "AVAILABLE"
      )
        .trim()
        .toUpperCase();

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
      state.report.source === "CONTROL_FALLBACK"
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
      state.report.source === "CONTROL_FALLBACK"
        ? "ENGINE HELD"
        : "REPORT READY"
    );

    setStatus(
      "controllerState",
      state.report.source === "CONTROL_FALLBACK"
        ? "HELD"
        : "READY"
    );

    selectReportModeLocal(
      "read"
    );

    updateDistributedCommandAvailability();
    refreshReceiptInventory();
    publishReceipt();
  }

  function commitReport(report, receipt, source) {
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
      source;

    renderCommittedReport(
      state.report.current,
      state.report.receipt
    );

    return frozenClone(
      state.report.current
    );
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

    var createdAt =
      nowIso();

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
        createdAt,

      READ: {
        Result:
          "The report command was received, but the authoritative diagnostic engine could not produce a healthy report.",

        Evidence: [
          "A report command was received by the distributed control panel.",
          "Delegated command handling remained active.",
          "The control fallback READ path remained available.",
          state.inspectionLane.resolved
            ? "The bounded inspection lane was present."
            : "The bounded inspection lane was not present."
        ],

        Absence: [
          reason,
          errorMessage ||
            "No additional engine exception message was supplied.",
          "Healthy engine-backed report construction was unavailable."
        ],

        Direction: [
          "Inspect the distributed control-panel receipt.",
          "Inspect the diagnostic-engine receipt.",
          "Inspect the bounded inspection-lane receipt.",
          "Verify the current engine global and contract."
        ]
      },

      engineResolution:
        frozenClone(
          state.engine
        ),

      inspectionLane:
        frozenClone(
          state.inspectionLane
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

      reportStatus:
        "HELD",

      status:
        "HELD",

      type:
        "error",

      groups: [
        "observation",
        "error"
      ],

      reason:
        reason,

      createdAt:
        createdAt
    };

    state.report.fallbackHistory.push(
      deepFreeze(
        clone(report)
      )
    );

    commitReport(
      report,
      receipt,
      "CONTROL_FALLBACK"
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

    toast(
      "Fallback READ report created.",
      "HELD"
    );

    return frozenClone(report);
  }

  function createReport(options) {
    var settings =
      options || {};

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
          state.ui.selectedParticipant,
        source:
          settings.source || "CANONICAL_CONTROL",
        command:
          settings.command || "create"
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
            state.ui.selectedParticipant,
          controlSource:
            settings.source || "CANONICAL_CONTROL",
          controlCommand:
            settings.command || "create"
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
          if (settings.viewAfterCreate !== false) {
            viewCurrentReport({
              mode:
                settings.mode || "read",
              behavior:
                settings.scrollBehavior || "smooth"
            });
          }

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

        commitReport(
          report,
          receipt,
          "ENGINE"
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
                : null,
            source:
              settings.source || "CANONICAL_CONTROL"
          }
        );

        toast(
          "Diagnostic report created.",
          "READY"
        );

        if (settings.viewAfterCreate !== false) {
          viewCurrentReport({
            mode:
              settings.mode || "read",
            behavior:
              settings.scrollBehavior || "smooth"
          });
        }

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

        state.directReceipts.push(
          deepFreeze(
            clone(receipt)
          )
        );

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

        refreshReceiptInventory();

        return frozenClone(receipt);
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
              "cycleStatus",
              "Cycle · Held"
            );

            setStatus(
              "cycleStatus",
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
            : "CYCLE COMPLETE"
        );

        setStatus(
          "controllerState",
          receipt.status || "AVAILABLE"
        );

        setText(
          "cycleStatus",
          "Cycle · " +
            String(
              receipt.status || "Available"
            )
        );

        setStatus(
          "cycleStatus",
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

        refreshReceiptInventory();

        return frozenClone(receipt);
      });
  }

  function forwardSelection(key, value) {
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
          error,
          selection
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

  function toggleSelector(buttonId, menuId, stateKey) {
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
    if (!categoryId) {
      return false;
    }

    var option =
      doc.querySelector(
        '[data-category-id="' +
          cssEscape(categoryId) +
          '"]'
      );

    if (!option) {
      recordError(
        "selectCategory",
        new Error(
          "UNSUPPORTED_CATEGORY:" +
            categoryId
        )
      );

      return false;
    }

    state.ui.selectedCategory =
      categoryId;

    closeAllSelectors();

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

    var title =
      option.querySelector("strong");

    setText(
      "categorySelectorLabel",
      title
        ? title.textContent
        : categoryId
    );

    setText(
      "selectedCategoryLabel",
      title
        ? title.textContent
        : categoryId
    );

    forwardSelection(
      "category",
      categoryId
    );

    return true;
  }

  function selectAudit(auditId) {
    if (!auditId) {
      return false;
    }

    var option =
      doc.querySelector(
        '[data-audit-id="' +
          cssEscape(auditId) +
          '"]'
      );

    if (!option) {
      recordError(
        "selectAudit",
        new Error(
          "UNSUPPORTED_AUDIT:" +
            auditId
        )
      );

      return false;
    }

    state.ui.selectedAudit =
      auditId;

    closeAllSelectors();

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

    forwardSelection(
      "audit",
      auditId
    );

    return true;
  }

  function selectParticipant(role) {
    if (!role) {
      return false;
    }

    var node =
      doc.querySelector(
        '[data-participant-role="' +
          cssEscape(role) +
          '"][role="button"]'
      );

    if (!node) {
      recordError(
        "selectParticipant",
        new Error(
          "UNSUPPORTED_PARTICIPANT:" +
            role
        )
      );

      return false;
    }

    state.ui.selectedParticipant =
      role;

    Array.prototype.slice.call(
      doc.querySelectorAll(
        '[data-participant-role][role="button"]'
      )
    ).forEach(function updateParticipant(entry) {
      entry.setAttribute(
        "aria-selected",
        entry === node
          ? "true"
          : "false"
      );
    });

    setHtml(
      "participantDetail",
      "<h3>" +
        escapeHtml(
          node.querySelector("strong")
            ? node.querySelector("strong").textContent
            : role
        ) +
        "</h3>" +
        "<p>Participant selected for report context and explicit diagnostic handoff.</p>"
    );

    forwardSelection(
      "participant",
      role
    );

    return true;
  }

  function selectLeftOrbitLocal(view) {
    var normalized =
      view === "participants"
        ? "participants"
        : "audits";

    state.ui.leftOrbit =
      normalized;

    setHidden(
      "auditOrbit",
      normalized !== "audits"
    );

    setHidden(
      "participantConstellation",
      normalized !== "participants"
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
        ) === normalized
          ? "true"
          : "false"
      );
    });
  }

  function selectReportModeLocal(mode) {
    var normalized =
      ["read", "packet", "raw", "evidence"]
        .indexOf(mode) !== -1
          ? mode
          : "read";

    state.ui.reportMode =
      normalized;

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
          entry === normalized
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          entry !== normalized;
      }
    });
  }

  function selectObservationLensLocal(lens) {
    var normalized =
      ["target", "runtime", "surface", "window"]
        .indexOf(lens) !== -1
          ? lens
          : "target";

    state.ui.observationLens =
      normalized;

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
          key === normalized
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          key !== normalized;
      }
    });
  }

  function selectInstrumentChamberLocal(chamber) {
    var normalized =
      chamber === "receipt"
        ? "receipts"
        : chamber;

    if (
      ["cycle", "registry", "receipts", "archive", "boundary"]
        .indexOf(normalized) === -1
    ) {
      normalized =
        "cycle";
    }

    state.ui.instrumentChamber =
      normalized;

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
          key === normalized
            ? "true"
            : "false"
        );
      }

      if (panel) {
        panel.hidden =
          key !== normalized;
      }
    });
  }

  function applyCommandContext(node) {
    if (!node) {
      return;
    }

    var requested = {
      category:
        node.getAttribute(
          "data-report-category"
        ),
      audit:
        node.getAttribute(
          "data-report-audit"
        ),
      participant:
        node.getAttribute(
          "data-report-participant"
        ),
      chamber:
        node.getAttribute(
          "data-report-chamber"
        ),
      mode:
        node.getAttribute(
          "data-report-mode"
        )
    };

    var applied = {
      category: false,
      audit: false,
      participant: false,
      chamber: false,
      mode: false
    };

    if (requested.category) {
      applied.category =
        selectCategory(
          requested.category
        );
    }

    if (requested.audit) {
      applied.audit =
        selectAudit(
          requested.audit
        );
    }

    if (requested.participant) {
      applied.participant =
        selectParticipant(
          requested.participant
        );
    }

    if (requested.chamber) {
      selectInstrumentChamberLocal(
        requested.chamber
      );

      applied.chamber =
        true;
    }

    if (requested.mode) {
      selectReportModeLocal(
        requested.mode
      );

      applied.mode =
        true;
    }

    recordAction(
      "applyCommandContext",
      {
        requested:
          requested,
        applied:
          applied,
        preservedSelection: {
          category:
            state.ui.selectedCategory,
          audit:
            state.ui.selectedAudit,
          participant:
            state.ui.selectedParticipant
        }
      }
    );
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

  function currentPacketText() {
    var packetNode =
      byId("packetOutput");

    return packetNode
      ? packetNode.textContent
      : "";
  }

  function currentRawText() {
    var rawNode =
      byId("rawOutput");

    return rawNode
      ? rawNode.textContent
      : "";
  }

  function fallbackCopy(text, successMessage) {
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

  function copyText(text, successMessage) {
    if (!text) {
      toast(
        "No current report is available to copy.",
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
    recordAction(
      "copyPacketReport"
    );

    return copyText(
      currentPacketText(),
      "Report packet copied."
    );
  }

  function copyRawReport() {
    recordAction(
      "copyRawReport"
    );

    return copyText(
      currentRawText(),
      "Raw report copied."
    );
  }

  function viewCurrentReport(options) {
    var settings =
      options || {};

    var chamber =
      byId("reportChamber");

    selectReportModeLocal(
      settings.mode || "read"
    );

    if (!chamber) {
      recordError(
        "viewCurrentReport",
        new Error(
          "REPORT_CHAMBER_NOT_FOUND"
        )
      );

      return false;
    }

    chamber.setAttribute(
      "tabindex",
      "-1"
    );

    try {
      chamber.scrollIntoView({
        behavior:
          settings.behavior === "auto"
            ? "auto"
            : "smooth",
        block:
          "start",
        inline:
          "nearest"
      });
    } catch (_error) {
      root.location.hash =
        "reportChamber";
    }

    root.setTimeout(function focusReportChamber() {
      try {
        chamber.focus({
          preventScroll: true
        });
      } catch (_error) {}
    }, 220);

    recordAction(
      "viewCurrentReport",
      {
        reportPresent:
          Boolean(
            state.report.current
          ),
        mode:
          state.ui.reportMode
      }
    );

    if (!state.report.current) {
      toast(
        "Report chamber opened. Create a report to populate it.",
        "HELD"
      );
    }

    return true;
  }

  function addReportToArchive() {
    if (!state.report.current) {
      toast(
        "No current report is available.",
        "HELD"
      );

      return;
    }

    if (
      state.report.source ===
      "CONTROL_FALLBACK"
    ) {
      toast(
        "Fallback reports are not committed to the engine archive.",
        "HELD"
      );

      return;
    }

    toast(
      "The current engine report is available in the diagnostic archive.",
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

  function safeCall(owner, methodName) {
    if (
      !owner ||
      !isFunction(owner[methodName])
    ) {
      return null;
    }

    try {
      return owner[methodName]();
    } catch (error) {
      recordError(
        "safeCall." + methodName,
        error
      );

      return null;
    }
  }

  function createDeepArchive() {
    var engine =
      getCompatibleEngine();

    var archive =
      safeCall(
        engine,
        "getArchive"
      );

    if (!Array.isArray(archive)) {
      archive = [];
    }

    var fallbackArchive =
      state.report.fallbackHistory.slice();

    var mergedArchive =
      archive.concat(
        fallbackArchive
      );

    setText(
      "archiveSessionCount",
      mergedArchive.length
    );

    setText(
      "archiveRawOutput",
      safeJson(
        mergedArchive
      )
    );

    selectInstrumentChamberLocal(
      "archive"
    );

    recordAction(
      "createDeepArchive",
      {
        engineRecordCount:
          archive.length,
        fallbackRecordCount:
          fallbackArchive.length
      }
    );

    refreshReceiptInventory();

    return frozenClone(
      mergedArchive
    );
  }

  function openReceiptChamber() {
    selectInstrumentChamberLocal(
      "receipts"
    );

    refreshReceiptInventory();

    var deck =
      byId("instrumentDeck");

    if (deck) {
      try {
        deck.scrollIntoView({
          behavior:
            "smooth",
          block:
            "start"
        });
      } catch (_error) {}
    }

    recordAction(
      "openReceiptChamber"
    );
  }

  function openArchiveChamber() {
    selectInstrumentChamberLocal(
      "archive"
    );

    createDeepArchive();

    var deck =
      byId("instrumentDeck");

    if (deck) {
      try {
        deck.scrollIntoView({
          behavior:
            "smooth",
          block:
            "start"
        });
      } catch (_error) {}
    }

    recordAction(
      "openArchiveChamber"
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
      "The distributed control panel is bound."
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
      "Use any Create Report command to inspect the current diagnostic state."
    );

    setText(
      "packetOutput",
      "No report packet has been created."
    );

    setText(
      "rawOutput",
      "No raw report has been created."
    );

    setHtml(
      "evidenceOutput",
      '<article class="empty-state">' +
        "<h3>No evidence report yet</h3>" +
        "<p>Create a report to collect current evidence.</p>" +
        "</article>"
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

    setText(
      "dropReportState",
      "READY"
    );

    setStatus(
      "dropReportCell",
      "READY"
    );

    setText(
      "dropReportAvailableCount",
      "1"
    );

    setText(
      "dropReportHeldCount",
      "0"
    );

    setText(
      "dropReportLastAction",
      "Create Report is available immediately."
    );

    selectReportModeLocal(
      "read"
    );

    updateDistributedCommandAvailability();
    refreshReceiptInventory();

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

    refreshReceiptInventory();

    recordAction(
      "resetWorkbench"
    );
  }

  function normalizeGroups(groups) {
    var output = [];

    (
      Array.isArray(groups)
        ? groups
        : [groups]
    ).forEach(function addGroup(group) {
      var normalized =
        String(group || "")
          .trim()
          .toLowerCase();

      if (
        RECEIPT_FILTERS.indexOf(normalized) !== -1 &&
        normalized !== "all" &&
        output.indexOf(normalized) === -1
      ) {
        output.push(normalized);
      }
    });

    return output;
  }

  function containsAny(text, terms) {
    var normalized =
      String(text || "")
        .toLowerCase();

    return terms.some(function includesTerm(term) {
      return normalized.indexOf(term) !== -1;
    });
  }

  function deriveReceiptType(record, sourceHint, pathHint) {
    var combined =
      [
        sourceHint,
        pathHint,
        record && record.type,
        record && record.kind,
        record && record.schema,
        record && record.contract,
        record && record.role,
        record && record.station,
        record && record.participantRole,
        record && record.status
      ]
        .filter(Boolean)
        .join(" ");

    if (
      containsAny(
        combined,
        [
          "error",
          "failed",
          "failure",
          "exception"
        ]
      )
    ) {
      return "error";
    }

    if (
      containsAny(
        combined,
        [
          "cycle",
          "station",
          "conductor",
          "f1",
          "f3",
          "f5",
          "f8",
          "f13",
          "f21",
          "f34",
          "f55",
          "f89"
        ]
      )
    ) {
      return "cycle";
    }

    if (
      containsAny(
        combined,
        [
          "participant",
          "direct",
          "north",
          "east",
          "west",
          "south",
          "rail"
        ]
      )
    ) {
      return "participant";
    }

    if (
      containsAny(
        combined,
        [
          "inspection",
          "observation",
          "surface",
          "runtime",
          "registry",
          "engine",
          "report",
          "control"
        ]
      )
    ) {
      return "observation";
    }

    return "observation";
  }

  function deriveReceiptGroups(record, type, sourceHint, pathHint) {
    var groups = [];
    var combined =
      [
        type,
        sourceHint,
        pathHint,
        record && record.type,
        record && record.kind,
        record && record.schema,
        record && record.contract,
        record && record.role,
        record && record.station,
        record && record.participantRole,
        record && record.status,
        record && record.error,
        record && record.message
      ]
        .filter(Boolean)
        .join(" ");

    if (
      type === "participant" ||
      containsAny(
        combined,
        [
          "participant",
          "direct",
          "north",
          "east",
          "west",
          "south",
          "rail"
        ]
      )
    ) {
      groups.push(
        "participant"
      );
    }

    if (
      type === "cycle" ||
      containsAny(
        combined,
        [
          "cycle",
          "station",
          "conductor",
          "f1",
          "f3",
          "f5",
          "f8",
          "f13",
          "f21",
          "f34",
          "f55",
          "f89"
        ]
      )
    ) {
      groups.push(
        "cycle"
      );
    }

    if (
      type === "observation" ||
      containsAny(
        combined,
        [
          "inspection",
          "observation",
          "surface",
          "runtime",
          "registry",
          "engine",
          "report",
          "control"
        ]
      )
    ) {
      groups.push(
        "observation"
      );
    }

    if (
      type === "error" ||
      containsAny(
        combined,
        [
          "error",
          "failed",
          "failure",
          "exception",
          "held",
          "missing"
        ]
      )
    ) {
      groups.push(
        "error"
      );
    }

    if (!groups.length) {
      groups.push(
        "observation"
      );
    }

    return normalizeGroups(
      groups
    );
  }

  function deriveReceiptId(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    return (
      record.receiptId ||
      record.id ||
      record.reportReceiptId ||
      record.cycleReceiptId ||
      record.stationReceiptId ||
      null
    );
  }

  function deriveReportId(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    return (
      record.reportId ||
      (
        record.report &&
        record.report.reportId
      ) ||
      null
    );
  }

  function deriveParticipantRole(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    return (
      record.participantRole ||
      record.role ||
      record.participant ||
      null
    );
  }

  function deriveStation(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    return (
      record.station ||
      record.stationId ||
      record.cycleStation ||
      record.fibonacci ||
      null
    );
  }

  function deriveReceiptLabel(record, type, sourceHint, pathHint) {
    if (
      record &&
      typeof record.label === "string" &&
      record.label.trim()
    ) {
      return record.label.trim();
    }

    if (
      record &&
      typeof record.title === "string" &&
      record.title.trim()
    ) {
      return record.title.trim();
    }

    if (
      record &&
      typeof record.schema === "string" &&
      record.schema.trim()
    ) {
      return record.schema.trim();
    }

    return [
      sourceHint || "Diagnostic",
      type || "receipt",
      pathHint || ""
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function deriveStableKey(entry) {
    if (entry.receiptId) {
      return (
        "receipt:" +
        entry.receiptId
      );
    }

    return [
      entry.sourceAuthority || "unknown",
      entry.type || "unknown",
      entry.participantRole || "",
      entry.station || "",
      entry.reportId || "",
      entry.label || "",
      safeJson(entry.record).slice(0, 240)
    ].join("|");
  }

  function looksLikeReceipt(record, pathHint) {
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record)
    ) {
      return false;
    }

    if (
      record.receiptId ||
      record.reportReceiptId ||
      record.cycleReceiptId ||
      record.stationReceiptId
    ) {
      return true;
    }

    var schema =
      String(
        record.schema || ""
      )
        .toLowerCase();

    var contract =
      String(
        record.contract || ""
      )
        .toLowerCase();

    var path =
      String(pathHint || "")
        .toLowerCase();

    return (
      schema.indexOf("receipt") !== -1 ||
      contract.indexOf("receipt") !== -1 ||
      path.indexOf("receipt") !== -1
    );
  }

  function createNormalizedReceipt(record, sourceAuthority, pathHint) {
    var type =
      deriveReceiptType(
        record,
        sourceAuthority,
        pathHint
      );

    var entry = {
      type:
        type,
      sourceAuthority:
        sourceAuthority || "UNKNOWN",
      label:
        deriveReceiptLabel(
          record,
          type,
          sourceAuthority,
          pathHint
        ),
      record:
        frozenClone(record),
      groups:
        deriveReceiptGroups(
          record,
          type,
          sourceAuthority,
          pathHint
        ),
      participantRole:
        deriveParticipantRole(
          record
        ),
      station:
        deriveStation(
          record
        ),
      reportId:
        deriveReportId(
          record
        ),
      receiptId:
        deriveReceiptId(
          record
        ),
      path:
        pathHint || null
    };

    entry.stableKey =
      deriveStableKey(
        entry
      );

    return entry;
  }

  function walkReceiptCandidates(
    value,
    sourceAuthority,
    pathHint,
    output,
    seen,
    depth
  ) {
    var memory =
      seen || [];

    var level =
      depth || 0;

    if (
      value === null ||
      value === undefined ||
      level > 7
    ) {
      return;
    }

    if (
      typeof value !== "object"
    ) {
      return;
    }

    if (
      memory.indexOf(value) !== -1
    ) {
      return;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      value.forEach(function walkArrayEntry(entry, index) {
        walkReceiptCandidates(
          entry,
          sourceAuthority,
          pathHint +
            "[" +
            String(index) +
            "]",
          output,
          memory.slice(),
          level + 1
        );
      });

      return;
    }

    if (
      looksLikeReceipt(
        value,
        pathHint
      )
    ) {
      output.push(
        createNormalizedReceipt(
          value,
          sourceAuthority,
          pathHint
        )
      );
    }

    Object.keys(value).forEach(function walkProperty(key) {
      var child;

      try {
        child =
          value[key];
      } catch (_error) {
        return;
      }

      if (
        child === null ||
        child === undefined ||
        typeof child !== "object"
      ) {
        return;
      }

      var relevant =
        RECEIPT_FIELD_NAMES.indexOf(key) !== -1 ||
        containsAny(
          key,
          [
            "receipt",
            "archive",
            "ledger",
            "packet",
            "record",
            "error"
          ]
        );

      if (
        relevant ||
        level < 2
      ) {
        walkReceiptCandidates(
          child,
          sourceAuthority,
          pathHint
            ? pathHint + "." + key
            : key,
          output,
          memory.slice(),
          level + 1
        );
      }
    });
  }

  function addExplicitReceipt(
    output,
    record,
    sourceAuthority,
    pathHint
  ) {
    if (!record) {
      return;
    }

    if (
      Array.isArray(record)
    ) {
      record.forEach(function addExplicitArrayEntry(entry, index) {
        addExplicitReceipt(
          output,
          entry,
          sourceAuthority,
          pathHint +
            "[" +
            String(index) +
            "]"
        );
      });

      return;
    }

    if (
      typeof record === "object"
    ) {
      output.push(
        createNormalizedReceipt(
          record,
          sourceAuthority,
          pathHint
        )
      );
    }
  }

  function dedupeReceipts(entries) {
    var seen = Object.create(null);
    var output = [];

    entries.forEach(function dedupeEntry(entry) {
      if (
        !entry ||
        !entry.stableKey
      ) {
        return;
      }

      if (seen[entry.stableKey]) {
        return;
      }

      seen[entry.stableKey] =
        true;

      output.push(entry);
    });

    return output;
  }

  function collectReceiptFamilies() {
    var output = [];

    var engine =
      getCompatibleEngine();

    var inspectionLane =
      getInspectionLane();

    var engineState =
      safeCall(
        engine,
        "getState"
      );

    var engineReceipt =
      safeCall(
        engine,
        "getEngineReceipt"
      );

    var reportReceipt =
      safeCall(
        engine,
        "getReportReceipt"
      );

    var archive =
      safeCall(
        engine,
        "getArchive"
      );

    var inspectionReceipt =
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT ||
      safeCall(
        inspectionLane,
        "getReceipt"
      );

    var inspectionState =
      safeCall(
        inspectionLane,
        "getState"
      );

    addExplicitReceipt(
      output,
      inspectionReceipt,
      "INSPECTION_LANE",
      "inspectionLane.receipt"
    );

    addExplicitReceipt(
      output,
      engineReceipt,
      "DIAGNOSTIC_ENGINE",
      "engine.engineReceipt"
    );

    addExplicitReceipt(
      output,
      reportReceipt,
      "DIAGNOSTIC_ENGINE",
      "engine.reportReceipt"
    );

    addExplicitReceipt(
      output,
      state.report.receipt,
      state.report.source === "CONTROL_FALLBACK"
        ? "CONTROL_FALLBACK"
        : "CONTROL_PANEL",
      "state.report.receipt"
    );

    state.directReceipts.forEach(function addDirectReceipt(
      receipt,
      index
    ) {
      addExplicitReceipt(
        output,
        receipt,
        "CONTROL_DIRECT",
        "state.directReceipts[" +
          String(index) +
          "]"
      );
    });

    addExplicitReceipt(
      output,
      state.cycleReceipt,
      "CONTROL_CYCLE",
      "state.cycleReceipt"
    );

    if (
      root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__
    ) {
      addExplicitReceipt(
        output,
        {
          schema:
            "AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR_RECORD_v1",
          status:
            "ERROR",
          error:
            clone(
              root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__
            ),
          observedAt:
            nowIso()
        },
        "INSPECTION_LANE",
        "inspectionLane.error"
      );
    }

    if (state.lastError) {
      addExplicitReceipt(
        output,
        state.lastError,
        "CONTROL_PANEL",
        "state.lastError"
      );
    }

    walkReceiptCandidates(
      inspectionState,
      "INSPECTION_LANE",
      "inspectionLane.state",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      engineState,
      "DIAGNOSTIC_ENGINE",
      "engine.state",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      archive,
      "DIAGNOSTIC_ARCHIVE",
      "engine.archive",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      state.report.current,
      state.report.source === "CONTROL_FALLBACK"
        ? "CONTROL_FALLBACK"
        : "DIAGNOSTIC_REPORT",
      "state.report.current",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      state.cycleReceipt,
      "CONTROL_CYCLE",
      "state.cycleReceipt",
      output,
      [],
      0
    );

    state.report.fallbackHistory.forEach(function walkFallback(
      report,
      index
    ) {
      walkReceiptCandidates(
        report,
        "CONTROL_FALLBACK",
        "state.report.fallbackHistory[" +
          String(index) +
          "]",
        output,
        [],
        0
      );
    });

    return dedupeReceipts(
      output
    );
  }

  function refreshReceiptInventory() {
    state.normalizedReceipts =
      collectReceiptFamilies();

    renderReceiptList();
    publishReceipt();

    return frozenClone(
      state.normalizedReceipts
    );
  }

  function renderReceiptList() {
    var entries =
      state.normalizedReceipts;

    var filter =
      state.ui.receiptFilter;

    var visible =
      filter === "all"
        ? entries
        : entries.filter(function filterReceipt(entry) {
            return entry.groups.indexOf(
              filter
            ) !== -1;
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
                  "<p>" +
                  escapeHtml(
                    entry.sourceAuthority
                  ) +
                  " · " +
                  escapeHtml(
                    entry.groups.join(", ")
                  ) +
                  "</p>" +
                  (
                    entry.receiptId
                      ? "<small>" +
                        escapeHtml(
                          entry.receiptId
                        ) +
                        "</small>"
                      : ""
                  ) +
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
    var normalized =
      String(filter || "all")
        .trim()
        .toLowerCase();

    if (
      RECEIPT_FILTERS.indexOf(normalized) === -1
    ) {
      normalized =
        "all";
    }

    state.ui.receiptFilter =
      normalized;

    Array.prototype.slice.call(
      doc.querySelectorAll(
        "[data-receipt-filter]"
      )
    ).forEach(function updateFilter(button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute(
          "data-receipt-filter"
        ) === normalized
          ? "true"
          : "false"
      );
    });

    renderReceiptList();

    recordAction(
      "applyReceiptFilter",
      {
        filter:
          normalized
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
        "<p>" +
        escapeHtml(
          entry.sourceAuthority
        ) +
        "</p>" +
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
          entry.label,
        receiptId:
          entry.receiptId
      }
    );
  }

  function inspectDistributedCommands() {
    var nodes =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-report-command]"
        )
      );

    state.controls.distributedDeclarationCount =
      nodes.length;

    state.controls.distributedDeclarations =
      nodes.map(function mapDistributedCommand(node) {
        return {
          id:
            node.id || null,
          command:
            node.getAttribute(
              "data-report-command"
            ),
          source:
            node.getAttribute(
              "data-report-source"
            ),
          category:
            node.getAttribute(
              "data-report-category"
            ),
          audit:
            node.getAttribute(
              "data-report-audit"
            ),
          participant:
            node.getAttribute(
              "data-report-participant"
            ),
          chamber:
            node.getAttribute(
              "data-report-chamber"
            ),
          mode:
            node.getAttribute(
              "data-report-mode"
            )
        };
      });

    publishReceipt();

    return frozenClone(
      state.controls.distributedDeclarations
    );
  }

  function updateDistributedCommandAvailability() {
    var reportPresent =
      Boolean(
        state.report.current
      );

    Array.prototype.slice.call(
      doc.querySelectorAll(
        '[data-report-command="copy-readable"],' +
        '[data-report-command="copy-packet"],' +
        '[data-report-command="copy-raw"]'
      )
    ).forEach(function updateCopyCommand(node) {
      node.disabled =
        !reportPresent;

      node.setAttribute(
        "aria-disabled",
        reportPresent
          ? "false"
          : "true"
      );

      node.setAttribute(
        "data-report-available",
        reportPresent
          ? "true"
          : "false"
      );
    });

    Array.prototype.slice.call(
      doc.querySelectorAll(
        '[data-report-command="view"]'
      )
    ).forEach(function updateViewCommand(node) {
      node.setAttribute(
        "data-report-available",
        reportPresent
          ? "true"
          : "false"
      );
    });
  }

  function inspectControls() {
    var missing = [];

    CANONICAL_CONTROL_IDS.forEach(function inspectControl(id) {
      if (!byId(id)) {
        missing.push(id);
      }
    });

    state.controls.discoveredCount =
      CANONICAL_CONTROL_IDS.length -
      missing.length;

    state.controls.missing =
      missing;

    state.controls.missingCount =
      missing.length;

    state.controls.createReportPresent =
      Boolean(
        byId("createReport")
      );

    inspectDistributedCommands();
    updateDistributedCommandAvailability();
    publishReceipt();

    return frozenClone(
      state.controls
    );
  }

  function renderEngineState() {
    inspectInspectionLane();

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
        CONTRACT
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
        state.inspectionLane.resolved
          ? "Distributed controls bound; inspection lane and engine available."
          : "Distributed controls bound; engine available; inspection lane absent."
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
      CONTRACT
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

  function normalizeDistributedCommand(target) {
    var command =
      String(
        target.getAttribute(
          "data-report-command"
        ) || ""
      )
        .trim()
        .toLowerCase();

    return DISTRIBUTED_COMMANDS.indexOf(command) !== -1
      ? command
      : null;
  }

  function executeDistributedReportCommand(target, command) {
    if (!command) {
      return false;
    }

    state.distributedExecutionCount += 1;

    state.ui.lastReportCommand =
      command;

    state.ui.lastReportCommandSource =
      target.getAttribute(
        "data-report-source"
      ) ||
      target.id ||
      target.getAttribute(
        "data-report-chamber"
      ) ||
      "DISTRIBUTED_CONTROL";

    applyCommandContext(target);

    recordAction(
      "distributedReportCommand",
      {
        command:
          command,
        source:
          state.ui.lastReportCommandSource,
        commandNumber:
          state.distributedExecutionCount
      }
    );

    if (command === "create") {
      createReport({
        source:
          state.ui.lastReportCommandSource,
        command:
          command,
        mode:
          target.getAttribute(
            "data-report-mode"
          ) || "read",
        viewAfterCreate:
          target.getAttribute(
            "data-report-view-after-create"
          ) !== "false"
      });

      return true;
    }

    if (command === "view") {
      viewCurrentReport({
        mode:
          target.getAttribute(
            "data-report-mode"
          ) || "read"
      });

      return true;
    }

    if (command === "copy-readable") {
      copyReadableReport();
      return true;
    }

    if (command === "copy-packet") {
      copyPacketReport();
      return true;
    }

    if (command === "copy-raw") {
      copyRawReport();
      return true;
    }

    if (command === "open-receipts") {
      openReceiptChamber();
      return true;
    }

    if (command === "open-archive") {
      openArchiveChamber();
      return true;
    }

    if (command === "reset") {
      resetCurrentReport();
      return true;
    }

    return false;
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

    var distributedCommand =
      normalizeDistributedCommand(
        target
      );

    if (distributedCommand) {
      event.preventDefault();

      executeDistributedReportCommand(
        target,
        distributedCommand
      );

      return;
    }

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

      createReport({
        source:
          "CANONICAL_CREATE_REPORT_BUTTON",
        command:
          "create",
        viewAfterCreate:
          false
      });

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
      ) &&
      target.getAttribute(
        "role"
      ) === "button"
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

    state.controls.delegatedEventsActive =
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

        delegatedEventsActive:
          state.controls.delegatedEventsActive,

        engineLookupPaths:
          ENGINE_GLOBAL_PATHS.slice(),

        engine:
          frozenClone(
            state.engine
          ),

        inspectionLane:
          frozenClone(
            state.inspectionLane
          ),

        inspectionLaneExpectedContract:
          INSPECTION_LANE_CONTRACT,

        controlManifestCount:
          state.controls.manifestCount,

        discoveredControlCount:
          state.controls.discoveredCount,

        missingControlCount:
          state.controls.missingCount,

        missingControls:
          state.controls.missing.slice(),

        createReportControlPresent:
          state.controls.createReportPresent,

        distributedDeclarationCount:
          state.controls.distributedDeclarationCount,

        distributedDeclarations:
          frozenClone(
            state.controls.distributedDeclarations
          ),

        distributedExecutionCount:
          state.distributedExecutionCount,

        lastReportCommand:
          state.ui.lastReportCommand,

        lastReportCommandSource:
          state.ui.lastReportCommandSource,

        currentSelection: {
          category:
            state.ui.selectedCategory,
          audit:
            state.ui.selectedAudit,
          participant:
            state.ui.selectedParticipant,
          chamber:
            state.ui.instrumentChamber,
          reportMode:
            state.ui.reportMode
        },

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

        reportAvailable:
          Boolean(
            state.report.current
          ),

        copyAvailable:
          Boolean(
            state.report.current
          ),

        fallbackReportCount:
          state.report.fallbackHistory.length,

        directReceiptCount:
          state.directReceipts.length,

        cycleReceiptPresent:
          Boolean(
            state.cycleReceipt
          ),

        normalizedReceiptCount:
          state.normalizedReceipts.length,

        visibleReceiptCount:
          state.visibleReceipts.length,

        receiptFilter:
          state.ui.receiptFilter,

        actionCount:
          state.actionCount,

        clickCount:
          state.clickCount,

        createReportClickCount:
          state.createReportClickCount,

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

        commandLifecycle: [
          "OBSERVE",
          "CONTEXT",
          "INVOKE",
          "RECEIVE",
          "COMMIT",
          "RENDER",
          "ENABLE",
          "RECEIPT"
        ],

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

      inspectionLane:
        state.inspectionLane,

      controls:
        state.controls,

      ui:
        state.ui,

      report:
        state.report,

      directReceipts:
        state.directReceipts,

      cycleReceipt:
        state.cycleReceipt,

      normalizedReceipts:
        state.normalizedReceipts,

      actionCount:
        state.actionCount,

      clickCount:
        state.clickCount,

      createReportClickCount:
        state.createReportClickCount,

      distributedExecutionCount:
        state.distributedExecutionCount,

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

        viewCurrentReport:
          viewCurrentReport,

        copyReadableReport:
          copyReadableReport,

        copyPacketReport:
          copyPacketReport,

        copyRawReport:
          copyRawReport,

        executeDistributedReportCommand:
          executeDistributedReportCommand,

        applyCommandContext:
          applyCommandContext,

        openReceiptChamber:
          openReceiptChamber,

        openArchiveChamber:
          openArchiveChamber,

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

        inspectDistributedCommands:
          inspectDistributedCommands,

        inspectInspectionLane:
          inspectInspectionLane,

        collectReceiptFamilies:
          collectReceiptFamilies,

        refreshReceiptInventory:
          refreshReceiptInventory,

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

        getNormalizedReceipts:
          function getNormalizedReceipts() {
            return frozenClone(
              state.normalizedReceipts
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

    setTargetVisible(false);
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
    inspectInspectionLane();
    inspectControls();
    renderEngineState();
    refreshReceiptInventory();
    updateDistributedCommandAvailability();
    publishReceipt();

    recordAction(
      "initialize",
      {
        delegatedEventsActive:
          state.controls.delegatedEventsActive,
        createReportControlPresent:
          state.controls.createReportPresent,
        distributedDeclarationCount:
          state.controls.distributedDeclarationCount,
        inspectionLanePresent:
          state.inspectionLane.resolved,
        engineReady:
          state.engine.ready,
        normalizedReceiptCount:
          state.normalizedReceipts.length
      }
    );

    toast(
      state.engine.ready
        ? "Audralia distributed control panel bound."
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
