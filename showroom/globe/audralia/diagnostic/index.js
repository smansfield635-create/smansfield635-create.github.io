// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2
// Full-file replacement.
// Diagnostic engine only.
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
// Engine/control split:
// - This file owns diagnostic state and diagnostic operations.
// - This file does not bind DOM events.
// - /showroom/globe/audralia/diagnostic/index.controls.js is the sole
//   control owner.
// - Public methods are exposed for the independent control panel.
// - Report creation is synchronous and must remain available regardless of
//   participant, target, runtime, Surface Truth, conductor, station, receipt,
//   or cycle readiness.
//
// Owns:
// - diagnostic state;
// - category and audit registry;
// - participant manifest;
// - participant and alias inspection;
// - target observation;
// - registry inspection;
// - runtime-engine inspection;
// - Surface Truth inspection;
// - synchronous report construction;
// - READ interpretation;
// - report rendering;
// - explicit direct checks;
// - explicit nine-cycle execution;
// - receipt normalization;
// - archive construction;
// - public diagnostic API.
//
// Does not own:
// - DOM event binding;
// - button binding;
// - dropdown binding;
// - tab binding;
// - target-window UI controls;
// - copy-control binding;
// - production mutation;
// - runtime restart;
// - renderer mutation;
// - canvas repair;
// - controls repair;
// - route repair;
// - readiness;
// - visual pass;
// - F21 authority;
// - synthetic evidence.

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
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_CONTROL_SPLIT_STATIC_SHELL_TNT_v2";

var CSS_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_STYLE_TNT_v1";

var CONTROL_PANEL_CONTRACT =
"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_CONTROL_PANEL_TNT_v1";

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
"AUDRALIA_DROP_WITH_READ_REPORT_v2";

var READ_SCHEMA =
"AUDRALIA_DROP_WITH_READ_INTERPRETATION_v2";

var ARCHIVE_SCHEMA =
"AUDRALIA_DROP_WITH_READ_DEEP_ARCHIVE_v2";

var CONDUCTOR_REQUEST_SCHEMA =
"AUDRALIA_DIAGNOSTIC_NINE_CYCLE_REQUEST_v1";

var LEDGER_SCHEMA =
"AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v4";

