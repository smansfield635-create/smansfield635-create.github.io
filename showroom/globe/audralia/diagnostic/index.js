// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v2
// Full-file replacement.
//
// Purpose:
// - Control the reader-first Audralia diagnostic route.
// - Read and render the DGB governing contract, runtime core, and engine registry.
// - Delegate nine-cycle orchestration to the Audralia North conductor.
// - Supply only observed, registry-derived, or explicitly unavailable evidence.
// - Render reader summaries, station receipts, technical ledgers, tabs, and target frame.
// - Expose cloned and frozen inspection snapshots.
//
// Owns:
// - route UI wiring;
// - engine-family registry rendering;
// - diagnostic-run request construction;
// - North-conductor invocation;
// - ledger normalization;
// - reader-report rendering;
// - receipt rendering;
// - technical-tab controls;
// - target-frame visibility;
// - copy controls.
//
// Does not own:
// - governing engine-contract behavior;
// - runtime-engine implementation;
// - registry implementation;
// - diagnostic station logic;
// - lifecycle mutation;
// - production evidence submission;
// - renderer mutation;
// - runtime restart;
// - repair authorization;
// - readiness;
// - visual pass;
// - WebGL/WebGPU initialization.
//
// Evidence law:
// - Missing evidence becomes HOLD or UNKNOWN.
// - Declared structure is not runtime proof.
// - No positive frame, presentation, visibility, interaction, backend,
//   scene, camera, geometry, material, shader, or pipeline evidence is fabricated.
//
// Quiet load:
// - no engine instance creation;
// - no adapter registration;
// - no scheduler activation;
// - no production mutation;
// - no diagnostic run until explicitly requested.

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
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v2";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v1";

  var VERSION =
    "2.0.0";

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

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_CONDUCTOR_REQUEST_v2";

  var LEDGER_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v2";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var READER_REPORT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_READER_REPORT_v2";

  var STATIONS = Object.freeze([
    Object.freeze({
      position: 1,
      stationId: "NORTH_PROBE_INTAKE",
      label: "North Intake",
      fibonacci: "F1"
    }),

    Object.freeze({
      position: 2,
      stationId: "EAST_PROBE_SOURCE",
      label: "East Source",
      fibonacci: "F3"
    }),

    Object.freeze({
      position: 3,
      stationId: "EAST_CONSTRUCTION_INTERPRETATION",
      label: "East Construction",
      fibonacci: "F5"
    }),

    Object.freeze({
      position: 4,
      stationId: "CANVAS_SURFACE_TRUTH",
      label: "3D Surface Truth",
      fibonacci: "F8"
    }),

    Object.freeze({
      position: 5,
      stationId: "WEST_PROBE_RUNTIME",
      label: "West Runtime",
      fibonacci: "F13"
    }),

    Object.freeze({
      position: 6,
      stationId: "WEST_RUNTIME_INTERPRETATION",
      label: "West Interpretation",
      fibonacci: "F21"
    }),

    Object.freeze({
      position: 7,
      stationId: "SOUTH_PROBE_HANDOFF",
      label: "South Handoff",
      fibonacci: "F34"
    }),

    Object.freeze({
      position: 8,
      stationId: "SOUTH_RESTITUTION_INTERPRETATION",
      label: "South Restitution",
      fibonacci: "F55"
    }),

    Object.freeze({
      position: 9,
      stationId: "RAIL_TERMINAL_SYNTHESIS",
      label: "Rail Synthesis",
      fibonacci: "F89"
    })
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
    receipts: [],
    ledger: null,
    readerReport: "",
    rawLedgerText: "",
    lastError: null
  };

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
      return value.toISOString();
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

    Object.getOwnPropertyNames(value).forEach(
      function freezeProperty(key) {
        var child;

        try {
          child = value[key];
        } catch (_error) {
          child = null;
        }

        deepFreeze(
          child,
          memory
        );
      }
    );

    try {
      Object.freeze(value);
    } catch (_error) {
      // Host objects may reject freezing.
    }

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

  function stableStringify(value) {
    try {
      return JSON.stringify(
        stablePrepare(value)
      );
    } catch (_error) {
      return String(value);
    }
  }

  function hashObject(value) {
    var text =
      stableStringify(value);

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
      ("00000000" + result.toString(16))
        .slice(-8)
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
    allowedClasses,
    activeClass
  ) {
    if (!node) {
      return;
    }

    allowedClasses.forEach(function removeClass(name) {
      node.classList.remove(name);
    });

    if (activeClass) {
      node.classList.add(activeClass);
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

    root.clearTimeout(
      toast._timer
    );

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

  function normalizeStatus(value, fallback) {
    var normalized =
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
      UNKNOWN: true
    };

    return allowed[normalized]
      ? normalized
      : fallback || "UNKNOWN";
  }

  function statusClass(status) {
    var normalized =
      normalizeStatus(
        status,
        "UNKNOWN"
      );

    if (
      normalized === "PASS"
    ) {
      return "pass";
    }

    if (
      normalized === "HOLD" ||
      normalized === "HELD" ||
      normalized === "PARTIAL_PASS" ||
      normalized === "UNVERIFIED"
    ) {
      return "hold";
    }

    if (
      normalized === "FAIL"
    ) {
      return "fail";
    }

    if (
      normalized === "CONFLICT"
    ) {
      return "conflict";
    }

    if (
      normalized === "ERROR"
    ) {
      return "error";
    }

    if (
      normalized === "DEGRADED"
    ) {
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

  function getContractAuthority() {
    return (
      root.DGB_ENGINE_CONTRACT ||
      root.DGBEngineContract ||
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
      state.registrySnapshot = null;
      state.registryReceipt = null;
      state.authorityRecords = [];
      state.engineRecords = [];
      state.selectedEngine = null;

      return {
        available: false,
        status: "HELD",
        reason: "ENGINE_REGISTRY_NOT_LOADED"
      };
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

    var selectableCount =
      state.registrySnapshot &&
      Number.isFinite(
        Number(
          state.registrySnapshot
            .selectableEngineCount
        )
      )
        ? Number(
            state.registrySnapshot
              .selectableEngineCount
          )
        : state.engineRecords.filter(
            function selectable(record) {
              return Boolean(
                record &&
                record.selectable
              );
            }
          ).length;

    return {
      available: true,
      status:
        selectableCount > 0
          ? "PASS"
          : "HOLD",
      reason:
        selectableCount > 0
          ? "ENGINE_REGISTRY_AVAILABLE"
          : "NO_SELECTABLE_ENGINE"
    };
  }

  function inspectEngineState() {
    var engine =
      getEngine();

    var selected =
      state.selectedEngine;

    var instanceIds = [];

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

    return {
      engineLoaded:
        Boolean(engine),

      engineIdentityMatched:
        Boolean(
          selected &&
          selected.identityMatched
        ),

      engineSelectable:
        Boolean(
          selected &&
          selected.selectable
        ),

      instanceId:
        instanceId,

      liveInstanceCount:
        instanceIds.length,

      inspectionAvailable:
        Boolean(
          state.engineInspection
        ),

      opsAvailable:
        Boolean(
          state.engineOps
        ),

      receiptAvailable:
        Boolean(
          state.engineReceipt
        )
    };
  }

  function readObservedValue(
    source,
    path
  ) {
    if (!source) {
      return null;
    }

    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      source;

    for (
      var index = 0;
      index < parts.length;
      index += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined ||
        !Object.prototype.hasOwnProperty.call(
          Object(cursor),
          parts[index]
        )
      ) {
        return null;
      }

      cursor =
        cursor[parts[index]];
    }

    if (
      typeof cursor === "boolean" ||
      typeof cursor === "number" ||
      typeof cursor === "string"
    ) {
      return cursor;
    }

    return cursor === null ||
      cursor === undefined
      ? null
      : clone(cursor);
  }

  function buildRuntimeEvidence() {
    var ops =
      state.engineOps;

    var inspection =
      state.engineInspection;

    var selected =
      state.selectedEngine;

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
        selected
          ? selected.engineId
          : DEFAULT_ENGINE_ID,

      engineLoaded:
        Boolean(
          selected &&
          selected.loaded
        ),

      contractMatched:
        Boolean(
          selected &&
          selected.governingContractMatched
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
        readObservedValue(
          observed,
          "fileLoaded"
        ),

      modelValidated:
        readObservedValue(
          observed,
          "modelValidated"
        ),

      instanceCreated:
        readObservedValue(
          observed,
          "instanceCreated"
        ),

      mountPresent:
        readObservedValue(
          observed,
          "mountPresent"
        ),

      surfaceNonzero:
        readObservedValue(
          observed,
          "surfaceNonzero"
        ),

      backendInitialized:
        readObservedValue(
          observed,
          "backendInitialized"
        ),

      resourcesUploaded:
        readObservedValue(
          observed,
          "resourcesUploaded"
        ),

      firstFrameSubmitted:
        readObservedValue(
          observed,
          "firstFrameSubmitted"
        ),

      firstFramePresented:
        readObservedValue(
          observed,
          "firstFramePresented"
        ),

      visiblePixelObserved:
        readObservedValue(
          observed,
          "visiblePixelObserved"
        ),

      interactionObserved:
        readObservedValue(
          observed,
          "interactionObserved"
        ),

      fallbackAvailable:
        readObservedValue(
          observed,
          "fallbackAvailable"
        ),

      contextRecoveryAvailable:
        readObservedValue(
          observed,
          "contextRecoveryAvailable"
        ),

      noBlockingError:
        readObservedValue(
          observed,
          "noBlockingError"
        ),

      primaryVisibility:
        renderer
          ? readObservedValue(
              renderer,
              "visiblePixelObserved"
            )
          : null,

      fallbackVisibility:
        fallback
          ? readObservedValue(
              fallback,
              "visibleOutputObserved"
            )
          : null,

      contextLost:
        renderer
          ? readObservedValue(
              renderer,
              "contextLost"
            )
          : null,

      recoveryAvailable:
        renderer
          ? readObservedValue(
              renderer,
              "recoveryAvailable"
            )
          : null,

      recoveryPending:
        renderer
          ? readObservedValue(
              renderer,
              "recoveryPending"
            )
          : null,

      errors:
        ops &&
        Array.isArray(ops.errors)
          ? frozenClone(ops.errors)
          : [],

      warnings:
        ops &&
        Array.isArray(ops.warnings)
          ? frozenClone(ops.warnings)
          : [],

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

    var frameDocument =
      null;

    var frameWindow =
      null;

    var accessible =
      false;

    var loaded =
      false;

    var targetRuntimeStatus =
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
          Boolean(
            frameDocument
          );

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
          targetRuntimeStatus =
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

        targetRuntimeStatus =
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
        targetRuntimeStatus,

      runtimeEvidenceAvailable:
        Boolean(
          targetRuntimeStatus
        ),

      classification:
        targetRuntimeStatus
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

    var receipt =
      state.registryReceipt;

    var authority =
      state.authorityRecords.length
        ? state.authorityRecords[0]
        : null;

    var selected =
      state.selectedEngine;

    return deepFreeze({
      registryLoaded:
        Boolean(
          getRegistry()
        ),

      registryContract:
        getRegistry() &&
        (
          getRegistry().CONTRACT ||
          getRegistry().contract
        )
          ? (
              getRegistry().CONTRACT ||
              getRegistry().contract
            )
          : null,

      registryContractMatched:
        Boolean(
          getRegistry() &&
          (
            getRegistry().CONTRACT ===
              REGISTRY_CONTRACT ||
            getRegistry().contract ===
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
        authority
          ? frozenClone(authority)
          : null,

      selectedEngine:
        selected
          ? frozenClone(selected)
          : null,

      receipt:
        receipt
          ? frozenClone(receipt)
          : null
    });
  }

  function buildConductorRequest() {
    var registryEvidence =
      buildRegistryEvidence();

    var runtimeEvidence =
      buildRuntimeEvidence();

    var targetEvidence =
      inspectTargetFrame();

    return deepFreeze({
      schema:
        REQUEST_SCHEMA,

      cycleId:
        state.cycleId,

      mode:
        "AUDIT",

      classification:
        "DIAGNOSTIC_ISOLATED",

      generatedAt:
        nowIso(),

      route: {
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

        route:
          "/showroom/globe/audralia/diagnostic/",

        targetRoute:
          TARGET_ROUTE
      },

      subject: {
        subjectId:
          "AUDRALIA_DIAGNOSTIC_READER_ROUTE",

        subjectType:
          "THREE_D_DIAGNOSTIC_ROUTE",

        modelSchema:
          "DGB_MODEL_PACKAGE_v1"
      },

      engineFamily: {
        governingContract:
          GOVERNING_ENGINE_CONTRACT,

        coreContract:
          CORE_ENGINE_CONTRACT,

        registryContract:
          REGISTRY_CONTRACT,

        defaultEngineId:
          DEFAULT_ENGINE_ID,

        registry:
          registryEvidence,

        runtime:
          runtimeEvidence
      },

      target: targetEvidence,

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

        dependencies: [
          "/showroom/globe/audralia/diagnostic/index.css",
          "/showroom/globe/audralia/diagnostic/index.js",
          "/assets/engine/dgb.engine.contract.js",
          "/assets/engine/dgb.engine.js",
          "/assets/engine/dgb.engine.subjects.js"
        ]
      },

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
          false,

        observerRequiredForRegistryVisibility:
          false
      },

      priorStationReceipts: [],

      priorLedgerHash: null,

      terminalSynthesisMode: true,

      noClaims: {
        productionMutationAuthorized:
          false,

        runtimeRestartAuthorized:
          false,

        rendererMutationAuthorized:
          false,

        repairAuthorized:
          false,

        readyClaimed:
          false,

        visualPassClaimed:
          false,

        f21Claimed:
          false
      }
    });
  }

  function findConductorMethod(conductor) {
    if (!conductor) {
      return null;
    }

    var methodNames = [
      "executeNineCycle",
      "runNineCycle",
      "executeDiagnosticCycle",
      "executeCycle",
      "conduct",
      "run"
    ];

    for (
      var index = 0;
      index < methodNames.length;
      index += 1
    ) {
      if (
        isFunction(
          conductor[methodNames[index]]
        )
      ) {
        return methodNames[index];
      }
    }

    return null;
  }

  function makeHeldReceipt(
    station,
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
        station.position,

      stationId:
        station.stationId,

      fibonacci:
        station.fibonacci,

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

      observations: [],

      evidence: [],

      issues: [
        {
          code:
            code,

          path:
            station.stationId,

          detail:
            detail || summary
        }
      ],

      firstHeldCoordinate:
        station.stationId,

      firstFailedCoordinate:
        null,

      firstConflictCoordinate:
        null,

      generatedAt:
        nowIso(),

      noClaims: {
        productionMutationAuthorized:
          false,

        runtimeRestartAuthorized:
          false,

        rendererMutationAuthorized:
          false,

        repairAuthorized:
          false,

        readyClaimed:
          false,

        visualPassClaimed:
          false,

        f21Claimed:
          false
      }
    });
  }

  function makeConductorHeldReceipts(
    code,
    summary,
    detail
  ) {
    return STATIONS.map(function mapHeld(station) {
      return makeHeldReceipt(
        station,
        code,
        summary,
        detail
      );
    });
  }

  function normalizeReceipt(
    receipt,
    station,
    index
  ) {
    var source =
      isObject(receipt)
        ? receipt
        : {};

    var resolvedStation =
      station ||
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
          source.fibonacci || ""
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
          : resolvedStation.position,

      stationId:
        source.stationId ||
        resolvedStation.stationId,

      fibonacci:
        source.fibonacci ||
        resolvedStation.fibonacci ||
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

      generatedAt:
        source.generatedAt ||
        nowIso(),

      noClaims:
        isObject(source.noClaims)
          ? frozenClone(source.noClaims)
          : {
              productionMutationAuthorized:
                false,

              runtimeRestartAuthorized:
                false,

              rendererMutationAuthorized:
                false,

              repairAuthorized:
                false,

              readyClaimed:
                false,

              visualPassClaimed:
                false,

              f21Claimed:
                false
            },

      raw:
        frozenClone(source)
    });
  }

  function extractReceipts(result) {
    if (Array.isArray(result)) {
      return result;
    }

    if (!isObject(result)) {
      return [];
    }

    var candidatePaths = [
      result.receipts,
      result.stationReceipts,
      result.cycleReceipts,
      result.ledger &&
        result.ledger.receipts,
      result.result &&
        result.result.receipts,
      result.packet &&
        result.packet.receipts
    ];

    for (
      var index = 0;
      index < candidatePaths.length;
      index += 1
    ) {
      if (
        Array.isArray(
          candidatePaths[index]
        )
      ) {
        return candidatePaths[index];
      }
    }

    return [];
  }

  function normalizeConductorResult(result) {
    var receipts =
      extractReceipts(result);

    if (!receipts.length) {
      return {
        conductorResult:
          frozenClone(result),

        receipts:
          makeConductorHeldReceipts(
            "CONDUCTOR_RETURNED_NO_RECEIPTS",
            "The North conductor returned no station receipts.",
            "No receipt collection could be extracted from the conductor result."
          )
      };
    }

    var normalized = [];

    STATIONS.forEach(function normalizeExpectedStation(
      station,
      index
    ) {
      var matching =
        receipts.find(function findMatching(receipt) {
          return (
            receipt &&
            receipt.stationId ===
              station.stationId
          );
        });

      if (!matching) {
        matching =
          receipts[index] || null;
      }

      if (!matching) {
        normalized.push(
          makeHeldReceipt(
            station,
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
          station,
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

  function invokeConductor(request) {
    var conductor =
      getConductor();

    var methodName =
      findConductorMethod(conductor);

    if (
      !conductor ||
      !methodName
    ) {
      return Promise.resolve({
        conductorResult: null,

        receipts:
          makeConductorHeldReceipts(
            "NORTH_CONDUCTOR_UNAVAILABLE",
            "The North conductor is unavailable.",
            "No compatible North-conductor execution method was found."
          )
      });
    }

    try {
      return Promise.resolve(
        conductor[methodName].call(
          conductor,
          request
        )
      )
        .then(function conductorResolved(result) {
          return normalizeConductorResult(
            result
          );
        })
        .catch(function conductorRejected(error) {
          return {
            conductorResult: {
              error:
                String(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
            },

            receipts:
              makeConductorHeldReceipts(
                "NORTH_CONDUCTOR_REJECTED",
                "The North conductor rejected the diagnostic request.",
                String(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
              )
          };
        });
    } catch (error) {
      return Promise.resolve({
        conductorResult: {
          error:
            String(
              error &&
              error.message
                ? error.message
                : error
            )
        },

        receipts:
          makeConductorHeldReceipts(
            "NORTH_CONDUCTOR_THROW",
            "The North conductor threw during diagnostic execution.",
            String(
              error &&
              error.message
                ? error.message
                : error
            )
          )
      });
    }
  }

  function composeLedger() {
    var passCount =
      state.receipts.filter(
        function countPass(receipt) {
          return receipt.status === "PASS";
        }
      ).length;

    var holdCount =
      state.receipts.filter(
        function countHold(receipt) {
          return (
            receipt.status === "HOLD" ||
            receipt.status === "HELD" ||
            receipt.status === "PARTIAL_PASS" ||
            receipt.status === "UNVERIFIED"
          );
        }
      ).length;

    var failCount =
      state.receipts.filter(
        function countFail(receipt) {
          return receipt.status === "FAIL";
        }
      ).length;

    var conflictCount =
      state.receipts.filter(
        function countConflict(receipt) {
          return receipt.status === "CONFLICT";
        }
      ).length;

    var errorCount =
      state.receipts.filter(
        function countError(receipt) {
          return receipt.status === "ERROR";
        }
      ).length;

    var degradedCount =
      state.receipts.filter(
        function countDegraded(receipt) {
          return receipt.status === "DEGRADED";
        }
      ).length;

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

    var core = {
      schema:
        LEDGER_SCHEMA,

      contract:
        CONTRACT,

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

      noClaims: {
        productionMutationAuthorized:
          false,

        runtimeRestartAuthorized:
          false,

        rendererMutationAuthorized:
          false,

        repairAuthorized:
          false,

        readyClaimed:
          false,

        visualPassClaimed:
          false,

        f21Claimed:
          false
      }
    };

    core.ledgerHash =
      hashObject(core);

    return deepFreeze(core);
  }

  function readableOverall(ledger) {
    if (!ledger) {
      return "Waiting";
    }

    switch (ledger.overallStatus) {
      case "PASS":
        return "Complete diagnostic path";

      case "HOLD":
        return "Held for evidence";

      case "DEGRADED":
        return "Degraded diagnostic result";

      case "FAIL":
        return "Failure reported";

      case "CONFLICT":
        return "Conflict reported";

      case "ERROR":
        return "Error reported";

      default:
        return "Unverified diagnostic path";
    }
  }

  function plainLanguage(ledger) {
    if (!ledger) {
      return (
        "No diagnostic ledger has been produced yet. " +
        "The engine registry may still be inspected independently."
      );
    }

    if (ledger.errorCount > 0) {
      return (
        "The diagnostic path encountered an execution error. " +
        "Open the station receipts to identify the affected stage."
      );
    }

    if (ledger.conflictCount > 0) {
      return (
        "The diagnostic path found incompatible authority or runtime claims. " +
        "No readiness conclusion can be made."
      );
    }

    if (ledger.failCount > 0) {
      return (
        "The diagnostic path found a failed condition. " +
        "This report identifies the failure but does not authorize repair."
      );
    }

    if (ledger.degradedCount > 0) {
      return (
        "The diagnostic path completed with degraded evidence. " +
        "The result is not equivalent to a production-ready engine."
      );
    }

    if (ledger.holdCount > 0) {
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
      "The diagnostic path is incomplete. " +
      "Inspect the station receipts and engine-family records."
    );
  }

  function composeReaderReport(ledger) {
    var attentionCount =
      ledger.failCount +
      ledger.conflictCount +
      ledger.errorCount +
      ledger.degradedCount;

    return [
      "AUDRALIA DIAGNOSTIC READER REPORT",
      "SCHEMA=" + READER_REPORT_SCHEMA,
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
    var station =
      STATIONS.find(function findStation(entry) {
        return entry.stationId === stationId;
      });

    return station
      ? station.label
      : stationId ||
          "Unknown Station";
  }

  function renderRegistrySummary() {
    refreshRegistryState();

    var snapshot =
      state.registrySnapshot;

    var authorityCount =
      snapshot
        ? Number(
            snapshot.authorityCount || 0
          )
        : state.authorityRecords.length;

    var assignedCount =
      snapshot
        ? Number(
            snapshot.assignedEngineCount || 0
          )
        : state.engineRecords.filter(
            function assigned(record) {
              return record && !record.reserved;
            }
          ).length;

    var selectableCount =
      snapshot
        ? Number(
            snapshot.selectableEngineCount || 0
          )
        : state.engineRecords.filter(
            function selectable(record) {
              return record && record.selectable;
            }
          ).length;

    var reservedCount =
      snapshot
        ? Number(
            snapshot.reservedEngineCount || 0
          )
        : state.engineRecords.filter(
            function reserved(record) {
              return record && record.reserved;
            }
          ).length;

    setText(
      "governingContractCount",
      String(authorityCount)
    );

    setText(
      "assignedEngineCount",
      String(assignedCount)
    );

    setText(
      "selectableEngineCount",
      String(selectableCount)
    );

    setText(
      "reservedEngineCount",
      String(reservedCount)
    );

    setText(
      "governingContractSummary",
      authorityCount > 0
        ? "The governing contract is registered separately from the runtime engine."
        : "The governing contract record is unavailable."
    );

    setText(
      "assignedEngineSummary",
      assignedCount > 0
        ? "One runtime engine subject is assigned to the registry."
        : "No runtime engine subject is currently assigned."
    );

    setText(
      "selectableEngineSummary",
      selectableCount > 0
        ? "The registered runtime core is available for selection."
        : "The runtime core is held until its authority and identity are admitted."
    );

    setText(
      "reservedEngineSummary",
      reservedCount > 0
        ? String(reservedCount) +
          " future engine slots remain reserved."
        : "No reserved engine slots were reported."
    );

    var pill =
      byId("engineRegistryStatusPill");

    if (pill) {
      var pillStatus =
        !getRegistry()
          ? "held"
          : selectableCount > 0
            ? "available"
            : "held";

      setClassState(
        pill,
        [
          "available",
          "ready",
          "pass",
          "held",
          "waiting",
          "error",
          "conflict"
        ],
        pillStatus
      );

      pill.textContent =
        !getRegistry()
          ? "REGISTRY_NOT_LOADED"
          : selectableCount > 0
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
      list.innerHTML = [
        '<article class="receipt-empty">',
        "<h3>Engine registry unavailable</h3>",
        "<p>The registry global was not found. The diagnostic route remains held.</p>",
        "</article>"
      ].join("");

      return;
    }

    var fragments = [];

    state.authorityRecords.forEach(
      function renderAuthority(record) {
        fragments.push([
          '<article class="receipt-card authority-record">',
          "<h3>",
          escapeHtml(
            record.authorityName ||
            record.authorityId ||
            "Governing Contract"
          ),
          "</h3>",
          "<p>",
          "Role: ",
          escapeHtml(
            record.role ||
            "GOVERNING_CONTRACT"
          ),
          "</p>",
          "<p>",
          "Status: ",
          escapeHtml(
            record.status ||
            "UNKNOWN"
          ),
          "</p>",
          "<p>",
          "File: ",
          escapeHtml(
            record.file ||
            "/assets/engine/dgb.engine.contract.js"
          ),
          "</p>",
          "<p>",
          "Executable engine: ",
          record.executableEngine
            ? "Yes"
            : "No",
          "</p>",
          "</article>"
        ].join(""));
      }
    );

    state.engineRecords.forEach(
      function renderEngine(record) {
        fragments.push([
          '<article class="receipt-card engine-record ',
          record.reserved
            ? "held"
            : record.selectable
              ? "pass"
              : "hold",
          '">',
          "<h3>",
          escapeHtml(
            record.engineName ||
            (
              record.reserved
                ? "Reserved Engine Slot " +
                  String(record.slot)
                : record.engineId ||
                  "Runtime Engine"
            )
          ),
          "</h3>",
          "<p>",
          "Role: ",
          escapeHtml(
            record.role ||
            "RUNTIME_ENGINE"
          ),
          "</p>",
          "<p>",
          "Status: ",
          escapeHtml(
            record.status ||
            "UNKNOWN"
          ),
          "</p>",
          "<p>",
          "Selectable: ",
          record.selectable
            ? "Yes"
            : "No",
          "</p>",
          "<p>",
          "File: ",
          escapeHtml(
            record.file ||
            "Not assigned"
          ),
          "</p>",
          "</article>"
        ].join(""));
      }
    );

    list.innerHTML =
      fragments.join("");
  }

  function renderSummary() {
    var ledger =
      state.ledger;

    var attentionCount =
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
        ? String(ledger.passCount)
        : "0"
    );

    setText(
      "heldCount",
      ledger
        ? String(ledger.holdCount)
        : "0"
    );

    setText(
      "attentionCount",
      String(attentionCount)
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

    STATIONS.forEach(function renderStation(station) {
      var node =
        doc.querySelector(
          '[data-station="' +
          station.stationId +
          '"]'
        );

      var receipt =
        state.receipts.find(
          function findReceipt(entry) {
            return (
              entry.stationId ===
              station.stationId
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
        station.label +
        ": " +
        (
          receipt.summary ||
          receipt.status ||
          "UNKNOWN"
        )
      );
    });
  }

  function renderReceipts() {
    var list =
      byId("receiptList");

    if (!list) {
      return;
    }

    if (!state.receipts.length) {
      list.innerHTML = [
        '<article class="receipt-empty">',
        "<h3>No receipts yet</h3>",
        "<p>Run the diagnostic track to populate station receipts.</p>",
        "</article>"
      ].join("");

      return;
    }

    list.innerHTML =
      state.receipts
        .map(function renderReceipt(
          receipt,
          index
        ) {
          var issueCount =
            Array.isArray(receipt.issues)
              ? receipt.issues.length
              : 0;

          return [
            '<details class="receipt-card ',
            escapeHtml(
              statusClass(
                receipt.status
              )
            ),
            '">',
            "<summary>",
            escapeHtml(
              String(index + 1)
            ),
            " · ",
            escapeHtml(
              stationLabel(
                receipt.stationId
              )
            ),
            " · ",
            escapeHtml(
              receipt.status
            ),
            "</summary>",
            '<div class="receipt-meta">',
            "<span>",
            escapeHtml(
              receipt.stationId
            ),
            "</span>",
            "<span>",
            escapeHtml(
              receipt.fibonacci || ""
            ),
            "</span>",
            "<span>Issues: ",
            escapeHtml(
              String(issueCount)
            ),
            "</span>",
            "</div>",
            "<p>",
            escapeHtml(
              receipt.summary
            ),
            "</p>",
            "<pre>",
            escapeHtml(
              safeJson(receipt)
            ),
            "</pre>",
            "</details>"
          ].join("");
        })
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
        ? safeJson(state.receipts)
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
        frozenClone(state.ledger)
      );
    }

    setRunning(true);

    state.cycleId =
      "AUDRALIA_DIAGNOSTIC_CYCLE_" +
      Date.now();

    state.lastRunAt =
      nowIso();

    state.receipts = [];
    state.ledger = null;
    state.readerReport = "";
    state.rawLedgerText = "";
    state.conductorResult = null;
    state.lastError = null;

    refreshRegistryState();
    inspectEngineState();
    renderAll();

    var request =
      buildConductorRequest();

    return invokeConductor(request)
      .then(function receiveConductorResult(
        normalized
      ) {
        state.conductorResult =
          normalized.conductorResult;

        state.receipts =
          normalized.receipts;

        state.ledger =
          composeLedger();

        state.rawLedgerText =
          safeJson(state.ledger);

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
      })
      .catch(function handleUnexpectedRunError(
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
          makeConductorHeldReceipts(
            "DIAGNOSTIC_CONTROLLER_UNEXPECTED_ERROR",
            "The route controller could not complete the diagnostic cycle.",
            state.lastError
          );

        state.ledger =
          composeLedger();

        state.rawLedgerText =
          safeJson(state.ledger);

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
      })
      .finally(function finishRun() {
        setRunning(false);
      });
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
          toast(
            message || "Copied."
          );
        })
        .catch(function clipboardRejected() {
          fallbackCopy(
            text,
            message
          );
        });

      return;
    }

    fallbackCopy(
      text,
      message
    );
  }

  function fallbackCopy(text, message) {
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
        message || "Copied."
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

    buttons.forEach(function bindTab(button) {
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
    });
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
            byId("targetFrameShell");

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

  function publishApi() {
    var API =
      deepFreeze({
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
              state.readerReport || ""
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

    root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER =
      API;

    if (
      !root.AUDRALIA ||
      typeof root.AUDRALIA !== "object"
    ) {
      root.AUDRALIA = {};
    }

    root.AUDRALIA.diagnosticRouteController =
      API;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_VERSION__ =
      VERSION;

    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONTRACT__ =
      CONTRACT;

    return API;
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
    existing.CONTRACT !== CONTRACT
  ) {
    root.__AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_CONFLICT__ =
      deepFreeze({
        schema:
          "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_INSTALLATION_CONFLICT_v1",

        expectedContract:
          CONTRACT,

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
