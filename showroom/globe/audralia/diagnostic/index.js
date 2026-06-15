// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER_TNT_v1
// Full-file replacement.
// Diagnostic-only.
// Read-only.
//
// Canonical authority:
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_BLUEPRINT_v1
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_PREBUILD_REGISTRY_v1
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
// Governing laws:
// - Report creation is synchronous and nonblocking.
// - Participant, observation, runtime, Surface Truth, direct execution,
//   conductor, receipt, and cycle readiness may not block Create Report.
// - Missing evidence becomes report evidence.
// - Observation does not mutate the target.
// - Direct execution requires explicit user command.
// - Nine-cycle execution requires explicit user command.
// - Nine-cycle execution is not the report engine.
// - runtime.getReceipt() is never polled repeatedly.
// - Full target receipt capture is deliberate and bounded.
// - No production mutation, runtime restart, renderer mutation, repair,
//   readiness claim, visual-pass claim, F21 claim, or synthetic evidence.
//
// Owns:
// - observatory boot;
// - canonical state;
// - audit registry;
// - participant manifest;
// - participant and alias inspection;
// - registry and engine inspection;
// - target observation;
// - Surface Truth observation;
// - synchronous report creation;
// - READ interpretation;
// - report-mode rendering;
// - explicit direct checks;
// - explicit nine-cycle execution;
// - receipt normalization;
// - archive creation;
// - copy controls;
// - UI bindings;
// - public controller API.
//
// Does not own:
// - production;
// - target rendering;
// - target runtime mutation;
// - canvas repair;
// - controls repair;
// - route repair;
// - renderer repair;
// - WebGL or WebGPU initialization;
// - readiness;
// - visual pass;
// - F21 authority.

(function installAudraliaDropWithReadDiagnosticObservatory(global) {
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
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER_TNT_v1";

var PREVIOUS_CONTRACT =
"AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v6";

var VERSION =
"1.0.0";

var FILE =
"/showroom/globe/audralia/diagnostic/index.js";

var HTML_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STATIC_SHELL_TNT_v1";

var CSS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STYLE_TNT_v1";

var BLUEPRINT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_BLUEPRINT_v1";

var PREBUILD_REGISTRY =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_PREBUILD_REGISTRY_v1";

var GOVERNING_ENGINE_CONTRACT =
"DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

var CORE_ENGINE_CONTRACT =
"DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

var REGISTRY_CONTRACT =
"DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2";

var TARGET_ROUTE =
"/showroom/globe/audralia/";

var DIAGNOSTIC_ROUTE =
"/showroom/globe/audralia/diagnostic/";

var TARGET_FRAME_ID =
"audraliaDiagnosticTargetFrame";

var TARGET_RUNTIME_GLOBALS =
Object.freeze([
"DGBAudraliaPlanetRuntime",
"DGBAudraliaPlanetRenderer",
"DGBAudraliaPlanetRoute"
]);

var TARGET_RUNTIME_WAIT_INTERVAL_MS =
100;

var TARGET_RUNTIME_WAIT_TIMEOUT_MS =
5000;

var REPORT_SCHEMA =
"AUDRALIA_DROP_WITH_READ_REPORT_v1";

var READ_SCHEMA =
"AUDRALIA_DROP_WITH_READ_INTERPRETATION_v1";

var ARCHIVE_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DEEP_ARCHIVE_v1";

var CONDUCTOR_REQUEST_SCHEMA =
"AUDRALIA_DIAGNOSTIC_NINE_CYCLE_REQUEST_v1";

var LEDGER_SCHEMA =
"AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v4";

var RECEIPT_SCHEMA =
"AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

var READER_REPORT_SCHEMA =
"AUDRALIA_DIAGNOSTIC_READER_REPORT_v4";

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
readyClaimed: false,
verifiedClaimed: false,
visualPassClaimed: false,
finalVisualPassClaimed: false,
cyclePassClaimed: false,
f21Claimed: false,
syntheticEvidenceAuthorized: false
});

var STATIONS =
deepFreeze([
station(
1,
"NORTH_PROBE_INTAKE",
"North Intake",
"F1",
"/assets/audralia/audralia.diagnostic.probe.north.js",
[
"AUDRALIA_DIAGNOSTIC_PROBE_NORTH",
"AUDRALIA_DIAGNOSTIC_NORTH_PROBE",
"AUDRALIA.diagnosticProbeNorth",
"AUDRALIA.diagnostics.probeNorth"
]
),

  station(
    2,
    "EAST_PROBE_SOURCE",
    "East Source",
    "F3",
    "/assets/audralia/audralia.diagnostic.probe.east.js",
    [
      "AUDRALIA_DIAGNOSTIC_PROBE_EAST",
      "AUDRALIA_DIAGNOSTIC_EAST_PROBE",
      "AUDRALIA.diagnosticProbeEast",
      "AUDRALIA.diagnostics.probeEast"
    ]
  ),

  station(
    3,
    "EAST_CONSTRUCTION_INTERPRETATION",
    "East Construction",
    "F5",
    "/assets/audralia/audralia.diagnostic.east.js",
    [
      "AUDRALIA_DIAGNOSTIC_EAST",
      "AUDRALIA_DIAGNOSTIC_EAST_INTERPRETER",
      "AUDRALIA.diagnosticEast",
      "AUDRALIA.diagnostics.east"
    ]
  ),

  station(
    4,
    "CANVAS_SURFACE_TRUTH",
    "3D Surface Truth",
    "F8",
    "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js",
    [
      "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH",
      "AUDRALIA_DIAGNOSTIC_SURFACE_TRUTH",
      "AUDRALIA.diagnosticProbeCanvasSurfaceTruth",
      "AUDRALIA.diagnostics.surfaceTruth"
    ]
  ),

  station(
    5,
    "WEST_PROBE_RUNTIME",
    "West Runtime",
    "F13",
    "/assets/audralia/audralia.diagnostic.probe.west.js",
    [
      "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
      "AUDRALIA_DIAGNOSTIC_WEST_PROBE",
      "AUDRALIA.diagnosticProbeWest",
      "AUDRALIA.diagnostics.probeWest"
    ]
  ),

  station(
    6,
    "WEST_RUNTIME_INTERPRETATION",
    "West Interpretation",
    "F21",
    "/assets/audralia/audralia.diagnostic.west.js",
    [
      "AUDRALIA_DIAGNOSTIC_WEST",
      "AUDRALIA_DIAGNOSTIC_WEST_INTERPRETER",
      "AUDRALIA.diagnosticWest",
      "AUDRALIA.diagnostics.west"
    ]
  ),

  station(
    7,
    "SOUTH_PROBE_HANDOFF",
    "South Handoff",
    "F34",
    "/assets/audralia/audralia.diagnostic.probe.south.js",
    [
      "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
      "AUDRALIA_DIAGNOSTIC_SOUTH_PROBE",
      "AUDRALIA.diagnosticProbeSouth",
      "AUDRALIA.diagnostics.probeSouth"
    ]
  ),

  station(
    8,
    "SOUTH_RESTITUTION_INTERPRETATION",
    "South Restitution",
    "F55",
    "/assets/audralia/audralia.diagnostic.south.js",
    [
      "AUDRALIA_DIAGNOSTIC_SOUTH",
      "AUDRALIA_DIAGNOSTIC_SOUTH_INTERPRETER",
      "AUDRALIA.diagnosticSouth",
      "AUDRALIA.diagnostics.south"
    ]
  ),

  station(
    9,
    "RAIL_TERMINAL_SYNTHESIS",
    "Rail Synthesis",
    "F89",
    "/assets/audralia/audralia.diagnostic.rail.js",
    [
      "AUDRALIA_DIAGNOSTIC_RAIL",
      "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS",
      "AUDRALIA.diagnosticRail",
      "AUDRALIA.diagnostics.rail"
    ]
  )
]);

var PARTICIPANT_MANIFEST =
deepFreeze([
participant(
"GOVERNING_ENGINE_CONTRACT",
"Governing Engine Contract",
"/assets/engine/dgb.engine.contract.js",
true,
[
"DGB_ENGINE_CONTRACT",
"DGBInteractiveRuntimeEngineContract",
"DGB_ENGINE_GOVERNING_CONTRACT"
],
"ENGINE"
),

  participant(
    "RUNTIME_ENGINE_CORE",
    "Runtime Engine Core",
    "/assets/engine/dgb.engine.js",
    true,
    [
      "DGB_ENGINE",
      "DGBEngine"
    ],
    "ENGINE"
  ),

  participant(
    "ENGINE_AND_AUTHORITY_REGISTRY",
    "Engine and Authority Registry",
    "/assets/engine/dgb.engine.subjects.js",
    true,
    [
      "DGB_ENGINE_SUBJECT_REGISTRY",
      "DGBEngineSubjectRegistry",
      "DGB_ENGINE_SUBJECTS",
      "DGB_ENGINE_REGISTRY",
      "DGB_ENGINE_SUBJECTS_REGISTRY"
    ],
    "ENGINE"
  ),

  participant(
    "NORTH_CONDUCTOR",
    "North Conductor",
    "/assets/audralia/audralia.diagnostic.north.conductor.js",
    true,
    [
      "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",
      "AUDRALIA.diagnosticNorthConductor",
      "AUDRALIA.diagnostics.northConductor"
    ],
    "DIAGNOSTIC"
  ),

  participantFromStation(STATIONS[0]),
  participantFromStation(STATIONS[1]),
  participantFromStation(STATIONS[2]),
  participantFromStation(STATIONS[3]),
  participantFromStation(STATIONS[4]),
  participantFromStation(STATIONS[5]),
  participantFromStation(STATIONS[6]),
  participantFromStation(STATIONS[7]),

  participant(
    "SOUTH_SURFACE_POINTER",
    "South Surface Pointer",
    "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
    false,
    [
      "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
      "AUDRALIA.diagnosticSouthSurfacePointer",
      "AUDRALIA.diagnostics.southSurfacePointer"
    ],
    "AUXILIARY",
    {
      parentPosition: 8,
      fibonacci: "F55",
      createsCyclePosition: false
    }
  ),

  participantFromStation(STATIONS[8])
]);

var CATEGORY_REGISTRY =
deepFreeze([
category(
"observatoryReceiver",
"Observatory / Receiver",
[
audit(
"observatoryIndex",
"Observatory Index",
"SAFE_REPORT",
"Summarize the shell, controller, participants, observations, and current cycle evidence."
),
audit(
"controllerHealth",
"Controller Health",
"SAFE_REPORT",
"Inspect controller installation, contract lineage, boot state, bindings, and public API."
),
audit(
"shellContract",
"Shell Contract",
"SAFE_REPORT",
"Inspect the HTML shell, paired contracts, route declarations, target declaration, and boundaries."
),
audit(
"loadOrder",
"Load Order",
"SAFE_REPORT",
"Inspect shell-preloaded engine and diagnostic scripts in declared dependency order."
),
audit(
"targetAccess",
"Target Access",
"SAFE_REPORT",
"Inspect target-frame presence, access, document state, route, and title."
),
audit(
"aliasMap",
"Alias Map",
"SAFE_REPORT",
"Inspect participant alias candidates and resolved authority globals."
)
]
),

  category(
    "registryEngine",
    "Registry / Engine",
    [
      audit(
        "registrySummary",
        "Registry Summary",
        "SAFE_REPORT",
        "Inspect governing authority, assigned engines, selectable engines, reserved slots, and registry receipt."
      ),
      audit(
        "governingAuthority",
        "Governing Authority",
        "SAFE_REPORT",
        "Inspect the governing engine contract as an authority rather than a second executable engine."
      ),
      audit(
        "runtimeEngine",
        "Runtime Engine",
        "SAFE_REPORT",
        "Inspect the runtime engine identity, contract, file, version, state, and observed operations."
      ),
      audit(
        "selectedEngine",
        "Selected Engine",
        "SAFE_REPORT",
        "Inspect the registry-selected engine and its authority relationship."
      ),
      audit(
        "reservedSlots",
        "Reserved Slots",
        "SAFE_REPORT",
        "Inspect reserved future engine positions without treating them as assigned engines."
      ),
      audit(
        "engineRuntimeEvidence",
        "Engine Runtime Evidence",
        "SAFE_REPORT",
        "Inspect current engine instance, lifecycle, backend, mount, surface, frame, visibility, and fallback evidence."
      ),
      audit(
        "engineReceipt",
        "Engine Receipt",
        "SAFE_REPORT",
        "Inspect the runtime engine receipt if it is available."
      )
    ]
  ),

  category(
    "sourceSurface",
    "Source / Surface",
    [
      audit(
        "targetRuntimeLight",
        "Target Runtime Light",
        "SAFE_REPORT",
        "Inspect lightweight target-runtime evidence without requesting the full receipt."
      ),
      audit(
        "targetRuntimeFull",
        "Target Runtime Full",
        "DIRECT_EXECUTION",
        "Deliberately capture one full target-runtime receipt."
      ),
      audit(
        "canvasPresence",
        "Canvas Presence",
        "SAFE_REPORT",
        "Inspect runtime canvas, fallback canvas, and any canvas presence."
      ),
      audit(
        "geometryState",
        "Geometry State",
        "SAFE_REPORT",
        "Inspect mount, stage rectangle, and geometry-ready evidence."
      ),
      audit(
        "firstFrameState",
        "First Frame State",
        "SAFE_REPORT",
        "Inspect first-frame drawing, submission, or presentation evidence."
      ),
      audit(
        "visiblePixelState",
        "Visible Pixel State",
        "SAFE_REPORT",
        "Inspect visible-pixel evidence without creating a visual-pass claim."
      ),
      audit(
        "surfaceTruthSummary",
        "Surface Truth Summary",
        "SAFE_REPORT",
        "Inspect the resolved Surface Truth authority, contract, methods, and current evidence."
      ),
      audit(
        "surfaceTruthPacket",
        "Surface Truth Packet",
        "DIRECT_EXECUTION",
        "Deliberately invoke a verified Surface Truth read method when one exists."
      )
    ]
  ),

  category(
    "cardinalStations",
    "Cardinal Stations",
    [
      audit(
        "northParticipant",
        "North Participant",
        "SAFE_REPORT",
        "Inspect the North conductor and North intake participant."
      ),
      audit(
        "eastProbeParticipant",
        "East Probe Participant",
        "SAFE_REPORT",
        "Inspect the East source probe participant."
      ),
      audit(
        "eastInterpreterParticipant",
        "East Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the East construction interpreter participant."
      ),
      audit(
        "westProbeParticipant",
        "West Probe Participant",
        "SAFE_REPORT",
        "Inspect the West runtime probe participant."
      ),
      audit(
        "westInterpreterParticipant",
        "West Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the West runtime interpreter participant."
      ),
      audit(
        "southProbeParticipant",
        "South Probe Participant",
        "SAFE_REPORT",
        "Inspect the South handoff probe participant."
      ),
      audit(
        "southInterpreterParticipant",
        "South Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the South restitution interpreter participant."
      ),
      audit(
        "southPointerParticipant",
        "South Pointer Participant",
        "SAFE_REPORT",
        "Inspect the optional South Surface Pointer auxiliary."
      ),
      audit(
        "railParticipant",
        "Rail Participant",
        "SAFE_REPORT",
        "Inspect the terminal Rail Synthesis participant."
      )
    ]
  ),

  category(
    "nineCycle",
    "Nine-Cycle Diagnostics",
    [
      audit(
        "cyclePreview",
        "Cycle Preview",
        "CYCLE_PREVIEW",
        "Preview all nine cycle stations, participant availability, aliases, and current evidence without execution."
      ),
      audit(
        "cycleRegistrationMap",
        "Cycle Registration Map",
        "CYCLE_PREVIEW",
        "Inspect whether each station and auxiliary can be resolved for registration."
      ),
      audit(
        "cyclePreflight",
        "Cycle Preflight",
        "CYCLE_PREVIEW",
        "Inspect the current target-runtime admission state without starting a cycle."
      ),
      audit(
        "cycleExecution",
        "Cycle Execution",
        "CYCLE_EXECUTION",
        "Explicitly run bounded preflight and the synchronous nine-station North cycle."
      ),
      audit(
        "cycleLedger",
        "Cycle Ledger",
        "SAFE_REPORT",
        "Inspect the most recent compatible cycle ledger."
      ),
      audit(
        "cycleReceipts",
        "Cycle Receipts",
        "SAFE_REPORT",
        "Inspect normalized station receipts from the most recent cycle."
      ),
      audit(
        "cycleTerminalSynthesis",
        "Cycle Terminal Synthesis",
        "SAFE_REPORT",
        "Inspect the most recent terminal Rail Synthesis receipt."
      )
    ]
  ),

  category(
    "directExecution",
    "Direct Execution",
    [
      audit(
        "conductorDirect",
        "Conductor Direct",
        "DIRECT_PREVIEW",
        "Preview the North conductor authority and verified cycle API."
      ),
      audit(
        "surfaceTruthDirect",
        "Surface Truth Direct",
        "DIRECT_EXECUTION",
        "Invoke one verified read-only Surface Truth method."
      ),
      audit(
        "runtimeObservationDirect",
        "Runtime Observation Direct",
        "DIRECT_EXECUTION",
        "Capture one deliberate full runtime observation."
      ),
      audit(
        "registryRefreshDirect",
        "Registry Refresh Direct",
        "DIRECT_EXECUTION",
        "Invoke the verified registry refresh method and inspect the resulting state."
      )
    ]
  ),

  category(
    "boundaryArchive",
    "Boundary / Archive",
    [
      audit(
        "noTouchBoundary",
        "No-Touch Boundary",
        "SAFE_REPORT",
        "Inspect permanent diagnostic-only and read-only boundaries."
      ),
      audit(
        "sessionReports",
        "Session Reports",
        "SAFE_REPORT",
        "Inspect all reports created during the current session."
      ),
      audit(
        "errorArchive",
        "Error Archive",
        "SAFE_REPORT",
        "Inspect controller, participant, observation, direct, and cycle errors."
      ),
      audit(
        "receiptArchive",
        "Receipt Archive",
        "SAFE_REPORT",
        "Inspect all collected receipts."
      ),
      audit(
        "participantArchive",
        "Participant Archive",
        "SAFE_REPORT",
        "Inspect archived participant snapshots."
      ),
      audit(
        "deepArchive",
        "Deep Archive",
        "ARCHIVE_REPORT",
        "Create a complete session archive containing reports, participants, observations, direct results, cycle runs, errors, and boundaries."
      ),
      audit(
        "nextDirection",
        "Next Direction",
        "SAFE_REPORT",
        "Identify the highest-priority next diagnostic action from current absence evidence."
      )
    ]
  )
]);

