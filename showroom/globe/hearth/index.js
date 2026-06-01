// /showroom/globe/hearth/index.js
// HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST_TNT_v3
// Full-file replacement.
// Male route-shell host / dynamic shell alignment / pre-release Canvas carrier host / non-blocking runtime release.
// Purpose:
// - Split route-shell responsibility away from /showroom/globe/hearth/hearth.js.
// - Make this file the male shell host: visible route structure, required anchors, controls, mount, diagnostic dock, and runtime script release.
// - Keep /showroom/globe/hearth/hearth.js as downstream route conductor / macro-cycle coordination consumer.
// - Load the Canvas parent early enough for pre-release structural carrier proof before Macro West admissibility.
// - Provide a stable #hearthCanvasMount and shell-carrier packet for /assets/hearth/hearth.canvas.js.
// - Preserve runtime release without reintroducing WAITING_MATCHED_MALE_HTML_SHELL contradiction.
// - Preserve shell visibility during downstream runtime, Canvas, material, or visible-proof failure.
// - Keep Canvas at F13 evidence only.
// - Keep F21 North-only.
// - Never claim ready text, F21 latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST_TNT_v3";
  const RECEIPT = "HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_TNT_v2";
  const VERSION = "2026-06-01.hearth-male-route-shell-pre-release-carrier-runtime-host-v3";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const PAIRED_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_RUNTIME_FILE = "/assets/lab/runtime-table.js";
  const EAST_RUNTIME_FILE = "/assets/lab/runtime-table.east.js";
  const SOUTH_RUNTIME_FILE = "/assets/lab/runtime-table.south.js";
  const WEST_RUNTIME_FILE = "/assets/lab/runtime-table.west.js";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_SOUTH_PAIR_MALE_SHELL_FEMALE_SELECTED_RUNTIME_RECEIVER_TNT_v1";
  const CURRENT_SAFE_HTML_CONTRACT = "HEARTH_HTML_NON_BLOCKING_EAST_BOOT_TWO_CYCLE_RUNTIME_SHELL_TNT_v3";

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DYNAMIC_ALIGNMENT_ANCHORS = Object.freeze([
    "#hearth-main",
    "#hearthCanvasMount",
    "#hearthLoadCockpit",
    "#hearth-route-status",
    "#hearthReceiptPanel",
    "#hearthMapPortal",
    "[data-hearth-stage-label]",
    "[data-hearth-heartbeat-text]",
    "[data-hearth-latest-event]",
    "[data-hearth-main-progress-fill]",
    "[data-hearth-main-progress-percent]",
    "[data-hearth-copy-diagnostic]",
    "[data-hearth-toggle-receipt]",
    "[data-hearth-inspect-planet]",
    "[data-hearth-collapse-cockpit]"
  ]);

  const RUNTIME_FILES = Object.freeze([
    {
      key: "northRuntimeTable",
      label: "North Runtime Table",
      news: "NORTH",
      fibonacci: "F8N",
      file: NORTH_RUNTIME_FILE,
      required: true,
      carrierPreflightAfter: false,
      globals: [
        "LAB_RUNTIME_TABLE",
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
        "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_DISTRIBUTOR",
        "DexterRuntimeTable",
        "RUNTIME_TABLE",
        "DEXTER_LAB.runtimeTable",
        "DEXTER_LAB.cardinalRuntimeTableNorth"
      ]
    },
    {
      key: "canvasParent",
      label: "Canvas Parent Pre-release Carrier",
      news: "CANVAS",
      fibonacci: "F13P",
      file: CANVAS_PARENT_FILE,
      required: false,
      carrierPreflightAfter: true,
      globals: [
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_AUTHORITY",
        "HEARTH_CANVAS_EVIDENCE",
        "HEARTH_CANVAS_NORTH",
        "HEARTH_CANVAS_PRE_RELEASE_STRUCTURAL_CARRIER",
        "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
        "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
        "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
        "HEARTH.canvas",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasEvidence",
        "HEARTH.canvasNorth",
        "HEARTH.canvasPreReleaseStructuralCarrier",
        "HEARTH.canvasParentGovernedF13EvidenceReceiver",
        "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
        "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
        "DEXTER_LAB.hearthCanvasEvidence",
        "DEXTER_LAB.hearthCanvasPreReleaseStructuralCarrier",
        "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast"
      ]
    },
    {
      key: "eastBranch",
      label: "East Runtime Branch",
      news: "EAST",
      fibonacci: "F8E",
      file: EAST_RUNTIME_FILE,
      required: false,
      carrierPreflightAfter: false,
      globals: [
        "LAB_RUNTIME_TABLE_EAST",
        "LAB_CARDINAL_RUNTIME_TABLE_EAST",
        "LAB_CHECKPOINT_GOVERNOR_EAST",
        "HEARTH_EAST_FIBONACCI_MAGNIFIER",
        "RUNTIME_TABLE_EAST",
        "DEXTER_LAB.runtimeTableEast",
        "DEXTER_LAB.cardinalRuntimeTableEast"
      ]
    },
    {
      key: "southVisibleProof",
      label: "South Runtime Visible Proof",
      news: "SOUTH",
      fibonacci: "F8S",
      file: SOUTH_RUNTIME_FILE,
      required: false,
      carrierPreflightAfter: false,
      globals: [
        "LAB_RUNTIME_TABLE_SOUTH",
        "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
        "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
        "HEARTH_RUNTIME_TABLE_SOUTH",
        "HEARTH_VISIBLE_STATE_COMPOSER",
        "RUNTIME_TABLE_SOUTH",
        "DEXTER_LAB.runtimeTableSouth",
        "DEXTER_LAB.cardinalRuntimeTableSouth",
        "DEXTER_LAB.visibleStateComposer"
      ]
    },
    {
      key: "westAdmissibility",
      label: "Macro West Admissibility",
      news: "WEST",
      fibonacci: "F8W",
      file: WEST_RUNTIME_FILE,
      required: false,
      carrierPreflightAfter: true,
      globals: [
        "LAB_RUNTIME_TABLE_WEST",
        "LAB_CARDINAL_RUNTIME_TABLE_WEST",
        "LAB_GAP_CLASSIFIER_WEST",
        "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
        "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
        "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.gapClassifierWest",
        "DEXTER_LAB.cycleAwareAdmissibilityClutchWest"
      ]
    },
    {
      key: "routeConductor",
      label: "Paired Route Conductor",
      news: "SOUTH",
      fibonacci: "F8S",
      file: PAIRED_ROUTE_CONDUCTOR_FILE,
      required: false,
      carrierPreflightAfter: true,
      globals: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
        "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT",
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductorPrimaryGate",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor"
      ]
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    pairRole: "male-route-shell-host",
    pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,
    pairedRouteConductorRole: "female-route-conductor-macro-cycle-consumer",
    maleShellOwnsRouteAnchors: true,
    maleShellOwnsMountHost: true,
    maleShellOwnsControls: true,
    maleShellOwnsRuntimeScriptRelease: true,
    maleShellOwnsCanvasCarrierHostPacket: true,

    ownsMacroWestTruth: false,
    ownsCanvasStructuralCarrierTruth: false,
    ownsCanvasReleaseTruth: false,
    ownsCanvasDrawing: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsPlanetTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,
    shellContract: "",
    shellDetected: false,
    shellSelected: false,
    shellAccepted: false,
    shellSelectionMode: "UNSELECTED",
    shellHoldReason: "WAITING_SHELL_DETECTION",
    dynamicAnchorsPass: false,
    missingAnchors: [],
    shellControlsBound: false,
    shellRescued: false,
    shellRescueCount: 0,

    mountPresent: false,
    cockpitPresent: false,
    statusNodePresent: false,
    receiptPanelPresent: false,
    portalPresent: false,
    carrierHostReady: false,
    carrierHostPacketReady: false,

    canvasParentObserved: false,
    canvasParentApiReady: false,
    canvasParentLoadedBeforeWest: false,
    canvasPreReleaseCarrierRequested: false,
    canvasPreReleaseCarrierObserved: false,
    canvasPreReleaseCarrierAccepted: false,
    canvasPreReleaseCarrierSafeForWest: false,
    canvasCarrierReceiptObserved: false,
    canvasCarrierHeldReason: "WAITING_CANVAS_PARENT_PRE_RELEASE_CARRIER",
    canvasParentReceipt: null,

    runtimeReleaseRequestable: false,
    runtimeReleaseRequested: false,
    runtimeReleaseAuthorized: false,
    runtimeReleaseStarted: false,
    runtimeReleaseComplete: false,
    runtimeHeld: false,
    runtimeReleaseHeldReason: "WAITING_SHELL_SELECTION",
    runtimeLoaded: [],
    runtimeHeldFiles: [],
    runtimeErrors: [],
    currentRuntimeKey: "",
    currentRuntimeFile: "",

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    activeNews: "EAST",
    activeFibonacci: "F1",
    activeFibonacciRank: 1,
    activeStageId: "F1_ROUTE_SHELL_OBSERVED",
    activeGearId: "hearth-male-route-shell-host-f1",
    activeProgress: 8,
    oneActiveGearAtATime: true,

    f13CanvasDelegated: true,
    f13CarrierHostAvailable: false,
    f13CanvasEvidenceOwnedByCanvas: true,
    f21NorthOnly: true,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByIndex: false,
    readyTextAllowed: false,
    readyTextClaimedByIndex: false,

    firstFailedCoordinate: "WAITING_SHELL_SELECTION",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "MALE_ROUTE_SHELL_HOST_LOADED",

    renderWriteCount: 0,
    receiptWriteCount: 0,
    bootStarted: false,
    booted: false,
    settled: false,
    startedAt: "",
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    main: null,
    mount: null,
    cockpit: null,
    status: null,
    receiptPanel: null,
    receiptText: null,
    copyButton: null,
    toggleButton: null,
    inspectButton: null,
    collapseButton: null,
    showDiagnosticTab: null,
    stageLabel: null,
    heartbeatText: null,
    latestEvent: null,
    progressFill: null,
    progressPercent: null,
    portal: null
  };

  let runtimeQueueStarted = false;
  let publishTimer = 0;
  let shellGuardTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
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

  function qs(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const found = readPath(path);
      if (found) return found;
    }

    return null;
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

  function scriptPresent(file) {
    if (!doc || !file) return null;
    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
  }

  function globalPresent(def) {
    return Boolean(firstGlobal(def.globals || []));
  }

  function afterFrame(callback) {
    if (isFunction(root.requestAnimationFrame)) {
      root.requestAnimationFrame(() => root.setTimeout(callback, 24));
    } else {
      root.setTimeout(callback, 48);
    }
  }

  function afterIdle(callback, timeout = 900) {
    afterFrame(() => {
      if (isFunction(root.requestIdleCallback)) {
        root.requestIdleCallback(callback, { timeout });
      } else {
        root.setTimeout(callback, 72);
      }
    });
  }

  function refreshRefs() {
    refs.main = qs("#hearth-main") || qs("[data-hearth-main='true']");
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount='true']") || qs("[data-hearth-canvas-mount]");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit='true']");
    refs.status = qs("#hearth-route-status") || qs("[data-hearth-route-status]");
    refs.receiptPanel = qs("#hearthReceiptPanel") || qs("[data-hearth-receipt-box]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.toggleButton = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showDiagnosticTab = qs("[data-hearth-south-show-diagnostic-tab]") || qs("[data-hearth-east-show-diagnostic-tab]") || qs("[data-hearth-show-diagnostic-tab]");
    refs.stageLabel = qs("[data-hearth-stage-label]");
    refs.heartbeatText = qs("[data-hearth-heartbeat-text]");
    refs.latestEvent = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");
    refs.portal = qs("#hearthMapPortal") || qs("[data-hearth-map-portal='true']");
  }

  function ensureFallbackStyle() {
    if (!doc || qs("#hearth-male-route-shell-host-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-male-route-shell-host-style";
    style.dataset.hearthMaleShellStyle = CONTRACT;
    style.textContent = `
      #hearth-main[data-hearth-shell-hosted="true"] {
        min-height: 100vh;
      }
      .hearth-shell-fallback {
        display: grid;
        gap: 1rem;
        padding: clamp(1rem, 3vw, 2rem);
        color: #eef7ff;
        background: radial-gradient(circle at 50% 18%, rgba(43, 77, 112, 0.85), rgba(8, 13, 24, 0.98) 58%, #03050b 100%);
      }
      .hearth-shell-fallback .panel,
      .hearth-shell-fallback .hearth-ledger-cockpit,
      .hearth-shell-fallback .map-portal {
        border: 1px solid rgba(185, 225, 255, 0.26);
        border-radius: 1.25rem;
        background: rgba(4, 10, 20, 0.62);
        box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
      }
      .hearth-shell-fallback .panel {
        padding: clamp(1rem, 3vw, 2rem);
      }
      .hearth-shell-fallback .kicker,
      .hearth-ledger-kicker {
        letter-spacing: 0.16em;
        text-transform: uppercase;
        opacity: 0.75;
        font-size: 0.78rem;
      }
      .hearth-shell-fallback h1 {
        margin: 0.35rem 0;
        font-size: clamp(2rem, 6vw, 4.5rem);
        line-height: 0.98;
      }
      .hearth-shell-fallback .lead {
        max-width: 68ch;
        font-size: clamp(1rem, 2vw, 1.24rem);
        line-height: 1.55;
        opacity: 0.88;
      }
      .hearth-core-layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
      }
      .hearth-globe-stage {
        position: relative;
        display: grid;
        min-height: clamp(420px, 72vh, 760px);
        place-items: center;
        overflow: hidden;
        border-radius: 1.35rem;
        border: 1px solid rgba(185, 225, 255, 0.22);
        background: radial-gradient(circle at 50% 45%, rgba(29, 58, 91, 0.32), rgba(3, 6, 13, 0.92) 58%, #01030a);
      }
      #hearthCanvasMount {
        position: absolute;
        inset: 0;
        display: grid;
        min-width: 360px;
        min-height: 360px;
        place-items: center;
        overflow: hidden;
      }
      .hearth-ledger-cockpit {
        position: relative;
        z-index: 4;
        width: min(520px, calc(100% - 2rem));
        margin: auto;
        padding: 1rem;
        justify-self: end;
        align-self: end;
        backdrop-filter: blur(14px);
      }
      .hearth-ledger-title {
        margin: 0.2rem 0 0.35rem;
        font-size: 1.08rem;
      }
      .hearth-ledger-meta,
      .hearth-ledger-latest {
        font-size: 0.84rem;
        opacity: 0.78;
      }
      .hearth-ledger-progress {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.75rem;
        align-items: center;
        margin: 0.85rem 0;
      }
      .hearth-ledger-track {
        height: 0.62rem;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
      }
      .hearth-ledger-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, rgba(148, 209, 255, 0.72), rgba(255, 255, 255, 0.88));
      }
      .hearth-ledger-actions,
      .portal-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .hearth-ledger-button,
      .portal-link {
        border: 1px solid rgba(210, 238, 255, 0.24);
        border-radius: 999px;
        padding: 0.62rem 0.82rem;
        color: inherit;
        background: rgba(255, 255, 255, 0.08);
        text-decoration: none;
        cursor: pointer;
      }
      .hearth-ledger-button.primary {
        background: rgba(185, 225, 255, 0.18);
      }
      .hearth-ledger-receipt {
        margin-top: 0.75rem;
        max-height: 260px;
        overflow: auto;
      }
      .hearth-ledger-receipt[data-visible="false"] {
        display: none;
      }
      .hearth-ledger-receipt pre,
      #hearth-route-status {
        white-space: pre-wrap;
        font-size: 0.72rem;
        line-height: 1.42;
      }
      .map-portal {
        padding: 1rem;
      }
      [data-cockpit-mode="planet-inspect"] {
        opacity: 0.42;
        transform: scale(0.92);
        pointer-events: auto;
      }
    `;

    (doc.head || doc.documentElement).appendChild(style);
  }

  function ensureShell(reason = "ensure-shell") {
    if (!doc || !doc.body) return false;

    ensureFallbackStyle();
    refreshRefs();

    let changed = false;
    let main = refs.main;

    if (!main) {
      main = doc.createElement("main");
      main.id = "hearth-main";
      main.className = "hearth-shell-fallback";
      main.dataset.hearthMain = "true";
      main.dataset.hearthShellRescuedBy = CONTRACT;
      main.innerHTML = `
        <section class="panel hero" aria-labelledby="page-title">
          <div class="kicker">Mirrorland · Survival Path</div>
          <h1 id="page-title">Hearth is the survival path inside Mirrorland.</h1>
          <p class="lead">The route shell is active. Runtime, Canvas carrier proof, material distribution, and visual evidence remain downstream-owned.</p>
        </section>
        <section class="hearth-core-layout" aria-label="Hearth route shell and object stage">
          <section id="hearthGlobeStage" class="hearth-globe-stage" data-hearth-globe-stage="true">
            <section id="hearthCanvasMount" data-hearth-canvas-mount="true" aria-label="Hearth Canvas carrier mount"></section>
            <aside id="hearthLoadCockpit" class="hearth-ledger-cockpit" data-hearth-load-cockpit="true" data-cockpit-mode="diagnostic-dock">
              <div class="hearth-ledger-head">
                <div class="hearth-ledger-kicker">Hearth · Route Shell Host</div>
                <h2 class="hearth-ledger-title">MALE SHELL HOST ACTIVE</h2>
                <div class="hearth-ledger-meta" data-hearth-stage-label>F1 · Shell observed</div>
                <div class="hearth-ledger-meta" data-hearth-heartbeat-text>runtime guarded · Canvas delegated</div>
                <div class="hearth-ledger-latest" data-hearth-latest-event>latest=SHELL_HOST_READY</div>
              </div>
              <div class="hearth-ledger-progress">
                <div class="hearth-ledger-track"><span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:8%"></span></div>
                <div class="hearth-ledger-percent" data-hearth-main-progress-percent>8%</div>
              </div>
              <div class="hearth-ledger-actions">
                <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
                <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
                <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
                <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>
              </div>
              <div id="hearthReceiptPanel" class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
                <pre data-hearth-receipt-text></pre>
              </div>
            </aside>
          </section>
          <aside id="hearthMapPortal" class="map-portal" data-hearth-map-portal="true">
            <b>Map / Portal</b>
            <div class="portal-grid">
              <a class="portal-link" href="/showroom/globe/">Return to Globe</a>
              <a class="portal-link current" href="/showroom/globe/hearth/">Hearth · Survival</a>
              <a class="portal-link" href="/gauges/">Gauges</a>
            </div>
          </aside>
        </section>
        <pre id="hearth-route-status" data-hearth-route-status hidden></pre>
      `;
      doc.body.appendChild(main);
      changed = true;
    }

    main.dataset.hearthShellHosted = "true";
    main.dataset.hearthMaleShellHostContract = CONTRACT;
    main.dataset.hearthMaleShellHostReceipt = RECEIPT;
    main.dataset.hearthShellHostReason = reason;

    if (!qs("#hearthCanvasMount")) {
      const mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthShellRescuedBy = CONTRACT;
      mount.setAttribute("aria-label", "Hearth Canvas carrier mount");
      main.appendChild(mount);
      changed = true;
    }

    if (!qs("#hearthLoadCockpit")) {
      const cockpit = doc.createElement("aside");
      cockpit.id = "hearthLoadCockpit";
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.cockpitMode = "diagnostic-dock";
      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · Route Shell Host</div>
          <h2 class="hearth-ledger-title">MALE SHELL HOST ACTIVE</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F2 · Controls restored</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>runtime guarded · Canvas delegated</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=COCKPIT_RESTORED</div>
        </div>
        <div class="hearth-ledger-progress">
          <div class="hearth-ledger-track"><span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:18%"></span></div>
          <div class="hearth-ledger-percent" data-hearth-main-progress-percent>18%</div>
        </div>
        <div class="hearth-ledger-actions">
          <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
          <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
          <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
          <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>
        </div>
        <div id="hearthReceiptPanel" class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
          <pre data-hearth-receipt-text></pre>
        </div>
      `;
      main.appendChild(cockpit);
      changed = true;
    }

    if (!qs("#hearth-route-status")) {
      const status = doc.createElement("pre");
      status.id = "hearth-route-status";
      status.dataset.hearthRouteStatus = "true";
      status.hidden = true;
      main.appendChild(status);
      changed = true;
    }

    if (!qs("#hearthMapPortal")) {
      const portal = doc.createElement("aside");
      portal.id = "hearthMapPortal";
      portal.className = "map-portal";
      portal.dataset.hearthMapPortal = "true";
      portal.innerHTML = `
        <b>Map / Portal</b>
        <div class="portal-grid">
          <a class="portal-link" href="/showroom/globe/">Return to Globe</a>
          <a class="portal-link current" href="/showroom/globe/hearth/">Hearth · Survival</a>
          <a class="portal-link" href="/gauges/">Gauges</a>
        </div>
      `;
      main.appendChild(portal);
      changed = true;
    }

    if (changed) {
      state.shellRescued = true;
      state.shellRescueCount += 1;
    }

    refreshRefs();

    state.mountPresent = Boolean(refs.mount);
    state.cockpitPresent = Boolean(refs.cockpit);
    state.statusNodePresent = Boolean(refs.status);
    state.receiptPanelPresent = Boolean(refs.receiptPanel);
    state.portalPresent = Boolean(refs.portal);
    state.carrierHostReady = Boolean(refs.mount);
    state.carrierHostPacketReady = Boolean(refs.mount);

    if (refs.mount) {
      refs.mount.dataset.hearthMaleShellHostMount = "true";
      refs.mount.dataset.hearthMaleShellHostContract = CONTRACT;
      refs.mount.dataset.hearthCanvasCarrierHostReady = "true";
      refs.mount.dataset.generatedImage = "false";
      refs.mount.dataset.graphicBox = "false";
      refs.mount.dataset.webgl = "false";
      refs.mount.dataset.visualPassClaimed = "false";
    }

    return changed;
  }

  function detectShell() {
    refreshRefs();

    const dataset = doc && doc.documentElement && doc.documentElement.dataset ? doc.documentElement.dataset : {};
    const shellContract = safeString(dataset.contract || dataset.hearthHtmlContract || dataset.hearthShellContract || "");
    const missingAnchors = DYNAMIC_ALIGNMENT_ANCHORS.filter((selector) => !qs(selector));

    const matchedMale = shellContract === EXPECTED_HTML_CONTRACT;
    const safeTransitional = shellContract === CURRENT_SAFE_HTML_CONTRACT;
    const dynamicAnchorsPass = missingAnchors.length === 0;
    const detected = Boolean(refs.main && refs.mount && refs.cockpit);

    let selectionMode = "UNSELECTED";

    if (matchedMale && dynamicAnchorsPass) {
      selectionMode = "MATCHED_MALE_HTML_PAIR";
    } else if (safeTransitional && dynamicAnchorsPass) {
      selectionMode = "SAFE_TRANSITIONAL_HTML_BRIDGE";
    } else if (dynamicAnchorsPass) {
      selectionMode = "DYNAMIC_ANCHOR_ACCEPTED_MALE_SHELL";
    } else if (matchedMale || safeTransitional) {
      selectionMode = "CONTRACT_PRESENT_ANCHORS_MISSING";
    }

    const selected = Boolean(detected && (matchedMale || safeTransitional || dynamicAnchorsPass));
    const accepted = Boolean(selected && dynamicAnchorsPass);

    state.shellContract = shellContract;
    state.shellDetected = detected;
    state.shellSelected = selected;
    state.shellAccepted = accepted;
    state.shellSelectionMode = selectionMode;
    state.dynamicAnchorsPass = dynamicAnchorsPass;
    state.missingAnchors = missingAnchors;

    if (!detected) state.shellHoldReason = "WAITING_ROUTE_SHELL_DETECTION";
    else if (!selected) state.shellHoldReason = "WAITING_MALE_ROUTE_SHELL_SELECTION";
    else if (!dynamicAnchorsPass) state.shellHoldReason = "WAITING_DYNAMIC_ALIGNMENT_ANCHORS";
    else state.shellHoldReason = "NONE";

    return {
      detected,
      selected,
      accepted,
      matchedMale,
      safeTransitional,
      dynamicAnchorsPass,
      missingAnchors,
      selectionMode,
      shellContract
    };
  }

  function applyReleaseLaw() {
    const shell = detectShell();

    state.runtimeReleaseRequestable = Boolean(shell.accepted);
    state.runtimeReleaseAuthorized = Boolean(shell.accepted);

    if (state.runtimeReleaseAuthorized) {
      if (!state.runtimeReleaseStarted) {
        state.runtimeReleaseHeldReason = "NONE_RUNTIME_RELEASE_AUTHORIZED";
        state.firstFailedCoordinate = "WAITING_RUNTIME_RELEASE_START";
        state.recommendedNextFile = FILE;
        state.recommendedNextRenewalTarget = FILE;
        state.postgameStatus = "MALE_SHELL_ACCEPTED_RUNTIME_RELEASE_AUTHORIZED";
      }

      state.activeNews = "EAST";
      state.activeFibonacci = state.runtimeReleaseStarted ? "F8" : "F5";
      state.activeFibonacciRank = state.runtimeReleaseStarted ? 8 : 5;
      state.activeStageId = state.runtimeReleaseStarted ? "F8_RUNTIME_RELEASE_ACTIVE" : "F5_MALE_SHELL_ACCEPTED";
      state.activeGearId = state.runtimeReleaseStarted ? "hearth-male-shell-runtime-release-f8" : "hearth-male-shell-accepted-f5";
      state.activeProgress = Math.max(state.activeProgress, state.runtimeReleaseStarted ? 48 : 34);
    } else {
      state.runtimeReleaseHeldReason = state.shellHoldReason;
      state.firstFailedCoordinate = state.shellHoldReason;
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.postgameStatus = state.shellHoldReason;
      state.activeNews = "EAST";
      state.activeFibonacci = shell.dynamicAnchorsPass ? "F2" : "F1";
      state.activeFibonacciRank = shell.dynamicAnchorsPass ? 2 : 1;
      state.activeStageId = shell.dynamicAnchorsPass ? "F2_DYNAMIC_ANCHORS_PRESENT" : "F1_ROUTE_SHELL_OBSERVED";
      state.activeGearId = shell.dynamicAnchorsPass ? "hearth-male-shell-anchors-f2" : "hearth-male-shell-observed-f1";
      state.activeProgress = shell.dynamicAnchorsPass ? 22 : 12;
    }

    return state.runtimeReleaseAuthorized;
  }

  function composeCarrierHostPacket() {
    refreshRefs();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "MALE_ROUTE_SHELL_CARRIER_HOST_PACKET",
      sourceFile: FILE,
      targetFile: CANVAS_PARENT_FILE,
      route: ROUTE,
      pairRole: state.pairRole,
      pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

      maleShellOwnsRouteAnchors: true,
      maleShellOwnsMountHost: true,
      maleShellOwnsControls: true,
      maleShellOwnsRuntimeScriptRelease: true,
      maleShellOwnsCanvasCarrierHostPacket: true,

      mountSelector: "#hearthCanvasMount",
      mountPresent: Boolean(refs.mount),
      cockpitPresent: Boolean(refs.cockpit),
      statusNodePresent: Boolean(refs.status),
      routeShellAccepted: state.shellAccepted,
      dynamicAnchorsPass: state.dynamicAnchorsPass,
      carrierHostReady: Boolean(refs.mount),
      carrierHostPacketReady: Boolean(refs.mount),

      macroCycle1: MACRO_CYCLE_1,
      macroCycle2: MACRO_CYCLE_2,
      activeFibonacci: "F13P",
      activeFibonacciRank: "F13P",
      activeStageId: "canvas-parent-pre-release-carrier-host",
      activeGearId: "hearth-canvas-parent-pre-release-carrier-host",

      releaseAuthorized: false,
      canvasReleaseAuthorized: false,
      westReleaseObserved: false,
      preReleaseOnly: true,
      childWorkAuthorized: false,
      f13CanvasDelegated: true,
      f21EligibleForNorth: false,
      f21ClaimedByIndex: false,
      readyTextClaimedByIndex: false,
      visualPassClaimed: false,

      ownsCanvasStructuralCarrierTruth: false,
      ownsCanvasReleaseTruth: false,
      ownsCanvasDrawing: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      createdAt: nowIso()
    };
  }

  function findCanvasParentApi() {
    const canvasDef = RUNTIME_FILES.find((item) => item.key === "canvasParent");
    return canvasDef ? firstGlobal(canvasDef.globals) : null;
  }

  function normalizeCanvasCarrierReceipt(result, api) {
    const receipt = isObject(result) && (result.contract || result.receipt || result.structuralCarrierSafeForCanvasRelease !== undefined)
      ? result
      : readReceipt(api) || {};

    const safe = Boolean(
      safeBool(receipt.structuralCarrierSafeForCanvasRelease, false) ||
      safeBool(receipt.preReleaseStructuralCarrierSafe, false) ||
      safeBool(receipt.canvasCarrierHandoffOk, false) ||
      safeBool(receipt.carrierReady, false) ||
      safeBool(receipt.canvasCarrierReady, false)
    );

    const observed = Boolean(
      receipt.contract ||
      receipt.receipt ||
      safe ||
      safeBool(receipt.preReleaseStructuralCarrierActive, false) ||
      safeBool(receipt.canvasCarrierMounted, false)
    );

    return {
      receipt,
      observed,
      safe,
      heldReason: safe
        ? "NONE_CANVAS_PRE_RELEASE_CARRIER_SAFE_FOR_WEST"
        : safeString(
            receipt.firstFailedCoordinate ||
            receipt.canvasCarrierHandoffError ||
            receipt.releaseReason ||
            "WAITING_CANVAS_PARENT_PRE_RELEASE_CARRIER",
            "WAITING_CANVAS_PARENT_PRE_RELEASE_CARRIER"
          )
    };
  }

  function requestCanvasPreReleaseCarrier(reason = "request-canvas-pre-release-carrier") {
    ensureShell(reason);

    const api = findCanvasParentApi();

    state.canvasParentObserved = Boolean(api);
    state.canvasParentApiReady = Boolean(api && (
      isFunction(api.ensurePreReleaseStructuralCarrier) ||
      isFunction(api.ensureCarrier) ||
      isFunction(api.mount) ||
      isFunction(api.getReceipt)
    ));

    if (!api || !state.canvasParentApiReady) {
      state.canvasPreReleaseCarrierRequested = false;
      state.canvasPreReleaseCarrierObserved = false;
      state.canvasPreReleaseCarrierAccepted = false;
      state.canvasPreReleaseCarrierSafeForWest = false;
      state.canvasCarrierHeldReason = "WAITING_CANVAS_PARENT_API";
      state.f13CarrierHostAvailable = Boolean(refs.mount);
      updateDataset();
      return false;
    }

    const packet = composeCarrierHostPacket();
    let result = null;

    state.canvasPreReleaseCarrierRequested = true;

    try {
      if (isFunction(api.ensurePreReleaseStructuralCarrier)) {
        result = api.ensurePreReleaseStructuralCarrier({
          mount: refs.mount,
          container: refs.mount,
          target: refs.mount,
          route: ROUTE,
          preReleaseOnly: true,
          carrierHostPacket: packet,
          sourceFile: FILE,
          requestedBy: CONTRACT
        });
      } else if (isFunction(api.ensureCarrier)) {
        result = api.ensureCarrier({
          mount: refs.mount,
          container: refs.mount,
          target: refs.mount,
          route: ROUTE,
          preReleaseOnly: true,
          carrierHostPacket: packet,
          sourceFile: FILE,
          requestedBy: CONTRACT
        });
      } else if (isFunction(api.mount)) {
        result = api.mount({
          mount: refs.mount,
          container: refs.mount,
          target: refs.mount,
          route: ROUTE,
          preReleaseOnly: true,
          carrierHostPacket: packet,
          sourceFile: FILE,
          requestedBy: CONTRACT
        });
      }
    } catch (error) {
      state.runtimeErrors.push({
        key: "canvasParentPreReleaseCarrier",
        file: CANVAS_PARENT_FILE,
        required: false,
        message: error && error.message ? error.message : String(error),
        at: nowIso()
      });

      state.canvasCarrierHeldReason = "CANVAS_PARENT_PRE_RELEASE_CARRIER_REQUEST_FAILED";
      updateDataset();
      return false;
    }

    const normalized = normalizeCanvasCarrierReceipt(result, api);

    state.canvasParentReceipt = clonePlain(normalized.receipt);
    state.canvasCarrierReceiptObserved = Boolean(normalized.receipt && (normalized.receipt.contract || normalized.receipt.receipt));
    state.canvasPreReleaseCarrierObserved = normalized.observed;
    state.canvasPreReleaseCarrierAccepted = normalized.safe;
    state.canvasPreReleaseCarrierSafeForWest = normalized.safe;
    state.canvasCarrierHeldReason = normalized.heldReason;
    state.f13CarrierHostAvailable = Boolean(refs.mount);

    if (normalized.safe) {
      state.firstFailedCoordinate = state.runtimeReleaseComplete
        ? "WAITING_DOWNSTREAM_MATERIAL_OR_CANVAS_F13_EVIDENCE"
        : "WAITING_RUNTIME_RELEASE_COMPLETION";
      state.recommendedNextFile = state.runtimeReleaseComplete ? PAIRED_ROUTE_CONDUCTOR_FILE : FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
    }

    updateDataset();
    return normalized.safe;
  }

  function bindControls() {
    refreshRefs();

    if (refs.copyButton && refs.copyButton.dataset.hearthMaleShellHostBound !== "true") {
      refs.copyButton.dataset.hearthMaleShellHostBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.toggleButton.dataset.hearthMaleShellHostBound !== "true") {
      refs.toggleButton.dataset.hearthMaleShellHostBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        refreshRefs();

        if (!refs.receiptPanel) return;

        const visible = refs.receiptPanel.dataset.visible !== "true";
        refs.receiptPanel.dataset.visible = String(visible);

        if (refs.toggleButton) {
          refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
        }

        if (refs.receiptText) {
          refs.receiptText.textContent = visible ? getReceiptText() : "";
        }
      });
    }

    if (refs.inspectButton && refs.inspectButton.dataset.hearthMaleShellHostBound !== "true") {
      refs.inspectButton.dataset.hearthMaleShellHostBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const html = doc && doc.documentElement ? doc.documentElement : null;
        const active = !(html && html.dataset.hearthSouthPlanetInspect === "true");

        if (html) {
          html.dataset.hearthSouthPlanetInspect = String(active);
          html.dataset.hearthEastInspectReservedActive = String(active);
          html.dataset.hearthMaleShellInspectIntent = String(active);
        }

        if (refs.cockpit) {
          refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";
        }

        if (refs.inspectButton) {
          refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
        }

        if (refs.showDiagnosticTab) {
          refs.showDiagnosticTab.hidden = !active;
          refs.showDiagnosticTab.dataset.visible = String(active);
        }

        state.postgameStatus = active ? "MALE_SHELL_INSPECT_INTENT_ACTIVE" : "MALE_SHELL_DIAGNOSTIC_DOCK_ACTIVE";
        schedulePublish("inspect-toggle");
      });
    }

    if (refs.collapseButton && refs.collapseButton.dataset.hearthMaleShellHostBound !== "true") {
      refs.collapseButton.dataset.hearthMaleShellHostBound = "true";
      refs.collapseButton.addEventListener("click", () => {
        if (!refs.cockpit) return;

        const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
        refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";
        refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
      });
    }

    if (refs.showDiagnosticTab && refs.showDiagnosticTab.dataset.hearthMaleShellHostBound !== "true") {
      refs.showDiagnosticTab.dataset.hearthMaleShellHostBound = "true";
      refs.showDiagnosticTab.addEventListener("click", () => {
        const html = doc && doc.documentElement ? doc.documentElement : null;

        if (html) {
          html.dataset.hearthSouthPlanetInspect = "false";
          html.dataset.hearthEastInspectReservedActive = "false";
          html.dataset.hearthMaleShellInspectIntent = "false";
        }

        if (refs.cockpit) refs.cockpit.dataset.cockpitMode = "diagnostic-dock";
        refs.showDiagnosticTab.hidden = true;

        if (refs.inspectButton) refs.inspectButton.textContent = "Inspect planet";

        state.postgameStatus = "MALE_SHELL_DIAGNOSTIC_DOCK_ACTIVE";
        schedulePublish("show-diagnostic");
      });
    }

    state.shellControlsBound = Boolean(refs.copyButton && refs.toggleButton && refs.inspectButton);

    if (state.shellControlsBound && state.shellAccepted && !state.runtimeReleaseStarted) {
      state.activeFibonacci = "F3";
      state.activeFibonacciRank = 3;
      state.activeStageId = "F3_SHELL_CONTROLS_BOUND";
      state.activeGearId = "hearth-male-shell-controls-f3";
      state.activeProgress = Math.max(state.activeProgress, 28);
    }

    updateDataset();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();
    let ok = false;

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        ok = true;
      } else if (doc) {
        const area = doc.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        doc.body.appendChild(area);
        area.select();
        ok = doc.execCommand("copy");
        area.remove();
      }
    } catch (error) {
      state.runtimeErrors.push({
        key: "copyDiagnostic",
        file: FILE,
        required: false,
        message: error && error.message ? error.message : String(error),
        at: nowIso()
      });
    }

    if (refs.copyButton) {
      refs.copyButton.textContent = ok ? "Copied" : "Copy held";
      root.setTimeout(() => {
        if (refs.copyButton) refs.copyButton.textContent = "Copy diagnostic";
      }, 900);
    }

    return ok;
  }

  function setRuntimeHold(reason, file = FILE, key = "") {
    state.runtimeHeld = true;
    state.runtimeReleaseHeldReason = reason || "RUNTIME_HELD";
    state.firstFailedCoordinate = reason || "RUNTIME_HELD";
    state.recommendedNextFile = file || FILE;
    state.recommendedNextRenewalTarget = file || FILE;
    state.postgameStatus = reason || "RUNTIME_HELD";

    if (file && !state.runtimeHeldFiles.includes(file)) {
      state.runtimeHeldFiles.push(file);
    }

    if (key) {
      state.currentRuntimeKey = key;
      state.currentRuntimeFile = file;
    }
  }

  function appendScript(def) {
    return new Promise((resolve) => {
      const existing = scriptPresent(def.file);
      const alreadyGlobal = globalPresent(def);

      if (alreadyGlobal) {
        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);
        resolve({ ok: true, existing: true, global: true, def });
        return;
      }

      if (existing) {
        existing.dataset.hearthMaleShellHostObserved = CONTRACT;

        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

        resolve({ ok: true, existing: true, global: false, def });
        return;
      }

      if (!doc || !doc.head) {
        resolve({ ok: false, existing: false, global: false, def, error: "document.head unavailable" });
        return;
      }

      const script = doc.createElement("script");
      const separator = def.file.includes("?") ? "&" : "?";

      script.src = `${def.file}${separator}v=${encodeURIComponent(`${CONTRACT}-${VERSION}`)}`;
      script.async = false;
      script.defer = true;
      script.dataset.loadedBy = CONTRACT;
      script.dataset.hearthMaleShellRuntimeRelease = "true";
      script.dataset.hearthRuntimeKey = def.key;
      script.dataset.hearthRuntimeNews = def.news;
      script.dataset.hearthRuntimeFibonacci = def.fibonacci;
      script.dataset.hearthCanvasF13Delegated = "true";
      script.dataset.hearthF21NorthOnly = "true";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      let settled = false;

      function finish(result) {
        if (settled) return;
        settled = true;
        resolve(result);
      }

      script.onload = () => {
        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

        afterFrame(() => {
          ensureShell(`SHELL_GUARD_AFTER_${def.key.toUpperCase()}`);
          bindControls();

          if (def.carrierPreflightAfter) {
            requestCanvasPreReleaseCarrier(`carrier-preflight-after-${def.key}`);
          }

          finish({ ok: true, existing: false, global: globalPresent(def), def });
        });
      };

      script.onerror = () => {
        finish({
          ok: false,
          existing: false,
          global: false,
          def,
          error: `${def.file} failed to load`
        });
      };

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (settled) return;

        const hasScript = Boolean(scriptPresent(def.file));
        const hasGlobal = globalPresent(def);

        if (hasScript || hasGlobal) {
          if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

          if (def.carrierPreflightAfter) {
            requestCanvasPreReleaseCarrier(`carrier-preflight-timeout-settled-${def.key}`);
          }

          finish({ ok: true, existing: hasScript, global: hasGlobal, timeoutSettled: true, def });
        } else {
          finish({
            ok: false,
            existing: false,
            global: false,
            timeoutSettled: true,
            def,
            error: `${def.file} timed out`
          });
        }
      }, def.required ? 4600 : 3800);
    });
  }

  async function releaseRuntimeQueue() {
    if (runtimeQueueStarted || state.runtimeReleaseStarted) return getReceipt();
    if (!applyReleaseLaw()) return getReceipt();

    runtimeQueueStarted = true;
    state.runtimeReleaseRequested = true;
    state.runtimeReleaseStarted = true;
    state.runtimeReleaseComplete = false;
    state.runtimeHeld = false;
    state.runtimeReleaseHeldReason = "RUNTIME_RELEASE_STARTED";
    state.activeNews = "EAST";
    state.activeFibonacci = "F8";
    state.activeFibonacciRank = 8;
    state.activeStageId = "F8_RUNTIME_RELEASE_STARTED";
    state.activeGearId = "hearth-male-shell-runtime-release-f8";
    state.activeProgress = 44;
    state.postgameStatus = "RUNTIME_RELEASE_STARTED";
    state.firstFailedCoordinate = "RUNTIME_RELEASE_IN_PROGRESS";
    schedulePublish("runtime-release-started");

    for (let i = 0; i < RUNTIME_FILES.length; i += 1) {
      const def = RUNTIME_FILES[i];

      state.currentRuntimeKey = def.key;
      state.currentRuntimeFile = def.file;
      state.activeNews = def.news;
      state.activeFibonacci = def.fibonacci;
      state.activeFibonacciRank = def.fibonacci;
      state.activeStageId = `${def.fibonacci}_${def.key}`;
      state.activeGearId = `hearth-${def.key}`;
      state.activeProgress = clamp(46 + i * 7, 46, 88);
      state.postgameStatus = `LOADING_${def.key.toUpperCase()}`;
      schedulePublish(`loading-${def.key}`);

      await new Promise((resolve) => afterIdle(resolve, 1000));

      const result = await appendScript(def);

      if (!result.ok) {
        const error = {
          key: def.key,
          file: def.file,
          required: def.required === true,
          message: result.error || "runtime file load failed",
          at: nowIso()
        };

        state.runtimeErrors.push(error);

        setRuntimeHold(
          def.required ? "RUNTIME_REQUIRED_FILE_LOAD_FAILED" : "RUNTIME_OPTIONAL_FILE_LOAD_FAILED",
          def.file,
          def.key
        );

        schedulePublish(`runtime-held-${def.key}`);

        if (def.required) break;
      } else {
        if (!state.runtimeLoaded.includes(def.file)) state.runtimeLoaded.push(def.file);

        state.runtimeReleaseHeldReason = "RUNTIME_RELEASE_IN_PROGRESS";
        state.firstFailedCoordinate = "RUNTIME_RELEASE_IN_PROGRESS";
        state.postgameStatus = `LOADED_${def.key.toUpperCase()}`;

        if (def.key === "canvasParent") {
          state.canvasParentLoadedBeforeWest = !state.runtimeLoaded.includes(WEST_RUNTIME_FILE);
          requestCanvasPreReleaseCarrier("canvas-parent-loaded-before-west-admissibility");
        }

        ensureShell(`SHELL_GUARD_LOADED_${def.key.toUpperCase()}`);
        bindControls();
        schedulePublish(`runtime-loaded-${def.key}`);
      }

      await new Promise((resolve) => root.setTimeout(resolve, 80));
    }

    requestCanvasPreReleaseCarrier("runtime-queue-settled-carrier-proof-refresh");

    if (state.runtimeErrors.some((item) => item.required === true)) {
      state.runtimeReleaseComplete = false;
      state.runtimeHeld = true;
      state.activeNews = "EAST";
      state.activeFibonacci = "F8";
      state.activeFibonacciRank = 8;
      state.activeStageId = "F8_RUNTIME_RELEASE_HELD_REQUIRED_FILE";
      state.activeGearId = "hearth-male-shell-runtime-held-f8";
      state.activeProgress = 58;
      state.postgameStatus = "RUNTIME_RELEASE_HELD_REQUIRED_FILE";
    } else {
      state.runtimeReleaseComplete = true;
      state.runtimeHeld = state.runtimeErrors.length > 0;
      state.runtimeReleaseHeldReason = state.runtimeErrors.length > 0
        ? "RUNTIME_RELEASE_COMPLETE_WITH_OPTIONAL_HOLDS"
        : "NONE_RUNTIME_RELEASE_COMPLETE";

      state.activeNews = "CANVAS";
      state.activeFibonacci = "F13";
      state.activeFibonacciRank = 13;
      state.activeStageId = state.canvasPreReleaseCarrierSafeForWest
        ? "F13_CANVAS_PRE_RELEASE_CARRIER_SAFE_FOR_WEST"
        : "F13_CANVAS_PRE_RELEASE_CARRIER_REQUESTED";
      state.activeGearId = "hearth-canvas-carrier-host-f13";
      state.activeProgress = state.canvasPreReleaseCarrierSafeForWest ? 88 : 78;

      state.firstFailedCoordinate = state.canvasPreReleaseCarrierSafeForWest
        ? "WAITING_DOWNSTREAM_CANVAS_OR_MATERIAL_EXPRESSION"
        : state.canvasCarrierHeldReason;

      state.recommendedNextFile = state.canvasPreReleaseCarrierSafeForWest
        ? PAIRED_ROUTE_CONDUCTOR_FILE
        : CANVAS_PARENT_FILE;

      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.postgameStatus = state.canvasPreReleaseCarrierSafeForWest
        ? "RUNTIME_RELEASE_COMPLETE_CANVAS_CARRIER_SAFE_FOR_WEST"
        : "RUNTIME_RELEASE_COMPLETE_WAITING_CANVAS_PRE_RELEASE_CARRIER";
    }

    state.settled = true;
    state.booted = true;
    schedulePublish("runtime-release-settled");

    return getReceipt();
  }

  function updateVisualShell(message = "") {
    refreshRefs();

    if (refs.stageLabel) refs.stageLabel.textContent = `${state.activeFibonacci} · ${state.activeStageId}`;
    if (refs.heartbeatText) {
      refs.heartbeatText.textContent = message || [
        `shell=${state.shellAccepted}`,
        `carrierHost=${state.carrierHostReady}`,
        `canvasPreRelease=${state.canvasPreReleaseCarrierSafeForWest}`,
        `runtime=${state.runtimeReleaseComplete}`,
        "f21=north-only"
      ].join(" · ");
    }
    if (refs.latestEvent) refs.latestEvent.textContent = `latest=${state.postgameStatus}`;
    if (refs.progressFill) refs.progressFill.style.width = `${clamp(state.activeProgress, 0, 100)}%`;
    if (refs.progressPercent) refs.progressPercent.textContent = `${Math.round(clamp(state.activeProgress, 0, 100))}%`;

    if (refs.cockpit) {
      refs.cockpit.dataset.hearthMaleShellHostActive = "true";
      refs.cockpit.dataset.hearthMaleShellHostContract = CONTRACT;
      refs.cockpit.dataset.hearthShellAccepted = String(state.shellAccepted);
      refs.cockpit.dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
      refs.cockpit.dataset.hearthCanvasPreReleaseCarrierSafeForWest = String(state.canvasPreReleaseCarrierSafeForWest);
      refs.cockpit.dataset.generatedImage = "false";
      refs.cockpit.dataset.graphicBox = "false";
      refs.cockpit.dataset.webgl = "false";
      refs.cockpit.dataset.visualPassClaimed = "false";
    }

    if (refs.status) refs.status.textContent = getReceiptText();

    if (refs.receiptPanel && refs.receiptText && refs.receiptPanel.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    state.renderWriteCount += 1;
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthMaleShellHostLoaded = "true";
    dataset.hearthMaleShellHostContract = CONTRACT;
    dataset.hearthMaleShellHostReceipt = RECEIPT;
    dataset.hearthMaleShellHostVersion = VERSION;
    dataset.hearthMaleShellHostFile = FILE;
    dataset.hearthMaleShellHostRoute = ROUTE;

    dataset.hearthPairRole = state.pairRole;
    dataset.hearthPairedRouteConductorFile = PAIRED_ROUTE_CONDUCTOR_FILE;
    dataset.hearthPairedRouteConductorRole = state.pairedRouteConductorRole;

    dataset.hearthMaleShellOwnsRouteAnchors = "true";
    dataset.hearthMaleShellOwnsMountHost = "true";
    dataset.hearthMaleShellOwnsControls = "true";
    dataset.hearthMaleShellOwnsRuntimeScriptRelease = "true";
    dataset.hearthMaleShellOwnsCanvasCarrierHostPacket = "true";
    dataset.hearthMaleShellOwnsCanvasStructuralCarrierTruth = "false";
    dataset.hearthMaleShellOwnsCanvasReleaseTruth = "false";
    dataset.hearthMaleShellOwnsCanvasDrawing = "false";
    dataset.hearthMaleShellOwnsMaterialTruth = "false";
    dataset.hearthMaleShellOwnsPlanetTruth = "false";
    dataset.hearthMaleShellOwnsF21 = "false";

    dataset.hearthExpectedHtmlContract = EXPECTED_HTML_CONTRACT;
    dataset.hearthCurrentSafeHtmlContract = CURRENT_SAFE_HTML_CONTRACT;
    dataset.hearthShellContract = state.shellContract;
    dataset.hearthShellDetected = String(state.shellDetected);
    dataset.hearthShellSelected = String(state.shellSelected);
    dataset.hearthShellAccepted = String(state.shellAccepted);
    dataset.hearthShellSelectionMode = state.shellSelectionMode;
    dataset.hearthShellHoldReason = state.shellHoldReason;
    dataset.hearthDynamicAnchorsPass = String(state.dynamicAnchorsPass);
    dataset.hearthMissingAnchors = state.missingAnchors.join(",");

    dataset.hearthMountPresent = String(state.mountPresent);
    dataset.hearthCockpitPresent = String(state.cockpitPresent);
    dataset.hearthStatusNodePresent = String(state.statusNodePresent);
    dataset.hearthCarrierHostReady = String(state.carrierHostReady);
    dataset.hearthCarrierHostPacketReady = String(state.carrierHostPacketReady);

    dataset.hearthCanvasParentObserved = String(state.canvasParentObserved);
    dataset.hearthCanvasParentApiReady = String(state.canvasParentApiReady);
    dataset.hearthCanvasParentLoadedBeforeWest = String(state.canvasParentLoadedBeforeWest);
    dataset.hearthCanvasPreReleaseCarrierRequested = String(state.canvasPreReleaseCarrierRequested);
    dataset.hearthCanvasPreReleaseCarrierObserved = String(state.canvasPreReleaseCarrierObserved);
    dataset.hearthCanvasPreReleaseCarrierAccepted = String(state.canvasPreReleaseCarrierAccepted);
    dataset.hearthCanvasPreReleaseCarrierSafeForWest = String(state.canvasPreReleaseCarrierSafeForWest);
    dataset.hearthCanvasCarrierHeldReason = state.canvasCarrierHeldReason;

    dataset.hearthRuntimeReleaseRequestable = String(state.runtimeReleaseRequestable);
    dataset.hearthRuntimeReleaseRequested = String(state.runtimeReleaseRequested);
    dataset.hearthRuntimeReleaseAuthorized = String(state.runtimeReleaseAuthorized);
    dataset.hearthRuntimeReleaseStarted = String(state.runtimeReleaseStarted);
    dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
    dataset.hearthRuntimeHeld = String(state.runtimeHeld);
    dataset.hearthRuntimeReleaseHeldReason = state.runtimeReleaseHeldReason;
    dataset.hearthRuntimeLoaded = state.runtimeLoaded.join(",");
    dataset.hearthRuntimeHeldFiles = state.runtimeHeldFiles.join(",");
    dataset.hearthCurrentRuntimeKey = state.currentRuntimeKey;
    dataset.hearthCurrentRuntimeFile = state.currentRuntimeFile;

    dataset.hearthNewsAlignmentActive = "true";
    dataset.hearthFibonacciSynchronizationActive = "true";
    dataset.hearthMacroCycle1 = MACRO_CYCLE_1;
    dataset.hearthMacroCycle2 = MACRO_CYCLE_2;
    dataset.hearthActiveNews = state.activeNews;
    dataset.hearthActiveFibonacci = state.activeFibonacci;
    dataset.hearthActiveFibonacciRank = String(state.activeFibonacciRank);
    dataset.hearthActiveStageId = state.activeStageId;
    dataset.hearthActiveGearId = state.activeGearId;
    dataset.hearthActiveProgress = String(state.activeProgress);
    dataset.hearthOneActiveGearAtATime = "true";

    dataset.hearthF13CanvasDelegated = "true";
    dataset.hearthF13CarrierHostAvailable = String(state.f13CarrierHostAvailable);
    dataset.hearthF13CanvasEvidenceOwnedByCanvas = "true";
    dataset.hearthF21NorthOnly = "true";
    dataset.hearthF21EligibleForNorth = "false";
    dataset.hearthF21SubmittedToNorth = "false";
    dataset.hearthF21ClaimedByIndex = "false";
    dataset.hearthReadyTextAllowed = "false";
    dataset.hearthReadyTextClaimedByIndex = "false";

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextFile = state.recommendedNextFile;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.hearthPostgameStatus = state.postgameStatus;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.maleRouteShellHost = api;
    root.HEARTH.routeShellHost = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexJs = api;
    root.HEARTH.dynamicSelectorRuntimeRelease = api;
    root.HEARTH.eastSouthPairFemaleSelector = api;

    root.DEXTER_LAB.hearthMaleRouteShellHost = api;
    root.DEXTER_LAB.hearthRouteShellHost = api;
    root.DEXTER_LAB.hearthDynamicSelectorRuntimeRelease = api;
    root.DEXTER_LAB.hearthEastSouthPairFemaleSelector = api;

    root.HEARTH_MALE_ROUTE_SHELL_HOST = api;
    root.HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST = api;
    root.HEARTH_ROUTE_SHELL_HOST = api;
    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;

    root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
    root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;

    const receipt = getReceipt();

    root.HEARTH_MALE_ROUTE_SHELL_HOST_RECEIPT = receipt;
    root.HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST_RECEIPT = receipt;
    root.HEARTH_INDEX_JS_RECEIPT = receipt;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = receipt;
  }

  function schedulePublish(message = "") {
    if (publishTimer) return;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishState(message);
    }, 70);
  }

  function publishState(message = "") {
    state.updatedAt = nowIso();

    updateDataset();
    updateVisualShell(message);
    publishGlobals();

    state.receiptWriteCount += 1;
  }

  function startShellGuard() {
    if (shellGuardTimer) root.clearInterval(shellGuardTimer);

    let ticks = 0;

    shellGuardTimer = root.setInterval(() => {
      ticks += 1;

      ensureShell("SHELL_GUARD_INTERVAL");
      detectShell();
      bindControls();
      applyReleaseLaw();

      if (findCanvasParentApi()) {
        requestCanvasPreReleaseCarrier("SHELL_GUARD_CANVAS_CARRIER_REFRESH");
      }

      schedulePublish("shell-guard");

      if (state.settled || ticks >= 30) {
        root.clearInterval(shellGuardTimer);
        shellGuardTimer = 0;
      }
    }, 1000);
  }

  function boot() {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    ensureShell("BOOT_MALE_ROUTE_SHELL_HOST");
    detectShell();
    bindControls();
    applyReleaseLaw();
    requestCanvasPreReleaseCarrier("BOOT_EXISTING_CANVAS_PARENT_PREFLIGHT");
    publishState("boot");

    startShellGuard();

    if (state.runtimeReleaseAuthorized) {
      afterIdle(() => {
        releaseRuntimeQueue();
      }, 900);
    }

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (shellGuardTimer) {
      root.clearInterval(shellGuardTimer);
      shellGuardTimer = 0;
    }

    if (publishTimer) {
      root.clearTimeout(publishTimer);
      publishTimer = 0;
    }

    state.settled = true;
    state.postgameStatus = `DISPOSED_${reason}`;
    publishState("dispose");

    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      pairRole: state.pairRole,
      pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,
      pairedRouteConductorRole: state.pairedRouteConductorRole,
      maleShellOwnsRouteAnchors: true,
      maleShellOwnsMountHost: true,
      maleShellOwnsControls: true,
      maleShellOwnsRuntimeScriptRelease: true,
      maleShellOwnsCanvasCarrierHostPacket: true,

      ownsMacroWestTruth: false,
      ownsCanvasStructuralCarrierTruth: false,
      ownsCanvasReleaseTruth: false,
      ownsCanvasDrawing: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsPlanetTruth: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      currentSafeHtmlContract: CURRENT_SAFE_HTML_CONTRACT,
      shellContract: state.shellContract,
      shellDetected: state.shellDetected,
      shellSelected: state.shellSelected,
      shellAccepted: state.shellAccepted,
      shellSelectionMode: state.shellSelectionMode,
      shellHoldReason: state.shellHoldReason,
      dynamicAnchorsPass: state.dynamicAnchorsPass,
      missingAnchors: state.missingAnchors.slice(),
      shellControlsBound: state.shellControlsBound,
      shellRescued: state.shellRescued,
      shellRescueCount: state.shellRescueCount,

      mountPresent: state.mountPresent,
      cockpitPresent: state.cockpitPresent,
      statusNodePresent: state.statusNodePresent,
      receiptPanelPresent: state.receiptPanelPresent,
      portalPresent: state.portalPresent,
      carrierHostReady: state.carrierHostReady,
      carrierHostPacketReady: state.carrierHostPacketReady,

      canvasParentObserved: state.canvasParentObserved,
      canvasParentApiReady: state.canvasParentApiReady,
      canvasParentLoadedBeforeWest: state.canvasParentLoadedBeforeWest,
      canvasPreReleaseCarrierRequested: state.canvasPreReleaseCarrierRequested,
      canvasPreReleaseCarrierObserved: state.canvasPreReleaseCarrierObserved,
      canvasPreReleaseCarrierAccepted: state.canvasPreReleaseCarrierAccepted,
      canvasPreReleaseCarrierSafeForWest: state.canvasPreReleaseCarrierSafeForWest,
      canvasCarrierReceiptObserved: state.canvasCarrierReceiptObserved,
      canvasCarrierHeldReason: state.canvasCarrierHeldReason,
      canvasParentReceipt: clonePlain(state.canvasParentReceipt),

      runtimeReleaseRequestable: state.runtimeReleaseRequestable,
      runtimeReleaseRequested: state.runtimeReleaseRequested,
      runtimeReleaseAuthorized: state.runtimeReleaseAuthorized,
      runtimeReleaseStarted: state.runtimeReleaseStarted,
      runtimeReleaseComplete: state.runtimeReleaseComplete,
      runtimeHeld: state.runtimeHeld,
      runtimeReleaseHeldReason: state.runtimeReleaseHeldReason,
      runtimeLoaded: state.runtimeLoaded.slice(),
      runtimeHeldFiles: state.runtimeHeldFiles.slice(),
      runtimeErrors: clonePlain(state.runtimeErrors),
      currentRuntimeKey: state.currentRuntimeKey,
      currentRuntimeFile: state.currentRuntimeFile,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      macroCycle1: MACRO_CYCLE_1,
      macroCycle2: MACRO_CYCLE_2,
      activeNews: state.activeNews,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeProgress: state.activeProgress,
      oneActiveGearAtATime: true,

      f13CanvasDelegated: true,
      f13CarrierHostAvailable: state.f13CarrierHostAvailable,
      f13CanvasEvidenceOwnedByCanvas: true,
      f21NorthOnly: true,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByIndex: false,
      readyTextAllowed: false,
      readyTextClaimedByIndex: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      dynamicAlignmentAnchors: DYNAMIC_ALIGNMENT_ANCHORS.slice(),
      runtimeFiles: RUNTIME_FILES.map((item) => ({
        key: item.key,
        label: item.label,
        news: item.news,
        fibonacci: item.fibonacci,
        file: item.file,
        required: item.required,
        carrierPreflightAfter: item.carrierPreflightAfter
      })),

      renderWriteCount: state.renderWriteCount,
      receiptWriteCount: state.receiptWriteCount,
      bootStarted: state.bootStarted,
      booted: state.booted,
      settled: state.settled,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      "",
      "PAIR",
      `pairRole=${r.pairRole}`,
      `pairedRouteConductorFile=${r.pairedRouteConductorFile}`,
      `pairedRouteConductorRole=${r.pairedRouteConductorRole}`,
      `maleShellOwnsRouteAnchors=${r.maleShellOwnsRouteAnchors}`,
      `maleShellOwnsMountHost=${r.maleShellOwnsMountHost}`,
      `maleShellOwnsControls=${r.maleShellOwnsControls}`,
      `maleShellOwnsRuntimeScriptRelease=${r.maleShellOwnsRuntimeScriptRelease}`,
      `maleShellOwnsCanvasCarrierHostPacket=${r.maleShellOwnsCanvasCarrierHostPacket}`,
      "",
      "SHELL",
      `shellDetected=${r.shellDetected}`,
      `shellSelected=${r.shellSelected}`,
      `shellAccepted=${r.shellAccepted}`,
      `shellContract=${r.shellContract}`,
      `shellSelectionMode=${r.shellSelectionMode}`,
      `shellHoldReason=${r.shellHoldReason}`,
      `dynamicAnchorsPass=${r.dynamicAnchorsPass}`,
      `missingAnchors=${r.missingAnchors.join(",")}`,
      `shellControlsBound=${r.shellControlsBound}`,
      `shellRescued=${r.shellRescued}`,
      `shellRescueCount=${r.shellRescueCount}`,
      "",
      "CARRIER_HOST",
      `mountPresent=${r.mountPresent}`,
      `cockpitPresent=${r.cockpitPresent}`,
      `statusNodePresent=${r.statusNodePresent}`,
      `receiptPanelPresent=${r.receiptPanelPresent}`,
      `portalPresent=${r.portalPresent}`,
      `carrierHostReady=${r.carrierHostReady}`,
      `carrierHostPacketReady=${r.carrierHostPacketReady}`,
      "",
      "CANVAS_PRE_RELEASE",
      `canvasParentObserved=${r.canvasParentObserved}`,
      `canvasParentApiReady=${r.canvasParentApiReady}`,
      `canvasParentLoadedBeforeWest=${r.canvasParentLoadedBeforeWest}`,
      `canvasPreReleaseCarrierRequested=${r.canvasPreReleaseCarrierRequested}`,
      `canvasPreReleaseCarrierObserved=${r.canvasPreReleaseCarrierObserved}`,
      `canvasPreReleaseCarrierAccepted=${r.canvasPreReleaseCarrierAccepted}`,
      `canvasPreReleaseCarrierSafeForWest=${r.canvasPreReleaseCarrierSafeForWest}`,
      `canvasCarrierReceiptObserved=${r.canvasCarrierReceiptObserved}`,
      `canvasCarrierHeldReason=${r.canvasCarrierHeldReason}`,
      "",
      "RUNTIME",
      `runtimeReleaseRequestable=${r.runtimeReleaseRequestable}`,
      `runtimeReleaseRequested=${r.runtimeReleaseRequested}`,
      `runtimeReleaseAuthorized=${r.runtimeReleaseAuthorized}`,
      `runtimeReleaseStarted=${r.runtimeReleaseStarted}`,
      `runtimeReleaseComplete=${r.runtimeReleaseComplete}`,
      `runtimeHeld=${r.runtimeHeld}`,
      `runtimeReleaseHeldReason=${r.runtimeReleaseHeldReason}`,
      `currentRuntimeKey=${r.currentRuntimeKey}`,
      `currentRuntimeFile=${r.currentRuntimeFile}`,
      `runtimeLoaded=${r.runtimeLoaded.join(",")}`,
      `runtimeHeldFiles=${r.runtimeHeldFiles.join(",")}`,
      `runtimeErrors=${r.runtimeErrors.map((error) => `${error.key || ""}:${error.file || ""}:${error.message || ""}`).join(" | ")}`,
      "",
      "NEWS_FIBONACCI",
      `newsAlignmentActive=${r.newsAlignmentActive}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `macroCycle1=${r.macroCycle1}`,
      `macroCycle2=${r.macroCycle2}`,
      `activeNews=${r.activeNews}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeProgress=${r.activeProgress}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      "F13_F21_BOUNDARY",
      `f13CanvasDelegated=${r.f13CanvasDelegated}`,
      `f13CarrierHostAvailable=${r.f13CarrierHostAvailable}`,
      `f13CanvasEvidenceOwnedByCanvas=${r.f13CanvasEvidenceOwnedByCanvas}`,
      `f21NorthOnly=${r.f21NorthOnly}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21ClaimedByIndex=${r.f21ClaimedByIndex}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `readyTextClaimedByIndex=${r.readyTextClaimedByIndex}`,
      "",
      "OWNERSHIP_BOUNDARY",
      `ownsMacroWestTruth=${r.ownsMacroWestTruth}`,
      `ownsCanvasStructuralCarrierTruth=${r.ownsCanvasStructuralCarrierTruth}`,
      `ownsCanvasReleaseTruth=${r.ownsCanvasReleaseTruth}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsHydrologyTruth=${r.ownsHydrologyTruth}`,
      `ownsElevationTruth=${r.ownsElevationTruth}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsF21=${r.ownsF21}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `startedAt=${r.startedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  if (isFunction(root.addEventListener)) {
    root.addEventListener("error", (event) => {
      const filename = safeString(event && event.filename, "");
      const runtimeMatch = RUNTIME_FILES.find((item) => filename.includes(item.file));

      if (!runtimeMatch) return;

      const error = {
        key: runtimeMatch.key,
        file: runtimeMatch.file,
        required: runtimeMatch.required === true,
        message: event && event.message ? event.message : "runtime execution error",
        at: nowIso()
      };

      state.runtimeErrors.push(error);

      setRuntimeHold(
        runtimeMatch.required ? "RUNTIME_REQUIRED_FILE_EXECUTION_ERROR" : "RUNTIME_OPTIONAL_FILE_EXECUTION_ERROR",
        runtimeMatch.file,
        runtimeMatch.key
      );

      ensureShell("SHELL_GUARD_RUNTIME_ERROR");
      bindControls();
      schedulePublish("runtime-error");
    }, true);

    root.addEventListener("unhandledrejection", (event) => {
      const message = event && event.reason && event.reason.message
        ? event.reason.message
        : safeString(event && event.reason, "unhandled runtime rejection");

      state.runtimeErrors.push({
        key: state.currentRuntimeKey || "unhandledrejection",
        file: state.currentRuntimeFile || FILE,
        required: false,
        message,
        at: nowIso()
      });

      ensureShell("SHELL_GUARD_UNHANDLED_REJECTION");
      bindControls();
      schedulePublish("runtime-rejection");
    }, true);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    EXPECTED_HTML_CONTRACT,
    CURRENT_SAFE_HTML_CONTRACT,
    MACRO_CYCLE_1,
    MACRO_CYCLE_2,
    DYNAMIC_ALIGNMENT_ANCHORS,
    RUNTIME_FILES,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    ensureShell,
    detectShell,
    applyReleaseLaw,
    bindControls,
    releaseRuntimeQueue,
    requestCanvasPreReleaseCarrier,
    composeCarrierHostPacket,
    findCanvasParentApi,
    publishState,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    pairRole: "male-route-shell-host",
    pairedRouteConductorFile: PAIRED_ROUTE_CONDUCTOR_FILE,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    f13CanvasDelegated: true,
    f21NorthOnly: true,
    f21EligibleForNorth: false,
    f21ClaimedByIndex: false,
    readyTextAllowed: false,
    readyTextClaimedByIndex: false,

    ownsRouteAnchors: true,
    ownsMountHost: true,
    ownsControls: true,
    ownsRuntimeScriptRelease: true,
    ownsCanvasCarrierHostPacket: true,
    ownsMacroWestTruth: false,
    ownsCanvasStructuralCarrierTruth: false,
    ownsCanvasReleaseTruth: false,
    ownsCanvasDrawing: false,
    ownsMaterialTruth: false,
    ownsPlanetTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.DEXTER_LAB = root.DEXTER_LAB || {};

  root.HEARTH.maleRouteShellHost = api;
  root.HEARTH.routeShellHost = api;
  root.HEARTH.indexBridge = api;
  root.HEARTH.indexJs = api;
  root.HEARTH.dynamicSelectorRuntimeRelease = api;
  root.HEARTH.eastSouthPairFemaleSelector = api;

  root.DEXTER_LAB.hearthMaleRouteShellHost = api;
  root.DEXTER_LAB.hearthRouteShellHost = api;
  root.DEXTER_LAB.hearthDynamicSelectorRuntimeRelease = api;

  root.HEARTH_MALE_ROUTE_SHELL_HOST = api;
  root.HEARTH_MALE_ROUTE_SHELL_PRE_RELEASE_CARRIER_RUNTIME_HOST = api;
  root.HEARTH_ROUTE_SHELL_HOST = api;
  root.HEARTH_INDEX_JS = api;
  root.HEARTH_INDEX_BRIDGE = api;
  root.HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR = api;
  root.HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE = api;

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
