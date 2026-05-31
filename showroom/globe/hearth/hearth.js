// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_TNT_v1
// Full-file replacement.
// South route conductor / thin cardinal-Fibonacci conductor only.
// Canvas remains F13 evidence. F21 remains North/NEWS latch authority.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_VISUAL_PROOF_NEWS_FIBONACCI_SYNC_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-31.hearth-south-cardinal-fibonacci-thin-conductor-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const MAX_LOG = 80;
  const WATCHDOG_MS = 500;
  const WATCHDOG_LIMIT = 120;
  const CANVAS_BOOT_LIMIT = 6;

  const FILES = Object.freeze({
    index: "/showroom/globe/hearth/index.js",
    north: "/assets/lab/runtime-table.js",
    eastBranch: "/assets/lab/runtime-table.east.js",
    westBranch: "/assets/lab/runtime-table.west.js",
    southBranch: "/assets/lab/runtime-table.south.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

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
    "DEXTER_LAB.hearthCanvasEvidence"
  ]);

  const CHILD_NAMES = Object.freeze({
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
    south: ["composeTexture", "renderSphere", "renderSphereSync", "getTextureCanvas", "sampleVisibleContent", "classifyVisibleContentEvidence", "invalidateTexture", "getReceipt"]
  });

  const GATES = Object.freeze([
    ["F1_EAST_ROUTE_SHELL", "F1", "EAST", "Route shell"],
    ["F2_EAST_FIRST_PAINT", "F2", "EAST", "First paint"],
    ["F3_EAST_SCRIPT_ORDER", "F3", "EAST", "Script order"],
    ["F5_NORTH_AUTHORITY", "F5", "NORTH", "Authority availability"],
    ["F8_SOUTH_CONDUCTOR", "F8", "SOUTH", "Route conductor hydration"],
    ["F13A_CANVAS_PARENT", "F13A", "NORTH", "Canvas parent boot"],
    ["F13B_CANVAS_CHILDREN", "F13B", "EAST", "Canvas child readiness"],
    ["F13C_CANVAS_TEXTURE", "F13C", "SOUTH", "Texture composition"],
    ["F13D_CANVAS_FRAME", "F13D", "SOUTH", "First visible frame"],
    ["F13E_VISIBLE_PROOF", "F13E", "SOUTH", "Visible planet proof"],
    ["F13N_INSPECT_GATE", "F13N", "WEST", "Inspect gate"],
    ["F21_COMPLETION_LATCH", "F21", "NORTH", "NEWS completion latch"]
  ].map(([id, fib, cardinal, label], index) => ({ id, fib, cardinal, label, index })));

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-cardinal-fibonacci-thin-conductor",

    cardinalCircuitActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,
    oneActiveGearAtATime: true,
    markerIsNotHydrationProof: true,
    visualProofRequiredForF13: true,
    visualProofRequiredForF21: true,

    jobs: {
      north: ["checkpoint-session-read", "gate-order", "f21-latch-request"],
      east: ["index-recognition-read", "script-order-read", "canvas-source-child-read"],
      west: ["inspect-control-read", "diagnostic-dock-control", "receipt-access"],
      south: ["route-conductor-runtime", "canvas-parent-boot-request", "canvas-receipt-reconciliation", "visible-proof-governance"]
    },

    activeGateId: GATES[0].id,
    activeFibonacci: GATES[0].fib,
    activeCardinal: GATES[0].cardinal,
    activeProgress: 0,
    completedGates: [],
    degradedGates: [],
    blockedGates: [],
    gateLedger: [],

    auth: {
      index: false,
      north: false,
      east: false,
      west: false,
      south: false,
      session: false,
      sessionCreatedBySouth: false
    },

    conductor: {
      marker: false,
      api: false,
      receipt: false,
      runtime: false,
      hydrated: false,
      status: "MARKER_PENDING"
    },

    canvas: {
      parent: false,
      method: "",
      methodReady: false,
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
      signature: ""
    },

    dom: {
      mount: false,
      cockpit: false,
      planetCanvas: false,
      planetCanvasNonZero: false,
      visibleHint: false
    },

    inspect: {
      available: false,
      control: false,
      canLeaveFrame: false,
      dockRestorable: false,
      receiptReady: false,
      copyReady: false,
      strictReady: false,
      fallbackReady: false
    },

    completion: {
      latched: false,
      degraded: false,
      readyTextAllowed: false,
      f21LatchMode: "WAITING",
      newsStrict: false,
      newsDegraded: false
    },

    booted: false,
    booting: false,
    renderCount: 0,
    watchdogTicks: 0,
    latestEvent: "SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_LOADED",
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

  const refs = {};
  let bootPromise = null;
  let canvasBootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;

  function nowIso() {
    try { return new Date().toISOString(); } catch (_) { return ""; }
  }

  function fn(v) { return typeof v === "function"; }
  function obj(v) { return Boolean(v && typeof v === "object" && !Array.isArray(v)); }
  function str(v, f = "") { return v === undefined || v === null ? f : String(v); }
  function num(v, f = 0) { const n = Number(v); return Number.isFinite(n) ? n : f; }
  function bool(v, f = false) {
    if (typeof v === "boolean") return v;
    if (v === "true" || v === "1" || v === 1) return true;
    if (v === "false" || v === "0" || v === 0) return false;
    return f;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, num(v, a))); }
  function copy(v) { try { return JSON.parse(JSON.stringify(v)); } catch (_) { return v; } }
  function trim(a) { if (Array.isArray(a) && a.length > MAX_LOG) a.splice(0, a.length - MAX_LOG); }
  function addOnce(a, v) { if (!a.includes(v)) a.push(v); }

  function readPath(path) {
    let cur = root;
    for (const part of str(path).split(".")) {
      if (!cur || cur[part] === undefined || cur[part] === null) return null;
      cur = cur[part];
    }
    return cur || null;
  }

  function first(names) {
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

  function log(event, detail = {}) {
    const item = { at: nowIso(), event: str(event), detail: copy(detail) };
    state.localEvents.push(item);
    trim(state.localEvents);
    state.latestEvent = item.event;
    state.updatedAt = item.at;
    return item;
  }

  function err(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: str(code, "ERROR"),
      message: error && error.message ? String(error.message) : str(error),
      detail: copy(detail)
    };
    state.errors.push(item);
    trim(state.errors);
    state.latestEvent = item.code;
    state.updatedAt = item.at;
    return item;
  }

  function readReceipt(authority) {
    if (!obj(authority)) return null;
    if (fn(authority.getReceipt)) {
      try {
        const r = authority.getReceipt();
        return obj(r) ? r : null;
      } catch (_) {
        return null;
      }
    }
    if (obj(authority.receiptPacket)) return authority.receiptPacket;
    if (obj(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;
    return null;
  }

  function readIndex() {
    return first(["HEARTH_EAST_STEP1_IGNITION", "HEARTH_INDEX_BRIDGE", "HEARTH_INDEX_JS", "HEARTH.indexBridge", "HEARTH.eastStep1Ignition"]);
  }

  function readNorth() {
    return first(["LAB_RUNTIME_TABLE", "LAB_RUNTIME_TABLE_NORTH", "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE", "RUNTIME_TABLE", "DexterRuntimeTable", "DEXTER_LAB.runtimeTable"]);
  }

  function readBranch(side) {
    const names = {
      east: ["LAB_RUNTIME_TABLE_EAST", "RUNTIME_TABLE_EAST", "DEXTER_LAB_RUNTIME_TABLE_EAST", "LAB_CARDINAL_RUNTIME_TABLE_EAST", "DEXTER_LAB.runtimeTableEast", "DEXTER_LAB.cardinalRuntimeTableEast"],
      west: ["LAB_RUNTIME_TABLE_WEST", "RUNTIME_TABLE_WEST", "DEXTER_LAB_RUNTIME_TABLE_WEST", "LAB_CARDINAL_RUNTIME_TABLE_WEST", "DEXTER_LAB.runtimeTableWest", "DEXTER_LAB.cardinalRuntimeTableWest"],
      south: ["LAB_RUNTIME_TABLE_SOUTH", "RUNTIME_TABLE_SOUTH", "DEXTER_LAB_RUNTIME_TABLE_SOUTH", "LAB_CARDINAL_RUNTIME_TABLE_SOUTH", "HEARTH_VISIBLE_STATE_COMPOSER", "DEXTER_LAB.runtimeTableSouth", "DEXTER_LAB.visibleStateComposer"]
    };
    return first(names[side] || []);
  }

  function readSession() {
    return first(["HEARTH_CHECKPOINT_SESSION", "HEARTH_RUNTIME_CHECKPOINT_SESSION", "LAB_HEARTH_CHECKPOINT_SESSION", "LAB_CHECKPOINT_SESSION", "DEXTER_LAB.hearthCheckpointSession", "DEXTER_LAB.checkpointSession"]);
  }

  function ensureSession() {
    const existing = readSession();
    if (existing && (fn(existing.submitEvent) || fn(existing.submit) || fn(existing.completeActive))) {
      state.auth.session = true;
      return existing;
    }

    const north = readNorth();
    const east = readBranch("east");
    const creators = [
      north && north.createHearthCheckpointSession,
      north && north.createCheckpointSession,
      east && east.createHearthCheckpointSession,
      east && east.createCheckpointSession
    ].filter(fn);

    for (const create of creators) {
      try {
        const session = create({ planetId: "hearth", planetLabel: "Hearth", route: ROUTE });
        if (session && (fn(session.submitEvent) || fn(session.submit) || fn(session.completeActive))) {
          root.HEARTH_CHECKPOINT_SESSION = session;
          root.HEARTH_RUNTIME_CHECKPOINT_SESSION = session;
          root.LAB_HEARTH_CHECKPOINT_SESSION = session;
          root.DEXTER_LAB = root.DEXTER_LAB || {};
          root.DEXTER_LAB.hearthCheckpointSession = session;
          root.DEXTER_LAB.checkpointSession = session;
          state.auth.session = true;
          state.auth.sessionCreatedBySouth = true;
          log("SOUTH_CREATED_CHECKPOINT_SESSION", {});
          return session;
        }
      } catch (error) {
        err("CREATE_CHECKPOINT_SESSION_FAILED", error);
      }
    }

    state.auth.session = false;
    return null;
  }

  function readCanvasApi() {
    return first(CANVAS_PARENT_NAMES);
  }

  function readCanvasReceipt() {
    const apiObject = readCanvasApi();
    const apiReceipt = readReceipt(apiObject);
    if (apiReceipt) return apiReceipt;
    const fallback = first(["HEARTH_CANVAS_RECEIPT", "HEARTH_CANVAS_EVIDENCE_RECEIPT", "HEARTH_CANVAS_POSTGAME_RECEIPT", "HEARTH.canvasReceipt", "HEARTH.canvasEvidenceReceipt"]);
    return obj(fallback) ? fallback : {};
  }

  function readChild(key) {
    return first(CHILD_NAMES[key] || []);
  }

  function missingMethods(key, authority) {
    const required = CHILD_METHODS[key] || [];
    if (!authority) return required.slice();
    return required.filter((method) => !fn(authority[method]));
  }

  function canvasMethod(canvas) {
    if (!obj(canvas)) return "";
    if (fn(canvas.bootCooperative)) return "bootCooperative";
    if (fn(canvas.boot)) return "boot";
    if (fn(canvas.render)) return "render";
    if (fn(canvas.mount)) return "mount";
    return "";
  }

  function scanDom() {
    if (!doc) return;

    refs.mount = doc.getElementById("hearthCanvasMount") || doc.querySelector("[data-hearth-canvas-mount='true']") || doc.querySelector("[data-hearth-canvas-mount]");
    refs.cockpit = doc.getElementById("hearthLoadCockpit") || doc.querySelector("[data-hearth-load-cockpit='true']") || doc.querySelector("[data-hearth-first-paint-cockpit='true']");
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
    refs.showTab = doc.querySelector("[data-hearth-south-show-diagnostic-tab]") || doc.querySelector("[data-hearth-east-show-diagnostic-tab]") || doc.querySelector("[data-hearth-index-show-diagnostic-tab]");
    refs.status = doc.getElementById("hearth-route-status") || doc.querySelector("[data-hearth-route-status]");

    const canvas = refs.mount
      ? refs.mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");

    const rect = canvas && fn(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    const nonZero = Boolean(canvas && ((num(canvas.width) > 0 && num(canvas.height) > 0) || (rect && num(rect.width) > 0 && num(rect.height) > 0)));

    const visible = data("hearthCanvasReady") === "true" ||
      data("hearthCanvasVisiblePlanetAvailable") === "true" ||
      data("hearthCanvasVisibleContentProof") === "true" ||
      data("hearthCanvasSouthVisibleContentProof") === "true" ||
      data("hearthCanvasSouthImageRendered") === "true" ||
      data("hearthSouthVisiblePlanetAvailable") === "true";

    state.dom.mount = Boolean(refs.mount);
    state.dom.cockpit = Boolean(refs.cockpit);
    state.dom.planetCanvas = Boolean(canvas);
    state.dom.planetCanvasNonZero = nonZero;
    state.dom.visibleHint = Boolean(canvas && nonZero && visible);

    state.inspect.copyReady = Boolean(refs.copyButton);
    state.inspect.receiptReady = Boolean(refs.toggleButton || refs.receiptText || refs.receiptBox);
    state.inspect.control = Boolean(refs.inspectButton);
    state.inspect.available = Boolean(refs.inspectButton && refs.cockpit);
    state.inspect.dockRestorable = Boolean(refs.cockpit);
    state.inspect.canLeaveFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.inspect.strictReady = Boolean(state.inspect.available && state.inspect.canLeaveFrame && state.inspect.copyReady && state.inspect.receiptReady);
    state.inspect.fallbackReady = Boolean(state.inspect.copyReady || state.inspect.receiptReady || state.inspect.dockRestorable);

    bindControls();
  }

  function summarizeCanvas(receipt = readCanvasReceipt()) {
    const c = state.canvas;
    const parent = readCanvasApi();
    const east = readChild("east");
    const west = readChild("west");
    const south = readChild("south");

    const eastMissing = missingMethods("east", east);
    const westMissing = missingMethods("west", west);
    const southMissing = missingMethods("south", south);

    c.parent = Boolean(parent);
    c.method = canvasMethod(parent);
    c.methodReady = Boolean(c.method);

    c.contract = str(receipt.contract || data("hearthCanvasContract"), "");
    c.receipt = str(receipt.receipt || data("hearthCanvasReceipt"), "");
    c.splitContract = str(receipt.splitContract || data("hearthCanvasSplitContract"), "");
    c.splitReceipt = str(receipt.splitReceipt || data("hearthCanvasSplitReceipt"), "");

    c.eastPresent = bool(receipt.canvasEastPresent, Boolean(east));
    c.westPresent = bool(receipt.canvasWestPresent, Boolean(west));
    c.southPresent = bool(receipt.canvasSouthPresent, Boolean(south));
    c.eastReady = bool(receipt.canvasEastReady, Boolean(east && eastMissing.length === 0));
    c.westReady = bool(receipt.canvasWestReady, Boolean(west && westMissing.length === 0));
    c.southReady = bool(receipt.canvasSouthReady, Boolean(south && southMissing.length === 0));
    c.allChildrenReady = bool(receipt.allCanvasChildrenReady, c.eastReady && c.westReady && c.southReady);

    c.childGap = [
      eastMissing.length ? `east:${eastMissing.join(",")}` : "",
      westMissing.length ? `west:${westMissing.join(",")}` : "",
      southMissing.length ? `south:${southMissing.join(",")}` : ""
    ].filter(Boolean).join("; ");

    c.carrierRequested = bool(receipt.canvasCarrierRequested, bool(data("hearthCanvasCarrierRequested"), c.bootRequested));
    c.carrierMounted = bool(receipt.canvasCarrierMounted, bool(data("hearthCanvasCarrierMounted"), false));
    c.contextReady = bool(receipt.canvasContextReady, bool(data("hearthCanvasContextReady"), false));
    c.dragInspectionBound = bool(receipt.dragInspectionBound, bool(data("hearthCanvasDragInspectionBound"), false));
    c.zoomInspectionBound = bool(receipt.zoomInspectionBound, bool(data("hearthCanvasZoomInspectionBound"), false));
    c.atlasBuildStarted = bool(receipt.atlasBuildStarted, bool(data("hearthCanvasAtlasBuildStarted"), false));
    c.atlasBuildComplete = bool(receipt.atlasBuildComplete, bool(data("hearthCanvasAtlasBuildComplete"), false));
    c.textureComposeStarted = bool(receipt.textureComposeStarted, bool(data("hearthCanvasTextureComposeStarted"), false));
    c.textureComposeComplete = bool(receipt.textureComposeComplete, bool(data("hearthCanvasTextureComposeComplete"), false));
    c.firstFrameRequested = bool(receipt.firstFrameRequested, bool(data("hearthCanvasFirstFrameRequested"), false));
    c.firstFrameDetected = bool(receipt.firstFrameDetected, bool(data("hearthCanvasFirstFrameDetected"), false));
    c.canvasReady = bool(receipt.canvasReady, bool(data("hearthCanvasReady"), false));
    c.imageRendered = bool(receipt.imageRendered, bool(data("hearthCanvasImageRendered"), false));

    c.visibleContentProofStarted = bool(receipt.visibleContentProofStarted, bool(data("hearthCanvasVisibleContentProofStarted"), false));
    c.visibleContentProof = bool(receipt.visibleContentProof, bool(data("hearthCanvasVisibleContentProof"), false));
    c.visibleContentStrictProof = bool(receipt.visibleContentStrictProof, bool(data("hearthCanvasVisibleContentStrictProof"), false));
    c.visibleContentSoftGap = bool(receipt.visibleContentSoftGap, bool(data("hearthCanvasVisibleContentSoftGap"), false));
    c.visibleContentHardFail = bool(receipt.visibleContentHardFail, bool(data("hearthCanvasVisibleContentHardFail"), false));
    c.visibleForwardProgress = bool(receipt.visibleForwardProgress, bool(data("hearthCanvasVisibleForwardProgress"), false));
    c.visibleContentAdmissible = bool(receipt.visibleContentAdmissible, false);
    c.visiblePlanetAvailable = bool(receipt.visiblePlanetAvailable, bool(data("hearthCanvasVisiblePlanetAvailable"), false));

    const countProof = num(receipt.visibleContentClassCount) > 0 ||
      num(receipt.visibleContentLandSampleCount) > 0 ||
      num(receipt.visibleContentWaterSampleCount) > 0 ||
      num(receipt.visibleContentOtherSampleCount) > 0;

    c.visiblePlanetProofValid = Boolean(
      state.dom.planetCanvas &&
      state.dom.planetCanvasNonZero &&
      !c.visibleContentHardFail &&
      (
        c.visibleContentProof ||
        c.visibleContentStrictProof ||
        c.visibleContentSoftGap ||
        c.visibleForwardProgress ||
        c.visibleContentAdmissible ||
        c.visiblePlanetAvailable ||
        countProof ||
        (c.canvasReady && c.firstFrameDetected) ||
        (c.imageRendered && c.firstFrameDetected)
      )
    );

    c.bootComplete = Boolean(c.bootComplete || c.canvasReady || c.visiblePlanetProofValid || c.firstFrameDetected);
  }

  function refresh() {
    scanDom();

    state.auth.index = Boolean(readIndex());
    state.auth.north = Boolean(readNorth());
    state.auth.east = Boolean(readBranch("east"));
    state.auth.west = Boolean(readBranch("west"));
    state.auth.south = Boolean(readBranch("south"));
    state.auth.session = Boolean(readSession());

    state.conductor.marker = Boolean(root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ || data("hearthRouteConductorMarkerPresent") === "true");
    state.conductor.api = Boolean(first(["HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor", "HEARTH_SOUTH_ROUTE_CONDUCTOR", "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR", "HEARTH.southRouteConductor", "HEARTH.southCardinalFibonacciThinConductor", "DEXTER_LAB.hearthSouthRouteConductor"]));
    state.conductor.receipt = Boolean(first(["HEARTH_ROUTE_CONDUCTOR_RECEIPT", "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT", "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_RECEIPT", "HEARTH.southRouteConductorReceipt", "HEARTH.southCardinalFibonacciThinConductorReceipt", "DEXTER_LAB.hearthSouthRouteConductorReceipt"]));
    state.conductor.runtime = Boolean(state.booting || state.booted || state.conductor.api);
    state.conductor.hydrated = Boolean(state.conductor.api && state.conductor.receipt && state.conductor.runtime);
    state.conductor.status = state.conductor.hydrated ? "API_RECEIPT_RUNTIME_PRESENT" : state.conductor.marker ? "MARKER_PRESENT_API_PENDING" : "MARKER_PENDING";

    summarizeCanvas(readCanvasReceipt());
    evaluateGates();
    updateDataset();

    return getReceiptLight(false);
  }

  function evaluateNews() {
    const c = state.canvas;
    const north = Boolean(state.auth.north || state.auth.session);
    const east = Boolean(state.auth.index || doc);
    const west = Boolean(state.inspect.strictReady || state.inspect.fallbackReady);
    const south = Boolean(state.conductor.hydrated && c.visiblePlanetProofValid && !c.visibleContentHardFail);

    const strict = Boolean(north && east && west && south && state.inspect.strictReady && c.visibleContentStrictProof && c.allChildrenReady);
    const degraded = Boolean(strict || (north && east && west && south));

    state.completion.newsStrict = strict;
    state.completion.newsDegraded = degraded && !strict;

    return { strict, degraded: degraded && !strict, north, east, west, south };
  }

  function gateStatus(gate) {
    const c = state.canvas;

    switch (gate.id) {
      case "F1_EAST_ROUTE_SHELL":
        return { ok: Boolean(doc), progress: doc ? 100 : 20, reason: doc ? "document-present" : "document-missing" };

      case "F2_EAST_FIRST_PAINT":
        return { ok: Boolean(doc && (state.dom.cockpit || doc.body || doc.documentElement)), degraded: Boolean(doc && !state.dom.cockpit), progress: state.dom.cockpit ? 100 : doc ? 80 : 20, reason: state.dom.cockpit ? "cockpit-present" : "document-shell-present" };

      case "F3_EAST_SCRIPT_ORDER":
        return { ok: Boolean(state.auth.index || doc), degraded: !state.auth.index, progress: state.auth.index ? 100 : 75, reason: state.auth.index ? "index-api-present" : "page-shell-script-order-fallback" };

      case "F5_NORTH_AUTHORITY":
        return { ok: Boolean(state.auth.north || readSession()), degraded: !state.auth.north, progress: state.auth.north ? 100 : 70, reason: state.auth.north ? "north-present" : "north-session-fallback" };

      case "F8_SOUTH_CONDUCTOR":
        return { ok: state.conductor.hydrated, progress: state.conductor.hydrated ? 100 : state.conductor.marker ? 45 : 20, reason: state.conductor.status };

      case "F13A_CANVAS_PARENT":
        return { ok: Boolean(c.parent && c.methodReady && c.bootRequested), degraded: Boolean(c.bootRequested && !c.bootResolved), progress: c.bootRequested ? 100 : c.parent ? 75 : 20, reason: c.parent ? `parent-method=${c.method || "missing"}` : "canvas-parent-missing" };

      case "F13B_CANVAS_CHILDREN":
        return { ok: Boolean(c.allChildrenReady || (c.eastPresent && c.westPresent && c.southPresent)), degraded: !c.allChildrenReady, progress: c.allChildrenReady ? 100 : (c.eastPresent || c.westPresent || c.southPresent) ? 70 : 25, reason: c.allChildrenReady ? "all-canvas-children-ready" : c.childGap || "canvas-children-pending" };

      case "F13C_CANVAS_TEXTURE":
        return { ok: Boolean(c.textureComposeComplete || c.atlasBuildComplete), degraded: !c.textureComposeComplete, progress: c.textureComposeComplete ? 100 : c.atlasBuildComplete ? 80 : c.textureComposeStarted ? 55 : 25, reason: c.textureComposeComplete ? "texture-complete" : "texture-pending" };

      case "F13D_CANVAS_FRAME":
        return { ok: Boolean(c.firstFrameDetected || c.imageRendered || (state.dom.planetCanvas && state.dom.planetCanvasNonZero && c.canvasReady)), degraded: !(c.firstFrameDetected || c.imageRendered), progress: c.firstFrameDetected ? 100 : c.imageRendered ? 95 : state.dom.planetCanvasNonZero ? 70 : 25, reason: c.firstFrameDetected ? "first-frame-detected" : "frame-pending" };

      case "F13E_VISIBLE_PROOF":
        if (c.visibleContentHardFail) return { ok: false, hard: true, progress: 0, reason: "visible-content-hard-fail" };
        return { ok: c.visiblePlanetProofValid, degraded: c.visiblePlanetProofValid && (c.visibleContentSoftGap || !c.visibleContentStrictProof), progress: c.visiblePlanetProofValid ? 100 : state.dom.planetCanvasNonZero ? 60 : 20, reason: c.visiblePlanetProofValid ? c.visibleContentStrictProof ? "strict-visible-proof" : "visible-proof-soft-or-dom-reconciled" : "visible-proof-pending" };

      case "F13N_INSPECT_GATE":
        return { ok: Boolean(state.inspect.strictReady || state.inspect.fallbackReady), degraded: !state.inspect.strictReady, progress: state.inspect.strictReady ? 100 : state.inspect.fallbackReady ? 80 : 35, reason: state.inspect.strictReady ? "strict-inspect-ready" : state.inspect.fallbackReady ? "receipt-inspect-fallback-ready" : "inspect-pending" };

      case "F21_COMPLETION_LATCH": {
        const news = evaluateNews();
        if (!c.visiblePlanetProofValid) return { ok: false, hard: true, progress: 0, reason: "F21_BLOCKED_VISIBLE_PLANET_PROOF_MISSING" };
        return { ok: news.strict || news.degraded, degraded: news.degraded && !news.strict, progress: news.strict || news.degraded ? 100 : 70, reason: news.strict ? "news-gates-passed" : news.degraded ? "news-gates-degraded" : "news-gates-pending" };
      }

      default:
        return { ok: false, progress: 0, reason: "unknown-gate" };
    }
  }

  function evaluateGates() {
    const ledger = GATES.map((gate) => {
      const status = gateStatus(gate);
      return {
        ...gate,
        ok: status.ok === true,
        degraded: status.degraded === true,
        hard: status.hard === true,
        progress: clamp(status.progress, 0, 100),
        reason: status.reason || ""
      };
    });

    state.gateLedger = ledger;

    let next = 0;

    for (let i = 0; i < ledger.length; i += 1) {
      const gate = ledger[i];

      if (!gate.ok) {
        next = i;
        if (gate.hard) addOnce(state.blockedGates, gate.id);
        break;
      }

      if (!state.completedGates.includes(gate.id)) {
        state.completedGates.push(gate.id);
        if (gate.degraded) addOnce(state.degradedGates, gate.id);
        log("GATE_COMPLETED", { id: gate.id, fib: gate.fib, cardinal: gate.cardinal, degraded: gate.degraded, reason: gate.reason });
        submitToNorth(gate);
      }

      next = Math.min(i + 1, ledger.length - 1);
    }

    const active = ledger[next] || ledger[0];

    state.activeGateId = active.id;
    state.activeFibonacci = active.fib;
    state.activeCardinal = active.cardinal;
    state.activeProgress = active.progress;

    if (state.completedGates.length === GATES.length && state.canvas.visiblePlanetProofValid) {
      state.completion.latched = true;
      state.completion.degraded = state.degradedGates.length > 0;
      state.completion.readyTextAllowed = true;
      state.completion.f21LatchMode = state.completion.degraded ? "DEGRADED" : "FULL";
      state.postgameStatus = state.completion.degraded ? "READY_DEGRADED_VISIBLE_PLANET_NEWS_SYNCHRONIZED" : "READY_VISIBLE_PLANET_NEWS_SYNCHRONIZED";
      state.firstFailedCoordinate = state.completion.degraded ? "DEGRADED_F21_LATCHED" : "NONE_F21_LATCHED";
      state.recommendedNextRenewalTarget = "read-postgame-receipt";
    } else {
      state.completion.latched = false;
      state.completion.readyTextAllowed = false;
      state.completion.f21LatchMode = active.id === "F21_COMPLETION_LATCH" ? "BLOCKED_OR_WAITING" : "WAITING";
      state.postgameStatus = active.hard ? "BLOCKED_BY_ACTIVE_GATE" : "WAITING_ACTIVE_GATE";
      state.firstFailedCoordinate = `WAITING_${active.id}`;
      state.recommendedNextRenewalTarget = active.id.startsWith("F13") ? FILES.canvas : FILE;
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
      source: "hearth.south.cardinalFibonacciThinConductor",
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        gate: copy(gate),
        markerIsNotHydrationProof: true,
        visualProofRequiredForF13: true,
        visualProofRequiredForF21: true,
        canvasOwnsF13Only: true,
        southOwnsRouteConductorRuntime: true,
        visualPassClaimed: false
      }
    };

    try {
      if (fn(session.submitEvent)) return session.submitEvent(payload);
      if (fn(session.submit)) return session.submit(payload);
      if (fn(session.completeActive)) return session.completeActive(payload);
    } catch (error) {
      err("NORTH_GATE_SUBMIT_FAILED", error, { gate: gate.id });
    }

    return false;
  }

  function canvasSignature(receipt) {
    const keys = ["contract", "receipt", "splitContract", "splitReceipt", "canvasCarrierRequested", "canvasCarrierMounted", "canvasContextReady", "canvasEastReady", "canvasWestReady", "canvasSouthReady", "allCanvasChildrenReady", "atlasBuildComplete", "textureComposeComplete", "firstFrameDetected", "canvasReady", "imageRendered", "visibleContentProofStarted", "visibleContentProof", "visibleContentStrictProof", "visibleContentSoftGap", "visibleContentHardFail", "visibleForwardProgress", "visibleContentAdmissible", "visiblePlanetAvailable"];
    return keys.map((key) => `${key}:${str(receipt && receipt[key], "")}`).join("|");
  }

  function reconcileCanvas(force = false) {
    const receipt = readCanvasReceipt();
    const signature = canvasSignature(receipt);
    if (!force && signature && signature === state.canvas.signature) return getReceiptLight(false);

    state.canvas.signature = signature;
    summarizeCanvas(receipt);
    evaluateGates();
    updateDataset();
    scheduleRender();

    return getReceiptLight(false);
  }

  function bootCanvas(reason = "south-cardinal-boot") {
    if (canvasBootPromise || state.canvas.bootComplete || state.completion.latched) {
      return canvasBootPromise || Promise.resolve(readCanvasReceipt());
    }

    refresh();

    if (!state.conductor.hydrated) {
      state.canvas.bootError = "waiting-f8-route-conductor-hydration";
      state.postgameStatus = "CANVAS_BOOT_WAITING_FOR_F8";
      state.recommendedNextRenewalTarget = FILE;
      return Promise.resolve(null);
    }

    const canvas = readCanvasApi();
    const method = canvasMethod(canvas);

    if (!canvas || !method) {
      state.canvas.bootError = !canvas ? "canvas-parent-api-missing" : "canvas-parent-boot-method-missing";
      state.postgameStatus = !canvas ? "WAITING_FOR_CANVAS_PARENT_API" : "WAITING_FOR_CANVAS_PARENT_BOOT_METHOD";
      state.recommendedNextRenewalTarget = FILES.canvas;
      log("CANVAS_PARENT_WAITING", { reason, error: state.canvas.bootError });
      return Promise.resolve(null);
    }

    state.canvas.bootRequested = true;
    state.canvas.bootStarted = true;
    state.canvas.bootAttempts += 1;
    state.canvas.bootError = "";

    log("CANVAS_PARENT_BOOT_REQUESTED", { reason, method, attempt: state.canvas.bootAttempts });

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
        err("CANVAS_PARENT_BOOT_ERROR", state.canvas.bootError);
        reconcileCanvas(true);
      },
      onPhase: () => reconcileCanvas(true)
    };

    try {
      canvasBootPromise = Promise.resolve(canvas[method](options))
        .then((result) => {
          canvasBootPromise = null;
          state.canvas.bootResolved = true;
          summarizeCanvas(obj(result) ? result : readCanvasReceipt());
          state.canvas.bootComplete = Boolean(state.canvas.bootComplete || state.canvas.canvasReady || state.canvas.visiblePlanetProofValid || state.canvas.firstFrameDetected);
          reconcileCanvas(true);
          return result;
        })
        .catch((error) => {
          canvasBootPromise = null;
          state.canvas.bootRejected = true;
          state.canvas.bootError = error && error.message ? error.message : String(error || "canvas-boot-failed");
          err("CANVAS_PARENT_BOOT_FAILED", state.canvas.bootError);
          reconcileCanvas(true);
          return null;
        });

      return canvasBootPromise;
    } catch (error) {
      canvasBootPromise = null;
      state.canvas.bootRejected = true;
      state.canvas.bootError = error && error.message ? error.message : String(error || "canvas-boot-sync-failed");
      err("CANVAS_PARENT_BOOT_SYNC_FAILED", state.canvas.bootError);
      reconcileCanvas(true);
      return Promise.resolve(null);
    }
  }

  function onCanvasPhase(event) {
    const detail = event && event.detail ? event.detail : {};
    const phase = detail.event && (detail.event.event || detail.event.phase || detail.event.id)
      ? detail.event.event || detail.event.phase || detail.event.id
      : "CANVAS_PHASE";
    log("CANVAS_PHASE_RECEIVED", { phase });
    reconcileCanvas(true);
  }

  function bindControls() {
    if (!doc) return;

    if (refs.copyButton && !refs.copyButton.dataset.hearthSouthThinConductorBound) {
      refs.copyButton.dataset.hearthSouthThinConductorBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && !refs.toggleButton.dataset.hearthSouthThinConductorBound) {
      refs.toggleButton.dataset.hearthSouthThinConductorBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox ? refs.receiptBox.dataset.visible !== "true" : true;
        if (refs.receiptBox) refs.receiptBox.dataset.visible = String(visible);
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthSouthThinConductorBound) {
      refs.inspectButton.dataset.hearthSouthThinConductorBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const active = !(doc.documentElement.dataset.hearthSouthPlanetInspect === "true");
        setInspectMode(active);
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthThinConductorBound) {
      refs.showTab.dataset.hearthSouthThinConductorBound = "true";
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

    log(active ? "SOUTH_INSPECT_MODE_ACTIVE" : "SOUTH_INSPECT_MODE_RELEASED", { active });
    refresh();
    render();

    return getReceipt();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && fn(root.navigator.clipboard.writeText)) {
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
        root.setTimeout(() => { refs.copyButton.textContent = prior; }, 900);
      }

      return true;
    } catch (error) {
      err("COPY_DIAGNOSTIC_FAILED", error);
      return false;
    }
  }

  function renderLanes() {
    return state.gateLedger.map((gate) => {
      const status = state.completedGates.includes(gate.id)
        ? state.degradedGates.includes(gate.id) ? "DEGRADED" : "COMPLETE"
        : gate.id === state.activeGateId ? gate.hard ? "BLOCKED" : "ACTIVE" : "PENDING";

      const progress = status === "COMPLETE" || status === "DEGRADED" ? 100 : gate.id === state.activeGateId ? gate.progress : 0;

      return `<section class="hearth-ledger-lane" data-lane="${gate.id}" data-status="${status}"><div class="hearth-ledger-lane-top"><span class="hearth-ledger-lane-title"><strong>${gate.fib} · ${gate.label}</strong><span>${gate.cardinal}</span></span><span class="hearth-ledger-lane-status">${status}</span></div><div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div></section>`;
    }).join("");
  }

  function render() {
    if (!doc) return;

    state.renderCount += 1;

    const gate = state.gateLedger.find((g) => g.id === state.activeGateId) || GATES[0];
    const title = state.completion.latched ? "Ready" : `${gate.fib} · ${gate.label}`;

    if (refs.stage) refs.stage.textContent = `${gate.cardinal} · ${gate.fib}`;
    if (refs.heartbeat) refs.heartbeat.textContent = title;
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

      if (state.conductor.hydrated && !state.canvas.bootComplete && state.canvas.bootAttempts < CANVAS_BOOT_LIMIT) {
        bootCanvas("watchdog");
      }

      reconcileCanvas();
      render();

      if (state.completion.latched || state.watchdogTicks >= WATCHDOG_LIMIT) {
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
      state.postgameStatus = "BOOTING_CARDINAL_FIBONACCI_THIN_CONDUCTOR";

      publishGlobals();
      refresh();
      ensureSession();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      state.booting = false;
      state.booted = true;
      state.conductor.runtime = true;

      publishGlobals();
      refresh();
      render();

      root.setTimeout(() => bootCanvas("initial"), 80);
      startWatchdog();

      log("SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_BOOTED", { route: ROUTE });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) root.clearInterval(watchdogTimer);
    if (renderTimer) root.clearTimeout(renderTimer);
    watchdogTimer = 0;
    renderTimer = 0;

    if (root.removeEventListener) root.removeEventListener("hearth:canvas-phase", onCanvasPhase);

    log("SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_DISPOSED", { reason });
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
      oneActiveGearAtATime: true,
      markerIsNotHydrationProof: true,
      visualProofRequiredForF13: true,
      visualProofRequiredForF21: true,

      activeGateId: state.activeGateId,
      activeFibonacci: state.activeFibonacci,
      activeCardinal: state.activeCardinal,
      activeProgress: state.activeProgress,
      completedGates: state.completedGates.slice(),
      degradedGates: state.degradedGates.slice(),
      blockedGates: state.blockedGates.slice(),

      indexPresent: state.auth.index,
      northPresent: state.auth.north,
      eastBranchPresent: state.auth.east,
      westBranchPresent: state.auth.west,
      southBranchPresent: state.auth.south,
      sessionPresent: state.auth.session,
      sessionCreatedBySouth: state.auth.sessionCreatedBySouth,

      routeConductorMarkerPresent: state.conductor.marker,
      routeConductorApiPresent: state.conductor.api,
      routeConductorReceiptPresent: state.conductor.receipt,
      routeConductorRuntimeActive: state.conductor.runtime,
      routeConductorHydrated: state.conductor.hydrated,
      routeConductorRecognitionStatus: state.conductor.status,

      canvasParentPresent: state.canvas.parent,
      canvasParentBootMethodAvailable: state.canvas.methodReady,
      canvasParentBootMethod: state.canvas.method,
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

      atlasBuildComplete: state.canvas.atlasBuildComplete,
      textureComposeComplete: state.canvas.textureComposeComplete,
      firstFrameDetected: state.canvas.firstFrameDetected,
      canvasReady: state.canvas.canvasReady,
      imageRendered: state.canvas.imageRendered,

      planetCanvasPresent: state.dom.planetCanvas,
      planetCanvasNonZeroSize: state.dom.planetCanvasNonZero,
      visiblePlanetHintPresent: state.dom.visibleHint,
      visibleContentProofStarted: state.canvas.visibleContentProofStarted,
      visibleContentProof: state.canvas.visibleContentProof,
      visibleContentStrictProof: state.canvas.visibleContentStrictProof,
      visibleContentSoftGap: state.canvas.visibleContentSoftGap,
      visibleContentHardFail: state.canvas.visibleContentHardFail,
      visibleForwardProgress: state.canvas.visibleForwardProgress,
      visibleContentAdmissible: state.canvas.visibleContentAdmissible,
      visiblePlanetAvailable: state.canvas.visiblePlanetAvailable,
      visiblePlanetProofValid: state.canvas.visiblePlanetProofValid,

      inspectModeAvailable: state.inspect.available,
      inspectPlanetControlAvailable: state.inspect.control,
      diagnosticCanLeavePlanetFrame: state.inspect.canLeaveFrame,
      receiptToggleReady: state.inspect.receiptReady,
      copyDiagnosticReady: state.inspect.copyReady,
      inspectStrictReady: state.inspect.strictReady,
      inspectFallbackReady: state.inspect.fallbackReady,

      completionLatched: state.completion.latched,
      degradedCompletionLatched: state.completion.degraded,
      readyTextAllowed: state.completion.readyTextAllowed,
      f21LatchMode: state.completion.f21LatchMode,
      newsGatePassed: state.completion.newsStrict,
      newsGateDegraded: state.completion.newsDegraded,

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
      files: copy(FILES),
      jobs: copy(state.jobs),
      gateLedger: copy(state.gateLedger),
      localEvents: copy(state.localEvents),
      errors: copy(state.errors),
      startedAt: state.startedAt
    };
  }

  function getStatusText() {
    const r = getReceiptLight(false);
    return [
      "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_STATUS",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `activeGateId=${r.activeGateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeProgress=${r.activeProgress}`,
      `routeConductorHydrated=${r.routeConductorHydrated}`,
      `routeConductorRecognitionStatus=${r.routeConductorRecognitionStatus}`,
      `canvasParentPresent=${r.canvasParentPresent}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
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
    const gates = r.gateLedger.map((g) => `- ${g.id} :: ${g.cardinal} :: ${g.fib} :: ok=${g.ok} :: degraded=${g.degraded} :: progress=${g.progress} :: ${g.reason}`).join("\n") || "- none";
    const errors = r.errors.map((e) => `- ${e.at} :: ${e.code} :: ${e.message}`).join("\n") || "- none";

    return [
      "HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_RECEIPT",
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
      `activeGateId=${r.activeGateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeProgress=${r.activeProgress}`,
      `completedGates=${r.completedGates.join(" > ") || "none"}`,
      `degradedGates=${r.degradedGates.join(" > ") || "none"}`,
      `blockedGates=${r.blockedGates.join(" > ") || "none"}`,
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
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `startedAt=${r.startedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const d = doc.documentElement.dataset;

    d.hearthRouteConductorMarkerPresent = "true";
    d.hearthRouteConductorLoaded = "true";
    d.hearthRouteConductorPresent = "true";
    d.hearthRouteConductorContract = CONTRACT;
    d.hearthRouteConductorReceipt = RECEIPT;
    d.hearthRouteConductorVersion = VERSION;
    d.hearthRouteConductorMarkerIsHydrationProof = "false";

    d.hearthSouthRouteConductorLoaded = "true";
    d.hearthSouthRouteConductorPresent = "true";
    d.hearthSouthRouteConductorContract = CONTRACT;
    d.hearthSouthRouteConductorReceipt = RECEIPT;
    d.hearthSouthCardinalFibonacciThinConductor = "true";

    d.hearthSouthActiveGateId = state.activeGateId;
    d.hearthSouthActiveFibonacci = state.activeFibonacci;
    d.hearthSouthActiveCardinal = state.activeCardinal;
    d.hearthSouthActiveProgress = String(state.activeProgress);
    d.hearthSouthRouteConductorHydrated = String(state.conductor.hydrated);
    d.hearthSouthRouteConductorRecognitionStatus = state.conductor.status;
    d.hearthSouthCanvasBootRequested = String(state.canvas.bootRequested);
    d.hearthSouthAllCanvasChildrenReady = String(state.canvas.allChildrenReady);
    d.hearthSouthVisiblePlanetProofValid = String(state.canvas.visiblePlanetProofValid);
    d.hearthSouthCompletionLatched = String(state.completion.latched);
    d.hearthSouthF21LatchMode = state.completion.f21LatchMode;
    d.hearthSouthPostgameStatus = state.postgameStatus;
    d.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    d.hearthSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    d.generatedImage = "false";
    d.graphicBox = "false";
    d.webgl = "false";
    d.visualPassClaimed = "false";
  }

  function publishMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;

    state.conductor.marker = true;
    state.conductor.status = "MARKER_PRESENT_API_PENDING";
    updateDataset();
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southCardinalFibonacciThinConductor = api;
    root.HEARTH.southVisibleCompletion = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthCardinalFibonacciThinConductor = api;

    state.conductor.api = true;
    state.conductor.receipt = true;
    state.conductor.runtime = true;
    state.conductor.hydrated = true;
    state.conductor.status = "API_RECEIPT_RUNTIME_PRESENT";

    const light = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_CARDINAL_FIBONACCI_THIN_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = light;

    root.HEARTH.routeConductorReceipt = light;
    root.HEARTH.southRouteConductorReceipt = light;
    root.HEARTH.southCardinalFibonacciThinConductorReceipt = light;
    root.HEARTH.southVisibleCompletionReceipt = light;

    root.DEXTER_LAB.hearthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthCardinalFibonacciThinConductorReceipt = light;

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
    role: "south-cardinal-fibonacci-thin-conductor",

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

    supportsCardinalCircuit: true,
    supportsFibonacciSynchronization: true,
    supportsThinConductor: true,
    supportsParentCanvasBoot: true,
    supportsVisibleProofRequiredForF21: true,
    supportsMarkerNotHydrationProof: true,

    ownsRouteConductorRuntime: true,
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

    get state() { return state; }
  };

  publishMarker();
  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