var state = {
initialized: false,
bootedAt: null,
updatedAt: null,

activeCategoryId:
  "observatoryReceiver",

activeAuditId:
  "observatoryIndex",

activeParticipantRole:
  null,

activeReportMode:
  "read",

activeObservationLens:
  "target",

activeInstrumentChamber:
  "cycle",

targetVisible:
  false,

targetExpanded:
  false,

drop: {
  direct: laneState("IDLE"),
  report: laneState("READY"),
  observation: laneState("OBSERVING"),
  participant: laneState("LOADING")
},

participants: {
  manifest:
    clone(PARTICIPANT_MANIFEST),

  records:
    [],

  requiredCount:
    0,

  optionalCount:
    0,

  availableCount:
    0,

  heldCount:
    0,

  errorCount:
    0,

  observedAt:
    null
},

observation: {
  targetLight:
    null,

  targetFull:
    null,

  registry:
    null,

  registryReceipt:
    null,

  authorityRecords:
    [],

  engineRecords:
    [],

  selectedEngine:
    null,

  engineInspection:
    null,

  engineOps:
    null,

  engineReceipt:
    null,

  surfaceTruth:
    null,

  errors:
    [],

  observedAt:
    null
},

report: {
  current:
    null,

  readableText:
    "",

  packetText:
    "",

  rawText:
    "",

  evidence:
    [],

  sessionReports:
    []
},

direct: {
  running:
    false,

  selectedAuthority:
    null,

  selectedMethod:
    null,

  lastResult:
    null,

  lastError:
    null,

  history:
    []
},

cycle: {
  running:
    false,

  cycleId:
    null,

  runPhase:
    "IDLE",

  preflight:
    null,

  preflightProgress:
    null,

  stationRegistrations:
    [],

  auxiliaryRegistrations:
    [],

  conductorResult:
    null,

  conductorReceipt:
    null,

  conductorState:
    null,

  receipts:
    [],

  ledger:
    null,

  readerReport:
    "",

  lastRunAt:
    null,

  lastError:
    null
},

archive: {
  reports:
    [],

  directResults:
    [],

  cycleRuns:
    [],

  errors:
    [],

  participantSnapshots:
    [],

  observationSnapshots:
    [],

  deepArchive:
    null,

  createdAt:
    null,

  updatedAt:
    null
}

};

function station(
position,
stationId,
label,
fibonacci,
file,
globalPaths
) {
return {
position: position,
stationId: stationId,
role: stationId,
label: label,
fibonacci: fibonacci,
file: file,
globalPaths: globalPaths
};
}

function participant(
role,
label,
file,
required,
globalPaths,
group,
extra
) {
var output = {
role: role,
label: label,
file: file,
required: Boolean(required),
globalPaths: Array.isArray(globalPaths)
? globalPaths.slice()
: [],
group: group || "DIAGNOSTIC",
position: null,
fibonacci: null,
parentPosition: null,
createsCyclePosition: null
};

if (extra && typeof extra === "object") {
  Object.keys(extra).forEach(function assignExtra(key) {
    output[key] = extra[key];
  });
}

return output;

}

function participantFromStation(definition) {
return participant(
definition.stationId,
definition.label,
definition.file,
true,
definition.globalPaths,
"STATION",
{
position: definition.position,
fibonacci: definition.fibonacci,
createsCyclePosition: true
}
);
}

function category(id, label, audits) {
return {
id: id,
label: label,
audits: audits
};
}

function audit(id, label, classification, summary) {
return {
id: id,
label: label,
classification: classification,
summary: summary
};
}

function laneState(status) {
return {
status: status,
availableCount: 0,
heldCount: 0,
lastAction: null
};
}

function byId(id) {
return doc.getElementById(id);
}

function isObject(value) {
return Boolean(
value &&
typeof value === "object" &&
!Array.isArray(value)
);
}

