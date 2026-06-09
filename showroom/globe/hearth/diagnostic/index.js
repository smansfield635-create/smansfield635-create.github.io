// /showroom/globe/hearth/diagnostic/index.js
// HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_SELECTOR_SURFACE_CONTROLLER_TNT_v9_4_4_1
// Full-file replacement.
// Controller only.
// Owns: visible selector-surface category selection, visible selector-surface audit selection,
// report generation, copy, archive, participant loading, alias probing, direct checks,
// target access, state validation.
// Design law: state.activeAudit is set only by the visible audit selector surface.
// Report proof: RESOLVED_FROM=VISIBLE_AUDIT_BUTTON_STATE.
// Does not own or mutate production, canvas, controls, runtime route, target renderer, or Hearth visual output.

(function hearthSingleAuditWorkbenchSelectorSurfaceController(global) {
  "use strict";

  var root = global || window;
  var doc = root.document;

  var CONTRACT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_TNT_v8";
  var RECEIPT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_RECEIPT_v8";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_SELECTOR_SURFACE_CONTROLLER_TNT_v9_4_4_1";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_SELECTOR_SURFACE_CONTROLLER_RECEIPT_v9_4_4_1";

  var HTML_SHELL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_SELECTOR_SURFACE_HTML_SHELL_TNT_v9_4_4_1";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_CONTROLLER_TNT_v9_4_4";

  var BASELINE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_NORTH_ALIAS_RECOGNITION_AND_WEST_LABEL_SPLIT_TNT_v9_1";

  var VERSION =
    "2026-06-09.hearth-diagnostic-route-single-audit-workbench-selector-surface-controller-v9-4-4-1";

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

  var PARTICIPANT_GROUPS = [
    {
      group: "LAB_NORTH",
      participants: [
        { path: "/assets/lab/runtime-table.js", required: true, role: "LAB_NORTH" }
      ]
    },
    {
      group: "LAB_CARDINAL_BRANCHES",
      participants: [
        { path: "/assets/lab/runtime-table.east.js", required: true, role: "LAB_EAST" },
        { path: "/assets/lab/runtime-table.south.js", required: true, role: "LAB_SOUTH" },
        { path: "/assets/lab/runtime-table.west.js", required: true, role: "LABWEST" }
      ]
    },
    {
      group: "HEARTH_DIAGNOSTIC_PARTICIPANTS",
      participants: [
        { path: "/assets/hearth/hearth.diagnostic.rail.js", required: true, role: "NORTH" },
        { path: "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js", required: true, role: "SURFACE_TRUTH" },
        { path: "/assets/hearth/hearth.diagnostic.east.js", required: true, role: "EAST" },
        { path: "/assets/hearth/hearth.diagnostic.probe.east.js", required: false, role: "EAST_PROBE" },
        { path: "/assets/hearth/hearth.diagnostic.south.js", required: true, role: "SOUTH" },
        { path: "/assets/hearth/hearth.diagnostic.south.surface.pointer.js", required: false, role: "SOUTH_SURFACE_POINTER" },
        { path: "/assets/hearth/hearth.diagnostic.west.js", required: true, role: "WEST_DIAGNOSTIC" }
      ]
    }
  ];

  var ALIASES = {
    LAB_NORTH: [
      "LAB_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "HEARTH.runtimeTable",
      "HEARTH.northCommandRuntimeTable"
    ],
    LAB_EAST: [
      "LAB_RUNTIME_TABLE_EAST",
      "LAB_RUNTIME_TABLE_EAST_F3",
      "RUNTIME_TABLE_EAST",
      "EAST_INTAKE_VALVE",
      "EAST_SUPREME_JUDGE",
      "EAST_ADMISSION_BRANCH",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.runtimeTableEastF3",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.eastIntakeValve",
      "DEXTER_LAB.eastSupremeJudge",
      "HEARTH.runtimeTableEast",
      "HEARTH.runtimeTableEastF3",
      "HEARTH.eastIntakeValve",
      "HEARTH.eastSupremeJudge"
    ],
    LAB_SOUTH: [
      "LAB_RUNTIME_TABLE_SOUTH",
      "LAB_RUNTIME_TABLE_SOUTH_F8",
      "RUNTIME_TABLE_SOUTH",
      "SOUTH_PROOF_RETURN",
      "SOUTH_SUPREME_JUDGE",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.runtimeTableSouthF8",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "HEARTH.runtimeTableSouth",
      "HEARTH.runtimeTableSouthF8"
    ],
    LABWEST: [
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_RUNTIME_TABLE_WEST_F5",
      "RUNTIME_TABLE_WEST",
      "WEST_PRESSURE_ADMISSIBILITY",
      "WEST_SUPREME_JUDGE",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "HEARTH.runtimeTableWest"
    ],
    NORTH: [
      "JUDGE_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER",
      "HEARTH.diagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticNorthRail",
      "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth",
      "DEXTER_LAB.hearthDiagnosticNorthRail"
    ],
    EAST: [
      "JUDGE_EAST",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH.JUDGE_EAST_SOURCE_READ",
      "DEXTER_LAB.hearthDiagnosticEast"
    ],
    EAST_PROBE: [
      "HEARTH_DIAGNOSTIC_PROBE_EAST",
      "HEARTH.diagnosticProbeEast",
      "DEXTER_LAB.diagnosticProbeEast"
    ],
    SURFACE_TRUTH: [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.canvasSurfaceTruthProbe",
      "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
    ],
    SOUTH: [
      "JUDGE_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH.JUDGE_SOUTH_PACKET_OUTPUT",
      "DEXTER_LAB.hearthDiagnosticSouth"
    ],
    SOUTH_SURFACE_POINTER: [
      "HEARTH.southSurfacePointerSidecar",
      "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
      "HEARTH.southCanvasSurfacePointerSidecar",
      "HEARTH.diagnosticSouthSurfacePointer",
      "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
      "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
      "DEXTER_LAB.southSurfacePointerSidecar",
      "DEXTER_LAB.hearthSouthSurfacePointerSidecar"
    ],
    WEST_DIAGNOSTIC: [
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST"
    ]
  };

  var DIRECT_CONFIG = {
    northDirect: {
      directSeq: "08",
      role: "NORTH_DIRECT_CHECK_ALIAS_PROBE",
      component: "NORTH",
      authorityPath: "JUDGE_NORTH",
      aliases: ALIASES.NORTH,
      methods: ["run", "runDiagnostic", "runNorthDiagnostic", "inspect", "getReport", "getReceipt"],
      fallbackGlobals: []
    },
    eastDirect: {
      directSeq: "09",
      role: "EAST_DIRECT_CHECK",
      component: "EAST",
      authorityPath: "JUDGE_EAST",
      aliases: ALIASES.EAST,
      methods: ["run", "runDiagnostic", "runEastSourceRead", "inspect", "getReport", "getReceipt"],
      fallbackGlobals: [
        "HEARTH_DIAGNOSTIC_RAIL_EAST_RUN",
        "HEARTH_DIAGNOSTIC_RAIL_EAST_RUN_DIAGNOSTIC",
        "HEARTH_DIAGNOSTIC_RAIL_EAST_RUN_SOURCE_READ"
      ]
    },
    surfaceTruthDirect: {
      directSeq: "10",
      role: "SURFACE_TRUTH_DIRECT_CHECK",
      component: "SURFACE_TRUTH",
      authorityPath: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      aliases: ALIASES.SURFACE_TRUTH,
      methods: [
        "run",
        "runDiagnostic",
        "runSurfaceTruth",
        "runCanvasSurfaceTruth",
        "runProbe",
        "measure",
        "inspect",
        "getReport",
        "getReceipt"
      ],
      fallbackGlobals: []
    },
    southDirect: {
      directSeq: "11",
      role: "SOUTH_DIRECT_CHECK",
      component: "SOUTH",
      authorityPath: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      aliases: ALIASES.SOUTH,
      methods: [
        "run",
        "runDiagnostic",
        "runSouth",
        "runSouthDiagnostic",
        "runPacketOutput",
        "inspect",
        "getReport",
        "getReceipt"
      ],
      fallbackGlobals: []
    },
    westDirect: {
      directSeq: "12",
      role: "WEST_DIAGNOSTIC_DIRECT_CHECK",
      component: "WEST_DIAGNOSTIC",
      authorityPath: "HEARTH.diagnosticWest",
      aliases: ALIASES.WEST_DIAGNOSTIC,
      methods: ["run", "runDiagnostic", "runWestDiagnostic", "inspect", "getReport", "getReceipt"],
      fallbackGlobals: []
    }
  };

  var AUDIT_SECTIONS = [
    {
      id: "chamberReceiver",
      label: "Chamber / Receiver",
      hint: "Receiver and chamber condition",
      audits: ["chamberIndex", "receiverHealth", "targetAccess", "loadSequence", "aliasMap"]
    },
    {
      id: "cardinalLab",
      label: "Cardinal / Lab",
      hint: "North, East, South, West calibration",
      audits: ["northSignal", "eastSource", "southLens", "southSurfacePointer", "labWestGate", "westDiagnostic"]
    },
    {
      id: "sourceSurface",
      label: "Source / Surface",
      hint: "Source and surface access",
      audits: ["eastSourceDetail", "surfaceTruthDetail", "targetSurfaceAccess", "canvasBoundary"]
    },
    {
      id: "directExecution",
      label: "Direct Execution",
      hint: "Explicit direct checks only",
      audits: ["northDirect", "eastDirect", "surfaceTruthDirect", "southDirect", "westDirect"]
    },
    {
      id: "boundaryArchive",
      label: "Boundary / Archive",
      hint: "No-touch proof and archive",
      audits: ["noTouchBoundary", "nextMove", "deepArchive"]
    }
  ];

  var AUDITS = {
    chamberIndex: {
      seq: "00",
      section: "chamberReceiver",
      label: "Chamber Index",
      type: "safe",
      summary: "Creates a complete chamber index with current target, section, load, and audit availability."
    },
    receiverHealth: {
      seq: "01",
      section: "chamberReceiver",
      label: "Receiver Health",
      type: "safe",
      summary: "Checks required participant loading, optional participant loading, receiver readiness, and basic chamber health."
    },
    targetAccess: {
      seq: "02",
      section: "chamberReceiver",
      label: "Target Access",
      type: "safe",
      summary: "Checks the diagnostic target frame and route access state without mutating the target."
    },
    loadSequence: {
      seq: "03",
      section: "chamberReceiver",
      label: "Load Sequence",
      type: "safe",
      summary: "Reports participant script load order, status, required flags, and timing."
    },
    aliasMap: {
      seq: "04",
      section: "chamberReceiver",
      label: "Alias Map / Receiver Alignment",
      type: "safe",
      summary: "Reports authority aliases and receiver alignment for all diagnostic participants."
    },

    northSignal: {
      seq: "05",
      section: "cardinalLab",
      label: "North Signal",
      type: "safe",
      summary: "Reports North diagnostic authority presence and the active North alias path."
    },
    eastSource: {
      seq: "06",
      section: "cardinalLab",
      label: "East Source",
      type: "safe",
      summary: "Reports East rail, East probe, and Lab East intake source state."
    },
    southLens: {
      seq: "07",
      section: "cardinalLab",
      label: "South Lens",
      type: "safe",
      summary: "Reports South diagnostic authority and South proof-return status."
    },
    southSurfacePointer: {
      seq: "08A",
      section: "cardinalLab",
      label: "South Surface Pointer",
      type: "safe",
      summary: "Reports South surface pointer sidecar presence and alias path."
    },
    labWestGate: {
      seq: "09A",
      section: "cardinalLab",
      label: "LabWest Gate",
      type: "safe",
      summary: "Reports LabWest admissibility gate presence and authority path."
    },
    westDiagnostic: {
      seq: "10A",
      section: "cardinalLab",
      label: "West Diagnostic",
      type: "safe",
      summary: "Reports West diagnostic participant presence and route-diagnostic track state."
    },

    eastSourceDetail: {
      seq: "11",
      section: "sourceSurface",
      label: "East Source Detail",
      type: "safe",
      summary: "Creates a detailed East source report including East rail, East probe, and Lab East."
    },
    surfaceTruthDetail: {
      seq: "12",
      section: "sourceSurface",
      label: "Surface Truth Detail",
      type: "safe",
      summary: "Creates a detailed Surface Truth report without canvas mutation or canvas release."
    },
    targetSurfaceAccess: {
      seq: "13A",
      section: "sourceSurface",
      label: "Target Surface Access",
      type: "safe",
      summary: "Reports target iframe access, path state, and surface-observation boundary."
    },
    canvasBoundary: {
      seq: "14A",
      section: "sourceSurface",
      label: "Canvas Boundary",
      type: "safe",
      summary: "Reports the no-touch canvas boundary and proves no visual-release claim was made."
    },

    northDirect: {
      seq: "15",
      section: "directExecution",
      label: "North Direct + Alias Probe",
      type: "direct",
      directKey: "northDirect",
      summary: "Creates a direct-check preview for North. Direct execution requires the Run Direct Check button."
    },
    eastDirect: {
      seq: "16",
      section: "directExecution",
      label: "East Direct",
      type: "direct",
      directKey: "eastDirect",
      summary: "Creates a direct-check preview for East. Direct execution requires the Run Direct Check button."
    },
    surfaceTruthDirect: {
      seq: "17",
      section: "directExecution",
      label: "Surface Truth Direct",
      type: "direct",
      directKey: "surfaceTruthDirect",
      summary: "Creates a direct-check preview for Surface Truth. Direct execution requires the Run Direct Check button."
    },
    southDirect: {
      seq: "18",
      section: "directExecution",
      label: "South Direct",
      type: "direct",
      directKey: "southDirect",
      summary: "Creates a direct-check preview for South. Direct execution requires the Run Direct Check button."
    },
    westDirect: {
      seq: "19",
      section: "directExecution",
      label: "West Diagnostic Direct",
      type: "direct",
      directKey: "westDirect",
      summary: "Creates a direct-check preview for West Diagnostic. Direct execution requires the Run Direct Check button."
    },

    noTouchBoundary: {
      seq: "20",
      section: "boundaryArchive",
      label: "No-Touch Boundary",
      type: "safe",
      summary: "Reports the production, canvas, controls, runtime-route, and target-renderer no-touch boundary."
    },
    nextMove: {
      seq: "21",
      section: "boundaryArchive",
      label: "Next Move",
      type: "safe",
      summary: "Creates the next lawful move synthesis from current loaded evidence and direct-check history."
    },
    deepArchive: {
      seq: "99",
      section: "boundaryArchive",
      label: "Deep Archive",
      type: "safe",
      summary: "Creates the full diagnostic archive for copying and transfer."
    }
  };

  var state = {
    initializedAt: nowIso(),
    updatedAt: nowIso(),
    activeSection: normalizeSection(readSession("activeSection", "chamberReceiver")),
    activeAudit: "",
    generatedPacket: null,
    generatedAuditId: "",
    generatedText: "",
    rawText: "",
    participantLoad: [],
    loadStarted: false,
    loadComplete: false,
    aliases: {},
    directResults: {},
    targetVisible: readSession("targetVisible", "false") === "true"
  };

  state.activeAudit = normalizeAudit(
    readSession("activeAudit", firstAuditForSection(state.activeSection)),
    state.activeSection
  );

  function $(id) {
    return doc.getElementById(id);
  }

  function onReady(fn) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function escapeHtml(value) {
    return safeString(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function compact(value, limit) {
    if (limit === undefined) limit = 16000;
    return safeString(value).replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function readSession(key, fallback) {
    try {
      return root.sessionStorage.getItem("hearthDiagnostic.selectorSurface." + key) || fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeSession(key, value) {
    try {
      root.sessionStorage.setItem("hearthDiagnostic.selectorSurface." + key, safeString(value));
    } catch (_error) {}
  }

  function sectionExists(sectionId) {
    return AUDIT_SECTIONS.some(function each(section) {
      return section.id === sectionId;
    });
  }

  function auditExists(auditId) {
    return Boolean(AUDITS[auditId]);
  }

  function getSection(sectionId) {
    var safeId = normalizeSection(sectionId);
    for (var i = 0; i < AUDIT_SECTIONS.length; i += 1) {
      if (AUDIT_SECTIONS[i].id === safeId) return AUDIT_SECTIONS[i];
    }
    return AUDIT_SECTIONS[0];
  }

  function normalizeSection(sectionId) {
    return sectionExists(sectionId) ? sectionId : "chamberReceiver";
  }

  function firstAuditForSection(sectionId) {
    var section = getSection(sectionId);
    return section.audits[0] || "chamberIndex";
  }

  function normalizeAudit(auditId, sectionId) {
    var section = getSection(sectionId);
    if (auditExists(auditId) && AUDITS[auditId].section === section.id) return auditId;
    return firstAuditForSection(section.id);
  }

  function persistState() {
    state.activeSection = normalizeSection(state.activeSection);
    state.activeAudit = normalizeAudit(state.activeAudit, state.activeSection);

    writeSession("activeSection", state.activeSection);
    writeSession("activeAudit", state.activeAudit);
    writeSession("targetVisible", state.targetVisible ? "true" : "false");
  }

  function getSelectedContext() {
    if (!auditExists(state.activeAudit)) {
      return {
        ok: false,
        reason: "NO_VALID_VISIBLE_AUDIT_BUTTON_STATE",
        selectedAuditId: state.activeAudit || "NONE",
        selectedSectionId: state.activeSection || "NONE",
        resolvedFrom: "VISIBLE_AUDIT_BUTTON_STATE"
      };
    }

    var audit = AUDITS[state.activeAudit];
    var section = getSection(audit.section);

    return {
      ok: true,
      reason: "SELECTED_AUDIT_RESOLVED",
      resolvedFrom: "VISIBLE_AUDIT_BUTTON_STATE",
      selectedAuditId: state.activeAudit,
      selectedAuditLabel: audit.label,
      selectedAuditSequence: audit.seq,
      selectedAuditType: audit.type,
      selectedSectionId: section.id,
      selectedSectionLabel: section.label,
      audit: audit,
      section: section
    };
  }

  function selectionProof(extra) {
    var context = getSelectedContext();

    var payload = {
      SELECTED_CATEGORY_ID: context.selectedSectionId || state.activeSection,
      SELECTED_CATEGORY_LABEL: context.selectedSectionLabel || getSection(state.activeSection).label,
      SELECTED_AUDIT_ID: context.selectedAuditId || state.activeAudit,
      SELECTED_AUDIT_LABEL: context.selectedAuditLabel || "UNKNOWN",
      SELECTED_AUDIT_SEQUENCE: context.selectedAuditSequence || "UNKNOWN",
      RESOLVED_FROM: context.resolvedFrom || "VISIBLE_AUDIT_BUTTON_STATE"
    };

    Object.assign(payload, extra || {});
    return payload;
  }

  function packetText(packet) {
    if (!packet || !isObject(packet)) return "";
    return Object.keys(packet).map(function line(key) {
      return key + "=" + lineValue(packet[key]);
    }).join("\n");
  }

  function lineValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (isFunction(value)) return "[function]";
    if (Array.isArray(value) || isObject(value)) {
      try {
        return compact(JSON.stringify(value, function replacer(_key, item) {
          return isFunction(item) ? "[function]" : item;
        }), 28000);
      } catch (_error) {
        return "[object]";
      }
    }
    return safeString(value);
  }

  function rawJson(packet) {
    try {
      return JSON.stringify(packet, function replacer(_key, value) {
        return isFunction(value) ? "[function]" : value;
      }, 2);
    } catch (_error) {
      return packetText(packet);
    }
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

  function normalizePath(src) {
    try {
      return new URL(src, root.location.origin).pathname;
    } catch (_error) {
      return safeString(src);
    }
  }

  function findScript(path) {
    var scripts = Array.prototype.slice.call(doc.querySelectorAll("script[src]"));

    for (var i = 0; i < scripts.length; i += 1) {
      var src = scripts[i].getAttribute("src") || scripts[i].src || "";
      if (normalizePath(src) === path || src === path || src.indexOf(path) !== -1) return scripts[i];
    }

    return null;
  }

  function getParticipantRecord(path) {
    for (var i = 0; i < state.participantLoad.length; i += 1) {
      if (state.participantLoad[i].path === path) return state.participantLoad[i];
    }
    return null;
  }

  function recordParticipant(result) {
    var existing = getParticipantRecord(result.path);
    if (existing) Object.assign(existing, result);
    else state.participantLoad.push(result);

    state.updatedAt = nowIso();
    renderStatus();
  }

  function loadParticipant(entry) {
    return new Promise(function participantPromise(resolve) {
      var existing = findScript(entry.path);

      if (existing) {
        var reused = {
          group: entry.group || "",
          role: entry.role || "",
          path: entry.path,
          required: Boolean(entry.required),
          status: "loaded",
          src: existing.getAttribute("src") || existing.src || entry.path,
          reused: true,
          settledAt: nowIso()
        };

        recordParticipant(reused);
        resolve(reused);
        return;
      }

      var script = doc.createElement("script");
      var finished = false;

      function finish(status) {
        if (finished) return;
        finished = true;

        var result = {
          group: entry.group || "",
          role: entry.role || "",
          path: entry.path,
          required: Boolean(entry.required),
          status: status,
          src: entry.path,
          reused: false,
          settledAt: nowIso()
        };

        recordParticipant(result);
        resolve(result);
      }

      script.src = entry.path;
      script.defer = true;
      script.dataset.hearthDiagnosticParticipant = "true";
      script.dataset.hearthDiagnosticParticipantRole = entry.role || "";
      script.dataset.hearthDiagnosticRequired = entry.required ? "true" : "false";
      script.dataset.hearthDiagnosticController = INTERNAL_RENEWAL_CONTRACT;

      script.onload = function onload() {
        finish("loaded");
      };

      script.onerror = function onerror() {
        finish(entry.required ? "error_required" : "error_optional");
      };

      root.setTimeout(function timeout() {
        finish(entry.required ? "timeout_required" : "timeout_optional");
      }, 4500);

      doc.head.appendChild(script);
    });
  }

  function loadParticipants() {
    state.loadStarted = true;
    state.loadComplete = false;
    renderStatus();

    var chain = Promise.resolve();

    PARTICIPANT_GROUPS.forEach(function eachGroup(group) {
      chain = chain.then(function loadGroup() {
        var entries = group.participants.map(function attachGroup(item) {
          return Object.assign({}, item, { group: group.group });
        });

        return Promise.all(entries.map(loadParticipant));
      });
    });

    return chain.then(function loaded() {
      state.loadComplete = true;
      state.updatedAt = nowIso();
      probeAliases();
      renderStatus();
      publishApi();
      return state.participantLoad;
    });
  }

  function methodKeys(value) {
    if (!isObject(value) && !isFunction(value)) return [];
    try {
      return Object.keys(value).filter(function filterMethod(key) {
        return isFunction(value[key]);
      });
    } catch (_error) {
      return [];
    }
  }

  function probeAlias(alias) {
    var value = readPath(alias);
    var found = value !== null && value !== undefined;
    var methods = methodKeys(value);

    return {
      alias: alias,
      found: found,
      valueType: found ? typeof value : "undefined",
      methodCount: methods.length,
      methodKeys: methods.join(","),
      contract: found && isObject(value) ? safeString(value.CONTRACT || value.contract || "UNKNOWN") : "UNKNOWN",
      receipt: found && isObject(value) ? safeString(value.RECEIPT || value.receipt || "UNKNOWN") : "UNKNOWN",
      internalRenewalContract: found && isObject(value)
        ? safeString(
            value.INTERNAL_RENEWAL_CONTRACT ||
            value.internalRenewalContract ||
            value.RECEIPT_LIGHT_CALLABLE_BRIDGE_CONTRACT ||
            value.receiptLightCallableBridgeContract ||
            "UNKNOWN"
          )
        : "UNKNOWN"
    };
  }

  function probeAliases() {
    var output = {};

    Object.keys(ALIASES).forEach(function eachGroup(groupKey) {
      var probes = ALIASES[groupKey].map(probeAlias);
      var first = probes.find(function findFound(item) {
        return item.found;
      });

      output[groupKey] = {
        label: groupKey,
        present: Boolean(first),
        authorityPath: first ? first.alias : "NONE",
        valueType: first ? first.valueType : "undefined",
        methodCount: first ? first.methodCount : 0,
        methodKeys: first ? first.methodKeys : "",
        probe: probes
      };
    });

    state.aliases = output;
    state.updatedAt = nowIso();
    return output;
  }

  function aliasSummary(groupKey) {
    var aliases = state.aliases && Object.keys(state.aliases).length ? state.aliases : probeAliases();
    return aliases[groupKey] || {
      label: groupKey,
      present: false,
      authorityPath: "NONE",
      valueType: "undefined",
      methodCount: 0,
      methodKeys: "",
      probe: []
    };
  }

  function scoreCandidate(value, alias, config) {
    var score = 0;
    if (!value) return -9999;
    if (alias === config.authorityPath) score += 20;
    if (isObject(value)) score += 10;
    if (isFunction(value)) score += 5;

    var keys = methodKeys(value);
    if (keys.length) score += 30;

    for (var i = 0; i < config.methods.length; i += 1) {
      if (value && isFunction(value[config.methods[i]])) score += 100;
    }

    return score;
  }

  function resolveAuthority(config) {
    var candidates = [];

    (config.aliases || []).forEach(function inspectAlias(alias) {
      var value = readPath(alias);
      var probe = probeAlias(alias);

      if (probe.found) {
        candidates.push({
          alias: alias,
          value: value,
          probe: probe,
          score: scoreCandidate(value, alias, config)
        });
      }
    });

    candidates.sort(function sortByScore(a, b) {
      return b.score - a.score;
    });

    var best = candidates.length ? candidates[0] : null;

    return {
      authority: best ? best.value : null,
      authorityPath: best ? best.alias : config.authorityPath,
      present: Boolean(best),
      valueType: best ? best.probe.valueType : "undefined",
      candidates: candidates.map(function compactCandidate(candidate) {
        return {
          alias: candidate.alias,
          score: candidate.score,
          valueType: candidate.probe.valueType,
          methodCount: candidate.probe.methodCount,
          methodKeys: candidate.probe.methodKeys,
          contract: candidate.probe.contract,
          receipt: candidate.probe.receipt,
          internalRenewalContract: candidate.probe.internalRenewalContract
        };
      }),
      probes: (config.aliases || []).map(probeAlias)
    };
  }

  function getReadableReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    try {
      if (isFunction(authority.getReceiptLight)) {
        var light = authority.getReceiptLight();
        if (isObject(light)) return light;
      }

      if (isFunction(authority.getCallableReceiptLight)) {
        var callable = authority.getCallableReceiptLight();
        if (isObject(callable)) return callable;
      }

      if (isFunction(authority.getReport)) {
        var report = authority.getReport();
        if (isObject(report)) return report;
      }

      if (isFunction(authority.getReceipt)) {
        var receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      }
    } catch (_error) {}

    return authority;
  }

  function runFallbackGlobal(config) {
    var names = config.fallbackGlobals || [];

    for (var i = 0; i < names.length; i += 1) {
      var fn = readPath(names[i]);
      if (isFunction(fn)) {
        return {
          called: true,
          method: names[i],
          packet: fn()
        };
      }
    }

    return { called: false };
  }

  function runDirectCheck(directKey) {
    var config = DIRECT_CONFIG[directKey];
    var audit = AUDITS[directKey];

    if (!config || !audit) {
      return errorPacket("DIRECT_CONFIG_NOT_FOUND", directKey || "UNKNOWN_DIRECT");
    }

    var resolved = resolveAuthority(config);
    var authority = resolved.authority;
    var authorityMethodKeys = methodKeys(authority);

    var runExecuted = false;
    var readOnlyDirectReceipt = false;
    var directMethod = "NONE";
    var directError = "NONE";
    var directPacket = null;

    if (authority) {
      for (var i = 0; i < config.methods.length; i += 1) {
        var method = config.methods[i];

        if (isObject(authority) && isFunction(authority[method])) {
          try {
            directMethod = method;
            directPacket = authority[method]();
            runExecuted = true;
            break;
          } catch (caught) {
            directMethod = method;
            directError = caught && caught.message ? caught.message : String(caught);
            runExecuted = false;
            break;
          }
        }
      }

      if (!runExecuted && directError === "NONE") {
        try {
          var fallback = runFallbackGlobal(config);
          if (fallback.called) {
            directMethod = fallback.method;
            directPacket = fallback.packet;
            runExecuted = true;
          }
        } catch (caughtFallback) {
          directMethod = "GLOBAL_FALLBACK";
          directError = caughtFallback && caughtFallback.message
            ? caughtFallback.message
            : String(caughtFallback);
        }
      }

      if (!directPacket || !isObject(directPacket)) {
        directPacket = getReadableReceipt(authority);
        readOnlyDirectReceipt = Boolean(directPacket && isObject(directPacket));
      }
    }

    var directPacketKeys = directPacket && isObject(directPacket) ? Object.keys(directPacket) : [];

    var packet = basePacket(audit.seq, audit.label, config.component, {
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      AUDIT_ID: directKey,
      AUDIT_SECTION: audit.section,
      AUDIT_TYPE: "DIRECT",
      DIRECT_RECEIPT_SEQUENCE: config.directSeq,
      ROLE: config.role,
      SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",

      RUN_STATE: runExecuted
        ? "DIRECT_RUN_EXECUTED"
        : resolved.present
          ? "AUTHORITY_FOUND_NOT_RUN"
          : "AUTHORITY_NOT_FOUND",
      TRUST_STATE: resolved.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      BLOCKING: false,

      RUN_EXECUTED: runExecuted,
      READ_ONLY_DIRECT_RECEIPT: readOnlyDirectReceipt && !runExecuted,
      DIRECT_AUTHORITY_PATH: resolved.authorityPath,
      DIRECT_STATUS: runExecuted
        ? "DIRECT_RUN_EXECUTED"
        : resolved.present
          ? "AUTHORITY_FOUND_NOT_RUN"
          : "AUTHORITY_NOT_FOUND",
      DIRECT_METHOD: directMethod,
      DIRECT_ERROR: directError,
      AUTHORITY_METHOD_COUNT: authorityMethodKeys.length,
      AUTHORITY_METHOD_KEYS: authorityMethodKeys.join(","),
      RESOLVER_CANDIDATES: resolved.candidates,
      DIRECT_PACKET_KEYS: directPacketKeys.join(","),
      DIRECT_PACKET: directPacket && isObject(directPacket) ? directPacket : {},
      ALIAS_PROBE: resolved.probes,
      NEXT_ACTION: runExecuted ? "COPY_REPORT_OR_RUN_NEXT_AUDIT" : "INSPECT_AUTHORITY_AND_METHOD_SURFACE"
    });

    state.directResults[directKey] = packet;
    return packet;
  }

  function directPreview(directKey) {
    var config = DIRECT_CONFIG[directKey];
    var audit = AUDITS[directKey];

    if (!config || !audit) return errorPacket("DIRECT_CONFIG_NOT_FOUND", directKey || "UNKNOWN_DIRECT");

    var resolved = resolveAuthority(config);
    var methods = methodKeys(resolved.authority);

    return basePacket(audit.seq, audit.label, config.component, {
      RECEIPT_LEVEL: "3_DIRECT_PREVIEW",
      AUDIT_ID: directKey,
      AUDIT_SECTION: audit.section,
      AUDIT_TYPE: "DIRECT_PREVIEW",
      DIRECT_RECEIPT_SEQUENCE: config.directSeq,
      ROLE: config.role,
      RUN_STATE: "DIRECT_PREVIEW_NOT_EXECUTED",
      TRUST_STATE: resolved.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      EXECUTION_REQUIRED: true,
      RUN_EXECUTED: false,
      DIRECT_AUTHORITY_PATH: resolved.authorityPath,
      AUTHORITY_METHOD_COUNT: methods.length,
      AUTHORITY_METHOD_KEYS: methods.join(","),
      RESOLVER_CANDIDATES: resolved.candidates,
      ALIAS_PROBE: resolved.probes,
      NEXT_ACTION: "CLICK_RUN_DIRECT_CHECK_TO_EXECUTE"
    });
  }

  function getTargetAccess() {
    var frame = $("hearthDiagnosticTargetFrame");
    var frameDoc = null;
    var path = "UNKNOWN";
    var title = "UNKNOWN";
    var error = "NONE";

    try {
      frameDoc = frame && (frame.contentDocument || (frame.contentWindow && frame.contentWindow.document));
      if (frameDoc && frameDoc.location) path = frameDoc.location.pathname || "UNKNOWN";
      if (frameDoc && frameDoc.title) title = frameDoc.title || "UNKNOWN";
    } catch (caught) {
      error = caught && caught.message ? caught.message : "TARGET_FRAME_ACCESS_ERROR";
    }

    return {
      status: frameDoc ? "TARGET_ACCESS_CONFIRMED" : "TARGET_ACCESS_NOT_CONFIRMED",
      routeConfirmed: path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, ""),
      framePresent: Boolean(frame),
      frameAccessible: Boolean(frameDoc),
      error: error,
      targetPath: path,
      targetTitle: title
    };
  }

  function loadSummary() {
    var required = state.participantLoad.filter(function item(entry) {
      return entry.required;
    });

    var requiredBad = required.filter(function item(entry) {
      return entry.status !== "loaded";
    });

    var optionalBad = state.participantLoad.filter(function item(entry) {
      return !entry.required && entry.status !== "loaded";
    });

    return {
      requiredCount: required.length,
      requiredBadCount: requiredBad.length,
      optionalBadCount: optionalBad.length,
      allRequiredLoaded: requiredBad.length === 0 && state.loadComplete,
      allLoaded: state.participantLoad.length > 0 && state.participantLoad.every(function each(entry) {
        return entry.status === "loaded";
      })
    };
  }

  function basePacket(auditSeq, auditLabel, component, extra) {
    var proof = selectionProof();

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_SELECTOR_SURFACE_REPORT_" + safeString(auditSeq).replace(/[^A-Z0-9]/gi, "_") + "_v9_4_4_1",
      RECEIPT_LEVEL: "2_SELECTOR_SURFACE_AUDIT_REPORT",
      AUDIT_SEQUENCE: auditSeq,
      AUDIT_LABEL: auditLabel,
      COMPONENT: component,

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      BASELINE_INTERNAL_RENEWAL_CONTRACT: BASELINE_INTERNAL_RENEWAL_CONTRACT,

      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      WORKBENCH_MODEL: "VISIBLE_CATEGORY_BUTTONS_VISIBLE_AUDIT_BUTTONS_ONE_ACTION_SURFACE",
      REPORT_SOURCE_OF_TRUTH: "state.activeAudit_from_visible_audit_button",
      SELECTED_CATEGORY_ID: proof.SELECTED_CATEGORY_ID,
      SELECTED_CATEGORY_LABEL: proof.SELECTED_CATEGORY_LABEL,
      SELECTED_AUDIT_ID: proof.SELECTED_AUDIT_ID,
      SELECTED_AUDIT_LABEL: proof.SELECTED_AUDIT_LABEL,
      SELECTED_AUDIT_SEQUENCE: proof.SELECTED_AUDIT_SEQUENCE,
      RESOLVED_FROM: proof.RESOLVED_FROM,

      RUN_STATE: "REPORT_CREATED",
      TRUST_STATE: "CURRENT",
      BLOCKING: false,
      UPDATED_AT: nowIso()
    };

    Object.assign(packet, extra || {});
    Object.assign(packet, NO_CLAIMS);

    return packet;
  }

  function errorPacket(reason, auditId) {
    return {
      PACKET: "HEARTH_DIAGNOSTIC_SELECTOR_SURFACE_ERROR_v9_4_4_1",
      RECEIPT_LEVEL: "0_SELECTOR_SURFACE_ERROR",
      CONTRACT: CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      RUN_STATE: "REPORT_NOT_CREATED",
      TRUST_STATE: "FAILED",
      BLOCKING: true,
      ERROR_REASON: reason,
      SELECTED_AUDIT_ID: auditId || "UNKNOWN",
      REPORT_SOURCE_OF_TRUTH: "state.activeAudit_from_visible_audit_button",
      RESOLVED_FROM: "VISIBLE_AUDIT_BUTTON_STATE",
      UPDATED_AT: nowIso()
    };
  }

  function buildReport(auditId) {
    if (!auditExists(auditId)) return errorPacket("INVALID_AUDIT_ID_NO_FALLBACK", auditId);

    var audit = AUDITS[auditId];

    if (audit.type === "direct") return directPreview(audit.directKey);

    var aliases = probeAliases();
    var summary = loadSummary();
    var target = getTargetAccess();

    if (auditId === "chamberIndex") {
      return basePacket(audit.seq, audit.label, "CHAMBER", {
        RECEIPT_LEVEL: "1_CHAMBER_INDEX",
        AUDIT_ID: auditId,
        VERSION: VERSION,
        USER_FLOW: "CHOOSE_VISIBLE_CATEGORY_CHOOSE_VISIBLE_AUDIT_CREATE_REPORT_COPY_REPORT",
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        PARTICIPANT_LOAD_COUNT: state.participantLoad.length,
        ACTIVE_SECTION: state.activeSection,
        ACTIVE_AUDIT: state.activeAudit,
        SECTION_COUNT: AUDIT_SECTIONS.length,
        AUDIT_COUNT: Object.keys(AUDITS).length,
        AVAILABLE_SECTIONS: AUDIT_SECTIONS.map(function mapSection(section) {
          return section.id + ":" + section.label;
        }).join(","),
        NEXT_ACTION: "CHOOSE_AUDIT_AND_CREATE_REPORT"
      });
    }

    if (auditId === "receiverHealth") {
      return basePacket(audit.seq, audit.label, "RECEIVER", {
        AUDIT_ID: auditId,
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        ALL_PARTICIPANTS_LOADED: summary.allLoaded,
        REQUIRED_COUNT: summary.requiredCount,
        REQUIRED_BAD_COUNT: summary.requiredBadCount,
        OPTIONAL_BAD_COUNT: summary.optionalBadCount,
        PARTICIPANT_LOAD_COUNT: state.participantLoad.length,
        NORTH_FOUND: aliases.NORTH.present,
        EAST_FOUND: aliases.EAST.present,
        SURFACE_TRUTH_FOUND: aliases.SURFACE_TRUTH.present,
        SOUTH_FOUND: aliases.SOUTH.present,
        LABWEST_FOUND: aliases.LABWEST.present,
        WEST_DIAGNOSTIC_FOUND: aliases.WEST_DIAGNOSTIC.present,
        RECEIVER_STATUS: summary.allRequiredLoaded ? "RECEIVER_READY" : "RECEIVER_LOAD_INCOMPLETE",
        NEXT_ACTION: summary.allRequiredLoaded ? "CREATE_TARGET_OR_ALIAS_REPORT" : "INSPECT_LOAD_SEQUENCE"
      });
    }

    if (auditId === "targetAccess") {
      return basePacket(audit.seq, audit.label, "TARGET_ACCESS", Object.assign({
        AUDIT_ID: auditId
      }, target));
    }

    if (auditId === "loadSequence") {
      return basePacket(audit.seq, audit.label, "PARTICIPANT_LOAD_SEQUENCE", {
        AUDIT_ID: auditId,
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        REQUIRED_COUNT: summary.requiredCount,
        REQUIRED_BAD_COUNT: summary.requiredBadCount,
        OPTIONAL_BAD_COUNT: summary.optionalBadCount,
        PARTICIPANT_LOAD: state.participantLoad,
        PARTICIPANT_LOAD_PATHS: state.participantLoad.map(function mapEntry(entry) {
          return entry.path + ":" + entry.status;
        }).join(",")
      });
    }

    if (auditId === "aliasMap") {
      return basePacket(audit.seq, audit.label, "ALIAS_MAP", {
        AUDIT_ID: auditId,
        NORTH_PRESENT: aliases.NORTH.present,
        LAB_NORTH_PRESENT: aliases.LAB_NORTH.present,
        LAB_EAST_PRESENT: aliases.LAB_EAST.present,
        LAB_SOUTH_PRESENT: aliases.LAB_SOUTH.present,
        LABWEST_PRESENT: aliases.LABWEST.present,
        EAST_PRESENT: aliases.EAST.present,
        EAST_PROBE_PRESENT: aliases.EAST_PROBE.present,
        SURFACE_TRUTH_PRESENT: aliases.SURFACE_TRUTH.present,
        SOUTH_PRESENT: aliases.SOUTH.present,
        SOUTH_SURFACE_POINTER_PRESENT: aliases.SOUTH_SURFACE_POINTER.present,
        WEST_DIAGNOSTIC_PRESENT: aliases.WEST_DIAGNOSTIC.present,
        ALIASES: aliases
      });
    }

    if (auditId === "northSignal") {
      return aliasReport(audit, auditId, "NORTH_SIGNAL", ["NORTH", "LAB_NORTH"]);
    }

    if (auditId === "eastSource") {
      return aliasReport(audit, auditId, "EAST_SOURCE", ["EAST", "EAST_PROBE", "LAB_EAST"]);
    }

    if (auditId === "southLens") {
      return aliasReport(audit, auditId, "SOUTH_LENS", ["SOUTH", "LAB_SOUTH"]);
    }

    if (auditId === "southSurfacePointer") {
      return aliasReport(audit, auditId, "SOUTH_SURFACE_POINTER", ["SOUTH_SURFACE_POINTER"]);
    }

    if (auditId === "labWestGate") {
      return aliasReport(audit, auditId, "LABWEST_GATE", ["LABWEST"]);
    }

    if (auditId === "westDiagnostic") {
      return aliasReport(audit, auditId, "WEST_DIAGNOSTIC", ["WEST_DIAGNOSTIC", "LABWEST"]);
    }

    if (auditId === "eastSourceDetail") {
      return aliasReport(audit, auditId, "EAST_SOURCE_DETAIL", ["EAST", "EAST_PROBE", "LAB_EAST"], {
        EAST_EXPECTED_ROLE: "F3_INTAKE_VALVE",
        EAST_EXPECTED_COORDINATE: "RT3D-X04_Y19_Z3"
      });
    }

    if (auditId === "surfaceTruthDetail") {
      return aliasReport(audit, auditId, "SURFACE_TRUTH_DETAIL", ["SURFACE_TRUTH"], {
        SURFACE_TRUTH_SCOPE: "CANVAS_SURFACE_TRUTH_PROBE_ONLY",
        CANVAS_MUTATION_AUTHORIZED: false,
        VISUAL_PASS_CLAIMED: false
      });
    }

    if (auditId === "targetSurfaceAccess") {
      return basePacket(audit.seq, audit.label, "TARGET_SURFACE_ACCESS", {
        AUDIT_ID: auditId,
        TARGET_ACCESS: target,
        SURFACE_TRUTH_PRESENT: aliases.SURFACE_TRUTH.present,
        SURFACE_TRUTH_AUTHORITY_PATH: aliases.SURFACE_TRUTH.authorityPath,
        TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED: false,
        CANVAS_RELEASE_AUTHORIZED: false
      });
    }

    if (auditId === "canvasBoundary") {
      return boundaryReport(audit, auditId, "CANVAS_BOUNDARY");
    }

    if (auditId === "noTouchBoundary") {
      return boundaryReport(audit, auditId, "NO_TOUCH_BOUNDARY");
    }

    if (auditId === "nextMove") {
      return nextMoveReport(audit);
    }

    if (auditId === "deepArchive") {
      return deepArchiveReport(audit);
    }

    return basePacket(audit.seq, audit.label, "UNKNOWN", {
      AUDIT_ID: auditId,
      RUN_STATE: "AUDIT_BUILDER_NOT_DEFINED",
      TRUST_STATE: "FAILED"
    });
  }

  function aliasReport(audit, auditId, component, groupKeys, extra) {
    var aliases = probeAliases();
    var payload = {
      AUDIT_ID: auditId,
      COMPONENT_SCOPE: component,
      GROUPS_TESTED: groupKeys.join(",")
    };

    groupKeys.forEach(function each(groupKey) {
      var item = aliases[groupKey] || aliasSummary(groupKey);
      payload[groupKey + "_PRESENT"] = Boolean(item.present);
      payload[groupKey + "_AUTHORITY_PATH"] = item.authorityPath || "NONE";
      payload[groupKey + "_VALUE_TYPE"] = item.valueType || "undefined";
      payload[groupKey + "_METHOD_COUNT"] = item.methodCount || 0;
      payload[groupKey + "_METHOD_KEYS"] = item.methodKeys || "";
      payload[groupKey + "_PROBE"] = item.probe || [];
    });

    Object.assign(payload, extra || {});
    return basePacket(audit.seq, audit.label, component, payload);
  }

  function boundaryReport(audit, auditId, component) {
    return basePacket(audit.seq, audit.label, component, {
      AUDIT_ID: auditId,
      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      CONTROLS_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED: false,
      F13_CLAIMED: false,
      F21_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      BOUNDARY_REASON: "DIAGNOSTIC_REPORT_ONLY_NO_PRODUCTION_ACTION_AUTHORIZED",
      NEXT_ACTION: "COPY_BOUNDARY_REPORT_OR_CREATE_NEXT_MOVE"
    });
  }

  function nextMoveReport(audit) {
    var aliases = probeAliases();
    var summary = loadSummary();

    var directRun = Object.keys(state.directResults).filter(function filterRun(key) {
      return state.directResults[key] && state.directResults[key].RUN_EXECUTED;
    });

    var firstBlocking = "NONE";
    var nextFile = "NONE";
    var nextAction = "CALIBRATION_REPORTING_READY";

    if (!state.loadComplete) {
      firstBlocking = "PARTICIPANT_LOAD";
      nextFile = DIAGNOSTIC_ROUTE;
      nextAction = "WAIT_FOR_PARTICIPANT_LOAD";
    } else if (!summary.allRequiredLoaded) {
      firstBlocking = "REQUIRED_PARTICIPANT_LOAD";
      nextFile = DIAGNOSTIC_ROUTE;
      nextAction = "CREATE_LOAD_SEQUENCE_REPORT";
    } else if (!aliases.LAB_EAST.present) {
      firstBlocking = "LAB_EAST";
      nextFile = "/assets/lab/runtime-table.east.js";
      nextAction = "CREATE_CARDINAL_LAB_EAST_REPORT";
    } else if (!aliases.LAB_SOUTH.present) {
      firstBlocking = "LAB_SOUTH";
      nextFile = "/assets/lab/runtime-table.south.js";
      nextAction = "CREATE_CARDINAL_LAB_SOUTH_REPORT";
    } else if (!state.directResults.eastDirect || !state.directResults.eastDirect.RUN_EXECUTED) {
      firstBlocking = "EAST_DIRECT";
      nextFile = "/assets/hearth/hearth.diagnostic.east.js";
      nextAction = "SELECT_DIRECT_EXECUTION_SECTION_AND_RUN_EAST_DIRECT";
    } else if (!state.directResults.surfaceTruthDirect || !state.directResults.surfaceTruthDirect.RUN_EXECUTED) {
      firstBlocking = "SURFACE_TRUTH_DIRECT";
      nextFile = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
      nextAction = "SELECT_DIRECT_EXECUTION_SECTION_AND_RUN_SURFACE_TRUTH_DIRECT";
    } else if (!state.directResults.southDirect || !state.directResults.southDirect.RUN_EXECUTED) {
      firstBlocking = "SOUTH_DIRECT";
      nextFile = "/assets/hearth/hearth.diagnostic.south.js";
      nextAction = "SELECT_DIRECT_EXECUTION_SECTION_AND_RUN_SOUTH_DIRECT";
    } else if (!state.directResults.westDirect || !state.directResults.westDirect.RUN_EXECUTED) {
      firstBlocking = "WEST_DIRECT";
      nextFile = "/assets/hearth/hearth.diagnostic.west.js";
      nextAction = "SELECT_DIRECT_EXECUTION_SECTION_AND_RUN_WEST_DIRECT";
    }

    return basePacket(audit.seq, audit.label, "NEXT_LAWFUL_MOVE", {
      RECEIPT_LEVEL: "4_SYNTHESIS",
      AUDIT_ID: "nextMove",
      SCOPE: "FINAL_FOCUSED_SYNTHESIS",
      FIRST_BLOCKING_COMPONENT: firstBlocking,
      FIRST_BLOCKING_REASON: firstBlocking === "NONE" ? "NONE" : "CALIBRATION_REMAINING",
      TRUSTED_AUDITS_USED: "00,01,02,03,04,05,06,07,08A,09A,10A,11,12,13A,14A,20",
      DIRECT_CHECKS_AVAILABLE: "northDirect,eastDirect,surfaceTruthDirect,southDirect,westDirect",
      DIRECT_CHECKS_RUN: directRun.length ? directRun.join(",") : "NONE",
      QUARANTINED_RECEIPTS: "NONE",
      HTML_RECEIVER_BLOCKING: false,
      NEXT_FILE: nextFile,
      NEXT_ACTION: nextAction,
      DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,TARGET_ROUTE_RENDERER"
    });
  }

  function deepArchiveReport(audit) {
    var aliases = probeAliases();

    return {
      PACKET: "HEARTH_DIAGNOSTIC_SELECTOR_SURFACE_DEEP_ARCHIVE_99_v9_4_4_1",
      RECEIPT_LEVEL: "5_DEEP_ARCHIVE",
      AUDIT_SEQUENCE: audit.seq,
      AUDIT_LABEL: audit.label,
      AUDIT_ID: "deepArchive",

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      BASELINE_INTERNAL_RENEWAL_CONTRACT: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      WORKBENCH_MODEL: "VISIBLE_CATEGORY_BUTTONS_VISIBLE_AUDIT_BUTTONS_ONE_ACTION_SURFACE",
      REPORT_SOURCE_OF_TRUTH: "state.activeAudit_from_visible_audit_button",

      STATE: {
        initializedAt: state.initializedAt,
        updatedAt: nowIso(),
        activeSection: state.activeSection,
        activeAudit: state.activeAudit,
        generatedAuditId: state.generatedAuditId,
        loadStarted: state.loadStarted,
        loadComplete: state.loadComplete,
        participantLoad: state.participantLoad,
        loadSummary: loadSummary(),
        targetAccess: getTargetAccess(),
        aliases: aliases,
        directResults: state.directResults,
        auditSections: AUDIT_SECTIONS,
        audits: AUDITS
      },

      NO_CLAIMS: NO_CLAIMS,
      UPDATED_AT: nowIso()
    };
  }

  function renderCategorySurface() {
    var holder = $("categorySelectorSurface");
    if (!holder) return;

    holder.innerHTML = AUDIT_SECTIONS.map(function categoryButton(section) {
      var active = section.id === state.activeSection ? " is-active" : "";
      return [
        '<button class="category-choice',
        active,
        '" type="button" data-category-id="',
        escapeHtml(section.id),
        '" aria-pressed="',
        section.id === state.activeSection ? "true" : "false",
        '">',
        '<span>Category</span>',
        '<strong>',
        escapeHtml(section.label),
        '</strong>',
        '<small>',
        escapeHtml(section.hint),
        '</small>',
        '</button>'
      ].join("");
    }).join("");
  }

  function renderAuditSurface() {
    var holder = $("auditSelectorSurface");
    if (!holder) return;

    var section = getSection(state.activeSection);

    holder.innerHTML = section.audits.map(function auditButton(auditId) {
      var audit = AUDITS[auditId];
      var active = auditId === state.activeAudit ? " is-active" : "";
      var type = audit.type === "direct" ? "Direct" : "Safe";

      return [
        '<button class="audit-choice',
        active,
        '" type="button" data-audit-id="',
        escapeHtml(auditId),
        '" aria-pressed="',
        auditId === state.activeAudit ? "true" : "false",
        '">',
        '<span>',
        escapeHtml(audit.seq),
        '</span>',
        '<div><strong>',
        escapeHtml(audit.label),
        '</strong><small>',
        escapeHtml(type + " · " + audit.summary),
        '</small></div>',
        '</button>'
      ].join("");
    }).join("");
  }

  function selectCategory(sectionId) {
    if (!sectionExists(sectionId)) {
      showToast("Invalid category");
      return false;
    }

    state.activeSection = sectionId;
    state.activeAudit = firstAuditForSection(sectionId);
    persistState();

    clearReportForSelection();
    renderWorkbench();
    return true;
  }

  function selectAudit(auditId) {
    if (!auditExists(auditId)) {
      showToast("Invalid audit");
      return false;
    }

    state.activeAudit = auditId;
    state.activeSection = AUDITS[auditId].section;
    persistState();

    clearReportForSelection();
    renderWorkbench();
    return true;
  }

  function renderSelectedAudit() {
    var context = getSelectedContext();

    if (!context.ok) {
      setText("selectedSectionLabel", getSection(state.activeSection).label);
      setText("selectedAuditTitle", "Invalid audit selection");
      setText("selectedAuditSummary", "Choose a valid audit from the visible audit selector.");
      setText("selectedAuditMeta", "INVALID");
      setDirectButton(false);
      return;
    }

    setText("selectedSectionLabel", context.selectedSectionLabel);
    setText("selectedAuditTitle", context.selectedAuditLabel);
    setText("selectedAuditSummary", context.audit.summary);
    setText("selectedAuditMeta", context.selectedAuditSequence + " · " + context.selectedAuditType.toUpperCase());

    setDirectButton(context.audit.type === "direct");
  }

  function setDirectButton(isDirect) {
    var runDirect = $("runDirectReport");
    if (runDirect) {
      runDirect.disabled = !isDirect;
      runDirect.hidden = !isDirect;
    }
  }

  function renderStatus() {
    var holder = $("statusStrip");
    if (!holder) return;

    var aliases = state.aliases && Object.keys(state.aliases).length ? state.aliases : probeAliases();
    var summary = loadSummary();
    var target = getTargetAccess();

    var items = [
      ["Load", summary.allRequiredLoaded, state.loadComplete ? "required" : "loading"],
      ["Target", target.frameAccessible && target.routeConfirmed, target.targetPath],
      ["North", aliases.NORTH.present, aliases.NORTH.authorityPath],
      ["East", aliases.EAST.present, aliases.EAST.authorityPath],
      ["Surface", aliases.SURFACE_TRUTH.present, aliases.SURFACE_TRUTH.authorityPath],
      ["South", aliases.SOUTH.present, aliases.SOUTH.authorityPath],
      ["Pointer", aliases.SOUTH_SURFACE_POINTER.present, aliases.SOUTH_SURFACE_POINTER.authorityPath],
      ["LabWest", aliases.LABWEST.present, aliases.LABWEST.authorityPath],
      ["West", aliases.WEST_DIAGNOSTIC.present, aliases.WEST_DIAGNOSTIC.authorityPath]
    ];

    holder.innerHTML = items.map(function chip(item) {
      var importantMissing = ["Load", "Target", "East", "Surface", "South", "LabWest", "West"].indexOf(item[0]) !== -1 && !item[1];
      var cls = item[1] ? "good" : importantMissing ? "bad" : "warn";
      return [
        '<div class="status-chip-mini ',
        cls,
        '"><b>',
        escapeHtml(item[0]),
        '</b><span>',
        escapeHtml(item[1] ? "FOUND" : "HELD"),
        '</span></div>'
      ].join("");
    }).join("");
  }

  function renderReport(packet, mode, auditId) {
    var audit = AUDITS[auditId] || AUDITS[state.activeAudit] || null;
    var text = packetText(packet);
    var raw = rawJson(packet);

    state.generatedPacket = packet;
    state.generatedAuditId = auditId || state.activeAudit;
    state.generatedText = text;
    state.rawText = raw;
    state.updatedAt = nowIso();

    setText("reportTitle", audit ? audit.label : safeString(packet.AUDIT_LABEL, "Workbench Error"));
    setText("reportMeta", mode || "REPORT_CREATED");
    setText("generatedReport", text);
    setText("rawReport", raw);

    var output = $("reportOutput");
    if (output) output.hidden = false;

    var rawOutput = $("rawOutput");
    if (rawOutput) rawOutput.hidden = true;

    var copyReport = $("copyReport");
    if (copyReport) copyReport.disabled = false;

    var copyRaw = $("copyRaw");
    if (copyRaw) copyRaw.disabled = false;
  }

  function createReport() {
    var context = getSelectedContext();

    if (!context.ok) {
      var error = errorPacket(context.reason, context.selectedAuditId);
      renderReport(error, "REPORT_NOT_CREATED", state.activeAudit);
      showToast("Invalid audit selection");
      return error;
    }

    var packet = buildReport(context.selectedAuditId);
    renderReport(
      packet,
      context.audit.type === "direct" ? "DIRECT_PREVIEW_CREATED" : "REPORT_CREATED",
      context.selectedAuditId
    );

    showToast("Report created");
    return packet;
  }

  function runSelectedDirectCheck() {
    var context = getSelectedContext();

    if (!context.ok) {
      showToast("Invalid audit selection");
      return null;
    }

    if (context.audit.type !== "direct") {
      showToast("Selected audit is not direct");
      return null;
    }

    var packet = runDirectCheck(context.audit.directKey);
    renderReport(packet, "DIRECT_CHECK_EXECUTED", context.selectedAuditId);
    showToast("Direct check complete");
    return packet;
  }

  function copyCurrentReport() {
    if (!state.generatedText) createReport();
    copyText(state.generatedText, "Report copied");
  }

  function copyCurrentRaw() {
    if (!state.rawText) createReport();
    copyText(state.rawText, "Raw copied");
  }

  function copyDeepArchive() {
    state.activeSection = "boundaryArchive";
    state.activeAudit = "deepArchive";
    persistState();

    renderWorkbench();

    var packet = deepArchiveReport(AUDITS.deepArchive);
    var raw = rawJson(packet);

    state.generatedPacket = packet;
    state.generatedAuditId = "deepArchive";
    state.generatedText = packetText(packet);
    state.rawText = raw;

    setText("reportTitle", AUDITS.deepArchive.label);
    setText("reportMeta", "DEEP_ARCHIVE_CREATED");
    setText("generatedReport", state.generatedText);
    setText("rawReport", raw);

    var output = $("reportOutput");
    if (output) output.hidden = false;

    var copyReport = $("copyReport");
    if (copyReport) copyReport.disabled = false;

    var copyRaw = $("copyRaw");
    if (copyRaw) copyRaw.disabled = false;

    copyText(raw, "Deep archive copied");
  }

  function clearReportForSelection() {
    state.generatedPacket = null;
    state.generatedAuditId = "";
    state.generatedText = "";
    state.rawText = "";

    setText("reportTitle", "No Report Created");
    setText("reportMeta", "WAITING");
    setText("generatedReport", "Choose a category, choose an audit, then create a report.");
    setText("rawReport", "");

    var copyReport = $("copyReport");
    if (copyReport) copyReport.disabled = true;

    var copyRaw = $("copyRaw");
    if (copyRaw) copyRaw.disabled = true;

    var rawOutput = $("rawOutput");
    if (rawOutput) rawOutput.hidden = true;
  }

  function resetReport() {
    clearReportForSelection();
    showToast("Report reset");
  }

  function toggleRawOutput() {
    var rawOutput = $("rawOutput");
    if (!rawOutput) return;

    if (!state.rawText) createReport();

    rawOutput.hidden = !rawOutput.hidden;
  }

  function toggleTarget() {
    state.targetVisible = !state.targetVisible;
    persistState();

    var panel = $("targetPanel");
    if (panel) panel.hidden = !state.targetVisible;

    renderStatus();
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = safeString(value);
  }

  function copyText(text, label) {
    var value = safeString(text);

    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(value).then(function copied() {
        showToast(label || "Copied");
      }).catch(function fallback() {
        fallbackCopy(value, label);
      });
    } else {
      fallbackCopy(value, label);
    }
  }

  function fallbackCopy(text, label) {
    var area = doc.createElement("textarea");
    area.value = safeString(text);
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    doc.body.appendChild(area);
    area.select();

    try {
      doc.execCommand("copy");
      showToast(label || "Copied");
    } catch (_error) {
      showToast("Copy unavailable");
    }

    doc.body.removeChild(area);
  }

  function showToast(message) {
    var toast = $("toast");
    if (!toast) return;

    toast.textContent = safeString(message, "Done");
    toast.classList.add("show");

    root.setTimeout(function hideToast() {
      toast.classList.remove("show");
    }, 1200);
  }

  function bind(id, eventName, handler) {
    var node = $(id);
    if (!node) return;
    node.addEventListener(eventName, handler);
  }

  function installActions() {
    bind("categorySelectorSurface", "click", function onCategorySurfaceClick(event) {
      var button = event.target.closest("[data-category-id]");
      if (!button) return;
      selectCategory(button.dataset.categoryId);
    });

    bind("auditSelectorSurface", "click", function onAuditSurfaceClick(event) {
      var button = event.target.closest("[data-audit-id]");
      if (!button) return;
      selectAudit(button.dataset.auditId);
    });

    bind("createReport", "click", createReport);
    bind("runDirectReport", "click", runSelectedDirectCheck);
    bind("copyReport", "click", copyCurrentReport);
    bind("copyRaw", "click", copyCurrentRaw);
    bind("copyArchive", "click", copyDeepArchive);
    bind("resetReport", "click", resetReport);
    bind("toggleRaw", "click", toggleRawOutput);
    bind("toggleTarget", "click", toggleTarget);

    bind("reloadChamber", "click", function reloadChamber() {
      root.location.reload();
    });

    bind("hearthDiagnosticTargetFrame", "load", function frameLoaded() {
      renderStatus();
    });
  }

  function renderWorkbench() {
    state.activeSection = normalizeSection(state.activeSection);
    state.activeAudit = normalizeAudit(state.activeAudit, state.activeSection);

    renderCategorySurface();
    renderAuditSurface();
    renderSelectedAudit();
    persistState();
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      htmlShellContract: HTML_SHELL_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      baselineInternalRenewalContract: BASELINE_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,

      state: state,
      auditSections: AUDIT_SECTIONS,
      audits: AUDITS,
      aliases: ALIASES,
      directConfig: DIRECT_CONFIG,

      chooseSection: selectCategory,
      chooseAudit: selectAudit,
      getSelectedContext: getSelectedContext,

      createReport: createReport,
      runSelectedDirectCheck: runSelectedDirectCheck,
      copyCurrentReport: copyCurrentReport,
      copyCurrentRaw: copyCurrentRaw,
      copyDeepArchive: copyDeepArchive,

      buildReport: buildReport,
      runDirectCheck: runDirectCheck,
      probeAliases: probeAliases,
      getTargetAccess: getTargetAccess,
      loadParticipants: loadParticipants
    };

    root.HEARTH_DIAGNOSTIC_CHAMBER = api;
    root.HEARTH.diagnosticChamber = api;
    root.DEXTER_LAB.hearthDiagnosticChamber = api;

    root.__HEARTH_DIAGNOSTIC_CHAMBER_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_HTML_SHELL_CONTRACT__ = HTML_SHELL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_SINGLE_AUDIT_WORKBENCH_SELECTOR_SURFACE_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_REPORT_SOURCE_OF_TRUTH__ = "state.activeAudit_from_visible_audit_button";
    root.__HEARTH_DIAGNOSTIC_CHAMBER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_RUNTIME_RESTART_AUTHORIZED__ = false;
  }

  function boot() {
    state.activeSection = normalizeSection(state.activeSection);
    state.activeAudit = normalizeAudit(state.activeAudit, state.activeSection);
    persistState();

    setText("controllerContract", INTERNAL_RENEWAL_CONTRACT);

    installActions();
    renderWorkbench();
    renderStatus();
    clearReportForSelection();
    publishApi();

    var targetPanel = $("targetPanel");
    if (targetPanel) targetPanel.hidden = !state.targetVisible;

    loadParticipants().then(function afterLoad() {
      renderStatus();
      publishApi();
    });
  }

  onReady(boot);
})(typeof window !== "undefined" ? window : globalThis);
