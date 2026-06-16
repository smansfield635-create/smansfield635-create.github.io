// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v6
// Full-file replacement.
// Diagnostic-only.
//
// Previous contract:
// - AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v5
//
// Purpose:
// - Preserve the complete distributed diagnostic control-panel family.
// - Actively bind the public Audralia route when the target is shown.
// - Distinguish target visibility from target-route readiness.
// - Prevent Nine-Cycle execution against about:blank or a mismatched route.
// - Expose the existing target Window before Nine-Cycle-initiated navigation.
// - Preserve one public Nine-Cycle Promise across target navigation.
// - Release the deferred cycle only after the expected target route is observed.
// - Resolve every accepted Nine-Cycle request with a final cycle receipt.
// - Preserve established bridge-facing receipt schema identities.
// - Publish bounded target-lifecycle evidence without claiming runtime truth.
//
// Authority:
// - F34 SOUTH_PROBE_HANDOFF
// - F55 SOUTH_RESTITUTION_INTERPRETATION
//
// Owns:
// - user-command observation;
// - local selection and presentation state;
// - target-frame activation and navigation initiation;
// - target-frame load observation;
// - report-command coordination;
// - direct-check initiation;
// - Nine-Cycle request gating and initiation;
// - one active deferred Nine-Cycle Promise;
// - overlapping-cycle prevention;
// - controls-owned execution-lock state;
// - preservation of raw engine receipts;
// - visible placement of returned station receipts;
// - controls-local DOM observation and update evidence;
// - report-only reset;
// - full-workbench reset coordination;
// - receipt and archive presentation;
// - controls public API;
// - controls-owned receipts;
// - publication of controls requirements.
//
// Does not own:
// - canonical diagnostic truth;
// - canonical Nine-Cycle construction;
// - station-execution truth;
// - public Audralia runtime mounting;
// - production rendering;
// - exact-nine judgment;
// - restitution judgment;
// - terminal engine verdict;
// - cross-file alias certification;
// - bridge compatibility;
// - runtime script-order certification;
// - controls-to-HTML relational certification;
// - whole-family synchronization certification;
// - production repair authorization.
//
// Upstream freeze:
// - /showroom/globe/audralia/diagnostic/index.js remains unchanged.
// - /showroom/globe/audralia/diagnostic/index.inspection.lane.js remains unchanged.
//
// No new files.
// No patches.
// No competing control API.

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
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v6";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v5";

  var VERSION =
    "6.0.0";

  var FILE =
    "/showroom/globe/audralia/diagnostic/index.controls.js";

  var AUTHORITY =
    "F34_SOUTH_PROBE_HANDOFF_F55_SOUTH_RESTITUTION_INTERPRETATION";

  var ENGINE_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";

  var INSPECTION_LANE_CONTRACT =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1";

  var ENGINE_CYCLE_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v2";

  var TARGET_ROUTE =
    "/showroom/globe/audralia/";

  var TARGET_FRAME_ID =
    "audraliaDiagnosticTargetFrame";

  var FALLBACK_REPORT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v3";

  var FALLBACK_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v3";

  var CONTROL_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_DISTRIBUTED_CONTROL_PANEL_RECEIPT_v5";

  var CYCLE_RENDERING_RECEIPT_SCHEMA =
    "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_RECEIPT_v5";

  var CONTROL_REQUIREMENTS_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS_MANIFEST_v1";

  var TARGET_LIFECYCLE_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_TARGET_LIFECYCLE_STATE_v1";

  var TARGET_PREPARATION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_TARGET_PREPARATION_RECEIPT_v1";

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

  var VALID_CYCLE_TERMINAL_STATUSES =
    Object.freeze([
      "COMMITTED",
      "HELD",
      "ERROR"
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

  var TARGET_LIFECYCLE_CLASSES =
    Object.freeze([
      "TARGET_FRAME_MISSING",
      "TARGET_UNBOUND",
      "TARGET_INACCESSIBLE",
      "TARGET_ROUTE_MISMATCH",
      "TARGET_LOADING",
      "TARGET_READY"
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

  var CYCLE_TARGET_IDS =
    Object.freeze([
      "cycleStatus",
      "cycleChamber",
      "cyclePreviewSummary",
      "cycleRegistrationSummary",
      "cyclePreflightSummary",
      "cycleExecutionSummary",
      "cycleMap",
      "cycleLedgerOutput",
      "cycleReceiptList"
    ]);

  var CANONICAL_CYCLE_STATIONS =
    Object.freeze([
      Object.freeze({
        position: 1,
        fibonacci: "F1",
        role: "NORTH_PROBE_INTAKE",
        direction: "NORTH"
      }),
      Object.freeze({
        position: 2,
        fibonacci: "F3",
        role: "EAST_PROBE_SOURCE",
        direction: "EAST"
      }),
      Object.freeze({
        position: 3,
        fibonacci: "F5",
        role: "EAST_CONSTRUCTION_INTERPRETATION",
        direction: "EAST"
      }),
      Object.freeze({
        position: 4,
        fibonacci: "F8",
        role: "CANVAS_SURFACE_TRUTH",
        direction: "CENTER"
      }),
      Object.freeze({
        position: 5,
        fibonacci: "F13",
        role: "WEST_PROBE_RUNTIME",
        direction: "WEST"
      }),
      Object.freeze({
        position: 6,
        fibonacci: "F21",
        role: "WEST_RUNTIME_INTERPRETATION",
        direction: "WEST"
      }),
      Object.freeze({
        position: 7,
        fibonacci: "F34",
        role: "SOUTH_PROBE_HANDOFF",
        direction: "SOUTH"
      }),
      Object.freeze({
        position: 8,
        fibonacci: "F55",
        role: "SOUTH_RESTITUTION_INTERPRETATION",
        direction: "SOUTH"
      }),
      Object.freeze({
        position: 9,
        fibonacci: "F89",
        role: "RAIL_TERMINAL_SYNTHESIS",
        direction: "RAIL"
      })
    ]);

  var NO_CLAIMS =
    Object.freeze({
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      rendererMutationAuthorized: false,
      canvasRepairAuthorized: false,
      controlsRepairAuthorized: false,
      routeRepairAuthorized: false,
      publicRuntimeMountAuthorized: false,
      publicRuntimeMutationAuthorized: false,
      readinessClaimed: false,
      visualPassClaimed: false,
      cyclePassClaimed: false,
      exactNineIndependentlyClaimed: false,
      restitutionIndependentlyClaimed: false,
      bridgeCompatibilityClaimed: false,
      runtimeOrderClaimed: false,
      familySynchronizationClaimed: false,
      targetReadyProvesRuntimeReady: false,
      targetRouteMatchProvesRuntimeReady: false,
      targetLoadProvesRuntimeReady: false,
      f21Claimed: false,
      f89Claimed: false
    });

  var CONTROL_REQUIREMENTS =
    deepFreezeLiteral({
      schema:
        CONTROL_REQUIREMENTS_SCHEMA,

      controlsContract:
        CONTRACT,

      publicApiRequirements: [
        "createReport",
        "runDirectCheck",
        "runNineCycle",
        "viewCurrentReport",
        "copyReadableReport",
        "copyPacketReport",
        "copyRawReport",
        "executeDistributedReportCommand",
        "applyCommandContext",
        "openReceiptChamber",
        "openArchiveChamber",
        "addReportToArchive",
        "createDeepArchive",
        "resetCurrentReport",
        "resetWorkbench",
        "selectCategory",
        "selectAudit",
        "selectParticipant",
        "selectReportMode",
        "selectObservationLens",
        "selectInstrumentChamber",
        "setTargetVisible",
        "setTargetExpanded",
        "inspectTargetFrame",
        "ensureTargetReady",
        "reloadTargetFrame",
        "applyReceiptFilter",
        "selectReceipt",
        "inspectControls",
        "inspectDistributedCommands",
        "inspectInspectionLane",
        "collectReceiptFamilies",
        "refreshReceiptInventory",
        "resolveEngine",
        "closeAllSelectors",
        "renderCycleChamber",
        "refreshCycleChamber",
        "getState",
        "getCurrentReport",
        "getCurrentReportReceipt",
        "getCurrentCycleReceipt",
        "getCycleRenderingState",
        "getTargetLifecycleState",
        "getNormalizedReceipts",
        "getRequirements",
        "getReceipt"
      ],

      requiredCycleTargetIds:
        CYCLE_TARGET_IDS.slice(),

      requiredStationPositions:
        CANONICAL_CYCLE_STATIONS.map(function mapPosition(station) {
          return station.position;
        }),

      presentationStationMap:
        CANONICAL_CYCLE_STATIONS,

      expectedEngineContract:
        ENGINE_CONTRACT,

      expectedInspectionLaneContract:
        INSPECTION_LANE_CONTRACT,

      expectedEngineCycleReceiptSchema:
        ENGINE_CYCLE_RECEIPT_SCHEMA,

      expectedTargetRoute:
        TARGET_ROUTE,

      targetFrameId:
        TARGET_FRAME_ID,

      targetPreparationOwner:
        "INDEX_CONTROLS",

      certificationOwner:
        "INDEX_CONTROL_BRIDGE",

      controlsCertificationScope:
        "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_EVIDENCE_ONLY",

      noClaims:
        NO_CLAIMS
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

    target: {
      schema: TARGET_LIFECYCLE_SCHEMA,
      lifecycleClass: "TARGET_UNBOUND",
      framePresent: false,
      frameId: TARGET_FRAME_ID,
      expectedRoute: TARGET_ROUTE,
      expectedRouteNormalized: normalizeRoutePath(TARGET_ROUTE),
      declaredSrc: null,
      observedRoute: null,
      observedRouteNormalized: null,
      routeObserved: false,
      routeMatched: false,
      sameOriginAccessible: null,
      documentLoaded: false,
      documentReadyState: null,
      navigationPending: false,
      loadObserved: false,
      loadCount: 0,
      navigationCount: 0,
      pendingNineCycle: false,
      pendingNineCycleRequestedAt: null,
      deferredCycleReleaseCount: 0,
      lastVisibilityReason: null,
      lastVisibilityChangedAt: null,
      lastNavigationReason: null,
      lastNavigationStartedAt: null,
      lastLoadObservedAt: null,
      lastInspectedAt: null,
      lastTargetError: null,
      preparationReceipt: null
    },

    report: {
      current: null,
      receipt: null,
      source: null,
      fallbackHistory: []
    },

    directReceipts: [],

    cycle: {
      running: false,
      requested: false,
      executed: false,
      rawReceipt: null,
      rendering: null,
      renderingReceipt: null,
      localDomEvidence: null,
      renderedAt: null
    },

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

  var activeCycleRequest = {
    promise: null,
    resolve: null,
    settled: false,
    createdAt: null
  };

  function deepFreezeLiteral(value, seen) {
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
      Object.keys(value).forEach(function freezeLiteralChild(key) {
        deepFreezeLiteral(
          value[key],
          memory
        );
      });

      Object.freeze(value);
    } catch (_error) {}

    return value;
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

  function hasOwn(owner, key) {
    return Boolean(
      owner &&
      Object.prototype.hasOwnProperty.call(
        owner,
        key
      )
    );
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function normalizeRoutePath(value) {
    var raw =
      String(
        value === null ||
        value === undefined
          ? ""
          : value
      ).trim();

    if (!raw) {
      return null;
    }

    if (raw === "about:blank") {
      return "/blank/";
    }

    try {
      var parsed =
        new root.URL(
          raw,
          root.location && root.location.href
            ? root.location.href
            : "https://diamondgatebridge.com/"
        );

      var pathname =
        parsed.pathname || "/";

      if (pathname.charAt(0) !== "/") {
        pathname =
          "/" + pathname;
      }

      if (
        pathname.length > 1 &&
        pathname.charAt(pathname.length - 1) !== "/"
      ) {
        pathname += "/";
      }

      return pathname;
    } catch (_error) {
      var clean =
        raw.split("#")[0].split("?")[0];

      if (clean.charAt(0) !== "/") {
        clean =
          "/" + clean;
      }

      if (
        clean.length > 1 &&
        clean.charAt(clean.length - 1) !== "/"
      ) {
        clean += "/";
      }

      return clean;
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

  function normalizeToken(value) {
    return String(
      value === null ||
      value === undefined
        ? ""
        : value
    )
      .trim()
      .toUpperCase()
      .replace(/[\s\-]+/g, "_");
  }

  function normalizeFibonacci(value) {
    var token =
      normalizeToken(value);

    if (!token) {
      return "";
    }

    if (/^\d+$/.test(token)) {
      return "F" + token;
    }

    return token.charAt(0) === "F"
      ? token
      : "F" + token;
  }

  function declarationIsSupplied(value) {
    return !(
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    );
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
      return false;
    }

    node.textContent =
      value === null ||
      value === undefined
        ? ""
        : String(value);

    return true;
  }

  function setHtml(id, value) {
    var node =
      byId(id);

    if (!node) {
      return false;
    }

    node.innerHTML =
      String(value || "");

    return true;
  }

  function setHidden(id, hidden) {
    var node =
      byId(id);

    if (!node) {
      return false;
    }

    node.hidden =
      Boolean(hidden);

    return true;
  }

  function setDisabled(id, disabled) {
    var node =
      byId(id);

    if (!node) {
      return false;
    }

    node.disabled =
      Boolean(disabled);

    node.setAttribute(
      "aria-disabled",
      disabled
        ? "true"
        : "false"
    );

    return true;
  }

  function setStatus(idOrNode, status) {
    var node =
      typeof idOrNode === "string"
        ? byId(idOrNode)
        : idOrNode;

    if (!node) {
      return false;
    }

    node.setAttribute(
      "data-status",
      String(status || "UNKNOWN")
        .trim()
        .toUpperCase()
    );

    return true;
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

  function runFinalizer(finalizer, context) {
    try {
      finalizer();
    } catch (error) {
      recordError(
        "finalizer",
        error,
        context || null
      );
    }
  }

  function withFinalization(promise, finalizer, context) {
    return Promise.resolve(promise)
      .then(
        function finalizeResolved(value) {
          runFinalizer(
            finalizer,
            context
          );

          return value;
        },
        function finalizeRejected(error) {
          runFinalizer(
            finalizer,
            context
          );

          throw error;
        }
      );
  }

  function hasActiveCycleRequest() {
    return Boolean(
      activeCycleRequest.promise &&
      activeCycleRequest.settled === false
    );
  }

  function getActiveCyclePromise() {
    return hasActiveCycleRequest()
      ? activeCycleRequest.promise
      : null;
  }

  function createActiveCycleRequest() {
    if (hasActiveCycleRequest()) {
      return activeCycleRequest.promise;
    }

    activeCycleRequest.settled =
      false;

    activeCycleRequest.createdAt =
      nowIso();

    activeCycleRequest.promise =
      new Promise(function registerActiveCycleResolver(resolve) {
        activeCycleRequest.resolve =
          resolve;
      });

    return activeCycleRequest.promise;
  }

  function clearActiveCycleRequest() {
    activeCycleRequest.promise =
      null;

    activeCycleRequest.resolve =
      null;

    activeCycleRequest.settled =
      false;

    activeCycleRequest.createdAt =
      null;
  }

  function settleActiveCycleRequest(receipt) {
    if (
      !hasActiveCycleRequest() ||
      !isFunction(activeCycleRequest.resolve)
    ) {
      return false;
    }

    var resolver =
      activeCycleRequest.resolve;

    var settledReceipt =
      frozenClone(receipt);

    activeCycleRequest.settled =
      true;

    activeCycleRequest.resolve =
      null;

    resolver(
      settledReceipt
    );

    activeCycleRequest.promise =
      null;

    activeCycleRequest.settled =
      false;

    activeCycleRequest.createdAt =
      null;

    return true;
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
        Boolean(
          root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT
        ),
      errorPresent:
        Boolean(
          root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__
        )
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

  function createTargetPreparationReceipt(reason) {
    var target =
      state.target;

    var receipt = {
      schema:
        TARGET_PREPARATION_RECEIPT_SCHEMA,

      receiptId:
        "AUDRALIA_TARGET_PREPARATION_RECEIPT_" +
        Date.now(),

      controlsContract:
        CONTRACT,

      ownerType:
        "DIAGNOSTIC_OBSERVATORY_TARGET_BINDING",

      subjectId:
        "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",

      file:
        FILE,

      component:
        "TARGET_ROUTE_BINDING",

      reason:
        reason || null,

      lifecycleClass:
        target.lifecycleClass,

      framePresent:
        target.framePresent,

      frameId:
        target.frameId,

      expectedRoute:
        target.expectedRoute,

      expectedRouteNormalized:
        target.expectedRouteNormalized,

      declaredSrc:
        target.declaredSrc,

      observedRoute:
        target.observedRoute,

      observedRouteNormalized:
        target.observedRouteNormalized,

      routeObserved:
        target.routeObserved,

      routeMatched:
        target.routeMatched,

      sameOriginAccessible:
        target.sameOriginAccessible,

      documentLoaded:
        target.documentLoaded,

      documentReadyState:
        target.documentReadyState,

      navigationPending:
        target.navigationPending,

      loadObserved:
        target.loadObserved,

      pendingNineCycle:
        target.pendingNineCycle,

      targetVisible:
        state.ui.targetVisible,

      observationLens:
        state.ui.observationLens,

      lastVisibilityReason:
        target.lastVisibilityReason,

      lastVisibilityChangedAt:
        target.lastVisibilityChangedAt,

      lastTargetError:
        target.lastTargetError,

      status:
        target.lifecycleClass === "TARGET_READY"
          ? "AVAILABLE"
          : "HELD",

      noClaims:
        NO_CLAIMS,

      generatedAt:
        nowIso()
    };

    state.target.preparationReceipt =
      deepFreeze(
        clone(receipt)
      );

    return frozenClone(receipt);
  }

  function inspectTargetFrame(options) {
    var settings =
      options || {};

    var frame =
      byId(TARGET_FRAME_ID);

    var observedRoute =
      null;

    var observedNormalized =
      null;

    var sameOriginAccessible =
      null;

    var documentLoaded =
      false;

    var documentReadyState =
      null;

    var readError =
      null;

    state.target.framePresent =
      Boolean(frame);

    state.target.declaredSrc =
      frame
        ? frame.getAttribute("src")
        : null;

    state.target.lastInspectedAt =
      nowIso();

    if (!frame) {
      state.target.lifecycleClass =
        "TARGET_FRAME_MISSING";

      state.target.routeObserved =
        false;

      state.target.routeMatched =
        false;

      state.target.sameOriginAccessible =
        null;

      state.target.documentLoaded =
        false;

      state.target.documentReadyState =
        null;

      state.target.lastTargetError =
        "TARGET_FRAME_NOT_FOUND";

      createTargetPreparationReceipt(
        settings.reason ||
        "TARGET_FRAME_NOT_FOUND"
      );

      publishReceipt();

      return frozenClone(
        state.target
      );
    }

    try {
      if (
        frame.contentWindow &&
        frame.contentWindow.location
      ) {
        observedRoute =
          frame.contentWindow.location.href ||
          null;

        sameOriginAccessible =
          true;
      }

      if (
        frame.contentDocument
      ) {
        documentReadyState =
          frame.contentDocument.readyState ||
          null;

        documentLoaded =
          documentReadyState === "interactive" ||
          documentReadyState === "complete";
      }
    } catch (error) {
      sameOriginAccessible =
        false;

      readError =
        String(
          error &&
          error.message
            ? error.message
            : error
        );
    }

    if (!observedRoute) {
      try {
        observedRoute =
          frame.src ||
          frame.getAttribute("src") ||
          null;
      } catch (_error) {
        observedRoute =
          frame.getAttribute("src") ||
          null;
      }
    }

    observedNormalized =
      normalizeRoutePath(
        observedRoute
      );

    state.target.observedRoute =
      observedRoute;

    state.target.observedRouteNormalized =
      observedNormalized;

    state.target.routeObserved =
      Boolean(observedRoute);

    state.target.routeMatched =
      Boolean(
        observedNormalized &&
        observedNormalized ===
          state.target.expectedRouteNormalized
      );

    state.target.sameOriginAccessible =
      sameOriginAccessible;

    state.target.documentLoaded =
      documentLoaded;

    state.target.documentReadyState =
      documentReadyState;

    state.target.lastTargetError =
      readError;

    if (
      state.target.navigationPending &&
      !state.target.routeMatched
    ) {
      state.target.lifecycleClass =
        "TARGET_LOADING";
    } else if (
      sameOriginAccessible === false
    ) {
      state.target.lifecycleClass =
        "TARGET_INACCESSIBLE";
    } else if (
      !observedRoute ||
      observedRoute === "about:blank" ||
      observedNormalized === "/blank/"
    ) {
      state.target.lifecycleClass =
        "TARGET_UNBOUND";
    } else if (
      !state.target.routeMatched
    ) {
      state.target.lifecycleClass =
        "TARGET_ROUTE_MISMATCH";
    } else if (
      !documentLoaded
    ) {
      state.target.lifecycleClass =
        "TARGET_LOADING";
    } else {
      state.target.lifecycleClass =
        "TARGET_READY";
    }

    if (
      TARGET_LIFECYCLE_CLASSES.indexOf(
        state.target.lifecycleClass
      ) === -1
    ) {
      state.target.lifecycleClass =
        "TARGET_ROUTE_MISMATCH";
    }

    createTargetPreparationReceipt(
      settings.reason ||
      "TARGET_INSPECTED"
    );

    publishReceipt();

    return frozenClone(
      state.target
    );
  }

  function beginTargetNavigation(reason, forceReload) {
    var frame =
      byId(TARGET_FRAME_ID);

    if (!frame) {
      state.target.framePresent =
        false;

      state.target.lifecycleClass =
        "TARGET_FRAME_MISSING";

      state.target.lastTargetError =
        "TARGET_FRAME_NOT_FOUND";

      createTargetPreparationReceipt(
        reason ||
        "TARGET_FRAME_NOT_FOUND"
      );

      publishReceipt();

      return false;
    }

    if (
      state.target.navigationPending &&
      forceReload !== true
    ) {
      return true;
    }

    state.target.framePresent =
      true;

    state.target.navigationPending =
      true;

    state.target.loadObserved =
      false;

    state.target.documentLoaded =
      false;

    state.target.documentReadyState =
      null;

    state.target.routeMatched =
      false;

    state.target.lifecycleClass =
      "TARGET_LOADING";

    state.target.lastTargetError =
      null;

    state.target.lastNavigationReason =
      reason || "TARGET_NAVIGATION";

    state.target.lastNavigationStartedAt =
      nowIso();

    state.target.navigationCount += 1;

    try {
      frame.src =
        TARGET_ROUTE +
        "?diagnosticReload=" +
        Date.now();

      createTargetPreparationReceipt(
        reason ||
        "TARGET_NAVIGATION_STARTED"
      );

      recordAction(
        "targetNavigation.begin",
        {
          reason:
            reason || null,
          navigationCount:
            state.target.navigationCount,
          expectedRoute:
            TARGET_ROUTE,
          targetVisible:
            state.ui.targetVisible,
          observationLens:
            state.ui.observationLens
        }
      );

      publishReceipt();

      return true;
    } catch (error) {
      state.target.navigationPending =
        false;

      state.target.lifecycleClass =
        "TARGET_INACCESSIBLE";

      state.target.lastTargetError =
        String(
          error &&
          error.message
            ? error.message
            : error
        );

      createTargetPreparationReceipt(
        "TARGET_NAVIGATION_THROW"
      );

      recordError(
        "beginTargetNavigation",
        error,
        {
          reason:
            reason || null
        }
      );

      return false;
    }
  }

  function ensureTargetReady(options) {
    var settings =
      options || {};

    var inspected =
      inspectTargetFrame({
        reason:
          settings.reason ||
          "ENSURE_TARGET_READY"
      });

    if (
      inspected.lifecycleClass ===
      "TARGET_READY"
    ) {
      return {
        ready: true,
        pending: false,
        startedNavigation: false,
        target:
          inspected
      };
    }

    if (
      inspected.lifecycleClass ===
      "TARGET_LOADING" &&
      state.target.navigationPending
    ) {
      return {
        ready: false,
        pending: true,
        startedNavigation: false,
        target:
          inspected
      };
    }

    if (
      inspected.lifecycleClass ===
      "TARGET_FRAME_MISSING"
    ) {
      return {
        ready: false,
        pending: false,
        startedNavigation: false,
        target:
          inspected
      };
    }

    var started =
      beginTargetNavigation(
        settings.reason ||
        "ENSURE_TARGET_READY",
        settings.forceReload === true
      );

    return {
      ready: false,
      pending:
        Boolean(started),
      startedNavigation:
        Boolean(started),
      target:
        frozenClone(
          state.target
        )
    };
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

  function getStationByPosition(value) {
    var position =
      Number(value);

    if (
      !Number.isInteger(position) ||
      position < 1 ||
      position > 9
    ) {
      return null;
    }

    return CANONICAL_CYCLE_STATIONS[
      position - 1
    ] || null;
  }

  function getStationByRole(value) {
    var token =
      normalizeToken(value);

    if (!token) {
      return null;
    }

    var index;

    for (
      index = 0;
      index < CANONICAL_CYCLE_STATIONS.length;
      index += 1
    ) {
      if (
        CANONICAL_CYCLE_STATIONS[index].role ===
        token
      ) {
        return CANONICAL_CYCLE_STATIONS[index];
      }
    }

    return null;
  }

  function getStationByFibonacci(value) {
    var token =
      normalizeFibonacci(value);

    if (!token) {
      return null;
    }

    var index;

    for (
      index = 0;
      index < CANONICAL_CYCLE_STATIONS.length;
      index += 1
    ) {
      if (
        CANONICAL_CYCLE_STATIONS[index].fibonacci ===
        token
      ) {
        return CANONICAL_CYCLE_STATIONS[index];
      }
    }

    return null;
  }

  function inspectCoordinateFamily(
    record,
    familyName,
    keys,
    resolver
  ) {
    var declarations = [];
    var resolvedDeclarations = [];
    var unresolvedDeclarations = [];
    var resolvedPositions = [];

    keys.forEach(function inspectKey(key) {
      var value;
      var station;
      var declaration;

      if (!hasOwn(record, key)) {
        return;
      }

      value =
        record[key];

      if (!declarationIsSupplied(value)) {
        return;
      }

      station =
        resolver(value);

      declaration = {
        family:
          familyName,
        key:
          key,
        value:
          value,
        resolved:
          Boolean(station),
        station:
          station,
        resolvedPosition:
          station
            ? station.position
            : null
      };

      declarations.push(
        declaration
      );

      if (station) {
        resolvedDeclarations.push(
          declaration
        );

        if (
          resolvedPositions.indexOf(
            station.position
          ) === -1
        ) {
          resolvedPositions.push(
            station.position
          );
        }
      } else {
        unresolvedDeclarations.push(
          declaration
        );
      }
    });

    return {
      family:
        familyName,

      declared:
        declarations.length > 0,

      declarations:
        declarations,

      declarationCount:
        declarations.length,

      resolved:
        resolvedDeclarations.length > 0,

      resolvedDeclarations:
        resolvedDeclarations,

      resolvedDeclarationCount:
        resolvedDeclarations.length,

      unresolvedDeclarations:
        unresolvedDeclarations,

      unresolvedDeclarationCount:
        unresolvedDeclarations.length,

      firstResolvedStation:
        resolvedDeclarations.length
          ? resolvedDeclarations[0].station
          : null,

      firstDeclaredValue:
        declarations.length
          ? declarations[0].value
          : null,

      resolvedPositions:
        resolvedPositions,

      internalConflict:
        resolvedPositions.length > 1
    };
  }

  function resolveCycleReceiptCoordinates(receipt) {
    var record =
      isObject(receipt)
        ? receipt
        : {};

    var positionFamily =
      inspectCoordinateFamily(
        record,
        "position",
        [
          "cyclePosition",
          "position"
        ],
        getStationByPosition
      );

    var stationFamily =
      inspectCoordinateFamily(
        record,
        "station",
        [
          "stationId",
          "role"
        ],
        getStationByRole
      );

    var fibonacciFamily =
      inspectCoordinateFamily(
        record,
        "fibonacci",
        [
          "fibonacci"
        ],
        getStationByFibonacci
      );

    var families = [
      positionFamily,
      stationFamily,
      fibonacciFamily
    ];

    var resolvedPositions = [];
    var unresolvedDeclarations = [];
    var allDeclarations = [];

    families.forEach(function inspectFamily(family) {
      allDeclarations =
        allDeclarations.concat(
          family.declarations
        );

      unresolvedDeclarations =
        unresolvedDeclarations.concat(
          family.unresolvedDeclarations
        );

      family.resolvedPositions.forEach(function addPosition(position) {
        if (
          resolvedPositions.indexOf(
            position
          ) === -1
        ) {
          resolvedPositions.push(
            position
          );
        }
      });
    });

    var selectedStation =
      positionFamily.firstResolvedStation ||
      stationFamily.firstResolvedStation ||
      fibonacciFamily.firstResolvedStation ||
      null;

    var internalConflict =
      families.some(function familyConflict(family) {
        return family.internalConflict;
      });

    var crossFamilyConflict =
      resolvedPositions.length > 1;

    var noResolvableCoordinate =
      !selectedStation;

    var coordinateConflict =
      unresolvedDeclarations.length > 0 ||
      internalConflict ||
      crossFamilyConflict ||
      noResolvableCoordinate;

    return {
      selectedStation:
        selectedStation,

      selectedPosition:
        selectedStation
          ? selectedStation.position
          : null,

      declarations:
        allDeclarations,

      declarationCount:
        allDeclarations.length,

      positionDeclared:
        positionFamily.declared,

      positionValue:
        positionFamily.firstDeclaredValue,

      positionResolved:
        positionFamily.resolved,

      positionStation:
        positionFamily.firstResolvedStation,

      positionDeclarations:
        positionFamily.declarations,

      stationDeclared:
        stationFamily.declared,

      stationValue:
        stationFamily.firstDeclaredValue,

      stationResolved:
        stationFamily.resolved,

      stationStation:
        stationFamily.firstResolvedStation,

      stationDeclarations:
        stationFamily.declarations,

      fibonacciDeclared:
        fibonacciFamily.declared,

      fibonacciValue:
        fibonacciFamily.firstDeclaredValue,

      fibonacciResolved:
        fibonacciFamily.resolved,

      fibonacciStation:
        fibonacciFamily.firstResolvedStation,

      fibonacciDeclarations:
        fibonacciFamily.declarations,

      unresolvedDeclarations:
        unresolvedDeclarations,

      unresolvedDeclarationCount:
        unresolvedDeclarations.length,

      resolvedPositions:
        resolvedPositions,

      internalConflict:
        internalConflict,

      crossFamilyConflict:
        crossFamilyConflict,

      noResolvableCoordinate:
        noResolvableCoordinate,

      coordinateConflict:
        coordinateConflict
    };
  }

  function extractCycleStationReceipts(receipt) {
    var candidates = [
      receipt && receipt.stationReceipts,
      receipt && receipt.receipts,
      receipt && receipt.cycleReceipts,
      receipt && receipt.stations,
      receipt && receipt.ledger,
      receipt && receipt.entries
    ];

    var index;

    for (
      index = 0;
      index < candidates.length;
      index += 1
    ) {
      if (Array.isArray(candidates[index])) {
        return candidates[index].slice();
      }
    }

    return [];
  }

  function deriveExactNineTriState(receipt) {
    if (!receipt) {
      return null;
    }

    if (
      typeof receipt.exactNineValidated ===
      "boolean"
    ) {
      return receipt.exactNineValidated;
    }

    if (
      typeof receipt.exactNine ===
      "boolean"
    ) {
      return receipt.exactNine;
    }

    if (
      receipt.validation &&
      typeof receipt.validation.exactNineValidated ===
        "boolean"
    ) {
      return receipt.validation.exactNineValidated;
    }

    return null;
  }

  function normalizeCycleReceipt(receipt, sourceIndex) {
    var coordinates =
      resolveCycleReceiptCoordinates(
        receipt
      );

    var selected =
      coordinates.selectedStation;

    return {
      sourceIndex:
        sourceIndex,

      rawReceipt:
        frozenClone(receipt),

      receiptId:
        receipt.receiptId ||
        receipt.stationReceiptId ||
        receipt.id ||
        null,

      status:
        normalizeToken(
          receipt.status ||
          receipt.result ||
          receipt.state ||
          "UNKNOWN"
        ),

      role:
        receipt.role ||
        receipt.stationId ||
        (
          selected
            ? selected.role
            : null
        ),

      fibonacci:
        receipt.fibonacci ||
        (
          selected
            ? selected.fibonacci
            : null
        ),

      position:
        selected
          ? selected.position
          : null,

      direction:
        receipt.direction ||
        (
          selected
            ? selected.direction
            : null
        ),

      summary:
        receipt.summary ||
        receipt.message ||
        receipt.result ||
        null,

      coordinates:
        coordinates
    };
  }

  function buildCycleRenderingState(rawReceipt) {
    var stationReceipts =
      extractCycleStationReceipts(
        rawReceipt
      );

    var normalized =
      stationReceipts.map(
        normalizeCycleReceipt
      );

    var rows = {};
    var unmapped = [];
    var duplicates = [];
    var coordinateConflicts = [];
    var unresolvedDeclarations = [];

    CANONICAL_CYCLE_STATIONS.forEach(function initializeRow(station) {
      rows[station.position] = {
        station:
          station,
        receipts: [],
        presentationStatus:
          state.cycle.executed
            ? "NOT_REACHED"
            : "UNKNOWN",
        coordinateConflict:
          false,
        duplicate:
          false
      };
    });

    normalized.forEach(function mapNormalized(entry) {
      if (
        entry.coordinates.coordinateConflict
      ) {
        coordinateConflicts.push(
          entry
        );
      }

      unresolvedDeclarations =
        unresolvedDeclarations.concat(
          entry.coordinates.unresolvedDeclarations.map(
            function mapUnresolved(declaration) {
              return {
                sourceIndex:
                  entry.sourceIndex,
                receiptId:
                  entry.receiptId,
                family:
                  declaration.family,
                key:
                  declaration.key,
                value:
                  declaration.value
              };
            }
          )
        );

      if (!entry.position) {
        unmapped.push(
          entry
        );

        return;
      }

      rows[entry.position].receipts.push(
        entry
      );
    });

    Object.keys(rows).forEach(function finalizeRow(key) {
      var row =
        rows[key];

      if (!row.receipts.length) {
        row.presentationStatus =
          state.cycle.executed
            ? "NOT_REACHED"
            : "UNKNOWN";

        return;
      }

      row.coordinateConflict =
        row.receipts.some(function hasConflict(entry) {
          return entry.coordinates.coordinateConflict;
        });

      row.duplicate =
        row.receipts.length > 1;

      if (row.duplicate) {
        duplicates.push({
          position:
            row.station.position,
          receiptCount:
            row.receipts.length,
          receipts:
            row.receipts
        });
      }

      row.presentationStatus =
        row.duplicate ||
        row.coordinateConflict
          ? "CONFLICT"
          : row.receipts[0].status ||
            "AVAILABLE";
    });

    var mappedReceiptCount =
      normalized.length -
      unmapped.length;

    var renderedPositions =
      Object.keys(rows)
        .map(Number)
        .filter(function keepRendered(position) {
          return rows[position].receipts.length > 0;
        });

    var notReachedPositions =
      Object.keys(rows)
        .map(Number)
        .filter(function keepNotReached(position) {
          return (
            rows[position].presentationStatus ===
            "NOT_REACHED"
          );
        });

    var returnedReceiptMappingComplete =
      Boolean(
        state.cycle.executed &&
        unmapped.length === 0 &&
        duplicates.length === 0 &&
        coordinateConflicts.length === 0 &&
        unresolvedDeclarations.length === 0
      );

    return {
      schema:
        "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_STATE_v5",

      engineCycleStatus:
        normalizeToken(
          rawReceipt &&
          rawReceipt.status
            ? rawReceipt.status
            : "UNKNOWN"
        ),

      engineCycleTerminalClass:
        rawReceipt &&
        (
          rawReceipt.terminalClass ||
          rawReceipt.classification ||
          null
        ),

      engineExactNineValidated:
        deriveExactNineTriState(
          rawReceipt
        ),

      engineReceiptCount:
        rawReceipt &&
        Number.isFinite(
          Number(rawReceipt.receiptCount)
        )
          ? Number(rawReceipt.receiptCount)
          : normalized.length,

      stationReceipts:
        normalized,

      rows:
        rows,

      mappedReceiptCount:
        mappedReceiptCount,

      unmappedReceiptCount:
        unmapped.length,

      unmappedReceipts:
        unmapped,

      duplicateCoordinateCount:
        duplicates.length,

      duplicateCoordinates:
        duplicates,

      coordinateConflictCount:
        coordinateConflicts.length,

      coordinateConflicts:
        coordinateConflicts,

      unresolvedDeclarationCount:
        unresolvedDeclarations.length,

      unresolvedDeclarations:
        unresolvedDeclarations,

      renderedPositions:
        renderedPositions,

      notReachedPositions:
        notReachedPositions,

      returnedReceiptMappingComplete:
        returnedReceiptMappingComplete,

      logicalMappingComplete:
        returnedReceiptMappingComplete,

      logicalMappingScope:
        "RETURNED_RECEIPTS_ONLY",

      targetLifecycle:
        frozenClone(
          state.target
        ),

      createdAt:
        nowIso()
    };
  }

  function setCycleRunning(running) {
    state.cycle.running =
      Boolean(running);

    setDisabled(
      "runNineCycle",
      state.cycle.running ||
      state.target.navigationPending
    );

    var button =
      byId("runNineCycle");

    if (button) {
      button.setAttribute(
        "aria-busy",
        state.cycle.running
          ? "true"
          : "false"
      );

      button.setAttribute(
        "data-cycle-running",
        state.cycle.running
          ? "true"
          : "false"
      );

      button.setAttribute(
        "data-target-navigation-pending",
        state.target.navigationPending
          ? "true"
          : "false"
      );
    }

    publishReceipt();
  }

  function getCycleStationRow(position) {
    return (
      doc.querySelector(
        '#cycleMap [data-position="' +
          String(position) +
          '"]'
      ) ||
      doc.querySelector(
        '#cycleChamber [data-position="' +
          String(position) +
          '"]'
      )
    );
  }

  function renderCycleRow(position, rowState) {
    var row =
      getCycleStationRow(
        position
      );

    var result = {
      position:
        position,
      found:
        Boolean(row),
      updated:
        false
    };

    if (!row) {
      return result;
    }

    var status =
      rowState.presentationStatus ||
      "UNKNOWN";

    row.setAttribute(
      "data-status",
      status
    );

    row.setAttribute(
      "data-position",
      String(position)
    );

    row.setAttribute(
      "data-fibonacci",
      rowState.station.fibonacci
    );

    row.setAttribute(
      "data-role",
      rowState.station.role
    );

    row.setAttribute(
      "data-coordinate-conflict",
      rowState.coordinateConflict
        ? "true"
        : "false"
    );

    row.setAttribute(
      "data-duplicate-coordinate",
      rowState.duplicate
        ? "true"
        : "false"
    );

    var statusNode =
      row.querySelector(
        "[data-station-status]"
      ) ||
      row.querySelector(
        "[data-status-value]"
      ) ||
      row.querySelector("b");

    var summaryNode =
      row.querySelector(
        "[data-station-summary]"
      ) ||
      row.querySelector("small");

    var roleNode =
      row.querySelector(
        "[data-station-role]"
      );

    var fibonacciNode =
      row.querySelector(
        "[data-station-fibonacci]"
      );

    if (statusNode) {
      statusNode.textContent =
        status;

      statusNode.setAttribute(
        "data-status",
        status
      );
    }

    if (roleNode) {
      roleNode.textContent =
        rowState.station.role;
    }

    if (fibonacciNode) {
      fibonacciNode.textContent =
        rowState.station.fibonacci;
    }

    if (summaryNode) {
      if (!rowState.receipts.length) {
        summaryNode.textContent =
          status === "NOT_REACHED"
            ? "No station receipt returned after cycle execution."
            : "Cycle not yet executed.";
      } else if (rowState.duplicate) {
        summaryNode.textContent =
          String(rowState.receipts.length) +
          " receipts declared this position; all are preserved.";
      } else if (rowState.coordinateConflict) {
        summaryNode.textContent =
          "Receipt mapped with unresolved or contradictory coordinate evidence.";
      } else {
        summaryNode.textContent =
          rowState.receipts[0].summary ||
          rowState.receipts[0].receiptId ||
          "Station receipt available.";
      }
    }

    result.updated =
      true;

    return result;
  }

  function renderCycleReceiptList(renderingState) {
    var entries =
      renderingState.stationReceipts;

    var html =
      entries.length
        ? entries
            .map(function renderCycleReceipt(entry) {
              return (
                '<article data-cycle-receipt-position="' +
                  escapeHtml(
                    entry.position === null
                      ? "UNMAPPED"
                      : entry.position
                  ) +
                  '" data-status="' +
                  escapeHtml(
                    entry.coordinates.coordinateConflict
                      ? "CONFLICT"
                      : entry.status
                  ) +
                  '">' +
                  "<h4>" +
                  escapeHtml(
                    entry.fibonacci ||
                    "UNMAPPED"
                  ) +
                  " · " +
                  escapeHtml(
                    entry.role ||
                    "UNRESOLVED STATION"
                  ) +
                  "</h4>" +
                  "<p>" +
                  escapeHtml(
                    entry.coordinates.coordinateConflict
                      ? "Coordinate conflict retained."
                      : entry.status
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
                  "<pre>" +
                  escapeHtml(
                    safeJson({
                      receipt:
                        entry.rawReceipt,
                      coordinateEvidence:
                        entry.coordinates
                    })
                  ) +
                  "</pre>" +
                  "</article>"
              );
            })
            .join("")
        : (
            '<article class="empty-state">' +
              "<h4>No cycle receipts</h4>" +
              "<p>Run the Nine-Cycle to populate this chamber.</p>" +
              "</article>"
          );

    return setHtml(
      "cycleReceiptList",
      html
    );
  }

  function renderCycleLedger(renderingState) {
    return setText(
      "cycleLedgerOutput",
      safeJson({
        engineCycleStatus:
          renderingState.engineCycleStatus,
        engineCycleTerminalClass:
          renderingState.engineCycleTerminalClass,
        engineExactNineValidated:
          renderingState.engineExactNineValidated,
        mappedReceiptCount:
          renderingState.mappedReceiptCount,
        unmappedReceiptCount:
          renderingState.unmappedReceiptCount,
        duplicateCoordinateCount:
          renderingState.duplicateCoordinateCount,
        coordinateConflictCount:
          renderingState.coordinateConflictCount,
        unresolvedDeclarationCount:
          renderingState.unresolvedDeclarationCount,
        renderedPositions:
          renderingState.renderedPositions,
        notReachedPositions:
          renderingState.notReachedPositions,
        returnedReceiptMappingComplete:
          renderingState.returnedReceiptMappingComplete,
        targetLifecycle:
          frozenClone(
            state.target
          ),
        receipts:
          renderingState.stationReceipts
      })
    );
  }

  function renderCycleSummaryTargets(renderingState) {
    return {
      previewSummaryUpdated:
        setText(
          "cyclePreviewSummary",
          state.cycle.executed
            ? (
                "Engine cycle status: " +
                renderingState.engineCycleStatus +
                "."
              )
            : state.target.navigationPending
              ? "Target navigation is pending before Nine-Cycle execution."
              : "Nine-Cycle has not been executed."
        ),

      registrationSummaryUpdated:
        setText(
          "cycleRegistrationSummary",
          [
            renderingState.mappedReceiptCount,
            "mapped",
            renderingState.unmappedReceiptCount,
            "unmapped"
          ].join(" ")
        ),

      preflightSummaryUpdated:
        setText(
          "cyclePreflightSummary",
          [
            renderingState.coordinateConflictCount,
            "coordinate conflicts;",
            renderingState.unresolvedDeclarationCount,
            "unresolved declarations;",
            state.target.lifecycleClass
          ].join(" ")
        ),

      executionSummaryUpdated:
        setText(
          "cycleExecutionSummary",
          [
            renderingState.renderedPositions.length,
            "stations reached;",
            renderingState.notReachedPositions.length,
            "not reached"
          ].join(" ")
        )
    };
  }

  function observeAndUpdateCycleDom(renderingState) {
    var foundTargetIds = [];
    var updatedTargetIds = [];
    var missingTargetIds = [];

    CYCLE_TARGET_IDS.forEach(function inspectTarget(id) {
      if (byId(id)) {
        foundTargetIds.push(id);
      } else {
        missingTargetIds.push(id);
      }
    });

    var cycleStatusUpdated =
      setText(
        "cycleStatus",
        state.cycle.running
          ? "Cycle · Running"
          : state.target.navigationPending
            ? "Cycle · Target Loading"
            : state.cycle.executed
              ? "Cycle · " +
                renderingState.engineCycleStatus
              : "Cycle · Not Run"
      );

    if (cycleStatusUpdated) {
      setStatus(
        "cycleStatus",
        state.cycle.running
          ? "RUNNING"
          : state.target.navigationPending
            ? "HOLD"
            : state.cycle.executed
              ? renderingState.engineCycleStatus
              : "NOT_RUN"
      );

      updatedTargetIds.push(
        "cycleStatus"
      );
    }

    var chamber =
      byId("cycleChamber");

    var chamberStatusUpdated =
      false;

    if (chamber) {
      setStatus(
        chamber,
        state.cycle.running
          ? "RUNNING"
          : state.target.navigationPending
            ? "HOLD"
            : state.cycle.executed
              ? renderingState.engineCycleStatus
              : "NOT_RUN"
      );

      chamber.setAttribute(
        "data-cycle-executed",
        state.cycle.executed
          ? "true"
          : "false"
      );

      chamber.setAttribute(
        "data-target-lifecycle",
        state.target.lifecycleClass
      );

      chamber.setAttribute(
        "data-target-route-matched",
        state.target.routeMatched
          ? "true"
          : "false"
      );

      chamberStatusUpdated =
        true;

      updatedTargetIds.push(
        "cycleChamber"
      );
    }

    var summaryResults =
      renderCycleSummaryTargets(
        renderingState
      );

    if (
      summaryResults.previewSummaryUpdated
    ) {
      updatedTargetIds.push(
        "cyclePreviewSummary"
      );
    }

    if (
      summaryResults.registrationSummaryUpdated
    ) {
      updatedTargetIds.push(
        "cycleRegistrationSummary"
      );
    }

    if (
      summaryResults.preflightSummaryUpdated
    ) {
      updatedTargetIds.push(
        "cyclePreflightSummary"
      );
    }

    if (
      summaryResults.executionSummaryUpdated
    ) {
      updatedTargetIds.push(
        "cycleExecutionSummary"
      );
    }

    var rowResults = [];

    CANONICAL_CYCLE_STATIONS.forEach(function renderStation(station) {
      rowResults.push(
        renderCycleRow(
          station.position,
          renderingState.rows[
            station.position
          ]
        )
      );
    });

    var foundStationRowCount =
      rowResults.filter(function rowFound(result) {
        return result.found;
      }).length;

    var updatedStationRowCount =
      rowResults.filter(function rowUpdated(result) {
        return result.updated;
      }).length;

    var missingStationPositions =
      rowResults
        .filter(function missingRow(result) {
          return !result.found;
        })
        .map(function mapMissingPosition(result) {
          return result.position;
        });

    var cycleMapUpdated =
      Boolean(
        byId("cycleMap")
      ) &&
      updatedStationRowCount > 0;

    if (cycleMapUpdated) {
      updatedTargetIds.push(
        "cycleMap"
      );
    }

    var ledgerUpdated =
      renderCycleLedger(
        renderingState
      );

    if (ledgerUpdated) {
      updatedTargetIds.push(
        "cycleLedgerOutput"
      );
    }

    var receiptListUpdated =
      renderCycleReceiptList(
        renderingState
      );

    if (receiptListUpdated) {
      updatedTargetIds.push(
        "cycleReceiptList"
      );
    }

    var uniqueUpdatedTargetIds = [];

    updatedTargetIds.forEach(function dedupeUpdatedTarget(id) {
      if (
        uniqueUpdatedTargetIds.indexOf(id) === -1
      ) {
        uniqueUpdatedTargetIds.push(id);
      }
    });

    var allRequiredTargetsObserved =
      foundTargetIds.length ===
      CYCLE_TARGET_IDS.length;

    var allRequiredTargetsLocallyUpdated =
      uniqueUpdatedTargetIds.length ===
      CYCLE_TARGET_IDS.length;

    var allStationRowsObserved =
      foundStationRowCount ===
      CANONICAL_CYCLE_STATIONS.length;

    var allStationRowsLocallyUpdated =
      updatedStationRowCount ===
      CANONICAL_CYCLE_STATIONS.length;

    var localDomUpdateComplete =
      Boolean(
        allRequiredTargetsObserved &&
        allRequiredTargetsLocallyUpdated &&
        allStationRowsObserved &&
        allStationRowsLocallyUpdated
      );

    return {
      schema:
        "AUDRALIA_DROP_WITH_READ_CYCLE_LOCAL_DOM_EVIDENCE_v5",

      evidenceScope:
        "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",

      certificationOwner:
        "INDEX_CONTROL_BRIDGE",

      targetLifecycle:
        frozenClone(
          state.target
        ),

      requiredTargetCount:
        CYCLE_TARGET_IDS.length,

      foundTargetCount:
        foundTargetIds.length,

      updatedTargetCount:
        uniqueUpdatedTargetIds.length,

      foundTargetIds:
        foundTargetIds,

      updatedTargetIds:
        uniqueUpdatedTargetIds,

      missingTargetIds:
        missingTargetIds,

      requiredStationRowCount:
        CANONICAL_CYCLE_STATIONS.length,

      foundStationRowCount:
        foundStationRowCount,

      updatedStationRowCount:
        updatedStationRowCount,

      missingStationPositions:
        missingStationPositions,

      cycleStatusUpdated:
        cycleStatusUpdated,

      chamberStatusUpdated:
        chamberStatusUpdated,

      previewSummaryUpdated:
        summaryResults.previewSummaryUpdated,

      registrationSummaryUpdated:
        summaryResults.registrationSummaryUpdated,

      preflightSummaryUpdated:
        summaryResults.preflightSummaryUpdated,

      executionSummaryUpdated:
        summaryResults.executionSummaryUpdated,

      cycleMapUpdated:
        cycleMapUpdated,

      ledgerUpdated:
        ledgerUpdated,

      receiptListUpdated:
        receiptListUpdated,

      allRequiredTargetsObserved:
        allRequiredTargetsObserved,

      allRequiredTargetsLocallyUpdated:
        allRequiredTargetsLocallyUpdated,

      allStationRowsObserved:
        allStationRowsObserved,

      allStationRowsLocallyUpdated:
        allStationRowsLocallyUpdated,

      localDomUpdateComplete:
        localDomUpdateComplete,

      domSynchronizationComplete:
        localDomUpdateComplete,

      familySynchronizationCertified:
        false,

      observedAt:
        nowIso()
    };
  }

  function createCycleRenderingReceipt(
    renderingState,
    localDomEvidence
  ) {
    return deepFreeze({
      schema:
        CYCLE_RENDERING_RECEIPT_SCHEMA,

      receiptId:
        "AUDRALIA_CYCLE_RENDERING_RECEIPT_" +
        Date.now(),

      controlsContract:
        CONTRACT,

      evidenceScope:
        "CONTROLS_LOCAL_PRESENTATION_ONLY",

      certificationOwner:
        "INDEX_CONTROL_BRIDGE",

      engineCycleReceiptSchema:
        state.cycle.rawReceipt
          ? state.cycle.rawReceipt.schema || null
          : null,

      engineCycleStatus:
        renderingState.engineCycleStatus,

      engineCycleTerminalClass:
        renderingState.engineCycleTerminalClass,

      engineExactNineValidated:
        renderingState.engineExactNineValidated,

      targetLifecycle:
        frozenClone(
          state.target
        ),

      returnedReceiptMappingComplete:
        renderingState.returnedReceiptMappingComplete,

      logicalMappingComplete:
        renderingState.logicalMappingComplete,

      logicalMappingScope:
        renderingState.logicalMappingScope,

      localDomUpdateComplete:
        Boolean(
          localDomEvidence &&
          localDomEvidence.localDomUpdateComplete
        ),

      domSynchronizationComplete:
        Boolean(
          localDomEvidence &&
          localDomEvidence.localDomUpdateComplete
        ),

      cycleChamberSynchronized:
        null,

      cycleChamberSynchronizationOwner:
        "INDEX_CONTROL_BRIDGE",

      familySynchronizationCertified:
        false,

      mappedReceiptCount:
        renderingState.mappedReceiptCount,

      unmappedReceiptCount:
        renderingState.unmappedReceiptCount,

      duplicateCoordinateCount:
        renderingState.duplicateCoordinateCount,

      coordinateConflictCount:
        renderingState.coordinateConflictCount,

      unresolvedDeclarationCount:
        renderingState.unresolvedDeclarationCount,

      renderedPositions:
        renderingState.renderedPositions.slice(),

      notReachedPositions:
        renderingState.notReachedPositions.slice(),

      missingCycleTargets:
        localDomEvidence
          ? localDomEvidence.missingTargetIds.slice()
          : CYCLE_TARGET_IDS.slice(),

      missingStationPositions:
        localDomEvidence
          ? localDomEvidence.missingStationPositions.slice()
          : CANONICAL_CYCLE_STATIONS.map(function mapPosition(station) {
              return station.position;
            }),

      cycleButtonLockReleased:
        state.cycle.running === false &&
        state.target.navigationPending === false,

      renderedAt:
        nowIso(),

      requirements:
        CONTROL_REQUIREMENTS,

      noClaims:
        NO_CLAIMS
    });
  }

  function renderCommittedCycleChamber() {
    var receipt =
      state.cycle.rawReceipt ||
      {
        schema:
          ENGINE_CYCLE_RECEIPT_SCHEMA,
        status:
          "NOT_RUN",
        stationReceipts: []
      };

    var renderingState =
      buildCycleRenderingState(
        receipt
      );

    var localDomEvidence =
      observeAndUpdateCycleDom(
        renderingState
      );

    state.cycle.rendering =
      deepFreeze(
        clone(renderingState)
      );

    state.cycle.localDomEvidence =
      deepFreeze(
        clone(localDomEvidence)
      );

    state.cycle.renderingReceipt =
      createCycleRenderingReceipt(
        renderingState,
        localDomEvidence
      );

    state.cycle.renderedAt =
      state.cycle.renderingReceipt.renderedAt;

    refreshReceiptInventory();
    publishReceipt();

    return frozenClone({
      rendering:
        state.cycle.rendering,
      localDomEvidence:
        state.cycle.localDomEvidence,
      renderingReceipt:
        state.cycle.renderingReceipt
    });
  }

  function renderCycleChamber() {
    return renderCommittedCycleChamber();
  }

  function refreshCycleChamber() {
    return renderCommittedCycleChamber();
  }

  function validateCycleReceipt(value) {
    if (!isObject(value)) {
      return false;
    }

    var schema =
      value.schema ||
      value.receiptSchema ||
      null;

    var status =
      normalizeToken(
        value.status ||
        value.state ||
        value.result ||
        ""
      );

    if (schema) {
      return (
        schema ===
        ENGINE_CYCLE_RECEIPT_SCHEMA
      );
    }

    var cycleSpecificEvidence =
      Boolean(
        Array.isArray(
          value.stationReceipts
        ) ||
        Array.isArray(
          value.cycleReceipts
        ) ||
        value.cycleReceiptId ||
        value.exactNineValidated !== undefined ||
        value.exactNine !== undefined ||
        value.terminalClass
      );

    return Boolean(
      VALID_CYCLE_TERMINAL_STATUSES.indexOf(
        status
      ) !== -1 &&
      cycleSpecificEvidence
    );
  }

  function createCycleHeldReceipt(context) {
    return {
      schema:
        ENGINE_CYCLE_RECEIPT_SCHEMA,

      receiptId:
        "AUDRALIA_CONTROL_CYCLE_HELD_" +
        Date.now(),

      status:
        "HELD",

      terminalClass:
        "CONTROL_INTERFACE_HELD",

      reason:
        context && context.reason
          ? context.reason
          : "ENGINE_CYCLE_UNAVAILABLE",

      requestedAt:
        nowIso(),

      targetLifecycle:
        frozenClone(
          state.target
        ),

      stationReceipts: [],

      source:
        "CONTROL_PANEL",

      noClaims:
        NO_CLAIMS
    };
  }

  function commitCycleReceipt(receipt) {
    state.cycle.executed =
      true;

    state.cycle.rawReceipt =
      deepFreeze(
        clone(receipt)
      );

    return renderCommittedCycleChamber();
  }

  function holdActiveCycleRequest(reason) {
    var held =
      createCycleHeldReceipt({
        reason:
          reason
      });

    state.target.pendingNineCycle =
      false;

    state.target.pendingNineCycleRequestedAt =
      null;

    state.cycle.requested =
      false;

    state.cycle.running =
      false;

    commitCycleReceipt(
      held
    );

    setCycleRunning(false);

    settleActiveCycleRequest(
      held
    );

    refreshReceiptInventory();
    publishReceipt();

    return frozenClone(
      held
    );
  }

  function finalizeCycleExecution() {
    state.cycle.requested =
      false;

    state.target.pendingNineCycle =
      false;

    state.target.pendingNineCycleRequestedAt =
      null;

    setCycleRunning(false);

    if (
      state.cycle.rendering &&
      state.cycle.localDomEvidence
    ) {
      state.cycle.renderingReceipt =
        createCycleRenderingReceipt(
          state.cycle.rendering,
          state.cycle.localDomEvidence
        );
    }

    refreshReceiptInventory();
    publishReceipt();
  }

  function executeNineCycle() {
    if (state.cycle.running) {
      return (
        getActiveCyclePromise() ||
        Promise.resolve(
          frozenClone(
            state.cycle.rawReceipt
          )
        )
      );
    }

    if (!hasActiveCycleRequest()) {
      createActiveCycleRequest();
    }

    state.target.pendingNineCycle =
      false;

    state.target.pendingNineCycleRequestedAt =
      null;

    state.cycle.requested =
      true;

    setCycleRunning(true);

    setText(
      "controllerState",
      "NINE-CYCLE"
    );

    setStatus(
      "controllerState",
      "RUNNING"
    );

    setText(
      "cycleStatus",
      "Cycle · Running"
    );

    setStatus(
      "cycleStatus",
      "RUNNING"
    );

    recordAction(
      "executeNineCycle.begin",
      {
        category:
          state.ui.selectedCategory,
        audit:
          state.ui.selectedAudit,
        participant:
          state.ui.selectedParticipant,
        targetLifecycle:
          state.target.lifecycleClass,
        targetRouteMatched:
          state.target.routeMatched,
        targetVisible:
          state.ui.targetVisible,
        observationLens:
          state.ui.observationLens
      }
    );

    var execution =
      invokeEngine(
        "runNineCycle",
        [
          {
            source:
              "CONTROL_PANEL",
            requestedAt:
              nowIso(),
            category:
              state.ui.selectedCategory,
            audit:
              state.ui.selectedAudit,
            participant:
              state.ui.selectedParticipant,
            targetLifecycle:
              frozenClone(
                state.target
              )
          }
        ],
        {
          validate:
            validateCycleReceipt,

          fallback:
            createCycleHeldReceipt
        }
      )
        .then(function cycleComplete(receipt) {
          var committed =
            validateCycleReceipt(receipt)
              ? receipt
              : createCycleHeldReceipt({
                  reason:
                    "ENGINE_CYCLE_RESULT_INVALID"
                });

          try {
            commitCycleReceipt(
              committed
            );
          } catch (error) {
            recordError(
              "commitCycleReceipt",
              error
            );

            committed =
              createCycleHeldReceipt({
                reason:
                  "CONTROL_CYCLE_RENDERING_FAILURE"
              });

            state.cycle.executed =
              true;

            state.cycle.rawReceipt =
              deepFreeze(
                clone(committed)
              );
          }

          setText(
            "controllerState",
            normalizeToken(
              committed.status
            ) === "COMMITTED"
              ? "CYCLE COMMITTED"
              : "CYCLE COMPLETE"
          );

          setStatus(
            "controllerState",
            committed.status || "AVAILABLE"
          );

          setText(
            "cycleStatus",
            "Cycle · " +
              String(
                committed.status || "Available"
              )
          );

          setStatus(
            "cycleStatus",
            committed.status || "AVAILABLE"
          );

          recordAction(
            "executeNineCycle.complete",
            {
              status:
                committed.status || null,
              receiptCount:
                committed.receiptCount ||
                extractCycleStationReceipts(
                  committed
                ).length,
              returnedReceiptMappingComplete:
                state.cycle.rendering
                  ? state.cycle.rendering.returnedReceiptMappingComplete
                  : false,
              localDomUpdateComplete:
                state.cycle.localDomEvidence
                  ? state.cycle.localDomEvidence.localDomUpdateComplete
                  : false
            }
          );

          toast(
            "Nine-Cycle receipt committed.",
            committed.status || "AVAILABLE"
          );

          settleActiveCycleRequest(
            committed
          );

          return frozenClone(
            committed
          );
        })
        .catch(function cycleUnhandled(error) {
          var held =
            createCycleHeldReceipt({
              reason:
                "CONTROL_CYCLE_UNHANDLED_REJECTION"
            });

          state.cycle.executed =
            true;

          state.cycle.rawReceipt =
            deepFreeze(
              clone(held)
            );

          try {
            renderCommittedCycleChamber();
          } catch (renderError) {
            recordError(
              "renderCommittedCycleChamber",
              renderError
            );
          }

          recordError(
            "executeNineCycle",
            error
          );

          settleActiveCycleRequest(
            held
          );

          return frozenClone(
            held
          );
        });

    withFinalization(
      execution,
      finalizeCycleExecution,
      {
        action:
          "executeNineCycle"
      }
    );

    return getActiveCyclePromise() || execution;
  }

  function applyTargetVisibilityState(visible, reason) {
    var normalizedVisible =
      Boolean(visible);

    var changed =
      state.ui.targetVisible !==
      normalizedVisible;

    state.ui.targetVisible =
      normalizedVisible;

    state.target.lastVisibilityReason =
      reason || "TARGET_VISIBILITY_STATE";

    state.target.lastVisibilityChangedAt =
      nowIso();

    var button =
      byId(
        "toggleObservationTarget"
      );

    if (button) {
      button.setAttribute(
        "aria-expanded",
        normalizedVisible
          ? "true"
          : "false"
      );

      button.textContent =
        normalizedVisible
          ? "Hide Target"
          : "Show Target";
    }

    selectObservationLensLocal(
      normalizedVisible
        ? "window"
        : "target"
    );

    if (changed) {
      recordAction(
        "targetVisibility.apply",
        {
          visible:
            normalizedVisible,
          reason:
            reason || null,
          observationLens:
            state.ui.observationLens
        }
      );
    } else {
      publishReceipt();
    }

    return {
      visible:
        normalizedVisible,
      changed:
        changed,
      observationLens:
        state.ui.observationLens
    };
  }

  function runNineCycle() {
    if (hasActiveCycleRequest()) {
      toast(
        "Nine-Cycle execution is already active.",
        "HELD"
      );

      return getActiveCyclePromise();
    }

    var publicCyclePromise =
      createActiveCycleRequest();

    state.cycle.requested =
      true;

    if (!state.ui.targetVisible) {
      applyTargetVisibilityState(
        true,
        "NINE_CYCLE_TARGET_PREPARATION"
      );
    } else if (
      state.ui.observationLens !==
      "window"
    ) {
      applyTargetVisibilityState(
        true,
        "NINE_CYCLE_TARGET_WINDOW_SELECTION"
      );
    }

    var readiness =
      ensureTargetReady({
        reason:
          "NINE_CYCLE_REQUEST"
      });

    recordAction(
      "runNineCycle.request",
      {
        readiness:
          readiness.ready,
        pending:
          readiness.pending,
        startedNavigation:
          readiness.startedNavigation,
        lifecycleClass:
          state.target.lifecycleClass,
        targetVisible:
          state.ui.targetVisible,
        observationLens:
          state.ui.observationLens
      }
    );

    if (readiness.ready) {
      executeNineCycle();

      return publicCyclePromise;
    }

    if (readiness.pending) {
      state.target.pendingNineCycle =
        true;

      state.target.pendingNineCycleRequestedAt =
        nowIso();

      setText(
        "controllerState",
        "TARGET LOADING"
      );

      setStatus(
        "controllerState",
        "HELD"
      );

      setText(
        "cycleStatus",
        "Cycle · Target Loading"
      );

      setStatus(
        "cycleStatus",
        "HELD"
      );

      setCycleRunning(false);

      renderCommittedCycleChamber();

      createTargetPreparationReceipt(
        "NINE_CYCLE_DEFERRED_TARGET_LOADING"
      );

      toast(
        "Target loading. Nine-Cycle will continue after route confirmation.",
        "HELD"
      );

      return publicCyclePromise;
    }

    holdActiveCycleRequest(
      "TARGET_PREPARATION_UNAVAILABLE"
    );

    setText(
      "controllerState",
      "TARGET HELD"
    );

    setStatus(
      "controllerState",
      "HELD"
    );

    toast(
      "Target preparation is held.",
      "HELD"
    );

    return publicCyclePromise;
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
    var presentation =
      applyTargetVisibilityState(
        visible,
        visible
          ? "SHOW_TARGET"
          : "HIDE_TARGET"
      );

    if (presentation.visible) {
      var readiness =
        ensureTargetReady({
          reason:
            "SHOW_TARGET"
        });

      if (readiness.ready) {
        toast(
          "Target route available.",
          "READY"
        );
      } else if (readiness.pending) {
        toast(
          "Target frame loading.",
          "RUNNING"
        );
      } else {
        toast(
          "Target frame unavailable.",
          "HELD"
        );
      }
    }

    publishReceipt();
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
    if (!state.ui.targetVisible) {
      applyTargetVisibilityState(
        true,
        "EXPLICIT_TARGET_RELOAD"
      );
    }

    var started =
      beginTargetNavigation(
        "EXPLICIT_TARGET_RELOAD",
        true
      );

    if (!started) {
      if (hasActiveCycleRequest()) {
        holdActiveCycleRequest(
          "TARGET_RELOAD_UNAVAILABLE"
        );
      }

      return;
    }

    recordAction(
      "reloadTargetFrame"
    );

    setCycleRunning(false);

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

  function resetCurrentReportLocal(options) {
    var settings =
      options || {};

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

    if (settings.record !== false) {
      recordAction(
        "resetCurrentReport"
      );
    }

    if (settings.notify !== false) {
      toast(
        "Current report reset.",
        "READY"
      );
    }
  }

  function resetCurrentReport() {
    resetCurrentReportLocal({
      record: true,
      notify: true
    });
  }

  function resetTargetLifecycle() {
    state.target.lifecycleClass =
      "TARGET_UNBOUND";

    state.target.framePresent =
      Boolean(
        byId(TARGET_FRAME_ID)
      );

    state.target.declaredSrc =
      state.target.framePresent
        ? byId(TARGET_FRAME_ID).getAttribute("src")
        : null;

    state.target.observedRoute =
      null;

    state.target.observedRouteNormalized =
      null;

    state.target.routeObserved =
      false;

    state.target.routeMatched =
      false;

    state.target.sameOriginAccessible =
      null;

    state.target.documentLoaded =
      false;

    state.target.documentReadyState =
      null;

    state.target.navigationPending =
      false;

    state.target.loadObserved =
      false;

    state.target.pendingNineCycle =
      false;

    state.target.pendingNineCycleRequestedAt =
      null;

    state.target.lastVisibilityReason =
      null;

    state.target.lastVisibilityChangedAt =
      null;

    state.target.lastNavigationReason =
      null;

    state.target.lastNavigationStartedAt =
      null;

    state.target.lastLoadObservedAt =
      null;

    state.target.lastInspectedAt =
      null;

    state.target.lastTargetError =
      null;

    state.target.preparationReceipt =
      null;
  }

  function resetCyclePresentation() {
    if (hasActiveCycleRequest()) {
      var resetHeld =
        createCycleHeldReceipt({
          reason:
            "CONTROL_CYCLE_RESET_BEFORE_EXECUTION"
        });

      settleActiveCycleRequest(
        resetHeld
      );
    } else {
      clearActiveCycleRequest();
    }

    state.cycle.running =
      false;

    state.cycle.requested =
      false;

    state.cycle.executed =
      false;

    state.cycle.rawReceipt =
      null;

    state.cycle.rendering =
      null;

    state.cycle.renderingReceipt =
      null;

    state.cycle.localDomEvidence =
      null;

    state.cycle.renderedAt =
      null;

    state.target.pendingNineCycle =
      false;

    state.target.pendingNineCycleRequestedAt =
      null;

    setCycleRunning(false);

    renderCommittedCycleChamber();
  }

  function resetWorkbench() {
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

    resetCurrentReportLocal({
      record: false,
      notify: false
    });

    resetTargetLifecycle();
    resetCyclePresentation();

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

    applyTargetVisibilityState(
      false,
      "RESET_WORKBENCH"
    );

    setTargetExpanded(false);

    state.ui.receiptFilter =
      "all";

    state.ui.selectedReceiptIndex =
      null;

    refreshReceiptInventory();

    recordAction(
      "resetWorkbench"
    );

    toast(
      "Diagnostic workbench reset.",
      "READY"
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
          "control",
          "target"
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

    addExplicitReceipt(
      output,
      state.target.preparationReceipt,
      "CONTROL_TARGET_PREPARATION",
      "state.target.preparationReceipt"
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
      state.cycle.rawReceipt,
      "CONTROL_CYCLE_ENGINE_RECEIPT",
      "state.cycle.rawReceipt"
    );

    addExplicitReceipt(
      output,
      state.cycle.renderingReceipt,
      "CONTROL_CYCLE_RENDERING_RECEIPT",
      "state.cycle.renderingReceipt"
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
      state.target.preparationReceipt,
      "CONTROL_TARGET_PREPARATION",
      "state.target.preparationReceipt",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      state.cycle.rawReceipt,
      "CONTROL_CYCLE_ENGINE_RECEIPT",
      "state.cycle.rawReceipt",
      output,
      [],
      0
    );

    walkReceiptCandidates(
      state.cycle.renderingReceipt,
      "CONTROL_CYCLE_RENDERING_RECEIPT",
      "state.cycle.renderingReceipt",
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
    state.target.loadObserved =
      true;

    state.target.loadCount += 1;

    state.target.lastLoadObservedAt =
      nowIso();

    state.target.navigationPending =
      false;

    var inspected =
      inspectTargetFrame({
        reason:
          "TARGET_FRAME_LOAD"
      });

    recordAction(
      "targetFrameLoad",
      {
        loadCount:
          state.target.loadCount,
        lifecycleClass:
          inspected.lifecycleClass,
        observedRoute:
          inspected.observedRoute,
        routeMatched:
          inspected.routeMatched,
        pendingNineCycle:
          state.target.pendingNineCycle,
        targetVisible:
          state.ui.targetVisible,
        observationLens:
          state.ui.observationLens
      }
    );

    setCycleRunning(false);

    if (
      state.target.pendingNineCycle &&
      inspected.lifecycleClass ===
        "TARGET_READY"
    ) {
      state.target.deferredCycleReleaseCount += 1;

      recordAction(
        "targetFrameLoad.releaseDeferredNineCycle",
        {
          releaseCount:
            state.target.deferredCycleReleaseCount
        }
      );

      executeNineCycle();
      return;
    }

    if (
      state.target.pendingNineCycle &&
      inspected.lifecycleClass !==
        "TARGET_READY"
    ) {
      holdActiveCycleRequest(
        "TARGET_LOAD_DID_NOT_CONFIRM_EXPECTED_ROUTE"
      );

      setText(
        "controllerState",
        "TARGET HELD"
      );

      setStatus(
        "controllerState",
        "HELD"
      );

      toast(
        "Target route was not confirmed.",
        "HELD"
      );

      return;
    }

    if (
      inspected.lifecycleClass ===
      "TARGET_READY"
    ) {
      toast(
        "Target route available.",
        "READY"
      );
    } else {
      toast(
        "Target load observed without route readiness.",
        "HELD"
      );
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

    state.controls.delegatedEventsActive =
      true;
  }

  function publishReceipt() {
    var rendering =
      state.cycle.rendering;

    var localDomEvidence =
      state.cycle.localDomEvidence;

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

        targetLifecycle:
          frozenClone(
            state.target
          ),

        targetPreparationReceipt:
          frozenClone(
            state.target.preparationReceipt
          ),

        targetVisible:
          state.ui.targetVisible,

        observationLens:
          state.ui.observationLens,

        activeCycleRequestPresent:
          hasActiveCycleRequest(),

        activeCycleRequestCreatedAt:
          activeCycleRequest.createdAt,

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
            state.cycle.rawReceipt
          ),

        engineCycleReceiptPresent:
          Boolean(
            state.cycle.rawReceipt
          ),

        cycleRunning:
          state.cycle.running,

        cycleRequested:
          state.cycle.requested,

        cycleExecuted:
          state.cycle.executed,

        engineCycleStatus:
          rendering
            ? rendering.engineCycleStatus
            : null,

        engineCycleTerminalClass:
          rendering
            ? rendering.engineCycleTerminalClass
            : null,

        engineExactNineValidated:
          rendering
            ? rendering.engineExactNineValidated
            : null,

        returnedReceiptMappingComplete:
          rendering
            ? rendering.returnedReceiptMappingComplete
            : false,

        logicalMappingComplete:
          rendering
            ? rendering.logicalMappingComplete
            : false,

        logicalMappingScope:
          rendering
            ? rendering.logicalMappingScope
            : "RETURNED_RECEIPTS_ONLY",

        localDomUpdateComplete:
          localDomEvidence
            ? localDomEvidence.localDomUpdateComplete
            : false,

        domSynchronizationComplete:
          localDomEvidence
            ? localDomEvidence.localDomUpdateComplete
            : false,

        domSynchronizationScope:
          "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",

        cycleChamberSynchronized:
          null,

        cycleChamberSynchronizationOwner:
          "INDEX_CONTROL_BRIDGE",

        familySynchronizationCertified:
          false,

        mappedReceiptCount:
          rendering
            ? rendering.mappedReceiptCount
            : 0,

        unmappedReceiptCount:
          rendering
            ? rendering.unmappedReceiptCount
            : 0,

        duplicateCoordinateCount:
          rendering
            ? rendering.duplicateCoordinateCount
            : 0,

        coordinateConflictCount:
          rendering
            ? rendering.coordinateConflictCount
            : 0,

        unresolvedDeclarationCount:
          rendering
            ? rendering.unresolvedDeclarationCount
            : 0,

        renderedPositions:
          rendering
            ? rendering.renderedPositions.slice()
            : [],

        notReachedPositions:
          rendering
            ? rendering.notReachedPositions.slice()
            : [],

        missingCycleTargets:
          localDomEvidence
            ? localDomEvidence.missingTargetIds.slice()
            : CYCLE_TARGET_IDS.slice(),

        missingStationPositions:
          localDomEvidence
            ? localDomEvidence.missingStationPositions.slice()
            : CANONICAL_CYCLE_STATIONS.map(function mapPosition(station) {
                return station.position;
              }),

        cycleButtonLockReleased:
          state.cycle.running === false &&
          state.target.navigationPending === false,

        cycleRenderedAt:
          state.cycle.renderedAt,

        cycleRenderingReceipt:
          frozenClone(
            state.cycle.renderingReceipt
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
          "EXPOSE_TARGET",
          "PREPARE_TARGET",
          "VERIFY_TARGET",
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

        presentationStationMap:
          CANONICAL_CYCLE_STATIONS,

        requirements:
          CONTROL_REQUIREMENTS,

        relationalCertificationOwner:
          "INDEX_CONTROL_BRIDGE",

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

      target:
        state.target,

      report:
        state.report,

      directReceipts:
        state.directReceipts,

      cycleReceipt:
        state.cycle.rawReceipt,

      cycle:
        state.cycle,

      activeCycleRequest: {
        present:
          hasActiveCycleRequest(),
        createdAt:
          activeCycleRequest.createdAt
      },

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
        state.lastError,

      requirements:
        CONTROL_REQUIREMENTS
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

        inspectTargetFrame:
          inspectTargetFrame,

        ensureTargetReady:
          ensureTargetReady,

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

        renderCycleChamber:
          renderCycleChamber,

        refreshCycleChamber:
          refreshCycleChamber,

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

        getCurrentCycleReceipt:
          function getCurrentCycleReceipt() {
            return frozenClone(
              state.cycle.rawReceipt
            );
          },

        getCycleRenderingState:
          function getCycleRenderingState() {
            return frozenClone(
              state.cycle.rendering
            );
          },

        getTargetLifecycleState:
          function getTargetLifecycleState() {
            return frozenClone(
              state.target
            );
          },

        getNormalizedReceipts:
          function getNormalizedReceipts() {
            return frozenClone(
              state.normalizedReceipts
            );
          },

        getRequirements:
          function getRequirements() {
            return frozenClone(
              CONTROL_REQUIREMENTS
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

    root.AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS =
      CONTROL_REQUIREMENTS;

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

    state.ui.targetVisible =
      false;

    state.ui.targetExpanded =
      false;

    var targetButton =
      byId("toggleObservationTarget");

    if (targetButton) {
      targetButton.setAttribute(
        "aria-expanded",
        "false"
      );

      targetButton.textContent =
        "Show Target";
    }

    setTargetExpanded(false);

    state.ui.receiptFilter =
      "all";

    inspectTargetFrame({
      reason:
        "INITIAL_TARGET_INSPECTION"
    });

    renderCommittedCycleChamber();
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
          state.normalizedReceipts.length,
        targetLifecycle:
          state.target.lifecycleClass,
        targetFramePresent:
          state.target.framePresent,
        targetRouteMatched:
          state.target.routeMatched,
        targetVisible:
          state.ui.targetVisible,
        observationLens:
          state.ui.observationLens,
        localCycleTargetsMissing:
          state.cycle.localDomEvidence
            ? state.cycle.localDomEvidence.missingTargetIds
            : CYCLE_TARGET_IDS.slice(),
        localCycleStationRowsMissing:
          state.cycle.localDomEvidence
            ? state.cycle.localDomEvidence.missingStationPositions
            : CANONICAL_CYCLE_STATIONS.map(function mapPosition(station) {
                return station.position;
              }),
        relationalCertificationOwner:
          "INDEX_CONTROL_BRIDGE"
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