function isNonemptyObject(value) {
return Boolean(
isObject(value) &&
Object.keys(value).length > 0
);
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

function firstString() {
var index;

for (
  index = 0;
  index < arguments.length;
  index += 1
) {
  if (
    typeof arguments[index] === "string" &&
    arguments[index].trim()
  ) {
    return arguments[index];
  }
}

return null;

}

function firstBoolean() {
var index;

for (
  index = 0;
  index < arguments.length;
  index += 1
) {
  if (typeof arguments[index] === "boolean") {
    return arguments[index];
  }
}

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

if (value instanceof Date) {
  try {
    return value.toISOString();
  } catch (_error) {
    return null;
  }
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
      child = value[key];
    } catch (_error) {
      child = null;
    }

    deepFreeze(child, memory);
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

function stablePrepare(value, seen) {
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
  return "[Function]";
}

memory =
  seen || [];

if (memory.indexOf(value) !== -1) {
  return "[Circular]";
}

memory.push(value);

if (Array.isArray(value)) {
  return value.map(function prepareEntry(entry) {
    return stablePrepare(
      entry,
      memory.slice()
    );
  });
}

output = {};

Object.keys(value)
  .sort()
  .forEach(function prepareProperty(key) {
    output[key] =
      stablePrepare(
        value[key],
        memory.slice()
      );
  });

return output;

}

function hashObject(value) {
var text;
var result;
var index;

try {
  text =
    JSON.stringify(
      stablePrepare(value)
    );
} catch (_error) {
  text =
    String(value);
}

result =
  0x811c9dc5;

for (
  index = 0;
  index < text.length;
  index += 1
) {
  result ^= text.charCodeAt(index);

  result =
    Math.imul(
      result,
      0x01000193
    ) >>> 0;
}

return (
  "fnv1a32-" +
  ("00000000" + result.toString(16)).slice(-8)
);

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

function delay(milliseconds) {
return new Promise(function boundedDelay(resolve) {
root.setTimeout(
resolve,
milliseconds
);
});
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

function readFirst(paths) {
var index;
var value;

for (
  index = 0;
  index < paths.length;
  index += 1
) {
  value =
    readPath(paths[index]);

  if (value) {
    return {
      value: value,
      path: paths[index]
    };
  }
}

return {
  value: null,
  path: null
};

}

function callSafely(
object,
methodName,
args,
fallback
) {
if (
!object ||
!isFunction(object[methodName])
) {
return fallback;
}

try {
  return object[methodName].apply(
    object,
    Array.isArray(args)
      ? args
      : []
  );
} catch (_error) {
  return fallback;
}

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

if (node) {
  node.innerHTML =
    String(value || "");
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

function setHidden(id, hidden) {
var node =
byId(id);

if (node) {
  node.hidden =
    Boolean(hidden);
}

}

function setStatus(nodeOrId, status) {
var node =
typeof nodeOrId === "string"
? byId(nodeOrId)
: nodeOrId;

if (!node) {
  return;
}

node.setAttribute(
  "data-status",
  normalizeStatus(
    status,
    "UNKNOWN"
  )
);

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
  }, 2200);

}

function normalizeStatus(value, fallback) {
var status =
typeof value === "string"
? value.trim().toUpperCase()
: "";

var allowed = {
  READY: true,
  FOUND: true,
  PASS: true,
  COMPLETE: true,
  AVAILABLE: true,
  ACTIVE: true,
  HOLD: true,
  HELD: true,
  MISSING: true,
  PARTIAL_PASS: true,
  NOT_RUN: true,
  EMPTY: true,
  RUNNING: true,
  OBSERVING: true,
  LOADING: true,
  FAIL: true,
  FAILED: true,
  ERROR: true,
  CONFLICT: true,
  DEGRADED: true,
  UNKNOWN: true,
  IDLE: true,
  UNVERIFIED: true,
  REJECTED: true,
  REGISTERED: true
};

return allowed[status]
  ? status
  : fallback || "UNKNOWN";

}

function methodNames(object) {
var names = [];

if (!object) {
  return names;
}

try {
  Object.getOwnPropertyNames(object).forEach(function inspectOwn(key) {
    try {
      if (isFunction(object[key])) {
        names.push(key);
      }
    } catch (_error) {}
  });

  var prototype =
    Object.getPrototypeOf(object);

  if (prototype) {
    Object.getOwnPropertyNames(prototype).forEach(function inspectPrototype(key) {
      if (
        key !== "constructor" &&
        names.indexOf(key) === -1
      ) {
        try {
          if (isFunction(object[key])) {
            names.push(key);
          }
        } catch (_error) {}
      }
    });
  }
} catch (_error) {}

return names.sort();

}

function getCategory(categoryId) {
return CATEGORY_REGISTRY.find(function findCategory(entry) {
return entry.id === categoryId;
}) || CATEGORY_REGISTRY[0];
}

function getAudit(categoryId, auditId) {
var categoryRecord =
getCategory(categoryId);

return categoryRecord.audits.find(function findAudit(entry) {
  return entry.id === auditId;
}) || categoryRecord.audits[0];

}

function getActiveCategory() {
return getCategory(
state.activeCategoryId
);
}

function getActiveAudit() {
return getAudit(
state.activeCategoryId,
state.activeAuditId
);
}

function getRegistry() {
return (
root.DGB_ENGINE_SUBJECT_REGISTRY ||
root.DGBEngineSubjectRegistry ||
root.DGB_ENGINE_SUBJECTS ||
root.DGB_ENGINE_REGISTRY ||
root.DGB_ENGINE_SUBJECTS_REGISTRY ||
null
);
}

function getEngine() {
return (
root.DGB_ENGINE ||
root.DGBEngine ||
null
);
}

function getConductor() {
return (
root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR ||
readPath("AUDRALIA.diagnosticNorthConductor") ||
readPath("AUDRALIA.diagnostics.northConductor") ||
null
);
}

function resolveTargetRuntime(frameWindow) {
var index;
var globalName;
var candidate;

if (!frameWindow) {
  return {
    runtime: null,
    globalName: null
  };
}

for (
  index = 0;
  index < TARGET_RUNTIME_GLOBALS.length;
  index += 1
) {
  globalName =
    TARGET_RUNTIME_GLOBALS[index];

  candidate =
    frameWindow[globalName];

  if (candidate) {
    return {
      runtime: candidate,
      globalName: globalName
    };
  }
}

return {
  runtime: null,
  globalName: null
};

}

function inspectShellScripts() {
var scripts =
Array.prototype.slice.call(
doc.querySelectorAll(
"script[data-participant-role]"
)
);

return scripts.map(function mapScript(script) {
  return {
    role:
      script.getAttribute(
        "data-participant-role"
      ),

    src:
      script.getAttribute("src"),

    loadOrder:
      Number(
        script.getAttribute(
          "data-load-order"
        )
      ) || null,

    required:
      script.getAttribute(
        "data-participant-required"
      ) !== "false",

    cyclePosition:
      Number(
        script.getAttribute(
          "data-cycle-position"
        )
      ) || null,

    fibonacci:
      script.getAttribute(
        "data-fibonacci"
      ) || null,

    readyState:
      script.readyState || null,

    connected:
      script.isConnected === true
  };
});

}

function resolveParticipant(definition, shellScripts) {
var found =
readFirst(
definition.globalPaths || []
);

var scriptRecord =
  shellScripts.find(function findScript(entry) {
    return entry.role === definition.role;
  }) || null;

var api =
  found.value;

var contract =
  api
    ? firstString(
        api.CONTRACT,
        api.contract
      )
    : null;

var version =
  api
    ? firstString(
        api.VERSION,
        api.version
      )
    : null;

var methods =
  methodNames(api);

var status =
  api
    ? "AVAILABLE"
    : scriptRecord
      ? "HELD"
      : "MISSING";

return deepFreeze({
  role:
    definition.role,

  label:
    definition.label,

  group:
    definition.group,

  file:
    definition.file,

  required:
    definition.required,

  position:
    definition.position,

  fibonacci:
    definition.fibonacci,

  parentPosition:
    definition.parentPosition,

  createsCyclePosition:
    definition.createsCyclePosition,

  shellScriptPresent:
    Boolean(scriptRecord),

  shellScript:
    scriptRecord
      ? frozenClone(scriptRecord)
      : null,

  resolved:
    Boolean(api),

  resolvedGlobal:
    found.path,

  resolutionSource:
    found.value
      ? "DECLARED_GLOBAL"
      : "NOT_FOUND",

  contract:
    contract,

  version:
    version,

  methodCount:
    methods.length,

  methods:
    methods,

  stationId:
    api
      ? firstString(
          api.STATION_ID,
          api.stationId
        )
      : null,

  cyclePosition:
    api
      ? (
          Number(
            api.CYCLE_POSITION ||
            api.cyclePosition
          ) || definition.position
        )
      : definition.position,

  status:
    status,

  observedAt:
    nowIso()
});

}

function buildParticipantSnapshot() {
var shellScripts =
inspectShellScripts();

var records =
  PARTICIPANT_MANIFEST.map(function mapParticipant(definition) {
    return resolveParticipant(
      definition,
      shellScripts
    );
  });

var requiredCount =
  records.filter(function countRequired(record) {
    return record.required;
  }).length;

var optionalCount =
  records.length - requiredCount;

var availableCount =
  records.filter(function countAvailable(record) {
    return record.resolved;
  }).length;

var heldCount =
  records.filter(function countHeld(record) {
    return !record.resolved;
  }).length;

var snapshot = {
  manifest:
    frozenClone(PARTICIPANT_MANIFEST),

  shellScripts:
    frozenClone(shellScripts),

  records:
    frozenClone(records),

  requiredCount:
    requiredCount,

  optionalCount:
    optionalCount,

  availableCount:
    availableCount,

  heldCount:
    heldCount,

  errorCount:
    0,

  observedAt:
    nowIso()
};

state.participants =
  snapshot;

state.drop.participant.status =
  heldCount > 0
    ? "HELD"
    : "READY";

state.drop.participant.availableCount =
  availableCount;

state.drop.participant.heldCount =
  heldCount;

state.drop.participant.lastAction =
  "Participant manifest inspected at " +
  snapshot.observedAt;

return frozenClone(snapshot);

}

function inspectTargetFrameLight() {
var frame =
byId(TARGET_FRAME_ID);

var frameWindow =
  null;

var frameDocument =
  null;

var runtime =
  null;

var runtimeGlobalName =
  null;

var runtimeStatus =
  null;

var runtimeReceiptLight =
  null;

var selectedEvidence =
  null;

var accessible =
  false;

var loaded =
  false;

var routeMatch =
  false;

var targetPath =
  null;

var targetTitle =
  null;

var runtimeCanvasPresent =
  false;

var fallbackCanvasPresent =
  false;

var anyCanvasPresent =
  false;

var readError =
  null;

if (frame) {
  try {
    frameWindow =
      frame.contentWindow || null;

    frameDocument =
      frame.contentDocument ||
      (
        frameWindow
          ? frameWindow.document
          : null
      );

    accessible =
      Boolean(frameDocument);

    loaded =
      Boolean(
        frameDocument &&
        (
          frameDocument.readyState === "interactive" ||
          frameDocument.readyState === "complete"
        )
      );

    if (frameWindow && frameWindow.location) {
      targetPath =
        frameWindow.location.pathname || null;

      routeMatch =
        targetPath === TARGET_ROUTE;
    }

    targetTitle =
      frameDocument && frameDocument.title
        ? frameDocument.title
        : null;

    runtimeCanvasPresent =
      Boolean(
        frameDocument &&
        frameDocument.querySelector(
          "canvas[data-audralia-planet-runtime-canvas]"
        )
      );

    fallbackCanvasPresent =
      Boolean(
        frameDocument &&
        frameDocument.querySelector(
          "canvas[data-audralia-planet-fallback-canvas]"
        )
      );

    anyCanvasPresent =
      Boolean(
        frameDocument &&
        frameDocument.querySelector("canvas")
      );

    var resolvedRuntime =
      resolveTargetRuntime(
        frameWindow
      );

    runtime =
      resolvedRuntime.runtime;

    runtimeGlobalName =
      resolvedRuntime.globalName;

    if (
      runtime &&
      isFunction(runtime.getStatus)
    ) {
      runtimeStatus =
        callSafely(
          runtime,
          "getStatus",
          [],
          null
        );
    }

    if (
      runtime &&
      !isNonemptyObject(runtimeStatus) &&
      isFunction(runtime.getReceiptLight)
    ) {
      runtimeReceiptLight =
        callSafely(
          runtime,
          "getReceiptLight",
          [],
          null
        );
    }

    if (
      !isNonemptyObject(runtimeStatus) &&
      !isNonemptyObject(runtimeReceiptLight) &&
      frameWindow
    ) {
      var publishedReceipt =
        frameWindow.AUDRALIA_PLANET_RUNTIME_RECEIPT ||
        frameWindow.AUDRALIA_PLANET_ROUTE_RECEIPT ||
        null;

      if (isNonemptyObject(publishedReceipt)) {
        runtimeReceiptLight =
          publishedReceipt;
      }
    }

    selectedEvidence =
      isNonemptyObject(runtimeStatus)
        ? runtimeStatus
        : isNonemptyObject(runtimeReceiptLight)
          ? runtimeReceiptLight
          : null;
  } catch (error) {
    accessible =
      false;

    loaded =
      false;

    readError =
      error && error.message
        ? error.message
        : "TARGET_FRAME_LIGHT_READ_FAILED";
  }
}

return deepFreeze({
  framePresent:
    Boolean(frame),

  frameId:
    TARGET_FRAME_ID,

  targetRoute:
    TARGET_ROUTE,

  sameOriginAccessible:
    accessible,

  documentLoaded:
    loaded,

  documentReadyState:
    frameDocument &&
    frameDocument.readyState
      ? frameDocument.readyState
      : null,

  routeMatch:
    routeMatch,

  targetPath:
    targetPath,

  targetTitle:
    targetTitle,

  runtimeGlobalPresent:
    Boolean(runtime),

  runtimeGlobalName:
    runtimeGlobalName,

  acceptedRuntimeGlobals:
    TARGET_RUNTIME_GLOBALS.slice(),

  runtimeStatusMethodPresent:
    Boolean(
      runtime &&
      isFunction(runtime.getStatus)
    ),

  receiptLightMethodPresent:
    Boolean(
      runtime &&
      isFunction(runtime.getReceiptLight)
    ),

  receiptMethodPresent:
    Boolean(
      runtime &&
      isFunction(runtime.getReceipt)
    ),

  runtimeCanvasPresent:
    runtimeCanvasPresent,

  fallbackCanvasPresent:
    fallbackCanvasPresent,

  anyCanvasPresent:
    anyCanvasPresent,

  canvasPresent:
    Boolean(
      runtimeCanvasPresent ||
      fallbackCanvasPresent ||
      anyCanvasPresent
    ),

  targetRuntimeStatus:
    selectedEvidence
      ? frozenClone(selectedEvidence)
      : null,

  runtimeStatus:
    isNonemptyObject(runtimeStatus)
      ? frozenClone(runtimeStatus)
      : null,

  runtimeReceiptLight:
    isNonemptyObject(runtimeReceiptLight)
      ? frozenClone(runtimeReceiptLight)
      : null,

  runtimeEvidenceAvailable:
    isNonemptyObject(selectedEvidence),

  classification:
    isNonemptyObject(selectedEvidence)
      ? "REGISTERED_EXTERNAL_PROVIDER"
      : "UNKNOWN",

  readError:
    readError,

  capturedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
});

}

function inspectTargetFrameFull() {
var light =
inspectTargetFrameLight();

var frame =
  byId(TARGET_FRAME_ID);

var frameWindow =
  null;

var runtime =
  null;

var runtimeReceipt =
  null;

var fullReceiptReadAttempted =
  false;

var fullReceiptReadSucceeded =
  false;

var fullReceiptReadError =
  null;

if (
  frame &&
  light.sameOriginAccessible
) {
  try {
    frameWindow =
      frame.contentWindow || null;

    runtime =
      resolveTargetRuntime(
        frameWindow
      ).runtime;

    if (
      runtime &&
      isFunction(runtime.getReceipt)
    ) {
      fullReceiptReadAttempted =
        true;

      runtimeReceipt =
        callSafely(
          runtime,
          "getReceipt",
          [],
          null
        );

      fullReceiptReadSucceeded =
        isNonemptyObject(
          runtimeReceipt
        );
    }
  } catch (error) {
    fullReceiptReadError =
      error && error.message
        ? error.message
        : "TARGET_FRAME_FULL_RECEIPT_READ_FAILED";
  }
}

return deepFreeze({
  light:
    frozenClone(light),

  runtimeReceipt:
    isNonemptyObject(runtimeReceipt)
      ? frozenClone(runtimeReceipt)
      : null,

  fullReceiptReadAttempted:
    fullReceiptReadAttempted,

  fullReceiptReadSucceeded:
    fullReceiptReadSucceeded,

  fullReceiptReadError:
    fullReceiptReadError,

  capturedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
});

}

function refreshRegistryState() {
var registry =
getRegistry();

var snapshot =
  null;

var receipt =
  null;

var authorityRecords =
  [];

var engineRecords =
  [];

var selectedEngine =
  null;

if (registry) {
  callSafely(
    registry,
    "refresh",
    [],
    null
  );

  snapshot =
    callSafely(
      registry,
      "getSnapshot",
      [],
      null
    );

  receipt =
    callSafely(
      registry,
      "getRegistryReceipt",
      [],
      null
    ) ||
    callSafely(
      registry,
      "getReceipt",
      [],
      null
    ) ||
    root.DGB_ENGINE_REGISTRY_RECEIPT ||
    root.DGB_ENGINE_SUBJECTS_RECEIPT ||
    null;

  authorityRecords =
    callSafely(
      registry,
      "listAuthorities",
      [],
      []
    ) || [];

  engineRecords =
    callSafely(
      registry,
      "listEngines",
      [
        {
          includeReserved: true,
          selectableOnly: false
        }
      ],
      []
    ) || [];

  selectedEngine =
    callSafely(
      registry,
      "getDefaultEngine",
      [],
      null
    );
}

state.observation.registry =
  frozenClone(snapshot);

state.observation.registryReceipt =
  frozenClone(receipt);

state.observation.authorityRecords =
  frozenClone(
    Array.isArray(authorityRecords)
      ? authorityRecords
      : []
  );

state.observation.engineRecords =
  frozenClone(
    Array.isArray(engineRecords)
      ? engineRecords
      : []
  );

state.observation.selectedEngine =
  frozenClone(selectedEngine);

return {
  registryLoaded:
    Boolean(registry),

  snapshot:
    frozenClone(snapshot),

  receipt:
    frozenClone(receipt),

  authorityRecords:
    frozenClone(
      state.observation.authorityRecords
    ),

  engineRecords:
    frozenClone(
      state.observation.engineRecords
    ),

  selectedEngine:
    frozenClone(selectedEngine)
};

}

function inspectEngineState() {
var engine =
getEngine();

var inspection =
  null;

var ops =
  null;

var receipt =
  null;

var instanceId =
  null;

if (engine) {
  var instances =
    callSafely(
      engine,
      "listInstances",
      [
        {
          includeTombstones: false
        }
      ],
      []
    );

  if (Array.isArray(instances) && instances.length) {
    var first =
      instances[0];

    instanceId =
      typeof first === "string"
        ? first
        : first && first.instanceId
          ? first.instanceId
          : first &&
            first.identity &&
            first.identity.instanceId
            ? first.identity.instanceId
            : null;
  }

  inspection =
    callSafely(
      engine,
      "inspect",
      [
        {
          includeInstances: true,
          includeTombstones: false,
          includeAdapters: true,
          includeDiagnostics: false
        }
      ],
      null
    );

  if (instanceId) {
    ops =
      callSafely(
        engine,
        "getOps",
        [instanceId],
        null
      );
  }

  receipt =
    callSafely(
      engine,
      "getRuntimeReceipt",
      [],
      null
    ) ||
    callSafely(
      engine,
      "getReceipt",
      [],
      null
    );
}

state.observation.engineInspection =
  frozenClone(inspection);

state.observation.engineOps =
  frozenClone(ops);

state.observation.engineReceipt =
  frozenClone(receipt);

return {
  engineLoaded:
    Boolean(engine),

  instanceId:
    instanceId,

  inspection:
    frozenClone(inspection),

  ops:
    frozenClone(ops),

  receipt:
    frozenClone(receipt)
};

}

function inspectSurfaceTruth() {
var participantRecord =
state.participants.records.find(function findSurface(record) {
return record.role === "CANVAS_SURFACE_TRUTH";
}) || null;

var authority =
  participantRecord &&
  participantRecord.resolvedGlobal
    ? readPath(
        participantRecord.resolvedGlobal
      )
    : null;

var methods =
  methodNames(authority);

var receipt =
  authority
    ? (
        callSafely(
          authority,
          "getReceipt",
          [],
          null
        ) ||
        authority.RECEIPT ||
        authority.receipt ||
        null
      )
    : null;

var output = {
  authorityPresent:
    Boolean(authority),

  globalPath:
    participantRecord
      ? participantRecord.resolvedGlobal
      : null,

  contract:
    participantRecord
      ? participantRecord.contract
      : null,

  version:
    participantRecord
      ? participantRecord.version
      : null,

  methods:
    methods,

  receipt:
    frozenClone(receipt),

  packetKeys:
    receipt && isObject(receipt)
      ? Object.keys(receipt)
      : [],

  firstHeldCoordinate:
    receipt
      ? firstString(
          receipt.firstHeldCoordinate,
          receipt.heldCoordinate
        )
      : null,

  firstFailedCoordinate:
    receipt
      ? firstString(
          receipt.firstFailedCoordinate,
          receipt.failedCoordinate
        )
      : null,

  recommendedOwner:
    receipt
      ? frozenClone(
          receipt.recommendedOwner ||
          receipt.owner ||
          null
        )
      : null,

  recommendedFile:
    receipt
      ? firstString(
          receipt.recommendedFile,
          receipt.nextFile
        )
      : null,

  recommendedAction:
    receipt
      ? firstString(
          receipt.recommendedAction,
          receipt.nextAction
        )
      : null,

  observedAt:
    nowIso()
};

state.observation.surfaceTruth =
  deepFreeze(output);

return state.observation.surfaceTruth;

}

function observeLightweight() {
var errors = [];

state.drop.observation.status =
  "OBSERVING";

var targetLight =
  inspectTargetFrameLight();

var registry =
  refreshRegistryState();

var engine =
  inspectEngineState();

var surface =
  inspectSurfaceTruth();

if (targetLight.readError) {
  errors.push({
    source: "TARGET_LIGHT",
    message: targetLight.readError,
    capturedAt: nowIso()
  });
}

state.observation.targetLight =
  frozenClone(targetLight);

state.observation.errors =
  frozenClone(errors);

state.observation.observedAt =
  nowIso();

state.drop.observation.status =
  errors.length
    ? "HELD"
    : "READY";

state.drop.observation.availableCount =
  [
    targetLight.framePresent,
    registry.registryLoaded,
    engine.engineLoaded,
    surface.authorityPresent
  ].filter(Boolean).length;

state.drop.observation.heldCount =
  4 -
  state.drop.observation.availableCount;

state.drop.observation.lastAction =
  "Lightweight observation completed at " +
  state.observation.observedAt;

state.updatedAt =
  nowIso();

return frozenClone({
  targetLight: targetLight,
  registry: registry,
  engine: engine,
  surfaceTruth: surface,
  errors: errors,
  observedAt: state.observation.observedAt
});

}

function buildAbsenceList(auditRecord) {
var absence = [];

state.participants.records.forEach(function inspectParticipant(record) {
  if (
    record.required &&
    !record.resolved
  ) {
    absence.push({
      type: "PARTICIPANT",
      code: "REQUIRED_PARTICIPANT_UNRESOLVED",
      role: record.role,
      file: record.file,
      status: record.status
    });
  }
});

if (
  !state.observation.targetLight ||
  !state.observation.targetLight.framePresent
) {
  absence.push({
    type: "TARGET",
    code: "TARGET_FRAME_NOT_OBSERVED",
    route: TARGET_ROUTE
  });
}

if (
  state.observation.targetLight &&
  !state.observation.targetLight.runtimeGlobalPresent
) {
  absence.push({
    type: "RUNTIME",
    code: "TARGET_RUNTIME_GLOBAL_NOT_OBSERVED",
    acceptedGlobals:
      TARGET_RUNTIME_GLOBALS.slice()
  });
}

if (
  !state.observation.surfaceTruth ||
  !state.observation.surfaceTruth.authorityPresent
) {
  absence.push({
    type: "SURFACE_TRUTH",
    code: "SURFACE_TRUTH_AUTHORITY_UNRESOLVED",
    file:
      "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js"
  });
}

if (!state.cycle.ledger) {
  absence.push({
    type: "CYCLE",
    code: "NINE_CYCLE_NOT_EXECUTED"
  });
}

if (
  auditRecord.classification === "DIRECT_EXECUTION" &&
  !state.direct.lastResult
) {
  absence.push({
    type: "DIRECT",
    code: "SELECTED_DIRECT_CHECK_NOT_EXECUTED"
  });
}

return absence;

}

function buildDirectionList(absence, auditRecord) {
var directions = [];

absence.forEach(function mapAbsence(entry) {
  if (
    entry.code ===
    "REQUIRED_PARTICIPANT_UNRESOLVED"
  ) {
    directions.push({
      priority: "HIGH",
      action: "Inspect participant",
      participant: entry.role,
      file: entry.file
    });
  }

  if (
    entry.code ===
    "TARGET_FRAME_NOT_OBSERVED"
  ) {
    directions.push({
      priority: "MEDIUM",
      action: "Open the Target Window and inspect target access",
      route: TARGET_ROUTE
    });
  }

  if (
    entry.code ===
    "TARGET_RUNTIME_GLOBAL_NOT_OBSERVED"
  ) {
    directions.push({
      priority: "HIGH",
      action: "Inspect target runtime publication",
      acceptedGlobals:
        TARGET_RUNTIME_GLOBALS.slice()
    });
  }

  if (
    entry.code ===
    "SURFACE_TRUTH_AUTHORITY_UNRESOLVED"
  ) {
    directions.push({
      priority: "HIGH",
      action: "Inspect the Surface Truth participant",
      file: entry.file
    });
  }

  if (
    entry.code ===
    "NINE_CYCLE_NOT_EXECUTED"
  ) {
    directions.push({
      priority: "OPTIONAL",
      action: "Run Nine-Cycle only when cycle evidence is required",
      audit: "cycleExecution"
    });
  }

  if (
    entry.code ===
    "SELECTED_DIRECT_CHECK_NOT_EXECUTED"
  ) {
    directions.push({
      priority: "OPTIONAL",
      action: "Run the selected direct check explicitly",
      audit: auditRecord.id
    });
  }
});

if (!directions.length) {
  directions.push({
    priority: "LOW",
    action: "Review the current report and select the next audit"
  });
}

return directions;

}

function buildResult(auditRecord, absence) {
var available =
state.participants.availableCount;

var total =
  state.participants.records.length;

if (auditRecord.id === "cycleExecution") {
  return state.cycle.ledger
    ? "The most recent nine-cycle execution produced a compatible diagnostic ledger."
    : "The nine-cycle has not been executed during this session.";
}

if (auditRecord.id === "cycleLedger") {
  return state.cycle.ledger
    ? "A compatible nine-cycle ledger is available."
    : "No compatible nine-cycle ledger is available.";
}

if (auditRecord.id === "targetRuntimeFull") {
  return state.observation.targetFull
    ? "A deliberate full target-runtime observation is available."
    : "No deliberate full target-runtime observation has been captured.";
}

if (auditRecord.id === "deepArchive") {
  return state.archive.deepArchive
    ? "A deep observatory archive is available."
    : "No deep observatory archive has been created.";
}

return (
  "The Audralia diagnostic observatory is available. " +
  String(available) +
  " of " +
  String(total) +
  " declared participants are resolved. " +
  String(absence.length) +
  " absence record" +
  (
    absence.length === 1
      ? " is"
      : "s are"
  ) +
  " currently associated with this report."
);

}

function buildEvidenceSnapshot(auditRecord) {
return deepFreeze({
audit:
frozenClone(auditRecord),

  controller: {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    initialized: state.initialized,
    bootedAt: state.bootedAt,
    updatedAt: state.updatedAt
  },

  shell: {
    htmlContract: HTML_CONTRACT,
    cssContract: CSS_CONTRACT,
    blueprint: BLUEPRINT,
    prebuildRegistry: PREBUILD_REGISTRY,
    route: DIAGNOSTIC_ROUTE,
    targetRoute: TARGET_ROUTE
  },

  participants:
    frozenClone(state.participants),

  observation:
    frozenClone(state.observation),

  direct:
    frozenClone(state.direct),

  cycle:
    frozenClone(state.cycle),

  archive: {
    reportCount:
      state.archive.reports.length,

    directResultCount:
      state.archive.directResults.length,

    cycleRunCount:
      state.archive.cycleRuns.length,

    errorCount:
      state.archive.errors.length
  },

  noClaims:
    NO_CLAIMS,

  capturedAt:
    nowIso()
});

}

function buildReadInterpretation(
auditRecord,
evidence,
absence,
direction
) {
return deepFreeze({
schema:
READ_SCHEMA,

  result:
    buildResult(
      auditRecord,
      absence
    ),

  evidence: [
    {
      label: "Controller",
      value:
        CONTRACT
    },
    {
      label: "Resolved participants",
      value:
        String(
          state.participants.availableCount
        ) +
        " of " +
        String(
          state.participants.records.length
        )
    },
    {
      label: "Target frame",
      value:
        state.observation.targetLight &&
        state.observation.targetLight.framePresent
          ? "Present"
          : "Not observed"
    },
    {
      label: "Runtime global",
      value:
        state.observation.targetLight &&
        state.observation.targetLight.runtimeGlobalName
          ? state.observation.targetLight.runtimeGlobalName
          : "Not observed"
    },
    {
      label: "Cycle ledger",
      value:
        state.cycle.ledger
          ? state.cycle.ledger.ledgerHash ||
            "Available"
          : "Not available"
    },
    {
      label: "Evidence hash",
      value:
        hashObject(evidence)
    }
  ],

  absence:
    frozenClone(absence),

  direction:
    frozenClone(direction),

  generatedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
});

}

function composeReadableReport(report) {
var lines = [
"AUDRALIA DROP WITH READ DIAGNOSTIC REPORT",
"REPORT_ID=" + report.reportId,
"SCHEMA=" + report.schema,
"CLASSIFICATION=" + report.classification,
"CATEGORY=" + report.category.label,
"AUDIT=" + report.audit.label,
"CREATED_AT=" + report.createdAt,
"",
"RESULT",
report.read.result,
"",
"EVIDENCE"
];

report.read.evidence.forEach(function addEvidence(entry) {
  lines.push(
    "- " +
    String(entry.label) +
    ": " +
    String(entry.value)
  );
});

lines.push("");
lines.push("ABSENCE");

if (report.read.absence.length) {
  report.read.absence.forEach(function addAbsence(entry) {
    lines.push(
      "- " +
      String(entry.code || entry.type || "UNKNOWN")
    );
  });
} else {
  lines.push("- No absence records.");
}

lines.push("");
lines.push("DIRECTION");

report.read.direction.forEach(function addDirection(entry) {
  lines.push(
    "- " +
    String(entry.action || "Review current evidence")
  );
});

lines.push("");
lines.push("BOUNDARY");
lines.push(
  "Diagnostic-only. Read-only. No production mutation, runtime restart, renderer mutation, repair, readiness claim, visual-pass claim, cycle-pass claim, F21 claim, or synthetic evidence."
);

return lines.join("\n");

}

function buildReport() {
var categoryRecord =
getActiveCategory();

var auditRecord =
  getActiveAudit();

var evidence =
  buildEvidenceSnapshot(
    auditRecord
  );

var absence =
  buildAbsenceList(
    auditRecord
  );

var direction =
  buildDirectionList(
    absence,
    auditRecord
  );

var read =
  buildReadInterpretation(
    auditRecord,
    evidence,
    absence,
    direction
  );

var report = {
  schema:
    REPORT_SCHEMA,

  reportId:
    "AUDRALIA_DROP_READ_REPORT_" +
    Date.now(),

  classification:
    auditRecord.classification,

  category:
    frozenClone(categoryRecord),

  audit:
    frozenClone(auditRecord),

  createdAt:
    nowIso(),

  controllerContract:
    CONTRACT,

  htmlContract:
    HTML_CONTRACT,

  cssContract:
    CSS_CONTRACT,

  diagnosticRoute:
    DIAGNOSTIC_ROUTE,

  targetRoute:
    TARGET_ROUTE,

  read:
    read,

  evidence:
    evidence,

  directResult:
    frozenClone(
      state.direct.lastResult
    ),

  cycleLedger:
    frozenClone(
      state.cycle.ledger
    ),

  cycleReceipts:
    frozenClone(
      state.cycle.receipts
    ),

  noClaims:
    NO_CLAIMS
};

report.reportHash =
  hashObject(report);

return deepFreeze(report);

}

function createReport() {
/*
* Synchronous nonblocking report law.
*
* No polling.
* No waiting.
* No conductor call.
* No station call.
* No full target receipt call.
*/
var report =
buildReport();

state.report.current =
  report;

state.report.readableText =
  composeReadableReport(
    report
  );

state.report.packetText =
  safeJson({
    schema: report.schema,
    reportId: report.reportId,
    classification: report.classification,
    category: report.category,
    audit: report.audit,
    createdAt: report.createdAt,
    read: report.read,
    reportHash: report.reportHash
  });

state.report.rawText =
  safeJson(report);

state.report.evidence =
  frozenClone(
    report.read.evidence
  );

state.report.sessionReports.push(
  report
);

state.drop.report.status =
  "READY";

state.drop.report.availableCount =
  state.report.sessionReports.length;

state.drop.report.heldCount =
  0;

state.drop.report.lastAction =
  "Report created at " +
  report.createdAt;

state.updatedAt =
  nowIso();

publishDiagnosticOutputs();
renderWorkbench();

toast(
  "Report created."
);

return frozenClone(report);

}

function targetRuntimeAdmissionState(snapshot) {
var light =
snapshot && snapshot.light
? snapshot.light
: snapshot || {};

var status =
  light &&
  isNonemptyObject(
    light.targetRuntimeStatus
  )
    ? light.targetRuntimeStatus
    : {};

var detail =
  status &&
  isObject(status.statusDetail)
    ? status.statusDetail
    : {};

var mounted =
  firstBoolean(
    status.mounted,
    detail.mounted
  );

var stageRectNonzero =
  firstBoolean(
    status.stageRectNonzero,
    status.surfaceNonzero,
    detail.stageRectNonzero,
    detail.surfaceNonzero
  );

var geometryReady =
  firstBoolean(
    status.geometryReady,
    detail.geometryReady
  );

var firstFrameDrawn =
  firstBoolean(
    status.firstFrameDrawn,
    status.firstFrameSubmitted,
    status.firstFramePresented,
    detail.firstFrameDrawn,
    detail.firstFrameSubmitted,
    detail.firstFramePresented
  );

var visiblePixelObserved =
  firstBoolean(
    status.firstVisiblePixelObserved,
    status.visiblePixelObserved,
    detail.firstVisiblePixelObserved,
    detail.visiblePixelObserved
  );

var fallbackActive =
  firstBoolean(
    status.fallbackActive,
    detail.fallbackActive
  );

var primaryVisible =
  mounted === true &&
  stageRectNonzero === true &&
  geometryReady === true &&
  firstFrameDrawn === true &&
  visiblePixelObserved === true;

var fallbackVisible =
  fallbackActive === true &&
  firstFrameDrawn === true &&
  visiblePixelObserved === true;

return deepFreeze({
  mounted:
    mounted,

  stageRectNonzero:
    stageRectNonzero,

  geometryReady:
    geometryReady,

  firstFrameDrawn:
    firstFrameDrawn,

  visiblePixelObserved:
    visiblePixelObserved,

  fallbackActive:
    fallbackActive,

  primaryVisible:
    primaryVisible,

  fallbackVisible:
    fallbackVisible,

  surfaceTruthCurrentlyAdmissible:
    Boolean(
      primaryVisible ||
      fallbackVisible
    ),

  controllerAdmissionBoundarySatisfied:
    Boolean(
      light.framePresent &&
      light.sameOriginAccessible &&
      light.documentLoaded &&
      light.runtimeGlobalPresent &&
      light.runtimeEvidenceAvailable &&
      (
        primaryVisible ||
        fallbackVisible
      )
    )
});

}

function waitForTargetRuntimeEvidence() {
var startedAt =
Date.now();

var attempts =
  [];

function sample() {
  var light =
    inspectTargetFrameLight();

  var admission =
    targetRuntimeAdmissionState(
      light
    );

  var elapsedMs =
    Date.now() - startedAt;

  var progress = {
    schema:
      "AUDRALIA_DIAGNOSTIC_TARGET_RUNTIME_PREFLIGHT_PROGRESS_v1",

    cycleId:
      state.cycle.cycleId,

    attempt:
      attempts.length + 1,

    elapsedMs:
      elapsedMs,

    timeoutMs:
      TARGET_RUNTIME_WAIT_TIMEOUT_MS,

    light:
      frozenClone(light),

    admission:
      frozenClone(admission),

    generatedAt:
      nowIso()
  };

  attempts.push(progress);

  state.cycle.preflightProgress =
    frozenClone(progress);

  renderExecutionState();

  if (
    admission.controllerAdmissionBoundarySatisfied
  ) {
    return Promise.resolve(
      finalizePreflight(
        "ADMITTED",
        true,
        false,
        "F8_SURFACE_TRUTH_BOUNDARY_SATISFIED",
        startedAt,
        attempts,
        light,
        admission
      )
    );
  }

  if (
    elapsedMs >=
    TARGET_RUNTIME_WAIT_TIMEOUT_MS
  ) {
    return Promise.resolve(
      finalizePreflight(
        "TIMED_OUT",
        false,
        true,
        "F8_SURFACE_TRUTH_NOT_AVAILABLE_WITHIN_BOUND",
        startedAt,
        attempts,
        light,
        admission
      )
    );
  }

  return delay(
    TARGET_RUNTIME_WAIT_INTERVAL_MS
  ).then(sample);
}

return sample();

}

function finalizePreflight(
status,
admitted,
timedOut,
reason,
startedAt,
attempts,
lastLightSnapshot,
lastAdmission
) {
var fullSnapshot =
inspectTargetFrameFull();

var receipt = {
  schema:
    "AUDRALIA_DIAGNOSTIC_TARGET_RUNTIME_PREFLIGHT_v2",

  contract:
    CONTRACT,

  cycleId:
    state.cycle.cycleId,

  status:
    status,

  admitted:
    admitted,

  timedOut:
    timedOut,

  reason:
    reason,

  pollIntervalMs:
    TARGET_RUNTIME_WAIT_INTERVAL_MS,

  timeoutMs:
    TARGET_RUNTIME_WAIT_TIMEOUT_MS,

  elapsedMs:
    Date.now() - startedAt,

  attemptCount:
    attempts.length,

  finalLightSnapshot:
    frozenClone(
      lastLightSnapshot
    ),

  finalFullSnapshot:
    frozenClone(
      fullSnapshot
    ),

  admission:
    frozenClone(
      lastAdmission
    ),

  attempts:
    frozenClone(
      attempts
    ),

  generatedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
};

receipt.preflightHash =
  hashObject(receipt);

return deepFreeze(receipt);

}

function resolveStationApi(definition) {
var found =
readFirst(
definition.globalPaths || []
);

return {
  api:
    found.value,

  globalPath:
    found.path,

  source:
    found.value
      ? "DECLARED_GLOBAL"
      : "NOT_FOUND"
};

}

function makeHeldReceipt(
definition,
code,
summary,
detail
) {
return deepFreeze({
schema:
RECEIPT_SCHEMA,

  cycleId:
    state.cycle.cycleId,

  position:
    definition.position,

  stationId:
    definition.stationId,

  fibonacci:
    definition.fibonacci,

  contract:
    CONTRACT,

  version:
    VERSION,

  file:
    FILE,

  status:
    "HOLD",

  completed:
    false,

  handoffEligible:
    false,

  summary:
    summary,

  observations:
    [],

  evidence:
    [],

  issues: [
    {
      code:
        code,

      path:
        definition.stationId,

      detail:
        detail || summary
    }
  ],

  firstHeldCoordinate:
    definition.stationId,

  firstFailedCoordinate:
    null,

  firstConflictCoordinate:
    null,

  generatedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
});

}

function makeHeldReceipts(
code,
summary,
detail
) {
return STATIONS.map(function mapHeld(definition) {
return makeHeldReceipt(
definition,
code,
summary,
detail
);
});
}

function extractReceipts(result) {
var candidates;
var index;

if (Array.isArray(result)) {
  return result;
}

if (!isObject(result)) {
  return [];
}

candidates = [
  result.receipts,
  result.stationReceipts,
  result.cycleReceipts,
  result.ledger && result.ledger.receipts,
  result.ledger && result.ledger.stationReceipts,
  result.result && result.result.receipts,
  result.result && result.result.stationReceipts,
  result.packet && result.packet.receipts,
  result.packet && result.packet.stationReceipts,
  result.cycleReceipt && result.cycleReceipt.receipts,
  result.cycleReceipt && result.cycleReceipt.stationReceipts
];

for (
  index = 0;
  index < candidates.length;
  index += 1
) {
  if (Array.isArray(candidates[index])) {
    return candidates[index];
  }
}

return [];

}

function normalizeReceipt(
receipt,
definition,
index
) {
var source =
isObject(receipt)
? receipt
: {};

var stationDefinition =
  definition ||
  STATIONS[index];

return deepFreeze({
  schema:
    source.schema ||
    RECEIPT_SCHEMA,

  cycleId:
    source.cycleId ||
    state.cycle.cycleId,

  position:
    Number(
      source.position ||
      stationDefinition.position
    ),

  stationId:
    source.stationId ||
    stationDefinition.stationId,

  fibonacci:
    source.fibonacci ||
    stationDefinition.fibonacci,

  contract:
    source.contract ||
    "UNKNOWN_STATION_CONTRACT",

  previousContract:
    source.previousContract ||
    null,

  version:
    source.version ||
    "UNKNOWN",

  file:
    source.file ||
    stationDefinition.file,

  status:
    normalizeStatus(
      source.status,
      "HOLD"
    ),

  completed:
    source.completed === true,

  handoffEligible:
    source.handoffEligible === true,

  summary:
    firstString(
      source.summary,
      "No station summary was supplied."
    ),

  observations:
    Array.isArray(source.observations)
      ? frozenClone(source.observations)
      : [],

  evidence:
    Array.isArray(source.evidence)
      ? frozenClone(source.evidence)
      : [],

  issues:
    Array.isArray(source.issues)
      ? frozenClone(source.issues)
      : [],

  firstHeldCoordinate:
    source.firstHeldCoordinate ||
    null,

  firstFailedCoordinate:
    source.firstFailedCoordinate ||
    null,

  firstConflictCoordinate:
    source.firstConflictCoordinate ||
    null,

  recommendedOwner:
    frozenClone(
      source.recommendedOwner ||
      null
    ),

  generatedAt:
    source.generatedAt ||
    nowIso(),

  noClaims:
    isObject(source.noClaims)
      ? frozenClone(source.noClaims)
      : NO_CLAIMS,

  raw:
    frozenClone(source)
});

}

function normalizeConductorResult(result) {
var receipts =
extractReceipts(result);

var normalized = [];

if (!receipts.length) {
  return {
    conductorResult:
      frozenClone(result),

    receipts:
      makeHeldReceipts(
        "CONDUCTOR_RETURNED_NO_RECEIPTS",
        "The North conductor returned no station receipts.",
        "No receipt collection could be extracted from the conductor result."
      )
  };
}

STATIONS.forEach(function normalizeExpectedStation(definition, index) {
  var matching =
    receipts.find(function findMatching(receipt) {
      return (
        receipt &&
        receipt.stationId === definition.stationId
      );
    }) ||
    receipts[index] ||
    null;

  if (!matching) {
    normalized.push(
      makeHeldReceipt(
        definition,
        "STATION_RECEIPT_MISSING",
        "The North conductor did not return this station receipt.",
        "Expected station receipt was absent from the conductor result."
      )
    );

    return;
  }

  normalized.push(
    normalizeReceipt(
      matching,
      definition,
      index
    )
  );
});

return {
  conductorResult:
    frozenClone(result),

  receipts:
    normalized
};

}

function buildConductorRequest() {
return deepFreeze({
schema:
CONDUCTOR_REQUEST_SCHEMA,

  cycleId:
    state.cycle.cycleId,

  mode:
    "AUDIT",

  targetRoute:
    TARGET_ROUTE,

  diagnosticRoute:
    DIAGNOSTIC_ROUTE,

  subject: {
    subjectId:
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",

    subjectType:
      "THREE_D_DIAGNOSTIC_ROUTE",

    contract:
      CONTRACT,

    version:
      VERSION,

    file:
      FILE
  },

  engine: {
    contract:
      CORE_ENGINE_CONTRACT,

    governingContract:
      GOVERNING_ENGINE_CONTRACT,

    registryContract:
      REGISTRY_CONTRACT,

    selectedEngine:
      frozenClone(
        state.observation.selectedEngine
      ),

    inspection:
      frozenClone(
        state.observation.engineInspection
      ),

    receipt:
      frozenClone(
        state.observation.engineReceipt
      )
  },

  target:
    frozenClone(
      state.cycle.preflight &&
      state.cycle.preflight.finalFullSnapshot
        ? state.cycle.preflight.finalFullSnapshot
        : state.observation.targetLight
    ),

  targetPreflight:
    frozenClone(
      state.cycle.preflight
    ),

  requestedStartPosition:
    1,

  generatedAt:
    nowIso(),

  noClaims:
    NO_CLAIMS
});

}

function invokeConductor(request) {
var conductor =
getConductor();

if (!conductor) {
  return Promise.resolve({
    conductorResult: null,
    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_UNAVAILABLE",
        "The North conductor is unavailable.",
        "No compatible North-conductor authority global was found."
      )
  });
}

if (!isFunction(conductor.createCycle)) {
  return Promise.resolve({
    conductorResult:
      frozenClone(conductor),

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_CREATE_CYCLE_UNAVAILABLE",
        "The North conductor does not expose createCycle().",
        "The installed conductor requires the canonical createCycle() path."
      )
  });
}

var cycle;

try {
  cycle =
    conductor.createCycle(
      request
    );
} catch (error) {
  return Promise.resolve({
    conductorResult: {
      stage: "CREATE_CYCLE",
      error:
        String(
          error &&
          error.message
            ? error.message
            : error
        )
    },

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_CREATE_CYCLE_THROW",
        "The North conductor could not create the diagnostic cycle.",
        String(
          error &&
          error.message
            ? error.message
            : error
        )
      )
  });
}

if (
  cycle &&
  (
    Array.isArray(cycle.receipts) ||
    Array.isArray(cycle.stationReceipts)
  )
) {
  return Promise.resolve(
    normalizeConductorResult(cycle)
  );
}

if (
  !cycle ||
  !isFunction(cycle.registerStation) ||
  !isFunction(cycle.seal) ||
  !isFunction(cycle.run) ||
  !isFunction(cycle.getReceipt)
) {
  return Promise.resolve({
    conductorResult:
      frozenClone(cycle),

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_CYCLE_API_INCOMPATIBLE",
        "The North conductor created an incompatible cycle.",
        "The cycle must expose registerStation(), seal(), run(), and getReceipt()."
      )
  });
}

