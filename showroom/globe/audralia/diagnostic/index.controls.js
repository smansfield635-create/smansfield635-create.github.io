// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v1
// Full-file replacement.
// Diagnostic route controls only.
//
// Canonical authority:
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_BLUEPRINT_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_PREBUILD_REGISTRY_v1
//
// Purpose:
// - Bind the Audralia diagnostic observatory controls independently from the
//   diagnostic engine.
// - Keep button binding available even when the diagnostic engine fails to
//   publish or initialize.
// - Forward explicit user actions to the public observatory API.
// - Provide a minimal fallback READ report when Create Report is activated
//   without an available diagnostic engine.
// - Own dropdowns, tabs, visibility controls, copying, reset forwarding,
//   target-frame controls, error presentation, and control receipts.
//
// Owns:
// - DOM control binding;
// - event delegation;
// - category and audit selection forwarding;
// - participant selection forwarding;
// - report-mode switching forwarding;
// - observation-lens switching forwarding;
// - instrument-chamber switching forwarding;
// - target-window visibility;
// - target-window expansion;
// - target-frame reload;
// - copy forwarding;
// - report creation forwarding;
// - direct-check forwarding;
// - nine-cycle forwarding;
// - archive forwarding;
// - workbench-reset forwarding;
// - fallback READ report;
// - visible control errors;
// - control-panel public API.
//
// Does not own:
// - participant discovery;
// - alias resolution;
// - report evidence construction;
// - READ interpretation when the engine is available;
// - target observation;
// - runtime inspection;
// - Surface Truth inspection;
// - direct authority selection;
// - direct execution implementation;
// - conductor invocation;
// - cycle execution;
// - receipt normalization;
// - archive construction;
// - production mutation;
// - runtime restart;
// - renderer mutation;
// - repair;
// - readiness;
// - visual pass;
// - F21 authority.
//
// Required load order:
// 1. Engine family
// 2. Diagnostic participant family
// 3. /showroom/globe/audralia/diagnostic/index.js
// 4. /showroom/globe/audralia/diagnostic/index.controls.js
//
// The control panel must remain independently bindable even when step 3 fails.

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
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v1";

var VERSION =
"1.0.0";

var FILE =
"/showroom/globe/audralia/diagnostic/index.controls.js";

var ENGINE_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER_TNT_v1";

var HTML_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STATIC_SHELL_TNT_v1";

var CSS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STYLE_TNT_v1";

var TARGET_ROUTE =
"/showroom/globe/audralia/";

var ENGINE_GLOBALS =
Object.freeze([
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
"AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
"AUDRALIA.dropWithReadDiagnosticObservatory",
"AUDRALIA.diagnosticRouteController"
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
syntheticEvidenceAuthorized: false
});

var REQUIRED_CONTROL_IDS =
Object.freeze([
"createReport",
"runDirectCheck",
"runNineCycle",
"copyReadableReport",
"copyPacketReport",
"copyRawReport",
"addReportToArchive",
"resetCurrentReport",
"resetWorkbench",
"createDeepArchive",
"reloadObservatory",
"toggleObservationTarget",
"expandTargetWindow",
"reloadTargetFrame",
"categorySelectorButton",
"auditSelectorButton",
"audraliaDiagnosticTargetFrame"
]);

var state = {
initialized: false,
boundAt: null,
lastAction: null,
lastError: null,
actionCount: 0,
engineAvailable: false,
enginePath: null,
missingControls: [],
boundControls: [],
fallbackReport: null,
categoryMenuOpen: false,
auditMenuOpen: false,
targetVisible: false,
targetExpanded: false
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

function resolveEngine() {
var index;
var candidate;

for (
  index = 0;
  index < ENGINE_GLOBALS.length;
  index += 1
) {
  candidate =
    readPath(
      ENGINE_GLOBALS[index]
    );

  if (
    candidate &&
    typeof candidate === "object"
  ) {
    state.engineAvailable =
      true;

    state.enginePath =
      ENGINE_GLOBALS[index];

    return candidate;
  }
}

state.engineAvailable =
  false;

state.enginePath =
  null;

return null;

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

function setStatus(id, status) {
var node =
byId(id);

if (node) {
  node.setAttribute(
    "data-status",
    String(status || "UNKNOWN")
  );
}

}

function toast(message) {
var node =
byId("toast");

if (!node) {
  return;
}

node.textContent =
  String(message || "");

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
  }, 2600);

}

