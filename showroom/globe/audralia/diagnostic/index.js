// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2
// Full-file replacement.
// Functional coordinative renewal.
//
// CANONICAL AUTHORITY:
// - AUDRALIA_DIAGNOSTIC_ENGINE_BOUNDED_REPORT_AND_FIBONACCI_ALIGNMENT_PREWRITE_v1
// - AUDRALIA_DIAGNOSTIC_ENGINE_BOUNDED_REPORT_FINAL_TIGHTENING_v1
// - AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1
//
// N.E.W.S. / FIBONACCI AUTHORITY:
// - F21 / WEST:
//   Diagnostic interpretation.
// - F89 / RAIL:
//   Canonical report, receipt, ledger, archive, and public API commitment.
//
// LOAD ORDER:
// 15. index.inspection.lane.js
// 16. index.js
// 17. index.controls.js
//
// FUNCTIONAL TARGET:
// - Create Report must synchronously produce a report and receipt.
// - Missing external evidence must become READ Absence.
// - Missing inspection authority must not prevent minimum report creation.
// - External inspection does not veto report creation.
// - Direct and nine-cycle execution remain explicit.
// - No DOM event ownership.

(function installAudraliaDiagnosticEngine(global) {
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

  var CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

  var VERSION =
    "2.2.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.js";

  var AUTHORITY =
    "AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1";

  var REPORT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_v2";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT_v2";

  var ENGINE_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT_v2";

  var CYCLE_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v2";

  var ARCHIVE_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ARCHIVE_v2";

  var READ_KEYS =
    Object.freeze([
      "Result",
      "Evidence",
      "Absence",
      "Direction"
    ]);

  var FIBONACCI_STATIONS =
    Object.freeze([
      {
        cyclePosition: 1,
        fibonacci: "F1",
        role: "NORTH_PROBE_INTAKE",
        direction: "NORTH"
      },
      {
        cyclePosition: 2,
        fibonacci: "F3",
        role: "EAST_PROBE_SOURCE",
        direction: "EAST"
      },
      {
        cyclePosition: 3,
        fibonacci: "F5",
        role: "EAST_CONSTRUCTION_INTERPRETATION",
        direction: "EAST"
      },
      {
        cyclePosition: 4,
        fibonacci: "F8",
        role: "CANVAS_SURFACE_TRUTH",
        direction: "CENTER"
      },
      {
        cyclePosition: 5,
        fibonacci: "F13",
        role: "WEST_PROBE_RUNTIME",
        direction: "WEST"
      },
      {
        cyclePosition: 6,
        fibonacci: "F21",
        role: "WEST_RUNTIME_INTERPRETATION",
        direction: "WEST"
      },
      {
        cyclePosition: 7,
        fibonacci: "F34",
        role: "SOUTH_PROBE_HANDOFF",
        direction: "SOUTH"
      },
      {
        cyclePosition: 8,
        fibonacci: "F55",
        role: "SOUTH_RESTITUTION_INTERPRETATION",
        direction: "SOUTH"
      },
      {
        cyclePosition: 9,
        fibonacci: "F89",
        role: "RAIL_TERMINAL_SYNTHESIS",
        direction: "RAIL"
      }
    ]);

  var PARTICIPANT_MANIFEST =
    Object.freeze([
      {
        role: "NORTH_PROBE_INTAKE",
        label: "North Probe Intake",
        required: true,
        cyclePosition: 1,
        fibonacci: "F1",
        direction: "NORTH",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_NORTH",
          "AUDRALIA.diagnosticNorth"
        ],
        methods: [
          "probe",
          "inspect",
          "run"
        ]
      },
      {
        role: "EAST_PROBE_SOURCE",
        label: "East Probe Source",
        required: true,
        cyclePosition: 2,
        fibonacci: "F3",
        direction: "EAST",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_PROBE_EAST",
          "AUDRALIA.diagnosticProbeEast"
        ],
        methods: [
          "probe",
          "inspect",
          "run"
        ]
      },
      {
        role: "EAST_CONSTRUCTION_INTERPRETATION",
        label: "East Construction Interpretation",
        required: true,
        cyclePosition: 3,
        fibonacci: "F5",
        direction: "EAST",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_EAST",
          "AUDRALIA.diagnosticEast"
        ],
        methods: [
          "interpret",
          "construct",
          "run"
        ]
      },
      {
        role: "CANVAS_SURFACE_TRUTH",
        label: "Canvas Surface Truth",
        required: true,
        cyclePosition: 4,
        fibonacci: "F8",
        direction: "CENTER",
        aliases: [
          "CANVAS_SURFACE_TRUTH",
          "AUDRALIA_CANVAS_SURFACE_TRUTH",
          "AUDRALIA.canvasSurfaceTruth"
        ],
        methods: [
          "inspect",
          "probe",
          "run"
        ]
      },
      {
        role: "WEST_PROBE_RUNTIME",
        label: "West Probe Runtime",
        required: true,
        cyclePosition: 5,
        fibonacci: "F13",
        direction: "WEST",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
          "AUDRALIA.diagnosticProbeWest"
        ],
        methods: [
          "probe",
          "inspect",
          "run"
        ]
      },
      {
        role: "WEST_RUNTIME_INTERPRETATION",
        label: "West Runtime Interpretation",
        required: true,
        cyclePosition: 6,
        fibonacci: "F21",
        direction: "WEST",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_WEST",
          "AUDRALIA.diagnosticWest"
        ],
        methods: [
          "interpret",
          "run"
        ]
      },
      {
        role: "SOUTH_PROBE_HANDOFF",
        label: "South Probe Handoff",
        required: true,
        cyclePosition: 7,
        fibonacci: "F34",
        direction: "SOUTH",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
          "AUDRALIA.diagnosticProbeSouth"
        ],
        methods: [
          "probe",
          "inspect",
          "run"
        ]
      },
      {
        role: "SOUTH_RESTITUTION_INTERPRETATION",
        label: "South Restitution Interpretation",
        required: true,
        cyclePosition: 8,
        fibonacci: "F55",
        direction: "SOUTH",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_SOUTH",
          "AUDRALIA.diagnosticSouth"
        ],
        methods: [
          "interpret",
          "restore",
          "run"
        ]
      },
      {
        role: "RAIL_TERMINAL_SYNTHESIS",
        label: "Rail Terminal Synthesis",
        required: true,
        cyclePosition: 9,
        fibonacci: "F89",
        direction: "RAIL",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_RAIL",
          "AUDRALIA.diagnosticRail"
        ],
        methods: [
          "synthesize",
          "run"
        ]
      },
      {
        role: "NORTH_CONDUCTOR",
        label: "North Conductor",
        required: true,
        auxiliary: true,
        direction: "NORTH",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",
          "AUDRALIA.diagnosticNorthConductor"
        ],
        executionMethods: [
          "runNineCycle"
        ],
        registrationMethods: [
          "registerStation"
        ]
      },
      {
        role: "SOUTH_SURFACE_POINTER",
        label: "South Surface Pointer",
        required: false,
        auxiliary: true,
        parentCyclePosition: 8,
        parentFibonacci: "F55",
        direction: "SOUTH",
        aliases: [
          "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
          "AUDRALIA.diagnosticSouthSurfacePointer"
        ],
        methods: [
          "point",
          "inspect"
        ]
      }
    ]);

  var state = {
    initialized: false,
    reportStatus: "READY",
    currentReport: null,
    currentReceipt: null,
    reportsCreated: 0,
    directExecutions: 0,
    cycleExecutions: 0,
    cycleCommits: 0,
    archive: [],
    lastError: null,
    lastAction: null,
    selectedCategory: "ALL",
    selectedAudit: "READ",
    selectedParticipant: "ALL"
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function clone(value, seen) {
    var memory = seen || [];

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
      return value.map(function cloneItem(item) {
        return clone(item, memory.slice());
      });
    }

    var output = {};

    Object.keys(value).forEach(function cloneKey(key) {
      try {
        output[key] =
          clone(
            value[key],
            memory.slice()
          );
      } catch (error) {
        output[key] = {
          unreadable: true,
          message:
            error && error.message
              ? error.message
              : String(error)
        };
      }
    });

    return output;
  }

  function freeze(value, seen) {
    var memory = seen || [];

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

    Object.keys(value).forEach(function freezeKey(key) {
      try {
        freeze(
          value[key],
          memory
        );
      } catch (_error) {}
    });

    try {
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function frozenClone(value) {
    return freeze(
      clone(value)
    );
  }

  function normalizeError(error, action) {
    return freeze({
      action:
        action || "UNKNOWN",
      message:
        error && error.message
          ? String(error.message).slice(0, 2048)
          : String(error || "UNKNOWN_ERROR").slice(0, 2048),
      stack:
        error && error.stack
          ? String(error.stack).slice(0, 8192)
          : null,
      occurredAt:
        nowIso()
    });
  }

  function recordAction(action, detail) {
    state.lastAction = freeze({
      action: action,
      detail:
        clone(detail || null),
      occurredAt:
        nowIso()
    });

    publishEngineReceipt();
  }

  function getInspectionLane() {
    var inspection =
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE ||
      (
        root.AUDRALIA &&
        root.AUDRALIA.diagnosticInspectionLane
      ) ||
      null;

    if (
      inspection &&
      typeof inspection.runLane === "function"
    ) {
      return inspection;
    }

    return null;
  }

  function minimumLane(
    laneId,
    summary,
    absence,
    direction
  ) {
    return freeze({
      schema:
        "AUDRALIA_BOUNDED_DIAGNOSTIC_EVIDENCE_LANE_v1",
      laneId:
        laneId,
      status:
        "MISSING",
      summary:
        summary,
      evidence:
        [],
      absence:
        Array.isArray(absence)
          ? absence
          : [absence],
      direction:
        Array.isArray(direction)
          ? direction
          : [direction],
      data:
        null,
      metrics: {
        durationMs: 0,
        truncated: false
      },
      errors:
        [],
      createdAt:
        nowIso()
    });
  }

  function collectInspectionLanes() {
    var inspection =
      getInspectionLane();

    if (!inspection) {
      return [
        minimumLane(
          "inspectionAuthority",
          "The inspection authority was not available.",
          "The engine could not obtain bounded external inspection lanes.",
          "Load index.inspection.lane.js before index.js."
        )
      ];
    }

    var lanes = [];

    function addLane(laneId, inspector) {
      try {
        lanes.push(
          inspection.runLane(
            laneId,
            inspector
          )
        );
      } catch (error) {
        lanes.push(
          freeze({
            schema:
              "AUDRALIA_BOUNDED_DIAGNOSTIC_EVIDENCE_LANE_v1",
            laneId:
              laneId,
            status:
              "ERROR",
            summary:
              "The inspection request failed.",
            evidence:
              [],
            absence: [
              error && error.message
                ? error.message
                : String(error)
            ],
            direction: [
              "Inspect the inspection-lane receipt."
            ],
            data:
              null,
            metrics: {
              durationMs: 0,
              truncated: false
            },
            errors: [
              normalizeError(
                error,
                "collectInspectionLanes." + laneId
              )
            ],
            createdAt:
              nowIso()
          })
        );
      }
    }

    addLane(
      "participants",
      function inspectParticipants() {
        return inspection.inspectParticipants(
          PARTICIPANT_MANIFEST
        );
      }
    );

    addLane(
      "targetFrame",
      function inspectTargetFrame() {
        return inspection.inspectTargetFrame(
          "audraliaDiagnosticTargetFrame",
          "/showroom/globe/audralia/"
        );
      }
    );

    addLane(
      "runtimeMetadata",
      function inspectRuntime() {
        return inspection.inspectRuntime(
          null,
          {
            allowPixelRead: false
          }
        );
      }
    );

    addLane(
      "engineFamily",
      function inspectEngineFamily() {
        return inspection.inspectEngineFamily(
          null
        );
      }
    );

    return lanes;
  }

  function flattenLaneField(
    lanes,
    field
  ) {
    var output = [];

    lanes.forEach(function collectLaneField(lane) {
      if (
        lane &&
        Array.isArray(lane[field])
      ) {
        lane[field].forEach(function pushValue(value) {
          if (
            value !== null &&
            value !== undefined &&
            output.indexOf(String(value)) === -1
          ) {
            output.push(String(value));
          }
        });
      }
    });

    return output;
  }

  function determineReportStatus(lanes) {
    var statuses =
      lanes.map(function getStatus(lane) {
        return String(
          lane && lane.status
            ? lane.status
            : "UNKNOWN"
        ).toUpperCase();
      });

    if (
      statuses.indexOf("ERROR") !== -1 &&
      statuses.every(function onlyErrorOrMissing(status) {
        return (
          status === "ERROR" ||
          status === "MISSING"
        );
      })
    ) {
      return "AVAILABLE";
    }

    if (
      statuses.indexOf("HELD") !== -1 ||
      statuses.indexOf("MISSING") !== -1 ||
      statuses.indexOf("ERROR") !== -1 ||
      statuses.indexOf("UNKNOWN") !== -1
    ) {
      return "AVAILABLE";
    }

    return "AVAILABLE";
  }

  function calculateFibonacciSynchronization(lanes) {
    var participantLane =
      lanes.filter(function findParticipantLane(lane) {
        return lane.laneId === "participants";
      })[0] || null;

    var records =
      participantLane &&
      participantLane.data &&
      Array.isArray(
        participantLane.data.records
      )
        ? participantLane.data.records
        : [];

    var stations =
      FIBONACCI_STATIONS.map(function mapStation(station) {
        var record =
          records.filter(function matchingRecord(candidate) {
            return (
              candidate &&
              candidate.role === station.role
            );
          })[0] || null;

        var status =
          record
            ? record.available && record.callable
              ? "AVAILABLE"
              : record.available
                ? "HELD"
                : "MISSING"
            : "UNKNOWN";

        return {
          cyclePosition:
            station.cyclePosition,
          fibonacci:
            station.fibonacci,
          role:
            station.role,
          direction:
            station.direction,
          status:
            status,
          available:
            Boolean(
              record &&
              record.available
            ),
          callable:
            Boolean(
              record &&
              record.callable
            ),
          resolvedAlias:
            record
              ? record.resolvedAlias || null
              : null
        };
      });

    var availableCount =
      stations.filter(function availableStation(station) {
        return (
          station.available &&
          station.callable
        );
      }).length;

    var heldCount =
      stations.filter(function heldStation(station) {
        return (
          station.available &&
          !station.callable
        );
      }).length;

    var missingCount =
      stations.filter(function missingStation(station) {
        return !station.available;
      }).length;

    var structuralAligned =
      stations.length === 9 &&
      stations.every(function stationOrder(station, index) {
        return (
          station.cyclePosition === index + 1 &&
          station.fibonacci ===
            FIBONACCI_STATIONS[index].fibonacci &&
          station.role ===
            FIBONACCI_STATIONS[index].role
        );
      });

    var operationalAligned =
      availableCount === 9;

    return freeze({
      structuralAligned:
        structuralAligned,
      operationalAligned:
        operationalAligned,
      stationCount:
        stations.length,
      availableCount:
        availableCount,
      heldCount:
        heldCount,
      missingCount:
        missingCount,
      stations:
        stations,
      conductorRequired:
        true,
      sequentialFallbackAuthorized:
        false
    });
  }

  function buildRead(
    lanes,
    fibonacci
  ) {
    var evidence =
      flattenLaneField(
        lanes,
        "evidence"
      );

    var absence =
      flattenLaneField(
        lanes,
        "absence"
      );

    var direction =
      flattenLaneField(
        lanes,
        "direction"
      );

    lanes.forEach(function addLaneSummary(lane) {
      if (
        lane &&
        lane.summary &&
        (
          lane.status === "COMPLETE" ||
          lane.status === "AVAILABLE"
        )
      ) {
        evidence.push(
          lane.laneId +
          ": " +
          lane.summary
        );
      }
    });

    if (!evidence.length) {
      evidence.push(
        "The diagnostic engine created a bounded report receipt."
      );
    }

    if (!absence.length) {
      absence.push(
        "No additional absence was declared by the current bounded lanes."
      );
    }

    if (!direction.length) {
      direction.push(
        fibonacci.operationalAligned
          ? "The nine-station family is available for conductor-authorized execution."
          : "Use the receipt to identify the first missing or held station."
      );
    }

    var result;

    if (fibonacci.operationalAligned) {
      result =
        "The diagnostic family is structurally aligned and operationally available.";
    } else if (fibonacci.structuralAligned) {
      result =
        "The diagnostic family is structurally aligned. One or more operational authorities remain held, missing, or unknown.";
    } else {
      result =
        "A diagnostic report was created. Structural or operational synchronization remains incomplete.";
    }

    return freeze({
      Result:
        result,
      Evidence:
        evidence,
      Absence:
        absence,
      Direction:
        direction
    });
  }

  function makeReportReceipt(report) {
    return freeze({
      schema:
        RECEIPT_SCHEMA,
      receiptId:
        "AUDRALIA_DIAGNOSTIC_REPORT_RECEIPT_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2, 8),
      reportId:
        report.reportId,
      reportStatus:
        report.status,
      contract:
        CONTRACT,
      authority:
        AUTHORITY,
      fibonacci: {
        structuralAligned:
          report.fibonacci.structuralAligned,
        operationalAligned:
          report.fibonacci.operationalAligned,
        stationCount:
          report.fibonacci.stationCount,
        availableCount:
          report.fibonacci.availableCount,
        heldCount:
          report.fibonacci.heldCount,
        missingCount:
          report.fibonacci.missingCount
      },
      laneCount:
        report.lanes.length,
      readKeys:
        READ_KEYS.slice(),
      createdAt:
        report.createdAt
    });
  }

  function archiveReport(
    report,
    receipt
  ) {
    state.archive.push(
      freeze({
        schema:
          ARCHIVE_SCHEMA,
        report:
          frozenClone(report),
        receipt:
          frozenClone(receipt),
        archivedAt:
          nowIso()
      })
    );

    if (state.archive.length > 64) {
      state.archive.shift();
    }
  }

  function createMinimumErrorReport(error) {
    var normalized =
      normalizeError(
        error,
        "createReport"
      );

    var report = freeze({
      schema:
        REPORT_SCHEMA,
      reportId:
        "AUDRALIA_DIAGNOSTIC_REPORT_" +
        Date.now(),
      status:
        "ERROR",
      category:
        state.selectedCategory,
      audit:
        state.selectedAudit,
      participant:
        state.selectedParticipant,
      READ: {
        Result:
          "The engine could not complete normal report construction.",
        Evidence: [
          "The engine remained available long enough to produce an error receipt."
        ],
        Absence: [
          normalized.message
        ],
        Direction: [
          "Inspect the engine receipt and inspection-lane receipt."
        ]
      },
      lanes:
        [],
      fibonacci: {
        structuralAligned: false,
        operationalAligned: false,
        stationCount: 9,
        availableCount: 0,
        heldCount: 0,
        missingCount: 9,
        stations:
          FIBONACCI_STATIONS.map(function minimumStation(station) {
            return {
              cyclePosition:
                station.cyclePosition,
              fibonacci:
                station.fibonacci,
              role:
                station.role,
              direction:
                station.direction,
              status:
                "UNKNOWN",
              available:
                false,
              callable:
                false,
              resolvedAlias:
                null
            };
          }),
        conductorRequired: true,
        sequentialFallbackAuthorized: false
      },
      error:
        normalized,
      createdAt:
        nowIso()
    });

    return report;
  }

  function createReport(options) {
    var config =
      options || {};

    state.reportStatus =
      "CREATING";

    state.lastError =
      null;

    publishEngineReceipt();

    var report;
    var receipt;

    try {
      if (config.category) {
        state.selectedCategory =
          String(config.category);
      }

      if (config.audit) {
        state.selectedAudit =
          String(config.audit);
      }

      if (config.participant) {
        state.selectedParticipant =
          String(config.participant);
      }

      var lanes =
        collectInspectionLanes();

      var fibonacci =
        calculateFibonacciSynchronization(
          lanes
        );

      var read =
        buildRead(
          lanes,
          fibonacci
        );

      report =
        freeze({
          schema:
            REPORT_SCHEMA,
          reportId:
            "AUDRALIA_DIAGNOSTIC_REPORT_" +
            Date.now() +
            "_" +
            Math.random()
              .toString(36)
              .slice(2, 8),
          status:
            determineReportStatus(
              lanes
            ),
          category:
            state.selectedCategory,
          audit:
            state.selectedAudit,
          participant:
            state.selectedParticipant,
          READ:
            read,
          lanes:
            frozenClone(lanes),
          fibonacci:
            fibonacci,
          inspectionAuthority: {
            available:
              Boolean(
                getInspectionLane()
              ),
            contract:
              getInspectionLane()
                ? getInspectionLane().CONTRACT ||
                  getInspectionLane().contract ||
                  null
                : null
          },
          execution: {
            directExecutionPerformed:
              false,
            nineCyclePerformed:
              false,
            conductorRequired:
              true,
            sequentialFallbackAuthorized:
              false
          },
          createdAt:
            nowIso()
        });

      receipt =
        makeReportReceipt(
          report
        );
    } catch (error) {
      state.lastError =
        normalizeError(
          error,
          "createReport"
        );

      report =
        createMinimumErrorReport(
          error
        );

      receipt =
        makeReportReceipt(
          report
        );
    }

    state.currentReport =
      report;

    state.currentReceipt =
      receipt;

    state.reportStatus =
      report.status;

    state.reportsCreated += 1;

    archiveReport(
      report,
      receipt
    );

    publishPublicReport();
    publishEngineReceipt();

    try {
      renderReport(
        report,
        receipt
      );
    } catch (renderError) {
      state.lastError =
        normalizeError(
          renderError,
          "renderReport"
        );

      publishEngineReceipt();
    }

    recordAction(
      "createReport",
      {
        reportId:
          report.reportId,
        status:
          report.status,
        receiptId:
          receipt.receiptId
      }
    );

    return frozenClone(report);
  }

  function getParticipantRecord(
    role
  ) {
    var inspection =
      getInspectionLane();

    if (!inspection) {
      return null;
    }

    try {
      var result =
        inspection.inspectParticipants(
          PARTICIPANT_MANIFEST
        );

      if (
        result &&
        Array.isArray(result.records)
      ) {
        return result.records.filter(function matchRole(record) {
          return record.role === role;
        })[0] || null;
      }
    } catch (_error) {}

    return null;
  }

  function resolveCallableParticipant(
    manifestEntry
  ) {
    var inspection =
      getInspectionLane();

    if (!inspection) {
      return null;
    }

    var aliases =
      manifestEntry.aliases || [];

    for (
      var index = 0;
      index < aliases.length;
      index += 1
    ) {
      try {
        var read =
          inspection.safeReadPath(
            aliases[index],
            root,
            {
              allowAccessor: false,
              searchPrototype: true
            }
          );

        if (
          read &&
          read.ok &&
          read.present &&
          !read.blockedAccessor
        ) {
          return read.value;
        }
      } catch (_error) {}
    }

    return null;
  }

  function runDirect(role, payload) {
    var manifestEntry =
      PARTICIPANT_MANIFEST.filter(function matchRole(entry) {
        return entry.role === role;
      })[0] || null;

    if (
      !manifestEntry ||
      manifestEntry.auxiliary
    ) {
      return freeze({
        status:
          "HELD",
        role:
          role,
        reason:
          "DIRECT_ROLE_NOT_AUTHORIZED",
        receipt:
          null
      });
    }

    var target =
      resolveCallableParticipant(
        manifestEntry
      );

    if (!target) {
      return freeze({
        status:
          "MISSING",
        role:
          role,
        reason:
          "PARTICIPANT_NOT_AVAILABLE",
        receipt:
          null
      });
    }

    var method = null;

    if (typeof target === "function") {
      method = target;
    } else {
      (manifestEntry.methods || [])
        .some(function findMethod(name) {
          if (
            target &&
            typeof target[name] === "function"
          ) {
            method =
              target[name].bind(target);

            return true;
          }

          return false;
        });
    }

    if (!method) {
      return freeze({
        status:
          "HELD",
        role:
          role,
        reason:
          "PARTICIPANT_NOT_CALLABLE",
        receipt:
          null
      });
    }

    try {
      var result =
        method(
          payload || {}
        );

      state.directExecutions += 1;

      var receipt = freeze({
        schema:
          "AUDRALIA_DIAGNOSTIC_DIRECT_EXECUTION_RECEIPT_v1",
        role:
          role,
        status:
          "AVAILABLE",
        result:
          clone(result),
        createdAt:
          nowIso()
      });

      recordAction(
        "runDirect",
        {
          role:
            role,
          status:
            receipt.status
        }
      );

      return receipt;
    } catch (error) {
      return freeze({
        schema:
          "AUDRALIA_DIAGNOSTIC_DIRECT_EXECUTION_RECEIPT_v1",
        role:
          role,
        status:
          "ERROR",
        error:
          normalizeError(
            error,
            "runDirect." + role
          ),
        createdAt:
          nowIso()
      });
    }
  }

  function runNineCycle(payload) {
    var conductorEntry =
      PARTICIPANT_MANIFEST.filter(function conductor(entry) {
        return entry.role === "NORTH_CONDUCTOR";
      })[0];

    var conductor =
      resolveCallableParticipant(
        conductorEntry
      );

    if (
      !conductor ||
      typeof conductor.runNineCycle !== "function"
    ) {
      return freeze({
        schema:
          CYCLE_RECEIPT_SCHEMA,
        status:
          "HELD",
        reason:
          "NORTH_CONDUCTOR_UNAVAILABLE",
        sequentialFallbackAuthorized:
          false,
        receipts:
          [],
        createdAt:
          nowIso()
      });
    }

    var rawResult;

    try {
      rawResult =
        conductor.runNineCycle(
          payload || {}
        );
    } catch (error) {
      return freeze({
        schema:
          CYCLE_RECEIPT_SCHEMA,
        status:
          "ERROR",
        reason:
          "NORTH_CONDUCTOR_EXECUTION_ERROR",
        error:
          normalizeError(
            error,
            "runNineCycle"
          ),
        sequentialFallbackAuthorized:
          false,
        receipts:
          [],
        createdAt:
          nowIso()
      });
    }

    state.cycleExecutions += 1;

    var receipts =
      rawResult &&
      Array.isArray(rawResult.receipts)
        ? rawResult.receipts
        : Array.isArray(rawResult)
          ? rawResult
          : [];

    var validated =
      receipts.length === 9 &&
      receipts.every(function validateReceipt(receipt, index) {
        var station =
          FIBONACCI_STATIONS[index];

        return Boolean(
          receipt &&
          Number(receipt.cyclePosition) ===
            station.cyclePosition &&
          String(receipt.fibonacci) ===
            station.fibonacci &&
          String(receipt.role) ===
            station.role
        );
      });

    var cycleReceipt = freeze({
      schema:
        CYCLE_RECEIPT_SCHEMA,
      status:
        validated
          ? "COMMITTED"
          : "HELD",
      receiptCount:
        receipts.length,
      exactNineValidated:
        validated,
      sequentialFallbackAuthorized:
        false,
      receipts:
        frozenClone(receipts),
      createdAt:
        nowIso()
    });

    if (validated) {
      state.cycleCommits += 1;
    }

    recordAction(
      "runNineCycle",
      {
        status:
          cycleReceipt.status,
        receiptCount:
          cycleReceipt.receiptCount
      }
    );

    return cycleReceipt;
  }

  function renderReport(
    report,
    receipt
  ) {
    if (!doc) {
      return false;
    }

    var rootElement =
      doc.getElementById(
        "diagnosticReport"
      ) ||
      doc.querySelector(
        "[data-diagnostic-report]"
      );

    if (!rootElement) {
      return false;
    }

    var statusElement =
      rootElement.querySelector(
        "[data-report-status]"
      );

    var resultElement =
      rootElement.querySelector(
        "[data-read-result]"
      );

    var evidenceElement =
      rootElement.querySelector(
        "[data-read-evidence]"
      );

    var absenceElement =
      rootElement.querySelector(
        "[data-read-absence]"
      );

    var directionElement =
      rootElement.querySelector(
        "[data-read-direction]"
      );

    var receiptElement =
      rootElement.querySelector(
        "[data-report-receipt]"
      );

    if (statusElement) {
      statusElement.textContent =
        report.status;
    }

    if (resultElement) {
      resultElement.textContent =
        report.READ.Result;
    }

    renderList(
      evidenceElement,
      report.READ.Evidence
    );

    renderList(
      absenceElement,
      report.READ.Absence
    );

    renderList(
      directionElement,
      report.READ.Direction
    );

    if (receiptElement) {
      receiptElement.textContent =
        JSON.stringify(
          receipt,
          null,
          2
        );
    }

    rootElement.hidden =
      false;

    rootElement.setAttribute(
      "data-report-state",
      String(report.status).toLowerCase()
    );

    return true;
  }

  function renderList(
    element,
    values
  ) {
    if (!element) {
      return;
    }

    element.textContent = "";

    (Array.isArray(values) ? values : [])
      .forEach(function renderValue(value) {
        var item =
          doc.createElement("li");

        item.textContent =
          String(value);

        element.appendChild(item);
      });
  }

  function publishPublicReport() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT =
      state.currentReport;

    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT =
      state.currentReceipt;
  }

  function publishEngineReceipt() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT =
      freeze({
        schema:
          ENGINE_RECEIPT_SCHEMA,
        contract:
          CONTRACT,
        version:
          VERSION,
        file:
          FILE,
        authority:
          AUTHORITY,
        status:
          state.initialized
            ? "READY"
            : "INITIALIZING",
        reportStatus:
          state.reportStatus,
        reportsCreated:
          state.reportsCreated,
        directExecutions:
          state.directExecutions,
        cycleExecutions:
          state.cycleExecutions,
        cycleCommits:
          state.cycleCommits,
        inspectionAuthorityAvailable:
          Boolean(
            getInspectionLane()
          ),
        currentReportId:
          state.currentReport
            ? state.currentReport.reportId
            : null,
        currentReceiptId:
          state.currentReceipt
            ? state.currentReceipt.receiptId
            : null,
        archiveCount:
          state.archive.length,
        lastError:
          frozenClone(
            state.lastError
          ),
        lastAction:
          frozenClone(
            state.lastAction
          ),
        fibonacciAuthority: {
          interpretation:
            "F21",
          terminalCommit:
            "F89"
        },
        publishedAt:
          nowIso()
      });
  }

  function getReport() {
    return frozenClone(
      state.currentReport
    );
  }

  function getReportReceipt() {
    return frozenClone(
      state.currentReceipt
    );
  }

  function getEngineReceipt() {
    return frozenClone(
      root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT ||
      null
    );
  }

  function getArchive() {
    return frozenClone(
      state.archive
    );
  }

  function getState() {
    return frozenClone({
      initialized:
        state.initialized,
      reportStatus:
        state.reportStatus,
      reportsCreated:
        state.reportsCreated,
      directExecutions:
        state.directExecutions,
      cycleExecutions:
        state.cycleExecutions,
      cycleCommits:
        state.cycleCommits,
      selectedCategory:
        state.selectedCategory,
      selectedAudit:
        state.selectedAudit,
      selectedParticipant:
        state.selectedParticipant,
      currentReport:
        state.currentReport,
      currentReceipt:
        state.currentReceipt,
      lastError:
        state.lastError,
      lastAction:
        state.lastAction
    });
  }

  function setSelection(selection) {
    var config =
      selection || {};

    if (
      Object.prototype.hasOwnProperty.call(
        config,
        "category"
      )
    ) {
      state.selectedCategory =
        String(config.category);
    }

    if (
      Object.prototype.hasOwnProperty.call(
        config,
        "audit"
      )
    ) {
      state.selectedAudit =
        String(config.audit);
    }

    if (
      Object.prototype.hasOwnProperty.call(
        config,
        "participant"
      )
    ) {
      state.selectedParticipant =
        String(config.participant);
    }

    recordAction(
      "setSelection",
      {
        category:
          state.selectedCategory,
        audit:
          state.selectedAudit,
        participant:
          state.selectedParticipant
      }
    );

    return getState();
  }

  function resetWorkbench() {
    state.reportStatus =
      "READY";

    state.currentReport =
      null;

    state.currentReceipt =
      null;

    state.lastError =
      null;

    publishPublicReport();
    publishEngineReceipt();

    recordAction(
      "resetWorkbench"
    );

    return getState();
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

        runDirect:
          runDirect,

        runNineCycle:
          runNineCycle,

        setSelection:
          setSelection,

        resetWorkbench:
          resetWorkbench,

        getReport:
          getReport,

        getReportReceipt:
          getReportReceipt,

        getEngineReceipt:
          getEngineReceipt,

        getArchive:
          getArchive,

        getState:
          getState,

        getParticipantManifest:
          function getParticipantManifest() {
            return frozenClone(
              PARTICIPANT_MANIFEST
            );
          },

        getFibonacciStations:
          function getFibonacciStations() {
            return frozenClone(
              FIBONACCI_STATIONS
            );
          }
      });

    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE =
      api;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.diagnosticEngine =
      api;

    root.__AUDRALIA_DIAGNOSTIC_ENGINE_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_ENGINE_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_DIAGNOSTIC_ENGINE_VERSION__ =
      VERSION;

    return api;
  }

  function init() {
    publishApi();

    state.initialized =
      true;

    publishEngineReceipt();

    recordAction(
      "initialize",
      {
        inspectionAuthorityAvailable:
          Boolean(
            getInspectionLane()
          ),
        fibonacciAuthority: [
          "F21",
          "F89"
        ]
      }
    );
  }

  var existing =
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE;

  if (
    existing &&
    (
      existing.CONTRACT === CONTRACT ||
      existing.contract === CONTRACT
    )
  ) {
    return;
  }

  try {
    init();
  } catch (error) {
    state.lastError =
      normalizeError(
        error,
        "initialize"
      );

    publishEngineReceipt();

    throw error;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);