state.cycle.stationRegistrations = [];
state.cycle.auxiliaryRegistrations = [];

STATIONS.forEach(function registerStation(definition) {
  var resolved =
    resolveStationApi(
      definition
    );

  var outcome;

  if (!resolved.api) {
    outcome = {
      position:
        definition.position,

      stationId:
        definition.stationId,

      file:
        definition.file,

      status:
        "REJECTED",

      reason:
        "STATION_GLOBAL_NOT_FOUND",

      globalPath:
        null,

      generatedAt:
        nowIso()
    };
  } else {
    try {
      var registration =
        cycle.registerStation(
          definition.position,
          resolved.api
        );

      outcome = {
        position:
          definition.position,

        stationId:
          definition.stationId,

        file:
          definition.file,

        status:
          registration &&
          registration.status
            ? registration.status
            : "UNKNOWN",

        reason:
          registration &&
          registration.reason
            ? registration.reason
            : null,

        issues:
          registration &&
          registration.issues
            ? frozenClone(
                registration.issues
              )
            : [],

        globalPath:
          resolved.globalPath,

        generatedAt:
          nowIso()
      };
    } catch (error) {
      outcome = {
        position:
          definition.position,

        stationId:
          definition.stationId,

        file:
          definition.file,

        status:
          "REJECTED",

        reason:
          "STATION_REGISTRATION_THROW",

        detail:
          String(
            error &&
            error.message
              ? error.message
              : error
          ),

        globalPath:
          resolved.globalPath,

        generatedAt:
          nowIso()
      };
    }
  }

  state.cycle.stationRegistrations.push(
    deepFreeze(outcome)
  );
});

