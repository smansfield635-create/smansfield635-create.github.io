// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v2
// Full-file replacement.
// UI control authority only.
// Diagnostic-route only.
//
// CANONICAL AUTHORITY:
// - AUDRALIA_DIAGNOSTIC_OWNERSHIP_STANDARD_LOCK_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_BLUEPRINT_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_PREBUILD_REGISTRY_v1
//
// SOLE OWNERSHIP:
// - all click handling;
// - all keyboard control handling;
// - event delegation;
// - dropdown opening and closing;
// - left-orbit tab behavior;
// - report-mode tab behavior;
// - observation-lens tab behavior;
// - instrument-deck tab behavior;
// - category selection forwarding;
// - audit selection forwarding;
// - participant selection forwarding;
// - target-window visibility;
// - target-window expansion;
// - target-frame reload;
// - observatory reload;
// - clipboard actions;
// - reset forwarding;
// - direct-check forwarding;
// - nine-cycle forwarding;
// - engine discovery;
// - engine contract validation;
// - engine readiness validation;
// - fallback READ report;
// - fallback control archive;
// - receipt filtering;
// - receipt selection;
// - complete control-binding audit;
// - visible control errors;
// - no-silent-failure enforcement.
//
// DOES NOT OWN:
// - diagnostic state;
// - participant discovery;
// - participant evidence;
// - alias resolution;
// - target observation;
// - runtime evidence;
// - registry evidence;
// - Surface Truth evidence;
// - healthy-engine report construction;
// - READ interpretation when the engine is healthy;
// - direct-check implementation;
// - conductor execution;
// - nine-cycle implementation;
// - receipt normalization;
// - ledger construction;
// - diagnostic archive construction;
// - production mutation;
// - runtime restart;
// - renderer mutation;
// - canvas repair;
// - controls repair;
// - route repair;
// - readiness claims;
// - visual-pass claims;
// - F21 authority;
// - synthetic evidence.
//
// LOAD ORDER:
// - Must load after /showroom/globe/audralia/diagnostic/index.js.
// - Must still bind if index.js is missing, incompatible, held, or throws.
//
// FAILURE LAW:
// - No interactive control may fail silently.
// - Create Report must produce a fallback READ report when the engine is
//   missing, incompatible, not ready, throws, rejects, or returns an invalid
//   report.
// - Direct and cycle controls must visibly report engine unavailability.
// - Local shell controls must remain functional without the engine.

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

var PREVIOUS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v1";

var VERSION =
"2.0.0";

var FILE =
"/showroom/globe/audralia/diagnostic/index.controls.js";

var EXPECTED_ENGINE_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

var EXPECTED_HTML_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_CONTROL_SPLIT_STATIC_SHELL_TNT_v2";

var EXPECTED_CSS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STYLE_TNT_v1";

var TARGET_ROUTE =
"/showroom/globe/audralia/";

var TARGET_FRAME_ID =
"audraliaDiagnosticTargetFrame";

var FALLBACK_REPORT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v2";

var FALLBACK_ARCHIVE_SCHEMA =
"AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_ARCHIVE_v2";

var CONTROL_RECEIPT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT_v2";

