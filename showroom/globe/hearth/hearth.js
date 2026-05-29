// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_TNT_v7
// Full-file replacement.
// Central command brain for Steps 2 through 11 only.
// Purpose:
// - Consume Step 1 from /showroom/globe/hearth/index.js.
// - Own Steps 2 through 11: script-order intake, authority assessment, Runtime Table session, NEWS/Fibonacci governance,
//   canvas coordination, atlas/texture/frame receipt, visible content proof, inspect-mode truth, F21 latch, final diagnostic.
// - Assess gaps quickly without hard-blocking lawful forward progress.
// - Preserve Copy diagnostic / Show receipt / Inspect planet / Show diagnostic.
// - Keep Runtime Table as North authority, but use a soft-gap governor so visual progress can continue when evidence exists.
// Does not own:
// - Step 1 first paint
// - HTML shell creation
// - initial mount creation
// - first-paint cockpit creation
// - canvas pixel drawing
// - atlas generation
// - texture generation
// - source-stack truth
// - Runtime Table implementation
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_TNT_v7";
  const RECEIPT = "HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_RECEIPT_v7";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_TNT_v6";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_PRECODE_FINAL_DRAFT_v7";
  const VERSION = "2026-05-29.hearth-route-command-brain-steps-2-11-v7";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const COHERENCE_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";
  const STYLE_ID = "hearth-route-command-brain-v7-style";

  const CHECKPOINTS = Object.freeze([
    {
      id: "S2_INDEX_HANDOFF_ACCEPTED",
      event: "INDEX_HANDOFF_ACCEPTED",
      step: 2,
      rank: 1,
      fibonacci: "F3",
      progress: 36,
      lane: "scriptOrder",
      label: "Index handoff accepted"
    },
    {
      id: "S3_AUTHORITY_AVAILABILITY_READY",
      event: "AUTHORITY_AVAILABILITY_READY",
      step: 3,
      rank: 2,
      fibonacci: "F5",
      progress: 55,
      lane: "authorityAvailability",
      label: "Authority availability assessed"
    },
    {
      id: "S4_RUNTIME_TABLE_SESSION_READY",
      event: "RUNTIME_TABLE_SESSION_READY",
      step: 4,
      rank: 3,
      fibonacci: "F8",
      progress: 72,
      lane: "runtimeTable",
      label: "Runtime Table session ready or degraded"
    },
    {
      id: "S5_CANVAS_COORDINATION_STARTED",
      event: "CANVAS_COORDINATION_STARTED",
      step: 5,
      rank: 4,
      fibonacci: "F13A",
      progress: 78,
      lane: "canvasAndDiagnostic",
      label: "Canvas coordination started"
    },
    {
      id: "S6_CANVAS_MOUNT_CONFIRMED",
      event: "CANVAS_MOUNT_CONFIRMED",
      step: 6,
      rank: 5,
      fibonacci: "F13B",
      progress: 81,
      lane: "canvasAndDiagnostic",
      label: "Canvas mount confirmed"
    },
    {
      id: "S7_CANVAS_CONTEXT_READY",
      event: "CANVAS_CONTEXT_READY",
      step: 7,
      rank: 6,
      fibonacci: "F13C",
      progress: 84,
      lane: "canvasAndDiagnostic",
      label: "Canvas context ready"
    },
    {
      id: "S8_DRAG_INSPECTION_BOUND",
      event: "DRAG_INSPECTION_BOUND",
      step: 8,
      rank: 7,
      fibonacci: "F13D",
      progress: 86,
      lane: "canvasAndDiagnostic",
      label: "Drag inspection bound"
    },
    {
      id: "S9_ATLAS_TEXTURE_FRAME_READY",
      event: "ATLAS_TEXTURE_FRAME_READY",
      step: 9,
      rank: 8,
      fibonacci: "F13E",
      progress: 93,
      lane: "canvasAndDiagnostic",
      label: "Atlas, texture, and first frame ready"
    },
    {
      id: "S10_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      step: 10,
      rank: 9,
      fibonacci: "F13F",
      progress: 98,
      lane: "visiblePlanetProof",
      label: "Visible content proof passed"
    },
    {
      id: "S11_INSPECT_MODE_READY",
      event: "INSPECT_MODE_READY",
      step: 11,
      rank: 10,
      fibonacci: "F13G",
      progress: 98,
      lane: "inspectMode",
      label: "Inspect mode ready"
    },
    {
      id: "F21_COMPLETION_LATCHED",
      event: "COMPLETION_LATCHED",
      step: 11,
      rank: 11,
      fibonacci: "F21",
      progress: 100,
      lane: "completionLatch",
      label: "Completion latched"
    }
  ]);

  const CHECKPOINT_MAP = Object.freeze(
    CHECKPOINTS.reduce((map, checkpoint) => {
      map[checkpoint.id] = checkpoint;
      map[checkpoint.event] = checkpoint;
      return map;
    }, Object.create(null))
  );

  const CANVAS_PROGRESS_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS"
  ]);

  const SOURCE_STACK_HELD = Object.freeze([
    "/assets/hearth/hearth.tectonics.js",
    "/assets/hearth/hearth.elevation.js",
    "/assets/hearth/hearth.composition.js",
    "/assets/hearth/hearth.hydrology.js",
    "/assets/hearth/hearth.materials.js",
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.surface.js",
    RUNTIME_TABLE_FILE
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: COHERENCE_FILE,
    route: ROUTE,
    role: "central-command-brain-steps-2-through-11",

    pairedSemiconductor: true,
    pairedWith: INDEX_FILE,
    indexJsStartsProcess: true,
    hearthJsFinishesProcess: true,
    systematicAndSynchronized: true,
    synchronizedLoading: true,

    ownsStep1: false,
    ownsSteps2Through11: true,
    step1Source: INDEX_FILE,
    step1Accepted: false,
    step1ReceiptPresent: false,
    step1Contract: "",
    step1HandoffAcceptedAt: "",

    ownsFirstPaintSurvival: false,
    ownsMountCreation: false,
    ownsInitialCockpitCreation: false,
    ownsRouteBrain: true,
    ownsScriptOrderIntake: true,
    ownsAuthorityAssessment: true,
    ownsRuntimeTableSession: true,
    ownsCheckpointGovernorConsumer: true,
    ownsNewsFibonacciGovernance: true,
    ownsCanvasCoordination: true,
    ownsVisiblePlanetProof: true,
    ownsInspectModeTruth: true,
    ownsCompletionLatch: true,
    ownsFinalDiagnosticReceipt: true,
    ownsFinalVisualPassClaim: false,

    gapAssessmentFast: true,
    hardBlockMode: false,
    softGapGovernor: true,
    forwardProgressAllowedWithGaps: true,
    blockedProgressCap: 98,
    readyTextRequiresF21: true,

    checkpointBrainActive: true,
    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    regressiveEventsBlocked: true,

    activeCheckpointId: "S2_INDEX_HANDOFF_ACCEPTED",
    activeCheckpointRank: 1,
    activeFibonacciStage: "F3",
    completedCheckpoints: [],
    highestCompletedCheckpointId: "",
    highestCompletedRank: 0,
    queuedEvents: [],
    admittedEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    gapEvents: [],

    currentStage: "F3",
    highestStage: "F3",
    mainDisplayProgress: 0,
    mainProgressCap: 98,
    completionLatched: false,
    f21Allowed: false,
    f21AfterS11: false,
    finalReceiptAvailable: false,

    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    newsGatePassedBeforeF21: false,

    mountReady: false,
    cockpitFound: false,
    cockpitHydrated: false,
    showDiagnosticTabReady: false,
    copyDiagnosticReady: false,
    receiptToggleReady: false,
    inspectPlanetControlReady: false,
    collapseExpandControlReady: false,
    buttonsReachable: false,
    dockHiddenForInspection: false,
    cockpitExpanded: false,
    receiptVisible: false,
    diagnosticCanLeavePlanetFrame: false,

    runtimeTablePresent: false,
    runtimeTableSessionAttempted: false,
    runtimeTableSessionCreated: false,
    runtimeTableSessionError: "",
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    runtimeTableReceiptAvailable: false,
    runtimeTableReceiptError: "",

    canvasApiPresent: false,
    canvasScriptPresent: false,
    canvasScriptInjected: false,
    canvasScriptLoaded: false,
    canvasScriptError: "",
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
    planetNotObstructed: false,

    sourceAuthorityHeld: true,
    climateRouteRetired: true,
    runtimeTableMutation: false,
    canvasMutation: false,

    latestVisibleEvent: "COMMAND_BRAIN_LOADED",
    postgameStatus: "COMMAND_BRAIN_LOADED",
    firstFailedCoordinate: "WAITING_INDEX_HANDOFF",
    recommendedNextRenewalTarget: INDEX_FILE,

    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    localEvents: [],
    errors: [],
    phaseSignatures: Object.create(null),

    startedAt: "",
    startedAtMs: 0,
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
    ledger: null,
    runtimeSession: null
  };

  let bootStarted = false;
  let renderTimer = 0;
  let heartbeatTimer = 0;
  let reconcileTimer = 0;
  let canvasBootRequested = false;

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
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function checkpointBy(idOrEvent) {
    return CHECKPOINT_MAP[idOrEvent] || null;
  }

  function getRuntimeTableApi() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      root.RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
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

  function getIndexHandoff() {
    return (
      root.HEARTH_INDEX_ROUTE_SOCKET_HANDOFF ||
      (root.HEARTH && root.HEARTH.indexHandoff) ||
      root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT ||
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_INDEX_BRIDGE_RECEIPT ||
      null
    );
  }

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-route-command-brain-v7");
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

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .hearth-ledger-cockpit{
        transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
        inset:auto 10px 10px 10px!important;
        min-height:132px!important;
        max-height:188px!important;
        overflow:hidden!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-head{
        padding:10px 14px 7px!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-title{
        font-size:1rem!important;
        line-height:1.02!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-meta{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{
        min-height:28px!important;
        padding:6px 9px!important;
        font-size:.56rem!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="expanded-cockpit"]{
        inset:10px!important;
        max-height:calc(100% - 20px)!important;
        min-height:170px!important;
        overflow:hidden!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:translateY(26px) scale(.985)!important;
        max-height:0!important;
        min-height:0!important;
        overflow:hidden!important;
      }

      [data-hearth-command-brain-show-diagnostic-tab]{
        position:fixed;
        right:max(12px,env(safe-area-inset-right));
        bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));
        z-index:10000;
        display:none;
        align-items:center;
        justify-content:center;
        min-height:38px;
        padding:10px 14px;
        border-radius:999px;
        border:1px solid rgba(231,188,105,.66);
        color:#06101e;
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
        box-shadow:0 16px 44px rgba(0,0,0,.40), inset 0 1px 0 rgba(255,255,255,.28);
        font:950 .70rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      html[data-hearth-command-brain-inspect="true"] [data-hearth-command-brain-show-diagnostic-tab]{
        display:inline-flex;
      }

      html[data-hearth-command-brain-inspect="true"] #hearthCanvasMount,
      html[data-hearth-command-brain-inspect="true"] [data-hearth-canvas-mount="true"]{
        cursor:grab;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
          inset:auto 8px 8px 8px!important;
          max-height:190px!important;
        }

        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{
          flex:1 1 auto!important;
          min-width:28%!important;
        }

        [data-hearth-command-brain-show-diagnostic-tab]{
          right:max(10px,env(safe-area-inset-right));
          bottom:max(68px,calc(env(safe-area-inset-bottom) + 68px));
          min-height:34px;
          padding:9px 12px;
          font-size:.64rem;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function resolveMount() {
    if (!doc) return null;

    const handoff = getIndexHandoff();

    let mount =
      refs.mount ||
      (handoff && handoff.mount) ||
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    refs.mount = mount || null;
    state.mountReady = Boolean(mount);

    if (mount) {
      mount.dataset.hearthCommandBrain = CONTRACT;
      mount.dataset.hearthCommandBrainReceipt = RECEIPT;
      mount.dataset.hearthCommandBrainOwnsStep1 = "false";
      mount.dataset.hearthCommandBrainOwnsSteps2Through11 = "true";
      mount.dataset.hearthRuntimeTableMutation = "false";
      mount.dataset.hearthCanvasMutation = "false";
      mount.dataset.generatedImage = "false";
      mount.dataset.graphicBox = "false";
      mount.dataset.webgl = "false";
      mount.dataset.visualPassClaimed = "false";
    }

    return mount;
  }

  function resolveCockpit() {
    if (!doc) return null;

    const handoff = getIndexHandoff();

    const cockpit =
      refs.cockpit ||
      (handoff && handoff.cockpit) ||
      doc.getElementById(COCKPIT_ID) ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

    refs.cockpit = cockpit || null;
    state.cockpitFound = Boolean(cockpit);

    if (!cockpit) return null;

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

    cockpit.dataset.hearthCommandBrain = CONTRACT;
    cockpit.dataset.hearthCommandBrainReceipt = RECEIPT;
    cockpit.dataset.hearthCommandBrainOwnsStep1 = "false";
    cockpit.dataset.hearthCommandBrainOwnsSteps2Through11 = "true";

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => setCockpitMode(state.dockHiddenForInspection ? "diagnostic-dock" : "planet-inspect");
    if (refs.expandButton) refs.expandButton.onclick = toggleExpanded;

    state.copyDiagnosticReady = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.inspectPlanetControlReady = Boolean(refs.inspectButton);
    state.collapseExpandControlReady = Boolean(refs.expandButton);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);
    state.cockpitHydrated = true;

    return cockpit;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      refs.showTab ||
      doc.querySelector("[data-hearth-command-brain-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthCommandBrainShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthCommandBrainShowDiagnosticTab = "true";
    tab.onclick = () => setCockpitMode("diagnostic-dock");

    refs.showTab = tab;
    state.showDiagnosticTabReady = true;

    return tab;
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;
    led.contract = led.contract || "HEARTH_SHARED_COMMAND_BRAIN_LEDGER_v7";
    led.createdOrHydratedBy = CONTRACT;
    led.ownerModel = "paired-semiconductor";
    led.constraintSemiconductor = INDEX_FILE;
    led.coherenceSemiconductor = COHERENCE_FILE;
    led.route = ROUTE;
    led.indexOwnsStep1 = true;
    led.commandBrainOwnsSteps2Through11 = true;
    led.visualPassClaimed = false;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = nowIso();
    led.events = Array.isArray(led.events) ? led.events : [];
    led.errors = Array.isArray(led.errors) ? led.errors : [];
    led.lanes = isObject(led.lanes) ? led.lanes : {};

    CHECKPOINTS.forEach((checkpoint) => {
      if (!isObject(led.lanes[checkpoint.lane])) {
        led.lanes[checkpoint.lane] = {
          key: checkpoint.lane,
          label: checkpoint.label,
          fibonacci: checkpoint.fibonacci,
          status: "PENDING",
          message: `${checkpoint.label} pending.`,
          progress: 0,
          latestEvent: "PENDING",
          owner: COHERENCE_FILE,
          updatedAt: nowIso()
        };
      }
    });

    ledger.push = isFunction(ledger.push) ? ledger.push : function push(event = {}) {
      const evt = {
        id: event.id || event.event || "COMMAND_BRAIN_EVENT",
        stage: event.stage || state.currentStage || "F3",
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "hearth.js",
        file: event.file || COHERENCE_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? "",
        timestamp: nowIso()
      };

      led.events.push(evt);
      if (led.events.length > 420) led.events.splice(0, led.events.length - 420);
      led.updatedAt = evt.timestamp;
      return evt;
    };

    ledger.setLane = isFunction(ledger.setLane) ? ledger.setLane : function setLane(key, next = {}) {
      const lane = led.lanes[key] || {
        key,
        label: key,
        fibonacci: next.stage || "",
        status: "PENDING",
        message: "",
        progress: 0,
        latestEvent: "PENDING",
        owner: COHERENCE_FILE,
        updatedAt: nowIso()
      };

      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress ?? lane.progress ?? 0));
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.fibonacci = next.stage || lane.fibonacci;
      lane.owner = COHERENCE_FILE;
      lane.updatedAt = nowIso();

      led.lanes[key] = lane;

      ledger.push({
        id: lane.latestEvent,
        stage: lane.fibonacci,
        lane: key,
        status: lane.status,
        owner: "hearth.js",
        file: COHERENCE_FILE,
        message: lane.message,
        progress: lane.progress,
        detail: next.detail || {}
      });

      return lane;
    };

    ledger.getReceipt = function getReceiptFromLedger() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getReceiptTextFromLedger() {
      return getReceiptText();
    };

    ledger.copyDiagnostic = function copyDiagnosticFromLedger() {
      return copyDiagnostic();
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;
    return ledger;
  }

  function ledgerPush(event = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.push({
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...event
    });
  }

  function setLane(key, next = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.setLane(key, {
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...next
    });
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 260) {
      state.localEvents.splice(0, state.localEvents.length - 260);
    }

    state.latestVisibleEvent = event;
    state.updatedAt = item.at;

    ledgerPush({
      id: event,
      stage: state.currentStage,
      lane: detail.lane || "",
      status: detail.status || "OBSERVED",
      message: detail.message || event,
      detail
    });

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
    if (state.errors.length > 90) {
      state.errors.splice(0, state.errors.length - 90);
    }

    ledgerPush({
      id: "COMMAND_BRAIN_ERROR",
      stage: state.currentStage,
      lane: "errors",
      status: "ERROR",
      message: `${code}: ${message}`,
      detail: item
    });

    return item;
  }

  function recordGap(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: String(message || ""),
      detail: clonePlain(detail),
      hardBlocked: false,
      forwardProgressAllowed: true
    };

    state.gapEvents.push(item);
    if (state.gapEvents.length > 120) {
      state.gapEvents.splice(0, state.gapEvents.length - 120);
    }

    ledgerPush({
      id: "SOFT_GAP_ASSESSED",
      stage: state.currentStage,
      lane: "gapGovernor",
      status: "SOFT_GAP",
      message: `${code}: ${message}`,
      detail: item
    });

    return item;
  }

  function acceptIndexHandoff(packet = {}) {
    const handoff = isObject(packet) ? packet : {};
    const receipt = handoff.receipt || handoff.contract ? handoff : getIndexHandoff();

    state.step1ReceiptPresent = Boolean(receipt);
    state.step1Contract = String((receipt && receipt.contract) || (receipt && receipt.indexContract) || "");
    state.step1Accepted = Boolean(
      receipt &&
      (
        receipt.step1Complete === true ||
        receipt.indexNewsPassed === true ||
        receipt.firstPaintCockpitReady === true ||
        receipt.cockpitReady === true ||
        receipt.mountReady === true ||
        receipt.indexOwnsStep1 === true
      )
    );

    if (!state.step1Accepted && doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      state.step1Accepted = Boolean(
        dataset.hearthIndexStep1Complete === "true" ||
        dataset.hearthFirstPaintCockpitReady === "true" ||
        dataset.hearthIndexOwnsStep1 === "true"
      );
      state.step1Contract = state.step1Contract || dataset.hearthIndexRouteSocketContract || dataset.hearthIndexConstraintSemiconductorContract || "";
    }

    if (receipt && receipt.mount && !refs.mount) refs.mount = receipt.mount;
    if (receipt && receipt.cockpit && !refs.cockpit) refs.cockpit = receipt.cockpit;
    if (receipt && receipt.sharedLedger && !refs.ledger && root.HEARTH_LOAD_LEDGER) refs.ledger = root.HEARTH_LOAD_LEDGER;

    resolveMount();
    resolveCockpit();
    ensureShowTab();

    if (state.step1Accepted) {
      state.step1HandoffAcceptedAt = state.step1HandoffAcceptedAt || nowIso();
      completeCheckpoint("INDEX_HANDOFF_ACCEPTED", {
        step1Contract: state.step1Contract,
        step1ReceiptPresent: state.step1ReceiptPresent,
        mountReady: state.mountReady,
        cockpitFound: state.cockpitFound
      });
      return true;
    }

    recordGap("INDEX_HANDOFF_NOT_CONFIRMED", "Step 1 handoff is not confirmed yet. Command brain is waiting but not mutating Step 1.", {
      receiptPresent: Boolean(receipt)
    });

    return false;
  }

  function activeCheckpoint() {
    return checkpointBy(state.activeCheckpointId) || CHECKPOINTS[0];
  }

  function nextCheckpointAfter(rank) {
    return CHECKPOINTS.find((checkpoint) => checkpoint.rank === rank + 1) || CHECKPOINTS[CHECKPOINTS.length - 1];
  }

  function isCompleted(id) {
    return state.completedCheckpoints.includes(id);
  }

  function setActiveCheckpoint(checkpoint) {
    if (!checkpoint) return;

    state.activeCheckpointId = checkpoint.id;
    state.activeCheckpointRank = checkpoint.rank;
    state.activeFibonacciStage = checkpoint.fibonacci;
    state.currentStage = checkpoint.fibonacci;

    if (checkpoint.rank >= state.highestCompletedRank) {
      state.highestStage = checkpoint.fibonacci;
    }
  }

  function completeCheckpoint(idOrEvent, detail = {}) {
    const checkpoint = checkpointBy(idOrEvent);
    if (!checkpoint) return false;

    if (state.completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
      state.archivedEvents.push({
        at: nowIso(),
        event: checkpoint.event,
        checkpointId: checkpoint.id,
        reason: "post-f21-event-archived",
        detail: clonePlain(detail)
      });
      return false;
    }

    if (isCompleted(checkpoint.id)) {
      state.archivedEvents.push({
        at: nowIso(),
        event: checkpoint.event,
        checkpointId: checkpoint.id,
        reason: "duplicate-completed-event-archived",
        detail: clonePlain(detail)
      });
      return true;
    }

    const active = activeCheckpoint();

    if (checkpoint.rank > active.rank) {
      const exists = state.queuedEvents.some((item) => item.checkpointId === checkpoint.id);
      if (!exists) {
        state.queuedEvents.push({
          at: nowIso(),
          event: checkpoint.event,
          checkpointId: checkpoint.id,
          rank: checkpoint.rank,
          detail: clonePlain(detail),
          reason: "future-event-queued-until-active"
        });
      }

      state.futureEventsQueued = true;
      return false;
    }

    if (checkpoint.rank < active.rank) {
      state.archivedEvents.push({
        at: nowIso(),
        event: checkpoint.event,
        checkpointId: checkpoint.id,
        reason: "late-regressive-event-archived",
        detail: clonePlain(detail)
      });
      state.regressiveEventsBlocked = true;
      return true;
    }

    if (checkpoint.id === "F21_COMPLETION_LATCHED" && !state.newsGatePassedBeforeF21) {
      state.blockedEvents.push({
        at: nowIso(),
        event: checkpoint.event,
        checkpointId: checkpoint.id,
        reason: "f21-soft-blocked-until-news-gates-pass",
        detail: clonePlain(detail)
      });

      deriveFailureCoordinate();
      return false;
    }

    state.completedCheckpoints.push(checkpoint.id);
    state.highestCompletedCheckpointId = checkpoint.id;
    state.highestCompletedRank = checkpoint.rank;
    state.currentStage = checkpoint.fibonacci;
    state.highestStage = checkpoint.fibonacci;
    state.mainDisplayProgress = Math.max(state.mainDisplayProgress, checkpoint.progress);
    state.latestVisibleEvent = checkpoint.event;

    state.admittedEvents.push({
      at: nowIso(),
      event: checkpoint.event,
      checkpointId: checkpoint.id,
      rank: checkpoint.rank,
      detail: clonePlain(detail)
    });

    setLane(checkpoint.lane, {
      status: checkpoint.id === "F21_COMPLETION_LATCHED" ? "LATCHED" : "READY",
      progress: checkpoint.progress,
      event: checkpoint.event,
      stage: checkpoint.fibonacci,
      message: checkpoint.label,
      detail
    });

    if (checkpoint.id === "F21_COMPLETION_LATCHED") {
      forceCompletionLatch();
    } else {
      setActiveCheckpoint(nextCheckpointAfter(checkpoint.rank));
      drainQueuedEvents(`after-${checkpoint.event}`);
    }

    evaluateNewsGates();
    deriveFailureCoordinate();
    publishGlobals();
    scheduleRender();
    return true;
  }

  function drainQueuedEvents(reason = "manual") {
    let moved = false;
    let guard = 0;

    while (guard < 16) {
      guard += 1;

      const active = activeCheckpoint();
      const index = state.queuedEvents.findIndex((item) => item.checkpointId === active.id);

      if (index < 0) break;

      const packet = state.queuedEvents.splice(index, 1)[0];
      completeCheckpoint(packet.checkpointId, {
        ...(packet.detail || {}),
        replayedFromQueue: true,
        queueDrainReason: reason
      });
      moved = true;
    }

    return moved;
  }

  function hydrateControls() {
    ensureStyle();
    resolveMount();
    resolveCockpit();
    ensureShowTab();

    state.copyDiagnosticReady = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.inspectPlanetControlReady = Boolean(refs.inspectButton);
    state.collapseExpandControlReady = Boolean(refs.expandButton);
    state.showDiagnosticTabReady = Boolean(refs.showTab);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);
    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.copyDiagnosticReady &&
      state.receiptToggleReady &&
      state.inspectPlanetControlReady &&
      state.collapseExpandControlReady &&
      state.showDiagnosticTabReady
    );

    if (state.diagnosticCanLeavePlanetFrame && state.visibleContentProof) {
      completeCheckpoint("INSPECT_MODE_READY", {
        diagnosticCanLeavePlanetFrame: true,
        buttonsReachable: true
      });
    }

    evaluateNewsGates();
    return state.diagnosticCanLeavePlanetFrame;
  }

  function toggleReceipt() {
    state.receiptVisible = !state.receiptVisible;

    if (refs.receiptBox) {
      refs.receiptBox.dataset.visible = String(state.receiptVisible);
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = state.receiptVisible ? "Hide receipt" : "Show receipt";
    }

    recordLocal(state.receiptVisible ? "COMMAND_BRAIN_RECEIPT_SHOWN" : "COMMAND_BRAIN_RECEIPT_HIDDEN", {
      lane: "inspectMode",
      status: "USER_CONTROL"
    });

    scheduleRender();
  }

  function toggleExpanded() {
    if (state.cockpitExpanded) {
      setCockpitMode("diagnostic-dock");
    } else {
      setCockpitMode("expanded-cockpit");
    }
  }

  function setCockpitMode(mode) {
    hydrateControls();

    if (!refs.cockpit) return;

    if (mode === "planet-inspect") {
      state.dockHiddenForInspection = true;
      state.cockpitExpanded = false;
      state.planetNotObstructed = true;
      refs.cockpit.dataset.cockpitMode = "planet-inspect";
    } else if (mode === "expanded-cockpit") {
      state.dockHiddenForInspection = false;
      state.cockpitExpanded = true;
      state.planetNotObstructed = false;
      refs.cockpit.dataset.cockpitMode = "expanded-cockpit";
    } else {
      state.dockHiddenForInspection = false;
      state.cockpitExpanded = false;
      state.planetNotObstructed = false;
      refs.cockpit.dataset.cockpitMode = state.completionLatched || state.canvasReady ? "diagnostic-dock" : "expanded-cockpit";
    }

    refs.cockpit.dataset.hearthCommandBrainInspect = String(state.dockHiddenForInspection);

    if (refs.mount) {
      refs.mount.dataset.hearthCommandBrainInspect = String(state.dockHiddenForInspection);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthCommandBrainInspect = String(state.dockHiddenForInspection);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !state.dockHiddenForInspection;
      refs.showTab.dataset.visible = String(state.dockHiddenForInspection);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.dockHiddenForInspection ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.expandButton) {
      refs.expandButton.textContent = state.cockpitExpanded ? "Collapse dock" : "Expand cockpit";
    }

    hydrateControls();
    publishGlobals();
    scheduleRender();
  }

  function scanScriptPresence() {
    if (!doc) return;

    const scripts = Array.from(doc.scripts || []);

    state.canvasScriptPresent = Boolean(
      scripts.find((script) => (script.getAttribute("src") || "").includes(CANVAS_FILE))
    );

    state.runtimeTablePresent = Boolean(getRuntimeTableApi());
    state.canvasApiPresent = Boolean(getCanvasApi());

    completeCheckpoint("AUTHORITY_AVAILABILITY_READY", {
      runtimeTablePresent: state.runtimeTablePresent,
      canvasApiPresent: state.canvasApiPresent,
      canvasScriptPresent: state.canvasScriptPresent,
      sourceAuthorityHeld: state.sourceAuthorityHeld
    });
  }

  function scriptAlreadyPresent(srcPart) {
    if (!doc) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || "";
      return src.includes(srcPart);
    }) || null;
  }

  function injectCanvasScriptOnce() {
    if (getCanvasApi()) {
      state.canvasApiPresent = true;
      state.canvasScriptPresent = true;
      return Promise.resolve(true);
    }

    const existing = scriptAlreadyPresent(CANVAS_FILE);

    if (existing) {
      state.canvasScriptPresent = true;
      return waitForCanvasApi(2600);
    }

    if (!doc || !doc.head) {
      state.canvasScriptError = "document.head unavailable";
      recordGap("CANVAS_SCRIPT_INJECTION_SKIPPED", state.canvasScriptError);
      return Promise.resolve(false);
    }

    const script = doc.createElement("script");
    script.src = `${CANVAS_FILE}?v=${encodeURIComponent(`${CONTRACT}-${Date.now()}`)}`;
    script.defer = true;
    script.dataset.hearthLoadedByCommandBrain = CONTRACT;
    script.dataset.hearthScriptRole = "canvas-authority";
    script.dataset.generatedImage = "false";
    script.dataset.graphicBox = "false";
    script.dataset.webgl = "false";
    script.dataset.visualPassClaimed = "false";

    state.canvasScriptPresent = true;
    state.canvasScriptInjected = true;

    return new Promise((resolve) => {
      let settled = false;

      function finish(ok, error = "") {
        if (settled) return;
        settled = true;
        state.canvasScriptLoaded = ok;
        state.canvasScriptError = error;
        state.canvasApiPresent = Boolean(getCanvasApi());
        resolve(Boolean(getCanvasApi()));
      }

      script.onload = () => {
        waitForCanvasApi(1600).then((ok) => finish(ok, ok ? "" : "canvas script loaded but API missing"));
      };

      script.onerror = () => {
        finish(false, "canvas script failed to load");
      };

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (settled) return;
        finish(Boolean(getCanvasApi()), getCanvasApi() ? "" : "canvas API timeout");
      }, 4200);
    });
  }

  function waitForCanvasApi(timeoutMs) {
    const started = nowMs();

    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        if (getCanvasApi()) {
          root.clearInterval(timer);
          state.canvasApiPresent = true;
          resolve(true);
          return;
        }

        if (nowMs() - started >= timeoutMs) {
          root.clearInterval(timer);
          resolve(false);
        }
      }, 80);
    });
  }

  function createRuntimeTableSession() {
    const api = getRuntimeTableApi();

    state.runtimeTablePresent = Boolean(api);
    state.runtimeTableSessionAttempted = true;
    state.runtimeTableMode = api ? "RUNTIME_TABLE_READY_OR_DEGRADED" : "RUNTIME_TABLE_MISSING_SOFT_GAP";

    if (!api) {
      recordGap("RUNTIME_TABLE_MISSING", "Runtime Table is missing. Brain will continue with local soft-gap governance.", {
        file: RUNTIME_TABLE_FILE
      });

      completeCheckpoint("RUNTIME_TABLE_SESSION_READY", {
        runtimeTablePresent: false,
        runtimeTableMode: state.runtimeTableMode,
        softGap: true
      });
      return null;
    }

    try {
      if (isFunction(api.createHearthCheckpointSession)) {
        refs.runtimeSession = api.createHearthCheckpointSession({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          constraintSemiconductor: INDEX_FILE,
          coherenceSemiconductor: COHERENCE_FILE,
          canvasAuthority: CANVAS_FILE,
          commandBrainContract: CONTRACT,
          softGapGovernor: true,
          hardBlockMode: false
        });

        state.runtimeTableSessionCreated = Boolean(refs.runtimeSession);
      }

      if (!refs.runtimeSession && isFunction(api.createCheckpointSession)) {
        refs.runtimeSession = api.createCheckpointSession({
          planetId: "hearth",
          route: ROUTE,
          commandBrainContract: CONTRACT
        });

        state.runtimeTableSessionCreated = Boolean(refs.runtimeSession);
      }

      state.runtimeTableSessionError = "";

      completeCheckpoint("RUNTIME_TABLE_SESSION_READY", {
        runtimeTablePresent: true,
        runtimeTableSessionCreated: state.runtimeTableSessionCreated,
        runtimeTableMode: state.runtimeTableMode
      });

      return refs.runtimeSession;
    } catch (error) {
      state.runtimeTableSessionError = error && error.message ? error.message : String(error);

      recordGap("RUNTIME_TABLE_SESSION_CREATE_FAILED", state.runtimeTableSessionError, {
        forwardProgressAllowed: true
      });

      completeCheckpoint("RUNTIME_TABLE_SESSION_READY", {
        runtimeTablePresent: true,
        runtimeTableSessionCreated: false,
        runtimeTableSessionError: state.runtimeTableSessionError,
        softGap: true
      });

      return null;
    }
  }

  function createRuntimeTablePlan() {
    const api = getRuntimeTableApi();

    state.runtimeTablePlanAttempted = Boolean(api);

    if (!api) return null;

    try {
      let plan = null;

      if (isFunction(api.createHearthVisualCarrierPlan)) {
        plan = api.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          renderMetadata: {
            commandBrainContract: CONTRACT,
            pairedSemiconductor: true,
            constraintSemiconductor: INDEX_FILE,
            coherenceSemiconductor: COHERENCE_FILE,
            synchronizedLoading: true,
            softGapGovernor: true,
            visualPassClaimed: false
          }
        }, {
          profile: "hearth-command-brain-visible-carrier",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(api.createVisualCarrierPlan)) {
        plan = api.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE
        });
      }

      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = "";
      return plan;
    } catch (error) {
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      recordGap("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);
      return null;
    }
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
      mount: refs.mount || resolveMount(),
      pairedSemiconductor: true,
      constraintSemiconductor: INDEX_FILE,
      coherenceSemiconductor: COHERENCE_FILE,
      commandBrain: true,
      commandBrainContract: CONTRACT,
      indexStep1OwnedExternally: true,
      ownsStep1: false,
      ownsSteps2Through11: true,
      softGapGovernor: true,
      hardBlockMode: false,
      runtimeTableOptional: true,
      visibleCarrierFirst: true,
      sharedLedger: refs.ledger || ensureLedger(),
      indexHandoff: getIndexHandoff(),
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

  async function callCanvasCarrier() {
    if (canvasBootRequested || state.completionLatched) return false;

    resolveMount();

    if (!state.mountReady) {
      recordGap("MOUNT_NOT_READY", "Step 1 mount is not available. Canvas coordination is held until index.js provides the mount.", {
        owner: INDEX_FILE
      });
      deriveFailureCoordinate();
      return false;
    }

    let api = getCanvasApi();

    if (!api) {
      await injectCanvasScriptOnce();
      api = getCanvasApi();
    }

    state.canvasApiPresent = Boolean(api);

    if (!api) {
      recordGap("CANVAS_API_MISSING", "Canvas API is missing. Command brain cannot start canvas coordination yet.", {
        file: CANVAS_FILE
      });
      deriveFailureCoordinate();
      return false;
    }

    const method = selectCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no boot/mount method exists.";
      recordGap("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);
      deriveFailureCoordinate();
      return false;
    }

    canvasBootRequested = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.cooperativeBootAvailable = Boolean(isFunction(api.bootCooperative));
    state.cooperativeBootUsed = method === "bootCooperative";
    state.syncBootFallbackUsed = method !== "bootCooperative";

    completeCheckpoint("CANVAS_COORDINATION_STARTED", {
      canvasCarrierMethod: method,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed
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
            recordGap("CANVAS_PROMISE_REJECTED", state.canvasCarrierHandoffError);
          });
      } else if (result && isObject(result)) {
        handleCanvasReceipt(result, "canvas-method-returned-receipt");
      }

      return true;
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      recordGap("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, {
        method
      });
      return false;
    }
  }

  function phaseSignature(event) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const chunk = detail.chunkIndex ?? "";
    const total = detail.totalChunks ?? "";
    const progress = event.percent ?? event.progress ?? detail.progress ?? "";
    return `${phase}|${chunk}|${total}|${progress}`;
  }

  function handleCanvasPhase(event = {}) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const signature = phaseSignature(event);
    const current = nowMs();

    if (state.phaseSignatures[signature] && current - state.phaseSignatures[signature] < 1500) {
      return event;
    }

    state.phaseSignatures[signature] = current;

    const percent = clamp(Number(event.percent ?? event.progress ?? detail.progress ?? 0), 0, 100);

    if (CANVAS_PROGRESS_EVENTS.includes(phase)) {
      state.progressOnlyEvents.push({
        at: nowIso(),
        phase,
        percent,
        detail: clonePlain(detail)
      });

      if (state.progressOnlyEvents.length > 160) {
        state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 160);
      }
    } else {
      state.canvasPhaseEvents.push({
        at: nowIso(),
        phase,
        percent,
        detail: clonePlain(detail)
      });

      if (state.canvasPhaseEvents.length > 200) {
        state.canvasPhaseEvents.splice(0, state.canvasPhaseEvents.length - 200);
      }
    }

    applyCanvasTruth(phase, detail, percent);

    if (phase === "CANVAS_MOUNT_CREATED") {
      completeCheckpoint("CANVAS_MOUNT_CONFIRMED", detail);
    }

    if (phase === "CANVAS_CONTEXT_READY") {
      completeCheckpoint("CANVAS_CONTEXT_READY", detail);
    }

    if (phase === "DRAG_INSPECTION_BOUND") {
      completeCheckpoint("DRAG_INSPECTION_BOUND", detail);
    }

    if (phase === "CANVAS_READY") {
      state.canvasReady = true;
      startVisibleContentProof("canvas-ready");
    }

    maybeCompleteAtlasTextureFrame(`phase-${phase}`);
    maybeFinalize(`phase-${phase}`);

    scheduleRender();
    publishGlobals();
    return event;
  }

  function applyCanvasTruth(phase, detail = {}, percent = 0) {
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
      state.atlasBuildProgress = Math.max(state.atlasBuildProgress, Number(detail.atlasBuildProgress || detail.progress || percent || 0));
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
      state.textureComposeProgress = Math.max(state.textureComposeProgress, Number(detail.textureComposeProgress || detail.progress || percent || 0));
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
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.dragInspectionBound = true;
      state.atlasBuildComplete = true;
      state.atlasBuildProgress = 100;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
      state.renderedAfterTexture = true;
    }

    evaluateNewsGates();
  }

  function handleCanvasReceipt(receipt, reason = "canvas-receipt") {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
      handleCanvasReceiptLight(value);

      if (Array.isArray(value.phaseEvents)) {
        value.phaseEvents.forEach((event) => {
          if (event && (event.phase || event.event || event.id)) {
            handleCanvasPhase(event);
          }
        });
      }
    }

    maybeCompleteAtlasTextureFrame(`receipt-${reason}`);

    if (state.canvasReady || state.firstFrameDetected || state.imageRendered) {
      startVisibleContentProof(`receipt-${reason}`);
    }

    hydrateControls();
    maybeFinalize(`receipt-${reason}`);
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

    state.canvasCarrierHandoffOk = Boolean(
      state.canvasCarrierHandoffOk ||
      value.canvasCarrierHandoffOk ||
      value.handoffOk ||
      state.canvasCarrierMounted
    );

    state.canvasContextReady = Boolean(state.canvasContextReady || value.canvasContextReady || value.contextReady);
    state.canvasReady = Boolean(state.canvasReady || value.canvasReady);
    state.dragInspectionBound = Boolean(state.dragInspectionBound || value.dragInspectionBound || value.pointerControlsBound || value.controlsBound);

    state.atlasBuildStarted = Boolean(state.atlasBuildStarted || value.atlasBuildStarted);
    state.atlasBuildProgress = Math.max(Number(state.atlasBuildProgress || 0), Number(value.atlasBuildProgress || 0));
    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || value.atlasBuildComplete);

    state.textureComposeStarted = Boolean(state.textureComposeStarted || value.textureComposeStarted);
    state.textureComposeProgress = Math.max(Number(state.textureComposeProgress || 0), Number(value.textureComposeProgress || 0));
    state.textureComposeComplete = Boolean(state.textureComposeComplete || value.textureComposeComplete);
    state.renderedAfterTexture = Boolean(state.renderedAfterTexture || value.renderedAfterTexture || state.textureComposeComplete);

    state.firstFrameRequested = Boolean(state.firstFrameRequested || value.firstFrameRequested);
    state.firstFrameDetected = Boolean(state.firstFrameDetected || value.firstFrameDetected);
    state.imageRendered = Boolean(state.imageRendered || value.imageRendered);

    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || value.visiblePlanetAvailable);
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || value.planetCanvasPresent);
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || value.planetCanvasNonZeroSize);
    state.planetFramePainted = Boolean(state.planetFramePainted || value.planetFramePainted);
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || value.nonblankPlanetVisible);

    if (state.canvasCarrierMounted) completeCheckpoint("CANVAS_MOUNT_CONFIRMED", { receipt: true });
    if (state.canvasContextReady || state.canvasReady) completeCheckpoint("CANVAS_CONTEXT_READY", { receipt: true });
    if (state.dragInspectionBound) completeCheckpoint("DRAG_INSPECTION_BOUND", { receipt: true });

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

    evaluateNewsGates();
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
      "landWaterTexturePainted"
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

  function maybeCompleteAtlasTextureFrame(reason = "manual") {
    const ready = Boolean(
      state.atlasBuildComplete &&
      state.textureComposeComplete &&
      (state.firstFrameDetected || state.imageRendered || state.canvasReady)
    );

    if (ready) {
      completeCheckpoint("ATLAS_TEXTURE_FRAME_READY", {
        reason,
        atlasBuildComplete: state.atlasBuildComplete,
        textureComposeComplete: state.textureComposeComplete,
        firstFrameDetected: state.firstFrameDetected,
        imageRendered: state.imageRendered
      });
    }

    return ready;
  }

  function getPlanetCanvas() {
    if (!doc) return null;

    const mount = refs.mount || resolveMount();
    return mount ? mount.querySelector("canvas") : doc.querySelector(`#${MOUNT_ID} canvas`);
  }

  function startVisibleContentProof(reason = "manual") {
    if (state.completionLatched) return true;

    state.visibleContentProofStarted = true;

    const passed = proveVisibleContent(reason);

    if (passed) {
      completeCheckpoint("VISIBLE_CONTENT_PROOF_PASSED", {
        reason,
        visibleContentProofMethod: state.visibleContentProofMethod,
        visibleContentSampleCount: state.visibleContentSampleCount,
        visibleContentVarianceScore: state.visibleContentVarianceScore
      });
    }

    hydrateControls();
    evaluateNewsGates();
    maybeFinalize(`visible-proof-${reason}`);
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
        (Number(canvas.width || 0) > 0 && Number(canvas.height || 0) > 0) ||
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
      width = Math.max(1, Number(canvas.width || Math.floor(rect?.width || 0)));
      height = Math.max(1, Number(canvas.height || Math.floor(rect?.height || 0)));
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
    const passed = Boolean(enoughSamples && enoughVariance && hasLand && hasWaterOrOther && state.textureComposeComplete);

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

  function evaluateNewsGates() {
    state.northGateReady = Boolean(
      state.step1Accepted &&
      state.runtimeTableSessionAttempted &&
      state.checkpointBrainActive &&
      isCompleted("S4_RUNTIME_TABLE_SESSION_READY")
    );

    state.eastGateReady = Boolean(
      state.canvasCarrierRequested &&
      state.canvasCarrierHandoffOk &&
      state.canvasCarrierMounted &&
      (state.canvasContextReady || state.canvasReady)
    );

    state.westGateReady = Boolean(
      state.copyDiagnosticReady &&
      state.receiptToggleReady &&
      state.inspectPlanetControlReady &&
      state.collapseExpandControlReady &&
      state.showDiagnosticTabReady &&
      state.buttonsReachable
    );

    state.southGateReady = Boolean(
      state.visibleContentProof &&
      state.visiblePlanetAvailable &&
      state.nonblankPlanetVisible &&
      state.dragInspectionBound &&
      state.diagnosticCanLeavePlanetFrame
    );

    state.newsGatePassedBeforeF21 = Boolean(
      state.northGateReady &&
      state.eastGateReady &&
      state.westGateReady &&
      state.southGateReady
    );

    state.f21Allowed = Boolean(
      isCompleted("S11_INSPECT_MODE_READY") &&
      state.newsGatePassedBeforeF21
    );

    return state.newsGatePassedBeforeF21;
  }

  function maybeFinalize(reason = "manual") {
    hydrateControls();
    maybeCompleteAtlasTextureFrame(`finalize-${reason}`);

    if (state.canvasReady && !state.visibleContentProof) {
      startVisibleContentProof(`finalize-${reason}`);
    }

    evaluateNewsGates();

    if (!state.newsGatePassedBeforeF21 || !state.f21Allowed) {
      deriveFailureCoordinate();
      scheduleRender();
      return false;
    }

    completeCheckpoint("COMPLETION_LATCHED", {
      reason,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      f21Allowed: state.f21Allowed
    });

    return true;
  }

  function forceCompletionLatch() {
    state.completionLatched = true;
    state.finalReceiptAvailable = true;
    state.f21Allowed = true;
    state.f21AfterS11 = true;
    state.currentStage = "F21";
    state.highestStage = "F21";
    state.mainDisplayProgress = 100;
    state.mainProgressCap = 100;
    state.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    state.firstFailedCoordinate = "NONE_NEWS_FIBONACCI_F21_LATCHED";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    state.latestVisibleEvent = "COMPLETION_LATCHED";

    if (refs.ledger && refs.ledger.state) {
      refs.ledger.state.completionLatched = true;
      refs.ledger.state.currentStage = "F21";
      refs.ledger.state.highestStage = "F21";
      refs.ledger.state.updatedAt = nowIso();
    }

    setCockpitMode("diagnostic-dock");
  }

  function deriveFailureCoordinate() {
    if (state.completionLatched) {
      state.firstFailedCoordinate = "NONE_NEWS_FIBONACCI_F21_LATCHED";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
      return;
    }

    if (!state.step1Accepted) {
      state.firstFailedCoordinate = "WAITING_INDEX_STEP1_HANDOFF";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.mountReady) {
      state.firstFailedCoordinate = "WAITING_INDEX_MOUNT";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.runtimeTableSessionAttempted) {
      state.firstFailedCoordinate = "WAITING_RUNTIME_TABLE_SESSION_ATTEMPT";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.canvasCarrierRequested) {
      state.firstFailedCoordinate = "WAITING_CANVAS_COORDINATION_START";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.canvasCarrierHandoffOk) {
      state.firstFailedCoordinate = "WAITING_CANVAS_CARRIER_HANDOFF";
      state.recommendedNextRenewalTarget = state.canvasApiPresent ? COHERENCE_FILE : CANVAS_FILE;
      return;
    }

    if (!state.canvasCarrierMounted) {
      state.firstFailedCoordinate = "WAITING_CANVAS_MOUNT_CONFIRMED";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.atlasBuildComplete || !state.textureComposeComplete || !state.firstFrameDetected) {
      state.firstFailedCoordinate = "WAITING_ATLAS_TEXTURE_FRAME_READY";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.visibleContentProof) {
      state.firstFailedCoordinate = "WAITING_VISIBLE_CONTENT_PROOF";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.diagnosticCanLeavePlanetFrame) {
      state.firstFailedCoordinate = "WAITING_INSPECT_MODE_CONTROLS";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.newsGatePassedBeforeF21) {
      if (!state.northGateReady) state.firstFailedCoordinate = "WAITING_NEWS_NORTH_GATE";
      else if (!state.eastGateReady) state.firstFailedCoordinate = "WAITING_NEWS_EAST_GATE";
      else if (!state.westGateReady) state.firstFailedCoordinate = "WAITING_NEWS_WEST_GATE";
      else if (!state.southGateReady) state.firstFailedCoordinate = "WAITING_NEWS_SOUTH_GATE";
      else state.firstFailedCoordinate = "WAITING_NEWS_GATE";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    state.firstFailedCoordinate = "WAITING_F21_COMPLETION_LATCH";
    state.recommendedNextRenewalTarget = COHERENCE_FILE;
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    state.step1Accepted = Boolean(
      state.step1Accepted ||
      dataset.hearthIndexStep1Complete === "true" ||
      dataset.hearthFirstPaintCockpitReady === "true"
    );

    state.canvasReady = Boolean(state.canvasReady || bool(dataset.hearthCanvasReady));
    state.canvasCarrierMounted = Boolean(state.canvasCarrierMounted || bool(dataset.hearthCanvasCarrierMounted));
    state.firstFrameDetected = Boolean(state.firstFrameDetected || bool(dataset.hearthFirstFrameDetected));
    state.imageRendered = Boolean(state.imageRendered || bool(dataset.hearthImageRendered) || bool(dataset.hearthCanvasImageRendered));
    state.dragInspectionBound = Boolean(state.dragInspectionBound || bool(dataset.hearthDragInspectionBound) || bool(dataset.hearthControlsBound));

    state.visibleContentProof = Boolean(state.visibleContentProof || bool(dataset.hearthVisibleContentProof));
    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || bool(dataset.hearthVisiblePlanetAvailable));
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || bool(dataset.hearthPlanetCanvasPresent));
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || bool(dataset.hearthPlanetCanvasNonZeroSize));
    state.planetFramePainted = Boolean(state.planetFramePainted || bool(dataset.hearthPlanetFramePainted));
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || bool(dataset.hearthNonblankPlanetVisible));

    state.completionLatched = Boolean(state.completionLatched || bool(dataset.hearthCompletionLatched));

    if (state.completionLatched) forceCompletionLatch();
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    acceptIndexHandoff(getIndexHandoff() || {});
    hydrateControls();

    const receipt = getCanvasReceipt();
    if (receipt && isObject(receipt)) {
      handleCanvasReceiptLight(receipt);
    }

    maybeCompleteAtlasTextureFrame(`reconcile-${reason}`);

    if ((state.canvasReady || state.firstFrameDetected || state.imageRendered) && !state.visibleContentProof) {
      startVisibleContentProof(`reconcile-${reason}`);
    }

    evaluateNewsGates();
    maybeFinalize(`reconcile-${reason}`);
    deriveFailureCoordinate();

    publishGlobals();
    scheduleRender();
  }

  function computeProgress() {
    if (state.completionLatched) {
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      return 100;
    }

    const active = activeCheckpoint();
    state.mainProgressCap = 98;
    state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, active ? active.progress : 0));

    if (state.visibleContentProof) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);

    return Math.round(state.mainDisplayProgress);
  }

  function renderLaneMarkup() {
    return CHECKPOINTS.map((checkpoint) => {
      const complete = isCompleted(checkpoint.id);
      const active = state.activeCheckpointId === checkpoint.id;
      const queued = state.queuedEvents.some((event) => event.checkpointId === checkpoint.id);
      const status = complete ? "COMPLETE" : active ? "ACTIVE" : queued ? "QUEUED" : checkpoint.rank < state.activeCheckpointRank ? "ARCHIVED" : "PENDING";
      const progress = complete ? checkpoint.progress : active ? Math.min(98, checkpoint.progress) : 0;

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(checkpoint.lane)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>Step ${checkpoint.step} · ${escapeHtml(checkpoint.label)} · ${escapeHtml(checkpoint.fibonacci)}</strong>
              <span>${escapeHtml(checkpoint.event)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>checkpoint=${escapeHtml(checkpoint.id)}</span>
          </div>
        </section>
      `;
    }).join("");
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
    const elapsed = state.startedAtMs ? nowMs() - state.startedAtMs : 0;

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : "HEARTH COMMAND BRAIN · STEPS 2–11";
    }

    if (refs.stage) {
      refs.stage.textContent = state.completionLatched
        ? "F21 · Completion latch"
        : `${state.activeFibonacciStage || state.currentStage} · ${activeCheckpoint().label}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = state.completionLatched
        ? `F21 latched · elapsed=${formatElapsed(elapsed)}`
        : `soft-gap governor=true · step1=index.js · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestVisibleEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;
    if (refs.laneList) refs.laneList.innerHTML = renderLaneMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    refs.cockpit.dataset.hearthCommandBrain = CONTRACT;
    refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    refs.cockpit.dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    refs.cockpit.dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    refs.cockpit.dataset.hearthSoftGapGovernor = String(state.softGapGovernor);
    refs.cockpit.dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    refs.cockpit.dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

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
      "Hearth command brain active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${COHERENCE_FILE}`,
      `Owns Step 1 ${state.ownsStep1}`,
      `Owns Steps 2 through 11 ${state.ownsSteps2Through11}`,
      `Step 1 accepted ${state.step1Accepted}`,
      `Runtime Table present ${state.runtimeTablePresent}`,
      `Runtime Table session attempted ${state.runtimeTableSessionAttempted}`,
      `Runtime Table session created ${state.runtimeTableSessionCreated}`,
      `Soft gap governor ${state.softGapGovernor}`,
      `Hard block mode ${state.hardBlockMode}`,
      `Forward progress allowed with gaps ${state.forwardProgressAllowedWithGaps}`,
      `Active checkpoint ${state.activeCheckpointId}`,
      `Highest completed checkpoint ${state.highestCompletedCheckpointId}`,
      `North gate ${state.northGateReady}`,
      `East gate ${state.eastGateReady}`,
      `West gate ${state.westGateReady}`,
      `South gate ${state.southGateReady}`,
      `NEWS passed before F21 ${state.newsGatePassedBeforeF21}`,
      `F21 allowed ${state.f21Allowed}`,
      `Completion latched ${state.completionLatched}`,
      `Visible content proof ${state.visibleContentProof}`,
      `Diagnostic can leave planet frame ${state.diagnosticCanLeavePlanetFrame}`,
      `Generated image false`,
      `GraphicBox false`,
      `WebGL false`,
      `Visual pass claimed false`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
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

    recordLocal(ok ? "COMMAND_BRAIN_DIAGNOSTIC_COPIED" : "COMMAND_BRAIN_DIAGNOSTIC_COPY_FAILED", {
      lane: "inspectMode",
      status: ok ? "COPIED" : "COPY_FAILED"
    });

    return ok;
  }

  function getRuntimeTableReceipt() {
    if (!refs.runtimeSession || !isFunction(refs.runtimeSession.getReceipt)) return null;

    try {
      const receipt = refs.runtimeSession.getReceipt();
      state.runtimeTableReceiptAvailable = Boolean(receipt);
      state.runtimeTableReceiptError = "";
      return receipt;
    } catch (error) {
      state.runtimeTableReceiptError = error && error.message ? error.message : String(error);
      recordGap("RUNTIME_TABLE_RECEIPT_READ_FAILED", state.runtimeTableReceiptError);
      return null;
    }
  }

  function buildReceipt() {
    evaluateNewsGates();
    deriveFailureCoordinate();

    const runtimeReceipt = getRuntimeTableReceipt();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: COHERENCE_FILE,
      route: ROUTE,
      role: state.role,

      pairedSemiconductor: true,
      pairedWith: INDEX_FILE,
      indexJsStartsProcess: true,
      hearthJsFinishesProcess: true,
      systematicAndSynchronized: true,
      synchronizedLoading: true,

      ownsStep1: state.ownsStep1,
      ownsSteps2Through11: state.ownsSteps2Through11,
      step1Source: state.step1Source,
      step1Accepted: state.step1Accepted,
      step1ReceiptPresent: state.step1ReceiptPresent,
      step1Contract: state.step1Contract,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      ownsFirstPaintSurvival: state.ownsFirstPaintSurvival,
      ownsMountCreation: state.ownsMountCreation,
      ownsInitialCockpitCreation: state.ownsInitialCockpitCreation,
      ownsRouteBrain: state.ownsRouteBrain,
      ownsScriptOrderIntake: state.ownsScriptOrderIntake,
      ownsAuthorityAssessment: state.ownsAuthorityAssessment,
      ownsRuntimeTableSession: state.ownsRuntimeTableSession,
      ownsCheckpointGovernorConsumer: state.ownsCheckpointGovernorConsumer,
      ownsNewsFibonacciGovernance: state.ownsNewsFibonacciGovernance,
      ownsCanvasCoordination: state.ownsCanvasCoordination,
      ownsVisiblePlanetProof: state.ownsVisiblePlanetProof,
      ownsInspectModeTruth: state.ownsInspectModeTruth,
      ownsCompletionLatch: state.ownsCompletionLatch,
      ownsFinalDiagnosticReceipt: state.ownsFinalDiagnosticReceipt,
      ownsFinalVisualPassClaim: state.ownsFinalVisualPassClaim,

      gapAssessmentFast: state.gapAssessmentFast,
      hardBlockMode: state.hardBlockMode,
      softGapGovernor: state.softGapGovernor,
      forwardProgressAllowedWithGaps: state.forwardProgressAllowedWithGaps,
      blockedProgressCap: state.blockedProgressCap,
      readyTextRequiresF21: state.readyTextRequiresF21,

      checkpointBrainActive: state.checkpointBrainActive,
      chronologicalFibonacciAlignment: state.chronologicalFibonacciAlignment,
      newsFibonacciAlignment: state.newsFibonacciAlignment,
      oneActiveCheckpointAtATime: state.oneActiveCheckpointAtATime,
      futureEventsQueued: state.futureEventsQueued,
      completedEventsArchived: state.completedEventsArchived,
      regressiveEventsBlocked: state.regressiveEventsBlocked,

      activeCheckpointId: state.activeCheckpointId,
      activeCheckpointRank: state.activeCheckpointRank,
      activeFibonacciStage: state.activeFibonacciStage,
      completedCheckpoints: state.completedCheckpoints.join(","),
      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      highestCompletedRank: state.highestCompletedRank,
      queuedEventsCount: state.queuedEvents.length,
      admittedEventsCount: state.admittedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      blockedEventsCount: state.blockedEvents.length,
      gapEventsCount: state.gapEvents.length,

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      mainDisplayProgress: state.mainDisplayProgress,
      mainProgressCap: state.mainProgressCap,
      completionLatched: state.completionLatched,
      f21Allowed: state.f21Allowed,
      f21AfterS11: state.f21AfterS11,
      finalReceiptAvailable: state.finalReceiptAvailable,

      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,

      mountReady: state.mountReady,
      cockpitFound: state.cockpitFound,
      cockpitHydrated: state.cockpitHydrated,
      showDiagnosticTabReady: state.showDiagnosticTabReady,
      copyDiagnosticReady: state.copyDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      inspectPlanetControlReady: state.inspectPlanetControlReady,
      collapseExpandControlReady: state.collapseExpandControlReady,
      buttonsReachable: state.buttonsReachable,
      dockHiddenForInspection: state.dockHiddenForInspection,
      cockpitExpanded: state.cockpitExpanded,
      receiptVisible: state.receiptVisible,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableSessionAttempted: state.runtimeTableSessionAttempted,
      runtimeTableSessionCreated: state.runtimeTableSessionCreated,
      runtimeTableSessionError: state.runtimeTableSessionError,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      runtimeTableReceiptAvailable: state.runtimeTableReceiptAvailable,
      runtimeTableReceiptError: state.runtimeTableReceiptError,

      canvasApiPresent: state.canvasApiPresent,
      canvasScriptPresent: state.canvasScriptPresent,
      canvasScriptInjected: state.canvasScriptInjected,
      canvasScriptLoaded: state.canvasScriptLoaded,
      canvasScriptError: state.canvasScriptError,
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
      planetNotObstructed: state.planetNotObstructed,

      sourceAuthorityHeld: state.sourceAuthorityHeld,
      climateRouteRetired: state.climateRouteRetired,
      runtimeTableMutation: state.runtimeTableMutation,
      canvasMutation: state.canvasMutation,

      latestVisibleEvent: state.latestVisibleEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      runtimeTableReceipt: runtimeReceipt ? clonePlain(runtimeReceipt) : null,
      checkpointSequence: CHECKPOINTS.map(clonePlain),
      queuedEvents: clonePlain(state.queuedEvents),
      admittedEvents: clonePlain(state.admittedEvents),
      archivedEvents: clonePlain(state.archivedEvents),
      blockedEvents: clonePlain(state.blockedEvents),
      gapEvents: clonePlain(state.gapEvents),
      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      sourceStackHeld: SOURCE_STACK_HELD.slice(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return buildReceipt();
  }

  function getReceiptText() {
    const receipt = buildReceipt();

    const sequenceText = receipt.checkpointSequence.map((checkpoint) => {
      const complete = state.completedCheckpoints.includes(checkpoint.id);
      const active = state.activeCheckpointId === checkpoint.id;
      const queued = state.queuedEvents.some((event) => event.checkpointId === checkpoint.id);
      const status = complete ? "COMPLETE" : active ? "ACTIVE" : queued ? "QUEUED" : "PENDING";
      return `- ${checkpoint.id}: step=${checkpoint.step}; rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${status}; complete=${complete}; progress=${checkpoint.progress}; event=${checkpoint.event}`;
    }).join("\n");

    const gapsText = receipt.gapEvents.map((gap) => (
      `- ${gap.at || ""} :: ${gap.code || ""} :: hardBlocked=${gap.hardBlocked}; forwardProgressAllowed=${gap.forwardProgressAllowed}; ${gap.message || ""}`
    )).join("\n") || "- none";

    const canvasText = receipt.canvasPhaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || 0}`
    )).join("\n") || "- none";

    const progressText = receipt.progressOnlyEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || 0}`
    )).join("\n") || "- none";

    const localText = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${event.detail && event.detail.status ? event.detail.status : ""}`
    )).join("\n") || "- none";

    const errorsText = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    const sourceStackText = receipt.sourceStackHeld.map((item) => `- ${item}`).join("\n");

    return [
      "HEARTH_ROUTE_COMMAND_BRAIN_STEPS_2_11_RECEIPT",
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
      `indexJsStartsProcess=${receipt.indexJsStartsProcess}`,
      `hearthJsFinishesProcess=${receipt.hearthJsFinishesProcess}`,
      `systematicAndSynchronized=${receipt.systematicAndSynchronized}`,
      `synchronizedLoading=${receipt.synchronizedLoading}`,
      "",
      `ownsStep1=${receipt.ownsStep1}`,
      `ownsSteps2Through11=${receipt.ownsSteps2Through11}`,
      `step1Source=${receipt.step1Source}`,
      `step1Accepted=${receipt.step1Accepted}`,
      `step1ReceiptPresent=${receipt.step1ReceiptPresent}`,
      `step1Contract=${receipt.step1Contract}`,
      `step1HandoffAcceptedAt=${receipt.step1HandoffAcceptedAt}`,
      "",
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCreation=${receipt.ownsMountCreation}`,
      `ownsInitialCockpitCreation=${receipt.ownsInitialCockpitCreation}`,
      `ownsRouteBrain=${receipt.ownsRouteBrain}`,
      `ownsScriptOrderIntake=${receipt.ownsScriptOrderIntake}`,
      `ownsAuthorityAssessment=${receipt.ownsAuthorityAssessment}`,
      `ownsRuntimeTableSession=${receipt.ownsRuntimeTableSession}`,
      `ownsCheckpointGovernorConsumer=${receipt.ownsCheckpointGovernorConsumer}`,
      `ownsNewsFibonacciGovernance=${receipt.ownsNewsFibonacciGovernance}`,
      `ownsCanvasCoordination=${receipt.ownsCanvasCoordination}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsInspectModeTruth=${receipt.ownsInspectModeTruth}`,
      `ownsCompletionLatch=${receipt.ownsCompletionLatch}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `gapAssessmentFast=${receipt.gapAssessmentFast}`,
      `hardBlockMode=${receipt.hardBlockMode}`,
      `softGapGovernor=${receipt.softGapGovernor}`,
      `forwardProgressAllowedWithGaps=${receipt.forwardProgressAllowedWithGaps}`,
      `blockedProgressCap=${receipt.blockedProgressCap}`,
      `readyTextRequiresF21=${receipt.readyTextRequiresF21}`,
      "",
      `checkpointBrainActive=${receipt.checkpointBrainActive}`,
      `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
      `newsFibonacciAlignment=${receipt.newsFibonacciAlignment}`,
      `oneActiveCheckpointAtATime=${receipt.oneActiveCheckpointAtATime}`,
      `futureEventsQueued=${receipt.futureEventsQueued}`,
      `completedEventsArchived=${receipt.completedEventsArchived}`,
      `regressiveEventsBlocked=${receipt.regressiveEventsBlocked}`,
      "",
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `completedCheckpoints=${receipt.completedCheckpoints}`,
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `gapEventsCount=${receipt.gapEventsCount}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `completionLatched=${receipt.completionLatched}`,
      `f21Allowed=${receipt.f21Allowed}`,
      `f21AfterS11=${receipt.f21AfterS11}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      "",
      `northGateReady=${receipt.northGateReady}`,
      `eastGateReady=${receipt.eastGateReady}`,
      `westGateReady=${receipt.westGateReady}`,
      `southGateReady=${receipt.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `cockpitFound=${receipt.cockpitFound}`,
      `cockpitHydrated=${receipt.cockpitHydrated}`,
      `showDiagnosticTabReady=${receipt.showDiagnosticTabReady}`,
      `copyDiagnosticReady=${receipt.copyDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectPlanetControlReady=${receipt.inspectPlanetControlReady}`,
      `collapseExpandControlReady=${receipt.collapseExpandControlReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `dockHiddenForInspection=${receipt.dockHiddenForInspection}`,
      `cockpitExpanded=${receipt.cockpitExpanded}`,
      `receiptVisible=${receipt.receiptVisible}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      "",
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableSessionAttempted=${receipt.runtimeTableSessionAttempted}`,
      `runtimeTableSessionCreated=${receipt.runtimeTableSessionCreated}`,
      `runtimeTableSessionError=${receipt.runtimeTableSessionError}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTablePlanAttempted=${receipt.runtimeTablePlanAttempted}`,
      `runtimeTablePlanCreated=${receipt.runtimeTablePlanCreated}`,
      `runtimeTablePlanError=${receipt.runtimeTablePlanError}`,
      `runtimeTableReceiptAvailable=${receipt.runtimeTableReceiptAvailable}`,
      `runtimeTableReceiptError=${receipt.runtimeTableReceiptError}`,
      "",
      `canvasApiPresent=${receipt.canvasApiPresent}`,
      `canvasScriptPresent=${receipt.canvasScriptPresent}`,
      `canvasScriptInjected=${receipt.canvasScriptInjected}`,
      `canvasScriptLoaded=${receipt.canvasScriptLoaded}`,
      `canvasScriptError=${receipt.canvasScriptError}`,
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
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `runtimeTableMutation=${receipt.runtimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      "",
      `latestVisibleEvent=${receipt.latestVisibleEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      "CHECKPOINT_SEQUENCE",
      sequenceText,
      "",
      "SOFT_GAP_EVENTS",
      gapsText,
      "",
      "CANVAS_PHASE_EVENTS",
      canvasText,
      "",
      "PROGRESS_ONLY_EVENTS",
      progressText,
      "",
      "LOCAL_EVENTS",
      localText,
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

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.routeConductor = api;
    root.HEARTH.coherenceSemiconductor = api;
    root.HEARTH.commandBrain = api;

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ACTIVE_ROUTE = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;
    root.HEARTH_ROUTE_COMMAND_BRAIN = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
    root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    const receipt = getReceiptLight();

    root.HEARTH_ROUTE_COMMAND_BRAIN_RECEIPT = receipt;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = receipt;

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCommandBrainLoaded = "true";
    dataset.hearthCommandBrainContract = CONTRACT;
    dataset.hearthCommandBrainReceipt = RECEIPT;
    dataset.hearthCommandBrainOwnsStep1 = "false";
    dataset.hearthCommandBrainOwnsSteps2Through11 = "true";
    dataset.hearthStep1Source = INDEX_FILE;
    dataset.hearthStep1Accepted = String(state.step1Accepted);

    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthActiveRouteFile = COHERENCE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;

    dataset.hearthSoftGapGovernor = String(state.softGapGovernor);
    dataset.hearthHardBlockMode = String(state.hardBlockMode);
    dataset.hearthForwardProgressAllowedWithGaps = String(state.forwardProgressAllowedWithGaps);

    dataset.hearthChronologicalFibonacciAlignment = "true";
    dataset.hearthNewsFibonacciAlignment = "true";
    dataset.hearthOneActiveCheckpointAtATime = "true";
    dataset.hearthActiveCheckpointId = state.activeCheckpointId;
    dataset.hearthHighestCompletedCheckpointId = state.highestCompletedCheckpointId;

    dataset.hearthNorthGateReady = String(state.northGateReady);
    dataset.hearthEastGateReady = String(state.eastGateReady);
    dataset.hearthWestGateReady = String(state.westGateReady);
    dataset.hearthSouthGateReady = String(state.southGateReady);
    dataset.hearthNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);
    dataset.hearthF21Allowed = String(state.f21Allowed);
    dataset.hearthCompletionLatched = String(state.completionLatched);

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);

    dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthVisibleContentProofMethod = state.visibleContentProofMethod;
    dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthNonblankPlanetVisible = String(state.nonblankPlanetVisible);

    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthCommandBrainInspect = String(state.dockHiddenForInspection);
    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: COHERENCE_FILE,
      route: ROUTE,
      ownsStep1: false,
      ownsSteps2Through11: true,
      step1Accepted: state.step1Accepted,
      softGapGovernor: state.softGapGovernor,
      hardBlockMode: state.hardBlockMode,
      forwardProgressAllowedWithGaps: state.forwardProgressAllowedWithGaps,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,
      activeCheckpointId: state.activeCheckpointId,
      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      f21Allowed: state.f21Allowed,
      completionLatched: state.completionLatched,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
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

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("heartbeat");
      } else {
        forceCompletionLatch();
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
      } else {
        forceCompletionLatch();
      }
    }, 1400);
  }

  async function boot() {
    if (bootStarted) {
      publishGlobals();
      return buildReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.startedAtMs = nowMs();
    state.updatedAt = state.startedAt;
    state.postgameStatus = "COMMAND_BRAIN_BOOTING";

    retireClimateRoute();
    ensureLedger();
    ensureStyle();
    resolveMount();
    resolveCockpit();
    ensureShowTab();
    acceptIndexHandoff(getIndexHandoff() || {});
    hydrateControls();
    scanScriptPresence();
    createRuntimeTableSession();
    createRuntimeTablePlan();

    publishGlobals();
    render();

    root.setTimeout(() => {
      callCanvasCarrier();
    }, 80);

    root.setTimeout(() => reconcileAll("post-boot-240ms"), 240);
    root.setTimeout(() => reconcileAll("post-boot-900ms"), 900);
    root.setTimeout(() => reconcileAll("post-boot-1800ms"), 1800);
    root.setTimeout(() => reconcileAll("post-boot-3600ms"), 3600);

    startHeartbeat();
    startReconcileLoop();

    return buildReceipt();
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

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    recordLocal("COMMAND_BRAIN_DISPOSED", {
      lane: "completionLatch",
      status: "DISPOSED",
      message: reason
    });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: COHERENCE_FILE,
    role: "central-command-brain-steps-2-through-11",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    acceptIndexHandoff,
    handleCanvasPhase,
    handleCanvasReceipt,
    reconcile: reconcileAll,
    tryFinalize: maybeFinalize,
    setCockpitMode,
    proveVisibleContent,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsIndexHandoff: true,
    supportsStep1Externalization: true,
    supportsSteps2Through11Brain: true,
    supportsSoftGapGovernor: true,
    supportsForwardProgressWithGaps: true,
    supportsRuntimeTableCheckpointConsumer: true,
    supportsChronologicalFibonacciAlignment: true,
    supportsNewsFibonacciAlignment: true,
    supportsOneActiveCheckpointAtATime: true,
    supportsVisibleContentCompletionGate: true,
    supportsInspectModeCompletionGate: true,
    supportsDiagnosticDockRestore: true,
    supportsCopyDiagnosticPreservation: true,
    supportsShowReceiptPreservation: true,
    supportsCooperativeCanvasHandoff: true,

    ownsStep1: false,
    ownsSteps2Through11: true,
    ownsFirstPaintSurvival: false,
    ownsMountCreation: false,
    ownsInitialCockpitCreation: false,
    ownsRouteBrain: true,
    ownsCanvasDrawing: false,
    ownsAtlasGeneration: false,
    ownsTextureGeneration: false,
    ownsRuntimeTableImplementation: false,
    ownsRuntimeTableMutation: false,
    ownsCanvasMutation: false,
    ownsSourceStackTruth: false,
    ownsHtmlStructure: false,
    ownsClimateRouteRendering: false,
    ownsFinalVisualPassClaim: false,

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