var RECEIPT_SCHEMA =
"AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

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
"Summarize the shell, diagnostic engine, independent control panel, participants, observations, and cycle evidence."
),
audit(
"controllerHealth",
"Diagnostic Engine Health",
"SAFE_REPORT",
"Inspect diagnostic-engine installation, contract lineage, boot state, state model, and public API."
),
audit(
"controlPanelHealth",
"Control Panel Health",
"SAFE_REPORT",
"Inspect the independent control-panel contract and publication state."
),
audit(
"shellContract",
"Shell Contract",
"SAFE_REPORT",
"Inspect HTML, CSS, diagnostic-engine, control-panel, route, target, and boundary declarations."
),
audit(
"loadOrder",
"Load Order",
"SAFE_REPORT",
"Inspect engine, participant, diagnostic-engine, and control-panel dependency order."
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
"Inspect participant alias candidates and resolved globals."
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
        "Inspect governing authority, assigned engines, selectable engines, reserved slots, and the registry receipt."
      ),
      audit(
        "governingAuthority",
        "Governing Authority",
        "SAFE_REPORT",
        "Inspect the governing contract as authority rather than a second executable engine."
      ),
      audit(
        "runtimeEngine",
        "Runtime Engine",
        "SAFE_REPORT",
        "Inspect runtime-engine identity, contract, version, state, instances, and observed operations."
      ),
      audit(
        "selectedEngine",
        "Selected Engine",
        "SAFE_REPORT",
        "Inspect the registry-selected engine and authority relationship."
      ),
      audit(
        "reservedSlots",
        "Reserved Slots",
        "SAFE_REPORT",
        "Inspect future engine slots without classifying them as assigned engines."
      ),
      audit(
        "engineRuntimeEvidence",
        "Engine Runtime Evidence",
        "SAFE_REPORT",
        "Inspect lifecycle, backend, mount, surface, frame, visibility, and fallback evidence."
      ),
      audit(
        "engineReceipt",
        "Engine Receipt",
        "SAFE_REPORT",
        "Inspect the engine receipt when available."
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
        "Inspect lightweight runtime evidence without requesting a full receipt."
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
        "Inspect runtime, fallback, and general canvas presence."
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
        "Inspect Surface Truth authority, aliases, contract, methods, and receipt."
      ),
      audit(
        "surfaceTruthPacket",
        "Surface Truth Packet",
        "DIRECT_EXECUTION",
        "Invoke one verified read-only Surface Truth method."
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
        "Inspect the East source probe."
      ),
      audit(
        "eastInterpreterParticipant",
        "East Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the East construction interpreter."
      ),
      audit(
        "westProbeParticipant",
        "West Probe Participant",
        "SAFE_REPORT",
        "Inspect the West runtime probe."
      ),
      audit(
        "westInterpreterParticipant",
        "West Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the West runtime interpreter."
      ),
      audit(
        "southProbeParticipant",
        "South Probe Participant",
        "SAFE_REPORT",
        "Inspect the South handoff probe."
      ),
      audit(
        "southInterpreterParticipant",
        "South Interpreter Participant",
        "SAFE_REPORT",
        "Inspect the South restitution interpreter."
      ),
      audit(
        "southPointerParticipant",
        "South Pointer Participant",
        "SAFE_REPORT",
        "Inspect the optional South Surface Pointer."
      ),
      audit(
        "railParticipant",
        "Rail Participant",
        "SAFE_REPORT",
        "Inspect terminal Rail Synthesis."
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
        "Preview nine stations, participant availability, aliases, and current evidence without execution."
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
        "Inspect current target-runtime admission state without starting a cycle."
      ),
      audit(
        "cycleExecution",
        "Cycle Execution",
        "CYCLE_EXECUTION",
        "Explicitly run bounded preflight and the synchronous North cycle."
      ),
      audit(
        "cycleLedger",
        "Cycle Ledger",
        "SAFE_REPORT",
        "Inspect the latest compatible cycle ledger."
      ),
      audit(
        "cycleReceipts",
        "Cycle Receipts",
        "SAFE_REPORT",
        "Inspect normalized station receipts."
      ),
      audit(
        "cycleTerminalSynthesis",
        "Cycle Terminal Synthesis",
        "SAFE_REPORT",
        "Inspect the latest Rail Synthesis receipt."
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
        "Preview the North conductor and verified cycle API."
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
        "Invoke the verified registry refresh method."
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
        "Inspect reports created during the current session."
      ),
      audit(
        "errorArchive",
        "Error Archive",
        "SAFE_REPORT",
        "Inspect engine, participant, observation, direct, and cycle errors."
      ),
      audit(
        "receiptArchive",
        "Receipt Archive",
        "SAFE_REPORT",
        "Inspect collected receipts."
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
        "Create a complete session archive."
      ),
      audit(
        "nextDirection",
        "Next Direction",
        "SAFE_REPORT",
        "Identify the highest-priority next diagnostic action."
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

drop: {
  direct: laneState("IDLE"),
  report: laneState("READY"),
  observation: laneState("OBSERVING"),
  participant: laneState("LOADING")
},

participants: emptyParticipantState(),

observation: {
  targetLight: null,
  targetFull: null,
  registry: null,
  registryReceipt: null,
  authorityRecords: [],
  engineRecords: [],
  selectedEngine: null,
  engineInspection: null,
  engineOps: null,
  engineReceipt: null,
  surfaceTruth: null,
  controlPanel: null,
  errors: [],
  observedAt: null
},

report: {
  current: null,
  readableText: "",
  packetText: "",
  rawText: "",
  evidence: [],
  sessionReports: []
},

direct: {
  running: false,
  selectedAuthority: null,
  selectedMethod: null,
  lastResult: null,
  lastError: null,
  history: []
},

cycle: emptyCycleState(),

archive: {
  reports: [],
  directResults: [],
  cycleRuns: [],
  errors: [],
  participantSnapshots: [],
  observationSnapshots: [],
  deepArchive: null,
  createdAt: null,
  updatedAt: null
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
globalPaths:
Array.isArray(globalPaths)
? globalPaths.slice()
: [],
group: group || "DIAGNOSTIC",
position: null,
fibonacci: null,
parentPosition: null,
createsCyclePosition: null
};

if (
  extra &&
  typeof extra === "object"
) {
  Object.keys(extra).forEach(function assignExtra(key) {
    output[key] =
      extra[key];
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

function audit(
id,
label,
classification,
summary
) {
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

function emptyParticipantState() {
return {
manifest:
clone(PARTICIPANT_MANIFEST),

  shellScripts:
    [],

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
};

}

function emptyCycleState() {
return {
running: false,
cycleId: null,
runPhase: "IDLE",
preflight: null,
preflightProgress: null,
stationRegistrations: [],
auxiliaryRegistrations: [],
conductorResult: null,
conductorReceipt: null,
conductorState: null,
receipts: [],
ledger: null,
readerReport: "",
lastRunAt: null,
lastError: null
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
  result ^=
    text.charCodeAt(index);

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
    normalizeStatus(
      status,
      "UNKNOWN"
    )
  );
}

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

function inspectShellScripts() {
return Array.prototype.slice.call(
doc.querySelectorAll(
"script[data-participant-role]"
)
).map(function mapScript(script) {
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

var methods =
  methodNames(api);

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
    api
      ? "DECLARED_GLOBAL"
      : "NOT_FOUND",

  contract:
    api
      ? firstString(
          api.CONTRACT,
          api.contract
        )
      : null,

  version:
    api
      ? firstString(
          api.VERSION,
          api.version
        )
      : null,

  methods:
    methods,

  methodCount:
    methods.length,

  status:
    api
      ? "AVAILABLE"
      : scriptRecord
        ? "HELD"
        : "MISSING",

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
  records.length -
  requiredCount;

var availableCount =
  records.filter(function countAvailable(record) {
    return record.resolved;
  }).length;

var heldCount =
  records.length -
  availableCount;

state.participants = {
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
  state.participants.observedAt;

state.updatedAt =
  nowIso();

renderParticipantConstellation();
renderDropRail();
renderEvidenceRail();

return frozenClone(
  state.participants
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

var targetPath =
  null;

var targetTitle =
  null;

var accessible =
  false;

var loaded =
  false;

var routeMatch =
  false;

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
      frame.contentWindow ||
      null;

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

    if (
      frameWindow &&
      frameWindow.location
    ) {
      targetPath =
        frameWindow.location.pathname ||
        null;

      routeMatch =
        targetPath === TARGET_ROUTE;
    }

    targetTitle =
      frameDocument &&
      frameDocument.title
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
  } catch (error) {
    readError =
      error &&
      error.message
        ? error.message
        : "TARGET_FRAME_LIGHT_READ_FAILED";
  }
}

var selectedEvidence =
  isNonemptyObject(runtimeStatus)
    ? runtimeStatus
    : isNonemptyObject(runtimeReceiptLight)
      ? runtimeReceiptLight
      : null;

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

var runtime =
  null;

var runtimeReceipt =
  null;

var attempted =
  false;

var succeeded =
  false;

var errorMessage =
  null;

if (
  frame &&
  light.sameOriginAccessible
) {
  try {
    runtime =
      resolveTargetRuntime(
        frame.contentWindow ||
        null
      ).runtime;

    if (
      runtime &&
      isFunction(runtime.getReceipt)
    ) {
      attempted =
        true;

      runtimeReceipt =
        runtime.getReceipt();

      succeeded =
        isNonemptyObject(
          runtimeReceipt
        );
    }
  } catch (error) {
    errorMessage =
      error &&
      error.message
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
    attempted,

  fullReceiptReadSucceeded:
    succeeded,

  fullReceiptReadError:
    errorMessage,

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

var authorities =
  [];

var engines =
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

  authorities =
    callSafely(
      registry,
      "listAuthorities",
      [],
      []
    ) || [];

  engines =
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
    Array.isArray(authorities)
      ? authorities
      : []
  );

state.observation.engineRecords =
  frozenClone(
    Array.isArray(engines)
      ? engines
      : []
  );

state.observation.selectedEngine =
  frozenClone(selectedEngine);

return frozenClone({
  registryLoaded:
    Boolean(registry),

  snapshot:
    snapshot,

  receipt:
    receipt,

  authorityRecords:
    state.observation.authorityRecords,

  engineRecords:
    state.observation.engineRecords,

  selectedEngine:
    selectedEngine
});

}

function inspectEngineState() {
var engine =
getEngine();

var inspection =
  null;

var operations =
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

  if (
    Array.isArray(instances) &&
    instances.length
  ) {
    var first =
      instances[0];

    instanceId =
      typeof first === "string"
        ? first
        : first &&
          first.instanceId
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
    operations =
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
  frozenClone(operations);

state.observation.engineReceipt =
  frozenClone(receipt);

return frozenClone({
  engineLoaded:
    Boolean(engine),

  instanceId:
    instanceId,

  inspection:
    inspection,

  operations:
    operations,

  receipt:
    receipt
});

}

function inspectSurfaceTruth() {
var record =
state.participants.records.find(function findSurface(entry) {
return entry.role ===
"CANVAS_SURFACE_TRUTH";
}) || null;

var authority =
  record &&
  record.resolvedGlobal
    ? readPath(
        record.resolvedGlobal
      )
    : null;

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

state.observation.surfaceTruth =
  deepFreeze({
    authorityPresent:
      Boolean(authority),

    globalPath:
      record
        ? record.resolvedGlobal
        : null,

    contract:
      record
        ? record.contract
        : null,

    version:
      record
        ? record.version
        : null,

    methods:
      methodNames(authority),

    receipt:
      frozenClone(receipt),

    packetKeys:
      isObject(receipt)
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
  });

return state.observation.surfaceTruth;

}

function inspectControlPanel() {
var controlPanel =
root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL ||
readPath(
"AUDRALIA.dropWithReadControlPanel"
) ||
null;

var receipt =
  root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT ||
  null;

state.observation.controlPanel =
  deepFreeze({
    present:
      Boolean(controlPanel),

    contract:
      controlPanel
        ? controlPanel.CONTRACT ||
          null
        : null,

    version:
      controlPanel
        ? controlPanel.VERSION ||
          null
        : null,

    receipt:
      frozenClone(receipt),

    observedAt:
      nowIso()
  });

return state.observation.controlPanel;

}

function observe() {
state.drop.observation.status =
"OBSERVING";

renderDropRail();

var errors = [];

var target =
  inspectTargetFrameLight();

var registry =
  refreshRegistryState();

var engine =
  inspectEngineState();

var surface =
  inspectSurfaceTruth();

var controls =
  inspectControlPanel();

if (target.readError) {
  errors.push({
    source: "TARGET_LIGHT",
    message: target.readError,
    capturedAt: nowIso()
  });
}

state.observation.targetLight =
  frozenClone(target);

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
    target.framePresent,
    registry.registryLoaded,
    engine.engineLoaded,
    surface.authorityPresent,
    controls.present
  ].filter(Boolean).length;

state.drop.observation.heldCount =
  5 -
  state.drop.observation.availableCount;

state.drop.observation.lastAction =
  "Observation completed at " +
  state.observation.observedAt;

state.updatedAt =
  nowIso();

renderAll();

return frozenClone({
  target: target,
  registry: registry,
  engine: engine,
  surfaceTruth: surface,
  controlPanel: controls,
  errors: errors,
  observedAt:
    state.observation.observedAt
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

if (
  !state.observation.controlPanel ||
  !state.observation.controlPanel.present
) {
  absence.push({
    type: "CONTROL_PANEL",
    code: "INDEPENDENT_CONTROL_PANEL_NOT_OBSERVED",
    file:
      "/showroom/globe/audralia/diagnostic/index.controls.js"
  });
}

if (!state.cycle.ledger) {
  absence.push({
    type: "CYCLE",
    code: "NINE_CYCLE_NOT_EXECUTED"
  });
}

if (
  auditRecord.classification ===
    "DIRECT_EXECUTION" &&
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
var direction = [];

absence.forEach(function mapAbsence(entry) {
  if (
    entry.code ===
    "REQUIRED_PARTICIPANT_UNRESOLVED"
  ) {
    direction.push({
      priority: "HIGH",
      action:
        "Inspect participant " +
        entry.role,
      file: entry.file
    });
  }

  if (
    entry.code ===
    "TARGET_FRAME_NOT_OBSERVED"
  ) {
    direction.push({
      priority: "MEDIUM",
      action:
        "Inspect target-frame declaration and load state",
      route: TARGET_ROUTE
    });
  }

  if (
    entry.code ===
    "TARGET_RUNTIME_GLOBAL_NOT_OBSERVED"
  ) {
    direction.push({
      priority: "HIGH",
      action:
        "Inspect target runtime publication",
      acceptedGlobals:
        TARGET_RUNTIME_GLOBALS.slice()
    });
  }

  if (
    entry.code ===
    "SURFACE_TRUTH_AUTHORITY_UNRESOLVED"
  ) {
    direction.push({
      priority: "HIGH",
      action:
        "Inspect Surface Truth participant",
      file: entry.file
    });
  }

  if (
    entry.code ===
    "INDEPENDENT_CONTROL_PANEL_NOT_OBSERVED"
  ) {
    direction.push({
      priority: "HIGH",
      action:
        "Inspect independent control-panel loading",
      file: entry.file
    });
  }

  if (
    entry.code ===
    "NINE_CYCLE_NOT_EXECUTED"
  ) {
    direction.push({
      priority: "OPTIONAL",
      action:
        "Run Nine-Cycle only when cycle evidence is required"
    });
  }

  if (
    entry.code ===
    "SELECTED_DIRECT_CHECK_NOT_EXECUTED"
  ) {
    direction.push({
      priority: "OPTIONAL",
      action:
        "Run the selected direct check explicitly",
      audit: auditRecord.id
    });
  }
});

if (!direction.length) {
  direction.push({
    priority: "LOW",
    action:
      "Review the current report and select the next audit"
  });
}

return direction;

}

function buildResult(auditRecord, absence) {
if (
auditRecord.id ===
"controlPanelHealth"
) {
return (
state.observation.controlPanel &&
state.observation.controlPanel.present
? "The independent control panel is published and available."
: "The independent control panel has not been observed."
);
}

if (
  auditRecord.id ===
  "cycleExecution"
) {
  return state.cycle.ledger
    ? "The latest explicit nine-cycle produced a compatible ledger."
    : "The nine-cycle has not been executed during this session.";
}

if (
  auditRecord.id ===
  "targetRuntimeFull"
) {
  return state.observation.targetFull
    ? "A deliberate full target-runtime observation is available."
    : "No deliberate full target-runtime observation has been captured.";
}

if (
  auditRecord.id ===
  "deepArchive"
) {
  return state.archive.deepArchive
    ? "A deep observatory archive is available."
    : "No deep observatory archive has been created.";
}

return (
  "The Audralia diagnostic engine is available. " +
  String(
    state.participants.availableCount
  ) +
  " of " +
  String(
    state.participants.records.length
  ) +
  " declared participants are resolved. " +
  String(absence.length) +
  " absence record" +
  (
    absence.length === 1
      ? " is"
      : "s are"
  ) +
  " associated with this report."
);

}

function buildEvidenceSnapshot(auditRecord) {
return deepFreeze({
audit:
frozenClone(auditRecord),

  engineController: {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    initialized: state.initialized,
    bootedAt: state.bootedAt,
    updatedAt: state.updatedAt,
    controlOwner: false
  },

  shell: {
    htmlContract: HTML_CONTRACT,
    cssContract: CSS_CONTRACT,
    controlPanelContract:
      CONTROL_PANEL_CONTRACT,
    blueprint: BLUEPRINT,
    prebuildRegistry:
      PREBUILD_REGISTRY,
    route: DIAGNOSTIC_ROUTE,
    targetRoute: TARGET_ROUTE
  },

  participants:
    frozenClone(
      state.participants
    ),

  observation:
    frozenClone(
      state.observation
    ),

  direct:
    frozenClone(
      state.direct
    ),

  cycle:
    frozenClone(
      state.cycle
    ),

  archiveSummary: {
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
      label:
        "Diagnostic engine",

      value:
        CONTRACT
    },
    {
      label:
        "Control panel",

      value:
        state.observation.controlPanel &&
        state.observation.controlPanel.present
          ? state.observation.controlPanel.contract ||
            "Available"
          : "Not observed"
    },
    {
      label:
        "Resolved participants",

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
      label:
        "Target frame",

      value:
        state.observation.targetLight &&
        state.observation.targetLight.framePresent
          ? "Present"
          : "Not observed"
    },
    {
      label:
        "Runtime global",

      value:
        state.observation.targetLight &&
        state.observation.targetLight.runtimeGlobalName
          ? state.observation.targetLight.runtimeGlobalName
          : "Not observed"
    },
    {
      label:
        "Cycle ledger",

      value:
        state.cycle.ledger
          ? state.cycle.ledger.ledgerHash ||
            "Available"
          : "Not available"
    },
    {
      label:
        "Evidence hash",

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

function createReport() {
/*
* Synchronous report law.
*
* This method performs no polling, no waiting, no conductor invocation,
* no station invocation, and no full target-receipt request.
*/
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

  diagnosticEngineContract:
    CONTRACT,

  controlPanelContract:
    CONTROL_PANEL_CONTRACT,

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

state.report.current =
  deepFreeze(report);

state.report.readableText =
  composeReadableReport(
    state.report.current
  );

state.report.packetText =
  safeJson({
    schema:
      report.schema,

    reportId:
      report.reportId,

    classification:
      report.classification,

    category:
      report.category,

    audit:
      report.audit,

    read:
      report.read,

    createdAt:
      report.createdAt,

    reportHash:
      report.reportHash
  });

state.report.rawText =
  safeJson(report);

state.report.evidence =
  frozenClone(
    report.read.evidence
  );

state.report.sessionReports.push(
  state.report.current
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

publishOutputs();
renderAll();

return frozenClone(
  state.report.current
);

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
    entry.label +
    ": " +
    entry.value
  );
});

lines.push("");
lines.push("ABSENCE");

if (report.read.absence.length) {
  report.read.absence.forEach(function addAbsence(entry) {
    lines.push(
      "- " +
      (
        entry.code ||
        entry.type ||
        "UNKNOWN"
      )
    );
  });
} else {
  lines.push(
    "- No absence records."
  );
}

lines.push("");
lines.push("DIRECTION");

report.read.direction.forEach(function addDirection(entry) {
  lines.push(
    "- " +
    (
      entry.action ||
      "Review current evidence"
    )
  );
});

lines.push("");
lines.push("BOUNDARY");
lines.push(
  "Diagnostic-only. Read-only. No production mutation, runtime restart, renderer mutation, repair, readiness claim, visual-pass claim, cycle-pass claim, F21 claim, or synthetic evidence."
);

return lines.join("\n");

}

function targetRuntimeAdmissionState(snapshot) {
var light =
snapshot &&
snapshot.light
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
    status.visiblePixelObserved,
    status.firstVisiblePixelObserved,
    detail.visiblePixelObserved,
    detail.firstVisiblePixelObserved
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

var attempts = [];

function sample() {
  var light =
    inspectTargetFrameLight();

  var admission =
    targetRuntimeAdmissionState(
      light
    );

  var elapsedMs =
    Date.now() -
    startedAt;

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
light,
admission
) {
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
    Date.now() -
    startedAt,

  attemptCount:
    attempts.length,

  finalLightSnapshot:
    frozenClone(light),

  finalFullSnapshot:
    inspectTargetFrameFull(),

  admission:
    frozenClone(admission),

  attempts:
    frozenClone(attempts),

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
definition.globalPaths ||
[]
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
if (Array.isArray(result)) {
return result;
}

if (!isObject(result)) {
  return [];
}

var candidates = [
  result.receipts,
  result.stationReceipts,
  result.cycleReceipts,
  result.ledger &&
    result.ledger.receipts,
  result.ledger &&
    result.ledger.stationReceipts,
  result.result &&
    result.result.receipts,
  result.result &&
    result.result.stationReceipts,
  result.packet &&
    result.packet.receipts,
  result.packet &&
    result.packet.stationReceipts,
  result.cycleReceipt &&
    result.cycleReceipt.receipts,
  result.cycleReceipt &&
    result.cycleReceipt.stationReceipts
];

var index;

for (
  index = 0;
  index < candidates.length;
  index += 1
) {
  if (
    Array.isArray(
      candidates[index]
    )
  ) {
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
    Array.isArray(
      source.observations
    )
      ? frozenClone(
          source.observations
        )
      : [],

  evidence:
    Array.isArray(
      source.evidence
    )
      ? frozenClone(
          source.evidence
        )
      : [],

  issues:
    Array.isArray(
      source.issues
    )
      ? frozenClone(
          source.issues
        )
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
      ? frozenClone(
          source.noClaims
        )
      : NO_CLAIMS,

  raw:
    frozenClone(source)
});

}

function normalizeConductorResult(result) {
var receipts =
extractReceipts(result);

if (!receipts.length) {
  return {
    conductorResult:
      frozenClone(result),

    receipts:
      makeHeldReceipts(
        "CONDUCTOR_RETURNED_NO_RECEIPTS",
        "The North conductor returned no station receipts.",
        "No receipt collection could be extracted."
      )
  };
}

var normalized = [];

STATIONS.forEach(function normalizeStation(definition, index) {
  var matching =
    receipts.find(function findMatching(receipt) {
      return (
        receipt &&
        receipt.stationId ===
          definition.stationId
      );
    }) ||
    receipts[index] ||
    null;

  normalized.push(
    matching
      ? normalizeReceipt(
          matching,
          definition,
          index
        )
      : makeHeldReceipt(
          definition,
          "STATION_RECEIPT_MISSING",
          "The conductor did not return this station receipt.",
          "Expected station receipt was absent."
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
    governingContract:
      GOVERNING_ENGINE_CONTRACT,

    coreContract:
      CORE_ENGINE_CONTRACT,

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

if (
  !conductor ||
  !isFunction(
    conductor.createCycle
  )
) {
  return Promise.resolve({
    conductorResult:
      frozenClone(conductor),

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_UNAVAILABLE",
        "The North conductor is unavailable or incompatible.",
        "A compatible createCycle() authority was not found."
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
        "The North conductor could not create the cycle.",
        String(error)
      )
  });
}

if (
  !cycle ||
  !isFunction(
    cycle.registerStation
  ) ||
  !isFunction(
    cycle.seal
  ) ||
  !isFunction(
    cycle.run
  ) ||
  !isFunction(
    cycle.getReceipt
  )
) {
  return Promise.resolve({
    conductorResult:
      frozenClone(cycle),

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_CYCLE_API_INCOMPATIBLE",
        "The conductor created an incompatible cycle.",
        "Required cycle methods are missing."
      )
  });
}

state.cycle.stationRegistrations =
  [];

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

      status:
        "REJECTED",

      reason:
        "STATION_GLOBAL_NOT_FOUND",

      file:
        definition.file,

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

        file:
          definition.file,

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

        file:
          definition.file,

        generatedAt:
          nowIso()
      };
    }
  }

  state.cycle.stationRegistrations.push(
    deepFreeze(outcome)
  );
});

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
        )
    },

    receipts:
      makeHeldReceipts(
        "NORTH_CONDUCTOR_SEAL_THROW",
        "The conductor could not seal the cycle.",
        String(error)
      )
  });
}

return Promise.resolve(
  cycle.run()
)
  .then(function cycleResolved(result) {
    var receipt =
      isObject(result)
        ? result
        : cycle.getReceipt();

    state.cycle.conductorReceipt =
      frozenClone(receipt);

    state.cycle.conductorState =
      frozenClone(
        isFunction(
          cycle.getState
        )
          ? cycle.getState()
          : null
      );

    return normalizeConductorResult({
      schema:
        "AUDRALIA_DIAGNOSTIC_ROUTE_CONDUCTOR_RESULT_v3",

      cycleReceipt:
        receipt,

      stationReceipts:
        extractReceipts(receipt),

      sealReceipt:
        sealReceipt,

      state:
        state.cycle.conductorState,

      stationRegistrations:
        frozenClone(
          state.cycle.stationRegistrations
        ),

      targetPreflight:
        frozenClone(
          state.cycle.preflight
        )
    });
  })
  .catch(function cycleRejected(error) {
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
          "The conductor rejected the cycle.",
          String(error)
        )
    };
  });

}

function composeLedger() {
function count(statuses) {
return state.cycle.receipts.filter(function countReceipt(receipt) {
return (
statuses.indexOf(
receipt.status
) !== -1
);
}).length;
}

var passCount =
  count([
    "PASS",
    "COMPLETE"
  ]);

var holdCount =
  count([
    "HOLD",
    "HELD",
    "PARTIAL_PASS",
    "UNVERIFIED"
  ]);

var failCount =
  count([
    "FAIL",
    "FAILED"
  ]);

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
  errorCount
    ? "ERROR"
    : conflictCount
      ? "CONFLICT"
      : failCount
        ? "FAIL"
        : degradedCount
          ? "DEGRADED"
          : holdCount
            ? "HOLD"
            : (
                passCount ===
                state.cycle.receipts.length &&
                state.cycle.receipts.length
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

  cycleId:
    state.cycle.cycleId,

  generatedAt:
    nowIso(),

  targetRoute:
    TARGET_ROUTE,

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

state.cycle =
  emptyCycleState();

state.cycle.running =
  true;

state.cycle.cycleId =
  "AUDRALIA_DIAGNOSTIC_CYCLE_" +
  Date.now();

state.cycle.runPhase =
  "WAITING_FOR_TARGET";

state.drop.direct.status =
  "RUNNING";

state.drop.direct.lastAction =
  "Nine-cycle execution started.";

renderExecutionState();

buildParticipantSnapshot();
observe();

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
  .then(function conductorResolved(normalized) {
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

    state.cycle.running =
      false;

    state.cycle.runPhase =
      "IDLE";

    state.drop.direct.status =
      "IDLE";

    state.drop.direct.availableCount =
      1;

    state.drop.direct.heldCount =
      state.cycle.ledger.overallStatus ===
        "PASS"
        ? 0
        : 1;

    state.drop.direct.lastAction =
      "Nine-cycle completed at " +
      state.cycle.lastRunAt;

    observe();
    createReport();

    return frozenClone(
      state.cycle.ledger
    );
  })
  .catch(function cycleError(error) {
    state.cycle.lastError =
      String(
        error &&
        error.message
          ? error.message
          : error
      );

    state.cycle.receipts =
      makeHeldReceipts(
        "DIAGNOSTIC_ENGINE_CYCLE_ERROR",
        "The diagnostic engine could not complete the cycle.",
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

    state.archive.errors.push(
      deepFreeze({
        type: "CYCLE",
        message:
          state.cycle.lastError,
        capturedAt:
          nowIso()
      })
    );

    createReport();

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
  .then(function executeDirect() {
    var result;

    if (
      auditRecord.id ===
        "targetRuntimeFull" ||
      auditRecord.id ===
        "runtimeObservationDirect"
    ) {
      result =
        inspectTargetFrameFull();

      state.observation.targetFull =
        frozenClone(result);
    } else if (
      auditRecord.id ===
      "registryRefreshDirect"
    ) {
      result =
        refreshRegistryState();
    } else if (
      auditRecord.id ===
        "surfaceTruthPacket" ||
      auditRecord.id ===
        "surfaceTruthDirect"
    ) {
      var surface =
        state.observation.surfaceTruth ||
        inspectSurfaceTruth();

      var authority =
        surface.globalPath
          ? readPath(
              surface.globalPath
            )
          : null;

      var preferred = [
        "getReceipt",
        "getPacket",
        "inspect",
        "read",
        "probe"
      ];

      var method =
        preferred.find(function findMethod(name) {
          return (
            authority &&
            isFunction(
              authority[name]
            )
          );
        });

      if (!method) {
        throw new Error(
          "NO_VERIFIED_SURFACE_TRUTH_READ_METHOD"
        );
      }

      state.direct.selectedAuthority =
        surface.globalPath;

      state.direct.selectedMethod =
        method;

      result =
        authority[method]();
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
  .catch(function directError(error) {
    var record =
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
      record;

    state.archive.errors.push(
      record
    );

    state.drop.direct.status =
      "HELD";

    state.drop.direct.heldCount =
      1;

    state.drop.direct.lastAction =
      "Direct check held: " +
      record.message;

    return record;
  })
  .then(function finishDirect(record) {
    state.direct.running =
      false;

    observe();
    createReport();

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

  engineState:
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

publishOutputs();
renderArchiveChamber();

return frozenClone(
  state.archive.deepArchive
);

}

function addCurrentReportToArchive() {
if (!state.report.current) {
return null;
}

state.archive.reports.push(
  state.report.current
);

state.archive.updatedAt =
  nowIso();

renderArchiveChamber();

return frozenClone(
  state.report.current
);

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

state.drop.report.status =
  "READY";

state.drop.report.heldCount =
  0;

state.drop.report.lastAction =
  "Current report reset at " +
  nowIso();

publishOutputs();
renderAll();

return null;

}

function resetWorkbench() {
state.activeCategoryId =
"observatoryReceiver";

state.activeAuditId =
  "observatoryIndex";

state.activeParticipantRole =
  null;

state.activeReportMode =
  "read";

state.activeObservationLens =
  "target";

state.activeInstrumentChamber =
  "cycle";

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

state.direct.running =
  false;

state.direct.selectedAuthority =
  null;

state.direct.selectedMethod =
  null;

state.direct.lastResult =
  null;

state.direct.lastError =
  null;

state.cycle =
  emptyCycleState();

state.drop.direct =
  laneState("IDLE");

state.drop.report =
  laneState("READY");

state.drop.observation =
  laneState("OBSERVING");

state.drop.participant =
  laneState("LOADING");

buildParticipantSnapshot();
observe();
publishOutputs();
renderAll();

return getPublicState();

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

return frozenClone(
  categoryRecord
);

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

return frozenClone(
  auditRecord
);

}

function selectParticipant(role) {
state.activeParticipantRole =
role;

renderParticipantDetail();

return frozenClone(
  state.participants.records.find(function findParticipant(record) {
    return record.role === role;
  }) || null
);

}

function selectReportMode(mode) {
state.activeReportMode =
mode;

renderReportModes();

return mode;

}

function selectObservationLens(lens) {
state.activeObservationLens =
lens;

renderObservationLensTabs();

return lens;

}

function selectInstrumentChamber(chamber) {
state.activeInstrumentChamber =
chamber;

renderInstrumentDeckTabs();

return chamber;

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

function renderEvidenceRail() {
var target =
state.observation.targetLight;

setText(
  "targetStatus",
  "Target · " +
  (
    target &&
    target.framePresent
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "targetStatus",
  target &&
  target.framePresent
    ? "FOUND"
    : "UNKNOWN"
);

setText(
  "runtimeStatus",
  "Runtime · " +
  (
    target &&
    target.runtimeGlobalPresent
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "runtimeStatus",
  target &&
  target.runtimeGlobalPresent
    ? "FOUND"
    : "UNKNOWN"
);

setText(
  "rendererStatus",
  "Renderer · " +
  (
    target &&
    target.runtimeGlobalName ===
      "DGBAudraliaPlanetRenderer"
      ? "Found"
      : "Unknown"
  )
);

setStatus(
  "rendererStatus",
  target &&
  target.runtimeGlobalName ===
    "DGBAudraliaPlanetRenderer"
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

renderParticipantGroupStatus(
  "northStatus",
  "North",
  [
    "NORTH_CONDUCTOR",
    "NORTH_PROBE_INTAKE"
  ]
);

renderParticipantGroupStatus(
  "eastStatus",
  "East",
  [
    "EAST_PROBE_SOURCE",
    "EAST_CONSTRUCTION_INTERPRETATION"
  ]
);

renderParticipantGroupStatus(
  "westStatus",
  "West",
  [
    "WEST_PROBE_RUNTIME",
    "WEST_RUNTIME_INTERPRETATION"
  ]
);

renderParticipantGroupStatus(
  "southStatus",
  "South",
  [
    "SOUTH_PROBE_HANDOFF",
    "SOUTH_RESTITUTION_INTERPRETATION"
  ]
);

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

var detail =
  runtimeStatus &&
  runtimeStatus.statusDetail
    ? runtimeStatus.statusDetail
    : {};

var mounted =
  firstBoolean(
    runtimeStatus.mounted,
    detail.mounted
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

function renderParticipantGroupStatus(
id,
label,
roles
) {
var found =
roles.every(function everyRole(role) {
return state.participants.records.some(function someRecord(record) {
return (
record.role === role &&
record.resolved
);
});
});

setText(
  id,
  label +
  " · " +
  (
    found
      ? "Found"
      : "Held"
  )
);

setStatus(
  id,
  found
    ? "FOUND"
    : "HELD"
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
  String(
    categoryRecord.audits.length
  ) +
  " audits"
);

setText(
  "auditSelectorLabel",
  auditRecord.label
);

setText(
  "auditSelectorMeta",
  auditRecord.classification.replace(
    /_/g,
    " "
  )
);

setHtml(
  "auditSelectorMenu",
  categoryRecord.audits
    .map(function renderAudit(entry) {
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
    .join("")
);

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-category-id]"
  )
).forEach(function updateCategory(node) {
  node.setAttribute(
    "aria-selected",
    node.getAttribute(
      "data-category-id"
    ) === categoryRecord.id
      ? "true"
      : "false"
  );
});

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

setText(
  "selectedAuditSequence",
  "AUDIT " +
  String(
    categoryRecord.audits.indexOf(
      auditRecord
    ) + 1
  ).padStart(2, "0")
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
var records =
state.participants.records.filter(function excludeEngine(record) {
return record.group !== "ENGINE";
});

setHtml(
  "participantList",
  records
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
    .join("")
);

Array.prototype.slice.call(
  doc.querySelectorAll(
    "[data-participant-summary]"
  )
).forEach(function renderSummary(node) {
  var key =
    node.getAttribute(
      "data-participant-summary"
    );

  var map = {
    required:
      state.participants.requiredCount,

    optional:
      state.participants.optionalCount,

    available:
      state.participants.availableCount,

    held:
      state.participants.heldCount
  };

  node.textContent =
    map[key] !== undefined
      ? map[key]
      : "0";
});

renderParticipantDetail();

}

function renderParticipantDetail() {
var record =
state.participants.records.find(function findRecord(entry) {
return entry.role ===
state.activeParticipantRole;
}) || null;

if (!record) {
  setHtml(
    "participantDetail",
    "<h3>Select a participant</h3>" +
    "<p>Participant inspection reveals file, requirement, alias, contract, version, position, and methods without execution.</p>"
  );

  return;
}

setHtml(
  "participantDetail",
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
  escapeHtml(
    record.resolvedGlobal ||
    "Not resolved"
  ) +
  "</p>" +
  "<p><strong>Contract:</strong> " +
  escapeHtml(
    record.contract ||
    "Unknown"
  ) +
  "</p>" +
  "<p><strong>Version:</strong> " +
  escapeHtml(
    record.version ||
    "Unknown"
  ) +
  "</p>" +
  "<p><strong>Methods:</strong> " +
  escapeHtml(
    record.methods.length
      ? record.methods.join(", ")
      : "None observed"
  ) +
  "</p>"
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

  setText(
    "reportMeta",
    "Choose an audit and create a report."
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

renderReadRegion(
  "readResult",
  "R",
  "Result",
  report.read.result
);

renderReadRegion(
  "readEvidence",
  "E",
  "Evidence",
  report.read.evidence
    .map(function mapEvidence(entry) {
      return (
        entry.label +
        ": " +
        entry.value
      );
    })
);

renderReadRegion(
  "readAbsence",
  "A",
  "Absence",
  report.read.absence.length
    ? report.read.absence.map(function mapAbsence(entry) {
        return (
          entry.code ||
          entry.type ||
          "UNKNOWN"
        );
      })
    : [
        "No absence records."
      ]
);

renderReadRegion(
  "readDirection",
  "D",
  "Direction",
  report.read.direction.map(function mapDirection(entry) {
    return (
      entry.action ||
      "Review current evidence"
    );
  })
);

}

function renderReadRegion(
id,
letter,
label,
content
) {
var lines =
Array.isArray(content)
? content
: [content];

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
  escapeHtml(
    lines[0] ||
    "No current entry"
  ) +
  "</strong>" +
  "</div>" +
  "</header>" +
  (
    lines.length > 1
      ? "<ul>" +
        lines
          .slice(1)
          .map(function renderLine(line) {
            return (
              "<li>" +
              escapeHtml(line) +
              "</li>"
            );
          })
          .join("") +
        "</ul>"
      : "<p>" +
        escapeHtml(
          lines[0] ||
          "No current entry"
        ) +
        "</p>"
  )
);

}

function renderReportModes() {
[
"read",
"packet",
"raw",
"evidence"
].forEach(function toggleMode(mode) {
var name =
mode.charAt(0).toUpperCase() +
mode.slice(1);

  var button =
    byId(
      "report" +
      name +
      "Button"
    );

  var panel =
    byId(
      "report" +
      name +
      "Panel"
    );

  if (button) {
    button.setAttribute(
      "aria-selected",
      mode ===
        state.activeReportMode
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      mode !==
      state.activeReportMode;
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
  yesNoUnknown(
    target &&
    target.framePresent
  )
);

setText(
  "targetSameOrigin",
  yesNoUnknown(
    target &&
    target.sameOriginAccessible
  )
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
  yesNoUnknown(
    target &&
    target.routeMatch
  )
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
  "None observed"
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
      key ===
        state.activeObservationLens
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      key !==
      state.activeObservationLens;
  }
});

}

function renderCycleChamber() {
setText(
"cycleLedgerOutput",
state.cycle.ledger
? safeJson(
state.cycle.ledger
)
: "No cycle ledger has been produced."
);

setHtml(
  "cycleReceiptList",
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
    : '<article class="empty-state"><h4>No cycle receipts</h4><p>Run Nine-Cycle explicitly to create station receipts.</p></article>'
);

STATIONS.forEach(function renderStation(definition) {
  var node =
    doc.querySelector(
      '[data-station="' +
      definition.stationId +
      '"]'
    );

  var receipt =
    state.cycle.receipts.find(function findReceipt(entry) {
      return (
        entry.stationId ===
        definition.stationId
      );
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
  byId(
    "cycleExecutionSummary"
  );

if (execution) {
  execution.innerHTML =
    "<span>Execution</span>" +
    "<strong>" +
    escapeHtml(
      state.cycle.ledger
        ? state.cycle.ledger.overallStatus
        : state.cycle.running
          ? state.cycle.runPhase
          : "Not run"
    ) +
    "</strong>" +
    "<p>" +
    escapeHtml(
      state.cycle.ledger
        ? state.cycle.ledger.terminalSummary
        : state.cycle.running
          ? "The explicit nine-cycle is in progress."
          : "No conductor cycle has been created during this session."
    ) +
    "</p>";
}

}

function renderRegistryChamber() {
var snapshot =
state.observation.registry ||
{};

var authorities =
  state.observation.authorityRecords ||
  [];

var engines =
  state.observation.engineRecords ||
  [];

setText(
  "governingContractCount",
  Number(
    snapshot.authorityCount ||
    snapshot.governingAuthorityCount ||
    authorities.length ||
    0
  )
);

setText(
  "assignedEngineCount",
  Number(
    snapshot.assignedEngineCount ||
    engines.filter(function assigned(record) {
      return !record.reserved;
    }).length ||
    0
  )
);

setText(
  "selectableEngineCount",
  Number(
    snapshot.selectableEngineCount ||
    engines.filter(function selectable(record) {
      return record.selectable;
    }).length ||
    0
  )
);

setText(
  "reservedEngineCount",
  Number(
    snapshot.reservedEngineCount ||
    engines.filter(function reserved(record) {
      return record.reserved;
    }).length ||
    0
  )
);

var records =
  authorities.concat(
    engines
  );

setHtml(
  "registryRecordList",
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
    : '<article class="empty-state"><h4>Registry not observed</h4><p>No registry records are currently available.</p></article>'
);

setHtml(
  "selectedEngineDetail",
  "<h4>Selected Engine</h4>" +
  "<pre>" +
  escapeHtml(
    safeJson(
      state.observation.selectedEngine
    )
  ) +
  "</pre>"
);

setHtml(
  "engineRuntimeDetail",
  "<h4>Runtime Evidence</h4>" +
  "<pre>" +
  escapeHtml(
    safeJson({
      inspection:
        state.observation.engineInspection,

      operations:
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

state.cycle.receipts.forEach(function addCycle(receipt) {
  receipts.push({
    type: "cycle",
    label:
      receipt.fibonacci +
      " · " +
      receipt.stationId
  });
});

state.direct.history.forEach(function addDirect(record) {
  receipts.push({
    type: "direct",
    label:
      record.audit.label
  });
});

state.archive.errors.forEach(function addError(record) {
  receipts.push({
    type: "error",
    label:
      record.message ||
      record.type ||
      "Error"
  });
});

setHtml(
  "receiptList",
  receipts.length
    ? receipts
        .map(function renderReceipt(entry) {
          return (
            "<article>" +
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
    : '<article class="empty-state"><h4>No receipts collected</h4><p>Reports, direct checks, and cycle execution may contribute receipts.</p></article>'
);

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
        .map(function renderReport(report) {
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
        .map(function renderError(error) {
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
    : '<article class="empty-state"><h4>No archived errors</h4><p>No diagnostic errors have been archived.</p></article>'
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

function renderInstrumentDeckTabs() {
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
      key ===
        state.activeInstrumentChamber
        ? "true"
        : "false"
    );
  }

  if (panel) {
    panel.hidden =
      key !==
      state.activeInstrumentChamber;
  }
});

}

function renderExecutionState() {
if (state.cycle.running) {
setText(
"controllerState",
state.cycle.runPhase
);

  setStatus(
    "controllerState",
    "RUNNING"
  );
} else if (state.direct.running) {
  setText(
    "controllerState",
    "EXECUTING"
  );

  setStatus(
    "controllerState",
    "RUNNING"
  );
} else {
  setText(
    "controllerState",
    "REPORT READY"
  );

  setStatus(
    "controllerState",
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

function renderAll() {
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
renderInstrumentDeckTabs();
renderExecutionState();
}

function publishOutputs() {
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

  CONTROL_PANEL_CONTRACT:
    CONTROL_PANEL_CONTRACT,

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

  TARGET_RUNTIME_GLOBALS:
    TARGET_RUNTIME_GLOBALS,

  PARTICIPANT_MANIFEST:
    PARTICIPANT_MANIFEST,

  CATEGORY_REGISTRY:
    CATEGORY_REGISTRY,

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

  inspectTargetFrameLight:
    inspectTargetFrameLight,

  inspectTargetFrameFull:
    inspectTargetFrameFull,

  buildParticipantSnapshot:
    buildParticipantSnapshot,

  refreshRegistry:
    function publicRefreshRegistry() {
      var result =
        refreshRegistryState();

      renderAll();

      return result;
    },

  render:
    function publicRender() {
      renderAll();

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

  getReadableReport:
    function getReadableReport() {
      return String(
        state.report.readableText ||
        ""
      );
    },

  getReportPacket:
    function getReportPacket() {
      return String(
        state.report.packetText ||
        ""
      );
    },

  getRawReport:
    function getRawReport() {
      return String(
        state.report.rawText ||
        ""
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

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_LOADED__ =
  true;

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_VERSION__ =
  VERSION;

root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONTRACT__ =
  CONTRACT;

root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_RECEIPT =
  deepFreeze({
    schema:
      "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_RECEIPT_v2",

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

    status:
      "AVAILABLE",

    controlOwner:
      false,

    domEventBindingOwned:
      false,

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

    fullReceiptPolling:
      false,

    noClaims:
      NO_CLAIMS,

    generatedAt:
      nowIso()
  });

return api;

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

publishApi();

/*
 * No DOM event binding occurs here.
 * The independent control panel owns all user controls.
 */

buildParticipantSnapshot();
observe();

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

setText(
  "controllerContract",
  CONTRACT
);

renderAll();
publishOutputs();

}

var existing =
root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY;

if (
existing &&
existing.CONTRACT === CONTRACT
) {
return;
}

if (
doc.readyState === "loading"
) {
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