var pointer =
  state.participants.records.find(function findPointer(record) {
    return record.role === "SOUTH_SURFACE_POINTER";
  });

if (
  pointer &&
  pointer.resolved &&
  isFunction(cycle.registerAuxiliary)
) {
  try {
    var auxiliaryRegistration =
      cycle.registerAuxiliary(
        8,
        {
          role:
            "SOUTH_SURFACE_POINTER",

          file:
            pointer.file,

          contract:
            pointer.contract,

          version:
            pointer.version,

          globalPath:
            pointer.resolvedGlobal,

          createsCyclePosition:
            false
        }
      );

    state.cycle.auxiliaryRegistrations.push(
      deepFreeze({
        parentPosition: 8,
        role: "SOUTH_SURFACE_POINTER",
        file: pointer.file,
        status:
          auxiliaryRegistration &&
          auxiliaryRegistration.status
            ? auxiliaryRegistration.status
            : "UNKNOWN",
        generatedAt: nowIso()
      })
    );
  } catch (error) {
    state.cycle.auxiliaryRegistrations.push(
      deepFreeze({
        parentPosition: 8,
        role: "SOUTH_SURFACE_POINTER",
        file: pointer.file,
        status: "NOT_REGISTERED",
        reason: "AUXILIARY_REGISTRATION_THROW",
        detail:
          String(
            error &&
            error.message
              ? error.message
              : error
          ),
        generatedAt: nowIso()
      })
    );
  }
}

var sealReceipt;

try {
  sealReceipt =
    cycle.seal();
} catch (error) {
  return Promise.resolve({
    conductorResult: {
      stage: "SEAL",
      error:
        String(
          error &&
          error.message
            ? error.message
            : error
        ),
      stationRegistrations:
        frozenClone(
          state.cycle.stationRegistrations
        )
    },

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_SEAL_THROW",
        "The North conductor could not seal the diagnostic cycle.",
        String(
          error &&
          error.message
            ? error.message
            : error
        )
      )
  });
}

return Promise.resolve(
  cycle.run()
)
  .then(function conductorRunResolved(result) {
    var receipt =
      isObject(result)
        ? result
        : cycle.getReceipt();

    state.cycle.conductorReceipt =
      frozenClone(receipt);

    state.cycle.conductorState =
      frozenClone(
        isFunction(cycle.getState)
          ? cycle.getState()
          : null
      );

    return normalizeConductorResult({
      schema:
        "AUDRALIA_DIAGNOSTIC_ROUTE_CONDUCTOR_RESULT_v3",

      cycleReceipt:
        receipt,

      stationReceipts:
        receipt &&
        Array.isArray(receipt.stationReceipts)
          ? receipt.stationReceipts
          : extractReceipts(receipt),

      sealReceipt:
        sealReceipt,

      state:
        state.cycle.conductorState,

      targetPreflight:
        frozenClone(
          state.cycle.preflight
        ),

      stationRegistrations:
        frozenClone(
          state.cycle.stationRegistrations
        ),

      auxiliaryRegistrations:
        frozenClone(
          state.cycle.auxiliaryRegistrations
        )
    });
  })
  .catch(function conductorRunRejected(error) {
    return {
      conductorResult: {
        stage: "RUN",
        error:
          String(
            error &&
            error.message
              ? error.message
              : error
          )
      },

      receipts:
        makeHeldReceipts(
          "NORTH_CONDUCTOR_RUN_REJECTED",
          "The North conductor rejected the diagnostic cycle.",
          String(
            error &&
            error.message
              ? error.message
              : error
          )
        )
    };
  });

}

function composeLedger() {
function count(statuses) {
return state.cycle.receipts.filter(function countReceipt(receipt) {
return statuses.indexOf(receipt.status) !== -1;
}).length;
}

var passCount =
  count(["PASS", "COMPLETE"]);

var holdCount =
  count([
    "HOLD",
    "HELD",
    "PARTIAL_PASS",
    "UNVERIFIED"
  ]);

var failCount =
  count(["FAIL", "FAILED"]);

var conflictCount =
  count(["CONFLICT"]);

var errorCount =
  count(["ERROR"]);

var degradedCount =
  count(["DEGRADED"]);

var terminalReceipt =
  state.cycle.receipts.length
    ? state.cycle.receipts[
        state.cycle.receipts.length - 1
      ]
    : null;

var overallStatus =
  errorCount > 0
    ? "ERROR"
    : conflictCount > 0
      ? "CONFLICT"
      : failCount > 0
        ? "FAIL"
        : degradedCount > 0
          ? "DEGRADED"
          : holdCount > 0
            ? "HOLD"
            : (
                passCount ===
                state.cycle.receipts.length &&
                state.cycle.receipts.length > 0
              )
              ? "PASS"
              : "HOLD";

var ledger = {
  schema:
    LEDGER_SCHEMA,

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

  cycleId:
    state.cycle.cycleId,

  generatedAt:
    nowIso(),

  targetRoute:
    TARGET_ROUTE,

  orchestrationOwner:
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",

  orchestrationMethod:
    "createCycle",

  runPhase:
    state.cycle.runPhase,

  targetRuntimePreflight:
    frozenClone(
      state.cycle.preflight
    ),

  receiptCount:
    state.cycle.receipts.length,

  passCount:
    passCount,

  holdCount:
    holdCount,

  failCount:
    failCount,

  conflictCount:
    conflictCount,

  errorCount:
    errorCount,

  degradedCount:
    degradedCount,

  overallStatus:
    overallStatus,

  terminalStatus:
    terminalReceipt
      ? terminalReceipt.status
      : "UNKNOWN",

  terminalSummary:
    terminalReceipt
      ? terminalReceipt.summary
      : "No terminal receipt was returned.",

  stationRegistrations:
    frozenClone(
      state.cycle.stationRegistrations
    ),

  auxiliaryRegistrations:
    frozenClone(
      state.cycle.auxiliaryRegistrations
    ),

  conductorState:
    frozenClone(
      state.cycle.conductorState
    ),

  conductorReceipt:
    frozenClone(
      state.cycle.conductorReceipt
    ),

  conductorResult:
    frozenClone(
      state.cycle.conductorResult
    ),

  receipts:
    frozenClone(
      state.cycle.receipts
    ),

  noClaims:
    NO_CLAIMS
};

ledger.ledgerHash =
  hashObject(ledger);

return deepFreeze(ledger);

}

function runNineCycle() {
if (state.cycle.running) {
return Promise.resolve(
frozenClone(
state.cycle.ledger
)
);
}

state.cycle.running =
  true;

state.cycle.cycleId =
  "AUDRALIA_DIAGNOSTIC_CYCLE_" +
  Date.now();

state.cycle.runPhase =
  "WAITING_FOR_TARGET";

state.cycle.preflight =
  null;

state.cycle.preflightProgress =
  null;

state.cycle.stationRegistrations =
  [];

state.cycle.auxiliaryRegistrations =
  [];

state.cycle.conductorResult =
  null;

state.cycle.conductorReceipt =
  null;

state.cycle.conductorState =
  null;

state.cycle.receipts =
  [];

state.cycle.ledger =
  null;

state.cycle.readerReport =
  "";

state.cycle.lastError =
  null;

state.drop.direct.status =
  "RUNNING";

state.drop.direct.lastAction =
  "Nine-cycle execution started.";

renderExecutionState();

buildParticipantSnapshot();
observeLightweight();

return waitForTargetRuntimeEvidence()
  .then(function preflightResolved(preflight) {
    state.cycle.preflight =
      frozenClone(preflight);

    state.observation.targetFull =
      frozenClone(
        preflight.finalFullSnapshot
      );

    state.cycle.runPhase =
      "RUNNING_CONDUCTOR";

    renderExecutionState();

    return invokeConductor(
      buildConductorRequest()
    );
  })
  .then(function cycleResolved(normalized) {
    state.cycle.conductorResult =
      normalized.conductorResult;

    state.cycle.receipts =
      normalized.receipts;

    state.cycle.runPhase =
      "FINALIZING";

    state.cycle.ledger =
      composeLedger();

    state.cycle.readerReport =
      safeJson(
        state.cycle.ledger
      );

    state.cycle.lastRunAt =
      nowIso();

    state.archive.cycleRuns.push(
      deepFreeze({
        cycleId:
          state.cycle.cycleId,

        preflight:
          frozenClone(
            state.cycle.preflight
          ),

        ledger:
          frozenClone(
            state.cycle.ledger
          ),

        receipts:
          frozenClone(
            state.cycle.receipts
          ),

        archivedAt:
          nowIso()
      })
    );

    state.drop.direct.status =
      "IDLE";

    state.drop.direct.availableCount =
      1;

    state.drop.direct.heldCount =
      state.cycle.ledger &&
      state.cycle.ledger.overallStatus !== "PASS"
        ? 1
        : 0;

    state.drop.direct.lastAction =
      "Nine-cycle execution completed at " +
      state.cycle.lastRunAt;

    state.cycle.running =
      false;

    state.cycle.runPhase =
      "IDLE";

    observeLightweight();
    createReport();
    renderWorkbench();

    toast(
      state.cycle.ledger.overallStatus === "PASS"
        ? "Nine-cycle completed."
        : "Nine-cycle completed with held or attention evidence."
    );

    return frozenClone(
      state.cycle.ledger
    );
  })
  .catch(function cycleRejected(error) {
    state.cycle.lastError =
      String(
        error &&
        error.message
          ? error.message
          : error
      );

    state.cycle.receipts =
      makeHeldReceipts(
        "DIAGNOSTIC_CONTROLLER_UNEXPECTED_ERROR",
        "The observatory controller could not complete the nine-cycle.",
        state.cycle.lastError
      );

    state.cycle.ledger =
      composeLedger();

    state.cycle.running =
      false;

    state.cycle.runPhase =
      "IDLE";

    state.drop.direct.status =
      "HELD";

    state.drop.direct.heldCount =
      1;

    state.drop.direct.lastAction =
      "Nine-cycle execution held after controller error.";

    state.archive.errors.push(
      deepFreeze({
        type: "CYCLE",
        message: state.cycle.lastError,
        capturedAt: nowIso()
      })
    );

    createReport();
    renderWorkbench();

    toast(
      "Nine-cycle held after controller error."
    );

    return frozenClone(
      state.cycle.ledger
    );
  });

}

