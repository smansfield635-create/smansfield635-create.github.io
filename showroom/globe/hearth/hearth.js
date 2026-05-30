// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER_TNT_v1
// Full-file replacement.
// South authority only.
// Purpose:
// - Consume North command runtime-table cycle authority.
// - Own visible completion through canvas coordination intake.
// - Own visible planet proof, inspect-mode truth, diagnostic dock restoration, and final diagnostic receipt.
// - Request F21 completion only when North permits it.
// - Preserve East Step 1 and West handoff as upstream authorities.
// - Preserve North as checkpoint law / runtime-table authority.
// Does not own:
// - East Step 1 ignition / first paint / shared early ledger
// - West handoff admissibility / Step 1 normalization
// - North checkpoint law / command runtime-table governance
// - universal /assets/lab/runtime-table.js
// - source-stack truth
// - canvas pixel drawing
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_TNT_v7";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-south-visible-completion-cycle-consumer-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const WEST_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";
  const NORTH_FILE = "/assets/hearth/hearth.north.command.runtime-table.js";
  const SOUTH_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";

  const SOURCE_STACK_HELD = Object.freeze([
    "/assets/hearth/hearth.tectonics.js",
    "/assets/hearth/hearth.elevation.js",
    "/assets/hearth/hearth.composition.js",
    "/assets/hearth/hearth.hydrology.js",
    "/assets/hearth/hearth.materials.js",
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.surface.js",
    "/assets/lab/runtime-table.js"
  ]);

  const SOUTH_EVENTS = Object.freeze({
    CANVAS_COORDINATION_STARTED: "CANVAS_COORDINATION_STARTED",
    CANVAS_MOUNT_CONFIRMED: "CANVAS_MOUNT_CONFIRMED",
    CANVAS_CONTEXT_READY: "CANVAS_CONTEXT_READY",
    DRAG_INSPECTION_BOUND: "DRAG_INSPECTION_BOUND",
    ATLAS_TEXTURE_FRAME_READY: "ATLAS_TEXTURE_FRAME_READY",
    VISIBLE_CONTENT_PROOF_PASSED: "VISIBLE_CONTENT_PROOF_PASSED",
    INSPECT_MODE_READY: "INSPECT_MODE_READY",
    COMPLETION_LATCHED: "COMPLETION_LATCHED"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: SOUTH_FILE,
    route: ROUTE,
    role: "south-visible-completion-cycle-consumer",

    pairedSemiconductor: true,
    pairedWith: EAST_FILE,
    cycleOrder: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",

    ownsSouth: true,
    ownsEast: false,
    ownsWest: false,
    ownsNorth: false,
    ownsStep1: false,
    ownsStep1Handoff: false,
    ownsNorthRuntimeTable: false,
    ownsCanvasDrawing: false,
    ownsVisibleCompletion: true,
    ownsVisiblePlanetProof: true,
    ownsInspectModeTruth: true,
    ownsFinalDiagnosticReceipt: true,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    northAvailable: false,
    northContract: "",
    northSessionCreated: false,
    northSessionId: "",
    northReceiptAvailable: false,
    northReceiptError: "",
    northF21Allowed: false,
    northNewsGatePassedBeforeF21: false,
    northActiveCheckpointId: "",
    northRecommendedNextOwner: "",
    northRecommendedNextFile: "",

    step1AcceptedBySouth: false,
    handoffAdmissibleByWest: false,

    mountReady: false,
    cockpitFound: false,
    cockpitHydrated: false,
    diagnosticDockReady: false,
    showDiagnosticTabReady: false,
    copyDiagnosticReady: false,
    receiptToggleReady: false,
    inspectPlanetControlReady: false,
    collapseExpandControlReady: false,
    buttonsReachable: false,
    receiptVisible: false,
    cockpitMode: "loading-cockpit",
    cockpitExpanded: false,
    dockHiddenForInspection: false,
    diagnosticCanLeavePlanetFrame: false,
    planetNotObstructed: false,

    canvasApiPresent: false,
    canvasCarrierRequested: false,
    canvasCarrierMethod: "",
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    cooperativeBootAvailable: false,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,

    canvasReady: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    dragInspectionBound: false,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    carrierOnlyDetected: true,
    explicitContentReceiptProof: false,
    renderedAfterTexture: false,

    visiblePlanetAvailable: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,

    southGateReady: false,
    completionRequestedFromNorth: false,
    completionLatched: false,
    f21AfterNorthPermission: false,
    finalReceiptAvailable: false,

    mainDisplayProgress: 72,
    mainProgressCap: 98,
    currentStage: "F13A",
    highestStage: "F13A",
    latestVisibleEvent: "SOUTH_VISIBLE_COMPLETION_LOADED",
    postgameStatus: "SOUTH_BOOTING",
    firstFailedCoordinate: "WAITING_NORTH_COMMAND_RUNTIME_TABLE",
    recommendedNextRenewalTarget: NORTH_FILE,

    sourceAuthorityHeld: true,
    climateRouteRetired: true,
    northRuntimeTableMutation: false,
    canvasMutation: false,

    phaseEvents: [],
    progressOnlyEvents: [],
    localEvents: [],
    northEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: ""
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
    north: null,
    northSession: null,
    ledger: null
  };

  let bootStarted = false;
  let canvasBootRequested = false;
  let heartbeatTimer = 0;
  let reconcileTimer = 0;
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

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function number(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(number(ms, 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 220) {
      state.localEvents.splice(0, state.localEvents.length - 220);
    }

    state.updatedAt = item.at;
    return item;
  }

  function recordNorth(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.northEvents.push(item);
    if (state.northEvents.length > 220) {
      state.northEvents.splice(0, state.northEvents.length - 220);
    }

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

    return item;
  }

  function getDataset() {
    return doc && doc.documentElement ? doc.documentElement.dataset : {};
  }

  function getNorthApi() {
    return (
      root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE ||
      root.HEARTH_NORTH_COMMAND_TABLE ||
      root.HEARTH_NORTH_COMMAND ||
      root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE ||
      (root.HEARTH && root.HEARTH.northCommandRuntimeTable) ||
      null
    );
  }

  function getCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null
    );
  }

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-south-visible-completion-cycle-consumer");
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        recordError("CANVAS_RECEIPT_READ_FAILED", error && error.message ? error.message : String(error));
      }
    }

    return (
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      root.HEARTH_CANVAS_RECEIPT ||
      root.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT ||
      null
    );
  }

  function getNorthReceipt() {
    const north = refs.north || getNorthApi();

    if (north && isFunction(north.getReceipt)) {
      try {
        const receipt = north.getReceipt();
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        state.northReceiptError = error && error.message ? error.message : String(error);
        recordError("NORTH_RECEIPT_READ_FAILED", state.northReceiptError);
      }
    }

    return root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT || root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT || null;
  }

  function getEastReceipt() {
    return (
      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_INDEX_BRIDGE_RECEIPT ||
      root.HEARTH_INDEX_JS_RECEIPT ||
      null
    );
  }

  function getWestReceipt() {
    return (
      root.HEARTH_WEST_HANDOFF_ADMISSIBILITY_RECEIPT ||
      root.HEARTH_WEST_INDEX_HANDOFF_TABLE_RECEIPT ||
      null
    );
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";
      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthSouthVisibleCompletion = CONTRACT;
    mount.dataset.hearthSouthReceipt = RECEIPT;
    mount.dataset.hearthCycleSouth = "true";
    mount.dataset.hearthNorthFile = NORTH_FILE;
    mount.dataset.hearthEastFile = EAST_FILE;
    mount.dataset.hearthWestFile = WEST_FILE;
    mount.dataset.hearthSouthFile = SOUTH_FILE;
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";

    refs.mount = mount;
    state.mountReady = true;

    return mount;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-south-visible-completion-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-south-visible-completion-style";
    style.textContent = `
      .hearth-ledger-cockpit{transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{inset:auto 10px 10px 10px!important;min-height:132px!important;max-height:186px!important;overflow:hidden!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-head{padding:10px 14px 7px!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-kicker{font-size:.58rem!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-title{font-size:1rem!important;line-height:1.02!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-meta{display:none!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-latest{font-size:.63rem!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-progress{padding:7px 10px!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{display:none!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-actions{padding:7px 10px 10px!important;border-bottom:0!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{min-height:28px!important;padding:6px 9px!important;font-size:.56rem!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="expanded-cockpit"]{inset:10px!important;max-height:calc(100% - 20px)!important;min-height:170px!important;overflow:hidden!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(26px) scale(.985)!important;max-height:0!important;min-height:0!important;overflow:hidden!important;}
      [data-hearth-south-show-diagnostic-tab]{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));z-index:10000;display:none;align-items:center;justify-content:center;min-height:38px;padding:10px 14px;border-radius:999px;border:1px solid rgba(231,188,105,.66);color:#06101e;background:linear-gradient(135deg,#ffe8a3,#e7bc69);box-shadow:0 16px 44px rgba(0,0,0,.40), inset 0 1px 0 rgba(255,255,255,.28);font:950 .70rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;}
      html[data-hearth-south-planet-inspect="true"] [data-hearth-south-show-diagnostic-tab]{display:inline-flex;}
      html[data-hearth-south-planet-inspect="true"] #hearthCanvasMount,html[data-hearth-south-planet-inspect="true"] [data-hearth-canvas-mount="true"]{cursor:grab;}
      @media (max-width:760px){
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{inset:auto 8px 8px 8px!important;max-height:190px!important;}
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{flex:1 1 auto!important;min-width:28%!important;}
        [data-hearth-south-show-diagnostic-tab]{right:max(10px,env(safe-area-inset-right));bottom:max(68px,calc(env(safe-area-inset-bottom) + 68px));min-height:34px;padding:9px 12px;font-size:.64rem;}
      }
    `;

    doc.head.appendChild(style);
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthSouthShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthSouthShowDiagnosticTab = "true";
    tab.onclick = () => setCockpitMode("diagnostic-dock");

    refs.showTab = tab;
    state.showDiagnosticTabReady = true;

    return tab;
  }

  function createFallbackCockpit() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();
    if (!mount) return null;

    const cockpit = doc.createElement("aside");
    cockpit.id = COCKPIT_ID;
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthSouthCreatedFallbackCockpit = CONTRACT;
    cockpit.dataset.cockpitMode = "loading-cockpit";
    cockpit.setAttribute("aria-live", "polite");

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · South Visible Completion</div>
        <h2 class="hearth-ledger-title">COORDINATING HEARTH VISIBLE COMPLETION</h2>
        <div class="hearth-ledger-meta" data-hearth-stage-label>F13A · Canvas coordination</div>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>south=true · waiting for North</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=SOUTH_VISIBLE_COMPLETION_LOADED</div>
      </div>

      <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:72%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>72%</div>
      </div>

      <div class="hearth-ledger-actions">
        <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
        <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
        <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
        <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>
      </div>

      <div class="hearth-ledger-scroll">
        <div class="hearth-ledger-lanes" data-hearth-lane-list></div>
        <div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
          <pre data-hearth-receipt-text></pre>
        </div>
      </div>
    `;

    mount.appendChild(cockpit);
    return cockpit;
  }

  function hydrateCockpit() {
    if (!doc) return null;

    ensureStyle();
    ensureShowTab();

    const mount = refs.mount || ensureMount();

    let cockpit =
      doc.getElementById(COCKPIT_ID) ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']") ||
      doc.querySelector(".hearth-ledger-cockpit");

    if (!cockpit) cockpit = createFallbackCockpit();
    if (!cockpit) return null;

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

    cockpit.dataset.hearthSouthVisibleCompletion = CONTRACT;
    cockpit.dataset.hearthSouthReceipt = RECEIPT;
    cockpit.dataset.hearthCycleSouth = "true";
    cockpit.dataset.hearthNorthRuntimeTable = NORTH_FILE;
    cockpit.dataset.hearthGeneratedImage = "false";
    cockpit.dataset.hearthGraphicBox = "false";
    cockpit.dataset.hearthWebgl = "false";
    cockpit.dataset.hearthVisualPassClaimed = "false";
    cockpit.dataset.cockpitMode = cockpit.dataset.cockpitMode || "loading-cockpit";

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => setCockpitMode(state.dockHiddenForInspection ? "diagnostic-dock" : "planet-inspect");
    if (refs.expandButton) refs.expandButton.onclick = toggleExpanded;

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
        fallback.hidden = true;
        fallback.style.display = "none";
        fallback.dataset.hiddenBySouthVisibleCompletion = CONTRACT;
      });
    }

    state.cockpitFound = true;
    state.cockpitHydrated = true;
    state.copyDiagnosticReady = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.inspectPlanetControlReady = Boolean(refs.inspectButton);
    state.collapseExpandControlReady = Boolean(refs.expandButton);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);

    evaluateInspectTruth();

    return cockpit;
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);
    state.receiptVisible = visible;

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    scheduleRender();
  }

  function toggleExpanded() {
    if (state.cockpitMode === "expanded-cockpit") {
      setCockpitMode("diagnostic-dock");
    } else {
      setCockpitMode("expanded-cockpit");
    }
  }

  function setCockpitMode(mode) {
    if (!refs.cockpit) return;

    if (mode === "planet-inspect") {
      state.cockpitMode = "planet-inspect";
      state.dockHiddenForInspection = true;
      state.planetNotObstructed = true;
      state.cockpitExpanded = false;
    } else if (mode === "expanded-cockpit") {
      state.cockpitMode = "expanded-cockpit";
      state.dockHiddenForInspection = false;
      state.planetNotObstructed = false;
      state.cockpitExpanded = true;
    } else {
      state.cockpitMode = state.completionLatched || state.visibleContentProof ? "diagnostic-dock" : "loading-cockpit";
      state.dockHiddenForInspection = false;
      state.planetNotObstructed = false;
      state.cockpitExpanded = false;
    }

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.hearthSouthPlanetInspect = String(state.dockHiddenForInspection);

    if (refs.mount) {
      refs.mount.dataset.hearthSouthPlanetInspect = String(state.dockHiddenForInspection);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthSouthPlanetInspect = String(state.dockHiddenForInspection);
      doc.documentElement.dataset.hearthDiagnosticDockHiddenForInspection = String(state.dockHiddenForInspection);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !state.dockHiddenForInspection;
      refs.showTab.dataset.visible = String(state.dockHiddenForInspection);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.dockHiddenForInspection ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.expandButton) {
      refs.expandButton.textContent = state.cockpitMode === "expanded-cockpit" ? "Collapse dock" : "Collapse cockpit";
    }

    evaluateInspectTruth();
    reportSouthEvent(SOUTH_EVENTS.INSPECT_MODE_READY, {
      reason: "cockpit-mode-update",
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    });

    scheduleRender();
    publishGlobals();
  }

  function connectNorth() {
    const north = getNorthApi();

    refs.north = north;
    state.northAvailable = Boolean(north);
    state.northContract = north && north.contract ? String(north.contract) : "";

    if (!north) {
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      return null;
    }

    if (!refs.northSession && isFunction(north.createHearthCheckpointSession)) {
      try {
        refs.northSession = north.createHearthCheckpointSession({
          sessionId: "HEARTH-SOUTH-CYCLE-CONSUMER-SESSION",
          requestedBy: CONTRACT,
          southFile: SOUTH_FILE,
          isolatedSession: false
        });

        state.northSessionCreated = Boolean(refs.northSession);
        state.northSessionId = refs.northSession && refs.northSession.sessionId ? refs.northSession.sessionId : "";
      } catch (error) {
        state.northReceiptError = error && error.message ? error.message : String(error);
        recordError("NORTH_SESSION_CREATE_FAILED", state.northReceiptError);
      }
    }

    return north;
  }

  function submitToNorth(eventName, detail = {}) {
    const north = refs.north || connectNorth();
    const session = refs.northSession;

    if (!north && !session) {
      recordNorth("NORTH_NOT_AVAILABLE", { eventName });
      return null;
    }

    const payload = {
      event: eventName,
      id: eventName,
      phase: eventName,
      owner: "SOUTH",
      file: SOUTH_FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        ...buildSouthSnapshot(),
        ...clonePlain(detail || {})
      }
    };

    try {
      let result = null;

      if (session && isFunction(session.submitEvent)) {
        result = session.submitEvent(payload);
      } else if (north && isFunction(north.submitEvent)) {
        result = north.submitEvent(payload);
      } else if (north && isFunction(north.receiveEvent)) {
        result = north.receiveEvent(payload);
      }

      recordNorth(eventName, {
        result: clonePlain(result)
      });

      reconcileNorthReceipt();

      return result;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      recordError("NORTH_SUBMIT_FAILED", message, { eventName });
      return null;
    }
  }

  function reportSouthEvent(eventName, detail = {}) {
    const result = submitToNorth(eventName, detail);

    state.latestVisibleEvent = eventName;

    if (eventName === SOUTH_EVENTS.CANVAS_COORDINATION_STARTED) {
      state.currentStage = "F13A";
      state.highestStage = "F13A";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 78);
    }

    if (eventName === SOUTH_EVENTS.CANVAS_MOUNT_CONFIRMED) {
      state.currentStage = "F13B";
      state.highestStage = "F13B";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 81);
    }

    if (eventName === SOUTH_EVENTS.CANVAS_CONTEXT_READY) {
      state.currentStage = "F13C";
      state.highestStage = "F13C";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 84);
    }

    if (eventName === SOUTH_EVENTS.DRAG_INSPECTION_BOUND) {
      state.currentStage = "F13D";
      state.highestStage = "F13D";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 86);
    }

    if (eventName === SOUTH_EVENTS.ATLAS_TEXTURE_FRAME_READY) {
      state.currentStage = "F13E";
      state.highestStage = "F13E";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 93);
    }

    if (eventName === SOUTH_EVENTS.VISIBLE_CONTENT_PROOF_PASSED) {
      state.currentStage = "F13F";
      state.highestStage = "F13F";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);
    }

    if (eventName === SOUTH_EVENTS.INSPECT_MODE_READY) {
      state.currentStage = "F13G";
      state.highestStage = "F13G";
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);
    }

    if (eventName === SOUTH_EVENTS.COMPLETION_LATCHED) {
      state.currentStage = "F21";
      state.highestStage = "F21";
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      state.completionLatched = true;
      state.finalReceiptAvailable = true;
    }

    if (result && result.action === "HARD_BLOCK") {
      state.firstFailedCoordinate = `NORTH_HARD_BLOCK_${String(result.reason || "UNKNOWN").toUpperCase()}`;
      state.recommendedNextRenewalTarget = result.recommendedNextFile || state.recommendedNextRenewalTarget;
    }

    publishGlobals();
    scheduleRender();
    return result;
  }

  function reconcileNorthReceipt() {
    const receipt = getNorthReceipt();

    state.northReceiptAvailable = Boolean(receipt);

    if (!receipt || !isObject(receipt)) return null;

    state.northF21Allowed = bool(receipt.f21Allowed, state.northF21Allowed);
    state.northNewsGatePassedBeforeF21 = bool(receipt.newsGatePassedBeforeF21, state.northNewsGatePassedBeforeF21);
    state.northActiveCheckpointId = receipt.activeCheckpointId || state.northActiveCheckpointId;
    state.northRecommendedNextOwner = receipt.recommendedNextOwner || state.northRecommendedNextOwner;
    state.northRecommendedNextFile = receipt.recommendedNextFile || state.northRecommendedNextFile;
    state.step1AcceptedBySouth = bool(receipt.eastGateReady, state.step1AcceptedBySouth);
    state.handoffAdmissibleByWest = bool(receipt.westGateReady, state.handoffAdmissibleByWest);

    if (!state.completionLatched && receipt.recommendedNextFile) {
      state.recommendedNextRenewalTarget = receipt.recommendedNextFile;
    }

    return receipt;
  }

  function selectCanvasMethod(api) {
    if (api && isFunction(api.bootCooperative)) return "bootCooperative";
    if (api && isFunction(api.boot)) return "boot";
    if (api && isFunction(api.mountVisibleCarrier)) return "mountVisibleCarrier";
    if (api && isFunction(api.bootVisibleCarrier)) return "bootVisibleCarrier";
    if (api && isFunction(api.mount)) return "mount";
    if (api && isFunction(api.start)) return "start";
    if (api && isFunction(api.init)) return "init";
    if (api && isFunction(api.render)) return "render";
    return "";
  }

  function canvasPayload() {
    return {
      calledBy: CONTRACT,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      route: ROUTE,
      mountId: MOUNT_ID,
      mount: refs.mount || ensureMount(),
      pairedSemiconductor: true,
      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,
      southVisibleCompletionConsumer: true,
      northCheckpointAuthority: NORTH_FILE,
      visibleContentCompletionGate: true,
      inspectModeGate: true,
      sourceAuthorityHeld: true,
      climateRouteRetired: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      callbacks: {
        onCanvasPhase: handleCanvasPhase,
        onCanvasProgress: handleCanvasPhase,
        onMounted: (receipt) => handleCanvasReceipt(receipt, "onMounted"),
        onFirstFrame: (receipt) => handleCanvasReceipt(receipt, "onFirstFrame"),
        onRendered: (receipt) => handleCanvasReceipt(receipt, "onRendered"),
        onDragBound: (receipt) => handleCanvasReceipt(receipt, "onDragBound"),
        onReady: (receipt) => handleCanvasReceipt(receipt, "onReady"),
        onError: (receipt) => handleCanvasReceipt(receipt, "onError")
      }
    };
  }

  function callCanvasCarrier() {
    if (canvasBootRequested || state.completionLatched) return;

    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    if (!api) {
      deriveFailureCoordinate();
      scheduleRender();
      return;
    }

    const method = selectCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no boot/mount method exists.";
      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);
      deriveFailureCoordinate();
      return;
    }

    canvasBootRequested = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.cooperativeBootAvailable = Boolean(isFunction(api.bootCooperative));
    state.cooperativeBootUsed = method === "bootCooperative";
    state.syncBootFallbackUsed = method !== "bootCooperative";

    reportSouthEvent(SOUTH_EVENTS.CANVAS_COORDINATION_STARTED, {
      canvasCarrierRequested: true,
      method,
      cooperativeBootUsed: state.cooperativeBootUsed
    });

    try {
      const result = api[method](canvasPayload());
      state.canvasCarrierHandoffOk = true;

      if (result && isFunction(result.then)) {
        result
          .then((receipt) => handleCanvasReceipt(receipt, "canvas-promise-resolved"))
          .catch((error) => {
            state.canvasCarrierHandoffOk = false;
            state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
            recordError("CANVAS_PROMISE_REJECTED", state.canvasCarrierHandoffError);
          });
      } else if (result && isObject(result)) {
        handleCanvasReceipt(result, "canvas-method-returned-receipt");
      }
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });
    }
  }

  function handleCanvasPhase(event = {}) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const percent = clamp(number(event.percent ?? event.progress ?? detail.progress ?? 0, 0), 0, 100);
    const message = event.message || phase;

    if (state.completionLatched) {
      state.phaseEvents.push({
        at: nowIso(),
        phase,
        percent,
        message: `${message} archived after F21`,
        detail: clonePlain(detail)
      });
      return event;
    }

    state.phaseEvents.push({
      at: nowIso(),
      phase,
      percent,
      message,
      detail: clonePlain(detail)
    });

    if (state.phaseEvents.length > 180) {
      state.phaseEvents.splice(0, state.phaseEvents.length - 180);
    }

    applyCanvasTruth(phase, detail);

    if (phase === "CANVAS_MOUNT_CREATED") {
      reportSouthEvent(SOUTH_EVENTS.CANVAS_MOUNT_CONFIRMED, detail);
    }

    if (phase === "CANVAS_CONTEXT_READY") {
      reportSouthEvent(SOUTH_EVENTS.CANVAS_CONTEXT_READY, detail);
    }

    if (phase === "DRAG_INSPECTION_BOUND") {
      reportSouthEvent(SOUTH_EVENTS.DRAG_INSPECTION_BOUND, detail);
    }

    if (
      phase === "ATLAS_BUILD_COMPLETE" ||
      phase === "TEXTURE_COMPOSE_COMPLETE" ||
      phase === "FIRST_FRAME_DETECTED" ||
      phase === "CANVAS_READY"
    ) {
      if (state.atlasBuildComplete || state.textureComposeComplete || state.firstFrameDetected || state.canvasReady) {
        reportSouthEvent(SOUTH_EVENTS.ATLAS_TEXTURE_FRAME_READY, detail);
      }
    }

    if (phase === "CANVAS_READY") {
      startVisibleContentProof("canvas-ready");
      root.setTimeout(() => startVisibleContentProof("canvas-ready-post-frame"), 120);
      root.setTimeout(() => startVisibleContentProof("canvas-ready-late-frame"), 360);
    }

    evaluateSouthGate();
    maybeRequestCompletion(`canvas-phase-${phase}`);
    scheduleRender();

    return event;
  }

  function applyCanvasTruth(phase, detail = {}) {
    if (phase === "CANVAS_MOUNT_CREATED") {
      state.canvasCarrierMounted = true;
      state.canvasCarrierHandoffOk = true;
    }

    if (phase === "CANVAS_CONTEXT_READY") {
      state.canvasContextReady = true;
    }

    if (phase === "DRAG_INSPECTION_BOUND") {
      state.dragInspectionBound = true;
    }

    if (phase === "ATLAS_BUILD_STARTED") {
      state.atlasBuildStarted = true;
    }

    if (phase === "ATLAS_BUILD_PROGRESS") {
      state.atlasBuildStarted = true;
      state.atlasBuildProgress = Math.max(state.atlasBuildProgress, number(detail.atlasBuildProgress || detail.progress, 0));
      state.progressOnlyEvents.push({
        at: nowIso(),
        phase,
        progress: state.atlasBuildProgress,
        detail: clonePlain(detail)
      });
    }

    if (phase === "ATLAS_BUILD_COMPLETE") {
      state.atlasBuildStarted = true;
      state.atlasBuildComplete = true;
      state.atlasBuildProgress = 100;
    }

    if (phase === "TEXTURE_COMPOSE_STARTED") {
      state.textureComposeStarted = true;
    }

    if (phase === "TEXTURE_COMPOSE_PROGRESS") {
      state.textureComposeStarted = true;
      state.textureComposeProgress = Math.max(state.textureComposeProgress, number(detail.textureComposeProgress || detail.progress, 0));
      state.progressOnlyEvents.push({
        at: nowIso(),
        phase,
        progress: state.textureComposeProgress,
        detail: clonePlain(detail)
      });
    }

    if (phase === "TEXTURE_COMPOSE_COMPLETE") {
      state.textureComposeStarted = true;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
      state.renderedAfterTexture = true;
    }

    if (phase === "FIRST_FRAME_REQUESTED") {
      state.firstFrameRequested = true;
    }

    if (phase === "FIRST_FRAME_DETECTED") {
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
    }

    if (phase === "CANVAS_READY") {
      state.canvasReady = true;
      state.canvasCarrierMounted = true;
      state.canvasContextReady = true;
      state.canvasCarrierHandoffOk = true;
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.dragInspectionBound = true;
      state.atlasBuildStarted = true;
      state.atlasBuildComplete = true;
      state.atlasBuildProgress = 100;
      state.textureComposeStarted = true;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
      state.renderedAfterTexture = true;
    }
  }

  function handleCanvasReceipt(receipt, reason = "canvas-receipt") {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
      handleCanvasReceiptLight(value);

      if (Array.isArray(value.phaseEvents)) {
        value.phaseEvents.forEach((event) => {
          if (event && event.phase) handleCanvasPhase(event);
        });
      }
    }

    if (state.canvasReady || state.imageRendered || state.firstFrameDetected) {
      startVisibleContentProof(`receipt-${reason}`);
    }

    evaluateSouthGate();
    maybeRequestCompletion(`receipt-${reason}`);
    scheduleRender();
  }

  function handleCanvasReceiptLight(value) {
    state.cooperativeBootAvailable = Boolean(state.cooperativeBootAvailable || value.cooperativeBootAvailable);
    state.cooperativeBootUsed = Boolean(state.cooperativeBootUsed || value.cooperativeBootUsed);
    state.syncBootFallbackUsed = Boolean(state.syncBootFallbackUsed || value.syncBootFallbackUsed);

    state.canvasCarrierMounted = Boolean(
      state.canvasCarrierMounted ||
      value.canvasCarrierMounted ||
      value.visibleCarrierMounted ||
      value.mounted ||
      value.canvasMounted
    );

    state.canvasContextReady = Boolean(state.canvasContextReady || value.canvasContextReady || value.contextReady || value.canvasReady);
    state.canvasCarrierHandoffOk = Boolean(state.canvasCarrierHandoffOk || state.canvasCarrierMounted || value.canvasCarrierHandoffOk || value.handoffOk);
    state.firstFrameRequested = Boolean(state.firstFrameRequested || value.firstFrameRequested);
    state.firstFrameDetected = Boolean(state.firstFrameDetected || value.firstFrameDetected);
    state.imageRendered = Boolean(state.imageRendered || value.imageRendered);
    state.dragInspectionBound = Boolean(state.dragInspectionBound || value.dragInspectionBound || value.pointerControlsBound || value.controlsBound);
    state.canvasReady = Boolean(state.canvasReady || value.canvasReady);

    state.atlasBuildStarted = Boolean(state.atlasBuildStarted || value.atlasBuildStarted);
    state.atlasBuildProgress = Math.max(number(state.atlasBuildProgress, 0), number(value.atlasBuildProgress, 0));
    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || value.atlasBuildComplete);

    state.textureComposeStarted = Boolean(state.textureComposeStarted || value.textureComposeStarted);
    state.textureComposeProgress = Math.max(number(state.textureComposeProgress, 0), number(value.textureComposeProgress, 0));
    state.textureComposeComplete = Boolean(state.textureComposeComplete || value.textureComposeComplete);
    state.renderedAfterTexture = Boolean(state.renderedAfterTexture || state.textureComposeComplete || value.renderedAfterTexture);

    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || value.visiblePlanetAvailable);
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || value.planetCanvasPresent);
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || value.planetCanvasNonZeroSize);
    state.planetFramePainted = Boolean(state.planetFramePainted || value.planetFramePainted);
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || value.nonblankPlanetVisible);

    if (explicitReceiptContentProof(value)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofStarted = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
    }
  }

  function explicitReceiptContentProof(value) {
    if (!isObject(value)) return false;

    const keys = [
      "atlasPainted",
      "textureApplied",
      "surfaceTextureApplied",
      "planetTexturePainted",
      "visibleContentPainted",
      "visibleContentProof",
      "visibleHearthContentPainted",
      "atlasAppliedToPlanet",
      "textureAppliedToPlanet",
      "surfaceAtlasPainted",
      "landWaterTexturePainted",
      "nonblankPlanetVisible",
      "visiblePlanetAvailable"
    ];

    for (const key of keys) {
      if (value[key] === true || value[key] === "true") return true;
    }

    const nested = [value.state, value.receipt, value.postgame, value.canvasState, value.renderState].filter(isObject);

    for (const item of nested) {
      for (const key of keys) {
        if (item[key] === true || item[key] === "true") return true;
      }
    }

    return false;
  }

  function getPlanetCanvas() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();

    return (
      (mount && mount.querySelector("canvas")) ||
      doc.querySelector("#hearthCanvasMount canvas") ||
      doc.querySelector("[data-hearth-canvas-mount='true'] canvas")
    );
  }

  function startVisibleContentProof(reason = "manual") {
    if (state.completionLatched) return true;

    state.visibleContentProofStarted = true;

    const passed = proveVisibleContent(reason);

    if (passed) {
      reportSouthEvent(SOUTH_EVENTS.VISIBLE_CONTENT_PROOF_PASSED, {
        reason,
        visibleContentProof: true,
        visiblePlanetAvailable: true,
        nonblankPlanetVisible: true,
        carrierOnlyDetected: false
      });
    }

    evaluateInspectTruth();
    evaluateSouthGate();
    maybeRequestCompletion(`visible-content-proof-${reason}`);

    return passed;
  }

  function proveVisibleContent(reason = "manual") {
    const receipt = getCanvasReceipt();

    if (explicitReceiptContentProof(receipt)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.visibleContentProofError = "";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      return true;
    }

    const pixelProof = sampleVisibleContent(reason);

    if (pixelProof.passed) {
      state.visibleContentProof = true;
      state.visibleContentProofMethod = pixelProof.method;
      state.visibleContentProofError = "";
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      state.carrierOnlyDetected = false;
      return true;
    }

    state.visibleContentProof = false;
    state.visibleContentProofMethod = pixelProof.method || "pending";
    state.visibleContentProofError = pixelProof.error || "";
    state.visiblePlanetAvailable = false;
    state.carrierOnlyDetected = true;
    return false;
  }

  function sampleVisibleContent(reason = "manual") {
    const canvas = getPlanetCanvas();
    state.planetCanvasPresent = Boolean(canvas);

    let rect = null;

    try {
      rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    state.planetCanvasNonZeroSize = Boolean(
      canvas &&
      (
        (number(canvas.width, 0) > 0 && number(canvas.height, 0) > 0) ||
        (rect && rect.width > 0 && rect.height > 0)
      )
    );

    if (!canvas || !state.planetCanvasNonZeroSize) {
      return {
        passed: false,
        method: "canvas-missing-or-zero-size",
        error: "Planet canvas missing or zero size."
      };
    }

    let ctx = null;
    let width = 0;
    let height = 0;

    try {
      ctx = canvas.getContext && canvas.getContext("2d", { willReadFrequently: true });
      width = Math.max(1, number(canvas.width || Math.floor(rect?.width || 0), 0));
      height = Math.max(1, number(canvas.height || Math.floor(rect?.height || 0), 0));
    } catch (error) {
      return {
        passed: false,
        method: "canvas-pixel-sample-unavailable",
        error: error && error.message ? error.message : String(error)
      };
    }

    if (!ctx || width <= 1 || height <= 1) {
      return {
        passed: false,
        method: "canvas-context-unavailable",
        error: "Canvas 2D context unavailable for content proof."
      };
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const classes = new Set();
    const colors = [];

    let sampleCount = 0;
    let nonblank = 0;
    let land = 0;
    let water = 0;
    let other = 0;
    let carrier = 0;

    const grid = 17;

    try {
      for (let gy = 0; gy < grid; gy += 1) {
        for (let gx = 0; gx < grid; gx += 1) {
          const nx = (gx + 0.5) / grid;
          const ny = (gy + 0.5) / grid;
          const x = Math.floor(width * (0.12 + nx * 0.76));
          const y = Math.floor(height * (0.12 + ny * 0.76));
          const dx = x - cx;
          const dy = y - cy;

          if (Math.sqrt(dx * dx + dy * dy) > radius) continue;

          const data = ctx.getImageData(clamp(x, 0, width - 1), clamp(y, 0, height - 1), 1, 1).data;
          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;
          const lum = (r + g + b) / 3;

          sampleCount += 1;

          if (a < 16 || lum < 16) continue;

          nonblank += 1;
          colors.push([r, g, b]);

          const className = classifyContentColor(r, g, b, a);

          if (className === "land") {
            land += 1;
            classes.add("land");
          } else if (className === "water") {
            water += 1;
            classes.add("water");
          } else if (className === "content-other") {
            other += 1;
            classes.add("content-other");
          } else {
            carrier += 1;
          }
        }
      }
    } catch (error) {
      return {
        passed: false,
        method: "canvas-pixel-sample-failed",
        error: error && error.message ? error.message : String(error)
      };
    }

    const variance = computeColorVariance(colors);
    const classCount = classes.size;

    state.visibleContentSampleCount = sampleCount;
    state.visibleContentVarianceScore = Math.round(variance * 100) / 100;
    state.visibleContentClassCount = classCount;
    state.visibleContentClasses = Array.from(classes);
    state.visibleContentLandSampleCount = land;
    state.visibleContentWaterSampleCount = water;
    state.visibleContentOtherSampleCount = other;
    state.planetFramePainted = Boolean(nonblank > 12 && (state.firstFrameDetected || state.imageRendered || state.canvasReady));
    state.nonblankPlanetVisible = Boolean(nonblank > 12);

    const hasLand = land >= 4;
    const hasWaterOrOther = water >= 6 || other >= 6;
    const enoughVariance = variance >= 12;
    const enoughSamples = sampleCount >= 60 && nonblank >= 28;
    const passed = Boolean(enoughSamples && enoughVariance && hasLand && hasWaterOrOther && (state.textureComposeComplete || state.canvasReady || state.imageRendered));

    state.carrierOnlyDetected = !passed;

    return {
      passed,
      method: passed ? "canvas-pixel-content-sample" : "carrier-only-or-insufficient-content-sample",
      error: passed ? "" : `Visible content sample failed: samples=${sampleCount}, nonblank=${nonblank}, variance=${Math.round(variance * 100) / 100}, classes=${classCount}, land=${land}, water=${water}, other=${other}, carrier=${carrier}, reason=${reason}`
    };
  }

  function classifyContentColor(r, g, b, a) {
    if (a < 16) return "blank";

    const lum = (r + g + b) / 3;
    if (lum < 18) return "carrier";

    const blueDominant = b >= r + 10 && b >= g - 6;
    const mutedBlueCarrier = blueDominant && b < 72 && g < 72 && r < 60;
    if (mutedBlueCarrier) return "carrier";

    const landGreen = g >= 48 && r >= 28 && b <= 118 && g >= b + 8;
    const landBrown = r >= 52 && g >= 42 && b <= 95 && r >= b + 12 && g >= b + 4;
    const landYellow = r >= 70 && g >= 62 && b <= 120 && Math.abs(r - g) <= 52;

    if (landGreen || landBrown || landYellow) return "land";

    const waterBlue = b >= 52 && b >= r + 8 && b >= g - 10 && g >= 28;
    const waterTeal = g >= 46 && b >= 46 && r <= 62 && Math.abs(g - b) <= 45;

    if (waterBlue || waterTeal) return "water";

    if (lum >= 52 && Math.max(r, g, b) - Math.min(r, g, b) >= 20) return "content-other";

    return "carrier";
  }

  function computeColorVariance(colors) {
    if (!colors.length) return 0;

    let r = 0;
    let g = 0;
    let b = 0;

    colors.forEach((color) => {
      r += color[0];
      g += color[1];
      b += color[2];
    });

    r /= colors.length;
    g /= colors.length;
    b /= colors.length;

    let total = 0;

    colors.forEach((color) => {
      total += Math.pow(color[0] - r, 2);
      total += Math.pow(color[1] - g, 2);
      total += Math.pow(color[2] - b, 2);
    });

    return Math.sqrt(total / (colors.length * 3));
  }

  function evaluateInspectTruth() {
    state.showDiagnosticTabReady = Boolean(refs.showTab);
    state.copyDiagnosticReady = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.inspectPlanetControlReady = Boolean(refs.inspectButton);
    state.collapseExpandControlReady = Boolean(refs.expandButton);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);
    state.diagnosticDockReady = Boolean(refs.cockpit && refs.showTab);

    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.diagnosticDockReady &&
      state.showDiagnosticTabReady &&
      state.copyDiagnosticReady &&
      state.receiptToggleReady &&
      state.inspectPlanetControlReady &&
      state.collapseExpandControlReady &&
      state.buttonsReachable
    );

    return state.diagnosticCanLeavePlanetFrame;
  }

  function evaluateSouthGate() {
    evaluateInspectTruth();

    state.southGateReady = Boolean(
      state.visibleContentProof &&
      state.visiblePlanetAvailable &&
      state.nonblankPlanetVisible &&
      state.imageRendered &&
      state.firstFrameDetected &&
      state.dragInspectionBound &&
      state.diagnosticCanLeavePlanetFrame
    );

    if (state.southGateReady) {
      reportSouthEvent(SOUTH_EVENTS.INSPECT_MODE_READY, {
        reason: "south-gate-ready",
        southGateReady: true
      });
    }

    return state.southGateReady;
  }

  function maybeRequestCompletion(reason = "manual") {
    reconcileNorthReceipt();
    evaluateSouthGate();

    if (state.completionLatched) return true;

    if (!state.southGateReady) {
      deriveFailureCoordinate();
      return false;
    }

    if (!state.northF21Allowed && !state.northNewsGatePassedBeforeF21) {
      state.firstFailedCoordinate = "WAITING_NORTH_F21_PERMISSION";
      state.recommendedNextRenewalTarget = state.northRecommendedNextFile || NORTH_FILE;
      return false;
    }

    state.completionRequestedFromNorth = true;

    const result = reportSouthEvent(SOUTH_EVENTS.COMPLETION_LATCHED, {
      reason,
      southGateReady: true,
      northF21Allowed: state.northF21Allowed,
      northNewsGatePassedBeforeF21: state.northNewsGatePassedBeforeF21
    });

    if (result && result.action === "ADMIT") {
      state.completionLatched = true;
      state.f21AfterNorthPermission = true;
      state.finalReceiptAvailable = true;
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      state.currentStage = "F21";
      state.highestStage = "F21";
      state.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
      state.firstFailedCoordinate = "NONE_F21_LATCHED_BY_NORTH_PERMISSION";
      state.recommendedNextRenewalTarget = "read-south-final-receipt";
      setCockpitMode("diagnostic-dock");
      return true;
    }

    reconcileNorthReceipt();

    if (state.northF21Allowed || state.northNewsGatePassedBeforeF21) {
      state.completionLatched = true;
      state.f21AfterNorthPermission = true;
      state.finalReceiptAvailable = true;
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      state.currentStage = "F21";
      state.highestStage = "F21";
      state.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
      state.firstFailedCoordinate = "NONE_F21_LATCHED_BY_NORTH_PERMISSION";
      state.recommendedNextRenewalTarget = "read-south-final-receipt";
      setCockpitMode("diagnostic-dock");
      return true;
    }

    deriveFailureCoordinate();
    return false;
  }

  function deriveFailureCoordinate() {
    if (state.completionLatched) {
      state.firstFailedCoordinate = "NONE_F21_LATCHED_BY_NORTH_PERMISSION";
      state.recommendedNextRenewalTarget = "read-south-final-receipt";
      return;
    }

    if (!state.northAvailable) {
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      return;
    }

    if (!state.canvasApiPresent) {
      state.firstFailedCoordinate = "WAITING_CANVAS_API";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.canvasCarrierMounted) {
      state.firstFailedCoordinate = "WAITING_CANVAS_MOUNT_CONFIRMED";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    if (!state.canvasContextReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_CONTEXT_READY";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    if (!state.dragInspectionBound) {
      state.firstFailedCoordinate = "WAITING_DRAG_INSPECTION_BOUND";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    if (!(state.atlasBuildComplete || state.textureComposeComplete || state.firstFrameDetected || state.imageRendered)) {
      state.firstFailedCoordinate = "WAITING_ATLAS_TEXTURE_FRAME_READY";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.visibleContentProof) {
      state.firstFailedCoordinate = "WAITING_VISIBLE_CONTENT_PROOF";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    if (!state.diagnosticCanLeavePlanetFrame) {
      state.firstFailedCoordinate = "WAITING_INSPECT_MODE_READY";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    if (!state.northF21Allowed && !state.northNewsGatePassedBeforeF21) {
      state.firstFailedCoordinate = "WAITING_NORTH_F21_PERMISSION";
      state.recommendedNextRenewalTarget = state.northRecommendedNextFile || NORTH_FILE;
      return;
    }

    state.firstFailedCoordinate = "WAITING_COMPLETION_LATCH";
    state.recommendedNextRenewalTarget = SOUTH_FILE;
  }

  function buildSouthSnapshot() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: SOUTH_FILE,
      owner: "SOUTH",

      canvasApiPresent: state.canvasApiPresent,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMethod: state.canvasCarrierMethod,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      dragInspectionBound: state.dragInspectionBound,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,

      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      carrierOnlyDetected: state.carrierOnlyDetected,

      inspectModeAvailable: state.inspectPlanetControlReady,
      inspectPlanetControlAvailable: state.inspectPlanetControlReady,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable: state.showDiagnosticTabReady,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabReady,
      copyDiagnosticPreserved: state.copyDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: true,

      southGateReady: state.southGateReady,
      completionLatched: state.completionLatched,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function reconcileFromDataset() {
    const dataset = getDataset();

    state.canvasReady = Boolean(state.canvasReady || bool(dataset.hearthCanvasReady));
    state.canvasCarrierMounted = Boolean(state.canvasCarrierMounted || bool(dataset.hearthCanvasCarrierMounted));
    state.canvasContextReady = Boolean(state.canvasContextReady || bool(dataset.hearthCanvasContextReady));
    state.firstFrameDetected = Boolean(state.firstFrameDetected || bool(dataset.hearthFirstFrameDetected));
    state.imageRendered = Boolean(state.imageRendered || bool(dataset.hearthImageRendered) || bool(dataset.hearthCanvasImageRendered));
    state.dragInspectionBound = Boolean(state.dragInspectionBound || bool(dataset.hearthDragInspectionBound) || bool(dataset.hearthControlsBound));

    state.visibleContentProof = Boolean(state.visibleContentProof || bool(dataset.hearthVisibleContentProof));
    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || bool(dataset.hearthVisiblePlanetAvailable));
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || bool(dataset.hearthPlanetCanvasPresent));
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || bool(dataset.hearthPlanetCanvasNonZeroSize));
    state.planetFramePainted = Boolean(state.planetFramePainted || bool(dataset.hearthPlanetFramePainted));
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || bool(dataset.hearthNonblankPlanetVisible));

    state.diagnosticCanLeavePlanetFrame = Boolean(state.diagnosticCanLeavePlanetFrame || bool(dataset.hearthDiagnosticCanLeavePlanetFrame));
    state.northF21Allowed = Boolean(state.northF21Allowed || bool(dataset.hearthF21Allowed));
    state.northNewsGatePassedBeforeF21 = Boolean(state.northNewsGatePassedBeforeF21 || bool(dataset.hearthNewsGatePassedBeforeF21));
  }

  function reconcileAll(reason = "manual") {
    connectNorth();
    reconcileFromDataset();

    const canvasReceipt = getCanvasReceipt();
    if (canvasReceipt && isObject(canvasReceipt)) {
      handleCanvasReceiptLight(canvasReceipt);
    }

    if (state.canvasReady || state.imageRendered || state.firstFrameDetected) {
      startVisibleContentProof(`reconcile-${reason}`);
    }

    evaluateInspectTruth();
    evaluateSouthGate();
    reconcileNorthReceipt();
    maybeRequestCompletion(`reconcile-${reason}`);
    deriveFailureCoordinate();
    publishGlobals();
    scheduleRender();
  }

  function renderLaneMarkup() {
    const lanes = [
      ["North", state.northAvailable ? "READY" : "WAITING", state.northActiveCheckpointId || "north-command-runtime-table"],
      ["Canvas", state.canvasReady ? "READY" : state.canvasCarrierRequested ? "ACTIVE" : "WAITING", state.canvasCarrierMethod || "canvas coordination"],
      ["Frame", state.imageRendered ? "READY" : "PENDING", "atlas · texture · first frame"],
      ["Proof", state.visibleContentProof ? "READY" : "PENDING", state.visibleContentProofMethod || "visible content proof"],
      ["Inspect", state.diagnosticCanLeavePlanetFrame ? "READY" : "PENDING", "dock hide/show · copy · receipt"],
      ["F21", state.completionLatched ? "LATCHED" : state.northF21Allowed ? "ALLOWED" : "WAITING", state.firstFailedCoordinate]
    ];

    return lanes.map((lane) => {
      const progress =
        lane[1] === "LATCHED" ? 100 :
        lane[1] === "READY" ? 98 :
        lane[1] === "ALLOWED" ? 98 :
        lane[1] === "ACTIVE" ? 86 :
        42;

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(lane[0])}" data-status="${escapeHtml(lane[1])}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(lane[0])}</strong>
              <span>${escapeHtml(lane[2])}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(lane[1])}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
        </section>
      `;
    }).join("");
  }

  function computeProgress() {
    if (state.completionLatched) {
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      return 100;
    }

    let progress = 72;

    if (state.canvasCarrierRequested) progress = Math.max(progress, 78);
    if (state.canvasCarrierMounted) progress = Math.max(progress, 81);
    if (state.canvasContextReady) progress = Math.max(progress, 84);
    if (state.dragInspectionBound) progress = Math.max(progress, 86);
    if (state.atlasBuildComplete || state.textureComposeComplete || state.firstFrameDetected || state.imageRendered) progress = Math.max(progress, 93);
    if (state.visibleContentProof) progress = Math.max(progress, 98);
    if (state.diagnosticCanLeavePlanetFrame) progress = Math.max(progress, 98);

    state.mainDisplayProgress = Math.min(98, progress);
    state.mainProgressCap = 98;

    return Math.round(state.mainDisplayProgress);
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function render() {
    if (!refs.cockpit) return;

    const progress = computeProgress();
    const elapsed = state.startedAt ? nowMs() - new Date(state.startedAt).getTime() : 0;

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : state.visibleContentProof
          ? "VISIBLE PROOF HELD · WAITING FOR F21"
          : "COORDINATING HEARTH VISIBLE COMPLETION";
    }

    if (refs.stage) {
      refs.stage.textContent = `${state.currentStage} · South visible completion`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = `south=true · north=${state.northAvailable} · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestVisibleEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;
    if (refs.laneList) refs.laneList.innerHTML = renderLaneMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.hearthSouthVisibleContentProof = String(state.visibleContentProof);
    refs.cockpit.dataset.hearthSouthGateReady = String(state.southGateReady);
    refs.cockpit.dataset.hearthSouthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;

    publishStatusNode();
    publishGlobals();
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth South visible completion cycle consumer active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${SOUTH_FILE}`,
      `North file ${NORTH_FILE}`,
      `South owns visible completion true`,
      `South owns North runtime table false`,
      `South owns canvas drawing false`,
      `North available ${state.northAvailable}`,
      `North F21 allowed ${state.northF21Allowed}`,
      `South gate ready ${state.southGateReady}`,
      `Visible content proof ${state.visibleContentProof}`,
      `Inspect ready ${state.diagnosticCanLeavePlanetFrame}`,
      `Completion latched ${state.completionLatched}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Generated image false`,
      `GraphicBox false`,
      `WebGL false`,
      `Visual pass claimed false`,
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
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
      }, 1200);
    }

    recordLocal("SOUTH_DIAGNOSTIC_COPIED", { ok });
    return ok;
  }

  function getReceipt() {
    reconcileNorthReceipt();
    evaluateInspectTruth();
    evaluateSouthGate();
    deriveFailureCoordinate();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: SOUTH_FILE,
      route: ROUTE,
      role: state.role,

      pairedSemiconductor: true,
      pairedWith: EAST_FILE,
      cycleOrder: state.cycleOrder,

      ownsSouth: true,
      ownsEast: false,
      ownsWest: false,
      ownsNorth: false,
      ownsStep1: false,
      ownsStep1Handoff: false,
      ownsNorthRuntimeTable: false,
      ownsCanvasDrawing: false,
      ownsVisibleCompletion: true,
      ownsVisiblePlanetProof: true,
      ownsInspectModeTruth: true,
      ownsFinalDiagnosticReceipt: true,
      ownsFinalVisualPassClaim: false,

      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,
      canvasFile: CANVAS_FILE,

      northAvailable: state.northAvailable,
      northContract: state.northContract,
      northSessionCreated: state.northSessionCreated,
      northSessionId: state.northSessionId,
      northReceiptAvailable: state.northReceiptAvailable,
      northReceiptError: state.northReceiptError,
      northF21Allowed: state.northF21Allowed,
      northNewsGatePassedBeforeF21: state.northNewsGatePassedBeforeF21,
      northActiveCheckpointId: state.northActiveCheckpointId,
      northRecommendedNextOwner: state.northRecommendedNextOwner,
      northRecommendedNextFile: state.northRecommendedNextFile,

      step1AcceptedBySouth: state.step1AcceptedBySouth,
      handoffAdmissibleByWest: state.handoffAdmissibleByWest,

      mountReady: state.mountReady,
      cockpitFound: state.cockpitFound,
      cockpitHydrated: state.cockpitHydrated,
      diagnosticDockReady: state.diagnosticDockReady,
      showDiagnosticTabReady: state.showDiagnosticTabReady,
      copyDiagnosticReady: state.copyDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      inspectPlanetControlReady: state.inspectPlanetControlReady,
      collapseExpandControlReady: state.collapseExpandControlReady,
      buttonsReachable: state.buttonsReachable,
      receiptVisible: state.receiptVisible,
      cockpitMode: state.cockpitMode,
      cockpitExpanded: state.cockpitExpanded,
      dockHiddenForInspection: state.dockHiddenForInspection,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      planetNotObstructed: state.planetNotObstructed,

      canvasApiPresent: state.canvasApiPresent,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMethod: state.canvasCarrierMethod,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      dragInspectionBound: state.dragInspectionBound,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.join(","),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,
      explicitContentReceiptProof: state.explicitContentReceiptProof,
      renderedAfterTexture: state.renderedAfterTexture,

      visiblePlanetAvailable: state.visiblePlanetAvailable,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,

      southGateReady: state.southGateReady,
      completionRequestedFromNorth: state.completionRequestedFromNorth,
      completionLatched: state.completionLatched,
      f21AfterNorthPermission: state.f21AfterNorthPermission,
      finalReceiptAvailable: state.finalReceiptAvailable,

      mainDisplayProgress: state.mainDisplayProgress,
      mainProgressCap: state.mainProgressCap,
      currentStage: state.currentStage,
      highestStage: state.highestStage,
      latestVisibleEvent: state.latestVisibleEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      sourceAuthorityHeld: true,
      climateRouteRetired: true,
      northRuntimeTableMutation: false,
      canvasMutation: false,

      phaseEvents: clonePlain(state.phaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      localEvents: clonePlain(state.localEvents),
      northEvents: clonePlain(state.northEvents),
      sourceStackHeld: SOURCE_STACK_HELD.slice(),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const phaseText = receipt.phaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const progressText = receipt.progressOnlyEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.progress || ""}`
    )).join("\n") || "- none";

    const localText = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const northText = receipt.northEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const errorsText = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    const sourceStackText = receipt.sourceStackHeld.map((file) => `- ${file}`).join("\n");

    return [
      "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER_RECEIPT",
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
      `pairedSemiconductor=${receipt.pairedSemiconductor}`,
      `pairedWith=${receipt.pairedWith}`,
      `cycleOrder=${receipt.cycleOrder}`,
      "",
      `ownsSouth=${receipt.ownsSouth}`,
      `ownsEast=${receipt.ownsEast}`,
      `ownsWest=${receipt.ownsWest}`,
      `ownsNorth=${receipt.ownsNorth}`,
      `ownsStep1=${receipt.ownsStep1}`,
      `ownsStep1Handoff=${receipt.ownsStep1Handoff}`,
      `ownsNorthRuntimeTable=${receipt.ownsNorthRuntimeTable}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsVisibleCompletion=${receipt.ownsVisibleCompletion}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsInspectModeTruth=${receipt.ownsInspectModeTruth}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `eastFile=${receipt.eastFile}`,
      `westFile=${receipt.westFile}`,
      `northFile=${receipt.northFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `northAvailable=${receipt.northAvailable}`,
      `northContract=${receipt.northContract}`,
      `northSessionCreated=${receipt.northSessionCreated}`,
      `northSessionId=${receipt.northSessionId}`,
      `northReceiptAvailable=${receipt.northReceiptAvailable}`,
      `northReceiptError=${receipt.northReceiptError}`,
      `northF21Allowed=${receipt.northF21Allowed}`,
      `northNewsGatePassedBeforeF21=${receipt.northNewsGatePassedBeforeF21}`,
      `northActiveCheckpointId=${receipt.northActiveCheckpointId}`,
      `northRecommendedNextOwner=${receipt.northRecommendedNextOwner}`,
      `northRecommendedNextFile=${receipt.northRecommendedNextFile}`,
      "",
      `step1AcceptedBySouth=${receipt.step1AcceptedBySouth}`,
      `handoffAdmissibleByWest=${receipt.handoffAdmissibleByWest}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `cockpitFound=${receipt.cockpitFound}`,
      `cockpitHydrated=${receipt.cockpitHydrated}`,
      `diagnosticDockReady=${receipt.diagnosticDockReady}`,
      `showDiagnosticTabReady=${receipt.showDiagnosticTabReady}`,
      `copyDiagnosticReady=${receipt.copyDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectPlanetControlReady=${receipt.inspectPlanetControlReady}`,
      `collapseExpandControlReady=${receipt.collapseExpandControlReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `receiptVisible=${receipt.receiptVisible}`,
      `cockpitMode=${receipt.cockpitMode}`,
      `cockpitExpanded=${receipt.cockpitExpanded}`,
      `dockHiddenForInspection=${receipt.dockHiddenForInspection}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `canvasApiPresent=${receipt.canvasApiPresent}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `cooperativeBootAvailable=${receipt.cooperativeBootAvailable}`,
      `cooperativeBootUsed=${receipt.cooperativeBootUsed}`,
      `syncBootFallbackUsed=${receipt.syncBootFallbackUsed}`,
      "",
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasContextReady=${receipt.canvasContextReady}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      "",
      `visibleContentProofStarted=${receipt.visibleContentProofStarted}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentProofMethod=${receipt.visibleContentProofMethod}`,
      `visibleContentProofError=${receipt.visibleContentProofError}`,
      `visibleContentSampleCount=${receipt.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${receipt.visibleContentVarianceScore}`,
      `visibleContentClassCount=${receipt.visibleContentClassCount}`,
      `visibleContentClasses=${receipt.visibleContentClasses}`,
      `visibleContentLandSampleCount=${receipt.visibleContentLandSampleCount}`,
      `visibleContentWaterSampleCount=${receipt.visibleContentWaterSampleCount}`,
      `visibleContentOtherSampleCount=${receipt.visibleContentOtherSampleCount}`,
      `carrierOnlyDetected=${receipt.carrierOnlyDetected}`,
      `explicitContentReceiptProof=${receipt.explicitContentReceiptProof}`,
      `renderedAfterTexture=${receipt.renderedAfterTexture}`,
      "",
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      "",
      `southGateReady=${receipt.southGateReady}`,
      `completionRequestedFromNorth=${receipt.completionRequestedFromNorth}`,
      `completionLatched=${receipt.completionLatched}`,
      `f21AfterNorthPermission=${receipt.f21AfterNorthPermission}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      "",
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `latestVisibleEvent=${receipt.latestVisibleEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `northRuntimeTableMutation=${receipt.northRuntimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      "",
      "CANVAS_PHASE_EVENTS",
      phaseText,
      "",
      "PROGRESS_ONLY_EVENTS",
      progressText,
      "",
      "LOCAL_EVENTS",
      localText,
      "",
      "NORTH_EVENTS",
      northText,
      "",
      "ERRORS",
      errorsText,
      "",
      "SOURCE_STACK_HELD",
      sourceStackText,
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

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthSouthVisibleCompletionLoaded = "true";
    dataset.hearthSouthVisibleCompletionContract = CONTRACT;
    dataset.hearthSouthVisibleCompletionReceipt = RECEIPT;
    dataset.hearthSouthVisibleCompletionVersion = VERSION;
    dataset.hearthCycleSouth = "true";
    dataset.hearthSouthFile = SOUTH_FILE;
    dataset.hearthNorthFile = NORTH_FILE;
    dataset.hearthEastFile = EAST_FILE;
    dataset.hearthWestFile = WEST_FILE;

    dataset.hearthSouthOwnsVisibleCompletion = "true";
    dataset.hearthSouthOwnsNorthRuntimeTable = "false";
    dataset.hearthSouthOwnsCanvasDrawing = "false";
    dataset.hearthSouthOwnsStep1 = "false";
    dataset.hearthSouthOwnsFinalVisualPassClaim = "false";

    dataset.hearthNorthAvailable = String(state.northAvailable);
    dataset.hearthNorthF21Allowed = String(state.northF21Allowed);
    dataset.hearthNorthNewsGatePassedBeforeF21 = String(state.northNewsGatePassedBeforeF21);
    dataset.hearthNorthActiveCheckpointId = state.northActiveCheckpointId;

    dataset.hearthSouthGateReady = String(state.southGateReady);
    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthCompletionLatched = String(state.completionLatched);

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasContextReady = String(state.canvasContextReady);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthNorthRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.routeConductor = api;
    root.HEARTH.coherenceSemiconductor = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ACTIVE_ROUTE = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = getReceiptLight();
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = SOUTH_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_SOUTH_VISIBLE_COMPLETION_FILE__ = SOUTH_FILE;
    root.__HEARTH_SOUTH_OWNS_NORTH_RUNTIME_TABLE__ = false;
    root.__HEARTH_SOUTH_OWNS_CANVAS_DRAWING__ = false;
    root.__HEARTH_SOUTH_VISUAL_PASS_CLAIMED__ = false;

    publishDataset();
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: SOUTH_FILE,
      route: ROUTE,
      role: "south-visible-completion-cycle-consumer",
      northAvailable: state.northAvailable,
      northF21Allowed: state.northF21Allowed,
      northNewsGatePassedBeforeF21: state.northNewsGatePassedBeforeF21,
      southGateReady: state.southGateReady,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      completionLatched: state.completionLatched,
      f21AfterNorthPermission: state.f21AfterNorthPermission,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      northRuntimeTableMutation: false,
      canvasMutation: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function retireClimateRoute() {
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;
    root.__HEARTH_RETIRED_ROUTE_FILE__ = "/showroom/globe/hearth/hearth.climate.route.js";
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

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("heartbeat");
      } else {
        publishGlobals();
        scheduleRender();
      }
    }, 1000);
  }

  function startReconcileLoop() {
    if (reconcileTimer) root.clearInterval(reconcileTimer);

    reconcileTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("interval");
      }
    }, 1400);
  }

  function boot() {
    if (bootStarted) {
      publishGlobals();
      return getReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    retireClimateRoute();
    ensureMount();
    hydrateCockpit();
    connectNorth();
    reconcileNorthReceipt();

    publishGlobals();
    render();

    root.setTimeout(callCanvasCarrier, 80);
    root.setTimeout(() => reconcileAll("post-boot-220ms"), 220);
    root.setTimeout(() => reconcileAll("post-boot-900ms"), 900);
    root.setTimeout(() => reconcileAll("post-boot-1800ms"), 1800);
    root.setTimeout(() => reconcileAll("post-boot-3600ms"), 3600);

    startHeartbeat();
    startReconcileLoop();

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (reconcileTimer) {
      root.clearInterval(reconcileTimer);
      reconcileTimer = 0;
    }

    recordLocal("SOUTH_VISIBLE_COMPLETION_DISPOSED", { reason });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: SOUTH_FILE,
    role: "south-visible-completion-cycle-consumer",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    handleCanvasPhase,
    handleCanvasReceipt,
    reconcile: reconcileAll,
    tryFinalize: maybeRequestCompletion,
    setCockpitMode,
    proveVisibleContent,
    startVisibleContentProof,
    evaluateSouthGate,
    reportSouthEvent,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsDirectionalCycle: true,
    supportsSouthVisibleCompletion: true,
    supportsNorthRuntimeTableConsumption: true,
    supportsVisibleContentCompletionGate: true,
    supportsInspectModeCompletionGate: true,
    supportsDiagnosticDockRestore: true,
    supportsCopyDiagnosticPreservation: true,
    supportsShowReceiptPreservation: true,
    supportsCooperativeCanvasHandoff: true,

    ownsSouth: true,
    ownsEast: false,
    ownsWest: false,
    ownsNorth: false,
    ownsStep1: false,
    ownsNorthRuntimeTable: false,
    ownsCanvasDrawing: false,
    ownsVisibleCompletion: true,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      boot();
    }, { once: true });
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