function recordAction(action, detail) {
state.actionCount += 1;

state.lastAction = {
  action:
    action,

  detail:
    detail || null,

  actionNumber:
    state.actionCount,

  occurredAt:
    nowIso()
};

publishReceipt();

}

function recordError(action, error) {
state.lastError = {
action:
action,

  message:
    String(
      error &&
      error.message
        ? error.message
        : error
    ),

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
  "Control error: " +
  state.lastError.message
);

}

function invokeEngineMethod(
methodName,
args,
options
) {
var engine =
resolveEngine();

var settings =
  options || {};

if (
  !engine ||
  !isFunction(engine[methodName])
) {
  if (settings.fallback) {
    return settings.fallback();
  }

  var unavailable =
    new Error(
      "DIAGNOSTIC_ENGINE_METHOD_UNAVAILABLE:" +
      methodName
    );

  recordError(
    methodName,
    unavailable
  );

  return null;
}

try {
  recordAction(
    methodName,
    {
      enginePath:
        state.enginePath
    }
  );

  var result =
    engine[methodName].apply(
      engine,
      Array.isArray(args)
        ? args
        : []
    );

  if (
    result &&
    isFunction(result.then)
  ) {
    setText(
      "controllerState",
      "EXECUTING"
    );

    setStatus(
      "controllerState",
      "RUNNING"
    );

    return result
      .then(function engineMethodResolved(value) {
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
      .catch(function engineMethodRejected(error) {
        recordError(
          methodName,
          error
        );

        return null;
      });
  }

  return result;
} catch (error) {
  recordError(
    methodName,
    error
  );

  return null;
}

}

function renderFallbackReadRegion(
id,
letter,
label,
headline,
body
) {
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
"<p>" +
escapeHtml(body) +
"</p>"
);
}

function createFallbackReport() {
var report = {
schema:
"AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v1",

  reportId:
    "AUDRALIA_CONTROL_FALLBACK_" +
    Date.now(),

  classification:
    "CONTROL_FALLBACK_REPORT",

  createdAt:
    nowIso(),

  controllerContract:
    CONTRACT,

  expectedEngineContract:
    ENGINE_CONTRACT,

  htmlContract:
    HTML_CONTRACT,

  cssContract:
    CSS_CONTRACT,

  result:
    "The diagnostic control panel is functioning, but the diagnostic engine API is unavailable.",

  evidence: [
    "The Create Report control received a user activation.",
    "The independent control panel loaded and bound its interface.",
    "No compatible diagnostic engine API was resolved from the accepted global paths."
  ],

  absence: [
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY API unavailable.",
    "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER API unavailable.",
    "Engine-backed participant, observation, direct, cycle, and archive evidence could not be read."
  ],

  direction: [
    "Inspect /showroom/globe/audralia/diagnostic/index.js.",
    "Check the browser console for parse or initialization errors.",
    "Verify that index.js loads before index.controls.js.",
    "Verify that the engine publishes the expected public API."
  ],

  acceptedEngineGlobals:
    ENGINE_GLOBALS.slice(),

  noClaims:
    NO_CLAIMS
};

state.fallbackReport =
  report;

renderFallbackReadRegion(
  "readResult",
  "R",
  "Result",
  "Diagnostic controller unavailable",
  report.result
);

renderFallbackReadRegion(
  "readEvidence",
  "E",
  "Evidence",
  "Control activation confirmed",
  report.evidence.join(" ")
);

renderFallbackReadRegion(
  "readAbsence",
  "A",
  "Absence",
  "Diagnostic API not published",
  report.absence.join(" ")
);

renderFallbackReadRegion(
  "readDirection",
  "D",
  "Direction",
  "Inspect the diagnostic engine",
  report.direction.join(" ")
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
  " · Engine API unavailable"
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
  "1"
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
      report.reportId
  }
);

toast(
  "Fallback report created; diagnostic engine unavailable."
);

return report;

}

function fallbackReadableText() {
var report =
state.fallbackReport;

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
  "Diagnostic-only. Read-only. No readiness or visual-pass claim."
].join("\n");

}

