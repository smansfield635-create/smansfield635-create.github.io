// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_TNT_v1
// Full-file replacement.
// South route conductor / self-duty handoff authority only.
// Purpose:
// - Restore the route conductor’s self-duty after marker-only recognition.
// - Publish marker, API, and receipt early enough for East to read all three.
// - Prevent marker-only recognition from satisfying F8 hydration.
// - Seat the handoff in NEWS order with Fibonacci synchronization.
// - Keep Canvas as F13 evidence only.
// - Keep F21 completion under North / NEWS latch authority.
// Does not own:
// - East first paint
// - East script loading
// - North checkpoint truth
// - West gap taxonomy
// - Lab South visible-state composition
// - canvas drawing
// - canvas child files
// - source truth
// - terrain truth
// - hydrology truth
// - materials truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-31.hearth-south-route-conductor-self-duty-news-fibonacci-handoff-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_BRANCH_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_BRANCH_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_BRANCH_FILE = "/assets/lab/runtime-table.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const CANVAS_WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const CANVAS_SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const MAX_LOG = 120;
  const WATCHDOG_MS = 500;
  const WATCHDOG_LIMIT = 120;

  const GATES = Object.freeze([
    { id: "F1_EAST_ROUTE_SHELL", fib: "F1", cardinal: "EAST", label: "Route shell" },
    { id: "F2_EAST_FIRST_PAINT", fib: "F2", cardinal: "EAST", label: "First paint" },
    { id: "F3_EAST_SCRIPT_ORDER", fib: "F3", cardinal: "EAST", label: "Script order" },
    { id: "F5_NORTH_AUTHORITY", fib: "F5", cardinal: "NORTH", label: "North authority" },
    { id: "F8_SOUTH_SELF_DUTY", fib: "F8", cardinal: "SOUTH", label: "South self-duty hydration" },
    { id: "F13A_CANVAS_PARENT", fib: "F13A", cardinal: "NORTH", label: "Canvas parent" },
    { id: "F13B_CANVAS_CHILDREN", fib: "F13B", cardinal: "EAST", label: "Canvas children" },
    { id: "F13C_CANVAS_TEXTURE", fib: "F13C", cardinal: "SOUTH", label: "Texture evidence" },
    { id: "F13D_CANVAS_FRAME", fib: "F13D", cardinal: "SOUTH", label: "Visible frame" },
    { id: "F13E_VISIBLE_PROOF", fib: "F13E", cardinal: "SOUTH", label: "Visible planet proof" },
    { id: "F13N_INSPECT_GATE", fib: "F13N", cardinal: "WEST", label: "Inspect gate" },
    { id: "F21_COMPLETION_LATCH", fib: "F21", cardinal: "NORTH", label: "NEWS completion latch" }
  ]);

  const CANVAS_PARENT_GLOBALS = Object.freeze([
    "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
    "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
    "HEARTH_CANVAS_TRANSISTOR_GATE",
    "HEARTH_CANVAS_SPLIT_ADAPTER",
    "HEARTH_CANVAS_NORTH",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS",
    "HEARTH.canvasNorth",
    "HEARTH.canvasSplitAdapter",
    "HEARTH.canvasTransistorGate",
    "HEARTH.canvasEvidence",
    "HEARTH.canvas",
    "DEXTER_LAB.hearthCanvasPhysicalCarrierF13ProofParent",
    "DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation",
    "DEXTER_LAB.hearthCanvasTransistorGate",
    "DEXTER_LAB.hearthCanvasSplitAdapter",
    "DEXTER_LAB.hearthCanvasNorth",
    "DEXTER_LAB.hearthCanvasEvidence"
  ]);

  const CANVAS_CHILD_GLOBALS = Object.freeze({
    east: [
      "HEARTH_CANVAS_EAST",
      "HEARTH.canvasEast",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
    ],
    west: [
      "HEARTH_CANVAS_WEST",
      "HEARTH.canvasWest",
      "DEXTER_LAB.hearthCanvasWest"
    ],
    south: [
      "HEARTH_CANVAS_SOUTH",
      "HEARTH.canvasSouth",
      "DEXTER_LAB.hearthCanvasSouth"
    ]
  });

  const CHILD_METHODS = Object.freeze({
    east: ["buildAtlas", "sample", "read", "getReceipt"],
    west: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"],
    south: [
      "composeTexture",
      "renderSphere",
      "renderSphereSync",
      "getTextureCanvas",
      "sampleVisibleContent",
      "classifyVisibleContentEvidence",
      "invalidateTexture",
      "getReceipt"
    ]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-self-duty-news-fibonacci-handoff",

    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,
    cycleOrder: "EAST -> NORTH -> EAST_BRANCH -> WEST -> SOUTH -> CANVAS -> ROUTE_CONDUCTOR -> CHECKPOINT -> NORTH",
    oneActiveGearAtATime: true,

    markerIsNotHydrationProof: true,
    apiRequiredForF8: true,
    receiptRequiredForF8: true,
    runtimeRequiredForF8: true,
    visibleProofRequiredForF13: true,
    visibleProofRequiredForF21: true,
    canvasOwnsF13Only: true,

    jobs: {
      north: ["checkpoint-session-read", "F21-latch-admission"],
      east: ["route-conductor-recognition", "handoff-classification"],
      west: ["inspect-gate", "receipt-access", "gap-classification-read"],
      south: ["self-duty-publication", "route-conductor-runtime", "canvas-boot-request", "canvas-receipt-reconciliation", "visible-proof-governance"]
    },

    files: {
      index: INDEX_FILE,
      north: NORTH_FILE,
      eastBranch: EAST_BRANCH_FILE,
      westBranch: WEST_BRANCH_FILE,
      southBranch: SOUTH_BRANCH_FILE,
      canvas: CANVAS_FILE,
      canvasEast: CANVAS_EAST_FILE,
      canvasWest: CANVAS_WEST_FILE,
      canvasSouth: CANVAS_SOUTH_FILE
    },

    routeConductor: {
      markerPresent: false,
      apiPresent: false,
      receiptPresent: false,
      runtimeActive: false,
      hydrated: false,
      recognitionStatus: "MARKER_PENDING"
    },

    authorities: {
      indexPresent: false,
      northPresent: false,
      eastBranchPresent: false,
      westPresent: false,
      southPresent: false,
      sessionPresent: false,
      sessionCreatedBySouth: false
    },

    canvas: {
      parentPresent: false,
      parentBootMethod: "",
      parentBootMethodAvailable: false,
      bootRequested: false,
      bootStarted: false,
      bootResolved: false,
      bootRejected: false,
      bootAttempts: 0,
      bootComplete: false,
      bootError: "",

      contract: "",
      receipt: "",
      splitContract: "",
      splitReceipt: "",

      eastPresent: false,
      westPresent: false,
      southPresent: false,
      eastReady: false,
      westReady: false,
      southReady: false,
      allChildrenReady: false,
      childGap: "",

      carrierRequested: false,
      carrierMounted: false,
      contextReady: false,
      dragInspectionBound: false,
      atlasBuildStarted: false,
      atlasBuildComplete: false,
      textureComposeStarted: false,
      textureComposeComplete: false,
      firstFrameRequested: false,
      firstFrameDetected: false,
      canvasReady: false,
      imageRendered: false,

      visibleContentProofStarted: false,
      visibleContentProof: false,
      visibleContentStrictProof: false,
      visibleContentSoftGap: false,
      visibleContentHardFail: false,
      visibleForwardProgress: false,
      visibleContentAdmissible: false,
      visiblePlanetAvailable: false,
      visiblePlanetProofValid: false,

      latestSignature: ""
    },

    dom: {
      mountPresent: false,
      cockpitPresent: false,
      planetCanvasPresent: false,
      planetCanvasNonZeroSize: false,
      visiblePlanetHintPresent: false
    },

    inspect: {
      copyDiagnosticReady: false,
      receiptToggleReady: false,
      inspectPlanetControlAvailable: false,
      inspectModeAvailable: false,
      diagnosticCanLeavePlanetFrame: false,
      diagnosticDockRestorable: false,
      showTabVisible: false,
      strictReady: false,
      fallbackReady: false
    },

    gates: [],
    completedGates: [],
    degradedGates: [],
    blockedGates: [],
    activeGateId: GATES[0].id,
    activeFibonacci: GATES[0].fib,
    activeCardinal: GATES[0].cardinal,
    activeProgress: 0,

    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    f21LatchMode: "WAITING",
    newsGatePassed: false,
    newsGateDegraded: false,

    refsBound: false,
    booted: false,
    booting: false,
    watchdogTicks: 0,
    renderCount: 0,
    latestEvent: "SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_LOADED",
    postgameStatus: "LOADED",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextRenewalTarget: FILE,
    startedAt: "",
    updatedAt: "",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    mount: null,
    cockpit: null,
    stage: null,
    heartbeat: null,
    latest: null,
    fill: null,
    percent: null,
    lanes: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    toggleButton: null,
    inspectButton: null,
    showTab: null,
    status: null
  };

  let bootPromise = null;
  let canvasBootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimLog(array) {
    if (Array.isArray(array) && array.length > MAX_LOG) {
      array.splice(0, array.length - MAX_LOG);
    }
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function data(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents);

    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors);

    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;

    state.routeConductor.markerPresent = true;
    state.routeConductor.recognitionStatus = "MARKER_PRESENT_API_PENDING";

    updateDataset();
  }

  function publishGlobals(reason = "publish-globals") {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF = api;
    root.HEARTH_SOUTH_SELF_DUTY_NEWS_FIBONACCI_HANDOFF = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.southRouteConductorSelfDutyHandoff = api;
    root.HEARTH.southSelfDutyNewsFibonacciHandoff = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthVisibleCompletion = api;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoff = api;

    state.routeConductor.apiPresent = true;
    state.routeConductor.receiptPresent = true;
    state.routeConductor.runtimeActive = true;
    state.routeConductor.hydrated = true;
    state.routeConductor.recognitionStatus = "API_RECEIPT_RUNTIME_PRESENT";

    const receiptLight = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_RECEIPT = receiptLight;

    root.HEARTH.routeConductorReceipt = receiptLight;
    root.HEARTH.southRouteConductorReceipt = receiptLight;
    root.HEARTH.southVisibleCompletionReceipt = receiptLight;
    root.HEARTH.southRouteConductorSelfDutyHandoffReceipt = receiptLight;

    root.DEXTER_LAB.hearthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthVisibleCompletionReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoffReceipt = receiptLight;

    updateDataset();
    record(reason, {
      routeConductorApiPresent: true,
      routeConductorReceiptPresent: true,
      routeConductorHydrated: true
    });
  }

  function readIndexApi() {
    return firstGlobal([
      "HEARTH_EAST_STEP1_IGNITION",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_INDEX_JS",
      "HEARTH.indexBridge",
      "HEARTH.eastStep1Ignition"
    ]);
  }

  function readNorth() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "DEXTER_LAB.runtimeTable"
    ]);
  }

  function readBranch(direction) {
    const names = {
      east: [
        "LAB_RUNTIME_TABLE_EAST",
        "RUNTIME_TABLE_EAST",
        "DEXTER_LAB_RUNTIME_TABLE_EAST",
        "LAB_CARDINAL_RUNTIME_TABLE_EAST",
        "DEXTER_LAB.runtimeTableEast",
        "DEXTER_LAB.cardinalRuntimeTableEast"
      ],
      west: [
        "LAB_RUNTIME_TABLE_WEST",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB_RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest"
      ],
      south: [
        "LAB_RUNTIME_TABLE_SOUTH",
        "RUNTIME_TABLE_SOUTH",
        "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
        "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
        "HEARTH_VISIBLE_STATE_COMPOSER",
        "DEXTER_LAB.runtimeTableSouth",
        "DEXTER_LAB.visibleStateComposer"
      ]
    };

    return firstGlobal(names[direction] || []);
  }

  function readSession() {
    return firstGlobal([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession"
    ]);
  }

  function ensureSession() {
    const existing = readSession();

    if (existing && (isFunction(existing.submitEvent) || isFunction(existing.submit) || isFunction(existing.completeActive))) {
      state.authorities.sessionPresent = true;
      return existing;
    }

    const north = readNorth();
    const east = readBranch("east");

    const creators = [
      north && north.createHearthCheckpointSession,
      north && north.createCheckpointSession,
      east && east.createHearthCheckpointSession,
      east && east.createCheckpointSession
    ].filter(isFunction);

    for (const creator of creators) {
      try {
        const session = creator({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE
        });

        if (session && (isFunction(session.submitEvent) || isFunction(session.submit) || isFunction(session.completeActive))) {
          root.HEARTH_CHECKPOINT_SESSION = session;
          root.HEARTH_RUNTIME_CHECKPOINT_SESSION = session;
          root.LAB_HEARTH_CHECKPOINT_SESSION = session;
          root.DEXTER_LAB = root.DEXTER_LAB || {};
          root.DEXTER_LAB.hearthCheckpointSession = session;
          root.DEXTER_LAB.checkpointSession = session;

          state.authorities.sessionPresent = true;
          state.authorities.sessionCreatedBySouth = true;

          record("SOUTH_CREATED_CHECKPOINT_SESSION", {
            source: creator.name || "north-or-east"
          });

          return session;
        }
      } catch (error) {
        recordError("CREATE_CHECKPOINT_SESSION_FAILED", error);
      }
    }

    state.authorities.sessionPresent = false;
    return null;
  }

  function submitToNorth(gate) {
    const session = ensureSession();

    if (!session || !gate) return false;

    const payload = {
      event: gate.id,
      phase: gate.id,
      id: gate.id,
      checkpointId: gate.id,
      fibonacci: gate.fib,
      cardinal: gate.cardinal,
      source: "hearth.south.routeConductor.selfDutyNewsFibonacciHandoff",
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        gate: clonePlain(gate),
        markerIsNotHydrationProof: true,
        routeConductorApiPresent: state.routeConductor.apiPresent,
        routeConductorReceiptPresent: state.routeConductor.receiptPresent,
        routeConductorHydrated: state.routeConductor.hydrated,
        canvasOwnsF13Only: true,
        visualProofRequiredForF21: true,
        visualPassClaimed: false
      }
    };

    try {
      if (isFunction(session.submitEvent)) return session.submitEvent(payload);
      if (isFunction(session.submit)) return session.submit(payload);
      if (isFunction(session.completeActive)) return session.completeActive(payload);
    } catch (error) {
      recordError("NORTH_GATE_SUBMIT_FAILED", error, {
        gate: gate.id
      });
    }

    return false;
  }

  function readCanvasApi() {
    return firstGlobal(CANVAS_PARENT_GLOBALS);
  }

  function readCanvasReceipt() {
    const canvas = readCanvasApi();
    const receipt = readReceipt(canvas);

    if (receipt) return receipt;

    const fallback = firstGlobal([
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_EVIDENCE_RECEIPT",
      "HEARTH_CANVAS_POSTGAME_RECEIPT",
      "HEARTH.canvasReceipt",
      "HEARTH.canvasEvidenceReceipt"
    ]);

    return isObject(fallback) ? fallback : {};
  }

  function readCanvasChild(key) {
    return firstGlobal(CANVAS_CHILD_GLOBALS[key] || []);
  }

  function missingMethods(key, authority) {
    const required = CHILD_METHODS[key] || [];
    if (!authority) return required.slice();
    return required.filter((method) => !isFunction(authority[method]));
  }

  function selectCanvasMethod(canvas) {
    if (!canvas || !isObject(canvas)) return "";
    if (isFunction(canvas.bootCooperative)) return "bootCooperative";
    if (isFunction(canvas.boot)) return "boot";
    if (isFunction(canvas.render)) return "render";
    if (isFunction(canvas.mount)) return "mount";
    return "";
  }

  function scanDom() {
    if (!doc) return;

    refs.mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    refs.cockpit =
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

    refs.stage = doc.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = doc.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = doc.querySelector("[data-hearth-latest-event]");
    refs.fill = doc.querySelector("[data-hearth-main-progress-fill]");
    refs.percent = doc.querySelector("[data-hearth-main-progress-percent]");
    refs.lanes = doc.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = doc.querySelector("[data-hearth-receipt-box]");
    refs.receiptText = doc.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = doc.querySelector("[data-hearth-copy-diagnostic]");
    refs.toggleButton = doc.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = doc.querySelector("[data-hearth-inspect-planet]");
    refs.showTab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");
    refs.status = doc.getElementById("hearth-route-status") || doc.querySelector("[data-hearth-route-status]");

    const canvas = refs.mount
      ? refs.mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");

    const rect = canvas && isFunction(canvas.getBoundingClientRect)
      ? canvas.getBoundingClientRect()
      : null;

    const nonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const visibleHint = Boolean(
      data("hearthCanvasReady") === "true" ||
      data("hearthCanvasVisiblePlanetAvailable") === "true" ||
      data("hearthCanvasVisibleContentProof") === "true" ||
      data("hearthCanvasSouthVisibleContentProof") === "true" ||
      data("hearthCanvasSouthImageRendered") === "true" ||
      data("hearthSouthVisiblePlanetAvailable") === "true"
    );

    state.dom.mountPresent = Boolean(refs.mount);
    state.dom.cockpitPresent = Boolean(refs.cockpit);
    state.dom.planetCanvasPresent = Boolean(canvas);
    state.dom.planetCanvasNonZeroSize = nonZero;
    state.dom.visiblePlanetHintPresent = Boolean(canvas && nonZero && visibleHint);

    state.inspect.copyDiagnosticReady = Boolean(refs.copyButton);
    state.inspect.receiptToggleReady = Boolean(refs.toggleButton || refs.receiptText || refs.receiptBox);
    state.inspect.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.inspect.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.inspect.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.inspect.diagnosticDockRestorable = Boolean(refs.cockpit);
    state.inspect.showTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    state.inspect.strictReady = Boolean(
      state.inspect.inspectModeAvailable &&
      state.inspect.diagnosticCanLeavePlanetFrame &&
      state.inspect.copyDiagnosticReady &&
      state.inspect.receiptToggleReady
    );
    state.inspect.fallbackReady = Boolean(
      state.inspect.copyDiagnosticReady ||
      state.inspect.receiptToggleReady ||
      state.inspect.diagnosticDockRestorable
    );

    bindControls();
  }

  function summarizeCanvas(receipt = readCanvasReceipt()) {
    const canvas = readCanvasApi();
    const method = selectCanvasMethod(canvas);

    const east = readCanvasChild("east");
    const west = readCanvasChild("west");
    const south = readCanvasChild("south");

    const eastMissing = missingMethods("east", east);
    const westMissing = missingMethods("west", west);
    const southMissing = missingMethods("south", south);

    const c = state.canvas;

    c.parentPresent = Boolean(canvas);
    c.parentBootMethod = method;
    c.parentBootMethodAvailable = Boolean(method);

    c.contract = safeString(receipt.contract || data("hearthCanvasContract"), "");
    c.receipt = safeString(receipt.receipt || data("hearthCanvasReceipt"), "");
    c.splitContract = safeString(receipt.splitContract || data("hearthCanvasSplitContract"), "");
    c.splitReceipt = safeString(receipt.splitReceipt || data("hearthCanvasSplitReceipt"), "");

    c.eastPresent = safeBool(receipt.canvasEastPresent, Boolean(east));
    c.westPresent = safeBool(receipt.canvasWestPresent, Boolean(west));
    c.southPresent = safeBool(receipt.canvasSouthPresent, Boolean(south));

    c.eastReady = safeBool(receipt.canvasEastReady, Boolean(east && eastMissing.length === 0));
    c.westReady = safeBool(receipt.canvasWestReady, Boolean(west && westMissing.length === 0));
    c.southReady = safeBool(receipt.canvasSouthReady, Boolean(south && southMissing.length === 0));
    c.allChildrenReady = safeBool(receipt.allCanvasChildrenReady, Boolean(c.eastReady && c.westReady && c.southReady));

    c.childGap = [
      eastMissing.length ? `east:${eastMissing.join(",")}` : "",
      westMissing.length ? `west:${westMissing.join(",")}` : "",
      southMissing.length ? `south:${southMissing.join(",")}` : ""
    ].filter(Boolean).join("; ");

    c.carrierRequested = safeBool(receipt.canvasCarrierRequested, c.bootRequested);
    c.carrierMounted = safeBool(receipt.canvasCarrierMounted, safeBool(data("hearthCanvasCarrierMounted"), false));
    c.contextReady = safeBool(receipt.canvasContextReady, safeBool(data("hearthCanvasContextReady"), false));
    c.dragInspectionBound = safeBool(receipt.dragInspectionBound, safeBool(data("hearthCanvasDragInspectionBound"), false));

    c.atlasBuildStarted = safeBool(receipt.atlasBuildStarted, safeBool(data("hearthCanvasAtlasBuildStarted"), false));
    c.atlasBuildComplete = safeBool(receipt.atlasBuildComplete, safeBool(data("hearthCanvasAtlasBuildComplete"), false));
    c.textureComposeStarted = safeBool(receipt.textureComposeStarted, safeBool(data("hearthCanvasTextureComposeStarted"), false));
    c.textureComposeComplete = safeBool(receipt.textureComposeComplete, safeBool(data("hearthCanvasTextureComposeComplete"), false));

    c.firstFrameRequested = safeBool(receipt.firstFrameRequested, safeBool(data("hearthCanvasFirstFrameRequested"), false));
    c.firstFrameDetected = safeBool(receipt.firstFrameDetected, safeBool(data("hearthCanvasFirstFrameDetected"), false));
    c.canvasReady = safeBool(receipt.canvasReady, safeBool(data("hearthCanvasReady"), false));
    c.imageRendered = safeBool(receipt.imageRendered, safeBool(data("hearthCanvasImageRendered"), false));

    c.visibleContentProofStarted = safeBool(receipt.visibleContentProofStarted, safeBool(data("hearthCanvasVisibleContentProofStarted"), false));
    c.visibleContentProof = safeBool(receipt.visibleContentProof, safeBool(data("hearthCanvasVisibleContentProof"), false));
    c.visibleContentStrictProof = safeBool(receipt.visibleContentStrictProof, safeBool(data("hearthCanvasVisibleContentStrictProof"), false));
    c.visibleContentSoftGap = safeBool(receipt.visibleContentSoftGap, safeBool(data("hearthCanvasVisibleContentSoftGap"), false));
    c.visibleContentHardFail = safeBool(receipt.visibleContentHardFail, safeBool(data("hearthCanvasVisibleContentHardFail"), false));
    c.visibleForwardProgress = safeBool(receipt.visibleForwardProgress, safeBool(data("hearthCanvasVisibleForwardProgress"), false));
    c.visibleContentAdmissible = safeBool(receipt.visibleContentAdmissible, false);
    c.visiblePlanetAvailable = safeBool(receipt.visiblePlanetAvailable, safeBool(data("hearthCanvasVisiblePlanetAvailable"), false));

    const visibleCounts = Boolean(
      safeNumber(receipt.visibleContentClassCount, 0) > 0 ||
      safeNumber(receipt.visibleContentLandSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentWaterSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentOtherSampleCount, 0) > 0
    );

    c.visiblePlanetProofValid = Boolean(
      state.dom.planetCanvasPresent &&
      state.dom.planetCanvasNonZeroSize &&
      !c.visibleContentHardFail &&
      (
        c.visibleContentProof ||
        c.visibleContentStrictProof ||
        c.visibleContentSoftGap ||
        c.visibleForwardProgress ||
        c.visibleContentAdmissible ||
        c.visiblePlanetAvailable ||
        visibleCounts ||
        (c.canvasReady && c.firstFrameDetected) ||
        (c.imageRendered && c.firstFrameDetected)
      )
    );

    c.bootComplete = Boolean(c.bootComplete || c.canvasReady || c.visiblePlanetProofValid || c.firstFrameDetected);

    return c;
  }

  function refresh() {
    scanDom();

    state.authorities.indexPresent = Boolean(readIndexApi());
    state.authorities.northPresent = Boolean(readNorth());
    state.authorities.eastBranchPresent = Boolean(readBranch("east"));
    state.authorities.westPresent = Boolean(readBranch("west"));
    state.authorities.southPresent = Boolean(readBranch("south"));
    state.authorities.sessionPresent = Boolean(readSession());

    state.routeConductor.markerPresent = Boolean(root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ || data("hearthRouteConductorMarkerPresent") === "true");
    state.routeConductor.apiPresent = Boolean(firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR",
      "HearthRouteConductor",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH.southRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor"
    ]));
    state.routeConductor.receiptPresent = Boolean(firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH.southRouteConductorReceipt",
      "DEXTER_LAB.hearthSouthRouteConductorReceipt"
    ]));
    state.routeConductor.runtimeActive = true;
    state.routeConductor.hydrated = Boolean(
      state.routeConductor.markerPresent &&
      state.routeConductor.apiPresent &&
      state.routeConductor.receiptPresent &&
      state.routeConductor.runtimeActive
    );
    state.routeConductor.recognitionStatus = state.routeConductor.hydrated
      ? "API_RECEIPT_RUNTIME_PRESENT"
      : state.routeConductor.markerPresent
        ? "MARKER_RECEIVED_API_OR_RECEIPT_PENDING"
        : "MARKER_PENDING";

    summarizeCanvas(readCanvasReceipt());
    evaluateGates();
    updateDataset();

    return getReceiptLight(false);
  }

  function gateStatus(gate) {
    const c = state.canvas;
    const a = state.authorities;
    const i = state.inspect;

    switch (gate.id) {
      case "F1_EAST_ROUTE_SHELL":
        return { ok: Boolean(doc), progress: doc ? 100 : 20, reason: doc ? "document-present" : "document-missing" };

      case "F2_EAST_FIRST_PAINT":
        return { ok: Boolean(doc && (state.dom.cockpitPresent || doc.body || doc.documentElement)), progress: state.dom.cockpitPresent ? 100 : doc ? 80 : 20, reason: state.dom.cockpitPresent ? "cockpit-present" : "document-shell-present" };

      case "F3_EAST_SCRIPT_ORDER":
        return { ok: Boolean(a.indexPresent || doc), degraded: !a.indexPresent, progress: a.indexPresent ? 100 : 75, reason: a.indexPresent ? "index-api-present" : "document-script-fallback" };

      case "F5_NORTH_AUTHORITY":
        return { ok: Boolean(a.northPresent || a.sessionPresent), degraded: !a.northPresent, progress: a.northPresent ? 100 : a.sessionPresent ? 80 : 35, reason: a.northPresent ? "north-present" : a.sessionPresent ? "session-present" : "north-pending" };

      case "F8_SOUTH_SELF_DUTY":
        return { ok: state.routeConductor.hydrated, progress: state.routeConductor.hydrated ? 100 : state.routeConductor.markerPresent ? 45 : 20, reason: state.routeConductor.recognitionStatus };

      case "F13A_CANVAS_PARENT":
        return { ok: Boolean(c.parentPresent && c.parentBootMethodAvailable && c.bootRequested), progress: c.bootRequested ? 100 : c.parentPresent ? 75 : 20, reason: c.parentPresent ? `parent-method=${c.parentBootMethod || "missing"}` : "canvas-parent-missing" };

      case "F13B_CANVAS_CHILDREN":
        return { ok: Boolean(c.allChildrenReady || (c.eastPresent && c.westPresent && c.southPresent)), degraded: !c.allChildrenReady, progress: c.allChildrenReady ? 100 : (c.eastPresent || c.westPresent || c.southPresent) ? 70 : 25, reason: c.allChildrenReady ? "all-canvas-children-ready" : c.childGap || "canvas-children-pending" };

      case "F13C_CANVAS_TEXTURE":
        return { ok: Boolean(c.textureComposeComplete || c.atlasBuildComplete), degraded: !c.textureComposeComplete, progress: c.textureComposeComplete ? 100 : c.atlasBuildComplete ? 85 : c.textureComposeStarted ? 55 : 25, reason: c.textureComposeComplete ? "texture-complete" : "texture-pending" };

      case "F13D_CANVAS_FRAME":
        return { ok: Boolean(c.firstFrameDetected || c.imageRendered || (state.dom.planetCanvasPresent && state.dom.planetCanvasNonZeroSize && c.canvasReady)), degraded: !(c.firstFrameDetected || c.imageRendered), progress: c.firstFrameDetected ? 100 : c.imageRendered ? 95 : state.dom.planetCanvasNonZeroSize ? 70 : 25, reason: c.firstFrameDetected ? "first-frame-detected" : "frame-pending" };

      case "F13E_VISIBLE_PROOF":
        if (c.visibleContentHardFail) return { ok: false, hard: true, progress: 0, reason: "visible-content-hard-fail" };
        return { ok: c.visiblePlanetProofValid, degraded: c.visibleContentSoftGap || !c.visibleContentStrictProof, progress: c.visiblePlanetProofValid ? 100 : state.dom.planetCanvasNonZeroSize ? 60 : 20, reason: c.visiblePlanetProofValid ? (c.visibleContentStrictProof ? "strict-visible-proof" : "visible-proof-soft-or-dom-reconciled") : "visible-proof-pending" };

      case "F13N_INSPECT_GATE":
        return { ok: Boolean(i.strictReady || i.fallbackReady), degraded: !i.strictReady, progress: i.strictReady ? 100 : i.fallbackReady ? 80 : 35, reason: i.strictReady ? "strict-inspect-ready" : i.fallbackReady ? "receipt-inspect-fallback-ready" : "inspect-pending" };

      case "F21_COMPLETION_LATCH": {
        const news = evaluateNews();
        if (!c.visiblePlanetProofValid) return { ok: false, hard: true, progress: 0, reason: "F21_BLOCKED_VISIBLE_PLANET_PROOF_MISSING" };
        return { ok: news.passed || news.degraded, degraded: news.degraded && !news.passed, progress: news.passed || news.degraded ? 100 : 70, reason: news.passed ? "news-gates-passed" : news.degraded ? "news-gates-degraded" : "news-gates-pending" };
      }

      default:
        return { ok: false, progress: 0, reason: "unknown-gate" };
    }
  }

  function evaluateNews() {
    const north = Boolean(state.authorities.northPresent || state.authorities.sessionPresent);
    const east = Boolean(state.authorities.indexPresent || doc);
    const west = Boolean(state.inspect.strictReady || state.inspect.fallbackReady);
    const south = Boolean(state.routeConductor.hydrated && state.canvas.visiblePlanetProofValid && !state.canvas.visibleContentHardFail);

    const passed = Boolean(
      north &&
      east &&
      west &&
      south &&
      state.inspect.strictReady &&
      state.canvas.visibleContentStrictProof &&
      state.canvas.allChildrenReady
    );

    const degraded = Boolean(passed || (north && east && west && south));

    state.newsGatePassed = passed;
    state.newsGateDegraded = degraded && !passed;
    state.completionLatched = Boolean(degraded && state.canvas.visiblePlanetProofValid);
    state.degradedCompletionLatched = Boolean(state.completionLatched && !passed);
    state.readyTextAllowed = state.completionLatched;
    state.f21LatchMode = state.completionLatched
      ? state.degradedCompletionLatched ? "DEGRADED" : "FULL"
      : "WAITING";

    return { passed, degraded: degraded && !passed, north, east, west, south };
  }

  function evaluateGates() {
    const ledger = [];

    GATES.forEach((gate, index) => {
      const status = gateStatus(gate);
      ledger.push({
        id: gate.id,
        fib: gate.fib,
        cardinal: gate.cardinal,
        label: gate.label,
        index,
        ok: status.ok === true,
        degraded: status.degraded === true,
        hard: status.hard === true,
        progress: clamp(status.progress, 0, 100),
        reason: status.reason || ""
      });
    });

    state.gates = ledger;

    let activeIndex = 0;

    for (let i = 0; i < ledger.length; i += 1) {
      const gate = ledger[i];

      if (gate.ok) {
        if (!state.completedGates.includes(gate.id)) {
          state.completedGates.push(gate.id);
          if (gate.degraded && !state.degradedGates.includes(gate.id)) state.degradedGates.push(gate.id);
          record("GATE_COMPLETED", gate);
          submitToNorth(gate);
        }

        activeIndex = Math.min(i + 1, ledger.length - 1);
      } else {
        activeIndex = i;
        if (gate.hard && !state.blockedGates.includes(gate.id)) state.blockedGates.push(gate.id);
        break;
      }
    }

    const active = ledger[activeIndex] || ledger[0];

    state.activeGateId = active.id;
    state.activeFibonacci = active.fib;
    state.activeCardinal = active.cardinal;
    state.activeProgress = active.progress;

    if (state.completionLatched) {
      state.postgameStatus = state.degradedCompletionLatched
        ? "READY_DEGRADED_VISIBLE_PLANET_NEWS_SYNCHRONIZED"
        : "READY_VISIBLE_PLANET_NEWS_SYNCHRONIZED";
      state.firstFailedCoordinate = state.degradedCompletionLatched
        ? "DEGRADED_F21_LATCHED"
        : "NONE_F21_LATCHED";
      state.recommendedNextRenewalTarget = "read-postgame-receipt";
    } else {
      state.postgameStatus = active.hard ? "BLOCKED_BY_ACTIVE_GATE" : "WAITING_ACTIVE_GATE";
      state.firstFailedCoordinate = `WAITING_${active.id}`;
      state.recommendedNextRenewalTarget = active.id.startsWith("F13") ? CANVAS_FILE : FILE;
    }
  }

  function canvasSignature(receipt) {
    const keys = [
      "contract",
      "receipt",
      "splitContract",
      "splitReceipt",
      "canvasCarrierRequested",
      "canvasCarrierMounted",
      "canvasContextReady",
      "canvasEastReady",
      "canvasWestReady",
      "canvasSouthReady",
      "allCanvasChildrenReady",
      "atlasBuildComplete",
      "textureComposeComplete",
      "firstFrameDetected",
      "canvasReady",
      "imageRendered",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleContentHardFail",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visiblePlanetAvailable"
    ];

    return keys.map((key) => `${key}:${safeString(receipt && receipt[key], "")}`).join("|");
  }

  function reconcileCanvas(force = false) {
    const receipt = readCanvasReceipt();
    const signature = canvasSignature(receipt);

    if (!force && signature && signature === state.canvas.latestSignature) return getReceiptLight(false);

    state.canvas.latestSignature = signature;

    scanDom();
    summarizeCanvas(receipt);
    evaluateGates();
    updateDataset();
    scheduleRender();

    return getReceiptLight(false);
  }

  function bootCanvas(reason = "south-self-duty-boot") {
    if (canvasBootPromise || state.canvas.bootComplete || state.completionLatched) {
      return canvasBootPromise || Promise.resolve(readCanvasReceipt());
    }

    if (!state.routeConductor.hydrated) {
      state.canvas.bootError = "waiting-f8-route-conductor-self-duty-hydration";
      state.postgameStatus = "CANVAS_BOOT_WAITING_FOR_F8";
      state.firstFailedCoordinate = "WAITING_F8_SOUTH_SELF_DUTY";
      updateDataset();
      return Promise.resolve(null);
    }

    const canvas = readCanvasApi();
    const method = selectCanvasMethod(canvas);

    summarizeCanvas(readCanvasReceipt());

    if (!canvas || !method) {
      state.canvas.bootError = !canvas ? "canvas-parent-api-missing" : "canvas-parent-boot-method-missing";
      state.postgameStatus = !canvas ? "WAITING_FOR_CANVAS_PARENT_API" : "WAITING_FOR_CANVAS_PARENT_BOOT_METHOD";
      state.firstFailedCoordinate = state.canvas.bootError;
      state.recommendedNextRenewalTarget = CANVAS_FILE;

      record("CANVAS_PARENT_WAITING", {
        reason,
        error: state.canvas.bootError
      });

      updateDataset();
      return Promise.resolve(null);
    }

    state.canvas.bootRequested = true;
    state.canvas.bootStarted = true;
    state.canvas.bootAttempts += 1;
    state.canvas.bootError = "";

    record("CANVAS_PARENT_BOOT_REQUESTED", {
      reason,
      method,
      attempt: state.canvas.bootAttempts
    });

    const options = {
      mount: refs.mount || "#hearthCanvasMount",
      route: ROUTE,
      onReady: () => {
        state.canvas.bootResolved = true;
        state.canvas.bootRejected = false;
        reconcileCanvas(true);
      },
      onError: (error) => {
        state.canvas.bootRejected = true;
        state.canvas.bootError = error && error.message ? error.message : String(error || "canvas-boot-error");
        recordError("CANVAS_PARENT_BOOT_ERROR", state.canvas.bootError);
        reconcileCanvas(true);
      },
      onPhase: () => reconcileCanvas(true)
    };

    try {
      canvasBootPromise = Promise.resolve(canvas[method](options))
        .then((result) => {
          canvasBootPromise = null;
          state.canvas.bootResolved = true;

          summarizeCanvas(isObject(result) ? result : readCanvasReceipt());

          state.canvas.bootComplete = Boolean(
            state.canvas.bootComplete ||
            state.canvas.canvasReady ||
            state.canvas.visiblePlanetProofValid ||
            state.canvas.firstFrameDetected
          );

          reconcileCanvas(true);
          return result;
        })
        .catch((error) => {
          canvasBootPromise = null;
          state.canvas.bootRejected = true;
          state.canvas.bootError = error && error.message ? error.message : String(error || "canvas-boot-failed");
          recordError("CANVAS_PARENT_BOOT_FAILED", state.canvas.bootError);
          reconcileCanvas(true);
          return null;
        });

      return canvasBootPromise;
    } catch (error) {
      canvasBootPromise = null;
      state.canvas.bootRejected = true;
      state.canvas.bootError = error && error.message ? error.message : String(error || "canvas-boot-sync-failed");
      recordError("CANVAS_PARENT_BOOT_SYNC_FAILED", state.canvas.bootError);
      reconcileCanvas(true);
      return Promise.resolve(null);
    }
  }

  function onCanvasPhase(event) {
    const detail = event && event.detail ? event.detail : {};
    const phase = detail.event && (detail.event.event || detail.event.phase || detail.event.id)
      ? detail.event.event || detail.event.phase || detail.event.id
      : "CANVAS_PHASE";

    record("CANVAS_PHASE_RECEIVED", { phase });
    reconcileCanvas(true);
  }

  function bindControls() {
    if (state.refsBound || !doc) return;

    if (refs.copyButton && !refs.copyButton.dataset.hearthSouthSelfDutyBound) {
      refs.copyButton.dataset.hearthSouthSelfDutyBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && !refs.toggleButton.dataset.hearthSouthSelfDutyBound) {
      refs.toggleButton.dataset.hearthSouthSelfDutyBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox ? refs.receiptBox.dataset.visible !== "true" : true;

        if (refs.receiptBox) refs.receiptBox.dataset.visible = String(visible);
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";

        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthSouthSelfDutyBound) {
      refs.inspectButton.dataset.hearthSouthSelfDutyBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        setInspectMode(!(doc.documentElement.dataset.hearthSouthPlanetInspect === "true"));
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthSelfDutyBound) {
      refs.showTab.dataset.hearthSouthSelfDutyBound = "true";
      refs.showTab.addEventListener("click", () => setInspectMode(false));
    }

    state.refsBound = true;
  }

  function setInspectMode(active) {
    if (!doc) return getReceipt();

    scanDom();

    doc.documentElement.dataset.hearthSouthPlanetInspect = String(active);
    doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);

    if (refs.cockpit) refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    record(active ? "SOUTH_INSPECT_MODE_ACTIVE" : "SOUTH_INSPECT_MODE_RELEASED", { active });

    refresh();
    render();

    return getReceipt();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else if (doc) {
        const area = doc.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        doc.body.appendChild(area);
        area.select();
        doc.execCommand("copy");
        area.remove();
      }

      if (refs.copyButton) {
        const prior = refs.copyButton.textContent || "Copy diagnostic";
        refs.copyButton.textContent = "Copied";
        root.setTimeout(() => {
          refs.copyButton.textContent = prior;
        }, 900);
      }

      return true;
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error);
      return false;
    }
  }

  function renderLanes() {
    return (state.gates || []).map((gate) => {
      const status = state.completedGates.includes(gate.id)
        ? state.degradedGates.includes(gate.id)
          ? "DEGRADED"
          : "COMPLETE"
        : gate.id === state.activeGateId
          ? gate.hard
            ? "BLOCKED"
            : "ACTIVE"
          : "PENDING";

      const progress = status === "COMPLETE" || status === "DEGRADED"
        ? 100
        : gate.id === state.activeGateId
          ? gate.progress
          : 0;

      return [
        `<section class="hearth-ledger-lane" data-lane="${gate.id}" data-status="${status}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${gate.fib} · ${gate.label}</strong><span>${gate.cardinal}</span></span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function render() {
    if (!doc) return;

    state.renderCount += 1;

    const active = state.gates[state.gates.findIndex((gate) => gate.id === state.activeGateId)] || GATES[0];
    const visibleStatus = state.completionLatched ? "Ready" : `${state.activeFibonacci} · ${active.label || state.activeGateId}`;

    if (refs.stage) refs.stage.textContent = `${state.activeCardinal} · ${state.activeFibonacci}`;
    if (refs.heartbeat) refs.heartbeat.textContent = visibleStatus;
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${clamp(state.activeProgress, 0, 100)}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(clamp(state.activeProgress, 0, 100))}%`;
    if (refs.lanes) refs.lanes.innerHTML = renderLanes();
    if (refs.status) refs.status.textContent = getStatusText();

    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    updateDataset();
  }

  function scheduleRender() {
    if (renderTimer || !doc) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh();

      if (state.routeConductor.hydrated && !state.canvas.bootComplete && state.canvas.bootAttempts < 3) {
        bootCanvas("watchdog");
      }

      reconcileCanvas();
      render();
      publishGlobals("watchdog-self-duty-republish");

      if (state.completionLatched || state.watchdogTicks >= WATCHDOG_LIMIT) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, WATCHDOG_MS);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_SELF_DUTY_NEWS_FIBONACCI_HANDOFF";

      publishGlobals("boot-early-api-receipt-publication");
      refresh();
      ensureSession();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      state.booting = false;
      state.booted = true;
      state.routeConductor.runtimeActive = true;

      publishGlobals("boot-complete-api-receipt-publication");
      refresh();
      render();

      root.setTimeout(() => bootCanvas("initial"), 80);

      startWatchdog();

      record("SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_BOOTED", {
        route: ROUTE,
        markerPresent: state.routeConductor.markerPresent,
        apiPresent: state.routeConductor.apiPresent,
        receiptPresent: state.routeConductor.receiptPresent,
        hydrated: state.routeConductor.hydrated
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    if (root.removeEventListener) {
      root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
    }

    record("SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_DISPOSED", { reason });
    render();
  }

  function getReceiptLight(doRefresh = true) {
    if (doRefresh) refresh();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      newsProtocolSynchronized: state.newsProtocolSynchronized,
      fibonacciSynchronizationActive: state.fibonacciSynchronizationActive,
      cycleOrder: state.cycleOrder,
      oneActiveGearAtATime: state.oneActiveGearAtATime,

      markerIsNotHydrationProof: state.markerIsNotHydrationProof,
      apiRequiredForF8: state.apiRequiredForF8,
      receiptRequiredForF8: state.receiptRequiredForF8,
      runtimeRequiredForF8: state.runtimeRequiredForF8,
      visibleProofRequiredForF13: state.visibleProofRequiredForF13,
      visibleProofRequiredForF21: state.visibleProofRequiredForF21,
      canvasOwnsF13Only: state.canvasOwnsF13Only,

      activeGateId: state.activeGateId,
      activeFibonacci: state.activeFibonacci,
      activeCardinal: state.activeCardinal,
      activeProgress: state.activeProgress,
      completedGates: state.completedGates.slice(),
      degradedGates: state.degradedGates.slice(),
      blockedGates: state.blockedGates.slice(),

      indexPresent: state.authorities.indexPresent,
      northPresent: state.authorities.northPresent,
      eastBranchPresent: state.authorities.eastBranchPresent,
      westPresent: state.authorities.westPresent,
      southPresent: state.authorities.southPresent,
      sessionPresent: state.authorities.sessionPresent,
      sessionCreatedBySouth: state.authorities.sessionCreatedBySouth,

      routeConductorMarkerPresent: state.routeConductor.markerPresent,
      routeConductorApiPresent: state.routeConductor.apiPresent,
      routeConductorReceiptPresent: state.routeConductor.receiptPresent,
      routeConductorRuntimeActive: state.routeConductor.runtimeActive,
      routeConductorHydrated: state.routeConductor.hydrated,
      routeConductorRecognitionStatus: state.routeConductor.recognitionStatus,

      canvasParentPresent: state.canvas.parentPresent,
      canvasParentBootMethodAvailable: state.canvas.parentBootMethodAvailable,
      canvasParentBootMethod: state.canvas.parentBootMethod,
      canvasBootRequested: state.canvas.bootRequested,
      canvasBootStarted: state.canvas.bootStarted,
      canvasBootResolved: state.canvas.bootResolved,
      canvasBootRejected: state.canvas.bootRejected,
      canvasBootAttempts: state.canvas.bootAttempts,
      canvasBootError: state.canvas.bootError,
      canvasBootComplete: state.canvas.bootComplete,

      canvasContract: state.canvas.contract,
      canvasReceipt: state.canvas.receipt,
      canvasSplitContract: state.canvas.splitContract,
      canvasSplitReceipt: state.canvas.splitReceipt,

      canvasEastPresent: state.canvas.eastPresent,
      canvasWestPresent: state.canvas.westPresent,
      canvasSouthPresent: state.canvas.southPresent,
      canvasEastReady: state.canvas.eastReady,
      canvasWestReady: state.canvas.westReady,
      canvasSouthReady: state.canvas.southReady,
      allCanvasChildrenReady: state.canvas.allChildrenReady,
      canvasChildGap: state.canvas.childGap,

      canvasCarrierRequested: state.canvas.carrierRequested,
      canvasCarrierMounted: state.canvas.carrierMounted,
      canvasContextReady: state.canvas.contextReady,
      dragInspectionBound: state.canvas.dragInspectionBound,
      atlasBuildStarted: state.canvas.atlasBuildStarted,
      atlasBuildComplete: state.canvas.atlasBuildComplete,
      textureComposeStarted: state.canvas.textureComposeStarted,
      textureComposeComplete: state.canvas.textureComposeComplete,
      firstFrameRequested: state.canvas.firstFrameRequested,
      firstFrameDetected: state.canvas.firstFrameDetected,
      canvasReady: state.canvas.canvasReady,
      imageRendered: state.canvas.imageRendered,

      planetCanvasPresent: state.dom.planetCanvasPresent,
      planetCanvasNonZeroSize: state.dom.planetCanvasNonZeroSize,
      visiblePlanetHintPresent: state.dom.visiblePlanetHintPresent,
      visibleContentProofStarted: state.canvas.visibleContentProofStarted,
      visibleContentProof: state.canvas.visibleContentProof,
      visibleContentStrictProof: state.canvas.visibleContentStrictProof,
      visibleContentSoftGap: state.canvas.visibleContentSoftGap,
      visibleContentHardFail: state.canvas.visibleContentHardFail,
      visibleForwardProgress: state.canvas.visibleForwardProgress,
      visibleContentAdmissible: state.canvas.visibleContentAdmissible,
      visiblePlanetAvailable: state.canvas.visiblePlanetAvailable,
      visiblePlanetProofValid: state.canvas.visiblePlanetProofValid,

      inspectModeAvailable: state.inspect.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspect.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.inspect.diagnosticCanLeavePlanetFrame,
      receiptToggleReady: state.inspect.receiptToggleReady,
      copyDiagnosticReady: state.inspect.copyDiagnosticReady,
      inspectStrictReady: state.inspect.strictReady,
      inspectFallbackReady: state.inspect.fallbackReady,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,
      f21LatchMode: state.f21LatchMode,
      newsGatePassed: state.newsGatePassed,
      newsGateDegraded: state.newsGateDegraded,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      booted: state.booted,
      booting: state.booting,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    const light = getReceiptLight(true);

    return {
      ...light,
      files: clonePlain(state.files),
      jobs: clonePlain(state.jobs),
      gateLedger: clonePlain(state.gates),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt
    };
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_STATUS",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `activeGateId=${r.activeGateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeProgress=${r.activeProgress}`,
      `routeConductorMarkerPresent=${r.routeConductorMarkerPresent}`,
      `routeConductorApiPresent=${r.routeConductorApiPresent}`,
      `routeConductorReceiptPresent=${r.routeConductorReceiptPresent}`,
      `routeConductorHydrated=${r.routeConductorHydrated}`,
      `routeConductorRecognitionStatus=${r.routeConductorRecognitionStatus}`,
      `canvasParentPresent=${r.canvasParentPresent}`,
      `canvasBootRequested=${r.canvasBootRequested}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `visiblePlanetProofValid=${r.visiblePlanetProofValid}`,
      `completionLatched=${r.completionLatched}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `postgameStatus=${r.postgameStatus}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function getReceiptText() {
    const r = getReceipt();

    const completed = r.completedGates.join(" > ") || "none";
    const degraded = r.degradedGates.join(" > ") || "none";
    const blocked = r.blockedGates.join(" > ") || "none";

    const gates = r.gateLedger.map((gate) => {
      return `- ${gate.id} :: ${gate.cardinal} :: ${gate.fib} :: ok=${gate.ok} :: degraded=${gate.degraded} :: progress=${gate.progress} :: ${gate.reason}`;
    }).join("\n") || "- none";

    const errors = r.errors.map((error) => {
      return `- ${error.at} :: ${error.code} :: ${error.message}`;
    }).join("\n") || "- none";

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `cycleOrder=${r.cycleOrder}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `markerIsNotHydrationProof=${r.markerIsNotHydrationProof}`,
      `apiRequiredForF8=${r.apiRequiredForF8}`,
      `receiptRequiredForF8=${r.receiptRequiredForF8}`,
      `runtimeRequiredForF8=${r.runtimeRequiredForF8}`,
      `visibleProofRequiredForF13=${r.visibleProofRequiredForF13}`,
      `visibleProofRequiredForF21=${r.visibleProofRequiredForF21}`,
      `canvasOwnsF13Only=${r.canvasOwnsF13Only}`,
      "",
      `activeGateId=${r.activeGateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeProgress=${r.activeProgress}`,
      `completedGates=${completed}`,
      `degradedGates=${degraded}`,
      `blockedGates=${blocked}`,
      "",
      `indexPresent=${r.indexPresent}`,
      `northPresent=${r.northPresent}`,
      `eastBranchPresent=${r.eastBranchPresent}`,
      `westPresent=${r.westPresent}`,
      `southPresent=${r.southPresent}`,
      `sessionPresent=${r.sessionPresent}`,
      `sessionCreatedBySouth=${r.sessionCreatedBySouth}`,
      "",
      `routeConductorMarkerPresent=${r.routeConductorMarkerPresent}`,
      `routeConductorApiPresent=${r.routeConductorApiPresent}`,
      `routeConductorReceiptPresent=${r.routeConductorReceiptPresent}`,
      `routeConductorRuntimeActive=${r.routeConductorRuntimeActive}`,
      `routeConductorHydrated=${r.routeConductorHydrated}`,
      `routeConductorRecognitionStatus=${r.routeConductorRecognitionStatus}`,
      "",
      `canvasParentPresent=${r.canvasParentPresent}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      `canvasParentBootMethod=${r.canvasParentBootMethod}`,
      `canvasBootRequested=${r.canvasBootRequested}`,
      `canvasBootStarted=${r.canvasBootStarted}`,
      `canvasBootResolved=${r.canvasBootResolved}`,
      `canvasBootRejected=${r.canvasBootRejected}`,
      `canvasBootAttempts=${r.canvasBootAttempts}`,
      `canvasBootError=${r.canvasBootError}`,
      `canvasBootComplete=${r.canvasBootComplete}`,
      "",
      `canvasContract=${r.canvasContract}`,
      `canvasReceipt=${r.canvasReceipt}`,
      `canvasSplitContract=${r.canvasSplitContract}`,
      `canvasSplitReceipt=${r.canvasSplitReceipt}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `canvasChildGap=${r.canvasChildGap}`,
      "",
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `canvasReady=${r.canvasReady}`,
      `imageRendered=${r.imageRendered}`,
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `visiblePlanetProofValid=${r.visiblePlanetProofValid}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      "",
      `inspectModeAvailable=${r.inspectModeAvailable}`,
      `diagnosticCanLeavePlanetFrame=${r.diagnosticCanLeavePlanetFrame}`,
      `inspectStrictReady=${r.inspectStrictReady}`,
      `inspectFallbackReady=${r.inspectFallbackReady}`,
      "",
      `completionLatched=${r.completionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `newsGatePassed=${r.newsGatePassed}`,
      `newsGateDegraded=${r.newsGateDegraded}`,
      "",
      "GATE_LEDGER",
      gates,
      "",
      "ERRORS",
      errors,
      "",
      `latestEvent=${r.latestEvent}`,
      `postgameStatus=${r.postgameStatus}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `startedAt=${r.startedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthRouteConductorMarkerPresent = "true";
    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthRouteConductorPresent = "true";
    dataset.hearthRouteConductorContract = CONTRACT;
    dataset.hearthRouteConductorReceipt = RECEIPT;
    dataset.hearthRouteConductorVersion = VERSION;
    dataset.hearthRouteConductorMarkerIsHydrationProof = "false";

    dataset.hearthSouthRouteConductorLoaded = "true";
    dataset.hearthSouthRouteConductorPresent = "true";
    dataset.hearthSouthRouteConductorContract = CONTRACT;
    dataset.hearthSouthRouteConductorReceipt = RECEIPT;
    dataset.hearthSouthSelfDutyNewsFibonacciHandoff = "true";

    dataset.hearthSouthRouteConductorMarkerPresent = String(state.routeConductor.markerPresent);
    dataset.hearthSouthRouteConductorApiPresent = String(state.routeConductor.apiPresent);
    dataset.hearthSouthRouteConductorReceiptPresent = String(state.routeConductor.receiptPresent);
    dataset.hearthSouthRouteConductorRuntimeActive = String(state.routeConductor.runtimeActive);
    dataset.hearthSouthRouteConductorHydrated = String(state.routeConductor.hydrated);
    dataset.hearthSouthRouteConductorRecognitionStatus = state.routeConductor.recognitionStatus;

    dataset.hearthSouthActiveGateId = state.activeGateId;
    dataset.hearthSouthActiveFibonacci = state.activeFibonacci;
    dataset.hearthSouthActiveCardinal = state.activeCardinal;
    dataset.hearthSouthActiveProgress = String(state.activeProgress);
    dataset.hearthSouthCompletedGates = state.completedGates.join(",");
    dataset.hearthSouthDegradedGates = state.degradedGates.join(",");
    dataset.hearthSouthBlockedGates = state.blockedGates.join(",");

    dataset.hearthSouthCanvasBootRequested = String(state.canvas.bootRequested);
    dataset.hearthSouthCanvasBootComplete = String(state.canvas.bootComplete);
    dataset.hearthSouthAllCanvasChildrenReady = String(state.canvas.allChildrenReady);
    dataset.hearthSouthVisiblePlanetProofValid = String(state.canvas.visiblePlanetProofValid);

    dataset.hearthSouthCompletionLatched = String(state.completionLatched);
    dataset.hearthSouthF21LatchMode = state.f21LatchMode;
    dataset.hearthSouthPostgameStatus = state.postgameStatus;
    dataset.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-self-duty-news-fibonacci-handoff",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    render,
    bootCanvas,
    reconcileCanvas,
    setInspectMode,
    copyDiagnostic,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    readCanvasApi,
    readCanvasReceipt,

    supportsSelfDutyPublication: true,
    supportsEarlyApiPublication: true,
    supportsEarlyReceiptPublication: true,
    supportsMarkerNotHydrationProof: true,
    supportsNewsProtocolSynchronization: true,
    supportsFibonacciSynchronization: true,
    supportsCanvasF13EvidenceOnly: true,
    supportsF21NorthNewsLatchOnly: true,

    ownsRouteConductorRuntime: true,
    ownsSelfDutyPublication: true,
    ownsCanvasBootRequest: true,
    ownsCanvasReceiptReconciliation: true,
    ownsVisibleProofGovernance: true,
    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
    ownsNorthCheckpointTruth: false,
    ownsFinalVisualPassClaim: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishEarlyMarker();
  publishGlobals("immediate-self-duty-api-receipt-publication");

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