function runSelectedDirectCheck() {
var auditRecord =
getActiveAudit();

if (state.direct.running) {
  return Promise.resolve(
    frozenClone(
      state.direct.lastResult
    )
  );
}

state.direct.running =
  true;

state.drop.direct.status =
  "RUNNING";

state.drop.direct.lastAction =
  "Direct check started: " +
  auditRecord.label;

renderExecutionState();

return Promise.resolve()
  .then(function executeDirectCheck() {
    var result;

    if (
      auditRecord.id === "targetRuntimeFull" ||
      auditRecord.id === "runtimeObservationDirect"
    ) {
      result =
        inspectTargetFrameFull();

      state.observation.targetFull =
        frozenClone(result);
    } else if (
      auditRecord.id === "registryRefreshDirect"
    ) {
      result =
        refreshRegistryState();
    } else if (
      auditRecord.id === "surfaceTruthPacket" ||
      auditRecord.id === "surfaceTruthDirect"
    ) {
      var surface =
        state.observation.surfaceTruth ||
        inspectSurfaceTruth();

      var authority =
        surface.globalPath
          ? readPath(surface.globalPath)
          : null;

      var preferredMethods = [
        "getReceipt",
        "getPacket",
        "inspect",
        "read",
        "probe"
      ];

      var selectedMethod =
        preferredMethods.find(function findMethod(name) {
          return (
            authority &&
            isFunction(authority[name])
          );
        }) || null;

      if (!selectedMethod) {
        throw new Error(
          "NO_VERIFIED_SURFACE_TRUTH_READ_METHOD"
        );
      }

      state.direct.selectedAuthority =
        surface.globalPath;

      state.direct.selectedMethod =
        selectedMethod;

      result =
        authority[selectedMethod]();
    } else {
      throw new Error(
        "DIRECT_CHECK_NOT_AVAILABLE_FOR_SELECTED_AUDIT"
      );
    }

    var record =
      deepFreeze({
        audit:
          frozenClone(auditRecord),

        authority:
          state.direct.selectedAuthority,

        method:
          state.direct.selectedMethod,

        result:
          frozenClone(result),

        executedAt:
          nowIso(),

        status:
          "COMPLETE",

        noClaims:
          NO_CLAIMS
      });

    state.direct.lastResult =
      record;

    state.direct.lastError =
      null;

    state.direct.history.push(
      record
    );

    state.archive.directResults.push(
      record
    );

    state.drop.direct.status =
      "IDLE";

    state.drop.direct.availableCount =
      state.direct.history.length;

    state.drop.direct.heldCount =
      0;

    state.drop.direct.lastAction =
      "Direct check completed at " +
      record.executedAt;

    return record;
  })
  .catch(function directCheckRejected(error) {
    var errorRecord =
      deepFreeze({
        audit:
          frozenClone(auditRecord),

        message:
          String(
            error &&
            error.message
              ? error.message
              : error
          ),

        executedAt:
          nowIso(),

        status:
          "ERROR"
      });

    state.direct.lastError =
      errorRecord;

    state.archive.errors.push(
      errorRecord
    );

    state.drop.direct.status =
      "HELD";

    state.drop.direct.heldCount =
      1;

    state.drop.direct.lastAction =
      "Direct check held: " +
      errorRecord.message;

    return errorRecord;
  })
  .then(function finalizeDirectCheck(record) {
    state.direct.running =
      false;

    observeLightweight();
    createReport();
    renderWorkbench();

    toast(
      record.status === "COMPLETE"
        ? "Direct check completed."
        : "Direct check held."
    );

    return frozenClone(record);
  });

}

function createDeepArchive() {
var archive = {
schema:
ARCHIVE_SCHEMA,

  contract:
    CONTRACT,

  blueprint:
    BLUEPRINT,

  createdAt:
    nowIso(),

  controllerState:
    getPublicState(),

  reports:
    frozenClone(
      state.report.sessionReports
    ),

  directResults:
    frozenClone(
      state.direct.history
    ),

  cycleRuns:
    frozenClone(
      state.archive.cycleRuns
    ),

  errors:
    frozenClone(
      state.archive.errors
    ),

  participantSnapshots:
    frozenClone(
      state.archive.participantSnapshots
    ),

  observationSnapshots:
    frozenClone(
      state.archive.observationSnapshots
    ),

  boundaries:
    NO_CLAIMS
};

archive.archiveHash =
  hashObject(archive);

state.archive.deepArchive =
  deepFreeze(archive);

state.archive.updatedAt =
  nowIso();

renderArchiveChamber();

toast(
  "Deep archive created."
);

return frozenClone(
  state.archive.deepArchive
);

}

function addCurrentReportToArchive() {
if (!state.report.current) {
toast(
"Create a report first."
);

  return null;
}

state.archive.reports.push(
  state.report.current
);

state.archive.updatedAt =
  nowIso();

renderArchiveChamber();

toast(
  "Report added to archive."
);

return frozenClone(
  state.report.current
);

}

function copyText(text, message) {
if (!text) {
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
      toast(message || "Copied.");
    })
    .catch(function clipboardRejected() {
      fallbackCopy(text, message);
    });

  return;
}

fallbackCopy(text, message);

}

function fallbackCopy(text, message) {
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

try {
  doc.execCommand("copy");
  toast(message || "Copied.");
} catch (_error) {
  toast("Copy unavailable.");
}

doc.body.removeChild(area);

}

function selectCategory(categoryId) {
var categoryRecord =
getCategory(categoryId);

state.activeCategoryId =
  categoryRecord.id;

state.activeAuditId =
  categoryRecord.audits[0].id;

renderSelectors();
renderSelectedAudit();

}

function selectAudit(auditId) {
var auditRecord =
getAudit(
state.activeCategoryId,
auditId
);

state.activeAuditId =
  auditRecord.id;

renderSelectors();
renderSelectedAudit();

}

function selectParticipant(role) {
state.activeParticipantRole =
role;

renderParticipantDetail();

}

function selectReportMode(mode) {
state.activeReportMode =
mode;

renderReportModes();

}

function selectObservationLens(lens) {
state.activeObservationLens =
lens;

renderObservationLensTabs();

}

function selectInstrumentChamber(chamber) {
state.activeInstrumentChamber =
chamber;

renderInstrumentDeckTabs();

}

function renderDropRail() {
renderLane(
"dropDirect",
state.drop.direct
);

renderLane(
  "dropReport",
  state.drop.report
);

renderLane(
  "dropObservation",
  state.drop.observation
);

renderLane(
  "dropParticipant",
  state.drop.participant
);

}

function renderLane(prefix, lane) {
setText(
prefix + "State",
lane.status
);

setText(
  prefix + "AvailableCount",
  lane.availableCount
);

setText(
  prefix + "HeldCount",
  lane.heldCount
);

setText(
  prefix + "LastAction",
  lane.lastAction ||
  "No action recorded."
);

setStatus(
  prefix + "Cell",
  lane.status
);

}

function renderEvidenceRail() {
var target =
state.observation.targetLight;

setText(
  "targetStatus",
  "Target · " +
  (
    target && target.framePresent
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "targetStatus",
  target && target.framePresent
    ? "FOUND"
    : "UNKNOWN"
);

setText(
  "runtimeStatus",
  "Runtime · " +
  (
    target && target.runtimeGlobalPresent
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "runtimeStatus",
  target && target.runtimeGlobalPresent
    ? "FOUND"
    : "UNKNOWN"
);

setText(
  "surfaceStatus",
  "Surface · " +
  (
    state.observation.surfaceTruth &&
    state.observation.surfaceTruth.authorityPresent
      ? "Found"
      : "Held"
  )
);

setStatus(
  "surfaceStatus",
  state.observation.surfaceTruth &&
  state.observation.surfaceTruth.authorityPresent
    ? "FOUND"
    : "HELD"
);

setText(
  "cycleStatus",
  "Cycle · " +
  (
    state.cycle.ledger
      ? state.cycle.ledger.overallStatus
      : "Not Run"
  )
);

setStatus(
  "cycleStatus",
  state.cycle.ledger
    ? state.cycle.ledger.overallStatus
    : "NOT_RUN"
);

setText(
  "registryStatus",
  "Registry · " +
  (
    getRegistry()
      ? "Found"
      : "Held"
  )
);

setStatus(
  "registryStatus",
  getRegistry()
    ? "FOUND"
    : "HELD"
);

var groups = {
  north: [
    "NORTH_CONDUCTOR",
    "NORTH_PROBE_INTAKE"
  ],
  east: [
    "EAST_PROBE_SOURCE",
    "EAST_CONSTRUCTION_INTERPRETATION"
  ],
  west: [
    "WEST_PROBE_RUNTIME",
    "WEST_RUNTIME_INTERPRETATION"
  ],
  south: [
    "SOUTH_PROBE_HANDOFF",
    "SOUTH_RESTITUTION_INTERPRETATION",
    "SOUTH_SURFACE_POINTER"
  ]
};

Object.keys(groups).forEach(function renderGroup(key) {
  var allFound =
    groups[key].every(function everyRole(role) {
      var record =
        state.participants.records.find(function findRecord(entry) {
          return entry.role === role;
        });

      return Boolean(
        record &&
        record.resolved
      );
    });

  setText(
    key + "Status",
    key.charAt(0).toUpperCase() +
    key.slice(1) +
    " · " +
    (
      allFound
        ? "Found"
        : "Held"
    )
  );

  setStatus(
    key + "Status",
    allFound
      ? "FOUND"
      : "HELD"
  );
});

setText(
  "frameStatus",
  "Frame · " +
  (
    target &&
    target.documentLoaded
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "frameStatus",
  target &&
  target.documentLoaded
    ? "FOUND"
    : "UNKNOWN"
);

setText(
  "canvasStatus",
  "Canvas · " +
  (
    target &&
    target.canvasPresent
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "canvasStatus",
  target &&
  target.canvasPresent
    ? "FOUND"
    : "UNKNOWN"
);

var runtimeStatus =
  target &&
  target.targetRuntimeStatus
    ? target.targetRuntimeStatus
    : {};

var mounted =
  firstBoolean(
    runtimeStatus.mounted,
    runtimeStatus.statusDetail &&
    runtimeStatus.statusDetail.mounted
  );

setText(
  "mountStatus",
  "Mount · " +
  (
    mounted === true
      ? "Found"
      : mounted === false
        ? "Held"
        : "Unknown"
  )
);

setStatus(
  "mountStatus",
  mounted === true
    ? "FOUND"
    : mounted === false
      ? "HELD"
      : "UNKNOWN"
);

}

function renderSelectors() {
var categoryRecord =
getActiveCategory();

var auditRecord =
  getActiveAudit();

setText(
  "categorySelectorLabel",
  categoryRecord.label
);

setText(
  "categorySelectorMeta",
  String(categoryRecord.audits.length) +
  " audits"
);

setText(
  "auditSelectorLabel",
  auditRecord.label
);

setText(
  "auditSelectorMeta",
  auditRecord.classification.replace(/_/g, " ")
);

var auditMenu =
  byId("auditSelectorMenu");

if (auditMenu) {
  auditMenu.innerHTML =
    categoryRecord.audits
      .map(function renderAuditOption(entry) {
        return (
          '<button type="button" role="option" aria-selected="' +
          (
            entry.id === auditRecord.id
              ? "true"
              : "false"
          ) +
          '" data-audit-id="' +
          escapeHtml(entry.id) +
          '">' +
          "<strong>" +
          escapeHtml(entry.label) +
          "</strong>" +
          "<span>" +
          escapeHtml(entry.summary) +
          "</span>" +
          "</button>"
        );
      })
      .join("");
}

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-category-id]"
  )
).forEach(function updateCategoryOption(button) {
  button.setAttribute(
    "aria-selected",
    button.getAttribute("data-category-id") ===
    categoryRecord.id
      ? "true"
      : "false"
  );
});

wireDynamicAuditOptions();

}

function renderSelectedAudit() {
var categoryRecord =
getActiveCategory();

var auditRecord =
  getActiveAudit();

setText(
  "selectedCategoryLabel",
  categoryRecord.label
);

setText(
  "selectedAuditTitle",
  auditRecord.label
);

setText(
  "selectedAuditSummary",
  auditRecord.summary
);

setText(
  "selectedAuditClassification",
  auditRecord.classification
);

setText(
  "activeAuditMode",
  auditRecord.classification
);

var index =
  categoryRecord.audits.indexOf(
    auditRecord
  ) + 1;

setText(
  "selectedAuditSequence",
  "AUDIT " +
  String(index).padStart(2, "0")
);

setHidden(
  "runDirectCheck",
  auditRecord.classification !==
  "DIRECT_EXECUTION"
);

setHidden(
  "runNineCycle",
  auditRecord.classification !==
  "CYCLE_EXECUTION"
);

}

function renderParticipantConstellation() {
var list =
byId("participantList");

if (!list) {
  return;
}

setText(
  "dropParticipantAvailableCount",
  state.participants.availableCount
);

setText(
  "dropParticipantHeldCount",
  state.participants.heldCount
);

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-participant-summary]"
  )
).forEach(function renderSummaryValue(node) {
  var key =
    node.getAttribute(
      "data-participant-summary"
    );

  if (key === "required") {
    node.textContent =
      state.participants.requiredCount;
  }

  if (key === "optional") {
    node.textContent =
      state.participants.optionalCount;
  }

  if (key === "available") {
    node.textContent =
      state.participants.availableCount;
  }

  if (key === "held") {
    node.textContent =
      state.participants.heldCount;
  }
});

list.innerHTML =
  state.participants.records
    .filter(function excludeEngine(record) {
      return (
        record.group !== "ENGINE"
      );
    })
    .map(function renderParticipant(record) {
      return (
        '<article class="participant-node" tabindex="0" role="button" ' +
        'data-participant-role="' +
        escapeHtml(record.role) +
        '" data-required="' +
        String(record.required) +
        '" data-status="' +
        escapeHtml(record.status) +
        '">' +
        "<div>" +
        "<strong>" +
        escapeHtml(
          record.fibonacci
            ? record.fibonacci +
              " · " +
              record.label
            : record.label
        ) +
        "</strong>" +
        "<span>" +
        escapeHtml(
          record.required
            ? "Required"
            : "Optional"
        ) +
        " · " +
        escapeHtml(record.file) +
        "</span>" +
        "</div>" +
        "<small>" +
        escapeHtml(record.status) +
        "</small>" +
        "</article>"
      );
    })
    .join("");

wireParticipantNodes();
renderParticipantDetail();

}