function createReport() {
return invokeEngineMethod(
"createReport",
[],
{
fallback:
createFallbackReport
}
);
}

function runDirectCheck() {
return invokeEngineMethod(
"runSelectedDirectCheck",
[],
{
fallback:
function directUnavailable() {
recordError(
"runSelectedDirectCheck",
new Error(
"DIRECT_EXECUTION_REQUIRES_DIAGNOSTIC_ENGINE"
)
);

        return null;
      }
  }
);

}

function runNineCycle() {
return invokeEngineMethod(
"runNineCycle",
[],
{
fallback:
function cycleUnavailable() {
recordError(
"runNineCycle",
new Error(
"NINE_CYCLE_REQUIRES_DIAGNOSTIC_ENGINE"
)
);

        return null;
      }
  }
);

}

function addReportToArchive() {
return invokeEngineMethod(
"addCurrentReportToArchive",
[],
{
fallback:
function archiveUnavailable() {
toast(
"Archive unavailable without diagnostic engine."
);

        return null;
      }
  }
);

}

function createDeepArchive() {
return invokeEngineMethod(
"createDeepArchive",
[],
{
fallback:
function deepArchiveUnavailable() {
var fallbackArchive = {
schema:
"AUDRALIA_CONTROL_PANEL_FALLBACK_ARCHIVE_v1",

          contract:
            CONTRACT,

          createdAt:
            nowIso(),

          controlState:
            getPublicState(),

          fallbackReport:
            clone(
              state.fallbackReport
            ),

          noClaims:
            NO_CLAIMS
        };

        fallbackArchive.archiveText =
          safeJson(
            fallbackArchive
          );

        setText(
          "archiveRawOutput",
          fallbackArchive.archiveText
        );

        setText(
          "archiveSessionCount",
          state.fallbackReport
            ? "1"
            : "0"
        );

        setHtml(
          "archiveReportList",
          state.fallbackReport
            ? (
                "<article>" +
                "<h4>Control Fallback Report</h4>" +
                "<p>" +
                escapeHtml(
                  state.fallbackReport.reportId
                ) +
                "</p>" +
                "</article>"
              )
            : (
                '<article class="empty-state">' +
                "<h4>No fallback report</h4>" +
                "<p>Create a report before building the fallback archive.</p>" +
                "</article>"
              )
        );

        recordAction(
          "createFallbackArchive"
        );

        toast(
          "Fallback control archive created."
        );

        return fallbackArchive;
      }
  }
);

}

function resetCurrentReport() {
var engine =
resolveEngine();

if (
  engine &&
  isFunction(
    engine.resetCurrentReport
  )
) {
  return invokeEngineMethod(
    "resetCurrentReport",
    []
  );
}

state.fallbackReport =
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
  "No fallback or engine report is currently displayed."
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

recordAction(
  "resetFallbackReport"
);

toast(
  "Current report reset."
);

return null;

}

function resetWorkbench() {
var engine =
resolveEngine();

if (
  engine &&
  isFunction(
    engine.resetWorkbench
  )
) {
  return invokeEngineMethod(
    "resetWorkbench",
    []
  );
}

resetCurrentReport();
closeAllSelectors();
selectReportModeLocal("read");
selectObservationLensLocal("target");
selectInstrumentChamberLocal("cycle");
setTargetVisible(false);
setTargetExpanded(false);

setText(
  "controllerState",
  "ENGINE HELD"
);

setStatus(
  "controllerState",
  "HELD"
);

recordAction(
  "resetFallbackWorkbench"
);

toast(
  "Fallback workbench reset."
);

return null;

}

