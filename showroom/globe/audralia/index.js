// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2
// Full-file replacement.
// Diagnostic engine authority only.
// No DOM event ownership.
//
// CANONICAL AUTHORITY:
// - AUDRALIA_DIAGNOSTIC_OWNERSHIP_STANDARD_LOCK_v1
// - AUDRALIA_DIAGNOSTIC_ENGINE_STRUCTURAL_PREWRITE_ALIGNMENT_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_BLUEPRINT_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_PREBUILD_REGISTRY_v1
//
// PAIRED FAMILY:
// - HTML:
//   AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_OWNERSHIP_ALIGNED_STATIC_SHELL_TNT_v3
// - CSS:
//   AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_OWNERSHIP_ALIGNED_STYLE_TNT_v2
// - CONTROL PANEL:
//   AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v2
//
// ENGINE SOLE OWNERSHIP:
// - canonical diagnostic state;
// - category registry;
// - audit registry;
// - participant manifest;
// - participant discovery;
// - alias resolution;
// - target observation;
// - registry and engine inspection;
// - runtime inspection;
// - Surface Truth inspection;
// - synchronous report construction;
// - READ interpretation;
// - direct diagnostic execution;
// - nine-cycle execution;
// - conductor coordination;
// - receipt normalization;
// - cycle ledger construction;
// - diagnostic archive construction;
// - engine-owned data rendering;
// - public diagnostic API.
//
// ENGINE DOES NOT OWN:
// - addEventListener;
// - click handling;
// - keyboard handling;
// - dropdown behavior;
// - user-input tab behavior;
// - clipboard access;
// - page reload;
// - target-window visibility;
// - target-window expansion;
// - target-frame reload;
// - control binding audit;
// - control fallback report behavior;
// - production mutation;
// - runtime restart;
// - renderer mutation;
// - canvas repair;
// - controls repair;
// - route repair;
// - readiness claims;
// - visual-pass claims;
// - cycle-pass claims;
// - F21 authority claims.
//
// DROP:
// - Direct Execution
// - Report
// - Observation
// - Participant
//
// READ:
// - Result
// - Evidence
// - Absence
// - Direction
//
// NEWS ORDER:
// - North
// - East
// - West
// - South
// - Rail terminal synthesis
//
// FIBONACCI ORDER:
// 1. F1  NORTH_PROBE_INTAKE
// 2. F3  EAST_PROBE_SOURCE
// 3. F5  EAST_CONSTRUCTION_INTERPRETATION
// 4. F8  CANVAS_SURFACE_TRUTH
// 5. F13 WEST_PROBE_RUNTIME
// 6. F21 WEST_RUNTIME_INTERPRETATION
// 7. F34 SOUTH_PROBE_HANDOFF
// 8. F55 SOUTH_RESTITUTION_INTERPRETATION
// 9. F89 RAIL_TERMINAL_SYNTHESIS
//
// AUXILIARY:
// - SOUTH_SURFACE_POINTER
// - parent station: F55
// - parent position: 8
// - creates no tenth station.
//
// REPORT LAW:
// - report creation remains available while the engine is healthy;
// - report creation is synchronous;
// - report creation does not run direct execution;
// - report creation does not run the nine-cycle;
// - missing evidence belongs in READ Absence;
// - unavailable participants do not block report construction.
//
// PUBLICATION LAW:
// - the healthy API publishes only after initialization succeeds;
// - status READY means engine-internal API readiness only;
// - READY does not mean production ready;
// - READY does not mean visual pass;
// - READY does not mean cycle pass;
// - READY does not mean F21 passage.

