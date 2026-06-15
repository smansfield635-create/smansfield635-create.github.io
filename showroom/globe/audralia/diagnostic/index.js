// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v3
// Version: 3.0.0
// Previous version: 2.0.0
// Full-file replacement.
//
// Purpose:
// - Control the reader-first Audralia diagnostic route.
// - Read the governing contract, runtime core, and engine registry.
// - Invoke the North conductor through its canonical createCycle() interface.
// - Register all nine diagnostic stations before sealing and running the cycle.
// - Preserve missing-evidence-as-HOLD behavior.
// - Render summaries, receipts, ledgers, registry records, tabs, and target frame.
//
// Does not own:
// - engine execution;
// - renderer execution;
// - WebGL/WebGPU initialization;
// - runtime restart;
// - production mutation;
// - repair authorization;
// - readiness, visual pass, or F21.
//
// Quiet load:
// - no diagnostic run until explicitly requested;
// - no engine instance creation;
// - no adapter registration;
// - no scheduler activation.

(function installAudraliaDiagnosticRouteController(global) {
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
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v3";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v2";

  var VERSION =
    "3.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.js";

  var HTML_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_STATIC_SHELL_TNT_v2";

  var CSS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_STYLE_TNT_v2";

  var GOVERNING_ENGINE_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var CORE_ENGINE_CONTRACT =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";

  var REGISTRY_CONTRACT =
    "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2";

  var DEFAULT_ENGINE_ID =
    "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var CONDUCTOR_REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_REQUEST_v1";

  var LEDGER_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v3";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var READER_REPORT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_READER_REPORT_v3";

  var NO_CLAIMS =
    deepFreeze({
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      rendererMutationAuthorized: false,
      repairAuthorized: false,
      readyClaimed: false,
      verifiedClaimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      f21Claimed: false
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

  var AUXILIARIES =
    deepFreeze([
      {
        parentPosition: 8,
        role: "SOUTH_SURFACE_POINTER",
        file:
          "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
        globalPaths: [
          "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
          "AUDRALIA.diagnosticSouthSurfacePointer",
          "AUDRALIA.diagnostics.southSurfacePointer"
        ]
      }
    ]);

  var state = {
    initialized: false,
    running: false,

    cycleId: "",
    lastRunAt: null,

    registrySnapshot: null,
    registryReceipt: null,
    authorityRecords: [],
    engineRecords: [],
    selectedEngine: null,

    engineInspection: null,
    engineOps: null,
    engineReceipt: null,

    conductorResult: null,
    conductorReceipt: null,
    conductorState: null,

    stationRegistrations: [],
    auxiliaryRegistrations: [],

    receipts: [],
    ledger: null,
    readerReport: "",
    rawLedgerText: "",

    lastError: null
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
      label: label,
      fibonacci: fibonacci,
      file: file,
      globalPaths: globalPaths
    };
  }

  function byId(id) {
    return doc
      ? doc.getElementById(id)
      : null;
  }

  function isObject(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
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

  function clone(value, seen) {
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

    var memory =
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

    var output = {};

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
    if (
      !value ||
      (
        typeof value !== "object" &&
        typeof value !== "function"
      )
    ) {
      return value;
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    try {
      Object.getOwnPropertyNames(value).forEach(
        function freezeProperty(key) {
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
        }
      );

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

    var memory =
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

    var output = {};

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

    try {
      text =
        JSON.stringify(
          stablePrepare(value)
        );
    } catch (_error) {
      text =
        String(value);
    }

    var result =
      0x811c9dc5;

    for (
      var index = 0;
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
      (
        "00000000" +
        result.toString(16)
      ).slice(-8)
    );
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      root;

    for (
      var index = 0;
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
    for (
      var index = 0;
      index < paths.length;
      index += 1
    ) {
      var value =
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

    if (node) {
      node.textContent =
        value === null ||
        value === undefined
          ? ""
          : String(value);
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

  function setClassState(
    node,
    names,
    active
  ) {
    if (!node) {
      return;
    }

    names.forEach(function removeClass(name) {
      node.classList.remove(name);
    });

    if (active) {
      node.classList.add(active);
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
      .replace(/'/g, "&#039;");
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

    if (toast._timer) {
      root.clearTimeout(
        toast._timer
      );
    }

    toast._timer =
      root.setTimeout(
        function hideToast() {
          node.classList.remove("show");
          node.classList.remove("visible");

          node.setAttribute(
            "data-visible",
            "false"
          );
        },
        2200
      );
  }

  function normalizeStatus(
    value,
    fallback
  ) {
    var status =
      typeof value === "string"
        ? value.trim().toUpperCase()
        : "";

    var allowed = {
      PASS: true,
      PARTIAL_PASS: true,
      HOLD: true,
      HELD: true,
      FAIL: true,
      ERROR: true,
      CONFLICT: true,
      DEGRADED: true,
      UNVERIFIED: true,
      UNKNOWN: true,
      COMPLETE: true,
      FAILED: true,
      CONFLICTING: true
    };

    return allowed[status]
      ? status
      : fallback || "UNKNOWN";
  }

  function statusClass(status) {
    var value =
      normalizeStatus(
        status,
        "UNKNOWN"
      );

    if (
      value === "PASS" ||
      value === "COMPLETE"
    ) {
      return "pass";
    }

    if (
      value === "HOLD" ||
      value === "HELD" ||
      value === "PARTIAL_PASS" ||
      value === "UNVERIFIED"
    ) {
      return "hold";
    }

    if (
      value === "FAIL" ||
      value === "FAILED"
    ) {
      return "fail";
    }

    if (
      value === "CONFLICT" ||
      value === "CONFLICTING"
    ) {
      return "conflict";
    }

    if (value === "ERROR") {
      return "error";
    }

    if (value === "DEGRADED") {
      return "attention";
    }

    return "waiting";
  }

  function setGauge(percent, status) {
    var gauge =
      byId("overallGauge");

    var value =
      byId("overallGaugeValue");

    if (
      !gauge ||
      !value
    ) {
      return;
    }

    var safePercent =
      Math.max(
        0,
        Math.min(
          100,
          Number(percent) || 0
        )
      );

    gauge.style.setProperty(
      "--gauge-progress",
      String(
        Math.round(
          safePercent * 3.6
        )
      ) + "deg"
    );

    setClassState(
      gauge,
      [
        "waiting",
        "pass",
        "passed",
        "ready",
        "hold",
        "held",
        "partial",
        "fail",
        "error",
        "conflict",
        "attention"
      ],
      statusClass(status)
    );

    value.textContent =
      String(
        Math.round(safePercent)
      ) + "%";

    gauge.setAttribute(
      "aria-label",
      "Overall diagnostic gauge " +
      String(Math.round(safePercent)) +
      " percent, status " +
      normalizeStatus(
        status,
        "UNKNOWN"
      )
    );
  }

  function getRegistry() {
    return (
      root.DGB_ENGINE_SUBJECT_REGISTRY ||
      root.DGBEngineSubjectRegistry ||
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
      readPath(
        "AUDRALIA.diagnosticNorthConductor"
      ) ||
      readPath(
        "AUDRALIA.diagnostics.northConductor"
      ) ||
      null
    );
  }

  function refreshRegistryState() {
    var registry =
      getRegistry();

    if (!registry) {
      state.registrySnapshot =
        null;

      state.registryReceipt =
        null;

      state.authorityRecords =
        [];

      state.engineRecords =
        [];

      state.selectedEngine =
        null;

      return;
    }

    callSafely(
      registry,
      "refresh",
      [],
      null
    );

    state.registrySnapshot =
      frozenClone(
        callSafely(
          registry,
          "getSnapshot",
          [],
          null
        )
      );

    state.registryReceipt =
      frozenClone(
        callSafely(
          registry,
          "getRegistryReceipt",
          [],
          null
        )
      );

    state.authorityRecords =
      frozenClone(
        callSafely(
          registry,
          "listAuthorities",
          [],
          []
        ) || []
      );

    state.engineRecords =
      frozenClone(
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
        ) || []
      );

    state.selectedEngine =
      frozenClone(
        callSafely(
          registry,
          "getDefaultEngine",
          [],
          null
        )
      );
  }

  function inspectEngineState() {
    var engine =
      getEngine();

    var instanceIds =
      [];

    if (
      engine &&
      isFunction(engine.listInstances)
    ) {
      var listed =
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

      if (Array.isArray(listed)) {
        instanceIds =
          listed
            .map(function mapInstance(entry) {
              if (typeof entry === "string") {
                return entry;
              }

              if (
                entry &&
                typeof entry.instanceId === "string"
              ) {
                return entry.instanceId;
              }

              if (
                entry &&
                entry.identity &&
                typeof entry.identity.instanceId === "string"
              ) {
                return entry.identity.instanceId;
              }

              return null;
            })
            .filter(Boolean);
      }
    }

    var instanceId =
      instanceIds.length
        ? instanceIds[0]
        : null;

    state.engineInspection =
      frozenClone(
        engine &&
        isFunction(engine.inspect)
          ? callSafely(
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
            )
          : null
      );

    state.engineOps =
      frozenClone(
        engine &&
        instanceId &&
        isFunction(engine.getOps)
          ? callSafely(
              engine,
              "getOps",
              [instanceId],
              null
            )
          : null
      );

    state.engineReceipt =
      frozenClone(
        engine
          ? (
              isFunction(engine.getRuntimeReceipt)
                ? callSafely(
                    engine,
                    "getRuntimeReceipt",
                    [],
                    null
                  )
                : isFunction(engine.getReceipt)
                  ? callSafely(
                      engine,
                      "getReceipt",
                      [],
                      null
                    )
                  : null
            )
          : null
      );
  }

  function readObserved(
    source,
    key
  ) {
    if (
      !source ||
      !Object.prototype.hasOwnProperty.call(
        Object(source),
        key
      )
    ) {
      return null;
    }

    var value =
      source[key];

    return (
      value === null ||
      value === undefined
        ? null
        : clone(value)
    );
  }

  function buildRuntimeEvidence() {
    var ops =
      state.engineOps;

    var inspection =
      state.engineInspection;

    var observed =
      ops &&
      isObject(ops.observed)
        ? ops.observed
        : {};

    var lifecycle =
      inspection &&
      isObject(inspection.lifecycle)
        ? inspection.lifecycle
        : null;

    var renderer =
      inspection &&
      isObject(inspection.renderer)
        ? inspection.renderer
        : null;

    var fallback =
      inspection &&
      isObject(inspection.fallback)
        ? inspection.fallback
        : null;

    return deepFreeze({
      classification:
        ops || inspection
          ? "REGISTERED_EXTERNAL_PROVIDER"
          : "UNKNOWN",

      source:
        ops
          ? "DGB_ENGINE.getOps"
          : inspection
            ? "DGB_ENGINE.inspect"
            : "UNAVAILABLE",

      engineId:
        state.selectedEngine
          ? state.selectedEngine.engineId
          : DEFAULT_ENGINE_ID,

      engineLoaded:
        Boolean(
          state.selectedEngine &&
          state.selectedEngine.loaded
        ),

      contractMatched:
        Boolean(
          state.selectedEngine &&
          state.selectedEngine.governingContractMatched
        ),

      backend:
        ops &&
        typeof ops.backend === "string"
          ? ops.backend
          : renderer &&
            typeof renderer.selectedBackend === "string"
            ? renderer.selectedBackend
            : "NONE",

      state:
        ops &&
        typeof ops.state === "string"
          ? ops.state
          : lifecycle &&
            typeof lifecycle.progressState === "string"
            ? lifecycle.progressState
            : "UNKNOWN",

      lifecycle:
        lifecycle
          ? frozenClone(lifecycle)
          : null,

      fileLoaded:
        readObserved(
          observed,
          "fileLoaded"
        ),

      modelValidated:
        readObserved(
          observed,
          "modelValidated"
        ),

      instanceCreated:
        readObserved(
          observed,
          "instanceCreated"
        ),

      mountPresent:
        readObserved(
          observed,
          "mountPresent"
        ),

      surfaceNonzero:
        readObserved(
          observed,
          "surfaceNonzero"
        ),

      backendInitialized:
        readObserved(
          observed,
          "backendInitialized"
        ),

      resourcesUploaded:
        readObserved(
          observed,
          "resourcesUploaded"
        ),

      firstFrameSubmitted:
        readObserved(
          observed,
          "firstFrameSubmitted"
        ),

      firstFramePresented:
        readObserved(
          observed,
          "firstFramePresented"
        ),

      visiblePixelObserved:
        readObserved(
          observed,
          "visiblePixelObserved"
        ),

      interactionObserved:
        readObserved(
          observed,
          "interactionObserved"
        ),

      fallbackAvailable:
        readObserved(
          observed,
          "fallbackAvailable"
        ),

      contextRecoveryAvailable:
        readObserved(
          observed,
          "contextRecoveryAvailable"
        ),

      noBlockingError:
        readObserved(
          observed,
          "noBlockingError"
        ),

      primaryVisibility:
        renderer
          ? readObserved(
              renderer,
              "visiblePixelObserved"
            )
          : null,

      fallbackVisibility:
        fallback
          ? readObserved(
              fallback,
              "visibleOutputObserved"
            )
          : null,

      evidenceAvailable:
        Boolean(
          ops ||
          inspection
        ),

      evidenceUnavailableReason:
        ops || inspection
          ? null
          : "NO_LIVE_ENGINE_INSTANCE_EVIDENCE"
    });
  }

  function inspectTargetFrame() {
    var frame =
      byId(TARGET_FRAME_ID);

    var frameWindow =
      null;

    var frameDocument =
      null;

    var runtimeStatus =
      null;

    var accessible =
      false;

    var loaded =
      false;

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
            frameDocument.readyState === "complete"
          );

        var runtime =
          frameWindow &&
          frameWindow.DGBAudraliaPlanetRuntime
            ? frameWindow.DGBAudraliaPlanetRuntime
            : null;

        if (
          runtime &&
          isFunction(runtime.getStatus)
        ) {
          runtimeStatus =
            frozenClone(
              callSafely(
                runtime,
                "getStatus",
                [],
                null
              )
            );
        }
      } catch (_error) {
        accessible =
          false;

        loaded =
          false;

        runtimeStatus =
          null;
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

      targetRuntimeStatus:
        runtimeStatus,

      runtimeEvidenceAvailable:
        Boolean(runtimeStatus),

      classification:
        runtimeStatus
          ? "REGISTERED_EXTERNAL_PROVIDER"
          : "UNKNOWN",

      noClaims: {
        iframePresenceProvesWebGL2:
          false,

        iframePresenceProvesSubmission:
          false,

        iframePresenceProvesPresentation:
          false,

        iframePresenceProvesVisibility:
          false
      }
    });
  }

  function buildRegistryEvidence() {
    var snapshot =
      state.registrySnapshot;

    var registry =
      getRegistry();

    return deepFreeze({
      registryLoaded:
        Boolean(registry),

      registryContract:
        registry &&
        (
          registry.CONTRACT ||
          registry.contract
        )
          ? (
              registry.CONTRACT ||
              registry.contract
            )
          : null,

      registryContractMatched:
        Boolean(
          registry &&
          (
            registry.CONTRACT ===
              REGISTRY_CONTRACT ||
            registry.contract ===
              REGISTRY_CONTRACT
          )
        ),

      governingAuthorityCount:
        snapshot
          ? Number(
              snapshot.authorityCount || 0
            )
          : state.authorityRecords.length,

      assignedEngineCount:
        snapshot
          ? Number(
              snapshot.assignedEngineCount || 0
            )
          : state.engineRecords.filter(
              function assigned(record) {
                return Boolean(
                  record &&
                  !record.reserved
                );
              }
            ).length,

      selectableEngineCount:
        snapshot
          ? Number(
              snapshot.selectableEngineCount || 0
            )
          : state.engineRecords.filter(
              function selectable(record) {
                return Boolean(
                  record &&
                  record.selectable
                );
              }
            ).length,

      reservedEngineCount:
        snapshot
          ? Number(
              snapshot.reservedEngineCount || 0
            )
          : state.engineRecords.filter(
              function reserved(record) {
                return Boolean(
                  record &&
                  record.reserved
                );
              }
            ).length,

      authority:
        state.authorityRecords.length
          ? frozenClone(
              state.authorityRecords[0]
            )
          : null,

      selectedEngine:
        state.selectedEngine
          ? frozenClone(
              state.selectedEngine
            )
          : null,

      receipt:
        state.registryReceipt
          ? frozenClone(
              state.registryReceipt
            )
          : null
    });
  }

  function buildConductorRequest() {
    return deepFreeze({
      schema:
        CONDUCTOR_REQUEST_SCHEMA,

      cycleId:
        state.cycleId,

      mode:
        "AUDIT",

      subject: {
        subjectId:
          "AUDRALIA_DIAGNOSTIC_READER_ROUTE",

        subjectType:
          "THREE_D_DIAGNOSTIC_ROUTE",

        modelSchema:
          "DGB_MODEL_PACKAGE_v1",

        route:
          "/showroom/globe/audralia/diagnostic/",

        targetRoute:
          TARGET_ROUTE
      },

      engine: {
        governingContract:
          GOVERNING_ENGINE_CONTRACT,

        coreContract:
          CORE_ENGINE_CONTRACT,

        registryContract:
          REGISTRY_CONTRACT,

        defaultEngineId:
          DEFAULT_ENGINE_ID,

        registry:
          buildRegistryEvidence(),

        runtime:
          buildRuntimeEvidence()
      },

      construct: {
        constructId:
          "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D",

        contract:
          HTML_CONTRACT,

        version:
          "2.0.0",

        route:
          "/showroom/globe/audralia/diagnostic/",

        rootFile:
          "/showroom/globe/audralia/diagnostic/index.html",

        routeController: {
          contract:
            CONTRACT,

          previousContract:
            PREVIOUS_CONTRACT,

          version:
            VERSION,

          file:
            FILE
        },

        target:
          inspectTargetFrame(),

        evidencePolicy: {
          positiveRuntimeEvidenceMayBeInferred:
            false,

          missingEvidenceDisposition:
            "HOLD",

          diagnosticEvidenceGoverning:
            false,

          declaredStructureEqualsRuntimeProof:
            false,

          iframePresenceEqualsPresentationProof:
            false
        },

        noClaims:
          NO_CLAIMS
      },

      requestedStartPosition:
        1,

      generatedAtEnabled:
        true,

      extensions: {
        routeControllerHash:
          hashObject({
            contract:
              CONTRACT,

            version:
              VERSION,

            file:
              FILE
          })
      }
    });
  }

  function resolveStationApi(definition) {
    var found =
      readFirst(
        definition.globalPaths ||
        []
      );

    if (found.value) {
      return {
        api:
          found.value,

        globalPath:
          found.path,

        source:
          "DECLARED_GLOBAL"
      };
    }

    var namespace =
      readPath("AUDRALIA");

    if (
      namespace &&
      typeof namespace === "object"
    ) {
      var namespaceKeys =
        Object.keys(namespace);

      for (
        var index = 0;
        index < namespaceKeys.length;
        index += 1
      ) {
        var namespaceCandidate =
          namespace[
            namespaceKeys[index]
          ];

        if (
          namespaceCandidate &&
          namespaceCandidate.STATION_ID ===
            definition.stationId &&
          Number(
            namespaceCandidate.CYCLE_POSITION
          ) === definition.position
        ) {
          return {
            api:
              namespaceCandidate,

            globalPath:
              "AUDRALIA." +
              namespaceKeys[index],

            source:
              "AUDRALIA_NAMESPACE_SCAN"
          };
        }
      }
    }

    var rootKeys =
      [];

    try {
      rootKeys =
        Object.keys(root);
    } catch (_error) {}

    for (
      var rootIndex = 0;
      rootIndex < rootKeys.length;
      rootIndex += 1
    ) {
      var key =
        rootKeys[rootIndex];

      if (
        key.indexOf(
          "AUDRALIA_DIAGNOSTIC"
        ) !== 0
      ) {
        continue;
      }

      var candidate;

      try {
        candidate =
          root[key];
      } catch (_error) {
        candidate =
          null;
      }

      if (
        candidate &&
        candidate.STATION_ID ===
          definition.stationId &&
        Number(
          candidate.CYCLE_POSITION
        ) === definition.position
      ) {
        return {
          api:
            candidate,

          globalPath:
            key,

          source:
            "ROOT_SCAN"
        };
      }
    }

    return {
      api:
        null,

      globalPath:
        null,

      source:
        "NOT_FOUND"
    };
  }

  function resolveAuxiliaryApi(definition) {
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
        state.cycleId,

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
            detail ||
            summary
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
    return STATIONS.map(
      function mapHeld(definition) {
        return makeHeldReceipt(
          definition,
          code,
          summary,
          detail
        );
      }
    );
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
        result.packet.stationReceipts
    ];

    for (
      var index = 0;
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
      STATIONS[index] ||
      {
        position:
          index + 1,

        stationId:
          source.stationId ||
          "UNKNOWN_STATION",

        label:
          source.stationId ||
          "Unknown Station",

        fibonacci:
          source.fibonacci ||
          ""
      };

    return deepFreeze({
      schema:
        source.schema ||
        RECEIPT_SCHEMA,

      cycleId:
        source.cycleId ||
        state.cycleId,

      position:
        Number.isFinite(
          Number(source.position)
        )
          ? Number(source.position)
          : stationDefinition.position,

      stationId:
        source.stationId ||
        stationDefinition.stationId,

      fibonacci:
        source.fibonacci ||
        stationDefinition.fibonacci ||
        "",

      contract:
        source.contract ||
        "UNKNOWN_STATION_CONTRACT",

      version:
        source.version ||
        "UNKNOWN",

      file:
        source.file ||
        "UNKNOWN",

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
        typeof source.summary === "string" &&
        source.summary.trim()
          ? source.summary.trim()
          : "No station summary was supplied.",

      observations:
        Array.isArray(source.observations)
          ? frozenClone(
              source.observations
            )
          : [],

      evidence:
        Array.isArray(source.evidence)
          ? frozenClone(
              source.evidence
            )
          : [],

      issues:
        Array.isArray(source.issues)
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
            "No receipt collection could be extracted from the conductor result."
          )
      };
    }

    var normalized =
      [];

    STATIONS.forEach(
      function normalizeExpectedStation(
        definition,
        index
      ) {
        var matching =
          receipts.find(
            function findMatching(receipt) {
              return (
                receipt &&
                receipt.stationId ===
                  definition.stationId
              );
            }
          );

        if (!matching) {
          matching =
            receipts[index] ||
            null;
        }

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
      }
    );

    return {
      conductorResult:
        frozenClone(result),

      receipts:
        normalized
    };
  }

  function invokeConductor(request) {
    var conductor =
      getConductor();

    if (!conductor) {
      return Promise.resolve({
        conductorResult:
          null,

        receipts:
          makeHeldReceipts(
            "NORTH_CONDUCTOR_UNAVAILABLE",
            "The North conductor is unavailable.",
            "No compatible North-conductor authority global was found."
          )
      });
    }

    if (
      !isFunction(
        conductor.createCycle
      )
    ) {
      return Promise.resolve({
        conductorResult:
          frozenClone(conductor),

        receipts:
          makeHeldReceipts(
            "NORTH_CONDUCTOR_CREATE_CYCLE_UNAVAILABLE",
            "The North conductor does not expose createCycle().",
            "The installed conductor contract requires the canonical createCycle() path."
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
          stage:
            "CREATE_CYCLE",

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
            "The North conductor created an incompatible cycle.",
            "The cycle must expose registerStation(), seal(), run(), and getReceipt()."
          )
      });
    }

    state.stationRegistrations =
      [];

    state.auxiliaryRegistrations =
      [];

    STATIONS.forEach(
      function registerStation(definition) {
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

            source:
              resolved.source,

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

              source:
                resolved.source,

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

              source:
                resolved.source,

              generatedAt:
                nowIso()
            };
          }
        }

        state.stationRegistrations.push(
          deepFreeze(outcome)
        );
      }
    );

    AUXILIARIES.forEach(
      function registerAuxiliary(
        definition
      ) {
        var resolved =
          resolveAuxiliaryApi(
            definition
          );

        var outcome;

        if (!resolved.api) {
          outcome = {
            parentPosition:
              definition.parentPosition,

            role:
              definition.role,

            file:
              definition.file,

            status:
              "NOT_REGISTERED",

            reason:
              "AUXILIARY_GLOBAL_NOT_FOUND",

            generatedAt:
              nowIso()
          };
        } else if (
          !isFunction(
            cycle.registerAuxiliary
          )
        ) {
          outcome = {
            parentPosition:
              definition.parentPosition,

            role:
              definition.role,

            file:
              definition.file,

            status:
              "NOT_REGISTERED",

            reason:
              "CYCLE_AUXILIARY_REGISTRATION_UNAVAILABLE",

            generatedAt:
              nowIso()
          };
        } else {
          try {
            var registration =
              cycle.registerAuxiliary(
                definition.parentPosition,
                {
                  role:
                    definition.role,

                  file:
                    definition.file,

                  contract:
                    resolved.api.CONTRACT ||
                    null,

                  version:
                    resolved.api.VERSION ||
                    null,

                  globalPath:
                    resolved.globalPath,

                  createsCyclePosition:
                    false
                }
              );

            outcome = {
              parentPosition:
                definition.parentPosition,

              role:
                definition.role,

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

              globalPath:
                resolved.globalPath,

              source:
                resolved.source,

              generatedAt:
                nowIso()
            };
          } catch (error) {
            outcome = {
              parentPosition:
                definition.parentPosition,

              role:
                definition.role,

              file:
                definition.file,

              status:
                "NOT_REGISTERED",

              reason:
                "AUXILIARY_REGISTRATION_THROW",

              detail:
                String(
                  error &&
                  error.message
                    ? error.message
                    : error
                ),

              generatedAt:
                nowIso()
            };
          }
        }

        state.auxiliaryRegistrations.push(
          deepFreeze(outcome)
        );
      }
    );

    var sealReceipt;

    try {
      sealReceipt =
        cycle.seal();
    } catch (error) {
      return Promise.resolve({
        conductorResult: {
          stage:
            "SEAL",

          error:
            String(
              error &&
              error.message
                ? error.message
                : error
            ),

          stationRegistrations:
            frozenClone(
              state.stationRegistrations
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
      .then(
        function conductorRunResolved(result) {
          var receipt =
            isObject(result)
              ? result
              : cycle.getReceipt();

          state.conductorReceipt =
            frozenClone(receipt);

          state.conductorState =
            frozenClone(
              isFunction(
                cycle.getState
              )
                ? cycle.getState()
                : null
            );

          return normalizeConductorResult({
            schema:
              "AUDRALIA_DIAGNOSTIC_ROUTE_CONDUCTOR_RESULT_v1",

            cycleReceipt:
              receipt,

            stationReceipts:
              receipt &&
              Array.isArray(
                receipt.stationReceipts
              )
                ? receipt.stationReceipts
                : extractReceipts(
                    receipt
                  ),

            sealReceipt:
              sealReceipt,

            state:
              state.conductorState,

            stationRegistrations:
              frozenClone(
                state.stationRegistrations
              ),

            auxiliaryRegistrations:
              frozenClone(
                state.auxiliaryRegistrations
              )
          });
        }
      )
      .catch(
        function conductorRunRejected(error) {
          state.conductorReceipt =
            frozenClone(
              callSafely(
                cycle,
                "getReceipt",
                [],
                null
              )
            );

          state.conductorState =
            frozenClone(
              callSafely(
                cycle,
                "getState",
                [],
                null
              )
            );

          return {
            conductorResult: {
              stage:
                "RUN",

              error:
                String(
                  error &&
                  error.message
                    ? error.message
                    : error
                ),

              state:
                state.conductorState,

              receipt:
                state.conductorReceipt,

              stationRegistrations:
                frozenClone(
                  state.stationRegistrations
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
        }
      );
  }

  function composeLedger() {
    function count(statuses) {
      return state.receipts.filter(
        function countReceipt(receipt) {
          return (
            statuses.indexOf(
              receipt.status
            ) !== -1
          );
        }
      ).length;
    }

    var passCount =
      count([
        "PASS"
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
        "FAIL"
      ]);

    var conflictCount =
      count([
        "CONFLICT"
      ]);

    var errorCount =
      count([
        "ERROR"
      ]);

    var degradedCount =
      count([
        "DEGRADED"
      ]);

    var terminalReceipt =
      state.receipts.length
        ? state.receipts[
            state.receipts.length - 1
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
                    state.receipts.length &&
                    state.receipts.length > 0
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
        state.cycleId,

      generatedAt:
        nowIso(),

      targetRoute:
        TARGET_ROUTE,

      orchestrationOwner:
        "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",

      orchestrationMethod:
        "createCycle",

      receiptCount:
        state.receipts.length,

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

      engineRegistry:
        buildRegistryEvidence(),

      engineRuntime:
        buildRuntimeEvidence(),

      target:
        inspectTargetFrame(),

      conductorState:
        state.conductorState
          ? frozenClone(
              state.conductorState
            )
          : null,

      conductorReceipt:
        state.conductorReceipt
          ? frozenClone(
              state.conductorReceipt
            )
          : null,

      stationRegistrations:
        frozenClone(
          state.stationRegistrations
        ),

      auxiliaryRegistrations:
        frozenClone(
          state.auxiliaryRegistrations
        ),

      conductorResult:
        state.conductorResult
          ? frozenClone(
              state.conductorResult
            )
          : null,

      receipts:
        frozenClone(
          state.receipts
        ),

      noClaims:
        NO_CLAIMS
    };

    ledger.ledgerHash =
      hashObject(ledger);

    return deepFreeze(
      ledger
    );
  }

  function readableOverall(ledger) {
    if (!ledger) {
      return "Waiting";
    }

    if (
      ledger.overallStatus === "PASS"
    ) {
      return "Complete diagnostic path";
    }

    if (
      ledger.overallStatus === "HOLD"
    ) {
      return "Held for evidence";
    }

    if (
      ledger.overallStatus === "DEGRADED"
    ) {
      return "Degraded diagnostic result";
    }

    if (
      ledger.overallStatus === "FAIL"
    ) {
      return "Failure reported";
    }

    if (
      ledger.overallStatus === "CONFLICT"
    ) {
      return "Conflict reported";
    }

    if (
      ledger.overallStatus === "ERROR"
    ) {
      return "Error reported";
    }

    return "Unverified diagnostic path";
  }

  function plainLanguage(ledger) {
    if (!ledger) {
      return (
        "No diagnostic ledger has been produced yet. " +
        "The engine registry may still be inspected independently."
      );
    }

    if (
      ledger.errorCount > 0
    ) {
      return (
        "The diagnostic path encountered an execution error. " +
        "Open the station receipts to identify the affected stage."
      );
    }

    if (
      ledger.conflictCount > 0
    ) {
      return (
        "The diagnostic path found incompatible authority or runtime claims. " +
        "No readiness conclusion can be made."
      );
    }

    if (
      ledger.failCount > 0
    ) {
      return (
        "The diagnostic path found a failed condition. " +
        "This report identifies the failure but does not authorize repair."
      );
    }

    if (
      ledger.degradedCount > 0
    ) {
      return (
        "The diagnostic path completed with degraded evidence. " +
        "The result is not equivalent to a production-ready engine."
      );
    }

    if (
      ledger.holdCount > 0
    ) {
      return (
        "The diagnostic path is held because required runtime evidence is " +
        "missing, unavailable, or not yet admitted. Missing proof was not " +
        "replaced with synthetic positive evidence."
      );
    }

    if (
      ledger.passCount ===
        ledger.receiptCount &&
      ledger.receiptCount ===
        STATIONS.length
    ) {
      return (
        "All nine diagnostic stations returned passing diagnostic receipts. " +
        "This confirms diagnostic completion only; it does not independently " +
        "claim production readiness, visual pass, or F21."
      );
    }

    return (
      "The diagnostic path is incomplete."
    );
  }

  function composeReaderReport(ledger) {
    var attentionCount =
      ledger.failCount +
      ledger.conflictCount +
      ledger.errorCount +
      ledger.degradedCount;

    var registeredCount =
      ledger.stationRegistrations.filter(
        function countRegistered(outcome) {
          return (
            outcome.status ===
              "REGISTERED" ||
            outcome.status ===
              "DUPLICATE_IDENTICAL"
          );
        }
      ).length;

    return [
      "AUDRALIA DIAGNOSTIC READER REPORT",
      "SCHEMA=" +
        READER_REPORT_SCHEMA,
      "",
      "Overall status: " +
        readableOverall(ledger),
      "Passed stations: " +
        ledger.passCount +
        " of " +
        ledger.receiptCount,
      "Held stations: " +
        ledger.holdCount,
      "Attention items: " +
        attentionCount,
      "",
      "Engine family:",
      "Governing contracts: " +
        ledger.engineRegistry
          .governingAuthorityCount,
      "Assigned engines: " +
        ledger.engineRegistry
          .assignedEngineCount,
      "Selectable engines: " +
        ledger.engineRegistry
          .selectableEngineCount,
      "Reserved engine slots: " +
        ledger.engineRegistry
          .reservedEngineCount,
      "",
      "North conductor:",
      "Invocation: createCycle",
      "Registered stations: " +
        registeredCount +
        " of 9",
      "",
      "Plain-language reading:",
      plainLanguage(ledger),
      "",
      "Terminal summary:",
      ledger.terminalSummary,
      "",
      "Boundary:",
      "This diagnostic route does not authorize production mutation, " +
        "runtime restart, renderer mutation, repair, readiness, visual pass, " +
        "or F21.",
      "",
      "Ledger hash:",
      ledger.ledgerHash
    ].join("\n");
  }

  function stationLabel(stationId) {
    var definition =
      STATIONS.find(
        function findStation(entry) {
          return (
            entry.stationId ===
            stationId
          );
        }
      );

    return definition
      ? definition.label
      : stationId ||
          "Unknown Station";
  }

  function renderRegistrySummary() {
    refreshRegistryState();

    var evidence =
      buildRegistryEvidence();

    setText(
      "governingContractCount",
      String(
        evidence.governingAuthorityCount
      )
    );

    setText(
      "assignedEngineCount",
      String(
        evidence.assignedEngineCount
      )
    );

    setText(
      "selectableEngineCount",
      String(
        evidence.selectableEngineCount
      )
    );

    setText(
      "reservedEngineCount",
      String(
        evidence.reservedEngineCount
      )
    );

    setText(
      "governingContractSummary",
      evidence.governingAuthorityCount > 0
        ? "The governing contract is registered separately from the runtime engine."
        : "The governing contract record is unavailable."
    );

    setText(
      "assignedEngineSummary",
      evidence.assignedEngineCount > 0
        ? "One runtime engine subject is assigned to the registry."
        : "No runtime engine subject is currently assigned."
    );

    setText(
      "selectableEngineSummary",
      evidence.selectableEngineCount > 0
        ? "The registered runtime core is available for selection."
        : "The runtime core is held until authority and identity are admitted."
    );

    setText(
      "reservedEngineSummary",
      evidence.reservedEngineCount > 0
        ? String(
            evidence.reservedEngineCount
          ) +
          " future engine slots remain reserved."
        : "No reserved engine slots were reported."
    );

    var pill =
      byId(
        "engineRegistryStatusPill"
      );

    if (pill) {
      var available =
        evidence.registryLoaded &&
        evidence.selectableEngineCount > 0;

      setClassState(
        pill,
        [
          "available",
          "ready",
          "pass",
          "held",
          "waiting",
          "error"
        ],
        available
          ? "available"
          : "held"
      );

      pill.textContent =
        !evidence.registryLoaded
          ? "REGISTRY_NOT_LOADED"
          : available
            ? "REGISTRY_AVAILABLE"
            : "REGISTRY_HELD";
    }

    renderRegistryRecords();
  }

  function renderRegistryRecords() {
    var list =
      byId("engineRegistryList");

    if (!list) {
      return;
    }

    if (
      !state.authorityRecords.length &&
      !state.engineRecords.length
    ) {
      list.innerHTML =
        '<article class="receipt-empty">' +
        "<h3>Engine registry unavailable</h3>" +
        "<p>The registry global was not found. The diagnostic route remains held.</p>" +
        "</article>";

      return;
    }

    var fragments =
      [];

    state.authorityRecords.forEach(
      function renderAuthority(record) {
        fragments.push(
          '<article class="receipt-card authority-record">' +
          "<h3>" +
          escapeHtml(
            record.authorityName ||
            record.authorityId ||
            "Governing Contract"
          ) +
          "</h3>" +
          "<p>Role: " +
          escapeHtml(
            record.role ||
            "GOVERNING_CONTRACT"
          ) +
          "</p>" +
          "<p>Status: " +
          escapeHtml(
            record.status ||
            "UNKNOWN"
          ) +
          "</p>" +
          "<p>File: " +
          escapeHtml(
            record.file ||
            "/assets/engine/dgb.engine.contract.js"
          ) +
          "</p>" +
          "<p>Executable engine: " +
          (
            record.executableEngine
              ? "Yes"
              : "No"
          ) +
          "</p>" +
          "</article>"
        );
      }
    );

    state.engineRecords.forEach(
      function renderEngine(record) {
        fragments.push(
          '<article class="receipt-card engine-record ' +
          (
            record.reserved
              ? "held"
              : record.selectable
                ? "pass"
                : "hold"
          ) +
          '">' +
          "<h3>" +
          escapeHtml(
            record.engineName ||
            (
              record.reserved
                ? "Reserved Engine Slot " +
                  String(record.slot)
                : record.engineId ||
                  "Runtime Engine"
            )
          ) +
          "</h3>" +
          "<p>Role: " +
          escapeHtml(
            record.role ||
            "RUNTIME_ENGINE"
          ) +
          "</p>" +
          "<p>Status: " +
          escapeHtml(
            record.status ||
            "UNKNOWN"
          ) +
          "</p>" +
          "<p>Selectable: " +
          (
            record.selectable
              ? "Yes"
              : "No"
          ) +
          "</p>" +
          "<p>File: " +
          escapeHtml(
            record.file ||
            "Not assigned"
          ) +
          "</p>" +
          "</article>"
        );
      }
    );

    list.innerHTML =
      fragments.join("");
  }

  function renderSummary() {
    var ledger =
      state.ledger;

    var attention =
      ledger
        ? (
            ledger.failCount +
            ledger.conflictCount +
            ledger.errorCount +
            ledger.degradedCount
          )
        : 0;

    var percent =
      ledger &&
      ledger.receiptCount > 0
        ? (
            ledger.passCount /
            ledger.receiptCount
          ) * 100
        : 0;

    setText(
      "passedCount",
      ledger
        ? String(
            ledger.passCount
          )
        : "0"
    );

    setText(
      "heldCount",
      ledger
        ? String(
            ledger.holdCount
          )
        : "0"
    );

    setText(
      "attentionCount",
      String(attention)
    );

    setText(
      "plainSummary",
      plainLanguage(ledger)
    );

    setText(
      "overallStatus",
      readableOverall(ledger)
    );

    setText(
      "overallStatusDetail",
      ledger
        ? ledger.terminalSummary
        : "The system has not produced a ledger yet."
    );

    setGauge(
      percent,
      ledger
        ? ledger.overallStatus
        : "UNKNOWN"
    );

    setDisabled(
      "copyReaderReport",
      !ledger
    );

    setDisabled(
      "copyReceiptLedger",
      !ledger
    );
  }

  function renderCycleMap() {
    if (!doc) {
      return;
    }

    STATIONS.forEach(
      function renderStation(
        definition
      ) {
        var node =
          doc.querySelector(
            '[data-station="' +
            definition.stationId +
            '"]'
          );

        var receipt =
          state.receipts.find(
            function findReceipt(entry) {
              return (
                entry.stationId ===
                definition.stationId
              );
            }
          );

        if (!node) {
          return;
        }

        setClassState(
          node,
          [
            "pass",
            "passed",
            "hold",
            "held",
            "partial",
            "fail",
            "error",
            "conflict",
            "attention"
          ],
          receipt
            ? statusClass(
                receipt.status
              )
            : null
        );

        if (!receipt) {
          node.removeAttribute(
            "data-status"
          );

          node.removeAttribute(
            "title"
          );

          return;
        }

        node.setAttribute(
          "data-status",
          receipt.status
        );

        node.setAttribute(
          "title",
          definition.label +
          ": " +
          (
            receipt.summary ||
            receipt.status ||
            "UNKNOWN"
          )
        );
      }
    );
  }

  function renderReceipts() {
    var list =
      byId("receiptList");

    if (!list) {
      return;
    }

    if (!state.receipts.length) {
      list.innerHTML =
        '<article class="receipt-empty">' +
        "<h3>No receipts yet</h3>" +
        "<p>Run the diagnostic track to populate station receipts.</p>" +
        "</article>";

      return;
    }

    list.innerHTML =
      state.receipts
        .map(
          function renderReceipt(
            receipt,
            index
          ) {
            var issueCount =
              Array.isArray(
                receipt.issues
              )
                ? receipt.issues.length
                : 0;

            return (
              '<details class="receipt-card ' +
              escapeHtml(
                statusClass(
                  receipt.status
                )
              ) +
              '">' +
              "<summary>" +
              escapeHtml(
                String(index + 1)
              ) +
              " · " +
              escapeHtml(
                stationLabel(
                  receipt.stationId
                )
              ) +
              " · " +
              escapeHtml(
                receipt.status
              ) +
              "</summary>" +
              '<div class="receipt-meta">' +
              "<span>" +
              escapeHtml(
                receipt.stationId
              ) +
              "</span>" +
              "<span>" +
              escapeHtml(
                receipt.fibonacci ||
                ""
              ) +
              "</span>" +
              "<span>Issues: " +
              escapeHtml(
                String(issueCount)
              ) +
              "</span>" +
              "</div>" +
              "<p>" +
              escapeHtml(
                receipt.summary
              ) +
              "</p>" +
              "<pre>" +
              escapeHtml(
                safeJson(receipt)
              ) +
              "</pre>" +
              "</details>"
            );
          }
        )
        .join("");
  }

  function renderTechnical() {
    setText(
      "ledgerOutput",
      state.ledger
        ? state.rawLedgerText
        : "No ledger produced yet."
    );

    setText(
      "rawReceiptsOutput",
      state.receipts.length
        ? safeJson(
            state.receipts
          )
        : "No receipts produced yet."
    );
  }

  function renderAll() {
    renderRegistrySummary();
    renderSummary();
    renderCycleMap();
    renderReceipts();
    renderTechnical();
  }

  function setRunning(running) {
    state.running =
      Boolean(running);

    var button =
      byId("runDiagnostic");

    if (button) {
      button.disabled =
        state.running;

      button.textContent =
        state.running
          ? "Running Diagnostic"
          : "Run Diagnostic";
    }
  }

  function runDiagnostic() {
    if (state.running) {
      return Promise.resolve(
        frozenClone(
          state.ledger
        )
      );
    }

    setRunning(true);

    state.cycleId =
      "AUDRALIA_DIAGNOSTIC_CYCLE_" +
      Date.now();

    state.lastRunAt =
      nowIso();

    state.conductorResult =
      null;

    state.conductorReceipt =
      null;

    state.conductorState =
      null;

    state.stationRegistrations =
      [];

    state.auxiliaryRegistrations =
      [];

    state.receipts =
      [];

    state.ledger =
      null;

    state.readerReport =
      "";

    state.rawLedgerText =
      "";

    state.lastError =
      null;

    refreshRegistryState();
    inspectEngineState();
    renderAll();

    var request =
      buildConductorRequest();

    return invokeConductor(request)
      .then(
        function receiveConductorResult(
          normalized
        ) {
          state.conductorResult =
            normalized.conductorResult;

          state.receipts =
            normalized.receipts;

          state.ledger =
            composeLedger();

          state.rawLedgerText =
            safeJson(
              state.ledger
            );

          state.readerReport =
            composeReaderReport(
              state.ledger
            );

          renderAll();

          toast(
            state.ledger.overallStatus ===
              "PASS"
              ? "Diagnostic cycle completed."
              : "Diagnostic cycle completed with held or attention items."
          );

          return frozenClone(
            state.ledger
          );
        }
      )
      .catch(
        function handleUnexpectedRunError(
          error
        ) {
          state.lastError =
            String(
              error &&
              error.message
                ? error.message
                : error
            );

          state.receipts =
            makeHeldReceipts(
              "DIAGNOSTIC_CONTROLLER_UNEXPECTED_ERROR",
              "The route controller could not complete the diagnostic cycle.",
              state.lastError
            );

          state.ledger =
            composeLedger();

          state.rawLedgerText =
            safeJson(
              state.ledger
            );

          state.readerReport =
            composeReaderReport(
              state.ledger
            );

          renderAll();

          toast(
            "Diagnostic cycle held after controller error."
          );

          return frozenClone(
            state.ledger
          );
        }
      )
      .then(
        function finishRun(value) {
          setRunning(false);
          return value;
        },
        function finishRejected(error) {
          setRunning(false);
          throw error;
        }
      );
  }

  function copyText(
    text,
    message
  ) {
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
        .then(
          function copied() {
            toast(
              message ||
              "Copied."
            );
          }
        )
        .catch(
          function clipboardRejected() {
            fallbackCopy(
              text,
              message
            );
          }
        );

      return;
    }

    fallbackCopy(
      text,
      message
    );
  }

  function fallbackCopy(
    text,
    message
  ) {
    if (!doc) {
      return;
    }

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
        message ||
        "Copied."
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

  function wireTabs() {
    if (!doc) {
      return;
    }

    var buttons =
      Array.prototype.slice.call(
        doc.querySelectorAll(
          "[data-tab]"
        )
      );

    var panels = {
      ledger:
        byId("tabLedger"),

      receipts:
        byId("tabReceipts"),

      contracts:
        byId("tabContracts"),

      boundary:
        byId("tabBoundary")
    };

    buttons.forEach(
      function bindTab(button) {
        button.addEventListener(
          "click",
          function activateTab() {
            var tab =
              button.getAttribute(
                "data-tab"
              );

            buttons.forEach(
              function resetTab(other) {
                other.setAttribute(
                  "aria-selected",
                  other === button
                    ? "true"
                    : "false"
                );
              }
            );

            Object.keys(panels).forEach(
              function togglePanel(key) {
                if (panels[key]) {
                  panels[key].hidden =
                    key !== tab;
                }
              }
            );
          }
        );
      }
    );
  }

  function wireUi() {
    var runButton =
      byId("runDiagnostic");

    var targetButton =
      byId("toggleTargetFrame");

    var copyReaderButton =
      byId("copyReaderReport");

    var copyLedgerButton =
      byId("copyReceiptLedger");

    if (runButton) {
      runButton.addEventListener(
        "click",
        function requestDiagnosticRun() {
          runDiagnostic();
        }
      );
    }

    if (targetButton) {
      targetButton.addEventListener(
        "click",
        function toggleTargetFrame() {
          var shell =
            byId(
              "targetFrameShell"
            );

          if (!shell) {
            return;
          }

          shell.hidden =
            !shell.hidden;

          targetButton.setAttribute(
            "aria-expanded",
            shell.hidden
              ? "false"
              : "true"
          );
        }
      );
    }

    if (copyReaderButton) {
      copyReaderButton.addEventListener(
        "click",
        function copyReaderReport() {
          copyText(
            state.readerReport,
            "Reader report copied."
          );
        }
      );
    }

    if (copyLedgerButton) {
      copyLedgerButton.addEventListener(
        "click",
        function copyLedger() {
          copyText(
            state.rawLedgerText,
            "Receipt ledger copied."
          );
        }
      );
    }

    wireTabs();
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

      running:
        state.running,

      cycleId:
        state.cycleId,

      lastRunAt:
        state.lastRunAt,

      registrySnapshot:
        state.registrySnapshot,

      registryReceipt:
        state.registryReceipt,

      authorityRecords:
        state.authorityRecords,

      engineRecords:
        state.engineRecords,

      selectedEngine:
        state.selectedEngine,

      engineInspection:
        state.engineInspection,

      engineOps:
        state.engineOps,

      engineReceipt:
        state.engineReceipt,

      conductorReceipt:
        state.conductorReceipt,

      conductorState:
        state.conductorState,

      stationRegistrations:
        state.stationRegistrations,

      auxiliaryRegistrations:
        state.auxiliaryRegistrations,

      receiptCount:
        state.receipts.length,

      receipts:
        state.receipts,

      ledger:
        state.ledger,

      readerReport:
        state.readerReport,

      lastError:
        state.lastError
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

      GOVERNING_ENGINE_CONTRACT:
        GOVERNING_ENGINE_CONTRACT,

      CORE_ENGINE_CONTRACT:
        CORE_ENGINE_CONTRACT,

      REGISTRY_CONTRACT:
        REGISTRY_CONTRACT,

      DEFAULT_ENGINE_ID:
        DEFAULT_ENGINE_ID,

      runDiagnostic:
        runDiagnostic,

      refreshRegistry:
        function refreshRegistry() {
          refreshRegistryState();
          inspectEngineState();
          renderAll();

          return frozenClone(
            state.registrySnapshot
          );
        },

      render:
        function render() {
          renderAll();

          return getPublicState();
        },

      getState:
        getPublicState,

      getLedger:
        function getLedger() {
          return frozenClone(
            state.ledger
          );
        },

      getReceipts:
        function getReceipts() {
          return frozenClone(
            state.receipts
          );
        },

      getReaderReport:
        function getReaderReport() {
          return String(
            state.readerReport ||
            ""
          );
        },

      getRegistrySnapshot:
        function getRegistrySnapshot() {
          return frozenClone(
            state.registrySnapshot
          );
        },

      getRegistryReceipt:
        function getRegistryReceipt() {
          return frozenClone(
            state.registryReceipt
          );
        }
    });
  }

  function publishApi() {
    var api =
      buildApi();

    root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER =
      api;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA =
        {};
    }

    root.AUDRALIA.diagnosticRouteController =
      api;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_VERSION__ =
      VERSION;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONTRACT__ =
      CONTRACT;

    return api;
  }

  function init() {
    if (state.initialized) {
      return;
    }

    state.initialized =
      true;

    wireUi();
    publishApi();

    refreshRegistryState();
    inspectEngineState();
    renderAll();

    toast(
      getRegistry()
        ? "Audralia diagnostic registry loaded."
        : "Audralia diagnostic page loaded; registry held."
    );
  }

  var existing =
    root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER;

  if (
    existing &&
    existing.CONTRACT &&
    existing.CONTRACT !== CONTRACT &&
    existing.CONTRACT !== PREVIOUS_CONTRACT
  ) {
    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONFLICT__ =
      deepFreeze({
        schema:
          "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_INSTALLATION_CONFLICT_v1",

        expectedContract:
          CONTRACT,

        previousContract:
          PREVIOUS_CONTRACT,

        existingContract:
          existing.CONTRACT,

        replacementPerformed:
          false,

        generatedAt:
          nowIso()
      });

    return;
  }

  if (
    existing &&
    existing.CONTRACT === CONTRACT
  ) {
    return;
  }

  if (
    doc &&
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