function renderParticipantDetail() {
var detail =
byId("participantDetail");

if (!detail) {
  return;
}

var record =
  state.participants.records.find(function findSelected(entry) {
    return (
      entry.role ===
      state.activeParticipantRole
    );
  }) || null;

if (!record) {
  detail.innerHTML =
    "<h3>Select a participant</h3>" +
    "<p>Participant inspection reveals file, requirement, alias, contract, version, position, and callable methods without execution.</p>";

  return;
}

detail.innerHTML =
  "<h3>" +
  escapeHtml(record.label) +
  "</h3>" +
  "<p><strong>Status:</strong> " +
  escapeHtml(record.status) +
  "</p>" +
  "<p><strong>File:</strong> " +
  escapeHtml(record.file) +
  "</p>" +
  "<p><strong>Resolved global:</strong> " +
  escapeHtml(record.resolvedGlobal || "Not resolved") +
  "</p>" +
  "<p><strong>Contract:</strong> " +
  escapeHtml(record.contract || "Unknown") +
  "</p>" +
  "<p><strong>Version:</strong> " +
  escapeHtml(record.version || "Unknown") +
  "</p>" +
  "<p><strong>Methods:</strong> " +
  escapeHtml(
    record.methods.length
      ? record.methods.join(", ")
      : "None observed"
  ) +
  "</p>";

}

function renderReadReport() {
var report =
state.report.current;

if (!report) {
  return;
}

setHtml(
  "readResult",
  renderReadRegion(
    "R",
    "Result",
    report.read.result
  )
);

setHtml(
  "readEvidence",
  renderReadRegion(
    "E",
    "Evidence",
    report.read.evidence
      .map(function mapEvidence(entry) {
        return (
          String(entry.label) +
          ": " +
          String(entry.value)
        );
      })
      .join("\n")
  )
);

setHtml(
  "readAbsence",
  renderReadRegion(
    "A",
    "Absence",
    report.read.absence.length
      ? report.read.absence
          .map(function mapAbsence(entry) {
            return (
              entry.code ||
              entry.type ||
              "UNKNOWN"
            );
          })
          .join("\n")
      : "No absence records."
  )
);

setHtml(
  "readDirection",
  renderReadRegion(
    "D",
    "Direction",
    report.read.direction
      .map(function mapDirection(entry) {
        return (
          entry.action ||
          "Review current evidence"
        );
      })
      .join("\n")
  )
);

}

function renderReadRegion(letter, label, content) {
var paragraphs =
String(content || "")
.split("\n")
.filter(Boolean);

return (
  "<header>" +
  "<span>" +
  escapeHtml(letter) +
  "</span>" +
  "<div>" +
  "<p>" +
  escapeHtml(label) +
  "</p>" +
  "<strong>" +
  escapeHtml(
    paragraphs[0] ||
    "No current entry"
  ) +
  "</strong>" +
  "</div>" +
  "</header>" +
  (
    paragraphs.length > 1
      ? "<ul>" +
        paragraphs
          .slice(1)
          .map(function renderParagraph(entry) {
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
          paragraphs[0] ||
          "No current entry"
        ) +
        "</p>"
  )
);

}

function renderReportChamber() {
var report =
state.report.current;

setDisabled(
  "copyReadableReport",
  !report
);

setDisabled(
  "copyPacketReport",
  !report
);

setDisabled(
  "copyRawReport",
  !report
);

setDisabled(
  "addReportToArchive",
  !report
);

if (!report) {
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

  return;
}

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
  report.audit.label
);

setText(
  "reportCreatedAt",
  report.createdAt
);

setText(
  "reportMeta",
  report.reportId +
  " · " +
  report.reportHash
);

setText(
  "packetOutput",
  state.report.packetText
);

setText(
  "rawOutput",
  state.report.rawText
);

setHtml(
  "evidenceOutput",
  report.read.evidence
    .map(function renderEvidence(entry) {
      return (
        "<article>" +
        "<h3>" +
        escapeHtml(entry.label) +
        "</h3>" +
        "<p>" +
        escapeHtml(entry.value) +
        "</p>" +
        "</article>"
      );
    })
    .join("")
);

renderReadReport();

}

function renderReportModes() {
var modes = [
"read",
"packet",
"raw",
"evidence"
];

modes.forEach(function toggleMode(mode) {
  var button =
    byId(
      "report" +
      mode.charAt(0).toUpperCase() +
      mode.slice(1) +
      "Button"
    );

  var panel =
    byId(
      "report" +
      mode.charAt(0).toUpperCase() +
      mode.slice(1) +
      "Panel"
    );

  if (button) {
    button.setAttribute(
      "aria-selected",
      mode === state.activeReportMode
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      mode !== state.activeReportMode;
  }
});

}

function renderObservationLens() {
var target =
state.observation.targetLight;

var runtimeStatus =
  target &&
  target.targetRuntimeStatus
    ? target.targetRuntimeStatus
    : {};

var detail =
  runtimeStatus &&
  runtimeStatus.statusDetail
    ? runtimeStatus.statusDetail
    : {};

setText(
  "targetFramePresent",
  target
    ? yesNoUnknown(
        target.framePresent
      )
    : "Unknown"
);

setText(
  "targetSameOrigin",
  target
    ? yesNoUnknown(
        target.sameOriginAccessible
      )
    : "Unknown"
);

setText(
  "targetDocumentState",
  target &&
  target.documentReadyState
    ? target.documentReadyState
    : "Unknown"
);

setText(
  "targetRouteMatch",
  target
    ? yesNoUnknown(
        target.routeMatch
      )
    : "Unknown"
);

setText(
  "targetPath",
  target &&
  target.targetPath
    ? target.targetPath
    : TARGET_ROUTE
);

setText(
  "targetTitle",
  target &&
  target.targetTitle
    ? target.targetTitle
    : "Unknown"
);

setText(
  "targetAccessError",
  target &&
  target.readError
    ? target.readError
    : "None observed"
);

setText(
  "runtimeGlobal",
  target &&
  target.runtimeGlobalName
    ? target.runtimeGlobalName
    : "Unknown"
);

setText(
  "runtimeMounted",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.mounted,
      detail.mounted
    )
  )
);

setText(
  "runtimeGeometry",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.geometryReady,
      detail.geometryReady
    )
  )
);

setText(
  "runtimeStageRect",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.stageRectNonzero,
      runtimeStatus.surfaceNonzero,
      detail.stageRectNonzero,
      detail.surfaceNonzero
    )
  )
);

setText(
  "runtimeFirstFrame",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.firstFrameDrawn,
      runtimeStatus.firstFrameSubmitted,
      runtimeStatus.firstFramePresented,
      detail.firstFrameDrawn,
      detail.firstFrameSubmitted,
      detail.firstFramePresented
    )
  )
);

setText(
  "runtimeVisiblePixel",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.visiblePixelObserved,
      runtimeStatus.firstVisiblePixelObserved,
      detail.visiblePixelObserved,
      detail.firstVisiblePixelObserved
    )
  )
);

setText(
  "runtimeFallback",
  yesNoUnknown(
    firstBoolean(
      runtimeStatus.fallbackActive,
      detail.fallbackActive
    )
  )
);

setText(
  "runtimeReceiptAvailability",
  target
    ? (
        target.receiptMethodPresent
          ? "Full receipt available"
          : target.receiptLightMethodPresent
            ? "Light receipt available"
            : "No receipt method observed"
      )
    : "Unknown"
);

var surface =
  state.observation.surfaceTruth;

setText(
  "surfaceAuthority",
  surface &&
  surface.globalPath
    ? surface.globalPath
    : "Unknown"
);

setText(
  "surfaceMethod",
  surface &&
  surface.methods.length
    ? surface.methods.join(", ")
    : "Unknown"
);

setText(
  "surfaceContract",
  surface &&
  surface.contract
    ? surface.contract
    : "Unknown"
);

setText(
  "surfaceReceipt",
  surface &&
  surface.receipt
    ? "Available"
    : "Unknown"
);

setText(
  "surfacePacketKeys",
  surface &&
  surface.packetKeys.length
    ? surface.packetKeys.join(", ")
    : "Unknown"
);

setText(
  "surfaceFirstHeld",
  surface &&
  surface.firstHeldCoordinate
    ? surface.firstHeldCoordinate
    : "Unknown"
);

setText(
  "surfaceFirstFailed",
  surface &&
  surface.firstFailedCoordinate
    ? surface.firstFailedCoordinate
    : "Unknown"
);

setText(
  "surfaceRecommendedOwner",
  surface &&
  surface.recommendedOwner
    ? safeJson(
        surface.recommendedOwner
      )
    : "Unknown"
);

setText(
  "surfaceRecommendedFile",
  surface &&
  surface.recommendedFile
    ? surface.recommendedFile
    : "Unknown"
);

setText(
  "surfaceRecommendedAction",
  surface &&
  surface.recommendedAction
    ? surface.recommendedAction
    : "Unknown"
);

setText(
  "surfaceError",
  surface &&
  surface.error
    ? surface.error
    : "None observed"
);

renderObservationLensTabs();

}

function yesNoUnknown(value) {
return value === true
? "Yes"
: value === false
? "No"
: "Unknown";
}

function renderObservationLensTabs() {
var map = {
target: "targetLens",
runtime: "runtimeLens",
surface: "surfaceLens",
window: "targetWindow"
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
      key === state.activeObservationLens
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      key !== state.activeObservationLens;
  }
});

}

function renderCycleChamber() {
var ledger =
state.cycle.ledger;

setText(
  "cyclePreviewSummary",
  ""
);

setText(
  "cycleLedgerOutput",
  ledger
    ? safeJson(ledger)
    : "No cycle ledger has been produced."
);

var list =
  byId("cycleReceiptList");

if (list) {
  list.innerHTML =
    state.cycle.receipts.length
      ? state.cycle.receipts
          .map(function renderReceipt(receipt) {
            return (
              "<article>" +
              "<h4>" +
              escapeHtml(
                receipt.fibonacci +
                " · " +
                receipt.stationId
              ) +
              "</h4>" +
              "<p>" +
              escapeHtml(receipt.status) +
              "</p>" +
              "<p>" +
              escapeHtml(receipt.summary) +
              "</p>" +
              "</article>"
            );
          })
          .join("")
      : '<article class="empty-state"><h4>No cycle receipts</h4><p>Run Nine-Cycle explicitly to create station receipts.</p></article>';
}

STATIONS.forEach(function renderStation(definition) {
  var node =
    doc.querySelector(
      '[data-station="' +
      definition.stationId +
      '"]'
    );

  var receipt =
    state.cycle.receipts.find(function findReceipt(entry) {
      return entry.stationId === definition.stationId;
    });

  if (node) {
    setStatus(
      node,
      receipt
        ? receipt.status
        : "UNKNOWN"
    );
  }
});

var execution =
  byId("cycleExecutionSummary");

if (execution) {
  execution.innerHTML =
    "<span>Execution</span>" +
    "<strong>" +
    escapeHtml(
      ledger
        ? ledger.overallStatus
        : state.cycle.running
          ? state.cycle.runPhase
          : "Not run"
    ) +
    "</strong>" +
    "<p>" +
    escapeHtml(
      ledger
        ? ledger.terminalSummary
        : state.cycle.running
          ? "The explicit nine-cycle is in progress."
          : "No conductor cycle has been created during this session."
    ) +
    "</p>";
}

}

function renderRegistryChamber() {
var snapshot =
state.observation.registry || {};

var authorityRecords =
  state.observation.authorityRecords || [];

var engineRecords =
  state.observation.engineRecords || [];

setText(
  "governingContractCount",
  Number(
    snapshot.authorityCount ||
    snapshot.governingAuthorityCount ||
    authorityRecords.length ||
    0
  )
);

setText(
  "assignedEngineCount",
  Number(
    snapshot.assignedEngineCount ||
    engineRecords.filter(function countAssigned(record) {
      return !record.reserved;
    }).length ||
    0
  )
);

setText(
  "selectableEngineCount",
  Number(
    snapshot.selectableEngineCount ||
    engineRecords.filter(function countSelectable(record) {
      return record.selectable;
    }).length ||
    0
  )
);

setText(
  "reservedEngineCount",
  Number(
    snapshot.reservedEngineCount ||
    engineRecords.filter(function countReserved(record) {
      return record.reserved;
    }).length ||
    0
  )
);

var list =
  byId("registryRecordList");

if (list) {
  var records =
    authorityRecords.concat(engineRecords);

  list.innerHTML =
    records.length
      ? records
          .map(function renderRecord(record) {
            return (
              "<article>" +
              "<h4>" +
              escapeHtml(
                record.authorityName ||
                record.engineName ||
                record.authorityId ||
                record.engineId ||
                "Registry Record"
              ) +
              "</h4>" +
              "<p>Status: " +
              escapeHtml(
                record.status ||
                "UNKNOWN"
              ) +
              "</p>" +
              "<p>File: " +
              escapeHtml(
                record.file ||
                "Not declared"
              ) +
              "</p>" +
              "</article>"
            );
          })
          .join("")
      : '<article class="empty-state"><h4>Registry not observed</h4><p>No registry records are currently available.</p></article>';
}

setHtml(
  "selectedEngineDetail",
  "<h4>Selected Engine</h4><pre>" +
  escapeHtml(
    safeJson(
      state.observation.selectedEngine
    )
  ) +
  "</pre>"
);

setHtml(
  "engineRuntimeDetail",
  "<h4>Runtime Evidence</h4><pre>" +
  escapeHtml(
    safeJson({
      inspection:
        state.observation.engineInspection,
      ops:
        state.observation.engineOps,
      receipt:
        state.observation.engineReceipt
    })
  ) +
  "</pre>"
);

}