var ENGINE_GLOBAL_PATHS =
Object.freeze([
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

var CONTROL_MANIFEST =
Object.freeze([
control("returnToAudralia", "anchor", "LOCAL_NAVIGATION"),
control("toggleObservationTarget", "button", "LOCAL_TARGET_VISIBILITY"),
control("reloadObservatory", "button", "LOCAL_PAGE_RELOAD"),
control("createDeepArchive", "button", "ENGINE_OR_FALLBACK_ARCHIVE"),
control("resetWorkbench", "button", "ENGINE_OR_LOCAL_RESET"),

  control("auditOrbitButton", "tab", "LOCAL_LEFT_ORBIT"),
  control("participantConstellationButton", "tab", "LOCAL_LEFT_ORBIT"),

  control("categorySelectorButton", "button", "LOCAL_SELECTOR"),
  control("auditSelectorButton", "button", "LOCAL_SELECTOR"),

  control("createReport", "button", "ENGINE_OR_FALLBACK_REPORT"),
  control("runDirectCheck", "button", "ENGINE_DIRECT"),
  control("runNineCycle", "button", "ENGINE_CYCLE"),
  control("copyReadableReport", "button", "LOCAL_CLIPBOARD"),
  control("copyPacketReport", "button", "LOCAL_CLIPBOARD"),
  control("copyRawReport", "button", "LOCAL_CLIPBOARD"),
  control("addReportToArchive", "button", "ENGINE_ARCHIVE"),
  control("resetCurrentReport", "button", "ENGINE_OR_LOCAL_RESET"),

  control("reportReadButton", "tab", "LOCAL_REPORT_MODE"),
  control("reportPacketButton", "tab", "LOCAL_REPORT_MODE"),
  control("reportRawButton", "tab", "LOCAL_REPORT_MODE"),
  control("reportEvidenceButton", "tab", "LOCAL_REPORT_MODE"),

  control("targetLensButton", "tab", "LOCAL_OBSERVATION_LENS"),
  control("runtimeLensButton", "tab", "LOCAL_OBSERVATION_LENS"),
  control("surfaceLensButton", "tab", "LOCAL_OBSERVATION_LENS"),
  control("targetWindowButton", "tab", "LOCAL_OBSERVATION_LENS"),

  control("expandTargetWindow", "button", "LOCAL_TARGET_EXPANSION"),
  control("reloadTargetFrame", "button", "LOCAL_TARGET_RELOAD"),

  control("cycleChamberButton", "tab", "LOCAL_INSTRUMENT_CHAMBER"),
  control("registryChamberButton", "tab", "LOCAL_INSTRUMENT_CHAMBER"),
  control("receiptChamberButton", "tab", "LOCAL_INSTRUMENT_CHAMBER"),
  control("archiveChamberButton", "tab", "LOCAL_INSTRUMENT_CHAMBER"),
  control("boundaryChamberButton", "tab", "LOCAL_INSTRUMENT_CHAMBER")
]);

var NO_CLAIMS =
Object.freeze({
productionMutationAuthorized: false,
runtimeRestartAuthorized: false,
rendererMutationAuthorized: false,
canvasRepairAuthorized: false,
canvasBuildAuthorized: false,
canvasReleaseAuthorized: false,
controlsRepairAuthorized: false,
routeRepairAuthorized: false,
repairAuthorized: false,
readyClaimed: false,
visualPassClaimed: false,
cyclePassClaimed: false,
f21Claimed: false,
syntheticEvidenceAuthorized: false
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
  reason: null
},

controls: {
  manifestCount: CONTROL_MANIFEST.length,
  discoveredCount: 0,
  boundCount: 0,
  missingCount: 0,
  unownedInteractiveCount: 0,
  records: [],
  missing: [],
  unownedInteractive: []
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
  selectedReceiptIndex: null
},

reports: {
  fallbackCurrent: null,
  fallbackHistory: []
},

archive: {
  fallbackCurrent: null
},

actionCount: 0,
errorCount: 0,
lastAction: null,
lastError: null

};

function control(id, type, owner) {
return {
id: id,
type: type,
owner: owner
};
}

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

function isPromiseLike(value) {
return Boolean(
value &&
isFunction(value.then)
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
var memory;
var output;

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

memory =
  seen || [];

if (memory.indexOf(value) !== -1) {
  return "[Circular]";
}

memory.push(value);

if (Array.isArray(value)) {
  return value.map(function cloneEntry(entry) {
    return clone(
      entry,
      memory.slice()
    );
  });
}

output = {};

Object.keys(value).forEach(function cloneProperty(key) {
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
var memory;

if (
  !value ||
  (
    typeof value !== "object" &&
    typeof value !== "function"
  )
) {
  return value;
}

memory =
  seen || [];

if (memory.indexOf(value) !== -1) {
  return value;
}

memory.push(value);

try {
  Object.getOwnPropertyNames(value).forEach(function freezeProperty(key) {
    var child;

    try {
      child =
        value[key];
    } catch (_error) {
      child =
        null;
    }

    deepFreeze(
      child,
      memory
    );
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
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
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
    cursor === undefined ||
    cursor[parts[index]] === null ||
    cursor[parts[index]] === undefined
  ) {
    return null;
  }

  cursor =
    cursor[parts[index]];
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

if (node) {
  node.setAttribute(
    "data-status",
    String(status || "UNKNOWN")
      .trim()
      .toUpperCase()
  );
}

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
  detail: clone(detail || null),
  actionNumber: state.actionCount,
  occurredAt: nowIso()
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
  detail: clone(detail || null),
  errorNumber: state.errorCount,
  occurredAt: nowIso()
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

function readEngineState(engine) {
if (
!engine ||
!isFunction(engine.getState)
) {
return null;
}

try {
  return engine.getState();
} catch (_error) {
  return null;
}

}

function deriveEngineStatus(engine, publicState) {
var statusCandidates = [
publicState && publicState.status,
publicState && publicState.engineStatus,
publicState &&
publicState.controllerState,
publicState &&
publicState.drop &&
publicState.drop.report &&
publicState.drop.report.status,
engine && engine.STATUS,
engine && engine.status
];

var index;

for (
  index = 0;
  index < statusCandidates.length;
  index += 1
) {
  if (
    typeof statusCandidates[index] === "string" &&
    statusCandidates[index].trim()
  ) {
    return statusCandidates[index]
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

  state.engine.resolved =
    true;

  state.engine.path =
    candidatePath;

  state.engine.contract =
    typeof candidate.CONTRACT === "string"
      ? candidate.CONTRACT
      : null;

  if (
    state.engine.contract !==
    EXPECTED_ENGINE_CONTRACT
  ) {
    state.engine.reason =
      "ENGINE_CONTRACT_MISMATCH";

    continue;
  }

  state.engine.compatible =
    true;

  publicState =
    readEngineState(candidate);

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
    ) !== -1;

  state.engine.reason =
    state.engine.ready
      ? "ENGINE_READY"
      : "ENGINE_NOT_READY";

  if (state.engine.ready) {
    publishReceipt();

    return candidate;
  }
}

publishReceipt();

return null;

}

function getResolvedEngineWithoutReadiness() {
var index;
var candidate;

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
    candidate &&
    typeof candidate === "object" &&
    candidate.CONTRACT ===
      EXPECTED_ENGINE_CONTRACT
  ) {
    return candidate;
  }
}

return null;

}

function validateEngineResult(
methodName,
result,
options
) {
var settings =
options || {};

if (
  settings.allowNull === true
) {
  return true;
}

if (
  result === null ||
  result === undefined
) {
  return false;
}

if (
  methodName === "createReport"
) {
  return Boolean(
    isObject(result) &&
    (
      result.reportId ||
      result.schema ||
      result.read
    )
  );
}

return true;

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
        methodName: methodName
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
  methodName,
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
      !validateEngineResult(
        methodName,
        value,
        settings
      )
    ) {
      if (
        isFunction(settings.fallback)
      ) {
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
        ),
        {
          result:
            clone(value)
        }
      );
    }

    setText(
      "controllerState",
      "REPORT READY"
    );

    setStatus(
      "controllerState",
      "READY"
    );

    return value;
  })
  .catch(function engineRejected(error) {
    if (
      isFunction(settings.fallback)
    ) {
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

  classification:
    "CONTROL_FALLBACK_REPORT",

  createdAt:
    nowIso(),

  controlPanelContract:
    CONTRACT,

  expectedEngineContract:
    EXPECTED_ENGINE_CONTRACT,

  expectedHtmlContract:
    EXPECTED_HTML_CONTRACT,

  expectedCssContract:
    EXPECTED_CSS_CONTRACT,

  engineResolution:
    frozenClone(
      state.engine
    ),

  result:
    "The independent Audralia control panel is functioning, but a healthy compatible diagnostic engine is unavailable.",

  evidence: [
    "The Create Report control received a user activation.",
    "The control panel loaded and owns the interface controls.",
    "The control panel completed engine discovery and validation.",
    "The fallback READ path rendered without requiring diagnostic-engine execution."
  ],

  absence: [
    reason,
    errorMessage ||
      "No additional engine exception message was supplied.",
    "Healthy engine-backed diagnostic evidence could not be constructed."
  ],

  direction: [
    "Inspect /showroom/globe/audralia/diagnostic/index.js.",
    "Verify the engine contract is " +
      EXPECTED_ENGINE_CONTRACT +
      ".",
    "Verify index.js loads before index.controls.js.",
    "Inspect the diagnostic-engine receipt and browser console.",
    "Renew the engine before attempting direct or nine-cycle execution."
  ],

  noClaims:
    NO_CLAIMS
};

state.reports.fallbackCurrent =
  deepFreeze(report);

state.reports.fallbackHistory.push(
  state.reports.fallbackCurrent
);

renderFallbackReport(
  state.reports.fallbackCurrent
);

recordAction(
  "createFallbackReport",
  {
    reportId:
      report.reportId,
    reason:
      reason
  }
);

toast(
  "Fallback READ report created.",
  "HELD"
);

return frozenClone(
  state.reports.fallbackCurrent
);

}

function renderFallbackReadRegion(
id,
letter,
label,
headline,
entries
) {
var lines =
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
    lines.length > 1
      ? "<ul>" +
        lines
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
          lines[0] || ""
        ) +
        "</p>"
  )
);

}

function renderFallbackReport(report) {
renderFallbackReadRegion(
"readResult",
"R",
"Result",
"Diagnostic engine unavailable",
report.result
);

renderFallbackReadRegion(
  "readEvidence",
  "E",
  "Evidence",
  "Control activation confirmed",
  report.evidence
);

renderFallbackReadRegion(
  "readAbsence",
  "A",
  "Absence",
  "Healthy engine evidence unavailable",
  report.absence
);

renderFallbackReadRegion(
  "readDirection",
  "D",
  "Direction",
  "Inspect the diagnostic engine",
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
  state.engine.reason
);

setText(
  "packetOutput",
  safeJson({
    schema:
      report.schema,
    reportId:
      report.reportId,
    classification:
      report.classification,
    createdAt:
      report.createdAt,
    result:
      report.result,
    evidence:
      report.evidence,
    absence:
      report.absence,
    direction:
      report.direction
  })
);

setText(
  "rawOutput",
  safeJson(report)
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
  "READY"
);

setStatus(
  "dropReportCell",
  "READY"
);

setText(
  "dropReportAvailableCount",
  state.reports.fallbackHistory.length
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

selectReportModeLocal(
  "read"
);

}

function fallbackReadableText() {
var report =
state.reports.fallbackCurrent;

if (!report) {
  return "";
}

return [
  "AUDRALIA DROP WITH READ CONTROL FALLBACK REPORT",
  "REPORT_ID=" + report.reportId,
  "SCHEMA=" + report.schema,
  "CREATED_AT=" + report.createdAt,
  "",
  "RESULT",
  report.result,
  "",
  "EVIDENCE",
  report.evidence
    .map(function mapEvidence(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "ABSENCE",
  report.absence
    .map(function mapAbsence(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "DIRECTION",
  report.direction
    .map(function mapDirection(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "BOUNDARY",
  "Diagnostic-only. Read-only. No readiness, visual-pass, cycle-pass, or F21 claim."
].join("\n");

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

return invokeEngine(
  "createReport",
  [],
  {
    fallback:
      createFallbackReport
  }
);

}

function runDirectCheck() {
setText(
"controllerState",
"DIRECT CHECK"
);

setStatus(
  "controllerState",
  "RUNNING"
);

return invokeEngine(
  "runSelectedDirectCheck",
  [],
  {
    fallback:
      function directFallback(context) {
        renderExecutionUnavailable(
          "Direct Execution",
          context
        );

        return null;
      },
    allowNull:
      false
  }
);

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

return invokeEngine(
  "runNineCycle",
  [],
  {
    fallback:
      function cycleFallback(context) {
        renderExecutionUnavailable(
          "Nine-Cycle",
          context
        );

        return null;
      },
    allowNull:
      false
  }
);

}

function renderExecutionUnavailable(label, context) {
var reason =
context && context.reason
? context.reason
: "ENGINE_UNAVAILABLE";

setText(
  "controllerState",
  "ENGINE HELD"
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
  label +
  " unavailable: " +
  reason
);

recordError(
  label,
  new Error(
    label +
    " requires a healthy compatible diagnostic engine."
  ),
  context
);

}

function addReportToArchive() {
return invokeEngine(
"addCurrentReportToArchive",
[],
{
fallback:
function archiveUnavailable(context) {
recordError(
"addCurrentReportToArchive",
new Error(
"Healthy engine archive unavailable."
),
context
);

        return null;
      },
    allowNull:
      true
  }
);

}

function createDeepArchive() {
return invokeEngine(
"createDeepArchive",
[],
{
fallback:
createFallbackArchive
}
);
}

function createFallbackArchive(context) {
var archive = {
schema:
FALLBACK_ARCHIVE_SCHEMA,

  archiveId:
    "AUDRALIA_CONTROL_ARCHIVE_" +
    Date.now(),

  createdAt:
    nowIso(),

  reason:
    context && context.reason
      ? context.reason
      : "ENGINE_UNAVAILABLE",

  controlPanel:
    getPublicState(),

  fallbackReports:
    frozenClone(
      state.reports.fallbackHistory
    ),

  controlReceipt:
    frozenClone(
      root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT ||
      null
    ),

  noClaims:
    NO_CLAIMS
};

state.archive.fallbackCurrent =
  deepFreeze(archive);

setText(
  "archiveSessionCount",
  state.reports.fallbackHistory.length
);

setHtml(
  "archiveReportList",
  state.reports.fallbackHistory.length
    ? state.reports.fallbackHistory
        .map(function renderArchivedReport(report) {
          return (
            "<article>" +
            "<h4>Control Fallback Report</h4>" +
            "<p>" +
            escapeHtml(report.reportId) +
            "</p>" +
            "</article>"
          );
        })
        .join("")
    : (
        '<article class="empty-state">' +
        "<h4>No fallback reports</h4>" +
        "<p>Create a fallback report before archiving.</p>" +
        "</article>"
      )
);

setText(
  "archiveRawOutput",
  safeJson(
    state.archive.fallbackCurrent
  )
);

selectInstrumentChamberLocal(
  "archive"
);

recordAction(
  "createFallbackArchive",
  {
    archiveId:
      archive.archiveId
  }
);

toast(
  "Fallback control archive created.",
  "HELD"
);

return frozenClone(
  state.archive.fallbackCurrent
);

}

function resetCurrentReport() {
var engine =
getResolvedEngineWithoutReadiness();

if (
  engine &&
  isFunction(engine.resetCurrentReport)
) {
  try {
    engine.resetCurrentReport();
  } catch (error) {
    recordError(
      "resetCurrentReport",
      error
    );
  }
}

state.reports.fallbackCurrent =
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

renderFallbackReadRegion(
  "readResult",
  "R",
  "Result",
  "Observatory available",
  "Create a report to evaluate the selected audit."
);

renderFallbackReadRegion(
  "readEvidence",
  "E",
  "Evidence",
  "Control panel available",
  "The independent control panel remains bound."
);

renderFallbackReadRegion(
  "readAbsence",
  "A",
  "Absence",
  "No report yet",
  "No current engine or fallback report is displayed."
);

renderFallbackReadRegion(
  "readDirection",
  "D",
  "Direction",
  "Create the first report",
  "Use Create Report to inspect the current engine state."
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

selectReportModeLocal(
  "read"
);

recordAction(
  "resetCurrentReport"
);

toast(
  "Current report reset.",
  "READY"
);

return null;

}

function resetWorkbench() {
var engine =
getResolvedEngineWithoutReadiness();

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

resetCurrentReport();
closeAllSelectors();

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

state.ui.selectedReceiptIndex =
  null;

applyReceiptFilter(
  "all"
);

recordAction(
  "resetWorkbench"
);

toast(
  "Workbench reset.",
  "READY"
);

return null;

}

function copyText(text, successMessage) {
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

function fallbackCopy(text, successMessage) {
var area =
doc.createElement(
"textarea"
);

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

  toast(
    copied
      ? successMessage || "Copied."
      : "Copy unavailable.",
    copied
      ? "READY"
      : "HELD"
  );
} catch (_error) {
  toast(
    "Copy unavailable.",
    "HELD"
  );
}

doc.body.removeChild(area);

return copied;

}

function copyReadableReport() {
var engine =
getResolvedEngineWithoutReadiness();

var text =
  "";

if (
  engine &&
  isFunction(engine.getReadableReport)
) {
  try {
    text =
      engine.getReadableReport() ||
      "";
  } catch (error) {
    recordError(
      "getReadableReport",
      error
    );
  }
}

if (!text) {
  text =
    fallbackReadableText();
}

if (!text) {
  var current =
    engine &&
    isFunction(engine.getCurrentReport)
      ? engine.getCurrentReport()
      : null;

  if (current) {
    text =
      safeJson(current);
  }
}

recordAction(
  "copyReadableReport"
);

return copyText(
  text,
  "Readable report copied."
);

}

function copyPacketReport() {
var engine =
getResolvedEngineWithoutReadiness();

var text =
  "";

if (
  engine &&
  isFunction(engine.getReportPacket)
) {
  try {
    text =
      engine.getReportPacket() ||
      "";
  } catch (error) {
    recordError(
      "getReportPacket",
      error
    );
  }
}

if (!text) {
  var node =
    byId("packetOutput");

  text =
    node
      ? node.textContent
      : "";
}

recordAction(
  "copyPacketReport"
);

return copyText(
  text,
  "Report packet copied."
);

}

function copyRawReport() {
var engine =
getResolvedEngineWithoutReadiness();

var text =
  "";

if (
  engine &&
  isFunction(engine.getRawReport)
) {
  try {
    text =
      engine.getRawReport() ||
      "";
  } catch (error) {
    recordError(
      "getRawReport",
      error
    );
  }
}

if (!text) {
  var node =
    byId("rawOutput");

  text =
    node
      ? node.textContent
      : "";
}

recordAction(
  "copyRawReport"
);

return copyText(
  text,
  "Raw report copied."
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

if (!button || !menu) {
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

recordAction(
  "toggleSelector",
  {
    buttonId:
      buttonId,
    open:
      shouldOpen
  }
);

}

function selectCategory(categoryId) {
closeAllSelectors();

return invokeEngine(
  "selectCategory",
  [categoryId],
  {
    fallback:
      function categoryFallback(context) {
        renderLocalCategorySelection(
          categoryId
        );

        recordError(
          "selectCategory",
          new Error(
            "CATEGORY_SELECTION_ENGINE_UNAVAILABLE"
          ),
          context
        );

        return categoryId;
      }
  }
);

}

function renderLocalCategorySelection(categoryId) {
var option =
doc.querySelector(
'[data-category-id="' +
cssEscape(categoryId) +
'"]'
);

if (!option) {
  return;
}

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

}

function selectAudit(auditId) {
closeAllSelectors();

return invokeEngine(
  "selectAudit",
  [auditId],
  {
    fallback:
      function auditFallback(context) {
        renderLocalAuditSelection(
          auditId
        );

        recordError(
          "selectAudit",
          new Error(
            "AUDIT_SELECTION_ENGINE_UNAVAILABLE"
          ),
          context
        );

        return auditId;
      }
  }
);

}

function renderLocalAuditSelection(auditId) {
var option =
doc.querySelector(
'[data-audit-id="' +
cssEscape(auditId) +
'"]'
);

if (!option) {
  return;
}

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

}

function selectParticipant(role) {
return invokeEngine(
"selectParticipant",
[role],
{
fallback:
function participantFallback(context) {
var node =
doc.querySelector(
'[data-participant-role="' +
cssEscape(role) +
'"]'
);

        setHtml(
          "participantDetail",
          "<h3>" +
          escapeHtml(
            node &&
            node.querySelector("strong")
              ? node.querySelector("strong").textContent
              : role
          ) +
          "</h3>" +
          "<p>The participant selection control is functional, but the diagnostic engine is unavailable to inspect this participant.</p>"
        );

        recordError(
          "selectParticipant",
          new Error(
            "PARTICIPANT_INSPECTION_ENGINE_UNAVAILABLE"
          ),
          context
        );

        return role;
      }
  }
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

function selectReportMode(mode) {
selectReportModeLocal(mode);

var engine =
  getResolvedEngineWithoutReadiness();

if (
  engine &&
  isFunction(engine.selectReportMode)
) {
  try {
    engine.selectReportMode(mode);
  } catch (error) {
    recordError(
      "selectReportMode",
      error
    );
  }
}

recordAction(
  "selectReportMode",
  {
    mode:
      mode
  }
);

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

function selectObservationLens(lens) {
selectObservationLensLocal(lens);

var engine =
  getResolvedEngineWithoutReadiness();

if (
  engine &&
  isFunction(
    engine.selectObservationLens
  )
) {
  try {
    engine.selectObservationLens(
      lens
    );
  } catch (error) {
    recordError(
      "selectObservationLens",
      error
    );
  }
}

recordAction(
  "selectObservationLens",
  {
    lens:
      lens
  }
);

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

function selectInstrumentChamber(chamber) {
selectInstrumentChamberLocal(
chamber
);

var engine =
  getResolvedEngineWithoutReadiness();

if (
  engine &&
  isFunction(
    engine.selectInstrumentChamber
  )
) {
  try {
    engine.selectInstrumentChamber(
      chamber
    );
  } catch (error) {
    recordError(
      "selectInstrumentChamber",
      error
    );
  }
}

recordAction(
  "selectInstrumentChamber",
  {
    chamber:
      chamber
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

selectObservationLens(
  state.ui.targetVisible
    ? "window"
    : "target"
);

recordAction(
  "setTargetVisible",
  {
    visible:
      state.ui.targetVisible
  }
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

recordAction(
  "setTargetExpanded",
  {
    expanded:
      state.ui.targetExpanded
  }
);

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

function getReceiptEntries() {
var engine =
getResolvedEngineWithoutReadiness();

var entries =
  [];

if (
  engine &&
  isFunction(engine.getReceipts)
) {
  try {
    var cycleReceipts =
      engine.getReceipts();

    if (Array.isArray(cycleReceipts)) {
      cycleReceipts.forEach(function addCycleReceipt(receipt) {
        entries.push({
          type:
            "cycle",
          label:
            (
              receipt.fibonacci
                ? receipt.fibonacci +
                  " · "
                : ""
            ) +
            (
              receipt.stationId ||
              "Cycle Receipt"
            ),
          record:
            frozenClone(receipt)
        });
      });
    }
  } catch (error) {
    recordError(
      "getReceipts",
      error
    );
  }
}

if (
  state.reports.fallbackCurrent
) {
  entries.push({
    type:
      "control",
    label:
      "Control Fallback Report",
    record:
      frozenClone(
        state.reports.fallbackCurrent
      )
  });
}

if (
  root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT
) {
  entries.push({
    type:
      "control",
    label:
      "Control Panel Receipt",
    record:
      frozenClone(
        root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT
      )
  });
}

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
        if (
          filter === "participant"
        ) {
          return entry.type ===
            "participant";
        }

        if (
          filter === "observation"
        ) {
          return entry.type ===
            "observation";
        }

        if (
          filter === "cycle"
        ) {
          return entry.type ===
            "cycle";
        }

        if (
          filter === "error"
        ) {
          return entry.type ===
            "error";
        }

        return entry.type ===
          filter;
      });

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

state._visibleReceipts =
  visible;

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
var receipts =
Array.isArray(
state._visibleReceipts
)
? state._visibleReceipts
: [];

var entry =
  receipts[index] ||
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
var records = [];
var missing = [];

CONTROL_MANIFEST.forEach(function inspectManifestEntry(entry) {
  var node =
    byId(entry.id);

  var record = {
    id:
      entry.id,
    type:
      entry.type,
    owner:
      entry.owner,
    present:
      Boolean(node),
    disabled:
      node
        ? Boolean(node.disabled)
        : null,
    hidden:
      node
        ? Boolean(node.hidden)
        : null
  };

  records.push(record);

  if (!node) {
    missing.push(
      entry.id
    );
  }
});

var interactiveNodes =
  Array.prototype.slice.call(
    doc.querySelectorAll(
      "button, a[href], [role='button'], [role='tab'], [role='option']"
    )
  );

var manifestIds =
  CONTROL_MANIFEST.map(function mapId(entry) {
    return entry.id;
  });

var unowned =
  interactiveNodes
    .filter(function findUnowned(node) {
      if (
        node.hasAttribute(
          "data-category-id"
        ) ||
        node.hasAttribute(
          "data-audit-id"
        ) ||
        node.hasAttribute(
          "data-participant-role"
        ) ||
        node.hasAttribute(
          "data-report-mode"
        ) ||
        node.hasAttribute(
          "data-observation-lens"
        ) ||
        node.hasAttribute(
          "data-instrument-chamber"
        ) ||
        node.hasAttribute(
          "data-left-orbit-view"
        ) ||
        node.hasAttribute(
          "data-receipt-filter"
        ) ||
        node.hasAttribute(
          "data-receipt-index"
        )
      ) {
        return false;
      }

      return (
        !node.id ||
        manifestIds.indexOf(
          node.id
        ) === -1
      );
    })
    .map(function mapUnowned(node) {
      return {
        id:
          node.id || null,
        tag:
          node.tagName,
        role:
          node.getAttribute("role"),
        text:
          String(
            node.textContent || ""
          )
            .trim()
            .slice(0, 100)
      };
    });

state.controls.records =
  records;

state.controls.discoveredCount =
  records.filter(function countPresent(record) {
    return record.present;
  }).length;

state.controls.boundCount =
  state.controls.discoveredCount;

state.controls.missing =
  missing;

state.controls.missingCount =
  missing.length;

state.controls.unownedInteractive =
  unowned;

state.controls.unownedInteractiveCount =
  unowned.length;

renderControlAuditStatus();
publishReceipt();

return frozenClone(
  state.controls
);

}

function renderControlAuditStatus() {
if (
state.controls.missingCount === 0 &&
state.controls.unownedInteractiveCount === 0
) {
setText(
"dropDirectLastAction",
"Control binding audit complete: all declared controls owned."
);

  return;
}

var messages = [];

if (
  state.controls.missingCount
) {
  messages.push(
    "Missing controls: " +
    state.controls.missing.join(", ")
  );
}

if (
  state.controls.unownedInteractiveCount
) {
  messages.push(
    "Unowned interactive controls: " +
    state.controls.unownedInteractiveCount
  );
}

setText(
  "dropDirectLastAction",
  messages.join(" · ")
);

setStatus(
  "dropDirectCell",
  "HELD"
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
    "Independent controls bound; compatible engine ready."
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
var target =
event.target.closest(
"button, a[href], [role='button'], [role='tab'], [role='option']"
);

if (!target) {
  if (
    !event.target.closest(
      ".custom-selector"
    )
  ) {
    closeAllSelectors();
  }

  return;
}

var id =
  target.id || "";

if (id === "returnToAudralia") {
  recordAction(
    "returnToAudralia"
  );

  return;
}

if (id === "createReport") {
  event.preventDefault();
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

  var leftView =
    target.getAttribute(
      "data-left-orbit-view"
    );

  selectLeftOrbitLocal(
    leftView
  );

  recordAction(
    "selectLeftOrbit",
    {
      view:
        leftView
    }
  );

  return;
}

if (
  target.hasAttribute(
    "data-report-mode"
  )
) {
  event.preventDefault();

  selectReportMode(
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

  selectObservationLens(
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

  selectInstrumentChamber(
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
var target =
event.target.closest(
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

var engine =
  getResolvedEngineWithoutReadiness();

if (
  engine &&
  isFunction(engine.observe)
) {
  try {
    var result =
      engine.observe();

    if (isPromiseLike(result)) {
      result.catch(function observationRejected(error) {
        recordError(
          "observe",
          error
        );
      });
    }
  } catch (error) {
    recordError(
      "observe",
      error
    );
  }
}

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

}

function publishReceipt() {
root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT =
deepFreeze({
schema:
CONTROL_RECEIPT_SCHEMA,

    contract:
      CONTRACT,

    previousContract:
      PREVIOUS_CONTRACT,

    version:
      VERSION,

    file:
      FILE,

    expectedEngineContract:
      EXPECTED_ENGINE_CONTRACT,

    expectedHtmlContract:
      EXPECTED_HTML_CONTRACT,

    expectedCssContract:
      EXPECTED_CSS_CONTRACT,

    initialized:
      state.initialized,

    initializedAt:
      state.initializedAt,

    engine:
      frozenClone(
        state.engine
      ),

    controlManifestCount:
      state.controls.manifestCount,

    discoveredControlCount:
      state.controls.discoveredCount,

    boundControlCount:
      state.controls.boundCount,

    missingControlCount:
      state.controls.missingCount,

    missingControls:
      state.controls.missing.slice(),

    unownedInteractiveCount:
      state.controls.unownedInteractiveCount,

    unownedInteractive:
      frozenClone(
        state.controls.unownedInteractive
      ),

    eventDelegationActive:
      state.initialized,

    createReportFallbackAvailable:
      true,

    fallbackConditions: [
      "ENGINE_NOT_FOUND",
      "ENGINE_CONTRACT_MISMATCH",
      "ENGINE_NOT_READY",
      "ENGINE_METHOD_MISSING",
      "ENGINE_METHOD_THROW",
      "ENGINE_METHOD_REJECTED",
      "ENGINE_RESULT_INVALID"
    ],

    receiptFilteringOwned:
      true,

    receiptSelectionOwned:
      true,

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

    fallbackReportCount:
      state.reports.fallbackHistory.length,

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

  previousContract:
    PREVIOUS_CONTRACT,

  version:
    VERSION,

  file:
    FILE,

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

  fallbackCurrent:
    state.reports.fallbackCurrent,

  fallbackHistoryCount:
    state.reports.fallbackHistory.length,

  fallbackArchive:
    state.archive.fallbackCurrent,

  actionCount:
    state.actionCount,

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

    PREVIOUS_CONTRACT:
      PREVIOUS_CONTRACT,

    VERSION:
      VERSION,

    FILE:
      FILE,

    EXPECTED_ENGINE_CONTRACT:
      EXPECTED_ENGINE_CONTRACT,

    EXPECTED_HTML_CONTRACT:
      EXPECTED_HTML_CONTRACT,

    EXPECTED_CSS_CONTRACT:
      EXPECTED_CSS_CONTRACT,

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
      selectReportMode,

    selectObservationLens:
      selectObservationLens,

    selectInstrumentChamber:
      selectInstrumentChamber,

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

    getFallbackReport:
      function getFallbackReport() {
        return frozenClone(
          state.reports.fallbackCurrent
        );
      },

    getFallbackArchive:
      function getFallbackArchive() {
        return frozenClone(
          state.archive.fallbackCurrent
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

applyReceiptFilter(
  "all"
);

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
publishReceipt();

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
existing.CONTRACT === CONTRACT
) {
return;
}

if (doc.readyState === "loading") {
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
