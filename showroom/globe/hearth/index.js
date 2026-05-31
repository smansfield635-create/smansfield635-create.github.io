// /showroom/globe/hearth/index.js
// HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_TNT_v1
// Full-file replacement.
// East route ignition / route-conductor request-admission authority only.
// Purpose:
// - Preserve Step 1 ignition, first paint, mount certainty, loading cockpit, early shared ledger, and route-safe script-order visibility.
// - Correct the marker-only route-conductor false-loaded state.
// - Separate marker observation from script request, script presence, script load, API publication, receipt publication, and hydration.
// - Force /showroom/globe/hearth/hearth.js to be requested when only the route-conductor marker exists.
// - Prevent marker-only recognition from satisfying F8 route-conductor hydration.
// - Preserve NEWS order and Fibonacci synchronization.
// - Keep render(), getReceipt(), and getReceiptText() read-only relative to downstream truth.
// - Prevent render -> ledger -> render recursion.
// - Use idempotent ledger writes and narrow timers.
// Does not own:
// - North Runtime Table public precedent
// - East branch magnifier/checkpoint-motion truth
// - West gap classification truth
// - South visible-state composition truth
// - South route-conductor runtime
// - canvas drawing
// - atlas painting
// - source/channel truth
// - final visual pass claim
// - F21 completion latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_TNT_v1";
  const RECEIPT = "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_ROUTE_CONDUCTOR_ALIAS_STABLE_HANDOFF_RECOGNITION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-31.hearth-east-route-conductor-request-hydration-admission-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const EAST_ROUTE_FILE = "/showroom/globe/hearth/index.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_BRANCH_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_BRANCH_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_BRANCH_FILE = "/assets/lab/runtime-table.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";
  const STYLE_ID = "hearth-east-route-conductor-request-hydration-admission-style-v1";

  const CYCLE_ORDER = "EAST_ROUTE -> NORTH -> EAST_BRANCH -> WEST -> SOUTH -> CANVAS -> ROUTE_CONDUCTOR -> CHECKPOINT -> NORTH";

  const REQUESTED = Object.create(null);
  const SCRIPT_LOADED = Object.create(null);

  const SCRIPT_DEFS = Object.freeze([
    {
      key: "north",
      label: "North Runtime Table",
      direction: "NORTH",
      file: NORTH_FILE,
      required: true,
      globals: [
        "LAB_RUNTIME_TABLE",
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
        "LAB_CHECKPOINT_GOVERNOR",
        "LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR",
        "DexterRuntimeTable",
        "RUNTIME_TABLE",
        "DEXTER_LAB.runtimeTable"
      ]
    },
    {
      key: "eastBranch",
      label: "East Branch",
      direction: "EAST_BRANCH",
      file: EAST_BRANCH_FILE,
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE_EAST",
        "LAB_CARDINAL_RUNTIME_TABLE_EAST",
        "LAB_CHECKPOINT_GOVERNOR_EAST",
        "LAB_TRANSMISSION_MOTION_EAST",
        "RUNTIME_TABLE_EAST",
        "DEXTER_LAB_RUNTIME_TABLE_EAST",
        "DEXTER_LAB.runtimeTableEast",
        "DEXTER_LAB.cardinalRuntimeTableEast",
        "DEXTER_LAB.transmissionMotionEast"
      ]
    },
    {
      key: "west",
      label: "West Gap Classifier",
      direction: "WEST",
      file: WEST_BRANCH_FILE,
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "LAB_GAP_CLASSIFIER_WEST",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB_RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.gapClassifierWest"
      ]
    },
    {
      key: "south",
      label: "South Visible-State Composer",
      direction: "SOUTH",
      file: SOUTH_BRANCH_FILE,
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE_SOUTH",
        "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
        "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
        "HEARTH_RUNTIME_TABLE_SOUTH",
        "HEARTH_VISIBLE_STATE_COMPOSER",
        "RUNTIME_TABLE_SOUTH",
        "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
        "DEXTER_LAB.runtimeTableSouth",
        "DEXTER_LAB.cardinalRuntimeTableSouth",
        "DEXTER_LAB.visibleStateComposer",
        "DEXTER_LAB.transmissionVisibleStateComposer"
      ]
    },
    {
      key: "canvas",
      label: "Hearth Canvas Evidence",
      direction: "CANVAS",
      file: CANVAS_FILE,
      required: false,
      globals: [
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_AUTHORITY",
        "HEARTH_CANVAS_EVIDENCE",
        "HEARTH_CANVAS_TEXTURE",
        "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
        "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
        "HEARTH.canvas",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasEvidence",
        "HEARTH.canvasNorth",
        "DEXTER_LAB.hearthCanvasEvidence",
        "DEXTER_LAB.hearthCanvasPhysicalCarrierF13ProofParent"
      ],
      receiptGlobals: [
        "HEARTH_CANVAS_RECEIPT",
        "HEARTH_CANVAS_EVIDENCE_RECEIPT",
        "HEARTH_CANVAS_POSTGAME_RECEIPT",
        "HEARTH.canvasReceipt",
        "HEARTH.canvasEvidenceReceipt"
      ]
    },
    {
      key: "routeConductor",
      label: "Hearth Route Conductor",
      direction: "ROUTE_CONDUCTOR",
      file: ROUTE_CONDUCTOR_FILE,
      required: false,
      globals: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH_SOUTH_VISIBLE_COMPLETION",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF",
        "HEARTH_SOUTH_SELF_DUTY_NEWS_FIBONACCI_HANDOFF",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductor",
        "HEARTH.southVisibleCompletion",
        "HEARTH.southRouteConductorSelfDutyHandoff",
        "HEARTH.southSelfDutyNewsFibonacciHandoff",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor",
        "DEXTER_LAB.hearthSouthVisibleCompletion",
        "DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoff"
      ],
      receiptGlobals: [
        "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_RECEIPT",
        "HEARTH_SOUTH_SELF_DUTY_NEWS_FIBONACCI_HANDOFF_RECEIPT",
        "HEARTH.routeConductorReceipt",
        "HEARTH.southRouteConductorReceipt",
        "HEARTH.southVisibleCompletionReceipt",
        "HEARTH.southRouteConductorSelfDutyHandoffReceipt",
        "DEXTER_LAB.hearthRouteConductorReceipt",
        "DEXTER_LAB.hearthSouthRouteConductorReceipt",
        "DEXTER_LAB.hearthSouthVisibleCompletionReceipt",
        "DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoffReceipt"
      ],
      datasetMarkers: [
        "hearthRouteConductorMarkerPresent",
        "hearthRouteConductorLoaded",
        "hearthRouteConductorPresent",
        "hearthRouteConductorContract",
        "hearthRouteConductorReceipt",
        "hearthSouthRouteConductorLoaded",
        "hearthSouthRouteConductorPresent",
        "hearthSouthRouteConductorContract",
        "hearthSouthRouteConductorReceipt",
        "hearthSouthSelfDutyNewsFibonacciHandoff",
        "hearthSouthRouteConductorHydrated"
      ]
    }
  ]);

  const LANE_DEFS = Object.freeze([
    { key: "eastRoute", label: "East route ignition", owner: "EAST_ROUTE" },
    { key: "north", label: "North Runtime Table", owner: "NORTH" },
    { key: "eastBranch", label: "East branch", owner: "EAST_BRANCH" },
    { key: "west", label: "West gap classifier", owner: "WEST" },
    { key: "south", label: "South visible composer", owner: "SOUTH" },
    { key: "canvas", label: "Canvas evidence", owner: "CANVAS" },
    { key: "routeConductor", label: "Route conductor", owner: "ROUTE_CONDUCTOR" },
    { key: "checkpoint", label: "Cycle checkpoint", owner: "NORTH" }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: EAST_ROUTE_FILE,
    route: ROUTE,
    role: "east-route-conductor-request-hydration-admission",

    routeConductorRequestHydrationAdmissionActive: true,
    markerOnlyRequestRequiredActive: true,
    markerIsNotLoadedProof: true,
    markerIsNotHydrationProof: true,
    routeConductorHydrationRequiresApiAndReceipt: true,
    dottedGlobalPathRecognitionActive: true,
    receiptFallbackRecognitionActive: true,
    stableHandoffHashActive: true,
    loadedAliasPendingNotHardError: true,

    cycleOrder: CYCLE_ORDER,
    currentGear: "EAST_ROUTE",
    currentGearLabel: "East route ignition",
    currentGearProgress: 0,
    latestEvent: "EAST_ROUTE_FILE_LOADED",

    bootStarted: false,
    bootComplete: false,
    disposed: false,

    mountReady: false,
    mountCreatedByEast: false,
    cockpitReady: false,
    cockpitCreatedByEast: false,
    firstPaintReady: false,
    loadingScreenReady: false,
    visibleProgressStripReady: false,

    sharedLedgerPresent: false,
    sharedLedgerCreatedByEast: false,
    partialReceiptAvailable: false,
    copyPartialDiagnosticReady: false,
    receiptToggleReady: false,
    inspectControlReserved: false,
    inspectModeReservedActive: false,
    showDiagnosticRestoreReserved: false,
    showDiagnosticTabVisible: false,

    step1Ignited: false,
    step1Ready: false,
    step1HandoffPublished: false,
    step1HandoffHash: "",
    step1HandoffAcceptedByNorth: false,
    step1HandoffAcceptedByWest: false,
    step1HandoffAcceptedAt: "",
    handoffPublishCount: 0,

    scriptOrderStarted: false,
    scriptOrderComplete: false,
    scriptOrderSettled: false,
    downstreamRequiredReady: false,
    downstreamOptionalReady: false,

    scriptStatus: {},
    scriptErrors: [],

    northPresent: false,
    northContract: "",
    northReceiptPresent: false,

    eastBranchPresent: false,
    eastBranchContract: "",
    eastBranchReceiptPresent: false,

    westPresent: false,
    westContract: "",
    westReceiptPresent: false,

    southPresent: false,
    southContract: "",
    southReceiptPresent: false,

    canvasPresent: false,
    canvasContract: "",
    canvasReceiptPresent: false,

    routeConductorPresent: false,
    routeConductorRequested: false,
    routeConductorScriptPresent: false,
    routeConductorScriptLoaded: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorMarkerPresent: false,
    routeConductorHydrated: false,
    routeConductorContract: "",
    routeConductorReceiptName: "",
    routeConductorRecognitionStatus: "UNSEEN",

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    visiblePlanetHintPresent: false,

    climateRouteRetired: true,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    firstFailedCoordinate: "EAST_ROUTE_NOT_BOOTED",
    recommendedNextRenewalTarget: EAST_ROUTE_FILE,
    postgameStatus: "EAST_ROUTE_LOADED_NOT_BOOTED",

    renderCount: 0,
    ledgerWriteCount: 0,
    ledgerNoopCount: 0,
    scanCount: 0,
    commitCount: 0,

    localEvents: [],
    scriptEvents: [],
    errors: [],

    startedAt: "",
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    mount: null,
    cockpit: null,
    title: null,
    stage: null,
    heartbeat: null,
    latest: null,
    mainFill: null,
    mainPercent: null,
    laneList: null,
    receiptBox: null,
    receiptPre: null,
    copyButton: null,
    receiptToggle: null,
    inspectButton: null,
    expandButton: null,
    showTab: null,
    ledger: null
  };

  const guards = {
    rendering: false,
    committingScan: false,
    publishingHandoff: false,
    renderingScheduled: false,
    loadingScripts: false
  };

  let heartbeatTimer = 0;
  let watchdogTimer = 0;
  let renderTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
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
    if (!isObject(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function stableStringify(value) {
    if (!isObject(value)) return JSON.stringify(value);
    const seen = new WeakSet();

    function sort(input) {
      if (!isObject(input)) return input;
      if (seen.has(input)) return "[Circular]";
      seen.add(input);

      if (Array.isArray(input)) return input.map(sort);

      return Object.keys(input).sort().reduce((output, key) => {
        output[key] = sort(input[key]);
        return output;
      }, {});
    }

    try {
      return JSON.stringify(sort(value));
    } catch (_error) {
      return JSON.stringify(String(value));
    }
  }

  function simpleHash(value) {
    const text = typeof value === "string" ? value : stableStringify(value);
    let hash = 5381;

    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) + hash) + text.charCodeAt(i);
      hash |= 0;
    }

    return String(hash);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function recordLocal(event, detail = {}) {
    const item = { at: nowIso(), event, detail: clonePlain(detail) };

    state.localEvents.push(item);
    if (state.localEvents.length > 160) {
      state.localEvents.splice(0, state.localEvents.length - 160);
    }

    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordScript(event, detail = {}) {
    const item = { at: nowIso(), event, detail: clonePlain(detail) };

    state.scriptEvents.push(item);
    if (state.scriptEvents.length > 180) {
      state.scriptEvents.splice(0, state.scriptEvents.length - 180);
    }

    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    state.updatedAt = item.at;
    return item;
  }

  function readPath(path) {
    if (!path) return null;
    const parts = String(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function getGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;

    if (authority.contract || authority.receipt || authority.file || authority.route || authority.version) {
      return authority;
    }

    return null;
  }

  function readReceiptByNames(names) {
    for (const name of names || []) {
      const found = readPath(name);
      const receipt = readAuthorityReceipt(found);
      if (receipt) return receipt;
    }

    return null;
  }

  function readDatasetMarker(keys) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return null;

    const dataset = doc.documentElement.dataset;

    for (const key of keys || []) {
      const value = dataset[key];
      if (value !== undefined && value !== null && value !== "") {
        return {
          key,
          value: String(value),
          contract: String(
            dataset.hearthRouteConductorContract ||
            dataset.hearthSouthRouteConductorContract ||
            dataset.hearthSouthRouteConductorSelfDutyContract ||
            ""
          ),
          receipt: String(
            dataset.hearthRouteConductorReceipt ||
            dataset.hearthSouthRouteConductorReceipt ||
            dataset.hearthSouthRouteConductorSelfDutyReceipt ||
            ""
          )
        };
      }
    }

    return null;
  }

  function readRouteConductorMarker(def) {
    const datasetMarker = readDatasetMarker(def.datasetMarkers || []);
    if (datasetMarker) return datasetMarker;

    if (root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true) {
      return {
        key: "__HEARTH_ROUTE_CONDUCTOR_MARKER__",
        value: "true",
        contract: safeString(root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__, ""),
        receipt: safeString(root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__, "")
      };
    }

    return null;
  }

  function scriptAlreadyPresent(srcPart) {
    if (!doc) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || "";
      return src.includes(srcPart);
    }) || null;
  }

  function cacheKey() {
    return encodeURIComponent(`${CONTRACT}-${VERSION}`);
  }

  function isRouteConductorDef(def) {
    return Boolean(def && def.key === "routeConductor");
  }

  function recognizeScriptDef(def) {
    const api = getGlobal(def.globals || []);
    const apiReceipt = readAuthorityReceipt(api);
    const receipt = apiReceipt || readReceiptByNames(def.receiptGlobals || []);
    const marker = isRouteConductorDef(def)
      ? readRouteConductorMarker(def)
      : readDatasetMarker(def.datasetMarkers || []);
    const script = scriptAlreadyPresent(def.file);

    const apiPresent = Boolean(api);
    const receiptPresent = Boolean(receipt);
    const markerPresent = Boolean(marker);
    const scriptPresent = Boolean(script);
    const scriptRequested = Boolean(REQUESTED[def.key] || scriptPresent);
    const scriptLoaded = Boolean(
      SCRIPT_LOADED[def.key] ||
      apiPresent ||
      receiptPresent ||
      (script && script.dataset && script.dataset.hearthScriptLoaded === "true")
    );

    let recognitionStatus = "UNSEEN";
    let present = false;
    let loaded = false;
    let hydrated = false;

    if (isRouteConductorDef(def)) {
      hydrated = Boolean(apiPresent && receiptPresent);
      present = Boolean(apiPresent || receiptPresent || scriptPresent);
      loaded = Boolean(apiPresent || receiptPresent || scriptLoaded);

      if (hydrated) {
        recognitionStatus = "API_RECEIPT_RUNTIME_PRESENT";
      } else if (apiPresent) {
        recognitionStatus = "GLOBAL_PRESENT_RECEIPT_PENDING";
      } else if (receiptPresent) {
        recognitionStatus = "RECEIPT_PRESENT_API_PENDING";
      } else if (scriptLoaded) {
        recognitionStatus = "LOADED_ALIAS_PENDING";
      } else if (scriptPresent || scriptRequested) {
        recognitionStatus = "REQUESTED_WAITING_LOAD";
      } else if (markerPresent) {
        recognitionStatus = "MARKER_ONLY_REQUEST_REQUIRED";
      } else {
        recognitionStatus = "UNSEEN";
      }
    } else {
      present = Boolean(apiPresent || receiptPresent || scriptPresent);
      loaded = Boolean(apiPresent || receiptPresent || scriptLoaded);

      if (apiPresent) {
        recognitionStatus = "GLOBAL_PRESENT";
      } else if (receiptPresent) {
        recognitionStatus = "RECEIPT_PRESENT";
      } else if (scriptLoaded) {
        recognitionStatus = "LOADED_GLOBAL_PENDING";
      } else if (scriptPresent || scriptRequested) {
        recognitionStatus = "REQUESTED_WAITING_LOAD";
      } else if (markerPresent) {
        recognitionStatus = "MARKER_PRESENT";
      } else {
        recognitionStatus = "UNSEEN";
      }
    }

    const contract = safeString(
      api && api.contract ? api.contract :
        receipt && receipt.contract ? receipt.contract :
          marker && marker.contract ? marker.contract :
            "",
      ""
    );

    const receiptName = safeString(
      receipt && receipt.receipt ? receipt.receipt :
        marker && marker.receipt ? marker.receipt :
          "",
      ""
    );

    return {
      def,
      api,
      apiReceipt,
      receipt,
      marker,
      script,

      apiPresent,
      receiptPresent,
      markerPresent,
      scriptPresent,
      scriptRequested,
      scriptLoaded,
      hydrated,

      present,
      requested: scriptRequested,
      loaded,
      globalPresent: apiPresent,
      contract,
      receiptName,
      recognitionStatus
    };
  }

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #hearthCanvasMount,
      [data-hearth-canvas-mount="true"]{
        position:relative;
        overflow:hidden;
        touch-action:none;
        user-select:none;
        -webkit-user-select:none;
        -webkit-touch-callout:none;
      }

      .hearth-ledger-cockpit{
        position:absolute;
        inset:10px;
        z-index:30;
        display:flex;
        flex-direction:column;
        max-height:calc(100% - 20px);
        min-height:170px;
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:24px;
        background:
          radial-gradient(circle at 12% 0%,rgba(231,188,105,.16),transparent 20rem),
          radial-gradient(circle at 90% 18%,rgba(141,216,255,.12),transparent 22rem),
          linear-gradient(180deg,rgba(7,18,33,.92),rgba(2,8,17,.82));
        color:rgba(238,246,255,.94);
        box-shadow:0 22px 70px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(10px);
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;
      }

      .hearth-ledger-head{
        display:grid;
        gap:6px;
        padding:14px 16px 10px;
        border-bottom:1px solid rgba(231,188,105,.14);
      }

      .hearth-ledger-kicker{
        color:#e7bc69;
        font-weight:950;
        font-size:.64rem;
        letter-spacing:.15em;
        text-transform:uppercase;
      }

      .hearth-ledger-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font-weight:950;
        font-size:clamp(1.08rem,3.4vw,1.65rem);
        line-height:1;
        letter-spacing:-.045em;
      }

      .hearth-ledger-meta,
      .hearth-ledger-latest{
        color:rgba(238,246,255,.68);
        font-size:.72rem;
        font-weight:760;
        line-height:1.28;
      }

      .hearth-ledger-progress{
        display:grid;
        grid-template-columns:1fr auto;
        align-items:center;
        gap:10px;
        padding:10px 16px;
        border-bottom:1px solid rgba(231,188,105,.12);
      }

      .hearth-ledger-track,
      .hearth-ledger-lane-track{
        position:relative;
        height:9px;
        overflow:hidden;
        border:1px solid rgba(141,216,255,.18);
        border-radius:999px;
        background:rgba(255,255,255,.055);
      }

      .hearth-ledger-fill,
      .hearth-ledger-lane-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:0%;
        border-radius:inherit;
        background:linear-gradient(90deg,rgba(141,216,255,.80),rgba(231,188,105,.96));
        box-shadow:0 0 18px rgba(231,188,105,.18);
        transition:width .24s ease;
      }

      .hearth-ledger-percent{
        min-width:44px;
        color:#ffe8a3;
        font-weight:950;
        font-size:.72rem;
        text-align:right;
      }

      .hearth-ledger-actions{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        padding:10px 16px;
        border-bottom:1px solid rgba(231,188,105,.12);
      }

      .hearth-ledger-button{
        min-height:31px;
        border:1px solid rgba(231,188,105,.26);
        border-radius:999px;
        padding:7px 10px;
        color:rgba(238,246,255,.84);
        background:rgba(255,255,255,.045);
        font:900 .64rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.07em;
        text-transform:uppercase;
        cursor:pointer;
      }

      .hearth-ledger-button.primary{
        color:#06101e;
        border-color:rgba(231,188,105,.86);
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
      }

      .hearth-ledger-scroll{
        min-height:0;
        overflow:auto;
        padding:10px 16px 14px;
      }

      .hearth-ledger-lanes{
        display:grid;
        gap:7px;
      }

      .hearth-ledger-lane{
        display:grid;
        gap:5px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:13px;
        padding:8px;
        background:rgba(255,255,255,.035);
      }

      .hearth-ledger-lane-top{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:8px;
      }

      .hearth-ledger-lane-title{
        display:grid;
        gap:2px;
        min-width:0;
        color:rgba(238,246,255,.64);
        font-size:.66rem;
        line-height:1.22;
      }

      .hearth-ledger-lane-title strong{
        color:rgba(255,244,216,.94);
        font-size:.70rem;
      }

      .hearth-ledger-lane-status{
        flex:0 0 auto;
        color:#8dd8ff;
        font-size:.60rem;
        font-weight:950;
        letter-spacing:.09em;
        text-transform:uppercase;
      }

      .hearth-ledger-receipt{
        display:none;
        margin-top:10px;
        border:1px solid rgba(231,188,105,.16);
        border-radius:14px;
        background:rgba(0,0,0,.24);
      }

      .hearth-ledger-receipt[data-visible="true"]{
        display:block;
      }

      .hearth-ledger-receipt pre{
        margin:0;
        max-height:260px;
        overflow:auto;
        padding:10px;
        color:rgba(238,246,255,.72);
        white-space:pre-wrap;
        font:700 .66rem/1.38 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:translateY(24px) scale(.985);
        max-height:0!important;
        min-height:0!important;
      }

      [data-hearth-east-show-diagnostic-tab]{
        position:fixed;
        right:max(12px,env(safe-area-inset-right));
        bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));
        z-index:9999;
        display:none;
        min-height:36px;
        padding:9px 13px;
        border-radius:999px;
        border:1px solid rgba(231,188,105,.65);
        color:#06101e;
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
        box-shadow:0 14px 40px rgba(0,0,0,.36);
        font:950 .68rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      html[data-hearth-east-inspect-reserved-active="true"] [data-hearth-east-show-diagnostic-tab]{
        display:inline-flex;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit{
          inset:8px;
          min-height:166px;
          border-radius:20px;
        }

        .hearth-ledger-head{
          padding:12px 12px 8px;
        }

        .hearth-ledger-progress,
        .hearth-ledger-actions,
        .hearth-ledger-scroll{
          padding-left:12px;
          padding-right:12px;
        }

        .hearth-ledger-button{
          flex:1 1 auto;
          min-width:30%;
          font-size:.58rem;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-planet-frame]") ||
      doc.querySelector("#hearth-planet-frame");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthMountCreatedByEast = CONTRACT;

      const parent = doc.getElementById("hearth-main") || doc.querySelector("main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
      state.mountCreatedByEast = true;
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthEastStep1Ignition = CONTRACT;
    mount.dataset.hearthEastReceipt = RECEIPT;
    mount.dataset.hearthCycleEast = "true";
    mount.dataset.hearthCycleOrder = CYCLE_ORDER;
    mount.dataset.hearthRouteConductorFile = ROUTE_CONDUCTOR_FILE;
    mount.dataset.hearthRouteConductorMarkerIsLoadedProof = "false";
    mount.dataset.hearthRouteConductorMarkerIsHydrationProof = "false";
    mount.dataset.runtimeTableRequiredForFirstRender = "false";
    mount.dataset.sourceStackRequiredForFirstRender = "false";
    mount.dataset.wideProbeDeferred = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.webkitUserSelect = "none";
    mount.style.webkitTouchCallout = "none";

    refs.mount = mount;
    state.mountReady = true;

    return mount;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthEastShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthEastShowDiagnosticTab = "true";
    tab.onclick = () => setInspectReserved(false);

    refs.showTab = tab;
    state.showDiagnosticRestoreReserved = true;

    return tab;
  }

  function ensureCockpit() {
    if (!doc) return null;

    ensureStyle();

    const mount = ensureMount();
    if (!mount) return null;

    ensureShowTab();

    let cockpit =
      mount.querySelector("[data-hearth-load-cockpit='true']") ||
      mount.querySelector("[data-hearth-first-paint-cockpit='true']") ||
      doc.getElementById(COCKPIT_ID);

    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = COCKPIT_ID;
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.hearthFirstPaintCockpit = "true";
      cockpit.dataset.hearthCreatedByEastStep1Ignition = CONTRACT;
      cockpit.dataset.cockpitMode = "first-paint-loading";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · East Route Ignition</div>
          <h2 class="hearth-ledger-title">STARTING HEARTH DIRECTIONAL CYCLE</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>Gear · East route ignition</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>timing=true · sequence=true · cycle=true</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=EAST_ROUTE_FILE_LOADED</div>
        </div>

        <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
          <div class="hearth-ledger-track">
            <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:0%"></span>
          </div>
          <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
        </div>

        <div class="hearth-ledger-actions">
          <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
          <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
          <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
          <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Expand cockpit</button>
        </div>

        <div class="hearth-ledger-scroll">
          <div class="hearth-ledger-lanes" data-hearth-lane-list></div>
          <div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
            <pre data-hearth-receipt-text></pre>
          </div>
        </div>
      `;

      mount.appendChild(cockpit);
      state.cockpitCreatedByEast = true;
    }

    cockpit.dataset.hearthEastStep1Ignition = CONTRACT;
    cockpit.dataset.hearthEastReceipt = RECEIPT;
    cockpit.dataset.hearthCycleEast = "true";
    cockpit.dataset.hearthCycleOrder = CYCLE_ORDER;
    cockpit.dataset.generatedImage = "false";
    cockpit.dataset.graphicBox = "false";
    cockpit.dataset.webgl = "false";
    cockpit.dataset.visualPassClaimed = "false";

    refs.cockpit = cockpit;
    refs.title = cockpit.querySelector(".hearth-ledger-title");
    refs.stage = cockpit.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = cockpit.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = cockpit.querySelector("[data-hearth-latest-event]");
    refs.mainFill = cockpit.querySelector("[data-hearth-main-progress-fill]");
    refs.mainPercent = cockpit.querySelector("[data-hearth-main-progress-percent]");
    refs.laneList = cockpit.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    refs.receiptPre = cockpit.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = cockpit.querySelector("[data-hearth-copy-diagnostic]");
    refs.receiptToggle = cockpit.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = cockpit.querySelector("[data-hearth-inspect-planet]");
    refs.expandButton = cockpit.querySelector("[data-hearth-collapse-cockpit]");

    if (refs.copyButton) {
      refs.copyButton.onclick = copyDiagnostic;
      state.copyPartialDiagnosticReady = true;
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.onclick = toggleReceipt;
      state.receiptToggleReady = true;
    }

    if (refs.inspectButton) {
      refs.inspectButton.onclick = () => setInspectReserved(!state.inspectModeReservedActive);
      state.inspectControlReserved = true;
    }

    if (refs.expandButton) {
      refs.expandButton.onclick = toggleExpanded;
    }

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
      fallback.dataset.hiddenByEastStep1Ignition = CONTRACT;
    });

    state.cockpitReady = true;
    state.loadingScreenReady = true;
    state.firstPaintReady = true;
    state.visibleProgressStripReady = Boolean(refs.mainFill && refs.mainPercent);
    state.partialReceiptAvailable = true;

    return cockpit;
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;
    led.contract = led.contract || "HEARTH_DIRECTIONAL_CYCLE_SHARED_LOAD_LEDGER_v4";
    led.createdBy = led.createdBy || CONTRACT;
    led.ownerModel = "cardinal-cycle";
    led.cycleOrder = CYCLE_ORDER;
    led.route = ROUTE;
    led.eastRouteFile = EAST_ROUTE_FILE;
    led.northFile = NORTH_FILE;
    led.eastBranchFile = EAST_BRANCH_FILE;
    led.westFile = WEST_BRANCH_FILE;
    led.southFile = SOUTH_BRANCH_FILE;
    led.canvasFile = CANVAS_FILE;
    led.routeConductorFile = ROUTE_CONDUCTOR_FILE;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = led.updatedAt || nowIso();
    led.currentGear = led.currentGear || "EAST_ROUTE";
    led.currentGearProgress = safeNumber(led.currentGearProgress, 0);
    led.visualPassClaimed = false;
    led.markerIsNotLoadedProof = true;
    led.markerIsNotHydrationProof = true;
    led.events = Array.isArray(led.events) ? led.events : [];
    led.errors = Array.isArray(led.errors) ? led.errors : [];
    led.scripts = isObject(led.scripts) ? led.scripts : {};
    led.lanes = isObject(led.lanes) ? led.lanes : {};
    led.listeners = Array.isArray(led.listeners) ? led.listeners : [];

    LANE_DEFS.forEach((lane) => {
      if (!isObject(led.lanes[lane.key])) {
        led.lanes[lane.key] = {
          key: lane.key,
          label: lane.label,
          owner: lane.owner,
          status: "PENDING",
          message: `${lane.label} pending.`,
          progress: 0,
          latestEvent: "LANE_INITIALIZED",
          updatedAt: nowIso()
        };
      }
    });

    ledger.push = function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        gear: event.gear || led.currentGear || state.currentGear,
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "EAST_ROUTE",
        file: event.file || EAST_ROUTE_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? "",
        timestamp: nowIso()
      };

      const last = led.events[led.events.length - 1];
      const sameAsLast = last && (
        last.id === evt.id &&
        last.gear === evt.gear &&
        last.lane === evt.lane &&
        last.status === evt.status &&
        last.message === evt.message &&
        String(last.progress) === String(evt.progress) &&
        stableStringify(last.detail) === stableStringify(evt.detail)
      );

      if (sameAsLast) {
        state.ledgerNoopCount += 1;
        return last;
      }

      led.events.push(evt);
      if (led.events.length > 260) {
        led.events.splice(0, led.events.length - 260);
      }

      led.updatedAt = evt.timestamp;
      state.ledgerWriteCount += 1;
      notifyLedger(false);

      return evt;
    };

    ledger.setLane = function setLane(key, next = {}) {
      const lane = led.lanes[key] || {
        key,
        label: key,
        owner: next.owner || "",
        status: "PENDING",
        message: "",
        progress: 0,
        latestEvent: "LANE_CREATED",
        updatedAt: nowIso()
      };

      const candidate = {
        key,
        label: lane.label || next.label || key,
        owner: next.owner || lane.owner || "",
        status: next.status || lane.status || "PENDING",
        message: next.message || lane.message || "",
        progress: clamp(next.progress ?? lane.progress ?? 0, 0, 100),
        latestEvent: next.event || next.latestEvent || lane.latestEvent || "LANE_EVENT",
        updatedAt: lane.updatedAt || nowIso()
      };

      const changed = (
        lane.status !== candidate.status ||
        lane.message !== candidate.message ||
        safeNumber(lane.progress, 0) !== candidate.progress ||
        lane.latestEvent !== candidate.latestEvent ||
        lane.owner !== candidate.owner
      );

      if (!changed) {
        state.ledgerNoopCount += 1;
        return lane;
      }

      candidate.updatedAt = nowIso();
      led.lanes[key] = candidate;
      state.ledgerWriteCount += 1;

      ledger.push({
        id: candidate.latestEvent,
        gear: state.currentGear,
        lane: key,
        status: candidate.status,
        owner: candidate.owner,
        file: next.file || EAST_ROUTE_FILE,
        message: candidate.message,
        progress: candidate.progress,
        detail: next.detail || {}
      });

      return candidate;
    };

    ledger.setScript = function setScript(key, next = {}) {
      const current = led.scripts[key] || {
        key,
        src: "",
        direction: "",
        status: "PENDING",
        error: "",
        requestedAt: "",
        loadedAt: "",
        scriptPresent: false,
        scriptRequested: false,
        scriptLoaded: false,
        globalPresent: false,
        receiptPresent: false,
        markerPresent: false,
        hydrated: false,
        recognitionStatus: "",
        updatedAt: nowIso()
      };

      const candidate = {
        key,
        src: next.src || current.src,
        direction: next.direction || current.direction,
        status: next.status || current.status,
        error: next.error || "",
        requestedAt: next.requestedAt || current.requestedAt,
        loadedAt: next.loadedAt || current.loadedAt,
        scriptPresent: Boolean(next.scriptPresent),
        scriptRequested: Boolean(next.scriptRequested),
        scriptLoaded: Boolean(next.scriptLoaded),
        globalPresent: Boolean(next.globalPresent),
        receiptPresent: Boolean(next.receiptPresent),
        markerPresent: Boolean(next.markerPresent),
        hydrated: Boolean(next.hydrated),
        recognitionStatus: next.recognitionStatus || current.recognitionStatus || "",
        updatedAt: current.updatedAt || nowIso()
      };

      const changed = stableStringify(current) !== stableStringify(candidate);

      if (!changed) {
        state.ledgerNoopCount += 1;
        return current;
      }

      candidate.updatedAt = nowIso();
      led.scripts[key] = candidate;
      state.ledgerWriteCount += 1;

      ledger.push({
        id: `SCRIPT_${String(key).toUpperCase()}_${candidate.status}`,
        gear: state.currentGear,
        lane: key,
        status: candidate.status,
        owner: "EAST_ROUTE",
        file: EAST_ROUTE_FILE,
        message: `${key} ${candidate.status}`,
        detail: {
          src: candidate.src,
          direction: candidate.direction,
          error: candidate.error,
          scriptPresent: candidate.scriptPresent,
          scriptRequested: candidate.scriptRequested,
          scriptLoaded: candidate.scriptLoaded,
          globalPresent: candidate.globalPresent,
          receiptPresent: candidate.receiptPresent,
          markerPresent: candidate.markerPresent,
          hydrated: candidate.hydrated,
          recognitionStatus: candidate.recognitionStatus
        }
      });

      return candidate;
    };

    ledger.setCurrentGear = function setCurrentGear(gear, progress = 0, message = "") {
      const normalizedProgress = clamp(progress, 0, 100);
      const changed = led.currentGear !== gear || safeNumber(led.currentGearProgress, 0) !== normalizedProgress;

      if (!changed) {
        state.ledgerNoopCount += 1;
        return { gear: led.currentGear, progress: led.currentGearProgress };
      }

      led.currentGear = gear;
      led.currentGearProgress = normalizedProgress;
      led.updatedAt = nowIso();

      ledger.push({
        id: `GEAR_${gear}_${normalizedProgress}`,
        gear,
        lane: "",
        status: "ACTIVE",
        owner: gear,
        file: EAST_ROUTE_FILE,
        message: message || `Gear ${gear} progress ${normalizedProgress}%.`,
        progress: normalizedProgress
      });

      return { gear, progress: normalizedProgress };
    };

    ledger.bindRenderer = function bindRenderer(fn) {
      if (isFunction(fn) && !led.listeners.includes(fn)) led.listeners.push(fn);
      return led.listeners.length;
    };

    ledger.getReceipt = function getSharedReceipt() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getSharedReceiptText() {
      return getReceiptText();
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.sharedLedgerPresent = true;
    state.sharedLedgerCreatedByEast = led.createdBy === CONTRACT;

    return ledger;
  }

  function notifyLedger(schedule = true) {
    const led = refs.ledger && refs.ledger.state ? refs.ledger.state : null;
    if (!led || !Array.isArray(led.listeners)) return;

    led.listeners = led.listeners.filter((fn) => {
      try {
        fn(clonePlain(led));
        return true;
      } catch (_error) {
        return false;
      }
    });

    if (schedule) scheduleRender();
  }

  function scanDownstreamReadOnly() {
    state.scanCount += 1;

    const scan = {
      at: nowIso(),
      scripts: {},
      globals: {},
      receipts: {},
      recognitions: {},
      canvasHints: {}
    };

    SCRIPT_DEFS.forEach((def) => {
      const recognition = recognizeScriptDef(def);

      scan.scripts[def.key] = {
        key: def.key,
        file: def.file,
        present: recognition.present,
        requested: recognition.requested,
        loaded: recognition.loaded,
        scriptPresent: recognition.scriptPresent,
        scriptRequested: recognition.scriptRequested,
        scriptLoaded: recognition.scriptLoaded,
        required: def.required,
        recognitionStatus: recognition.recognitionStatus
      };

      scan.globals[def.key] = {
        present: recognition.globalPresent,
        contract: recognition.contract
      };

      scan.receipts[def.key] = {
        present: recognition.receiptPresent,
        contract: recognition.contract,
        receipt: recognition.receiptName,
        raw: recognition.receipt ? clonePlain(recognition.receipt) : null
      };

      scan.recognitions[def.key] = {
        status: recognition.recognitionStatus,
        apiPresent: recognition.apiPresent,
        receiptPresent: recognition.receiptPresent,
        markerPresent: recognition.markerPresent,
        scriptPresent: recognition.scriptPresent,
        scriptRequested: recognition.scriptRequested,
        scriptLoaded: recognition.scriptLoaded,
        hydrated: recognition.hydrated,
        contract: recognition.contract,
        receipt: recognition.receiptName
      };
    });

    if (doc) {
      const mount = refs.mount || doc.getElementById(MOUNT_ID) || doc.querySelector("[data-hearth-canvas-mount]");
      const canvas = mount ? mount.querySelector("canvas") : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");
      const rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
      const canvasDef = SCRIPT_DEFS.find((def) => def.key === "canvas");
      const canvasRecognition = recognizeScriptDef(canvasDef);
      const canvasReceipt = canvasRecognition.receipt || readAuthorityReceipt(canvasRecognition.api);

      scan.canvasHints = {
        planetCanvasPresent: Boolean(canvas),
        planetCanvasNonZeroSize: Boolean(
          canvas &&
          (
            (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
            (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
          )
        ),
        canvasReady: safeBool(canvasReceipt && canvasReceipt.canvasReady, false) || (doc.documentElement && doc.documentElement.dataset.hearthCanvasReady === "true"),
        imageRendered: safeBool(canvasReceipt && canvasReceipt.imageRendered, false) || (doc.documentElement && doc.documentElement.dataset.hearthCanvasImageRendered === "true"),
        firstFrameDetected: safeBool(canvasReceipt && canvasReceipt.firstFrameDetected, false),
        visiblePlanetAvailable: safeBool(canvasReceipt && canvasReceipt.visiblePlanetAvailable, false),
        visibleContentSoftGap: safeBool(canvasReceipt && canvasReceipt.visibleContentSoftGap, false),
        visibleContentProof: safeBool(canvasReceipt && canvasReceipt.visibleContentProof, false)
      };
    }

    return scan;
  }

  function applyScanCommit(scan, reason = "commit-scan") {
    if (!scan || guards.committingScan) return false;

    guards.committingScan = true;

    try {
      const before = stableStringify({
        northPresent: state.northPresent,
        eastBranchPresent: state.eastBranchPresent,
        westPresent: state.westPresent,
        southPresent: state.southPresent,
        canvasPresent: state.canvasPresent,
        routeConductorPresent: state.routeConductorPresent,
        routeConductorRequested: state.routeConductorRequested,
        routeConductorScriptPresent: state.routeConductorScriptPresent,
        routeConductorScriptLoaded: state.routeConductorScriptLoaded,
        routeConductorApiPresent: state.routeConductorApiPresent,
        routeConductorReceiptPresent: state.routeConductorReceiptPresent,
        routeConductorMarkerPresent: state.routeConductorMarkerPresent,
        routeConductorHydrated: state.routeConductorHydrated,
        routeConductorRecognitionStatus: state.routeConductorRecognitionStatus,
        planetCanvasPresent: state.planetCanvasPresent,
        visiblePlanetHintPresent: state.visiblePlanetHintPresent,
        scriptStatus: state.scriptStatus
      });

      SCRIPT_DEFS.forEach((def) => {
        const script = scan.scripts[def.key] || {};
        const global = scan.globals[def.key] || {};
        const receipt = scan.receipts[def.key] || {};
        const recognition = scan.recognitions[def.key] || {};

        state.scriptStatus[def.key] = {
          key: def.key,
          file: script.file || "",
          present: script.present === true,
          requested: script.requested === true,
          loaded: script.loaded === true,
          scriptPresent: script.scriptPresent === true,
          scriptRequested: script.scriptRequested === true,
          scriptLoaded: script.scriptLoaded === true,
          globalPresent: global.present === true,
          receiptPresent: receipt.present === true,
          markerPresent: recognition.markerPresent === true,
          hydrated: recognition.hydrated === true,
          recognitionStatus: recognition.status || script.recognitionStatus || "",
          contract: global.contract || receipt.contract || recognition.contract || "",
          receipt: receipt.receipt || recognition.receipt || "",
          required: script.required === true,
          updatedAt: scan.at
        };
      });

      state.northPresent = Boolean(scan.globals.north && scan.globals.north.present);
      state.northContract = scan.globals.north ? scan.globals.north.contract : "";
      state.northReceiptPresent = Boolean(scan.receipts.north && scan.receipts.north.present);

      state.eastBranchPresent = Boolean(scan.globals.eastBranch && scan.globals.eastBranch.present);
      state.eastBranchContract = scan.globals.eastBranch ? scan.globals.eastBranch.contract : "";
      state.eastBranchReceiptPresent = Boolean(scan.receipts.eastBranch && scan.receipts.eastBranch.present);

      state.westPresent = Boolean(scan.globals.west && scan.globals.west.present);
      state.westContract = scan.globals.west ? scan.globals.west.contract : "";
      state.westReceiptPresent = Boolean(scan.receipts.west && scan.receipts.west.present);

      state.southPresent = Boolean(scan.globals.south && scan.globals.south.present);
      state.southContract = scan.globals.south ? scan.globals.south.contract : "";
      state.southReceiptPresent = Boolean(scan.receipts.south && scan.receipts.south.present);

      state.canvasPresent = Boolean(
        (scan.globals.canvas && scan.globals.canvas.present) ||
        (scan.receipts.canvas && scan.receipts.canvas.present)
      );
      state.canvasContract = scan.globals.canvas ? scan.globals.canvas.contract : scan.receipts.canvas ? scan.receipts.canvas.contract : "";
      state.canvasReceiptPresent = Boolean(scan.receipts.canvas && scan.receipts.canvas.present);

      const routeRecognition = scan.recognitions.routeConductor || {};
      const routeScript = scan.scripts.routeConductor || {};
      const routeReceipt = scan.receipts.routeConductor || {};
      const routeGlobal = scan.globals.routeConductor || {};

      state.routeConductorRequested = Boolean(routeRecognition.scriptRequested || routeScript.requested);
      state.routeConductorScriptPresent = Boolean(routeRecognition.scriptPresent || routeScript.scriptPresent);
      state.routeConductorScriptLoaded = Boolean(routeRecognition.scriptLoaded || routeScript.scriptLoaded);
      state.routeConductorApiPresent = Boolean(routeRecognition.apiPresent || routeGlobal.present);
      state.routeConductorReceiptPresent = Boolean(routeRecognition.receiptPresent || routeReceipt.present);
      state.routeConductorMarkerPresent = Boolean(routeRecognition.markerPresent);
      state.routeConductorHydrated = Boolean(routeRecognition.hydrated || (state.routeConductorApiPresent && state.routeConductorReceiptPresent));
      state.routeConductorRecognitionStatus = routeRecognition.status || routeScript.recognitionStatus || "UNSEEN";

      state.routeConductorPresent = Boolean(state.routeConductorHydrated || state.routeConductorApiPresent || state.routeConductorReceiptPresent);
      state.routeConductorContract = routeGlobal.contract || routeReceipt.contract || routeRecognition.contract || "";
      state.routeConductorReceiptName = routeReceipt.receipt || routeRecognition.receipt || "";

      state.planetCanvasPresent = Boolean(scan.canvasHints.planetCanvasPresent);
      state.planetCanvasNonZeroSize = Boolean(scan.canvasHints.planetCanvasNonZeroSize);
      state.visiblePlanetHintPresent = Boolean(
        scan.canvasHints.planetCanvasPresent &&
        scan.canvasHints.planetCanvasNonZeroSize &&
        (
          scan.canvasHints.canvasReady ||
          scan.canvasHints.imageRendered ||
          scan.canvasHints.firstFrameDetected ||
          scan.canvasHints.visiblePlanetAvailable ||
          scan.canvasHints.visibleContentSoftGap ||
          scan.canvasHints.visibleContentProof
        )
      );

      state.downstreamRequiredReady = state.northPresent;
      state.downstreamOptionalReady = Boolean(
        state.eastBranchPresent &&
        state.westPresent &&
        state.southPresent &&
        state.canvasPresent
      );

      state.scriptOrderComplete = Boolean(
        state.northPresent &&
        state.eastBranchPresent &&
        state.westPresent &&
        state.southPresent &&
        state.canvasPresent
      );

      state.scriptOrderSettled = Boolean(
        state.scriptOrderComplete ||
        state.scriptErrors.length > 0 ||
        Object.keys(state.scriptStatus).length >= SCRIPT_DEFS.length
      );

      deriveCycleStateReadOnly();

      const after = stableStringify({
        northPresent: state.northPresent,
        eastBranchPresent: state.eastBranchPresent,
        westPresent: state.westPresent,
        southPresent: state.southPresent,
        canvasPresent: state.canvasPresent,
        routeConductorPresent: state.routeConductorPresent,
        routeConductorRequested: state.routeConductorRequested,
        routeConductorScriptPresent: state.routeConductorScriptPresent,
        routeConductorScriptLoaded: state.routeConductorScriptLoaded,
        routeConductorApiPresent: state.routeConductorApiPresent,
        routeConductorReceiptPresent: state.routeConductorReceiptPresent,
        routeConductorMarkerPresent: state.routeConductorMarkerPresent,
        routeConductorHydrated: state.routeConductorHydrated,
        routeConductorRecognitionStatus: state.routeConductorRecognitionStatus,
        planetCanvasPresent: state.planetCanvasPresent,
        visiblePlanetHintPresent: state.visiblePlanetHintPresent,
        scriptStatus: state.scriptStatus
      });

      const changed = before !== after;

      if (changed) {
        state.commitCount += 1;
        updateLedgerFromState(reason);
        publishStep1HandoffIfChanged(reason);
        publishGlobals();
      }

      return changed;
    } finally {
      guards.committingScan = false;
    }
  }

  function updateLedgerFromState(reason = "state-update") {
    const ledger = refs.ledger || ensureLedger();

    ledger.setLane("eastRoute", {
      status: state.step1Ready ? "READY" : "ACTIVE",
      progress: state.step1Ready ? 100 : state.currentGearProgress,
      event: state.step1Ready ? "EAST_ROUTE_STEP1_READY" : "EAST_ROUTE_STEP1_ACTIVE",
      owner: "EAST_ROUTE",
      file: EAST_ROUTE_FILE,
      message: state.step1Ready ? "East route Step 1 is ready." : "East route Step 1 is active.",
      detail: { reason }
    });

    ledger.setLane("north", {
      status: state.northPresent ? "READY" : "WAITING",
      progress: state.northPresent ? 100 : 0,
      event: state.northPresent ? "NORTH_RUNTIME_TABLE_PRESENT" : "NORTH_RUNTIME_TABLE_WAITING",
      owner: "NORTH",
      file: NORTH_FILE,
      message: state.northPresent ? "North Runtime Table is present." : "Waiting for North Runtime Table.",
      detail: { reason }
    });

    ledger.setLane("eastBranch", {
      status: state.eastBranchPresent ? "READY" : "OPTIONAL_WAITING",
      progress: state.eastBranchPresent ? 100 : 0,
      event: state.eastBranchPresent ? "EAST_BRANCH_PRESENT" : "EAST_BRANCH_WAITING",
      owner: "EAST_BRANCH",
      file: EAST_BRANCH_FILE,
      message: state.eastBranchPresent ? "East branch is present." : "East branch pending.",
      detail: { reason }
    });

    ledger.setLane("west", {
      status: state.westPresent ? "READY" : "OPTIONAL_WAITING",
      progress: state.westPresent ? 100 : 0,
      event: state.westPresent ? "WEST_GAP_CLASSIFIER_PRESENT" : "WEST_GAP_CLASSIFIER_WAITING",
      owner: "WEST",
      file: WEST_BRANCH_FILE,
      message: state.westPresent ? "West gap classifier is present." : "West gap classifier pending.",
      detail: { reason }
    });

    ledger.setLane("south", {
      status: state.southPresent ? "READY" : "OPTIONAL_WAITING",
      progress: state.southPresent ? 100 : 0,
      event: state.southPresent ? "SOUTH_VISIBLE_COMPOSER_PRESENT" : "SOUTH_VISIBLE_COMPOSER_WAITING",
      owner: "SOUTH",
      file: SOUTH_BRANCH_FILE,
      message: state.southPresent ? "South visible-state composer is present." : "South visible-state composer pending.",
      detail: { reason }
    });

    ledger.setLane("canvas", {
      status: state.canvasPresent ? "READY" : "OPTIONAL_WAITING",
      progress: state.canvasPresent ? 100 : 0,
      event: state.canvasPresent ? "CANVAS_EVIDENCE_PRESENT" : "CANVAS_EVIDENCE_WAITING",
      owner: "CANVAS",
      file: CANVAS_FILE,
      message: state.canvasPresent ? "Canvas evidence authority is present." : "Canvas evidence authority pending.",
      detail: { reason }
    });

    const rc = routeConductorLaneState();

    ledger.setLane("routeConductor", {
      status: rc.status,
      progress: rc.progress,
      event: rc.event,
      owner: "ROUTE_CONDUCTOR",
      file: ROUTE_CONDUCTOR_FILE,
      message: rc.message,
      detail: {
        reason,
        recognitionStatus: state.routeConductorRecognitionStatus,
        requested: state.routeConductorRequested,
        scriptPresent: state.routeConductorScriptPresent,
        scriptLoaded: state.routeConductorScriptLoaded,
        apiPresent: state.routeConductorApiPresent,
        receiptPresent: state.routeConductorReceiptPresent,
        markerPresent: state.routeConductorMarkerPresent,
        hydrated: state.routeConductorHydrated
      }
    });

    ledger.setLane("checkpoint", {
      status: state.downstreamRequiredReady ? "CYCLE_CAN_CONTINUE" : "WAITING",
      progress: state.downstreamRequiredReady ? 100 : 0,
      event: state.downstreamRequiredReady ? "CHECKPOINT_CAN_RETURN_TO_NORTH" : "CHECKPOINT_WAITING_FOR_NORTH",
      owner: "NORTH",
      file: NORTH_FILE,
      message: state.downstreamRequiredReady ? "Cycle can continue through North." : "Checkpoint waiting for North.",
      detail: { reason }
    });

    ledger.setCurrentGear(state.currentGear, state.currentGearProgress, state.currentGearLabel);
  }

  function routeConductorLaneState() {
    if (state.routeConductorHydrated) {
      return {
        status: "READY",
        progress: 100,
        event: "ROUTE_CONDUCTOR_API_RECEIPT_PRESENT",
        message: "Route conductor API and receipt are present."
      };
    }

    if (state.routeConductorApiPresent && !state.routeConductorReceiptPresent) {
      return {
        status: "RECEIPT_PENDING",
        progress: 86,
        event: "ROUTE_CONDUCTOR_GLOBAL_PRESENT_RECEIPT_PENDING",
        message: "Route conductor API is present; receipt is pending."
      };
    }

    if (state.routeConductorReceiptPresent && !state.routeConductorApiPresent) {
      return {
        status: "API_PENDING",
        progress: 84,
        event: "ROUTE_CONDUCTOR_RECEIPT_PRESENT_API_PENDING",
        message: "Route conductor receipt is present; API alias is pending."
      };
    }

    if (state.routeConductorScriptLoaded) {
      return {
        status: "ALIAS_PENDING",
        progress: 72,
        event: "ROUTE_CONDUCTOR_LOADED_ALIAS_PENDING",
        message: "Route conductor script loaded; waiting for API and receipt."
      };
    }

    if (state.routeConductorScriptPresent || state.routeConductorRequested) {
      return {
        status: "REQUESTED_WAITING_LOAD",
        progress: 58,
        event: "ROUTE_CONDUCTOR_REQUESTED_WAITING_LOAD",
        message: "Route conductor request exists; waiting for script load."
      };
    }

    if (state.routeConductorMarkerPresent) {
      return {
        status: "MARKER_ONLY",
        progress: 35,
        event: "ROUTE_CONDUCTOR_MARKER_ONLY_REQUEST_REQUIRED",
        message: "Route conductor marker observed; script request still required."
      };
    }

    return {
      status: "WAITING",
      progress: 0,
      event: "ROUTE_CONDUCTOR_WAITING",
      message: "Route conductor pending."
    };
  }

  function deriveCycleStateReadOnly() {
    if (!state.step1Ignited) {
      state.currentGear = "EAST_ROUTE";
      state.currentGearLabel = "East route ignition";
      state.currentGearProgress = 0;
      state.firstFailedCoordinate = "WAITING_EAST_ROUTE_IGNITION";
      state.recommendedNextRenewalTarget = EAST_ROUTE_FILE;
      state.postgameStatus = "EAST_ROUTE_NOT_BOOTED";
      return;
    }

    if (!state.mountReady || !state.cockpitReady || !state.sharedLedgerPresent || !state.firstPaintReady) {
      state.currentGear = "EAST_ROUTE";
      state.currentGearLabel = "East route first-paint setup";
      state.currentGearProgress = state.mountReady ? state.cockpitReady ? 82 : 55 : 25;
      state.firstFailedCoordinate = !state.mountReady
        ? "WAITING_EAST_MOUNT_READY"
        : !state.cockpitReady
          ? "WAITING_EAST_COCKPIT_READY"
          : !state.sharedLedgerPresent
            ? "WAITING_EAST_SHARED_LEDGER"
            : "WAITING_EAST_FIRST_PAINT_READY";
      state.recommendedNextRenewalTarget = EAST_ROUTE_FILE;
      state.postgameStatus = "EAST_ROUTE_FIRST_PAINT_ACTIVE";
      return;
    }

    state.step1Ready = true;

    if (!state.northPresent) {
      state.currentGear = "NORTH";
      state.currentGearLabel = "North Runtime Table";
      state.currentGearProgress = state.scriptStatus.north && state.scriptStatus.north.requested ? 48 : 12;
      state.firstFailedCoordinate = "WAITING_NORTH_RUNTIME_TABLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WAITING_NORTH_RUNTIME_TABLE";
      return;
    }

    if (!state.eastBranchPresent) {
      state.currentGear = "EAST_BRANCH";
      state.currentGearLabel = "East branch";
      state.currentGearProgress = state.scriptStatus.eastBranch && state.scriptStatus.eastBranch.requested ? 48 : 12;
      state.firstFailedCoordinate = "WAITING_EAST_BRANCH";
      state.recommendedNextRenewalTarget = EAST_BRANCH_FILE;
      state.postgameStatus = "WAITING_EAST_BRANCH";
      return;
    }

    if (!state.westPresent) {
      state.currentGear = "WEST";
      state.currentGearLabel = "West gap classifier";
      state.currentGearProgress = state.scriptStatus.west && state.scriptStatus.west.requested ? 48 : 12;
      state.firstFailedCoordinate = "WAITING_WEST_GAP_CLASSIFIER";
      state.recommendedNextRenewalTarget = WEST_BRANCH_FILE;
      state.postgameStatus = "WAITING_WEST";
      return;
    }

    if (!state.southPresent) {
      state.currentGear = "SOUTH";
      state.currentGearLabel = "South visible-state composer";
      state.currentGearProgress = state.scriptStatus.south && state.scriptStatus.south.requested ? 48 : 12;
      state.firstFailedCoordinate = "WAITING_SOUTH_VISIBLE_COMPOSER";
      state.recommendedNextRenewalTarget = SOUTH_BRANCH_FILE;
      state.postgameStatus = "WAITING_SOUTH";
      return;
    }

    if (!state.canvasPresent) {
      state.currentGear = "CANVAS";
      state.currentGearLabel = "Canvas evidence authority";
      state.currentGearProgress = state.scriptStatus.canvas && state.scriptStatus.canvas.requested ? 48 : 12;
      state.firstFailedCoordinate = "WAITING_CANVAS_EVIDENCE_AUTHORITY";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      state.postgameStatus = "WAITING_CANVAS";
      return;
    }

    if (!state.routeConductorHydrated) {
      state.currentGear = "ROUTE_CONDUCTOR";
      state.currentGearLabel = "Route conductor request/hydration";
      state.currentGearProgress = routeConductorLaneState().progress;
      state.firstFailedCoordinate = state.routeConductorRecognitionStatus === "MARKER_ONLY_REQUEST_REQUIRED"
        ? "MARKER_OBSERVED_BUT_SCRIPT_NOT_REQUESTED"
        : state.routeConductorRecognitionStatus === "REQUESTED_WAITING_LOAD"
          ? "WAITING_ROUTE_CONDUCTOR_SCRIPT_LOAD"
          : state.routeConductorRecognitionStatus === "LOADED_ALIAS_PENDING"
            ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT"
            : "WAITING_ROUTE_CONDUCTOR_HYDRATION";
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = `ROUTE_CONDUCTOR_${state.routeConductorRecognitionStatus}`;
      return;
    }

    state.currentGear = "CHECKPOINT";
    state.currentGearLabel = "Checkpoint return to North";
    state.currentGearProgress = 100;
    state.firstFailedCoordinate = "NONE_EAST_ROUTE_STEP1_COMPLETE";
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "EAST_ROUTE_STEP1_COMPLETE_RETURN_TO_NORTH";
    state.bootComplete = true;
  }

  function retireClimateRoute() {
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;
    root.__HEARTH_RETIRED_ROUTE_FILE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    [
      "__HEARTH_VISIBLE_RECOVERY_DISPOSE__",
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__"
    ].forEach((name) => {
      try {
        if (typeof root[name] === "function") root[name]();
      } catch (_error) {}

      try {
        root[name] = undefined;
        delete root[name];
      } catch (_error) {}
    });

    if (doc) {
      doc.querySelectorAll("script[src*='hearth.climate.route.js']").forEach((script) => {
        script.dataset.hearthClimateRouteRetired = "true";
        script.dataset.retiredBy = CONTRACT;
      });
    }

    state.climateRouteRetired = true;
  }

  function updateDocumentDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthEastStep1IgnitionLoaded = "true";
    dataset.hearthEastStep1IgnitionContract = CONTRACT;
    dataset.hearthEastStep1IgnitionReceipt = RECEIPT;
    dataset.hearthEastStep1IgnitionVersion = VERSION;
    dataset.hearthCycleOrder = CYCLE_ORDER;

    dataset.hearthEastRouteFile = EAST_ROUTE_FILE;
    dataset.hearthNorthFile = NORTH_FILE;
    dataset.hearthEastBranchFile = EAST_BRANCH_FILE;
    dataset.hearthWestFile = WEST_BRANCH_FILE;
    dataset.hearthSouthFile = SOUTH_BRANCH_FILE;
    dataset.hearthCanvasFile = CANVAS_FILE;
    dataset.hearthRouteConductorFile = ROUTE_CONDUCTOR_FILE;

    dataset.hearthRouteConductorRequestHydrationAdmissionActive = "true";
    dataset.hearthMarkerOnlyRequestRequiredActive = "true";
    dataset.hearthRouteConductorMarkerIsLoadedProof = "false";
    dataset.hearthRouteConductorMarkerIsHydrationProof = "false";
    dataset.hearthRouteConductorHydrationRequiresApiAndReceipt = "true";
    dataset.hearthDottedGlobalPathRecognitionActive = "true";
    dataset.hearthReceiptFallbackRecognitionActive = "true";
    dataset.hearthStableHandoffHashActive = "true";
    dataset.hearthLoadedAliasPendingNotHardError = "true";

    dataset.hearthCurrentGear = state.currentGear;
    dataset.hearthCurrentGearProgress = String(state.currentGearProgress);
    dataset.hearthCurrentGearLabel = state.currentGearLabel;

    dataset.hearthStep1Ignited = String(state.step1Ignited);
    dataset.hearthStep1Ready = String(state.step1Ready);
    dataset.hearthStep1HandoffPublished = String(state.step1HandoffPublished);
    dataset.hearthStep1HandoffAcceptedByNorth = String(state.step1HandoffAcceptedByNorth);
    dataset.hearthStep1HandoffAcceptedByWest = String(state.step1HandoffAcceptedByWest);

    dataset.hearthMountReady = String(state.mountReady);
    dataset.hearthFirstPaintCockpitReady = String(state.cockpitReady);
    dataset.hearthVisibleProgressStripReady = String(state.visibleProgressStripReady);
    dataset.hearthLoadLedgerPresent = String(state.sharedLedgerPresent);

    dataset.hearthNorthPresent = String(state.northPresent);
    dataset.hearthEastBranchPresent = String(state.eastBranchPresent);
    dataset.hearthWestPresent = String(state.westPresent);
    dataset.hearthSouthPresent = String(state.southPresent);
    dataset.hearthCanvasPresent = String(state.canvasPresent);

    dataset.hearthRouteConductorPresent = String(state.routeConductorPresent);
    dataset.hearthRouteConductorRequested = String(state.routeConductorRequested);
    dataset.hearthRouteConductorScriptPresent = String(state.routeConductorScriptPresent);
    dataset.hearthRouteConductorScriptLoaded = String(state.routeConductorScriptLoaded);
    dataset.hearthRouteConductorApiPresent = String(state.routeConductorApiPresent);
    dataset.hearthRouteConductorReceiptPresent = String(state.routeConductorReceiptPresent);
    dataset.hearthRouteConductorMarkerPresent = String(state.routeConductorMarkerPresent);
    dataset.hearthRouteConductorHydrated = String(state.routeConductorHydrated);
    dataset.hearthRouteConductorRecognitionStatus = state.routeConductorRecognitionStatus;
    dataset.hearthRouteConductorContract = state.routeConductorContract || "";

    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthVisiblePlanetHintPresent = String(state.visiblePlanetHintPresent);

    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredClimateRouteFile = RETIRED_CLIMATE_FILE;
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthRenderReadOnly = "true";
    dataset.hearthReceiptReadOnly = "true";
    dataset.hearthLedgerIdempotent = "true";
    dataset.hearthHandoffIdempotent = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.eastStep1Ignition = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexConstraintSemiconductor = api;
    root.HEARTH.eastRouteConductorRequestHydrationAdmission = api;

    root.HEARTH_EAST_STEP1_IGNITION = api;
    root.HEARTH_EAST_STEP1_IGNITION_CYCLE = api;
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION = api;
    root.HearthIndexBridge = api;
    root.HEARTH_INDEX_JS = api;

    root.HEARTH_EAST_STEP1_IGNITION_RECEIPT = getReceiptLightReadOnly();
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = getStep1HandoffReceipt();
    root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT = root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT;

    root.__HEARTH_EAST_ROUTE_FILE__ = EAST_ROUTE_FILE;
    root.__HEARTH_NORTH_RUNTIME_TABLE_FILE__ = NORTH_FILE;
    root.__HEARTH_EAST_BRANCH_FILE__ = EAST_BRANCH_FILE;
    root.__HEARTH_WEST_BRANCH_FILE__ = WEST_BRANCH_FILE;
    root.__HEARTH_SOUTH_BRANCH_FILE__ = SOUTH_BRANCH_FILE;
    root.__HEARTH_CANVAS_FILE__ = CANVAS_FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = ROUTE_CONDUCTOR_FILE;
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ROUTE_CONDUCTOR_FILE;
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

    updateDocumentDataset();
  }

  function getStep1HandoffStableHashMaterial() {
    return {
      contract: CONTRACT,
      receipt: "HEARTH_EAST_STEP1_HANDOFF_RECEIPT_v4",
      sourceReceipt: RECEIPT,
      version: VERSION,
      owner: "EAST_ROUTE",
      file: EAST_ROUTE_FILE,
      route: ROUTE,
      cycleOrder: CYCLE_ORDER,

      step: 1,
      stepName: "EAST_ROUTE_STEP1_IGNITION_FIRST_PAINT",
      step1Ignited: state.step1Ignited,
      step1Ready: state.step1Ready,
      firstPaintReady: state.firstPaintReady,
      mountReady: state.mountReady,
      cockpitReady: state.cockpitReady,
      loadingScreenReady: state.loadingScreenReady,
      sharedLedgerPresent: state.sharedLedgerPresent,
      scriptOrderStarted: state.scriptOrderStarted,
      scriptOrderComplete: state.scriptOrderComplete,
      scriptOrderSettled: state.scriptOrderSettled,
      partialReceiptAvailable: state.partialReceiptAvailable,

      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westFile: WEST_BRANCH_FILE,
      southFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,

      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westPresent: state.westPresent,
      southPresent: state.southPresent,
      canvasPresent: state.canvasPresent,

      routeConductorPresent: state.routeConductorPresent,
      routeConductorRequested: state.routeConductorRequested,
      routeConductorScriptPresent: state.routeConductorScriptPresent,
      routeConductorScriptLoaded: state.routeConductorScriptLoaded,
      routeConductorApiPresent: state.routeConductorApiPresent,
      routeConductorReceiptPresent: state.routeConductorReceiptPresent,
      routeConductorMarkerPresent: state.routeConductorMarkerPresent,
      routeConductorHydrated: state.routeConductorHydrated,
      routeConductorRecognitionStatus: state.routeConductorRecognitionStatus,
      routeConductorContract: state.routeConductorContract,

      currentGear: state.currentGear,
      currentGearProgress: state.currentGearProgress,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      markerIsNotLoadedProof: true,
      markerIsNotHydrationProof: true,
      routeConductorHydrationRequiresApiAndReceipt: true,
      renderReadOnly: true,
      receiptReadOnly: true,
      ledgerIdempotent: true,
      handoffIdempotent: true,
      stableHandoffHashActive: true,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,
      climateRouteRetired: true,

      eastRouteOwnsStep1: true,
      eastRouteOwnsRouteConductorRequest: true,
      northOwnsRuntimeTable: true,
      eastBranchOwnsMagnifier: true,
      westOwnsGapClassification: true,
      southOwnsVisibleStateComposition: true,
      canvasOwnsDrawingAndF13Evidence: true,
      routeConductorOwnsRouteRuntimeAfterHydration: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getStep1HandoffReceipt() {
    return {
      ...getStep1HandoffStableHashMaterial(),
      publishedAt: nowIso()
    };
  }

  function publishStep1HandoffIfChanged(reason = "handoff-check") {
    if (guards.publishingHandoff) return false;

    guards.publishingHandoff = true;

    try {
      const receipt = getStep1HandoffReceipt();
      const stableHashMaterial = getStep1HandoffStableHashMaterial();
      const nextHash = simpleHash(stableHashMaterial);
      const changed = nextHash !== state.step1HandoffHash;

      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = receipt;
      root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT = receipt;

      if (!changed && state.step1HandoffAcceptedByNorth && state.step1HandoffAcceptedByWest) {
        return false;
      }

      state.step1HandoffHash = nextHash;
      state.step1HandoffPublished = true;
      state.handoffPublishCount += 1;

      const north = getGlobal([
        "LAB_RUNTIME_TABLE",
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_CHECKPOINT_GOVERNOR",
        "DexterRuntimeTable",
        "RUNTIME_TABLE",
        "DEXTER_LAB.runtimeTable"
      ]);

      if (north && isFunction(north.acceptEastHandoff)) {
        try {
          const result = north.acceptEastHandoff(receipt);
          state.step1HandoffAcceptedByNorth = Boolean(result !== false);
          state.step1HandoffAcceptedAt = nowIso();
        } catch (error) {
          recordError("NORTH_ACCEPT_EAST_HANDOFF_FAILED", error && error.message ? error.message : String(error), { reason });
        }
      } else if (north && isFunction(north.receiveEastHandoff)) {
        try {
          const result = north.receiveEastHandoff(receipt);
          state.step1HandoffAcceptedByNorth = Boolean(result !== false);
          state.step1HandoffAcceptedAt = nowIso();
        } catch (error) {
          recordError("NORTH_RECEIVE_EAST_HANDOFF_FAILED", error && error.message ? error.message : String(error), { reason });
        }
      } else if (north) {
        state.step1HandoffAcceptedByNorth = true;
      }

      const west = getGlobal([
        "LAB_RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "LAB_GAP_CLASSIFIER_WEST",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest"
      ]);

      if (west && isFunction(west.acceptEastHandoff)) {
        try {
          const result = west.acceptEastHandoff(receipt);
          state.step1HandoffAcceptedByWest = Boolean(result !== false);
          state.step1HandoffAcceptedAt = nowIso();
        } catch (error) {
          recordError("WEST_ACCEPT_EAST_HANDOFF_FAILED", error && error.message ? error.message : String(error), { reason });
        }
      } else if (west && isFunction(west.receiveEastHandoff)) {
        try {
          const result = west.receiveEastHandoff(receipt);
          state.step1HandoffAcceptedByWest = Boolean(result !== false);
          state.step1HandoffAcceptedAt = nowIso();
        } catch (error) {
          recordError("WEST_RECEIVE_EAST_HANDOFF_FAILED", error && error.message ? error.message : String(error), { reason });
        }
      } else if (west) {
        state.step1HandoffAcceptedByWest = true;
      }

      recordLocal("EAST_STEP1_HANDOFF_PUBLISHED", {
        reason,
        changed,
        stableHashActive: true,
        hash: nextHash,
        acceptedByNorth: state.step1HandoffAcceptedByNorth,
        acceptedByWest: state.step1HandoffAcceptedByWest
      });

      return true;
    } finally {
      guards.publishingHandoff = false;
    }
  }

  function finishScriptRecognitionStatus(def, status, recognition, error = "") {
    const ledger = refs.ledger || ensureLedger();

    ledger.setScript(def.key, {
      src: recognition && recognition.script ? recognition.script.src || recognition.script.getAttribute("src") || def.file : def.file,
      direction: def.direction,
      status,
      scriptPresent: Boolean(recognition && recognition.scriptPresent),
      scriptRequested: Boolean(recognition && recognition.scriptRequested),
      scriptLoaded: Boolean(recognition && recognition.scriptLoaded),
      globalPresent: Boolean(recognition && recognition.apiPresent),
      receiptPresent: Boolean(recognition && recognition.receiptPresent),
      markerPresent: Boolean(recognition && recognition.markerPresent),
      hydrated: Boolean(recognition && recognition.hydrated),
      recognitionStatus: recognition ? recognition.recognitionStatus : status,
      error,
      loadedAt: recognition && recognition.loaded ? nowIso() : ""
    });

    if (error && !(def.key === "routeConductor" && status === "LOADED_ALIAS_PENDING")) {
      state.scriptErrors.push({ key: def.key, file: def.file, message: error, at: nowIso() });
      recordError(`SCRIPT_${def.key}_ERROR`, error, { file: def.file, direction: def.direction });
    } else {
      recordScript(`SCRIPT_${def.key}_${status}`, {
        file: def.file,
        direction: def.direction,
        recognitionStatus: recognition ? recognition.recognitionStatus : status
      });
    }

    const scan = scanDownstreamReadOnly();
    applyScanCommit(scan, `script-${def.key}-${status}`);
  }

  function loadScriptDef(def) {
    const recognitionBefore = recognizeScriptDef(def);
    const ledger = refs.ledger || ensureLedger();

    if (!isRouteConductorDef(def)) {
      if (recognitionBefore.loaded) {
        finishScriptRecognitionStatus(def, recognitionBefore.recognitionStatus || "GLOBAL_PRESENT", recognitionBefore, "");
        return Promise.resolve(recognitionBefore.api || recognitionBefore.receipt || null);
      }

      if (recognitionBefore.scriptPresent || recognitionBefore.scriptRequested) {
        ledger.setScript(def.key, {
          src: recognitionBefore.script ? recognitionBefore.script.src || def.file : def.file,
          direction: def.direction,
          status: recognitionBefore.recognitionStatus || "REQUESTED_WAITING_LOAD",
          scriptPresent: recognitionBefore.scriptPresent,
          scriptRequested: true,
          scriptLoaded: recognitionBefore.scriptLoaded,
          globalPresent: recognitionBefore.apiPresent,
          receiptPresent: recognitionBefore.receiptPresent,
          markerPresent: recognitionBefore.markerPresent,
          hydrated: recognitionBefore.hydrated,
          recognitionStatus: recognitionBefore.recognitionStatus,
          requestedAt: nowIso()
        });

        return waitForRecognition(def, 2400).then((recognition) => {
          if (recognition && recognition.loaded) {
            finishScriptRecognitionStatus(def, recognition.recognitionStatus || "GLOBAL_PRESENT", recognition, "");
            return recognition.api || recognition.receipt || null;
          }

          finishScriptRecognitionStatus(def, "LOADED_GLOBAL_PENDING", recognition, "script loaded or requested but global not present");
          return null;
        });
      }

      return appendScriptAndWait(def);
    }

    if (recognitionBefore.hydrated || recognitionBefore.apiPresent || recognitionBefore.receiptPresent) {
      finishScriptRecognitionStatus(def, recognitionBefore.recognitionStatus, recognitionBefore, "");
      return Promise.resolve(recognitionBefore.api || recognitionBefore.receipt || null);
    }

    if (recognitionBefore.scriptPresent || recognitionBefore.scriptRequested) {
      REQUESTED[def.key] = true;

      finishScriptRecognitionStatus(
        def,
        recognitionBefore.recognitionStatus === "UNSEEN" ? "REQUESTED_WAITING_LOAD" : recognitionBefore.recognitionStatus,
        recognitionBefore,
        ""
      );

      return waitForRecognition(def, 2200).then((recognition) => {
        if (recognition && recognition.hydrated) {
          finishScriptRecognitionStatus(def, "API_RECEIPT_RUNTIME_PRESENT", recognition, "");
          return recognition.api || recognition.receipt || null;
        }

        if (recognition && recognition.apiPresent) {
          finishScriptRecognitionStatus(def, "GLOBAL_PRESENT_RECEIPT_PENDING", recognition, "");
          return recognition.api || null;
        }

        if (recognition && recognition.receiptPresent) {
          finishScriptRecognitionStatus(def, "RECEIPT_PRESENT_API_PENDING", recognition, "");
          return recognition.receipt || null;
        }

        finishScriptRecognitionStatus(def, "LOADED_ALIAS_PENDING", recognition, "");
        return null;
      });
    }

    if (recognitionBefore.markerPresent && !recognitionBefore.scriptPresent && !recognitionBefore.apiPresent && !recognitionBefore.receiptPresent) {
      finishScriptRecognitionStatus(def, "MARKER_ONLY_REQUEST_REQUIRED", recognitionBefore, "");
      return appendScriptAndWait(def);
    }

    return appendScriptAndWait(def);
  }

  function appendScriptAndWait(def) {
    const ledger = refs.ledger || ensureLedger();

    if (!doc || !doc.head) {
      const message = "document.head unavailable";
      state.scriptErrors.push({ key: def.key, file: def.file, message, at: nowIso() });
      recordError("DOCUMENT_HEAD_MISSING", message, { file: def.file, key: def.key });
      return Promise.resolve(null);
    }

    const existing = scriptAlreadyPresent(def.file);
    if (existing) {
      REQUESTED[def.key] = true;

      return waitForRecognition(def, 2400).then((recognition) => {
        const status = recognition && recognition.hydrated
          ? "API_RECEIPT_RUNTIME_PRESENT"
          : recognition && recognition.apiPresent
            ? "GLOBAL_PRESENT_RECEIPT_PENDING"
            : recognition && recognition.receiptPresent
              ? "RECEIPT_PRESENT_API_PENDING"
              : recognition && recognition.scriptLoaded
                ? "LOADED_ALIAS_PENDING"
                : "REQUESTED_WAITING_LOAD";

        finishScriptRecognitionStatus(def, status, recognition, "");
        return recognition ? recognition.api || recognition.receipt || null : null;
      });
    }

    REQUESTED[def.key] = true;

    ledger.setScript(def.key, {
      src: def.file,
      direction: def.direction,
      status: "REQUESTED",
      scriptPresent: false,
      scriptRequested: true,
      scriptLoaded: false,
      globalPresent: false,
      receiptPresent: false,
      markerPresent: false,
      hydrated: false,
      recognitionStatus: "REQUESTED",
      requestedAt: nowIso()
    });

    const script = doc.createElement("script");
    script.src = `${def.file}?v=${cacheKey()}`;
    script.defer = true;
    script.async = false;
    script.dataset.hearthDirectionalCycle = "true";
    script.dataset.hearthLoadedByEastRoute = CONTRACT;
    script.dataset.hearthDirection = def.direction;
    script.dataset.hearthScriptKey = def.key;
    script.dataset.hearthScriptRequested = "true";
    script.dataset.hearthScriptLoaded = "false";
    script.dataset.generatedImage = "false";
    script.dataset.graphicBox = "false";
    script.dataset.webgl = "false";
    script.dataset.visualPassClaimed = "false";

    recordScript(`SCRIPT_${def.key}_REQUESTED`, { file: def.file, direction: def.direction });

    return new Promise((resolve) => {
      let settled = false;

      function finish(status, recognition = null, error = "") {
        if (settled) return;
        settled = true;
        finishScriptRecognitionStatus(def, status, recognition, error);
        resolve(recognition ? recognition.api || recognition.receipt || recognition.marker || null : null);
      }

      script.onload = () => {
        script.dataset.hearthScriptLoaded = "true";
        SCRIPT_LOADED[def.key] = true;

        waitForRecognition(def, isRouteConductorDef(def) ? 1800 : 1200).then((recognition) => {
          if (isRouteConductorDef(def)) {
            if (recognition && recognition.hydrated) {
              finish("API_RECEIPT_RUNTIME_PRESENT", recognition, "");
              return;
            }

            if (recognition && recognition.apiPresent) {
              finish("GLOBAL_PRESENT_RECEIPT_PENDING", recognition, "");
              return;
            }

            if (recognition && recognition.receiptPresent) {
              finish("RECEIPT_PRESENT_API_PENDING", recognition, "");
              return;
            }

            finish("LOADED_ALIAS_PENDING", recognition, "");
            return;
          }

          if (recognition && recognition.loaded) {
            finish(recognition.recognitionStatus || "GLOBAL_PRESENT", recognition, "");
            return;
          }

          finish("LOADED_GLOBAL_PENDING", recognition, "script loaded but global not present");
        });
      };

      script.onerror = () => {
        finish("LOAD_FAILED", null, `${def.direction} file failed to load`);
      };

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (settled) return;

        const recognition = recognizeScriptDef(def);

        if (isRouteConductorDef(def)) {
          if (recognition && recognition.hydrated) {
            finish("API_RECEIPT_RUNTIME_PRESENT", recognition, "");
            return;
          }

          if (recognition && recognition.apiPresent) {
            finish("GLOBAL_PRESENT_RECEIPT_PENDING", recognition, "");
            return;
          }

          if (recognition && recognition.receiptPresent) {
            finish("RECEIPT_PRESENT_API_PENDING", recognition, "");
            return;
          }

          if (recognition && recognition.scriptPresent) {
            finish("LOADED_ALIAS_PENDING", recognition, "");
            return;
          }

          finish("REQUESTED_WAITING_LOAD", recognition, "");
          return;
        }

        if (recognition && recognition.loaded) {
          finish(recognition.recognitionStatus || "TIMEOUT_GLOBAL_PRESENT", recognition, "");
          return;
        }

        finish("LOAD_TIMEOUT", recognition, `${def.direction} load timeout`);
      }, isRouteConductorDef(def) ? 4200 : 3600);
    });
  }

  function waitForRecognition(def, timeoutMs) {
    const started = nowMs();

    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        const recognition = recognizeScriptDef(def);

        if (isRouteConductorDef(def)) {
          if (recognition && (recognition.hydrated || recognition.apiPresent || recognition.receiptPresent)) {
            root.clearInterval(timer);
            resolve(recognition);
            return;
          }
        } else if (recognition && recognition.loaded) {
          root.clearInterval(timer);
          resolve(recognition);
          return;
        }

        if (nowMs() - started >= timeoutMs) {
          root.clearInterval(timer);
          resolve(recognition || null);
        }
      }, 80);
    });
  }

  async function loadScriptsSequentially() {
    if (guards.loadingScripts) return;

    guards.loadingScripts = true;
    state.scriptOrderStarted = true;
    recordLocal("EAST_ROUTE_SCRIPT_ORDER_STARTED");

    try {
      for (const def of SCRIPT_DEFS) {
        if (state.disposed) return;

        state.currentGear = def.direction;
        state.currentGearLabel = def.label;
        state.currentGearProgress = 15;

        updateLedgerFromState(`before-load-${def.key}`);
        scheduleRender();

        await loadScriptDef(def);

        const scan = scanDownstreamReadOnly();
        applyScanCommit(scan, `after-load-${def.key}`);

        const status = state.scriptStatus[def.key] || {};
        state.currentGearProgress =
          status.hydrated ? 100 :
            status.globalPresent || status.receiptPresent ? 86 :
              status.loaded || status.scriptLoaded ? 72 :
                status.requested || status.scriptRequested ? 58 :
                  status.markerPresent ? 35 : 12;

        updateLedgerFromState(`after-load-${def.key}-gear`);
        scheduleRender();

        await sleep(40);
      }

      state.scriptOrderSettled = true;
      state.scriptOrderComplete = Boolean(
        state.northPresent &&
        state.eastBranchPresent &&
        state.westPresent &&
        state.southPresent &&
        state.canvasPresent
      );

      deriveCycleStateReadOnly();
      updateLedgerFromState("script-order-settled");
      publishStep1HandoffIfChanged("script-order-settled");
      publishGlobals();
      render();
    } finally {
      guards.loadingScripts = false;
    }
  }

  function sleep(ms = 0) {
    return new Promise((resolve) => root.setTimeout(resolve, Math.max(0, ms)));
  }

  function laneMarkupReadOnly() {
    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;
    const lanes = ledger && ledger.state && ledger.state.lanes ? ledger.state.lanes : {};

    return LANE_DEFS.map((def) => {
      const lane = lanes[def.key] || {
        label: def.label,
        owner: def.owner,
        status: "PENDING",
        message: `${def.label} pending.`,
        progress: 0,
        latestEvent: "PENDING"
      };

      const status = lane.status || "PENDING";
      const progress = clamp(lane.progress, 0, 100);
      const event = lane.latestEvent || "PENDING";
      const message = lane.message || `${def.label} pending.`;

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(def.key)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(def.label)} · ${escapeHtml(lane.owner || def.owner)}</strong>
              <span>${escapeHtml(message)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>event=${escapeHtml(event)}</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function scheduleRender() {
    if (guards.renderingScheduled || state.disposed) return;

    guards.renderingScheduled = true;

    renderTimer = root.setTimeout(() => {
      guards.renderingScheduled = false;
      render();
    }, 80);
  }

  function render() {
    if (guards.rendering || state.disposed) return getReceiptLightReadOnly();

    guards.rendering = true;

    try {
      state.renderCount += 1;

      const scan = scanDownstreamReadOnly();

      state.planetCanvasPresent = Boolean(scan.canvasHints.planetCanvasPresent);
      state.planetCanvasNonZeroSize = Boolean(scan.canvasHints.planetCanvasNonZeroSize);
      state.visiblePlanetHintPresent = Boolean(
        scan.canvasHints.planetCanvasPresent &&
        scan.canvasHints.planetCanvasNonZeroSize &&
        (
          scan.canvasHints.canvasReady ||
          scan.canvasHints.imageRendered ||
          scan.canvasHints.firstFrameDetected ||
          scan.canvasHints.visiblePlanetAvailable ||
          scan.canvasHints.visibleContentSoftGap ||
          scan.canvasHints.visibleContentProof
        )
      );

      deriveCycleStateReadOnly();

      if (!refs.cockpit) return getReceiptLightReadOnly();

      const progress = clamp(state.currentGearProgress, 0, 100);
      const elapsed = state.startedAt ? nowMs() - new Date(state.startedAt).getTime() : 0;

      if (refs.title) {
        refs.title.textContent = state.bootComplete
          ? "EAST STEP 1 COMPLETE · RETURNING THROUGH NORTH"
          : "STARTING HEARTH DIRECTIONAL CYCLE";
      }

      if (refs.stage) {
        refs.stage.textContent = `${state.currentGear} · ${state.currentGearLabel}`;
      }

      if (refs.heartbeat) {
        refs.heartbeat.textContent = `timing=true · sequence=true · cycle=true · elapsed=${formatElapsed(elapsed)}`;
      }

      if (refs.latest) {
        refs.latest.textContent = `latest=${state.latestEvent}`;
      }

      if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
      if (refs.mainPercent) refs.mainPercent.textContent = `${Math.round(progress)}%`;
      if (refs.laneList) refs.laneList.innerHTML = laneMarkupReadOnly();

      if (refs.receiptPre && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
        refs.receiptPre.textContent = getReceiptText();
      }

      publishStatusNodeReadOnly();
      updateDocumentDataset();

      return getReceiptLightReadOnly();
    } finally {
      guards.rendering = false;
    }
  }

  function publishStatusNodeReadOnly() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth East route-conductor request-hydration admission active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${EAST_ROUTE_FILE}`,
      `Cycle ${CYCLE_ORDER}`,
      `Current gear ${state.currentGear}`,
      `Gear progress ${state.currentGearProgress}`,
      `Mount ready ${state.mountReady}`,
      `Cockpit ready ${state.cockpitReady}`,
      `Shared ledger present ${state.sharedLedgerPresent}`,
      `North present ${state.northPresent}`,
      `East branch present ${state.eastBranchPresent}`,
      `West present ${state.westPresent}`,
      `South present ${state.southPresent}`,
      `Canvas present ${state.canvasPresent}`,
      `Route conductor present ${state.routeConductorPresent}`,
      `Route conductor requested ${state.routeConductorRequested}`,
      `Route conductor script present ${state.routeConductorScriptPresent}`,
      `Route conductor script loaded ${state.routeConductorScriptLoaded}`,
      `Route conductor API present ${state.routeConductorApiPresent}`,
      `Route conductor receipt present ${state.routeConductorReceiptPresent}`,
      `Route conductor marker present ${state.routeConductorMarkerPresent}`,
      `Route conductor hydrated ${state.routeConductorHydrated}`,
      `Route conductor recognition status ${state.routeConductorRecognitionStatus}`,
      `Route conductor contract ${state.routeConductorContract}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Marker is loaded proof false`,
      `Marker is hydration proof false`,
      `Render count ${state.renderCount}`,
      `Ledger writes ${state.ledgerWriteCount}`,
      `Ledger noops ${state.ledgerNoopCount}`,
      "Stable handoff hash true",
      "Render read-only true",
      "Receipt read-only true",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    render();
  }

  function toggleExpanded() {
    if (!refs.cockpit) return;

    if (state.inspectModeReservedActive) {
      setInspectReserved(false);
      return;
    }

    const expanded = refs.cockpit.dataset.fullExpanded !== "true";
    refs.cockpit.dataset.fullExpanded = String(expanded);
    refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "first-paint-loading";

    if (refs.expandButton) {
      refs.expandButton.textContent = expanded ? "Collapse dock" : "Expand cockpit";
    }
  }

  function setInspectReserved(active) {
    state.inspectModeReservedActive = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "first-paint-loading";
      refs.cockpit.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.mount) {
      refs.mount.dataset.hearthEastInspectReservedActive = String(active);
    }

    recordLocal(active ? "EAST_ROUTE_INSPECT_RESERVATION_ACTIVE" : "EAST_ROUTE_INSPECT_RESERVATION_RELEASED", {
      reservedOnly: true,
      southOwnsFinalInspectTruth: true
    });

    publishGlobals();
    render();
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }

      if (doc) {
        const textarea = doc.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand("copy");
        textarea.remove();
        return true;
      }
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }

    return false;
  }

  async function copyDiagnostic() {
    const ok = await copyText(getReceiptText());

    if (refs.copyButton) {
      const original = refs.copyButton.textContent;
      refs.copyButton.textContent = ok ? "Copied" : "Copy failed";
      root.setTimeout(() => {
        refs.copyButton.textContent = original || "Copy diagnostic";
      }, 1100);
    }

    recordLocal("EAST_ROUTE_PARTIAL_DIAGNOSTIC_COPIED", { ok });
    return ok;
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    let ticks = 0;

    heartbeatTimer = root.setInterval(() => {
      if (state.disposed) {
        root.clearInterval(heartbeatTimer);
        heartbeatTimer = 0;
        return;
      }

      ticks += 1;

      const scan = scanDownstreamReadOnly();
      const changed = applyScanCommit(scan, "heartbeat");

      if (changed) scheduleRender();

      if (ticks >= 44 || state.bootComplete) {
        root.clearInterval(heartbeatTimer);
        heartbeatTimer = 0;
      }
    }, 1000);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    let ticks = 0;

    watchdogTimer = root.setInterval(() => {
      if (state.disposed) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
        return;
      }

      ticks += 1;

      const scan = scanDownstreamReadOnly();
      const changed = applyScanCommit(scan, "watchdog");

      if (changed) scheduleRender();

      if (
        state.routeConductorMarkerPresent &&
        !state.routeConductorRequested &&
        !state.routeConductorScriptPresent &&
        !state.routeConductorApiPresent &&
        !state.routeConductorReceiptPresent
      ) {
        const def = SCRIPT_DEFS.find((item) => item.key === "routeConductor");
        if (def) loadScriptDef(def);
      }

      if (ticks >= 40 || state.bootComplete) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, 500);
  }

  async function boot() {
    if (state.bootStarted) {
      render();
      return getReceipt();
    }

    state.bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.step1Ignited = true;
    state.currentGear = "EAST_ROUTE";
    state.currentGearLabel = "East route ignition";
    state.currentGearProgress = 10;
    state.postgameStatus = "EAST_ROUTE_BOOTING";
    state.firstFailedCoordinate = "EAST_ROUTE_BOOT_STARTED";
    state.recommendedNextRenewalTarget = NORTH_FILE;

    retireClimateRoute();

    ensureMount();
    ensureLedger();
    ensureCockpit();

    state.currentGearProgress = 45;
    updateLedgerFromState("boot-first-paint");
    publishStep1HandoffIfChanged("boot-first-paint");
    publishGlobals();
    render();

    state.step1Ready = Boolean(
      state.step1Ignited &&
      state.mountReady &&
      state.cockpitReady &&
      state.sharedLedgerPresent &&
      state.firstPaintReady
    );

    state.currentGearProgress = state.step1Ready ? 100 : 72;
    deriveCycleStateReadOnly();
    updateLedgerFromState("boot-step1-ready");
    publishStep1HandoffIfChanged("boot-step1-ready");
    publishGlobals();
    render();

    root.setTimeout(() => {
      loadScriptsSequentially();
    }, 80);

    startHeartbeat();
    startWatchdog();

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;

    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    recordLocal("EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_DISPOSED", { reason });
    publishGlobals();

    return getReceipt();
  }

  function getReceiptLightReadOnly() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: EAST_ROUTE_FILE,
      route: ROUTE,
      role: state.role,

      routeConductorRequestHydrationAdmissionActive: true,
      markerOnlyRequestRequiredActive: true,
      markerIsNotLoadedProof: true,
      markerIsNotHydrationProof: true,
      routeConductorHydrationRequiresApiAndReceipt: true,
      dottedGlobalPathRecognitionActive: true,
      receiptFallbackRecognitionActive: true,
      stableHandoffHashActive: true,
      loadedAliasPendingNotHardError: true,

      cycleOrder: CYCLE_ORDER,

      currentGear: state.currentGear,
      currentGearLabel: state.currentGearLabel,
      currentGearProgress: state.currentGearProgress,
      latestEvent: state.latestEvent,

      step1Ignited: state.step1Ignited,
      step1Ready: state.step1Ready,
      firstPaintReady: state.firstPaintReady,
      mountReady: state.mountReady,
      cockpitReady: state.cockpitReady,
      sharedLedgerPresent: state.sharedLedgerPresent,
      step1HandoffPublished: state.step1HandoffPublished,
      step1HandoffAcceptedByNorth: state.step1HandoffAcceptedByNorth,
      step1HandoffAcceptedByWest: state.step1HandoffAcceptedByWest,

      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westPresent: state.westPresent,
      southPresent: state.southPresent,
      canvasPresent: state.canvasPresent,

      routeConductorPresent: state.routeConductorPresent,
      routeConductorRequested: state.routeConductorRequested,
      routeConductorScriptPresent: state.routeConductorScriptPresent,
      routeConductorScriptLoaded: state.routeConductorScriptLoaded,
      routeConductorApiPresent: state.routeConductorApiPresent,
      routeConductorReceiptPresent: state.routeConductorReceiptPresent,
      routeConductorMarkerPresent: state.routeConductorMarkerPresent,
      routeConductorHydrated: state.routeConductorHydrated,
      routeConductorRecognitionStatus: state.routeConductorRecognitionStatus,
      routeConductorContract: state.routeConductorContract,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      visiblePlanetHintPresent: state.visiblePlanetHintPresent,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      renderReadOnly: true,
      receiptReadOnly: true,
      ledgerIdempotent: true,
      handoffIdempotent: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;

    return {
      ...getReceiptLightReadOnly(),

      destinationFile: EAST_ROUTE_FILE,

      ownsEastRouteStep1: true,
      ownsFirstPaintSurvival: true,
      ownsMountCertainty: true,
      ownsLoadingScreenCertainty: true,
      ownsEarlyLedger: true,
      ownsScriptOrderVisibility: true,
      ownsStep1HandoffPublication: true,
      ownsRouteConductorRequest: true,
      ownsRouteConductorRecognition: true,

      ownsNorthRuntimeTable: false,
      ownsEastBranchCheckpointMotion: false,
      ownsWestGapClassification: false,
      ownsSouthVisibleStateComposition: false,
      ownsSouthRouteConductorRuntime: false,
      ownsCanvasDrawing: false,
      ownsAtlasPainting: false,
      ownsRouteConductorRuntime: false,
      ownsSourceChannelTruth: false,
      ownsFinalVisualPassClaim: false,
      ownsF21CompletionLatch: false,

      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westFile: WEST_BRANCH_FILE,
      southFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,

      mountCreatedByEast: state.mountCreatedByEast,
      cockpitCreatedByEast: state.cockpitCreatedByEast,
      loadingScreenReady: state.loadingScreenReady,
      visibleProgressStripReady: state.visibleProgressStripReady,

      sharedLedgerCreatedByEast: state.sharedLedgerCreatedByEast,
      partialReceiptAvailable: state.partialReceiptAvailable,
      copyPartialDiagnosticReady: state.copyPartialDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      inspectControlReserved: state.inspectControlReserved,
      inspectModeReservedActive: state.inspectModeReservedActive,
      showDiagnosticRestoreReserved: state.showDiagnosticRestoreReserved,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,

      step1HandoffHash: state.step1HandoffHash,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,
      handoffPublishCount: state.handoffPublishCount,

      scriptOrderStarted: state.scriptOrderStarted,
      scriptOrderComplete: state.scriptOrderComplete,
      scriptOrderSettled: state.scriptOrderSettled,
      downstreamRequiredReady: state.downstreamRequiredReady,
      downstreamOptionalReady: state.downstreamOptionalReady,

      northContract: state.northContract,
      northReceiptPresent: state.northReceiptPresent,
      eastBranchContract: state.eastBranchContract,
      eastBranchReceiptPresent: state.eastBranchReceiptPresent,
      westContract: state.westContract,
      westReceiptPresent: state.westReceiptPresent,
      southContract: state.southContract,
      southReceiptPresent: state.southReceiptPresent,
      canvasContract: state.canvasContract,
      canvasReceiptPresent: state.canvasReceiptPresent,

      routeConductorContract: state.routeConductorContract,
      routeConductorReceiptName: state.routeConductorReceiptName,

      scriptStatus: clonePlain(state.scriptStatus),
      scriptErrors: clonePlain(state.scriptErrors),

      climateRouteRetired: true,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,

      renderCount: state.renderCount,
      ledgerWriteCount: state.ledgerWriteCount,
      ledgerNoopCount: state.ledgerNoopCount,
      scanCount: state.scanCount,
      commitCount: state.commitCount,

      sharedLedger: ledger && ledger.state ? clonePlain(ledger.state) : null,
      step1HandoffReceipt: getStep1HandoffReceipt(),
      step1HandoffStableHashMaterial: getStep1HandoffStableHashMaterial(),

      localEvents: clonePlain(state.localEvents),
      scriptEvents: clonePlain(state.scriptEvents),
      errors: clonePlain(state.errors),

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();
    const ledger = receipt.sharedLedger || {};

    const lanes = Object.entries(ledger.lanes || {}).map(([key, lane]) => (
      `- ${key}: owner=${lane.owner || ""}; status=${lane.status}; progress=${lane.progress}; event=${lane.latestEvent}; message=${lane.message}`
    )).join("\n") || "- none";

    const scripts = Object.entries(ledger.scripts || {}).map(([key, script]) => (
      `- ${key}: direction=${script.direction || ""}; status=${script.status}; src=${script.src || ""}; scriptPresent=${script.scriptPresent === true}; scriptRequested=${script.scriptRequested === true}; scriptLoaded=${script.scriptLoaded === true}; globalPresent=${script.globalPresent === true}; receiptPresent=${script.receiptPresent === true}; markerPresent=${script.markerPresent === true}; hydrated=${script.hydrated === true}; recognitionStatus=${script.recognitionStatus || ""}; error=${script.error || ""}`
    )).join("\n") || "- none";

    const scriptStatus = Object.entries(receipt.scriptStatus || {}).map(([key, script]) => (
      `- ${key}: present=${script.present}; requested=${script.requested}; loaded=${script.loaded}; scriptPresent=${script.scriptPresent}; scriptRequested=${script.scriptRequested}; scriptLoaded=${script.scriptLoaded}; globalPresent=${script.globalPresent}; receiptPresent=${script.receiptPresent}; markerPresent=${script.markerPresent}; hydrated=${script.hydrated}; recognitionStatus=${script.recognitionStatus}; contract=${script.contract}; receipt=${script.receipt}; required=${script.required}`
    )).join("\n") || "- none";

    const localEvents = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const scriptEvents = receipt.scriptEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_EAST_ROUTE_CONDUCTOR_REQUEST_HYDRATION_ADMISSION_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      "",
      `routeConductorRequestHydrationAdmissionActive=${receipt.routeConductorRequestHydrationAdmissionActive}`,
      `markerOnlyRequestRequiredActive=${receipt.markerOnlyRequestRequiredActive}`,
      `markerIsNotLoadedProof=${receipt.markerIsNotLoadedProof}`,
      `markerIsNotHydrationProof=${receipt.markerIsNotHydrationProof}`,
      `routeConductorHydrationRequiresApiAndReceipt=${receipt.routeConductorHydrationRequiresApiAndReceipt}`,
      `dottedGlobalPathRecognitionActive=${receipt.dottedGlobalPathRecognitionActive}`,
      `receiptFallbackRecognitionActive=${receipt.receiptFallbackRecognitionActive}`,
      `stableHandoffHashActive=${receipt.stableHandoffHashActive}`,
      `loadedAliasPendingNotHardError=${receipt.loadedAliasPendingNotHardError}`,
      "",
      `cycleOrder=${receipt.cycleOrder}`,
      "",
      `currentGear=${receipt.currentGear}`,
      `currentGearLabel=${receipt.currentGearLabel}`,
      `currentGearProgress=${receipt.currentGearProgress}`,
      `latestEvent=${receipt.latestEvent}`,
      "",
      `ownsEastRouteStep1=${receipt.ownsEastRouteStep1}`,
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCertainty=${receipt.ownsMountCertainty}`,
      `ownsLoadingScreenCertainty=${receipt.ownsLoadingScreenCertainty}`,
      `ownsEarlyLedger=${receipt.ownsEarlyLedger}`,
      `ownsScriptOrderVisibility=${receipt.ownsScriptOrderVisibility}`,
      `ownsStep1HandoffPublication=${receipt.ownsStep1HandoffPublication}`,
      `ownsRouteConductorRequest=${receipt.ownsRouteConductorRequest}`,
      `ownsRouteConductorRecognition=${receipt.ownsRouteConductorRecognition}`,
      "",
      `ownsNorthRuntimeTable=${receipt.ownsNorthRuntimeTable}`,
      `ownsEastBranchCheckpointMotion=${receipt.ownsEastBranchCheckpointMotion}`,
      `ownsWestGapClassification=${receipt.ownsWestGapClassification}`,
      `ownsSouthVisibleStateComposition=${receipt.ownsSouthVisibleStateComposition}`,
      `ownsSouthRouteConductorRuntime=${receipt.ownsSouthRouteConductorRuntime}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsAtlasPainting=${receipt.ownsAtlasPainting}`,
      `ownsRouteConductorRuntime=${receipt.ownsRouteConductorRuntime}`,
      `ownsSourceChannelTruth=${receipt.ownsSourceChannelTruth}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      `ownsF21CompletionLatch=${receipt.ownsF21CompletionLatch}`,
      "",
      `northFile=${receipt.northFile}`,
      `eastBranchFile=${receipt.eastBranchFile}`,
      `westFile=${receipt.westFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      `routeConductorFile=${receipt.routeConductorFile}`,
      "",
      `step1Ignited=${receipt.step1Ignited}`,
      `step1Ready=${receipt.step1Ready}`,
      `firstPaintReady=${receipt.firstPaintReady}`,
      `mountReady=${receipt.mountReady}`,
      `cockpitReady=${receipt.cockpitReady}`,
      `loadingScreenReady=${receipt.loadingScreenReady}`,
      `visibleProgressStripReady=${receipt.visibleProgressStripReady}`,
      "",
      `sharedLedgerPresent=${receipt.sharedLedgerPresent}`,
      `sharedLedgerCreatedByEast=${receipt.sharedLedgerCreatedByEast}`,
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `copyPartialDiagnosticReady=${receipt.copyPartialDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectControlReserved=${receipt.inspectControlReserved}`,
      `inspectModeReservedActive=${receipt.inspectModeReservedActive}`,
      `showDiagnosticRestoreReserved=${receipt.showDiagnosticRestoreReserved}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      "",
      `step1HandoffPublished=${receipt.step1HandoffPublished}`,
      `step1HandoffHash=${receipt.step1HandoffHash}`,
      `step1HandoffAcceptedByNorth=${receipt.step1HandoffAcceptedByNorth}`,
      `step1HandoffAcceptedByWest=${receipt.step1HandoffAcceptedByWest}`,
      `step1HandoffAcceptedAt=${receipt.step1HandoffAcceptedAt}`,
      `handoffPublishCount=${receipt.handoffPublishCount}`,
      "",
      `scriptOrderStarted=${receipt.scriptOrderStarted}`,
      `scriptOrderComplete=${receipt.scriptOrderComplete}`,
      `scriptOrderSettled=${receipt.scriptOrderSettled}`,
      `downstreamRequiredReady=${receipt.downstreamRequiredReady}`,
      `downstreamOptionalReady=${receipt.downstreamOptionalReady}`,
      "",
      `northPresent=${receipt.northPresent}`,
      `northContract=${receipt.northContract}`,
      `northReceiptPresent=${receipt.northReceiptPresent}`,
      `eastBranchPresent=${receipt.eastBranchPresent}`,
      `eastBranchContract=${receipt.eastBranchContract}`,
      `eastBranchReceiptPresent=${receipt.eastBranchReceiptPresent}`,
      `westPresent=${receipt.westPresent}`,
      `westContract=${receipt.westContract}`,
      `westReceiptPresent=${receipt.westReceiptPresent}`,
      `southPresent=${receipt.southPresent}`,
      `southContract=${receipt.southContract}`,
      `southReceiptPresent=${receipt.southReceiptPresent}`,
      `canvasPresent=${receipt.canvasPresent}`,
      `canvasContract=${receipt.canvasContract}`,
      `canvasReceiptPresent=${receipt.canvasReceiptPresent}`,
      "",
      `routeConductorPresent=${receipt.routeConductorPresent}`,
      `routeConductorRequested=${receipt.routeConductorRequested}`,
      `routeConductorScriptPresent=${receipt.routeConductorScriptPresent}`,
      `routeConductorScriptLoaded=${receipt.routeConductorScriptLoaded}`,
      `routeConductorApiPresent=${receipt.routeConductorApiPresent}`,
      `routeConductorReceiptPresent=${receipt.routeConductorReceiptPresent}`,
      `routeConductorMarkerPresent=${receipt.routeConductorMarkerPresent}`,
      `routeConductorHydrated=${receipt.routeConductorHydrated}`,
      `routeConductorRecognitionStatus=${receipt.routeConductorRecognitionStatus}`,
      `routeConductorContract=${receipt.routeConductorContract}`,
      `routeConductorReceiptName=${receipt.routeConductorReceiptName}`,
      "",
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `visiblePlanetHintPresent=${receipt.visiblePlanetHintPresent}`,
      "",
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `runtimeTableRequiredForFirstRender=${receipt.runtimeTableRequiredForFirstRender}`,
      `sourceStackRequiredForFirstRender=${receipt.sourceStackRequiredForFirstRender}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      "",
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      `postgameStatus=${receipt.postgameStatus}`,
      "",
      `renderReadOnly=${receipt.renderReadOnly}`,
      `receiptReadOnly=${receipt.receiptReadOnly}`,
      `ledgerIdempotent=${receipt.ledgerIdempotent}`,
      `handoffIdempotent=${receipt.handoffIdempotent}`,
      `renderCount=${receipt.renderCount}`,
      `ledgerWriteCount=${receipt.ledgerWriteCount}`,
      `ledgerNoopCount=${receipt.ledgerNoopCount}`,
      `scanCount=${receipt.scanCount}`,
      `commitCount=${receipt.commitCount}`,
      "",
      "LEDGER_LANES",
      lanes,
      "",
      "LEDGER_SCRIPTS",
      scripts,
      "",
      "SCRIPT_STATUS",
      scriptStatus,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "SCRIPT_EVENTS",
      scriptEvents,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `startedAt=${receipt.startedAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: EAST_ROUTE_FILE,
    role: "east-route-conductor-request-hydration-admission",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    scanDownstreamReadOnly,
    applyScanCommit,
    publishStep1HandoffIfChanged,
    getStep1HandoffReceipt,
    getStep1HandoffStableHashMaterial,
    loadScriptsSequentially,
    recognizeScriptDef,
    readPath,
    getGlobal,
    setInspectReserved,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsDirectionalCycle: true,
    supportsCardinalRuntimeSplit: true,
    supportsEastRouteStep1Ignition: true,
    supportsFirstPaintSurvival: true,
    supportsMountCertainty: true,
    supportsLoadingScreenCertainty: true,
    supportsEarlyLedger: true,
    supportsScriptOrderVisibility: true,
    supportsStep1HandoffPublication: true,
    supportsRouteConductorRequest: true,
    supportsRouteConductorRecognition: true,
    supportsRouteConductorRequestHydrationAdmission: true,
    supportsMarkerOnlyRequestRequired: true,
    supportsMarkerNotLoadedProof: true,
    supportsMarkerNotHydrationProof: true,
    supportsRouteConductorHydrationRequiresApiAndReceipt: true,
    supportsDottedGlobalPathRecognition: true,
    supportsReceiptFallbackRecognition: true,
    supportsStableHandoffHash: true,
    supportsLoadedAliasPendingNotHardError: true,
    supportsPartialDiagnosticBeforeCompletion: true,
    supportsInspectControlReservation: true,
    supportsShowDiagnosticRestoreReservation: true,

    renderReadOnly: true,
    receiptReadOnly: true,
    ledgerIdempotent: true,
    handoffIdempotent: true,

    ownsEastRouteStep1: true,
    ownsRouteConductorRequest: true,
    ownsRouteConductorRecognition: true,
    ownsNorthRuntimeTable: false,
    ownsEastBranchCheckpointMotion: false,
    ownsWestGapClassification: false,
    ownsSouthVisibleStateComposition: false,
    ownsSouthRouteConductorRuntime: false,
    ownsCanvasDrawing: false,
    ownsRouteConductorRuntime: false,
    ownsFinalVisualPassClaim: false,
    ownsF21CompletionLatch: false,

    northFile: NORTH_FILE,
    eastBranchFile: EAST_BRANCH_FILE,
    westFile: WEST_BRANCH_FILE,
    southFile: SOUTH_BRANCH_FILE,
    canvasFile: CANVAS_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,

    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => {
        boot();
      }, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