function renderReceiptChamber() {
var receipts = [];

state.cycle.receipts.forEach(function addCycleReceipt(receipt) {
  receipts.push({
    type: "cycle",
    label:
      receipt.fibonacci +
      " · " +
      receipt.stationId,
    record:
      receipt
  });
});

state.direct.history.forEach(function addDirectReceipt(record) {
  receipts.push({
    type: "direct",
    label:
      record.audit.label,
    record:
      record
  });
});

state.archive.errors.forEach(function addErrorReceipt(record) {
  receipts.push({
    type: "error",
    label:
      record.message ||
      record.type ||
      "Error",
    record:
      record
  });
});

var list =
  byId("receiptList");

if (!list) {
  return;
}

list.innerHTML =
  receipts.length
    ? receipts
        .map(function renderReceipt(entry, index) {
          return (
            '<article tabindex="0" role="button" data-receipt-index="' +
            String(index) +
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
    : '<article class="empty-state"><h4>No receipts collected</h4><p>Reports, direct checks, observations, and cycle execution may contribute receipts.</p></article>';

}

function renderArchiveChamber() {
var count =
state.archive.reports.length +
state.archive.directResults.length +
state.archive.cycleRuns.length +
state.archive.errors.length;

setText(
  "archiveSessionCount",
  count
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
              report.audit.label
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
    : '<article class="empty-state"><h4>No archived reports</h4><p>Create a report and add it to the archive.</p></article>'
);

setHtml(
  "archiveErrorList",
  state.archive.errors.length
    ? state.archive.errors
        .map(function renderArchivedError(error) {
          return (
            "<article>" +
            "<h4>Error</h4>" +
            "<p>" +
            escapeHtml(
              error.message ||
              safeJson(error)
            ) +
            "</p>" +
            "</article>"
          );
        })
        .join("")
    : '<article class="empty-state"><h4>No archived errors</h4><p>No controller, participant, observation, direct, or cycle errors have been archived.</p></article>'
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

function renderBoundaryChamber() {
setStatus(
"boundaryChamber",
"ACTIVE"
);
}

function renderInstrumentDeckTabs() {
var map = {
cycle: "cycleChamber",
registry: "registryChamber",
receipts: "receiptChamber",
archive: "archiveChamber",
boundary: "boundaryChamber"
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
      key === state.activeInstrumentChamber
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      key !== state.activeInstrumentChamber;
  }
});

}

function renderExecutionState() {
var controllerState =
byId("controllerState");

if (state.cycle.running) {
  setText(
    "controllerState",
    state.cycle.runPhase
  );

  setStatus(
    controllerState,
    "RUNNING"
  );
} else if (state.direct.running) {
  setText(
    "controllerState",
    "EXECUTING"
  );

  setStatus(
    controllerState,
    "RUNNING"
  );
} else {
  setText(
    "controllerState",
    "REPORT READY"
  );

  setStatus(
    controllerState,
    "READY"
  );
}

setDisabled(
  "runDirectCheck",
  state.direct.running ||
  state.cycle.running
);

setDisabled(
  "runNineCycle",
  state.direct.running ||
  state.cycle.running
);

}

function renderWorkbench() {
renderDropRail();
renderEvidenceRail();
renderSelectors();
renderSelectedAudit();
renderParticipantConstellation();
renderReportChamber();
renderReportModes();
renderObservationLens();
renderCycleChamber();
renderRegistryChamber();
renderReceiptChamber();
renderArchiveChamber();
renderBoundaryChamber();
renderInstrumentDeckTabs();
renderExecutionState();
}

function resetCurrentReport() {
state.report.current =
null;

state.report.readableText =
  "";

state.report.packetText =
  "";

state.report.rawText =
  "";

state.report.evidence =
  [];

renderWorkbench();

toast(
  "Current report reset."
);

}

function resetWorkbench() {
state.report.current =
null;

state.report.readableText =
  "";

state.report.packetText =
  "";

state.report.rawText =
  "";

state.report.evidence =
  [];

state.direct.lastResult =
  null;

state.direct.lastError =
  null;

state.cycle.preflight =
  null;

state.cycle.preflightProgress =
  null;

state.cycle.stationRegistrations =
  [];

state.cycle.auxiliaryRegistrations =
  [];

state.cycle.conductorResult =
  null;

state.cycle.conductorReceipt =
  null;

state.cycle.conductorState =
  null;

state.cycle.receipts =
  [];

state.cycle.ledger =
  null;

state.cycle.readerReport =
  "";

state.cycle.lastError =
  null;

state.drop.direct =
  laneState("IDLE");

state.drop.report =
  laneState("READY");

state.drop.observation =
  laneState("OBSERVING");

state.drop.participant =
  laneState("LOADING");

buildParticipantSnapshot();
observeLightweight();
renderWorkbench();

toast(
  "Workbench reset."
);

}

function toggleSelector(buttonId, menuId) {
var button =
byId(buttonId);

var menu =
  byId(menuId);

if (!button || !menu) {
  return;
}

var willOpen =
  menu.hidden;

closeAllSelectors();

menu.hidden =
  !willOpen;

button.setAttribute(
  "aria-expanded",
  willOpen
    ? "true"
    : "false"
);

}

function closeAllSelectors() {
[
["categorySelectorButton", "categorySelectorMenu"],
["auditSelectorButton", "auditSelectorMenu"]
].forEach(function closePair(pair) {
var button =
byId(pair[0]);

  var menu =
    byId(pair[1]);

  if (button) {
    button.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  if (menu) {
    menu.hidden =
      true;
  }
});

}

function wireDynamicAuditOptions() {
Array.prototype.slice.call(
doc.querySelectorAll(
"[data-audit-id]"
)
).forEach(function bindAuditOption(button) {
if (button.__audraliaBound) {
return;
}

  button.__audraliaBound =
    true;

  button.addEventListener(
    "click",
    function chooseAudit() {
      selectAudit(
        button.getAttribute(
          "data-audit-id"
        )
      );

      closeAllSelectors();
    }
  );
});

}

function wireParticipantNodes() {
Array.prototype.slice.call(
doc.querySelectorAll(
".participant-node[data-participant-role]"
)
).forEach(function bindParticipant(node) {
if (node.__audraliaBound) {
return;
}

  node.__audraliaBound =
    true;

  function chooseParticipant() {
    selectParticipant(
      node.getAttribute(
        "data-participant-role"
      )
    );
  }

  node.addEventListener(
    "click",
    chooseParticipant
  );

  node.addEventListener(
    "keydown",
    function participantKeydown(event) {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        chooseParticipant();
      }
    }
  );
});

}

function wireTabs() {
Array.prototype.slice.call(
doc.querySelectorAll(
"[data-left-orbit-view]"
)
).forEach(function bindLeftOrbit(button) {
button.addEventListener(
"click",
function switchLeftOrbit() {
var view =
button.getAttribute(
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
      ).forEach(function updateButton(other) {
        other.setAttribute(
          "aria-selected",
          other === button
            ? "true"
            : "false"
        );
      });
    }
  );
});

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-report-mode]"
  )
).forEach(function bindReportMode(button) {
  button.addEventListener(
    "click",
    function chooseReportMode() {
      selectReportMode(
        button.getAttribute(
          "data-report-mode"
        )
      );
    }
  );
});

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-observation-lens]"
  )
).forEach(function bindObservationLens(button) {
  button.addEventListener(
    "click",
    function chooseObservationLens() {
      selectObservationLens(
        button.getAttribute(
          "data-observation-lens"
        )
      );
    }
  );
});

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-instrument-chamber]"
  )
).forEach(function bindInstrumentChamber(button) {
  button.addEventListener(
    "click",
    function chooseInstrumentChamber() {
      selectInstrumentChamber(
        button.getAttribute(
          "data-instrument-chamber"
        )
      );
    }
  );
});

}

function wireUi() {
byId("categorySelectorButton")
.addEventListener(
"click",
function openCategorySelector() {
toggleSelector(
"categorySelectorButton",
"categorySelectorMenu"
);
}
);

byId("auditSelectorButton")
  .addEventListener(
    "click",
    function openAuditSelector() {
      toggleSelector(
        "auditSelectorButton",
        "auditSelectorMenu"
      );
    }
  );

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-category-id]"
  )
).forEach(function bindCategoryOption(button) {
  button.addEventListener(
    "click",
    function chooseCategory() {
      selectCategory(
        button.getAttribute(
          "data-category-id"
        )
      );

      closeAllSelectors();
    }
  );
});

byId("createReport")
  .addEventListener(
    "click",
    createReport
  );

byId("runDirectCheck")
  .addEventListener(
    "click",
    runSelectedDirectCheck
  );

byId("runNineCycle")
  .addEventListener(
    "click",
    runNineCycle
  );

byId("copyReadableReport")
  .addEventListener(
    "click",
    function copyReadable() {
      copyText(
        state.report.readableText,
        "Readable report copied."
      );
    }
  );

byId("copyPacketReport")
  .addEventListener(
    "click",
    function copyPacket() {
      copyText(
        state.report.packetText,
        "Report packet copied."
      );
    }
  );

byId("copyRawReport")
  .addEventListener(
    "click",
    function copyRaw() {
      copyText(
        state.report.rawText,
        "Raw report copied."
      );
    }
  );

byId("addReportToArchive")
  .addEventListener(
    "click",
    addCurrentReportToArchive
  );

byId("resetCurrentReport")
  .addEventListener(
    "click",
    resetCurrentReport
  );

byId("resetWorkbench")
  .addEventListener(
    "click",
    resetWorkbench
  );

byId("createDeepArchive")
  .addEventListener(
    "click",
    createDeepArchive
  );

byId("reloadObservatory")
  .addEventListener(
    "click",
    function reloadObservatory() {
      root.location.reload();
    }
  );

byId("toggleObservationTarget")
  .addEventListener(
    "click",
    function toggleObservationTarget() {
      state.targetVisible =
        !state.targetVisible;

      state.activeObservationLens =
        state.targetVisible
          ? "window"
          : "target";

      byId("toggleObservationTarget")
        .setAttribute(
          "aria-expanded",
          state.targetVisible
            ? "true"
            : "false"
        );

      setText(
        "toggleObservationTarget",
        state.targetVisible
          ? "Hide Target"
          : "Show Target"
      );

      renderObservationLensTabs();
    }
  );

byId("expandTargetWindow")
  .addEventListener(
    "click",
    function expandTargetWindow() {
      state.targetExpanded =
        !state.targetExpanded;

      var targetWindow =
        byId("targetWindow");

      targetWindow.classList.toggle(
        "is-expanded",
        state.targetExpanded
      );

      byId("expandTargetWindow")
        .setAttribute(
          "aria-pressed",
          state.targetExpanded
            ? "true"
            : "false"
        );

      setText(
        "expandTargetWindow",
        state.targetExpanded
          ? "Collapse"
          : "Expand"
      );
    }
  );

byId("reloadTargetFrame")
  .addEventListener(
    "click",
    function reloadTargetFrame() {
      var frame =
        byId(TARGET_FRAME_ID);

      if (frame) {
        frame.src =
          TARGET_ROUTE +
          "?diagnosticReload=" +
          Date.now();
      }
    }
  );

byId(TARGET_FRAME_ID)
  .addEventListener(
    "load",
    function targetFrameLoaded() {
      observeLightweight();
      renderWorkbench();
    }
  );

doc.addEventListener(
  "click",
  function closeMenusOnOutsideClick(event) {
    if (
      !event.target.closest(
        ".custom-selector"
      )
    ) {
      closeAllSelectors();
    }
  }
);

wireTabs();
wireDynamicAuditOptions();

}

function publishDiagnosticOutputs() {
root.AUDRALIA_DROP_WITH_READ_CURRENT_REPORT =
state.report.current;

root.AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER =
  state.cycle.ledger;

root.AUDRALIA_DIAGNOSTIC_READER_REPORT =
  state.cycle.readerReport;

root.AUDRALIA_DIAGNOSTIC_TARGET_RUNTIME_PREFLIGHT =
  state.cycle.preflight;

root.AUDRALIA_DROP_WITH_READ_DEEP_ARCHIVE =
  state.archive.deepArchive;

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

  bootedAt:
    state.bootedAt,

  updatedAt:
    state.updatedAt,

  activeCategoryId:
    state.activeCategoryId,

  activeAuditId:
    state.activeAuditId,

  activeParticipantRole:
    state.activeParticipantRole,

  activeReportMode:
    state.activeReportMode,

  activeObservationLens:
    state.activeObservationLens,

  activeInstrumentChamber:
    state.activeInstrumentChamber,

  drop:
    state.drop,

  participants:
    state.participants,

  observation:
    state.observation,

  report:
    state.report,

  direct:
    state.direct,

  cycle:
    state.cycle,

  archive:
    state.archive
});

}

function buildApi() {
return deepFreeze({
CONTRACT:
CONTRACT,

  PREVIOUS_CONTRACT:
    PREVIOUS_CONTRACT,

  VERSION:
    VERSION,

  FILE:
    FILE,

  HTML_CONTRACT:
    HTML_CONTRACT,

  CSS_CONTRACT:
    CSS_CONTRACT,

  BLUEPRINT:
    BLUEPRINT,

  PREBUILD_REGISTRY:
    PREBUILD_REGISTRY,

  REPORT_SCHEMA:
    REPORT_SCHEMA,

  READ_SCHEMA:
    READ_SCHEMA,

  ARCHIVE_SCHEMA:
    ARCHIVE_SCHEMA,

  LEDGER_SCHEMA:
    LEDGER_SCHEMA,

  RECEIPT_SCHEMA:
    RECEIPT_SCHEMA,

  READER_REPORT_SCHEMA:
    READER_REPORT_SCHEMA,

  TARGET_RUNTIME_GLOBALS:
    TARGET_RUNTIME_GLOBALS,

  PARTICIPANT_MANIFEST:
    PARTICIPANT_MANIFEST,

  CATEGORY_REGISTRY:
    CATEGORY_REGISTRY,

  createReport:
    createReport,

  runSelectedDirectCheck:
    runSelectedDirectCheck,

  runNineCycle:
    runNineCycle,

  observe:
    function publicObserve() {
      var observation =
        observeLightweight();

      renderWorkbench();

      return observation;
    },

  inspectTargetFrameLight:
    inspectTargetFrameLight,

  inspectTargetFrameFull:
    inspectTargetFrameFull,

  buildParticipantSnapshot:
    function publicBuildParticipantSnapshot() {
      var snapshot =
        buildParticipantSnapshot();

      renderWorkbench();

      return snapshot;
    },

  createDeepArchive:
    createDeepArchive,

  addCurrentReportToArchive:
    addCurrentReportToArchive,

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

  render:
    function publicRender() {
      renderWorkbench();

      return getPublicState();
    },

  getState:
    getPublicState,

  getCurrentReport:
    function getCurrentReport() {
      return frozenClone(
        state.report.current
      );
    },

  getReports:
    function getReports() {
      return frozenClone(
        state.report.sessionReports
      );
    },

  getParticipants:
    function getParticipants() {
      return frozenClone(
        state.participants
      );
    },

  getObservation:
    function getObservation() {
      return frozenClone(
        state.observation
      );
    },

  getLedger:
    function getLedger() {
      return frozenClone(
        state.cycle.ledger
      );
    },

  getReceipts:
    function getReceipts() {
      return frozenClone(
        state.cycle.receipts
      );
    },

  getArchive:
    function getArchive() {
      return frozenClone(
        state.archive.deepArchive
      );
    }
});

}

function publishApi() {
var api =
buildApi();

root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER =
  api;

root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY =
  api;

if (
  !root.AUDRALIA ||
  typeof root.AUDRALIA !== "object"
) {
  root.AUDRALIA = {};
}

root.AUDRALIA.diagnosticRouteController =
  api;

root.AUDRALIA.dropWithReadDiagnosticObservatory =
  api;

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_LOADED__ =
  true;

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_VERSION__ =
  VERSION;

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONTRACT__ =
  CONTRACT;

root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_RECEIPT =
  deepFreeze({
    schema:
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER_RECEIPT_v1",

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

    blueprint:
      BLUEPRINT,

    prebuildRegistry:
      PREBUILD_REGISTRY,

    status:
      "AVAILABLE",

    reportNonblocking:
      true,

    createReportSynchronous:
      true,

    targetObservationOnly:
      true,

    directExecutionExplicit:
      true,

    nineCycleExplicit:
      true,

    stationExecutionRemainsSynchronous:
      true,

    fullReceiptPolling:
      false,

    fullReceiptCapture:
      "DELIBERATE_OR_ONCE_AFTER_CYCLE_PREFLIGHT",

    noClaims:
      NO_CLAIMS,

    generatedAt:
      nowIso()
  });

return api;

}

function sameControllerFamily(contract) {
return Boolean(
typeof contract === "string" &&
(
contract.indexOf(
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROLLER"
) === 0 ||
contract.indexOf(
"AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER"
) === 0
)
);
}

function boot() {
if (state.initialized) {
return;
}

state.initialized =
  true;

state.bootedAt =
  nowIso();

state.updatedAt =
  state.bootedAt;

wireUi();
publishApi();

buildParticipantSnapshot();
observeLightweight();

state.archive.createdAt =
  nowIso();

state.archive.participantSnapshots.push(
  frozenClone(
    state.participants
  )
);

state.archive.observationSnapshots.push(
  frozenClone(
    state.observation
  )
);

renderWorkbench();

toast(
  state.participants.heldCount
    ? "Observatory loaded; some participants are held."
    : "Audralia diagnostic observatory loaded."
);

}

var existing =
root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER;

if (
existing &&
existing.CONTRACT === CONTRACT
) {
return;
}

if (
existing &&
existing.CONTRACT &&
!sameControllerFamily(
existing.CONTRACT
)
) {
root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONFLICT =
deepFreeze({
schema:
"AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_INSTALLATION_CONFLICT_v1",

    expectedContract:
      CONTRACT,

    previousContract:
      PREVIOUS_CONTRACT,

    existingContract:
      existing.CONTRACT,

    sameFamily:
      false,

    replacementPerformed:
      false,

    reason:
      "FOREIGN_CONTROLLER_PRESENT",

    generatedAt:
      nowIso()
  });

return;

}

if (
existing &&
existing.CONTRACT &&
sameControllerFamily(
existing.CONTRACT
)
) {
root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_RENEWAL =
deepFreeze({
schema:
"AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_RENEWAL_v1",

    expectedContract:
      CONTRACT,

    previousContract:
      PREVIOUS_CONTRACT,

    existingContract:
      existing.CONTRACT,

    sameFamily:
      true,

    replacementPerformed:
      true,

    reason:
      "SAME_FAMILY_CONTROLLER_RENEWED",

    generatedAt:
      nowIso()
  });

}

if (doc.readyState === "loading") {
doc.addEventListener(
"DOMContentLoaded",
boot,
{
once: true
}
);
} else {
boot();
}
})(
typeof window !== "undefined"
? window
: typeof globalThis !== "undefined"
? globalThis
: this
);
