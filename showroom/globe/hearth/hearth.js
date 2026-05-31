// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_TNT_v1
// Full-file replacement.
// South route conductor / visible completion conductor only.
// Purpose:
// - Restore South self-duty after marker-only recognition.
// - Publish route-conductor API and receipt immediately.
// - Prevent marker-only recognition from satisfying F8.
// - Assign responsibilities through NEWS cardinal protocol.
// - Sequence route readiness through Fibonacci gates.
// - Boot Canvas parent only after F8 conductor hydration.
// - Reconcile Canvas F13 visible-proof evidence.
// - Request F21 through North/NEWS only.
// Does not own:
// - East first paint or script loading
// - North checkpoint truth
// - West gap taxonomy
// - Lab South visible-state composition
// - Canvas drawing
// - Canvas child files
// - terrain/source truth
// - hydrology
// - materials
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-31.hearth-south-route-conductor-self-duty-news-fibonacci-reassignment-v1";

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

  const WATCHDOG_MS = 500;
  const WATCHDOG_LIMIT = 120;
  const CANVAS_BOOT_RETRY_LIMIT = 5;
  const MAX_LOG = 120;

  const CANVAS_PARENT_NAMES = Object.freeze([
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
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvas"
  ]);

  const CANVAS_CHILD_NAMES = Object.freeze({
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

  const GATES = Object.freeze([
    { id: "F1_EAST_ROUTE_SHELL", fib: "F1", cardinal: "EAST", label: "Route shell" },
    { id: "F2_EAST_FIRST_PAINT", fib: "F2", cardinal: "EAST", label: "First paint" },
    { id: "F3_EAST_SCRIPT_ORDER", fib: "F3", cardinal: "EAST", label: "Script order" },
    { id: "F5_NORTH_AUTHORITY", fib: "F5", cardinal: "NORTH", label: "North authority" },
    { id: "F8_SOUTH_CONDUCTOR_HYDRATED", fib: "F8", cardinal: "SOUTH", label: "South conductor hydrated" },
    { id: "F13A_CANVAS_PARENT_BOOT", fib: "F13A", cardinal: "NORTH", label: "Canvas parent boot" },
    { id: "F13B_CANVAS_CHILDREN", fib: "F13B", cardinal: "EAST", label: "Canvas children" },
    { id: "F13C_TEXTURE_READY", fib: "F13C", cardinal: "SOUTH", label: "Texture ready" },
    { id: "F13D_FRAME_READY", fib: "F13D", cardinal: "SOUTH", label: "Frame ready" },
    { id: "F13E_VISIBLE_PROOF", fib: "F13E", cardinal: "SOUTH", label: "Visible planet proof" },
    { id: "F13N_INSPECT_GATE", fib: "F13N", cardinal: "WEST", label: "Inspect gate" },
    { id: "F21_NEWS_LATCH_REQUEST", fib: "F21", cardinal: "NORTH", label: "NEWS latch request" }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-self-duty-news-fibonacci-reassignment",

    cardinalCircuitActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,
    transmissionMode: true,
    oneActiveGearAtATime: true,

    markerIsNotHydrationProof: true,
    apiRequiredForF8: true,
    receiptRequiredForF8: true,
    runtimeRequiredForF8: true,
    visualProofRequiredForF13: true,
    visualProofRequiredForF21: true,

    ownsRouteConductorRuntime: true,
    ownsApiPublication: true,
    ownsReceiptPublication: true,
    ownsCanvasBootRequest: true,
    ownsCanvasReceiptReconciliation: true,
    ownsVisibleProofGovernance: true,
    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
    ownsNorthCheckpointTruth: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    jobs: {
      north: ["checkpoint-session-read", "authority-presence-read", "f21-request-submission"],
      east: ["index-recognition-read", "script-order-read", "canvas-source-child-read"],
      west: ["inspect-control-read", "diagnostic-dock-read", "receipt-access-read"],
      south: ["api-publication", "receipt-publication", "runtime-hydration", "canvas-parent-boot-request", "canvas-receipt-reconciliation", "visible-proof-governance"]
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

    authorities: {
      indexPresent: false,
      northPresent: false,
      eastBranchPresent: false,
      westBranchPresent: false,
      southBranchPresent: false,
      sessionPresent: false,
      sessionCreatedBySouth: false
    },

    routeConductor: {
      markerPresent: false,
      apiPresent: false,
      receiptPresent: false,
      runtimeActive: false,
      hydrated: false,
      recognitionStatus: "MARKER_PENDING",
      contract: CONTRACT,
      receipt: RECEIPT
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
      bootError: "",
      bootComplete: false,

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
      zoomInspectionBound: false,
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
      canvasPresent: false,
      canvasNonZeroSize: false,
      visiblePlanetHintPresent: false
    },

    inspect: {
      inspectModeAvailable: false,
      inspectPlanetControlAvailable: false,
      diagnosticCanLeavePlanetFrame: false,
      diagnosticDockHidden: false,
      diagnosticDockRestorable: false,
      receiptToggleReady: false,
      copyDiagnosticReady: false,
      showTabVisible: false,
      fallbackReady: false,
      strictReady: false
    },

    gates: {
      activeIndex: 0,
      activeGateId: GATES[0].id,
      activeFibonacci: GATES[0].fib,
      activeCardinal: GATES[0].cardinal,
      activeProgress: 0,
      completed: [],
      degraded: [],
      blocked: [],
      ledger: []
    },

    completion: {
      f21RequestPublished: false,
      f21RequestSubmittedToNorth: false,
      f21RequestMode: "WAITING",
      newsGatePassed: false,
      newsGateDegraded: false,
      readyTextAllowed: false
    },

    refsBound: false,
    booted: false,
    booting: false,
    renderCount: 0,
    watchdogTicks: 0,
    latestEvent: "SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_LOADED",
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

  function trim(array, max = MAX_LOG) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trim(state.localEvents);
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
    trim(state.errors);
    state.latestEvent = item.code;
    state.updatedAt = item.at;
    return item;
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
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
        "DEXTER_LAB.cardinalRuntimeTableSouth",
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
          record("SOUTH_CREATED_CHECKPOINT_SESSION", { source: creator.name || "north-or-east" });
          return session;
        }
      } catch (error) {
        recordError("CREATE_CHECKPOINT_SESSION_FAILED", error);
      }
    }

    state.authorities.sessionPresent = false;
    return null;
  }

  function readCanvasApi() {
    return firstGlobal(CANVAS_PARENT_NAMES);
  }

  function readCanvasReceipt() {
    const apiObject = readCanvasApi();
    const apiReceipt = readReceipt(apiObject);

    if (apiReceipt) return apiReceipt;

    const fallback = firstGlobal([
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_EVIDENCE_RECEIPT",
      "HEARTH_CANVAS_POSTGAME_RECEIPT",
      "HEARTH.canvasReceipt",
      "HEARTH.canvasEvidenceReceipt",
      "DEXTER_LAB.hearthCanvasReceipt"
    ]);

    return isObject(fallback) ? fallback : {};
  }

  function readCanvasChild(key) {
    return firstGlobal(CANVAS_CHILD_NAMES[key] || []);
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
    if (!doc) return state.dom;

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

    refs.status =
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]");

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

    const datasetVisible = Boolean(
      data("hearthCanvasReady") === "true" ||
      data("hearthImageRendered") === "true" ||
      data("hearthCanvasImageRendered") === "true" ||
      data("hearthCanvasVisiblePlanetAvailable") === "true" ||
      data("hearthCanvasVisibleContentProof") === "true" ||
      data("hearthCanvasSouthVisibleContentProof") === "true" ||
      data("hearthCanvasSouthImageRendered") === "true" ||
      data("hearthSouthVisiblePlanetAvailable") === "true"
    );

    state.dom.mountPresent = Boolean(refs.mount);
    state.dom.cockpitPresent = Boolean(refs.cockpit);
    state.dom.canvasPresent = Boolean(canvas);
    state.dom.canvasNonZeroSize = nonZero;
    state.dom.visiblePlanetHintPresent = Boolean(canvas && nonZero && datasetVisible);

    state.inspect.copyDiagnosticReady = Boolean(refs.copyButton);
    state.inspect.receiptToggleReady = Boolean(refs.toggleButton || refs.receiptText || refs.receiptBox);
    state.inspect.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.inspect.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.inspect.diagnosticDockRestorable = Boolean(refs.cockpit);
    state.inspect.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.inspect.showTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    state.inspect.diagnosticDockHidden = Boolean(refs.cockpit && refs.cockpit.dataset.cockpitMode === "planet-inspect");
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
    return state.dom;
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

    c.allChildrenReady = safeBool(receipt.allCanvasChildrenReady, c.eastReady && c.westReady && c.southReady);

    c.childGap = [
      eastMissing.length ? `east:${eastMissing.join(",")}` : "",
      westMissing.length ? `west:${westMissing.join(",")}` : "",
      southMissing.length ? `south:${southMissing.join(",")}` : ""
    ].filter(Boolean).join("; ");

    c.carrierRequested = safeBool(receipt.canvasCarrierRequested, safeBool(data("hearthCanvasCarrierRequested"), c.bootRequested));
    c.carrierMounted = safeBool(receipt.canvasCarrierMounted, safeBool(data("hearthCanvasCarrierMounted"), false));
    c.contextReady = safeBool(receipt.canvasContextReady, safeBool(data("hearthCanvasContextReady"), false));
    c.dragInspectionBound = safeBool(receipt.dragInspectionBound, safeBool(data("hearthCanvasDragInspectionBound"), false));
    c.zoomInspectionBound = safeBool(receipt.zoomInspectionBound, safeBool(data("hearthCanvasZoomInspectionBound"), false));

    c.atlasBuildStarted = safeBool(receipt.atlasBuildStarted, safeBool(data("hearthCanvasAtlasBuildStarted"), false));
    c.atlasBuildComplete = safeBool(receipt.atlasBuildComplete, safeBool(data("hearthCanvasAtlasBuildComplete"), false));

    c.textureComposeStarted = safeBool(
      receipt.textureComposeStarted,
      safeBool(data("hearthCanvasTextureComposeStarted"), safeBool(data("hearthCanvasSouthTextureComposeStarted"), false))
    );

    c.textureComposeComplete = safeBool(
      receipt.textureComposeComplete,
      safeBool(data("hearthCanvasTextureComposeComplete"), safeBool(data("hearthCanvasSouthTextureComposeComplete"), false))
    );

    c.firstFrameRequested = safeBool(
      receipt.firstFrameRequested,
      safeBool(data("hearthCanvasFirstFrameRequested"), safeBool(data("hearthCanvasSouthFirstFrameRequested"), false))
    );

    c.firstFrameDetected = safeBool(
      receipt.firstFrameDetected,
      safeBool(data("hearthCanvasFirstFrameDetected"), safeBool(data("hearthCanvasSouthFirstFrameDetected"), false))
    );

    c.canvasReady = safeBool(receipt.canvasReady, safeBool(data("hearthCanvasReady"), false));

    c.imageRendered = safeBool(
      receipt.imageRendered,
      safeBool(data("hearthCanvasImageRendered"), safeBool(data("hearthCanvasSouthImageRendered"), false))
    );

    c.visibleContentProofStarted = safeBool(
      receipt.visibleContentProofStarted,
      safeBool(data("hearthCanvasVisibleContentProofStarted"), safeBool(data("hearthCanvasSouthVisibleContentProofStarted"), false))
    );

    c.visibleContentProof = safeBool(
      receipt.visibleContentProof,
      safeBool(data("hearthCanvasVisibleContentProof"), safeBool(data("hearthCanvasSouthVisibleContentProof"), false))
    );

    c.visibleContentStrictProof = safeBool(
      receipt.visibleContentStrictProof,
      safeBool(data("hearthCanvasVisibleContentStrictProof"), safeBool(data("hearthCanvasSouthVisibleContentStrictProof"), false))
    );

    c.visibleContentSoftGap = safeBool(
      receipt.visibleContentSoftGap,
      safeBool(data("hearthCanvasVisibleContentSoftGap"), safeBool(data("hearthCanvasSouthVisibleContentSoftGap"), false))
    );

    c.visibleContentHardFail = safeBool(
      receipt.visibleContentHardFail,
      safeBool(data("hearthCanvasVisibleContentHardFail"), safeBool(data("hearthCanvasSouthVisibleContentHardFail"), false))
    );

    c.visibleForwardProgress = safeBool(
      receipt.visibleForwardProgress,
      safeBool(data("hearthCanvasVisibleForwardProgress"), false)
    );

    c.visibleContentAdmissible = safeBool(receipt.visibleContentAdmissible, false);

    c.visiblePlanetAvailable = safeBool(
      receipt.visiblePlanetAvailable,
      safeBool(data("hearthCanvasVisiblePlanetAvailable"), safeBool(data("hearthCanvasSouthVisiblePlanetAvailable"), false))
    );

    const visibleCounts = Boolean(
      safeNumber(receipt.visibleContentClassCount, 0) > 0 ||
      safeNumber(receipt.visibleContentLandSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentWaterSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentOtherSampleCount, 0) > 0
    );

    c.visiblePlanetProofValid = Boolean(
      state.dom.canvasPresent &&
      state.dom.canvasNonZeroSize &&
      !c.visibleContentHardFail &&
      (
        c.visibleContentProof ||
        c.visibleContentStrictProof ||
        c.visibleContentSoftGap ||
        c.visibleForwardProgress ||
        c.visibleContentAdmissible ||
        c.visiblePlanetAvailable ||
        visibleCounts ||
        state.dom.visiblePlanetHintPresent ||
        (c.canvasReady && c.firstFrameDetected) ||
        (c.imageRendered && c.firstFrameDetected)
      )
    );

    c.bootComplete = Boolean(c.bootComplete || c.canvasReady || c.visiblePlanetProofValid || c.firstFrameDetected || c.imageRendered);

    return c;
  }

  function refresh() {
    scanDom();

    state.authorities.indexPresent = Boolean(readIndexApi());
    state.authorities.northPresent = Boolean(readNorth());
    state.authorities.eastBranchPresent = Boolean(readBranch("east"));
    state.authorities.westBranchPresent = Boolean(readBranch("west"));
    state.authorities.southBranchPresent = Boolean(readBranch("south"));
    state.authorities.sessionPresent = Boolean(readSession());

    state.routeConductor.markerPresent = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ ||
      data("hearthRouteConductorMarkerPresent") === "true"
    );

    state.routeConductor.apiPresent = Boolean(
      firstGlobal([
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor"
      ])
    );

    state.routeConductor.receiptPresent = Boolean(
      firstGlobal([
        "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH.routeConductorReceipt",
        "HEARTH.southRouteConductorReceipt",
        "DEXTER_LAB.hearthRouteConductorReceipt",
        "DEXTER_LAB.hearthSouthRouteConductorReceipt"
      ])
    );

    state.routeConductor.runtimeActive = Boolean(state.booting || state.booted || state.routeConductor.apiPresent);
    state.routeConductor.hydrated = Boolean(
      state.routeConductor.apiPresent &&
      state.routeConductor.receiptPresent &&
      state.routeConductor.runtimeActive
    );

    state.routeConductor.recognitionStatus = state.routeConductor.hydrated
      ? "API_RECEIPT_RUNTIME_PRESENT"
      : state.routeConductor.markerPresent
        ? "MARKER_PRESENT_API_PENDING"
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
        return {
          ok: Boolean(doc),
          progress: doc ? 100 : 20,
          reason: doc ? "document-present" : "document-missing"
        };

      case "F2_EAST_FIRST_PAINT":
        return {
          ok: Boolean(doc && (state.dom.cockpitPresent || doc.body || doc.documentElement)),
          degraded: Boolean(doc && !state.dom.cockpitPresent),
          progress: state.dom.cockpitPresent ? 100 : doc ? 80 : 20,
          reason: state.dom.cockpitPresent ? "cockpit-present" : "document-shell-present"
        };

      case "F3_EAST_SCRIPT_ORDER":
        return {
          ok: Boolean(a.indexPresent || doc),
          degraded: !a.indexPresent,
          progress: a.indexPresent ? 100 : 75,
          reason: a.indexPresent ? "index-api-present" : "page-shell-script-order-fallback"
        };

      case "F5_NORTH_AUTHORITY":
        return {
          ok: Boolean(a.northPresent || a.sessionPresent || ensureSession()),
          degraded: !a.northPresent,
          progress: a.northPresent ? 100 : 70,
          reason: a.northPresent ? "north-present" : "north-session-fallback"
        };

      case "F8_SOUTH_CONDUCTOR_HYDRATED":
        return {
          ok: state.routeConductor.hydrated,
          progress: state.routeConductor.hydrated ? 100 : state.routeConductor.markerPresent ? 45 : 20,
          reason: state.routeConductor.recognitionStatus
        };

      case "F13A_CANVAS_PARENT_BOOT":
        return {
          ok: Boolean(c.parentPresent && c.parentBootMethodAvailable && c.bootRequested),
          progress: c.bootRequested ? 100 : c.parentPresent ? 75 : 20,
          reason: c.parentPresent ? `parent-method=${c.parentBootMethod || "missing"}` : "canvas-parent-missing"
        };

      case "F13B_CANVAS_CHILDREN":
        return {
          ok: Boolean(c.allChildrenReady || (c.eastPresent && c.westPresent && c.southPresent)),
          degraded: !c.allChildrenReady,
          progress: c.allChildrenReady ? 100 : (c.eastPresent || c.westPresent || c.southPresent) ? 70 : 25,
          reason: c.allChildrenReady ? "all-canvas-children-ready" : c.childGap || "canvas-children-pending"
        };

      case "F13C_TEXTURE_READY":
        return {
          ok: Boolean(c.textureComposeComplete || c.firstFrameDetected || c.imageRendered || c.visiblePlanetProofValid),
          degraded: !c.textureComposeComplete,
          progress: c.textureComposeComplete ? 100 : c.atlasBuildComplete ? 85 : c.textureComposeStarted ? 55 : c.visiblePlanetProofValid ? 90 : 25,
          reason: c.textureComposeComplete ? "texture-complete" : c.visiblePlanetProofValid ? "visible-proof-substitutes-texture-gap" : "texture-pending"
        };

      case "F13D_FRAME_READY":
        return {
          ok: Boolean(c.firstFrameDetected || c.imageRendered || c.visiblePlanetProofValid || (state.dom.canvasPresent && state.dom.canvasNonZeroSize && c.canvasReady)),
          degraded: !(c.firstFrameDetected || c.imageRendered),
          progress: c.firstFrameDetected ? 100 : c.imageRendered ? 95 : state.dom.canvasNonZeroSize ? 70 : 25,
          reason: c.firstFrameDetected ? "first-frame-detected" : c.imageRendered ? "image-rendered" : "frame-pending"
        };

      case "F13E_VISIBLE_PROOF":
        if (c.visibleContentHardFail) {
          return {
            ok: false,
            hard: true,
            progress: 0,
            reason: "visible-content-hard-fail"
          };
        }

        return {
          ok: c.visiblePlanetProofValid,
          degraded: c.visibleContentSoftGap || !c.visibleContentStrictProof,
          progress: c.visiblePlanetProofValid ? 100 : state.dom.canvasNonZeroSize ? 60 : 20,
          reason: c.visiblePlanetProofValid
            ? c.visibleContentStrictProof
              ? "strict-visible-proof"
              : "visible-proof-soft-or-dom-reconciled"
            : "visible-proof-pending"
        };

      case "F13N_INSPECT_GATE":
        return {
          ok: Boolean(i.strictReady || i.fallbackReady),
          degraded: !i.strictReady,
          progress: i.strictReady ? 100 : i.fallbackReady ? 80 : 35,
          reason: i.strictReady ? "strict-inspect-ready" : i.fallbackReady ? "receipt-inspect-fallback-ready" : "inspect-pending"
        };

      case "F21_NEWS_LATCH_REQUEST": {
        const news = evaluateNews();

        if (!c.visiblePlanetProofValid) {
          return {
            ok: false,
            hard: true,
            progress: 0,
            reason: "F21_BLOCKED_VISIBLE_PLANET_PROOF_MISSING"
          };
        }

        return {
          ok: news.passed || news.degraded,
          degraded: news.degraded && !news.passed,
          progress: news.passed || news.degraded ? 100 : 70,
          reason: news.passed ? "news-gates-passed" : news.degraded ? "news-gates-degraded" : "news-gates-pending"
        };
      }

      default:
        return {
          ok: false,
          progress: 0,
          reason: "unknown-gate"
        };
    }
  }

  function evaluateNews() {
    const c = state.canvas;
    const a = state.authorities;
    const i = state.inspect;

    const north = Boolean(a.northPresent || a.sessionPresent || readSession());
    const east = Boolean(a.indexPresent || doc);
    const west = Boolean(i.strictReady || i.fallbackReady);
    const south = Boolean(state.routeConductor.hydrated && c.visiblePlanetProofValid && !c.visibleContentHardFail);

    const passed = Boolean(
      north &&
      east &&
      i.strictReady &&
      south &&
      c.visibleContentStrictProof &&
      c.allChildrenReady
    );

    const degraded = Boolean(!passed && north && east && west && south);

    state.completion.newsGatePassed = passed;
    state.completion.newsGateDegraded = degraded;

    return { passed, degraded, north, east, west, south };
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

    state.gates.ledger = ledger;

    let nextIndex = 0;

    for (let i = 0; i < ledger.length; i += 1) {
      const item = ledger[i];

      if (item.ok) {
        if (!state.gates.completed.includes(item.id)) {
          state.gates.completed.push(item.id);
          if (item.degraded && !state.gates.degraded.includes(item.id)) state.gates.degraded.push(item.id);
          record("GATE_COMPLETED", {
            id: item.id,
            fib: item.fib,
            cardinal: item.cardinal,
            degraded: item.degraded,
            reason: item.reason
          });

          if (item.id === "F21_NEWS_LATCH_REQUEST") {
            publishF21Request(item);
          } else {
            submitToNorth(item);
          }
        }

        nextIndex = Math.min(i + 1, GATES.length - 1);
      } else {
        nextIndex = i;
        if (item.hard && !state.gates.blocked.includes(item.id)) state.gates.blocked.push(item.id);
        break;
      }
    }

    const active = ledger[nextIndex] || ledger[ledger.length - 1] || GATES[0];

    state.gates.activeIndex = nextIndex;
    state.gates.activeGateId = active.id;
    state.gates.activeFibonacci = active.fib;
    state.gates.activeCardinal = active.cardinal;
    state.gates.activeProgress = active.progress;

    if (state.completion.f21RequestPublished) {
      state.completion.readyTextAllowed = false;
      state.completion.f21RequestMode = state.completion.newsGatePassed ? "FULL_REQUESTED" : "DEGRADED_REQUESTED";
      state.postgameStatus = state.completion.newsGatePassed
        ? "F21_REQUEST_PUBLISHED_NEWS_SYNCHRONIZED"
        : "F21_DEGRADED_REQUEST_PUBLISHED_NEWS_SYNCHRONIZED";
      state.firstFailedCoordinate = "NONE_ROUTE_CONDUCTOR_DUTY_COMPLETE";
      state.recommendedNextRenewalTarget = "read-north-or-canvas-postgame-receipt";
    } else {
      state.completion.readyTextAllowed = false;
      state.completion.f21RequestMode = active && active.id === "F21_NEWS_LATCH_REQUEST" ? "WAITING_OR_BLOCKED" : "WAITING";
      state.postgameStatus = active && active.hard ? "BLOCKED_BY_ACTIVE_GATE" : "WAITING_ACTIVE_GATE";
      state.firstFailedCoordinate = active ? `WAITING_${active.id}` : "WAITING_GATE";
      state.recommendedNextRenewalTarget = active && active.id && active.id.startsWith("F13") ? CANVAS_FILE : FILE;
    }
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
      source: "hearth.south.routeConductorSelfDutyNewsFibonacciReassignment",
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        gate: clonePlain(gate),
        markerIsNotHydrationProof: true,
        apiRequiredForF8: true,
        receiptRequiredForF8: true,
        runtimeRequiredForF8: true,
        visualProofRequiredForF13: true,
        visualProofRequiredForF21: true,
        canvasOwnsF13Only: true,
        southOwnsRouteConductorRuntime: true,
        visualPassClaimed: false
      }
    };

    try {
      if (isFunction(session.submitEvent)) return session.submitEvent(payload);
      if (isFunction(session.submit)) return session.submit(payload);
      if (isFunction(session.completeActive)) return session.completeActive(payload);
    } catch (error) {
      recordError("NORTH_GATE_SUBMIT_FAILED", error, { gate: gate.id });
    }

    return false;
  }

  function publishF21Request(gate) {
    if (state.completion.f21RequestPublished) return true;

    const news = evaluateNews();

    state.completion.f21RequestPublished = true;
    state.completion.f21RequestMode = news.passed ? "FULL_REQUESTED" : "DEGRADED_REQUESTED";
    state.completion.readyTextAllowed = false;

    root.HEARTH_F21_NEWS_LATCH_REQUEST = {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      gate: clonePlain(gate),
      news: clonePlain(news),
      visualProofRequiredForF21: true,
      ownsF21: false,
      visualPassClaimed: false,
      requestedAt: nowIso()
    };

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.f21NewsLatchRequest = root.HEARTH_F21_NEWS_LATCH_REQUEST;

    const result = submitToNorth({
      ...gate,
      reason: news.passed ? "F21_FULL_REQUEST_NEWS_SYNCHRONIZED" : "F21_DEGRADED_REQUEST_NEWS_SYNCHRONIZED"
    });

    state.completion.f21RequestSubmittedToNorth = Boolean(result);
    record("F21_NEWS_LATCH_REQUEST_PUBLISHED", {
      mode: state.completion.f21RequestMode,
      submittedToNorth: state.completion.f21RequestSubmittedToNorth
    });

    return true;
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
    refresh();

    if (canvasBootPromise || state.canvas.bootComplete || state.completion.f21RequestPublished) {
      return canvasBootPromise || Promise.resolve(readCanvasReceipt());
    }

    if (!state.routeConductor.hydrated) {
      state.canvas.bootError = "waiting-f8-route-conductor-hydration";
      state.postgameStatus = "CANVAS_BOOT_WAITING_FOR_F8";
      state.firstFailedCoordinate = "WAITING_F8_SOUTH_CONDUCTOR_HYDRATED";
      updateDataset();
      return Promise.resolve(null);
    }

    const canvas = readCanvasApi();
    const method = selectCanvasMethod(canvas);

    summarizeCanvas(readCanvasReceipt());

    if (!canvas || !method) {
      state.canvas.bootError = !canvas ? "canvas-parent-api-missing" : "canvas-parent-boot-method-missing";
      state.postgameStatus = !canvas ? "WAITING_FOR_CANVAS_PARENT_API" : "WAITING_FOR_CANVAS_PARENT_BOOT_METHOD";
      state.firstFailedCoordinate = !canvas ? "WAITING_CANVAS_PARENT_API" : "WAITING_CANVAS_PARENT_BOOT_METHOD";
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
      source: "hearth.south.routeConductorSelfDutyNewsFibonacciReassignment",
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
          state.canvas.bootRejected = false;

          summarizeCanvas(isObject(result) ? result : readCanvasReceipt());
          state.canvas.bootComplete = Boolean(
            state.canvas.bootComplete ||
            state.canvas.canvasReady ||
            state.canvas.visiblePlanetProofValid ||
            state.canvas.firstFrameDetected ||
            state.canvas.imageRendered
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
    if (!doc) return;

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
        const active = !(doc.documentElement.dataset.hearthSouthPlanetInspect === "true");
        setInspectMode(active);
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthSelfDutyBound) {
      refs.showTab.dataset.hearthSouthSelfDutyBound = "true";
      refs.showTab.addEventListener("click", () => setInspectMode(false));
    }
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

    if (refs.inspectButton) refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";

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
    return (state.gates.ledger || []).map((gate) => {
      const status = state.gates.completed.includes(gate.id)
        ? state.gates.degraded.includes(gate.id)
          ? "DEGRADED"
          : "COMPLETE"
        : gate.id === state.gates.activeGateId
          ? gate.hard
            ? "BLOCKED"
            : "ACTIVE"
          : "PENDING";

      const progress = status === "COMPLETE" || status === "DEGRADED"
        ? 100
        : gate.id === state.gates.activeGateId
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

    const gate = state.gates.ledger[state.gates.activeIndex] || GATES[state.gates.activeIndex] || GATES[0];
    const progress = clamp(state.gates.activeProgress, 0, 100);
    const status = state.completion.f21RequestPublished
      ? state.completion.f21RequestMode
      : `${gate.fib} · ${gate.label}`;

    if (refs.stage) refs.stage.textContent = `${gate.cardinal} · ${gate.fib}`;
    if (refs.heartbeat) refs.heartbeat.textContent = status;
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${progress}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(progress)}%`;
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

      if (
        state.routeConductor.hydrated &&
        !state.canvas.bootComplete &&
        state.canvas.bootAttempts < CANVAS_BOOT_RETRY_LIMIT
      ) {
        bootCanvas("watchdog");
      }

      reconcileCanvas();
      render();

      if (state.completion.f21RequestPublished || state.watchdogTicks >= WATCHDOG_LIMIT) {
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
      state.postgameStatus = "BOOTING_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT";

      publishGlobals();
      refresh();
      ensureSession();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      state.booting = false;
      state.booted = true;
      state.routeConductor.runtimeActive = true;

      publishGlobals();
      refresh();
      render();

      root.setTimeout(() => bootCanvas("initial"), 80);
      startWatchdog();

      record("SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_BOOTED", {
        route: ROUTE,
        apiPublished: true,
        receiptPublished: true,
        markerIsNotHydrationProof: true
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

    if (root.removeEventListener) root.removeEventListener("hearth:canvas-phase", onCanvasPhase);

    record("SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_DISPOSED", { reason });
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

      cardinalCircuitActive: true,
      newsProtocolSynchronized: true,
      fibonacciSynchronizationActive: true,
      transmissionMode: true,
      oneActiveGearAtATime: true,

      markerIsNotHydrationProof: true,
      apiRequiredForF8: true,
      receiptRequiredForF8: true,
      runtimeRequiredForF8: true,
      visualProofRequiredForF13: true,
      visualProofRequiredForF21: true,

      ownsRouteConductorRuntime: true,
      ownsApiPublication: true,
      ownsReceiptPublication: true,
      ownsCanvasBootRequest: true,
      ownsCanvasReceiptReconciliation: true,
      ownsVisibleProofGovernance: true,
      ownsCanvasDrawing: false,
      ownsCanvasChildren: false,
      ownsNorthCheckpointTruth: false,
      ownsF21: false,
      ownsFinalVisualPassClaim: false,

      activeGateId: state.gates.activeGateId,
      activeFibonacci: state.gates.activeFibonacci,
      activeCardinal: state.gates.activeCardinal,
      activeProgress: state.gates.activeProgress,
      completedGates: state.gates.completed.slice(),
      degradedGates: state.gates.degraded.slice(),
      blockedGates: state.gates.blocked.slice(),

      indexPresent: state.authorities.indexPresent,
      northPresent: state.authorities.northPresent,
      eastBranchPresent: state.authorities.eastBranchPresent,
      westBranchPresent: state.authorities.westBranchPresent,
      southBranchPresent: state.authorities.southBranchPresent,
      sessionPresent: state.authorities.sessionPresent,
      sessionCreatedBySouth: state.authorities.sessionCreatedBySouth,

      routeConductorMarkerPresent: state.routeConductor.markerPresent,
      routeConductorApiPresent: state.routeConductor.apiPresent,
      routeConductorReceiptPresent: state.routeConductor.receiptPresent,
      routeConductorRuntimeActive: state.routeConductor.runtimeActive,
      routeConductorHydrated: state.routeConductor.hydrated,
      routeConductorRecognitionStatus: state.routeConductor.recognitionStatus,
      routeConductorContract: CONTRACT,

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
      zoomInspectionBound: state.canvas.zoomInspectionBound,
      atlasBuildStarted: state.canvas.atlasBuildStarted,
      atlasBuildComplete: state.canvas.atlasBuildComplete,
      textureComposeStarted: state.canvas.textureComposeStarted,
      textureComposeComplete: state.canvas.textureComposeComplete,
      firstFrameRequested: state.canvas.firstFrameRequested,
      firstFrameDetected: state.canvas.firstFrameDetected,
      canvasReady: state.canvas.canvasReady,
      imageRendered: state.canvas.imageRendered,

      planetCanvasPresent: state.dom.canvasPresent,
      planetCanvasNonZeroSize: state.dom.canvasNonZeroSize,
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

      f21RequestPublished: state.completion.f21RequestPublished,
      f21RequestSubmittedToNorth: state.completion.f21RequestSubmittedToNorth,
      f21RequestMode: state.completion.f21RequestMode,
      readyTextAllowed: false,
      newsGatePassed: state.completion.newsGatePassed,
      newsGateDegraded: state.completion.newsGateDegraded,

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
      gateLedger: clonePlain(state.gates.ledger),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt
    };
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_STATUS",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `activeGateId=${r.activeGateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeProgress=${r.activeProgress}`,
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
      `f21RequestPublished=${r.f21RequestPublished}`,
      `f21RequestMode=${r.f21RequestMode}`,
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

    const gates = r.gateLedger.map((g) => (
      `- ${g.id} :: ${g.cardinal} :: ${g.fib} :: ok=${g.ok} :: degraded=${g.degraded} :: hard=${g.hard} :: progress=${g.progress} :: ${g.reason}`
    )).join("\n") || "- none";

    const events = r.localEvents.map((e) => (
      `- ${e.at} :: ${e.event} :: ${JSON.stringify(e.detail || {})}`
    )).join("\n") || "- none";

    const errors = r.errors.map((e) => (
      `- ${e.at} :: ${e.code} :: ${e.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_RECEIPT",
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
      `cardinalCircuitActive=${r.cardinalCircuitActive}`,
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `markerIsNotHydrationProof=${r.markerIsNotHydrationProof}`,
      `apiRequiredForF8=${r.apiRequiredForF8}`,
      `receiptRequiredForF8=${r.receiptRequiredForF8}`,
      `runtimeRequiredForF8=${r.runtimeRequiredForF8}`,
      `visualProofRequiredForF13=${r.visualProofRequiredForF13}`,
      `visualProofRequiredForF21=${r.visualProofRequiredForF21}`,
      "",
      `ownsRouteConductorRuntime=${r.ownsRouteConductorRuntime}`,
      `ownsApiPublication=${r.ownsApiPublication}`,
      `ownsReceiptPublication=${r.ownsReceiptPublication}`,
      `ownsCanvasBootRequest=${r.ownsCanvasBootRequest}`,
      `ownsCanvasReceiptReconciliation=${r.ownsCanvasReceiptReconciliation}`,
      `ownsVisibleProofGovernance=${r.ownsVisibleProofGovernance}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsCanvasChildren=${r.ownsCanvasChildren}`,
      `ownsNorthCheckpointTruth=${r.ownsNorthCheckpointTruth}`,
      `ownsF21=${r.ownsF21}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
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
      `westBranchPresent=${r.westBranchPresent}`,
      `southBranchPresent=${r.southBranchPresent}`,
      `sessionPresent=${r.sessionPresent}`,
      `sessionCreatedBySouth=${r.sessionCreatedBySouth}`,
      "",
      `routeConductorMarkerPresent=${r.routeConductorMarkerPresent}`,
      `routeConductorApiPresent=${r.routeConductorApiPresent}`,
      `routeConductorReceiptPresent=${r.routeConductorReceiptPresent}`,
      `routeConductorRuntimeActive=${r.routeConductorRuntimeActive}`,
      `routeConductorHydrated=${r.routeConductorHydrated}`,
      `routeConductorRecognitionStatus=${r.routeConductorRecognitionStatus}`,
      `routeConductorContract=${r.routeConductorContract}`,
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
      `atlasBuildStarted=${r.atlasBuildStarted}`,
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `canvasReady=${r.canvasReady}`,
      `imageRendered=${r.imageRendered}`,
      "",
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `visiblePlanetHintPresent=${r.visiblePlanetHintPresent}`,
      `visiblePlanetProofValid=${r.visiblePlanetProofValid}`,
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      "",
      `inspectModeAvailable=${r.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${r.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${r.diagnosticCanLeavePlanetFrame}`,
      `receiptToggleReady=${r.receiptToggleReady}`,
      `copyDiagnosticReady=${r.copyDiagnosticReady}`,
      `inspectStrictReady=${r.inspectStrictReady}`,
      `inspectFallbackReady=${r.inspectFallbackReady}`,
      "",
      `f21RequestPublished=${r.f21RequestPublished}`,
      `f21RequestSubmittedToNorth=${r.f21RequestSubmittedToNorth}`,
      `f21RequestMode=${r.f21RequestMode}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `newsGatePassed=${r.newsGatePassed}`,
      `newsGateDegraded=${r.newsGateDegraded}`,
      "",
      "GATE_LEDGER",
      gates,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      `latestEvent=${r.latestEvent}`,
      `postgameStatus=${r.postgameStatus}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `renderCount=${r.renderCount}`,
      `watchdogTicks=${r.watchdogTicks}`,
      `booted=${r.booted}`,
      `booting=${r.booting}`,
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
    dataset.hearthSouthRouteConductorSelfDutyNewsFibonacciReassignment = "true";

    dataset.hearthSouthRouteConductorApiPresent = String(state.routeConductor.apiPresent);
    dataset.hearthSouthRouteConductorReceiptPresent = String(state.routeConductor.receiptPresent);
    dataset.hearthSouthRouteConductorRuntimeActive = String(state.routeConductor.runtimeActive);
    dataset.hearthSouthRouteConductorHydrated = String(state.routeConductor.hydrated);
    dataset.hearthSouthRouteConductorRecognitionStatus = state.routeConductor.recognitionStatus;

    dataset.hearthSouthActiveGateId = state.gates.activeGateId;
    dataset.hearthSouthActiveFibonacci = state.gates.activeFibonacci;
    dataset.hearthSouthActiveCardinal = state.gates.activeCardinal;
    dataset.hearthSouthActiveProgress = String(state.gates.activeProgress);
    dataset.hearthSouthCompletedGates = state.gates.completed.join(",");
    dataset.hearthSouthDegradedGates = state.gates.degraded.join(",");
    dataset.hearthSouthBlockedGates = state.gates.blocked.join(",");

    dataset.hearthSouthCanvasBootRequested = String(state.canvas.bootRequested);
    dataset.hearthSouthCanvasBootStarted = String(state.canvas.bootStarted);
    dataset.hearthSouthCanvasBootComplete = String(state.canvas.bootComplete);
    dataset.hearthSouthAllCanvasChildrenReady = String(state.canvas.allChildrenReady);

    dataset.hearthSouthVisiblePlanetProofValid = String(state.canvas.visiblePlanetProofValid);
    dataset.hearthSouthVisibleContentProof = String(state.canvas.visibleContentProof);
    dataset.hearthSouthVisibleContentStrictProof = String(state.canvas.visibleContentStrictProof);
    dataset.hearthSouthVisibleContentSoftGap = String(state.canvas.visibleContentSoftGap);
    dataset.hearthSouthVisibleContentHardFail = String(state.canvas.visibleContentHardFail);

    dataset.hearthSouthF21RequestPublished = String(state.completion.f21RequestPublished);
    dataset.hearthSouthF21RequestMode = state.completion.f21RequestMode;
    dataset.hearthSouthReadyTextAllowed = "false";

    dataset.hearthSouthPostgameStatus = state.postgameStatus;
    dataset.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
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

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southRouteConductorSelfDutyNewsFibonacciReassignment = api;
    root.HEARTH.southVisibleCompletion = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyNewsFibonacciReassignment = api;

    state.routeConductor.apiPresent = true;
    state.routeConductor.receiptPresent = true;
    state.routeConductor.runtimeActive = true;
    state.routeConductor.hydrated = true;
    state.routeConductor.recognitionStatus = "API_RECEIPT_RUNTIME_PRESENT";

    const light = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_NEWS_FIBONACCI_REASSIGNMENT_RECEIPT = light;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = light;

    root.HEARTH.routeConductorReceipt = light;
    root.HEARTH.southRouteConductorReceipt = light;
    root.HEARTH.southRouteConductorSelfDutyNewsFibonacciReassignmentReceipt = light;
    root.HEARTH.southVisibleCompletionReceipt = light;

    root.DEXTER_LAB.hearthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyNewsFibonacciReassignmentReceipt = light;

    updateDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-self-duty-news-fibonacci-reassignment",

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
    supportsApiPublication: true,
    supportsReceiptPublication: true,
    supportsCardinalCircuit: true,
    supportsNewsProtocol: true,
    supportsFibonacciSynchronization: true,
    supportsParentCanvasBoot: true,
    supportsVisibleProofRequiredForF13: true,
    supportsVisibleProofRequiredForF21: true,
    supportsMarkerNotHydrationProof: true,

    ownsRouteConductorRuntime: true,
    ownsCanvasBootRequest: true,
    ownsCanvasReceiptReconciliation: true,
    ownsVisibleProofGovernance: true,
    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
    ownsNorthCheckpointTruth: false,
    ownsF21: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishEarlyMarker();
  publishGlobals();

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