(function installAudraliaDropWithReadDiagnosticEngine(global) {
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
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

var PREVIOUS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER_TNT_v1";

var VERSION =
"2.0.0";

var FILE =
"/showroom/globe/audralia/diagnostic/index.js";

var HTML_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_OWNERSHIP_ALIGNED_STATIC_SHELL_TNT_v3";

var CSS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_OWNERSHIP_ALIGNED_STYLE_TNT_v2";

var CONTROL_PANEL_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v2";

var TARGET_ROUTE =
"/showroom/globe/audralia/";

var TARGET_FRAME_ID =
"audraliaDiagnosticTargetFrame";

var REPORT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_v2";

var PACKET_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_PACKET_v2";

var OBSERVATION_SCHEMA =
"AUDRALIA_DROP_WITH_READ_OBSERVATION_v2";

var PARTICIPANT_INPUT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_PARTICIPANT_INPUT_v2";

var RECEIPT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_RECEIPT_v2";

var LEDGER_SCHEMA =
"AUDRALIA_DROP_WITH_READ_NINE_CYCLE_LEDGER_v2";

var ARCHIVE_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ARCHIVE_v2";

var ENGINE_RECEIPT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT_v2";

var VALID_STATUSES =
Object.freeze([
"READY",
"AVAILABLE",
"ACTIVE",
"FOUND",
"COMPLETE",
"HELD",
"MISSING",
"ERROR",
"UNKNOWN",
"NOT_RUN",
"RUNNING",
"IDLE",
"EMPTY",
"LOADING",
"OBSERVING"
]);

var NO_CLAIMS =
deepFreeze({
productionMutationAuthorized: false,
runtimeRestartAuthorized: false,
rendererMutationAuthorized: false,
canvasRepairAuthorized: false,
canvasBuildAuthorized: false,
canvasReleaseAuthorized: false,
controlsRepairAuthorized: false,
routeRepairAuthorized: false,
repairAuthorized: false,
syntheticEvidenceAuthorized: false,
readyClaimed: false,
visualPassClaimed: false,
cyclePassClaimed: false,
f21Claimed: false
});

var CATEGORY_REGISTRY =
deepFreeze([
{
id: "observatoryReceiver",
label: "Observatory / Receiver",
summary:
"Shell, engine, control panel, target access, and diagnostic receiver state."
},
{
id: "registryEngine",
label: "Registry / Engine",
summary:
"Governing authority, runtime engine, registry, and assigned engine slots."
},
{
id: "sourceSurface",
label: "Source / Surface",
summary:
"Target runtime, canvas, geometry, frame state, and F8 Surface Truth."
},
{
id: "cardinalStations",
label: "Cardinal Stations",
summary:
"North, East, West, South, Rail, and auxiliary participant availability."
},
{
id: "nineCycle",
label: "Nine-Cycle Diagnostics",
summary:
"Registration, preflight, cycle execution, ledger, and station receipts."
},
{
id: "directExecution",
label: "Direct Execution",
summary:
"Explicit invocation of one verified diagnostic authority."
},
{
id: "boundaryArchive",
label: "Boundary / Archive",
summary:
"No-touch laws, reports, receipts, errors, and diagnostic archive."
}
]);

var AUDIT_REGISTRY =
deepFreeze([
{
id: "observatoryIndex",
categoryId: "observatoryReceiver",
sequence: "AUDIT 01",
classification: "SAFE_REPORT",
title: "Observatory Index",
summary:
"Summarize the diagnostic shell, engine, control panel, participant availability, observation state, and current cycle evidence.",
directParticipant: null
},
{
id: "receiverContract",
categoryId: "observatoryReceiver",
sequence: "AUDIT 02",
classification: "SAFE_REPORT",
title: "Receiver Contract",
summary:
"Inspect route metadata, paired-file contracts, declared load order, and receiver boundaries.",
directParticipant: null
},
{
id: "controlSeparation",
categoryId: "observatoryReceiver",
sequence: "AUDIT 03",
classification: "SAFE_REPORT",
title: "Control Separation",
summary:
"Inspect engine/control ownership separation without binding or executing controls.",
directParticipant: null
},
{
id: "targetAccess",
categoryId: "observatoryReceiver",
sequence: "AUDIT 04",
classification: "SAFE_REPORT",
title: "Target Access",
summary:
"Inspect the target frame, same-origin accessibility, route match, and document state.",
directParticipant: null
},
{
id: "scriptOrder",
categoryId: "observatoryReceiver",
sequence: "AUDIT 05",
classification: "SAFE_REPORT",
title: "Script Order",
summary:
"Inspect the declared engine-family, participant-family, diagnostic-engine, and control-panel order.",
directParticipant: null
},
{
id: "engineAvailability",
categoryId: "observatoryReceiver",
sequence: "AUDIT 06",
classification: "SAFE_REPORT",
title: "Engine Availability",
summary:
"Inspect whether the diagnostic engine completed initialization and published a healthy API.",
directParticipant: null
},
{
id: "reportAvailability",
categoryId: "observatoryReceiver",
sequence: "AUDIT 07",
classification: "SAFE_REPORT",
title: "Report Availability",
summary:
"Confirm report construction remains independent from direct execution and nine-cycle execution.",
directParticipant: null
},
{
id: "governingContract",
categoryId: "registryEngine",
sequence: "AUDIT 08",
classification: "SAFE_REPORT",
title: "Governing Contract",
summary:
"Inspect the DGB governing engine contract and associated runtime authority.",
directParticipant: null
},
{
id: "engineRegistry",
categoryId: "registryEngine",
sequence: "AUDIT 09",
classification: "SAFE_REPORT",
title: "Engine Registry",
summary:
"Inspect engine subjects, authority records, selected engine, and reserved slots.",
directParticipant: null
},
{
id: "runtimeSurface",
categoryId: "sourceSurface",
sequence: "AUDIT 10",
classification: "SAFE_REPORT",
title: "Runtime Surface",
summary:
"Inspect runtime globals, mount state, stage geometry, first frame, and visible-pixel evidence.",
directParticipant: "WEST_PROBE_RUNTIME"
},
{
id: "surfaceTruth",
categoryId: "sourceSurface",
sequence: "AUDIT 11",
classification: "DIRECT_AVAILABLE",
title: "Canvas Surface Truth",
summary:
"Inspect F8 Surface Truth availability and permit explicit direct execution.",
directParticipant: "CANVAS_SURFACE_TRUTH"
},
{
id: "participantConstellation",
categoryId: "cardinalStations",
sequence: "AUDIT 12",
classification: "SAFE_REPORT",
title: "Participant Constellation",
summary:
"Inspect required and optional cardinal diagnostic participants and aliases.",
directParticipant: null
},
{
id: "northIntake",
categoryId: "cardinalStations",
sequence: "AUDIT 13",
classification: "DIRECT_AVAILABLE",
title: "North Intake",
summary:
"Inspect and explicitly invoke the F1 North intake station.",
directParticipant: "NORTH_PROBE_INTAKE"
},
{
id: "eastSource",
categoryId: "cardinalStations",
sequence: "AUDIT 14",
classification: "DIRECT_AVAILABLE",
title: "East Source",
summary:
"Inspect and explicitly invoke the F3 East source station.",
directParticipant: "EAST_PROBE_SOURCE"
},
{
id: "eastConstruction",
categoryId: "cardinalStations",
sequence: "AUDIT 15",
classification: "DIRECT_AVAILABLE",
title: "East Construction",
summary:
"Inspect and explicitly invoke the F5 East construction interpretation station.",
directParticipant: "EAST_CONSTRUCTION_INTERPRETATION"
},
{
id: "westRuntime",
categoryId: "cardinalStations",
sequence: "AUDIT 16",
classification: "DIRECT_AVAILABLE",
title: "West Runtime",
summary:
"Inspect and explicitly invoke the F13 West runtime probe.",
directParticipant: "WEST_PROBE_RUNTIME"
},
{
id: "westInterpretation",
categoryId: "cardinalStations",
sequence: "AUDIT 17",
classification: "DIRECT_AVAILABLE",
title: "West Interpretation",
summary:
"Inspect and explicitly invoke the F21 runtime interpretation station without claiming F21 passage.",
directParticipant: "WEST_RUNTIME_INTERPRETATION"
},
{
id: "southHandoff",
categoryId: "cardinalStations",
sequence: "AUDIT 18",
classification: "DIRECT_AVAILABLE",
title: "South Handoff",
summary:
"Inspect and explicitly invoke the F34 South handoff station.",
directParticipant: "SOUTH_PROBE_HANDOFF"
},
{
id: "southRestitution",
categoryId: "cardinalStations",
sequence: "AUDIT 19",
classification: "DIRECT_AVAILABLE",
title: "South Restitution",
summary:
"Inspect and explicitly invoke the F55 restitution interpretation station.",
directParticipant: "SOUTH_RESTITUTION_INTERPRETATION"
},
{
id: "railSynthesis",
categoryId: "cardinalStations",
sequence: "AUDIT 20",
classification: "DIRECT_AVAILABLE",
title: "Rail Synthesis",
summary:
"Inspect and explicitly invoke the F89 terminal synthesis station.",
directParticipant: "RAIL_TERMINAL_SYNTHESIS"
},
{
id: "cyclePreview",
categoryId: "nineCycle",
sequence: "AUDIT 21",
classification: "SAFE_REPORT",
title: "Nine-Cycle Preview",
summary:
"Inspect the nine stations and conductor without executing the cycle.",
directParticipant: null
},
{
id: "cycleExecution",
categoryId: "nineCycle",
sequence: "AUDIT 22",
classification: "NINE_CYCLE_AVAILABLE",
title: "Nine-Cycle Execution",
summary:
"Permit one explicit nine-station diagnostic cycle.",
directParticipant: null
},
{
id: "directSelected",
categoryId: "directExecution",
sequence: "AUDIT 23",
classification: "DIRECT_AVAILABLE",
title: "Selected Direct Check",
summary:
"Execute the selected audit participant only when a verified callable authority exists.",
directParticipant: null
},
{
id: "boundaryManifest",
categoryId: "boundaryArchive",
sequence: "AUDIT 24",
classification: "SAFE_REPORT",
title: "Boundary Manifest",
summary:
"Inspect permanent no-touch declarations and forbidden claims.",
directParticipant: null
},
{
id: "diagnosticArchive",
categoryId: "boundaryArchive",
sequence: "AUDIT 25",
classification: "SAFE_REPORT",
title: "Diagnostic Archive",
summary:
"Inspect reports, receipts, errors, participant snapshots, and observation snapshots.",
directParticipant: null
}
]);

var PARTICIPANT_MANIFEST =
deepFreeze([
participant({
role: "NORTH_CONDUCTOR",
label: "North Conductor",
path: "/assets/audralia/audralia.diagnostic.north.conductor.js",
required: true,
direction: "NORTH",
cyclePosition: null,
fibonacci: null,
aliases: [
"AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",
"AUDRALIA.diagnosticNorthConductor",
"AUDRALIA.northConductor"
],
methods: [
"registerStation",
"register",
"runNineCycle",
"run",
"execute"
]
}),
participant({
role: "NORTH_PROBE_INTAKE",
label: "F1 · North Intake",
path: "/assets/audralia/audralia.diagnostic.probe.north.js",
required: true,
direction: "NORTH",
cyclePosition: 1,
fibonacci: "F1",
aliases: [
"AUDRALIA_DIAGNOSTIC_PROBE_NORTH",
"AUDRALIA_DIAGNOSTIC_NORTH_PROBE",
"AUDRALIA.diagnosticProbeNorth"
],
methods: [
"inspect",
"probe",
"run",
"execute"
]
}),
participant({
role: "EAST_PROBE_SOURCE",
label: "F3 · East Source",
path: "/assets/audralia/audralia.diagnostic.probe.east.js",
required: true,
direction: "EAST",
cyclePosition: 2,
fibonacci: "F3",
aliases: [
"AUDRALIA_DIAGNOSTIC_PROBE_EAST",
"AUDRALIA_DIAGNOSTIC_EAST_PROBE",
"AUDRALIA.diagnosticProbeEast"
],
methods: [
"inspect",
"probe",
"run",
"execute"
]
}),
participant({
role: "EAST_CONSTRUCTION_INTERPRETATION",
label: "F5 · East Construction",
path: "/assets/audralia/audralia.diagnostic.east.js",
required: true,
direction: "EAST",
cyclePosition: 3,
fibonacci: "F5",
aliases: [
"AUDRALIA_DIAGNOSTIC_EAST",
"AUDRALIA_DIAGNOSTIC_EAST_INTERPRETATION",
"AUDRALIA.diagnosticEast"
],
methods: [
"interpret",
"inspect",
"run",
"execute"
]
}),
participant({
role: "CANVAS_SURFACE_TRUTH",
label: "F8 · 3D Surface Truth",
path: "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js",
required: true,
direction: "CENTER",
cyclePosition: 4,
fibonacci: "F8",
aliases: [
"AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH",
"AUDRALIA_CANVAS_SURFACE_TRUTH",
"AUDRALIA.diagnosticCanvasSurfaceTruth"
],
methods: [
"inspect",
"probe",
"run",
"execute"
]
}),
participant({
role: "WEST_PROBE_RUNTIME",
label: "F13 · West Runtime",
path: "/assets/audralia/audralia.diagnostic.probe.west.js",
required: true,
direction: "WEST",
cyclePosition: 5,
fibonacci: "F13",
aliases: [
"AUDRALIA_DIAGNOSTIC_PROBE_WEST",
"AUDRALIA_DIAGNOSTIC_WEST_PROBE",
"AUDRALIA.diagnosticProbeWest"
],
methods: [
"inspect",
"probe",
"run",
"execute"
]
}),
participant({
role: "WEST_RUNTIME_INTERPRETATION",
label: "F21 · West Interpretation",
path: "/assets/audralia/audralia.diagnostic.west.js",
required: true,
direction: "WEST",
cyclePosition: 6,
fibonacci: "F21",
aliases: [
"AUDRALIA_DIAGNOSTIC_WEST",
"AUDRALIA_DIAGNOSTIC_WEST_INTERPRETATION",
"AUDRALIA.diagnosticWest"
],
methods: [
"interpret",
"inspect",
"run",
"execute"
]
}),
participant({
role: "SOUTH_PROBE_HANDOFF",
label: "F34 · South Handoff",
path: "/assets/audralia/audralia.diagnostic.probe.south.js",
required: true,
direction: "SOUTH",
cyclePosition: 7,
fibonacci: "F34",
aliases: [
"AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
"AUDRALIA_DIAGNOSTIC_SOUTH_PROBE",
"AUDRALIA.diagnosticProbeSouth"
],
methods: [
"inspect",
"probe",
"run",
"execute"
]
}),
participant({
role: "SOUTH_RESTITUTION_INTERPRETATION",
label: "F55 · South Restitution",
path: "/assets/audralia/audralia.diagnostic.south.js",
required: true,
direction: "SOUTH",
cyclePosition: 8,
fibonacci: "F55",
aliases: [
"AUDRALIA_DIAGNOSTIC_SOUTH",
"AUDRALIA_DIAGNOSTIC_SOUTH_INTERPRETATION",
"AUDRALIA.diagnosticSouth"
],
methods: [
"interpret",
"inspect",
"run",
"execute"
]
}),
participant({
role: "SOUTH_SURFACE_POINTER",
label: "South Surface Pointer",
path: "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
required: false,
direction: "SOUTH",
cyclePosition: null,
parentCyclePosition: 8,
fibonacci: null,
parentFibonacci: "F55",
auxiliary: true,
aliases: [
"AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
"AUDRALIA_SOUTH_SURFACE_POINTER",
"AUDRALIA.diagnosticSouthSurfacePointer"
],
methods: [
"inspect",
"point",
"run",
"execute"
]
}),
participant({
role: "RAIL_TERMINAL_SYNTHESIS",
label: "F89 · Rail Synthesis",
path: "/assets/audralia/audralia.diagnostic.rail.js",
required: true,
direction: "TERMINAL_RAIL",
cyclePosition: 9,
fibonacci: "F89",
aliases: [
"AUDRALIA_DIAGNOSTIC_RAIL",
"AUDRALIA_DIAGNOSTIC_TERMINAL_RAIL",
"AUDRALIA.diagnosticRail"
],
methods: [
"synthesize",
"inspect",
"run",
"execute"
]
})
]);

var STATION_ORDER =
deepFreeze(
PARTICIPANT_MANIFEST
.filter(function onlyStations(entry) {
return (
typeof entry.cyclePosition === "number"
);
})
.sort(function stationSort(a, b) {
return (
a.cyclePosition -
b.cyclePosition
);
})
);

var state = {
initialized: false,
initializedAt: null,
status: "LOADING",

selection: {
  categoryId: "observatoryReceiver",
  auditId: "observatoryIndex",
  participantRole: null,
  reportMode: "read",
  observationLens: "target",
  instrumentChamber: "cycle"
},

participants: [],
observation: null,

report: {
  current: null,
  history: []
},

direct: {
  running: false,
  count: 0,
  lastResult: null,
  lastError: null
},

cycle: {
  running: false,
  count: 0,
  lastRunAt: null,
  receipts: [],
  ledger: null,
  lastError: null
},

receipts: [],

archive: {
  reports: [],
  errors: [],
  sessions: [],
  deepArchive: null
},

errors: [],
actionCount: 0,
lastAction: null

};

function participant(config) {
return {
role: config.role,
label: config.label,
path: config.path,
required: Boolean(config.required),
auxiliary: Boolean(config.auxiliary),
direction: config.direction || "UNKNOWN",
cyclePosition:
typeof config.cyclePosition === "number"
? config.cyclePosition
: null,
fibonacci:
config.fibonacci || null,
parentCyclePosition:
typeof config.parentCyclePosition === "number"
? config.parentCyclePosition
: null,
parentFibonacci:
config.parentFibonacci || null,
aliases:
Array.isArray(config.aliases)
? config.aliases.slice()
: [],
methods:
Array.isArray(config.methods)
? config.methods.slice()
: []
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

Object.keys(value)
  .forEach(function cloneProperty(key) {
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
  Object.getOwnPropertyNames(value)
    .forEach(function freezeProperty(key) {
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

function normalizeStatus(value) {
var status =
String(value || "UNKNOWN")
.trim()
.toUpperCase();

return VALID_STATUSES.indexOf(status) !== -1
  ? status
  : "UNKNOWN";

}

function firstDefined(values) {
var index;

for (
  index = 0;
  index < values.length;
  index += 1
) {
  if (
    values[index] !== null &&
    values[index] !== undefined
  ) {
    return values[index];
  }
}

return null;

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
  normalizeStatus(status)
);

}

function readPath(path, base) {
var parts =
String(path || "")
.split(".")
.filter(Boolean);

var cursor =
  base || root;

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

function recordAction(action, detail) {
state.actionCount += 1;

state.lastAction = {
  action: action,
  detail: clone(detail || null),
  actionNumber: state.actionCount,
  occurredAt: nowIso()
};

publishEngineReceipt();

return frozenClone(
  state.lastAction
);

}

function recordError(action, error, detail) {
var entry = {
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
occurredAt:
nowIso()
};

state.errors.push(entry);
state.archive.errors.push(entry);

publishEngineReceipt();
renderArchive();

return frozenClone(entry);

}

function getCategory(categoryId) {
return CATEGORY_REGISTRY
.filter(function categoryMatch(entry) {
return entry.id === categoryId;
})[0] || null;
}

function getAudit(auditId) {
return AUDIT_REGISTRY
.filter(function auditMatch(entry) {
return entry.id === auditId;
})[0] || null;
}

function getParticipantManifestEntry(role) {
return PARTICIPANT_MANIFEST
.filter(function participantMatch(entry) {
return entry.role === role;
})[0] || null;
}

function resolveParticipantObject(manifest) {
var aliases =
manifest.aliases || [];

var index;
var candidate;

for (
  index = 0;
  index < aliases.length;
  index += 1
) {
  candidate =
    readPath(
      aliases[index]
    );

  if (
    candidate !== null &&
    candidate !== undefined
  ) {
    return {
      alias:
        aliases[index],
      value:
        candidate
    };
  }
}

return {
  alias: null,
  value: null
};

}

function identifyCallableMethod(manifest, value) {
var methods =
manifest.methods || [];

var index;

if (isFunction(value)) {
  return {
    method:
      "[[callable]]",
    callable:
      value
  };
}

if (
  !value ||
  typeof value !== "object"
) {
  return {
    method: null,
    callable: null
  };
}

for (
  index = 0;
  index < methods.length;
  index += 1
) {
  if (
    isFunction(
      value[methods[index]]
    )
  ) {
    return {
      method:
        methods[index],
      callable:
        value[methods[index]]
    };
  }
}

return {
  method: null,
  callable: null
};

}

function inspectParticipant(manifest) {
var resolution =
resolveParticipantObject(manifest);

var value =
  resolution.value;

var callable =
  identifyCallableMethod(
    manifest,
    value
  );

var contract =
  firstDefined([
    value && value.CONTRACT,
    value && value.contract,
    value &&
      value.receipt &&
      value.receipt.contract,
    value &&
      value.RECEIPT &&
      value.RECEIPT.contract
  ]);

var version =
  firstDefined([
    value && value.VERSION,
    value && value.version,
    value &&
      value.receipt &&
      value.receipt.version,
    value &&
      value.RECEIPT &&
      value.RECEIPT.version
  ]);

var available =
  value !== null &&
  value !== undefined;

return deepFreeze({
  role:
    manifest.role,
  label:
    manifest.label,
  path:
    manifest.path,
  required:
    manifest.required,
  auxiliary:
    manifest.auxiliary,
  direction:
    manifest.direction,
  cyclePosition:
    manifest.cyclePosition,
  fibonacci:
    manifest.fibonacci,
  parentCyclePosition:
    manifest.parentCyclePosition,
  parentFibonacci:
    manifest.parentFibonacci,
  aliases:
    manifest.aliases.slice(),
  resolvedAlias:
    resolution.alias,
  available:
    available,
  callable:
    Boolean(
      callable.callable
    ),
  callableMethod:
    callable.method,
  contract:
    contract || null,
  version:
    version || null,
  status:
    available
      ? callable.callable
        ? "AVAILABLE"
        : "HELD"
      : manifest.required
        ? "MISSING"
        : "UNKNOWN",
  observedAt:
    nowIso()
});

}

function inspectParticipants() {
state.participants =
PARTICIPANT_MANIFEST
.map(
inspectParticipant
);

renderParticipants();
renderDropParticipantState();

addReceipt({
  type:
    "participant",
  source:
    "PARTICIPANT_MANIFEST",
  title:
    "Participant constellation inspection",
  status:
    state.participants
      .some(function requiredMissing(entry) {
        return (
          entry.required &&
          !entry.available
        );
      })
      ? "HELD"
      : "COMPLETE",
  payload:
    state.participants
});

return frozenClone(
  state.participants
);

}

function findParticipantState(role) {
return state.participants
.filter(function stateMatch(entry) {
return entry.role === role;
})[0] || null;
}

function inspectTargetFrame() {
var frame =
byId(TARGET_FRAME_ID);

var result = {
  framePresent:
    Boolean(frame),
  sameOrigin:
    false,
  documentState:
    "UNKNOWN",
  routeMatch:
    false,
  path:
    TARGET_ROUTE,
  title:
    null,
  accessError:
    null,
  frameRect:
    null
};

if (!frame) {
  result.accessError =
    "TARGET_FRAME_NOT_FOUND";

  return result;
}

try {
  var rect =
    frame.getBoundingClientRect();

  result.frameRect = {
    width:
      rect.width,
    height:
      rect.height,
    top:
      rect.top,
    left:
      rect.left
  };
} catch (_error) {}

try {
  var frameWindow =
    frame.contentWindow;

  var frameDocument =
    frame.contentDocument ||
    (
      frameWindow &&
      frameWindow.document
    );

  result.sameOrigin =
    Boolean(frameDocument);

  if (frameDocument) {
    result.documentState =
      frameDocument.readyState ||
      "UNKNOWN";

    result.title =
      frameDocument.title ||
      "";

    var pathname =
      frameWindow &&
      frameWindow.location
        ? frameWindow.location.pathname
        : null;

    result.path =
      pathname ||
      TARGET_ROUTE;

    result.routeMatch =
      pathname === TARGET_ROUTE ||
      pathname ===
        TARGET_ROUTE.replace(
          /\/$/,
          ""
        );
  }
} catch (error) {
  result.accessError =
    String(
      error &&
      error.message
        ? error.message
        : error
    );
}

return result;

}

function inspectRuntime(targetWindow) {
var runtimeAliases = [
"AUDRALIA_RUNTIME",
"AUDRALIA.runtime",
"AUDRALIA_ENGINE",
"AUDRALIA.engine",
"AUDRALIA_CANVAS",
"AUDRALIA.canvas"
];

var runtime =
  null;

var runtimeAlias =
  null;

var index;

for (
  index = 0;
  index < runtimeAliases.length;
  index += 1
) {
  runtime =
    readPath(
      runtimeAliases[index],
      targetWindow || root
    );

  if (runtime) {
    runtimeAlias =
      runtimeAliases[index];

    break;
  }
}

var mount =
  null;

var mountSelector =
  null;

var mountSelectors = [
  "#audraliaCanvasMount",
  "#audraliaMount",
  "#globeMount",
  "canvas"
];

var targetDocument =
  targetWindow &&
  targetWindow.document
    ? targetWindow.document
    : null;

if (targetDocument) {
  for (
    index = 0;
    index < mountSelectors.length;
    index += 1
  ) {
    mount =
      targetDocument.querySelector(
        mountSelectors[index]
      );

    if (mount) {
      mountSelector =
        mountSelectors[index];

      break;
    }
  }
}

var rect =
  null;

var visiblePixel =
  null;

if (mount) {
  try {
    var mountRect =
      mount.getBoundingClientRect();

    rect = {
      width:
        mountRect.width,
      height:
        mountRect.height,
      top:
        mountRect.top,
      left:
        mountRect.left,
      nonzero:
        mountRect.width > 0 &&
        mountRect.height > 0
    };
  } catch (_error) {}

  if (
    String(
      mount.tagName || ""
    ).toUpperCase() === "CANVAS"
  ) {
    try {
      var context =
        mount.getContext &&
        mount.getContext("2d");

      if (
        context &&
        mount.width > 0 &&
        mount.height > 0
      ) {
        var pixel =
          context
            .getImageData(
              Math.floor(
                mount.width / 2
              ),
              Math.floor(
                mount.height / 2
              ),
              1,
              1
            )
            .data;

        visiblePixel =
          pixel[3] > 0;
      }
    } catch (_error) {
      visiblePixel =
        null;
    }
  }
}

return {
  runtimeAlias:
    runtimeAlias,
  runtimeFound:
    Boolean(runtime),
  runtimeContract:
    runtime &&
    (
      runtime.CONTRACT ||
      runtime.contract
    )
      ? runtime.CONTRACT ||
        runtime.contract
      : null,
  runtimeMounted:
    runtime
      ? firstDefined([
          runtime.mounted,
          runtime.isMounted,
          runtime.status === "MOUNTED"
            ? true
            : null
        ])
      : null,
  mountFound:
    Boolean(mount),
  mountSelector:
    mountSelector,
  mountTag:
    mount
      ? mount.tagName
      : null,
  geometry:
    rect,
  stageRectNonzero:
    rect
      ? rect.nonzero
      : null,
  firstFrame:
    firstDefined([
      runtime &&
        runtime.firstFrame,
      runtime &&
        runtime.firstFrameRendered,
      runtime &&
        runtime.frameReady
    ]),
  visiblePixel:
    visiblePixel,
  fallback:
    firstDefined([
      runtime &&
        runtime.fallback,
      runtime &&
        runtime.fallbackActive
    ]),
  receiptAvailability:
    Boolean(
      runtime &&
      (
        runtime.RECEIPT ||
        runtime.receipt ||
        runtime.getReceipt
      )
    )
};

}

function inspectEngineFamily(targetWindow) {
var source =
targetWindow || root;

var governing =
  readPath(
    "DGB_ENGINE_CONTRACT",
    source
  ) ||
  readPath(
    "DGB.engineContract",
    source
  );

var runtime =
  readPath(
    "DGB_ENGINE",
    source
  ) ||
  readPath(
    "DGB.engine",
    source
  );

var registry =
  readPath(
    "DGB_ENGINE_SUBJECTS",
    source
  ) ||
  readPath(
    "DGB.engineSubjects",
    source
  ) ||
  readPath(
    "DGB_ENGINE_REGISTRY",
    source
  );

return {
  governingContractFound:
    Boolean(governing),
  governingContract:
    governing &&
    (
      governing.CONTRACT ||
      governing.contract
    )
      ? governing.CONTRACT ||
        governing.contract
      : null,
  runtimeEngineFound:
    Boolean(runtime),
  runtimeEngineContract:
    runtime &&
    (
      runtime.CONTRACT ||
      runtime.contract
    )
      ? runtime.CONTRACT ||
        runtime.contract
      : null,
  registryFound:
    Boolean(registry),
  registryContract:
    registry &&
    (
      registry.CONTRACT ||
      registry.contract
    )
      ? registry.CONTRACT ||
        registry.contract
      : null,
  registrySnapshot:
    snapshotRegistry(
      registry
    )
};

}

function snapshotRegistry(registry) {
if (!registry) {
return {
governingContracts: [],
assignedEngines: [],
selectableEngines: [],
reservedSlots: []
};
}

return {
  governingContracts:
    normalizeCollection(
      firstDefined([
        registry.governingContracts,
        registry.contracts,
        registry.authorities
      ])
    ),
  assignedEngines:
    normalizeCollection(
      firstDefined([
        registry.assignedEngines,
        registry.assigned,
        registry.subjects
      ])
    ),
  selectableEngines:
    normalizeCollection(
      firstDefined([
        registry.selectableEngines,
        registry.selectable,
        registry.options
      ])
    ),
  reservedSlots:
    normalizeCollection(
      firstDefined([
        registry.reservedSlots,
        registry.reserved,
        registry.slots
      ])
    )
};

}

function normalizeCollection(value) {
if (Array.isArray(value)) {
return value.map(function mapCollection(entry) {
return clone(entry);
});
}

if (isObject(value)) {
  return Object.keys(value)
    .map(function mapObjectEntry(key) {
      return {
        key:
          key,
        value:
          clone(
            value[key]
          )
      };
    });
}

return [];

}

function inspectSurfaceTruth() {
var participantState =
findParticipantState(
"CANVAS_SURFACE_TRUTH"
);

var value =
  participantState &&
  participantState.resolvedAlias
    ? readPath(
        participantState.resolvedAlias
      )
    : null;

var receipt =
  firstDefined([
    value &&
      value.RECEIPT,
    value &&
      value.receipt,
    value &&
      isFunction(value.getReceipt)
      ? safeInvoke(
          value.getReceipt,
          value,
          []
        )
      : null
  ]);

var packet =
  firstDefined([
    value &&
      value.PACKET,
    value &&
      value.packet,
    value &&
      isFunction(value.getPacket)
      ? safeInvoke(
          value.getPacket,
          value,
          []
        )
      : null
  ]);

return {
  authorityFound:
    Boolean(value),
  authorityAlias:
    participantState
      ? participantState.resolvedAlias
      : null,
  method:
    participantState
      ? participantState.callableMethod
      : null,
  contract:
    participantState
      ? participantState.contract
      : null,
  receiptFound:
    Boolean(receipt),
  receipt:
    clone(receipt),
  packetKeys:
    isObject(packet)
      ? Object.keys(packet)
      : [],
  firstHeld:
    findFirstByStatus(
      packet,
      "HELD"
    ),
  firstFailed:
    findFirstByStatus(
      packet,
      "ERROR"
    ) ||
    findFirstByStatus(
      packet,
      "FAILED"
    ) ||
    findFirstByStatus(
      packet,
      "FAIL"
    ),
  recommendedOwner:
    firstDefined([
      packet &&
        packet.recommendedOwner,
      packet &&
        packet.owner,
      receipt &&
        receipt.recommendedOwner
    ]),
  recommendedFile:
    firstDefined([
      packet &&
        packet.recommendedFile,
      packet &&
        packet.file,
      receipt &&
        receipt.recommendedFile
    ]),
  recommendedAction:
    firstDefined([
      packet &&
        packet.recommendedAction,
      packet &&
        packet.action,
      receipt &&
        receipt.recommendedAction
    ]),
  error:
    null
};

}

function findFirstByStatus(value, status) {
var target =
String(status || "")
.trim()
.toUpperCase();

var seen = [];

function walk(node, path) {
  var keys;
  var index;
  var found;

  if (
    node === null ||
    node === undefined ||
    typeof node !== "object"
  ) {
    return null;
  }

  if (seen.indexOf(node) !== -1) {
    return null;
  }

  seen.push(node);

  if (
    typeof node.status === "string" &&
    node.status
      .trim()
      .toUpperCase() === target
  ) {
    return {
      path:
        path,
      value:
        clone(node)
    };
  }

  keys =
    Object.keys(node);

  for (
    index = 0;
    index < keys.length;
    index += 1
  ) {
    found =
      walk(
        node[keys[index]],
        path
          ? path + "." + keys[index]
          : keys[index]
      );

    if (found) {
      return found;
    }
  }

  return null;
}

return walk(
  value,
  ""
);

}

function safeInvoke(fn, context, args) {
try {
return fn.apply(
context,
args || []
);
} catch (error) {
return {
error:
String(
error &&
error.message
? error.message
: error
)
};
}
}

function observe() {
if (!state.initialized && state.status !== "LOADING") {
throw new Error(
"DIAGNOSTIC_ENGINE_NOT_INITIALIZED"
);
}

var target =
  inspectTargetFrame();

var targetWindow =
  null;

if (target.framePresent) {
  try {
    targetWindow =
      byId(TARGET_FRAME_ID)
        .contentWindow;
  } catch (_error) {}
}

var runtime =
  inspectRuntime(
    targetWindow
  );

var engineFamily =
  inspectEngineFamily(
    targetWindow
  );

var surface =
  inspectSurfaceTruth();

state.observation =
  deepFreeze({
    schema:
      OBSERVATION_SCHEMA,
    observedAt:
      nowIso(),
    target:
      target,
    runtime:
      runtime,
    engineFamily:
      engineFamily,
    surface:
      surface,
    noClaims:
      NO_CLAIMS
  });

addReceipt({
  type:
    "observation",
  source:
    "DROP_OBSERVATION",
  title:
    "Audralia target observation",
  status:
    target.framePresent
      ? "COMPLETE"
      : "HELD",
  payload:
    state.observation
});

renderObservation();
renderRegistry();
renderEvidenceRail();
renderDropObservationState();

recordAction(
  "observe",
  {
    framePresent:
      target.framePresent,
    sameOrigin:
      target.sameOrigin
  }
);

return frozenClone(
  state.observation
);

}

function createReport() {
if (!state.initialized) {
throw new Error(
"DIAGNOSTIC_ENGINE_NOT_INITIALIZED"
);
}

inspectParticipants();
observe();

var audit =
  getAudit(
    state.selection.auditId
  ) ||
  AUDIT_REGISTRY[0];

var category =
  getCategory(
    audit.categoryId
  ) ||
  CATEGORY_REGISTRY[0];

var interpretation =
  interpretRead(
    audit,
    category
  );

var report = {
  schema:
    REPORT_SCHEMA,
  reportId:
    "AUDRALIA_REPORT_" +
    Date.now(),
  createdAt:
    nowIso(),
  category:
    clone(category),
  audit:
    clone(audit),
  read:
    interpretation,
  participantSnapshot:
    frozenClone(
      state.participants
    ),
  observationSnapshot:
    frozenClone(
      state.observation
    ),
  directSnapshot:
    frozenClone(
      state.direct
    ),
  cycleSnapshot:
    frozenClone(
      state.cycle
    ),
  boundary:
    NO_CLAIMS
};

state.report.current =
  deepFreeze(report);

state.report.history.push(
  state.report.current
);

addReceipt({
  type:
    "report",
  source:
    "DROP_REPORT",
  title:
    audit.title,
  status:
    "COMPLETE",
  payload: {
    reportId:
      report.reportId,
    auditId:
      audit.id,
    categoryId:
      category.id
  }
});

renderReport(
  state.report.current
);

renderArchive();
renderDropReportState();

recordAction(
  "createReport",
  {
    reportId:
      report.reportId,
    auditId:
      audit.id
  }
);

return frozenClone(
  state.report.current
);

}

function interpretRead(audit, category) {
var participants =
state.participants || [];

var required =
  participants
    .filter(function requiredOnly(entry) {
      return entry.required;
    });

var availableRequired =
  required
    .filter(function availableOnly(entry) {
      return entry.available;
    });

var missingRequired =
  required
    .filter(function missingOnly(entry) {
      return !entry.available;
    });

var unavailableCallable =
  required
    .filter(function nonCallable(entry) {
      return (
        entry.available &&
        !entry.callable
      );
    });

var optionalMissing =
  participants
    .filter(function optionalMissingOnly(entry) {
      return (
        !entry.required &&
        !entry.available
      );
    });

var observation =
  state.observation || {};

var evidence = [
  "The diagnostic engine initialized under contract " +
    CONTRACT +
    ".",
  String(
    availableRequired.length
  ) +
    " of " +
    String(
      required.length
    ) +
    " required diagnostic participants are currently available.",
  "The selected audit is " +
    audit.title +
    " under " +
    category.label +
    ".",
  "Report construction completed synchronously.",
  "Report creation did not invoke direct execution.",
  "Report creation did not invoke the nine-cycle."
];

if (
  observation.target &&
  observation.target.framePresent
) {
  evidence.push(
    "The Audralia target iframe is present."
  );
}

if (
  observation.target &&
  observation.target.sameOrigin
) {
  evidence.push(
    "The target document is accessible through the same-origin observation path."
  );
}

if (
  observation.runtime &&
  observation.runtime.runtimeFound
) {
  evidence.push(
    "An Audralia runtime global was observed at " +
      observation.runtime.runtimeAlias +
      "."
  );
}

if (
  observation.runtime &&
  observation.runtime.mountFound
) {
  evidence.push(
    "A target mount element was observed at " +
      observation.runtime.mountSelector +
      "."
  );
}

if (
  observation.surface &&
  observation.surface.authorityFound
) {
  evidence.push(
    "The F8 Canvas Surface Truth participant is available."
  );
}

var absence = [];

missingRequired
  .forEach(function describeMissing(entry) {
    absence.push(
      entry.role +
      " is required but was not resolved."
    );
  });

unavailableCallable
  .forEach(function describeUncallable(entry) {
    absence.push(
      entry.role +
      " is available but no recognized callable diagnostic method was found."
    );
  });

optionalMissing
  .forEach(function describeOptionalMissing(entry) {
    absence.push(
      entry.role +
      " is optional and was not resolved."
    );
  });

if (
  !observation.target ||
  !observation.target.framePresent
) {
  absence.push(
    "The Audralia target frame was not observed."
  );
}

if (
  observation.target &&
  observation.target.framePresent &&
  !observation.target.sameOrigin
) {
  absence.push(
    "The target frame exists but same-origin document access was not confirmed."
  );
}

if (
  !observation.runtime ||
  !observation.runtime.runtimeFound
) {
  absence.push(
    "No recognized Audralia runtime global was observed."
  );
}

if (
  observation.runtime &&
  observation.runtime.mountFound &&
  observation.runtime.stageRectNonzero === false
) {
  absence.push(
    "The observed target mount rectangle is zero."
  );
}

if (
  state.cycle.count === 0
) {
  absence.push(
    "No nine-cycle execution exists for this session."
  );
}

if (
  state.direct.count === 0
) {
  absence.push(
    "No explicit direct diagnostic execution exists for this session."
  );
}

if (!absence.length) {
  absence.push(
    "No additional absence was established by the current safe report."
  );
}

var direction = [];

if (missingRequired.length) {
  direction.push(
    "Inspect the first missing required participant: " +
    missingRequired[0].role +
    " at " +
    missingRequired[0].path +
    "."
  );
}

if (unavailableCallable.length) {
  direction.push(
    "Inspect the callable contract for " +
    unavailableCallable[0].role +
    "."
  );
}

if (
  observation.runtime &&
  observation.runtime.mountFound &&
  observation.runtime.stageRectNonzero === false
) {
  direction.push(
    "Inspect the target HTML shell and stage layout because the observed mount rectangle is zero."
  );
}

if (
  audit.classification ===
  "DIRECT_AVAILABLE"
) {
  direction.push(
    "Use Run Direct Check only when deliberate participant execution is required."
  );
}

if (
  audit.classification ===
  "NINE_CYCLE_AVAILABLE"
) {
  direction.push(
    "Use Run Nine-Cycle only when a complete nine-station execution record is required."
  );
}

direction.push(
  "Preserve the production no-touch boundary. This diagnostic engine does not authorize repairs."
);

var result;

if (
  missingRequired.length ||
  unavailableCallable.length
) {
  result =
    "The diagnostic observatory is operational, but one or more required diagnostic participants are unavailable or non-callable.";
} else if (
  observation.target &&
  observation.target.framePresent
) {
  result =
    "The diagnostic observatory and required participant family are available, and the Audralia target is observable.";
} else {
  result =
    "The diagnostic observatory and required participant family are available, but target observation is incomplete.";
}

return deepFreeze({
  result:
    result,
  evidence:
    evidence,
  absence:
    absence,
  direction:
    direction
});

}

function runSelectedDirectCheck() {
if (!state.initialized) {
throw new Error(
"DIAGNOSTIC_ENGINE_NOT_INITIALIZED"
);
}

if (state.direct.running) {
  throw new Error(
    "DIRECT_CHECK_ALREADY_RUNNING"
  );
}

var audit =
  getAudit(
    state.selection.auditId
  );

if (!audit) {
  throw new Error(
    "SELECTED_AUDIT_NOT_FOUND"
  );
}

var role =
  audit.directParticipant ||
  state.selection.participantRole;

if (!role) {
  throw new Error(
    "SELECTED_AUDIT_HAS_NO_DIRECT_PARTICIPANT"
  );
}

var manifest =
  getParticipantManifestEntry(
    role
  );

if (!manifest) {
  throw new Error(
    "DIRECT_PARTICIPANT_NOT_REGISTERED:" +
    role
  );
}

var inspection =
  inspectParticipant(
    manifest
  );

if (!inspection.available) {
  throw new Error(
    "DIRECT_PARTICIPANT_UNAVAILABLE:" +
    role
  );
}

if (!inspection.callable) {
  throw new Error(
    "DIRECT_PARTICIPANT_NOT_CALLABLE:" +
    role
  );
}

var resolution =
  resolveParticipantObject(
    manifest
  );

var callable =
  identifyCallableMethod(
    manifest,
    resolution.value
  );

state.direct.running =
  true;

renderDropDirectState(
  "RUNNING"
);

try {
  var input =
    buildParticipantInput(
      manifest,
      "DIRECT"
    );

  var raw =
    callable.method ===
    "[[callable]]"
      ? callable.callable(
          input
        )
      : callable.callable.call(
          resolution.value,
          input
        );

  if (
    raw &&
    isFunction(raw.then)
  ) {
    throw new Error(
      "DIRECT_PARTICIPANT_RETURNED_ASYNC_RESULT"
    );
  }

  var normalized =
    normalizeReceipt({
      type:
        "direct",
      source:
        role,
      title:
        manifest.label,
      status:
        deriveReceiptStatus(
          raw
        ),
      cyclePosition:
        manifest.cyclePosition,
      fibonacci:
        manifest.fibonacci,
      payload:
        raw
    });

  state.direct.count += 1;

  state.direct.lastResult =
    deepFreeze(
      normalized
    );

  state.direct.lastError =
    null;

  addReceipt(
    normalized
  );

  renderDropDirectState(
    normalized.status
  );

  renderReceipts();
  renderEvidenceRail();

  recordAction(
    "runSelectedDirectCheck",
    {
      role:
        role,
      status:
        normalized.status
    }
  );

  return frozenClone(
    normalized
  );
} catch (error) {
  state.direct.lastError =
    recordError(
      "runSelectedDirectCheck",
      error,
      {
        role:
          role
      }
    );

  renderDropDirectState(
    "ERROR"
  );

  throw error;
} finally {
  state.direct.running =
    false;
}

}

function runNineCycle() {
if (!state.initialized) {
throw new Error(
"DIAGNOSTIC_ENGINE_NOT_INITIALIZED"
);
}

if (state.cycle.running) {
  throw new Error(
    "NINE_CYCLE_ALREADY_RUNNING"
  );
}

inspectParticipants();
observe();

var unavailable =
  STATION_ORDER
    .filter(function unavailableStation(manifest) {
      var participantState =
        findParticipantState(
          manifest.role
        );

      return (
        !participantState ||
        !participantState.available ||
        !participantState.callable
      );
    });

if (unavailable.length) {
  state.cycle.lastError =
    recordError(
      "runNineCycle",
      new Error(
        "NINE_CYCLE_PREFLIGHT_HELD:" +
        unavailable
          .map(function unavailableRole(entry) {
            return entry.role;
          })
          .join(",")
      )
    );

  renderCyclePreflightHeld(
    unavailable
  );

  throw new Error(
    "NINE_CYCLE_PREFLIGHT_HELD:" +
    unavailable
      .map(function unavailableRole(entry) {
        return entry.role;
      })
      .join(",")
  );
}

state.cycle.running =
  true;

state.cycle.receipts =
  [];

state.cycle.ledger =
  null;

state.cycle.lastError =
  null;

renderCycleRunning();

try {
  var conductorManifest =
    getParticipantManifestEntry(
      "NORTH_CONDUCTOR"
    );

  var conductorInspection =
    inspectParticipant(
      conductorManifest
    );

  var conductorResolution =
    resolveParticipantObject(
      conductorManifest
    );

  var conductorCallable =
    identifyCallableMethod(
      conductorManifest,
      conductorResolution.value
    );

  var stationInputs =
    STATION_ORDER
      .map(function buildStationRecord(manifest) {
        return {
          manifest:
            manifest,
          participant:
            findParticipantState(
              manifest.role
            ),
          input:
            buildParticipantInput(
              manifest,
              "NINE_CYCLE"
            )
        };
      });

  var receipts;

  if (
    conductorInspection.available &&
    conductorInspection.callable &&
    conductorCallable.callable
  ) {
    receipts =
      executeThroughConductor(
        conductorResolution.value,
        conductorCallable,
        stationInputs
      );
  } else {
    receipts =
      executeStationsSequentially(
        stationInputs
      );
  }

  state.cycle.receipts =
    receipts
      .map(
        normalizeReceipt
      );

  state.cycle.count += 1;

  state.cycle.lastRunAt =
    nowIso();

  state.cycle.ledger =
    buildCycleLedger(
      state.cycle.receipts
    );

  state.cycle.receipts
    .forEach(
      addReceipt
    );

  addReceipt({
    type:
      "cycle",
    source:
      "NORTH_CONDUCTOR",
    title:
      "Nine-cycle terminal receipt",
    status:
      state.cycle.ledger.status,
    payload:
      state.cycle.ledger
  });

  renderCycle();
  renderReceipts();
  renderEvidenceRail();

  recordAction(
    "runNineCycle",
    {
      cycleNumber:
        state.cycle.count,
      receiptCount:
        state.cycle.receipts.length,
      status:
        state.cycle.ledger.status
    }
  );

  return frozenClone({
    receipts:
      state.cycle.receipts,
    ledger:
      state.cycle.ledger
  });
} catch (error) {
  state.cycle.lastError =
    recordError(
      "runNineCycle",
      error
    );

  renderCycleError(
    error
  );

  throw error;
} finally {
  state.cycle.running =
    false;
}

}

function executeThroughConductor(
conductor,
callable,
stationInputs
) {
var payload = {
schema:
"AUDRALIA_DROP_WITH_READ_NINE_CYCLE_INPUT_v2",
contract:
CONTRACT,
stations:
stationInputs
.map(function stationPayload(entry) {
return {
role:
entry.manifest.role,
cyclePosition:
entry.manifest.cyclePosition,
fibonacci:
entry.manifest.fibonacci,
input:
clone(
entry.input
)
};
}),
executeStation:
function executeStation(role) {
var selected =
stationInputs
.filter(function roleMatch(entry) {
return (
entry.manifest.role ===
role
);
})[0];

      if (!selected) {
        throw new Error(
          "CONDUCTOR_REQUESTED_UNKNOWN_STATION:" +
          role
        );
      }

      return executeSingleStation(
        selected
      );
    },
  noClaims:
    NO_CLAIMS
};

var raw =
  callable.method ===
  "[[callable]]"
    ? callable.callable(
        payload
      )
    : callable.callable.call(
        conductor,
        payload
      );

if (
  raw &&
  isFunction(raw.then)
) {
  throw new Error(
    "NORTH_CONDUCTOR_RETURNED_ASYNC_RESULT"
  );
}

if (Array.isArray(raw)) {
  return raw;
}

if (
  raw &&
  Array.isArray(raw.receipts)
) {
  return raw.receipts;
}

return executeStationsSequentially(
  stationInputs
);

}

function executeStationsSequentially(stationInputs) {
return stationInputs
.map(
executeSingleStation
);
}

function executeSingleStation(entry) {
var resolution =
resolveParticipantObject(
entry.manifest
);

var callable =
  identifyCallableMethod(
    entry.manifest,
    resolution.value
  );

if (!callable.callable) {
  return normalizeReceipt({
    type:
      "cycle",
    source:
      entry.manifest.role,
    title:
      entry.manifest.label,
    status:
      "HELD",
    cyclePosition:
      entry.manifest.cyclePosition,
    fibonacci:
      entry.manifest.fibonacci,
    payload: {
      reason:
        "PARTICIPANT_NOT_CALLABLE"
    }
  });
}

try {
  var raw =
    callable.method ===
    "[[callable]]"
      ? callable.callable(
          entry.input
        )
      : callable.callable.call(
          resolution.value,
          entry.input
        );

  if (
    raw &&
    isFunction(raw.then)
  ) {
    throw new Error(
      "STATION_RETURNED_ASYNC_RESULT"
    );
  }

  return normalizeReceipt({
    type:
      "cycle",
    source:
      entry.manifest.role,
    title:
      entry.manifest.label,
    status:
      deriveReceiptStatus(
        raw
      ),
    cyclePosition:
      entry.manifest.cyclePosition,
    fibonacci:
      entry.manifest.fibonacci,
    payload:
      raw
  });
} catch (error) {
  return normalizeReceipt({
    type:
      "cycle",
    source:
      entry.manifest.role,
    title:
      entry.manifest.label,
    status:
      "ERROR",
    cyclePosition:
      entry.manifest.cyclePosition,
    fibonacci:
      entry.manifest.fibonacci,
    payload: {
      error:
        String(
          error &&
          error.message
            ? error.message
            : error
        )
    }
  });
}

}

function buildParticipantInput(manifest, mode) {
return deepFreeze({
schema:
PARTICIPANT_INPUT_SCHEMA,
mode:
mode,
engineContract:
CONTRACT,
selectedCategoryId:
state.selection.categoryId,
selectedAuditId:
state.selection.auditId,
participantRole:
manifest.role,
cyclePosition:
manifest.cyclePosition,
fibonacci:
manifest.fibonacci,
participantSnapshot:
frozenClone(
state.participants
),
observationSnapshot:
frozenClone(
state.observation
),
noClaims:
NO_CLAIMS,
createdAt:
nowIso()
});
}

function deriveReceiptStatus(raw) {
if (
raw &&
typeof raw.status === "string"
) {
return normalizeStatus(
raw.status
);
}

if (
  raw &&
  raw.error
) {
  return "ERROR";
}

if (raw === false) {
  return "HELD";
}

if (
  raw === null ||
  raw === undefined
) {
  return "UNKNOWN";
}

return "COMPLETE";

}

function normalizeReceipt(input) {
if (
input &&
input.schema === RECEIPT_SCHEMA
) {
return deepFreeze(
clone(input)
);
}

return deepFreeze({
  schema:
    RECEIPT_SCHEMA,
  receiptId:
    "AUDRALIA_RECEIPT_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8),
  type:
    input &&
    input.type
      ? input.type
      : "diagnostic",
  source:
    input &&
    input.source
      ? input.source
      : "UNKNOWN",
  title:
    input &&
    input.title
      ? input.title
      : "Diagnostic receipt",
  status:
    normalizeStatus(
      input &&
      input.status
    ),
  cyclePosition:
    input &&
    typeof input.cyclePosition === "number"
      ? input.cyclePosition
      : null,
  fibonacci:
    input &&
    input.fibonacci
      ? input.fibonacci
      : null,
  payload:
    clone(
      input &&
      input.payload
    ),
  createdAt:
    nowIso(),
  noClaims:
    NO_CLAIMS
});

}

function addReceipt(input) {
var receipt =
normalizeReceipt(
input
);

state.receipts.push(
  receipt
);

return receipt;

}

function deriveCycleStatus(receipts) {
if (
receipts
.some(function hasError(entry) {
return (
entry.status === "ERROR"
);
})
) {
return "ERROR";
}

if (
  receipts
    .some(function hasHeld(entry) {
      return (
        entry.status === "HELD" ||
        entry.status === "MISSING" ||
        entry.status === "UNKNOWN"
      );
    })
) {
  return "HELD";
}

return "COMPLETE";

}

function buildCycleLedger(receipts) {
var sorted =
receipts
.slice()
.sort(function receiptSort(a, b) {
return (
Number(
a.cyclePosition || 0
) -
Number(
b.cyclePosition || 0
)
);
});

var firstHeld =
  sorted
    .filter(function heldReceipt(entry) {
      return (
        entry.status === "HELD" ||
        entry.status === "MISSING" ||
        entry.status === "UNKNOWN"
      );
    })[0] || null;

var firstError =
  sorted
    .filter(function errorReceipt(entry) {
      return (
        entry.status === "ERROR"
      );
    })[0] || null;

return deepFreeze({
  schema:
    LEDGER_SCHEMA,
  cycleNumber:
    state.cycle.count,
  createdAt:
    nowIso(),
  stationCount:
    STATION_ORDER.length,
  receiptCount:
    sorted.length,
  status:
    deriveCycleStatus(
      sorted
    ),
  firstHeld:
    clone(
      firstHeld
    ),
  firstError:
    clone(
      firstError
    ),
  sequence:
    sorted
      .map(function sequenceEntry(entry) {
        return {
          cyclePosition:
            entry.cyclePosition,
          fibonacci:
            entry.fibonacci,
          source:
            entry.source,
          status:
            entry.status
        };
      }),
  noClaims:
    NO_CLAIMS
});

}

function addCurrentReportToArchive() {
if (!state.report.current) {
throw new Error(
"NO_CURRENT_REPORT_TO_ARCHIVE"
);
}

var exists =
  state.archive.reports
    .some(function duplicateReport(entry) {
      return (
        entry.reportId ===
        state.report.current.reportId
      );
    });

if (!exists) {
  state.archive.reports.push(
    state.report.current
  );
}

addReceipt({
  type:
    "archive",
  source:
    "DIAGNOSTIC_ARCHIVE",
  title:
    "Report added to archive",
  status:
    "COMPLETE",
  payload: {
    reportId:
      state.report.current.reportId
  }
});

renderArchive();
renderReceipts();

recordAction(
  "addCurrentReportToArchive",
  {
    reportId:
      state.report.current.reportId
  }
);

return frozenClone(
  state.archive.reports
);

}

function createDeepArchive() {
if (!state.initialized) {
throw new Error(
"DIAGNOSTIC_ENGINE_NOT_INITIALIZED"
);
}

var archive = {
  schema:
    ARCHIVE_SCHEMA,
  archiveId:
    "AUDRALIA_ARCHIVE_" +
    Date.now(),
  createdAt:
    nowIso(),
  engine:
    getState(),
  categories:
    CATEGORY_REGISTRY,
  audits:
    AUDIT_REGISTRY,
  participantManifest:
    PARTICIPANT_MANIFEST,
  participants:
    frozenClone(
      state.participants
    ),
  observation:
    frozenClone(
      state.observation
    ),
  currentReport:
    frozenClone(
      state.report.current
    ),
  reportHistory:
    frozenClone(
      state.report.history
    ),
  archivedReports:
    frozenClone(
      state.archive.reports
    ),
  direct:
    frozenClone(
      state.direct
    ),
  cycle:
    frozenClone(
      state.cycle
    ),
  receipts:
    frozenClone(
      state.receipts
    ),
  errors:
    frozenClone(
      state.errors
    ),
  engineReceipt:
    frozenClone(
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT ||
      null
    ),
  noClaims:
    NO_CLAIMS
};

state.archive.deepArchive =
  deepFreeze(
    archive
  );

state.archive.sessions.push(
  state.archive.deepArchive
);

addReceipt({
  type:
    "archive",
  source:
    "DIAGNOSTIC_ARCHIVE",
  title:
    "Deep diagnostic archive",
  status:
    "COMPLETE",
  payload: {
    archiveId:
      archive.archiveId
  }
});

renderArchive();
renderReceipts();

recordAction(
  "createDeepArchive",
  {
    archiveId:
      archive.archiveId
  }
);

return frozenClone(
  state.archive.deepArchive
);

}

function resetCurrentReport() {
state.report.current =
null;

renderEmptyReport();

recordAction(
  "resetCurrentReport"
);

return null;

}

function resetWorkbench() {
state.selection = {
categoryId:
"observatoryReceiver",
auditId:
"observatoryIndex",
participantRole:
null,
reportMode:
"read",
observationLens:
"target",
instrumentChamber:
"cycle"
};

state.report.current =
  null;

state.direct = {
  running:
    false,
  count:
    0,
  lastResult:
    null,
  lastError:
    null
};

state.cycle = {
  running:
    false,
  count:
    0,
  lastRunAt:
    null,
  receipts:
    [],
  ledger:
    null,
  lastError:
    null
};

state.receipts =
  [];

state.errors =
  [];

inspectParticipants();
observe();

renderSelection();
renderEmptyReport();
renderCycle();
renderReceipts();
renderArchive();
renderEvidenceRail();
renderDropStates();

recordAction(
  "resetWorkbench"
);

return getState();

}

function selectCategory(categoryId) {
var category =
getCategory(
categoryId
);

if (!category) {
  throw new Error(
    "CATEGORY_NOT_FOUND:" +
    categoryId
  );
}

var audits =
  AUDIT_REGISTRY
    .filter(function auditsInCategory(entry) {
      return (
        entry.categoryId ===
        categoryId
      );
    });

state.selection.categoryId =
  categoryId;

var currentAudit =
  getAudit(
    state.selection.auditId
  );

if (
  !currentAudit ||
  currentAudit.categoryId !== categoryId
) {
  state.selection.auditId =
    audits.length
      ? audits[0].id
      : null;
}

state.selection.participantRole =
  null;

renderSelection();

recordAction(
  "selectCategory",
  {
    categoryId:
      categoryId
  }
);

return frozenClone(
  category
);

}

function selectAudit(auditId) {
var audit =
getAudit(
auditId
);

if (!audit) {
  throw new Error(
    "AUDIT_NOT_FOUND:" +
    auditId
  );
}

state.selection.auditId =
  auditId;

state.selection.categoryId =
  audit.categoryId;

state.selection.participantRole =
  audit.directParticipant ||
  null;

renderSelection();

recordAction(
  "selectAudit",
  {
    auditId:
      auditId
  }
);

return frozenClone(
  audit
);

}

function selectParticipant(role) {
var participantState =
findParticipantState(
role
);

if (!participantState) {
  inspectParticipants();

  participantState =
    findParticipantState(
      role
    );
}

if (!participantState) {
  throw new Error(
    "PARTICIPANT_NOT_FOUND:" +
    role
  );
}

state.selection.participantRole =
  role;

renderParticipantDetail(
  participantState
);

recordAction(
  "selectParticipant",
  {
    role:
      role
  }
);

return frozenClone(
  participantState
);

}

function selectReportMode(mode) {
state.selection.reportMode =
String(
mode || "read"
);

return state.selection.reportMode;

}

function selectObservationLens(lens) {
state.selection.observationLens =
String(
lens || "target"
);

return state.selection.observationLens;

}

function selectInstrumentChamber(chamber) {
state.selection.instrumentChamber =
String(
chamber || "cycle"
);

return state.selection.instrumentChamber;

}

function getReadableReport() {
var report =
state.report.current;

if (!report) {
  return "";
}

return [
  "AUDRALIA DROP WITH READ DIAGNOSTIC REPORT",
  "REPORT_ID=" +
    report.reportId,
  "SCHEMA=" +
    report.schema,
  "CREATED_AT=" +
    report.createdAt,
  "CATEGORY=" +
    report.category.label,
  "AUDIT=" +
    report.audit.title,
  "CLASSIFICATION=" +
    report.audit.classification,
  "",
  "RESULT",
  report.read.result,
  "",
  "EVIDENCE",
  report.read.evidence
    .map(function readableEvidence(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "ABSENCE",
  report.read.absence
    .map(function readableAbsence(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "DIRECTION",
  report.read.direction
    .map(function readableDirection(entry) {
      return "- " + entry;
    })
    .join("\n"),
  "",
  "BOUNDARY",
  "Diagnostic-only. Read-only. No repair, readiness, visual-pass, cycle-pass, or F21 claim."
].join("\n");

}

function getReportPacket() {
var report =
state.report.current;

if (!report) {
  return "";
}

return safeJson({
  schema:
    PACKET_SCHEMA,
  reportId:
    report.reportId,
  createdAt:
    report.createdAt,
  category:
    report.category,
  audit:
    report.audit,
  result:
    report.read.result,
  evidence:
    report.read.evidence,
  absence:
    report.read.absence,
  direction:
    report.read.direction,
  noClaims:
    NO_CLAIMS
});

}

function getRawReport() {
return state.report.current
? safeJson(
state.report.current
)
: "";
}

function getState() {
return frozenClone({
CONTRACT:
CONTRACT,
contract:
CONTRACT,
PREVIOUS_CONTRACT:
PREVIOUS_CONTRACT,
previousContract:
PREVIOUS_CONTRACT,
VERSION:
VERSION,
version:
VERSION,
FILE:
FILE,
file:
FILE,
status:
state.status,
initialized:
state.initialized,
initializedAt:
state.initializedAt,
selection:
state.selection,
participantCount:
state.participants.length,
reportCount:
state.report.history.length,
directCount:
state.direct.count,
cycleCount:
state.cycle.count,
receiptCount:
state.receipts.length,
errorCount:
state.errors.length,
actionCount:
state.actionCount,
lastAction:
state.lastAction,
noClaims:
NO_CLAIMS
});
}

function getCurrentReport() {
return frozenClone(
state.report.current
);
}

function getParticipants() {
return frozenClone(
state.participants
);
}

function getObservation() {
return frozenClone(
state.observation
);
}

function getLedger() {
return frozenClone(
state.cycle.ledger
);
}

function getReceipts() {
return frozenClone(
state.receipts
);
}

function getArchive() {
return frozenClone(
state.archive
);
}

function renderSelection() {
var category =
getCategory(
state.selection.categoryId
);

var audit =
  getAudit(
    state.selection.auditId
  );

var audits =
  AUDIT_REGISTRY
    .filter(function categoryAudits(entry) {
      return (
        category &&
        entry.categoryId ===
          category.id
      );
    });

if (category) {
  setText(
    "categorySelectorLabel",
    category.label
  );

  setText(
    "categorySelectorMeta",
    String(
      audits.length
    ) +
    (
      audits.length === 1
        ? " audit"
        : " audits"
    )
  );

  setText(
    "selectedCategoryLabel",
    category.label
  );

  Array.prototype.slice.call(
    doc.querySelectorAll(
      "[data-category-id]"
    )
  ).forEach(function updateCategoryButton(button) {
    button.setAttribute(
      "aria-selected",
      button.getAttribute(
        "data-category-id"
      ) === category.id
        ? "true"
        : "false"
    );
  });
}

if (audit) {
  setText(
    "auditSelectorLabel",
    audit.title
  );

  setText(
    "auditSelectorMeta",
    audit.classification
  );

  setText(
    "selectedAuditSequence",
    audit.sequence
  );

  setText(
    "selectedAuditClassification",
    audit.classification
  );

  setText(
    "selectedAuditTitle",
    audit.title
  );

  setText(
    "selectedAuditSummary",
    audit.summary
  );

  setText(
    "activeAuditMode",
    audit.classification
  );

  setHidden(
    "runDirectCheck",
    audit.classification !==
      "DIRECT_AVAILABLE"
  );

  setHidden(
    "runNineCycle",
    audit.classification !==
      "NINE_CYCLE_AVAILABLE"
  );

  Array.prototype.slice.call(
    doc.querySelectorAll(
      "[data-audit-id]"
    )
  ).forEach(function updateAuditButton(button) {
    button.setAttribute(
      "aria-selected",
      button.getAttribute(
        "data-audit-id"
      ) === audit.id
        ? "true"
        : "false"
    );
  });

  renderAuditMenu(
    audits
  );
}

}

function renderAuditMenu(audits) {
setHtml(
"auditSelectorMenu",
audits
.map(function renderAuditOption(audit) {
return (
'<button type="button" role="option" ' +
'aria-selected="' +
(
audit.id ===
state.selection.auditId
? "true"
: "false"
) +
'" data-audit-id="' +
escapeHtml(
audit.id
) +
'">' +
"<strong>" +
escapeHtml(
audit.title
) +
"</strong>" +
"<span>" +
escapeHtml(
audit.summary
) +
"</span>" +
"</button>"
);
})
.join("")
);
}

function renderParticipants() {
var available =
state.participants
.filter(function availableParticipant(entry) {
return entry.available;
});

var held =
  state.participants
    .filter(function heldParticipant(entry) {
      return (
        entry.required &&
        (
          !entry.available ||
          !entry.callable
        )
      );
    });

var required =
  state.participants
    .filter(function requiredParticipant(entry) {
      return entry.required;
    });

var optional =
  state.participants
    .filter(function optionalParticipant(entry) {
      return !entry.required;
    });

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-participant-summary]"
  )
).forEach(function updateSummary(node) {
  var key =
    node.getAttribute(
      "data-participant-summary"
    );

  var value =
    0;

  if (key === "required") {
    value =
      required.length;
  } else if (key === "optional") {
    value =
      optional.length;
  } else if (key === "available") {
    value =
      available.length;
  } else if (key === "held") {
    value =
      held.length;
  }

  node.textContent =
    String(value);
});

state.participants
  .forEach(function updateParticipantNode(entry) {
    var node =
      doc.querySelector(
        '[data-participant-role="' +
        entry.role +
        '"]'
      );

    if (!node) {
      return;
    }

    setStatus(
      node,
      entry.status
    );

    var small =
      node.querySelector(
        "small"
      );

    if (small) {
      small.textContent =
        entry.status;
    }
  });

setText(
  "dropParticipantAvailableCount",
  available.length
);

setText(
  "dropParticipantHeldCount",
  held.length
);

}

function renderParticipantDetail(entry) {
setHtml(
"participantDetail",
"<h3>" +
escapeHtml(
entry.label
) +
"</h3>" +
"<p><strong>Role:</strong> " +
escapeHtml(
entry.role
) +
"</p>" +
"<p><strong>Path:</strong> " +
escapeHtml(
entry.path
) +
"</p>" +
"<p><strong>Required:</strong> " +
escapeHtml(
entry.required
? "Yes"
: "No"
) +
"</p>" +
"<p><strong>Status:</strong> " +
escapeHtml(
entry.status
) +
"</p>" +
"<p><strong>Resolved alias:</strong> " +
escapeHtml(
entry.resolvedAlias ||
"None"
) +
"</p>" +
"<p><strong>Contract:</strong> " +
escapeHtml(
entry.contract ||
"Unknown"
) +
"</p>" +
"<p><strong>Callable method:</strong> " +
escapeHtml(
entry.callableMethod ||
"None"
) +
"</p>"
);
}

function renderObservation() {
var observation =
state.observation;

if (!observation) {
  return;
}

var target =
  observation.target;

var runtime =
  observation.runtime;

var surface =
  observation.surface;

setText(
  "targetFramePresent",
  target.framePresent
    ? "Yes"
    : "No"
);

setText(
  "targetSameOrigin",
  target.sameOrigin
    ? "Yes"
    : "No"
);

setText(
  "targetDocumentState",
  target.documentState
);

setText(
  "targetRouteMatch",
  target.routeMatch
    ? "Yes"
    : "No"
);

setText(
  "targetPath",
  target.path ||
  TARGET_ROUTE
);

setText(
  "targetTitle",
  target.title ||
  "Unknown"
);

setText(
  "targetAccessError",
  target.accessError ||
  "None observed"
);

setText(
  "runtimeGlobal",
  runtime.runtimeAlias ||
  "Not found"
);

setText(
  "runtimeMounted",
  runtime.runtimeMounted === null
    ? "Unknown"
    : runtime.runtimeMounted
      ? "Yes"
      : "No"
);

setText(
  "runtimeGeometry",
  runtime.geometry
    ? safeJson(
        runtime.geometry
      )
    : "Unknown"
);

setText(
  "runtimeStageRect",
  runtime.stageRectNonzero === null
    ? "Unknown"
    : runtime.stageRectNonzero
      ? "Nonzero"
      : "Zero"
);

setText(
  "runtimeFirstFrame",
  runtime.firstFrame === null
    ? "Unknown"
    : String(
        runtime.firstFrame
      )
);

setText(
  "runtimeVisiblePixel",
  runtime.visiblePixel === null
    ? "Unknown"
    : runtime.visiblePixel
      ? "Yes"
      : "No"
);

setText(
  "runtimeFallback",
  runtime.fallback === null
    ? "Unknown"
    : String(
        runtime.fallback
      )
);

setText(
  "runtimeReceiptAvailability",
  runtime.receiptAvailability
    ? "Available"
    : "Not observed"
);

setText(
  "surfaceAuthority",
  surface.authorityFound
    ? surface.authorityAlias
    : "Not found"
);

setText(
  "surfaceMethod",
  surface.method ||
  "Unknown"
);

setText(
  "surfaceContract",
  surface.contract ||
  "Unknown"
);

setText(
  "surfaceReceipt",
  surface.receiptFound
    ? "Available"
    : "Not observed"
);

setText(
  "surfacePacketKeys",
  surface.packetKeys.length
    ? surface.packetKeys.join(", ")
    : "None observed"
);

setText(
  "surfaceFirstHeld",
  surface.firstHeld
    ? surface.firstHeld.path
    : "None observed"
);

setText(
  "surfaceFirstFailed",
  surface.firstFailed
    ? surface.firstFailed.path
    : "None observed"
);

setText(
  "surfaceRecommendedOwner",
  surface.recommendedOwner ||
  "Unknown"
);

setText(
  "surfaceRecommendedFile",
  surface.recommendedFile ||
  "Unknown"
);

setText(
  "surfaceRecommendedAction",
  surface.recommendedAction ||
  "Unknown"
);

setText(
  "surfaceError",
  surface.error ||
  "None observed"
);

}

function renderRegistry() {
var registry =
state.observation &&
state.observation.engineFamily
? state.observation.engineFamily
: null;

if (!registry) {
  return;
}

var snapshot =
  registry.registrySnapshot;

setText(
  "governingContractCount",
  snapshot.governingContracts.length
);

setText(
  "assignedEngineCount",
  snapshot.assignedEngines.length
);

setText(
  "selectableEngineCount",
  snapshot.selectableEngines.length
);

setText(
  "reservedEngineCount",
  snapshot.reservedSlots.length
);

var records = []
  .concat(
    snapshot.governingContracts
      .map(
        registryRecord(
          "Governing Contract"
        )
      )
  )
  .concat(
    snapshot.assignedEngines
      .map(
        registryRecord(
          "Assigned Engine"
        )
      )
  )
  .concat(
    snapshot.selectableEngines
      .map(
        registryRecord(
          "Selectable Engine"
        )
      )
  )
  .concat(
    snapshot.reservedSlots
      .map(
        registryRecord(
          "Reserved Slot"
        )
      )
  );

setHtml(
  "registryRecordList",
  records.length
    ? records.join("")
    : (
        '<article class="empty-state">' +
        "<h4>No registry records observed</h4>" +
        "<p>The registry global may be missing or use an unrecognized shape.</p>" +
        "</article>"
      )
);

setHtml(
  "selectedEngineDetail",
  "<h4>Selected Engine</h4>" +
  "<p><strong>Runtime engine found:</strong> " +
  escapeHtml(
    registry.runtimeEngineFound
      ? "Yes"
      : "No"
  ) +
  "</p>" +
  "<p><strong>Contract:</strong> " +
  escapeHtml(
    registry.runtimeEngineContract ||
    "Unknown"
  ) +
  "</p>"
);

setHtml(
  "engineRuntimeDetail",
  "<h4>Registry Evidence</h4>" +
  "<p><strong>Registry found:</strong> " +
  escapeHtml(
    registry.registryFound
      ? "Yes"
      : "No"
  ) +
  "</p>" +
  "<p><strong>Contract:</strong> " +
  escapeHtml(
    registry.registryContract ||
    "Unknown"
  ) +
  "</p>"
);

}

function registryRecord(label) {
return function renderRegistryRecord(entry) {
return (
"<article>" +
"<h4>" +
escapeHtml(
label
) +
"</h4>" +
"<pre>" +
escapeHtml(
safeJson(
entry
)
) +
"</pre>" +
"</article>"
);
};
}

function renderReport(report) {
setText(
"reportStatus",
"COMPLETE"
);

setStatus(
  "reportStatus",
  "COMPLETE"
);

setText(
  "reportTitle",
  report.audit.title
);

setText(
  "reportCreatedAt",
  report.createdAt
);

setText(
  "reportMeta",
  report.reportId +
  " · " +
  report.audit.classification
);

renderReadRegion(
  "readResult",
  "R",
  "Result",
  report.read.result,
  [report.read.result]
);

renderReadRegion(
  "readEvidence",
  "E",
  "Evidence",
  "Observed evidence",
  report.read.evidence
);

renderReadRegion(
  "readAbsence",
  "A",
  "Absence",
  "Missing or unresolved evidence",
  report.read.absence
);

renderReadRegion(
  "readDirection",
  "D",
  "Direction",
  "Recommended diagnostic direction",
  report.read.direction
);

setText(
  "packetOutput",
  getReportPacket()
);

setText(
  "rawOutput",
  getRawReport()
);

setHtml(
  "evidenceOutput",
  buildEvidenceHtml(
    report
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

}

function renderReadRegion(
id,
letter,
label,
headline,
entries
) {
var list =
Array.isArray(entries)
? entries
: [entries];

setHtml(
  id,
  "<header>" +
  "<span>" +
  escapeHtml(
    letter
  ) +
  "</span>" +
  "<div>" +
  "<p>" +
  escapeHtml(
    label
  ) +
  "</p>" +
  "<strong>" +
  escapeHtml(
    headline
  ) +
  "</strong>" +
  "</div>" +
  "</header>" +
  (
    list.length > 1
      ? "<ul>" +
        list
          .map(function readListItem(entry) {
            return (
              "<li>" +
              escapeHtml(
                entry
              ) +
              "</li>"
            );
          })
          .join("") +
        "</ul>"
      : "<p>" +
        escapeHtml(
          list[0] || ""
        ) +
        "</p>"
  )
);

}

function buildEvidenceHtml(report) {
return [
"<article>",
"<h3>Report Evidence</h3>",
"<pre>",
escapeHtml(
safeJson(
report.read.evidence
)
),
"</pre>",
"</article>",
"<article>",
"<h3>Participant Snapshot</h3>",
"<pre>",
escapeHtml(
safeJson(
report.participantSnapshot
)
),
"</pre>",
"</article>",
"<article>",
"<h3>Observation Snapshot</h3>",
"<pre>",
escapeHtml(
safeJson(
report.observationSnapshot
)
),
"</pre>",
"</article>"
].join("");
}

function renderEmptyReport() {
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
  "Engine available",
  "The diagnostic engine completed initialization."
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
  "Use Create Report to inspect the selected audit."
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
  "<p>Create a report to collect current diagnostic evidence.</p>" +
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

}

function renderCycleRunning() {
setText(
"cycleStatus",
"Cycle · Running"
);

setStatus(
  "cycleStatus",
  "RUNNING"
);

setHtml(
  "cycleExecutionSummary",
  "<span>Execution</span>" +
  "<strong>Running</strong>" +
  "<p>The nine-cycle is executing.</p>"
);

Array.prototype.slice.call(
  doc.querySelectorAll(
    "#cycleMap [data-station]"
  )
).forEach(function markStationRunning(node) {
  setStatus(
    node,
    "RUNNING"
  );
});

}

function renderCyclePreflightHeld(unavailable) {
setText(
"cycleStatus",
"Cycle · Held"
);

setStatus(
  "cycleStatus",
  "HELD"
);

setHtml(
  "cyclePreflightSummary",
  "<span>Preflight</span>" +
  "<strong>Held</strong>" +
  "<p>Unavailable stations: " +
  escapeHtml(
    unavailable
      .map(function unavailableRole(entry) {
        return entry.role;
      })
      .join(", ")
  ) +
  "</p>"
);

}

function renderCycleError(error) {
setText(
"cycleStatus",
"Cycle · Error"
);

setStatus(
  "cycleStatus",
  "ERROR"
);

setHtml(
  "cycleExecutionSummary",
  "<span>Execution</span>" +
  "<strong>Error</strong>" +
  "<p>" +
  escapeHtml(
    error &&
    error.message
      ? error.message
      : error
  ) +
  "</p>"
);

}

function renderCycle() {
var receipts =
state.cycle.receipts || [];

var ledger =
  state.cycle.ledger;

if (!receipts.length) {
  setText(
    "cycleStatus",
    "Cycle · Not Run"
  );

  setStatus(
    "cycleStatus",
    "NOT_RUN"
  );

  setHtml(
    "cycleExecutionSummary",
    "<span>Execution</span>" +
    "<strong>Not run</strong>" +
    "<p>No conductor cycle has been created during this session.</p>"
  );

  setText(
    "cycleLedgerOutput",
    "No cycle ledger has been produced."
  );

  setHtml(
    "cycleReceiptList",
    '<article class="empty-state">' +
    "<h4>No cycle receipts</h4>" +
    "<p>Run Nine-Cycle explicitly to create station receipts.</p>" +
    "</article>"
  );

  Array.prototype.slice.call(
    doc.querySelectorAll(
      "#cycleMap [data-station]"
    )
  ).forEach(function resetStation(node) {
    setStatus(
      node,
      "UNKNOWN"
    );
  });

  return;
}

setText(
  "cycleStatus",
  "Cycle · " +
  ledger.status
);

setStatus(
  "cycleStatus",
  ledger.status
);

setHtml(
  "cycleExecutionSummary",
  "<span>Execution</span>" +
  "<strong>" +
  escapeHtml(
    ledger.status
  ) +
  "</strong>" +
  "<p>" +
  escapeHtml(
    String(
      receipts.length
    ) +
    " station receipts recorded."
  ) +
  "</p>"
);

setText(
  "cycleLedgerOutput",
  safeJson(
    ledger
  )
);

setHtml(
  "cycleReceiptList",
  receipts
    .map(function renderCycleReceipt(receipt) {
      return (
        "<article>" +
        "<h4>" +
        escapeHtml(
          receipt.fibonacci +
          " · " +
          receipt.source
        ) +
        "</h4>" +
        "<p>Status: " +
        escapeHtml(
          receipt.status
        ) +
        "</p>" +
        "<pre>" +
        escapeHtml(
          safeJson(
            receipt.payload
          )
        ) +
        "</pre>" +
        "</article>"
      );
    })
    .join("")
);

receipts
  .forEach(function updateCycleStation(receipt) {
    var node =
      doc.querySelector(
        '#cycleMap [data-station="' +
        receipt.source +
        '"]'
      );

    if (node) {
      setStatus(
        node,
        receipt.status
      );
    }
  });

}

function renderReceipts() {
setHtml(
"receiptList",
state.receipts.length
? state.receipts
.map(function renderReceipt(receipt, index) {
return (
'<article tabindex="0" role="button" ' +
'data-receipt-index="' +
String(index) +
'" data-receipt-type="' +
escapeHtml(
receipt.type
) +
'">' +
"<h4>" +
escapeHtml(
receipt.title
) +
"</h4>" +
"<p>" +
escapeHtml(
receipt.source
) +
" · " +
escapeHtml(
receipt.status
) +
"</p>" +
"</article>"
);
})
.join("")
: (
'<article class="empty-state">' +
"<h4>No receipts collected</h4>" +
"<p>Reports, observations, direct checks, and cycle execution may contribute receipts.</p>" +
"</article>"
)
);
}

function renderArchive() {
setText(
"archiveSessionCount",
state.archive.sessions.length
);

setHtml(
  "archiveReportList",
  state.archive.reports.length
    ? state.archive.reports
        .map(function renderArchivedReport(report) {
          return (
            "<article>" +
            "<h4>" +
            escapeHtml(
              report.audit.title
            ) +
            "</h4>" +
            "<p>" +
            escapeHtml(
              report.reportId
            ) +
            "</p>" +
            "</article>"
          );
        })
        .join("")
    : (
        '<article class="empty-state">' +
        "<h4>No archived reports</h4>" +
        "<p>Create a report and add it to the archive.</p>" +
        "</article>"
      )
);

setHtml(
  "archiveErrorList",
  state.archive.errors.length
    ? state.archive.errors
        .map(function renderArchivedError(error) {
          return (
            "<article>" +
            "<h4>" +
            escapeHtml(
              error.action
            ) +
            "</h4>" +
            "<p>" +
            escapeHtml(
              error.message
            ) +
            "</p>" +
            "</article>"
          );
        })
        .join("")
    : (
        '<article class="empty-state">' +
        "<h4>No archived errors</h4>" +
        "<p>No diagnostic-engine errors have been recorded.</p>" +
        "</article>"
      )
);

setHtml(
  "archiveParticipantSnapshot",
  "<h4>Participant Snapshot</h4>" +
  "<pre>" +
  escapeHtml(
    safeJson(
      state.participants
    )
  ) +
  "</pre>"
);

setHtml(
  "archiveObservationSnapshot",
  "<h4>Observation Snapshot</h4>" +
  "<pre>" +
  escapeHtml(
    safeJson(
      state.observation
    )
  ) +
  "</pre>"
);

setText(
  "archiveRawOutput",
  state.archive.deepArchive
    ? safeJson(
        state.archive.deepArchive
      )
    : "No deep archive has been created."
);

}

function renderEvidenceRail() {
var participants =
state.participants || [];

var target =
  state.observation &&
  state.observation.target;

var runtime =
  state.observation &&
  state.observation.runtime;

var surface =
  state.observation &&
  state.observation.surface;

setRailStatus(
  "targetStatus",
  "Target",
  target
    ? target.framePresent
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

setRailStatus(
  "runtimeStatus",
  "Runtime",
  runtime
    ? runtime.runtimeFound
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

setRailStatus(
  "rendererStatus",
  "Renderer",
  runtime
    ? runtime.mountFound
      ? "FOUND"
      : "UNKNOWN"
    : "UNKNOWN"
);

setRailStatus(
  "surfaceStatus",
  "Surface",
  surface
    ? surface.authorityFound
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

setDirectionStatus(
  "northStatus",
  "North",
  participants,
  "NORTH"
);

setDirectionStatus(
  "eastStatus",
  "East",
  participants,
  "EAST"
);

setDirectionStatus(
  "westStatus",
  "West",
  participants,
  "WEST"
);

setDirectionStatus(
  "southStatus",
  "South",
  participants,
  "SOUTH"
);

setRailStatus(
  "cycleStatus",
  "Cycle",
  state.cycle.count
    ? state.cycle.ledger.status
    : "NOT_RUN"
);

var registry =
  state.observation &&
  state.observation.engineFamily;

setRailStatus(
  "registryStatus",
  "Registry",
  registry
    ? registry.registryFound
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

setRailStatus(
  "mountStatus",
  "Mount",
  runtime
    ? runtime.mountFound
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

setRailStatus(
  "canvasStatus",
  "Canvas",
  runtime
    ? String(
        runtime.mountTag || ""
      ).toUpperCase() === "CANVAS"
      ? "FOUND"
      : "UNKNOWN"
    : "UNKNOWN"
);

setRailStatus(
  "frameStatus",
  "Frame",
  target
    ? target.framePresent
      ? "FOUND"
      : "MISSING"
    : "UNKNOWN"
);

}

function setRailStatus(id, label, status) {
setText(
id,
label +
" · " +
status
);

setStatus(
  id,
  status
);

}

function setDirectionStatus(
id,
label,
participants,
direction
) {
var directional =
participants
.filter(function directionMatch(entry) {
return (
entry.direction ===
direction
);
});

var status;

if (!directional.length) {
  status =
    "UNKNOWN";
} else if (
  directional
    .every(function allAvailable(entry) {
      return (
        entry.available &&
        entry.callable
      );
    })
) {
  status =
    "FOUND";
} else {
  status =
    "HELD";
}

setRailStatus(
  id,
  label,
  status
);

}

function renderDropStates() {
renderDropParticipantState();
renderDropObservationState();
renderDropReportState();

renderDropDirectState(
  state.direct.count
    ? state.direct.lastResult.status
    : "IDLE"
);

}

function renderDropParticipantState() {
var available =
state.participants
.filter(function availableEntry(entry) {
return (
entry.available &&
entry.callable
);
}).length;

var held =
  state.participants
    .filter(function heldEntry(entry) {
      return (
        entry.required &&
        (
          !entry.available ||
          !entry.callable
        )
      );
    }).length;

setText(
  "dropParticipantState",
  held
    ? "HELD"
    : "READY"
);

setStatus(
  "dropParticipantCell",
  held
    ? "HELD"
    : "READY"
);

setText(
  "dropParticipantAvailableCount",
  available
);

setText(
  "dropParticipantHeldCount",
  held
);

setText(
  "dropParticipantLastAction",
  "Participant inspection completed at " +
  nowIso()
);

}

function renderDropObservationState() {
var target =
state.observation &&
state.observation.target;

var held =
  !target ||
  !target.framePresent;

setText(
  "dropObservationState",
  held
    ? "HELD"
    : "READY"
);

setStatus(
  "dropObservationCell",
  held
    ? "HELD"
    : "READY"
);

setText(
  "dropObservationAvailableCount",
  target &&
  target.framePresent
    ? "1"
    : "0"
);

setText(
  "dropObservationHeldCount",
  held
    ? "1"
    : "0"
);

setText(
  "dropObservationLastAction",
  "Observation completed at " +
  nowIso()
);

}

function renderDropReportState() {
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
  Math.max(
    1,
    state.report.history.length
  )
);

setText(
  "dropReportHeldCount",
  "0"
);

setText(
  "dropReportLastAction",
  state.report.current
    ? "Report created at " +
      state.report.current.createdAt
    : "Create Report is available immediately."
);

}

function renderDropDirectState(status) {
var normalized =
normalizeStatus(
status
);

setText(
  "dropDirectState",
  normalized
);

setStatus(
  "dropDirectCell",
  normalized
);

setText(
  "dropDirectAvailableCount",
  state.participants
    .filter(function callableEntry(entry) {
      return entry.callable;
    }).length
);

setText(
  "dropDirectHeldCount",
  state.participants
    .filter(function heldCallable(entry) {
      return (
        entry.required &&
        !entry.callable
      );
    }).length
);

setText(
  "dropDirectLastAction",
  state.direct.lastResult
    ? state.direct.lastResult.title +
      " · " +
      state.direct.lastResult.status
    : "No direct command has been executed."
);

}

function publishEngineReceipt() {
root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT =
deepFreeze({
schema:
ENGINE_RECEIPT_SCHEMA,
contract:
CONTRACT,
previousContract:
PREVIOUS_CONTRACT,
version:
VERSION,
file:
FILE,
htmlContract:
HTML_CONTRACT,
cssContract:
CSS_CONTRACT,
controlPanelContract:
CONTROL_PANEL_CONTRACT,
initialized:
state.initialized,
initializedAt:
state.initializedAt,
status:
state.status,
participantCount:
state.participants.length,
reportCount:
state.report.history.length,
directCount:
state.direct.count,
cycleCount:
state.cycle.count,
receiptCount:
state.receipts.length,
errorCount:
state.errors.length,
actionCount:
state.actionCount,
lastAction:
frozenClone(
state.lastAction
),
newsOrder: [
"NORTH",
"EAST",
"WEST",
"SOUTH",
"TERMINAL_RAIL"
],
fibonacciOrder: [
"F1",
"F3",
"F5",
"F8",
"F13",
"F21",
"F34",
"F55",
"F89"
],
auxiliary: {
role:
"SOUTH_SURFACE_POINTER",
parentCyclePosition:
8,
parentFibonacci:
"F55",
createsStation:
false
},
noClaims:
NO_CLAIMS,
generatedAt:
nowIso()
});
}

function publishApi() {
var api =
Object.freeze({
CONTRACT:
CONTRACT,
contract:
CONTRACT,
PREVIOUS_CONTRACT:
PREVIOUS_CONTRACT,
previousContract:
PREVIOUS_CONTRACT,
VERSION:
VERSION,
version:
VERSION,
FILE:
FILE,
file:
FILE,
STATUS:
"READY",
status:
"READY",

    createReport:
      createReport,

    observe:
      observe,

    runSelectedDirectCheck:
      runSelectedDirectCheck,

    runNineCycle:
      runNineCycle,

    createDeepArchive:
      createDeepArchive,

    addCurrentReportToArchive:
      addCurrentReportToArchive,

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

    getState:
      getState,

    getCurrentReport:
      getCurrentReport,

    getReadableReport:
      getReadableReport,

    getReportPacket:
      getReportPacket,

    getRawReport:
      getRawReport,

    getParticipants:
      getParticipants,

    getObservation:
      getObservation,

    getLedger:
      getLedger,

    getReceipts:
      getReceipts,

    getArchive:
      getArchive,

    getCategories:
      function getCategories() {
        return frozenClone(
          CATEGORY_REGISTRY
        );
      },

    getAudits:
      function getAudits() {
        return frozenClone(
          AUDIT_REGISTRY
        );
      },

    getParticipantManifest:
      function getParticipantManifest() {
        return frozenClone(
          PARTICIPANT_MANIFEST
        );
      },

    getEngineReceipt:
      function getEngineReceipt() {
        return frozenClone(
          root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT ||
          null
        );
      }
  });

root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY =
  api;

root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER =
  api;

if (
  !root.AUDRALIA ||
  typeof root.AUDRALIA !== "object"
) {
  root.AUDRALIA = {};
}

root.AUDRALIA.dropWithReadDiagnosticObservatory =
  api;

root.AUDRALIA.diagnosticRouteController =
  api;

root.__AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_LOADED__ =
  true;

root.__AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_CONTRACT__ =
  CONTRACT;

root.__AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_VERSION__ =
  VERSION;

return api;

}

function validateNewsAlignment() {
var expectedDirections = {
NORTH_PROBE_INTAKE:
"NORTH",
EAST_PROBE_SOURCE:
"EAST",
EAST_CONSTRUCTION_INTERPRETATION:
"EAST",
CANVAS_SURFACE_TRUTH:
"CENTER",
WEST_PROBE_RUNTIME:
"WEST",
WEST_RUNTIME_INTERPRETATION:
"WEST",
SOUTH_PROBE_HANDOFF:
"SOUTH",
SOUTH_RESTITUTION_INTERPRETATION:
"SOUTH",
RAIL_TERMINAL_SYNTHESIS:
"TERMINAL_RAIL"
};

Object.keys(
  expectedDirections
).forEach(function validateDirection(role) {
  var manifest =
    getParticipantManifestEntry(
      role
    );

  if (
    !manifest ||
    manifest.direction !==
      expectedDirections[role]
  ) {
    throw new Error(
      "NEWS_ALIGNMENT_FAILURE:" +
      role
    );
  }
});

return true;

}

function validateFibonacciSynchronization() {
var expected = [
{
role:
"NORTH_PROBE_INTAKE",
position:
1,
fibonacci:
"F1"
},
{
role:
"EAST_PROBE_SOURCE",
position:
2,
fibonacci:
"F3"
},
{
role:
"EAST_CONSTRUCTION_INTERPRETATION",
position:
3,
fibonacci:
"F5"
},
{
role:
"CANVAS_SURFACE_TRUTH",
position:
4,
fibonacci:
"F8"
},
{
role:
"WEST_PROBE_RUNTIME",
position:
5,
fibonacci:
"F13"
},
{
role:
"WEST_RUNTIME_INTERPRETATION",
position:
6,
fibonacci:
"F21"
},
{
role:
"SOUTH_PROBE_HANDOFF",
position:
7,
fibonacci:
"F34"
},
{
role:
"SOUTH_RESTITUTION_INTERPRETATION",
position:
8,
fibonacci:
"F55"
},
{
role:
"RAIL_TERMINAL_SYNTHESIS",
position:
9,
fibonacci:
"F89"
}
];

if (
  STATION_ORDER.length !==
  expected.length
) {
  throw new Error(
    "FIBONACCI_STATION_COUNT_MISMATCH"
  );
}

expected
  .forEach(function validateExpected(entry, index) {
    var actual =
      STATION_ORDER[index];

    if (
      actual.role !== entry.role ||
      actual.cyclePosition !== entry.position ||
      actual.fibonacci !== entry.fibonacci
    ) {
      throw new Error(
        "FIBONACCI_SYNCHRONIZATION_FAILURE:" +
        entry.role
      );
    }
  });

var auxiliary =
  getParticipantManifestEntry(
    "SOUTH_SURFACE_POINTER"
  );

if (
  !auxiliary ||
  auxiliary.cyclePosition !== null ||
  auxiliary.parentCyclePosition !== 8 ||
  auxiliary.parentFibonacci !== "F55"
) {
  throw new Error(
    "SOUTH_SURFACE_POINTER_AUXILIARY_FAILURE"
  );
}

return true;

}

function init() {
if (state.initialized) {
return;
}

try {
  state.status =
    "LOADING";

  validateNewsAlignment();
  validateFibonacciSynchronization();

  inspectParticipants();
  observe();

  renderSelection();
  renderEmptyReport();
  renderCycle();
  renderReceipts();
  renderArchive();
  renderEvidenceRail();
  renderDropStates();

  state.initialized =
    true;

  state.initializedAt =
    nowIso();

  state.status =
    "READY";

  setText(
    "controllerContract",
    CONTRACT
  );

  setText(
    "controllerState",
    "REPORT READY"
  );

  setStatus(
    "controllerState",
    "READY"
  );

  publishEngineReceipt();
  publishApi();

  recordAction(
    "initialize",
    {
      contract:
        CONTRACT,
      participantCount:
        state.participants.length
    }
  );
} catch (error) {
  state.status =
    "ERROR";

  recordError(
    "initialize",
    error
  );

  publishEngineReceipt();

  root.__AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_ERROR__ =
    deepFreeze({
      contract:
        CONTRACT,
      file:
        FILE,
      message:
        String(
          error &&
          error.message
            ? error.message
            : error
        ),
      occurredAt:
        nowIso()
    });

  throw error;
}

}

var existing =
root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY;

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