function copyText(text, successMessage) {
if (!text) {
toast(
"Nothing available to copy."
);

  return;
}

if (
  root.navigator &&
  root.navigator.clipboard &&
  isFunction(
    root.navigator.clipboard.writeText
  )
) {
  root.navigator.clipboard
    .writeText(text)
    .then(function copied() {
      toast(
        successMessage || "Copied."
      );
    })
    .catch(function clipboardRejected() {
      fallbackCopy(
        text,
        successMessage
      );
    });

  return;
}

fallbackCopy(
  text,
  successMessage
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

doc.body.appendChild(
  area
);

area.select();

try {
  doc.execCommand(
    "copy"
  );

  toast(
    successMessage || "Copied."
  );
} catch (_error) {
  toast(
    "Copy unavailable."
  );
}

doc.body.removeChild(
  area
);

}

function copyReadableReport() {
var engine =
resolveEngine();

var text = "";

if (
  engine &&
  isFunction(
    engine.getCurrentReport
  )
) {
  var currentReport =
    engine.getCurrentReport();

  if (currentReport) {
    text =
      safeJson(
        currentReport
      );
  }
}

if (!text) {
  text =
    fallbackReadableText();
}

copyText(
  text,
  "Readable report copied."
);

}

function copyPacketReport() {
var packetNode =
byId("packetOutput");

copyText(
  packetNode
    ? packetNode.textContent
    : "",
  "Report packet copied."
);

}

function copyRawReport() {
var rawNode =
byId("rawOutput");

copyText(
  rawNode
    ? rawNode.textContent
    : "",
  "Raw report copied."
);

}

function openSelector(buttonId, menuId) {
var button =
byId(buttonId);

var menu =
  byId(menuId);

if (!button || !menu) {
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

if (buttonId === "categorySelectorButton") {
  state.categoryMenuOpen =
    shouldOpen;
}

if (buttonId === "auditSelectorButton") {
  state.auditMenuOpen =
    shouldOpen;
}

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

state.categoryMenuOpen =
  false;

state.auditMenuOpen =
  false;

}

function selectCategory(categoryId) {
closeAllSelectors();

return invokeEngineMethod(
  "selectCategory",
  [categoryId],
  {
    fallback:
      function fallbackCategorySelection() {
        var option =
          doc.querySelector(
            '[data-category-id="' +
            cssEscape(categoryId) +
            '"]'
          );

        if (option) {
          setText(
            "categorySelectorLabel",
            option.querySelector("strong")
              ? option.querySelector("strong").textContent
              : categoryId
          );

          Array.prototype.slice.call(
            doc.querySelectorAll(
              "[data-category-id]"
            )
          ).forEach(function updateOption(node) {
            node.setAttribute(
              "aria-selected",
              node === option
                ? "true"
                : "false"
            );
          });
        }

        recordAction(
          "fallbackSelectCategory",
          {
            categoryId:
              categoryId
          }
        );

        return categoryId;
      }
  }
);

}

function selectAudit(auditId) {
closeAllSelectors();

return invokeEngineMethod(
  "selectAudit",
  [auditId],
  {
    fallback:
      function fallbackAuditSelection() {
        var option =
          doc.querySelector(
            '[data-audit-id="' +
            cssEscape(auditId) +
            '"]'
          );

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

          Array.prototype.slice.call(
            doc.querySelectorAll(
              "[data-audit-id]"
            )
          ).forEach(function updateOption(node) {
            node.setAttribute(
              "aria-selected",
              node === option
                ? "true"
                : "false"
            );
          });
        }

        recordAction(
          "fallbackSelectAudit",
          {
            auditId:
              auditId
          }
        );

        return auditId;
      }
  }
);

}

function selectParticipant(role) {
return invokeEngineMethod(
"selectParticipant",
[role],
{
fallback:
function fallbackParticipantSelection() {
var node =
doc.querySelector(
'[data-participant-role="' +
cssEscape(role) +
'"]'
);

        var detail =
          byId("participantDetail");

        if (detail) {
          detail.innerHTML =
            "<h3>" +
            escapeHtml(
              node &&
              node.querySelector("strong")
                ? node.querySelector("strong").textContent
                : role
            ) +
            "</h3>" +
            "<p>The control panel received the participant selection, but the diagnostic engine is unavailable to inspect the authority.</p>";
        }

        recordAction(
          "fallbackSelectParticipant",
          {
            role:
              role
          }
        );

        return role;
      }
  }
);

}

function selectReportModeLocal(mode) {
var modes = [
"read",
"packet",
"raw",
"evidence"
];

modes.forEach(function toggleMode(entry) {
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

invokeEngineMethod(
  "selectReportMode",
  [mode],
  {
    fallback:
      function noEngineReportMode() {
        recordAction(
          "fallbackSelectReportMode",
          {
            mode:
              mode
          }
        );

        return mode;
      }
  }
);

}

function selectObservationLensLocal(lens) {
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

Object.keys(map).forEach(function toggleLens(key) {
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

invokeEngineMethod(
  "selectObservationLens",
  [lens],
  {
    fallback:
      function noEngineObservationLens() {
        recordAction(
          "fallbackSelectObservationLens",
          {
            lens:
              lens
          }
        );

        return lens;
      }
  }
);

}

function selectInstrumentChamberLocal(chamber) {
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

Object.keys(map).forEach(function toggleChamber(key) {
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

invokeEngineMethod(
  "selectInstrumentChamber",
  [chamber],
  {
    fallback:
      function noEngineInstrumentChamber() {
        recordAction(
          "fallbackSelectInstrumentChamber",
          {
            chamber:
              chamber
          }
        );

        return chamber;
      }
  }
);

}

function setTargetVisible(visible) {
state.targetVisible =
Boolean(visible);

var button =
  byId("toggleObservationTarget");

if (button) {
  button.setAttribute(
    "aria-expanded",
    state.targetVisible
      ? "true"
      : "false"
  );

  button.textContent =
    state.targetVisible
      ? "Hide Target"
      : "Show Target";
}

selectObservationLensLocal(
  state.targetVisible
    ? "window"
    : "target"
);

var engine =
  resolveEngine();

if (
  engine &&
  isFunction(
    engine.selectObservationLens
  )
) {
  try {
    engine.selectObservationLens(
      state.targetVisible
        ? "window"
        : "target"
    );
  } catch (error) {
    recordError(
      "selectObservationLens",
      error
    );
  }
}

recordAction(
  "setTargetVisible",
  {
    visible:
      state.targetVisible
  }
);

}

function setTargetExpanded(expanded) {
state.targetExpanded =
Boolean(expanded);

var targetWindow =
  byId("targetWindow");

var button =
  byId("expandTargetWindow");

if (targetWindow) {
  targetWindow.classList.toggle(
    "is-expanded",
    state.targetExpanded
  );
}

if (button) {
  button.setAttribute(
    "aria-pressed",
    state.targetExpanded
      ? "true"
      : "false"
  );

  button.textContent =
    state.targetExpanded
      ? "Collapse"
      : "Expand";
}

recordAction(
  "setTargetExpanded",
  {
    expanded:
      state.targetExpanded
  }
);

}

function reloadTargetFrame() {
var frame =
byId(
"audraliaDiagnosticTargetFrame"
);

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
  "Target frame reloading."
);

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

function inspectControlIds() {
state.missingControls = [];
state.boundControls = [];

REQUIRED_CONTROL_IDS.forEach(function inspectControl(id) {
  if (byId(id)) {
    state.boundControls.push(id);
  } else {
    state.missingControls.push(id);
  }
});

}

function onClick(event) {
var target =
event.target.closest(
"button, a, [role='button']"
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
  root.location.reload();
  return;
}

if (id === "toggleObservationTarget") {
  event.preventDefault();

  setTargetVisible(
    !state.targetVisible
  );

  return;
}

if (id === "expandTargetWindow") {
  event.preventDefault();

  setTargetExpanded(
    !state.targetExpanded
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

  openSelector(
    "categorySelectorButton",
    "categorySelectorMenu"
  );

  return;
}

if (id === "auditSelectorButton") {
  event.preventDefault();

  openSelector(
    "auditSelectorButton",
    "auditSelectorMenu"
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
    "data-left-orbit-view"
  )
) {
  event.preventDefault();

  var view =
    target.getAttribute(
      "data-left-orbit-view"
    );

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
  ).forEach(function updateLeftOrbitButton(button) {
    button.setAttribute(
      "aria-selected",
      button === target
        ? "true"
        : "false"
    );
  });

  recordAction(
    "selectLeftOrbitView",
    {
      view:
        view
    }
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

function onKeydown(event) {
var target =
event.target.closest(
"[role='button'][data-participant-role]"
);

if (
  target &&
  (
    event.key === "Enter" ||
    event.key === " "
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

if (event.key === "Escape") {
  closeAllSelectors();

  if (state.targetExpanded) {
    setTargetExpanded(false);
  }
}

}

function onTargetFrameLoad() {
recordAction(
"targetFrameLoad"
);

var engine =
  resolveEngine();

if (
  engine &&
  isFunction(engine.observe)
) {
  try {
    var result =
      engine.observe();

    if (
      result &&
      isFunction(result.then)
    ) {
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
onClick
);

doc.addEventListener(
  "keydown",
  onKeydown
);

var frame =
  byId(
    "audraliaDiagnosticTargetFrame"
  );

if (frame) {
  frame.addEventListener(
    "load",
    onTargetFrameLoad
  );
}

}

function renderBindingState() {
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
    engine.CONTRACT ||
    ENGINE_CONTRACT
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
    "Independent controls bound; engine API available."
  );
} else {
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
    "Control panel active · Engine API unavailable"
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
    "Fallback report path available."
  );
}

if (state.missingControls.length) {
  setText(
    "dropDirectLastAction",
    "Missing controls: " +
    state.missingControls.join(", ")
  );

  setStatus(
    "dropDirectCell",
    "HELD"
  );
}

}

function publishReceipt() {
root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT = {
schema:
"AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT_v1",

  contract:
    CONTRACT,

  version:
    VERSION,

  file:
    FILE,

  expectedEngineContract:
    ENGINE_CONTRACT,

  htmlContract:
    HTML_CONTRACT,

  cssContract:
    CSS_CONTRACT,

  initialized:
    state.initialized,

  boundAt:
    state.boundAt,

  engineAvailable:
    state.engineAvailable,

  enginePath:
    state.enginePath,

  requiredControlCount:
    REQUIRED_CONTROL_IDS.length,

  boundControlCount:
    state.boundControls.length,

  missingControlCount:
    state.missingControls.length,

  missingControls:
    state.missingControls.slice(),

  actionCount:
    state.actionCount,

  lastAction:
    clone(
      state.lastAction
    ),

  lastError:
    clone(
      state.lastError
    ),

  fallbackReportAvailable:
    Boolean(
      state.fallbackReport
    ),

  createReportFallbackAvailable:
    true,

  eventDelegationActive:
    state.initialized,

  noClaims:
    NO_CLAIMS,

  generatedAt:
    nowIso()
};

}

function getPublicState() {
return clone({
contract:
CONTRACT,

  version:
    VERSION,

  file:
    FILE,

  initialized:
    state.initialized,

  boundAt:
    state.boundAt,

  engineAvailable:
    state.engineAvailable,

  enginePath:
    state.enginePath,

  missingControls:
    state.missingControls,

  boundControls:
    state.boundControls,

  actionCount:
    state.actionCount,

  lastAction:
    state.lastAction,

  lastError:
    state.lastError,

  fallbackReport:
    state.fallbackReport,

  categoryMenuOpen:
    state.categoryMenuOpen,

  auditMenuOpen:
    state.auditMenuOpen,

  targetVisible:
    state.targetVisible,

  targetExpanded:
    state.targetExpanded
});

}

function publishApi() {
var api = Object.freeze({
CONTRACT:
CONTRACT,

  VERSION:
    VERSION,

  FILE:
    FILE,

  ENGINE_CONTRACT:
    ENGINE_CONTRACT,

  HTML_CONTRACT:
    HTML_CONTRACT,

  CSS_CONTRACT:
    CSS_CONTRACT,

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

  closeAllSelectors:
    closeAllSelectors,

  getState:
    getPublicState,

  getFallbackReport:
    function getFallbackReport() {
      return clone(
        state.fallbackReport
      );
    },

  inspectControls:
    function inspectControls() {
      inspectControlIds();
      renderBindingState();
      publishReceipt();

      return getPublicState();
    },

  resolveEngine:
    function publicResolveEngine() {
      var engine =
        resolveEngine();

      publishReceipt();

      return engine;
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

function init() {
if (state.initialized) {
return;
}

state.initialized =
  true;

state.boundAt =
  nowIso();

inspectControlIds();
bindEvents();
publishApi();
renderBindingState();
publishReceipt();

toast(
  state.engineAvailable
    ? "Audralia control panel bound."
    : "Control panel bound; diagnostic engine held."
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
